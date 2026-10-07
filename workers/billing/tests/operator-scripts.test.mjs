/**
 * The owner's operator scripts, run for real under a pseudo-terminal (`script -qec`, util-linux)
 * against a fake wrangler built from wrangler 4.144.0's output shapes (tests/wrangler-fake.mjs).
 *
 * A pty matters: wrangler's `deploy` is interactive only when stdin AND stdout are TTYs, and a
 * piped deploy answers its own prompts with fallbacks (relayed fact 4). `secret put` must be the
 * opposite: piped, so the value never reaches the terminal. The fake records which it got.
 *
 * Each test copies wrangler.toml and scripts/ into a temporary tree shaped like the repository
 * (root/scripts/cloud-headers.mjs, root/workers/billing/...), with a fake `bun` on PATH, so the
 * real wrangler.toml is never touched. Linux only (`script -qec` is util-linux syntax).
 */

import assert from "node:assert/strict";
import test from "node:test";
import { spawn, spawnSync } from "node:child_process";
import { webcrypto } from "node:crypto";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BILLING = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The fake Cloudflare token-verify API (cf-api-fake.mjs, a TEST DOUBLE), one process for the file:
// the scripts run synchronously (spawnSync), so it cannot live in this process's event loop.
const CF_TOKENS = {
  user: ["test-token-not-real", "cf-token-for-the-prompt-test-0123456789abcdef", "fresh-token-0123456789abcdefghij"],
  account: ["cf-account-token-0123456789abcdef"],
  expired: ["expired-token-0123456789abcdef"]
};
const cfFake = spawn(process.execPath, [path.join(path.dirname(fileURLToPath(import.meta.url)), "cf-api-fake.mjs")], {
  env: { ...process.env, FAKE_CF_TOKENS: CF_TOKENS.user.join(","), FAKE_CF_ACCOUNT_TOKENS: CF_TOKENS.account.join(","), FAKE_CF_EXPIRED: CF_TOKENS.expired.join(",") },
  stdio: ["ignore", "pipe", "inherit"]
});
const CF_API = await new Promise((resolve) => cfFake.stdout.once("data", (d) => resolve(`http://127.0.0.1:${String(d).trim()}`)));
test.after(() => cfFake.kill());
const FAKE = path.join(BILLING, "tests", "wrangler-fake.mjs");
const UUID = "0f6c2d9e-4a1b-4c7d-9e2f-3a4b5c6d7e8f";

// The fake static build stands in for root/scripts/build_static_export.mjs and mirrors its basePath
// rule. "fixed": an EMPTY NEXT_PUBLIC_BASE_PATH builds at the root (scripts/static_base_path.mjs).
// "current": \`|| '/pyarcana'\`, the rule at commit 29200ca, under which an empty value still builds
// at /pyarcana.
const FAKE_BUILD = `import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
const env = process.env.NEXT_PUBLIC_BASE_PATH;
appendFileSync(process.env.FAKE_LOG, "static-build base=" + (env === undefined ? "UNSET" : env) + "\\n");
if (process.env.FAKE_BUILD_FAIL === "1") { console.error("build failed"); process.exit(1); }
const base = process.env.FAKE_BUILD_MODE === "current" ? (env || "/pyarcana") : (env ?? "/pyarcana");
mkdirSync("out", { recursive: true });
writeFileSync("out/index.html", "<html></html>");
writeFileSync("out/deployment.json", JSON.stringify({ schema_version: 1, base_path: base }, null, 2) + "\\n");
`;

// bun on PATH is a tripwire: the build must not need it. On 7 Oct 2026 \`bun run\` died on the
// owner's Mac with CouldntReadCurrentDirectory (it opens every parent folder; oven-sh/bun#28220).
// \`bun install\` (redeploy.sh step 3) is allowed: it worked there, and it does not walk the folders.
const FAKE_BUN = `#!/bin/sh
echo "bun $*" >> "$FAKE_LOG"
[ "$1" = install ] && exit 0
echo "bun must not be called by the deploy" >&2
exit 1
`;

const FAKE_HEADERS = `import { appendFileSync, writeFileSync } from "node:fs";
appendFileSync(process.env.FAKE_LOG, "cloud-headers " + process.argv.slice(2).join(" ") + "\\n");
writeFileSync((process.argv[2] || "out") + "/_headers", "/*\\n  X-Content-Type-Options: nosniff\\n");
`;

/**
 * Build a temporary repository-shaped tree and the fake's state.
 * @param {Object} [state] Initial fake state (merged over the defaults).
 * @param {{headers?: boolean, toml?: (t: string) => string}} [options] Tree options.
 * @returns {Object} Paths.
 */
