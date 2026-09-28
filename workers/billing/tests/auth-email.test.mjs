/**
 * POST /v1/auth/email/start and /verify over HTTP (DESIGN-v2 §4): terms gate,
 * honest 429/503, identical treatment of known and unknown emails, per-IP,
 * per-email+IP and per-email limits, the per-email failure cap, the attempt
 * budget under a parallel attack, and the session cookie on success.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { createAccount } from "../src/accounts.mjs";
import { issueLoginCode } from "../src/logincodes.mjs";
import { migrate, resetSchemaMemo } from "../src/schema.mjs";
import { NOW, TERMS_VERSION, api, createEnv, createFakeFetch } from "./fixtures.mjs";
import { pepperBytes } from "../src/crypto.mjs";

const EMAIL = "ana@example.test";
const TERMS = { ageConfirmed: true, termsVersion: TERMS_VERSION };

/**
 * A fresh env plus fake fetch and helpers.
 * @param {Object} [overrides] Env overrides.
 * @returns {Object} Harness.
 */
function harness(overrides) {
  resetSchemaMemo();
  const env = createEnv(overrides);
  const fake = createFakeFetch();
  const logs = [];
  const call = (method, path, opts = {}) =>
    api(env, method, path, { fetchImpl: fake.fetchImpl, log: (line) => logs.push(line), ...opts });
  const start = (email = EMAIL, ip = "203.0.113.1", extra = {}) =>
    call("POST", "/v1/auth/email/start", { body: { email, ...TERMS, ...extra }, headers: { "cf-connecting-ip": ip } });
  const verify = (code, email = EMAIL, ip = "203.0.113.1", extra = {}) =>
    call("POST", "/v1/auth/email/verify", { body: { email, code, ...TERMS, ...extra }, headers: { "cf-connecting-ip": ip } });
  const lastCode = () => {
    const last = fake.emails.at(-1);
    return last ? /(\d{6})/.exec(last.body.subject)[1] : null;
  };
  const ctx = () => ({ env, db: env.DB, pepper: pepperBytes(env), now: NOW });
  const consumeAll = () => env.DB.prepare("UPDATE login_codes SET consumed_at = 1 WHERE consumed_at IS NULL").run();
  return { env, fake, logs, call, start, verify, lastCode, ctx, consumeAll };
}

test("start sends a code and answers the same for known and unknown emails", async () => {
  const h = harness();
  const unknown = await h.start("nobody@example.test");
  await migrate(h.env.DB);
  await createAccount(h.ctx(), { email: EMAIL, emailNormalized: EMAIL, emailVerified: true });
  const known = await h.start(EMAIL, "203.0.113.2");
  assert.equal(unknown.status, 200);
  assert.deepEqual(unknown.body, { ok: true, expiresInSeconds: 900 });
  assert.deepEqual([known.status, known.body], [unknown.status, unknown.body]);
  assert.equal(h.fake.emails.length, 2);
  assert.equal(await h.env.DB.prepare("SELECT COUNT(*) AS c FROM accounts").first("c"), 1, "start creates no account");
});

test("start requires age confirmation and the current terms version", async () => {
  const h = harness();
  const noAge = await h.start(EMAIL, "203.0.113.1", { ageConfirmed: "yes" });
  assert.deepEqual([noAge.status, noAge.body.reason, noAge.body.termsVersion], [400, "terms_required", TERMS_VERSION]);
  const oldTerms = await h.start(EMAIL, "203.0.113.1", { termsVersion: "2020-01-01" });
  assert.deepEqual([oldTerms.status, oldTerms.body.reason], [400, "terms_required"]);
  const unset = await harness({ TERMS_VERSION: undefined }).start();
  assert.deepEqual([unset.status, unset.body.reason], [503, "terms_not_configured"]);
  assert.equal(h.fake.emails.length, 0);
});

