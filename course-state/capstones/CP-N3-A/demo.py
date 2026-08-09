#!/usr/bin/env python3
"""CP-N3-A — Testable Entity Resolution Engine (synthetic labels)."""
from __future__ import annotations
import json
import sys
from itertools import combinations

CAPSTONE_ID = "CP-N3-A"

RECORDS = [
    {"id": "A1", "block": "LOPEZ", "name": "ana lopez demo", "email": "ana@example.test"},
    {"id": "A2", "block": "LOPEZ", "name": "ana l demo lopez", "email": "ana@example.test"},
    {"id": "B1", "block": "RUIZ", "name": "bruno ruiz", "email": "bruno@example.test"},
    {"id": "B2", "block": "RUIZ", "name": "bruno r ruiz", "email": "b.ruiz@example.test"},
    {"id": "C1", "block": "DIAZ", "name": "carla diaz", "email": "carla@example.test"},
]
# Gold matches (synthetic identity) — NOT fraud
GOLD = {frozenset(("A1", "A2")), frozenset(("B1", "B2"))}


def tokens(s: str) -> set[str]:
    return set(s.lower().replace(".", " ").split())


def compare(a: dict, b: dict) -> float:
    t = tokens(a["name"])
    u = tokens(b["name"])
    j = len(t & u) / len(t | u) if (t | u) else 0.0
    email_eq = 1.0 if a["email"] == b["email"] else 0.0
    return 0.65 * j + 0.35 * email_eq


def main() -> int:
    n = len(RECORDS)
    all_pairs = list(combinations(range(n), 2))
    blocked = [(i, j) for i, j in all_pairs if RECORDS[i]["block"] == RECORDS[j]["block"]]
    reduction = 1.0 - (len(blocked) / len(all_pairs)) if all_pairs else 0.0
    thr_match, thr_review = 0.75, 0.45
    preds_match = set()
    review = []
    for i, j in blocked:
        s = compare(RECORDS[i], RECORDS[j])
        pair = frozenset((RECORDS[i]["id"], RECORDS[j]["id"]))
        if s >= thr_match:
            preds_match.add(pair)
        elif s >= thr_review:
            review.append({"pair": sorted(pair), "score": round(s, 4)})
    tp = len(preds_match & GOLD)
    fp = len(preds_match - GOLD)
    fn = len(GOLD - preds_match)
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    assert len(blocked) < len(all_pairs)
    assert precision >= 0.5 and recall >= 0.5
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "n_records": n,
        "n_all_pairs": len(all_pairs),
        "n_blocked_pairs": len(blocked),
        "blocking_reduction": round(reduction, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "n_review_queue": len(review),
        "disclaimer": "Identity match candidates only; not fraud/kinship",
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} ER OK — P={precision:.2f} R={recall:.2f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
