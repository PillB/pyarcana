# Assessment and Scoring Integrity Report

**Generated:** 2026-07-28T22:30:00Z
**Catalog version:** 1.0.0
**Authors:** assessment_validity_architect node (Phase 7) + integration_architect node (Phase 8)
**Scope:** All 31 badges in `badge_catalog.json`

---

## 1. Purpose

This report specifies the assessment and scoring integrity contract
for every PyArcana badge. It defines:

1. The **evidence hierarchy** that maps each curriculum activity type
   to a credibility tier (from passive theory reading up to
   capstone synthesis defense).
2. The **conservative provisional floors** that gate badge issuance.
3. The **rubric design principles** that every badge rubric must
   follow for the rubric to count as evidence.
4. The **per-badge assessment validity questions** that the
   eligibility engine (Phase 8) and the rubric review process must
   answer before any badge is awarded.
5. The **retake and remediation rules** that protect against
   gaming while preserving learner dignity.
6. The **evidence freshness policy** that prevents stale evidence
   from backing a credential whose underlying skills have moved.

This document is the reference for the eligibility engine
(`src/lib/eligibility/`) and for any external audit of PyArcana's
assessment claims.

---

## 2. Evidence hierarchy

PyArcana grades six activity types. Each type is positioned at a
specific tier in the evidence hierarchy. The hierarchy is monotonic:
a higher tier requires more independent performance than the tier
below it, and only tiers ≥3 count toward competency badges.

| Tier | Activity type | Independence | Counts toward competency badge? | Authenticity |
|---:|---|---|---|---|
| 1 | **Theory** (reading the prose block of a section) | None (passive) | No | Zero — no behavior observed |
| 2 | **I Do** (instructor demo) | None (passive) | No | Zero — no learner behavior observed |
| 3 | **We Do** (guided exercise with step-by-step scaffolding) | Low — the steps are given | No | Low — guided, not independent |
| 4 | **You Do** (independent project per section, rubric-graded) | High — learner writes from a prompt, not from steps | **Yes** — primary evidence of independent capability | High — observable behavior on a bounded task |
| 5 | **Project** (badge-specific integrator / synthesis project) | High — multi-section synthesis | **Yes** — required for every competency badge | High — authentic to the role's task bundle |
| 6 | **Capstone defense** (oral or written defense of a phase synthesis) | Highest — learner defends decisions under questioning | **Yes** — required for every capstone credential | Highest — synthesis + articulation under scrutiny |

### 2.1 Why the hierarchy matters

The hierarchy protects against the #1 recruiter complaint in the
industry brief (`industry_reality_brief.md §13 C1`): tutorial
dependence. A learner can complete every We Do exercise and every
section's theory block without ever performing an independent
behavior. Such a learner is not credential-eligible in PyArcana,
regardless of how many sections they "completed."

### 2.2 Per-tier evidence rules

- **Tier 1 (Theory):** Reading is recorded as an
  `activity_completed` event but never as a `scored_activity`. It
  contributes to progress badges only (Family 1).
- **Tier 2 (I Do):** Same as Tier 1.
- **Tier 3 (We Do):** Recorded as `activity_completed`. Contributes
  to progress badges only. A We Do exercise cannot be re-labeled as
  a You Do exercise to manufacture competency evidence.
- **Tier 4 (You Do):** Each You Do submission is graded against the
  section's rubric. The rubric score (0–100) is recorded as a
  `scored_activity` with `evidence_tier=4`. The learner's best
  rubric score across attempts counts.
- **Tier 5 (Project):** Each integrator / synthesis project is
  graded against the badge rubric (`badge_rubrics/<badge_id>.json`).
  Recorded as `scored_activity` with `evidence_tier=5`.
- **Tier 6 (Capstone defense):** Recorded as a `defense_record`
  with `evidence_tier=6`, the rubric scores per critical
  competency, and the reviewer signature. Defense records are
  append-only; a re-defense is a new record, not an edit.

### 2.3 Per-tier freshness

Higher tiers have longer freshness windows because the underlying
skill is more durable. See §7 below for the full table.

---

## 3. Conservative provisional floors

The floors below are the **issuance** floors, not a separate
"provisional" tier. The dynamic LMS does not issue "provisional
vs. full" credentials; it issues the credential when (and only
when) every floor is met. The static edition renders an
"eligibility preview" when the floors are met in `localStorage`,
but does not issue.

