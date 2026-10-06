/**
 * POST /v1/me/subscription/refresh, POST /v1/me/subscription/cancel, and
 * DELETE /v1/me through the REAL provider registry (DESIGN-v2 §4).
 *
 * Refresh re-reads the provider for the caller's own open checkouts and
 * live subscriptions (a server-side API read, never a grant on a return
 * URL) and answers the me payload. Cancel calls the provider, RE-READS it,
 * and stores only the confirmed state; any failure is 502 cancel_failed.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, count, seedAccount, sql } from "./fixtures.mjs";
import { CREEM_MONTHLY, call, createPaymentsHarness, iso } from "./payments-fake.mjs";

const DAY = 86400;
const TERMS = { acceptTerms: true, adultOrAuthorized: true };

/**
 * A learner with an opened checkout on a rail.
 * @param {string} provider Provider.
 * @returns {Promise<Object>} Harness.
 */
async function opened(provider) {
  const h = await createPaymentsHarness();
  const who = await seedAccount(h.env, { email: "ana@example.test" });
  const res = await call(h.env, "POST", "/api/v1/checkout", { body: { provider, plan: "pro_monthly", ...TERMS }, cookie: who.token, cf: { country: provider === "creem" ? "US" : "PE" }, fake: h.fake });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const preId = Object.keys(h.fake.mp.preapprovals)[0];
  const creemChk = Object.keys(h.fake.creem.checkouts)[0];
  return { ...h, who, chk: res.body.checkoutId, preId, creemChk };
}

/**
 * MP side: the buyer authorized and paid once.
 * @param {Object} h Harness.
 * @returns {void}
 */
function mpPaid(h) {
  Object.assign(h.fake.mp.preapprovals[h.preId], { status: "authorized", last_modified: iso(NOW + 5) });
  h.fake.mp.authorized["70"] = {
    id: 70,
    preapproval_id: h.preId,
    status: "processed",
    transaction_amount: 19.9,
    currency_id: "PEN",
    debit_date: iso(NOW),
    last_modified: iso(NOW),
    payment: { id: 9070, status: "approved", status_detail: "accredited" }
  };
}

/**
 * Creem side: the checkout completed and the subscription's last transaction is paid.
 * @param {Object} h Harness.
 * @returns {void}
 */
function creemPaid(h) {
  const metadata = { account_id: h.who.account.id, checkout_id: h.chk };
  const product = { id: CREEM_MONTHLY, price: 799, currency: "USD" };
  const subscription = {
    id: "sub_c1",
    object: "subscription",
    product,
    status: "active",
    last_transaction_id: "tran_9",
    last_transaction: { id: "tran_9", amount: 799, currency: "USD", status: "paid", period_start: NOW * 1000, period_end: (NOW + 30 * DAY) * 1000, created_at: NOW * 1000 },
    current_period_start_date: iso(NOW),
    current_period_end_date: iso(NOW + 30 * DAY),
    updated_at: iso(NOW + 1),
    metadata
  };
  h.fake.creem.subscriptions.sub_c1 = subscription;
  Object.assign(h.fake.creem.checkouts[h.creemChk], {
    status: "completed",
    product,
    order: { id: "ord_9", product: CREEM_MONTHLY, amount: 799, currency: "USD", status: "paid", created_at: iso(NOW) },
    subscription: { id: "sub_c1", status: "active", updated_at: iso(NOW) },
    metadata
  });
}

/**
 * POST a subscription route.
 * @param {Object} h Harness.
 * @param {string} path Path after /api/v1/me/subscription/.
 * @param {Object} [body] Body.
 * @param {Object} [opts] {token, now}.
 * @returns {Promise<Object>} Result.
 */
function post(h, path, body = {}, opts = {}) {
  return call(h.env, "POST", `/api/v1/me/subscription/${path}`, { body, cookie: opts.token || h.who.token, fake: h.fake, now: opts.now });
}

