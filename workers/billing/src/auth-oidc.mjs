/**
 * Google and Microsoft sign-in, and linking them from a signed-in session.
 *
 * Google (DESIGN-v2 §4): identity (google, sub) first. Otherwise an account
 * holding the same verified email is linked ONLY if it has no Google identity
 * yet AND Google is authoritative for the address (@gmail.com, or an `hd`
 * Workspace claim); anything else is 409 `link_requires_email_code`, so a
 * reassigned mailbox or a lapsed custom domain cannot take over an account.
 *
 * Microsoft (DESIGN-v3): identity (microsoft, "<tid>:<oid>") only. Microsoft
 * email claims do not prove ownership (nOAuth), so there is NO email linking:
 * an email collision is 409 `link_requires_email_code`, and a new account
 * keeps the claimed address for display only (email_normalized NULL, never
 * admin, never matched by email).
 *
 * Linking from the account panel needs a session created in the last 10
 * minutes: adding a sign-in method is an account change (ASVS V3.7), and a
 * stolen session must not be able to plant a permanent way back in.
 */

import {
  createAccountDetailed,
  findIdentity,
  findLiveAccountByEmail,
  getAccount,
  hasProviderIdentity,
  linkIdentity
} from "./accounts.mjs";
import { normalizeEmail } from "./address.mjs";
import { writeAudit } from "./audit.mjs";
import { checkTerms, completeSignIn } from "./auth-session.mjs";
import { googleClientIds, verifyGoogleIdToken } from "./google.mjs";
import { buildMePayload } from "./me.mjs";
import { microsoftClientIds, verifyMicrosoftIdToken } from "./microsoft.mjs";
import { hitRateLimit } from "./ratelimit.mjs";
import { isRecentAuth } from "./sessions.mjs";

/** Sign-in and link attempts allowed per IP per hour, per provider. */
export const OIDC_PER_IP_PER_HOUR = 30;

/**
 * A 409 with a reason.
 * @param {string} reason Reason code.
 * @returns {Object} Result.
 */
function conflict(reason) {
  return { status: 409, body: { ok: false, reason } };
}

/**
 * Map a verification failure to a response.
 * @param {string} reason Verifier reason.
 * @returns {Object} Result.
 */
function tokenFailure(reason) {
  if (reason === "jwks_unavailable") {
    return { status: 503, body: { ok: false, reason: "idp_unavailable" } };
  }
  return { status: 401, body: { ok: false, reason: "invalid_token", detail: reason } };
}

/**
 * Per-IP limit for a provider.
 * @param {Object} ctx Context.
 * @param {string} provider Provider.
 * @returns {Promise<Object|null>} 429 result or null.
 */
async function ipLimit(ctx, provider) {
  const hit = await hitRateLimit(ctx, `oidc:${provider}:ip:${ctx.ip}`, OIDC_PER_IP_PER_HOUR, 3600);
  if (hit.ok) {
    return null;
  }
  return {
    status: 429,
    body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter },
    headers: { "retry-after": String(hit.retryAfter) }
  };
}

/**
 * Attach an identity; if a concurrent request attached it elsewhere first,
 * follow the identity (it is the stronger proof).
 * @param {Object} ctx Context.
 * @param {Object} account Account row.
 * @param {string} provider Provider.
 * @param {{subject: string, email: string|null}} identity Identity.
 * @returns {Promise<{account: Object}>} Resolved account.
 */
async function attach(ctx, account, provider, identity) {
  const linked = await linkIdentity(ctx, { provider, subject: identity.subject, accountId: account.id, emailAtLink: identity.email });
  return { account: linked.ok ? account : await getAccount(ctx.db, linked.accountId) };
}

/**
 * Google may link to an existing account by email only when it is
 * authoritative for the address and the account has no Google identity yet.
 * @param {Object} ctx Context.
 * @param {Object} account Existing account with the same email.
 * @param {Object} identity Verified Google identity.
 * @returns {Promise<{account: Object}|{stop: Object}>} Result.
 */
async function linkGoogleByEmail(ctx, account, identity) {
  const authoritative = identity.emailNormalized.endsWith("@gmail.com") || identity.hd !== null;
  if (!authoritative || (await hasProviderIdentity(ctx.db, account.id, "google"))) {
    return { stop: conflict("link_requires_email_code") };
  }
  return attach(ctx, account, "google", identity);
}

/**
 * The account a verified Google identity signs into.
 * @param {Object} ctx Context.
 * @param {Object} identity Verified Google identity.
 * @returns {Promise<{account: Object}|{stop: Object}>} Result.
 */
async function accountForGoogle(ctx, identity) {
  const known = await findIdentity(ctx.db, "google", identity.subject);
  if (known) {
    return { account: await getAccount(ctx.db, known.account_id) };
  }
  const byEmail = await findLiveAccountByEmail(ctx.db, identity.emailNormalized);
  if (byEmail) {
    return linkGoogleByEmail(ctx, byEmail, identity);
  }
  const made = await createAccountDetailed(ctx, {
    email: identity.email,
    emailNormalized: identity.emailNormalized,
    emailVerified: true,
    displayName: identity.name
  });
  // Lost a race to another sign-in for this email: apply the linking rules.
  return made.created ? attach(ctx, made.account, "google", identity) : linkGoogleByEmail(ctx, made.account, identity);
}