function tree(state = {}, options = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "pyarcana-ops-"));
  const billing = path.join(root, "workers", "billing");
  mkdirSync(billing, { recursive: true });
  cpSync(path.join(BILLING, "scripts"), path.join(billing, "scripts"), { recursive: true });
  const toml = readFileSync(path.join(BILLING, "wrangler.toml"), "utf8");
  writeFileSync(path.join(billing, "wrangler.toml"), options.toml ? options.toml(toml) : toml);
  writeFileSync(path.join(root, "package.json"), '{"name":"fake-root","private":true}\n');
  mkdirSync(path.join(root, "scripts"));
  if (options.headers !== false) {
    writeFileSync(path.join(root, "scripts", "cloud-headers.mjs"), FAKE_HEADERS);
  }
  writeFileSync(path.join(root, "scripts", "build_static_export.mjs"), FAKE_BUILD);
  const bin = path.join(root, ".bin");
  mkdirSync(bin);
  writeFileSync(path.join(bin, "bun"), FAKE_BUN);
  writeFileSync(path.join(bin, "wrangler"), `#!/bin/sh\nexec "${process.execPath}" "${FAKE}" "$@"\n`);
  chmodSync(path.join(bin, "bun"), 0o755);
  chmodSync(path.join(bin, "wrangler"), 0o755);
  const stateFile = path.join(root, "state.json");
  const initial = { dbs: [], workerExists: false, hasSubdomain: false, secrets: {}, secretPuts: [], calls: [], deploys: [], nextUuid: UUID, ...state };
  writeFileSync(stateFile, JSON.stringify(initial));
  return { root, billing, bin, stateFile, log: path.join(root, "log.txt") };
}

/**
 * Run a script under a pty.
 * @param {Object} t Tree from tree().
 * @param {string} script "setup.sh" or "deploy.sh".
 * @param {{args?: string[], input?: string, env?: Object, pathPrefix?: string}} [options] Run options.
 * @returns {{status: number, out: string, state: Object, toml: string, log: string}} Result.
 */
function run(t, script, options = {}) {
  const args = (options.args || []).map((a) => `'${a}'`).join(" ");
  const command = `bash '${path.join(t.billing, "scripts", script)}' ${args}`;
  const env = {
    PATH: `${options.pathPrefix ? `${options.pathPrefix}:` : ""}${t.bin}:${process.env.PATH}`,
    HOME: t.root,
    SHELL: "/bin/bash",
    TERM: "dumb",
    CLOUDFLARE_API_TOKEN: "test-token-not-real",
    CLOUDFLARE_ACCOUNT_ID: "0123456789abcdef0123456789abcdef",
    PYARCANA_WRANGLER: path.join(t.bin, "wrangler"),
    FAKE_WRANGLER_STATE: t.stateFile,
    FAKE_LOG: t.log,
    PYARCANA_CF_API: CF_API,
    ...options.env
  };
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      delete env[key];
    }
  }
  // setup.sh offers an exported account id and token ("Use it? [Y/n]"): Enter keeps each, unless
  // the test types its own answers (reuse: false).
  const offered = options.reuse === false ? "" : `${env.CLOUDFLARE_ACCOUNT_ID ? "\n" : ""}${env.CLOUDFLARE_API_TOKEN ? "\n" : ""}`;
  const input = script === "deploy.sh" ? options.input ?? "" : offered + (options.input ?? "");
  const result = spawnSync("script", ["-qec", command, "/dev/null"], { cwd: t.root, env, input, encoding: "utf8", timeout: 60000 });
  return {
    status: result.status,
    out: `${result.stdout}${result.stderr}`,
    state: JSON.parse(readFileSync(t.stateFile, "utf8")),
    toml: readFileSync(path.join(t.billing, "wrangler.toml"), "utf8"),
    log: existsSync(t.log) ? readFileSync(t.log, "utf8") : ""
  };
}

/**
 * The wrangler commands the fake saw, as "d1 list" style strings.
 * @param {Object} state Fake state.
 * @returns {string[]} Commands.
 */
function commands(state) {
  return state.calls.map((c) => c.argv.filter((a) => !a.startsWith("--")).join(" "));
}

/**
 * The public JWKs the transcript printed (one line of JSON each).
 * @param {string} out Transcript.
 * @returns {Object[]} JWKs.
 */
function printedJwks(out) {
  return out.split(/\r?\n/).filter((line) => line.trim().startsWith('{"kty":"EC"')).map((line) => JSON.parse(line.trim()));
}

/**
 * Prove a PKCS#8 private key and a public JWK are one ES256 pair.
 * @param {string} pkcs8B64 Private key.
 * @param {Object} jwk Public JWK.
 * @returns {Promise<boolean>} True when a signature verifies.
 */
