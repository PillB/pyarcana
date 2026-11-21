"""CP-N1-A is aligned with the S04 You Do contract, and its tests can tell right from wrong.

C15 (proposals-03): the brief, the final interface, the reference and the tests describe one
contract (edad/region/monto_ingreso/raw_line; accept/review/reject; zero accepted). NEW-S04-2:
execution.json reports what the package's tests and demo actually did, not a literal True.

Proposal 11, step 2 (approved 2026-11-21):
- The learner's file is STARTER/cp_n1_a.py, and the tests check it by default. The reference
  moved to reference/cp_n1_a.py; CAPSTONE_TARGET=reference selects it. Before, the tests
  imported demo.py, the full answer, so the untouched starter "passed".
- The untouched starter must fail every test, and each mutant of the reference must fail too.
- Every copy of the interface (brief, FINAL_INTERFACE, app catalog, validation contract, final
  integration contract, public brief) names the same function.
"""
from __future__ import annotations

import contextlib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PKG = ROOT / "course-state" / "capstones" / "CP-N1-A"
GENERATOR = ROOT / "scripts" / "enrich_capstone_packages.py"
INTERFACE = "cp_n1_a.run(records) -> dict"
VERSION = "3.0.0"
N_TESTS = 11


def run_tests(package: Path, target: str = "reference") -> subprocess.CompletedProcess:
    env = {**os.environ, "CAPSTONE_TARGET": target}
    return subprocess.run([sys.executable, str(package / "tests" / "test_demo.py")],
                          capture_output=True, text=True, cwd=package, env=env)


@contextlib.contextmanager
def mutant(replacements: list[tuple[str, str]]):
    """Yield a copy of the package whose reference has each old text replaced once by the new."""
    with tempfile.TemporaryDirectory() as tmp:
        copy = Path(tmp) / "CP-N1-A"
        shutil.copytree(PKG, copy, ignore=shutil.ignore_patterns("__pycache__"))
        path = copy / "reference" / "cp_n1_a.py"
        source = path.read_text(encoding="utf-8")
        for old, new in replacements:
            assert source.count(old) == 1, f"mutant text not found exactly once: {old!r}"
            source = source.replace(old, new)
        path.write_text(source, encoding="utf-8")
        yield copy


MUTANTS = {
    "zero_amount_rejected": [("    if monto < 0:\n", "    if monto <= 0:\n")],
    "negative_amount_accepted": [("    if monto < 0:\n", "    if monto < -1000:\n")],
    "float_amount_accepted": [("    if not (isinstance(monto, int) or isinstance(monto, Decimal)) or isinstance(monto, bool):",
                               "    if isinstance(monto, str) or isinstance(monto, bool):")],
    "nan_not_checked": [("    if isinstance(monto, Decimal) and not monto.is_finite():\n        return \"BAD_TYPE\"\n", "")],
    "review_threshold_off_by_one": [("    if monto > MONTO_REVISION:", "    if monto >= MONTO_REVISION:")],
    "missing_edad_accepted": [('    if edad is None:\n        return "MISSING"', '    if edad is None:\n        return "OK"')],
    "edad_150_accepted": [("    if edad < EDAD_MINIMA or edad > EDAD_MAXIMA:", "    if edad < EDAD_MINIMA:")],
    "minor_accepted": [("    if edad < EDAD_ADULTA:\n        return \"NEEDS_REVIEW\"\n", "")],
    "bool_edad_accepted": [("    if not isinstance(edad, int) or isinstance(edad, bool):",
                            "    if not isinstance(edad, int):")],
    "unknown_region_accepted": [('    return "NOT_IN_ALLOWLIST"', '    return "OK"')],
    "review_beats_reject": [('    if "reject" in estados:\n        return "reject"\n    if "review" in estados:\n        return "review"',
                             '    if "review" in estados:\n        return "review"\n    if "reject" in estados:\n        return "reject"')],
    "reasons_dropped": [("            lista.append(campo + \":\" + codigos[campo])", "            pass")],
    "rate_over_accepts": [("        tasa_reject = n_reject / n_total", "        tasa_reject = n_reject / max(n_accept, 1)")],
    "empty_batch_rate_zero": [("        tasa_reject = None  # un lote vacío", "        tasa_reject = 0.0  # un lote vacío")],
    "raw_line_rewritten": [('{"raw_line": row.get("raw_line"),', '{"raw_line": str(row.get("raw_line")).strip().lower(),')],
}


