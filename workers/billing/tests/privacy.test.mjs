/**
 * GET /v1/me/export and DELETE /v1/me (DESIGN-v2 §4; Ley 29733 access and
 * cancellation rights).
 *
 * Both need recent authentication (session created <= 10 min ago). Delete
 * first cancels every non-terminal provider subscription through the
 * provider registry (these tests inject a fake one; subscription.test.mjs
 * drives the real Mercado Pago and Creem adapters), and any
 * failure is 502 cancel_failed with NOTHING deleted. Then identities,
 * sessions, progress, login codes and roles go; the account is tombstoned
 * (email HMAC kept); billing rows stay without an email; reports are
 * anonymized and their screenshots deleted.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { hmacHex } from "../src/crypto.mjs";
import { NOW, accountSnapshot, api, count, createHarness, seedAccount, seedBystander, sql } from "./fixtures.mjs";

const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

/**
 * A learner with a bit of everything, and a fresh session.
 * @param {Object} [overrides] Env overrides.
 * @returns {Promise<Object>} Harness.
 */
async function richLearner(overrides) {
  const { env, ctx } = await createHarness(overrides);
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const me = await seedAccount(env, { email: "ana@example.test", identities: [["email", "ana@example.test"], ["google", "110000000000000000042"]] });
  const id = me.account.id;
  await sql(env, "INSERT INTO grants (id, account_id, kind, days, created_at, note, issued_by) VALUES ('grant_1', ?1, 'gift', 30, ?2, 'prima de Luis', ?3)", id, NOW - 100, admin.account.id);
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)", id, NOW - 50);
  await sql(env, "INSERT INTO progress (account_id, rev, doc, size_bytes, updated_at) VALUES (?1, 3, '{\"v\":1}', 7, ?2)", id, NOW - 10);
  await sql(env, "INSERT INTO login_codes (id, email_normalized, code_hmac, created_at, expires_at) VALUES ('code_1', 'ana@example.test', 'codehmac00secret', ?1, ?2)", NOW - 5, NOW + 900);
  await sql(env, "INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_1', ?1, 'creem', 'pro_monthly', 799, 'USD', ?2, 'open')", id, NOW - 20);
  await sql(
    env,
    "INSERT INTO reports (id, created_at, updated_at, account_id, reporter_alias, source, category, status, title, client_issue_id) VALUES ('rep_1', ?1, ?1, ?2, 'Ana', 'qa_harness', 'content', 'new', 'Error en S03', 'issue-0001')",
    NOW - 30,
    id
  );
  await env.DB.prepare("INSERT INTO report_attachments (id, report_id, mime, bytes, created_at) VALUES ('att_1', 'rep_1', 'image/png', ?1, ?2)").bind(PNG.buffer, NOW - 30).run();
  await sql(env, "INSERT INTO audit_log (actor_account_id, action, target_account_id, created_at) VALUES (?1, 'admin.grants.create', ?2, ?3)", admin.account.id, id, NOW - 100);
  await sql(env, "INSERT INTO audit_log (actor_account_id, action, target_account_id, created_at) VALUES (?1, 'trial.start', ?1, ?2)", id, NOW - 90);
  await sql(env, "INSERT INTO audit_log (actor_account_id, action, target_account_id, created_at) VALUES (NULL, 'webhook.unmatched', ?1, ?2)", id, NOW - 80);
  return { env, ctx, admin, me, id };
}

/**
 * Add a subscription (and a charge) for the learner.
 * @param {Object} env Env.
 * @param {string} accountId Account id.
 * @param {string} subId Subscription id.
 * @param {string} provider Provider.
 * @param {string} status Status.
 * @returns {Promise<void>} Resolves when inserted.
 */
