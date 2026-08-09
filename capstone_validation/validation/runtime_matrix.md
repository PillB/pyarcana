# Runtime Validation Matrix

**Generated:** 2026-08-09 · **Scope:** CP-N4-C harness + CP-FINAL integration · **Method:** Python execution

## Summary

The CP-N4-C multi-agent harness runs end-to-end in the deterministic no-key
mode. All 13 capstone `demo.py` scripts exit 0. The CP-FINAL integration
runs all 12 contract tests and the end-to-end trace.

## CP-N4-C harness runtime

| Mechanism | Module | Status | Evidence |
|---|---|---|---|
| Local-model adapter | `local_model_adapter.py` | ✓ pass | Deterministic, keyless, no network |
| Commercial-model adapter | `commercial_model_adapter.py` | ✓ pass | Provider-neutral contract; no-key fallback |
| Provider fallback | `provider.py` | ✓ pass | Commercial → local fallback; incident logged |
| No-key deterministic mode | `provider.py` | ✓ pass | `LOCAL` mode; CI-safe |
| RAG citation | `rag.py` | ✓ pass | Per-doc ACL; per-claim citations; answer grading |
| Access filtering | `rag.py` | ✓ pass | Docs filtered by principal ACL before retrieval |
| Web-result provenance | `web_adapter.py` | ✓ pass | Synthetic SERP; `wrap_as_data()` injection defence |
| SERP unavailability | `web_adapter.py` | ✓ pass | Fallback to local; incident logged |
| Prompt-injection defence | `web_adapter.py` + `evaluation.py` | ✓ pass | `wrap_as_data()` strips instructions; red-team cases |
| Tool allowlist | `tools.py` | ✓ pass | allow/require_human/deny policy |
| Human approval | `tools.py` | ✓ pass | `require_human` pauses in `AWAITING_HUMAN` |
| Idempotency | `tools.py` | ✓ pass | `idempotency_key()` per tool call |
| Maximum steps | `orchestrator.py` | ✓ pass | max 8 steps; `BudgetExceeded` abort |
| Maximum tool calls | `orchestrator.py` | ✓ pass | max 12 tool calls |
| Maximum cost | `budget.py` | ✓ pass | `Budget.charge`; `BudgetExceeded` abort |
| Timeout | `provider.py` | ✓ pass | Per-call timeout; classified retry |
| Infinite-loop stop | `orchestrator.py` | ✓ pass | `step_fingerprint()` loop detection |
| Durable resume | `state.py` | ✓ pass | `state.json` persisted; resume from `AWAITING_HUMAN` |
| Verifier rejection | `orchestrator.py` | ✓ pass | Generator-verifier handoff; verifier can reject |
| Sensitive trace redaction | `tracing.py` | ✓ pass | `redact()` scrubs emails, tokens, keys |
| Rollback | `rollback.py` | ✓ pass | Snapshot + restore + `RollbackProof` |
| Incident record | `incident.py` | ✓ pass | Append-only log; every notable event recorded |
| OTel GenAI export | `otel_export.py` | ✓ pass | `export_otlp_json()` maps to gen_ai.* conventions |

## CP-FINAL integration runtime

| Test | Module | Status | Evidence |
|---|---|---|---|
| 12 contract tests | `contract_tests.py` | ✓ pass | All 12 interfaces honor their contracts |
| End-to-end trace | `e2e_test.py` | ✓ pass | Shared traceId spans all 12 calls |
| Backup/restore | `backup_restore.py` | ✓ pass | Snapshot restored to known state |
| Rollback drill | `backup_restore.py` | ✓ pass | Rollback to last-known-good executed |
| No-go condition | `e2e_test.py` | ✓ pass | `noGo=true` when any interface fails SLO |
| Dependency graph | `dependency_graph.json` | ✓ pass | 12 upstream → CP-FINAL edges documented |
