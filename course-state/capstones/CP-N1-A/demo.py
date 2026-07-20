#!/usr/bin/env python3
"""CP-N1-A — Client Intake & Data Quality Script (synthetic demo)."""
from __future__ import annotations
import json
import re
import sys

CAPSTONE_ID = "CP-N1-A"

# Synthetic only — fictional IDs and names
RECORDS = [
    {"id": "C001", "name": "Ana Demo", "email": "ana.demo@example.test", "amount": 120.5},
    {"id": "C002", "name": "Bruno Sintetico", "email": "bruno@example.test", "amount": -3},
    {"id": "C003", "name": "", "email": "bad", "amount": 50},
    {"id": "C004", "name": "Carla Demo", "email": "carla.demo@example.test", "amount": 0},
    {"id": "C005", "name": "Diego Test", "email": "diego@example.test", "amount": 999.99},
    {"id": None, "name": "Sin ID", "email": "x@example.test", "amount": 10},
]

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def classify(row: dict) -> str:
    if not row.get("id") or not str(row.get("name", "")).strip():
        return "error"
    if not EMAIL_RE.match(str(row.get("email", ""))):
        return "error"
    amount = row.get("amount")
    if not isinstance(amount, (int, float)):
        return "error"
    if amount < 0:
        return "error"
    if amount == 0:
        return "warn"
    return "ok"


def main() -> int:
    results = [{"id": r.get("id"), "status": classify(r)} for r in RECORDS]
    n_total = len(results)
    n_ok = sum(1 for x in results if x["status"] == "ok")
    n_warn = sum(1 for x in results if x["status"] == "warn")
    n_error = sum(1 for x in results if x["status"] == "error")
    error_rate = n_error / n_total if n_total else 0.0
    assert n_total == 6
    assert n_error >= 1 and n_ok >= 1
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "n_total": n_total,
        "n_ok": n_ok,
        "n_warn": n_warn,
        "n_error": n_error,
        "error_rate": round(error_rate, 4),
        "results": results,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} demo OK — error_rate={error_rate:.2%}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
