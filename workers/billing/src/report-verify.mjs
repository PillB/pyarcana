/**
 * Tester verification of reports (owner request 2026-11-19: testers check
 * their own reports and each other's).
 *
 *   POST   /v1/qa/reports/:id/verifications {result, note?, deploymentSha?}  tester or admin
 *   DELETE /v1/qa/reports/:id/verifications                                  withdraws the caller's own
 *
 * A verification records whether one tester could reproduce a report, or
 * found it fixed on a retest, on which build, with an optional note. It is the confirm step of a bug
 * tracker (Bugzilla's "canconfirm" privilege), kept apart from triage: it
 * never changes a report's status, duplicate link or admin note, which stay
 * PATCH /v1/admin/reports/:id (admin only).
 *
 * One row per (report, account), so a tester who checks again replaces their
 * own answer instead of adding weight; nobody can write or withdraw another
 * account's row. Readers see each verification's result, note, build, time,
 * `mine`, and `byReporter` (the report's own author re-checking, which
 * confirms less than an independent tester does) — never the verifier's
 * account id or email, as the tester view of a report carries no identity.
 *
 * The rows go with their report in the retention sweep and with the
 * verifier's account on erasure (privacy.mjs), and appear in that account's
 * export.
 */

import { badRequest, enumValue, INVALID, optionalText, parseFields } from "./input.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

/**
 * Results a verification can record: the report still happens, it does not
 * happen for this tester, or a retest after a fix found it fixed. "fixed" is
 * a tester's claim that puts the report in the review queue; closing it is
 * the supervisor's or admin's status change, never the claim itself.
 */
export const VERIFICATION_RESULTS = ["reproduced", "not_reproduced", "fixed"];

/** Verification writes (record or withdraw) allowed per account per hour. */
export const VERIFICATIONS_PER_HOUR = 120;

/** The longest note a verification keeps. */
export const VERIFICATION_NOTE_MAX = 1000;

const SHA = /^[0-9a-f]{7,64}$/i;

const NOT_FOUND = { status: 404, body: { ok: false, reason: "not_found" } };

const ALLOWED_KEYS = new Set(["result", "note", "deploymentSha"]);

/**
 * A build id, or null when absent.
 * @param {unknown} value Raw value.
 * @returns {string|null|symbol} SHA, null or INVALID.
 */
function shaValue(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return typeof value === "string" && SHA.test(value) ? value.toLowerCase() : INVALID;
}

const FIELDS = [
  ["result", (b) => enumValue(b.result, VERIFICATION_RESULTS), "bad_result"],
  ["note", (b) => optionalText(b.note, VERIFICATION_NOTE_MAX), "bad_note"],
  ["deploymentSha", (b) => shaValue(b.deploymentSha), "bad_deployment_sha"]
];

/**
 * Parse a verification body: known keys only, each valid.
 * @param {unknown} body Request body.
 * @returns {{values: Object}|{error: Object}} Parsed values or a 400.
 */
export function parseVerification(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: badRequest("bad_verification") };
  }
  if (Object.keys(body).some((key) => !ALLOWED_KEYS.has(key))) {
    return { error: badRequest("bad_verification") };
  }
  return parseFields(body, FIELDS);
}

/**
 * Spend one verification write, or the 429 to return.
 * @param {Object} ctx Context.
 * @returns {Promise<Object|null>} Stop result or null.
 */
async function writeBudget(ctx) {
  const hit = await hitRateLimit(ctx, `qa-verify:${ctx.account.id}`, VERIFICATIONS_PER_HOUR, 3600);
  if (hit.ok) {
    return null;
  }
  return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
}

/**
 * The report's id and author, or null when there is no such report.
 * @param {Object} db D1 binding.
 * @param {string} id Report id.
 * @returns {Promise<{id: string, account_id: string|null}|null>} Row.
 */
function reportOwner(db, id) {
  return db.prepare("SELECT id, account_id FROM reports WHERE id = ?1").bind(id).first();
}

/**
 * Every verification of a report, as testers and admins read them.
 * @param {Object} ctx Context (viewer).
 * @param {string} reportId Report id.
 * @returns {Promise<Object[]>} Views, oldest first.
 */
export async function verificationsOf(ctx, reportId) {
  const rows = await ctx.db
    .prepare(
      `SELECT v.*, r.account_id AS reporter_id FROM report_verifications v JOIN reports r ON r.id = v.report_id
       WHERE v.report_id = ?1 ORDER BY v.created_at, v.account_id`
    )
    .bind(reportId)
    .all();
  return rows.results.map((v) => ({
    result: v.result,
    note: v.note,
    deploymentSha: v.deployment_sha,
    createdAt: Number(v.created_at),
    updatedAt: Number(v.updated_at),
    mine: v.account_id === ctx.account.id,
    byReporter: v.reporter_id !== null && v.account_id === v.reporter_id
  }));
}

/**
 * POST /v1/qa/reports/:id/verifications. Records or replaces the caller's own.
 * @param {Object} ctx Tester or admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleVerifyReport(ctx) {
  const parsed = parseVerification(ctx.body);
  if (parsed.error) {
    return parsed.error;
  }
  const report = await reportOwner(ctx.db, ctx.params.id);
  if (!report) {
    return NOT_FOUND;
  }
  const stop = await writeBudget(ctx);
  if (stop) {
    return stop;
  }
  const { result, note, deploymentSha } = parsed.values;
  await ctx.db
    .prepare(
      `INSERT INTO report_verifications (report_id, account_id, result, note, deployment_sha, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)
       ON CONFLICT (report_id, account_id) DO UPDATE SET
         result = excluded.result, note = excluded.note, deployment_sha = excluded.deployment_sha, updated_at = excluded.updated_at`
    )
    .bind(report.id, ctx.account.id, result, note, deploymentSha, ctx.now)
    .run();
  return { status: 200, body: { ok: true, verifications: await verificationsOf(ctx, report.id) } };
}

/**
 * DELETE /v1/qa/reports/:id/verifications. Withdraws the caller's own; idempotent.
 * @param {Object} ctx Tester or admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleWithdrawVerification(ctx) {
  const report = await reportOwner(ctx.db, ctx.params.id);
  if (!report) {
    return NOT_FOUND;
  }
  const stop = await writeBudget(ctx);
  if (stop) {
    return stop;
  }
  const removed = await ctx.db
    .prepare("DELETE FROM report_verifications WHERE report_id = ?1 AND account_id = ?2")
    .bind(report.id, ctx.account.id)
    .run();
  return { status: 200, body: { ok: true, withdrawn: removed.meta.changes, verifications: await verificationsOf(ctx, report.id) } };
}
