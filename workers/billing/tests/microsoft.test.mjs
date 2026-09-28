/**
 * Microsoft sign-in (DESIGN-v3): v2 ID token checks (microsoft.mjs) and, over
 * HTTP, POST /v1/auth/microsoft with NO email-based linking, plus
 * POST /v1/me/link/microsoft.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";

import { createAccount } from "../src/accounts.mjs";
import { clearJwksCache } from "../src/jwt.mjs";
import { verifyMicrosoftIdToken } from "../src/microsoft.mjs";
import { migrate, resetSchemaMemo } from "../src/schema.mjs";
import { createSession } from "../src/sessions.mjs";
import {
  MICROSOFT_JWKS,
  NOW,
  TENANT,
  TERMS_VERSION,
  api,
  b64url,
  createEnv,
  createIdentityProviders,
  googleClaims,
  makeSigner,
  microsoftClaims
} from "./fixtures.mjs";

const NONCE = "n-0S6_WzA2Mj-abcdef";
const OID = "00000000-0000-0000-66f3-3332eca7ea81";
const TERMS = { ageConfirmed: true, termsVersion: TERMS_VERSION };

/**
 * Env, providers and helpers.
 * @param {Object} [overrides] Env overrides.
 * @returns {Promise<Object>} Harness.
 */
async function harness(overrides) {
  resetSchemaMemo();
  clearJwksCache();
  const env = createEnv(overrides);
  const idp = await createIdentityProviders();
  await migrate(env.DB);
  const token = (patch, header) => idp.microsoft.sign(microsoftClaims(patch), header);
  const verify = async (patch, nonce = NONCE, opts = {}) =>
    verifyMicrosoftIdToken(opts.raw || (await token(patch, opts.header)), nonce, opts.env || env, {
      fetchImpl: idp.fake.fetchImpl,
      now: opts.now || NOW
    });
  const call = (method, path, opts = {}) => api(env, method, path, { fetchImpl: idp.fake.fetchImpl, ...opts });
  const signIn = async (patch, opts = {}) => {
    const { body: extra, ...rest } = opts;
    return call("POST", "/v1/auth/microsoft", { body: { idToken: await token(patch), nonce: NONCE, ...TERMS, ...(extra || {}) }, ...rest });
  };
  const ctx = { env, db: env.DB, now: NOW };
  return { env, idp, token, verify, call, signIn, ctx };
}

test("a valid Microsoft token yields subject <tid>:<oid> and a display email", async () => {
  const h = await harness();
  const result = await h.verify();
  assert.equal(result.ok, true);
  assert.deepEqual(result.identity, { subject: `${TENANT}:${OID}`, email: "ana@contoso.test", name: "Ana" });
});

test("expired, not-yet-valid and future-issued tokens are refused", async () => {
  const h = await harness();
  assert.deepEqual(await h.verify({ exp: NOW - 301 }), { ok: false, reason: "expired" });
  assert.deepEqual(await h.verify({ nbf: NOW + 301 }), { ok: false, reason: "not_yet_valid" });
  assert.deepEqual(await h.verify({ iat: NOW + 301 }), { ok: false, reason: "issued_in_future" });
});

test("the audience must be PyArcana's Microsoft client id", async () => {
  const h = await harness();
  assert.deepEqual(await h.verify({ aud: "99999999-2222-3333-4444-555555555555" }), { ok: false, reason: "bad_audience" });
});

test("the issuer must be login.microsoftonline.com/<the token's own tid>/v2.0", async () => {
  const h = await harness();
  assert.deepEqual(await h.verify({ iss: `https://sts.windows.net/${TENANT}/` }), { ok: false, reason: "bad_issuer" });
  const otherTenant = "9188040d-6c67-4c5b-b112-36a304b66dad";
  assert.deepEqual(await h.verify({ iss: `https://login.microsoftonline.com/${otherTenant}/v2.0` }), { ok: false, reason: "bad_issuer" });
  assert.deepEqual(await h.verify({ iss: "https://login.microsoftonline.com/common/v2.0", tid: "common" }), { ok: false, reason: "bad_tenant" });
  assert.deepEqual(await h.verify({ tid: undefined }), { ok: false, reason: "bad_tenant" });
});

