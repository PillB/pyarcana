# Integration requirements

Only dependencies the current code actually has are listed. No integration point
is invented.

## Unit U1 — S18 experimentation and causal literacy

| Layer | Integration | Status |
|---|---|---|
| Section source | `src/lib/course/sections/s18-data-engineering.ts` | MODIFIED |
| Subtopic | `S18-T2-B`, `S18-T3-A` — existing IDs reused | UNCHANGED |
| Theory | 2 new `TheoryBlock`s appended after the blocks they extend | ADDITIVE |
| Code demo | 1 runnable snippet inside the new T2-B block | ADDITIVE |
| Yo hago (`iDo`) | Not modified — the 8 demos are ID-bound and the new theory blocks carry their own worked demonstration | UNCHANGED |
| Hacemos juntos (`weDo`) | Not modified — all 24 exercise IDs are frozen | UNCHANGED |
| Tú haces (`youDo`) | One objective and one requirement extended to let the learner classify their comparison as observational or experimental | SEMANTIC REFINEMENT (additive wording) |
| Autocheck (`selfCheck`) | 2 questions appended (8 → 10) | ADDITIVE |
| `resources` | 1 documentation link added | ADDITIVE |
| Glossary | 3 terms added with `firstSectionId: 'data-engineering'` | ADDITIVE |
| Capstone | S18 feeds `CP-N2-B`; the brief's identity and rubric weights are unchanged | UNCHANGED |
| Progress | Sub-steps `theory`/`youdo`/`quiz` for section id `data-engineering` — identities untouched | UNCHANGED |
| Dashboards | `CONTENT_REFERENCE_ONLY` — they read completion by section ID and sub-step token, neither of which changes | NOT AFFECTED |
| Route | `/curso/[section]` for `data-engineering` | RENDER-VERIFIED |

## Unit U2 — S15 columnar execution

| Layer | Integration | Status |
|---|---|---|
| Section source | `src/lib/course/sections/s15-stdlib-deep.ts` | MODIFIED |
| Subtopic | `S15-T4-B` — existing ID reused | UNCHANGED |
| Theory | 1 new `TheoryBlock` | ADDITIVE |
| Code demo | 1 stdlib-only snippet | ADDITIVE |
| iDo / weDo / youDo / selfCheck | Not modified | UNCHANGED |
| Dashboards / progress | Not affected | NOT AFFECTED |

## Selfcheck cardinality check

`selfCheck.questions` has no fixed-count invariant in `v3_invariant_validator.py`,
`check_section_structure.py` or `v3_regression_counts.test.mjs` — those constrain
`subtopicId`, `demoId` and exercise `id` only. The 24 *exam variants* per section
counted by the invariant come from the **database seed bank**
(`prisma/seed.ts`), not from `selfCheck`. Adding section-file Autocheck questions
therefore does not touch exam history, which is exactly the separation
`19_SAVE_PROGRESS_COMPATIBILITY.md` §Exam requires.

Verified empirically: section `selfCheck` lengths already vary across the course,
and `test:exam-pedagogy` reports 1248 seed questions / 416 concepts independently
of them.

## Badges

Badge machinery exists (`src/lib/eligibility`, `tests/e2e_max/badge_*.spec.ts`,
`test_no_inflated_badge_names.py`). It is keyed on completion and capstone
evidence, not on theory-block content. No badge criterion, ID or name is touched,
so no earned badge can be revoked. No new badge is proposed — that would require
schema work and explicit approval.
