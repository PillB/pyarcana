/**
 * Satisfaction (DESIGN-v3 §G) and the consent record (§F):
 * - POST /v1/surveys {kind, score?, reasonCode?, text?, sectionIndex?, cid?},
 *   anonymous or signed-in, validated like src/lib/cloud/survey-ui.ts builds
 *   it (section_csat 1..5, nps 0..10, gate_reason and cancel_reason from the
 *   client's reason lists, text <= 500, sectionIndex 1..999, cid 32 hex);
 * - GET /v1/admin/surveys?kind= (admin): flat aggregates plus the latest texts
 *   (src/lib/cloud/admin-api.ts surveyView reads flat numbers and `latest`);
 * - POST /v1/me/consents {kind: 'measurement', value, version, at}
 *   (src/lib/cloud/consent-sync.ts CONSENT_PATH), session required.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, count, createHarness, seedAccount, sql } from "./fixtures.mjs";
import { meanFromSums, npsSummary } from "../src/stats.mjs";

const CID = "0123456789abcdef0123456789abcdef";
const GATE_REASONS = ["price", "not_now", "free_enough", "unsure_value", "other"];
const CANCEL_REASONS = ["price", "not_using", "finished", "technical", "other"];

/**
 * POST a survey answer.
 * @param {Object} env Env.
 * @param {Object} body Body.
 * @param {Object} [opts] api() options.
 * @returns {Promise<Object>} Response.
 */
function answer(env, body, opts = {}) {
  return api(env, "POST", "/v1/surveys", { ...opts, body });
}

test("each kind is stored as the client builds it; the id is hashed; a signed-in answer keeps its account", async () => {
  const { env } = await createHarness();
  const bodies = [
    { kind: "section_csat", score: 4, sectionIndex: 3, text: "  Muy claro  ", cid: CID },
    { kind: "nps", score: 9 },
    { kind: "gate_reason", reasonCode: "price", sectionIndex: 6 },
    { kind: "cancel_reason", reasonCode: "finished", text: "Terminé el curso" }
  ];
  for (const body of bodies) {
    const res = await answer(env, body);
    assert.equal(res.status, 200, JSON.stringify(body));
    assert.match(res.body.id, /^srv_[A-Za-z0-9_-]{22}$/);
  }
  const rows = (await env.DB.prepare("SELECT kind, score, reason_code, text, section_idx, account_id, cid_hash FROM survey_responses ORDER BY created_at, kind").all()).results;
  const csat = rows.find((r) => r.kind === "section_csat");
  assert.deepEqual([csat.score, csat.text, csat.section_idx, csat.account_id], [4, "Muy claro", 3, null]);
  assert.match(csat.cid_hash, /^[0-9a-f]{64}$/);
  assert.ok(!JSON.stringify(rows).includes(CID));
  assert.equal(rows.find((r) => r.kind === "gate_reason").reason_code, "price");

  const me = await seedAccount(env, { email: "ana@example.test" });
  await answer(env, { kind: "nps", score: 10 }, { cookie: me.token });
  assert.equal(await count(env, "FROM survey_responses WHERE account_id = ?1", me.account.id), 1);
  for (const reasonCode of GATE_REASONS) {
    assert.equal((await answer(env, { kind: "gate_reason", reasonCode })).status, 200, reasonCode);
  }
  for (const reasonCode of CANCEL_REASONS) {
    assert.equal((await answer(env, { kind: "cancel_reason", reasonCode })).status, 200, reasonCode);
  }
});

test("answers the client would never build are refused with a reason", async () => {
  const { env } = await createHarness();
  const cases = [
    [{ kind: "csat", score: 4 }, "bad_kind"],
    [{ kind: "section_csat" }, "bad_score"],
    [{ kind: "section_csat", score: 0 }, "bad_score"],
    [{ kind: "section_csat", score: 6 }, "bad_score"],
    [{ kind: "section_csat", score: 2.5 }, "bad_score"],
    [{ kind: "section_csat", score: "3" }, "bad_score"],
    [{ kind: "section_csat", score: 3, reasonCode: "price" }, "bad_reason"],
    [{ kind: "nps", score: 11 }, "bad_score"],
    [{ kind: "nps", score: -1 }, "bad_score"],
    [{ kind: "gate_reason", reasonCode: "not_using" }, "bad_reason"],
    [{ kind: "gate_reason", reasonCode: "price", score: 3 }, "bad_score"],
    [{ kind: "cancel_reason" }, "bad_reason"],
    [{ kind: "nps", score: 8, text: "x".repeat(501) }, "bad_text"],
    [{ kind: "nps", score: 8, text: 5 }, "bad_text"],
    [{ kind: "nps", score: 8, sectionIndex: 0 }, "bad_section"],
    [{ kind: "nps", score: 8, sectionIndex: 1000 }, "bad_section"],
    [{ kind: "nps", score: 8, cid: "ABC" }, "bad_cid"]
  ];
  for (const [body, reason] of cases) {
    const res = await answer(env, body);
    assert.deepEqual([res.status, res.body.reason], [400, reason], JSON.stringify(body).slice(0, 80));
  }
  assert.equal((await answer(env, { kind: "nps", score: 8, text: "x".repeat(500) })).status, 200, "500 characters is the limit");
  assert.equal(await count(env, "FROM survey_responses"), 1);
});

