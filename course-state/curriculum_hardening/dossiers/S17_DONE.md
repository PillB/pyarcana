# DONE — S17 Joins, reshape, groupby y cierre analítico

**File:** `src/lib/course/sections/s17-packaging.ts`  
**Platform id preserved:** `packaging`  
**Order:** reverse walk (after S18+); expanded before S16  

## Before → after (content metrics)

| Metric | Before (residual) | After |
|--------|-------------------|--------|
| avg_para | ~86 | **~257** |
| thin_para_ratio (<120) | ~0.52 | **0.0** |
| avg_instr | ~62 | **~215** |
| min_instr | ~44 | **≥173** |
| selfcheck_q | 4 | **5** |
| kb | ~45 | **~57** |
| tier target | stub (score 4) | **gold bar** (depth ≥ S03/S04) |

## What changed
- Theory: 9 blocks × 3 paragraphs with *why*, *contract*, Peru synthetic case (Lima/Cusco/Arequipa, PEN, `cliente_id`).
- weDo: 24 instructions expanded (E1/E2/E3) with concept, fixture id, I/O contract, exact pass string.
- Starters: bare `# TODO` enriched with fixtures + single defect TODO; solutions/oracles preserved.
- selfCheck: deeper explanations + 5th MCQ on reconciliation.
- youDo / jobRelevance: CP-N2-A close framing, fail-closed / no-claims language.
- Progressive disclosure: pandas merge/reshape/groupby only (S15–S17); no packaging/PyPI path.

## Research
See `S17_RESEARCH.md`.

## Verification
- Brace/backtick balance OK; `tsc --noEmit` clean for section modules.
- Structure: 9 theory heads, 8 iDo demos, 24 weDo, youDo, 5 selfCheck.
