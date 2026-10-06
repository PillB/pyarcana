/**
 * Measurement, surveys and consents under the data-subject rights and the
 * retention policy (DESIGN-v3 §F "Retention 180 d", §G "Retention 2 years;
 * exported and deleted with the account"):
 * - GET /v1/me/export includes the person's consents, survey answers (their
 *   own and those sent under a measurement id bound to them), and the
 *   measurement rows linked to them (arms, events), never an id hash;
 * - DELETE /v1/me removes all of it, and nobody else's;
 * - the daily sweep drops events, arms and bindings after 180 days and survey
 *   answers after 2 years, and keeps consent records.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, count, createHarness, seedAccount, sql } from "./fixtures.mjs";
import { DAILY_CRON, HOURLY_CRON, runScheduled } from "../src/retention.mjs";

const DAY = 86400;
const CID = "0123456789abcdef0123456789abcdef";
const OTHER_CID = "fedcba9876543210fedcba9876543210";
const UA = { "user-agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/129.0" };

/**
 * A learner who was measured, answered surveys and recorded a consent, plus a
 * bystander with the same kinds of rows.
 * @returns {Promise<Object>} Harness.
 */
async function measuredPair() {
  const { env } = await createHarness({ EXPERIMENTS_ENABLED: "ads_house_v1" });
  const me = await seedAccount(env, { email: "ana@example.test" });
  const other = await seedAccount(env, { email: "luis@example.test" });
  const exposure = (arm) => [{ name: "exposure", experiment: "ads_house_v1", arm }, { name: "gate_view", sectionIndex: 6 }];
  await api(env, "POST", "/v1/events", { body: { cid: CID, events: exposure("house") }, headers: UA });
  await api(env, "POST", "/v1/events", { body: { cid: OTHER_CID, events: exposure("none") }, headers: UA });
  await api(env, "POST", "/v1/surveys", { body: { kind: "gate_reason", reasonCode: "price", cid: CID } });
  await api(env, "POST", "/v1/surveys", { body: { kind: "gate_reason", reasonCode: "other", text: "Luis escribe", cid: OTHER_CID } });
  await api(env, "POST", "/v1/surveys", { cookie: me.token, body: { kind: "nps", score: 9, text: "Me gusta" } });
  await api(env, "POST", "/v1/surveys", { cookie: other.token, body: { kind: "nps", score: 2, text: "Luis no" } });
  await api(env, "POST", "/v1/me/experiments/bind", { cookie: me.token, body: { cid: CID } });
  await api(env, "POST", "/v1/me/experiments/bind", { cookie: other.token, body: { cid: OTHER_CID } });
  const consent = { kind: "measurement", value: "granted", version: 2, at: "2027-01-15T07:59:00.000Z" };
  await api(env, "POST", "/v1/me/consents", { cookie: me.token, body: consent });
  await api(env, "POST", "/v1/me/consents", { cookie: other.token, body: { ...consent, value: "denied" } });
  return { env, me, other };
}

test("the export holds the person's consents, survey answers and measurement rows, and no id hash", async () => {
  const { env, me } = await measuredPair();
  const res = await api(env, "GET", "/v1/me/export", { cookie: me.token });
  assert.equal(res.status, 200);
  const e = res.body;
  assert.deepEqual(e.consents, [{ kind: "measurement", value: "granted", version: 2, at: "2027-01-15T07:59:00.000Z", createdAt: NOW }]);
  assert.deepEqual(
    e.surveys.map((s) => [s.kind, s.score, s.reasonCode, s.text]).sort(),
    [["gate_reason", null, "price", null], ["nps", 9, null, "Me gusta"]]
  );
  assert.deepEqual(e.measurement.arms, [{ experiment: "ads_house_v1", arm: "house", firstAt: NOW }]);
  assert.deepEqual(e.measurement.events.map((x) => [x.name, x.experiment, x.arm, x.sectionIndex]).sort(), [
    ["exposure", "ads_house_v1", "house", null],
    ["gate_view", null, null, 6]
  ]);
  assert.equal(e.measurement.devices, 1);
  const text = JSON.stringify(e);
  const hashes = (await env.DB.prepare("SELECT cid_hash FROM experiment_bindings").all()).results.map((r) => r.cid_hash);
  for (const secret of [...hashes, CID, OTHER_CID, "Luis escribe", "Luis no", "denied"]) {
    assert.ok(!text.includes(secret), `the export must not contain ${secret.slice(0, 12)}`);
  }
});

