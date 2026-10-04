/**
 * retention.mjs: the daily sweep deletes exactly what the retention policy
 * says (DESIGN-v2 §4 Scheduled) and nothing else; the cron entry dispatches.
 */

import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.mjs";
import { AUDIT_DAYS, DAILY_CRON, HOURLY_CRON, SIGNIN_RECORD_DAYS, runScheduled, sweepRetention } from "../src/retention.mjs";
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
    `INSERT INTO sessions (id, account_id, token_hash, method, created_at, renewed_at, expires_at) VALUES ('sess_old', 'acct_1', 'h1', 'email', 1, 1, ${at(-SIGNIN_RECORD_DAYS * DAY - 1)})`,
    `INSERT INTO sessions (id, account_id, token_hash, method, created_at, renewed_at, expires_at) VALUES ('sess_recent', 'acct_1', 'h2', 'email', 1, 1, ${at(-SIGNIN_RECORD_DAYS * DAY + 1)})`,
    `INSERT INTO rate_limits (bucket, count, window_start) VALUES ('rl_old', 1, ${at(-2 * DAY - 1)})`,
    `INSERT INTO rate_limits (bucket, count, window_start) VALUES ('rl_recent', 1, ${at(-2 * DAY + 1)})`,
    `INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_old', 'acct_1', 'creem', 'pro_monthly', 799, 'USD', ${at(-7 * DAY - 1)}, 'open')`,
    `INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_recent', 'acct_1', 'creem', 'pro_monthly', 799, 'USD', ${at(-7 * DAY + 1)}, 'open')`,
    `INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_done', 'acct_1', 'creem', 'pro_monthly', 799, 'USD', ${at(-30 * DAY)}, 'completed')`,
    `INSERT INTO webhook_events (provider, event_id, received_at) VALUES ('creem', 'evt_ancient', ${at(-400 * DAY)})`,
    `INSERT INTO trial_claims (key, claimed_at) VALUES ('claim', ${at(-400 * DAY)})`,
    `INSERT INTO audit_log (action, created_at) VALUES ('x', ${at(-AUDIT_DAYS * DAY + 1)})`,
    `INSERT INTO audit_log (action, created_at) VALUES ('expired', ${at(-AUDIT_DAYS * DAY - 1)})`,
    `INSERT INTO used_nonces (hash, expires_at) VALUES ('nonce_spent_expired', ${at(-1)})`,
    `INSERT INTO used_nonces (hash, expires_at) VALUES ('nonce_live', ${at(1)})`
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
  assert.deepEqual(counts, { loginCodes: 1, sessions: 1, rateLimits: 1, checkoutsExpired: 1, usedNonces: 1, reportAttachments: 0, usageDays: 0, reports: 0, auditRows: 1, qaSessions: 0 });
  assert.deepEqual(await ids(ctx.db, "SELECT hash AS id FROM used_nonces"), ["nonce_live"], "a spent nonce is kept until its token could no longer verify");
  assert.deepEqual(await ids(ctx.db, "SELECT id FROM login_codes"), ["code_recent"]);
  assert.deepEqual(await ids(ctx.db, "SELECT id FROM sessions"), ["sess_recent"]);
  assert.deepEqual(await ids(ctx.db, "SELECT bucket AS id FROM rate_limits"), ["rl_recent"]);
  assert.deepEqual(await ids(ctx.db, "SELECT id || ':' || status AS id FROM checkouts"), ["chk_done:completed", "chk_old:expired", "chk_recent:open"]);
});

test("the sweep never touches webhook markers or trial claims; audit rows stay 2 years", async () => {
  const ctx = await createCtx();
  await seed(ctx.db);
  await sweepRetention(ctx);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM webhook_events").first("c"), 1);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM trial_claims").first("c"), 1);
  assert.deepEqual(await ids(ctx.db, "SELECT action AS id FROM audit_log"), ["x"], "the 2-year-old row goes, the younger one stays");
});

