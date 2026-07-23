# Research dossier — S27 Estrategia de pruebas con pytest

**Section file:** `s27-async-concurrency.ts`  
**Residual (before):** PARTIAL (avg_para≈137.5, avg_instr≈66.2, thin_para_ratio=0.93)  
**Target:** gold vs S01/S02 pedagogy + domain contracts for estrategia de pruebas pytest para normalización/matching (inicio CP-N3-A)

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | University of Minnesota *Software Testing*; Google *Python testing* modules |
| MIT | MIT 6.005/6.031 software construction — test strategy, oracles, isolation |
| Stanford | CS107 / testing culture — unit vs integration tradeoffs |
| Harvard | CS50 testing & pytest community patterns |
| Yale | SE seminars — risk-based test prioritization |
| GitHub | pytest docs (fixtures, parametrize, raises); coverage.py; mutmut conceptual mutation testing |
| Video | PyCon pytest deep dives; Talk Python episodes on fixture design |

## Coverage gaps in current partial
- Theory paragraphs average ~137.5 chars (target ≥250) with thin_para_ratio=0.93.
- weDo instructions average ~66.2 chars (target ≥150) without explicit I/O contracts / pass strings.
- Need synthetic Peru cases (`CASO-LIM-027`, run_id=cpn3a-01, @example.pe) and fail-closed language.

## Expansion plan
1. Deepen each theory block to ≥3 paragraphs averaging ≥250 chars with why + contract + Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars with domain predicates and exact pass references.
3. Preserve TypeScript structure, solution outputs, selfCheck, and progressive disclosure (S01…S27 only).
4. Ethics: scores/graphs/matches never auto-label fraud or kinship; human review where decisions affect people.
