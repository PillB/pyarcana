"""CP-N1-A subsystem — cp_n1_a.run(records) -> dict, wrapped as an IntakeResult.

Calls the interface CP-N1-A publishes (see upstream.py) instead of reimplementing it, so the
rules are the 3.0.0 ones: a code per field (edad, region, monto_ingreso), the worst state wins,
and tasa_reject is None for an empty batch. Honors the CP-N1-A criticalFailures:
- Uses NO real PII (consumes the shared synthetic scenario).
- Denominators: n_total == n_accept + n_review + n_reject, checked here too.
- A malformed record never stops the batch: every record gets a state.

Does NOT import any other subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict, List

from . import contracts, upstream


def run(records: List[Dict[str, Any]]) -> contracts.IntakeResult:
    """Classify the records with CP-N1-A and return its summary as a contract object."""
    out = upstream.load("CP-N1-A").run(list(records))
    counted = out["n_accept"] + out["n_review"] + out["n_reject"]
    malformed_handled = len(out["results"]) == len(records) == out["n_total"] == counted
    return contracts.IntakeResult(
        results=[dict(r) for r in out["results"]],
        n_total=out["n_total"],
        n_accept=out["n_accept"],
        n_review=out["n_review"],
        n_reject=out["n_reject"],
        tasa_reject=out["tasa_reject"],
        malformed_handled=malformed_handled,
    )
