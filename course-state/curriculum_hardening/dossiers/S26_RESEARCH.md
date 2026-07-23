# Research dossier — S26 Orquestación y VP RPA + AI Analyst

**Section file:** `s26-integrator-phase1.ts`  
**Title:** Orquestación y VP RPA + AI Analyst  
**Residual:** STUB (avg_para≈88, avg_instr≈45, starters min≈7)  
**Target:** gold vs S01/S02 pedagogy + CP-N2-C / CF-2 integrator contracts  

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *Google Cloud Data Engineering* / *Automating Real-World Tasks with Python* (Google) — orchestration, retries, operational SLOs; *IBM AI Engineering* modules on human-in-the-loop review of model outputs |
| MIT | MIT OpenCourseWare *Software Construction* / *System Design* themes — DAG dependencies, idempotent operations, failure isolation (DLQ as poison-message pattern) |
| Stanford | CS244B / distributed systems primers — exactly-once vs at-least-once, compensation/saga-style rollback when ACID is unavailable |
| Harvard | CS50 Web / systems notes — scheduling, rate limits, audit trails as first-class product requirements |
| Yale | SOM / operations management primers — runbooks, escalation ladders, on-call SLOs for automated workflows |
| GitHub | Apache Airflow DAG patterns; Prefect/Temporal task orchestration samples; `dead-letter-queue` patterns in message-bus examples; OpenTelemetry span metadata for run_id/git_sha |
| Video | *Designing Data-Intensive Applications* talks on orchestration; Temporal/Airflow conference talks on checkpoints, retries, human approval gates |

## Coverage gaps in current stub
- Theory paragraphs are 1–2 sentence slogans (avg ~88 chars); need operational contracts (inputs, outputs, errors, promotion criteria) and synthetic Peru cases (Lima ops desk, America/Lima schedules).
- weDo instructions ultra-short (~45 chars); need CASO-PE fixtures, exact pass strings, adverse paths (DLQ owner, unapproved send = P0).
- Starters often bare `# TODO` without fixture scaffolding.
- Ethics: matching/scores/IA assist **never** auto-label fraud; human approval before draft email is mandatory.

## Expansion plan
1. Deepen each of 9 theory blocks to ≥3 paragraphs (≥180 chars) with Peru synthetic case + contracts.
2. Expand 24 weDo instructions to ≥150 chars with domain predicates and exact outputs.
3. Enrich starters with fixtures + one defect; keep progressive disclosure (only S01…S26 APIs/patterns).
4. Preserve TypeScript indices, solution outputs, selfCheck, and no later-only APIs (no Temporal/Airflow imports required in exercises).
