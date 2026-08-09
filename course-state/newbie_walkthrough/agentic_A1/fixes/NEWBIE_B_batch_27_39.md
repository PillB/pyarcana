# Newbie B (Skeptic) — Selfcheck batch S27–S39

- **Agent:** `newbie_b_live` · persona **skeptic**
- **attempt_id:** `agentic_A1`
- **method:** `llm_packet_only_no_generator`
- **Source:** `quiz_batch_27_39.json` theory/iDo only (no solutions / correctIndex / attempt_007b / TS)
- **Boundary:** answers grounded in active packet card text; zero Python outside packets for reasoning

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

**Totals:** 52 stems · 0 selfcheck blocks · all `justification_from_packet` quote card/iDo.

## Per-stem answers (Skeptic)

### S27 — Estrategia de pruebas con pytest

**Q0.** En la pirámide de pruebas, la base más ancha suele ser:
- **chosen_index:** `1` → Pruebas unitarias
- **confidence:** 0.94
- **justification:** Skeptic — card/theory «riesgos y pirámide de pruebas»: «La pirámide prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E». La base más ancha son pruebas unitarias, no E2E UI ni load en prod. Rechazo [0]/[2]/[3] porque invierten o vacían la pirámide.

**Q1.** Un oráculo confiable es:
- **chosen_index:** `1` → Una fuente de verdad determinista para el assert
- **confidence:** 0.93
- **justification:** Skeptic — card «Arrange–Act–Assert y oráculos confiables»: «Un oráculo es la fuente de verdad del assert: valor fijo conocido, propiedad invariante o resultado de un algoritmo de referencia simple». Oráculos frágiles (reloj sin fijar, orden de set) se desaconsejan. Elijo fuente determinista; no print ni reloj libre.

**Q2.** Si mutas un casefold y ningún test falla:
- **chosen_index:** `1` → El contrato es débil; el mutante sobrevivió
- **confidence:** 0.95
- **justification:** Skeptic — card «mutación conceptual…»: «cambia deliberadamente el código (quita un strip…) y verifica que algún test falle. Si no falla, el test es débil». Mutar casefold sin fallo = mutante sobrevivió / contrato débil. No es 'está bien' ni culpa genérica de pytest.

**Q3.** Las pruebas de matching en CP-N3-A demuestran:
- **chosen_index:** `2` → Contratos de misma entidad / normalización — no riesgo ni relación
- **confidence:** 0.94
- **justification:** Skeptic — mapa CP-N3-A: pruebas convierten supuestos de normalización/matching en contratos; «Privacidad: las pruebas no etiquetan fraude ni parentesco». Matching demuestra contratos de misma entidad/normalización — no fraude, parentescos ni envío de correos.

### S28 — Pruebas de datos, propiedades e integración

**Q0.** Un test metamórfico verifica:
- **chosen_index:** `1` → Relaciones predecibles entre entradas transformadas y salidas
- **confidence:** 0.93
- **justification:** Skeptic — card «idempotencia, simetría y metamorphic tests»: «Metamorphic tests: transforma el input de forma que la relación de salida sea predecible». Verifican relaciones entre entradas transformadas y salidas, no un solo mágico ni fraude.

**Q1.** Actualizar un golden con drift sin review es:
- **chosen_index:** `1` → Riesgo de ocultar regresiones
- **confidence:** 0.94
- **justification:** Skeptic — card «golden datasets, drift y reconciliación»: «Reconciliación: actualizar golden solo con review y nota de cambio». Actualizar con drift sin review es riesgo de ocultar regresiones, no buena práctica ni obligatorio ciego.

**Q2.** Sobre-mocking típico:
- **chosen_index:** `1` → Acoplar el test a detalles internos y ocultar bugs
- **confidence:** 0.93
- **justification:** Skeptic — card «contract tests sin sobre-mocking»: «El sobre-mocking acopla el test a detalles internos… y se rompe en refactors…» y puede ocultar bugs. Prefiere contratos de borde; sqlite memoria y seed son mitigaciones, no el problema.

