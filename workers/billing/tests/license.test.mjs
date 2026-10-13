/**
 * The ES256 licence token (DESIGN-v3-delta "Licence token REINSTATED",
 * D-ORCH-03): license.mjs, GET /v1/jwks, `licenseToken` in the me payload and
 * scripts/generate-keys.mjs.
 *
 * The token is checked here with the SAME rules the browser applies offline
 * (src/lib/cloud/licence.ts: alg ES256, typ PAL, kid in the pinned list, iss,
 * aud, plan, sub, exp/iat within 300 s, lifetime <= 72 h), re-implemented in
 * plain JS below because the worker suites run on plain Node, not tsx.
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";

import { APP_ORIGIN, NOW, api, createHarness, seedAccount, sql } from "./fixtures.mjs";

const DAY = 86400;
const TTL = 72 * 3600;

/**
 * A fresh P-256 key pair as the worker's secret and its public JWK.
 * @returns {Promise<{pkcs8: string, jwk: Object}>} Material.
 */
async function makeKey() {
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const pkcs8 = Buffer.from(await webcrypto.subtle.exportKey("pkcs8", pair.privateKey)).toString("base64");
  const pub = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  return { pkcs8, jwk: { kty: "EC", crv: "P-256", x: pub.x, y: pub.y } };
}

const KEY = await makeKey();

/**
 * Decode one base64url JSON part.
 * @param {string} part Part.
 * @returns {Object} Value.
 */
