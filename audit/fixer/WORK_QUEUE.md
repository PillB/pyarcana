# Work queue — ordered, and written down so it survives a compacted context

Regenerate the evidence with `python3 scripts/concept_map.py` and read `CONCEPT_QUEUE.md` for the
per-concept detail (194 verified treatments). This file is the *order*, not the detail.

Standing decisions that govern every row: D9 (no `main()`/`__name__` early), D10 (no `try`/`except`
before S09), D11 (primer, rewrite, or move — never a retroactive award), D1, D3, D6 in
`decisions.md`; the heuristics in `LEDGER_NOTES.md`.

## In flight

1. **Skills-and-badges map (solarize cycle).** Mine the project documentation for the required
   skills and badges per level and per group of sections, validate the roadmap against them, check
   the live site renders what the roadmap claims, and produce a synced skills/content map naming
   every missing skill, wrong on-ramp and unsupported badge claim. Research syllabi, books and
   courses for completeness of the on-ramp. Feeds every row below.

## Decided and owed (D9, D10)

2. **S01 entrypoint (D9).** Flatten `hello_sys.py`, `hello_lint.py`, `hello_env.py` and the
   `S01-T1-A-E2` blanks to top-level statements; delete the callout sentence that then has nothing
   to qualify. Repoint `newbie_agentic_validator.py` (`missing_main_for_hello_sys`,
   `missing_dunder_name`), `test_s01_independent_recovery.py:172`, the SectionView `setup`
   playground contract and `code_rendering.spec.ts:189`. Decide where `__name__` is first
   *needed* (S10 teaches it today) and check S02-S09 for the same pattern.
3. **S01-T1-B-E2 argv exercise (D9).** The subtopic's own prose defers argv to the CLI section;
   the exercise asks for `def main()`, `sys.argv[1:]`, `len` and an `if`. Replace it at S01 level
   (read exit codes of prepared commands) and move the `check_arg.py` contract to S10.
4. **`try`/`except` before S09 (D10).** 54 occurrences: S02 (11), S04 (7), S05 (14), S06 (9),
   S07 (3), S08 (10). Rewrite each so the failure is observed rather than caught, or move the
   piece that needs catching. S02-T1-B-E2, S02-T3-B-E3 and S02-T4-B-E3 are inside CP-N1-A, so
   they resolve with Q3.

## D3 gaps, in the critic's priority order

5. **S16 — IQR and quartiles.** The learner computes `q1`, `q3`, `iqr` and both Tukey fences in
   theory, the demo, E2, E3 and the You Do, and no prose in S01-S16 says what a quartile is.
   One supporting block with a number-line figure, carrying `outlier` with it.
6. **S16 — groupby.** `S16-T2-A-E2` hands the learner `df.groupby(...)["region"].nunique()` with a
   planted `== 1` defect, one section before S17 teaches groupby. Settle the
   `transform`/`nunique` collision in T2-A.p1 named by the verifier.
7. **S30 — F1, and train/test.** The You Do grades F1 while `S30-T4-B-E2` says "no inventes F1
   aquí"; nothing defines the harmonic mean. Same section: open T4-A with what train and test are
   for, and why test never touches calibration.
8. **S33 — cross-validation.** `S33-T4-B` opens on "Group CV por entidad" and teaches only the
   group refinement; the course's only gloss of a fold is in S34, one section late.
9. **S27 — pytest.** The section is titled "Estrategia de pruebas con pytest" and never says what
   pytest is, that it is installed with pip, or how a run looks. Its self-check asks about fixture
   scope.
10. **S41 — FastAPI.** Titled "APIs con FastAPI" and defines it nowhere; `youDo.requirement[5]`
    asks for a mapping to `@app.post` and `Depends`, neither shown in code.
11. **S14 — NaN, and broadcasting.** Reorder T3-B to say what a NaN *is* before how it propagates
    (the planted bug in E1 is `(x == np.nan).sum()`); add the stretch sentence and a figure to
    T2-B, where E2 requires predicting `(4, 3)`.
12. **S37 — `yield`.** The only `yield` in the course, carrying the memory claim; a gloss, not a
    subsection.
13. **S13 — precision and recall in plain words.** The reading that prevents E1's planted inverted
    denominators exists only in feedback, after the learner acts.

## Mechanical, cheap, high count

14. **Preview-surface glosses (D1).** Taglines, `jobRelevance` and `learningOutcomes` render as
    bare strings with no hover, so every term in them must gloss in place. The set is listed in
    `CONCEPT_QUEUE.md`.
15. **Throwaway removals (D6 q1).** Terms the learner never acts on, by section, in the queue.
16. **S03 harness loops.** Seven theory code blocks close with a `for` that S03 never mentions and
    S04 teaches; replace with explicit calls. `S03-T4-A-E2`/`T4-B-E2` also require a loop and
    tuple unpacking the learner has not met.

## Instrument debt

17. `glossary_intro_audit.py` reads section *source* — it matches `id: 'fastapi'`, a code comment
    and a book title. Move it onto the extractor's learner-visible events.
18. The extractor still does not emit weDo `feedback`, `edgeCases`, declared `output`, You Do
    `portfolioNote`/`retrospective`, section titles, or resource books and courses — about 5,400
    learner-visible strings.
19. Cross-term span claiming in the extractor, the hover and `glossary-first-use.test.mjs`, without
    which splitting a homonym entry does not stop the shorter alias matching inside the longer.
20. Dead glossary entries (`args-y-kwargs`, `feature-engineering`, and the ones written for the
    three retired section files) — preservation says propose, not delete.

## Deferred, with a decision attached

21. **Q3 route** (S02-S04 practice layer, CP-N1-A) — 12 rows wait on it; interacts with D10.
22. **Rename batches B/C/D** (S14-S52 ids), plan phase P9.
23. **Five orphaned section files** not imported by `index.ts`, which are also the source of
    several wrong glossary definitions.
