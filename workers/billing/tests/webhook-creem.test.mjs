/**
 * POST /v1/webhooks/creem (DESIGN-v2 §4, §7; contract-creem.md).
 *
 * creem-signature is the hex HMAC-SHA256 of the RAW body. Envelope ids are
 * deduplicated for ever (no timestamp in the scheme). One behaviour test
 * per mapping-table row; binding to our checkout (request_id, metadata,
 * product, net price, currency); sub id -> account stored at
 * checkout.completed; events out of order; deleted accounts.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { accessSnapshot } from "../src/entitlement.mjs";
import { NOW, count, seedAccount, sql } from "./fixtures.mjs";
import { CREEM_MONTHLY, CREEM_YEARLY, call, createPaymentsHarness, creemSignature, deliverCreem, iso } from "./payments-fake.mjs";

const DAY = 86400;
const TERMS = { acceptTerms: true, adultOrAuthorized: true };
const SUB = "sub_6pC2lNB6joCRQIZ1aMrTpi";

/**
 * A learner who opened a Creem checkout.
 * @returns {Promise<Object>} {env, fake, who, chk, creemChk}.
 */
async function buyer() {
  const h = await createPaymentsHarness();
  const who = await seedAccount(h.env, { email: "ana@example.test" });
  const res = await call(h.env, "POST", "/api/v1/checkout", { body: { provider: "creem", plan: "pro_monthly", ...TERMS }, cookie: who.token, cf: { country: "US" }, fake: h.fake });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  return { ...h, who, chk: res.body.checkoutId, creemChk: Object.keys(h.fake.creem.checkouts)[0] };
}

/**
 * Metadata Creem copies from the checkout.
 * @param {Object} h Harness.
 * @returns {Object} Metadata.
 */
function meta(h) {
  return { account_id: h.who.account.id, checkout_id: h.chk };
}

/**
 * A checkout.completed object (docs sample shape).
 * @param {Object} h Harness.
 * @param {Object} [patch] Overrides.
 * @returns {Object} Checkout object.
 */
function completed(h, patch = {}) {
  return {
    id: h.creemChk,
    object: "checkout",
    request_id: h.chk,
    order: { id: "ord_1", transaction: "tran_1", customer: "cust_1", product: CREEM_MONTHLY, amount: 799, sub_total: 799, currency: "USD", status: "paid", type: "recurring", created_at: iso(NOW) },
    product: { id: CREEM_MONTHLY, price: 799, currency: "USD", billing_period: "every-month" },
    customer: { id: "cust_1", email: "ana@example.test" },
    subscription: { id: SUB, object: "subscription", product: CREEM_MONTHLY, customer: "cust_1", status: "active", created_at: iso(NOW), updated_at: iso(NOW), metadata: meta(h) },
    status: "completed",
    metadata: meta(h),
    mode: "test",
    ...patch
  };
}

/**
 * A subscription object (webhook shape: product and customer expanded).
 * @param {Object} h Harness.
 * @param {Object} [patch] Overrides.
 * @returns {Object} Subscription object.
 */
function subscription(h, patch = {}) {
  return {
    id: SUB,
    object: "subscription",
    product: { id: CREEM_MONTHLY, price: 799, currency: "USD" },
    customer: { id: "cust_1", email: "ana@example.test" },
    collection_method: "charge_automatically",
    status: "active",
    last_transaction_id: "tran_1",
    last_transaction_date: iso(NOW + 12),
    current_period_start_date: iso(NOW + 8),
    current_period_end_date: iso(NOW + 8 + 31 * DAY),
    created_at: iso(NOW),
    updated_at: iso(NOW + 60),
    metadata: meta(h),
    mode: "test",
    ...patch
  };
}

/**
 * The stored Creem subscription row.
 * @param {Object} h Harness.
 * @returns {Promise<Object|null>} Row.
 */
function subRow(h) {
  return h.env.DB.prepare("SELECT * FROM subscriptions WHERE provider = 'creem' AND provider_ref = ?1").bind(SUB).first();
}

/**
 * The learner's access at a time (read straight from the ledger, so a clock
 * past the session's lifetime still answers).
 * @param {Object} h Harness.
 * @param {number} [now] Clock.
 * @returns {Promise<Object>} Access.
 */
async function access(h, now = NOW) {
  const account = await h.env.DB.prepare("SELECT * FROM accounts WHERE id = ?1").bind(h.who.account.id).first();
  return (await accessSnapshot({ db: h.env.DB, env: h.env, now }, account)).access;
}