test("without a key issuer template, the token's own tid alone still binds the issuer", async () => {
  const h = await harness();
  const bare = await makeSigner("m-bare");
  h.idp.fake.jwks[MICROSOFT_JWKS] = { keys: [h.idp.microsoft.jwk, bare.jwk] };
  const otherTenant = "9188040d-6c67-4c5b-b112-36a304b66dad";
  const raw = await bare.sign(microsoftClaims({ iss: `https://login.microsoftonline.com/${otherTenant}/v2.0` }));
  assert.deepEqual(await h.verify({}, NONCE, { raw, now: NOW + 120 }), { ok: false, reason: "bad_issuer" });
  const good = await bare.sign(microsoftClaims());
  assert.equal((await h.verify({}, NONCE, { raw: good, now: NOW + 120 })).ok, true);
});

test("personal Microsoft accounts (the consumer tenant) are accepted", async () => {
  const h = await harness();
  const consumer = "9188040d-6c67-4c5b-b112-36a304b66dad";
  const result = await h.verify({ tid: consumer, iss: `https://login.microsoftonline.com/${consumer}/v2.0` });
  assert.equal(result.ok, true);
  assert.equal(result.identity.subject, `${consumer}:${OID}`);
});

test("the signing key's issuer template must match the token issuer", async () => {
  const h = await harness();
  const b2c = await makeSigner("m-b2c", { issuer: "https://contoso.b2clogin.com/{tenantid}/v2.0/" });
  h.idp.fake.jwks[MICROSOFT_JWKS] = { keys: [h.idp.microsoft.jwk, b2c.jwk] };
  const raw = await b2c.sign(microsoftClaims());
  assert.deepEqual(await h.verify({}, NONCE, { raw, now: NOW + 120 }), { ok: false, reason: "bad_issuer" });
});

test("the nonce must be submitted (16+ chars) and equal the token's", async () => {
  const h = await harness();
  assert.deepEqual(await h.verify({ nonce: undefined }), { ok: false, reason: "bad_nonce" });
  assert.deepEqual(await h.verify({}, "a-different-nonce-value"), { ok: false, reason: "bad_nonce" });
  assert.deepEqual(await h.verify({ nonce: "short" }, "short"), { ok: false, reason: "bad_nonce" });
  // null and "" (not undefined, which would trigger the helper's default nonce)
  assert.deepEqual(await h.verify({}, null), { ok: false, reason: "bad_nonce" });
  assert.deepEqual(await h.verify({}, ""), { ok: false, reason: "bad_nonce" });
});

test("an unknown kid triggers a refetch that finds a rotated key", async () => {
  const h = await harness();
  assert.equal((await h.verify()).ok, true);
  const rotated = await makeSigner("m-k2", { issuer: "https://login.microsoftonline.com/{tenantid}/v2.0" });
  h.idp.fake.jwks[MICROSOFT_JWKS] = { keys: [h.idp.microsoft.jwk, rotated.jwk] };
  const raw = await rotated.sign(microsoftClaims());
  assert.equal((await h.verify({}, NONCE, { raw, now: NOW + 120 })).ok, true);
  assert.equal(h.idp.fake.calls.filter((c) => c.url === MICROSOFT_JWKS).length, 2);
});

test("alg none, HS256 and a tampered payload are refused", async () => {
  const h = await harness();
  const body = b64url(JSON.stringify(microsoftClaims()));
  const none = `${b64url(JSON.stringify({ alg: "none", kid: "m-k1" }))}.${body}.`;
  assert.deepEqual(await h.verify({}, NONCE, { raw: none }), { ok: false, reason: "bad_alg" });
  const hsHeader = b64url(JSON.stringify({ alg: "HS256", kid: "m-k1" }));
  const mac = createHmac("sha256", JSON.stringify(h.idp.microsoft.jwk)).update(`${hsHeader}.${body}`).digest();
  assert.deepEqual(await h.verify({}, NONCE, { raw: `${hsHeader}.${body}.${b64url(mac)}` }), { ok: false, reason: "bad_alg" });
  const [head, , sig] = (await h.token()).split(".");
  const forged = b64url(JSON.stringify(microsoftClaims({ oid: "11111111-0000-0000-0000-000000000000" })));
  assert.deepEqual(await h.verify({}, NONCE, { raw: `${head}.${forged}.${sig}` }), { ok: false, reason: "bad_signature" });
});

test("an object id is required", async () => {
  const h = await harness();
  assert.deepEqual(await h.verify({ oid: undefined }), { ok: false, reason: "no_subject" });
  assert.deepEqual(await h.verify({ oid: "not-a-guid" }), { ok: false, reason: "no_subject" });
});

