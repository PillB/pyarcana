/**
 * Session behaviour over HTTP: sign out here or everywhere, the renewed
 * cookie on /v1/me, a revoked session's 401, and roles in the me payload.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { createAccount } from "../src/accounts.mjs";
import { migrate, resetSchemaMemo } from "../src/schema.mjs";
import { SESSION_WINDOW_SECONDS, createSession } from "../src/sessions.mjs";
import { NOW, api, createEnv } from "./fixtures.mjs";

/**
 * An account with two sessions (two devices).
 * @returns {Promise<Object>} Harness.
 */
async function twoDevices() {
  resetSchemaMemo();
  const env = createEnv();
  await migrate(env.DB);
  const ctx = { env, db: env.DB, now: NOW };
  const account = await createAccount(ctx, { email: "a@example.test", emailNormalized: "a@example.test", emailVerified: true });
  const laptop = await createSession(ctx, account.id, "email");
  const phone = await createSession(ctx, account.id, "google");
  return { env, ctx, account, laptop: laptop.token, phone: phone.token };
}

test("logout signs out this device only and clears its cookie", async () => {
  const h = await twoDevices();
  const res = await api(h.env, "POST", "/v1/auth/logout", { cookie: h.laptop, body: {} });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.match(res.setCookie, /^__Host-pa_session=; Max-Age=0; Path=\/; Secure; HttpOnly; SameSite=Lax$/);
  const laptop = await api(h.env, "GET", "/v1/me", { cookie: h.laptop });
  assert.deepEqual([laptop.status, laptop.body.reason], [401, "session_revoked"]);
  assert.match(laptop.setCookie, /Max-Age=0/);
  assert.equal((await api(h.env, "GET", "/v1/me", { cookie: h.phone })).status, 200);
});

test("logout everywhere ends every session of the account", async () => {
  const h = await twoDevices();
  await api(h.env, "POST", "/v1/auth/logout", { cookie: h.laptop, body: { everywhere: true } });
  assert.equal((await api(h.env, "GET", "/v1/me", { cookie: h.phone })).status, 401);
});

test("logout without a session still answers 200 and clears the cookie", async () => {
  const h = await twoDevices();
  const res = await api(h.env, "POST", "/v1/auth/logout", { body: {} });
  assert.equal(res.status, 200);
  assert.match(res.setCookie, /Max-Age=0/);
  assert.equal((await api(h.env, "GET", "/v1/me", { cookie: h.laptop })).status, 200, "nobody else was signed out");
});

test("/v1/me re-sets the cookie when the session renews, and not before", async () => {
  const h = await twoDevices();
  const sameDay = await api(h.env, "GET", "/v1/me", { cookie: h.laptop, now: NOW + 3600 });
  assert.equal(sameDay.status, 200);
  assert.equal(sameDay.setCookie, null);
  const nextDay = await api(h.env, "GET", "/v1/me", { cookie: h.laptop, now: NOW + 86400 });
  assert.equal(nextDay.status, 200);
  assert.equal(nextDay.setCookie, `__Host-pa_session=${h.laptop}; Max-Age=${SESSION_WINDOW_SECONDS}; Path=/; Secure; HttpOnly; SameSite=Lax`);
});

test("the me payload carries active roles and the server time", async () => {
  const h = await twoDevices();
  await h.env.DB.prepare("INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)").bind(h.account.id, NOW).run();
  const res = await api(h.env, "GET", "/v1/me", { cookie: h.laptop });
  assert.deepEqual(res.body.account.roles, ["tester"]);
  assert.equal(res.body.serverTime, NOW);
  assert.equal(res.body.account.id, h.account.id);
  assert.equal(res.body.account.isAdmin, false);
});