function part(part) {
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

/**
 * The browser's offline check (licence.ts), in JS. Returns the claims or a reason.
 * @param {string} token Token.
 * @param {{keys: Object[], audience: string, now: number, sub?: string}} o Options.
 * @returns {Promise<{ok: boolean, reason?: string, claims?: Object, header?: Object}>} Result.
 */
async function browserVerify(token, o) {
  const [h, p, s] = token.split(".");
  const header = part(h);
  const claims = part(p);
  const signature = Buffer.from(s, "base64url");
  if (header.alg !== "ES256") return { ok: false, reason: "bad_alg" };
  if (header.typ !== "PAL") return { ok: false, reason: "bad_typ" };
  const key = o.keys.find((k) => k.kid === header.kid && !("d" in k));
  if (!key) return { ok: false, reason: "unknown_kid" };
  if (signature.length !== 64) return { ok: false, reason: "malformed" };
  const cryptoKey = await webcrypto.subtle.importKey("jwk", { kty: "EC", crv: "P-256", x: key.x, y: key.y }, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const valid = await webcrypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, cryptoKey, signature, Buffer.from(`${h}.${p}`));
  if (!valid) return { ok: false, reason: "bad_signature" };
  const rules = [
    ["bad_claims", typeof claims.iat === "number" && typeof claims.exp === "number" && typeof claims.indefinite === "boolean" && typeof claims.source === "string"],
    ["bad_iss", claims.iss === "pyarcana-billing"],
    ["bad_aud", claims.aud === o.audience],
    ["bad_plan", claims.plan === "pro"],
    ["bad_sub", typeof claims.sub === "string" && claims.sub !== "" && (!o.sub || claims.sub === o.sub)],
    ["expired", o.now < claims.exp + 300],
    ["not_yet_valid", claims.iat <= o.now + 300],
    ["too_long", claims.exp - claims.iat <= TTL]
  ];
  const failed = rules.find(([, ok]) => !ok);
  return failed ? { ok: false, reason: failed[0] } : { ok: true, claims, header };
}

/**
 * A signed-in account with an active grant (or none).
 * @param {Object} env Env.
 * @param {{kind?: string, days?: number|null}|null} grant Grant, or null for a free account.
 * @returns {Promise<Object>} Seeded account.
 */
async function learner(env, grant) {
  const me = await seedAccount(env, { email: "ana@example.test" });
  if (grant) {
    await sql(env, "INSERT INTO grants (id, account_id, kind, days, created_at) VALUES ('grant_x', ?1, ?2, ?3, ?4)", me.account.id, grant.kind || "gift", grant.days === undefined ? 30 : grant.days, NOW);
  }
  return me;
}

/**
 * Env overrides that configure the licence key.
 * @param {Object} [extra] More overrides.
 * @returns {Object} Overrides.
 */
function keyed(extra) {
  return { LICENSE_PRIVATE_KEY_PKCS8_B64: KEY.pkcs8, LICENSE_KEY_ID: "k2026", ...(extra || {}) };
}

test("resolveTtlSeconds: 72 h by default, clamped to [60 s, 72 h], junk falls back", async () => {
  const { resolveTtlSeconds } = await import("../src/license.mjs");
  assert.equal(resolveTtlSeconds({}), TTL);
  assert.equal(resolveTtlSeconds({ LICENSE_TTL_SECONDS: "3600" }), 3600);
  assert.equal(resolveTtlSeconds({ LICENSE_TTL_SECONDS: "999999" }), TTL, "the browser refuses anything longer than 72 h");
  assert.equal(resolveTtlSeconds({ LICENSE_TTL_SECONDS: "5" }), 60);
  assert.equal(resolveTtlSeconds({ LICENSE_TTL_SECONDS: "abc" }), TTL);
});

test("licenceClaims: exp = min(now + TTL, accessEnd); indefinite runs on the TTL; free or no audience -> null", async () => {
  const { licenceClaims } = await import("../src/license.mjs");
  const env = { CANONICAL_ORIGIN: APP_ORIGIN };
  const far = licenceClaims(env, NOW, "acct_a", { isPro: true, source: "gift", accessEnd: NOW + 30 * DAY, indefinite: false });
  assert.deepEqual(far, { iss: "pyarcana-billing", sub: "acct_a", aud: APP_ORIGIN, plan: "pro", source: "gift", iat: NOW, exp: NOW + TTL, indefinite: false });
  const soon = licenceClaims(env, NOW, "acct_a", { isPro: true, source: "trial", accessEnd: NOW + 3600, indefinite: false });
  assert.equal(soon.exp, NOW + 3600, "never outlives the access it stands for");
  const open = licenceClaims(env, NOW, "acct_a", { isPro: true, source: "tester", accessEnd: null, indefinite: true });
  assert.deepEqual([open.exp, open.indefinite], [NOW + TTL, true]);
  assert.equal(licenceClaims(env, NOW, "acct_a", { isPro: false, source: null, accessEnd: null, indefinite: false }), null);
  assert.equal(licenceClaims({}, NOW, "acct_a", { isPro: true, source: "gift", accessEnd: null, indefinite: true }), null, "no CANONICAL_ORIGIN: no audience, no token");
  assert.equal(licenceClaims(env, NOW, "acct_a", { isPro: true, source: "gift", accessEnd: NOW, indefinite: false }), null, "an access ending now yields nothing");
});

test("a Pro learner's me payload carries a token the browser's offline check accepts", async () => {
  const { env } = await createHarness(keyed());
  const me = await learner(env, { kind: "gift", days: 30 });
  const res = await api(env, "GET", "/v1/me", { cookie: me.token });
  assert.equal(res.status, 200);
  assert.equal(res.body.access.isPro, true);
  const jwks = await api(env, "GET", "/v1/jwks");
  const verdict = await browserVerify(res.body.licenseToken, { keys: jwks.body.keys, audience: APP_ORIGIN, now: NOW, sub: me.account.id });
  assert.equal(verdict.ok, true, verdict.reason);
  assert.deepEqual(verdict.header, { alg: "ES256", typ: "PAL", kid: "k2026" });
  assert.deepEqual(verdict.claims, { iss: "pyarcana-billing", sub: me.account.id, aud: APP_ORIGIN, plan: "pro", source: "gift", iat: NOW, exp: NOW + TTL, indefinite: false });
  const other = await browserVerify(res.body.licenseToken, { keys: jwks.body.keys, audience: "https://pillb.github.io", now: NOW });
  assert.equal(other.reason, "bad_aud", "a token for pyarcana.dev is not valid for another origin");
  const late = await browserVerify(res.body.licenseToken, { keys: jwks.body.keys, audience: APP_ORIGIN, now: NOW + TTL + 301 });
  assert.equal(late.reason, "expired");
});

test("a free learner, a revoked grant, or a missing key: licenseToken is null and /v1/me still answers", async () => {
  const free = await createHarness(keyed());
  const f = await learner(free.env, null);
  const a = await api(free.env, "GET", "/v1/me", { cookie: f.token });
  assert.deepEqual([a.status, a.body.access.isPro, a.body.licenseToken], [200, false, null]);

  const revoked = await createHarness(keyed());
  const r = await learner(revoked.env, { kind: "gift", days: 30 });
  assert.equal(typeof (await api(revoked.env, "GET", "/v1/me", { cookie: r.token })).body.licenseToken, "string");
  await sql(revoked.env, "UPDATE grants SET revoked_at = ?1 WHERE id = 'grant_x'", NOW);
  const after = await api(revoked.env, "GET", "/v1/me", { cookie: r.token });
  assert.deepEqual([after.body.access.isPro, after.body.licenseToken], [false, null], "revocation takes effect on the next me");

  const logs = [];
  const unkeyed = await createHarness();
  const u = await learner(unkeyed.env, { kind: "gift", days: 30 });
  const b = await api(unkeyed.env, "GET", "/v1/me", { cookie: u.token, log: (line) => logs.push(line) });
  assert.deepEqual([b.status, b.body.access.isPro, b.body.licenseToken], [200, true, null], "fail closed: no key, no offline Pro");
});

test("a corrupt signing key never breaks /v1/me and never reaches the log", async () => {
  const secret = "bm90LWEta2V5LWF0LWFsbC1zZWNyZXQtbWF0ZXJpYWw=";
  const { env } = await createHarness(keyed({ LICENSE_PRIVATE_KEY_PKCS8_B64: secret }));
  const me = await learner(env, { kind: "gift", days: 30 });
  const logs = [];
  const res = await api(env, "GET", "/v1/me", { cookie: me.token, log: (line) => logs.push(line) });
  assert.deepEqual([res.status, res.body.licenseToken], [200, null]);
  assert.ok(logs.some((line) => /licen[cs]e/.test(line)), "the failure is logged");
  assert.ok(!logs.join("\n").includes(secret), "the key material is never logged");
  const jwks = await api(env, "GET", "/v1/jwks");
  assert.deepEqual([jwks.status, jwks.body.reason], [503, "license_not_configured"]);
});

test("an indefinite grant's token runs on the TTL and says indefinite; a trial ending sooner caps exp", async () => {
  const { env } = await createHarness(keyed());
  const me = await learner(env, { kind: "tester", days: null });
  const token = (await api(env, "GET", "/v1/me", { cookie: me.token })).body.licenseToken;
  const claims = part(token.split(".")[1]);
  assert.deepEqual([claims.source, claims.exp, claims.indefinite], ["tester", NOW + TTL, true]);

  const t = await createHarness(keyed());
  const trial = await seedAccount(t.env, { email: "eva@example.test" });
  await sql(t.env, "INSERT INTO grants (id, account_id, kind, days, created_at) VALUES ('grant_t', ?1, 'trial', 7, ?2)", trial.account.id, NOW - 6.5 * DAY);
  await sql(t.env, "UPDATE accounts SET first_signin_at = ?2 WHERE id = ?1", trial.account.id, NOW - 6.5 * DAY);
  const body = (await api(t.env, "GET", "/v1/me", { cookie: trial.token })).body;
  const c = part(body.licenseToken.split(".")[1]);
  assert.equal(c.exp, body.access.accessEnd, "exp is the access end when it comes first");
  assert.ok(c.exp < NOW + TTL);
});

test("GET /v1/jwks publishes the current key and a valid previous key, never private material", async () => {
  const prev = await makeKey();
  const prevJwk = JSON.stringify({ ...prev.jwk, kid: "k2025", alg: "ES256", use: "sig" });
  const { env } = await createHarness(keyed({ LICENSE_PREV_PUBLIC_JWK: prevJwk }));
  const res = await api(env, "GET", "/v1/jwks");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.keys.map((k) => k.kid), ["k2026", "k2025"]);
  const [current] = res.body.keys;
  assert.deepEqual(Object.keys(current).sort(), ["alg", "crv", "key_ops", "kid", "kty", "use", "x", "y"]);
  assert.deepEqual([current.kty, current.crv, current.alg, current.use, current.x, current.y], ["EC", "P-256", "ES256", "sig", KEY.jwk.x, KEY.jwk.y]);

  for (const bad of [
    JSON.stringify({ ...prev.jwk, kid: "k2025", d: "c2VjcmV0" }),
    JSON.stringify({ ...prev.jwk, kid: "k2026" }),
    JSON.stringify({ ...prev.jwk }),
    JSON.stringify({ kty: "RSA", n: "x", e: "AQAB", kid: "r1" }),
    "{not json"
  ]) {
    const h = await createHarness(keyed({ LICENSE_PREV_PUBLIC_JWK: bad }));
    const r = await api(h.env, "GET", "/v1/jwks");
    assert.deepEqual(r.body.keys.map((k) => k.kid), ["k2026"], `refused previous key: ${bad.slice(0, 40)}`);
    assert.ok(!JSON.stringify(r.body).includes("c2VjcmV0"));
  }
  const none = await createHarness();
  const n = await api(none.env, "GET", "/v1/jwks");
  assert.deepEqual([n.status, n.body.reason], [503, "license_not_configured"]);
});

