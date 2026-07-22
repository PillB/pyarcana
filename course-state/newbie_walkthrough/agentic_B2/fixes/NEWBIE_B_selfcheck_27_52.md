# Newbie B (Skeptic) — Selfcheck S27–S52

- **Agent:** `newbie_b_live` · persona **skeptic**
- **attempt_id:** `agentic_B2`
- **method:** `llm_packet_only_no_generator`
- **persona:** skeptic
- **Source:** progressive packet theory/iDo via quiz_batch content (no solutions / correctIndex / other attempts' answers / TypeScript)
- **Note:** `agentic_B2/quiz_batch_27_39.json` and `quiz_batch_40_52.json` were absent at write time; stems grounded from same progressive packets (A1 batch mirror) + local `section_XX/packet.json` map text.
- **Boundary:** answers grounded in active section card text; zero Python outside packets for reasoning
- **Justification prefix:** `B2-Skeptic:`
- **recorded:** 2026-07-22T01:59:30Z

## Protocol

- Answered **all** selfCheck stems (no `blocked_on`).
- Justifications start with `B2-Skeptic:` and quote card/theory (or iDo for S29 pair order).
- Updated field only: `section_XX/newbie_b_live.json` → `selfcheck` (exercises kept).
- `attempt_id=agentic_B2`, `method=llm_packet_only_no_generator`, `persona=skeptic`.

## Summary

| Section | Title | n_stems | All answered | blocked |
|---------|-------|---------|--------------|---------|
| S27 | Estrategia de pruebas con pytest | 4 | yes | 0 |
| S28 | Pruebas de datos, propiedades e integración | 4 | yes | 0 |
| S29 | SQL avanzado y modelado relacional | 4 | yes | 0 |
| S30 | Entity resolution probabilístico | 4 | yes | 0 |
| S31 | Grafos y evidencia relacional | 4 | yes | 0 |
| S32 | Feature engineering y pipelines sin leakage | 4 | yes | 0 |
| S33 | ML supervisado y baselines responsables | 4 | yes | 0 |
| S34 | Métricas, desbalance, calibración y umbrales | 4 | yes | 0 |
| S35 | Explicabilidad, equidad e incertidumbre | 4 | yes | 0 |
| S36 | Clustering, anomalías y validación temporal | 4 | yes | 0 |
| S37 | Profiling, algoritmos y rendimiento | 4 | yes | 0 |
| S38 | Concurrencia, observabilidad y workflows resilientes | 4 | yes | 0 |
| S39 | Responsible ML Case Triage y cierre de nivel | 4 | yes | 0 |
| S40 | Arquitectura, DDD y decisiones técnicas | 4 | yes | 0 |
| S41 | APIs con FastAPI y contratos HTTP | 4 | yes | 0 |
| S42 | Schemas, seguridad y privacidad de servicios | 4 | yes | 0 |
| S43 | Contenedores y reproducibilidad operativa | 4 | yes | 0 |
| S44 | CI/CD y seguridad de la cadena de suministro | 4 | yes | 0 |
| S45 | Cloud, almacenamiento, colas e infraestructura | 4 | yes | 0 |
| S46 | Ingeniería de datos y orquestación de producción | 4 | yes | 0 |
| S47 | MLOps: experimentos, registro y serving | 4 | yes | 0 |
| S48 | LLM applications y RAG con evidencia | 4 | yes | 0 |
| S49 | Agentes, herramientas y context engineering | 4 | yes | 0 |
| S50 | Evals, red teaming y fiabilidad de IA | 4 | yes | 0 |
| S51 | Observabilidad, gobernanza y UX del copiloto | 4 | yes | 0 |
| S52 | Enterprise Relationship & Operations Intelligence Platform: capstone final | 4 | yes | 0 |

**Totals:** 104 stems · 0 selfcheck blocks · all justifications prefix `B2-Skeptic:`.

## Answer key (Skeptic choices)

### S27–S39 (content-specific)

| Sec | Q0 | Q1 | Q2 | Q3 |
|-----|----|----|----|-----|
| S27 | [1] Pruebas unitarias | [1] Una fuente de verdad determinista para el  | [1] El contrato es débil; el mutante sobrevivi | [2] Contratos de misma entidad / normalización |
| S28 | [1] Relaciones predecibles entre entradas tran | [1] Riesgo de ocultar regresiones | [1] Acoplar el test a detalles internos y ocul | [1] Con determinismo (seed/reloj/sort) y fallo |
| S29 | [1] Evitar duplicar el mismo par en orden inve | [1] Nueva fila por cambio de decisión | [1] Ser atómicas en la misma transacción lógic | [1] Encapsula acceso a datos y facilita tests  |
| S30 | [2] Si dos registros son la misma entidad | [1] Fracción de verdaderos matches que sobrevi | [2] clerical review | [1] Leakage de identidad entre train y test |
| S31 | [2] Posición estructural que requiere contexto | [1] Auditar source/record_id del hecho relacio | [1] Conservar detalle o punteros además del ag | [2] Un hecho de contacto compartido a investig |
| S32 | [1] Train | [1] Leakage de decisión | [1] Eventos con ts>=t | [1] Overlap 0 de entidades |
| S33 | [1] needs_review u objetivo de cola | [1] Conserva regla y no vendas humo | [1] Asociación en el modelo, no causa legal | [1] Riesgo de overfit; usa valid |
| S34 | [1] Priorizar revisión con evidencia y ranking | [1] Calidad del ranking bajo capacidad k | [1] Solo dentro del train de cada fold | [1] Enviar banda gris a humano |
| S35 | [1] Evidencia, modelo, incertidumbre y decisió | [1] Sensibilidad del modelo a barajar features | [1] Abstener y escalar | [1] Usos prohibidos p.ej. etiqueta de fraude |
| S36 | [1] Señal de rareza a revisar | [1] Hipótesis de fracción rara a flaggear | [1] Exploración/visualización prudente | [1] precision@k y feedback humano |
| S37 | [1] Estabilizar benches descartando cold start | [1] Pares candidatos O(n²) | [1] Falla si se rompe el límite acordado | [1] Teatro; prioriza claridad y algos |
| S38 | [1] Procesos | [1] Colas infinitas y OOM | [1] Reejecutar sin side effects duplicados | [1] Redactar PII y correlacionar |
| S39 | [1] needs_review / prioridad de cola | [1] Se documentan; PASS lo califica otra lane | [1] Evidencia y path además del score | [1] human_only / rollback |

### S40–S52 (platform map family)

| Sec | Title | Q0 platform | Q1 gate | Q2 data | Q3 ER |
|-----|-------|-------------|---------|--------|-------|
| S40 | Arquitectura, DDD y decisiones técnicas | [0] `agentic-architecture` | [0] `CP-N4-A (inicio)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S41 | APIs con FastAPI y contratos HTTP | [0] `llm-finetuning` | [0] `CP-N4-A (servicio)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S42 | Schemas, seguridad y privacidad de servi | [0] `graph-rag` | [0] `CP-N4-A (control plane)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S43 | Contenedores y reproducibilidad operativ | [0] `llmops` | [0] `CP-N4-A (cierre)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S44 | CI/CD y seguridad de la cadena de sumini | [0] `multimodal` | [0] `CP-N4-B (inicio)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S45 | Cloud, almacenamiento, colas e infraestr | [0] `iac` | [0] `CP-N4-B (arquitectura)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S46 | Ingeniería de datos y orquestación de pr | [0] `gpu-computing` | [0] `CP-N4-B (pipeline)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S47 | MLOps: experimentos, registro y serving | [0] `opensource` | [0] `CP-N4-B (cierre) + CF-4` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S48 | LLM applications y RAG con evidencia | [0] `ai-governance` | [0] `CP-N4-C (inicio)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S49 | Agentes, herramientas y context engineer | [0] `data-contracts` | [0] `CP-N4-C (tools)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S50 | Evals, red teaming y fiabilidad de IA | [0] `tech-leadership` | [0] `CP-N4-C (quality gate)` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S51 | Observabilidad, gobernanza y UX del copi | [0] `integrator-final` | [0] `CP-N4-C (cierre) + CF-5 + Level-4 regression` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |
| S52 | Enterprise Relationship & Operations Int | [0] `career-strategy` | [0] `CP-FINAL exclusivamente` | [1] `Datos sintéticos` | [2] `Misma entidad cuando aplique` |

## Per-stem answers (Skeptic)

### S27 — Estrategia de pruebas con pytest

**Q0.** En la pirámide de pruebas, la base más ancha suele ser:
- **chosen_index:** `1` → Pruebas unitarias
- **confidence:** 0.93
- **justification:** B2-Skeptic: card/theory «riesgos y pirámide de pruebas»: «La pirámide prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E». La base más ancha son unitarias; rechazo E2E UI, solo manual y load en prod (invierten o vacían la pirámide).

**Q1.** Un oráculo confiable es:
- **chosen_index:** `1` → Una fuente de verdad determinista para el assert
- **confidence:** 0.92
- **justification:** B2-Skeptic: card «Arrange–Act–Assert y oráculos confiables»: «Un oráculo es la fuente de verdad del assert: valor fijo conocido, propiedad invariante o resultado de un algoritmo de referencia simple». Print, reloj sin fijar y orden de set son oráculos frágiles — no deterministas.

**Q2.** Si mutas un casefold y ningún test falla:
- **chosen_index:** `1` → El contrato es débil; el mutante sobrevivió
- **confidence:** 0.94
- **justification:** B2-Skeptic: card «mutación conceptual, fallas útiles y mantenimiento»: «cambia deliberadamente el código (quita un strip, invierte un umbral) y verifica que algún test falle. Si no falla, el test es débil». Mutar casefold sin fallo = mutante sobrevivió / contrato débil.

**Q3.** Las pruebas de matching en CP-N3-A demuestran:
- **chosen_index:** `2` → Contratos de misma entidad / normalización — no riesgo ni relación
- **confidence:** 0.93
- **justification:** B2-Skeptic: mapa CP-N3-A: convertir supuestos de normalización y matching en contratos de prueba; «Privacidad: las pruebas no etiquetan fraude ni parentesco». Matching demuestra contratos de misma entidad/normalización — no fraude, parentescos ni envío de correos.

### S28 — Pruebas de datos, propiedades e integración

**Q0.** Un test metamórfico verifica:
- **chosen_index:** `1` → Relaciones predecibles entre entradas transformadas y salidas
- **confidence:** 0.92
- **justification:** B2-Skeptic: card de propiedades/metamórficos: tests metamórficos transforman el input de forma que la relación de salida sea predecible. Verifican relaciones entre entradas transformadas y salidas — no un número mágico ni fraude.

**Q1.** Actualizar un golden con drift sin review es:
- **chosen_index:** `1` → Riesgo de ocultar regresiones
- **confidence:** 0.93
- **justification:** B2-Skeptic: card «golden datasets, drift y reconciliación»: reconciliar/actualizar golden solo con review y nota de cambio. Actualizar con drift sin review es riesgo de ocultar regresiones, no buena práctica ni obligatorio ciego.

**Q2.** Sobre-mocking típico:
- **chosen_index:** `1` → Acoplar el test a detalles internos y ocultar bugs
- **confidence:** 0.92
- **justification:** B2-Skeptic: card «contract tests sin sobre-mocking»: el sobre-mocking acopla el test a detalles internos y se rompe en refactors; puede ocultar bugs. sqlite memoria y seed son mitigaciones, no el problema.

**Q3.** Flakes en la suite gate de ER se manejan:
- **chosen_index:** `1` → Con determinismo (seed/reloj/sort) y fallo de job si persisten
- **confidence:** 0.93
- **justification:** B2-Skeptic: card «flakes, determinismo y CI»: flakes inaceptables en suite gate; mitigar con seed/reloj/sort y fallar el job si persisten — no ignorar, retries masivos ni borrar tests.

### S29 — SQL avanzado y modelado relacional

**Q0.** entity_a < entity_b en el par sirve para:
- **chosen_index:** `1` → Evitar duplicar el mismo par en orden invertido
- **confidence:** 0.93
- **justification:** B2-Skeptic: iDo/theory de pares: orden canónico entity_a < entity_b (CHECK a<b) evita duplicar el mismo par en orden invertido. No infiere fraude ni sube isolation.

**Q1.** Append-only en decisions significa:
- **chosen_index:** `1` → Nueva fila por cambio de decisión
- **confidence:** 0.94
- **justification:** B2-Skeptic: temporalidad append-only: no sobrescribas la decisión anterior; inserta una nueva fila versionada. Append-only = nueva fila por cambio de decisión, no UPDATE in-place.

**Q2.** Decisión y evidencia deben:
- **chosen_index:** `1` → Ser atómicas en la misma transacción lógica
- **confidence:** 0.93
- **justification:** B2-Skeptic: ACID del almacén ER: decisión + evidencia deben commitearse juntas o no (misma transacción lógica). Rollback si falla el segundo insert; no transacciones separadas siempre ni solo logs.

**Q3.** El repository pattern:
- **chosen_index:** `1` → Encapsula acceso a datos y facilita tests con :memory:
- **confidence:** 0.93
- **justification:** B2-Skeptic: repository pattern: encapsula SQL/acceso a datos y facilita tests con sqlite :memory:. No esparce SQL, no reemplaza constraints ni marca fraude.

### S30 — Entity resolution probabilístico

**Q0.** El motor ER de CP-N3-A debe decidir:
- **chosen_index:** `2` → Si dos registros son la misma entidad
- **confidence:** 0.95
- **justification:** B2-Skeptic: cierre CP-N3-A: el motor ER responde solo «¿misma entidad?»; no infiere parentesco, colusión ni fraude. Elijo «Si dos registros son la misma entidad».

**Q1.** Candidate recall de blocking mide:
- **chosen_index:** `1` → Fracción de verdaderos matches que sobreviven al blocking
- **confidence:** 0.93
- **justification:** B2-Skeptic: blocking: candidate recall = de los pares verdaderamente match en el gold, qué fracción pasó el blocking. Mide fracción de verdaderos matches que sobreviven al blocking — no solo CPU ni precisión final del scorer.

**Q2.** Scores entre t_low y t_high van a:
- **chosen_index:** `2` → clerical review
- **confidence:** 0.94
- **justification:** B2-Skeptic: umbrales: auto_match ≥ t_high; non_match ≤ t_low; en medio → review. Scores entre t_low y t_high van a clerical review.

**Q3.** Split por entidad evita:
- **chosen_index:** `1` → Leakage de identidad entre train y test
- **confidence:** 0.93
- **justification:** B2-Skeptic: labeled pairs: split por entidad — si una entidad aparece en train, sus pares no deben filtrar a test (leakage de identidad). Evita leakage de identidad entre train y test.

### S31 — Grafos y evidencia relacional

**Q0.** En CP-N3-B, un score alto de centralidad significa:
- **chosen_index:** `2` → Posición estructural que requiere contexto, no culpa
- **confidence:** 0.94
- **justification:** B2-Skeptic: centralidad: degree/betweenness miden estructura, no culpa; nunca automatices alta centralidad → fraude. Score alto = posición estructural que requiere contexto, no culpa/parentesco/borrar.

**Q1.** Provenance en una arista sirve para:
- **chosen_index:** `1` → Auditar source/record_id del hecho relacional
- **confidence:** 0.93
- **justification:** B2-Skeptic: provenance en aristas: source_system, run_id, record_id permiten auditar de dónde salió el hecho relacional. Sirve para auditar source/record_id — no solo color UI ni ocultar el path.

**Q2.** Al agregar transferencias entre el mismo par debes:
- **chosen_index:** `1` → Conservar detalle o punteros además del agregado
- **confidence:** 0.92
- **justification:** B2-Skeptic: agregación de transferencias: puedes agregar aristas pero guarda capa de detalle o punteros a record_id. Conservar detalle/punteros; no borrar record_ids ni etiquetar fraude.

**Q3.** Shared phone entre dos entidades implica:
- **chosen_index:** `2` → Un hecho de contacto compartido a investigar con evidencia, no veredicto
- **confidence:** 0.93
- **justification:** B2-Skeptic: mapa CP-N3-B: el grafo no responde «quién es culpable»; shared phone es un hecho de contacto compartido a investigar con evidencia — no parentesco legal, colusión ni fraude automático.

### S32 — Feature engineering y pipelines sin leakage

**Q0.** Fit de scaler debe hacerse en:
- **chosen_index:** `1` → Train
- **confidence:** 0.94
- **justification:** B2-Skeptic: encoding/escalado: «Escalado (standard/minmax) se fit solo en train»; nunca uses estadísticas del test set para fit. Fit de scaler en train.

**Q1.** Una feature reviewer_decision es:
- **chosen_index:** `1` → Leakage de decisión
- **confidence:** 0.94
- **justification:** B2-Skeptic: leakage: features que usan y o datos post-decisión son leakage. reviewer_decision como feature = leakage de decisión, no feature válida.

**Q2.** Ventana half-open [t-W,t) excluye:
- **chosen_index:** `1` → Eventos con ts>=t
- **confidence:** 0.92
- **justification:** B2-Skeptic: ventanas half-open [t-W, t): eventos con ts ≥ t no entran (evita futuro/label-bearing). La ventana excluye eventos con ts≥t.

**Q3.** Split por entidad busca:
- **chosen_index:** `1` → Overlap 0 de entidades
- **confidence:** 0.93
- **justification:** B2-Skeptic: split por entity_id / group split: todas las filas de una entidad van a un solo fold → overlap 0 de entidades. No maximizar overlap ni solo shuffle de filas.

### S33 — ML supervisado y baselines responsables

**Q0.** El target del workbench debe ser preferentemente:
- **chosen_index:** `1` → needs_review u objetivo de cola
- **confidence:** 0.94
- **justification:** B2-Skeptic: framing workbench: target típico necesita_revision (0/1) sintético — no 'es fraude'. Preferir needs_review/objetivo de cola; rechazo fraud_auto, parentesco y culpa.

**Q1.** Si el modelo no gana a la regla:
- **chosen_index:** `1` → Conserva regla y no vendas humo
- **confidence:** 0.93
- **justification:** B2-Skeptic: baseline: si el ML no gana al dummy/regla, no despliegues. Conserva la regla y no vendas humo; no desplegar igual ni borrar baseline.

**Q2.** Coeficientes logísticos prueban:
- **chosen_index:** `1` → Asociación en el modelo, no causa legal
- **confidence:** 0.92
- **justification:** B2-Skeptic: coeficientes logísticos: reporta top coefs con dirección, no como prueba causal ni de fraude. Asociación en el modelo, no causa legal.

**Q3.** Elegir hiperparámetros por train_acc alto:
- **chosen_index:** `1` → Riesgo de overfit; usa valid
- **confidence:** 0.93
- **justification:** B2-Skeptic: overfit: elegir hiperparámetros por train_acc alto sin valid es riesgo de overfit; usa valid (si train→1 y valid baja, overfit).

### S34 — Métricas, desbalance, calibración y umbrales

**Q0.** El workbench CP-N3-B debe:
- **chosen_index:** `1` → Priorizar revisión con evidencia y ranking
- **confidence:** 0.94
- **justification:** B2-Skeptic: cierre CP-N3-B: el workbench prioriza revisión y explica; no imprime fraud=true. Debe priorizar revisión con evidencia y ranking — no auto-fraude ni parentesco.

**Q1.** precision@k responde a:
- **chosen_index:** `1` → Calidad del ranking bajo capacidad k
- **confidence:** 0.93
- **justification:** B2-Skeptic: métricas operativas: precision@k / recall@k bajo capacidad k. precision@k responde a calidad del ranking bajo capacidad k — no Brier solo ni Kafka lag.

**Q2.** Resampling de clases debe:
- **chosen_index:** `1` → Solo dentro del train de cada fold
- **confidence:** 0.94
- **justification:** B2-Skeptic: desbalance: class weights o re/undersampling solo dentro del fold de train; resamplear antes del split filtra valid. Solo dentro del train de cada fold.

**Q3.** Abstención sirve para:
- **chosen_index:** `1` → Enviar banda gris a humano
- **confidence:** 0.93
- **justification:** B2-Skeptic: abstención: bandas grises → humano. Sirve para enviar banda gris a humano; no ocultar métricas ni forzar fraud=1.

### S35 — Explicabilidad, equidad e incertidumbre

**Q0.** La ficha de caso debe separar:
- **chosen_index:** `1` → Evidencia, modelo, incertidumbre y decisión humana
- **confidence:** 0.93
- **justification:** B2-Skeptic: ficha de caso: distingue evidencia observada | aporte modelo | incertidumbre | decisión humana. Debe separar evidencia, modelo, incertidumbre y decisión humana — no solo score o SHAP global.

**Q1.** Perm importance prueba:
- **chosen_index:** `1` → Sensibilidad del modelo a barajar features
- **confidence:** 0.92
- **justification:** B2-Skeptic: perm importance: caída de métrica al barajar una feature = sensibilidad del modelo a barajar features; no prueba de fraude ni causalidad legal.

**Q2.** Ante OOD conviene:
- **chosen_index:** `1` → Abstener y escalar
- **confidence:** 0.94
- **justification:** B2-Skeptic: OOD: abstén y escala a humano; mejor abstener que inventar certeza. Ante OOD conviene abstener y escalar, no forzar pred 1.

**Q3.** Model card out_of_scope incluye:
- **chosen_index:** `1` → Usos prohibidos p.ej. etiqueta de fraude
- **confidence:** 0.93
- **justification:** B2-Skeptic: model card out_of_scope: usos prohibidos (p.ej. etiqueta automática de fraude). Incluye usos prohibidos; no 'nada', solo accuracy ni email personal del owner.

### S36 — Clustering, anomalías y validación temporal

**Q0.** Una anomalía en el triage significa:
- **chosen_index:** `1` → Señal de rareza a revisar
- **confidence:** 0.94
- **justification:** B2-Skeptic: anomalías en triage: score alto → candidatos a review, no culpa; nunca anomalía → conducta indebida automática. Anomalía = señal de rareza a revisar.

**Q1.** contamination representa:
- **chosen_index:** `1` → Hipótesis de fracción rara a flaggear
- **confidence:** 0.93
- **justification:** B2-Skeptic: contamination es hipótesis de fracción rara a flaggear; no es prevalencia de fraude real ni accuracy.

**Q2.** PCA en este curso se usa para:
- **chosen_index:** `1` → Exploración/visualización prudente
- **confidence:** 0.92
- **justification:** B2-Skeptic: PCA proyecta a 2D para explorar; no es el modelo de decisión final. Uso: exploración/visualización prudente.

**Q3.** Con labels escasos prioriza:
- **chosen_index:** `1` → precision@k y feedback humano
- **confidence:** 0.93
- **justification:** B2-Skeptic: labels escasos: precision@k y acuerdo humano importan más que ROC fantasma. Prioriza precision@k y feedback humano.

### S37 — Profiling, algoritmos y rendimiento

**Q0.** Warmup sirve para:
- **chosen_index:** `1` → Estabilizar benches descartando cold start
- **confidence:** 0.93
- **justification:** B2-Skeptic: benches: warmup descarta primera corrida (cold start); reporta mediana/p95. Warmup estabiliza benches, no infla métricas.

**Q1.** Blocking reduce:
- **chosen_index:** `1` → Pares candidatos O(n²)
- **confidence:** 0.94
- **justification:** B2-Skeptic: complejidad ER/grafo: O(n²) pairs matan el pipeline; blocking reduce candidatos. Blocking reduce pares candidatos O(n²).

**Q2.** Performance budget en CI:
- **chosen_index:** `1` → Falla si se rompe el límite acordado
- **confidence:** 0.93
- **justification:** B2-Skeptic: performance budget en CI: test de regresión de performance falla si se rompe el límite acordado — no teatro opcional ni reemplazo de tests funcionales.

**Q3.** Microoptimizar 2% sin medición:
- **chosen_index:** `1` → Teatro; prioriza claridad y algos
- **confidence:** 0.92
- **justification:** B2-Skeptic: microoptimización sin medición es teatro; claridad gana a shaving 2%. Prioriza claridad y algoritmos, no microoptimizar a ciegas.

### S38 — Concurrencia, observabilidad y workflows resilientes

**Q0.** Para CPU bound en CPython suele preferirse:
- **chosen_index:** `1` → Procesos
- **confidence:** 0.93
- **justification:** B2-Skeptic: GIL: limita CPU multi-thread en CPython; processes evitan GIL para CPU-bound. Para CPU bound suele preferirse procesos, no miles de threads CPU.

**Q1.** Backpressure evita:
- **chosen_index:** `1` → Colas infinitas y OOM
- **confidence:** 0.94
- **justification:** B2-Skeptic: backpressure: queue maxsize limita admisión; sin backpressure, OOM o ban del API. Evita colas infinitas y OOM.

**Q2.** Idempotencia permite:
- **chosen_index:** `1` → Reejecutar sin side effects duplicados
- **confidence:** 0.93
- **justification:** B2-Skeptic: idempotencia: reejecutar no duplica side effects (usa keys). Permite reejecutar sin side effects duplicados — no duplicar cobros.

**Q3.** En logs de prod debes:
- **chosen_index:** `1` → Redactar PII y correlacionar
- **confidence:** 0.94
- **justification:** B2-Skeptic: logs de prod: redacta PII y usa correlation_id/case_id. Redactar PII y correlacionar; no PII completa ni desactivar métricas.

### S39 — Responsible ML Case Triage y cierre de nivel

**Q0.** El label_space del triage N3 es preferentemente:
- **chosen_index:** `1` → needs_review / prioridad de cola
- **confidence:** 0.94
- **justification:** B2-Skeptic: triage N3: label_space de prioridad / needs_review; score no es veredicto legal ni fraud_certainty. Preferente needs_review / prioridad de cola.

**Q1.** CF-3 y regresión S27–S39 en esta lane de autoría:
- **chosen_index:** `1` → Se documentan; PASS lo califica otra lane
- **confidence:** 0.95
- **justification:** B2-Skeptic: cierre/lane: CF-3 y regresión S27–S39 se documentan en esta lane de autoría; PASS lo califica otra lane — no marcan PASS solos ni se borran.

**Q2.** Evidence packet debe incluir:
- **chosen_index:** `1` → Evidencia y path además del score
- **confidence:** 0.93
- **justification:** B2-Skeptic: evidence packet: hechos, path de grafo, features top, incertidumbre; el revisor ve evidencia, no solo un número. Incluye evidencia y path además del score.

**Q3.** Ante incidente grave el modo seguro es:
- **chosen_index:** `1` → human_only / rollback
- **confidence:** 0.94
- **justification:** B2-Skeptic: incidentes: severidad, rollback de model/thr, human-only mode. Ante incidente grave: human_only / rollback — no ignorar ni etiquetar fraude masivo.

### S40 — Arquitectura, DDD y decisiones técnicas

**Q0.** El id de plataforma de S40 que se preserva es:
- **chosen_index:** `0` → agentic-architecture
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S40: retematiza el archivo de plataforma `agentic-architecture` hacia el título de la sección. Eso fija el id preservado «agentic-architecture»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S40 pertenece a:
- **chosen_index:** `0` → CP-N4-A (inicio)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-A (inicio)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S41 — APIs con FastAPI y contratos HTTP

**Q0.** El id de plataforma de S41 que se preserva es:
- **chosen_index:** `0` → llm-finetuning
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S41: retematiza el archivo de plataforma `llm-finetuning` hacia el título de la sección. Eso fija el id preservado «llm-finetuning»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S41 pertenece a:
- **chosen_index:** `0` → CP-N4-A (servicio)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-A (servicio)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves in…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S42 — Schemas, seguridad y privacidad de servicios

**Q0.** El id de plataforma de S42 que se preserva es:
- **chosen_index:** `0` → graph-rag
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S42: retematiza el archivo de plataforma `graph-rag` hacia el título de la sección. Eso fija el id preservado «graph-rag»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S42 pertenece a:
- **chosen_index:** `0` → CP-N4-A (control plane)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-A (control plane)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-A (control plane)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar d…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S43 — Contenedores y reproducibilidad operativa

**Q0.** El id de plataforma de S43 que se preserva es:
- **chosen_index:** `0` → llmops
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S43: retematiza el archivo de plataforma `llmops` hacia el título de la sección. Eso fija el id preservado «llmops»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S43 pertenece a:
- **chosen_index:** `0` → CP-N4-A (cierre)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-A (cierre)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («Governed Python Service Platform levanta con un comando, ejecuta tests/health checks…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S44 — CI/CD y seguridad de la cadena de suministro

**Q0.** El id de plataforma de S44 que se preserva es:
- **chosen_index:** `0` → multimodal
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S44: retematiza el archivo de plataforma `multimodal` hacia el título de la sección. Eso fija el id preservado «multimodal»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S44 pertenece a:
- **chosen_index:** `0` → CP-N4-B (inicio)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-B (inicio)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S45 — Cloud, almacenamiento, colas e infraestructura

**Q0.** El id de plataforma de S45 que se preserva es:
- **chosen_index:** `0` → iac
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S45: retematiza el archivo de plataforma `iac` hacia el título de la sección. Eso fija el id preservado «iac»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S45 pertenece a:
- **chosen_index:** `0` → CP-N4-B (arquitectura)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-B (arquitectura)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («job asíncrono con artifact store, status, retry y dead-letter…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S46 — Ingeniería de datos y orquestación de producción

**Q0.** El id de plataforma de S46 que se preserva es:
- **chosen_index:** `0` → gpu-computing
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S46: retematiza el archivo de plataforma `gpu-computing` hacia el título de la sección. Eso fija el id preservado «gpu-computing»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S46 pertenece a:
- **chosen_index:** `0` → CP-N4-B (pipeline)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-B (pipeline)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («pipeline incremental/backfillable cuya reejecución no duplica, registra lineage…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S47 — MLOps: experimentos, registro y serving

**Q0.** El id de plataforma de S47 que se preserva es:
- **chosen_index:** `0` → opensource
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S47: retematiza el archivo de plataforma `opensource` hacia el título de la sección. Eso fija el id preservado «opensource»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S47 pertenece a:
- **chosen_index:** `0` → CP-N4-B (cierre) + CF-4
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-B (cierre) + CF-4»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («Production Data/ML Platform promueve un modelo desde experimento hasta servicio solo tras …»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S48 — LLM applications y RAG con evidencia

**Q0.** El id de plataforma de S48 que se preserva es:
- **chosen_index:** `0` → ai-governance
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S48: retematiza el archivo de plataforma `ai-governance` hacia el título de la sección. Eso fija el id preservado «ai-governance»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S48 pertenece a:
- **chosen_index:** `0` → CP-N4-C (inicio)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-C (inicio)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («asistente responde sobre documentación autorizada, cita fragmentos verificables y se absti…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S49 — Agentes, herramientas y context engineering

**Q0.** El id de plataforma de S49 que se preserva es:
- **chosen_index:** `0` → data-contracts
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S49: retematiza el archivo de plataforma `data-contracts` hacia el título de la sección. Eso fija el id preservado «data-contracts»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S49 pertenece a:
- **chosen_index:** `0` → CP-N4-C (tools)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-C (tools)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («agente acotado puede consultar casos/reportes y preparar una propuesta, pero no enviar ni …»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S50 — Evals, red teaming y fiabilidad de IA

**Q0.** El id de plataforma de S50 que se preserva es:
- **chosen_index:** `0` → tech-leadership
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S50: retematiza el archivo de plataforma `tech-leadership` hacia el título de la sección. Eso fija el id preservado «tech-leadership»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S50 pertenece a:
- **chosen_index:** `0` → CP-N4-C (quality gate)
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-C (quality gate)»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («suite repetible compara baseline/candidato y bloquea regresiones P0/P1…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S51 — Observabilidad, gobernanza y UX del copiloto

**Q0.** El id de plataforma de S51 que se preserva es:
- **chosen_index:** `0` → integrator-final
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S51: retematiza el archivo de plataforma `integrator-final` hacia el título de la sección. Eso fija el id preservado «integrator-final»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S51 pertenece a:
- **chosen_index:** `0` → CP-N4-C (cierre) + CF-5 + Level-4 regression
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-N4-C (cierre) + CF-5 + Level-4 regression»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («Auditable AI Operations Copilot aprobado con system card y dashboard operativo…»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

### S52 — Enterprise Relationship & Operations Intelligence Platform: capstone final

**Q0.** El id de plataforma de S52 que se preserva es:
- **chosen_index:** `0` → career-strategy
- **confidence:** 0.95
- **justification:** B2-Skeptic: mapa V3 S52: retematiza el archivo de plataforma `career-strategy` hacia el título de la sección. Eso fija el id preservado «career-strategy»; renamed-v3 / legacy-drop / random no aparecen como id de archivo en la card.

**Q1.** El incremento/gate V3 de S52 pertenece a:
- **chosen_index:** `0` → CP-FINAL exclusivamente
- **confidence:** 0.94
- **justification:** B2-Skeptic: teoría del mapa: «Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.» El gate/incremento V3 es «CP-FINAL exclusivamente»; CP-N1-A, «solo marketing» y «sin capstone» contradicen el texto de la card.

**Q2.** Los ejemplos del curso deben usar:
- **chosen_index:** `1` → Datos sintéticos
- **confidence:** 0.96
- **justification:** B2-Skeptic: card: «Español peruano; fixtures sintéticas; esta lane no marca section_passed…» y prohíbe secretos/PII real. Los ejemplos deben usar datos sintéticos — no PII real, secretos de prod ni claves API reales.

**Q3.** Entity resolution (si aparece) decide:
- **chosen_index:** `2` → Misma entidad cuando aplique
- **confidence:** 0.88
- **justification:** B2-Skeptic: cuando ER aparece en el incremento («Enterprise Relationship & Operations Intelligence Platform integra, con contratos y datos …»), el curso lo trata como misma entidad / componente de plataforma, no como fraude, parentesco ni sentimiento. Elijo «Misma entidad cuando aplique»; rechazo [0]/[1]/[3].

## Artifacts updated

- `course-state/newbie_walkthrough/agentic_B2/section_27/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_28/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_29/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_30/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_31/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_32/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_33/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_34/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_35/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_36/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_37/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_38/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_39/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_40/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_41/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_42/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_43/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_44/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_45/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_46/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_47/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_48/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_49/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_50/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_51/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_B2/section_52/newbie_b_live.json` → `selfcheck` filled

## Notes / residual skepticism

- S29 Q0 (`entity_a < entity_b`) grounded in pair-canonicity (iDo CHECK / theory), not only prose headings — still packet-local.
- S39 Q1: CF-3/regresión se documentan; PASS lo califica otra lane (lane disclaimer).
- S40–S52 Q3 (ER) is intentionally lower confidence (~0.88): cards name ER as a component/separación but rarely spell «misma entidad» in S40+; reject fraude/parentesco/sentimiento by course boundary.
- Quiz batch JSON paths under `agentic_B2/` were not present; content mirrored from progressive packets used by A1 batch files (same stems).
- No selfcheck left blank; exercises untouched.

*Recorded for walkthrough selfcheck fill · 2026-07-22T01:59:30.671311+00:00*
