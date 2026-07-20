#!/usr/bin/env python3
"""CP-N2-C — VP RPA + AI Analyst (synthetic flow with rollback)."""
from __future__ import annotations
import json
import sys
from copy import deepcopy

CAPSTONE_ID = "CP-N2-C"
STAGES = [
    "ingest_excel",
    "validate",
    "analyze",
    "draft_report",
    "human_approval",
    "email_draft",
    "completed",
]


def run_pipeline(fail_at: str | None = None) -> dict:
    state = {"stage": "start", "history": [], "artifacts": {}, "approved": False}
    snapshots = []
    for stage in STAGES:
        snapshots.append(deepcopy(state))
        if fail_at and stage == fail_at:
            state["stage"] = f"failed_at_{stage}"
            state["history"].append({"event": "fail", "stage": stage})
            # rollback to previous snapshot
            state = snapshots[-1]
            state["history"].append({"event": "rollback", "to": state["stage"]})
            state["rolled_back"] = True
            return state
        state["stage"] = stage
        state["history"].append({"event": "advance", "stage": stage})
        if stage == "ingest_excel":
            state["artifacts"]["rows"] = 12
        elif stage == "validate":
            state["artifacts"]["valid_rows"] = 11
            state["artifacts"]["invalid_rows"] = 1
        elif stage == "analyze":
            state["artifacts"]["insight"] = "segment_sme_growth_synthetic"
        elif stage == "draft_report":
            state["artifacts"]["report"] = "report_v1_synthetic.md"
        elif stage == "human_approval":
            state["approved"] = True
        elif stage == "email_draft":
            state["artifacts"]["email"] = {
                "to": "manager@example.test",
                "subject": "Informe sintético listo para revisión",
                "body": "Adjunto hallazgos sintéticos. No enviado.",
                "sent": False,
            }
    return state


def main() -> int:
    # Simulate failure + recovery then full success
    failed = run_pipeline(fail_at="analyze")
    assert failed.get("rolled_back") is True
    ok = run_pipeline(fail_at=None)
    assert ok["stage"] == "completed"
    assert ok["approved"] is True
    assert ok["artifacts"]["email"]["sent"] is False
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "pipeline_status": ok["stage"],
        "stages": STAGES,
        "approved": ok["approved"],
        "email_sent": ok["artifacts"]["email"]["sent"],
        "rollback_demo": True,
        "rollback_restored_stage": failed["stage"],
        "n_history_ok": len(ok["history"]),
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} RPA flow OK — status={ok['stage']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
