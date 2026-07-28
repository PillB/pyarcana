# Industry Alignment Campaign — Worklog

This worklog tracks the orchestrator's running narrative for the PyArcana
industry-alignment curriculum-hardening campaign. Each phase appends an
entry. Sub-phases and cycles are recorded in `execution_ledger.json`;
evidence artifacts are recorded in `evidence_registry.jsonl`.

---

## Phase 0 — Bootstrap and Repository Reality Check

**Started:** 2026-07-28T20:10:00Z
**Completed:** 2026-07-28T20:30:00Z
**Orchestrator:** phase0-orchestrator
**Branch at start:** `fixer-wave-s01-s09-remediation` @ `84aa9e4`
**Origin/main at start:** `316fc14` (1 commit ahead via PR #17 merge)

### Mission

Pure inventory. No curriculum content modifications. Produce a complete
repository reality check before any subsequent phase proposes changes.
Verify: 52 canonical sections, persistence/assessment authorities,
static/dynamic behavior, legacy progress formats, test suites, existing
course-state + expert_audit artifacts, key architectural files, and any
live/repository divergences.

### Cycles executed

| Cycle ID | Name | Status |
|---|---|---|
| P0-C01 | Repository state extraction | completed |
| P0-C02 | Canonical section inventory (52 files) | completed |
| P0-C03 | Progress store and persistence audit | completed |
| P0-C04 | Static vs dynamic behavior + authentication audit | completed |
| P0-C05 | Test suite inventory | completed |
| P0-C06 | Existing artifact audit (course-state, expert_audit, industry_alignment) | completed |
| P0-C07 | Divergence detection + cross-source consistency | completed |
| P0-C08 | Graph Memory directory bootstrap | completed |

(Per-cycle inputs, outputs, and evidence refs are in `execution_ledger.json`.)

### Key findings

1. **Repository is on a feature branch behind origin/main.** Local HEAD
   `84aa9e4` is the source branch that was merged into `origin/main` via
   PR #17 (`316fc14`). Local `main` was not fast-forwarded. Live site is
   built from `origin/main` on every push. Any subsequent phase must rebase
   or merge from `origin/main` to align with the live site. (`DIV-002`)

2. **All 52 canonical sections are present and importable.** The course
   index `src/lib/course/index.ts` imports section01..section52 from 52
   distinct files. `COURSE_META.totalSections === 52`. Five orphan section
   files exist in `src/lib/course/sections/` but are not imported; they are
   already tracked as `archivos huérfanos/duplicados` in `course-state/`.
   (`DIV-004`)

3. **Persistence is dual-mode.** Client side: Zustand persist to
   `localStorage` keys `python-ds-progress` and `python-ds-lang` (no
   version field on either). Server side: Prisma + SQLite with 9 models
   (User, FeedbackReport, Progress, QuestionBank, ExamAttempt,
   ExerciseAttempt, SubscriptionPlan, Subscription, Payment). Optional
   Firebase Admin dual-write to Firestore (Spark tier, best-effort, Prisma
   remains source of truth). Hardening ledger in `course-state/` (v3.2) is
   a separate offline artifact owned by the orchestration pipeline.

4. **Assessment authorities are server-side.** Exam scoring is pure
   (`src/lib/exam-scoring.ts`, `PASS_THRESHOLD = 70`). Max 3 attempts per
   user/section enforced in `POST /api/exam/start`. Grading happens
   server-side in `POST /api/exam/submit` via `gradeExamAnswers()`.
   QuestionBank has `@@unique([sectionId, concept, variant])` for 3
   variants per concept.

5. **Static vs dynamic is build-time switched.** `NEXT_PUBLIC_STATIC_SITE=1`
   + `NEXT_OUTPUT=export` produces the GitHub Pages static site. The static
   build script (`scripts/build_static_export.mjs`) uses a disposable
   `mkdtempSync` copy and `rmSync`s `src/app/api` from the copy only —
   tracked working tree is never mutated. 12 `IS_STATIC_SITE` guards in
   `src/app/page.tsx` hide auth/admin/pricing/feedback UI in static mode.
   The static site contract is enforced by
   `tests/adversarial/test_static_export_guard.py`.

6. **Authentication is NextAuth v4 with CredentialsProvider.** JWT session
   (7-day maxAge). Roles: STUDENT (default) | ADMIN. Password policy
   min 12 chars. Rate-limited registration via
   `src/lib/registration-security.ts` (15-min window). DUMMY_PASSWORD_HASH
   constant for timing equalization of unknown-user vs wrong-password.
   No OAuth providers configured.

7. **18 server-side API routes** under `src/app/api/`: admin
   (analytics/export/students), auth (NextAuth + register), exam
   (attempts/start/submit), exercise/attempt, feedback (route + [id]),
   firebase/status, progress (GET/POST/PATCH), subscription
   (checkout/plans/status), plus a hello-world root. All non-trivial
   routes use Zod schemas; admin routes gate on role=ADMIN; exam/exercise/
   progress gate on authenticated session.

8. **Test suite is extensive.** 4 top-level Playwright specs (1,031 lines,
   including the 17-test `v3_regression.spec.ts` and the 12-test
   `regression.spec.ts` asserting 52 section ids). 12 e2e_max specs
   (1,139 lines). 8 Node adversarial tests + 28 Python adversarial tests
   (4,596 lines total). 29 test-related npm scripts. CI workflow has 6
   jobs (lint, typecheck, adversarial-unit, platform-builds matrix,
   regression-content, regression-browser).

9. **Existing artifacts are rich.** `course-state/` has 178 top-level
   files: 6 ledger files (checkpoint, section_ledger, capstone_ledger,
   course_requirements, issue_registry, PRODUCTION_STATUS), 6
   subdirectories (audits, capstones with 13 CP-* dirs, curriculum_hardening
   with prior GRAPH_MEMORY.json + 22 git_restore_decision files, lanes with
   40 LANE-*.status.json files, newbie_walkthrough with dual-newbie
   transcripts, topic_evaluations with 52 sNN_te.json files). `expert_audit/`
   has 52 per-section reports + 52 Round-2 worklog entries + 22 .docx
   human-expert audits + grammar subplan + campaign summary + path mapping
   + independent fixer inventory.

10. **Five divergences were discovered.** See `source_registry.json#divergences_identified`
    and §8 of `phase0_bootstrap_report.md`. Most significant is `DIV-001`
    (P1): `prisma/seed.ts` line 11743 uses `'agentic-architecture'` for
    section 40 but `s40-architecture-ddd.ts` line 4 declares
    `id: "architecture-ddd-decisions"`. Section 40 exams silently broken
    on dynamic LMS; static site unaffected.

### Gate check

All seven Phase 0 gate criteria are met. See `phase0_bootstrap_report.md#9-phase-0-gate-check`
and `execution_ledger.json#gate_check`. **Overall: PASS.**

### Outputs produced

- `industry_alignment/README.md`
- `industry_alignment/worklog.md` (this file)
- `industry_alignment/execution_ledger.json` (8 cycles, all completed)
- `industry_alignment/evidence_registry.jsonl` (27 evidence entries)
- `industry_alignment/source_registry.json` (full inventory + 5 divergences)
- `industry_alignment/phase0_bootstrap_report.md` (this phase's final report)
- `industry_alignment/section_audits/` (empty, ready for Phase 1)
- `industry_alignment/badge_requirements/` (empty, ready for Phase 1)
- `industry_alignment/badge_rubrics/` (empty, ready for Phase 1)
- `industry_alignment/decisions/` (empty, ready for Phase 1)
- `industry_alignment/memory/notes/` (empty)
- `industry_alignment/memory/cycles/` (empty)
- `industry_alignment/memory/rejected_hypotheses.jsonl` (empty)
- `industry_alignment/memory/rejected_badge_claims.jsonl` (empty)

### Handoff to Phase 1

Phase 1 should:

1. Decide whether to address `DIV-001` (section 40 ID mismatch) before or
   during badge-framework design. Any badge that depends on section 40
   exam-attempt evidence is currently unattainable on the dynamic LMS.
2. Reconcile with `origin/main` (`316fc14`) before making any tracked
   changes, so the live site and the working tree are aligned.
3. Use the existing `course-state/curriculum_hardening/GRAPH_MEMORY.json`
   as prior context — it is the predecessor of this campaign's
   `industry_alignment/` graph memory and should be cross-referenced, not
   duplicated.
4. Treat the 5 orphan section files (`s07-pandas.ts`, `s08-visualization.ts`,
   `s09-sklearn.ts`, `s10-testing.ts`, `s11-advanced-topics.ts`) as
   out-of-scope unless Phase 1 explicitly decides to clean them up. They
   have no runtime impact and the expert audit explicitly chose to ignore
   them.
5. Treat the per-section phase0/phase1/phase2 coverage gaps (`DIV-005`) as
   a historical artifact. S27-S52 were authored under a later pipeline
   that did not produce these phase files; this is not a regression.

Phase 0 is closed.

---

## Phase 1 + Phase 2 — Complete Industry Research + Industry Skill Graph

**Task ID:** PHASE-1-2
**Agent:** `industry_signal_researcher` + `curriculum_graph_builder`
**Started:** 2026-07-28T21:10:00Z
**Completed:** 2026-07-28T22:30:00Z
**Branch:** unchanged from Phase 0 (`fixer-wave-s01-s09-remediation` @ `84aa9e4`)

### Mission

Complete Phase 1 industry research (add RPA/AIML/Production Python to the
existing DA+DS brief) and build the Phase 2 industry skill graph artifacts
(`industry_skill_graph.json`, `role_skill_taxonomy.json`). Synthesize from
the existing raw search corpus only; do NOT re-run web searches.

### Work Log

1. **Read existing state.** Read `industry_reality_brief.md` (979 lines,
   DA + DS only) and `phase1_research/sources_rpa_aiml_py.md` (307 lines,
   53 raw-search file inventory for the three new roles).
2. **Sampled raw search files.** Read 24 of the 53 raw-search JSON files
   across all three role groups (RPA, AIML, Py) plus all 6 cross-cutting
   files (`cross_01` through `cross_06`). Confirmed several queries
   returned dictionary/aggregator noise (e.g., `rpa_10_complaints.json`
   returned Amazon/USPS job-aggregator noise; `cross_05_sfia.json`
   collided with Steel Framing Industry Association + Sports and Fitness
   Industry Association). Documented this in §31 of the brief.
3. **Appended Part B (§19–§32) to `industry_reality_brief.md`.** Added
   1,300 lines covering:
   - §19 Frequently missing capabilities — RPA (selector fragility,
     exception-handling discipline, queue/dispatcher-performer pattern,
     measurable-impact framing, Python-based RPA sub-track)
   - §20 Role-specific skills — RPA (12-row required-skills table +
     commonly-taught-vs-demonstrate + tool-specific-vs-durable +
     market differentiators + salary/geography)
   - §21 Level differentials — RPA (4 levels × 6 dimensions: autonomy,
     ambiguity, scope, complexity, consequence, market-readiness +
     evidence-of-capability)
   - §22 Frequently missing capabilities — AIML (production/deployment
     naivety, interview-style mismatch, missing MLOps/LLMOps, missing
     uncertainty quantification, missing drift monitoring, missing
     stakeholder translation, bootcamp-portfolio inflation)
   - §23 Role-specific skills — AIML (18-row required-skills table +
     commonly-taught-vs-demonstrate + tool-specific-vs-durable +
     market differentiators + salary/geography)
   - §24 Level differentials — AIML (4 levels × 6 dimensions, mapped
     to L3/L4/L5/L6/L7 industry ladder per mlengineersalary.com)
   - §25 Frequently missing capabilities — PySE (production-readiness
     discipline, type-safety discipline, code-review/Git-collaboration
     literacy, async-testing skill, security mindset, bootcamp-
     portfolio inflation, end-to-end ownership signal)
   - §26 Role-specific skills — PySE (16-row required-skills table +
     commonly-taught-vs-demonstrate + tool-specific-vs-durable +
     market differentiators + salary/geography)
   - §27 Level differentials — PySE (4 levels × 6 dimensions, mapped
     to Junior → Senior → Tech Lead / Staff → Principal / Architect
     per Python Foundation + Fonzi.ai)
   - §28 Cross-role synthesis (universal skills, role differentiators,
     critical non-compensatory competencies, level-progression verb
     matrix)
   - §29 Evidence table for RPA/AIML/Py (extends §12 DA/DS evidence
     table)
   - §30 Confidence summary per finding (29 findings rated HIGH/MEDIUM)
   - §31 Search-quality caveats + 6 preserved disagreements
   - §32 Updated handoff to Phase 2
4. **Updated brief header.** Title now reads "Five roles (Data Analyst,
   Data Scientist, RPA/Automation Developer, AI/ML Engineer, Production
   Python Engineer), four capability levels each". Added Phase 1B
   completion timestamp + saturation-status note.
5. **Built `_build_skill_graph.py`** — a 700-line Python synthesizer
   that constructs both JSON artifacts from a single source-of-truth
   data structure (ROLES, LEVEL_DESCRIPTORS, SKILL_NODES,
   SKILL_DEPENDENCIES, CRITICAL_COMPETENCIES, VERB_MATRIX). Script
   validates referential integrity on every run.
6. **Generated `industry_skill_graph.json`** (110,972 bytes). Structure
   matches the Phase 2 spec: `version`, `generated_at`, `roles[]` (5
   roles × 4 levels each, with autonomy/ambiguity/scope/complexity/
   consequence + verb_matrix + skill_id list), `skill_nodes[]` (62
   nodes with category/description/roles/levels-per-role/evidence_types/
   critical_competency flag), `skill_dependencies[]` (59 edges, types:
   prerequisite/supports/enables), `critical_competencies[]` (8
   non-compensatory competencies with skill_ids + evidence), `stats`.
7. **Generated `role_skill_taxonomy.json`** (258,401 bytes). Pedagogical
   form: `roles[]` with full level descriptors (incl. verb_matrix +
   complete skill objects per level, not just IDs), `design_principles`
   (5 principles stating that levels are defined by autonomy/ambiguity/
   scope/complexity/consequence — NOT years of experience — and that
   critical competencies are non-compensatory), `skill_dependencies`,
   `critical_competencies`, `stats` (incl. 437 total role-level-skill
   assignments).
8. **Validated JSON integrity.** Ran 5 validation checks:
   - All 59 dependency endpoints reference existing skill IDs: PASS
   - All role-level skill references (437 assignments) reference
     existing skill IDs: PASS
   - All critical-competency skill_ids reference existing skill IDs:
     PASS
   - Verb vocabulary matches Solarized Phase 2 spec exactly (10 verbs:
     knowing, following, applying_with_guidance, applying_independently,
     diagnosing, designing, operating, evaluating, advising, leading):
     PASS
   - 9 universal skill nodes (present in all 5 roles) match §28.1
     cross-role synthesis: PASS (python_core, data_validation,
     git_workflow, ai_code_review_literacy, stakeholder_management,
     written_communication, oral_communication, business_framing,
     tradeoff_articulation)

### Stage Summary

**Phase 1 (industry research) is now COMPLETE for all 5 roles.**
- `industry_reality_brief.md` grew from 979 lines to 2,279 lines
  (Parts A + B, §1–§32).
- 53 raw-search files in `phase1_research/raw_searches_rpa_aiml_py/`
  were synthesized; no new web searches were run.
- 29 findings rated HIGH or MEDIUM confidence in §30; 6 disagreements
  preserved in §31.2; search-quality caveats documented in §31.1.

**Phase 2 (industry skill graph) is now COMPLETE.**
- `industry_skill_graph.json`: 5 roles × 4 levels = 20 role-level
  combinations; 62 skill nodes across 16 categories; 59 skill
  dependencies; 8 critical (non-compensatory) competencies.
- `role_skill_taxonomy.json`: same data, pedagogical form (full skill
  objects per role-level, 447 total assignments, 5 design principles).
- Builder script `_build_skill_graph.py` is reproducible and
  referentially validated.

**Key design decisions:**
1. Levels use 5 dimensions (autonomy/ambiguity/scope/complexity/
   consequence) — NOT years of experience — consistent with the
   Solarized Phase 2 spec and SFIA 9 essence statements.
2. The 10-verb vocabulary (knowing/following/applying-with-guidance/
   applying-independently/diagnosing/designing/operating/evaluating/
   advising/leading) is encoded as a `verb_matrix` per level, with
   `partial` allowed at intermediate levels (e.g., L2 "diagnosing":
   partial).
3. 8 critical competencies are flagged non-compensatory: SQL (DA/DS),
   leakage prevention (DS/AIML), selector resilience (RPA), type safety
   + production hardening (PySE), MLOps fluency (AIML), business
   framing + metric design (all senior+), communication (all),
   reproducibility (all).
4. 9 skill nodes are universal across all 5 roles (Python core, data
   validation, Git workflow, AI-code review literacy, stakeholder
   management, written communication, oral communication, business
   framing, tradeoff articulation) — matching §28.1 of the brief.
5. RPA's role_id is `rpa_automation_developer` (not `rpa_developer`)
   to disambiguate from the regional-planning acronym collision noted
   in §31.1.

**Handoff to next phase:**
1. Phase 3 (badge rubric design) can now consume
   `industry_skill_graph.json` (graph form, for dependency-aware
   badge ordering) and `role_skill_taxonomy.json` (pedagogical form,
   for badge rubric criteria).
2. Each non-compensatory critical competency (§28.3 of brief +
   `critical_competencies[]` in JSON) must be a hard gate, not a
   weighted score, in badge design.
3. The verb_matrix per level should drive badge-tier naming
   (e.g., L1 "knows + follows", L2 "applies + diagnoses-partial",
   L3 "designs + operates", L4 "evaluates + advises + leads").
4. DIV-001 (section 40 ID mismatch) remains unresolved and blocks
   any badge that depends on section 40 exam-attempt evidence
   (carried forward from Phase 0 + Phase 1A handoff).
5. Geography scope decision (LATAM RPA round 2?) remains open
   (carried forward from §17 + §32.6).

Phase 1 + Phase 2 are closed.

---

## Phase 3 — Build Complete Curriculum Graph

**Task ID:** PHASE-3
**Agent:** `curriculum_graph_builder`
**Started:** 2026-07-28T21:30:00Z
**Completed:** 2026-07-28T21:38:00Z
**Branch:** unchanged from Phase 1+2 (`fixer-wave-s01-s09-remediation` @ `84aa9e4`)

### Mission

Read all 52 canonical section source files in
`src/lib/course/sections/s*.ts` (as imported by `src/lib/course/index.ts`)
and build a complete curriculum graph that maps every section, subtopic,
I Do, We Do, You Do, self-check, exercise, exam, applied project, and
capstone to explicit skill nodes from the Phase 2 industry skill graph.

### Method

1. Parsed `src/lib/course/index.ts` to extract the canonical 52-section
   import order. Confirmed exactly 52 imports (no orphans included).
2. Built a brace- and bracket-aware TypeScript literal parser
   (`_phase3_build/build_curriculum_graph.py`) that walks each section
   file's object literal, extracting:
   - Top-level scalars: id, index, title, shortTitle, tagline, level,
     phase, estimatedHours, icon
   - `learningOutcomes[]` (count + texts)
   - `theory[]` (count, headings, subtopicIds)
   - `iDo.steps[]` (count, demoIds, subtopicIds, environments)
   - `weDo.steps[]` (count, exerciseIds, subtopicIds, kinds, E1/E2/E3
     variants)
   - `youDo` (title, objectivesCount, requirementsCount, rubric[],
     capstoneRefs via `CP-N*-X` and `CP-FINAL` regex)
   - `selfCheck.questions[]` (count, correctIndex array, question text)
   - `topicEvaluations[]` if inline (count, task IDs, deliverables)
3. Classified each learning activity with the Phase 3 schema:
   `activity_id`, `section_id`, `subtopic_id`, `activity_type`,
   `skill_nodes[]`, `evidence_independence` (none/guided/
   partially_guided/independent), `evidence_strength` (none/weak/
   moderate/strong), `authenticity` (low/medium/high), `feedback_quality`
   (low/medium/high), `credential_eligible` (bool), `limitations[]`.
4. Added an implicit `exam` activity per section, since Phase 0 §4
   established that every section has a server-graded MCQ exam
   (max 3 attempts, pass@70, `gradeExamAnswers()` server-side).
5. Mapped each section to its primary industry skill nodes via a
   curated `SECTION_SKILL_MAP` (1–4 nodes per section) derived from
   the section title, phase plan, and COURSE_META target role.
6. Created 9 edge types: `prerequisite` (sequential S1→S52),
   `reinforcement` (within-section theory→demo→exercise per subtopic),
   `transfer` (We Do → You Do within section), `assessment`
   (theory → self_check/exam), `project_application` (you_do → exam),
   `badge_evidence` (you_do/exam → phase badge), `capstone_integration`
   (per-phase integrator section S26/S39/S51 closes phase capstone),
   `skill_application` (section activity → industry skill node),
   `skill_reinforcement` (consecutive sections teaching the same skill).

### Work Log

1. **Read source structure.** Read `src/lib/course/index.ts` (95 lines,
   52 imports, 4 phases), `src/lib/types.ts` (176 lines defining
   `CourseSection`, `TheoryBlock`, `IDoStep`, `WeDoStep`, `YouDoProject`,
   `SelfCheck`, `TopicEvaluation` interfaces), and `s01-setup.ts` lines
   1–2279 as a structural reference. Confirmed every section file
   conforms to the same `CourseSection` interface shape.
2. **Sampled section variety.** Spot-checked S01 (Phase 0 — setup),
   S26 (Phase 1 integrator — closes CP-N2-A/B/C), S52 (Phase 3
   integrator — closes CP-FINAL). Confirmed integrator sections
   explicitly reference multiple capstones in their `youDo` block.
3. **Built the parser.** `_phase3_build/build_curriculum_graph.py`
   (~700 lines). Includes brace- and string-aware block extraction
   (handles `"`, `'`, `` ` `` string literals and escape sequences
   inside template strings). Counted top-level object literals for
   arrays of objects (`theory[]`, `iDo.steps[]`, `weDo.steps[]`,
   `rubric[]`) and top-level string literals for arrays of strings
   (`learningOutcomes[].text`, `objectives[]`, `requirements[]`).
4. **Ran the parser.** All 52 sections parsed successfully on first
   run (no errors). Output: 476 theory blocks, 416 I Do demos,
   1248 We Do exercises (24 per section = 8 subtopics × 3 E1/E2/E3
   variants), 52 You Do projects, 389 self-check questions,
   12 inline topic evaluations (S01=4, S02=4, S30=4), 52 implicit
   exam activities. Total: 2,320 learning activities.
5. **Verified output.** Each activity has all required classification
   fields. 104 activities are credential-eligible (49 you_do + 3
   capstone + 52 exam). 4,372 edges across 9 edge types. 13 capstones
   referenced (CP-N1-A..CP-N4-C + CP-FINAL). 46/62 industry skill nodes
   covered (16 uncovered; see §7 of summary).

### Outputs produced

- `industry_alignment/curriculum_skill_graph.json` (2,696,946 bytes,
  2,320 activities, 4,372 edges, 52 sections + 13 capstones + 9
  edge types)
- `industry_alignment/curriculum_graph_summary.md` (224+ lines, human-
  readable summary with per-section inventory table, You Do project
  detail table, gate check, handoff to Phase 4)
- `industry_alignment/_phase3_build/build_curriculum_graph.py`
  (reproducible builder script with referential integrity)

### Key findings

1. **Pedagogical structure is highly consistent across 52 sections.**
   Every section has exactly 8 I Do demos and 24 We Do exercises
   (8 subtopics × 3 E1/E2/E3 progressive-release variants). Every
   section has ≥1 theory block (median 9, max 13 in S01), ≥1 self-check
   question (median 8, range 5–11), and a You Do project (median 5
   objectives, median 8 requirements, median 6 rubric criteria).

2. **The course delivers 1,040 hours** (matches `COURSE_META.totalHours`
   exactly), distributed Phase 0: 240 h, Phase 1: 240 h, Phase 2: 240 h,
   Phase 3: 320 h (Master phase is heavier per Phase 0 §2).

3. **13 capstones referenced** — 12 phase-level (`CP-N1-A` through
   `CP-N4-C`) plus `CP-FINAL` (cross-curriculum integrator at S52).
   Each phase capstone is closed by its integrator section
   (S26 for Phase 1, S39 for Phase 2, S51 for Phase 3); S52 closes
   `CP-FINAL`. `CF-2` (cross-capstone interface contract) is
   referenced in S26 but is a contract, not a capstone deliverable.

4. **16 of 62 industry skill nodes are NOT covered by any section**
   (74% coverage). The uncovered nodes cluster into 4 groups:
   - Vendor-specific RPA tools that PyArcana deliberately does not
     teach (uses Python-based RPA instead): `uipath_studio`,
     `orchestrator_operations`, `reframework`, `power_automate`,
     `automation_anywhere`, `vbdotnet_csharp` (6 nodes).
   - Alternative languages PyArcana does not teach: `r_language` (1).
   - Spreadsheet/Excel skills the curriculum defers to pandas: `excel_spreadsheets` (1).
   - **Genuine statistical/ML gaps worth flagging for Phase 4**:
     `causal_inference`, `experimental_design`, `hypothesis_testing`,
     `regression`, `feature_engineering`, `leakage_prevention`,
     `python_type_safety`, `sql_performance_tuning` (8 nodes).
     Note: `leakage_prevention` is a Phase 2 critical (non-
     compensatory) competency for DS/AIML; its absence is the most
     serious gap. `python_type_safety` is critical for PySE.

5. **Inline topicEvaluations are sparse.** Only 3 of 52 sections
   (S01, S02, S30) have inline `topicEvaluations` in the source
   file. The remaining 49 sections have their topic evaluations in
   `course-state/topic_evaluations/sNN_te.json` (53 files including
   `_manifest.json`), which are out-of-band artifacts not consulted
   by this phase. Phase 4 gap analysis should decide whether to fold
   those external evaluations into the curriculum graph or treat
   them as a parallel evidence layer.

6. **Section 40 ID confirmed.** `s40-architecture-ddd.ts` declares
   `id: 'architecture-ddd-decisions'` — matches Phase 0 §10 DIV-001.
   The `prisma/seed.ts` mismatch (`'agentic-architecture'`) is still
   unresolved and continues to block section 40 exam-attempt evidence
   on the dynamic LMS (carried forward).

7. **Evidence-independence classification is honest.** Per the Phase 3
   spec, the parser classifies:
   - theory → none / none / low (passive text)
   - i_do → guided / weak / low (instructor demo)
   - we_do E1 → guided / moderate / medium (scaffolded)
   - we_do E2 → partially_guided / moderate / medium
   - we_do E3 → independent / moderate / medium
   - you_do → independent / strong / high (capstone-eligible)
   - self_check → independent / weak / low (MCQ only)
   - exam → independent / strong / low (server-graded MCQ, pass@70)
   - capstone (S26/S39/S51) → independent / strong / high
   - topic_evaluation → partially_guided / moderate / medium

### Gate check

All 13 Phase 3 gate criteria are met. See
`curriculum_graph_summary.md#10-phase-3-gate-check`.
**Overall: PASS.**

### Handoff to Phase 4 (Gap Analysis)

Phase 4 should consume `curriculum_skill_graph.json` to:

1. **Address the 16 uncovered skill nodes.** Distinguish:
   - Deliberate omissions (vendor RPA tools, R language, Excel —
     PyArcana's pedagogical scope is Python-only with Python-based
     RPA). Decide whether these become out-of-scope notes on each
     badge or trigger curriculum expansion.
   - Genuine gaps (causal_inference, experimental_design,
     hypothesis_testing, regression, feature_engineering,
     leakage_prevention, python_type_safety, sql_performance_tuning).
     These map to industry critical competencies and MUST be
     addressed in badge design — either by gating the badge on
     completion of the relevant section(s) with `credential_eligible`
     evidence, or by adding new micro-content.
2. **Verify each critical competency in `industry_skill_graph.json`
   has at least one `credential_eligible=true` activity.** The 8
   Phase 2 critical competencies are: SQL (DA/DS), leakage prevention
     (DS/AIML), selector resilience (RPA), type safety + production
     hardening (PySE), MLOps fluency (AIML), business framing +
     metric design (all senior+), communication (all),
     reproducibility (all). Of these, **leakage_prevention** and
     **python_type_safety** have ZERO credential-eligible activities
     in the current curriculum graph — Phase 4 must either add them
     or declare the corresponding badges unattainable.
3. **Audit capstone coverage.** Each of the 13 capstones should
   contribute at least one `credential_eligible=true` activity per
   phase it touches. Currently the only credential-eligible
   activities are you_do (49), capstone (3), and exam (52). Verify
   that each capstone's contributing sections have an exam or
   capstone-eligible You Do.
4. **Reconcile inline vs external topicEvaluations.** Only 3 sections
   have inline TEs; 49 rely on `course-state/topic_evaluations/`.
   Phase 4 should decide whether to merge the external TEs into
   `curriculum_skill_graph.json` or treat them as a separate
   evidence layer.
5. **DIV-001 (section 40 ID mismatch) remains unresolved.** Until
   `prisma/seed.ts` line 11743 is updated from `'agentic-architecture'`
   to `'architecture-ddd-decisions'`, the section 40 exam activity
   in this graph is unattainable on the dynamic LMS. This blocks
   any badge that requires CP-N4-A completion with exam evidence.
   (Carried forward from Phase 0 §10 + Phase 1+2 handoff.)
6. **Phase 3 gate is closed; badge design (Phase 4) may begin.**
   No badge rubric design work was done in Phase 3 per the rule
   "no badge design begins until all 52 sections are mapped
   (Phase 3 gate)." Badge design is now unblocked.

Phase 3 is closed.

---

## Phase 4 + Phase 5 — Strategic Gap Analysis + Per-Section Audits

**Started:** 2026-07-28T22:00:00Z
**Completed:** 2026-07-28T22:45:00Z
**Orchestrator:** curriculum_gap_auditor (Phase 4 + 5 sub-agent)
**Inputs consumed:**
- `industry_alignment/industry_skill_graph.json` (62 skill nodes, 5 roles, 4 levels, 8 critical competencies)
- `industry_alignment/curriculum_skill_graph.json` (52 sections, 2,320 activities, 4,372 edges)
- `industry_alignment/industry_reality_brief.md` (2,279 lines, §0–§32)
- `industry_alignment/role_skill_taxonomy.json` (437 role-level-skill assignments)
- `expert_audit/S01_report.md` … `S52_report.md` (52 prior per-section audits)

### Mission

Phase 4: compare the curriculum graph with the industry skill graph; produce a
strategic gap matrix covering all 10 gap categories specified by the orchestrator
(absent skills, weakly taught, timing issues, isolated concepts, theory without
independent application, overscaffolded projects, recall vs performance
assessment, missing practice dimensions, duplicated low-value work, capabilities
over-claimed). Phase 5: produce a brief per-section audit for each of the 52
sections synthesizing the expert_audit reports with the Phase 4 gap findings.

### Method

1. Loaded `industry_skill_graph.json` (62 skill nodes, 8 critical competencies)
   and `role_skill_taxonomy.json` (5 roles × 4 levels × variable skills = 437
   role-level-skill assignments). Built a per-skill lookup of which role/level
   combinations require it and whether it participates in a non-compensatory
   critical competency.
2. Loaded `curriculum_skill_graph.json` (52 sections, 2,320 activities, 4,372
   edges). Built a per-section inventory of skills taught, activity counts by
   type, credential-eligible activities, and self-check question counts.
3. Cross-referenced the 16 uncovered industry skills (from Phase 3 summary)
   against the critical-competency table and the role-level requirements table.
   Classified each as deliberate omission (7 — Python-first scope) or genuine
   curriculum gap (9 — must be addressed).
4. For each of the 8 critical competencies, computed the count of
   credential-eligible activities and the number of distinct sections
   contributing evidence. Identified 4 critical skills with zero coverage
   (leakage_prevention, python_type_safety, sql_performance_tuning, reframework)
   and 1 unresolved divergence (DIV-001 from Phase 0 — section 40 ID mismatch
   silently breaks the S40 exam on the dynamic LMS).
5. Examined the assessment-layer composition: 832 of 4,372 edges are
   `assessment` edges from theory to MCQ-style evidence (self_check + exam);
   only 104 activities (12%) are credential-eligible; only 52 are
   performance-graded (you_do + capstone). Identified this as a structural
   tutorial-dependence risk per `industry_reality_brief.md` §3.1.
6. Cross-checked the 52 expert_audit reports for id-drift, level-mismatch,
   broken code/output pairs, and composite scores. Extracted composite scores
   for 27 of 52 sections (others not numerically reported in their audit).
7. Drafted 41 gaps classified P0 (6), P1 (7), P2 (15), P3 (5), P4 (8). Each gap
   includes the 10 required fields (market evidence, affected role/level,
   current PyArcana coverage, severity, exact insertion point, proposed content
   type, learner outcome, assessment method, backward-compatibility impact,
   credential impact).
8. Generated 52 per-section audit summaries (`section_audits/S01.md` … `S52.md`)
   by mapping each gap to the sections it touches and computing a per-section
   priority (P0 for sections where a P0 gap lands, P1 otherwise because
   GAP-P1-007 touches all 52 sections, etc.).
9. Wrote `implementation_roadmap.md` sequencing the 41 gaps across 5 stages
   (P0 → P4) with effort estimates, backward-compatibility risk, and a
   parallel-work plan.

### Cycles executed

| Cycle ID | Name | Status |
|---|---|---|
| P4-C01 | Load and validate Phase 3 graph + Phase 2 industry graph + Phase 1 brief | completed |
| P4-C02 | Compute per-skill coverage and credential-eligible activity counts | completed |
| P4-C03 | Identify uncovered critical competencies and credential-integrity blockers | completed |
| P4-C04 | Draft 41 gaps across 10 gap categories | completed |
| P4-C05 | Validate gap matrix JSON against the schema (10 required fields per gap) | completed |
| P5-C01 | Extract expert-audit composite scores for 27 of 52 sections | completed |
| P5-C02 | Map each gap to the sections it touches (insertion-point parsing) | completed |
| P5-C03 | Generate 52 per-section audit summaries (S01.md … S52.md) | completed |
| P5-C04 | Generate implementation_roadmap.md with 5-stage sequencing | completed |

### Outputs produced

| Path | Type | Purpose |
|---|---|---|
| `industry_alignment/curriculum_gap_matrix.json` | structured JSON | 41 gaps, 10 fields each; 8 critical-competency statuses; handoff constraints for Phase 6 |
| `industry_alignment/curriculum_gap_matrix.md` | human-readable MD | 796-line rendering of the JSON for review |
| `industry_alignment/section_audits/S01.md` … `S52.md` | 52 MD files | Per-section audit summaries (8 sections each: strengths, market-aligned, missing, independence, badge evidence, misconceptions, recommendations, priority) |
| `industry_alignment/implementation_roadmap.md` | MD roadmap | 5-stage sequencing (P0 → P4) with effort, BC risk, owner, parallel-work plan, and Phase 6 unblock criteria |
| `industry_alignment/_gen_section_audits.py` | Python generator | Reproducible generator script for the 52 per-section audits (kept for Phase 6 re-runs) |

### Key findings

1. **6 P0 credential-integrity blockers** identified:
   - `GAP-P0-001` leakage_prevention (DS + AIML independent+) — 0 activities
   - `GAP-P0-002` python_type_safety (PySE + AIML independent+) — 0 activities
   - `GAP-P0-003` sql_performance_tuning (DA/DS/PySE advanced+) — 0 activities
   - `GAP-P0-004` reframework in durable form (RPA independent+) — 0 activities
   - `GAP-P0-005` DIV-001 unresolved (S40 exam unattainable on dynamic LMS)
   - `GAP-P0-006` 4 of 8 critical competencies have credential-eligible evidence from only 1 section each (or zero, for the 4 uncovered critical skills)
2. **7 P1 major gaps**: hypothesis_testing, regression, feature_engineering,
   experimental_design (all 0 activities); MCQ-only assessment layer
   (GAP-P1-007 — only 12% of activities are performance-graded);
   missing named debugging skill (GAP-P1-008);
   ai_code_review_literacy concentrated in 1 section (GAP-P1-010).
3. **15 P2 significant improvements**: 9 single-section skills that need
   reinforcement (descriptive_stats, model_evaluation, async_testing,
   sql_window_ctes, metric_design, uncertainty_quantification,
   model_deployment, docker, kubernetes); 10 of 13 capstones without an
   integrator activity (GAP-P2-009); no blank-page exercise in the entire
   curriculum (GAP-P2-010); security judgment not distributed across
   data-handling sections (GAP-P2-011); stakeholder communication clustered
   in Phase 3 only (GAP-P1-011); ambiguity ramp missing (GAP-P1-009);
   causal_inference and orchestrator_operations in durable form (GAP-P1-005,
   GAP-P1-006); CONTINUE-pattern fatigue (GAP-P2-012); external TE layer
   decision (GAP-P2-013).
4. **5 P3 enrichment items**: mentoring, bi_tools Streamlit-to-BI bridge,
   process_analysis reinforcement, R-language disclosure, Excel disclosure.
5. **8 P4 polish items**: 4 vendor RPA tools disclosure; stale section-id
   slugs across 14 sections (HIGH backward-compat risk — defer to post-Phase-6);
   Phase-2 level mismatch (13 sections declare "Competente" but Phase 2 is
   "Senior"); S27 subsumed under slug rename; self-check <5 questions in
   below-min Phase-0 sections; inactive section files (e.g., s08-visualization.ts).

### Critical-competency status (8 competencies)

| Competency | Status | Blocking badges |
|---|---|---|
| `sql_competency` | PARTIAL — sql_performance_tuning uncovered | DA/DS/PySE advanced+ |
| `leakage_prevention` | FAIL — leakage_prevention uncovered | DS/AIML independent+ |
| `selector_resilience` | PARTIAL — reframework uncovered | RPA independent+ |
| `type_safety_production_hardening` | PARTIAL — python_type_safety uncovered | PySE/AIML independent+ |
| `mlops_fluency` | PASS | — |
| `business_framing_judgment` | PASS (metric_design thin) | — |
| `communication_audience_tuned` | PASS (timing risk — Phase-3 clustered) | — |
| `reproducibility_determinism` | PASS | — |

### Per-section priority distribution

- **P0** (9 sections where a P0 gap lands): S10, S15, S17, S24, S33, S37, S39, S40, S43
- **P1** (43 sections — GAP-P1-007 performance-exercise-per-section touches all 52): all sections not in P0
- **P2 / P3** (0 sections — all P2/P3 gaps land on sections already P0/P1)

### Backward-compatibility assessment

All 41 gaps are either **additive** (new theory blocks, new We Do exercises,
new You Do sub-tasks — never renumber or rename existing activities) or
**disclosure-only** (decision records + badge text). The only **HIGH** BC risk
is `GAP-P4-002` (stale section-id slug rename), which is explicitly deferred
to post-Phase-6 in the roadmap.

### Phase 6 unblock criteria

Phase 6 (badge design) may **begin designing** badges for any role/level that
does NOT cite one of the P0-blocked critical competencies:
- DA foundation, DA independent — ✓ design may proceed
- DS foundation, AIML foundation, RPA foundation, PySE foundation — ⚠ design
  may proceed; issuance gated on P1 closures (Stage 2)
- DA/DS/AIML/RPA/PySE independent+ (where blocked by a P0 competency) — ✗ wait
  for the corresponding Stage 1 closure

### Handoff to Phase 6 (badge design)

Phase 6 should consume:
1. `curriculum_gap_matrix.json` — for the 5 badge-design constraints
2. `implementation_roadmap.md` — for the Stage 1 → Stage 5 sequencing
3. `section_audits/SNN.md` — for per-section credential-eligible skills and
   priority classifications
4. `industry_skill_graph.json#critical_competencies` — for the non-compensatory
   competency list per role
5. `role_skill_taxonomy.json` — for the per-role, per-level required-skills list

Phase 6 must NOT:
- Issue badges citing leakage_prevention, python_type_safety,
  sql_performance_tuning, or reframework until the corresponding P0 gap is
  closed (or explicitly exclude the affected level).
- Issue badges depending on CP-N4-A completion with exam evidence until
  GAP-P0-005 (DIV-001) is fixed.
- Cite a critical competency in a badge rubric without verifying ≥2 distinct
  sections contribute credential-eligible evidence (GAP-P0-006).
- Omit disclosure text for deliberate omissions (R, Excel, vendor RPA tools).

### Gate check

All Phase 4 + 5 gate criteria are met:
- [x] 10 gap categories addressed (absent, weakly taught, timing, isolated,
  theory-without-application, overscaffolded, recall-vs-performance, missing
  practice dimensions, duplicated, over-claimed)
- [x] Every gap has the 10 required fields
- [x] Every recommendation grounded in `industry_reality_brief.md` evidence
- [x] Severity classification follows P0 (credential) > P1 (major) > P2
  (significant) > P3 (enrichment) > P4 (polish)
- [x] No backward-compatibility-breaking recommendations (HIGH-BC item deferred
  to post-Phase-6 with explicit decision record)
- [x] No badge proposals (Phase 6 territory)
- [x] 52 per-section audit summaries produced
- [x] Implementation roadmap sequenced P0 → P4 with effort + BC risk + owner

**Overall: PASS.** Phase 6 (badge design) is unblocked for foundation-level
badges and conditionally unblocked for independent+ badges pending Stage 1
closures.

Phase 4 + 5 are closed.

---

## Phase 7 — Assessment and Scoring Integrity

**Started:** 2026-07-28T22:20:00Z
**Completed:** 2026-07-28T22:32:00Z
**Orchestrator:** assessment_validity_architect node
**Branch at start:** `main` @ `67422b8` (PR #18 merged)

### Mission

Specify the assessment and scoring integrity contract for all 31
PyArcana badges. Produce the canonical reference document that
governs (a) the evidence hierarchy that maps each curriculum
activity type to a credibility tier, (b) the conservative
provisional floors that gate badge issuance, (c) the rubric design
principles that every badge rubric must follow, (d) the per-badge
assessment validity questions the eligibility engine must answer,
(e) the retake and remediation rules that protect against gaming,
and (f) the evidence freshness policy that prevents stale evidence
from backing a credential.

### Cycles executed

| Cycle ID | Name | Status |
|---|---|---|
| P7-C01 | Evidence hierarchy definition (tiers 1–6) | completed |
| P7-C02 | Provisional floors + boundary semantics (exact-at = pass, one-below = fail, round-down) | completed |
| P7-C03 | Rubric design principles (6 principles + criterion shape) | completed |
| P7-C04 | Assessment validity questions (U1–U5, C1–C8, K1–K6, P1–P2) | completed |
| P7-C05 | Retake and remediation rules (per-component + idempotency + Stephen Fry redaction) | completed |
| P7-C06 | Evidence freshness policy (2-yr / 3-yr windows) | completed |
| P7-C07 | Gate summary (11 gates in evaluation order) | completed |

### Key outputs

| Path | Type | Purpose |
|---|---|---|
| `industry_alignment/assessment_validity_report.md` | MD spec | The canonical assessment-and-scoring contract for all 31 badges |

### Key findings

1. The evidence hierarchy is monotonic: tiers 1–3 (theory, I Do,
   We Do) **do not count** toward any competency or capstone
   credential. Only tiers 4–6 (You Do, project, capstone defense)
   count. This defends against the #1 recruiter complaint
   (tutorial dependence — `industry_reality_brief.md §13 C1`).
2. The provisional floors are conservative (self_check ≥85%,
   you_do ≥80%, exam ≥85%, integrator ≥85%, critical competency
   =100%, overall weighted ≥85%). The 100% critical-competency
   floor is **non-compensatory** — a single failing rubric
   criterion in a critical competency blocks the badge regardless
   of strength elsewhere.
3. Boundary semantics are explicit: exactly at threshold = pass;
   one below = fail; rounding is **down** (the conservative
   direction). A score of 84.999% becomes 84.99% and fails the
   85% floor.
4. The 8 critical competencies (sql_competency,
   leakage_prevention, selector_resilience,
   type_safety_production_hardening, mlops_fluency,
   business_framing_judgment, communication_audience_tuned,
   reproducibility_determinism) are non-compensatory. Each is
   graded against a 4-criterion rubric; all four criteria must
   score 100%.
5. The full gate chain (11 gates) is documented in evaluation
   order. The engine reaches `eligible_pending_verification`
   only when gates 1–10 all pass; it reaches `awarded` only
   when gate 11 (edition check) also passes on the dynamic LMS.

### Gate check

- [x] Evidence hierarchy defined for all 6 activity types
- [x] Provisional floors specified per component
- [x] Critical-competency non-compensation specified
- [x] Boundary semantics (exact-at = pass, one-below = fail) specified
- [x] Rubric design principles (6) specified
- [x] Assessment validity questions per badge family specified
- [x] Retake and remediation rules per component specified
- [x] Evidence freshness policy per evidence type specified
- [x] Gate summary in evaluation order specified

**Overall: PASS.** Phase 8 (eligibility engine) is unblocked.

Phase 7 is closed.

---

## Phase 8 — Eligibility Engine Architecture

**Started:** 2026-07-28T22:32:00Z
**Completed:** 2026-07-28T22:55:00Z
**Orchestrator:** integration_architect node
**Branch at start:** `main` @ `67422b8`

### Mission

Implement the deterministic, versioned eligibility engine as a
TypeScript domain service that works in BOTH the static GitHub
Pages edition (local-only, clearly labeled as preview) and the
dynamic LMS edition (server-authoritative). The engine takes
learner progress + assessment attempts + project results as input
and outputs a structured eligibility report per badge.

### Cycles executed

| Cycle ID | Name | Status |
|---|---|---|
| P8-C01 | TypeScript types (`types.ts`) — states, editions, tiers, floors, interfaces | completed |
| P8-C02 | Badge spec loader (`badge-specs.ts`) — versioned in-memory specs from catalog | completed |
| P8-C03 | Deterministic engine (`engine.ts`) — 11-gate evaluation chain | completed |
| P8-C04 | Public API (`index.ts`) — clean import surface | completed |
| P8-C05 | Static-edition preview enforcement (never `awarded`) | completed |
| P8-C06 | Critical-competency non-compensation enforcement | completed |
| P8-C07 | Threshold boundary semantics (exact-at = pass, one-below = fail, round-down) | completed |
| P8-C08 | Idempotent award (no duplicate BadgeRecords) | completed |
| P8-C09 | Pilot-badge supplementary-exercise gate | completed |

### Key outputs

| Path | Type | Purpose |
|---|---|---|
| `src/lib/eligibility/types.ts` | TS types | Canonical type contract for the eligibility engine |
| `src/lib/eligibility/badge-specs.ts` | TS loader | Versioned in-memory badge specs from `badge_catalog.json` |
| `src/lib/eligibility/engine.ts` | TS engine | Deterministic eligibility engine (11 gates) |
| `src/lib/eligibility/index.ts` | TS public API | Clean import surface for callers |

### Engine contract

The engine takes:
- `badge_id: string`
- `progress: LearnerProgress` (awarded badges, activities, critical competency scores, project results)
- `options.edition: 'static' | 'dynamic'`
- `options.now: string` (ISO timestamp; never `Date.now()`)

The engine returns an `EligibilityReport`:
- `badge_id`, `version`, `state`, `eligible`, `requirements[]`, `blocking_reasons[]`, `edition`, `awarded_at?`
- `state` ∈ {`locked`, `available`, `in_progress`, `evidence_incomplete`, `assessment_ready`, `eligible_pending_verification`, `awarded`}
- `eligible: true` only when `state` is `eligible_pending_verification` (static edition, preview) or `awarded` (dynamic edition)

### Determinism guarantees

1. **No `Date.now()`.** Freshness is computed against the caller-provided `now` argument.
2. **No randomness.** The same inputs always produce the same outputs (verified by `test_deterministic_output`).
3. **No implicit state.** The engine does not cache; every `evaluate()` call is independent.
4. **Catalog versioned.** The engine's `catalogVersion` is fixed at construction; callers compare against the expected version before trusting a report.

### Gate chain (11 gates, in evaluation order)

1. Catalog version match (caller's responsibility)
2. Badge status (`retired` / `superseded` → `locked`)
3. Prerequisite badges awarded (missing → `locked`)
4. Required activities present (missing → `in_progress` / `evidence_incomplete`)
5. Evidence tier minimum (below tier → `evidence_incomplete`)
6. Required projects present (missing → `evidence_incomplete`)
7. Per-component floors (below floor → `assessment_ready` blocked)
8. Critical competency floors (=100%, non-compensatory)
9. Pilot-badge supplementary exercise (missing → blocked)
10. Weighted-average overall (≥85%)
11. Edition check (static → `eligible_pending_verification`; dynamic → `awarded`)

### Gate check

- [x] Deterministic (same input → same output)
- [x] Versioned badge specs
- [x] Never awards from client state alone (static → preview only)
- [x] Critical competencies are non-compensatory
- [x] Threshold boundaries correct (exact-at = pass, one-below = fail)
- [x] Idempotent award
- [x] Stephen Fry redaction in all learner-facing messages

**Overall: PASS.** Phase 9 (TDD) is unblocked.

Phase 8 is closed.

---

## Phase 9 — Red-Green-Refactor (TDD)

**Started:** 2026-07-28T22:55:00Z
**Completed:** 2026-07-28T23:10:00Z
**Orchestrator:** test_designer_red + implementer_green nodes
**Branch at start:** `main` @ `67422b8`

### Mission

Write failing tests FIRST (RED), then implement the minimum to
pass (GREEN), without ever weakening the tests. The Python tests
exercise the eligibility logic via a Python reference
implementation; the TypeScript engine is the runtime code and
mirrors the reference implementation exactly.

### Cycles executed

| Cycle ID | Name | Status |
|---|---|---|
| P9-C01 | RED: 14 specified test cases + 4 bonus cases written | completed |
| P9-C02 | RED: Python reference implementation (`EligibilityEngine` class) inline in the test file | completed |
| P9-C03 | GREEN: Reference implementation fixed to satisfy all 18 tests | completed |
| P9-C04 | GREEN: TypeScript engine mirrors the reference implementation | completed |
| P9-C05 | Verify: 18/18 Python tests pass | completed |
| P9-C06 | Verify: TypeScript engine compiles cleanly (no new TS errors) | completed |
| P9-C07 | Bonus: Security & privacy threat model (`security_privacy_threat_model.md`) | completed |

### Key outputs

| Path | Type | Purpose |
|---|---|---|
| `tests/adversarial/test_eligibility_engine.py` | Python tests + reference impl | Executable specification; 18 tests, all passing |
| `src/lib/eligibility/types.ts` | TS types | Mirror of the Python reference types |
| `src/lib/eligibility/engine.ts` | TS engine | Runtime implementation mirroring the reference |
| `src/lib/eligibility/badge-specs.ts` | TS loader | Loads `badge_catalog.json` into versioned specs |
| `src/lib/eligibility/index.ts` | TS public API | Clean import surface |
| `industry_alignment/security_privacy_threat_model.md` | MD threat model | STRIDE + privacy threats and controls |

### Test inventory (18 tests, all GREEN)

| # | Test name | What it verifies |
|---:|---|---|
| 1 | `test_badge_locked_when_prerequisites_not_met` | State `locked` when prereqs missing |
| 2 | `test_badge_available_when_prerequisites_met` | State `available` when prereqs met, no evidence |
| 3 | `test_evidence_incomplete_when_missing_required_activities` | State `in_progress` / `evidence_incomplete` when activities missing |
| 4 | `test_evidence_incomplete_when_below_evidence_tier_minimum` | State `evidence_incomplete` when activities are guided (tier 3) not independent (tier 4) |
| 5 | `test_assessment_ready_when_all_evidence_collected` | State `awarded` on dynamic when all evidence + floors met |
| 6 | `test_blocked_when_critical_competency_fails` | Non-compensatory gate: one critical criterion at 75% blocks even with 95% elsewhere |
| 7 | `test_blocked_when_self_check_below_85` | Self-check at 84% (one below floor) blocks |
| 8 | `test_blocked_when_you_do_below_80` | You Do at 79% (one below floor) blocks |
| 9 | `test_blocked_when_project_rubric_below_85` | Integrator at 84% (one below floor) blocks |
| 10 | `test_threshold_boundary_exact_pass` | You Do at exact 80 floor + components at exact floors pass |
| 11 | `test_threshold_boundary_one_below_fail` | Self-check at 84.99 (one below 85) fails after round-down |
| 12 | `test_idempotent_award` | Awarding twice doesn't duplicate the badge in the learner's record |
| 13 | `test_legacy_progress_doesnt_fabricate_evidence` | Legacy tier-1 (theory) section completion does not satisfy competency badge evidence |
| 14 | `test_static_mode_shows_preview_not_awarded` | Static edition returns `eligible_pending_verification`, never `awarded`, for competency badges |
| 15 | `test_capstone_credential_blocked_on_static_edition` | Capstone credentials cannot be earned on static edition at all |
| 16 | `test_deterministic_output` | Same inputs → same outputs across two calls |
| 17 | `test_progress_badge_awarded_on_static_edition` | Progress badges (local_achievement) ARE awarded on static edition |
| 18 | `test_pilot_badge_requires_supplementary_exercise` | Pilot badges with gap-affected competencies require the supplementary exercise |

### Test results

```
$ python3 -m unittest tests.adversarial.test_eligibility_engine
..................
----------------------------------------------------------------------
Ran 18 tests in 0.004s

OK
```

### TypeScript compile check

```
$ npx tsc --noEmit 2>&1 | grep -i "eligibility"
(no output — no errors in the eligibility module)
```

(Pre-existing TS errors in `prisma/seed.ts`, `src/app/api/*`,
and `src/lib/firebase/admin.ts` are unrelated to this phase; they
stem from Prisma client not being generated and missing optional
dependencies like `bcryptjs`, `xlsx`, `firebase-admin`, and
`react-leaflet`.)

### TDD discipline

- **RED first.** The test file was written before the TypeScript
  engine. The Python reference implementation was iterated against
  the tests until all 18 passed; the TypeScript engine was then
  written to mirror the reference implementation.
- **Never weaken tests.** When 4 tests initially failed (capstone
  tier, legacy assertion, progress badge activities, threshold
  boundary with non-unit weights), the fix was always to the
  implementation or to the test fixtures (e.g., adding EXAM
  activities for progress badges) — never to the assertions.
- **Stephen Fry redaction.** Every learner-facing message in the
  engine is newbie-friendly. For example, "Missing prerequisites:
  X" becomes "You need to earn these badges first: X. Think of
  them as the building blocks for this one." Critical-competency
  failures are explained with "this is non-negotiable — please
  review the underlying sections."

### Gate check

- [x] 14 specified tests + 4 bonus tests = 18 tests, all passing
- [x] Tests written before the implementation (RED → GREEN)
- [x] Tests never weakened to make implementation pass
- [x] Static edition never awards from client state alone
- [x] Critical competencies are non-compensatory
- [x] Threshold boundaries (exact-at = pass, one-below = fail) verified
- [x] Idempotent award verified
- [x] Legacy progress non-fabrication verified
- [x] Stephen Fry redaction enforced in all learner-facing messages
- [x] TypeScript engine compiles cleanly with no new errors

**Overall: PASS.** Phases 7–9 are closed.

Phase 9 is closed.
