#!/usr/bin/env python3
"""Adversarial tests for python_content_runtime_audit classifiers."""
from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

spec = importlib.util.spec_from_file_location(
    "runtime_audit", ROOT / "scripts/python_content_runtime_audit.py"
)
mod = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(mod)


class TestIntentionalIncomplete(unittest.TestCase):
    def test_markers(self):
        self.assertTrue(mod.intentional_incomplete("x = ____"))
        self.assertTrue(mod.intentional_incomplete("# TODO fill"))
        self.assertTrue(mod.intentional_incomplete("for i in range(1, n):  # BUG intencional"))
        self.assertFalse(mod.intentional_incomplete("print(1+1)"))


class TestStructuralOutput(unittest.TestCase):
    def test_timestamps_and_timings(self):
        self.assertTrue(
            mod._outputs_structurally_similar(
                'ts: "2026-07-20T07:47:08Z"',
                'ts: "2026-07-21T16:45:53Z"',
            )
        )
        self.assertTrue(
            mod._outputs_structurally_similar(
                "wall_ms 1.505\nresult True",
                "wall_ms 1.973\nresult True",
            )
        )

    def test_different_structure_fails(self):
        self.assertFalse(
            mod._outputs_structurally_similar("All checks passed!", "hola\n2026-07-21")
        )


class TestClassifyRun(unittest.TestCase):
    def test_timeout_is_p0(self):
        r = mod.classify_run(
            "demo",
            "print(1)",
            "python",
            None,
            {"exit": -1, "stdout": "", "stderr": "TIMEOUT", "timeout": True},
            None,
        )
        self.assertEqual(r["status"], "fail")
        self.assertEqual(r["severity"], "P0")

    def test_incomplete_starter_operational_error_ok(self):
        code = "import sqlite3\n# TODO create\nprint(con.execute('x'))"
        r = mod.classify_run(
            "starter",
            code,
            "python",
            None,
            {
                "exit": 1,
                "stdout": "",
                "stderr": "sqlite3.OperationalError: no such table",
                "timeout": False,
            },
            None,
        )
        self.assertEqual(r["status"], "pass")
        self.assertEqual(r["reason"], "expected_fail_ok")

    def test_solution_missing_dep_skip(self):
        r = mod.classify_run(
            "solution",
            "import pandas as pd",
            "python",
            None,
            {
                "exit": 1,
                "stdout": "",
                "stderr": "ModuleNotFoundError: No module named 'pandas'",
                "timeout": False,
            },
            None,
        )
        self.assertEqual(r["status"], "skip")

    def test_skip_reason_short_circuit(self):
        r = mod.classify_run("demo", "x", "python", None, None, "non_python:bash")
        self.assertEqual(r["status"], "skip")

    def test_illustrative_output_ellipsis(self):
        r = mod.classify_run(
            "demo",
            'print("hola")',
            "python",
            "hola\n...",
            {"exit": 0, "stdout": "hola\n2026-07-21\n", "stderr": "", "timeout": False},
            None,
        )
        self.assertEqual(r["status"], "pass")


class TestActiveSections(unittest.TestCase):
    def test_only_52_active(self):
        stems = mod.active_section_stems()
        self.assertEqual(len(stems), 52)
        self.assertNotIn("s07-pandas", stems)
        self.assertIn("s01-setup", stems)


def _section(*reasons: str) -> dict:
    """A section report holding one skipped snippet per reason, plus one that passed."""
    results = [{"artifact_id": f"a{i}", "result": {"status": "skip", "reason": r}}
               for i, r in enumerate(reasons)]
    results.append({"artifact_id": "ran", "result": {"status": "pass"}})
    return {"section_id": "sx", "results": results}


class TestSkipVerdict(unittest.TestCase):
    """A skip used to count for nothing in `ok`, so lesson code whose import failed read exactly
    like a shell command. Only "not Python" and "needs argv" are free now."""

    OWED = mod.MISSING_DEPENDENCY_OWED

    def test_nothing_to_run_is_free(self):
        verdict = mod.skip_verdict([_section("non_python:bash", "needs_cli_argv",
                                             *["missing_dependency"] * self.OWED)], enforce_lower_bound=True)
        self.assertEqual(verdict["status"], "ok", verdict["problems"])
        self.assertEqual(verdict["by_reason"]["non_python:bash"], 1)

    def test_any_other_reason_fails_and_is_named(self):
        verdict = mod.skip_verdict([_section("unknown_kind", *["missing_dependency"] * self.OWED)],
                                   enforce_lower_bound=True)
        self.assertEqual(verdict["status"], "fail")
        self.assertIn("1 snippets skipped as unknown_kind", verdict["problems"])

    def test_a_new_missing_dependency_fails(self):
        verdict = mod.skip_verdict([_section(*["missing_dependency"] * (self.OWED + 1))], enforce_lower_bound=True)
        self.assertEqual(verdict["status"], "fail")
        self.assertIn("more than the", verdict["problems"][0])

    def test_paying_one_off_without_lowering_the_number_fails(self):
        verdict = mod.skip_verdict([_section(*["missing_dependency"] * (self.OWED - 1))], enforce_lower_bound=True)
        self.assertEqual(verdict["status"], "fail")
        self.assertIn("lower MISSING_DEPENDENCY_OWED", verdict["problems"][0])

    def test_a_shard_is_not_asked_to_lower_it(self):
        """A shard holds fewer by construction, and so does a local environment carrying
        packages the declaration lacks; only the upper bound applies to either."""
        verdict = mod.skip_verdict([_section("missing_dependency")], enforce_lower_bound=False)
        self.assertEqual(verdict["status"], "ok", verdict["problems"])


if __name__ == "__main__":
    unittest.main()
