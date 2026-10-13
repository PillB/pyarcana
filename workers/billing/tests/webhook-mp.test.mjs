/**
 * POST /v1/webhooks/mercadopago (DESIGN-v2 §4, §6; contract-mercadopago.md).
 *
 * The notification is a signed POINTER: data.id from the query only, the
 * x-signature manifest over it, then a fresh API read decides everything.
 * One behaviour test per mapping-table row, plus the four Vocal defects
 * (rejected/pending never entitle; refund/chargeback mark the charge and
 * cancel; pending preapproval never entitles; data.id from the query),
 * binding, deleted accounts, double subscriptions, ordering, idempotency
 * and the "kill before the batch" retry.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, count, seedAccount, sql } from "./fixtures.mjs";
import { MP_SECRET, call, createPaymentsHarness, deliverMp, iso, mpSignature } from "./payments-fake.mjs";

const DAY = 86400;
const TERMS = { acceptTerms: true, adultOrAuthorized: true };

/**
 * A learner who went through the Mercado Pago checkout (pending preapproval).
 * @param {Object} [opts] {plan}.
 * @returns {Promise<Object>} {env, fake, who, chk, preId, pre}.
 */
async function subscriber(opts = {}) {
  const h = await createPaymentsHarness();
  const who = await seedAccount(h.env, { email: "ana@example.test" });
  const res = await call(h.env, "POST", "/api/v1/checkout", { body: { provider: "mercadopago", plan: opts.plan || "pro_monthly", ...TERMS }, cookie: who.token, cf: { country: "PE" }, fake: h.fake });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const preId = Object.keys(h.fake.mp.preapprovals)[0];
  return { ...h, who, chk: res.body.checkoutId, preId, pre: h.fake.mp.preapprovals[preId] };
}

/**
 * Put an authorized payment (and its payment) into the fake.
 * @param {Object} h Harness.
 * @param {{id: string, paymentId?: string|null, status?: string, amount?: number, at?: number, currency?: string}} a Spec.
 * @returns {void}
 */
function authorized(h, a) {
  const at = a.at === undefined ? NOW : a.at;
  h.fake.mp.authorized[a.id] = {
    id: Number(a.id),
    preapproval_id: a.preId || h.preId,
    type: "recurring",
    status: "processed",
    transaction_amount: a.amount === undefined ? 19.9 : a.amount,
    currency_id: a.currency || "PEN",
    date_created: iso(at),
    last_modified: iso(at),
    debit_date: iso(at),
    ...(a.paymentId === null ? {} : { payment: { id: Number(a.paymentId || `9${a.id}`), status: a.status || "approved", status_detail: "accredited" } })
  };
}

/**
 * Put a payment into the fake.
 * @param {Object} h Harness.
 * @param {Object} p {id, status, amount?, at?, link?: "metadata"|"poi"|"none", detail?, refunded?}.
 * @returns {void}
 */
function payment(h, p) {
  const at = p.at === undefined ? NOW : p.at;
  const link = p.link || "metadata";
  h.fake.mp.payments[p.id] = {
    id: Number(p.id),
    status: p.status,
    status_detail: p.detail || (p.status === "approved" ? "accredited" : p.status),
    transaction_amount: p.amount === undefined ? 19.9 : p.amount,
    transaction_amount_refunded: p.refunded || 0,
    currency_id: "PEN",
    date_approved: p.status === "rejected" ? null : iso(at),
    date_last_updated: iso(p.updatedAt || at),
    operation_type: "recurring_payment",
    ...(link === "metadata" ? { metadata: { preapproval_id: h.preId } } : {}),
    ...(link === "poi" ? { point_of_interaction: { type: "SUBSCRIPTIONS", transaction_data: { subscription_id: h.preId } } } : {})
  };
}

/**
 * The learner's me payload.
 * @param {Object} h Harness.
 * @param {number} [now] Clock.
 * @returns {Promise<Object>} Payload.
 */
async function me(h, now) {
  return (await call(h.env, "GET", "/api/v1/me", { cookie: h.who.token, now })).body;
}

/**
 * The subscription row of the harness's preapproval.
 * @param {Object} h Harness.
 * @returns {Promise<Object>} Row.
 */
