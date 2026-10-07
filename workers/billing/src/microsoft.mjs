/**
 * Microsoft identity platform (Entra ID + personal accounts) v2 ID tokens.
 *
 * Signature: RS256 against the common-endpoint JWKS (jwt.mjs). Claims:
 * - `aud` is PyArcana's MICROSOFT_CLIENT_ID;
 * - `ver` is "2.0" (v1 tokens carry other issuers and claims);
 * - `tid` is a GUID and `iss` is exactly
 *   https://login.microsoftonline.com/<tid>/v2.0 for the token's OWN tid
 *   (the multi-tenant issuer rule);
 * - key-issuer binding (DESIGN-v3 §B): the signing key MUST publish an
 *   `issuer` template that produces the same issuer, so a key from another
 *   authority (e.g. a B2C tenant) cannot vouch for a login.microsoftonline.com
 *   token; a key without one fails closed;
 * - a key that names its `cloud_instance_name` must name
 *   microsoftonline.com (the common JWKS also lists US-government keys);
 * - exp/iat required, nbf checked, ±300 s, lifetime at most 24 h;
 * - `nonce` equals the EXPECTED nonce, which the caller derives from the
 *   client's preimage (nonce.mjs), so a nonce read out of a captured token
 *   proves nothing; the caller also spends it (single use);
 * - `oid` is a GUID. The subject is "<tid>:<oid>", stable per user per tenant.
 * The email (or preferred_username) is returned for DISPLAY only: it proves
 * nothing about mailbox ownership (nOAuth), so callers never link by it.
 */

import { normalizeEmail } from "./address.mjs";
import { listVar } from "./config.mjs";
import { constantTimeEqual } from "./crypto.mjs";
import { checkTimes, verifyRs256 } from "./jwt.mjs";

/** Common-endpoint signing keys (personal + work/school accounts). */
export const MICROSOFT_JWKS_URL = "https://login.microsoftonline.com/common/discovery/v2.0/keys";

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * PyArcana's Microsoft client ids (comma list).
 * @param {Object} env Worker env.
 * @returns {string[]} Ids.
 */
export function microsoftClientIds(env) {
  return listVar(env, "MICROSOFT_CLIENT_ID");
}

/**
 * The issuer a token from tenant `tid` must carry.
 * @param {string} tid Tenant GUID.
 * @returns {string} Issuer.
 */
function issuerFor(tid) {
  return `https://login.microsoftonline.com/${tid}/v2.0`;
}

/** The only cloud instance whose keys may sign a PyArcana sign-in. */
export const MICROSOFT_CLOUD_INSTANCE = "microsoftonline.com";

/**
 * The key-issuer binding: the key's issuer template must yield the token's
 * issuer; a key without a template fails closed.
 * @param {Object} claims Claims.
 * @param {Object} jwk Signing key.
 * @returns {string|null} Reason or null.
 */
function keyIssuerReason(claims, jwk) {
  if (typeof jwk.issuer !== "string") {
    return "key_without_issuer";
  }
  return jwk.issuer.replace("{tenantid}", claims.tid) === claims.iss ? null : "bad_issuer";
}

/**
 * Claim checks, each returning a reason or null.
 * @type {Array<function(Object, Object): (string|null)>}
 */
const CLAIM_CHECKS = [
  (c, o) => (typeof c.aud === "string" && o.clientIds.includes(c.aud) ? null : "bad_audience"),
  (c) => (c.ver === "2.0" ? null : "bad_version"),
  (c) => (typeof c.tid === "string" && GUID.test(c.tid) ? null : "bad_tenant"),
  (c) => (c.iss === issuerFor(c.tid) ? null : "bad_issuer"),
  (c, o) => keyIssuerReason(c, o.jwk),
  (c, o) => (o.jwk.cloud_instance_name === undefined || o.jwk.cloud_instance_name === MICROSOFT_CLOUD_INSTANCE ? null : "bad_cloud_instance"),
  (c, o) => checkTimes(c, o.now),
  (c, o) => (typeof o.nonce === "string" && o.nonce !== "" && constantTimeEqual(c.nonce, o.nonce) ? null : "bad_nonce"),
  (c) => (typeof c.oid === "string" && GUID.test(c.oid) ? null : "no_subject")
];

/**
 * The claimed address for display, or null.
 * @param {Object} claims Claims.
 * @returns {string|null} Address as the token gave it.
 */
function displayEmail(claims) {
  const candidate = [claims.email, claims.preferred_username].find((value) => normalizeEmail(value));
  return candidate ? candidate.trim() : null;
}

/**
 * Verify a Microsoft ID token.
 * @param {unknown} idToken Compact JWT.
 * @param {Object} env Worker env.
 * @param {{fetchImpl?: function, now: number, nonce: string, jwksTimeoutMs?: number}} opts Injectables and
 *   the expected nonce (a missing one fails closed as bad_nonce).
 * @returns {Promise<{ok: true, expiresAt: number, nonce: string,
 *                    identity: {subject: string, email: string|null, name: string|null}}|
 *                   {ok: false, reason: string}>} Result.
 */
export async function verifyMicrosoftIdToken(idToken, env, opts) {
  const clientIds = microsoftClientIds(env);
  if (!clientIds.length) {
    return { ok: false, reason: "microsoft_not_configured" };
  }
  const verified = await verifyRs256(idToken, { jwksUrl: MICROSOFT_JWKS_URL, fetchImpl: opts.fetchImpl, now: opts.now, jwksTimeoutMs: opts.jwksTimeoutMs });
  if (!verified.ok) {
    return verified;
  }
  const claims = verified.claims;
  const context = { clientIds, now: opts.now, nonce: opts.nonce, jwk: verified.jwk };
  for (const check of CLAIM_CHECKS) {
    const reason = check(claims, context);
    if (reason) {
      return { ok: false, reason };
    }
  }
  return {
    ok: true,
    expiresAt: claims.exp,
    nonce: claims.nonce,
    identity: {
      subject: `${claims.tid.toLowerCase()}:${claims.oid.toLowerCase()}`,
      email: displayEmail(claims),
      name: typeof claims.name === "string" ? claims.name.slice(0, 80) : null
    }
  };
}
