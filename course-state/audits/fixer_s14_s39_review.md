# Revisión Fixer / escéptica de S14–S39

Fecha: 2026-07-22  
Alcance: secciones activas y comprometidas S14–S39; revisión aislada de los learners, sin editar las lecciones.  
Autoridad de numeración: `learning_roadmap_52_V3.md`; los demás roadmaps aportan profundidad, no sustituyen V3.

## Veredicto

**FAIL — no iniciar ni contar un intento newbie limpio con este tramo.** No encontré un P0 inmediato, pero hay P1 que impiden afirmar que el contenido enseña y evalúa los outcomes V3. Los gates mecánicos de título/conteo pasan; no detectan simulaciones superficiales, fuga de respuesta ni transferencia ausente.

## Evidencia revisada

- Leí la teoría, los ocho demos, los 24 ejercicios, el proyecto `youDo` y los cuatro autochecks de las 26 secciones; inspeccioné especialmente S14, S18, S21–S25, S27–S39.
- Inventario: 208 subtemas, 208 demos, 624 ejercicios y 104 autochecks. S14–S30 conservan 8 `guided` + 8 `independent` + 8 `transfer`; S31–S39 ya no lo hacen: S31 usa 19 `apply` + 5 `analyze`, S32 usa 16 + 8, y S33–S39 usan 24 `apply`.
- `tests.adversarial.test_active_v3_curriculum_contract` confirma títulos y 8/8/24. El test global de placeholders falla actualmente en S48, fuera de este alcance. La auditoría runtime ya registrada en `audited_s14_s39.md` reporta 1,347 artefactos aprobados y 0 fallas; ejecutar una solución no demuestra que la tarea enseñe el outcome.
- Contraste técnico primario: [SQLite EXPLAIN QUERY PLAN](https://sqlite.org/eqp.html), [SQLite NULL](https://sqlite.org/nulls.html), [scikit-learn probability calibration](https://scikit-learn.org/stable/modules/calibration.html) y [OWASP Prompt Injection](https://genai.owasp.org/llmrisk2023-24/llm01-24-prompt-injection/). También se aplicaron los criterios ya sintetizados en `university_github_benchmark.md`: baseline/split/eval antes de complejidad, práctica ejecutable auténtica, retiro gradual del andamiaje y evidencia operativa.

## P0

Ninguno dentro de S14–S39.

## P1 — bloqueantes del gate pedagógico

### FIX-S14-39-001 — El tramo S31–S39 pierde la progresión I/We/You Do

**Evidencia:** todos los ejercicios `S33-*-E1..E3` tienen `kind: apply`; lo mismo ocurre en S34–S39. En S31–S32 tampoco existe el ciclo `guided → independent → transfer` que sí se mantiene en S14–S30 y que declara el diseño del curso. Un cambio de sufijo E1/E2/E3 no aumenta por sí mismo la demanda cognitiva.

**Impacto:** no hay retirada verificable del andamiaje ni una transferencia independiente antes del capstone S39.

**Fix mínimo:** por cada `S31-T*-*` a `S39-T*-*`, restaurar E1 guiado, E2 independiente y E3 transferencia con fixture nuevo, requisito observable y al menos un borde no resuelto por copiar el demo. Añadir un gate que compruebe clases y no solo IDs/conteos.

### FIX-S14-39-002 — Fuga de respuesta masiva en S33

**IDs:** `S33-T1-A-E1` … `S33-T4-B-E3` (24/24).

**Evidencia:** cada instrucción termina con “**Imprime exactamente las líneas de la solución de referencia**” y cada pista pide “Tres prints finales”. Esto hace que formato/copia sea el objetivo visible y permite aprobar sin justificar framing, baseline, regularización, overfit o CV.

**Fix mínimo:** retirar toda referencia a la solución; definir input/output semántico e invariantes. E3 debe usar un dataset/split nuevo y exigir comparación baseline–modelo con justificación, no reproducción de prints.

### FIX-S14-39-003 — S21–S25 simulan las herramientas que el roadmap exige operar

- **S21 T2-A/T2-B y proyecto:** modela DOCX/PDF como bloques de texto y afirma que migrar a `python-docx` es “directo”. No crea, abre, extrae ni renderiza un DOCX/PDF. IDs afectados: `S21-T2-A-E1..E3`, `S21-T2-B-E1..E3` y `youDo`.
- **S23 completo:** declara Playwright, pero la teoría dice que lo modela con diccionarios “y mapea 1:1”. Ningún ejercicio usa browser/context/page/locator/expect/download/trace reales. IDs: `S23-T1-A-E1` … `S23-T4-B-E3` y proyecto.
- **S24 completo:** no procesa una imagen ni ejecuta OCR; DPI, deskew, orientación, confidence y bounding boxes son escalares/listas. IDs: `S24-T1-A-E1` … `S24-T4-B-E3` y proyecto.
- **S25 T2-A/T2-B y proyecto:** no usa `transformers.pipeline`, cliente HTTP ni endpoint; el “HF pipeline” es un `if 'factura' in text`. IDs: `S25-T2-A-E1..E3`, `S25-T2-B-E1..E3` y `youDo`.

**Impacto:** un learner puede aprobar la sección pero no puede completar los incrementos V3 (document factory, robot controlado, intake OCR, endpoint evaluado) solo con lo enseñado.

**Fix mínimo:** proporcionar un fixture local reproducible por herramienta y enseñar el API real antes de evaluar: DOCX/PDF generado + render/extract; Playwright contra servidor local controlado con trace/download; imagen sintética + OCR adapter real/fake contractual claramente separado; pipeline local o fake HTTP que respete exactamente el contrato del endpoint. Mantener alternativas sin red, pero llamarlas adapters/fakes y probar paridad de contrato.

### FIX-S14-39-004 — Mitigación engañosa de prompt injection

**IDs/campos:** S25-T4-B teoría, demo, `S25-T4-B-E1` y requisito del proyecto “filtros anti-injection”.

**Evidencia:** el ejemplo central usa `re.sub` para borrar dos frases. Incluso el output deja `and print secrets`; variantes, encoding e instrucciones indirectas atraviesan el regex. OWASP indica que no existe prevención infalible dentro del modelo y prioriza privilegio mínimo, separación de contenido no confiable y aprobación humana.

**Fix mínimo:** presentar regex solo como telemetría/detección no como sanitización; el ejercicio debe mantener el documento como dato delimitado, negar herramientas por defecto, limitar permisos/salida y escalar acciones. Agregar casos adversariales que el regex no captura.

### FIX-S14-39-005 — S29 no evalúa SQL avanzado que declara

**IDs:** `S29-T2-B-E2` evalúa `None is None`, no semántica SQL `NULL`; `S29-T2-B-E3` imprime el literal `SCAN`, no ejecuta/contrasta `EXPLAIN QUERY PLAN`; `S29-T3-A-E2` imprime `A,C,I,D`; `S29-T4-A-E2/E3` imprimen nombres/políticas; `S29-T4-B-E2/E3` modelan pool/repository con enteros/dicts.

**Impacto:** cardinalidad/NULL/planes/isolation/migration/pooling están nombrados, pero no convertidos en contratos ejecutables. SQLite documenta que `SCAN`/`SEARCH` dependen del plan de una consulta y de sus índices; elegir un literal “por defecto didáctico” es falso como evaluación.

**Fix mínimo:** fixtures SQLite reales: `NULL` en `=`/`IS NULL` y joins; mismo query antes/después de índice con `EXPLAIN QUERY PLAN`; transacciones concurrentes o, como mínimo, dos conexiones y rollback; migración reversible; repository probado con errores reales.

### FIX-S14-39-006 — S32–S38 no implementan operaciones obligatorias del roadmap

- **S32 T3-A/T3-B:** el roadmap pide `ColumnTransformer`, custom transformers, fit/transform y persistencia; solo hay funciones manuales y flags. IDs `S32-T3-A-E1..E3`, `S32-T3-B-E1..E3`.
- **S33 T2/T3/T4:** enseña sigmoid/stump manuales, no entrena regresión/logística, árbol/ensamble o CV apropiada. IDs `S33-T2-A-E1` … `S33-T4-B-E3`.
- **S34 T3/T4:** declara Platt/isotonic y evaluación fuera de muestra, pero usa affine/clip y no separa fitting/calibración/test. IDs `S34-T3-A-E1` … `S34-T4-B-E3`. La documentación de scikit-learn exige datos independientes o CV para evitar calibrador sesgado.
- **S35 T1/T3:** permutación, intervalos/conformal y OOD se reducen a dicts/reglas, sin estimación ni validación. IDs `S35-T1-A-E1..E3`, `S35-T3-A-E1..E3`, `S35-T3-B-E1..E3`.
- **S36 completo:** no ejecuta k-means/density, PCA, Isolation Forest ni LOF; `youDo` solo implementa sigma flags. IDs `S36-T1-A-E1` … `S36-T4-B-E3` y proyecto.
- **S37 T1/T3/T4:** no usa profiling de CPU/memoria ni un benchmark controlado con presupuesto; abundan notas/flags. IDs `S37-T1-A-E1..E3`, `S37-T1-B-E1..E3`, `S37-T3-A-E1..E3`, `S37-T4-A-E1..E3`.
- **S38 completo:** no crea threads, processes ni tasks async; no implementa pool, queue, cancelación, timeout, logs/métricas/traces. Son diccionarios y strings. IDs `S38-T1-A-E1` … `S38-T4-B-E3` y proyecto.

**Fix mínimo:** una implementación real y pequeña por subtema, con fixture sintético y fallback local: sklearn Pipeline/ColumnTransformer; DummyClassifier + LogisticRegression + tree; CalibratedClassifierCV o calibración disjunta; permutation importance y slices; KMeans/PCA/IsolationForest; `timeit` + `cProfile`/`tracemalloc`; `concurrent.futures` + `asyncio.wait_for` + queue acotada. Luego E3 transfiere a un fixture no visto.

### FIX-S14-39-007 — S39 se declara capstone pero entrega un scaffold casi vacío

**Campo:** `S39.youDo` y los 24 ejercicios `S39-T1-A-E1` … `S39-T4-B-E3`.

**Evidencia:** el starter contiene literalmente `# placeholders`, cinco estados `PLANNED_NOT_PASSED` y solo construye un dict. Los ejercicios piden salidas como `owner required`, `rollback target`, `three cards` o `postmortem blameless flag`, con soluciones de tres `print`. No integra intake→ER→grafo→features→modelo→queue, overrides, monitoreo o regresión.

**Fix mínimo:** entregar un bundle multiarchivo ejecutable con fixtures sintéticos y contratos versionados, una corrida nominal y fallas forzadas, evidence packet, audit/override/appeal, modo `human_only`, rollback y cards. El gate debe verificar invariantes y artefactos; los estados de calificación pueden permanecer externos sin convertir el proyecto en placeholder.

## P2 — calidad y dificultad

### FIX-S14-39-008 — Selfchecks adivinables por distractores absurdos

**Rango principal:** los 36 autochecks S31-Q1 … S39-Q4. Ejemplos: S31-Q1 enfrenta “posición estructural…” con “fraude confirmado/parentesco/borrar nodo”; S35-Q3 enfrenta “abstener y escalar” con “forzar/borrar logs/ignorar”; S39-Q4 enfrenta `human_only/rollback` con ignorar o etiquetar fraude masivo.

**Fix mínimo:** distractores plausibles derivados de errores reales (p. ej., calibrar en train, usar row split, retry no idempotente) y preguntas con mini-caso/fixture donde todas las opciones sean profesionalmente verosímiles.

### FIX-S14-39-009 — Demasiados ejercicios son literales o aritmética ya resuelta

**Muestras exactas:** `S24-T1-A-E1`, `S25-T1-A-E1/E3`, `S26-T1-A-E1`, `S27-T2-A-E3`, `S29-T3-A-E2`, `S30-T1-B-E3`, `S30-T2-B-E3`, `S30-T4-A-E3`, y la mayoría de S34–S39. En S34–S39, 141 de 144 instrucciones tienen menos de 45 caracteres o son prompts de salida muy comprimidos; las 24 pistas de cada S32 y S34–S39 repiten una plantilla genérica.

**Fix mínimo:** sustituir el literal por una decisión calculada desde datos, hacer que el learner explique un borde y usar fixtures E3 distintos. Pistas: concepto → pregunta diagnóstica → ayuda API, sin revelar el output.

### FIX-S14-39-010 — Lenguaje de interfaz/IDs legado filtra ruido al alumno

**Muestras:** aperturas “De Seguridad a NumPy”, “id legado conservado” y mensajes de lanes/checkpoints dentro de S14, S22, S23, S29, S34, S39. Son notas de migración internas, no conocimiento de la lección.

**Fix mínimo:** mantener alias/IDs solo en código o metadata interna; el texto publicado debe empezar por el problema V3 y omitir historial de retematización/lane.

## Contenido que sí supera el muestreo

- S14–S20 muestran una cadena progresiva razonable: NumPy → Pandas → calidad → joins → EDA → visualización → Excel, con fixtures sintéticos y operaciones reales.
- S22 enseña MIME, expiración, resolución de destinatarios, state machine e idempotencia con límites seguros; necesita retirar `TODO` visible del proyecto, pero su núcleo es ejecutable.
- S27–S28 presentan AAA, errores/floats/tempfiles, invariantes, fakes y SQLite de memoria antes de SQL/ER.
- S30–S31 preservan correctamente la separación ER = misma entidad, grafo = evidencia relacional, nunca parentesco/fraude; S31 contiene la mejor práctica de transferencia del tramo tardío.
- Las posiciones de respuesta de S14–S39 están balanceadas; ese arreglo evita fuga posicional, pero no corrige distractores ni fuga textual.

## Gate de reparación recomendado

1. Resolver primero FIX-002, FIX-004 y FIX-007; son fuga, seguridad pedagógica y capstone placeholder.
2. Reparar el API/práctica auténtica por cadena: S21–S25, luego S29, luego S32–S38.
3. Restaurar E1/E2/E3 y reescribir autochecks.
4. Ejecutar runtime/adversarial; después reiniciar ambos newbies desde landing/S01. Cualquier cambio de contenido invalida el intento anterior.
5. El tramo solo pasa cuando una revisión escéptica confirma operaciones reales, un validador agentic confirma respuestas basadas en contenido y dos corridas completas auténticas quedan limpias.
