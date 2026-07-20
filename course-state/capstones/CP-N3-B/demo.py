#!/usr/bin/env python3
"""CP-N3-B — Relationship Investigation Workbench (synthetic graph)."""
from __future__ import annotations
import json
import sys
from collections import deque

CAPSTONE_ID = "CP-N3-B"

# Undirected evidence graph — edge weight = evidence strength, NOT guilt
NODES = ["N1", "N2", "N3", "N4", "N5"]
EDGES = [
    ("N1", "N2", 0.9, "shared_org_synthetic"),
    ("N2", "N3", 0.7, "geo_proximity_synthetic"),
    ("N3", "N4", 0.6, "txn_counterparty_synthetic"),
    ("N1", "N5", 0.4, "email_domain_synthetic"),
    ("N5", "N4", 0.5, "phone_block_synthetic"),
]


def build_adj(edges):
    adj = {n: [] for n in NODES}
    for u, v, w, reason in edges:
        adj[u].append((v, w, reason))
        adj[v].append((u, w, reason))
    return adj


def shortest_path(adj, src, dst):
    q = deque([(src, [src], [], 0.0)])
    seen = {src}
    while q:
        node, path, reasons, score = q.popleft()
        if node == dst:
            return path, reasons, score
        for nb, w, reason in adj[node]:
            if nb not in seen:
                seen.add(nb)
                q.append((nb, path + [nb], reasons + [reason], score + w))
    return None, [], 0.0


def minimize_fields(entity_id: str) -> dict:
    return {"id": entity_id, "display": f"Entity-{entity_id}", "pii_fields": []}


def main() -> int:
    adj = build_adj(EDGES)
    path, reasons, score = shortest_path(adj, "N1", "N4")
    assert path is not None
    path2, _, _ = shortest_path(adj, "N1", "N1")
    assert path2 == ["N1"]
    disconnected_path, _, _ = shortest_path({"X": [], "Y": []}, "X", "Y")
    # work on empty-ish: ensure no crash
    cases = [
        {
            "case_id": "CASE-SYN-01",
            "query": {"from": "N1", "to": "N4"},
            "path": path,
            "evidence_reasons": reasons,
            "path_evidence_sum": round(score, 4),
            "entities_minimized": [minimize_fields(x) for x in path],
            "interpretation": "Evidence path for human investigation only",
        }
    ]
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "n_nodes": len(NODES),
        "n_edges": len(EDGES),
        "paths_found": 1 if path else 0,
        "mean_path_len": float(len(path)) if path else 0.0,
        "case": cases[0],
        "disclaimer": "Path evidence ≠ collusion/fraud",
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} Graph OK — path={' → '.join(path)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
