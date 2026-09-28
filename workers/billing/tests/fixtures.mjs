/**
 * Shared test fixtures: an env builder with a real pepper and origins, a
 * migrated D1 fake, locally generated RSA signers with a fake JWKS served
 * through an injectable fetch, and an email-capturing fake provider.
 * No network, no Workers runtime, no dependencies.
 */

import { webcrypto } from "node:crypto";

import { pepperBytes } from "../src/crypto.mjs";
import { migrate, resetSchemaMemo } from "../src/schema.mjs";
import { createD1 } from "./d1-fake.mjs";

/** The canonical app origin used by tests. */
export const APP_ORIGIN = "https://app.pyarcana.test";

/** API base the fake requests are addressed to. */
export const API_BASE = "https://api.pyarcana.test";

/** A fixed clock: 2027-01-15T08:00:00Z. */
export const NOW = 1800000000;

/** Test Google client id. */
export const GOOGLE_CLIENT_ID = "pyarcana-test.apps.googleusercontent.com";

/** Test Microsoft client id (a GUID, as Entra issues them). */
export const MICROSOFT_CLIENT_ID = "11111111-2222-3333-4444-555555555555";

/** The terms version sign-in must echo. */
export const TERMS_VERSION = "2026-09-28";

/** A 32-byte pepper, base64. */
export const TEST_PEPPER = Buffer.alloc(32, 0x5a).toString("base64");

/**
 * Worker env with every stage-1a var set and a fresh D1 fake.
 * @param {Object} [overrides] Fields to override (undefined deletes).
 * @returns {Object} Env bindings.
 */
export function createEnv(overrides) {
  const env = {
    DB: createD1(),
    SERVER_PEPPER: TEST_PEPPER,
    ALLOWED_ORIGINS: APP_ORIGIN,
    CANONICAL_ORIGIN: APP_ORIGIN,
    SITE_PATH: "",
    TERMS_VERSION,
    TRIAL_DAYS: "7",
    GRACE_DAYS: "7",
    SESSION_MAX_DAYS: "180",
    GOOGLE_CLIENT_ID,
    MICROSOFT_CLIENT_ID,
    EMAIL_PROVIDER: "resend",
    RESEND_API_KEY: "re_unit_test",
    EMAIL_FROM: "acceso@pyarcana.test",
    EMAIL_FROM_NAME: "PyArcana",
    EMAIL_DAILY_CAP: "90",
    ADMIN_EMAILS: "owner@gmail.com"
  };
  for (const [key, value] of Object.entries(overrides || {})) {
    if (value === undefined) {
      delete env[key];
    } else {
      env[key] = value;
    }
  }
  return env;
}

/**
 * A request context over a migrated database, as the router builds it.
 * @param {Object} [overrides] Env overrides.
 * @param {number} [now] Clock.
 * @returns {Promise<Object>} `{env, db, pepper, now}`.
 */
export async function createCtx(overrides, now = NOW) {
  resetSchemaMemo();
  const env = createEnv(overrides);
  await migrate(env.DB);
  return { env, db: env.DB, pepper: pepperBytes(env), now, log: () => {} };
}

/**
 * Call the worker the way the browser does: JSON body, the app Origin and
 * X-PyArcana: 1 on state-changing requests, and the session cookie if given.
 * @param {Object} env Worker env.
 * @param {string} method HTTP method.
 * @param {string} path Path and query.
 * @param {{body?: unknown, rawBody?: BodyInit, cookie?: string, origin?: string|null, csrf?: boolean,
 *          headers?: Object, now?: number, fetchImpl?: function, log?: function}} [opts] Options.
 * @returns {Promise<{status: number, body: any, headers: Headers, setCookie: string|null, token: string|null}>} Result.
 */
export async function api(env, method, path, opts = {}) {
  const { handleRequest } = await import("../src/index.mjs");
  const { headers, body } = buildRequestParts(method, opts);
  const request = new Request(`${API_BASE}${path}`, { method, headers, body, duplex: "half" });
  const response = await handleRequest(request, env, {
    now: opts.now === undefined ? NOW : opts.now,
    fetchImpl: opts.fetchImpl,
    log: opts.log || (() => {})
  });
  return readResponse(response);
}

/**
 * Headers and body for a browser-like request.
 * @param {string} method HTTP method.
 * @param {Object} opts See api().
 * @returns {{headers: Headers, body: BodyInit|undefined}} Parts.
 */
