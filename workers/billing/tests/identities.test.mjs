/**
 * Sign-in methods an account holds (review round 1, ASVS 2.5 / 3.7):
 *   - linking a method emails the account's proven address a notice;
 *   - GET /v1/me lists the methods (masked subjects);
 *   - DELETE /v1/me/identities/:provider (recent auth) removes a Google or
 *     Microsoft method and ends the sessions it created, but never the last
 *     way in.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { clearJwksCache } from "../src/jwt.mjs";
import { migrate, resetSchemaMemo } from "../src/schema.mjs";
import {
  NOW,
  TERMS_VERSION,
  api,
  count,
  createEnv,
  createIdentityProviders,
  freshNonce,
  googleClaims,
  microsoftClaims,
  seedAccount
} from "./fixtures.mjs";

const TERMS = { ageConfirmed: true, termsVersion: TERMS_VERSION };

/**
 * Env, providers and helpers.
 * @returns {Promise<Object>} Harness.
 */
async function harness() {
  resetSchemaMemo();
  clearJwksCache();
  const env = createEnv();
  const idp = await createIdentityProviders();
  await migrate(env.DB);
  const call = (method, path, opts = {}) => api(env, method, path, { fetchImpl: idp.fake.fetchImpl, ...opts });
  const msProof = async (patch) => {
    const n = freshNonce();
    return { idToken: await idp.microsoft.sign(microsoftClaims({ nonce: n.nonce, ...(patch || {}) })), noncePreimage: n.preimage };
  };
  return { env, idp, call, msProof };
}

const ATTACKER = { oid: "99999999-0000-0000-0000-000000000001", email: "attacker@outlook.test", preferred_username: "attacker@outlook.test" };