| Component | Floor | Rationale |
|---|---:|---|
| `self_check` aggregate | ≥85% | Self-checks are MCQ-only and low-authenticity; the floor is participation-flavored but still requires the learner to get most answers right. |
| `you_do_projects` rubric aggregate | ≥80% | You Do projects are the primary independent-performance signal. 80% leaves room for a learner to make one non-critical mistake without failing the badge. |
| `section_exams` aggregate | ≥85% | Stricter than the existing pass@70 baseline; badges must signal above-baseline proficiency. |
| `integrator_project` rubric | ≥85% | The integrator is the badge-specific synthesis; the floor is stricter than You Do because synthesis is the badge's defining evidence. |
| `critical_competency` rubric | **=100%** | Non-compensatory. Every rubric criterion in the critical competency must score full credit. |
| Minimum overall (weighted average) | ≥85% | Even when every component passes its own floor, the weighted average must still clear 85%. |

### 3.1 Boundary semantics

- **Exactly at threshold = pass.** A score of exactly 85.0 on a
  component with floor 85 passes. A score of exactly 80.0 on a You
  Do project with floor 80 passes.
- **One below = fail.** A score of 84.99 on a component with floor
  85 fails. A score of 79.99 on a You Do project with floor 80
  fails.
- **Rounding:** All component scores are rounded **down** to two
  decimal places before the boundary check. This is the conservative
  direction: a 84.999% becomes 84.99% and fails the 85% floor.
- **Overall weighted average:** Computed from the rounded component
  scores, then rounded down to two decimal places, then compared to
  the 85% floor. The weighted average is the *last* gate, not the
  first.

### 3.2 Why the floors are conservative

The industry brief surfaces two failure patterns these floors
defend against:

- **C3 — inflated bootcamp certificates.** Learners who "passed"
  courses at 70% were not job-ready. The 85% floor signals
  above-baseline proficiency.
- **C7 — AI-generated code without review trail.** A learner who
  submits AI-generated code may pass a 70% bar but fail a rubric
  that grades review discipline. The 85% rubric floor + 100%
  critical-competency floor create a non-compensatory wall against
  this pattern.

### 3.3 Why critical competencies are non-compensatory

A critical competency is a skill whose failure breaks the badge's
claim. For example, `leakage_prevention` is critical for any data
science badge because a model that leaks test-set information is
fundamentally invalid — no amount of strength elsewhere in the
badge can compensate. A single failing rubric criterion in a
critical competency blocks the badge, regardless of the weighted
average.

The 8 critical competencies (from
`industry_skill_graph.json#critical_competencies`) are:

1. `sql_competency`
2. `leakage_prevention`
3. `selector_resilience`
4. `type_safety_production_hardening`
5. `mlops_fluency`
6. `business_framing_judgment`
7. `communication_audience_tuned`
8. `reproducibility_determinism`

Each is graded against a 4-criterion rubric; all four criteria
must score 100% (full credit) for the competency to pass.

---

## 4. Rubric design principles

Every badge rubric (`industry_alignment/badge_rubrics/<badge_id>.json`)
and every section You Do rubric must satisfy the following six
principles. A rubric that violates any principle is rejected at
review time and does not count as evidence.

### 4.1 The six principles

1. **Map to skill nodes.** Every rubric criterion maps to one or
   more `skill_node` IDs in `curriculum_skill_graph.json`. A
   criterion that does not map to a skill node is ungradeable and
   must be removed.
2. **Observable behavior.** Every criterion describes a behavior
   that a reviewer can observe in the submitted artifact. "Understands
   leakage prevention" is not observable; "The submission partitions
   data into train/validation/test before any feature engineering,
   and the partition is verifiable from the code" is observable.
3. **Performance levels.** Every criterion has at least three
   performance levels (e.g., `below_floor`, `at_floor`, `above_floor`)
   with concrete descriptors. A binary "pass/fail" criterion is
   allowed only for critical competencies, where the descriptor is
   "full credit / no credit."
4. **Critical fail conditions.** Every criterion lists the
   conditions under which awarding `above_floor` would be unsafe —
   the conditions that force `below_floor` regardless of other
   strengths. For example, for `leakage_prevention`: "If
   test-set-derived statistics leak into feature engineering, this
   criterion is `below_floor` regardless of code quality."
