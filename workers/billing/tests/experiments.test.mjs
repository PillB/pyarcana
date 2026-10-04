/**
 * Experiments and events (DESIGN-v3 §F): the registry, GET /v1/experiments,
 * POST /v1/events and POST /v1/me/experiments/bind, against the client's
 * contract (src/lib/cloud/experiments.ts and measurement.ts, read only):
 *   - GET /v1/experiments -> {experiments: [{key, arms, weights, surface}]},
 *     enabled ones only (EXPERIMENTS_ENABLED), public, no id;
 *   - POST /v1/events {cid: 32 hex, events: [<= 25 x {name, experiment?, arm?,
 *     surface?, sectionIndex?}]}; token fields /^[a-z0-9_]{1,40}$/i,
 *     sectionIndex 1..999; the eleven allowlisted names;
 *   - POST /v1/me/experiments/bind {cid} with a session.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, count, createEnv, createHarness, seedAccount } from "./fixtures.mjs";

const CID = "0123456789abcdef0123456789abcdef";
const CID2 = "fedcba9876543210fedcba9876543210";
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";
const CLIENT_NAMES = [
  "exposure",
  "gate_view",
  "gate_trial_click",
  "trial_card_view",
  "checkout_open",
  "house_ad_view",
  "house_ad_click",
  "ad_optin_shown",
  "ad_optin_accept",
  "section_complete",
  "session_start",
  "signin_nudge_view",
  "signin_nudge_click"
];
const TOKEN = /^[a-z0-9_]{1,40}$/i;

/**
 * POST /v1/events as the browser sends it.
 * @param {Object} env Env.
 * @param {Object} body Body.
 * @param {Object} [opts] Extra api() options (headers merged over a browser UA).
 * @returns {Promise<Object>} Response.
 */
function postEvents(env, body, opts = {}) {
  return api(env, "POST", "/v1/events", { ...opts, body, headers: { "user-agent": UA, ...(opts.headers || {}) } });
}

/**
 * Stored event rows.
 * @param {Object} env Env.
 * @returns {Promise<Object[]>} Rows.
 */
async function events(env) {
  return (await env.DB.prepare("SELECT * FROM events ORDER BY id").all()).results;
}

/**
 * Stored arm rows.
 * @param {Object} env Env.
 * @returns {Promise<Object[]>} Rows `subject_kind:experiment:arm`.
 */
async function arms(env) {
  const rows = (await env.DB.prepare("SELECT subject_kind, experiment, arm FROM experiment_arms ORDER BY subject_kind, experiment").all()).results;
  return rows.map((r) => `${r.subject_kind}:${r.experiment}:${r.arm}`);
}

test("the registry holds the three designed experiments in the client's shape, control arm first", async () => {
  const { REGISTRY } = await import("../src/experiments.mjs");
  assert.deepEqual(REGISTRY.map((e) => e.key), ["aa_2026_q4", "pkg_ab_v1", "ads_house_v1"]);
  for (const e of REGISTRY) {
    assert.ok(TOKEN.test(e.key) && TOKEN.test(e.surface), e.key);
    assert.ok(e.arms.length >= 2 && e.arms.length === e.weights.length && new Set(e.arms).size === e.arms.length, e.key);
    assert.ok(e.arms.every((a) => TOKEN.test(a)) && e.weights.every((w) => Number.isInteger(w) && w > 0), e.key);
    assert.ok(Number.isInteger(e.minPerArm) && e.minPerArm >= 100 && Number.isInteger(e.minDays) && e.minDays >= 14, e.key);
    assert.equal(e.primaryMetric, "trial_14d", e.key);
  }
  const byKey = Object.fromEntries(REGISTRY.map((e) => [e.key, e]));
  assert.deepEqual(byKey.ads_house_v1.arms, ["none", "house"], "control (no promo slot) first");
  assert.ok(byKey.aa_2026_q4.surface.includes("gate"), "the A/A runs on the gate surface, so Pro is excluded client-side");
  assert.deepEqual(byKey.pkg_ab_v1.arms, ["a", "b"]);
});

