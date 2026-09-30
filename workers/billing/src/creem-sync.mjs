/**
 * Creem: apply signed webhook events and re-reads to the ledger, plus the
 * registry adapter (DESIGN-v2 §4 mapping table).
 *
 *   checkout.completed        subscription row (sub id -> account stored
 *                             here) + the first charge when the order names
 *                             its transaction; checkout -> completed
 *   subscription.active       active
 *   subscription.paid         charge approved, period = Creem's
 *                             current_period_start/end
 *   subscription.past_due     past_due
 *   subscription.scheduled_cancel  cancel_at_period_end
 *   subscription.canceled / .expired   canceled
 *   subscription.trialing     ignored (we never create Creem trials)
 *   refund.created            charge refunded_at (a partial refund: no
 *                             change, audit line) + cancel the subscription
 *   dispute.created           charge charged_back_at + cancel
 *   anything else             ignored (marker only)
 *
 * Binding: checkout.completed must name one of OUR creem checkouts
 * (request_id = chk id) for the same account in metadata, with the
 * configured product for its plan and the same net price and currency.
 * Later events find the subscription by its Creem id; if it is not stored
 * yet (events out of order), the subscription's metadata (Creem copies the
 * checkout metadata onto it) is checked against the checkout the same way.
 * Ordering: a subscription status is applied only if its object.updated_at
 * is not older than the stored one; charges are exempt.
 */

import { writeAudit } from "./audit.mjs";
import {
  cancelCreemSubscription,
  chargeFromCheckout,
  chargeFromSubscription,
  createCreemCheckout,
  creemConfig,
  creemProductFor,
  creemProductId,
  creemStatus,
  creemTerms,
  getCreemCheckout,
  getCreemSubscription
} from "./creem.mjs";
import { applyChange, findCheckout, findSubscription, hasReversedCharge, recordNoop } from "./ledger.mjs";
import { integerMinor, priceFor } from "./money.mjs";
import { epochSeconds, isoSeconds, refId } from "./provider-http.mjs";

const PROVIDER = "creem";
const UNAVAILABLE = { ok: false, reason: "provider_unavailable" };

/** Event type -> subscription change. */
const EVENT_STATUS = Object.freeze({
  "subscription.active": { status: "active", cancelAtPeriodEnd: false },
  "subscription.paid": { status: "active", cancelAtPeriodEnd: false },
  "subscription.past_due": { status: "past_due" },
  "subscription.scheduled_cancel": { cancelAtPeriodEnd: true },
  "subscription.canceled": { status: "canceled", cancelAtPeriodEnd: true },
  "subscription.expired": { status: "canceled", cancelAtPeriodEnd: true }
});

/**
 * Ignore with an audit line (and the marker).
 * @param {Object} ctx Context.
 * @param {string} kind Event kind.
 * @param {string} reason Why.
 * @param {Object|null} marker Marker.
 * @returns {Promise<{ok: true, ignored: string}>} Outcome.
 */
async function unmatched(ctx, kind, reason, marker) {
  await recordNoop(ctx, marker, { action: "webhook.unmatched", detail: { provider: PROVIDER, kind, reason } });
  return { ok: true, ignored: reason };
}

/**
 * Why a Creem object does not fit one of our checkouts, or null.
 * @param {Object} ctx Context.
 * @param {Object|null} checkout Checkout row.
 * @param {Object} object Creem object (checkout or subscription).
 * @param {Object} metadata Metadata carried by the object.
 * @returns {string|null} Reason.
 */
function checkoutMismatch(ctx, checkout, object, metadata) {
  if (!checkout || checkout.provider !== PROVIDER) {
    return "unknown_checkout";
  }
  if (metadata.account_id !== checkout.account_id || metadata.checkout_id !== checkout.id) {
    return "account_mismatch";
  }
  if (creemProductId(object) !== creemProductFor(ctx.env, checkout.plan)) {
    return "product_mismatch";
  }
  const terms = creemTerms(object);
  if (terms.amountMinor !== Number(checkout.amount_minor) || terms.currency !== checkout.currency) {
    return "amount_mismatch";
  }
  return null;
}

/**
 * The ledger binding for a checkout row.
 * @param {Object} checkout Checkout row.
 * @returns {Object} Bind.
 */
function bindOf(checkout) {
  return { accountId: checkout.account_id, checkoutId: checkout.id, plan: checkout.plan, amountMinor: Number(checkout.amount_minor), currency: checkout.currency };
}

/**
 * Metadata of an object as a plain object.
 * @param {Object} object Object.
 * @returns {Object} Metadata.
 */
function metadataOf(object) {
  return object && object.metadata && typeof object.metadata === "object" ? object.metadata : {};
}

