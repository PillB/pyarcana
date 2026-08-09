# NEWBIE_A (Explorer) — agentic_E1 sections 40–52

- **agent:** `newbie_a_live`
- **persona:** explorer
- **attempt_id:** `agentic_E1`
- **method:** `live_agentic_packet_only_no_execution`
- **artifact_origin:** `direct_agent_output`
- **restart_from:** `landing`
- **code_execution_used:** `false`
- **agent_instance_id pattern:** `newbie-a-explorer-E1-sXX-live`
- **source (read-only):** `exercise_batch_40_52.json` / per-section `quiz_card.json`
- **forbidden honored:** no D1/D2, no solutions/correctIndex/TS, no other attempts
- **knowledge_boundary:** landing + prior + active packet content

## Summary

| Sec | Title | Exercises | Selfcheck indices | packet_sha |
|-----|-------|-----------|-------------------|------------|
| 40 | Arquitectura, DDD y decisiones técnicas | 24 | [3, 1, 2, 0] | `ed5e6493245bb7f8` |
| 41 | APIs con FastAPI y contratos HTTP | 24 | [0, 2, 3, 1] | `10704fa35be5e843` |
| 42 | Schemas, seguridad y privacidad de servici | 24 | [1, 3, 0, 2] | `93b177a844e593bc` |
| 43 | Contenedores y reproducibilidad operativa | 24 | [2, 0, 1, 3] | `a94c58728e1bc959` |
| 44 | CI/CD y seguridad de la cadena de suminist | 24 | [3, 1, 2, 0] | `d855866c60f41db0` |
| 45 | Cloud, almacenamiento, colas e infraestruc | 24 | [0, 2, 3, 1] | `c95d2786702fb237` |
| 46 | Ingeniería de datos y orquestación de prod | 24 | [1, 3, 0, 2] | `7545b9e7cdaa742a` |
| 47 | MLOps: experimentos, registro y serving | 24 | [2, 0, 1, 3] | `0cfe281a467074e4` |
| 48 | LLM applications y RAG con evidencia | 24 | [3, 1, 2, 0] | `61a21f5ec27d0d59` |
| 49 | Agentes, herramientas y context engineerin | 24 | [0, 2, 3, 1] | `2864233a4f8e529b` |
| 50 | Evals, red teaming y fiabilidad de IA | 24 | [1, 3, 0, 2] | `8b3a1203a154a6bf` |
| 51 | Observabilidad, gobernanza y UX del copilo | 24 | [2, 0, 1, 3] | `c89a65abd3621d96` |
| 52 | Enterprise Relationship & Operations Intel | 24 | [3, 1, 2, 0] | `27ccf9109ffd9c11` |

## Per-section selfcheck (packet-grounded)

### S40 — Arquitectura, DDD y decisiones técnicas

- Q0: **[3]** escenario QA completo con umbral y dueño
- Q1: **[1]** emitir BLOCK_ARCHITECTURE y conservar evidencia
- Q2: **[2]** cada flujo cruza fronteras explícitas y cada trade-off 
- Q3: **[0]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_40/newbie_a_live.json`

### S41 — APIs con FastAPI y contratos HTTP

- Q0: **[0]** matriz método/recurso/status probada
- Q1: **[2]** emitir REJECT_REQUEST y conservar evidencia
- Q2: **[3]** crear el mismo job con la misma clave no duplica efecto
- Q3: **[1]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_41/newbie_a_live.json`

### S42 — Schemas, seguridad y privacidad de servicios

- Q0: **[1]** schema exportado y fixtures válidos/inválidos
- Q1: **[3]** emitir DENY y conservar evidencia
- Q2: **[0]** un actor nunca lee otro caso y un dato redactado no rea
- Q3: **[2]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_42/newbie_a_live.json`

### S43 — Contenedores y reproducibilidad operativa

- Q0: **[2]** dos builds producen el mismo digest lógico
- Q1: **[0]** emitir BLOCK_IMAGE y conservar evidencia
- Q2: **[1]** build repetible, usuario no root, límites de recursos y
- Q3: **[3]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_43/newbie_a_live.json`

