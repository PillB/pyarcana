# S38 DONE — Concurrencia, observabilidad y workflows resilientes

**File:** `src/lib/course/sections/s38-performance-extreme.ts`  
**Export:** `section38` · **index:** 38 · **id:** `performance-extreme` (conservado)

## Before → after (knowledge base)

| Metric | Before (stub) | After (gold pass) |
|--------|---------------|-------------------|
| File size | ~33.7 KB / 1259 lines | ~58 KB / ~1362 lines |
| Theory paragraphs | 1-line slogans (~40–80 chars) | ≥3 paras/heading, min ≥222 chars, ES-PE |
| Operational contracts | Absent | Entrada/salida/error/criterio per subtopic (S40 style, phase-2 ops) |
| weDo instructions | 2–4 words | ≥194 chars; fixture CASO-LIM-038; pass/output contract |
| starterCode | `# TODO` empty | Fixture + one clear defect (wrong bound, inverted SLO, etc.) |
| solutionCode | print-only oracles | Aligned with fixed contract; same outputs as prior where possible |
| iDo why/description | Ultra-short | Contract-linked demos, no live network |
| selfCheck | 4 Q, thin explanations | 5 Q, explanations operational |
| Synthetic / privacy | Mentioned lightly | CASO-LIM-038, redact, pii_raw=False enforced in exercises |
| Future APIs | N/A risk | No S39+ responsible-ML / agent APIs |

## Pedagogy coverage

- T1 Concurrencia: threads/processes/async + GIL/serialización  
- T2 Control: pools/backpressure/rate limit + timeout/recursos  
- T3 O11y: logs/metrics/traces + redacción/SLI/SLO/error budget  
- T4 Resiliencia: checkpoint/idempotencia + retry/DLQ/runbook  

## Research

See `S38_RESEARCH.md` (Coursera SRE/Cloud, MIT 6.824, Stanford CS110, Harvard CS61, GitHub OTel/cpython, PyCon asyncio + SRE videos).

## Residual risks

- Demo outputs with timing are avoided in weDo; theory code still uses static expected outputs for `perf_counter`-free snippets.  
- Token-bucket is didactic (no refill clock); students may over-generalize to production libraries.  
- Idempotency store is in-memory dict metaphor — not a durable DB lesson (ok for S38 scope).  
- Seed/exam bank in prisma may still mirror older short stems until Phase 5 refresh.