def load_generator():
    spec = importlib.util.spec_from_file_location("enrich_capstone_packages", GENERATOR)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


def load_reference():
    spec = importlib.util.spec_from_file_location("cp_n1_a_reference", PKG / "reference" / "cp_n1_a.py")
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
        for old in ("amount", "n_warn", "n_ok", "n_error", "error_rate", "IntakeResult("):
            self.assertNotIn(old, brief)
            self.assertNotIn(old, interface)

    def test_the_interface_lists_the_keys_the_reference_returns(self):
        returned = set(load_reference().run([]))
        interface = (PKG / "FINAL_INTERFACE.md").read_text(encoding="utf-8")
        brief = (PKG / "BRIEF.md").read_text(encoding="utf-8")
        for name in returned | {"estado", "motivos"}:
            self.assertIn(f"`{name}`", interface, f"FINAL_INTERFACE does not document {name}")
            self.assertIn(f"`{name}`", brief, f"BRIEF does not document {name}")

    def test_zero_amount_is_accepted_and_age_150_rejected_as_the_brief_states(self):
        ref = load_reference()
        row = {"edad": 30, "region": "R-NORTE", "monto_ingreso": 0, "raw_line": "x"}
        self.assertEqual(ref.classify(row), "accept")
        self.assertEqual(ref.classify({**row, "edad": 150}), "reject")
        brief = (PKG / "BRIEF.md").read_text(encoding="utf-8")
        self.assertIn("`monto_ingreso = 0` → `accept`", brief)
        self.assertIn("`edad = 150` → `reject`", brief)

    def test_the_reference_uses_only_what_s01_to_s04_teach(self):
        """No dataclasses, typing or __future__: CP-N1-A closes S04 (proposal 10, CP-N1-A/demo.py.1)."""
        for path in (PKG / "reference" / "cp_n1_a.py", PKG / "STARTER" / "cp_n1_a.py"):
            source = path.read_text(encoding="utf-8")
            for construct in ("dataclass", "typing", "__future__", "lambda", "try:", "class "):
                self.assertNotIn(construct, source, f"{path.name} uses {construct}")

    def test_the_starter_declares_every_function_the_tests_call(self):
        starter = (PKG / "STARTER" / "cp_n1_a.py").read_text(encoding="utf-8")
        tests = (PKG / "tests" / "test_demo.py").read_text(encoding="utf-8")
        called = set(re.findall(r"impl\.([a-zA-Z_0-9]+)\(", tests)) | set(re.findall(r"impl\.([A-Z_]+)\b", tests))
        for name in called:
            self.assertRegex(starter, rf"(?m)^(def {name}\(|{name} = )", f"starter lacks {name}")


