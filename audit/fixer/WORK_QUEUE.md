# Work queue — ordered, and written down so it survives a compacted context

Regenerate the evidence with `python3 scripts/concept_map.py` and read `CONCEPT_QUEUE.md` for the
per-concept detail (194 verified treatments). This file is the *order*, not the detail.

Standing decisions that govern every row: D9 (no `main()`/`__name__` early), D10 (no `try`/`except`
before S09), D11 (primer, rewrite, or move — never a retroactive award), D1, D3, D6 in
`decisions.md`; the heuristics in `LEDGER_NOTES.md`.

## Found by the skills-and-badges cycle (2026-09-17), before its synthesis ran

Two of its requirement agents finished before a session limit stopped the rest; these are
their verified findings, recorded here so a second interruption cannot lose them.

- **P0 — the authority hierarchy is inverted.** `course-state/course_requirements.json:7` names
  `learning_roadmap.md` primary. 0 of 52 sections teach that document's topic; 52 of 52 carry
  `learning_roadmap_52_V3.md`'s title byte for byte, and README, `industry_alignment/README.md`,
  AGENTS.md and `test_active_v3_curriculum_contract.py` all treat V3 as the contract. The file
  that ranked them was written a day after both and put the superseded one first.
- **P0 — sixteen badges are gated on sections that teach something else.** Their
  `required_sections` were authored against `learning_roadmap.md`'s numbering, and
  `engine.ts:596-669` scores them live. Q1 names five; the other eleven are
  `applied_rag_llm_service_development` (S20/S21 are Excel and documents; RAG is S48),
  `reliable_async_python_development` (S27/S28/S31 are pytest, data testing, graphs; async is
  S38), `responsible_machine_learning_evaluation` (S10/S23 are modules/CLI and Playwright),
  `production_python_delivery_foundations`, `llmops_production_delivery`,
  `container_platform_engineering_practice`, `ai_governance_code_review_practice`, and the four
  `integrated_*_practice` badges, which read as coherent syllabi only under the old roadmap.
- **P0 — `llmops_production_delivery` claims skills the course never teaches.** Its public claim
  names fine-tuning and graph-RAG. `GraphRAG` has zero matches in the 52 active files; the only
  `fine-tun` matches are the stale header and `id:` of `s41-llm-finetuning.ts` and one passing
  mention in S25. This is an award for content that does not exist, which D11 forbids.
- **P0 — `applied_deep_learning_practice` rests on an optional block.** S33's only neural-network
  content says of itself "Este bloque es opcional para el resto del curso"; S34 has none.
- **P1 — four incompatible 52-section curricula** (`learning_roadmap.md`, V3,
  `el_arte_de_python_roadmap_maestro_52_secciones.md`, and a "Master Roadmap v2.0" in the source
  registry), and README links two side by side as if both were current.
- **P1 — three course lengths.** The code says 491 h (and sums to it); `learning_roadmap.md` says
  600 h; V3 and README say 1,040 h.
