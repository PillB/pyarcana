"""Provider-neutral commercial model adapter.

This module defines the *contract* a real commercial adapter would honour:
``complete(prompt, system, max_tokens) -> Response``. It deliberately does
**not** import any vendor SDK and never sends a network request.

Two operating modes are supported:

* ``approved=True``  — a key must be present (read from the environment or the
  constructor). Missing key raises :class:`MissingApiKey`. The adapter still
  does not call out; production wiring would inject an HTTP client here.
* ``approved=False`` — *test mode*. No key required. The adapter returns
  deterministic canned responses so the harness can exercise the commercial
  code path in any environment.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any, Dict, Optional


class MissingApiKey(Exception):
    """Raised when an approved commercial call is attempted without a key."""


class ProviderOutage(Exception):
    """Raised to simulate a provider outage (used by the retry path)."""


class TransientError(Exception):
    """A transient transport error that the caller may retry."""


class PermanentError(Exception):
    """A non-retryable provider error (4xx, bad request, etc.)."""


@dataclass
class CommercialResponse:
    text: str
    tokens_in: int
    tokens_out: int
    cost: float
    model_id: str = "commercial-stub-v1"
    provider: str = "stub"
    raw: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "model_id": self.model_id,
            "provider": self.provider,
            "text": self.text,
            "tokens_in": self.tokens_in,
            "tokens_out": self.tokens_out,
            "cost": self.cost,
            "raw": self.raw,
        }


class CommercialModelAdapter:
    """Provider-neutral contract with a stub implementation in test mode."""

    ID = "commercial-stub-v1"

    def __init__(
        self,
        *,
        provider: str = "stub",
        api_key: Optional[str] = None,
        approved: bool = False,
        cost_per_1k_tokens: float = 0.001,
        model_id: str = "commercial-stub-v1",
        simulate_outage: bool = False,
    ) -> None:
        self.provider = provider
        self.approved = approved
        self.cost_per_1k_tokens = cost_per_1k_tokens
        self.model_id = model_id
        self.simulate_outage = simulate_outage
        if api_key is not None:
            self._api_key = api_key
        else:
            # Look in the environment, but never log it.
            self._api_key = os.environ.get("CPN4C_COMMERCIAL_KEY") or os.environ.get("COMMERCIAL_API_KEY")

    # ----- public contract ------------------------------------------------
    def complete(self, prompt: str, *, system: str = "", max_tokens: int = 512) -> CommercialResponse:
        if self.simulate_outage:
            raise ProviderOutage("simulated provider outage")
        if self.approved and not self._api_key:
            raise MissingApiKey("approved mode requires an API key; none provided")
        # Test mode (no key): return a deterministic canned response.
        tokens_in = max(1, len(system + prompt) // 4)
        text = self._canned(prompt, system)
        tokens_out = min(max_tokens, max(1, len(text) // 4))
        cost = (tokens_in + tokens_out) / 1000.0 * self.cost_per_1k_tokens
        return CommercialResponse(
            text=text,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            cost=cost,
            model_id=self.model_id,
            provider=self.provider,
            raw={"mode": "test" if not self.approved else "approved"},
        )

    # ----- internals ------------------------------------------------------
    def _canned(self, prompt: str, system: str) -> str:
        if "verify" in system.lower():
            return '{"verdict":"ACCEPT","reason":"citations present (commercial stub)"}'
        if "plan" in system.lower():
            return (
                '{"plan":"retrieve-then-act (commercial stub)",'
                '"tool":"search_docs","args":{"q":"rollback budget"},"needs_citations":true}'
            )
        # Default: produce a grounded-style answer with a citation.
        return (
            '{"answer":"Rollback restores the previous production model version after a gate failure. '
            '[doc_id=rollback]","citations":[{"doc_id":"rollback"}]}'
        )
