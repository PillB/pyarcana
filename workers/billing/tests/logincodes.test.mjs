/**
 * logincodes.mjs: HMAC-stored six-digit codes, up to 3 live per email, the
 * attempt spent atomically BEFORE any comparison, constant-time compare, and
 * a consume that must change exactly one row.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  LOGIN_CODE_MAX_ATTEMPTS,
  LOGIN_CODE_TTL_SECONDS,
  issueLoginCode,
  verifyLoginCode
} from "../src/logincodes.mjs";
import { NOW, createCtx } from "./fixtures.mjs";

const EMAIL = "ana@example.test";

/**
 * A wrong code for a given right one.
 * @param {string} code Right code.
 * @returns {string} Different six digits.
 */
function wrong(code) {
  return code === "000000" ? "000001" : "000000";
}

/**
 * Count how many stored code hashes the database hands back (each one is a
 * comparison the verifier can make), whatever SQL the implementation uses.
 * @param {Object} db D1 fake.
 * @returns {{count: function(): number}} Counter.
 */
function hashReads(db) {
  let n = 0;
  db.observe((sql, rows) => {
    n += rows.filter((row) => Object.prototype.hasOwnProperty.call(row, "code_hmac")).length;
  });
  return { count: () => n };
}

test("only an HMAC of the code is stored, valid for 15 minutes", async () => {
  const ctx = await createCtx();
  const issued = await issueLoginCode(ctx, EMAIL);
  assert.equal(issued.ok, true);
  assert.match(issued.code, /^\d{6}$/);
  const row = await ctx.db.prepare("SELECT * FROM login_codes").first();
  assert.match(row.code_hmac, /^[0-9a-f]{64}$/);
  assert.ok(!row.code_hmac.includes(issued.code));
  assert.equal(row.expires_at, NOW + LOGIN_CODE_TTL_SECONDS);
  assert.equal(LOGIN_CODE_TTL_SECONDS, 900);
});

test("the right code verifies once, then is spent", async () => {
  const ctx = await createCtx();
  const { code } = await issueLoginCode(ctx, EMAIL);
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, code), { ok: true });
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, code), { ok: false, reason: "code_expired" });
});

test("a wrong code is refused and spends one attempt", async () => {
  const ctx = await createCtx();
  const { code } = await issueLoginCode(ctx, EMAIL);
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, wrong(code)), { ok: false, reason: "bad_code" });
  assert.equal(await ctx.db.prepare("SELECT attempts FROM login_codes").first("attempts"), 1);
});

test("after five wrong attempts even the right code is refused", async () => {
  const ctx = await createCtx();
  const { code } = await issueLoginCode(ctx, EMAIL);
  for (let i = 0; i < LOGIN_CODE_MAX_ATTEMPTS; i += 1) {
    await verifyLoginCode(ctx, EMAIL, wrong(code));
  }
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, code), { ok: false, reason: "code_expired" });
});

test("200 parallel wrong verifies perform at most 5 comparisons per code", async () => {
  const ctx = await createCtx();
  const { code } = await issueLoginCode(ctx, EMAIL);
  const reads = hashReads(ctx.db);
  const results = await Promise.all(Array.from({ length: 200 }, () => verifyLoginCode(ctx, EMAIL, wrong(code))));
  assert.ok(results.every((r) => !r.ok));
  assert.ok(reads.count() <= LOGIN_CODE_MAX_ATTEMPTS, `stored hash handed out ${reads.count()} times`);
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, code), { ok: false, reason: "code_expired" }, "the code is burned");
});

test("an expired code is refused", async () => {
  const ctx = await createCtx();
  const { code } = await issueLoginCode(ctx, EMAIL);
  const late = { ...ctx, now: NOW + LOGIN_CODE_TTL_SECONDS };
  assert.deepEqual(await verifyLoginCode(late, EMAIL, code), { ok: false, reason: "code_expired" });
});

test("codes belong to one email", async () => {
  const ctx = await createCtx();
  const { code } = await issueLoginCode(ctx, EMAIL);
  assert.deepEqual(await verifyLoginCode(ctx, "other@example.test", code), { ok: false, reason: "code_expired" });
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, code), { ok: true });
});

test("a new code does not consume the earlier ones; at most 3 are live", async () => {
  const ctx = await createCtx();
  const first = await issueLoginCode(ctx, EMAIL);
  await issueLoginCode(ctx, EMAIL);
  await issueLoginCode(ctx, EMAIL);
  const fourth = await issueLoginCode(ctx, EMAIL);
  assert.equal(fourth.ok, false);
  assert.equal(fourth.reason, "too_many_codes");
  assert.equal(fourth.retryAfter, LOGIN_CODE_TTL_SECONDS);
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, first.code), { ok: true }, "the first code still works");
});

test("ten concurrent requests for codes create exactly three", async () => {
  const ctx = await createCtx();
  const results = await Promise.all(Array.from({ length: 10 }, () => issueLoginCode(ctx, EMAIL)));
  assert.equal(results.filter((r) => r.ok).length, 3);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM login_codes").first("c"), 3);
});

test("a successful sign-in retires the other live codes", async () => {
  const ctx = await createCtx();
  const a = await issueLoginCode(ctx, EMAIL);
  const b = await issueLoginCode(ctx, EMAIL);
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, b.code), { ok: true });
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, a.code), { ok: false, reason: "code_expired" });
});

test("with three live codes one guess is compared against each once", async () => {
  const ctx = await createCtx();
  const codes = [];
  for (let i = 0; i < 3; i += 1) {
    codes.push((await issueLoginCode(ctx, EMAIL)).code);
  }
  const guess = ["000000", "111111", "222222", "333333"].find((c) => !codes.includes(c));
  const reads = hashReads(ctx.db);
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, guess), { ok: false, reason: "bad_code" });
  assert.equal(reads.count(), 3);
});

test("two concurrent right answers sign in once", async () => {
  const ctx = await createCtx();
  const { code } = await issueLoginCode(ctx, EMAIL);
  const results = await Promise.all([verifyLoginCode(ctx, EMAIL, code), verifyLoginCode(ctx, EMAIL, code)]);
  assert.equal(results.filter((r) => r.ok).length, 1);
});

test("review: a sign-in retires only ITS address's other codes; another address's live code still verifies", async () => {
  const ctx = await createCtx();
  const other = await issueLoginCode(ctx, "luis@example.test");
  const mine = await issueLoginCode(ctx, EMAIL);
  await issueLoginCode(ctx, EMAIL);
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, mine.code), { ok: true });
  assert.deepEqual(await verifyLoginCode(ctx, "luis@example.test", other.code), { ok: true });
});

test("review: codes spent by five wrong tries no longer count toward the three live codes", async () => {
  const ctx = await createCtx();
  for (let i = 0; i < 3; i += 1) {
    await issueLoginCode(ctx, EMAIL);
  }
  assert.equal((await issueLoginCode(ctx, EMAIL)).ok, false, "three live codes: a fourth waits");
  for (let i = 0; i < LOGIN_CODE_MAX_ATTEMPTS; i += 1) {
    await verifyLoginCode(ctx, EMAIL, "999999");
  }
  const fresh = await issueLoginCode(ctx, EMAIL);
  assert.equal(fresh.ok, true, "a learner who mistyped five times can ask for a new code at once");
  assert.deepEqual(await verifyLoginCode(ctx, EMAIL, fresh.code), { ok: true });
});