test("signature: HMAC of the raw bytes; tampered, missing or unconfigured is refused; the sha256= prefix is tolerated", async () => {
  const h = await buyer();
  const raw = JSON.stringify({ id: "evt_sig", eventType: "subscription.trialing", created_at: NOW * 1000, object: subscription(h) });
  const post = (body, signature) =>
    call(h.env, "POST", "/api/v1/webhooks/creem", { webhook: true, raw: body, headers: signature === null ? {} : { "creem-signature": signature } });
  assert.deepEqual([(await post(raw, "0".repeat(64))).status, (await post(raw, null)).status], [401, 401]);
  const reserialized = JSON.stringify(JSON.parse(raw), null, 1);
  assert.equal((await post(reserialized, creemSignature(raw))).status, 401, "the signature covers the exact bytes");
  assert.equal((await post(raw, creemSignature(raw, "whsec_other"))).status, 401);
  assert.equal((await post(raw, ` sha256=${creemSignature(raw).toUpperCase()} `)).status, 200);
  h.env.CREEM_WEBHOOK_SECRET = "";
  const off = await post(raw, creemSignature(raw));
  assert.deepEqual([off.status, off.body.reason], [503, "creem_not_configured"]);
});

test("row: checkout.completed stores the subscription (sub id -> account) and the first charge from the order; checkout completes", async () => {
  const h = await buyer();
  const res = await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const row = await subRow(h);
  assert.deepEqual([row.account_id, row.status, row.plan, row.amount_minor, row.currency, row.checkout_id, row.first_active_at], [h.who.account.id, "active", "pro_monthly", 799, "USD", h.chk, NOW]);
  const charge = await h.env.DB.prepare("SELECT * FROM charges").first();
  assert.deepEqual([charge.provider_charge_id, charge.status, charge.amount_minor, charge.period_start, charge.period_end], ["tran_1", "approved", 799, NOW, Date.UTC(2027, 1, 15, 8) / 1000]);
  assert.equal((await h.env.DB.prepare("SELECT status FROM checkouts WHERE id = ?1").bind(h.chk).first()).status, "completed");
  assert.equal((await access(h)).isPro, true);
});

test("row: checkout.completed whose order names no transaction stores the subscription only; access waits for subscription.paid", async () => {
  const h = await buyer();
  const object = completed(h);
  delete object.order.transaction;
  await deliverCreem(h.env, h.fake, "checkout.completed", object);
  assert.equal((await subRow(h)).status, "active");
  assert.equal(await count(h.env, "FROM charges"), 0);
  assert.equal((await access(h)).isPro, false);
});

test("row: subscription.paid records the charge with Creem's own period; the same transaction is one row", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  const res = await deliverCreem(h.env, h.fake, "subscription.paid", subscription(h));
  assert.equal(res.status, 200);
  assert.equal(await count(h.env, "FROM charges"), 1);
  const charge = await h.env.DB.prepare("SELECT period_start, period_end FROM charges").first();
  assert.deepEqual([charge.period_start, charge.period_end], [NOW + 8, NOW + 8 + 31 * DAY]);
  await deliverCreem(h.env, h.fake, "subscription.paid", subscription(h, { last_transaction_id: "tran_2", current_period_start_date: iso(NOW + 8 + 31 * DAY), current_period_end_date: iso(NOW + 8 + 61 * DAY), updated_at: iso(NOW + 31 * DAY) }));
  const me = await call(h.env, "GET", "/api/v1/me", { cookie: h.who.token });
  assert.equal(me.body.subscriptions[0].paidThrough, NOW + 8 + 61 * DAY);
});

test("rows: subscription.active -> active; subscription.past_due -> past_due (grace applies)", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  await deliverCreem(h.env, h.fake, "subscription.past_due", subscription(h, { status: "past_due", updated_at: iso(NOW + 100) }));
  assert.equal((await subRow(h)).status, "past_due");
  const end = Date.UTC(2027, 1, 15, 8) / 1000;
  const graced = await access(h, end + DAY);
  assert.deepEqual([graced.isPro, graced.graceUntil], [true, end + 7 * DAY]);
  await deliverCreem(h.env, h.fake, "subscription.active", subscription(h, { status: "active", updated_at: iso(NOW + 200) }));
  assert.equal((await subRow(h)).status, "active");
});

