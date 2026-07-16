# Learning Roadmap V3 — El Arte de Python (S1–S52)

> Versión: 3.0 · 2026-07-15  
> Estado: arquitectura curricular autoritativa; los activos de contenido se producen y liberan secuencialmente.  
> Trayectoria: novato → principiante avanzado → competente → experto → máster.  
> Escala: 4 niveles × 13 secciones = 52 secciones.

## Corrección de alcance y autoridad

Este documento corrige un error de interpretación de la V2: S1–S13 son el **primer nivel**, no el curso entero. El alcance vinculante es S1–S52. El roadmap define la arquitectura, los requisitos y los gates; no declara escritos los guiones, ejercicios, bancos, datasets ni archivos de plataforma que todavía no existen.

La evidencia fuente es inequívoca: el requisito original llama a S1–S13 “first-level” y pide otros niveles. La causa raíz fue convertir el primer nivel en un programa completo al consolidar el roadmap. La reparación preserva lo rescatable de la V2 —alineamiento, privacidad, separación entre entity resolution y relationship scoring, tres intentos y proyecto progresivo— y lo distribuye en cuatro niveles reales.

## Contrato curricular cuantificado

| Activo | Por sección | Por nivel | Curso |
|---|---:|---:|---:|
| Secciones | 1 | 13 | 52 |
| Temas | 4 | 52 | 208 |
| Subtemas, 2 por tema | 8 | 104 | 416 |
| Demos I Do, 1 por subtema | 8 | 104 | 416 |
| Ejercicios, 3 por subtema | 24 | 312 | 1,248 |
| Evaluaciones de tema | 4 | 52 | 208 |
| Familias A/B/C | 8 | 104 | 416 |
| Variantes almacenadas | 24 | 312 | 1,248 |
| Exámenes de sección | 1 | 13 | 52 |
| Ítems mostrados por intento | 8 | 104 | 416 |
| Máximo de respuestas en 3 intentos | 24 | 312 | 1,248 |
| Incrementos de proyecto | 1 | 13 | 52 |
| Capstones de nivel | — | 3 | 12 |
| Capstone final transversal | — | — | 1 |

Un “tema” contiene exactamente dos subtemas evaluables. En cada línea `Tn`, el contenido antes del punto y coma es `U1` y el contenido posterior es `U2`; el ID estable es `Sxx.Tn.U1/U2`. Cada subtema contiene un I Do y tres ejercicios: E1 es We Do guiado, E2 es You Do con andamiaje decreciente y E3 es transferencia independiente. Los demos no se cuentan como ejercicios. Cada tema suma exactamente seis ejercicios y termina con una evaluación auténtica que cubre ambos subtemas.

## Progresión de niveles

| Nivel | Secciones | Entrada | Salida verificable |
|---|---|---|---|
| 1 | S1–S13 | Novato | Principiante avanzado capaz de construir, probar y explicar un paquete de datos y un dashboard de evidencia con revisión humana |
| 2 | S14–S26 | Principiante avanzado | Competente capaz de analizar datos, automatizar Office/web/documentos e integrar IA con controles |
| 3 | S27–S39 | Competente | Experto capaz de diseñar ER, grafos y ML responsable, medir errores y operar pipelines robustos |
| 4 | S40–S52 | Experto | Máster capaz de desplegar, gobernar, observar y defender un sistema de datos/ML/IA de extremo a extremo |

La promoción exige aprobar las 13 secciones, los tres gates de capstone, la regresión del nivel y el checkpoint transversal CF correspondiente en N1–N3; N4 exige CF-4 y CF-5 antes de S52. El examen no compensa un capstone fallido ni viceversa.

## Trece capstones con evidencia de CV

| ID | Gate | Capstone | Evidencia publicable |
|---|---|---|---|
| CP-N1-A | S4 | Client Intake & Data Quality Script | script stdin/stdout, entradas sintéticas, validación, README y demo |
| CP-N1-B | S8 | Client/Transaction ETL Pipeline | scripts, contratos CSV/JSON, cuarentena, pruebas y lineage |
| CP-N1-C | S13 | Familiarity Evidence Dashboard | ER separado, señales explicables, geodatos, revisión humana y ficha de privacidad |
| CP-N2-A | S17 | Executive Data Quality & EDA Portfolio | notebook reproducible, reconciliación, métricas y memo ejecutivo |
| CP-N2-B | S21 | Accessible Insights Dashboard & Reporting Factory | dashboard accesible, reporte templado, tablas/gráficos y trazabilidad |
| CP-N2-C | S26 | VP RPA + AI Analyst | Excel → análisis → informe → aprobación → borrador de correo, con rollback |
| CP-N3-A | S30 | Testable Entity Resolution Engine | bloqueo, comparadores, evaluación etiquetada y cola de revisión |
| CP-N3-B | S34 | Relationship Investigation Workbench | grafo explicable, búsqueda de caminos, casos y controles de privacidad |
| CP-N3-C | S39 | Responsible ML Case Triage | baseline, calibración, umbral, abstención, model card y monitoreo |
| CP-N4-A | S43 | Governed Python Service Platform | API versionada, contratos, auth, contenedores y pruebas |
| CP-N4-B | S47 | Production Data/ML Platform | CI/CD, orquestación, registro, serving y rollback |
| CP-N4-C | S51 | Auditable AI Operations Copilot | RAG/agentes, evals, tool policies, observabilidad y control humano |
| CP-FINAL | S52 | Enterprise Relationship & Operations Intelligence Platform | integración de los 12, demo reproducible, arquitectura, tests, system card y caso de impacto para CV |

“Wow factor” significa un producto que otra persona puede ejecutar y evaluar: URL o demo local, datos sintéticos, escenario de negocio, arquitectura, decisiones, métricas, pruebas, limitaciones y video corto. No significa afirmar impacto, precisión o experiencia no demostrados.

## Ciclo obligatorio repetido en S1, S2, …, S52

Cada sección atraviesa, sin saltos:

1. **RESEARCH**: cuatro rondas —fuente primaria, benchmark curricular, práctica real y pedagogía— por cada subtema.
2. **OUTCOMES_LOCKED**: ocho resultados observables, prerrequisitos y criterio de dominio.
3. **BLUEPRINT_LOCKED**: cuatro temas, ocho subtemas, demos, 24 ejercicios, cuatro evaluaciones, ocho familias A/B/C y el incremento de capstone.
4. **CONTENT_AUTHORED**: teoría, modelos mentales, demos, errores frecuentes, casos borde, seguridad y fuentes.
5. **PRACTICE_AUTHORED**: 24 ejercicios manualmente redactados, con starter, tres pistas graduadas, solución, tests y feedback.
6. **ASSESSMENTS_AUTHORED**: cuatro evaluaciones auténticas y 24 variantes A/B/C con claves y racionales.
7. **TECHNICALLY_VERIFIED**: todo código, solución, opción y salida se ejecuta en su entorno declarado.
8. **EQUIVALENCE_REVIEWED**: dos revisores resuelven A/B/C sin ver las claves y aplican la rúbrica de paralelismo.
9. **ACCESSIBILITY_FAIRNESS_REVIEWED**: WCAG 2.2 AA, carga lingüística y barreras ajenas al constructo.
10. **PILOTED_OR_PROVISIONAL**: métricas empíricas o etiqueta explícita de provisional por falta de muestra.
11. **RELEASED**: cero P0/P1 conocidos, ledger y trazabilidad completos.
12. **RETROSPECTIVE_COMPLETE**: fallos, causas, reparación y cambios para la siguiente sección.

No se inicia S(n+1) hasta cerrar la retrospectiva de S(n). “Cero errores” se operacionaliza como cero P0/P1 conocidos tras las pruebas definidas; no como una promesa imposible de ausencia absoluta de defectos.

