"""CP-N1-B follows the S08 You Do contract it closes, and its tests can tell right from wrong.

Proposal 11, step 3 (approved 2026-11-21). Before: five of the six package tests were
`assert True  # placeholder`, the brief, the demo and data/generate.py used three different
schemas, the reference added a fake quarantine row when the data had none, and the interface
(`etl.run(batch) -> EtlManifest`) did not exist.

Now the package is the S08 You Do (etl_cp_n1_b.py): clients.csv (id,nombre,monto) and
transactions.json (id,client_id,monto), quarantine rows {raw, record_number, reason}, a manifest
reconciled per source, and run(data_dir, out_dir, run_id=None) -> int. The learner's file is
STARTER/cp_n1_b.py and the tests check it by default.

This test proves the suite can fail: the untouched starter fails all 11 tests and each mutant of
the reference turns at least one red.
"""
from __future__ import annotations

import contextlib
import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PKG = ROOT / "course-state" / "capstones" / "CP-N1-B"
GENERATOR = ROOT / "scripts" / "enrich_capstone_packages.py"
INTERFACE = "cp_n1_b.run(data_dir, out_dir, run_id=None) -> int"
VERSION = "3.0.0"
N_TESTS = 11


def run_tests(package: Path, target: str = "reference") -> subprocess.CompletedProcess:
    env = {**os.environ, "CAPSTONE_TARGET": target}
    return subprocess.run([sys.executable, str(package / "tests" / "test_demo.py")],
                          capture_output=True, text=True, cwd=package, env=env, timeout=120)


@contextlib.contextmanager
def mutant(replacements: list[tuple[str, str]]):
    with tempfile.TemporaryDirectory() as tmp:
        copy = Path(tmp) / "CP-N1-B"
        shutil.copytree(PKG, copy, ignore=shutil.ignore_patterns("__pycache__"))
        path = copy / "reference" / "cp_n1_b.py"
        source = path.read_text(encoding="utf-8")
        for old, new in replacements:
            assert source.count(old) == 1, f"mutant text not found exactly once: {old!r}"
            source = source.replace(old, new)
        path.write_text(source, encoding="utf-8")
        yield copy


MUTANTS = {
    "bom_kept": [('read_text(encoding="utf-8-sig")', 'read_text(encoding="utf-8")')],
    "extra_column_accepted": [("        if len(row) != len(header):", "        if len(row) < len(header):")],
    "blank_line_is_a_record": [("        if not row and not raw.strip():", "        if False:")],
    "empty_name_accepted": [('if parsed["id"].strip() == "" or parsed["nombre"].strip() == "":',
                             'if parsed["id"].strip() == "":')],
    "float_amount_accepted": [("    if not isinstance(value, str):\n        return None",
                               "    if not isinstance(value, str):\n        value = str(value)")],
    "comma_decimal_accepted": [('    digits = value.replace(".", "", 1)',
                                '    value = value.replace(",", ".")\n    digits = value.replace(".", "", 1)')],
    "not_quantized": [("    return str(Decimal(value).quantize(CENTIMOS))", "    return str(Decimal(value))")],
    "null_accepted": [("    missing = [k for k in required if k not in obj or obj[k] is None]",
                       "    missing = [k for k in required if k not in obj]")],
    "reconcile_on_totals_only": [(
        '    return [s["name"] for s in sources if s["n_in"] != s["n_clean"] + s["n_quarantine"]]',
        '    total_in = sum(s["n_in"] for s in sources)\n'
        '    total_out = sum(s["n_clean"] + s["n_quarantine"] for s in sources)\n'
        '    return [] if total_in == total_out else [s["name"] for s in sources]')],
    "sources_unsorted": [('    ordered = sorted((dict(s) for s in sources), key=lambda s: s["name"])',
                          '    ordered = [dict(s) for s in sources]')],
    "duplicate_names_allowed": [('    if len(names) != len(set(names)):\n        raise ValueError("nombre de fuente duplicado")\n', "")],
    "fixed_run_id": [("    run_id = run_id or uuid.uuid4().hex", '    run_id = run_id or "corrida"')],
    "no_backups": [("        shutil.copy2(data_dir / name, backups / name)", "        pass")],
    "not_atomic": [("    os.replace(tmp, path)", '    path.write_text(text, encoding="utf-8")')],
    # Codex review on #176: a direct write that leaves no temporary passed every test.
    "direct_write": [('    fd, tmp_name = tempfile.mkstemp(dir=path.parent, prefix=path.name + ".", suffix=".tmp")\n'
                      '    os.close(fd)\n    tmp = Path(tmp_name)\n'
                      '    tmp.write_text(text, encoding="utf-8", newline="\\n")\n    os.replace(tmp, path)',
                      '    path.write_text(text, encoding="utf-8", newline="\\n")')],
    "run_id_unchecked": [('    if not all(c.isascii() and (c.isalnum() or c in "-_") for c in run_id):\n', '    if False:\n')],
    "hash_of_decoded_text": [("hashlib.sha256(Path(path).read_bytes())",
                              'hashlib.sha256(Path(path).read_text(encoding="utf-8-sig").encode())')],
    "missing_key_as_cast": [('            quarantine.append({"raw": raw, "record_number": record_number, "reason": "missing_key",',
                             '            quarantine.append({"raw": raw, "record_number": record_number, "reason": "cast_monto",')],
}


