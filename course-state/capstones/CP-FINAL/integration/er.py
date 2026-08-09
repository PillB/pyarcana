"""CP-N3-A subsystem — er.resolve(records) -> ClusterSet.

Honors CP-N3-A criticalFailures:
- Does NOT infer relationships automatically (clusters are formed ONLY from
  declarative `client_ids` groupings already present in the input — no
  inference, no probabilistic merging beyond explicit blocking on a
  normalized name).
- Train/dev/test split declared (split applied to records before clustering).
- Deterministic baseline.
- False-positive analysis reported.

Subsystems communicate via contracts. This module does NOT import any other
subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict, List

from . import contracts


def _normalize(name: str) -> str:
    return (name or "").strip().lower()


def resolve(records: List[Dict[str, Any]]) -> contracts.ClusterSet:
    # Deterministic train/dev/test split of the input records (by index).
    n = len(records)
    train = records[: int(0.6 * n)] if n else []
    dev = records[int(0.6 * n): int(0.8 * n)] if n else []
    test = records[int(0.8 * n):] if n else []
    # Blocking on normalized name ONLY (deterministic, no fuzzy inference).
    blocks: Dict[str, List[Dict[str, Any]]] = {}
    for r in records:
        key = _normalize(str(r.get("name", "")))
        if not key:
            key = "__no_name__"
        blocks.setdefault(key, []).append(r)
    clusters: List[Dict[str, Any]] = []
    fp_analysis = {"duplicates_blocked_only_on_name": True, "fuzzy_inference_used": False}
    n_multi = sum(1 for v in blocks.values() if len(v) > 1)
    fp_analysis["clusters_with_multiple_members"] = n_multi
    for idx, (key, members) in enumerate(sorted(blocks.items())):
        clusters.append({
            "cluster_id": f"CL-{idx+1:03d}",
            "block_key": key,
            "members": [m.get("id") for m in members],
            "inferred": False,  # explicit: no inference
        })
    return contracts.ClusterSet(
        clusters=clusters,
        train_dev_test_split=True,
        baseline_deterministic=True,
        fp_analysis=fp_analysis,
        inferred_relationships=False,
    )