function subRow(h) {
  return h.env.DB.prepare("SELECT * FROM subscriptions WHERE provider_ref = ?1").bind(h.preId).first();
}

/**
 * Authorize the preapproval at MP and notify.
 * @param {Object} h Harness.
 * @returns {Promise<Object>} Delivery result.
 */
function authorize(h) {
  h.pre.status = "authorized";
  h.pre.last_modified = iso(NOW + 5);
  return deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
}

test("signature: a valid x-signature is accepted; wrong secret, stale ts, no header or no secret configured are refused before any read", async () => {
  const h = await subscriber();
  const reads = () => h.fake.calls.filter((c) => c.method === "GET").length;
  const before = reads();
  const bad = [
    [{ signature: mpSignature({ dataId: h.preId, requestId: "r1", secret: "wrong" }), requestId: "r1" }, 401],
    [{ signature: mpSignature({ dataId: h.preId, requestId: "r2", ts: NOW - 400 }), requestId: "r2" }, 401],
    [{ signature: "ts=1800000000", requestId: "r3" }, 401],
    [{ signature: `ts=${NOW},v1=${"0".repeat(64)}`, requestId: "r4" }, 401]
  ];
  for (const [opts, status] of bad) {
    const res = await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId, opts);
    assert.deepEqual([res.status, res.body.reason], [status, "bad_signature"], opts.signature);
  }
  assert.equal(reads(), before, "no API read before the signature verifies");
  const ms = await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId, { signature: mpSignature({ dataId: h.preId, requestId: "r5", ts: NOW * 1000 }), requestId: "r5" });
  assert.equal(ms.status, 200, "ts in milliseconds is accepted");
  h.env.MP_WEBHOOK_SECRET = "";
  const off = await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
  assert.deepEqual([off.status, off.body.reason], [503, "mercadopago_not_configured"]);
});

test("Vocal defect 4: data.id comes from the QUERY only; a differing body data.id is 400, a missing query id is 400", async () => {
  const h = await subscriber();
  const other = "ffffffffffffffffffffffffffffffff";
  const mismatch = await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId, { body: { id: 1, type: "subscription_preapproval", data: { id: other } } });
  assert.deepEqual([mismatch.status, mismatch.body.reason], [400, "data_id_mismatch"]);
  const raw = JSON.stringify({ id: 1, data: { id: h.preId } });
  const noQuery = await call(h.env, "POST", "/api/v1/webhooks/mercadopago?type=subscription_preapproval", {
    webhook: true,
    raw,
    fake: h.fake,
    headers: { "x-signature": mpSignature({ requestId: "q1" }), "x-request-id": "q1" }
  });
  assert.deepEqual([noQuery.status, noQuery.body.reason], [400, "missing_data_id"]);
  const signedForBody = await call(h.env, "POST", `/api/v1/webhooks/mercadopago?data.id=${other}&type=subscription_preapproval`, {
    webhook: true,
    raw: JSON.stringify({ id: 1 }),
    fake: h.fake,
    headers: { "x-signature": mpSignature({ dataId: h.preId, requestId: "q2" }), "x-request-id": "q2" }
  });
  assert.equal(signedForBody.status, 401, "the manifest is built from the query id");
});

test("row: preapproval pending -> subscription pending, which never entitles (Vocal defect 3)", async () => {
  const h = await subscriber();
  const res = await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
  assert.equal(res.status, 200);
  assert.equal((await subRow(h)).status, "pending");
  const body = await me(h);
  assert.equal(body.access.isPro, false);
  assert.equal(body.access.graceUntil, null);
});

test("row: authorized -> active; the checkout completes; first_active_at waits for the first approved charge", async () => {
  const h = await subscriber();
  assert.equal((await authorize(h)).status, 200);
  const row = await subRow(h);
  assert.deepEqual([row.status, row.first_active_at, row.provider_updated_at], ["active", null, NOW + 5]);
  assert.equal((await h.env.DB.prepare("SELECT status FROM checkouts WHERE id = ?1").bind(h.chk).first()).status, "completed");
  assert.equal((await me(h)).access.isPro, false, "an authorization without a charge grants nothing");
  const events = (await h.env.DB.prepare("SELECT kind, detail FROM subscription_events WHERE subscription_id = ?1 ORDER BY id").bind(row.id).all()).results;
  assert.deepEqual(events.map((e) => [e.kind, JSON.parse(e.detail).to]), [["status", "pending"], ["status", "active"]]);
});

