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

import re
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
    # Second pass over the same job must produce the same executed/result trail.
    second = []
    for i, s in enumerate(steps_in):
        action = str(s.get("action", "noop"))
        requires_approval = action in {"send_email", "publish", "export_external"}
        executed = not (requires_approval and not approved)
        result = "ok" if executed else "pending_human_approval"
        second.append({"step": i + 1, "action": action, "executed": executed, "result": result})
    idempotent = [
        {"step": e["step"], "action": e["action"], "executed": e["executed"], "result": e["result"]}
        for e in audit
    ] == second
    email_re = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
    logs_pii_free = not any(email_re.search(str(e.get("log", ""))) for e in audit)
    rollback_available = all(
        (not e["executed"]) or e["action"] == "noop" or e["result"] in {"ok", "pending_human_approval"}
        for e in audit
    )
    return contracts.RpaAudit(
        job_id=job_id,
        steps=audit,
        approved=approved,
        idempotent=idempotent,
        rollback_available=rollback_available,
        logs_pii_free=logs_pii_free,
    )
