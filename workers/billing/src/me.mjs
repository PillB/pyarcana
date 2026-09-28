/**
 * The "me" payload every sign-in and GET /v1/me return.
 *
 * Stage 1a carries the account part only. Later stages extend
 * `buildMePayload` with access (resolveAccess), subscriptions, grants and
 * checkoutPending, so the client always reads ONE shape.
 */

import { activeRoles, isAdminSession } from "./accounts.mjs";

/**
 * Client-safe view of the signed-in account.
 * @param {Object} ctx Context (`env`, `now`, `db`).
 * @param {Object} account Account row.
 * @param {Object} session Session row.
 * @returns {Promise<Object>} Public account.
 */
async function publicAccount(ctx, account, session) {
  return {
    id: account.id,
    email: account.email || null,
    emailVerified: Number(account.email_verified) === 1,
    displayName: account.display_name || null,
    isAdmin: isAdminSession(ctx.env, account, session, ctx.now),
    roles: await activeRoles(ctx, account.id),
    firstSigninAt: account.first_signin_at === null ? null : Number(account.first_signin_at),
    signInMethod: session.method
  };
}

/**
 * Build the me payload.
 * @param {Object} ctx Context.
 * @param {Object} account Account row.
 * @param {Object} session Session row.
 * @returns {Promise<Object>} Payload.
 */
export async function buildMePayload(ctx, account, session) {
  return { ok: true, account: await publicAccount(ctx, account, session), serverTime: ctx.now };
}

/**
 * GET /v1/me.
 * @param {Object} ctx Context with `account` and `session`.
 * @returns {Promise<Object>} Result.
 */
export async function handleGetMe(ctx) {
  return { status: 200, body: await buildMePayload(ctx, ctx.account, ctx.session) };
}
