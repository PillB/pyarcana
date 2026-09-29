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
import {
  GOOGLE_CLIENT_ID,
  NONCE,
  NONCE_PREIMAGE,
  NOW,
  TERMS_VERSION,
  api,
  count,
  createEnv,
  createIdentityProviders,
  freshNonce,
  nonceFor,
  googleClaims
} from "./fixtures.mjs";

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
  // What the browser posts: a token minted for a fresh nonce, and that nonce's preimage.
  const proof = async (patch) => {
    const n = freshNonce();
    return { idToken: await token({ nonce: n.nonce, ...(patch || {}) }), noncePreimage: n.preimage };
  };
  const signIn = async (patch, opts = {}) => {
    const { body: extra, ...rest } = opts;
    return call("POST", "/v1/auth/google", { body: { ...(await proof(patch)), ...TERMS, ...(extra || {}) }, ...rest });
  };
  const ctx = { env, db: env.DB, now: NOW };
  const identities = () => env.DB.prepare("SELECT provider, subject, account_id FROM identities ORDER BY provider, subject").all();
  return { env, idp, call, token, proof, signIn, ctx, identities };
}

/**
 * Verify a token directly.
 * @param {Object} h Harness.
 * @param {Object} [patch] Claim overrides.
 * @param {Object} [env] Env.
 * @returns {Promise<Object>} Result.
 */
async function verify(h, patch, env) {
  return verifyGoogleIdToken(await h.token(patch), env || h.env, { fetchImpl: h.idp.fake.fetchImpl, now: NOW, nonce: NONCE });
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
    authoritative: true,
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
  const linked = await h.call("POST", "/v1/me/link/google", { cookie: token, body: await h.proof({ email: "ana@yahoo.test", sub: "sub-y" }) });
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
  const tooOld = await h.call("POST", "/v1/me/link/google", { cookie: stale.token, body: await h.proof({ sub: "s1" }) });
  assert.deepEqual([tooOld.status, tooOld.body.reason], [401, "reauth_required"]);
  const other = await h.signIn({ sub: "taken", email: "b@gmail.com" });
  assert.equal(other.status, 200);
  const fresh = await createSession(h.ctx, a.id, "email");
  const taken = await h.call("POST", "/v1/me/link/google", { cookie: fresh.token, body: await h.proof({ sub: "taken" }) });
  assert.deepEqual([taken.status, taken.body.reason], [409, "identity_in_use"]);
  const ok = await h.call("POST", "/v1/me/link/google", { cookie: fresh.token, body: await h.proof({ sub: "mine" }) });
  assert.equal(ok.status, 200);
  const second = await h.call("POST", "/v1/me/link/google", { cookie: fresh.token, body: await h.proof({ sub: "another" }) });
  assert.deepEqual([second.status, second.body.reason], [409, "provider_already_linked"]);
  const again = await h.call("POST", "/v1/me/link/google", { cookie: fresh.token, body: await h.proof({ sub: "mine" }) });
  assert.equal(again.status, 200, "re-linking the same identity is idempotent");
  const anonymous = await h.call("POST", "/v1/me/link/google", { body: await h.proof() });
  assert.deepEqual([anonymous.status, anonymous.body.reason], [401, "no_session"]);
});

test("the Google nonce claim must equal b64url(SHA-256(noncePreimage)) (DESIGN-v3 §B)", async () => {
  const h = await harness();
  assert.deepEqual(await verifyGoogleIdToken(await h.token({ nonce: undefined }), h.env, { fetchImpl: h.idp.fake.fetchImpl, now: NOW, nonce: NONCE }), {
    ok: false,
    reason: "bad_nonce"
  });
  assert.deepEqual(await verifyGoogleIdToken(await h.token(), h.env, { fetchImpl: h.idp.fake.fetchImpl, now: NOW }), { ok: false, reason: "bad_nonce" }, "no expected nonce fails closed");
  const wrongPreimage = await h.signIn({}, { body: { noncePreimage: NONCE_PREIMAGE } });
  assert.deepEqual([wrongPreimage.status, wrongPreimage.body.reason, wrongPreimage.body.detail], [401, "invalid_token", "bad_nonce"]);
  const missing = await h.signIn({}, { body: { noncePreimage: undefined } });
  assert.deepEqual([missing.status, missing.body.detail], [401, "bad_nonce"]);
  const { idToken } = await h.proof();
  const copied = await h.call("POST", "/v1/auth/google", { body: { idToken, noncePreimage: JSON.parse(Buffer.from(idToken.split(".")[1], "base64url")).nonce, ...TERMS } });
  assert.deepEqual([copied.status, copied.body.detail], [401, "bad_nonce"], "the nonce read out of the token is not its preimage");
  assert.equal(await count(h.env, "FROM sessions"), 0);
});

