/**
 * GET/PUT /v1/me/progress (DESIGN-v2 §4): one JSON object per account,
 * compare-and-swap on `rev`, a concurrent first insert is 409 (never 500),
 * at most 256 KiB, 600 writes per hour. The server never interprets the
 * document; merging is the client's job (progress-merge.ts).
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, createHarness, seedAccount } from "./fixtures.mjs";

const KIB = 1024;

/**
 * PUT a document.
 * @param {Object} env Env.
 * @param {string} token Session.
 * @param {Object} body Body.
 * @param {Object} [extra] api() options.
 * @returns {Promise<Object>} Response.
 */
function put(env, token, body, extra) {
  return api(env, "PUT", "/v1/me/progress", { cookie: token, body, ...(extra || {}) });
}

/**
 * GET the stored document.
 * @param {Object} env Env.
 * @param {string} token Session.
 * @returns {Promise<Object>} Body.
 */
async function get(env, token) {
  return (await api(env, "GET", "/v1/me/progress", { cookie: token })).body;
}

/**
 * A JSON object whose compact serialization is exactly `bytes` long.
 * @param {number} bytes Target size.
 * @returns {Object} Document.
 */
function docOfSize(bytes) {
  const overhead = JSON.stringify({ v: 1, pad: "" }).length;
  return { v: 1, pad: "x".repeat(bytes - overhead) };
}

test("an empty account reads rev 0 and no document", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  assert.deepEqual(await get(env, me.token), { ok: true, rev: 0, doc: null, updatedAt: null });
});

test("write, read back, and advance the revision with compare-and-swap", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  const doc = { v: 1, state: { completedSections: ["S01"] }, changes: { "sec:S01": { present: true, ts: 1 } } };
  assert.deepEqual((await put(env, me.token, { doc, baseRev: 0 })).body, { ok: true, rev: 1, updatedAt: NOW });
  assert.deepEqual(await get(env, me.token), { ok: true, rev: 1, doc, updatedAt: NOW });
  const next = { ...doc, state: { completedSections: ["S01", "S02"] } };
  assert.deepEqual((await put(env, me.token, { doc: next, baseRev: 1 }, { now: NOW + 5 })).body, { ok: true, rev: 2, updatedAt: NOW + 5 });
  const stale = await put(env, me.token, { doc, baseRev: 1 });
  assert.deepEqual([stale.status, stale.body], [409, { ok: false, reason: "conflict", server: { rev: 2, doc: next, updatedAt: NOW + 5 } }]);
});

test("baseRev 0 over an existing row, and baseRev > 0 with no row, are conflicts with the server copy", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  const ahead = await put(env, me.token, { doc: { v: 1 }, baseRev: 3 });
  assert.deepEqual([ahead.status, ahead.body.server], [409, { rev: 0, doc: null, updatedAt: null }]);
  await put(env, me.token, { doc: { v: 1, a: 1 }, baseRev: 0 });
  const again = await put(env, me.token, { doc: { v: 1, b: 2 }, baseRev: 0 });
  assert.deepEqual([again.status, again.body.server.rev, again.body.server.doc], [409, 1, { v: 1, a: 1 }]);
});

test("ten concurrent first writes: exactly one wins, the rest are 409, none is 500", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  const results = await Promise.all(Array.from({ length: 10 }, (_, i) => put(env, me.token, { doc: { v: 1, device: i }, baseRev: 0 })));
  assert.deepEqual(results.map((r) => r.status).sort(), [200, ...Array(9).fill(409)]);
  const winner = results.find((r) => r.status === 200);
  const stored = await get(env, me.token);
  assert.equal(stored.rev, 1);
  assert.ok(results.filter((r) => r.status === 409).every((r) => r.body.server.rev === 1 && r.body.server.doc.device === stored.doc.device));
  assert.equal(winner.body.rev, 1);
});

test("ten concurrent updates on the same revision: exactly one wins", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  await put(env, me.token, { doc: { v: 1 }, baseRev: 0 });
  const results = await Promise.all(Array.from({ length: 10 }, (_, i) => put(env, me.token, { doc: { v: 1, n: i }, baseRev: 1 })));
  assert.deepEqual(results.map((r) => r.status).sort(), [200, ...Array(9).fill(409)]);
  assert.equal((await get(env, me.token)).rev, 2);
});

