"""CP-N1-C subsystem — cp_n1_c.review(case) -> ReviewPacket, as JSON-friendly lists.

Calls the interface CP-N1-C publishes (see upstream.py): identity, relationship and decision
in separate layers, S13's decision matrix on the ER alone, risk_decisions always empty and
kinship_verdict always None. Honors the CP-N1-C criticalFailures:
- Does NOT infer fraud or kinship.
- Does not mix the relationship score into the identity decision.
- A person reviews and can correct: correction_mechanism is True only after a correction on a
  copy is logged, leaves the original unchanged, and an empty reason is refused.
- Privacy sheet present; the queue shows pseudonyms.

Does NOT import any other subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict

from . import contracts, upstream


def _correction_works(ref, packet) -> bool:
    if not packet.decisions:
        return False
    pair_id = packet.decisions[0]["pair_id"]
    corrected = ref.apply_correction(packet, pair_id, "needs_review", "comprobación de CP-FINAL")
    try:
        ref.apply_correction(packet, pair_id, "needs_review", " ")
        refused_empty = False
    except ValueError:
        refused_empty = True
    return (refused_empty and packet.corrections == () and len(corrected.corrections) == 1
            and corrected.corrections[0]["pair_id"] == pair_id)


def review(case: Dict[str, Any]) -> contracts.ReviewPacket:
    """Review the case with CP-N1-C and return its packet as a contract object."""
    ref = upstream.load("CP-N1-C")
    packet = ref.review(case)
    return contracts.ReviewPacket(
        case_id=packet.case_id,
        rules_version=packet.rules_version,
        entity_evidence=[dict(e) for e in packet.entity_evidence],
        relationship_evidence=[dict(r) for r in packet.relationship_evidence],
        decisions=[dict(d) for d in packet.decisions],
        risk_decisions=[dict(r) for r in packet.risk_decisions],
        review_queue=[dict(q) for q in packet.review_queue],
        privacy_sheet=dict(packet.privacy_sheet),
        human_review_required=packet.human_review_required is True,
        correction_mechanism=_correction_works(ref, packet),
    )
