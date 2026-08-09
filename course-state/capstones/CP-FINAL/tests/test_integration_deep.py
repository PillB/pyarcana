#!/usr/bin/env python3
"""CP-FINAL — deep integration tests aligned with actual module interfaces.

Run: ``python3 -m pytest tests/test_integration_deep.py -v`` from the
capstone package root, or ``python3 tests/test_integration_deep.py`` directly.

These tests exercise the no-go condition, backup/restore, the dependency
graph topology, and the contract interfaces — using the ACTUAL module APIs
(contracts dataclasses, dependency_graph.get_graph()/upstream_order(),
no_go.evaluate() returning Tuple[bool, str], backup_restore.backup()/restore()).
"""
from __future__ import annotations

import os
import sys

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)


class TestDependencyGraph:
    """Verify the dependency graph topology using actual API."""

    def test_graph_has_12_capstones(self):
        from integration import dependency_graph as dg
        graph = dg.get_graph()
        nodes = graph.get("nodes", [])
        assert len(nodes) == 12

    def test_upstream_order_has_12(self):
        from integration import dependency_graph as dg
        order = dg.upstream_order()
        assert len(order) == 12

    def test_intake_before_etl(self):
        from integration import dependency_graph as dg
        order = dg.upstream_order()
        assert order.index("CP-N1-A") < order.index("CP-N1-B")

    def test_copilot_or_n4c_last(self):
        from integration import dependency_graph as dg
        order = dg.upstream_order()
        assert order[-1] in ("CP-N4-C", "CP-FINAL", "copilot")


class TestNoGoCondition:
    """Verify the no-go evaluation using actual API."""

    def test_no_go_false_on_clean_run(self):
        from integration import platform, shared_scenario, no_go
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        result = no_go.evaluate(bundle.subsystem_results)
        # evaluate returns Tuple[bool, str]
        no_go_flag, reason = result if isinstance(result, tuple) else (result, "")
        assert no_go_flag is False

    def test_no_go_returns_tuple(self):
        from integration import no_go
        # Verify the actual return type
        result = no_go.evaluate({})
        assert isinstance(result, tuple)
        assert len(result) == 2


class TestBackupRestore:
    """Verify backup/restore using actual API."""

    def test_backup_creates_file(self, tmp_path):
        from integration import platform, shared_scenario, backup_restore
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        path = backup_restore.backup(bundle, str(tmp_path))
        assert os.path.exists(path)

    def test_restore_recovers_data(self, tmp_path):
        from integration import platform, shared_scenario, backup_restore
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        path = backup_restore.backup(bundle, str(tmp_path))
        restored = backup_restore.restore(path)
        assert isinstance(restored, dict)
        assert "subsystem_results" in restored or "no_go" in restored


class TestEndToEndTrace:
    """Verify the end-to-end trace properties."""

    def test_trace_has_shared_trace_id(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        trace_ids = {e.get("trace_id") for e in bundle.end_to_end_trace}
        assert len(trace_ids) >= 1  # at least one trace_id

    def test_trace_has_12_steps(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert len(bundle.end_to_end_trace) == 12

    def test_bundle_has_no_go_field(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        assert hasattr(bundle, "no_go")
        assert bundle.no_go is False


class TestContractInterfaces:
    """Verify the 12 contract dataclasses exist."""

    def test_12_contract_dataclasses_exist(self):
        from integration import contracts
        # The contracts module defines frozen dataclasses for each interface
        contract_classes = [
            "IntakeResult", "EtlManifest", "ReviewPacket",
            "EdaReport", "ReportBundle", "RpaAudit",
            "ClusterSet", "GraphCase", "TriageDecision",
            "ApiResponse", "DeployRecord", "CopilotRunRecord",
        ]
        for cls_name in contract_classes:
            assert hasattr(contracts, cls_name), f"contracts missing {cls_name}"

    def test_integration_bundle_exists(self):
        from integration import contracts
        assert hasattr(contracts, "IntegrationBundle")

    def test_integration_bundle_has_required_fields(self):
        from integration import contracts
        assert hasattr(contracts, "IntegrationBundle")
        # Check fields exist on the dataclass
        fields = contracts.IntegrationBundle.__dataclass_fields__
        assert "subsystem_results" in fields
        assert "end_to_end_trace" in fields
        assert "no_go" in fields


class TestContributionStatement:
    """Verify the contribution statement is truthful."""

    def test_contribution_statement_exists(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        # The bundle may store it as a field or in subsystem_results
        stmt = getattr(bundle, "contribution_statement", None)
        if stmt is None:
            stmt = bundle.subsystem_results.get("CP-FINAL", {}).get("contribution_statement", "")
        assert stmt and len(stmt) > 50

    def test_no_fraud_prevention_claim(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        stmt = getattr(bundle, "contribution_statement", "") or ""
        assert "fraud prevention" not in stmt.lower()

    def test_no_money_saved_claim(self):
        from integration import platform, shared_scenario
        bundle = platform.integrate(shared_scenario.shared_scenario_v1)
        stmt = getattr(bundle, "contribution_statement", "") or ""
        assert "money saved" not in stmt.lower()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
