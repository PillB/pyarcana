# `capstone_validation/` — PyArcana capstone system mirror

> Governing spec Section 13 — Harness Artifacts.
>
> This directory is a **mechanical mirror** of the canonical TypeScript source
> of truth under `src/data/`, `src/lib/`, and `tests/`. The TS modules remain
> canonical; this directory exists so reviewers, auditors, and future
> contributors can read the capstone system as JSON + Markdown without running
> code.
>
> Regenerate with: `bun run scripts/mirror.mjs`.

## The 13-capstone system at a glance

- **4 levels** × **3 principal capstones per level** = **12 principal capstones**.
- **1 final transversal capstone** (`CP-FINAL`, gated at `S52`, integrates the 12
  upstream).
- **Total: 13 capstones.**
- The N4-D request is folded into `CP-N4-C` v2.0.0 as three sub-gates
  (`CP-N4-C.1 · S49`, `CP-N4-C.2 · S50`, `CP-N4-C.3 · S51`). No `CP-N4-D`.
- The 13-capstone invariant is enforced at **module load**
  (`src/data/capstones.ts`), at **test time** (`tests/capstones.test.ts`,
  119 tests), and in the **JSON mirror** (`reality/roadmap_inventory.json`).

## Directory layout

```
capstone_validation/
├── README.md                          ← this file
├── worklog.md                         ← mirror provenance note
├── decision_log.md                    ← key design decisions (D1–D8)
├── source_registry.json               ← the canonical TS source files
├── execution_ledger.json              ← phase status, commit, dev server, tests
│
├── capstones/                         ← 13 canonical contracts + ledger
│   ├── CP-N1-A.json … CP-N4-C.json
│   ├── CP-FINAL.json
│   └── capstone_ledger.json           ← {capstoneId, version, title, level, gateSection, status, subGateIds}[]
│
├── reality/                           ← what is actually deployed/runnable
│   ├── deployed_state.md
│   ├── roadmap_inventory.json
│   ├── capstone_inventory.json
│   ├── section_capstone_mapping.json  ← all 52 sections
│   ├── learner_ui_inventory.md
│   └── runtime_inventory.md
│
├── levels/                            ← the 4-level framework
│   ├── level_framework_research.md    ← Phase-1 research citations
│   ├── level_claim_matrix.json        ← per-level exit capabilities + disclaimer
│   ├── level_exit_capabilities.md
│   └── public_naming_decision.md      ← ADR: curricular not workplace
│
├── architecture/                      ← ADRs + graphs + plans
│   ├── ADR-capstone-cardinality.md
│   ├── ADR-N4-C-agentic-harness.md
│   ├── ADR-level-language.md
│   ├── capstone_dependency_graph.json ← nodes + edges (badge-dep + final-integration)
│   ├── final_integration_contracts.json ← the 12 FINAL_INTERFACES
│   ├── migration_plan.md              ← CP-N4-C v1 → v2 (backward compatible)
│   └── rollback_plan.md
│
├── rubrics/                           ← assessment validity
│   ├── rubric_registry.json           ← RUBRIC_REGISTRY
│   ├── critical_failure_matrix.json   ← COMMON_CRITICAL_FAILURES + per-capstone extras
│   └── assessment_validity_report.md
│
└── validation/                        ← evidence matrices
    ├── content_matrix.md              ← 13 capstones × 12 fields = 156 ✓
    ├── runtime_matrix.md              ← 119 tests pass, dev server 200
    ├── security_matrix.md
    ├── accessibility_matrix.md
    ├── playwright_matrix.md           ← agent-browser verification plan
    └── deployment_evidence.md
```

## Canonical sources

The TypeScript modules are the single source of truth. See
`source_registry.json` for the full list. The most important are:

| Source | Role |
|---|---|
| `src/data/types.ts` | canonical type definitions |
| `src/data/capstones.ts` | 13 capstone contracts + `FINAL_INTERFACES` + module-load invariant |
| `src/data/levels.ts` | `LEVELS` + `CARDINALITY` invariant |
| `src/data/sections.ts` | 52 section mappings |
| `src/data/rubrics.ts` | `RUBRICS` + `RUBRIC_REGISTRY` + `COMMON_CRITICAL_FAILURES` |
| `src/data/badges.ts` | 13 badges |
| `src/data/i18n.ts` | EN/ES string table (Stephen Fry register) |
| `src/lib/copilot-harness.ts` | runnable CP-N4-C harness |
| `tests/capstones.test.ts` | automated test suite (119 tests) |
| `src/app/page.tsx` | learner-facing capstones UI (only user-visible route) |

## How to regenerate

```sh
bun run scripts/mirror.mjs
```

The script imports the TS modules directly (Bun can import TypeScript), walks
the `CAPSTONES` / `LEVELS` / `SECTIONS` / `RUBRICS` / `BADGES` arrays, and
writes the JSON artefacts. The Markdown artefacts are hand-authored mirrors of
the spec requirements and are updated only when the spec or the TS modules
change.

## Status

- Phases 0–7: **done** (research, data layer, UI, harness, redaction, tests,
  mirror).
- Phase 8 (commit + push to `PillB/pyarcana`): **pending auth completion**.
- See `execution_ledger.json` and `/home/z/my-project/worklog.md` for details.
