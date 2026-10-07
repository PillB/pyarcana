/**
 * GET /v1/geo (DESIGN-v3 §E): the ads region check. It answers the caller's
 * two-letter country from Cloudflare's request.cf and nothing else: no city,
 * region, coordinates, ASN or IP. A value that is not a real country (none,
 * junk, XX = unknown, T1 = Tor) is null, so the client falls back to house
 * ads: the lookup fails closed.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { handleRequest } from "../src/index.mjs";
import { API_BASE, APP_ORIGIN, createEnv } from "./fixtures.mjs";

/**
 * GET the geo route with a given request.cf.
 * @param {Object|undefined} cf Cloudflare request properties.
 * @param {Object} [opts] `{env, path, origin}`.
 * @returns {Promise<{status: number, body: any, headers: Headers}>} Result.
 */
async function geo(cf, opts = {}) {
  const request = new Request(`${API_BASE}${opts.path || "/api/v1/geo"}`, {
    method: opts.method || "GET",
    headers: { Origin: opts.origin || APP_ORIGIN, "cf-connecting-ip": "203.0.113.9" }
  });
  if (cf !== undefined) {
    Object.defineProperty(request, "cf", { value: cf });
  }
  const response = await handleRequest(request, opts.env || createEnv({ DB: undefined, SERVER_PEPPER: undefined }), { now: 1800000000, log: () => {} });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null, headers: response.headers };
}

const FULL_CF = {
  country: "PE",
  city: "Lima",
  region: "Lima",
  latitude: "-12.04",
  longitude: "-77.03",
  postalCode: "15001",
  asn: 6147,
  colo: "LIM",
  isEUCountry: undefined
};

test("the country, and only the country, is returned; no database or pepper is needed", async () => {
  const res = await geo(FULL_CF);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { ok: true, country: "PE" });
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.equal(res.headers.get("access-control-allow-origin"), APP_ORIGIN);
  const text = JSON.stringify(res.body);
  for (const leak of ["Lima", "-12.04", "15001", "6147", "LIM", "203.0.113.9"]) {
    assert.ok(!text.includes(leak), leak);
  }
});

test("bare /v1/geo answers the same", async () => {
  assert.deepEqual((await geo({ country: "DE" }, { path: "/v1/geo" })).body, { ok: true, country: "DE" });
});

test("no cf, no country, junk, unknown (XX) and Tor (T1) are country null: fail closed", async () => {
  for (const cf of [undefined, {}, { country: null }, { country: "" }, { country: "Peru" }, { country: "pe" }, { country: 42 }, { country: "XX" }, { country: "T1" }, { country: "P\nE" }]) {
    const res = await geo(cf);
    assert.deepEqual([JSON.stringify(cf), res.status, res.body], [JSON.stringify(cf), 200, { ok: true, country: null }]);
  }
});

test("geo is read-only: POST is 405 with Allow: GET", async () => {
  const res = await geo(FULL_CF, { method: "POST" });
  assert.deepEqual([res.status, res.body.reason, res.headers.get("allow")], [405, "method_not_allowed", "GET"]);
});