test("start refuses a malformed email and an unconfigured provider", async () => {
  const bad = await harness().start("not-an-email");
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_email"]);
  const off = await harness({ RESEND_API_KEY: undefined }).start();
  assert.deepEqual([off.status, off.body.reason], [503, "email_not_configured"]);
});

test("a fourth live code is refused honestly with retryAfter", async () => {
  const h = harness();
  for (let i = 0; i < 3; i += 1) {
    assert.equal((await h.start()).status, 200);
  }
  const fourth = await h.start();
  assert.equal(fourth.status, 429);
  assert.equal(fourth.body.reason, "rate_limited");
  assert.equal(fourth.body.retryAfter, 900);
  assert.equal(fourth.headers.get("retry-after"), "900");
});

test("per email+IP allows 5 an hour", async () => {
  const h = harness();
  for (let i = 0; i < 5; i += 1) {
    assert.equal((await h.start()).status, 200, `request ${i + 1}`);
    await h.consumeAll();
  }
  const sixth = await h.start();
  assert.deepEqual([sixth.status, sixth.body.reason], [429, "rate_limited"]);
  assert.ok(sixth.body.retryAfter > 0);
});

test("per email allows 8 an hour across IPs", async () => {
  const h = harness();
  for (let i = 0; i < 8; i += 1) {
    assert.equal((await h.start(EMAIL, `198.51.100.${i}`)).status, 200, `request ${i + 1}`);
    await h.consumeAll();
  }
  assert.equal((await h.start(EMAIL, "198.51.100.99")).status, 429);
});

test("per IP allows 10 an hour across emails", async () => {
  const h = harness();
  for (let i = 0; i < 10; i += 1) {
    assert.equal((await h.start(`user${i}@example.test`)).status, 200, `request ${i + 1}`);
  }
  assert.equal((await h.start("user99@example.test")).status, 429);
});

test("a provider failure is 503 email_unavailable and leaves no usable code", async () => {
  const h = harness();
  h.fake.setEmailStatus(503);
  const res = await h.start();
  assert.deepEqual([res.status, res.body.reason], [503, "email_unavailable"]);
  const live = await h.env.DB.prepare("SELECT COUNT(*) AS c FROM login_codes WHERE consumed_at IS NULL").first("c");
  assert.equal(live, 0, "the unsent code was retired");
});

test("the global daily cap answers 503 email_unavailable", async () => {
  const h = harness({ EMAIL_DAILY_CAP: "1" });
  assert.equal((await h.start("a@example.test")).status, 200);
  const res = await h.start("b@example.test");
  assert.deepEqual([res.status, res.body.reason], [503, "email_unavailable"]);
});

test("verify with the emailed code signs in: cookie, verified account, identity, first sign-in", async () => {
  const h = harness();
  await h.start();
  const res = await h.verify(h.lastCode());
  assert.equal(res.status, 200);
  assert.match(res.setCookie, /^__Host-pa_session=[A-Za-z0-9_-]{43}; Max-Age=2592000; Path=\/; Secure; HttpOnly; SameSite=Lax$/);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.account.email, EMAIL);
  assert.equal(res.body.account.emailVerified, true);
  assert.equal(res.body.account.firstSigninAt, NOW);
  assert.equal(res.body.account.signInMethod, "email");
  assert.equal(res.body.account.isAdmin, false);
  const identity = await h.env.DB.prepare("SELECT account_id FROM identities WHERE provider = 'email' AND subject = ?1").bind(EMAIL).first();
  assert.equal(identity.account_id, res.body.account.id);
  const me = await h.call("GET", "/v1/me", { cookie: res.token });
  assert.equal(me.status, 200);
  assert.equal(me.body.account.id, res.body.account.id);
});

test("verify signs into an account an admin created before first sign-in", async () => {
  const h = harness();
  await migrate(h.env.DB);
  await h.start();
  const pre = await createAccount(h.ctx(), { email: EMAIL, emailNormalized: EMAIL, emailVerified: false });
  const res = await h.verify(h.lastCode());
  assert.equal(res.body.account.id, pre.id);
  assert.equal(res.body.account.emailVerified, true);
});

