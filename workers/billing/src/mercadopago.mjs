/**
 * Mercado Pago (PEN) client and pure mappers (DESIGN-v2 §4, §6;
 * scratchpad/review/contract-mercadopago.md, from vendor SDK source).
 *
 * API calls: POST /preapproval (status "pending", no plan), GET and PUT
 * /preapproval/{id}, GET /authorized_payments/{id},
 * GET /authorized_payments/search?preapproval_id=, GET /v1/payments/{id}.
 * Header `Authorization: Bearer MP_ACCESS_TOKEN`; X-Idempotency-Key on every
 * write (whether /preapproval honours it is UNVERIFIED in the contract).
 *
 * Webhook signature: `x-signature: ts=<ts>,v1=<hex>`, v1 = HMAC-SHA256 with
 * MP_WEBHOOK_SECRET over `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`,
 * a pair dropped when its value is missing. data.id comes from the QUERY
 * only (the vendor validators read it there; the body is unsigned), and is
 * lowercased when alphanumeric (DESIGN-v2 §4). ts may be seconds or
 * milliseconds (contract §6: sources conflict); ±300 s.
 *
 * The four Vocal defects this port fixes (review of mercadopago.js):
 *  1. a rejected / pending / in_process / cancelled payment mapped to
 *     "past_due" and could extend access: here it is a charge row with that
 *     status, which never entitles (access.mjs counts only approved);
 *  2. a refund or chargeback mapped to "canceled" at subscription level:
 *     here it marks the CHARGE (refunded_at / charged_back_at), which ends
 *     exactly that paid interval, and the preapproval is cancelled too;
 *  3. a pending preapproval mapped to "past_due" (renewing, so it earned
 *     grace): here it is "pending", which never entitles;
 *  4. data.id was taken from the body first and fell back to the
 *     notification id: here it is the query's data.id only.
 */

import { constantTimeEqual, hmacHex } from "./crypto.mjs";
import { decimalToMinor, minorToDecimal, planMonths } from "./money.mjs";
import { isoSeconds, providerFetch } from "./provider-http.mjs";

const DEFAULT_BASE = "https://api.mercadopago.com";
const SIGNATURE_TOLERANCE_SECONDS = 300;
const encoder = new TextEncoder();

/** Preapproval status -> subscription status. Anything else changes nothing. */
const PREAPPROVAL_STATUS = Object.freeze({ pending: "pending", authorized: "active", paused: "past_due", cancelled: "canceled" });

/**
 * Mercado Pago settings, or null unless the token AND the webhook secret are
 * set (a checkout whose webhooks cannot be verified must not start).
 * @param {Object} env Worker env.
 * @returns {{token: string, secret: string, base: string}|null} Config.
 */
export function mpConfig(env) {
  const token = env && typeof env.MP_ACCESS_TOKEN === "string" ? env.MP_ACCESS_TOKEN.trim() : "";
  const secret = env && typeof env.MP_WEBHOOK_SECRET === "string" ? env.MP_WEBHOOK_SECRET.trim() : "";
  const base = env && typeof env.MP_API_BASE === "string" && /^https:\/\/[^/]+$/.test(env.MP_API_BASE.trim()) ? env.MP_API_BASE.trim() : DEFAULT_BASE;
  return token && secret ? { token, secret, base } : null;
}

/**
 * One authenticated Mercado Pago call.
 * @param {Object} ctx Context (env, fetchImpl).
 * @param {string} method Method.
 * @param {string} path Path (ids already encoded).
 * @param {{body?: Object, idempotencyKey?: string}} [opts] Options.
 * @returns {Promise<{ok: boolean, status: number, body: Object|null}>} Result.
 */
function mpCall(ctx, method, path, opts = {}) {
  const config = mpConfig(ctx.env);
  if (!config) {
    return Promise.resolve({ ok: false, status: 0, body: null });
  }
  const headers = { authorization: `Bearer ${config.token}` };
  if (opts.idempotencyKey) {
    headers["x-idempotency-key"] = opts.idempotencyKey;
  }
  return providerFetch(ctx, `${config.base}${path}`, { method, headers, body: opts.body });
}

/**
 * The plan's Spanish name on the Mercado Pago checkout.
 * @param {string} plan Plan id.
 * @returns {string} Reason.
 */
