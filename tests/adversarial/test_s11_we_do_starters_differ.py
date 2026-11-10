"""The S11 We Do starters are not already the answer (NEW-S11-1).

Three starters printed their expected output unchanged, so a learner who ran the starter
"passed" without doing the exercise. Each starter must now fail in a visible way whose stdout
differs from the expected output. The solution of each exercise must still print that output,
which pins the exercise's meaning. A control proves the comparison itself can fail.
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

# exercise id -> the error type the starter's defect must raise (the course's own DEFECT marker)
EXPECTED_DEFECTS = {
    "S11-T3-B-E1": "AttributeError",
    "S11-T4-B-E1": "AssertionError",
    "S11-T4-B-E2": "TypeError",
}


def exercise_block(text: str, ex_id: str) -> str:
    start = text.index(f'id: "{ex_id}"')
    following = re.search(r'\n\s+id: "S11-', text[start + 1:])
    end = start + 1 + following.start() if following else len(text)
    return text[start:end]


def field(block: str, name: str, key: str) -> str:
    if key == "output":
        pattern = name + r": \{.*?output: `(?P<v>.*?)`"
    else:
        pattern = name + r": \{.*?code: `(?P<v>.*?)`"
    match = re.search(pattern, block, re.S)
    assert match, f"{name}.{key} not found"
    return match.group("v")


def run_python(code: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as folder:
        script = Path(folder) / "exercise.py"
        script.write_text(code, encoding="utf-8")
        return subprocess.run(
            [sys.executable, "-I", str(script)],
            cwd=folder, capture_output=True, text=True, timeout=60,
        )


def differs_from_expected(stdout: str, expected: str) -> bool:
    return stdout.strip() != expected.strip()


class WeDoStartersDiffer(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        text = SECTION.read_text(encoding="utf-8")
        cls.blocks = {ex_id: exercise_block(text, ex_id) for ex_id in EXPECTED_DEFECTS}

    def test_each_starter_output_differs_from_the_expected_output(self) -> None:
        for ex_id, defect in EXPECTED_DEFECTS.items():
            with self.subTest(exercise=ex_id):
                block = self.blocks[ex_id]
                expected = field(block, "solutionCode", "output")
                done = run_python(field(block, "starterCode", "code"))
                self.assertTrue(
                    differs_from_expected(done.stdout, expected),
                    f"{ex_id}: the starter already prints the expected output {expected!r}",
                )
                self.assertNotEqual(done.returncode, 0, f"{ex_id}: the starter must show its defect")
                self.assertIn(defect, done.stderr, f"{ex_id}: defect is not {defect}: {done.stderr[-200:]}")

    def test_each_solution_prints_the_pinned_output(self) -> None:
        # Pins the meaning: the reference solution still produces the expected output.
        for ex_id in EXPECTED_DEFECTS:
            with self.subTest(exercise=ex_id):
                block = self.blocks[ex_id]
                expected = field(block, "solutionCode", "output")
                done = run_python(field(block, "solutionCode", "code"))
                self.assertEqual(done.returncode, 0, done.stderr)
                self.assertEqual(done.stdout.strip(), expected.strip())

    def test_control_identical_output_is_reported_as_already_the_answer(self) -> None:
        # Negative control: the comparison must be able to say "this starter is the answer".
        self.assertFalse(differs_from_expected("0.5\n", "0.5"))
        self.assertFalse(differs_from_expected("pass\n", "pass"))
        self.assertTrue(differs_from_expected("", "0.5"))


if __name__ == "__main__":
    unittest.main()
