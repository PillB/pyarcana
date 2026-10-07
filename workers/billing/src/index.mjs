/**
 * PyArcana accounts and billing worker (Cloudflare Workers, no dependencies).
 *
 * `handleRequest(request, env, {fetchImpl, now, log})` is the whole HTTP
 * surface; every external call (Google/Microsoft JWKS, HTTP email providers)
 * goes through `fetchImpl` and the clock through `now`, so tests inject both.
 * Bindings (DB, ASSETS, the send_email binding EMAIL) come from `env`, so
 * tests inject fakes there.
 *
 * Nothing here logs a secret, a token, a code, an email or a raw body: an
 * unexpected error logs its message only and answers 500 WITH CORS headers,
 * so the browser can read the reason instead of seeing an opaque CORS error.
 *
 * One origin (DESIGN-v3 §A): the same worker serves the static site through
 * the Workers Static Assets binding ASSETS. API paths (/api, /api/*, /v1,
 * /v1/*) are always the worker's, 404 included; any other path goes to
 * ASSETS when the binding exists, else it is the worker's JSON 404.
 */

import { corsHeaders, json } from "./http.mjs";
import { API_PREFIX, routeRequest } from "./router.mjs";
import { runScheduled } from "./retention.mjs";

/**
 * Default logger (Workers observability collects console output).
 * @param {string} line Log line.
 * @returns {void}
 */
function defaultLog(line) {
  console.log(line);
}

/** Path roots the worker always answers itself. */
const API_ROOTS = [API_PREFIX, "/v1"];

/**
 * True for a path the API owns: an API root itself or anything below it.
 * @param {string} pathname Request path.
 * @returns {boolean} API path.
 */
export function isApiPath(pathname) {
  return API_ROOTS.some((root) => pathname === root || pathname.startsWith(`${root}/`));
}

/**
 * The static-assets fetcher, when the binding is usable.
 * @param {Object} env Worker env.
 * @returns {Object|null} ASSETS binding or null.
 */
function assetsBinding(env) {
  return env.ASSETS && typeof env.ASSETS.fetch === "function" ? env.ASSETS : null;
}

/**
 * Handle one HTTP request.
 * @param {Request} request Incoming request.
 * @param {Object} env Worker env.
 * @param {{fetchImpl?: function, now?: number|function, log?: function, providers?: Object}} [opts] Injectables.
 * @returns {Promise<Response>} Response.
 */
export async function handleRequest(request, env, opts = {}) {
  const safeEnv = env || {};
  const log = opts.log || defaultLog;
  try {
    const assets = assetsBinding(safeEnv);
    if (assets && !isApiPath(new URL(request.url).pathname)) {
      return await assets.fetch(request);
    }
    return await routeRequest(request, safeEnv, { ...opts, log });
  } catch (error) {
    log(`unhandled error: ${error && error.message ? error.message : "unknown"}`);
    return json({ ok: false, reason: "internal_error" }, 500, corsHeaders(request, safeEnv));
  }
}

const worker = {
  /**
   * Workers fetch entry.
   * @param {Request} request Incoming request.
   * @param {Object} env Worker env.
   * @returns {Promise<Response>} Response.
   */
  fetch(request, env) {
    return handleRequest(request, env);
  },

  /**
   * Workers cron entry.
   * @param {{cron: string, scheduledTime: number}} event Cron event.
   * @param {Object} env Worker env.
   * @param {{waitUntil: function}} ctx Execution context.
   * @returns {void}
   */
  scheduled(event, env, ctx) {
    ctx.waitUntil(
      runScheduled(env, { cron: event.cron, now: Math.floor(event.scheduledTime / 1000), log: defaultLog }).catch((error) => {
        defaultLog(`scheduled error: ${error && error.message ? error.message : "unknown"}`);
      })
    );
  }
};

export default worker;
