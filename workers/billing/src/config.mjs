/**
 * Typed access to the worker's [vars] and secrets.
 *
 * Every numeric var has a documented default and a clamp, so a typo in
 * wrangler.toml degrades to the default instead of NaN. Missing SECRETS are
 * never defaulted: callers fail closed with a 503 reason code.
 */

import { normalizeEmail } from "./address.mjs";

/**
 * Parse an integer var, clamped to [min, max]; junk gives the fallback.
 * @param {Object} env Worker env.
 * @param {string} name Var name.
 * @param {number} fallback Default.
 * @param {number} min Lower bound.
 * @param {number} max Upper bound.
 * @returns {number} Integer.
 */
export function intVar(env, name, fallback, min, max) {
  const raw = env ? env[name] : undefined;
  const text = typeof raw === "number" ? String(raw) : String(raw || "").trim();
  if (!/^-?\d+$/.test(text)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Number.parseInt(text, 10)));
}

/**
 * Split a comma-separated var.
 * @param {Object} env Worker env.
 * @param {string} name Var name.
 * @returns {string[]} Non-empty trimmed parts.
 */
export function listVar(env, name) {
  const raw = env && typeof env[name] === "string" ? env[name] : "";
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * A trimmed string var, or "".
 * @param {Object} env Worker env.
 * @param {string} name Var name.
 * @returns {string} Value.
 */
export function stringVar(env, name) {
  return env && typeof env[name] === "string" ? env[name].trim() : "";
}

/**
 * Trial length in days (DESIGN-v3: default 7).
 * @param {Object} env Worker env.
 * @returns {number} Days.
 */
export function trialDays(env) {
  return intVar(env, "TRIAL_DAYS", 7, 1, 90);
}

/**
 * Grace after a renewing paid period, in days (default 7).
 * @param {Object} env Worker env.
 * @returns {number} Days.
 */
export function graceDays(env) {
  return intVar(env, "GRACE_DAYS", 7, 0, 30);
}

/**
 * Absolute session lifetime in seconds (SESSION_MAX_DAYS, default 180).
 * @param {Object} env Worker env.
 * @returns {number} Seconds.
 */
export function sessionMaxSeconds(env) {
  return intVar(env, "SESSION_MAX_DAYS", 180, 1, 400) * 86400;
}

/**
 * Global daily email cap (default 90, below Resend's free 100/day).
 * @param {Object} env Worker env.
 * @returns {number} Emails per UTC day.
 */
export function emailDailyCap(env) {
  return intVar(env, "EMAIL_DAILY_CAP", 90, 1, 100000);
}

/**
 * Ceiling on the bytes of report screenshots stored in D1, all reports
 * together (REPORT_ATTACHMENTS_CAP_MB, MiB, default 200: well under the
 * 500 MB of a D1 Free database, so a full screenshot store can never stop
 * sign-in, sessions or progress writes). Above it, screenshots are refused
 * and report text is still stored.
 * @param {Object} env Worker env.
 * @returns {number} Bytes.
 */
export function reportAttachmentsCapBytes(env) {
  return intVar(env, "REPORT_ATTACHMENTS_CAP_MB", 200, 1, 9000) * 1024 * 1024;
}

/**
 * Ceiling on the bytes of report TEXT stored in D1, all reports together
 * (REPORT_TEXT_CAP_MB, MiB, default 100; review round 2). A report is
 * charged its reports.text_bytes: the UTF-8 size of its text columns plus a
 * fixed row overhead. With the 200 MiB screenshot ceiling, reports can hold
 * at most ~315 MB of a 500 MB D1 Free database, so sign-in, sessions and
 * progress keep ~185 MB. Above it, new reports are refused (507
 * report_storage_full) until the owner deletes old ones in D1 (no route does
 * that yet; README "Not built yet").
 * @param {Object} env Worker env.
 * @returns {number} Bytes.
 */
export function reportTextCapBytes(env) {
  return intVar(env, "REPORT_TEXT_CAP_MB", 100, 1, 9000) * 1024 * 1024;
}

/**
 * The terms version sign-in must echo, or "" when unset.
 * @param {Object} env Worker env.
 * @returns {string} Version.
 */
export function termsVersion(env) {
  return stringVar(env, "TERMS_VERSION");
}

/**
 * Admin addresses from the ADMIN_EMAILS secret, normalized. Read per request.
 * @param {Object} env Worker env.
 * @returns {string[]} Emails.
 */
export function adminEmails(env) {
  return listVar(env, "ADMIN_EMAILS").map(normalizeEmail).filter(Boolean);
}

/**
 * True only for `http://localhost` with an optional port.
 * @param {string} origin Origin text.
 * @returns {boolean} Local.
 */
export function isLocalhostOrigin(origin) {
  try {
    const url = new URL(origin);
    return url.protocol === "http:" && url.hostname === "localhost" && url.origin === origin;
  } catch {
    return false;
  }
}
