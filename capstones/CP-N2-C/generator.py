"""CP-N2-C — synthetic Excel/CSV inputs with planted validation cases and
synthetic recipient allowlist.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import random

SEED = 20240205
ALLOWLIST = [
    "ana.review@synthetic.example",
    "ben.ops@synthetic.example",
    "carol.audit@synthetic.example",
    "david.sec@synthetic.example",
]


def _runs(rng, n=100):
    out = []
    for i in range(1, n + 1):
        out.append({
            "run_id": f"R-{i:04d}",
            "input_hash": f"sha256:{rng.randint(10**8, 10**9):x}",
            "action": rng.choice(["summary_email", "escalation_email", "report_email"]),
            "status": "pending",
            "approver": "",
            "approved_at": "",
            "sent_at": "",
            "redacted_log": "",
            "recipient": rng.choice(ALLOWLIST) if i % 5 else f"stranger{i}@evil.example",
            "amount": round(rng.uniform(10, 1000), 2),
        })
    return out


def write_outputs(runs, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "runs.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(runs[0].keys()))
        w.writeheader()
        w.writerows(runs)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(runs[:18], f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "allowlist.json"), "w", encoding="utf-8") as f:
        json.dump(ALLOWLIST, f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N2-C synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--n", type=int, default=100)
    args = ap.parse_args()
    rng = random.Random(args.seed)
    runs = _runs(rng, args.n)
    write_outputs(runs, args.output)
    print(f"CP-N2-C generator: wrote {len(runs)} runs to {args.output}")


if __name__ == "__main__":
    main()
