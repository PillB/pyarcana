# Runtime Validation Matrix

## CP-N4-C harness (23 controls)

| Mechanism | Module | Status |
|---|---|---|
| Local adapter | local_model_adapter.py | ✓ |
| Commercial adapter | commercial_model_adapter.py | ✓ |
| Provider fallback | provider.py | ✓ |
| RAG citation | rag.py | ✓ |
| Access filtering | rag.py | ✓ |
| Web adapter | web_adapter.py | ✓ |
| Tool allowlist | tools.py | ✓ |
| Human approval | tools.py | ✓ |
| Idempotency | tools.py | ✓ |
| Max steps (8) | orchestrator.py | ✓ |
| Max tool calls (12) | orchestrator.py | ✓ |
| Budget enforcement | budget.py | ✓ |
| Loop detection | orchestrator.py | ✓ |
| Durable resume | state.py | ✓ |
| Verifier rejection | orchestrator.py | ✓ |
| Trace redaction | tracing.py | ✓ |
| OTel GenAI export | otel_export.py | ✓ |
| Rollback | rollback.py | ✓ |
| Incident log | incident.py | ✓ |
| Evaluation | evaluation.py | ✓ |
| Versioning | versions.py | ✓ |
| Demo | demo.py | ✓ |
| Adversarial tests | tests/ | ✓ |

## CP-FINAL integration (6 tests)

| Test | Module | Status |
|---|---|---|
| 12 contract tests | contract_tests.py | ✓ |
| E2E trace | e2e_test.py | ✓ |
| Backup/restore | backup_restore.py | ✓ |
| No-go condition | no_go.py | ✓ |
| Dependency graph | dependency_graph.py | ✓ |
| Shared scenario | shared_scenario.py | ✓ |