## Contrato de ejercicios y evaluaciones

Cada ejercicio declara ID, outcome, nivel cognitivo, contexto, inputs/outputs, entorno, starter, aceptación, casos normal/borde/error, tres pistas, solución, tests, feedback y vínculo al capstone. E1 muestra proceso; E2 retira parte del apoyo; E3 cambia el contexto y exige transferencia.

Cada evaluación de tema contiene dos tareas auténticas —una por subtema— y una rúbrica 0–3 de corrección, robustez, mantenibilidad y uso responsable. Gate provisional: 9/12, sin criterio crítico menor que 2 y con todas las pruebas críticas aprobadas.

Las dos tareas forman un único artefacto integrado y se califican conjuntamente una sola vez sobre 12; no se suman dos rúbricas de 12. El examen de sección exige ≥70% y 100% de los ítems marcados críticos. Tras tres fallos se requiere ruta remedial y revisión antes de desbloquear la siguiente sección.

Cada examen muestra exactamente un ítem de cada subtema. A/B/C son formas paralelas, no niveles. Cada trío conserva outcome, constructo, Bloom, prerrequisitos, formato, puntuación, entorno, complejidad y tiempo objetivo. Cambian datos y contexto, no el razonamiento requerido. El servidor entrega una variante no usada por intento, hasta tres intentos; nunca expone claves ni variantes futuras.

Gate de revisión manual A/B/C: dos revisores, 10 dimensiones 0–2, promedio mínimo 18/20, ningún cero y acuerdo perfecto en constructo, outcome, demanda cognitiva y puntuación. Antes de n=50 por variante solo se declara equivalencia cualitativa; cualquier conclusión estadística queda provisional.

Los capstones se califican: corrección 35%, datos/casos borde 20%, pruebas 15%, diseño 10%, reproducibilidad 10% y comunicación/límites 10%. Gate: ≥80%, todos los criterios de aceptación y cero falla crítica de seguridad, privacidad, secretos, SQL inseguro o inferencia automática indebida.

Una regresión de nivel ejecuta todos los tests críticos de sus tres capstones, E2E de integración, un ítem de recuperación por tema anterior y controles de privacidad/seguridad. Gate: cero fallas críticas y ≥80% de la evidencia no crítica.

La regresión total de S52 es la unión de las cuatro regresiones de nivel, más E2E de CP-FINAL, contract tests entre capstones y ejercicios de seguridad, privacidad, backup y rollback. Gate: cero fallas críticas y ≥80% de la evidencia no crítica; un nivel o contrato fallido no se compensa con otro.

Los checkpoints transversales son gates, no notas informales:

| Gate | Artefacto/evidencia versionada | Criterio `PASS` y bloqueo |
|---|---|---|
| CF-1 · S13 | stakeholders, jobs-to-be-done, métricas de éxito, restricciones/no-go, contratos y demo base | owner/revisor identificados; trazabilidad completa; demo sintética y tests N1 verdes |
| CF-2 · S26 | interfaces Familiarity↔reporting↔RPA/IA, schemas y flujo de aprobación | contract tests y regresión N1/N2 verdes; ninguna PII enviada a proveedor público |
| CF-3 · S39 | contratos ER↔grafo↔triage, benchmark y cards preliminares | métricas/límites reproducibles, no leakage y revisión humana comprobada |
| CF-4 · S47 | arquitectura desplegable, lineage, SLO, rollback y evidencia de supply chain | staging/E2E/rollback pasan y artefactos se vinculan a revisiones inmutables |
| CF-5 · S51 | manifest de los doce capstones, interfaces congeladas, system cards y plan de demo/publicación | 12/12 artefactos localizables, regresión N4 verde y cero P0/P1 |

Cada checkpoint registra versión/revisión, fecha, responsable, revisor, paths/hashes, comandos, resultados y issues. Un CF abierto o sin evidencia bloquea el siguiente CF y bloquea S52.

## Entornos y prácticas transversales

- `browser-pyodide`: sintaxis y ejercicios sin sistema, red o binarios incompatibles.
- `local-python`: Git, venv, archivos, Excel, OCR, browser RPA, servicios y contenedores.
- `cloud-lab`: infraestructura, endpoints, colas, despliegue y observabilidad cuando sea necesario.

Desde S1: Git, README, dependencias fijadas y secretos fuera del repositorio. Desde S2: ejemplos comprobables. Desde S5: funciones pequeñas y type hints graduales. Desde S8: contratos de datos y provenance. Desde S9: logging sin PII. Desde S12: timeouts, rate limits, caching y SQL parametrizado. Desde S27: pytest sistemático; las pruebas simples empiezan antes. Desde S32: prevención de leakage. Desde S40: ADRs y fronteras. Desde S44: supply chain y rollback. Desde S49: evals y defensa contra prompt injection.

Los datos del dominio serán sintéticos o legalmente reutilizables. Coincidir en apellido, teléfono, email, dirección, distancia o transacciones es evidencia para revisión, no prueba de parentesco, colusión o fraude. Entity resolution, relationship evidence y risk triage son capas separadas, con métricas y decisiones humanas distintas.

## Nivel 1 — S1–S13 · Novato a principiante avanzado

### S1 — Entorno reproducible y trabajo seguro

**Prerrequisitos:** ninguno. **Entorno:** `local-python`. **Proyecto:** esqueleto de CP-N1-A.

- T1 Runtime: intérprete y REPL; terminal, rutas, procesos y códigos de salida.
- T2 Entornos: `venv` y activación; `pip`, versiones, lock/freeze y compatibilidad.
- T3 Git: repositorio, commits y diffs; ramas, PR, conflictos y recuperación no destructiva.
- T4 Calidad inicial: editor y Ruff; `.gitignore`, `.env.example`, secretos y README reproducible.

**Incremento/gate:** repositorio ejecutable en un equipo limpio, diccionario de datos y dataset sintético sin PII. El examen verifica selección de intérprete, aislamiento, lectura de diff y manejo de secretos.

### S2 — Valores, tipos, operadores e I/O

**Prerrequisito:** S1. **Entorno:** browser/local. **Proyecto:** parser de intake.

- T1 Valores: literales y tipos; inspección, conversión y validación explícita.
- T2 Nombres: asignación y convenciones; identidad, mutabilidad y copias al nivel necesario.
- T3 Operadores: aritmética, comparación y precedencia; dinero, `Decimal`, precisión y redondeo.
- T4 I/O: `input`, `print` y f-strings; parsing, mensajes de error y ejemplos comprobables.

**Incremento/gate:** capturar un registro sintético de cliente con nombres, dos apellidos, contacto y dirección, sin perder el valor original. Casos vacíos, Unicode y número inválido pasan pruebas.

### S3 — Decisiones y reglas de validación

**Prerrequisito:** S2. **Entorno:** browser/local. **Proyecto:** motor de reglas del intake.

- T1 Booleanos: comparaciones y pertenencia; truthiness y short-circuit.
- T2 Control: `if/elif/else`; guard clauses, anidamiento y ramas alcanzables.
- T3 Reglas: rangos, listas permitidas y combinaciones; decision tables y `match` cuando aporta claridad.
- T4 Verificación: invariantes y ejemplos; mensajes accionables y pruebas de ramas.

**Incremento/gate:** reglas explicables que aceptan, rechazan o ponen en revisión un campo; ninguna ausencia se confunde con valor falso válido.

### S4 — Iteración y resúmenes transaccionales

**Prerrequisito:** S3. **Entorno:** browser/local. **Proyecto:** cierre CP-N1-A.

