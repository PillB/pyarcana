/**
 * RS256 JWT verification against a published JWKS, with no dependencies.
 *
 * - Only `alg: RS256` is accepted, whatever the header says; `none`, HS256
 *   (the RSA-public-key-as-HMAC-secret confusion) and every other alg fail
 *   with `bad_alg` before any key is touched.
 * - Keys are cached per JWKS URL for an hour. An unknown `kid` forces ONE
 *   refetch (key rotation), but not within a minute of the previous fetch, so
 *   tokens with random kids cannot turn the worker into a fetch amplifier.
 *   If a refresh fails, the stale keys keep working (the provider rotates
 *   with overlap), and the next attempt waits a minute.
 * - A JWKS fetch is aborted after 5 s: a provider that accepts the
 *   connection and stalls counts as a failed fetch (stale keys, 60 s back-off)
 *   instead of hanging every sign-in until the platform kills the request.
 * - Issuer, audience and other claim rules belong to the caller (google.mjs,
 *   microsoft.mjs); `checkTimes` is the shared exp/iat/nbf rule (±300 s, and
 *   exp - iat <= 24 h).
 */

import { base64UrlToBytes, base64UrlToString } from "./crypto.mjs";

/** Allowed clock skew for exp/iat/nbf. */
export const CLOCK_SKEW_SECONDS = 300;

/** How long a fetched key set is trusted. */
export const JWKS_TTL_SECONDS = 3600;

/** Minimum spacing between fetches of the same key set. */
export const JWKS_MIN_REFETCH_SECONDS = 60;

/** Longest lifetime (exp - iat) a provider ID token may claim (DESIGN-v3 §B). */
export const MAX_TOKEN_LIFETIME_SECONDS = 86400;

/** A JWKS fetch that has not answered by then is abandoned (DESIGN-v3 §B). */
export const JWKS_FETCH_TIMEOUT_MS = 5000;

/** Longest token accepted. */
const MAX_TOKEN_LENGTH = 8192;

const encoder = new TextEncoder();

/** Per-isolate cache: url -> {keys, fetchedAt, retryAt, imported: Map}. */
let cache = new Map();

/**
 * Drop every cached key set (tests; key-rotation escape hatch).
 * @returns {void}
 */
export function clearJwksCache() {
  cache = new Map();
}

/**
 * Parse a base64url JSON object.
 * @param {string} part Segment.
 * @returns {Object|null} Object or null.
 */
function parseSegment(part) {
  try {
    const value = JSON.parse(base64UrlToString(part));
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Split and decode a compact JWS without verifying it.
 * @param {unknown} token Compact token.
 * @returns {{ok: true, header: Object, claims: Object, signingInput: string, signature: string}|
 *           {ok: false, reason: "malformed"}} Parts.
 */
export function decodeJwt(token) {
  const malformed = { ok: false, reason: "malformed" };
  if (typeof token !== "string" || !token || token.length > MAX_TOKEN_LENGTH) {
    return malformed;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return malformed;
  }
  const header = parseSegment(parts[0]);
  const claims = parseSegment(parts[1]);
  if (!header || !claims) {
    return malformed;
  }
  return { ok: true, header, claims, signingInput: `${parts[0]}.${parts[1]}`, signature: parts[2] };
}

/**
 * True for a JWK usable to verify RS256 signatures.
 * @param {Object} jwk Key.
 * @returns {boolean} Usable.
 */
function isRs256SigningKey(jwk) {
  return Boolean(
    jwk &&
      jwk.kty === "RSA" &&
      typeof jwk.kid === "string" &&
      typeof jwk.n === "string" &&
      typeof jwk.e === "string" &&
      (jwk.use === undefined || jwk.use === "sig") &&
      (jwk.alg === undefined || jwk.alg === "RS256")
  );
}

/**
 * Fetch a key set and store it in the cache.
 * @param {string} url JWKS URL.
 * @param {{fetchImpl?: function, now: number}} opts Injectables.
 * @returns {Promise<Object>} Cache entry.
 */
async function fetchJwks(url, opts) {
  // An explicit controller + timer (cleared when done) rather than
  // AbortSignal.timeout: the same abort, but the timer is not unref'd, so it
  // fires even when nothing else keeps the event loop alive (Node tests).
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("jwks fetch timed out")), opts.jwksTimeoutMs || JWKS_FETCH_TIMEOUT_MS);
  let body;
  try {
    const response = await (opts.fetchImpl || fetch)(url, { method: "GET", headers: { accept: "application/json" }, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`jwks fetch failed: ${response.status}`);
    }
    body = await response.json();
  } finally {
    clearTimeout(timer);
  }
  const keys = (body && Array.isArray(body.keys) ? body.keys : []).filter(isRs256SigningKey);
  const entry = { keys, fetchedAt: opts.now, retryAt: opts.now + JWKS_MIN_REFETCH_SECONDS, imported: new Map() };
  cache.set(url, entry);
  return entry;
}