function reasonFor(plan) {
  return plan === "pro_yearly" ? "PyArcana Pro anual" : "PyArcana Pro mensual";
}

/**
 * The external_reference binding a preapproval to an account and checkout.
 * @param {string} accountId Account id.
 * @param {string} checkoutId Checkout id.
 * @returns {string} Reference.
 */
export function externalReference(accountId, checkoutId) {
  return `pyarcana:${accountId}:${checkoutId}`;
}

/**
 * Parse an external_reference; null unless it is exactly ours.
 * @param {unknown} value Reference.
 * @returns {{accountId: string, checkoutId: string}|null} Parts.
 */
export function parseExternalReference(value) {
  const match = /^pyarcana:(acct_[A-Za-z0-9_-]{22}):(chk_[A-Za-z0-9_-]{22})$/.exec(typeof value === "string" ? value : "");
  return match ? { accountId: match[1], checkoutId: match[2] } : null;
}

/**
 * POST /preapproval: a pending subscription the buyer authorizes at init_point.
 * @param {Object} ctx Context.
 * @param {{checkoutId: string, accountId: string, plan: string, amountMinor: number, currency: string,
 *          payerEmail: string, backUrl: string}} args Checkout.
 * @returns {Promise<{ok: boolean, status: number, providerRef?: string, url?: string}>} Result.
 */
export async function createPreapproval(ctx, args) {
  const res = await mpCall(ctx, "POST", "/preapproval", {
    idempotencyKey: args.checkoutId,
    body: {
      reason: reasonFor(args.plan),
      external_reference: externalReference(args.accountId, args.checkoutId),
      payer_email: args.payerEmail,
      auto_recurring: { frequency: planMonths(args.plan), frequency_type: "months", transaction_amount: minorToDecimal(args.amountMinor), currency_id: args.currency },
      back_url: args.backUrl,
      status: "pending"
    }
  });
  const body = res.body || {};
  const usable = res.ok && typeof body.id === "string" && body.id && typeof body.init_point === "string" && /^https:\/\//.test(body.init_point);
  return usable ? { ok: true, status: res.status, providerRef: body.id, url: body.init_point } : { ok: false, status: res.status };
}

/**
 * GET /preapproval/{id}.
 * @param {Object} ctx Context.
 * @param {string} id Preapproval id.
 * @returns {Promise<{ok: boolean, status: number, body: Object|null}>} Result.
 */
export function getPreapproval(ctx, id) {
  return mpCall(ctx, "GET", `/preapproval/${encodeURIComponent(id)}`);
}

/**
 * PUT /preapproval/{id} {status: "cancelled"} (immediate; MP has no
 * at-period-end cancel). The caller re-reads to learn the outcome.
 * @param {Object} ctx Context.
 * @param {string} id Preapproval id.
 * @returns {Promise<{ok: boolean, status: number}>} Result.
 */
export function cancelPreapproval(ctx, id) {
  return mpCall(ctx, "PUT", `/preapproval/${encodeURIComponent(id)}`, { body: { status: "cancelled" }, idempotencyKey: `cancel:${id}` });
}

/**
 * GET /authorized_payments/{id}.
 * @param {Object} ctx Context.
 * @param {string} id Authorized payment id.
 * @returns {Promise<{ok: boolean, status: number, body: Object|null}>} Result.
 */
export function getAuthorizedPayment(ctx, id) {
  return mpCall(ctx, "GET", `/authorized_payments/${encodeURIComponent(id)}`);
}

/**
 * GET /authorized_payments/search?preapproval_id= (the charges of one
 * preapproval, for refresh and reconciliation).
 * @param {Object} ctx Context.
 * @param {string} preapprovalId Preapproval id.
 * @returns {Promise<{ok: boolean, results: Object[]}>} Result.
 */
export async function searchAuthorizedPayments(ctx, preapprovalId) {
  const res = await mpCall(ctx, "GET", `/authorized_payments/search?preapproval_id=${encodeURIComponent(preapprovalId)}&limit=50`);
  const results = res.ok && Array.isArray(res.body.results) ? res.body.results.filter((r) => r && typeof r === "object") : null;
  return results ? { ok: true, results } : { ok: false, results: [] };
}

