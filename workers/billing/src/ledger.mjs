/**
 * The billing ledger: every provider fact lands here, in ONE db.batch.
 *
 * A "change" is what a provider re-read (or a signed Creem event) says about
 * one subscription: its status, whether it cancels at period end, and any
 * charges. applyChange reads the current rows, decides, and writes in one
 * batch:
 *   - the subscription row (created on first sight from the checkout binding;
 *     a plain INSERT, so two racing first sights cannot both create one: the
 *     loser's whole batch rolls back and the provider retries);
 *   - each charge, upserted on UNIQUE(provider, provider_charge_id), so a
 *     duplicate notification re-applies the same state (a no-op);
 *   - subscription_events (append-only), only for what actually changed;
 *   - audit lines (double_subscription, flags, deleted account);
 *   - the webhook_events marker, when the change came from a webhook.
 * Nothing is written before the provider was read, and nothing is written
 * unless everything is (no "marker first, delete on error").
 *
 * Rules:
 *   - money is integer minor units; a charge's period is fixed once: Creem
 *     states it; for Mercado Pago it is computed when the charge is first
 *     seen approved: period_start = the previous clean charge's period_end
 *     when this one was approved no later than GRACE after it (so a retried
 *     collection does not drift the cycle), else approved_at; period_end =
 *     period_start + the plan's calendar months (DESIGN-v2 §3, §6);
 *   - an approved charge never goes back to a non-approved status; refunds
 *     and chargebacks set refunded_at / charged_back_at, never clear them,
 *     and are applied whatever the ordering (charge-level, commutative);
 *   - a subscription status older than the stored provider_updated_at is
 *     ignored (out-of-order delivery), and `canceled` is terminal;
 *   - a deleted account is never entitled: its approved charges are flagged
 *     `refund_due` and the caller cancels at the provider.
 *
 * Trade-off (stated): two DIFFERENT charges of one subscription processed
 * concurrently could both chain from the same previous period and overlap,
 * costing the buyer up to one period. Mercado Pago bills a subscription at
 * most once a cycle, so this needs two collections within seconds.
 */

import { auditStatement } from "./audit.mjs";
import { graceDays } from "./config.mjs";
import { randomId } from "./crypto.mjs";
import { addMonths, planMonths } from "./money.mjs";

const RENEWING = new Set(["active", "past_due"]);

/**
 * A subscription by provider reference.
 * @param {Object} db D1.
 * @param {string} provider Provider.
 * @param {string} providerRef Provider id.
 * @returns {Promise<Object|null>} Row.
 */
export function findSubscription(db, provider, providerRef) {
  return db.prepare("SELECT * FROM subscriptions WHERE provider = ?1 AND provider_ref = ?2").bind(provider, providerRef).first();
}

/**
 * A checkout by id.
 * @param {Object} db D1.
 * @param {string} id Checkout id.
 * @returns {Promise<Object|null>} Row.
 */
export function findCheckout(db, id) {
  return db.prepare("SELECT * FROM checkouts WHERE id = ?1").bind(String(id || "")).first();
}

/**
 * The webhook_events marker. `strict` (Creem: envelope ids are unique) makes
 * a concurrent duplicate fail its whole batch; otherwise (Mercado Pago: the
 * re-read is the current state) the marker is refreshed.
 * @param {Object} ctx Context.
 * @param {{provider: string, eventId: string, strict?: boolean}} marker Marker.
 * @returns {Object} Statement.
 */
export function markerStatement(ctx, marker) {
  const conflict = marker.strict ? "" : " ON CONFLICT (provider, event_id) DO UPDATE SET processed_at = excluded.processed_at";
  return ctx.db
    .prepare(`INSERT INTO webhook_events (provider, event_id, received_at, processed_at) VALUES (?1, ?2, ?3, ?3)${conflict}`)
    .bind(marker.provider, marker.eventId, ctx.now);
}

/**
 * An append-only subscription event.
 * @param {Object} ctx Context.
 * @param {{id: string, account_id: string, provider: string}} sub Subscription (row or draft).
 * @param {string} kind Kind.
 * @param {Object} detail Detail (ids, statuses, amounts; never an email).
 * @returns {Object} Statement.
 */