async function subscription(env, accountId, subId, provider, status) {
  await sql(
    env,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, 'pro_monthly', 1990, 'PEN', ?5, ?6, ?6)`,
    subId,
    accountId,
    provider,
    `ref_${subId}`,
    status,
    NOW - 1000
  );
  await sql(
    env,
    `INSERT INTO charges (id, provider, provider_charge_id, subscription_id, account_id, amount_minor, currency, status, approved_at, period_start, period_end, created_at, updated_at)
     VALUES (?1, ?2, ?1, ?3, ?4, 1990, 'PEN', 'approved', ?5, ?5, ?6, ?5, ?5)`,
    `ch_${subId}`,
    provider,
    subId,
    accountId,
    NOW - 1000,
    NOW + 100000
  );
}

/**
 * A fake provider registry recording cancel calls.
 * @param {Object} [outcomes] provider -> "ok" | "fail" | "throw".
 * @returns {{providers: Object, calls: string[]}} Registry.
 */
function fakeProviders(outcomes) {
  const calls = [];
  const provider = (name) => ({
    async cancel(ctx, sub) {
      calls.push(`${name}:${sub.id}`);
      const outcome = (outcomes || {})[name] || "ok";
      if (outcome === "throw") {
        throw new Error("provider down");
      }
      return outcome === "ok" ? { ok: true, status: "canceled" } : { ok: false, reason: "provider_error" };
    }
  });
  return { providers: { mercadopago: provider("mercadopago"), creem: provider("creem") }, calls };
}

/**
 * DELETE /v1/me.
 * @param {Object} env Env.
 * @param {string} token Session.
 * @param {Object} [extra] api() options.
 * @returns {Promise<Object>} Response.
 */
function deleteMe(env, token, extra) {
  return api(env, "DELETE", "/v1/me", { cookie: token, body: { confirm: "DELETE" }, ...(extra || {}) });
}

test("export and delete need a sign-in from the last 10 minutes", async () => {
  const h = await richLearner();
  const late = { now: NOW + 601 };
  const exp = await api(h.env, "GET", "/v1/me/export", { cookie: h.me.token, ...late });
  assert.deepEqual([exp.status, exp.body.reason], [401, "reauth_required"]);
  const del = await deleteMe(h.env, h.me.token, late);
  assert.deepEqual([del.status, del.body.reason], [401, "reauth_required"]);
  assert.equal((await api(h.env, "GET", "/v1/me/export", { cookie: h.me.token, now: NOW + 600 })).status, 200);
});

test("the export holds the person's data and none of the internal hashes", async () => {
  const h = await richLearner();
  await subscription(h.env, h.id, "sub_1", "mercadopago", "active");
  const res = await api(h.env, "GET", "/v1/me/export", { cookie: h.me.token });
  assert.equal(res.status, 200);
  const e = res.body;
  assert.deepEqual([e.account.id, e.account.email, e.exportedAt], [h.id, "ana@example.test", NOW]);
  assert.deepEqual(e.identities.map((i) => [i.provider, i.subject]).sort(), [["email", "ana@…st"], ["google", "1100…42"]]);
  assert.deepEqual(e.grants.map((g) => [g.id, g.kind, g.note, g.state]), [["grant_1", "gift", "prima de Luis", "upcoming"]], "the paid subscription defers the gift");
  assert.deepEqual(e.roles.map((r) => r.role), ["tester"]);
  assert.deepEqual(e.progress, { rev: 3, doc: { v: 1 }, updatedAt: NOW - 10 });
  assert.deepEqual(e.subscriptions.map((s) => [s.id, s.providerRef, s.status]), [["sub_1", "ref_sub_1", "active"]]);
  assert.deepEqual(e.charges.map((c) => [c.id, c.amountMinor, c.currency]), [["ch_sub_1", 1990, "PEN"]]);
  assert.deepEqual(e.checkouts.map((c) => [c.id, c.status]), [["chk_1", "open"]]);
  assert.deepEqual(e.reports.map((r) => [r.id, r.title, r.attachments.length]), [["rep_1", "Error en S03", 1]]);
  assert.equal(e.sessions.filter((s) => s.current).length, 1);
  assert.deepEqual(e.audit.map((a) => [a.action, a.actor]).sort(), [["admin.grants.create", "admin"], ["trial.start", "self"], ["webhook.unmatched", "system"]]);
  const text = JSON.stringify(e);
  const tokenHashes = (await h.env.DB.prepare("SELECT token_hash FROM sessions WHERE account_id = ?1").bind(h.id).all()).results.map((r) => r.token_hash);
  for (const secret of [...tokenHashes, "codehmac00secret", h.me.token, "110000000000000000042"]) {
    assert.ok(!text.includes(secret), `the export must not contain ${secret.slice(0, 12)}…`);
  }
  assert.ok(!/token_hash|code_hmac|email_hmac|tokenHash|codeHmac|emailHmac/.test(text));
});

test("delete needs the confirmation word", async () => {
  const h = await richLearner();
  const res = await api(h.env, "DELETE", "/v1/me", { cookie: h.me.token, body: { confirm: "delete" } });
  assert.deepEqual([res.status, res.body.reason], [400, "confirm_required"]);
  assert.equal(await count(h.env, "FROM accounts WHERE id = ?1 AND deleted_at IS NULL", h.id), 1);
});

test("delete removes personal data, keeps billing records without an email, and tombstones the account", async () => {
  const h = await richLearner();
  await subscription(h.env, h.id, "sub_old", "creem", "canceled");
  const res = await deleteMe(h.env, h.me.token);
  assert.deepEqual([res.status, res.body], [200, { ok: true, deleted: true }]);
  assert.match(res.setCookie, /Max-Age=0/);
  const account = await h.env.DB.prepare("SELECT * FROM accounts WHERE id = ?1").bind(h.id).first();
  assert.deepEqual(
    [account.deleted_at, account.email, account.email_normalized, account.display_name, account.email_hmac],
    [NOW, null, null, null, await hmacHex(h.ctx.pepper, "tombstone:ana@example.test")]
  );
  for (const [table, where] of [
    ["identities", "account_id = ?1"],
    ["sessions", "account_id = ?1"],
    ["progress", "account_id = ?1"],
    ["account_roles", "account_id = ?1"],
    ["login_codes", "email_normalized = 'ana@example.test' AND ?1 IS NOT NULL"],
    ["report_attachments", "report_id = 'rep_1' AND ?1 IS NOT NULL"]
  ]) {
    assert.equal(await count(h.env, `FROM ${table} WHERE ${where}`, h.id), 0, `${table} deleted`);
  }
  assert.deepEqual(await h.env.DB.prepare("SELECT account_id, reporter_alias, contact_email, title FROM reports WHERE id = 'rep_1'").first(), {
    account_id: null,
    reporter_alias: null,
    contact_email: null,
    title: "Error en S03"
  });
  assert.deepEqual(await h.env.DB.prepare("SELECT account_id, note FROM grants WHERE id = 'grant_1'").first(), { account_id: h.id, note: null });
  assert.equal(await count(h.env, "FROM subscriptions WHERE account_id = ?1", h.id), 1, "billing records stay");
  assert.equal(await count(h.env, "FROM charges WHERE account_id = ?1", h.id), 1);
  assert.equal(await h.env.DB.prepare("SELECT status FROM checkouts WHERE id = 'chk_1'").first("status"), "expired");
  assert.equal(await count(h.env, "FROM audit_log WHERE action = 'account.delete' AND target_account_id = ?1", h.id), 1);
  assert.equal((await api(h.env, "GET", "/v1/me", { cookie: h.me.token })).status, 401);
});

test("after deletion the same email is a new account, and it cannot take a second trial", async () => {
  const h = await richLearner();
  assert.equal((await api(h.env, "POST", "/v1/me/trial", { cookie: h.me.token, body: {} })).status, 200);
  assert.equal((await deleteMe(h.env, h.me.token)).status, 200);
  const again = await seedAccount(h.env, { email: "ana@example.test" });
  assert.notEqual(again.account.id, h.id);
  const trial = await api(h.env, "POST", "/v1/me/trial", { cookie: again.token, body: {} });
  assert.deepEqual([trial.status, trial.body.reason], [409, "trial_used"]);
});

test("with no provider able to cancel a live subscription, delete is 502 and nothing is deleted", async () => {
  const h = await richLearner();
  await subscription(h.env, h.id, "sub_live", "mercadopago", "active");
  const res = await deleteMe(h.env, h.me.token);
  assert.deepEqual([res.status, res.body.reason], [502, "cancel_failed"]);
  assert.equal(await count(h.env, "FROM accounts WHERE id = ?1 AND deleted_at IS NULL AND email IS NOT NULL", h.id), 1);
  assert.equal(await count(h.env, "FROM identities WHERE account_id = ?1", h.id), 2);
  assert.equal(await count(h.env, "FROM progress WHERE account_id = ?1", h.id), 1);
  assert.equal(await h.env.DB.prepare("SELECT status FROM subscriptions WHERE id = 'sub_live'").first("status"), "active");
  assert.equal((await api(h.env, "GET", "/v1/me", { cookie: h.me.token })).status, 200, "still signed in");
});

test("with a provider that confirms, every non-terminal subscription is cancelled first, then the account is deleted", async () => {
  const h = await richLearner();
  await subscription(h.env, h.id, "sub_mp", "mercadopago", "active");
  await subscription(h.env, h.id, "sub_pending", "creem", "pending");
  await subscription(h.env, h.id, "sub_done", "creem", "canceled");
  const fake = fakeProviders();
  const res = await deleteMe(h.env, h.me.token, { providers: fake.providers });
  assert.equal(res.status, 200);
  assert.deepEqual(fake.calls.sort(), ["creem:sub_pending", "mercadopago:sub_mp"], "terminal subscriptions are not cancelled again");
  const statuses = (await h.env.DB.prepare("SELECT id, status FROM subscriptions ORDER BY id").all()).results;
  assert.deepEqual(statuses.map((s) => [s.id, s.status]), [["sub_done", "canceled"], ["sub_mp", "canceled"], ["sub_pending", "canceled"]]);
  assert.equal(await count(h.env, "FROM subscription_events WHERE kind = 'cancel.account_deletion'"), 2);
  assert.equal(await count(h.env, "FROM accounts WHERE id = ?1 AND deleted_at = ?2", h.id, NOW), 1);
});

test("one failed cancel stops the deletion; the cancel that did succeed is recorded", async () => {
  for (const outcome of ["fail", "throw"]) {
    const h = await richLearner();
    await subscription(h.env, h.id, "sub_mp", "mercadopago", "active");
    await subscription(h.env, h.id, "sub_creem", "creem", "past_due");
    const fake = fakeProviders({ creem: outcome });
    const res = await deleteMe(h.env, h.me.token, { providers: fake.providers });
    assert.deepEqual([outcome, res.status, res.body.reason], [outcome, 502, "cancel_failed"]);
    const statuses = Object.fromEntries((await h.env.DB.prepare("SELECT id, status FROM subscriptions").all()).results.map((s) => [s.id, s.status]));
    assert.deepEqual(statuses, { sub_mp: "canceled", sub_creem: "past_due" });
    assert.equal(await count(h.env, "FROM accounts WHERE id = ?1 AND deleted_at IS NULL", h.id), 1);
    assert.equal(await count(h.env, "FROM audit_log WHERE action = 'account.delete_failed' AND target_account_id = ?1", h.id), 1);
  }
});

test("review: the export holds ONLY the caller's rows — a bystander's sessions, roles, checkouts, reports, progress and audit stay out", async () => {
  const h = await richLearner();
  await subscription(h.env, h.id, "sub_1", "mercadopago", "active");
  const other = await seedBystander(h.env, { issuer: h.admin.account.id });
  const read = [];
  h.env.DB.observe((sqlText, rows) => read.push(...rows));
  const res = await api(h.env, "GET", "/v1/me/export", { cookie: h.me.token });
  assert.equal(res.status, 200);
  const touched = JSON.stringify(read);
  for (const id of [other.id, ...Object.values(other.ids)]) {
    assert.ok(!touched.includes(id), `the export read the bystander's ${id} from the database`);
  }
  const e = res.body;
  const text = JSON.stringify(e);
  const foreign = [other.id, other.email, "luis.bystander@gmail.com", "Informe de Luis", "regalo de Luis", "bystander role", "bystander-target", "bystander.event", "\"who\"", ...Object.values(other.ids), "ref_bystander"];
  for (const value of foreign) {
    assert.ok(!text.includes(value), `the export leaks the bystander's ${value}`);
  }
  assert.equal(e.sessions.length, 1, "only the caller's own session");
  assert.deepEqual(e.roles.length, 1);
  assert.deepEqual(e.checkouts.map((c) => c.id), ["chk_1"]);
  assert.deepEqual(e.reports.map((r) => r.id), ["rep_1"]);
  assert.deepEqual(e.identities.length, 2);
  assert.equal(e.audit.length, 3);
  assert.deepEqual(e.progress.doc, { v: 1 });
  await sql(h.env, "DELETE FROM progress WHERE account_id = ?1", h.id);
  const without = await api(h.env, "GET", "/v1/me/export", { cookie: h.me.token });
  assert.equal(without.body.progress, null, "no progress of their own: none, never someone else's");
});

