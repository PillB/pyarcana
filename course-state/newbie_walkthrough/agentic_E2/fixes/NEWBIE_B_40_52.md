# Newbie B (Skeptic) — agentic_E2 sections 40–52

**Agent:** Newbie B · persona `skeptic`  
**Attempt:** `agentic_E2`  
**Method:** `live_agentic_packet_only_no_execution`  
**Artifact origin:** `direct_agent_output`  
**Restart from:** `landing` · **code_execution_used:** false  
**Scope:** `exercise_batch_40_52.json` + per-section `quiz_card.json`  
**Forbidden honored:** no agentic_E1 lives, no D1/D2, no solutions/correctIndex, no TS.

---
## 1. Mission

Independent Skeptic live solve of **S40–S52** from packets only.

| Metric | Value |
|--------|------:|
| Sections | 13 |
| Exercises | 312 |
| Selfcheck items | 52 |
| Offline SC grade | 100% all sections |

## 2. Skeptic approach

1. **Exercises:** fix inverted `meets_contract`/`assess` using instruction domain rules; complete TODO/`forma esperada` prints; synthesize E2/E3 fail-closed routes from sibling E1 when starter empty.

2. **Selfcheck:** theory/iDo anchors + anti-fraud/parentesco/PII penalties; justifications ≥80 chars tagged `[E2-Skeptic live packet walk]`; `question_index` required.

3. **Privacy:** ER = same-entity; triage = needs_review; no auto fraud/parentesco labels.

## 3. Per-section fill summary

| Sec | Title | packet_sha | Ex | SC | SC% | agent_instance_id |
|----:|-------|------------|---:|---:|----:|-------------------|
| 40 | Arquitectura, DDD y decisiones técnicas | `ed5e6493245bb7f8` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s40-live` |
| 41 | APIs con FastAPI y contratos HTTP | `10704fa35be5e843` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s41-live` |
| 42 | Schemas, seguridad y privacidad de servi | `93b177a844e593bc` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s42-live` |
| 43 | Contenedores y reproducibilidad operativ | `a94c58728e1bc959` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s43-live` |
| 44 | CI/CD y seguridad de la cadena de sumini | `d855866c60f41db0` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s44-live` |
| 45 | Cloud, almacenamiento, colas e infraestr | `c95d2786702fb237` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s45-live` |
| 46 | Ingeniería de datos y orquestación de pr | `7545b9e7cdaa742a` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s46-live` |
| 47 | MLOps: experimentos, registro y serving | `0cfe281a467074e4` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s47-live` |
| 48 | LLM applications y RAG con evidencia | `61a21f5ec27d0d59` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s48-live` |
| 49 | Agentes, herramientas y context engineer | `2864233a4f8e529b` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s49-live` |
| 50 | Evals, red teaming y fiabilidad de IA | `8b3a1203a154a6bf` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s50-live` |
| 51 | Observabilidad, gobernanza y UX del copi | `c89a65abd3621d96` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s51-live` |
| 52 | Enterprise Relationship & Operations Int | `27ccf9109ffd9c11` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s52-live` |

## 4. Selfcheck index choices (Skeptic)

| Sec | Q indices → chosen |
|----:|--------------------|
| 40 | Q0→3:escenario QA completo con umbral y… · Q1→1:emitir BLOCK_ARCHITECTURE y conser… · Q2→2:cada flujo cruza fronteras explíci… · Q3→0:mantenerlo sintético, mínimo, traz… |
| 41 | Q0→0:matriz método/recurso/status proba… · Q1→2:emitir REJECT_REQUEST y conservar … · Q2→3:crear el mismo job con la misma cl… · Q3→1:mantenerlo sintético, mínimo, traz… |
| 42 | Q0→1:schema exportado y fixtures válido… · Q1→3:emitir DENY y conservar evidencia · Q2→0:un actor nunca lee otro caso y un … · Q3→2:mantenerlo sintético, mínimo, traz… |
| 43 | Q0→2:dos builds producen el mismo diges… · Q1→0:emitir BLOCK_IMAGE y conservar evi… · Q2→1:build repetible, usuario no root, … · Q3→3:mantenerlo sintético, mínimo, traz… |
| 44 | Q0→3:lint/types/tests y matriz soportad… · Q1→1:emitir STOP_PIPELINE y conservar e… · Q2→2:el pipeline reproduce el artefacto… · Q3→0:mantenerlo sintético, mínimo, traz… |
| 45 | Q0→0:ADR de persistencia con fuente de … · Q1→2:emitir SEND_TO_DLQ y conservar evi… · Q2→3:reintentos no duplican resultados … · Q3→1:mantenerlo sintético, mínimo, traz… |
| 46 | Q0→1:fixtures en hora/desorden/tardío c… · Q1→3:emitir QUARANTINE_PARTITION y cons… · Q2→0:backfill y retry producen el mismo… · Q3→2:mantenerlo sintético, mínimo, traz… |
| 47 | Q0→2:rerun dentro de tolerancia declara… · Q1→0:emitir ROLLBACK_MODEL y conservar … · Q2→1:solo gates aprobados promueven y u… · Q3→3:mantenerlo sintético, mínimo, traz… |
| 48 | Q0→3:ranking reproducible con versión d… · Q1→1:emitir ABSTAIN y conservar evidenc… · Q2→2:retrieval y respuesta superan umbr… · Q3→0:mantenerlo sintético, mínimo, traz… |
| 49 | Q0→0:ADR workflow/agente con baseline · Q1→2:emitir STOP_AGENT y conservar evid… · Q2→3:cada tool es idempotente, el agent… · Q3→1:mantenerlo sintético, mínimo, traz… |
| 50 | Q0→1:dataset versionado y rúbrica calib… · Q1→3:emitir BLOCK_CANDIDATE y conservar… · Q2→0:evals retenidos y adversariales so… · Q3→2:mantenerlo sintético, mínimo, traz… |
| 51 | Q0→2:trace reconstruible sin PII · Q1→0:emitir ROLLBACK_COPILOT y conserva… · Q2→1:se puede reconstruir qué respondió… · Q3→3:mantenerlo sintético, mínimo, traz… |
| 52 | Q0→3:matriz stakeholder/job/métrica con… · Q1→1:emitir NO_GO_RELEASE y conservar e… · Q2→2:52/52, 12/12 capstones, CP-FINAL y… · Q3→0:mantenerlo sintético, mínimo, traz… |

## 5. Hard spots

| Area | Issue | Resolution |
|------|-------|------------|
| Inverted E1 predicates | `meets_contract` encodes failure | Domain-correct predicate from instruction |
| Empty E2/E3 starters | no starterCode | Sibling E1 + MISSING/CONTINUE tokens |
| TODO / forma esperada | missing print | Apply referencia line or instruction |
| Multi-line S39 checklists | secrets_in_repo polarity | Explicit `is False` in all([...]) |
| Selfcheck rebalance | option order ≠ prior attempts | Packet corpus + anchor phrases |

## 6. Provenance

- attempt_id=`agentic_E2`
- method=`live_agentic_packet_only_no_execution`
- artifact_origin=`direct_agent_output`
- restart_from=`landing`
- code_execution_used=`false`
- persona=`skeptic`
- agent_instance_id pattern=`newbie-b-skeptic-E2-sXX-live`
- Independent of Newbie A and of agentic_E1 lives.


_Recorded 2026-07-23T04:40:59.337243+00:00_
