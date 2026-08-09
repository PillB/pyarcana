# NEWBIE_A 40–52 — agentic_D1 (Explorer)

**Agent:** newbie_a_live · persona=explorer  
**Attempt:** agentic_D1  
**Method:** llm_packet_only_no_generator  
**Production note:** live_dual_llm_agentic_from_packet_only_D1  
**Knowledge boundary:** Only `exercise_batch_40_52.json` / section `quiz_card.json` (no solutions, correctIndex, other attempts, rebuild templates).

## Approach

- Read each section packet: theory headings, iDo demo intents, exercise instructions/hints/starterCode, selfCheck stems.
- **E1 (guided):** replace the defective `meets_contract` boolean so the valid fixture yields `PASS` under the taught rule (comparison direction, positive invariants, max vs min ranking, etc.).
- **E2 (independent):** three-route `assess()` → `PASS` / reject token / `MISSING:<field>`; missing checked before domain fields.
- **E3 (transfer):** closed-fail `decide()` → `CONTINUE` / reject / escalate action (absence ≠ breach).
- **SelfCheck:** explorer greedy option scoring against theory/iDo tokens; justifications ≥80 chars quoting packet evidence language.
- Natural `justification_from_packet` for every exercise (≥80 chars), grounded in instruction + theory snippet + hints.

## Per-section results

| Section | Title | Exercises | SelfCheck choices | Smoke OK | Just min (ex/sc) |
|---|---|---:|---|---:|---|
| S40 | Arquitectura, DDD y decisiones técnicas | 24 | `[3, 1, 2, 0]` | 24/24 | 601/335 |
| S41 | APIs con FastAPI y contratos HTTP | 24 | `[0, 2, 3, 1]` | 24/24 | 609/335 |
| S42 | Schemas, seguridad y privacidad de servicios | 24 | `[1, 3, 0, 2]` | 24/24 | 607/335 |
| S43 | Contenedores y reproducibilidad operativa | 24 | `[2, 0, 1, 3]` | 24/24 | 609/343 |
| S44 | CI/CD y seguridad de la cadena de suministro | 24 | `[3, 1, 2, 0]` | 24/24 | 612/348 |
| S45 | Cloud, almacenamiento, colas e infraestructura | 24 | `[0, 2, 3, 1]` | 24/24 | 610/336 |
| S46 | Ingeniería de datos y orquestación de producción | 24 | `[1, 3, 0, 2]` | 24/24 | 605/335 |
| S47 | MLOps: experimentos, registro y serving | 24 | `[2, 0, 1, 3]` | 24/24 | 608/335 |
| S48 | LLM applications y RAG con evidencia | 24 | `[3, 1, 2, 0]` | 24/24 | 609/332 |
| S49 | Agentes, herramientas y context engineering | 24 | `[0, 2, 3, 1]` | 24/24 | 613/323 |
| S50 | Evals, red teaming y fiabilidad de IA | 24 | `[1, 3, 0, 2]` | 24/24 | 610/335 |
| S51 | Observabilidad, gobernanza y UX del copiloto | 24 | `[2, 0, 1, 3]` | 24/24 | 608/327 |
| S52 | Enterprise Relationship & Operations Intelligence Platform: capstone final | 24 | `[3, 1, 2, 0]` | 24/24 | 610/338 |

## SelfCheck chosen texts (explorer)

- **S40:** [3] escenario QA completo con umbral y dueño · [1] emitir BLOCK_ARCHITECTURE y conservar ev · [2] cada flujo cruza fronteras explícitas y  · [0] mantenerlo sintético, mínimo, trazable y
- **S41:** [0] matriz método/recurso/status probada · [2] emitir REJECT_REQUEST y conservar eviden · [3] crear el mismo job con la misma clave no · [1] mantenerlo sintético, mínimo, trazable y
- **S42:** [1] schema exportado y fixtures válidos/invá · [3] emitir DENY y conservar evidencia · [0] un actor nunca lee otro caso y un dato r · [2] mantenerlo sintético, mínimo, trazable y
- **S43:** [2] dos builds producen el mismo digest lógi · [0] emitir BLOCK_IMAGE y conservar evidencia · [1] build repetible, usuario no root, límite · [3] mantenerlo sintético, mínimo, trazable y
- **S44:** [3] lint/types/tests y matriz soportada en v · [1] emitir STOP_PIPELINE y conservar evidenc · [2] el pipeline reproduce el artefacto, exig · [0] mantenerlo sintético, mínimo, trazable y
- **S45:** [0] ADR de persistencia con fuente de verdad · [2] emitir SEND_TO_DLQ y conservar evidencia · [3] reintentos no duplican resultados y cost · [1] mantenerlo sintético, mínimo, trazable y
- **S46:** [1] fixtures en hora/desorden/tardío con res · [3] emitir QUARANTINE_PARTITION y conservar  · [0] backfill y retry producen el mismo resul · [2] mantenerlo sintético, mínimo, trazable y
- **S47:** [2] rerun dentro de tolerancia declarada · [0] emitir ROLLBACK_MODEL y conservar eviden · [1] solo gates aprobados promueven y una ver · [3] mantenerlo sintético, mínimo, trazable y
- **S48:** [3] ranking reproducible con versión de embe · [1] emitir ABSTAIN y conservar evidencia · [2] retrieval y respuesta superan umbrales s · [0] mantenerlo sintético, mínimo, trazable y
- **S49:** [0] ADR workflow/agente con baseline · [2] emitir STOP_AGENT y conservar evidencia · [3] cada tool es idempotente, el agente se d · [1] mantenerlo sintético, mínimo, trazable y
- **S50:** [1] dataset versionado y rúbrica calibrada · [3] emitir BLOCK_CANDIDATE y conservar evide · [0] evals retenidos y adversariales son repe · [2] mantenerlo sintético, mínimo, trazable y
- **S51:** [2] trace reconstruible sin PII · [0] emitir ROLLBACK_COPILOT y conservar evid · [1] se puede reconstruir qué respondió, qué  · [3] mantenerlo sintético, mínimo, trazable y
- **S52:** [3] matriz stakeholder/job/métrica con evide · [1] emitir NO_GO_RELEASE y conservar evidenc · [2] 52/52, 12/12 capstones, CP-FINAL y regre · [0] mantenerlo sintético, mínimo, trazable y

## Smoke-exec failures (if any)

- None — all 312 exercise codes executed without exception; every E2/E3 triple route yields PASS/CONTINUE → reject → MISSING/escalate.

## Artifacts

- `course-state/newbie_walkthrough/agentic_D1/section_XX/newbie_a_live.json` for XX=40..52
- This report: `course-state/newbie_walkthrough/agentic_D1/fixes/NEWBIE_A_40_52.md`

## Isolation checklist

- [x] Did not read other attempts, solutions, correctIndex, or rebuild templates
- [x] Meta fields match dual-LLM D1 contract
- [x] All 13 sections completed (40–52)
- [x] Justifications ≥80 characters for all exercises and selfcheck items
