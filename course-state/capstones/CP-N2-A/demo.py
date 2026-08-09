#!/usr/bin/env python3
"""CP-N2-A — Executive Data Quality & EDA Portfolio (synthetic)."""
from __future__ import annotations
import json
import random
import statistics
import sys

CAPSTONE_ID = "CP-N2-A"
SEED = 42

try:
    import numpy as np
    HAS_NP = True
except ImportError:
    HAS_NP = False


def build_dataset(n: int = 100):
    rng = random.Random(SEED)
    rows = []
    for i in range(n):
        rows.append({
            "id": f"R{i:03d}",
            "segment": rng.choice(["retail", "sme", "corp"]),
            "amount": round(rng.uniform(10, 5000), 2) if rng.random() > 0.08 else None,
            "score": round(rng.uniform(0, 1), 3) if rng.random() > 0.05 else None,
        })
    return rows


def main() -> int:
    source_n = 100
    rows = build_dataset(source_n)
    n_rows = len(rows)
    null_amount = sum(1 for r in rows if r["amount"] is None)
    null_score = sum(1 for r in rows if r["score"] is None)
    amounts = [r["amount"] for r in rows if r["amount"] is not None]
    completeness = 1.0 - ((null_amount + null_score) / (2 * n_rows))
    null_rate = (null_amount + null_score) / (2 * n_rows)
    recon_delta = source_n - n_rows
    mean_amount = statistics.fmean(amounts) if amounts else 0.0
    if HAS_NP:
        arr = np.array(amounts, dtype=float)
        p50 = float(np.median(arr))
        np_note = "numpy"
    else:
        p50 = statistics.median(amounts) if amounts else 0.0
        np_note = "stdlib_fallback"
    by_seg = {}
    for r in rows:
        by_seg.setdefault(r["segment"], 0)
        by_seg[r["segment"]] += 1
    memo = (
        f"Memo ejecutivo (sintético): {n_rows} filas; completitud {completeness:.1%}; "
        f"monto medio {mean_amount:.2f}; mediana {p50:.2f}. "
        f"Limitación: datos sintéticos seed={SEED}; no extrapolar a mercado real."
    )
    assert recon_delta == 0
    assert 0 <= completeness <= 1
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "n_rows": n_rows,
        "completeness": round(completeness, 4),
        "null_rate": round(null_rate, 4),
        "recon_delta": recon_delta,
        "mean_amount": round(mean_amount, 2),
        "p50_amount": round(p50, 2),
        "by_segment": by_seg,
        "engine": np_note,
        "executive_memo": memo,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} EDA OK — completeness={completeness:.2%}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
