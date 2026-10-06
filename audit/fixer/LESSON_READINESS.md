# Lesson readiness and validation

The procedure for readying and validating one section. Run it on every round that changes a
section, and on every review of one.

It exists because zero surprising uses is not the same as ready. A section is ready when:
- nothing is used before it is explained;
- the skills it teaches keep pace with what its learning outcomes, badges, projects, capstones,
  levels and assessments claim;
- every part is right on its own;
- the section works as a whole: one teacher, one arc, one set of conventions.

Each of those can hold while another fails. Route 2 moved CP-N1-A's parser out of S02–S04 while
the capstone's gate stayed at S04, and no concept measure could see that. So every surface below is
read, red-teamed and diffed every round, not just the one a gate happens to measure.

Work in a worktree of `audit/consolidated-issues-20260910`. Run lesson Python with
`.venv-content/bin/python` (3.12). Never run an audit while a gate holds `.fixer/reports.lock`.

## The readiness surface

Each dimension is checked for every part (a theory block, demo, exercise, You Do or self-check
question), and again for the section as a whole.

| # | Dimension | What must hold |
|---|---|---|
| 1 | Concept map | Nothing used before it is explained and exemplified; held definitions kept; no construct used without its name slipping past the maps. |
| 2 | Required-skills map | Badge `required_activities` present, `critical_competencies` practised by then; no new readiness finding. |
| 3 | Outcomes | Every `learningOutcome` taught AND exercised; nothing promised that the practice no longer does. |
| 4 | Capstones and projects | No capstone gated here claims a skill moved later; the cumulative project's increment continues from the previous section's and feeds the next. |
| 5 | Levels and phases | The section's `level`/`phase` and the `progress_phaseN_walked` badges still describe what a learner has done by then. |
| 6 | Assessment | Self-check, `topicEvaluations` and the exam bank test only what was taught, cover what the outcomes promise, keep answer positions balanced. |
| 7 | Figures | Load-bearing concepts reach their D4/D5 figure target; a figure sits next to the prose it explains. |
| 8 | Python | Every snippet runs on 3.12 and prints its declared output; PEP 8/Ruff clean; no anti-pattern taught. |
| 9 | Pedagogy (D3, D6, D14) | Load-bearing concepts get a subsection; gradual release I Do → We Do → You Do; nothing watered down; cognitive load fits the level. |
| 10 | Writing | `writing_rules.md`, narration voice (a teacher, not "claudish"), no avoidable English, no B5 chains. |
| 11 | Tests and pins | Verbatim pins, word floors, counts and ids survive; a pin that fixes a defect is rescoped, not obeyed. |
| 12 | Gestalt | The section reads as one teacher; conventions are consistent across parts; T1→T4 builds; no redundancy, gap or jarring jump from the previous section or into the next. |

## Artifacts

| What | Produced by | Path |
|---|---|---|
| Event stream | `npx tsx scripts/course_event_extractor.mts > .fixer/events.json` (gate.py writes it; run from the repo so npx uses its own tsx) | `.fixer/events.json` |
| Syntax/proper-name rules | edited by hand, tested | `scripts/concept_syntax.mts`, `tests/adversarial/concept-syntax.test.mjs` |
| Concept map (1, 7) | `python3 scripts/concept_map.py` | `course-state/concept_map.json` (incl. `figure_target`, `figure_gap`), `docs/concept-map/SXX.md`, `INDEX.md` |
| Required-skills map (2) | `python3 scripts/badge_readiness_audit.py` | `course-state/badge_readiness_report.json` |
| What credentials claim (2, 5) | source | `src/lib/eligibility/badge_catalog.json` (required_sections, required_activities, critical_competencies, `progress_phaseN_walked`), `src/lib/eligibility/engine.ts` |
| Capstones (4) | source | `course-state/capstones/INDEX.json`, `src/lib/capstones/catalog.ts`, `course-state/capstone_ledger.json` |
| Outcomes, practice, level (3, 5, 9) | source | `src/lib/course/sections/sNN-*.ts` (`learningOutcomes`, `level`, `phase`, theory, iDo, weDo, youDo, selfCheck, `topicEvaluations`) |
| Exam bank (6) | source and reports | `prisma/seed.ts` (`QUESTION_BANK['<slug>']`), `course-state/sNN_phase5_exam_bank.json`, `course-state/exam_selfcheck_pedagogy_report.json` |
| Vocabulary | source | `src/lib/glossary/terms.ts` (aliases, firstSectionId) |
| Writing (10) | `python3 scripts/prose_quality_audit.py SXX`, `python3 scripts/code_switching_audit.py SXX` | `audit/fixer/writing_rules.md` |
| Gate | `python3 tools/fixer/gate.py snapshot SXX` / `check SXX` | `.fixer/SXX.gate-before.json` |
| Brief, codex, apply | `tools/fixer/build_concept_prompt.py SXX [--practice-layer]`; `tools/fixer/run_codex.py TAG gpt-5.6-sol medium`; `tools/fixer/apply_patches.py .fixer/TAG.result.json --apply` | `.fixer/TAG.*`, `.fixer/SXXk.held_definitions.json` |
| Ratchets | tests | `tests/adversarial/glossary-first-use-ratchet.test.mjs` (DECLARED_LATE_OWED), `tests/adversarial/test_forward_dependencies.py` (D10_OWED) |
| Records | hand | `audit/fixer/LEDGER_NOTES.md`, `WORK_QUEUE.md`, `decisions.md`, `writing_rules.md`, `OPEN_QUESTIONS.md` |
| Browser | `npm run dev` (port 3000) in the worktree being validated | local preview of the branch; after merge, the live site `https://pillb.github.io/pyarcana/#<slug>` |

