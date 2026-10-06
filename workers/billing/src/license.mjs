/**
 * The ES256 licence token, PAL (DESIGN-v3-delta "Licence token REINSTATED",
 * decision D-ORCH-03), ported from Vocal Studio's license.js.
 *
 * Why it exists: the browser keeps the last /v1/me for display only, and
 * anyone can edit that. When the worker cannot be reached, the browser grants
 * Pro only while a token this worker SIGNED verifies against the public keys
 * pinned in its config (src/lib/cloud/licence.ts). Live /v1/me always wins,
 * so a revocation takes effect on the next load that reaches the worker.
 *
 * Token (compact JWS):
 *   header  {"alg":"ES256","typ":"PAL","kid":LICENSE_KEY_ID}
 *   payload {iss:"pyarcana-billing", sub:accountId, aud:CANONICAL_ORIGIN,
 *            plan:"pro", source, iat, exp, indefinite}
 *   signature  ECDSA P-256 / SHA-256 over ASCII `header.payload`, raw r||s
 *              (64 bytes, RFC 7518 §3.4), base64url.
 * exp = min(iat + LICENSE_TTL_SECONDS, accessEnd); an indefinite access runs
 * on the TTL alone. The TTL defaults to 72 h and is clamped to [60 s, 72 h],
 * because the browser refuses any token that lives longer than 72 h.
 *
 * Fail closed: no key, a corrupt key, no CANONICAL_ORIGIN or no Pro access
 * means no token (null), never an error in /v1/me. The key material is never
 * logged. Secret LICENSE_PRIVATE_KEY_PKCS8_B64; vars LICENSE_KEY_ID,
 * LICENSE_TTL_SECONDS, LICENSE_PREV_PUBLIC_JWK (the previous key's public JWK,
 * published by GET /v1/jwks during a rotation). One secret: the public key is
 * derived from the private one.
 *
 * Vocal differences: the subject is the account id (Vocal used a bearer
 * licence id), there is no status/provider claim (access is resolved server
 * side), and the TTL ceiling is 72 h instead of 30 days.
 */

import { base64ToBytes, bytesToBase64Url } from "./crypto.mjs";
import { intVar, stringVar } from "./config.mjs";

/** Issuer claim. */
export const LICENSE_ISSUER = "pyarcana-billing";

/** JWS `typ` header value. */
export const LICENSE_TYPE = "PAL";

/** Default and maximum lifetime (72 h): the browser refuses longer tokens. */
export const LICENSE_TTL_SECONDS = 72 * 3600;

const MIN_TTL_SECONDS = 60;
const KID_RE = /^[A-Za-z0-9_.-]{1,64}$/;
const B64URL_COORD_RE = /^[A-Za-z0-9_-]{43}$/;
const ECDSA = { name: "ECDSA", namedCurve: "P-256" };
const encoder = new TextEncoder();

/**
 * Isolate-local cache of imported keys, keyed by the secret itself so a
 * rotation inside a warm isolate never serves the old key.
 * @type {Map<string, Promise<{privateKey: CryptoKey, publicJwk: Object}>>}
 */
const keyCache = new Map();

/**
 * The token lifetime from LICENSE_TTL_SECONDS.
 * @param {Object} env Worker env.
 * @returns {number} Seconds in [60, 259200].
 */
export function resolveTtlSeconds(env) {
  return intVar(env, "LICENSE_TTL_SECONDS", LICENSE_TTL_SECONDS, MIN_TTL_SECONDS, LICENSE_TTL_SECONDS);
}

/**
 * The key id advertised in the header and the JWKS ("k1" when unset or malformed).
 * @param {Object} env Worker env.
 * @returns {string} Key id.
 */
export function resolveKeyId(env) {
  const kid = stringVar(env, "LICENSE_KEY_ID");
  return KID_RE.test(kid) ? kid : "k1";
}

/**
 * Import the configured private key and derive its public JWK (cached).
 * Rejects when the secret is absent or not a P-256 PKCS#8 key.
 * @param {Object} env Worker env.
 * @returns {Promise<{privateKey: CryptoKey, publicJwk: Object}>} Keys.
 */
export function importLicenceKeys(env) {
  const material = stringVar(env, "LICENSE_PRIVATE_KEY_PKCS8_B64");
  if (!material) {
    return Promise.reject(new Error("license key not configured"));
  }
  const cached = keyCache.get(material);
  if (cached) {
    return cached;
  }
  const pending = (async () => {
    const privateKey = await crypto.subtle.importKey("pkcs8", base64ToBytes(material), ECDSA, true, ["sign"]);
    const jwk = await crypto.subtle.exportKey("jwk", privateKey);
    return { privateKey, publicJwk: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y } };
  })();
  keyCache.set(material, pending);
  pending.catch(() => keyCache.delete(material));
  return pending;
}

