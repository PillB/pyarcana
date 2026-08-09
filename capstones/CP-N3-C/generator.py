"""CP-N3-C — synthetic case-triage dataset with a labelled outcome, subgroup
attributes and a temporal dimension.

Schema: case_id, features{...}, outcome, subgroup, timestamp, prediction,
probability, abstain.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import json
import os
import random

SEED = 20240226
SUBGROUPS = ["A", "B", "C", "D"]


def _features(rng, subgroup):
    # Plant subgroup B with a slightly higher base rate to test subgroup fairness.
    base = 0.30 if subgroup == "B" else 0.20
    f1 = rng.uniform(0, 1)
    f2 = rng.uniform(0, 1)
    f3 = rng.uniform(0, 1)
    p = 0.5 * f1 + 0.3 * f2 + 0.2 * f3
    if subgroup == "B":
        p += 0.1
    outcome = 1 if rng.random() < (base + p * 0.4) else 0
    return {"f1": round(f1, 4), "f2": round(f2, 4), "f3": round(f3, 4)}, outcome


def generate(n=30000, seed=SEED):
    rng = random.Random(seed)
    rows = []
    for i in range(1, n + 1):
        subgroup = rng.choices(SUBGROUPS, weights=[40, 30, 20, 10])[0]
        feats, outcome = _features(rng, subgroup)
        ts = f"2024-{rng.randint(1, 12):02d}-{rng.randint(1, 28):02d}"
        rows.append({
            "case_id": f"CASE-{i:06d}",
            "features": feats,
            "outcome": outcome,
            "subgroup": subgroup,
            "timestamp": ts,
            "prediction": None,
            "probability": None,
            "abstain": None,
        })
    return rows


def write_outputs(rows, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "cases.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(rows[:18], f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N3-C synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--n", type=int, default=30000)
    args = ap.parse_args()
    rows = generate(args.n, args.seed)
    write_outputs(rows, args.output)
    print(f"CP-N3-C generator: wrote {len(rows)} cases to {args.output}")


if __name__ == "__main__":
    main()