test("a Google ID token is single-use: a replay is 401 token_replayed and mints no session", async () => {
  const h = await harness();
  const body = { ...(await h.proof()), ...TERMS };
  const first = await h.call("POST", "/v1/auth/google", { body });
  assert.equal(first.status, 200);
  for (const at of [NOW + 1, NOW + 600]) {
    const replay = await h.call("POST", "/v1/auth/google", { body, now: at });
    assert.deepEqual([replay.status, replay.body.reason, replay.body.detail, replay.setCookie], [401, "invalid_token", "token_replayed", null]);
  }
  assert.equal(await count(h.env, "FROM sessions"), 1, "one token, one session");
  const stored = await h.env.DB.prepare("SELECT hash, expires_at FROM used_nonces").all();
  assert.equal(stored.results.length, 1);
  assert.match(stored.results[0].hash, /^[0-9a-f]{64}$/, "only an HMAC is stored, never the nonce or its preimage");
  assert.equal(stored.results[0].expires_at, NOW + 3570 + 300, "kept until the token could no longer verify");
});

test("a token spent on POST /v1/me/link/google cannot then sign in (and vice versa)", async () => {
  const h = await harness();
  const { createAccount } = await import("../src/accounts.mjs");
  const { createSession } = await import("../src/sessions.mjs");
  const owner = await createAccount(h.ctx, { email: "ana@yahoo.test", emailNormalized: "ana@yahoo.test", emailVerified: true });
  const { token } = await createSession(h.ctx, owner.id, "email");
  const proof = await h.proof({ email: "ana@yahoo.test", sub: "sub-y" });
  assert.equal((await h.call("POST", "/v1/me/link/google", { cookie: token, body: proof })).status, 200);
  const replay = await h.call("POST", "/v1/auth/google", { body: { ...proof, ...TERMS } });
  assert.deepEqual([replay.status, replay.body.detail], [401, "token_replayed"]);
});

test("a Google token claiming a lifetime over 24 h is refused", async () => {
  const h = await harness();
  const res = await h.signIn({ iat: NOW - 30, exp: NOW - 30 + 10 * 365 * 86400 });
  assert.deepEqual([res.status, res.body.detail], [401, "lifetime_too_long"]);
});

test("a preimage must carry at least 32 random bytes: a short or non-base64url one is refused even if the token echoes it", async () => {
  const h = await harness();
  for (const preimage of ["short-preimage", "x".repeat(42), `${"a".repeat(43)}.`, "a".repeat(129)]) {
    const idToken = await h.token({ nonce: preimage });
    const res = await h.call("POST", "/v1/auth/google", { body: { idToken, noncePreimage: preimage, ...TERMS } });
    assert.deepEqual([preimage.length, res.status, res.body.detail], [preimage.length, 401, "bad_nonce"]);
  }
});

test("stage 2a: a short or malformed preimage is refused even when the token carries its CORRECT hash", async () => {
  // The echo test above cannot see the length rule (sha256(preimage) never equals the preimage);
  // here the token's nonce is exactly b64url(SHA-256(preimage)), so only the preimage rule can refuse it.
  const h = await harness();
  for (const preimage of ["short-preimage", "x".repeat(42), `${"a".repeat(43)}.`, `${"a".repeat(42)}=`, "a".repeat(129)]) {
    const idToken = await h.token({ nonce: nonceFor(preimage) });
    const res = await h.call("POST", "/v1/auth/google", { body: { idToken, noncePreimage: preimage, ...TERMS } });
    assert.deepEqual([preimage.length, res.status, res.body.detail], [preimage.length, 401, "bad_nonce"]);
  }
  const ok = "b".repeat(43);
  const accepted = await h.call("POST", "/v1/auth/google", { body: { idToken: await h.token({ nonce: nonceFor(ok) }), noncePreimage: ok, ...TERMS } });
  assert.equal(accepted.status, 200, "the boundary: 43 base64url characters (32 bytes) is enough");
});