- T1 Recorrido: `for`, `range` y secuencias; `enumerate` y `zip` sin desalinear datos.
- T2 Repetición: `while`, centinelas y terminación; `break`, `continue` y prevención de loops infinitos.
- T3 Patrones: contadores, acumuladores y búsqueda; comprehensions legibles.
- T4 Razonamiento: trazado de estado; costo lineal/cuadrático inicial y debugging de off-by-one.

**Incremento/gate:** **Client Intake & Data Quality Script** procesa múltiples registros por stdin/stdout, resume errores y tasas con denominadores correctos, conserva originales y pasa una demo reproducible. La CLI instalable llega en S10.

### S5 — Funciones, contratos y descomposición

**Prerrequisito:** S4. **Entorno:** browser/local. **Proyecto:** inicio CP-N1-B.

- T1 Funciones: definición, llamada y retorno; parámetros posicionales, keyword y defaults seguros.
- T2 Contratos: pre/postcondiciones y docstrings; type hints graduales y errores de dominio.
- T3 Diseño: funciones pequeñas y composición; pureza, efectos e inyección de I/O.
- T4 Alcance: LEGB y closures básicos; pruebas de ejemplo y refactor sin cambiar conducta.

**Incremento/gate:** normalizadores puros de nombre, email, teléfono y dirección, separados de lectura/escritura y con idempotencia demostrada.

### S6 — Colecciones y estructuras de datos

**Prerrequisito:** S5. **Entorno:** browser/local. **Proyecto:** modelo tabular en memoria.

- T1 Secuencias: listas y tuplas; slicing, unpacking, aliasing y copia.
- T2 Mapeos/conjuntos: diccionarios; deduplicación, pertenencia y operaciones de set.
- T3 Composición: estructuras anidadas; recorridos, acceso seguro y valores faltantes.
- T4 Elección: ordenamiento y `key`; estructura adecuada, complejidad intuitiva y determinismo.

**Incremento/gate:** representar clientes, contactos y transacciones; deduplicar sin eliminar conflictos y producir resultados estables.

### S7 — Texto, Unicode y expresiones regulares

**Prerrequisito:** S6. **Entorno:** browser/local. **Proyecto:** normalización latinoamericana.

- T1 Unicode: code points, normalización y casefold; tildes, `ñ`, partículas y apellidos compuestos.
- T2 Strings: split/join/search/replace; nombres, emails y teléfonos sin sobrevalidación.
- T3 Regex: patrones, grupos y anchors; compilación, extracción y límites de validación.
- T4 Similaridad inicial: exacta y por tokens; falsos positivos, falsos negativos y conservación de evidencia.

**Incremento/gate:** pipeline que conserva `raw` y `normalized`, registra transformaciones y maneja dos apellidos sin asumir una convención universal.

### S8 — Archivos, CSV, JSON y contratos de ingesta

**Prerrequisito:** S7. **Entorno:** `local-python`. **Proyecto:** cierre CP-N1-B.

- T1 Archivos: `pathlib`, `with`, modos y encodings; newlines y escritura atómica.
- T2 CSV: dialectos, headers y tipos; filas irregulares y cuarentena.
- T3 JSON: objetos/arrays y serialización; schema, nulls y evolución compatible.
- T4 Operación: backups, hashes y provenance; reconciliación input/output y manifest.

**Incremento/gate:** **Client/Transaction ETL Pipeline** ejecuta scripts de ingesta CSV/JSON, valida, separa rejects, emite manifest y pasa pruebas normal/borde/error. Se convierte en paquete durante S10.

### S9 — Excepciones, debugging y logging seguro

**Prerrequisito:** S8. **Entorno:** `local-python`. **Proyecto:** inicio CP-N1-C.

- T1 Excepciones: tipos específicos, `raise` y chaining; fronteras de recuperación y cleanup.
- T2 Diagnóstico: traceback y debugger; reproducción mínima, hipótesis y causa raíz.
- T3 Logging: niveles y estructura; correlation IDs y redacción de PII.
- T4 Resiliencia inicial: fallar rápido vs continuar; idempotencia, retries solo transitorios y cuarentena.

**Incremento/gate:** bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia fallo de datos, configuración y proveedor.

### S10 — Módulos, packaging y CLI profesional

**Prerrequisito:** S9. **Entorno:** `local-python`. **Proyecto:** paquete `familiarity_core`.

- T1 Módulos: imports, namespaces y `__main__`; dependencias cíclicas y API pública.
- T2 Paquetes: layout `src`, `pyproject.toml` y builds; versionado y compatibilidad.
- T3 CLI: `argparse`, subcomandos y exit codes; stdin/stdout/stderr y ayuda.
- T4 Configuración: archivo/env/flags y precedencia; secretos, defaults y validación temprana.

**Incremento/gate:** CLI `ingest`, `normalize`, `compare` y `report`; instalación limpia, ayuda útil, errores no ambiguos y lógica separada de I/O.

### S11 — OOP y modelo de dominio

**Prerrequisito:** S10. **Entorno:** `local-python`. **Proyecto:** dominio Cliente–Transacción–Evidencia.

- T1 Objetos: clases, instancias y `dataclass`; invariantes y estados válidos.
- T2 Encapsulación: propiedades y métodos; igualdad, hash y mutabilidad consciente.
- T3 Diseño: composición antes que herencia; protocolos y polimorfismo con propósito.
- T4 Límites: repositorios/servicios y serialización; dependencias y pruebas del dominio.

**Incremento/gate:** modelo que distingue `ClientRecord`, `ResolvedEntity`, `Transaction` y `RelationshipEvidence`; ninguna clase decide fraude o parentesco.

### S12 — APIs, SQL y geodatos responsables

**Prerrequisitos:** S8–S11. **Entorno:** local/cloud controlado. **Proyecto:** adquisición y geoseñales.

- T1 HTTP: requests/responses, status y JSON; timeout, paginación, retry/backoff y rate limit.
- T2 APIs: auth y secretos; cache, provenance, contract tests y fallback.
- T3 SQL: esquema, CRUD y joins; parámetros, transacciones, constraints e índices básicos.
- T4 Geodatos: normalización/geocoding autorizado; calidad de coordenada, Haversine/rutas, caching y política de proveedor.

**Incremento/gate:** adaptadores limitados a SQLite, HTTP síncrono, auth básica y un geocoder mock/intercambiable. La demo usa coordenadas sintéticas o precalculadas; no envía PII bancaria a servicios públicos. OAuth, async y proveedores productivos se difieren al Nivel 2.

### S13 — Familiarity Evidence Dashboard y cierre de nivel

**Prerrequisitos:** S1–S12. **Entorno:** local/cloud controlado. **Proyecto:** cierre CP-N1-C y regresión N1.

- T1 Identidad: normalización, blocking y entity resolution; verdad etiquetada, precision/recall y revisión clerical.
- T2 Relación: email/teléfono/dirección compartidos, distancia y apellidos; transacciones directas y contrapartes comunes.
- T3 Decisión: score de evidencia, incertidumbre y explicación; umbral de revisión, abstención y no inferencia automática.
- T4 Producto: dashboard/mapa pseudonimizado y ficha de caso; privacidad, acceso, pruebas, demo y runbook.

**Incremento/gate:** **Familiarity Evidence Dashboard** con ER determinista basado en reglas, datos sintéticos, `entity_resolution_score` separado de `relationship_signal_score`, geoevidencia trazable, revisión humana y límites explícitos. La UI usa un scaffold estático o plantilla proporcionada; el diseño visual completo se aprende en S19 y ER probabilístico en S30. Promoción: tres capstones N1, regresión S1–S13 y CF-1 aprobados. CF-1 fija stakeholders, jobs-to-be-done, métricas de éxito, restricciones/no-go, contratos y demo base de CP-FINAL.