/**
 * Forget the imported keys (tests simulate a fresh isolate).
 * @returns {void}
 */
export function clearLicenceKeyCache() {
  keyCache.clear();
}

/**
 * The claims for an account's access at `now`, or null when no token is due.
 * @param {Object} env Worker env (CANONICAL_ORIGIN, LICENSE_TTL_SECONDS).
 * @param {number} now Epoch seconds.
 * @param {string} accountId Account id (the subject).
 * @param {{isPro: boolean, source: string|null, accessEnd: number|null, indefinite: boolean}} access Resolved access.
 * @returns {Object|null} Claims.
 */
export function licenceClaims(env, now, accountId, access) {
  const aud = stringVar(env, "CANONICAL_ORIGIN");
  if (!access || !access.isPro || !aud || !accountId) {
    return null;
  }
  const ceiling = now + resolveTtlSeconds(env);
  const exp = access.accessEnd === null ? ceiling : Math.min(ceiling, access.accessEnd);
  if (!(exp > now)) {
    return null;
  }
  return { iss: LICENSE_ISSUER, sub: accountId, aud, plan: "pro", source: String(access.source || ""), iat: now, exp, indefinite: Boolean(access.indefinite) };
}

/**
 * base64url of a JSON value.
 * @param {Object} value Value.
 * @returns {string} Encoded.
 */
function encodeJson(value) {
  return bytesToBase64Url(encoder.encode(JSON.stringify(value)));
}

/**
 * Sign claims into a compact PAL token.
 * @param {Object} env Worker env.
 * @param {Object} claims Claims.
 * @returns {Promise<string>} Token.
 */
export async function signLicence(env, claims) {
  const { privateKey } = await importLicenceKeys(env);
  const input = `${encodeJson({ alg: "ES256", typ: LICENSE_TYPE, kid: resolveKeyId(env) })}.${encodeJson(claims)}`;
  const signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, encoder.encode(input));
  return `${input}.${bytesToBase64Url(signature)}`;
}

/**
 * The token for the me payload, or null (not Pro, or no usable key). Never
 * throws; a key failure is logged without the key.
 * @param {{env: Object, now: number, log?: function}} ctx Context.
 * @param {string} accountId Account id.
 * @param {Object} access Resolved access.
 * @returns {Promise<string|null>} Token.
 */
export async function licenceTokenFor(ctx, accountId, access) {
  const claims = licenceClaims(ctx.env, ctx.now, accountId, access);
  if (!claims || !stringVar(ctx.env, "LICENSE_PRIVATE_KEY_PKCS8_B64")) {
    return null;
  }
  try {
    return await signLicence(ctx.env, claims);
  } catch (error) {
    if (ctx.log) {
      ctx.log(`license signing failed: ${error && error.name ? error.name : "error"}`);
    }
    return null;
  }
}

/**
 * A published JWK entry.
 * @param {{x: string, y: string}} key Coordinates.
 * @param {string} kid Key id.
 * @returns {Object} JWK.
 */
function publishedJwk(key, kid) {
  return { kty: "EC", crv: "P-256", x: key.x, y: key.y, alg: "ES256", use: "sig", kid, key_ops: ["verify"] };
}

/**
 * LICENSE_PREV_PUBLIC_JWK when it is a well-formed PUBLIC P-256 key with its
 * own kid (never private material, never the current kid), else null.
 * @param {Object} env Worker env.
 * @param {string} currentKid Current key id.
 * @returns {Object|null} Published JWK.
 */
export function previousPublicJwk(env, currentKid) {
  let jwk;
  try {
    jwk = JSON.parse(stringVar(env, "LICENSE_PREV_PUBLIC_JWK") || "null");
  } catch {
    return null;
  }
  const shaped =
    jwk && typeof jwk === "object" && jwk.kty === "EC" && jwk.crv === "P-256" && !("d" in jwk) && B64URL_COORD_RE.test(String(jwk.x)) && B64URL_COORD_RE.test(String(jwk.y));
  const kidOk = shaped && typeof jwk.kid === "string" && KID_RE.test(jwk.kid) && jwk.kid !== currentKid;
  return kidOk ? publishedJwk(jwk, jwk.kid) : null;
}

/**
 * GET /v1/jwks: the current public key, then the previous one if set.
 * @param {{env: Object, log?: function}} ctx Context.
 * @returns {Promise<Object>} Result.
 */
export async function handleJwks(ctx) {
  let keys;
  try {
    keys = await importLicenceKeys(ctx.env);
  } catch {
    return { status: 503, body: { ok: false, reason: "license_not_configured" } };
  }
  const kid = resolveKeyId(ctx.env);
  const previous = previousPublicJwk(ctx.env, kid);
  return { status: 200, body: { keys: [publishedJwk(keys.publicJwk, kid)].concat(previous ? [previous] : []) } };
}
