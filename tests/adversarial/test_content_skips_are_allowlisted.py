"""Every test that skips without the pinned content interpreter has a skip_allowlist.json entry.

Found on #189 (25 Nov 2026): a new ExamBank test in test_proposal12_s17.py ran pandas behind
`@needs_pandas`. Locally `.venv-content` exists, so it ran and passed. The adversarial CI job has
no pandas, so it skipped, and `run_adversarial_py.py` failed the job on a skip the allowlist did not
name. The allowlist is checked against the skips that happen, and the skips that happen depend on
the machine. A missing entry is invisible wherever the interpreter is installed, which is every
machine a change is written on.

This test reads the decorators instead of the run. A module-level name bound to
`unittest.skipUnless(...)` or `unittest.skipIf(...)` whose reason names the pinned content
interpreter is a content skip. Every test function or class it decorates must appear in the
allowlist, here and on any machine.

Run: python3 -m unittest tests.adversarial.test_content_skips_are_allowlisted
"""
from __future__ import annotations

import ast
import json
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
ALLOWLIST = HERE / "skip_allowlist.json"
MARK = "pinned content interpreter"


def content_skip_names(tree: ast.Module) -> set[str]:
    """Module-level names bound to unittest.skipUnless/skipIf with a content-interpreter reason."""
    names = set()
    for node in tree.body:
        if not (isinstance(node, ast.Assign) and isinstance(node.value, ast.Call)):
            continue
        func = node.value.func
        if not (isinstance(func, ast.Attribute) and func.attr in ("skipUnless", "skipIf")):
            continue
        reasons = [a.value for a in node.value.args if isinstance(a, ast.Constant) and isinstance(a.value, str)]
        if any(MARK in r for r in reasons):
            names |= {t.id for t in node.targets if isinstance(t, ast.Name)}
    return names


def decorated_ids(module: str, tree: ast.Module, marks: set[str]) -> set[str]:
    """`module.Class.test` for each test the marks decorate. unittest reports a skipped class once
    per test method, so a decorated class stands for every test method in it."""
    def marked(node) -> bool:
        return any(isinstance(d, ast.Name) and d.id in marks for d in node.decorator_list)

    found = set()
    for node in tree.body:
        if isinstance(node, ast.ClassDef):
            whole = marked(node)
            for item in node.body:
                if isinstance(item, ast.FunctionDef) and item.name.startswith("test") and (whole or marked(item)):
                    found.add(f"{module}.{node.name}.{item.name}")
    return found


def needed() -> set[str]:
    out = set()
    for path in sorted(HERE.glob("test_*.py")):
        tree = ast.parse(path.read_text(encoding="utf-8"))
        marks = content_skip_names(tree)
        if marks:
            out |= decorated_ids(path.stem, tree, marks)
    return out


def allowed() -> set[str]:
    return {e["test"] for e in json.loads(ALLOWLIST.read_text(encoding="utf-8"))["allowed"]
            if MARK in e.get("reason_contains", "")}


class ContentSkipsAreAllowlisted(unittest.TestCase):
    def test_the_reader_finds_the_content_skips(self) -> None:
        self.assertGreater(len(needed()), 20, "the decorator reader found too few to mean anything")

    def test_the_reader_sees_a_planted_decorator(self) -> None:
        src = ("import unittest\nneeds_x = unittest.skipUnless(None, 'needs the pinned content interpreter (x)')\n"
               "class K(unittest.TestCase):\n    @needs_x\n    def test_a(self): pass\n    def test_b(self): pass\n"
               "@needs_x\nclass W(unittest.TestCase):\n    def test_c(self): pass\n")
        tree = ast.parse(src)
        self.assertEqual(decorated_ids("m", tree, content_skip_names(tree)), {"m.K.test_a", "m.W.test_c"})

    def test_every_content_skip_has_an_allowlist_entry(self) -> None:
        missing = sorted(needed() - allowed())
        self.assertEqual(missing, [], "add these to tests/adversarial/skip_allowlist.json, with the "
                         "content-gates step that runs them as covered_by")


if __name__ == "__main__":
    unittest.main()