def load(path: Path, name: str):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


class CpN1BFollowsTheS08Contract(unittest.TestCase):
    def test_every_learner_facing_check_says_what_failed(self):
        """A bare assert prints an empty AssertionError, and the learner cannot tell which check
        failed or what came out (AGENTS.md, Fail loudly; Codex review on #176)."""
        import ast
        tree = ast.parse((PKG / "tests" / "test_demo.py").read_text(encoding="utf-8"))
        bare = [n.lineno for n in ast.walk(tree) if isinstance(n, ast.Assert) and n.msg is None]
        self.assertEqual(bare, [], "asserts without a message in CP-N1-B/tests/test_demo.py")

    def test_no_placeholder_or_fake_row_remains(self):
        tests = (PKG / "tests" / "test_demo.py").read_text(encoding="utf-8")
        self.assertNotIn("assert True", tests)
        for path in (PKG / "reference" / "cp_n1_b.py", PKG / "demo.py"):
            self.assertNotIn("forced_edge", path.read_text(encoding="utf-8"), path.name)

    def test_one_schema_across_brief_data_and_reference(self):
        brief = (PKG / "BRIEF.md").read_text(encoding="utf-8")
        self.assertIn("`id,nombre,monto`", brief)
        self.assertIn("`id`,\n  `client_id` y `monto`", brief)
        header = (PKG / "data" / "clients.csv").read_text(encoding="utf-8-sig").splitlines()[0]
        self.assertEqual(header, "id,nombre,monto")
        ref = load(PKG / "reference" / "cp_n1_b.py", "cp_n1_b_ref")
        self.assertEqual(ref.CLIENT_COLUMNS, ("id", "nombre", "monto"))
        self.assertEqual(ref.TRANSACTION_KEYS, ("id", "client_id", "monto"))
        for old in ("tx_id", "currency", "EtlManifest(", "source_file", "accepted_count"):
            self.assertNotIn(old, brief, old)

    def test_the_reasons_are_the_ones_s08_names(self):
        s08 = (ROOT / "src/lib/course/sections/s08-files-ingestion.ts").read_text(encoding="utf-8")
        for reason in ("col_count", "cast_monto", "missing_key", "schema"):
            self.assertIn(f'"{reason}"', s08, f"S08 does not teach {reason}")
            self.assertIn(f"`{reason}`", (PKG / "BRIEF.md").read_text(encoding="utf-8"))

    def test_the_interface_documents_every_manifest_key(self):
        ref = load(PKG / "reference" / "cp_n1_b.py", "cp_n1_b_ref2")
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(ref.run(PKG / "data", Path(tmp), run_id="x"), 0)
            manifest = json.loads((Path(tmp) / "manifest.json").read_text(encoding="utf-8"))
        keys = set(manifest) | set(manifest["sources"][0])
        for doc in ("FINAL_INTERFACE.md", "BRIEF.md"):
            text = (PKG / doc).read_text(encoding="utf-8")
            for key in keys:
                self.assertIn(f"`{key}`", text, f"{doc} does not document {key}")

    def test_the_starter_declares_every_function_the_tests_call(self):
        import re
        starter = (PKG / "STARTER" / "cp_n1_b.py").read_text(encoding="utf-8")
        tests = (PKG / "tests" / "test_demo.py").read_text(encoding="utf-8")
        for name in set(re.findall(r"impl\.([a-zA-Z_0-9]+)", tests)):
            self.assertRegex(starter, rf"(?m)^(def {name}\(|{name} = )", f"starter lacks {name}")