test("GET /v1/experiments lists only the enabled ones, public and without a database", async () => {
  const off = await api(createEnv({ DB: undefined }), "GET", "/v1/experiments");
  assert.deepEqual([off.status, off.body], [200, { ok: true, experiments: [] }]);
  const env = createEnv({ DB: undefined, EXPERIMENTS_ENABLED: " ads_house_v1, bogus ,pkg_ab_v1" });
  const on = await api(env, "GET", "/v1/experiments");
  assert.equal(on.status, 200);
  assert.deepEqual(on.body.experiments, [
    { key: "pkg_ab_v1", arms: ["a", "b"], weights: [1, 1], surface: "gate" },
    { key: "ads_house_v1", arms: ["none", "house"], weights: [1, 1], surface: "ad_slot" }
  ]);
});

test("POST /v1/events stores allowlisted events under an HMAC of the id, never the id itself", async () => {
  const { env } = await createHarness();
  const body = {
    cid: CID,
    events: [
      { name: "gate_view", sectionIndex: 6, surface: "gate" },
      { name: "section_complete", sectionIndex: 3 },
      { name: "not_allowed" },
      { name: "gate_view", sectionIndex: 1000 },
      { name: "gate_view", surface: "no spaces" },
      { name: "gate_view", extra: "x" }
    ]
  };
  const res = await postEvents(env, body);
  assert.deepEqual([res.status, res.body], [200, { ok: true, accepted: 2, dropped: 4 }]);
  const rows = await events(env);
  assert.deepEqual(rows.map((r) => [r.name, r.section_idx, r.surface, r.day, r.received_at, r.qa]), [
    ["gate_view", 6, "gate", "2027-01-15", NOW, 0],
    ["section_complete", 3, null, "2027-01-15", NOW, 0]
  ]);
  assert.match(rows[0].cid_hash, /^[0-9a-f]{64}$/);
  assert.ok(!JSON.stringify(rows).includes(CID), "the raw id is never stored");
  const again = await postEvents(env, { cid: CID, events: [{ name: "session_start" }] });
  assert.equal((await events(env))[2].cid_hash, rows[0].cid_hash, "one id, one stable hash");
  assert.equal(again.status, 200);
  for (const name of CLIENT_NAMES.filter((n) => n !== "exposure")) {
    assert.equal((await postEvents(env, { cid: CID2, events: [{ name }] })).body.accepted, 1, name);
  }
});

test("an exposure records the FIRST arm per id and experiment, only for an enabled experiment and a registered arm", async () => {
  const { env } = await createHarness({ EXPERIMENTS_ENABLED: "ads_house_v1" });
  const exposure = (arm, experiment = "ads_house_v1") => ({ name: "exposure", experiment, arm, surface: "ad_slot" });
  const first = await postEvents(env, { cid: CID, events: [exposure("house"), exposure("none")] });
  assert.deepEqual(first.body, { ok: true, accepted: 2, dropped: 0 });
  await postEvents(env, { cid: CID, events: [exposure("none")] });
  assert.deepEqual(await arms(env), ["cid:ads_house_v1:house"], "intent to treat: the first arm stays");
  const refused = await postEvents(env, { cid: CID2, events: [exposure("purple"), exposure("a", "pkg_ab_v1"), exposure("a", "nope"), { name: "exposure", arm: "house" }] });
  assert.deepEqual(refused.body, { ok: true, accepted: 0, dropped: 4 });
  assert.deepEqual(await arms(env), ["cid:ads_house_v1:house"]);
});

