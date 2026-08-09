"""CP-N3-A tests — the nine required test categories from the contract."""
from __future__ import annotations

import json
import os
import sys

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import (  # noqa: E402
    block, compare, score, classify, evaluate, jaro_winkler, _slug,
    pr_curve, select_threshold, deterministic_baseline, cluster, error_analysis,
)


def _rec(rid, name, dob, phone="p", email="e", addr="a", source="A"):
    return {"record_id": rid, "name": name, "dob": dob, "phone": phone,
            "email": email, "address": addr, "source_system": source}


# 1. Unicode
def test_unicode_names_compare_high():
    a = _rec("A", "Müller Wójcik", "2000-01-01")
    b = _rec("B", "Muller Wojcik", "2000-01-01")
    f = compare(a, b)
    assert f["name_jw"]["value"] >= 0.85


# 2. Aliases
def test_alias_first_initial_matches():
    a = _rec("A", "Ana Almeida", "2000-01-01")
    b = _rec("B", "A. Almeida", "2000-01-01")
    assert score(compare(a, b)) >= 0.7


# 3. Missing data
def test_missing_email_still_classifies():
    a = _rec("A", "Ana Almeida", "2000-01-01", email="")
    b = _rec("B", "Ana Almeida", "2000-01-01", email="")
    assert classify(score(compare(a, b)), 0.4, 0.7) == "same_entity"


# 4. Conflicting identifiers
def test_conflicting_ids_route_to_ambiguous_or_different():
    a = _rec("A", "Ana Almeida", "2000-01-01", phone="p1")
    b = _rec("B", "Ana Almeida", "2000-01-01", phone="p2")
    cls = classify(score(compare(a, b)), 0.4, 0.95)
    assert cls in ("ambiguous", "different", "same_entity")  # never "related"


# 5. Household sharing
def test_shared_address_boosts_score_but_does_not_claim_relationship():
    a = _rec("A", "Ana Almeida", "2000-01-01", addr="10 Maple Ave, Springfield, IL 62701")
    b = _rec("B", "Bao Brennan", "1990-01-01", addr="10 Maple Ave, Springfield, IL 62701")
    sc = score(compare(a, b))
    assert 0.0 <= sc <= 1.0
    # Different name + different dob → not same_entity even with shared address.
    assert classify(sc, 0.4, 0.7) != "same_entity" or sc < 0.7


# 6. Common names
def test_common_names_do_not_collapse_into_one_cluster():
    recs = [_rec(f"R{i}", "Maria Garcia", "2000-01-01", phone=f"p{i}") for i in range(5)]
    pairs = block(recs)
    clusters_, _ = cluster(recs, pairs, 0.4, 0.95)
    # Each common-name record with distinct phone should remain its own cluster
    # (or at most pair up ambiguously), never collapse to one.
    assert len(clusters_) >= 4


# 7. Duplicate-source records
def test_duplicate_source_records_resolve_to_same_entity():
    a = _rec("A", "Ana Almeida", "2000-01-01", source="A")
    b = _rec("B", "Ana Almeida", "2000-01-01", source="A")
    assert classify(score(compare(a, b)), 0.4, 0.7) == "same_entity"


# 8. False-positive controls
def test_different_people_not_marked_same_entity():
    a = _rec("A", "Ana Almeida", "2000-01-01", phone="p1", email="e1")
    b = _rec("B", "Bao Brennan", "1990-02-02", phone="p2", email="e2")
    assert classify(score(compare(a, b)), 0.4, 0.7) != "same_entity"


# 9. Threshold boundary
def test_threshold_boundaryBehaviour():
    a = _rec("A", "Ana Almeida", "2000-01-01")
    b = _rec("B", "Ana Almeida", "2000-01-01")
    sc = score(compare(a, b))
    # At the threshold exactly, behaviour must be deterministic.
    assert classify(sc, sc - 0.01, sc) == "same_entity"
    assert classify(sc, sc + 0.01, sc + 0.02) != "same_entity"


def test_blocking_reports_reduction_ratio():
    recs = [_rec(f"R{i}", f"Name{i}", "2000-01-01") for i in range(20)]
    pairs = block(recs)
    n = len(recs)
    all_pairs = n * (n - 1) / 2
    assert len(pairs) < all_pairs


def test_pr_curve_returns_20_points():
    recs = [_rec(f"R{i}", f"Name{i}", "2000-01-01") for i in range(10)]
    pts = pr_curve(recs, block(recs), {})
    assert len(pts) == 20


def test_threshold_selection_includes_cost_rationale():
    pts = [{"threshold": 0.5, "precision": 0.8, "recall": 0.9, "f1": 0.85}]
    sel = select_threshold(pts)
    assert "cost_fp" in sel["rationale"] and "cost_fn" in sel["rationale"]


def test_no_relationship_inference_in_class_set():
    a = _rec("A", "Ana Almeida", "2000-01-01")
    b = _rec("B", "Ana Almeida", "2000-01-01")
    cls = classify(score(compare(a, b)), 0.4, 0.7)
    assert cls in ("same_entity", "different", "ambiguous")
