# S28 DONE — gold expansion

**Section:** `s28-llm-agents.ts` — Pruebas de datos, propiedades e integración  
**Date:** 2026-07-22  
**Order:** reverse walk S31 → S30 → S29 → S28 → S27 → S25

## Sizes (before → after)

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| kb | 40.6 | 53.7 | 13.1 |
| n_para | 24 | 24 | 0 |
| avg_para | 106.2 | 314.8 | 208.6 |
| min_para | 60 | 252 | |
| thin_para_ratio | 1.0 | 0.0 | |
| n_instr | 24 | 24 | |
| avg_instr | 54.6 | 400.6 | 346.0 |
| min_instr | 31 | 377 | |

## Checklist vs GOLD_STANDARD_CHECKLIST.md
- [x] Theory ≥9 headings; paragraphs expanded to avg ≥250 chars (ES-PE, why/contract/Peru case)
- [x] weDo 24 exercises; instructions ≥150 chars with I/O contracts + pass references
- [x] solutionCode/outputs preserved (grader oracles)
- [x] Progressive disclosure (no later-only APIs)
- [x] No fraud/parentesco claims from scores/graphs/matches; HITL/fail-closed language
- [x] Research dossier `S28_RESEARCH.md`
- [x] TypeScript structure intact (24 exercises, braces balanced)

## Artifacts
- `course-state/curriculum_hardening/dossiers/S28_RESEARCH.md`
- `course-state/curriculum_hardening/dossiers/S28_DONE.md`
- `src/lib/course/sections/s28-llm-agents.ts`
