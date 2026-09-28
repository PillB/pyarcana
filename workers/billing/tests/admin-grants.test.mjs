/**
 * Admin grants (DESIGN-v2 §4 Admin as amended by v3): give and remove Pro for
 * a fixed number of days or indefinitely, as a `gift` or a `tester` grant,
 * and list who holds which kind in which state.
 *
 *   POST /v1/admin/grants        {email, days: 1..3650 | null, kind?, note?, requestId}
 *   POST /v1/admin/grants/revoke {grantId, reason}
 *   GET  /v1/admin/grants        ?kind=&state=&limit=
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, count, createHarness, seedAccount, sql } from "./fixtures.mjs";

const DAY = 86400;

/**
 * A harness with a signed-in admin (fresh Google session).
 * @returns {Promise<Object>} `{env, admin}`.
 */
async function withAdmin() {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  return { env, admin };
}

/**
 * POST /v1/admin/grants.
 * @param {Object} env Env.
 * @param {string} token Admin session.
 * @param {Object} body Body.
 * @param {Object} [extra] api() options.
 * @returns {Promise<Object>} Response.
 */
function grant(env, token, body, extra) {
  return api(env, "POST", "/v1/admin/grants", { cookie: token, body: { requestId: `req-${Math.random().toString(36).slice(2)}`, ...body }, ...(extra || {}) });
}

/**
 * Audit rows for an action.
 * @param {Object} env Env.
 * @param {string} action Action.
 * @returns {Promise<Object[]>} Rows with parsed detail.
 */
async function audits(env, action) {
  const rows = (await env.DB.prepare("SELECT * FROM audit_log WHERE action = ?1 ORDER BY id").bind(action).all()).results;
  return rows.map((r) => ({ ...r, detail: JSON.parse(r.detail) }));
}

test("a gift to a signed-in learner starts now, is listed with its state, and is audited in the same batch", async () => {
  const { env, admin } = await withAdmin();
  const ana = await seedAccount(env, { email: "ana@example.test" });
  const res = await grant(env, admin.token, { email: "Ana@Example.test", days: 30, note: "beta amiga", requestId: "req-00000001" });
  assert.equal(res.status, 201);
  assert.deepEqual(res.body.warnings, []);
  assert.deepEqual(res.body.account, { id: ana.account.id, email: "ana@example.test", firstSigninAt: NOW });
  const g = res.body.grant;
  assert.match(g.id, /^grant_/);
  assert.deepEqual(
    { kind: g.kind, days: g.days, note: g.note, state: g.state, start: g.start, end: g.end, issuedBy: g.issuedBy, requestId: g.requestId },
    { kind: "gift", days: 30, note: "beta amiga", state: "active", start: NOW, end: NOW + 30 * DAY, issuedBy: "owner@gmail.com", requestId: "req-00000001" }
  );
  const rows = await audits(env, "admin.grants.create");
  assert.equal(rows.length, 1, "one audit row: the handler's, not a second from the gate");
  assert.deepEqual(
    [rows[0].actor_account_id, rows[0].target_account_id, rows[0].target_id, rows[0].detail],
    [admin.account.id, ana.account.id, g.id, { status: 201, kind: "gift", days: 30, accountCreated: false }]
  );
  const me = await api(env, "GET", "/v1/me", { cookie: ana.token });
  assert.deepEqual([me.body.access.source, me.body.access.accessEnd], ["gift", NOW + 30 * DAY]);
});

