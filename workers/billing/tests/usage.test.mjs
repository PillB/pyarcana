/**
 * D1 free-tier meter and budget guard (usage.mjs, owner request 2026-10-04): every D1 result's
 * meta is tallied per route, flushed at most every FLUSH_SECONDS to usage_daily (the flush counts
 * itself under "meter"), and the day's share of the free limits sets a level that slows sync
 * (amber), then defers progress writes and stops event storage (red) without losing anything.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, count, createHarness, seedAccount, sql } from "./fixtures.mjs";
import {
  AMBER_SYNC_MS,
  budgetLevel,
  FLUSH_SECONDS,
  flushSeconds,
  FREE_LIMITS,
  RED_SYNC_MS,
  levelFor,
  meterDb,
  resetUsageMeters,
  secondsUntilReset,
  utcDay
} from "../src/usage.mjs";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const TODAY = utcDay(NOW);

/**
 * A harness with a fresh meter and, optionally, today's usage already at some rows written.
 * @param {number} [rowsWritten] Rows written today before the test.
 * @param {Object} [overrides] Env overrides.
 * @returns {Promise<Object>} Harness and a learner.
 */
async function setup(rowsWritten = 0, overrides) {
  resetUsageMeters();
  const h = await createHarness(overrides);
  if (rowsWritten) {
    await sql(h.env, "INSERT INTO usage_daily (day, source, rows_read, rows_written, updated_at) VALUES (?1, 'seed', 0, ?2, ?3)", TODAY, rowsWritten, NOW);
  }
  const me = await seedAccount(h.env);
  return { ...h, me };
}

const usageRows = async (env) => (await env.DB.prepare("SELECT * FROM usage_daily WHERE source != 'seed' ORDER BY day, source").all()).results;
const putProgress = (env, me, body, now = NOW) => api(env, "PUT", "/v1/me/progress", { cookie: me.token, body, now });
const doc = { v: 1, state: { completedSections: ["S01"] } };

test("the metered binding answers exactly like D1 and tallies first, all, run and batch", async () => {
  const { env } = await setup();
  const db = meterDb(env.DB, "test", NOW);
  await env.DB.exec("CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT)");
  await db.batch([db.prepare("INSERT INTO t (name) VALUES (?1)").bind("a"), db.prepare("INSERT INTO t (name) VALUES (?1)").bind("b")]);
  assert.equal(await db.prepare("SELECT name FROM t WHERE id = ?1").bind(2).first("name"), "b");
  assert.deepEqual(await db.prepare("SELECT * FROM t WHERE id = ?1").bind(1).first(), { id: 1, name: "a" });
  assert.equal(await db.prepare("SELECT * FROM t WHERE id = 99").first(), null);
  assert.equal(await db.prepare("SELECT * FROM t WHERE id = 99").first("name"), null);
  await assert.rejects(() => db.prepare("SELECT name FROM t WHERE id = 1").first("nope"), /D1_COLUMN_NOTFOUND/);
  assert.equal((await db.prepare("SELECT * FROM t").all()).results.length, 2);
  // Flush through a request to read the tally back: 2 written + (1 + 1 + 0 + 0 + 1 + 2) read.
  await api(env, "GET", "/v1/me", { cookie: (await seedAccount(env, { email: "b@example.test" })).token });
  const row = (await usageRows(env)).find((r) => r.source === "test");
  assert.deepEqual([row.rows_read, row.rows_written], [5, 2]);
});

test("a progress write is metered under its route, flushed at most every FLUSH_SECONDS, and the meter counts itself", async () => {
  const { env, me } = await setup();
  assert.equal((await putProgress(env, me, { doc, baseRev: 0 })).status, 200);
  assert.deepEqual(await usageRows(env), [], "the first request's flush ran before its own queries");
  await putProgress(env, me, { doc, baseRev: 1 }, NOW + FLUSH_SECONDS - 1);
  assert.deepEqual(await usageRows(env), [], "no flush inside the window");
  await api(env, "GET", "/v1/me/progress", { cookie: me.token, now: NOW + FLUSH_SECONDS });
  const rows = await usageRows(env);
  const put = rows.find((r) => r.source === "PUT /v1/me/progress");
  assert.ok(put && put.rows_written >= 4, `two writes, each the progress row plus the rate-limit row: ${JSON.stringify(rows)}`);
  assert.ok(!rows.some((r) => r.source === "meter"), "a flush's own cost is known only after it ran...");
  // That flush upserted one source (the PUT route) and read one row back.
  await api(env, "GET", "/v1/me/progress", { cookie: me.token, now: NOW + 2 * FLUSH_SECONDS });
  const meter = (await usageRows(env)).find((r) => r.source === "meter");
  assert.ok(meter && meter.rows_written === 1 && meter.rows_read === 1, `...so the next flush records it: ${JSON.stringify(meter)}`);
});

