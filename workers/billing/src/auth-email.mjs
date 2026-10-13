/**
 * POST /v1/auth/email/start and POST /v1/auth/email/verify (DESIGN-v2 §4).
 *
 * start: terms gate -> email shape -> per-network 10/h, per-network daily
 * share of the global cap (EMAIL_DAILY_CAP / 9, so 10 of the default 90), per
 * email+network 5/h, per email 8/h -> at most 3 live codes -> global daily
 * cap -> send. "Network" is the IPv4 address or the IPv6 /64
 * (http.networkKey): one host rotating through its /64, or one IPv4 address
 * sending all day, can take only its share, never the whole global cap that
 * every other learner's sign-in depends on. The limits never look at whether
 * the address has an account, so an honest `429 rate_limited {retryAfter}`
 * reveals nothing. Provider trouble is an honest `503 email_unavailable`, and
 * the unsent code is retired.
 * Stated trade-off: a classroom behind ONE IPv4 NAT shares that network's
 * 10 codes a day (Google and Microsoft sign-in are not limited this way).
 *
 * verify: terms gate -> shape -> per-network 30/h -> per-email attempt cap
 * (20 per UTC day, spent atomically BEFORE comparing, so a concurrent burst
 * cannot overshoot it; every attempt counts, a success included — one real
 * sign-in a day costs nothing; after that only Google/Microsoft sign-in works
 * for that address until the window rolls) -> atomic attempt-then-compare.
 */

import { createAccount, findLiveAccountByEmail, linkIdentity } from "./accounts.mjs";
import { normalizeEmail } from "./address.mjs";
import { checkTerms, completeSignIn } from "./auth-session.mjs";
import { SIGNUP_CLOSED, emailDailyCap, signupOpen } from "./config.mjs";
import { emailConfigured, sendLoginCode } from "./email.mjs";
import { LOGIN_CODE_TTL_SECONDS, issueLoginCode, retireLoginCode, verifyLoginCode } from "./logincodes.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

const HOUR = 3600;
const DAY = 86400;

/** Verify attempts allowed per email per UTC day (successes count too). */
export const VERIFY_ATTEMPTS_PER_DAY = 20;

/** One network may take at most 1/NETWORK_SHARE_DIVISOR of the global daily email cap. */
export const NETWORK_SHARE_DIVISOR = 9;

/**
 * Codes one network may request per UTC day.
 * @param {Object} env Worker env.
 * @returns {number} Codes.
 */
export function networkDailyCodes(env) {
  return Math.max(1, Math.floor(emailDailyCap(env) / NETWORK_SHARE_DIVISOR));
}

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
    [`start:net-day:${ctx.ip}`, networkDailyCodes(ctx.env), DAY],
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
 * The live account for a proven email, created on first sign-in (null while sign-up is closed).
 * @param {Object} ctx Context.
 * @param {string} email Proven, normalized email.
 * @returns {Promise<Object|null>} Account row.
 */
async function accountForProvenEmail(ctx, email) {
  const existing = await findLiveAccountByEmail(ctx.db, email);
  if (!existing && !signupOpen(ctx.env, email)) {
    return null;
  }
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
  const limited = await spendLimits(ctx, [
    [`verify:ip:${ctx.ip}`, 30, HOUR],
    [`verify:email:${email}`, VERIFY_ATTEMPTS_PER_DAY, DAY]
  ]);
  if (limited) {
    return limited;
  }
  const verified = await verifyLoginCode(ctx, email, code);
  if (!verified.ok) {
    return { status: 401, body: { ok: false, reason: verified.reason } };
  }
  const account = await accountForProvenEmail(ctx, email);
  if (!account) {
    return SIGNUP_CLOSED;
  }
  return completeSignIn(ctx, account, "email", { emailVerified: true, subject: email });
}
