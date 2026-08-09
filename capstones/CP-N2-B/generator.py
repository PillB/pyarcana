"""CP-N2-B — synthetic insights dataset derived from CP-N2-A's EDA portfolio.

Schema: metric_id, segment, value, denominator, source_rows[], freshness_ts.
Planted patterns: a colour-only encoding case, a misleading-axes case, a hidden
denominator case, and a stale result — for the automated report checks to catch.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import json
import os
import random

SEED = 20240129
SEGMENTS = ["low_value", "mid_value", "high_value"]


def generate(n=200, seed=SEED):
    rng = random.Random(seed)
    rows = []
    for i in range(1, n + 1):
        seg = rng.choice(SEGMENTS)
        denom = rng.randint(100, 1000)
        val = round(rng.uniform(0.05, 0.95) * denom)
        src_rows = [f"TXN-{rng.randint(1, 50000):07d}" for _ in range(rng.randint(1, 5))]
        rows.append({
            "metric_id": f"M-{i:04d}",
            "segment": seg,
            "value": val,
            "denominator": denom,
            "source_rows": src_rows,
            "freshness_ts": f"2024-{rng.randint(1, 12):02d}-{rng.randint(1, 28):02d}T00:00:00Z",
        })
    # Plant a colour-only case (no shape/label hint)
    rows.append({"metric_id": "M-COLOUR-ONLY", "segment": "high_value", "value": 50, "denominator": 100,
                 "source_rows": ["TXN-0000001"], "freshness_ts": "2024-06-01T00:00:00Z",
                 "encoding_hint": "colour_only"})
    # Plant a misleading-axes case (y-axis doesn't start at 0)
    rows.append({"metric_id": "M-MISLEADING-AXIS", "segment": "mid_value", "value": 95, "denominator": 100,
                 "source_rows": ["TXN-0000002"], "freshness_ts": "2024-06-01T00:00:00Z",
                 "y_axis_min": 90, "y_axis_max": 100})
    # Plant a hidden-denominator case (denominator = 0 / missing)
    rows.append({"metric_id": "M-HIDDEN-DENOM", "segment": "low_value", "value": 42, "denominator": 0,
                 "source_rows": ["TXN-0000003"], "freshness_ts": "2024-06-01T00:00:00Z"})
    # Plant a stale result (timestamp > 90 days ago relative to 2024-12-31)
    rows.append({"metric_id": "M-STALE", "segment": "low_value", "value": 5, "denominator": 100,
                 "source_rows": ["TXN-0000004"], "freshness_ts": "2024-01-01T00:00:00Z"})
    return rows


def write_outputs(rows, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(rows[:18], f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N2-B synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--n", type=int, default=200)
    args = ap.parse_args()
    rows = generate(args.n, args.seed)
    write_outputs(rows, args.output)
    print(f"CP-N2-B generator: wrote {len(rows)} metrics to {args.output}")


if __name__ == "__main__":
    main()
