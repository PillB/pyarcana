/**
 * email.mjs: provider selection (strict), the dev-log provider's localhost
 * guard, the global daily cap, PyArcana's Spanish copy and the honest mapping
 * of provider failures to `email_unavailable`.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLoginCodeMessage,
  buildSendRequest,
  emailConfigured,
  resolveEmailConfig,
  sendLoginCode
} from "../src/email.mjs";
import { createCtx, createFakeFetch } from "./fixtures.mjs";

const TO = "ana.perez@example.test";
const CODE = "482913";

/**
 * A context with a fake fetch and a log recorder.
 * @param {Object} [overrides] Env overrides.
 * @returns {Promise<Object>} Context plus `fake` and `logs`.
 */
async function emailCtx(overrides) {
  const ctx = await createCtx(overrides);
  const fake = createFakeFetch();
  const logs = [];
  return { ...ctx, fetchImpl: fake.fetchImpl, log: (...args) => logs.push(args.join(" ")), fake, logs };
}

test("no provider, an unknown provider, a missing key or a missing sender means not configured", () => {
  assert.equal(emailConfigured({}), false);
  assert.equal(emailConfigured({ EMAIL_PROVIDER: "carrier-pigeon", RESEND_API_KEY: "k", EMAIL_FROM: "a@b.test" }), false);
  assert.equal(emailConfigured({ EMAIL_PROVIDER: "resend", EMAIL_FROM: "a@b.test" }), false);
  assert.equal(emailConfigured({ EMAIL_PROVIDER: "resend", RESEND_API_KEY: "k" }), false);
  assert.equal(emailConfigured({ EMAIL_PROVIDER: "resend", RESEND_API_KEY: "k", EMAIL_FROM: "a@b.test" }), true);
});

test("the declared provider is used strictly: another provider's key is not a fallback", () => {
  const env = { EMAIL_PROVIDER: "brevo", RESEND_API_KEY: "k", EMAIL_FROM: "a@b.test" };
  assert.equal(emailConfigured(env), false);
  assert.equal(resolveEmailConfig(env).reason, "email_not_configured");
  assert.equal(resolveEmailConfig({ ...env, BREVO_API_KEY: "b" }).provider, "brevo");
});

test("dev-log is allowed only when every allowed origin is http://localhost", () => {
  const devLog = (origins) => resolveEmailConfig({ EMAIL_PROVIDER: "dev-log", ALLOWED_ORIGINS: origins });
  assert.equal(devLog("http://localhost:3000").provider, "dev-log");
  assert.equal(devLog("http://localhost:3000,http://localhost:3001").provider, "dev-log");
  for (const origins of [
    "",
    "http://localhost:3000, https://app.pyarcana.test",
    "http://localhost.evil.test",
    "https://localhost:3000",
    "http://127.0.0.1:3000"
  ]) {
    const config = devLog(origins);
    assert.equal(config.provider, null, origins);
    assert.equal(config.reason, "dev_log_refused", origins);
  }
});

test("the message is Spanish, carries the code in both bodies and has no tracking", () => {
  const message = buildLoginCodeMessage(CODE, 15);
  assert.equal(message.subject, `${CODE} — PyArcana`);
  assert.ok(message.text.includes(CODE));
  assert.ok(message.html.includes(CODE));
  assert.match(message.text, /Tu código/);
  assert.match(message.text, /15 minutos/);
  assert.ok(!/<img|https?:\/\/|<a /i.test(message.html), "no images, links or pixels");
});

test("each provider gets its own request shape", () => {
  const message = { to: TO, ...buildLoginCodeMessage(CODE, 15) };
  const config = { apiKey: "key", from: "acceso@pyarcana.test", fromName: "PyArcana" };
  const resend = buildSendRequest("resend", config, message);
  assert.equal(resend.url, "https://api.resend.com/emails");
  assert.equal(resend.init.headers.authorization, "Bearer key");
  assert.equal(JSON.parse(resend.init.body).from, "PyArcana <acceso@pyarcana.test>");
  assert.deepEqual(JSON.parse(resend.init.body).to, [TO]);
  const brevo = buildSendRequest("brevo", config, message);
  assert.equal(brevo.url, "https://api.brevo.com/v3/smtp/email");
  assert.equal(brevo.init.headers["api-key"], "key");
  assert.deepEqual(JSON.parse(brevo.init.body).to, [{ email: TO }]);
  const mailersend = buildSendRequest("mailersend", config, message);
  assert.equal(mailersend.url, "https://api.mailersend.com/v1/email");
  assert.equal(JSON.parse(mailersend.init.body).from.email, "acceso@pyarcana.test");
});

