/**
 * QA for the admin (owner request 2026-10-05): what testers reported and how they worked, as
 * numbers and as downloads.
 *
 *   GET /v1/admin/qa/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
 *       reports by status, severity, category, cause, source, section, tester, build and day;
 *       sessions: count, testers, active time, issues, seconds per section, per-tester rows.
 *   GET /v1/admin/qa/export?format=csv|json&from=&to=
 *       csv:  one row per report, every cell disarmed against spreadsheet formulas (csvCell);
 *       json: the testers' own pyarcana.qa.v1 package (QA workspace → Importar opens it), with the
 *             first screenshot of each report as a data URL, plus the session summaries.
 *
 * The range is by filing day (UTC), `to` inclusive, at most 366 days; default the last 30 days.
 * Exports are capped (EXPORT_MAX_REPORTS; the JSON file at EXPORT_MAX_CHARS, under what the QA
 * workspace's importer accepts, src/lib/qa-session.ts MAX_PACKAGE_CHARACTERS) and say `partial` when
 * cut; 10 downloads per admin per hour on top of the admin gate. Both routes are admin-only and
 * audited by the router. Reports already follow their retention rule, so an export holds only
 * what is still kept.
 */

import { bytesToBase64Url } from "./crypto.mjs";
import { badRequest } from "./input.mjs";
import { hitRateLimit } from "./ratelimit.mjs";
import { blobBytes } from "./report-input.mjs";
import { sessionView } from "./qa-sessions.mjs";

const DAY = 86400;
export const RANGE_MAX_DAYS = 366;
export const RANGE_DEFAULT_DAYS = 30;
export const EXPORT_MAX_REPORTS = 500;
/**
 * Characters of the whole JSON file. The importer refuses more than 16 MiB (16,777,216), so the
 * file stays below with room to spare. Screenshots are budgeted as the base64 text they become.
 */
export const EXPORT_MAX_CHARS = 15 * 1024 * 1024;
export const EXPORTS_PER_HOUR = 10;

const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Epoch seconds of a UTC day, or null when malformed.
 * @param {string} text YYYY-MM-DD.
 * @returns {number|null} Seconds.
 */
function dayStart(text) {
  const m = DAY_RE.exec(text || "");
  if (!m) {
    return null;
  }
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isFinite(ms) && new Date(ms).toISOString().startsWith(text) ? ms / 1000 : null;
}

/**
 * The [from, to) range in seconds from ?from=&to= (to inclusive as a day).
 * @param {URL} url Request URL.
 * @param {number} now Epoch seconds.
 * @returns {{from: number, to: number}|{error: Object}} Range.
 */
export function rangeOf(url, now) {
  const today = now - (now % DAY);
  const qFrom = url.searchParams.get("from");
  const qTo = url.searchParams.get("to");
  const to = qTo ? dayStart(qTo) : today;
  const from = qFrom ? dayStart(qFrom) : (to ?? today) - (RANGE_DEFAULT_DAYS - 1) * DAY;
  if (from === null || to === null || from > to || (to - from) / DAY + 1 > RANGE_MAX_DAYS) {
    return { error: badRequest("bad_range") };
  }
  return { from, to: to + DAY };
}

const GROUPS = {
  status: "status",
  severity: "severity",
  category: "category",
  cause: "cause",
  source: "source",
  section: "json_extract(context, '$.sectionId')",
  tester: "reporter_alias",
  build: "json_extract(context, '$.deploymentSha')",
  day: "date(created_at, 'unixepoch')"
};

/**
 * Count rows of one dimension.
 * @param {Object} rows Results.
 * @returns {Array<{key: string|null, count: number}>} Counts, largest first.
 */
function counts(rows) {
  return (rows.results || []).map((r) => ({ key: r.k === null || r.k === undefined ? null : String(r.k), count: Number(r.n) }));
}