/**
 * GET /v1/payments/{id}.
 * @param {Object} ctx Context.
 * @param {string} id Payment id.
 * @returns {Promise<{ok: boolean, status: number, body: Object|null}>} Result.
 */
export function getPayment(ctx, id) {
  return mpCall(ctx, "GET", `/v1/payments/${encodeURIComponent(id)}`);
}

/**
 * Parse `ts=<ts>,v1=<hex>` (keys case-insensitive, unknown keys ignored).
 * @param {unknown} header Header value.
 * @returns {{ts: string|null, v1: string|null}} Parts.
 */
export function parseSignatureHeader(header) {
  const out = { ts: null, v1: null };
  for (const part of String(header || "").split(",")) {
    const index = part.indexOf("=");
    const key = index > 0 ? part.slice(0, index).trim().toLowerCase() : "";
    const value = index > 0 ? part.slice(index + 1).trim() : "";
    if ((key === "ts" || key === "v1") && value) {
      out[key] = key === "v1" ? value.toLowerCase() : value;
    }
  }
  return out;
}

/**
 * The signed manifest; a pair whose value is missing is dropped.
 * @param {{dataId: string|null, requestId: string|null, ts: string}} parts Parts.
 * @returns {string} Manifest.
 */
export function signatureManifest(parts) {
  const id = parts.dataId && /^[A-Za-z0-9]+$/.test(parts.dataId) ? parts.dataId.toLowerCase() : parts.dataId;
  return (id ? `id:${id};` : "") + (parts.requestId ? `request-id:${parts.requestId};` : "") + `ts:${parts.ts};`;
}

/**
 * ts as epoch seconds (seconds or milliseconds accepted), or null.
 * @param {string} ts Raw ts.
 * @returns {number|null} Seconds.
 */
function tsSeconds(ts) {
  if (!/^\d{1,16}$/.test(ts)) {
    return null;
  }
  const n = Number(ts);
  return n > 1e11 ? Math.floor(n / 1000) : n;
}

/**
 * Verify a notification's x-signature.
 * @param {Object} ctx Context (env, now).
 * @param {{header: string|null, dataId: string|null, requestId: string|null}} input Signed parts.
 * @returns {Promise<{ok: boolean, reason?: string}>} Verdict (reason codes carry no secret).
 */
export async function verifyMpSignature(ctx, input) {
  const config = mpConfig(ctx.env);
  const parsed = parseSignatureHeader(input.header);
  if (!config || !parsed.ts || !parsed.v1) {
    return { ok: false, reason: config ? "missing_signature" : "not_configured" };
  }
  const seconds = tsSeconds(parsed.ts);
  if (seconds === null || Math.abs(ctx.now - seconds) > SIGNATURE_TOLERANCE_SECONDS) {
    return { ok: false, reason: "stale_signature" };
  }
  const manifest = signatureManifest({ dataId: input.dataId, requestId: input.requestId, ts: parsed.ts });
  const expected = await hmacHex(encoder.encode(config.secret), manifest);
  return constantTimeEqual(expected, parsed.v1) ? { ok: true } : { ok: false, reason: "bad_signature" };
}

/**
 * A preapproval status as a subscription status, or null (unknown values
 * change nothing and never grant access).
 * @param {unknown} status Preapproval status.
 * @returns {string|null} Status.
 */
export function preapprovalStatus(status) {
  return typeof status === "string" && Object.prototype.hasOwnProperty.call(PREAPPROVAL_STATUS, status) ? PREAPPROVAL_STATUS[status] : null;
}

/**
 * Why a preapproval's price terms differ from a stored row, or null when
 * amount, currency and cadence all match.
 * @param {Object} pre Preapproval.
 * @param {{plan: string, amount_minor: number, currency: string}} row Checkout or subscription row.
 * @returns {string|null} Reason.
 */
export function preapprovalTermsMismatch(pre, row) {
  const recurring = pre && pre.auto_recurring && typeof pre.auto_recurring === "object" ? pre.auto_recurring : {};
  if (decimalToMinor(recurring.transaction_amount) !== Number(row.amount_minor)) {
    return "amount_mismatch";
  }
  if (recurring.currency_id !== row.currency) {
    return "currency_mismatch";
  }
  const cadenceOk = recurring.frequency_type === "months" && Number(recurring.frequency) === planMonths(row.plan);
  return cadenceOk ? null : "plan_mismatch";
}