test("the daily cron sweeps; the hourly cron does not (it only reconciles, stage 2b)", async () => {
  const hourly = await createCtx();
  await seed(hourly.db);
  const quiet = await runScheduled(hourly.env, { cron: HOURLY_CRON, now: NOW, log: () => {} });
  assert.deepEqual(quiet.ran, ["reconcile"]);
  assert.equal(await hourly.db.prepare("SELECT COUNT(*) AS c FROM login_codes").first("c"), 2);
  const daily = await createCtx();
  await seed(daily.db);
  const swept = await runScheduled(daily.env, { cron: DAILY_CRON, now: NOW, log: () => {} });
  assert.deepEqual(swept.ran, ["retention", "reconcile"]);
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

test("the sweep keeps every stage-1b table whatever its age: progress, grants, roles, billing", async () => {
  const ctx = await createCtx();
  await seed(ctx.db);
  const old = NOW - 400 * DAY;
  const statements = [
    `INSERT INTO progress (account_id, rev, doc, size_bytes, updated_at) VALUES ('acct_1', 1, '{}', 2, ${old})`,
    `INSERT INTO grants (id, account_id, kind, days, created_at, revoked_at) VALUES ('grant_old', 'acct_1', 'gift', 30, ${old}, ${old + 1})`,
    `INSERT INTO account_roles (account_id, role, created_at, expires_at) VALUES ('acct_1', 'tester', ${old}, ${old + 1})`,
    `INSERT INTO reports (id, created_at, updated_at, source, status, title) VALUES ('rep_old', ${old}, ${old}, 'feedback', 'fixed', 't')`,
    `INSERT INTO report_attachments (id, report_id, mime, bytes, created_at) VALUES ('att_old', 'rep_old', 'image/png', x'89504e470d0a1a0a', ${old})`,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, created_at, updated_at) VALUES ('sub_old', 'acct_1', 'creem', 'r', 'pro_monthly', 799, 'USD', 'canceled', ${old}, ${old})`,
    `INSERT INTO charges (id, provider, provider_charge_id, subscription_id, account_id, amount_minor, currency, status, created_at, updated_at) VALUES ('ch_old', 'creem', 'p', 'sub_old', 'acct_1', 799, 'USD', 'approved', ${old}, ${old})`,
    `INSERT INTO subscription_events (subscription_id, provider, kind, created_at) VALUES ('sub_old', 'creem', 'x', ${old})`
  ];
  for (const sqlText of statements) {
    await ctx.db.exec(sqlText);
  }
  await sweepRetention(ctx);
  for (const table of ["progress", "grants", "account_roles", "subscriptions", "charges", "subscription_events"]) {
    assert.equal(await ctx.db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).first("c"), 1, `${table} is not swept`);
  }
});

test("review F3: screenshots are deleted 90 days after their report is closed, or 180 days after it was filed", async () => {
  const ctx = await createCtx();
  const reportRow = (id, status, created, updated) =>
    `INSERT INTO reports (id, created_at, updated_at, source, status, title) VALUES ('${id}', ${created}, ${updated}, 'feedback', '${status}', 't')`;
  const shot = (id, reportId) => `INSERT INTO report_attachments (id, report_id, mime, bytes, created_at) VALUES ('${id}', '${reportId}', 'image/png', x'89504e470d0a1a0a', 1)`;
  const rows = [
    ["closed_91", "fixed", NOW - 100 * DAY, NOW - 91 * DAY],
    ["closed_89", "wontfix", NOW - 100 * DAY, NOW - 89 * DAY],
    ["dup_91", "duplicate", NOW - 100 * DAY, NOW - 91 * DAY],
    ["open_179", "in_progress", NOW - 179 * DAY, NOW - 179 * DAY],
    ["open_181", "new", NOW - 181 * DAY, NOW - 1 * DAY],
    ["triaged_91", "triaged", NOW - 100 * DAY, NOW - 91 * DAY]
  ];
  for (const [id, status, created, updated] of rows) {
    await ctx.db.exec(reportRow(`rep_${id}`, status, created, updated));
    await ctx.db.exec(shot(`att_${id}`, `rep_${id}`));
  }
  const counts = await sweepRetention(ctx);
  assert.equal(counts.reportAttachments, 3);
  assert.deepEqual(await ids(ctx.db, "SELECT id FROM report_attachments"), ["att_closed_89", "att_open_179", "att_triaged_91"]);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM reports").first("c"), rows.length, "the report text stays");
});

test("reports are deleted 1 year after closing or 2 years after filing, screenshots first (owner decision 2026-10-04)", async () => {
  const ctx = await createCtx();
  const reportRow = (id, status, created, updated) =>
    `INSERT INTO reports (id, created_at, updated_at, source, status, title, description) VALUES ('${id}', ${created}, ${updated}, 'feedback', '${status}', 't', 'personal text')`;
  const rows = [
    ["fixed_366", "fixed", NOW - 400 * DAY, NOW - 366 * DAY],
    ["fixed_364", "fixed", NOW - 400 * DAY, NOW - 364 * DAY],
    ["dup_366", "duplicate", NOW - 400 * DAY, NOW - 366 * DAY],
    ["open_731", "new", NOW - 731 * DAY, NOW - 2 * DAY],
    ["open_729", "triaged", NOW - 729 * DAY, NOW - 729 * DAY]
  ];
  for (const [id, status, created, updated] of rows) {
    await ctx.db.exec(reportRow(`rep_${id}`, status, created, updated));
  }
  // A screenshot on a report that goes: the sweep must not trip the foreign key.
  await ctx.db.exec(`INSERT INTO report_attachments (id, report_id, mime, bytes, created_at) VALUES ('att', 'rep_open_731', 'image/png', x'89504e470d0a1a0a', 1)`);
  const counts = await sweepRetention(ctx);
  assert.equal(counts.reports, 3);
  assert.deepEqual(await ids(ctx.db, "SELECT id FROM reports"), ["rep_fixed_364", "rep_open_729"]);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM report_attachments").first("c"), 0);
});