/**
 * GET /v1/admin/qa/stats.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleQaStats(ctx) {
  const range = rangeOf(ctx.url, ctx.now);
  if (range.error) {
    return range.error;
  }
  const names = Object.keys(GROUPS);
  const reportQueries = names.map((name) =>
    ctx.db
      .prepare(`SELECT ${GROUPS[name]} AS k, COUNT(*) AS n FROM reports WHERE created_at >= ?1 AND created_at < ?2 GROUP BY k ORDER BY n DESC, k`)
      .bind(range.from, range.to)
  );
  const inRange = "last_active_at >= ?1 AND started_at < ?2";
  const sessionQueries = [
    ctx.db
      .prepare(
        `SELECT COUNT(*) AS sessions, COUNT(DISTINCT account_id) AS testers, COALESCE(SUM(active_seconds), 0) AS active,
           COALESCE(SUM(issues_created), 0) AS created, COALESCE(SUM(issues_sent), 0) AS sent FROM qa_sessions WHERE ${inRange}`
      )
      .bind(range.from, range.to),
    ctx.db
      .prepare(`SELECT j.key AS k, SUM(j.value) AS n FROM qa_sessions s, json_each(s.sections) j WHERE ${inRange} GROUP BY j.key ORDER BY n DESC, k`)
      .bind(range.from, range.to),
    ctx.db
      .prepare(
        `SELECT s.account_id, MAX(s.alias) AS alias, a.email AS email, COUNT(*) AS sessions, SUM(s.active_seconds) AS active,
           SUM(s.issues_created) AS created, SUM(s.issues_sent) AS sent, MAX(s.last_active_at) AS last
         FROM qa_sessions s LEFT JOIN accounts a ON a.id = s.account_id WHERE ${inRange.replace(/(last_active_at|started_at)/g, "s.$1")}
         GROUP BY s.account_id ORDER BY active DESC`
      )
      .bind(range.from, range.to)
  ];
  const results = await ctx.db.batch([...reportQueries, ...sessionQueries]);
  const reports = Object.fromEntries(names.map((name, i) => [name, counts(results[i])]));
  const [totals, sections, testers] = results.slice(names.length).map((r) => r.results || []);
  const t = totals[0] || {};
  return {
    status: 200,
    body: {
      ok: true,
      range: { from: range.from, to: range.to },
      reports: { total: reports.status.reduce((n, c) => n + c.count, 0), ...reports },
      sessions: {
        count: Number(t.sessions || 0),
        testers: Number(t.testers || 0),
        activeSeconds: Number(t.active || 0),
        issuesCreated: Number(t.created || 0),
        issuesSent: Number(t.sent || 0),
        sections: sections.map((r) => ({ key: r.k, seconds: Number(r.n) })),
        perTester: testers.map((r) => ({
          accountId: r.account_id,
          alias: r.alias,
          email: r.email || null,
          sessions: Number(r.sessions),
          activeSeconds: Number(r.active),
          issuesCreated: Number(r.created),
          issuesSent: Number(r.sent),
          lastActiveAt: Number(r.last)
        }))
      }
    }
  };
}

// --- exports --------------------------------------------------------------------------------------

/** Leading characters a spreadsheet reads as a formula (same rule as src/lib/csv.ts). */
const FORMULA_TRIGGERS = new Set(["=", "+", "-", "@", "\t", "\r"]);

/**
 * One RFC 4180 field, always quoted, formula triggers disarmed with a leading apostrophe.
 * @param {unknown} value Cell value.
 * @returns {string} Field.
 */
export function csvCell(value) {
  const text = value === null || value === undefined ? "" : String(value);
  const disarmed = FORMULA_TRIGGERS.has(text[0] ?? "") ? `'${text}` : text;
  return `"${disarmed.replace(/"/g, '""')}"`;
}

const iso = (s) => (s ? new Date(Number(s) * 1000).toISOString() : "");

export const CSV_COLUMNS = Object.freeze([
  ["id", (r) => r.id],
  ["created_at", (r) => iso(r.created_at)],
  ["updated_at", (r) => iso(r.updated_at)],
  ["status", (r) => r.status],
  ["severity", (r) => r.severity],
  ["category", (r) => r.category],
  ["cause", (r) => r.cause],
  ["source", (r) => r.source],
  ["section_id", (r) => r.ctx.sectionId],
  ["section_index", (r) => r.ctx.sectionIndex],
  ["section_title", (r) => r.ctx.sectionTitle],
  ["sub_step", (r) => r.ctx.subStep],
  ["page", (r) => `${r.ctx.path || ""}${r.ctx.hash || ""}`],
  ["title", (r) => r.title],
  ["description", (r) => r.description],
  ["steps", (r) => r.steps],
  ["expected", (r) => r.expected],
  ["actual", (r) => r.actual],
  ["improvement", (r) => r.improvement],
  ["tester", (r) => r.reporter_alias],
  ["account_email", (r) => r.account_email],
  ["contact_email", (r) => r.contact_email],
  ["build", (r) => r.ctx.deploymentSha],
  ["browser", (r) => r.ctx.userAgent],
  ["viewport", (r) => (r.ctx.viewport ? `${r.ctx.viewport.width}x${r.ctx.viewport.height}` : "")],
  ["language", (r) => r.ctx.language],
  ["screenshots", (r) => Number(r.attachment_count || 0)],
  ["duplicate_of", (r) => r.duplicate_of],
  ["admin_note", (r) => r.admin_note]
]);

