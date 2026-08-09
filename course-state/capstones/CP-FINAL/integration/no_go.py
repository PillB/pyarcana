"""CP-FINAL — no-go condition evaluator.

If a CRITICAL subsystem fails (its contract is missing, the wrong type, or a
criticalFailure flag is violated), the platform returns NO-GO rather than
partial success. This module centralizes the rule so the platform and the
tests agree on what counts as a critical failure.

A subsystem is "critical" iff it appears in CRITICAL_SUBSYSTEMS (which is all
12 — every upstream capstone must succeed for the integration to be GO).
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

from . import contracts
from . import dependency_graph

#: All 12 upstream capstones are critical — partial success is forbidden.
CRITICAL_SUBSYSTEMS: List[str] = list(dependency_graph.UPSTREAM_CAPSTONES)

#: Per-capstone negative flags that, if True, indicate the contract was
#: violated. (Inverted sense: the contract field should be False.)
NEGATIVE_FLAGS: Dict[str, List[str]] = {
    "CP-N1-A": ["malformed_handled"],  # checked positively below
    "CP-N1-B": [],  # idempotent + quarantine are positive flags
    "CP-N1-C": ["human_review_required"],  # positive
    "CP-N2-A": ["reproducible"],  # positive
    "CP-N2-B": ["color_only_encoding", "hidden_denominators"],  # negatives
    "CP-N2-C": ["logs_pii_free", "rollback_available"],  # positive
    "CP-N3-A": ["inferred_relationships"],  # must be False
    "CP-N3-B": ["auto_fraud_labels"],  # must be False
    "CP-N3-C": ["data_leakage_prevented"],  # positive
    "CP-N4-A": ["secrets_embedded"],  # must be False
    "CP-N4-B": ["rollback_proven", "train_serve_consistent"],  # positive
    "CP-N4-C": ["steps_bounded", "traces_redacted"],  # positive
}

#: Positive (must-be-True) flags per capstone.
POSITIVE_FLAGS: Dict[str, List[str]] = {
    "CP-N1-A": ["malformed_handled"],
    "CP-N1-B": ["idempotent"],
    "CP-N1-C": ["human_review_required", "correction_mechanism"],
    "CP-N2-A": ["reproducible"],
    "CP-N2-B": ["accessible"],
    "CP-N2-C": ["idempotent", "rollback_available", "logs_pii_free"],
    "CP-N3-A": ["train_dev_test_split", "baseline_deterministic"],
    "CP-N3-B": ["direct_vs_inferred_distinguished", "authorization_enforced", "reproducible"],
    "CP-N3-C": ["calibrated", "data_leakage_prevented", "human_review_required"],
    "CP-N4-A": ["health_check_passed"],
    "CP-N4-B": ["rollback_available", "rollback_proven", "train_serve_consistent"],
    "CP-N4-C": ["steps_bounded", "rag_cited", "hitl_on_sensitive_effects", "traces_redacted", "rollback_available"],
}

#: Negative (must-be-False) flags per capstone.
MUST_BE_FALSE_FLAGS: Dict[str, List[str]] = {
    "CP-N2-B": ["color_only_encoding", "hidden_denominators"],
    "CP-N3-A": ["inferred_relationships"],
    "CP-N3-B": ["auto_fraud_labels"],
    "CP-N4-A": ["secrets_embedded"],
}


def evaluate(subsystem_results: Dict[str, Any]) -> Tuple[bool, str]:
    """Return (no_go: bool, reason: str).

    `no_go=True` means the integration MUST NOT be declared successful.
    """
    # 1. Every critical subsystem must be present.
    for cid in CRITICAL_SUBSYSTEMS:
        if cid not in subsystem_results:
            return True, f"missing critical subsystem: {cid}"
        result = subsystem_results[cid]
        if result is None:
            return True, f"critical subsystem returned None: {cid}"
        # 2. Type check against the declared contract.
        expected = contracts.expected_contract_type(cid)
        if not isinstance(result, expected):
            return True, f"{cid} returned {type(result).__name__}, expected {expected.__name__}"
        # 3. Version check.
        if getattr(result, "contract_version", None) != contracts.expected_contract_version(cid):
            return True, f"{cid} contract_version mismatch"
        # 4. Positive flags must be True.
        for flag in POSITIVE_FLAGS.get(cid, []):
            if not getattr(result, flag, False):
                return True, f"{cid}.{flag} must be True"
        # 5. Negative flags must be False.
        for flag in MUST_BE_FALSE_FLAGS.get(cid, []):
            if getattr(result, flag, True):
                return True, f"{cid}.{flag} must be False"
    return False, ""
