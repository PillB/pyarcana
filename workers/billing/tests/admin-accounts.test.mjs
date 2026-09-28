/**
 * Admin account operations (DESIGN-v2 §4 Admin):
 *   GET  /v1/admin/account?email= | ?id=               everything about one account
 *   POST /v1/admin/accounts/disable {email|accountId, reason}   disable + end every session
 *   POST /v1/admin/accounts/enable  {email|accountId, reason}   undo a disable
 *   POST /v1/admin/accounts/email   {accountId, newEmail, reason} rectification (Ley 29733)
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, createHarness, seedAccount, sql } from "./fixtures.mjs";

const DAY = 86400;

/**
 * A harness with a signed-in admin and a learner.
 * @returns {Promise<Object>} `{env, admin, ana}`.
 */
async function setup() {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const ana = await seedAccount(env, { email: "ana@example.test", identities: [["email", "ana@example.test"], ["google", "110000000000000000042"]] });
  return { env, admin, ana };
}

/**
 * POST an admin route.
 * @param {Object} env Env.
 * @param {Object} admin Admin.
 * @param {string} path Path.
 * @param {Object} body Body.
 * @returns {Promise<Object>} Response.
 */
function post(env, admin, path, body) {
  return api(env, "POST", path, { cookie: admin.token, body });
}

test("disable ends every session at once and blocks sign-in; enable lets the person sign in again", async () => {
  const { env, admin, ana } = await setup();
  const noReason = await post(env, admin, "/v1/admin/accounts/disable", { email: "ana@example.test" });
  assert.deepEqual([noReason.status, noReason.body.reason], [400, "reason_required"]);
  const res = await post(env, admin, "/v1/admin/accounts/disable", { email: "ana@example.test", reason: "abuso" });
  assert.deepEqual([res.status, res.body.sessionsRevoked, res.body.alreadyDisabled, res.body.account.disabledAt], [200, 1, false, NOW]);
  assert.equal((await api(env, "GET", "/v1/me", { cookie: ana.token })).status, 401);
  const { completeSignIn } = await import("../src/auth-session.mjs");
  const row = await env.DB.prepare("SELECT * FROM accounts WHERE id = ?1").bind(ana.account.id).first();
  assert.deepEqual([row.disabled_at, row.disabled_reason], [NOW, "abuso"]);
  const blocked = await completeSignIn({ env, db: env.DB, now: NOW, body: {} }, row, "email", { emailVerified: true });
  assert.deepEqual([blocked.status, blocked.body.reason], [403, "account_disabled"]);
  const again = await post(env, admin, "/v1/admin/accounts/disable", { accountId: ana.account.id, reason: "otra" });
  assert.deepEqual([again.status, again.body.alreadyDisabled], [200, true]);
  const enabled = await post(env, admin, "/v1/admin/accounts/enable", { email: "ana@example.test", reason: "apelación" });
  assert.deepEqual([enabled.status, enabled.body.account.disabledAt], [200, null]);
  const fresh = await env.DB.prepare("SELECT * FROM accounts WHERE id = ?1").bind(ana.account.id).first();
  const signedIn = await completeSignIn({ env, db: env.DB, now: NOW, body: {} }, fresh, "email", { emailVerified: true });
  assert.equal(signedIn.status, 200);
  const actions = (await env.DB.prepare("SELECT action, target_account_id FROM audit_log ORDER BY id").all()).results;
  assert.deepEqual(
    actions.map((a) => a.action),
    ["admin.accounts.disable", "admin.accounts.disable", "admin.accounts.disable", "admin.accounts.enable"]
  );
});

test("an admin cannot disable their own account, and unknown accounts are 404", async () => {
  const { env, admin } = await setup();
  const self = await post(env, admin, "/v1/admin/accounts/disable", { email: "owner@gmail.com", reason: "x" });
  assert.deepEqual([self.status, self.body.reason], [409, "cannot_disable_self"]);
  const missing = await post(env, admin, "/v1/admin/accounts/disable", { email: "nadie@example.test", reason: "x" });
  assert.deepEqual([missing.status, missing.body.reason], [404, "not_found"]);
  const neither = await post(env, admin, "/v1/admin/accounts/disable", { reason: "x" });
  assert.deepEqual([neither.status, neither.body.reason], [400, "bad_target"]);
});

