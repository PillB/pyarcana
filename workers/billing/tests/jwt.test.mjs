/**
 * jwt.mjs: RS256-only verification against a cached JWKS, one forced refetch
 * for an unknown kid (rate-limited so random kids cannot amplify fetches),
 * and the shared time checks (exp/iat/nbf with 300 s skew).
 */

import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";

import { CLOCK_SKEW_SECONDS, checkTimes, clearJwksCache, decodeJwt, verifyRs256 } from "../src/jwt.mjs";
import { NOW, b64url, createFakeFetch, makeSigner } from "./fixtures.mjs";

const URL_A = "https://keys.example.test/a";
const URL_B = "https://keys.example.test/b";
const CLAIMS = { sub: "user-1", iat: NOW - 10, exp: NOW + 3600 };

/**
 * A signer and a fake fetch that serves its JWKS at URL_A.
 * @returns {Promise<Object>} Harness.
 */
async function setup() {
  clearJwksCache();
  const signer = await makeSigner("k1");
  const fake = createFakeFetch({ jwks: { [URL_A]: { keys: [signer.jwk] } } });
  const verify = (token, now = NOW, url = URL_A) => verifyRs256(token, { jwksUrl: url, fetchImpl: fake.fetchImpl, now });
  const fetches = (url = URL_A) => fake.calls.filter((c) => c.url === url).length;
  return { signer, fake, verify, fetches };
}

test("a well-formed RS256 token verifies and yields its claims", async () => {
  const { signer, verify } = await setup();
  const result = await verify(await signer.sign(CLAIMS));
  assert.equal(result.ok, true);
  assert.deepEqual(result.claims, CLAIMS);
  assert.equal(result.header.kid, "k1");
});

test("alg none is refused", async () => {
  const { verify } = await setup();
  const token = `${b64url(JSON.stringify({ alg: "none", kid: "k1" }))}.${b64url(JSON.stringify(CLAIMS))}.`;
  assert.deepEqual(await verify(token), { ok: false, reason: "bad_alg" });
});

test("HS256 keyed with the RSA public key (algorithm confusion) is refused", async () => {
  const { signer, verify } = await setup();
  const header = b64url(JSON.stringify({ alg: "HS256", kid: "k1", typ: "JWT" }));
  const body = b64url(JSON.stringify(CLAIMS));
  const mac = createHmac("sha256", JSON.stringify(signer.jwk)).update(`${header}.${body}`).digest();
  assert.deepEqual(await verify(`${header}.${body}.${b64url(mac)}`), { ok: false, reason: "bad_alg" });
});

test("a tampered payload or signature is refused", async () => {
  const { signer, verify } = await setup();
  const [h, , s] = (await signer.sign(CLAIMS)).split(".");
  const forged = b64url(JSON.stringify({ ...CLAIMS, sub: "admin" }));
  assert.deepEqual(await verify(`${h}.${forged}.${s}`), { ok: false, reason: "bad_signature" });
  // Tamper a middle character: the last one can carry only padding bits.
  const flipped = s.slice(0, 10) + (s[10] === "A" ? "B" : "A") + s.slice(11);
  assert.deepEqual(await verify(`${h}.${b64url(JSON.stringify(CLAIMS))}.${flipped}`), { ok: false, reason: "bad_signature" });
});

test("a token signed by a key outside the JWKS is refused", async () => {
  const { verify } = await setup();
  const stranger = await makeSigner("k1");
  assert.deepEqual(await verify(await stranger.sign(CLAIMS)), { ok: false, reason: "bad_signature" });
});

test("malformed tokens are refused before any fetch", async () => {
  const { verify, fetches } = await setup();
  for (const token of ["", "a.b", "a.b.c.d", "!!!.e30.sig", `${b64url("[1]")}.${b64url("{}")}.x`, `${b64url("{}")}.${b64url("not json")}.x`, "x".repeat(9000), null]) {
    assert.deepEqual(await verify(token), { ok: false, reason: "malformed" }, String(token).slice(0, 20));
  }
  assert.equal(fetches(), 0);
});

test("a header without kid is refused", async () => {
  const { signer, verify } = await setup();
  const token = await signer.sign(CLAIMS, { kid: undefined });
  assert.deepEqual(await verify(token), { ok: false, reason: "bad_header" });
});

test("the key set is cached for an hour, then refetched", async () => {
  const { signer, verify, fetches } = await setup();
  const token = await signer.sign(CLAIMS);
  assert.equal((await verify(token)).ok, true);
  assert.equal((await verify(token, NOW + 3599)).ok, true);
  assert.equal(fetches(), 1);
  await verify(await signer.sign({ ...CLAIMS, exp: NOW + 9000 }), NOW + 3600);
  assert.equal(fetches(), 2);
});

