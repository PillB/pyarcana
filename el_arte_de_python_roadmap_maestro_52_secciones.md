# El Arte de Python — Roadmap Maestro Completo de 52 Secciones

## Propósito del documento

Este documento expande el roadmap previo de **El Arte de Python** sin eliminar su estructura ni sus objetivos, y lo convierte en un programa maestro de 52 secciones organizado en 4 niveles de 13 secciones cada uno.[file:1][web:150][web:151] La expansión conserva la lógica pedagógica ya definida en el roadmap original — teoría, relevancia laboral, I Do, We Do, You Do, autoevaluación, recursos y proyectos — y la refuerza con requisitos de evaluación más estrictos, integración por capstones y una secuencia de aprendizaje más cercana a programas aplicados de Python y data science orientados a portafolio.[file:1][web:130][web:131]

El diseño curricular asume que cada sección debe pasar por el mismo ciclo de trabajo: investigación previa, estrategia de sección, desarrollo de contenido, construcción de ejercicios, construcción de examen, validación aislada, root-cause analysis, fixing y entrega final.[web:121][web:148] Esto es especialmente apropiado para GLM-5.2 porque el modelo fue diseñado para tareas agentic de horizonte largo, con contexto de hasta 1 millón de tokens y soporte de structured outputs, lo que favorece mantener en el contexto el roadmap completo, el checklist, los issues abiertos y la sección actual sin fragmentación excesiva.[web:17][web:121]

## Principios curriculares no negociables

- Cada una de las 52 secciones mantiene la estructura pedagógica del roadmap previo: **Relevancia laboral**, **Objetivos**, **Temas de teoría**, **I Do**, **We Do**, **You Do**, **Autoevaluación** y **Recursos principales**.[file:1]
- Cada subtema debe tener 3 ejercicios; cada tema debe acumular al menos 6 ejercicios globales; cada sección debe incluir evaluación por tema y examen de sección.[file:1][web:130]
- Cada subtema del examen debe tener 3 preguntas pedagógicamente equivalentes: Variante A de comprensión, Variante B de aplicación y Variante C de análisis, mostrándose una por intento hasta un máximo de 3 intentos.[file:1][web:131]
- Cada sección debe conectarse explícitamente con un mini-deliverable de capstone o con un proyecto aplicado de portafolio de valor visible para CV, GitHub y demostración profesional.[file:1][web:150]
- Cada nivel debe tener 2 o 3 capstones intermedios y 1 capstone final de nivel; además, todo el programa culmina en un capstone global de alto impacto publicable.[file:1]
- La expansión preserva el capstone original del nivel 1 sobre **familiarity metrics** entre clientes y el proyecto pedido por el VP sobre **RPA + IA para análisis de Excels, reportes y emails**, integrándolos como piezas centrales del programa.[file:1]

## Metodología de prompting y research usada para este roadmap

El roadmap maestro adopta las mejores prácticas de prompting para GLM-5.2: contexto estable, tarea única por fase, restricciones explícitas, criterios de salida bien definidos y soporte para razonamiento de largo horizonte.[web:121] También se apoya en patrones de diseño instruccional guiados por Bloom y project-based learning, reforzados por recursos de Coursera, Applied Data Science with Python, IBM Python Project for Data Science y guías universitarias de actividades y evaluaciones.[web:150][web:151][web:131]

## Niveles del programa

| Nivel | Rango | Transformación esperada | Capstone final del nivel |
|---|---|---|---|
| Nivel 1 | Secciones 1–13 | Novato → Principiante avanzado | Familiarity Score Dashboard aplicado a clientes y transacciones.[file:1] |
| Nivel 2 | Secciones 14–26 | Principiante avanzado → Competente | Analytics Product con SQL, estadística, API y dashboard.[web:150][web:151] |
| Nivel 3 | Secciones 27–39 | Competente → Experto | Intelligent Data Platform con ML, NLP, streaming y despliegue.[web:148] |
| Nivel 4 | Secciones 40–52 | Experto → Master | Agentic AI & MLOps flagship system publicable.[web:121][web:148] |

## Checklist maestro de validación para las 52 secciones

### Contenido teórico
- Explicación completa de subtemas con claridad progresiva y relevancia laboral.[file:1]
- Demos I Do ejecutables o trasladables a notebook/proyecto.[file:1]
- Pitfalls, errores frecuentes, convenciones de código y buenas prácticas.[file:1]

### Práctica guiada
- 3 ejercicios por subtema.[file:1]
- 6 ejercicios totales o más por tema agregado.[file:1]
- Starter code, hints, solución, output esperado y criterio de corrección.[file:1]

### Evaluación
- Evaluación corta por tema.[file:1]
- Examen de sección con 3 variantes por subtema, 3 intentos máximos y 70% de aprobación.[file:1]
- Distractores plausibles, explicación de respuesta correcta y explicación de errores comunes.[web:130][web:131]

### Proyecto aplicado
- Mini-proyecto por sección.[file:1]
- Integración explícita con capstone de nivel o con repositorio de portafolio.[file:1]
- Criterios de aceptación, entregables, estructura sugerida de repo y rúbrica.[file:1]

---

## Nivel 1 — Secciones 1 a 13