test("rate limits: 20 answers per network per hour, 30 per account", async () => {
  const { SURVEYS_PER_IP_HOUR, SURVEYS_PER_ACCOUNT_HOUR } = await import("../src/surveys.mjs");
  assert.deepEqual([SURVEYS_PER_IP_HOUR, SURVEYS_PER_ACCOUNT_HOUR], [20, 30]);
  const { env } = await createHarness();
  const ip = { "cf-connecting-ip": "198.51.100.7" };
  for (let i = 0; i < 20; i += 1) {
    assert.equal((await answer(env, { kind: "nps", score: 7 }, { headers: ip })).status, 200);
  }
  const blocked = await answer(env, { kind: "nps", score: 7 }, { headers: ip });
  assert.deepEqual([blocked.status, blocked.body.reason], [429, "rate_limited"]);
  assert.equal((await answer(env, { kind: "nps", score: 7 }, { headers: { "cf-connecting-ip": "198.51.100.8" } })).status, 200);

  const me = await seedAccount(env, { email: "ana@example.test" });
  let last = null;
  for (let i = 0; i < 31; i += 1) {
    last = await answer(env, { kind: "nps", score: 7 }, { cookie: me.token, headers: { "cf-connecting-ip": `192.0.2.${i}` } });
  }
  assert.deepEqual([last.status, last.body.reason], [429, "rate_limited"], "a signed-in account is capped whatever its address");
});

let seeded = 0;

/**
 * Insert survey rows directly (ids unique across the file).
 * @param {Object} env Env.
 * @param {Array<Object>} rows `{kind, score?, reason?, text?, at?, section?}`.
 * @returns {Promise<void>} Resolves when inserted.
 */
async function seedAnswers(env, rows) {
  const stmt = "INSERT INTO survey_responses (id, created_at, kind, score, reason_code, text, section_idx) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)";
  await env.DB.batch(
    rows.map((r, i) => env.DB.prepare(stmt).bind(`srv_seed${(seeded += 1)}`, r.at === undefined ? NOW - 1000 + i : r.at, r.kind, r.score === undefined ? null : r.score, r.reason || null, r.text || null, r.section || null))
  );
}

test("GET /v1/admin/surveys: CSAT mean with interval and the score split, newest texts first", async () => {
  const { env } = await createHarness();
  const scores = [5, 4, 4, 3, 5, 2, 5, 4];
  await seedAnswers(env, scores.map((score, i) => ({ kind: "section_csat", score, section: 7, text: i % 2 ? `texto ${i}` : undefined })));
  await seedAnswers(env, [{ kind: "nps", score: 10, text: "otro tipo" }].map((r) => ({ ...r, at: NOW })));
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const learner = await seedAccount(env, { email: "ana@example.test" });
  assert.equal((await api(env, "GET", "/v1/admin/surveys?kind=nps", { cookie: learner.token })).status, 403);
  assert.equal((await api(env, "GET", "/v1/admin/surveys", { cookie: admin.token })).body.reason, "bad_kind");
  const res = await api(env, "GET", "/v1/admin/surveys?kind=section_csat", { cookie: admin.token });
  assert.equal(res.status, 200);
  const sum = scores.reduce((a, b) => a + b, 0);
  const m = meanFromSums(scores.length, sum, scores.reduce((a, b) => a + b * b, 0));
  const { latest, ...flat } = res.body;
  assert.deepEqual(flat, {
    ok: true,
    kind: "section_csat",
    n: 8,
    mean: m.mean,
    meanLow: m.lo,
    meanHigh: m.hi,
    score_1: 0,
    score_2: 1,
    score_3: 1,
    score_4: 3,
    score_5: 3
  });
  assert.deepEqual(latest.map((t) => t.text), ["texto 7", "texto 5", "texto 3", "texto 1"]);
  assert.deepEqual(Object.keys(latest[0]).sort(), ["createdAt", "reasonCode", "score", "sectionIndex", "text"], "no account, no id");
});

