/**
 * router.mjs + index.mjs: the route table (404/405), preflight, CSRF before
 * anything else, fail-closed config (503 reason codes), body caps, the
 * session gate, and the top-level catch (500 WITH CORS, logging only the
 * error message).
 */

import assert from "node:assert/strict";
import test from "node:test";

import { matchRoute } from "../src/router.mjs";
import { APP_ORIGIN, api, createEnv, createHarness, seedAccount } from "./fixtures.mjs";

const SECRETS = {
  SERVER_PEPPER: Buffer.alloc(32, 0x61).toString("base64"),
  ADMIN_EMAILS: "owner-secret@gmail.com",
  RESEND_API_KEY: "re_SECRET_VALUE",
  MP_ACCESS_TOKEN: "APP_USR-SECRET",
  MP_WEBHOOK_SECRET: "mp-whsec-SECRET",
  CREEM_API_KEY: "creem_SECRET",
  CREEM_WEBHOOK_SECRET: "creem-whsec-SECRET",
  CREEM_PRODUCT_PRO_MONTHLY: "prod_m",
  CREEM_PRODUCT_PRO_YEARLY: "prod_y"
};

test("matchRoute resolves params, reports 405 with Allow, and misses with null", () => {
  const routes = [
    { method: "GET", path: "/v1/items/:id" },
    { method: "PATCH", path: "/v1/items/:id" },
    { method: "GET", path: "/v1/items" }
  ];
  assert.deepEqual(matchRoute(routes, "GET", "/v1/items/rep_1").params, { id: "rep_1" });
  assert.equal(matchRoute(routes, "GET", "/v1/items").route, routes[2]);
  assert.deepEqual(matchRoute(routes, "DELETE", "/v1/items/rep_1"), { allow: ["GET", "PATCH"] });
  assert.equal(matchRoute(routes, "GET", "/v1/items/rep_1/extra"), null);
  assert.equal(matchRoute(routes, "GET", "/v1/other"), null);
  assert.equal(matchRoute(routes, "GET", "/v1/items/%E0%A4%A"), null, "a malformed escape is a miss, not a crash");
});

test("health reports booleans only and never a secret value", async () => {
  const env = createEnv(SECRETS);
  const res = await api(env, "GET", "/v1/health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    ok: true,
    db: true,
    pepper: true,
    terms: true,
    email: true,
    google: true,
    microsoft: true,
    mercadopago: true,
    creem: true,
    origins: [APP_ORIGIN]
  });
  const text = JSON.stringify(res.body);
  for (const value of Object.values(SECRETS)) {
    assert.ok(!text.includes(value), value);
  }
});

test("health still answers, all false, when nothing is configured", async () => {
  const res = await api({}, "GET", "/v1/health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    ok: true,
    db: false,
    pepper: false,
    terms: false,
    email: false,
    google: false,
    microsoft: false,
    mercadopago: false,
    creem: false,
    origins: []
  });
});

test("auth methods advertise what works and the 7-day trial", async () => {
  const res = await api(createEnv(), "GET", "/v1/auth/methods");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    ok: true,
    email: true,
    google: true,
    googleClientId: "pyarcana-test.apps.googleusercontent.com",
    microsoft: true,
    microsoftClientId: "11111111-2222-3333-4444-555555555555",
    trialDays: 7
  });
  const bare = await api(createEnv({ SERVER_PEPPER: undefined, GOOGLE_CLIENT_ID: "" }), "GET", "/v1/auth/methods");
  assert.equal(bare.body.email, false, "email sign-in needs the pepper");
  assert.equal(bare.body.google, false);
  assert.equal(bare.body.googleClientId, null);
  const noTerms = await api(createEnv({ TERMS_VERSION: undefined }), "GET", "/v1/auth/methods");
  assert.deepEqual(
    [noTerms.body.email, noTerms.body.google, noTerms.body.microsoft],
    [false, false, false],
    "no method is offered while every sign-in would answer 503 terms_not_configured"
  );
});

