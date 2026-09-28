#!/usr/bin/env node
/**
 * Billing/accounts test runner (DESIGN-v2 §9).
 *
 *   node scripts/run_billing_tests.mjs               # every group
 *   node scripts/run_billing_tests.mjs --only worker # one group (repeatable)
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
 * Needs Node >= 22.13 (node:sqlite without a flag backs the D1 fake).
 * Later stages add groups (e.g. "client" for src/lib/cloud TypeScript suites).
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { run } from "node:test";
import { spec } from "node:test/reporters";
import { fileURLToPath } from "node:url";

const MIN_NODE = [22, 13, 0];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKER_TESTS = "workers/billing/tests";

/** Every suite: group, file (repo-relative) and floor. */
export const SUITES = [
  ["d1-fake", 11],
  ["crypto", 12],
  ["http", 15],
  ["schema", 15],
  ["ratelimit", 6],
  ["address", 5],
  ["config", 6],
  ["email", 13],
  ["accounts", 10],
  ["sessions", 11],
  ["router", 14],
  ["logincodes", 12],
  ["auth-email", 18],
  ["jwt", 15],
  ["google", 16],
  ["microsoft", 19],
  ["session-routes", 5],
  ["retention", 6],
  ["wrangler", 5],
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
  ["progress", 8],
  ["reports", 9],
  ["privacy", 8]
].map(([name, floor]) => ({ group: "worker", file: `${WORKER_TESTS}/${name}.test.mjs`, floor }));

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
  const known = new Set(suites.map((s) => s.group));
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
 * Run the files and count events per file.
 * @param {string[]} files Absolute paths.
 * @returns {Promise<{passes: Map<string, number>, failures: number}>} Counts.
 */
function runFiles(files) {
  const passes = new Map();
  let failures = 0;
  const stream = run({ files, concurrency: true });
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
 * Entry point.
 * @returns {Promise<number>} Exit code.
 */
async function main() {
  if (!nodeAtLeast(process.versions.node, MIN_NODE)) {
    console.error(`run_billing_tests: Node >= ${MIN_NODE.join(".")} is required (node:sqlite); found ${process.versions.node}.`);
    return 1;
  }
  const args = parseArgs(process.argv.slice(2));
  const { selected, error } = args.error ? { selected: [], error: args.error } : selectSuites(SUITES, args.groups);
  if (error || !selected.length) {
    console.error(`run_billing_tests: ${error || "no suites selected"}`);
    return 2;
  }
  const absolute = selected.map((suite) => path.resolve(ROOT, suite.file));
  const missing = new Set(absolute.filter((file) => !existsSync(file)));
  const present = absolute.filter((file) => !missing.has(file));
  const { passes, failures } = present.length ? await runFiles(present) : { passes: new Map(), failures: 0 };
  return report(checkFloors(selected, passes, missing), failures);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main();
}