test("rows: paused -> past_due; cancelled -> canceled (terminal)", async () => {
  const h = await subscriber();
  await authorize(h);
  h.pre.status = "paused";
  h.pre.last_modified = iso(NOW + 10);
  await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
  assert.equal((await subRow(h)).status, "past_due");
  h.pre.status = "cancelled";
  h.pre.last_modified = iso(NOW + 20);
  await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
  assert.equal((await subRow(h)).status, "canceled");
  h.pre.status = "authorized";
  h.pre.last_modified = iso(NOW + 30);
  await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
  assert.equal((await subRow(h)).status, "canceled", "canceled never comes back");
});

test("row: payment approved -> charge approved for one calendar month; access with grace while renewing; first_active_at set", async () => {
  const h = await subscriber();
  await authorize(h);
  authorized(h, { id: "7020382600", paymentId: "119776536072" });
  const res = await deliverMp(h.env, h.fake, "subscription_authorized_payment", "7020382600");
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const charge = await h.env.DB.prepare("SELECT * FROM charges").first();
  const end = Date.UTC(2027, 1, 15, 8, 0, 0) / 1000;
  assert.deepEqual(
    [charge.provider_charge_id, charge.status, charge.amount_minor, charge.currency, charge.approved_at, charge.period_start, charge.period_end],
    ["119776536072", "approved", 1990, "PEN", NOW, NOW, end]
  );
  assert.equal((await subRow(h)).first_active_at, NOW);
  const body = await me(h);
  assert.deepEqual([body.access.isPro, body.access.source, body.access.accessEnd], [true, "paid", end + 7 * DAY]);
  assert.equal(body.subscriptions[0].paidThrough, end);
});

test("one collection, two notifications: the payment and the authorized payment land on ONE ledger row (no double extension)", async () => {
  const h = await subscriber();
  await authorize(h);
  authorized(h, { id: "7020382600", paymentId: "119776536072" });
  payment(h, { id: "119776536072", status: "approved" });
  await deliverMp(h.env, h.fake, "subscription_authorized_payment", "7020382600");
  await deliverMp(h.env, h.fake, "payment", "119776536072");
  await deliverMp(h.env, h.fake, "payment", "119776536072");
  assert.equal(await count(h.env, "FROM charges"), 1);
  assert.equal(await count(h.env, "FROM subscription_events WHERE kind = 'charge.approved'"), 1, "a duplicate re-applies nothing");
});

test("row (Vocal defect 1): rejected, pending, in_process and cancelled payments are stored with that status and never entitle", async () => {
  for (const status of ["rejected", "pending", "in_process", "cancelled"]) {
    const h = await subscriber();
    await authorize(h);
    payment(h, { id: "555", status });
    const res = await deliverMp(h.env, h.fake, "payment", "555");
    assert.equal(res.status, 200);
    const charge = await h.env.DB.prepare("SELECT status, period_start FROM charges").first();
    assert.deepEqual([charge.status, charge.period_start], [status, null], status);
    const body = await me(h);
    assert.deepEqual([body.access.isPro, body.access.graceUntil], [false, null], `${status} grants nothing, not even grace`);
    assert.equal((await subRow(h)).first_active_at, null);
  }
});

