/**
 * Creem (USD, merchant of record) client and pure mappers (DESIGN-v2 §4,
 * §7; scratchpad/review/contract-creem.md, from the vendor's OpenAPI and
 * docs source).
 *
 * API: base CREEM_API_BASE (https://api.creem.io live,
 * https://test-api.creem.io test), header `x-api-key`.
 *   POST /v1/checkouts {product_id, request_id, customer:{email}, metadata,
 *     success_url} -> {id, checkout_url}
 *   GET  /v1/checkouts?checkout_id=
 *   GET  /v1/subscriptions?subscription_id=
 *   POST /v1/subscriptions/{id}/cancel {mode: "scheduled"|"immediate"}
 *
 * Webhooks: `creem-signature` = lowercase hex HMAC-SHA256 of the RAW body,
 * keyed with the whole secret string as UTF-8 (whsec_ prefix included).
 * There is no timestamp in the scheme, so every envelope id is kept for
 * ever in webhook_events (replay protection).
 *
 * Money: Creem amounts are integer cents. A product's `price` is the net
 * price (tax_mode exclusive adds tax on top), and so is a transaction's
 * `amount` (the refund sample: amount 1000, tax 210, amount_paid 1210); the
 * worker compares and stores those net amounts against PRICE_US_*.
 *
 * Charges are keyed by TRANSACTION id (tran_...): subscription.paid names it
 * (last_transaction_id), refund.created and dispute.created carry it
 * (object.transaction.id), and an order carries it when present
 * (order.transaction, OAS OrderEntity). checkout.completed records the first
 * charge only when its order names the transaction; otherwise
 * subscription.paid (the event Creem recommends for access) records it.
 */

import { constantTimeEqual } from "./crypto.mjs";
import { integerMinor } from "./money.mjs";
import { epochSeconds, isoSeconds, providerFetch, refId } from "./provider-http.mjs";

const DEFAULT_BASE = "https://api.creem.io";
const encoder = new TextEncoder();

/** Plan -> the var naming its Creem product. */
const PRODUCT_VARS = Object.freeze({ pro_monthly: "CREEM_PRODUCT_PRO_MONTHLY", pro_yearly: "CREEM_PRODUCT_PRO_YEARLY" });

/**
 * Trimmed string var or "".
 * @param {Object} env Env.
 * @param {string} name Name.
 * @returns {string} Value.
 */
function text(env, name) {
  return env && typeof env[name] === "string" ? env[name].trim() : "";
}

/**
 * Creem settings, or null unless the key and the webhook secret are set.
 * @param {Object} env Worker env.
 * @returns {{key: string, secret: string, base: string}|null} Config.
 */
export function creemConfig(env) {
  const key = text(env, "CREEM_API_KEY");
  const secret = text(env, "CREEM_WEBHOOK_SECRET");
  const rawBase = text(env, "CREEM_API_BASE");
  const base = /^https:\/\/[^/]+$/.test(rawBase) ? rawBase : DEFAULT_BASE;
  return key && secret ? { key, secret, base } : null;
}

/**
 * The Creem product id configured for a plan, or "".
 * @param {Object} env Worker env.
 * @param {string} plan Plan id.
 * @returns {string} Product id.
 */
export function creemProductFor(env, plan) {
  return Object.prototype.hasOwnProperty.call(PRODUCT_VARS, plan) ? text(env, PRODUCT_VARS[plan]) : "";
}

/**
 * The plan a Creem product id stands for, or null.
 * @param {Object} env Worker env.
 * @param {string|null} productId Product id.
 * @returns {string|null} Plan.
 */
export function planForProduct(env, productId) {
  return Object.keys(PRODUCT_VARS).find((plan) => productId && creemProductFor(env, plan) === productId) || null;
}

/**
 * One authenticated Creem call.
 * @param {Object} ctx Context.
 * @param {string} method Method.
 * @param {string} path Path and query (ids encoded).
 * @param {Object} [body] JSON body.
 * @returns {Promise<{ok: boolean, status: number, body: Object|null}>} Result.
 */
function creemCall(ctx, method, path, body) {
  const config = creemConfig(ctx.env);
  if (!config) {
    return Promise.resolve({ ok: false, status: 0, body: null });
  }
  return providerFetch(ctx, `${config.base}${path}`, { method, headers: { "x-api-key": config.key }, body });
}

