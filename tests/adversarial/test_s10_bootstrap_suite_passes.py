"""The S10 You Do bootstrap: the reference passes its own suite, the starter fails until the TODOs are done.

The S10 brief tells the learner to run `bootstrap_familiarity.py` and then
`python -m unittest discover -s tests`. The generated files live in one template string per
version, so a change to one can silently break another. Two contracts are pinned here:

- `solutionCode` (the reference, revealed behind a button) passes the generated suite. Its
  `parse_monto("10,5")` case is the batch-1 fix 01 contract, and the extra-column row is the
  NEW-S10-1 contract (a row with an unquoted comma must be quarantined, not stored as 1.00).
- `starterCode` is what the learner gets. Its layer readers in `config.py` are TODO stubs, so
  the generated tests for the env and file layers must fail until the learner writes them.
  Only TODO hunks may differ between the two versions.

Each test runs the bootstrap in a temporary folder, exactly as the learner would.
"""

from __future__ import annotations

import difflib
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s10-modules-packaging-cli.ts"
STARTER = re.compile(r'    starterCode: `(?P<code>"""bootstrap_familiarity\.py.*?)`,\n', re.S)
REFERENCE = re.compile(r'    solutionCode: {\n.*?\n      code: `(?P<code>"""bootstrap_familiarity\.py.*?)`,\n', re.S)
EXTRA_COLUMN_CHECK = "            if None in row:\n"


def _section_text() -> str:
    return SECTION.read_text(encoding="utf-8")


def bootstrap_source(pattern: re.Pattern[str]) -> str:
    match = pattern.search(_section_text())
    assert match, "bootstrap block not found in the S10 You Do"
    code = match.group("code")
    # The test unescapes nothing, so it must not meet a template-literal escape it would misread.
    assert "\\" not in code and "${" not in code, "bootstrap now uses template escapes; extend this test"
    return code


def reference_source() -> str:
    return bootstrap_source(REFERENCE)


def starter_source() -> str:
    return bootstrap_source(STARTER)


def run(args: list[str], cwd: Path, env_path: str | None = None) -> subprocess.CompletedProcess:
    env = {"PATH": "/usr/bin:/bin", "PYTHONDONTWRITEBYTECODE": "1"}
    if env_path:
        env["PYTHONPATH"] = env_path
    return subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True, timeout=60)


def make_project(code: str, work: Path) -> Path:
    (work / "bootstrap_familiarity.py").write_text(code, encoding="utf-8")
    made = run([sys.executable, "bootstrap_familiarity.py"], work)
    assert made.returncode == 0, made.stderr
    return work / "familiarity_core_project"


def run_generated_suite(project: Path) -> subprocess.CompletedProcess:
    return run(
        [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
        project,
        env_path=str(project / "src"),
    )


class S10BootstrapSuite(unittest.TestCase):
    def test_reference_suite_passes(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            project = make_project(reference_source(), Path(folder))
            suite = run_generated_suite(project)
            self.assertEqual(suite.returncode, 0, suite.stderr)
            self.assertRegex(suite.stderr, r"Ran [1-9]\d* tests?")

    def test_starter_suite_fails_on_the_unfinished_layers(self) -> None:
        # Falsifiable: if the TODO stubs ever return the right answer, or the tests stop
        # checking the layers, the starter passes and this test goes red.
        with tempfile.TemporaryDirectory() as folder:
            project = make_project(starter_source(), Path(folder))
            suite = run_generated_suite(project)
            self.assertNotEqual(suite.returncode, 0, "the starter must not pass its own suite")
            self.assertIn("test_env_layer_is_validated", suite.stderr)
            self.assertIn("test_file_layer_is_validated", suite.stderr)

    def test_starter_differs_from_reference_only_in_todo_hunks(self) -> None:
        starter_lines = starter_source().splitlines()
        reference_lines = reference_source().splitlines()
        hunks = [
            (tag, starter_lines[j1:j2])
            for tag, _i1, _i2, j1, j2 in difflib.SequenceMatcher(
                a=reference_lines, b=starter_lines, autojunk=False
            ).get_opcodes()
            if tag != "equal"
        ]
        self.assertTrue(hunks, "starter and reference are identical: the starter is the answer")
        for tag, lines in hunks:
            self.assertTrue(
                any("TODO" in line for line in lines),
                f"a {tag} hunk changes the starter without a TODO: {lines[:3]}",
            )

    def test_generated_suite_pins_the_ambiguous_comma(self) -> None:
        # The generated suite must keep a rejection case, or the parser contract can drift back.
        self.assertIn('parse_monto("10,5")', reference_source())
        self.assertIn("assertRaises(ValueError)", reference_source())

    def test_extra_column_row_is_quarantined_in_the_starter(self) -> None:
        # NEW-S10-1. The starter's ETL is not a learner task, so it must already be correct.
        # On the base commit `C3,Eva,1,234` reached clean data as monto 1.00 with reconcile_ok true.
        with tempfile.TemporaryDirectory() as folder:
            work = Path(folder)
            project = make_project(starter_source(), work)
            source = work / "clients.csv"
            source.write_text("id,name,monto\nC1,Ana,10.50\nC3,Eva,1,234\n", encoding="utf-8")
            probe = work / "probe.py"
            probe.write_text(
                "import json, sys\n"
                "from pathlib import Path\n"
                "from familiarity_core import run_ingest\n"
                "m = run_ingest(Path(sys.argv[1]), Path(sys.argv[2]))\n"
                "clean = json.loads(Path(sys.argv[2], 'clean.json').read_text(encoding='utf-8'))\n"
                "print(m['n_clean'], m['n_quarantine'], [r['id'] for r in clean])\n",
                encoding="utf-8",
            )
            done = run(
                [sys.executable, str(probe), str(source), str(work / "out")],
                project,
                env_path=str(project / "src"),
            )
            self.assertEqual(done.returncode, 0, done.stderr)
            # Negative control: a good row is still clean, so the probe is not just rejecting everything.
            self.assertEqual(done.stdout.strip(), "1 1 ['C1']")

    def test_detector_sees_the_extra_column_defect_when_the_check_is_removed(self) -> None:
        # Vacuity guard for the test above: remove the check from the starter and the same
        # probe must show the defect, otherwise the probe could never fail.
        mutant = starter_source()
        self.assertEqual(mutant.count(EXTRA_COLUMN_CHECK), 1, "the extra-column check moved or vanished")
        mutant = mutant.replace(EXTRA_COLUMN_CHECK, "            if False:\n")
        with tempfile.TemporaryDirectory() as folder:
            work = Path(folder)
            project = make_project(mutant, work)
            source = work / "clients.csv"
            source.write_text("id,name,monto\nC1,Ana,10.50\nC3,Eva,1,234\n", encoding="utf-8")
            probe = work / "probe.py"
            probe.write_text(
                "from pathlib import Path\n"
                "import sys\n"
                "from familiarity_core import run_ingest\n"
                "m = run_ingest(Path(sys.argv[1]), Path(sys.argv[2]))\n"
                "print(m['n_clean'])\n",
                encoding="utf-8",
            )
            done = run(
                [sys.executable, str(probe), str(source), str(work / "out")],
                project,
                env_path=str(project / "src"),
            )
            # The mutant accepts the bad row: two clean rows, one of them the extra-column one.
            self.assertEqual(done.returncode, 0, done.stderr)
            self.assertEqual(done.stdout.strip(), "2", "without the check the defect must reach clean data")


if __name__ == "__main__":
    unittest.main()
