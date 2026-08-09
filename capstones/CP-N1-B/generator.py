"""CP-N1-B — deterministic synthetic ETL data generator.

Extends CP-N1-A's clients with synthetic transactions (amounts, timestamps,
merchant categories) and intentional malformed rows for the quarantine path.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import random
import string

SEED = 20240108

MERCHANT_CATEGORIES = ["groceries", "utilities", "dining", "travel", "retail", "health", "transport"]
CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD"]


def _clients(rng: random.Random, n: int = 100) -> list[dict]:
    out: list[dict] = []
    first = ["Ana", "Bao", "Caleb", "Daria", "Esma", "Farid", "Gita", "Hiro"]
    last = ["Almeida", "Brennan", "Castellanos", "Dvořák", "Eze", "Fernández"]
    for i in range(1, n + 1):
        out.append({
            "client_id": f"ACME-{i:05d}",
            "name": f"{rng.choice(first)} {rng.choice(last)}",
            "dob": f"{rng.randint(1940, 2005):04d}-{rng.randint(1,12):02d}-{rng.randint(1,28):02d}",
            "region": rng.choice(["NA", "EU", "APAC", "LATAM"]),
        })
    return out


def _txns(rng: random.Random, clients: list[dict], n: int = 1000) -> list[dict]:
    out: list[dict] = []
    for i in range(1, n + 1):
        c = rng.choice(clients)
        out.append({
            "txn_id": f"TXN-{i:07d}",
            "client_id": c["client_id"],
            "amount": round(rng.uniform(1.0, 500.0), 2),
            "currency": rng.choice(CURRENCIES),
            "timestamp": f"2024-{rng.randint(1,12):02d}-{rng.randint(1,28):02d}T{rng.randint(0,23):02d}:{rng.randint(0,59):02d}:{rng.randint(0,59):02d}Z",
            "merchant_id": f"M{rng.randint(1000, 9999)}",
            "merchant_category": rng.choice(MERCHANT_CATEGORIES),
        })
    return out


def _malformed(rng: random.Random, n: int = 50) -> list[dict]:
    out: list[dict] = []
    for i in range(1, n + 1):
        kind = i % 5
        if kind == 0:
            out.append({"txn_id": "", "client_id": "ACME-00001", "amount": 10.0, "currency": "USD",
                        "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M1", "merchant_category": "retail"})
        elif kind == 1:
            out.append({"txn_id": f"TXN-BAD{i}", "client_id": "ACME-00001", "amount": "not-a-number",
                        "currency": "USD", "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M1",
                        "merchant_category": "retail"})
        elif kind == 2:
            out.append({"txn_id": f"TXN-BAD{i}", "client_id": "ACME-00001", "amount": 10.0, "currency": "XXX",
                        "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M1", "merchant_category": "retail"})
        elif kind == 3:
            out.append({"txn_id": f"TXN-BAD{i}", "client_id": "ACME-00001", "amount": 10.0, "currency": "USD",
                        "timestamp": "not-a-timestamp", "merchant_id": "M1", "merchant_category": "retail"})
        else:
            out.append({"txn_id": f"TXN-BAD{i}", "client_id": "ACME-00001", "amount": 10.0, "currency": "USD",
                        "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M1", "merchant_category": "weapons"})
    return out


def write_outputs(clients: list[dict], txns: list[dict], malformed: list[dict], out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "clients.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(clients[0].keys()))
        w.writeheader()
        w.writerows(clients)
    all_txns = txns + malformed
    with open(os.path.join(out_dir, "transactions.json"), "w", encoding="utf-8") as f:
        json.dump(all_txns, f, ensure_ascii=False, indent=2)
    # small sample fixture
    sample = all_txns[:18]
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(sample, f, ensure_ascii=False, indent=2)


def main() -> None:
    ap = argparse.ArgumentParser(description="CP-N1-B synthetic ETL data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--clients", type=int, default=100)
    ap.add_argument("--txns", type=int, default=1000)
    ap.add_argument("--malformed", type=int, default=50)
    args = ap.parse_args()
    rng = random.Random(args.seed)
    clients = _clients(rng, args.clients)
    txns = _txns(rng, clients, args.txns)
    bad = _malformed(rng, args.malformed)
    write_outputs(clients, txns, bad, args.output)
    print(f"CP-N1-B generator: wrote {len(clients)} clients, {len(txns)} txns, {len(bad)} malformed to {args.output}")


if __name__ == "__main__":
    main()