/**
 * Sign in by email code (the code is read straight from a fresh issue, as if
 * it had been intercepted or delivered).
 * @param {Object} h Harness.
 * @param {string} email Address.
 * @param {number} at Clock.
 * @returns {Promise<Object>} Response.
 */
async function emailCodeSignIn(h, email, at) {
  const { issueLoginCode } = await import("../src/logincodes.mjs");
  const { pepperBytes } = await import("../src/crypto.mjs");
  const { code } = await issueLoginCode({ env: h.env, db: h.env.DB, pepper: pepperBytes(h.env), now: at }, email);
  return h.call("POST", "/v1/auth/email/verify", { body: { email, code, ...TERMS }, now: at });
}

test("review F7: one emailed admin code + the attacker's own Google account is NOT admin, and the owner keeps the admin path", async () => {
  const h = await harness({ ADMIN_EMAILS: "owner@gmail.com" });
  const owner = await emailCodeSignIn(h, "owner@gmail.com", NOW);
  assert.equal(owner.body.account.isAdmin, false, "an email-code session is never admin");
  const t1 = NOW + 3600;
  const attacker = await emailCodeSignIn(h, "owner@gmail.com", t1);
  const mallory = { sub: "sub-attacker", email: "mallory@gmail.com", iat: t1 - 30, exp: t1 + 3000 };
  const link = await h.call("POST", "/v1/me/link/google", { cookie: attacker.token, body: await h.proof(mallory), now: t1 + 60 });
  assert.deepEqual([link.status, link.body.reason], [409, "admin_identity_mismatch"], "a listed admin address only links its own Google address");
  const t2 = t1 + 120;
  const asMallory = await h.signIn({ ...mallory, iat: t2 - 30, exp: t2 + 3000 }, { now: t2 });
  assert.notEqual(asMallory.body.account && asMallory.body.account.id, owner.body.account.id, "mallory's Google does not land in the owner's account");
  const t3 = t2 + 600;
  const real = await h.signIn({ sub: "sub-owner", email: "owner@gmail.com", iat: t3 - 30, exp: t3 + 3000 }, { now: t3 });
  assert.deepEqual([real.status, real.body.account.id, real.body.account.isAdmin], [200, owner.body.account.id, true], "the real owner is not locked out");
});

test("review F7: even if another Google identity sits on the admin account, its sessions are not admin", async () => {
  const h = await harness({ ADMIN_EMAILS: "owner@gmail.com" });
  const owner = await emailCodeSignIn(h, "owner@gmail.com", NOW);
  const { linkIdentity } = await import("../src/accounts.mjs");
  // Planted directly (the link route refuses it): the rule itself must not trust it.
  await linkIdentity(h.ctx, { provider: "google", subject: "sub-attacker", accountId: owner.body.account.id, emailAtLink: "mallory@gmail.com", emailAuthoritative: true });
  const asMallory = await h.signIn({ sub: "sub-attacker", email: "mallory@gmail.com" }, { now: NOW + 60 });
  assert.deepEqual([asMallory.status, asMallory.body.account.id, asMallory.body.account.isAdmin], [200, owner.body.account.id, false]);
  const grant = await h.call("POST", "/v1/admin/grants", { cookie: asMallory.token, body: { email: "mallory@gmail.com", days: null, kind: "gift", requestId: "req-00000001" }, now: NOW + 65 });
  assert.deepEqual([grant.status, grant.body.reason], [401, "reauth_required"]);
  const role = await h.call("POST", "/v1/admin/roles", { cookie: asMallory.token, body: { email: "mallory@gmail.com", role: "tester", days: null }, now: NOW + 66 });
  assert.equal(role.status, 401);
  assert.equal(await count(h.env, "FROM grants"), 0);
  assert.equal(await count(h.env, "FROM account_roles"), 0);
});

