"""The S10 You Do bootstrap writes a project whose own test suite passes.

The S10 brief tells the learner to run `bootstrap_familiarity.py` and then
`python -m unittest discover -s tests`. The generated `tests/test_core.py` and the generated
`parse_monto` live in the same starter string, so a change to one can silently break the other:
batch-1 fix 01 (Nov 2026) made `parse_monto("10,5")` raise (one decimal after a comma is ambiguous)
while the generated test still expected `Decimal("10.50")`. This test runs the bootstrap in a
temporary folder and then the generated suite, exactly as the learner would.
"""

from __future__ import annotations

import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s10-modules-packaging-cli.ts"
STARTER = re.compile(r'starterCode: `(?P<code>"""bootstrap_familiarity\.py.*?)`,\n', re.S)


def bootstrap_source() -> str:
    match = STARTER.search(SECTION.read_text(encoding="utf-8"))
    assert match, "bootstrap starter not found"
    code = match.group("code")
    # The test unescapes nothing, so it must not meet a template-literal escape it would misread.
    assert "\\" not in code and "${" not in code, "starter now uses template escapes; extend this test"
    return code


def run(args: list[str], cwd: Path, env_path: str | None = None) -> subprocess.CompletedProcess:
    env = {"PATH": "/usr/bin:/bin", "PYTHONDONTWRITEBYTECODE": "1"}
    if env_path:
        env["PYTHONPATH"] = env_path
    return subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True, timeout=60)


class S10BootstrapSuite(unittest.TestCase):
    def test_generated_suite_passes(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            work = Path(folder)
            (work / "bootstrap_familiarity.py").write_text(bootstrap_source(), encoding="utf-8")
            made = run([sys.executable, "bootstrap_familiarity.py"], work)
            self.assertEqual(made.returncode, 0, made.stderr)
            project = work / "familiarity_core_project"
            suite = run(
                [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
                project,
                env_path=str(project / "src"),
            )
            self.assertEqual(suite.returncode, 0, suite.stderr)
            self.assertRegex(suite.stderr, r"Ran [1-9]\d* tests?")

    def test_generated_suite_pins_the_ambiguous_comma(self) -> None:
        # The generated suite must keep a rejection case, or the parser contract can drift back.
        self.assertIn('parse_monto("10,5")', bootstrap_source())
        self.assertIn("assertRaises(ValueError)", bootstrap_source())


if __name__ == "__main__":
    unittest.main()