**Q3.** Flakes en la suite gate de ER se manejan:
- **chosen_index:** `1` → Con determinismo (seed/reloj/sort) y fallo de job si persisten
- **confidence:** 0.94
- **justification:** Skeptic — card «flakes, determinismo y CI»: flakes inaceptables en suite gate; mitigaciones seed/reloj/sort; no ocultar con retries masivos. Política: determinismo y fallo de job si persisten, no ignorar ni borrar tests.

### S29 — SQL avanzado y modelado relacional

**Q0.** entity_a < entity_b en el par sirve para:
- **chosen_index:** `1` → Evitar duplicar el mismo par en orden invertido
- **confidence:** 0.94
- **justification:** Skeptic — iDo S29-T1-B-DEMO: pairs con «check(a<b)» y descripción «orden entity_a < entity_b». Sirve para evitar duplicar el mismo par en orden invertido (canonicidad del par), no fraude ni isolation.

**Q1.** Append-only en decisions significa:
- **chosen_index:** `1` → Nueva fila por cambio de decisión
- **confidence:** 0.95
- **justification:** Skeptic — theory temporalidad: «No sobrescribas la decisión anterior; inserta una nueva fila versionada» + iDo append-only dos labels para el mismo par. Append-only = nueva fila por cambio, no UPDATE in-place.

**Q2.** Decisión y evidencia deben:
- **chosen_index:** `1` → Ser atómicas en la misma transacción lógica
- **confidence:** 0.94
- **justification:** Skeptic — ACID: «Una decisión + evidencia deben commitearse juntas o no». Decisión y evidencia atómicas en la misma transacción lógica; rollback demo si falla el segundo insert. No transacciones separadas siempre ni solo logs.

**Q3.** El repository pattern:
- **chosen_index:** `1` → Encapsula acceso a datos y facilita tests con :memory:
- **confidence:** 0.94
- **justification:** Skeptic — card repository pattern: «El repository encapsula SQL…» y «Prueba el repo con sqlite memoria». Encapsula acceso y facilita tests :memory:; no esparce SQL ni reemplaza constraints ni marca fraude.

### S30 — Entity resolution probabilístico

**Q0.** El motor ER de CP-N3-A debe decidir:
- **chosen_index:** `2` → Si dos registros son la misma entidad
- **confidence:** 0.96
- **justification:** Skeptic — cierre CP-N3-A: «ER responde solo ¿misma entidad? No infiere parentesco, colusión ni fraude». El motor decide si dos registros son la misma entidad — no fraude/parentesco/riesgo crediticio.

**Q1.** Candidate recall de blocking mide:
- **chosen_index:** `1` → Fracción de verdaderos matches que sobreviven al blocking
- **confidence:** 0.94
- **justification:** Skeptic — blocking: «Candidate recall: de los pares verdaderamente match en el gold, ¿qué fracción pasó el blocking?». Mide fracción de verdaderos matches que sobreviven al blocking, no solo CPU ni precisión final.

**Q2.** Scores entre t_low y t_high van a:
- **chosen_index:** `2` → clerical review
- **confidence:** 0.95
- **justification:** Skeptic — thresholds: «auto_match ≥ t_high; non_match ≤ t_low; en medio → review». Scores entre t_low y t_high van a clerical review.

**Q3.** Split por entidad evita:
- **chosen_index:** `1` → Leakage de identidad entre train y test
- **confidence:** 0.94
- **justification:** Skeptic — labeled pairs: «Split por entidad: si una entidad aparece en train, sus pares no deben filtrar a test (leakage de identidad)». Evita leakage de identidad train/test.

### S31 — Grafos y evidencia relacional

**Q0.** En CP-N3-B, un score alto de centralidad significa:
- **chosen_index:** `2` → Posición estructural que requiere contexto, no culpa
- **confidence:** 0.95
- **justification:** Skeptic — centralidad: «Degree/betweenness… miden estructura, no culpa» y «Nunca automatices alta centralidad → fraude». Score alto = posición estructural que requiere contexto, no culpa/parentesco/borrar.

**Q1.** Provenance en una arista sirve para:
- **chosen_index:** `1` → Auditar source/record_id del hecho relacional
- **confidence:** 0.94
- **justification:** Skeptic — multigrafo/provenance: «Provenance: source_system, run_id, record_id permiten auditar de dónde salió la arista». Sirve para auditar source/record_id del hecho relacional.

