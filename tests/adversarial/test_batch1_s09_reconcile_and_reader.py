"""S09 reconcile checks compare against the input, and the starters use only taught Python.

Two instances of approved root causes (proposals-03, owner 2026-11-09) that had no item of their own:

R2, checks that can't fail. The S09 I Do (T4-A), the We Do `process_batch` solution and the You Do
starter reconciled with `r["in"] == len(r["ok"]) + len(r["quarantined"])`. `in` is reported by the
function under test, so a `process_batch` that silently drops a row and reports one row fewer passes
the check. Each check now also compares with `len(<the input list>)`.

R6, a concept used before it is taught. The S09-T1-A-E3 starter raised its error with
`(_ for _ in ()).throw(...)`, a generator idiom the course never teaches. It now uses a named
function that raises, as the solution already does.
"""

from __future__ import annotations

import ast
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s09-exceptions-logging.ts"

# Python lives in template literals after `code: ` or `starterCode: `; none contains a backtick.
BLOCK = re.compile(r"(?:code|starterCode):\s*`([^`]*)`")


def python_blocks(source: str) -> list[str]:
    blocks = []
    for raw in BLOCK.findall(source):
        text = raw.replace("\\\\", "\\")
        try:
            ast.parse(text)
        except SyntaxError:
            continue
        blocks.append(text)
    return blocks


def _mentions_in_key(node: ast.AST) -> bool:
    return any(
        isinstance(n, ast.Subscript) and isinstance(n.slice, ast.Constant) and n.slice.value == "in"
        for n in ast.walk(node)
    )


def _len_of_a_plain_name(node: ast.AST) -> bool:
    return (
        isinstance(node, ast.Call)
        and isinstance(node.func, ast.Name)
        and node.func.id == "len"
        and len(node.args) == 1
        and isinstance(node.args[0], ast.Name)
    )


def self_reported_reconciles(code: str) -> list[str]:
    """Reconcile asserts that read the `in` count only from the function's own report."""
    hits = []
    for node in ast.walk(ast.parse(code)):
        if not isinstance(node, ast.Assert) or not isinstance(node.test, ast.Compare):
            continue
        test = node.test
        if not _mentions_in_key(test):
            continue
        operands = [test.left, *test.comparators]
        if not any(_len_of_a_plain_name(op) for op in operands):
            hits.append(ast.unparse(node))
    return hits


def run(code: str) -> subprocess.CompletedProcess:
    return subprocess.run([sys.executable, "-I", "-c", code], capture_output=True, text=True, timeout=30)


# A process_batch that drops the last row and reports one row fewer: consistent with itself, wrong
# about the input. Applied to every runnable block that defines process_batch over `rows`.
DROP_LAST = ("    for r in rows:\n", "    for r in rows[:-1]:\n")
LIE_IN = ('"in": len(rows)}', '"in": len(rows) - 1}')


class DetectorCanFail(unittest.TestCase):
    def test_flags_a_count_taken_from_the_report(self) -> None:
        bad = 'r = {"in": 1, "ok": [1], "quarantined": []}\nassert r["in"] == len(r["ok"]) + len(r["quarantined"])\n'
        self.assertEqual(len(self_reported_reconciles(bad)), 1)

    def test_accepts_a_count_tied_to_the_input(self) -> None:
        good = (
            'rows = [1]\nr = {"in": 1, "ok": [1], "quarantined": []}\n'
            'assert r["in"] == len(rows) == len(r["ok"]) + len(r["quarantined"])\n'
        )
        self.assertEqual(self_reported_reconciles(good), [])


class S09ReconcileChecksTheInput(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.blocks = python_blocks(SECTION.read_text(encoding="utf-8"))

    def test_the_section_has_reconcile_checks_to_examine(self) -> None:
        # Vacuity guard: the I Do, the We Do solution and the You Do starter each reconcile.
        with_checks = [b for b in self.blocks if 'assert' in b and '["in"]' in b]
        self.assertGreaterEqual(len(with_checks), 3)

    def test_no_reconcile_reads_the_input_count_only_from_the_report(self) -> None:
        offenders = [hit for code in self.blocks for hit in self_reported_reconciles(code)]
        self.assertEqual(offenders, [])

    def test_a_batch_that_drops_a_row_and_hides_it_fails_the_check(self) -> None:
        runnable = [
            b for b in self.blocks
            if b.count(DROP_LAST[0]) == 1 and b.count(LIE_IN[0]) == 1 and '["in"]' in b and "assert" in b
        ]
        self.assertGreaterEqual(len(runnable), 2, "the I Do and the We Do solution must stay runnable")
        survivors = []
        for code in runnable:
            self.assertEqual(run(code).returncode, 0, "the unmutated block must run cleanly")
            mutant = code.replace(*DROP_LAST).replace(*LIE_IN)
            done = run(mutant)
            if "AssertionError" not in done.stderr:
                survivors.append(code.splitlines()[0])
        self.assertEqual(survivors, [], "a process_batch that hides a dropped row still passes")


class S09StartersUseTaughtPython(unittest.TestCase):
    def test_no_block_raises_through_a_generator_throw(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self.assertNotIn(".throw(", source)

    def test_the_t1_a_e3_starter_still_shows_the_missing_cause(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        start = source.index('id: "S09-T1-A-E3"')
        starter = BLOCK.search(source, source.index("starterCode", start)).group(1)
        done = run(starter)
        self.assertEqual((done.returncode, done.stdout.strip()), (0, "DataLoadError None"))


if __name__ == "__main__":
    unittest.main()
