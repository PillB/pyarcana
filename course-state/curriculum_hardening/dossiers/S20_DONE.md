# DONE — S20 Automatización robusta de Excel

**File:** `src/lib/course/sections/s20-rag.ts`  
**Platform id preserved:** `rag`  
**Order:** reverse walk S22 → S21 → S20 → S19 → S18  

## Before → after (content metrics)

| Metric | Before (residual) | After |
|--------|-------------------|--------|
| avg_para | ~100.0 | **~420.6** |
| thin_para_ratio (<120) | ~0.44 | **0.0** |
| avg_instr | ~69.6 | **~290.7** |
| selfcheck_q | 4 | **5** |
| kb | ~42.4 | **~59.8** |
| tier target | partial (score 5) | **gold bar** (depth ≥ S16/S17) |

## What changed
- Theory: 9 blocks × 3 paragraphs — sheets/celdas/tablas, fórmulas vs valores materializados, estilos y fechas ISO, conciliación y pivots, validación estructural, batch corruptos/locks, backups e idempotencia.
- weDo: 24 instructions expanded (E1/E2/E3) with concept, fixture id, I/O contract, exact pass string.
- Starters: thin scaffolds enriched from solution fixtures + single TODO; solutions/oracles preserved.
- selfCheck: 5th MCQ on governance/operational criterion.
- Capstone framing: **reporting factory (CP-N2-B middle)**; fail-closed / synthetic-only / no untaught APIs.
- Progressive disclosure: openpyxl; pandas reconciliation; sin embeddings/RAG.

## Research
See `S20_RESEARCH.md`.

## Verification
- Imports via `tsx` OK; structure 9 theory / 8 iDo / 24 weDo / youDo / 5 selfCheck.
- `tsc --noEmit` clean for section modules path.
- Metrics meet avg_para≥250, avg_instr≥150, thin_para_ratio≤0.2.
