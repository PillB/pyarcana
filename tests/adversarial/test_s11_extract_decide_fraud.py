"""S11-T4-B-E3: the extraction really removes decide_fraud from Client, and the assert checks Client.

Before the fix the solution defined a brand-new RelationshipEvidence, asserted that it had no
decide_fraud, and left Client with the method. That assert could not fail, because the class it
checked never had the method (AGENTS.md: a check that cannot fail is worse than no check).

The ANTES line is kept on purpose: it is the counterexample (D24) and it still prints True.
"""

from __future__ import annotations

import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s11-oop-domain.ts"
EXERCISE = "S11-T4-B-E3"


def exercise_block(text: str, ex_id: str) -> str:
    start = text.index(f'id: "{ex_id}"')
    following = re.search(r'\n\s+id: "S11-', text[start + 1:])
    end = start + 1 + following.start() if following else len(text)
    return text[start:end]


def field_code(block: str, name: str) -> str:
    match = re.search(name + r": \{.*?code: `(?P<code>.*?)`", block, re.S)
    assert match, f"{name} not found"
    return match.group("code")


def field_output(block: str, name: str) -> str:
    match = re.search(name + r": \{.*?output: `(?P<out>.*?)`", block, re.S)
    assert match, f"{name} output not found"
    return match.group("out")


def run_python(code: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as folder:
        script = Path(folder) / "extract_fraud.py"
        script.write_text(code, encoding="utf-8")
        return subprocess.run(
            [sys.executable, "-I", str(script)],
            cwd=folder, capture_output=True, text=True, timeout=60,
        )


class ExtractDecideFraud(unittest.TestCase):
    def setUp(self) -> None:
        self.block = exercise_block(SECTION.read_text(encoding="utf-8"), EXERCISE)
        self.solution = field_code(self.block, "solutionCode")
        self.expected = field_output(self.block, "solutionCode")

    def test_solution_output_is_the_pinned_output(self) -> None:
        done = run_python(self.solution)
        self.assertEqual(done.returncode, 0, done.stderr)
        self.assertEqual(done.stdout.strip(), self.expected.strip())

    def test_assertions_target_the_real_client(self) -> None:
        self.assertIn('assert not hasattr(Client, "decide_fraud")', self.solution)
        self.assertNotIn('hasattr(RelationshipEvidence, "decide_fraud")', self.solution)

    def test_client_has_no_verdict_after_the_extraction(self) -> None:
        # Probe appended to the real solution: Client, the class that had the method, must not have it.
        probe = self.solution + '\nprint("PROBE", hasattr(Client, "decide_fraud"))\n'
        done = run_python(probe)
        self.assertEqual(done.returncode, 0, done.stderr)
        self.assertEqual(done.stdout.strip().splitlines()[-1], "PROBE False")

    def test_mutant_that_keeps_the_method_fails_its_own_assert(self) -> None:
        # Negative control: put the verdict back on the post-extraction Client. The solution's
        # assert must catch it, or the assert is still the tautology the finding describes.
        marker = "class Client:\n    client_id: str\n"
        index = self.solution.rfind(marker)
        self.assertNotEqual(index, -1)
        head, tail = self.solution[:index], self.solution[index:]
        mutant = head + tail.replace(
            "    client_id: str\n",
            "    client_id: str\n\n    def decide_fraud(self, score: float) -> bool:\n        return score >= 0.9\n",
            1,
        )
        done = run_python(mutant)
        self.assertNotEqual(done.returncode, 0, "the mutant kept decide_fraud and the assert did not notice")
        self.assertIn("AssertionError", done.stderr)


if __name__ == "__main__":
    unittest.main()
