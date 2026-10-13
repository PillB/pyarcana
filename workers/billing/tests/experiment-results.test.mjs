/**
 * GET /v1/admin/experiments and GET /v1/admin/experiments/results?key=
 * (DESIGN-v3 §F): exposures per arm (first exposure, intent to treat), trial
 * starts and payments within 14 days through the id -> account binding, D7
 * return from events, Wilson intervals, Newcombe differences against the
 * control arm, SRM at p < 0.001, the plan gate (no comparison before
 * min_per_arm matured people per arm AND min_days), exclusions computed at
 * read time, and the arm-switch rate. The client reads {plan: {met}, srm:
 * {flagged}, arms: [{arm, <flat numbers>}]} (src/lib/cloud/admin-api.ts).
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, createHarness, seedAccount, sql } from "./fixtures.mjs";
import { compareRates, sampleRatioMismatch, wilson } from "../src/stats.mjs";

const DAY = 86400;

/**
 * Insert cid subjects in one arm.
 * @param {Object} env Env.
 * @param {{key: string, arm: string, n: number, prefix: string, firstAt?: number}} c Cohort.
 * @returns {Promise<string[]>} Subject ids.
 */
async function cohort(env, c) {
  const ids = Array.from({ length: c.n }, (_, i) => `${c.prefix}${String(i).padStart(4, "0")}`);
  const stmt = "INSERT INTO experiment_arms (subject, subject_kind, experiment, arm, first_at) VALUES (?1, 'cid', ?2, ?3, ?4)";
  await env.DB.batch(ids.map((id) => env.DB.prepare(stmt).bind(id, c.key, c.arm, c.firstAt === undefined ? NOW - 20 * DAY : c.firstAt)));
  return ids;
}

/**
 * Bind subjects to fresh accounts, optionally with a grant/charge/event each.
 * @param {Object} env Env.
 * @param {string[]} cids Subjects.
 * @param {{trialAfter?: number, paidAfter?: number, refunded?: boolean, eventAfter?: number, grantKind?: string, email?: function,
 *   unverified?: boolean}} o What each gets (seconds after first exposure).
 * @returns {Promise<string[]>} Account ids.
 */
async function bindAll(env, cids, o) {
  const statements = [];
  const ids = [];
  for (const cid of cids) {
    const id = `acct_${cid}`;
    ids.push(id);
    const first = await env.DB.prepare("SELECT first_at FROM experiment_arms WHERE subject = ?1").bind(cid).first("first_at");
    const email = o.email ? o.email(cid) : null;
    statements.push(env.DB.prepare("INSERT INTO accounts (id, email, email_normalized, email_verified, created_at, updated_at) VALUES (?1, ?2, ?2, ?3, ?4, ?4)").bind(id, email, email && !o.unverified ? 1 : 0, first));
    statements.push(env.DB.prepare("INSERT INTO experiment_bindings (cid_hash, account_id, created_at) VALUES (?1, ?2, ?3)").bind(cid, id, first));
    if (o.trialAfter !== undefined) {
      statements.push(env.DB.prepare("INSERT INTO grants (id, account_id, kind, days, created_at) VALUES (?1, ?2, 'trial', 7, ?3)").bind(`g_t_${cid}`, id, first + o.trialAfter));
    }
    if (o.grantKind) {
      statements.push(env.DB.prepare("INSERT INTO grants (id, account_id, kind, days, created_at) VALUES (?1, ?2, ?3, 30, ?4)").bind(`g_k_${cid}`, id, o.grantKind, first));
    }
    if (o.paidAfter !== undefined) {
      statements.push(
        env.DB
          .prepare(
            `INSERT INTO charges (id, provider, provider_charge_id, account_id, amount_minor, currency, status, approved_at, period_start, period_end,
               refunded_at, created_at, updated_at)
             VALUES (?1, 'creem', ?1, ?2, 799, 'USD', 'approved', ?3, ?3, ?4, ?5, ?3, ?3)`
          )
          .bind(`ch_${cid}`, id, first + o.paidAfter, first + o.paidAfter + 30 * DAY, o.refunded ? first + o.paidAfter + DAY : null)
      );
    }
    if (o.eventAfter !== undefined) {
      statements.push(env.DB.prepare("INSERT INTO events (received_at, day, cid_hash, name) VALUES (?1, '2027-01-01', ?2, 'session_start')").bind(first + o.eventAfter, cid));
    }
  }
  await env.DB.batch(statements);
  return ids;
}

/**
 * An admin session (listed address, fresh Google session).
 * @param {Object} env Env.
 * @returns {Promise<string>} Cookie token.
 */
async function adminToken(env) {
  return (await seedAccount(env, { email: "owner@gmail.com", method: "google" })).token;
}

/**
 * GET results.
 * @param {Object} env Env.
 * @param {string} token Cookie.
 * @param {string} key Key.
 * @returns {Promise<Object>} Response.
 */
function results(env, token, key) {
  return api(env, "GET", `/v1/admin/experiments/results?key=${key}`, { cookie: token });
}