test("GPC, DNT, a bot or missing user agent, and EVENTS_ENABLED=false answer 202 and store nothing", async () => {
  const { env } = await createHarness({ EXPERIMENTS_ENABLED: "ads_house_v1" });
  const body = { cid: CID, events: [{ name: "gate_view" }, { name: "exposure", experiment: "ads_house_v1", arm: "house" }] };
  const cases = [
    [{ "sec-gpc": "1" }, "opted_out"],
    [{ dnt: "1" }, "opted_out"],
    [{ "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" }, "automated"],
    [{ "user-agent": "Mozilla/5.0 HeadlessChrome/129.0" }, "automated"],
    [{ "user-agent": "" }, "automated"]
  ];
  for (const [headers, reason] of cases) {
    const res = await postEvents(env, body, { headers });
    assert.deepEqual([res.status, res.body], [202, { ok: true, accepted: 0, reason }], JSON.stringify(headers));
  }
  const off = await createHarness({ EVENTS_ENABLED: "false" });
  const res = await postEvents(off.env, body);
  assert.deepEqual([res.status, res.body.reason], [202, "events_disabled"]);
  assert.equal(await count(env, "FROM events"), 0);
  assert.equal(await count(env, "FROM experiment_arms"), 0);
  assert.equal(await count(off.env, "FROM events"), 0);
});

test("a malformed batch is refused whole: bad id, no events, more than 25, not an array; over 16 KB is 413", async () => {
  const { env } = await createHarness();
  const cases = [
    [{ cid: "ABC", events: [{ name: "gate_view" }] }, "bad_cid"],
    [{ cid: CID.toUpperCase(), events: [{ name: "gate_view" }] }, "bad_cid"],
    [{ events: [{ name: "gate_view" }] }, "bad_cid"],
    [{ cid: CID, events: [] }, "bad_events"],
    [{ cid: CID, events: "gate_view" }, "bad_events"],
    [{ cid: CID, events: Array.from({ length: 26 }, () => ({ name: "gate_view" })) }, "bad_events"]
  ];
  for (const [body, reason] of cases) {
    const res = await postEvents(env, body);
    assert.deepEqual([res.status, res.body.reason], [400, reason], JSON.stringify(body).slice(0, 60));
  }
  const big = await postEvents(env, { cid: CID, events: [{ name: "gate_view", pad: "x".repeat(17000) }] });
  assert.deepEqual([big.status, big.body.reason], [413, "body_too_large"]);
  assert.equal(await count(env, "FROM events"), 0);
});

test("the qa flag is kept, so QA-mode traffic can be excluded when results are read", async () => {
  const { env } = await createHarness();
  await postEvents(env, { cid: CID, qa: true, events: [{ name: "gate_view" }] });
  const bad = await postEvents(env, { cid: CID, qa: "yes", events: [{ name: "gate_view" }] });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_qa"]);
  assert.deepEqual((await events(env)).map((r) => r.qa), [1]);
});

test("rate limits: per id and per network, in HMAC buckets", async () => {
  const { EVENTS_PER_CID_HOUR, EVENTS_PER_IP_HOUR } = await import("../src/events.mjs");
  assert.deepEqual([EVENTS_PER_CID_HOUR, EVENTS_PER_IP_HOUR], [60, 600]);
  const { env } = await createHarness();
  const one = { cid: CID, events: [{ name: "gate_view" }] };
  for (let i = 0; i < EVENTS_PER_CID_HOUR; i += 1) {
    assert.equal((await postEvents(env, one)).status, 200);
  }
  const limited = await postEvents(env, one);
  assert.deepEqual([limited.status, limited.body.reason], [429, "rate_limited"]);
  assert.equal((await postEvents(env, { ...one, cid: CID2 })).status, 200, "another id on the same network still gets through");
  const buckets = (await env.DB.prepare("SELECT bucket FROM rate_limits").all()).results.map((r) => r.bucket);
  assert.ok(buckets.every((b) => /^[0-9a-f]{64}$/.test(b)) && !buckets.join().includes(CID));

  const net = await createHarness();
  const ip = { "cf-connecting-ip": "203.0.113.9" };
  for (let i = 0; i < EVENTS_PER_IP_HOUR; i += 1) {
    const cid = i.toString(16).padStart(32, "0");
    assert.equal((await postEvents(net.env, { cid, events: [{ name: "gate_view" }] }, { headers: ip })).status, 200);
  }
  const blocked = await postEvents(net.env, { cid: CID, events: [{ name: "gate_view" }] }, { headers: ip });
  assert.deepEqual([blocked.status, blocked.body.reason], [429, "rate_limited"]);
});

