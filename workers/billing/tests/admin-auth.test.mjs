/**
 * Admin and QA authorization as a router stage (DESIGN-v2 §4 Admin + v3 roles).
 *
 * Admin = a verified email listed in ADMIN_EMAILS (read per request) AND a
 * Google session created in the last 12 h. A listed admin whose session is
 * not fresh Google gets 401 reauth_required (sign in with Google again);
 * anyone else gets 403 forbidden. 120 admin requests per hour per account.
 * EVERY admin request with a session writes one audit row, reads and refusals
 * included (rate-limited ones excepted, so a flood cannot grow the log
 * without bound). QA routes admit an active tester role or an admin.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { ROUTES } from "../src/router.mjs";
import { NOW, api, count, createHarness, seedAccount, sql } from "./fixtures.mjs";

const HOUR = 3600;

/**
 * A probe route table exercising the stage without any real admin handler.
 * @param {Object} [result] What the handler answers.
 * @returns {Object[]} Routes.
 */
function probeRoutes(result) {
  const handler = () => result || { status: 200, body: { ok: true }, audit: { targetId: "probe-target", detail: { rows: 3 } } };
  return [
    { method: "GET", path: "/v1/admin/probe", handler, needs: ["db", "pepper"], auth: "session", access: "admin", audit: "admin.probe" },
    { method: "GET", path: "/v1/qa/probe", handler, needs: ["db", "pepper"], auth: "session", access: "qa" }
  ];
}

/**
 * Audit rows, oldest first.
 * @param {Object} env Env.
 * @returns {Promise<Object[]>} Rows with parsed detail.
 */
async function auditRows(env) {
  const rows = (await env.DB.prepare("SELECT actor_account_id, action, target_id, detail FROM audit_log ORDER BY id").all()).results;
  return rows.map((r) => ({ ...r, detail: r.detail ? JSON.parse(r.detail) : null }));
}

/**
 * GET a probe path.
 * @param {Object} env Env.
 * @param {string} path Path.
 * @param {string|undefined} token Session token.
 * @param {Object} [extra] Extra api() options.
 * @returns {Promise<Object>} Response.
 */
function probe(env, path, token, extra) {
  return api(env, "GET", path, { cookie: token, routes: probeRoutes(extra && extra.result), ...(extra || {}) });
}

test("every /v1/admin/ route is session + admin gated, needs db and pepper, and names its audit action", () => {
  const admin = ROUTES.filter((r) => r.path.startsWith("/v1/admin/"));
  assert.ok(admin.length >= 11, `expected the admin surface, found ${admin.length}`);
  for (const route of admin) {
    assert.equal(route.auth, "session", route.path);
    assert.equal(route.access, "admin", route.path);
    assert.ok(route.needs.includes("db") && route.needs.includes("pepper"), route.path);
    assert.match(route.audit, /^admin\.[a-z_.]+$/, route.path);
  }
  for (const route of ROUTES.filter((r) => r.path.startsWith("/v1/qa/"))) {
    assert.deepEqual([route.path, route.auth, route.access], [route.path, "session", "qa"]);
  }
});

test("an admin with a fresh Google session passes, and the request is audited with the handler's target", async () => {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const res = await probe(env, "/v1/admin/probe", admin.token);
  assert.deepEqual([res.status, res.body], [200, { ok: true }]);
  assert.deepEqual(await auditRows(env), [
    { actor_account_id: admin.account.id, action: "admin.probe", target_id: "probe-target", detail: { status: 200, rows: 3 } }
  ]);
});

test("a signed-in non-admin is 403 forbidden, and the refusal is audited", async () => {
  const { env } = await createHarness();
  const user = await seedAccount(env, { email: "ana@gmail.com", method: "google" });
  const res = await probe(env, "/v1/admin/probe", user.token);
  assert.deepEqual([res.status, res.body], [403, { ok: false, reason: "forbidden" }]);
  assert.deepEqual(await auditRows(env), [
    { actor_account_id: user.account.id, action: "admin.probe", target_id: null, detail: { status: 403, reason: "forbidden" } }
  ]);
});