class CpN1BCopiesAgree(unittest.TestCase):
    def test_every_copy_names_the_same_interface_and_version(self):
        catalog = (ROOT / "src/lib/capstones/catalog.ts").read_text(encoding="utf-8")
        self.assertIn(f"mk('CP-N1-B','{VERSION}',", catalog)
        self.assertIn(f"'{INTERFACE}'", catalog)
        contract = json.loads((ROOT / "capstone_validation/capstones/CP-N1-B.json").read_text(encoding="utf-8"))
        self.assertEqual((contract["version"], contract["finalIntegrationInterface"]), (VERSION, INTERFACE))
        final = json.loads((ROOT / "capstone_validation/architecture/final_integration_contracts.json")
                           .read_text(encoding="utf-8"))
        entry = next(c for c in final["contracts"] if c["capstoneId"] == "CP-N1-B")
        self.assertEqual((entry["version"], entry["interface"]), (VERSION, INTERFACE))
        self.assertEqual(entry["criticalFailures"], contract["criticalFailures"])
        for name in ("BRIEF.md", "FINAL_INTERFACE.md"):
            self.assertIn(VERSION, (PKG / name).read_text(encoding="utf-8"), name)
        self.assertIn(f"`{INTERFACE}`", (PKG / "FINAL_INTERFACE.md").read_text(encoding="utf-8"))

    def test_the_public_copies_are_the_package_files(self):
        for public, package in (("CP-N1-B_BRIEF.md", "BRIEF.md"), ("CP-N1-B_RUBRIC.json", "RUBRIC.json")):
            self.assertEqual((ROOT / "public/capstones" / public).read_text(encoding="utf-8"),
                             (PKG / package).read_text(encoding="utf-8"), public)

    def test_gate_and_rubric_carry_one_weighting(self):
        gate = json.loads((PKG / "gate.json").read_text(encoding="utf-8"))
        rubric = json.loads((PKG / "RUBRIC.json").read_text(encoding="utf-8"))
        self.assertNotIn("scoring_weights_reference", gate)
        weights = {k: v["weight_hint"] for k, v in gate["rubric_0_3"].items() if k != "gate_rule"}
        self.assertEqual(weights, {k: v["weight"] for k, v in rubric["criteria"].items()})
        self.assertEqual(gate["rubric_0_3"]["gate_rule"], rubric["gate_rule"])
        self.assertEqual(gate["package_version"], rubric["version"])


class CpN1BTestsCanFail(unittest.TestCase):
    def test_the_reference_passes_every_test_and_the_demo_runs(self):
        run = run_tests(PKG)
        self.assertEqual(run.returncode, 0, run.stdout)
        self.assertIn(f"{N_TESTS} pasan, 0 fallan", run.stdout)
        demo = subprocess.run([sys.executable, str(PKG / "demo.py")], capture_output=True, text=True)
        self.assertEqual(demo.returncode, 0, demo.stderr)
        metrics = json.loads(demo.stdout.split("METRICS_JSON: ", 1)[1].splitlines()[0])
        m = metrics["manifest"]
        self.assertEqual((metrics["status"], m["n_in"], m["n_clean"], m["n_quarantine"]), ("pass", 16, 7, 9))

    def test_the_untouched_starter_fails_every_test(self):
        run = run_tests(PKG, target="learner")
        self.assertNotEqual(run.returncode, 0)
        self.assertIn(f"0 pasan, {N_TESTS} fallan", run.stdout)
        self.assertIn(str(PKG / "STARTER" / "cp_n1_b.py"), run.stdout)

    def test_every_mutant_turns_the_package_tests_red(self):
        survivors = []
        for name, replacements in MUTANTS.items():
            with mutant(replacements) as package:
                if run_tests(package).returncode == 0:
                    survivors.append(name)
        self.assertEqual(survivors, [], "these wrong implementations pass the tests")

    def test_running_the_suite_leaves_no_file_in_the_package(self):
        before = sorted(str(p) for p in PKG.rglob("*") if "__pycache__" not in p.parts)
        run_tests(PKG)
        subprocess.run([sys.executable, str(PKG / "demo.py")], capture_output=True, text=True)
        after = sorted(str(p) for p in PKG.rglob("*") if "__pycache__" not in p.parts)
        self.assertEqual(before, after)


class CpN1BExecutionIsMeasured(unittest.TestCase):
    def test_committed_execution_matches_a_real_run(self):
        generator = load(GENERATOR, "enrich_capstone_packages")
        recorded = json.loads((PKG / "execution.json").read_text(encoding="utf-8"))
        measured = generator.execution_record(PKG, "CP-N1-B", recorded["version"])
        for key in ("execution_status", "tests_pass", "demo_exits_zero", "starter_fails", "placeholder_tests"):
            self.assertEqual(recorded.get(key), measured[key], key)
        self.assertEqual((measured["execution_status"], measured["placeholder_tests"]), ("pass", 0))


if __name__ == "__main__":
    unittest.main()
