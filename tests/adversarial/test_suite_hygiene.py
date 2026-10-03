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
import tempfile
import unittest
from pathlib import Path

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


if __name__ == "__main__":
    unittest.main()
