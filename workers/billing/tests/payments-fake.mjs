/**
 * Payment test harness: a fake Mercado Pago and a fake Creem behind one
 * injectable fetch, webhook signers, and a request helper that can set
 * Cloudflare's request.cf (the rail/country check reads it).
 *
 * The fake providers answer with the field names and shapes of the
 * contracts extracted from vendor source (scratchpad/review/contract-*.md):
 * MP preapproval {id, status, external_reference, auto_recurring, init_point,
 * last_modified}, authorized_payment {id, preapproval_id, payment:{id,status},
 * transaction_amount, currency_id, debit_date}, payment {id, status,
 * status_detail, metadata.preapproval_id, transaction_amount, currency_id,
 * date_approved}; Creem checkout {id, checkout_url, status, request_id,
 * metadata, order, subscription, product} and subscription {id, status,
 * product, current_period_*_date, last_transaction, updated_at}. They are
 * NOT recordings of live traffic (none exist); the first live test is the
 * proof, as DESIGN-v2 §11.9 states.
 */

import { createHmac } from "node:crypto";

import { API_BASE, APP_ORIGIN, NOW, createHarness } from "./fixtures.mjs";

export const MP_TOKEN = "APP_USR-test-token";
export const MP_SECRET = "mp-webhook-secret-for-tests";
export const CREEM_KEY = "creem_test_key";
export const CREEM_SECRET = "whsec_creem_test_secret";
export const CREEM_MONTHLY = "prod_monthly_test";
export const CREEM_YEARLY = "prod_yearly_test";
export const MP_BASE = "https://api.mercadopago.test";
export const CREEM_BASE = "https://test-api.creem.test";

/** Env vars that configure both rails. */
export const PAYMENT_VARS = {
  MP_ACCESS_TOKEN: MP_TOKEN,
  MP_WEBHOOK_SECRET: MP_SECRET,
  MP_API_BASE: MP_BASE,
  CREEM_API_KEY: CREEM_KEY,
  CREEM_WEBHOOK_SECRET: CREEM_SECRET,
  CREEM_API_BASE: CREEM_BASE,
  CREEM_PRODUCT_PRO_MONTHLY: CREEM_MONTHLY,
  CREEM_PRODUCT_PRO_YEARLY: CREEM_YEARLY,
  PRICE_PE_MONTHLY_MINOR: "1990",
  PRICE_PE_YEARLY_MINOR: "11990",
  PRICE_US_MONTHLY_MINOR: "799",
  PRICE_US_YEARLY_MINOR: "4900"
};

/**
 * ISO string for epoch seconds, MP style (offset and milliseconds).
 * @param {number} seconds Epoch seconds.
 * @returns {string} ISO.
 */
export function iso(seconds) {
  return new Date(seconds * 1000).toISOString();
}

/**
 * A modification time one second after `previous` (and after NOW), as a
 * provider bumps last_modified / updated_at on a write.
 * @param {string|undefined} previous ISO.
 * @returns {string} ISO.
 */
function later(previous) {
  const before = previous ? Math.floor(Date.parse(previous) / 1000) : NOW;
  return iso(Math.max(before, NOW) + 1);
}

/**
 * JSON response.
 * @param {unknown} body Body.
 * @param {number} [status] Status.
 * @returns {Response} Response.
 */
