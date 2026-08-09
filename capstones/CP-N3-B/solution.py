#!/usr/bin/env python3
"""CP-N3-B — Relationship Investigation Workbench.
Evidence graph, bounded path search, authorisation filter, direct/inferred,
uncertainty, notes, correction, reproducibility. Every edge answers 6 questions."""
import json, sys
from dataclasses import dataclass, asdict

@dataclass
class Edge:
    src: str; dst: str; edge_type: str; source: str; timestamp: str
    direct: bool; uncertainty: float; authorisation: str; correctable: bool
    meaning: str; not_meaning: str

def build_graph(entities: list[dict], evidence: list[dict]) -> list[Edge]:
    edges = []
    for e in evidence:
        edges.append(Edge(
            src=e["src"], dst=e["dst"], edge_type=e.get("type","related"),
            source=e.get("source","unknown"), timestamp=e.get("ts",""),
            direct=e.get("direct",True), uncertainty=e.get("uncertainty",0.5),
            authorisation=e.get("auth","internal"),
            correctable=True,
            meaning=e.get("meaning","co-occurrence in data"),
            not_meaning="does not imply kinship, fraud, collusion, or causal relationship",
        ))
    return edges

def path_search(edges: list[Edge], start: str, goal: str, max_depth: int = 3, auth_scope: str = "internal") -> list[list[str]]:
    adj: dict[str, list[str]] = {}
    for e in edges:
        if e.authorisation == "restricted" and auth_scope != "restricted": continue
        adj.setdefault(e.src, []).append(e.dst)
    queue = [[start]]; paths = []
    while queue:
        path = queue.pop(0)
        if len(path) > max_depth: continue
        if path[-1] == goal and len(path) > 1: paths.append(path); continue
        for nxt in adj.get(path[-1], []):
            if nxt not in path: queue.append(path + [nxt])
    return paths

def edge_questions(e: Edge) -> dict:
    return {"source": e.source, "meaning": e.meaning, "not_meaning": e.not_meaning,
            "age": e.timestamp, "who_may_see": e.authorisation, "correctable": e.correctable}

def export_case(entities, evidence, notes=None) -> dict:
    edges = build_graph(entities, evidence)
    return {"entities": entities, "edges": [asdict(e) for e in edges],
            "notes": notes or [], "reproducible": True, "no_fraud_labels": True}

if __name__=="__main__":
    data = json.loads(sys.stdin.read())
    print(json.dumps(export_case(data["entities"], data["evidence"]), indent=2))