class CpN1ACopiesAgree(unittest.TestCase):
    def test_every_copy_names_the_same_interface_and_version(self):
        catalog = (ROOT / "src/lib/capstones/catalog.ts").read_text(encoding="utf-8")
        self.assertIn(f"mk('CP-N1-A','{VERSION}',", catalog)
        self.assertIn(f"'{INTERFACE}'", catalog)
        contract = json.loads((ROOT / "capstone_validation/capstones/CP-N1-A.json").read_text(encoding="utf-8"))
        self.assertEqual((contract["version"], contract["finalIntegrationInterface"]), (VERSION, INTERFACE))
        final = json.loads((ROOT / "capstone_validation/architecture/final_integration_contracts.json")
                           .read_text(encoding="utf-8"))
        entry = next(c for c in final["contracts"] if c["capstoneId"] == "CP-N1-A")
        self.assertEqual((entry["version"], entry["interface"]), (VERSION, INTERFACE))
        self.assertEqual(entry["criticalFailures"], contract["criticalFailures"])
        for name in ("BRIEF.md", "FINAL_INTERFACE.md"):
            self.assertIn(VERSION, (PKG / name).read_text(encoding="utf-8"), name)
        self.assertIn(f"`{INTERFACE}`", (PKG / "FINAL_INTERFACE.md").read_text(encoding="utf-8"))
        self.assertIn(f"`{INTERFACE}`", (PKG / "BRIEF.md").read_text(encoding="utf-8"))

    def test_the_public_copies_are_the_package_files(self):
        """The app serves public/capstones/ to learners; the rubric copy had drifted since #141."""
        for public, package in (("CP-N1-A_BRIEF.md", "BRIEF.md"), ("CP-N1-A_RUBRIC.json", "RUBRIC.json")):
            self.assertEqual((ROOT / "public/capstones" / public).read_text(encoding="utf-8"),
                             (PKG / package).read_text(encoding="utf-8"), public)

    def test_gate_and_rubric_carry_one_weighting(self):
        gate = json.loads((PKG / "gate.json").read_text(encoding="utf-8"))
        rubric = json.loads((PKG / "RUBRIC.json").read_text(encoding="utf-8"))
        self.assertNotIn("scoring_weights_reference", gate)
        weights = {k: v["weight_hint"] for k, v in gate["rubric_0_3"].items() if k != "gate_rule"}
        self.assertEqual(weights, {k: v["weight"] for k, v in rubric["criteria"].items()})
        self.assertAlmostEqual(sum(weights.values()), 1.0)
        self.assertEqual(gate["rubric_0_3"]["gate_rule"], rubric["gate_rule"])
        self.assertEqual(gate["package_version"], rubric["version"])
        self.assertNotIn("status ok", json.dumps(rubric, ensure_ascii=False))


class CpN1ATestsCanFail(unittest.TestCase):
    def test_the_reference_passes_every_test_and_the_demo_runs(self):
        run = run_tests(PKG)
        self.assertEqual(run.returncode, 0, run.stdout)
        self.assertIn(f"{N_TESTS} pasan, 0 fallan", run.stdout)
        demo = subprocess.run([sys.executable, str(PKG / "demo.py")], capture_output=True, text=True)
        self.assertEqual(demo.returncode, 0, demo.stderr)
        metrics = json.loads(demo.stdout.split("METRICS_JSON: ", 1)[1].splitlines()[0])
        self.assertEqual((metrics["status"], metrics["n_total"], metrics["tasa_reject"]), ("pass", 4, 0.25))

    def test_the_untouched_starter_fails_every_test(self):
        """The learner's file is tested by default; with no work done, nothing passes."""
        run = run_tests(PKG, target="learner")
        self.assertNotEqual(run.returncode, 0)
        self.assertIn(f"0 pasan, {N_TESTS} fallan", run.stdout)
        self.assertIn(str(PKG / "STARTER" / "cp_n1_a.py"), run.stdout)

    def test_the_tests_check_the_learner_file_when_no_target_is_set(self):
        env = {k: v for k, v in os.environ.items() if k != "CAPSTONE_TARGET"}
        run = subprocess.run([sys.executable, "tests/test_demo.py"], capture_output=True,
                             text=True, cwd=PKG, env=env)
        self.assertIn(f"Probando {PKG / 'STARTER' / 'cp_n1_a.py'}", run.stdout)

    def test_every_mutant_turns_the_package_tests_red(self):
        survivors = []
        for name, replacements in MUTANTS.items():
            with mutant(replacements) as package:
                if run_tests(package).returncode == 0:
                    survivors.append(name)
        self.assertEqual(survivors, [], "these wrong implementations pass the tests")


class CpN1AExecutionIsMeasured(unittest.TestCase):
    def test_committed_execution_matches_a_real_run(self):
        generator = load_generator()
        recorded = json.loads((PKG / "execution.json").read_text(encoding="utf-8"))
        measured = generator.execution_record(PKG, "CP-N1-A", recorded["version"])
        for key in ("tests_pass", "demo_exits_zero", "starter_fails"):
            self.assertEqual(recorded.get(key), measured[key], key)
        self.assertTrue(measured["tests_pass"])
        self.assertTrue(measured["starter_fails"])

    def test_a_broken_package_is_reported_as_failing(self):
        generator = load_generator()
        with mutant(MUTANTS["zero_amount_rejected"]) as package:
            measured = generator.execution_record(package, "CP-N1-A", VERSION)
        self.assertFalse(measured["tests_pass"])
        self.assertEqual(measured["execution_status"], "fail")


if __name__ == "__main__":
    unittest.main()