/**
 * The account a verified Microsoft identity signs into. Never by email.
 * @param {Object} ctx Context.
 * @param {Object} identity Verified Microsoft identity.
 * @returns {Promise<{account: Object}|{stop: Object}>} Result.
 */
async function accountForMicrosoft(ctx, identity) {
  const known = await findIdentity(ctx.db, "microsoft", identity.subject);
  if (known) {
    return { account: await getAccount(ctx.db, known.account_id) };
  }
  if (await findLiveAccountByEmail(ctx.db, normalizeEmail(identity.email))) {
    return { stop: conflict("link_requires_email_code") };
  }
  const made = await createAccountDetailed(ctx, {
    email: identity.email,
    emailNormalized: null,
    emailVerified: false,
    displayName: identity.name
  });
  return attach(ctx, made.account, "microsoft", identity);
}

const PROVIDERS = {
  google: {
    configured: (env) => googleClientIds(env).length > 0,
    verify: (ctx) => verifyGoogleIdToken(ctx.body.idToken, ctx.env, ctx),
    resolve: accountForGoogle,
    emailVerified: (account, identity) => account.email_normalized === identity.emailNormalized
  },
  microsoft: {
    configured: (env) => microsoftClientIds(env).length > 0,
    verify: (ctx) => verifyMicrosoftIdToken(ctx.body.idToken, ctx.body.nonce, ctx.env, ctx),
    resolve: accountForMicrosoft,
    emailVerified: () => false
  }
};

/**
 * Verify a provider token after the config and rate checks.
 * @param {Object} ctx Context.
 * @param {string} name Provider name.
 * @returns {Promise<{stop: Object}|{identity: Object}>} Identity or stop.
 */
async function verifiedIdentity(ctx, name) {
  const provider = PROVIDERS[name];
  if (!provider.configured(ctx.env)) {
    return { stop: { status: 503, body: { ok: false, reason: `${name}_not_configured` } } };
  }
  const limited = await ipLimit(ctx, name);
  if (limited) {
    return { stop: limited };
  }
  const verified = await provider.verify(ctx);
  return verified.ok ? { identity: verified.identity } : { stop: tokenFailure(verified.reason) };
}

/**
 * Sign in with a provider.
 * @param {Object} ctx Context.
 * @param {string} name Provider name.
 * @returns {Promise<Object>} Result.
 */
async function signInWith(ctx, name) {
  const configured = PROVIDERS[name].configured(ctx.env);
  const terms = configured ? checkTerms(ctx) : null;
  if (terms) {
    return terms;
  }
  const verified = await verifiedIdentity(ctx, name);
  if (verified.stop) {
    return verified.stop;
  }
  const resolved = await PROVIDERS[name].resolve(ctx, verified.identity);
  if (resolved.stop) {
    return resolved.stop;
  }
  const emailVerified = PROVIDERS[name].emailVerified(resolved.account, verified.identity);
  return completeSignIn(ctx, resolved.account, name, { emailVerified });
}

/**
 * Link a provider identity to the signed-in account.
 * @param {Object} ctx Context with a session.
 * @param {string} name Provider name.
 * @returns {Promise<Object>} Result.
 */
async function linkWith(ctx, name) {
  if (!isRecentAuth(ctx.session, ctx.now)) {
    return { status: 401, body: { ok: false, reason: "reauth_required" } };
  }
  const verified = await verifiedIdentity(ctx, name);
  if (verified.stop) {
    return verified.stop;
  }
  const { identity } = verified;
  const existing = await findIdentity(ctx.db, name, identity.subject);
  if (existing && existing.account_id !== ctx.account.id) {
    return conflict("identity_in_use");
  }
  if (!existing && (await hasProviderIdentity(ctx.db, ctx.account.id, name))) {
    return conflict("provider_already_linked");
  }
  const linked = await linkIdentity(ctx, { provider: name, subject: identity.subject, accountId: ctx.account.id, emailAtLink: identity.email });
  if (!linked.ok) {
    return conflict("identity_in_use");
  }
  if (!existing) {
    await writeAudit(ctx, { action: "identity.link", actorAccountId: ctx.account.id, targetAccountId: ctx.account.id, detail: { provider: name } });
  }
  return { status: 200, body: await buildMePayload(ctx, ctx.account, ctx.session) };
}

/**
 * POST /v1/auth/google {idToken, ageConfirmed, termsVersion}.
 * @param {Object} ctx Context.
 * @returns {Promise<Object>} Result.
 */
export function handleGoogleSignIn(ctx) {
  return signInWith(ctx, "google");
}

/**
 * POST /v1/auth/microsoft {idToken, nonce, ageConfirmed, termsVersion}.
 * @param {Object} ctx Context.
 * @returns {Promise<Object>} Result.
 */
export function handleMicrosoftSignIn(ctx) {
  return signInWith(ctx, "microsoft");
}

/**
 * POST /v1/me/link/google {idToken}.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export function handleLinkGoogle(ctx) {
  return linkWith(ctx, "google");
}

/**
 * POST /v1/me/link/microsoft {idToken, nonce}.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export function handleLinkMicrosoft(ctx) {
  return linkWith(ctx, "microsoft");
}
