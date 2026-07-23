# S25 DONE — gold expansion

**Section:** `s25-streamlit-dashboards.ts` — Endpoints de IA, Hugging Face y prompting evaluado  
**Date:** 2026-07-22  
**Order:** reverse walk S31 → S30 → S29 → S28 → S27 → S25

## Sizes (before → after)

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| kb | 41.3 | 54.6 | 13.3 |
| n_para | 27 | 27 | 0 |
| avg_para | 101.8 | 306.9 | 205.1 |
| min_para | 37 | 250 | |
| thin_para_ratio | 0.89 | 0.0 | |
| n_instr | 24 | 24 | |
| avg_instr | 48.9 | 377.2 | 328.3 |
| min_instr | 23 | 195 | |

## Checklist vs GOLD_STANDARD_CHECKLIST.md
- [x] Theory ≥9 headings; paragraphs expanded to avg ≥250 chars (ES-PE, why/contract/Peru case)
- [x] weDo 24 exercises; instructions ≥150 chars with I/O contracts + pass references
- [x] solutionCode/outputs preserved (grader oracles)
- [x] Progressive disclosure (no later-only APIs)
- [x] No fraud/parentesco claims from scores/graphs/matches; HITL/fail-closed language
- [x] Research dossier `S25_RESEARCH.md`
- [x] TypeScript structure intact (24 exercises, braces balanced)

## Artifacts
- `course-state/curriculum_hardening/dossiers/S25_RESEARCH.md`
- `course-state/curriculum_hardening/dossiers/S25_DONE.md`
- `src/lib/course/sections/s25-streamlit-dashboards.ts`
