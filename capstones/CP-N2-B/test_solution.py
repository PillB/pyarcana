"""CP-N2-B tests — accessibility, source-to-claim, freshness, report checks."""
from __future__ import annotations

import json
import os
import sys
import tempfile

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import run_checks, render_dashboard, render_claims  # noqa: E402


def _rows(**extra):
    base = [
        {"metric_id": "M1", "segment": "low_value", "value": 50, "denominator": 100,
         "source_rows": ["TXN-1"], "freshness_ts": "2024-12-01T00:00:00Z"},
    ]
    for k, v in extra.items():
        base[0][k] = v
    return base


def test_no_colour_only_encoding_in_render():
    text = render_dashboard(_rows())
    assert any(s in text for s in ("●", "■", "▲", "◆"))


def test_200_pct_zoom_reflow():
    text = render_dashboard(_rows())
    for line in text.splitlines():
        assert len(line) <= 80


def test_empty_state_is_accessible():
    text = render_dashboard([])
    assert "[EMPTY STATE]" in text


def test_source_to_claim_traceability():
    claims = render_claims(_rows())
    assert claims[0]["source_rows"] == ["TXN-1"]
    assert claims[0]["freshness_ts"]


def test_check_catches_misleading_axis():
    failures = [f for f in [run_checks(_rows(y_axis_min=90, y_axis_max=100))["failures"]][0]
                if f["check"] == "misleading_axis"]
    assert failures


def test_check_catches_hidden_denominator():
    failures = run_checks(_rows(denominator=0))["failures"]
    assert any(f["check"] == "hidden_denominator" for f in failures)


def test_check_catches_stale():
    failures = run_checks(_rows(freshness_ts="2024-01-01T00:00:00Z"))["failures"]
    assert any(f["check"] == "stale_result" for f in failures)


def test_check_catches_colour_only():
    failures = run_checks(_rows(encoding_hint="colour_only"))["failures"]
    assert any(f["check"] == "colour_only_encoding" for f in failures)


def test_pdf_is_deterministic(tmp_path):
    import subprocess
    sample = tmp_path / "s.json"
    sample.write_text(json.dumps(_rows()))
    a = tmp_path / "a"; b = tmp_path / "b"
    for o in (a, b):
        subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                        "--input", str(sample), "--outdir", str(o)], capture_output=True, text=True)
    assert (a / "report.pdf").read_bytes() == (b / "report.pdf").read_bytes()
