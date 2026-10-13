/**
 * Mercado Pago: re-read a resource and apply it to the ledger (webhooks,
 * refresh, reconciliation, cancel), plus the registry adapter.
 *
 * Binding (DESIGN-v2 §4): a preapproval belongs to an account only through
 * a subscription row created at checkout, or through its external_reference
 * "pyarcana:<acct>:<chk>" naming an existing mercadopago checkouts row of
 * that account whose provider_ref (if set) is this preapproval, with the
 * same amount, currency and cadence. Anything else is ignored with an audit
 * line `webhook.unmatched` (no email in it).
 *
 * Charges: a `payment` and a `subscription_authorized_payment` for one
 * collection share the payment id, so they are ONE ledger row. The payment's
 * preapproval comes from the authorized payment's preapproval_id, else the
 * payment's metadata.preapproval_id (or point_of_interaction). A charge must
 * carry the subscription's amount and currency, else it is unmatched.
 *
 * Policy: a full refund or a chargeback also cancels the preapproval (so
 * nobody keeps paying with no access); a failed cancel answers an error so
 * Mercado Pago redelivers and the cancel is tried again. A deleted
 * account's preapproval is cancelled too, and audited for a refund.
 */

import { writeAudit } from "./audit.mjs";
import { applyChange, findCheckout, findSubscription, hasReversedCharge, recordNoop } from "./ledger.mjs";
import { priceFor } from "./money.mjs";
import {
  cancelPreapproval,
  chargeFromAuthorizedPayment,
  chargeFromPayment,
  createPreapproval,
  getAuthorizedPayment,
  getPayment,
  getPreapproval,
  mpConfig,
  parseExternalReference,
  paymentPreapprovalId,
  preapprovalStatus,
  preapprovalTermsMismatch,
  searchAuthorizedPayments
} from "./mercadopago.mjs";
import { isoSeconds } from "./provider-http.mjs";

const PROVIDER = "mercadopago";
const UNAVAILABLE = { ok: false, reason: "provider_unavailable" };

/**
 * Ignore a resource with an audit line (and the marker), answering success
 * so the provider stops redelivering.
 * @param {Object} ctx Context.
 * @param {string} kind Resource kind.
 * @param {string} reason Why.
 * @param {Object|null} marker Marker.
 * @returns {Promise<{ok: true, ignored: string}>} Outcome.
 */
async function unmatched(ctx, kind, reason, marker) {
  await recordNoop(ctx, marker, { action: "webhook.unmatched", detail: { provider: PROVIDER, kind, reason } });
  return { ok: true, ignored: reason };
}

/**
 * The binding a preapproval's external_reference gives, or a reason.
 * @param {Object} ctx Context.
 * @param {Object} pre Preapproval.
 * @returns {Promise<{bind: Object, checkout: Object}|{reason: string}>} Binding.
 */
async function bindingFor(ctx, pre) {
  const ref = parseExternalReference(pre.external_reference);
  const checkout = ref ? await findCheckout(ctx.db, ref.checkoutId) : null;
  if (!checkout || checkout.provider !== PROVIDER || checkout.account_id !== ref.accountId) {
    return { reason: ref ? "unknown_checkout" : "foreign_reference" };
  }
  if (checkout.provider_ref !== null && checkout.provider_ref !== pre.id) {
    return { reason: "checkout_mismatch" };
  }
  const mismatch = preapprovalTermsMismatch(pre, checkout);
  if (mismatch) {
    return { reason: mismatch };
  }
  const bind = { accountId: checkout.account_id, checkoutId: checkout.id, plan: checkout.plan, amountMinor: Number(checkout.amount_minor), currency: checkout.currency };
  return { bind, checkout };
}

/**
 * Cancel a subscription at Mercado Pago, re-read, and store what the re-read
 * confirms. An already-cancelled preapproval counts as success.
 * @param {Object} ctx Context.
 * @param {Object} sub Subscription row.
 * @param {{source?: string, audits?: Object[]}} [opts] Options.
 * @returns {Promise<{ok: true, status: string}|{ok: false, reason: string}>} Outcome.
 */
export async function cancelMpSubscription(ctx, sub, opts = {}) {
  if (!mpConfig(ctx.env)) {
    return { ok: false, reason: "provider_not_configured" };
  }
  await cancelPreapproval(ctx, sub.provider_ref);
  const read = await getPreapproval(ctx, sub.provider_ref);
  if (!read.ok || read.body.status !== "cancelled") {
    return { ok: false, reason: "cancel_failed" };
  }
  await applyChange(ctx, {
    provider: PROVIDER,
    providerRef: sub.provider_ref,
    status: "canceled",
    cancelAtPeriodEnd: true,
    updatedAt: isoSeconds(read.body.last_modified),
    audits: opts.audits,
    source: opts.source || "cancel"
  });
  return { ok: true, status: "canceled" };
}