function buildRequestParts(method, opts) {
  const headers = new Headers(opts.headers || {});
  const origin = opts.origin === undefined ? APP_ORIGIN : opts.origin;
  if (origin) {
    headers.set("Origin", origin);
  }
  if (!["GET", "HEAD", "OPTIONS"].includes(method) && opts.csrf !== false) {
    headers.set("X-PyArcana", "1");
  }
  if (opts.cookie) {
    headers.set("Cookie", `__Host-pa_session=${opts.cookie}`);
  }
  if (opts.body === undefined) {
    return { headers, body: opts.rawBody };
  }
  headers.set("content-type", "application/json");
  return { headers, body: JSON.stringify(opts.body) };
}

/**
 * Decode a worker response for assertions.
 * @param {Response} response Response.
 * @returns {Promise<{status: number, body: any, headers: Headers, setCookie: string|null, token: string|null}>} Result.
 */
async function readResponse(response) {
  const text = await response.text();
  const setCookie = response.headers.get("set-cookie");
  const match = setCookie ? /^__Host-pa_session=([^;]*)/.exec(setCookie) : null;
  return {
    status: response.status,
    body: text ? JSON.parse(text) : null,
    headers: response.headers,
    setCookie,
    token: match && match[1] ? match[1] : null
  };
}

/**
 * Encode bytes or text as unpadded base64url.
 * @param {Uint8Array|string} input Value.
 * @returns {string} base64url.
 */
export function b64url(input) {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : Buffer.from(input);
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * An RS256 signer and the public JWK that verifies it.
 * @param {string} kid Key id.
 * @param {Object} [jwkExtra] Extra JWK members (e.g. Microsoft's `issuer`).
 * @returns {Promise<{kid: string, jwk: Object, sign: function(Object, Object=): Promise<string>}>} Signer.
 */
export async function makeSigner(kid, jwkExtra) {
  const pair = await webcrypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  );
  const exported = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const jwk = { kty: "RSA", n: exported.n, e: exported.e, alg: "RS256", use: "sig", kid, ...(jwkExtra || {}) };
  const sign = async (claims, headerPatch) => {
    const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid, ...(headerPatch || {}) }));
    const body = b64url(JSON.stringify(claims));
    const signature = await webcrypto.subtle.sign("RSASSA-PKCS1-v1_5", pair.privateKey, Buffer.from(`${header}.${body}`));
    return `${header}.${body}.${b64url(new Uint8Array(signature))}`;
  };
  return { kid, jwk, sign };
}

/** Google's JWKS URL (as google.mjs fetches it). */
export const GOOGLE_JWKS = "https://www.googleapis.com/oauth2/v3/certs";

/** Microsoft's common-endpoint JWKS URL (as microsoft.mjs fetches it). */
export const MICROSOFT_JWKS = "https://login.microsoftonline.com/common/discovery/v2.0/keys";

/** A tenant id (GUID) for Microsoft tokens. */
export const TENANT = "72f988bf-86f1-41af-91ab-2d7cd011db47";

/**
 * A plausible Google ID token claim set.
 * @param {Object} [patch] Overrides (undefined deletes).
 * @returns {Object} Claims.
 */
export function googleClaims(patch) {
  return strip({
    iss: "https://accounts.google.com",
    aud: GOOGLE_CLIENT_ID,
    sub: "110000000000000000001",
    email: "ana.perez@gmail.com",
    email_verified: true,
    name: "Ana Pérez",
    iat: NOW - 30,
    exp: NOW + 3570,
    ...(patch || {})
  });
}

/**
 * A plausible Microsoft v2 ID token claim set.
 * @param {Object} [patch] Overrides (undefined deletes).
 * @returns {Object} Claims.
 */
export function microsoftClaims(patch) {
  return strip({
    iss: `https://login.microsoftonline.com/${TENANT}/v2.0`,
    aud: MICROSOFT_CLIENT_ID,
    tid: TENANT,
    oid: "00000000-0000-0000-66f3-3332eca7ea81",
    sub: "AAAAAAAAAAAAAAAAAAAAAIkzqFVrSaSaFHy782bbtaQ",
    preferred_username: "ana@contoso.test",
    email: "ana@contoso.test",
    name: "Ana",
    nonce: "n-0S6_WzA2Mj-abcdef",
    iat: NOW - 30,
    nbf: NOW - 30,
    exp: NOW + 3570,
    ...(patch || {})
  });
}

/**
 * Remove keys whose value is undefined.
 * @param {Object} object Object.
 * @returns {Object} Copy.
 */
function strip(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
}

/**
 * Signers for Google and Microsoft plus a fake fetch serving both JWKS.
 * @returns {Promise<{google: Object, microsoft: Object, fake: Object}>} Harness.
 */
