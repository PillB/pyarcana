"""The Python complexity gate, exercised as a process the way CI and the owner run it.

Each test writes its Python into a temporary directory outside the repository, so nothing here
touches the tracked tree (`run_adversarial_py` fails a run that writes into it). Subprocesses
keep the tests on the gate's real entry point, not on a copy of its functions.
"""
from __future__ import annotations

import ast
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Callable, NamedTuple

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
        self.assertEqual(score(source, "<kw key of sorted>"), 2)

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


class ParameterDefaults(unittest.TestCase):
    """The owner's ruling of 2026-10-12 (O21): Python counts like the TypeScript gate, so a parameter
    default counts where ESLint counts it. ESLint scores an AssignmentPattern (+1) in the function
    that owns the parameter, and so does the gate, wherever the def sits. radon does not count a
    default, so these cases are named divergences in the parity corpus."""

    def test_each_parameter_default_adds_one_to_its_own_function(self):
        self.assertEqual(score("def f(x=1):\n    return x\n", "f"), 2)
        self.assertEqual(score("def f(x=1, y=2):\n    return x\n", "f"), 3)

    def test_positional_only_and_keyword_only_defaults_count_too(self):
        self.assertEqual(score("def f(a=1, /, b=2, *, c=3, d):\n    return a\n", "f"), 4)

    def test_a_lambda_default_counts_toward_the_lambda(self):
        source = "def f(xs):\n    return sorted(xs, key=lambda x, d=0: x)\n"
        self.assertEqual(score(source, "<kw key of sorted>"), 2)
        self.assertEqual(score(source, "f"), 1)

    def test_a_default_expression_is_scored_inside_the_function_that_owns_the_parameter(self):
        """ESLint: function f(a, x = a ? 2 : 3) is 1 + 1 for the default + 1 for the conditional."""
        self.assertEqual(score("def f(a, x=(2 if a else 3)):\n    return x\n", "f"), 3)
        self.assertEqual(score("class C:\n    def m(self, a, x=a or 1):\n        return x\n", "m"), 3)

    def test_a_default_in_a_nested_def_belongs_to_the_nested_def_not_to_the_enclosing_function(self):
        """ESLint attributes it to the nested function. It is the nested def's parameter."""
        source = "def outer(a, b):\n    def g(x=a or b):\n        return x\n    return g\n"
        self.assertEqual(score(source, "outer"), 1)
        self.assertEqual(score(source, "g"), 3)

    def test_a_decorator_on_a_nested_def_still_belongs_to_the_enclosing_function(self):
        """A decorator is evaluated where the def stands, and ESLint has no counterpart to move it."""
        source = "def outer(a, b):\n    @deco(a or b)\n    def g():\n        return 1\n    return g\n"
        self.assertEqual(score(source, "outer"), 2)
        self.assertEqual(score(source, "g"), 1)


CORPUS = json.loads((ROOT / "tests/adversarial/complexity_parity_corpus.json").read_text(encoding="utf-8"))


def score_by_qualname(source: str, function: str) -> int:
    found = [r["score"] for r in rows_of(source) if r["function"] == function]
    assert len(found) == 1, (function, len(found))
    return found[0]


