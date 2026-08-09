#!/usr/bin/env python3
"""Adversarial test for CP-FINAL integration.

Asserts the CP-FINAL integration honors every contract declared in
`capstone_validation/architecture/final_integration_contracts.json` and the
catalog (`src/lib/capstones/catalog.ts`):

- all 12 dependencies present in the bundle
- contract compatibility (each subsystem returns its declared type)
- synthetic end-to-end scenario runs
- no direct shared-database coupling where contracts are required
  (subsystems communicate via contracts, not shared mutable state —
  verified via AST that no subsystem imports another)
- backup + restore works
- rollback restores prior state (proven)
- no-go condition triggers when a critical subsystem fails
- end-to-end trace present
- evidence bundle present
- reproducible (deterministic given same scenario seed)

Run: python3 tests/adversarial/test_cp_final_integration.py
"""
from __future__ import annotations

import ast
import dataclasses
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CAPSTONE_DIR = REPO_ROOT / "course-state" / "capstones" / "CP-FINAL"
sys.path.insert(0, str(CAPSTONE_DIR))

# Import the integration package (must be importable from CP-FINAL dir).
from integration import (  # noqa: E402
    contracts,
    dependency_graph,
    platform as platform_module,
    no_go,
    shared_scenario,
    backup_restore,
    rollback as rollback_module,
)


SUBSYSTEM_MODULE_NAMES = {
    "intake", "etl", "familiarity", "eda", "reports", "rpa",
    "er", "graph", "triage", "service", "platform_ml", "copilot",
}


