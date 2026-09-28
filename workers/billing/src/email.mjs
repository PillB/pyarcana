/**
 * Transactional email for sign-in codes. One authenticated JSON POST per
 * provider, so no SDK.
 *
 *   EMAIL_PROVIDER=resend     + RESEND_API_KEY
 *   EMAIL_PROVIDER=brevo      + BREVO_API_KEY
 *   EMAIL_PROVIDER=mailersend + MAILERSEND_API_KEY
 *   EMAIL_PROVIDER=dev-log    (local E2E only; refused unless EVERY allowed
 *                              origin is http://localhost[:port])
 *
 * The declared provider is used strictly: a key for a different provider is
 * not a silent fallback. A global daily cap (EMAIL_DAILY_CAP) keeps the worker
 * under the provider's free quota and answers an honest `email_unavailable`.
 * Any provider failure (429, 5xx, 4xx, transport) is `email_unavailable`.
 *
 * Logs name the provider and the HTTP status only: never the address, the
 * code or a response body. dev-log is the one exception, by design: it prints
 * the code so a local end-to-end run can read it, and the origin guard keeps
 * it off every deployment that serves a real origin.
 */

import { allowedOrigins } from "./http.mjs";
import { emailDailyCap, isLocalhostOrigin, stringVar } from "./config.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

const API_KEYS = { resend: "RESEND_API_KEY", brevo: "BREVO_API_KEY", mailersend: "MAILERSEND_API_KEY" };

/**
 * dev-log is allowed only when every allowed origin is local.
 * @param {Object} env Worker env.
 * @returns {boolean} Allowed.
 */
function devLogAllowed(env) {
  const origins = allowedOrigins(env);
  const declared = stringVar(env, "ALLOWED_ORIGINS")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return origins.length > 0 && declared.length === origins.length && origins.every(isLocalhostOrigin);
}

/**
 * Resolve the provider and its credentials.
 * @param {Object} env Worker env.
 * @returns {{provider: string|null, apiKey?: string, from?: string, fromName?: string, reason?: string}} Config.
 */
export function resolveEmailConfig(env) {
  const provider = stringVar(env, "EMAIL_PROVIDER").toLowerCase();
  if (provider === "dev-log") {
    return devLogAllowed(env) ? { provider } : { provider: null, reason: "dev_log_refused" };
  }
  const keyName = API_KEYS[provider];
  const apiKey = keyName ? stringVar(env, keyName) : "";
  const from = stringVar(env, "EMAIL_FROM");
  if (!apiKey || !from) {
    return { provider: null, reason: "email_not_configured" };
  }
  return { provider, apiKey, from, fromName: stringVar(env, "EMAIL_FROM_NAME") || "PyArcana" };
}

/**
 * True when email sign-in can deliver.
 * @param {Object} env Worker env.
 * @returns {boolean} Configured.
 */
export function emailConfigured(env) {
  return resolveEmailConfig(env).provider !== null;
}

/**
 * Spanish plain-text and minimal HTML bodies. No links, images or pixels.
 * @param {string} code Six digits.
 * @param {number} minutes Validity.
 * @returns {{subject: string, text: string, html: string}} Message.
 */
export function buildLoginCodeMessage(code, minutes) {
  const digits = String(code).replace(/\D/g, "");
  return {
    subject: `${digits} — PyArcana`,
    text: [
      `Tu código para entrar a PyArcana es: ${digits}`,
      "",
      `Vence en ${minutes} minutos y sirve una sola vez.`,
      "Si no lo pediste, ignora este correo: nadie puede entrar sin el código."
    ].join("\n"),
    html: [
      '<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#1a1a1a">',
      "<p>Tu código para entrar a PyArcana es:</p>",
      `<p style="font-size:30px;font-weight:700;letter-spacing:6px;margin:20px 0">${digits}</p>`,
      `<p>Vence en ${minutes} minutos y sirve una sola vez.</p>`,
      "<p>Si no lo pediste, ignora este correo: nadie puede entrar sin el código.</p>",
      "</div>"
    ].join("")
  };
}

