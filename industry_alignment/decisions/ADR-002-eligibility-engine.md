# ADR-002 — Eligibility Engine

**Status:** Accepted
**Date:** 2026-07-28T22:30:00Z (Phase 7-9 design + implementation); 2026-07-29T00:00:00Z (ADR retroactive, Phase 13)
**Decision maker:** `assessment_validity_architect` (Phase 7) + `integration_architect` (Phase 8) + `test_designer_red` + `implementer_green` (Phase 9); ratified by `reporter` (Phase 13)
**Supersedes:** none
**Superseded by:** none
**References:**
- `src/lib/eligibility/engine.ts` (TypeScript runtime, 707 LOC)
- `src/lib/eligibility/types.ts` (type contract, 228 LOC)
- `src/lib/eligibility/badge-specs.ts` (catalog loader, 118 LOC)
- `tests/adversarial/test_eligibility_engine.py` (Python reference + 18 tests, 1344 LOC)
- `industry_alignment/eligibility_state_machine.md` (state contract)
- `industry_alignment/assessment_validity_report.md` (scoring integrity)
- `industry_alignment/playwright_badge_test_matrix.md` (triple-validation)

## Context

The 31-badge taxonomy (ADR-001) requires an engine that
determines, for any learner's progress, whether each badge
is `locked`, `available`, `in_progress`,
`evidence_incomplete`, `assessment_ready`,
`eligible_pending_verification`, or `awarded`. The engine
must:

1. Be **deterministic** — same inputs produce same outputs,
   no time-of-day dependence, no randomness.
2. Be **honest** — never exceed the evidence collected; never
   fabricate evidence from legacy data.
3. Be **non-compensatory** at critical competencies — a
   single critical-competency criterion below 100% blocks
   the badge regardless of strength elsewhere.
4. Be **edition-aware** — the static edition must never issue
   competency or capstone credentials from client state
   alone.
5. Be **idempotent** — awarding twice must not duplicate the
   badge in the learner's record.
6. Be **testable** — every gate must be exercisable by an
   adversarial test.

The industry brief (`industry_reality_brief.md`) identified
13 recruiter complaints. The engine must address at least:
- C1 (tutorial dependence) — via the evidence-tier gate.
- C4 (MCQ-only assessment) — via the tier-4 (You Do)
  requirement for competency badges.
- C6 (poor testing habits) — via the critical-competency
  gate on `reproducibility_determinism`.
- C11 (capstone without defense) — via the defense
  component and static-edition refusal.

## Decision

We implement a **deterministic eligibility engine** with the
following architecture:

### 1. Two-language twin implementation

- **Python reference implementation** in
  `tests/adversarial/test_eligibility_engine.py`. This is
  the *executable specification*. It contains the
  `EligibilityEngine` class and 18 adversarial tests. It
  never weakens to make a buggy implementation pass.
- **TypeScript runtime implementation** in
  `src/lib/eligibility/`. This is the *production code*. It
  mirrors the Python reference exactly; both must produce
  identical outputs for the same inputs.

The twin-implementation pattern catches divergences: if the
TypeScript runtime ever drifts from the Python reference,
the Layer 3 tests (which import the production TypeScript
engine) will surface the drift.

### 2. Nine-gate evaluation chain

The engine evaluates badges through 9 gates, in order. Each
gate can short-circuit (return early) with a blocking
reason:

| Gate | What it checks | Short-circuit state |
|---:|---|---|
| 1 | Badge status (`active` or `pilot`; not `retired`/`superseded`) | `locked` |
| 2 | Prerequisite badges all `awarded` | `locked` |
| 3 | Required activities present with sufficient evidence tier (≥4 for competency/capstone; ≥3 for progress) | `available` or `in_progress` or `evidence_incomplete` |
| 4 | Required projects all submitted with rubric scores | `evidence_incomplete` |
| 5 | Per-component floors met (self_check ≥85, you_do ≥80, exams ≥85, integrator ≥85) | `assessment_ready` |
| 6 | Critical competencies at 100% on every criterion (non-compensatory) | `assessment_ready` |
| 7 | Pilot badges: supplementary exercises for gap-affected competencies complete | `assessment_ready` |
| 8 | Weighted-average overall ≥ minimum_overall_score (typically 85) | `assessment_ready` |
| 9 | Edition check: static → `eligible_pending_verification` (preview); dynamic → `awarded` | `eligible_pending_verification` or `awarded` |

