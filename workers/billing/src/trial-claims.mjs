/**
 * Trial anti-abuse claims (DESIGN-v2 §4, review "trial is re-obtainable").
 *
 * A trial is claimed for every way the person proved who they are, as
 * HMAC(SERVER_PEPPER, "trial:<source>"), in `trial_claims`, which survives
 * account deletion (the privacy page states this). The sources are:
 *   account:<id>                     the account row itself
 *   email:<canonical>                every PROVEN email: the account email when
 *                                    email_verified, email-code identities, and
 *                                    the address of Google identities Google is
 *                                    authoritative for (@gmail.com, Workspace);
 *                                    canonical strips +tags and Gmail dots
 *   google:<sub>, microsoft:<tid:oid> every OIDC subject
 * A Microsoft email claim is never used: Microsoft does not prove mailbox
 * ownership, and a claimed address would let anyone burn a stranger's trial.
 * Stated limit: a genuinely new mailbox still gets a new trial.
 */

import { canonicalEmail, normalizeEmail } from "./address.mjs";
import { hmacHex } from "./crypto.mjs";

/**
 * The claim source for one identity row, or null.
 * @param {{provider: string, subject: string, email_at_link: string|null, email_authoritative: number}} identity Row.
 * @returns {string[]} Sources.
 */
function identitySources(identity) {
  if (identity.provider === "email") {
    return [`email:${canonicalEmail(normalizeEmail(identity.subject))}`];
  }
  const sources = [`${identity.provider}:${identity.subject}`];
  const proven = identity.provider === "google" && Number(identity.email_authoritative) === 1;
  const googleEmail = proven ? normalizeEmail(identity.email_at_link) : "";
  return googleEmail ? sources.concat(`email:${canonicalEmail(googleEmail)}`) : sources;
}

/**
 * Every claim source for an account.
 * @param {Object} db D1 binding.
 * @param {Object} account Account row.
 * @returns {Promise<string[]>} Distinct sources.
 */
async function claimSources(db, account) {
  const identities = await db
    .prepare("SELECT provider, subject, email_at_link, email_authoritative FROM identities WHERE account_id = ?1")
    .bind(account.id)
    .all();
  const sources = new Set([`account:${account.id}`]);
  if (account.email_normalized && Number(account.email_verified) === 1) {
    sources.add(`email:${canonicalEmail(account.email_normalized)}`);
  }
  for (const identity of identities.results) {
    identitySources(identity).forEach((source) => sources.add(source));
  }
  return [...sources].filter((source) => source !== "email:");
}

/**
 * The HMAC keys this account's trial claim is stored under.
 * @param {{db: Object, pepper: Uint8Array}} ctx Context (pepper required).
 * @param {Object} account Account row.
 * @returns {Promise<string[]>} Hex keys.
 */
export async function trialClaimKeys(ctx, account) {
  const sources = await claimSources(ctx.db, account);
  return Promise.all(sources.map((source) => hmacHex(ctx.pepper, `trial:${source}`)));
}

/**
 * True when any of the keys is already claimed.
 * @param {Object} db D1 binding.
 * @param {string[]} keys Hex keys.
 * @returns {Promise<boolean>} Claimed.
 */
export async function anyClaimed(db, keys) {
  if (!keys.length) {
    return false;
  }
  const placeholders = keys.map((_, i) => `?${i + 1}`).join(", ");
  const row = await db.prepare(`SELECT 1 AS hit FROM trial_claims WHERE key IN (${placeholders}) LIMIT 1`).bind(...keys).first();
  return Boolean(row);
}

/**
 * True when a value is set (not null/undefined).
 * @param {unknown} value Value.
 * @returns {boolean} Set.
 */
function isSet(value) {
  return value !== null && value !== undefined;
}

/**
 * Why this account cannot start a trial, or null.
 * @param {{db: Object}} ctx Context.
 * @param {Object} account Account row.
 * @param {{grants: Object[], subscriptions: Object[]}} rows The account's grants and subscriptions.
 * @param {string[]} keys trialClaimKeys output.
 * @returns {Promise<"trial_used"|"trial_not_available"|null>} Reason.
 */
export async function trialBlockReason(ctx, account, rows, keys) {
  if (isSet(account.trial_used_at) || rows.grants.some((g) => g.kind === "trial")) {
    return "trial_used";
  }
  if (rows.subscriptions.some((s) => isSet(s.first_active_at))) {
    return "trial_not_available";
  }
  return (await anyClaimed(ctx.db, keys)) ? "trial_used" : null;
}