### Sección 1 — Setup & Entorno de Desarrollo Profesional
**Objetivos**: instalar Python, VS Code, Git y entornos virtuales; entender aislamiento de dependencias; documentar setup reproducible.[file:1]  
**Subtemas**: instalación multiplataforma; `venv`; `pip` y `requirements.txt`; VS Code + extensiones; Git y GitHub; `.gitignore`; estructura inicial de proyecto.[file:1]  
**Mini-proyecto**: `python-project-bootstrapper` con README, `.gitignore`, `requirements.txt`, convenciones de commits y checklist de entorno.  
**Capstone-link**: prepara la estructura base del repositorio que alojará el Familiarity Score Dashboard.[file:1]  
**Requisitos de evaluación**: 3 ejercicios por subtema sobre venv, git y archivos base; examen con variantes sobre aislamiento, versionado y seguridad de `.env`.[file:1]

### Sección 2 — Python Absolute Basics
**Objetivos**: dominar variables, tipos, operadores, control de flujo y funciones simples para lógica de negocio inicial.[file:1]  
**Subtemas**: tipos primitivos; casting; condicionales; loops; funciones simples; truthiness; formateo básico.  
**Mini-proyecto**: `client-intake-checker` para validar campos mínimos de clientes.  
**Capstone-link**: implementa las primeras reglas de validación de nombre, teléfono, email y edad para el capstone de clientes.[file:1]  
**Requisitos de evaluación**: ejercicios sobre `if`, `for`, `while`, validación básica y composición de reglas; examen con 3 variantes por subtema y preguntas de debugging.[file:1]

### Sección 3 — Data Structures & File Handling
**Objetivos**: usar listas, diccionarios, sets, tuplas y leer/escribir CSV y JSON de forma robusta.[file:1]  
**Subtemas**: operaciones avanzadas de listas; diccionarios anidados; sets para deduplicación; módulo `csv`; módulo `json`; manejo de archivos; excepciones.[file:1]  
**Mini-proyecto**: `sales-log-parser` para transformar CSV en JSON resumido.  
**Capstone-link**: estructura de datos para cargar clientes y transacciones del proyecto de familiarity.[file:1]  
**Requisitos de evaluación**: ejercicios con estructuras anidadas, validación de JSON, lectura segura de CSV y manejo de errores; examen con variantes sobre `json.load`/`loads`, `with`, iteración de dicts y errores de archivos.[file:1]

### Sección 4 — Functions, Modules & Packaging
**Objetivos**: escribir funciones reutilizables, crear módulos, usar decorators, `pathlib` y `datetime`.[file:1]  
**Subtemas**: funciones avanzadas; `*args`/`**kwargs`; módulos; imports; decorators; `pathlib`; `datetime` y `timedelta`.[file:1]  
**Mini-proyecto**: `file-organizer` con logging y timing decorado.  
**Capstone-link**: crear módulo `familiarity_utils.py` con validación, normalización y decorators de logging.[file:1]  
**Requisitos de evaluación**: ejercicios guiados de decorators, rutas cross-platform y fechas; examen con variantes sobre `functools.wraps`, `if __name__ == '__main__'`, fechas y keyword-only args.[file:1]

### Sección 5 — Object-Oriented Python for Business Entities
**Objetivos**: modelar entidades reales con clases y dataclasses; encapsular reglas de negocio.  
**Subtemas**: clases; métodos; atributos; propiedades; composición; dataclasses; diseño de modelos de dominio.  
**Mini-proyecto**: `customer-transaction-models` con clases `Cliente`, `Transaccion` y `Relacion`.  
**Capstone-link**: crea el dominio OOP del Familiarity Score Dashboard.  
**Requisitos de evaluación**: ejercicios de modelado, validación, `__repr__`, `@property`, agregaciones y reglas de composición; examen con variantes sobre encapsulación, herencia mínima, dataclasses y diseño correcto de objetos.

### Sección 6 — NumPy y Pensamiento Vectorizado
**Objetivos**: comprender arrays, broadcasting y operaciones vectorizadas para acelerar cálculos.  
**Subtemas**: arrays; slicing; operaciones vectorizadas; máscaras booleanas; broadcasting; reducción; performance básica.  
**Mini-proyecto**: `vectorized-familiarity-scorer` para comparar múltiples clientes en lote.  
**Capstone-link**: cálculo vectorizado de coincidencias parciales entre atributos de clientes.  
**Requisitos de evaluación**: ejercicios sobre arrays y máscaras; examen con variantes sobre broadcasting, diferencia con listas y reducción de loops Python.

### Sección 7 — Adquisición de Datos para Data Science
**Objetivos**: consumir APIs, scrapear tablas HTML, consultar SQLite y usar regex, generators y collections.[file:1]  
**Subtemas**: generators; scraping con `requests` y BeautifulSoup; REST APIs; SQL con SQLite; regex; `collections`.[file:1]  
**Mini-proyecto**: `data-acquisition-pipeline` de 3 fuentes unificadas.[file:1]  
**Capstone-link**: ingesta de clientes/transacciones desde API, scraping, SQLite y primera geocodificación de direcciones.[file:1]  
**Requisitos de evaluación**: ejercicios sobre `yield`, paginación, SQL parametrizado, regex y `defaultdict`; examen con variantes sobre scraping responsable, `yield`, `re.findall` y seguridad SQL.[file:1][web:136]