async function samePair(pkcs8B64, jwk) {
  const priv = await webcrypto.subtle.importKey("pkcs8", Buffer.from(pkcs8B64, "base64"), { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const pub = await webcrypto.subtle.importKey("jwk", { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y }, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const data = new TextEncoder().encode("pyarcana licence");
  const sig = await webcrypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, priv, data);
  return webcrypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pub, sig, data);
}

/**
 * Assert no 24-character window of a secret appears in the transcript.
 * @param {string} out Transcript.
 * @param {string} secret Secret value.
 * @param {string} label Name for the message.
 * @returns {void}
 */
function assertNotPrinted(out, secret, label) {
  const flat = out.replace(/\s+/g, "");
  for (let i = 0; i + 24 <= secret.length; i += 8) {
    assert.ok(!flat.includes(secret.slice(i, i + 24)), `${label} leaked into the terminal`);
  }
}

test("setup.sh refuses without CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID, before any wrangler call", () => {
  for (const missing of ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"]) {
    const t = tree();
    const r = run(t, "setup.sh", { env: { [missing]: undefined } });
    assert.notEqual(r.status, 0, missing);
    assert.match(r.out, new RegExp(missing));
    assert.deepEqual(r.state.calls, [], `${missing}: no wrangler call`);
    rmSync(t.root, { recursive: true, force: true });
  }
});

test("setup.sh refuses a Node older than 20, before any wrangler call", () => {
  const t = tree();
  const old = path.join(t.root, ".oldnode");
  mkdirSync(old);
  writeFileSync(path.join(old, "node"), '#!/bin/sh\n[ "$1" = "--version" ] && { echo v20.19.0; exit 0; }\necho 20.19.0\n');
  chmodSync(path.join(old, "node"), 0o755);
  const r = run(t, "setup.sh", { pathPrefix: old, input: "admin@example.com\n" });
  assert.notEqual(r.status, 0);
  assert.match(r.out, /Node 22/);
  assert.deepEqual(r.state.calls, []);
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh first run: creates D1, writes its id locally, pipes three secrets, then deploys interactively", async () => {
  const t = tree();
  const r = run(t, "setup.sh", { input: "Admin@Example.com, backup@example.org\n" });
  assert.equal(r.status, 0, r.out);
  assert.deepEqual(commands(r.state), ["d1 list", "d1 create pyarcana-accounts", "secret list", "secret put LICENSE_PRIVATE_KEY_PKCS8_B64", "secret put SERVER_PEPPER", "secret put ADMIN_EMAILS", "deploy"]);
  assert.match(r.toml, new RegExp(`^database_id = "${UUID}"$`, "m"));
  assert.doesNotMatch(r.toml, /TODO_/);
  for (const call of r.state.calls.filter((c) => c.argv[0] === "secret" && c.argv[1] === "put")) {
    assert.equal(call.stdinTTY, false, `${call.argv[2]} is piped, never typed at a prompt`);
  }
  const deploy = r.state.calls.find((c) => c.argv[0] === "deploy");
  assert.deepEqual([deploy.stdinTTY, deploy.stdoutTTY], [true, true], "deploy is never piped");
  assert.deepEqual(r.state.deploys, [{ interactive: true, placeholder: false, assets: true, secrets: ["ADMIN_EMAILS", "LICENSE_PRIVATE_KEY_PKCS8_B64", "SERVER_PEPPER"] }]);
  assert.equal(r.state.interactiveSecretPrompts, undefined);
  const jwks = printedJwks(r.out);
  assert.equal(jwks.length, 1, "the public JWK is printed once for src/lib/cloud/config.ts");
  assert.deepEqual(Object.keys(jwks[0]).sort(), ["alg", "crv", "key_ops", "kid", "kty", "use", "x", "y"]);
  assert.equal(jwks[0].kid, "k1");
  assert.equal(await samePair(r.state.secrets.LICENSE_PRIVATE_KEY_PKCS8_B64, jwks[0]), true);
  assert.equal(Buffer.from(r.state.secrets.SERVER_PEPPER, "base64").length, 32);
  assert.equal(r.state.secrets.ADMIN_EMAILS, "admin@example.com,backup@example.org");
  assertNotPrinted(r.out, r.state.secrets.LICENSE_PRIVATE_KEY_PKCS8_B64, "the licence private key");
  assertNotPrinted(r.out, r.state.secrets.SERVER_PEPPER, "SERVER_PEPPER");
  assert.match(r.log, /^static-build base=$/m, "the static build runs with an empty (root) base path");
  assert.match(r.out, /src\/lib\/cloud\/config\.ts/);
  assert.match(r.out, /do not commit/i);
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh is idempotent: a second run reuses D1 and every secret; Enter re-applies the saved ADMIN_EMAILS", () => {
  const t = tree();
  const first = run(t, "setup.sh", { input: "admin@example.com\n" });
  assert.equal(first.status, 0, first.out);
  const r = run(t, "setup.sh", { input: "\n" });
  assert.equal(r.status, 0, r.out);
  const second = commands(r.state).slice(commands(first.state).length);
  // Owner request 7 Oct 2026: the saved list is offered and Enter stores exactly what was shown,
  // so the stored secret can never drift from the list on screen. The key and pepper are kept.
  assert.deepEqual(second, ["d1 list", "secret list", "secret put ADMIN_EMAILS", "deploy"]);
  assert.match(r.out, /Use these admin addresses\? \[Y\/n\]/);
  assert.deepEqual(r.state.secrets, first.state.secrets, "every secret holds the same value");
  assert.equal(r.state.dbs.length, 1);
  assert.equal(printedJwks(r.out).length, 0, "no new key, so no new public JWK");
  assert.match(r.out, /--rotate-key/);
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh refuses to go on while a TODO_ placeholder survives: no secret, no deploy", () => {
  const lost = tree({ createPrintsNoId: true, createLosesDatabase: true });
  const r = run(lost, "setup.sh", { input: "admin@example.com\n" });
  assert.notEqual(r.status, 0);
  assert.match(r.out, /pyarcana-accounts/);
  assert.deepEqual(commands(r.state), ["d1 list", "d1 create pyarcana-accounts", "d1 list"]);
  assert.match(r.toml, /TODO_REPLACE_WITH_D1_DATABASE_ID/);
  rmSync(lost.root, { recursive: true, force: true });

  const other = tree({}, { toml: (s) => s.replace('CREEM_PRODUCT_PRO_MONTHLY = ""', 'CREEM_PRODUCT_PRO_MONTHLY = "TODO_PRODUCT_ID"') });
  const o = run(other, "setup.sh", { input: "admin@example.com\n" });
  assert.notEqual(o.status, 0);
  assert.match(o.out, /TODO_PRODUCT_ID/);
  assert.deepEqual(o.state.secretPuts, []);
  assert.deepEqual(o.state.deploys, []);
  assert.match(o.toml, new RegExp(`database_id = "${UUID}"`), "the D1 id is still written (it is correct)");
  rmSync(other.root, { recursive: true, force: true });
});

test("setup.sh fails closed when secret list fails for any reason but a missing Worker", () => {
  const t = tree({ dbs: [{ uuid: UUID, name: "pyarcana-accounts" }], workerExists: true, failSecretList: true });
  const r = run(t, "setup.sh", { input: "admin@example.com\n" });
  assert.notEqual(r.status, 0);
  assert.match(r.out, /secret list/);
  assert.deepEqual(r.state.secretPuts, [], "an unreadable secret list never re-generates SERVER_PEPPER");
  assert.deepEqual(r.state.deploys, []);
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh refuses a malformed ADMIN_EMAILS before storing anything", () => {
  const t = tree();
  const r = run(t, "setup.sh", { input: "admin@example.com pablo\n" });
  assert.notEqual(r.status, 0);
  assert.match(r.out, /address/);
  assert.deepEqual(r.state.secretPuts, []);
  assert.deepEqual(r.state.deploys, []);
  rmSync(t.root, { recursive: true, force: true });
});

// Owner request, 7 Oct 2026: the admin list is typed once, saved on this computer (never in the
// repository), and offered with Y/n afterwards, so a typo cannot lock the owner out of /admin.
const adminFile = (t) => path.join(t.root, ".config", "pyarcana", "admin-emails");

test("setup.sh saves a confirmed admin list privately on this computer and offers it next time", () => {
  const t = tree();
  const first = run(t, "setup.sh", { input: " Admin@Example.com , backup@example.org\ny\n" });
  assert.equal(first.status, 0, first.out);
  assert.match(first.out, /These addresses:\s+admin@example\.com\s+backup@example\.org/, "shown back normalised before storing");
  assert.equal(readFileSync(adminFile(t), "utf8"), "admin@example.com,backup@example.org\n");
  assert.equal(statSync(adminFile(t)).mode & 0o777, 0o600, "only the owner can read the file");
  assert.equal(statSync(path.dirname(adminFile(t))).mode & 0o777, 0o700);
  assert.equal(first.state.secrets.ADMIN_EMAILS, "admin@example.com,backup@example.org");

  const second = run(t, "setup.sh", { input: "\n" });
  assert.equal(second.status, 0, second.out);
  assert.match(second.out, /Saved on this computer:\s+admin@example\.com\s+backup@example\.org\s+Use these admin addresses\? \[Y\/n\]/);
  assert.doesNotMatch(second.out, /Comma-separated list/, "nothing to type when the saved list is accepted");
  assert.equal(second.state.secrets.ADMIN_EMAILS, "admin@example.com,backup@example.org");
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh: 'n' to the saved list takes a new one, which replaces the file and the secret", () => {
  const t = tree();
  assert.equal(run(t, "setup.sh", { input: "old@example.com\ny\n" }).status, 0);
  const r = run(t, "setup.sh", { input: "n\nnew@example.com\ny\n" });
  assert.equal(r.status, 0, r.out);
  assert.equal(readFileSync(adminFile(t), "utf8"), "new@example.com\n");
  assert.equal(r.state.secrets.ADMIN_EMAILS, "new@example.com");
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh: 'n' at «Store them?» asks again, and three refusals store nothing", () => {
  const t = tree();
  const again = run(t, "setup.sh", { input: "tyop@example.com\nn\ntypo-fixed@example.com\ny\n" });
  assert.equal(again.status, 0, again.out);
  assert.equal(again.state.secrets.ADMIN_EMAILS, "typo-fixed@example.com");
  rmSync(t.root, { recursive: true, force: true });

  const never = tree();
  const r = run(never, "setup.sh", { input: "a@example.com\nn\nb@example.com\nn\nc@example.com\nn\n" });
  assert.notEqual(r.status, 0);
  assert.match(r.out, /No admin list was confirmed/);
  assert.deepEqual(r.state.secretPuts, []);
  assert.deepEqual(r.state.deploys, []);
  assert.equal(existsSync(adminFile(never)), false, "nothing was saved either");
  rmSync(never.root, { recursive: true, force: true });
});

test("setup.sh never offers a malformed saved list, and Enter then keeps the stored secret", () => {
  const configured = { dbs: [{ uuid: UUID, name: "pyarcana-accounts" }], workerExists: true, hasSubdomain: true, secrets: { LICENSE_PRIVATE_KEY_PKCS8_B64: "k", SERVER_PEPPER: "p", ADMIN_EMAILS: "admin@example.com" } };
  const t = tree(configured);
  mkdirSync(path.dirname(adminFile(t)), { recursive: true });
  writeFileSync(adminFile(t), "admin@example.com pablo\n");
  const r = run(t, "setup.sh", { input: "\n" });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /is not valid, so it is not offered/);
  assert.doesNotMatch(r.out, /Use these admin addresses/);
  assert.match(r.out, /ADMIN_EMAILS: kept\./);
  assert.deepEqual(r.state.secretPuts, []);
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh keeps the admin file where PYARCANA_ADMIN_FILE or XDG_CONFIG_HOME says", () => {
  const t = tree();
  const own = path.join(t.root, "elsewhere", "admins");
  assert.equal(run(t, "setup.sh", { input: "admin@example.com\ny\n", env: { PYARCANA_ADMIN_FILE: own } }).status, 0);
  assert.equal(readFileSync(own, "utf8"), "admin@example.com\n");
  const xdg = path.join(t.root, "xdg");
  assert.equal(run(t, "setup.sh", { input: "admin@example.com\ny\n", env: { XDG_CONFIG_HOME: xdg } }).status, 0);
  assert.equal(readFileSync(path.join(xdg, "pyarcana", "admin-emails"), "utf8"), "admin@example.com\n");
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh --rotate-key <kid>: replaces only the licence key, updates LICENSE_KEY_ID, says what to keep", async () => {
  const configured = { dbs: [{ uuid: UUID, name: "pyarcana-accounts" }], workerExists: true, hasSubdomain: true, secrets: { LICENSE_PRIVATE_KEY_PKCS8_B64: "old-key", SERVER_PEPPER: "old-pepper", ADMIN_EMAILS: "admin@example.com" } };
  for (const args of [["--rotate-key"], ["--rotate-key", "k1"], ["--rotate-key", "bad kid"]]) {
    const t = tree(configured);
    const r = run(t, "setup.sh", { args, input: "\n" });
    assert.notEqual(r.status, 0, args.join(" "));
    assert.deepEqual(r.state.calls, [], `${args.join(" ")}: refused before any wrangler call`);
    rmSync(t.root, { recursive: true, force: true });
  }
  const t = tree(configured);
  const r = run(t, "setup.sh", { args: ["--rotate-key", "k2"], input: "\n" });
  assert.equal(r.status, 0, r.out);
  assert.deepEqual(r.state.secretPuts, ["LICENSE_PRIVATE_KEY_PKCS8_B64"]);
  assert.equal(r.state.secrets.SERVER_PEPPER, "old-pepper");
  assert.match(r.toml, /^LICENSE_KEY_ID = "k2"$/m);
  const jwks = printedJwks(r.out);
  assert.equal(jwks.length, 1);
  assert.equal(jwks[0].kid, "k2");
  assert.equal(await samePair(r.state.secrets.LICENSE_PRIVATE_KEY_PKCS8_B64, jwks[0]), true);
  assert.match(r.out, /LICENSE_PREV_PUBLIC_JWK/);
  assert.equal(r.state.deploys.length, 1, "the new kid is deployed right after the new key");
  rmSync(t.root, { recursive: true, force: true });
});