### 3. Conservative rounding

The engine rounds DOWN to 2 decimal places before comparing
to a floor. A score of 84.999 becomes 84.99 and fails an 85
floor. Exactly-at-threshold (80.0 on an 80 floor) passes.
This is the conservative direction: it never rounds a
failing score up to a pass.

### 4. Evidence-tier hierarchy

| Tier | Activity type | Counts toward competency badge? |
|---:|---|---|
| 1 | Theory (passive reading) | No |
| 2 | I Do (instructor demo) | No |
| 3 | We Do (guided exercise) | No |
| 4 | You Do (independent project) | **Yes** — primary evidence |
| 5 | Project (integrator/synthesis) | **Yes** |
| 6 | Capstone defense | **Yes** — required for capstone credentials |

The engine uses `evidenceTierMinimum(spec)`:
- Competency + capstone badges: tier ≥ 4.
- Progress badges: tier ≥ 3 (walk-through counts).

### 5. Highest-tier-wins for duplicate activities

If a learner has multiple evidence entries for the same
activity (e.g., a We Do and a You Do for the same section),
the highest-tier one wins. This ensures a learner who
re-does a guided exercise as independent work gets credit
for the independent work.

### 6. Edition semantics

- `EDITION_STATIC`: the engine never returns `awarded` for
  competency or capstone badges. It returns
  `eligible_pending_verification` (preview only) with a
  clear "sign in to the LMS" message. Progress badges ARE
  awarded on static (they are local_achievement).
- `EDITION_DYNAMIC`: the engine returns `awarded` when all
  gates pass. The actual cryptographic signing is a
  separate server-side concern (`src/lib/badge/state_machine.ts`,
  Phase 14+).

### 7. Idempotent award

`awardIdempotent(badge_id, progress, options)` checks if
the badge is already in `progress.awarded_badges` with
state `awarded`. If so, it returns `newly_awarded: false`
and does NOT duplicate the entry. If not, it evaluates and,
if awarded, appends the entry with `newly_awarded: true`.

### 8. Catalog versioning

The engine is constructed with a `catalogVersion` (default
`1.0.0`). The engine refuses to evaluate against a catalog
whose version doesn't match. This prevents silent spec
changes from invalidating a learner's eligibility report.

### 9. Stephen Fry redaction in all learner-facing messages

Every `blocking_reason` is newbie-friendly with inline
jargon explanations. For example:
- "Missing prerequisites: X" → "You need to earn these
  badges first: X. Think of them as the building blocks for
  this one."
- "Critical competency below 100%" → "The competency 'X' is
  critical (non-negotiable). Your score is 75%, but it must
  be 100%. No other strength can offset this — please review
  the underlying sections."

## Alternatives considered

### Alternative A — Server-only engine (no client preview)

**Rejected.** The static GitHub Pages edition has no server.
Learners on the static edition would have no way to see
their progress toward badges. The edition-aware design
lets the static edition show previews (clearly labeled)
while the dynamic edition issues signed credentials.

### Alternative B — Probabilistic / ML-based eligibility

**Rejected.** Eligibility must be deterministic and
auditable. A probabilistic engine would make it impossible
to explain to a learner why they didn't earn a badge. The
9-gate chain is fully deterministic and every gate's
verdict is recorded in the `EligibilityReport.requirements`
array.

### Alternative C — Compensatory scoring (allow high average to offset a failed critical competency)