class TestCpFinalIntegration(unittest.TestCase):
    """Adversarial contract for CP-FINAL."""

    @classmethod
    def setUpClass(cls):
        cls.scenario = shared_scenario.shared_scenario_v1
        cls.bundle = platform_module.integrate(cls.scenario, run_id="adv-fixed-run-id")

    # --- 1. all 12 dependencies present -------------------------------

    def test_all_12_dependencies_present(self):
        expected = {
            "CP-N1-A", "CP-N1-B", "CP-N1-C",
            "CP-N2-A", "CP-N2-B", "CP-N2-C",
            "CP-N3-A", "CP-N3-B", "CP-N3-C",
            "CP-N4-A", "CP-N4-B", "CP-N4-C",
        }
        self.assertEqual(set(self.bundle.subsystem_results.keys()), expected)
        self.assertEqual(len(self.bundle.subsystem_results), 12)

    # --- 2. contract compatibility ------------------------------------

    def test_each_subsystem_returns_its_declared_type(self):
        # Re-run each subsystem directly so we get the typed object (the bundle
        # stores JSON-serialized payloads).
        inputs = platform_module._build_subsystem_inputs(self.scenario)
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            runner = platform_module.SUBSYSTEM_RUNNERS[cid]
            result = runner(inputs[cid])
            expected_type = contracts.expected_contract_type(cid)
            self.assertIsInstance(
                result, expected_type,
                f"{cid} returned {type(result).__name__}, expected {expected_type.__name__}",
            )
            self.assertEqual(result.contract_id, cid)
            self.assertEqual(
                result.contract_version,
                contracts.expected_contract_version(cid),
                f"{cid} version mismatch",
            )

    def test_bundle_carries_contract_id_and_version(self):
        for cid, payload in self.bundle.subsystem_results.items():
            self.assertEqual(payload["contract_id"], cid)
            self.assertEqual(
                payload["contract_version"],
                contracts.expected_contract_version(cid),
            )

    # --- 3. synthetic end-to-end scenario runs ------------------------

    def test_synthetic_scenario_runs_clean(self):
        self.assertFalse(self.bundle.no_go, msg=self.bundle.no_go_reason)
        self.assertEqual(self.bundle.no_go_reason, "")
        self.assertTrue(self.bundle.reproducible)
        self.assertEqual(self.bundle.scenario_id, self.scenario.scenario_id)

    # --- 4. no direct shared-database coupling (AST guard) -----------

    def test_no_subsystem_imports_another(self):
        """AST guard: no subsystem module may import another subsystem module."""
        integration_dir = CAPSTONE_DIR / "integration"
        for fname in os.listdir(integration_dir):
            if not fname.endswith(".py"):
                continue
            stem = fname[:-3]
            if stem not in SUBSYSTEM_MODULE_NAMES:
                continue
            path = integration_dir / fname
            with open(path, "r", encoding="utf-8") as fh:
                tree = ast.parse(fh.read(), filename=str(path))
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for n in node.names:
                        base = n.name.split(".")[-1]
                        self.assertFalse(
                            base in SUBSYSTEM_MODULE_NAMES and base != stem,
                            f"{stem} imports another subsystem: {n.name}",
                        )
                elif isinstance(node, ast.ImportFrom):
                    mod = node.module or ""
                    base = mod.split(".")[-1]
                    self.assertFalse(
                        base in SUBSYSTEM_MODULE_NAMES and base != stem,
                        f"{stem} imports another subsystem (from): {mod}",
                    )

    def test_no_subsystem_mutates_shared_scenario(self):
        """Subsystems must not mutate the shared scenario in place."""
        before = shared_scenario.snapshot(self.scenario)
        # Run the full integration twice; scenario must be unchanged.
        platform_module.integrate(self.scenario)
        platform_module.integrate(self.scenario)
        after = shared_scenario.snapshot(self.scenario)
        self.assertEqual(before, after, "shared scenario was mutated")

    # --- 5. backup + restore works ------------------------------------

    def test_backup_and_restore_roundtrip(self):
        with tempfile.TemporaryDirectory() as td:
            path = backup_restore.backup(self.bundle, td)
            self.assertTrue(os.path.isfile(path))
            restored = backup_restore.restore(path)
            self.assertEqual(restored["contract_id"], "CP-FINAL")
            self.assertEqual(restored["scenario_id"], self.bundle.scenario_id)
            self.assertEqual(len(restored["subsystem_results"]), 12)
            # The restored bundle should equal the original (modulo backup_path).
            original = dataclasses.asdict(self.bundle)
            original.pop("backup_path", None)
            restored.pop("backup_path", None)
            self.assertEqual(restored, original)

    def test_restore_rejects_wrong_schema(self):
        with tempfile.TemporaryDirectory() as td:
            bad = os.path.join(td, "bad.json")
            with open(bad, "w", encoding="utf-8") as fh:
                json.dump({"schema": "wrong"}, fh)
            with self.assertRaises(ValueError):
                backup_restore.restore(bad)

    # --- 6. rollback restores prior state (proven) -------------------

    def test_rollback_restores_prior_state(self):
        proof = rollback_module.demonstrate_rollback()
        self.assertTrue(proof["rollback_proven"])

    def test_rollback_store_history_pops_on_rollback(self):
        store = rollback_module.IntegrationStateStore()
        # commit A: history = [{}],  state = {"k": {"v": 1}}
        store.commit("k", {"v": 1})
        snap_a = store.snapshot()
        # commit B: history = [{}, {"k": {"v": 1}}], state = {"k": {"v": 2}}
        store.commit("k", {"v": 2})
        self.assertNotEqual(store.snapshot(), snap_a)
        # rollback #1: history = [{}], state = {"k": {"v": 1}}
        self.assertTrue(store.rollback())
        self.assertEqual(store.snapshot(), snap_a)
        # rollback #2: history = [],  state = {}  (initial empty)
        self.assertTrue(store.rollback())
        # rollback #3: empty history -> False
        self.assertFalse(store.rollback())

    # --- 7. no-go condition triggers on critical failure -------------

    def test_no_go_triggers_on_critical_subsystem_failure(self):
        bad = {}
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            runner = platform_module.SUBSYSTEM_RUNNERS[cid]
            bad[cid] = runner(platform_module._build_subsystem_inputs(self.scenario)[cid])
        # Tamper: CP-N3-A claims to have inferred relationships (forbidden).
        bad["CP-N3-A"] = dataclasses.replace(bad["CP-N3-A"], inferred_relationships=True)
        flag, reason = no_go.evaluate(bad)
        self.assertTrue(flag)
        self.assertIn("CP-N3-A", reason)

    def test_no_go_triggers_on_missing_subsystem(self):
        bad = {}
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            runner = platform_module.SUBSYSTEM_RUNNERS[cid]
            bad[cid] = runner(platform_module._build_subsystem_inputs(self.scenario)[cid])
        del bad["CP-N4-C"]
        flag, reason = no_go.evaluate(bad)
        self.assertTrue(flag)
        self.assertIn("CP-N4-C", reason)

    def test_no_go_triggers_on_wrong_type(self):
        bad = {}
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            runner = platform_module.SUBSYSTEM_RUNNERS[cid]
            bad[cid] = runner(platform_module._build_subsystem_inputs(self.scenario)[cid])
        # Replace a typed contract with a plain dict (wrong type).
        bad["CP-N4-A"] = {"contract_id": "CP-N4-A", "contract_version": "2.0.0"}
        flag, reason = no_go.evaluate(bad)
        self.assertTrue(flag)
        self.assertIn("CP-N4-A", reason)

    def test_no_go_triggers_on_version_mismatch(self):
        bad = {}
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            runner = platform_module.SUBSYSTEM_RUNNERS[cid]
            bad[cid] = runner(platform_module._build_subsystem_inputs(self.scenario)[cid])
        bad["CP-N4-C"] = dataclasses.replace(bad["CP-N4-C"], contract_version="2.0.0")  # should be 3.0.0
        flag, reason = no_go.evaluate(bad)
        self.assertTrue(flag)
        self.assertIn("CP-N4-C", reason)

    # --- 8. end-to-end trace present ----------------------------------

    def test_end_to_end_trace_present_and_ordered(self):
        trace = self.bundle.end_to_end_trace
        self.assertEqual(len(trace), 12)
        expected_order = dependency_graph.upstream_order()
        actual_order = [e["subsystem"] for e in trace]
        self.assertEqual(actual_order, expected_order)
        for ev in trace:
            self.assertIn("run_id", ev)
            self.assertIn("duration_ms", ev)
            self.assertTrue(ev["ok"], ev.get("note", ""))
            self.assertEqual(ev["contract_id"], ev["subsystem"])

    # --- 9. evidence bundle present ----------------------------------

    def test_evidence_bundle_present(self):
        ev = self.bundle.evidence_bundle
        for key in ("contracts", "trace", "dependency_graph", "cards", "reproducibility"):
            self.assertIn(key, ev, key)
        self.assertEqual(len(ev["contracts"]), 12)
        self.assertEqual(len(ev["trace"]), 12)
        self.assertEqual(ev["dependency_graph"]["upstream_count"], 12)
        self.assertEqual(len(ev["dependency_graph"]["topological_order"]), 13)
        self.assertEqual(ev["dependency_graph"]["topological_order"][-1], "CP-FINAL")
        # Cards: data, model, system.
        for card in ("data_card", "model_card", "system_card"):
            self.assertIn(card, ev["cards"])
        # Reproducibility info.
        repro = ev["reproducibility"]
        self.assertEqual(repro["scenario_version"], shared_scenario.SCENARIO_VERSION)
        self.assertEqual(repro["seed"], self.scenario.seed)
        self.assertTrue(repro["snapshot_hash"])

    # --- 10. reproducible ---------------------------------------------

    def test_reproducible_same_seed_same_bundle(self):
        a = platform_module.integrate(self.scenario)
        b = platform_module.integrate(self.scenario)
        sa = json.dumps(contracts.to_jsonable(a), sort_keys=True, ensure_ascii=False)
        sb = json.dumps(contracts.to_jsonable(b), sort_keys=True, ensure_ascii=False)
        self.assertEqual(sa, sb)

    def test_reproducible_with_explicit_run_id(self):
        a = platform_module.integrate(self.scenario, run_id="r-1")
        b = platform_module.integrate(self.scenario, run_id="r-1")
        sa = json.dumps(contracts.to_jsonable(a), sort_keys=True, ensure_ascii=False)
        sb = json.dumps(contracts.to_jsonable(b), sort_keys=True, ensure_ascii=False)
        self.assertEqual(sa, sb)

    # --- bonus: prohibitions -----------------------------------------

    def test_no_cp_n4_d_reference(self):
        """CP-N4-D must NOT exist anywhere in the integration package."""
        integration_dir = CAPSTONE_DIR / "integration"
        for fname in os.listdir(integration_dir):
            if not fname.endswith(".py"):
                continue
            with open(integration_dir / fname, "r", encoding="utf-8") as fh:
                src = fh.read()
            self.assertNotIn(
                "CP-N4-D", src,
                f"{fname} references forbidden CP-N4-D",
            )

    def test_no_real_network_or_pii(self):
        """Quick scan: no socket/http/requests/urllib in subsystem code."""
        integration_dir = CAPSTONE_DIR / "integration"
        forbidden_apis = ("socket", "urllib", "requests", "http.client", "subprocess")
        for fname in os.listdir(integration_dir):
            if not fname.endswith(".py"):
                continue
            stem = fname[:-3]
            if stem not in SUBSYSTEM_MODULE_NAMES:
                continue
            with open(integration_dir / fname, "r", encoding="utf-8") as fh:
                src = fh.read()
            for api in forbidden_apis:
                # Allow `http` only as part of a string (e.g. "http://example.test").
                self.assertNotIn(
                    f"import {api}", src,
                    f"{fname} imports forbidden network API: {api}",
                )
            # PII markers: no real-looking emails.
            self.assertNotIn("@example.com", src, f"{fname} contains real-looking PII domain")

    # --- demo exits 0 -------------------------------------------------

    def test_demo_exits_zero(self):
        import subprocess
        r = subprocess.run(
            [sys.executable, str(CAPSTONE_DIR / "demo.py")],
            capture_output=True, text=True,
        )
        self.assertEqual(r.returncode, 0, f"demo exited {r.returncode}: {r.stderr}")
        self.assertIn("METRICS_JSON:", r.stdout)
        self.assertIn('"status": "pass"', r.stdout)
        self.assertIn('"subsystem_count": 12', r.stdout)


def run() -> int:
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestCpFinalIntegration)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    n_run = result.testsRun
    n_fail = len(result.failures) + len(result.errors)
    n_pass = n_run - n_fail
    print(f"\ncp_final: {n_pass} passed, {n_fail} failed, {n_run} total")
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    sys.exit(run())
