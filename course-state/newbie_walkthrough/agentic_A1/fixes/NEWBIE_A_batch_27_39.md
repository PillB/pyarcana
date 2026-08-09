# Newbie A (Explorer) — Selfcheck batch S27–S39

**Agent:** Newbie Subagent A · persona `explorer`  
**Attempt:** `agentic_A1`  
**Method:** `llm_packet_only_no_generator`  
**Source of stems:** `quiz_batch_27_39.json` (READ ONLY)  
**Source of answers:** theory + iDo in that batch / section packets only  
**Forbidden honored:** no solutions, no `correctIndex`, no attempt_007b keys, no TypeScript sources, no generator scripts  

---

## Summary

| Metric | Value |
|--------|------:|
| Sections | 13 (27–39) |
| Stems answered | 52 (4 × 13) |
| Selfcheck `blocked_on` | 0 |
| Files updated | `section_XX/newbie_a_live.json` → field `selfcheck` |
| Confidence band | 0.91–0.95 |

All stems answered with `justification_from_packet` quoting theory headings and/or iDo demos.

---

## Chosen indices (Explorer)

| Sec | Title (short) | Q0 | Q1 | Q2 | Q3 |
|----:|---------------|---:|---:|---:|---:|
| 27 | pytest strategy | 1 | 1 | 1 | 2 |
| 28 | data/property/integration tests | 1 | 1 | 1 | 1 |
| 29 | SQL / relational ER store | 1 | 1 | 1 | 1 |
| 30 | probabilistic ER | 2 | 1 | 2 | 1 |
| 31 | graphs & relational evidence | 2 | 1 | 1 | 2 |
| 32 | features without leakage | 1 | 1 | 1 | 1 |
| 33 | supervised baselines | 1 | 1 | 1 | 1 |
| 34 | metrics / thresholds | 1 | 1 | 1 | 1 |
| 35 | explainability / fairness | 1 | 1 | 1 | 1 |
| 36 | clustering / anomalies | 1 | 1 | 1 | 1 |
| 37 | profiling / performance | 1 | 1 | 1 | 1 |
| 38 | concurrency / resilience | 1 | 1 | 1 | 1 |
| 39 | Responsible ML Case Triage close | 1 | 1 | 1 | 1 |

---

## Per-section rationale (packet anchors)

### S27 — Estrategia de pruebas con pytest
- **Q0→1 unitarias:** pirámide «muchas pruebas unitarias baratas»; iDo S27-T1-B `top_layer` unit.
- **Q1→1 oráculo determinista:** «fuente de verdad del assert»; S27-T2-A oráculo fijo.
- **Q2→1 mutante sobrevivió:** mutación conceptual; si no falla el test es débil / iDo casefold mutant.
- **Q3→2 contratos ER:** matching = normalización/misma entidad; no fraude ni parentesco.

### S28 — Pruebas de datos, propiedades e integración
- **Q0→1 metamórfico:** relación predecible tras transformar input (padding/simetría).
- **Q1→1 golden drift:** reconcile sin aprobación oculta regresiones; drift visible.
- **Q2→1 sobre-mocking:** acopla a internos y oculta bugs; preferir contratos de borde.
- **Q3→1 flakes:** seed/reloj/sort + fallar job; determinismo de gate.

### S29 — SQL avanzado y modelado relacional
- **Q0→1 entity_a < entity_b:** evita par invertido; S29-T1-B-DEMO.
- **Q1→1 append-only:** nueva fila versionada; no UPDATE in-place de label.
- **Q2→1 atómicas:** decisión + evidencia en misma transacción (ACID / ROLLBACK demo).
- **Q3→1 repository:** encapsula SQL; tests con sqlite `:memory:`.

### S30 — Entity resolution probabilístico
- **Q0→2 misma entidad:** ER solo «¿misma entidad?» — no fraude/parentesco.
- **Q1→1 candidate recall:** fracción de matches gold que pasan blocking.
- **Q2→2 clerical review:** t_low..t_high → review.
- **Q3→1 split entidad:** evita leakage de identidad train/test.