test("an unknown path is 404 with CORS headers and no-store", async () => {
  const res = await api(createEnv(), "GET", "/v1/nope");
  assert.equal(res.status, 404);
  assert.deepEqual(res.body, { ok: false, reason: "not_found" });
  assert.equal(res.headers.get("access-control-allow-origin"), APP_ORIGIN);
  assert.equal(res.headers.get("cache-control"), "no-store");
});

test("a known path with the wrong method is 405 with Allow", async () => {
  const res = await api(createEnv(), "DELETE", "/v1/health");
  assert.equal(res.status, 405);
  assert.equal(res.body.reason, "method_not_allowed");
  assert.equal(res.headers.get("allow"), "GET");
});

test("preflight on a known path answers per origin; unknown paths are 404", async () => {
  const env = createEnv();
  const ok = await api(env, "OPTIONS", "/v1/auth/email/start", {
    headers: { "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type,x-pyarcana" }
  });
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get("access-control-allow-origin"), APP_ORIGIN);
  const evil = await api(env, "OPTIONS", "/v1/auth/email/start", { origin: "https://evil.test" });
  assert.equal(evil.status, 403);
  assert.equal((await api(env, "OPTIONS", "/v1/nope")).status, 404);
});

test("CSRF is enforced before config, body or session checks", async () => {
  const env = createEnv({ DB: undefined });
  const noHeader = await api(env, "POST", "/v1/auth/logout", { csrf: false, body: {} });
  assert.deepEqual([noHeader.status, noHeader.body.reason], [403, "bad_origin"]);
  const wrongOrigin = await api(env, "POST", "/v1/auth/logout", { origin: "https://evil.test", body: {} });
  assert.deepEqual([wrongOrigin.status, wrongOrigin.body.reason], [403, "bad_origin"]);
  assert.equal(wrongOrigin.headers.get("access-control-allow-origin"), null);
});

test("missing D1 or pepper fails closed with a reason code", async () => {
  const noDb = await api(createEnv({ DB: undefined }), "GET", "/v1/me");
  assert.deepEqual([noDb.status, noDb.body.reason], [503, "db_not_configured"]);
  const noPepper = await api(createEnv({ SERVER_PEPPER: "dG9vIHNob3J0" }), "POST", "/v1/auth/email/start", { body: {} });
  assert.deepEqual([noPepper.status, noPepper.body.reason], [503, "pepper_not_configured"]);
});

test("a session route without a cookie is 401 and clears the cookie", async () => {
  const res = await api(createEnv(), "GET", "/v1/me");
  assert.equal(res.status, 401);
  assert.equal(res.body.reason, "no_session");
  assert.match(res.setCookie, /^__Host-pa_session=;.*Max-Age=0/);
});

test("an oversized body is 413 before any handler runs", async () => {
  const res = await api(createEnv(), "POST", "/v1/auth/email/start", {
    rawBody: JSON.stringify({ email: "a@b.test", pad: "x".repeat(70 * 1024) }),
    headers: { "content-type": "application/json" }
  });
  assert.deepEqual([res.status, res.body.reason], [413, "body_too_large"]);
});

test("a crash becomes 500 with CORS headers and logs only the error message", async () => {
  const env = createEnv({
    DB: {
      prepare() {
        throw new Error("boom");
      }
    }
  });
  const logs = [];
  const res = await api(env, "GET", "/v1/me", { log: (line) => logs.push(line), cookie: "A".repeat(43) });
  assert.equal(res.status, 500);
  assert.deepEqual(res.body, { ok: false, reason: "internal_error" });
  assert.equal(res.headers.get("access-control-allow-origin"), APP_ORIGIN);
  assert.deepEqual(logs, ["unhandled error: boom"]);
});