## Nivel 2 — S14–S26 · Principiante avanzado a competente

### S14 — NumPy y cómputo vectorizado

**Prerrequisito:** Nivel 1. **Entorno:** local/browser compatible. **Proyecto:** inicio CP-N2-A.

- T1 Arrays: `ndarray`, dtype y shape; creación, indexación y máscaras.
- T2 Operaciones: ufuncs y reducciones; broadcasting y compatibilidad de shapes.
- T3 Semántica: views/copies y mutabilidad; NaN, inf y estabilidad numérica.
- T4 Rendimiento: vectorización frente a loops; memoria, medición y tests con tolerancia.

**Incremento/gate:** cálculo vectorizado de métricas de calidad y señales por pares, con benchmark honesto y resultados equivalentes al baseline.

### S15 — Pandas: ingesta, selección y tipos

**Prerrequisito:** S14. **Entorno:** local. **Proyecto:** dataset analítico reproducible.

- T1 Modelo: Series/DataFrame/index; lectura CSV/Excel y opciones de parser.
- T2 Selección: `loc/iloc`, filtros y assign; chained assignment y copy semantics.
- T3 Tipos: strings, nullable, fechas y categorías; coerción explícita y schema.
- T4 Exportación: CSV/Parquet/Excel; índices, formatos, provenance y memoria.

**Incremento/gate:** ingesta tipada de clientes/transacciones con reporte de coerciones y reconciliación de filas/columnas.

### S16 — Calidad, limpieza y contratos de datos

**Prerrequisito:** S15. **Entorno:** local. **Proyecto:** quality gate.

- T1 Ausencia: nulls y políticas por campo; indicadores y límites de imputación.
- T2 Duplicados: exactos y conflictos; claves, cardinalidad y conservación de evidencia.
- T3 Normalización: strings, números, fechas y categorías; outliers plausibles vs errores.
- T4 Contratos: reglas de schema y cross-field; métricas, cuarentena y audit trail.

**Incremento/gate:** suite de calidad que falla de forma explicable ante schema drift, cuantifica pérdida y nunca “arregla” silenciosamente un dato.

### S17 — Joins, reshape, groupby y cierre analítico

**Prerrequisito:** S16. **Entorno:** local. **Proyecto:** cierre CP-N2-A.

- T1 Joins: claves y cardinalidad; `validate`, duplicación accidental y anti-join.
- T2 Forma: concat, melt y pivot; long/wide y nombres estables.
- T3 Agregación: groupby/agg/transform; ventanas, fechas y cohortes.
- T4 Reconciliación: denominadores y totales; leakage temporal y controles antes/después.

**Incremento/gate:** **Executive Data Quality & EDA Portfolio** con dataset limpio, notebook/script reproducible, reconciliación, preguntas de negocio y memo de límites.

### S18 — EDA, estadística descriptiva e incertidumbre

**Prerrequisito:** S17. **Entorno:** local. **Proyecto:** inicio CP-N2-B.

- T1 Distribuciones: centro, dispersión y cuantiles; métricas robustas y escalas.
- T2 Muestreo: población/muestra y sesgo; intervalos básicos y tamaño de efecto.
- T3 Relaciones: correlación y confusión; segmentación, anomalías y causalidad no demostrada.
- T4 Flujo: preguntas, hipótesis y evidencia; notebook reproducible y data notes.

**Incremento/gate:** EDA que diferencia hallazgo, hipótesis y decisión; cada conclusión referencia un cálculo y declara incertidumbre.

### S19 — Visualización y comunicación accesible

**Prerrequisito:** S18. **Entorno:** local/browser. **Proyecto:** dashboard ejecutivo.

- T1 Diseño: pregunta, audiencia y chart choice; ejes, escalas y encodings honestos.
- T2 Estático: Matplotlib/Seaborn; composición, annotations y exportación reproducible.
- T3 Interactivo: Plotly/filtros/tooltips; estado, performance y alternativas accesibles.
- T4 Narrativa: unidades, fuente y limitaciones; color, contraste, texto alternativo y no sobreclaim.

**Incremento/gate:** cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente.

### S20 — Automatización robusta de Excel

**Prerrequisitos:** S17–S19. **Entorno:** local. **Proyecto:** reporting factory.

- T1 Workbooks: sheets, celdas, tablas y named ranges; fórmulas vs valores cacheados.
- T2 Formato: estilos, charts y plantillas; fechas, locales, celdas combinadas y protección.
- T3 Análisis: conciliación y pivots; reglas de validación y preservación de estructura.
- T4 Operación: batch, archivos corruptos y locks; backups, idempotencia y pruebas visuales/estructurales.

**Incremento/gate:** adaptador que lee los formatos sintéticos del VP, produce un workbook de resultados sin dañar la plantilla y deja manifest de cambios.

### S21 — Documentos, plantillas y reportes trazables

**Prerrequisito:** S20. **Entorno:** local. **Proyecto:** cierre CP-N2-B.

- T1 Templates: Jinja y separación datos/presentación; condiciones, tablas y formato seguro.
- T2 DOCX/PDF: estilos y secciones; extracción de PDF digital y detección de imagen/OCR.
- T3 Informe: resumen ejecutivo, método y hallazgos; gráficos, tablas, fuentes y limitaciones.
- T4 QA: redacción, accesibilidad y consistencia; render visual, provenance y aprobación.

**Incremento/gate:** **Accessible Insights Dashboard & Reporting Factory** genera dashboard, DOCX/PDF y workbook desde una corrida, con números reconciliados y revisión visual.

### S22 — Email, identidad y aprobación humana

**Prerrequisito:** S21. **Entorno:** local/sandbox proveedor. **Proyecto:** inicio CP-N2-C.

- T1 Mensaje: MIME, encoding, HTML/text y attachments; templates y sanitización.
- T2 Proveedor: OAuth/service account y scopes; drafts, expiración y adaptadores.
- T3 Destinatario: resolución y verificación; listas, CC/BCC, privacidad y mínima divulgación.
- T4 Workflow: approval queue y state machine; idempotencia, audit log y reintento sin duplicar.

**Incremento/gate:** crea borradores en sandbox o archivos `.eml`; ningún correo real se envía automáticamente y todo destinatario requiere confirmación.

### S23 — Browser RPA con Playwright

**Prerrequisito:** S22. **Entorno:** local. **Proyecto:** adaptador web del VP.

- T1 Navegación: DOM y locators orientados a usuario; auto-waiting y assertions.
- T2 Flujos: formularios, uploads/downloads y sesiones; auth, estados y Page Objects.
- T3 Diagnóstico: trace, screenshot y logs; selectores robustos, retries y recovery.
- T4 Límites: API/export primero; términos, CAPTCHA, desktop fallback y handoff humano.

**Incremento/gate:** robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y reanudación idempotente.

### S24 — OCR y Document AI

**Prerrequisito:** S23. **Entorno:** local. **Proyecto:** intake de documentos.

- T1 Imagen: DPI, deskew, crop y contraste; ruido y orientación.
- T2 OCR: idiomas, layout y confidence; texto, tablas y pares clave–valor.
- T3 Extracción: schema y normalización; validación cross-field y cola de revisión.
- T4 Evaluación: golden set sintético, exactitud por campo y cobertura; privacidad, archivos hostiles y fallback.

**Incremento/gate:** extrae campos de documentos sintéticos, conserva bounding boxes/evidencia, abstiene bajo confidence y mide cada campo crítico.

### S25 — Endpoints de IA, Hugging Face y prompting evaluado

