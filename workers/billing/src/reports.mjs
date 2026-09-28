/**
 * Bug reports: submitting them and listing your own (DESIGN-v3).
 *
 *   POST /v1/reports      anonymous or signed in. Limits: anonymous 5/h per IP
 *                         and 50/day overall; signed in 60/h per account.
 *                         Body <= 4 MiB including base64 attachments.
 *   GET  /v1/me/reports   the caller's reports and their triage status.
 *
 * Idempotency: a report carries the harness's `clientIssueId`; re-sending it
 * stores nothing new and answers 200 with the first report's id. The insert
 * is `INSERT ... SELECT ... WHERE NOT EXISTS` in the same batch as the
 * attachment inserts, which only land when their report row was inserted by
 * this batch, so a duplicate never adds attachments. Anonymous reports are
 * deduplicated among anonymous reports (account_id IS NULL); stated limit:
 * the key is the client's random UUID, so two anonymous people would only
 * collide by reusing an id.
 *
 * A signed-in report never stores a contact email (the account is the
 * contact); an anonymous one may. The QA views never show either.
 * Triage and the QA/admin views live in report-triage.mjs.
 */

import { randomId } from "./crypto.mjs";
import { emailValue, enumValue, optionalText, parseFields, requestIdValue, requiredText } from "./input.mjs";
import { hitRateLimit } from "./ratelimit.mjs";
import {
  parseAttachments,
  REPORT_CATEGORIES,
  REPORT_CAUSES,
  REPORT_SEVERITIES,
  REPORT_SOURCES,
  sanitizeContext
} from "./report-input.mjs";

export { REPORT_CATEGORIES, REPORT_CAUSES, REPORT_SEVERITIES };

/** Route body cap for POST /v1/reports. */
export const REPORT_BODY_CAP = 4 * 1024 * 1024;

const HOUR = 3600;
const DAY = 86400;

/**
 * An optional field parsed only when present.
 * @param {unknown} value Raw value.
 * @param {function(unknown): unknown} parse Parser.
 * @returns {unknown} Parsed value or null.
 */
function whenPresent(value, parse) {
  return value === undefined || value === null || value === "" ? null : parse(value);
}

const REPORT_FIELDS = [
  ["source", (b) => enumValue(b.source, REPORT_SOURCES), "bad_source"],
  ["category", (b) => enumValue(b.category, REPORT_CATEGORIES), "bad_category"],
  ["cause", (b) => enumValue(b.cause, REPORT_CAUSES, null), "bad_cause"],
  ["severity", (b) => enumValue(b.severity, REPORT_SEVERITIES, null), "bad_severity"],
  ["title", (b) => requiredText(b.title, 200), "bad_title"],
  ["description", (b) => optionalText(b.description, 5000), "bad_description"],
  ["steps", (b) => optionalText(b.steps, 5000), "bad_steps"],
  ["expected", (b) => optionalText(b.expected, 2000), "bad_expected"],
  ["actual", (b) => optionalText(b.actual, 2000), "bad_actual"],
  ["improvement", (b) => optionalText(b.improvement, 2000), "bad_improvement"],
  ["reporterAlias", (b) => optionalText(b.reporterAlias, 80), "bad_alias"],
  ["contactEmail", (b) => whenPresent(b.contactEmail, emailValue), "bad_email"],
  ["clientIssueId", (b) => whenPresent(b.clientIssueId, requestIdValue), "bad_client_issue_id"]
];

/**
 * Spend the submitter's report budget.
 * @param {Object} ctx Context (optional session).
 * @returns {Promise<Object|null>} 429 result or null.
 */
async function spendReportLimits(ctx) {
  const buckets = ctx.account
    ? [[`reports:acct:${ctx.account.id}`, 60, HOUR]]
    : [
        [`reports:ip:${ctx.ip}`, 5, HOUR],
        ["reports:anon:day", 50, DAY]
      ];
  for (const [name, limit, windowSeconds] of buckets) {
    const hit = await hitRateLimit(ctx, name, limit, windowSeconds);
    if (!hit.ok) {
      return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
    }
  }
  return null;
}

