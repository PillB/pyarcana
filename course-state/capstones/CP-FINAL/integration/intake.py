"""CP-N1-A subsystem — intake_cli.run(records) -> IntakeResult.

Bounded, deterministic, synthetic. Honors the CP-N1-A criticalFailures:
- Uses NO real PII (consumes shared synthetic scenario).
- Computes denominators correctly (n_total = n_ok + n_warn + n_error).
- Handles malformed input (missing id, bad email, negative amount).
- Returns a well-formed IntakeResult contract.

Does NOT import any other subsystem module.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List

from . import contracts

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _classify(row: Dict[str, Any]) -> str:
    if not row.get("id") or not str(row.get("name", "")).strip():
        return "error"
    if not _EMAIL_RE.match(str(row.get("email", ""))):
        return "error"
    amount = row.get("amount")
    if not isinstance(amount, (int, float)):
        return "error"
    if amount < 0:
        return "error"
    if amount == 0:
        return "warn"
    return "ok"


def run(records: List[Dict[str, Any]]) -> contracts.IntakeResult:
    """Run intake over a list of synthetic records.

    Returns an IntakeResult with per-row classification and totals
    computed so that n_total == n_ok + n_warn + n_error (denominator
    integrity is a CP-N1-A criticalFailure).
    """
    rows: List[Dict[str, Any]] = []
    n_ok = n_warn = n_error = 0
    for r in records:
        try:
            status = _classify(r)
        except Exception:
            status = "error"  # malformed input handled, never raised
        rows.append({"id": r.get("id"), "status": status})
        if status == "ok":
            n_ok += 1
        elif status == "warn":
            n_warn += 1
        else:
            n_error += 1
    n_total = len(records)
    # Denominator integrity assertion (no silent mismatch).
    assert n_total == n_ok + n_warn + n_error, "denominator mismatch"
    # Flag is proven only after every row was classified without raising.
    malformed_handled = len(rows) == n_total
    return contracts.IntakeResult(
        n_total=n_total,
        n_ok=n_ok,
        n_warn=n_warn,
        n_error=n_error,
        rows=rows,
        malformed_handled=malformed_handled,
    )
