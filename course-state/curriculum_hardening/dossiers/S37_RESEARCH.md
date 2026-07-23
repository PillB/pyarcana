# Research dossier — S37 Profiling, algoritmos y rendimiento

**Section file:** `s37-dbt-bigquery.ts`  
**Platform id (conservado):** `dbt-bigquery`  
**Residual:** STUB (avg_para≈70, avg_instr≈25, starters vacíos)  
**Target:** gold vs S01/S02 depth + operational contracts phase-appropriate (escala CP-N3-C; no dbt cloud real)

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *Python for Everybody* / *Data Structures* (Michigan) — complexity intuition; *Algorithms, Part I* (Princeton / Coursera, Sedgewick) — big-O and cost of pairs; *Google IT Automation with Python* — measuring scripts before optimizing |
| MIT | MIT 6.006 *Introduction to Algorithms* (OCW) — asymptotic analysis; MIT 6.172 *Performance Engineering of Software Systems* — measurement, profiling, and “measure first” culture |
| Stanford | CS161 *Design and Analysis of Algorithms* — complexity; CS149 / parallel systems notes — when data layout and memory dominate |
| Harvard | CS50 / CS61 conceptual modules on runtime and memory; Harvard Extension *Data Science* modules on sampling and benchmarking hygiene |
| GitHub | `python/cpython` (`time.perf_counter`, `cProfile`); `pyutils` / `scalene-profiler/scalene`; entity-resolution blocking notes in `dedupeio/dedupe` (candidate pair reduction) |
| Video | PyCon talks on high-performance Python (e.g. *PyPy / profiling* sessions); *“Using cProfile”* tutorials; Maria Santos / SciPy talks on vectorization trade-offs; “High Performance Python” book companion material |

## Section map (titles/subtopics)

1. **Mapa** — Rendimiento del triage (CP-N3-C escala): mismo resultado + reporte antes/después  
2. **S37-T1-A** wall/CPU y memory profiling  
3. **S37-T1-B** benchmark fixture, warmup y variabilidad  
4. **S37-T2-A** complejidad y blocking (O(n²) pairs)  
5. **S37-T2-B** estructuras, vectorización y reducción de candidatos  
6. **S37-T3-A** dtypes, chunking y columnar  
7. **S37-T3-B** caching, invalidación y out-of-core  
8. **S37-T4-A** performance budget y tests  
9. **S37-T4-B** costo total, claridad y no microoptimización  

## Coverage gaps

- One-line theory; empty starters; micro-instructions.  
- Must retheme legacy dbt/BigQuery id to profiling of N3 path without teaching unreleased cloud APIs.  
- Progressive disclosure: no S38-only DLQ/runbook as exercise dependency (S38 is later in reverse walk but may exist in course order — exercises may use only concepts introduced by S37 and prior; pools/async detailed in S38 so avoid requiring them here).

## Expansion plan

1. Theory ≥3 paras ≥180 chars with CASO-LIM-037.  
2. 24 weDo ≥150 chars + fixtures + pass outputs.  
3. Starters with one defect (wrong median, inverted budget, etc.).  
4. `S37_DONE.md` before/after kb.