test("a gift to an unknown email creates the account; the days wait for the first sign-in", async () => {
  const { env, admin } = await withAdmin();
  const res = await grant(env, admin.token, { email: "friend@example.test", days: 30 });
  assert.equal(res.status, 201);
  assert.deepEqual(res.body.warnings, ["account_created", "pending_activation"]);
  assert.deepEqual([res.body.grant.state, res.body.grant.start, res.body.account.firstSigninAt], ["pending_activation", null, null]);
  const row = await env.DB.prepare("SELECT email_normalized, email_verified, first_signin_at FROM accounts WHERE id = ?1").bind(res.body.account.id).first();
  assert.deepEqual(row, { email_normalized: "friend@example.test", email_verified: 0, first_signin_at: null });
  await sql(env, "UPDATE accounts SET first_signin_at = ?1 WHERE id = ?2", NOW + 5 * DAY, res.body.account.id);
  const { createSession } = await import("../src/sessions.mjs");
  const session = await createSession({ env, db: env.DB, now: NOW + 5 * DAY }, res.body.account.id, "email");
  const me = await api(env, "GET", "/v1/me", { cookie: session.token, now: NOW + 6 * DAY });
  assert.deepEqual([me.body.access.source, me.body.access.accessEnd], ["gift", NOW + 35 * DAY]);
});

/**
 * A fresh Google session for the admin at `at` (admin sessions last 12 h).
 * @param {Object} env Env.
 * @param {Object} admin Seeded admin.
 * @param {number} at Clock.
 * @returns {Promise<string>} Token.
 */
async function adminAt(env, admin, at) {
  const { createSession } = await import("../src/sessions.mjs");
  return (await createSession({ env, db: env.DB, now: at }, admin.account.id, "google")).token;
}

test("an indefinite tester grant runs until revoked, then a queued gift re-flows from the revocation", async () => {
  const { env, admin } = await withAdmin();
  const qa = await seedAccount(env, { email: "qa@example.test" });
  const tester = await grant(env, admin.token, { email: "qa@example.test", days: null, kind: "tester" });
  assert.deepEqual([tester.status, tester.body.grant.days, tester.body.grant.end, tester.body.grant.kind], [201, null, null, "tester"]);
  const queued = await grant(env, await adminAt(env, admin, NOW + DAY), { email: "qa@example.test", days: 30 }, { now: NOW + DAY });
  assert.deepEqual([queued.body.grant.state, queued.body.grant.start], ["upcoming", null]);
  let me = await api(env, "GET", "/v1/me", { cookie: qa.token, now: NOW + 2 * DAY });
  assert.deepEqual([me.body.access.source, me.body.access.indefinite, me.body.access.accessEnd], ["tester", true, null]);
  const later = await adminAt(env, admin, NOW + 10 * DAY);
  const revoked = await api(env, "POST", "/v1/admin/grants/revoke", { cookie: later, body: { grantId: tester.body.grant.id, reason: "fin de la beta" }, now: NOW + 10 * DAY });
  assert.deepEqual([revoked.status, revoked.body.grant.state, revoked.body.grant.end], [200, "revoked", NOW + 10 * DAY]);
  me = await api(env, "GET", "/v1/me", { cookie: qa.token, now: NOW + 11 * DAY });
  assert.deepEqual([me.body.access.source, me.body.access.accessEnd], ["gift", NOW + 40 * DAY]);
});

