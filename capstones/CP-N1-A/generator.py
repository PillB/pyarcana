#!/usr/bin/env python3
"""CP-N1-A — Synthetic data generator.

Produces deterministic synthetic client records with planted validation
cases (missing fields, malformed dates, bad phones, invalid emails).
No real PII. Seeded for reproducibility.
"""
import json
import random
from pathlib import Path

FIRST_NAMES = ["Ana", "Bjorn", "Camila", "Dmitri", "Esi", "Farouk", "Gita", "Hiro", "Ingrid", "Joaquin"]
LAST_NAMES = ["Okafor", "Petrov", "Quispe", "Rossi", "Singh", "Tanaka", "Uber", "Vargas", "Wang", "Yilmaz"]
DOMAINS = ["synthetic.example", "example.org", "test.mail"]

def make_valid(i: int) -> dict:
    return {
        "client_id": f"ACME-{i:04d}",
        "name": f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
        "dob": f"{random.randint(1,28):02d}/{random.randint(1,12):02d}/{random.randint(1960,2005)}",
        "phone": f"+1-{random.randint(200,999)}-{random.randint(200,999)}-{random.randint(1000,9999)}",
        "email": f"user{i}@{random.choice(DOMAINS)}",
        "address": f"{random.randint(1,999)} Synthetic St, Testville",
    }

def make_invalid(i: int) -> dict:
    kind = i % 4
    rec = make_valid(i)
    if kind == 0: rec["dob"] = "31/13/1999"  # invalid month
    elif kind == 1: rec["phone"] = "123"  # too short
    elif kind == 2: rec["email"] = "not-an-email"
    elif kind == 3: del rec["client_id"]
    return rec

def main():
    import argparse
    p = argparse.ArgumentParser(description="CP-N1-A synthetic data generator")
    p.add_argument("--output", "-o", default="fixtures", help="Output directory")
    p.add_argument("--count", "-n", type=int, default=100, help="Total records")
    p.add_argument("--seed", "-s", type=int, default=42, help="Random seed")
    args = p.parse_args()
    random.seed(args.seed)
    n_invalid = args.count // 5
    n_valid = args.count - n_invalid
    records = [make_valid(i) for i in range(n_valid)] + [make_invalid(n_valid + i) for i in range(n_invalid)]
    random.shuffle(records)
    out_dir = Path(args.output); out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "sample.json").write_text(json.dumps({"records": records}, indent=2, ensure_ascii=False))
    print(f"Generated {len(records)} records ({n_valid} valid, {n_invalid} invalid) → {out_dir/'sample.json'}")

if __name__ == "__main__":
    main()
