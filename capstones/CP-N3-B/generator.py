"""CP-N3-B — synthetic entities with planted direct and inferred links, timestamps
and authorisation scopes.

Schema: edge_id, src, dst, type, source, timestamp, direct/inferred, uncertainty,
authorisation_scope.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import json
import os
import random

SEED = 20240219
SCOPES = ["public", "internal", "restricted"]
EDGE_TYPES = [
    ("director_of", "company_role", "does not imply beneficial ownership"),
    ("shareholder_of", "ownership_stake", "does not imply control"),
    ("resident_at", "address_association", "does not imply household or kinship"),
    ("co_signatory", "document_co_signature", "does not imply agreement or conspiracy"),
    ("alias_of", "name_alias", "does not imply identity without ER confirmation"),
]


def generate(n_entities=3000, n_edges=10000, seed=SEED):
    rng = random.Random(seed)
    entities = [f"ACME-{i:05d}" for i in range(1, n_entities + 1)]
    edges = []
    for i in range(1, n_edges + 1):
        etype, meaning, non_meaning = rng.choice(EDGE_TYPES)
        src = rng.choice(entities)
        dst = rng.choice(entities)
        while dst == src:
            dst = rng.choice(entities)
        direct = rng.random() < 0.6
        edges.append({
            "edge_id": f"E-{i:06d}",
            "src": src,
            "dst": dst,
            "type": etype,
            "meaning": meaning,
            "non_meaning": non_meaning,
            "source": f"registry-{rng.randint(1, 5)}",
            "timestamp": f"20{rng.randint(10, 23):02d}-{rng.randint(1,12):02d}-{rng.randint(1,28):02d}",
            "direct": direct,
            "inferred": not direct,
            "uncertainty": round(rng.uniform(0.0, 0.5) if not direct else 0.0, 4),
            "authorisation_scope": rng.choice(SCOPES),
            "correction_path": "submit form CF-1 to the data steward; record is appended, not overwritten",
        })
    return edges


def write_outputs(edges, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "edges.json"), "w", encoding="utf-8") as f:
        json.dump(edges, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(edges[:18], f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N3-B synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--entities", type=int, default=3000)
    ap.add_argument("--edges", type=int, default=10000)
    args = ap.parse_args()
    edges = generate(args.entities, args.edges, args.seed)
    write_outputs(edges, args.output)
    print(f"CP-N3-B generator: wrote {len(edges)} edges to {args.output}")


if __name__ == "__main__":
    main()
