/**
 * Emailed six-digit sign-in codes (DESIGN-v2 §4).
 *
 * - Stored as HMAC(pepper, "login:<email>:<code>"), never in clear.
 * - Up to 3 live codes per email; a new code does not consume earlier ones
 *   (so an attacker requesting codes cannot invalidate the victim's). The cap
 *   is enforced inside the INSERT itself, so concurrent requests cannot
 *   overshoot it.
 * - Verification spends the attempt BEFORE comparing:
 *     UPDATE ... SET attempts = attempts + 1 ... AND attempts < 5 RETURNING
 *   Only rows that come back are compared (constant time), so each code is
 *   compared at most 5 times however many requests race. The read-then-write
 *   version this replaces handed the stored hash out 200 times to 200
 *   concurrent guesses (tests/logincodes.test.mjs).
 * - A match is consumed with `... AND consumed_at IS NULL` and must change
 *   exactly one row; then the email's other live codes are retired.
 */

import { constantTimeEqual, hmacHex, randomDigits, randomId } from "./crypto.mjs";

/** Validity of a code (15 minutes). */
export const LOGIN_CODE_TTL_SECONDS = 900;

/** Comparisons allowed per code. */
export const LOGIN_CODE_MAX_ATTEMPTS = 5;

/** Live codes allowed per email. */
export const LOGIN_CODE_MAX_LIVE = 3;

/** Digits per code. */
export const LOGIN_CODE_DIGITS = 6;

/**
 * The stored MAC of a code.
 * @param {Uint8Array} pepper Decoded pepper.
 * @param {string} email Normalized email.
 * @param {string} code Digits.
 * @returns {Promise<string>} Hex HMAC.
 */
function codeMac(pepper, email, code) {
  return hmacHex(pepper, `login:${email}:${code}`);
}

/**
 * Issue a code, unless the email already has the maximum of live codes.
 * @param {{db: Object, pepper: Uint8Array, now: number}} ctx Context.
 * @param {string} email Normalized email.
 * @returns {Promise<{ok: true, id: string, code: string, expiresAt: number}|
 *                   {ok: false, reason: "too_many_codes", retryAfter: number}>} Result.
 */
export async function issueLoginCode(ctx, email) {
  const id = randomId("code");
  const code = randomDigits(LOGIN_CODE_DIGITS);
  const expiresAt = ctx.now + LOGIN_CODE_TTL_SECONDS;
  const inserted = await ctx.db
    .prepare(
      `INSERT INTO login_codes (id, email_normalized, code_hmac, created_at, expires_at, attempts)
       SELECT ?1, ?2, ?3, ?4, ?5, 0
       WHERE (SELECT COUNT(*) FROM login_codes
              WHERE email_normalized = ?2 AND consumed_at IS NULL AND expires_at > ?4 AND attempts < ?6) < ?7`
    )
    .bind(id, email, await codeMac(ctx.pepper, email, code), ctx.now, expiresAt, LOGIN_CODE_MAX_ATTEMPTS, LOGIN_CODE_MAX_LIVE)
    .run();
  if (inserted.meta.changes === 1) {
    return { ok: true, id, code, expiresAt };
  }
  const soonest = await ctx.db
    .prepare(
      `SELECT MIN(expires_at) AS e FROM login_codes
       WHERE email_normalized = ?1 AND consumed_at IS NULL AND expires_at > ?2 AND attempts < ?3`
    )
    .bind(email, ctx.now, LOGIN_CODE_MAX_ATTEMPTS)
    .first("e");
  return { ok: false, reason: "too_many_codes", retryAfter: Math.max(1, Number(soonest || expiresAt) - ctx.now) };
}

/**
 * Retire one code (e.g. when its email could not be sent).
 * @param {{db: Object, now: number}} ctx Context.
 * @param {string} id Code id.
 * @returns {Promise<void>} Resolves when retired.
 */
export async function retireLoginCode(ctx, id) {
  await ctx.db.prepare("UPDATE login_codes SET consumed_at = ?2 WHERE id = ?1 AND consumed_at IS NULL").bind(id, ctx.now).run();
}

/**
 * Consume a matched code and retire the email's other live codes.
 * @param {{db: Object, now: number}} ctx Context.
 * @param {string} email Normalized email.
 * @param {string} id Matched code id.
 * @returns {Promise<boolean>} True when this request consumed it.
 */
async function consume(ctx, email, id) {
  const [claimed] = await ctx.db.batch([
    ctx.db.prepare("UPDATE login_codes SET consumed_at = ?2 WHERE id = ?1 AND consumed_at IS NULL").bind(id, ctx.now),
    ctx.db
      .prepare("UPDATE login_codes SET consumed_at = ?2 WHERE email_normalized = ?1 AND consumed_at IS NULL AND id <> ?3")
      .bind(email, ctx.now, id)
  ]);
  return claimed.meta.changes === 1;
}

/**
 * Verify a submitted code.
 * @param {{db: Object, pepper: Uint8Array, now: number}} ctx Context.
 * @param {string} email Normalized email.
 * @param {string} code Six digits (already shape-checked by the route).
 * @returns {Promise<{ok: true}|{ok: false, reason: "bad_code"|"code_expired"}>} Result.
 */
export async function verifyLoginCode(ctx, email, code) {
  const expected = await codeMac(ctx.pepper, email, code);
  const spent = await ctx.db
    .prepare(
      `UPDATE login_codes SET attempts = attempts + 1
       WHERE email_normalized = ?1 AND consumed_at IS NULL AND expires_at > ?2 AND attempts < ?3
       RETURNING id, code_hmac`
    )
    .bind(email, ctx.now, LOGIN_CODE_MAX_ATTEMPTS)
    .all();
  if (!spent.results.length) {
    return { ok: false, reason: "code_expired" };
  }
  const match = spent.results.find((row) => constantTimeEqual(row.code_hmac, expected));
  if (!match) {
    return { ok: false, reason: "bad_code" };
  }
  return (await consume(ctx, email, match.id)) ? { ok: true } : { ok: false, reason: "code_expired" };
}