## Procedure

0a. **Open the section with a written preamble.** Before any reading or measuring, state in the
   turn: what the owner asked for, which checks this section must pass, and which requirements and
   live decisions bind it (`OWNER_DECISIONS.md`, `decisions.md`, the twelve dimensions). The owner
   asked for this (2026-09-30) so the requirements stay alive across a long section rather than
   decaying into whatever the last tool output was about. A section begun without it is begun
   half-blind.
0b. **Read the section yourself first and say whether it is complete.** Before any measure: are
   all its parts there (theory blocks, demos, every exercise id, subtopics, self-check questions,
   outcomes, the You Do, the program count against its floor), and does it teach what it promises?
   A measure confirms or refutes a reading; it is not a substitute for one, and a section can be
   green and still be missing a block nobody looked for.
1. **Baseline.** `gate.py snapshot SXX`. Copy the section file and the derived reports to
   `.fixer/SXX.pre-concepts.*` so a failed round can be restored. That includes
   `badge_readiness_report.json`, the skills baseline.
2. **Read the owner's live decisions first** (`audit/fixer/OWNER_DECISIONS.md`). They answer
   questions no instrument can settle and they outrank the plan. Check each one's **Scope** for
   this section, and retire any whose **Retire when** condition this round satisfies.
3. **Map every part against the whole surface.** Read `docs/concept-map/SXX.md`, the readiness
   rows for every badge requiring SXX and every capstone gated at or after it, the outcomes,
   level and phase, the self-check, topic evaluations and exam bank, and the figure targets.
   Read the code for constructs used without their name (`assert`, `repr`/`!r`, dict and set
   literals, imports, methods, `in`, slicing). One analyst per slice of the section, read-only.
4. **Plan, then red-team the plan.** Fix one convention for the section before any rewrite. Then
   attack the plan once per dimension above, each attacker trying to show where it fails that
   dimension for a part or for the whole. Revise and attack again. **Converge at two quiet
   rounds** (no new real issue); stop at five and raise what is left. Resolve gaps with the
   open-questions tree (`audit/fixer/OPEN_QUESTIONS.md`, D11): primer → rewrite (D14) → move →
   re-raise. Never award retroactively. Changing `badge_catalog.json` or moving a project is
   Ask-first.
5. **Brief codex.** Verify every factual claim in the brief before sending it: section ids,
   detector verb lists, Python behaviour. Name the defining blocks that must stay. Never pin a
   phrase that carries an anglicism. Give every location, never a sample.
6. **Red-team the patches, per part and as a whole.** Before applying, attack codex's result on
   every dimension: run every snippet and every claim on 3.12; check D14, PEP 8/Ruff, self-check
   `correctIndex` and balance, the bare-name definitional sentence (**`X`** + verb), and whether
   the section still reads as one teacher. Send real issues back to codex. Its unresolved
   concerns return at most twice, then go to a human. Converge at two quiet rounds.
7. **Gate.** `gate.py check SXX` against the step-1 snapshot. An instrument change goes in its
   own commit, and you prove it leaves the baseline unchanged, or you re-snapshot.
8. **Re-run BOTH maps and diff the rows — every section, always.** The gate enforces the totals
   (`surprising_uses_course_wide`, `readiness_findings_course_wide`, since b596f785). Diff the
   concept and readiness rows by hand anyway: a total can hold while one badge gains a finding
   and another loses one. Any regression in any dimension is a failed round.
9. **Verify in the browser.** Local preview of the branch now; the live site after merge. Read
   the section as a learner meets it — theory, iDo, weDo, youDo, self-check — for each part and
   for the arc, and check the console.
10. **Record and commit.** Lower any ratchet that moved. Put lessons in LEDGER_NOTES and deferred
   items in WORK_QUEUE, and re-raise judgment calls in OPEN_QUESTIONS. Stage named files only,
   commit, push. Report what is still open.