test("a tally that crosses midnight is written to the day it was spent on", async () => {
  const { env, me } = await setup();
  const late = NOW - (NOW % 86400) + 86400 - 10;
  await putProgress(env, me, { doc, baseRev: 0 }, late);
  await api(env, "GET", "/v1/me/progress", { cookie: me.token, now: late + 20 });
  const days = new Set((await usageRows(env)).filter((r) => r.source === "PUT /v1/me/progress").map((r) => r.day));
  assert.deepEqual([...days], [utcDay(late)]);
});

test("an unflushed tally counts toward its own day only", async () => {
  resetUsageMeters();
  const spent = { results: [], meta: { rows_read: 0, rows_written: 0.9 * FREE_LIMITS.rowsWritten } };
  const raw = { prepare: () => ({ all: async () => spent, run: async () => spent }) };
  await meterDb(raw, "test", NOW - 86400).prepare("UPDATE x").run();
  assert.equal(budgetLevel({ env: { DB: raw }, now: NOW }), "green", "yesterday's rows do not make today red");
  await meterDb(raw, "test", NOW).prepare("UPDATE x").run();
  assert.equal(budgetLevel({ env: { DB: raw }, now: NOW }), "red", "today's unflushed rows do");
});

test("levels: green below 60 %, amber from 60 %, red from 85 %, of reads or writes", () => {
  assert.equal(levelFor({ rowsRead: 0, rowsWritten: 0.6 * FREE_LIMITS.rowsWritten - 1 }), "green");
  assert.equal(levelFor({ rowsRead: 0, rowsWritten: 0.6 * FREE_LIMITS.rowsWritten }), "amber");
  assert.equal(levelFor({ rowsRead: 0, rowsWritten: 0.85 * FREE_LIMITS.rowsWritten }), "red");
  assert.equal(levelFor({ rowsRead: 0.85 * FREE_LIMITS.rowsRead, rowsWritten: 0 }), "red");
  assert.equal(levelFor({ rowsRead: 0.6 * FREE_LIMITS.rowsRead, rowsWritten: 0 }), "amber");
});

test("the budget resets at 00:00 UTC and deferred writes come back at 00:05", () => {
  const midnight = NOW - (NOW % 86400);
  assert.equal(secondsUntilReset(midnight + 86400 - 60), 360);
  assert.equal(secondsUntilReset(midnight), 86400 + 300);
});

test("green: progress answers carry no hint", async () => {
  const { env, me } = await setup();
  assert.equal((await putProgress(env, me, { doc, baseRev: 0 })).body.syncHint, undefined);
});

test("amber: progress answers ask the client to sync at most once a minute", async () => {
  const { env, me } = await setup(0.7 * FREE_LIMITS.rowsWritten);
  const put = await putProgress(env, me, { doc, baseRev: 0 });
  assert.equal(put.status, 200);
  assert.deepEqual(put.body.syncHint, { minIntervalMs: AMBER_SYNC_MS, level: "amber" });
  const get = await api(env, "GET", "/v1/me/progress", { cookie: me.token });
  assert.deepEqual(get.body.syncHint, { minIntervalMs: AMBER_SYNC_MS, level: "amber" });
  const conflict = await putProgress(env, me, { doc, baseRev: 0 });
  assert.equal(conflict.status, 409);
  assert.equal(conflict.body.syncHint.level, "amber");
});