### S44 — CI/CD y seguridad de la cadena de suministro

- Q0: **[3]** lint/types/tests y matriz soportada en verde
- Q1: **[1]** emitir STOP_PIPELINE y conservar evidencia
- Q2: **[2]** el pipeline reproduce el artefacto, exige aprobación y 
- Q3: **[0]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_44/newbie_a_live.json`

### S45 — Cloud, almacenamiento, colas e infraestructura

- Q0: **[0]** ADR de persistencia con fuente de verdad
- Q1: **[2]** emitir SEND_TO_DLQ y conservar evidencia
- Q2: **[3]** reintentos no duplican resultados y costo, IAM, backup 
- Q3: **[1]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_45/newbie_a_live.json`

### S46 — Ingeniería de datos y orquestación de producción

- Q0: **[1]** fixtures en hora/desorden/tardío con resultado esperado
- Q1: **[3]** emitir QUARANTINE_PARTITION y conservar evidencia
- Q2: **[0]** backfill y retry producen el mismo resultado, registran
- Q3: **[2]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_46/newbie_a_live.json`

### S47 — MLOps: experimentos, registro y serving

- Q0: **[2]** rerun dentro de tolerancia declarada
- Q1: **[0]** emitir ROLLBACK_MODEL y conservar evidencia
- Q2: **[1]** solo gates aprobados promueven y una versión previa pue
- Q3: **[3]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_47/newbie_a_live.json`

### S48 — LLM applications y RAG con evidencia

- Q0: **[3]** ranking reproducible con versión de embedding
- Q1: **[1]** emitir ABSTAIN y conservar evidencia
- Q2: **[2]** retrieval y respuesta superan umbrales separados; toda 
- Q3: **[0]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_48/newbie_a_live.json`

### S49 — Agentes, herramientas y context engineering

- Q0: **[0]** ADR workflow/agente con baseline
- Q1: **[2]** emitir STOP_AGENT y conservar evidencia
- Q2: **[3]** cada tool es idempotente, el agente se detiene y una pe
- Q3: **[1]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_49/newbie_a_live.json`

### S50 — Evals, red teaming y fiabilidad de IA

- Q0: **[1]** dataset versionado y rúbrica calibrada
- Q1: **[3]** emitir BLOCK_CANDIDATE y conservar evidencia
- Q2: **[0]** evals retenidos y adversariales son repetibles y prueba
- Q3: **[2]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_50/newbie_a_live.json`

### S51 — Observabilidad, gobernanza y UX del copiloto

- Q0: **[2]** trace reconstruible sin PII
- Q1: **[0]** emitir ROLLBACK_COPILOT y conservar evidencia
- Q2: **[1]** se puede reconstruir qué respondió, qué citó, qué tool 
- Q3: **[3]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_51/newbie_a_live.json`

### S52 — Enterprise Relationship & Operations Intelligence Platform: capstone final

- Q0: **[3]** matriz stakeholder/job/métrica con evidencia
- Q1: **[1]** emitir NO_GO_RELEASE y conservar evidencia
- Q2: **[2]** 52/52, 12/12 capstones, CP-FINAL y regresión completa p
- Q3: **[0]** mantenerlo sintético, mínimo, trazable y sujeto a revis
- Artifact: `section_52/newbie_a_live.json`

## Exercise strategy

For each topic (T1-A…T4-B): E1 rewrites defective `meets_contract` so the valid starter prints PASS (usually `not (defective_expr)`; tighter domain predicates where negation is too weak). E2: `assess` with MISSING-first then PASS/REJECT on válido/adverso/incomplete. E3: closed-loop `decide` with CONTINUE / breach / uncertainty codes from the instruction. Explorer justifications cite instruction + hints (≥80 chars).

## Verification

- post-write smoke: ok=312 issues=0 (verification only; meta keeps `code_execution_used=false`)

Recorded at: 2026-07-23T04:18:22.644407+00:00
