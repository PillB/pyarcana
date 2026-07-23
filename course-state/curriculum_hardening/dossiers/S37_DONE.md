# S37 DONE — Profiling, algoritmos y rendimiento

**File:** `src/lib/course/sections/s37-dbt-bigquery.ts`  
**Export:** `section37` · **index:** 37 · **id:** `dbt-bigquery` (conservado)

## Before → after (knowledge base)

| Metric | Before (stub) | After (gold pass) |
|--------|---------------|-------------------|
| File size | ~33.5 KB / 1267 lines | ~52 KB |
| Theory paragraphs | 1-line slogans | ≥3 paras/heading, min ≥~200 chars, ES-PE |
| Operational contracts | Absent | Entrada/salida/error/criterio + CASO-LIM-037 |
| weDo instructions | 2–5 words | ≥150 chars; fixture; solution-aligned output |
| starterCode | `# TODO` empty | Fixture + one defect (mean vs median, inverted budget, etc.) |
| same_result / budgets | Mentioned lightly | Explicit exercises + selfCheck |
| Future APIs | Risk of cloud dbt | No live BQ/dbt; pure profiling of N3 path |

## Pedagogy coverage

- T1 Medición: wall/CPU/memory + warmup/mediana  
- T2 Algos: O(n²) pairs, blocking, inverted index, order block→score  
- T3 Memoria: chunks, columnar, dtypes, cache key, OOC  
- T4 Gate: budgets fail/pass, speedup ratio, clarity over 2%, report keys  

## Research

See `S37_RESEARCH.md` (Coursera Princeton Algorithms, MIT 6.006/6.172, Stanford CS161, Harvard CS50/CS61, cProfile/dedupe GitHub, PyCon profiling videos).

## Residual risks

- Demo wall_ms outputs are reference snapshots (non-deterministic on real machines).  
- Blocking model assumes equal blocks (didactic).  
- prisma/seed exam stems may still mirror older short wording until Phase 5 refresh.  
- Legacy platform id `dbt-bigquery` can confuse learners expecting SQL cloud labs — mitigated in map theory.
