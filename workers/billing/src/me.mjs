/**
 * The "me" payload every sign-in, link, trial and GET /v1/me return
 * (DESIGN-v2 §4 + v3), so the client always reads ONE shape:
 *
 *   {ok, account: {id, email, emailVerified, displayName, isAdmin, roles,
 *                  trialAvailable, firstSigninAt, signInMethod,
 *                  identities: [{provider, subject (masked), createdAt}]},
 *    access: resolveAccess(...),
 *    subscriptions: [{id, provider, plan, status, cancelAtPeriodEnd,
 *                     paidThrough, manageUrl}],
 *    grants: [{id, kind, days, start, end, state, createdAt}],
 *    checkoutPending, serverTime}
 *
 * Not here yet (named, later stage): the ES256 `licenseToken` of DESIGN-v3
 * D-ORCH-03. Admin notes and issuers never reach the client.
 */

import { activeRoles, isAdminSession } from "./accounts.mjs";
import { paidThrough } from "./access.mjs";
import { accessSnapshot, publicGrant } from "./entitlement.mjs";
import { publicIdentities } from "./identities.mjs";
import { trialBlockReason, trialClaimKeys } from "./trial-claims.mjs";

/** A checkout or pending subscription younger than this blocks a new one. */
export const CHECKOUT_PENDING_SECONDS = 3600;

/** Provider-side management pages (cancellation must never depend on us). */
const PROVIDER_PORTALS = { mercadopago: "https://www.mercadopago.com.pe/subscriptions" };

/**
 * Whether the account could start a trial now. Without the pepper the
 * claims cannot be checked, so the answer is no.
 * @param {Object} ctx Context.
 * @param {Object} account Account row.
 * @param {Object} rows Access rows (grants, subscriptions).
 * @returns {Promise<boolean>} Available.
 */
async function trialAvailable(ctx, account, rows) {
  if (!ctx.pepper) {
    return false;
  }
  const keys = await trialClaimKeys(ctx, account);
  return (await trialBlockReason(ctx, account, rows, keys)) === null;
}

/**
 * Client-safe view of the signed-in account.
 * @param {Object} ctx Context (`env`, `now`, `db`, `pepper`).
 * @param {Object} account Account row.
 * @param {Object} session Session row.
 * @param {Object} rows Access rows.
 * @returns {Promise<Object>} Public account.
 */
async function publicAccount(ctx, account, session, rows) {
  return {
    id: account.id,
    email: account.email || null,
    emailVerified: Number(account.email_verified) === 1,
    displayName: account.display_name || null,
    isAdmin: isAdminSession(ctx.env, account, session, ctx.now),
    roles: await activeRoles(ctx, account.id),
    trialAvailable: await trialAvailable(ctx, account, rows),
    firstSigninAt: account.first_signin_at === null ? null : Number(account.first_signin_at),
    signInMethod: session.method,
    identities: await publicIdentities(ctx.db, account.id)
  };
}

/**
 * Client view of the subscriptions, newest first.
 * @param {{subscriptions: Object[], charges: Object[]}} rows Access rows.
 * @returns {Object[]} Public subscriptions.
 */
export function publicSubscriptions(rows) {
  return [...rows.subscriptions]
    .sort((a, b) => Number(b.created_at) - Number(a.created_at))
    .map((s) => ({
      id: s.id,
      provider: s.provider,
      plan: s.plan,
      status: s.status,
      cancelAtPeriodEnd: Number(s.cancel_at_period_end) === 1,
      paidThrough: paidThrough(s.id, rows.charges),
      manageUrl: PROVIDER_PORTALS[s.provider] || null
    }));
}

/**
 * True when a checkout is in flight: an open checkout, or a pending
 * subscription, younger than an hour.
 * @param {Object} ctx Context.
 * @param {Object} account Account row.
 * @param {Object[]} subscriptions Subscription rows.
 * @returns {Promise<boolean>} Pending.
 */
async function checkoutPending(ctx, account, subscriptions) {
  const since = ctx.now - CHECKOUT_PENDING_SECONDS;
  if (subscriptions.some((s) => s.status === "pending" && Number(s.created_at) > since)) {
    return true;
  }
  const open = await ctx.db
    .prepare("SELECT 1 AS hit FROM checkouts WHERE account_id = ?1 AND status = 'open' AND created_at > ?2 LIMIT 1")
    .bind(account.id, since)
    .first();
  return Boolean(open);
}

/**
 * Build the me payload.
 * @param {Object} ctx Context.
 * @param {Object} account Account row.
 * @param {Object} session Session row.
 * @returns {Promise<Object>} Payload.
 */
export async function buildMePayload(ctx, account, session) {
  const { rows, access, schedule } = await accessSnapshot(ctx, account);
  return {
    ok: true,
    account: await publicAccount(ctx, account, session, rows),
    access,
    subscriptions: publicSubscriptions(rows),
    grants: schedule.map(publicGrant),
    checkoutPending: await checkoutPending(ctx, account, rows.subscriptions),
    serverTime: ctx.now
  };
}

/**
 * GET /v1/me.
 * @param {Object} ctx Context with `account` and `session`.
 * @returns {Promise<Object>} Result.
 */
export async function handleGetMe(ctx) {
  return { status: 200, body: await buildMePayload(ctx, ctx.account, ctx.session) };
}