test("row (Vocal defect 2): a full refund sets refunded_at, ends that paid interval, and cancels the preapproval (re-read confirmed)", async () => {
  const h = await subscriber();
  await authorize(h);
  payment(h, { id: "777", status: "approved" });
  await deliverMp(h.env, h.fake, "payment", "777");
  assert.equal((await me(h)).access.isPro, true);
  payment(h, { id: "777", status: "refunded", updatedAt: NOW + 3 * DAY });
  const res = await deliverMp(h.env, h.fake, "payment", "777", { now: NOW + 3 * DAY });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const charge = await h.env.DB.prepare("SELECT status, refunded_at FROM charges").first();
  assert.deepEqual([charge.status, charge.refunded_at], ["approved", NOW + 3 * DAY]);
  assert.equal((await me(h, NOW + 3 * DAY)).access.isPro, false, "no grace after a refunded current charge");
  assert.ok(h.fake.calls.some((c) => c.method === "PUT" && c.body.status === "cancelled"), "the preapproval is cancelled at MP");
  assert.equal((await subRow(h)).status, "canceled");
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'subscription.cancel_on_reversal'"), 1);
});

test("row: charged_back sets charged_back_at and cancels; a failed cancel answers 502 so MP redelivers, and the retry cancels", async () => {
  const h = await subscriber();
  await authorize(h);
  payment(h, { id: "888", status: "approved" });
  await deliverMp(h.env, h.fake, "payment", "888");
  payment(h, { id: "888", status: "charged_back", updatedAt: NOW + DAY });
  h.fake.fail(`PUT /preapproval/${h.preId}`, 500);
  const first = await deliverMp(h.env, h.fake, "payment", "888", { now: NOW + DAY });
  assert.deepEqual([first.status, first.body.reason], [502, "cancel_failed"]);
  assert.equal((await h.env.DB.prepare("SELECT charged_back_at FROM charges").first()).charged_back_at, NOW + DAY, "the chargeback itself is stored");
  assert.equal((await me(h, NOW + DAY)).access.isPro, false);
  h.fake.clearFail();
  const retry = await deliverMp(h.env, h.fake, "payment", "888", { now: NOW + DAY });
  assert.equal(retry.status, 200);
  assert.equal((await subRow(h)).status, "canceled");
  assert.equal(await count(h.env, "FROM subscription_events WHERE kind = 'charge.charged_back'"), 1);
});

test("row: in_mediation keeps entitling, flags the charge and writes an audit line", async () => {
  const h = await subscriber();
  await authorize(h);
  payment(h, { id: "901", status: "approved" });
  await deliverMp(h.env, h.fake, "payment", "901");
  payment(h, { id: "901", status: "in_mediation" });
  await deliverMp(h.env, h.fake, "payment", "901");
  const charge = await h.env.DB.prepare("SELECT status, flag FROM charges").first();
  assert.deepEqual([charge.status, charge.flag], ["approved", "in_mediation"]);
  assert.equal((await me(h)).access.isPro, true);
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'charge.in_mediation'"), 1);
  assert.equal((await subRow(h)).status, "active", "a dispute in progress cancels nothing");
});

test("row: a partial refund (status stays approved) changes nothing but writes an audit line", async () => {
  const h = await subscriber();
  await authorize(h);
  payment(h, { id: "902", status: "approved" });
  await deliverMp(h.env, h.fake, "payment", "902");
  payment(h, { id: "902", status: "approved", detail: "partially_refunded", refunded: 5 });
  await deliverMp(h.env, h.fake, "payment", "902");
  const charge = await h.env.DB.prepare("SELECT refunded_at, flag FROM charges").first();
  assert.deepEqual([charge.refunded_at, charge.flag], [null, "partial_refund"]);
  assert.equal((await me(h)).access.isPro, true);
  assert.equal((await subRow(h)).status, "active");
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'charge.partial_refund_seen'"), 1);
});

test("row: payment -> subscription link falls back to metadata.preapproval_id, then point_of_interaction; none is unmatched", async () => {
  for (const [link, linked] of [["metadata", true], ["poi", true], ["none", false]]) {
    const h = await subscriber();
    await authorize(h);
    payment(h, { id: "1001", status: "approved", link });
    const res = await deliverMp(h.env, h.fake, "payment", "1001");
    assert.equal(res.status, 200);
    assert.equal(await count(h.env, "FROM charges"), linked ? 1 : 0, link);
    assert.equal(await count(h.env, "FROM audit_log WHERE action = 'webhook.unmatched'"), linked ? 0 : 1, link);
  }
});