test("refresh (MP): a pending preapproval grants nothing; after the buyer pays, the re-read activates and records the charge", async () => {
  const h = await opened("mercadopago");
  const before = await post(h, "refresh");
  assert.equal(before.status, 200);
  assert.equal(before.body.access.isPro, false, "returning from checkout is not proof of payment");
  mpPaid(h);
  const after = await post(h, "refresh");
  assert.equal(after.status, 200, JSON.stringify(after.body));
  assert.deepEqual([after.body.access.isPro, after.body.subscriptions[0].status], [true, "active"]);
  assert.equal(after.body.refresh.ok, true);
  assert.equal(await count(h.env, "FROM charges WHERE provider_charge_id = '9070' AND status = 'approved'"), 1);
  assert.equal(after.body.checkoutPending, false);
});

test("refresh (Creem): a completed checkout is found by the re-read and applied like the webhook", async () => {
  const h = await opened("creem");
  creemPaid(h);
  const res = await post(h, "refresh");
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.deepEqual([res.body.access.isPro, res.body.subscriptions[0].provider, res.body.subscriptions[0].paidThrough], [true, "creem", NOW + 30 * DAY]);
  assert.equal((await h.env.DB.prepare("SELECT status FROM checkouts WHERE id = ?1").bind(h.chk).first()).status, "completed");
});

test("refresh: a provider outage changes nothing and still answers the me payload (refresh.ok false)", async () => {
  const h = await opened("mercadopago");
  mpPaid(h);
  h.fake.fail(`GET /preapproval/${h.preId}`, 503);
  const res = await post(h, "refresh");
  assert.equal(res.status, 200);
  assert.deepEqual([res.body.access.isPro, res.body.refresh.ok], [false, false]);
  assert.equal(await count(h.env, "FROM charges"), 0);
});

test("refresh reads only the caller's own rows, and is limited to 30 per hour", async () => {
  const h = await opened("mercadopago");
  const other = await seedAccount(h.env, { email: "luis@example.test" });
  await sql(h.env, "INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, provider_ref, created_at, status) VALUES ('chk_luis', ?1, 'creem', 'pro_monthly', 799, 'USD', 'ch_luis', ?2, 'open')", other.account.id, NOW);
  await post(h, "refresh");
  assert.ok(!h.fake.calls.some((c) => c.url.includes("ch_luis")), "another account's checkout is never read");
  const statuses = [];
  for (let i = 0; i < 30; i += 1) {
    statuses.push((await post(h, "refresh")).status);
  }
  assert.equal(statuses.filter((s) => s === 200).length, 29);
  assert.equal(statuses[29], 429);
});

test("cancel (MP): PUT cancelled, re-read, stored canceled; access runs to the paid end with no grace; audited", async () => {
  const h = await opened("mercadopago");
  mpPaid(h);
  await post(h, "refresh");
  const sub = await h.env.DB.prepare("SELECT * FROM subscriptions").first();
  const res = await post(h, "cancel", { subscriptionId: sub.id });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const put = h.fake.calls.find((c) => c.method === "PUT");
  assert.deepEqual(put.body, { status: "cancelled" });
  assert.ok(h.fake.calls.indexOf(put) < h.fake.calls.length - 1, "a re-read follows the write");
  assert.equal(res.body.subscriptions[0].status, "canceled");
  const end = Date.UTC(2027, 1, 15, 8) / 1000;
  assert.deepEqual([res.body.access.isPro, res.body.access.accessEnd, res.body.access.graceUntil], [true, end, null]);
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'subscription.cancel' AND target_id = ?1", sub.id), 1);
  assert.equal(await count(h.env, "FROM subscription_events WHERE subscription_id = ?1 AND kind = 'status'", sub.id), 3);
});

test("cancel (Creem): scheduled at period end; the row keeps running with cancel_at_period_end", async () => {
  const h = await opened("creem");
  creemPaid(h);
  await post(h, "refresh");
  const sub = await h.env.DB.prepare("SELECT * FROM subscriptions").first();
  const res = await post(h, "cancel", { subscriptionId: sub.id });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.deepEqual(h.fake.calls.find((c) => c.path === "/v1/subscriptions/sub_c1/cancel").body, { mode: "scheduled" });
  assert.deepEqual([res.body.subscriptions[0].status, res.body.subscriptions[0].cancelAtPeriodEnd], ["active", true]);
  assert.equal(res.body.access.graceUntil, null);
});