**Q2.** Al agregar transferencias entre el mismo par debes:
- **chosen_index:** `1` → Conservar detalle o punteros además del agregado
- **confidence:** 0.93
- **justification:** Skeptic — dedup/agregación: «Agregar aristas… pero guarda capa de detalle o punteros a record_id». Al agregar transferencias del mismo par: conservar detalle/punteros, no borrar record_ids ni etiquetar fraude.

**Q3.** Shared phone entre dos entidades implica:
- **chosen_index:** `2` → Un hecho de contacto compartido a investigar con evidencia, no veredicto
- **confidence:** 0.94
- **justification:** Skeptic — mapa CP-N3-B: grafo no responde «quién es culpable»; shared contact es hecho de contacto compartido a investigar con evidencia — no parentesco legal, colusión ni fraude automático.

### S32 — Feature engineering y pipelines sin leakage

**Q0.** Fit de scaler debe hacerse en:
- **chosen_index:** `1` → Train
- **confidence:** 0.95
- **justification:** Skeptic — encoding: «Escalado (standard/minmax) se fit solo en train» y «Nunca uses estadísticas del test set para fit». Fit de scaler en train.

**Q1.** Una feature reviewer_decision es:
- **chosen_index:** `1` → Leakage de decisión
- **confidence:** 0.95
- **justification:** Skeptic — leakage: no uses label de revisión como feature; «Leakage: features que usan y, o datos post-decisión». reviewer_decision = leakage de decisión.

**Q2.** Ventana half-open [t-W,t) excluye:
- **chosen_index:** `1` → Eventos con ts>=t
- **confidence:** 0.93
- **justification:** Skeptic — ventanas: «half-open intervals [t-W, t)» y «Eventos con ts > t no entran» / excluye el evento label-bearing. La ventana excluye eventos con ts≥t.

**Q3.** Split por entidad busca:
- **chosen_index:** `1` → Overlap 0 de entidades
- **confidence:** 0.94
- **justification:** Skeptic — split: «Prefiere split por entity_id… Group split: todas las filas de una entidad van a un solo fold». Busca overlap 0 de entidades, no maximizar overlap ni solo shuffle.

### S33 — ML supervisado y baselines responsables

**Q0.** El target del workbench debe ser preferentemente:
- **chosen_index:** `1` → needs_review u objetivo de cola
- **confidence:** 0.95
- **justification:** Skeptic — framing: «Target típico del workbench: necesita_revision (0/1) sintético — no 'es fraude'». Preferir needs_review/objetivo de cola, no fraud_auto/parentesco/culpa.

**Q1.** Si el modelo no gana a la regla:
- **chosen_index:** `1` → Conserva regla y no vendas humo
- **confidence:** 0.94
- **justification:** Skeptic — baseline: «Si el ML no gana al dummy/regla, no despliegues». Conserva regla y no vendas humo; no desplegar igual ni borrar baseline.

**Q2.** Coeficientes logísticos prueban:
- **chosen_index:** `1` → Asociación en el modelo, no causa legal
- **confidence:** 0.93
- **justification:** Skeptic — coeficientes: «Reporta top coefs con dirección, no como prueba causal» / no 'prueba de fraude'. Asociación en el modelo, no causa legal.

**Q3.** Elegir hiperparámetros por train_acc alto:
- **chosen_index:** `1` → Riesgo de overfit; usa valid
- **confidence:** 0.94
- **justification:** Skeptic — overfit: profundidad alta memoriza; «Curva train vs valid: si train→1 y valid baja, overfit». Elegir hiperparámetros solo por train_acc alto es riesgo de overfit; usa valid.

### S34 — Métricas, desbalance, calibración y umbrales

**Q0.** El workbench CP-N3-B debe:
- **chosen_index:** `1` → Priorizar revisión con evidencia y ranking
- **confidence:** 0.95
- **justification:** Skeptic — cierre CP-N3-B: «El workbench prioriza revisión y explica; no imprime fraud=true». Priorizar revisión con evidencia y ranking, no auto-fraude ni parentesco.

**Q1.** precision@k responde a:
- **chosen_index:** `1` → Calidad del ranking bajo capacidad k
- **confidence:** 0.94
- **justification:** Skeptic — top-k: «Métrica operativa: precision@k, recall@k… capacidad k». precision@k mide calidad del ranking bajo capacidad k.