test("deploy.sh: root static build, then cloud-headers, then an interactive wrangler deploy", () => {
  const t = tree({ dbs: [{ uuid: UUID, name: "pyarcana-accounts" }], workerExists: true }, { toml: (s) => s.replace("TODO_REPLACE_WITH_D1_DATABASE_ID", UUID) });
  const r = run(t, "deploy.sh");
  assert.equal(r.status, 0, r.out);
  assert.deepEqual(r.log.trim().split("\n"), ["static-build base=", "cloud-headers out", "wrangler deploy"]);
  assert.deepEqual(r.state.deploys, [{ interactive: true, placeholder: false, assets: true, secrets: [] }]);
  assert.ok(existsSync(path.join(t.root, "out", "_headers")));
  rmSync(t.root, { recursive: true, force: true });
});

test("deploy.sh refuses a placeholder, a failed build, and a build that came out under /pyarcana", () => {
  const placeholder = tree();
  const p = run(placeholder, "deploy.sh");
  assert.notEqual(p.status, 0);
  assert.match(p.out, /TODO_REPLACE_WITH_D1_DATABASE_ID/);
  assert.match(p.out, /setup\.sh/);
  assert.equal(p.log, "", "nothing built, nothing deployed");
  rmSync(placeholder.root, { recursive: true, force: true });

  const withId = { toml: (s) => s.replace("TODO_REPLACE_WITH_D1_DATABASE_ID", UUID) };
  // A failed build leaves the PREVIOUS out/ in place (build_static_export.mjs replaces out/ only on
  // success), so a stale, root-built export must not be deployed either.
  const failed = tree({}, withId);
  mkdirSync(path.join(failed.root, "out"));
  writeFileSync(path.join(failed.root, "out", "index.html"), "<html>stale</html>");
  writeFileSync(path.join(failed.root, "out", "deployment.json"), '{"base_path": ""}\n');
  const f = run(failed, "deploy.sh", { env: { FAKE_BUILD_FAIL: "1" } });
  assert.notEqual(f.status, 0);
  assert.deepEqual(f.state.deploys, []);
  rmSync(failed.root, { recursive: true, force: true });

  const based = tree({}, withId);
  const b = run(based, "deploy.sh", { env: { FAKE_BUILD_MODE: "current" } });
  assert.notEqual(b.status, 0);
  assert.match(b.out, /\/pyarcana/);
  assert.match(b.out, /build_static_export\.mjs/);
  assert.deepEqual(b.state.deploys, [], "a site built for github.io paths is never deployed at the root");
  rmSync(based.root, { recursive: true, force: true });
});