function reply(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

/**
 * A fresh fake with its own state.
 * @returns {Object} Fake: {fetchImpl, calls, mp, creem, fail(key, status|"throw"), clearFail()}.
 */
export function createPaymentFake() {
  const state = { failures: new Map(), seq: 0 };
  const mp = { preapprovals: {}, authorized: {}, payments: {} };
  const creem = { checkouts: {}, subscriptions: {} };
  const calls = [];
  const fake = { calls, mp, creem };

  fake.fail = (key, how) => state.failures.set(key, how);
  fake.clearFail = () => state.failures.clear();

  const failure = (key) => {
    const how = state.failures.get(key);
    if (how === "throw") {
      throw new TypeError("network down");
    }
    return how ? reply({ message: "fake failure", error: "internal" }, how) : null;
  };

  const mpRoutes = [
    ["POST", /^\/preapproval$/, (m, body) => {
      state.seq += 1;
      const id = `${String(state.seq).padStart(4, "0")}aa9b5da7356e40fdb65bc775b313a7dd`.slice(0, 32);
      const pre = {
        id,
        status: body.status,
        reason: body.reason,
        external_reference: body.external_reference,
        payer_email: "",
        back_url: body.back_url,
        auto_recurring: { ...body.auto_recurring },
        init_point: `https://www.mercadopago.com.pe/subscriptions/checkout?preapproval_id=${id}`,
        date_created: iso(NOW),
        last_modified: iso(NOW)
      };
      mp.preapprovals[id] = pre;
      return reply(pre, 201);
    }],
    ["GET", /^\/preapproval\/([^/]+)$/, (m) => (mp.preapprovals[m[1]] ? reply(mp.preapprovals[m[1]]) : reply({ message: "not found" }, 404))],
    ["PUT", /^\/preapproval\/([^/]+)$/, (m, body) => {
      const pre = mp.preapprovals[m[1]];
      if (!pre) {
        return reply({ message: "not found" }, 404);
      }
      if (pre.status === "cancelled") {
        return reply({ message: "You can not modify a cancelled preapproval." }, 400);
      }
      Object.assign(pre, { status: body.status, last_modified: later(pre.last_modified) });
      return reply(pre);
    }],
    ["GET", /^\/authorized_payments\/search$/, (m, body, url) => {
      const id = url.searchParams.get("preapproval_id");
      return reply({ results: Object.values(mp.authorized).filter((a) => a.preapproval_id === id), paging: { total: 0 } });
    }],
    ["GET", /^\/authorized_payments\/([^/]+)$/, (m) => (mp.authorized[m[1]] ? reply(mp.authorized[m[1]]) : reply({ message: "not found" }, 404))],
    ["GET", /^\/v1\/payments\/([^/]+)$/, (m) => (mp.payments[m[1]] ? reply(mp.payments[m[1]]) : reply({ message: "not found" }, 404))]
  ];

  const creemRoutes = [
    ["POST", /^\/v1\/checkouts$/, (m, body) => {
      state.seq += 1;
      const id = `ch_fake${state.seq}`;
      const checkout = {
        id,
        object: "checkout",
        mode: "test",
        status: "pending",
        request_id: body.request_id,
        product: body.product_id,
        metadata: body.metadata,
        success_url: body.success_url,
        checkout_url: `https://checkout.creem.test/${id}`
      };
      creem.checkouts[id] = checkout;
      return reply(checkout);
    }],
    ["GET", /^\/v1\/checkouts$/, (m, body, url) => {
      const c = creem.checkouts[url.searchParams.get("checkout_id")];
      return c ? reply(c) : reply({ message: "not found" }, 404);
    }],
    ["GET", /^\/v1\/subscriptions$/, (m, body, url) => {
      const s = creem.subscriptions[url.searchParams.get("subscription_id")];
      return s ? reply(s) : reply({ message: "not found" }, 404);
    }],
    ["POST", /^\/v1\/subscriptions\/([^/]+)\/cancel$/, (m, body) => {
      const s = creem.subscriptions[m[1]];
      if (!s) {
        return reply({ message: "not found" }, 404);
      }
      s.status = body.mode === "immediate" ? "canceled" : "scheduled_cancel";
      s.updated_at = later(s.updated_at);
      return reply(s);
    }]
  ];

  const dispatch = (routes, method, url, body) => {
    for (const [verb, pattern, handler] of routes) {
      const match = verb === method ? pattern.exec(url.pathname) : null;
      if (match) {
        return handler(match, body, url);
      }
    }
    return reply({ message: "no route" }, 404);
  };

  fake.fetchImpl = async (input, init = {}) => {
    const url = new URL(String(input));
    const method = init.method || "GET";
    const headers = new Headers(init.headers || {});
    const body = init.body ? JSON.parse(init.body) : null;
    calls.push({ method, url: url.href, path: url.pathname, headers, body });
    const failed = failure(`${method} ${url.pathname}`) || failure(`${method} ${url.origin}`);
    if (failed) {
      return failed;
    }
    if (url.origin === MP_BASE) {
      if (headers.get("authorization") !== `Bearer ${MP_TOKEN}`) {
        return reply({ message: "unauthorized" }, 401);
      }
      return dispatch(mpRoutes, method, url, body);
    }
    if (url.origin === CREEM_BASE) {
      if (headers.get("x-api-key") !== CREEM_KEY) {
        return reply({ message: "forbidden" }, 403);
      }
      return dispatch(creemRoutes, method, url, body);
    }
    return reply({ message: "unknown host" }, 404);
  };
  return fake;
}

/**
 * A payments harness: env with both rails configured, plus the fake.
 * @param {Object} [overrides] Env overrides.
 * @returns {Promise<{env: Object, ctx: Object, fake: Object}>} Harness.
 */
export async function createPaymentsHarness(overrides) {
  const { env, ctx } = await createHarness({ ...PAYMENT_VARS, ...(overrides || {}) });
  const fake = createPaymentFake();
  return { env, ctx: { ...ctx, fetchImpl: fake.fetchImpl }, fake };
}

/**
 * Call the worker like a browser (or a provider, with `webhook: true`), with
 * an optional request.cf.
 * @param {Object} env Env.
 * @param {string} method Method.
 * @param {string} path Path and query.
 * @param {{body?: unknown, raw?: string, cookie?: string, headers?: Object, cf?: Object, fake?: Object,
 *          now?: number, webhook?: boolean, log?: function, providers?: Object}} [opts] Options.
 * @returns {Promise<{status: number, body: any, headers: Headers}>} Result.
 */
export async function call(env, method, path, opts = {}) {
  const { handleRequest } = await import("../src/index.mjs");
  const headers = new Headers(opts.headers || {});
  if (!opts.webhook) {
    headers.set("Origin", APP_ORIGIN);
    if (method !== "GET") {
      headers.set("X-PyArcana", "1");
    }
  }
  if (opts.cookie) {
    headers.set("Cookie", `__Host-pa_session=${opts.cookie}`);
  }
  let body;
  if (opts.raw !== undefined) {
    body = opts.raw;
  } else if (opts.body !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(opts.body);
  }
  const request = new Request(`${API_BASE}${path}`, { method, headers, body });
  if (opts.cf !== undefined) {
    Object.defineProperty(request, "cf", { value: opts.cf });
  }
  const response = await handleRequest(request, env, {
    now: opts.now === undefined ? NOW : opts.now,
    fetchImpl: opts.fake ? opts.fake.fetchImpl : undefined,
    log: opts.log || (() => {}),
    ...(opts.providers ? { providers: opts.providers } : {})
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null, headers: response.headers };
}

/**
 * The x-signature header Mercado Pago sends for a notification.
 * @param {{dataId?: string, requestId?: string, ts?: number|string, secret?: string}} parts Parts.
 * @returns {string} Header value.
 */
export function mpSignature(parts) {
  const ts = String(parts.ts === undefined ? NOW : parts.ts);
  let manifest = "";
  if (parts.dataId) {
    manifest += `id:${String(parts.dataId).toLowerCase()};`;
  }
  if (parts.requestId) {
    manifest += `request-id:${parts.requestId};`;
  }
  manifest += `ts:${ts};`;
  const v1 = createHmac("sha256", parts.secret || MP_SECRET).update(manifest).digest("hex");
  return `ts=${ts},v1=${v1}`;
}

let requestSeq = 0;

/**
 * Deliver a signed Mercado Pago notification (query data.id + type; the body
 * is a pointer, as in captured deliveries).
 * @param {Object} env Env.
 * @param {Object} fake Payment fake.
 * @param {string} type Topic (payment | subscription_preapproval | subscription_authorized_payment).
 * @param {string} dataId Resource id.
 * @param {{body?: Object, signature?: string, requestId?: string, now?: number, log?: function}} [opts] Options.
 * @returns {Promise<Object>} Result.
 */
export function deliverMp(env, fake, type, dataId, opts = {}) {
  requestSeq += 1;
  const requestId = opts.requestId || `req-${requestSeq}`;
  const body = opts.body || { id: 123000000 + requestSeq, type, action: "updated", data: { id: dataId } };
  const signature = opts.signature || mpSignature({ dataId, requestId, ts: opts.now === undefined ? NOW : opts.now });
  return call(env, "POST", `/api/v1/webhooks/mercadopago?data.id=${encodeURIComponent(dataId)}&type=${type}`, {
    webhook: true,
    fake,
    now: opts.now,
    log: opts.log,
    raw: JSON.stringify(body),
    headers: { "content-type": "application/json", "x-signature": signature, "x-request-id": requestId }
  });
}

/**
 * The creem-signature for a raw body.
 * @param {string} raw Raw body.
 * @param {string} [secret] Secret.
 * @returns {string} Lowercase hex.
 */
export function creemSignature(raw, secret = CREEM_SECRET) {
  return createHmac("sha256", secret).update(raw, "utf8").digest("hex");
}

let eventSeq = 0;

/**
 * Deliver a signed Creem webhook.
 * @param {Object} env Env.
 * @param {Object} fake Payment fake.
 * @param {string} eventType Event type.
 * @param {Object} object Event object.
 * @param {{id?: string, signature?: string, now?: number, log?: function}} [opts] Options.
 * @returns {Promise<Object>} Result with `eventId`.
 */
export async function deliverCreem(env, fake, eventType, object, opts = {}) {
  eventSeq += 1;
  const id = opts.id || `evt_test${eventSeq}`;
  const raw = JSON.stringify({ id, eventType, created_at: (NOW + eventSeq) * 1000, object });
  const res = await call(env, "POST", "/api/v1/webhooks/creem", {
    webhook: true,
    fake,
    now: opts.now,
    log: opts.log,
    raw,
    headers: { "content-type": "application/json", "creem-signature": opts.signature || creemSignature(raw) }
  });
  return { ...res, eventId: id, raw };
}
