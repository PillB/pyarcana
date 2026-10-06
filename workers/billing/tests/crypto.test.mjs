/**
 * crypto.mjs: ids, hashes, HMAC under the pepper, constant-time compare and
 * base64url. Known-answer vectors come from the published standards so a
 * wrong-but-self-consistent implementation cannot pass.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  base64ToBytes,
  base64UrlToBytes,
  bytesToBase64Url,
  constantTimeEqual,
  hmacHex,
  pepperBytes,
  randomDigits,
  randomId,
  randomToken,
  sha256Hex
} from "../src/crypto.mjs";

test("sha256Hex matches the FIPS 180-2 'abc' vector", async () => {
  assert.equal(
    await sha256Hex("abc"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
  );
});

test("hmacHex matches RFC 4231 test case 2", async () => {
  const key = new TextEncoder().encode("Jefe");
  assert.equal(
    await hmacHex(key, "what do ya want for nothing?"),
    "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843"
  );
});

test("hmacHex gives different digests under different keys", async () => {
  const a = await hmacHex(new Uint8Array(32).fill(1), "same input");
  const b = await hmacHex(new Uint8Array(32).fill(2), "same input");
  assert.notEqual(a, b);
});

test("base64url encodes without padding using - and _", () => {
  assert.equal(bytesToBase64Url(new Uint8Array([0xfb, 0xff])), "-_8");
  assert.equal(bytesToBase64Url(new TextEncoder().encode("hello")), "aGVsbG8");
});

test("base64url round-trips every byte value", () => {
  const all = Uint8Array.from({ length: 256 }, (_, i) => i);
  assert.deepEqual(base64UrlToBytes(bytesToBase64Url(all)), all);
});

test("base64url decoding is strict about its alphabet", () => {
  assert.throws(() => base64UrlToBytes("ab+c"), /base64url/);
  assert.throws(() => base64UrlToBytes("ab/c"), /base64url/);
  assert.throws(() => base64UrlToBytes("abc="), /base64url/);
  assert.throws(() => base64UrlToBytes("a"), /base64url/);
  assert.deepEqual(base64UrlToBytes(""), new Uint8Array(0));
});

test("standard base64 decodes with padding and whitespace", () => {
  assert.deepEqual(base64ToBytes("+/8=\n"), new Uint8Array([0xfb, 0xff]));
  assert.equal(base64ToBytes("not base64 !!"), null);
});

test("randomId has the prefix and 128 bits of base64url entropy", () => {
  const seen = new Set();
  for (let i = 0; i < 500; i += 1) {
    const id = randomId("acct");
    assert.match(id, /^acct_[A-Za-z0-9_-]{22}$/);
    seen.add(id);
  }
  assert.equal(seen.size, 500);
});

test("randomToken is 32 bytes as 43 base64url characters", () => {
  const token = randomToken();
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(base64UrlToBytes(token).length, 32);
  assert.notEqual(randomToken(), token);
});

test("randomDigits yields the requested number of decimal digits and varies", () => {
  const draws = new Set();
  for (let i = 0; i < 50; i += 1) {
    const code = randomDigits(6);
    assert.match(code, /^\d{6}$/);
    draws.add(code);
  }
  assert.ok(draws.size > 40, `expected variety, got ${draws.size} distinct codes`);
});

test("constantTimeEqual compares strings exactly", () => {
  assert.equal(constantTimeEqual("abcdef", "abcdef"), true);
  assert.equal(constantTimeEqual("abcdef", "abcdeg"), false);
  assert.equal(constantTimeEqual("abcdef", "abcde"), false);
  assert.equal(constantTimeEqual("", ""), true);
  assert.equal(constantTimeEqual("a", null), false);
  assert.equal(constantTimeEqual(undefined, undefined), false);
});

test("pepperBytes accepts only 32+ decoded bytes of base64", () => {
  const good = Buffer.alloc(32, 7).toString("base64");
  assert.equal(pepperBytes({ SERVER_PEPPER: good }).length, 32);
  assert.equal(pepperBytes({ SERVER_PEPPER: Buffer.alloc(16, 7).toString("base64") }), null);
  assert.equal(pepperBytes({ SERVER_PEPPER: "" }), null);
  assert.equal(pepperBytes({}), null);
  assert.equal(pepperBytes({ SERVER_PEPPER: "correct horse battery staple!!!!!!!!!!!!!!!" }), null);
});