### Sección 8 — Pandas Data Cleaning & EDA
**Objetivos**: cargar, limpiar, agrupar, combinar y analizar datasets con pandas.[file:1]  
**Subtemas**: `read_*`; inspección; nulos; strings; `groupby`; `merge`; pivots; fechas; EDA narrativo.[file:1]  
**Mini-proyecto**: `real-world-eda-report` sobre dataset de negocio.  
**Capstone-link**: limpieza y normalización de clientes, teléfonos, emails y transacciones del dashboard de familiarity.[file:1]  
**Requisitos de evaluación**: ejercicios sobre `groupby`, `merge`, limpieza y `dt`; examen con variantes sobre `.loc`/`.iloc`, nulos, joins y resampling.[file:1]

### Sección 9 — Data Visualization
**Objetivos**: comunicar insights con matplotlib, seaborn y plotly.[file:1]  
**Subtemas**: figuras y ejes; subplots; gráficos estadísticos; interactividad; anotaciones; exportación.  
**Mini-proyecto**: `familiarity-insights-report` con 4 gráficos estáticos y 1 interactivo.  
**Capstone-link**: visualización de clusters de clientes, scores y conexiones entre entidades.  
**Requisitos de evaluación**: ejercicios de storytelling, selección de gráficos y mejora de estética; examen con variantes sobre APIs de matplotlib, seaborn, export de plotly y heatmaps.[file:1]

### Sección 10 — scikit-learn Full ML Pipeline
**Objetivos**: construir pipelines de ML reproducibles y evaluar modelos con métricas relevantes.[file:1]  
**Subtemas**: train/test split; pipelines; preprocessors; clasificación; validación cruzada; métricas; tuning; interpretación.  
**Mini-proyecto**: `churn-prediction-pipeline`.  
**Capstone-link**: modelo auxiliar para priorizar relaciones sospechosas o segmentos relevantes del dashboard de familiarity.  
**Requisitos de evaluación**: ejercicios sobre Pipeline, ColumnTransformer, métricas, CV y SHAP; examen con variantes sobre RandomizedSearchCV, StratifiedKFold y parámetros dentro de pipelines.[file:1]

### Sección 11 — Testing Your Python Code
**Objetivos**: testear funciones, pipelines y estructuras de datos con pytest y CI.[file:1]  
**Subtemas**: filosofía de testing; pytest; fixtures; parametrización; tests para DataFrames; coverage; GitHub Actions.[file:1]  
**Mini-proyecto**: `test-suite-for-churn-and-familiarity`.  
**Capstone-link**: pruebas unitarias y de integración para módulos de comparación de clientes y scoring.  
**Requisitos de evaluación**: ejercicios sobre `assert`, fixtures y parametrización; examen con variantes sobre discovery de pytest, fixtures, coverage y CI.[file:1]

### Sección 12 — Performance, Concurrency & Logging
**Objetivos**: perfilar, optimizar, paralelizar y loggear pipelines reales.[file:1]  
**Subtemas**: profiling; multiprocessing; threading; structured logging; rotación de logs; CLI con `argparse`; packaging instalable.[file:1]  
**Mini-proyecto**: `performance-optimizer-cli`.  
**Capstone-link**: aceleración y observabilidad del pipeline de similarity/familiarity a escala.  
**Requisitos de evaluación**: ejercicios sobre profiling, ejecutores, logging y CLI; examen con variantes sobre ProcessPool vs ThreadPool, logging lazy y empaquetado.[file:1]

### Sección 13 — RPA & Automatización con IA
**Objetivos**: automatizar browsers, OCR, extracción estructurada y orquestación con flujos robustos.[file:1]  
**Subtemas**: panorama RPA; Playwright; automatización de archivos; OCR; LLM local/cloud; Hugging Face; Prefect y scheduling.[file:1]  
**Mini-proyecto**: `invoice-digitizer` o primer prototipo de bot contable.[file:1]  
**Capstone-link**: conecta el proyecto pedido por el VP: análisis de Excels, reportes y envío de emails asistidos por IA.[file:1]  
**Requisitos de evaluación**: ejercicios sobre scraping automatizado, extracción estructurada y retries; examen con variantes sobre Playwright, Ollama/OpenAI, OCR+LLM y task retries.[file:1]

### Capstones del Nivel 1
- **Capstone intermedio A**: Core Customer Matching Engine.  
- **Capstone intermedio B**: Geospatial Familiarity & Shared-Attributes Scoring.  
- **Capstone intermedio C**: Excel-to-Report Automation Prototype.  
- **Capstone final de nivel**: **Familiarity Score Dashboard** con ingestión de clientes y transacciones, geocodificación, shared attributes, network ties, score compuesto, visualización y reporte ejecutivo.[file:1][web:136]

---

## Nivel 2 — Secciones 14 a 26

### Sección 14 — SQL for Analysts
**Objetivos**: dominar SELECT, filtros, agregaciones y joins con mentalidad analítica.  
**Subtemas**: SELECT; WHERE; GROUP BY; HAVING; ORDER BY; JOINS; subqueries básicas.  
**Mini-proyecto**: `analyst-sql-casebook`.  
**Capstone-link**: primeras consultas analíticas del producto de analytics del nivel 2.  
**Requisitos de evaluación**: ejercicios de consultas sobre ventas/clientes; examen con variantes sobre joins, agregaciones y granularidad.

