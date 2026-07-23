# PyArcana — Production Status (2026-07-23 pedagogy + deploy)

## `course_complete`: **true**

| Gate | Status |
|------|--------|
| 52/52 sections `passed` | ✅ |
| 12 level + FINAL capstones `formally_passed` | ✅ 13/13 demos exit 0 |
| Vector 416 demos / 1248 exercises | ✅ |
| Exam bank DB 1248 / 52 sections | ✅ |
| Topic evaluations 208 | ✅ |
| Open P0/P1 | ✅ none |
| Privacy RISK | ✅ 0 |
| Dual-newbie pedagogy (agentic_L1 + L2) | ✅ clean_52 both; gates empty |
| K1/K2 bulk theater | ✅ permanently rejected by forensic gates |
| Landing PyArcana + Art Nouveau | ✅ live on Pages |
| GitHub Pages deploy (`e4607b8`) | ✅ success |
| `npm run test:v3` | ✅ |
| `npm run test:layout` | ✅ |
| Playwright `v3_regression.spec.ts` | ✅ 17/17 |
| `python3 scripts/course_complete_gate.py` | ✅ exit 0 |

## Optional remaining

| Item | Severity | Action |
|------|----------|--------|
| Full browser geometric spotcheck on all sections | P3 | Screenshots already analyzed: 0 text overlaps |
| Working-tree validation JSON churn on K1/K2 re-runs | P3 | Local only; not required for ship |

## Capstone packages

`course-state/capstones/CP-*/` — gate.json, demo.py, execution.json, RUN.md, system_or_data_card.md  
INDEX: 13/13 pass.

## Commands

```bash
npm run test:all-gates
python3 course-state/capstones/CP-FINAL/demo.py
```