/**
 * Cancel at Creem, re-read, and store what the re-read confirms.
 * @param {Object} ctx Context.
 * @param {Object} sub Subscription row.
 * @param {{mode: "scheduled"|"immediate", source: string, audits?: Object[]}} opts Options.
 * @returns {Promise<{ok: true, status: string}|{ok: false, reason: string}>} Outcome.
 */
export async function cancelCreemAndConfirm(ctx, sub, opts) {
  if (!creemConfig(ctx.env)) {
    return { ok: false, reason: "provider_not_configured" };
  }
  await cancelCreemSubscription(ctx, sub.provider_ref, opts.mode);
  const read = await getCreemSubscription(ctx, sub.provider_ref);
  const mapped = read.ok ? creemStatus(read.body.status) : null;
  const confirmed = mapped && (mapped.status === "canceled" || (opts.mode === "scheduled" && mapped.cancelAtPeriodEnd));
  if (!confirmed) {
    return { ok: false, reason: "cancel_failed" };
  }
  await applyChange(ctx, {
    provider: PROVIDER,
    providerRef: sub.provider_ref,
    status: mapped.status,
    cancelAtPeriodEnd: true,
    updatedAt: isoSeconds(read.body.updated_at),
    audits: opts.audits,
    source: opts.source
  });
  return { ok: true, status: mapped.status };
}

/**
 * After a change: a reversed charge or a deleted account cancels the
 * subscription now (immediate), unless it is already cancelled.
 * @param {Object} ctx Context.
 * @param {{subscription: Object, accountDeleted: boolean}} applied applyChange outcome.
 * @returns {Promise<{ok: boolean, reason?: string}>} Outcome.
 */
async function enforcePolicy(ctx, applied) {
  const sub = await findSubscription(ctx.db, PROVIDER, applied.subscription.provider_ref);
  if (!sub || sub.status === "canceled") {
    return { ok: true };
  }
  if (!applied.accountDeleted && !(await hasReversedCharge(ctx.db, sub.id))) {
    return { ok: true };
  }
  const action = applied.accountDeleted ? "webhook.deleted_account" : "subscription.cancel_on_reversal";
  const audits = [{ action, detail: { provider: PROVIDER, refundDue: applied.accountDeleted } }];
  const outcome = await cancelCreemAndConfirm(ctx, sub, { mode: "immediate", source: "policy", audits });
  if (!outcome.ok) {
    await writeAudit(ctx, { action: "subscription.policy_cancel_failed", targetAccountId: sub.account_id, targetId: sub.id, detail: { provider: PROVIDER } });
  }
  return outcome.ok ? { ok: true } : { ok: false, reason: "cancel_failed" };
}

/**
 * The status a checkout's embedded subscription states (active when it is
 * only an id: a completed checkout's subscription is live).
 * @param {unknown} subscription Id string or object.
 * @returns {{status: string, cancelAtPeriodEnd: boolean, updatedAt: number|null}} Change fields.
 */
function embeddedStatus(subscription) {
  const expanded = subscription && typeof subscription === "object" ? subscription : null;
  const mapped = expanded ? creemStatus(expanded.status) : null;
  return {
    status: mapped ? mapped.status : "active",
    cancelAtPeriodEnd: mapped ? mapped.cancelAtPeriodEnd : false,
    updatedAt: expanded ? isoSeconds(expanded.updated_at) : null
  };
}

/**
 * checkout.completed (also a completed checkout found by a re-read).
 * @param {Object} ctx Context.
 * @param {Object} object Checkout object.
 * @param {{marker?: Object|null, source: string, at: number}} opts Options.
 * @returns {Promise<Object>} Outcome.
 */
export async function applyCheckoutCompleted(ctx, object, opts) {
  const checkout = await findCheckout(ctx.db, object.request_id);
  const reason = checkoutMismatch(ctx, checkout, object, metadataOf(object)) || (checkout.provider_ref && checkout.provider_ref !== object.id ? "checkout_mismatch" : null);
  const subId = refId(object.subscription);
  if (reason || !subId) {
    return unmatched(ctx, "checkout.completed", reason || "no_subscription", opts.marker || null);
  }
  const charge = chargeFromCheckout(object, opts.at);
  const applied = await applyChange(ctx, {
    provider: PROVIDER,
    providerRef: subId,
    bind: bindOf(checkout),
    ...embeddedStatus(object.subscription),
    charges: charge ? [charge] : [],
    marker: opts.marker || null,
    extra: [ctx.db.prepare("UPDATE checkouts SET status = 'completed', provider_ref = COALESCE(provider_ref, ?2) WHERE id = ?1").bind(checkout.id, object.id)],
    source: opts.source
  });
  return enforcePolicy(ctx, applied);
}

