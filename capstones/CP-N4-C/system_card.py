"""CP-N4-C — system card generator (mirrors src/data/system-cards/CP-N4-C)."""
from __future__ import annotations

import json
from typing import Any

TEMPLATE = """# System Card — CP-N4-C Auditable Multi-Agent AI Operations Copilot

## 1. Summary
{summary}

## 2. Intended use
Operations copilot on synthetic tasks. NOT a chatbot. NOT an automated
adverse-decision system.

## 3. Out of scope
- No real PII.
- No unreviewed adverse decisions.
- No untrusted web text treated as trusted instruction.

## 4. Architecture
Provider-neutral ModelAdapter (no-key deterministic / local / commercial-test),
bounded orchestrator, RAG with access filtering + citations, narrow tools with
allowlist + approval gate, web/SERP with injection defence, OTel GenAI spans.

## 5. Evaluation
Run result for the demonstration task:
- provider_mode: {provider_mode}
- steps: {steps}
- tool_calls: {tool_calls}
- cost_usd: {cost_usd}
- verifier: {verifier}
- citations: {citations_count}
- approval_status: {approval_status}
- stopped_safely: {stopped_safely}
- stop_reason: {stop_reason}

## 6. Ethical considerations
Human approval required for sensitive side effects. No unreviewed adverse
decision. Correction and appeal path documented.

## 7. Threat model (OWASP LLM Top 10 2025)
- LLM01 Prompt injection → input classifier + structured output + tool allowlist.
- LLM02 Insecure output → schema validation on tool args.
- LLM04 Model DoS → rate limits + budget envelope.
- LLM06 Sensitive disclosure → redaction in every span.
- LLM07 Insecure plugin → tool allowlist.
- LLM08 Excessive agency → bounded loops + approval gate.
- LLM09 Overreliance → verifier + abstention.

## 8. Governance
G1 plan, G2 retrieve, G3 propose-tool, G4 verify, G5 approve (if sensitive),
G6 cite, G7 trace, G8 recover/stop.

## 9. Incident response
Runbook: on no-go condition, stop safely, preserve trace, escalate to
ana.review@synthetic.example.

## 10. Rollback / recovery
Last-known-good checkpoint in run_state.json. Durable resume from
`--resume <run_id>`.

## 11. Audit history
Every run emits a trace.json. Traces are append-only and redacted.

## 12. Correction / appeal
Submit a correction to the data steward; record is appended, not overwritten.

## 13. No-go conditions
{nogo}

## 14. Regulatory mapping (EU AI Act Annex IV)
- Annex IV §1(a): provider — PyArcana (synthetic).
- Annex IV §1(b): system name — CP-N4-C.
- Annex IV §1(c): intended use — see §2.
- Annex IV §1(d): date — see run_result.json.
- Annex IV §1(e): version — see run_result.json.
"""


def generate_card(run_result: dict, trace: list) -> str:
    nogo = "\n".join(f"- {n}" for n in run_result.get("no_go_conditions", []))
    return TEMPLATE.format(
        summary=f"Copilot run {run_result.get('run_id','?')} on task: {run_result.get('task','?')[:80]}",
        provider_mode=run_result.get("provider_mode", "?"),
        steps=run_result.get("steps", 0),
        tool_calls=run_result.get("tool_calls", 0),
        cost_usd=run_result.get("cost_usd", 0.0),
        verifier=run_result.get("verifier", {}),
        citations_count=len(run_result.get("citations", [])),
        approval_status=run_result.get("approval_status", "?"),
        stopped_safely=run_result.get("stopped_safely", False),
        stop_reason=run_result.get("stop_reason", "?"),
        nogo=nogo or "(none)",
    )
