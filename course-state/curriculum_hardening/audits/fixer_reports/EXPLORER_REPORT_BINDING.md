# Explorer Report Binding (Fixer Fleet)

**Policy:** Each Fixer subagent uses **only** its section Explorer report as the fix-guidance authority.

**Explorer reports dir:** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports`

**In scope**
- `S{NN}_EXPLORER_REPORT.md`
- `S{NN}_EXPLORER_META.json` (optional)

**Out of scope (do not use for fix guidance)**
- Prior Fixer reports / FIXER_META
- Other audit folders, fleet summaries, wave notes
- Explorer reports for other sections

| Section | Explorer report | Section source |
|--------:|-----------------|----------------|
| 1 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S01_EXPLORER_REPORT.md` | `src/lib/course/sections/s01-setup.ts` |
| 2 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S02_EXPLORER_REPORT.md` | `src/lib/course/sections/s02-basics.ts` |
| 3 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S03_EXPLORER_REPORT.md` | `src/lib/course/sections/s03-data-structures.ts` |
| 4 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S04_EXPLORER_REPORT.md` | `src/lib/course/sections/s04-functions-modules.ts` |
| 5 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S05_EXPLORER_REPORT.md` | `src/lib/course/sections/s05-oop.ts` |
| 6 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S06_EXPLORER_REPORT.md` | `src/lib/course/sections/s06-numpy.ts` |
| 7 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S07_EXPLORER_REPORT.md` | `src/lib/course/sections/s07-data-acquisition.ts` |
| 8 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S08_EXPLORER_REPORT.md` | `src/lib/course/sections/s08-pandas.ts` |
| 9 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S09_EXPLORER_REPORT.md` | `src/lib/course/sections/s09-visualization.ts` |
| 10 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S10_EXPLORER_REPORT.md` | `src/lib/course/sections/s10-sklearn.ts` |
| 11 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S11_EXPLORER_REPORT.md` | `src/lib/course/sections/s11-testing.ts` |
| 12 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S12_EXPLORER_REPORT.md` | `src/lib/course/sections/s12-performance.ts` |
| 13 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S13_EXPLORER_REPORT.md` | `src/lib/course/sections/s13-rpa-automation.ts` |
| 14 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S14_EXPLORER_REPORT.md` | `src/lib/course/sections/s14-security.ts` |
| 15 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S15_EXPLORER_REPORT.md` | `src/lib/course/sections/s15-stdlib-deep.ts` |
| 16 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S16_EXPLORER_REPORT.md` | `src/lib/course/sections/s16-wxpython-gui.ts` |
| 17 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S17_EXPLORER_REPORT.md` | `src/lib/course/sections/s17-packaging.ts` |
| 18 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S18_EXPLORER_REPORT.md` | `src/lib/course/sections/s18-data-engineering.ts` |
| 19 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S19_EXPLORER_REPORT.md` | `src/lib/course/sections/s19-databases-orm.ts` |
| 20 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S20_EXPLORER_REPORT.md` | `src/lib/course/sections/s20-rag.ts` |
| 21 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S21_EXPLORER_REPORT.md` | `src/lib/course/sections/s21-fastapi.ts` |
| 22 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S22_EXPLORER_REPORT.md` | `src/lib/course/sections/s22-rapidfuzz-entity.ts` |
| 23 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S23_EXPLORER_REPORT.md` | `src/lib/course/sections/s23-computer-vision.ts` |
| 24 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S24_EXPLORER_REPORT.md` | `src/lib/course/sections/s24-rpa-advanced.ts` |
| 25 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S25_EXPLORER_REPORT.md` | `src/lib/course/sections/s25-streamlit-dashboards.ts` |
| 26 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S26_EXPLORER_REPORT.md` | `src/lib/course/sections/s26-integrator-phase1.ts` |
| 27 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S27_EXPLORER_REPORT.md` | `src/lib/course/sections/s27-async-concurrency.ts` |
| 28 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S28_EXPLORER_REPORT.md` | `src/lib/course/sections/s28-llm-agents.ts` |
| 29 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S29_EXPLORER_REPORT.md` | `src/lib/course/sections/s29-mlops.ts` |
| 30 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S30_EXPLORER_REPORT.md` | `src/lib/course/sections/s30-security-infra.ts` |
| 31 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S31_EXPLORER_REPORT.md` | `src/lib/course/sections/s31-streaming-data.ts` |
| 32 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S32_EXPLORER_REPORT.md` | `src/lib/course/sections/s32-microservices.ts` |
| 33 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S33_EXPLORER_REPORT.md` | `src/lib/course/sections/s33-advanced-models.ts` |
| 34 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S34_EXPLORER_REPORT.md` | `src/lib/course/sections/s34-cv-ai-integration.ts` |
| 35 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S35_EXPLORER_REPORT.md` | `src/lib/course/sections/s35-system-design.ts` |
| 36 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S36_EXPLORER_REPORT.md` | `src/lib/course/sections/s36-ai-apis-advanced.ts` |
| 37 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S37_EXPLORER_REPORT.md` | `src/lib/course/sections/s37-dbt-bigquery.ts` |
| 38 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S38_EXPLORER_REPORT.md` | `src/lib/course/sections/s38-performance-extreme.ts` |
| 39 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S39_EXPLORER_REPORT.md` | `src/lib/course/sections/s39-integrator-phase2.ts` |
| 40 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S40_EXPLORER_REPORT.md` | `src/lib/course/sections/s40-agentic-architecture.ts` |
| 41 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S41_EXPLORER_REPORT.md` | `src/lib/course/sections/s41-llm-finetuning.ts` |
| 42 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S42_EXPLORER_REPORT.md` | `src/lib/course/sections/s42-graph-rag.ts` |
| 43 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S43_EXPLORER_REPORT.md` | `src/lib/course/sections/s43-llmops.ts` |
| 44 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S44_EXPLORER_REPORT.md` | `src/lib/course/sections/s44-multimodal.ts` |
| 45 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S45_EXPLORER_REPORT.md` | `src/lib/course/sections/s45-iac.ts` |
| 46 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S46_EXPLORER_REPORT.md` | `src/lib/course/sections/s46-gpu-computing.ts` |
| 47 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S47_EXPLORER_REPORT.md` | `src/lib/course/sections/s47-opensource.ts` |
| 48 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S48_EXPLORER_REPORT.md` | `src/lib/course/sections/s48-ai-governance.ts` |
| 49 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S49_EXPLORER_REPORT.md` | `src/lib/course/sections/s49-data-contracts.ts` |
| 50 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S50_EXPLORER_REPORT.md` | `src/lib/course/sections/s50-tech-leadership.ts` |
| 51 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S51_EXPLORER_REPORT.md` | `src/lib/course/sections/s51-integrator-final.ts` |
| 52 | `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S52_EXPLORER_REPORT.md` | `src/lib/course/sections/s52-career-strategy.ts` |