test("deploy.sh without scripts/cloud-headers.mjs says so and still deploys", () => {
  const t = tree({}, { headers: false, toml: (s) => s.replace("TODO_REPLACE_WITH_D1_DATABASE_ID", UUID) });
  const r = run(t, "deploy.sh");
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /cloud-headers\.mjs/);
  assert.deepEqual(r.log.trim().split("\n"), ["static-build base=", "wrangler deploy"]);
  rmSync(t.root, { recursive: true, force: true });
});

// --- the prompts and redeploy.sh (owner request 2026-10-05) -----------------------------------------
// A bare `read -rs` on an empty line looked like a program still working; the branch was checked by
// eye. setup.sh now asks for what is missing with a visible prompt, and redeploy.sh checks the
// branch, the local changes and the pull before anything is deployed.

const TOKEN = "cf-token-for-the-prompt-test-0123456789abcdef";

// The test types ahead (all input is written at once), and a terminal echoes typed-ahead text before
// `read -s` turns echo off. A person types after the prompt, so the check starts at the prompt.
const afterPrompt = (out) => out.slice(out.indexOf("Paste your Cloudflare API token"));

/**
 * Run setup.sh under a pty and answer each prompt only once it is on screen, as a person does, so
 * the terminal's echo (or its absence) is the real one.
 * @param {Object} t Tree from tree().
 * @param {Array<[RegExp, string]>} answers Prompt pattern and the line to type after it, in order.
 * @param {Object} env Environment overrides (undefined removes).
 * @returns {Promise<{status: number, out: string, state: Object}>} Result.
 */