**Prerrequisitos:** S21–S24. **Entorno:** local/cloud aprobado. **Proyecto:** análisis asistido, no autónomo.

- T1 Selección: regla vs modelo especializado vs LLM; model cards, licencias y local/cloud.
- T2 Inferencia: Hugging Face pipelines/endpoints; batching, timeout, cache, costo y fallback.
- T3 Prompting: objetivo, contexto, restricciones, ejemplos y salida estructurada; GLM‑5.2 thinking/tools/checkpoints.
- T4 Evals/seguridad: golden set, schema y revisión humana; prompt injection, exfiltración, sesgo y minimización de datos.

**Incremento/gate:** clasificador/extractor especializado y generador de narrativa con JSON validado; no se acepta una salida sin evidencia ni eval contra baseline.

### S26 — Orquestación y VP RPA + AI Analyst

**Prerrequisitos:** S14–S25. **Entorno:** local/cloud controlado. **Proyecto:** cierre CP-N2-C y regresión N2.

- T1 Orquestación: tasks/flows/DAG y estados; límites, metadata y schedules.
- T2 Resiliencia: checkpoints, retry/backoff y dead-letter; idempotencia, concurrencia y rollback.
- T3 Human-in-the-loop: revisión de análisis/reporte/destinatario; aprobación, rechazo, edición y auditoría.
- T4 Operación: SLO, alerts y runbook; pruebas end-to-end, seguridad, costo y métricas de valor.

**Incremento/gate:** **VP RPA + AI Analyst**: Excel/sistema → validación → análisis → modelo/IA → informe → aprobación → borrador de correo. Demo con datos sintéticos, evidencia de cada estado y recuperación de fallas. Promoción: CP-N2-A/B/C, regresión S14–S26 y CF-2 aprobados. CF-2 fija interfaces entre Familiarity, reporting y automatización.

## Nivel 3 — S27–S39 · Competente a experto

### S27 — Estrategia de pruebas con pytest

**Prerrequisito:** Nivel 2. **Entorno:** local. **Proyecto:** inicio CP-N3-A.

- T1 Diseño: riesgos y pirámide; Arrange–Act–Assert y oráculos confiables.
- T2 Pytest: discovery/assertions y parametrización; fixtures, scopes y aislamiento.
- T3 Bordes: excepciones, floats, fechas y archivos temporales; casos negativos y mensajes.
- T4 Cobertura: branch/risk coverage; mutación conceptual, fallas útiles y mantenimiento.

**Incremento/gate:** convertir supuestos de normalización y matching en contratos ejecutables; cada bug reproducido obtiene test de regresión.

### S28 — Pruebas de datos, propiedades e integración

**Prerrequisito:** S27. **Entorno:** local/CI. **Proyecto:** QA del motor ER.

- T1 Propiedades: invariantes y generación de casos; idempotencia, simetría y metamorphic tests.
- T2 Datos: schema/quality contracts y golden datasets; drift y reconciliación.
- T3 Dobles: mocks/fakes de HTTP, DB y reloj; contract tests sin sobre-mocking.
- T4 Sistema: integración/E2E y test containers; flakes, determinismo y CI.

**Incremento/gate:** suite que encuentra errores de encoding, cardinalidad, orden, timeout y reanudación, con fixtures sintéticas mínimas.

### S29 — SQL avanzado y modelado relacional

**Prerrequisitos:** S12 y S28. **Entorno:** local DB. **Proyecto:** almacén de verdad ER.

- T1 Modelo: claves, constraints y normalización; temporalidad y provenance.
- T2 Consulta: CTEs, windows y anti-joins; cardinalidad, NULL y planes.
- T3 Transacción: ACID e isolation; upserts, concurrencia y recuperación.
- T4 Evolución: índices y migrations; repository pattern, pooling y pruebas.

**Incremento/gate:** esquema que preserva registros fuente, entidades, pares candidatos, decisiones y evidencia sin sobrescribir historia.

### S30 — Entity resolution probabilístico

**Prerrequisitos:** S7, S13 y S29. **Entorno:** local. **Proyecto:** cierre CP-N3-A.

- T1 Normalización/comparadores: exact, edit/token y fecha; missingness informativa y frecuencia.
- T2 Blocking: reglas y candidate recall; combinaciones, costo y pares imposibles.
- T3 Matching: pesos/probabilidad y thresholds; entrenamiento/estimación, clerical review y cluster consistency.
- T4 Evaluación: labeled pairs y splits por entidad; precision/recall, pairwise/cluster metrics y error slices.

**Incremento/gate:** **Testable Entity Resolution Engine** con benchmark etiquetado sintético, blocking medido, comparadores explicables y cola de revisión. ER solo decide “misma entidad”; no relación ni riesgo.

### S31 — Grafos y evidencia relacional

**Prerrequisito:** S30. **Entorno:** local. **Proyecto:** inicio CP-N3-B.

- T1 Modelo: nodos, aristas, dirección y peso; multigrafo, tiempo y provenance.
- T2 Construcción: clientes/entidades/transacciones/contactos; deduplicación y agregación sin borrar detalle.
- T3 Algoritmos: grado, componentes y caminos; centralidad con interpretación limitada.
- T4 Calidad: subgrafos y pruebas; visualización, escalabilidad, privacidad y evidencia por arista.

**Incremento/gate:** grafo temporal que responde “cómo están conectados” con un camino reproducible y no convierte centralidad en culpabilidad.

### S32 — Feature engineering y pipelines sin leakage

**Prerrequisito:** S31. **Entorno:** local. **Proyecto:** features de caso.

- T1 Features: numéricas/categóricas/texto; missing indicators, escalamiento y encoding.
- T2 Relacionales: shared contact/address, distance y graph features; ventanas y frecuencia.
- T3 Pipelines: `ColumnTransformer` y custom transformers; fit/transform y persistencia.
- T4 Validación: split por entidad/grupo/tiempo; leakage, train–serve skew y versionado.

**Incremento/gate:** tabla de features versionada cuya construcción en train e inferencia es idéntica y no usa información futura o de decisión.

### S33 — ML supervisado y baselines responsables

**Prerrequisito:** S32. **Entorno:** local. **Proyecto:** baseline del workbench.

- T1 Framing: unidad, target y horizonte; costos, baseline de regla y dummy estimator.
- T2 Lineales: regresión/logística y regularización; coeficientes, supuestos y scaling.
- T3 Árboles/ensambles: decisiones y random forest/boosting; overfit, profundidad y reproducibilidad.
- T4 Experimento: pipeline y tracking mínimo; validación cruzada apropiada y error analysis.

**Incremento/gate:** comparación honesta que conserva el baseline determinista y demuestra cuándo el ML agrega —o no agrega— valor.

### S34 — Métricas, desbalance, calibración y umbrales

**Prerrequisito:** S33. **Entorno:** local. **Proyecto:** cierre CP-N3-B.

- T1 Métricas: confusion matrix, precision/recall/F-score y PR-AUC; top-k y carga de revisión.
- T2 Desbalance: class weights y resampling dentro de CV; prevalencia y métricas engañosas.
- T3 Calibración: reliability curves y Brier; calibradores y evaluación fuera de muestra.
- T4 Decisión: threshold por costo/capacidad; abstención, slices y sensibilidad.

**Incremento/gate:** **Relationship Investigation Workbench** combina grafo y evidencia con ranking calibrado para revisión, explica cada caso y registra decisiones; no etiqueta fraude automáticamente.

### S35 — Explicabilidad, equidad e incertidumbre

**Prerrequisito:** S34. **Entorno:** local. **Proyecto:** inicio CP-N3-C.

