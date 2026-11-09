#!/usr/bin/env node
/**
 * Helpers for the operator scripts (setup.sh, deploy.sh): reading ids out of wrangler's output,
 * editing the LOCAL wrangler.toml, the placeholder guard, ADMIN_EMAILS validation, and the two
 * generated secrets. Node 20+, no dependencies.
 *
 *   node ops.mjs d1-id-from-list <name>      < `wrangler d1 list --json` output   -> uuid or ""
 *   node ops.mjs d1-id-from-create           < `wrangler d1 create` output        -> uuid or ""
 *   node ops.mjs secret-names                < `wrangler secret list` output      -> names, one per line (exit 3: unreadable)
 *   node ops.mjs toml-get <file> <section> <key>
 *   node ops.mjs toml-set <file> <section> <key> <value>
 *   node ops.mjs placeholders <file>         -> each TODO_ value, one per line (exit 1 when any)
 *   node ops.mjs admin-emails                < one line typed by the owner      -> normalised list (exit 1: invalid)
 *   node ops.mjs kid-ok <kid>                -> exit 0 when the key id is well formed
 *   node ops.mjs pepper                      -> 32 random bytes, base64, on stdout (for a pipe into `wrangler secret put`)
 *   node ops.mjs licence-key <kid> <jwkFile> -> base64 PKCS#8 on stdout (for a pipe), public JWK written to <jwkFile>
 *   node ops.mjs token-check                 -> asks Cloudflare whether $CLOUDFLARE_API_TOKEN is active
 *                                               (exit 0 active, 1 refused, 2 Cloudflare unreachable)
 *
 * The generated secrets are written to stdout only so the calling script can pipe them straight
 * into `wrangler secret put`; the scripts never let them reach a terminal or a file.
 *
 * Wrangler output shapes: see tests/wrangler-fake.mjs (wrangler 4.144.0). Banners, ANSI colour
 * and a `▲ [WARNING]` line (which contains a literal "[") can precede the JSON on the same stream.
 */

import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { generateLicenceKeys } from "./generate-keys.mjs";

const ANSI_RE = /\u001b\[[0-9;]*m/g;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SAFE_VALUE_RE = /^[A-Za-z0-9_.-]{1,128}$/;
const KID_RE = /^[A-Za-z0-9_.-]{1,64}$/;
const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;
const MAX_ADMINS = 20;

/**
 * Try every closing bracket after `start`, longest first, and return the first slice that
 * parses into the wanted shape.
 * @param {string} s Text without ANSI.
 * @param {number} start Index of an opening bracket.
 * @param {string} want "array" or "object".
 * @returns {*} Parsed value, or undefined.
 */
function parseFrom(s, start, want) {
  const close = want === "array" ? "]" : "}";
  for (let end = s.lastIndexOf(close); end > start; end = s.lastIndexOf(close, end - 1)) {
    try {
      const value = JSON.parse(s.slice(start, end + 1));
      if (want === "array" ? Array.isArray(value) : value !== null && typeof value === "object" && !Array.isArray(value)) {
        return value;
      }
    } catch {
      // not this slice; keep trying
    }
  }
  return undefined;
}

/**
 * The first JSON array (or object) in wrangler's output.
 * @param {string} text Raw output.
 * @param {"array"|"object"} want Shape.
 * @returns {*} Value, or null when none parses.
 */
export function extractJson(text, want) {
  const s = String(text).replace(ANSI_RE, "");
  const open = want === "array" ? "[" : "{";
  for (let i = s.indexOf(open); i !== -1; i = s.indexOf(open, i + 1)) {
    const value = parseFrom(s, i, want);
    if (value !== undefined) {
      return value;
    }
  }
  return null;
}

/**
 * The uuid of the D1 database with exactly this name, from `wrangler d1 list --json`.
 * @param {string} text Output.
 * @param {string} name Database name.
 * @returns {string} UUID or "".
 */
export function d1IdFromList(text, name) {
  const list = extractJson(text, "array") || [];
  const db = list.find((d) => d && d.name === name);
  return db && UUID_RE.test(String(db.uuid)) ? db.uuid : "";
}

/**
 * The database_id from the TOML snippet `wrangler d1 create` prints.
 * @param {string} text Output.
 * @returns {string} UUID or "".
 */
export function d1IdFromCreate(text) {
  const m = /^\s*database_id\s*=\s*"([^"]*)"/m.exec(String(text).replace(ANSI_RE, ""));
  return m && UUID_RE.test(m[1]) ? m[1] : "";
}

