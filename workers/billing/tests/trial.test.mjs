/**
 * POST /v1/me/trial (DESIGN-v2 §4 + v3: TRIAL_DAYS default 7).
 *
 * One trial per person, not per account row: trial_claims holds
 * HMAC(pepper, key) for the account id, every PROVEN email in canonical form
 * (+tag and Gmail dots stripped) and every google / microsoft subject, and it
 * survives account deletion. The claim inserts, the account flag and the
 * grant are one db.batch, so concurrent calls cannot mint two trials.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, count, createHarness, seedAccount, sql } from "./fixtures.mjs";

const DAY = 86400;

/**
 * POST /v1/me/trial for a session.
 * @param {Object} env Env.
 * @param {string} token Session token.
 * @returns {Promise<Object>} Response.
 */
function startTrial(env, token) {
  return api(env, "POST", "/v1/me/trial", { cookie: token, body: {} });
}

/**
 * Tombstone an account the way DELETE /v1/me does (identities and sessions gone).
 * @param {Object} env Env.
 * @param {string} accountId Account id.
 * @returns {Promise<void>} Resolves when done.
 */
async function tombstone(env, accountId) {
  await sql(env, "DELETE FROM identities WHERE account_id = ?1", accountId);
  await sql(env, "DELETE FROM sessions WHERE account_id = ?1", accountId);
  await sql(env, "UPDATE accounts SET deleted_at = ?2, email = NULL, email_normalized = NULL WHERE id = ?1", accountId, NOW);
}

test("a signed-in account starts a 7-day trial and gets the me payload back", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env, { email: "ana@example.test" });
  const res = await startTrial(env, me.token);
  assert.equal(res.status, 200);
  assert.equal(res.body.access.isPro, true);
  assert.equal(res.body.access.source, "trial");
  assert.equal(res.body.access.accessEnd, NOW + 7 * DAY);
  assert.equal(res.body.account.trialAvailable, false);
  assert.deepEqual(
    res.body.grants.map((g) => [g.kind, g.days, g.state, g.start, g.end]),
    [["trial", 7, "active", NOW, NOW + 7 * DAY]]
  );
  const account = await env.DB.prepare("SELECT trial_used_at FROM accounts WHERE id = ?1").bind(me.account.id).first();
  assert.equal(account.trial_used_at, NOW);
  assert.equal(await count(env, "FROM trial_claims"), 2, "account id + canonical email");
  const audit = await env.DB.prepare("SELECT action, actor_account_id, target_account_id, target_id FROM audit_log").first();
  assert.deepEqual(audit, { action: "trial.start", actor_account_id: me.account.id, target_account_id: me.account.id, target_id: res.body.grants[0].id });
});

test("TRIAL_DAYS sets the length", async () => {
  const { env } = await createHarness({ TRIAL_DAYS: "14" });
  const me = await seedAccount(env);
  assert.equal((await startTrial(env, me.token)).body.access.accessEnd, NOW + 14 * DAY);
});

test("a second trial on the same account is 409 trial_used", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  assert.equal((await startTrial(env, me.token)).status, 200);
  const again = await startTrial(env, me.token);
  assert.deepEqual([again.status, again.body], [409, { ok: false, reason: "trial_used" }]);
  assert.equal(await count(env, "FROM grants"), 1);
});

test("20 concurrent trial calls create exactly one grant", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env, { email: "burst@example.test" });
  const results = await Promise.all(Array.from({ length: 20 }, () => startTrial(env, me.token)));
  const statuses = results.map((r) => r.status).sort();
  assert.deepEqual(statuses, [200, ...Array(19).fill(409)]);
  assert.ok(results.filter((r) => r.status === 409).every((r) => r.body.reason === "trial_used"));
  assert.equal(await count(env, "FROM grants WHERE kind = 'trial'"), 1);
  assert.equal(await count(env, "FROM trial_claims"), 2);
});

test("delete and sign up again with the same email: no second trial", async () => {
  const { env } = await createHarness();
  const first = await seedAccount(env, { email: "ana@example.test" });
  assert.equal((await startTrial(env, first.token)).status, 200);
  await tombstone(env, first.account.id);
  const second = await seedAccount(env, { email: "ana@example.test" });
  assert.notEqual(second.account.id, first.account.id);
  const res = await startTrial(env, second.token);
  assert.deepEqual([res.status, res.body.reason], [409, "trial_used"]);
  assert.equal((await api(env, "GET", "/v1/me", { cookie: second.token })).body.account.trialAvailable, false);
});

