#!/usr/bin/env node
/**
 * A fake `wrangler` for the operator-script tests (tests/operator-scripts.test.mjs).
 *
 * Its output copies the shapes of wrangler 4.144.0 (wrangler-dist/cli.js, read 2026-09-30):
 * - `d1 list --json`: no banner, `JSON.stringify(dbs, null, 2)` of the API's database objects
 *   ({uuid, name, created_at, version, num_tables, file_size}).
 * - `d1 create <name>`: the banner, "✅ Successfully created DB '<name>' in region WEUR",
 *   "Created your new D1 database.", then the TOML snippet with `database_id = "<uuid>"`
 *   (formatConfigSnippet; a .toml config is never patched, and nothing is asked).
 * - `secret list` (default --format json): no banner, `JSON.stringify(secrets, null, "  ")` of
 *   {name, type}; before the Worker exists: `✘ [ERROR] Worker "<name>" not found.` and exit 1.
 * - `secret put <KEY>`: prompts only when process.stdin.isTTY; otherwise reads stdin to EOF and
 *   trims trailing whitespace. A missing Worker is created as a draft (confirm2 with
 *   fallbackValue true when not interactive), then "✨ Success! Uploaded secret <KEY>".
 * - `deploy`: interactive when stdin AND stdout are TTYs (isTtyInteractive); piped, the first
 *   deploy of an account without a workers.dev subdomain answers "no" to itself and fails.
 * The proxy warning `▲ [WARNING] Proxy environment variables detected.` is printed with ANSI
 * colour before the payload (relayed fact 7: it can share the stream with JSON).
 *
 * State lives in the JSON file named by FAKE_WRANGLER_STATE. It records every call and, as this
 * is a test double, the secret values it received (the tests check them and then delete the
 * temporary directory).
 */

import { randomUUID } from "node:crypto";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const STATE_FILE = process.env.FAKE_WRANGLER_STATE;
const ESC = "\u001b[";
const BANNER = `\n ⛅️ wrangler 4.144.0\n${"─".repeat(19)}\n`;
const PROXY_WARNING = `${ESC}33m▲ ${ESC}43;33m[${ESC}43;30mWARNING${ESC}43;33m]${ESC}0m ${ESC}1mProxy environment variables detected. We'll use your proxy for fetch requests.${ESC}0m\n\n`;

/**
 * Read the fake's state.
 * @returns {Object} State.
 */
function load() {
  return JSON.parse(readFileSync(STATE_FILE, "utf8"));
}

/**
 * Write the fake's state.
 * @param {Object} state State.
 * @returns {void}
 */
