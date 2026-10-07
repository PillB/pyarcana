/**
 * OIDC nonce binding and single use (DESIGN-v3 §B), for Google and Microsoft,
 * on sign-in and on linking.
 *
 * The browser makes a random preimage (32 bytes, base64url), sends
 * nonce = base64url(SHA-256(preimage)) to the provider, and posts
 * {idToken, noncePreimage} here. The worker derives the nonce from the
 * preimage and the verifier requires the token's `nonce` claim to equal it.
 * A thief who captures only the token (an extension, a script hooking the
 * GIS callback, a log) can read its nonce but not the preimage, so the token
 * is useless to them.
 *
 * Single use: after verification, HMAC(pepper, nonce) is inserted into
 * `used_nonces` with ON CONFLICT DO NOTHING and the insert must change one
 * row. A second POST of the same token (or the same token on the link route)
 * finds the row and is refused. The row lives until the token could no longer
 * verify (exp + clock skew); the daily sweep removes it after that.
 */

import { hmacHex, sha256Base64Url } from "./crypto.mjs";
import { CLOCK_SKEW_SECONDS } from "./jwt.mjs";

/** A preimage: at least 32 random bytes as base64url (43+ chars). */
export const NONCE_PREIMAGE_RE = /^[A-Za-z0-9_-]{43,128}$/;

/**
 * The nonce a token must carry for this preimage, or null for a bad preimage.
 * @param {unknown} preimage `noncePreimage` from the request body.
 * @returns {Promise<string|null>} Expected nonce claim.
 */
export async function expectedNonce(preimage) {
  if (typeof preimage !== "string" || !NONCE_PREIMAGE_RE.test(preimage)) {
    return null;
  }
  return sha256Base64Url(preimage);
}

/**
 * Spend a verified token's nonce. True only for the first spend.
 * @param {{db: Object, pepper: Uint8Array}} ctx Context (pepper required).
 * @param {string} nonce The token's nonce claim (already verified).
 * @param {number} expiresAt The token's exp.
 * @returns {Promise<boolean>} True when this request is the first to use it.
 */
export async function spendNonce(ctx, nonce, expiresAt) {
  const hash = await hmacHex(ctx.pepper, `oidc-nonce:${nonce}`);
  const result = await ctx.db
    .prepare("INSERT INTO used_nonces (hash, expires_at) VALUES (?1, ?2) ON CONFLICT (hash) DO NOTHING")
    .bind(hash, Math.floor(Number(expiresAt)) + CLOCK_SKEW_SECONDS)
    .run();
  return result.meta.changes === 1;
}