/**
 * Secret names from `wrangler secret list` (JSON format, the default).
 * @param {string} text Output.
 * @returns {string[]|null} Names, or null when the output is not a list.
 */
export function secretNames(text) {
  const list = extractJson(text, "array");
  if (!list) {
    return null;
  }
  return list.filter((s) => s && typeof s.name === "string").map((s) => s.name);
}

/**
 * The [line from, line to) range of a section: `[name]` or `[[name]]` (the first one).
 * @param {string[]} lines File lines.
 * @param {string} section Section name.
 * @returns {{from: number, to: number}|null} Range, or null.
 */
function sectionRange(lines, section) {
  const header = (line) => /^\s*\[+([^\]]+)\]+\s*(#.*)?$/.exec(line);
  const from = lines.findIndex((line) => {
    const h = header(line);
    return h && h[1].trim() === section;
  });
  if (from === -1) {
    return null;
  }
  const next = lines.findIndex((line, i) => i > from && header(line));
  return { from: from + 1, to: next === -1 ? lines.length : next };
}

/**
 * Index of `key = "..."` inside a section, or -1.
 * @param {string[]} lines File lines.
 * @param {string} section Section.
 * @param {string} key Key.
 * @returns {number} Line index.
 */
function keyLine(lines, section, key) {
  const range = sectionRange(lines, section);
  if (!range) {
    return -1;
  }
  const re = new RegExp(`^\\s*${key}\\s*=\\s*"[^"]*"`);
  for (let i = range.from; i < range.to; i += 1) {
    if (re.test(lines[i])) {
      return i;
    }
  }
  return -1;
}

/**
 * Read a basic-string value from a section.
 * @param {string} toml File text.
 * @param {string} section Section.
 * @param {string} key Key.
 * @returns {string|null} Value, or null when absent.
 */
export function tomlValue(toml, section, key) {
  const lines = toml.split("\n");
  const i = keyLine(lines, section, key);
  return i === -1 ? null : /"([^"]*)"/.exec(lines[i])[1];
}

/**
 * Replace one key's value inside its own section, leaving every other byte as it was.
 * @param {string} toml File text.
 * @param {string} section Section.
 * @param {string} key Key.
 * @param {string} value New value (ids only: letters, digits, _ . -).
 * @returns {string} New text.
 */
export function setTomlValue(toml, section, key, value) {
  if (!SAFE_VALUE_RE.test(value)) {
    throw new Error(`refusing to write that value for ${key}: ids only (A-Z a-z 0-9 _ . -)`);
  }
  const lines = toml.split("\n");
  const i = keyLine(lines, section, key);
  if (i === -1) {
    throw new Error(`${key} not found in [${section}]`);
  }
  lines[i] = lines[i].replace(/"[^"]*"/, `"${value}"`);
  return lines.join("\n");
}

/**
 * Every TODO_ placeholder outside comment lines.
 * @param {string} toml File text.
 * @returns {string[]} Placeholders in file order.
 */
export function placeholders(toml) {
  return toml
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .flatMap((line) => line.match(/TODO_[A-Za-z0-9_]*/g) || []);
}

/**
 * Validate and normalise the owner's ADMIN_EMAILS line.
 * @param {string} input Comma-separated addresses.
 * @returns {string} Lower-case, de-duplicated, comma-joined.
 */
