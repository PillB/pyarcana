/**
 * Optimistic lock on the subscription state machine (ledger.mjs versionGuard, schema MIGRATION_11).
 *
 * Correct behaviour: changes for one subscription that race apply as if one after the other.
 * `canceled` stays terminal, provider_updated_at never moves backwards, and the status events
 * form one chain (each `from` is the previous `to`).
 * Defect guarded: applyChange read, awaited and wrote blind, so a cancel and an older past_due
 * racing left the row past_due, its provider time moved from +300 to +200, and two events both
 * said `from: active` (reproduced on main 7854caa3 before the fix). Mutation that turns this
 * file red: make subscriptionStatements start from `[]` instead of `[versionGuard(ctx, row)]`.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { LOCK_ATTEMPTS, applyChange, lostLock, versionGuard } from "../src/ledger.mjs";
import { NOW, count, seedAccount } from "./fixtures.mjs";
import { CREEM_MONTHLY, call, createPaymentsHarness, deliverCreem, iso } from "./payments-fake.mjs";

const DAY = 86400;
const SUB = "sub_6pC2lNB6joCRQIZ1aMrTpi";
const TERMS = { acceptTerms: true, adultOrAuthorized: true };

/**
 * A learner with an open Creem checkout.
 * @returns {Promise<Object>} Harness plus who and chk.
 */
async function buyer() {
  const h = await createPaymentsHarness();
  const who = await seedAccount(h.env, { email: "ana@example.test" });
  const res = await call(h.env, "POST", "/api/v1/checkout", { body: { provider: "creem", plan: "pro_monthly", ...TERMS }, cookie: who.token, cf: { country: "US" }, fake: h.fake });
  assert.equal(res.status, 200, `checkout setup failed: ${JSON.stringify(res.body)}`);
  return { ...h, who, chk: res.body.checkoutId };
}

/**
 * A Creem subscription object (webhook shape).
 * @param {Object} h Harness.
 * @param {Object} [patch] Overrides.
 * @returns {Object} Subscription.
 */
function creemSub(h, patch = {}) {
  return {
    id: SUB,
    object: "subscription",
    product: { id: CREEM_MONTHLY, price: 799, currency: "USD" },
    customer: { id: "cust_1" },
    status: "active",
    last_transaction_id: "tran_1",
    last_transaction_date: iso(NOW + 12),
    current_period_start_date: iso(NOW + 8),
    current_period_end_date: iso(NOW + 8 + 31 * DAY),
    created_at: iso(NOW),
    updated_at: iso(NOW + 60),
    metadata: { account_id: h.who.account.id, checkout_id: h.chk },
    mode: "test",
    ...patch
  };
}

/**
 * The stored row and its status events, oldest first.
 * @param {Object} h Harness.
 * @returns {Promise<{row: Object, chain: Object[]}>} State.
 */
async function state(h) {
  const row = await h.env.DB.prepare("SELECT status, provider_updated_at, cancel_at_period_end, version FROM subscriptions").first();
  const events = await h.env.DB.prepare("SELECT detail FROM subscription_events WHERE kind = 'status' ORDER BY id").all();
  return { row, chain: events.results.map((e) => JSON.parse(e.detail)) };
}

/**
 * Assert the status events form one chain ending at the stored status.
 * @param {{row: Object, chain: Object[]}} s State.
 * @param {string} label Case.
 */
function assertChain(s, label) {
  for (let i = 1; i < s.chain.length; i += 1) {
    assert.equal(
      s.chain[i].from,
      s.chain[i - 1].to,
      `${label}: status event ${i} says from=${s.chain[i].from} but the previous event moved to ${s.chain[i - 1].to}; two writers applied from one read (lost update). Chain: ${JSON.stringify(s.chain)}`
    );
  }
  assert.equal(s.chain.at(-1).to, s.row.status, `${label}: the last status event (${s.chain.at(-1).to}) is not the stored status (${s.row.status})`);
}

