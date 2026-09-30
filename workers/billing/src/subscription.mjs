/**
 * The buyer's own subscription routes (DESIGN-v2 §4).
 *
 * POST /v1/me/subscription/refresh {} -> the me payload plus
 *   `refresh: {ok}`. Re-reads the provider for the caller's OWN open
 *   checkouts (younger than 7 days) and pending / active / past_due
 *   subscriptions, and applies what the provider says. This is how the
 *   checkout return page learns about a payment: a server-side API read,
 *   never a grant on the return URL. A provider outage changes nothing
 *   (refresh.ok false). 30 per account per hour.
 *
 * POST /v1/me/subscription/cancel {subscriptionId} -> the me payload.
 *   Calls the provider (Mercado Pago: PUT status cancelled, immediate;
 *   Creem: cancel mode "scheduled", at period end), RE-READS it, and stores
 *   only the confirmed state, with an audit line and a subscription event.
 *   Any error is 502 cancel_failed with nothing stored. An already-cancelled
 *   row answers at once. Access runs to paid-through; a cancelled or
 *   cancelling subscription earns no grace (access.mjs). No confirmation
 *   email is promised or sent (DESIGN-v3-delta: no voluntary promises).
 */

import { writeAudit } from "./audit.mjs";
import { buildMePayload } from "./me.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

/** Refreshes per account per hour. */
export const REFRESHES_PER_HOUR = 30;

/** Cancel attempts per account per hour. */
export const CANCELS_PER_HOUR = 10;

const WEEK = 7 * 86400;

/**
 * 429 unless a hit is left.
 * @param {Object} ctx Context.
 * @param {string} name Bucket.
 * @param {number} limit Per hour.
 * @returns {Promise<Object|null>} Stop or null.
 */
async function limited(ctx, name, limit) {
  const hit = await hitRateLimit(ctx, `${name}:${ctx.account.id}`, limit, 3600);
  return hit.ok ? null : { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter } };
}

/**
 * Re-read one row through its adapter; a throw counts as a failure.
 * @param {Object} ctx Context.
 * @param {string} method "sync" | "syncCheckout".
 * @param {Object} row Row (has `provider`).
 * @param {string} source Source label.
 * @returns {Promise<boolean>} Succeeded.
 */
export async function syncRow(ctx, method, row, source) {
  const adapter = ctx.providers[row.provider];
  if (!adapter || typeof adapter[method] !== "function") {
    return false;
  }
  try {
    const outcome = await adapter[method](ctx, row, { source });
    return Boolean(outcome && outcome.ok);
  } catch (error) {
    ctx.log(`sync ${row.provider} failed: ${error && error.message ? error.message : "unknown"}`);
    return false;
  }
}

/**
 * POST /v1/me/subscription/refresh.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export async function handleRefresh(ctx) {
  const stop = await limited(ctx, "refresh", REFRESHES_PER_HOUR);
  if (stop) {
    return stop;
  }
  const [checkouts, subs] = await ctx.db.batch([
    ctx.db
      .prepare("SELECT * FROM checkouts WHERE account_id = ?1 AND status = 'open' AND provider_ref IS NOT NULL AND created_at > ?2 ORDER BY created_at")
      .bind(ctx.account.id, ctx.now - WEEK),
    ctx.db.prepare("SELECT * FROM subscriptions WHERE account_id = ?1 AND status IN ('pending', 'active', 'past_due') ORDER BY created_at").bind(ctx.account.id)
  ]);
  const covered = new Set(subs.results.map((s) => `${s.provider}:${s.provider_ref}`));
  let ok = true;
  for (const checkout of checkouts.results) {
    const alsoSubscription = checkout.provider === "mercadopago" && covered.has(`mercadopago:${checkout.provider_ref}`);
    ok = (alsoSubscription || (await syncRow(ctx, "syncCheckout", checkout, "refresh"))) && ok;
  }
  for (const sub of subs.results) {
    ok = (await syncRow(ctx, "sync", sub, "refresh")) && ok;
  }
  const account = await ctx.db.prepare("SELECT * FROM accounts WHERE id = ?1").bind(ctx.account.id).first();
  return { status: 200, body: { ...(await buildMePayload(ctx, account, ctx.session)), refresh: { ok } } };
}

/**
 * Ask the provider to cancel (scheduled where the provider has it), with
 * the confirmed state stored by the adapter; a throw is a failure.
 * @param {Object} ctx Context.
 * @param {Object} sub Subscription row.
 * @returns {Promise<{ok: boolean}>} Outcome.
 */
async function cancelAtProvider(ctx, sub) {
  const adapter = ctx.providers[sub.provider];
  if (!adapter || typeof adapter.cancel !== "function") {
    return { ok: false };
  }
  try {
    const audits = [{ action: "subscription.cancel", actorAccountId: ctx.account.id, detail: { provider: sub.provider } }];
    return await adapter.cancel(ctx, sub, { mode: "scheduled", source: "user", audits });
  } catch {
    return { ok: false };
  }
}

/**
 * POST /v1/me/subscription/cancel {subscriptionId}.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export async function handleCancelSubscription(ctx) {
  const stop = await limited(ctx, "cancel", CANCELS_PER_HOUR);
  if (stop) {
    return stop;
  }
  const id = ctx.body.subscriptionId;
  if (typeof id !== "string" || !id || id.length > 64) {
    return { status: 400, body: { ok: false, reason: "bad_subscription" } };
  }
  const sub = await ctx.db.prepare("SELECT * FROM subscriptions WHERE id = ?1 AND account_id = ?2").bind(id, ctx.account.id).first();
  if (!sub) {
    return { status: 404, body: { ok: false, reason: "not_found" } };
  }
  const settled = sub.status === "canceled" || (Number(sub.cancel_at_period_end) === 1 && sub.status !== "pending");
  if (!settled) {
    const outcome = await cancelAtProvider(ctx, sub);
    if (!outcome.ok) {
      await writeAudit(ctx, { action: "subscription.cancel_failed", actorAccountId: ctx.account.id, targetAccountId: ctx.account.id, targetId: sub.id, detail: { provider: sub.provider } });
      return { status: 502, body: { ok: false, reason: "cancel_failed" } };
    }
  }
  return { status: 200, body: await buildMePayload(ctx, ctx.account, ctx.session) };
}
