"""CP-N4-B tests — lineage, parity, canary, SLO, rollback (proven), change records."""
from __future__ import annotations

import json
import os
import sys

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import (  # noqa: E402
    lineage_graph, dataset_versions, registry, parity_check, staging_gate,
    canary, slo_report, RollbackExecutor, change_records,
)


def _rows():
    return [
        {"model_id": "model-01", "version": "v1", "dataset_version": "ds-1",
         "signature": "s1", "train_metric": 0.9, "serve_metric": 0.9,
         "slo_status": "ok", "rollback_target": None},
        {"model_id": "model-01", "version": "v2", "dataset_version": "ds-1",
         "signature": "s2", "train_metric": 0.9, "serve_metric": 0.7,
         "slo_status": "violated", "rollback_target": "model-01-v1"},
        {"model_id": "model-01", "version": "v3", "dataset_version": "ds-2",
         "signature": "s3", "train_metric": 0.92, "serve_metric": 0.92,
         "slo_status": "ok", "rollback_target": "model-01-v3"},
    ]


def test_lineage_resolves_artifact_to_inputs():
    g = lineage_graph(_rows())
    node = g["model-01-v1"]
    assert "depends_on" in node and "ds-1" in node["depends_on"]


def test_dataset_versions_tracked():
    dsv = dataset_versions(_rows())
    assert "ds-1" in dsv and "ds-2" in dsv


def test_registry_records_signatures():
    reg = registry(_rows())
    assert all("signature" in v for v in reg["model-01"])


def test_parity_check_flags_skew():
    par = {(p["model_id"], p["version"]): p for p in parity_check(_rows())}
    assert par[("model-01", "v2")]["parity_pass"] is False
    assert par[("model-01", "v1")]["parity_pass"] is True


def test_staging_gate_blocks_bad_versions():
    gate = staging_gate(_rows())
    versions_promoted = {p["version"] for p in gate["promoted"]}
    assert "v2" not in versions_promoted  # v2 has parity fail + slo violated


def test_canary_present():
    can = canary(_rows())
    assert can["canary"] is not None
    assert "metrics" in can["canary"]


def test_slo_report_lists_violations():
    slo = slo_report(_rows())
    versions = [v["version"] for v in slo["violations"]]
    assert "v2" in versions


def test_rollback_is_proven_not_documented():
    """Actually execute a rollback and verify the state changed."""
    rows = _rows()
    exe = RollbackExecutor(rows)
    exe.deploy("model-01", "v2")  # deploy the bad version
    assert exe.state["model-01"] == "v2"
    rb = exe.rollback("model-01")
    assert rb["rolled_back"] is True
    assert exe.state["model-01"] == "v1"  # restored to last-known-good
    # history must show both deploy and rollback
    actions = [h["action"] for h in exe.history]
    assert "deploy" in actions and "rollback" in actions


def test_change_records_include_incidents_and_rollbacks():
    rows = _rows()
    exe = RollbackExecutor(rows)
    exe.deploy("model-01", "v2")
    exe.rollback("model-01")
    ch = change_records(rows, exe.history)
    assert ch["changes"] and ch["incidents"] and ch["rollbacks"]