/**
 * POST /v1/checkouts.
 * @param {Object} ctx Context.
 * @param {{checkoutId: string, accountId: string, plan: string, customerEmail: string|null, successUrl: string}} args Checkout.
 * @returns {Promise<{ok: boolean, status: number, providerRef?: string, url?: string}>} Result.
 */
export async function createCreemCheckout(ctx, args) {
  const body = {
    product_id: creemProductFor(ctx.env, args.plan),
    request_id: args.checkoutId,
    ...(args.customerEmail ? { customer: { email: args.customerEmail } } : {}),
    metadata: { account_id: args.accountId, checkout_id: args.checkoutId },
    success_url: args.successUrl
  };
  const res = await creemCall(ctx, "POST", "/v1/checkouts", body);
  const out = res.body || {};
  const usable = res.ok && typeof out.id === "string" && out.id && typeof out.checkout_url === "string" && /^https:\/\//.test(out.checkout_url);
  return usable ? { ok: true, status: res.status, providerRef: out.id, url: out.checkout_url } : { ok: false, status: res.status };
}

/**
 * GET /v1/checkouts?checkout_id=.
 * @param {Object} ctx Context.
 * @param {string} id Creem checkout id.
 * @returns {Promise<{ok: boolean, status: number, body: Object|null}>} Result.
 */
export function getCreemCheckout(ctx, id) {
  return creemCall(ctx, "GET", `/v1/checkouts?checkout_id=${encodeURIComponent(id)}`);
}

/**
 * GET /v1/subscriptions?subscription_id=.
 * @param {Object} ctx Context.
 * @param {string} id Creem subscription id.
 * @returns {Promise<{ok: boolean, status: number, body: Object|null}>} Result.
 */
export function getCreemSubscription(ctx, id) {
  return creemCall(ctx, "GET", `/v1/subscriptions?subscription_id=${encodeURIComponent(id)}`);
}

/**
 * POST /v1/subscriptions/{id}/cancel with an explicit mode (the default is a
 * store setting; contract "still unverified" 1).
 * @param {Object} ctx Context.
 * @param {string} id Creem subscription id.
 * @param {"scheduled"|"immediate"} mode Mode.
 * @returns {Promise<{ok: boolean, status: number}>} Result.
 */
export function cancelCreemSubscription(ctx, id, mode) {
  return creemCall(ctx, "POST", `/v1/subscriptions/${encodeURIComponent(id)}/cancel`, { mode });
}

/**
 * Verify creem-signature over the raw body (trimmed, lowercased, an optional
 * "sha256=" prefix tolerated as the vendor SDK does).
 * @param {Object} env Worker env.
 * @param {Uint8Array} raw Raw body bytes.
 * @param {string|null} header Header value.
 * @returns {Promise<boolean>} Valid.
 */
export async function verifyCreemSignature(env, raw, header) {
  const config = creemConfig(env);
  const given = String(header || "").trim().toLowerCase().replace(/^sha256=/, "");
  if (!config || !/^[0-9a-f]{64}$/.test(given)) {
    return false;
  }
  const key = await crypto.subtle.importKey("raw", encoder.encode(config.secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, raw));
  const expected = Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
  return constantTimeEqual(expected, given);
}

/**
 * A Creem subscription status (from the object, as a re-read returns it) as
 * {status, cancelAtPeriodEnd}, or null when it changes nothing (trialing,
 * paused: we never create trials, and a pause is not a renewal).
 * @param {unknown} status Creem status.
 * @returns {{status: string, cancelAtPeriodEnd: boolean}|null} Mapping.
 */
export function creemStatus(status) {
  const map = {
    active: { status: "active", cancelAtPeriodEnd: false },
    past_due: { status: "past_due", cancelAtPeriodEnd: false },
    unpaid: { status: "past_due", cancelAtPeriodEnd: false },
    scheduled_cancel: { status: "active", cancelAtPeriodEnd: true },
    canceled: { status: "canceled", cancelAtPeriodEnd: true },
    expired: { status: "canceled", cancelAtPeriodEnd: true }
  };
  return typeof status === "string" && Object.prototype.hasOwnProperty.call(map, status) ? map[status] : null;
}