test("the key is imported once per isolate, and signing happens at most once per me request", async () => {
  const { clearLicenceKeyCache } = await import("../src/license.mjs");
  clearLicenceKeyCache();
  const { env } = await createHarness(keyed());
  const me = await learner(env, { kind: "gift", days: 30 });
  const subtle = globalThis.crypto.subtle;
  const calls = { importKey: 0, sign: 0 };
  const originalImport = subtle.importKey;
  const originalSign = subtle.sign;
  subtle.importKey = function (...args) {
    if (args[0] === "pkcs8") calls.importKey += 1;
    return originalImport.apply(this, args);
  };
  subtle.sign = function (...args) {
    if (args[0] && args[0].name === "ECDSA") calls.sign += 1;
    return originalSign.apply(this, args);
  };
  try {
    await api(env, "GET", "/v1/me", { cookie: me.token });
    await api(env, "GET", "/v1/me", { cookie: me.token });
  } finally {
    subtle.importKey = originalImport;
    subtle.sign = originalSign;
  }
  assert.deepEqual(calls, { importKey: 1, sign: 2 });
});

test("scripts/generate-keys.mjs: its secret signs tokens that its printed JWK verifies", async () => {
  const script = fileURLToPath(new URL("../scripts/generate-keys.mjs", import.meta.url));
  const out = execFileSync(process.execPath, [script, "k2027"], { encoding: "utf8" });
  const pkcs8 = /^([A-Za-z0-9+/]{100,}={0,2})$/m.exec(out)[1];
  const jwk = JSON.parse(/^(\{"kty":"EC".*\})$/m.exec(out)[1]);
  assert.deepEqual([jwk.kid, jwk.alg, jwk.crv, "d" in jwk], ["k2027", "ES256", "P-256", false]);
  assert.match(out, /wrangler secret put LICENSE_PRIVATE_KEY_PKCS8_B64/);
  assert.match(out, /LICENSE_KEY_ID = "k2027"/);
  const { env } = await createHarness({ LICENSE_PRIVATE_KEY_PKCS8_B64: pkcs8, LICENSE_KEY_ID: "k2027" });
  const me = await learner(env, { kind: "gift", days: 30 });
  const token = (await api(env, "GET", "/v1/me", { cookie: me.token })).body.licenseToken;
  const verdict = await browserVerify(token, { keys: [jwk], audience: APP_ORIGIN, now: NOW });
  assert.equal(verdict.ok, true, verdict.reason);
  assert.throws(() => execFileSync(process.execPath, [script, "bad kid!"], { encoding: "utf8", stdio: "pipe" }), "a kid outside [A-Za-z0-9_.-] is refused");
});