/**
 * Refresh the cache entry if allowed; on failure keep the stale one.
 * @param {string} url JWKS URL.
 * @param {Object|undefined} entry Current entry.
 * @param {{fetchImpl?: function, now: number}} opts Injectables.
 * @returns {Promise<Object|null>} Entry to use, or null when none exists.
 */
async function refresh(url, entry, opts) {
  if (entry && opts.now < entry.retryAt) {
    return entry;
  }
  try {
    return await fetchJwks(url, opts);
  } catch {
    if (entry) {
      entry.retryAt = opts.now + JWKS_MIN_REFETCH_SECONDS;
    }
    return entry || null;
  }
}

/**
 * Find the JWK for a kid, refreshing on expiry and once on a miss.
 * @param {string} url JWKS URL.
 * @param {string} kid Key id.
 * @param {{fetchImpl?: function, now: number}} opts Injectables.
 * @returns {Promise<{entry: Object, jwk: Object}|{reason: string}>} Key or reason.
 */
async function findKey(url, kid, opts) {
  let entry = cache.get(url);
  if (!entry || opts.now - entry.fetchedAt >= JWKS_TTL_SECONDS) {
    entry = await refresh(url, entry, opts);
  }
  if (!entry) {
    return { reason: "jwks_unavailable" };
  }
  let jwk = entry.keys.find((key) => key.kid === kid);
  if (!jwk) {
    entry = await refresh(url, entry, opts);
    jwk = entry.keys.find((key) => key.kid === kid);
  }
  return jwk ? { entry, jwk } : { reason: "unknown_key" };
}

/**
 * Import (and cache) a JWK as an RS256 verification key.
 * @param {Object} entry Cache entry.
 * @param {Object} jwk Key.
 * @returns {Promise<CryptoKey>} Key.
 */
async function importKey(entry, jwk) {
  let key = entry.imported.get(jwk.kid);
  if (!key) {
    key = await crypto.subtle.importKey(
      "jwk",
      { kty: "RSA", n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    entry.imported.set(jwk.kid, key);
  }
  return key;
}

/**
 * Check the RSASSA-PKCS1-v1_5 SHA-256 signature.
 * @param {Object} entry Cache entry.
 * @param {Object} jwk Key.
 * @param {Object} decoded Output of decodeJwt.
 * @returns {Promise<boolean>} Valid.
 */
async function signatureValid(entry, jwk, decoded) {
  try {
    const key = await importKey(entry, jwk);
    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      base64UrlToBytes(decoded.signature),
      encoder.encode(decoded.signingInput)
    );
  } catch {
    return false;
  }
}

/**
 * Verify an RS256 token's signature against a JWKS.
 * @param {unknown} token Compact token.
 * @param {{jwksUrl: string, fetchImpl?: function, now: number, jwksTimeoutMs?: number}} opts Options
 *   (`jwksTimeoutMs` defaults to JWKS_FETCH_TIMEOUT_MS; tests shorten it).
 * @returns {Promise<{ok: true, header: Object, claims: Object, jwk: Object}|{ok: false, reason: string}>} Result.
 */
export async function verifyRs256(token, opts) {
  const decoded = decodeJwt(token);
  if (!decoded.ok) {
    return decoded;
  }
  if (decoded.header.alg !== "RS256") {
    return { ok: false, reason: "bad_alg" };
  }
  if (typeof decoded.header.kid !== "string" || !decoded.header.kid) {
    return { ok: false, reason: "bad_header" };
  }
  const found = await findKey(opts.jwksUrl, decoded.header.kid, opts);
  if (found.reason) {
    return { ok: false, reason: found.reason };
  }
  if (!(await signatureValid(found.entry, found.jwk, decoded))) {
    return { ok: false, reason: "bad_signature" };
  }
  return { ok: true, header: decoded.header, claims: decoded.claims, jwk: found.jwk };
}

/**
 * The shared time rule: exp and iat required, nbf optional, ±300 s, and a
 * lifetime (exp - iat) of at most 24 h, so a token minted with a far exp
 * cannot be replayed for years.
 * @param {Object} claims Claims.
 * @param {number} now Clock.
 * @returns {string|null} Reason, or null when valid.
 */
export function checkTimes(claims, now) {
  const { exp, iat, nbf } = claims;
  if (!Number.isFinite(exp) || !Number.isFinite(iat) || (nbf !== undefined && !Number.isFinite(nbf))) {
    return "missing_time";
  }
  if (exp - iat > MAX_TOKEN_LIFETIME_SECONDS) {
    return "lifetime_too_long";
  }
  if (exp + CLOCK_SKEW_SECONDS <= now) {
    return "expired";
  }
  if (iat - CLOCK_SKEW_SECONDS > now) {
    return "issued_in_future";
  }
  return nbf !== undefined && nbf - CLOCK_SKEW_SECONDS > now ? "not_yet_valid" : null;
}
