"""Neither capstone generator writes into a hand-maintained package (proposal 11, step 1).

Two scripts generate capstone packages: course-state/capstones/_generate_formal_packages.py
(gate.json, demo.py, evidence_manifest.json, RUN.md, the card, execution.json) and
scripts/enrich_capstone_packages.py (brief, tests, starter, the .md pages). After #141 rewrote
CP-N1-A by hand, only the second script skipped it. Re-running the first replaced CP-N1-A's demo.py
with the pre-#141 version (155 diff lines) and silently undid the fix. Proposal 11 rebuilds
CP-N1-B and CP-N1-C by hand too, so both scripts now read one list, HAND_MAINTAINED.json.

Re-running either script also changes 2 to 9 committed files in each of the other ten packages
(measured 2026-11-21), so both now refuse to run without --overwrite-hand-edits.

This test runs both generators on a copy of the capstones folder and checks that no file of a
listed package changed, except execution.json, which the enrich script re-measures.

It also checks that execution.json is measured and never a green check without evidence: a test
body that is only `assert True  # placeholder` cannot fail, so a suite that has one is recorded
as not passing (proposal 10, CP-N1-B/execution.json.1 and CP-N1-C/execution.json.1).
"""
from __future__ import annotations

import hashlib
import importlib.util
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CAPSTONES = ROOT / "course-state" / "capstones"
FORMAL = "_generate_formal_packages.py"
ENRICH = Path("scripts") / "enrich_capstone_packages.py"
FLAG = "--overwrite-hand-edits"
LISTED = json.loads((CAPSTONES / "HAND_MAINTAINED.json").read_text(encoding="utf-8"))["packages"]


def load_enrich(repo: Path):
    spec = importlib.util.spec_from_file_location("enrich_capstone_packages", repo / ENRICH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


def digests(package: Path) -> dict[str, str]:
    out = {}
    for f in sorted(package.rglob("*")):
        if f.is_file() and "__pycache__" not in f.parts and f.name != "execution.json":
            out[str(f.relative_to(package))] = hashlib.sha256(f.read_bytes()).hexdigest()
    return out


class GeneratorsLeaveHandMaintainedPackagesAlone(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        repo = Path(cls._tmp.name)
        copy = repo / "course-state" / "capstones"
        shutil.copytree(CAPSTONES, copy, ignore=shutil.ignore_patterns("__pycache__"))
        (repo / "scripts").mkdir()
        shutil.copy2(ROOT / ENRICH, repo / ENRICH)
        cls.before = {cid: digests(CAPSTONES / cid) for cid in LISTED}
        # The formal generator exits 1 when any demo in the copy fails; that is not what is tested.
        cls.formal = subprocess.run([sys.executable, FORMAL, FLAG], cwd=copy, capture_output=True,
                                    text=True, timeout=600)
        cls.enrich = subprocess.run([sys.executable, str(ENRICH), FLAG], cwd=repo,
                                    capture_output=True, text=True, timeout=600)
        cls.after = {cid: digests(copy / cid) for cid in LISTED}

    @classmethod
    def tearDownClass(cls):
        cls._tmp.cleanup()

    def test_the_list_names_the_three_level_one_packages(self):
        self.assertEqual(sorted(LISTED), ["CP-N1-A", "CP-N1-B", "CP-N1-C"])

    def test_both_generators_ran(self):
        self.assertIn("[skip] CP-N1-A is hand-maintained", self.formal.stdout, self.formal.stderr)
        self.assertEqual(self.enrich.returncode, 0, self.enrich.stderr)

    def test_no_file_of_a_listed_package_changed(self):
        changed = {}
        for cid in LISTED:
            b, a = self.before[cid], self.after[cid]
            diff = sorted(k for k in set(b) | set(a) if b.get(k) != a.get(k))
            if diff:
                changed[cid] = diff
        self.assertEqual(changed, {}, "a generator wrote into a hand-maintained package")


class GeneratorsRefuseWithoutTheFlag(unittest.TestCase):
    """Every other package was also edited after the generators last ran, so a plain run must stop."""

    def test_each_generator_exits_before_writing(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            copy = repo / "course-state" / "capstones"
            shutil.copytree(CAPSTONES, copy, ignore=shutil.ignore_patterns("__pycache__"))
            (repo / "scripts").mkdir()
            shutil.copy2(ROOT / ENRICH, repo / ENRICH)
            before = {d.name: digests(d) for d in copy.glob("CP-*")}
            runs = [subprocess.run([sys.executable, FORMAL], cwd=copy, capture_output=True, text=True),
                    subprocess.run([sys.executable, str(ENRICH)], cwd=repo, capture_output=True,
                                   text=True)]
            after = {d.name: digests(d) for d in copy.glob("CP-*")}
        for run in runs:
            self.assertNotEqual(run.returncode, 0)
            self.assertIn(FLAG, run.stderr)
        self.assertEqual(before, after)


class ExecutionRecordIsMeasured(unittest.TestCase):
    def test_a_placeholder_suite_is_not_recorded_as_passing(self):
        enrich = load_enrich(ROOT)
        with tempfile.TemporaryDirectory() as tmp:
            pkg = Path(tmp)
            (pkg / "tests").mkdir()
            (pkg / "demo.py").write_text('print("METRICS_JSON: {}")\n', encoding="utf-8")
            (pkg / "tests" / "test_demo.py").write_text(
                "def test_0():\n    assert True  # placeholder — replace with real check\n\n"
                "test_0()\n", encoding="utf-8")
            measured = enrich.execution_record(pkg, "CP-X", "0.0.0")
        self.assertTrue(measured["demo_exits_zero"])
        self.assertEqual(measured["placeholder_tests"], 1)
        self.assertFalse(measured["tests_pass"])
        self.assertEqual(measured["execution_status"], "fail")

    def test_each_committed_record_matches_a_real_run(self):
        enrich = load_enrich(ROOT)
        for cid in LISTED:
            with self.subTest(cid):
                pkg = CAPSTONES / cid
                recorded = json.loads((pkg / "execution.json").read_text(encoding="utf-8"))
                measured = enrich.execution_record(pkg, cid, recorded["version"])
                for key in ("execution_status", "demo_exits_zero", "tests_pass", "placeholder_tests"):
                    self.assertEqual(recorded.get(key), measured[key], key)

    def test_the_index_agrees_with_each_record(self):
        index = json.loads((CAPSTONES / "INDEX.json").read_text(encoding="utf-8"))
        rows = {c["id"]: c for c in index["capstones"]}
        for cid in LISTED:
            with self.subTest(cid):
                recorded = json.loads((CAPSTONES / cid / "execution.json").read_text(encoding="utf-8"))
                passed = recorded["execution_status"] == "pass"
                self.assertEqual(rows[cid]["execution_status"], recorded["execution_status"])
                self.assertEqual(rows[cid]["formally_ready"], passed)
        self.assertEqual(index["passed"], sum(c["execution_status"] == "pass" for c in rows.values()))


if __name__ == "__main__":
    unittest.main()