/**
 * After a change: cancel when a charge was reversed, or when the account is
 * deleted, unless the subscription is already cancelled.
 * @param {Object} ctx Context.
 * @param {{subscription: Object, accountDeleted: boolean}} applied applyChange outcome.
 * @returns {Promise<{ok: boolean, reason?: string}>} Outcome.
 */
async function enforcePolicy(ctx, applied) {
  const sub = await findSubscription(ctx.db, PROVIDER, applied.subscription.provider_ref);
  if (!sub || sub.status === "canceled") {
    return { ok: true };
  }
  const reversed = await hasReversedCharge(ctx.db, sub.id);
  if (!reversed && !applied.accountDeleted) {
    return { ok: true };
  }
  const action = applied.accountDeleted ? "webhook.deleted_account" : "subscription.cancel_on_reversal";
  const outcome = await cancelMpSubscription(ctx, sub, { source: "policy", audits: [{ action, detail: { provider: PROVIDER, refundDue: applied.accountDeleted } }] });
  if (!outcome.ok) {
    await writeAudit(ctx, { action: "subscription.policy_cancel_failed", targetAccountId: sub.account_id, targetId: sub.id, detail: { provider: PROVIDER } });
  }
  return outcome.ok ? { ok: true } : { ok: false, reason: "cancel_failed" };
}

/**
 * Mark the checkout completed once its preapproval left "pending".
 * @param {Object} ctx Context.
 * @param {string|null} status Mapped status.
 * @param {string|null} checkoutId Checkout id.
 * @param {string} preapprovalId Preapproval id.
 * @returns {Object[]} Statements.
 */
function completeCheckout(ctx, status, checkoutId, preapprovalId) {
  if (!status || status === "pending" || !checkoutId) {
    return [];
  }
  return [ctx.db.prepare("UPDATE checkouts SET status = 'completed', provider_ref = COALESCE(provider_ref, ?2) WHERE id = ?1").bind(checkoutId, preapprovalId)];
}

/**
 * Re-read a preapproval and apply it.
 * @param {Object} ctx Context.
 * @param {string} id Preapproval id.
 * @param {{marker?: Object|null, source: string}} opts Options.
 * @returns {Promise<{ok: boolean, reason?: string, ignored?: string}>} Outcome.
 */
export async function syncPreapproval(ctx, id, opts) {
  const read = await getPreapproval(ctx, id);
  if (!read.ok) {
    return UNAVAILABLE;
  }
  const pre = read.body;
  const row = await findSubscription(ctx.db, PROVIDER, String(pre.id || ""));
  const binding = row ? null : await bindingFor(ctx, pre);
  const reason = row ? preapprovalTermsMismatch(pre, row) : binding.reason;
  if (reason || String(pre.id) !== id) {
    return unmatched(ctx, "preapproval", reason || "id_mismatch", opts.marker || null);
  }
  const status = preapprovalStatus(pre.status);
  const applied = await applyChange(ctx, {
    provider: PROVIDER,
    providerRef: pre.id,
    bind: binding ? binding.bind : null,
    status,
    updatedAt: isoSeconds(pre.last_modified),
    marker: opts.marker || null,
    audits: status ? [] : [{ action: "subscription.unknown_status", detail: { provider: PROVIDER } }],
    extra: completeCheckout(ctx, status, row ? row.checkout_id : binding.checkout.id, pre.id),
    source: opts.source
  });
  return enforcePolicy(ctx, applied);
}

/**
 * The subscription row for a preapproval, binding it first if needed.
 * @param {Object} ctx Context.
 * @param {string} preapprovalId Preapproval id.
 * @param {string} source Source.
 * @returns {Promise<{row?: Object, outcome?: Object}>} Row, or an outcome to return.
 */
async function subscriptionFor(ctx, preapprovalId, source) {
  const row = await findSubscription(ctx.db, PROVIDER, preapprovalId);
  if (row) {
    return { row };
  }
  const synced = await syncPreapproval(ctx, preapprovalId, { marker: null, source });
  if (!synced.ok) {
    return { outcome: synced };
  }
  const bound = await findSubscription(ctx.db, PROVIDER, preapprovalId);
  return bound ? { row: bound } : { outcome: { ok: true, ignored: synced.ignored || "unbound" } };
}

/**
 * Apply one charge fact to the subscription of a preapproval.
 * @param {Object} ctx Context.
 * @param {string|null} preapprovalId Preapproval id.
 * @param {Object|null} fact Charge fact.
 * @param {{kind: string, marker?: Object|null, source: string}} opts Options.
 * @returns {Promise<Object>} Outcome.
 */
