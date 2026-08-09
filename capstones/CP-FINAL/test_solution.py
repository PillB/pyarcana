"""CP-FINAL tests — contract tests, e2e, backup/restore, rollback, no-go, CV."""
from __future__ import annotations

import json
import os
import sys
import tempfile

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import (  # noqa: E402
    UPSTREAM, contract_tests, end_to_end_trace, backup_restore_drill,
    rollback_drill, disaster_exercise, no_go_check, contribution_statement,
    truthful_cv_narrative, run,
)


def _scenario():
    return {
        "scenario_id": "ACME-001-test",
        "shared_trace_id": "trace-test-001",
        "subsystems": [
            {"capstone_id": c[0], "subsystem": c[1], "interface_version": "v1",
             "input": {"x": 1}, "output": {"y": 2}, "contract_test_status": "pending",
             "e2e_status": "pending"}
            for c in UPSTREAM
        ],
    }


def test_twelve_upstream_interfaces_declared():
    assert len(UPSTREAM) == 12
    ids = {c[0] for c in UPSTREAM}
    expected = {"CP-N1-A", "CP-N1-B", "CP-N1-C", "CP-N2-A", "CP-N2-B", "CP-N2-C",
                "CP-N3-A", "CP-N3-B", "CP-N3-C", "CP-N4-A", "CP-N4-B", "CP-N4-C"}
    assert ids == expected


def test_contract_tests_pass_on_valid_scenario():
    ct = contract_tests(_scenario())
    assert len(ct) == 12
    assert all(r["status"] == "pass" for r in ct)


def test_contract_tests_fail_on_missing_input():
    s = _scenario()
    s["subsystems"][0]["input"] = {}
    ct = contract_tests(s)
    assert ct[0]["status"] == "fail"


def test_end_to_end_trace_has_twelve_steps():
    e2e = end_to_end_trace(_scenario())
    assert e2e["step_count"] == 12
    assert e2e["trace_id"] == "trace-test-001"


def test_backup_restore_verified(tmp_path):
    bk = backup_restore_drill(_scenario(), str(tmp_path))
    assert bk["verified"] is True


def test_rollback_drill_executed():
    rb = rollback_drill(_scenario())
    assert rb["rolled_back"] is True
    assert rb["executed"] is True


def test_disaster_exercise_triggers_no_go():
    de = disaster_exercise(_scenario())
    assert de["no_go_triggered"] is True
    assert len(de["failures"]) == 12


def test_no_go_check_passes_on_clean_run():
    s = _scenario()
    ct = contract_tests(s)
    e2e = end_to_end_trace(s)
    bk = backup_restore_drill(s, "/tmp")
    rb = rollback_drill(s)
    de = disaster_exercise(s)
    ng = no_go_check(ct, e2e, bk, rb, de)
    assert ng["go_live"] is True
    assert ng["triggered"] == []


def test_no_go_check_triggers_on_contract_failure():
    s = _scenario()
    s["subsystems"][0]["input"] = {}
    ct = contract_tests(s)
    e2e = end_to_end_trace(s)
    bk = backup_restore_drill(s, "/tmp")
    rb = rollback_drill(s)
    de = disaster_exercise(s)
    ng = no_go_check(ct, e2e, bk, rb, de)
    assert "contract_test_failure" in ng["triggered"]
    assert ng["go_live"] is False


def test_contribution_statement_present():
    s = _scenario()
    ct = contract_tests(s)
    e2e = end_to_end_trace(s)
    bk = backup_restore_drill(s, "/tmp")
    rb = rollback_drill(s)
    de = disaster_exercise(s)
    text = contribution_statement({"contract_tests": ct, "e2e": e2e, "backup": bk,
                                   "rollback": rb, "disaster": de})
    assert "Personal Contribution Statement" in text


def test_cv_narrative_no_unsupported_claims():
    text = truthful_cv_narrative({}).lower()
    for forbidden in ("saved money", "prevented fraud", "production accuracy", "enterprise scale"):
        assert forbidden not in text


def test_run_produces_all_artefacts(tmp_path):
    sample = tmp_path / "scenario.json"
    sample.write_text(json.dumps(_scenario()))
    out = tmp_path / "out"
    run(str(sample), str(out))
    for f in ("contract_tests.json", "e2e_trace.json", "backup_restore.json",
              "rollback.json", "disaster_exercise.json", "no_go_check.json",
              "adrs.json", "architecture.txt", "threat_model.md", "runbook.md",
              "contribution_statement.md", "cv_narrative.md", "system_card.md"):
        assert (out / f).exists(), f"missing artefact: {f}"
