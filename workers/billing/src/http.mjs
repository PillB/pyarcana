/**
 * HTTP plumbing: JSON responses, CORS, the CSRF rule, body caps and the
 * session cookie.
 *
 * - CORS echoes an origin only when it is exactly in ALLOWED_ORIGINS, always
 *   with credentials and `Vary: Origin` (DESIGN-v2 §1).
 * - CSRF: every state-changing, non-webhook request must carry
 *   `X-PyArcana: 1` (which forces a CORS preflight) and an allowed `Origin`;
 *   otherwise 403 `bad_origin`. SameSite=Lax is defence in depth.
 * - Bodies are read as a stream and cut off at the cap, so a request without
 *   a Content-Length cannot make the worker buffer an arbitrary payload.
 */

/** Default body cap for account routes (64 KiB). */
export const DEFAULT_BODY_CAP = 64 * 1024;

/** The session cookie. `__Host-` forbids Domain and requires Secure + Path=/. */
export const SESSION_COOKIE = "__Host-pa_session";

const STATE_CHANGING = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const ALLOW_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const ALLOW_HEADERS = "content-type, x-pyarcana";
const PREFLIGHT_MAX_AGE = "600";

/**
 * True when `value` is a bare http(s) origin in canonical form.
 * @param {string} value Candidate origin.
 * @returns {boolean} Whether it is usable as an exact CORS origin.
 */
function isBareOrigin(value) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.origin === value;
  } catch {
    return false;
  }
}

/**
 * The configured origins, keeping only exact bare origins.
 * @param {Object} env Worker env.
 * @returns {string[]} Origins.
 */
export function allowedOrigins(env) {
  const raw = env && typeof env.ALLOWED_ORIGINS === "string" ? env.ALLOWED_ORIGINS : "";
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(isBareOrigin);
}

/**
 * True when the request's Origin header is exactly an allowed origin.
 * @param {Request} request Incoming request.
 * @param {Object} env Worker env.
 * @returns {boolean} Allowed.
 */
export function hasAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  return Boolean(origin) && allowedOrigins(env).includes(origin);
}

/**
 * CORS headers for a response to this request.
 * @param {Request} request Incoming request.
 * @param {Object} env Worker env.
 * @returns {Object} Header map (always carries Vary: Origin).
 */
export function corsHeaders(request, env) {
  if (!hasAllowedOrigin(request, env)) {
    return { vary: "Origin" };
  }
  return {
    vary: "Origin",
    "access-control-allow-origin": request.headers.get("Origin"),
    "access-control-allow-credentials": "true"
  };
}

/**
 * JSON response with no-store and nosniff.
 * @param {unknown} body Serializable body.
 * @param {number} status HTTP status.
 * @param {Object|Headers} [headers] Extra headers.
 * @returns {Response} Response.
 */
export function json(body, status, headers) {
  const out = new Headers(headers || {});
  out.set("content-type", "application/json; charset=utf-8");
  out.set("cache-control", "no-store");
  out.set("x-content-type-options", "nosniff");
  return new Response(JSON.stringify(body), { status, headers: out });
}

/**
 * Answer a CORS preflight.
 * @param {Request} request OPTIONS request.
 * @param {Object} env Worker env.
 * @returns {Response} 204 for an allowed origin, 403 otherwise.
 */
export function preflight(request, env) {
  if (!hasAllowedOrigin(request, env)) {
    return json({ ok: false, reason: "bad_origin" }, 403, { vary: "Origin" });
  }
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(request, env),
      "access-control-allow-methods": ALLOW_METHODS,
      "access-control-allow-headers": ALLOW_HEADERS,
      "access-control-max-age": PREFLIGHT_MAX_AGE
    }
  });
}

/**
 * True for methods that change state.
 * @param {string} method HTTP method.
 * @returns {boolean} State-changing.
 */
export function isStateChanging(method) {
  return STATE_CHANGING.has(String(method).toUpperCase());
}

/**
 * The CSRF rule for non-webhook routes.
 * @param {Request} request Incoming request.
 * @param {Object} env Worker env.
 * @returns {string|null} "bad_origin", or null when the request passes.
 */
export function csrfFailure(request, env) {
  if (!isStateChanging(request.method)) {
    return null;
  }
  if (request.headers.get("X-PyArcana") !== "1" || !hasAllowedOrigin(request, env)) {
    return "bad_origin";
  }
  return null;
}

/**
 * Read the body as bytes, stopping as soon as it passes the cap.
 * @param {Request} request Incoming request.
 * @param {number} cap Maximum bytes.
 * @returns {Promise<{ok: true, bytes: Uint8Array}|{ok: false, status: number, reason: string}>} Result.
 */
