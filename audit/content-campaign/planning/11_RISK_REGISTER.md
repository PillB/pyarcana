# Risk register

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| R-01 | Editing the wrong file because names mislead (`s18-data-engineering.ts` is not data engineering) | High | High | Resolve every target through `index.ts` → `index`/`id`/`title`; recorded in `PROJECT_CONTEXT_INDEX.md` §5 | MITIGATED |
| R-02 | Treating a grep hit in an inactive file as proof the course teaches something | High | High | Only the 52 imported files count. Caught in practice: `randomiz`/`grupo de control` hits were all in unimported `s09-sklearn.ts` | MITIGATED |
| R-03 | Breaking the 24-exercise / 8-subtopic / 8-demo invariant | Medium | Release-blocking | Additions reuse existing `subtopicId`s; ID sets diffed before/after; three invariant gates run | MITIGATED |
| R-04 | Fabricated code output in teaching material | Medium | High | Every snippet executed on the declared interpreter; `python_content_runtime_audit.py` re-executes independently | MITIGATED |
| R-05 | Writing code that needs an absent dependency | Medium | Medium | `pyarrow`/`duckdb`/`polars` confirmed absent; U2 constrained to the standard library | MITIGATED |
| R-06 | Python 3.9 incompatibility (`match`, PEP 604 unions) | Medium | Medium | Interpreter confirmed as 3.9.6; snippets written and run against it | MITIGATED |
| R-07 | Adding Autocheck questions silently lowers stored quiz scores | Low | High | `setQuizScore` merges with `Math.max`; verified in `progress-store.ts:77` | MITIGATED |
| R-08 | New prose introduces a forward reference to a later section | Medium | High | Prerequisite trace per unit; all S18 prerequisites satisfied inside S18 before the insertion point | MITIGATED |
| R-09 | New glossary term worsens the pre-existing forward-ref count | Low | Medium | New terms confirmed to have zero earlier occurrences before registration; audit re-run after | MITIGATED |
| R-10 | Voice drift — the addition reads as bulk-generated next to hand-written neighbours | Medium | High | House style catalogued in `07_EDITORIAL_WRITING_REQUIREMENTS.md`; adversarial iteration 2; independent rubric | ACTIVE |
| R-11 | Scope creep into level/phase or renumbering | Low | Release-blocking | UR-02/UR-03 immutable; `PHASES` untouched | MITIGATED |
| R-12 | Accidentally staging the untracked reference folder | Medium | Medium | Explicit-path staging only; never `git add .`/`-A` | ACTIVE |
| R-13 | Misattributing the two pre-existing glossary failures to this campaign | Medium | Low | Baseline recorded before any edit | MITIGATED |
| R-14 | Claiming live GitHub Pages validation without a deploy | Low | High | Nothing is deployed in this campaign; local evidence is labelled local | MITIGATED |
