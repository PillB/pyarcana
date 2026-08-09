"""CP-N1-C tests — separation / provenance / uncertainty / false-positive / accessibility."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import annotate, render, FORBIDDEN_CLAIMS  # noqa: E402


def _pair(**overrides):
    base = {
        "pair_id": "PAIR-test",
        "client_a": "ACME-00001",
        "client_b": "ACME-00002",
        "features": {
            "name_jaro_winkler": 0.95,
            "name_token_ratio": 0.8,
            "geo_haversine_km": 0.3,
            "temporal_overlap_days": 365,
            "shared_employer": True,
            "shared_address": False,
        },
        "label": "negative",  # dashboard must NOT read this
    }
    base.update(overrides)
    return base


def test_three_regions_separate():
    p = annotate(_pair())
    assert set(p.keys()) >= {"er_evidence", "relationship_evidence", "risk_decision"}
    assert all(s["signal"].startswith("name") for s in p["er_evidence"])
    assert all(s["signal"] in ("geo_haversine_km", "temporal_overlap_days", "shared_employer", "shared_address")
               for s in p["relationship_evidence"])


def test_provenance_on_every_signal():
    p = annotate(_pair())
    for s in p["er_evidence"] + p["relationship_evidence"]:
        assert s["provenance"]
        assert s["unit"]
        assert "uncertainty" in s


def test_uncertainty_present():
    p = annotate(_pair())
    assert p["uncertainty"] >= 0.0


def test_no_adverse_decision_when_close():
    p = annotate(_pair())  # high name similarity + close geo
    assert p["risk_decision"] in ("human_review_required", "no_decision")
    assert p["risk_decision"] != "fraud"


def test_no_decision_when_far_apart():
    p = annotate(_pair(features={
        "name_jaro_winkler": 0.1, "name_token_ratio": 0.0,
        "geo_haversine_km": 5000.0, "temporal_overlap_days": 0,
        "shared_employer": False, "shared_address": False}))
    assert p["risk_decision"] == "no_decision"


def test_forbidden_claims_absent_from_render():
    text = render(annotate(_pair()))
    for claim in FORBIDDEN_CLAIMS:
        assert claim not in text.lower()


def test_keyboard_and_zoom_reflow():
    text = render(annotate(_pair()))
    for line in text.splitlines():
        assert len(line) <= 80, f"line too long (>80 cols): {line}"


def test_false_positive_flag_creates_audit_record(tmp_path):
    sample = tmp_path / "sample.json"
    sample.write_text(json.dumps([_pair()]))
    out = tmp_path / "dash.txt"
    subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                    "--input", str(sample), "--output", str(out),
                    "--flag-fp", "PAIR-test"], capture_output=True, text=True)
    fp = tmp_path / "false_positives.jsonl"
    assert fp.exists()
    assert "PAIR-test" in fp.read_text()


def test_label_is_never_used_by_dashboard():
    # dashboard must compute risk_decision purely from features, not the label
    p1 = annotate(_pair(label="positive"))
    p2 = annotate(_pair(label="negative"))
    assert p1["risk_decision"] == p2["risk_decision"]
