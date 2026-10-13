"""The Python complexity gate, exercised as a process the way CI and the owner run it.

Each test writes its Python into a temporary directory outside the repository, so nothing here
touches the tracked tree (`run_adversarial_py` fails a run that writes into it). Subprocesses
keep the tests on the gate's real entry point, not on a copy of its functions.
"""
from __future__ import annotations

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


if __name__ == "__main__":
    unittest.main()
