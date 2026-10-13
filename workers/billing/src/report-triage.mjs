/**
 * The QA reporting subsite's reads and the admin triage (DESIGN-v3).
 *
 *   GET   /v1/qa/reports?status=&severity=&category=&section=&source=&tester=&q=&limit=&cursor=  (tester or admin)
 *   GET   /v1/qa/reports/:id                         report + attachment metadata
 *   GET   /v1/qa/reports/:id/attachments/:aid        image bytes
 *   GET   /v1/admin/reports?<same filters>           admin: + contact email, account email, admin note
 *   PATCH /v1/admin/reports/:id {status?, adminNote?, duplicateOf?}
 *
 * The tester view never carries the reporter's identity (no contact email,
 * no account id or email, no admin note), only `mine` for their own.
 * Pages are keyset-paginated on (created_at, id) with an opaque cursor, so a
 * report filed while someone pages is neither repeated nor skipped.
 * Attachment bytes are served only when their magic bytes still match the
 * stored type, with nosniff, an inline disposition and a sandbox CSP.
 */

import { bytesToBase64Url, base64UrlToString } from "./crypto.mjs";
import { badRequest, enumValue, INVALID, limitValue, optionalText, parseFields, queryObject, requiredText } from "./input.mjs";
import { blobBytes, REPORT_CATEGORIES, REPORT_SEVERITIES, REPORT_SOURCES, REPORT_STATUSES, sniffImage } from "./report-input.mjs";

const NOT_FOUND = { status: 404, body: { ok: false, reason: "not_found" } };

const REPORT_SELECT = `SELECT r.*, a.email AS account_email,
    (SELECT COUNT(*) FROM report_attachments x WHERE x.report_id = r.id) AS attachment_count
  FROM reports r LEFT JOIN accounts a ON a.id = r.account_id`;

/**
 * Escape LIKE wildcards so a search is literal.
 * @param {string|null|symbol} text Search text.
 * @returns {string|null|symbol} `%text%` pattern, null, or INVALID.
 */
function likePattern(text) {
  return typeof text === "string" ? `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%` : text;
}

/** [param, parse, reason, SQL with ? placeholders, placeholder count]. */
const FILTERS = [
  ["status", (q) => enumValue(q.status, REPORT_STATUSES, null), "bad_status", "r.status = ?", 1],
  ["severity", (q) => enumValue(q.severity, REPORT_SEVERITIES, null), "bad_severity", "r.severity = ?", 1],
  ["category", (q) => enumValue(q.category, REPORT_CATEGORIES, null), "bad_category", "r.category = ?", 1],
  ["section", (q) => optionalText(q.section, 40), "bad_section", "json_extract(r.context, '$.sectionId') = ?", 1],
  ["source", (q) => enumValue(q.source, REPORT_SOURCES, null), "bad_source", "r.source = ?", 1],
  ["tester", (q) => optionalText(q.tester, 80), "bad_tester", "r.reporter_alias = ?", 1],
  ["q", (q) => likePattern(optionalText(q.q, 100)), "bad_q", "(r.title LIKE ? ESCAPE '\\' OR r.description LIKE ? ESCAPE '\\')", 2]
];

/**
 * Encode a keyset position.
 * @param {Object} row Last row of a page.
 * @returns {string} Cursor.
 */
function encodeCursor(row) {
  return bytesToBase64Url(new TextEncoder().encode(`${row.created_at}:${row.id}`));
}

/**
 * Decode a cursor.
 * @param {string|null} raw Cursor text.
 * @returns {{createdAt: number, id: string}|null|symbol} Position, null, or INVALID.
 */
function decodeCursor(raw) {
  if (!raw) {
    return null;
  }
  try {
    const match = /^(\d{1,12}):(rep_[A-Za-z0-9_-]{1,40})$/.exec(base64UrlToString(raw));
    return match ? { createdAt: Number(match[1]), id: match[2] } : INVALID;
  } catch {
    return INVALID;
  }
}

/**
 * WHERE clause and values for the list filters and cursor.
 * @param {URL} url Request URL.
 * @returns {{where: string, values: unknown[], limit: number}|{error: Object}} Query parts.
 */
