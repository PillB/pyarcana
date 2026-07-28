# Progress Migration Plan

**Generated:** 2026-07-28T22:08:04Z  
**Catalog version:** 1.0.0

## 1. Purpose
This document specifies how existing learner progress — stored
in the legacy `python-ds-progress` and `python-ds-lang`
`localStorage` keys, and in the legacy Prisma models
(`Progress`, `ExamAttempt`, `ExerciseAttempt`) — is migrated
into the new badge and credential system specified in Phase 6.

The cardinal rule: **legacy course completion does NOT
fabricate missing badge evidence.** Legacy data contributes to
progress badges (Family 1) only. Competency badges (Families 2
and 3) and capstone credentials (Family 4) require fresh,
rubric-graded evidence per the badge's `evidence_rules`.
## 2. Legacy data sources
Three legacy data sources are migrated:

1. **`localStorage['python-ds-progress']`** — a JSON object
   keyed by section ID, with per-section completion status and
   exam scores. This is the static-edition progress store
   (Phase 0 §3).
2. **`localStorage['python-ds-lang']`** — language preference
   (`es` or `en`). Not migrated to badge system; preserved as
   UI preference only.
3. **Prisma models on the dynamic LMS** — `Progress`,
   `ExamAttempt`, `ExerciseAttempt`. These contain richer data
   than `localStorage` (server-side authoritative), including
   exam attempt histories and timestamps.

The migration script reads all three and produces a
`BadgeEligibilityReport` per learner.
## 3. Migration algorithm
The migration runs in five passes, in order:

### Pass 1 — Section completion inventory
For each section `SNN`:
- Read `localStorage['python-ds-progress'][sectionId]` (if
  present).
- Read `Progress` row for the learner+section (if on the LMS).
- If either source shows the section marked complete, record
  `activity_completed(sectionId, type='you_do')`,
  `activity_completed(sectionId, type='self_check')`, and
  `activity_completed(sectionId, type='exam')` in the new
  badge evidence store.
- Do NOT record exam scores yet; those are processed in Pass 2.

### Pass 2 — Exam score reconciliation
For each section exam:
- Read `ExamAttempt` rows (LMS) or `localStorage` exam score.
- Take the highest score across all attempts.
- If the highest score >=85%, record it as evidence for the
  badge's `section_exams` component.
- If the highest score is in the 70-84% range, record it as
  evidence for the `progress_*` badges only; flag the section
  as `exam_below_badge_floor` for the competency badges.
- If the highest score <70%, no evidence is recorded; the
  learner must retake the exam.

### Pass 3 — You Do project reconciliation
For each section You Do:
- Read `ExerciseAttempt` rows (LMS) or `localStorage` You Do
  completion flag.
- If the section shows You Do completed, record it as evidence
  for `progress_*` badges.
- Do NOT record it as evidence for competency badges; the
  legacy rubric outcome is not accepted as-is. The learner's
  eligibility for competency badges will note "You Do project
  requires re-evaluation against current rubric."

### Pass 4 — Progress badge issuance
For each progress badge (`progress_phase0_walked` through
`progress_journey_completed`):
- Check whether all required sections are present in the
  migrated section-completion inventory.
- If yes, issue the progress badge locally (static edition)
  or server-side (LMS).
- If no, mark the progress badge as `in_progress` with the
  list of missing sections.

### Pass 5 — Competency and capstone badge eligibility
  computation
For each competency badge and capstone credential:
- Compute eligibility per the badge's `assessment_blueprint`,
  using the migrated evidence.
- For each required activity:
  - If the activity is a section exam and the legacy score
    >=85%, count it as meeting the floor.
  - If the activity is a section exam and the legacy score is
    70-84%, mark it as `below_floor`.
  - If the activity is a You Do project, mark it as
    `requires_rubric_reevaluation`.
  - If the activity is missing entirely, mark it as `missing`.
- For each critical competency:
  - Mark it as `requires_supplementary_exercise` if the
    competency is gap-affected (leakage_prevention,
    python_type_safety, sql_performance_tuning).
  - Otherwise mark it as `requires_rubric_evaluation`.
- Do NOT issue any competency badge or capstone credential
  from legacy data alone.

The learner sees a per-badge eligibility report with clear
next-steps: "Retake this exam", "Re-evaluate this You Do
project against the current rubric", "Complete this
supplementary exercise", "Build this integrator project",
"Schedule this defense".
## 4. Learner-facing migration panel
The migration panel (UI component:
`src/components/badge/LegacyMigrationPanel.tsx`, to be
implemented in Phase 7) shows:

1. **What carried over** — a list of progress badges issued
   from legacy data, with the source pointer
   (`localStorage` or `Prisma`).
2. **What did NOT carry over** — a list of competency badges
   and capstone credentials the learner is *not* yet eligible
   for, with the specific reason per badge.
3. **What to do next** — a prioritized list of actions:
   - "Retake exam for S14 (current 72%, need 85%)"
   - "Re-evaluate You Do for S20 against the current rubric"
   - "Complete the supplementary exercise for
     leakage_prevention"
   - "Build the integrator project for
     python_data_foundations"
4. **No-claim banner** — a clear statement: "Legacy course
   completion contributed to your progress badges only. Your
   competency badges and capstone credentials require fresh,
   rubric-graded evidence per the PyArcana credential
   architecture."
## 5. Edge cases
- **Learner with `localStorage` only (no LMS account):** Pass
  1-4 run on the static edition; Pass 5 produces an
  eligibility preview (NOT issuance). The learner is told to
  sign in to the LMS to issue any competency or verified
  credential.
- **Learner with LMS account but no `localStorage`:** Pass
  1-4 run server-side; Pass 5 produces a server-side
  eligibility report.
- **Learner with conflicting `localStorage` and LMS data:**
  The LMS data wins (it's authoritative per Phase 0 §3). The
  migration script logs the conflict to
  `evidence_registry.jsonl` and uses the LMS data.
- **Learner with `localStorage` data for sections that no
  longer exist in the curriculum:** The migration script
  ignores the orphan data and logs it to
  `memory/rejected_hypotheses.jsonl` for review.
- **Learner who completed a phase capstone in the legacy
  course:** The capstone completion is recorded as a
  `project_completed` event for the corresponding
  `CP-N*-X` ID. It does NOT satisfy any capstone credential
  defense requirement; the defense must be re-done.
## 6. Rollback
The migration is non-destructive: it never deletes or
overwrites legacy data. It only writes to the new badge
evidence store and to `BadgeRecord` rows (Phase 7). If the
migration is reverted, the legacy data is intact and the
learner's progress is preserved.
## 7. Implementation milestones (Phase 7)
1. `scripts/migrate_legacy_progress.mjs` — the migration
   script. Reads `localStorage` (via a headless-browser
   harness for testing) and Prisma models; writes to the new
   badge evidence store and `BadgeRecord` rows.
2. `src/components/badge/LegacyMigrationPanel.tsx` — the
   learner-facing migration panel.
3. `tests/adversarial/test_legacy_migration.py` — adversarial
   tests:
   - Learner with no legacy data -> no progress badges issued.
   - Learner with all 13 Phase 0 sections complete ->
     `progress_phase0_walked` issued.
   - Learner with all 13 Phase 0 sections complete but no
     exam scores >=85% -> no competency badges issued; clear
     "retake exam" guidance.
   - Learner with conflicting `localStorage` and Prisma data
     -> Prisma wins; conflict logged.
   - Learner with orphan section data -> ignored; logged.