**Q2.** Resampling de clases debe:
- **chosen_index:** `1` → Solo dentro del train de cada fold
- **confidence:** 0.95
- **justification:** Skeptic — desbalance: «Class weights o undersampling/oversampling solo dentro del fold de train. Resamplear antes del split filtra valid». Solo dentro del train de cada fold.

**Q3.** Abstención sirve para:
- **chosen_index:** `1` → Enviar banda gris a humano
- **confidence:** 0.94
- **justification:** Skeptic — abstención: «Abstención: bandas grises → humano». Sirve para enviar banda gris a humano, no ocultar métricas ni forzar fraud=1.

### S35 — Explicabilidad, equidad e incertidumbre

**Q0.** La ficha de caso debe separar:
- **chosen_index:** `1` → Evidencia, modelo, incertidumbre y decisión humana
- **confidence:** 0.94
- **justification:** Skeptic — plantilla ficha: «evidencia observada | aporte modelo | incertidumbre | decisión humana». Debe separar evidencia, modelo, incertidumbre y decisión humana — no solo score/SHAP global.

**Q1.** Perm importance prueba:
- **chosen_index:** `1` → Sensibilidad del modelo a barajar features
- **confidence:** 0.93
- **justification:** Skeptic — perm importance: «caída de métrica al barajar una feature» = sensibilidad del modelo a barajar features; «no… prueba de fraude» ni causalidad legal.

**Q2.** Ante OOD conviene:
- **chosen_index:** `1` → Abstener y escalar
- **confidence:** 0.95
- **justification:** Skeptic — OOD: «OOD… Abstén y escala a humano. Mejor abstener que inventar certeza». Ante OOD: abstener y escalar, no forzar pred 1.

**Q3.** Model card out_of_scope incluye:
- **chosen_index:** `1` → Usos prohibidos p.ej. etiqueta de fraude
- **confidence:** 0.94
- **justification:** Skeptic — model card: uso previsto, límites, fairness; out_of_scope = usos prohibidos (p.ej. etiqueta de fraude automática). No solo accuracy ni email personal del owner.

### S36 — Clustering, anomalías y validación temporal

**Q0.** Una anomalía en el triage significa:
- **chosen_index:** `1` → Señal de rareza a revisar
- **confidence:** 0.95
- **justification:** Skeptic — anomalías: score alto → candidatos a review, no culpa; «Nunca: anomalía → conducta indebida automática». Anomalía = señal de rareza a revisar, no fraude probado.

**Q1.** contamination representa:
- **chosen_index:** `1` → Hipótesis de fracción rara a flaggear
- **confidence:** 0.94
- **justification:** Skeptic — contamination: «contamination es hipótesis de fracción rara; no es prevalencia de fraude». Hipótesis de fracción rara a flaggear, no tasa real de fraude.

**Q2.** PCA en este curso se usa para:
- **chosen_index:** `1` → Exploración/visualización prudente
- **confidence:** 0.93
- **justification:** Skeptic — PCA: «PCA proyecta a 2D para explorar; no es el modelo de decisión final» / 'exploratorio'. Exploración/visualización prudente.

**Q3.** Con labels escasos prioriza:
- **chosen_index:** `1` → precision@k y feedback humano
- **confidence:** 0.94
- **justification:** Skeptic — labels escasos: «precision@k y acuerdo humano importan más que ROC fantasma». Prioriza precision@k y feedback humano.

### S37 — Profiling, algoritmos y rendimiento

**Q0.** Warmup sirve para:
- **chosen_index:** `1` → Estabilizar benches descartando cold start
- **confidence:** 0.94
- **justification:** Skeptic — benches: «Warmup descarta primera corrida. Reporta mediana/p95». Warmup estabiliza descartando cold start, no inflar métricas.

**Q1.** Blocking reduce:
- **chosen_index:** `1` → Pares candidatos O(n²)
- **confidence:** 0.95
- **justification:** Skeptic — complejidad: «O(n²) pairs matan el ER/grafo. Blocking reduce candidatos». Blocking reduce pares candidatos O(n²).

**Q2.** Performance budget en CI:
- **chosen_index:** `1` → Falla si se rompe el límite acordado
- **confidence:** 0.94
- **justification:** Skeptic — budget: «Test de regresión de performance falla si se rompe budget». Performance budget en CI falla si se rompe el límite acordado.

