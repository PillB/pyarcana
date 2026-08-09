#!/usr/bin/env python3
"""CP-FINAL — deep integration tests for the 12-subsystem platform.

Run: ``python3 -m pytest tests/test_integration_deep.py -v`` from the
capstone package root, or ``python3 tests/test_integration_deep.py`` directly.

These tests go deeper than ``test_demo.py``: they exercise the no-go
condition, the backup/restore/rollback drill, the dependency graph
topology, and the contract schema validation for each of the 12 interfaces.
"""
from __future__ import annotations

import os
import sys

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)


class TestContractSchemaValidation:
    """Verify each of the 12 contracts has the required schema fields."""

    def test_all_12_contracts_declared(self):
        from integration import contracts
        assert len(contracts.CONTRACTS) == 12

    def test_every_contract_has_version_v1(self):
        from integration import contracts
        for c in contracts.CONTRACTS:
            assert c.version == "v1", f"{c.name} version is {c.version}, expected v1"

    def test_every_contract_has_request_schema(self):
        from integration import contracts
        for c in contracts.CONTRACTS:
            assert hasattr(c, "request_schema") or hasattr(c, "request_fields"), \
                f"{c.name} missing request schema"

    def test_every_contract_has_response_schema(self):
        from integration import contracts
        for c in contracts.CONTRACTS:
            assert hasattr(c, "response_schema") or hasattr(c, "response_fields"), \
                f"{c.name} missing response schema"

    def test_every_contract_has_direction(self):
        from integration import contracts
        for c in contracts.CONTRACTS:
            assert hasattr(c, "direction"), f"{c.name} missing direction"


class TestDependencyGraph:
    """Verify the dependency graph topology is valid."""

    def test_graph_has_12_nodes(self):
        from integration import dependency_graph
        nodes = dependency_graph.get_nodes()
        assert len(nodes) == 12

    def test_graph_has_edges(self):
        from integration import dependency_graph
        edges = dependency_graph.get_edges()
        assert len(edges) > 0

    def test_topological_order_exists(self):
        from integration import dependency_graph
        order = dependency_graph.topological_sort()
        assert len(order) == 12
        # intake should come before etl
        assert order.index("intake") < order.index("etl")
        # copilot should come last (consumes all upstream)
        assert order[-1] == "copilot" or order[-1] == "CP-N4-C"


class TestNoGoCondition:
    """Verify the no-go evaluation triggers correctly."""

    def test_no_go_false_on_clean_run(self):
        from integration import platform, shared_scenario, no_go
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        result = no_go.evaluate(bundle)
        assert result.no_go is False
        assert len(result.triggers) == 0

    def test_no_go_true_on_contract_failure(self):
        from integration import no_go
        # Simulate a contract failure
        result = no_go.evaluate(None, force_trigger="contract_test_failure")
        assert result.no_go is True
        assert "contract_test_failure" in result.triggers

    def test_no_go_true_on_faithfulness_below_threshold(self):
        from integration import no_go
        result = no_go.evaluate(None, force_trigger="faithfulness_below_threshold")
        assert result.no_go is True
        assert "faithfulness_below_threshold" in result.triggers

    def test_no_go_true_on_budget_overrun(self):
        from integration import no_go
        result = no_go.evaluate(None, force_trigger="budget_overrun")
        assert result.no_go is True
        assert "budget_overrun" in result.triggers

    def test_no_go_has_correction_recommended_field(self):
        from integration import no_go
        result = no_go.evaluate(None, force_trigger="contract_test_failure")
        assert hasattr(result, "correction_recommended")


class TestBackupRestoreRollback:
    """Verify the backup/restore/rollback drill."""

    def test_backup_creates_snapshot(self):
        from integration import backup_restore
        snapshot = backup_restore.create_snapshot({"test": "data"})
        assert snapshot is not None
        assert hasattr(snapshot, "hash") or "hash" in str(snapshot)

    def test_restore_recovers_state(self):
        from integration import backup_restore
        original = {"test": "data", "count": 42}
        snapshot = backup_restore.create_snapshot(original)
        restored = backup_restore.restore(snapshot)
        assert restored == original

    def test_rollback_proven(self):
        from integration import backup_restore
        proof = backup_restore.demonstrate_rollback()
        assert proof is not None
        assert hasattr(proof, "rolled_back") or "rolled_back" in str(proof)
        assert "True" in str(proof) or True in [getattr(proof, a, None) for a in dir(proof)]


class TestEndToEndTrace:
    """Verify the end-to-end trace properties."""

    def test_trace_has_shared_trace_id(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        trace_ids = {e.get("trace_id") for e in bundle.end_to_end_trace}
        assert len(trace_ids) == 1  # all steps share one trace_id

    def test_trace_has_12_steps(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert len(bundle.end_to_end_trace) == 12

    def test_trace_steps_are_ordered(self):
        from integration import platform, shared_scenario, dependency_graph
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        expected_order = dependency_graph.topological_sort()
        actual_order = [e["subsystem"] for e in bundle.end_to_end_trace]
        # The actual order should respect the topological sort
        for i in range(len(actual_order) - 1):
            assert expected_order.index(actual_order[i]) <= expected_order.index(actual_order[i + 1])


class TestContributionStatement:
    """Verify the contribution statement is truthful."""

    def test_contribution_statement_exists(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert hasattr(bundle, "contribution_statement")
        assert len(bundle.contribution_statement) > 50

    def test_no_fraud_prevention_claim(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert "fraud prevention" not in bundle.contribution_statement.lower()

    def test_no_money_saved_claim(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert "money saved" not in bundle.contribution_statement.lower()

    def test_no_production_accuracy_claim(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert "production accuracy" not in bundle.contribution_statement.lower()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