test("verify refuses a wrong code with 401 and no cookie", async () => {
  const h = harness();
  await h.start();
  const code = h.lastCode();
  const res = await h.verify(code === "123456" ? "654321" : "123456");
  assert.deepEqual([res.status, res.body.reason], [401, "bad_code"]);
  assert.equal(res.setCookie, null);
});

test("verify refuses a malformed code and missing terms before touching codes", async () => {
  const h = harness();
  const bad = await h.verify("12ab56");
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_code"]);
  const noTerms = await h.verify("123456", EMAIL, "203.0.113.1", { ageConfirmed: false });
  assert.deepEqual([noTerms.status, noTerms.body.reason], [400, "terms_required"]);
});

test("20 failed verifies in a day lock email-code sign-in for that address", async () => {
  const h = harness();
  for (let i = 0; i < 20; i += 1) {
    const res = await h.verify("000000", EMAIL, `192.0.2.${i}`);
    assert.equal(res.status, 401, `failure ${i + 1}`);
  }
  await migrate(h.env.DB);
  const { code } = await issueLoginCode(h.ctx(), EMAIL);
  const locked = await h.verify(code, EMAIL, "192.0.2.200");
  assert.deepEqual([locked.status, locked.body.reason], [429, "rate_limited"]);
  assert.ok(locked.body.retryAfter > 0);
});

test("verify allows 30 an hour per IP", async () => {
  const h = harness();
  for (let i = 0; i < 30; i += 1) {
    await h.verify("000000", `u${i}@example.test`);
  }
  const res = await h.verify("000000", "u99@example.test");
  assert.deepEqual([res.status, res.body.reason], [429, "rate_limited"]);
});

test("200 parallel wrong verifies over HTTP compare the stored code at most 5 times", async () => {
  const h = harness();
  await h.start();
  const code = h.lastCode();
  assert.match(String(code), /^\d{6}$/, "a code was really emailed");
  let hashReads = 0;
  h.env.DB.observe((sql, rows) => {
    hashReads += rows.filter((row) => Object.prototype.hasOwnProperty.call(row, "code_hmac")).length;
  });
  const guess = code === "000000" ? "000001" : "000000";
  const results = await Promise.all(
    Array.from({ length: 200 }, (_, i) => h.verify(guess, EMAIL, `10.0.${Math.floor(i / 250)}.${i % 250}`))
  );
  assert.ok(results.every((r) => r.status !== 200));
  assert.ok(results.some((r) => r.status === 401 && r.body.reason === "bad_code"), "the verifier really compared");
  assert.ok(hashReads >= 1 && hashReads <= 5, `stored code hash handed out ${hashReads} times`);
  const after = await h.verify(code, EMAIL, "10.9.9.9");
  assert.notEqual(after.status, 200, "the code was burned by the attack");
});

test("a disabled account cannot sign in by email", async () => {
  const h = harness();
  await migrate(h.env.DB);
  const account = await createAccount(h.ctx(), { email: EMAIL, emailNormalized: EMAIL, emailVerified: true });
  await h.env.DB.prepare("UPDATE accounts SET disabled_at = 1 WHERE id = ?1").bind(account.id).run();
  await h.start();
  const res = await h.verify(h.lastCode());
  assert.deepEqual([res.status, res.body.reason], [403, "account_disabled"]);
  assert.equal(res.setCookie, null);
});

test("nothing the email flow logs contains the address or the code", async () => {
  const h = harness();
  await h.start();
  const code = h.lastCode();
  h.fake.setEmailStatus(500);
  await h.start("other@example.test", "203.0.113.9");
  await h.verify("000000");
  await h.verify(code);
  assert.match(String(code), /^\d{6}$/, "the flow really ran");
  assert.ok(h.logs.length >= 1, "the provider failure was logged");
  for (const line of h.logs) {
    assert.ok(!line.includes(EMAIL) && !line.includes("other@") && !line.includes(code), line);
  }
});