test("binding: a preapproval is bound through its external_reference to OUR checkout with the same terms, or ignored", async () => {
  const h = await subscriber();
  await sql(h.env, "DELETE FROM subscriptions");
  h.pre.status = "authorized";
  const bound = await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
  assert.equal(bound.status, 200);
  assert.equal((await subRow(h)).account_id, h.who.account.id, "re-bound from the external_reference");
  const cases = [
    ["foreign_reference", (p) => Object.assign(p, { external_reference: "lic_7f3a9c" })],
    ["unknown_checkout", (p) => Object.assign(p, { external_reference: `pyarcana:${h.who.account.id}:chk_${"A".repeat(22)}` })],
    ["amount_mismatch", (p) => Object.assign(p, { auto_recurring: { ...p.auto_recurring, transaction_amount: 9.9 } })],
    ["currency_mismatch", (p) => Object.assign(p, { auto_recurring: { ...p.auto_recurring, currency_id: "USD" } })],
    ["plan_mismatch", (p) => Object.assign(p, { auto_recurring: { ...p.auto_recurring, frequency: 12 } })]
  ];
  for (const [reason, mutate] of cases) {
    const x = await subscriber();
    await sql(x.env, "DELETE FROM subscriptions");
    mutate(x.pre);
    const res = await deliverMp(x.env, x.fake, "subscription_preapproval", x.preId);
    assert.equal(res.status, 200, reason);
    assert.equal(await count(x.env, "FROM subscriptions"), 0, reason);
    const audit = await x.env.DB.prepare("SELECT detail FROM audit_log WHERE action = 'webhook.unmatched'").first();
    assert.equal(JSON.parse(audit.detail).reason, reason);
    assert.ok(!audit.detail.includes("@"), "no email in the audit line");
  }
});

test("a charge whose amount or currency differs from the subscription is ignored with an audit line", async () => {
  const h = await subscriber();
  await authorize(h);
  authorized(h, { id: "31", amount: 1.0 });
  await deliverMp(h.env, h.fake, "subscription_authorized_payment", "31");
  authorized(h, { id: "32", currency: "USD" });
  await deliverMp(h.env, h.fake, "subscription_authorized_payment", "32");
  assert.equal(await count(h.env, "FROM charges"), 0);
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'webhook.unmatched'"), 2);
});

test("state and marker land together after the read; a failed read writes nothing and answers 502 (MP retries)", async () => {
  const h = await subscriber();
  h.fake.fail(`GET /preapproval/${h.preId}`, 500);
  const failed = await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId, { requestId: "req-fail" });
  assert.deepEqual([failed.status, failed.body.reason], [502, "provider_unavailable"]);
  assert.equal(await count(h.env, "FROM webhook_events"), 0);
  h.fake.clearFail();
  await authorize(h);
  assert.equal(await count(h.env, "FROM webhook_events WHERE provider = 'mercadopago'"), 1);
});

test("killed after the provider read and before the batch: nothing is written, and the redelivery applies it once", async () => {
  const h = await subscriber();
  await authorize(h);
  payment(h, { id: "2001", status: "approved" });
  const original = h.env.DB.batch.bind(h.env.DB);
  let killed = false;
  h.env.DB.batch = async (statements) => {
    if (!killed && statements.some((s) => /INSERT INTO charges/.test(s.sql || ""))) {
      killed = true;
      throw new Error("isolate killed");
    }
    return original(statements);
  };
  const first = await deliverMp(h.env, h.fake, "payment", "2001");
  assert.equal(first.status, 500);
  assert.equal(await count(h.env, "FROM charges"), 0);
  assert.equal(await count(h.env, "FROM webhook_events WHERE event_id LIKE 'payment:%'"), 0, "no marker without the state");
  const retry = await deliverMp(h.env, h.fake, "payment", "2001");
  assert.equal(retry.status, 200);
  assert.equal(await count(h.env, "FROM charges WHERE status = 'approved'"), 1);
  assert.equal((await me(h)).access.isPro, true);
});