function runTyped(t, answers, env) {
  const full = { PATH: `${t.bin}:${process.env.PATH}`, HOME: t.root, SHELL: "/bin/bash", TERM: "dumb", PYARCANA_WRANGLER: path.join(t.bin, "wrangler"), FAKE_WRANGLER_STATE: t.stateFile, FAKE_LOG: t.log, PYARCANA_CF_API: CF_API, ...env };
  for (const [key, value] of Object.entries(full)) {
    if (value === undefined) {
      delete full[key];
    }
  }
  return new Promise((resolve) => {
    const child = spawn("script", ["-qec", `bash '${path.join(t.billing, "scripts", "setup.sh")}'`, "/dev/null"], { cwd: t.root, env: full });
    let out = "";
    let next = 0;
    let from = 0; // where the next prompt is looked for: after the previous one
    const timer = setTimeout(() => child.kill(), 60000);
    child.stdout.on("data", (chunk) => {
      out += chunk;
      while (next < answers.length) {
        const at = out.slice(from).search(answers[next][0]);
        if (at < 0) {
          break;
        }
        from += at + 1;
        child.stdin.write(`${answers[next][1]}\n`);
        next += 1;
      }
    });
    child.stderr.on("data", (chunk) => { out += chunk; });
    child.on("close", (status) => {
      clearTimeout(timer);
      resolve({ status, out, state: JSON.parse(readFileSync(t.stateFile, "utf8")) });
    });
  });
}