test("admin only: a learner gets 403; a bad or unknown key is refused", async () => {
  const { env } = await createHarness();
  const learner = await seedAccount(env, { email: "ana@example.test" });
  assert.equal((await api(env, "GET", "/v1/admin/experiments", { cookie: learner.token })).status, 403);
  assert.equal((await results(env, learner.token, "pkg_ab_v1")).status, 403);
  const admin = await adminToken(env);
  assert.deepEqual((await api(env, "GET", "/v1/admin/experiments/results", { cookie: admin })).body.reason, "bad_key");
  const unknown = await results(env, admin, "nope_v9");
  assert.deepEqual([unknown.status, unknown.body.reason], [404, "unknown_experiment"]);
});

test("GET /v1/admin/experiments lists the registry with enabled flags, raw exposures per arm and SRM", async () => {
  const { env } = await createHarness({ EXPERIMENTS_ENABLED: "pkg_ab_v1" });
  await cohort(env, { key: "pkg_ab_v1", arm: "a", n: 440, prefix: "ca" });
  await cohort(env, { key: "pkg_ab_v1", arm: "b", n: 560, prefix: "cb" });
  await sql(env, "INSERT INTO experiment_arms (subject, subject_kind, experiment, arm, first_at) VALUES ('acct_x', 'account', 'pkg_ab_v1', 'a', ?1)", NOW);
  const res = await api(env, "GET", "/v1/admin/experiments", { cookie: await adminToken(env) });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.experiments.map((e) => [e.key, e.enabled]), [["aa_2026_q4", false], ["pkg_ab_v1", true], ["ads_house_v1", false]]);
  const pkg = res.body.experiments[1];
  assert.deepEqual(pkg.exposed, { a: 440, b: 560 }, "account subjects are copies, never counted");
  assert.deepEqual([pkg.arms, pkg.weights, pkg.surface, pkg.minPerArm, pkg.minDays, pkg.primaryMetric], [["a", "b"], [1, 1], "gate", 400, 14, "trial_14d"]);
  assert.equal(pkg.srm.flagged, true);
  assert.deepEqual(res.body.experiments[0].exposed, { a: 0, b: 0 });
});

test("before the plan is met only exposures are shown: no rates, no comparison", async () => {
  const { env } = await createHarness();
  await cohort(env, { key: "pkg_ab_v1", arm: "a", n: 12, prefix: "ca" });
  const b = await cohort(env, { key: "pkg_ab_v1", arm: "b", n: 9, prefix: "cb" });
  await bindAll(env, b.slice(0, 3), { trialAfter: DAY });
  const res = await results(env, await adminToken(env), "pkg_ab_v1");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.arms, [{ arm: "a", exposed: 12 }, { arm: "b", exposed: 9 }]);
  assert.equal(res.body.comparisons, undefined);
  assert.deepEqual(res.body.plan, { met: false, minPerArm: 400, minDays: 14, days: 20, matured: { a: 12, b: 9 }, reasons: ["min_per_arm"] });
  assert.deepEqual(Object.keys(res.body.srm).sort(), ["chi2", "df", "flagged", "p"]);
});

test("after the plan: trial starts and payments within 14 days, D7 return, Wilson intervals, Newcombe differences", async () => {
  const { env } = await createHarness({ EXPERIMENTS_ENABLED: "pkg_ab_v1" });
  const a = await cohort(env, { key: "pkg_ab_v1", arm: "a", n: 400, prefix: "ca" });
  const b = await cohort(env, { key: "pkg_ab_v1", arm: "b", n: 400, prefix: "cb" });
  await bindAll(env, a.slice(0, 20), { trialAfter: 2 * DAY, eventAfter: 8 * DAY });
  await bindAll(env, a.slice(20, 25), { trialAfter: 15 * DAY, eventAfter: 3 * DAY }); // outside both windows
  await bindAll(env, a.slice(25, 27), { trialAfter: -DAY }); // trial before exposure
  await bindAll(env, b.slice(0, 40), { trialAfter: 13 * DAY, paidAfter: 13 * DAY, eventAfter: 13 * DAY });
  await bindAll(env, b.slice(40, 45), { paidAfter: 20 * DAY });
  await bindAll(env, b.slice(45, 48), { paidAfter: 5 * DAY, refunded: true }); // refunded: not a conversion
  const res = await results(env, await adminToken(env), "pkg_ab_v1");
  assert.equal(res.status, 200);
  assert.equal(res.body.plan.met, true);
  const [ra, rb] = res.body.arms;
  assert.deepEqual([ra.arm, ra.exposed, ra.matured, ra.trialStarts, ra.paid, ra.d7Return], ["a", 400, 400, 20, 0, 20]);
  assert.deepEqual([rb.arm, rb.exposed, rb.matured, rb.trialStarts, rb.paid, rb.d7Return], ["b", 400, 400, 40, 40, 40]);
  const w = wilson(40, 400);
  assert.deepEqual([rb.trialRate, rb.trialLow, rb.trialHigh], [w.rate, w.lo, w.hi]);
  for (const cell of Object.values(ra).concat(Object.values(rb))) {
    assert.ok(typeof cell === "string" || Number.isFinite(cell), "arms carry flat numbers only (the admin page renders them as cells)");
  }
  const d = compareRates(20, 400, 40, 400);
  const trial = res.body.comparisons.find((c) => c.metric === "trial_14d");
  assert.deepEqual(trial, { arm: "b", metric: "trial_14d", diff: d.diff, lo: d.lo, hi: d.hi, p: d.p });
  assert.deepEqual(res.body.comparisons.map((c) => c.metric), ["trial_14d", "paid_14d", "d7_return"]);
  assert.equal(res.body.srm.flagged, false);
});