/**
 * The binding for a subscription object not stored yet, or a reason.
 * @param {Object} ctx Context.
 * @param {Object} object Subscription object.
 * @param {string|null} subId Its Creem id.
 * @returns {Promise<{bind: Object}|{reason: string}>} Binding.
 */
async function bindSubscriptionObject(ctx, object, subId) {
  if (!subId) {
    return { reason: "no_subscription" };
  }
  const metadata = metadataOf(object);
  const checkout = metadata.checkout_id ? await findCheckout(ctx.db, metadata.checkout_id) : null;
  const reason = checkoutMismatch(ctx, checkout, object, metadata);
  return reason ? { reason: metadata.checkout_id ? reason : "unknown_subscription" } : { bind: bindOf(checkout) };
}

/**
 * Apply a subscription object with a given change (event or re-read).
 * @param {Object} ctx Context.
 * @param {Object} object Subscription object.
 * @param {{status?: string, cancelAtPeriodEnd?: boolean}} change Status change.
 * @param {{kind: string, paid: boolean, marker?: Object|null, source: string, at: number}} opts Options.
 * @returns {Promise<Object>} Outcome.
 */
async function applySubscriptionObject(ctx, object, change, opts) {
  const subId = refId(object);
  const row = subId ? await findSubscription(ctx.db, PROVIDER, subId) : null;
  const binding = row ? { bind: null } : await bindSubscriptionObject(ctx, object, subId);
  if (binding.reason) {
    return unmatched(ctx, opts.kind, binding.reason, opts.marker || null);
  }
  const charge = opts.paid ? chargeFromSubscription(object, opts.at) : null;
  const expected = row ? { amountMinor: Number(row.amount_minor), currency: row.currency } : binding.bind;
  if (charge && (charge.amountMinor !== expected.amountMinor || charge.currency !== expected.currency)) {
    return unmatched(ctx, opts.kind, "amount_mismatch", opts.marker || null);
  }
  const applied = await applyChange(ctx, {
    provider: PROVIDER,
    providerRef: subId,
    bind: binding.bind,
    ...change,
    updatedAt: isoSeconds(object.updated_at),
    charges: charge ? [charge] : [],
    marker: opts.marker || null,
    source: opts.source
  });
  return enforcePolicy(ctx, applied);
}

/**
 * The charge row and subscription a refund or dispute points at.
 * @param {Object} ctx Context.
 * @param {Object} object Refund or dispute.
 * @param {Object|null} transaction Its transaction.
 * @returns {Promise<{chargeId: string|null, existing: Object|null, sub: Object|null}>} Targets.
 */
async function reversalTargets(ctx, object, transaction) {
  const chargeId = refId(transaction);
  const existing = chargeId ? await ctx.db.prepare("SELECT * FROM charges WHERE provider = ?1 AND provider_charge_id = ?2").bind(PROVIDER, chargeId).first() : null;
  if (existing) {
    return { chargeId, existing, sub: await ctx.db.prepare("SELECT * FROM subscriptions WHERE id = ?1").bind(existing.subscription_id).first() };
  }
  const subId = refId(object.subscription) || (transaction ? refId(transaction.subscription) : null);
  return { chargeId, existing: null, sub: subId ? await findSubscription(ctx.db, PROVIDER, subId) : null };
}

/**
 * The reversal fields: a refund smaller than what was paid is partial (a
 * flag, no change); a full refund sets refunded_at; a dispute
 * charged_back_at.
 * @param {Object} object Refund or dispute.
 * @param {Object} transaction Transaction.
 * @param {boolean} refund Refund (else dispute).
 * @param {number} at When.
 * @returns {Object} Fields.
 */
function reversalFields(object, transaction, refund, at) {
  const paid = integerMinor(transaction.amount_paid);
  const refunded = integerMinor(object.refund_amount);
  if (refund && paid !== null && refunded !== null && refunded < paid) {
    return { flag: "partial_refund" };
  }
  return refund ? { refundedAt: at } : { chargedBackAt: at };
}

/**
 * Why a reversal cannot be applied, or null.
 * @param {string|null} chargeId Transaction id.
 * @param {Object|null} sub Subscription row.
 * @param {number|null} amountMinor Charge amount.
 * @returns {string|null} Reason.
 */
function reversalGap(chargeId, sub, amountMinor) {
  if (!chargeId) {
    return "no_transaction";
  }
  if (!sub) {
    return "unknown_subscription";
  }
  return amountMinor === null ? "no_amount" : null;
}

/**
 * refund.created / dispute.created: mark the charge (by transaction id),
 * then the policy cancels the subscription.
 * @param {Object} ctx Context.
 * @param {Object} object Refund or dispute.
 * @param {{kind: string, marker?: Object|null, source: string, at: number}} opts Options.
 * @returns {Promise<Object>} Outcome.
 */
