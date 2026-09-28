/**
 * retention.mjs: the daily sweep deletes exactly what the retention policy
 * says (DESIGN-v2 §4 Scheduled) and nothing else; the cron entry dispatches.
 */

import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.mjs";
import { DAILY_CRON, HOURLY_CRON, runScheduled, sweepRetention } from "../src/retention.mjs";
import { NOW, createCtx, createEnv } from "./fixtures.mjs";

const DAY = 86400;

/**
 * Seed rows on both sides of every retention boundary.
 * @param {Object} db D1 fake.
 * @returns {Promise<void>} Resolves when seeded.
 */
async function seed(db) {
  await db.exec(`INSERT INTO accounts (id, email, email_normalized, created_at, updated_at) VALUES ('acct_1', 'a@x.test', 'a@x.test', 1, 1)`);
  const at = (offset) => NOW + offset;
  const statements = [
    `INSERT INTO login_codes (id, email_normalized, code_hmac, created_at, expires_at) VALUES ('code_old', 'a@x.test', 'h', ${at(-2 * DAY)}, ${at(-DAY - 1)})`,
    `INSERT INTO login_codes (id, email_normalized, code_hmac, created_at, expires_at) VALUES ('code_recent', 'a@x.test', 'h', ${at(-DAY)}, ${at(-DAY + 1)})`,
    `INSERT INTO sessions (id, account_id, token_hash, method, created_at, renewed_at, expires_at) VALUES ('sess_old', 'acct_1', 'h1', 'email', 1, 1, ${at(-7 * DAY - 1)})`,
    `INSERT INTO sessions (id, account_id, token_hash, method, created_at, renewed_at, expires_at) VALUES ('sess_recent', 'acct_1', 'h2', 'email', 1, 1, ${at(-7 * DAY + 1)})`,
    `INSERT INTO rate_limits (bucket, count, window_start) VALUES ('rl_old', 1, ${at(-2 * DAY - 1)})`,
    `INSERT INTO rate_limits (bucket, count, window_start) VALUES ('rl_recent', 1, ${at(-2 * DAY + 1)})`,
    `INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_old', 'acct_1', 'creem', 'pro_monthly', 799, 'USD', ${at(-7 * DAY - 1)}, 'open')`,
    `INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_recent', 'acct_1', 'creem', 'pro_monthly', 799, 'USD', ${at(-7 * DAY + 1)}, 'open')`,
    `INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_done', 'acct_1', 'creem', 'pro_monthly', 799, 'USD', ${at(-30 * DAY)}, 'completed')`,
    `INSERT INTO webhook_events (provider, event_id, received_at) VALUES ('creem', 'evt_ancient', ${at(-400 * DAY)})`,
    `INSERT INTO trial_claims (key, claimed_at) VALUES ('claim', ${at(-400 * DAY)})`,
    `INSERT INTO audit_log (action, created_at) VALUES ('x', ${at(-400 * DAY)})`
  ];
  for (const sql of statements) {
    await db.exec(sql);
  }
}

/**
 * Ids left in a table.
 * @param {Object} db D1 fake.
 * @param {string} sql Query returning `id`.
 * @returns {Promise<string[]>} Ids.
 */
async function ids(db, sql) {
  return (await db.prepare(sql).all()).results.map((r) => r.id).sort();
}

test("the sweep deletes exactly what the policy says", async () => {
  const ctx = await createCtx();
  await seed(ctx.db);
  const counts = await sweepRetention(ctx);
  assert.deepEqual(counts, { loginCodes: 1, sessions: 1, rateLimits: 1, checkoutsExpired: 1 });
  assert.deepEqual(await ids(ctx.db, "SELECT id FROM login_codes"), ["code_recent"]);
  assert.deepEqual(await ids(ctx.db, "SELECT id FROM sessions"), ["sess_recent"]);
  assert.deepEqual(await ids(ctx.db, "SELECT bucket AS id FROM rate_limits"), ["rl_recent"]);
  assert.deepEqual(await ids(ctx.db, "SELECT id || ':' || status AS id FROM checkouts"), ["chk_done:completed", "chk_old:expired", "chk_recent:open"]);
});

test("the sweep never touches webhook markers, trial claims or the audit log", async () => {
  const ctx = await createCtx();
  await seed(ctx.db);
  await sweepRetention(ctx);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM webhook_events").first("c"), 1);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM trial_claims").first("c"), 1);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM audit_log").first("c"), 1);
});

test("the daily cron sweeps; the hourly cron does not", async () => {
  const hourly = await createCtx();
  await seed(hourly.db);
  const quiet = await runScheduled(hourly.env, { cron: HOURLY_CRON, now: NOW, log: () => {} });
  assert.deepEqual(quiet.ran, []);
  assert.equal(await hourly.db.prepare("SELECT COUNT(*) AS c FROM login_codes").first("c"), 2);
  const daily = await createCtx();
  await seed(daily.db);
  const swept = await runScheduled(daily.env, { cron: DAILY_CRON, now: NOW, log: () => {} });
  assert.deepEqual(swept.ran, ["retention"]);
  assert.equal(await daily.db.prepare("SELECT COUNT(*) AS c FROM login_codes").first("c"), 1);
});

test("without D1 the scheduled run skips and says why", async () => {
  const logs = [];
  const result = await runScheduled(createEnv({ DB: undefined }), { cron: DAILY_CRON, now: NOW, log: (line) => logs.push(line) });
  assert.deepEqual(result, { ran: [], skipped: "db_not_configured" });
  assert.deepEqual(logs, ["scheduled skipped: db_not_configured"]);
});

test("the worker's scheduled entry hands the sweep to waitUntil", async () => {
  const ctx = await createCtx();
  await seed(ctx.db);
  const pending = [];
  worker.scheduled({ cron: DAILY_CRON, scheduledTime: NOW * 1000 }, ctx.env, { waitUntil: (p) => pending.push(p) });
  assert.equal(pending.length, 1);
  await Promise.all(pending);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM sessions").first("c"), 1);
});
