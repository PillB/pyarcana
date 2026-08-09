"""CP-N2-A tests — reproducibility, memo structure, missingness classification."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import run, dictionary, missingness, memo, profile, distributions  # noqa: E402


def _rows():
    return [
        {"txn_id": f"T{i}", "client_id": f"C{i%5}", "amount": float(i * 10 + 1),
         "channel": "online" if i % 2 == 0 else "call_center",
         "segment": "low_value" if i % 3 else "high_value",
         "region": "NA" if i % 4 else None, "timestamp": "2024-01-01T00:00:00Z",
         "missing_flag": "none" if i % 4 else "region_mcar"}
        for i in range(1, 21)
    ]


def test_dictionary_has_all_fields():
    d = dictionary(_rows())
    fields = {x["field"] for x in d}
    assert {"txn_id", "amount", "channel", "segment", "region"} <= fields


def test_missingness_classifies_three_mechanisms():
    m = missingness(_rows())
    text = json.dumps(m)
    assert "MCAR" in text and "MAR" in text and "MNAR" in text


def test_memo_has_five_parts():
    p = profile(_rows())
    m = missingness(_rows())
    text = memo(p, m, {})
    for part in ("[OBSERVATION]", "[ASSOCIATION]", "[HYPOTHESIS]",
                 "[RECOMMENDATION]", "[LIMITATION]"):
        assert part in text


def test_memo_no_causal_claim():
    p = profile(_rows())
    m = missingness(_rows())
    text = memo(p, m, {}).lower()
    assert "causes" not in text and "caused by" not in text


def test_reproducible_two_runs(tmp_path):
    sample = tmp_path / "sample.json"
    sample.write_text(json.dumps(_rows()))
    out1 = tmp_path / "o1"
    out2 = tmp_path / "o2"
    run(str(sample), str(out1))
    run(str(sample), str(out2))
    assert (out1 / "executive_memo.txt").read_text() == (out2 / "executive_memo.txt").read_text()
    assert (out1 / "dictionary.json").read_text() == (out2 / "dictionary.json").read_text()


def test_outlier_rationale_explicit(tmp_path):
    sample = tmp_path / "sample.json"
    sample.write_text(json.dumps(_rows()))
    out = tmp_path / "o"
    run(str(sample), str(out))
    obj = json.load(open(out / "outliers.json"))
    assert "rationale" in obj and obj["rationale"]


def test_distributions_present(tmp_path):
    d = distributions(_rows() * 5)
    assert d["field"] == "amount"
    assert "histogram" in d