5. **Reviewer independence.** Every rubric is gradeable by a
   reviewer who did not write the artifact. The rubric must not
   require the reviewer to infer the learner's intent.
6. **Stephen Fry redaction.** Every learner-facing rubric
   description is newbie-friendly with inline jargon explanations.
   Acronyms are expanded on first use.

### 4.2 Rubric criterion shape

A rubric criterion in `badge_rubrics/<badge_id>.json` has the
following shape:

```json
{
  "criterion_id": "exercise_completion",
  "skill_nodes": ["pandas_numpy", "data_cleaning"],
  "observable_behavior": "The submission reads a CSV file, cleans missing values, and writes a clean Parquet file. The cleaning steps are visible in the code (not hidden in a library call).",
  "performance_levels": {
    "below_floor": "The submission does not produce a clean output file, or the cleaning steps are not visible.",
    "at_floor": "The submission produces a clean output file with visible cleaning steps.",
    "above_floor": "At-floor plus: the cleaning is idempotent (re-running on the clean file is a no-op) and the cleaning choices are documented in the README."
  },
  "critical_fail_conditions": [
    "The submission reads the test set before partitioning.",
    "The submission uses `fillna(0)` on a numeric column without checking whether 0 is a sentinel value."
  ],
  "weight": 0.25,
  "critical_competency": false
}
```

### 4.3 Aggregation

The badge's weighted average is computed from the criterion scores
within each component, then from the component scores. The
aggregation method is `weighted_average_with_non_compensatory_gates`
(see `scoring_rules.gates` in each badge catalog entry).

---

## 5. Assessment validity questions per badge

Before any badge is awarded, the eligibility engine must answer
the following questions for the learner+badge pair. Every "no"
answer blocks the badge. These questions are encoded in
`src/lib/eligibility/engine.ts` (Phase 8).

### 5.1 Universal questions (every badge)

| # | Question | Failure outcome |
|---:|---|---|
| U1 | Are all `prerequisite_badges` in `awarded` (or, for progress badges, `verified`) state for this learner? | `state=locked`; `blocking_reasons` lists each missing prerequisite. |
| U2 | Is every `required_activity` present in the learner's evidence map with a non-null record? | `state=evidence_incomplete`; `blocking_reasons` lists each missing activity. |
| U3 | Has every required activity passed its evidence-tier minimum? (Tier ≥4 for competency badges; tier ≥6 for capstone defenses.) | `state=evidence_incomplete`; `blocking_reasons` lists each below-tier activity. |
| U4 | Is the badge's `status` (in the catalog) `active` or `pilot`? (Retired / superseded badges cannot be freshly awarded.) | `state=locked`; `blocking_reasons` lists the badge status. |
| U5 | (Static edition only.) Has the learner been clearly told this is a preview, not an issuance? | If not, the UI must render the static-edition banner before showing `eligible_pending_verification`. |

### 5.2 Competency badge questions (Families 2 + 3)

| # | Question | Failure outcome |
|---:|---|---|
| C1 | Does the `self_check` aggregate across required sections clear 85%? | `state=assessment_ready` (still in progress) → blocked. |
| C2 | Does the `you_do_projects` rubric aggregate clear 80%? | blocked. |
| C3 | Does the `section_exams` aggregate clear 85%? | blocked. |
| C4 | Does the `integrator_project` rubric clear 85%? | blocked. |
| C5 | Does every `critical_competency` score 100% on every rubric criterion? | blocked — non-compensatory. |
| C6 | Does the weighted-average overall clear 85%? | blocked. |
| C7 | (Pilot badges only.) Has the supplementary exercise for each gap-affected critical competency been completed and rubric-graded ≥100%? | blocked; learner is told which supplementary exercise is missing. |
| C8 | Are all critical-competency rubric evaluations fresh (see §7)? | blocked; learner must re-defend. |

### 5.3 Capstone credential questions (Family 4)

| # | Question | Failure outcome |
|---:|---|---|
| K1 | All competency badge questions C1–C8 pass. | blocked. |
| K2 | Has the phase capstone project (`CP-N*-X`) been completed with a passing rubric (≥85%)? | blocked. |
| K3 | Has the capstone synthesis writeup been submitted and rubric-graded (≥85%)? | blocked. |
| K4 | Has the oral or written defense been conducted and recorded? | blocked. |
| K5 | Did the defense rubric score 100% on every critical competency? | blocked — non-compensatory. |
| K6 | Is the reviewer signature present on the defense record? | blocked; defense is not yet valid. |

