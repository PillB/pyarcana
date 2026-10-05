#!/usr/bin/env node
/**
 * Billing/accounts test runner (DESIGN-v2 §9).
 *
 *   node scripts/run_billing_tests.mjs               # every group
 *   node scripts/run_billing_tests.mjs --only worker # one group (repeatable)
 *
 * Groups:
 *   worker  workers/billing/tests/*.test.mjs on plain Node (node:sqlite D1 fake)
 *   client  src/lib/cloud/__tests__/*.test.ts through `--import tsx`
 *   lint    ESLint's `complexity` rule at 15 (the chore(lint) ceiling) over the
 *           worker, this runner, src/lib/cloud and src/components/account.
 *           scripts/complexity_gate.mjs only lints src/**, as a ratchet, and
 *           `npm run lint` sets no complexity rule, so without this step a
 *           worker function could grow past 15 and pass CI. It fails on any
 *           complexity message or any file ESLint cannot parse; other rules
 *           are `npm run lint`'s job and are only counted here.
 *
 * Why a runner instead of `node --test <glob>`:
 * - a glob that matches nothing prints "# tests 0" and exits 0, and a pipe into a
 *   counter hides failures under sh without pipefail;
 * - so every suite is an EXPLICIT file with its own FLOOR (the number of tests it
 *   had when the floor was set). The run fails on any failing test, on a missing
 *   file, or on any suite that passes fewer tests than its floor. Skipped and todo
 *   tests never count toward a floor.
 * Floors catch loss; they are not ceilings. Raise a floor when you add tests.
 *
 * Needs Node >= 22.13 (node:sqlite without a flag backs the D1 fake). The
 * client group passes `execArgv` to node:test's run(); on a Node that ignored
 * it, the .ts files would fail to load, so the run fails closed.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { run } from "node:test";
import { spec } from "node:test/reporters";
import { fileURLToPath } from "node:url";

const MIN_NODE = [22, 13, 0];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKER_TESTS = "workers/billing/tests";
const CLIENT_TESTS = "src/lib/cloud/__tests__";
const TSX = Object.freeze(["--import", "tsx"]);

/** The complexity gate (group "lint"). */
export const LINT = Object.freeze({
  group: "lint",
  ceiling: 15,
  targets: Object.freeze(["workers/billing", "scripts/run_billing_tests.mjs", "src/lib/cloud", "src/components/account"])
});

/** Worker suites: group, file (repo-relative) and floor. */
const WORKER_SUITES = [
  ["ads", 8],
  ["d1-fake", 11],
  ["crypto", 12],
  ["http", 15],
  ["qa", 7],
  ["schema", 18],
  ["ratelimit", 6],
  ["address", 5],
  ["config", 9],
  ["email", 18],
  ["accounts", 10],
  ["sessions", 12],
  ["router", 18],
  ["logincodes", 12],
  ["auth-email", 19],
  ["jwt", 18],
  ["google", 29],
  ["microsoft", 26],
  ["session-routes", 5],
  ["retention", 8],
  ["usage", 14],
  ["wrangler", 10],
  ["audit", 3],
  ["runner", 6],
  // Stage 1b: entitlement, trial, admin, progress, reports, privacy.
  ["access", 35],
  ["me", 6],
  ["trial", 12],
  ["admin-auth", 10],
  ["admin-grants", 9],
  ["admin-roles", 5],
  ["admin-accounts", 4],
  ["progress", 9],
  ["reports", 22],
  ["privacy", 8],
  // Review round 1.
  ["identities", 6],
  // Stage 2a: one-origin hosting (DESIGN-v3 §A) and the ads region check (§E).
  ["hosting", 5],
  ["geo", 4],
  // Stage 2b: payments (DESIGN-v2 §4-§7): money, checkout, both webhooks,
  // refresh/cancel, reconciliation.
  ["money", 6],
  ["checkout", 14],
  ["webhook-mp", 23],
  ["webhook-creem", 16],
  ["subscription", 10],
  ["reconcile", 6],
  // Stage 2c: the licence (DESIGN-v3-delta D-ORCH-03), events and experiments (DESIGN-v3 §F),
  // surveys and consents (§G), and their export/delete/retention.
  ["license", 9],
  ["experiments", 10],
  ["stats", 5],
  ["experiment-results", 8],
  ["surveys", 7],
  ["measurement-privacy", 3],
  // Stage 2d: the owner's operator scripts (setup.sh, deploy.sh) and their helper; the second
  // runs both scripts under a real pty (util-linux `script`) against a fake wrangler.
  ["ops", 7],
  ["operator-scripts", 15]
].map(([name, floor]) => ({ group: "worker", file: `${WORKER_TESTS}/${name}.test.mjs`, floor }));

