"""Incident log.

Incidents are recorded for any event that an operator would want to know
about: budget breaches, provider outages, prompt-injection attempts, denied
tool calls, and HITL escalations. The log is append-only and serialisable.
"""
from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional


SEVERITIES = ("info", "warn", "error", "critical")


@dataclass
class Incident:
    incident_id: str
    severity: str
    kind: str
    message: str
    run_id: Optional[str] = None
    ts: int = field(default_factory=lambda: int(time.time() * 1000))
    context: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class IncidentLog:
    def __init__(self) -> None:
        self._incidents: List[Incident] = []

    def record(
        self,
        *,
        severity: str,
        kind: str,
        message: str,
        run_id: Optional[str] = None,
        **context: Any,
    ) -> Incident:
        if severity not in SEVERITIES:
            raise ValueError(f"bad severity: {severity}")
        inc = Incident(
            incident_id="inc_" + uuid.uuid4().hex[:10],
            severity=severity,
            kind=kind,
            message=message,
            run_id=run_id,
            context=context,
        )
        self._incidents.append(inc)
        return inc

    def __iter__(self):
        return iter(self._incidents)

    def __len__(self) -> int:
        return len(self._incidents)

    def to_list(self) -> List[Dict[str, Any]]:
        return [i.to_dict() for i in self._incidents]

    def by_kind(self, kind: str) -> List[Incident]:
        return [i for i in self._incidents if i.kind == kind]
