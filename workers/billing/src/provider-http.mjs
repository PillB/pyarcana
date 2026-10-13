/**
 * One outbound call to a payment provider: a JSON request with a timeout,
 * through the injectable `ctx.fetchImpl`.
 *
 * It never throws: a network error, a timeout, a non-2xx status or a body
 * that is not a JSON object all come back as `{ok: false, status}`, so every
 * caller fails closed on one shape. It never logs: callers log the provider
 * name and the HTTP status only, never a URL with an id, a header or a body
 * (tokens, emails).
 */

/** Per-call timeout (the relayed Vocal ops rule: a timeout on every outbound call). */
export const PROVIDER_TIMEOUT_MS = 8000;

/**
 * Read a response body as a JSON object, or null.
 * @param {Response} response Response.
 * @returns {Promise<Object|null>} Object.
 */
async function jsonObject(response) {
  try {
    const body = await response.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

/**
 * Call a provider API.
 * @param {{fetchImpl?: function}} ctx Context.
 * @param {string} url Absolute URL.
 * @param {{method: string, headers: Object, body?: Object}} init Request.
 * @returns {Promise<{ok: boolean, status: number, body: Object|null}>} Result.
 */
export async function providerFetch(ctx, url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("provider call timed out")), PROVIDER_TIMEOUT_MS);
  try {
    const headers = { accept: "application/json", ...init.headers };
    const request = { method: init.method, headers, signal: controller.signal };
    if (init.body !== undefined) {
      headers["content-type"] = "application/json";
      request.body = JSON.stringify(init.body);
    }
    const response = await (ctx.fetchImpl || fetch)(url, request);
    const body = await jsonObject(response);
    return { ok: response.ok && body !== null, status: response.status, body };
  } catch {
    return { ok: false, status: 0, body: null };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Epoch seconds from an ISO-8601 string, or null.
 * @param {unknown} value ISO string.
 * @returns {number|null} Seconds.
 */
export function isoSeconds(value) {
  if (typeof value !== "string" || !value) {
    return null;
  }
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
}

/**
 * Epoch seconds from a provider epoch number that may be seconds or
 * milliseconds (Creem's samples use milliseconds), or null.
 * @param {unknown} value Number.
 * @returns {number|null} Seconds.
 */
export function epochSeconds(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value > 1e11 ? Math.floor(value / 1000) : Math.floor(value);
}

/**
 * The id of a provider field that is either an id string or an expanded
 * object with an `id` (Creem's product, customer, subscription), or null.
 * @param {unknown} value String or object.
 * @returns {string|null} Id.
 */
export function refId(value) {
  if (typeof value === "string" && value) {
    return value;
  }
  if (typeof value === "number" && Number.isSafeInteger(value)) {
    return String(value);
  }
  return value && typeof value === "object" && (typeof value.id === "string" || typeof value.id === "number") ? String(value.id) : null;
}