test("email rectification moves the address, marks it unproven, and never writes an email into the audit log", async () => {
  const { env, admin, ana } = await setup();
  const res = await post(env, admin, "/v1/admin/accounts/email", { accountId: ana.account.id, newEmail: "Ana.Nueva@Example.test", reason: "egresó" });
  assert.deepEqual([res.status, res.body.account.email, res.body.unchanged], [200, "ana.nueva@example.test", false]);
  const row = await env.DB.prepare("SELECT email, email_normalized, email_verified FROM accounts WHERE id = ?1").bind(ana.account.id).first();
  assert.deepEqual(row, { email: "ana.nueva@example.test", email_normalized: "ana.nueva@example.test", email_verified: 0 });
  const lookupOld = await api(env, "GET", "/v1/admin/account?email=ana@example.test", { cookie: admin.token });
  assert.equal(lookupOld.status, 404);
  const detail = (await env.DB.prepare("SELECT detail FROM audit_log WHERE action = 'admin.accounts.email'").first()).detail;
  assert.ok(!detail.includes("@"), `audit detail must not hold an email: ${detail}`);
  const other = await seedAccount(env, { email: "luis@example.test" });
  const taken = await post(env, admin, "/v1/admin/accounts/email", { accountId: other.account.id, newEmail: "ana.nueva@example.test", reason: "x" });
  assert.deepEqual([taken.status, taken.body.reason], [409, "email_in_use"]);
  const same = await post(env, admin, "/v1/admin/accounts/email", { accountId: ana.account.id, newEmail: "ana.nueva@example.test", reason: "x" });
  assert.deepEqual([same.status, same.body.unchanged], [200, true]);
  const bad = await post(env, admin, "/v1/admin/accounts/email", { accountId: ana.account.id, newEmail: "nope", reason: "x" });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_email"]);
  const gone = await post(env, admin, "/v1/admin/accounts/email", { accountId: "acct_nope", newEmail: "z@example.test", reason: "x" });
  assert.equal(gone.status, 404);
});

test("the account view shows access, grants with notes, roles, masked identities, billing and recent audit", async () => {
  const { env, admin, ana } = await setup();
  await post(env, admin, "/v1/admin/grants", { email: "ana@example.test", days: 30, note: "beta", requestId: "req-view-0001" });
  await post(env, admin, "/v1/admin/roles", { email: "ana@example.test", role: "tester", days: null });
  await sql(
    env,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, first_active_at, created_at, updated_at)
     VALUES ('sub_a', ?1, 'mercadopago', 'pre_a', 'pro_monthly', 1990, 'PEN', 'active', ?2, ?2, ?2),
            ('sub_b', ?1, 'creem', 'sub_creem_b', 'pro_monthly', 799, 'USD', 'active', ?2, ?2, ?2)`,
    ana.account.id,
    NOW - 5 * DAY
  );
  const res = await api(env, "GET", "/v1/admin/account?email=ANA@example.test", { cookie: admin.token });
  assert.equal(res.status, 200);
  const body = res.body;
  assert.deepEqual([body.account.id, body.account.email, body.account.emailVerified, body.account.disabledAt], [ana.account.id, "ana@example.test", true, null]);
  assert.deepEqual([body.access.isPro, body.access.source], [true, "gift"]);
  assert.deepEqual(body.grants.map((g) => [g.kind, g.note, g.issuedBy, g.state]), [["gift", "beta", "owner@gmail.com", "active"]]);
  assert.deepEqual(body.roles.map((r) => [r.role, r.state]), [["tester", "active"]]);
  assert.deepEqual(body.identities.map((i) => i.provider).sort(), ["email", "google"]);
  const google = body.identities.find((i) => i.provider === "google");
  assert.notEqual(google.subject, "110000000000000000042");
  assert.match(google.subject, /^1100…42$/);
  assert.deepEqual(body.subscriptions.map((s) => [s.id, s.providerRef]).sort(), [["sub_a", "pre_a"], ["sub_b", "sub_creem_b"]]);
  assert.equal(body.flags.doubleSubscription, true);
  assert.ok(body.audit.length >= 2 && body.audit.every((a) => a.targetAccountId === ana.account.id));
  const byId = await api(env, "GET", `/v1/admin/account?id=${ana.account.id}`, { cookie: admin.token });
  assert.equal(byId.body.account.id, ana.account.id);
  const read = await env.DB.prepare("SELECT target_account_id FROM audit_log WHERE action = 'admin.account.read' ORDER BY id DESC").first();
  assert.equal(read.target_account_id, ana.account.id, "admin reads are audited against the account read");
  const none = await api(env, "GET", "/v1/admin/account", { cookie: admin.token });
  assert.deepEqual([none.status, none.body.reason], [400, "bad_target"]);
});
