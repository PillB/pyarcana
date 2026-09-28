/**
 * accounts.mjs: account rows, identities (race-safe), sign-in bookkeeping,
 * active roles and the admin rule.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  accountBlockReason,
  activeRoles,
  createAccount,
  createAccountDetailed,
  findIdentity,
  findLiveAccountByEmail,
  getAccount,
  isAdminSession,
  linkIdentity,
  recordSignin
} from "../src/accounts.mjs";
import { NOW, TERMS_VERSION, createCtx } from "./fixtures.mjs";

/**
 * Create a verified-email account.
 * @param {Object} ctx Context.
 * @param {string} email Normalized email.
 * @returns {Promise<Object>} Account row.
 */
function verified(ctx, email) {
  return createAccount(ctx, { email, emailNormalized: email, emailVerified: true });
}

test("createAccount stores a verified account with an acct_ id", async () => {
  const ctx = await createCtx();
  const account = await verified(ctx, "ana@example.test");
  assert.match(account.id, /^acct_[A-Za-z0-9_-]{22}$/);
  assert.equal(account.email_normalized, "ana@example.test");
  assert.equal(account.email_verified, 1);
  assert.equal(account.created_at, NOW);
  assert.equal(account.first_signin_at, null);
});

test("two concurrent creates for one email end on the same account, and only one reports it created it", async () => {
  const ctx = await createCtx();
  const fields = { email: "race@example.test", emailNormalized: "race@example.test", emailVerified: true };
  const [a, b] = await Promise.all([createAccountDetailed(ctx, fields), createAccountDetailed(ctx, fields)]);
  assert.equal(a.account.id, b.account.id);
  assert.deepEqual([a.created, b.created].sort(), [false, true]);
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM accounts").first("c"), 1);
});

test("a deleted account is invisible to email lookup", async () => {
  const ctx = await createCtx();
  const account = await verified(ctx, "gone@example.test");
  await ctx.db.prepare("UPDATE accounts SET deleted_at = ?2 WHERE id = ?1").bind(account.id, NOW).run();
  assert.equal(await findLiveAccountByEmail(ctx.db, "gone@example.test"), null);
  const fresh = await verified(ctx, "gone@example.test");
  assert.notEqual(fresh.id, account.id);
});

test("an unverified display email is stored but never found by email", async () => {
  const ctx = await createCtx();
  const account = await createAccount(ctx, { email: "claimed@example.test", emailNormalized: null, emailVerified: false });
  assert.equal(account.email, "claimed@example.test");
  assert.equal(account.email_normalized, null);
  assert.equal(await findLiveAccountByEmail(ctx.db, "claimed@example.test"), null);
  assert.equal((await getAccount(ctx.db, account.id)).id, account.id);
});

test("linkIdentity is idempotent for the same account and refuses another's identity", async () => {
  const ctx = await createCtx();
  const a = await verified(ctx, "a@example.test");
  const b = await verified(ctx, "b@example.test");
  const link = (accountId) => linkIdentity(ctx, { provider: "google", subject: "sub-1", accountId, emailAtLink: "a@example.test" });
  assert.deepEqual(await link(a.id), { ok: true, accountId: a.id });
  assert.deepEqual(await link(a.id), { ok: true, accountId: a.id });
  assert.deepEqual(await link(b.id), { ok: false, reason: "identity_in_use", accountId: a.id });
  assert.equal((await findIdentity(ctx.db, "google", "sub-1")).account_id, a.id);
});

test("two accounts racing to link one identity: exactly one wins", async () => {
  const ctx = await createCtx();
  const a = await verified(ctx, "a@example.test");
  const b = await verified(ctx, "b@example.test");
  const results = await Promise.all(
    [a, b].map((acct) => linkIdentity(ctx, { provider: "microsoft", subject: "tid:oid", accountId: acct.id, emailAtLink: null }))
  );
  assert.equal(results.filter((r) => r.ok).length, 1);
  assert.equal(results.filter((r) => r.reason === "identity_in_use").length, 1);
});

test("recordSignin sets first_signin_at once and refreshes terms and age each time", async () => {
  const ctx = await createCtx();
  const account = await createAccount(ctx, { email: "g@example.test", emailNormalized: "g@example.test", emailVerified: false });
  await recordSignin(ctx, account.id, { termsVersion: TERMS_VERSION, emailVerified: true });
  const later = { ...ctx, now: NOW + 5000 };
  await recordSignin(later, account.id, { termsVersion: "2027-01-01", emailVerified: false });
  const row = await getAccount(ctx.db, account.id);
  assert.equal(row.first_signin_at, NOW);
  assert.equal(row.terms_version, "2027-01-01");
  assert.equal(row.age_confirmed_at, NOW + 5000);
  assert.equal(row.email_verified, 1, "a later unverified sign-in never downgrades");
});

test("accountBlockReason names disabled and deleted accounts", () => {
  assert.equal(accountBlockReason({ disabled_at: null, deleted_at: null }), null);
  assert.equal(accountBlockReason({ disabled_at: 5, deleted_at: null }), "account_disabled");
  assert.equal(accountBlockReason({ disabled_at: null, deleted_at: 5 }), "account_deleted");
  assert.equal(accountBlockReason(null), "no_account");
});

test("activeRoles lists only unrevoked, unexpired roles", async () => {
  const ctx = await createCtx();
  const account = await verified(ctx, "qa@example.test");
  const role = (created, expires, revoked) =>
    ctx.db
      .prepare("INSERT INTO account_roles (account_id, role, created_at, expires_at, revoked_at) VALUES (?1, 'tester', ?2, ?3, ?4)")
      .bind(account.id, created, expires, revoked)
      .run();
  assert.deepEqual(await activeRoles(ctx, account.id), []);
  await role(NOW - 30, NOW - 10, null);
  await role(NOW - 20, null, NOW - 5);
  assert.deepEqual(await activeRoles(ctx, account.id), []);
  await role(NOW - 10, NOW + 100, null);
  assert.deepEqual(await activeRoles(ctx, account.id), ["tester"]);
});

test("admin needs a verified listed email AND a Google session younger than 12 h", () => {
  const env = { ADMIN_EMAILS: "Owner@gmail.com" };
  const account = { email_normalized: "owner@gmail.com", email_verified: 1 };
  const session = { method: "google", created_at: NOW - 3600 };
  assert.equal(isAdminSession(env, account, session, NOW), true);
  assert.equal(isAdminSession(env, account, { ...session, method: "email" }, NOW), false);
  assert.equal(isAdminSession(env, account, { ...session, method: "microsoft" }, NOW), false);
  assert.equal(isAdminSession(env, account, { ...session, created_at: NOW - 12 * 3600 - 1 }, NOW), false);
  assert.equal(isAdminSession(env, { ...account, email_verified: 0 }, session, NOW), false);
  assert.equal(isAdminSession(env, { ...account, email_normalized: "other@gmail.com" }, session, NOW), false);
  assert.equal(isAdminSession({}, account, session, NOW), false);
});