export function parseAdminEmails(input) {
  const parts = String(input).trim().split(",").map((p) => p.trim().toLowerCase());
  if (parts.some((p) => !EMAIL_RE.test(p))) {
    throw new Error("ADMIN_EMAILS must be one or more email addresses separated by commas");
  }
  const unique = [...new Set(parts)];
  if (unique.length > MAX_ADMINS) {
    throw new Error(`ADMIN_EMAILS takes at most ${MAX_ADMINS} addresses`);
  }
  return unique.join(",");
}

// --- the interim holder of the data bank (round of 19 Oct 2026, item 3; S7) --------------------
// The holder's identity lives in a file on the owner's computer, never in the repository: the repo
// is public, and a name or address committed once stays in history, forks and code search.
// File: KEY=VALUE lines, NAME and ADDRESS required together, RUC optional (11 digits); # comments.
const HOLDER_KEYS = new Set(["NAME", "ADDRESS", "RUC"]);
const RUC_RE = /^(10|15|17|20)\d{9}$/;
/** In the account notice only while sign-up is closed (AccountEditionPrivacy.tsx). */
export const CLOSED_PHRASE = "no abrimos cuentas nuevas";

/**
 * Parse the holder file.
 * @param {string} text File contents.
 * @returns {{name: string, address: string, ruc: string}|null} The holder, or null when empty.
 */
export function parseHolder(text) {
  const values = {};
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    const key = eq > 0 ? line.slice(0, eq).trim().toUpperCase() : "";
    if (!HOLDER_KEYS.has(key)) throw new Error(`holder file: unknown line "${line.slice(0, 40)}" (keys: NAME, ADDRESS, RUC)`);
    values[key] = line.slice(eq + 1).trim().replace(/^"(.*)"$/, "$1").trim();
  }
  return holderFrom(values);
}

/**
 * All-or-nothing on NAME and ADDRESS: the notice names a holder only with its address (art. 6.1.1).
 * @param {{NAME?: string, ADDRESS?: string, RUC?: string}} v Parsed values.
 * @returns {{name: string, address: string, ruc: string}|null} Holder or null.
 */
function holderFrom(v) {
  const name = v.NAME || "";
  const address = v.ADDRESS || "";
  const ruc = v.RUC || "";
  if (!name && !address && !ruc) return null;
  if (!name || !address) throw new Error("holder file is half-filled: NAME and ADDRESS are both required (RUC is optional)");
  if (ruc && !RUC_RE.test(ruc)) throw new Error("holder file: RUC must be 11 digits");
  if (/[\u0000-\u001f]/.test(name + address)) throw new Error("holder file: control characters are not allowed");
  return { name, address, ruc };
}

/**
 * Read the holder file; a missing file is "closed", not an error.
 * @param {string} file Path.
 * @returns {{name: string, address: string, ruc: string}|null} Holder or null.
 */
export function readHolder(file) {
  return existsSync(file) ? parseHolder(readFileSync(file, "utf8")) : null;
}

/**
 * How React writes text into HTML (react-dom escapeTextForBrowser).
 * @param {string} s Text.
 * @returns {string} Escaped.
 */
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

/**
 * What is wrong with the built privacy page for this holder (empty when it matches the mode).
 * Name and address are matched separately: React may insert comment nodes between text nodes.
 * @param {string} html out/privacy.html.
 * @param {{name: string, address: string}|null} holder Holder, or null for closed mode.
 * @returns {string[]} Problems.
 */
export function privacyHtmlProblems(html, holder) {
  const closed = html.includes(CLOSED_PHRASE);
  if (!holder) return closed ? [] : [`the closed-mode notice is missing ("${CLOSED_PHRASE}")`];
  const problems = [];
  if (!html.includes(escapeHtml(holder.name))) problems.push("the holder's name is not in the page");
  if (!html.includes(escapeHtml(holder.address))) problems.push("the holder's address is not in the page");
  if (closed) problems.push(`the page still says "${CLOSED_PHRASE}"`);
  return problems;
}