class ParityCorpus(unittest.TestCase):
    """`radon` is frozen from radon 6.0.1; `expected` is the ruling. They agree everywhere except the
    named divergences, each with its reason, which are pinned rather than hidden."""

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
        `if`s, a `while`, and two `&&`s, starting from 1. The entry is a Python reconstruction of
        that listing from the PDF's text layer, which is garbled in places (`&&` reads as `ss` and
        `i--` as `i~`). Its structure follows the listing's line numbers 42 to 51 and is checked
        against the document's stated count of 6; it was not compared with the page image. radon
        agrees that it scores six."""
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


class FailClosed(unittest.TestCase):
    """Nothing measured is a failure, never a pass: no path to check, a file that cannot be read,
    or a scope with no function in it."""

    def test_files_given_no_paths_is_a_usage_error_not_an_empty_pass(self):
        done = run_gate("--files")
        self.assertEqual(done.returncode, 2, done.stdout + done.stderr)

    def test_a_flag_without_its_value_is_a_usage_error_not_a_run_on_the_default(self):
        for flag in ("--root", "--scope"):
            with self.subTest(flag=flag):
                done = run_gate(flag)
                self.assertNotEqual(done.returncode, 0, done.stdout + done.stderr)
                self.assertIn(f"{flag} needs a value", done.stderr)

    def test_an_unreadable_file_fails_and_is_named_as_unreadable(self):
        with tempfile.TemporaryDirectory() as tmp:
            missing = Path(tmp) / "gone.py"
            done = run_gate("--files", str(missing))
        self.assertEqual(done.returncode, 1, done.stdout + done.stderr)
        self.assertIn(f"{missing}:1: cannot read", done.stdout)


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

    def test_an_exclusion_inside_a_root_takes_that_file_out_of_the_measure(self):
        """No exclusion in the real scope lies inside a root, so the filter has no work to do there
        and a test on the real tree cannot tell whether it works. This one builds a scope that
        does: `scripts/skip/` is excluded and holds a 30; with the exclusion it is not measured,
        and without it (the control) it is, which is what makes the first half mean something."""
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "scripts" / "skip").mkdir(parents=True)
            (root / "scripts" / "keep.py").write_text(function_with_score("small", 3), encoding="utf-8")
            (root / "scripts" / "skip" / "big.py").write_text(function_with_score("huge", 30), encoding="utf-8")
            python = {"roots": ["scripts"], "suffixes": [".py"]}
            skip = [{"path": "scripts/skip/", "reason": "an exclusion inside a root"}]

            def baselined(exclusions: list[dict]) -> dict:
                scope = root / "scope.json"
                scope.write_text(json.dumps({"python": python, "typescript": [], "GATE_EXCLUSIONS": exclusions}),
                                 encoding="utf-8")
                (root / Ratchet.BASELINE).unlink(missing_ok=True)
                done = run_gate("--root", str(root), "--scope", str(scope), "--init")
                self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
                return json.loads((root / Ratchet.BASELINE).read_text(encoding="utf-8"))["offenders"]

            self.assertEqual(baselined([]), {"scripts/skip/big.py::huge": 30}, "control: it is measured")
            self.assertEqual(baselined(skip), {}, "excluded: it is not")

    def test_a_directory_exclusion_covers_its_files_and_nothing_else(self):
        rules = [{"path": "course-state/capstones/", "reason": "learner content"}]
        self.assertTrue(GATE_MODULE.excluded("course-state/capstones/CP-N4-C/a.py", rules))
        self.assertFalse(GATE_MODULE.excluded("course-state/capstones-old/a.py", rules))
        self.assertFalse(GATE_MODULE.excluded("scripts/a.py", rules))


def function_with_score(name: str, score: int) -> str:
    """A function whose complexity is exactly `score` (one base point plus score - 1 ifs)."""
    body = "".join(f"    if x == {i}:\n        return {i}\n" for i in range(score - 1))
    return f"def {name}(x):\n{body}    return -1\n"


def lambda_chain(score: int) -> str:
    """The body of a lambda that scores exactly `score`: `score` operands joined by `or`."""
    return " or ".join(f"x == {i}" for i in range(score))


class Verdict(unittest.TestCase):
    """The ceiling as the process reports it: a function at 15 is green, one at 16 is red."""

    def check(self, score: int) -> subprocess.CompletedProcess:
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "x.py"
            target.write_text(function_with_score("f", score), encoding="utf-8")
            return run_gate("--files", str(target))

    def test_a_function_at_fifteen_is_green(self):
        done = self.check(15)
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
        self.assertIn("new code: 0 function(s) above 15", done.stdout)

    def test_a_function_at_sixteen_is_red_and_named_with_its_score(self):
        done = self.check(16)
        self.assertEqual(done.returncode, 1, done.stdout + done.stderr)
        self.assertIn("OVER  16 ", done.stdout)
        self.assertIn(" f\n", done.stdout)


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

    def test_an_unrelated_lambda_added_earlier_does_not_turn_a_baselined_one_into_new_over(self):
        """The ordinal keying that bit the TypeScript gate: `<lambda>#2` moved when `<lambda>` was added."""
        big = f"big = lambda x: {lambda_chain(20)}\n"
        self.put("small = lambda x: x\n" + big)
        self.assertEqual(self.gate("--init").returncode, 0)
        self.put("zed = lambda x: x\nsmall = lambda x: x\n" + big)
        done = self.gate()
        self.assertEqual(done.returncode, 0, done.stdout)
        self.assertEqual(self.baseline()["offenders"], {"scripts/a.py::big": 20})

    def test_a_baselined_callback_lambda_keeps_its_key_when_others_are_added_before_it(self):
        build = ("def build(rows):\n"
                 f"    return sorted(rows, key=lambda x: {lambda_chain(20)})\n")
        self.put(build)
        self.assertEqual(self.gate("--init").returncode, 0)
        key = "scripts/a.py::build.<kw key of sorted>"
        self.assertEqual(self.baseline()["offenders"], {key: 20})
        self.put("early = lambda x: x\ndef first(rows):\n    return sorted(rows, key=lambda x: x)\n" + build)
        done = self.gate()
        self.assertEqual(done.returncode, 0, done.stdout)
        self.assertEqual(self.baseline()["offenders"], {key: 20})

    def test_a_baselined_lambda_that_grows_still_fails_under_the_same_key(self):
        self.put(f"big = lambda x: {lambda_chain(20)}\n")
        self.gate("--init")
        self.put(f"early = lambda x: x\nbig = lambda x: {lambda_chain(21)}\n")
        done = self.gate()
        self.assertEqual(done.returncode, 1, done.stdout)
        self.assertIn("GREW  20 ->  21 scripts/a.py::big", done.stdout)

    def test_lambdas_are_keyed_by_the_name_they_are_assigned_to_or_the_call_they_are_given_to(self):
        chain = lambda_chain(16)
        self.put("\n".join([
            f"named = lambda x: {chain}",
            f"annotated: object = lambda x: {chain}",
            f"holder.slot = lambda x: {chain}",
            f"mapped = list(map(lambda x: {chain}, []))",
            f"keyed = sorted([], key=lambda x: {chain})",
            f"chosen = (lambda x: {chain}) if True else None",
            f"print((lambda x: {chain})(1))",
            f"def f(rows):\n    return rows.sort(key=lambda x: {chain})",
            "",
        ]))
        self.gate("--init")
        self.assertEqual(sorted(self.baseline()["offenders"]), [
            "scripts/a.py::<arg 0 of map>",
            "scripts/a.py::<kw key of keyed = sorted>",
            "scripts/a.py::<lambda>",
            "scripts/a.py::annotated",
            "scripts/a.py::chosen",
            "scripts/a.py::f.<kw key of rows.sort>",
            "scripts/a.py::holder.slot",
            "scripts/a.py::named",
        ])

    def test_a_lambda_whose_call_result_is_bound_is_keyed_by_the_binding(self):
        """An unrelated `sorted(..., key=lambda ...)` above a bound one must not renumber it."""
        build = lambda extra: ("def build(rows):\n" + extra +
                               f"    first = sorted(rows, key=lambda x: {lambda_chain(20)})\n"
                               "    return first\n")
        self.put(build(""))
        self.assertEqual(self.gate("--init").returncode, 0)
        self.put(build("    early = sorted(rows, key=lambda x: x)\n"))
        done = self.gate()
        self.assertEqual(done.returncode, 0, done.stdout)
        self.assertEqual(self.baseline()["offenders"], {"scripts/a.py::build.<kw key of first = sorted>": 20})

    def test_a_lambda_is_keyed_by_the_title_its_call_is_given(self):
        """`parser.add_argument("--size", type=lambda s: ...)`: an unrelated argument added above
        must not renumber it."""
        cli = lambda extra: ("def cli(parser):\n" + extra +
                             f"    parser.add_argument('--size', type=lambda x: {lambda_chain(20)})\n")
        self.put(cli(""))
        self.assertEqual(self.gate("--init").returncode, 0)
        self.put(cli("    parser.add_argument('--name', type=lambda x: x)\n"))
        done = self.gate()
        self.assertEqual(done.returncode, 0, done.stdout)
        self.assertEqual(self.baseline()["offenders"],
                         {'scripts/a.py::cli.<kw type of parser.add_argument "--size">': 20})

    def test_a_lambda_added_to_an_earlier_place_does_not_renumber_one_in_a_later_place(self):
        """Two conditional `helper` defs share a name, so they are told apart by order, and each
        lambda by order inside its own helper, never by order across the whole file."""
        source = lambda extra: ("def outer(flag):\n    if flag:\n        def helper(rows):\n" + extra +
                                "            return sorted(rows, key=lambda x: x)\n"
                                "    else:\n        def helper(rows):\n"
                                f"            return sorted(rows, key=lambda x: {lambda_chain(20)})\n"
                                "    return helper\n")
        self.put(source(""))
        self.assertEqual(self.gate("--init").returncode, 0)
        self.put(source("            print(sorted(rows, key=lambda x: -x))\n"))
        done = self.gate()
        self.assertEqual(done.returncode, 0, done.stdout)
        self.assertEqual(self.baseline()["offenders"],
                         {"scripts/a.py::outer.helper#2.<kw key of sorted>": 20})

    def test_a_lambda_takes_every_name_the_code_gives_it(self):
        chain = lambda_chain(16)
        self.put("\n".join([
            "def cli(parser, gate, mock):",
            f"    mock.patch.object(gate, 'sh', lambda x: {chain})",
            f"    parser.add_argument(f'--{{gate}}-limit', type=lambda x: {chain})",
            f"    n = sorted([], key=lambda x: {chain}).count(1)",
            f"    report[n] = {{'top': sorted([], key=lambda x: {chain})[:10]}}",
            "    return n",
            f"ROWS = [('role', lambda x: {chain})]",
            f"CHECKS = [lambda x: x, lambda x: {chain}]",
            f"HANDLERS = {{'save': lambda x: {chain}}}",
            f"def factory():\n    return lambda x: {chain}",
            f"def run(cb=lambda x: {chain}):\n    return cb",
            f"once = (lambda x: {chain})(1)",
            "",
        ]))
        done = self.gate("--init")
        self.assertEqual(done.returncode, 0, done.stdout)
        self.assertEqual(sorted(self.baseline()["offenders"]), [
            "scripts/a.py::<once = (…)()>",
            "scripts/a.py::CHECKS.<item 1>",
            "scripts/a.py::HANDLERS.save",
            'scripts/a.py::ROWS.<item 1 "role">',
            'scripts/a.py::cli.<arg 2 of mock.patch.object "sh">',
            "scripts/a.py::cli.<kw key of n = sorted>",
            'scripts/a.py::cli.<kw type of parser.add_argument "--{…}-limit">',
            "scripts/a.py::cli.report[…].<kw key of top = sorted>",
            "scripts/a.py::factory.<returned>",
            "scripts/a.py::run.<default of cb>",
        ])

    def test_a_name_further_in_already_tells_two_lambdas_apart_so_no_number_is_added(self):
        """Numbering every segment among its siblings would key the inner lambda
        `<arg 0 of map>#2.<kw key of sorted>` and move it when a map is added above."""
        source = lambda extra: ("def build(rows):\n" + extra +
                                "    a = list(map(lambda r: r, rows))\n"
                                f"    b = list(map(lambda r: sorted(r, key=lambda x: {lambda_chain(20)}), rows))\n"
                                "    return a, b\n")
        self.put(source(""))
        self.assertEqual(self.gate("--init").returncode, 0)
        key = "scripts/a.py::build.<arg 0 of map>.<kw key of sorted>"
        self.assertEqual(self.baseline()["offenders"], {key: 20})
        self.put(source("    z = list(map(lambda r: -r, rows))\n"))
        done = self.gate()
        self.assertEqual(done.returncode, 0, done.stdout)
        self.assertEqual(self.baseline()["offenders"], {key: 20})

    def test_an_unparseable_file_fails_the_ratchet_and_names_it(self):
        self.put("def f(:\n")
        done = self.gate("--init")
        self.assertEqual(done.returncode, 1, done.stdout)
        self.assertIn("scripts/a.py:1:", done.stdout + done.stderr)

    def test_init_on_a_scope_with_no_function_fails_and_writes_no_baseline(self):
        self.assertEqual(self.gate("--init").returncode, 1)
        self.assertFalse((self.root / self.BASELINE).exists())

    def test_a_scope_that_measures_no_function_fails_even_against_a_baseline(self):
        self.put(function_with_score("f", 3))
        self.gate("--init")
        (self.root / "scripts" / "a.py").unlink()
        done = self.gate()
        self.assertEqual(done.returncode, 1, done.stdout)


OFFENDER = f"lambda x: {lambda_chain(17)}"


class FormCase(NamedTuple):
    """An offender scoring 17 in one form, under `key`; `extra` is an unrelated lambda put before it,
    in the same function and the same kind of place, that differs from it in a name the code gives."""
    form: str
    key: str
    extra: str
    code: Callable[[str], str]


#: One case for each form a lambda, or a container holding one, takes in the tree (the guard below
#: lists them from the tree and fails on one with no case here), and one for each form the gate names
#: as the TypeScript gate does although no file holds it yet. Keyed by order alone, the offender and
#: its unrelated lambda would differ only by order, and the offender would turn NEW OVER.
FORM_CASES = [
    FormCase("lambda in Tuple.elts", 'ROWS.<item 1 "role">', "    ('state', lambda x: x),\n",
             lambda extra: f"ROWS = [\n{extra}    ('role', {OFFENDER}),\n]\n"),
    FormCase("tuple in List.elts", 'routes.<arg 0 of dispatch>.<item 1 "role">', "        ('state', lambda x: x),\n",
             lambda extra: f"def routes():\n    return dispatch([\n{extra}        ('role', {OFFENDER}),\n    ])\n"),
    FormCase("list in Assign.value", 'ROWS.<item 1 "role">', "STATES = [('role', lambda x: x)]\n",
             lambda extra: f"{extra}ROWS = [('role', {OFFENDER})]\n"),
    FormCase("dict in Assign.value", "main.report[…].<kw key of top = sorted>",
             "    summary['b'] = {'top': sorted(rows, key=lambda x: x)}\n",
             lambda extra: f"def main(rows, report, summary):\n{extra}    report['a'] = {{'top': sorted(rows, key={OFFENDER})}}\n"),
    FormCase("lambda in keyword.value", "build.<kw key of first = sorted>", "    rows.sort(key=lambda x: x)\n",
             lambda extra: f"def build(rows):\n{extra}    first = sorted(rows, key={OFFENDER})\n    return first\n"),
    FormCase("lambda in Call.args", 'run.<arg 1 of page.on "pageerror">', "    page.on('console', lambda x: x)\n",
             lambda extra: f"def run(page):\n{extra}    page.on('pageerror', {OFFENDER})\n"),
    FormCase("lambda in Assign.value", "outer.big", "    small = lambda x: x\n",
             lambda extra: f"def outer():\n{extra}    big = {OFFENDER}\n    return big\n"),
    FormCase("lambda in List.elts", "CHECKS.<item 1>", "OTHER = [lambda x: x, lambda x: -x]\n",
             lambda extra: f"{extra}CHECKS = [lambda x: x, {OFFENDER}]\n"),
    FormCase("lambda in BoolOp.values", "send.fetch", "    other = options.get('other') or (lambda x: x)\n",
             lambda extra: f"def send(options):\n{extra}    fetch = options.get('fetch') or ({OFFENDER})\n    return fetch\n"),
    FormCase("lambda in IfExp.body", "pick.chosen", "    other = (lambda x: x) if flag else None\n",
             lambda extra: f"def pick(flag):\n{extra}    chosen = ({OFFENDER}) if flag else None\n    return chosen\n"),
    FormCase("dict in IfExp.body", "outer.api.big", "    other = {'big': lambda x: x} if flag else None\n",
             lambda extra: f"def outer(flag):\n{extra}    api = {{'big': {OFFENDER}}} if flag else None\n    return api\n"),
    FormCase("dict in Call.args", "outer.<arg 0 of m = configure>.big", "    n = other({'big': lambda x: x})\n",
             lambda extra: f"def outer():\n{extra}    m = configure({{'big': {OFFENDER}}})\n    return m\n"),
    FormCase("dict in Return.value", "use_thing.<returned>.big", "    big = lambda x: x\n",
             lambda extra: f"def use_thing():\n{extra}    return {{'big': {OFFENDER}}}\n"),
    FormCase("dict in List.elts", 'MODALS.<item "auth">.open', "    {'id': 'glossary', 'open': lambda x: x},\n",
             lambda extra: f"MODALS = [\n{extra}    {{'id': 'auth', 'open': {OFFENDER}}},\n]\n"),
]

CONTAINER_KIND = {ast.List: "list", ast.Tuple: "tuple", ast.Set: "set", ast.Dict: "dict"}


def place_of(node: ast.AST, parent: ast.AST) -> str:
    """How a node sits in its parent: `Call.args`, `keyword.value`, `Tuple.elts`."""
    field = next(name for name, value in ast.iter_fields(parent)
                 if value is node or (isinstance(value, list) and any(v is node for v in value)))
    return f"{type(parent).__name__}.{field}"


def forms_at(node: ast.Lambda, parents: dict) -> set[str]:
    """The forms on a lambda's path: its own, and that of each container around it."""
    forms = {f"lambda in {place_of(node, parents[node])}"}
    up = parents.get(node)
    while up is not None:
        if type(up) in CONTAINER_KIND:
            forms.add(f"{CONTAINER_KIND[type(up)]} in {place_of(up, parents[up])}")
        up = parents.get(up)
    return forms


