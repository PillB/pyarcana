"""The Python complexity gate, exercised as a process the way CI and the owner run it.

Each test writes its Python into a temporary directory outside the repository, so nothing here
touches the tracked tree (`run_adversarial_py` fails a run that writes into it). Subprocesses
keep the tests on the gate's real entry point, not on a copy of its functions.
"""
from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GATE = ROOT / "scripts/complexity_gate_py.py"


def run_gate(*args: str, cwd: Path | None = None) -> subprocess.CompletedProcess:
    return subprocess.run([sys.executable, str(GATE), *args], cwd=cwd or ROOT,
                          capture_output=True, text=True, check=False)


def load_gate_module():
    spec = importlib.util.spec_from_file_location("complexity_gate_py", GATE)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


GATE_MODULE = load_gate_module()


def rows_of(source: str) -> list[dict]:
    """The gate's own per-function rows for one snippet, measured from a temporary file."""
    with tempfile.TemporaryDirectory() as tmp:
        target = Path(tmp) / "snippet.py"
        target.write_text(source, encoding="utf-8")
        return GATE_MODULE.function_scores(target)


def score(source: str, name: str) -> int:
    """The score of the one function whose last name segment is `name` ("inner" or "f.<lambda>")."""
    found = [r["score"] for r in rows_of(source) if r["function"].rsplit(".", 1)[-1] == name]
    assert len(found) == 1, f"expected one function named {name!r}, found {len(found)}"
    return found[0]


class FilesOutsideRoot(unittest.TestCase):
    """`--files` takes any path. A file outside the repository is measured, not a crash."""

    def test_a_file_outside_the_repository_under_the_ceiling_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "x.py"
            target.write_text("def f(x):\n    if x:\n        return 1\n    return 0\n", encoding="utf-8")
            done = run_gate("--files", str(target))
        self.assertEqual(done.returncode, 0, done.stderr)
        self.assertIn("new code: 0 function(s) above 15", done.stdout)

    def test_a_file_outside_the_repository_over_the_ceiling_fails_and_names_it(self):
        branches = "".join(f"    if x == {i}:\n        return {i}\n" for i in range(15))
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "x.py"
            target.write_text(f"def f(x):\n{branches}    return -1\n", encoding="utf-8")
            done = run_gate("--files", str(target))
        self.assertEqual(done.returncode, 1, done.stderr)
        self.assertIn(f"{target}:1 f", done.stdout)


class CountingRules(unittest.TestCase):
    """The ruling of 2026-10-12: count like ESLint 9.39.2 and NIST SP 500-235 4.1."""

    def test_a_nested_def_adds_nothing_to_its_outer_function_wherever_it_sits(self):
        """Direct, the nested def's if was counted twice; under an if, the def was dropped."""
        direct = ("def outer(xs):\n    def inner(y):\n        if y:\n            return 1\n"
                  "        return 0\n    return inner(xs)\n")
        under_if = ("def outer(xs, c):\n    if c:\n        def inner(y):\n            if y:\n"
                    "                return 1\n            return 0\n        return inner(xs)\n    return 0\n")
        self.assertEqual(score(direct, "outer"), 1)
        self.assertEqual(score(under_if, "outer") - score(direct, "outer"), 1,
                         "the only difference between the two placements is the `if` itself")

    def test_a_nested_def_is_reported_once_with_its_own_score(self):
        source = ("def outer(xs):\n    def inner(y):\n        if y:\n            return 1\n"
                  "        return 0\n    return inner(xs)\n")
        self.assertEqual(sum(r["function"].rsplit(".", 1)[-1] == "inner" for r in rows_of(source)), 1)
        self.assertEqual(score(source, "inner"), 2)

    def test_and_or_adds_one_per_operator(self):
        self.assertEqual(score("def f(a, b, c):\n    if a and b or c:\n        return 1\n    return 0\n", "f"), 4)

    def test_a_conditional_expression_adds_one(self):
        self.assertEqual(score("def f(x):\n    return 1 if x else 0\n", "f"), 2)

    def test_a_comprehension_if_adds_two_for_the_loop_and_the_test(self):
        self.assertEqual(score("def f(xs):\n    return [x for x in xs if x]\n", "f"), 3)

    def test_a_lambda_is_scored_on_its_own_and_not_into_its_enclosing_function(self):
        source = "def f(xs):\n    return sorted(xs, key=lambda x: 0 if x else 1)\n"
        self.assertEqual(score(source, "f"), 1)
        self.assertEqual(score(source, "<lambda>"), 2)

    def test_a_match_wildcard_case_is_not_a_branch(self):
        source = ("def f(c):\n    match c:\n        case 1:\n            return 'a'\n"
                  "        case 2:\n            return 'b'\n        case _:\n            return 'c'\n")
        self.assertEqual(score(source, "f"), 3)

    def test_fifteen_passes_the_ceiling_and_sixteen_fails_it(self):
        def with_branches(n: int) -> str:
            body = "".join(f"    if x == {i}:\n        return {i}\n" for i in range(n))
            return f"def f(x):\n{body}    return -1\n"
        self.assertEqual(score(with_branches(14), "f"), 15)
        self.assertEqual(score(with_branches(15), "f"), 16)


