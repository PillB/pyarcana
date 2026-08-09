import { test, expect, describe } from "bun:test";
import { readdirSync, statSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAPSTONES } from "../src/data/capstones";

const CAPSTONES_DIR = join(import.meta.dir, "..", "capstones");

const REQUIRED_FILES = [
  "README.md",
  "solution.py",
  "acceptance.py",
  "test_solution.py",
  "requirements.txt",
  "fixtures/sample.json",
];

describe("Capstone starter repos (13 directories)", () => {
  test("all 13 capstone directories exist", () => {
    const dirs = readdirSync(CAPSTONES_DIR).filter(
      (d) => statSync(join(CAPSTONES_DIR, d)).isDirectory() && d.startsWith("CP-")
    );
    expect(dirs.sort()).toEqual(
      CAPSTONES.map((c) => c.capstoneId).sort()
    );
  });

  for (const cp of CAPSTONES) {
    describe(`${cp.capstoneId} starter repo`, () => {
      const cpDir = join(CAPSTONES_DIR, cp.capstoneId);

      test("directory exists", () => {
        expect(existsSync(cpDir)).toBe(true);
      });

      test("has all required files", () => {
        for (const f of REQUIRED_FILES) {
          const path = join(cpDir, f);
          expect(existsSync(path), `${cp.capstoneId}/${f}`).toBe(true);
        }
      });

      test("README has title and acceptance criteria", () => {
        const readme = readFileSync(join(cpDir, "README.md"), "utf-8");
        expect(readme.length).toBeGreaterThan(200);
        expect(readme).toContain(cp.capstoneId);
        expect(readme.toLowerCase()).toContain("acceptance");
      });

      test("solution.py is valid Python (non-empty, has main or functions)", () => {
        const sol = readFileSync(join(cpDir, "solution.py"), "utf-8");
        expect(sol.length).toBeGreaterThan(500);
        expect(sol).toMatch(/def |class /);
      });

      test("acceptance.py is valid (has main and pass/fail indication)", () => {
        const acc = readFileSync(join(cpDir, "acceptance.py"), "utf-8");
        expect(acc.length).toBeGreaterThan(300);
        expect(acc).toMatch(/def main/);
        // Acceptance scripts indicate pass/fail via PASS/FAIL or checkmarks
        expect(acc).toMatch(/PASS|FAIL|✅|❌|pass|fail/i);
      });

      test("test_solution.py has pytest imports", () => {
        const tst = readFileSync(join(cpDir, "test_solution.py"), "utf-8");
        expect(tst).toContain("import pytest");
        // Has test functions or classes
        expect(tst).toMatch(/def test_|class Test/);
      });

      test("fixtures/sample.json is valid JSON", () => {
        const data = readFileSync(join(cpDir, "fixtures/sample.json"), "utf-8");
        const parsed = JSON.parse(data);
        expect(parsed).toBeDefined();
      });

      test("no real PII in any file", () => {
        for (const f of REQUIRED_FILES) {
          const content = readFileSync(join(cpDir, f), "utf-8");
          // No real email domains (synthetic.example / example.org are OK)
          expect(content).not.toMatch(/@gmail\.com|@outlook\.com|@yahoo\.com|@hotmail\.com/i);
          // No real SSN-like patterns that aren't obviously test data
          // (we allow patterns inside [REDACTED] contexts and synthetic test fixtures)
          const realSsn = content.match(/\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g);
          if (realSsn) {
            // SSN patterns are only OK if they're in a redaction test context
            const ctx = content.toLowerCase();
            expect(ctx).toMatch(/redact|ssn|synthetic/);
          }
        }
      });

      test("synthetic data disclaimer present", () => {
        const readme = readFileSync(join(cpDir, "README.md"), "utf-8");
        expect(readme.toLowerCase()).toContain("synthetic");
      });
    });
  }

  test("run_all_acceptance.sh exists and is executable", () => {
    const path = join(CAPSTONES_DIR, "run_all_acceptance.sh");
    expect(existsSync(path)).toBe(true);
    const stat = statSync(path);
    // Check executable bit
    expect(stat.mode & 0o111).not.toBe(0);
  });

  test("capstones/README.md index lists all 13", () => {
    const readme = readFileSync(join(CAPSTONES_DIR, "README.md"), "utf-8");
    for (const cp of CAPSTONES) {
      expect(readme).toContain(cp.capstoneId);
    }
  });
});