- T1 Explicación: coeficientes e importancia por permutación; explicación local, correlación y límites.
- T2 Equidad: cohortes y métricas por slice; proxies, sample size y daño diferencial.
- T3 Incertidumbre: calibración, intervalos/conformal conceptualmente; out-of-distribution y abstención.
- T4 Gobernanza: model card y contestabilidad; aprobación, override, apelación y retiro.

**Incremento/gate:** ficha de caso que distingue evidencia observada, contribución del modelo, incertidumbre y decisión humana.

### S36 — Clustering, anomalías y validación temporal

**Prerrequisito:** S35. **Entorno:** local. **Proyecto:** señales no supervisadas.

- T1 Clustering: escalamiento y k-means/density; elección, estabilidad y métricas limitadas.
- T2 Dimensión: PCA y visualización; interpretación prudente de proyecciones.
- T3 Anomalías: Isolation Forest/LOF y reglas; novelty vs outlier y contamination.
- T4 Tiempo: splits/backtests y ventanas; labels escasos, precision@k y revisión humana.

**Incremento/gate:** señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida.

### S37 — Profiling, algoritmos y rendimiento

**Prerrequisito:** S36. **Entorno:** local. **Proyecto:** escala del triage.

- T1 Medición: wall/CPU y memory profiling; benchmark fixture, warmup y variabilidad.
- T2 Algoritmos: complejidad y blocking; estructuras, vectorización y reducción de candidatos.
- T3 Memoria/I/O: dtypes, chunking y columnar; caching, invalidación y out-of-core.
- T4 Regresión: performance budget y tests; costo total, claridad y no microoptimización.

**Incremento/gate:** reporte antes/después con mismo resultado, dataset, hardware y límites; optimización reversible y justificada.

### S38 — Concurrencia, observabilidad y workflows resilientes

**Prerrequisito:** S37. **Entorno:** local/cloud controlado. **Proyecto:** operación del triage.

- T1 Concurrencia: threads/processes/async; I/O vs CPU, GIL y serialización.
- T2 Control: pools, backpressure y rate limits; cancelación, timeout y recursos.
- T3 Observabilidad: logs, metrics y traces; correlation, redacción y SLI/SLO.
- T4 Resiliencia: states, checkpoint y idempotencia; retry, dead-letter, replay y runbook.

**Incremento/gate:** pipeline reanudable con trace por caso, métricas de cola y manejo probado de proveedor lento, proceso caído y reejecución.

### S39 — Responsible ML Case Triage y cierre de nivel

**Prerrequisitos:** S27–S38. **Entorno:** local/cloud controlado. **Proyecto:** cierre CP-N3-C y regresión N3.

- T1 Arquitectura: intake → ER → relación → features → modelo; contratos, versiones y ownership.
- T2 Revisor: queue, evidence packet y explicación; decisión, override, feedback y apelación.
- T3 Riesgo: privacidad, fairness y seguridad; drift, incidentes, rollback y human control.
- T4 Producto: aceptación y demo; model/data/system cards, métricas de valor y postmortem.

**Incremento/gate:** **Responsible ML Case Triage** con baseline, calibración, capacidad de abstenerse, monitoreo y revisión. Promoción: CP-N3-A/B/C, regresión S27–S39 y CF-3 aprobados. CF-3 integra contratos de ER/grafo/triage y ejecuta regresión cruzada.

## Nivel 4 — S40–S52 · Experto a máster

### S40 — Arquitectura, DDD y decisiones técnicas

**Prerrequisito:** Nivel 3. **Entorno:** local. **Proyecto:** inicio CP-N4-A.

- T1 Calidad: requisitos funcionales y quality attributes; trade-offs, riesgos y criterios medibles.
- T2 Fronteras: cohesión/coupling y capas; ports/adapters y dependencia hacia dominio.
- T3 Dominio: bounded contexts y lenguaje ubicuo; entities, value objects y servicios.
- T4 Decisiones: diagramas C4/flujo y ADRs; APIs, eventos, deuda y evolución compatible.

**Incremento/gate:** mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos.

### S41 — APIs con FastAPI y contratos HTTP

**Prerrequisito:** S40. **Entorno:** local. **Proyecto:** servicio gobernado.

- T1 HTTP/OpenAPI: recursos, métodos y status; idempotencia, paginación y versionado.
- T2 FastAPI: routing, dependencies y modelos; validación, serialización y documentación.
- T3 Ejecución: sync/async y background boundaries; errores, timeouts y lifecycle.
- T4 Pruebas: unit/contract/integration; compatibility, rate limit y observabilidad.

**Incremento/gate:** API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas.

### S42 — Schemas, seguridad y privacidad de servicios

**Prerrequisito:** S41. **Entorno:** local. **Proyecto:** control plane.

- T1 Schemas: Pydantic y JSON Schema; evolución, discriminated unions y validación de negocio.
- T2 Identidad: authn/authz y RBAC; scopes, service identities y deny-by-default.
- T3 Seguridad: input limits, injection y SSRF/path traversal; secretos, cifrado y dependency risk.
- T4 Privacidad: minimización, purpose y retención; audit, deletion, pseudonymization y acceso.

**Incremento/gate:** threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted.

### S43 — Contenedores y reproducibilidad operativa

**Prerrequisito:** S42. **Entorno:** local con contenedores. **Proyecto:** cierre CP-N4-A.

- T1 Imágenes: Dockerfile, layers y cache; bases, usuarios no root y tamaño.
- T2 Runtime: config, secrets y volumes; networking, health checks y signals.
- T3 Compose: API/worker/DB/cache; dependencias, migrations y datos efímeros.
- T4 Reproducibilidad: locks y multi-stage builds; scanning, resource limits y debugging.

**Incremento/gate:** **Governed Python Service Platform** levanta con un comando, ejecuta tests/health checks, usa usuario no root y documenta configuración y recuperación.

### S44 — CI/CD y seguridad de la cadena de suministro

**Prerrequisito:** S43. **Entorno:** CI/cloud controlado. **Proyecto:** inicio CP-N4-B.

- T1 CI: lint/types/tests y matrices; caches, artifacts y condiciones.
- T2 Seguridad: permisos mínimos, pinning y secret scanning; SBOM, provenance y attestations.
- T3 CD: environments y approvals; migrations, canary/blue-green y rollback.
- T4 Gobierno: branch/review policy y release notes; failure handling y evidencia auditable.

**Incremento/gate:** pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback en entorno de prueba.

### S45 — Cloud, almacenamiento, colas e infraestructura

**Prerrequisito:** S44. **Entorno:** cloud-lab o emulador. **Proyecto:** arquitectura distribuida mínima.

- T1 Persistencia: object store, relacional y cache; consistencia, lifecycle y backups.
- T2 Mensajería: queue/event y delivery semantics; dedup, ordering y dead-letter.
- T3 Plataforma: compute, autoscaling y networking; IAM, private paths y egress.
- T4 Infraestructura: configuración declarativa y environments; costos, quotas, recovery y portability.

**Incremento/gate:** job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados.

### S46 — Ingeniería de datos y orquestación de producción

**Prerrequisito:** S45. **Entorno:** local/cloud. **Proyecto:** pipeline production-grade.

- T1 Batch/stream: ventanas, event time y watermarks; late data y exactly-once como propiedad compuesta.
- T2 Orquestación: DAG/assets y dependency; schedules, backfills y state recovery.
- T3 Calidad/linaje: contracts y freshness; lineage, observability y ownership.
- T4 Operación: partitions y incremental loads; SLO, incidentes y data recovery.

**Incremento/gate:** pipeline incremental/backfillable cuya reejecución no duplica, registra lineage y alerta por dato tardío o contrato roto.

### S47 — MLOps: experimentos, registro y serving

