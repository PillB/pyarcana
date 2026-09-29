/**
 * Bug reports: submitting them and listing your own (DESIGN-v3).
 *
 *   POST /v1/reports      anonymous or signed in. Limits: anonymous 5/h and
 *                         5/day per network (IPv4 address or IPv6 /64), and
 *                         50/day overall; signed in 60/h per account. The
 *                         per-network daily share keeps one network from
 *                         spending the global anonymous budget (it would take
 *                         10 networks); signing in (free) lifts it.
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
 *
 * Screenshot storage (review round 1): screenshots are D1 BLOBs, and D1 has
 * a per-database size limit shared with sign-in, sessions and progress. So:
 *   - a byte budget per UTC day: 10 MiB per account, 20 MiB for all anonymous
 *     reports together (spent all-or-nothing per report, ratelimit.spendBudget);
 *   - a global ceiling (config.reportAttachmentsCapBytes, 200 MiB default),
 *     checked inside each attachment INSERT of the batch;
 *   - the daily sweep deletes screenshots of closed reports after 90 days and
 *     every screenshot after 180 (retention.mjs).
 * Past a budget or the ceiling the REPORT TEXT is still stored and the answer
 * is 201 with `attachments: 0, attachmentsDropped, attachmentsReason`
 * ("attachment_budget" | "storage_full"): the report did land, so a failure
 * status would make the client resend what is already saved.
 * A re-sent issue (same clientIssueId) is answered before any budget is spent.
 *
 * Text storage (review round 2): field caps count characters, and one free
 * account could store ~77 MB of 3-byte text a day. Each report is charged
 * reports.text_bytes = UTF-8 bytes of its text columns + a 256-byte row
 * overhead (an estimate for ids, timestamps, enums and index entries), and:
 *   - a byte budget per UTC day: 512 KiB per account; 64 KiB per network and
 *     1 MiB for all anonymous reports together (the network is spent first, so
 *     an exhausted network cannot drain the shared budget; 16 networks are
 *     needed to exhaust it). Over budget: 429 rate_limited with
 *     `budget: "report_text"`, nothing stored; a refused spend costs nothing;
 *   - a global ceiling (config.reportTextCapBytes, 100 MiB default) checked
 *     inside the report INSERT over SUM(text_bytes). Past it: 507
 *     report_storage_full, nothing stored.
 * Stated limits: report text has no retention rule (the sweep keeps it, as the
 * QA record); the ceiling is the bound, and only the owner can reopen it by
 * deleting old reports in D1 (no prune route yet; README "Not built yet").
 * Admin notes are not charged (admins are trusted). Erasure nulls the alias,
 * contact and issue id but keeps text_bytes, so the charge only overcounts.
 * Budgets spent on a report the ceiling then refuses are not refunded.
 */

import { reportAttachmentsCapBytes, reportTextCapBytes } from "./config.mjs";
import { randomId } from "./crypto.mjs";
import { emailValue, enumValue, optionalText, parseFields, requestIdValue, requiredText } from "./input.mjs";
import { hitRateLimit, spendBudget } from "./ratelimit.mjs";
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

/** Anonymous reports per UTC day, all networks together. */
export const ANON_REPORTS_PER_DAY = 50;

/** Anonymous reports per network per UTC day. */
export const ANON_REPORTS_PER_NETWORK_DAY = 5;

const MIB = 1024 * 1024;

/** Screenshot bytes one account may store per UTC day. */
export const ACCOUNT_SCREENSHOT_BYTES_PER_DAY = 10 * MIB;

/** Screenshot bytes all anonymous reports together may store per UTC day. */
export const ANON_SCREENSHOT_BYTES_PER_DAY = 20 * MIB;

const KIB = 1024;

/** Bytes charged per report on top of its UTF-8 text (migration 4 backfills with the same 256). */
export const REPORT_ROW_OVERHEAD_BYTES = 256;

/** Report text bytes one account may store per UTC day. */
export const ACCOUNT_REPORT_TEXT_BYTES_PER_DAY = 512 * KIB;

/** Report text bytes one network may store anonymously per UTC day. */
export const ANON_REPORT_TEXT_BYTES_PER_NETWORK_DAY = 64 * KIB;

/** Report text bytes all anonymous reports together may store per UTC day. */
export const ANON_REPORT_TEXT_BYTES_PER_DAY = MIB;

