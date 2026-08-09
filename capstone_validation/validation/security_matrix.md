# Security Validation Matrix

## OWASP LLM Top 10 (2025) — CP-N4-C harness

| ID | Threat | Control |
|---|---|---|
| LLM01 | Prompt injection | web_adapter.wrap_as_data(); tool allowlist |
| LLM02 | Insecure output | Verifier gates; schema validation |
| LLM03 | Data poisoning | Versioned indexes; synthetic KB (CC0) |
| LLM04 | Model DoS | Budget envelopes; max steps/tool calls |
| LLM05 | Supply chain | Pinned versions.json manifest |
| LLM06 | Sensitive disclosure | tracing.redact() + otel_export applies redact() before mapping |
| LLM07 | Insecure plugin | Tool allowlist (allow/require_human/deny) |
| LLM08 | Excessive agency | Bounded loops; require_human for side effects |
| LLM09 | Overreliance | Verifier + abstention; faithfulness threshold |
| LLM10 | Model theft | No real keys; access controls on adapters |

All 13 capstones: no secrets, no real PII, synthetic data, input validation, secure logging, least privilege.
