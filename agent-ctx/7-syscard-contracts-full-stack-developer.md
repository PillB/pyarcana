# Task 7-syscard-contracts — Work Record

**Agent**: full-stack-developer
**Task**: Implement system card artifacts (Gap C) + CP-FINAL contract tests (Gap D)
**Status**: ✅ complete

## What was delivered

### Gap C — System card artifacts (5 files)
- `src/data/system-card-schema.ts` — `SystemCard` type with 14 canonical sections (summary, intendedUse, outOfScope, architecture, evaluation, ethicalConsiderations, threatModel, governance, incidentResponse, rollbackRecovery, auditHistory, correctionAppeal, noGoConditions, regulatoryMapping) + supporting types (`OwaspLlmId`, `OwaspThreatControl`, `IncidentSeverityRow`, `GovernanceRole`, `AuditEntry`, `RegulatoryMappingEntry`) + `validateSystemCard()` enforcing all 14 sections non-empty, OWASP LLM01..LLM10 completeness, and EU AI Act Annex IV cross-reference.
- `src/data/system-cards/CP-N4-C.system-card.ts` — full handcrafted 14-section card for the multi-agent harness. OWASP matrix maps every LLM01..LLM10 risk to concrete controls (input classifier + structured output + tool allowlist; schema validation; versioned indexes; rate limits + budgets; dependency scanning; redaction; tool allowlist; bounded loops + approval; verifier + abstention; access controls). 10 concrete no-go conditions. 11-entry Annex IV mapping.
- `src/data/system-cards/CP-FINAL.system-card.ts` — aggregation card inheriting the full CP-N4-C OWASP matrix + integration-specific threats (contract mismatch, dependency cascade failure, shared-state corruption). G1..G8 governance gates. 11+10 no-go conditions. 10-entry Annex IV mapping covering sections 1..9.
- `src/data/system-cards/index.ts` — barrel export (`SYSTEM_CARDS` map, `getSystemCard`, `SYSTEM_CARD_CAPSTONE_IDS`, re-exports of schema symbols).

### Gap D — CP-FINAL contract tests (4 files)
- `tests/contract/synthetic-scenario.json` — single shared canonical fixture (client ACME-001) spanning all 12 subsystems. CC0, no real PII, declares `shared_trace_id`.
- `tests/contract/contracts.ts` — 12 contract objects (`{capstoneId, interfaceName, method, path, version, requestSchema, responseSchema}`) derived from `FINAL_INTERFACES` in capstones.ts. All paths are versioned `/v1/`. Includes a minimal JSON-Schema validator `validateAgainstSchema()`.
- `tests/contract/providers.ts` — 12 in-process provider stubs (no live server, no network). Each stub validates the request against the contract schema and returns a deterministic synthetic response sourced from `synthetic-scenario.json`. Every response carries the shared `traceId`. Includes `mlplatformRollback(rollbackTarget)` helper for the backup/restore/rollback test, plus `canonicalRequest()` / `invalidRequest()` helpers and the `PROVIDERS` registry.
- `tests/contract/contract-tests.test.ts` — 41 tests.

### Tests
- `tests/system-card.test.ts` — 48 tests.

## Test results

```
$ bun test tests/capstones.test.ts tests/system-card.test.ts tests/contract/contract-tests.test.ts
209 pass, 0 fail, 2495 expect() calls, across 3 files.
```

- Pre-existing `tests/capstones.test.ts`: 119 pass (unchanged — capstones.ts was NOT modified).
- New `tests/system-card.test.ts`: 48 pass (≥14 required).
- New `tests/contract/contract-tests.test.ts`: 41 pass (≥20 required).

The 5 failures visible in `tests/web-search.test.ts` (when running the full `bun test`) belong to the Gap A web/SERP subagent's work-in-progress and are out of scope for this task.

## Type check

```
$ bunx tsc --noEmit -p tsconfig.json
```

Zero errors in any new source or contract file. The only tsc output touching my files is the project-wide benign `Cannot find module 'bun:test'` resolution warning that ALL test files in the project (including the pre-existing `tests/capstones.test.ts`) exhibit — that's a missing `@types/bun` declaration, not a regression.

## Lint

```
$ bun run lint
```

0 errors, 0 warnings in any new file. (The single warning is in `src/lib/web-search/providers/tavily.ts`, owned by the Gap A agent.)

## Constraints honoured

- ✅ Did NOT modify `src/data/capstones.ts` (the Spanish redaction subagent owns it).
- ✅ Only created new files (9 total: 4 source + 1 fixture + 4 tests).
- ✅ Existing 119 tests in `capstones.test.ts` still pass.
- ✅ All paths use `XTransformPort`-free relative URLs (no mini-service needed for in-process contract tests).
- ✅ No real PII (the synthetic scenario is CC0).
