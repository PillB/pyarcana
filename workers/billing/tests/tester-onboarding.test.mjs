/**
 * How a tester gets in while sign-up is CLOSED (no CONTROLLER_NAME: the deploy ran without the
 * holder file; redeploy.sh prints "Sign-up: OPEN" or "Sign-up: CLOSED"). Red-team round on PR #168,
 * 2026-11-20. The only way in for a non-admin is an
 * account the admin created by granting the role to an email; the tester then signs in with
 * Google under that exact address. These tests pin who can and who cannot get through:
 * - the right order (grant first, then a Gmail sign-in with the same address) works and the
 *   tester can retest;
 * - signing in before the grant is refused, and leaves nothing behind;
 * - an address that differs only by a dot is a different address (no Gmail canonicalisation);
 * - an address Google is not authoritative for (not Gmail, no Workspace domain) cannot link;
 * - Microsoft never links by email, so a Microsoft-only tester cannot get in.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { clearJwksCache } from "../src/jwt.mjs";
import { migrate, resetSchemaMemo } from "../src/schema.mjs";
import { NOW, TERMS_VERSION, api, createEnv, createIdentityProviders, freshNonce, googleClaims, microsoftClaims, seedAccount } from "./fixtures.mjs";

const TERMS = { ageConfirmed: true, termsVersion: TERMS_VERSION };

async function closedSite() {
  resetSchemaMemo();
  clearJwksCache();
  const env = createEnv({ CONTROLLER_NAME: undefined, ADMIN_EMAILS: "owner@gmail.com" });
  const idp = await createIdentityProviders();
  await migrate(env.DB);
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const call = (method, path, opts = {}) => api(env, method, path, { fetchImpl: idp.fake.fetchImpl, ...opts });
  const google = async (patch) => {
    const n = freshNonce();
    const idToken = await idp.google.sign(googleClaims({ nonce: n.nonce, ...patch }));
    return call("POST", "/v1/auth/google", { body: { idToken, noncePreimage: n.preimage, ...TERMS } });
  };
  const microsoft = async (patch) => {
    const n = freshNonce();
    const idToken = await idp.microsoft.sign(microsoftClaims({ nonce: n.nonce, ...patch }));
    return call("POST", "/v1/auth/microsoft", { body: { idToken, noncePreimage: n.preimage, ...TERMS } });
  };
  const grant = (email, role = "tester") => call("POST", "/v1/admin/roles", { cookie: admin.token, body: { email, role, days: 30 } });
  return { env, call, google, microsoft, grant, admin };
}

const accounts = async (env) => (await env.DB.prepare("SELECT COUNT(*) AS c FROM accounts").first("c"));

test("closed sign-up: grant first, then a Gmail sign-in under the same address gets in as a tester and can retest", async () => {
  const s = await closedSite();
  assert.equal((await s.grant("lucia.qa@gmail.com")).status, 201);
  const signed = await s.google({ sub: "sub-lucia", email: "lucia.qa@gmail.com", name: "Lucía" });
  assert.equal(signed.status, 200, JSON.stringify(signed.body));
  const me = await s.call("GET", "/v1/me", { cookie: signed.token });
  assert.deepEqual(me.body.account.roles, ["tester"]);
  const report = await s.call("POST", "/v1/reports", { cookie: signed.token, body: { source: "qa_harness", category: "functionality", severity: "low", title: "t", reporterAlias: "Lucía", context: {} } });
  assert.equal(report.status, 201, JSON.stringify(report.body));
  const check = await s.call("POST", `/v1/qa/reports/${report.body.id}/verifications`, { cookie: signed.token, body: { result: "fixed" } });
  assert.equal(check.status, 200);
});

test("closed sign-up: signing in BEFORE the grant is refused and stores nothing; the same person gets in after it", async () => {
  const s = await closedSite();
  const before = await accounts(s.env);
  const early = await s.google({ sub: "sub-early", email: "early.qa@gmail.com" });
  assert.deepEqual([early.status, early.body.reason], [403, "signup_closed"]);
  assert.equal(await accounts(s.env), before);
  await s.grant("early.qa@gmail.com");
  assert.equal((await s.google({ sub: "sub-early", email: "early.qa@gmail.com" })).status, 200);
});

test("closed sign-up: the grant must use the exact address Google reports (a dot makes it another address)", async () => {
  const s = await closedSite();
  await s.grant("juanperez@gmail.com");
  const r = await s.google({ sub: "sub-juan", email: "juan.perez@gmail.com" });
  assert.deepEqual([r.status, r.body.reason], [403, "signup_closed"], "Gmail ignores dots; this worker does not");
});

test("closed sign-up: a non-Gmail address without a Workspace domain, or a Microsoft sign-in, cannot reach a granted account", async () => {
  const s = await closedSite();
  await s.grant("ana@uni.example.edu");
  const g = await s.google({ sub: "sub-ana", email: "ana@uni.example.edu", hd: undefined });
  assert.deepEqual([g.status, g.body.reason], [409, "link_requires_email_code"], "Google is not authoritative for that address, and email codes are off on the site");
  await s.grant("ms.tester@outlook.com");
  const m = await s.microsoft({ email: "ms.tester@outlook.com", preferred_username: "ms.tester@outlook.com" });
  assert.deepEqual([m.status, m.body.reason], [409, "link_requires_email_code"], "Microsoft never links by email");
});
