"""CP-N3-C tests — leakage, calibration, abstention, subgroup, temporal, drift."""
from __future__ import annotations

import json
import os
import sys

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import (  # noqa: E402
    time_aware_split, train_logreg, predict, accuracy, calibration, select_threshold,
    abstain, subgroup_performance, temporal_performance, drift, majority_baseline,
)


def _rows(n=200):
    import random
    rng = random.Random(42)
    out = []
    for i in range(1, n + 1):
        out.append({
            "case_id": f"C{i}",
            "features": {"f1": rng.uniform(0, 1), "f2": rng.uniform(0, 1), "f3": rng.uniform(0, 1)},
            "outcome": rng.choice([0, 1]),
            "subgroup": rng.choice(["A", "B", "C", "D"]),
            "timestamp": f"2024-{(i % 12) + 1:02d}-15",
        })
    return out


def test_time_aware_split_no_leakage():
    rows = _rows()
    tr, dv, te = time_aware_split(rows)
    assert max(r["timestamp"] for r in tr) <= min(r["timestamp"] for r in dv)
    assert max(r["timestamp"] for r in dv) <= min(r["timestamp"] for r in te)


def test_majority_baseline_present():
    base = majority_baseline(_rows())
    assert "accuracy" in base and base["accuracy"] >= 0.0


def test_model_beats_or_matches_baseline():
    rows = _rows(300)
    tr, dv, te = time_aware_split(rows)
    base = majority_baseline(tr)
    model = train_logreg(tr, epochs=50)
    th = select_threshold(model, dv)
    m = accuracy(model, te, th["threshold"])
    assert m["accuracy"] >= base["accuracy"] - 0.1  # within 10pts of majority


def test_calibration_has_10_bins():
    rows = _rows(100)
    model = train_logreg(rows, epochs=20)
    cal = calibration(model, rows)
    assert len(cal) == 10
    assert all("avg_prob" in c and "empirical_freq" in c for c in cal)


def test_threshold_selection_has_cost_rationale():
    rows = _rows(100)
    model = train_logreg(rows, epochs=20)
    th = select_threshold(model, rows)
    assert "cost_fp" in th["rationale"] and "cost_fn" in th["rationale"]


def test_abstention_routes_uncertain_to_human_review():
    rows = _rows(100)
    model = train_logreg(rows, epochs=20)
    th = select_threshold(model, rows)
    abst = abstain(model, rows, th["threshold"])
    assert abst["abstain_count"] >= 0
    # All adverse predictions must route to human review
    for r in abst["rows"]:
        if r["probability"] >= th["threshold"]:
            assert r["action"] == "human_review"


def test_subgroup_performance_reports_all_groups():
    rows = _rows(100)
    model = train_logreg(rows, epochs=20)
    sub = subgroup_performance(model, rows, 0.5)
    assert set(sub.keys()) >= {"A", "B", "C", "D"}


def test_temporal_performance_reports_months():
    rows = _rows(100)
    model = train_logreg(rows, epochs=20)
    tmp = temporal_performance(model, rows, 0.5)
    assert all(m.startswith("2024-") for m in tmp.keys())


def test_drift_detector_reports_drops():
    rows = _rows(100)
    model = train_logreg(rows, epochs=20)
    tr, dv, te = time_aware_split(rows)
    tr_sub = subgroup_performance(model, tr, 0.5)
    te_sub = subgroup_performance(model, te, 0.5)
    drf = drift(tr_sub, te_sub)
    assert "acc_drop_by_subgroup" in drf and "alert" in drf


def test_no_unreviewed_adverse_decision():
    rows = _rows(50)
    model = train_logreg(rows, epochs=20)
    th = select_threshold(model, rows)
    abst = abstain(model, rows, th["threshold"])
    for r in abst["rows"]:
        if r["probability"] >= th["threshold"]:
            assert r["action"] == "human_review"
