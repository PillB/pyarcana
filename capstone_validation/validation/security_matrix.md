# Security Validation Matrix

**Generated:** 2026-08-09 · **Scope:** All 13 capstones + CP-N4-C harness · **Method:** Automated scan + manual review

## Summary

No secrets, no real PII, no unsafe SQL, no unapproved side effects, no
unsupported adverse inferences. All data is synthetic (CC0). Tool allowlists
and sandboxing enforced. Sensitive-data redaction applied to all traces.

## Security constraints per capstone

| Capstone | No secrets | No real PII | Synthetic data | Input validation | Secure logging | Least privilege | Rollback |
|---|---|---|---|---|---|---|---|
| CP-N1-A | ✓ | ✓ | ✓ generate.py | ✓ argparse | ✓ stdout only | ✓ CLI scope | N/A |
| CP-N1-B | ✓ | ✓ | ✓ | ✓ contracts | ✓ manifests | ✓ file scope | ✓ recovery drill |
| CP-N1-C | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ no auto-decision | N/A |
| CP-N2-A | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| CP-N2-B | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| CP-N2-C | ✓ | ✓ | ✓ | ✓ | ✓ redacted | ✓ allowlist | ✓ audit trail |
| CP-N3-A | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ no relationship inference | N/A |
| CP-N3-B | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ auth filter | ✓ correction |
| CP-N3-C | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ abstention | ✓ model card |
| CP-N4-A | ✓ | ✓ | ✓ | ✓ schema | ✓ structured | ✓ non-root | ✓ backup/restore |
| CP-N4-B | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ approval gate | ✓ proven rollback |
| CP-N4-C | ✓ | ✓ | ✓ | ✓ | ✓ redacted | ✓ tool allowlist | ✓ rollback proof |
| CP-FINAL | ✓ | ✓ | ✓ | ✓ contracts | ✓ aggregated | ✓ no-go conditions | ✓ disaster exercise |

## CP-N4-C harness security controls

| OWASP LLM Top 10 (2025) | Threat | Control | Evidence |
|---|---|---|---|
| LLM01 | Prompt injection | `wrap_as_data()` strips instructions; web is DATA never INSTRUCTION; tool allowlist | `web_adapter.py`, `tools.py` |
| LLM02 | Insecure output handling | Verifier gates claims before cited output; schema validation | `orchestrator.py` |
| LLM03 | Training data poisoning | Versioned indexes; synthetic KB (CC0) | `rag.py`, `versions.json` |
| LLM04 | Model DoS | Rate limits; budget envelopes (max steps, tool calls, cost) | `budget.py`, `orchestrator.py` |
| LLM05 | Supply chain | Pinned dependencies; `versions.json` manifest | `versions.py` |
| LLM06 | Sensitive disclosure | `redact()` scrubs emails, tokens, keys before persist | `tracing.py` |
| LLM07 | Insecure plugin | Tool allowlist (allow/require_human/deny); sandboxing | `tools.py` |
| LLM08 | Excessive agency | Bounded loops; `require_human` for side effects | `orchestrator.py`, `tools.py` |
| LLM09 | Overreliance | Verifier + abstention; faithfulness threshold | `orchestrator.py`, `rag.py` |
| LLM10 | Model theft | No real keys in repo; access controls on adapters | `commercial_model_adapter.py` |

## Dependency scanning

- `bun.lock` and `package.json` pinned; no `*` or `latest` versions.
- Python `requirements.txt` (where present) uses `==` pinning.
- No `eval()`, `exec()`, or `subprocess.shell=True` with untrusted input.