def lambdas_in(tree: ast.AST) -> list[tuple[ast.Lambda, set[str]]]:
    """Every lambda in `tree`, with the forms on its path."""
    parents = {child: node for node in ast.walk(tree) for child in ast.iter_child_nodes(node)}
    return [(node, forms_at(node, parents)) for node in ast.walk(tree) if isinstance(node, ast.Lambda)]


def forms_in_tree() -> dict[str, str]:
    """Every form in the Python gate's scope, with one file that holds it."""
    listed = subprocess.run(["git", "ls-files", "-z", "--", *SCOPE_FILE_DATA["python"]["roots"]], cwd=ROOT,
                            capture_output=True, check=True).stdout.decode("utf-8").split("\0")
    found: dict[str, str] = {}
    for rel in listed:
        if rel.endswith(".py") and not GATE_MODULE.excluded(rel, SCOPE_FILE_DATA["GATE_EXCLUSIONS"]):
            for _, forms in lambdas_in(ast.parse((ROOT / rel).read_text(encoding="utf-8"))):
                for form in forms:
                    found.setdefault(form, rel)
    return found


SCOPE_FILE_DATA = json.loads((ROOT / "audit/fixer/complexity_scope.json").read_text(encoding="utf-8"))


class FormCases(unittest.TestCase):
    """The audit of the identity: per form, an unrelated lambda added before a baselined offender
    moves no key. Every case runs in one tree, with the gate run three times for all of them."""

    BASELINE = "audit/fixer/complexity_baseline_py.json"

    @classmethod
    def setUpClass(cls):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "scripts" / "forms").mkdir(parents=True)
            cls.files = [f"scripts/forms/f{i:02d}.py" for i in range(len(FORM_CASES))]

            def write(with_extra: bool) -> None:
                for case, rel in zip(FORM_CASES, cls.files):
                    (root / rel).write_text(case.code(case.extra if with_extra else ""), encoding="utf-8")

            def offenders() -> dict:
                path = root / cls.BASELINE
                return json.loads(path.read_text(encoding="utf-8"))["offenders"] if path.exists() else {}

            write(False)
            cls.init = run_gate("--root", str(root), "--init")
            cls.before = offenders()
            write(True)
            cls.after = run_gate("--root", str(root))
            (root / cls.BASELINE).unlink(missing_ok=True)
            cls.again = run_gate("--root", str(root), "--init")
            cls.reread = offenders()

    def check(self, index: int) -> None:
        case, rel = FORM_CASES[index], self.files[index]
        key = f"{rel}::{case.key}"
        self.assertEqual(self.init.returncode, 0, self.init.stdout + self.init.stderr)
        self.assertEqual([line for line in self.after.stdout.splitlines() if f"{rel}::" in line], [],
                         "the ratchet still knows it")
        self.assertEqual({k: v for k, v in self.before.items() if k.startswith(f"{rel}::")}, {key: 17},
                         "baselined under its name")
        self.assertEqual(self.again.returncode, 0, self.again.stdout + self.again.stderr)
        self.assertEqual({k: v for k, v in self.reread.items() if k.startswith(f"{rel}::")}, {key: 17},
                         "measured again under the same key")

    def test_every_form_a_lambda_or_a_container_holding_one_takes_in_the_tree_has_a_case(self):
        """The audit as a guard: a form new to the tree fails here until a case shows that an
        unrelated lambda added before an offender in that form moves no key."""
        in_tree = forms_in_tree()
        self.assertGreaterEqual(len(in_tree), 5, f"the walk found only {sorted(in_tree)}")
        covered = {case.form for case in FORM_CASES}
        self.assertEqual([f"{form} (as in {rel})" for form, rel in sorted(in_tree.items()) if form not in covered], [])

    def test_each_case_puts_its_offender_in_the_form_it_names(self):
        def offender_forms(case: FormCase) -> set[str]:
            found = lambdas_in(ast.parse(case.code("")))
            return max(found, key=lambda pair: GATE_MODULE.score_of(pair[0]))[1]
        self.assertEqual([case.form for case in FORM_CASES if case.form not in offender_forms(case)], [])


def form_test(index: int):
    def test(self):
        self.check(index)
    return test


for _index, _case in enumerate(FORM_CASES):
    _slug = "".join(ch if ch.isalnum() else "_" for ch in _case.form.lower())
    setattr(FormCases, f"test_{_slug}_keeps_its_key_when_an_unrelated_lambda_is_added_before_it",
            form_test(_index))


if __name__ == "__main__":
    unittest.main()