function eventStatement(ctx, sub, kind, detail) {
  return ctx.db
    .prepare("INSERT INTO subscription_events (subscription_id, account_id, provider, kind, detail, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
    .bind(sub.id, sub.account_id, sub.provider, kind, JSON.stringify(detail), ctx.now);
}

/**
 * A new subscription row drafted from a checkout binding.
 * @param {Object} change Change (with `bind`).
 * @param {Object} ctx Context.
 * @returns {Object} Draft row.
 */
function draftSubscription(change, ctx) {
  const bind = change.bind;
  return {
    id: randomId("sub"),
    account_id: bind.accountId,
    provider: change.provider,
    provider_ref: change.providerRef,
    plan: bind.plan,
    amount_minor: bind.amountMinor,
    currency: bind.currency,
    status: "pending",
    cancel_at_period_end: 0,
    provider_updated_at: null,
    checkout_id: bind.checkoutId || null,
    first_active_at: null,
    created_at: ctx.now
  };
}

/**
 * True when the change describes an older provider state than the row.
 * @param {Object|null} row Current row.
 * @param {number|null} updatedAt Change time.
 * @returns {boolean} Stale.
 */
function isStale(row, updatedAt) {
  return Boolean(row) && updatedAt !== null && row.provider_updated_at !== null && updatedAt < Number(row.provider_updated_at);
}

/**
 * The subscription as it will be after the change (no statement yet).
 * @param {Object|null} row Current row.
 * @param {Object} change Change.
 * @param {Object} ctx Context.
 * @returns {{next: Object, created: boolean, stale: boolean}|null} Plan, or null when unbound.
 */
function planSubscription(row, change, ctx) {
  if (!row && !change.bind) {
    return null;
  }
  const base = row || draftSubscription(change, ctx);
  const updatedAt = Number.isFinite(change.updatedAt) ? change.updatedAt : null;
  const stale = isStale(row, updatedAt);
  const terminal = base.status === "canceled";
  const applies = !stale && !terminal;
  const status = applies && change.status ? change.status : base.status;
  const cancel = !stale && typeof change.cancelAtPeriodEnd === "boolean" ? Number(change.cancelAtPeriodEnd) : Number(base.cancel_at_period_end);
  const providerUpdatedAt = stale || updatedAt === null ? base.provider_updated_at : updatedAt;
  return { next: { ...base, status, cancel_at_period_end: terminal ? 1 : cancel, provider_updated_at: providerUpdatedAt }, created: !row, stale };
}

/**
 * Statements for the subscription row and its status events.
 * @param {Object} ctx Context.
 * @param {Object|null} row Current row.
 * @param {{next: Object, created: boolean}} plan Plan.
 * @param {string} source What triggered the change.
 * @returns {Object[]} Statements.
 */
function subscriptionStatements(ctx, row, plan, source) {
  const s = plan.next;
  if (plan.created) {
    return [
      ctx.db
        .prepare(
          `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, cancel_at_period_end,
             provider_updated_at, created_at, updated_at, checkout_id) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?11, ?12)`
        )
        .bind(s.id, s.account_id, s.provider, s.provider_ref, s.plan, s.amount_minor, s.currency, s.status, s.cancel_at_period_end, s.provider_updated_at, ctx.now, s.checkout_id),
      eventStatement(ctx, s, "status", { from: null, to: s.status, source })
    ];
  }
  const out = [];
  const statusChanged = row.status !== s.status;
  const cancelChanged = Number(row.cancel_at_period_end) !== s.cancel_at_period_end;
  if (statusChanged || cancelChanged || row.provider_updated_at !== s.provider_updated_at) {
    out.push(
      ctx.db
        .prepare("UPDATE subscriptions SET status = ?2, cancel_at_period_end = ?3, provider_updated_at = ?4, updated_at = ?5 WHERE id = ?1")
        .bind(s.id, s.status, s.cancel_at_period_end, s.provider_updated_at, ctx.now)
    );
  }
  if (statusChanged) {
    out.push(eventStatement(ctx, s, "status", { from: row.status, to: s.status, source }));
  }
  if (cancelChanged) {
    out.push(eventStatement(ctx, s, "cancel_at_period_end", { value: s.cancel_at_period_end === 1, source }));
  }
  return out;
}

/**
 * The end of the latest clean charge of a subscription, other than one id.
 * @param {Object} db D1.
 * @param {string} subscriptionId Subscription id.
 * @param {string} provider Provider.
 * @param {string} excludeChargeId Provider charge id to skip.
 * @returns {Promise<number|null>} Period end.
 */
async function previousPeriodEnd(db, subscriptionId, provider, excludeChargeId) {
  const value = await db
    .prepare(
      `SELECT MAX(period_end) AS e FROM charges WHERE subscription_id = ?1 AND provider = ?2 AND provider_charge_id <> ?3
         AND status = 'approved' AND refunded_at IS NULL AND charged_back_at IS NULL`
    )
    .bind(subscriptionId, provider, excludeChargeId)
    .first("e");
  return value === null || value === undefined ? null : Number(value);
}

/**
 * The period a newly approved charge covers (see the module comment).
 * @param {Object} ctx Context.
 * @param {Object} sub Planned subscription.
 * @param {Object} fact Charge fact.
 * @returns {Promise<{periodStart: number, periodEnd: number}|null>} Period.
 */
async function chainPeriod(ctx, sub, fact) {
  if (fact.periodFromProvider) {
    return { periodStart: fact.periodStart, periodEnd: fact.periodEnd };
  }
  const months = planMonths(sub.plan);
  const approvedAt = Number.isFinite(fact.approvedAt) ? fact.approvedAt : ctx.now;
  if (!months) {
    return null;
  }
  const prev = await previousPeriodEnd(ctx.db, sub.id, sub.provider, fact.chargeId);
  const grace = graceDays(ctx.env) * 86400;
  const start = prev !== null && approvedAt <= prev + grace ? prev : approvedAt;
  return { periodStart: start, periodEnd: addMonths(start, months) };
}

/**
 * The charge row as it will be after the fact is applied.
 * @param {Object} ctx Context.
 * @param {Object} sub Planned subscription.
 * @param {Object|null} row Current charge row.
 * @param {Object} fact Charge fact.
 * @param {boolean} deleted Account deleted.
 * @returns {Promise<Object>} Next charge values.
 */
async function planCharge(ctx, sub, row, fact, deleted) {
  const prior = row || {};
  const status = prior.status === "approved" ? "approved" : fact.status;
  const approved = status === "approved";
  const approvedAt = prior.approved_at || (approved ? fact.approvedAt || ctx.now : null);
  const period = await periodFor(ctx, sub, row, { ...fact, approvedAt }, approved);
  return {
    id: prior.id || randomId("chg"),
    status,
    approvedAt,
    ...period,
    ...keptReversals(prior, fact),
    flag: deleted && approved ? "refund_due" : fact.flag || prior.flag || null
  };
}

/**
 * The period a charge keeps or gets: the stored one, unless the charge is
 * approved and has none yet, or the provider states its own.
 * @param {Object} ctx Context.
 * @param {Object} sub Planned subscription.
 * @param {Object|null} row Current charge row.
 * @param {Object} fact Fact (approvedAt resolved).
 * @param {boolean} approved Approved after this change.
 * @returns {Promise<{periodStart: number|null, periodEnd: number|null}>} Period.
 */
async function periodFor(ctx, sub, row, fact, approved) {
  const stored = row && row.period_start !== null ? { periodStart: row.period_start, periodEnd: row.period_end } : null;
  const computed = approved && (!stored || fact.periodFromProvider) ? await chainPeriod(ctx, sub, fact) : null;
  return computed || stored || { periodStart: null, periodEnd: null };
}

/**
 * Refund and chargeback times: once set, never cleared or moved.
 * @param {Object} prior Current row or {}.
 * @param {Object} fact Fact.
 * @returns {{refundedAt: number|null, chargedBackAt: number|null}} Times.
 */
function keptReversals(prior, fact) {
  return { refundedAt: prior.refunded_at || fact.refundedAt || null, chargedBackAt: prior.charged_back_at || fact.chargedBackAt || null };
}

/**
 * Events for what a charge change changed.
 * @param {Object} ctx Context.
 * @param {Object} sub Subscription.
 * @param {Object|null} row Current row.
 * @param {Object} next Planned charge.
 * @param {Object} fact Fact.
 * @returns {{statements: Object[], reversed: boolean, flagged: string|null}} Events.
 */
function chargeEvents(ctx, sub, row, next, fact) {
  const statements = [];
  const base = { chargeId: fact.chargeId, amountMinor: fact.amountMinor, currency: fact.currency };
  if (!row || row.status !== next.status) {
    statements.push(eventStatement(ctx, sub, `charge.${next.status}`, base));
  }
  const refunded = !(row && row.refunded_at) && next.refundedAt !== null;
  const chargedBack = !(row && row.charged_back_at) && next.chargedBackAt !== null;
  if (refunded) {
    statements.push(eventStatement(ctx, sub, "charge.refunded", base));
  }
  if (chargedBack) {
    statements.push(eventStatement(ctx, sub, "charge.charged_back", base));
  }
  const flagged = next.flag && next.flag !== (row && row.flag) ? next.flag : null;
  if (flagged) {
    statements.push(eventStatement(ctx, sub, "charge.flag", { ...base, flag: flagged }));
  }
  return { statements, reversed: refunded || chargedBack, flagged };
}

/**
 * The charge upsert.
 * @param {Object} ctx Context.
 * @param {Object} sub Subscription.
 * @param {Object} fact Fact.
 * @param {Object} next Planned charge.
 * @returns {Object} Statement.
 */
function chargeUpsert(ctx, sub, fact, next) {
  return ctx.db
    .prepare(
      `INSERT INTO charges (id, provider, provider_charge_id, subscription_id, account_id, amount_minor, currency, status, approved_at,
         period_start, period_end, refunded_at, charged_back_at, flag, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?15)
       ON CONFLICT (provider, provider_charge_id) DO UPDATE SET
         status = excluded.status, approved_at = excluded.approved_at, period_start = excluded.period_start,
         period_end = excluded.period_end, refunded_at = excluded.refunded_at, charged_back_at = excluded.charged_back_at,
         flag = excluded.flag, updated_at = excluded.updated_at`
    )
    .bind(
      next.id,
      sub.provider,
      fact.chargeId,
      sub.id,
      sub.account_id,
      fact.amountMinor,
      fact.currency,
      next.status,
      next.approvedAt,
      next.periodStart,
      next.periodEnd,
      next.refundedAt,
      next.chargedBackAt,
      next.flag,
      ctx.now
    );
}

/**
 * Plan every charge of a change.
 * @param {Object} ctx Context.
 * @param {Object} sub Planned subscription.
 * @param {Object[]} facts Charge facts.
 * @param {boolean} deleted Account deleted.
 * @returns {Promise<{statements: Object[], approvedAt: number|null, reversed: boolean, flags: Object[]}>} Plan.
 */
async function chargeStatements(ctx, sub, facts, deleted) {
  const out = { statements: [], approvedAt: null, reversed: false, flags: [] };
  for (const fact of facts) {
    const row = await ctx.db.prepare("SELECT * FROM charges WHERE provider = ?1 AND provider_charge_id = ?2").bind(sub.provider, fact.chargeId).first();
    if (row && row.subscription_id !== sub.id) {
      out.flags.push({ chargeId: fact.chargeId, flag: "other_subscription" });
      continue;
    }
    const next = await planCharge(ctx, sub, row, fact, deleted);
    const events = chargeEvents(ctx, sub, row, next, fact);
    out.statements.push(chargeUpsert(ctx, sub, fact, next), ...events.statements);
    out.reversed = out.reversed || events.reversed;
    if (events.flagged) {
      out.flags.push({ chargeId: fact.chargeId, flag: events.flagged });
    }
    if (next.status === "approved" && next.refundedAt === null && next.chargedBackAt === null) {
      out.approvedAt = out.approvedAt === null ? next.approvedAt : Math.min(out.approvedAt, next.approvedAt);
    }
  }
  return out;
}

/**
 * The double-subscription audit: this subscription became renewing while the
 * account already has another renewing one (flagged, never auto-cancelled).
 * @param {Object} ctx Context.
 * @param {Object|null} row Current row.
 * @param {Object} next Planned subscription.
 * @returns {Promise<Object[]>} Statements.
 */
async function doubleSubscriptionAudit(ctx, row, next) {
  const becameRenewing = RENEWING.has(next.status) && !(row && RENEWING.has(row.status));
  if (!becameRenewing) {
    return [];
  }
  const others = await ctx.db
    .prepare("SELECT id FROM subscriptions WHERE account_id = ?1 AND id <> ?2 AND status IN ('active', 'past_due')")
    .bind(next.account_id, next.id)
    .all();
  if (!others.results.length) {
    return [];
  }
  const detail = { subscriptionId: next.id, provider: next.provider, others: others.results.map((r) => r.id) };
  return [auditStatement(ctx, { action: "double_subscription", targetAccountId: next.account_id, targetId: next.id, detail })];
}

/**
 * Audit lines a change asks for, plus flag audits.
 * @param {Object} ctx Context.
 * @param {Object} sub Subscription.
 * @param {Object} change Change.
 * @param {Object[]} flags Newly flagged charges.
 * @returns {Object[]} Statements.
 */
function auditStatements(ctx, sub, change, flags) {
  const own = (change.audits || []).map((a) =>
    auditStatement(ctx, { action: a.action, actorAccountId: a.actorAccountId || null, targetAccountId: sub.account_id, targetId: sub.id, detail: a.detail })
  );
  const flagged = flags.map((f) =>
    auditStatement(ctx, { action: `charge.${f.flag}`, targetAccountId: sub.account_id, targetId: sub.id, detail: { provider: sub.provider, chargeId: f.chargeId } })
  );
  return own.concat(flagged);
}

/**
 * Apply one provider change in one batch.
 * @param {Object} ctx Context (db, env, now).
 * @param {{provider: string, providerRef: string, bind?: Object|null, status?: string|null, cancelAtPeriodEnd?: boolean,
 *          updatedAt?: number|null, charges?: Object[], marker?: Object|null, audits?: Object[], extra?: Object[],
 *          source: string}} change Change.
 * @returns {Promise<{ok: true, subscription: Object, accountDeleted: boolean, reversed: boolean}|{ok: false, reason: string}>} Outcome.
 */
export async function applyChange(ctx, change) {
  const row = await findSubscription(ctx.db, change.provider, change.providerRef);
  const plan = planSubscription(row, change, ctx);
  if (!plan) {
    return { ok: false, reason: "unbound" };
  }
  const sub = plan.next;
  const account = await ctx.db.prepare("SELECT deleted_at FROM accounts WHERE id = ?1").bind(sub.account_id).first();
  const deleted = !account || account.deleted_at !== null;
  const charges = await chargeStatements(ctx, sub, change.charges || [], deleted);
  const statements = subscriptionStatements(ctx, row, plan, change.source);
  if (charges.approvedAt !== null && !sub.first_active_at) {
    statements.push(ctx.db.prepare("UPDATE subscriptions SET first_active_at = COALESCE(first_active_at, ?2) WHERE id = ?1").bind(sub.id, charges.approvedAt));
  }
  statements.push(...charges.statements, ...(await doubleSubscriptionAudit(ctx, row, sub)), ...auditStatements(ctx, sub, change, charges.flags));
  statements.push(...(change.extra || []));
  if (change.marker) {
    statements.push(markerStatement(ctx, change.marker));
  }
  await ctx.db.batch(statements);
  return { ok: true, subscription: sub, accountDeleted: deleted, reversed: charges.reversed };
}

/**
 * Record a webhook that changes nothing (ignored, or unmatched with an audit
 * line), marker included, in one batch.
 * @param {Object} ctx Context.
 * @param {Object|null} marker Marker.
 * @param {{action: string, detail: Object}|null} audit Audit line (never an email).
 * @returns {Promise<void>} Resolves when stored.
 */
export async function recordNoop(ctx, marker, audit) {
  const statements = [];
  if (audit) {
    statements.push(auditStatement(ctx, { action: audit.action, detail: audit.detail }));
  }
  if (marker) {
    statements.push(markerStatement(ctx, marker));
  }
  if (statements.length) {
    await ctx.db.batch(statements);
  }
}

/**
 * True when a subscription has a reversed (refunded or charged back) charge.
 * @param {Object} db D1.
 * @param {string} subscriptionId Subscription id.
 * @returns {Promise<boolean>} Reversed.
 */
export async function hasReversedCharge(db, subscriptionId) {
  const hit = await db
    .prepare("SELECT 1 AS hit FROM charges WHERE subscription_id = ?1 AND (refunded_at IS NOT NULL OR charged_back_at IS NOT NULL) LIMIT 1")
    .bind(subscriptionId)
    .first();
  return Boolean(hit);
}
