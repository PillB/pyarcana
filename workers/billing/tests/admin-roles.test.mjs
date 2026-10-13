/**
 * Tester role (DESIGN-v3 Roles). Admin is never a stored role.
 *
 *   POST /v1/admin/roles        {email, role: 'tester', days: 1..3650 | null, note?}
 *   POST /v1/admin/roles/revoke {accountId, role, reason}
 *   GET  /v1/admin/roles        ?role=tester&state=active|expired|revoked|all&limit=
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, count, createHarness, seedAccount } from "./fixtures.mjs";

const DAY = 86400;

/**
 * A harness with a signed-in admin.
 * @returns {Promise<Object>} `{env, admin}`.
 */
async function withAdmin() {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  return { env, admin };
}

/**
 * The roles a learner's /v1/me reports at `now`.
 * @param {Object} env Env.
 * @param {string} token Session.
 * @param {number} [now] Clock.
 * @returns {Promise<string[]>} Roles.
 */
async function rolesOf(env, token, now = NOW) {
  return (await api(env, "GET", "/v1/me", { cookie: token, now })).body.account.roles;
}

test("granting the tester role shows in the learner's me payload, with an optional expiry", async () => {
  const { env, admin } = await withAdmin();
  const qa = await seedAccount(env, { email: "qa@example.test" });
  const res = await api(env, "POST", "/v1/admin/roles", { cookie: admin.token, body: { email: "QA@example.test", role: "tester", days: 2, note: "ronda 1" } });
  assert.equal(res.status, 201);
  assert.deepEqual(res.body.warnings, []);
  assert.deepEqual(res.body.role, {
    accountId: qa.account.id,
    email: "qa@example.test",
    role: "tester",
    createdAt: NOW,
    expiresAt: NOW + 2 * DAY,
    revokedAt: null,
    revokeReason: null,
    note: "ronda 1",
    grantedBy: "owner@gmail.com",
    state: "active"
  });
  assert.deepEqual(await rolesOf(env, qa.token), ["tester"]);
  assert.deepEqual(await rolesOf(env, qa.token, NOW + 2 * DAY), [], "expired exactly at expiresAt");
  const audit = await env.DB.prepare("SELECT actor_account_id, target_account_id, detail FROM audit_log WHERE action = 'admin.roles.grant'").first();
  assert.deepEqual([audit.actor_account_id, audit.target_account_id, JSON.parse(audit.detail)], [admin.account.id, qa.account.id, { status: 201, role: "tester", days: 2 }]);
});

test("an indefinite tester role for an unknown email creates the account", async () => {
  const { env, admin } = await withAdmin();
  const res = await api(env, "POST", "/v1/admin/roles", { cookie: admin.token, body: { email: "nuevo@example.test", role: "tester", days: null } });
  assert.equal(res.status, 201);
  assert.deepEqual(res.body.warnings, ["account_created"]);
  assert.equal(res.body.role.expiresAt, null);
});

test("admin is never a stored role, and bad input writes nothing", async () => {
  const { env, admin } = await withAdmin();
  const cases = [
    [{ email: "a@example.test", role: "admin", days: null }, "bad_role"],
    [{ email: "a@example.test", days: null }, "bad_role"],
    [{ email: "a@example.test", role: "tester" }, "bad_days"],
    [{ email: "a@example.test", role: "tester", days: 0 }, "bad_days"],
    [{ email: "nope", role: "tester", days: 5 }, "bad_email"],
    [{ email: "a@example.test", role: "tester", days: 5, note: "x".repeat(201) }, "bad_note"]
  ];
  for (const [body, reason] of cases) {
    const res = await api(env, "POST", "/v1/admin/roles", { cookie: admin.token, body });
    assert.deepEqual([JSON.stringify(body), res.status, res.body.reason], [JSON.stringify(body), 400, reason]);
  }
  assert.equal(await count(env, "FROM account_roles"), 0);
  assert.equal(await count(env, "FROM accounts"), 1);
});

test("revoking ends the role at once; a second revoke is a no-op; unknown accounts are 404", async () => {
  const { env, admin } = await withAdmin();
  const qa = await seedAccount(env, { email: "qa@example.test" });
  await api(env, "POST", "/v1/admin/roles", { cookie: admin.token, body: { email: "qa@example.test", role: "tester", days: null } });
  const noReason = await api(env, "POST", "/v1/admin/roles/revoke", { cookie: admin.token, body: { accountId: qa.account.id, role: "tester" } });
  assert.deepEqual([noReason.status, noReason.body.reason], [400, "reason_required"]);
  const first = await api(env, "POST", "/v1/admin/roles/revoke", { cookie: admin.token, body: { accountId: qa.account.id, role: "tester", reason: "fin" } });
  assert.deepEqual([first.status, first.body.revoked, first.body.alreadyRevoked], [200, 1, false]);
  assert.deepEqual(await rolesOf(env, qa.token), []);
  const again = await api(env, "POST", "/v1/admin/roles/revoke", { cookie: admin.token, body: { accountId: qa.account.id, role: "tester", reason: "otra" } });
  assert.deepEqual([again.status, again.body.revoked, again.body.alreadyRevoked], [200, 0, true]);
  const row = await env.DB.prepare("SELECT revoked_by, revoke_reason FROM account_roles").first();
  assert.deepEqual(row, { revoked_by: admin.account.id, revoke_reason: "fin" });
  const missing = await api(env, "POST", "/v1/admin/roles/revoke", { cookie: admin.token, body: { accountId: "acct_nope", role: "tester", reason: "x" } });
  assert.deepEqual([missing.status, missing.body.reason], [404, "not_found"]);
});

test("the testers list shows each role row with its state and emails, filterable by state", async () => {
  const { env, admin } = await withAdmin();
  await seedAccount(env, { email: "a@example.test" });
  const b = await seedAccount(env, { email: "b@example.test" });
  await api(env, "POST", "/v1/admin/roles", { cookie: admin.token, body: { email: "a@example.test", role: "tester", days: 1 }, now: NOW - 2 * DAY });
  await api(env, "POST", "/v1/admin/roles", { cookie: admin.token, body: { email: "b@example.test", role: "tester", days: null }, now: NOW - DAY });
  await api(env, "POST", "/v1/admin/roles", { cookie: admin.token, body: { email: "c@example.test", role: "tester", days: null }, now: NOW - 60 });
  await api(env, "POST", "/v1/admin/roles/revoke", { cookie: admin.token, body: { accountId: b.account.id, role: "tester", reason: "r" } });
  const list = async (q) => (await api(env, "GET", `/v1/admin/roles${q}`, { cookie: admin.token })).body;
  assert.deepEqual(
    (await list("?role=tester")).roles.map((r) => [r.email, r.state, r.grantedBy]),
    [
      ["c@example.test", "active", "owner@gmail.com"],
      ["b@example.test", "revoked", "owner@gmail.com"],
      ["a@example.test", "expired", "owner@gmail.com"]
    ]
  );
  assert.deepEqual((await list("?role=tester&state=active")).roles.map((r) => r.email), ["c@example.test"]);
  assert.deepEqual((await list("?role=tester&state=expired")).roles.map((r) => r.email), ["a@example.test"]);
  const bad = await api(env, "GET", "/v1/admin/roles?role=admin", { cookie: admin.token });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_role"]);
});
