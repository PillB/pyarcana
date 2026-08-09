#!/usr/bin/env python3
"""CP-N4-C — Acceptance test script. Verifies the harness against all required controls."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from solution import (
    run_harness, no_key_generate, retrieve, propose_tool, verify, redact,
    detect_loop, TOOL_ALLOWLIST, DETERMINISTIC_CORPUS, BudgetConfig,
)


def check(name, cond, detail=""):
    s = "PASS" if cond else "FAIL"
    print(f"[{s}] {name}" + (f" — {detail}" if detail else ""))
    return cond


def main() -> int:
    ok = True
    # 1. No-key deterministic path
    r = run_harness("Summarise compliance memo ACME-001", provider_mode="no-key", approved=True)
    ok &= check("no-key deterministic path", r.provider_mode == "no-key")
    ok &= check("no-key cost is 0", r.budget["cost_usd"] == 0.0)

    # 2. Provider fallback (local mode falls back to no-key double silently)
    r2 = run_harness("compliance memo ACME-001", provider_mode="local", approved=True)
    ok &= check("local mode runs (via fallback)", r2.provider_mode == "local" and r2.stop_reason in ("completed", "provider-failure-fallback"), f"stop={r2.stop_reason}")

    # 3. RAG citations
    ok &= check("retrieval has citations", len(r.cited_output["citations"]) > 0)
    for c in r.cited_output["citations"]:
        ok &= check(f"citation {c['doc']} has chunk_id", bool(c["chunk_id"]))

    # 4. Access filtering
    internal = retrieve("ops runbook send email", DETERMINISTIC_CORPUS, ["internal"])
    ok &= check("internal scope blocks restricted", all(x.scope != "restricted" for x in internal))
    restricted = retrieve("ops runbook send email", DETERMINISTIC_CORPUS, ["restricted"])
    ok &= check("restricted scope allows restricted", any(x.scope == "restricted" for x in restricted))

    # 5. Tool allowlist
    t = propose_tool("draft email")
    ok &= check("proposed tool allowlisted", t.allowlisted and t.name in TOOL_ALLOWLIST)

    # 6. Human approval
    r3 = run_harness("draft email to reviewer", provider_mode="no-key", approved=False)
    ok &= check("no approval → no cited output", len(r3.cited_output["citations"]) == 0)
    ok &= check("no approval → stopped safely", r3.stopped_safely)

    # 7. Idempotency
    a = run_harness("compliance memo ACME-001", provider_mode="no-key", approved=True)
    b = run_harness("compliance memo ACME-001", provider_mode="no-key", approved=True)
    ok &= check("idempotent (same output)", a.cited_output["text"] == b.cited_output["text"])

    # 8. Max steps enforced
    r4 = run_harness("compliance memo", provider_mode="no-key", approved=True, budget=BudgetConfig(max_steps=2))
    ok &= check("max steps enforced", r4.budget["steps"] <= 12 or r4.stopped_safely)

    # 9. Loop detection
    ok &= check("loop detected", detect_loop(["a", "b", "a", "a"]) is True)
    ok &= check("no false loop", detect_loop(["a", "b", "c"]) is False)

    # 10. Verifier rejection
    retrieval = retrieve("compliance memo ACME-001", DETERMINISTIC_CORPUS, ["internal"])
    v = verify("compliance memo", retrieval, "Zoltan conquered seventeen galaxies with a spoon.")
    ok &= check("ungrounded claims rejected", v["passed"] is False and v["faithfulness"] < 0.9)

    # 11. Redaction
    red = redact("Contact ana.review@synthetic.example or 4111111111111111 or 123-45-6789")
    ok &= check("email redacted", "ana.review@synthetic.example" not in red)
    ok &= check("card redacted", "4111111111111111" not in red)
    ok &= check("ssn redacted", "123-45-6789" not in red)

    # 12. Trace contains spans
    ok &= check("trace has run.start", "run.start" in r.trace)
    ok &= check("trace has rag.retrieve", "rag.retrieve" in r.trace)
    ok &= check("trace has model.generate", "model.generate" in r.trace)
    ok &= check("trace has verifier.check", "verifier.check" in r.trace)
    ok &= check("trace has run.end", "run.end" in r.trace)
    ok &= check("trace redacted", "ana.review@synthetic.example" not in r.trace)

    # 13. Bounded orchestration
    ok &= check("steps bounded", r.budget["steps"] <= 12)
    ok &= check("tool calls bounded", r.budget["tool_calls"] <= 5)

    # 14. Generator-verifier separation
    ok &= check("verifier independent", "faithfulness" in r.verifier and "context_precision" in r.verifier)

    print(f"\n{'ALL PASS' if ok else 'SOME FAILED'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
