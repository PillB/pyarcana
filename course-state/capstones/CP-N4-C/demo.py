#!/usr/bin/env python3
"""CP-N4-C — Auditable AI Operations Copilot (policies + HITL + evals)."""
from __future__ import annotations
import json
import sys
from typing import Any

CAPSTONE_ID = "CP-N4-C"

TOOL_POLICY = {
    "search_docs": "allow",
    "summarize": "allow",
    "export_report": "allow",
    "send_email": "require_human",
    "delete_records": "deny",
    "shell_exec": "deny",
}

KB = {
    "rollback": "Rollback restores previous production model version after gate failure.",
    "er": "Entity resolution scores are not fraud labels; use human review.",
    "pii": "Use synthetic data only in training demos; no real PII.",
}


def retrieve(query: str) -> list[dict]:
    q = query.lower()
    hits = []
    for k, v in KB.items():
        if k in q or any(tok in v.lower() for tok in q.split()[:3]):
            hits.append({"doc_id": k, "text": v})
    if not hits:
        hits.append({"doc_id": "pii", "text": KB["pii"]})
    return hits


def run_tool(name: str, args: dict, human_approved: bool = False) -> dict[str, Any]:
    policy = TOOL_POLICY.get(name, "deny")
    event = {"tool": name, "policy": policy, "args": args, "executed": False}
    if policy == "deny":
        event["result"] = "denied"
        return event
    if policy == "require_human" and not human_approved:
        event["result"] = "pending_human_approval"
        return event
    if name == "search_docs":
        event["executed"] = True
        event["result"] = retrieve(args.get("q", ""))
    elif name == "summarize":
        event["executed"] = True
        event["result"] = {"summary": args.get("text", "")[:120]}
    elif name == "export_report":
        event["executed"] = True
        event["result"] = {"path": "synthetic_report.md"}
    elif name == "send_email":
        event["executed"] = True
        event["result"] = {"queued": True, "sent": False}
    else:
        event["result"] = "denied"
    return event


def eval_suite() -> dict:
    cases = [
        {"q": "how to rollback model", "expect_doc": "rollback"},
        {"q": "entity resolution limits", "expect_doc": "er"},
        {"q": "privacy pii rules", "expect_doc": "pii"},
    ]
    hits = 0
    for c in cases:
        docs = retrieve(c["q"])
        if any(d["doc_id"] == c["expect_doc"] for d in docs):
            hits += 1
    return {"n": len(cases), "hits": hits, "score": hits / len(cases)}


def main() -> int:
    audit = []
    audit.append(run_tool("search_docs", {"q": "rollback model"}))
    audit.append(run_tool("delete_records", {"id": "X"}))
    audit.append(run_tool("send_email", {"to": "a@example.test"}))
    audit.append(run_tool("send_email", {"to": "a@example.test"}, human_approved=True))
    audit.append(run_tool("unknown_tool", {}))
    ev = eval_suite()
    assert audit[1]["result"] == "denied"
    assert audit[2]["result"] == "pending_human_approval"
    assert audit[3]["executed"] is True
    assert ev["score"] >= 2 / 3
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "audit_events": len(audit),
        "denied": sum(1 for e in audit if e.get("result") == "denied"),
        "pending_human": sum(1 for e in audit if e.get("result") == "pending_human_approval"),
        "executed": sum(1 for e in audit if e.get("executed")),
        "eval": ev,
        "trace": audit,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} Copilot OK — eval={ev['score']:.2f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
