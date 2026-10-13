/**
 * One-origin hosting (DESIGN-v3 §A): the worker is the whole site. The API
 * lives under /api/* (and bare /v1/* for local dev and webhooks); every other
 * path is a static file, served by the Workers Static Assets binding ASSETS.
 * With run_worker_first = ["/api/*"] Cloudflare already sends only /api/* to
 * the worker, so the fall-through below matters for `wrangler dev` and for any
 * request the platform routes to the worker anyway.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { handleRequest } from "../src/index.mjs";
import { API_BASE, APP_ORIGIN, createEnv, createHarness } from "./fixtures.mjs";

/**
 * A fake ASSETS binding that records what it was asked for.
 * @returns {{fetch: function, seen: Request[]}} Binding.
 */
function fakeAssets() {
  const seen = [];
  return {
    seen,
    async fetch(request) {
      seen.push(request);
      return new Response(`<html>${new URL(request.url).pathname}</html>`, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8", "x-from": "assets" }
      });
    }
  };
}

/**
 * Send a GET through the worker entry.
 * @param {Object} env Env.
 * @param {string} path Path.
 * @param {Object} [init] Request init.
 * @returns {Promise<Response>} Response.
 */
function get(env, path, init = {}) {
  return handleRequest(new Request(`${API_BASE}${path}`, { method: "GET", ...init }), env, { now: 1800000000, log: () => {} });
}

test("a non-API path is served by the ASSETS binding, untouched (same request, same response)", async () => {
  const assets = fakeAssets();
  const env = createEnv({ ASSETS: assets });
  for (const path of ["/", "/cuenta", "/precios/", "/ads.txt", "/_next/static/chunk.js", "/apiv1/health", "/v1x"]) {
    const res = await get(env, path);
    assert.deepEqual([path, res.status, res.headers.get("x-from"), await res.text()], [path, 200, "assets", `<html>${path}</html>`]);
  }
  assert.equal(assets.seen.length, 7);
  assert.equal(new URL(assets.seen[0].url).pathname, "/");
  assert.equal(assets.seen[0].method, "GET");
});

test("API paths never reach ASSETS: /api/*, /api and bare /v1/* are the worker's, including its 404", async () => {
  const assets = fakeAssets();
  const { env } = await createHarness({ ASSETS: assets });
  const health = await get(env, "/api/v1/health");
  assert.deepEqual([health.status, (await health.json()).ok], [200, true]);
  assert.equal((await get(env, "/v1/health")).status, 200);
  for (const path of ["/api/v1/nope", "/api", "/api/", "/v1/nope", "/v1"]) {
    const res = await get(env, path);
    assert.deepEqual([path, res.status, (await res.json()).reason], [path, 404, "not_found"]);
  }
  const preflight = await handleRequest(
    new Request(`${API_BASE}/api/v1/auth/email/start`, {
      method: "OPTIONS",
      headers: { Origin: APP_ORIGIN, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type,x-pyarcana" }
    }),
    env,
    { now: 1800000000, log: () => {} }
  );
  assert.equal(preflight.status, 204);
  assert.equal(assets.seen.length, 0);
});

test("without an ASSETS binding a non-API path keeps the worker's JSON 404 (API-only deployments, tests)", async () => {
  const env = createEnv();
  const res = await get(env, "/cuenta");
  assert.deepEqual([res.status, (await res.json()).reason], [404, "not_found"]);
});

test("an ASSETS binding that is not a fetcher is ignored, never called", async () => {
  const env = createEnv({ ASSETS: { fetch: "nope" } });
  const res = await get(env, "/cuenta");
  assert.deepEqual([res.status, (await res.json()).reason], [404, "not_found"]);
});

test("an ASSETS failure is a 500 that logs the message only, like any other unexpected error", async () => {
  const lines = [];
  const env = createEnv({
    ASSETS: {
      fetch() {
        throw new Error("assets exploded");
      }
    }
  });
  const res = await handleRequest(new Request(`${API_BASE}/cuenta`), env, { now: 1800000000, log: (line) => lines.push(line) });
  assert.deepEqual([res.status, (await res.json()).reason], [500, "internal_error"]);
  assert.deepEqual(lines, ["unhandled error: assets exploded"]);
});