test("a sender name cannot inject header syntax", () => {
  const config = { apiKey: "k", from: "acceso@pyarcana.test", fromName: 'Py"Arcana\r\nBcc: x@evil.test <' };
  const request = buildSendRequest("resend", config, { to: TO, ...buildLoginCodeMessage(CODE, 15) });
  const from = JSON.parse(request.init.body).from;
  assert.ok(!/[\r\n"<]/.test(from.split(" <")[0]), from);
});

test("a successful send calls the provider once", async () => {
  const ctx = await emailCtx();
  assert.deepEqual(await sendLoginCode(ctx, TO, CODE, 15), { ok: true });
  assert.equal(ctx.fake.emails.length, 1);
  assert.equal(ctx.fake.emails[0].body.subject, `${CODE} — PyArcana`);
});

test("provider 429, 5xx, 4xx and transport errors all map to email_unavailable", async () => {
  for (const status of [429, 500, 503, 401]) {
    const ctx = await emailCtx();
    ctx.fake.setEmailStatus(status);
    assert.deepEqual(await sendLoginCode(ctx, TO, CODE, 15), { ok: false, reason: "email_unavailable" }, String(status));
  }
  const ctx = await emailCtx();
  ctx.fake.setEmailThrows(true);
  assert.deepEqual(await sendLoginCode(ctx, TO, CODE, 15), { ok: false, reason: "email_unavailable" });
});

test("failure logs name the provider and status, never the address or the code", async () => {
  const ctx = await emailCtx();
  ctx.fake.setEmailStatus(503);
  await sendLoginCode(ctx, TO, CODE, 15);
  assert.equal(ctx.logs.length, 1);
  assert.match(ctx.logs[0], /resend/);
  assert.match(ctx.logs[0], /503/);
  assert.ok(!ctx.logs[0].includes(TO) && !ctx.logs[0].includes(CODE) && !ctx.logs[0].includes("ana"));
});

test("the global daily cap refuses honestly without calling the provider", async () => {
  const ctx = await emailCtx({ EMAIL_DAILY_CAP: "2" });
  assert.equal((await sendLoginCode(ctx, TO, CODE, 15)).ok, true);
  assert.equal((await sendLoginCode(ctx, "b@example.test", CODE, 15)).ok, true);
  assert.deepEqual(await sendLoginCode(ctx, "c@example.test", CODE, 15), { ok: false, reason: "email_unavailable" });
  assert.equal(ctx.fake.emails.length, 2);
});

test("an unconfigured provider refuses with email_not_configured", async () => {
  const ctx = await emailCtx({ RESEND_API_KEY: undefined });
  assert.deepEqual(await sendLoginCode(ctx, TO, CODE, 15), { ok: false, reason: "email_not_configured" });
  assert.equal(ctx.fake.calls.length, 0);
});

test("dev-log prints the code locally and sends nothing", async () => {
  const ctx = await emailCtx({ EMAIL_PROVIDER: "dev-log", ALLOWED_ORIGINS: "http://localhost:3000" });
  assert.deepEqual(await sendLoginCode(ctx, TO, CODE, 15), { ok: true });
  assert.equal(ctx.fake.calls.length, 0);
  assert.ok(ctx.logs.some((line) => line.includes(CODE)));
});

test("dev-log with a non-localhost origin refuses instead of printing codes", async () => {
  const ctx = await emailCtx({ EMAIL_PROVIDER: "dev-log" });
  assert.deepEqual(await sendLoginCode(ctx, TO, CODE, 15), { ok: false, reason: "email_not_configured" });
  assert.ok(!ctx.logs.some((line) => line.includes(CODE)));
});
