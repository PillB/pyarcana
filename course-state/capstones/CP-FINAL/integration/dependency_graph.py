"""CP-FINAL — dependency graph for the 12 upstream capstones.

Encodes the canonical edges declared in
`capstone_validation/architecture/capstone_dependency_graph.json` and exposes
`get_graph()` returning a topological order in which CP-FINAL itself runs LAST
(after every upstream dependency has produced its contract).
"""
from __future__ import annotations

from typing import Dict, List, Tuple

#: The 12 upstream capstones in canonical level order.
UPSTREAM_CAPSTONES: List[str] = [
    "CP-N1-A", "CP-N1-B", "CP-N1-C",
    "CP-N2-A", "CP-N2-B", "CP-N2-C",
    "CP-N3-A", "CP-N3-B", "CP-N3-C",
    "CP-N4-A", "CP-N4-B", "CP-N4-C",
]

#: Directed edges (from -> to). Mirrors the dependency graph in
#: `capstone_validation/architecture/capstone_dependency_graph.json` for the
#: upstream chain. CP-FINAL integrates them all.
EDGES: List[Tuple[str, str]] = [
    ("CP-N1-A", "CP-N1-B"),
    ("CP-N1-A", "CP-N1-C"),
    ("CP-N1-B", "CP-N1-C"),
    ("CP-N1-C", "CP-N2-A"),
    ("CP-N2-A", "CP-N2-B"),
    ("CP-N2-B", "CP-N2-C"),
    ("CP-N2-C", "CP-N3-A"),
    ("CP-N3-A", "CP-N3-B"),
    ("CP-N3-B", "CP-N3-C"),
    ("CP-N3-C", "CP-N4-A"),
    ("CP-N4-A", "CP-N4-B"),
    ("CP-N4-A", "CP-N4-C"),
    ("CP-N4-B", "CP-N4-C"),
]


def get_graph() -> Dict[str, object]:
    """Return the dependency graph as a serializable dict.

    `topological_order` lists the 12 upstream capstones in dependency order,
    followed by CP-FINAL itself. The platform runs each subsystem in this
    order so that, given a shared scenario, every contract is produced before
    any consumer would (in principle) read it.
    """
    return {
        "version": "1.0.0",
        "nodes": [
            {"id": cid, "level": _level_of(cid), "is_final": cid == "CP-FINAL"}
            for cid in UPSTREAM_CAPSTONES + ["CP-FINAL"]
        ],
        "edges": [{"from": a, "to": b, "type": "depends_on"} for a, b in EDGES]
                + [{"from": cid, "to": "CP-FINAL", "type": "final_integrates"} for cid in UPSTREAM_CAPSTONES],
        "topological_order": _topological_order(),
        "upstream_count": len(UPSTREAM_CAPSTONES),
    }


def _level_of(cid: str) -> int:
    if cid == "CP-FINAL":
        return 4
    # cid like "CP-N1-A" -> level 1; "CP-N4-C" -> level 4.
    parts = cid.split("-")
    if len(parts) < 2:
        return 0
    level_token = parts[1]  # e.g. "N1"
    digits = "".join(ch for ch in level_token if ch.isdigit())
    return int(digits) if digits else 0


def _topological_order() -> List[str]:
    # Kahn's algorithm — deterministic (sorted adjacency).
    nodes = list(UPSTREAM_CAPSTONES) + ["CP-FINAL"]
    indeg: Dict[str, int] = {n: 0 for n in nodes}
    adj: Dict[str, List[str]] = {n: [] for n in nodes}
    for a, b in EDGES:
        adj[a].append(b)
        indeg[b] += 1
    # CP-FINAL depends on all 12 upstream capstones.
    for cid in UPSTREAM_CAPSTONES:
        adj[cid].append("CP-FINAL")
        indeg["CP-FINAL"] += 1
    queue = sorted([n for n in nodes if indeg[n] == 0])
    order: List[str] = []
    while queue:
        n = queue.pop(0)
        order.append(n)
        for m in sorted(adj[n]):
            indeg[m] -= 1
            if indeg[m] == 0:
                queue.append(m)
        queue.sort()
    if len(order) != len(nodes):
        raise RuntimeError("dependency cycle detected in CP-FINAL graph")
    return order


def upstream_order() -> List[str]:
    """Return the 12 upstream capstones in topological order (CP-FINAL excluded)."""
    order = _topological_order()
    return [c for c in order if c != "CP-FINAL"]
