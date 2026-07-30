# ADR — CP-N4-C agentic harness (N4-D fold)

> Status: accepted.
> Date: 2026-07-30.
> Governing spec: Section 9 (CP-N4-C) and the N4-D decision recorded in
> `/home/z/my-project/worklog.md`.
> Source of truth: `src/data/capstones.ts` (`CP_N4_C`), `src/lib/copilot-harness.ts`.

## Context

The governing spec requested a **production multi-agent project** as part of
Level 4. Two designs were considered:

- **Option A — add a fourteenth principal capstone `CP-N4-D`.** This would break
  the 13-capstone invariant, force a UI grid change, and require migrating every
  downstream consumer (rubrics, badges, sections, tests, final-integration
  contracts).
- **Option B — fold the project into `CP-N4-C` as a v2.0.0 expansion with three
  sub-gates.** This preserves the 13-capstone invariant, keeps `CP-N4-C` as the
  stable ID, and lets the spec-required multi-agent project live inside an
  existing principal capstone.

The default per spec is Option B. This ADR records that decision and the
resulting contract.

## Decision

**Option B is adopted.** No `CP-N4-D` principal capstone is created.

`CP-N4-C` is bumped from v1.x to **v2.0.0** and expanded to include the
requested production multi-agent project via three sub-gates:

| Sub-gate | Section | Scope |
|---|---|---|
| `CP-N4-C.1` | S49 | Harness, adapters, RAG, tools, web/SERP, budget, approval — model portability (local / commercial-test / commercial-approved / no-key deterministic), bounded loops, RAG with access filtering + citations, narrow tools with allowlists, human approval for sensitive side effects, web/SERP with provenance + injection defence. |
| `CP-N4-C.2` | S50 | Evaluation, red-team, reliability, recovery — deterministic checks, task-level holdout, trajectory + tool-argument eval, recovery eval, calibrated judges, injection / exfiltration / misuse / infinite-loop / cost-exhaustion / context-poisoning / provider-failure / unauthorised-side-effect red-team. |
| `CP-N4-C.3` | S51 | Observability, governance, incident-response, UX, final CP-N4-C gate — OTel GenAI spans, sensitive-data redaction, versioned models/prompts/datasets/indexes, latency/token/cost metrics, quality indicators, incident handling, rollback, audit history, correction and appeal, accessible interface, system card, no-go conditions. |

`CP-N4-C.3 · S51` remains the **principal gate** of CP-N4-C. The capstone's
`gateSection` is `"S51"` (unchanged from v1.x).

## Implementation

The runnable harness lives in `src/lib/copilot-harness.ts` (see
`reality/runtime_inventory.md` for the full inventory). It is consumed by:

- the learner UI (synchronous deterministic path: `runCopilotHarness`),
- the `/api/copilot/run` route (server-side: `runHarness`),
- the automated test suite (119 tests, including the CP-N4-C adversarial block).

The harness enforces every critical criterion in the v2.0.0 rubric:

- `BL` — Bounded loops (`DEFAULT_BUDGET` + `detectLoop`).
- `CI` — RAG citations + access filtering + injection defence (`retrieve` +
  `verify` faithfulness ≥ 0.90 + access scope filtering).
- `HR` — Human approval for sensitive side effects (`approval.gate` span; no
  cited output produced without approval).
- `TR` — Redacted OTel traces + system card + incident response (`redact` on
  every emitted span; `demoRequirements` includes incident-response drill and
  system card).
- `EV` — Eval suite (holdout, trajectory, injection, tool-misuse,
  cost-exhaustion, recovery) — encoded in `testRequirements` and exercised by
  the adversarial tests.

## Consequences

- The 13-capstone invariant is preserved (see `ADR-capstone-cardinality.md`).
- `CP-N4-C` is the only capstone whose `version` is `2.0.0`; all other
  principal capstones are at `1.2.0`–`1.4.0`. This makes the v1 → v2 migration
  visible in the ledger (`capstones/capstone_ledger.json`).
- The v1 → v2 migration is **backward compatible** (see
  `architecture/migration_plan.md`): capstone ID, gate section, badge ID, and
  rubric ID are all preserved.
- A rollback path exists (see `architecture/rollback_plan.md`).