const UTF8 = new TextEncoder();

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
        [`reports:anon:net-day:${ctx.ip}`, ANON_REPORTS_PER_NETWORK_DAY, DAY],
        ["reports:anon:day", ANON_REPORTS_PER_DAY, DAY]
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
 * The text columns a report stores, exactly as bound. A signed-in report
 * never stores a contact email.
 * @param {Object} ctx Context.
 * @param {Object} input Parsed fields (+ context).
 * @returns {Object} Column values.
 */
function storedText(ctx, input) {
  return {
    reporterAlias: input.reporterAlias,
    contactEmail: ctx.account ? null : input.contactEmail,
    title: input.title,
    description: input.description,
    steps: input.steps,
    expected: input.expected,
    actual: input.actual,
    improvement: input.improvement,
    context: JSON.stringify(input.context),
    clientIssueId: input.clientIssueId
  };
}

/**
 * The bytes a report is charged: the UTF-8 size of its stored text plus the
 * row overhead (reports.text_bytes).
 * @param {Object} text storedText() values.
 * @returns {number} Bytes.
 */
export function reportTextBytes(text) {
  return Object.values(text).reduce((sum, v) => sum + (typeof v === "string" ? UTF8.encode(v).byteLength : 0), REPORT_ROW_OVERHEAD_BYTES);
}

/**
 * The report INSERT: skipped when this issue was already sent, or when it
 * would take all report text past the global ceiling.
 * @param {Object} ctx Context.
 * @param {Object} input Parsed fields.
 * @param {string} reportId New report id.
 * @param {{text: Object, bytes: number}} charged storedText() and its bytes.
 * @returns {Object} Statement.
 */
function reportInsert(ctx, input, reportId, charged) {
  const t = charged.text;
  return ctx.db
    .prepare(
      `INSERT INTO reports (id, created_at, updated_at, account_id, reporter_alias, contact_email, source, category, cause, severity,
         status, title, description, steps, expected, actual, improvement, context, client_issue_id, text_bytes)
       SELECT ?1, ?2, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'new', ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18
       WHERE NOT EXISTS (SELECT 1 FROM reports WHERE account_id IS ?3 AND client_issue_id = ?17)
         AND (SELECT COALESCE(SUM(text_bytes), 0) FROM reports) + ?18 <= ?19`
    )
    .bind(
      reportId,
      ctx.now,
      ctx.account ? ctx.account.id : null,
      t.reporterAlias,
      t.contactEmail,
      input.source,
      input.category,
      input.cause,
      input.severity,
      t.title,
      t.description,
      t.steps,
      t.expected,
      t.actual,
      t.improvement,
      t.context,
      t.clientIssueId,
      charged.bytes,
      reportTextCapBytes(ctx.env)
    );
}

/**
 * The batch: the report (unless already sent or over the ceiling) and its attachments.
 * @param {Object} ctx Context.
 * @param {Object} input Parsed fields (+ context, attachments).
 * @param {string} reportId New report id.
 * @param {{text: Object, bytes: number}} charged storedText() and its bytes.
 * @returns {Object[]} Statements.
 */
function reportBatch(ctx, input, reportId, charged) {
  const cap = reportAttachmentsCapBytes(ctx.env);
  const attachments = input.attachments.map((a) =>
    ctx.db
      .prepare(
        `INSERT INTO report_attachments (id, report_id, mime, bytes, created_at)
         SELECT ?1, ?2, ?3, ?4, ?5 WHERE EXISTS (SELECT 1 FROM reports WHERE id = ?2)
           AND (SELECT COALESCE(SUM(length(bytes)), 0) FROM report_attachments) + ?6 <= ?7`
      )
      .bind(randomId("att"), reportId, a.mime, exactBuffer(a.bytes), ctx.now, a.bytes.byteLength, cap)
  );
  return [reportInsert(ctx, input, reportId, charged), ...attachments];
}

/**
 * The daily text budgets this submitter spends, in order: an anonymous
 * report spends its network's share before the shared anonymous budget.
 * @param {Object} ctx Context (optional session).
 * @returns {Array<[string, number]>} [bucket name, bytes per UTC day].
 */
function textBudgets(ctx) {
  return ctx.account
    ? [[`report-text:acct:${ctx.account.id}`, ACCOUNT_REPORT_TEXT_BYTES_PER_DAY]]
    : [
        [`report-text:anon:net:${ctx.ip}`, ANON_REPORT_TEXT_BYTES_PER_NETWORK_DAY],
        ["report-text:anon", ANON_REPORT_TEXT_BYTES_PER_DAY]
      ];
}

/**
 * Spend the submitter's daily report text budget.
 * @param {Object} ctx Context (optional session).
 * @param {number} bytes Charged bytes.
 * @returns {Promise<Object|null>} 429 result or null.
 */
