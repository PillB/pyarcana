/**
 * wrangler.toml is public (committed): every public var is present with its
 * documented default, no secret is ever assigned a value, no personal address
 * is published, and the cron strings match the code that dispatches them.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { DAILY_CRON, HOURLY_CRON } from "../src/retention.mjs";

const ROOT = new URL("../", import.meta.url);
const TOML = readFileSync(new URL("wrangler.toml", ROOT), "utf8");

const SECRETS = [
  "SERVER_PEPPER",
  "ADMIN_EMAILS",
  "RESEND_API_KEY",
  "BREVO_API_KEY",
  "MAILERSEND_API_KEY",
  "MP_ACCESS_TOKEN",
  "MP_WEBHOOK_SECRET",
  "CREEM_API_KEY",
  "CREEM_WEBHOOK_SECRET"
];

const PUBLIC_VARS = {
  // DESIGN-v3 §K/§L: the owner's domain, prefilled (public, safe to commit).
  ALLOWED_ORIGINS: "https://pyarcana.dev",
  CANONICAL_ORIGIN: "https://pyarcana.dev",
  SITE_PATH: "",
  TERMS_VERSION: null,
  TRIAL_DAYS: "7",
  GRACE_DAYS: "7",
  SESSION_MAX_DAYS: "180",
  GOOGLE_CLIENT_ID: "",
  MICROSOFT_CLIENT_ID: "",
  // D-USER-04: sign-in codes go through Cloudflare Email Sending (send_email binding EMAIL).
  EMAIL_PROVIDER: "cloudflare",
  EMAIL_FROM: "no-reply@pyarcana.dev",
  EMAIL_FROM_NAME: "PyArcana",
  EMAIL_DAILY_CAP: "90",
  REPORT_ATTACHMENTS_CAP_MB: "200",
  REPORT_TEXT_CAP_MB: "100",
  PRICE_PE_MONTHLY_MINOR: "1990",
  PRICE_PE_YEARLY_MINOR: "11990",
  PRICE_US_MONTHLY_MINOR: "799",
  PRICE_US_YEARLY_MINOR: "4900",
  CREEM_API_BASE: "https://api.creem.io",
  CREEM_PRODUCT_PRO_MONTHLY: "",
  CREEM_PRODUCT_PRO_YEARLY: "",
  MP_API_BASE: "https://api.mercadopago.com"
};

/**
 * Parse `KEY = "value"` lines of one [section] (enough TOML for this file).
 * @param {string} text File text.
 * @param {string} section Section name.
 * @returns {Object} Key/value strings.
 */
function section(text, section) {
  const out = {};
  let inside = false;
  for (const line of text.split("\n")) {
    const header = /^\s*\[+([^\]]+)\]+\s*$/.exec(line);
    if (header) {
      inside = header[1].trim() === section;
      continue;
    }
    const pair = /^\s*([A-Za-z0-9_]+)\s*=\s*(.+?)\s*$/.exec(line);
    if (inside && pair) {
      out[pair[1]] = pair[2];
    }
  }
  return out;
}

/**
 * Unquote a TOML basic string.
 * @param {string} raw Raw value.
 * @returns {string} Value.
 */
function unquote(raw) {
  return JSON.parse(raw);
}

test("the worker entry, D1 binding and compatibility date are declared", () => {
  const top = section(`[top]\n${TOML}`, "top");
  assert.equal(unquote(top.name), "pyarcana-billing");
  assert.equal(unquote(top.main), "src/index.mjs");
  assert.equal(unquote(top.compatibility_date), "2025-09-01");
  assert.ok(existsSync(fileURLToPath(new URL("src/index.mjs", ROOT))));
  const d1 = section(TOML, "d1_databases");
  assert.equal(unquote(d1.binding), "DB");
  assert.equal(unquote(d1.database_name), "pyarcana-accounts");
  assert.equal(unquote(d1.database_id), "TODO_REPLACE_WITH_D1_DATABASE_ID");
});

test("every public var is present with its documented default", () => {
  const vars = section(TOML, "vars");
  for (const [name, expected] of Object.entries(PUBLIC_VARS)) {
    assert.ok(name in vars, `missing var ${name}`);
    if (expected !== null) {
      assert.equal(unquote(vars[name]), expected, name);
    }
  }
});

test("no secret is assigned a value anywhere, and each is documented for wrangler secret put", () => {
  for (const name of SECRETS) {
    assert.ok(!new RegExp(`^\\s*${name}\\s*=`, "m").test(TOML), `${name} must not be assigned in wrangler.toml`);
    assert.ok(new RegExp(`wrangler secret put ${name}\\b`).test(TOML), `${name} is documented`);
  }
});

test("no personal gmail address is published", () => {
  assert.ok(!/@gmail\.com/i.test(TOML));
});

test("crons match the code's dispatch table, and observability is on", () => {
  const triggers = section(TOML, "triggers");
  assert.deepEqual(JSON.parse(triggers.crons), [DAILY_CRON, HOURLY_CRON]);
  assert.equal(section(TOML, "observability").enabled, "true");
});

test("DESIGN-v3 §A: the static export is served from the same worker, the API path runs the worker first", () => {
  const assets = section(TOML, "assets");
  assert.equal(unquote(assets.directory), "../../out");
  assert.equal(unquote(assets.binding), "ASSETS");
  assert.deepEqual(JSON.parse(assets.run_worker_first), ["/api/*"]);
  assert.equal(unquote(assets.not_found_handling), "404-page");
  assert.ok(existsSync(fileURLToPath(new URL("../../package.json", ROOT))), "../../ resolves to the repository root, where next build writes out/");
});

test("D-USER-04: the send_email binding EMAIL may send only from the configured no-reply address", () => {
  const binding = section(TOML, "send_email");
  assert.equal(unquote(binding.name), "EMAIL");
  const vars = section(TOML, "vars");
  assert.deepEqual(JSON.parse(binding.allowed_sender_addresses), [unquote(vars.EMAIL_FROM)]);
  assert.equal((TOML.match(/^\[\[send_email\]\]$/gm) || []).length, 1);
});
