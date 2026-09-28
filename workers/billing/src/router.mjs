/**
 * Route table and request pipeline.
 *
 * Every request goes through the same stages, in this order, so no handler
 * can forget one:
 *   OPTIONS -> preflight (404 for unknown paths)
 *   match   -> 404 not_found | 405 method_not_allowed (+ Allow)
 *   CSRF    -> 403 bad_origin (state-changing, non-webhook)
 *   config  -> 503 db_not_configured | pepper_not_configured; then migrate()
 *   session -> 401 <reason> + cleared cookie (auth: "session"); renewal cookie
 *   access  -> admin / qa gates (gate.mjs): 429 | 403 forbidden | 401 reauth_required
 *   body    -> 413 body_too_large | 400 bad_json
 *   handler -> {status, body, setCookie?, headers?, audit?, audited?}
 *   audit   -> one audit_log row per admin request (gate.mjs)
 * Responses carry CORS for allowed origins (never for webhooks), no-store and
 * nosniff.
 */

import { handleEmailStart, handleEmailVerify } from "./auth-email.mjs";
import { handleGoogleSignIn, handleLinkGoogle, handleLinkMicrosoft, handleMicrosoftSignIn } from "./auth-oidc.mjs";
import { handleLogout } from "./auth-session.mjs";
import { pepperBytes } from "./crypto.mjs";
import { accessStage, auditAdminRequest } from "./gate.mjs";
import { handleCreateGrant, handleListGrants, handleRevokeGrant } from "./grants.mjs";
import {
  DEFAULT_BODY_CAP,
  callerIp,
  clearSessionCookie,
  corsHeaders,
  csrfFailure,
  isStateChanging,
  json,
  preflight,
  readCookie,
  readJsonBody,
  SESSION_COOKIE,
  sessionCookie
} from "./http.mjs";
import { handleGetMe } from "./me.mjs";
import { handleGrantRole, handleListRoles, handleRevokeRole } from "./roles.mjs";
import { handleStartTrial } from "./trial.mjs";
import { handleHealth, handleMethods, hasDb } from "./public.mjs";
import { migrate } from "./schema.mjs";
import { resolveSession } from "./sessions.mjs";

const DB_PEPPER = ["db", "pepper"];

/**
 * An admin route: session + admin gate + audit, db and pepper required.
 * @param {string} method HTTP method.
 * @param {string} path Path.
 * @param {function} handler Handler.
 * @param {string} audit Audit action name.
 * @returns {Object} Route.
 */
function adminRoute(method, path, handler, audit) {
  return { method, path, handler, needs: DB_PEPPER, auth: "session", access: "admin", audit };
}

/**
 * The route table. `auth`: "session" (required) | "optional" | undefined.
 * `needs`: config the route cannot run without. `bodyCap`: bytes.
 * `access`: "admin" | "qa" (gate.mjs). `audit`: the admin audit action name.
 */
export const ROUTES = [
  { method: "GET", path: "/v1/health", handler: handleHealth, needs: [] },
  { method: "GET", path: "/v1/auth/methods", handler: handleMethods, needs: [] },
  { method: "POST", path: "/v1/auth/email/start", handler: handleEmailStart, needs: DB_PEPPER },
  { method: "POST", path: "/v1/auth/email/verify", handler: handleEmailVerify, needs: DB_PEPPER, auth: "optional" },
  { method: "POST", path: "/v1/auth/google", handler: handleGoogleSignIn, needs: DB_PEPPER, auth: "optional" },
  { method: "POST", path: "/v1/auth/microsoft", handler: handleMicrosoftSignIn, needs: DB_PEPPER, auth: "optional" },
  { method: "POST", path: "/v1/auth/logout", handler: handleLogout, needs: ["db"], auth: "optional" },
  { method: "GET", path: "/v1/me", handler: handleGetMe, needs: ["db"], auth: "session" },
  { method: "POST", path: "/v1/me/trial", handler: handleStartTrial, needs: DB_PEPPER, auth: "session" },
  { method: "POST", path: "/v1/me/link/google", handler: handleLinkGoogle, needs: DB_PEPPER, auth: "session" },
  { method: "POST", path: "/v1/me/link/microsoft", handler: handleLinkMicrosoft, needs: DB_PEPPER, auth: "session" },
  adminRoute("POST", "/v1/admin/grants", handleCreateGrant, "admin.grants.create"),
  adminRoute("POST", "/v1/admin/grants/revoke", handleRevokeGrant, "admin.grants.revoke"),
  adminRoute("GET", "/v1/admin/grants", handleListGrants, "admin.grants.list"),
  adminRoute("POST", "/v1/admin/roles", handleGrantRole, "admin.roles.grant"),
  adminRoute("POST", "/v1/admin/roles/revoke", handleRevokeRole, "admin.roles.revoke"),
  adminRoute("GET", "/v1/admin/roles", handleListRoles, "admin.roles.list")
];