/**
 * Remove header syntax from a display name.
 * @param {string} name Display name.
 * @returns {string} Safe name.
 */
function safeName(name) {
  return String(name || "").replace(/[\r\n"<>,;\\]/g, "").trim().slice(0, 60);
}

const REQUEST_BUILDERS = {
  resend: (config, message) => ({
    url: "https://api.resend.com/emails",
    headers: { authorization: `Bearer ${config.apiKey}` },
    body: {
      from: config.fromName ? `${safeName(config.fromName)} <${config.from}>` : config.from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html
    }
  }),
  brevo: (config, message) => ({
    url: "https://api.brevo.com/v3/smtp/email",
    headers: { "api-key": config.apiKey, accept: "application/json" },
    body: {
      sender: { email: config.from, name: safeName(config.fromName) || undefined },
      to: [{ email: message.to }],
      subject: message.subject,
      textContent: message.text,
      htmlContent: message.html
    }
  }),
  mailersend: (config, message) => ({
    url: "https://api.mailersend.com/v1/email",
    headers: { authorization: `Bearer ${config.apiKey}` },
    body: {
      from: { email: config.from, name: safeName(config.fromName) || undefined },
      to: [{ email: message.to }],
      subject: message.subject,
      text: message.text,
      html: message.html
    }
  })
};

/**
 * Build the provider-specific fetch arguments.
 * @param {string} provider Provider id.
 * @param {{apiKey: string, from: string, fromName: string}} config Credentials.
 * @param {{to: string, subject: string, text: string, html: string}} message Message.
 * @returns {{url: string, init: Object}} Fetch arguments.
 */
export function buildSendRequest(provider, config, message) {
  const build = REQUEST_BUILDERS[provider];
  if (!build) {
    throw new Error("unsupported email provider");
  }
  const { url, headers, body } = build(config, message);
  return {
    url,
    init: { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify(body) }
  };
}

/**
 * POST to the provider; any failure is `email_unavailable`.
 * @param {Object} ctx Request context (`fetchImpl`, `log`).
 * @param {Object} config Resolved config.
 * @param {Object} message Message with `to`.
 * @returns {Promise<{ok: boolean, reason?: string}>} Result.
 */
async function deliver(ctx, config, message) {
  const { url, init } = buildSendRequest(config.provider, config, message);
  let status = 0;
  try {
    const response = await (ctx.fetchImpl || fetch)(url, init);
    status = response.status;
  } catch {
    status = 0;
  }
  if (status >= 200 && status < 300) {
    return { ok: true };
  }
  ctx.log(`email send failed provider=${config.provider} status=${status || "transport_error"}`);
  return { ok: false, reason: "email_unavailable" };
}

/**
 * Send a sign-in code, spending one unit of the global daily cap.
 * @param {{env: Object, db: Object, pepper: Uint8Array, now: number, fetchImpl?: function, log: function}} ctx Context.
 * @param {string} to Recipient (normalized).
 * @param {string} code Six digits.
 * @param {number} minutes Validity in minutes.
 * @returns {Promise<{ok: boolean, reason?: string}>} Result.
 */
export async function sendLoginCode(ctx, to, code, minutes) {
  const config = resolveEmailConfig(ctx.env);
  if (!config.provider) {
    return { ok: false, reason: "email_not_configured" };
  }
  const cap = await hitRateLimit(ctx, "email:global", emailDailyCap(ctx.env), 86400);
  if (!cap.ok) {
    ctx.log("email daily cap reached");
    return { ok: false, reason: "email_unavailable" };
  }
  const message = { to, ...buildLoginCodeMessage(code, minutes) };
  if (config.provider === "dev-log") {
    ctx.log(`[dev-log] to=${to} subject=${message.subject}`);
    return { ok: true };
  }
  return deliver(ctx, config, message);
}