test("a listed admin must re-authenticate with Google: email session, stale session", async () => {
  const { env } = await createHarness();
  const byEmail = await seedAccount(env, { email: "owner@gmail.com", method: "email" });
  const email = await probe(env, "/v1/admin/probe", byEmail.token);
  assert.deepEqual([email.status, email.body.reason], [401, "reauth_required"]);
  const { createSession } = await import("../src/sessions.mjs");
  const old = await createSession({ env, db: env.DB, now: NOW - 12 * HOUR - 1 }, byEmail.account.id, "google");
  const res = await probe(env, "/v1/admin/probe", old.token);
  assert.deepEqual([res.status, res.body.reason], [401, "reauth_required"]);
  assert.equal(res.setCookie, null, "the session itself stays valid; only admin needs a fresh sign-in");
});

test("an unverified listed email is not admin (403)", async () => {
  const { env } = await createHarness();
  const unverified = await seedAccount(env, { email: "owner@gmail.com", verified: false, identities: [["google", "g-1"]], method: "google" });
  assert.equal((await probe(env, "/v1/admin/probe", unverified.token)).status, 403);
});

test("ADMIN_EMAILS is read per request: removing the address ends admin at once", async () => {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  assert.equal((await probe(env, "/v1/admin/probe", admin.token)).status, 200);
  env.ADMIN_EMAILS = "someone-else@gmail.com";
  assert.equal((await probe(env, "/v1/admin/probe", admin.token)).status, 403);
});

test("no session is 401 before any admin logic, and nothing is audited", async () => {
  const { env } = await createHarness();
  const res = await probe(env, "/v1/admin/probe", undefined);
  assert.deepEqual([res.status, res.body.reason], [401, "no_session"]);
  assert.equal(await count(env, "FROM audit_log"), 0);
});

test("120 admin requests per hour per account; the 121st is 429 and is not audited", async () => {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  for (let i = 0; i < 120; i += 1) {
    assert.equal((await probe(env, "/v1/admin/probe", admin.token)).status, 200);
  }
  const limited = await probe(env, "/v1/admin/probe", admin.token);
  assert.deepEqual([limited.status, limited.body.reason], [429, "rate_limited"]);
  assert.ok(limited.body.retryAfter > 0);
  assert.equal(await count(env, "FROM audit_log"), 120);
  const nonAdmin = await seedAccount(env, { email: "ana@example.test" });
  for (let i = 0; i < 120; i += 1) {
    await probe(env, "/v1/admin/probe", nonAdmin.token);
  }
  assert.equal((await probe(env, "/v1/admin/probe", nonAdmin.token)).status, 429, "refusals are limited too");
});

test("a handler that audited inside its own batch is not audited twice", async () => {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  await probe(env, "/v1/admin/probe", admin.token, { result: { status: 200, body: { ok: true }, audited: true } });
  assert.equal(await count(env, "FROM audit_log"), 0);
});

test("QA routes admit an active tester or an admin, and nobody else", async () => {
  const { env } = await createHarness();
  const tester = await seedAccount(env, { email: "qa@example.test" });
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)", tester.account.id, NOW - 10);
  assert.equal((await probe(env, "/v1/qa/probe", tester.token)).status, 200);
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  assert.equal((await probe(env, "/v1/qa/probe", admin.token)).status, 200);
  const plain = await seedAccount(env, { email: "plain@example.test" });
  assert.deepEqual((await probe(env, "/v1/qa/probe", plain.token)).body, { ok: false, reason: "forbidden" });
  const expired = await seedAccount(env, { email: "was@example.test" });
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at, expires_at) VALUES (?1, 'tester', ?2, ?3)", expired.account.id, NOW - 100, NOW - 1);
  assert.equal((await probe(env, "/v1/qa/probe", expired.token)).status, 403);
  const staleAdmin = await seedAccount(env, { email: "owner2@gmail.com", method: "email" });
  env.ADMIN_EMAILS = "owner@gmail.com,owner2@gmail.com";
  assert.deepEqual((await probe(env, "/v1/qa/probe", staleAdmin.token)).body.reason, "reauth_required");
  assert.equal(await count(env, "FROM audit_log"), 0, "QA reads are not admin-audited");
});