for (const order of ["cancel first", "past_due first"]) {
  test(`racing webhooks (${order}): a cancel is never undone by an older past_due, and provider time never goes back`, async () => {
    const h = await buyer();
    await deliverCreem(h.env, h.fake, "subscription.paid", creemSub(h));
    const cancel = () => deliverCreem(h.env, h.fake, "subscription.canceled", creemSub(h, { status: "canceled", updated_at: iso(NOW + 300) }), { id: "evt_cancel" });
    const pastDue = () => deliverCreem(h.env, h.fake, "subscription.past_due", creemSub(h, { status: "past_due", updated_at: iso(NOW + 200) }), { id: "evt_past_due" });
    const replies = await Promise.all(order === "cancel first" ? [cancel(), pastDue()] : [pastDue(), cancel()]);
    assert.deepEqual(replies.map((r) => r.status), [200, 200], `both deliveries must be accepted: ${JSON.stringify(replies.map((r) => r.body))}`);
    const s = await state(h);
    assert.equal(s.row.status, "canceled", `expected canceled (terminal, and the newer fact), got ${s.row.status}: a racing older write resurrected the subscription`);
    assert.equal(s.row.provider_updated_at, NOW + 300, `provider_updated_at moved back to ${s.row.provider_updated_at - NOW}s; expected +300`);
    assertChain(s, order);
  });
}

test("two first sights racing (different events) create one subscription and both deliveries succeed", async () => {
  const h = await buyer();
  const replies = await Promise.all([
    deliverCreem(h.env, h.fake, "subscription.paid", creemSub(h), { id: "evt_a" }),
    deliverCreem(h.env, h.fake, "subscription.active", creemSub(h, { updated_at: iso(NOW + 70) }), { id: "evt_b" })
  ]);
  assert.deepEqual(replies.map((r) => r.status), [200, 200], `the loser of the first-sight insert must re-read and apply, not fail: ${JSON.stringify(replies.map((r) => r.body))}`);
  assert.equal(await count(h.env, "FROM subscriptions"), 1, "exactly one subscription row");
  assertChain(await state(h), "first sights");
});

test("a subscription that keeps moving under every read gives up loudly after LOCK_ATTEMPTS and writes nothing", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "subscription.paid", creemSub(h));
  const before = await state(h);
  const eventsBefore = await count(h.env, "FROM subscription_events");
  let batches = 0;
  const db = h.env.DB;
  const busy = {
    prepare: (sql) => db.prepare(sql),
    batch: async (statements) => {
      batches += 1;
      await db.prepare("UPDATE subscriptions SET version = version + 1").run();
      return db.batch(statements);
    }
  };
  await assert.rejects(
    applyChange({ db: busy, env: h.env, now: NOW + 400 }, { provider: "creem", providerRef: SUB, status: "past_due", updatedAt: NOW + 400, source: "test" }),
    (error) => /ledger_conflict/.test(error.message) && error.message.includes(SUB),
    "a persistent conflict must throw ledger_conflict naming the subscription"
  );
  assert.equal(batches, LOCK_ATTEMPTS, `expected ${LOCK_ATTEMPTS} attempts, got ${batches}`);
  const after = await state(h);
  assert.equal(after.row.status, before.row.status, "no attempt may write the status");
  assert.equal(await count(h.env, "FROM subscription_events"), eventsBefore, "no attempt may write an event");
});

test("versionGuard: passes at the version read, aborts the batch after any other write, including the account-deletion cancel", async () => {
  const h = await buyer();
  await deliverCreem(h.env, h.fake, "subscription.paid", creemSub(h));
  const db = h.env.DB;
  const row = await db.prepare("SELECT * FROM subscriptions").first();
  const ctx = { db, now: NOW };
  await db.batch([versionGuard(ctx, row)]);
  assert.equal((await state(h)).row.version, Number(row.version) + 1, "the guard moves the version one up when the row is as read");
  const marker = db.prepare("UPDATE subscriptions SET plan = 'tampered' WHERE id = ?1").bind(row.id);
  await assert.rejects(db.batch([versionGuard(ctx, row), marker]), (error) => lostLock(error), "a guard planned from an old read must abort");
  assert.notEqual((await db.prepare("SELECT plan FROM subscriptions").first()).plan, "tampered", "the aborted batch must roll back every statement in it");
  assert.equal(lostLock(new Error("UNIQUE constraint failed: webhook_events.provider, webhook_events.event_id")), false, "a duplicate envelope is not a lost lock");
});