test("a route's own body cap overrides the 64 KiB default", async () => {
  const { handleRequest } = await import("../src/index.mjs");
  const echo = (ctx) => ({ status: 200, body: { ok: true, size: JSON.stringify(ctx.body).length } });
  const routes = [
    { method: "POST", path: "/v1/small", handler: echo, needs: [], bodyCap: 16 },
    { method: "POST", path: "/v1/default", handler: echo, needs: [] }
  ];
  const post = (path) =>
    handleRequest(
      new Request(`https://api.pyarcana.test${path}`, {
        method: "POST",
        headers: { Origin: APP_ORIGIN, "X-PyArcana": "1" },
        body: JSON.stringify({ pad: "x".repeat(20) })
      }),
      createEnv(),
      { routes, now: 1, log: () => {} }
    );
  const small = await post("/v1/small");
  assert.equal(small.status, 413);
  const normal = await post("/v1/default");
  assert.equal(normal.status, 200);
});

test("webhook routes skip CSRF and never send CORS headers", async () => {
  const { handleRequest } = await import("../src/index.mjs");
  const routes = [{ method: "POST", path: "/v1/webhooks/test", handler: () => ({ status: 200, body: { ok: true } }), needs: [], webhook: true }];
  const res = await handleRequest(
    new Request("https://api.pyarcana.test/v1/webhooks/test", { method: "POST", headers: { Origin: APP_ORIGIN }, body: "{}" }),
    createEnv(),
    { routes, now: 1, log: () => {} }
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("access-control-allow-origin"), null);
});

test("the one-origin deployment's /api prefix routes like bare /v1 (DESIGN-v3 §A)", async () => {
  const { env } = await createHarness();
  const health = await api(env, "GET", "/api/v1/health");
  assert.deepEqual([health.status, health.body.ok], [200, true]);
  const preflightRes = await api(env, "OPTIONS", "/api/v1/auth/email/start", {
    headers: { "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type,x-pyarcana" }
  });
  assert.equal(preflightRes.status, 204);
  const learner = await seedAccount(env, { email: "ana@example.test" });
  const me = await api(env, "GET", "/api/v1/me", { cookie: learner.token });
  assert.deepEqual([me.status, me.body.account.id], [200, learner.account.id]);
  assert.equal((await api(env, "GET", "/v1/me", { cookie: learner.token })).status, 200, "bare /v1 still works (local dev, webhooks)");
});

test("only ONE leading /api segment is stripped; look-alike prefixes are 404", async () => {
  const env = createEnv();
  for (const path of ["/api/api/v1/health", "/apiv1/health", "/api", "/API/v1/health", "/x/api/v1/health"]) {
    const res = await api(env, "GET", path);
    assert.deepEqual([path, res.status, res.body.reason], [path, 404, "not_found"]);
  }
});

test("review: workers/billing/README.md documents every built route and names the undone work and owner steps", async () => {
  const { readFileSync } = await import("node:fs");
  const { ROUTES } = await import("../src/router.mjs");
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  for (const route of ROUTES) {
    assert.ok(readme.includes(`\`${route.method} ${route.path}\``), `README lists ${route.method} ${route.path}`);
  }
  for (const heading of ["## Routes", "## Not built yet", "## Owner steps", "## Stated deviations"]) {
    assert.ok(readme.includes(heading), heading);
  }
  const undone = readme.slice(readme.indexOf("## Not built yet"), readme.indexOf("## Owner steps"));
  for (const item of ["POST /v1/checkout", "/v1/webhooks/mercadopago", "/v1/webhooks/creem", "GET /v1/jwks", "licenseToken", "/v1/admin/experiments", "reconciliation", "Turnstile", "scripts/deploy.sh"]) {
    assert.ok(undone.includes(item), `named as undone: ${item}`);
  }
  for (const built of ROUTES.map((r) => `${r.method} ${r.path}`)) {
    assert.ok(!undone.includes(`\`${built}\``), `${built} is built; it must not be listed as undone`);
  }
});