CORPUS = json.loads((ROOT / "tests/adversarial/complexity_parity_corpus.json").read_text(encoding="utf-8"))


def score_by_qualname(source: str, function: str) -> int:
    found = [r["score"] for r in rows_of(source) if r["function"] == function]
    assert len(found) == 1, (function, len(found))
    return found[0]


class ParityCorpus(unittest.TestCase):
    """34 snippets. `radon` is frozen from radon 6.0.1; `expected` is the ruling. They agree
    everywhere except the four named divergences, which are pinned rather than hidden."""

    def test_the_corpus_was_frozen_from_radon_six_point_oh_one(self):
        self.assertEqual(CORPUS["radon"], "6.0.1")
        self.assertGreaterEqual(len(CORPUS["entries"]), 30)

    def test_every_snippet_scores_its_expected_value(self):
        for entry in CORPUS["entries"]:
            with self.subTest(snippet=entry["id"]):
                self.assertEqual(score_by_qualname(entry["source"], entry["function"]), entry["expected"])

    def test_expected_equals_radon_except_where_a_divergence_is_named(self):
        for entry in CORPUS["entries"]:
            with self.subTest(snippet=entry["id"]):
                if entry["divergence"] is None:
                    self.assertEqual(entry["expected"], entry["radon"])
                else:
                    self.assertNotEqual(entry["expected"], entry["radon"])
                    self.assertTrue(entry["divergence"].strip())

    def test_the_nist_fig_4_4_port_scores_six_as_the_document_states(self):
        """Figure 4-4 of NIST SP 500-235 is a C module the document says has complexity 6: two
        `if`s, a `while`, and two `&&`s, starting from 1. The entry is a line-for-line Python port
        of that listing, and radon agrees that it scores six."""
        entry = next(e for e in CORPUS["entries"] if e["id"] == "nist_fig44_port")
        self.assertEqual(entry["expected"], 6)
        self.assertEqual(entry["radon"], 6)
        self.assertEqual(score_by_qualname(entry["source"], entry["function"]), 6)