test("row: subscription.scheduled_cancel -> cancel_at_period_end; access runs to the paid end with no grace", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  await deliverCreem(h.env, h.fake, "subscription.scheduled_cancel", subscription(h, { status: "scheduled_cancel", updated_at: iso(NOW + 100) }));
  const row = await subRow(h);
  assert.deepEqual([row.status, row.cancel_at_period_end], ["active", 1]);
  const end = Date.UTC(2027, 1, 15, 8) / 1000;
  assert.equal((await access(h, end - 1)).isPro, true);
  assert.equal((await access(h, end + 1)).isPro, false);
});

test("rows: subscription.canceled and subscription.expired -> canceled", async () => {
  for (const type of ["subscription.canceled", "subscription.expired"]) {
    const h = await buyer();
    await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
    // The docs' expired sample still says status "active": the event type decides.
    await deliverCreem(h.env, h.fake, type, subscription(h, { status: type === "subscription.expired" ? "active" : "canceled", updated_at: iso(NOW + 100) }));
    assert.equal((await subRow(h)).status, "canceled", type);
  }
});

test("row: subscription.trialing is ignored (we never create Creem trials)", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  const res = await deliverCreem(h.env, h.fake, "subscription.trialing", subscription(h, { status: "trialing", updated_at: iso(NOW + 100) }));
  assert.deepEqual([res.status, res.body.ignored], [200, "event_type"]);
  assert.equal((await subRow(h)).status, "active");
});

test("row: refund.created marks the charge refunded and cancels the subscription at Creem (immediate, re-read confirmed)", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  h.fake.creem.subscriptions[SUB] = subscription(h);
  const refund = { id: "ref_1", object: "refund", status: "succeeded", refund_amount: 799, refund_currency: "USD", transaction: { id: "tran_1", amount: 799, amount_paid: 799, currency: "USD", status: "refunded", subscription: SUB, created_at: NOW * 1000 }, subscription: SUB, created_at: (NOW + 2 * DAY) * 1000 };
  const res = await deliverCreem(h.env, h.fake, "refund.created", refund, { now: NOW + 2 * DAY });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal((await h.env.DB.prepare("SELECT refunded_at FROM charges").first()).refunded_at, NOW + 2 * DAY);
  assert.equal((await access(h, NOW + 2 * DAY)).isPro, false);
  const cancel = h.fake.calls.find((c) => c.path === `/v1/subscriptions/${SUB}/cancel`);
  assert.deepEqual(cancel.body, { mode: "immediate" });
  assert.equal((await subRow(h)).status, "canceled");
});

test("a partial Creem refund changes nothing but flags the charge (audit line)", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  const refund = { id: "ref_2", object: "refund", refund_amount: 300, refund_currency: "USD", transaction: { id: "tran_1", amount: 799, amount_paid: 799, currency: "USD" }, subscription: SUB, created_at: NOW * 1000 };
  await deliverCreem(h.env, h.fake, "refund.created", refund);
  const charge = await h.env.DB.prepare("SELECT refunded_at, flag FROM charges").first();
  assert.deepEqual([charge.refunded_at, charge.flag], [null, "partial_refund"]);
  assert.equal((await access(h)).isPro, true);
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'charge.partial_refund'"), 1);
});

test("row: dispute.created marks the charge charged back and cancels; a failed cancel is 502 so Creem retries", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  const dispute = { id: "dis_1", object: "dispute", amount: 799, currency: "USD", transaction: { id: "tran_1", amount: 799, currency: "USD" }, subscription: SUB, created_at: (NOW + DAY) * 1000 };
  const failed = await deliverCreem(h.env, h.fake, "dispute.created", dispute, { id: "evt_dispute", now: NOW + DAY });
  assert.deepEqual([failed.status, failed.body.reason], [502, "cancel_failed"], "Creem has no such subscription yet: the re-read fails");
  assert.equal((await h.env.DB.prepare("SELECT charged_back_at FROM charges").first()).charged_back_at, NOW + DAY);
  h.fake.creem.subscriptions[SUB] = subscription(h);
  await sql(h.env, "DELETE FROM webhook_events WHERE event_id = 'evt_dispute'");
  const again = await deliverCreem(h.env, h.fake, "dispute.created", dispute, { id: "evt_dispute_retry", now: NOW + DAY });
  assert.equal(again.status, 200);
  assert.equal((await subRow(h)).status, "canceled");
  assert.equal(await count(h.env, "FROM subscription_events WHERE kind = 'charge.charged_back'"), 1);
});