test("the document must be a JSON object of at most 256 KiB; baseRev an integer >= 0", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  const cases = [
    [{ doc: [1, 2], baseRev: 0 }, 400, "bad_doc"],
    [{ doc: "text", baseRev: 0 }, 400, "bad_doc"],
    [{ doc: null, baseRev: 0 }, 400, "bad_doc"],
    [{ baseRev: 0 }, 400, "bad_doc"],
    [{ doc: {}, baseRev: -1 }, 400, "bad_base_rev"],
    [{ doc: {}, baseRev: 1.5 }, 400, "bad_base_rev"],
    [{ doc: {}, baseRev: "1" }, 400, "bad_base_rev"],
    [{ doc: {} }, 400, "bad_base_rev"],
    [{ doc: docOfSize(256 * KIB + 1), baseRev: 0 }, 413, "doc_too_large"]
  ];
  for (const [body, status, reason] of cases) {
    const res = await put(env, me.token, body);
    assert.deepEqual([JSON.stringify(body).slice(0, 40), res.status, res.body.reason], [JSON.stringify(body).slice(0, 40), status, reason]);
  }
  assert.equal((await get(env, me.token)).rev, 0, "nothing was stored");
  const exact = await put(env, me.token, { doc: docOfSize(256 * KIB), baseRev: 0 });
  assert.equal(exact.status, 200, "exactly 256 KiB is accepted");
  const huge = await api(env, "PUT", "/v1/me/progress", { cookie: me.token, rawBody: JSON.stringify({ doc: docOfSize(300 * KIB), baseRev: 1 }) });
  assert.deepEqual([huge.status, huge.body.reason], [413, "body_too_large"]);
});

test("600 writes per hour per account, then 429 with retryAfter", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  let rev = 0;
  for (let i = 0; i < 600; i += 1) {
    const res = await put(env, me.token, { doc: { v: 1, i }, baseRev: rev });
    assert.equal(res.status, 200);
    rev = res.body.rev;
  }
  const limited = await put(env, me.token, { doc: { v: 1 }, baseRev: rev });
  assert.deepEqual([limited.status, limited.body.reason], [429, "rate_limited"]);
  assert.ok(limited.body.retryAfter > 0);
  assert.equal((await get(env, me.token)).rev, 600, "reads are not limited");
});

test("each account sees only its own document; no session is 401", async () => {
  const { env } = await createHarness();
  const a = await seedAccount(env, { email: "a@example.test" });
  const b = await seedAccount(env, { email: "b@example.test" });
  await put(env, a.token, { doc: { v: 1, owner: "a" }, baseRev: 0 });
  assert.deepEqual(await get(env, b.token), { ok: true, rev: 0, doc: null, updatedAt: null });
  assert.equal((await api(env, "GET", "/v1/me/progress", {})).status, 401);
  assert.equal((await put(env, undefined, { doc: {}, baseRev: 0 })).status, 401);
});

test("a compare-and-swap write touches only the caller's document, never another account's at the same rev", async () => {
  const { env } = await createHarness();
  const a = await seedAccount(env, { email: "a@example.test" });
  const b = await seedAccount(env, { email: "b@example.test" });
  await put(env, a.token, { doc: { v: 1, owner: "a" }, baseRev: 0 });
  await put(env, b.token, { doc: { v: 1, owner: "b" }, baseRev: 0 }, { now: NOW + 1 });
  const res = await put(env, a.token, { doc: { v: 1, owner: "a", step: 2 }, baseRev: 1 }, { now: NOW + 9 });
  assert.deepEqual(res.body, { ok: true, rev: 2, updatedAt: NOW + 9 });
  assert.deepEqual(await get(env, b.token), { ok: true, rev: 1, doc: { v: 1, owner: "b" }, updatedAt: NOW + 1 });
  assert.deepEqual(await get(env, a.token), { ok: true, rev: 2, doc: { v: 1, owner: "a", step: 2 }, updatedAt: NOW + 9 });
});