function listQuery(url) {
  const query = queryObject(url);
  const parsed = parseFields(query, FILTERS.map(([name, parse, reason]) => [name, parse, reason]));
  if (parsed.error) {
    return { error: parsed.error };
  }
  const limit = limitValue(url, 50, 100);
  const cursor = decodeCursor(query.cursor);
  if (limit === INVALID || cursor === INVALID) {
    return { error: badRequest(limit === INVALID ? "bad_limit" : "bad_cursor") };
  }
  const clauses = [];
  const values = [];
  for (const [name, , , sql, arity] of FILTERS) {
    if (parsed.values[name] !== null) {
      clauses.push(sql);
      values.push(...Array(arity).fill(parsed.values[name]));
    }
  }
  if (cursor) {
    clauses.push("(r.created_at < ? OR (r.created_at = ? AND r.id < ?))");
    values.push(cursor.createdAt, cursor.createdAt, cursor.id);
  }
  return { where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", values, limit };
}

/**
 * One page of reports.
 * @param {Object} ctx Context.
 * @param {function(Object): Object} view Row view.
 * @returns {Promise<Object>} Result.
 */
async function listPage(ctx, view) {
  const q = listQuery(ctx.url);
  if (q.error) {
    return q.error;
  }
  const rows = await ctx.db
    .prepare(`${REPORT_SELECT} ${q.where} ORDER BY r.created_at DESC, r.id DESC LIMIT ?`)
    .bind(...q.values, q.limit + 1)
    .all();
  const page = rows.results.slice(0, q.limit);
  const nextCursor = rows.results.length > q.limit ? encodeCursor(page[page.length - 1]) : null;
  return { status: 200, body: { ok: true, reports: page.map(view), nextCursor }, audit: { detail: { count: page.length } } };
}

/**
 * The fields every viewer of a report sees.
 * @param {Object} r Report row.
 * @returns {Object} View.
 */
function sharedView(r) {
  return {
    id: r.id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    source: r.source,
    category: r.category,
    cause: r.cause,
    severity: r.severity,
    status: r.status,
    title: r.title,
    description: r.description,
    steps: r.steps,
    expected: r.expected,
    actual: r.actual,
    improvement: r.improvement,
    context: r.context ? JSON.parse(r.context) : {},
    reporterAlias: r.reporter_alias,
    duplicateOf: r.duplicate_of,
    attachmentCount: Number(r.attachment_count || 0)
  };
}

/**
 * The tester view: no reporter identity.
 * @param {Object} ctx Context (viewer).
 * @returns {function(Object): Object} Row view.
 */
function qaView(ctx) {
  return (r) => ({ ...sharedView(r), mine: r.account_id === ctx.account.id });
}

/**
 * The admin view: identity and triage note included.
 * @param {Object} r Report row.
 * @returns {Object} View.
 */
function adminView(r) {
  return { ...sharedView(r), accountId: r.account_id, accountEmail: r.account_email || null, contactEmail: r.contact_email, adminNote: r.admin_note };
}

/**
 * GET /v1/qa/reports.
 * @param {Object} ctx Tester or admin context.
 * @returns {Promise<Object>} Result.
 */
export function handleQaReports(ctx) {
  return listPage(ctx, qaView(ctx));
}

/**
 * GET /v1/admin/reports.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export function handleAdminReports(ctx) {
  return listPage(ctx, adminView);
}

/**
 * One report row.
 * @param {Object} db D1 binding.
 * @param {string} id Report id.
 * @returns {Promise<Object|null>} Row.
 */
function reportRow(db, id) {
  return db.prepare(`${REPORT_SELECT} WHERE r.id = ?1`).bind(id).first();
}

/**
 * GET /v1/qa/reports/:id.
 * @param {Object} ctx Tester or admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleQaReport(ctx) {
  const row = await reportRow(ctx.db, ctx.params.id);
  if (!row) {
    return NOT_FOUND;
  }
  const attachments = await ctx.db
    .prepare("SELECT id, mime, length(bytes) AS size, created_at FROM report_attachments WHERE report_id = ?1 ORDER BY created_at, id")
    .bind(row.id)
    .all();
  return {
    status: 200,
    body: {
      ok: true,
      report: qaView(ctx)(row),
      attachments: attachments.results.map((a) => ({ id: a.id, mime: a.mime, size: a.size, createdAt: a.created_at }))
    }
  };
}

const EXTENSIONS = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

/**
 * GET /v1/qa/reports/:id/attachments/:aid.
 * @param {Object} ctx Tester or admin context.
 * @returns {Promise<Object>} Result (raw bytes on success).
 */
export async function handleQaAttachment(ctx) {
  const row = await ctx.db
    .prepare("SELECT id, mime, bytes FROM report_attachments WHERE id = ?1 AND report_id = ?2")
    .bind(ctx.params.aid, ctx.params.id)
    .first();
  if (!row) {
    return NOT_FOUND;
  }
  const bytes = blobBytes(row.bytes);
  if (sniffImage(bytes) !== row.mime) {
    return { status: 409, body: { ok: false, reason: "attachment_mismatch" } };
  }
  return {
    status: 200,
    raw: bytes,
    headers: {
      "content-type": row.mime,
      "content-length": String(bytes.byteLength),
      "x-content-type-options": "nosniff",
      "content-disposition": `inline; filename="${row.id}.${EXTENSIONS[row.mime]}"`,
      "content-security-policy": "default-src 'none'; sandbox",
      "cross-origin-resource-policy": "same-site",
      "cache-control": "private, no-store"
    }
  };
}

const PATCHABLE = ["status", "adminNote", "duplicateOf"];

const PATCH_FIELDS = [
  ["status", (b) => ("status" in b ? enumValue(b.status, REPORT_STATUSES) : undefined), "bad_status"],
  ["adminNote", (b) => ("adminNote" in b ? optionalText(b.adminNote, 2000) : undefined), "bad_note"],
  ["duplicateOf", (b) => ("duplicateOf" in b && b.duplicateOf !== null ? requiredText(b.duplicateOf, 100) : b.duplicateOf), "bad_duplicate_of"]
];

/**
 * Apply the duplicate rule: duplicateOf implies status "duplicate", status
 * "duplicate" needs a target, and any other status clears the target.
 * @param {Object} ctx Context.
 * @param {Object} current Current report row.
 * @param {Object} change Parsed changes (undefined = not sent).
 * @returns {Promise<{status: string, duplicateOf: string|null}|{error: Object}>} Resolved or error.
 */
async function resolveDuplicate(ctx, current, change) {
  const target = change.duplicateOf;
  const status = change.status || (target ? "duplicate" : current.status);
  if (target && (target === current.id || status !== "duplicate" || !(await reportRow(ctx.db, target)))) {
    return { error: badRequest("bad_duplicate_of") };
  }
  if (status !== "duplicate") {
    return { status, duplicateOf: null };
  }
  const duplicateOf = target || current.duplicate_of;
  return duplicateOf ? { status, duplicateOf } : { error: badRequest("duplicate_of_required") };
}

/**
 * PATCH /v1/admin/reports/:id.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handlePatchReport(ctx) {
  const audit = { targetId: ctx.params.id };
  if (!PATCHABLE.some((key) => key in ctx.body)) {
    return { ...badRequest("nothing_to_update"), audit };
  }
  const parsed = parseFields(ctx.body, PATCH_FIELDS);
  if (parsed.error) {
    return { ...parsed.error, audit };
  }
  const current = await reportRow(ctx.db, ctx.params.id);
  if (!current) {
    return { ...NOT_FOUND, audit };
  }
  const resolved = await resolveDuplicate(ctx, current, parsed.values);
  if (resolved.error) {
    return { ...resolved.error, audit };
  }
  const noteSent = parsed.values.adminNote !== undefined;
  await ctx.db
    .prepare(
      `UPDATE reports SET status = ?2, duplicate_of = ?3, admin_note = CASE WHEN ?4 THEN ?5 ELSE admin_note END, updated_at = ?6
       WHERE id = ?1`
    )
    .bind(current.id, resolved.status, resolved.duplicateOf, noteSent ? 1 : 0, noteSent ? parsed.values.adminNote : null, ctx.now)
    .run();
  const report = adminView(await reportRow(ctx.db, current.id));
  return { status: 200, body: { ok: true, report }, audit: { ...audit, targetAccountId: current.account_id, detail: { status: resolved.status } } };
}