### Sección 15 — SQL Avanzado: CTEs, Window Functions y Modelado Analítico
**Objetivos**: resolver problemas analíticos complejos con SQL moderno.  
**Subtemas**: CTEs; window functions; ranking; moving windows; modelado estrella; tablas de hechos/dimensiones.  
**Mini-proyecto**: `kpi-warehouse-sandbox`.  
**Capstone-link**: capa semántica de métricas del producto analítico.  
**Requisitos de evaluación**: ejercicios con `ROW_NUMBER`, `LAG`, `SUM OVER`; examen con variantes de diseño y debugging SQL.

### Sección 16 — Data Modeling & Quality Foundations
**Objetivos**: diseñar schemas robustos y controles de calidad.  
**Subtemas**: modelado relacional; constraints; claves; data quality checks; profiling; validaciones de ingestión.  
**Mini-proyecto**: `data-quality-contracts`.  
**Capstone-link**: contratos de datos del producto analítico del nivel 2.  
**Requisitos de evaluación**: ejercicios sobre claves, constraints y reglas de validación; examen con variantes sobre nullability, unicidad y modelo analítico.

### Sección 17 — Statistical Thinking for Data Work
**Objetivos**: interpretar distribuciones, variabilidad y sesgo en decisiones analíticas.  
**Subtemas**: estadística descriptiva; muestreo; sesgo; dispersión; intervalos; simulación conceptual.  
**Mini-proyecto**: `stats-decision-notebook`.  
**Capstone-link**: diseño de métricas y confianza para productos de decisión.  
**Requisitos de evaluación**: ejercicios interpretativos; examen con variantes sobre sesgo, media/mediana, outliers e incertidumbre.

### Sección 18 — Hypothesis Testing & Experimentation
**Objetivos**: diseñar y analizar tests de hipótesis y experimentos de negocio.  
**Subtemas**: p-values; hipótesis; A/B testing; errors tipo I/II; tamaño muestral; causalidad básica.  
**Mini-proyecto**: `conversion-experiment-review`.  
**Capstone-link**: evaluación de intervenciones del producto analítico.  
**Requisitos de evaluación**: ejercicios de interpretación; examen con variantes sobre A/B tests, falsos positivos y decisión empresarial.

### Sección 19 — Feature Engineering for Tabular Intelligence
**Objetivos**: transformar datos tabulares en representaciones útiles para modelos y reglas.  
**Subtemas**: encoding; scaling; missingness; date features; interaction features; leakage.  
**Mini-proyecto**: `feature-lab`.  
**Capstone-link**: features de comportamiento y riesgo del analytics product.  
**Requisitos de evaluación**: ejercicios sobre leakage y construcción de features; examen con variantes de preprocess y errores frecuentes.

### Sección 20 — Advanced Pandas & Time Series
**Objetivos**: manejar series temporales, ventanas móviles y reshape complejo.  
**Subtemas**: resample; rolling; expanding; multi-index; melt; pivot; time-aware joins.  
**Mini-proyecto**: `ops-timeseries-monitor`.  
**Capstone-link**: monitoreo temporal de KPIs del producto analítico.  
**Requisitos de evaluación**: ejercicios de series temporales; examen con variantes de rolling, resample y frecuencia.

### Sección 21 — Dashboards Analíticos
**Objetivos**: diseñar dashboards de negocio útiles para stakeholders.  
**Subtemas**: KPI design; layout; interacción; filtros; accesibilidad; narrativa ejecutiva.  
**Mini-proyecto**: `executive-kpi-dashboard`.  
**Capstone-link**: interfaz del capstone final del nivel 2.  
**Requisitos de evaluación**: ejercicios de diseño y priorización de métricas; examen con variantes sobre KPIs, jerarquía visual y lectura de dashboards.

### Sección 22 — FastAPI para Data Products
**Objetivos**: exponer modelos y métricas mediante APIs profesionales.  
**Subtemas**: endpoints; request/response models; validación; serialización; docs automáticas; testing básico.  
**Mini-proyecto**: `analytics-api`.  
**Capstone-link**: backend del producto analítico del nivel 2.  
**Requisitos de evaluación**: ejercicios sobre endpoints y validación; examen con variantes sobre modelos de entrada/salida y errores HTTP.

### Sección 23 — ETL Orchestration Basics
**Objetivos**: diseñar pipelines repetibles con scheduling y retries.  
**Subtemas**: DAG mental model; retries; idempotencia; particionado; logging de pipelines; monitoreo básico.  
**Mini-proyecto**: `daily-kpi-etl`.  
**Capstone-link**: automatización de carga del analytics product.  
**Requisitos de evaluación**: ejercicios de diseño de jobs; examen con variantes sobre idempotencia, retries y particiones.

### Sección 24 — Regression & Classification Applied
**Objetivos**: seleccionar y defender modelos adecuados a problema de negocio.  
**Subtemas**: regresión; clasificación; baselines; trade-offs; métricas alineadas a negocio.  
**Mini-proyecto**: `business-model-comparator`.  
**Capstone-link**: motor predictivo del producto analítico.  
**Requisitos de evaluación**: ejercicios comparativos; examen con variantes sobre baseline, métricas y overfitting.

