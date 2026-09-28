/**
 * Small WebCrypto helpers: ids, digests, HMAC under SERVER_PEPPER,
 * constant-time comparison and base64url. No dependencies.
 *
 * SERVER_PEPPER keys every HMAC the worker stores (login codes, rate-limit
 * bucket names, trial claims, tombstone email hashes), so a database dump
 * alone cannot be reversed by trying every email or every 6-digit code.
 */

const encoder = new TextEncoder();

/** Minimum decoded pepper length, in bytes. */
export const PEPPER_MIN_BYTES = 32;

const BASE64URL_RE = /^[A-Za-z0-9_-]*$/;
const BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/;

/**
 * Encode bytes as unpadded base64url.
 * @param {Uint8Array|ArrayBuffer} input Raw bytes.
 * @returns {string} base64url text.
 */
export function bytesToBase64Url(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode binary text into bytes.
 * @param {string} binary Latin-1 binary string.
 * @returns {Uint8Array} Bytes.
 */
function binaryToBytes(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decode unpadded base64url strictly: any character outside the alphabet,
 * padding, or an impossible length throws.
 * @param {string} value base64url text.
 * @returns {Uint8Array} Raw bytes.
 */
export function base64UrlToBytes(value) {
  const text = String(value);
  if (!BASE64URL_RE.test(text) || text.length % 4 === 1) {
    throw new TypeError("invalid base64url");
  }
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (text.length % 4)) % 4);
  return binaryToBytes(atob(padded));
}

/**
 * Decode base64url text into a UTF-8 string.
 * @param {string} value base64url text.
 * @returns {string} Decoded text.
 */
export function base64UrlToString(value) {
  return new TextDecoder("utf-8", { fatal: true }).decode(base64UrlToBytes(value));
}

/**
 * Decode standard base64 (padding and whitespace allowed).
 * @param {string} value base64 text.
 * @returns {Uint8Array|null} Bytes, or null when it is not base64.
 */
export function base64ToBytes(value) {
  const text = String(value || "").replace(/\s+/g, "");
  if (!BASE64_RE.test(text) || text.length % 4 !== 0) {
    return null;
  }
  try {
    return binaryToBytes(atob(text));
  } catch {
    return null;
  }
}

/**
 * Fill a new byte array with cryptographic randomness.
 * @param {number} size Byte count.
 * @returns {Uint8Array} Random bytes.
 */
function randomBytes(size) {
  const raw = new Uint8Array(size);
  crypto.getRandomValues(raw);
  return raw;
}

/**
 * Mint a random id with a readable prefix: 16 bytes -> 22 base64url chars.
 * @param {string} prefix Short prefix, e.g. "acct".
 * @param {number} [bytes] Entropy in bytes.
 * @returns {string} `prefix_<base64url>`.
 */
export function randomId(prefix, bytes = 16) {
  return `${prefix}_${bytesToBase64Url(randomBytes(bytes))}`;
}

/**
 * Mint an opaque session token: 32 random bytes as base64url (43 chars).
 * Only its SHA-256 is ever stored.
 * @returns {string} Token.
 */
export function randomToken() {
  return bytesToBase64Url(randomBytes(32));
}

/**
 * Uniform random decimal digits by rejection sampling (no modulo bias).
 * @param {number} count Number of digits.
 * @returns {string} Digits.
 */
export function randomDigits(count) {
  let out = "";
  const buf = new Uint8Array(16);
  while (out.length < count) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && out.length < count; i += 1) {
      if (buf[i] < 250) {
        out += String(buf[i] % 10);
      }
    }
  }
  return out;
}

/**
 * Lowercase hex of a byte buffer.
 * @param {ArrayBuffer} buffer Digest bytes.
 * @returns {string} Hex.
 */
function toHex(buffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * SHA-256 of a UTF-8 string, as lowercase hex.
 * @param {string} value Text.
 * @returns {Promise<string>} Hex digest.
 */
export async function sha256Hex(value) {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(String(value))));
}

/** One imported HMAC key per pepper value, per isolate. */
const hmacKeys = new Map();

/**
 * Import (and cache) an HMAC-SHA256 key.
 * @param {Uint8Array} keyBytes Raw key.
 * @returns {Promise<CryptoKey>} Key.
 */
async function hmacKey(keyBytes) {
  const cacheKey = bytesToBase64Url(keyBytes);
  let key = hmacKeys.get(cacheKey);
  if (!key) {
    key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    if (hmacKeys.size > 8) {
      hmacKeys.clear();
    }
    hmacKeys.set(cacheKey, key);
  }
  return key;
}

/**
 * HMAC-SHA256 of a UTF-8 string, as lowercase hex.
 * @param {Uint8Array} keyBytes Raw key (normally the decoded pepper).
 * @param {string} message Text.
 * @returns {Promise<string>} Hex MAC.
 */
export async function hmacHex(keyBytes, message) {
  const key = await hmacKey(keyBytes);
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(String(message))));
}

/**
 * Compare two strings in time that depends only on their length.
 * @param {unknown} a First value.
 * @param {unknown} b Second value.
 * @returns {boolean} True when both are equal strings.
 */
export function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/**
 * The decoded SERVER_PEPPER, or null when it is missing or too short.
 * Callers fail closed on null.
 * @param {Object} env Worker env.
 * @returns {Uint8Array|null} Pepper bytes.
 */
export function pepperBytes(env) {
  const raw = env && typeof env.SERVER_PEPPER === "string" ? env.SERVER_PEPPER : "";
  const bytes = raw ? base64ToBytes(raw) : null;
  return bytes && bytes.length >= PEPPER_MIN_BYTES ? bytes : null;
}
