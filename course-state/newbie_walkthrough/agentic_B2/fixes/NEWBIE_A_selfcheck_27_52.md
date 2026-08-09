# NEWBIE_A (Explorer) — selfcheck sections 27–52

- **agent:** `newbie_a_live`
- **persona:** `explorer`
- **attempt_id:** `agentic_B2`
- **method:** `llm_packet_only_no_generator`
- **source:** `quiz_batch_27_39.json` + `quiz_batch_40_52.json` (theory + iDo + stems only)
- **forbidden honored:** no solutions, no `correctIndex`, no other attempts' keys, no TypeScript
- **justification prefix:** `B2-Explorer:`
- **exercises:** left unchanged (selfcheck-only pass)

## Summary

| Metric | Value |
|--------|------:|
| Sections | 26 (27–52) |
| Stems answered | 104 (4 × 26) |
| Selfcheck `blocked_on` | 0 |
| Files updated | `section_XX/newbie_a_live.json` → field `selfcheck` |
| Confidence band | 0.92–0.97 |

## Chosen indices (Explorer)

| Sec | Title (short) | Q0 | Q1 | Q2 | Q3 |
|----:|---------------|---:|---:|---:|---:|
| 27 | Estrategia de pruebas con pytest | 1 | 1 | 1 | 2 |
| 28 | Pruebas de datos, propiedades e integració | 1 | 1 | 1 | 1 |
| 29 | SQL avanzado y modelado relacional | 1 | 1 | 1 | 1 |
| 30 | Entity resolution probabilístico | 2 | 1 | 2 | 1 |
| 31 | Grafos y evidencia relacional | 2 | 1 | 1 | 2 |
| 32 | Feature engineering y pipelines sin leakag | 1 | 1 | 1 | 1 |
| 33 | ML supervisado y baselines responsables | 1 | 1 | 1 | 1 |
| 34 | Métricas, desbalance, calibración y umbral | 1 | 1 | 1 | 1 |
| 35 | Explicabilidad, equidad e incertidumbre | 1 | 1 | 1 | 1 |
| 36 | Clustering, anomalías y validación tempora | 1 | 1 | 1 | 1 |
| 37 | Profiling, algoritmos y rendimiento | 1 | 1 | 1 | 1 |
| 38 | Concurrencia, observabilidad y workflows r | 1 | 1 | 1 | 1 |
| 39 | Responsible ML Case Triage y cierre de niv | 1 | 1 | 1 | 1 |
| 40 | Arquitectura, DDD y decisiones técnicas | 0 | 0 | 1 | 2 |
| 41 | APIs con FastAPI y contratos HTTP | 0 | 0 | 1 | 2 |
| 42 | Schemas, seguridad y privacidad de servici | 0 | 0 | 1 | 2 |
| 43 | Contenedores y reproducibilidad operativa | 0 | 0 | 1 | 2 |
| 44 | CI/CD y seguridad de la cadena de suminist | 0 | 0 | 1 | 2 |
| 45 | Cloud, almacenamiento, colas e infraestruc | 0 | 0 | 1 | 2 |
| 46 | Ingeniería de datos y orquestación de prod | 0 | 0 | 1 | 2 |
| 47 | MLOps: experimentos, registro y serving | 0 | 0 | 1 | 2 |
| 48 | LLM applications y RAG con evidencia | 0 | 0 | 1 | 2 |
| 49 | Agentes, herramientas y context engineerin | 0 | 0 | 1 | 2 |
| 50 | Evals, red teaming y fiabilidad de IA | 0 | 0 | 1 | 2 |
| 51 | Observabilidad, gobernanza y UX del copilo | 0 | 0 | 1 | 2 |
| 52 | Enterprise Relationship & Operations Intel | 0 | 0 | 1 | 2 |

## Per-section rationale (packet anchors)