### 5.4 Progress badge questions (Family 1)

| # | Question | Failure outcome |
|---:|---|---|
| P1 | Are all `required_sections` present in the learner's progress store as `completed`? | `state=in_progress`; `blocking_reasons` lists each missing section. |
| P2 | (Static edition.) Has the learner been clearly told this is a local-only achievement, not a verified credential? | If not, the UI must render the local-only banner. |

Progress badges do not have provisional floors. They are
motivational markers; they are not proof of proficiency.

---

## 6. Retake and remediation rules

### 6.1 Per-component retake rules

| Component | Cool-down | Max attempts per 90-day window | Notes |
|---|---:|---:|---|
| `self_check` | 0 days (re-take freely) | Unlimited | Self-checks are practice, not assessment. |
| `section_exams` | 7 days | 3 | Server-graded; the highest score counts. After 3 attempts in 90 days, the learner is locked out for the remainder of the window and offered remediation. |
| `you_do_projects` | 7 days | 3 | Re-submission requires a substantive revision (not just a re-submission of the same artifact). The reviewer records the revision delta. |
| `integrator_project` | 14 days | 3 | Re-submission requires a substantive revision. |
| `defense` (capstone) | 30 days | 2 | Re-defense requires the learner to revise the synthesis writeup. The reviewer who conducted the prior defense may not conduct the re-defense. |

### 6.2 Remediation triggers

- **Two failed attempts on the same component within 90 days:** the
  learner is offered a remediation path that points to the
  underlying sections and We Do exercises. The remediation path is
  advisory; it does not lower the floor.
- **A single critical-competency failure:** the learner is offered
  the supplementary exercise (if the competency is gap-affected) or
  pointed to the underlying sections (if not). The remediation is
  advisory; the badge remains blocked until the competency is
  re-evaluated at 100%.
- **Three failed attempts on the same component within 90 days:**
  the learner is locked out of that component for the remainder of
  the window. The lockout is recorded in
  `evidence_registry.jsonl` and surfaced in the learner's
  "what to do next" panel.

### 6.3 Idempotency

Awarding the same badge twice to the same learner is a no-op. The
second award attempt returns the existing `BadgeRecord` and does
not create a new one. This is enforced server-side; the static
edition cannot award at all.

### 6.4 Revocation and appeal

See `revocation_policy` in each badge's catalog entry. Revocation
is a server-side action that flips `BadgeRecord.status` to
`revoked`. The learner is notified with appeal instructions. An
upheld appeal restores the badge to `verified` state with a new
`issued_at` (the appeal decision is recorded).

### 6.5 Stephen Fry redaction in remediation messages

Every learner-facing remediation message must be newbie-friendly.
For example, "Your leakage_prevention score is 75%; you need 100%"
is replaced with "Your score on the **leakage prevention** check
(the rule that your model can't peek at test-set data when
learning) is 75%. This is a critical competency, so it must be
100%. Here's the supplementary exercise that walks through the
common leakage traps."

---

## 7. Evidence freshness policy

Evidence has a freshness window. Evidence older than the window
cannot back a credential; the learner must re-evaluate the
component.

| Evidence type | Freshness window | Re-evaluation path |
|---|---:|---|
| `self_check` score | 2 years | Re-take the self-check. |
| `section_exam` score | 2 years | Re-take the exam (question bank may have rotated). |
| `you_do_project` rubric | 3 years | Re-evaluate against the current rubric; the artifact can be re-submitted as-is if it still meets the rubric. |
| `integrator_project` rubric | 3 years | Re-evaluate against the current rubric. |
| `defense` record | 3 years | Re-defense required for renewal. |
| `critical_competency` rubric | 3 years | Re-evaluate against the current rubric; supplementary exercise must be re-done if the underlying curriculum gap has been closed since the original evaluation. |

### 7.1 Why freshness matters

Industry skill expectations change (see `industry_reality_brief.md
§15`). A `leakage_prevention` rubric criterion written in 2024
may not cover a 2026 LLM-specific leakage pattern. The freshness
window forces re-evaluation, which forces the rubric to be
re-validated against current industry expectations.

### 7.2 Expiration vs. freshness

- **Expiration** is the credential's lifecycle: 3 years from
  issuance (1095 days). An expired credential is removed from the
  learner's public claim but remains in their private record.