test("a delivered envelope id is processed once: a replay is 200 duplicate, also when two deliveries race", async () => {
  const h = await buyer();
  const first = await deliverCreem(h.env, h.fake, "checkout.completed", completed(h), { id: "evt_once" });
  assert.equal(first.status, 200);
  const replay = await call(h.env, "POST", "/api/v1/webhooks/creem", { webhook: true, raw: first.raw, headers: { "creem-signature": creemSignature(first.raw) } });
  assert.deepEqual(replay.body, { ok: true, duplicate: true });
  const h2 = await buyer();
  const raw = JSON.stringify({ id: "evt_race", eventType: "checkout.completed", created_at: NOW * 1000, object: completed(h2) });
  const send = () => call(h2.env, "POST", "/api/v1/webhooks/creem", { webhook: true, raw, headers: { "creem-signature": creemSignature(raw) } });
  const both = await Promise.all([send(), send()]);
  assert.deepEqual(both.map((r) => r.status), [200, 200]);
  assert.equal(await count(h2.env, "FROM subscriptions"), 1);
  assert.equal(await count(h2.env, "FROM subscription_events WHERE kind = 'charge.approved'"), 1);
});

test("binding: product, net price, currency, account and our checkout must all match; otherwise 200 + webhook.unmatched", async () => {
  const cases = [
    ["product_mismatch", (h) => completed(h, { product: { id: CREEM_YEARLY, price: 799, currency: "USD" } })],
    ["amount_mismatch", (h) => completed(h, { product: { id: CREEM_MONTHLY, price: 499, currency: "USD" } })],
    ["amount_mismatch", (h) => completed(h, { product: { id: CREEM_MONTHLY, price: 799, currency: "EUR" } })],
    ["account_mismatch", (h) => completed(h, { metadata: { account_id: `acct_${"B".repeat(22)}`, checkout_id: h.chk } })],
    ["unknown_checkout", (h) => completed(h, { request_id: `chk_${"C".repeat(22)}` })]
  ];
  for (const [reason, build] of cases) {
    const h = await buyer();
    const res = await deliverCreem(h.env, h.fake, "checkout.completed", build(h));
    assert.equal(res.status, 200, reason);
    assert.equal(await count(h.env, "FROM subscriptions"), 0, reason);
    const audit = await h.env.DB.prepare("SELECT detail FROM audit_log WHERE action = 'webhook.unmatched'").first();
    assert.equal(JSON.parse(audit.detail).reason, reason);
  }
});

test("out of order: subscription.paid before checkout.completed binds through the subscription's metadata; an older status is ignored", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "subscription.paid", subscription(h));
  assert.equal((await subRow(h)).account_id, h.who.account.id);
  assert.equal((await access(h, NOW + 10)).isPro, true, "Creem's period starts at NOW + 8");
  await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  assert.equal(await count(h.env, "FROM subscriptions"), 1);
  await deliverCreem(h.env, h.fake, "subscription.past_due", subscription(h, { status: "past_due", updated_at: iso(NOW - 500) }));
  assert.equal((await subRow(h)).status, "active", "a status older than the stored one is ignored");
  const stranger = await buyer();
  await deliverCreem(stranger.env, stranger.fake, "subscription.paid", subscription(stranger, { metadata: {} }));
  assert.equal(await count(stranger.env, "FROM subscriptions"), 0, "no stored sub and no metadata: unmatched");
});

test("deleted account: the subscription is cancelled at Creem and audited for a refund; charges are flagged refund_due", async () => {
  const h = await buyer();
  await sql(h.env, "UPDATE accounts SET deleted_at = ?2 WHERE id = ?1", h.who.account.id, NOW);
  h.fake.creem.subscriptions[SUB] = subscription(h);
  const res = await deliverCreem(h.env, h.fake, "checkout.completed", completed(h));
  assert.equal(res.status, 200);
  assert.equal((await h.env.DB.prepare("SELECT flag FROM charges").first()).flag, "refund_due");
  assert.equal((await subRow(h)).status, "canceled");
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'webhook.deleted_account'"), 1);
});

test("an event type outside the table is acknowledged, marked and ignored; a body that is not an envelope is 400", async () => {
  const h = await buyer();
  const res = await deliverCreem(h.env, h.fake, "customer_credits.exhausted", { id: "x" }, { id: "evt_credits" });
  assert.deepEqual([res.status, res.body.ignored], [200, "event_type"]);
  assert.equal(await count(h.env, "FROM webhook_events WHERE event_id = 'evt_credits'"), 1);
  const raw = JSON.stringify({ hello: "world" });
  const bad = await call(h.env, "POST", "/api/v1/webhooks/creem", { webhook: true, raw, headers: { "creem-signature": creemSignature(raw) } });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_event"]);
});
