"""The lint job runs both complexity ratchets, and fails when either baseline is left untightened.

Read as text, not parsed: the job is the block from `  lint:` to `  typecheck:`, and each
assertion names the step it guards. A ratchet that tightens its baseline only on the runner
discards the write, so the diff step is what makes the tightened baseline part of the PR.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = (ROOT / ".github/workflows/tests.yml").read_text(encoding="utf-8")


def lint_job() -> str:
    start = WORKFLOW.index("\n  lint:\n")
    return WORKFLOW[start:WORKFLOW.index("\n  typecheck:\n", start)]


class LintJobRunsBothRatchets(unittest.TestCase):
    def test_the_typescript_ratchet_still_runs_with_its_diff_check(self):
        job = lint_job()
        self.assertIn("node scripts/complexity_gate.mjs", job)
        self.assertIn("git diff --exit-code audit/fixer/complexity_baseline.json", job)

    def test_the_python_ratchet_runs_in_the_lint_job(self):
        self.assertIn("\n          python3 scripts/complexity_gate_py.py\n", lint_job())

    def test_python_3_12_is_set_up_before_the_python_ratchet_runs(self):
        job = lint_job()
        self.assertIn("actions/setup-python@v5", job)
        self.assertIn("python-version: '3.12'", job)
        self.assertLess(job.index("actions/setup-python@v5"),
                        job.index("\n          python3 scripts/complexity_gate_py.py\n"))

    def test_a_tightened_python_baseline_must_be_committed(self):
        self.assertIn("git diff --exit-code audit/fixer/complexity_baseline_py.json", lint_job())


if __name__ == "__main__":
    unittest.main()