/**
 * Client suites (src/lib/cloud), run through tsx. Floors: counts on 2026-09-28.
 * Review round 2 (2026-09-29): admin-api at its committed count (11 at bacc6c9);
 * legal-content and pricing-view, then on disk but not yet committed, at their
 * counts that day.
 */
const CLIENT_SUITES = [
  ["a11y-render", 7],
  ["account-api", 10],
  ["ad-slot-survey", 13],
  ["admin-api", 11],
  ["admin-detail", 3],
  ["admin-ads", 3],
  ["admin-usage", 4],
  ["admin-qa", 5],
  ["stage-labels", 3],
  ["ads-surveys", 18],
  ["api", 10],
  ["billing-ui", 11],
  ["client-fixes", 22],
  ["cloud-i18n", 3],
  ["config", 14],
  ["consent-qa", 7],
  ["experiments", 10],
  ["force-sync", 12],
  ["gate", 16],
  ["handoff", 8],
  ["handoff-import", 6],
  ["headers", 11],
  ["hotkeys", 2],
  ["import-boundary", 2],
  ["legal-content", 9],
  ["licence", 15],
  ["me-extras", 1],
  ["ms-callback", 10],
  ["offer", 7],
  ["oidc", 15],
  ["plans", 4],
  ["prerender", 14],
  ["pricing-view", 5],
  ["primitives", 10],
  ["privacy-notice", 5],
  ["progress-merge", 17],
  ["progress-sync", 27],
  ["progress-sync-efficiency", 7],
  ["qa-report", 21],
  ["qa-session-stats", 4],
  ["qa-tour-layout", 6],
  ["remote-apply", 4],
  ["review-r3", 11],
  ["review-r4", 12],
  ["runtime", 13],
  ["session-access", 20],
  // Sesión 0 (/empezar): OS detection, ticks, screenshot records, content rules (2026-10-05).
  ["setup-intro", 30],
  ["storage-resilience", 4],
  ["ui-state", 12]
].map(([name, floor]) => ({ group: "client", file: `${CLIENT_TESTS}/${name}.test.ts`, floor, execArgv: TSX }));

/** Every suite: group, file (repo-relative), floor and, for TypeScript, execArgv. */
export const SUITES = [...WORKER_SUITES, ...CLIENT_SUITES];

/**
 * True when the running Node is at least `min`.
 * @param {string} version process.versions.node.
 * @param {number[]} min [major, minor, patch].
 * @returns {boolean} Supported.
 */
export function nodeAtLeast(version, min) {
  const parts = String(version).split(".").map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < min.length; i += 1) {
    if (parts[i] !== min[i]) {
      return parts[i] > min[i];
    }
  }
  return true;
}

/**
 * Parse `--only <group>` flags (repeatable, comma lists allowed).
 * @param {string[]} argv Arguments after the script.
 * @returns {{groups: string[]|null, error?: string}} Selection (null = all).
 */
export function parseArgs(argv) {
  const groups = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] !== "--only") {
      return { groups: null, error: `unknown argument: ${argv[i]}` };
    }
    const value = argv[i + 1];
    if (!value) {
      return { groups: null, error: "--only needs a group name" };
    }
    groups.push(...value.split(",").map((g) => g.trim()).filter(Boolean));
    i += 1;
  }
  return { groups: groups.length ? groups : null };
}

