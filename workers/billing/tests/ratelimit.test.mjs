/**
 * ratelimit.mjs: an atomic fixed-window limiter. The count is incremented and
 * read back in ONE statement, so concurrent requests cannot all read "under
 * the limit" before any of them writes.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { bucketKey, hitRateLimit, peekRateLimit } from "../src/ratelimit.mjs";
import { NOW, createCtx } from "./fixtures.mjs";

test("50 concurrent hits never exceed the limit by even one", async () => {
  const ctx = await createCtx();
  const results = await Promise.all(
    Array.from({ length: 50 }, () => hitRateLimit(ctx, "login:ip:203.0.113.7", 10, 3600))
  );
  assert.equal(results.filter((r) => r.ok).length, 10);
  assert.equal(results.filter((r) => !r.ok).length, 40);
});

test("the limit allows exactly `limit` hits then refuses with retryAfter", async () => {
  const ctx = await createCtx({}, NOW);
  const windowStart = NOW - (NOW % 3600);
  for (let i = 1; i <= 3; i += 1) {
    const hit = await hitRateLimit(ctx, "k", 3, 3600);
    assert.deepEqual(hit, { ok: true, count: i, retryAfter: 0 });
  }
  const refused = await hitRateLimit(ctx, "k", 3, 3600);
  assert.equal(refused.ok, false);
  assert.equal(refused.retryAfter, windowStart + 3600 - NOW);
  assert.ok(refused.retryAfter > 0);
});

test("a new window starts the count again", async () => {
  const ctx = await createCtx({}, NOW);
  await hitRateLimit(ctx, "w", 1, 60);
  assert.equal((await hitRateLimit(ctx, "w", 1, 60)).ok, false);
  const later = { ...ctx, now: NOW - (NOW % 60) + 60 };
  assert.deepEqual(await hitRateLimit(later, "w", 1, 60), { ok: true, count: 1, retryAfter: 0 });
});

test("buckets are HMACs: no email or IP is stored in clear", async () => {
  const ctx = await createCtx();
  await hitRateLimit(ctx, "login:email:ana@example.test", 5, 3600);
  const rows = (await ctx.db.prepare("SELECT bucket FROM rate_limits").all()).results;
  assert.equal(rows.length, 1);
  assert.match(rows[0].bucket, /^[0-9a-f]{64}$/);
  assert.ok(!rows[0].bucket.includes("ana"));
});

test("bucket keys depend on the pepper and on the window length", async () => {
  const a = await bucketKey(new Uint8Array(32).fill(1), "x", 3600);
  const b = await bucketKey(new Uint8Array(32).fill(2), "x", 3600);
  const c = await bucketKey(new Uint8Array(32).fill(1), "x", 60);
  assert.notEqual(a, b);
  assert.notEqual(a, c);
  assert.equal(a, await bucketKey(new Uint8Array(32).fill(1), "x", 3600));
});

test("peek reads the current window without spending", async () => {
  const ctx = await createCtx({}, NOW);
  assert.equal(await peekRateLimit(ctx, "p", 86400), 0);
  await hitRateLimit(ctx, "p", 20, 86400);
  await hitRateLimit(ctx, "p", 20, 86400);
  assert.equal(await peekRateLimit(ctx, "p", 86400), 2);
  assert.equal(await peekRateLimit(ctx, "p", 86400), 2);
  const nextDay = { ...ctx, now: NOW - (NOW % 86400) + 86400 };
  assert.equal(await peekRateLimit(nextDay, "p", 86400), 0);
});

test("spendBudget is all-or-nothing and atomic: 50 concurrent spends of 3 against 10 admit exactly 3, and a refusal costs nothing", async () => {
  const { spendBudget } = await import("../src/ratelimit.mjs");
  const ctx = await createCtx();
  const results = await Promise.all(Array.from({ length: 50 }, () => spendBudget(ctx, "bytes", 3, 10, 86400)));
  assert.equal(results.filter((r) => r.ok).length, 3);
  assert.ok(results.filter((r) => !r.ok).every((r) => r.retryAfter > 0));
  assert.equal((await spendBudget(ctx, "bytes", 1, 10, 86400)).ok, true, "9 spent: a 1-unit spend still fits, refused ones added nothing");
  assert.equal((await spendBudget(ctx, "bytes", 1, 10, 86400)).ok, false);
  assert.equal((await spendBudget(ctx, "big", 11, 10, 86400)).ok, false, "more than the whole budget is refused outright");
  assert.equal((await spendBudget({ ...ctx, now: ctx.now + 86400 }, "bytes", 10, 10, 86400)).ok, true, "a new window starts empty");
});
