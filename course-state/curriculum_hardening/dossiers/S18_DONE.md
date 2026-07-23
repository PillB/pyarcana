# DONE — S18 EDA, estadística descriptiva e incertidumbre

**File:** `src/lib/course/sections/s18-data-engineering.ts`  
**Platform id preserved:** `data-engineering`  
**Order:** reverse walk S22 → S21 → S20 → S19 → S18  

## Before → after (content metrics)

| Metric | Before (residual) | After |
|--------|-------------------|--------|
| avg_para | ~130.1 | **~378.4** |
| thin_para_ratio (<120) | ~0.04 | **0.0** |
| avg_instr | ~89.8 | **~319.8** |
| selfcheck_q | 4 | **5** |
| kb | ~49.0 | **~65.3** |
| tier target | partial (score 7) | **gold bar** (depth ≥ S16/S17) |

## What changed
- Theory: 9 blocks × 3 paragraphs — centro/dispersión/cuantiles, métricas robustas y escalas, población/muestra/sesgo, IC y efecto, correlación/confusión, segmentos/anomalías sin causalidad, Q→H→E, data notes reproducibles.
- weDo: 24 instructions expanded (E1/E2/E3) with concept, fixture id, I/O contract, exact pass string.
- Starters: thin scaffolds enriched from solution fixtures + single TODO; solutions/oracles preserved.
- selfCheck: 5th MCQ on governance/operational criterion.
- Capstone framing: **inicio CP-N2-B**; fail-closed / synthetic-only / no untaught APIs.
- Progressive disclosure: numpy/pandas descriptivos; sin Prefect/Parquet/GE path.

## Research
See `S18_RESEARCH.md`.

## Verification
- Imports via `tsx` OK; structure 9 theory / 8 iDo / 24 weDo / youDo / 5 selfCheck.
- `tsc --noEmit` clean for section modules path.
- Metrics meet avg_para≥250, avg_instr≥150, thin_para_ratio≤0.2.
