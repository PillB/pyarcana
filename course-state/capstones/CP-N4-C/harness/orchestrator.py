"""Multi-agent orchestrator: ``Copilot.run(task) -> CopilotRunRecord``.

Design invariants enforced here (and asserted by the adversarial tests):

* Bounded steps (max 8) and bounded tool calls (max 12).
* Generator/Verifier are *typed* agents with strict separation: the generator
  proposes a plan + tool call, the verifier independently checks citations and
  policy. They never share mutable state.
* Loop detection via ``RunState.step_fingerprint`` — repeated fingerprints
  break the loop with ``stop_reason="loop_detected"``.
* Durable resume: state is persisted after every step. If the run is paused
  on a ``require_human`` tool, calling ``run`` again with the approval in the
  task resumes from exactly where it stopped.
* Budget enforcement: every model call and tool call charges the budget; a
  breach raises ``BudgetExceeded`` which the orchestrator catches and turns
  into ``status=ABORTED, stop_reason="budget_exceeded"``.
"""
from __future__ import annotations

import json
import os
import re
import time
import uuid
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from . import rag
from . import versions
from .budget import Budget, BudgetExceeded
from .commercial_model_adapter import CommercialModelAdapter, MissingApiKey
from .incident import IncidentLog
from .local_model_adapter import LocalModelAdapter
from .provider import Provider, ProviderConfig
from .rag import KnowledgeBase
from .rollback import RollbackManager
from .state import RunState, StepRecord
from .tools import ToolRegistry, idempotency_key
from .tracing import Tracer, redact
from .web_adapter import WebAdapter, wrap_as_data


MAX_STEPS = 8
MAX_TOOL_CALLS = 12


# Default synthetic KB used when the caller does not supply one.
def _default_kb() -> KnowledgeBase:
    return KnowledgeBase([
        rag.Doc("rollback", "Rollback restores the previous production model version after a gate failure.", acl=["*"]),
        rag.Doc("pii", "Use synthetic data only in training demos; no real PII.", acl=["*"]),
        rag.Doc("budget", "If cost or token budget is exceeded the run aborts with BudgetExceeded.", acl=["*"]),
        rag.Doc("hitl", "Sensitive side effects (send_email, delete_records) require human approval.", acl=["*"]),
        rag.Doc("internal-er", "Entity resolution scores are not fraud labels; require human review.", acl=["analyst"]),
    ])


@dataclass
class Task:
    """A unit of work for the copilot."""
    query: str
    mode: str = "LOCAL"  # LOCAL | COMMERCIAL | COMMERCIAL_TEST
    principal: str = "anon"
    approvals: Dict[str, bool] = field(default_factory=dict)  # idempotency_key -> approve?
    max_steps: int = MAX_STEPS
    max_tool_calls: int = MAX_TOOL_CALLS
    extra: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "query": self.query,
            "mode": self.mode,
            "principal": self.principal,
            "approvals": self.approvals,
            "max_steps": self.max_steps,
            "max_tool_calls": self.max_tool_calls,
            "extra": self.extra,
        }


@dataclass
class CopilotRunRecord:
    run_id: str
    task: Dict[str, Any]
    status: str
    stop_reason: str
    steps: List[Dict[str, Any]]
    tool_calls: List[Dict[str, Any]]
    final_answer: str
    citations: List[Dict[str, Any]]
    trace: List[Dict[str, Any]]
    incidents: List[Dict[str, Any]]
    budget: Dict[str, Any]
    mode: str
    resumed: bool
    model_used: str
    fell_back_to_local: bool

    def to_dict(self) -> Dict[str, Any]:
        return {
            "run_id": self.run_id,
            "task": self.task,
            "status": self.status,
            "stop_reason": self.stop_reason,
            "steps": self.steps,
            "tool_calls": self.tool_calls,
            "final_answer": self.final_answer,
            "citations": self.citations,
            "trace": self.trace,
            "incidents": self.incidents,
            "budget": self.budget,
            "mode": self.mode,
            "resumed": self.resumed,
            "model_used": self.model_used,
            "fell_back_to_local": self.fell_back_to_local,
        }


