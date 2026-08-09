# Newbie B (Skeptic) — agentic_E2 sections 27–39

**Agent:** Newbie B · persona `skeptic`  
**Attempt:** `agentic_E2`  
**Method:** `live_agentic_packet_only_no_execution`  
**Artifact origin:** `direct_agent_output`  
**Restart from:** `landing` · **code_execution_used:** false  
**Scope:** `exercise_batch_27_39.json` + per-section `quiz_card.json`  
**Forbidden honored:** no agentic_E1 lives, no D1/D2, no solutions/correctIndex, no TS.

---
## 1. Mission

Independent Skeptic live solve of **S27–S39** from packets only.

| Metric | Value |
|--------|------:|
| Sections | 13 |
| Exercises | 312 |
| Selfcheck items | 56 |
| Offline SC grade | 100% all sections |

## 2. Skeptic approach

1. **Exercises:** fix inverted `meets_contract`/`assess` using instruction domain rules; complete TODO/`forma esperada` prints; synthesize E2/E3 fail-closed routes from sibling E1 when starter empty.

2. **Selfcheck:** theory/iDo anchors + anti-fraud/parentesco/PII penalties; justifications ≥80 chars tagged `[E2-Skeptic live packet walk]`; `question_index` required.

3. **Privacy:** ER = same-entity; triage = needs_review; no auto fraud/parentesco labels.

## 3. Per-section fill summary

| Sec | Title | packet_sha | Ex | SC | SC% | agent_instance_id |
|----:|-------|------------|---:|---:|----:|-------------------|
| 27 | Estrategia de pruebas con pytest | `effa396a740261f6` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s27-live` |
| 28 | Pruebas de datos, propiedades e integrac | `827050d249512742` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s28-live` |
| 29 | SQL avanzado y modelado relacional | `298a66f05c46a228` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s29-live` |
| 30 | Entity resolution probabilístico | `a47a68249e6c41a8` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s30-live` |
| 31 | Grafos y evidencia relacional | `a9458715256e6ce4` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s31-live` |
| 32 | Feature engineering y pipelines sin leak | `a164fd7487359385` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s32-live` |
| 33 | ML supervisado y baselines responsables | `0db82e9b54fc554f` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s33-live` |
| 34 | Métricas, desbalance, calibración y umbr | `cbcfca0849bec7b8` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s34-live` |
| 35 | Explicabilidad, equidad e incertidumbre | `852e8d1bc73f4048` | 24 | 4 | 100 | `newbie-b-skeptic-E2-s35-live` |
| 36 | Clustering, anomalías y validación tempo | `39d119976f07d841` | 24 | 5 | 100 | `newbie-b-skeptic-E2-s36-live` |
| 37 | Profiling, algoritmos y rendimiento | `81a7eec15cd3e2f0` | 24 | 5 | 100 | `newbie-b-skeptic-E2-s37-live` |
| 38 | Concurrencia, observabilidad y workflows | `032cea4b2716013f` | 24 | 5 | 100 | `newbie-b-skeptic-E2-s38-live` |
| 39 | Responsible ML Case Triage y cierre de n | `92753e3551164bb0` | 24 | 5 | 100 | `newbie-b-skeptic-E2-s39-live` |

## 4. Selfcheck index choices (Skeptic)

| Sec | Q indices → chosen |
|----:|--------------------|
| 27 | Q0→2:Pruebas unitarias · Q1→0:Una fuente de verdad determinista … · Q2→1:El contrato es débil; el mutante s… · Q3→3:Contratos de misma entidad / norma… |
| 28 | Q0→3:Relaciones predecibles entre entra… · Q1→1:Riesgo de ocultar regresiones · Q2→2:Acoplar el test a detalles interno… · Q3→0:Con determinismo (seed/reloj/sort)… |
| 29 | Q0→0:Evitar duplicar el mismo par en or… · Q1→2:Nueva fila por cambio de decisión · Q2→3:Ser atómicas en la misma transacci… · Q3→1:Encapsula acceso a datos y facilit… |
| 30 | Q0→1:Si dos registros son la misma enti… · Q1→3:Fracción de verdaderos matches que… · Q2→0:clerical review · Q3→2:Leakage de identidad entre train y… |
| 31 | Q0→2:Posición estructural que requiere … · Q1→0:Auditar source/record_id del hecho… · Q2→1:Conservar detalle o punteros ademá… · Q3→3:Un hecho de contacto compartido a … |
| 32 | Q0→3:El instante t y el futuro · Q1→1:Fallar de forma explícita · Q2→2:Es leakage de identidad · Q3→0:Es red flag de leakage |
| 33 | Q0→0:Ser needs_review con horizonte · Q1→2:Dummy/regla y costos · Q2→3:Features scaled y causal=False · Q3→1:Leakage de la misma entidad entre … |
| 34 | Q0→1:Precision/recall o PR-AUC de la co… · Q1→3:Introduce leakage y métricas infla… · Q2→0:En un set de calibración fuera de … · Q3→2:Abstener según política |
| 35 | Q0→2:Evidencia, modelo, incertidumbre y… · Q1→0:Sensibilidad del modelo a barajar … · Q2→1:Abstener y escalar · Q3→3:Usos prohibidos p.ej. etiqueta de … |
| 36 | Q0→3:Señal de rareza a revisar · Q1→1:Hipótesis de fracción rara a flagg… · Q2→2:Exploración/visualización prudente · Q3→0:precision@k y feedback humano · Q4→3:Leakage temporal |
| 37 | Q0→0:Estabilizar benches descartando co… · Q1→2:Pares candidatos O(n²) · Q2→3:Falla si se rompe el límite acorda… · Q3→1:Teatro; prioriza claridad y algos · Q4→0:No es comparable entre cambios de … |
| 38 | Q0→1:Procesos · Q1→3:Colas infinitas y OOM · Q2→0:Reejecutar sin side effects duplic… · Q3→2:Redactar PII y correlacionar · Q4→1:Hang de workers y cola bloqueada |
| 39 | Q0→2:needs_review / prioridad de cola · Q1→0:Se documentan; PASS lo califica ot… · Q2→1:Evidencia y path además del score · Q3→3:human_only / rollback a artefacto … · Q4→2:Bump major, owner contactable y re… |

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


_Recorded 2026-07-23T04:40:59.307751+00:00_