export async function readBodyBytes(request, cap) {
  const tooLarge = { ok: false, status: 413, reason: "body_too_large" };
  const declared = Number.parseInt(request.headers.get("content-length") || "", 10);
  if (Number.isFinite(declared) && declared > cap) {
    return tooLarge;
  }
  if (!request.body) {
    return { ok: true, bytes: new Uint8Array(0) };
  }
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    total += value.byteLength;
    if (total > cap) {
      await reader.cancel().catch(() => {});
      return tooLarge;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, bytes };
}

/**
 * Parse text as a JSON object.
 * @param {string} text JSON text.
 * @returns {Object|null} Object, or null when not a JSON object.
 */
function parseObject(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Read a JSON object body under a cap. An empty body reads as {}.
 * @param {Request} request Incoming request.
 * @param {number} cap Maximum bytes.
 * @returns {Promise<{ok: true, body: Object}|{ok: false, status: number, reason: string}>} Result.
 */
export async function readJsonBody(request, cap) {
  const read = await readBodyBytes(request, cap);
  if (!read.ok) {
    return read;
  }
  if (!read.bytes.byteLength) {
    return { ok: true, body: {} };
  }
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(read.bytes);
  } catch {
    return { ok: false, status: 400, reason: "bad_json" };
  }
  const body = parseObject(text);
  return body ? { ok: true, body } : { ok: false, status: 400, reason: "bad_json" };
}

/**
 * Set-Cookie value for a session.
 * @param {string} token Session token.
 * @param {number} maxAgeSeconds Lifetime.
 * @returns {string} Cookie header value.
 */
export function sessionCookie(token, maxAgeSeconds) {
  const maxAge = Math.max(0, Math.floor(maxAgeSeconds));
  return `${SESSION_COOKIE}=${token}; Max-Age=${maxAge}; Path=/; Secure; HttpOnly; SameSite=Lax`;
}

/**
 * Set-Cookie value that removes the session cookie.
 * @returns {string} Cookie header value.
 */
export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax`;
}

/**
 * Read one cookie by exact name.
 * @param {Request} request Incoming request.
 * @param {string} name Cookie name.
 * @returns {string|null} Value, or null.
 */
export function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index > 0 && part.slice(0, index).trim() === name) {
      return part.slice(index + 1).trim();
    }
  }
  return null;
}

/**
 * The caller's IP as Cloudflare reports it (not spoofable like X-Forwarded-For).
 * @param {Request} request Incoming request.
 * @returns {string} IP, or "unknown".
 */
export function callerIp(request) {
  return request.headers.get("cf-connecting-ip") || "unknown";
}

const HEX_GROUP = /^[0-9a-f]{1,4}$/;
const MAPPED_V4 = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/;

/**
 * The eight 16-bit groups of an IPv6 address (at most one "::"), or null.
 * @param {string} text Lowercase address without a zone.
 * @returns {string[]|null} Groups without leading zeros.
 */
function ipv6Groups(text) {
  const halves = text.split("::");
  if (halves.length > 2) {
    return null;
  }
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const missing = 8 - left.length - right.length;
  const fits = halves.length === 2 ? missing >= 1 : missing === 0;
  const groups = left.concat(Array(Math.max(missing, 0)).fill("0"), right);
  if (!fits || !groups.every((g) => HEX_GROUP.test(g))) {
    return null;
  }
  return groups.map((g) => String(Number.parseInt(g, 16).toString(16)));
}

/**
 * The network a rate limit should count an address against (review round
 * 1): an IPv4 address is its own network; an IPv6 address counts as its /64,
 * the smallest block one host is normally given, so rotating through the
 * 2^64 addresses of one /64 does not buy new buckets. An IPv4-mapped IPv6
 * address counts as its IPv4 address. Anything unparsable is keyed as-is
 * ("raw:" + text), never merged into a real network.
 * @param {string} ip callerIp output.
 * @returns {string} Network key.
 */
export function networkKey(ip) {
  const text = String(ip || "").trim().toLowerCase().split("%")[0];
  if (!text || text === "unknown") {
    return "unknown";
  }
  if (!text.includes(":")) {
    return text;
  }
  const mapped = MAPPED_V4.exec(text);
  if (mapped) {
    return mapped[1];
  }
  const groups = ipv6Groups(text);
  return groups ? `${groups.slice(0, 4).join(":")}::/64` : `raw:${String(ip).trim()}`;
}