### Sección 25 — Model Evaluation & Explainability for Stakeholders
**Objetivos**: traducir desempeño de modelos a impacto comprensible.  
**Subtemas**: ROC-AUC; PR curves; calibration; fairness básica; feature importance; SHAP interpretativo.  
**Mini-proyecto**: `model-review-pack`.  
**Capstone-link**: reporte explicable del analytics product.  
**Requisitos de evaluación**: ejercicios de interpretación; examen con variantes sobre métricas y explicabilidad.

### Sección 26 — Analytics Product Delivery
**Objetivos**: empaquetar una solución completa con backend, dashboard y recomendación ejecutiva.  
**Subtemas**: arquitectura; documentación; deployment conceptual; demo design; stakeholder handoff.  
**Mini-proyecto**: `analytics-product-launch`.  
**Capstone-link**: cierre del nivel 2.  
**Requisitos de evaluación**: defensa oral/escrita, checklist de entrega y examen integrador.

### Capstones del Nivel 2
- **Capstone intermedio A**: SQL KPI Warehouse.  
- **Capstone intermedio B**: Experimentation Review Engine.  
- **Capstone intermedio C**: Customer Retention Analytics App.  
- **Capstone final de nivel**: **Analytics Product** con SQL, ETL, API, dashboard y explicación de decisiones.[web:150][web:151]

---

## Nivel 3 — Secciones 27 a 39

### Sección 27 — Advanced ML Pipelines in Production Contexts
**Objetivos**: ampliar pipelines de ML con validaciones y modularidad.  
**Subtemas**: pipeline composition; data drift awareness; offline/online consistency; reproducibilidad.  
**Mini-proyecto**: `production-ml-skeleton`.  
**Capstone-link**: base del intelligent data platform.  
**Requisitos de evaluación**: ejercicios de diseño y consistencia de pipelines.

### Sección 28 — Imbalanced Learning & Calibration
**Objetivos**: manejar clases raras y decisiones de threshold.  
**Subtemas**: reweighting; resampling; calibration; threshold tuning; cost-sensitive evaluation.  
**Mini-proyecto**: `fraud-threshold-lab`.  
**Capstone-link**: anomalías/fraude del nivel 3.  
**Requisitos de evaluación**: ejercicios sobre PR-AUC, recall y umbrales.

### Sección 29 — Responsible ML, Explainability & Governance
**Objetivos**: integrar fairness, auditabilidad y explicaciones útiles.  
**Subtemas**: fairness; bias; interpretabilidad global/local; governance básica; risk documentation.  
**Mini-proyecto**: `ml-audit-sheet`.  
**Capstone-link**: auditoría del intelligent data platform.  
**Requisitos de evaluación**: casos de sesgo, interpretabilidad y justificación técnica.

### Sección 30 — NLP Foundations & Embeddings
**Objetivos**: pasar de texto crudo a representaciones semánticas útiles.  
**Subtemas**: cleaning; tokenización; embeddings; similarity; semantic search.  
**Mini-proyecto**: `support-ticket-similarity-engine`.  
**Capstone-link**: base para RAG y clasificación textual del nivel 3.  
**Requisitos de evaluación**: ejercicios sobre similitud semántica y embeddings.

### Sección 31 — Retrieval Systems & Semantic Search
**Objetivos**: diseñar sistemas de búsqueda y recuperación para conocimiento documental.  
**Subtemas**: chunking; retrieval; ranking; hybrid search; evaluation of retrieval.  
**Mini-proyecto**: `knowledge-search-api`.  
**Capstone-link**: retrieval backbone del capstone RAG.  
**Requisitos de evaluación**: ejercicios de chunking, top-k y evaluación de respuestas.

### Sección 32 — Computer Vision Workflows
**Objetivos**: trabajar con imágenes para clasificación, detección simple y extracción.  
**Subtemas**: imágenes como arrays; preprocesamiento; clasificación simple; OCR integration; pipelines multimodales.  
**Mini-proyecto**: `document-image-review`.  
**Capstone-link**: componente visual del intelligent platform.  
**Requisitos de evaluación**: ejercicios de preprocesamiento y casos multimodales.

### Sección 33 — Forecasting & Time Series Decisions
**Objetivos**: construir forecasting útil para operaciones y negocio.  
**Subtemas**: decomposition; seasonality; backtesting; classical baselines; monitoring.  
**Mini-proyecto**: `operations-forecast-lab`.  
**Capstone-link**: módulo de predicción temporal del platform.  
**Requisitos de evaluación**: ejercicios de backtesting y errores temporales.

### Sección 34 — Recommender Systems & Ranking
**Objetivos**: diseñar motores de recomendación y priorización.  
**Subtemas**: collaborative filtering; content-based; ranking; cold start; evaluation.  
**Mini-proyecto**: `next-best-action-engine`.  
**Capstone-link**: motor de priorización dentro del platform.  
**Requisitos de evaluación**: ejercicios de ranking y evaluación offline.

