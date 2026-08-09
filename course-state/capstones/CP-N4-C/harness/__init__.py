"""CP-N4-C — Auditable multi-agent harness (package version 3.0.0).

Public API surface, intentionally narrow so downstream consumers (the demo,
the adversarial tests, CP-FINAL) do not reach into private modules.
"""
from __future__ import annotations

from . import versions
from .budget import Budget, BudgetExceeded
from .commercial_model_adapter import (
    CommercialModelAdapter,
    CommercialResponse,
    MissingApiKey,
    PermanentError,
    ProviderOutage,
    TransientError,
)
from .evaluation import (
    HoldoutCase,
    RedTeamCase,
    TrajectoryResult,
    build_red_team_cases,
    evaluate_trajectory,
    run_holdout,
)
from .incident import Incident, IncidentLog
from .local_model_adapter import LocalModelAdapter, LocalResponse
from .orchestrator import Copilot, CopilotRunRecord, Task
from .provider import Provider, ProviderConfig, classify_exception, TRANSIENT, PERMANENT, PROVIDER_OUTAGE
from .rag import (
    Citation,
    Doc,
    KnowledgeBase,
    RetrievalResult,
    build_answer,
    evaluate_retrieval,
    grade_answer,
)
from .rollback import RollbackManager, RollbackProof
from .state import RunState, StepRecord, STATUSES
from .tools import TOOL_POLICY, ToolDenied, ToolRegistry, ToolResult, idempotency_key
from .tracing import Span, Tracer, redact
from .web_adapter import SerpResult, WebAdapter, wrap_as_data

__version__ = versions.EXPECTED_PACKAGE_VERSION  # "3.0.0"

__all__ = [
    "__version__",
    # versions
    "versions",
    # budget
    "Budget",
    "BudgetExceeded",
    # adapters
    "LocalModelAdapter",
    "LocalResponse",
    "CommercialModelAdapter",
    "CommercialResponse",
    "MissingApiKey",
    "PermanentError",
    "ProviderOutage",
    "TransientError",
    # provider
    "Provider",
    "ProviderConfig",
    "classify_exception",
    "TRANSIENT",
    "PERMANENT",
    "PROVIDER_OUTAGE",
    # orchestrator
    "Copilot",
    "CopilotRunRecord",
    "Task",
    # state
    "RunState",
    "StepRecord",
    "STATUSES",
    # rag
    "KnowledgeBase",
    "Doc",
    "Citation",
    "RetrievalResult",
    "build_answer",
    "grade_answer",
    "evaluate_retrieval",
    # tools
    "TOOL_POLICY",
    "ToolRegistry",
    "ToolResult",
    "ToolDenied",
    "idempotency_key",
    # web
    "WebAdapter",
    "SerpResult",
    "wrap_as_data",
    # tracing
    "Tracer",
    "Span",
    "redact",
    # incidents
    "IncidentLog",
    "Incident",
    # rollback
    "RollbackManager",
    "RollbackProof",
    # evaluation
    "HoldoutCase",
    "RedTeamCase",
    "TrajectoryResult",
    "build_red_team_cases",
    "evaluate_trajectory",
    "run_holdout",
]
