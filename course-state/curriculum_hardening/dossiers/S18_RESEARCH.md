# Research dossier — S18 EDA, estadística descriptiva e incertidumbre

**Section file:** `src/lib/course/sections/s18-data-engineering.ts`  
**Platform id (preserved):** `data-engineering`  
**V3 title:** EDA, estadística descriptiva e incertidumbre  
**Residual before:** PARTIAL (avg_para≈130.1, avg_instr≈89.8, thin≈0.04, score 7)  
**Target:** gold vs S01/S02 pedagogy + S16/S17 depth; **inicio CP-N2-B**

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Docs | numpy stats; pandas describe/quantile; SciPy stats conceptual IC |
| Book | McKinney *PFDA* EDA chapters; *Statistics as Principled Argument* (language of evidence) |
| Coursera | Duke/Stats with Python; IBM Data Analysis with Python — descriptive stats |
| Stanford/Harvard | Stats 110 / CS109 uncertainty communication; Harvard Stat 110 style caveats on significance |
| GitHub | numpy/pandas examples; effect-size calculators (conceptual) |
| Video | StatQuest correlation vs causation; 3Blue1Brown probability intuition (optional) |

## Coverage gaps in current partial
- Language contracts (compatible con / no probado) thin; residual residualizing demo under-explained; instructions short.
- Progressive disclosure: numpy/pandas descriptivos; sin Prefect/Parquet/GE path.
- ES-PE workplace voice; synthetic Lima/Cusco/Arequipa; no real PII; fail-closed / no-fraud-from-scores.

## Expansion plan
1. Deepen 9 theory blocks to 3 paragraphs (~250+ chars) with *why*, *contract*, Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars: concept, fixture id, I/O, exact pass string.
3. Enrich thin starters with solution fixtures + single TODO; keep solution oracles.
4. Add 5th selfCheck MCQ on operational/governance failure mode.
5. DONE note + metric recompute (avg_para≥250, avg_instr≥150, thin_para_ratio(<120)≤0.2).
