/**
 * Google sign-in: ID token claim checks (google.mjs) and, over HTTP,
 * POST /v1/auth/google with DESIGN-v2 §4's linking rules, the admin rule, and
 * POST /v1/me/link/google.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { createAccount } from "../src/accounts.mjs";
import { verifyGoogleIdToken } from "../src/google.mjs";
import { clearJwksCache } from "../src/jwt.mjs";
import { migrate, resetSchemaMemo } from "../src/schema.mjs";
import { GOOGLE_CLIENT_ID, NOW, TERMS_VERSION, api, createEnv, createIdentityProviders, googleClaims } from "./fixtures.mjs";

const TERMS = { ageConfirmed: true, termsVersion: TERMS_VERSION };

/**
 * Env, providers and HTTP helpers.
 * @param {Object} [overrides] Env overrides.
 * @returns {Promise<Object>} Harness.
 */
async function harness(overrides) {
  resetSchemaMemo();
  clearJwksCache();
  const env = createEnv(overrides);
  const idp = await createIdentityProviders();
  await migrate(env.DB);
  const call = (method, path, opts = {}) => api(env, method, path, { fetchImpl: idp.fake.fetchImpl, ...opts });
  const token = (patch) => idp.google.sign(googleClaims(patch));
  const signIn = async (patch, opts = {}) =>
    call("POST", "/v1/auth/google", { body: { idToken: await token(patch), ...TERMS, ...(opts.body || {}) }, ...opts });
  const ctx = { env, db: env.DB, now: NOW };
  const identities = () => env.DB.prepare("SELECT provider, subject, account_id FROM identities ORDER BY provider, subject").all();
  return { env, idp, call, token, signIn, ctx, identities };
}

/**
 * Verify a token directly.
 * @param {Object} h Harness.
 * @param {Object} [patch] Claim overrides.
 * @param {Object} [env] Env.
 * @returns {Promise<Object>} Result.
 */
async function verify(h, patch, env) {
  return verifyGoogleIdToken(await h.token(patch), env || h.env, { fetchImpl: h.idp.fake.fetchImpl, now: NOW });
}

test("a valid Google token yields the identity", async () => {
  const h = await harness();
  const result = await verify(h);
  assert.equal(result.ok, true);
  assert.deepEqual(result.identity, {
    subject: "110000000000000000001",
    email: "ana.perez@gmail.com",
    emailNormalized: "ana.perez@gmail.com",
    hd: null,
    name: "Ana Pérez"
  });
});

test("both Google issuer spellings are accepted and nothing else", async () => {
  const h = await harness();
  assert.equal((await verify(h, { iss: "accounts.google.com" })).ok, true);
  assert.deepEqual(await verify(h, { iss: "https://evil.test" }), { ok: false, reason: "bad_issuer" });
});

test("the audience must be one of PyArcana's own client ids", async () => {
  const h = await harness();
  assert.deepEqual(await verify(h, { aud: "636631700114-vocalstudio.apps.googleusercontent.com" }), { ok: false, reason: "bad_audience" });
  assert.deepEqual(await verify(h, { aud: [GOOGLE_CLIENT_ID, "other"] }), { ok: false, reason: "bad_audience" });
  const env = createEnv({ GOOGLE_CLIENT_ID: `first.apps.googleusercontent.com, ${GOOGLE_CLIENT_ID}` });
  assert.equal((await verify(h, {}, env)).ok, true);
});

test("expiry and issue time are checked with 300 s of skew", async () => {
  const h = await harness();
  assert.deepEqual(await verify(h, { exp: NOW - 301 }), { ok: false, reason: "expired" });
  assert.equal((await verify(h, { exp: NOW - 200 })).ok, true);
  assert.deepEqual(await verify(h, { iat: NOW + 400 }), { ok: false, reason: "issued_in_future" });
});

test("the email must be present and verified by Google", async () => {
  const h = await harness();
  assert.deepEqual(await verify(h, { email_verified: false }), { ok: false, reason: "email_not_verified" });
  assert.deepEqual(await verify(h, { email_verified: undefined }), { ok: false, reason: "email_not_verified" });
  assert.equal((await verify(h, { email_verified: "true" })).ok, true);
  assert.deepEqual(await verify(h, { email: undefined }), { ok: false, reason: "no_email" });
  assert.deepEqual(await verify(h, { sub: undefined }), { ok: false, reason: "no_subject" });
});