/**
 * ops holder <file> <mode|name|address|ruc>: one field, "open"/"closed" for mode; exit 1 when the
 * file is half-filled or malformed.
 * @param {string} file Path.
 * @param {string} field Field.
 * @returns {number} Exit code.
 */
function cmdHolder(file, field) {
  try {
    const holder = readHolder(file);
    if (field === "mode") process.stdout.write(holder ? "open" : "closed");
    else if (["name", "address", "ruc"].includes(field)) process.stdout.write(holder ? holder[field] : "");
    else throw new Error(`holder: unknown field ${field}`);
    return 0;
  } catch (error) {
    console.error(error.message);
    return 1;
  }
}

/**
 * ops holder-html <privacy.html> <file>: exit 1, printing each problem, when the built page does
 * not match the holder file's mode.
 * @param {string} htmlFile Path.
 * @param {string} file Holder file.
 * @returns {number} Exit code.
 */
function cmdHolderHtml(htmlFile, file) {
  if (!existsSync(htmlFile)) {
    console.error(`${htmlFile} is missing`);
    return 1;
  }
  const problems = privacyHtmlProblems(readFileSync(htmlFile, "utf8"), readHolder(file));
  problems.forEach((p) => console.error(p));
  return problems.length ? 1 : 0;
}

/**
 * Read stdin to EOF.
 * @returns {string} Text.
 */
function stdin() {
  return readFileSync(0, "utf8");
}

/**
 * Print placeholders; exit 1 when any.
 * @param {string} file wrangler.toml.
 * @returns {number} Exit code.
 */
function cmdPlaceholders(file) {
  const found = placeholders(readFileSync(file, "utf8"));
  found.forEach((p) => console.log(p));
  return found.length ? 1 : 0;
}

/**
 * Print the normalised ADMIN_EMAILS; exit 1 with the reason when invalid.
 * @returns {number} Exit code.
 */
function cmdAdminEmails() {
  try {
    process.stdout.write(parseAdminEmails(stdin()));
    return 0;
  } catch (error) {
    console.error(error.message);
    return 1;
  }
}

/**
 * Generate the licence key: private half to stdout, public JWK to a file.
 * @param {string} kid Key id.
 * @param {string} jwkFile Where the PUBLIC JWK goes.
 * @returns {Promise<number>} Exit code.
 */
async function cmdLicenceKey(kid, jwkFile) {
  const { pkcs8, jwk } = await generateLicenceKeys(kid);
  writeFileSync(jwkFile, `${JSON.stringify(jwk)}\n`);
  process.stdout.write(pkcs8);
  return 0;
}

/**
 * Print secret names; exit 3 when the output is not a list.
 * @returns {number} Exit code.
 */
function cmdSecretNames() {
  const names = secretNames(stdin());
  if (names === null) {
    return 3;
  }
  names.forEach((n) => console.log(n));
  return 0;
}

/** Cloudflare's API root; PYARCANA_CF_API points the tests at a local fake. */
const CF_API = () => (process.env.PYARCANA_CF_API || "https://api.cloudflare.com/client/v4").replace(/\/+$/, "");

/**
 * Cloudflare's JSON envelope from a response body, or null when it is not one (a proxy or firewall
 * page, "Host not in allowlist", an HTML error).
 * @param {string} text Body.
 * @returns {Object|null} Envelope.
 */
function cfEnvelope(text) {
  try {
    const body = JSON.parse(text);
    return body && typeof body === "object" && typeof body.success === "boolean" ? body : null;
  } catch {
    return null;
  }
}

/**
 * One verify request.
 * @param {string} path API path.
 * @param {string} token Token.
 * @returns {Promise<{kind: "active"|"refused"|"unchecked", detail: string}>} Outcome.
 */
