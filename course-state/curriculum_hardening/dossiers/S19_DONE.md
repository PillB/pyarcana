# DONE — S19 Visualización y comunicación accesible

**File:** `src/lib/course/sections/s19-databases-orm.ts`  
**Platform id preserved:** `databases-orm`  
**Order:** reverse walk S22 → S21 → S20 → S19 → S18  

## Before → after (content metrics)

| Metric | Before (residual) | After |
|--------|-------------------|--------|
| avg_para | ~106.6 | **~426.9** |
| thin_para_ratio (<120) | ~0.3 | **0.0** |
| avg_instr | ~73.4 | **~315.2** |
| selfcheck_q | 4 | **5** |
| kb | ~43.5 | **~61.1** |
| tier target | partial (score 5) | **gold bar** (depth ≥ S16/S17) |

## What changed
- Theory: 9 blocks × 3 paragraphs — chart choice, ejes/encodings honestos, Matplotlib/Seaborn export, modelo Plotly/filtros/tooltips, state serializable, unidades/fuente/limitaciones, contraste/alt text/no sobreclaim.
- weDo: 24 instructions expanded (E1/E2/E3) with concept, fixture id, I/O contract, exact pass string.
- Starters: thin scaffolds enriched from solution fixtures + single TODO; solutions/oracles preserved.
- selfCheck: 5th MCQ on governance/operational criterion.
- Capstone framing: **dashboard ejecutivo CP-N2-B**; fail-closed / synthetic-only / no untaught APIs.
- Progressive disclosure: matplotlib/seaborn; plotly modeled as spec if absent; sin SQLAlchemy/ORM.

## Research
See `S19_RESEARCH.md`.

## Verification
- Imports via `tsx` OK; structure 9 theory / 8 iDo / 24 weDo / youDo / 5 selfCheck.
- `tsc --noEmit` clean for section modules path.
- Metrics meet avg_para≥250, avg_instr≥150, thin_para_ratio≤0.2.
