"""CP-N2-A — synthetic retail transaction dataset with planted missingness.

Schema: txn_id, client_id, amount, channel, segment, region, timestamp, missing_flag.
Planted missingness: MCAR (random), MAR (depends on channel), MNAR (high amounts
suppressed). Plus segment structure for comparisons.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import json
import os
import random

SEED = 20240122
CHANNELS = ["online", "in_store", "mobile", "call_center"]
SEGMENTS = ["low_value", "mid_value", "high_value"]
REGIONS = ["NA", "EU", "APAC", "LATAM"]


def _amount(rng, segment):
    if segment == "low_value":
        return round(rng.uniform(1, 50), 2)
    if segment == "mid_value":
        return round(rng.uniform(50, 500), 2)
    return round(rng.uniform(500, 5000), 2)


def generate(n=50000, seed=SEED):
    rng = random.Random(seed)
    rows = []
    for i in range(1, n + 1):
        segment = rng.choices(SEGMENTS, weights=[60, 30, 10])[0]
        channel = rng.choice(CHANNELS)
        amount = _amount(rng, segment)
        ts = f"2024-{rng.randint(1,12):02d}-{rng.randint(1,28):02d}T{rng.randint(0,23):02d}:00:00Z"
        missing_flag = "none"
        # MCAR: 2% of rows have region missing at random
        if rng.random() < 0.02:
            region = None
            missing_flag = "region_mcar"
        else:
            region = rng.choice(REGIONS)
        # MAR: call_center channel has 15% missing amount (depends on channel)
        if channel == "call_center" and rng.random() < 0.15:
            amount = None
            missing_flag = "amount_mar"
        # MNAR: very high amounts (>3000) suppressed 80% of the time
        if amount is not None and amount > 3000 and rng.random() < 0.8:
            amount = None
            missing_flag = "amount_mnar"
        rows.append({
            "txn_id": f"TXN-{i:07d}",
            "client_id": f"ACME-{rng.randint(1, 1000):05d}",
            "amount": amount,
            "channel": channel,
            "segment": segment,
            "region": region,
            "timestamp": ts,
            "missing_flag": missing_flag,
        })
    return rows


def write_outputs(rows, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "retail.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(rows[:18], f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N2-A synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--n", type=int, default=50000)
    args = ap.parse_args()
    rows = generate(args.n, args.seed)
    write_outputs(rows, args.output)
    print(f"CP-N2-A generator: wrote {len(rows)} rows to {args.output}")


if __name__ == "__main__":
    main()