class Copilot:
    """The bounded, auditable multi-agent harness."""

    def __init__(
        self,
        *,
        state_path: Optional[str] = None,
        kb: Optional[KnowledgeBase] = None,
        web: Optional[WebAdapter] = None,
        budget: Optional[Budget] = None,
        tools: Optional[ToolRegistry] = None,
        local: Optional[LocalModelAdapter] = None,
        commercial: Optional[CommercialModelAdapter] = None,
        tracer: Optional[Tracer] = None,
        incidents: Optional[IncidentLog] = None,
    ) -> None:
        versions.assert_package_version()
        self.state_path = state_path or os.path.join(
            os.path.dirname(__file__), "..", "run_state.json"
        )
        self.state_path = os.path.abspath(self.state_path)
        self.kb = kb or _default_kb()
        self.web = web or WebAdapter()
        self.budget = budget or Budget(max_cost=1.0, max_tokens=20_000)
        self.tools = tools or ToolRegistry()
        self.tools.with_kb(self.kb).with_outbox([])
        self.local = local or LocalModelAdapter()
        self.commercial = commercial
        self.tracer = tracer or Tracer()
        self.incidents = incidents or IncidentLog()
        # Provider is constructed per-run because mode is per-task.
        self._state: Optional[RunState] = None
        # Initialise fallback bookkeeping; _build_provider refreshes these.
        self._last_model_id: str = "local-rules-v1"
        self._fell_back: bool = False

    # ------------------------------------------------------------------ API
    def run(self, task: Task) -> CopilotRunRecord:
        """Execute (or resume) a task and return a ``CopilotRunRecord``."""
        resumed = False
        state = RunState.load(self.state_path)
        if state is not None and state.is_awaiting_human() and state.task == task.query:
            # Resume from the persisted state.
            resumed = True
            if task.approvals:
                # Approvals were provided: apply them and continue the loop.
                self._apply_approvals(state, task)
                if state.status != "RUNNING":
                    # Approval was rejected; return the persisted state as-is.
                    state.save(self.state_path)
                    return self._record(state, task, resumed, model_used="local-rules-v1")
                state.status = "RUNNING"
            else:
                # No new approvals: return the persisted AWAITING_HUMAN state
                # without re-entering the loop. This is the durable-resume
                # contract: a run that is waiting for a human stays waiting
                # until the human decides.
                state.save(self.state_path)
                return self._record(state, task, resumed, model_used="local-rules-v1")
        else:
            state = RunState(task=task.query, task_id="t_" + uuid.uuid4().hex[:8], mode=task.mode)
        state.status = "RUNNING"
        state.save(self.state_path)
        self._state = state

        provider = self._build_provider(task.mode)
        rollback = RollbackManager(state)

        try:
            with self.tracer.span("copilot.run", run_id=state.run_id, mode=task.mode):
                self._loop(state, task, provider, rollback)
        except BudgetExceeded as exc:
            state.status = "ABORTED"
            state.extras["stop_reason"] = "budget_exceeded"
            self.incidents.record(
                severity="error", kind="budget_exceeded",
                message=str(exc), run_id=state.run_id,
                used=exc.used, limit=exc.limit,
            )
        except Exception as exc:  # noqa: BLE001
            state.status = "FAILED"
            state.extras["stop_reason"] = "error"
            state.extras["error"] = redact(str(exc))
            self.incidents.record(
                severity="critical", kind="uncaught_error",
                message=str(exc), run_id=state.run_id,
            )
        else:
            if state.status not in ("AWAITING_HUMAN",):
                if state.extras.get("stop_reason") is None:
                    state.extras["stop_reason"] = "complete"
                if state.status not in ("ABORTED", "FAILED"):
                    state.status = "COMPLETE"

        # Persist final state.
        state.save(self.state_path)
        return self._record(state, task, resumed, model_used=self._last_model_id)

    def _record(self, state: RunState, task: Task, resumed: bool, *, model_used: str) -> CopilotRunRecord:
        # Final answer + citations. If the loop set them, use them; otherwise
        # build a fresh cited answer so a paused run still has citations.
        if not state.citations or not state.final_answer:
            retrieval = self.kb.retrieve(task.query, principal=task.principal, k=3)
            answer, cites = rag.build_answer(task.query, retrieval.hits)
            if not state.final_answer:
                state.final_answer = answer
            if not state.citations:
                state.citations = [c.to_dict() for c in cites]
            state.save(self.state_path)
        final_answer = redact(state.final_answer or "")
        return CopilotRunRecord(
            run_id=state.run_id,
            task=redact(task.to_dict()),
            status=state.status,
            stop_reason=state.extras.get("stop_reason", "complete"),
            steps=[s.to_dict() for s in state.steps],
            tool_calls=redact(state.tool_calls),
            final_answer=final_answer,
            citations=list(state.citations),
            trace=self.tracer.to_dict(),
            incidents=self.incidents.to_list(),
            budget=self.budget.to_dict(),
            mode=task.mode,
            resumed=resumed,
            model_used=model_used,
            fell_back_to_local=self._fell_back,
        )

    # -------------------------------------------------------------- internals
    def _build_provider(self, mode: str) -> Provider:
        self._last_model_id = "local-rules-v1"
        self._fell_back = False
        cfg = ProviderConfig(mode=mode, fallback_to_local=True)
        if mode in ("COMMERCIAL", "COMMERCIAL_TEST"):
            self.commercial = self.commercial or CommercialModelAdapter(
                approved=(mode == "COMMERCIAL"),
            )
        prov = Provider(
            cfg, local=self.local, commercial=self.commercial,
            budget=self.budget, tracer=self.tracer,
        )
        # Hook to record fallbacks.
        orig_fallback = prov._fallback

        def _fallback(prompt, system, max_tokens, *, reason):
            self._fell_back = True
            self._last_model_id = "local-rules-v1"
            self.incidents.record(
                severity="warn", kind="provider_fallback",
                message="commercial provider unavailable; fell back to local",
                reason=redact(reason),
            )
            return orig_fallback(prompt, system, max_tokens, reason=reason)

        prov._fallback = _fallback  # type: ignore[assignment]
        return prov

    def _apply_approvals(self, state: RunState, task: Task) -> None:
        pending = state.pending_hitl
        if not pending:
            return
        key = pending.get("idempotency_key", "")
        approved = task.approvals.get(key, False)
        if approved:
            # Execute the previously-pending tool call.
            res = self.tools.call(
                pending["tool"], pending["args"], approved=True, principal=task.principal,
            )
            state.tool_calls.append(res.to_dict())
            state.pending_hitl = None
            state.status = "RUNNING"
            self.incidents.record(
                severity="info", kind="hitl_approved",
                message=f"human approved {pending['tool']}", run_id=state.run_id,
            )
        else:
            # Rejection: leave pending_hitl in place; the loop will end.
            state.extras["stop_reason"] = "hitl_rejected"
            self.incidents.record(
                severity="warn", kind="hitl_rejected",
                message=f"human rejected {pending['tool']}", run_id=state.run_id,
            )

    def _loop(self, state: RunState, task: Task, provider: Provider, rollback: RollbackManager) -> None:
        max_steps = min(task.max_steps, MAX_STEPS)
        max_tool_calls = min(task.max_tool_calls, MAX_TOOL_CALLS)
        stop_reason: Optional[str] = None
        web_used = False

        while len(state.steps) < max_steps:
            if len(state.tool_calls) >= max_tool_calls:
                stop_reason = "max_tool_calls"
                break

            # --- Generator step ---
            rollback.capture()
            with self.tracer.span("generator.step", index=len(state.steps)):
                gen_prompt = (
                    f'Plan the next step for task: "{task.query}". '
                    f'Available tools: search_docs, summarize, export_report, send_email. '
                    f'Denied tools: delete_records, shell_exec. '
                    f'If you need data, propose search_docs with a "q" field.'
                )
                gen_resp = provider.complete(gen_prompt, system="You are a Generator agent. Plan the next step. Cite doc_ids for every grounded claim.")
                self._last_model_id = gen_resp.get("model_id", self._last_model_id)
                plan = _safe_json(gen_resp.get("text", ""))
                if plan is None:
                    plan = {"plan": "answer-only", "tool": "search_docs", "args": {"q": task.query}}

            # Web/SERP lookup (treated as DATA only).
            web_snippet = ""
            if self.web.is_available() and not web_used:
                serp = self.web.search(task.query, k=2)
                if serp:
                    wrapped = wrap_as_data(serp[0].snippet, source=serp[0].source)
                    web_snippet = wrapped
                    self.tracer.event("web.search", url=serp[0].url, source=serp[0].source)
                    # Injection-defence incident if we had to strip anything.
                    if "[injection-stripped]" in wrapped:
                        self.incidents.record(
                            severity="warn", kind="injection_defended",
                            message="stripped prompt-injection lines from web content",
                            run_id=state.run_id, source=serp[0].source,
                        )
                web_used = True

            # --- Tool execution ---
            tool_name = plan.get("tool")
            tool_args = plan.get("args", {}) or {}
            tool_event: Optional[Dict[str, Any]] = None
            if tool_name:
                # ACL check on retrieved docs is enforced inside the search_docs handler.
                res = self.tools.call(
                    tool_name, tool_args,
                    approved=task.approvals.get(idempotency_key(tool_name, tool_args), False),
                    dry_run=False, principal=task.principal,
                )
                tool_event = res.to_dict()
                state.tool_calls.append(tool_event)
                self.tracer.event("tool.call", **redact(tool_event))

                if res.policy == "require_human" and not res.executed:
                    # Pause for HITL.
                    state.pending_hitl = {
                        "tool": tool_name,
                        "args": tool_args,
                        "idempotency_key": res.idempotency_key,
                    }
                    state.status = "AWAITING_HUMAN"
                    step = StepRecord(
                        index=len(state.steps),
                        generator=plan,
                        verifier={"verdict": "HITL_REQUIRED", "reason": "human approval needed"},
                        tool_calls=[tool_event] if tool_event else [],
                        status="HITL_REQUIRED",
                    )
                    state.add_step(step)
                    state.extras["stop_reason"] = "hitl_required"
                    state.save(self.state_path)
                    self.incidents.record(
                        severity="info", kind="hitl_required",
                        message=f"{tool_name} awaiting human approval",
                        run_id=state.run_id,
                    )
                    return
                if res.policy == "deny":
                    self.incidents.record(
                        severity="warn", kind="tool_denied",
                        message=f"{tool_name} denied by policy",
                        run_id=state.run_id,
                    )
            else:
                # No tool proposed: still record a step (loop detector needs it).
                pass

            # --- Retrieval + cited answer ---
            with self.tracer.span("rag.retrieve", query=task.query):
                retrieval = self.kb.retrieve(task.query, principal=task.principal, k=3)
                answer_text, citations = rag.build_answer(task.query, retrieval.hits)
                if web_snippet:
                    # The wrapped snippet is DATA: it is appended after the
                    # cited answer, never injected into a system prompt.
                    answer_text = answer_text + "\n" + web_snippet
                for c in citations:
                    c_dict = c.to_dict()
                    if c_dict not in state.citations:
                        state.citations.append(c_dict)

            # --- Verifier step ---
            with self.tracer.span("verifier.step", index=len(state.steps)):
                verify_prompt = (
                    f'Verify this step. Tool: {tool_name}. '
                    f'Answer: {answer_text[:300]}. '
                    f'Citations: {json.dumps([c.to_dict() for c in citations])}. '
                    f'Reject if any grounded claim lacks a citation or if the tool is disallowed.'
                )
                ver_resp = provider.complete(verify_prompt, system="You are a Verifier agent. Reject uncited grounded claims and policy violations.")
                verdict = _safe_json(ver_resp.get("text", "")) or {"verdict": "ACCEPT", "reason": "no parse"}
                self._last_model_id = ver_resp.get("model_id", self._last_model_id)

            step = StepRecord(
                index=len(state.steps),
                generator=plan,
                verifier=verdict,
                tool_calls=[tool_event] if tool_event else [],
                status="OK" if verdict.get("verdict") == "ACCEPT" else "REJECTED",
            )
            state.add_step(step)

            # --- Stop conditions ---
            fp = step.fingerprint
            counts = state.fingerprint_counts()
            if counts.get(fp, 0) >= 2:
                stop_reason = "loop_detected"
                self.incidents.record(
                    severity="warn", kind="loop_detected",
                    message=f"step fingerprint repeated: {fp}",
                    run_id=state.run_id,
                )
                break

            if verdict.get("verdict") == "REJECT":
                # Rollback the most recent mutation and stop.
                rollback.rollback()
                stop_reason = "verifier_rejected"
                break

            # If we have a cited answer and the only tool was search_docs, we are done.
            if tool_name in ("search_docs", None) and citations:
                state.final_answer = answer_text
                stop_reason = "complete"
                break

            # Update final_answer in case we hit max_steps next iteration.
            state.final_answer = answer_text

        if stop_reason is None:
            stop_reason = "max_steps"
        state.extras["stop_reason"] = stop_reason
        if state.final_answer is None:
            state.final_answer = self._default_final_answer(state, task)
        state.save(self.state_path)

    def _default_final_answer(self, state: RunState, task: Task) -> str:
        retrieval = self.kb.retrieve(task.query, principal=task.principal, k=3)
        answer, _ = rag.build_answer(task.query, retrieval.hits)
        return answer

    # ----- utilities for tests -----
    @property
    def outbox(self) -> List[Dict[str, Any]]:
        return getattr(self.tools, "_outbox", [])


def _safe_json(text: str) -> Optional[Dict[str, Any]]:
    """Parse the first JSON object in ``text``; return None if unparseable."""
    if not text:
        return None
    start = text.find("{")
    if start < 0:
        return None
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                try:
                    return json.loads(text[start:i + 1])
                except Exception:  # noqa: BLE001
                    return None
    return None