async function applyReversal(ctx, object, opts) {
  const transaction = object.transaction && typeof object.transaction === "object" ? object.transaction : null;
  const { chargeId, existing, sub } = await reversalTargets(ctx, object, transaction);
  const amountMinor = existing ? Number(existing.amount_minor) : transaction && integerMinor(transaction.amount);
  const reason = reversalGap(chargeId, sub, amountMinor);
  if (reason) {
    return unmatched(ctx, opts.kind, reason, opts.marker || null);
  }
  const at = epochSeconds(object.created_at) || opts.at;
  const currency = existing ? existing.currency : String(transaction.currency || "").toUpperCase();
  const fact = { chargeId, amountMinor, currency, status: "approved", approvedAt: epochSeconds(transaction.created_at) || at };
  const reversal = reversalFields(object, transaction, opts.kind === "refund.created", at);
  const applied = await applyChange(ctx, { provider: PROVIDER, providerRef: sub.provider_ref, charges: [{ ...fact, ...reversal }], marker: opts.marker || null, source: opts.source });
  return enforcePolicy(ctx, applied);
}

/**
 * Apply one verified Creem event.
 * @param {Object} ctx Context.
 * @param {{id: string, eventType: string, created_at: number, object: Object}} event Envelope.
 * @param {Object} marker Marker.
 * @returns {Promise<Object>} Outcome.
 */
export function applyCreemEvent(ctx, event, marker) {
  const opts = { kind: event.eventType, marker, source: "webhook", at: epochSeconds(event.created_at) || ctx.now };
  if (event.eventType === "checkout.completed") {
    return applyCheckoutCompleted(ctx, event.object, opts);
  }
  if (Object.prototype.hasOwnProperty.call(EVENT_STATUS, event.eventType)) {
    return applySubscriptionObject(ctx, event.object, EVENT_STATUS[event.eventType], { ...opts, paid: event.eventType === "subscription.paid" });
  }
  if (event.eventType === "refund.created" || event.eventType === "dispute.created") {
    return applyReversal(ctx, event.object, opts);
  }
  return recordNoop(ctx, marker, null).then(() => ({ ok: true, ignored: "event_type" }));
}

/**
 * Re-read a Creem subscription and apply its status and paid transaction.
 * @param {Object} ctx Context.
 * @param {string} subId Creem subscription id.
 * @param {string} source Source.
 * @returns {Promise<{ok: boolean}>} Outcome.
 */
async function syncSubscription(ctx, subId, source) {
  const read = await getCreemSubscription(ctx, subId);
  if (!read.ok) {
    return UNAVAILABLE;
  }
  const mapped = creemStatus(read.body.status) || {};
  const last = read.body.last_transaction;
  const paid = Boolean(last && typeof last === "object" && last.status === "paid");
  return applySubscriptionObject(ctx, read.body, mapped, { kind: "subscription.read", paid, source, at: ctx.now });
}

/**
 * Re-read a Creem checkout; a completed one is applied like the webhook.
 * @param {Object} ctx Context.
 * @param {Object} checkout Checkout row.
 * @param {string} source Source.
 * @returns {Promise<{ok: boolean}>} Outcome.
 */
async function syncCheckout(ctx, checkout, source) {
  if (!checkout.provider_ref) {
    return { ok: true };
  }
  const read = await getCreemCheckout(ctx, checkout.provider_ref);
  if (!read.ok) {
    return UNAVAILABLE;
  }
  if (read.body.status !== "completed" || read.body.request_id !== checkout.id) {
    return { ok: true };
  }
  const done = await applyCheckoutCompleted(ctx, read.body, { marker: null, source, at: ctx.now });
  const subId = refId(read.body.subscription);
  return done.ok && subId && !done.ignored ? syncSubscription(ctx, subId, source) : done;
}

/** The Creem adapter (see providers.mjs). */
export const creemAdapter = Object.freeze({
  pendingSubscription: false,
  configured(env, plan) {
    return Boolean(creemConfig(env)) && Boolean(creemProductFor(env, plan)) && priceFor(env, PROVIDER, plan) !== null;
  },
  startCheckout(ctx, args) {
    return createCreemCheckout(ctx, { ...args, customerEmail: args.customerEmail, successUrl: args.backUrl });
  },
  cancel(ctx, sub, opts = {}) {
    return cancelCreemAndConfirm(ctx, sub, { mode: opts.mode || "immediate", source: opts.source || "account_deletion", audits: opts.audits });
  },
  sync(ctx, sub, opts = {}) {
    return syncSubscription(ctx, sub.provider_ref, opts.source || "refresh");
  },
  syncCheckout(ctx, checkout, opts = {}) {
    return syncCheckout(ctx, checkout, opts.source || "refresh");
  }
});