/**
 * The preapproval a payment belongs to: metadata.preapproval_id, else
 * point_of_interaction.transaction_data.subscription_id (contract §5).
 * @param {Object} payment Payment.
 * @returns {string|null} Preapproval id.
 */
export function paymentPreapprovalId(payment) {
  const meta = payment && payment.metadata && typeof payment.metadata === "object" ? payment.metadata.preapproval_id : null;
  const poi = payment && payment.point_of_interaction && payment.point_of_interaction.transaction_data;
  const fallback = poi && typeof poi === "object" ? poi.subscription_id : null;
  const id = meta || fallback;
  return typeof id === "string" && id ? id : null;
}

/** Payment statuses stored as they are; none of them entitles. */
const NON_ENTITLING = new Set(["pending", "in_process", "rejected", "cancelled", "authorized"]);

/**
 * The reversal and flag fields of a payment status.
 * @param {string} status Payment status.
 * @param {Object} source Payment or authorized payment (dates).
 * @param {number} now Clock (fallback date).
 * @returns {Object} Charge fields.
 */
function statusFields(status, source, now) {
  const changedAt = isoSeconds(source.date_last_updated) || isoSeconds(source.last_modified) || now;
  if (status === "refunded") {
    return { status: "approved", refundedAt: changedAt };
  }
  if (status === "charged_back") {
    return { status: "approved", chargedBackAt: changedAt };
  }
  if (status === "in_mediation") {
    return { status: "approved", flag: "in_mediation" };
  }
  if (status === "approved") {
    return { status: "approved" };
  }
  return { status: NON_ENTITLING.has(status) ? status : "unknown" };
}

/**
 * A charge fact from a payment (GET /v1/payments/{id}).
 * Partial refund: the status stays "approved" with status_detail
 * "partially_refunded" or transaction_amount_refunded > 0 (contract §7):
 * no change to access, flagged `partial_refund` for an audit line.
 * @param {Object} payment Payment.
 * @param {number} now Clock.
 * @returns {Object|null} Charge fact, or null without an id or amount.
 */
export function chargeFromPayment(payment, now) {
  const amountMinor = decimalToMinor(payment && payment.transaction_amount);
  const id = payment && (typeof payment.id === "number" || typeof payment.id === "string") ? String(payment.id) : "";
  if (!id || amountMinor === null) {
    return null;
  }
  const fields = statusFields(String(payment.status || ""), payment, now);
  const partial = fields.status === "approved" && !fields.refundedAt && (payment.status_detail === "partially_refunded" || Number(payment.transaction_amount_refunded) > 0);
  return {
    chargeId: id,
    amountMinor,
    currency: String(payment.currency_id || ""),
    approvedAt: isoSeconds(payment.date_approved),
    ...fields,
    ...(partial ? { flag: "partial_refund" } : {})
  };
}

/**
 * A charge fact from an authorized payment (the invoice of one recurring
 * charge). The charge id is the linked PAYMENT id, so the `payment` and the
 * `subscription_authorized_payment` notifications for one charge land on
 * ONE ledger row (no double extension). The status comes from
 * payment.status: the invoice's own `processed` also means "retries
 * exhausted" (contract §4). No payment id yet (scheduled) -> null.
 * @param {Object} ap Authorized payment.
 * @param {number} now Clock.
 * @returns {Object|null} Charge fact.
 */
export function chargeFromAuthorizedPayment(ap, now) {
  const payment = ap && ap.payment && typeof ap.payment === "object" ? ap.payment : null;
  const id = payment && (typeof payment.id === "number" || typeof payment.id === "string") ? String(payment.id) : "";
  const amountMinor = decimalToMinor(ap && ap.transaction_amount);
  if (!id || amountMinor === null) {
    return null;
  }
  const fields = statusFields(String(payment.status || ""), ap, now);
  const approvedAt = fields.status === "approved" ? isoSeconds(ap.debit_date) || isoSeconds(ap.last_modified) || isoSeconds(ap.date_created) : null;
  return { chargeId: id, amountMinor, currency: String(ap.currency_id || ""), approvedAt, ...fields };
}