/**
 * An ArrayBuffer holding exactly these bytes (D1 binds ArrayBuffer as BLOB).
 * @param {Uint8Array} bytes Bytes.
 * @returns {ArrayBuffer} Buffer.
 */
function exactBuffer(bytes) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

/**
 * The batch: the report (unless this issue was already sent) and its attachments.
 * @param {Object} ctx Context.
 * @param {Object} input Parsed fields (+ context, attachments).
 * @param {string} reportId New report id.
 * @returns {Object[]} Statements.
 */
function reportBatch(ctx, input, reportId) {
  const accountId = ctx.account ? ctx.account.id : null;
  const report = ctx.db
    .prepare(
      `INSERT INTO reports (id, created_at, updated_at, account_id, reporter_alias, contact_email, source, category, cause, severity,
         status, title, description, steps, expected, actual, improvement, context, client_issue_id)
       SELECT ?1, ?2, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'new', ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17
       WHERE NOT EXISTS (SELECT 1 FROM reports WHERE account_id IS ?3 AND client_issue_id = ?17)`
    )
    .bind(
      reportId,
      ctx.now,
      accountId,
      input.reporterAlias,
      accountId ? null : input.contactEmail,
      input.source,
      input.category,
      input.cause,
      input.severity,
      input.title,
      input.description,
      input.steps,
      input.expected,
      input.actual,
      input.improvement,
      JSON.stringify(input.context),
      input.clientIssueId
    );
  const attachments = input.attachments.map((a) =>
    ctx.db
      .prepare(
        `INSERT INTO report_attachments (id, report_id, mime, bytes, created_at)
         SELECT ?1, ?2, ?3, ?4, ?5 WHERE EXISTS (SELECT 1 FROM reports WHERE id = ?2)`
      )
      .bind(randomId("att"), reportId, a.mime, exactBuffer(a.bytes), ctx.now)
  );
  return [report, ...attachments];
}

/**
 * Validate a report body.
 * @param {Object} body Request body.
 * @returns {{input: Object}|{error: Object}} Clean input or a refusal.
 */
function parseReport(body) {
  const parsed = parseFields(body, REPORT_FIELDS);
  if (parsed.error) {
    return { error: parsed.error };
  }
  const attachments = parseAttachments(body.attachments);
  if (attachments.error) {
    return attachments;
  }
  return { input: { ...parsed.values, context: sanitizeContext(body.context), attachments: attachments.items } };
}

/**
 * POST /v1/reports.
 * @param {Object} ctx Context (optional session; db + pepper configured).
 * @returns {Promise<Object>} Result.
 */
export async function handleSubmitReport(ctx) {
  const limited = await spendReportLimits(ctx);
  if (limited) {
    return limited;
  }
  const parsed = parseReport(ctx.body);
  if (parsed.error) {
    return parsed.error;
  }
  const input = parsed.input;
  const reportId = randomId("rep");
  await ctx.db.batch(reportBatch(ctx, input, reportId));
  if (await ctx.db.prepare("SELECT 1 AS hit FROM reports WHERE id = ?1").bind(reportId).first()) {
    return { status: 201, body: { ok: true, id: reportId, status: "new", attachments: input.attachments.length, deduplicated: false } };
  }
  const existing = await ctx.db
    .prepare("SELECT id FROM reports WHERE account_id IS ?1 AND client_issue_id = ?2")
    .bind(ctx.account ? ctx.account.id : null, input.clientIssueId)
    .first();
  return { status: 200, body: { ok: true, id: existing.id, deduplicated: true } };
}

/**
 * GET /v1/me/reports: the caller's reports, newest first (at most 100).
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export async function handleMyReports(ctx) {
  const rows = await ctx.db
    .prepare(
      `SELECT id, created_at, updated_at, source, category, severity, status, title, duplicate_of FROM reports
       WHERE account_id = ?1 ORDER BY created_at DESC, id DESC LIMIT 100`
    )
    .bind(ctx.account.id)
    .all();
  const reports = rows.results.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    source: r.source,
    category: r.category,
    severity: r.severity,
    status: r.status,
    title: r.title,
    duplicateOf: r.duplicate_of || null
  }));
  return { status: 200, body: { ok: true, reports } };
}
