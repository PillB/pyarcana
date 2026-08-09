"""CP-N4-C — OTel GenAI-style tracer with sensitive-data redaction."""
from __future__ import annotations

import hashlib
import json
import re
import time
from typing import Any

REDACT_PATTERNS = [
    (re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"), "[redacted-email]"),
    (re.compile(r"\b\d{3}-\d{2}-\d{4}\b"), "[redacted-ssn]"),
    (re.compile(r"\b(?:\d[ -]*?){13,16}\b"), "[redacted-card]"),
    (re.compile(r"(api[_-]?key|token|secret|password)\s*[=:]\s*\S+", re.IGNORECASE), "[redacted-secret]"),
]


def redact(text: str) -> str:
    if not isinstance(text, str):
        return text
    for pat, repl in REDACT_PATTERNS:
        text = pat.sub(repl, text)
    return text


def _redact_obj(obj):
    if isinstance(obj, str):
        return redact(obj)
    if isinstance(obj, dict):
        return {k: _redact_obj(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_redact_obj(v) for v in obj]
    return obj


def _span_id() -> str:
    return hashlib.sha1(str(time.time_ns()).encode()).hexdigest()[:16]


def _trace_id(seed: str) -> str:
    return hashlib.sha1(seed.encode()).hexdigest()[:32]


class Span:
    def __init__(self, name: str, trace_id: str, parent_span_id: str | None = None):
        self.name = name
        self.trace_id = trace_id
        self.span_id = _span_id()
        self.parent_span_id = parent_span_id
        self.start_unix_nano = time.time_ns()
        self.end_unix_nano = 0
        self.attributes: dict[str, Any] = {}

    def end(self):
        self.end_unix_nano = time.time_ns()

    def set_attr(self, key: str, value: Any):
        self.attributes[key] = _redact_obj(value)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "trace_id": self.trace_id,
            "span_id": self.span_id,
            "parent_span_id": self.parent_span_id,
            "start_unix_nano": self.start_unix_nano,
            "end_unix_nano": self.end_unix_nano,
            "duration_ms": (self.end_unix_nano - self.start_unix_nano) // 1_000_000,
            "attributes": _redact_obj(self.attributes),
        }


class Tracer:
    def __init__(self, trace_id: str | None = None):
        self.trace_id = trace_id or _trace_id("pyarcana-copilot")
        self.spans: list[Span] = []
        self._stack: list[Span] = []

    def start(self, name: str, **attrs) -> Span:
        parent = self._stack[-1] if self._stack else None
        span = Span(name, self.trace_id, parent.span_id if parent else None)
        for k, v in attrs.items():
            span.set_attr(k, v)
        self.spans.append(span)
        self._stack.append(span)
        return span

    def end(self, span: Span, **attrs):
        for k, v in attrs.items():
            span.set_attr(k, v)
        span.end()
        if self._stack and self._stack[-1] is span:
            self._stack.pop()

    def export(self) -> list[dict]:
        return [s.to_dict() for s in self.spans]

    def export_json(self) -> str:
        return json.dumps(self.export(), ensure_ascii=False, indent=2)