test("deleted account: a later charge never entitles; it is flagged refund_due, the preapproval is cancelled and audited", async () => {
  const h = await subscriber();
  await authorize(h);
  await sql(h.env, "UPDATE accounts SET deleted_at = ?2, email = NULL, email_normalized = NULL WHERE id = ?1", h.who.account.id, NOW);
  payment(h, { id: "3001", status: "approved" });
  const res = await deliverMp(h.env, h.fake, "payment", "3001");
  assert.equal(res.status, 200);
  assert.equal((await h.env.DB.prepare("SELECT flag FROM charges").first()).flag, "refund_due");
  assert.equal((await subRow(h)).status, "canceled");
  const audit = await h.env.DB.prepare("SELECT detail FROM audit_log WHERE action = 'webhook.deleted_account'").first();
  assert.equal(JSON.parse(audit.detail).refundDue, true);
});

test("double subscription: a second renewing subscription on one account is audited, not auto-cancelled", async () => {
  const h = await subscriber();
  await sql(
    h.env,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, created_at, updated_at)
     VALUES ('sub_creem', ?1, 'creem', 'sub_c1', 'pro_monthly', 799, 'USD', 'active', ?2, ?2)`,
    h.who.account.id,
    NOW - DAY
  );
  await authorize(h);
  const audit = await h.env.DB.prepare("SELECT detail FROM audit_log WHERE action = 'double_subscription'").first();
  assert.deepEqual(JSON.parse(audit.detail).others, ["sub_creem"]);
  assert.equal((await subRow(h)).status, "active");
  assert.equal(h.fake.calls.filter((c) => c.method === "PUT").length, 0);
});

test("ordering: a preapproval read older than the stored one changes no status", async () => {
  const h = await subscriber();
  await authorize(h);
  h.pre.status = "paused";
  h.pre.last_modified = iso(NOW - 100);
  await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
  assert.equal((await subRow(h)).status, "active");
});

test("a renewal approved within grace after the period end is anchored to it (no drift); a later one starts at approval", async () => {
  const h = await subscriber();
  await authorize(h);
  authorized(h, { id: "41", at: NOW });
  await deliverMp(h.env, h.fake, "subscription_authorized_payment", "41");
  const firstEnd = Date.UTC(2027, 1, 15, 8) / 1000;
  authorized(h, { id: "42", at: firstEnd + 3 * DAY });
  await deliverMp(h.env, h.fake, "subscription_authorized_payment", "42", { now: firstEnd + 3 * DAY });
  const second = await h.env.DB.prepare("SELECT period_start, period_end FROM charges WHERE provider_charge_id = '942'").first();
  assert.deepEqual([second.period_start, second.period_end], [firstEnd, Date.UTC(2027, 2, 15, 8) / 1000]);
  const secondEnd = second.period_end;
  const late = secondEnd + 20 * DAY;
  authorized(h, { id: "43", at: late });
  await deliverMp(h.env, h.fake, "subscription_authorized_payment", "43", { now: late });
  const third = await h.env.DB.prepare("SELECT period_start FROM charges WHERE provider_charge_id = '943'").first();
  assert.equal(third.period_start, late);
});

test("an authorized payment with no payment yet records nothing; an unknown topic is acknowledged and ignored", async () => {
  const h = await subscriber();
  await authorize(h);
  authorized(h, { id: "51", paymentId: null });
  assert.equal((await deliverMp(h.env, h.fake, "subscription_authorized_payment", "51")).status, 200);
  assert.equal(await count(h.env, "FROM charges"), 0);
  const other = await deliverMp(h.env, h.fake, "merchant_order", "123");
  assert.deepEqual([other.status, other.body.ignored], [200, "topic"]);
});

test("webhooks carry no CORS, need no X-PyArcana, and refuse a body over 1 MiB", async () => {
  const h = await subscriber();
  const res = await deliverMp(h.env, h.fake, "subscription_preapproval", h.preId);
  assert.equal(res.headers.get("access-control-allow-origin"), null);
  const big = await call(h.env, "POST", `/api/v1/webhooks/mercadopago?data.id=${h.preId}&type=payment`, {
    webhook: true,
    raw: "x".repeat(1024 * 1024 + 1),
    headers: { "x-signature": mpSignature({ dataId: h.preId }), "x-request-id": "big" }
  });
  assert.equal(big.status, 413);
  assert.ok(MP_SECRET);
});