async function spendTextBudget(ctx, bytes) {
  for (const [name, limit] of textBudgets(ctx)) {
    const spent = await spendBudget(ctx, name, bytes, limit, DAY);
    if (!spent.ok) {
      const body = { ok: false, reason: "rate_limited", budget: "report_text", retryAfter: spent.retryAfter };
      return { status: 429, body, headers: { "retry-after": String(spent.retryAfter) } };
    }
  }
  return null;
}

/**
 * Spend the submitter's daily screenshot budget for this report's bytes.
 * @param {Object} ctx Context (optional session).
 * @param {Object[]} attachments Decoded attachments.
 * @returns {Promise<boolean>} True when the screenshots may be stored.
 */
async function spendScreenshotBudget(ctx, attachments) {
  const bytes = attachments.reduce((sum, a) => sum + a.bytes.byteLength, 0);
  if (!bytes) {
    return true;
  }
  const [name, limit] = ctx.account
    ? [`report-bytes:acct:${ctx.account.id}`, ACCOUNT_SCREENSHOT_BYTES_PER_DAY]
    : ["report-bytes:anon", ANON_SCREENSHOT_BYTES_PER_DAY];
  return (await spendBudget(ctx, name, bytes, limit, DAY)).ok;
}

/**
 * The id of an issue this submitter already sent, or null.
 * @param {Object} ctx Context.
 * @param {string|null} clientIssueId Client key.
 * @returns {Promise<string|null>} Report id.
 */
async function alreadySent(ctx, clientIssueId) {
  if (!clientIssueId) {
    return null;
  }
  const row = await ctx.db
    .prepare("SELECT id FROM reports WHERE account_id IS ?1 AND client_issue_id = ?2")
    .bind(ctx.account ? ctx.account.id : null, clientIssueId)
    .first();
  return row ? row.id : null;
}

/**
 * The 201 body, naming screenshots that were not stored and why.
 * @param {string} reportId Report id.
 * @param {number} sent Screenshots sent.
 * @param {number} stored Screenshots stored.
 * @param {string} reason Why they were dropped, when they were.
 * @returns {Object} Body.
 */
function createdBody(reportId, sent, stored, reason) {
  const body = { ok: true, id: reportId, status: "new", attachments: stored, deduplicated: false };
  return stored === sent ? body : { ...body, attachmentsDropped: sent - stored, attachmentsReason: reason };
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
 * The answer when the report row did not land: a concurrent send of the same
 * issue won the race (200, its id), or the text ceiling is reached (507).
 * @param {Object} ctx Context.
 * @param {string|null} clientIssueId Client key.
 * @returns {Promise<Object>} Result.
 */
async function notStored(ctx, clientIssueId) {
  const earlier = await alreadySent(ctx, clientIssueId);
  if (earlier) {
    return { status: 200, body: { ok: true, id: earlier, deduplicated: true } };
  }
  return { status: 507, body: { ok: false, reason: "report_storage_full" } };
}

/**
 * Spend the budgets and store a new report with what screenshots fit.
 * @param {Object} ctx Context.
 * @param {Object} parsed Clean input.
 * @returns {Promise<Object>} Result.
 */
async function storeReport(ctx, parsed) {
  const text = storedText(ctx, parsed);
  const charged = { text, bytes: reportTextBytes(text) };
  const overBudget = await spendTextBudget(ctx, charged.bytes);
  if (overBudget) {
    return overBudget;
  }
  const sent = parsed.attachments;
  const withinBudget = await spendScreenshotBudget(ctx, sent);
  const input = withinBudget ? parsed : { ...parsed, attachments: [] };
  const reportId = randomId("rep");
  await ctx.db.batch(reportBatch(ctx, input, reportId, charged));
  if (!(await ctx.db.prepare("SELECT 1 AS hit FROM reports WHERE id = ?1").bind(reportId).first())) {
    return notStored(ctx, input.clientIssueId);
  }
  const stored = await ctx.db.prepare("SELECT COUNT(*) AS c FROM report_attachments WHERE report_id = ?1").bind(reportId).first("c");
  return { status: 201, body: createdBody(reportId, sent.length, Number(stored), withinBudget ? "storage_full" : "attachment_budget") };
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
  const earlier = await alreadySent(ctx, parsed.input.clientIssueId);
  if (earlier) {
    return { status: 200, body: { ok: true, id: earlier, deduplicated: true } };
  }
  return storeReport(ctx, parsed.input);
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
