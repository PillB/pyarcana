# Research dossier — S28 Pruebas de datos, propiedades e integración

**Section file:** `s28-llm-agents.ts`  
**Residual (before):** PARTIAL (avg_para≈106.2, avg_instr≈54.6, thin_para_ratio=1.0)  
**Target:** gold vs S01/S02 pedagogy + domain contracts for data tests, property-based y contrato de integración

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | Google *Testing and Debugging* / IBM data quality modules |
| MIT | MIT software construction — property testing and invariants |
| Stanford | CS143 / testing culture — integration contracts between stages |
| Harvard | CS50 testing practices — fixtures, isolation, clear failure messages |
| Yale | Data quality seminars — great_expectations-style expectations as contracts |
| GitHub | Hypothesis property-based testing; Great Expectations / pandera docs; pytest plugins |
| Video | PyCon talks on Hypothesis; Data Council sessions on data contracts |

## Coverage gaps in current partial
- Theory paragraphs average ~106.2 chars (target ≥250) with thin_para_ratio=1.0.
- weDo instructions average ~54.6 chars (target ≥150) without explicit I/O contracts / pass strings.
- Need synthetic Peru cases (`CASO-LIM-028`, run_id=cpn3a-dataqa, @example.pe) and fail-closed language.

## Expansion plan
1. Deepen each theory block to ≥3 paragraphs averaging ≥250 chars with why + contract + Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars with domain predicates and exact pass references.
3. Preserve TypeScript structure, solution outputs, selfCheck, and progressive disclosure (S01…S28 only).
4. Ethics: scores/graphs/matches never auto-label fraud or kinship; human review where decisions affect people.
