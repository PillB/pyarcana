/**
 * Google and Microsoft sign-in, and linking them from a signed-in session.
 *
 * Google (DESIGN-v2 §4): identity (google, sub) first. Otherwise an account
 * holding the same verified email is linked ONLY if it has no Google identity
 * yet AND Google is authoritative for the address (@gmail.com, or an `hd`
 * Workspace claim); anything else is 409 `link_requires_email_code`, so a
 * reassigned mailbox or a lapsed custom domain cannot take over an account.
 * A NEW account from a non-authoritative Google address keeps that address
 * for display only (email_normalized NULL, like Microsoft): otherwise the
 * earlier holder of a reassigned mailbox would occupy the address and the
 * new owner's email-code sign-in would land in the old holder's account.
 *
 * Admin-listed addresses (ADMIN_EMAILS) link only a Google identity for the
 * SAME address (409 admin_identity_mismatch), so one intercepted email code
 * cannot attach a stranger's Google account to the admin account.
 *
 * Microsoft (DESIGN-v3): identity (microsoft, "<tid>:<oid>") only. Microsoft
 * email claims do not prove ownership (nOAuth), so there is NO email linking:
 * an email collision is 409 `link_requires_email_code`, and a new account
 * keeps the claimed address for display only (email_normalized NULL, never
 * admin, never matched by email).
 *
 * Linking from the account panel needs a session created in the last 10
 * minutes: adding a sign-in method is an account change (ASVS V3.7), and a
 * stolen session must not be able to plant a permanent way back in. A new
 * link is audited and notified to the account's proven address, and the
 * owner can see and remove it (identities.mjs).
 *
 * Every route takes {idToken, noncePreimage} (DESIGN-v3 §B): the token's
 * nonce must be base64url(SHA-256(preimage)), and the nonce is spent on
 * first use (nonce.mjs), so a captured or replayed token is refused with
 * 401 invalid_token / token_replayed.
 */

import {
  createAccountDetailed,
  findIdentity,
  findLiveAccountByEmail,
  getAccount,
  hasProviderIdentity,
  isListedAdminAddress,
  linkIdentity
} from "./accounts.mjs";
import { normalizeEmail } from "./address.mjs";
import { SIGNUP_CLOSED, signupOpen } from "./config.mjs";
import { writeAudit } from "./audit.mjs";
import { notifyMethodChange } from "./email.mjs";
import { checkTerms, completeSignIn } from "./auth-session.mjs";
import { googleClientIds, verifyGoogleIdToken } from "./google.mjs";
import { buildMePayload } from "./me.mjs";
import { microsoftClientIds, verifyMicrosoftIdToken } from "./microsoft.mjs";
import { expectedNonce, spendNonce } from "./nonce.mjs";
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
 * @param {{subject: string, email: string|null, authoritative?: boolean}} identity Identity.
 * @returns {Promise<{account: Object}>} Resolved account.
 */
async function attach(ctx, account, provider, identity) {
  const linked = await linkIdentity(ctx, identityLink(provider, identity, account.id));
  return { account: linked.ok ? account : await getAccount(ctx.db, linked.accountId) };
}

/**
 * The identities row for a verified identity.
 * @param {string} provider Provider.
 * @param {{subject: string, email: string|null, authoritative?: boolean}} identity Identity.
 * @param {string} accountId Account id.
 * @returns {Object} linkIdentity input.
 */
