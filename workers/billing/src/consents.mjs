/**
 * The consent record (DESIGN-v3 §F: "On sign-in it is sent to the worker
 * (consents table: account_id, kind, value, version, at) as the record").
 *
 * POST /v1/me/consents {kind: "measurement", value: "granted" | "denied",
 * version: int >= 1, at: ISO time from Date.toISOString() or ""} with a
 * session, the body src/lib/cloud/consent-sync.ts sends. Every call appends
 * a row (the history is the evidence of what was chosen and when); the
 * client sends each choice once per account. `at` is the browser's time and
 * is stored as given (null for ""), next to the server's `created_at`.
 *
 * This stores the record only. It does not, by itself, delete measurement
 * data after a withdrawal: the browser forgets its measurement id and stops
 * sending (consent.ts withdrawConsent).
 */

import { hitRateLimit } from "./ratelimit.mjs";

/** Consent records per account per hour. */
export const CONSENTS_PER_HOUR = 30;

/**
 * True for "" or an exact Date.toISOString() value.
 * @param {unknown} at Value.
 * @returns {boolean} Valid.
 */
function atOk(at) {
  if (at === "") {
    return true;
  }
  if (typeof at !== "string" || at.length !== 24) {
    return false;
  }
  const parsed = new Date(at);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === at;
}

/**
 * The first invalid field's reason, or "".
 * @param {Object} b Body.
 * @returns {string} Reason.
 */
function consentProblem(b) {
  const checks = [
    ["bad_kind", b.kind === "measurement"],
    ["bad_value", b.value === "granted" || b.value === "denied"],
    ["bad_version", Number.isInteger(b.version) && b.version >= 1 && b.version <= 1000],
    ["bad_at", atOk(b.at)]
  ];
  const failed = checks.find(([, ok]) => !ok);
  return failed ? failed[0] : "";
}

/**
 * POST /v1/me/consents.
 * @param {Object} ctx Context with a session (db + pepper).
 * @returns {Promise<Object>} Result.
 */
export async function handleRecordConsent(ctx) {
  const hit = await hitRateLimit(ctx, `consents:${ctx.account.id}`, CONSENTS_PER_HOUR, 3600);
  if (!hit.ok) {
    return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
  }
  const b = ctx.body;
  const problem = consentProblem(b);
  if (problem) {
    return { status: 400, body: { ok: false, reason: problem } };
  }
  await ctx.db
    .prepare("INSERT INTO consents (account_id, kind, value, version, client_at, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
    .bind(ctx.account.id, b.kind, b.value, b.version, b.at || null, ctx.now)
    .run();
  return { status: 200, body: { ok: true } };
}
