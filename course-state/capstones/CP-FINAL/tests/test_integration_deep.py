#!/usr/bin/env python3
"""CP-FINAL — deep integration tests against the implemented contracts.

Run from the capstone package root:

    python3 -m pytest tests/test_integration_deep.py -v

These tests use the production APIs: ``contracts.CONTRACT_REGISTRY`` /
dataclass inspection, ``dependency_graph.get_graph()`` /
``upstream_order()``, ``no_go.evaluate()`` with **typed** contract
objects, ``bundle.no_go`` after serialization, and
``backup_restore.backup()`` / ``restore()``.
"""
from __future__ import annotations

import os
import sys

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)

from integration import backup_restore, contracts, dependency_graph, no_go, platform, shared_scenario


CRITICAL_BUNDLE_FIELDS = (
    "contract_id",
    "contract_version",
    "scenario_id",
    "subsystem_results",
    "end_to_end_trace",
    "dependency_graph",
    "evidence_bundle",
    "no_go",
    "no_go_reason",
    "reproducible",
    "contribution_statement",
)


def _typed_success_results():
    """Build a complete map by running the live pedagogical twins.

    Empty dataclass defaults are fail-closed and must not be treated as GO.
    """
    scenario = shared_scenario.shared_scenario_v1
    inputs = platform._build_subsystem_inputs(scenario)
    return {
        cid: platform.SUBSYSTEM_RUNNERS[cid](inputs[cid])
        for cid in dependency_graph.UPSTREAM_CAPSTONES
    }


class TestContractInterfaces:
    def test_twelve_contract_dataclasses_registered(self):
        assert len(contracts.CONTRACT_REGISTRY) == 12

    def test_every_registry_entry_has_type_and_version(self):
        for cid, entry in contracts.CONTRACT_REGISTRY.items():
            assert "type" in entry, cid
            assert "version" in entry, cid
            assert contracts.expected_contract_version(cid) == entry["version"]

    def test_integration_bundle_has_required_fields(self):
        fields = contracts.IntegrationBundle.__dataclass_fields__
        for name in CRITICAL_BUNDLE_FIELDS:
            assert name in fields, name


class TestDependencyGraph:
    def test_graph_has_13_nodes_total(self):
        graph = dependency_graph.get_graph()
        nodes = graph["nodes"]
        assert len(nodes) == 13
        ids = {n["id"] for n in nodes}
        assert ids == set(dependency_graph.UPSTREAM_CAPSTONES) | {"CP-FINAL"}

    def test_upstream_count_is_12(self):
        graph = dependency_graph.get_graph()
        assert graph["upstream_count"] == 12
        assert len(dependency_graph.upstream_order()) == 12

    def test_intake_before_etl(self):
        order = dependency_graph.upstream_order()
        assert order.index("CP-N1-A") < order.index("CP-N1-B")

    def test_n4c_last_among_upstream(self):
        order = dependency_graph.upstream_order()
        assert order[-1] == "CP-N4-C"

    def test_final_last_in_topological_order(self):
        assert dependency_graph.get_graph()["topological_order"][-1] == "CP-FINAL"


class TestNoGoTypedContracts:
    def test_evaluate_go_path_with_typed_contracts(self):
        flag, reason = no_go.evaluate(_typed_success_results())
        assert flag is False
        assert reason == ""

    def test_evaluate_no_go_on_missing_subsystem(self):
        results = _typed_success_results()
        del results["CP-N4-C"]
        flag, reason = no_go.evaluate(results)
        assert flag is True
        assert "CP-N4-C" in reason

    def test_evaluate_no_go_on_type_mismatch(self):
        results = _typed_success_results()
        results["CP-N1-A"] = {"contract_id": "CP-N1-A"}
        flag, reason = no_go.evaluate(results)
        assert flag is True
        assert "dict" in reason or "IntakeResult" in reason

    def test_serialized_dicts_are_not_passed_back_to_evaluator(self):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        # The platform already evaluated typed objects. After serialization
        # the stored map is JSON dicts; asserting bundle.no_go is the contract.
        assert isinstance(next(iter(bundle.subsystem_results.values())), dict)
        assert bundle.no_go is False
        assert bundle.no_go_reason == ""

    def test_evaluate_no_go_on_failed_positive_flag(self):
        results = _typed_success_results()
        broken = contracts.IntakeResult(malformed_handled=False)
        results["CP-N1-A"] = broken
        flag, reason = no_go.evaluate(results)
        assert flag is True
        assert "malformed_handled" in reason


class TestBackupRestore:
    def test_backup_round_trip_preserves_critical_fields(self, tmp_path):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        path = backup_restore.backup(bundle, str(tmp_path))
        restored = backup_restore.restore(path)
        for field in CRITICAL_BUNDLE_FIELDS:
            assert field in restored, field
        assert restored["contribution_statement"] == bundle.contribution_statement
        assert restored["contribution_statement"] == contracts.CONTRIBUTION_STATEMENT
        assert restored["no_go"] == bundle.no_go
        assert restored["scenario_id"] == bundle.scenario_id
        assert restored["reproducible"] is True
        assert len(restored["subsystem_results"]) == 12
        assert len(restored["end_to_end_trace"]) == 12
        assert restored["subsystem_results"].keys() == bundle.subsystem_results.keys()
        assert restored["end_to_end_trace"] == bundle.end_to_end_trace

    def test_integrate_with_backup_dir_sets_path(self, tmp_path):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1, backup_dir=str(tmp_path))
        assert bundle.backup_path is not None
        assert os.path.exists(bundle.backup_path)


class TestEndToEndTrace:
    def test_trace_has_12_steps(self):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert len(bundle.end_to_end_trace) == 12

    def test_shared_nonempty_run_id(self):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        run_ids = {event.get("run_id") for event in bundle.end_to_end_trace}
        assert None not in run_ids
        assert "" not in run_ids
        assert len(run_ids) == 1
        run_id = next(iter(run_ids))
        assert isinstance(run_id, str) and run_id

    def test_trace_order_matches_upstream_order(self):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        actual = [event["subsystem"] for event in bundle.end_to_end_trace]
        assert actual == dependency_graph.upstream_order()


class TestContributionStatement:
    def test_contribution_statement_populated_from_brief(self):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert bundle.contribution_statement == contracts.CONTRIBUTION_STATEMENT
        assert len(bundle.contribution_statement) > 50
        assert "pedagógico" in bundle.contribution_statement

    def test_no_fraud_prevention_claim(self):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert "fraud prevention" not in bundle.contribution_statement.lower()

    def test_no_money_saved_claim(self):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert "money saved" not in bundle.contribution_statement.lower()

    def test_no_production_accuracy_claim(self):
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert "production accuracy" not in bundle.contribution_statement.lower()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