/**
 * decodeURIComponent that answers null on a malformed escape.
 * @param {string} segment Path segment.
 * @returns {string|null} Decoded text.
 */
function safeDecode(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

/**
 * Match a path pattern (":name" segments capture) against a pathname.
 * @param {string} pattern Route path.
 * @param {string} pathname Request path.
 * @returns {Object|null} Params, or null when it does not match.
 */
function matchPath(pattern, pathname) {
  const want = pattern.split("/");
  const got = pathname.split("/");
  if (want.length !== got.length) {
    return null;
  }
  const params = {};
  for (let i = 0; i < want.length; i += 1) {
    if (want[i].startsWith(":")) {
      const value = safeDecode(got[i]);
      if (value === null) {
        return null;
      }
      params[want[i].slice(1)] = value;
    } else if (want[i] !== got[i]) {
      return null;
    }
  }
  return params;
}

/**
 * Find the route for a method and path.
 * @param {Object[]} routes Route table.
 * @param {string} method HTTP method.
 * @param {string} pathname Request path.
 * @returns {{route: Object, params: Object}|{allow: string[]}|null} Match, 405 info, or null.
 */
export function matchRoute(routes, method, pathname) {
  const allow = [];
  for (const route of routes) {
    const params = matchPath(route.path, pathname);
    if (!params) {
      continue;
    }
    if (route.method === method) {
      return { route, params };
    }
    allow.push(route.method);
  }
  return allow.length ? { allow } : null;
}

/**
 * Epoch seconds from an injected clock (number or function) or the real one.
 * @param {number|function|undefined} now Injected clock.
 * @returns {number} Epoch seconds.
 */
function resolveNow(now) {
  if (typeof now === "function") {
    return Math.floor(now());
  }
  return Number.isFinite(now) ? Math.floor(now) : Math.floor(Date.now() / 1000);
}

/**
 * Build the JSON response for a handler or stage result.
 * @param {Object} ctx Request context.
 * @param {{status: number, body: Object, setCookie?: string, headers?: Object}} result Result.
 * @returns {Response} Response.
 */
function respond(ctx, result) {
  const headers = { ...(ctx.route && ctx.route.webhook ? {} : corsHeaders(ctx.request, ctx.env)), ...(result.headers || {}) };
  const cookie = result.setCookie || ctx.renewCookie;
  if (cookie) {
    headers["set-cookie"] = cookie;
  }
  return json(result.body, result.status, headers);
}

/**
 * CSRF stage.
 * @param {Object} ctx Context.
 * @returns {Object|null} Stop result or null.
 */
function csrfStage(ctx) {
  if (ctx.route.webhook) {
    return null;
  }
  const reason = csrfFailure(ctx.request, ctx.env);
  return reason ? { status: 403, body: { ok: false, reason } } : null;
}

const REQUIREMENTS = {
  db: (env) => (hasDb(env) ? null : "db_not_configured"),
  pepper: (env) => (pepperBytes(env) ? null : "pepper_not_configured")
};

/**
 * Fail-closed config stage; migrates the schema when the route uses D1.
 * @param {Object} ctx Context.
 * @returns {Promise<Object|null>} Stop result or null.
 */
async function configStage(ctx) {
  for (const need of ctx.route.needs) {
    const reason = REQUIREMENTS[need](ctx.env);
    if (reason) {
      return { status: 503, body: { ok: false, reason } };
    }
  }
  if (ctx.route.needs.includes("db")) {
    await migrate(ctx.db);
  }
  return null;
}

/**
 * Session stage: required routes stop on failure; optional ones continue.
 * @param {Object} ctx Context.
 * @returns {Promise<Object|null>} Stop result or null.
 */
async function sessionStage(ctx) {
  if (!ctx.route.auth) {
    return null;
  }
  const token = readCookie(ctx.request, SESSION_COOKIE);
  const resolved = token ? await resolveSession(ctx, token) : { ok: false, reason: "no_session" };
  if (resolved.ok) {
    ctx.account = resolved.account;
    ctx.session = resolved.session;
    ctx.renewCookie = resolved.renewedMaxAge ? sessionCookie(token, resolved.renewedMaxAge) : null;
    return null;
  }
  if (ctx.route.auth === "session") {
    return { status: 401, body: { ok: false, reason: resolved.reason }, setCookie: clearSessionCookie() };
  }
  return null;
}

/**
 * Body stage: state-changing requests get a capped JSON object body.
 * @param {Object} ctx Context.
 * @returns {Promise<Object|null>} Stop result or null.
 */
async function bodyStage(ctx) {
  if (!isStateChanging(ctx.request.method)) {
    ctx.body = {};
    return null;
  }
  const read = await readJsonBody(ctx.request, ctx.route.bodyCap || DEFAULT_BODY_CAP);
  if (!read.ok) {
    return { status: read.status, body: { ok: false, reason: read.reason } };
  }
  ctx.body = read.body;
  return null;
}

const STAGES = [csrfStage, configStage, sessionStage, accessStage, bodyStage];

/**
 * Run a matched route through the stages and its handler. Admin routes are
 * audited whatever the outcome once a session is known (gate.mjs).
 * @param {Object} ctx Context with `route` and `params`.
 * @returns {Promise<Response>} Response.
 */
async function runRoute(ctx) {
  let result = null;
  for (const stage of STAGES) {
    result = await stage(ctx);
    if (result) {
      break;
    }
  }
  result = result || (await ctx.route.handler(ctx));
  await auditAdminRequest(ctx, result);
  return respond(ctx, result);
}

/**
 * Route one request. Throws on unexpected errors (index.mjs catches).
 * @param {Request} request Incoming request.
 * @param {Object} env Worker env.
 * @param {{fetchImpl?: function, now?: number|function, log: function, routes?: Object[]}} opts
 *   Injectables; `routes` replaces the table (default ROUTES).
 * @returns {Promise<Response>} Response.
 */
export async function routeRequest(request, env, opts) {
  const url = new URL(request.url);
  const ctx = {
    request,
    env,
    url,
    now: resolveNow(opts.now),
    fetchImpl: opts.fetchImpl,
    log: opts.log,
    db: env.DB,
    pepper: pepperBytes(env),
    ip: callerIp(request),
    route: null,
    params: {},
    renewCookie: null
  };
  const match = matchRoute(opts.routes || ROUTES, request.method, url.pathname);
  if (!match) {
    return respond(ctx, { status: 404, body: { ok: false, reason: "not_found" } });
  }
  if (request.method === "OPTIONS") {
    return preflight(request, env);
  }
  if (match.allow) {
    return respond(ctx, { status: 405, body: { ok: false, reason: "method_not_allowed" }, headers: { allow: match.allow.join(", ") } });
  }
  ctx.route = match.route;
  ctx.params = match.params;
  return runRoute(ctx);
}
