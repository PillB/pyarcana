# Acceptance criteria and results

Every row is an executable check with a recorded result. "Passed" without a
command is not accepted.

## Structural / preservation

| # | Criterion | Command | Result |
|---|---|---|---|
| A1 | 52 active sections | `node scripts/v3_regression_counts.test.mjs` | **PASS** — `course_sections: 52` |
| A2 | 8 subtopics / 8 demos / 24 exercises everywhere | `python3 scripts/v3_invariant_validator.py` | **PASS** — 0 failures, 52 v3-tagged |
| A3 | S01 structural tags intact | `python3 scripts/check_section_structure.py` | **PASS** |
| A4 | No unauthorised deletion, no removed protected ID | `node scripts/preservation_sentinel.mjs` | **PASS** — `unauthorized_deletes: 0, failures: 0` |
| A5 | Progress preservation suite | `npm run test:preservation` | **PASS** — 17 node tests, 6 python tests, 0 fail |
| A6 | Identity sets unchanged | baseline JSON diff before/after | **PASS** — section IDs, exercise IDs, subtopic IDs, demo IDs all `IDENTICAL=True`; 1248 exercise IDs before and after |
| A7 | Source changes are purely additive | `git diff --numstat` | **PASS** — `+139/-0`, `+57/-0`, `+58/-0`; zero deleted lines |

## Content correctness

| # | Criterion | Command | Result |
|---|---|---|---|
| B1 | Every new snippet runs | direct execution on Python 3.9.6 | **PASS** — 3/3 exit 0 |
| B2 | Every declared `output:` equals real stdout | extract via the repo's own `extract_artifacts`, execute, compare | **PASS** — 3/3 `EXACT_MATCH=True` (`evidence/snippet_execution_iteration2.json`) |
| B3 | S15 snippet passes the repo's own runtime gate | `python3 scripts/python_content_runtime_audit.py --only s15-stdlib-deep` | **PASS** — `status: pass, reason: ok` |
| B4 | No new dependency required | `python3 -I` run of the S15 snippet | **PASS** — standard library only |
| B5 | Autocheck answer positions follow the S18 cycle `[1,3,0,2]` | `node scripts/rebalance_selfcheck_positions.mjs --from 18 --to 18` | **PASS** — `changed: 0`, indices `1,3,0,2,1,3,0,2,1,3` |
| B6 | Exam bank untouched | `npm run test:exam-pedagogy` | **PASS** — 1248 seed q / 416 concepts / p0=0 / p1=0, identical to baseline |

## Static analysis and build

| # | Criterion | Command | Result |
|---|---|---|---|
| C1 | Types | `npx tsc --noEmit` | **PASS** — exit 0 |
| C2 | Lint on changed files | `npx eslint <3 files>` | **PASS** — exit 0 |
| C3 | Static export builds | `npm run build:static` | **PASS** — exit 0 |
| C4 | New content present in the built bundle | grep of `out/_next/static/chunks/` | **PASS** — all 3 demo functions and both headings found |

## Editorial and pedagogical

| # | Criterion | Method | Result |
|---|---|---|---|
| D1 | No forward reference to a later section | scan of added lines only | **PASS** — only `S15` and `S18` referenced, both ≤ host section |
| D2 | Every new specialist term defined at first use | term-introduction trace | **PASS** — 10/10 |
| D3 | Two substantive iterations | `09` iteration log | **PASS** — 4 real corrections, one requiring a code and output change |
| D4 | Rubric ≥ 18/21, none < 2, Substance / Authorship / Reliability = 3 | protocol §10 scoring | **PASS** — see `EDITORIAL_REVIEW.md` |

## Compatibility (release-blocking)

| # | Criterion | Method | Result |
|---|---|---|---|
| E1 | Storage key unchanged | assertion | **PASS** — `python-ds-progress` |
| E2 | Legacy envelope parses with no loss and no reset warning | `legacy_progress_fixture.test.ts` | **PASS** — 7/7 |
| E3 | Empty server response cannot wipe local completion of touched sections | same suite | **PASS** |
| E4 | Real browser replay against the static build preserves everything | Playwright, desktop + mobile | **PASS** — 6 completed sections, all 5 sub-steps for both touched sections, quiz scores, bookmarks, `lastVisited`, `startDate` all intact; **0 console errors**, **0 reset warnings** |
| E5 | Historical completion still displayed as completion | render inspection | **PASS** — sidebar shows `6 de 52 secciones completadas`, S18 header shows `100%` and `Completada` |
| E6 | Quiz score cannot be reduced by a longer Autocheck | `progress-store.ts:77` uses `Math.max` | **PASS** |

## Render

| # | Criterion | Method | Result |
|---|---|---|---|
| F1 | New blocks visible at desktop and mobile | Playwright at 1440×1000 and 390×844 | **PASS** — 3/3 visible |
| F2 | No page-level horizontal overflow | computed `scrollWidth` vs `clientWidth` | **PASS** — `pageOverflows: false` at both widths |
| F3 | No console errors on the touched sections | console + pageerror listeners | **PASS** — 0 |
| F4 | Glossary hover hints wired for new terms | visual inspection of the screenshot | **PASS** — `asignación aleatoria`, `estimando`, `autoselección` render with hint underlines |

## Regression guard on pre-existing failures

| # | Criterion | Baseline | After | Verdict |
|---|---|---|---|---|
| G1 | `glossary_intro_audit` forward refs | 2 | 2 | **NOT WORSENED** |
| G2 | `glossary_coverage_audit` P1 misses | 46 | 46 | **NOT WORSENED** (and `sections_with_intros` improved 15 → 17) |
| G3 | `test_s03_independent_contract` errors | 4 | 4 | **NOT WORSENED** — proven pre-existing by stashing the campaign's changes and re-running |

## Not claimed

- **Live GitHub Pages validation.** Nothing was deployed. All evidence is local,
  against a local static build served under the production `/pyarcana` basePath.
- **The repo's runtime audit did not validate the two numpy snippets** on this
  machine; it runs snippets with `-I`, which hides the user site-packages where
  numpy lives, so it skipped them as `missing_dependency`. Their outputs were
  verified by direct execution instead. See `OPEN_QUESTIONS_AND_DOUBTS.jsonl` D-001.
