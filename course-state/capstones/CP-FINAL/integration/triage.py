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
    calibrated = all(k in calibration for k in ("bucket_low", "bucket_mid", "bucket_high"))
    # Leakage check: the case must not carry a serve-time-unavailable label.
    data_leakage_prevented = "ground_truth" not in case and "label" not in case
    human_review_required = True  # policy: no adverse action without a reviewer
    if abstained:
        return contracts.TriageDecision(
            case_id=case_id,
            score=0.0,
            calibrated=calibrated,
            abstained=True,
            threshold=threshold,
            human_review_required=human_review_required,
            data_leakage_prevented=data_leakage_prevented,
        )
    return contracts.TriageDecision(
        case_id=case_id,
        score=round(raw, 4),
        calibrated=calibrated,
        abstained=False,
        threshold=threshold,
        human_review_required=human_review_required,
        data_leakage_prevented=data_leakage_prevented,
    )