export async function createIdentityProviders() {
  const google = await makeSigner("g-k1");
  const microsoft = await makeSigner("m-k1", { issuer: "https://login.microsoftonline.com/{tenantid}/v2.0" });
  const fake = createFakeFetch({
    jwks: { [GOOGLE_JWKS]: { keys: [google.jwk] }, [MICROSOFT_JWKS]: { keys: [microsoft.jwk] } }
  });
  return { google, microsoft, fake };
}

/**
 * A fetch stand-in: serves JWKS documents by URL and records email sends.
 * @param {Object} [options] `{jwks: {url: {keys}}, emailStatus: number, emailThrows: boolean}`.
 * @returns {{fetchImpl: function, calls: Object[], emails: Object[], jwks: Object, setEmailStatus: function}} Fake.
 */
export function createFakeFetch(options) {
  const state = { emailStatus: 200, emailThrows: false, ...(options || {}) };
  const jwks = { ...(state.jwks || {}) };
  const calls = [];
  const emails = [];
  const fetchImpl = async (url, init) => {
    const href = String(url);
    calls.push({ url: href, init });
    if (jwks[href]) {
      return new Response(JSON.stringify(jwks[href]), { status: 200, headers: { "content-type": "application/json" } });
    }
    if (/api\.(resend|brevo|mailersend)\.com/.test(href)) {
      if (state.emailThrows) {
        throw new TypeError("network down");
      }
      emails.push({ url: href, init, body: JSON.parse(init.body) });
      return new Response("{}", { status: state.emailStatus });
    }
    return new Response("not found", { status: 404 });
  };
  return {
    fetchImpl,
    calls,
    emails,
    jwks,
    setEmailStatus(status) {
      state.emailStatus = status;
    },
    setEmailThrows(value) {
      state.emailThrows = value;
    }
  };
}

/**
 * A fresh, migrated env for HTTP-level tests.
 * @param {Object} [overrides] Env overrides.
 * @returns {Promise<{env: Object, ctx: Object}>} Env plus a direct-DB context at NOW.
 */
export async function createHarness(overrides) {
  resetSchemaMemo();
  const env = createEnv(overrides);
  if (env.DB) {
    await migrate(env.DB);
  }
  return { env, ctx: { env, db: env.DB, pepper: pepperBytes(env), now: NOW, log: () => {} } };
}

/**
 * Seed a signed-in account straight into D1 (no provider round trip).
 * @param {Object} env Worker env (migrated).
 * @param {{email?: string|null, verified?: boolean, identities?: Array<[string, string]>, method?: string,
 *          signedIn?: boolean, now?: number, sessionAt?: number}} [spec] Account spec.
 * @returns {Promise<{account: Object, token: string, session: Object}>} Account and cookie token.
 */
export async function seedAccount(env, spec = {}) {
  const { createAccount, linkIdentity } = await import("../src/accounts.mjs");
  const { createSession } = await import("../src/sessions.mjs");
  const now = spec.now === undefined ? NOW : spec.now;
  const ctx = { env, db: env.DB, now };
  const email = spec.email === undefined ? "learner@example.test" : spec.email;
  const verified = spec.verified !== false;
  const account = await createAccount(ctx, { email, emailNormalized: verified && email ? email.toLowerCase() : null, emailVerified: verified && Boolean(email) });
  const identities = spec.identities || (email && verified ? [["email", email.toLowerCase()]] : []);
  for (const [provider, subject] of identities) {
    await linkIdentity(ctx, { provider, subject, accountId: account.id, emailAtLink: email });
  }
  if (spec.signedIn !== false) {
    await env.DB.prepare("UPDATE accounts SET first_signin_at = ?2 WHERE id = ?1").bind(account.id, now).run();
  }
  const sessionAt = spec.sessionAt === undefined ? now : spec.sessionAt;
  const { token, session } = await createSession({ env, db: env.DB, now: sessionAt }, account.id, spec.method || "email");
  const fresh = await env.DB.prepare("SELECT * FROM accounts WHERE id = ?1").bind(account.id).first();
  return { account: fresh, token, session };
}

/**
 * Run one SQL statement with bound values (test setup).
 * @param {Object} env Worker env.
 * @param {string} sqlText SQL.
 * @param {...unknown} values Bound values.
 * @returns {Promise<Object>} D1 result.
 */
export function sql(env, sqlText, ...values) {
  return env.DB.prepare(sqlText).bind(...values).run();
}

/**
 * Count rows (test assertions).
 * @param {Object} env Worker env.
 * @param {string} where `FROM ... WHERE ...` clause.
 * @param {...unknown} values Bound values.
 * @returns {Promise<number>} Count.
 */
export async function count(env, where, ...values) {
  return Number(await env.DB.prepare(`SELECT COUNT(*) AS c ${where}`).bind(...values).first("c"));
}
