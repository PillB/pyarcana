# Research dossier — S17 Joins, reshape, groupby y cierre analítico

**Section file:** `src/lib/course/sections/s17-packaging.ts`  
**Platform id (preserved):** `packaging`  
**V3 title:** Joins, reshape, groupby y cierre analítico  
**Residual:** STUB (avg_para≈86, avg_instr≈62, thin≈0.52, score 4)  
**Target:** gold vs S01/S02 pedagogy + S03/S04 depth; close **CP-N2-A**

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Docs | pandas User Guide — *Merge, join, concatenate*; *Reshaping and pivot tables*; *Group by: split-apply-combine* — `validate`, `indicator`, named agg, `transform` |
| Book | McKinney *Python for Data Analysis* (3e) ch. 8 (join/combine), ch. 10 (groupby) — fan-out, long/wide, aggregation contracts |
| Coursera | IBM *Data Analysis with Python* / Google *Data Analytics* — reconcile totals, document denominators before storytelling |
| Stanford | CS109 / data wrangling labs — cardinality checks before join; anti-join for orphan detection |
| GitHub | pandas-dev examples; Great Expectations “expect_compound_columns_to_be_unique” patterns (conceptual only — no GE API in S17) |
| Video | Rob Mulla / Keith Galli pandas series — melt/pivot for reporting; leakage demos in time features |

## Coverage gaps in current stub
- Theory paragraphs are slogan-length; need *why*, *contract* (inputs/outputs/errors), Peru synthetic case (Lima/Cusco/Arequipa, PEN, cliente_id).
- Exercises are one-liners without fixture id, pass string, or domain predicate.
- Leakage/reconciliación under-taught relative to CP-N2-A close.
- Progressive disclosure: only pandas APIs from S15–S17 (no Prefect/GE/SQLAlchemy).

## Expansion plan
1. Deepen 9 theory blocks to ≥3 paragraphs (~250+ chars) with ES-PE voice.
2. Expand 24 weDo instructions to ≥150 chars: concept, fixture, I/O, exact print target.
3. Enrich empty starters with fixtures + single TODO defect; keep solution oracles honest.
4. Strengthen selfCheck explanations; optional 5th MCQ if structure allows.
5. DONE note + metric recompute (avg_para≥220, avg_instr≥150, thin≈0).