function identityLink(provider, identity, accountId) {
  return { provider, subject: identity.subject, accountId, emailAtLink: identity.email, emailAuthoritative: identity.authoritative === true };
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
  if (!identity.authoritative || (await hasProviderIdentity(ctx.db, account.id, "google"))) {
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
  if (!signupOpen(ctx.env, identity.authoritative ? identity.emailNormalized : null)) {
    return { stop: SIGNUP_CLOSED };
  }
  // A non-authoritative address is display-only (email_normalized NULL).
  const made = await createAccountDetailed(ctx, {
    email: identity.email,
    emailNormalized: identity.authoritative ? identity.emailNormalized : null,
    emailVerified: identity.authoritative,
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
  // Microsoft never proves an address here, so a closed sign-up refuses every new Microsoft account.
  if (!signupOpen(ctx.env, null)) {
    return { stop: SIGNUP_CLOSED };
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
    verify: verifyGoogleIdToken,
    resolve: accountForGoogle,
    emailVerified: (account, identity) => identity.authoritative && account.email_normalized === identity.emailNormalized
  },
  microsoft: {
    configured: (env) => microsoftClientIds(env).length > 0,
    verify: verifyMicrosoftIdToken,
    resolve: accountForMicrosoft,
    emailVerified: () => false
  }
};

/**
 * Verify a provider token after the config and rate checks: the nonce must
 * derive from the posted preimage, and it is spent on first use.
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
  const nonce = await expectedNonce(ctx.body.noncePreimage);
  if (!nonce) {
    return { stop: tokenFailure("bad_nonce") };
  }
  const verified = await provider.verify(ctx.body.idToken, ctx.env, { fetchImpl: ctx.fetchImpl, now: ctx.now, nonce });
  if (!verified.ok) {
    return { stop: tokenFailure(verified.reason) };
  }
  if (!(await spendNonce(ctx, verified.nonce, verified.expiresAt))) {
    return { stop: tokenFailure("token_replayed") };
  }
  return { identity: verified.identity };
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
  return completeSignIn(ctx, resolved.account, name, { emailVerified, subject: verified.identity.subject });
}

/**
 * Why this identity may not be linked to the signed-in account, or null.
 * @param {Object} ctx Context with a session.
 * @param {string} name Provider.
 * @param {Object} identity Verified identity.
 * @returns {Promise<string|null>} 409 reason, or null.
 */
async function linkRefusal(ctx, name, identity) {
  const existing = await findIdentity(ctx.db, name, identity.subject);
  if (existing && existing.account_id !== ctx.account.id) {
    return "identity_in_use";
  }
  if (!existing && (await hasProviderIdentity(ctx.db, ctx.account.id, name))) {
    return "provider_already_linked";
  }
  const sameAddress = identity.emailNormalized === ctx.account.email_normalized;
  if (!existing && name === "google" && isListedAdminAddress(ctx.env, ctx.account) && !sameAddress) {
    return "admin_identity_mismatch";
  }
  return null;
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
  const refusal = await linkRefusal(ctx, name, identity);
  if (refusal) {
    return conflict(refusal);
  }
  const linked = await linkIdentity(ctx, identityLink(name, identity, ctx.account.id));
  if (!linked.ok) {
    return conflict("identity_in_use");
  }
  if (!existing) {
    await writeAudit(ctx, { action: "identity.link", actorAccountId: ctx.account.id, targetAccountId: ctx.account.id, detail: { provider: name } });
    await notifyMethodChange(ctx, ctx.account, "linked", name);
  }
  return { status: 200, body: await buildMePayload(ctx, ctx.account, ctx.session) };
}

/**
 * POST /v1/auth/google {idToken, noncePreimage, ageConfirmed, termsVersion}.
 * @param {Object} ctx Context.
 * @returns {Promise<Object>} Result.
 */
export function handleGoogleSignIn(ctx) {
  return signInWith(ctx, "google");
}

/**
 * POST /v1/auth/microsoft {idToken, noncePreimage, ageConfirmed, termsVersion}.
 * @param {Object} ctx Context.
 * @returns {Promise<Object>} Result.
 */
export function handleMicrosoftSignIn(ctx) {
  return signInWith(ctx, "microsoft");
}

/**
 * POST /v1/me/link/google {idToken, noncePreimage}.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export function handleLinkGoogle(ctx) {
  return linkWith(ctx, "google");
}

/**
 * POST /v1/me/link/microsoft {idToken, noncePreimage}.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export function handleLinkMicrosoft(ctx) {
  return linkWith(ctx, "microsoft");
}
