/**
 * Microsoft identity platform (Entra ID + personal accounts) v2 ID tokens.
 *
 * Signature: RS256 against the common-endpoint JWKS (jwt.mjs). Claims:
 * - `aud` is PyArcana's MICROSOFT_CLIENT_ID;
 * - `tid` is a GUID and `iss` is exactly
 *   https://login.microsoftonline.com/<tid>/v2.0 for the token's OWN tid
 *   (the multi-tenant issuer rule);
 * - when the signing key publishes an `issuer` template, it must produce the
 *   same issuer, so a key from another authority (e.g. a B2C tenant) cannot
 *   vouch for a login.microsoftonline.com token;
 * - exp/iat required, nbf checked, ±300 s;
 * - `nonce` equals the nonce the client submitted (16..256 chars), binding
 *   the token to this sign-in attempt;
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

/**
 * True for a usable submitted nonce.
 * @param {unknown} nonce Submitted nonce.
 * @returns {boolean} Usable.
 */
function nonceShapeOk(nonce) {
  return typeof nonce === "string" && nonce.length >= 16 && nonce.length <= 256;
}

/**
 * Claim checks, each returning a reason or null.
 * @type {Array<function(Object, Object): (string|null)>}
 */
const CLAIM_CHECKS = [
  (c, o) => (typeof c.aud === "string" && o.clientIds.includes(c.aud) ? null : "bad_audience"),
  (c) => (typeof c.tid === "string" && GUID.test(c.tid) ? null : "bad_tenant"),
  (c) => (c.iss === issuerFor(c.tid) ? null : "bad_issuer"),
  (c, o) => (typeof o.jwk.issuer !== "string" || o.jwk.issuer.replace("{tenantid}", c.tid) === c.iss ? null : "bad_issuer"),
  (c, o) => checkTimes(c, o.now),
  (c, o) => (nonceShapeOk(o.nonce) && constantTimeEqual(c.nonce, o.nonce) ? null : "bad_nonce"),
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
 * @param {unknown} nonce Nonce the client generated for this sign-in.
 * @param {Object} env Worker env.
 * @param {{fetchImpl?: function, now: number}} opts Injectables.
 * @returns {Promise<{ok: true, identity: {subject: string, email: string|null, name: string|null}}|
 *                   {ok: false, reason: string}>} Result.
 */
export async function verifyMicrosoftIdToken(idToken, nonce, env, opts) {
  const clientIds = microsoftClientIds(env);
  if (!clientIds.length) {
    return { ok: false, reason: "microsoft_not_configured" };
  }
  const verified = await verifyRs256(idToken, { jwksUrl: MICROSOFT_JWKS_URL, fetchImpl: opts.fetchImpl, now: opts.now });
  if (!verified.ok) {
    return verified;
  }
  const claims = verified.claims;
  const context = { clientIds, now: opts.now, nonce, jwk: verified.jwk };
  for (const check of CLAIM_CHECKS) {
    const reason = check(claims, context);
    if (reason) {
      return { ok: false, reason };
    }
  }
  return {
    ok: true,
    identity: {
      subject: `${claims.tid.toLowerCase()}:${claims.oid.toLowerCase()}`,
      email: displayEmail(claims),
      name: typeof claims.name === "string" ? claims.name.slice(0, 80) : null
    }
  };
}