- **Live site, from a browser pass** — the roadmap cards on https://pillb.github.io/pyarcana/
  render taglines as raw strings, so learners read literal backticks ("un entorno virtual
  (\`venv\`) …", "\`CP-N1-A\`"). A fix exists — `Sidebar.tsx` and `Dashboard.tsx` render them
  through `InlineText` — but only as uncommitted work that was already in the tree when this
  session began. It is not this campaign's to commit; its author, or the owner, should.

## Spun off as separate tasks (2026-09-18)

- **Proyectos never renders on the static site** — 9 of 13 capstones invisible on GitHub Pages;
  works on the dev server; pre-existing on `main`. Started in its own session.
- **Credential issuance always returns 403** — the route counts ExamAttempt rows keyed `S04…S52`,
  but attempts are stored under section slugs. Pre-existing; found by the adversarial check of the
  PR #63 fixes.
- **The gate lens of that check did not run** (session limit). `fresh_report()` is covered by six
  tests and an end-to-end `gate.py snapshot S03`, but the independent skeptic pass is still owed.

## Done this round (2026-09-19), pending the S16 revision and one commit

- **S16 (queue rows 5 and 6): both D3 blocks written, applied, verified.** "Contar valores
  distintos por clave" (groupby + nunique, figure `S16-groupby-nunique`) before S16-T2-A, and
  "Cuartiles, IQR y cercas de Tukey" (figure `S16-iqr-fences`, a new `numberline` archetype)
  before S16-T3-B, plus the T2-A/demo rewrites off `transform`/`filter(lambda)`, the z-score
  removals, the D1 glosses and selfCheck[3]. Surprising uses in S16: 50 -> 4. A four-lens
  adversarial review of the applied diff produced 44 findings; round 2 is with codex
  (`.fixer/S16D3b.prompt.txt`) and must land before the commit. Its P0: S16-T3-B-E2's planted
  defect printed the same list as the solution.
- **S30 (row 7): train/test opening + figure `S30-train-test`; F1 block + figure
  `S30-f1-harmonic`.** Round 2 with codex: the block explained F1 without defining it, and
  define-before-use went 20 -> 31 on `f1-score` and `precision`.
- **S33 (row 8): cross-validation block + figure `S33-group-folds`** (a new `folds` archetype),
  the `S33-overfit-gap` figure moved from T1-A to T3-B with its bars renamed train/valid, the
  `valid` gloss, the roadmap paragraph in plain words, and fold 0 aligned to the k-fold scheme in
  all six places. Gate clean except the shared S16 city-name failure.
- **S27 (row 9): pytest.** A supporting block before S27-T2-A — what pytest is, that it is a
  separate program installed into the `.venv` with `python -m pip install pytest`, and a real
  measured run (`.F`, the node id, the assert diff) — plus one sentence in theory[0] naming it.
- **S41 (row 10): FastAPI.** A supporting block after S41-T2-A mapping the stdlib model the
  learner just ran onto `@app.post`, `Depends`, a Pydantic body and OpenAPI, with figure
  `S41-stdlib-to-fastapi` and a non-executed snippet. Trade-off stated: `fastapi` is not in
  requirements-content.txt, so the runtime audit skips that snippet as a missing dependency
  rather than verifying it; the alternative was a new pinned content dependency for code the
  section deliberately never runs.
- **S13 (row 13): precision and recall in plain words**, in S13-T1-B where the formulas already
  were, so S30's F1 block has something to recall. Surprising uses in S13: 77 -> 18.
- **Two platform fixes found on the way.** `learningOutcomes` and `jobRelevance` rendered raw, so
  32 outcomes in 17 sections showed literal backticks on the live site; both now go through
  `InlineText`, and `scripts/raw_markdown_rendering.spec.ts` (stale ids from batch A, so it had
  been failing at its first click) now opens the popover and the sheet. `TableShapeFigure` drew an
  unwrapped headline while reserving room for a wrapped one, which put the arrow label on the
  panel titles.

## In flight

1. **Skills-and-badges map (solarize cycle).** Mine the project documentation for the required
   skills and badges per level and per group of sections, validate the roadmap against them, check
   the live site renders what the roadmap claims, and produce a synced skills/content map naming
   every missing skill, wrong on-ramp and unsupported badge claim. Research syllabi, books and
   courses for completeness of the on-ramp. Feeds every row below.

## Decided and owed (D9, D10) — S02-S08 DONE 2026-09-21

D9's entrypoint sweep landed: the You Do starters of S02-S08 run their demo at top level, the
requirements say what the file does instead of naming `main()`, the two Level-1 capstone starters
are unwrapped, and `test_s04_independent_contract.py` now pins the ABSENCE of the idiom before S10
and its presence in S10 (D9's "repointed, not weakened"). The ratchet reads the playgrounds and
the capstone starters too, and D9 is down to the 2 sites in S09.

**Next in this row: the S09/S10 round.** S09's guard protects a demo that a separate
`test_audit_log.py` imports — remove the guard and the demo runs on import, so the three tests
move into `audit_log.py` as final asserts (D11's rewrite rung), and S10 then teaches `__name__`
with exactly that experience: a test module that imports the file and runs its demo by accident.
Decisions L1Q3-1 (already decided by D9) and L1Q3-5 carry the detail.

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
4. **`try`/`except` before S09 (D10).** The real count, once the scan also read the Theory-tab
   playgrounds, was 106, not 54. **S05 is done** (20 sites, 2026-09-21): every `raise` stays —
   refusing bad input is what the section teaches — and the catching goes. Two replacements,
   reusable for the rest: a refused call is shown as the last line of the traceback in a comment
   rather than run (a raising snippet exits non-zero, which the runtime audit records as a P0),
   and a batch checks each row before calling instead of catching after. Ratchet 106 -> 86.
   **DONE:** S05 (20), S06 (17), S07 (5), S08 (21) and the 8 playground sites — everything that
   is not blocked. Two playgrounds codex also swept came back out: `exceptions-logging` and
   `oop-domain` are S09 and S11, where the construct is taught. Ratchet 106 -> 35.
   **Blocked:** S02 (24) and S04 (11) sit inside CP-N1-A, so they wait on the Q3 route — owner
   packet question 4. Decision L1Q3-2 carries the per-site plan.

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

0. **A gate for planted defects — BUILT (2026-09-21).** `scripts/planted_defect_audit.py` runs the
   starter and the solution of every exercise whose text declares a DEFECT and reports those whose
   starter already prints every line the solution does. It found S13-T1-B-E1 (inverted denominators
   on a fixture where both metrics are 0.8) after S16-T3-B-E2 was found by hand; both are fixed.
   Still owed: a full run across all 941 such exercises (the two sections checked are clean), and
   a ratchet test holding the count once that baseline exists.
17. `glossary_intro_audit.py` reads section *source* — it matches `id: 'fastapi'`, a code comment
    and a book title. Move it onto the extractor's learner-visible events.
18. The extractor still does not emit weDo `feedback`, `edgeCases`, declared `output`, You Do
    `portfolioNote`/`retrospective`, section titles, or resource books and courses — about 5,400
    learner-visible strings.
19. Cross-term span claiming in the extractor, the hover and `glossary-first-use.test.mjs`, without
    which splitting a homonym entry does not stop the shorter alias matching inside the longer.
20. Dead glossary entries (`args-y-kwargs`, `feature-engineering`, and the ones written for the
    three retired section files) — preservation says propose, not delete.

## Follow-ups this round opened (each names the section that must carry it)

- **S15**: its two forward mentions of groupby (`S15-T1-A.p2`, `selfCheck[8].opt[3]`) are now
  previews of what S16 teaches; the glossary's `groupby.firstSectionId` still says `stdlib-deep`
  and must move to `wxpython-gui` once S16's round 2 lands.
- ~~**S18**: recall of S16's quartiles~~ — done 2026-09-21: the percentile mapping comes before
  the formula, robustness is stated as the positional property S16 demonstrated, and the anomalies
  are named «cercas de Tukey». The glossary's `groupby` entry also moved to `wxpython-gui`, which
  was waiting on S15's two mentions (both now reworded).
- **S34 and S32**: S34-T2-A should use S33's name («validación cruzada») and S34 outcome[2] needs
  a D1 gloss for «CV-safe»; the leakage link in S32 `resources.doc[5]` moves next to S33's
  rolling-origin block (CONCEPT_QUEUE 154) — one move, two sections, so it waits for both.
- **The groupby figure's middle state.** `S16-groupby-nunique` draws rows -> counts in one arrow;
  the rows gathered into one group per key are never shown, and this is the only groupby visual
  before S17 (review finding pedagogy-4). Needs either per-key tinting in `TableShapeFigure` or a
  three-stage shape; deferred as a figure change, not prose.
- **Generator expressions** are used in visible code from S02 onward and taught nowhere; S30-T4-B-E1
  lost the word «generadores» this round but the construct remains. Curriculum decision to raise.

## Deferred, with a decision attached

21. **Q3 route** (S02-S04 practice layer, CP-N1-A) — 12 rows wait on it; interacts with D10.
22. **Rename batches B/C/D** (S14-S52 ids), plan phase P9.
23. **Five orphaned section files** not imported by `index.ts`, which are also the source of
    several wrong glossary definitions.
