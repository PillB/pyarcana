/**
 * Ads per account (owner decision 2026-10-01):
 *   ads are ON by default for every signed-in account, gift and tester holders included;
 *   paid subscribers and running trials see none (Pro's ad-free benefit, which the trial previews);
 *   an admin switches ads off (or back to the default) for one account or a batch.
 *
 *   GET  /v1/me             -> ads: {show, reason: default|paid|trial|disabled}
 *   POST /v1/admin/ads      {accountIds: string[1..100], adsDisabled: boolean, reason}
 *   GET  /v1/admin/ads      ?filter=all|disabled|gift|tester|free|paid|trial&limit=1..100&cursor=
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, createHarness, seedAccount } from "./fixtures.mjs";

const DAY = 86400;

/**
 * Harness with an admin, a free learner, a gift holder, a tester and a paying subscriber.
 * @returns {Promise<Object>} Accounts and env.
 */
async function setup() {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const free = await seedAccount(env, { email: "libre@example.test" });
  const gift = await seedAccount(env, { email: "regalo@example.test" });
  const tester = await seedAccount(env, { email: "tester@example.test" });
  const paid = await seedAccount(env, { email: "paga@example.test" });
  const trial = await seedAccount(env, { email: "prueba@example.test" });
  const run = (sqlText, ...values) => env.DB.prepare(sqlText).bind(...values).run();
  await run("INSERT INTO grants (id, account_id, kind, days, created_at, note) VALUES ('g_gift', ?1, 'gift', 30, ?2, 'amiga')", gift.account.id, NOW - 10);
  await run("INSERT INTO grants (id, account_id, kind, days, created_at, note) VALUES ('g_test', ?1, 'tester', NULL, ?2, 'qa')", tester.account.id, NOW - 10);
  await run("INSERT INTO account_roles (account_id, role, created_at, note) VALUES (?1, 'tester', ?2, 'qa')", tester.account.id, NOW - 10);
  await run("INSERT INTO grants (id, account_id, kind, days, created_at, note) VALUES ('g_trial', ?1, 'trial', 7, ?2, NULL)", trial.account.id, NOW - 10);
  await run(
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, created_at, updated_at)
     VALUES ('sub_paid', ?1, 'mercadopago', 'ref_paid', 'pro_monthly', 1990, 'PEN', 'active', ?2, ?2)`,
    paid.account.id, NOW - 100
  );
  await run(
    `INSERT INTO charges (id, provider, provider_charge_id, subscription_id, account_id, amount_minor, currency, status, approved_at, period_start, period_end, created_at, updated_at)
     VALUES ('ch_paid', 'mercadopago', 'ch_paid', 'sub_paid', ?1, 1990, 'PEN', 'approved', ?2, ?2, ?3, ?2, ?2)`,
    paid.account.id, NOW - 100, NOW + 30 * DAY
  );
  return { env, admin, free, gift, tester, paid, trial };
}

const me = async (env, who) => (await api(env, "GET", "/v1/me", { cookie: who.token })).body;
const setAds = (env, admin, body) => api(env, "POST", "/v1/admin/ads", { cookie: admin.token, body });

test("ads are on by default for free, gift and tester accounts and off for paid and trial", async () => {
  const s = await setup();
  const seen = {};
  for (const name of ["free", "gift", "tester", "paid", "trial", "admin"]) {
    seen[name] = (await me(s.env, s[name])).ads;
  }
  assert.deepEqual(seen, {
    free: { show: true, reason: "default" },
    gift: { show: true, reason: "default" },
    tester: { show: true, reason: "default" },
    paid: { show: false, reason: "paid" },
    trial: { show: false, reason: "trial" },
    admin: { show: true, reason: "default" }
  });
});

test("an admin turns ads off for a batch, me follows at once, and resetting restores the default", async () => {
  const s = await setup();
  const off = await setAds(s.env, s.admin, { accountIds: [s.gift.account.id, s.tester.account.id, s.free.account.id], adsDisabled: true, reason: "beta cerrada" });
  assert.equal(off.status, 200);
  assert.deepEqual(off.body.updated.map((u) => [u.accountId, u.adsDisabled]).sort(), [
    [s.free.account.id, true], [s.gift.account.id, true], [s.tester.account.id, true]
  ].sort());
  assert.deepEqual(off.body.notFound, []);
  for (const who of [s.gift, s.tester, s.free]) {
    assert.deepEqual((await me(s.env, who)).ads, { show: false, reason: "disabled" });
  }
  // Disabling a paid account is recorded, and keeps it ad-free after the subscription ends.
  await setAds(s.env, s.admin, { accountIds: [s.paid.account.id], adsDisabled: true, reason: "socio" });
  assert.deepEqual((await me(s.env, s.paid)).ads, { show: false, reason: "disabled" });
  const back = await setAds(s.env, s.admin, { accountIds: [s.gift.account.id], adsDisabled: false, reason: "fin de beta" });
  assert.deepEqual(back.body.updated, [{ accountId: s.gift.account.id, adsDisabled: false, changed: true }]);
  assert.deepEqual((await me(s.env, s.gift)).ads, { show: true, reason: "default" });
  assert.deepEqual((await me(s.env, s.tester)).ads, { show: false, reason: "disabled" });
  const again = await setAds(s.env, s.admin, { accountIds: [s.gift.account.id], adsDisabled: false, reason: "otra vez" });
  assert.equal(again.body.updated[0].changed, false);
});

test("the batch is validated, unknown ids are reported, and every change is audited without an address", async () => {
  const s = await setup();
  const bad = [
    [{ accountIds: [], adsDisabled: true, reason: "x" }, "bad_account_ids"],
    [{ accountIds: Array.from({ length: 101 }, (_, i) => `acc_${i}`), adsDisabled: true, reason: "x" }, "bad_account_ids"],
    [{ accountIds: [42], adsDisabled: true, reason: "x" }, "bad_account_ids"],
    [{ accountIds: [s.free.account.id], adsDisabled: "yes", reason: "x" }, "bad_ads_disabled"],
    [{ accountIds: [s.free.account.id], adsDisabled: true }, "reason_required"]
  ];
  for (const [body, reason] of bad) {
    const res = await setAds(s.env, s.admin, body);
    assert.deepEqual([res.status, res.body.reason], [400, reason], JSON.stringify(body).slice(0, 60));
  }
  const mixed = await setAds(s.env, s.admin, { accountIds: [s.free.account.id, "acc_nadie", s.free.account.id], adsDisabled: true, reason: "pide sin anuncios: libre@example.test" });
  assert.deepEqual([mixed.body.updated.length, mixed.body.notFound], [1, ["acc_nadie"]]);
  // One audit row per admin request (the 5 refused ones too); none ever holds an address.
  const audit = (await s.env.DB.prepare("SELECT detail FROM audit_log WHERE action = 'admin.ads.set' ORDER BY id").all()).results;
  assert.equal(audit.length, 6);
  for (const row of audit) assert.ok(!row.detail.includes("@"), row.detail);
  const done = JSON.parse(audit[5].detail);
  assert.deepEqual([done.status, done.adsDisabled, done.changed, done.notFound, done.adminReason], [200, true, 1, 1, "pide sin anuncios: [email]"]);
});

test("only admins can set or list ads; a tester or a learner gets 403", async () => {
  const s = await setup();
  for (const who of [s.tester, s.free]) {
    assert.equal((await setAds(s.env, who, { accountIds: [s.free.account.id], adsDisabled: true, reason: "x" })).status, 403);
    assert.equal((await api(s.env, "GET", "/v1/admin/ads", { cookie: who.token })).status, 403);
  }
});

test("the admin list shows who sees ads and why, filtered by access source or by the switch", async () => {
  const s = await setup();
  await setAds(s.env, s.admin, { accountIds: [s.tester.account.id], adsDisabled: true, reason: "qa sin anuncios" });
  const all = await api(s.env, "GET", "/v1/admin/ads?filter=all&limit=100", { cookie: s.admin.token });
  assert.equal(all.status, 200);
  const byEmail = Object.fromEntries(all.body.accounts.map((a) => [a.email, [a.source, a.adsDisabled, a.showsAds, a.reason]]));
  assert.deepEqual(byEmail, {
    "owner@gmail.com": [null, false, true, "default"],
    "libre@example.test": [null, false, true, "default"],
    "regalo@example.test": ["gift", false, true, "default"],
    "tester@example.test": ["tester", true, false, "disabled"],
    "paga@example.test": ["paid", false, false, "paid"],
    "prueba@example.test": ["trial", false, false, "trial"]
  });
  const pick = async (filter) =>
    (await api(s.env, "GET", `/v1/admin/ads?filter=${filter}`, { cookie: s.admin.token })).body.accounts.map((a) => a.email).sort();
  assert.deepEqual(await pick("disabled"), ["tester@example.test"]);
  assert.deepEqual(await pick("gift"), ["regalo@example.test"]);
  assert.deepEqual(await pick("tester"), ["tester@example.test"]);
  assert.deepEqual(await pick("free"), ["libre@example.test", "owner@gmail.com"]);
  assert.deepEqual(await pick("paid"), ["paga@example.test"]);
  const bad = await api(s.env, "GET", "/v1/admin/ads?filter=everyone", { cookie: s.admin.token });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_filter"]);
});

test("the admin list pages with a cursor and never repeats or skips an account", async () => {
  const s = await setup();
  const seen = [];
  let cursor = null;
  for (let i = 0; i < 10; i += 1) {
    const q = cursor ? `&cursor=${encodeURIComponent(cursor)}` : "";
    const page = await api(s.env, "GET", `/v1/admin/ads?filter=all&limit=2${q}`, { cookie: s.admin.token });
    assert.equal(page.status, 200);
    assert.ok(page.body.accounts.length <= 2);
    seen.push(...page.body.accounts.map((a) => a.accountId));
    cursor = page.body.nextCursor;
    if (!cursor) break;
  }
  assert.equal(seen.length, 6);
  assert.equal(new Set(seen).size, 6);
});

test("a deleted account is neither listed nor switchable", async () => {
  const s = await setup();
  await s.env.DB.prepare("UPDATE accounts SET deleted_at = ?2 WHERE id = ?1").bind(s.free.account.id, NOW - 1).run();
  const res = await setAds(s.env, s.admin, { accountIds: [s.free.account.id], adsDisabled: true, reason: "x" });
  assert.deepEqual([res.body.updated, res.body.notFound], [[], [s.free.account.id]]);
  const all = await api(s.env, "GET", "/v1/admin/ads?filter=all", { cookie: s.admin.token });
  assert.ok(!all.body.accounts.some((a) => a.accountId === s.free.account.id));
});