### S31 — Grafos y evidencia relacional
- **Q0→2 estructura no culpa:** centralidad = métrica estructural + disclaimer.
- **Q1→1 provenance:** source/run_id/record_id auditan arista.
- **Q2→1 detalle + agregado:** multigrafo; punteros a record_id.
- **Q3→2 shared phone:** hecho de contacto a investigar, no veredicto.

### S32 — Feature engineering sin leakage
- **Q0→1 fit en train:** scaler/imputer solo train; nunca stats de test.
- **Q1→1 reviewer_decision:** leakage de decisión (checklist iDo).
- **Q2→1 ventana [t-W,t):** excluye ts ≥ t / futuro.
- **Q3→1 overlap 0:** split por entity_id sin solape.

### S33 — ML supervisado y baselines
- **Q0→1 needs_review:** target de cola, no fraud_auto.
- **Q1→1 conserva regla:** si ML no gana a regla/dummy, no desplegar.
- **Q2→1 asociación no causa:** coeficientes ≠ prueba causal/legal.
- **Q3→1 valid no train_acc:** train_acc alto → overfit; usar valid.

### S34 — Métricas, desbalance, calibración
- **Q0→1 priorizar revisión:** workbench ranking + evidencia; no fraud=true.
- **Q1→1 precision@k:** calidad bajo capacidad k.
- **Q2→1 resampling en train fold:** no antes del split ni en test.
- **Q3→1 abstención:** banda gris → humano.

### S35 — Explicabilidad, equidad e incertidumbre
- **Q0→1 cuatro capas:** evidencia | modelo | incertidumbre | decisión humana.
- **Q1→1 perm importance:** sensibilidad al barajar features.
- **Q2→1 OOD:** abstener y escalar.
- **Q3→1 out_of_scope:** usos prohibidos (p.ej. etiqueta fraude).

### S36 — Clustering, anomalías, validación temporal
- **Q0→1 señal de rareza:** anomalía ≠ fraude probado.
- **Q1→1 contamination:** hipótesis de fracción rara, no prevalencia de fraude.
- **Q2→1 PCA exploración:** no modelo de decisión final.
- **Q3→1 labels escasos:** precision@k + feedback humano.

### S37 — Profiling y rendimiento
- **Q0→1 warmup:** descarta cold start.
- **Q1→1 blocking:** reduce pares O(n²).
- **Q2→1 budget CI:** falla si se rompe límite.
- **Q3→1 anti-teatro:** micro-opt 2% sin medición; claridad primero.

### S38 — Concurrencia y workflows resilientes
- **Q0→1 procesos:** CPU-bound + GIL → processes.
- **Q1→1 backpressure:** evita colas infinitas / OOM.
- **Q2→1 idempotencia:** reejecutar sin side effects duplicados.
- **Q3→1 logs:** redactar PII + correlation_id.

### S39 — Responsible ML Case Triage (cierre N3)
- **Q0→1 label_space cola:** needs_review / prioridad; sin auto-fraude.
- **Q1→1 CF-3 documentado:** esta lane no marca PASS; otra lane califica.
- **Q2→1 evidence packet:** hechos + path + features + incertidumbre, no solo score.
- **Q3→1 incidente:** human_only / rollback de model-thr.

---

## Artifact checklist

- [x] `section_27` … `section_39` / `newbie_a_live.json` → `selfcheck` length 4
- [x] `attempt_id`: `agentic_A1`
- [x] `method`: `llm_packet_only_no_generator`
- [x] `persona`: `explorer`
- [x] Every stem has `chosen_index`, `chosen_text`, `confidence`, empty `blocked_on`, non-empty `justification_from_packet`
- [x] This report: `fixes/NEWBIE_A_batch_27_39.md`

## Notes for validator / Fixer

- Explorer always picks a packet-supported option (no skeptic-style blocks).
- Justifications are Spanish/English mixed only where packet is mixed; lexical anchors include headings and demo ids (Sxx-Ty-*-DEMO).
- Offline keys were **not** consulted; fairness scoring is external to this subagent.
- Exercises in these live files were pre-scaffolded; this batch only filled **selfcheck**.
