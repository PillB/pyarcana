"""Durable run state for the CP-N4-C multi-agent harness.

A ``RunState`` captures everything required to (a) detect loops, (b) pause for
human approval and resume later, and (c) prove a rollback restored prior state.
It is the single source of truth persisted to ``state.json``.
"""
from __future__ import annotations

import hashlib
import json
import os
import time
import uuid
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional


# Canonical status values. Anything outside this set is a programmer error.
STATUSES = (
    "INIT",            # constructed, not started
    "RUNNING",         # orchestrator actively stepping
    "AWAITING_HUMAN",  # paused on a require_human tool / verifier hold
    "COMPLETE",        # finished successfully
    "ABORTED",         # budget breach, outage, or other hard stop
    "FAILED",          # uncaught error
)


def _now_ms() -> int:
    return int(time.time() * 1000)


def _new_run_id() -> str:
    return "run_" + uuid.uuid4().hex[:12]


@dataclass
class StepRecord:
    """One orchestrator step (generator + verifier pair)."""
    index: int
    generator: Dict[str, Any] = field(default_factory=dict)
    verifier: Dict[str, Any] = field(default_factory=dict)
    tool_calls: List[Dict[str, Any]] = field(default_factory=list)
    fingerprint: str = ""
    status: str = "OK"  # OK, LOOP_DETECTED, HITL_REQUIRED, STOP, ERROR
    notes: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class RunState:
    """Persistent state of a single copilot run."""
    run_id: str = field(default_factory=_new_run_id)
    task_id: str = ""
    task: str = ""
    mode: str = "LOCAL"  # LOCAL | COMMERCIAL | COMMERCIAL_TEST
    status: str = "INIT"
    steps: List[StepRecord] = field(default_factory=list)
    tool_calls: List[Dict[str, Any]] = field(default_factory=list)
    pending_hitl: Optional[Dict[str, Any]] = None
    final_answer: Optional[str] = None
    citations: List[Dict[str, Any]] = field(default_factory=list)
    budget_used: Dict[str, float] = field(default_factory=lambda: {"tokens": 0.0, "cost": 0.0})
    created_at: int = field(default_factory=_now_ms)
    updated_at: int = field(default_factory=_now_ms)
    # Snapshot captured before the most recent mutating action; used by rollback.
    prior_snapshot: Optional[Dict[str, Any]] = None
    extras: Dict[str, Any] = field(default_factory=dict)

    # ----- fingerprinting -------------------------------------------------
    def step_fingerprint(self, step: StepRecord) -> str:
        """Stable hash of a step's semantic content (ignores timing/index)."""
        payload = json.dumps(
            {
                "g": step.generator.get("plan", ""),
                "t": sorted(
                    (tc.get("tool"), json.dumps(tc.get("args", {}), sort_keys=True))
                    for tc in step.tool_calls
                ),
                "v": step.verifier.get("verdict", ""),
            },
            sort_keys=True,
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]

    def fingerprint(self) -> str:
        """Stable hash of the entire run state (used for change detection)."""
        payload = json.dumps(self.to_dict(exclude=("prior_snapshot",)), sort_keys=True)
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]

    # ----- persistence ----------------------------------------------------
    def to_dict(self, exclude: tuple = ()) -> Dict[str, Any]:
        d = {
            "run_id": self.run_id,
            "task_id": self.task_id,
            "task": self.task,
            "mode": self.mode,
            "status": self.status,
            "steps": [s.to_dict() for s in self.steps],
            "tool_calls": self.tool_calls,
            "pending_hitl": self.pending_hitl,
            "final_answer": self.final_answer,
            "citations": self.citations,
            "budget_used": self.budget_used,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "prior_snapshot": self.prior_snapshot,
            "extras": self.extras,
        }
        for k in exclude:
            d.pop(k, None)
        return d

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "RunState":
        steps = [StepRecord(**s) for s in d.get("steps", [])]
        return cls(
            run_id=d.get("run_id", _new_run_id()),
            task_id=d.get("task_id", ""),
            task=d.get("task", ""),
            mode=d.get("mode", "LOCAL"),
            status=d.get("status", "INIT"),
            steps=steps,
            tool_calls=d.get("tool_calls", []),
            pending_hitl=d.get("pending_hitl"),
            final_answer=d.get("final_answer"),
            citations=d.get("citations", []),
            budget_used=d.get("budget_used", {"tokens": 0.0, "cost": 0.0}),
            created_at=d.get("created_at", _now_ms()),
            updated_at=d.get("updated_at", _now_ms()),
            prior_snapshot=d.get("prior_snapshot"),
            extras=d.get("extras", {}),
        )

    def save(self, path: str) -> None:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.updated_at = _now_ms()
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(self.to_dict(), f, ensure_ascii=False, indent=2, sort_keys=True)
        os.replace(tmp, path)

    @classmethod
    def load(cls, path: str) -> Optional["RunState"]:
        if not os.path.exists(path):
            return None
        with open(path, "r", encoding="utf-8") as f:
            return cls.from_dict(json.load(f))

    # ----- mutation helpers ----------------------------------------------
    def snapshot(self) -> Dict[str, Any]:
        """Capture a deep-copy snapshot for later rollback."""
        import copy
        return copy.deepcopy(self.to_dict(exclude=("prior_snapshot",)))

    def add_step(self, step: StepRecord) -> None:
        step.fingerprint = self.step_fingerprint(step)
        self.steps.append(step)
        # Note: step.tool_calls are also appended to RunState.tool_calls by
        # the orchestrator; we intentionally do NOT extend here to avoid
        # double-counting.

    def is_awaiting_human(self) -> bool:
        return self.status == "AWAITING_HUMAN" and self.pending_hitl is not None

    def fingerprint_counts(self) -> Dict[str, int]:
        counts: Dict[str, int] = {}
        for s in self.steps:
            counts[s.fingerprint] = counts.get(s.fingerprint, 0) + 1
        return counts