class Unparseable(unittest.TestCase):
    """A file the gate cannot read is a failure that names it, never zero functions and a pass."""

    def test_a_syntax_error_fails_and_names_the_file_and_line(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "bad.py"
            target.write_text("def f(:\n    return 1\n", encoding="utf-8")
            done = run_gate("--files", str(target))
        self.assertNotEqual(done.returncode, 0, done.stdout)
        self.assertIn(f"{target}:1:", done.stdout + done.stderr)

    def test_a_file_that_is_not_utf8_fails_and_names_the_line(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "latin.py"
            target.write_bytes(b"x = 1\n\xff\xfe = 2\n")
            done = run_gate("--files", str(target))
        self.assertNotEqual(done.returncode, 0, done.stdout)
        self.assertIn(f"{target}:2:", done.stdout + done.stderr)


class InterpreterGuard(unittest.TestCase):
    """A verdict under any Python but CI's 3.12 is refused: 3.9 and 3.13 parse and print differently."""

    def run_as(self, version: tuple, target: Path) -> subprocess.CompletedProcess:
        bootstrap = ("import sys, runpy; sys.version_info = %r; sys.argv = ['gate', '--files', %r]; "
                     "runpy.run_path(%r, run_name='__main__')" % (version, str(target), str(GATE)))
        return subprocess.run([sys.executable, "-c", bootstrap], capture_output=True, text=True, check=False)

    def test_other_pythons_are_refused_with_exit_two(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "x.py"
            target.write_text("def f():\n    return 1\n", encoding="utf-8")
            for version in ((3, 9, 6, "final", 0), (3, 13, 0, "final", 0)):
                with self.subTest(version=version[:2]):
                    done = self.run_as(version, target)
                    self.assertEqual(done.returncode, 2, done.stdout + done.stderr)
                    self.assertIn("REFUSED", done.stderr)

    def test_python_312_gives_a_verdict(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "x.py"
            target.write_text("def f():\n    return 1\n", encoding="utf-8")
            done = self.run_as((3, 12, 15, "final", 0), target)
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
        self.assertIn("new code: 0 function(s) above 15", done.stdout)


class Scope(unittest.TestCase):
    """The Python gate measures scripts, tools and tests, and honours the shared exclusions."""

    def measured(self) -> set[str]:
        return {p.relative_to(ROOT).as_posix() for p in GATE_MODULE.python_files()}

    def test_it_measures_tests_as_well_as_scripts_and_tools(self):
        measured = self.measured()
        self.assertIn("scripts/complexity_gate_py.py", measured)
        self.assertIn("tools/fixer/ledger.py", measured)
        self.assertIn("tests/adversarial/test_complexity_gate_py.py", measured)

    def test_excluded_course_content_is_not_measured(self):
        self.assertEqual([m for m in self.measured() if m.startswith("course-state/")], [])

    def test_a_directory_exclusion_covers_its_files_and_nothing_else(self):
        rules = [{"path": "course-state/capstones/", "reason": "learner content"}]
        self.assertTrue(GATE_MODULE.excluded("course-state/capstones/CP-N4-C/a.py", rules))
        self.assertFalse(GATE_MODULE.excluded("course-state/capstones-old/a.py", rules))
        self.assertFalse(GATE_MODULE.excluded("scripts/a.py", rules))


def function_with_score(name: str, score: int) -> str:
    """A function whose complexity is exactly `score` (one base point plus score - 1 ifs)."""
    body = "".join(f"    if x == {i}:\n        return {i}\n" for i in range(score - 1))
    return f"def {name}(x):\n{body}    return -1\n"


class Ratchet(unittest.TestCase):
    """Per-function ratchet: new code meets the ceiling, baselined debt may not grow, falling
    debt tightens the baseline, and a missing baseline fails. Runs in a temporary tree."""

    BASELINE = "audit/fixer/complexity_baseline_py.json"

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "scripts").mkdir()

    def tearDown(self):
        self.tmp.cleanup()

    def put(self, source: str, name: str = "a.py") -> None:
        (self.root / "scripts" / name).write_text(source, encoding="utf-8")

    def gate(self, *args: str) -> subprocess.CompletedProcess:
        return run_gate("--root", str(self.root), *args)

    def baseline(self) -> dict:
        return json.loads((self.root / self.BASELINE).read_text(encoding="utf-8"))

    def test_a_missing_baseline_fails_and_is_not_silently_created(self):
        self.put(function_with_score("f", 3))
        done = self.gate()
        self.assertEqual(done.returncode, 1, done.stdout + done.stderr)
        self.assertIn("--init", done.stdout + done.stderr)
        self.assertFalse((self.root / self.BASELINE).exists())

    def test_init_writes_a_baseline_and_a_clean_tree_then_passes(self):
        self.put(function_with_score("f", 3))
        self.assertEqual(self.gate("--init").returncode, 0)
        self.assertEqual(self.baseline()["offenders"], {})
        self.assertEqual(self.gate().returncode, 0)

    def test_init_refuses_to_overwrite_an_existing_baseline(self):
        self.put(function_with_score("f", 3))
        self.gate("--init")
        self.assertEqual(self.gate("--init").returncode, 1)

    def test_a_deleted_baseline_fails_the_gate(self):
        self.put(function_with_score("f", 3))
        self.gate("--init")
        (self.root / self.BASELINE).unlink()
        self.assertEqual(self.gate().returncode, 1)

    def test_a_new_function_over_the_ceiling_fails_and_is_keyed_by_path_and_name(self):
        self.put(function_with_score("f", 3))
        self.gate("--init")
        self.put(function_with_score("f", 3) + function_with_score("g", 16))
        done = self.gate()
        self.assertEqual(done.returncode, 1, done.stdout)
        self.assertIn("NEW OVER  16 scripts/a.py::g", done.stdout)

    def test_a_baselined_twenty_that_becomes_twenty_one_fails_though_the_worst_is_unchanged(self):
        self.put(function_with_score("f", 20) + function_with_score("g", 25))
        self.gate("--init")
        self.put(function_with_score("f", 21) + function_with_score("g", 25))
        done = self.gate()
        self.assertEqual(done.returncode, 1, done.stdout)
        self.assertIn("GREW  20 ->  21 scripts/a.py::f", done.stdout)

    def test_fixing_one_offender_and_adding_another_of_the_same_count_fails(self):
        self.put(function_with_score("f", 20))
        self.gate("--init")
        self.put(function_with_score("f", 10) + function_with_score("h", 18))
        done = self.gate()
        self.assertEqual(done.returncode, 1, done.stdout)
        self.assertIn("NEW OVER  18 scripts/a.py::h", done.stdout)

    def test_falling_scores_tighten_the_baseline_on_disk_and_pass(self):
        self.put(function_with_score("f", 20) + function_with_score("g", 25))
        self.gate("--init")
        self.put(function_with_score("f", 10) + function_with_score("g", 18))
        done = self.gate()
        self.assertEqual(done.returncode, 0, done.stdout)
        tightened = self.baseline()
        self.assertEqual(tightened["offenders"], {"scripts/a.py::g": 18})
        self.assertEqual((tightened["over_ceiling"], tightened["worst"]), (1, 18))

    def test_a_repeated_name_in_one_file_is_suffixed_in_source_order(self):
        self.put(function_with_score("f", 16) + function_with_score("f", 17))
        self.gate("--init")
        self.assertEqual(self.baseline()["offenders"],
                         {"scripts/a.py::f": 16, "scripts/a.py::f#2": 17})

    def test_an_unparseable_file_fails_the_ratchet_and_names_it(self):
        self.put("def f(:\n")
        done = self.gate("--init")
        self.assertEqual(done.returncode, 1, done.stdout)
        self.assertIn("scripts/a.py:1:", done.stdout + done.stderr)


if __name__ == "__main__":
    unittest.main()