/**
 * Reports of the range, newest first, with their parsed context.
 * @param {Object} ctx Context.
 * @param {{from: number, to: number}} range Range.
 * @returns {Promise<{rows: Object[], partial: boolean}>} Rows.
 */
async function exportRows(ctx, range) {
  const res = await ctx.db
    .prepare(
      `SELECT r.*, a.email AS account_email, (SELECT COUNT(*) FROM report_attachments x WHERE x.report_id = r.id) AS attachment_count
       FROM reports r LEFT JOIN accounts a ON a.id = r.account_id
       WHERE r.created_at >= ?1 AND r.created_at < ?2 ORDER BY r.created_at DESC, r.id DESC LIMIT ?3`
    )
    .bind(range.from, range.to, EXPORT_MAX_REPORTS + 1)
    .all();
  const rows = (res.results || []).slice(0, EXPORT_MAX_REPORTS).map((r) => ({ ...r, ctx: r.context ? JSON.parse(r.context) : {} }));
  return { rows, partial: (res.results || []).length > EXPORT_MAX_REPORTS };
}

/**
 * The CSV document (UTF-8 BOM so spreadsheets read accents right).
 * @param {Object[]} rows Rows.
 * @returns {string} CSV.
 */
export function buildCsv(rows) {
  const lines = [CSV_COLUMNS.map(([name]) => csvCell(name)).join(",")];
  for (const r of rows) {
    lines.push(CSV_COLUMNS.map(([, get]) => csvCell(get(r))).join(","));
  }
  return `﻿${lines.join("\r\n")}\r\n`;
}

const CLOSED = new Set(["fixed", "wontfix", "duplicate"]);

/**
 * One report as a QA workspace issue (src/lib/qa-session.ts QAIssue), importable as is.
 * @param {Object} r Row.
 * @param {string|null} screenshot Data URL or null.
 * @returns {Object} Issue.
 */
export function toQaIssue(r, screenshot) {
  const c = r.ctx || {};
  const vp = c.viewport && typeof c.viewport === "object" ? c.viewport : {};
  const str = (v) => (typeof v === "string" ? v : "");
  const nstr = (v) => (typeof v === "string" ? v : null);
  return {
    id: r.client_issue_id || r.id,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
    status: CLOSED.has(r.status) ? "resolved" : "open",
    category: r.category || "other",
    cause: r.cause || "unknown",
    severity: r.severity || "medium",
    title: str(r.title),
    description: str(r.description),
    expected: str(r.expected),
    actual: str(r.actual),
    reproductionSteps: str(r.steps),
    improvement: str(r.improvement),
    context: {
      path: str(c.path),
      hash: str(c.hash),
      sectionId: nstr(c.sectionId),
      sectionIndex: Number.isInteger(c.sectionIndex) && c.sectionIndex >= 1 ? c.sectionIndex : null,
      sectionTitle: nstr(c.sectionTitle),
      subStep: nstr(c.subStep),
      viewport: { width: Math.max(0, Number(vp.width) || 0), height: Math.max(0, Number(vp.height) || 0) },
      scrollY: Number.isFinite(c.scrollY) ? c.scrollY : 0,
      userAgent: str(c.userAgent),
      language: str(c.language),
      deploymentSha: nstr(c.deploymentSha),
      elementHint: nstr(c.elementHint)
    },
    screenshotDataUrl: screenshot,
    remoteId: r.id,
    sentAt: iso(r.created_at)
  };
}

/**
 * The first screenshot of each report as a data URL, within a budget of data-URL characters.
 * @param {Object} ctx Context.
 * @param {Object[]} rows Rows.
 * @param {number} budgetChars Characters the data URLs may add to the file.
 * @returns {Promise<{shots: Map<string, string>, partial: boolean}>} Screenshots by report id.
 */