test("deleting the account deletes its consents, answers and measurement rows, and nobody else's", async () => {
  const { env, me, other } = await measuredPair();
  const before = await count(env, "FROM events");
  const res = await api(env, "DELETE", "/v1/me", { cookie: me.token, body: { confirm: "DELETE" } });
  assert.equal(res.status, 200);
  assert.equal(await count(env, "FROM consents WHERE account_id = ?1", me.account.id), 0);
  assert.equal(await count(env, "FROM experiment_bindings WHERE account_id = ?1", me.account.id), 0);
  assert.equal(await count(env, "FROM experiment_arms WHERE subject = ?1", me.account.id), 0);
  assert.equal(await count(env, "FROM survey_responses WHERE account_id = ?1", me.account.id), 0);
  assert.equal(await count(env, "FROM survey_responses WHERE reason_code = 'price'"), 0, "the answer sent under the bound id goes too");
  assert.equal(await count(env, "FROM events"), before - 2, "the bound id's events go");
  assert.equal(await count(env, "FROM experiment_arms WHERE subject_kind = 'cid'"), 1, "the bound id's arm goes");
  // The bystander keeps everything.
  assert.equal(await count(env, "FROM consents WHERE account_id = ?1", other.account.id), 1);
  assert.equal(await count(env, "FROM experiment_bindings WHERE account_id = ?1", other.account.id), 1);
  assert.equal(await count(env, "FROM experiment_arms WHERE subject = ?1", other.account.id), 1);
  assert.equal(await count(env, "FROM survey_responses"), 2);
  const exported = await api(env, "GET", "/v1/me/export", { cookie: other.token });
  assert.deepEqual([exported.body.measurement.events.length, exported.body.surveys.length], [2, 2]);
});

test("the daily sweep drops measurement after 180 days and survey answers after 2 years; consents stay", async () => {
  const { env } = await createHarness();
  const rows = [
    ["INSERT INTO events (received_at, day, cid_hash, name) VALUES (?1, 'd', 'old', 'gate_view')", NOW - 181 * DAY],
    ["INSERT INTO events (received_at, day, cid_hash, name) VALUES (?1, 'd', 'new', 'gate_view')", NOW - 180 * DAY + 60],
    ["INSERT INTO experiment_arms (subject, subject_kind, experiment, arm, first_at) VALUES ('old', 'cid', 'x', 'a', ?1)", NOW - 181 * DAY],
    ["INSERT INTO experiment_arms (subject, subject_kind, experiment, arm, first_at) VALUES ('new', 'cid', 'x', 'a', ?1)", NOW - 180 * DAY + 60],
    ["INSERT INTO experiment_bindings (cid_hash, account_id, created_at) VALUES ('old', 'acct_o', ?1)", NOW - 181 * DAY],
    ["INSERT INTO experiment_bindings (cid_hash, account_id, created_at) VALUES ('new', 'acct_n', ?1)", NOW - 180 * DAY + 60],
    ["INSERT INTO survey_responses (id, created_at, kind, score) VALUES ('srv_old', ?1, 'nps', 5)", NOW - 731 * DAY],
    ["INSERT INTO survey_responses (id, created_at, kind, score) VALUES ('srv_new', ?1, 'nps', 5)", NOW - 730 * DAY + 60],
    ["INSERT INTO consents (account_id, kind, value, version, created_at) VALUES ('acct_o', 'measurement', 'granted', 1, ?1)", NOW - 900 * DAY]
  ];
  for (const [text, at] of rows) {
    await sql(env, text, at);
  }
  const logs = [];
  await runScheduled(env, { cron: HOURLY_CRON, now: NOW, log: (l) => logs.push(l) });
  assert.equal(await count(env, "FROM events"), 2, "the hourly run does not sweep");
  await runScheduled(env, { cron: DAILY_CRON, now: NOW, log: (l) => logs.push(l) });
  const ids = async (q) => (await env.DB.prepare(q).all()).results.map((r) => r.id);
  assert.deepEqual(await ids("SELECT cid_hash AS id FROM events"), ["new"]);
  assert.deepEqual(await ids("SELECT subject AS id FROM experiment_arms"), ["new"]);
  assert.deepEqual(await ids("SELECT cid_hash AS id FROM experiment_bindings"), ["new"]);
  assert.deepEqual(await ids("SELECT id FROM survey_responses"), ["srv_new"]);
  assert.equal(await count(env, "FROM consents"), 1);
  assert.ok(logs.some((l) => l.startsWith("measurement sweep ") && l.includes('"events":1') && l.includes('"surveys":1')), logs.join("\n"));
});
