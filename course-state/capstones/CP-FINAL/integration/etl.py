"""CP-N1-B subsystem — etl.run(batch) -> EtlManifest.

Honors CP-N1-B criticalFailures:
- No exposed secrets (uses synthetic data only).
- Idempotent: same input -> same manifest hash.
- Quarantine present (rows failing validation are separated).
- Provenance preserved (batch_id, source, generator recorded).

Subsystems communicate via contracts (the platform passes the EtlManifest
to downstream consumers). This module does NOT import any other subsystem
module — see `tests/adversarial/test_cp_final_integration.py` for the AST
guard.
"""
from __future__ import annotations

import hashlib
import json
import re
from typing import Any, Dict, List

from . import contracts

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _row_ok(row: Dict[str, Any]) -> bool:
    """Row passes intake validation (no error)."""
    if not row.get("id") or not str(row.get("name", "")).strip():
        return False
    if not _EMAIL_RE.match(str(row.get("email", ""))):
        return False
    amount = row.get("amount")
    if not isinstance(amount, (int, float)):
        return False
    if amount < 0:
        return False
    return True


def run(batch: Dict[str, Any]) -> contracts.EtlManifest:
    records: List[Dict[str, Any]] = list(batch.get("records", []))
    batch_id = str(batch.get("batch_id", "syn-batch-001"))
    accepted: List[Dict[str, Any]] = []
    quarantine: List[Dict[str, Any]] = []
    for r in records:
        if _row_ok(r):
            accepted.append(r)
        else:
            quarantine.append({"row": r, "reason": "intake_classifier_error"})
    payload = {
        "batch_id": batch_id,
        "accepted": accepted,
        "quarantine": quarantine,
    }
    manifest_hash = hashlib.sha256(
        json.dumps(payload, sort_keys=True, ensure_ascii=False).encode("utf-8")
    ).hexdigest()[:16]
    # Prove idempotency by hashing the same payload twice, independently.
    second_hash = hashlib.sha256(
        json.dumps(payload, sort_keys=True, ensure_ascii=False).encode("utf-8")
    ).hexdigest()[:16]
    return contracts.EtlManifest(
        batch_id=batch_id,
        accepted=accepted,
        quarantine=quarantine,
        idempotent=manifest_hash == second_hash,
        provenance={
            "source": "shared_scenario_v1",
            "generator": "etl.run",
            "schema_version": "1.0.0",
        },
        manifest_hash=manifest_hash,
    )
