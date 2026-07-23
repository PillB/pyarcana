# DONE — S21 Documentos, plantillas y reportes trazables

**File:** `src/lib/course/sections/s21-fastapi.ts`  
**Platform id preserved:** `fastapi`  
**Order:** reverse walk S22 → S21 → S20 → S19 → S18  

## Before → after (content metrics)

| Metric | Before (residual) | After |
|--------|-------------------|--------|
| avg_para | ~107.0 | **~418.8** |
| thin_para_ratio (<120) | ~0.22 | **0.0** |
| avg_instr | ~77.4 | **~306.2** |
| selfcheck_q | 4 | **5** |
| kb | ~46.4 | **~64.1** |
| tier target | partial (score 5) | **gold bar** (depth ≥ S16/S17) |

## What changed
- Theory: 9 blocks × 3 paragraphs — Jinja datos/presentación, tablas seguras, DOCX estilos/extracción, PDF digital vs needs_ocr, narrativa H1↔evidencia, captions, a11y es-PE, provenance y checklist de cierre CP-N2-B.
- weDo: 24 instructions expanded (E1/E2/E3) with concept, fixture id, I/O contract, exact pass string.
- Starters: thin scaffolds enriched from solution fixtures + single TODO; solutions/oracles preserved.
- selfCheck: 5th MCQ on governance/operational criterion.
- Capstone framing: **cierre CP-N2-B**; fail-closed / synthetic-only / no untaught APIs.
- Progressive disclosure: jinja2, python-docx, pypdf/PyMuPDF conceptual en demos; sin routers FastAPI.

## Research
See `S21_RESEARCH.md`.

## Verification
- Imports via `tsx` OK; structure 9 theory / 8 iDo / 24 weDo / youDo / 5 selfCheck.
- `tsc --noEmit` clean for section modules path.
- Metrics meet avg_para≥250, avg_instr≥150, thin_para_ratio≤0.2.
