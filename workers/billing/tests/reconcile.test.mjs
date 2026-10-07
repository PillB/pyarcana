/**
 * Provider reconciliation in the scheduled handler (DESIGN-v2 §4
 * "Scheduled"): a missed or lost webhook must not strand a payment, and a
 * cancel done in the provider's own portal must reach the ledger.
 *
 * Hourly (7 * * * *): RECENT rows: open checkouts younger than 7 days and
 * pending subscriptions. Daily (17 9 * * *): the retention sweep, then every
 * pending / active / past_due subscription. Each run reads at most
 * RECONCILE_LIMIT rows, least recently reconciled first; one row's failure
 * never stops the others, and nothing secret is logged.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { DAILY_CRON, HOURLY_CRON, runScheduled } from "../src/retention.mjs";
import { NOW, count, seedAccount, sql } from "./fixtures.mjs";
import { MP_TOKEN, call, createPaymentsHarness, iso } from "./payments-fake.mjs";

const DAY = 86400;
const TERMS = { acceptTerms: true, adultOrAuthorized: true };

/**
 * A learner who opened an MP checkout and then paid at MP (no webhook came).
 * @returns {Promise<Object>} Harness.
 */
async function paidWithoutWebhook() {
  const h = await createPaymentsHarness();
  const who = await seedAccount(h.env, { email: "ana@example.test" });
  const res = await call(h.env, "POST", "/api/v1/checkout", { body: { provider: "mercadopago", plan: "pro_monthly", ...TERMS }, cookie: who.token, cf: { country: "PE" }, fake: h.fake });
  assert.equal(res.status, 200);
  const preId = Object.keys(h.fake.mp.preapprovals)[0];
  Object.assign(h.fake.mp.preapprovals[preId], { status: "authorized", last_modified: iso(NOW + 5) });
  h.fake.mp.authorized["80"] = { id: 80, preapproval_id: preId, transaction_amount: 19.9, currency_id: "PEN", debit_date: iso(NOW), payment: { id: 9080, status: "approved" } };
  return { ...h, who, preId, chk: res.body.checkoutId };
}

/**
 * Run a cron with the fake provider.
 * @param {Object} h Harness.
 * @param {string} cron Cron.
 * @param {Object} [opts] {now, limit, log}.
 * @returns {Promise<Object>} Result.
 */
function run(h, cron, opts = {}) {
  return runScheduled(h.env, { cron, now: opts.now === undefined ? NOW + 3600 : opts.now, log: opts.log || (() => {}), fetchImpl: h.fake.fetchImpl, limit: opts.limit });
}

test("hourly: a payment whose webhook never came is found by re-reading the recent checkout", async () => {
  const h = await paidWithoutWebhook();
  const result = await run(h, HOURLY_CRON);
  assert.deepEqual(result.ran, ["reconcile"]);
  assert.deepEqual(result.reconciled, { checkouts: 1, subscriptions: 1, failed: 0 });
  assert.equal((await h.env.DB.prepare("SELECT status FROM subscriptions").first()).status, "active");
  assert.equal(await count(h.env, "FROM charges WHERE status = 'approved'"), 1);
  assert.equal(await count(h.env, "FROM login_codes"), 0, "(the hourly run sweeps nothing)");
});

test("hourly leaves old rows to the daily run: a checkout older than 7 days and an active subscription are not read", async () => {
  const h = await paidWithoutWebhook();
  await sql(h.env, "UPDATE checkouts SET created_at = ?1", NOW - 8 * DAY);
  await sql(h.env, "UPDATE subscriptions SET status = 'active'");
  const result = await run(h, HOURLY_CRON);
  assert.deepEqual(result.reconciled, { checkouts: 0, subscriptions: 0, failed: 0 });
  assert.equal(h.fake.calls.filter((c) => c.method === "GET").length, 0);
});

test("daily: every live subscription is re-read, so a cancel made in Mercado Pago's own portal reaches the ledger", async () => {
  const h = await paidWithoutWebhook();
  await run(h, HOURLY_CRON);
  h.fake.mp.preapprovals[h.preId].status = "cancelled";
  h.fake.mp.preapprovals[h.preId].last_modified = iso(NOW + 40 * DAY);
  const result = await run(h, DAILY_CRON, { now: NOW + 40 * DAY });
  assert.deepEqual(result.ran, ["retention", "reconcile"]);
  assert.equal((await h.env.DB.prepare("SELECT status FROM subscriptions").first()).status, "canceled");
});

test("one row failing does not stop the others; the log names the provider only", async () => {
  const h = await paidWithoutWebhook();
  const other = await seedAccount(h.env, { email: "luis@example.test" });
  await sql(
    h.env,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, created_at, updated_at)
     VALUES ('sub_broken', ?1, 'mercadopago', 'missing000000000000000000000000', 'pro_monthly', 1990, 'PEN', 'pending', ?2, ?2)`,
    other.account.id,
    NOW - 10
  );
  const lines = [];
  const result = await run(h, HOURLY_CRON, { log: (l) => lines.push(l) });
  assert.equal(result.reconciled.failed, 1);
  assert.equal((await h.env.DB.prepare("SELECT status FROM subscriptions WHERE id <> 'sub_broken'").first()).status, "active");
  const text = lines.join("\n");
  assert.ok(!text.includes(MP_TOKEN) && !text.includes("@"), text);
  assert.match(text, /reconcile/);
});

test("each run reads at most `limit` rows, least recently reconciled first, so every row gets its turn", async () => {
  const h = await paidWithoutWebhook();
  for (let i = 0; i < 3; i += 1) {
    await sql(h.env, "INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, provider_ref, created_at, status) VALUES (?1, ?2, 'creem', 'pro_monthly', 799, 'USD', ?3, ?4, 'open')", `chk_x${i}`, h.who.account.id, `ch_x${i}`, NOW - 100 + i);
  }
  const first = await run(h, HOURLY_CRON, { limit: 2 });
  const second = await run(h, HOURLY_CRON, { limit: 2, now: NOW + 7200 });
  const read = (from) => h.fake.calls.slice(from).filter((c) => c.method === "GET").map((c) => c.url);
  assert.equal(first.reconciled.checkouts, 2);
  assert.equal(second.reconciled.checkouts, 2);
  const all = read(0).join(" ");
  for (const id of ["ch_x0", "ch_x1", "ch_x2"]) {
    assert.ok(all.includes(id), `${id} was read within two runs`);
  }
});

test("without payment configuration the rows are skipped as failures and the run still completes", async () => {
  const h = await paidWithoutWebhook();
  h.env.MP_ACCESS_TOKEN = "";
  const result = await run(h, HOURLY_CRON);
  assert.deepEqual(result.ran, ["reconcile"]);
  // The checkout's preapproval is the pending subscription's, so it is read once: one failure.
  assert.deepEqual(result.reconciled, { checkouts: 1, subscriptions: 1, failed: 1 });
  assert.equal((await h.env.DB.prepare("SELECT status FROM subscriptions").first()).status, "pending");
});
