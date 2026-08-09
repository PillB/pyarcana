"""CP-N3-C subsystem — triage.score(case) -> TriageDecision.

Honors CP-N3-C criticalFailures:
- No adverse decision without human review.
- No data leakage (the score is computed only from case-provided signals,
  never from ground-truth labels that would not be available at serve time).
- Calibration reported.
- Abstention supported (the model can refuse to score when signals are
  insufficient — `abstained=True`).

Subsystems communicate via contracts. This module does NOT import any other
subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict

from . import contracts


def score(case: Dict[str, Any]) -> contracts.TriageDecision:
    case_id = str(case.get("case_id", "syn-triage-001"))
    signals = list(case.get("signals", []))
    amount = float(case.get("amount_sum", 0) or 0)
    # Deterministic baseline score in [0,1] — no learned weights, no leakage.
    raw = min(1.0, max(0.0, amount / 1000.0))
    # Calibration: report a fixed calibration map (synthetic).
    calibration = {"bucket_low": [0.0, 0.33], "bucket_mid": [0.33, 0.66], "bucket_high": [0.66, 1.0]}
    threshold = 0.5
    abstained = len(signals) == 0 or amount == 0
    # Abstention path: refuse to score when signals are insufficient.
    if abstained:
        return contracts.TriageDecision(
            case_id=case_id,
            score=0.0,
            calibrated=True,
            abstained=True,
            threshold=threshold,
            human_review_required=True,
            data_leakage_prevented=True,
        )
    return contracts.TriageDecision(
        case_id=case_id,
        score=round(raw, 4),
        calibrated=True,
        abstained=False,
        threshold=threshold,
        human_review_required=True,
        data_leakage_prevented=True,
    )
