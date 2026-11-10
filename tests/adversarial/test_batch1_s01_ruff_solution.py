"""Batch 1 regressions for S01 and S03 (proposals-03, owner-approved 2026-11-09).

Each class pins one approved item. Every test here fails on the base commit and passes after the
fix; the negative controls say why a pass cannot be vacuous.
"""

from __future__ import annotations

import ast
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
S01 = ROOT / "src/lib/course/sections/s01-setup.ts"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


def _solution_s01_t4_a_e2() -> str:
    """The exact `solutionCode` text of S01-T4-A-E2 (the template literal's content, unescaped)."""
    block = _between(S01.read_text(encoding="utf-8"), "id: 'S01-T4-A-E2'", "id: 'S01-T4-A-E3'")
    solution = _between(block, "solutionCode: {", "output: `hola")
    body_start = solution.index("code: `") + len("code: `")
    return solution[body_start : solution.rindex("`,")]


class A8RuffSolutionTests(unittest.TestCase):
    """A8 (reval NEW-S01-1): the solution must pass the course's own `ruff check` (I001)."""

    def test_solution_has_exactly_one_blank_line_after_the_import(self) -> None:
        self.assertEqual(
            _solution_s01_t4_a_e2(),
            'from datetime import datetime\n\nprint("hola")\nprint(datetime.now().date())',
        )

    def test_solution_passes_ruff_under_the_lesson_config(self) -> None:
        ruff = shutil.which("ruff")
        if ruff is None:
            self.fail("ruff is not on PATH: the exit-0 check cannot run, so this is not a pass")
        with tempfile.TemporaryDirectory() as tmp:
            Path(tmp, "pyproject.toml").write_text(
                '[tool.ruff.lint]\nselect = ["E", "F", "I"]\n', encoding="utf-8"
            )
            Path(tmp, "hello_lint.py").write_text(_solution_s01_t4_a_e2() + "\n", encoding="utf-8")
            result = subprocess.run(
                [ruff, "check", "hello_lint.py"], cwd=tmp, capture_output=True, text=True
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_negative_control_the_base_layout_is_flagged_by_ruff(self) -> None:
        """The two-blank-line layout the base shipped must still fail, so the check is not vacuous."""
        ruff = shutil.which("ruff")
        if ruff is None:
            self.fail("ruff is not on PATH: negative control cannot run")
        base = 'from datetime import datetime\n\n\nprint("hola")\nprint(datetime.now().date())\n'
        with tempfile.TemporaryDirectory() as tmp:
            Path(tmp, "pyproject.toml").write_text(
                '[tool.ruff.lint]\nselect = ["E", "F", "I"]\n', encoding="utf-8"
            )
            Path(tmp, "hello_lint.py").write_text(base, encoding="utf-8")
            result = subprocess.run(
                [ruff, "check", "hello_lint.py"], cwd=tmp, capture_output=True, text=True
            )
        self.assertEqual(result.returncode, 1, "ruff must flag two blank lines as I001")
        self.assertIn("I001", result.stdout)


if __name__ == "__main__":
    unittest.main()
