/**
 * Atomic fixed-window rate limiter over the `rate_limits` table.
 *
 * One statement increments the bucket and returns the new count
 * (INSERT ... ON CONFLICT DO UPDATE ... RETURNING), so concurrent requests
 * cannot all read "under the limit" before any of them writes; the
 * read-then-write limiter this replaces let 50 of 50 concurrent hits through a
 * limit of 10 (tests/ratelimit.test.mjs).
 *
 * Bucket keys are HMAC(pepper, window:name), so emails and IPs never sit in
 * the table in clear. Refused hits still count, which is what an attacker
 * hammering a bucket should see.
 *
 * Fixed windows can admit up to 2x the limit across a boundary; these limits
 * stop code guessing and email bombing, they do not meter a paid API.
 */

import { hmacHex } from "./crypto.mjs";

/**
 * The stored bucket key for a limit name.
 * @param {Uint8Array} pepper Decoded SERVER_PEPPER.
 * @param {string} name Logical bucket, e.g. `start:ip:<ip>`.
 * @param {number} windowSeconds Window length.
 * @returns {Promise<string>} Hex HMAC.
 */
export function bucketKey(pepper, name, windowSeconds) {
  return hmacHex(pepper, `rl:${windowSeconds}:${name}`);
}

/**
 * Start of the fixed window containing `now`.
 * @param {number} now Epoch seconds.
 * @param {number} windowSeconds Window length.
 * @returns {number} Window start.
 */
function windowStartOf(now, windowSeconds) {
  return now - (now % windowSeconds);
}

/**
 * Spend one hit from a bucket.
 * @param {{db: Object, pepper: Uint8Array, now: number}} ctx Request context.
 * @param {string} name Logical bucket name.
 * @param {number} limit Hits allowed per window.
 * @param {number} windowSeconds Window length.
 * @returns {Promise<{ok: boolean, count: number, retryAfter: number}>} Decision.
 */
export async function hitRateLimit(ctx, name, limit, windowSeconds) {
  const windowStart = windowStartOf(ctx.now, windowSeconds);
  const bucket = await bucketKey(ctx.pepper, name, windowSeconds);
  const count = await ctx.db
    .prepare(
      `INSERT INTO rate_limits (bucket, count, window_start) VALUES (?1, 1, ?2)
       ON CONFLICT (bucket) DO UPDATE SET
         count = CASE WHEN rate_limits.window_start = excluded.window_start THEN rate_limits.count + 1 ELSE 1 END,
         window_start = excluded.window_start
       RETURNING count`
    )
    .bind(bucket, windowStart)
    .first("count");
  if (count > limit) {
    return { ok: false, count, retryAfter: windowStart + windowSeconds - ctx.now };
  }
  return { ok: true, count, retryAfter: 0 };
}

/**
 * Read a bucket's count in the current window without spending.
 * @param {{db: Object, pepper: Uint8Array, now: number}} ctx Request context.
 * @param {string} name Logical bucket name.
 * @param {number} windowSeconds Window length.
 * @returns {Promise<number>} Hits so far in this window.
 */
export async function peekRateLimit(ctx, name, windowSeconds) {
  const bucket = await bucketKey(ctx.pepper, name, windowSeconds);
  const count = await ctx.db
    .prepare("SELECT count FROM rate_limits WHERE bucket = ?1 AND window_start = ?2")
    .bind(bucket, windowStartOf(ctx.now, windowSeconds))
    .first("count");
  return Number(count) || 0;
}

/**
 * Spend `amount` units (e.g. bytes) from a budget, all or nothing: the
 * upsert only applies when the new total stays within `limit`, in ONE
 * statement, so concurrent spenders cannot overshoot it. Unlike
 * hitRateLimit, a refused spend costs nothing.
 * @param {{db: Object, pepper: Uint8Array, now: number}} ctx Request context.
 * @param {string} name Logical budget name.
 * @param {number} amount Units to spend (> 0).
 * @param {number} limit Units allowed per window.
 * @param {number} windowSeconds Window length.
 * @returns {Promise<{ok: boolean, retryAfter: number}>} Decision.
 */
export async function spendBudget(ctx, name, amount, limit, windowSeconds) {
  const windowStart = windowStartOf(ctx.now, windowSeconds);
  const refused = { ok: false, retryAfter: windowStart + windowSeconds - ctx.now };
  if (!(amount > 0) || amount > limit) {
    return amount > 0 ? refused : { ok: true, retryAfter: 0 };
  }
  const bucket = await bucketKey(ctx.pepper, name, windowSeconds);
  const next = "CASE WHEN rate_limits.window_start = excluded.window_start THEN rate_limits.count + excluded.count ELSE excluded.count END";
  const total = await ctx.db
    .prepare(
      `INSERT INTO rate_limits (bucket, count, window_start) VALUES (?1, ?3, ?2)
       ON CONFLICT (bucket) DO UPDATE SET count = ${next}, window_start = excluded.window_start
       WHERE ${next} <= ?4
       RETURNING count`
    )
    .bind(bucket, windowStart, amount, limit)
    .first("count");
  return total === null || total === undefined ? refused : { ok: true, retryAfter: 0 };
}
