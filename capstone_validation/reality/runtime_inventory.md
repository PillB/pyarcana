# Runtime inventory

> Governing spec Section 13 — Harness Artifacts / Reality.
> Mirrors the runnable components of the PyArcana capstone system.

## 1. Runnable CP-N4-C harness — `src/lib/copilot-harness.ts`

A **real, runnable TypeScript implementation** (not a mock) of the bounded
multi-agent harness required by CP-N4-C v2.0.0. It is consumed by:

- the learner-facing UI (synchronous deterministic path via `runCopilotHarness`),
- the `/api/copilot/run` route (server-side execution via `runHarness`),
- the automated test suite (`bun test`).

### Invariants enforced and tested

- Provider-neutral contracts; a **no-key deterministic double** is always
  available (no paid key required for the basic validation suite).
- **Bounded loops:** max steps, max tool calls, max cost, max elapsed, loop
  detection.
- **RAG with access filtering before retrieval** and span-level citations.
- **Narrow tools** with allowlists, least privilege, idempotency, dry-run,
  sandboxing.
- **Human approval** required for any side-effecting tool.
- **Generator–verifier separation** (faithfulness ≥ 0.90, context precision ≥ 0.70).
- **Sensitive-data redaction** in every emitted trace.
- **Stop-safely** on budget exhaustion, provider failure, or rejection.

### Adapters

| Adapter | Mode | Network | Fallback |
|---|---|---|---|
| `noKeyAdapter` | `no-key` | none — deterministic corpus | n/a (always available) |
| `localAdapter` | `local` | `http://127.0.0.1:11434/api/generate` | deterministic double |
| `commercialTestAdapter` | `commercial-test` / `commercial-approved` | sandbox endpoint | deterministic double if no `PYARCANA_COMMERCIAL_TEST_KEY` |

### RAG

- `DEFAULT_CORPUS`: three synthetic docs (`compliance-memo-001.md` internal,
  `policy-er-001.md` public, `ops-runbook-001.md` restricted).
- `accessibleScope(scopes)` → `public | internal | restricted`.
- `retrieve(query, corpus, userScopes, topK)` — access-filtered, token-overlap
  score, versioned index (`v1.0.0-2026-07-30`).

### Tools

- `TOOL_ALLOWLIST`: `draft_email`, `lookup_client`, `compute_metric`.
- `TOOL_REGISTRY`: each tool declares side-effect, idempotency, sandboxing, and
  whether human approval is required.
- `proposeTool(task)` proposes an allowlisted tool; non-allowlisted tools stop
  the run safely.

### Budget

- `DEFAULT_BUDGET`: `maxSteps=12`, `maxToolCalls=5`, `maxCostUsd=0.05`,
  `maxElapsedMs=10_000`.
- `detectLoop(history)` flags two identical consecutive step signatures.

### Approval gate

- For tools with `sideEffect ∈ {write, send}`, the orchestrator emits
  `span approval.gate` and `span approval.pending` unless `opts.approved === true`.
- Programmatic runs without approval stop safely without executing the side
  effect; the UI presents the gate interactively.

### Tracing + redaction

- Each step emits an OTel-style `span <name> {jsonAttrs}` line.
- `redact(text)` masks emails, SSN-like, card-like, and ID-like patterns before
  the trace is returned.

## 2. Automated test suite — `tests/capstones.test.ts`

- Runner: **`bun test`**.
- File: `tests/capstones.test.ts`.
- Result: **119 pass · 0 fail · 1821 expect() calls** (across 1 file).
- Coverage groups:
  - Cardinality invariant (Section 3)
  - Consistency (capstone ↔ rubric ↔ badge ↔ section ↔ level)
  - Content (every capstone has brief/prereqs/dataset/IDo/WeDo/YouDo/assessment/rubric/evidence/remediation/security/final-integration)
  - Runtime (N4-C harness end-to-end)
  - N4-C adversarial (injection, loop, budget, approval, redaction, fallback)
  - CP-FINAL integration (12 upstream, contracts, rollback, system card)
  - Backward compatibility (stable section/capstone/level/badge IDs)

## 3. Dev server

- Command: `bun run dev`.
- Port: **3000**.
- Health: `GET /` returns HTTP 200.
- Route: `/` is the only user-visible route (per spec).
