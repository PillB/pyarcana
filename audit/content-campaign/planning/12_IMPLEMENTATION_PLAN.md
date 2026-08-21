# Implementation plan (dependency-ordered)

## Ordering rationale

U1 before U2 because U1 repairs a *self-inflicted* gap — S18 tells the learner an
experiment is the remedy and never defines it — whereas U2 enriches a mental
model that is merely thin. Prerequisite/foundational gaps outrank enrichment.

Neither unit depends on the other. Both are leaves in the dependency graph: no
later section requires them, so no downstream content must move.

## U1 — S18 · experimentation and causal literacy

- **Requirements:** UR-01, UR-07, UR-08; CR-01; SR-01…SR-06; IR-U1
- **File:** `src/lib/course/sections/s18-data-engineering.ts`
- **Protected identities:** section `id: "data-engineering"`, `index: 18`, the 8
  `S18-T*` subtopic IDs, the 8 `S18-*-DEMO` IDs, the 24 `S18-T*-E*` exercise IDs
- **RED:** `RED-01` — S18 prescribes "experimento" as the design that licenses
  causal language (T3-A), builds an A/B-shaped comparison (T2-B), and quizzes it
  (selfCheck Q8), but never defines randomised assignment. The learner leaves
  with a prohibition and no route past it.
- **GREEN:** two theory blocks — one in T2-B introducing the randomised
  comparison and how to read its effect; one in T3-A giving the p-value and
  guardrail discipline and closing the confounding loop.
- **Also:** 2 Autocheck questions, 1 `youDo` objective + 1 requirement, 1
  resource link, 3 glossary terms.
- **Rollback:** `git checkout <sha> -- src/lib/course/sections/s18-data-engineering.ts`

## U2 — S15 · columnar execution mental model

- **Requirements:** UR-01, UR-07; CR-02; SR-01…SR-07; IR-U2
- **File:** `src/lib/course/sections/s15-stdlib-deep.ts`
- **Protected identities:** section `id: "stdlib-deep"`, `index: 15`, all S15 IDs
- **RED:** `RED-02` — S15-T4-A teaches Parquet as type preservation only. Nothing
  in the 52 active sections explains why columnar layout lets a reader skip work,
  so the learner cannot reason about a format choice they are asked to make.
- **GREEN:** one theory block in T4-B with a standard-library demonstration of
  projection cost and row-group pruning.
- **Hard constraint:** `pyarrow`, `duckdb` and `polars` are **absent** from the
  audit environment. The demonstration must be stdlib-only or the runtime audit
  will report a blocked environment instead of teaching evidence.
- **Rollback:** `git checkout <sha> -- src/lib/course/sections/s15-stdlib-deep.ts`

## Not implemented, with reasons

| Candidate | Decision |
|---|---|
| Temporal validation (package HIGH) | `ALREADY_FIXED` in S32-T4-A, S33-T1-A, S33-T4-B, S36-T4-A. Adding it would be duplication, which the campaign's own doctrine classes as a defect |
| Neural / deep-learning bridge | `NOT_APPLICABLE` — needs a new section or displaces existing material; blocked by UR-02/UR-03 |
| New tracked exercises for the new material | Blocked by the 24-ID invariant. The teaching lands in theory and Autocheck instead |
| New badge for experimentation | Requires schema work and explicit approval; out of scope |
| Fixing the 2 pre-existing glossary forward refs | Pre-existing, unrelated to this content, and touching `rpa-automation` would widen scope |

## Per-unit gate sequence

RESEARCH → RED → GREEN (iteration 1) → run snippet for real output → technical
validate → iteration 2 (adversarial editorial) → novice validate → integration
validate → compatibility validate → render validate → independent validate →
record.
