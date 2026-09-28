/**
 * Loading the rows `resolveAccess` needs, in one D1 round trip.
 *
 * access.mjs stays pure; this module is the only place that reads grants,
 * subscriptions and charges for entitlement, so the me payload, the admin
 * account view and the grant routes all see the same answer.
 */

import { grantSchedule, resolveAccess } from "./access.mjs";
import { graceDays } from "./config.mjs";

/**
 * The resolver config for this env.
 * @param {Object} env Worker env.
 * @returns {{graceDays: number}} Config.
 */
export function accessConfig(env) {
  return { graceDays: graceDays(env) };
}

/**
 * Read an account's grants, subscriptions and charges (one batch, one
 * consistent snapshot). Charges are matched by account OR by subscription,
 * so a charge recorded before its account link is still counted.
 * @param {Object} db D1 binding.
 * @param {Object} account Account row.
 * @returns {Promise<{account: Object, grants: Object[], subscriptions: Object[], charges: Object[]}>} Rows.
 */
export async function loadAccessRows(db, account) {
  const [grants, subscriptions, charges] = await db.batch([
    db.prepare("SELECT * FROM grants WHERE account_id = ?1").bind(account.id),
    db.prepare("SELECT * FROM subscriptions WHERE account_id = ?1").bind(account.id),
    db
      .prepare("SELECT * FROM charges WHERE account_id = ?1 OR subscription_id IN (SELECT id FROM subscriptions WHERE account_id = ?1)")
      .bind(account.id)
  ]);
  return { account, grants: grants.results, subscriptions: subscriptions.results, charges: charges.results };
}

/**
 * Rows, access and the per-grant schedule for an account at ctx.now.
 * @param {{db: Object, env: Object, now: number}} ctx Context.
 * @param {Object} account Account row.
 * @returns {Promise<{rows: Object, access: Object, schedule: Object[]}>} Snapshot.
 */
export async function accessSnapshot(ctx, account) {
  const rows = await loadAccessRows(ctx.db, account);
  const cfg = accessConfig(ctx.env);
  const access = resolveAccess(rows, ctx.now, cfg);
  return { rows, access, schedule: grantSchedule(rows, ctx.now, cfg) };
}

/**
 * Client view of a scheduled grant (no admin note, no issuer).
 * @param {Object} entry grantSchedule entry.
 * @returns {Object} Public grant.
 */
export function publicGrant(entry) {
  return { id: entry.id, kind: entry.kind, days: entry.days, start: entry.start, end: entry.end, state: entry.state, createdAt: entry.createdAt };
}
