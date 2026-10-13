/**
 * Email address rules.
 *
 * - `normalizeEmail` is the lookup and uniqueness key: trimmed and lowercased
 *   only. Stripping dots or +tags for lookup would merge accounts that other
 *   providers treat as different mailboxes.
 * - `canonicalEmail` is used ONLY to key trial anti-abuse claims, so one
 *   mailbox cannot mint a trial per `+tag` or per Gmail dot pattern.
 */

const SHAPE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);

/**
 * Normalize an email for lookup.
 * @param {unknown} value Raw email.
 * @returns {string} Normalized email, or "" when unusable.
 */
export function normalizeEmail(value) {
  if (typeof value !== "string") {
    return "";
  }
  const raw = value.trim().toLowerCase();
  if (raw.length > 254 || !SHAPE.test(raw)) {
    return "";
  }
  return raw.indexOf("@") > 64 ? "" : raw;
}

/**
 * Canonical form of a normalized email for trial claims.
 * @param {string} normalized Output of normalizeEmail.
 * @returns {string} Canonical email ("" stays "").
 */
export function canonicalEmail(normalized) {
  const at = normalized.lastIndexOf("@");
  if (at <= 0) {
    return normalized;
  }
  let local = normalized.slice(0, at).split("+")[0];
  let domain = normalized.slice(at + 1);
  if (GMAIL_DOMAINS.has(domain)) {
    local = local.replace(/\./g, "");
    domain = "gmail.com";
  }
  return local ? `${local}@${domain}` : normalized;
}