### S27 — Estrategia de pruebas con pytest
- Anchors: pirámide unitarias; oráculo determinista; mutante casefold; contratos ER no fraude
- **Q0→1** `Pruebas unitarias`
- **Q1→1** `Una fuente de verdad determinista para el assert`
- **Q2→1** `El contrato es débil; el mutante sobrevivió`
- **Q3→2** `Contratos de misma entidad / normalización — no riesgo ni relación`
- artifact: `section_27/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S28 — Pruebas de datos, propiedades e integración
- Anchors: metamórfico; golden drift; sobre-mocking; flakes+determinismo
- **Q0→1** `Relaciones predecibles entre entradas transformadas y salidas`
- **Q1→1** `Riesgo de ocultar regresiones`
- **Q2→1** `Acoplar el test a detalles internos y ocultar bugs`
- **Q3→1** `Con determinismo (seed/reloj/sort) y fallo de job si persisten`
- artifact: `section_28/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S29 — SQL avanzado y modelado relacional
- Anchors: entity_a<entity_b; append-only; atómicas; repository :memory:
- **Q0→1** `Evitar duplicar el mismo par en orden invertido`
- **Q1→1** `Nueva fila por cambio de decisión`
- **Q2→1** `Ser atómicas en la misma transacción lógica`
- **Q3→1** `Encapsula acceso a datos y facilita tests con :memory:`
- artifact: `section_29/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S30 — Entity resolution probabilístico
- Anchors: misma entidad; candidate recall; clerical review; split entidad
- **Q0→2** `Si dos registros son la misma entidad`
- **Q1→1** `Fracción de verdaderos matches que sobreviven al blocking`
- **Q2→2** `clerical review`
- **Q3→1** `Leakage de identidad entre train y test`
- artifact: `section_30/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S31 — Grafos y evidencia relacional
- Anchors: centralidad≠culpa; provenance; detalle+agregado; shared phone hecho
- **Q0→2** `Posición estructural que requiere contexto, no culpa`
- **Q1→1** `Auditar source/record_id del hecho relacional`
- **Q2→1** `Conservar detalle o punteros además del agregado`
- **Q3→2** `Un hecho de contacto compartido a investigar con evidencia, no veredic`
- artifact: `section_31/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S32 — Feature engineering y pipelines sin leakage
- Anchors: fit train; reviewer_decision leakage; [t-W,t); overlap 0 entidades
- **Q0→1** `Train`
- **Q1→1** `Leakage de decisión`
- **Q2→1** `Eventos con ts>=t`
- **Q3→1** `Overlap 0 de entidades`
- artifact: `section_32/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S33 — ML supervisado y baselines responsables
- Anchors: needs_review; conserva regla; coef≠causa; valid no train_acc
- **Q0→1** `needs_review u objetivo de cola`
- **Q1→1** `Conserva regla y no vendas humo`
- **Q2→1** `Asociación en el modelo, no causa legal`
- **Q3→1** `Riesgo de overfit; usa valid`
- artifact: `section_33/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S34 — Métricas, desbalance, calibración y umbrales
- Anchors: priorizar review; precision@k; resample in-fold; abstención humana
- **Q0→1** `Priorizar revisión con evidencia y ranking`
- **Q1→1** `Calidad del ranking bajo capacidad k`
- **Q2→1** `Solo dentro del train de cada fold`
- **Q3→1** `Enviar banda gris a humano`
- artifact: `section_34/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S35 — Explicabilidad, equidad e incertidumbre
- Anchors: 4 capas ficha; perm=sensibilidad; OOD abstener; out_of_scope fraude
- **Q0→1** `Evidencia, modelo, incertidumbre y decisión humana`
- **Q1→1** `Sensibilidad del modelo a barajar features`
- **Q2→1** `Abstener y escalar`
- **Q3→1** `Usos prohibidos p.ej. etiqueta de fraude`
- artifact: `section_35/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S36 — Clustering, anomalías y validación temporal
- Anchors: anomalía=señal; contamination=hipótesis; PCA exploratorio; @k+humano
- **Q0→1** `Señal de rareza a revisar`
- **Q1→1** `Hipótesis de fracción rara a flaggear`
- **Q2→1** `Exploración/visualización prudente`
- **Q3→1** `precision@k y feedback humano`
- artifact: `section_36/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S37 — Profiling, algoritmos y rendimiento
- Anchors: warmup; blocking O(n²); budget falla CI; no micro-teatro
- **Q0→1** `Estabilizar benches descartando cold start`
- **Q1→1** `Pares candidatos O(n²)`
- **Q2→1** `Falla si se rompe el límite acordado`
- **Q3→1** `Teatro; prioriza claridad y algos`
- artifact: `section_37/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S38 — Concurrencia, observabilidad y workflows resilientes
- Anchors: procesos CPU; backpressure; idempotencia; redactar PII
- **Q0→1** `Procesos`
- **Q1→1** `Colas infinitas y OOM`
- **Q2→1** `Reejecutar sin side effects duplicados`
- **Q3→1** `Redactar PII y correlacionar`
- artifact: `section_38/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S39 — Responsible ML Case Triage y cierre de nivel
- Anchors: label needs_review; CF-3 documentado; evidence packet; human_only
- **Q0→1** `needs_review / prioridad de cola`
- **Q1→1** `Se documentan; PASS lo califica otra lane`
- **Q2→1** `Evidencia y path además del score`
- **Q3→1** `human_only / rollback`
- artifact: `section_39/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S40 — Arquitectura, DDD y decisiones técnicas
- Platform id: `agentic-architecture`; gate: `CP-N4-A (inicio)`; synthetic data; ER=misma entidad
- **Q0→0** `agentic-architecture`
- **Q1→0** `CP-N4-A (inicio)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_40/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S41 — APIs con FastAPI y contratos HTTP
- Platform id: `llm-finetuning`; gate: `CP-N4-A (servicio)`; synthetic data; ER=misma entidad
- **Q0→0** `llm-finetuning`
- **Q1→0** `CP-N4-A (servicio)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_41/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S42 — Schemas, seguridad y privacidad de servicios
- Platform id: `graph-rag`; gate: `CP-N4-A (control plane)`; synthetic data; ER=misma entidad
- **Q0→0** `graph-rag`
- **Q1→0** `CP-N4-A (control plane)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_42/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S43 — Contenedores y reproducibilidad operativa
- Platform id: `llmops`; gate: `CP-N4-A (cierre)`; synthetic data; ER=misma entidad
- **Q0→0** `llmops`
- **Q1→0** `CP-N4-A (cierre)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_43/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S44 — CI/CD y seguridad de la cadena de suministro
- Platform id: `multimodal`; gate: `CP-N4-B (inicio)`; synthetic data; ER=misma entidad
- **Q0→0** `multimodal`
- **Q1→0** `CP-N4-B (inicio)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_44/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S45 — Cloud, almacenamiento, colas e infraestructura
- Platform id: `iac`; gate: `CP-N4-B (arquitectura)`; synthetic data; ER=misma entidad
- **Q0→0** `iac`
- **Q1→0** `CP-N4-B (arquitectura)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_45/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S46 — Ingeniería de datos y orquestación de producción
- Platform id: `gpu-computing`; gate: `CP-N4-B (pipeline)`; synthetic data; ER=misma entidad
- **Q0→0** `gpu-computing`
- **Q1→0** `CP-N4-B (pipeline)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_46/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S47 — MLOps: experimentos, registro y serving
- Platform id: `opensource`; gate: `CP-N4-B (cierre) + CF-4`; synthetic data; ER=misma entidad
- **Q0→0** `opensource`
- **Q1→0** `CP-N4-B (cierre) + CF-4`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_47/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S48 — LLM applications y RAG con evidencia
- Platform id: `ai-governance`; gate: `CP-N4-C (inicio)`; synthetic data; ER=misma entidad
- **Q0→0** `ai-governance`
- **Q1→0** `CP-N4-C (inicio)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_48/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S49 — Agentes, herramientas y context engineering
- Platform id: `data-contracts`; gate: `CP-N4-C (tools)`; synthetic data; ER=misma entidad
- **Q0→0** `data-contracts`
- **Q1→0** `CP-N4-C (tools)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_49/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S50 — Evals, red teaming y fiabilidad de IA
- Platform id: `tech-leadership`; gate: `CP-N4-C (quality gate)`; synthetic data; ER=misma entidad
- **Q0→0** `tech-leadership`
- **Q1→0** `CP-N4-C (quality gate)`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_50/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S51 — Observabilidad, gobernanza y UX del copiloto
- Platform id: `integrator-final`; gate: `CP-N4-C (cierre) + CF-5 + Level-4 regression`; synthetic data; ER=misma entidad
- **Q0→0** `integrator-final`
- **Q1→0** `CP-N4-C (cierre) + CF-5 + Level-4 regression`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_51/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

### S52 — Enterprise Relationship & Operations Intelligence Platform: capstone final
- Platform id: `career-strategy`; gate: `CP-FINAL exclusivamente`; synthetic data; ER=misma entidad
- **Q0→0** `career-strategy`
- **Q1→0** `CP-FINAL exclusivamente`
- **Q2→1** `Datos sintéticos`
- **Q3→2** `Misma entidad cuando aplique`
- artifact: `section_52/newbie_a_live.json` → `selfcheck` (exercises kept, n=24)

## Integrity checks

- All justifications start with `B2-Explorer:`.
- Quiz batch JSON keys on stems: `question`, `options` only (no answer keys).
- Exercises arrays untouched.
- recorded pass at 2026-07-22T02:00:13.396366+00:00

