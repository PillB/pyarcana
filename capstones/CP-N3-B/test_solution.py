"""CP-N3-B tests — six questions, path depth, authorisation, reproducibility, correction."""
from __future__ import annotations

import json
import os
import sys

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import (  # noqa: E402
    edges_meta, build_adj, all_paths, can_see, add_note, correct_edge, case_export, age_days,
)


def _edges():
    return [
        {"edge_id": "E1", "src": "A", "dst": "B", "type": "director_of",
         "meaning": "company_role", "non_meaning": "no ownership",
         "source": "registry-1", "timestamp": "2020-01-01",
         "direct": True, "inferred": False, "uncertainty": 0.0,
         "authorisation_scope": "internal",
         "correction_path": "submit form CF-1"},
        {"edge_id": "E2", "src": "B", "dst": "C", "type": "shareholder_of",
         "meaning": "ownership_stake", "non_meaning": "no control",
         "source": "registry-2", "timestamp": "2018-06-15",
         "direct": False, "inferred": True, "uncertainty": 0.3,
         "authorisation_scope": "restricted",
         "correction_path": "submit form CF-1"},
        {"edge_id": "E3", "src": "C", "dst": "D", "type": "resident_at",
         "meaning": "address_association", "non_meaning": "no kinship",
         "source": "registry-3", "timestamp": "2024-01-01",
         "direct": True, "inferred": False, "uncertainty": 0.0,
         "authorisation_scope": "public",
         "correction_path": "submit form CF-1"},
    ]


def test_every_edge_answers_six_questions():
    meta = edges_meta(_edges(), "internal")
    for e in meta:
        for q in ("source", "meaning", "non_meaning", "age_days", "authorisation", "correction_path"):
            assert q in e


def test_authorisation_filter_hides_restricted_from_internal():
    meta = edges_meta(_edges(), "internal")
    ids = {e["edge_id"] for e in meta}
    assert "E2" not in ids  # restricted, hidden from internal
    assert "E1" in ids
    assert "E3" in ids


def test_path_search_bounded_by_depth():
    meta = edges_meta(_edges(), "internal")
    adj = build_adj(meta)
    paths = all_paths(adj, "A", "D", max_depth=2, cap=5)
    # A→B is internal, B→C is restricted (filtered out), C→D is public.
    # So from A we can only reach B. No path to D.
    assert paths == []
    # Lower the threshold: with public scope, B→C is restricted, still filtered.
    # With restricted scope, B→C is visible and A→B→C→D is reachable.
    meta_r = edges_meta(_edges(), "restricted")
    adj_r = build_adj(meta_r)
    paths_r = all_paths(adj_r, "A", "D", max_depth=3, cap=5)
    assert any(p == ["A", "B", "C", "D"] for p in paths_r)


def test_direct_vs_inferred_distinguished():
    meta = edges_meta(_edges(), "restricted")
    by_id = {e["edge_id"]: e for e in meta}
    assert by_id["E1"]["direct"] is True and by_id["E1"]["inferred"] is False
    assert by_id["E2"]["direct"] is False and by_id["E2"]["inferred"] is True


def test_uncertainty_displayed():
    meta = edges_meta(_edges(), "restricted")
    by_id = {e["edge_id"]: e for e in meta}
    assert by_id["E2"]["uncertainty"] == 0.3


def test_no_fraud_label_in_output():
    meta = edges_meta(_edges(), "restricted")
    # The dashboard may NOT label an edge as fraud/kinship/collusion (positive
    # claim). It MAY mention those words in `non_meaning` (forbidden inference).
    for e in meta:
        for fld in ("type", "meaning"):
            assert "fraud" not in e[fld].lower()
            assert "collusion" not in e[fld].lower()


def test_correction_appends_does_not_overwrite():
    meta = edges_meta(_edges(), "internal")
    meta = correct_edge(meta, "E1", "raised uncertainty")
    e = next(x for x in meta if x["edge_id"] == "E1")
    assert e["corrections"][-1]["correction"] == "raised uncertainty"
    # original fields unchanged
    assert e["source"] == "registry-1"


def test_analyst_note_present_after_add():
    meta = edges_meta(_edges(), "internal")
    meta = add_note(meta, "E1", "reviewed")
    e = next(x for x in meta if x["edge_id"] == "E1")
    assert e["analyst_notes"][-1]["note"] == "reviewed"


def test_case_export_is_reproducible():
    meta = edges_meta(_edges(), "internal")
    export = case_export(meta, [["A", "B"]], scenario_id="case-99")
    assert export["scenario_id"] == "case-99"
    assert export["schema_version"] == "v1"
    assert export["reproducible_from"]


def test_can_see_scope_ranking():
    assert can_see("public", "public")
    assert can_see("public", "internal")
    assert not can_see("restricted", "internal")
    assert can_see("restricted", "restricted")


def test_age_days_is_deterministic():
    e = {"timestamp": "2020-01-01"}
    assert age_days(e) > 0
    assert age_days(e) == age_days(e)