test("+tag and Gmail-dot aliases of a claimed mailbox cannot start a trial", async () => {
  const { env } = await createHarness();
  const owner = await seedAccount(env, { email: "anaperez@gmail.com" });
  assert.equal((await startTrial(env, owner.token)).status, 200);
  for (const alias of ["ana.perez@gmail.com", "a.n.a.perez+pyarcana@googlemail.com", "AnaPerez+2@gmail.com"]) {
    const other = await seedAccount(env, { email: alias.toLowerCase() });
    const res = await startTrial(env, other.token);
    assert.deepEqual([alias, res.status, res.body.reason], [alias, 409, "trial_used"]);
  }
  const plusTag = await seedAccount(env, { email: "luis@example.test" });
  assert.equal((await startTrial(env, plusTag.token)).status, 200);
  const alias = await seedAccount(env, { email: "luis+again@example.test" });
  assert.equal((await startTrial(env, alias.token)).status, 409);
  const stranger = await seedAccount(env, { email: "luisa@example.test" });
  assert.equal((await startTrial(env, stranger.token)).status, 200, "a different mailbox is not an alias");
});

test("a Google or Microsoft subject that already had a trial cannot have another after deletion", async () => {
  const { env } = await createHarness();
  const google = await seedAccount(env, { email: "g1@example.test", identities: [["google", "sub-123"]], method: "google" });
  assert.equal((await startTrial(env, google.token)).status, 200);
  await tombstone(env, google.account.id);
  const again = await seedAccount(env, { email: "renamed@example.test", identities: [["google", "sub-123"]], method: "google" });
  assert.equal((await startTrial(env, again.token)).status, 409);
  const ms = await seedAccount(env, { email: null, verified: false, identities: [["microsoft", "tid:oid-1"]], method: "microsoft" });
  assert.equal((await startTrial(env, ms.token)).status, 200);
  await tombstone(env, ms.account.id);
  const msAgain = await seedAccount(env, { email: null, verified: false, identities: [["microsoft", "tid:oid-1"]], method: "microsoft" });
  assert.equal((await startTrial(env, msAgain.token)).status, 409);
});

test("each proven email source is claimed in canonical form on its own", async () => {
  const { env } = await createHarness();
  const accountEmail = await seedAccount(env, { email: "a.b@gmail.com", identities: [["google", "s-1", null]], method: "google" });
  assert.equal((await startTrial(env, accountEmail.token)).status, 200);
  const identityOnly = await seedAccount(env, { email: null, verified: false, identities: [["email", "x.y+1@gmail.com"]] });
  assert.equal((await startTrial(env, identityOnly.token)).status, 200);
  const googleOnly = await seedAccount(env, { email: null, verified: false, identities: [["google", "s-2", "C.D@gmail.com"]], method: "google" });
  assert.equal((await startTrial(env, googleOnly.token)).status, 200);
  for (const alias of ["ab@gmail.com", "xy@gmail.com", "cd@gmail.com"]) {
    const other = await seedAccount(env, { email: alias });
    assert.deepEqual([alias, (await startTrial(env, other.token)).status], [alias, 409]);
  }
});

test("an unproven (Microsoft-claimed) email cannot burn the real owner's trial", async () => {
  const { env } = await createHarness();
  const squatter = await seedAccount(env, { email: "victim@example.test", verified: false, identities: [["microsoft", "tid:oid-9"]], method: "microsoft" });
  assert.equal((await startTrial(env, squatter.token)).status, 200);
  const victim = await seedAccount(env, { email: "victim@example.test" });
  assert.equal((await startTrial(env, victim.token)).status, 200);
});

test("an account whose subscription was ever active gets 409 trial_not_available", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  await sql(
    env,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, first_active_at, created_at, updated_at)
     VALUES ('sub_1', ?1, 'creem', 'ref', 'pro_monthly', 799, 'USD', 'canceled', ?2, ?2, ?2)`,
    me.account.id,
    NOW - 60 * DAY
  );
  const res = await startTrial(env, me.token);
  assert.deepEqual([res.status, res.body.reason], [409, "trial_not_available"]);
  assert.equal(await count(env, "FROM trial_claims"), 0);
});

test("the account flag alone also refuses (no claim rows needed)", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env);
  await sql(env, "UPDATE accounts SET trial_used_at = ?1 WHERE id = ?2", NOW - DAY, me.account.id);
  assert.equal((await startTrial(env, me.token)).body.reason, "trial_used");
});

test("fail closed: no pepper is 503, no session is 401, and claim keys are never stored in clear", async () => {
  const { env } = await createHarness();
  const me = await seedAccount(env, { email: "clear@example.test" });
  const noPepper = await startTrial({ ...env, SERVER_PEPPER: undefined }, me.token);
  assert.deepEqual([noPepper.status, noPepper.body.reason], [503, "pepper_not_configured"]);
  assert.equal((await startTrial(env, undefined)).status, 401);
  await startTrial(env, me.token);
  const keys = (await env.DB.prepare("SELECT key FROM trial_claims").all()).results.map((r) => r.key);
  assert.ok(keys.every((k) => /^[0-9a-f]{64}$/.test(k)), "HMAC hex only");
  assert.ok(keys.every((k) => !k.includes("clear") && !k.includes(me.account.id)));
});