### Sección 35 — Streaming Data & Real-Time Systems
**Objetivos**: pensar en eventos, latencia y consumo en tiempo real.  
**Subtemas**: streams; event pipelines; windows; consumer groups; reliability basics.  
**Mini-proyecto**: `realtime-transaction-monitor`.  
**Capstone-link**: base del capstone de detección de anomalías.  
**Requisitos de evaluación**: ejercicios sobre ventanas y arquitectura de eventos.

### Sección 36 — Data Validation & Reliability Engineering
**Objetivos**: validar supuestos de datos en entornos más complejos.  
**Subtemas**: schema validation; expectation checks; anomaly checks; incident triage; lineage.  
**Mini-proyecto**: `pipeline-reliability-kit`.  
**Capstone-link**: hardening del intelligent platform.  
**Requisitos de evaluación**: ejercicios de expectativas y monitoreo de fallas.

### Sección 37 — Containerization & Deployment
**Objetivos**: empaquetar aplicaciones y servicios de datos/ML para ambientes portables.  
**Subtemas**: Docker basics; images; compose; env vars; deployment patterns.  
**Mini-proyecto**: `deployable-ml-service`.  
**Capstone-link**: despliegue del platform.  
**Requisitos de evaluación**: ejercicios de contenedorización y debugging de ambientes.

### Sección 38 — Observability for Data & ML Systems
**Objetivos**: medir salud operativa, performance y calidad del sistema.  
**Subtemas**: logs; metrics; traces; dashboards operativos; alerts; SLIs/SLOs.  
**Mini-proyecto**: `platform-observability-board`.  
**Capstone-link**: monitoreo del platform de nivel 3.  
**Requisitos de evaluación**: ejercicios sobre métricas útiles y priorización de alertas.

### Sección 39 — Architecture of Intelligent Data Platforms
**Objetivos**: consolidar componentes en una arquitectura coherente.  
**Subtemas**: capas; servicios; storage; inference; observability; security touchpoints.  
**Mini-proyecto**: `intelligent-platform-architecture-pack`.  
**Capstone-link**: cierre del nivel 3.  
**Requisitos de evaluación**: examen de arquitectura y defensa escrita.

### Capstones del Nivel 3
- **Capstone intermedio A**: Fraud / anomaly real-time monitor.  
- **Capstone intermedio B**: Domain RAG assistant.  
- **Capstone intermedio C**: Multimodal document intelligence workflow.  
- **Capstone final de nivel**: **Intelligent Data Platform** con retrieval, ML, streaming, deployment y observabilidad.[web:148]

---

## Nivel 4 — Secciones 40 a 52

### Sección 40 — Agent Architectures
**Objetivos**: entender patrones de agentes, herramientas, memoria y control.  
**Subtemas**: planners; tool use; supervisor patterns; memory; guardrails.  
**Mini-proyecto**: `agent-patterns-lab`.  
**Capstone-link**: base del flagship system del nivel 4.  
**Requisitos de evaluación**: diseño de patrones agentic y comparación de arquitecturas.

### Sección 41 — Prompt Engineering & Context Engineering
**Objetivos**: diseñar prompts de producción con foco en calidad, contexto y evaluación.  
**Subtemas**: role/task/context/constraints; few-shot; structured prompting; context packing; anti-patterns.  
**Mini-proyecto**: `prompt-playbook-for-enterprise-tasks`.  
**Capstone-link**: definición de estrategias de prompting del sistema final.  
**Requisitos de evaluación**: ejercicios de redacción y corrección de prompts; examen con variantes sobre GLM-5.2 y context design.[web:121]

### Sección 42 — Structured Outputs, Tool Use & Reliability
**Objetivos**: obtener outputs seguros, parseables y verificables.  
**Subtemas**: schemas; JSON outputs; tool routing; fallbacks; validation loops.  
**Mini-proyecto**: `structured-extraction-engine`.  
**Capstone-link**: capa confiable de outputs del sistema final.  
**Requisitos de evaluación**: ejercicios de diseño de schemas y parsing robusto.

### Sección 43 — LLM Evaluation & Benchmarking
**Objetivos**: evaluar prompts, agentes y modelos con criterios reproducibles.  
**Subtemas**: eval sets; rubric-based evaluation; human-in-the-loop; regression tests; error buckets.  
**Mini-proyecto**: `llm-eval-suite`.  
**Capstone-link**: sistema de evaluación del flagship final.  
**Requisitos de evaluación**: ejercicios sobre rubrics y error analysis.

### Sección 44 — RAG Advanced Patterns
**Objetivos**: llevar RAG de prototipo a sistema serio.  
**Subtemas**: retrieval augmentation; re-ranking; citations; chunk policies; failure cases.  
**Mini-proyecto**: `advanced-rag-workbench`.  
**Capstone-link**: módulo central del flagship system.  
**Requisitos de evaluación**: ejercicios de chunking, ranking y groundedness.

### Sección 45 — Multi-Agent Orchestration
**Objetivos**: coordinar agentes especializados con validación y handoffs claros.  
**Subtemas**: planner-executor; reviewer-fixer; specialist routing; orchestration contracts.  
**Mini-proyecto**: `multi-agent-ops-pipeline`.  
**Capstone-link**: arquitectura multi-agente del sistema final.  
**Requisitos de evaluación**: ejercicios de flujos multi-agente y manejo de conflictos.