- **Freshness** is the evidence's lifecycle: the window during
  which a piece of evidence can back a *new* credential. Freshness
  is checked at eligibility time, not at issuance time. A learner
  whose 2-year-old exam score is still on file but whose badge
  has not yet been issued will see "exam score expired; please
  re-take" in their eligibility report.

### 7.3 Re-evaluation is non-destructive

Re-evaluation does not delete the original evidence. The original
record remains in `evidence_registry.jsonl` with a
`superseded_by` pointer to the new record. This preserves the
audit trail.

---

## 8. Per-badge validity summary

The eligibility engine (Phase 8) computes a `BadgeEligibilityReport`
per learner+badge pair. The report includes:

- `badge_id`, `version`, `status` (catalog status)
- `state` (one of `locked`, `available`, `in_progress`,
  `evidence_incomplete`, `assessment_ready`,
  `eligible_pending_verification`, `awarded`)
- `eligible` (boolean; `true` only when `state` is
  `eligible_pending_verification` or `awarded`)
- `requirements` (array of `RequirementResult`, one per
  requirement, with `pass`, `score`, `floor`, and `blocking_reason`)
- `blocking_reasons` (array of newbie-friendly strings, Stephen
  Fry redacted)
- `edition` (`static` or `dynamic`)

### 8.1 State semantics

| State | Meaning |
|---|---|
| `locked` | At least one prerequisite badge is not awarded. |
| `available` | Prerequisites met; no evidence collected yet. |
| `in_progress` | Some evidence collected; not all required activities present. |
| `evidence_incomplete` | All required activities present but one or more is below evidence-tier minimum. |
| `assessment_ready` | All evidence collected; one or more assessment floors not yet met. |
| `eligible_pending_verification` | All floors met (incl. critical competencies); awaiting server-side verification. (Static edition: preview only.) |
| `awarded` | Server has signed and issued the credential. (Static edition: never reached.) |

### 8.2 Determinism

The eligibility engine is deterministic: the same input (learner
progress + assessment attempts + project results + catalog
version) always produces the same output. There is no randomness,
no time-of-day dependence (freshness is computed against a
provided `now` argument, not `Date.now()`), and no implicit state.

### 8.3 Versioning

Badge specs are versioned (`badge_catalog.json#version` and each
badge's `version` field). The eligibility engine takes a
`catalog_version` argument and refuses to evaluate against a
mismatched catalog. This prevents a silent spec change from
invalidating a learner's eligibility report.

---

## 9. Gate summary

The full gate chain, in evaluation order, for a competency badge:

1. **Catalog version match.** (Mismatch → error.)
2. **Badge status.** (`retired` / `superseded` → `locked`.)
3. **Prerequisite badges awarded.** (Missing → `locked`.)
4. **Required activities present.** (Missing → `evidence_incomplete`.)
5. **Evidence tier minimum.** (Below tier → `evidence_incomplete`.)
6. **Per-component floors.** (Below floor → `assessment_ready` blocked.)
7. **Critical competency floors (=100%).** (Below → blocked, non-compensatory.)
8. **Weighted-average overall (≥85%).** (Below → blocked.)
9. **(Pilot badges only.) Supplementary exercise.** (Missing → blocked.)
10. **Evidence freshness.** (Stale → blocked; re-evaluation required.)
11. **Edition check.** (Static → `eligible_pending_verification`,
    not `awarded`. Dynamic → `awarded` after server signature.)

A badge reaches `eligible_pending_verification` only when gates
1–10 all pass. It reaches `awarded` only when gate 11 also passes
(dynamic edition only).

---

## 10. Open items for Phase 8

1. Implement `src/lib/eligibility/types.ts` — TypeScript types
   for the eligibility contract above.
2. Implement `src/lib/eligibility/engine.ts` — the deterministic
   eligibility engine.
3. Implement `src/lib/eligibility/badge-specs.ts` — the badge
   spec loader (reads `badge_catalog.json` and produces
   versioned in-memory specs).
4. Implement `src/lib/eligibility/index.ts` — the public API
   surface.
5. Implement the adversarial Python tests
   (`tests/adversarial/test_eligibility_engine.py`) that
   exercise every gate above with both passing and failing
   fixtures. The Python tests include a reference
   implementation of the engine; the TypeScript engine is the
   runtime implementation and is verified against the same
   fixtures.

---

**End of report.**
