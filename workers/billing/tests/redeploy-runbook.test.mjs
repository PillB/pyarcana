/**
 * REDEPLOY.md, the owner's click-by-click redeploy runbook, held to the scripts it describes.
 *
 * A runbook goes wrong silently: a script's prompt is reworded, a path moves, the pinned wrangler
 * version changes, and the page still reads fine while it sends the owner looking for a line that
 * no longer appears. Each check below runs twice: on the real files (must pass) and on a copy with
 * the drift a future round could make (must fail, naming what drifted). Without the second half a
 * green run would only prove that the checker accepts the text it was written from.
 *
 * Checks:
 *   1. every output line the D1 step quotes is still printed by redeploy.sh, setup.sh or deploy.sh;
 *   2. every repository path the runbook names exists;
 *   3. the wrangler version it names is the one common.sh pins;
 *   4. it holds no mailbox other than role/example addresses, no Cloudflare token and no 32-hex id;
 *   5. every step that sends the owner to a dashboard cites the official doc it was checked against;
 *   6. README.md points to it.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BILLING = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(BILLING, "..", "..");
const read = (p) => readFileSync(path.join(BILLING, p), "utf8");

const RUNBOOK = read("REDEPLOY.md");
const README = read("README.md");
const SCRIPT_FILES = ["scripts/redeploy.sh", "scripts/setup.sh", "scripts/deploy.sh", "scripts/common.sh"];
const TOML = read("wrangler.toml");

const squash = (s) => s.replace(/\s+/g, " ");
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One `### ` step's text, up to the next heading of level 2 or 3. */
function section(doc, heading) {
  const start = doc.indexOf(`### ${heading}`);
  assert.ok(start >= 0, `REDEPLOY.md has no step "### ${heading}"; the test reads that step's quoted output.`);
  const rest = doc.slice(start + 4);
  const end = rest.search(/\n##+ /);
  return end < 0 ? rest : rest.slice(0, end);
}

/** The scripts' text with the values the owner actually sees substituted in. */
function renderScripts(texts, toml) {
  const worker = /^name *= *"([^"]+)"/m.exec(toml)?.[1];
  const d1 = /database_name *= *"([^"]+)"/.exec(toml)?.[1];
  assert.ok(worker && d1, "wrangler.toml lost its worker name or D1 database_name; the runbook names both.");
  return squash(texts.join("\n"))
    .replaceAll('\\"', '"')
    .replaceAll("$DEPLOY_BRANCH", "main")
    .replaceAll("$WORKER_NAME", worker)
    .replaceAll("$D1_NAME", d1)
    .replaceAll("${#CLOUDFLARE_API_TOKEN}", "N");
}

/**
 * Check 1. Backticked text with a space in the D1 step is a line the owner should see on screen.
 * `<...>` and `...` stand for variable parts. Keystrokes (`Ctrl + C`) are not output.
 * @returns {string[]} quoted lines no script prints
 */
export function unprintedQuotes(doc, scripts) {
  const quotes = [...section(doc, "D1.").matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);
  return quotes
    .filter((q) => q.includes(" ") && !/^(Ctrl|Cmd) \+ /.test(q))
    .filter((q) => {
      const pattern = squash(q).split(/<[^>]+>|\.\.\./).map(escapeRe).join(".+?");
      return !new RegExp(pattern).test(scripts);
    });
}

/** Check 2. @returns {string[]} named repository paths that do not exist */
export function missingPaths(doc, root) {
  const named = [...doc.matchAll(/`((?:workers|scripts|src)\/[\w./-]+)`/g)].map((m) => m[1]);
  return [...new Set(named)].filter((p) => !existsSync(path.join(root, p)));
}

/** Check 3. @returns {string[]} wrangler versions named that differ from the pinned one */
export function wranglerDrift(doc, commonSh) {
  const pinned = /WRANGLER_PKG:-wrangler@([\d.]+)/.exec(commonSh)?.[1];
  assert.ok(pinned, "common.sh no longer pins wrangler as WRANGLER_PKG:-wrangler@X.Y.Z; update this test with it.");
  const named = [...doc.matchAll(/wrangler@([\d.]+)/g)].map((m) => m[1]);
  assert.ok(named.length > 0, "REDEPLOY.md names no wrangler@version; R2 must pin the scripts' version.");
  return named.filter((v) => v !== pinned).map((v) => `wrangler@${v} (scripts pin ${pinned})`);
}

/** Check 4. @returns {string[]} things that must never be in a public runbook */
export function leaks(doc) {
  const found = [];
  for (const [, addr, domain] of doc.matchAll(/\b([\w.+-]+@([\w-]+(?:\.[\w-]+)+))\b/g)) {
    if (!/^(example\.(com|org|net)|pyarcana\.dev)$/i.test(domain) && !/^wrangler$/.test(addr.split("@")[0])) {
      found.push(`mailbox ${addr}`);
    }
  }
  for (const [token] of doc.matchAll(/\bcfut_[A-Za-z0-9_-]{8,}/g)) found.push(`Cloudflare token ${token.slice(0, 9)}…`);
  for (const [hex] of doc.matchAll(/\b[0-9a-f]{32}\b/gi)) found.push(`32-hex id ${hex.slice(0, 6)}…`);
  return found;
}