/**
 * The net price and currency a Creem object states for its product: the
 * expanded product's price, else the order's sub_total, else its amount.
 * @param {Object} object Checkout or subscription object.
 * @returns {{amountMinor: number|null, currency: string}} Terms.
 */
export function creemTerms(object) {
  const product = object && object.product && typeof object.product === "object" ? object.product : null;
  const order = object && object.order && typeof object.order === "object" ? object.order : null;
  if (product) {
    return { amountMinor: integerMinor(product.price), currency: String(product.currency || "").toUpperCase() };
  }
  const amount = order ? integerMinor(order.sub_total === undefined ? order.amount : order.sub_total) : null;
  return { amountMinor: amount, currency: order ? String(order.currency || "").toUpperCase() : "" };
}

/**
 * The product id of a Creem object (expanded product, product string, or
 * the order's product).
 * @param {Object} object Checkout or subscription object.
 * @returns {string|null} Product id.
 */
export function creemProductId(object) {
  const order = object && object.order && typeof object.order === "object" ? object.order : null;
  return refId(object && object.product) || (order ? refId(order.product) : null);
}

/**
 * The first charge of a completed checkout, when its order names the
 * transaction (else null: subscription.paid records it).
 * @param {Object} checkout Checkout object.
 * @param {number} fallbackAt Clock for a missing order date.
 * @returns {Object|null} Charge fact.
 */
export function chargeFromCheckout(checkout, fallbackAt) {
  const order = checkout && checkout.order && typeof checkout.order === "object" ? checkout.order : null;
  const transaction = order ? refId(order.transaction) : null;
  const terms = creemTerms(checkout);
  if (!transaction || terms.amountMinor === null) {
    return null;
  }
  const paid = order.status === "paid";
  return {
    chargeId: transaction,
    amountMinor: terms.amountMinor,
    currency: terms.currency,
    status: paid ? "approved" : "pending",
    approvedAt: paid ? isoSeconds(order.created_at) || fallbackAt : null
  };
}

/**
 * The expanded last transaction of a subscription object, or null.
 * @param {Object} sub Subscription object.
 * @returns {Object|null} Transaction.
 */
function lastTransactionOf(sub) {
  return sub && sub.last_transaction && typeof sub.last_transaction === "object" ? sub.last_transaction : null;
}

/**
 * Creem's own period for a subscription's current charge, when it states
 * one (period dates, else the transaction's epoch period).
 * @param {Object} sub Subscription object.
 * @param {Object|null} last Last transaction.
 * @returns {Object} `{periodStart, periodEnd, periodFromProvider}` or {}.
 */
function providerPeriod(sub, last) {
  const periodStart = isoSeconds(sub.current_period_start_date) || (last ? epochSeconds(last.period_start) : null);
  const periodEnd = isoSeconds(sub.current_period_end_date) || (last ? epochSeconds(last.period_end) : null);
  return periodStart && periodEnd && periodEnd > periodStart ? { periodStart, periodEnd, periodFromProvider: true } : {};
}

/**
 * Net amount and currency of the current charge: the transaction's, else
 * the product's.
 * @param {Object} sub Subscription object.
 * @param {Object|null} last Last transaction.
 * @returns {{amountMinor: number|null, currency: string}} Terms.
 */
function chargeTerms(sub, last) {
  const terms = creemTerms(sub);
  const own = last ? integerMinor(last.amount) : null;
  return {
    amountMinor: own === null ? terms.amountMinor : own,
    currency: last && last.currency ? String(last.currency).toUpperCase() : terms.currency
  };
}

/**
 * The paid charge a subscription object reports (subscription.paid, or a
 * re-read whose last transaction is paid), with Creem's own period.
 * @param {Object} sub Subscription object.
 * @param {number} fallbackAt Clock.
 * @returns {Object|null} Charge fact.
 */
export function chargeFromSubscription(sub, fallbackAt) {
  const last = lastTransactionOf(sub);
  const id = (sub && typeof sub.last_transaction_id === "string" && sub.last_transaction_id) || refId(last);
  const terms = chargeTerms(sub || {}, last);
  if (!id || terms.amountMinor === null) {
    return null;
  }
  const approvedAt = isoSeconds(sub.last_transaction_date) || (last ? epochSeconds(last.created_at) : null) || fallbackAt;
  return { chargeId: id, ...terms, status: "approved", approvedAt, ...providerPeriod(sub, last) };
}