test("review F4: a Google address Google is not authoritative for is display-only; the mailbox's later owner gets their own account", async () => {
  const h = await harness({ ADMIN_EMAILS: "j.doe@corp.test" });
  const stale = await h.signIn({ sub: "sub-old-holder", email: "j.doe@corp.test" });
  assert.deepEqual([stale.status, stale.body.account.email, stale.body.account.emailVerified, stale.body.account.isAdmin], [200, "j.doe@corp.test", false, false]);
  const row = await h.env.DB.prepare("SELECT email_normalized, email_verified FROM accounts WHERE id = ?1").bind(stale.body.account.id).first();
  assert.deepEqual(row, { email_normalized: null, email_verified: 0 });
  const admin = await h.call("GET", "/v1/admin/grants", { cookie: stale.token });
  assert.deepEqual([admin.status, admin.body.reason], [403, "forbidden"]);
  const newOwner = await emailCodeSignIn(h, "j.doe@corp.test", NOW + 60);
  assert.equal(newOwner.status, 200);
  assert.notEqual(newOwner.body.account.id, stale.body.account.id, "no merge into the old holder's account");
  const again = await h.signIn({ sub: "sub-old-holder", email: "j.doe@corp.test" }, { now: NOW + 120 });
  assert.equal(again.body.account.id, stale.body.account.id, "the old holder keeps only their own account");
  const hd = await h.signIn({ sub: "sub-ws", email: "ana@uni.edu.pe", hd: "uni.edu.pe" }, { now: NOW + 180 });
  assert.equal(hd.body.account.emailVerified, true, "Workspace (hd) addresses stay proven");
});

test("signing in with a non-authoritative Google identity never marks the account's address as proven", async () => {
  const h = await harness();
  const first = await h.signIn({ sub: "sub-corp", email: "j.doe@corp.test" });
  // An admin rectification later types that same address in (stored unproven).
  await h.env.DB.prepare("UPDATE accounts SET email_normalized = 'j.doe@corp.test', email_verified = 0 WHERE id = ?1").bind(first.body.account.id).run();
  const again = await h.signIn({ sub: "sub-corp", email: "j.doe@corp.test" }, { now: NOW + 60 });
  assert.deepEqual([again.status, again.body.account.id, again.body.account.emailVerified], [200, first.body.account.id, false]);
});

test("review: 30 Google sign-in or link attempts per network per hour; the 31st is 429; other networks and providers are unaffected", async () => {
  const h = await harness();
  const from = (ip) => ({ headers: { "cf-connecting-ip": ip } });
  for (let i = 0; i < 30; i += 1) {
    const res = await h.signIn({ aud: "someone-else" }, from("203.0.113.50"));
    assert.deepEqual([i, res.status, res.body.detail], [i, 401, "bad_audience"]);
  }
  const limited = await h.signIn({}, from("203.0.113.50"));
  assert.deepEqual([limited.status, limited.body.reason], [429, "rate_limited"]);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  const link = await h.call("POST", "/v1/me/link/google", { body: await h.proof(), ...from("203.0.113.50") });
  assert.equal(link.status, 401, "no session: refused before the limiter");
  assert.equal((await h.signIn({ sub: "other-net" }, from("198.51.100.60"))).status, 200, "another network");
  const ms = await h.call("POST", "/v1/auth/microsoft", { body: { idToken: "x.y.z", noncePreimage: "a".repeat(43), ...TERMS }, ...from("203.0.113.50") });
  assert.deepEqual([ms.status, ms.body.reason], [401, "invalid_token"], "Microsoft has its own bucket");
});

test("review: a Google subject longer than 255 characters is refused", async () => {
  const h = await harness();
  assert.deepEqual(await verify(h, { sub: "1".repeat(256) }), { ok: false, reason: "no_subject" });
  assert.equal((await verify(h, { sub: "1".repeat(255) })).ok, true);
});
