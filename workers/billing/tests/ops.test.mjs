/**
 * scripts/ops.mjs: the parsing and editing the operator scripts (setup.sh, deploy.sh) rely on.
 * The inputs are wrangler 4.144.0's real output shapes (see tests/wrangler-fake.mjs), including
 * ANSI colour and the proxy warning on the same stream as the JSON.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

import {
  d1IdFromCreate,
  d1IdFromList,
  extractJson,
  parseAdminEmails,
  placeholders,
  secretNames,
  setTomlValue,
  tomlValue
} from "../scripts/ops.mjs";

const TOML = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
const UUID = "0f6c2d9e-4a1b-4c7d-9e2f-3a4b5c6d7e8f";
const WARN = "\u001b[33m▲ \u001b[43;33m[\u001b[43;30mWARNING\u001b[43;33m]\u001b[0m \u001b[1mProxy environment variables detected.\u001b[0m\n\n";

test("extractJson skips ANSI colour and a bracketed [WARNING] banner before the payload", () => {
  const text = `${WARN}[\n  {\n    "uuid": "${UUID}",\n    "name": "pyarcana-accounts"\n  }\n]\n`;
  assert.deepEqual(extractJson(text, "array"), [{ uuid: UUID, name: "pyarcana-accounts" }]);
  assert.equal(extractJson("no json here [nope", "array"), null);
  assert.equal(extractJson('{"a": 1}', "array"), null, "an object is not the array asked for");
});

test("d1IdFromList finds the database by exact name only, and only a UUID-shaped id", () => {
  const list = `${WARN}${JSON.stringify([{ uuid: "11111111-1111-4111-8111-111111111111", name: "pyarcana-accounts-old" }, { uuid: UUID, name: "pyarcana-accounts" }], null, 2)}\n`;
  assert.equal(d1IdFromList(list, "pyarcana-accounts"), UUID);
  assert.equal(d1IdFromList(list, "pyarcana"), "");
  assert.equal(d1IdFromList(JSON.stringify([{ uuid: "TODO_X", name: "pyarcana-accounts" }]), "pyarcana-accounts"), "");
  assert.equal(d1IdFromList("\u001b[31m✘ [ERROR] Authentication error\u001b[0m", "pyarcana-accounts"), "");
});

test("d1IdFromCreate reads database_id from the TOML snippet d1 create prints", () => {
  const out = `\n ⛅️ wrangler 4.144.0\n───\n${WARN}✅ Successfully created DB 'pyarcana-accounts' in region WEUR\nCreated your new D1 database.\n\n[[d1_databases]]\nbinding = "pyarcana_accounts"\ndatabase_name = "pyarcana-accounts"\ndatabase_id = "${UUID}"\n`;
  assert.equal(d1IdFromCreate(out), UUID);
  assert.equal(d1IdFromCreate('database_id = "TODO_REPLACE_WITH_D1_DATABASE_ID"'), "");
  assert.equal(d1IdFromCreate("✘ [ERROR] A database with that name already exists"), "");
});

test("secretNames lists the names from secret list's JSON, and null when the output is not a list", () => {
  const out = `${JSON.stringify([{ name: "SERVER_PEPPER", type: "secret_text" }, { name: "ADMIN_EMAILS", type: "secret_text" }], null, "  ")}\n`;
  assert.deepEqual(secretNames(out), ["SERVER_PEPPER", "ADMIN_EMAILS"]);
  assert.deepEqual(secretNames("[]"), []);
  assert.equal(secretNames('✘ [ERROR] Worker "pyarcana-billing" not found.'), null);
});

test("setTomlValue replaces a key inside its own section only, and refuses a missing key", () => {
  const withId = setTomlValue(TOML, "d1_databases", "database_id", UUID);
  assert.equal(tomlValue(withId, "d1_databases", "database_id"), UUID);
  assert.equal(withId.split("\n").length, TOML.split("\n").length, "one line changed, nothing added");
  assert.equal(withId.replace(UUID, "TODO_REPLACE_WITH_D1_DATABASE_ID"), TOML, "nothing else changed");
  const rotated = setTomlValue(TOML, "vars", "LICENSE_KEY_ID", "k2");
  assert.equal(tomlValue(rotated, "vars", "LICENSE_KEY_ID"), "k2");
  assert.throws(() => setTomlValue(TOML, "vars", "database_id", UUID), /database_id/);
  assert.throws(() => setTomlValue(TOML, "d1_databases", "database_id", 'x"\nname = "evil'), /value/);
});

test("placeholders lists every TODO_ value outside comments", () => {
  assert.deepEqual(placeholders(TOML), ["TODO_REPLACE_WITH_D1_DATABASE_ID"]);
  assert.deepEqual(placeholders(setTomlValue(TOML, "d1_databases", "database_id", UUID)), []);
  assert.deepEqual(placeholders(`# TODO_IN_A_COMMENT\n[vars]\nX = "TODO_SET_ME"\n`), ["TODO_SET_ME"]);
});

test("parseAdminEmails normalises a comma list and refuses anything that is not a list of addresses", () => {
  assert.equal(parseAdminEmails(" Admin@Example.com , second@example.org,admin@example.com\n"), "admin@example.com,second@example.org");
  for (const bad of ["", "   ", "not-an-address", "a@b", "a@example.com b@example.com", "a@example.com,,", 'a"@example.com']) {
    assert.throws(() => parseAdminEmails(bad), /address/, JSON.stringify(bad));
  }
});
