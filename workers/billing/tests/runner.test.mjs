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
