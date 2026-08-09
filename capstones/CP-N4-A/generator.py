"""CP-N4-A — synthetic API clients and request fixtures.

Schema: request_id, client_id, scope, endpoint, status, latency_ms, redacted_log.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import json
import os
import random

SEED = 20240304
ENDPOINTS = ["/service/v1/ingest", "/service/v1/resolve", "/service/v1/score"]
SCOPES = ["read", "write", "admin"]


def generate(n=1000, seed=SEED):
    rng = random.Random(seed)
    out = []
    for i in range(1, n + 1):
        out.append({
            "request_id": f"REQ-{i:06d}",
            "client_id": f"CLI-{rng.randint(1, 50):03d}",
            "scope": rng.choice(SCOPES),
            "endpoint": rng.choice(ENDPOINTS),
            "status": rng.choices([200, 400, 401, 403, 429], weights=[80, 5, 5, 5, 5])[0],
            "latency_ms": rng.randint(5, 500),
            "redacted_log": "client_id=CLI-XXX action=call status=" + str(rng.choices([200, 400, 401, 403, 429], weights=[80, 5, 5, 5, 5])[0]),
        })
    return out


def write_outputs(rows, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "requests.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(rows[:18], f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N4-A synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--n", type=int, default=1000)
    args = ap.parse_args()
    rows = generate(args.n, args.seed)
    write_outputs(rows, args.output)
    print(f"CP-N4-A generator: wrote {len(rows)} requests to {args.output}")


if __name__ == "__main__":
    main()