/**
 * Pick the suites for a selection, refusing unknown groups.
 * @param {Object[]} suites All suites.
 * @param {string[]|null} groups Selected groups.
 * @returns {{selected: Object[], error?: string}} Suites.
 */
export function selectSuites(suites, groups) {
  if (!groups) {
    return { selected: suites };
  }
  const known = new Set(suites.map((s) => s.group).concat(LINT.group));
  const unknown = groups.filter((g) => !known.has(g));
  if (unknown.length) {
    return { selected: [], error: `unknown group(s): ${unknown.join(", ")} (known: ${[...known].join(", ")})` };
  }
  return { selected: suites.filter((s) => groups.includes(s.group)) };
}

/**
 * Compare per-file pass counts with the floors.
 * @param {Object[]} suites Selected suites.
 * @param {Map<string, number>} passes Absolute file -> passing tests.
 * @param {Set<string>} missing Absolute paths of missing files.
 * @returns {Object[]} One row per suite with `ok`.
 */
export function checkFloors(suites, passes, missing) {
  return suites.map((suite) => {
    const absolute = path.resolve(ROOT, suite.file);
    const passed = passes.get(absolute) || 0;
    return { ...suite, passed, missing: missing.has(absolute), ok: !missing.has(absolute) && passed >= suite.floor };
  });
}

/**
 * Decide a lint run: any complexity message, or any file ESLint could not
 * parse, fails it. Other rules' messages are counted, not gated.
 * @param {Array<{filePath: string, messages: Object[]}>} results ESLint results.
 * @returns {{ok: boolean, offenders: Array<{file: string, line: number, message: string}>, other: number}} Verdict.
 */
export function lintVerdict(results) {
  const offenders = [];
  let other = 0;
  for (const result of results) {
    for (const m of result.messages) {
      if (m.ruleId === "complexity" || m.fatal) {
        offenders.push({ file: path.relative(ROOT, result.filePath), line: m.line, message: m.message });
      } else {
        other += 1;
      }
    }
  }
  return { ok: offenders.length === 0, offenders, other };
}

/**
 * Run ESLint's complexity rule over LINT.targets (ignore patterns off, so
 * this runner, which the repo's ESLint config ignores under scripts/**, is
 * linted too).
 * @returns {Promise<{ok: boolean, offenders: Object[], other: number, files: number}>} Verdict.
 */
async function runLint() {
  const { ESLint } = await import("eslint");
  const eslint = new ESLint({
    cwd: ROOT,
    ignore: false,
    overrideConfigFile: path.join(ROOT, "eslint.config.mjs"),
    overrideConfig: { rules: { complexity: ["error", LINT.ceiling] } }
  });
  const results = await eslint.lintFiles([...LINT.targets]);
  return { ...lintVerdict(results), files: results.length };
}

/**
 * Print the lint verdict.
 * @param {{ok: boolean, offenders: Object[], other: number, files: number}} verdict Verdict.
 * @returns {void}
 */
function reportLint(verdict) {
  console.log(`\ncomplexity gate (ceiling ${LINT.ceiling}): ${verdict.files} files, ${verdict.offenders.length} offenders, ${verdict.other} other messages (npm run lint's job)`);
  for (const o of verdict.offenders) {
    console.log(`  OVER CEILING  ${o.file}:${o.line}  ${o.message}`);
  }
}

/**
 * Run the files and count events per file.
 * @param {string[]} files Absolute paths.
 * @param {string[]} [execArgv] Node flags for the test processes.
 * @returns {Promise<{passes: Map<string, number>, failures: number}>} Counts.
 */
function runFiles(files, execArgv = []) {
  const passes = new Map();
  let failures = 0;
  const stream = run({ files, concurrency: true, execArgv: [...execArgv] });
  stream.on("test:pass", (data) => {
    const counted = data.details && data.details.type === "test" && !data.skip && !data.todo && data.name !== data.file;
    if (counted) {
      passes.set(data.file, (passes.get(data.file) || 0) + 1);
    }
  });
  stream.on("test:fail", () => {
    failures += 1;
  });
  return new Promise((resolve, reject) => {
    const out = stream.compose(spec);
    out.on("error", reject);
    out.on("end", () => resolve({ passes, failures }));
    out.pipe(process.stdout, { end: false });
  });
}

