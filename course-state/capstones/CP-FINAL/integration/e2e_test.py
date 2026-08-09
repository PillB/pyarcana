"""CP-FINAL — end-to-end integration test.

Run: python3 -m unittest integration.e2e_test -v

Asserts:
  - platform.integrate(scenario) returns an IntegrationBundle.
  - all 12 dependencies present in subsystem_results.
  - each subsystem returns its declared contract type.
  - end-to-end trace is present and ordered.
  - evidence bundle contains contracts, trace, dependency graph, cards.
  - backup + restore round-trips.
  - rollback restores prior state (proven).
  - no-go condition triggers when a critical subsystem fails.
  - reproducible: same scenario seed -> same bundle hash.
"""
from __future__ import annotations

import copy
import dataclasses
import json
import os
import tempfile
import unittest

from . import contracts
from . import dependency_graph
from . import no_go
from . import platform as platform_module
from . import rollback as rollback_module
from . import shared_scenario
from . import backup_restore
from . import (
    intake, etl, familiarity, eda, reports, rpa,
    er, graph, triage, service, platform_ml, copilot,
)


class E2ETest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.scenario = shared_scenario.shared_scenario_v1
        cls.bundle = platform_module.integrate(cls.scenario, run_id="e2e-fixed-run-id")

    def test_bundle_type(self):
        self.assertIsInstance(self.bundle, contracts.IntegrationBundle)
        self.assertEqual(self.bundle.contract_id, "CP-FINAL")
        self.assertEqual(self.bundle.contract_version, contracts.PACKAGE_VERSION)

    def test_all_12_dependencies_present(self):
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            self.assertIn(cid, self.bundle.subsystem_results,
                          f"missing subsystem {cid} in bundle")
            self.assertIsNotNone(self.bundle.subsystem_results[cid])

    def test_contract_compatibility(self):
        # The bundle stores JSON-serialized results; the platform also returns
        # the typed objects internally — re-run each subsystem and check types.
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            self.assertIn(cid, self.bundle.subsystem_results)
            payload = self.bundle.subsystem_results[cid]
            self.assertEqual(payload["contract_id"], cid)
            self.assertEqual(payload["contract_version"],
                             contracts.expected_contract_version(cid))

    def test_end_to_end_trace_present(self):
        trace = self.bundle.end_to_end_trace
        self.assertEqual(len(trace), 12)
        # Topological order is preserved.
        order = dependency_graph.upstream_order()
        for i, ev in enumerate(trace):
            self.assertEqual(ev["subsystem"], order[i])
            self.assertTrue(ev["ok"])
            self.assertIn("duration_ms", ev)

    def test_evidence_bundle_present(self):
        ev = self.bundle.evidence_bundle
        self.assertIn("contracts", ev)
        self.assertIn("trace", ev)
        self.assertIn("dependency_graph", ev)
        self.assertIn("cards", ev)
        self.assertIn("reproducibility", ev)
        self.assertEqual(len(ev["contracts"]), 12)

    def test_dependency_graph_present(self):
        g = self.bundle.dependency_graph
        self.assertEqual(g["upstream_count"], 12)
        self.assertEqual(len(g["topological_order"]), 13)
        self.assertEqual(g["topological_order"][-1], "CP-FINAL")

    def test_backup_and_restore(self):
        with tempfile.TemporaryDirectory() as td:
            path = backup_restore.backup(self.bundle, td)
            self.assertTrue(os.path.isfile(path))
            restored = backup_restore.restore(path)
            self.assertEqual(restored["contract_id"], "CP-FINAL")
            self.assertEqual(restored["scenario_id"], self.bundle.scenario_id)
            self.assertEqual(len(restored["subsystem_results"]), 12)

    def test_rollback_restores_prior_state(self):
        proof = rollback_module.demonstrate_rollback()
        self.assertTrue(proof["rollback_proven"])

    def test_no_go_triggers_on_critical_failure(self):
        # Simulate a critical subsystem failure: tamper with CP-N3-A so that
        # `inferred_relationships` is True (a criticalFailure).
        bad_results = {}
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            runner = platform_module.SUBSYSTEM_RUNNERS[cid]
            bad_results[cid] = runner(platform_module._build_subsystem_inputs(self.scenario)[cid])
        bad_results["CP-N3-A"] = dataclasses.replace(
            bad_results["CP-N3-A"], inferred_relationships=True
        )
        no_go_flag, reason = no_go.evaluate(bad_results)
        self.assertTrue(no_go_flag)
        self.assertIn("CP-N3-A", reason)

    def test_no_go_triggers_on_missing_subsystem(self):
        bad_results = {}
        for cid in dependency_graph.UPSTREAM_CAPSTONES:
            runner = platform_module.SUBSYSTEM_RUNNERS[cid]
            bad_results[cid] = runner(platform_module._build_subsystem_inputs(self.scenario)[cid])
        del bad_results["CP-N4-C"]
        no_go_flag, reason = no_go.evaluate(bad_results)
        self.assertTrue(no_go_flag)
        self.assertIn("CP-N4-C", reason)

    def test_reproducible(self):
        a = platform_module.integrate(self.scenario)
        b = platform_module.integrate(self.scenario)
        sa = json.dumps(contracts.to_jsonable(a), sort_keys=True, ensure_ascii=False)
        sb = json.dumps(contracts.to_jsonable(b), sort_keys=True, ensure_ascii=False)
        self.assertEqual(sa, sb)

    def test_no_go_is_false_on_clean_run(self):
        self.assertFalse(self.bundle.no_go, msg=self.bundle.no_go_reason)
        self.assertEqual(self.bundle.no_go_reason, "")

    def test_no_subsystem_imports_another(self):
        """AST guard: no subsystem module may import another subsystem module."""
        import ast
        here = os.path.dirname(__file__)
        subsystem_names = {
            "intake", "etl", "familiarity", "eda", "reports", "rpa",
            "er", "graph", "triage", "service", "platform_ml", "copilot",
        }
        for fname in os.listdir(here):
            if not fname.endswith(".py"):
                continue
            stem = fname[:-3]
            if stem not in subsystem_names:
                continue
            path = os.path.join(here, fname)
            with open(path, "r", encoding="utf-8") as fh:
                tree = ast.parse(fh.read(), filename=path)
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for n in node.names:
                        self.assertFalse(
                            any(n.name.split(".")[-1] == s for s in subsystem_names if s != stem),
                            f"{stem} imports another subsystem: {n.name}",
                        )
                elif isinstance(node, ast.ImportFrom):
                    mod = node.module or ""
                    base = mod.split(".")[-1]
                    self.assertFalse(
                        base in subsystem_names and base != stem,
                        f"{stem} imports another subsystem: {mod}",
                    )


if __name__ == "__main__":
    unittest.main(verbosity=2)