test("red: a progress write is deferred to 00:05 UTC before it spends anything; reads still work", async () => {
  const { env, me } = await setup(0.9 * FREE_LIMITS.rowsWritten);
  const put = await putProgress(env, me, { doc, baseRev: 0 });
  assert.equal(put.status, 503);
  assert.equal(put.body.reason, "budget_saver");
  assert.equal(put.body.retryAfter, secondsUntilReset(NOW));
  assert.equal(put.headers.get("retry-after"), String(secondsUntilReset(NOW)));
  assert.deepEqual(put.body.syncHint, { minIntervalMs: RED_SYNC_MS, level: "red" });
  assert.equal(await count(env, "FROM progress"), 0, "nothing stored");
  assert.equal(await count(env, "FROM rate_limits"), 0, "not even the rate-limit row");
  const get = await api(env, "GET", "/v1/me/progress", { cookie: me.token });
  assert.equal(get.status, 200);
  assert.equal(get.body.syncHint.level, "red");
});

test("the next UTC day starts green again", async () => {
  const { env, me } = await setup(0.9 * FREE_LIMITS.rowsWritten);
  const tomorrow = NOW - (NOW % 86400) + 86400 + 300;
  const put = await putProgress(env, me, { doc, baseRev: 0 }, tomorrow);
  assert.equal(put.status, 200);
  assert.equal(put.body.syncHint, undefined);
});

test("events: amber keeps whole visitors whose id starts 0 or 1; red stores none", async () => {
  const post = (env, cid) => api(env, "POST", "/v1/events", { body: { cid, events: [{ name: "session_start" }] }, headers: { "user-agent": UA } });
  const amber = await setup(0.7 * FREE_LIMITS.rowsWritten);
  assert.deepEqual((await post(amber.env, "f".repeat(32))).body, { ok: true, accepted: 0, reason: "budget_sampled" });
  assert.equal((await post(amber.env, `1${"a".repeat(31)}`)).body.accepted, 1);
  assert.equal(await count(amber.env, "FROM events"), 1);
  assert.equal((await post(amber.env, "not-an-id")).status, 400, "a malformed id still gets its 400");
  const red = await setup(0.9 * FREE_LIMITS.rowsWritten);
  assert.deepEqual((await post(red.env, `0${"a".repeat(31)}`)).body, { ok: true, accepted: 0, reason: "budget_saver" });
  assert.equal(await count(red.env, "FROM events"), 0);
  assert.equal(await count(red.env, "FROM rate_limits"), 0);
});

test("USAGE_FLUSH_SECONDS sets the interval within 0..3600; anything else keeps the default", () => {
  assert.equal(flushSeconds({}), FLUSH_SECONDS);
  assert.equal(flushSeconds({ USAGE_FLUSH_SECONDS: "0" }), 0);
  assert.equal(flushSeconds({ USAGE_FLUSH_SECONDS: "60" }), 60);
  for (const bad of ["", "-1", "3601", "1.5", "soon"]) assert.equal(flushSeconds({ USAGE_FLUSH_SECONDS: bad }), FLUSH_SECONDS, bad);
});

test("USAGE_LEVEL forces a level for drills", async () => {
  const { env, me } = await setup(0, { USAGE_LEVEL: "red" });
  assert.equal((await putProgress(env, me, { doc, baseRev: 0 })).status, 503);
});

test("GET /v1/admin/usage: admins see today's totals by route, 14 days and the level; others do not", async () => {
  const { env, me } = await setup(0.7 * FREE_LIMITS.rowsWritten);
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  assert.equal((await api(env, "GET", "/v1/admin/usage", { cookie: me.token })).status, 403);
  await sql(env, "INSERT INTO usage_daily (day, source, rows_read, rows_written, updated_at) VALUES (?1, 'old', 10, 20, ?2)", utcDay(NOW - 20 * 86400), NOW);
  const r = await api(env, "GET", "/v1/admin/usage", { cookie: admin.token });
  assert.equal(r.status, 200);
  assert.equal(r.body.level, "amber");
  assert.deepEqual(r.body.limits, FREE_LIMITS);
  assert.equal(r.body.today.day, TODAY);
  assert.ok(r.body.today.rowsWritten >= 0.7 * FREE_LIMITS.rowsWritten);
  assert.equal(r.body.sources[0].source, "seed", "sorted by rows written");
  assert.ok(r.body.days.every((d) => d.day > utcDay(NOW - 14 * 86400)), "14 days only");
});