async function applyCharge(ctx, preapprovalId, fact, opts) {
  if (!preapprovalId) {
    return unmatched(ctx, opts.kind, "no_preapproval", opts.marker || null);
  }
  const found = await subscriptionFor(ctx, preapprovalId, opts.source);
  if (found.outcome) {
    return found.outcome.ok ? unmatched(ctx, opts.kind, found.outcome.ignored, opts.marker || null) : found.outcome;
  }
  const sub = found.row;
  if (fact && (fact.amountMinor !== Number(sub.amount_minor) || fact.currency !== sub.currency)) {
    return unmatched(ctx, opts.kind, "amount_mismatch", opts.marker || null);
  }
  const partial = fact && fact.flag === "partial_refund";
  const applied = await applyChange(ctx, {
    provider: PROVIDER,
    providerRef: preapprovalId,
    charges: fact ? [fact] : [],
    marker: opts.marker || null,
    audits: partial ? [{ action: "charge.partial_refund_seen", detail: { provider: PROVIDER, chargeId: fact.chargeId } }] : [],
    source: opts.source
  });
  return enforcePolicy(ctx, applied);
}

/**
 * Re-read an authorized payment (one recurring charge) and apply it.
 * @param {Object} ctx Context.
 * @param {string} id Authorized payment id.
 * @param {{marker?: Object|null, source: string}} opts Options.
 * @returns {Promise<Object>} Outcome.
 */
export async function syncAuthorizedPayment(ctx, id, opts) {
  const read = await getAuthorizedPayment(ctx, id);
  if (!read.ok) {
    return UNAVAILABLE;
  }
  const ap = read.body;
  const preapprovalId = typeof ap.preapproval_id === "string" && ap.preapproval_id ? ap.preapproval_id : null;
  return applyCharge(ctx, preapprovalId, chargeFromAuthorizedPayment(ap, ctx.now), { ...opts, kind: "authorized_payment" });
}

/**
 * Re-read a payment and apply it (refunds and chargebacks arrive here).
 * @param {Object} ctx Context.
 * @param {string} id Payment id.
 * @param {{marker?: Object|null, source: string}} opts Options.
 * @returns {Promise<Object>} Outcome.
 */
export async function syncPayment(ctx, id, opts) {
  const read = await getPayment(ctx, id);
  if (!read.ok) {
    return UNAVAILABLE;
  }
  const fact = chargeFromPayment(read.body, ctx.now);
  if (!fact) {
    return unmatched(ctx, "payment", "unusable_payment", opts.marker || null);
  }
  return applyCharge(ctx, paymentPreapprovalId(read.body), fact, { ...opts, kind: "payment" });
}

/**
 * Re-read a preapproval and every charge Mercado Pago lists for it.
 * @param {Object} ctx Context.
 * @param {string} preapprovalId Preapproval id.
 * @param {string} source Source.
 * @returns {Promise<{ok: boolean}>} Outcome.
 */
async function syncAll(ctx, preapprovalId, source) {
  const synced = await syncPreapproval(ctx, preapprovalId, { marker: null, source });
  if (!synced.ok || synced.ignored) {
    return { ok: synced.ok };
  }
  const list = await searchAuthorizedPayments(ctx, preapprovalId);
  if (!list.ok) {
    return { ok: false };
  }
  let ok = true;
  for (const ap of list.results) {
    const fact = chargeFromAuthorizedPayment(ap, ctx.now);
    const outcome = fact && ap.preapproval_id === preapprovalId ? await applyCharge(ctx, preapprovalId, fact, { kind: "authorized_payment", source }) : { ok: true };
    ok = ok && outcome.ok;
  }
  return { ok };
}

/** The Mercado Pago adapter (see providers.mjs). */
export const mercadopagoAdapter = Object.freeze({
  pendingSubscription: true,
  configured(env, plan) {
    return Boolean(mpConfig(env)) && priceFor(env, PROVIDER, plan) !== null;
  },
  startCheckout(ctx, args) {
    return createPreapproval(ctx, args);
  },
  cancel(ctx, sub, opts = {}) {
    return cancelMpSubscription(ctx, sub, { source: opts.source || "account_deletion", audits: opts.audits });
  },
  sync(ctx, sub, opts = {}) {
    return syncAll(ctx, sub.provider_ref, opts.source || "refresh");
  },
  syncCheckout(ctx, checkout, opts = {}) {
    return checkout.provider_ref ? syncAll(ctx, checkout.provider_ref, opts.source || "refresh") : Promise.resolve({ ok: true });
  }
});
