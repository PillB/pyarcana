/**
 * Provider reconciliation (DESIGN-v2 §4 "Scheduled"): re-read the provider
 * for rows a lost or delayed webhook could have left behind, and apply what
 * it says through the same adapters as refresh (providers.mjs).
 *
 *   recent (hourly): open checkouts younger than 7 days, and pending
 *                    subscriptions younger than 7 days;
 *   all (daily):     the same checkouts, and every pending, active or
 *                    past_due subscription (so a cancel made in the
 *                    provider's own portal reaches the ledger).
 *
 * Each set is capped at `limit` rows per run (default RECONCILE_LIMIT; a
 * Mercado Pago row costs two or three subrequests), least recently
 * reconciled first; every attempt stamps reconciled_at, success or not, so
 * one broken row cannot starve the others. A Mercado Pago checkout whose
 * preapproval is also in the subscription set is read once.
 * Logs carry counts and provider names only.
 */

import { syncRow } from "./subscription.mjs";

/** Rows per set per run. */
export const RECONCILE_LIMIT = 50;

const WEEK = 7 * 86400;

/**
 * The rows a run reconciles.
 * @param {Object} ctx Context.
 * @param {"recent"|"all"} scope Scope.
 * @param {number} limit Cap per set.
 * @returns {Promise<{checkouts: Object[], subscriptions: Object[]}>} Rows.
 */
async function selectRows(ctx, scope, limit) {
  const subWhere = scope === "all" ? "status IN ('pending', 'active', 'past_due') AND ?1 = ?1" : "status = 'pending' AND created_at > ?1";
  const [checkouts, subscriptions] = await ctx.db.batch([
    ctx.db
      .prepare(
        `SELECT * FROM checkouts WHERE status = 'open' AND provider_ref IS NOT NULL AND created_at > ?1
           ORDER BY COALESCE(reconciled_at, 0), created_at, id LIMIT ?2`
      )
      .bind(ctx.now - WEEK, limit),
    ctx.db.prepare(`SELECT * FROM subscriptions WHERE ${subWhere} ORDER BY COALESCE(reconciled_at, 0), created_at, id LIMIT ?2`).bind(ctx.now - WEEK, limit)
  ]);
  return { checkouts: checkouts.results, subscriptions: subscriptions.results };
}

/**
 * Stamp a row as reconciled now.
 * @param {Object} ctx Context.
 * @param {"checkouts"|"subscriptions"} table Table.
 * @param {string} id Row id.
 * @returns {Promise<void>} Resolves when stamped.
 */
async function stamp(ctx, table, id) {
  await ctx.db.prepare(`UPDATE ${table} SET reconciled_at = ?2 WHERE id = ?1`).bind(id, ctx.now).run();
}

/**
 * Reconcile one row: re-read and apply (or skip when covered), then stamp.
 * @param {Object} ctx Context.
 * @param {{table: string, method: string, row: Object, covered: boolean}} item Work item.
 * @returns {Promise<boolean>} Succeeded.
 */
async function reconcileRow(ctx, item) {
  const ok = item.covered || (await syncRow(ctx, item.method, item.row, "reconcile"));
  if (!ok) {
    ctx.log(`reconcile ${item.row.provider} ${item.table} failed`);
  }
  await stamp(ctx, item.table, item.row.id);
  return ok;
}

/**
 * Run a reconciliation pass.
 * @param {{db: Object, env: Object, now: number, log: function, providers: Object, fetchImpl?: function}} ctx Context.
 * @param {{scope: "recent"|"all", limit?: number}} opts Scope and cap.
 * @returns {Promise<{checkouts: number, subscriptions: number, failed: number}>} Counts.
 */
export async function reconcile(ctx, opts) {
  const limit = Number.isSafeInteger(opts.limit) && opts.limit > 0 ? opts.limit : RECONCILE_LIMIT;
  const rows = await selectRows(ctx, opts.scope, limit);
  const refs = new Set(rows.subscriptions.map((s) => `${s.provider}:${s.provider_ref}`));
  const items = rows.checkouts
    .map((row) => ({ table: "checkouts", method: "syncCheckout", row, covered: row.provider === "mercadopago" && refs.has(`mercadopago:${row.provider_ref}`) }))
    .concat(rows.subscriptions.map((row) => ({ table: "subscriptions", method: "sync", row, covered: false })));
  let failed = 0;
  for (const item of items) {
    failed += (await reconcileRow(ctx, item)) ? 0 : 1;
  }
  const counts = { checkouts: rows.checkouts.length, subscriptions: rows.subscriptions.length, failed };
  ctx.log(`reconcile ${opts.scope} ${JSON.stringify(counts)}`);
  return counts;
}
