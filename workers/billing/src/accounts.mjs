/**
 * Accounts, identities, sign-in bookkeeping, roles and the admin rule.
 *
 * An account is keyed by id. `email_normalized` is set only for an address
 * somebody proved (email code, Google `email_verified`) or an admin typed, and
 * is unique among live accounts (partial index). How a person proves who they
 * are is an `identities` row, keyed (provider, subject).
 */

import { normalizeEmail } from "./address.mjs";
import { adminEmails } from "./config.mjs";
import { randomId } from "./crypto.mjs";

/** Admin sessions must be Google sign-ins younger than this. */
export const ADMIN_SESSION_SECONDS = 12 * 3600;

/**
 * Read an account by id.
 * @param {Object} db D1 binding.
 * @param {string} id Account id.
 * @returns {Promise<Object|null>} Row.
 */
export async function getAccount(db, id) {
  if (!id) {
    return null;
  }
  return db.prepare("SELECT * FROM accounts WHERE id = ?1").bind(id).first();
}

/**
 * Find the live (not deleted) account holding a normalized email.
 * @param {Object} db D1 binding.
 * @param {string} normalized Normalized email.
 * @returns {Promise<Object|null>} Row.
 */
export async function findLiveAccountByEmail(db, normalized) {
  if (!normalized) {
    return null;
  }
  return db
    .prepare("SELECT * FROM accounts WHERE email_normalized = ?1 AND deleted_at IS NULL")
    .bind(normalized)
    .first();
}

/**
 * Create an account, reporting whether this call created it. Two racing
 * creates for one email end on the same row: the insert yields to the partial
 * unique index and the winner is re-read (created: false for the loser).
 * @param {{db: Object, now: number}} ctx Context.
 * @param {{email: string|null, emailNormalized: string|null, emailVerified: boolean,
 *          displayName?: string, locale?: string}} fields Fields.
 * @returns {Promise<{account: Object, created: boolean}>} Account row and whether it is new.
 */
export async function createAccountDetailed(ctx, fields) {
  const id = randomId("acct");
  await ctx.db
    .prepare(
      `INSERT INTO accounts (id, email, email_normalized, email_verified, display_name, locale, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)
       ON CONFLICT DO NOTHING`
    )
    .bind(
      id,
      fields.email ? String(fields.email).slice(0, 254) : null,
      fields.emailNormalized || null,
      fields.emailVerified ? 1 : 0,
      fields.displayName ? String(fields.displayName).slice(0, 80) : null,
      fields.locale ? String(fields.locale).slice(0, 16) : null,
      ctx.now
    )
    .run();
  const created = await getAccount(ctx.db, id);
  if (created) {
    return { account: created, created: true };
  }
  const existing = await findLiveAccountByEmail(ctx.db, fields.emailNormalized);
  if (!existing) {
    throw new Error("account_insert_failed");
  }
  return { account: existing, created: false };
}

/**
 * Create an account (or return the live one that won a race for its email).
 * @param {{db: Object, now: number}} ctx Context.
 * @param {Object} fields See createAccountDetailed.
 * @returns {Promise<Object>} Account row.
 */
export async function createAccount(ctx, fields) {
  return (await createAccountDetailed(ctx, fields)).account;
}

/**
 * The live account for an email an admin typed, creating it (unverified,
 * never signed in) when there is none.
 * @param {{db: Object, now: number}} ctx Context.
 * @param {string} email Normalized email.
 * @returns {Promise<{account: Object, created: boolean}>} Account and whether this call created it.
 */
export async function findOrCreateByEmail(ctx, email) {
  const existing = await findLiveAccountByEmail(ctx.db, email);
  if (existing) {
    return { account: existing, created: false };
  }
  return createAccountDetailed(ctx, { email, emailNormalized: email, emailVerified: false });
}

/**
 * A provider subject shortened for display: enough to tell two apart,
 * never enough to reuse ("1100…42").
 * @param {string} subject Subject.
 * @returns {string} Masked subject.
 */
export function maskSubject(subject) {
  const text = String(subject || "");
  return text.length > 8 ? `${text.slice(0, 4)}…${text.slice(-2)}` : `…${text.slice(-2)}`;
}

/**
 * Read an identity.
 * @param {Object} db D1 binding.
 * @param {string} provider google | microsoft | email.
 * @param {string} subject Provider subject.
 * @returns {Promise<Object|null>} Row.
 */
export async function findIdentity(db, provider, subject) {
  return db.prepare("SELECT * FROM identities WHERE provider = ?1 AND subject = ?2").bind(provider, subject).first();
}

/**
 * True when the account already has an identity from this provider.
 * @param {Object} db D1 binding.
 * @param {string} accountId Account id.
 * @param {string} provider Provider.
 * @returns {Promise<boolean>} Linked.
 */
export async function hasProviderIdentity(db, accountId, provider) {
  const row = await db
    .prepare("SELECT 1 AS x FROM identities WHERE account_id = ?1 AND provider = ?2 LIMIT 1")
    .bind(accountId, provider)
    .first();
  return Boolean(row);
}

/**
 * Attach an identity to an account. Idempotent for the same account; an
 * identity already owned by another account is refused, never moved.
 * `emailAuthoritative`: the provider proves mailbox ownership of emailAtLink
 * (an email code; Google for @gmail.com or a Workspace hd address).
 * @param {{db: Object, now: number}} ctx Context.
 * @param {{provider: string, subject: string, accountId: string, emailAtLink: string|null,
 *          emailAuthoritative?: boolean}} link Link.
 * @returns {Promise<{ok: true, accountId: string}|{ok: false, reason: string, accountId: string}>} Result.
 */