### Sección 46 — MLOps Lifecycle
**Objetivos**: profesionalizar entrenamiento, registro, despliegue y reentrenamiento.  
**Subtemas**: experiment tracking; model registry; deployment lifecycle; rollback; monitoring.  
**Mini-proyecto**: `mlops-blueprint`.  
**Capstone-link**: operación sostenida del flagship.  
**Requisitos de evaluación**: ejercicios de lifecycle y governance técnica.

### Sección 47 — Security, Privacy & Compliance for Data/AI Systems
**Objetivos**: integrar principios de seguridad y privacidad desde el diseño.  
**Subtemas**: secrets handling; PII; access control; audit logs; model/data risks.  
**Mini-proyecto**: `ai-risk-register`.  
**Capstone-link**: hardening del sistema final.  
**Requisitos de evaluación**: ejercicios sobre incidentes y mitigaciones.

### Sección 48 — Cost, Latency & Scaling Optimization
**Objetivos**: optimizar costo y rendimiento de pipelines y agentes.  
**Subtemas**: caching; batching; fallback models; latency budgets; infra trade-offs.  
**Mini-proyecto**: `agent-cost-optimizer`.  
**Capstone-link**: optimización económica del flagship.  
**Requisitos de evaluación**: ejercicios sobre costo/latencia y decisiones de arquitectura.

### Sección 49 — Human-in-the-Loop Systems
**Objetivos**: diseñar revisión humana útil, segura y eficiente.  
**Subtemas**: review queues; escalation; confidence thresholds; UX for approval flows.  
**Mini-proyecto**: `review-workbench`.  
**Capstone-link**: control humano del sistema final.  
**Requisitos de evaluación**: ejercicios de diseño de colas y aprobación.

### Sección 50 — Technical Product Leadership
**Objetivos**: traducir sistemas técnicos en valor, alcance y priorización ejecutiva.  
**Subtemas**: PRDs técnicos; stakeholder alignment; scope control; demo strategy; decision memos.  
**Mini-proyecto**: `technical-product-brief-pack`.  
**Capstone-link**: narrativa ejecutiva del flagship.  
**Requisitos de evaluación**: ejercicios de priorización y comunicación técnica.

### Sección 51 — Research Communication & Publication Workflows
**Objetivos**: convertir trabajo técnico en reportes, artículos, demos y evidencia pública.  
**Subtemas**: technical writing; demo packaging; reproducibility; artifact preparation; publication workflows.  
**Mini-proyecto**: `publishable-project-kit`.  
**Capstone-link**: preparación de materiales para el proyecto final publicable.  
**Requisitos de evaluación**: ejercicios de documentación y reporting.

### Sección 52 — Master Integration Studio
**Objetivos**: integrar todas las capacidades en una solución final memorable y demostrable.  
**Subtemas**: architecture integration; quality gates; capstone synthesis; portfolio packaging; interview narrative.  
**Mini-proyecto**: `master-flagship-demo`.  
**Capstone-link**: cierre del programa entero.  
**Requisitos de evaluación**: defensa integral, checklist completo, demo, documentación y examen final maestro.

### Capstones del Nivel 4
- **Capstone intermedio A**: Agentic Operations Copilot.  
- **Capstone intermedio B**: Enterprise RAG + Evaluation Platform.  
- **Capstone intermedio C**: MLOps Governance & Optimization Stack.  
- **Capstone final de nivel**: **Flagship Agentic AI System** con orquestación, RAG, evaluación, seguridad, observabilidad y empaquetado publicable.[web:121][web:148]

---

## Capstone global del programa completo

El programa completo culmina con un proyecto “CV star / wow factor / publishable” que combine los aprendizajes de los 4 niveles en una plataforma real demostrable.[file:1] La propuesta recomendada es una **Enterprise Intelligence & Automation Platform** que una: ingestión de datos tabulares, entity resolution, geospatial familiarity, análisis automatizado de Excels, extracción estructurada con IA, API analítica, dashboard, módulos de evaluación, observabilidad, RAG documental y capa agentic para asistir revisiones operativas.[file:1][web:121][web:148]

**Entregables mínimos del capstone global**:
- Repositorio principal con estructura limpia y documentación completa.
- README ejecutivo + README técnico.
- Demo grabada y script de demo en vivo.
- Dataset o estrategia de datos reproducible.
- Tests automatizados y coverage report.
- Dashboard o interfaz usable.
- API o servicio central.
- Architecture decision records.
- Write-up publicable estilo case study.

---

## Plantilla obligatoria por sección

Cada sección del roadmap maestro debe expandirse en el documento operativo del curso con la siguiente estructura exacta para preservar coherencia con el roadmap previo.[file:1]

1. Título y tagline.  
2. Nivel y horas estimadas.  
3. Relevancia laboral.  
4. Objetivos de aprendizaje.  
5. Temas de teoría.  
6. I Do — demostración guiada.  
7. We Do — práctica guiada.  
8. You Do — proyecto de portafolio.  
9. Autoevaluación con 3 intentos máximos, 3 variantes por concepto y 70% para aprobar.[file:1]  
10. Recursos principales.  
11. Conexión con capstone.  
12. Rúbrica de proyecto.  
13. Checklist de cierre de sección.  
14. Reporte de validación y fixes.