test("an unknown kid forces exactly one refetch, which picks up a rotated key", async () => {
  const { signer, fake, verify, fetches } = await setup();
  assert.equal((await verify(await signer.sign(CLAIMS))).ok, true);
  const rotated = await makeSigner("k2");
  fake.jwks[URL_A] = { keys: [signer.jwk, rotated.jwk] };
  const result = await verify(await rotated.sign(CLAIMS), NOW + 120);
  assert.equal(result.ok, true);
  assert.equal(fetches(), 2);
});

test("a kid still unknown after the refetch is refused, and random kids cannot force repeated fetches", async () => {
  const { signer, verify, fetches } = await setup();
  const ghost = await makeSigner("ghost");
  assert.equal((await verify(await signer.sign(CLAIMS))).ok, true);
  assert.deepEqual(await verify(await ghost.sign(CLAIMS), NOW + 120), { ok: false, reason: "unknown_key" });
  assert.equal(fetches(), 2, "one forced refetch");
  for (let i = 0; i < 5; i += 1) {
    const random = await makeSigner(`random-${i}`);
    assert.deepEqual(await verify(await random.sign(CLAIMS), NOW + 130), { ok: false, reason: "unknown_key" });
  }
  assert.equal(fetches(), 2, "no refetch within a minute of the last one");
});

test("keys not meant for RS256 signatures are ignored", async () => {
  clearJwksCache();
  const signer = await makeSigner("k1");
  const fake = createFakeFetch({ jwks: { [URL_A]: { keys: [{ ...signer.jwk, use: "enc" }] } } });
  const result = await verifyRs256(await signer.sign(CLAIMS), { jwksUrl: URL_A, fetchImpl: fake.fetchImpl, now: NOW });
  assert.deepEqual(result, { ok: false, reason: "unknown_key" });
});

test("a JWKS outage on a cold cache is jwks_unavailable; a warm cache keeps working", async () => {
  const { signer, fake, verify } = await setup();
  const failing = createFakeFetch();
  clearJwksCache();
  const cold = await verifyRs256(await signer.sign(CLAIMS), { jwksUrl: URL_A, fetchImpl: failing.fetchImpl, now: NOW });
  assert.deepEqual(cold, { ok: false, reason: "jwks_unavailable" });
  assert.equal((await verify(await signer.sign(CLAIMS))).ok, true);
  delete fake.jwks[URL_A];
  const token = await signer.sign({ ...CLAIMS, exp: NOW + 9000 });
  assert.equal((await verify(token, NOW + 4000)).ok, true, "stale keys are used while the refresh fails");
});

test("caches are per JWKS URL", async () => {
  clearJwksCache();
  const a = await makeSigner("same-kid");
  const b = await makeSigner("same-kid");
  const fake = createFakeFetch({ jwks: { [URL_A]: { keys: [a.jwk] }, [URL_B]: { keys: [b.jwk] } } });
  const opts = (url) => ({ jwksUrl: url, fetchImpl: fake.fetchImpl, now: NOW });
  assert.equal((await verifyRs256(await a.sign(CLAIMS), opts(URL_A))).ok, true);
  assert.deepEqual(await verifyRs256(await a.sign(CLAIMS), opts(URL_B)), { ok: false, reason: "bad_signature" });
  assert.equal((await verifyRs256(await b.sign(CLAIMS), opts(URL_B))).ok, true);
});

test("decodeJwt exposes header and claims without verifying", async () => {
  const signer = await makeSigner("k1");
  const decoded = decodeJwt(await signer.sign(CLAIMS));
  assert.equal(decoded.ok, true);
  assert.equal(decoded.header.alg, "RS256");
  assert.deepEqual(decoded.claims, CLAIMS);
});

test("checkTimes allows 300 s of skew and no more", () => {
  assert.equal(CLOCK_SKEW_SECONDS, 300);
  const base = { iat: NOW, exp: NOW + 60 };
  assert.equal(checkTimes(base, NOW), null);
  assert.equal(checkTimes({ ...base, exp: NOW - 299 }, NOW), null);
  assert.equal(checkTimes({ ...base, exp: NOW - 300 }, NOW), "expired");
  assert.equal(checkTimes({ ...base, iat: NOW + 300 }, NOW), null);
  assert.equal(checkTimes({ ...base, iat: NOW + 301 }, NOW), "issued_in_future");
  assert.equal(checkTimes({ ...base, nbf: NOW + 301 }, NOW), "not_yet_valid");
  assert.equal(checkTimes({ ...base, nbf: NOW + 300 }, NOW), null);
  assert.equal(checkTimes({ iat: NOW }, NOW), "missing_time");
  assert.equal(checkTimes({ exp: NOW + 60 }, NOW), "missing_time");
  assert.equal(checkTimes({ ...base, exp: "later" }, NOW), "missing_time");
  assert.equal(checkTimes({ ...base, nbf: "soon" }, NOW), "missing_time");
});
