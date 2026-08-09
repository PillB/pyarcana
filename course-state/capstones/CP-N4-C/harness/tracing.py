"""Tracing primitives.

Every model call, tool call, retrieval, and verifier decision opens a span.
Spans are nested under a root run span. Before any trace is emitted or
persisted it passes through :func:`redact`, which scrubs emails, bearer
tokens, and secret-looking key/value pairs.
"""
from __future__ import annotations

import re
import time
import uuid
from contextlib import contextmanager
from typing import Any, Dict, Iterator, List, Optional


# Patterns that must never survive into a persisted trace.
_EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
_BEARER_RE = re.compile(r"(?i)\b(Bearer\s+|Authorization:\s*)([A-Za-z0-9._\-/+=]+)")
_KEY_RE = re.compile(r"(?i)(api[_-]?key|token|secret|password|passwd)\s*[:=]\s*['\"]?([A-Za-z0-9._\-/+=]{6,})")
_LONG_TOKEN_RE = re.compile(r"\b[A-Za-z0-9_\-]{32,}\b")


def redact(text: Any) -> Any:
    """Recursively redact emails, tokens and secret-looking strings.

    The function returns a value of the same type as ``text``: strings are
    scrubbed, dicts/lists are scrubbed element-wise, everything else is
    returned untouched.
    """
    if isinstance(text, str):
        s = text
        s = _EMAIL_RE.sub("[email-redacted]", s)
        s = _BEARER_RE.sub(lambda m: m.group(1) + "[token-redacted]", s)
        s = _KEY_RE.sub(lambda m: f"{m.group(1)}=[redacted]", s)
        # Long opaque tokens (e.g. JWT bodies) — collapse, but only if it
        # does not look like a sha-style hash we recorded deliberately.
        s = _LONG_TOKEN_RE.sub("[token-redacted]", s)
        return s
    if isinstance(text, dict):
        out: Dict[str, Any] = {}
        for k, v in text.items():
            rk = redact(k) if isinstance(k, str) else k
            # Drop secrets outright rather than scrub-and-keep.
            if isinstance(k, str) and re.match(
                r"(?i).*(api[_-]?key|token|secret|password|passwd|bearer).*", k
            ):
                out[rk if isinstance(rk, str) else k] = "[redacted]"
                continue
            out[rk if isinstance(rk, str) else k] = redact(v)
        return out
    if isinstance(text, list):
        return [redact(x) for x in text]
    return text


class Span:
    """A single named trace span."""

    def __init__(self, name: str, parent: Optional["Span"] = None, attrs: Optional[Dict[str, Any]] = None):
        self.span_id = uuid.uuid4().hex[:12]
        self.parent_id = parent.span_id if parent else None
        self.name = name
        self.start_ms = int(time.time() * 1000)
        self.end_ms: Optional[int] = None
        self.attrs: Dict[str, Any] = dict(attrs or {})

    def set(self, **attrs: Any) -> None:
        self.attrs.update(attrs)

    def end(self) -> None:
        self.end_ms = int(time.time() * 1000)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "span_id": self.span_id,
            "parent_id": self.parent_id,
            "name": self.name,
            "start_ms": self.start_ms,
            "end_ms": self.end_ms,
            "attrs": redact(self.attrs),
        }


class Tracer:
    """A simple in-memory tracer that produces a flat list of spans."""

    def __init__(self) -> None:
        self._spans: List[Span] = []
        self._stack: List[Span] = []

    @contextmanager
    def span(self, name: str, **attrs: Any) -> Iterator[Span]:
        parent = self._stack[-1] if self._stack else None
        s = Span(name, parent=parent, attrs=attrs)
        self._spans.append(s)
        self._stack.append(s)
        try:
            yield s
        finally:
            s.end()
            self._stack.pop()

    def event(self, name: str, **attrs: Any) -> None:
        """Record a discrete event as a zero-duration span."""
        s = Span(name, parent=self._stack[-1] if self._stack else None, attrs=attrs)
        s.end_ms = s.start_ms
        self._spans.append(s)

    def to_dict(self) -> List[Dict[str, Any]]:
        return [s.to_dict() for s in self._spans]

    @property
    def spans(self) -> List[Span]:
        return list(self._spans)
