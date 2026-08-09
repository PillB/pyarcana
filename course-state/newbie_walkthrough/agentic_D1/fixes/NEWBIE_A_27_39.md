# Newbie A (Explorer) — exercises + selfcheck batch S27–S39

**Agent:** `newbie_a_live` · persona **explorer**  
**Attempt:** `agentic_D1`  
**Method:** `llm_packet_only_no_generator`  
**Production note:** `live_dual_llm_agentic_from_packet_only_D1`  
**Source allowed:** `agentic_D1/exercise_batch_27_39.json` + per-section `quiz_card.json` (theory/iDo/stems/starters only)  
**Forbidden honored:** yes — no solutions, correctIndex, other attempts, or rebuild templates  
**Recorded at:** 2026-07-23T03:44:03.821996+00:00  

---

## Scope

Filled `exercises` + `selfcheck` on:

| Section | Title | Exercises | Selfcheck | Path |
|--------:|-------|----------:|----------:|------|
| 27 | Estrategia de pruebas con pytest | 24 | 4 | `section_27/newbie_a_live.json` |
| 28 | Pruebas de datos, propiedades e integración | 24 | 4 | `section_28/newbie_a_live.json` |
| 29 | SQL avanzado y modelado relacional | 24 | 4 | `section_29/newbie_a_live.json` |
| 30 | Entity resolution probabilístico | 24 | 4 | `section_30/newbie_a_live.json` |
| 31 | Grafos y evidencia relacional | 24 | 4 | `section_31/newbie_a_live.json` |
| 32 | Feature engineering y pipelines sin leakage | 24 | 4 | `section_32/newbie_a_live.json` |
| 33 | ML supervisado y baselines responsables | 24 | 4 | `section_33/newbie_a_live.json` |
| 34 | Métricas, desbalance, calibración y umbrales | 24 | 4 | `section_34/newbie_a_live.json` |
| 35 | Explicabilidad, equidad e incertidumbre | 24 | 4 | `section_35/newbie_a_live.json` |
| 36 | Clustering, anomalías y validación temporal | 24 | 5 | `section_36/newbie_a_live.json` |
| 37 | Profiling, algoritmos y rendimiento | 24 | 5 | `section_37/newbie_a_live.json` |
| 38 | Concurrencia, observabilidad y workflows resilientes | 24 | 5 | `section_38/newbie_a_live.json` |
| 39 | Responsible ML Case Triage y cierre de nivel | 24 | 5 | `section_39/newbie_a_live.json` |

## Answer shape

### Selfcheck
Each item: `{question_index, chosen_index, chosen_text, confidence, blocked_on: [], justification_from_packet}` 
with natural ≥80-char justification quoting theory headings/paragraphs from the active packet.

### Exercises
Each item: `{exercise_id, answer, code, confidence, blocked_on: [], concepts_used, justification_from_packet}`. 
Code completes starter TODOs / inverted contract predicates / DEFECTO fixtures from the instruction + forma esperada / theory-aligned predicates. 
Justifications reference theory block for the topic (T1–T4 × A/B) and keep fixtures intact.

## Selfcheck choices (Explorer, packet-reasoned)

### S27 — Estrategia de pruebas con pytest
- Q0: **[2]** Pruebas unitarias
- Q1: **[0]** Una fuente de verdad determinista para el assert
- Q2: **[1]** El contrato es débil; el mutante sobrevivió
- Q3: **[3]** Contratos de misma entidad / normalización — no riesgo ni relación

### S28 — Pruebas de datos, propiedades e integración
- Q0: **[3]** Relaciones predecibles entre entradas transformadas y salidas
- Q1: **[1]** Riesgo de ocultar regresiones
- Q2: **[2]** Acoplar el test a detalles internos y ocultar bugs
- Q3: **[0]** Con determinismo (seed/reloj/sort) y fallo de job si persisten

### S29 — SQL avanzado y modelado relacional
- Q0: **[0]** Evitar duplicar el mismo par en orden invertido
- Q1: **[2]** Nueva fila por cambio de decisión
- Q2: **[3]** Ser atómicas en la misma transacción lógica
- Q3: **[1]** Encapsula acceso a datos y facilita tests con :memory:

### S30 — Entity resolution probabilístico
- Q0: **[1]** Si dos registros son la misma entidad
- Q1: **[3]** Fracción de verdaderos matches que sobreviven al blocking
- Q2: **[0]** clerical review
- Q3: **[2]** Leakage de identidad entre train y test

### S31 — Grafos y evidencia relacional
- Q0: **[2]** Posición estructural que requiere contexto, no culpa
- Q1: **[0]** Auditar source/record_id del hecho relacional
- Q2: **[1]** Conservar detalle o punteros además del agregado
- Q3: **[3]** Un hecho de contacto compartido a investigar con evidencia, no veredicto