test("a gift to a paying subscriber is kept as credit and says so", async () => {
  const { env, admin } = await withAdmin();
  const payer = await seedAccount(env, { email: "payer@example.test" });
  await sql(
    env,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, first_active_at, created_at, updated_at)
     VALUES ('sub_1', ?1, 'mercadopago', 'pre_1', 'pro_monthly', 1990, 'PEN', 'active', ?2, ?2, ?2)`,
    payer.account.id,
    NOW - 10 * DAY
  );
  await sql(
    env,
    `INSERT INTO charges (id, provider, provider_charge_id, subscription_id, account_id, amount_minor, currency, status, approved_at, period_start, period_end, created_at, updated_at)
     VALUES ('ch_1', 'mercadopago', 'pay_1', 'sub_1', ?1, 1990, 'PEN', 'approved', ?2, ?2, ?3, ?2, ?2)`,
    payer.account.id,
    NOW - 10 * DAY,
    NOW + 20 * DAY
  );
  const res = await grant(env, admin.token, { email: "payer@example.test", days: 30 });
  assert.deepEqual(res.body.warnings, ["deferred_by_subscription"]);
  assert.deepEqual([res.body.grant.state, res.body.grant.start], ["upcoming", NOW + 27 * DAY]);
});

test("the same requestId is one grant, even when five requests race; a changed body is 409", async () => {
  const { env, admin } = await withAdmin();
  await seedAccount(env, { email: "ana@example.test" });
  const body = { email: "ana@example.test", days: 14, requestId: "double-click-1" };
  const results = await Promise.all(Array.from({ length: 5 }, () => grant(env, admin.token, body)));
  assert.equal(await count(env, "FROM grants"), 1);
  assert.equal(new Set(results.map((r) => r.body.grant.id)).size, 1);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 200, 200, 200, 201]);
  assert.ok(results.filter((r) => r.status === 200).every((r) => r.body.deduplicated === true));
  const changed = await grant(env, admin.token, { ...body, days: 15 });
  assert.deepEqual([changed.status, changed.body.reason], [409, "idempotency_mismatch"]);
  assert.equal(await count(env, "FROM grants"), 1);
  assert.equal((await audits(env, "admin.grants.create")).length, 6, "the create, four dedupes and the refusal are all audited");
});

test("bad input is 400 and writes no grant", async () => {
  const { env, admin } = await withAdmin();
  const cases = [
    [{ email: "a@example.test", days: 0 }, "bad_days"],
    [{ email: "a@example.test", days: 3651 }, "bad_days"],
    [{ email: "a@example.test", days: 1.5 }, "bad_days"],
    [{ email: "a@example.test", days: "30" }, "bad_days"],
    [{ email: "a@example.test" }, "bad_days"],
    [{ email: "a@example.test", days: 30, kind: "trial" }, "bad_kind"],
    [{ email: "not-an-email", days: 30 }, "bad_email"],
    [{ email: "a@example.test", days: 30, note: "x".repeat(201) }, "bad_note"],
    [{ email: "a@example.test", days: 30, requestId: "short" }, "bad_request_id"],
    [{ email: "a@example.test", days: 30, requestId: undefined }, "bad_request_id"]
  ];
  for (const [body, reason] of cases) {
    const res = await api(env, "POST", "/v1/admin/grants", { cookie: admin.token, body: { requestId: "req-valid-1", ...body } });
    assert.deepEqual([JSON.stringify(body), res.status, res.body.reason], [JSON.stringify(body), 400, reason]);
  }
  assert.equal(await count(env, "FROM grants"), 0);
  assert.equal(await count(env, "FROM accounts"), 1, "no account is created for a refused request");
});

test("revoke is idempotent, needs a reason, and 404s an unknown grant", async () => {
  const { env, admin } = await withAdmin();
  await seedAccount(env, { email: "ana@example.test" });
  const created = await grant(env, admin.token, { email: "ana@example.test", days: 30 });
  const id = created.body.grant.id;
  const noReason = await api(env, "POST", "/v1/admin/grants/revoke", { cookie: admin.token, body: { grantId: id } });
  assert.deepEqual([noReason.status, noReason.body.reason], [400, "reason_required"]);
  const first = await api(env, "POST", "/v1/admin/grants/revoke", { cookie: admin.token, body: { grantId: id, reason: "error" }, now: NOW + 60 });
  assert.deepEqual([first.status, first.body.alreadyRevoked], [200, false]);
  const again = await api(env, "POST", "/v1/admin/grants/revoke", { cookie: admin.token, body: { grantId: id, reason: "otra vez" }, now: NOW + 120 });
  assert.deepEqual([again.status, again.body.alreadyRevoked], [200, true]);
  const row = await env.DB.prepare("SELECT revoked_at, revoked_by, revoke_reason FROM grants WHERE id = ?1").bind(id).first();
  assert.deepEqual(row, { revoked_at: NOW + 60, revoked_by: admin.account.id, revoke_reason: "error" });
  const missing = await api(env, "POST", "/v1/admin/grants/revoke", { cookie: admin.token, body: { grantId: "grant_nope", reason: "x" } });
  assert.deepEqual([missing.status, missing.body.reason], [404, "not_found"]);
  const rows = await audits(env, "admin.grants.revoke");
  assert.deepEqual(
    rows.map((r) => [r.target_id, r.detail.status]),
    [
      [null, 400],
      [id, 200],
      [id, 200],
      [null, 404]
    ]
  );
});

test("the list answers who holds which kind of Pro, in which state, newest first", async () => {
  const { env, admin } = await withAdmin();
  await seedAccount(env, { email: "ana@example.test" });
  await seedAccount(env, { email: "qa@example.test" });
  const gift = await grant(env, admin.token, { email: "ana@example.test", days: 30, note: "n1" }, { now: NOW - 3 * DAY });
  const queued = await grant(env, admin.token, { email: "ana@example.test", days: 30 }, { now: NOW - 2.5 * DAY });
  const tester = await grant(env, admin.token, { email: "qa@example.test", days: null, kind: "tester" }, { now: NOW - 2 * DAY });
  const pending = await grant(env, admin.token, { email: "nuevo@example.test", days: 7 }, { now: NOW - DAY });
  const gone = await grant(env, admin.token, { email: "ana@example.test", days: 5 }, { now: NOW - 60 });
  await api(env, "POST", "/v1/admin/grants/revoke", { cookie: admin.token, body: { grantId: gone.body.grant.id, reason: "x" } });
  const list = async (query) => (await api(env, "GET", `/v1/admin/grants${query}`, { cookie: admin.token })).body;
  const all = await list("");
  assert.deepEqual(
    all.grants.map((g) => [g.id, g.email, g.kind, g.state]),
    [
      [gone.body.grant.id, "ana@example.test", "gift", "revoked"],
      [pending.body.grant.id, "nuevo@example.test", "gift", "pending_activation"],
      [tester.body.grant.id, "qa@example.test", "tester", "active"],
      [queued.body.grant.id, "ana@example.test", "gift", "upcoming"],
      [gift.body.grant.id, "ana@example.test", "gift", "active"]
    ]
  );
  assert.deepEqual(
    Object.keys(all.grants[4]).sort(),
    ["accountId", "createdAt", "days", "email", "end", "id", "issuedBy", "kind", "note", "requestId", "revokeReason", "revokedAt", "start", "state"].sort()
  );
  assert.deepEqual((await list("?kind=tester&state=active")).grants.map((g) => [g.email, g.days, g.end]), [["qa@example.test", null, null]]);
  assert.deepEqual((await list("?state=pending_activation")).grants.map((g) => g.email), ["nuevo@example.test"]);
  assert.deepEqual((await list("?state=revoked")).grants.map((g) => [g.id, g.revokeReason]), [[gone.body.grant.id, "x"]]);
  assert.deepEqual((await list("?kind=gift&state=active")).grants.map((g) => [g.id, g.issuedBy, g.note]), [[gift.body.grant.id, "owner@gmail.com", "n1"]]);
  assert.deepEqual((await list("?state=upcoming")).grants.map((g) => [g.id, g.start]), [[queued.body.grant.id, NOW + 30 * DAY]]);
  assert.equal((await list("?limit=2")).grants.length, 2);
  const bad = await api(env, "GET", "/v1/admin/grants?kind=bogus", { cookie: admin.token });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_kind"]);
  const badState = await api(env, "GET", "/v1/admin/grants?state=bogus", { cookie: admin.token });
  assert.deepEqual([badState.status, badState.body.reason], [400, "bad_state"]);
  assert.ok((await audits(env, "admin.grants.list")).length >= 7, "reads are audited too");
});

test("a non-admin cannot grant, revoke or list", async () => {
  const { env } = await withAdmin();
  const user = await seedAccount(env, { email: "ana@example.test", method: "google" });
  assert.equal((await grant(env, user.token, { email: "ana@example.test", days: 30 })).status, 403);
  assert.equal((await api(env, "POST", "/v1/admin/grants/revoke", { cookie: user.token, body: { grantId: "g", reason: "r" } })).status, 403);
  assert.equal((await api(env, "GET", "/v1/admin/grants", { cookie: user.token })).status, 403);
  assert.equal(await count(env, "FROM grants"), 0);
});