test("setup.sh asks for a missing token and account id with visible prompts; typing the token shows nothing", async () => {
  const t = tree();
  const r = await runTyped(t, [
    [/Cloudflare account ID/, "0123456789abcdef0123456789abcdef"],
    [/Paste your Cloudflare API token/, TOKEN],
    [/Comma-separated list/, "admin@example.com"],
    [/Store them\? \[Y\/n\]/, "y"]
  ], { CLOUDFLARE_API_TOKEN: undefined, CLOUDFLARE_ACCOUNT_ID: undefined });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /Paste your Cloudflare API token and press Enter.*typing stays hidden/);
  assert.match(r.out, new RegExp(`Token received \\(${TOKEN.length} characters\\)`));
  assert.match(r.out, /0123456789abcdef0123456789abcdef/, "the account id is not secret: it echoes, so a typo shows");
  assertNotPrinted(r.out, TOKEN, "the API token");
  assert.equal(r.state.deploys.length, 1, "it went on to deploy");
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh: Enter at the token prompt still stops before any wrangler call", () => {
  const t = tree();
  const r = run(t, "setup.sh", { env: { CLOUDFLARE_API_TOKEN: undefined }, input: "\n" });
  assert.notEqual(r.status, 0);
  assert.match(r.out, /CLOUDFLARE_API_TOKEN is not set/);
  assert.deepEqual(r.state.calls, []);
  rmSync(t.root, { recursive: true, force: true });
});

const GIT_ENV = { GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@example.test", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@example.test", GIT_CONFIG_NOSYSTEM: "1" };
const BRANCH = "claude/gifted-lamport-8ddc84";

function git(cwd, ...args) {
  const r = spawnSync("git", args, { cwd, env: { ...process.env, ...GIT_ENV, HOME: cwd }, encoding: "utf8" });
  assert.equal(r.status, 0, `git ${args.join(" ")}: ${r.stderr}`);
  return r.stdout.trim();
}

/** tree() as a git checkout on BRANCH, with an origin that has one commit more. */
function deployCheckout() {
  const t = tree();
  writeFileSync(path.join(t.root, ".gitignore"), ".bin/\nstate.json\nlog.txt\nout/\norigin.git/\nother/\n");
  git(t.root, "init", "-q", "-b", BRANCH);
  git(t.root, "add", "-A");
  git(t.root, "commit", "-qm", "first");
  git(t.root, "init", "-q", "--bare", "origin.git");
  git(t.root, "remote", "add", "origin", path.join(t.root, "origin.git"));
  git(t.root, "push", "-q", "-u", "origin", BRANCH);
  // Someone pushes the new work: the deploy checkout is one commit behind.
  git(t.root, "clone", "-q", "-b", BRANCH, path.join(t.root, "origin.git"), "other");
  writeFileSync(path.join(t.root, "other", "NEW.txt"), "new\n");
  git(path.join(t.root, "other"), "add", "NEW.txt");
  git(path.join(t.root, "other"), "commit", "-qm", "the new work");
  git(path.join(t.root, "other"), "push", "-q");
  return t;
}

const redeploy = (t, opts = {}) => run(t, "redeploy.sh", { ...opts, env: { ...GIT_ENV, ...(opts.env || {}) } });

test("redeploy.sh stops on the wrong branch, and with other local changes, before touching anything", () => {
  const t = deployCheckout();
  git(t.root, "checkout", "-q", "-b", "main");
  const wrong = redeploy(t, { input: "\n" });
  assert.notEqual(wrong.status, 0);
  assert.match(wrong.out, /STOP: this checkout is on "main", but pyarcana\.dev deploys from "claude\/gifted-lamport-8ddc84"/);
  assert.match(wrong.out, /git checkout claude\/gifted-lamport-8ddc84/);
  git(t.root, "checkout", "-q", BRANCH);
  writeFileSync(path.join(t.root, "package.json"), '{"name":"changed"}\n');
  const dirty = redeploy(t, { input: "\n" });
  assert.notEqual(dirty.status, 0);
  assert.match(dirty.out, /STOP: this checkout has local changes besides workers\/billing\/wrangler\.toml/);
  assert.match(dirty.out, /package\.json/);
  assert.match(dirty.out, /What changed \(first 40 lines\):[\s\S]*\+\{"name":"changed"\}/, "the stop shows the change itself");
  assert.match(dirty.out, /git checkout -- <file>/);
  for (const r of [wrong, dirty]) {
    assert.deepEqual(r.state.calls, [], "no wrangler call");
    assert.doesNotMatch(r.log, /bun/, "no install, no build");
  }
  assert.equal(git(t.root, "rev-list", "--count", "HEAD"), "1", "nothing pulled");
  rmSync(t.root, { recursive: true, force: true });
});

