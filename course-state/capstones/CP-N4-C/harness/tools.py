"""Least-privilege tool layer.

Tools are partitioned into three policy classes:

* ``allow``         — executed immediately by the harness sandbox.
* ``require_human`` — proposed, but NOT executed until a human approves. The
                      run pauses in ``AWAITING_HUMAN`` and resumes on approval.
* ``deny``          — never executed; the proposal is rejected and recorded.

Every tool call carries an idempotency key. Repeated calls with the same key
return the cached result instead of re-executing. A ``dry_run`` flag returns
the would-be execution plan without performing side effects.

The default tool registry is fixed; unknown tools are denied by construction.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional


# The fixed policy table. Mirrors the capstone gate.json contract.
TOOL_POLICY: Dict[str, str] = {
    "search_docs": "allow",
    "summarize": "allow",
    "export_report": "allow",
    "send_email": "require_human",
    "delete_records": "deny",
    "shell_exec": "deny",
}


class ToolDenied(Exception):
    """Raised when a denied tool is proposed for execution."""


class HumanApprovalRequired(Exception):
    """Raised when a require_human tool is proposed without prior approval."""


@dataclass
class ToolResult:
    tool: str
    args: Dict[str, Any]
    policy: str
    executed: bool
    result: Any = None
    idempotency_key: str = ""
    dry_run: bool = False
    approved: bool = False
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "tool": self.tool,
            "args": self.args,
            "policy": self.policy,
            "executed": self.executed,
            "result": self.result,
            "idempotency_key": self.idempotency_key,
            "dry_run": self.dry_run,
            "approved": self.approved,
            "error": self.error,
        }


def idempotency_key(tool: str, args: Dict[str, Any]) -> str:
    payload = json.dumps({"t": tool, "a": args}, sort_keys=True)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


class ToolRegistry:
    """Allowlist-driven tool dispatcher with idempotency and dry-run."""

    def __init__(self, policy: Optional[Dict[str, str]] = None) -> None:
        self.policy = dict(policy or TOOL_POLICY)
        self._cache: Dict[str, ToolResult] = {}
        self._handlers: Dict[str, Callable[[Dict[str, Any]], Any]] = {}
        # Register default safe handlers.
        self.register("search_docs", self._h_search_docs)
        self.register("summarize", self._h_summarize)
        self.register("export_report", self._h_export_report)
        self.register("send_email", self._h_send_email)

    # ----- public --------------------------------------------------------
    def register(self, tool: str, handler: Callable[[Dict[str, Any]], Any]) -> None:
        if tool not in self.policy:
            # Registering a handler for an unknown tool does NOT grant it;
            # the policy table is the source of truth.
            self.policy.setdefault(tool, "deny")
        self._handlers[tool] = handler

    def is_known(self, tool: str) -> bool:
        return tool in self.policy

    def call(
        self,
        tool: str,
        args: Optional[Dict[str, Any]] = None,
        *,
        approved: bool = False,
        dry_run: bool = False,
        principal: str = "anon",
    ) -> ToolResult:
        args = dict(args or {})
        key = idempotency_key(tool, args)
        # Idempotent replay: return cached result for already-executed calls.
        if key in self._cache and self._cache[key].executed:
            cached = self._cache[key]
            cached.dry_run = dry_run
            return cached

        policy = self.policy.get(tool, "deny")
        result = ToolResult(
            tool=tool, args=args, policy=policy, executed=False,
            idempotency_key=key, dry_run=dry_run, approved=approved,
        )

        if policy == "deny":
            result.result = "denied"
            result.error = "tool denied by policy"
            self._cache[key] = result
            return result

        if policy == "require_human" and not approved:
            result.result = "pending_human_approval"
            result.error = "human approval required"
            self._cache[key] = result
            return result

        if dry_run:
            result.result = {"would_execute": True, "handler_present": tool in self._handlers}
            return result

        # policy in (allow, require_human with approval)
        handler = self._handlers.get(tool)
        if handler is None:
            result.result = "no_handler"
            result.error = f"no handler registered for {tool}"
            return result
        try:
            # Sandbox: handlers receive only their declared args (no env, no fs).
            out = handler(args)
            result.executed = True
            result.result = out
        except Exception as exc:  # noqa: BLE001
            result.error = f"handler_error: {exc}"
            result.result = {"error": str(exc)}
        self._cache[key] = result
        return result

    # ----- default safe handlers -----------------------------------------
    def _h_search_docs(self, args: Dict[str, Any]) -> Any:
        # The orchestrator injects the KB at call time via ``with_kb``.
        kb = getattr(self, "_kb", None)
        if kb is None:
            return []
        q = args.get("q", "")
        res = kb.retrieve(q, principal=args.get("principal", "anon"), k=args.get("k", 5))
        return res.to_dict()

    def _h_summarize(self, args: Dict[str, Any]) -> Any:
        text = args.get("text", "") or ""
        max_len = int(args.get("max_len", 120))
        return {"summary": text[:max_len], "len": len(text)}

    def _h_export_report(self, args: Dict[str, Any]) -> Any:
        # No filesystem writes; return a deterministic path the caller may log.
        fmt = args.get("format", "md")
        return {"path": f"synthetic_report.{fmt}", "bytes": 0, "persisted": False}

    def _h_send_email(self, args: Dict[str, Any]) -> Any:
        # Side effect: even when approved, we never actually send anything.
        # We queue into an in-memory outbox so tests can assert on it.
        to = args.get("to", "")
        outbox = getattr(self, "_outbox", None)
        if outbox is not None:
            outbox.append({"to": to, "subject": args.get("subject", ""), "body": args.get("body", "")})
        return {"queued": True, "sent": False, "to": to}

    # ----- helpers -------------------------------------------------------
    def with_kb(self, kb) -> "ToolRegistry":
        self._kb = kb
        return self

    def with_outbox(self, outbox: List[Dict[str, Any]]) -> "ToolRegistry":
        self._outbox = outbox
        return self