**Q3.** Microoptimizar 2% sin medición:
- **chosen_index:** `1` → Teatro; prioriza claridad y algos
- **confidence:** 0.93
- **justification:** Skeptic — costo total: «Microoptimización sin medición es teatro. Claridad gana a shaving 2%». Microoptimizar 2% sin medición = teatro; prioriza claridad y algos.

### S38 — Concurrencia, observabilidad y workflows resilientes

**Q0.** Para CPU bound en CPython suele preferirse:
- **chosen_index:** `1` → Procesos
- **confidence:** 0.94
- **justification:** Skeptic — GIL/CPU: «GIL limita CPU multi-thread en CPython. Processes evitan GIL…». Para CPU-bound en CPython suele preferirse procesos, no miles de threads CPU.

**Q1.** Backpressure evita:
- **chosen_index:** `1` → Colas infinitas y OOM
- **confidence:** 0.95
- **justification:** Skeptic — pools: «Queue maxsize = backpressure… Sin backpressure, OOM o ban del API». Backpressure evita colas infinitas y OOM.

**Q2.** Idempotencia permite:
- **chosen_index:** `1` → Reejecutar sin side effects duplicados
- **confidence:** 0.94
- **justification:** Skeptic — idempotencia: «Idempotencia: reejecutar no duplica side effects (usa keys)». Permite reejecutar sin side effects duplicados.

**Q3.** En logs de prod debes:
- **chosen_index:** `1` → Redactar PII y correlacionar
- **confidence:** 0.95
- **justification:** Skeptic — correlación/redacción: «Redacta PII en logs» + correlation_id. En prod: redactar PII y correlacionar; no PII completa ni desactivar métricas.

### S39 — Responsible ML Case Triage y cierre de nivel

**Q0.** El label_space del triage N3 es preferentemente:
- **chosen_index:** `1` → needs_review / prioridad de cola
- **confidence:** 0.95
- **justification:** Skeptic — triage N3: score de prioridad / needs_review; «ER no infiere… fraude; … score no es veredicto legal». label_space preferente needs_review/prioridad de cola, no fraud_certainty/parentesco/culpable.

**Q1.** CF-3 y regresión S27–S39 en esta lane de autoría:
- **chosen_index:** `1` → Se documentan; PASS lo califica otra lane
- **confidence:** 0.96
- **justification:** Skeptic — card cierre: «Esta lane de autoría no marca PASS» (CF-3/regresión S27–S39 se documentan conceptualmente). CF-3 y regresión se documentan; PASS lo califica otra lane — no marcan PASS solos.

**Q2.** Evidence packet debe incluir:
- **chosen_index:** `1` → Evidencia y path además del score
- **confidence:** 0.94
- **justification:** Skeptic — evidence packet: «hechos, path de grafo, features top, incertidumbre… El revisor ve evidencia, no solo un número». Debe incluir evidencia y path además del score.

**Q3.** Ante incidente grave el modo seguro es:
- **chosen_index:** `1` → human_only / rollback
- **confidence:** 0.95
- **justification:** Skeptic — incidentes: «Incidente: severidad, rollback de model/thr, human-only mode». Ante incidente grave: human_only / rollback — no ignorar ni etiquetar fraude masivo.

## Artifacts updated

- `course-state/newbie_walkthrough/agentic_A1/section_27/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_28/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_29/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_30/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_31/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_32/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_33/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_34/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_35/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_36/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_37/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_38/newbie_b_live.json` → `selfcheck` filled
- `course-state/newbie_walkthrough/agentic_A1/section_39/newbie_b_live.json` → `selfcheck` filled

## Notes / residual skepticism

- S29 Q0 (`entity_a < entity_b`) grounded in **iDo** CHECK `a<b`, not only prose headings — still packet-local.
- S39 Q1 depends on explicit lane disclaimer «esta lane de autoría no marca PASS» — answered as document-only vs grading lane.
- No selfcheck left blank; confidence slightly discounted (skeptic) vs explorer-style certainty.

*Recorded conceptually for walkthrough selfcheck fill · 2026-07-21T22:08:52.037635+00:00*