/** Check 5. @returns {string[]} steps that send the owner to a dashboard without a Docs: line */
export function uncitedSteps(doc) {
  const DASHBOARDS = /dash\.cloudflare\.com|Cloudflare dashboard|console\.cloud\.google\.com|https:\/\/github\.com\//;
  const OFFICIAL = /Docs: \[[^\]]+\]\(https:\/\/(developers\.cloudflare\.com|docs\.github\.com|support\.google\.com|developers\.google\.com|nodejs\.org|bun\.com)\//;
  return doc
    .split(/\n(?=### )/)
    .slice(1)
    .map((s) => s.split(/\n## /)[0])
    .filter((s) => DASHBOARDS.test(s) && !OFFICIAL.test(s))
    .map((s) => s.split("\n")[0]);
}

const SCRIPTS = renderScripts(SCRIPT_FILES.map(read), TOML);
const COMMON = read("scripts/common.sh");

test("every line the D1 step quotes is printed by the deploy scripts", () => {
  assert.deepEqual(unprintedQuotes(RUNBOOK, SCRIPTS), [], "REDEPLOY.md quotes output the scripts no longer print: reword the runbook to the script's current text");
  // Drift: a script rewords a prompt. The quote must be reported, by its text.
  const reworded = SCRIPTS.replace("Use these admin addresses? [Y/n]", "Keep the saved admins? [Y/n]");
  assert.notEqual(reworded, SCRIPTS, "the drift model found nothing to reword; the quote it targets is gone");
  assert.deepEqual(unprintedQuotes(RUNBOOK, reworded), ["Use these admin addresses? [Y/n]"]);
  // Drift: the branch default moves away from main. The templated stage line must be reported.
  const branch = renderScripts(SCRIPT_FILES.map(read), TOML).replaceAll("latest main", "latest release");
  assert.ok(unprintedQuotes(RUNBOOK, branch).includes("2/4  Updating to the latest main"));
});

test("every repository path the runbook names exists", () => {
  assert.deepEqual(missingPaths(RUNBOOK, ROOT), [], "REDEPLOY.md names paths that are not in the repository");
  const moved = RUNBOOK + "\nRun `workers/billing/scripts/redeploy-old.sh`.\n";
  assert.deepEqual(missingPaths(moved, ROOT), ["workers/billing/scripts/redeploy-old.sh"]);
});

test("the wrangler version in the runbook is the one the scripts pin", () => {
  assert.deepEqual(wranglerDrift(RUNBOOK, COMMON), [], "REDEPLOY.md and common.sh name different wrangler versions");
  const bumped = COMMON.replace(/WRANGLER_PKG:-wrangler@[\d.]+/, "WRANGLER_PKG:-wrangler@4.200.0");
  assert.equal(wranglerDrift(RUNBOOK, bumped).length > 0, true, "a version bump in common.sh must flag the runbook");
});

test("the runbook holds no personal mailbox, token or account id", () => {
  assert.deepEqual(leaks(RUNBOOK), [], "REDEPLOY.md is public: remove what is listed");
  const leaked = `${RUNBOOK}\nSign in as someone@gmail.com, token cfut_AbCdEf123456, account 0123456789abcdef0123456789abcdef.\n`;
  assert.deepEqual(leaks(leaked).map((s) => s.split(" ")[0]), ["mailbox", "Cloudflare", "32-hex"]);
});

test("every step that opens a dashboard cites the official doc it was checked against", () => {
  assert.deepEqual(uncitedSteps(RUNBOOK), [], "these steps send the owner to a dashboard without a Docs: link");
  const uncited = RUNBOOK.replace(/\nDocs: \[Bot Fight Mode\][^\n]*\n/, "\n");
  assert.notEqual(uncited, RUNBOOK, "the drift model found no Bot Fight Mode Docs: line to remove");
  assert.deepEqual(uncitedSteps(uncited), ["### B6. Check Bot Fight Mode is off on `pyarcana.dev`"]);
  const blog = RUNBOOK.replace("Docs: [Bot Fight Mode](https://developers.cloudflare.com/", "Docs: [Bot Fight Mode](https://someblog.example/");
  assert.equal(uncitedSteps(blog).length, 1, "a non-official source must not count as a citation");
});

test("README's Setup order points to the runbook", () => {
  const setup = README.slice(README.indexOf("## Setup order"), README.indexOf("## Configuration"));
  assert.match(setup, /\(REDEPLOY\.md\)/, "README.md, Setup order: link REDEPLOY.md so the owner finds the step-by-step version");
});