test("without a client id Google is not configured", async () => {
  const h = await harness();
  assert.deepEqual(await verify(h, {}, createEnv({ GOOGLE_CLIENT_ID: "" })), { ok: false, reason: "google_not_configured" });
});

test("first Google sign-in creates the account, the identity and a google session", async () => {
  const h = await harness();
  const res = await h.signIn();
  assert.equal(res.status, 200);
  assert.ok(res.token);
  assert.equal(res.body.account.email, "ana.perez@gmail.com");
  assert.equal(res.body.account.emailVerified, true);
  assert.equal(res.body.account.displayName, "Ana Pérez");
  assert.equal(res.body.account.signInMethod, "google");
  assert.equal(res.body.account.firstSigninAt, NOW);
  assert.deepEqual((await h.identities()).results, [
    { provider: "google", subject: "110000000000000000001", account_id: res.body.account.id }
  ]);
  const again = await h.signIn({}, { now: NOW + 60 });
  assert.equal(again.body.account.id, res.body.account.id);
});

test("Google sign-in requires the terms and a valid token", async () => {
  const h = await harness();
  const noTerms = await h.call("POST", "/v1/auth/google", { body: { idToken: await h.token() } });
  assert.deepEqual([noTerms.status, noTerms.body.reason], [400, "terms_required"]);
  const bad = await h.signIn({ aud: "someone-else" });
  assert.deepEqual([bad.status, bad.body.reason, bad.body.detail], [401, "invalid_token", "bad_audience"]);
  assert.equal(bad.setCookie, null);
  const off = await (await harness({ GOOGLE_CLIENT_ID: "" })).signIn();
  assert.deepEqual([off.status, off.body.reason], [503, "google_not_configured"]);
});

test("a gmail.com address links to the existing account with no Google identity", async () => {
  const h = await harness();
  const existing = await createAccount(h.ctx, { email: "ana.perez@gmail.com", emailNormalized: "ana.perez@gmail.com", emailVerified: true });
  const res = await h.signIn();
  assert.equal(res.status, 200);
  assert.equal(res.body.account.id, existing.id);
});

test("a Workspace (hd) address links; a plain other-domain address needs an email code first", async () => {
  const h = await harness();
  const work = await createAccount(h.ctx, { email: "ana@uni.edu.pe", emailNormalized: "ana@uni.edu.pe", emailVerified: true });
  const linked = await h.signIn({ email: "ana@uni.edu.pe", hd: "uni.edu.pe", sub: "sub-work" });
  assert.equal(linked.body.account.id, work.id);
  await createAccount(h.ctx, { email: "ana@yahoo.test", emailNormalized: "ana@yahoo.test", emailVerified: true });
  const refused = await h.signIn({ email: "ana@yahoo.test", sub: "sub-yahoo" });
  assert.deepEqual([refused.status, refused.body.reason], [409, "link_requires_email_code"]);
  assert.equal(refused.setCookie, null);
  const subjects = (await h.identities()).results.map((r) => r.subject);
  assert.ok(!subjects.includes("sub-yahoo"), "no identity was attached");
});

test("an account that already has a Google identity is never re-linked by email", async () => {
  const h = await harness();
  const first = await h.signIn({ sub: "sub-original" });
  const takeover = await h.signIn({ sub: "sub-new-holder" });
  assert.deepEqual([takeover.status, takeover.body.reason], [409, "link_requires_email_code"]);
  assert.equal((await h.identities()).results.length, 1);
  assert.equal((await h.identities()).results[0].account_id, first.body.account.id);
});

test("admin over HTTP: a listed gmail with a Google session younger than 12 h (email/microsoft sessions: accounts.test)", async () => {
  const h = await harness({ ADMIN_EMAILS: "ana.perez@gmail.com" });
  const google = await h.signIn();
  assert.equal(google.body.account.isAdmin, true);
  const stale = await h.call("GET", "/v1/me", { cookie: google.token, now: NOW + 12 * 3600 + 1 });
  assert.equal(stale.status, 200);
  assert.equal(stale.body.account.isAdmin, false);
  const notListed = await (await harness({ ADMIN_EMAILS: "someone@gmail.com" })).signIn();
  assert.equal(notListed.body.account.isAdmin, false);
});

