#!/usr/bin/env python3
"""CP-N4-C — Auditable AI Operations Copilot (multi-agent harness).

This is the thin entry point that drives the real harness in
``harness/``. It exercises every required mechanism end-to-end in the
deterministic no-key mode and prints a single ``METRICS_JSON: {...}`` line.
"""
from __future__ import annotations

import json
import os
import sys
from typing import Any, Dict, List

CAPSTONE_ID = "CP-N4-C"
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from harness import (  # noqa: E402
    Budget,
    CommercialModelAdapter,
    Copilot,
    KnowledgeBase,
    Doc,
    Task,
    ToolRegistry,
    Tracer,
    WebAdapter,
    versions,
    idempotency_key,
    run_holdout,
    HoldoutCase,
    evaluate_trajectory,
)


def _build_kb() -> KnowledgeBase:
    return KnowledgeBase([
        Doc("rollback", "Rollback restores the previous production model version after a gate failure.", acl=["*"]),
        Doc("pii", "Use synthetic data only in training demos; no real PII.", acl=["*"]),
        Doc("budget", "If cost or token budget is exceeded the run aborts with BudgetExceeded.", acl=["*"]),
        Doc("hitl", "Sensitive side effects (send_email, delete_records) require human approval.", acl=["*"]),
        Doc("internal-er", "Entity resolution scores are not fraud labels; require human review.", acl=["analyst"]),
    ])


def _exercise_tool_policies() -> List[Dict[str, Any]]:
    """Directly exercise the policy table for deny / require_human / unknown."""
    tools = ToolRegistry()
    audit: List[Dict[str, Any]] = []
    # deny
    audit.append(tools.call("delete_records", {"id": "X"}).to_dict())
    audit.append(tools.call("shell_exec", {"cmd": "rm -rf /"}).to_dict())
    # require_human without approval
    audit.append(tools.call("send_email", {"to": "a@example.test"}).to_dict())
    # require_human with approval
    audit.append(tools.call("send_email", {"to": "a@example.test"}, approved=True).to_dict())
    # unknown tool
    audit.append(tools.call("totally_unknown_tool", {}).to_dict())
    return audit


def main() -> int:
    versions.assert_package_version()
    if versions.EXPECTED_PACKAGE_VERSION != "3.0.0":
        print(f"ERROR: unexpected package version {versions.EXPECTED_PACKAGE_VERSION}", file=sys.stderr)
        return 2

    state_path = os.path.join(HERE, "run_state.json")
    if os.path.exists(state_path):
        os.remove(state_path)

    kb = _build_kb()
    budget = Budget(max_cost=1.0, max_tokens=20_000)
    copilot = Copilot(
        state_path=state_path,
        kb=kb,
        web=WebAdapter(),
        budget=budget,
    )

    # 1) Select model mode (LOCAL — deterministic, no key) and run a bounded task.
    record = copilot.run(Task(
        query="how to rollback a failed model gate",
        mode="LOCAL",
        principal="anon",
        max_steps=8,
        max_tool_calls=12,
    ))

    # 2) Demonstrate commercial TEST mode (no key, canned responses).
    commercial = CommercialModelAdapter(approved=False)
    commercial_resp = commercial.complete("plan: rollback", system="You are a Generator agent.")
    commercial_ok = "rollback" in commercial_resp.text.lower()

    # 3) Demonstrate commercial approved mode raises on missing key.
    missing_key_raised = False
    try:
        CommercialModelAdapter(approved=True).complete("ping")
    except Exception:
        missing_key_raised = True

    # 4) Exercise tool policies directly (deny / require_human / unknown).
    policy_audit = _exercise_tool_policies()

    # 5) Holdout evaluation over the KB.
    holdout = run_holdout(kb, [
        HoldoutCase("how to rollback a failed model gate", "rollback"),
        HoldoutCase("what is the pii policy for demos", "pii"),
        HoldoutCase("what happens when budget is exceeded", "budget"),
        HoldoutCase("when is human approval required", "hitl"),
    ])

    # 6) Trajectory evaluation of the run we just produced.
    trajectory = evaluate_trajectory(record.to_dict())

    # 7) Compose metrics.
    denied = sum(1 for e in policy_audit if e.get("result") == "denied")
    pending_human = sum(1 for e in policy_audit if e.get("result") == "pending_human_approval")
    executed = sum(1 for e in policy_audit if e.get("executed"))

    metrics: Dict[str, Any] = {
        "capstone_id": CAPSTONE_ID,
        "package_version": versions.EXPECTED_PACKAGE_VERSION,
        "status": "pass" if record.status == "COMPLETE" else record.status.lower(),
        "run_id": record.run_id,
        "mode": record.mode,
        "model_used": record.model_used,
        "fell_back_to_local": record.fell_back_to_local,
        "steps": len(record.steps),
        "tool_calls": len(record.tool_calls),
        "stop_reason": record.stop_reason,
        "citations": len(record.citations),
        "cited_doc_ids": [c["doc_id"] for c in record.citations],
        "final_answer_present": bool(record.final_answer),
        "final_answer_cited": ("doc_id=" in (record.final_answer or "")),
        "trace_spans": len(record.trace),
        "incidents": len(record.incidents),
        "budget": record.budget,
        "commercial_test_mode_ok": commercial_ok,
        "commercial_missing_key_raises": missing_key_raised,
        "policy_audit": {
            "n": len(policy_audit),
            "denied": denied,
            "pending_human": pending_human,
            "executed": executed,
            "events": policy_audit,
        },
        "holdout": {
            "n": holdout.n,
            "hits": holdout.hits,
            "score": holdout.score,
        },
        "trajectory": trajectory.to_dict(),
    }

    # Assertions — if any of these fail the demo exits non-zero.
    failures: List[str] = []
    if record.status != "COMPLETE":
        failures.append(f"run did not complete: status={record.status}")
    if not record.citations:
        failures.append("no citations on grounded answer")
    if "doc_id=" not in (record.final_answer or ""):
        failures.append("final answer not cited")
    if not commercial_ok:
        failures.append("commercial test mode did not produce a rollback answer")
    if not missing_key_raised:
        failures.append("approved commercial mode did not raise on missing key")
    denied_tools = {e["tool"] for e in policy_audit if e.get("result") == "denied"}
    if {"delete_records", "shell_exec", "totally_unknown_tool"} - denied_tools:
        failures.append(f"deny policy not enforced; denied={denied_tools}")
    if not any(e.get("result") == "pending_human_approval" for e in policy_audit):
        failures.append("send_email did not pause for HITL")
    if not any(e.get("tool") == "send_email" and e.get("executed") for e in policy_audit):
        failures.append("approved send_email did not execute")
    if holdout.score < 0.75:
        failures.append(f"holdout score too low: {holdout.score}")
    if not trajectory.ok:
        failures.append(f"trajectory not ok: {trajectory.to_dict()}")

    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(
        f"{CAPSTONE_ID} Copilot OK — status={record.status} "
        f"steps={len(record.steps)} citations={len(record.citations)} "
        f"holdout={holdout.score:.2f} trajectory_ok={trajectory.ok}"
    )

    if failures:
        for f in failures:
            print(f"FAILURE: {f}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
