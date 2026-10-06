"""Structural rules for the test files themselves, which no other check can see.

`unittest.main()` runs the TestCases defined *above* it. Two files called it halfway down, so
running either one directly - how anyone debugging a single file runs it - silently dropped the
classes below: six tests in `test_concept_prompt_weight.py`, two classes in
`test_gate_concept_measures.py`. Discovery imports the whole module and was unaffected, which is
why nothing noticed. The runner cannot see this either; only reading the file can.

Read with `ast`, never a line scan: the first scan for this flagged
`test_agentic_validator_incomplete.py`, whose `if __name__ == "__main__":` is text inside a code
sample the test feeds to a validator.
"""
from __future__ import annotations

import ast
import contextlib
import importlib.util
import io
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
TEST_FILES = sorted((ROOT / "tests/adversarial").glob("test_*.py")) + sorted((ROOT / "tests").glob("test_*.py"))


def misplaced_main_guard(source: str) -> int | None:
    """Line of a top-level `if __name__ == ...` block that is not the module's last statement."""
    body = ast.parse(source).body
    for i, node in enumerate(body):
        if isinstance(node, ast.If) and "__name__" in ast.unparse(node.test) and i < len(body) - 1:
            return node.lineno
    return None


class MainGuardComesLast(unittest.TestCase):
    def test_every_test_file_runs_whole_when_run_directly(self):
        self.assertGreater(len(TEST_FILES), 0)
        late = {p.relative_to(ROOT).as_posix(): line for p in TEST_FILES
                if (line := misplaced_main_guard(p.read_text(encoding="utf-8")))}
        self.assertEqual(late, {}, "move the `if __name__` block to the end of the file")

    def test_the_rule_flags_a_guard_above_a_class(self):
        self.assertEqual(misplaced_main_guard(
            "import unittest\nif __name__ == '__main__':\n    unittest.main()\n"
            "class Late(unittest.TestCase):\n    pass\n"), 2)

    def test_the_rule_passes_a_guard_at_the_end(self):
        self.assertIsNone(misplaced_main_guard(
            "import unittest\nclass A(unittest.TestCase):\n    pass\n"
            "if __name__ == '__main__':\n    unittest.main()\n"))

    def test_the_rule_ignores_the_guard_inside_a_string(self):
        """The false positive that a line scan made, kept here so no rewrite reintroduces it."""
        self.assertIsNone(misplaced_main_guard(
            'SAMPLE = """\nif __name__ == "__main__":\n    main()\n"""\nclass A:\n    pass\n'))

    def test_the_rule_reads_real_files_the_way_it_reads_these(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "test_x.py"
            path.write_text("if __name__ == '__main__':\n    pass\nx = 1\n", encoding="utf-8")
            self.assertEqual(misplaced_main_guard(path.read_text(encoding="utf-8")), 1)


FUNCTION = (ast.FunctionDef, ast.AsyncFunctionDef)


def _calls(node: ast.AST) -> set[str]:
    """What a body calls by name: bare functions, and methods on self or cls."""
    names = set()
    for n in ast.walk(node):
        if isinstance(n, ast.Call):
            f = n.func
            if isinstance(f, ast.Name):
                names.add(f.id)
            elif isinstance(f, ast.Attribute) and isinstance(f.value, ast.Name) and f.value.id in ("self", "cls"):
                names.add(f.attr)
    return names


def _fails_here(node: ast.AST) -> bool:
    """An assert, a raise, or a TestCase assertion or fail() on any object, in this body."""
    for n in ast.walk(node):
        if isinstance(n, (ast.Assert, ast.Raise)):
            return True
        if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute) \
                and (n.func.attr.startswith("assert") or n.func.attr == "fail"):
            return True
    return False


def _functions(tree: ast.Module, folder: Path) -> dict[str, list[ast.AST]]:
    """Every function this file defines, then those of sibling modules it imports from."""
    defs: dict[str, list[ast.AST]] = {}
    for n in ast.walk(tree):
        if isinstance(n, FUNCTION):
            defs.setdefault(n.name, []).append(n)
    for n in tree.body:
        sibling = folder / f"{n.module}.py" if isinstance(n, ast.ImportFrom) and n.module and not n.level else None
        if sibling and sibling.is_file():
            for d in ast.walk(ast.parse(sibling.read_text(encoding="utf-8"))):
                if isinstance(d, FUNCTION) and d.name not in defs:
                    defs[d.name] = [d]
    return defs