test("a disabled account cannot sign in with Google", async () => {
  const h = await harness();
  const first = await h.signIn();
  await h.env.DB.prepare("UPDATE accounts SET disabled_at = 1 WHERE id = ?1").bind(first.body.account.id).run();
  const res = await h.signIn({}, { now: NOW + 60 });
  assert.deepEqual([res.status, res.body.reason], [403, "account_disabled"]);
});

test("signing in again from the same browser replaces the old session", async () => {
  const h = await harness();
  const first = await h.signIn();
  const second = await h.signIn({}, { cookie: first.token });
  assert.notEqual(second.token, first.token);
  assert.equal((await h.call("GET", "/v1/me", { cookie: first.token })).status, 401);
  assert.equal((await h.call("GET", "/v1/me", { cookie: second.token })).status, 200);
});

test("link Google from a fresh session; then Google signs into that account", async () => {
  const h = await harness();
  const owner = await createAccount(h.ctx, { email: "ana@yahoo.test", emailNormalized: "ana@yahoo.test", emailVerified: true });
  const { createSession } = await import("../src/sessions.mjs");
  const { token } = await createSession({ ...h.ctx, now: NOW - 60 }, owner.id, "email");
  const linked = await h.call("POST", "/v1/me/link/google", { cookie: token, body: { idToken: await h.token({ email: "ana@yahoo.test", sub: "sub-y" }) } });
  assert.equal(linked.status, 200);
  assert.equal(linked.body.account.id, owner.id);
  const signIn = await h.signIn({ email: "ana@yahoo.test", sub: "sub-y" });
  assert.equal(signIn.body.account.id, owner.id);
  const audit = await h.env.DB.prepare("SELECT action, actor_account_id, detail FROM audit_log").all();
  assert.deepEqual(audit.results, [{ action: "identity.link", actor_account_id: owner.id, detail: '{"provider":"google"}' }]);
});

test("linking needs recent authentication, a free identity and no existing Google link", async () => {
  const h = await harness();
  const { createSession } = await import("../src/sessions.mjs");
  const a = await createAccount(h.ctx, { email: "a@example.test", emailNormalized: "a@example.test", emailVerified: true });
  const stale = await createSession({ ...h.ctx, now: NOW - 601 }, a.id, "email");
  const tooOld = await h.call("POST", "/v1/me/link/google", { cookie: stale.token, body: { idToken: await h.token({ sub: "s1" }) } });
  assert.deepEqual([tooOld.status, tooOld.body.reason], [401, "reauth_required"]);
  const other = await h.signIn({ sub: "taken", email: "b@gmail.com" });
  assert.equal(other.status, 200);
  const fresh = await createSession(h.ctx, a.id, "email");
  const taken = await h.call("POST", "/v1/me/link/google", { cookie: fresh.token, body: { idToken: await h.token({ sub: "taken" }) } });
  assert.deepEqual([taken.status, taken.body.reason], [409, "identity_in_use"]);
  const ok = await h.call("POST", "/v1/me/link/google", { cookie: fresh.token, body: { idToken: await h.token({ sub: "mine" }) } });
  assert.equal(ok.status, 200);
  const second = await h.call("POST", "/v1/me/link/google", { cookie: fresh.token, body: { idToken: await h.token({ sub: "another" }) } });
  assert.deepEqual([second.status, second.body.reason], [409, "provider_already_linked"]);
  const again = await h.call("POST", "/v1/me/link/google", { cookie: fresh.token, body: { idToken: await h.token({ sub: "mine" }) } });
  assert.equal(again.status, 200, "re-linking the same identity is idempotent");
  const anonymous = await h.call("POST", "/v1/me/link/google", { body: { idToken: await h.token() } });
  assert.deepEqual([anonymous.status, anonymous.body.reason], [401, "no_session"]);
});
