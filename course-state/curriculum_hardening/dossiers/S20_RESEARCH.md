# Research dossier — S20 Automatización robusta de Excel

**Section file:** `src/lib/course/sections/s20-rag.ts`  
**Platform id (preserved):** `rag`  
**V3 title:** Automatización robusta de Excel  
**Residual before:** PARTIAL (avg_para≈100.0, avg_instr≈69.6, thin≈0.44, score 5)  
**Target:** gold vs S01/S02 pedagogy + S16/S17 depth; **reporting factory (CP-N2-B middle)**

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Docs | openpyxl official docs — worksheets, tables, data_only caveats |
| Book | Python Automation Cookbook (Excel chapters); *Data Quality* principles for reconcile gates |
| Coursera | Google IT Automation with Python — batch files, error handling |
| MIT/Stanford | data wrangling labs — schema validation before write; fail-closed pipelines |
| GitHub | openpyxl examples; office file format ZIP/XML structure notes |
| Video | Keith Galli / Arjan openpyxl walkthroughs — formulas vs values |

## Coverage gaps in current partial
- Formula-cache subtlety and structural gates under-specified; batch/idempotency thin; no 5th MCQ on reconcile fail-closed.
- Progressive disclosure: openpyxl; pandas reconciliation; sin embeddings/RAG.
- ES-PE workplace voice; synthetic Lima/Cusco/Arequipa; no real PII; fail-closed / no-fraud-from-scores.

## Expansion plan
1. Deepen 9 theory blocks to 3 paragraphs (~250+ chars) with *why*, *contract*, Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars: concept, fixture id, I/O, exact pass string.
3. Enrich thin starters with solution fixtures + single TODO; keep solution oracles.
4. Add 5th selfCheck MCQ on operational/governance failure mode.
5. DONE note + metric recompute (avg_para≥250, avg_instr≥150, thin_para_ratio(<120)≤0.2).
