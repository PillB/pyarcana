# Research dossier — S29 SQL avanzado y modelado relacional

**Section file:** `s29-mlops.ts`  
**Residual (before):** PARTIAL (avg_para≈101.5, avg_instr≈60.2, thin_para_ratio=1.0)  
**Target:** gold vs S01/S02 pedagogy + domain contracts for SQL avanzado y modelado relacional para ER/contactos

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | University of Michigan / Duke SQL for Data Science; Google *Data Analytics* advanced SQL |
| MIT | MIT OCW database systems themes — keys, normalization, transactions conceptually |
| Stanford | CS145 / DB primers — joins, indexes, window functions |
| Harvard | CS50 SQL / data modules — modeling entities and relationships |
| Yale | SOM analytics — dimensional modeling intuition for operational reporting |
| GitHub | dbt-labs jaffle_shop (modeling); PostgreSQL docs on window functions and CTEs |
| Video | Mode Analytics SQL tutorials; CMU 15-445 public lectures (conceptual) |

## Coverage gaps in current partial
- Theory paragraphs average ~101.5 chars (target ≥250) with thin_para_ratio=1.0.
- weDo instructions average ~60.2 chars (target ≥150) without explicit I/O contracts / pass strings.
- Need synthetic Peru cases (`CASO-LIM-029`, run_id=cpn3a-sql, @example.pe) and fail-closed language.

## Expansion plan
1. Deepen each theory block to ≥3 paragraphs averaging ≥250 chars with why + contract + Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars with domain predicates and exact pass references.
3. Preserve TypeScript structure, solution outputs, selfCheck, and progressive disclosure (S01…S29 only).
4. Ethics: scores/graphs/matches never auto-label fraud or kinship; human review where decisions affect people.
