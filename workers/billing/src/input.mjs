/**
 * Boundary validation for request bodies and query strings.
 *
 * A route declares its fields as [name, parse, reason]; `parseFields` runs
 * them in order and stops at the first invalid one with `400 {reason}`.
 * Parsers return the clean value or INVALID. Nothing is coerced: "30" is not
 * 30, 1.5 is not an integer, and an unknown enum value is refused rather
 * than defaulted (fail closed, never invent missing values).
 */

import { normalizeEmail } from "./address.mjs";

/** Marker a parser returns for a bad value. */
export const INVALID = Symbol("invalid");

/** Client-generated idempotency keys: 8-100 URL-safe characters. */
export const REQUEST_ID_RE = /^[A-Za-z0-9_.:-]{8,100}$/;

/**
 * A 400 result.
 * @param {string} reason Reason code.
 * @returns {Object} Result.
 */
export function badRequest(reason) {
  return { status: 400, body: { ok: false, reason } };
}

/**
 * Run field parsers in order.
 * @param {Object} source Body or query object.
 * @param {Array<[string, function(Object): unknown, string]>} fields `[name, parse, reason]`.
 * @returns {{values: Object}|{error: Object}} Clean values or a 400 result.
 */
export function parseFields(source, fields) {
  const values = {};
  for (const [name, parse, reason] of fields) {
    const value = parse(source);
    if (value === INVALID) {
      return { error: badRequest(reason) };
    }
    values[name] = value;
  }
  return { values };
}

/**
 * Optional trimmed text of at most `max` characters ("" and absent -> null).
 * @param {unknown} value Raw value.
 * @param {number} max Maximum length.
 * @returns {string|null|symbol} Text, null, or INVALID.
 */
export function optionalText(value, max) {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "string") {
    return INVALID;
  }
  const text = value.trim();
  if (text.length > max) {
    return INVALID;
  }
  return text || null;
}

/**
 * Required trimmed text of 1..max characters.
 * @param {unknown} value Raw value.
 * @param {number} max Maximum length.
 * @returns {string|symbol} Text or INVALID.
 */
export function requiredText(value, max) {
  const text = optionalText(value, max);
  return text === null ? INVALID : text;
}

/**
 * A value from an allowed list; absent -> `fallback` (INVALID when none).
 * @param {unknown} value Raw value.
 * @param {readonly string[]} allowed Allowed values.
 * @param {string|null|symbol} [fallback] Value when absent.
 * @returns {string|null|symbol} Value or INVALID.
 */
export function enumValue(value, allowed, fallback = INVALID) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return allowed.includes(value) ? value : INVALID;
}

/**
 * A normalized email.
 * @param {unknown} value Raw value.
 * @returns {string|symbol} Email or INVALID.
 */
export function emailValue(value) {
  return normalizeEmail(value) || INVALID;
}

/**
 * Grant or role length: the key must be present; null = indefinite,
 * otherwise an integer from 1 to 3650.
 * @param {Object} body Request body.
 * @param {string} key Field name.
 * @returns {number|null|symbol} Days, null, or INVALID.
 */
export function daysValue(body, key) {
  if (!Object.prototype.hasOwnProperty.call(body, key)) {
    return INVALID;
  }
  const days = body[key];
  if (days === null) {
    return null;
  }
  return Number.isInteger(days) && days >= 1 && days <= 3650 ? days : INVALID;
}

/**
 * An idempotency key.
 * @param {unknown} value Raw value.
 * @returns {string|symbol} Key or INVALID.
 */
export function requestIdValue(value) {
  return typeof value === "string" && REQUEST_ID_RE.test(value) ? value : INVALID;
}

/**
 * A `limit` query parameter: absent -> fallback; otherwise an integer in
 * [1, max] (larger values are clamped, junk is INVALID).
 * @param {URL} url Request URL.
 * @param {number} fallback Default.
 * @param {number} max Maximum.
 * @returns {number|symbol} Limit or INVALID.
 */
export function limitValue(url, fallback, max) {
  const raw = url.searchParams.get("limit");
  if (raw === null || raw === "") {
    return fallback;
  }
  if (!/^\d{1,6}$/.test(raw) || Number(raw) < 1) {
    return INVALID;
  }
  return Math.min(max, Number(raw));
}

/**
 * The query string as a plain object (first value per key).
 * @param {URL} url Request URL.
 * @returns {Object} Params.
 */
export function queryObject(url) {
  const out = {};
  for (const [key, value] of url.searchParams) {
    if (!(key in out)) {
      out[key] = value;
    }
  }
  return out;
}
