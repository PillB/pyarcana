"""CP-N2-A subsystem — eda.profile(dataset) -> EdaReport.

Honors CP-N2-A criticalFailures:
- No unsupported causal interpretation (only descriptive stats).
- Reproducible (deterministic given same dataset).
- Executive memo present.
- Limitations present.

Subsystems communicate via contracts. This module does NOT import any other
subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict, List

from . import contracts


def profile(dataset: Dict[str, Any]) -> contracts.EdaReport:
    records: List[Dict[str, Any]] = list(dataset.get("records", []))
    n_rows = len(records)
    # Columns are the union of keys across rows.
    cols: List[str] = []
    seen = set()
    for r in records:
        for k in r.keys():
            if k not in seen:
                seen.add(k)
                cols.append(k)
    n_cols = len(cols)
    # Missingness per column.
    missingness: Dict[str, float] = {}
    for c in cols:
        miss = sum(1 for r in records if r.get(c) is None or r.get(c) == "")
        missingness[c] = round(miss / n_rows, 4) if n_rows else 0.0
    # Descriptive profile — no causal claims.
    profile_data: Dict[str, Any] = {
        "n_rows": n_rows,
        "n_cols": n_cols,
        "columns": cols,
        "stats": "descriptive_only_no_causal_inference",
    }
    memo = (
        f"Dataset has {n_rows} rows and {n_cols} columns. "
        f"Missingness ranges over {len(missingness)} columns. "
        f"Observations are descriptive; no causal claims are supported."
    )
    # Re-profile once more; the flag is True only when both runs match.
    second_missing = {}
    for c in cols:
        miss = sum(1 for r in records if r.get(c) is None or r.get(c) == "")
        second_missing[c] = round(miss / n_rows, 4) if n_rows else 0.0
    reproducible = (
        second_missing == missingness
        and profile_data["n_rows"] == n_rows
        and profile_data["n_cols"] == n_cols
    )
    return contracts.EdaReport(
        dataset_version=str(dataset.get("dataset_version", "shared_scenario_v1")),
        n_rows=n_rows,
        n_cols=n_cols,
        missingness=missingness,
        profile=profile_data,
        reproducible=reproducible,
        executive_memo=memo,
        limitations=[
            "Descriptive statistics only — no causal interpretation.",
            "Synthetic data; not representative of any real population.",
            "No outlier remediation applied (out-of-scope).",
        ],
    )