test("review: deleting one account leaves a bystander's every row untouched and cancels only the caller's subscriptions", async () => {
  const h = await richLearner();
  await subscription(h.env, h.id, "sub_mine", "creem", "active");
  const other = await seedBystander(h.env, { issuer: h.admin.account.id });
  const before = await accountSnapshot(h.env, other.id);
  const adminBefore = await accountSnapshot(h.env, h.admin.account.id);
  const fake = fakeProviders();
  const res = await deleteMe(h.env, h.me.token, { providers: fake.providers });
  assert.equal(res.status, 200);
  assert.deepEqual(fake.calls, ["creem:sub_mine"], "the bystander's live subscription is not cancelled at the provider");
  assert.deepEqual(await accountSnapshot(h.env, other.id), before, "every bystander row is identical after the delete");
  assert.deepEqual(await accountSnapshot(h.env, h.admin.account.id), adminBefore, "the admin's rows too");
  assert.equal((await api(h.env, "GET", "/v1/me", { cookie: other.token })).status, 200, "the bystander is still signed in");
  assert.equal(await count(h.env, "FROM accounts WHERE deleted_at IS NOT NULL"), 1, "exactly one account was tombstoned");
});

test("review: at most 10 exports per account per hour; the 11th is 429 and another account is unaffected", async () => {
  const h = await richLearner();
  for (let i = 0; i < 10; i += 1) {
    assert.equal((await api(h.env, "GET", "/v1/me/export", { cookie: h.me.token, now: NOW + i })).status, 200, `export ${i + 1}`);
  }
  const eleventh = await api(h.env, "GET", "/v1/me/export", { cookie: h.me.token, now: NOW + 10 });
  assert.deepEqual([eleventh.status, eleventh.body.reason], [429, "rate_limited"]);
  assert.ok(eleventh.body.retryAfter > 0);
  const other = await seedAccount(h.env, { email: "luis@example.test" });
  assert.equal((await api(h.env, "GET", "/v1/me/export", { cookie: other.token, now: NOW + 11 })).status, 200);
});