async function screenshots(ctx, rows, budgetChars) {
  const shots = new Map();
  const ids = rows.filter((r) => Number(r.attachment_count) > 0).map((r) => r.id);
  let budget = budgetChars;
  let partial = false;
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const res = await ctx.db
      .prepare(
        `SELECT report_id, mime, bytes FROM report_attachments WHERE id IN (
           SELECT MIN(id) FROM report_attachments WHERE report_id IN (${chunk.map(() => "?").join(",")}) GROUP BY report_id)`
      )
      .bind(...chunk)
      .all();
    for (const a of res.results || []) {
      const b64 = bytesToBase64Url(blobBytes(a.bytes)).replace(/-/g, "+").replace(/_/g, "/");
      const url = `data:${a.mime};base64,${b64}${"=".repeat((4 - (b64.length % 4)) % 4)}`;
      // In the file the URL is quoted and replaces `null`: it adds its length minus 2.
      if (url.length - 2 > budget) {
        partial = true;
        continue;
      }
      budget -= url.length - 2;
      shots.set(a.report_id, url);
    }
  }
  return { shots, partial };
}

/**
 * As many issues (in order) as fit in `room` characters of JSON, and the room left.
 * @param {Object[]} issues Issues without screenshots.
 * @param {number} room Characters available.
 * @returns {{issues: Object[], room: number, cut: boolean}} Fitted.
 */
function fitIssues(issues, room) {
  const out = [];
  for (const issue of issues) {
    const size = JSON.stringify(issue).length + 1;
    if (size > room) {
      return { issues: out, room: Math.max(0, room), cut: true };
    }
    room -= size;
    out.push(issue);
  }
  return { issues: out, room, cut: false };
}

/**
 * GET /v1/admin/qa/export.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result (raw bytes with an attachment disposition).
 */
export async function handleQaExport(ctx) {
  const format = ctx.url.searchParams.get("format") || "csv";
  if (format !== "csv" && format !== "json") {
    return badRequest("bad_format");
  }
  const range = rangeOf(ctx.url, ctx.now);
  if (range.error) {
    return range.error;
  }
  const hit = await hitRateLimit(ctx, `qa-export:${ctx.account.id}`, EXPORTS_PER_HOUR, 3600);
  if (!hit.ok) {
    return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
  }
  const { rows, partial } = await exportRows(ctx, range);
  const stamp = new Date(ctx.now * 1000).toISOString().slice(0, 10);
  const headers = (type, ext) => ({
    "content-type": type,
    "content-disposition": `attachment; filename="pyarcana-qa-${stamp}.${ext}"`,
    "x-pyarcana-partial": partial ? "1" : "0",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    // The admin page downloads through fetch (cross-origin): it reads the file name and the flag.
    "access-control-expose-headers": "content-disposition, x-pyarcana-partial"
  });
  const audit = { detail: { format, count: rows.length, partial } };
  if (format === "csv") {
    return { status: 200, raw: new TextEncoder().encode(buildCsv(rows)), headers: headers("text/csv; charset=utf-8", "csv"), audit };
  }
  const sessions = await ctx.db
    .prepare("SELECT * FROM qa_sessions WHERE last_active_at >= ?1 AND started_at < ?2 ORDER BY started_at")
    .bind(range.from, range.to)
    .all();
  // tester is empty on purpose: importing must not rename the importer's own tester alias.
  const pkg = {
    schemaVersion: "pyarcana.qa.v1",
    exportedAt: new Date(ctx.now * 1000).toISOString(),
    tester: "",
    sourceDeploymentSha: null,
    issueCount: 0,
    issues: [],
    sessions: (sessions.results || []).map(sessionView),
    partial
  };
  // Text first, measured; then screenshots in whatever room is left (each URL replaces `null`).
  const fit = fitIssues(rows.map((r) => toQaIssue(r, null)), EXPORT_MAX_CHARS - JSON.stringify(pkg).length);
  const shots = await screenshots(ctx, rows.slice(0, fit.issues.length), fit.room);
  pkg.issues = fit.issues.map((issue, i) => ({ ...issue, screenshotDataUrl: shots.shots.get(rows[i].id) || null }));
  pkg.issueCount = pkg.issues.length;
  pkg.partial = partial || fit.cut || shots.partial;
  return {
    status: 200,
    raw: new TextEncoder().encode(JSON.stringify(pkg)),
    headers: { ...headers("application/json; charset=utf-8", "json"), "x-pyarcana-partial": pkg.partial ? "1" : "0" },
    audit: { detail: { ...audit.detail, count: pkg.issueCount, partial: pkg.partial } }
  };
}
