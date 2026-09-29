/**
 * scripts/run_billing_tests.mjs: the pure parts of the runner that decide
 * whether a run passes (Node guard, argument parsing, group selection, floors).
 */

import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { SUITES, checkFloors, nodeAtLeast, parseArgs, selectSuites } from "../../../scripts/run_billing_tests.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("the Node guard needs 22.13 or later", () => {
  assert.equal(nodeAtLeast("22.13.0", [22, 13, 0]), true);
  assert.equal(nodeAtLeast("22.22.2", [22, 13, 0]), true);
  assert.equal(nodeAtLeast("24.1.0", [22, 13, 0]), true);
  assert.equal(nodeAtLeast("22.12.9", [22, 13, 0]), false);
  assert.equal(nodeAtLeast("20.19.0", [22, 13, 0]), false);
});

test("arguments: --only groups (repeatable, comma lists); anything else is an error", () => {
  assert.deepEqual(parseArgs([]), { groups: null });
  assert.deepEqual(parseArgs(["--only", "worker"]), { groups: ["worker"] });
  assert.deepEqual(parseArgs(["--only", "worker,client", "--only", "x"]), { groups: ["worker", "client", "x"] });
  assert.equal(parseArgs(["--only"]).error, "--only needs a group name");
  assert.match(parseArgs(["--grep", "x"]).error, /unknown argument/);
});

test("an unknown group is refused instead of running nothing", () => {
  const result = selectSuites(SUITES, ["wroker"]);
  assert.deepEqual(result.selected, []);
  assert.match(result.error, /unknown group/);
  assert.equal(selectSuites(SUITES, ["worker"]).selected.length, SUITES.filter((s) => s.group === "worker").length);
});

test("a suite below its floor, or missing, fails; at or above passes", () => {
  const suites = [
    { group: "g", file: "a.test.mjs", floor: 3 },
    { group: "g", file: "b.test.mjs", floor: 3 },
    { group: "g", file: "c.test.mjs", floor: 3 }
  ];
  const abs = (f) => path.resolve(ROOT, f);
  const passes = new Map([
    [abs("a.test.mjs"), 3],
    [abs("b.test.mjs"), 2],
    [abs("c.test.mjs"), 9]
  ]);
  const rows = checkFloors(suites, passes, new Set([abs("c.test.mjs")]));
  assert.deepEqual(
    rows.map((r) => [r.file, r.ok, r.missing]),
    [
      ["a.test.mjs", true, false],
      ["b.test.mjs", false, false],
      ["c.test.mjs", false, true]
    ]
  );
});

test("every suite names a file that exists and has a positive floor", async () => {
  const { existsSync } = await import("node:fs");
  for (const suite of SUITES) {
    assert.ok(existsSync(path.resolve(ROOT, suite.file)), suite.file);
    assert.ok(Number.isInteger(suite.floor) && suite.floor > 0, suite.file);
  }
  assert.ok(SUITES.some((s) => s.file.endsWith("runner.test.mjs")), "the runner guards itself");
});

test("every *.test.mjs in workers/billing/tests is a listed suite (none can be left out of CI)", async () => {
  const { readdirSync } = await import("node:fs");
  const onDisk = readdirSync(path.resolve(ROOT, "workers/billing/tests"))
    .filter((name) => name.endsWith(".test.mjs"))
    .map((name) => `workers/billing/tests/${name}`)
    .sort();
  const listed = SUITES.filter((s) => s.file.startsWith("workers/billing/tests/")).map((s) => s.file).sort();
  assert.deepEqual(listed, onDisk);
});

test("review: every *.test.ts in src/lib/cloud/__tests__ is a listed 'client' suite, run through tsx", async () => {
  const { readdirSync } = await import("node:fs");
  const onDisk = readdirSync(path.resolve(ROOT, "src/lib/cloud/__tests__"))
    .filter((name) => name.endsWith(".test.ts"))
    .map((name) => `src/lib/cloud/__tests__/${name}`)
    .sort();
  const client = SUITES.filter((s) => s.group === "client");
  assert.deepEqual(client.map((s) => s.file).sort(), onDisk);
  assert.ok(onDisk.length >= 8, "the committed client suites are all there");
  for (const suite of client) {
    assert.deepEqual(suite.execArgv, ["--import", "tsx"], suite.file);
  }
  assert.ok(SUITES.filter((s) => s.group === "worker").every((s) => !s.execArgv), "worker suites run on plain Node");
});

test("review: the lint step gates cyclomatic complexity 15 over the worker, the runner, and the client cloud code", async () => {
  const { LINT } = await import("../../../scripts/run_billing_tests.mjs");
  assert.equal(LINT.ceiling, 15);
  for (const target of ["workers/billing", "scripts/run_billing_tests.mjs", "src/lib/cloud", "src/components/account"]) {
    assert.ok(LINT.targets.includes(target), target);
  }
  assert.deepEqual(parseArgs(["--only", "lint"]), { groups: ["lint"] });
  assert.equal(selectSuites(SUITES, ["lint"]).error, undefined, "lint is a known group");
});

test("review: the lint verdict fails on any complexity message or unparsable file, and only on those", async () => {
  const { lintVerdict } = await import("../../../scripts/run_billing_tests.mjs");
  const clean = [{ filePath: "/r/a.mjs", messages: [] }];
  assert.deepEqual(lintVerdict(clean), { ok: true, offenders: [], other: 0 });
  const tooComplex = [{ filePath: "/r/a.mjs", messages: [{ ruleId: "complexity", line: 3, message: "Function 'f' has a complexity of 16. Maximum allowed is 15." }] }];
  const complexVerdict = lintVerdict(tooComplex);
  assert.equal(complexVerdict.ok, false);
  assert.equal(complexVerdict.offenders.length, 1);
  const broken = [{ filePath: "/r/b.ts", messages: [{ ruleId: null, fatal: true, line: 1, message: "Parsing error" }] }];
  assert.equal(lintVerdict(broken).ok, false, "a file ESLint cannot parse is not a pass");
  const style = [{ filePath: "/r/c.ts", messages: [{ ruleId: "prefer-const", severity: 1, line: 2, message: "x" }] }];
  assert.deepEqual(lintVerdict(style), { ok: true, offenders: [], other: 1 }, "other rules belong to npm run lint");
});

test("review: the default run plans every group, lint included; --only narrows it; nothing selected is an error", async () => {
  const { planRun } = await import("../../../scripts/run_billing_tests.mjs");
  const all = planRun([]);
  assert.deepEqual([all.lint, all.error, new Set(all.selected.map((s) => s.group)).size], [true, undefined, 2]);
  const worker = planRun(["--only", "worker"]);
  assert.deepEqual([worker.lint, worker.selected.every((s) => s.group === "worker")], [false, true]);
  const lintOnly = planRun(["--only", "lint"]);
  assert.deepEqual([lintOnly.lint, lintOnly.selected.length, lintOnly.error], [true, 0, undefined]);
  assert.match(planRun(["--only", "nope"]).error, /unknown group/);
  assert.match(planRun(["--bogus"]).error, /unknown argument/);
});
