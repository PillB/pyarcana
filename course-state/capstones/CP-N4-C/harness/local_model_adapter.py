"""Deterministic, keyless, rule/template-based local model adapter.

This adapter is the *fallback* and *no-key* path required by the ADR. It never
touches the network, never reads a key, and produces output that depends only
on its inputs (plus the contents of the synthetic KB). It is intentionally
unimpressive — its job is to make the harness runnable end-to-end in any
environment.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


# Approximate token accounting: 1 token ~= 4 chars. Good enough for budgets.
_CHARS_PER_TOKEN = 4


def _estimate_tokens(text: str) -> int:
    return max(1, len(text) // _CHARS_PER_TOKEN)


@dataclass
class LocalResponse:
    text: str
    tokens_in: int
    tokens_out: int
    cost: float = 0.0
    model_id: str = "local-rules-v1"
    raw: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "model_id": self.model_id,
            "text": self.text,
            "tokens_in": self.tokens_in,
            "tokens_out": self.tokens_out,
            "cost": self.cost,
            "raw": self.raw,
        }


class LocalModelAdapter:
    """Rule/template-based generator.

    The adapter recognises a small set of *intents* (plan, answer, verify) and
    emits JSON-shaped strings the orchestrator can parse. Because the output is
    rule-based, identical inputs always produce identical outputs.
    """

    ID = "local-rules-v1"

    def __init__(self, kb: Optional[Dict[str, str]] = None) -> None:
        # A small built-in fallback KB so the adapter is usable standalone.
        self._kb = kb or {
            "rollback": "Rollback restores the previous production model version after a gate failure.",
            "pii": "Use synthetic data only in demos; no real PII.",
            "budget": "If cost or token budget is exceeded, abort the run and report BudgetExceeded.",
            "hitl": "Sensitive side effects (send_email, delete_records) require human approval.",
        }

    # ----- public contract (mirrors commercial adapter) -------------------
    def complete(self, prompt: str, *, system: str = "", max_tokens: int = 512) -> LocalResponse:
        tokens_in = _estimate_tokens(system + "\n" + prompt)
        text = self._respond(prompt, system)
        tokens_out = _estimate_tokens(text)
        return LocalResponse(
            text=text,
            tokens_in=tokens_in,
            tokens_out=min(tokens_out, max_tokens),
            cost=0.0,
        )

    # ----- internals ------------------------------------------------------
    def _respond(self, prompt: str, system: str) -> str:
        p = prompt.lower()
        s = system.lower()
        if "plan the next step" in s or "you are a generator" in s:
            return self._plan(prompt)
        if "verifier" in s or "you are a verifier" in s or "reject uncited" in s:
            return self._verify(prompt)
        if "answer using" in s or "you are an answer" in s:
            return self._answer(prompt)
        # Default: echo a deterministic summary of the prompt.
        return self._answer(prompt)

    def _plan(self, prompt: str) -> str:
        # Choose a deterministic tool based on the *task query*, not on the
        # boilerplate prompt template (which lists every tool name).
        query = self._extract_query(prompt).lower()
        if any(p in query for p in ("send email", "send an email", "email the", "compose email", "draft email")):
            tool, args = "send_email", {"to": "[email-redacted]", "subject": "ops update"}
        elif "summarize" in query:
            tool, args = "summarize", {"text": query[:200]}
        elif "report" in query:
            tool, args = "export_report", {"format": "md"}
        else:
            tool, args = "search_docs", {"q": self._extract_query(prompt)}
        return (
            '{"plan":"retrieve-then-act",'
            f'"tool":"{tool}",'
            f'"args":{self._json_args(args)},'
            '"needs_citations":true}'
        )

    def _verify(self, prompt: str) -> str:
        # Verifier rejects uncited grounded claims and disallowed tools.
        has_cite = "doc_id" in prompt or "cited" in prompt.lower()
        has_dangerous = any(t in prompt.lower() for t in ("delete_records", "shell_exec"))
        if has_dangerous:
            verdict = "REJECT"
            reason = "disallowed tool proposed"
        elif not has_cite and "rollback" in prompt.lower():
            verdict = "REJECT"
            reason = "grounded claim without citation"
        else:
            verdict = "ACCEPT"
            reason = "citations present, policy compliant"
        return f'{{"verdict":"{verdict}","reason":"{reason}"}}'

    def _answer(self, prompt: str) -> str:
        q = self._extract_query(prompt)
        hits = self._retrieve(q)
        if not hits:
            return '{"answer":"[ungrounded] no supporting documents","citations":[]}'
        # Build a sentence per hit with a citation.
        sentences = []
        citations = []
        for doc_id, text in hits[:3]:
            sentences.append(f"{text} [doc_id={doc_id}]")
            citations.append({"doc_id": doc_id})
        body = " ".join(sentences)
        return (
            '{"answer":"' + body.replace('"', "'") + '",'
            '"citations":' + self._json_args(citations).replace("[", "[").replace("]", "]") + "}"
        )

    def _retrieve(self, query: str) -> List[tuple]:
        q = query.lower()
        hits = []
        for k, v in self._kb.items():
            if k in q or any(tok and tok in v.lower() for tok in q.split()):
                hits.append((k, v))
        return hits

    @staticmethod
    def _extract_query(prompt: str) -> str:
        # Take the last quoted string, else the last 8 words.
        m = re.search(r'"([^"]+)"', prompt)
        if m:
            return m.group(1)
        words = prompt.split()
        return " ".join(words[-8:])

    @staticmethod
    def _json_args(args: Any) -> str:
        import json
        return json.dumps(args, sort_keys=True)