test("redeploy.sh: right branch with the local D1 id: pulls the new work, installs, asks for the token, deploys", () => {
  const t = deployCheckout();
  const toml = path.join(t.billing, "wrangler.toml");
  writeFileSync(toml, readFileSync(toml, "utf8").replace("TODO_REPLACE_WITH_D1_DATABASE_ID", UUID)); // what setup.sh leaves
  const r = redeploy(t, { env: { CLOUDFLARE_API_TOKEN: undefined }, input: `${TOKEN}\nadmin@example.com\n` });
  assert.equal(r.status, 0, r.out);
  assert.equal(git(t.root, "log", "-1", "--format=%s"), "the new work", "pulled");
  assert.match(r.out, /Deploying: [0-9a-f]+ the new work/);
  assert.match(r.log, /^bun install/m);
  assert.match(r.out, /Paste your Cloudflare API token/);
  assertNotPrinted(afterPrompt(r.out), TOKEN, "the API token");
  assert.equal(r.state.deploys.length, 1);
  assert.ok(r.out.indexOf("1/4") < r.out.indexOf("2/4") && r.out.indexOf("3/4") < r.out.indexOf("4/4"), "the steps are announced in order");
  rmSync(t.root, { recursive: true, force: true });
});

// --- an exported token is offered, never used silently, and checked with Cloudflare first ------------
// Owner's redeploy, 5 Oct 2026: a token left exported from an earlier deploy (revoked since) was used
// without asking, and wrangler failed with "Invalid access token".

const REVOKED = "revoked-old-token-0123456789abcdef";
const FRESH = "fresh-token-0123456789abcdefghij";

test("setup.sh offers the exported account id and token instead of using them silently; no character of the token is shown", () => {
  const t = tree();
  const r = run(t, "setup.sh", { reuse: false, env: { CLOUDFLARE_API_TOKEN: REVOKED }, input: `\nn\n${FRESH}\nadmin@example.com\n` });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /Cloudflare account ID in this terminal: 0123456789abcdef0123456789abcdef\. Use it\? \[Y\/n\]/);
  assert.match(r.out, new RegExp(`A Cloudflare API token is already set in this terminal \\(${REVOKED.length} characters, not shown\\)\\. Use it\\? \\[Y/n\\]`));
  assert.match(r.out, /Cloudflare accepts the token \(active\)/);
  assertNotPrinted(r.out.slice(r.out.indexOf("Use it?")), FRESH, "the new token");
  assertNotPrinted(r.out, REVOKED, "the old token");
  assert.equal(r.state.deploys.length, 1);
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh: a revoked token is caught before any wrangler call, said plainly, and a new one is asked for", () => {
  const t = tree();
  const r = run(t, "setup.sh", { env: { CLOUDFLARE_API_TOKEN: REVOKED }, input: `${FRESH}\nadmin@example.com\n` });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /Cloudflare does not recognise this token \(revoked, expired or mistyped\)\. Make a new token \(or copy the current one\) and paste it\./);
  assert.equal(r.state.deploys.length, 1, "deployed with the new token");
  rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh: three refused tokens, an expired one, Cloudflare unreachable, or a non-Cloudflare answer stop before any wrangler call", () => {
  const refused = tree();
  const r1 = run(refused, "setup.sh", { env: { CLOUDFLARE_API_TOKEN: REVOKED }, input: `${REVOKED}\n${REVOKED}\n` });
  assert.notEqual(r1.status, 0);
  assert.match(r1.out, /Nothing was changed\. Make a new token \(Workers Scripts and D1, Edit\)/);
  assert.deepEqual(r1.state.calls, [], "no wrangler call");
  const expired = tree();
  const r2 = run(expired, "setup.sh", { env: { CLOUDFLARE_API_TOKEN: "expired-token-0123456789abcdef" }, input: "" });
  assert.notEqual(r2.status, 0);
  assert.match(r2.out, /Cloudflare says the token is expired/);
  assert.deepEqual(r2.state.calls, []);
  const offline = tree();
  const r3 = run(offline, "setup.sh", { env: { PYARCANA_CF_API: "http://127.0.0.1:1" }, input: "" });
  assert.notEqual(r3.status, 0);
  assert.match(r3.out, /Could not check the token: could not reach Cloudflare/);
  assert.deepEqual(r3.state.calls, []);
  // A proxy or firewall page is not Cloudflare refusing the token: it must not be called "revoked".
  const blocked = tree();
  const r4 = run(blocked, "setup.sh", { env: { PYARCANA_CF_API: `${CF_API}/blocked` }, input: "" });
  assert.notEqual(r4.status, 0);
  assert.match(r4.out, /Could not check the token: HTTP 403 that is not Cloudflare's answer \(Host not in allowlist/);
  assert.doesNotMatch(r4.out, /does not recognise this token/);
  assert.deepEqual(r4.state.calls, []);
  rmSync(blocked.root, { recursive: true, force: true });
  for (const t of [refused, expired, offline]) rmSync(t.root, { recursive: true, force: true });
});

test("setup.sh accepts an account-owned token (verified on the account's own endpoint)", () => {
  const t = tree();
  const r = run(t, "setup.sh", { env: { CLOUDFLARE_API_TOKEN: "cf-account-token-0123456789abcdef" }, input: "admin@example.com\n" });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /Cloudflare accepts the token \(active\)/);
  rmSync(t.root, { recursive: true, force: true });
});
