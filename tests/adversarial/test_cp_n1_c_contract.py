"""CP-N1-C follows the S13 You Do contract it closes, and its tests can tell right from wrong.

Proposal 11, step 4 (approved 2026-11-21). Before: five of the six package tests were
`assert True  # placeholder`, the demo labelled pairs `auto_same_entity_candidate` with no human
step, two missing phone numbers counted as a shared phone (`None == None` added 0.4), the phone
counted in both the entity and the relationship score, `assert any(...) or len(queue) >= 0` could
never fail, and the interface (`familiarity.review(case)`) did not exist.

Now the package is the S13 You Do (demo_n1_dashboard.py) as a module: er_score (1.0, 0.5, 0.0 or
None), relationship_signal_score (0.5/0.3/0.2), decide_ops_status (0.40/0.80), a frozen
ReviewPacket with three separate layers and apply_correction. The learner's file is
STARTER/cp_n1_c.py and the tests check it by default.

This test proves the suite can fail: the untouched starter fails all 11 tests and each mutant of
the reference turns at least one red.
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
PKG = ROOT / "course-state" / "capstones" / "CP-N1-C"
S13 = ROOT / "src" / "lib" / "course" / "sections" / "s13-evidence-dashboard.ts"
GENERATOR = ROOT / "scripts" / "enrich_capstone_packages.py"
INTERFACE = "cp_n1_c.review(case) -> ReviewPacket"
VERSION = "3.0.0"
N_TESTS = 11


def run_tests(package: Path, target: str = "reference") -> subprocess.CompletedProcess:
    env = {**os.environ, "CAPSTONE_TARGET": target}
    return subprocess.run([sys.executable, str(package / "tests" / "test_demo.py")],
                          capture_output=True, text=True, cwd=package, env=env, timeout=120)


@contextlib.contextmanager
def mutant(replacements: list[tuple[str, str]]):
    with tempfile.TemporaryDirectory() as tmp:
        copy = Path(tmp) / "CP-N1-C"
        shutil.copytree(PKG, copy, ignore=shutil.ignore_patterns("__pycache__"))
        path = copy / "reference" / "cp_n1_c.py"
        source = path.read_text(encoding="utf-8")
        for old, new in replacements:
            assert source.count(old) == 1, f"mutant text not found exactly once: {old!r}"
            source = source.replace(old, new)
        path.write_text(source, encoding="utf-8")
        yield copy


MUTANTS = {
    # identity layer
    "doc_not_normalized": [('    return re.sub(r"[^a-z0-9]", "", (d or "").casefold())',
                            '    return (d or "").strip()')],
    "block_on_last_token": [("    paterno = parts[1] if len(parts) >= 2 else parts[0]",
                             "    paterno = parts[-1]")],
    "missing_doc_is_zero": [("        return None\n    if doc_a != doc_b:", "        return 0.0\n    if doc_a != doc_b:")],
    "same_doc_is_enough": [("        return 1.0\n    return 0.5", "        return 1.0\n    return 1.0")],
    # relationship layer
    "absent_phone_matches": [('    shared_phone = bool(a.get("phone")) and a.get("phone") == b.get("phone")',
                              '    shared_phone = a.get("phone") == b.get("phone")')],
    "missing_coords_are_close": [("        geo_close = False\n", "        geo_close = True\n")],
    "flat_weights": [('0.5 * s["shared_phone"] + 0.3 * s["geo_close"]', '0.4 * s["shared_phone"] + 0.4 * s["geo_close"]')],
    # decision layer
    "review_low_inclusive": [("    if score < REVIEW_LOW:", "    if score <= REVIEW_LOW:")],
    "accept_min_inclusive": [("    if score < ACCEPT_MIN:", "    if score <= ACCEPT_MIN:")],
    "high_does_not_win": [('    if unc == "high":\n        return "needs_review"\n', "")],
    "nan_is_a_score": [("    if not math.isfinite(score) or not 0.0 <= score <= 1.0:",
                        "    if not 0.0 <= score <= 1.0 and math.isfinite(score):")],
    "bool_is_a_score": [("    if isinstance(score, bool) or not isinstance(score, (int, float)):",
                         "    if not isinstance(score, (int, float)):")],
    "two_missing_is_med": [("    if conflict or len(missing) >= 2:", "    if conflict or len(missing) >= 3:")],
    "conflict_ignored": [("        conflict = er is not None and abs(er - rel) > CONFLICT_GAP",
                          "        conflict = False")],
    "the_mix_decides_identity": [('            "status": decide_ops_status(er, unc),',
                                  '            "status": decide_ops_status(None if er is None else 0.6 * er + 0.4 * rel, unc),')],
    # packet and product
    "kinship_label": [('"kinship_verdict": None})', '"kinship_verdict": rel >= 0.8})')],
    "risk_decided": [("decisions=tuple(decisions), risk_decisions=(),",
                      'decisions=tuple(decisions), risk_decisions=tuple(d for d in decisions if d["status"] == "needs_review"),')],
    "names_in_queue": [('"a": pseudonymize(a.get("name")), "b": pseudonymize(b.get("name")),',
                        '"a": a.get("name"), "b": b.get("name"),')],
    "relationship_in_entity_layer": [('        entity.append({"pair_id": pair_id, "entity_resolution_score": er,',
                                      '        entity.append({"pair_id": pair_id, "entity_resolution_score": er, "relationship_signal_score": rel,')],
    "queue_unsorted": [('    pending.sort(key=lambda d: (-(d["evidence_score"] or 0.0), d["pair_id"]))\n', "")],
    "privacy_sheet_short": [('        "egress_public_geocoder": "city_country_only",\n', "")],
    "duplicate_ids_allowed": [('        raise ValueError("id de persona duplicado en el caso " + str(case.get("case_id")))',
                               "        pass")],
    # correction
    "empty_reason_accepted": [("    if not isinstance(reason, str) or not reason.strip():",
                               "    if not isinstance(reason, str):")],
    "unknown_status_accepted": [("    if new_status not in STATUSES:", "    if not new_status:")],
    "correction_edits_the_original": [('            d = {**d, "status": new_status}', '            d["status"] = new_status')],
    "correction_not_logged": [("                   corrections=packet.corrections + (entry,))",
                               "                   corrections=packet.corrections)")],
}


def load(path: Path, name: str):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    # @dataclass resolves string annotations (from __future__ import annotations) through
    # sys.modules[cls.__module__], so the module must be registered before it runs. This is the
    # importlib docs recipe "Importing a source file directly".
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


class CpN1CFollowsTheS13Contract(unittest.TestCase):
    longMessage = False

    def test_no_placeholder_or_automatic_label_remains(self):
        tests = (PKG / "tests" / "test_demo.py").read_text(encoding="utf-8")
        self.assertNotIn("assert True", tests)
        for path in (PKG / "reference" / "cp_n1_c.py", PKG / "demo.py", PKG / "BRIEF.md"):
            text = path.read_text(encoding="utf-8")
            for old in ("auto_same_entity_candidate", "similitud difusa", "familiarity.review"):
                self.assertNotIn(old, text, f"{path.name}: {old}")

    def test_the_rules_are_the_ones_s13_teaches(self):
        s13 = S13.read_text(encoding="utf-8")
        ref = load(PKG / "reference" / "cp_n1_c.py", "cp_n1_c_ref")
        self.assertIn(f'"rules_version": "{ref.RULES_VERSION}"', s13)
        self.assertIn("rel = 0.5*shared_phone + 0.3*geo_close + 0.2*name_jaccard", s13)
        self.assertIn("    if score < 0.4:\n        return \\\"abstain\\\"", s13.replace('"', '\\"'))
        self.assertEqual((ref.REVIEW_LOW, ref.ACCEPT_MIN, ref.GEO_KM), (0.4, 0.8, 2.0))
        for status in ref.STATUSES:
            self.assertIn(f"`{status}`", s13, status)
            self.assertIn(f"`{status}`", (PKG / "BRIEF.md").read_text(encoding="utf-8"), status)
        # The privacy sheet keys are the T4-B ones.
        for key in ref.privacy_sheet():
            self.assertIn(f'"{key}"', s13, key)

    def test_the_brief_documents_every_packet_field(self):
        ref = load(PKG / "reference" / "cp_n1_c.py", "cp_n1_c_ref2")
        case = json.loads((PKG / "data" / "case.json").read_text(encoding="utf-8"))
        packet = ref.review(case)
        corrected = ref.apply_correction(packet, "P07-P08", "abstain", "oficina")
        keys = {f.name for f in ref.ReviewPacket.__dataclass_fields__.values()}
        for layer in (packet.entity_evidence, packet.relationship_evidence, packet.decisions,
                      corrected.corrections):
            keys |= set(layer[0])
        brief = (PKG / "BRIEF.md").read_text(encoding="utf-8")
        for key in sorted(keys):
            self.assertIn(f"`{key}", brief, f"BRIEF.md does not document {key}")

    def test_the_starter_declares_every_function_the_tests_call(self):
        starter = (PKG / "STARTER" / "cp_n1_c.py").read_text(encoding="utf-8")
        tests = (PKG / "tests" / "test_demo.py").read_text(encoding="utf-8")
        for name in set(re.findall(r"impl\.([a-zA-Z_0-9]+)", tests)):
            self.assertRegex(starter, rf"(?m)^(def {name}\(|{name} = |class {name}\b)",
                             f"starter lacks {name}")

    def test_the_starter_uses_only_what_s09_to_s13_teach(self):
        starter = (PKG / "STARTER" / "cp_n1_c.py").read_text(encoding="utf-8")
        imports = set(re.findall(r"(?m)^(?:from|import) ([a-z_.]+)", starter))
        self.assertEqual(imports, {"__future__", "math", "re", "dataclasses"})


class CpN1CCopiesAgree(unittest.TestCase):
    def test_every_copy_names_the_same_interface_and_version(self):
        catalog = (ROOT / "src/lib/capstones/catalog.ts").read_text(encoding="utf-8")
        self.assertIn(f"mk('CP-N1-C','{VERSION}',", catalog)
        self.assertIn(f"'{INTERFACE}'", catalog)
        contract = json.loads((ROOT / "capstone_validation/capstones/CP-N1-C.json").read_text(encoding="utf-8"))
        self.assertEqual((contract["version"], contract["finalIntegrationInterface"]), (VERSION, INTERFACE))
        rubric = json.loads((PKG / "RUBRIC.json").read_text(encoding="utf-8"))
        self.assertEqual(contract["criticalFailures"], rubric["critical_failures"])
        final = json.loads((ROOT / "capstone_validation/architecture/final_integration_contracts.json")
                           .read_text(encoding="utf-8"))
        entry = next(c for c in final["contracts"] if c["capstoneId"] == "CP-N1-C")
        self.assertEqual((entry["version"], entry["interface"]), (VERSION, INTERFACE))
        self.assertEqual(entry["criticalFailures"], contract["criticalFailures"])
        generator = (ROOT / "scripts/generate_capstone_validation.py").read_text(encoding="utf-8")
        self.assertIn(f'("CP-N1-C","{VERSION}",', generator)
        self.assertIn(f'"{INTERFACE}"', generator)
        for name in ("BRIEF.md", "FINAL_INTERFACE.md"):
            self.assertIn(VERSION, (PKG / name).read_text(encoding="utf-8"), name)
        self.assertIn(f"`{INTERFACE}`", (PKG / "FINAL_INTERFACE.md").read_text(encoding="utf-8"))

    def test_the_public_copies_are_the_package_files(self):
        for public, package in (("CP-N1-C_BRIEF.md", "BRIEF.md"), ("CP-N1-C_RUBRIC.json", "RUBRIC.json")):
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

    def test_the_manifest_lists_files_that_exist(self):
        manifest = json.loads((PKG / "evidence_manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["version"], VERSION)
        for name in manifest["artifacts"]:
            self.assertTrue((PKG / name).exists(), name)


class CpN1CTestsCanFail(unittest.TestCase):
    def test_the_reference_passes_every_test_and_the_demo_runs(self):
        run = run_tests(PKG)
        self.assertEqual(run.returncode, 0, run.stdout)
        self.assertIn(f"{N_TESTS} pasan, 0 fallan", run.stdout)
        demo = subprocess.run([sys.executable, str(PKG / "demo.py")], capture_output=True, text=True)
        self.assertEqual(demo.returncode, 0, demo.stderr)
        metrics = json.loads(demo.stdout.split("METRICS_JSON: ", 1)[1].splitlines()[0])
        self.assertEqual((metrics["status"], metrics["n_pairs"], metrics["n_risk_decisions"]), ("pass", 66, 0))
        self.assertEqual(metrics["statuses"], {"abstain": 45, "accept_pair": 1, "invalid_input": 11,
                                               "needs_review": 9})

    def test_the_untouched_starter_fails_every_test(self):
        run = run_tests(PKG, target="learner")
        self.assertNotEqual(run.returncode, 0)
        self.assertIn(f"0 pasan, {N_TESTS} fallan", run.stdout)
        self.assertIn(str(PKG / "STARTER" / "cp_n1_c.py"), run.stdout)

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


class CpN1CExecutionIsMeasured(unittest.TestCase):
    def test_committed_execution_matches_a_real_run(self):
        generator = load(GENERATOR, "enrich_capstone_packages")
        recorded = json.loads((PKG / "execution.json").read_text(encoding="utf-8"))
        measured = generator.execution_record(PKG, "CP-N1-C", recorded["version"])
        for key in ("execution_status", "tests_pass", "demo_exits_zero", "starter_fails", "placeholder_tests"):
            self.assertEqual(recorded.get(key), measured[key], key)
        self.assertEqual((recorded["version"], measured["execution_status"], measured["placeholder_tests"]),
                         (VERSION, "pass", 0))


if __name__ == "__main__":
    unittest.main()