def unfailable_tests(source: str, folder: Path) -> list[str]:
    """Test methods with no way to fail: no assert, raise or assertion call in the body, nor in
    any function it calls from this file or a sibling helper module. A module-level test
    function is listed too, because unittest never collects it."""
    tree = ast.parse(source)
    defs = _functions(tree, folder)
    can = set()

    def can_fail(name: str, seen: frozenset) -> bool:
        if name in can:
            return True
        if name in seen or name not in defs:
            return False
        if any(_fails_here(d) or any(can_fail(c, seen | {name}) for c in _calls(d)) for d in defs[name]):
            can.add(name)
            return True
        return False

    found = [f"{n.name}:{n.lineno} (module level)" for n in tree.body
             if isinstance(n, FUNCTION) and n.name.startswith("test")]
    for cls in (n for n in tree.body if isinstance(n, ast.ClassDef)):
        for fn in cls.body:
            if isinstance(fn, FUNCTION) and fn.name.startswith("test") and not _fails_here(fn) \
                    and not any(can_fail(c, frozenset({fn.name})) for c in _calls(fn)):
                found.append(f"{cls.name}.{fn.name}:{fn.lineno}")
    return found


class EveryTestCanFail(unittest.TestCase):
    """Codex's P1 on #75 was a test whose only assertion had been deleted: it read a file and
    passed for every possible content. A test with no failure path is a green check that cannot
    turn red, which AGENTS.md calls worse than no test. Read with `ast`, following helpers."""

    def test_no_test_in_either_suite_lacks_a_failure_path(self):
        self.assertGreater(len(TEST_FILES), 0)
        found = {p.relative_to(ROOT).as_posix(): hits for p in TEST_FILES
                 if (hits := unfailable_tests(p.read_text(encoding="utf-8"), p.parent))}
        self.assertEqual(found, {}, "give each listed test an assertion that can fail")

    def check(self, source: str, helpers: dict[str, str] | None = None) -> list[str]:
        with tempfile.TemporaryDirectory() as tmp:
            for name, text in (helpers or {}).items():
                (Path(tmp) / f"{name}.py").write_text(text, encoding="utf-8")
            return unfailable_tests(source, Path(tmp))

    def test_a_test_that_only_reads_a_file_is_flagged(self):
        """The shape of #75's test, after its assertion was deleted."""
        self.assertEqual(self.check(
            "class T(unittest.TestCase):\n"
            "    def test_pdf(self):\n"
            "        text = Path('PdfReport.tsx').read_text()\n"), ["T.test_pdf:2"])

    def test_an_assertion_in_the_body_counts(self):
        self.assertEqual(self.check(
            "class T(unittest.TestCase):\n    def test_x(self):\n        self.assertTrue(1)\n"), [])

    def test_an_assertion_in_a_helper_of_the_same_file_counts(self):
        self.assertEqual(self.check(
            "def require(x):\n    if not x:\n        raise AssertionError(x)\n"
            "class T(unittest.TestCase):\n    def test_x(self):\n        self.go()\n"
            "    def go(self):\n        require(1)\n"), [])

    def test_an_assertion_in_a_sibling_helper_module_counts(self):
        source = "from script_case import passes\nclass T(unittest.TestCase):\n    def test_x(self):\n        passes(self)\n"
        self.assertEqual(self.check(source, {"script_case": "def passes(case):\n    case.fail('no')\n"}), [])
        self.assertEqual(self.check(source, {"script_case": "def passes(case):\n    return None\n"}),
                         ["T.test_x:3"])

    def test_a_module_level_test_function_is_flagged(self):
        """unittest collects TestCase methods only, so this one never runs."""
        self.assertEqual(self.check("def test_x():\n    assert True\n"), ["test_x:1 (module level)"])


def load_runner():
    spec = importlib.util.spec_from_file_location("run_adversarial_py",
                                                  ROOT / "scripts/run_adversarial_py.py")
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


class RunnerRefusesOtherInterpreters(unittest.TestCase):
    """The runner checked only a floor, so 3.13 and 3.14 ran the suites and reported a verdict
    its own rule calls incomparable. Both directions are refused now."""

    def verdict_under(self, version: tuple) -> tuple[int, str]:
        runner = load_runner()
        # Should the refusal ever break, fail here instead of running the whole suite from
        # inside one of its own tests.
        ran = AssertionError("the runner went on to run the suites")
        with mock.patch.object(sys, "version_info", version), \
                mock.patch.object(runner, "run_all", side_effect=ran), \
                mock.patch.object(runner, "run_suite", side_effect=ran), \
                mock.patch.object(runner.os, "chdir"), \
                contextlib.redirect_stderr(io.StringIO()) as err:
            return runner.main([]), err.getvalue()

    def test_an_older_python_is_refused(self):
        code, err = self.verdict_under((3, 11, 9, "final", 0))
        self.assertEqual(code, 2)
        self.assertIn("REFUSED: Python 3.11.9 is not CI's 3.12", err)

    def test_a_newer_python_is_refused(self):
        code, err = self.verdict_under((3, 13, 1, "final", 0))
        self.assertEqual(code, 2)
        self.assertIn("REFUSED: Python 3.13.1 is not CI's 3.12", err)


if __name__ == "__main__":
    unittest.main()
