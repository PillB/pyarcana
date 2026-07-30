"""CP-N4-C STARTER scaffold — orchestrator with TODOs.

Learners copy this file into ``harness/orchestrator.py`` and fill in the
TODOs. The real implementation lives in ``../orchestrator.py``; this
scaffold exists so the WEDO/YOUDO exercises have a clean starting point.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from . import versions
from .budget import Budget, BudgetExceeded
from .incident import IncidentLog
from .local_model_adapter import LocalModelAdapter
from .provider import Provider, ProviderConfig
from .rag import KnowledgeBase, build_answer
from .state import RunState, StepRecord
from .tools import ToolRegistry
from .tracing import Tracer, redact
from .web_adapter import WebAdapter, wrap_as_data

MAX_STEPS = 8
MAX_TOOL_CALLS = 12


@dataclass
class Task:
    query: str
    mode: str = "LOCAL"
    principal: str = "anon"
    approvals: Dict[str, bool] = field(default_factory=dict)
    max_steps: int = MAX_STEPS
    max_tool_calls: int = MAX_TOOL_CALLS


@dataclass
class CopilotRunRecord:
    run_id: str
    status: str
    stop_reason: str
    steps: List[Dict[str, Any]]
    tool_calls: List[Dict[str, Any]]
    final_answer: str
    citations: List[Dict[str, Any]]
    trace: List[Dict[str, Any]]
    incidents: List[Dict[str, Any]]
    budget: Dict[str, Any]
    resumed: bool


class Copilot:
    def __init__(
        self,
        *,
        state_path: Optional[str] = None,
        kb: Optional[KnowledgeBase] = None,
        web: Optional[WebAdapter] = None,
        budget: Optional[Budget] = None,
        tools: Optional[ToolRegistry] = None,
    ) -> None:
        # TODO: assert the manifest version matches the package version.
        # TODO: wire the KB into the tool registry so search_docs works.
        self.kb = kb or KnowledgeBase()
        self.web = web or WebAdapter()
        self.budget = budget or Budget()
        self.tools = tools or ToolRegistry()
        self.tracer = Tracer()
        self.incidents = IncidentLog()
        self.local = LocalModelAdapter()
        self.state_path = state_path

    def run(self, task: Task) -> CopilotRunRecord:
        # TODO: load RunState from self.state_path if it exists and is AWAITING_HUMAN.
        # TODO: build a Provider per task.mode (LOCAL | COMMERCIAL | COMMERCIAL_TEST).
        # TODO: loop while len(state.steps) < task.max_steps:
        #         1. generator step -> plan + tool
        #         2. if tool is deny -> record denied, break
        #         3. if tool is require_human and not approved -> set AWAITING_HUMAN, persist, return
        #         4. execute tool (allow / approved require_human)
        #         5. retrieve + build_answer (with citations)
        #         6. verifier step -> ACCEPT or REJECT
        #         7. record StepRecord; check loop fingerprint; check budget.
        # TODO: persist state.json.
        # TODO: return CopilotRunRecord.
        raise NotImplementedError("starter scaffold; fill in the TODOs")
