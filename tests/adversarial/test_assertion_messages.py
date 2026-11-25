"""AGENTS.md "Fail loudly": an assertion carries a message naming the defect it guards.

The proposal 12 section tests are checked statically. A weak assertion is assertTrue, assertFalse,
assertIsNone, assertIsNotNone or a bare `assert` with no message: when it fails it says only
"False is not true", which names neither the defect nor what the code produced. assertIn,
assertEqual and the other comparisons print expected against actual on their own, and the
defect is named by the test's docstring or subTest; this test does not require a message there.
"""
from __future__ import annotations

import ast
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
WEAK = {"assertTrue", "assertFalse", "assertIsNone", "assertIsNotNone"}


def weak_assertions(source: str) -> list[tuple[int, str]]:
    """(line, call) for every assertion that would fail without saying what went wrong."""
    found = []
    for node in ast.walk(ast.parse(source)):
        if isinstance(node, ast.Assert) and node.msg is None:
            found.append((node.lineno, "assert"))
        elif (isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute)
              and node.func.attr in WEAK and len(node.args) < 2
              and not any(k.arg == "msg" for k in node.keywords)):
            found.append((node.lineno, node.func.attr))
    return sorted(found)


class AssertionsSayWhatFailed(unittest.TestCase):
    def test_the_check_sees_a_weak_assertion(self) -> None:
        """Negative control: the checker flags the forms it exists to catch, and passes the fixed ones."""
        bad = "self.assertTrue(ok)\nself.assertIsNone(m)\nassert x\n"
        good = 'self.assertTrue(ok, "why")\nself.assertIsNone(m, msg="why")\nassert x, "why"\nself.assertIn(a, b)\n'
        self.assertEqual(sorted(c for _, c in weak_assertions(bad)), ["assert", "assertIsNone", "assertTrue"],
                         "the checker missed a weak assertion, so the scan below would pass vacuously")
        self.assertEqual(weak_assertions(good), [],
                         "the checker flagged an assertion that carries a message")

    def test_proposal12_section_tests_have_no_weak_assertion(self) -> None:
        files = sorted(HERE.glob("test_proposal12_*.py"))
        self.assertGreater(len(files), 0, f"no test_proposal12_*.py found next to {HERE}; the scan checked nothing")
        offenders = [f"{f.name}:{line} {call}" for f in files
                     for line, call in weak_assertions(f.read_text(encoding="utf-8"))]
        self.assertEqual(offenders, [],
                         "these assertions fail as 'False is not true'. Next step: add a message that names the "
                         "defect and shows the actual value (see AGENTS.md, Fail loudly)")


if __name__ == "__main__":
    unittest.main()