test("people exposed less than 14 days ago count as exposed but not in any rate yet", async () => {
  const { env } = await createHarness();
  await cohort(env, { key: "aa_2026_q4", arm: "a", n: 200, prefix: "ca" });
  await cohort(env, { key: "aa_2026_q4", arm: "b", n: 200, prefix: "cb" });
  const fresh = await cohort(env, { key: "aa_2026_q4", arm: "b", n: 10, prefix: "cf", firstAt: NOW - 3 * DAY });
  await bindAll(env, fresh, { trialAfter: DAY });
  const res = await results(env, await adminToken(env), "aa_2026_q4");
  const rb = res.body.arms[1];
  assert.deepEqual([rb.exposed, rb.matured, rb.trialStarts], [210, 200, 0]);
  assert.deepEqual(res.body.plan.matured, { a: 200, b: 200 });
  assert.equal(res.body.plan.met, true);
});

test("the plan also needs min_days since the first exposure", async () => {
  const { env } = await createHarness();
  await cohort(env, { key: "aa_2026_q4", arm: "a", n: 5, prefix: "ca", firstAt: NOW - 3 * DAY });
  await cohort(env, { key: "aa_2026_q4", arm: "b", n: 5, prefix: "cb", firstAt: NOW - 2 * DAY });
  const res = await results(env, await adminToken(env), "aa_2026_q4");
  assert.deepEqual([res.body.plan.met, res.body.plan.days, res.body.plan.reasons], [false, 3, ["min_per_arm", "min_days"]]);
});

test("exclusions at read time: admins, testers (role or grant), gift holders and QA-mode ids", async () => {
  const { env } = await createHarness({ ADMIN_EMAILS: "owner@gmail.com,boss@example.test,ghost@example.test" });
  const a = await cohort(env, { key: "aa_2026_q4", arm: "a", n: 30, prefix: "ca" });
  const b = await cohort(env, { key: "aa_2026_q4", arm: "b", n: 30, prefix: "cb" });
  await bindAll(env, a.slice(0, 2), { email: (cid) => (cid.endsWith("0") ? "boss@example.test" : "other@example.test"), trialAfter: DAY });
  await bindAll(env, a.slice(2, 5), { grantKind: "gift" });
  await bindAll(env, b.slice(0, 4), { grantKind: "tester" });
  const roled = await bindAll(env, b.slice(4, 5), {});
  await bindAll(env, b.slice(5, 6), { email: () => "ghost@example.test", unverified: true }); // an unverified address never makes admin
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)", roled[0], NOW - 30 * DAY);
  await sql(env, "INSERT INTO events (received_at, day, cid_hash, name, qa) VALUES (?1, '2027-01-01', ?2, 'gate_view', 1)", NOW - 10 * DAY, b[10]);
  const res = await results(env, await adminToken(env), "aa_2026_q4");
  assert.deepEqual(res.body.excluded, { admin: 1, tester: 5, gift: 3, qa: 1 });
  assert.deepEqual(res.body.arms.map((x) => x.exposed), [26, 24]);
  assert.deepEqual(sampleRatioMismatch([26, 24], [1, 1]).chi2, res.body.srm.chi2, "SRM on the analysed sample");
});

test("arm switch: an account seen in more than one arm across its devices", async () => {
  const { env } = await createHarness();
  const a = await cohort(env, { key: "ads_house_v1", arm: "none", n: 3, prefix: "ca" });
  const b = await cohort(env, { key: "ads_house_v1", arm: "house", n: 3, prefix: "cb" });
  await bindAll(env, [a[0], a[1], b[0]], {});
  await sql(env, "INSERT INTO experiment_bindings (cid_hash, account_id, created_at) VALUES (?1, ?2, ?3)", b[1], `acct_${a[0]}`, NOW);
  await sql(env, "INSERT INTO experiment_bindings (cid_hash, account_id, created_at) VALUES (?1, ?2, ?3)", a[2], `acct_${a[1]}`, NOW);
  const res = await results(env, await adminToken(env), "ads_house_v1");
  assert.deepEqual(res.body.armSwitch, { accounts: 3, switched: 1, rate: 1 / 3 });
});
