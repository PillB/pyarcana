"""CP-N1-A is aligned with the S04 You Do contract, and its evidence is produced by running it.

C15 (proposals-03): the brief, the final interface, the demo and the tests describe one contract
(edad/region/monto_ingreso/raw_line; accept/reject/review; zero accepted). NEW-S04-2: execution.json
must report what the package's tests and demo actually did, not a literal True.

Each mutant is a copy of the package with one rule of demo.classify or run broken. The package's
own test file must turn red for every mutant, or the test suite could pass a wrong implementation.
"""
from __future__ import annotations

import contextlib
import importlib.util
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PKG = ROOT / "course-state" / "capstones" / "CP-N1-A"
GENERATOR = ROOT / "scripts" / "enrich_capstone_packages.py"


def run_tests(package: Path) -> int:
    return subprocess.run([sys.executable, str(package / "tests" / "test_demo.py")],
                          capture_output=True, text=True, cwd=package).returncode


@contextlib.contextmanager
def mutant(replacements: list[tuple[str, str]]):
    """Yield a copy of the package whose demo.py has each old text replaced once by the new text."""
    with tempfile.TemporaryDirectory() as tmp:
        copy = Path(tmp) / "CP-N1-A"
        shutil.copytree(PKG, copy, ignore=shutil.ignore_patterns("__pycache__"))
        source = (copy / "demo.py").read_text(encoding="utf-8")
        for old, new in replacements:
            assert source.count(old) == 1, f"mutant text not found exactly once: {old!r}"
            source = source.replace(old, new)
        (copy / "demo.py").write_text(source, encoding="utf-8")
        yield copy


MUTANTS = {
    "zero_amount_rejected": [("    if monto < 0:\n", "    if monto <= 0:\n")],
    "negative_amount_accepted": [("    if monto < 0:\n", "    if monto < -1000:\n")],
    "missing_edad_accepted": [('    if edad is None:\n        return "review"', '    if edad is None:\n        return "accept"')],
    "unknown_region_accepted": [('    return "review"\n\n\ndef estado_monto', '    return "accept"\n\n\ndef estado_monto')],
    "rate_over_accepts": [("tasa_reject = n_reject / n_total if n_total else None",
                           "tasa_reject = n_reject / n_accept if n_total else None")],
    "empty_batch_rate_zero": [("tasa_reject = n_reject / n_total if n_total else None",
                               "tasa_reject = n_reject / n_total if n_total else 0.0")],
}


def load_generator():
    spec = importlib.util.spec_from_file_location("enrich_capstone_packages", GENERATOR)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


class CpN1AContractAlignment(unittest.TestCase):
    def test_the_brief_and_interface_use_the_s04_field_names(self):
        brief = (PKG / "BRIEF.md").read_text(encoding="utf-8")
        interface = (PKG / "FINAL_INTERFACE.md").read_text(encoding="utf-8")
        for field in ("edad", "region", "monto_ingreso", "raw_line"):
            self.assertIn(field, brief)
        for old in ("amount", "n_warn", "n_ok", "n_error", "error_rate"):
            self.assertNotIn(old, brief)
            self.assertNotIn(old, interface)

    def test_the_interface_lists_the_fields_the_demo_returns(self):
        sys.path.insert(0, str(PKG))
        try:
            import demo
        finally:
            sys.path.remove(str(PKG))
        interface = (PKG / "FINAL_INTERFACE.md").read_text(encoding="utf-8")
        returned = set(demo.IntakeResult.__dataclass_fields__)
        for name in returned:
            self.assertIn(f"`{name}`", interface, f"FINAL_INTERFACE does not document {name}")

    def test_zero_amount_is_accepted_and_the_contract_states_it(self):
        sys.path.insert(0, str(PKG))
        try:
            import demo
        finally:
            sys.path.remove(str(PKG))
        self.assertEqual(demo.classify({"edad": 30, "region": "R-NORTE", "monto_ingreso": 0, "raw_line": "x"}), "accept")
        self.assertIn("`monto_ingreso = 0` → `accept`", (PKG / "BRIEF.md").read_text(encoding="utf-8"))


class CpN1ATestsCanFail(unittest.TestCase):
    def test_the_real_package_passes_its_tests_and_demo(self):
        self.assertEqual(run_tests(PKG), 0)
        demo = subprocess.run([sys.executable, str(PKG / "demo.py")], capture_output=True, text=True)
        self.assertEqual(demo.returncode, 0)
        self.assertIn("METRICS_JSON:", demo.stdout)

    def test_every_mutant_turns_the_package_tests_red(self):
        survivors = []
        for name, replacements in MUTANTS.items():
            with mutant(replacements) as package:
                if run_tests(package) == 0:
                    survivors.append(name)
        self.assertEqual(survivors, [], "these wrong implementations pass the tests")


class CpN1AExecutionIsMeasured(unittest.TestCase):
    def test_committed_execution_matches_a_real_run(self):
        generator = load_generator()
        recorded = json.loads((PKG / "execution.json").read_text(encoding="utf-8"))
        measured = generator.execution_record(PKG, "CP-N1-A", recorded["version"])
        self.assertEqual(recorded["tests_pass"], measured["tests_pass"])
        self.assertEqual(recorded["demo_exits_zero"], measured["demo_exits_zero"])
        self.assertTrue(measured["tests_pass"])

    def test_a_broken_package_is_reported_as_failing(self):
        generator = load_generator()
        with mutant(MUTANTS["zero_amount_rejected"]) as package:
            measured = generator.execution_record(package, "CP-N1-A", "2.0.0")
        self.assertFalse(measured["tests_pass"])
        self.assertEqual(measured["execution_status"], "fail")


if __name__ == "__main__":
    unittest.main()
