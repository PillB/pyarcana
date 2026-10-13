/**
 * Provider webhooks (DESIGN-v2 §4): no CORS, no cookie, no X-PyArcana; the
 * raw body (1 MiB cap) is kept for signature checks.
 *
 * POST /v1/webhooks/mercadopago?data.id=<id>&type=<topic>
 *   503 mercadopago_not_configured | 400 missing_data_id |
 *   401 bad_signature | 400 data_id_mismatch (a body data.id that differs
 *   from the signed query one) | then a fresh API read (mp-sync.mjs):
 *   200 applied or ignored; 502 when the read or a policy cancel failed, so
 *   Mercado Pago redelivers. The marker is (topic, data.id, request id or
 *   ts): a redelivery re-reads and re-applies the current state, a no-op.
 *
 * POST /v1/webhooks/creem
 *   503 creem_not_configured | 401 bad_signature (HMAC of the raw body) |
 *   400 bad_event | 200 duplicate (envelope id already processed; the id is
 *   kept for ever because the scheme has no timestamp) | 200 applied or
 *   ignored | 502 when a policy cancel failed (Creem retries).
 *
 * Nothing logs a secret, a signature, an email or a body: only the provider,
 * the topic and a reason code.
 */

import { applyCreemEvent } from "./creem-sync.mjs";
import { creemConfig, verifyCreemSignature } from "./creem.mjs";
import { recordNoop } from "./ledger.mjs";
import { mpConfig, parseSignatureHeader, verifyMpSignature } from "./mercadopago.mjs";
import { syncAuthorizedPayment, syncPayment, syncPreapproval } from "./mp-sync.mjs";

/** Webhook body cap (DESIGN-v2 §4). */
export const WEBHOOK_BODY_CAP = 1024 * 1024;

/** Mercado Pago topic -> re-read and apply. */
const MP_TOPICS = Object.freeze({
  subscription_preapproval: syncPreapproval,
  subscription_authorized_payment: syncAuthorizedPayment,
  payment: syncPayment
});

/**
 * A JSON stop.
 * @param {number} status Status.
 * @param {string} reason Reason.
 * @returns {Object} Result.
 */
function stop(status, reason) {
  return { status, body: { ok: false, reason } };
}

/**
 * The HTTP answer for a sync outcome.
 * @param {Object} ctx Context.
 * @param {string} provider Provider.
 * @param {string} kind Topic or event type.
 * @param {{ok: boolean, reason?: string, ignored?: string}} outcome Outcome.
 * @returns {Object} Result.
 */
function answer(ctx, provider, kind, outcome) {
  if (!outcome.ok) {
    ctx.log(`webhook ${provider} ${kind} failed: ${outcome.reason || "unknown"}`);
    return stop(502, outcome.reason || "provider_unavailable");
  }
  return { status: 200, body: outcome.ignored ? { ok: true, ignored: outcome.ignored } : { ok: true } };
}

/**
 * The data.id a Mercado Pago body claims, if any.
 * @param {Object|null} body Parsed body.
 * @returns {string|null} Id.
 */
function bodyDataId(body) {
  const data = body && body.data && typeof body.data === "object" ? body.data : null;
  return data && data.id !== undefined && data.id !== null ? String(data.id) : null;
}

/**
 * POST /v1/webhooks/mercadopago.
 * @param {Object} ctx Context (rawBody, body may be null).
 * @returns {Promise<Object>} Result.
 */
export async function handleMercadoPagoWebhook(ctx) {
  if (!mpConfig(ctx.env)) {
    return stop(503, "mercadopago_not_configured");
  }
  const dataId = ctx.url.searchParams.get("data.id");
  const topic = ctx.url.searchParams.get("type") || ctx.url.searchParams.get("topic") || "";
  if (!dataId) {
    return stop(400, "missing_data_id");
  }
  const header = ctx.request.headers.get("x-signature");
  const requestId = ctx.request.headers.get("x-request-id");
  const verdict = await verifyMpSignature(ctx, { header, dataId, requestId });
  if (!verdict.ok) {
    return stop(401, "bad_signature");
  }
  const claimed = bodyDataId(ctx.body);
  if (claimed !== null && claimed !== dataId) {
    return stop(400, "data_id_mismatch");
  }
  const marker = { provider: "mercadopago", eventId: `${topic}:${dataId}:${requestId || parseSignatureHeader(header).ts}` };
  const sync = Object.prototype.hasOwnProperty.call(MP_TOPICS, topic) ? MP_TOPICS[topic] : null;
  if (!sync) {
    await recordNoop(ctx, marker, null);
    return { status: 200, body: { ok: true, ignored: "topic" } };
  }
  return answer(ctx, "mercadopago", topic, await sync(ctx, dataId, { marker, source: "webhook" }));
}

/**
 * A Creem envelope, or null when it is not one.
 * @param {Object|null} body Parsed body.
 * @returns {Object|null} Envelope.
 */
function creemEnvelope(body) {
  const ok = body && typeof body.id === "string" && body.id && typeof body.eventType === "string" && body.object && typeof body.object === "object";
  return ok ? body : null;
}

/**
 * True when a Creem event id was already processed.
 * @param {Object} db D1.
 * @param {string} id Envelope id.
 * @returns {Promise<boolean>} Seen.
 */
async function seenCreemEvent(db, id) {
  return Boolean(await db.prepare("SELECT 1 AS hit FROM webhook_events WHERE provider = 'creem' AND event_id = ?1").bind(id).first());
}

/**
 * POST /v1/webhooks/creem.
 * @param {Object} ctx Context (rawBody, body may be null).
 * @returns {Promise<Object>} Result.
 */
export async function handleCreemWebhook(ctx) {
  if (!creemConfig(ctx.env)) {
    return stop(503, "creem_not_configured");
  }
  if (!(await verifyCreemSignature(ctx.env, ctx.rawBody, ctx.request.headers.get("creem-signature")))) {
    return stop(401, "bad_signature");
  }
  const event = creemEnvelope(ctx.body);
  if (!event) {
    return stop(400, "bad_event");
  }
  if (await seenCreemEvent(ctx.db, event.id)) {
    return { status: 200, body: { ok: true, duplicate: true } };
  }
  try {
    return answer(ctx, "creem", event.eventType, await applyCreemEvent(ctx, event, { provider: "creem", eventId: event.id, strict: true }));
  } catch (error) {
    // A concurrent delivery of the same envelope won the marker: its batch
    // did the work and this one rolled back whole.
    if (await seenCreemEvent(ctx.db, event.id)) {
      return { status: 200, body: { ok: true, duplicate: true } };
    }
    throw error;
  }
}