test("the display email falls back to preferred_username, else none", async () => {
  const h = await harness();
  assert.equal((await h.verify({ email: undefined, preferred_username: "Ana@Live.Test" })).identity.email, "Ana@Live.Test");
  assert.equal((await h.verify({ email: undefined, preferred_username: "+51 999 999 999" })).identity.email, null);
});

test("without a client id Microsoft is not configured", async () => {
  const h = await harness();
  assert.deepEqual(await h.verify({}, NONCE, { env: createEnv({ MICROSOFT_CLIENT_ID: "" }) }), { ok: false, reason: "microsoft_not_configured" });
});

test("first Microsoft sign-in creates an account whose email is display-only", async () => {
  const h = await harness();
  const res = await h.signIn();
  assert.equal(res.status, 200);
  assert.ok(res.token);
  assert.equal(res.body.account.email, "ana@contoso.test");
  assert.equal(res.body.account.emailVerified, false);
  assert.equal(res.body.account.signInMethod, "microsoft");
  const row = await h.env.DB.prepare("SELECT email_normalized FROM accounts WHERE id = ?1").bind(res.body.account.id).first();
  assert.equal(row.email_normalized, null);
  const identity = await h.env.DB.prepare("SELECT subject, account_id FROM identities WHERE provider = 'microsoft'").first();
  assert.deepEqual(identity, { subject: `${TENANT}:${OID}`, account_id: res.body.account.id });
  const again = await h.signIn({}, { now: NOW + 60 });
  assert.equal(again.body.account.id, res.body.account.id);
});

test("Microsoft never links by email: a collision is 409 link_requires_email_code", async () => {
  const h = await harness();
  await createAccount(h.ctx, { email: "ana@contoso.test", emailNormalized: "ana@contoso.test", emailVerified: true });
  const res = await h.signIn();
  assert.deepEqual([res.status, res.body.reason], [409, "link_requires_email_code"]);
  assert.equal(res.setCookie, null);
  assert.equal(await h.env.DB.prepare("SELECT COUNT(*) AS c FROM identities").first("c"), 0);
});

test("a Microsoft-claimed address cannot pre-hijack the real owner's Google account", async () => {
  const h = await harness();
  const attacker = await h.signIn({ email: "victim@gmail.com", preferred_username: "victim@gmail.com" });
  assert.equal(attacker.status, 200);
  const victim = await h.call("POST", "/v1/auth/google", {
    body: { idToken: await h.idp.google.sign(googleClaims({ email: "victim@gmail.com", sub: "victim-sub" })), ...TERMS }
  });
  assert.equal(victim.status, 200);
  assert.notEqual(victim.body.account.id, attacker.body.account.id);
});

test("a Microsoft session is never admin, even for a listed address", async () => {
  const h = await harness({ ADMIN_EMAILS: "ana@contoso.test" });
  const res = await h.signIn();
  assert.equal(res.body.account.isAdmin, false);
});

test("Microsoft sign-in needs the terms and the nonce", async () => {
  const h = await harness();
  const noTerms = await h.call("POST", "/v1/auth/microsoft", { body: { idToken: await h.token(), nonce: NONCE } });
  assert.deepEqual([noTerms.status, noTerms.body.reason], [400, "terms_required"]);
  const noNonce = await h.signIn({}, { body: { nonce: undefined } });
  assert.deepEqual([noNonce.status, noNonce.body.reason, noNonce.body.detail], [401, "invalid_token", "bad_nonce"]);
  const off = await (await harness({ MICROSOFT_CLIENT_ID: "" })).signIn();
  assert.deepEqual([off.status, off.body.reason], [503, "microsoft_not_configured"]);
});

test("after an email-code sign-in the user links Microsoft, then Microsoft signs into that account", async () => {
  const h = await harness();
  const owner = await createAccount(h.ctx, { email: "ana@contoso.test", emailNormalized: "ana@contoso.test", emailVerified: true });
  const { token } = await createSession(h.ctx, owner.id, "email");
  const linked = await h.call("POST", "/v1/me/link/microsoft", { cookie: token, body: { idToken: await h.token(), nonce: NONCE } });
  assert.equal(linked.status, 200);
  const res = await h.signIn({}, { now: NOW + 60 });
  assert.equal(res.status, 200);
  assert.equal(res.body.account.id, owner.id);
});
