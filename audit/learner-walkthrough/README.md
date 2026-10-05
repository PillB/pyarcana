# Learner walkthrough (S01–S52)

The report is **[REPORT.md](REPORT.md)**, generated from `parts/`, `reading/`, `findings/walk.json` and
`data/walk/` by `scripts/build_report.py`. Edit the sources, not REPORT.md.

| Path | What |
|---|---|
| `reading/BRIEF.md` | The persona and method every section reading followed |
| `reading/SXX.md` | Persona reading of each section (blockers, issues, confusions, verdicts) |
| `findings/walk.json` | Cross-cutting findings W01–W13 (browser walk and source checks) |
| `findings/L1..L4.json` | Every finding in the QA workspace's report shape, as filed |
| `qa-export/qa-session-final.json` | The QA workspace session exported from its Sesión tab (`pyarcana.qa.v1`); import it in the QA workspace to review the reports with their captured context |
| `data/walk/SXX.json` | What the browser walk saw per section |
| `data/cpython/` | `npm run test:python-content` under `.venv-content` (3244 pass / 0 fail / 118 skip) |
| `data/playgrounds-cpython.json` | The 52 "Pruébalo tú mismo" snippets under CPython 3.12 |
| `data/exam-key-audit.json`, `data/exam-key-audit-manual.md` | Exam bank audit (1248 items) |
| `data/qa-tour.json`, `data/walk/onboarding-tour.json` | The QA tutorial and the onboarding tour, step by step |
| `scripts/` | Everything used, re-runnable |

Re-running (sandbox or laptop):

```bash
workers/billing/e2e/run.sh                                   # once: builds HEAD into /tmp/pyarcana-e2e
audit/learner-walkthrough/scripts/serve.sh &                 # keeps the local stack up on :8787
bun audit/learner-walkthrough/scripts/extract_sections.ts /tmp/claude-0/sections
bun audit/learner-walkthrough/scripts/extract_exam_bank.ts /tmp/claude-0/exam_bank.json /tmp/claude-0/sections
PYODIDE_DIR=<pyodide-0.26.2 release dir> node audit/learner-walkthrough/scripts/walk.mjs S01 S52
python3 audit/learner-walkthrough/scripts/make_findings.py S01 S52 > /tmp/findings.json
node audit/learner-walkthrough/scripts/file_qa.mjs /tmp/findings.json --tour --export qa.json
python3 audit/learner-walkthrough/scripts/build_report.py
```

Report-only: nothing here changes course content, tests or protected paths.
