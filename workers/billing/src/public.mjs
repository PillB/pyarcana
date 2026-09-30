/**
 * Public, unauthenticated routes: GET /v1/health, GET /v1/auth/methods and
 * GET /v1/geo. Health answers booleans only (plus the public origin list):
 * never a secret, never a count, never an email. Geo answers the country
 * only.
 */

import { listVar, stringVar, termsVersion, trialDays } from "./config.mjs";
import { pepperBytes } from "./crypto.mjs";
import { emailConfigured } from "./email.mjs";
import { allowedOrigins } from "./http.mjs";

/**
 * True when the D1 binding looks usable.
 * @param {Object} env Worker env.
 * @returns {boolean} Present.
 */
export function hasDb(env) {
  return Boolean(env && env.DB && typeof env.DB.prepare === "function");
}

/**
 * True when D1 answers a trivial query.
 * @param {Object} env Worker env.
 * @returns {Promise<boolean>} Reachable.
 */
async function dbReachable(env) {
  if (!hasDb(env)) {
    return false;
  }
  try {
    return (await env.DB.prepare("SELECT 1 AS ok").first("ok")) === 1;
  } catch {
    return false;
  }
}

/**
 * True when every named var is non-empty.
 * @param {Object} env Worker env.
 * @param {string[]} names Var names.
 * @returns {boolean} All set.
 */
function allSet(env, names) {
  return names.every((name) => stringVar(env, name) !== "");
}

/**
 * GET /v1/health.
 * @param {Object} ctx Context.
 * @returns {Promise<Object>} Result.
 */
export async function handleHealth(ctx) {
  const env = ctx.env;
  return {
    status: 200,
    body: {
      ok: true,
      db: await dbReachable(env),
      pepper: pepperBytes(env) !== null,
      terms: termsVersion(env) !== "",
      email: emailConfigured(env),
      google: listVar(env, "GOOGLE_CLIENT_ID").length > 0,
      microsoft: listVar(env, "MICROSOFT_CLIENT_ID").length > 0,
      mercadopago: allSet(env, ["MP_ACCESS_TOKEN", "MP_WEBHOOK_SECRET"]),
      creem: allSet(env, ["CREEM_API_KEY", "CREEM_WEBHOOK_SECRET", "CREEM_PRODUCT_PRO_MONTHLY", "CREEM_PRODUCT_PRO_YEARLY"]),
      origins: allowedOrigins(env)
    }
  };
}

/**
 * GET /v1/auth/methods: what the sign-in panel can offer.
 * @param {Object} ctx Context.
 * @returns {Object} Result.
 */
export function handleMethods(ctx) {
  const env = ctx.env;
  // A method is offered only when a sign-in with it could succeed.
  const ready = hasDb(env) && pepperBytes(env) !== null && termsVersion(env) !== "";
  const googleIds = listVar(env, "GOOGLE_CLIENT_ID");
  const microsoftIds = listVar(env, "MICROSOFT_CLIENT_ID");
  return {
    status: 200,
    body: {
      ok: true,
      email: ready && emailConfigured(env),
      google: ready && googleIds.length > 0,
      googleClientId: googleIds[0] || null,
      microsoft: ready && microsoftIds.length > 0,
      microsoftClientId: microsoftIds[0] || null,
      trialDays: trialDays(env)
    }
  };
}

/**
 * An ISO 3166-1 alpha-2 country as Cloudflare writes it. XX (unknown) and T1
 * (Tor) match the shape but are not places, so they are refused below.
 */
const COUNTRY_RE = /^[A-Z]{2}$/;
const NOT_A_COUNTRY = new Set(["XX", "T1"]);

/**
 * GET /v1/geo: the caller's country from Cloudflare's request.cf, for the ads
 * region check (DESIGN-v3 §E). Only the two letters leave the worker; any
 * other cf field (city, coordinates, ASN) never does. Anything that is not a
 * real country is null, and the client then shows house ads (fail closed).
 * @param {Object} ctx Context.
 * @returns {Object} Result.
 */
export function handleGeo(ctx) {
  return { status: 200, body: { ok: true, country: requestCountry(ctx.request) } };
}

/**
 * The caller's real country from Cloudflare's request.cf, or null (none,
 * junk, XX unknown, T1 Tor). Used by /v1/geo and the checkout rail check.
 * @param {Request} request Incoming request.
 * @returns {string|null} ISO 3166-1 alpha-2 country.
 */
export function requestCountry(request) {
  const cf = request && request.cf;
  const raw = cf && typeof cf.country === "string" ? cf.country : "";
  return COUNTRY_RE.test(raw) && !NOT_A_COUNTRY.has(raw) ? raw : null;
}
