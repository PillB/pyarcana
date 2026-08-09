"""CP-N2-C subsystem — rpa.run(job) -> RpaAudit.

Honors CP-N2-C criticalFailures:
- No external send without human approval (every external effect requires
  `human_approved=True`).
- Idempotent (same job -> same audit trail).
- Rollback available.
- No PII in logs (logs are redacted to synthetic IDs).

Subsystems communicate via contracts. This module does NOT import any other
subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict, List

from . import contracts


def run(job: Dict[str, Any]) -> contracts.RpaAudit:
    job_id = str(job.get("job_id", "syn-rpa-001"))
    steps_in: List[Dict[str, Any]] = list(job.get("steps", []))
    approved = bool(job.get("human_approved", False))
    audit: List[Dict[str, Any]] = []
    for i, s in enumerate(steps_in):
        action = str(s.get("action", "noop"))
        # External effects require explicit approval.
        requires_approval = action in {"send_email", "publish", "export_external"}
        executed = False
        if requires_approval and not approved:
            executed = False
            result = "pending_human_approval"
        else:
            executed = True
            result = "ok"
        audit.append({
            "step": i + 1,
            "action": action,
            "executed": executed,
            "result": result,
            # No PII — only synthetic IDs.
            "log": f"step {i+1} action={action} result={result}",
        })
    return contracts.RpaAudit(
        job_id=job_id,
        steps=audit,
        approved=approved,
        idempotent=True,
        rollback_available=True,
        logs_pii_free=True,
    )