## Requisitos detallados de evaluación por sección

Cada una de las 52 secciones debe contener:  
- 3 ejercicios por subtema.  
- 6 ejercicios o más por tema agregado.  
- 1 mini evaluación por tema.  
- 1 examen de sección.  
- 3 variantes equivalentes por subtema en el examen.[file:1][web:130][web:131]

Las variantes deben seguir la progresión cognitiva:  
- Variante A: comprensión conceptual.  
- Variante B: aplicación en escenario real.  
- Variante C: análisis, debugging o diagnóstico.[web:131]

## Validación de cobertura respecto al roadmap previo

Este roadmap maestro conserva y expande explícitamente las líneas ya presentes en el archivo anterior para: setup, Python basics, estructuras de datos, functions/modules, adquisición de datos, pandas, visualización, ML pipeline, testing, performance y RPA con IA.[file:1] También preserva los requisitos ya visibles en el roadmap previo sobre 3 intentos, 3 variantes anti-plagio por concepto y 70% de aprobación, pero los convierte en política estructural del programa completo en lugar de notas sueltas por sección.[file:1]

## Fuentes, cursos y justificación de uso

### Fuentes clave usadas directamente

| Fuente | URL | Por qué se usó |
|---|---|---|
| GLM-5.2 launch note | https://z.ai/blog/glm-5.2 | Para justificar prompting/context engineering sobre tareas largas y agentic.[web:17] |
| GLM-5.2 official docs | https://docs.z.ai/guides/llm/glm-5.2 | Para reglas de prompting, contexto largo y structured outputs.[web:121] |
| GLM migration overview | https://docs.z.ai/guides/overview/migrate-to-glm-new | Para continuidad operativa en prompting y uso del modelo.[web:21] |
| Z.AI chat completion docs | https://docs.z.ai/api-reference/llm/chat-completion | Para nociones de outputs estructurados y uso de API.[web:147] |
| DeepLearning.AI note on GLM-5.2 | https://www.deeplearning.ai/the-batch/top-agentic-performance-low-cost | Para posicionar GLM-5.2 como modelo apto para long-running agentic tasks.[web:148] |
| IBM Python Project for Data Science | https://www.coursera.org/learn/python-project-for-data-science | Para respaldar la orientación a proyectos aplicados y demostración de skills.[web:150] |
| Applied Data Science with Python | https://www.coursera.org/programs/library-learning-program-16m5r/specializations/data-science-python | Para secuenciación hacia productos analíticos y uso aplicado de Python.[web:151] |
| UWaterloo Bloom guide | https://uwaterloo.ca/centre-for-teaching-excellence/resources/teaching-tips/blooms-taxonomy-learning-activities-and-assessments | Para estructurar objetivos, actividades y exámenes por niveles cognitivos.[web:131] |
| ASEE autograded exercises PDF | https://peer.asee.org/writing-effective-autograded-exercises-using-bloom-s-taxonomy.pdf | Para reforzar diseño de ejercicios evaluables y variantes significativas.[web:130] |
| Google Maps Distance Matrix blog | https://mapsplatform.google.com/resources/blog/how-use-distance-matrix-api/ | Para el razonamiento del capstone geográfico de familiaridad.[web:136] |

### Cursos y recursos de referencia revisados o incorporados como benchmark curricular

| Recurso | URL | Justificación curricular |
|---|---|---|
| Python Project for Data Science | https://www.coursera.org/learn/python-project-for-data-science | Refuerza la necesidad de proyectos demostrables basados en Python para análisis de datos.[web:150] |
| Applied Data Science with Python | https://www.coursera.org/programs/library-learning-program-16m5r/specializations/data-science-python | Aporta referencia para progresión desde fundamentos a productos analíticos.[web:151] |
| GLM-5.2 official docs | https://docs.z.ai/guides/llm/glm-5.2 | Aporta la guía de prompting/base operativa para el super prompt y el flujo agentic.[web:121] |

### Nota sobre las “216 fuentes”

En esta conversación no se recibió un listado verificable de 216 URLs individuales ni un archivo con ese inventario exacto, por lo que no es posible enumerarlas de forma honesta una por una sin inventarlas.[file:1] Este documento incluye **todas las fuentes web realmente observadas y citables** en la sesión actual y las integra con el roadmap previo adjunto, que fue la fuente principal para preservar estructura, secciones existentes, requisitos de examen y capstones originales.[file:1]

## Issues y validaciones pendientes

No fue posible validar código de plataforma, navegación, auth, Pyodide, dashboard o randomización real de exámenes porque no hay un codebase adjunto aparte del markdown del roadmap.[file:1] Por eso, este documento valida exhaustivamente la **arquitectura curricular**, la **estructura pedagógica**, la **continuidad de requisitos** y la **expansión a 52 secciones**, pero deja abierta una fase posterior de auditoría técnica si se comparte el repositorio o un zip con módulos, scripts y componentes.[file:1]

## Cierre

El resultado es un roadmap maestro que conserva el ADN de *El Arte de Python*, expande el programa a 52 secciones, formaliza la progresión por niveles, integra capstones intermedios y finales, y fija una plantilla de trabajo replicable para desarrollar cada sección con profundidad uniforme y calidad evaluable.[file:1][web:131][web:150]