/**
 * Run the selected suites, one batch per distinct execArgv (plain Node for
 * the worker, tsx for the client), and merge the counts.
 * @param {Object[]} suites Present suites.
 * @returns {Promise<{passes: Map<string, number>, failures: number}>} Counts.
 */
async function runSuites(suites) {
  const batches = new Map();
  for (const suite of suites) {
    const key = JSON.stringify(suite.execArgv || []);
    batches.set(key, (batches.get(key) || []).concat(path.resolve(ROOT, suite.file)));
  }
  const passes = new Map();
  let failures = 0;
  for (const [key, files] of batches) {
    const counts = await runFiles(files, JSON.parse(key));
    counts.passes.forEach((n, file) => passes.set(file, n));
    failures += counts.failures;
  }
  return { passes, failures };
}

/**
 * Print the floor table and return the exit code.
 * @param {Object[]} rows Floor rows.
 * @param {number} failures Failing tests.
 * @returns {number} Exit code.
 */
function report(rows, failures) {
  console.log("\nbilling test floors");
  for (const row of rows) {
    const status = row.missing ? "MISSING" : row.ok ? "ok" : "BELOW FLOOR";
    console.log(`  ${status.padEnd(11)} ${String(row.passed).padStart(4)} / floor ${String(row.floor).padStart(3)}  ${row.file}`);
  }
  const below = rows.filter((row) => !row.ok);
  const total = rows.reduce((sum, row) => sum + row.passed, 0);
  console.log(`  ${total} passing tests in ${rows.length} suites; ${failures} failing; ${below.length} suites below floor`);
  if (failures > 0 || below.length > 0) {
    console.log("BILLING TESTS FAILED");
    return 1;
  }
  console.log("BILLING TESTS PASSED");
  return 0;
}

/**
 * What this invocation runs: the selected suites and whether the lint step runs.
 * @param {string[]} argv Arguments after the script.
 * @returns {{selected: Object[], lint: boolean, error?: string}} Plan.
 */
export function planRun(argv) {
  const args = parseArgs(argv);
  if (args.error) {
    return { selected: [], lint: false, error: args.error };
  }
  const { selected, error } = selectSuites(SUITES, args.groups);
  const lint = !args.groups || args.groups.includes(LINT.group);
  const nothing = !error && !selected.length && !lint;
  return { selected, lint, error: error || (nothing ? "no suites selected" : undefined) };
}

/**
 * Run the suites and report them against their floors.
 * @param {Object[]} selected Selected suites.
 * @returns {Promise<number>} Exit code (0 when nothing was selected).
 */
async function testsStep(selected) {
  if (!selected.length) {
    return 0;
  }
  const missing = new Set(selected.map((suite) => path.resolve(ROOT, suite.file)).filter((file) => !existsSync(file)));
  const present = selected.filter((suite) => !missing.has(path.resolve(ROOT, suite.file)));
  const { passes, failures } = await runSuites(present);
  return report(checkFloors(selected, passes, missing), failures);
}

/**
 * Run and report the complexity gate.
 * @returns {Promise<number>} Exit code.
 */
async function lintStep() {
  const verdict = await runLint();
  reportLint(verdict);
  console.log(verdict.ok ? "COMPLEXITY GATE PASSED" : "COMPLEXITY GATE FAILED");
  return verdict.ok ? 0 : 1;
}

/**
 * Entry point.
 * @returns {Promise<number>} Exit code.
 */
async function main() {
  if (!nodeAtLeast(process.versions.node, MIN_NODE)) {
    console.error(`run_billing_tests: Node >= ${MIN_NODE.join(".")} is required (node:sqlite); found ${process.versions.node}.`);
    return 1;
  }
  const plan = planRun(process.argv.slice(2));
  if (plan.error) {
    console.error(`run_billing_tests: ${plan.error}`);
    return 2;
  }
  const testsCode = await testsStep(plan.selected);
  const lintCode = plan.lint ? await lintStep() : 0;
  return testsCode || lintCode;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main();
}
