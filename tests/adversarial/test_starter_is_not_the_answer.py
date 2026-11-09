"""A We Do starter must not already print the answer (batch-1 gate B1, owner-approved 2026-11-09).

A We Do card hands the learner a starter and states success as the solution's printed output. If the
untouched starter already prints every line the solution prints, the learner runs it, sees the
"expected" output and moves on having practised nothing. The 2026-11-09 recheck of S01–S13 found 13
such starters, and `scripts/planted_defect_audit.py`, the audit meant to catch them, had missed them
for two reasons this gate removes:

- it only matched exercise ids written with double quotes (`id: "S..."`), so sections that write
  `id: 'S03-T1-A-E1'` (S01–S03 and others) were never run;
- it only ran exercises whose text declares a defect, so a starter that silently equals the
  solution was never looked at.

The gate runs every batch-1 We Do starter and solution under the pinned interpreter and fails on any
starter whose output is the solution's output, line for line, once `ok True` self-check lines are
set aside. It is stricter than the audit's `contains_all_lines`, which ignores blank and extra lines:
on S04-T2-B-E1 the defect IS the extra blank lines, and on S05-T1-A-E1 it is an extra `None`, and both
are visible to a learner comparing outputs.
Exercises still owed a real starter are listed in OWED; the list may only shrink: a new offender
fails, and an id that no longer offends must be removed from the list.
"""

from __future__ import annotations

import importlib.util
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src/lib/course/sections"
VENV_PY = ROOT / ".venv-content/bin/python"
BATCH_1 = [
    "s01-setup", "s02-basics", "s03-decisions-rules", "s04-iteration-summaries",
    "s05-functions-contracts", "s06-collections", "s07-text-unicode-regex", "s08-files-ingestion",
    "s09-exceptions-logging", "s10-modules-packaging-cli", "s11-oop-domain", "s12-apis-sql-geo",
    "s13-evidence-dashboard",
]
EXERCISE_ID = re.compile(r"""\bid:\s*["'](S\d\d-T\d-[AB]-E\d)["']""")

#: Starters that still print the answer. Owed a real starter; remove an id when it is fixed.
OWED: set[str] = {
    # Refactor exercises: the starter already behaves like the solution, so stdout can't show the work.
    "S05-T3-A-E3", "S05-T3-B-E2",
    "S06-T4-A-E1",
    "S07-T1-A-E2", "S07-T3-A-E1", "S07-T3-B-E1",
    "S08-T1-B-E2", "S08-T3-A-E1",
    "S11-T3-B-E1", "S11-T4-B-E1", "S11-T4-B-E2",
}

#: Exercises whose success is not stdout, so equal output is by design. Each says why.
NOT_AN_OUTPUT_EXERCISE = {
    "S01-T4-A-E2": "success is `ruff check` exiting 0; the script must keep printing the same lines",
}

SELF_CHECK_LINE = "ok True"


def visible_lines(out: str) -> list[str]:
    return [line.rstrip() for line in out.rstrip("\n").splitlines() if line.strip() != SELF_CHECK_LINE]


def prints_the_answer(starter_out: str, solution_out: str) -> bool:
    want = visible_lines(solution_out)
    return bool(want) and visible_lines(starter_out) == want


def _audit():
    spec = importlib.util.spec_from_file_location("planted_defect_audit", ROOT / "scripts/planted_defect_audit.py")
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


AUDIT = _audit()


def exercises(source: str) -> list[tuple[str, str, str]]:
    found = []
    ids = list(EXERCISE_ID.finditer(source))
    for i, match in enumerate(ids):
        end = ids[i + 1].start() if i + 1 < len(ids) else len(source)
        block = source[match.start():end]
        starter = AUDIT.code_of(block, "starterCode")
        solution = AUDIT.code_of(block, "solutionCode")
        if starter and solution:
            found.append((match.group(1), starter, solution))
    return found


def is_python(code: str) -> bool:
    try:
        compile(code, "<starter>", "exec")
    except SyntaxError:
        return False
    return True


def run(code: str, workdir: Path) -> tuple[int, str]:
    probe = workdir / "probe.py"
    probe.write_text(code, encoding="utf-8")
    try:
        done = subprocess.run(
            [str(VENV_PY), "-I", str(probe)], capture_output=True, text=True, timeout=25,
            cwd=workdir, stdin=subprocess.DEVNULL,
        )
        return done.returncode, done.stdout
    except subprocess.TimeoutExpired:
        return -1, ""


def offenders() -> tuple[set[str], int]:
    found, checked = set(), 0
    for stem in BATCH_1:
        for exercise_id, starter, solution in exercises((SECTIONS / f"{stem}.ts").read_text(encoding="utf-8")):
            if not (is_python(starter) and is_python(solution)):
                continue  # shell, TOML and other non-Python exercises
            workdir = Path(tempfile.mkdtemp(prefix="starter-gate-"))
            try:
                rc_starter, out_starter = run(starter, workdir)
                rc_solution, out_solution = run(solution, workdir)
            finally:
                shutil.rmtree(workdir, ignore_errors=True)
            checked += 1
            if exercise_id in NOT_AN_OUTPUT_EXERCISE:
                continue
            if rc_solution == 0 and rc_starter == 0 and prints_the_answer(out_starter, out_solution):
                found.add(exercise_id)
    return found, checked


class DetectorCanFail(unittest.TestCase):
    def test_single_quoted_ids_are_found(self) -> None:
        block = "id: 'S03-T1-A-E1',\n starterCode: {\n code: `print(1)`,\n},\n solutionCode: {\n code: `print(1)`,\n},\n"
        self.assertEqual([e[0] for e in exercises(block)], ["S03-T1-A-E1"])

    def test_a_starter_equal_to_its_solution_is_flagged(self) -> None:
        self.assertTrue(prints_the_answer("3\nok True\n", "3\n"))

    def test_a_starter_with_a_wrong_value_is_not_flagged(self) -> None:
        self.assertFalse(prints_the_answer("2\n", "3\n"))

    def test_extra_blank_or_none_lines_are_a_visible_defect(self) -> None:
        self.assertFalse(prints_the_answer("  \nLima\n\nCusco\n", "Lima\nCusco\n"))
        self.assertFalse(prints_the_answer("2\nNone\n", "2\n"))

    def test_empty_solution_output_never_matches(self) -> None:
        self.assertFalse(prints_the_answer("", ""))


@unittest.skipUnless(VENV_PY.exists(), "needs .venv-content (Python 3.12, pinned packages)")
class BatchOneStartersAreNotTheAnswer(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.found, cls.checked = offenders()

    def test_enough_exercises_were_run(self) -> None:
        # A broken extractor would find nothing and pass; batch 1 has well over 200 Python We Do cards.
        self.assertGreaterEqual(self.checked, 200)

    def test_no_new_starter_prints_the_answer(self) -> None:
        self.assertEqual(sorted(self.found - OWED), [])

    def test_owed_list_only_shrinks(self) -> None:
        self.assertEqual(sorted(OWED - self.found), [], "fixed: remove these ids from OWED")


if __name__ == "__main__":
    unittest.main()