test("linking a sign-in method emails the proven address a notice (no links), and /v1/me lists the methods", async () => {
  const h = await harness();
  const victim = await seedAccount(h.env, { email: "ana@example.test" });
  const linked = await h.call("POST", "/v1/me/link/microsoft", { cookie: victim.token, body: await h.msProof(ATTACKER) });
  assert.equal(linked.status, 200);
  assert.equal(h.idp.fake.emails.length, 1);
  const mail = h.idp.fake.emails[0].body;
  assert.deepEqual(mail.to, ["ana@example.test"]);
  assert.match(mail.subject, /método de inicio de sesión/);
  assert.match(mail.text, /Microsoft/);
  assert.ok(!/https?:\/\//.test(mail.text + mail.html), "the notice carries no link");
  assert.ok(!mail.text.includes("attacker@outlook.test"), "the notice does not echo the new method's address");
  const methods = linked.body.account.identities.map((i) => i.provider).sort();
  assert.deepEqual(methods, ["email", "microsoft"]);
  const ms = linked.body.account.identities.find((i) => i.provider === "microsoft");
  assert.ok(!ms.subject.includes(ATTACKER.oid), "subjects are masked");
  assert.equal(ms.createdAt, NOW);
  const again = await h.call("POST", "/v1/me/link/microsoft", { cookie: victim.token, body: await h.msProof(ATTACKER) });
  assert.equal(again.status, 200);
  assert.equal(h.idp.fake.emails.length, 1, "re-linking the same identity sends nothing new");
});

test("a failed notice never fails the link, and an account with no proven address gets none", async () => {
  const h = await harness();
  h.idp.fake.setEmailStatus(500);
  const victim = await seedAccount(h.env, { email: "ana@example.test" });
  assert.equal((await h.call("POST", "/v1/me/link/microsoft", { cookie: victim.token, body: await h.msProof(ATTACKER) })).status, 200);
  assert.equal(h.idp.fake.emails.length, 1, "the notice was attempted (and refused by the provider)");
  h.idp.fake.setEmailThrows(true);
  const other = await seedAccount(h.env, { email: "luis@example.test" });
  assert.equal((await h.call("POST", "/v1/me/link/microsoft", { cookie: other.token, body: await h.msProof({ oid: "99999999-0000-0000-0000-000000000002" }) })).status, 200, "a transport error neither");
  h.idp.fake.setEmailThrows(false);
  h.idp.fake.setEmailStatus(200);
  h.idp.fake.emails.length = 0;
  const msOnly = await seedAccount(h.env, { email: "shown@contoso.test", verified: false, method: "microsoft" });
  const n = freshNonce();
  const google = { idToken: await h.idp.google.sign(googleClaims({ sub: "g-2", email: "b@gmail.com", nonce: n.nonce })), noncePreimage: n.preimage };
  assert.equal((await h.call("POST", "/v1/me/link/google", { cookie: msOnly.token, body: google })).status, 200);
  assert.equal(h.idp.fake.emails.length, 0, "no proven address, no notice (the display address proves nothing)");
});

test("the owner removes a method someone else linked: its sessions end and it no longer signs into the account", async () => {
  const h = await harness();
  const victim = await seedAccount(h.env, { email: "ana@example.test" });
  await h.call("POST", "/v1/me/link/microsoft", { cookie: victim.token, body: await h.msProof(ATTACKER) });
  const intruder = await h.call("POST", "/v1/auth/microsoft", { body: { ...(await h.msProof(ATTACKER)), ...TERMS }, now: NOW + 60 });
  assert.deepEqual([intruder.status, intruder.body.account.id], [200, victim.account.id]);
  const removed = await h.call("DELETE", "/v1/me/identities/microsoft", { cookie: victim.token, now: NOW + 120 });
  assert.equal(removed.status, 200);
  assert.deepEqual(removed.body.account.identities.map((i) => i.provider), ["email"]);
  assert.equal((await h.call("GET", "/v1/me", { cookie: intruder.token, now: NOW + 130 })).status, 401, "the intruder's session ended");
  assert.equal((await h.call("GET", "/v1/me", { cookie: victim.token, now: NOW + 130 })).status, 200, "the owner's own session stays");
  const back = await h.call("POST", "/v1/auth/microsoft", { body: { ...(await h.msProof(ATTACKER)), ...TERMS }, now: NOW + 200 });
  assert.notEqual(back.body.account && back.body.account.id, victim.account.id, "the removed identity no longer leads into the account");
  const audit = await h.env.DB.prepare("SELECT action, detail FROM audit_log WHERE action = 'identity.unlink'").first();
  assert.deepEqual(JSON.parse(audit.detail), { provider: "microsoft", sessionsRevoked: 1 });
  assert.equal(h.idp.fake.emails.length, 2, "linking and removing are both notified");
});

test("removal needs recent authentication, a known provider, and never removes the last way in", async () => {
  const h = await harness();
  const stale = await seedAccount(h.env, { email: "old@example.test", sessionAt: NOW - 601 });
  assert.deepEqual((await h.call("DELETE", "/v1/me/identities/microsoft", { cookie: stale.token })).body.reason, "reauth_required");
  const ana = await seedAccount(h.env, { email: "ana@example.test" });
  assert.deepEqual(
    [(await h.call("DELETE", "/v1/me/identities/email", { cookie: ana.token })).status, (await h.call("DELETE", "/v1/me/identities/email", { cookie: ana.token })).body.reason],
    [400, "bad_provider"]
  );
  assert.equal((await h.call("DELETE", "/v1/me/identities/google", { cookie: ana.token })).status, 404);
  const msOnly = await seedAccount(h.env, { email: "shown@contoso.test", verified: false, method: "microsoft" });
  const last = await h.call("DELETE", "/v1/me/identities/microsoft", { cookie: msOnly.token });
  assert.deepEqual([last.status, last.body.reason], [409, "last_sign_in_method"]);
  assert.equal(await count(h.env, "FROM identities WHERE account_id = ?1", msOnly.account.id), 1);
  // After an admin rectification: the old address's email identity no longer leads here
  // (an email-code sign-in finds accounts by their CURRENT proven address).
  const rectified = await seedAccount(h.env, { email: "old@example.test", identities: [["email", "old@example.test"], ["google", "g-9", "x@gmail.com"]], method: "google" });
  await h.env.DB.prepare("UPDATE accounts SET email = 'new@example.test', email_normalized = 'new@example.test', email_verified = 0 WHERE id = ?1").bind(rectified.account.id).run();
  const onlyGoogle = await h.call("DELETE", "/v1/me/identities/google", { cookie: rectified.token });
  assert.deepEqual([onlyGoogle.status, onlyGoogle.body.reason], [409, "last_sign_in_method"], "an email identity counts only for the account's proven address");
});

test("removing the method the current session came from signs this browser out", async () => {
  const h = await harness();
  const ana = await seedAccount(h.env, { email: "ana@example.test", identities: [["email", "ana@example.test"], ["google", "g-ana", "ana@gmail.com"]], method: "google" });
  const res = await h.call("DELETE", "/v1/me/identities/google", { cookie: ana.token });
  assert.deepEqual([res.status, res.body.signedOut], [200, true]);
  assert.match(res.setCookie, /Max-Age=0/);
  assert.equal((await h.call("GET", "/v1/me", { cookie: ana.token })).status, 401);
});

test("removing a method touches only the caller's identity and sessions: a bystander on the same provider keeps both", async () => {
  const h = await harness();
  const ana = await seedAccount(h.env, { email: "ana@example.test", identities: [["email", "ana@example.test"], ["google", "g-ana", "ana@gmail.com"]] });
  const anaGoogle = await h.call("POST", "/v1/auth/google", {
    body: await (async () => {
      const n = freshNonce();
      return { idToken: await h.idp.google.sign(googleClaims({ sub: "g-ana", email: "ana@gmail.com", nonce: n.nonce })), noncePreimage: n.preimage, ...TERMS };
    })()
  });
  assert.deepEqual([anaGoogle.status, anaGoogle.body.account.id], [200, ana.account.id]);
  const luis = await seedAccount(h.env, { email: "luis@example.test", identities: [["email", "luis@example.test"], ["google", "g-luis", "luis@gmail.com"]], method: "google" });
  const removed = await h.call("DELETE", "/v1/me/identities/google", { cookie: ana.token, now: NOW + 60 });
  assert.equal(removed.status, 200);
  assert.equal(await count(h.env, "FROM identities WHERE account_id = ?1 AND provider = 'google'", ana.account.id), 0);
  assert.equal((await h.call("GET", "/v1/me", { cookie: anaGoogle.token, now: NOW + 70 })).status, 401, "the caller's own google session ended");
  assert.equal(await count(h.env, "FROM identities WHERE account_id = ?1 AND provider = 'google' AND subject = 'g-luis'", luis.account.id), 1, "the bystander's identity stays");
  assert.equal(await count(h.env, "FROM sessions WHERE account_id = ?1 AND revoked_at IS NOT NULL", luis.account.id), 0, "the bystander's session is not revoked");
  const me = await h.call("GET", "/v1/me", { cookie: luis.token, now: NOW + 70 });
  assert.deepEqual([me.status, me.body.account.id], [200, luis.account.id], "the bystander's google session still resolves");
});
