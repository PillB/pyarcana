# Research dossier — S30 Entity resolution probabilístico

**Section file:** `s30-security-infra.ts`  
**Residual (before):** PARTIAL (avg_para≈115.1, avg_instr≈55.2, thin_para_ratio=1.0)  
**Target:** gold vs S01/S02 pedagogy + domain contracts for motor ER testeable (cierre CP-N3-A)

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | Duke/Stanford data quality modules; *Entity Resolution* primers in data engineering specializations |
| MIT | MIT probabilistic record linkage discussions (Fellegi–Sunter style weights) |
| Stanford | CS246 / data mining — blocking, candidate generation, pairwise metrics |
| Harvard | CS109 record linkage labs — precision/recall on labeled pairs |
| Yale | Applied stats — missingness informative vs MCAR; frequency-adjusted agreement weights |
| GitHub | splink / dedupe / recordlinkage project docs (conceptual APIs); Febrl classic ER patterns |
| Video | PyData talks on probabilistic matching; O'Reilly sessions on clerical review workflows |

## Coverage gaps in current partial
- Theory paragraphs average ~115.1 chars (target ≥250) with thin_para_ratio=1.0.
- weDo instructions average ~55.2 chars (target ≥150) without explicit I/O contracts / pass strings.
- Need synthetic Peru cases (`CASO-LIM-030`, run_id=cpn3a-er, @example.pe) and fail-closed language.

## Expansion plan
1. Deepen each theory block to ≥3 paragraphs averaging ≥250 chars with why + contract + Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars with domain predicates and exact pass references.
3. Preserve TypeScript structure, solution outputs, selfCheck, and progressive disclosure (S01…S30 only).
4. Ethics: scores/graphs/matches never auto-label fraud or kinship; human review where decisions affect people.