### S32 — Feature engineering y pipelines sin leakage
- Q0: **[1]** El instante t y el futuro
- Q1: **[1]** Fallar de forma explícita
- Q2: **[1]** Es leakage de identidad
- Q3: **[1]** Es red flag de leakage

### S33 — ML supervisado y baselines responsables
- Q0: **[1]** Ser needs_review con horizonte
- Q1: **[1]** Dummy/regla y costos
- Q2: **[1]** Features scaled y causal=False
- Q3: **[1]** Leakage de la misma entidad entre folds

### S34 — Métricas, desbalance, calibración y umbrales
- Q0: **[1]** Precision/recall o PR-AUC de la cola
- Q1: **[1]** Introduce leakage y métricas infladas
- Q2: **[2]** En un set de calibración fuera de muestra
- Q3: **[2]** Abstener según política

### S35 — Explicabilidad, equidad e incertidumbre
- Q0: **[2]** Evidencia, modelo, incertidumbre y decisión humana
- Q1: **[0]** Sensibilidad del modelo a barajar features
- Q2: **[1]** Abstener y escalar
- Q3: **[3]** Usos prohibidos p.ej. etiqueta de fraude

### S36 — Clustering, anomalías y validación temporal
- Q0: **[3]** Señal de rareza a revisar
- Q1: **[1]** Hipótesis de fracción rara a flaggear
- Q2: **[2]** Exploración/visualización prudente
- Q3: **[0]** precision@k y feedback humano
- Q4: **[2]** Leakage temporal

### S37 — Profiling, algoritmos y rendimiento
- Q0: **[0]** Estabilizar benches descartando cold start
- Q1: **[2]** Pares candidatos O(n²)
- Q2: **[3]** Falla si se rompe el límite acordado
- Q3: **[1]** Teatro; prioriza claridad y algos
- Q4: **[1]** No es comparable entre cambios de dataset

### S38 — Concurrencia, observabilidad y workflows resilientes
- Q0: **[1]** Procesos
- Q1: **[3]** Colas infinitas y OOM
- Q2: **[0]** Reejecutar sin side effects duplicados
- Q3: **[2]** Redactar PII y correlacionar
- Q4: **[1]** Hang de workers y cola bloqueada

### S39 — Responsible ML Case Triage y cierre de nivel
- Q0: **[2]** needs_review / prioridad de cola
- Q1: **[0]** Se documentan; PASS lo califica otra lane
- Q2: **[1]** Evidencia y path además del score
- Q3: **[3]** human_only / rollback a artefacto previo
- Q4: **[1]** Bump major, owner contactable y revalidación de paths

## Exercise completion strategy

- **S27–S30, S36–S38 (forma esperada / defect lines):** complete contractual `print(...)` from starter reference comments; repair residual sqlite/tempfile/union-find and concurrency defects (CPU→processes, I/O→async_or_threads, token bucket rate=2, exponential backoff, etc.).
- **S31 (graph):** keep computation scaffold; add missing primary contractual prints (n_nodes, top hub, pair, path, redaction, decide, …).
- **S32–S35 (inverted contracts):** flip defective `meets_contract` / `PASS if` / `CONTINUE if` predicates; map missing fields to `REQUEST_*` tokens named in the instruction; for empty starters (packet gaps), synthesize E2/E3 from sibling fixtures + instruction tokens.
- **S39 (DEFECTO pipeline/release):** restore fail-closed predicates for stages (`intake→…→queue`), ownership/semver major-on-breaking, evidence packet, human override, release checklist, ops modes, acceptance, cards, value metrics, and blameless postmortem.

## Integrity checks run

- Sections written: 13 (27–39 inclusive)
- Total exercises: 312
- Total selfcheck: 56
- Every `justification_from_packet` ≥ 80 chars
- No residual `TODO` in codes
- All 312 exercise codes exec-clean under a shared namespace (side-channel only; pass bar remains agentic justification)
- Meta on every live: attempt_id=agentic_D1, method=llm_packet_only_no_generator, production_note=live_dual_llm_agentic_from_packet_only_D1, persona=explorer

## Checklist

- [x] All section `newbie_a_live.json` files updated for 27–39
- [x] `exercises` length 24 per section
- [x] `selfcheck` length matches stems (4 or 5)
- [x] `justification_from_packet` ≥ 80 chars on every item
- [x] Meta: attempt_id=agentic_D1, method=llm_packet_only_no_generator, production_note=live_dual_llm_agentic_from_packet_only_D1, persona=explorer
- [x] No correctIndex / other-attempt solutions consulted
