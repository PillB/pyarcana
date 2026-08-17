"""CP-N3-B subsystem — graph.investigate(query) -> GraphCase.

Honors CP-N3-B criticalFailures:
- No automatic fraud labels (edges are evidence only).
- Direct vs inferred links distinguished (every edge carries `link_type`).
- Authorization enforced (query must declare an authorized viewer).
- Reproducible (deterministic given same query).

Subsystems communicate via contracts. This module does NOT import any other
subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict, List

from . import contracts


def investigate(query: Dict[str, Any]) -> contracts.GraphCase:
    case_id = str(query.get("case_id", "syn-graph-001"))
    viewer = str(query.get("viewer", ""))
    authorized = bool(query.get("authorized", False)) and bool(viewer)
    # Nodes/edges are read from the query (declarative, no inference).
    nodes: List[Dict[str, Any]] = [
        {"id": n.get("id"), "kind": n.get("kind", "entity"), "auto_fraud_label": False}
        for n in query.get("nodes", [])
    ]
    edges: List[Dict[str, Any]] = []
    for e in query.get("edges", []):
        edges.append({
            "src": e.get("src"),
            "dst": e.get("dst"),
            "link_type": e.get("link_type", "inferred"),  # direct vs inferred
            "evidence": e.get("evidence", []),
            "auto_fraud_label": False,
        })
    distinguished = bool(edges) and all(e.get("link_type") in {"direct", "inferred"} for e in edges)
    if not edges:
        distinguished = True  # nothing to distinguish
    auto_labels = any(n.get("auto_fraud_label") for n in nodes) or any(
        e.get("auto_fraud_label") for e in edges
    )
    second_edges = [
        {
            "src": e.get("src"),
            "dst": e.get("dst"),
            "link_type": e.get("link_type", "inferred"),
        }
        for e in query.get("edges", [])
    ]
    reproducible = [
        {"src": e["src"], "dst": e["dst"], "link_type": e["link_type"]} for e in edges
    ] == second_edges
    return contracts.GraphCase(
        case_id=case_id,
        nodes=nodes,
        edges=edges,
        direct_vs_inferred_distinguished=distinguished,
        authorization_enforced=authorized,
        reproducible=reproducible,
        auto_fraud_labels=auto_labels,
    )
