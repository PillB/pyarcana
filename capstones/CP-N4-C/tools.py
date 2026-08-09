"""CP-N4-C — narrow tools with allowlist, least privilege, approval gate."""
from __future__ import annotations

import json
import re
from typing import Any

# Tool allowlist — only these names may be proposed/executed.
TOOL_ALLOWLIST = ("draft_email", "lookup_client", "compute_metric")

# Side-effect classification (least privilege).
TOOL_META = {
    "draft_email":    {"side_effect": "send",   "idempotent": False, "sandboxed": False, "approval_required": True},
    "lookup_client":  {"side_effect": "read",   "idempotent": True,  "sandboxed": True,  "approval_required": False},
    "compute_metric": {"side_effect": "read",   "idempotent": True,  "sandboxed": True,  "approval_required": False},
}

ALLOWLIST_RECIPIENTS = ("ana.review@synthetic.example", "ben.ops@synthetic.example")

EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


class ToolError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(f"{code}: {message}")


def is_allowlisted(tool_name: str) -> bool:
    return tool_name in TOOL_ALLOWLIST


def draft_email(args: dict, dry_run: bool = False) -> dict:
    """Narrow schema: {to, subject, body}. Recipient must be allowlisted."""
    to = args.get("to", "")
    subject = str(args.get("subject", ""))[:120]
    body = str(args.get("body", ""))[:2000]
    if not EMAIL_RE.match(to):
        raise ToolError("invalid_recipient", f"not a valid email: {to!r}")
    if to not in ALLOWLIST_RECIPIENTS:
        raise ToolError("recipient_not_allowlisted", f"{to} is not in the allowlist")
    if dry_run:
        return {"drafted": True, "dry_run": True, "to": to, "subject": subject, "body": body}
    # No actual SMTP — record the draft for the approval gate.
    return {"drafted": True, "dry_run": False, "to": to, "subject": subject, "body": body,
            "approval_required": True}


def lookup_client(args: dict, dry_run: bool = False) -> dict:
    """Narrow schema: {client_id}. Returns a synthetic client record."""
    cid = str(args.get("client_id", ""))
    if not cid.startswith("ACME-"):
        raise ToolError("invalid_client_id", f"expected ACME-XXXXX, got {cid!r}")
    return {"client_id": cid, "kyc_status": "refresh_due_q3",
            "reviewer": "ana.review@synthetic.example"}


def compute_metric(args: dict, dry_run: bool = False) -> dict:
    """Narrow schema: {metric, client_id}. Returns a deterministic numeric value."""
    metric = str(args.get("metric", ""))
    cid = str(args.get("client_id", ""))
    if metric not in ("avg_amount", "txn_count", "max_amount"):
        raise ToolError("invalid_metric", f"metric {metric!r} not supported")
    if not cid.startswith("ACME-"):
        raise ToolError("invalid_client_id", f"expected ACME-XXXXX, got {cid!r}")
    # Deterministic synthetic metric (no real DB).
    base = int(cid.split("-")[1]) if "-" in cid else 0
    values = {"avg_amount": round(100.0 + base * 0.5, 2),
              "txn_count": base % 50,
              "max_amount": round(500.0 + base * 1.5, 2)}
    return {"metric": metric, "client_id": cid, "value": values[metric]}


TOOL_REGISTRY = {
    "draft_email": draft_email,
    "lookup_client": lookup_client,
    "compute_metric": compute_metric,
}


def propose_tool(name: str, args: dict) -> dict:
    """Build a tool proposal. The orchestrator decides whether to execute."""
    if not is_allowlisted(name):
        return {"name": name, "args": args, "allowlisted": False,
                "reason": f"{name} not in TOOL_ALLOWLIST"}
    meta = TOOL_META[name]
    return {"name": name, "args": args, "allowlisted": True,
            "idempotent": meta["idempotent"], "sandboxed": meta["sandboxed"],
            "side_effect": meta["side_effect"],
            "approval_required": meta["approval_required"]}


def execute_tool(name: str, args: dict, dry_run: bool = False) -> dict:
    if not is_allowlisted(name):
        raise ToolError("tool_not_allowlisted", f"{name} is not allowlisted")
    return TOOL_REGISTRY[name](args, dry_run=dry_run)


class ApprovalGate:
    """Human approval gate for sensitive side effects (send)."""

    def __init__(self):
        self._approved: set[str] = set()
        self._denied: set[str] = set()

    def request(self, tool_name: str, args: dict) -> dict:
        return {"tool": tool_name, "args": args, "status": "pending",
                "message": "Awaiting human approval for sensitive side effect."}

    def approve(self, run_id: str):
        self._approved.add(run_id)

    def deny(self, run_id: str):
        self._denied.add(run_id)

    def status(self, run_id: str) -> str:
        if run_id in self._approved:
            return "approved"
        if run_id in self._denied:
            return "denied"
        return "pending"