export async function linkIdentity(ctx, link) {
  await ctx.db
    .prepare(
      `INSERT INTO identities (provider, subject, account_id, email_at_link, created_at, email_authoritative)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6) ON CONFLICT (provider, subject) DO NOTHING`
    )
    .bind(link.provider, link.subject, link.accountId, link.emailAtLink || null, ctx.now, link.emailAuthoritative ? 1 : 0)
    .run();
  const row = await findIdentity(ctx.db, link.provider, link.subject);
  if (row.account_id === link.accountId) {
    return { ok: true, accountId: row.account_id };
  }
  return { ok: false, reason: "identity_in_use", accountId: row.account_id };
}

/**
 * Record a sign-in: first_signin_at once, terms and age every time, and
 * upgrade (never downgrade) email_verified.
 * @param {{db: Object, now: number}} ctx Context.
 * @param {string} accountId Account id.
 * @param {{termsVersion: string, emailVerified: boolean}} proof What this sign-in proved.
 * @returns {Promise<void>} Resolves when written.
 */
export async function recordSignin(ctx, accountId, proof) {
  await ctx.db
    .prepare(
      `UPDATE accounts SET
         first_signin_at = COALESCE(first_signin_at, ?2),
         terms_version = ?3,
         age_confirmed_at = ?2,
         email_verified = MAX(email_verified, ?4),
         updated_at = ?2
       WHERE id = ?1`
    )
    .bind(accountId, ctx.now, proof.termsVersion, proof.emailVerified ? 1 : 0)
    .run();
}

/**
 * Why an account may not be used, or null.
 * @param {Object|null} account Row.
 * @returns {string|null} Reason.
 */
export function accountBlockReason(account) {
  if (!account) {
    return "no_account";
  }
  if (account.deleted_at !== null && account.deleted_at !== undefined) {
    return "account_deleted";
  }
  if (account.disabled_at !== null && account.disabled_at !== undefined) {
    return "account_disabled";
  }
  return null;
}

/**
 * Roles that are neither revoked nor expired.
 * @param {{db: Object, now: number}} ctx Context.
 * @param {string} accountId Account id.
 * @returns {Promise<string[]>} Distinct role names.
 */
export async function activeRoles(ctx, accountId) {
  const rows = await ctx.db
    .prepare(
      `SELECT DISTINCT role FROM account_roles
       WHERE account_id = ?1 AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?2)
       ORDER BY role`
    )
    .bind(accountId, ctx.now)
    .all();
  return rows.results.map((row) => row.role);
}

/**
 * True when the Google identity that created this session proves the
 * account's own address: it belongs to this account, Google is
 * authoritative for its address, and that address IS the account's email.
 * Session rows carry the identity through sessions.SESSION_SELECT.
 * @param {Object} account Account row.
 * @param {Object} session Session row (with identity_* fields).
 * @returns {boolean} Proven.
 */
function sessionProvesAdminAddress(account, session) {
  return (
    session.method === "google" &&
    Boolean(session.identity_subject) &&
    session.identity_account_id === account.id &&
    Number(session.identity_authoritative) === 1 &&
    normalizeEmail(session.identity_email) === account.email_normalized
  );
}

/**
 * Why this session is not an admin session, or null when it is.
 *
 * The admin rule (DESIGN-v2 §4, tightened in review round 1): a verified
 * email listed in ADMIN_EMAILS (read per request) AND a session created
 * within the last 12 hours by a Google identity that is authoritative for
 * THAT address (sessionProvesAdminAddress). Any other Google account linked
 * to the admin account (e.g. by someone holding one emailed code) never
 * makes admin. Admin is never stored. A listed, verified admin whose session
 * fails only the Google part gets "reauth_required" (sign in with your own
 * Google again); everyone else gets "forbidden", so a non-admin learns nothing.
 * @param {Object} env Worker env.
 * @param {Object} account Account row.
 * @param {Object} session Session row.
 * @param {number} now Epoch seconds.
 * @returns {"forbidden"|"reauth_required"|null} Denial.
 */
export function adminDenial(env, account, session, now) {
  const listed =
    Boolean(account && session) && Number(account.email_verified) === 1 && adminEmails(env).includes(account.email_normalized);
  if (!listed) {
    return "forbidden";
  }
  const fresh = now - Number(session.created_at) <= ADMIN_SESSION_SECONDS;
  return fresh && sessionProvesAdminAddress(account, session) ? null : "reauth_required";
}

/**
 * True when the account's address is listed in ADMIN_EMAILS (verified or not).
 * @param {Object} env Worker env.
 * @param {Object} account Account row.
 * @returns {boolean} Listed.
 */
export function isListedAdminAddress(env, account) {
  return Boolean(account && account.email_normalized) && adminEmails(env).includes(account.email_normalized);
}

/**
 * The admin rule as a boolean (see adminDenial).
 * @param {Object} env Worker env.
 * @param {Object} account Account row.
 * @param {Object} session Session row.
 * @param {number} now Epoch seconds.
 * @returns {boolean} Admin.
 */
export function isAdminSession(env, account, session, now) {
  return adminDenial(env, account, session, now) === null;
}
