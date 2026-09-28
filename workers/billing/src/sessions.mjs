/**
 * Cookie sessions.
 *
 * - The token is 32 random bytes; only its SHA-256 is stored.
 * - A session lives in a 30-day window that is re-armed at most once a day
 *   (renewed_at), and never past created_at + SESSION_MAX_DAYS (absolute cap,
 *   ASVS 3.3). A daily user therefore stays signed in until the cap, and an
 *   idle one is signed out after 30 days.
 * - Revoked or expired sessions, and sessions of disabled or deleted accounts,
 *   are refused.
 * - A session records WHICH identity created it (identity_subject, of the
 *   `method` provider), and every read joins that identity (SESSION_SELECT),
 *   so the admin rule can check the admin's own Google identity.
 */

import { accountBlockReason, getAccount } from "./accounts.mjs";
import { sessionMaxSeconds } from "./config.mjs";
import { randomId, randomToken, sha256Hex } from "./crypto.mjs";

/** The sliding window re-armed on use. */
export const SESSION_WINDOW_SECONDS = 30 * 86400;

/** Renewal writes at most once per this interval. */
export const SESSION_RENEW_SECONDS = 86400;

/** "Recent authentication" for export, delete and identity linking. */
export const RECENT_AUTH_SECONDS = 600;

const TOKEN_SHAPE = /^[A-Za-z0-9_-]{43}$/;

/** A session row plus the identity that created it (null fields when none). */
export const SESSION_SELECT = `SELECT s.*, i.account_id AS identity_account_id, i.email_at_link AS identity_email,
    i.email_authoritative AS identity_authoritative
  FROM sessions s LEFT JOIN identities i ON i.provider = s.method AND i.subject = s.identity_subject`;

/**
 * Read one session (with its identity) by id.
 * @param {Object} db D1 binding.
 * @param {string} id Session id.
 * @returns {Promise<Object|null>} Row.
 */
export function getSession(db, id) {
  return db.prepare(`${SESSION_SELECT} WHERE s.id = ?1`).bind(id).first();
}

/**
 * Expiry for a session created at `createdAt`, evaluated at `now`.
 * @param {Object} env Worker env.
 * @param {number} createdAt Creation time.
 * @param {number} now Clock.
 * @returns {number} Epoch seconds.
 */
function expiryAt(env, createdAt, now) {
  return Math.min(now + SESSION_WINDOW_SECONDS, createdAt + sessionMaxSeconds(env));
}

/**
 * Create a session for an account.
 * @param {{env: Object, db: Object, now: number}} ctx Context.
 * @param {string} accountId Account id.
 * @param {"google"|"microsoft"|"email"} method How the user proved themselves.
 * @param {string|null} [identitySubject] The identity (of `method`) that signed in.
 * @returns {Promise<{token: string, session: Object, maxAge: number}>} The token, once; the
 *   session row as SESSION_SELECT reads it.
 */
export async function createSession(ctx, accountId, method, identitySubject = null) {
  const token = randomToken();
  const id = randomId("sess");
  const expiresAt = expiryAt(ctx.env, ctx.now, ctx.now);
  await ctx.db
    .prepare(
      `INSERT INTO sessions (id, account_id, token_hash, method, created_at, renewed_at, expires_at, identity_subject)
       VALUES (?1, ?2, ?3, ?4, ?5, ?5, ?6, ?7)`
    )
    .bind(id, accountId, await sha256Hex(token), method, ctx.now, expiresAt, identitySubject)
    .run();
  const session = await getSession(ctx.db, id);
  return { token, session, maxAge: expiresAt - ctx.now };
}

/**
 * Why a stored session cannot be used at `now`, or null.
 * @param {Object|null} session Row.
 * @param {number} now Clock.
 * @returns {string|null} Reason.
 */
function sessionBlockReason(session, now) {
  if (!session) {
    return "no_session";
  }
  if (session.revoked_at !== null) {
    return "session_revoked";
  }
  return Number(session.expires_at) <= now ? "session_expired" : null;
}

/**
 * Re-arm the window if the last renewal is a day old.
 * @param {{env: Object, db: Object, now: number}} ctx Context.
 * @param {Object} session Row (updated in place).
 * @returns {Promise<number|null>} New cookie Max-Age, or null when not renewed.
 */
async function maybeRenew(ctx, session) {
  if (ctx.now - Number(session.renewed_at) < SESSION_RENEW_SECONDS) {
    return null;
  }
  const expiresAt = expiryAt(ctx.env, Number(session.created_at), ctx.now);
  await ctx.db
    .prepare("UPDATE sessions SET renewed_at = ?2, expires_at = ?3 WHERE id = ?1 AND revoked_at IS NULL")
    .bind(session.id, ctx.now, expiresAt)
    .run();
  session.renewed_at = ctx.now;
  session.expires_at = expiresAt;
  return expiresAt - ctx.now;
}

/**
 * Resolve a session token.
 * @param {{env: Object, db: Object, now: number}} ctx Context.
 * @param {unknown} token Token from the cookie.
 * @returns {Promise<{ok: true, account: Object, session: Object, renewedMaxAge: number|null}|
 *                   {ok: false, reason: string}>} Result.
 */
export async function resolveSession(ctx, token) {
  if (typeof token !== "string" || !TOKEN_SHAPE.test(token)) {
    return { ok: false, reason: "no_session" };
  }
  const session = await ctx.db.prepare(`${SESSION_SELECT} WHERE s.token_hash = ?1`).bind(await sha256Hex(token)).first();
  const sessionReason = sessionBlockReason(session, ctx.now);
  if (sessionReason) {
    return { ok: false, reason: sessionReason };
  }
  const account = await getAccount(ctx.db, session.account_id);
  const accountReason = accountBlockReason(account);
  if (accountReason) {
    return { ok: false, reason: accountReason };
  }
  const renewedMaxAge = await maybeRenew(ctx, session);
  return { ok: true, account, session, renewedMaxAge };
}

/**
 * Revoke one session.
 * @param {{db: Object, now: number}} ctx Context.
 * @param {string} sessionId Session id.
 * @returns {Promise<void>} Resolves when revoked.
 */
export async function revokeSession(ctx, sessionId) {
  await ctx.db
    .prepare("UPDATE sessions SET revoked_at = ?2 WHERE id = ?1 AND revoked_at IS NULL")
    .bind(sessionId, ctx.now)
    .run();
}

/**
 * Revoke every session of an account.
 * @param {{db: Object, now: number}} ctx Context.
 * @param {string} accountId Account id.
 * @returns {Promise<void>} Resolves when revoked.
 */
export async function revokeAllSessions(ctx, accountId) {
  await ctx.db
    .prepare("UPDATE sessions SET revoked_at = ?2 WHERE account_id = ?1 AND revoked_at IS NULL")
    .bind(accountId, ctx.now)
    .run();
}

/**
 * True when the session was created in the last RECENT_AUTH_SECONDS.
 * @param {Object} session Row.
 * @param {number} now Clock.
 * @returns {boolean} Recent.
 */
export function isRecentAuth(session, now) {
  return now - Number(session.created_at) <= RECENT_AUTH_SECONDS;
}