function save(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * Print an error the way wrangler's logger does, and exit 1.
 * @param {string} message Message.
 * @returns {never} Exits.
 */
function fail(message) {
  process.stderr.write(`${ESC}31m✘ ${ESC}41;31m[${ESC}41;97mERROR${ESC}41;31m]${ESC}0m ${ESC}1m${message}${ESC}0m\n\n`);
  process.exit(1);
}

/**
 * Read stdin to EOF.
 * @returns {Promise<string>} Text.
 */
function readStdin() {
  return new Promise((resolve) => {
    const chunks = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

/**
 * The worker name from ./wrangler.toml (wrangler reads the config in the working directory).
 * @returns {string} Name.
 */
function workerName() {
  const toml = readFileSync("wrangler.toml", "utf8");
  return /^name\s*=\s*"([^"]+)"/m.exec(toml)[1];
}

/**
 * `wrangler d1 list --json`.
 * @param {Object} state State.
 * @returns {void}
 */
function d1List(state) {
  if (state.failD1List) {
    fail("Authentication error [code: 10000]");
  }
  process.stdout.write(PROXY_WARNING);
  const dbs = state.dbs.map((db) => ({ uuid: db.uuid, name: db.name, created_at: "2026-09-30T12:00:00.000Z", version: "production", num_tables: 0, file_size: 12288 }));
  process.stdout.write(`${JSON.stringify(dbs, null, 2)}\n`);
}

/**
 * `wrangler d1 create <name>`.
 * @param {Object} state State.
 * @param {string} name Database name.
 * @returns {void}
 */
function d1Create(state, name) {
  if (state.dbs.some((db) => db.name === name)) {
    fail(`A database with that name already exists [code: 7502]`);
  }
  const uuid = state.nextUuid || randomUUID();
  if (!state.createLosesDatabase) {
    state.dbs.push({ uuid, name });
  }
  process.stdout.write(`${BANNER}${PROXY_WARNING}`);
  process.stdout.write(`✅ Successfully created DB '${name}' in region WEUR\nCreated your new D1 database.\n\n`);
  process.stdout.write("To access your new D1 Database in your Worker, add the following snippet to your configuration file:\n");
  const id = state.createPrintsNoId ? "" : `database_id = "${uuid}"\n`;
  process.stdout.write(`[[d1_databases]]\nbinding = "pyarcana_accounts"\ndatabase_name = "${name}"\n${id}\n`);
}

/**
 * `wrangler secret list`.
 * @param {Object} state State.
 * @returns {void}
 */
function secretList(state) {
  if (state.failSecretList) {
    fail("Authentication error [code: 10000]");
  }
  if (!state.workerExists) {
    fail(`Worker "${workerName()}" not found.\n\nIf this is a new Worker, run \`wrangler deploy\` first to create it.\nOtherwise, check that the Worker name is correct and you're logged into the right account.`);
  }
  const secrets = Object.keys(state.secrets).map((name) => ({ name, type: "secret_text" }));
  process.stdout.write(`${JSON.stringify(secrets, null, "  ")}\n`);
}

/**
 * `wrangler secret put <KEY>`.
 * @param {Object} state State.
 * @param {string} key Secret name.
 * @returns {Promise<void>} Resolves when stored.
 */
async function secretPut(state, key) {
  process.stdout.write(BANNER);
  if (process.stdin.isTTY) {
    state.interactiveSecretPrompts = (state.interactiveSecretPrompts || 0) + 1;
    save(state);
    fail("the fake refuses the interactive prompt: the scripts must pipe the value");
  }
  const value = (await readStdin()).trimEnd();
  process.stdout.write(`🌀 Creating the secret for the Worker "${workerName()}"\n`);
  if (!state.workerExists) {
    process.stdout.write(`? There doesn't seem to be a Worker called "${workerName()}". Do you want to create a new Worker with that name and add secrets to it?\n`);
    process.stdout.write("🤖 Using fallback value in non-interactive context: yes\n");
    process.stdout.write(`🌀 Creating new Worker "${workerName()}"...\n`);
    state.workerExists = true;
  }
  state.secrets[key] = value;
  state.secretPuts.push(key);
  save(state);
  process.stdout.write(`✨ Success! Uploaded secret ${key}\n`);
}

/**
 * `wrangler deploy`.
 * @param {Object} state State.
 * @returns {void}
 */
function deploy(state) {
  process.stdout.write(BANNER);
  const toml = readFileSync("wrangler.toml", "utf8");
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const assets = path.resolve("../../out/index.html");
  state.deploys.push({ interactive, placeholder: /TODO_/.test(toml), assets: existsSync(assets), secrets: Object.keys(state.secrets).sort() });
  save(state);
  if (!interactive && !state.hasSubdomain) {
    process.stdout.write("? Would you like to register a workers.dev subdomain now?\n🤖 Using fallback value in non-interactive context: no\n");
    fail("You can either deploy your worker to one or more routes by specifying them in your wrangler.toml file, or register a workers.dev subdomain here:");
  }
  if (/TODO_/.test(toml)) {
    fail("You must use a real database in the database_id configuration.");
  }
  state.workerExists = true;
  save(state);
  process.stdout.write(`Uploaded ${workerName()} (3.21 sec)\nDeployed ${workerName()} triggers (0.52 sec)\n  https://${workerName()}.example.workers.dev\nCurrent Version ID: ${randomUUID()}\n`);
}

/**
 * Dispatch one invocation.
 * @param {string[]} argv Arguments.
 * @returns {Promise<void>} Resolves when done.
 */
async function main(argv) {
  const state = load();
  if (process.env.FAKE_LOG) {
    appendFileSync(process.env.FAKE_LOG, `wrangler ${argv.join(" ")}\n`);
  }
  state.calls.push({ argv, stdinTTY: Boolean(process.stdin.isTTY), stdoutTTY: Boolean(process.stdout.isTTY) });
  save(state);
  const command = argv.slice(0, 2).join(" ");
  if (command === "d1 list") {
    return d1List(state);
  }
  if (command === "d1 create") {
    return d1Create(state, argv[2]);
  }
  if (command === "secret list") {
    return secretList(state);
  }
  if (command === "secret put") {
    return secretPut(state, argv[2]);
  }
  if (argv[0] === "deploy") {
    return deploy(state);
  }
  return fail(`fake wrangler: unsupported command ${argv.join(" ")}`);
}

await main(process.argv.slice(2));
