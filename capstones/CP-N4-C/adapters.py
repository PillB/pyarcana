"""CP-N4-C — provider-neutral model adapters.

Mirrors src/lib/copilot-harness.ts ModelAdapter contract:
  - NoKeyAdapter: deterministic double, no paid key required.
  - LocalAdapter: HTTP fetch to a local server with timeout + fallback.
  - CommercialTestAdapter: sandbox-only; falls back to no-key when no key set.
"""
from __future__ import annotations

import json
import time
import urllib.request
import urllib.error
from typing import Any, Protocol


class ModelRequest:
    def __init__(self, system_prompt: str, user_prompt: str,
                 max_tokens: int = 256, temperature: float = 0.0):
        self.system_prompt = system_prompt
        self.user_prompt = user_prompt
        self.max_tokens = max_tokens
        self.temperature = temperature


class ModelResponse:
    def __init__(self, text: str, finish_reason: str, tokens_in: int,
                 tokens_out: int, cost_usd: float, latency_ms: int, provider: str):
        self.text = text
        self.finish_reason = finish_reason
        self.tokens_in = tokens_in
        self.tokens_out = tokens_out
        self.cost_usd = cost_usd
        self.latency_ms = latency_ms
        self.provider = provider

    def to_dict(self) -> dict:
        return {k: getattr(self, k) for k in
                ("text", "finish_reason", "tokens_in", "tokens_out", "cost_usd", "latency_ms", "provider")}


class ModelAdapter(Protocol):
    name: str
    mode: str

    def generate(self, req: ModelRequest) -> ModelResponse: ...


# Deterministic corpus used by the no-key adapter.
DETERMINISTIC_CORPUS = [
    {"doc": "compliance-memo-001.md", "scope": "internal",
     "text": "Client ACME-001 must complete KYC refresh by Q3. Reviewer: ana.review@synthetic.example."},
    {"doc": "policy-er-001.md", "scope": "public",
     "text": "Entity resolution evidence must not be used to infer kinship, fraud, or beneficial ownership."},
    {"doc": "ops-runbook-001.md", "scope": "restricted",
     "text": "To send an external email, obtain human approval and use only allowlisted recipients."},
]


class NoKeyAdapter:
    name = "deterministic-double"
    mode = "no-key"

    def generate(self, req: ModelRequest) -> ModelResponse:
        start = time.monotonic()
        tokens = [w for w in req.user_prompt.lower().split() if len(w) > 3]
        hits = [d for d in DETERMINISTIC_CORPUS if any(t in d["text"].lower() for t in tokens)]
        text = (
            f"Deterministic summary: {' '.join(h['text'] for h in hits)}"
            if hits else
            "Deterministic summary: no direct corpus match; abstaining from unsupported claims."
        )
        return ModelResponse(
            text=text, finish_reason="stop",
            tokens_in=len(req.user_prompt) // 4, tokens_out=len(text) // 4,
            cost_usd=0.0, latency_ms=int((time.monotonic() - start) * 1000),
            provider=self.name,
        )


class LocalAdapter:
    """Calls a local server (e.g. ollama). Falls back to NoKeyAdapter on any error."""
    name = "local-model"
    mode = "local"
    endpoint = "http://127.0.0.1:11434/api/generate"
    timeout_s = 2.0

    def __init__(self):
        self._fallback = NoKeyAdapter()

    def generate(self, req: ModelRequest) -> ModelResponse:
        try:
            payload = json.dumps({"model": "pyarcana-local", "prompt": req.user_prompt,
                                  "stream": False}).encode("utf-8")
            r = urllib.request.urlopen(
                urllib.request.Request(self.endpoint, data=payload,
                                       headers={"Content-Type": "application/json"}),
                timeout=self.timeout_s)
            data = json.loads(r.read().decode("utf-8"))
            return ModelResponse(
                text=data.get("response", "(empty local response)"),
                finish_reason="stop",
                tokens_in=len(req.user_prompt) // 4,
                tokens_out=len(data.get("response", "")) // 4,
                cost_usd=0.0, latency_ms=0, provider=self.name,
            )
        except (urllib.error.URLError, OSError, json.JSONDecodeError, TimeoutError):
            # Provider outage → fallback to no-key deterministic double.
            return self._fallback.generate(req)


class CommercialTestAdapter:
    """Sandbox-only. Falls back to no-key when no PYARCANA_COMMERCIAL_TEST_KEY set."""
    name = "commercial-test"
    mode = "commercial-test"
    endpoint = "https://api.sandbox.example.com/v1/chat"
    timeout_s = 2.0

    def __init__(self):
        import os
        self._key = os.environ.get("PYARCANA_COMMERCIAL_TEST_KEY")
        self._fallback = NoKeyAdapter()

    def generate(self, req: ModelRequest) -> ModelResponse:
        if not self._key:
            return self._fallback.generate(req)
        try:
            payload = json.dumps({"prompt": req.user_prompt, "max_tokens": req.max_tokens}).encode("utf-8")
            r = urllib.request.urlopen(
                urllib.request.Request(self.endpoint, data=payload,
                                       headers={"Content-Type": "application/json",
                                                "Authorization": f"Bearer {self._key}"}),
                timeout=self.timeout_s)
            data = json.loads(r.read().decode("utf-8"))
            return ModelResponse(
                text=data.get("text", ""),
                finish_reason=data.get("finish_reason", "stop"),
                tokens_in=data.get("tokens_in", 0), tokens_out=data.get("tokens_out", 0),
                cost_usd=data.get("cost_usd", 0.0),
                latency_ms=int((time.monotonic()) * 1000) % 1000,
                provider=self.name,
            )
        except (urllib.error.URLError, OSError, json.JSONDecodeError, TimeoutError):
            return self._fallback.generate(req)


ADAPTERS = {
    "no-key": NoKeyAdapter,
    "local": LocalAdapter,
    "commercial-test": CommercialTestAdapter,
    "commercial-approved": CommercialTestAdapter,  # same stub; approval is a flag
}


def get_adapter(mode: str) -> ModelAdapter:
    if mode not in ADAPTERS:
        raise ValueError(f"unknown provider mode: {mode}")
    return ADAPTERS[mode]()
