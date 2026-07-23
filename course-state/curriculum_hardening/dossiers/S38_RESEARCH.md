# Research dossier — S38 Concurrencia, observabilidad y workflows resilientes

**Section file:** `s38-performance-extreme.ts`  
**Platform id (conservado):** `performance-extreme`  
**Residual:** STUB (avg_para≈70, avg_instr≈20, starters vacíos)  
**Target:** gold vs S01/S02 pedagogy + S40 operational-contract style (phase-appropriate: operación CP-N3-C, no DDD de S40+)

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *Cloud Computing Specialization* (University of Illinois / Coursera) — concurrency models, distributed reliability patterns; *Google Cloud Site Reliability Engineering* / DevOps courses — SLI/SLO, error budgets, on-call runbooks |
| MIT | MIT 6.824 *Distributed Systems* (OpenCourseWare + lecture notes) — fault tolerance, replication, and retry semantics; *Performance Engineering of Software Systems* (6.172) concepts on measurement before optimization |
| Stanford | CS110 *Principles of Computer Systems* — threads, processes, concurrency bugs; CS244 *Advanced Topics in Networking* / systems seminars on backpressure and rate limiting |
| Harvard | CS61 *Systems Programming and Machine Organization* (Harvard) — process/thread model and resource cleanup; Harvard CS50 Web (conceptual) on timeouts and request lifecycle |
| GitHub | `python/cpython` (`concurrent.futures`, `asyncio`); `open-telemetry/opentelemetry-python`; `Netflix/Hystrix` (legacy circuit-breaker ideas); `resilience4j/resilience4j` patterns translated didactically to Python dicts/queues |
| Video | *AsyncIO: The Complete Walkthrough* (PyCon talks, e.g. Łukasz Langa); Google SRE YouTube “SLOs & Error Budgets”; Maria Naggaga / Microsoft Build sessions on durable workflows; “Designing Data-Intensive Applications” companion talks on idempotency |

## Section map (titles/subtopics)

1. **Mapa** — Operación del triage (CP-N3-C): pipeline reanudable, trace por caso, métricas de cola  
2. **S38-T1-A** threads/processes/async — elegir por bottleneck (I/O API, CPU features)  
3. **S38-T1-B** I/O vs CPU, GIL y serialización — cost of IPC/payloads  
4. **S38-T2-A** pools, backpressure y rate limits — TokenBucket + queue maxsize  
5. **S38-T2-B** cancelación, timeout y recursos — fail path + finally  
6. **S38-T3-A** logs, metrics y traces — correlation_id, sin PII raw  
7. **S38-T3-B** correlation, redacción y SLI/SLO — error budget  
8. **S38-T4-A** states, checkpoint e idempotencia — resume without duplicate side effects  
9. **S38-T4-B** retry, dead-letter, replay y runbook — poison messages

## Coverage gaps in current stub

- Theory paragraphs are 1-line slogans; need ≥3 paragraphs (≥180 chars) with why, operational contract, CASO-PE synthetic case.  
- weDo instructions are 2–4 words; need ≥150 chars with fixture id, I/O contract, exact pass token.  
- starterCode is `# TODO` empty; need fixture + one clear defect.  
- selfCheck explanations ultra-thin; strengthen without changing correctIndex.  
- Must not introduce S39+ responsible-ML gate APIs; stay on concurrency/o11y/resilience.

## Progressive disclosure

Allowed: stdlib (`json`, `time`, dicts, lists), concepts from S27 async/concurrency overview, S12/S37 measurement language, logging patterns without full OTel SDK.  
Forbidden in exercises: agent frameworks (S40+), finetuning, cloud deploy IaC (S45), real PII, live network calls.

## Expansion plan

1. Deepen 9 theory blocks to ≥3 paragraphs (~200–350 chars) ES-PE + callouts.  
2. Enrich iDo demos (descriptions/why) without non-deterministic timing asserts where avoidable.  
3. Expand 24 weDo to contract-style with `CASO-LIM-038-*` fixtures and `S38-T*-* PASS` tokens.  
4. Starters: inverted predicate / wrong binding / missing redact.  
5. Write `S38_DONE.md` with before/after knowledge base.
