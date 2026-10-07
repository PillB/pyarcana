/**
 * Google ID token verification (Sign in with Google / GIS).
 *
 * Signature: RS256 against Google's JWKS (jwt.mjs). Claims, in order: issuer
 * is Google, audience is exactly one of PyArcana's OWN client ids (a token
 * minted for another app, e.g. Vocal Studio, is refused), exp/iat within
 * ±300 s and a lifetime of at most 24 h, `nonce` equal to the EXPECTED nonce
 * (derived by the caller from the client's preimage, nonce.mjs), a subject,
 * an email, and `email_verified`.
 * https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
 */

import { normalizeEmail } from "./address.mjs";
import { listVar } from "./config.mjs";
import { constantTimeEqual } from "./crypto.mjs";
import { checkTimes, verifyRs256 } from "./jwt.mjs";

/** Google's signing keys. */
export const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

/** Issuers Google uses. */
export const GOOGLE_ISSUERS = ["accounts.google.com", "https://accounts.google.com"];

/**
 * PyArcana's Google client ids (comma list).
 * @param {Object} env Worker env.
 * @returns {string[]} Ids.
 */
export function googleClientIds(env) {
  return listVar(env, "GOOGLE_CLIENT_ID");
}

/**
 * Claim checks, each returning a reason or null.
 * @type {Array<function(Object, {clientIds: string[], now: number, nonce: unknown}): (string|null)>}
 */
const CLAIM_CHECKS = [
  (c) => (GOOGLE_ISSUERS.includes(c.iss) ? null : "bad_issuer"),
  (c, o) => (typeof c.aud === "string" && o.clientIds.includes(c.aud) ? null : "bad_audience"),
  (c, o) => checkTimes(c, o.now),
  (c, o) => (typeof o.nonce === "string" && o.nonce !== "" && constantTimeEqual(c.nonce, o.nonce) ? null : "bad_nonce"),
  (c) => (typeof c.sub === "string" && c.sub && c.sub.length <= 255 ? null : "no_subject"),
  (c) => (normalizeEmail(c.email) ? null : "no_email"),
  (c) => (c.email_verified === true || c.email_verified === "true" ? null : "email_not_verified")
];

/**
 * Verify a Google ID token.
 * @param {unknown} idToken Compact JWT from GIS.
 * @param {Object} env Worker env.
 * @param {{fetchImpl?: function, now: number, nonce: string, jwksTimeoutMs?: number}} opts Injectables and
 *   the expected nonce (a missing one fails closed as bad_nonce).
 * @returns {Promise<{ok: true, expiresAt: number, nonce: string, identity: {subject: string, email: string,
 *                    emailNormalized: string, hd: string|null, authoritative: boolean, name: string|null}}|
 *                   {ok: false, reason: string}>} Result.
 */
export async function verifyGoogleIdToken(idToken, env, opts) {
  const clientIds = googleClientIds(env);
  if (!clientIds.length) {
    return { ok: false, reason: "google_not_configured" };
  }
  const verified = await verifyRs256(idToken, { jwksUrl: GOOGLE_JWKS_URL, fetchImpl: opts.fetchImpl, now: opts.now, jwksTimeoutMs: opts.jwksTimeoutMs });
  if (!verified.ok) {
    return verified;
  }
  const claims = verified.claims;
  for (const check of CLAIM_CHECKS) {
    const reason = check(claims, { clientIds, now: opts.now, nonce: opts.nonce });
    if (reason) {
      return { ok: false, reason };
    }
  }
  const emailNormalized = normalizeEmail(claims.email);
  const hd = typeof claims.hd === "string" && claims.hd ? claims.hd : null;
  return {
    ok: true,
    expiresAt: claims.exp,
    nonce: claims.nonce,
    identity: {
      subject: claims.sub,
      email: String(claims.email).trim(),
      emailNormalized,
      hd,
      authoritative: isGoogleAuthoritative(emailNormalized, hd),
      name: typeof claims.name === "string" ? claims.name.slice(0, 80) : null
    }
  };
}

/**
 * Google proves mailbox ownership only for its own consumer domain and for
 * Workspace accounts (the `hd` claim). For any other address, a verified
 * Google email only says the address was verified once, possibly by an
 * earlier holder of a since-reassigned mailbox.
 * @param {string} emailNormalized Normalized email.
 * @param {string|null} hd Hosted domain claim.
 * @returns {boolean} Authoritative.
 */
export function isGoogleAuthoritative(emailNormalized, hd) {
  return emailNormalized.endsWith("@gmail.com") || hd !== null;
}
