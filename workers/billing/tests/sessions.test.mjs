/**
 * sessions.mjs: 32-byte tokens stored as SHA-256, a 30-day renewal window
 * renewed at most daily, an absolute cap of SESSION_MAX_DAYS from creation,
 * revocation, and refusal for disabled or deleted accounts.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { createAccount } from "../src/accounts.mjs";
import { sha256Hex } from "../src/crypto.mjs";
import {
  SESSION_WINDOW_SECONDS,
  createSession,
  isRecentAuth,
  resolveSession,
  revokeAllSessions,
  revokeSession
} from "../src/sessions.mjs";
import { NOW, createCtx } from "./fixtures.mjs";

const DAY = 86400;

/**
 * A context with one account and one session.
 * @param {Object} [overrides] Env overrides.
 * @returns {Promise<Object>} `{ctx, account, token, session}`.
 */
async function signedIn(overrides) {
  const ctx = await createCtx(overrides);
  const account = await createAccount(ctx, { email: "s@example.test", emailNormalized: "s@example.test", emailVerified: true });
  const { token, session } = await createSession(ctx, account.id, "email");
  return { ctx, account, token, session };
}

/**
 * Resolve at a given clock.
 * @param {Object} ctx Context.
 * @param {string} token Token.
 * @param {number} at Clock.
 * @returns {Promise<Object>} Result.
 */
function resolveAt(ctx, token, at) {
  return resolveSession({ ...ctx, now: at }, token);
}

test("only the SHA-256 of the 32-byte token is stored, with the method", async () => {
  const { ctx, token, session } = await signedIn();
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  const row = await ctx.db.prepare("SELECT * FROM sessions WHERE id = ?1").bind(session.id).first();
  assert.equal(row.token_hash, await sha256Hex(token));
  assert.notEqual(row.token_hash, token);
  assert.equal(row.method, "email");
  assert.equal(row.expires_at, NOW + SESSION_WINDOW_SECONDS);
});

test("a valid token resolves to its account; unknown or malformed tokens do not", async () => {
  const { ctx, account, token } = await signedIn();
  const ok = await resolveAt(ctx, token, NOW + 60);
  assert.equal(ok.ok, true);
  assert.equal(ok.account.id, account.id);
  assert.deepEqual(await resolveAt(ctx, "A".repeat(43), NOW), { ok: false, reason: "no_session" });
  assert.deepEqual(await resolveAt(ctx, "short", NOW), { ok: false, reason: "no_session" });
  assert.deepEqual(await resolveAt(ctx, null, NOW), { ok: false, reason: "no_session" });
});

test("revoking one session leaves others; revoking all ends them all", async () => {
  const { ctx, account, token, session } = await signedIn();
  const second = await createSession(ctx, account.id, "google");
  await revokeSession(ctx, session.id);
  assert.deepEqual(await resolveAt(ctx, token, NOW), { ok: false, reason: "session_revoked" });
  assert.equal((await resolveAt(ctx, second.token, NOW)).ok, true);
  await revokeAllSessions(ctx, account.id);
  assert.deepEqual(await resolveAt(ctx, second.token, NOW), { ok: false, reason: "session_revoked" });
});

test("revokeAllSessions touches only that account", async () => {
  const { ctx, token } = await signedIn();
  const other = await createAccount(ctx, { email: "o@example.test", emailNormalized: "o@example.test", emailVerified: true });
  await revokeAllSessions(ctx, other.id);
  assert.equal((await resolveAt(ctx, token, NOW)).ok, true);
});

test("renewal happens at most once a day and re-arms a 30-day window", async () => {
  const { ctx, token, session } = await signedIn();
  const early = await resolveAt(ctx, token, NOW + 3600);
  assert.equal(early.renewedMaxAge, null);
  const row1 = await ctx.db.prepare("SELECT expires_at, renewed_at FROM sessions WHERE id = ?1").bind(session.id).first();
  assert.deepEqual(row1, { expires_at: NOW + SESSION_WINDOW_SECONDS, renewed_at: NOW });
  const nextDay = await resolveAt(ctx, token, NOW + DAY);
  assert.equal(nextDay.renewedMaxAge, SESSION_WINDOW_SECONDS);
  const row2 = await ctx.db.prepare("SELECT expires_at, renewed_at FROM sessions WHERE id = ?1").bind(session.id).first();
  assert.deepEqual(row2, { expires_at: NOW + DAY + SESSION_WINDOW_SECONDS, renewed_at: NOW + DAY });
});

test("a daily user is still signed in at day 91", async () => {
  const { ctx, token } = await signedIn();
  for (let day = 1; day <= 91; day += 1) {
    assert.equal((await resolveAt(ctx, token, NOW + day * DAY)).ok, true, `day ${day}`);
  }
});

test("the absolute cap ends even a daily user's session at SESSION_MAX_DAYS", async () => {
  const { ctx, token, session } = await signedIn();
  for (let day = 1; day <= 179; day += 1) {
    await resolveAt(ctx, token, NOW + day * DAY);
  }
  const row = await ctx.db.prepare("SELECT expires_at FROM sessions WHERE id = ?1").bind(session.id).first();
  assert.equal(row.expires_at, NOW + 180 * DAY, "renewal never passes created_at + cap");
  assert.deepEqual(await resolveAt(ctx, token, NOW + 180 * DAY), { ok: false, reason: "session_expired" });
});

test("an idle user past the 30-day window is signed out", async () => {
  const { ctx, token } = await signedIn();
  assert.deepEqual(await resolveAt(ctx, token, NOW + SESSION_WINDOW_SECONDS), { ok: false, reason: "session_expired" });
});

test("a short SESSION_MAX_DAYS caps the first expiry too", async () => {
  const { ctx, session } = await signedIn({ SESSION_MAX_DAYS: "10" });
  const row = await ctx.db.prepare("SELECT expires_at FROM sessions WHERE id = ?1").bind(session.id).first();
  assert.equal(row.expires_at, NOW + 10 * DAY);
});

test("disabled and deleted accounts cannot use their sessions", async () => {
  const { ctx, account, token } = await signedIn();
  await ctx.db.prepare("UPDATE accounts SET disabled_at = ?2 WHERE id = ?1").bind(account.id, NOW).run();
  assert.deepEqual(await resolveAt(ctx, token, NOW), { ok: false, reason: "account_disabled" });
  await ctx.db.prepare("UPDATE accounts SET disabled_at = NULL, deleted_at = ?2 WHERE id = ?1").bind(account.id, NOW).run();
  assert.deepEqual(await resolveAt(ctx, token, NOW), { ok: false, reason: "account_deleted" });
});

test("recent authentication means a session created in the last 10 minutes", () => {
  assert.equal(isRecentAuth({ created_at: NOW - 600 }, NOW), true);
  assert.equal(isRecentAuth({ created_at: NOW - 601 }, NOW), false);
});
