# Live validation ledger — 2026-09-30

Target: `https://pillb.github.io/pyarcana/`  
Language scope: Spanish surfaces first.  
Method: live web browsing available in this session. A Chrome GUI / Computer Use session was not available, so this ledger does **not** claim pixel-level Chrome interaction. Repository hashes were not accepted as deployment evidence.

## Checks completed

| Surface | Live observation | Repo comparison | Status |
|---|---|---|---|
| Roadmap | 52 sections / 4 phases are visible; early section names follow the V3 sequence | `src/lib/course/index.ts` also exposes 52 active sections | `LIVE_VERIFIED` |
| Badge explanation | Public copy says badges reflect own work, requested evidence, a rubric threshold and a supervisor verification path | red-team reports practical server-side evidence/issuance is not wired strongly enough for those claims | `OPEN_PRODUCT_CONTRACT` |
| Hours | Public page still exposes ~1,040 h as a provisional plan | active `COURSE_META.totalHours` is 491 | `OPEN_SOURCE_LIVE_DRIFT` |
| S01/S02/S03 presence | roadmap cards for reproducible environment, values/types, and decisions/rules are visible | source objects are active imports | `LIVE_VERIFIED_AT_CARD_LEVEL` |

## Required next live checks after curriculum patches

These are acceptance checks, not evidence that patches have shipped:

- open S01 and read the full Mars Climate Orbiter paragraph as rendered;
- open S02 and search rendered lesson/exercises for `def`, `return`, `if`, `try`, `except`, dict-authoring, `main()` and `_run_tests()`;
- open S03 and verify the `def`/call/`return` teaching block precedes learner-authored use;
- open S04 capstone increment and verify it uses only concepts mature by S04;
- open credential policy/badge detail surfaces and compare every public claim with the evidence path that actually exists;
- verify hours shown in header/dashboard/roadmap are derived from one canonical definition or explicitly labeled as different measures.

## Browser rule

A source fix is `FIXED_IN_SOURCE`, not `LIVE_VERIFIED`. Only a fresh deployed read can close the live row. Conversely, a stale deployment does not prove the source patch is wrong; it proves deploy/source drift until the deployment SHA is known.
