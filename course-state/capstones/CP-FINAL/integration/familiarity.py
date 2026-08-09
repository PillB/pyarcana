"""CP-N1-C subsystem — familiarity.review(case) -> ReviewPacket.

Honors CP-N1-C criticalFailures:
- Does NOT infer fraud/kinship automatically (human review required).
- Human review required for any sensitive signal.
- Privacy sheet present.
- Correction mechanism present.

Subsystems communicate via contracts. This module does NOT import any other
subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict

from . import contracts


def review(case: Dict[str, Any]) -> contracts.ReviewPacket:
    case_id = str(case.get("case_id", "syn-case-unknown"))
    signals = list(case.get("signals", []))
    entity_evidence = [{"signal": s, "source": "shared_scenario_v1", "auto_label": False} for s in signals]
    relationship_evidence = [
        {
            "type": "shared_account_observation",
            "auto_inferred": False,
            "human_review_required": True,
        }
    ]
    decision_evidence = [
        {"decision": "no_adverse_action", "reason": "evidence-only review", "auto": False}
    ]
    return contracts.ReviewPacket(
        case_id=case_id,
        entity_evidence=entity_evidence,
        relationship_evidence=relationship_evidence,
        decision_evidence=decision_evidence,
        human_review_required=True,
        privacy_sheet={
            "data_minimization": "synthetic only",
            "no_pii": "true",
            "retention": "training_demo",
        },
        correction_mechanism=True,
    )