test("cancel: an already-cancelled preapproval counts as success; a failure is 502 cancel_failed with nothing stored", async () => {
  const done = await opened("mercadopago");
  done.fake.mp.preapprovals[done.preId].status = "cancelled";
  const sub = await done.env.DB.prepare("SELECT * FROM subscriptions").first();
  const ok = await post(done, "cancel", { subscriptionId: sub.id });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.subscriptions[0].status, "canceled");
  const h = await opened("mercadopago");
  const live = await h.env.DB.prepare("SELECT * FROM subscriptions").first();
  h.fake.fail(`PUT /preapproval/${h.preId}`, 500);
  const failed = await post(h, "cancel", { subscriptionId: live.id });
  assert.deepEqual([failed.status, failed.body.reason], [502, "cancel_failed"]);
  assert.equal((await h.env.DB.prepare("SELECT status FROM subscriptions").first()).status, "pending");
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'subscription.cancel_failed'"), 1);
});

test("cancel: only the caller's own subscription; a missing id is 400; an already-cancelled row answers without a provider call", async () => {
  const h = await opened("mercadopago");
  const sub = await h.env.DB.prepare("SELECT * FROM subscriptions").first();
  const other = await seedAccount(h.env, { email: "luis@example.test" });
  const foreign = await post(h, "cancel", { subscriptionId: sub.id }, { token: other.token });
  assert.deepEqual([foreign.status, foreign.body.reason], [404, "not_found"]);
  assert.deepEqual((await post(h, "cancel", {})).body.reason, "bad_subscription");
  await sql(h.env, "UPDATE subscriptions SET status = 'canceled', cancel_at_period_end = 1");
  const calls = h.fake.calls.length;
  const again = await post(h, "cancel", { subscriptionId: sub.id });
  assert.equal(again.status, 200);
  assert.equal(h.fake.calls.length, calls);
});

test("DELETE /v1/me uses the real registry: a live MP subscription is cancelled at MP (re-read) before the account is erased", async () => {
  const h = await opened("mercadopago");
  mpPaid(h);
  await post(h, "refresh");
  const res = await call(h.env, "DELETE", "/api/v1/me", { body: { confirm: "DELETE" }, cookie: h.who.token, fake: h.fake });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.ok(h.fake.calls.some((c) => c.method === "PUT" && c.path === `/preapproval/${h.preId}`));
  assert.equal((await h.env.DB.prepare("SELECT status FROM subscriptions").first()).status, "canceled");
  assert.notEqual((await h.env.DB.prepare("SELECT deleted_at FROM accounts WHERE id = ?1").bind(h.who.account.id).first()).deleted_at, null);
});

test("DELETE /v1/me with the rail unconfigured (or the provider down) is 502 cancel_failed and nothing is deleted", async () => {
  const h = await opened("mercadopago");
  mpPaid(h);
  await post(h, "refresh");
  h.fake.fail(`PUT /preapproval/${h.preId}`, 500);
  const down = await call(h.env, "DELETE", "/api/v1/me", { body: { confirm: "DELETE" }, cookie: h.who.token, fake: h.fake });
  assert.deepEqual([down.status, down.body.reason], [502, "cancel_failed"]);
  h.env.MP_ACCESS_TOKEN = "";
  h.fake.clearFail();
  const off = await call(h.env, "DELETE", "/api/v1/me", { body: { confirm: "DELETE" }, cookie: h.who.token, fake: h.fake });
  assert.deepEqual([off.status, off.body.reason], [502, "cancel_failed"]);
  assert.equal((await h.env.DB.prepare("SELECT deleted_at FROM accounts WHERE id = ?1").bind(h.who.account.id).first()).deleted_at, null);
});