test("GET /v1/admin/surveys: NPS with an interval only from 30 answers; reasons counted per code", async () => {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  await seedAnswers(env, [9, 10, 7, 3].map((score) => ({ kind: "nps", score })));
  const few = (await api(env, "GET", "/v1/admin/surveys?kind=nps", { cookie: admin.token })).body;
  assert.deepEqual([few.n, few.nps, few.promoters, few.passives, few.detractors, "npsLow" in few], [4, 25, 2, 1, 1, false]);
  await sql(env, "DELETE FROM survey_responses");
  const many = Array.from({ length: 30 }, (_, i) => ({ kind: "nps", score: i % 3 === 0 ? 3 : 10 }));
  await seedAnswers(env, many);
  const body = (await api(env, "GET", "/v1/admin/surveys?kind=nps", { cookie: admin.token })).body;
  const s = npsSummary(20, 0, 10);
  assert.deepEqual([body.n, body.nps, body.npsLow, body.npsHigh], [30, s.nps, s.lo, s.hi]);

  await seedAnswers(env, ["price", "price", "other"].map((reason, i) => ({ kind: "gate_reason", reason, at: NOW - 5000 - i })));
  const reasons = (await api(env, "GET", "/v1/admin/surveys?kind=gate_reason", { cookie: admin.token })).body;
  assert.deepEqual(
    [reasons.n, reasons.reason_price, reasons.reason_not_now, reasons.reason_free_enough, reasons.reason_unsure_value, reasons.reason_other],
    [3, 2, 0, 0, 0, 1]
  );
});

test("POST /v1/me/consents stores the browser's choice for the signed-in account", async () => {
  const { env } = await createHarness();
  const anon = await api(env, "POST", "/v1/me/consents", { body: { kind: "measurement", value: "granted", version: 2, at: "2027-01-15T07:59:00.000Z" } });
  assert.equal(anon.status, 401);
  const me = await seedAccount(env, { email: "ana@example.test" });
  const ok = await api(env, "POST", "/v1/me/consents", { cookie: me.token, body: { kind: "measurement", value: "granted", version: 2, at: "2027-01-15T07:59:00.000Z" } });
  assert.deepEqual([ok.status, ok.body], [200, { ok: true }]);
  await api(env, "POST", "/v1/me/consents", { cookie: me.token, body: { kind: "measurement", value: "denied", version: 2, at: "2027-01-15T08:00:00.000Z" } });
  const rows = (await env.DB.prepare("SELECT account_id, kind, value, version, client_at, created_at FROM consents ORDER BY id").all()).results;
  assert.deepEqual(rows, [
    { account_id: me.account.id, kind: "measurement", value: "granted", version: 2, client_at: "2027-01-15T07:59:00.000Z", created_at: NOW },
    { account_id: me.account.id, kind: "measurement", value: "denied", version: 2, client_at: "2027-01-15T08:00:00.000Z", created_at: NOW }
  ]);
  const cases = [
    [{ kind: "ads", value: "granted", version: 2, at: "2027-01-15T07:59:00.000Z" }, "bad_kind"],
    [{ kind: "measurement", value: "yes", version: 2, at: "2027-01-15T07:59:00.000Z" }, "bad_value"],
    [{ kind: "measurement", value: "granted", version: 0, at: "2027-01-15T07:59:00.000Z" }, "bad_version"],
    [{ kind: "measurement", value: "granted", version: "2", at: "2027-01-15T07:59:00.000Z" }, "bad_version"],
    [{ kind: "measurement", value: "granted", version: 2, at: "yesterday" }, "bad_at"],
    [{ kind: "measurement", value: "granted", version: 2, at: "2027-02-31T00:00:00.000Z" }, "bad_at"]
  ];
  for (const [body, reason] of cases) {
    const res = await api(env, "POST", "/v1/me/consents", { cookie: me.token, body });
    assert.deepEqual([res.status, res.body.reason], [400, reason], JSON.stringify(body));
  }
  const empty = await api(env, "POST", "/v1/me/consents", { cookie: me.token, body: { kind: "measurement", value: "granted", version: 2, at: "" } });
  assert.equal(empty.status, 200, "consent.ts writes at: '' when an old record had no time; the choice still counts");
});

test("consents are rate-limited per account (30 per hour)", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env, { email: "ana@example.test" });
  const body = { kind: "measurement", value: "granted", version: 2, at: "2027-01-15T07:59:00.000Z" };
  for (let i = 0; i < 30; i += 1) {
    assert.equal((await api(env, "POST", "/v1/me/consents", { cookie: me.token, body })).status, 200);
  }
  const res = await api(env, "POST", "/v1/me/consents", { cookie: me.token, body });
  assert.deepEqual([res.status, res.body.reason], [429, "rate_limited"]);
});