**Rejected.** The industry brief specifically flags
"leakage-prone ML" and "no type safety" as critical
competencies that cannot be offset. A learner who scores
95% on everything but has a leakage bug in their model
must not earn a Data Scientist badge. The
non-compensatory gate enforces this.

### Alternative D — Single-language implementation (TypeScript only)

**Rejected.** A single-language implementation has no
independent check. The twin-implementation (Python
reference + TypeScript runtime) catches divergences: if the
TypeScript runtime drifts (e.g., a rounding change), the
Python reference tests still pin the contract, and the
Layer 3 tests surface the drift.

### Alternative E — Floating-point scoring without rounding

**Rejected.** Floating-point arithmetic produces values
like 84.99999999 due to representation errors. Without
explicit rounding, a learner with a "true" 85% score might
see 84.99999999 and fail the floor. The round-DOWN-to-2
rule eliminates this class of bug and is conservative.

## Consequences

### Positive

- **Determinism.** The engine produces byte-identical
  outputs for byte-identical inputs. Verified by Layer 1
  test 16 (`test_deterministic_output`).
- **Honesty.** Legacy localStorage cannot fabricate
  competency evidence (Layer 1 test 13, Layer 3 simulation
  B4). The static edition cannot issue competency badges
  (Layer 1 test 14, Layer 3 simulation B5).
- **Auditability.** Every gate's verdict is in the
  `EligibilityReport.requirements` array. A learner can see
  exactly which requirement failed and why.
- **Testability.** 18 adversarial tests pin every gate. The
  tests are RED before the implementation and GREEN after;
  they never weaken.

### Negative

- **Twin-implementation maintenance burden.** Any change to
  the engine must be made in both the Python reference and
  the TypeScript runtime. Mitigated by the Layer 3 tests
  that import the production TypeScript engine — a drift
  surfaces immediately.
- **9-gate chain is long.** A badge with all gates passing
  requires ~30 lines of `LearnerProgress` fixture. This is
  verbose but explicit; the `fullProgressForCompetencyBadge`
  helper reduces the burden.
- **Static edition never issues competency badges.** Some
  learners may be frustrated that the static edition shows
  "preview only". This is honest (the static edition cannot
  verify evidence) but may disappoint. Mitigated by the
  clear "sign in to the LMS" message.

### Neutral

- **Catalog version pinning.** Any catalog version bump
  requires a new engine construction. This is intentional
  (prevents silent spec drift) but means the engine must
  be reconstructed when the catalog updates.

## Compliance

- **Constraint 4 (independent evidence):** Gate 3 enforces
  tier ≥ 4 for competency/capstone. ✅
- **Constraint 5 (non-compensation):** Gate 6 enforces 100%
  on every critical-competency criterion. ✅
- **Constraint 6 (conservative floors):** Round-down-to-2
  rule + exact-at-threshold = pass. ✅
- **Constraint 7 (legacy non-fabrication):** Legacy data is
  tier 1; gate 3 rejects tier < 4. ✅
- **Constraint 8 (Stephen Fry redaction):** All
  `blocking_reason` strings are newbie-friendly. ✅

## Test coverage

- **Layer 1 (Python, 18 tests):** Every gate exercised;
  boundary cases (exact-at / one-below) verified;
  idempotent award verified; determinism verified.
- **Layer 3 (TypeScript, 7 scenarios simulated + 16
  Playwright tests written):** Production engine exercised
  against real catalog; browser-only behaviour (localStorage
  tampering, refresh) tested in Chromium.

See `playwright_badge_test_matrix.md` for the full
convergence table.

## Ratification

This ADR retroactively documents the design decision made
in Phases 7-9. The engine has been triple-validated (Phase
10) and the static-edition release gate is PASS.

---

*End of ADR-002. For the badge taxonomy, see ADR-001. For
the static-vs-dynamic split, see ADR-003. For the
critical-competency non-compensation gate, see ADR-004.*
