/**
 * GET /v1/me: the one payload every sign-in, link and trial returns
 * (DESIGN-v2 §4 + v3): account (with roles, isAdmin, trialAvailable),
 * access (resolveAccess), subscriptions with paidThrough, grants with
 * computed states, checkoutPending and serverTime.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, createHarness, seedAccount, sql } from "./fixtures.mjs";

const DAY = 86400;
const MP_PORTAL = "https://www.mercadopago.com.pe/subscriptions";

/**
 * Insert a subscription row.
 * @param {Object} env Env.
 * @param {string} accountId Account id.
 * @param {Object} s `{id, provider, status, cancel, firstActive, createdAt, plan}`.
 * @returns {Promise<void>} Resolves when inserted.
 */
async function seedSubscription(env, accountId, s) {
  await sql(
    env,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status,
       cancel_at_period_end, first_active_at, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, 1990, 'PEN', ?6, ?7, ?8, ?9, ?9)`,
    s.id,
    accountId,
    s.provider || "mercadopago",
    `ref_${s.id}`,
    s.plan || "pro_monthly",
    s.status,
    s.cancel || 0,
    s.firstActive === undefined ? null : s.firstActive,
    s.createdAt || NOW - 40 * DAY
  );
}

/**
 * Insert an approved charge.
 * @param {Object} env Env.
 * @param {string} accountId Account id.
 * @param {Object} c `{id, sub, from, to, refundedAt, status}`.
 * @returns {Promise<void>} Resolves when inserted.
 */
async function seedCharge(env, accountId, c) {
  await sql(
    env,
    `INSERT INTO charges (id, provider, provider_charge_id, subscription_id, account_id, amount_minor, currency, status,
       approved_at, period_start, period_end, refunded_at, created_at, updated_at)
     VALUES (?1, 'mercadopago', ?1, ?2, ?3, 1990, 'PEN', ?4, ?5, ?5, ?6, ?7, ?5, ?5)`,
    c.id,
    c.sub,
    accountId,
    c.status || "approved",
    c.from,
    c.to,
    c.refundedAt === undefined ? null : c.refundedAt
  );
}

/**
 * Insert a grant.
 * @param {Object} env Env.
 * @param {string} accountId Account id.
 * @param {Object} g `{id, kind, days, createdAt, revokedAt, note}`.
 * @returns {Promise<void>} Resolves when inserted.
 */
async function seedGrant(env, accountId, g) {
  await sql(
    env,
    "INSERT INTO grants (id, account_id, kind, days, created_at, note, revoked_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
    g.id,
    accountId,
    g.kind,
    g.days,
    g.createdAt,
    g.note || null,
    g.revokedAt === undefined ? null : g.revokedAt
  );
}

test("a fresh account's payload has every field, with nothing granted", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env, { email: "ana@example.test" });
  const res = await api(env, "GET", "/v1/me", { cookie: me.token });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    ok: true,
    account: {
      id: me.account.id,
      email: "ana@example.test",
      emailVerified: true,
      displayName: null,
      isAdmin: false,
      roles: [],
      trialAvailable: true,
      firstSigninAt: NOW,
      signInMethod: "email",
      identities: [{ provider: "email", subject: "ana@…st", createdAt: NOW }]
    },
    access: {
      isPro: false,
      source: null,
      accessEnd: null,
      indefinite: false,
      graceUntil: null,
      pendingGrantDays: 0,
      pendingIndefinite: false,
      upcoming: []
    },
    // Owner decision 2026-10-01 (ads.mjs): ads on by default, off for paid, trial or the admin switch.
    ads: { show: true, reason: "default" },
    subscriptions: [],
    grants: [],
    checkoutPending: false,
    serverTime: NOW,
    // DESIGN-v3-delta D-ORCH-03: the signed licence, null when not Pro.
    licenseToken: null
  });
});

test("grants come with computed start, end and state, and never with the admin's note", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env, { now: NOW - 20 * DAY, sessionAt: NOW });
  const id = me.account.id;
  await seedGrant(env, id, { id: "grant_trial", kind: "trial", days: 7, createdAt: NOW - 20 * DAY });
  await seedGrant(env, id, { id: "grant_gift", kind: "gift", days: 30, createdAt: NOW - 15 * DAY, note: "amiga de Ana" });
  await seedGrant(env, id, { id: "grant_gone", kind: "gift", days: 30, createdAt: NOW - 14 * DAY, revokedAt: NOW - 14 * DAY + 60 });
  const res = await api(env, "GET", "/v1/me", { cookie: me.token });
  assert.deepEqual(res.body.grants, [
    { id: "grant_trial", kind: "trial", days: 7, start: NOW - 20 * DAY, end: NOW - 13 * DAY, state: "used", createdAt: NOW - 20 * DAY },
    { id: "grant_gift", kind: "gift", days: 30, start: NOW - 13 * DAY, end: NOW + 17 * DAY, state: "active", createdAt: NOW - 15 * DAY },
    { id: "grant_gone", kind: "gift", days: 30, start: null, end: null, state: "revoked", createdAt: NOW - 14 * DAY }
  ]);
  assert.deepEqual(res.body.access, {
    isPro: true,
    source: "gift",
    accessEnd: NOW + 17 * DAY,
    indefinite: false,
    graceUntil: null,
    pendingGrantDays: 0,
    pendingIndefinite: false,
    upcoming: []
  });
  assert.equal(res.body.account.trialAvailable, false, "a trial grant exists");
});

test("subscriptions are listed newest first with paidThrough from clean charges and a manage link", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  const id = me.account.id;
  await seedSubscription(env, id, { id: "sub_old", provider: "creem", status: "canceled", createdAt: NOW - 90 * DAY });
  await seedSubscription(env, id, { id: "sub_mp", status: "active", firstActive: NOW - 40 * DAY, createdAt: NOW - 40 * DAY });
  await seedCharge(env, id, { id: "ch_1", sub: "sub_mp", from: NOW - 40 * DAY, to: NOW - 10 * DAY, refundedAt: NOW - 5 * DAY });
  await seedCharge(env, id, { id: "ch_2", sub: "sub_mp", from: NOW - 10 * DAY, to: NOW + 20 * DAY });
  await seedCharge(env, id, { id: "ch_3", sub: "sub_mp", from: NOW + 20 * DAY, to: NOW + 50 * DAY, status: "rejected" });
  const res = await api(env, "GET", "/v1/me", { cookie: me.token });
  assert.deepEqual(res.body.subscriptions, [
    { id: "sub_mp", provider: "mercadopago", plan: "pro_monthly", status: "active", cancelAtPeriodEnd: false, paidThrough: NOW + 20 * DAY, manageUrl: MP_PORTAL },
    { id: "sub_old", provider: "creem", plan: "pro_monthly", status: "canceled", cancelAtPeriodEnd: false, paidThrough: null, manageUrl: null }
  ]);
  assert.equal(res.body.access.source, "paid");
  assert.equal(res.body.access.accessEnd, NOW + 27 * DAY, "renewing: paid end + 7 grace days");
  assert.equal(res.body.account.trialAvailable, false, "a subscription that was once active rules the trial out");
});

test("checkoutPending: an open checkout or a pending subscription younger than 60 minutes", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  const id = me.account.id;
  const pending = async () => (await api(env, "GET", "/v1/me", { cookie: me.token })).body.checkoutPending;
  const checkout = (chk, createdAt, status) =>
    sql(env, "INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES (?1, ?2, 'creem', 'pro_monthly', 799, 'USD', ?3, ?4)", chk, id, createdAt, status);
  await checkout("chk_old", NOW - 3601, "open");
  await checkout("chk_done", NOW - 60, "completed");
  assert.equal(await pending(), false);
  await seedSubscription(env, id, { id: "sub_p", status: "pending", createdAt: NOW - 120 });
  assert.equal(await pending(), true, "a pending subscription row");
  await sql(env, "UPDATE subscriptions SET created_at = ?1", NOW - 3601);
  assert.equal(await pending(), false);
  await checkout("chk_new", NOW - 3599, "open");
  assert.equal(await pending(), true, "an open checkout");
});

test("trialAvailable follows the account flag, trial claims and the pepper", async () => {
  const { env } = await createHarness();
  const used = await seedAccount(env, { email: "used@example.test" });
  await sql(env, "UPDATE accounts SET trial_used_at = ?1 WHERE id = ?2", NOW - DAY, used.account.id);
  assert.equal((await api(env, "GET", "/v1/me", { cookie: used.token })).body.account.trialAvailable, false);
  const fresh = await seedAccount(env, { email: "fresh@example.test" });
  assert.equal((await api(env, "GET", "/v1/me", { cookie: fresh.token })).body.account.trialAvailable, true);
  const noPepper = { ...env, SERVER_PEPPER: undefined };
  const res = await api(noPepper, "GET", "/v1/me", { cookie: fresh.token });
  assert.equal(res.status, 200, "/v1/me itself does not need the pepper");
  assert.equal(res.body.account.trialAvailable, false, "without the pepper the claims cannot be checked");
});

test("isAdmin needs a listed, verified email and a Google session younger than 12 h", async () => {
  const { env } = await createHarness();
  const google = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  assert.equal((await api(env, "GET", "/v1/me", { cookie: google.token })).body.account.isAdmin, true);
  assert.equal((await api(env, "GET", "/v1/me", { cookie: google.token, now: NOW + 12 * 3600 + 1 })).body.account.isAdmin, false);
  const { createSession } = await import("../src/sessions.mjs");
  const email = await createSession({ env, db: env.DB, now: NOW }, google.account.id, "email");
  assert.equal((await api(env, "GET", "/v1/me", { cookie: email.token })).body.account.isAdmin, false);
});

test("review: someone else's open checkout or pending subscription never makes MY checkoutPending true", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env, { email: "ana@example.test" });
  const other = await seedAccount(env, { email: "luis@example.test" });
  await sql(env, "INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_luis', ?1, 'creem', 'pro_monthly', 799, 'USD', ?2, 'open')", other.account.id, NOW - 60);
  await seedSubscription(env, other.account.id, { id: "sub_luis", status: "pending", createdAt: NOW - 60 });
  assert.equal((await api(env, "GET", "/v1/me", { cookie: me.token })).body.checkoutPending, false);
  assert.equal((await api(env, "GET", "/v1/me", { cookie: other.token })).body.checkoutPending, true);
});
