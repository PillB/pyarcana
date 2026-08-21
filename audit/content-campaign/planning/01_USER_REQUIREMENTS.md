# User requirements

Derived from the current task text. `IMMUTABLE` requirements may not be traded
away, optimised around, or "improved" into something else.

| ID | Requirement | Immutable | Acceptance criterion |
|---|---|---|---|
| UR-01 | Improve and complete PyArcana's **learner-facing curriculum content** — topics/subtopics, theory, worked examples, code demos, Yo hago / Hacemos juntos / Tú haces, exercises, Autocheck, projects | yes | At least one bounded content unit is implemented in `src/lib/course/sections/` and renders |
| UR-02 | Do **not** redesign levels or phases | yes | `PHASES` and every `phase:` field byte-identical |
| UR-03 | Preserve S01–S52 numbering and order | yes | `index` values and `COURSE_SECTIONS` order unchanged |
| UR-04 | Preserve learner save/progress/history compatibility | yes | Storage key, 7 fields, 5 sub-step tokens, 52 section IDs, 1248 exercise IDs all unchanged |
| UR-05 | Reconstruct requirements from local evidence rather than repeating the package | yes | `SOURCE_AUTHORITY_MAP.md` re-derives each claim; at least one package claim is corrected |
| UR-06 | Use current evidence, not stale memory; verify library behaviour against the versions actually in use | yes | Version-sensitive claims checked against the installed runtime |
| UR-07 | Apply the Handcrafted Writing protocol; avoid terse, jargon-first, generic prose | yes | `07_EDITORIAL_WRITING_REQUIREMENTS.md` rubric scored per unit |
| UR-08 | Explain rather than assume; prefer re-explanation over an omitted premise | yes | Novice trace shows first-use → definition → demonstration for every new term |
| UR-09 | Two substantive content iterations | yes | Iteration 2 records real corrections, not cosmetic edits |
| UR-10 | Do not self-certify; independent verification | yes | Validation runs are executable commands with recorded output |
| UR-11 | Surface uncertainty rather than guessing | yes | `OPEN_QUESTIONS_AND_DOUBTS.jsonl` populated; no fabricated outputs |
| UR-12 | Implement, do not stop at a plan | yes | Working-tree diff contains learner-visible content |
| UR-13 | One bounded unit at a time; no bulk generation | yes | Each unit committed/validated separately |
| UR-14 | Prove the implementation did not damage what learners already earned | yes | Legacy progress fixture replayed against the built app |
| UR-15 | Fetch branches/main; consider states and recent commits | yes | Recorded in `PROJECT_CONTEXT_INDEX.md` |

## Scope boundary

In scope: section bodies (theory, iDo, weDo, youDo, selfCheck, resources),
glossary terms supporting them, and the tests/evidence proving safety.

Out of scope, by UR-02/UR-03/UR-04: phase architecture, section renumbering,
section IDs, sub-step tokens, exercise-ID churn, progress schema, badge schema,
and the two pre-existing glossary gate failures.
