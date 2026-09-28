/**
 * http.mjs: JSON responses, exact-origin CORS with credentials, the CSRF rule
 * (X-PyArcana: 1 plus an allowed Origin), streaming body caps and the
 * __Host- session cookie.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  SESSION_COOKIE,
  allowedOrigins,
  callerIp,
  clearSessionCookie,
  corsHeaders,
  csrfFailure,
  json,
  preflight,
  readCookie,
  readJsonBody,
  sessionCookie
} from "../src/http.mjs";

const APP = "https://app.pyarcana.test";
const env = { ALLOWED_ORIGINS: `${APP}, http://localhost:3000` };

/**
 * Build a request with headers.
 * @param {string} method HTTP method.
 * @param {Object} headers Header map.
 * @param {BodyInit} [body] Body.
 * @returns {Request} Request.
 */
function req(method, headers, body) {
  return new Request("https://api.pyarcana.test/v1/x", { method, headers, body, duplex: "half" });
}

test("allowedOrigins keeps only exact bare origins", () => {
  const list = allowedOrigins({
    ALLOWED_ORIGINS: " https://a.test ,https://b.test/, https://c.test/path, null, ftp://d.test, http://localhost:3000 "
  });
  assert.deepEqual(list, ["https://a.test", "http://localhost:3000"]);
  assert.deepEqual(allowedOrigins({}), []);
});

test("CORS echoes an allowed origin exactly, with credentials and Vary", () => {
  const headers = corsHeaders(req("GET", { Origin: APP }), env);
  assert.equal(headers["access-control-allow-origin"], APP);
  assert.equal(headers["access-control-allow-credentials"], "true");
  assert.equal(headers.vary, "Origin");
});

test("CORS gives nothing to an unlisted or look-alike origin", () => {
  for (const origin of ["https://evil.test", `${APP}.evil.test`, "null", APP.toUpperCase()]) {
    const headers = corsHeaders(req("GET", { Origin: origin }), env);
    assert.equal(headers["access-control-allow-origin"], undefined, origin);
    assert.equal(headers["access-control-allow-credentials"], undefined, origin);
    assert.equal(headers.vary, "Origin");
  }
});

test("preflight from an allowed origin allows the custom header", () => {
  const response = preflight(
    req("OPTIONS", {
      Origin: APP,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type, x-pyarcana"
    }),
    env
  );
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), APP);
  assert.equal(response.headers.get("access-control-allow-credentials"), "true");
  assert.match(response.headers.get("access-control-allow-headers"), /x-pyarcana/);
  assert.match(response.headers.get("access-control-allow-methods"), /POST/);
  assert.ok(Number(response.headers.get("access-control-max-age")) > 0);
});

test("preflight from an unlisted origin is refused without CORS headers", async () => {
  const response = preflight(req("OPTIONS", { Origin: "https://evil.test" }), env);
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.deepEqual(await response.json(), { ok: false, reason: "bad_origin" });
});

test("CSRF: a state-changing request needs X-PyArcana: 1 and an allowed Origin", () => {
  assert.equal(csrfFailure(req("POST", { Origin: APP, "X-PyArcana": "1" }), env), null);
  assert.equal(csrfFailure(req("DELETE", { Origin: APP, "X-PyArcana": "1" }), env), null);
  assert.equal(csrfFailure(req("POST", { Origin: APP }), env), "bad_origin");
  assert.equal(csrfFailure(req("POST", { Origin: APP, "X-PyArcana": "0" }), env), "bad_origin");
  assert.equal(csrfFailure(req("POST", { "X-PyArcana": "1" }), env), "bad_origin");
  assert.equal(csrfFailure(req("PUT", { Origin: "https://evil.test", "X-PyArcana": "1" }), env), "bad_origin");
  assert.equal(csrfFailure(req("PATCH", { Origin: APP }), env), "bad_origin");
});

test("CSRF does not apply to safe methods", () => {
  assert.equal(csrfFailure(req("GET", {}), env), null);
  assert.equal(csrfFailure(req("HEAD", {}), env), null);
});

test("json responses are no-store, nosniff and JSON", async () => {
  const response = json({ ok: true }, 201, { "x-extra": "1" });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-type"), /^application\/json/);
  assert.equal(response.headers.get("x-extra"), "1");
  assert.deepEqual(await response.json(), { ok: true });
});

test("a declared body over the cap is refused before reading", async () => {
  const request = req("POST", { "content-length": "70000" }, "{}");
  assert.deepEqual(await readJsonBody(request, 65536), { ok: false, status: 413, reason: "body_too_large" });
});

test("an undeclared streamed body is cut off at the cap", async () => {
  let pulled = 0;
  const stream = new ReadableStream({
    pull(controller) {
      pulled += 1;
      if (pulled > 100) {
        controller.close();
        return;
      }
      controller.enqueue(new Uint8Array(1024).fill(32));
    }
  });
  const result = await readJsonBody(req("POST", {}, stream), 4096);
  assert.deepEqual(result, { ok: false, status: 413, reason: "body_too_large" });
  assert.ok(pulled < 20, `stopped reading early (pulled ${pulled} chunks)`);
});

test("a body of exactly the cap is accepted", async () => {
  const text = `{"a":"${"x".repeat(100 - 8)}"}`;
  assert.equal(new TextEncoder().encode(text).length, 100);
  const result = await readJsonBody(req("POST", {}, text), 100);
  assert.equal(result.ok, true);
  assert.equal(result.body.a.length, 92);
});

test("only a JSON object body is accepted; empty means {}", async () => {
  assert.deepEqual(await readJsonBody(req("POST", {}, "not json"), 1000), {
    ok: false,
    status: 400,
    reason: "bad_json"
  });
  assert.deepEqual(await readJsonBody(req("POST", {}, "[1,2]"), 1000), { ok: false, status: 400, reason: "bad_json" });
  assert.deepEqual(await readJsonBody(req("POST", {}, "null"), 1000), { ok: false, status: 400, reason: "bad_json" });
  assert.deepEqual(await readJsonBody(req("POST", {}), 1000), { ok: true, body: {} });
});

test("the session cookie is __Host-, Secure, HttpOnly, Lax, Path=/ and has no Domain", () => {
  const cookie = sessionCookie("tok123", 3600);
  assert.equal(SESSION_COOKIE, "__Host-pa_session");
  const parts = cookie.split("; ");
  assert.equal(parts[0], "__Host-pa_session=tok123");
  for (const attribute of ["Secure", "HttpOnly", "SameSite=Lax", "Path=/", "Max-Age=3600"]) {
    assert.ok(parts.includes(attribute), attribute);
  }
  assert.ok(!/domain=/i.test(cookie));
  assert.ok(clearSessionCookie().includes("Max-Age=0"));
  assert.ok(clearSessionCookie().startsWith("__Host-pa_session=;"));
});

test("readCookie finds the exact cookie name among others", () => {
  const request = req("GET", { Cookie: "x__Host-pa_session=nope; a=1; __Host-pa_session=yes; b=2" });
  assert.equal(readCookie(request, SESSION_COOKIE), "yes");
  assert.equal(readCookie(req("GET", { Cookie: "a=1" }), SESSION_COOKIE), null);
  assert.equal(readCookie(req("GET", {}), SESSION_COOKIE), null);
});

test("callerIp trusts cf-connecting-ip only", () => {
  assert.equal(callerIp(req("GET", { "cf-connecting-ip": "203.0.113.9", "x-forwarded-for": "1.1.1.1" })), "203.0.113.9");
  assert.equal(callerIp(req("GET", { "x-forwarded-for": "1.1.1.1" })), "unknown");
});
