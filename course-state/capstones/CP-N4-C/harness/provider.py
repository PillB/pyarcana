"""Adapter selection, fallback, retry classification, timeouts, outages.

The provider layer sits between the orchestrator and the concrete adapters.
It is the only place that decides *which* adapter to call, *whether* to retry,
and *when* to fall back from commercial to local.

Retry classification (per the ADR):

* ``transient``       — network hiccup, 5xx, throttling. Retry with backoff.
* ``permanent``       — 4xx, bad request, malformed prompt. Do not retry.
* ``provider_outage`` — repeated transient failures or explicit outage signal.
                        Fall back to the local adapter; log an incident.

Timeouts are enforced with a hard wall-clock deadline; an expired deadline is
treated as ``transient`` for the first occurrence and ``provider_outage`` if
it repeats.
"""
from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Any, Callable, Dict, Optional, Tuple

from . import commercial_model_adapter as cma
from . import local_model_adapter as lma
from .budget import Budget
from .tracing import Tracer


# Public classification labels.
TRANSIENT = "transient"
PERMANENT = "permanent"
PROVIDER_OUTAGE = "provider_outage"


def classify_exception(exc: Exception, *, transient_count: int = 0) -> str:
    """Map an adapter exception to a retry label."""
    if isinstance(exc, cma.ProviderOutage):
        return PROVIDER_OUTAGE
    if isinstance(exc, cma.PermanentError):
        return PERMANENT
    if isinstance(exc, cma.MissingApiKey):
        # Missing key is not a transient outage — fall back, do not retry.
        return PROVIDER_OUTAGE
    if isinstance(exc, cma.TransientError):
        return TRANSIENT if transient_count < 2 else PROVIDER_OUTAGE
    if isinstance(exc, TimeoutError):
        return TRANSIENT if transient_count < 1 else PROVIDER_OUTAGE
    # Unknown exceptions are permanent: safer to stop than to retry blindly.
    return PERMANENT


@dataclass
class ProviderConfig:
    mode: str = "LOCAL"  # LOCAL | COMMERCIAL | COMMERCIAL_TEST
    timeout_ms: int = 500
    max_retries: int = 2
    backoff_ms: int = 20
    fallback_to_local: bool = True


class Provider:
    """Selects an adapter per call, applies retry/timeout/fallback policy."""

    def __init__(
        self,
        config: Optional[ProviderConfig] = None,
        *,
        local: Optional[lma.LocalModelAdapter] = None,
        commercial: Optional[cma.CommercialModelAdapter] = None,
        budget: Optional[Budget] = None,
        tracer: Optional[Tracer] = None,
    ) -> None:
        self.config = config or ProviderConfig()
        self.local = local or lma.LocalModelAdapter()
        self.commercial = commercial
        self.budget = budget
        self.tracer = tracer
        self._transient_counts: Dict[str, int] = {}

    # ----- public --------------------------------------------------------
    def complete(self, prompt: str, *, system: str = "", max_tokens: int = 512) -> Dict[str, Any]:
        """Run one completion, honouring mode/retry/timeout/fallback."""
        mode = self.config.mode
        if mode == "LOCAL":
            return self._call_with_retry(self.local, prompt, system, max_tokens, label="local")
        if mode in ("COMMERCIAL", "COMMERCIAL_TEST"):
            if self.commercial is None:
                # No commercial adapter wired: behave as outage, fall back.
                return self._fallback(prompt, system, max_tokens, reason="no commercial adapter")
            return self._call_with_retry(
                self.commercial, prompt, system, max_tokens, label="commercial"
            )
        raise ValueError(f"unknown mode: {mode}")

    # ----- internals -----------------------------------------------------
    def _call_with_retry(self, adapter, prompt, system, max_tokens, *, label) -> Dict[str, Any]:
        deadline = time.time() + self.config.timeout_ms / 1000.0
        last_exc: Optional[Exception] = None
        for attempt in range(self.config.max_retries + 1):
            try:
                if time.time() > deadline:
                    raise TimeoutError("provider deadline exceeded")
                if self.tracer:
                    with self.tracer.span("provider.call", adapter=label, attempt=attempt) as span:
                        resp = adapter.complete(prompt, system=system, max_tokens=max_tokens)
                        span.set(
                            model=getattr(resp, "model_id", None) or getattr(resp, "model", None),
                            tokens_in=resp.tokens_in,
                            tokens_out=resp.tokens_out,
                            cost=resp.cost,
                        )
                else:
                    resp = adapter.complete(prompt, system=system, max_tokens=max_tokens)
                # Charge the budget if we have one.
                if self.budget is not None:
                    self.budget.charge(tokens=resp.tokens_in + resp.tokens_out, cost=resp.cost)
                return resp.to_dict()
            except Exception as exc:  # noqa: BLE001 — we classify below
                last_exc = exc
                label_key = label
                self._transient_counts[label_key] = self._transient_counts.get(label_key, 0)
                kind = classify_exception(exc, transient_count=self._transient_counts[label_key])
                if self.tracer:
                    self.tracer.event(
                        "provider.error", adapter=label, attempt=attempt, kind=kind, error=str(exc)
                    )
                if kind == TRANSIENT:
                    self._transient_counts[label_key] += 1
                    time.sleep(self.config.backoff_ms / 1000.0 * (attempt + 1))
                    continue
                if kind == PROVIDER_OUTAGE and self.config.fallback_to_local:
                    return self._fallback(prompt, system, max_tokens, reason=str(exc))
                # permanent: stop.
                raise
        # Exhausted retries.
        if self.config.fallback_to_local:
            return self._fallback(prompt, system, max_tokens, reason="retries exhausted")
        raise last_exc  # type: ignore[misc]

    def _fallback(self, prompt: str, system: str, max_tokens: int, *, reason: str) -> Dict[str, Any]:
        if self.tracer:
            self.tracer.event("provider.fallback", to="local", reason=reason)
        resp = self.local.complete(prompt, system=system, max_tokens=max_tokens)
        if self.budget is not None:
            self.budget.charge(tokens=resp.tokens_in + resp.tokens_out, cost=resp.cost)
        d = resp.to_dict()
        d["fell_back_to_local"] = True
        d["fallback_reason"] = reason
        return d