async function verifyAt(path, token) {
  let res;
  try {
    res = await fetch(`${CF_API()}${path}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) });
  } catch (e) {
    return { kind: "unchecked", detail: `could not reach Cloudflare (${e.cause?.code || e.name})` };
  }
  const text = await res.text().catch(() => "");
  const body = cfEnvelope(text);
  if (!body) {
    // Only Cloudflare's own answer can say a token is refused.
    return { kind: "unchecked", detail: `HTTP ${res.status} that is not Cloudflare's answer (${text.replace(/\s+/g, " ").trim().slice(0, 80) || "empty"})` };
  }
  const status = body.result?.status;
  if (res.ok && body.success && status === "active") {
    return { kind: "active", detail: "active" };
  }
  return { kind: "refused", detail: status ? `Cloudflare says the token is ${status}` : "" };
}

/**
 * Ask Cloudflare whether the token in $CLOUDFLARE_API_TOKEN is active, before any wrangler call.
 * A user token answers on /user/tokens/verify; an account-owned token on
 * /accounts/<id>/tokens/verify. The token is read from the environment, never from argv, and is
 * never printed. Prints one line: "active", or why it is refused or could not be checked.
 * @returns {Promise<number>} 0 active, 1 refused (revoked, expired, mistyped), 2 not checked.
 */
async function cmdTokenCheck() {
  const token = process.env.CLOUDFLARE_API_TOKEN || "";
  const account = process.env.CLOUDFLARE_ACCOUNT_ID || "";
  const paths = ["/user/tokens/verify", ...(SAFE_VALUE_RE.test(account) ? [`/accounts/${account}/tokens/verify`] : [])];
  let refused = "Cloudflare does not recognise this token (revoked, expired or mistyped)";
  for (const path of paths) {
    const outcome = await verifyAt(path, token);
    if (outcome.kind !== "refused") {
      process.stdout.write(outcome.detail);
      return outcome.kind === "active" ? 0 : 2;
    }
    refused = outcome.detail || refused;
  }
  process.stdout.write(refused);
  return 1;
}

const COMMANDS = {
  "d1-id-from-list": ([name]) => (process.stdout.write(d1IdFromList(stdin(), name)), 0),
  "d1-id-from-create": () => (process.stdout.write(d1IdFromCreate(stdin())), 0),
  "secret-names": () => cmdSecretNames(),
  "toml-get": ([file, section, key]) => (process.stdout.write(tomlValue(readFileSync(file, "utf8"), section, key) ?? ""), 0),
  "toml-set": ([file, section, key, value]) => (writeFileSync(file, setTomlValue(readFileSync(file, "utf8"), section, key, value)), 0),
  placeholders: ([file]) => cmdPlaceholders(file),
  "admin-emails": () => cmdAdminEmails(),
  "kid-ok": ([kid]) => (KID_RE.test(String(kid || "")) ? 0 : 1),
  pepper: () => (process.stdout.write(randomBytes(32).toString("base64")), 0),
  "licence-key": ([kid, jwkFile]) => cmdLicenceKey(kid, jwkFile),
  "token-check": () => cmdTokenCheck(),
  holder: ([file, field]) => cmdHolder(file, field),
  "holder-html": ([htmlFile, file]) => cmdHolderHtml(htmlFile, file)
};

/**
 * Run one command.
 * @param {string[]} argv Command and arguments.
 * @returns {Promise<number>} Exit code.
 */
export async function main(argv) {
  const handler = COMMANDS[argv[0]];
  if (!handler) {
    console.error(`ops.mjs: unknown command ${argv[0] || "(none)"}; one of ${Object.keys(COMMANDS).join(", ")}`);
    return 2;
  }
  return handler(argv.slice(1));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      console.error(`ops.mjs: ${error && error.message ? error.message : "failed"}`);
      process.exitCode = 1;
    }
  );
}
