/**
 * POST /v1/auth/email/start and POST /v1/auth/email/verify (DESIGN-v2 §4).
 *
 * start: terms gate -> email shape -> per-IP 10/h, per email+IP 5/h, per
 * email 8/h -> at most 3 live codes -> global daily cap -> send. The limits
 * never look at whether the address has an account, so an honest
 * `429 rate_limited {retryAfter}` reveals nothing. Provider trouble is an
 * honest `503 email_unavailable`, and the unsent code is retired.
 *
 * verify: terms gate -> shape -> per-IP 30/h -> per-email failure cap
 * (20 per UTC day; after that only Google/Microsoft sign-in works for that
 * address until the window rolls) -> atomic attempt-then-compare.
 */

import { createAccount, findLiveAccountByEmail, linkIdentity } from "./accounts.mjs";
import { normalizeEmail } from "./address.mjs";
import { checkTerms, completeSignIn } from "./auth-session.mjs";
import { emailConfigured, sendLoginCode } from "./email.mjs";
import { LOGIN_CODE_TTL_SECONDS, issueLoginCode, retireLoginCode, verifyLoginCode } from "./logincodes.mjs";
import { hitRateLimit, peekRateLimit } from "./ratelimit.mjs";

const HOUR = 3600;
const DAY = 86400;

/** Verify failures allowed per email per UTC day. */
export const VERIFY_FAILURES_PER_DAY = 20;

/**
 * An honest 429.
 * @param {number} retryAfter Seconds.
 * @returns {Object} Result.
 */
function rateLimited(retryAfter) {
  return {
    status: 429,
    body: { ok: false, reason: "rate_limited", retryAfter },
    headers: { "retry-after": String(retryAfter) }
  };
}

/**
 * Spend one hit from each bucket in order; stop at the first refusal.
 * @param {Object} ctx Context.
 * @param {Array<[string, number, number]>} buckets `[name, limit, window]`.
 * @returns {Promise<Object|null>} 429 result or null.
 */
async function spendLimits(ctx, buckets) {
  for (const [name, limit, windowSeconds] of buckets) {
    const hit = await hitRateLimit(ctx, name, limit, windowSeconds);
    if (!hit.ok) {
      return rateLimited(hit.retryAfter);
    }
  }
  return null;
}

/**
 * Terms and email-shape checks shared by both routes.
 * @param {Object} ctx Context.
 * @returns {{stop: Object}|{email: string}} Stop result or the normalized email.
 */
function readEmailRequest(ctx) {
  const terms = checkTerms(ctx);
  if (terms) {
    return { stop: terms };
  }
  const email = normalizeEmail(ctx.body.email);
  return email ? { email } : { stop: { status: 400, body: { ok: false, reason: "bad_email" } } };
}

/**
 * POST /v1/auth/email/start {email, ageConfirmed, termsVersion}.
 * @param {Object} ctx Context.
 * @returns {Promise<Object>} Result.
 */
export async function handleEmailStart(ctx) {
  if (!emailConfigured(ctx.env)) {
    return { status: 503, body: { ok: false, reason: "email_not_configured" } };
  }
  const request = readEmailRequest(ctx);
  if (request.stop) {
    return request.stop;
  }
  const { email } = request;
  const limited = await spendLimits(ctx, [
    [`start:ip:${ctx.ip}`, 10, HOUR],
    [`start:email-ip:${email}:${ctx.ip}`, 5, HOUR],
    [`start:email:${email}`, 8, HOUR]
  ]);
  if (limited) {
    return limited;
  }
  const issued = await issueLoginCode(ctx, email);
  if (!issued.ok) {
    return rateLimited(issued.retryAfter);
  }
  const sent = await sendLoginCode(ctx, email, issued.code, Math.floor(LOGIN_CODE_TTL_SECONDS / 60));
  if (!sent.ok) {
    await retireLoginCode(ctx, issued.id);
    return { status: 503, body: { ok: false, reason: sent.reason } };
  }
  return { status: 200, body: { ok: true, expiresInSeconds: LOGIN_CODE_TTL_SECONDS } };
}

/**
 * Seconds until the current UTC-day window ends.
 * @param {number} now Clock.
 * @returns {number} Seconds.
 */
function untilWindowEnd(now) {
  return DAY - (now % DAY);
}

/**
 * The live account for a proven email, created on first sign-in.
 * @param {Object} ctx Context.
 * @param {string} email Proven, normalized email.
 * @returns {Promise<Object>} Account row.
 */
async function accountForProvenEmail(ctx, email) {
  const existing = await findLiveAccountByEmail(ctx.db, email);
  const account = existing || (await createAccount(ctx, { email, emailNormalized: email, emailVerified: true }));
  // The address is proven either way; an email identity left on another
  // account (after an admin rectification) must not block the sign-in.
  await linkIdentity(ctx, { provider: "email", subject: email, accountId: account.id, emailAtLink: email });
  return account;
}

/**
 * POST /v1/auth/email/verify {email, code, ageConfirmed, termsVersion}.
 * @param {Object} ctx Context.
 * @returns {Promise<Object>} Result.
 */
export async function handleEmailVerify(ctx) {
  const request = readEmailRequest(ctx);
  if (request.stop) {
    return request.stop;
  }
  const { email } = request;
  const code = typeof ctx.body.code === "string" ? ctx.body.code.replace(/\s+/g, "") : "";
  if (!/^\d{6}$/.test(code)) {
    return { status: 400, body: { ok: false, reason: "bad_code" } };
  }
  const limited = await spendLimits(ctx, [[`verify:ip:${ctx.ip}`, 30, HOUR]]);
  if (limited) {
    return limited;
  }
  const failBucket = `verify:fail:${email}`;
  if ((await peekRateLimit(ctx, failBucket, DAY)) >= VERIFY_FAILURES_PER_DAY) {
    return rateLimited(untilWindowEnd(ctx.now));
  }
  const verified = await verifyLoginCode(ctx, email, code);
  if (!verified.ok) {
    await hitRateLimit(ctx, failBucket, VERIFY_FAILURES_PER_DAY, DAY);
    return { status: 401, body: { ok: false, reason: verified.reason } };
  }
  const account = await accountForProvenEmail(ctx, email);
  return completeSignIn(ctx, account, "email", { emailVerified: true });
}
