#!/usr/bin/env python3
"""CP-N1-A — Client Intake & Data Quality Script (synthetic reference demo).

Contract, the same as the S04 You Do (intake_quality_batch.py):
- Each record is {"edad", "region", "monto_ingreso", "raw_line"}.
- Each field gets accept, review or reject; the record takes the worst state
  (reject beats review, review beats accept).
- The batch summary has n_total, n_accept, n_reject, n_review and tasa_reject,
  where tasa_reject = n_reject / n_total, and None when the batch is empty.
"""
from __future__ import annotations

import dataclasses
import json
import sys
from decimal import Decimal
from typing import Any

CAPSTONE_ID = "CP-N1-A"
REGIONES_PERMITIDAS = ("R-NORTE", "R-SUR", "R-CENTRO", "R-COSTA")

# Synthetic only. Each row shows one rule of the contract; no real data.
RECORDS = [
    {"edad": 30, "region": "R-NORTE", "monto_ingreso": Decimal("0.00"), "raw_line": "30|R-NORTE|0"},
    {"edad": None, "region": "R-SUR", "monto_ingreso": 10, "raw_line": "|R-SUR|10"},
    {"edad": 25, "region": "R-CENTRO", "monto_ingreso": -1, "raw_line": "25|R-CENTRO|-1"},
    {"edad": 40, "region": "R-FUERA", "monto_ingreso": 100, "raw_line": "40|R-FUERA|100"},
]


def estado_edad(edad: Any) -> str:
    if edad is None:
        return "review"
    if not isinstance(edad, int) or isinstance(edad, bool):
        return "reject"
    if edad < 0 or edad > 120:
        return "reject"
    if edad < 18:
        return "review"
    return "accept"


def estado_region(region: Any) -> str:
    if region is None:
        return "review"
    if region in REGIONES_PERMITIDAS:
        return "accept"
    return "review"


def estado_monto(monto: Any) -> str:
    if monto is None:
        return "review"
    if not (isinstance(monto, (int, Decimal))) or isinstance(monto, bool):
        return "reject"
    if isinstance(monto, Decimal) and not monto.is_finite():
        return "reject"  # NaN or Infinity: not an amount, and `<` on a NaN would stop the batch
    if monto < 0:
        return "reject"
    if monto > 50000:
        return "review"
    return "accept"  # zero is a valid amount


def classify(row: dict) -> str:
    """Record state: reject if any field rejects, review if any field needs review, else accept."""
    estados = (
        estado_edad(row.get("edad")),
        estado_region(row.get("region")),
        estado_monto(row.get("monto_ingreso")),
    )
    if "reject" in estados:
        return "reject"
    if "review" in estados:
        return "review"
    return "accept"


@dataclasses.dataclass(frozen=True)
class IntakeResult:
    results: list
    n_total: int
    n_accept: int
    n_reject: int
    n_review: int
    tasa_reject: float | None


def run(records: list) -> IntakeResult:
    results = [{"raw_line": r.get("raw_line"), "estado": classify(r)} for r in records]
    n_total = len(results)
    n_accept = sum(1 for x in results if x["estado"] == "accept")
    n_reject = sum(1 for x in results if x["estado"] == "reject")
    n_review = sum(1 for x in results if x["estado"] == "review")
    tasa_reject = n_reject / n_total if n_total else None
    return IntakeResult(results, n_total, n_accept, n_reject, n_review, tasa_reject)


def main() -> int:
    res = run(RECORDS)
    assert res.n_total == res.n_accept + res.n_reject + res.n_review
    assert res.n_reject >= 1 and res.n_accept >= 1
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "n_total": res.n_total,
        "n_accept": res.n_accept,
        "n_reject": res.n_reject,
        "n_review": res.n_review,
        "tasa_reject": None if res.tasa_reject is None else round(res.tasa_reject, 4),
        "results": res.results,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    rate = "n/a" if res.tasa_reject is None else f"{res.tasa_reject:.2%}"
    print(f"{CAPSTONE_ID} demo OK — tasa_reject={rate}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