test("POST /v1/me/experiments/bind links the id to the account; the account's first arm wins; returns the stored arms", async () => {
  const { env } = await createHarness({ EXPERIMENTS_ENABLED: "ads_house_v1,pkg_ab_v1,aa_2026_q4" });
  const me = await seedAccount(env, { email: "ana@example.test" });
  await postEvents(env, { cid: CID, events: [{ name: "exposure", experiment: "ads_house_v1", arm: "house" }] });
  await postEvents(env, { cid: CID2, events: [{ name: "exposure", experiment: "ads_house_v1", arm: "none" }, { name: "exposure", experiment: "pkg_ab_v1", arm: "b" }] });

  const anon = await api(env, "POST", "/v1/me/experiments/bind", { body: { cid: CID } });
  assert.equal(anon.status, 401);
  const bad = await api(env, "POST", "/v1/me/experiments/bind", { cookie: me.token, body: { cid: "nope" } });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_cid"]);

  const first = await api(env, "POST", "/v1/me/experiments/bind", { cookie: me.token, body: { cid: CID } });
  assert.deepEqual([first.status, first.body], [200, { ok: true, arms: { ads_house_v1: "house" } }]);
  const second = await api(env, "POST", "/v1/me/experiments/bind", { cookie: me.token, body: { cid: CID2 } });
  assert.deepEqual(second.body, { ok: true, arms: { ads_house_v1: "house", pkg_ab_v1: "b" } }, "a second device never re-arms the account");
  const bindings = (await env.DB.prepare("SELECT account_id FROM experiment_bindings").all()).results;
  assert.deepEqual(bindings.map((b) => b.account_id), [me.account.id, me.account.id]);

  // An exposure that arrives after the bind is recorded for the account too, first arm kept.
  const later = [{ name: "exposure", experiment: "pkg_ab_v1", arm: "a" }, { name: "exposure", experiment: "aa_2026_q4", arm: "b" }];
  await api(env, "POST", "/v1/events", { body: { cid: CID, events: later }, headers: { "user-agent": UA } });
  const acct = (await env.DB.prepare("SELECT experiment, arm FROM experiment_arms WHERE subject = ?1 ORDER BY experiment").bind(me.account.id).all()).results;
  assert.deepEqual(acct, [
    { experiment: "aa_2026_q4", arm: "b" },
    { experiment: "ads_house_v1", arm: "house" },
    { experiment: "pkg_ab_v1", arm: "b" }
  ]);
});

test("an id already bound to another account stays with it (first binding wins)", async () => {
  const { env } = await createHarness({ EXPERIMENTS_ENABLED: "ads_house_v1" });
  const ana = await seedAccount(env, { email: "ana@example.test" });
  const luis = await seedAccount(env, { email: "luis@example.test" });
  await postEvents(env, { cid: CID, events: [{ name: "exposure", experiment: "ads_house_v1", arm: "house" }] });
  await api(env, "POST", "/v1/me/experiments/bind", { cookie: ana.token, body: { cid: CID } });
  const res = await api(env, "POST", "/v1/me/experiments/bind", { cookie: luis.token, body: { cid: CID } });
  assert.deepEqual([res.status, res.body], [200, { ok: true, arms: {} }]);
  const owner = await env.DB.prepare("SELECT account_id FROM experiment_bindings WHERE 1").first("account_id");
  assert.equal(owner, ana.account.id);
  assert.equal(await count(env, "FROM experiment_arms WHERE subject = ?1", luis.account.id), 0);
});
