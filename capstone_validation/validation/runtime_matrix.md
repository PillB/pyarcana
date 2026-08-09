# Runtime matrix

> Governing spec Section 9 (CP-N4-C harness) and Section 13 (Harness Artifacts /
> Validation).
> Source of truth: `src/lib/copilot-harness.ts`, `tests/capstones.test.ts`,
> `src/app/page.tsx`.

## N4-C harness — runs without a paid key

`src/lib/copilot-harness.ts` ships a **no-key deterministic double**
(`noKeyAdapter`) that always produces a citation-grounded answer from a tiny
built-in corpus. The default `runCopilotHarness()` and `runHarness()` paths use
this adapter when no other is configured, so the basic validation suite is
reproducible without any paid key.

- Deterministic corpus: 3 synthetic docs (`compliance-memo-001.md` internal,
  `policy-er-001.md` public, `ops-runbook-001.md` restricted).
- Provider modes: `no-key`, `local`, `commercial-test`, `commercial-approved`.
- Fallback chain: `local` → `no-key` (on provider outage); `commercial-test`
  → `no-key` (when `PYARCANA_COMMERCIAL_TEST_KEY` is unset or the call fails).

## N4-C harness — runtime invariants (all enforced and tested)

| Invariant | Implementation | Test |
|---|---|---|
| Bounded loops | `DEFAULT_BUDGET` (steps=12, toolCalls=5, cost=$0.05, elapsed=10s); `detectLoop()` | `tests/capstones.test.ts` *N4-C adversarial* block |
| RAG citations + access filtering + injection defence | `retrieve()` filters by `accessibleScope()`; `verify()` enforces faithfulness ≥ 0.90 + context precision ≥ 0.70 | *N4-C adversarial* block |
| Human approval for sensitive side effects | `approval.gate` span; no cited output without approval | *N4-C adversarial* block |
| Redacted OTel traces | `redact()` applied to every emitted span | *N4-C adversarial* block |
| Stop-safely on budget / provider failure / rejection | `stoppedSafely` + `stopReason` returned | *N4-C adversarial* block |
| Generator–verifier separation | `verify()` is a separate function from `adapter.generate()` | *N4-C adversarial* block |
| No polished chatbot without harness controls | Critical failure in `RUBRICS["CP-N4-C"].criticalFailures` | *N4-C adversarial* block |

## Automated test suite

- Runner: **`bun test`**.
- File: `tests/capstones.test.ts`.
- Result (live):
  ```
  119 pass
  0 fail
  1821 expect() calls
  Ran 119 tests across 1 file. [68.00ms]
  ```
- Coverage groups (all pass):
  - Cardinality invariant (Section 3)
  - Consistency
  - Content (per-capstone completeness)
  - Runtime (CP-N4-C end-to-end)
  - CP-N4-C adversarial (injection, loop, budget, approval, redaction, fallback)
  - CP-FINAL integration (12 upstream, contracts, rollback, system card)
  - Backward compatibility (stable IDs)

## Dev server

- Command: `bun run dev`.
- Port: **3000**.
- Health: `GET http://localhost:3000/` → **HTTP 200** (verified with `curl`).
- Route: `/` is the only user-visible route.
