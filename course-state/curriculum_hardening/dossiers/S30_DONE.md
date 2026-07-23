# S30 DONE — gold expansion

**Section:** `s30-security-infra.ts` — Entity resolution probabilístico  
**Date:** 2026-07-22  
**Order:** reverse walk S31 → S30 → S29 → S28 → S27 → S25

## Sizes (before → after)

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| kb | 42.8 | 55.7 | 12.9 |
| n_para | 25 | 25 | 0 |
| avg_para | 115.1 | 304.9 | 189.8 |
| min_para | 62 | 250 | |
| thin_para_ratio | 1.0 | 0.0 | |
| n_instr | 24 | 24 | |
| avg_instr | 55.2 | 397.2 | 342.0 |
| min_instr | 23 | 365 | |

## Checklist vs GOLD_STANDARD_CHECKLIST.md
- [x] Theory ≥9 headings; paragraphs expanded to avg ≥250 chars (ES-PE, why/contract/Peru case)
- [x] weDo 24 exercises; instructions ≥150 chars with I/O contracts + pass references
- [x] solutionCode/outputs preserved (grader oracles)
- [x] Progressive disclosure (no later-only APIs)
- [x] No fraud/parentesco claims from scores/graphs/matches; HITL/fail-closed language
- [x] Research dossier `S30_RESEARCH.md`
- [x] TypeScript structure intact (24 exercises, braces balanced)

## Artifacts
- `course-state/curriculum_hardening/dossiers/S30_RESEARCH.md`
- `course-state/curriculum_hardening/dossiers/S30_DONE.md`
- `src/lib/course/sections/s30-security-infra.ts`
