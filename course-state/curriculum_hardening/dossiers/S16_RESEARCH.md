# Research dossier — S16 Calidad, limpieza y contratos de datos

**Section file:** `src/lib/course/sections/s16-wxpython-gui.ts`  
**Platform id (preserved):** `wxpython-gui`  
**V3 title:** Calidad, limpieza y contratos de datos  
**Residual:** STUB (avg_para≈89, avg_instr≈72, thin≈0.54, score 4)  
**Target:** gold vs S01/S02 pedagogy; quality gate for **CP-N2-A**

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Docs | pandas missing data; `duplicated`/`drop_duplicates`; string accessors — null policy vs imputation |
| Book | Wickham *R for Data Science* tidy principles (conceptual) + McKinney cleaning chapters — separate normalize from impute |
| Industry | Google Data Quality / Amazon DQ dimensions — completeness, uniqueness, validity, consistency; fail-closed gates |
| MIT/Stanford | Data-centric AI notes — document transforms; never silent “fix” on required keys |
| GitHub | great-expectations expectations catalog (patterns only); OpenRefine reconceptualized as audit trail |
| Peru case | Synthetic montos `S/`, regiones Lima/Arequipa/Cusco, `cliente_id` — no real PII; Ley 29733 awareness (no real DNI) |

## Coverage gaps in current stub
- Theory thin on operational contracts (required vs optional, impute cap, quarantine evidence).
- Exercises lack CASO-style fixture naming, pass strings, adverse paths.
- Cross-field + schema drift need clearer fail-closed language.
- Progressive disclosure: pandas + stdlib only (S01–S16); no wxPython, no GE API, no production DQ platforms.

## Expansion plan
1. Deepen 9 theory blocks to ≥3 paragraphs (~250+ chars) ES-PE + synthetic Perú.
2. Expand 24 weDo instructions to ≥150 chars with concept/fixture/I-O/pass.
3. Enrich starters; keep iDo demos and solution outputs stable.
4. Strengthen selfCheck explanations.
5. DONE note + metric recompute toward gold (score ≥ 8).