**Prerrequisito:** S46. **Entorno:** local/cloud. **Proyecto:** cierre CP-N4-B.

- T1 Experimentos: tracking y reproducibilidad; data/code/env lineage y comparación.
- T2 Registro: firmas, stages y approvals; artefactos, model card y compatibilidad.
- T3 Serving: batch/online y feature consistency; latency, batching y fallback.
- T4 Entrega: shadow/canary y monitoring hooks; rollback, retirement y audit.

**Incremento/gate:** **Production Data/ML Platform** promueve un modelo desde experimento hasta servicio solo tras gates, conserva lineage y revierte sin perder decisiones. CF-4 valida la ruta desplegable de los capstones previos.

### S48 — LLM applications y RAG con evidencia

**Prerrequisito:** S47. **Entorno:** local/cloud aprobado. **Proyecto:** inicio CP-N4-C.

- T1 Representación: embeddings y similarity; límites, versiones y evaluación.
- T2 Ingesta: chunking, metadata y dedup; ACL, deletion y provenance.
- T3 Retrieval: lexical/vector/hybrid y reranking; contexto, citas y permisos.
- T4 Generación: structured output y grounding; retrieval eval, answer eval, costo y abstención.

**Incremento/gate:** asistente responde sobre documentación autorizada, cita fragmentos verificables y se abstiene cuando retrieval no sostiene la respuesta.

### S49 — Agentes, herramientas y context engineering

**Prerrequisito:** S48. **Entorno:** sandbox. **Proyecto:** workflow de herramientas.

- T1 Arquitectura: workflow vs agente; routing, planner/worker y evaluator–optimizer.
- T2 Herramientas: funciones de responsabilidad única; schema, permisos, idempotencia y errores.
- T3 Estado: contexto mínimo, retrieval just-in-time y checkpoints; memoria, compaction y last-known-good.
- T4 Control: stopping conditions y budgets; sandbox, human approval y recuperación.

**Incremento/gate:** agente acotado puede consultar casos/reportes y preparar una propuesta, pero no enviar, modificar producción ni decidir riesgo sin aprobación.

### S50 — Evals, red teaming y fiabilidad de IA

**Prerrequisito:** S49. **Entorno:** sandbox/CI. **Proyecto:** quality gate del copiloto.

- T1 Evals: task dataset y rubric; resultado, proceso, trajectory y recovery.
- T2 Jueces: graders deterministas/humanos/LLM; calibración, order bias y conjunto retenido.
- T3 Adversarial: prompt injection, exfiltración y tool misuse; indirect injection, data poisoning y least privilege.
- T4 Fiabilidad: hallucination y abstención; latency/cost/caching, incident response y rollback.

**Incremento/gate:** suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, no solo texto final.

### S51 — Observabilidad, gobernanza y UX del copiloto

**Prerrequisito:** S50. **Entorno:** local/cloud. **Proyecto:** cierre CP-N4-C.

- T1 Observabilidad: traces de prompts/retrieval/tools; tokens, costo, latency y redacción.
- T2 Gobierno: registro de modelo/prompt/dataset; cambio, acceso, retención y auditoría.
- T3 Operación: SLO, feedback y drift; incidents, rollback y postmortem.
- T4 UX: incertidumbre, citas y confirmaciones; accesibilidad, corrección y contestabilidad.

**Incremento/gate:** **Auditable AI Operations Copilot** aprobado con system card y dashboard operativo que permiten saber qué versión respondió, qué evidencia usó, qué tool llamó y cómo revertirla. CF-5 congela artefactos e interfaces para integración final.

### S52 — Enterprise Relationship & Operations Intelligence Platform: capstone final

**Prerrequisitos:** S1–S51 y CP-N4-C aprobado. **Entorno:** reproducible local + despliegue demostrable. **Proyecto:** CP-FINAL exclusivamente.

- T1 Revalidación: stakeholders, jobs y success metrics definidos en CF-1; cambios, constraints, riesgos y no-go decisions.
- T2 Integración: bounded contexts, APIs y eventos; datos, modelos, RPA, RAG y human workflow.
- T3 Verificación: tests/evals/red team y performance; SLO, backup, rollback y disaster exercise.
- T4 Publicación: demo y narrativa CV; arquitectura, READMEs, cards, licencia, video y defensa técnica.

**Incremento/gate:** **Enterprise Relationship & Operations Intelligence Platform** integra, con contratos y datos sintéticos, Familiarity Dashboard, VP RPA/AI, ER/grafos/triage, reporting y copiloto. Se evalúa con rúbrica independiente de CP-N4-C; ninguno compensa al otro. El portafolio debe permitir ejecución reproducible, mostrar métricas antes/después en un benchmark sintético, documentar contribución personal y trade-offs, y demostrar controles de privacidad, seguridad y revisión humana. Promoción a máster: 52/52 secciones, 12/12 capstones de nivel, CP-FINAL y regresión S1–S52 aprobados, con cero P0/P1.

## Mapa explícito de repetición de fases

```text
N1: S01[R→O→B→C→PRA→ASM→TECH→EQ→AF→PLT→RLS→RET] → ... → S13[...] → regresión N1
N2: S14[R→O→B→C→PRA→ASM→TECH→EQ→AF→PLT→RLS→RET] → ... → S26[...] → regresión N2
N3: S27[R→O→B→C→PRA→ASM→TECH→EQ→AF→PLT→RLS→RET] → ... → S39[...] → regresión N3
N4: S40[R→O→B→C→PRA→ASM→TECH→EQ→AF→PLT→RLS→RET] → ... → S52[...] → regresión total
```

Leyenda: research, outcomes, blueprint, content, practice, assessments, technical verification, equivalence, WCAG/fairness, piloted/provisional, release y retrospective. La flecha solo existe si el gate anterior pasa. El ledger debe contener 52 filas y evidencia por estado; una lista de headings no prueba que las fases ocurrieron.

El mapa usa `...` solo como abreviatura visual; no autoriza saltos. El ledger canónico compañero, `course_state_v3.json`, contiene una fila explícita para cada S01–S52 y una para cada uno de los 13 capstones. Estado de entrada a la ejecución secuencial:

| Sección | Estado actual | Próxima fase permitida |
|---|---|---|
| S01 | `BLOCKED_PLATFORM`; contenido candidato | resolver plataforma → ACCESSIBILITY/FAIRNESS → PILOTED/PROVISIONAL → RELEASED |
| S02 | `NOT_STARTED` | ninguna hasta S01 `RELEASED` + `RETROSPECTIVE_COMPLETE` |
| S03 | `NOT_STARTED` | ninguna hasta S02 cerrada |
| S04 | `NOT_STARTED` | ninguna hasta S03 cerrada; luego gate CP-N1-A |
| S05 | `NOT_STARTED` | ninguna hasta S04/CP-N1-A aprobados |
| S06 | `NOT_STARTED` | ninguna hasta S05 cerrada |
| S07 | `NOT_STARTED` | ninguna hasta S06 cerrada |
| S08 | `NOT_STARTED` | ninguna hasta S07 cerrada; luego gate CP-N1-B |
| S09 | `NOT_STARTED` | ninguna hasta S08/CP-N1-B aprobados |
| S10 | `NOT_STARTED` | ninguna hasta S09 cerrada |
| S11 | `NOT_STARTED` | ninguna hasta S10 cerrada |
| S12 | `NOT_STARTED` | ninguna hasta S11 cerrada |
| S13 | `NOT_STARTED` | ninguna hasta S12 cerrada; luego CP-N1-C → regresión N1 → CF-1 |
| S14 | `NOT_STARTED` | ninguna hasta CP-N1-C, regresión N1 y CF-1 `PASS` |
| S15 | `NOT_STARTED` | ninguna hasta S14 cerrada |
| S16 | `NOT_STARTED` | ninguna hasta S15 cerrada |
| S17 | `NOT_STARTED` | ninguna hasta S16 cerrada; luego gate CP-N2-A |
| S18 | `NOT_STARTED` | ninguna hasta S17/CP-N2-A aprobados |
| S19 | `NOT_STARTED` | ninguna hasta S18 cerrada |
| S20 | `NOT_STARTED` | ninguna hasta S19 cerrada |
| S21 | `NOT_STARTED` | ninguna hasta S20 cerrada; luego gate CP-N2-B |
| S22 | `NOT_STARTED` | ninguna hasta S21/CP-N2-B aprobados |
| S23 | `NOT_STARTED` | ninguna hasta S22 cerrada |
| S24 | `NOT_STARTED` | ninguna hasta S23 cerrada |
| S25 | `NOT_STARTED` | ninguna hasta S24 cerrada |
| S26 | `NOT_STARTED` | ninguna hasta S25 cerrada; luego CP-N2-C → regresión N2 → CF-2 |
| S27 | `NOT_STARTED` | ninguna hasta CP-N2-C, regresión N2 y CF-2 `PASS` |
| S28 | `NOT_STARTED` | ninguna hasta S27 cerrada |
| S29 | `NOT_STARTED` | ninguna hasta S28 cerrada |
| S30 | `NOT_STARTED` | ninguna hasta S29 cerrada; luego gate CP-N3-A |
| S31 | `NOT_STARTED` | ninguna hasta S30/CP-N3-A aprobados |
| S32 | `NOT_STARTED` | ninguna hasta S31 cerrada |
| S33 | `NOT_STARTED` | ninguna hasta S32 cerrada |
| S34 | `NOT_STARTED` | ninguna hasta S33 cerrada; luego gate CP-N3-B |
| S35 | `NOT_STARTED` | ninguna hasta S34/CP-N3-B aprobados |
| S36 | `NOT_STARTED` | ninguna hasta S35 cerrada |
| S37 | `NOT_STARTED` | ninguna hasta S36 cerrada |
| S38 | `NOT_STARTED` | ninguna hasta S37 cerrada |
| S39 | `NOT_STARTED` | ninguna hasta S38 cerrada; luego CP-N3-C → regresión N3 → CF-3 |
| S40 | `NOT_STARTED` | ninguna hasta CP-N3-C, regresión N3 y CF-3 `PASS` |
| S41 | `NOT_STARTED` | ninguna hasta S40 cerrada |
| S42 | `NOT_STARTED` | ninguna hasta S41 cerrada |
| S43 | `NOT_STARTED` | ninguna hasta S42 cerrada; luego gate CP-N4-A |
| S44 | `NOT_STARTED` | ninguna hasta S43/CP-N4-A aprobados |
| S45 | `NOT_STARTED` | ninguna hasta S44 cerrada |
| S46 | `NOT_STARTED` | ninguna hasta S45 cerrada |
| S47 | `NOT_STARTED` | ninguna hasta S46 cerrada; luego CP-N4-B → CF-4 |
| S48 | `NOT_STARTED` | ninguna hasta S47/CP-N4-B y CF-4 `PASS` |
| S49 | `NOT_STARTED` | ninguna hasta S48 cerrada |
| S50 | `NOT_STARTED` | ninguna hasta S49 cerrada |
| S51 | `NOT_STARTED` | ninguna hasta S50 cerrada; luego CP-N4-C → regresión N4 → CF-5 |
| S52 | `NOT_STARTED` | solo con S51 cerrada, CP-N4-C/regresión N4 y CF-1…CF-5 `PASS`; luego CP-FINAL y regresión total |

## Horas y carga: provisional hasta piloto

La V2 asignaba 240 horas al bloque que ahora se reconoce como primer nivel. Para mantener una relación creíble entre contenido, 24 ejercicios, evaluación y proyecto por sección, la planificación inicial es **960 horas curriculares** para S1–S52, más **80 horas adicionales** de endurecimiento y presentación de CP-FINAL: 1,040 horas de esfuerzo total estimado. No es una promesa de duración individual.

Cada sección parte de 16–24 horas según dificultad: ocho bloques de subtema, cuatro evaluaciones, examen/remediación y proyecto. Tras pilotar, se registra mediana, P25/P75, abandono y tiempo por activo; se ajusta alcance o soporte, no se falsifican horas para conservar un número comercial.

## Estado real de producción al 2026-07-15

| Activo | Estado |
|---|---|
| Arquitectura S1–S52 | Diseñada en este roadmap |
| Contrato de 208 temas/416 subtemas | Diseñado |
| 416 demos I Do | 8 demos de S1 en candidato; 408 de S2–S52 no producidos |
| 1,248 ejercicios | 24 de S1 en candidato; 1,224 de S2–S52 no producidos |
| 416 familias / 1,248 variantes | 8 familias/24 variantes de S1 en revalidación; 408/1,224 no producidas |
| 52 exámenes y lógica de tres intentos | Especificados; no implementados por ausencia de repositorio |
| 13 capstones | Especificados; solo el primer incremento de CP-N1-A tiene fixture técnica candidata |
| Plataforma/navegación/persistencia | No auditable: no se entregó código fuente |
| Contenido existente por sección | S1 tiene candidato local; S2–S52 no fueron entregadas ni redactadas |

Esta distinción es obligatoria: el roadmap y el prompt no son el curso terminado.

## Fuentes principales y criterio de uso

Fuentes técnicas primarias se vuelven a investigar en cada sección y se fijan por versión. Los benchmarks curriculares se usan para cobertura y secuencia, no para copiar teoría, ejercicios o exámenes. Solo se utilizan repositorios/libros abiertos o autorizados; no se buscan PDFs pirateados.

- [Python 3.14 Tutorial](https://docs.python.org/3/tutorial/)
- [Python Packaging User Guide](https://packaging.python.org/en/latest/)
- [CS50P](https://cs50.harvard.edu/python/)
- [MIT 6.0001](https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/)
- [NumPy User Guide](https://numpy.org/doc/stable/user/)
- [pandas User Guide](https://pandas.pydata.org/docs/user_guide/)
- [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)
- [pytest](https://docs.pytest.org/en/stable/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Prefect](https://docs.prefect.io/v3/)
- [Playwright Python](https://playwright.dev/python/)
- [Hugging Face Inference Endpoints](https://huggingface.co/docs/inference-endpoints/)
- [Full Stack Deep Learning](https://fullstackdeeplearning.com/course/2022/)
- [Stanford CS329S](https://stanford-cs329s.github.io/)
- [Made With ML](https://madewithml.com/courses/mlops/)
- [GLM‑5.2](https://docs.z.ai/guides/llm/glm-5.2)
- [GLM Thinking Mode](https://docs.z.ai/guides/capabilities/thinking-mode)
- [GLM‑5.2 Migration](https://docs.z.ai/guides/overview/migrate-to-glm-new)
- [The Prompt Report](https://arxiv.org/abs/2406.06608)
- [ReAct](https://arxiv.org/abs/2210.03629)
- [Self-Refine](https://arxiv.org/abs/2303.17651)
- [Reflexion](https://arxiv.org/abs/2303.11366)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Long-running Agent Harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [OpenAI: Evaluation Best Practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- [AERA/APA/NCME Testing Standards](https://www.testingstandards.net/open-access-files.html)
- [NBME Item-Writing Guide](https://www.nbme.org/educators/item-writing-guide)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [CAST UDL Guidelines 3.0](https://udlguidelines.cast.org/)
- [Splink Entity Resolution](https://moj-analytical-services.github.io/splink/)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
