# ADR-004 — Critical Competency Gates

**Status:** Accepted
**Date:** 2026-07-28T22:08:04Z (Phase 6 design); 2026-07-29T00:00:00Z (ADR retroactive, Phase 13)
**Decision maker:** `badge_architect` node (Phase 6) + `assessment_validity_architect` (Phase 7); ratified by `reporter` (Phase 13)
**Supersedes:** none
**Superseded by:** none
**References:**
- `industry_alignment/credential_architecture.md` §5 (non-compensatory critical competencies)
- `industry_alignment/assessment_validity_report.md` §4 (rubric design)
- `src/lib/eligibility/types.ts` (`GAP_AFFECTED_COMPETENCIES`, `PROVISIONAL_FLOORS.critical_competency_pct`)
- `src/lib/eligibility/engine.ts` lines 331-408 (Gate 6 implementation)
- `industry_alignment/curriculum_gap_matrix.json` (`critical_competency_status` array, 8 competencies)

## Context

The 31-badge taxonomy (ADR-001) and the eligibility engine
(ADR-002) require a notion of "critical competency" — a
skill that is so important to a credential that a single
failure on it must block the badge, regardless of strength
elsewhere. This is the **non-compensatory** principle:
you cannot offset a critical-competency failure by
over-performing on other components.

The industry reality brief (`industry_reality_brief.md`)
identified four competencies that recruiters specifically
flag as non-negotiable:

1. **`leakage_prevention`** — A model that leaks test data
   into training is worthless. (Complaint C3: "ML models
   that look great in interview but leak test data.")
2. **`type_safety_production_hardening`** — Production
   Python without type safety is a maintenance nightmare.
   (Complaint C7: "no type hints, no mypy, runtime crashes
   in prod.")
3. **`sql_competency`** — A Data Analyst who can't write
   correct SQL is a liability. (Complaint C5: "can't write
   a basic JOIN.")
4. **`selector_resilience`** — An RPA bot that breaks on
   UI changes is useless. (Complaint C9: "fragile
   selectors, bots break on every UI update.")

Four additional competencies are critical for some badges
but are well-covered by the curriculum:

5. **`mlops_fluency`** — ML deployment, monitoring, drift
   detection.
6. **`business_framing_judgment`** — Translating stakeholder
   asks into well-scoped technical problems.
7. **`communication_audience_tuned`** — Adjusting
   communication for technical vs. non-technical audiences.
8. **`reproducibility_determinism`** — Lockfiles, seeds,
   deterministic builds.

The first four are **gap-affected**: the curriculum has
known thinness in these areas (see
`curriculum_gap_matrix.json` P0 gaps). The last four are
well-covered.

## Decision

We adopt a **non-compensatory critical-competency gate** at
100% floor, with **pilot-badge supplementary exercises** for
gap-affected competencies.

### 1. The 100% floor

Every critical competency is graded on a rubric with
multiple criteria. The engine requires **every criterion to
score 100%** for the competency to pass. A single criterion
at 99% blocks the badge.

This is the strictest possible floor. It reflects the
non-negotiable nature of critical competencies: a model
that leaks test data 1% of the time is still leaking.

### 2. Non-compensation

The critical-competency gate is **Gate 6** in the 9-gate
chain (ADR-002). It runs AFTER the per-component floors
(Gate 5) but BEFORE the weighted-average overall (Gate 8).
If Gate 6 fails, the engine short-circuits to
`assessment_ready` (not awarded) regardless of how high the
weighted average is.

This means a learner with 95% on every component but 75% on
one critical-competency criterion does NOT earn the badge.
The 95% average cannot "rescue" the 75% critical competency.

### 3. Gap-affected competencies and pilot badges

Four critical competencies are gap-affected
(`GAP_AFFECTED_COMPETENCIES` in `types.ts`):

```typescript
export const GAP_AFFECTED_COMPETENCIES: Record<string, boolean> = {
  sql_competency: true,
  leakage_prevention: true,
  selector_resilience: true,
  type_safety_production_hardening: true,
  mlops_fluency: false,
  business_framing_judgment: false,
  communication_audience_tuned: false,
  reproducibility_determinism: false,
}
```

A badge that cites a gap-affected competency is marked
`pilot` (not `active`) in the catalog. The engine requires
a **supplementary exercise** for each gap-affected
competency before a pilot badge can be awarded:

```
project_id = `BADGE:${badge_id}:supplementary:${competency_id}`
```

The supplementary exercise is a bounded, rubric-graded
exercise that covers the gap. Until it is submitted (with
any passing score — the supplementary is graded
pass/fail, not on the 100% floor), the badge is blocked.

### 4. Why 100% and not 85%?

The 100% floor for critical competencies is deliberately
stricter than the 85% floor for other components. The
rationale:

- **A leakage bug is binary.** A model either leaks or it
  doesn't. There is no "85% leak-free" — that's still a
  leak.
- **A type-safety hole is binary.** A codebase either
  passes `mypy --strict` or it doesn't. There is no
  "85% typed."
- **A SQL injection vulnerability is binary.** A query
  either sanitises inputs or it doesn't.
- **A fragile selector is binary.** A bot either survives
  a UI change or it doesn't.

The 85% floor on other components (self_check, you_do,
exam, integrator) allows for the fact that a learner can be
"good enough" on a broad skill without being perfect. The
100% floor on critical competencies reflects that some
skills are pass/fail by nature.

### 5. Why per-criterion 100%?

A critical competency's rubric has multiple criteria (e.g.,
for `leakage_prevention`: "no test data in training",
"no future data in past predictions", "no target leakage
via features", "no duplicate rows across train/test
splits"). Each criterion is a separate binary check.

The engine requires every criterion to score 100% (i.e.,
every criterion passes). If the rubric has 4 criteria and
the learner scores [100, 100, 75, 100], the competency
fails — criterion 3 (target leakage via features) was not
met.

This prevents a learner from "averaging out" a critical
failure. A learner who prevents test-data leakage but not
target leakage has still leaked; they cannot earn the
badge.

### 6. The pilot-badge honesty contract

The pilot-badge mechanism is the system's honest response
to curriculum thinness. Rather than:

- **Pretending the curriculum teaches the competency** when
  it doesn't (over-claiming), OR
- **Removing the competency from the badge** (under-claiming
  what the role requires),

the system:

1. Marks the badge `pilot` (signaling "this badge's evidence
   is incomplete; the curriculum is being improved").
2. Requires a supplementary exercise that covers the gap.
3. Engine-blocks the badge until the supplementary is
   submitted.

This is honest: the badge claims the competency (because
the role requires it), but the system refuses to issue
until the learner demonstrates the competency via the
supplementary exercise (because the curriculum alone
doesn't teach it well enough yet).

## Alternatives considered

### Alternative A — Compensatory scoring (85% floor on critical competencies, offsettable)

**Rejected.** This would let a learner with a leakage bug
earn a Data Scientist badge by over-performing on
communication. The industry brief specifically flags this
as unacceptable. The 100% non-compensatory floor is the
only honest option for binary-failure competencies.

### Alternative B — Remove critical competencies from badges until the curriculum teaches them

**Rejected.** This would under-claim what the role
requires. A Data Scientist badge that doesn't check
leakage prevention is misleading. The pilot-badge
mechanism lets the badge claim the competency (honest
about the role) while gating issuance on the supplementary
(honest about the curriculum's gaps).

### Alternative C — Single criterion per critical competency (not multiple)

**Rejected.** A single criterion is too coarse. For
`leakage_prevention`, a single "no leakage" criterion would
not tell the learner *what kind* of leakage they
committed. The multi-criterion rubric (4 criteria for
`leakage_prevention`) gives the learner actionable
feedback: "you prevented test-data leakage but not target
leakage."

### Alternative D — 90% floor instead of 100%

**Rejected.** 90% would allow a learner to fail one
criterion out of 10, or score 90 on a single criterion.
For binary-failure competencies, this is still too lenient.
A model that leaks 10% of the time is still leaking. The
100% floor is the only honest option.

### Alternative E — No pilot badges; just block the 9 affected badges until the P0 gaps close

**Rejected.** This would hide the curriculum's gaps from
learners. A learner who wants to earn `applied_sql_query_development`
would see "blocked" with no explanation. The pilot-badge
mechanism shows the learner: "this badge is pilot because
SQL performance tuning is a known gap; complete the
supplementary exercise to earn it." This is more
transparent and gives the learner a path forward.

## Consequences

### Positive

- **Honesty about binary failures.** A learner cannot
  "average out" a leakage bug or a type-safety hole. The
  badge certifies what it claims.
- **Honesty about curriculum gaps.** The 9 pilot badges
  openly acknowledge that the curriculum has thinness in 4
  competencies. The supplementary-exercise mechanism gives
  learners a path forward.
- **Actionable feedback.** The multi-criterion rubric tells
  the learner exactly which sub-skill they failed.
- **Recruiter trust.** A PyArcana competency badge certifies
  that the learner has demonstrated the critical
  competencies at 100%. Recruiters can trust this because
  the engine enforces it non-compensatorily.

### Negative

- **9 badges blocked.** Until the P0 gaps close and
  supplementary exercises are authored, 9 pilot badges
  cannot be issued. This is honest but may frustrate
  learners. Mitigated by the 22 `active` badges that ARE
  issuable.
- **100% is strict.** A learner who scores 99% on one
  criterion fails the badge. This may feel harsh. Mitigated
  by the retake policy (`assessment_validity_report.md §5`):
  learners can re-attempt after a cool-down.
- **Supplementary exercises not yet authored.** The 9
  pilot badges' supplementary exercises are Phase 14+ work.
  Until they exist, the engine correctly blocks the badges,
  but the curriculum doesn't offer the remedy path.

### Neutral

- **Gap-affected competency list is versioned.** The
  `GAP_AFFECTED_COMPETENCIES` map is in `types.ts`. As P0
  gaps close (Stage 7 of the roadmap), competencies move
  from `true` to `false`, and pilot badges can be
  re-evaluated for `active` status. This requires a catalog
  version bump.

## Compliance

- **Constraint 5 (non-compensation):** Gate 6 enforces 100%
  on every critical-competency criterion, non-offsettable.
  ✅
- **Constraint 1 (never exceed evidence):** The engine
  records the critical-competency score and the per-criterion
  scores; the learner can see exactly what failed. ✅
- **Constraint 8 (Stephen Fry redaction):** The blocking
  reason for a critical-competency failure is newbie-friendly:
  "The competency 'X' is critical (non-negotiable). Your
  score is 75%, but it must be 100%. No other strength can
  offset this — please review the underlying sections." ✅

## Test coverage

- **Layer 1 test 6:** `test_blocked_when_critical_competency_fails`
  — all scores at 95%, one critical criterion at 75%,
  badge blocked.
- **Layer 1 test 18:** `test_pilot_badge_requires_supplementary_exercise`
  — pilot badge blocked without supplementary; unblocked
  with supplementary.
- **Layer 3 simulation B3:** high average (95% everywhere)
  but critical competency at 75%; badge blocked;
  non-compensation verified.
- **Layer 3 test F3:** every competency/capstone badge has
  ≥1 critical competency (non-vacuous gate).

## Ratification

This ADR retroactively documents the design decision made
in Phases 6-7. The non-compensatory gate has been
implemented (Phase 9), triple-validated (Phase 10), and the
static-edition release gate is PASS. The 9 pilot badges
remain `pilot` until Stage 7 of the roadmap closes the P0
gaps and authors the supplementary exercises.

---

*End of ADR-004. For the badge taxonomy, see ADR-001. For
the eligibility engine, see ADR-002. For the static-vs-dynamic
split, see ADR-003.*
