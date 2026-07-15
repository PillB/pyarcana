# Learning Roadmap — El Arte de Python

> **Curso**: El Arte de Python — De cero a Data Scientist
> **Idioma**: Español peruano
> **Pedagogía**: I Do / We Do / You Do (Gradual Release of Responsibility)
> **Total**: 13 secciones · 122 horas estimadas
> **Fecha**: 2026-07-14
>
> Este documento está diseñado para que expertos revisen la estructura curricular, el flujo de aprendizaje, la cobertura de temas y la progresión pedagógica. Cada sección incluye: objetivos de aprendizaje, temas de teoría, ejercicios guiados (I Do / We Do), proyecto práctico (You Do), preguntas de auto-evaluación y recursos.

---

## Tabla de Contenidos

### Fase 0 — Fundamentos (Principiante → Avanzado, 122h, S1-S13)

| # | Sección | Horas | Nivel | Proyecto (You Do) |
|---|---------|-------|-------|-------------------|
| 1 | [Setup & Entorno de Desarrollo](#1-setup-entorno-de-desarrollo) | 4h | Principiante | Reproducible Data Environment |
| 2 | [Python Absolute Basics](#2-python-absolute-basics) | 8h | Principiante | Personal Budget Calculator |
| 3 | [Data Structures & File Handling](#3-data-structures-file-handling) | 8h | Principiante | Sales Log Parser |
| 4 | [Functions, Modules & Packaging](#4-functions-modules-packaging) | 8h | Intermedio | File Organizer Automation Script |
| 5 | [Object-Oriented Programming (OOP)](#5-object-oriented-programming-oop-) | 10h | Intermedio | Custom ML Pipeline Class |
| 6 | [NumPy: Vectorized Computing](#6-numpy-vectorized-computing) | 6h | Intermedio | Student Exam Score Analyzer |
| 7 | [Adquisición de Datos para Data Science](#7-adquisici-n-de-datos-para-data-science) | 14h | Intermedio | Capstone: Data Acquisition Pipeline |
| 8 | [Pandas: Data Cleaning & EDA](#8-pandas-data-cleaning-eda) | 12h | Intermedio | Real-World EDA Report |
| 9 | [Data Visualization](#9-data-visualization) | 8h | Intermedio | Add Visuals to Your Netflix EDA |
| 10 | [scikit-learn: Full ML Pipeline](#10-scikit-learn-full-ml-pipeline) | 14h | Avanzado | Churn Prediction Production Pipeline |
| 11 | [Testing Your Python Code](#11-testing-your-python-code) | 6h | Avanzado | Test Suite for Your Churn Project |
| 12 | [Performance, Concurrency & Logging](#12-performance-concurrency-logging) | 10h | Avanzado | Capstone: Performance Optimizer |
| 13 | [RPA & Automatización con IA](#13-rpa-automatizaci-n-con-ia) | 14h | Avanzado | Capstone: Invoice Digitizer Bot |

### Fase 1 — Competente (Competente, 150h, S14-S26)

| # | Sección | Horas | Proyecto (You Do) |
|---|---------|-------|-------------------|
| 14 | [Seguridad para Automatizaciones e IA](#14-seguridad-para-automatizaciones-e-ia) | 10h | Secure Invoice Pipeline |
| 15 | [Python Standard Library Deep Dive](#15-python-standard-library-deep-dive) | 10h | Functional Data Processor |
| 16 | [GUI Desktop con wxPython](#16-gui-desktop-con-wxpython) | 10h | Internal Tool GUI |
| 17 | [Packaging & Distribution](#17-packaging-distribution) | 8h | PyPI-Published Package |
| 18 | [Data Engineering Foundations](#18-data-engineering-foundations) | 12h | Idempotent ETL Pipeline |
| 19 | [Databases & ORM](#19-databases-orm) | 10h | E-commerce Schema + Analytics |
| 20 | [RAG (Retrieval-Augmented Generation)](#20-rag-retrieval-augmented-generation) | 12h | Peruvian Legal Assistant RAG |
| 21 | [Backend APIs con FastAPI](#21-backend-apis-con-fastapi) | 12h | Production FastAPI Service |
| 22 | [Entity Resolution con RapidFuzz](#22-entity-resolution-con-rapidfuzz) | 10h | Customer Deduplication Pipeline |
| 23 | [Computer Vision Fundamentals](#23-computer-vision-fundamentals) | 12h | Invoice OCR Pipeline |
| 24 | [RPA Avanzado](#24-rpa-avanzado) | 10h | Production RPA Bot |
| 25 | [Dashboards con Streamlit](#25-dashboards-con-streamlit) | 10h | Executive Dashboard |
| 26 | [Proyecto Integrador Fase 1](#26-proyecto-integrador-fase-1) | 16h | AI-Powered Automation Platform |

### Fase 2 — Senior (Senior, 168h, S27-S39)

| # | Sección | Horas | Proyecto (You Do) |
|---|---------|-------|-------------------|
| 27 | [Async & Concurrency](#27-async-concurrency) | 12h | Async Data Aggregator |
| 28 | [LLM Agents](#28-llm-agents) | 14h | Autonomous Research Agent |
| 29 | [MLOps](#29-mlops) | 14h | MLOps Pipeline for Churn Model |
| 30 | [Security & Infrastructure](#30-security-infrastructure) | 12h | Zero Trust ML Service |
| 31 | [Streaming Data](#31-streaming-data) | 14h | Real-time Fraud Detection Stream |
| 32 | [Microservices & Distributed Systems](#32-microservices-distributed-systems) | 14h | Microservices E-commerce Platform |
| 33 | [Advanced ML Models](#33-advanced-ml-models) | 14h | Advanced Churn Pipeline |
| 34 | [CV + AI Integration](#34-cv-ai-integration) | 12h | SUNAT Invoice Digitizer |
| 35 | [System Design for AI](#35-system-design-for-ai) | 14h | AI System Design Document |
| 36 | [Advanced AI APIs](#36-advanced-ai-apis) | 10h | LLM-Powered Data Pipeline |
| 37 | [dbt + BigQuery](#37-dbt-bigquery) | 12h | dbt Analytics Layer |
| 38 | [Performance Extreme](#38-performance-extreme) | 12h | Performance Optimization Case Study |
| 39 | [Proyecto Integrador Fase 2](#39-proyecto-integrador-fase-2) | 18h | End-to-End AI Platform Senior |

### Fase 3 — Master (Master, 160h, S40-S52)

| # | Sección | Horas | Proyecto (You Do) |
|---|---------|-------|-------------------|
| 40 | [Agentic Architecture](#40-agentic-architecture) | 12h | Autonomous Analysis Platform |
| 41 | [LLM Fine-tuning](#41-llm-fine-tuning) | 14h | Domain-Specialized LLM |
| 42 | [GraphRAG](#42-graphrag) | 12h | Knowledge Graph RAG for Peruvian Business News |
| 43 | [LLMOps](#43-llmops) | 12h | Production RAG with LLMOps |
| 44 | [Multimodal AI](#44-multimodal-ai) | 12h | Multimodal Document Intelligence |
| 45 | [Infrastructure as Code](#45-infrastructure-as-code) | 12h | Production IaC for ML Platform |
| 46 | [GPU Computing](#46-gpu-computing) | 14h | Production LLM Serving |
| 47 | [Open Source & Community](#47-open-source-community) | 10h | Production-Grade OSS Package |
| 48 | [AI Governance & Ethics](#48-ai-governance-ethics) | 10h | AI Governance Audit |
| 49 | [Data Contracts & Quality](#49-data-contracts-quality) | 10h | Data Quality Platform |
| 50 | [Tech Leadership & Communication](#50-tech-leadership-communication) | 10h | Staff-Level Technical Artifacts |
| 51 | [Proyecto Integrador Final](#51-proyecto-integrador-final) | 18h | Agentic Platform Master |
| 52 | [Career Strategy & Job Search](#52-career-strategy-job-search) | 8h | Career Launch Kit |

---

## Flujo de Aprendizaje

```
Fase 0 — Fundamentos (S1-S13, 122h): Setup → Basics → Data Structures → Functions → OOP → NumPy
                  ↓
              Data Acquisition → Pandas → Visualization → sklearn → Testing → Performance → RPA
                  ↓
Fase 1 — Competente (S14-S26, 150h): Security → stdlib → wxPython → Packaging → Data Engineering
                  ↓
              Databases/ORM → RAG → FastAPI → RapidFuzz → CV → RPA Advanced → Streamlit → Capstone
                  ↓
Fase 2 — Senior (S27-S39, 168h): Async → LLM Agents → MLOps → Security → Streaming → Microservices
                  ↓
              Advanced ML → CV+AI → System Design → AI APIs → dbt+BigQuery → Performance → Capstone
                  ↓
Fase 3 — Master (S40-S52, 160h): Agentic → LLM Fine-tuning → GraphRAG → LLMOps → Multimodal
                  ↓
              IaC → GPU Computing → Open Source → AI Governance → Data Contracts → Leadership → Capstone → Career
                  ↓
CAPSTONE PROGRESIVO: 4 capstones (S13, S26, S39, S51) que construyen progresivamente
Familiarity Score Dashboard → AI Automation Platform → Senior AI Platform → Agentic Platform Master
```

### Capstone Progresivo: 4 etapas

El curso incluye 4 capstones integradores (uno por fase) que construyen progresivamente un portafolio completo:

- **S13 (Capstone Fase 0)**: Familiarity Score Dashboard — Excel upload → entity resolution → mapa → scoring
- **S26 (Capstone Fase 1)**: AI-Powered Automation Platform — Backend + RAG + Data Pipeline + CV + Entity Resolution + RPA + Dashboard
- **S39 (Capstone Fase 2)**: End-to-End AI Platform Senior — Multi-agent + MLOps + K8s + Kafka + Smart CV + ADRs
- **S51 (Capstone Fase 3)**: Agentic Platform Master — Integra todas las habilidades Master en una plataforma Agentic completa

---

## 1. Setup & Entorno de Desarrollo

> **Tagline**: Python, VS Code, venv y Git listos para producción desde el día 1
> **Nivel**: Principiante · **Horas estimadas**: 4h · **Ícono**: Wrench

### Relevancia laboral

El 90% de los problemas en equipos de data science no son de código, son de entorno. Un analista que sabe configurar venv, git y VS Code properly ahorra horas al equipo y se gana la confianza del líder técnico. En empresas peruanas como Interbank, BBVA o Caja Arequipa, el primer día te piden clonar un repo, levantar el entorno y correr un notebook. Si te trabas ahí, no pasas la semana de prueba.

### Objetivos de aprendizaje

- Instalar Python 3.12+ y verificarlo desde la terminal (PowerShell, bash o zsh)
- Crear y activar entornos virtuales con venv y conda
- Configurar VS Code con extensiones Python esenciales (Pylance, Ruff, Jupyter)
- Inicializar un repo Git, hacer commit/push y abrir un Pull Request en GitHub
- Escribir un archivo requirements.txt reproducible y un .gitignore correcto
- Tu primer proyecto real de portafolio. Vas a crear un repo llamado `python-ds-journey` que servirá como journal público de tu aprendizaje. Cada sección del curso va a agregar carpetas y proyectos a este repo. Al final del curso, tendrás 10+ mini-proyectos subidos que demuestran progresión real — esto es oro para entrevistas.

### Temas de teoría

1. **Por qué el setup importa más de lo que crees**
2. **Componentes del stack que vamos a instalar**
3. **El flujo de trabajo profesional con Git**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Verificar instalación de Python y crear carpeta del proyecto
2. Crear y activar entorno virtual con venv
3. Instalar paquetes esenciales y guardar requirements.txt
4. Inicializar Git y crear .gitignore
5. Crear repo en GitHub y subir el código

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Crea un archivo hello.py que imprima tu nombre, la versión de Python y la fecha actual
2. Crea un README.md con título, descripción, instrucciones de instalación y uso
3. Sube los cambios a GitHub con un commit bien escrito

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Reproducible Data Environment — Tu primer repo profesional

Tu primer proyecto real de portafolio. Vas a crear un repo llamado `python-ds-journey` que servirá como journal público de tu aprendizaje. Cada sección del curso va a agregar carpetas y proyectos a este repo. Al final del curso, tendrás 10+ mini-proyectos subidos que demuestran progresión real — esto es oro para entrevistas.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 4 |
| Preguntas por intento | 4 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 4 correctas) |
| Tiempo estimado | 8-12 minutos |
| Pregunta por intento | Variante aleatoria sin repetición |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `venv-purpose` | Recordar | Para qué sirve un entorno virtual y por qué aísla dependencias por proyecto |
| 2 | `gitignore-rules` | Aplicar | Identificar qué archivos deben o no estar en `.gitignore` (venv, .env, builds, .pyc) |
| 3 | `conventional-commits` | Aplicar | Escribir mensajes de commit que sigan Conventional Commits (`feat:`, `fix:`, `chore:`, scope, descripción) |
| 4 | `env-reproducibility` | Analizar | Reproducir el entorno de otro dev con `pip install -r requirements.txt` y por qué `.env` no se commitea |

#### Ejemplo de variantes para un concepto

Para `venv-purpose`, las 3 variantes comparten el mismo aprendizaje evaluado ("el estudiante explica que venv aísla dependencias por proyecto") pero cambian el contexto:

- **V1**: "¿Para qué sirve un entorno virtual (venv) en Python?" — respuesta correcta: aislar dependencias por proyecto
- **V2**: "Tienes Proyecto A que usa Django 3.2 y Proyecto B que usa Django 4.2. ¿Cómo evitas el conflicto?" — respuesta correcta: un venv por proyecto
- **V3**: "¿Cuál es el beneficio principal de usar venv al trabajar en múltiples proyectos Python?" — respuesta correcta: cada proyecto tiene sus propias versiones de paquetes sin interferir con otros

#### Preguntas de auto-evaluación (modo sin login)

*Si no has iniciado sesión, verás estas 5 preguntas con feedback inmediato pero sin afectar tu progreso. Con login, el sistema selecciona 4 de estas (1 por concepto) aleatoriamente.*

1. ¿Para qué sirve un entorno virtual (venv) en Python?
2. ¿Cuál de los siguientes archivos SÍ debería estar en tu .gitignore?
3. ¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?
4. ¿Qué comando te permite replicar el entorno de otro desarrollador?
5. ¿Por qué NO debes subir el archivo .env a GitHub?

### Recursos principales

- Python.org — Downloads
- VS Code — Python extension
- Git — official book
- Conventional Commits
- GitHub Docs — Quickstart

---

## 2. Python Absolute Basics

> **Tagline**: Los 6 conceptos que cubren el 80% del Python que vas a escribir
> **Nivel**: Principiante · **Horas estimadas**: 8h · **Ícono**: Code2

### Relevancia laboral

Estos 6 conceptos (variables, tipos, condicionales, loops, funciones, comprehensions) son el 80% del código que vas a escribir como Data Analyst. Cuando limpias un dataset en pandas, usas condicionales para filtrar. Cuando iteras sobre columnas, usas loops. Cuando defines transformaciones, usas funciones. Si dominas esto, el resto del curso es aplicar los mismos conceptos con librerías más grandes.

### Objetivos de aprendizaje

- Declarar variables y entender los tipos básicos: int, float, str, bool, list, dict, tuple, set
- Convertir entre tipos con int(), str(), float(), bool()
- Escribir condicionales if/elif/else con operadores lógicos and, or, not
- Usar loops for y while con break, continue, range() y enumerate()
- Definir funciones con def, parámetros por defecto, *args y **kwargs
- Escribir list comprehensions y dict comprehensions
- Tu primer programa completo para portafolio. Un calculador de presupuesto personal que pide al usuario sus ingresos y gastos, calcula saldo, ahorro, y warning si gasta más del 80%. Es exactamente el tipo de script que un junior escribiría en una empresa para automatizar un reporte financiero. Súbelo a tu repo python-ds-journey.

### Temas de teoría

1. **Variables y tipos de datos — la base de todo**
2. **Condicionales — tomando decisiones en el código**
3. **Loops — repitiendo acciones**
4. **Funciones — bloques reutilizables de código**
5. **List comprehensions — la forma pythónica de transformar listas**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Modelar las notas de un alumno con tipos y estructuras
2. Calcular promedios con funciones y comprehensions
3. Agregar condicionales para clasificar y reportar

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Crea una función que calcule la propina sugerida (10%, 12% o 15%) según el monto de la cuenta
2. Extiende el programa para dividir la cuenta entre N personas

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Personal Budget Calculator — Tu primer programa real

Tu primer programa completo para portafolio. Un calculador de presupuesto personal que pide al usuario sus ingresos y gastos, calcula saldo, ahorro, y warning si gasta más del 80%. Es exactamente el tipo de script que un junior escribiría en una empresa para automatizar un reporte financiero. Súbelo a tu repo python-ds-journey.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 10-15 minutos |
| Pregunta por intento | Variante aleatoria sin repetición |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `assignment-vs-equality` | Recordar | Diferencia entre `=` (asignación) y `==` (comparación). Error típico de principiantes en `if` statements. |
| 2 | `list-comprehension` | Aplicar | Predecir el output de una list comprehension con filtro (`[expr for x in iter if cond]`). |
| 3 | `truthiness` | Analizar | Identificar qué valores se evalúan como False en Python: `0`, `""`, `[]`, `{}`, `None`, `False`. |
| 4 | `kwargs-semantics` | Aplicar | Explicar qué hace `**kwargs` en la firma de una función (recibe dict de argumentos nombrados). |
| 5 | `enumerate-idiom` | Aplicar | Forma pythónica de iterar con índices: `for i, x in enumerate(lst)` en vez de `range(len(lst))`. |

#### Ejemplo de variantes para un concepto

Para `list-comprehension`, las 3 variantes comparten la categoría "Aplicar" pero cambian la operación y el filtro:

- **V1**: "¿Qué imprime `[x**2 for x in range(4) if x > 0]`?" — output: `[1, 4, 9]`
- **V2**: "¿Qué imprime `[x*2 for x in range(5) if x % 2 == 0]`?" — output: `[0, 4, 8]`
- **V3**: "¿Qué imprime `[x.upper() for x in ['a', 'b', 'c']]`?" — output: `['A', 'B', 'C']`

#### Preguntas de auto-evaluación (modo sin login)

*Si no has iniciado sesión, verás estas 5 preguntas con feedback inmediato pero sin afectar tu progreso. Con login, el sistema selecciona 5 (1 por concepto) aleatoriamente.*

1. ¿Cuál es la diferencia entre `=` y `==` en Python?
2. ¿Qué imprime `[x**2 for x in range(4) if x > 0]`?
3. ¿Qué valores se evalúan como False en Python (truthiness)?
4. ¿Qué hace `**kwargs` en una función?
5. ¿Cuál es la forma pythónica de iterar con índices sobre una lista?

### Recursos principales

- Python — Tutorial oficial
- Real Python — Lists and Tuples
- PEP 8 — Style Guide
- Python Tutor
- CS50P — Lecture 1-3

---

## 3. Data Structures & File Handling

> **Tagline**: Dicts, listas, CSV, JSON y manejo de errores como en producción
> **Nivel**: Principiante · **Horas estimadas**: 8h · **Ícono**: Database

### Relevancia laboral

En tu día como Data Analyst, vas a leer y escribir archivos CSV/JSON constantemente. Pandas internamente usa dicts. Cuando consumes una API REST, recibes JSON. Cuando persistes resultados, escribes JSON. El manejo de errores con try/except es lo que separa código de prototype de código de producción — un script que se cae con FileNotFoundError pierde 2 horas del equipo.

### Objetivos de aprendizaje

- Dominar operaciones avanzadas de list, dict y set (append, get, items, update, comprehension anidada)
- Construir estructuras anidadas: dict de listas, lista de dicts
- Leer y escribir archivos CSV con el módulo csv (csv.DictReader, csv.writer)
- Leer y escribir JSON con el módulo json (load, loads, dump, dumps)
- Manejar errores con try/except/finally y crear excepciones custom
- Usar el statement with para gestión automática de recursos
- Proyecto de portafolio real. Descargas un dataset público de ventas (puedes usar Superstore Sales de Kaggle o crear uno sintético), lo procesas con estructuras anidadas, y exportas un resumen en JSON. Este tipo de script es exactamente lo que un analista junior hace en su primera semana: leer datos crudos, limpiarlos, agregarlos, entregar un reporte.

### Temas de teoría

1. **List, dict y set — operaciones que debes tener en la yema**
2. **Estructuras anidadas — modelando datos reales**
3. **Archivos CSV y JSON — entrada/salida estándar**
4. **Manejo de errores — try/except/finally**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Crear CSV de muestra y función de lectura robusta
2. Leer CSV y construir estructura anidada
3. Agregar por categoría y exportar resumen JSON

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Crea una función que lea un JSON de configuración y valide que tenga las keys obligatorias

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Sales Log Parser — Tu primer pipeline ETL

Proyecto de portafolio real. Descargas un dataset público de ventas (puedes usar Superstore Sales de Kaggle o crear uno sintético), lo procesas con estructuras anidadas, y exportas un resumen en JSON. Este tipo de script es exactamente lo que un analista junior hace en su primera semana: leer datos crudos, limpiarlos, agregarlos, entregar un reporte.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `json-load-vs-loads` | Aplicar | Distinguir `json.load(file)` (lee de archivo) vs `json.loads(str)` (parsea string). Confusión común al consumir APIs. |
| 2 | `context-manager` | Aplicar | Qué hace `with open(...)`: garantiza cierre del recurso incluso si hay excepción. Equivalente a try/finally automático. |
| 3 | `defaultdict-use-case` | Analizar | Por qué `defaultdict(list)` es mejor que un dict normal cuando necesitas agrupar valores por clave sin inicializar listas. |
| 4 | `file-error-handling` | Recordar | `FileNotFoundError` se lanza al abrir inexistente. Distinción de `PermissionError` e `IsADirectoryError`. |
| 5 | `dict-iteration-idiom` | Aplicar | Iterar con `.items()` para obtener (clave, valor) simultáneamente, en vez de `for k in d: d[k]`. |

#### Ejemplo de variantes para un concepto

Para `context-manager`, las 3 variantes comparten la categoría "Aplicar" pero cambian el recurso:

- **V1**: "¿Qué hace el statement `with open('f.csv') as f:`?" — garantiza cierre del archivo al salir del bloque
- **V2**: "¿Por qué `with sqlite3.connect(db) as conn:` es mejor que `conn = sqlite3.connect(db)`?" — garantiza commit/rollback y cierre de conexión
- **V3**: "Si abres un archivo sin `with` y ocurre una excepción antes de `f.close()`, ¿qué pasa?" — el archivo queda abierto (resource leak)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuál es la diferencia entre `json.load()` y `json.loads()`?
2. ¿Qué hace el statement `with open("f.csv") as f:`?
3. ¿Por qué usar `defaultdict(list)` en lugar de un dict normal?
4. ¿Qué excepción lanza Python cuando intentas abrir un archivo inexistente?
5. ¿Cuál es la forma pythónica de iterar sobre un dict obteniendo clave y valor?

### Recursos principales

- Python — csv module docs
- Python — json module docs
- Real Python — Working with Files
- Python — Errors and Exceptions
- Kaggle Learn — Data Cleaning

---

## 4. Functions, Modules & Packaging

> **Tagline**: Decorators, pathlib, datetime y empaquetado profesional
> **Nivel**: Intermedio · **Horas estimadas**: 8h · **Ícono**: Puzzle

### Relevancia laboral

Los decorators están en TODOS los codebases de ML production: FastAPI los usa para routing, MLflow para tracking, pytest para fixtures, sklearn para validación. Si no entiendes decorators, no puedes leer ni modificar código production-ready. pathlib y datetime son el 80% de la manipulación de archivos y fechas que harás diariamente como Data Analyst.

### Objetivos de aprendizaje

- Dominar funciones avanzadas: parámetros por defecto, keyword-only args, *args, **kwargs
- Escribir y aplicar lambda functions en contexto real
- Crear tus propios módulos e importarlos con import y from x import y
- Implementar decorators con @functools.wraps para logging, timing y cache
- Usar pathlib para manipulación de archivos cross-platform
- Manipular fechas con datetime, timedelta y timezone-aware objects
- Vas a construir un script que automáticamente organiza una carpeta por tipo de archivo, con logging y timing. Es exactamente el tipo de automatización que un Data Analyst junior escribe para ahorrar tiempo del equipo: organizar outputs de modelos, separar datasets por fecha, etc. Súbelo a tu GitHub como "file-organizer".

### Temas de teoría

1. **Funciones avanzadas — más allá de lo básico**
2. **Módulos — organizando código reutilizable**
3. **Decorators — funciones que envuelven funciones**
4. **pathlib — manipulación moderna de archivos**
5. **datetime — manipulación profesional de fechas**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Crear decorators de timing y logging reutilizable
2. Implementar la lógica de organización con pathlib

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Crea un módulo data_utils.py con una función limpiar_texto() decorada con logging

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: File Organizer Automation Script — Tu primera herramienta de productividad

Vas a construir un script que automáticamente organiza una carpeta por tipo de archivo, con logging y timing. Es exactamente el tipo de automatización que un Data Analyst junior escribe para ahorrar tiempo del equipo: organizar outputs de modelos, separar datasets por fecha, etc. Súbelo a tu GitHub como "file-organizer".


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `functools-wraps` | Aplicar | Qué hace `@functools.wraps(func)` en un decorator: preserva `__name__`, `__doc__`, `__module__` de la función original. |
| 2 | `pathlib-cross-platform` | Aplicar | `Path("data") / "ventas.csv"` funciona en Windows (\\) y Linux (/) sin cambios. pathlib reemplaza a `os.path.join`. |
| 3 | `datetime-parsing` | Aplicar | Parsear "2025-07-14" con `datetime.strptime(s, "%Y-%m-%d").date()`. Distinción de `date.fromisoformat()`. |
| 4 | `name-main-guard` | Analizar | `if __name__ == "__main__":` evita que el código se ejecute al importar el módulo desde otro archivo. |
| 5 | `keyword-only-args` | Aplicar | Argumentos después de `*` son keyword-only: `def f(a, *, b):` obliga a llamar `f(1, b=2)`, no `f(1, 2)`. |

#### Ejemplo de variantes para un concepto

Para `pathlib-cross-platform`, las 3 variantes comparten "Aplicar" pero cambian el path:

- **V1**: "¿Qué imprime `Path('data') / 'ventas.csv'` en Windows?" — `data\ventas.csv`
- **V2**: "¿Cómo construyes el path `logs/app/2026.log` de forma cross-platform?" — `Path('logs') / 'app' / '2026.log'`
- **V3**: "¿Por qué `Path('data') / 'ventas.csv'` es preferible a `'data/' + 'ventas.csv'`?" — funciona en Windows y Linux sin código condicional

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué hace `@functools.wraps(func)` en un decorator?
2. ¿Qué imprime `Path("data") / "ventas.csv"` en Windows?
3. ¿Cuál es la forma correcta de parsear "2025-07-14" a un objeto date?
4. ¿Para qué sirve `if __name__ == "__main__":`?
5. ¿Qué son los keyword-only args y cómo se definen?

### Recursos principales

- Python — functools
- Python — pathlib
- Real Python — Decorators
- PEP 8 — Modules
- Real Python — Decorators

---

## 5. Object-Oriented Programming (OOP)

> **Tagline**: Classes, herencia, dunders y abstract classes — la llave para leer código de sklearn
> **Nivel**: Intermedio · **Horas estimadas**: 10h · **Ícono**: Boxes

### Relevancia laboral

Sin OOP no puedes leer el código fuente de scikit-learn, pandas ni matplotlib. Las clases BaseEstimator, TransformerMixin, ClassifierMixin de sklearn son el backbone de toda la librería. Cuando en producción te piden "crear un transformer custom para tu pipeline", necesitas heredar de estas clases. OOP también es la base de FastAPI, Django y Flask.

### Objetivos de aprendizaje

- Definir clases con __init__, atributos de instancia y de clase
- Implementar encapsulamiento con atributos públicos, _protegidos y __privados
- Usar herencia con super() para extender clases
- Aplicar polimorfismo y method overriding
- Implementar dunder methods: __str__, __repr__, __eq__, __len__
- Distinguir composición de herencia y usar ABC para interfaces
- Vas a construir un mini-framework de ML con OOP. La clase DataPipeline con load/clean/transform/summary, y una subclase ModelTrainer con train/evaluate. Es el mismo patrón que scikit-learn internamente — si lo entiendes, puedes leer y extender sklearn. Esto es lo que te piden en entrevistas técnicas mid-level.

### Temas de teoría

1. **Clases y objetos — modelando el mundo**
2. **Encapsulamiento — protegiendo tus datos**
3. **Herencia y polimorfismo — reutilizando comportamiento**
4. **Dunder methods — la magia de Python OOP**
5. **Composición vs Herencia y Abstract Classes**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Implementar DataPipeline con encapsulamiento y dunder methods
2. Crear subclase ModelTrainer que extiende DataPipeline

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Crea una clase Dataset con __init__, __len__, __repr__ y métodos load/save

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Custom ML Pipeline Class — Proyecto OOP de portafolio

Vas a construir un mini-framework de ML con OOP. La clase DataPipeline con load/clean/transform/summary, y una subclase ModelTrainer con train/evaluate. Es el mismo patrón que scikit-learn internamente — si lo entiendes, puedes leer y extender sklearn. Esto es lo que te piden en entrevistas técnicas mid-level.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `str-vs-repr` | Analizar | `__str__` es para usuarios (legible), `__repr__` es para devs (reproducible). `print()` usa `__str__`, REPL usa `__repr__`. |
| 2 | `super-init` | Aplicar | `super().__init__(...)` llama al constructor de la clase padre. Necesario para que la jerarquía se inicialice correctamente. |
| 3 | `underscore-convention` | Recordar | `_atributo` es convención (no enforcement) para "interno". `__atributo` activa name-mangling. `__dunder__` es reservado Python. |
| 4 | `composition-vs-inheritance` | Analizar | Cuándo preferir composición (has-a, runtime, flexible) sobre herencia (is-a, compile-time, rígida). |
| 5 | `abstractmethod-abc` | Aplicar | `@abstractmethod` en una clase que hereda de `ABC` obliga a las subclases a implementar el método. |

#### Ejemplo de variantes para un concepto

Para `str-vs-repr`, las 3 variantes cambian la clase de ejemplo:

- **V1**: "¿Cuál es la diferencia entre `__str__` y `__repr__`?" — str legible, repr reproducible
- **V2**: "Si defines solo `__repr__` en una clase, ¿qué muestra `print(obj)`?" — usa `__repr__` como fallback
- **V3**: "¿Por qué `eval(repr(obj))` debería reconstruir el objeto?" — repr debe ser una representación Python-válida

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuál es la diferencia entre `__str__` y `__repr__`?
2. ¿Para qué sirve `super().__init__(...)` en una subclase?
3. ¿Qué significa la convención `_atributo` (un underscore) en Python?
4. ¿Cuándo usar composición en vez de herencia?
5. ¿Qué hace `@abstractmethod` en una Abstract Base Class?

### Recursos principales

- Python — Classes tutorial
- Real Python — OOP
- sklearn.base — Source code
- Python — abc module
- Real Python — OOP Courses

---

## 6. NumPy: Vectorized Computing

> **Tagline**: Arrays, vectorización, broadcasting — por qué NumPy es 100x más rápido que loops
> **Nivel**: Intermedio · **Horas estimadas**: 6h · **Ícono**: Calculator

### Relevancia laboral

NumPy es el motor numérico sobre el que se construyen pandas, scikit-learn y TensorFlow. Cuando escribes `df["col"] * 2` en pandas, internamente NumPy hace la multiplicación vectorizada. Entender broadcasting y vectorización es lo que separa un código que tarda 10 segundos de uno que tarda 10 minutos. En entrevistas técnicas te preguntan: "¿por qué NumPy es más rápido que Python puro?" — la respuesta es vectorización a nivel C.

### Objetivos de aprendizaje

- Crear arrays con np.array, np.zeros, np.ones, np.eye, np.linspace, np.arange
- Indexar y slicear arrays 1D, 2D y n-dimensionales
- Aplicar boolean masking para filtrar elementos
- Entender y aplicar reglas de broadcasting entre arrays de shapes distintas
- Usar funciones estadísticas: mean, std, median, percentile, corrcoef
- Reshaping: reshape, flatten, transpose, -1 wildcard
- Vas a construir un analizador de notas usando SOLO NumPy (sin pandas todavía). Generas datos sintéticos de 500 alumnos en 5 cursos, calculas promedios, identificas top performers, normalizas, y guardas resultados. Es el tipo de análisis que te pueden pedir en una entrevista técnica para un puesto de Data Analyst en una universidad o EdTech.

### Temas de teoría

1. **Arrays de NumPy — la alternativa eficiente a listas**
2. **Vectorización — por qué NumPy es 100x más rápido**
3. **Indexing, slicing y boolean masking**
4. **Broadcasting — operaciones entre shapes distintas**
5. **Reshaping y estadísticas — preparando datos para ML**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Generar datos sintéticos y calcular promedios vectorizados
2. Identificar top 10% y normalizar con broadcasting

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Genera 1000 alturas (cm) con distribución normal (media 165, std 10), detecta outliers con IQR

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Student Exam Score Analyzer — Análisis vectorizado completo

Vas a construir un analizador de notas usando SOLO NumPy (sin pandas todavía). Generas datos sintéticos de 500 alumnos en 5 cursos, calculas promedios, identificas top performers, normalizas, y guardas resultados. Es el tipo de análisis que te pueden pedir en una entrevista técnica para un puesto de Data Analyst en una universidad o EdTech.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `numpy-vectorization` | Analizar | Por qué NumPy es más rápido: arrays contiguos en memoria + operaciones C precompiladas + SIMD. Evita overhead de loops Python. |
| 2 | `boolean-masking` | Aplicar | `arr[arr > 5]` devuelve un nuevo array con elementos que cumplen la condición. Equivalente a WHERE en SQL. |
| 3 | `reshape-minus-one` | Aplicar | `-1` en reshape significa "infiere esta dimensión". `arr.reshape(-1, 1)` convierte a columna. Útil para sklearn. |
| 4 | `axis-semantics` | Aplicar | `axis=0` reduce filas (opera por columnas), `axis=1` reduce columnas (opera por filas). Trampa común: invertirlos. |
| 5 | `numpy-boolean-logic` | Aplicar | Combinar condiciones con `&` y `|` (element-wise), NO `and`/`or` (escalares). Requiere paréntesis por precedencia. |

#### Ejemplo de variantes para un concepto

Para `boolean-masking`, las 3 variantes cambian la condición:

- **V1**: "¿Qué devuelve `arr[arr > 5]`?" — elementos mayores a 5
- **V2**: "¿Cómo obtienes todos los valores pares de `arr`?" — `arr[arr % 2 == 0]`
- **V3**: "¿Qué hace `arr[(arr > 0) & (arr < 10)]`?" — elementos entre 0 y 10 (excluyendo extremos)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Por qué NumPy es más rápido que Python puro para operaciones numéricas?
2. ¿Qué devuelve `arr[arr > 5]`?
3. En broadcasting, ¿qué significa -1 en `arr.reshape(-1, 1)`?
4. ¿Qué hace `matriz.sum(axis=0)` en una matriz 2D?
5. ¿Cuál es la forma correcta de combinar dos condiciones booleanas en NumPy?

### Recursos principales

- NumPy — Official docs
- NumPy — Broadcasting
- Real Python — NumPy tutorial
- Kaggle Learn — NumPy

---

## 7. Adquisición de Datos para Data Science

> **Tagline**: Scraping, regex, SQL, APIs y generators — tu toolkit para conseguir datos del mundo real
> **Nivel**: Intermedio · **Horas estimadas**: 14h · **Ícono**: Download

### Relevancia laboral

En cualquier pega seria de data en Perú — Interbank, BBVA, Mercado Libre, Rimac, Falabella — NUNCA te entregan un CSV limpio. Te dicen "consigue los precios de la competencia en Mercado Libre", "conéctate a la API interna de transacciones", "saca el reporte de la base SQL de créditos", o "limpia estos 50 mil textos libres que mandaron los clientes por WhatsApp". Esta sección cubre EXACTAMENTE esos 5 escenarios: web scraping, consumo de APIs REST, conexión a SQL, expresiones regulares para limpiar texto, generators para no morir con datasets gigantes, y `collections` para escribir código Python idiomático. Quien domina adquisición de datos cobra 30-40% más que un junior que solo sabe `pd.read_csv()`, porque puede llevar un proyecto desde "no tengo los datos" hasta "DataFrame listo para modelar" sin pedirle ayuda a nadie más. Es la skill #1 que separa un Data Analyst Junior de uno Senior.

### Objetivos de aprendizaje

- Construir generators con `yield` para procesar CSVs gigantes sin agotar RAM
- Scrapear sitios con requests + BeautifulSoup y automatizar con Selenium cuando hay JS
- Consumir REST APIs con requests, manejar JSON y paginación automática
- Conectar Python a SQL con sqlite3, SQLAlchemy y pd.read_sql para traer datos a pandas
- Limpiar texto y parsear logs con expresiones regulares (re) — DNIs, teléfonos y emails peruanos
- Usar collections (Counter, defaultdict, namedtuple, deque) en tu Python diario
- Construyes un pipeline llamado `data-acquisition-pipeline` que adquiere datos de 3 fuentes distintas y las unifica en un DataFrame único listo para análisis. Las 3 fuentes: (1) API REST paginada (puedes usar OpenFoodFacts, JSONPlaceholder, o cualquier API pública), (2) scraping de una tabla HTML (puedes usar Wikipedia o cualquier página con datos tabulados), (3) base de datos SQLite local (la creas con datos sintéticos peruanos). El pipeline debe limpiar cada fuente con regex (normalizar nombres, extraer/validar formatos), unificarlas en un schema común, y persistir el resultado a SQLite + parquet. Es lo que harías en tu primer sprint como Data Engineer Junior en una pega peruana.

### Temas de teoría

1. **Iterators & Generators — `yield` para CSVs gigantes**
2. **Web Scraping — requests + BeautifulSoup + Selenium**
3. **REST APIs — requests + JSON + paginación**
4. **SQL Databases — sqlite3, SQLAlchemy y pd.read_sql**
5. **Regular Expressions — limpieza de texto y parsing de logs**
6. **collections — Counter, defaultdict, namedtuple, deque**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. API REST paginada → DataFrame con pd.json_normalize
2. Scraping de tabla HTML → DataFrame con pd.read_html
3. SQL → DataFrame con pd.read_sql + SQLAlchemy engine

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Escribe un generador `stream_csv` que lea un CSV grande fila por fila, filtre filas donde monto > 100, y yield diccionarios. Combínalo con un generador `batch` que agrupe de a N items.
2. Escribe una función `fetch_all_pages` que consuma una API REST con paginación tipo `?page=N` y devuelva una lista con TODOS los items. Maneja rate limiting (HTTP 429) con sleep y retry.
3. Construye una función `ventas_por_region` que se conecte a una DB SQLite, ejecute una query SQL con parámetros, y devuelva un DataFrame con el total de ventas por región en un rango de fechas. Usa pd.read_sql con parámetros `?`.

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Capstone: Data Acquisition Pipeline — 3 fuentes unificadas en un solo DataFrame

Construyes un pipeline llamado `data-acquisition-pipeline` que adquiere datos de 3 fuentes distintas y las unifica en un DataFrame único listo para análisis. Las 3 fuentes: (1) API REST paginada (puedes usar OpenFoodFacts, JSONPlaceholder, o cualquier API pública), (2) scraping de una tabla HTML (puedes usar Wikipedia o cualquier página con datos tabulados), (3) base de datos SQLite local (la creas con datos sintéticos peruanos). El pipeline debe limpiar cada fuente con regex (normalizar nombres, extraer/validar formatos), unificarlas en un schema común, y persistir el resultado a SQLite + parquet. Es lo que harías en tu primer sprint como Data Engineer Junior en una pega peruana.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `generator-yield` | Aplicar | `yield` convierte una función en generator: produce valores perezosamente sin cargar todo en memoria. |
| 2 | `sql-parameterized-queries` | Aplicar | Forma segura: `cursor.execute("SELECT * WHERE id = ?", (id,))`. Evita SQL injection. NUNCA f-strings. |
| 3 | `scraping-ethics` | Analizar | Regla de oro: respetar `robots.txt`, rate-limit (1 req/seg), identificar User-Agent, no sobrecargar el servidor. |
| 4 | `regex-findall` | Aplicar | `re.findall(pattern, string)` devuelve lista de matches. Distinción con `re.finditer` (iterador) y `re.search` (primer match). |
| 5 | `defaultdict-grouping` | Aplicar | `defaultdict(list)` agrupa valores por clave sin verificar `if key not in d: d[key] = []` manualmente. |

#### Ejemplo de variantes para un concepto

Para `sql-parameterized-queries`, las 3 variantes cambian el scenario de inyección:

- **V1**: "¿Cuál es la forma SEGURA de insertar valores en una query SQL en Python?" — `cursor.execute("... = ?", (val,))`
- **V2**: "Si construyes `f"SELECT * FROM users WHERE name = '{user_input}'"`, ¿qué riesgo hay?" — SQL injection
- **V3**: "¿Por qué `cursor.execute("... = %s", (val,))` es seguro aunque `val` contenga comillas?" — el driver escapa el valor automáticamente

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué hace la palabra clave `yield` en una función de Python?
2. ¿Cuál es la forma SEGURA de insertar valores en una query SQL en Python?
3. ¿Cuál es la regla de oro del scraping responsable?
4. ¿Qué función del módulo `re` devuelve TODOS los matches de un patrón como lista?
5. ¿Cuándo usarías `defaultdict(list)` en vez de un dict normal?

### Recursos principales

- Python — itertools & generators HOWTO
- requests — Quickstart
- BeautifulSoup — Docs
- SQLAlchemy — Tutorial 2.0
- re — Regular Expressions

---

## 8. Pandas: Data Cleaning & EDA

> **Tagline**: Tu herramienta principal diaria — groupby, merge, limpieza y EDA profesional
> **Nivel**: Intermedio · **Horas estimadas**: 12h · **Ícono**: Table2

### Relevancia laboral

Pandas es el 80% del día a día de un Data Analyst. Las empresas peruanas (Interbank, BBVA, Caja Arequipa) te van a pedir "limpia este dataset", "hazme un reporte de ventas por región", "cruza estos dos datasets". Todo eso es pandas. Un dominio sólido de groupby, merge y limpieza te hace inmediatamente productivo. Sin pandas, no hay trabajo de Data Analyst.

### Objetivos de aprendizaje

- Cargar datos con read_csv, read_json, read_excel con opciones (dtype, parse_dates, na_values)
- Inspeccionar con .info(), .describe(), .head(), .value_counts(), .nunique()
- Manejar nulos con .isnull(), .fillna(), .dropna(), interpolación
- Manipular strings con .str accessor: strip, lower, contains, split, replace
- Agrupar con .groupby() y agregar con .agg(), .transform(), .apply()
- Combinar DataFrames con .merge(), .concat(), .join()
- Crear pivot tables y crosstabs
- Trabajar con fechas: pd.to_datetime(), .dt accessor, resample()
- Tu primer proyecto completo de EDA. Descarga el dataset Netflix Movies and TV Shows de Kaggle (gratis, solo necesitas cuenta). Haz un EDA completo respondiendo 5+ preguntas de negocio, limpia los datos, y exporta un dataset limpio. Este es EXACTAMENTE el formato de take-home project que mandan empresas US para puestos de Data Analyst.

### Temas de teoría

1. **Series y DataFrame — las dos estructuras de pandas**
2. **Limpieza de datos — el 80% del trabajo real**
3. **GroupBy — el corazón del análisis**
4. **Merge, concat y pivot — combinar y reestructurar**
5. **Time series con pandas — fechas, resample, rolling**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Cargar dataset y hacer inspección inicial
2. Limpiar y responder 5 preguntas de negocio

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Calcula salario promedio por departamento y identifica el top 3 de cada uno

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Real-World EDA Report — Tu primer proyecto de portafolio

Tu primer proyecto completo de EDA. Descarga el dataset Netflix Movies and TV Shows de Kaggle (gratis, solo necesitas cuenta). Haz un EDA completo respondiendo 5+ preguntas de negocio, limpia los datos, y exporta un dataset limpio. Este es EXACTAMENTE el formato de take-home project que mandan empresas US para puestos de Data Analyst.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `pandas-groupby-agg` | Aplicar | `df.groupby("region")["salario"].mean()` agrupa por región y calcula promedio de salario. Patrón split-apply-combine. |
| 2 | `loc-vs-iloc` | Aplicar | `.loc` es label-based (nombres de índice/columna), `.iloc` es position-based (enteros). Confusión causa bugs silenciosos. |
| 3 | `null-handling` | Analizar | Estrategias para nulos numéricos: `.fillna(0)`, `.fillna(median)`, `.dropna()`, o imputación por modelo. Trade-offs. |
| 4 | `merge-join-types` | Aplicar | `how="left"` mantiene todas las filas de df1; "inner" solo coincidentes; "outer" todas; "right" espejo de left. |
| 5 | `time-series-resample` | Aplicar | `.resample("M").sum()` re-muestrea a frecuencia mensual y suma. Requiere índice datetime. Equivalente a GROUP BY por mes. |

#### Ejemplo de variantes para un concepto

Para `merge-join-types`, las 3 variantes cambian el tipo de join:

- **V1**: "¿Qué hace `pd.merge(df1, df2, on='id', how='left')`?" — todas las filas de df1, NaN donde no hay match
- **V2**: "Si df1 tiene 100 filas y df2 tiene 50 (todas con id en df1), ¿cuántas filas devuelve `how='inner'`?" — 50
- **V3**: "¿Qué tipo de join usarías para mantener todos los clientes incluso los sin pedidos?" — `how='left'` desde clientes

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué hace `df.groupby("region")["salario"].mean()`?
2. ¿Cuál es la diferencia entre .loc y .iloc?
3. ¿Cómo manejas valores nulos en una columna numérica?
4. ¿Qué hace `pd.merge(df1, df2, on="id", how="left")`?
5. ¿Para qué sirve `.resample("M").sum()` en un DataFrame con índice datetime?

### Recursos principales

- Pandas — Official docs
- Pandas — Cookbook
- Kaggle Learn — Pandas
- Real Python — Pandas
- Kaggle Learn — Data Cleaning

---

## 9. Data Visualization

> **Tagline**: matplotlib, seaborn y plotly — de gráficos básicos a reportes ejecutivos interactivos
> **Nivel**: Intermedio · **Horas estimadas**: 8h · **Ícono**: BarChart3

### Relevancia laboral

En entrevistas y en el trabajo, vas a presentar insights a stakeholders no técnicos. Un buen gráfico vale más que 1000 líneas de código. Las empresas peruanas valoran analysts que saben contar historias con datos — matplotlib para exploración, seaborn para estadística, plotly para dashboards interactivos. Tu portafolio necesita visualizaciones pulidas.

### Objetivos de aprendizaje

- Crear gráficos con matplotlib: line, bar, scatter, histogram, box plot, subplots
- Usar seaborn para gráficos estadísticos: heatmap, pairplot, violin, countplot
- Crear gráficos interactivos con plotly: px.bar, px.scatter, px.line
- Aplicar styling: títulos, labels, colores, leyendas, anotaciones
- Combinar múltiples gráficos en una figura con subplots
- Guardar figuras como PNG (matplotlib) y HTML (plotly)
- Extiende el proyecto de la Sección 7 (Netflix EDA) con visualizaciones profesionales. Vas a crear 4 gráficos estáticos (PNG) y 1 interactivo (HTML). Estos van a tu GitHub como parte de tu portafolio. Un buen reporte visual es lo que diferencia un analista junior de uno mid-level a ojos de un reclutador.

### Temas de teoría

1. **matplotlib — la base de todo**
2. **Subplots y figure/axes — gráficos multi-panel**
3. **seaborn — gráficos estadísticos con una línea**
4. **plotly — interactividad para dashboards**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Crear figura 4 paneles con matplotlib + seaborn
2. Agregar heatmap de correlación y plotly interactivo

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Crea un gráfico de líneas de ventas mensuales con matplotlib, separando 2 años

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Add Visuals to Your Netflix EDA — Tu primera pieza de portafolio visual

Extiende el proyecto de la Sección 7 (Netflix EDA) con visualizaciones profesionales. Vas a crear 4 gráficos estáticos (PNG) y 1 interactivo (HTML). Estos van a tu GitHub como parte de tu portafolio. Un buen reporte visual es lo que diferencia un analista junior de uno mid-level a ojos de un reclutador.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `matplotlib-oo-api` | Aplicar | API orientada a objetos (`fig, ax = plt.subplots()`) es preferida sobre `pyplot` directa para gráficos serios: más control, reutilizable. |
| 2 | `tight-layout` | Recordar | `plt.tight_layout()` ajusta automáticamente padding para evitar overlap de labels, ticks y leyendas. |
| 3 | `seaborn-vs-matplotlib` | Analizar | Seaborn para statistical plots (heatmap, violin, pairplot) con menos código. Matplotlib para control fino o gráficos no estadísticos. |
| 4 | `plotly-web-export` | Aplicar | Plotly se guarda como HTML interactivo (`fig.write_html()`) para web. PNG estático requiere `kaleido`. |
| 5 | `heatmap-params` | Aplicar | `annot=True` muestra valores, `cmap="coolwarm"` divergente para correlación, `center=0` fija el centro del colormap. |

#### Ejemplo de variantes para un concepto

Para `seaborn-vs-matplotlib`, las 3 variantes cambian el escenario:

- **V1**: "¿Cuándo usar seaborn en vez de matplotlib?" — statistical plots (heatmap, violin, pairplot)
- **V2**: "¿Qué librería usarías para un pairplot de 5 variables con KDE?" — seaborn (`sns.pairplot`)
- **V3**: "¿Cuándo matplotlib es mejor que seaborn?" — cuando necesitas control fino de elementos no estadísticos

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuál es la API recomendada de matplotlib para gráficos serios?
2. ¿Para qué sirve `plt.tight_layout()`?
3. ¿Cuándo usar seaborn en vez de matplotlib?
4. ¿Cómo guardas un gráfico plotly para web?
5. ¿Qué hace `sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)`?

### Recursos principales

- matplotlib — Official tutorials
- seaborn — Gallery
- plotly — Python docs
- Python Graph Gallery
- Kaggle Learn — Data Visualization

---

## 10. scikit-learn: Full ML Pipeline

> **Tagline**: Pipeline, ColumnTransformer, cross-validation, tuning y SHAP — production-grade ML
> **Nivel**: Avanzado · **Horas estimadas**: 14h · **Ícono**: Brain

### Relevancia laboral

scikit-learn es EL framework de ML para tabular data. El 80% de los problemas de ML en empresas peruanas (churn, scoring, forecasting, segmentación) se resuelven con sklearn. Pipeline + ColumnTransformer es lo que te piden en take-home projects. SHAP para explainability es el diferenciador que hace que tu modelo sea confiable para negocio. Sin esto, no hay puesto de Data Scientist.

### Objetivos de aprendizaje

- Construir Pipeline con ColumnTransformer para preprocesamiento
- Aplicar StandardScaler, MinMaxScaler, OneHotEncoder, SimpleImputer
- Evaluar con train_test_split, StratifiedKFold, cross_val_score
- Entrenar modelos: LogisticRegression, RandomForest, XGBoost
- Calcular métricas: accuracy, ROC-AUC, precision, recall, F1
- Tune hiperparámetros con GridSearchCV y RandomizedSearchCV
- Interpretar modelos con SHAP (beeswarm, waterfall)
- Persistir modelos con joblib.dump() y joblib.load()
- Este es el proyecto capstone del curso. Vas a construir un pipeline completo de churn prediction: descargar el dataset Telco Customer Churn de Kaggle, hacer EDA, construir Pipeline con ColumnTransformer, comparar 3 modelos (LogisticRegression, RandomForest, XGBoost), tune con RandomizedSearchCV, explicar con SHAP, y persistir con joblib. Este proyecto, bien hecho, te abre puertas en cualquier empresa de telecom, banca o SaaS.

### Temas de teoría

1. **Pipeline y ColumnTransformer — preprocesamiento production-ready**
2. **Cross-validation y métricas — evaluación honesta**
3. **Hyperparameter tuning con GridSearchCV y RandomizedSearchCV**
4. **SHAP — interpretación de modelos black-box**
5. **Model persistence con joblib**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Construir pipeline con 3 modelos en paralelo
2. Tune del mejor modelo + SHAP + persistencia

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Construye un Pipeline con preprocessor + LogisticRegression y evalúa con CV

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Churn Prediction Production Pipeline — Tu HERO project de portafolio

Este es el proyecto capstone del curso. Vas a construir un pipeline completo de churn prediction: descargar el dataset Telco Customer Churn de Kaggle, hacer EDA, construir Pipeline con ColumnTransformer, comparar 3 modelos (LogisticRegression, RandomForest, XGBoost), tune con RandomizedSearchCV, explicar con SHAP, y persistir con joblib. Este proyecto, bien hecho, te abre puertas en cualquier empresa de telecom, banca o SaaS.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `pipeline-benefits` | Analizar | Pipeline evita data leakage (aplica transformaciones solo en train fold), simplifica código, permite CV con una sola llamada. |
| 2 | `stratified-kfold` | Aplicar | `StratifiedKFold` mantiene la proporción de clases en cada fold. Crítico en clasificación desbalanceada (ej: 5% churn). |
| 3 | `randomized-vs-grid-search` | Analizar | RandomizedSearchCV mejor cuando hay >6 hiperparámetros o rangos continuos. GridSearchCV exponencial con cada parámetro. |
| 4 | `shap-purpose` | Aplicar | SHAP descompone una predicción en contribuciones por feature. Permite explicar por qué el modelo predijo X para este cliente. |
| 5 | `pipeline-param-access` | Aplicar | Sintaxis `pipeline.named_steps['clf'].C` o `pipeline.get_params()['clf__C']` para acceder a hiperparámetros anidados. |

#### Ejemplo de variantes para un concepto

Para `pipeline-benefits`, las 3 variantes cambian el ángulo:

- **V1**: "¿Por qué usar Pipeline en vez de aplicar transformaciones por separado?" — evita data leakage en CV
- **V2**: "Si escalas con `StandardScaler` en todo el dataset antes de CV, ¿qué pasa?" — data leakage: el scaler ve stats del test fold
- **V3**: "¿Qué ventaja tiene `Pipeline([('scaler', ...), ('clf', ...)])` sobre llamarlos por separado?" — CV aplicado correctamente + serialización

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Por qué usar Pipeline en vez de aplicar transformaciones por separado?
2. ¿Qué hace `StratifiedKFold` y por qué usarlo en clasificación?
3. ¿Cuándo es mejor RandomizedSearchCV sobre GridSearchCV?
4. ¿Para qué sirve SHAP en ML?
5. ¿Cómo accedes al parámetro `C` de un LogisticRegression dentro de un Pipeline?

### Recursos principales

- scikit-learn — User Guide
- scikit-learn — Pipelines
- SHAP — Official docs
- Telco Churn dataset
- Kaggle Learn — Intermediate ML

---

## 11. Testing Your Python Code

> **Tagline**: pytest, fixtures, coverage y CI con GitHub Actions — el diferenciador senior
> **Nivel**: Avanzado · **Horas estimadas**: 6h · **Ícono**: ShieldCheck

### Relevancia laboral

Testing es lo que diferencia un junior de un senior a ojos de hiring managers. Un repo con tests + badge verde de CI dice "este developer es serio". En LATAM, donde la mayoría no hace tests, tener GitHub Actions con pytest-cov te posiciona como US-trained. Las empresas serias (Rimac, Interbank, Mercado Libre) exigen tests para merges a main. Sin tests, tu código no es production-ready.

### Objetivos de aprendizaje

- Escribir tests con pytest: assert, funciones test_, archivos test_*.py
- Usar fixtures (@pytest.fixture) para setup/teardown reutilizable
- Parametrizar tests con @pytest.mark.parametrize
- Testear DataFrames: shape, dtypes, nulls, rangos
- Testear ML pipelines: output shape, no NaN, valid ranges
- Medir cobertura con pytest-cov
- Configurar GitHub Actions CI con badge en README
- Vas a agregar tests al proyecto capstone de churn (sección 9). Es lo que hace que tu repo pase de "proyecto de curso" a "proyecto production-ready". Un repo con tests + GitHub Actions con badge verde te posiciona como US-trained engineer a ojos de hiring managers peruanos e internacionales.

### Temas de teoría

1. **Filosofía de testing — por qué y qué testear**
2. **pytest — el estándar de testing en Python**
3. **Fixtures — setup/teardown reutilizable**
4. **Testing DataFrames y ML pipelines — el caso de data science**
5. **Coverage y GitHub Actions — CI/CD profesional**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Crear tests para carga y validación de datos
2. Crear tests para el pipeline de ML

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Escribe tests para una función limpiar_df() que limpia un DataFrame

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Test Suite for Your Churn Project — El diferenciador senior

Vas a agregar tests al proyecto capstone de churn (sección 9). Es lo que hace que tu repo pase de "proyecto de curso" a "proyecto production-ready". Un repo con tests + GitHub Actions con badge verde te posiciona como US-trained engineer a ojos de hiring managers peruanos e internacionales.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `pytest-discovery` | Recordar | Convención: archivos `test_*.py` o `*_test.py`, funciones `test_*`, clases `Test*`. pytest los descubre automáticamente. |
| 2 | `pytest-fixtures` | Aplicar | Fixtures proveen datos/setup reutilizable vía inyección de dependencias. `@pytest.fixture` + argumento con mismo nombre. |
| 3 | `parametrize-decorator` | Aplicar | `@pytest.mark.parametrize("input,expected", [(1,2), (2,4)])` ejecuta el test N veces con datos distintos. Evita tests duplicados. |
| 4 | `coverage-measurement` | Aplicar | `pytest --cov=mi_modulo` mide qué líneas ejecutaron los tests. Meta típica: >80%. Reporta líneas no cubiertas. |
| 5 | `github-actions-ci` | Analizar | GitHub Actions corre tests en cada push/PR. Workflow YAML en `.github/workflows/`. Bloquea merge si tests fallan. |

#### Ejemplo de variantes para un concepto

Para `pytest-discovery`, las 3 variantes cambian el formato:

- **V1**: "¿Cuál es la convención de nombres para que pytest descubra tus tests?" — `test_*.py` / `*_test.py` / funciones `test_*`
- **V2**: "¿Por qué pytest NO encuentra `def calcular_promedio():` en `test_utils.py`?" — no empieza con `test_`
- **V3**: "¿Qué hace `pytest tests/`?" — descubre y ejecuta todos los tests bajo `tests/` siguiendo la convención

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuál es la convención de nombres para que pytest descubra tus tests?
2. ¿Para qué sirve una fixture en pytest?
3. ¿Qué hace `@pytest.mark.parametrize`?
4. ¿Qué mide `pytest --cov=mi_modulo`?
5. ¿Para qué sirve GitHub Actions en testing?

### Recursos principales

- pytest — Official docs
- pytest — Fixtures
- pytest-cov
- GitHub Actions — Python
- Real Python — Testing

---

## 12. Performance, Concurrency & Logging

> **Tagline**: Multiprocessing, profiling, logging y argparse — código production-ready
> **Nivel**: Avanzado · **Horas estimadas**: 10h · **Ícono**: Gauge

### Relevancia laboral

En cualquier pega seria de data, el código tiene que ser RÁPIDO, OBSERVABLE y REUSABLE. "Rápido" significa paralelizar feature engineering con multiprocessing para que un job de 4 horas baje a 35 minutos. "Observable" significa logging estructurado para que cuando el pipeline se cae a las 3am, los logs te digan EXACTAMENTE en qué etapa y por qué — sin reproducir el error en tu laptop. "Reusable" significa empaquetarlo como CLI con argparse para que tus colegas lo usen sin abrir un notebook. Estas 4 skills — multiprocessing, profiling, logging, argparse — son lo que separa un junior que escribe scripts que "funcionan en mi laptop" de un senior que entrega pipelines production-ready que corren en servidores, scheduleados, monitoreados, y usados por todo el equipo de data. En empresas peruanas como Interbank, BBVA, Mercado Libre y Rimac, este perfil cobra 40-60% más que un Data Analyst que solo sabe pandas.

### Objetivos de aprendizaje

- Paralelizar feature engineering con multiprocessing y concurrent.futures (Process vs Thread)
- Entender el GIL y cuándo usar ProcessPoolExecutor vs ThreadPoolExecutor
- Perfil código con timeit, cProfile y line_profiler para encontrar bottlenecks
- Configurar logging estructurado (JSON, RotatingFileHandler) para pipelines en producción
- Convertir notebooks en herramientas CLI reutilizables con argparse
- Empaquetar un CLI como ejecutable instalable con pyproject.toml + entry_points
- Te dan un script de 200 líneas que procesa 100k transacciones de un banco peruano (datos sintéticos). El script tarda 8 minutos, no tiene logs, no maneja errores, y solo funciona si editas variables dentro del código. Tu misión: (1) perfilarlo para encontrar el bottleneck, (2) paralelizar el feature engineering con multiprocessing, (3) agregar logging estructurado a archivo rotado, (4) empaquetarlo como CLI con argparse, (5) instalarlo como ejecutable con pyproject.toml. El resultado debe correr en 30 segundos (16x speedup) y ser usable por cualquier colega con `pip install -e .` y `perf-opt --help`. Es exactamente el tipo de refactor que harías en tu segundo mes como Data Engineer Junior.

### Temas de teoría

1. **Multiprocessing & concurrent.futures — Process vs Thread y el GIL**
2. **Profiling & Benchmarking — timeit, cProfile, line_profiler**
3. **Logging — producción DS necesita logs estructurados**
4. **argparse / CLI tooling — de notebook a herramienta reusable**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Paralelizar feature engineering con ProcessPoolExecutor
2. Perfil de una función lenta con cProfile + line_profiler
3. Logging estructurado integrado con un CLI de argparse

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Escribe una función `parallel_squares` que reciba una lista de 10,000 enteros, calcule el cuadrado de cada uno con una función `square(x)`, y devuelva la lista de resultados. Compara el tiempo secuencial vs paralelo con ProcessPoolExecutor(max_workers=8).
2. Tienes una función `limpiar_nombres_lento` que itera con .loc[i] sobre un DataFrame para limpiar nombres (capitalizar, quitar espacios). Perfílala con cProfile conceptualmente, identifica el bottleneck, y reescríbela vectorizada para lograr 50x+ speedup.
3. Configura un logger con dos handlers: consola (INFO+) y archivo rotado (DEBUG+, 1MB, 3 backups). Escribe una función `procesar` que loggee inicio, progreso cada 1000 items, warnings si hay nulos, y fin con tiempo total.

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Capstone: Performance Optimizer — de script lento a CLI production-ready

Te dan un script de 200 líneas que procesa 100k transacciones de un banco peruano (datos sintéticos). El script tarda 8 minutos, no tiene logs, no maneja errores, y solo funciona si editas variables dentro del código. Tu misión: (1) perfilarlo para encontrar el bottleneck, (2) paralelizar el feature engineering con multiprocessing, (3) agregar logging estructurado a archivo rotado, (4) empaquetarlo como CLI con argparse, (5) instalarlo como ejecutable con pyproject.toml. El resultado debe correr en 30 segundos (16x speedup) y ser usable por cualquier colega con `pip install -e .` y `perf-opt --help`. Es exactamente el tipo de refactor que harías en tu segundo mes como Data Engineer Junior.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `process-vs-thread-pool` | Analizar | ProcessPool para CPU-bound (multiplexa cores), ThreadPool para I/O-bound (network/disk). GIL bloquea threads en CPU puro. |
| 2 | `optimization-rule-1` | Recordar | Regla #1: profilea antes de optimizar. `cProfile` + `pstats` identifican el 20% del código que causa 80% del tiempo. |
| 3 | `logging-no-fstrings` | Analizar | f-strings se evalúan SIEMPRE aunque el log level esté apagado. Usar `logger.info("msg %s", val)` (lazy formatting). |
| 4 | `rotating-file-handler` | Aplicar | `RotatingFileHandler` rota el log cuando alcanza tamaño maxBytes, manteniendo N backups. Evita logs que crecen indefinidamente. |
| 5 | `cli-entry-point` | Aplicar | Entry point en `pyproject.toml`: `[project.scripts] mytool = "mytool.cli:main"`. `pip install .` crea el ejecutable. |

#### Ejemplo de variantes para un concepto

Para `process-vs-thread-pool`, las 3 variantes cambian el escenario:

- **V1**: "¿Cuándo usarías ProcessPoolExecutor vs ThreadPoolExecutor?" — CPU-bound → Process, I/O-bound → Thread
- **V2**: "Tienes una función que descarga 100 URLs. ¿Qué pool usas?" — ThreadPool (I/O-bound, GIL no bloquea en I/O)
- **V3**: "Tienes una función que calcula primos hasta 1M. ¿Qué pool usas?" — ProcessPool (CPU-bound, GIL bloquea threads)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuándo usarías ProcessPoolExecutor vs ThreadPoolExecutor?
2. ¿Cuál es la regla #1 de optimización de performance?
3. ¿Por qué NO debes usar f-strings en mensajes de logging?
4. ¿Qué hace RotatingFileHandler en el módulo logging?
5. ¿Cómo haces que tu script Python sea instalable como comando del sistema?

### Recursos principales

- concurrent.futures — Docs
- multiprocessing — Docs
- cProfile — Docs
- line_profiler — GitHub
- logging — HOWTO oficial

---

## 13. RPA & Automatización con IA

> **Tagline**: Playwright, Ollama, OCR, Prefect — automatiza tareas multi-modales con IA local
> **Nivel**: Avanzado · **Horas estimadas**: 14h · **Ícono**: Bot

### Relevancia laboral

La automatización es el skill #1 que busca el mercado peruano 2025-2026 según análisis de LinkedIn: el rol "Automation Architect" aparece explícitamente en publicaciones de Interbank, BBVA, Mercado Libre, Credicorp, Falabella y矿 Backus. Las empresas ya no quieren un Data Scientist que solo entrena modelos — quieren alguien que pueda tomar un proceso manual repetitivo (conciliar facturas, scrapear precios de la competencia, generar reportes semanales, transcribir audios de reuniones) y convertirlo en un bot que corre solo. Esta sección cubre el stack 2025-2026: Playwright (browser automation moderno), Ollama (LLM local gratis y privado), pytesseract + OpenCV (OCR para facturas PDF), Whisper (audio → texto), Prefect (orquestación con @task/@flow), y GitHub Actions (scheduling gratis para tu portafolio). Quien domina esta sección puede automatizar 80% de las tareas manuales de un equipo de operaciones o contabilidad — y eso vale 50-80% más en salario que un Data Scientist sin skills de automation.

### Objetivos de aprendizaje

- Seleccionar entre Python-RPA, UiPath y Power Automate con una matriz de decisión clara
- Automatizar browsers con Playwright: headless, selectors, login flows, screenshots
- Automatizar desktop y archivos con pyautogui, pathlib y watchdog (folder triggers)
- Extraer texto de PDFs y imágenes con pdfplumber + pytesseract + OpenCV preprocessing
- Integrar IA local con Ollama y cloud con OpenAI API structured outputs (pydantic)
- Transcribir audio con Whisper y clasificar texto con Hugging Face transformers
- Orquestar pipelines con Prefect @task/@flow, tenacity retries y GitHub Actions cron
- Construyes un bot end-to-end llamado `invoice-digitizer` que digitaliza facturas peruanas (PDF/imagen) automáticamente. El bot monitorea una carpeta donde caen facturas (descargadas del portal SUNAT, escaneadas, o enviadas por email). Por cada factura: (1) extrae texto con pdfplumber (PDF digital) o pytesseract+OpenCV (PDF escaneado/imagen), (2) usa Ollama local para extraer campos estructurados (RUC emisor, razón social, monto total, IGV, fecha), (3) valida RUC contra padrón (regex + dígito verificador), (4) persiste en SQLite para queries, (5) genera Excel mensual para contabilidad, (6) corre automáticamente cada noche con GitHub Actions. Es exactamente el bot que usaría un equipo de contabilidad para ahorrar 20+ horas semanales de tipeo manual.

### Temas de teoría

1. **RPA landscape & tool selection — Python vs UiPath vs Power Automate**
2. **Browser automation con Playwright — el Selenium moderno**
3. **Desktop & file automation — pyautogui, pathlib y watchdog**
4. **Document & OCR processing — pdfplumber + pytesseract + OpenCV**
5. **AI-augmented automation — Ollama, OpenAI structured outputs, Whisper, Hugging Face**
6. **Orchestration & scheduling — Prefect, tenacity, GitHub Actions**

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Playwright scrape: extraer productos de una web con login
2. Ollama extraction: extraer campos estructurados de factura
3. Prefect pipeline: orquestar bot completo con retries

### We Do — Práctica guiada (Hacemos juntos)

*El estudiante escribe código con guía. Se provee starter code, hints y solución.*

1. Escribe una función `scrapear_titulos` que use Playwright para ir a una URL, esperar a que cargue, y extraer todos los títulos h2 de la página. Devuelve una lista de strings.
2. Define un modelo pydantic `Cliente` con campos (nombre, dni, edad, email) y escribe una función `extraer_cliente_de_texto` que use Ollama para extraer estos campos de un texto libre. Devuelve un objeto Cliente validado.
3. Construye un flow de Prefect con 2 tasks: `descargar_datos` (que falla aleatoriamente para forzar retry) y `procesar_datos` (que recibe la lista y calcula el total). El flow debe tener retries=3 en la task que falla.

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Capstone: Invoice Digitizer Bot — PDF folder → OCR/extract → LLM structure → SQLite + Excel

Construyes un bot end-to-end llamado `invoice-digitizer` que digitaliza facturas peruanas (PDF/imagen) automáticamente. El bot monitorea una carpeta donde caen facturas (descargadas del portal SUNAT, escaneadas, o enviadas por email). Por cada factura: (1) extrae texto con pdfplumber (PDF digital) o pytesseract+OpenCV (PDF escaneado/imagen), (2) usa Ollama local para extraer campos estructurados (RUC emisor, razón social, monto total, IGV, fecha), (3) valida RUC contra padrón (regex + dígito verificador), (4) persiste en SQLite para queries, (5) genera Excel mensual para contabilidad, (6) corre automáticamente cada noche con GitHub Actions. Es exactamente el bot que usaría un equipo de contabilidad para ahorrar 20+ horas semanales de tipeo manual.


### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `python-rpa-vs-enterprise` | Analizar | Python-RPA es open-source, integrable con DS stack, sin licencias. UiPath/Power Automate son visuales pero costosos y cerrados. |
| 2 | `playwright-vs-selenium` | Analizar | Playwright: auto-waiting, multi-browser (Chromium/Firefox/WebKit), mejor API. Selenium: más viejo, pero mayor adopción y soporte. |
| 3 | `ocr-llm-pipeline` | Analizar | OCR (pytesseract) extrae texto del PDF/imagen, LLM (Ollama) lo estructura (JSON con campos). OCR solo no entiende semántica. |
| 4 | `ollama-vs-openai` | Analizar | Ollama local: gratis, privado, sin rate limit, pero requiere GPU. OpenAI: mejor calidad, sin setup, pero costoso y envía datos. |
| 5 | `prefect-retries` | Aplicar | `@task(retries=3, retry_delay_seconds=30)` reintenta 3 veces con 30s entre cada. Ideal para APIs inestables o scraping. |

#### Ejemplo de variantes para un concepto

Para `ollama-vs-openai`, las 3 variantes cambian el escenario de decisión:

- **V1**: "¿Cuándo debes usar Ollama local vs OpenAI API?" — privacidad/costo → Ollama; calidad/setup → OpenAI
- **V2**: "Procesas facturas con datos sensibles de clientes. ¿Qué LLM usas?" — Ollama local (no envías datos a terceros)
- **V3**: "Necesitas el mejor modelo para resumir documentos legales en español. ¿Qué eliges?" — OpenAI API (mejor calidad en español)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuándo elegirías Python-RPA sobre UiPath o Power Automate?
2. ¿Qué ventaja clave tiene Playwright sobre Selenium en 2025-2026?
3. ¿Por qué combinar OCR (pytesseract) con un LLM (Ollama) para extraer datos de facturas?
4. ¿Cuándo debes usar Ollama local vs OpenAI API?
5. ¿Qué hace `@task(retries=3, retry_delay_seconds=30)` en Prefect?

### Recursos principales

- Playwright — Python docs
- pyautogui — Docs
- watchdog — Docs
- pdfplumber — GitHub
- pytesseract — Docs

---

## Fase 1 — Competente (Secciones 14-26)

> **Objetivo de la fase**: Llevar a un estudiante Fundamentos (S1-S13) al nivel Competente, donde puede construir sistemas completos que combinan backend (FastAPI), RAG (embeddings), data engineering (ETL idempotente), bases de datos (ORM), visión por computadora, entity resolution (RapidFuzz), RPA avanzada y dashboards (Streamlit). El capstone S26 integra todo en una plataforma AI vendible.
>
> **Horas totales fase 1**: 150h · **Prerrequisito**: haber aprobado Fase 0 (S1-S13) o demostrar equivalencia mediante examen diagnóstico.

---

## 14. Seguridad para Automatizaciones e IA

> **Tagline**: La automatización no protegida es una bomba de tiempo. La IA sin seguridad es una puerta trasera.
> **Nivel**: Competente · **Horas estimadas**: 10h · **Ícono**: ShieldCheck

### Relevancia laboral

La seguridad en automatizaciones e IA es el gap más grande del mercado peruano y LATAM. En 2026, el 65% de las brechas de seguridad involucran algún componente de IA o automatización. Las empresas US y globales requieren que sus ingenieros entiendan el OWASP LLM Top 10 (2025), protejan pipelines de datos, y defiendan modelos contra prompt injection. Obligatoria para cualquier perfil mid-senior que postule a roles con acceso a datos sensibles (banca, salud, gobierno).

### Objetivos de aprendizaje

- Aplicar el OWASP LLM Top 10 (2025) a aplicaciones reales con IA
- Implementar defensa en capas contra prompt injection directa e indirecta
- Usar `presidio` de Microsoft para anonimización de PII en pipelines de datos
- Aplicar `detect-secrets` y gestión segura de credenciales con variables de entorno
- Entender hashing y criptografía con `hashlib`, `cryptography` (Python 201 Ch. 14)
- Implementar logging de auditoría y trazabilidad en bots y agentes
- Aplicar el principio de mínimo privilegio en automatizaciones con APIs y bases de datos

### Temas de teoría

1. OWASP LLM Top 10 (2025): LLM01 Prompt Injection, LLM02 Sensitive Info Disclosure, LLM03 Supply Chain, LLM04 Data Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector/Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption
2. Criptografía práctica en Python: hashlib SHA-256, PBKDF2 key derivation, cryptography Fernet (symmetric) y RSA (asymmetric)
3. Gestión de secretos: python-decouple, python-dotenv, AWS Secrets Manager básico, nunca hardcodear API keys
4. Anonimización y PII: Microsoft presidio — detección y anonimización de NIT, DNI, correos, teléfonos peruanos en DataFrames

### I Do — Demostración guiada (Yo hago)

*El instructor demuestra paso a paso con explicación del "por qué" de cada línea.*

1. Hash de passwords con PBKDF2 y verificación segura (constant-time comparison)
2. Cifrado simétrico con Fernet para datos sensibles en bases de datos
3. Detección de PII peruana (DNI, RUC) con presidio y custom recognizers

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa un decorador `@audit_log` que registre quién llamó cada función con qué argumentos
2. Anonimiza un DataFrame de clientes con DNI, emails y teléfonos usando presidio

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Secure Invoice Pipeline — Pipeline de facturas con cifrado end-to-end, anonimización de PII, y audit logging. Las facturas se encriptan al ingresar, se anonimizan para análisis, y cada acceso queda registrado. Es el tipo de pipeline que un equipo FinTech peruano necesita para cumplir con la Ley de Protección de Datos Personales (Ley N° 29733).

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `owasp-llm-prompt-injection` | Analizar | LLM01: atacante inserta instrucciones maliciosas en input directo (prompt) o indirecto (datos recuperados). Defensa: input validation, system prompt hardening, output filtering. |
| 2 | `pbkdf2-vs-sha256` | Analizar | PBKDF2 con salt + alta iteración es seguro para passwords (slow = good). SHA-256 solo es vulnerable a rainbow tables y brute force (fast = bad para passwords). |
| 3 | `fernet-symmetric-encryption` | Aplicar | Fernet (cryptography lib) cifra simétricamente con AES-128-CBC + HMAC. Ideal para datos sensibles en DB: el valor cifrado se revierte solo con la key. |
| 4 | `secret-management-best-practices` | Aplicar | Nunca hardcodear API keys. Usar `.env` (dev) + AWS Secrets Manager / GCP Secret Manager (prod). `detect-secrets` en pre-commit evita leaks accidentales. |
| 5 | `presidio-pii-anonymization` | Aplicar | Presidio detecta y anonimiza PII (emails, teléfonos, DNI). Custom recognizers para formatos peruanos (DNI 8 dígitos, RUC 11 dígitos). |

#### Ejemplo de variantes para un concepto

Para `pbkdf2-vs-sha256`, las 3 variantes cambian el escenario:

- **V1**: "¿Por qué PBKDF2 con 100k iteraciones es más seguro que SHA-256 solo para passwords?" — slow = resistente a brute force
- **V2**: "Si un atacante roba tu DB de users con hashes SHA-256 puro, ¿qué ataque es trivial?" — rainbow tables / GPU brute force
- **V3**: "¿Por qué PBKDF2 necesita un salt único por usuario?" — evita que dos users con mismo password tengan el mismo hash

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es prompt injection directa vs indirecta en LLMs?
2. ¿Por qué PBKDF2 es más seguro que SHA-256 para almacenar passwords?
3. ¿Qué hace Fernet en la librería `cryptography`?
4. ¿Por qué NO debes commitear `.env` a Git?
5. ¿Cómo detectas y anonimzas DNI peruanos en un DataFrame con presidio?

### Recursos principales

- OWASP LLM Top 10 (2025)
- cryptography — Fernet docs
- Microsoft Presidio — GitHub
- Python 201 (Michael Driscoll) — Ch. 14 Cryptography
- pre-commit / detect-secrets

---

## 15. Python Standard Library Deep Dive

> **Tagline**: functools, itertools, collections, contextlib — las 4 librerías que separan a un Python junior de uno senior
> **Nivel**: Competente · **Horas estimadas**: 10h · **Ícono**: Layers

### Relevancia laboral

Un desarrollador que domina `functools.lru_cache`, `itertools.chain`, `collections.namedtuple` y `contextlib.contextmanager` escribe código 3x más limpio y eficiente que uno que no. Estas librerías son parte de la stdlib — no requieren `pip install` — y están presentes en cualquier Python del mundo. En entrevistas técnicas mid-senior, te preguntan específicamente sobre estas 4 librerías porque revelan madurez con el lenguaje.

### Objetivos de aprendizaje

- Dominar `functools`: `lru_cache`, `partial`, `wraps`, `reduce`, `singledispatch`
- Dominar `itertools`: `chain`, `combinations`, `permutations`, `groupby`, `islice`, `starmap`
- Dominar `collections`: `Counter`, `defaultdict`, `OrderedDict`, `deque`, `namedtuple`
- Dominar `contextlib`: `contextmanager`, `suppress`, `ExitStack`, `closing`
- Aplicar estas librerías para refactorizar código procedural en funcional/declarativo

### Temas de teoría

1. functools: memoización con lru_cache, partial application, decoradores con wraps, dispatch con singledispatch
2. itertools: iteradores infinitos, combinaciones permutaciones, agrupación con groupby, slicing perezoso
3. collections: contador de frecuencias, agrupación con defaultdict, colas eficientes con deque
4. contextlib: context managers sin clases, suppress excepciones, ExitStack para recursos dinámicos

### I Do — Demostración guiada (Yo hago)

1. Refactorizar una función recursiva lenta con `@lru_cache` (10x speedup sin cambiar lógica)
2. Implementar un pipeline ETL con `itertools.chain` para procesar múltiples archivos sin cargar todo en memoria
3. Crear un context manager con `@contextmanager` para manejo transaccional de SQLite

### We Do — Práctica guiada (Hacemos juntos)

1. Reescribe un loop anidado usando `itertools.product` y comprehensions
2. Implementa un cache LRU manual sin `lru_cache` para entender cómo funciona internamente

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Functional Data Processor — Librería de procesamiento de datos que usa exclusivamente `functools`, `itertools`, `collections` y `contextlib` (sin pandas, sin numpy). Procesa archivos CSV grandes en streaming con generators, cachea resultados costosos, y usa context managers para archivos/DB. Demuestra que Python stdlib es suficiente para producción.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `lru-cache-memoization` | Aplicar | `@lru_cache(maxsize=N)` cachea resultados por argumentos. Si la función es pura y los args son hashable, convierte O(2^n) en O(n). |
| 2 | `itertools-chain-vs-concat` | Analizar | `chain(a, b)` es lazy (no copia), `[*a, *b]` crea lista nueva. Para 1M elementos, chain ahorra 8MB de RAM. |
| 3 | `defaultdict-use-cases` | Aplicar | `defaultdict(list)` para agrupar, `defaultdict(int)` para contar, `defaultdict(set)` para índices invertidos. |
| 4 | `contextmanager-decorator` | Aplicar | `@contextmanager` convierte una función generador en context manager sin escribir `__enter__`/`__exit__`. |
| 5 | `singledispatch-overloading` | Analizar | `@singledispatch` permite dispatch por tipo del primer argumento. Útil para funciones que procesan distintos tipos (str, dict, list). |

#### Ejemplo de variantes para un concepto

Para `lru-cache-memoization`, las 3 variantes cambian la función:

- **V1**: "¿Qué hace `@lru_cache(maxsize=128)` en una función recursiva como fibonacci?" — cachea resultados por argumento
- **V2**: "¿Por qué `lru_cache` NO funciona con una función que toma una lista como argumento?" — las listas no son hashable
- **V3**: "Si llamas `fib(100)` con `@lru_cache`, ¿cuántas llamadas recursivas se ejecutan realmente?" — 100 (cada valor se calcula una vez)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué hace `@functools.lru_cache` y cuándo NO usarlo?
2. ¿Cuál es la diferencia entre `itertools.chain(a, b)` y `[*a, *b]`?
3. ¿Para qué sirve `defaultdict(set)`?
4. ¿Cómo creas un context manager sin escribir una clase?
5. ¿Qué hace `@singledispatch`?

### Recursos principales

- Python — functools docs
- Python — itertools docs
- Python — collections docs
- Python — contextlib docs
- Python 201 (Michael Driscoll) — Ch. 3-7

---

## 16. GUI Desktop con wxPython

> **Tagline**: Cuando la CLI no basta: interfaces de escritorio cross-platform para herramientas internas
> **Nivel**: Competente · **Horas estimadas**: 10h · **Ícono**: AppWindow

### Relevancia laboral

En empresas peruanas tradicionales (banca, minería, manufactura), las herramientas internas a menudo son desktop apps porque la infraestructura cloud es limitada o por políticas de seguridad. wxPython permite construir GUIs nativas cross-platform con Python. Aunque el trend es web (Streamlit, Gradio), saber wxPython te permite mantener tools legacy y construir herramientas internas sin depender de un navegador.

### Objetivos de aprendizaje

- Entender el modelo event-driven de wxPython (Bind, EVT_BUTTON, EVT_TEXT)
- Construir una GUI básica con Frame, Panel, Sizers (VBox, HBox, GridBag)
- Manejar eventos de usuario (clicks, input, menú, drag-and-drop)
- Integrar wxPython con matplotlib para visualización embebida
- Empaquetar la app con PyInstaller para distribución (.exe en Windows, .app en macOS)

### Temas de teoría

1. Modelo event-driven: loop de eventos, Bind, EVT_* constants, callbacks
2. Layout con Sizers: VBoxSizer, HBoxSizer, GridBagSizer, FlexGridSizer
3. Widgets esenciales: TextCtrl, Button, StaticText, ListCtrl, Choice, Slider
4. Integración con matplotlib: FigureCanvas, backend_wxagg
5. Distribución: PyInstaller, py2app, creación de instalador

### I Do — Demostración guiada (Yo hago)

1. Construir un conversor de moneda (PEN/USD/EUR) con wxPython Form + 3 TextCtrl + 1 Button
2. Integrar matplotlib para mostrar un mini-gráfico de historial de tipo de cambio
3. Empaquetar con PyInstaller para Windows (.exe standalone)

### We Do — Práctica guiada (Hacemos juntos)

1. Extiende el conversor con un menú "Archivo → Exportar CSV" usando wx.FileDialog
2. Agrega validación de input (solo números) con EVT_TEXT y regex

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Internal Tool GUI — Construye una herramienta desktop para un equipo interno (ej: visualizador de logs con filtros, generador de reportes mensuales, calculadora de comisiones). La app debe tener menú, al menos 3 paneles, integración con matplotlib, y empaquetarse como .exe. Es el tipo de herramienta que un analista construye para su equipo y que ahorra 5+ horas semanales de trabajo manual.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 4 |
| Preguntas por intento | 4 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 4 correctas) |
| Tiempo estimado | 8-12 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `event-driven-model` | Aplicar | wxPython es event-driven: el loop espera eventos (clicks, teclas), los dispatchea a handlers registrados con `Bind(EVT_X, callback)`. |
| 2 | `sizers-layout` | Aplicar | Sizers manejan layout responsivo (VBox, HBox, Grid). Preferible a posiciones absolutas porque se adapta a resize y diferentes DPI. |
| 3 | `bind-event-handler` | Aplicar | `button.Bind(wx.EVT_BUTTON, on_click)` registra callback. El callback recibe `wx.CommandEvent` con info del widget que disparó. |
| 4 | `pyinstaller-packaging` | Aplicar | PyInstaller empaqueta Python + dependencias + interpreter en un .exe / .app standalone. `--onefile` para un solo binario, `--windowed` para no mostrar consola. |

#### Ejemplo de variantes para un concepto

Para `bind-event-handler`, las 3 variantes cambian el evento:

- **V1**: "¿Cómo registras un callback para el click de un botón en wxPython?" — `button.Bind(wx.EVT_BUTTON, on_click)`
- **V2**: "¿Qué evento usas para validar input de texto en tiempo real?" — `EVT_TEXT`
- **V3**: "Si necesitas detectar la tecla Escape en una ventana, ¿qué Bind usas?" — `window.Bind(wx.EVT_KEY_DOWN, on_key)` + chequear `event.GetKeyCode() == wx.WXK_ESCAPE`

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué significa que wxPython sea "event-driven"?
2. ¿Para qué sirven los Sizers en wxPython?
3. ¿Cómo vinculas un evento de botón a una función?
4. ¿Cómo empaquetas tu app wxPython como .exe standalone?

### Recursos principales

- wxPython — Phoenix docs
- wxPython — Wiki
- PyInstaller — Manual
- ZetCode — wxPython tutorial
- wxPython — Demo application

---

## 17. Packaging & Distribution

> **Tagline**: De script a paquete instalable: pyproject.toml, wheel, sdist, PyPI
> **Nivel**: Competente · **Horas estimadas**: 8h · **Ícono**: Package

### Relevancia laboral

Un script suelto no es software. Empaquetar correctamente un paquete Python (con `pyproject.toml`, versionado semver, tests, CI/CD, y publicación a PyPI) es lo que diferencia un proyecto de curso de un proyecto production-ready. Empresas que contratan Python devs esperan que sepas instalar tu propia herramienta con `pip install mi_paquete`, no que envíes un zip.

### Objetivos de aprendizaje

- Escribir un `pyproject.toml` completo (PEP 621) con metadata, dependencias, optional-dependencies, scripts
- Entender el ecosistema: hatchling, setuptools, poetry, pdm — cuándo usar cada uno
- Versionar con Semantic Versioning (semver) y automatizar bumps con `python-semantic-release`
- Publicar a PyPI con `twine` y a TestPyPI para validar
- Configurar CI/CD con GitHub Actions para auto-publicar en releases

### Temas de teoría

1. PEP 621: pyproject.toml como single source of truth para metadata
2. Build backends: hatchling (moderno), setuptools (legacy), poetry (custom)
3. Semantic Versioning: MAJOR.MINOR.PATCH, pre-release tags (alpha, beta, rc), build metadata
4. Distribución: wheel (binario pre-compilado), sdist (source), TestPyPI vs PyPI
5. CI/CD para publicación: GitHub Actions, trusted publishing, auto-release en tag push

### I Do — Demostración guiada (Yo hago)

1. Crear un paquete `pytools-cli` desde cero con `pyproject.toml` + hatchling
2. Agregar entry points (`[project.scripts]`) para instalar como comando del sistema
3. Publicar a TestPyPI con `twine upload` y validar instalación limpia

### We Do — Práctica guiada (Hacemos juntos)

1. Escribe el `pyproject.toml` para un paquete con dependencies + optional-dependencies (dev, ml)
2. Configura GitHub Actions workflow que corre tests + publica a PyPI on tag push

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: PyPI-Published Package — Toma un script útil que hayas escrito (ej: el file-organizer de S4) y conviértelo en un paquete PyPI instalable. Incluye: pyproject.toml completo, tests con pytest >80% cobertura, GitHub Actions CI, README con badges, y publicación real a TestPyPI (PyPI opcional si quieres publicarlo). Un paquete en PyPI es un signal enorme en entrevistas.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 4 |
| Preguntas por intento | 4 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 4 correctas) |
| Tiempo estimado | 8-12 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `pyproject-toml-pep621` | Aplicar | PEP 621 define `[project]` en pyproject.toml como single source of truth: name, version, dependencies, scripts, optional-dependencies. Reemplaza setup.py/setup.cfg. |
| 2 | `semver-rules` | Aplicar | MAJOR.MINOR.PATCH: MAJOR = breaking change, MINOR = new feature backward-compatible, PATCH = bugfix. Pre-release: `1.0.0-alpha.1`. Build: `1.0.0+build.42`. |
| 3 | `wheel-vs-sdist` | Analizar | wheel (.whl) es pre-compilado (instalación rápida, sin compilación), sdist (.tar.gz) es source (compila al instalar). PyPI requiere ambos. |
| 4 | `entry-points-scripts` | Aplicar | `[project.scripts] mytool = "mytool.cli:main"` crea un ejecutable `mytool` al `pip install`. Apunta a función `main()` en módulo `mytool.cli`. |

#### Ejemplo de variantes para un concepto

Para `semver-rules`, las 3 variantes cambian el escenario de bump:

- **V1**: "Tu cambio rompe la API pública (eliminaste una función). ¿Qué bump aplicas?" — MAJOR (2.0.0)
- **V2**: "Agregaste una función nueva sin romper nada. ¿Qué bump aplicas?" — MINOR (1.1.0)
- **V3**: "Corregiste un bug sin cambiar la API. ¿Qué bump aplicas?" — PATCH (1.0.1)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es `pyproject.toml` y por qué reemplaza a `setup.py`?
2. ¿Cuándo incrementas MAJOR vs MINOR vs PATCH en semver?
3. ¿Cuál es la diferencia entre wheel y sdist?
4. ¿Cómo defines un entry point para que tu paquete instale un comando del sistema?

### Recursos principales

- PEP 621 — Storing project metadata in pyproject.toml
- Python Packaging User Guide
- Semantic Versioning 2.0.0
- hatch — Modern Python build backend
- python-semantic-release — GitHub

---

## 18. Data Engineering Foundations

> **Tagline**: ETL, idempotencia, y pipelines reproducibles — la base de todo sistema de datos
> **Nivel**: Competente · **Horas estimadas**: 12h · **Ícono**: Workflow

### Relevancia laboral

Data Engineer es uno de los roles mejor pagados del ecosistema data (junto con ML Engineer). En Lima, un Data Engineer Junior gana S/4,500-S/6,500 mensuales; Senior gana S/10,000-S/18,000. Las bases — idempotencia, particionamiento, schemas, data contracts — son universales: aplican igual en Prefect, Airflow, Dagster o cualquier orquestador. Dominar estos fundamentos te permite migrar entre herramientas sin re-aprender.

### Objetivos de aprendizaje

- Diseñar pipelines ETL idempotentes (correr N veces = mismo resultado)
- Implementar patrón extract-transform-load con validación en cada etapa
- Manejar schemas evolutivos con Pydantic y data contracts
- Orquestar con Prefect (DAGs, retries, caching, scheduling)
- Particionar datos por fecha para queries eficientes (parquet + particiones)
- Aplicar backfilling y reprocessing sin duplicados

### Temas de teoría

1. Idempotencia: por qué `DELETE + INSERT` es mejor que `INSERT` solo; deduplicación por unique key
2. ETL vs ELT: cuándo aplicar cada uno (ETL para transformaciones costosas, ELT para aprovechar compute del DW)
3. Data contracts: schemas versionados con Pydantic, validación en boundaries
4. Orquestación con Prefect: `@task`, `@flow`, retries, caching, scheduling, deployment
5. Particionamiento: parquet particionado por fecha, predicate pushdown, columnar storage

### I Do — Demostración guiada (Yo hago)

1. Construir un pipeline ETL idempotente con Prefect: extract (API), transform (clean + validate), load (SQLite + parquet)
2. Implementar data contract con Pydantic que rechaza registros inválidos en boundary
3. Mostrar qué pasa cuando se corre 2 veces (no duplica gracias a idempotencia)

### We Do — Práctica guiada (Hacemos juntos)

1. Extiende el pipeline con un task de deduplicación por hash de contenido
2. Agrega un task de validación con Great Expectations que falla si hay nulls en columna crítica

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Idempotent ETL Pipeline — Pipeline Prefect que descarga datos de una API pública (OpenFoodFacts, JSONPlaceholder), los limpia, valida con Pydantic, y persiste a SQLite + parquet particionado por fecha. Debe ser idempotente: correrlo 100 veces produce el mismo resultado. Incluye README con diagrama del DAG y comandos para reproducir.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `idempotency-principle` | Analizar | Pipeline idempotente: correr N veces produce el mismo resultado. Implementación: dedup por unique key, UPSERT en vez de INSERT. |
| 2 | `etl-vs-elt` | Analizar | ETL: transforma antes de cargar (compute en worker). ELT: carga crudo y transforma en DW (compute en BigQuery/Snowflake). ELT gana cuando DW es potente. |
| 3 | `data-contracts-pydantic` | Aplicar | Pydantic BaseModel define schema + validación. En boundary del pipeline, `Model(**row)` rechaza registros inválidos con error explícito. |
| 4 | `prefect-task-flow` | Aplicar | `@task` = unidad atómica con retries. `@flow` = orquesta tasks. Retries + caching hacen el pipeline resiliente a fallos transitorios. |
| 5 | `parquet-partitioning` | Aplicar | Parquet particionado por `date=2026-07-14/` permite predicate pushdown: query solo lee particiones relevantes. 100x más rápido en queries por fecha. |

#### Ejemplo de variantes para un concepto

Para `idempotency-principle`, las 3 variantes cambian el escenario:

- **V1**: "¿Qué significa que un pipeline sea idempotente?" — correr N veces = mismo resultado
- **V2**: "Si tu pipeline usa `INSERT` puro y se cae a la mitad, ¿qué pasa al re-correrlo?" — duplica los registros insertados antes del fallo
- **V3**: "¿Cómo implementas idempotencia en un load a PostgreSQL?" — `INSERT ... ON CONFLICT (id) DO UPDATE` (UPSERT)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es idempotencia en un pipeline ETL y por qué importa?
2. ¿Cuándo eliges ETL sobre ELT?
3. ¿Qué es un data contract y cómo lo implementas con Pydantic?
4. ¿Qué hacen `@task` y `@flow` en Prefect?
5. ¿Por qué parquet particionado por fecha acelera queries?

### Recursos principales

- Prefect — Official docs
- Pydantic — Documentation
- Apache Parquet — Specification
- The Unix Programming Environment (Kernighan/Pike) — pipelines philosophy
- Data Engineering Cookbook (Andreas Kretz)

---

## 19. Databases & ORM

> **Tagline**: SQL, SQLite, SQLAlchemy — del query ad-hoc al modelo persistente
> **Nivel**: Competente · **Horas estimadas**: 10h · **Ícono**: Database

### Relevancia laboral

Toda empresa de data tiene una base de datos. SQLite para prototipos, PostgreSQL para producción, BigQuery/Snowflake para analytics. Saber SQL + ORM (SQLAlchemy) es non-negotiable. En entrevistas técnicas peruanas te ponen a escribir queries JOIN+GROUP BY+HAVING a mano. En producción, el ORM te ahorra 80% del código boilerplate pero necesitas saber SQL para debuggear queries lentas.

### Objetivos de aprendizaje

- Escribir queries SQL: SELECT, JOIN (inner/left/right/full), GROUP BY, HAVING, window functions (ROW_NUMBER, RANK, LAG)
- Diseñar schemas normalizados (1NF, 2NF, 3NF) y cuándo desnormalizar para performance
- Usar SQLAlchemy Core (SQL Expression Language) y ORM (declarative models)
- Manejar migraciones con Alembic
- Optimizar queries con índices (B-tree, partial, composite) y EXPLAIN ANALYZE

### Temas de teoría

1. SQL essentials: SELECT, WHERE, JOIN, GROUP BY, HAVING, ORDER BY, LIMIT
2. Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM OVER
3. SQLAlchemy Core vs ORM: cuándo usar cada uno (Core para reporting, ORM para CRUD)
4. Migraciones con Alembic: autogenerate, upgrade/downgrade, branching
5. Índices: B-tree (default), partial (WHERE), composite (multi-columna), EXPLAIN ANALYZE

### I Do — Demostración guiada (Yo hago)

1. Diseñar schema normalizado para e-commerce (customers, orders, order_items, products)
2. Implementar modelos SQLAlchemy con relaciones (ForeignKey, relationship, back_populates)
3. Crear migración Alembic que añade una columna con default value sin downtime

### We Do — Práctica guiada (Hacemos juntos)

1. Escribe un query con window function: top 3 productos más vendidos por categoría
2. Crea un índice composite que optimice un query específico y verifica con EXPLAIN

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: E-commerce Schema + Analytics — Diseña un schema PostgreSQL para e-commerce (5+ tablas con relaciones), impleméntalo con SQLAlchemy ORM + migraciones Alembic, y escribe 5 queries analíticos (top productos, cohort de clientes, etc.). El repo debe incluir seed data sintética peruana (productos de supermercado, clientes limeños) y un notebook con los queries documentados.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `sql-join-types` | Aplicar | INNER (solo coincidentes), LEFT (todas filas de izq + nulls), RIGHT (espejo), FULL (todas). Confusión común: pensar que LEFT mantiene la tabla derecha. |
| 2 | `window-functions` | Aplicar | `ROW_NUMBER() OVER (PARTITION BY cat ORDER BY ventas DESC)` rankea por grupo. Diferente de GROUP BY: no colapsa filas, añade columna. |
| 3 | `sqlalchemy-core-vs-orm` | Analizar | Core = SQL Expression Language (más control, más verboso). ORM = clases Python mapeadas a tablas (más productivo, menos control). Reporting → Core; CRUD → ORM. |
| 4 | `alembic-migrations` | Aplicar | Alembic versiona el schema. `alembic revision --autogenerate` detecta cambios entre modelos y DB. `upgrade head` aplica, `downgrade -1` revierte. |
| 5 | `index-strategy` | Analizar | Índices aceleran WHERE/JOIN/ORDER BY pero ralentizan INSERT. B-tree (default), partial (`WHERE active`), composite para queries multi-columna. EXPLAIN ANALYZE para tunear. |

#### Ejemplo de variantes para un concepto

Para `sql-join-types`, las 3 variantes cambian el scenario:

- **V1**: "¿Qué JOIN mantiene TODAS las filas de la tabla izquierda?" — LEFT JOIN
- **V2**: "Tienes `customers` (1000 filas) y `orders` (500 filas, todas con customer_id válido). ¿Cuántas filas devuelve INNER JOIN?" — 500
- **V3**: "¿Qué JOIN usarías para encontrar customers que NUNCA han hecho un pedido?" — LEFT JOIN + WHERE orders.id IS NULL

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuál es la diferencia entre INNER JOIN y LEFT JOIN?
2. ¿Qué hace `ROW_NUMBER() OVER (PARTITION BY ...)`?
3. ¿Cuándo usar SQLAlchemy Core vs ORM?
4. ¿Qué hace `alembic upgrade head`?
5. ¿Cuándo un índice HACE MÁS LENTA una tabla?

### Recursos principales

- PostgreSQL — Tutorial
- SQLAlchemy — Official docs
- Alembic — Documentation
- SQL Performance Explained (Markus Winand)
- Use The Index, Luke! — SQL indexing tutorial

---

## 20. RAG (Retrieval-Augmented Generation)

> **Tagline**: LLMs que citan sus fuentes: embeddings, vector DBs, y retrieval
> **Nivel**: Competente · **Horas estimadas**: 12h · **Ícono**: MessageSquare

### Relevancia laboral

RAG es la arquitectura #1 para LLMs en producción en 2026. Empresas peruanas (BCP, Interbank, Alicorp) usan RAG para chatbots de customer service, búsqueda interna de documentos, y asistentes legales. Dominar RAG te permite construir aplicaciones AI útiles sin fine-tuning (que es costoso). Es la skill más pedida en Linkedln LATAM para roles AI Engineer.

### Objetivos de aprendizaje

- Entender la arquitectura RAG: ingest → embed → store → retrieve → generate
- Implementar embeddings con OpenAI, sentence-transformers, o modelos locales (Ollama)
- Usar vector DBs: Chroma (local), Pinecone (managed), pgvector (PostgreSQL)
- Aplicar chunking strategies: fixed-size, sentence-aware, semantic chunking
- Implementar retrieval avanzado: hybrid search (BM25 + vector), re-ranking, HyDE
- Medir calidad RAG con RAGAS (faithfulness, answer relevancy, context precision/recall)

### Temas de teoría

1. Arquitectura RAG: components (ingest, embed, store, retrieve, generate), trade-offs vs fine-tuning
2. Embeddings: what they encode, dimensionality (384, 768, 1536, 3072), models (OpenAI ada-002, text-embedding-3-small/large, BGE, E5)
3. Vector DBs: Chroma (embedded), Pinecone (managed), pgvector (Postgres), Qdrant, Weaviate
4. Chunking strategies: fixed-size (500 tokens), sentence-aware, semantic chunking with embeddings
5. Retrieval avanzado: hybrid search, re-ranking with cross-encoders, HyDE (Hypothetical Document Embeddings)
6. Evaluación con RAGAS: faithfulness, answer relevancy, context precision, context recall

### I Do — Demostración guiada (Yo hago)

1. Construir pipeline RAG end-to-end: PDF → chunks → embeddings → Chroma → retrieval → GPT-4o generation
2. Implementar hybrid search: combinar BM25 (keyword) + vector similarity, normalizar scores
3. Medir calidad con RAGAS: faithfulness 0.87, answer relevancy 0.91, identificar fallos

### We Do — Práctica guiada (Hacemos juntos)

1. Cambia el chunk size de 500 a 200 tokens y mide cómo cambia faithfulness en RAGAS
2. Implementa re-ranking con cross-encoder y compara contra retrieval solo

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Peruvian Legal Assistant RAG — Chatbot que responde preguntas sobre leyes peruanas ( Constitución, Código Civil, Ley de Protección de Datos). Usa documentos reales (PDFs de escribanía digital), Chroma vector DB, y GPT-4o. Incluye: chunking optimizado, hybrid search, RAGAS evaluation >0.85 faithfulness. Es un proyecto impresionante para portafolio AI Engineer.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `rag-vs-finetuning` | Analizar | RAG: agrega conocimiento sin modificar pesos, fácil de actualizar, citable. Fine-tuning: modifica pesos del modelo, costoso, no actualizable en runtime. RAG para facts, FT para estilo. |
| 2 | `embedding-semantics` | Aplicar | Embeddings mapean texto a vector denso donde similitud semántica ≈ cercanía vectorial. Cosine similarity mide ángulo entre vectores (1=igual, 0=ortogonal, -1=opuesto). |
| 3 | `chunking-strategies` | Analizar | Fixed-size (500 tokens): simple, puede cortar ideas. Sentence-aware: respeta límites. Semantic: agrupa por similitud. Trade-off: coherencia vs granularidad de retrieval. |
| 4 | `hybrid-search` | Aplicar | Hybrid = BM25 (keyword exacto) + vector (semántico). Útil cuando queries tienen términos técnicos que BM25 encuentra bien pero vector no. |
| 5 | `ragas-evaluation` | Aplicar | RAGAS mide 4 métricas: faithfulness (respuesta fundamentada en contexto), answer relevancy, context precision (chunks útiles), context recall (todos chunks relevantes). |

#### Ejemplo de variantes para un concepto

Para `rag-vs-finetuning`, las 3 variantes cambian el caso de uso:

- **V1**: "¿Cuándo prefieres RAG sobre fine-tuning?" — cuando el conocimiento cambia frecuentemente (noticias, docs internos)
- **V2**: "Tu chatbot debe responder en el estilo formal de un abogado. ¿RAG o fine-tuning?" — fine-tuning (RAG no cambia el estilo, solo el contenido)
- **V3**: "Tu empresa agrega 1000 nuevos productos cada semana. ¿Cómo los integras al chatbot?" — RAG (re-embeds sin re-entrenar el modelo)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuándo usar RAG vs fine-tuning?
2. ¿Qué es un embedding y cómo se mide similitud entre dos?
3. ¿Cuál es el trade-off entre chunk size pequeño y grande?
4. ¿Qué es hybrid search y cuándo ayuda?
5. ¿Qué mide faithfulness en RAGAS?

### Recursos principales

- OpenAI — Embeddings guide
- LangChain — RAG tutorial
- Chroma — Documentation
- RAGAS — GitHub
- Pinecone — Learn (RAG architectures)

---

## 21. Backend APIs con FastAPI

> **Tagline**: APIs REST modernas, async, con validación Pydantic y docs OpenAPI automáticas
> **Nivel**: Competente · **Horas estimadas**: 12h · **Ícono**: Server

### Relevancia laboral

FastAPI es el framework web #1 de Python en 2026 (supera a Flask y Django REST para APIs nuevas). Empresas como Uber, Netflix y Microsoft lo usan en producción. En LATAM, MercadoLibre y PedidosYa migran microservicios a FastAPI. La combinación FastAPI + Pydantic + async es la stack moderna para backend Python — cualquier rol backend/mid-senior la exige.

### Objetivos de aprendizaje

- Construir APIs REST con FastAPI: routers, path/query params, request/response models
- Validar con Pydantic v2: tipos, validators, custom errors, model_validator
- Implementar async endpoints con `async def` y `await` (I/O concurrente)
- Documentar automáticamente con OpenAPI (Swagger UI + ReDoc)
- Manejar autenticación JWT, dependencias, y middleware
- Testear con `httpx.AsyncClient` + pytest

### Temas de teoría

1. FastAPI essentials: `FastAPI()`, `@app.get/post`, path params, query params, request body
2. Pydantic v2: BaseModel, Field, validator, model_validator, computed_field
3. Async/await: cuándo usar (I/O bound: DB, HTTP, files), cuándo NO (CPU bound)
4. Dependency injection: `Depends()`, scope (function/request/app)
5. Autenticación: OAuth2PasswordBearer, JWT, password hashing con passlib
6. Testing: `httpx.AsyncClient`, fixtures, mocks

### I Do — Demostración guiada (Yo hago)

1. Construir API CRUD para "productos" con Pydantic models, validación, y OpenAPI docs
2. Implementar auth JWT: login endpoint que emite token, middleware que valida
3. Escribir tests con httpx para todos los endpoints (>85% cobertura)

### We Do — Práctica guiada (Hacemos juntos)

1. Agrega endpoint `GET /products/{id}` con manejo de 404 y `HTTPException`
2. Implementa rate limiting con `slowapi` (5 requests/minuto por IP)

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Production FastAPI Service — API REST completa para un dominio a elección (ej: gestión de tareas, microservicio de pagos, API de scoring crediticio). Debe incluir: 6+ endpoints CRUD, auth JWT, validación Pydantic, tests con >85% cobertura, GitHub Actions CI, Docker, y deploy a Fly.io o Railway. Es el tipo de proyecto que reemplaza un challenge técnico take-home.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `pydantic-validation` | Aplicar | Pydantic BaseModel valida tipos en boundary. `email: EmailStr`, `age: int = Field(ge=0, le=120)`. Errores 422 automáticos con detalle. |
| 2 | `async-vs-sync` | Analizar | `async def` cede control durante I/O (DB, HTTP), permitiendo concurrencia. CPU-bound NO se beneficia — usar sync o ProcessPool. |
| 3 | `dependency-injection` | Aplicar | `Depends()` inyecta dependencias (DB session, current_user) sin acoplamiento. Test-friendly: fácil de mockear. |
| 4 | `oauth2-jwt-auth` | Aplicar | OAuth2PasswordBearer extrae token del header. JWT firma el payload con secret. `python-jose` para encode/decode. Stateless: el server no guarda sesiones. |
| 5 | `openapi-autodocs` | Recordar | FastAPI genera OpenAPI 3.1 spec automáticamente desde type hints + Pydantic. `/docs` = Swagger UI, `/redoc` = ReDoc. Cero esfuerzo. |

#### Ejemplo de variantes para un concepto

Para `async-vs-sync`, las 3 variantes cambian el escenario:

- **V1**: "Tu endpoint llama a 3 APIs externas (cada una tarda 500ms). Sync vs async, ¿cuál es el speedup?" — async 3x más rápido (1500ms → 500ms)
- **V2**: "Tu endpoint calcula primos hasta 1M. ¿async def ayuda?" — NO (CPU-bound, el GIL bloquea)
- **V3**: "¿Por qué `await db.execute(query)` es mejor que `db.execute(query)`?" — cede control al event loop mientras espera I/O

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué hace Pydantic en FastAPI?
2. ¿Cuándo `async def` NO mejora performance?
3. ¿Para qué sirve `Depends()` en FastAPI?
4. ¿Cómo funciona auth JWT en FastAPI?
5. ¿Cómo se generan los docs de FastAPI?

### Recursos principales

- FastAPI — Official docs
- Pydantic — Documentation v2
- FastAPI — Full Stack template
- TestDriven.io — FastAPI testing
- realpython — FastAPI tutorial

---

## 22. Entity Resolution con RapidFuzz

> **Tagline**: "Maria Quispe" vs "María Quíspe" vs "M Quispe" — fuzzy matching a escala
> **Nivel**: Competente · **Horas estimadas**: 10h · **Ícono**: GitCompare

### Relevancia laboral

Entity resolution es el problema #1 en empresas con datos de clientes: la misma persona aparece 3 veces con typos distintos. Bancos peruanos pierden millones en marketing duplicado y en reportes regulatorios con doble-counting. RapidFuzz (escrito en C++, 10x más rápido que fuzzywuzzy) es el estándar de industria para fuzzy matching en Python.

### Objetivos de aprendizaje

- Entender algoritmos de fuzzy matching: Levenshtein, Jaro-Winkler, token sort, token set
- Usar RapidFuzz: `fuzz.ratio`, `fuzz.partial_ratio`, `fuzz.token_sort_ratio`, `process.extract`
- Implementar deduplicación a escala: blocking (reducir N² comparaciones), indexed search
- Manejar PII peruana: normalizar DNIs, RUCs, nombres con acentos
- Evaluar quality: precision, recall, F1 contra gold standard

### Temas de teoría

1. Algoritmos: Levenshtein (edits), Jaro-Winkler (prefix bonus), token sort (ordena palabras), token set (intersección)
2. RapidFuzz API: `fuzz.ratio(s1, s2)`, `fuzz.partial_ratio`, `fuzz.token_sort_ratio`, `process.extract(query, choices, limit=N)`
3. Blocking: reducir N² comparaciones agrupando por blocking key (primer letra, ciudad, DNI prefix)
4. Normalización: lowercase, strip acentos, remover sufijos (S.A., SAC, EIRL)
5. Evaluación: precision (de los matches, cuántos son correctos), recall (de los correctos, cuántos encontré)

### I Do — Demostración guiada (Yo hago)

1. Implementar fuzzy match entre 2 DataFrames de clientes con 50K registros cada uno
2. Aplicar blocking por primer letra del nombre + ciudad → reduce 2.5B comparaciones a 100K
3. Calcular precision/recall contra un gold standard de 200 matches manuales

### We Do — Práctica guiada (Hacemos juntos)

1. Normaliza nombres peruanos: lowercase, strip acentos, remover "S.A." / "SAC" / "EIRL"
2. Implementa threshold adaptativo: 95% para nombres cortos, 85% para nombres largos

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Customer Deduplication Pipeline — Pipeline que toma 2 fuentes de clientes (CRM + ERP), normaliza nombres, hace fuzzy match con RapidFuzz + blocking, genera reporte con clusters de duplicados + score de confianza, y permite review humano. Aplica a un dataset real (sintético si no tienes acceso): 10K+ clientes con 5-10% duplicados. Es exactamente el proyecto que un equipo de data quality necesita.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 4 |
| Preguntas por intento | 4 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 4 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `levenshtein-distance` | Aplicar | Levenshtein = # de edits (insert/delete/substitute) para convertir s1 en s2. "Ana"→"Anya" = 1 (insert 'h'). Distancia 0 = idéntico. |
| 2 | `rapidfuzz-vs-fuzzywuzzy` | Analizar | RapidFuzz es 10x más rápido (C++ vs Python puro), API compatible con fuzzywuzzy. Para 1M comparaciones: fuzzywuzzy 30min, rapidfuzz 3min. |
| 3 | `blocking-strategy` | Analizar | Blocking agrupa registros por key barato (primer letra, city). Solo se comparan dentro del bloque. Reduce N² → N*k. Trade-off: recall puede bajar si blocking es muy estricto. |
| 4 | `precision-recall-tradeoff` | Analizar | Threshold alto (95%) → alta precision, baja recall (pierde duplicados). Threshold bajo (70%) → baja precision (muchos falsos positivos), alta recall. F1 = 2*P*R/(P+R). |

#### Ejemplo de variantes para un concepto

Para `precision-recall-tradeoff`, las 3 variantes cambian el threshold:

- **V1**: "Bajas threshold de 95% a 70%. ¿Qué pasa con precision y recall?" — precision baja, recall sube
- **V2**: "En deduplicación de clientes bancarios, ¿qué es peor: falso positivo (fusionar 2 personas distintas) o falso negativo (dejar 2 duplicados)?" — falso positivo (regulatorio)
- **V3**: "Tu pipeline tiene 90% precision y 60% recall. ¿Qué ajustas?" — bajar threshold para subir recall (asumiendo review humano)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué mide la distancia de Levenshtein entre dos strings?
2. ¿Por qué RapidFuzz es 10x más rápido que fuzzywuzzy?
3. ¿Qué es blocking en entity resolution y por qué reduce el costo?
4. ¿Cuál es el trade-off entre precision y recall en fuzzy matching?

### Recursos principales

- RapidFuzz — Documentation
- Record Linkage — Python library
- Dedupe.io — Open source deduplication
- "Entity Resolution" (John Talburt) — Book
- Data Matching (Christen) — Book

---

## 23. Computer Vision Fundamentals

> **Tagline**: OpenCV, PIL, detección de objetos — ojos para tus aplicaciones
> **Nivel**: Competente · **Horas estimadas**: 12h · **Ícono**: Eye

### Relevancia laboral

Computer Vision (CV) tiene casos de uso concretos en LATAM: OCR de facturas para contabilidad, detección de defectos en manufacturing (mining, textiles), conteo de personas en retail, seguridad industrial. Empresas como Cementos Pacasmayo y Alicorp usan CV en QA. Saber OpenCV + YOLO básico te abre roles de CV Engineer.

### Objetivos de aprendizaje

- Manipular imágenes con OpenCV y PIL: load, resize, crop, rotate, color conversion
- Aplicar filtros: blur (Gaussian, bilateral), sharpening, edge detection (Canny, Sobel)
- Implementar thresholding: binary, Otsu, adaptive
- Detectar objetos con YOLOv8 (Ultralytics): inference, bounding boxes, classes
- Extraer texto con Tesseract OCR: preprocessing, PSM modes, language packs

### Temas de teoría

1. Imágenes como arrays NumPy: shape (H, W, C), dtype uint8, channels BGR vs RGB
2. Filtros: kernel convolution, Gaussian blur (denoise), bilateral (edge-preserving), unsharp mask
3. Thresholding: binary (fijo), Otsu (auto), adaptive (local)
4. Detección con YOLOv8: architecture (CNN), anchor boxes, NMS, classes (COCO 80)
5. OCR con Tesseract: preprocessing (grayscale, binarize, deskew), PSM modes, language packs (spa+eng)

### I Do — Demostración guiada (Yo hago)

1. Pipeline OCR para facturas peruanas: load → grayscale → bilateral filter → Otsu threshold → Tesseract
2. Detección de objetos con YOLOv8n: inferencia en imagen, dibujar bounding boxes, contar objetos
3. Comparar OCR con y sin preprocessing: precisión 65% → 89%

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa deskew con Hough transform para corregir imágenes rotadas
2. Cuenta personas en una foto de retail usando YOLOv8 + class "person"

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Invoice OCR Pipeline — Pipeline que toma fotos de facturas peruanas (SUNAT format), preprocessa con OpenCV, extrae texto con Tesseract, estructura campos (RUC, monto, fecha) con regex, valida RUC con dígito verificador. Debe procesar 100 facturas en <2 minutos. Es el tipo de proyecto que se usa en contabilidad peruana y que ahorra 20+ horas/semana de tipeo manual.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `image-as-numpy-array` | Aplicar | OpenCV lee imagen como `np.ndarray` shape (H, W, 3) dtype uint8. BGR order (no RGB). `img[y, x]` access pixel. Operaciones vectorizadas NumPy aplican. |
| 2 | `gaussian-vs-bilateral-blur` | Analizar | Gaussian: promedia vecinos, borra bordes. Bilateral: promedia solo vecinos similares, preserva bordes. Bilateral mejor para OCR preprocessing. |
| 3 | `otsu-thresholding` | Aplicar | Otsu calcula threshold óptimo automáticamente (maximiza varianza entre clases). Útil cuando iluminación varía. Requiere grayscale. |
| 4 | `yolov8-inference` | Aplicar | YOLOv8: 1-stage detector, real-time. `model = YOLO('yolov8n.pt')`, `results = model(img)`. `results[0].boxes` tiene bbox + class + confidence. |
| 5 | `tesseract-preprocessing` | Aplicar | OCR accuracy depende de preprocessing: grayscale → bilateral filter → Otsu threshold → deskew. Sin esto, accuracy cae 30-50%. |

#### Ejemplo de variantes para un concepto

Para `gaussian-vs-bilateral-blur`, las 3 variantes cambian el caso:

- **V1**: "¿Qué blur preserva bordes?" — bilateral
- **V2**: "Quieres denoiser una foto ANTES de edge detection. ¿Gaussian o bilateral?" — Gaussian (los bordes se detectan después)
- **V3**: "Quieres denoiser una foto ANTES de OCR. ¿Gaussian o bilateral?" — bilateral (preserva texto)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Por qué OpenCV usa BGR en vez de RGB?
2. ¿Cuándo prefieres bilateral sobre Gaussian blur?
3. ¿Qué hace Otsu thresholding?
4. ¿Qué modelo YOLOv8 usas para detección rápida en CPU?
5. ¿Por qué el preprocessing mejora OCR accuracy?

### Recursos principales

- OpenCV — Python tutorials
- Ultralytics YOLOv8 — Docs
- Tesseract — Documentation
- PyImageSearch — Blog
- Adrian Rosebrock — Deep Learning for Computer Vision

---

## 24. RPA Avanzado

> **Tagline**: Orquestación, retries, y scheduling — bots que se mantienen vivos en producción
> **Nivel**: Competente · **Horas estimadas**: 10h · **Ícono**: Bot

### Relevancia laboral

RPA básico (un script que corre una vez) es un prototype. RPA en producción requiere: orquestación (múltiples bots coordinados), retries (APIs fallan), scheduling (cron, Prefect, Airflow), monitoreo (alerts en Slack), y observabilidad (logs estructurados). Empresas peruanas (BBVA, Interbank) operan cientos de bots en producción. Saber RPA avanzado te posiciona para roles RPA Engineer / Automation Engineer.

### Objetivos de aprendizaje

- Orquestar múltiples bots con Prefect: DAGs, dependencies, conditional branching
- Implementar retries con backoff exponencial usando tenacity
- Schedulear bots: GitHub Actions cron, Prefect deployments, crontab Linux
- Monitorear bots: alerts a Slack/Teams cuando fallan, dashboard de ejecuciones
- Estructurar logs con structlog para trazabilidad en producción

### Temas de teoría

1. Orquestación con Prefect: `@flow`, `@task`, dependencies, conditional tasks, mapping
2. Retries con tenacity: `@retry(stop=stop_after_attempt(3), wait=wait_exponential())`
3. Scheduling: GitHub Actions cron (`on: schedule: - cron: '0 0 * * *'`), Prefect deployments, crontab
4. Monitoreo: Slack webhooks, PagerDuty, alerting on failure
5. Structured logging con structlog: JSON logs, context variables, correlation IDs

### I Do — Demostración guiada (Yo hago)

1. Construir flow Prefect con 5 tasks encadenadas: download → parse → validate → load → notify
2. Implementar retry con tenacity: 3 retries, backoff exponencial 1s/2s/4s
3. Configurar alerta Slack que se dispara si cualquier task falla después de retries

### We Do — Práctica guiada (Hacemos juntos)

1. Schedulea el flow para correr todos los días a las 9am con Prefect deployment
2. Agrega log estructurado con correlation ID para trazar requests a través de tasks

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Production RPA Bot — Bot que automatiza una tarea real (ej: scraping diario de tipo de cambio BCRP, descarga de reportes SUNAT, monitoreo de precios en marketplace). Debe incluir: orquestación Prefect, retries con tenacity, schedule diario, alerta Slack en fallo, dashboard Streamlit con历史 de ejecuciones. Es el tipo de bot que un equipo operativo usa 24/7.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 4 |
| Preguntas por intento | 4 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 4 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `prefect-flow-task` | Aplicar | `@flow` orquesta `@task`s con dependencies. Prefect maneja retries, caching, state transitions. Cada task es unidad atómica con su propio retry policy. |
| 2 | `tenacity-retry-patterns` | Aplicar | `@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, max=60))`. Backoff exponencial evita sobrecargar API. `retry_if_exception_type` filtra qué errores merecen retry. |
| 3 | `github-actions-cron` | Aplicar | `on: schedule: - cron: '0 9 * * 1-5'` corre 9am L-V. GitHub Actions gratis para repos públicos. Útil para bots que no necesitan infra propia. |
| 4 | `structlog-correlation-id` | Analizar | structlog emite JSON logs con context vars (correlation_id, user_id). Permite trazar un request a través de múltiples services/tasks. Esencial para debuggear en producción. |

#### Ejemplo de variantes para un concepto

Para `tenacity-retry-patterns`, las 3 variantes cambian el escenario:

- **V1**: "Una API falla 5% de las veces por timeout. ¿Qué retry policy aplicas?" — `stop_after_attempt(3)` + `wait_exponential`
- **V2**: "Tu API devuelve 429 (rate limit). ¿Deberías hacer retry inmediato?" — NO, esperar con backoff exponencial
- **V3**: "Tu API devuelve 400 (bad request). ¿Deberías hacer retry?" — NO, es error de cliente, no transitorio

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué diferencia `@flow` de `@task` en Prefect?
2. ¿Cuándo usar backoff exponencial en retries?
3. ¿Cómo scheduleas un bot para correr diario con GitHub Actions?
4. ¿Para qué sirve un correlation_id en logs estructurados?

### Recursos principales

- Prefect — Official docs
- tenacity — GitHub
- GitHub Actions — Schedule syntax
- structlog — Documentation
- RPA Best Practices (UiPath) — Whitepaper

---

## 25. Dashboards con Streamlit

> **Tagline**: De DataFrame a dashboard interactivo en 50 líneas
> **Nivel**: Competente · **Horas estimadas**: 10h · **Ícono**: LayoutDashboard

### Relevancia laboral

Streamlit es el framework #1 para dashboards Python en 2026. Empresas data-driven lo usan para: dashboards ejecutivos, demos de modelos ML, herramientas internas para equipos no-técnicos. A diferencia de Dash o Flask+HTML, Streamlit permite iterar en minutos. En LATAM, equipos de data science de bancos y retail lo usan para mostrar resultados a stakeholders.

### Objetivos de aprendizaje

- Construir dashboards interactivos con Streamlit: `st.title`, `st.sidebar`, `st.dataframe`, `st.metric`
- Implementar widgets: `selectbox`, `multiselect`, `slider`, `date_input`, `file_uploader`
- Caching con `@st.cache_data` y `@st.cache_resource` para evitar recomputo costoso
- Layouts: `st.columns`, `st.tabs`, `st.expander`, `st.container`
- Deployar a Streamlit Community Cloud (gratis) o Streamlit in Snowflake (enterprise)

### Temas de teoría

1. Streamlit execution model: top-to-bottom re-run on every widget interaction
2. Widgets y state: `st.session_state`, callbacks, controlled components
3. Caching: `@st.cache_data` (data), `@st.cache_resource` (DB connections, models)
4. Layouts: columns, tabs, expander, sidebar, containers
5. Deploy: Streamlit Community Cloud (gratis, público), Streamlit in Snowflake (enterprise), on-premise con Docker

### I Do — Demostración guiada (Yo hago)

1. Dashboard de ventas: sidebar con filtros (fecha, región, producto), métricas KPI, gráficos plotly, tabla filtrada
2. Implementar caching: cargar 100MB CSV una sola vez con `@st.cache_data`
3. Deploy a Streamlit Community Cloud desde GitHub repo

### We Do — Práctica guiada (Hacemos juntos)

1. Agrega `st.session_state` para recordar filtros entre page reloads
2. Implementa `st.file_uploader` para que el usuario suba su propio CSV

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Executive Dashboard — Dashboard Streamlit para un dominio real (ventas, RRHH, finanzas, operaciones). Debe incluir: 4+ KPIs con `st.metric`, 3+ gráficos interactivos (plotly), filtros en sidebar, caching para datos grandes, deploy público en Streamlit Cloud. Incluye README con screenshots y link al demo live. Es lo que muestras en entrevistas para demostrar capacidad de comunicación de datos.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 4 |
| Preguntas por intento | 4 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 4 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `streamlit-rerun-model` | Analizar | Streamlit re-ejecuta el script completo top-to-bottom en cada interacción con widget. State debe preservarse con `st.session_state` o se pierde. |
| 2 | `cache-data-vs-resource` | Aplicar | `@st.cache_data` para DataFrames (serializable, hash por args). `@st.cache_resource` para DB connections / modelos (no serializable, singleton). |
| 3 | `session-state-pattern` | Aplicar | `st.session_state` persiste datos entre reruns. Patrón: `if 'key' not in st.session_state: st.session_state.key = default`. Callbacks via `on_change`. |
| 4 | `streamlit-deploy-options` | Recordar | Community Cloud: gratis, público, 1GB RAM. Snowflake: enterprise, integrado con DW. On-premise: Docker + nginx. Cada uno tiene trade-offs de costo/privacidad/escalabilidad. |

#### Ejemplo de variantes para un concepto

Para `cache-data-vs-resource`, las 3 variantes cambian el objeto:

- **V1**: "Cargas un CSV de 100MB. ¿`@st.cache_data` o `@st.cache_resource`?" — cache_data (DataFrame es serializable)
- **V2**: "Conectas a PostgreSQL. ¿`@st.cache_data` o `@st.cache_resource`?" — cache_resource (connection no es serializable)
- **V3**: "Cargas un modelo XGBoost con joblib. ¿`@st.cache_data` o `@st.cache_resource`?" — cache_resource (modelo no se re-serializa bien)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Por qué Streamlit re-ejecuta el script en cada interacción?
2. ¿Cuándo usas `@st.cache_data` vs `@st.cache_resource`?
3. ¿Cómo persistes un valor entre reruns en Streamlit?
4. ¿Qué opciones tienes para deployar una app Streamlit?

### Recursos principales

- Streamlit — Official docs
- Streamlit — Gallery
- Streamlit — Community Cloud
- Awesome Streamlit — GitHub
- Streamlit in Snowflake — Documentation

---

## 26. Proyecto Integrador Fase 1

> **Tagline**: Integra todo lo aprendido en un sistema real que podrías vender
> **Nivel**: Competente · **Horas estimadas**: 16h · **Ícono**: Award

### Relevancia laboral

Capstone de Fase 1 que integra todas las competencias Competente en una sola plataforma vendible. Demuestra capacidad de diseñar sistemas end-to-end combinando backend, RAG, data pipelines, CV, entity resolution, RPA y dashboards. Diferenciador clave para entrevistas de mid-level. Este es el proyecto principal del portafolio — el que muestras primero en entrevistas.

### Objetivos de aprendizaje

- Integrar backend FastAPI (S21), RAG chatbot (S20), pipeline de datos (S18-19), CV module (S23), entity resolution (S22), RPA bot (S24) y dashboard Streamlit (S25) en una plataforma coherente
- Diseñar arquitectura de microservicios integrada con Docker Compose
- Documentar arquitectura con Mermaid diagrams
- Crear tests de integración para cada módulo del sistema
- Producir demo video ejecutivo de 3-5 minutos
- Reunir todos los componentes en un repositorio GitHub profesional

### Temas de teoría

1. Arquitectura de sistemas: diagrama de componentes, data flow, APIs contracts
2. Docker Compose para multi-servicio: servicios, networks, volumes, depends_on
3. Integration testing: contract tests entre servicios, fixtures compartidas
4. Documentación arquitectural: ADRs (Architecture Decision Records), Mermaid diagrams, README

### I Do — Demostración guiada (Yo hago)

1. Diseñar arquitectura de la plataforma: 7 servicios + sus APIs + data flow
2. Implementar Docker Compose que levanta todos los servicios con un solo comando
3. Escribir ADR documentando la decisión de usar FastAPI vs Flask

### We Do — Práctica guiada (Hacemos juntos)

1. Escribir integration test que valide el flujo end-to-end: upload factura → OCR → entity resolution → RAG query → dashboard
2. Crear demo script de 5 minutos que muestra la plataforma en acción

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: AI-Powered Automation Platform — Plataforma que integra todas las habilidades de Fase 1. Componentes: (1) Backend FastAPI (S21) API REST + WebSocket para datos en tiempo real; (2) RAG Chatbot (S20) con conocimiento del negocio sobre documentación; (3) Pipeline de Datos (S18-19) Prefect orquestando ingesta + transformación + almacenamiento; (4) CV Module (S23) endpoint de análisis de imágenes con YOLO; (5) Entity Resolution (S22) endpoint para deduplicar registros de clientes con RapidFuzz; (6) RPA Bot (S24) que automáticamente recolecta datos nuevos diariamente; (7) Dashboard (S25) Streamlit frontend que visualiza todo. Entregables: repositorio GitHub con README arquitectural (Mermaid diagram), Docker Compose con todos los servicios, tests de integración para cada módulo, demo video de 3-5 minutos mostrando el sistema en acción.

### Auto-evaluación — Requisitos detallados del examen

> **Configuración del examen para esta sección** (ver spec global en "Sistema de exámenes" arriba)

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 3 |
| Preguntas por intento | 3 (1 por concepto) |
| Variantes por concepto | 3 (anti-plagio) |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 3 correctas — todas requeridas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Categoría Bloom | Descripción |
|---|-----------------|-----------------|-------------|
| 1 | `system-integration-tradeoffs` | Analizar | Integrar 7 servicios requiere trade-offs: sync vs async calls, REST vs gRPC, shared DB vs service-owned DB. Cada decisión tiene consecuencias en latencia, consistencia, escalabilidad. |
| 2 | `docker-compose-orchestration` | Aplicar | Docker Compose levanta multi-servicio con un comando. `depends_on` para ordering, `healthcheck` para readiness, networks para aislamiento, volumes para persistencia. |
| 3 | `integration-testing-strategy` | Analizar | Integration tests validan contracts entre servicios. Strategy: contract tests (cada servicio testea su API), end-to-end tests (flujo completo), fixtures compartidas (datos de prueba). |

#### Ejemplo de variantes para un concepto

Para `system-integration-tradeoffs`, las 3 variantes cambian la decisión:

- **V1**: "Tu RAG service llama al CV service. ¿Sync (HTTP) o async (Kafka)?" — Sync si latencia <500ms, async si >500ms o para desacoplar
- **V2**: "El dashboard necesita datos de 3 servicios. ¿Cada servicio su DB o una DB compartida?" — Shared DB (más simple), service-owned (más escalable)
- **V3**: "Entre RAG service y dashboard, ¿REST o WebSocket?" — REST si el dashboard hace polling, WebSocket si necesita push en tiempo real

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué trade-offs consideras al integrar múltiples servicios?
2. ¿Cómo orquestas 7 servicios con Docker Compose?
3. ¿Qué estrategia de testing aplicas para integración?

### Recursos principales

- Docker Compose — Reference
- Mermaid — Diagram syntax
- MADR — Architecture Decision Record template
- "Designing Data-Intensive Applications" (Martin Kleppmann)
- "Building Microservices" (Sam Newman)

---

## Fase 2 — Senior (Secciones 27-39)

> **Objetivo de la fase**: Llevar a un estudiante Competente (S14-S26) al nivel Senior, donde puede diseñar y operar sistemas AI end-to-end a escala: async/concurrencia, LLM agents, MLOps, microservicios, streaming con Kafka, advanced ML (Optuna+SHAP), CV+AI integration, system design, dbt+BigQuery, performance extreme. El capstone S39 integra todo en una plataforma AI Senior.
>
> **Horas totales fase 2**: 168h · **Prerrequisito**: haber aprobado Fase 1 (S14-S26) o demostrar equivalencia.

---

## 27. Async & Concurrency

> **Tagline**: asyncio, aiohttp, httpx — concurrencia real para I/O pesado
> **Nivel**: Senior · **Horas estimadas**: 12h · **Ícono**: Zap

### Relevancia laboral

Async/await es el estándar para I/O concurrente en Python 2026. Empresas que procesan millones de requests (PedidosYa, MercadoLibre, Rappi) usan asyncio en sus servicios críticos. Un Senior que no domina async es un Mid-level. En entrevistas Senior, te piden explicar el event loop, cuándo async NO ayuda (CPU-bound), y cómo debuggear deadlocks.

### Objetivos de aprendizaje

- Entender el event loop de asyncio: tasks, coroutines, futures
- Usar `asyncio.gather`, `asyncio.wait`, `asyncio.create_task` para concurrencia
- Implementar async HTTP con `httpx` y `aiohttp` (10x más rápido que `requests` secuencial)
- Manejar `asyncio.Semaphore` para limitar concurrencia (rate limiting)
- Combinar async con multiprocessing para workloads mixtos (I/O + CPU)
- Debuggear con `asyncio.run`, `asyncio.sleep(0)`, `aiomonitor`

### Temas de teoría

1. Event loop: cómo asyncio decide qué tarea corre cuando; ceder con `await`
2. asyncio.gather vs wait vs TaskGroup (Python 3.11+)
3. httpx async: connection pooling, timeouts, retries con `httpx-retries`
4. Semaphore: limitar concurrencia para no saturar APIs externas
5. Async + multiprocessing: `loop.run_in_executor(ProcessPoolExecutor(), cpu_func)`

### I Do — Demostración guiada (Yo hago)

1. Scraping async de 100 URLs con httpx + asyncio.gather (10x speedup vs secuencial)
2. Implementar rate limiting con Semaphore(10) para respetar límite de API
3. Combinar async I/O con multiprocessing para post-procesamiento CPU-bound

### We Do — Práctica guiada (Hacemos juntos)

1. Refactoriza un script secuencial de `requests.get` a `httpx.AsyncClient` y mide el speedup
2. Implementa manejo de timeouts y retries con `tenacity` async

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Async Data Aggregator — Servicio async que agrega datos de 5+ APIs públicas (weather, news, crypto, stocks, exchange rates), con rate limiting, retries, y cache. Debe procesar 1000 requests en <10 segundos. Incluye: tests con pytest-asyncio, observabilidad con structlog, y un dashboard Streamlit mostrando latencia por API.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `event-loop-cooperative` | Analizar | asyncio es cooperative: cada task debe ceder con `await`. Una task que no cede bloquea todo el loop. Diferente de threads (preemptive). |
| 2 | `gather-vs-wait` | Aplicar | `gather(*tasks)` corre en paralelo, retorna lista en orden. `wait()` retorna (done, pending) sets. TaskGroup (3.11+) maneja cancelación automática en errores. |
| 3 | `async-httpx` | Aplicar | `httpx.AsyncClient` reusa conexiones (keep-alive), soporta HTTP/2, 10x más rápido que `requests` secuencial para N requests. |
| 4 | `semaphore-rate-limit` | Aplicar | `Semaphore(N)` limita a N tasks concurrentes. Crítico para no saturar APIs externas (429 Too Many Requests). |
| 5 | `async-cpu-mix` | Analizar | Async NO paraleliza CPU (GIL). Para mix I/O+CPU: async para I/O, `loop.run_in_executor(ProcessPoolExecutor(), cpu_func)` para CPU. |

#### Ejemplo de variantes

Para `event-loop-cooperative`:

- **V1**: "¿Por qué `time.sleep(5)` en una coroutine bloquea TODO el event loop?" — sleep no es awaitable, no cede control
- **V2**: "¿Qué debes usar en vez de `time.sleep(5)` dentro de una coroutine?" — `await asyncio.sleep(5)`
- **V3**: "Si una task hace un cálculo CPU-bound de 10s sin await, ¿qué pasa con las demás tasks?" — se bloquean 10s

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es el event loop de asyncio?
2. ¿Diferencia entre `asyncio.gather` y `asyncio.wait`?
3. ¿Por qué httpx async es más rápido que requests secuencial?
4. ¿Cómo limitas concurrencia con Semaphore?
5. ¿Cómo combinas async I/O con CPU-bound?

### Recursos principales

- asyncio — Official docs
- httpx — Async support
- Real Python — Async IO in Python
- "Using Async in Python" (Caleb Hattingh)
- aiohttp — Documentation

---

## 28. LLM Agents

> **Tagline**: Agentes autónomos con razonamiento ReAct: Thought → Action → Observation
> **Nivel**: Senior · **Horas estimadas**: 14h · **Ícono**: Bot

### Relevancia laboral

LLM Agents son la frontera actual de AI en 2026. Empresas usan agentes para: research autónomo, code review, customer support multi-step, data analysis sin humano. LangGraph es el framework estándar. Un AI Engineer Senior que sabe agentes cuesta 30-50% más que uno que solo hace RAG.

### Objetivos de aprendizaje

- Entender el patrón ReAct: Thought → Action → Observation → Repeat
- Implementar agentes con LangGraph: StateGraph, nodes, edges, conditional routing
- Diseñar herramientas (tools) que el agente pueda llamar: search, calculate, query_db
- Manejar memoria y state entre steps (MessagesState, checkpoints)
- Implementar human-in-the-loop (HITL): pause para aprobación humana en pasos críticos
- Evaluar agentes: trajectory eval, tool call accuracy, end-to-end task success

### Temas de teoría

1. ReAct pattern: razonamiento + acción en bucle hasta resolver
2. LangGraph StateGraph: nodos = agentes/tools, edges = routing condicional
3. Tools: function calling, structured outputs, tool_choice
4. Memoria: short-term (MessagesState), long-term (vector store + checkpoints)
5. HITL: `interrupt_before=["human_review"]`, resume con Command
6. Evaluación: trajectory matching, tool call accuracy, task completion rate

### I Do — Demostración guiada (Yo hago)

1. Implementar agente ReAct que responde "¿Cuál es el PBI per cápita de Perú?" usando tool `search_web` y `calculate`
2. Convertir a LangGraph StateGraph con conditional routing (si necesita más info → search, si tiene suficiente → respond)
3. Agregar HITL: si el agente quiere ejecutar `send_email`, pausa para aprobación humana

### We Do — Práctica guiada (Hacemos juntos)

1. Crea un agente "Data Analyst" que acepte preguntas en lenguaje natural y genere+ejecute SQL
2. Implementa memory con checkpointing para que el agente recuerde contexto entre mensajes

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Autonomous Research Agent — Agente LangGraph que recibe una pregunta de investigación (ej: "Analiza el mercado de EVs en LATAM 2026"), descompone en sub-preguntas, busca en web, sintetiza, y genera reporte markdown con citations. Debe incluir: 3+ tools, HITL para validar fuentes, evaluación con trajectory matching. Es un proyecto impresionante para portafolio AI Engineer Senior.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `react-pattern` | Aplicar | ReAct = Reasoning + Acting. El LLM genera Thought (qué hacer), Action (qué tool llamar), Observation (resultado). Repite hasta resolver. |
| 2 | `langgraph-stategraph` | Aplicar | StateGraph: nodos = funciones/agentes, edges = flujo. Conditional edges permiten routing dinámico basado en state. `interrupt_before` para HITL. |
| 3 | `tool-design` | Analizar | Tools deben ser: deterministas (mismo input = mismo output), con descripción clara para el LLM, con schema Pydantic para args. Tools no deterministas confunden al agente. |
| 4 | `agent-memory` | Aplicar | Short-term: MessagesState (últimos N mensajes). Long-term: vector store + checkpoints. Sin memoria, el agente no puede multi-turn. |
| 5 | `hitl-pattern` | Analizar | Human-in-the-loop: pausar antes de acciones críticas (enviar email, ejecutar SQL destructivo). `interrupt_before` + `Command(goto=...)` para resume. |

#### Ejemplo de variantes

Para `react-pattern`:

- **V1**: "¿Qué significa ReAct en LLM agents?" — Reasoning + Acting en bucle
- **V2**: "Tu agente ReAct se queda en loop infinito llamando la misma tool. ¿Cómo lo frenas?" — limitar max_iterations + early stop si repetición detectada
- **V3**: "¿Por qué ReAct supera a chain-of-thought puro para tareas con tools?" — CoT no puede llamar tools, ReAct sí

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es el patrón ReAct?
2. ¿Cómo defines un StateGraph en LangGraph?
3. ¿Qué hace una buena tool para un agente?
4. ¿Cómo manejas memoria en agentes?
5. ¿Cuándo necesitas HITL en un agente?

### Recursos principales

- LangGraph — Documentation
- ReAct paper (Yao et al., 2022)
- LangChain — Agents
- "Building LLM Powered Applications" (Valentina Alto)
- OpenAI — Function calling guide

---

## 29. MLOps

> **Tagline**: MLflow, drift detection, canary deploy — modelos que se cuidan solos
> **Nivel**: Senior · **Horas estimadas**: 14h · **Ícono**: GitBranch

### Relevancia laboral

MLOps es lo que separa un prototype de un sistema de ML en producción. Empresas peruanas (Interbank, BCP) tienen equipos MLOps dedicados. Senior ML Engineer con MLOps cuesta S/15,000-S/25,000/mes. Sin MLOps, tu modelo de churn que hoy tiene 87% AUC, en 3 meses tiene 70% por drift y nadie se entera hasta que el negocio pierde millones.

### Objetivos de aprendizaje

- Versionar modelos con MLflow Model Registry (Staging → Production → Archived)
- Detectar data drift con Evidently AI o Alibi Detect (PSI, KS test, concept drift)
- Implementar retraining automático triggered por drift
- Desplegar con canary: 5% → 25% → 100% con auto-rollback si degrada
- Monitorear en producción: latency, throughput, prediction distribution, business metrics
- Implementar A/B testing de modelos con feature flags

### Temas de teoría

1. MLflow: tracking (experiments), model registry (versioning), serving (deployment)
2. Drift detection: PSI (Population Stability Index), KS test, concept drift vs data drift
3. Canary deployment: traffic splitting, auto-rollback basado en métricas
4. Monitoring: Prometheus + Grafana para latency/throughput, Evidently para drift
5. A/B testing: significance, sample size, network effects, paired vs unpaired

### I Do — Demostración guiada (Yo hago)

1. Registrar modelo XGBoost en MLflow con metrics, params, y artifact (pipeline.pkl)
2. Promover v1.0 → v2.0: Staging → Production, archive v1.0
3. Implementar drift detection con Evidently que genera reporte HTML semanal

### We Do — Práctica guiada (Hacemos juntos)

1. Configura canary deployment: 95% tráfico a v1.0, 5% a v2.0, auto-rollback si AUC baja >5%
2. Implementa retraining trigger: si drift >0.2, ejecuta pipeline de re-entrenamiento

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: MLOps Pipeline for Churn Model — Pipeline completo: entrenamiento con MLflow tracking, registro en Model Registry, deploy canary a FastAPI, monitoreo con Evidently (drift semanal), retraining automático. Incluye dashboard Grafana con métricas en tiempo real y alertas Slack en drift alto.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `mlflow-registry-stages` | Aplicar | Model Registry: None → Staging → Production → Archived. Promote = mover de stage. Permite rollback rápido a versión anterior. |
| 2 | `data-drift-detection` | Analizar | Data drift: distribución de input cambia. Concept drift: relación input→output cambia. PSI >0.2 = drift significativo. Requiere retraining. |
| 3 | `canary-deployment` | Aplicar | Canary: 5% tráfico a nueva versión, 95% a vieja. Si métricas OK en ventana (ej: 1h), subir a 25% → 50% → 100%. Si degrada, auto-rollback. |
| 4 | `retraining-trigger` | Analizar | Retraining automático triggered por: drift >threshold, schedule (semanal), o business metric drop. Balance: muy frecuente = costoso, muy raro = modelo obsoleto. |
| 5 | `ab-testing-models` | Aplicar | A/B test: dividir tráfico entre modelo A y B, comparar business metric (ej: conversion). Requiere sample size calculado para significancia estadística. |

#### Ejemplo de variantes

Para `data-drift-detection`:

- **V1**: "Tu modelo de churn entrena con datos 2024. En 2026, precisión cayó 15%. ¿Qué tipo de drift es?" — data drift (distribución cambió)
- **V2**: "PSI de tu feature 'edad' subió de 0.05 a 0.35. ¿Qué haces?" — investigar y re-entrenar (PSI >0.2 = drift)
- **V3**: "¿Diferencia entre data drift y concept drift?" — data drift: P(X) cambia; concept drift: P(Y\|X) cambia

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué stages tiene MLflow Model Registry?
2. ¿Qué es data drift y cómo lo detectas?
3. ¿Cómo funciona un canary deployment?
4. ¿Cuándo re-entrenas un modelo automáticamente?
5. ¿Cómo haces A/B testing de modelos?

### Recursos principales

- MLflow — Official docs
- Evidently AI — Documentation
- "Designing ML Systems" (Huyen Chip)
- "Machine Learning Engineering" (Andriy Burkov)
- Alibi Detect — GitHub

---

## 30. Security & Infrastructure

> **Tagline**: Zero Trust, Vault, structlog — producción segura desde el día 1
> **Nivel**: Senior · **Horas estimadas**: 12h · **Ícono**: Lock

### Relevancia laboral

Senior ML/AI Engineer maneja secrets, audita accesos, y diseña infra segura. Empresas reguladas (banca, salud) exigen Zero Trust: cada request se verifica, sin trust implícito. Un Senior que no entiende HashiCorp Vault, structured logging, y network segmentation no pasa entrevistas en FinTech.

### Objetivos de aprendizaje

- Implementar Zero Trust: cada request se autentica y autoriza, sin trust de red
- Manejar secrets con HashiCorp Vault (rotación, dynamic secrets, audit log)
- Estructurar logs con structlog: JSON, context vars, correlation IDs
- Implementar network segmentation: VPC, security groups, private subnets
- Auditar accesos: log de cada acceso a datos sensibles, retention policy
- Compliance: Ley 29733 (Perú), GDPR, SOC 2 — mapeo a controles técnicos

### Temas de teoría

1. Zero Trust: never trust always verify, microsegmentation, identity-centric
2. HashiCorp Vault: secret engines, dynamic secrets (DB creds con TTL), audit log
3. structlog: JSON logs, context vars, processors, correlation IDs
4. Network security: VPC, subnets públicas/privadas, NAT, security groups
5. Compliance: Ley 29733 (datos personales Perú), GDPR, SOC 2 Type II

### I Do — Demostración guiada (Yo hago)

1. Configurar Vault con secret engine KV v2 para API keys con rotación automática
2. Implementar middleware FastAPI que verifica JWT + scope + rate limit en cada request (Zero Trust)
3. Structured logging con correlation ID: cada request genera UUID que se propaga a logs de todos los servicios

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa dynamic DB credentials: Vault emite creds PostgreSQL con TTL de 1h
2. Crea dashboard Grafana que visualiza logs estructurados con filtros por correlation_id

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Zero Trust ML Service — Servicio FastAPI con: auth JWT + scope-based authz, Vault para secrets, structlog con correlation IDs, rate limiting, audit log de accesos a datos sensibles, deploy en AWS con VPC private subnet. Incluye diagrama de arquitectura y documentación de compliance con Ley 29733.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `zero-trust-principle` | Analizar | Zero Trust: nunca confíes en la red, verifica cada request. Reemplaza "castle-and-moat" (confianza dentro de la red). Cada request lleva identidad + scope. |
| 2 | `vault-dynamic-secrets` | Aplicar | Vault emite creds efímeros (TTL 1h) para DB/APIs. Si se filtran, expiran rápido. Reemplaza creds estáticas en .env. |
| 3 | `structlog-correlation` | Aplicar | structlog emite JSON logs con context vars. Correlation ID permite trazar un request a través de N servicios. Esencial para debug en microservicios. |
| 4 | `network-segmentation` | Analizar | VPC con subnets públicas (load balancer) y privadas (DB, ML services). Security groups restrictivos. NAT para outbound. Reduce blast radius. |
| 5 | `compliance-ley-29733` | Aplicar | Ley 29733 (Perú): datos personales deben tener consentimiento, propósito definido, seguridad razonable. Bancos adicionales: SBS regulación. |

#### Ejemplo de variantes

Para `zero-trust-principle`:

- **V1**: "¿Cuál es el principio central de Zero Trust?" — never trust, always verify
- **V2**: "¿Por qué Zero Trust reemplaza al modelo castle-and-moat?" — porque asume que la red interna ya está comprometida
- **V3**: "¿Cómo implementas Zero Trust en una API?" — auth en cada request + scope-based authz + rate limit + audit log

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es Zero Trust?
2. ¿Qué ventaja tienen dynamic secrets de Vault?
3. ¿Para qué sirve un correlation ID en logs?
4. ¿Por qué separar subnets públicas y privadas?
5. ¿Qué exige la Ley 29733 para datos personales?

### Recursos principales

- NIST Zero Trust Architecture (SP 800-207)
- HashiCorp Vault — Documentation
- structlog — Official docs
- Ley N° 29733 — Protección de Datos Personales (Perú)
- AWS Well-Architected Framework — Security pillar

---

## 31. Streaming Data

> **Tagline**: Kafka, windowing, backpressure — datos en movimiento a escala
> **Nivel**: Senior · **Horas estimadas**: 14h · **Ícono**: Radio

### Relevancia laboral

Streaming es la frontera entre batch y real-time. Empresas como Rappi, PedidosYa, Uber procesan millones de eventos/día con Kafka. Senior Data Engineer con Kafka cuesta 40% más que sin. En Lima, bancos usan streaming para fraud detection en tiempo real.

### Objetivos de aprendizaje

- Entender arquitectura Kafka: producers, consumers, topics, partitions, consumer groups
- Implementar producers con `confluent-kafka-python` (librdkafka, 100K msgs/s)
- Implementar consumers con offset management (at-least-once, exactly-once semantics)
- Aplicar windowing: tumbling (no overlap), sliding (overlap), session (gap-based)
- Manejar backpressure con queues acotadas y dead-letter queues (DLQ)
- Usar Kafka Streams / Faust para stream processing en Python

### Temas de teoría

1. Kafka architecture: brokers, topics, partitions, replication, consumer groups
2. Producer semantics: at-least-once (default), exactly-once (idempotent + transactions)
3. Windowing: tumbling (5s, no overlap), sliding (5s slide 1s), session (gap 30s)
4. Backpressure: bounded queues, drop oldest, block producer, DLQ
5. Stream processing: Kafka Streams (Java), Faust (Python), ksqlDB (SQL)

### I Do — Demostración guiada (Yo hago)

1. Levantar Kafka local con Docker, producir 10K eventos, consumir con consumer group
2. Implementar windowed aggregation: contar transacciones sospechosas por ventana de 5 min
3. Manejar backpressure con queue maxsize=1000 y DLQ para eventos que fallan processing

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa exactly-once semantics con transactions Kafka
2. Crea un stream processing que detecta anomalous patterns en tiempo real (ej: >5 transacciones/min mismo usuario)

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Real-time Fraud Detection Stream — Pipeline Kafka que procesa transacciones bancarias en tiempo real, aplica reglas de fraude (velocity, geo-anomaly, amount spike), y alerta en Slack. Incluye: producer sintético, consumer con Faust, dashboard Streamlit con métricas live, y DLQ para transacciones que no se pudieron procesar.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `kafka-partitions-consumer-groups` | Aplicar | Partitions = paralelismo. Consumer group = un consumer lee cada partition. Más partitions = más paralelismo pero más overhead. |
| 2 | `delivery-semantics` | Analizar | At-most-once (puede perder), at-least-once (puede duplicar, default), exactly-once (idempotent + transactions, costoso). Trade-off: simplicidad vs garantía. |
| 3 | `windowing-types` | Aplicar | Tumbling (5s, no overlap), sliding (5s slide 1s, overlap), session (gap-based, eventos relacionados). Elegir según necesidad. |
| 4 | `backpressure-strategies` | Analizar | Bounded queue: bloquear producer. Drop oldest: perder eventos viejos. DLQ: encolar fallos para reproceso. Cada strategy tiene trade-offs. |
| 5 | `faust-stream-processing` | Aplicar | Faust (Python) para stream processing sobre Kafka. Soporta agents, tables (state), windows. Alternativa a Kafka Streams (Java). |

#### Ejemplo de variantes

Para `delivery-semantics`:

- **V1**: "Tu consumer crash después de procesar pero antes de commitear offset. ¿Qué pasa al restart?" — reprocesa (at-least-once, posible duplicado)
- **V2**: "Tu caso de uso es transferencias bancarias. ¿Qué semantic necesitas?" — exactly-once (no puedes duplicar ni perder)
- **V3**: "¿Por qué exactly-once es costoso en Kafka?" — requiere transactions + idempotent producers, más overhead

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es una partition en Kafka?
2. ¿Diferencia entre at-least-once y exactly-once?
3. ¿Qué es una tumbling window?
4. ¿Cómo manejas backpressure en streaming?
5. ¿Qué hace Faust?

### Recursos principales

- Apache Kafka — Documentation
- confluent-kafka-python — GitHub
- Faust — Stream Processing
- "Kafka: The Definitive Guide" (Narkhede et al.)
- Kafka Streams — Topology docs

---

## 32. Microservices & Distributed Systems

> **Tagline**: Circuit breakers, health checks, service mesh — resiliencia a escala
> **Nivel**: Senior · **Horas estimadas**: 14h · **Ícono**: Network

### Relevancia laboral

Microservices son el estándar para sistemas a escala. Empresas LATAM (MercadoLibre, PedidosYa) operan 100+ microservicios. Senior Engineer debe saber: circuit breakers, health checks, service mesh, distributed tracing, y cuando NO usar microservices (modular monolith es válido).

### Objetivos de aprendizaje

- Diseñar microservices con bounded contexts (DDD)
- Implementar circuit breaker (CLOSED → OPEN → HALF_OPEN) con `pybreaker` o `tenacity`
- Health checks: liveness (está vivo) vs readiness (está listo para recibir tráfico)
- Distributed tracing con OpenTelemetry (trace context propaga entre servicios)
- Service mesh con Istio/Linkerd (mTLS, traffic splitting, retries)
- Cuándo elegir microservices vs modular monolith (trade-offs)

### Temas de teoría

1. Bounded contexts: cada microservice tiene un dominio claro (orders, payments, users)
2. Circuit breaker: 3 estados (CLOSED, OPEN, HALF_OPEN), thresholds, reset timeout
3. Health checks: liveness (restart si falla), readiness (no enviar tráfico si falla)
4. Distributed tracing: OpenTelemetry, trace/span, propagación de context
5. Service mesh: sidecar proxy, mTLS, traffic policies, observability

### I Do — Demostración guiada (Yo hago)

1. Construir 3 microservices (orders, payments, notifications) con FastAPI + Docker Compose
2. Implementar circuit breaker entre orders y payments: si payments falla 3 veces, abrir circuito 30s
3. Agregar OpenTelemetry tracing: ver trace completo de un request a través de 3 servicios en Jaeger

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa health checks liveness + readiness en cada servicio
2. Configura retry con exponential backoff en llamadas entre servicios

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Microservices E-commerce Platform — 4+ microservices (users, products, orders, payments) con: circuit breakers, health checks, distributed tracing con Jaeger, Docker Compose para dev. Incluye README con diagrama de arquitectura y decisión ADR justificando microservices vs monolith.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `bounded-contexts-ddd` | Analizar | Cada microservice tiene un bounded context (domain) claro. Evita shared DB anti-pattern. Comunicación via APIs, no via DB compartida. |
| 2 | `circuit-breaker-states` | Aplicar | CLOSED (normal) → OPEN (after N fallos, reject rápido) → HALF_OPEN (probe, si OK → CLOSED, si fail → OPEN). Previene cascada de fallos. |
| 3 | `liveness-vs-readiness` | Aplicar | Liveness: "está vivo" (si falla, restart). Readiness: "está listo" (si falla, no enviar tráfico pero no restart). K8s usa ambos. |
| 4 | `opentelemetry-tracing` | Aplicar | OpenTelemetry: trace ID propaga entre servicios via headers. Span = unidad de trabajo en un servicio. Jaeger/Zipkin visualizan. |
| 5 | `microservices-vs-modular-monolith` | Analizar | Microservices: escalabilidad, deploy independiente, pero complejidad operacional. Modular monolith: simple, pero escala limitada. Elegir según contexto. |

#### Ejemplo de variantes

Para `circuit-breaker-states`:

- **V1**: "Tu servicio A llama a B que está caído. ¿Qué hace un circuit breaker?" — después de N fallos, abre y rechaza rápido sin esperar timeout
- **V2**: "Circuit breaker en HALF_OPEN. ¿Qué significa?" — probando si el servicio下游 recuperó; 1 request de prueba
- **V3**: "¿Por qué un circuit breaker previene cascadas de fallos?" — rechaza rápido sin agotar threads esperando timeouts

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es un bounded context?
2. ¿Cuáles son los 3 estados de un circuit breaker?
3. ¿Diferencia entre liveness y readiness?
4. ¿Cómo propaga OpenTelemetry el trace ID?
5. ¿Cuándo eliges modular monolith sobre microservices?

### Recursos principales

- "Building Microservices" (Sam Newman)
- Martin Fowler — Microservices articles
- OpenTelemetry — Documentation
- Istio — Service mesh docs
- pybreaker — Circuit breaker Python

---

## 33. Advanced ML Models

> **Tagline**: Optuna, stacking, SHAP — más allá del baseline
> **Nivel**: Senior · **Horas estimadas**: 14h · **Ícono**: Brain

### Relevancia laboral

Senior ML Engineer se diferencia del Junior en: (1) optimización bayesiana (Optuna) en vez de grid search, (2) ensembles (stacking, blending) en vez de modelo único, (3) interpretabilidad (SHAP) para alta toma de decisiones. En banca/seguros peruanos, estas skills son obligatorias para modelos que afectan créeito.

### Objetivos de aprendizaje

- Optimizar hiperparámetros con Optuna TPE (Bayesian optimization, 10x más eficiente que grid)
- Implementar stacking ensembles con mlxtend (meta-learner sobre base learners)
- Explicar predicciones con SHAP: global (summary_plot) y local (force_plot)
- Calibrar probabilidades con CalibratedClassifierCV (isotonic, sigmoid)
- Manejar class imbalance: SMOTE, class_weight, focal loss

### Temas de teoría

1. Optuna TPE: Bayesian optimization, pruner (MedianPruner), multivariate TPE
2. Stacking: out-of-fold predictions para meta-learner, evitar leakage con cv=5
3. SHAP: TreeExplainer (exact), KernelExplainer (approx), summary_plot, force_plot, dependence_plot
4. Calibración: isotonic (no parametric), sigmoid (Platt scaling), reliability diagram
5. Imbalance: SMOTE (oversample minority), class_weight='balanced', focal loss

### I Do — Demostración guiada (Yo hago)

1. Optimizar XGBoost con Optuna: 100 trials, TPE multivariate, MedianPruner
2. Implementar stacking: XGBoost + LightGBM + Logistic como meta-learner, cv=5 out-of-fold
3. SHAP analysis: global summary_plot + local force_plot para un cliente específico

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa calibration con CalibratedClassifierCV(method='isotonic', cv=5)
2. Maneja class imbalance (5% churn) con class_weight + SMOTE, compara resultados

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Advanced Churn Pipeline — Pipeline ML con: Optuna tuning (100 trials), stacking ensemble (XGBoost+LightGBM+RF), SHAP explanations, probability calibration, manejo de imbalance. Debe incluir: comparación vs baseline (LogisticRegression), reporte de business impact (top 10 features, distribución de predicciones, ROI de retención).

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `optuna-tpe-bayesian` | Analizar | TPE (Tree-structured Parzen Estimator): Bayesian optimization. Construye distribución de buenos/malos params. 10x más eficiente que grid search. |
| 2 | `stacking-out-of-fold` | Aplicar | Stacking: meta-learner entrenado sobre out-of-fold predictions de base learners. Evita leakage. cv=5: 5 folds, 5 modelos base, promedio de OOF. |
| 3 | `shap-tree-explainer` | Aplicar | TreeExplainer: exacto para tree models (no aproximación). summary_plot (global), force_plot (single prediction), dependence_plot (feature interaction). |
| 4 | `probability-calibration` | Analizar | Modelos como SVM/RF no devuelven probabilidades calibradas. CalibratedClassifierCV(method='isotonic') corrige. Útil para credit scoring. |
| 5 | `class-imbalance-strategies` | Analizar | SMOTE (oversample sintético), class_weight='balanced' (penaliza más errores minority), focal loss. Trade-off: precision vs recall. |

#### Ejemplo de variantes

Para `optuna-tpe-bayesian`:

- **V1**: "¿Por qué Optuna TPE es más eficiente que grid search?" — usa info de trials pasados para enfocar búsqueda
- **V2**: "Tienes 8 hiperparámetros. Grid search con 5 valores cada uno = 5^8 trials. ¿Qué usas?" — Optuna TPE (Bayesian, mucho menos trials)
- **V3**: "¿Qué hace MedianPruner en Optuna?" — mata trials early si performance intermedia es peor que mediana

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Por qué Optuna TPE supera a grid search?
2. ¿Cómo evitas leakage en stacking?
3. ¿Qué hace SHAP TreeExplainer?
4. ¿Cuándo necesitas calibrar probabilidades?
5. ¿Cuándo usar SMOTE vs class_weight?

### Recursos principales

- Optuna — Documentation
- SHAP — GitHub
- mlxtend — Stacking classifier
- "Interpretable Machine Learning" (Christoph Molnar)
- Imbalanced-learn — Documentation

---

## 34. CV + AI Integration

> **Tagline**: YOLO + Tesseract + LLM — pipeline multi-modal para documentos
> **Nivel**: Senior · **Horas estimadas**: 12h · **Ícono**: ScanFace

### Relevancia laboral

CV + AI es la frontera para automatización documental. Empresas peruanas (SUNAT, bancos, seguros) procesan millones de facturas/contratos/DNIs. Un pipeline YOLO+Tesseract+LLM reemplaza 20+ horas de tipeo manual. Senior CV Engineer cuesta 30-50% más que un ML Engineer generalista.

### Objetivos de aprendizaje

- Integrar YOLOv8 (detección) + Tesseract (OCR) + LLM (extracción estructurada)
- Implementar preprocessing adaptativo: deskew, denoise, binarize según tipo de documento
- Manejar multi-language: español + inglés + formatos peruanos (DNI, RUC, facturas SUNAT)
- Optimizar para batch processing: procesar 1000 imágenes en <5 minutos
- Implementar confidence scoring: rechazar documentos con confidence <threshold para review humano

### Temas de teoría

1. Pipeline YOLO→OCR→LLM: detect regions, extract text, structure fields
2. Preprocessing: grayscale, bilateral filter, Otsu threshold, deskew con Hough
3. Tesseract config: --psm modes (6 para receipts, 3 para scenes), lang="spa+eng"
4. LLM structured output: response_format json_schema, validar con Pydantic
5. Confidence scoring: combinar YOLO conf + Tesseract conf + LLM self-reported conf

### I Do — Demostración guiada (Yo hago)

1. Pipeline completo: foto de factura → YOLO detecta regiones → Tesseract extrae → LLM estructura (RUC, monto, fecha)
2. Preprocessing adaptativo: si imagen está rotada, deskew; si está borrosa, sharpening
3. Confidence scoring: si cualquier campo tiene conf <0.8, marcar para review humano

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa batch processing con multiprocessing: 1000 imágenes en paralelo
2. Crea dashboard Streamlit que muestra documentos pendientes de review

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: SUNAT Invoice Digitizer — Pipeline que procesa facturas peruanas SUNAT: YOLO detecta regiones (header, items, total), Tesseract extrae texto, LLM estructura campos (RUC emisor, razón social, monto, IGV, fecha). Valida RUC con dígito verificador. Procesa 1000 facturas en <5 min. Dashboard para review humano de facturas con confidence baja.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `yolo-tesseract-llm-pipeline` | Analizar | YOLO detecta regiones (más rápido que OCR full image), Tesseract extrae texto por región (mejor accuracy), LLM estructura campos (semántica). |
| 2 | `preprocessing-adaptive` | Aplicar | Deskew (Hough), denoise (bilateral), binarize (Otsu). Adaptativo: aplicar solo si es necesario (ej: deskew solo si ángulo >5°). |
| 3 | `tesseract-psm-modes` | Aplicar | PSM 6 (uniform block of text, receipts), PSM 3 (fully automatic, scenes), PSM 11 (sparse text). Elegir según tipo documento. |
| 4 | `llm-structured-output` | Aplicar | OpenAI response_format json_schema garantiza output válido contra Pydantic schema. No parsing de texto libre. |
| 5 | `confidence-scoring-strategy` | Analizar | Combinar YOLO conf + Tesseract conf + LLM self-conf. Si cualquiera <0.8, review humano. Balance: muy estricto = mucho manual, muy laxo = errores. |

#### Ejemplo de variantes

Para `tesseract-psm-modes`:

- **V1**: "Procesas recibos de supermercado. ¿Qué PSM usas?" — PSM 6 (uniform block of text)
- **V2**: "Procesas fotos de letreros en la calle. ¿Qué PSM?" — PSM 11 (sparse text)
- **V3**: "Procesas facturas con tabla compleja. ¿PSM 6 o 3?" — PSM 3 (fully automatic, mejor para tablas)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Por qué YOLO antes de Tesseract mejora accuracy?
2. ¿Cuándo aplicas deskew?
3. ¿Qué PSM usas para recibos?
4. ¿Cómo garantizas output estructurado de un LLM?
5. ¿Cómo combinas confidences de 3 modelos?

### Recursos principales

- Ultralytics YOLOv8 — Docs
- Tesseract — Documentation
- OpenAI — Structured outputs
- OpenCV — Tutorials
- Roboflow — Dataset annotation

---

## 35. System Design for AI

> **Tagline**: Arquitecturas end-to-end: kappa, lambda, feature stores, ADRs
> **Nivel**: Senior · **Horas estimadas**: 14h · **Ícono**: Building2

### Relevancia laboral

System Design es la skill #1 que diferencia Senior de Mid-level. En entrevistas FAANG, dedican 45 min a system design. En LATAM, MercadoLibre y PedidosYa hacen lo mismo. Un Senior que no sabe diseñar un sistema de scoring crediticio end-to-end en una pizarra no pasa.

### Objetivos de aprendizaje

- Diseñar arquitecturas AI end-to-end: ingestion → features → training → serving → monitoring
- Elegir entre Lambda (batch+speed) y Kappa (unified stream) architectures
- Implementar feature store con Feast (online Redis + offline BigQuery)
- Documentar decisiones con ADRs (Architecture Decision Records, MADR template)
- Estimar capacidad: QPS, latencia p99, storage, costo mensual
- Diseñar para escalabilidad: sharding, caching, CDN, read replicas

### Temas de teoría

1. Lambda vs Kappa: Lambda (batch + speed layer), Kappa (unified stream). Kappa gana en 2026.
2. Feature store: Feast (online Redis <10ms, offline BigQuery point-in-time correct)
3. ADRs: Context, Decision, Alternatives, Consequences. MADR template. Stored en /docs/adr/
4. Capacity planning: QPS, latency budgets, storage growth, cost modeling ($/prediction)
5. Scalability: sharding (by user_id), caching (Redis), CDN (static assets), read replicas (DB)

### I Do — Demostración guiada (Yo hago)

1. Diseñar sistema de scoring crediticio real-time: 1000 QPS, p99 <100ms, feature store Feast + XGBoost + Redis cache
2. Escribir ADR documentando decisión: "Kappa architecture con Kafka + Flink sobre Lambda"
3. Capacity planning: 1000 QPS × 30 días = 2.6B predictions/mes, storage 50TB, costo $4,500/mes

### We Do — Práctica guiada (Hacemos juntos)

1. Diseña sistema de recomendación para e-commerce: 10K QPS, p99 <50ms, candidate generation + ranking
2. Escribe ADR para decisión: "Redis cache vs Memcached para feature store online"

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: AI System Design Document — Documento de arquitectura completo para un sistema AI real (ej: fraud detection, recommendation, content moderation). Incluye: diagrama Mermaid, ADRs (5+ decisiones), capacity planning, cost estimation, scalability plan, failure modes (what-if analysis). Es el tipo de documento que un Senior presenta en arquitectura review.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `kappa-vs-lambda` | Analizar | Lambda: batch + speed layer (doble código). Kappa: un stream para todo (simplificación). Kappa gana en 2026 con Kafka+ Flink. |
| 2 | `feature-store-feast` | Aplicar | Feast: online store (Redis, <10ms) + offline store (BigQuery, point-in-time correct). Evita training/serving skew. |
| 3 | `adr-madr-template` | Aplicar | ADR: Context, Decision, Alternatives, Consequences. MADR template estandarizado. Stored en /docs/adr/NNNN-title.md en repo. |
| 4 | `capacity-planning` | Aplicar | QPS × tiempo = volumen. Latency budget: p99 <100ms descompuesto en cache lookup + feature fetch + model infer + network. Cost: $/prediction. |
| 5 | `scalability-patterns` | Analizar | Sharding (particionar por key), caching (Redis), CDN (estáticos), read replicas (DB reads). Cada pattern resuelve un bottleneck distinto. |

#### Ejemplo de variantes

Para `kappa-vs-lambda`:

- **V1**: "¿Cuál es la principal ventaja de Kappa sobre Lambda?" — un solo código (no batch + speed)
- **V2**: "Tu caso de uso requiere recomputar histórico de 5 años. ¿Kappa o Lambda?" — Lambda (batch para histórico, speed para real-time)
- **V3**: "¿Por qué Kafka enable Kappa architecture?" — permite replay (reconsume desde offset antiguo)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Diferencia entre Kappa y Lambda architecture?
2. ¿Qué problema resuelve un feature store?
3. ¿Qué contiene un ADR?
4. ¿Cómo estimas el costo de un sistema AI?
5. ¿Cuándo usar sharding vs caching?

### Recursos principales

- "Designing Data-Intensive Applications" (Martin Kleppmann)
- Feast — Feature store docs
- MADR — ADR template
- "System Design Interview" (Alex Xu)
- Google SRE Book — Capacity planning

---

## 36. Advanced AI APIs

> **Tagline**: Function calling, structured outputs, batch API — LLMs en producción
> **Nivel**: Senior · **Horas estimadas**: 10h · **Ícono**: Sparkles

### Relevancia laboral

LLM APIs evolucionan rápido. En 2026, function calling y structured outputs son estándar. Senior AI Engineer debe saber: cuándo usar streaming, cuándo batch, cómo manejar rate limits, cómo estructurar outputs para pipelines downstream.

### Objetivos de aprendizaje

- Implementar function calling: LLM decide qué tool ejecutar, ejecuta, retorna resultado
- Usar structured outputs (Aug 2024): response_format json_schema garantiza schema válido
- Batch API: 50% descuento, 24h SLA, ideal para evaluaciones masivas
- Manejar streaming con SSE: primer token <1s, UX mejor
- Implementar rate limiting y retries con backoff exponencial

### Temas de teoría

1. Function calling: tool_calls, tool_choice (auto/required/none), parallel tool calls
2. Structured outputs: response_format json_schema, 100% schema determinism
3. Batch API: 50K requests/file, 50% descuento, 24h SLA, ideal para eval/labeling
4. Streaming: SSE (Server-Sent Events), primer token TTFT <1s, UX mejor
5. Rate limits: RPM/TPM, exponential backoff, jitter, queue con Redis

### I Do — Demostración guiada (Yo hago)

1. Function calling: chatbot que decide si buscar en web o calcular, ejecuta tool, retorna respuesta
2. Structured output: extraer campos de factura con Pydantic schema garantizado
3. Batch API: procesar 10K documentos para labeling, 50% ahorro vs sincrónico

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa streaming con SSE para chat UX (primer token <1s)
2. Configura rate limiting con Redis: 50 RPM por usuario, queue para excedentes

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: LLM-Powered Data Pipeline — Pipeline que usa LLM para: (1) extraer entidades de 10K documentos (structured outputs), (2) clasificar sentimiento (batch API para ahorro), (3) responder queries con function calling (search_db + calculate). Incluye: rate limiting, retries, cost tracking, dashboard de usage.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `function-calling-tools` | Aplicar | LLM decide qué tool llamar basado en user query. tool_calls JSON, ejecutas, retornas resultado. tool_choice=auto/required/none. |
| 2 | `structured-outputs-json-schema` | Aplicar | response_format json_schema garantiza output válido contra schema Pydantic. 100% schema determinism. Reemplaza parsing de texto libre. |
| 3 | `batch-api-cost-optimization` | Analizar | Batch API: 50% descuento, 24h SLA, hasta 50K requests/file. Ideal para nightly evals, dataset labeling, embeddings masivas. |
| 4 | `streaming-sse-ux` | Aplicar | SSE: primer token TTFT <1s, UX percibida 10x mejor. Para chatbots esencial. No apto para structured outputs (aún). |
| 5 | `rate-limit-strategies` | Aplicar | RPM (requests per min), TPM (tokens per min). Backoff exponencial con jitter. Queue Redis para no perder requests excedentes. |

#### Ejemplo de variantes

Para `batch-api-cost-optimization`:

- **V1**: "Procesas 50K documentos mensualmente para clasificación. ¿Sincrónico o batch API?" — batch (50% descuento, no necesitas real-time)
- **V2**: "Tu chatbot atiende 1000 usuarios concurrentes. ¿Batch o sync?" — sync (no puedes esperar 24h)
- **V3**: "¿Por qué batch API da 50% descuento?" — OpenAI programa en off-peak hours, mejor utilización de GPUs

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es function calling en LLMs?
2. ¿Cómo garantizas output estructurado?
3. ¿Cuándo usar batch API?
4. ¿Cuándo usar streaming SSE?
5. ¿Cómo manejas rate limits de LLM APIs?

### Recursos principales

- OpenAI — Function calling guide
- OpenAI — Structured outputs
- OpenAI — Batch API
- Anthropic — Claude API docs
- LiteLLM — Unified API client

---

## 37. dbt + BigQuery

> **Tagline**: Transformaciones SQL versionadas, testeadas, documentadas
> **Nivel**: Senior · **Horas estimadas**: 12h · **Ícono**: Database

### Relevancia laboral

dbt es el estándar para transformaciones SQL en data warehouses. Empresas data-mature peruanas (PedidosYa, MercadoLibre LATAM) usan dbt + BigQuery. Senior Data Engineer con dbt cuesta 25-40% más. Es la skill #1 pedida en Linkedln para roles Analytics Engineer.

### Objetivos de aprendizaje

- Modelar transforms SQL con dbt: models (view, table, incremental, ephemeral)
- Aplicar materializaciones correctas: view (cheap), table (persisted), incremental (append/merge)
- Implementar tests: generic (unique, not_null, accepted_values, relationships) + unit tests (v1.8+)
- Generar documentación: dbt docs (lineage DAG, schema, descriptions)
- Optimizar BigQuery: partitioning, clustering, denormalization

### Temas de teoría

1. Materializaciones: view, table, incremental, ephemeral. Cuándo usar cada una.
2. Generic tests: unique, not_null, accepted_values, relationships (FK). Custom tests con singular.
3. Unit tests (dbt v1.8+): input rows + expected output, valida SQL pre-prod.
4. dbt docs: `dbt docs generate && dbt docs serve`. Lineage DAG interactivo.
5. BigQuery optimization: partition by date, cluster by high-cardinality, avoid SELECT *

### I Do — Demostración guiada (Yo hago)

1. Modelo `fct_orders` incremental con unique_key + merge strategy + partition by date
2. Tests: unique(order_id), not_null(customer_id), relationships(orders.customer_id → customers.id)
3. `dbt docs generate && dbt docs serve`: explorar lineage DAG interactivo

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa unit test para modelo `stg_customers`: input 3 rows, expected output 3 rows limpios
2. Optimiza query BigQuery: añade partitioning por `created_at` y clustering por `customer_id`

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: dbt Analytics Layer — Proyecto dbt completo para un dominio (ventas, finanzas, marketing). Incluye: 10+ models (staging, intermediate, marts), 5+ tests, 1 unit test, dbt docs publicados, BigQuery optimization. README con diagrama de lineage y descripción de cada model.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `dbt-materializations` | Aplicar | view (cheap, on-query), table (persisted), incremental (append/merge new rows), ephemeral (CTE inlined). Elegir según tamaño y frecuencia de query. |
| 2 | `generic-tests` | Aplicar | unique, not_null, accepted_values, relationships (FK). Custom singular tests con SQL. Fallan el build si se violan. |
| 3 | `unit-tests-dbt-v18` | Aplicar | dbt v1.8+ unit tests: input rows + expected output. Valida SQL pre-prod. Diferente de generic tests (que validan data post-build). |
| 4 | `incremental-strategy` | Analizar | merge (default, requiere unique_key), append (más rápido, puede duplicar), insert_overwrite (reemplaza partición). Elegir según guarantee de unicidad. |
| 5 | `bigquery-partition-cluster` | Aplicar | Partition by date (predicate pushdown, 100x más rápido). Cluster by high-cardinality column (colocate datos similares). Ambos reducen cost. |

#### Ejemplo de variantes

Para `dbt-materializations`:

- **V1**: "Tu modelo de 1M rows se querya 50 veces/día. ¿view o table?" — table (persistido, no recompute)
- **V2**: "Tu modelo de 1B rows crece 10M/día. ¿table o incremental?" — incremental (no reprocesa todo)
- **V3**: "Tu modelo es un CTE usado por 5 models. ¿view o ephemeral?" — ephemeral (se inlina en cada consumer, no persiste)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuándo usar view vs table vs incremental?
2. ¿Qué tests genéricos ofrece dbt?
3. ¿Diferencia entre generic tests y unit tests?
4. ¿Qué hace unique_key en incremental merge?
5. ¿Cómo optimizas un query BigQuery lento?

### Recursos principales

- dbt — Documentation
- dbt — Best practices guide
- BigQuery — Best practices
- "The Data Warehouse Toolkit" (Kimball)
- dbt — Learn courses

---

## 38. Performance Extreme

> **Tagline**: Numba, Polars, CuPy — cuando Python no es suficiente
> **Nivel**: Senior · **Horas estimadas**: 12h · **Ícono**: Gauge

### Relevancia laboral

Senior Engineer identifica cuándo Python puro es suficiente y cuándo no. Para hot loops, Numba (LLVM JIT) da 100x. Para DataFrames grandes, Polars (Rust) da 25x sobre pandas. Para GPU, CuPy reemplaza NumPy. Saber cuándo aplicar cada uno es lo que diferencia Senior de Junior.

### Objetivos de aprendizaje

- Identificar bottlenecks con cProfile, line_profiler, memory_profiler
- Aplicar Numba `@njit` para loops numéricos: 100x speedup sobre Python puro
- Migrar pandas → Polars para DataFrames >1M rows: 25x speedup
- Vectorizar con NumPy: SIMD, broadcasting, einsum
- Usar CuPy para GPU computing (drop-in NumPy replacement)

### Temas de teoría

1. Profiling: cProfile (function-level), line_profiler (line-level), memory_profiler (RAM)
2. Numba `@njit`: compila a LLVM IR, 100x para loops numéricos en arrays NumPy. Cache, fastmath.
3. Polars vs pandas: Rust + Arrow + multithreading. Lazy API con `pl.scan_*`. 25x en groupby/join >1M rows.
4. NumPy vectorization: SIMD (arr*2 vs [x*2 for x in arr]), np.where, np.einsum
5. CuPy: drop-in `import cupy as cp`. 10-100x en ops >10M elementos. Cuidado: PCIe transfer.

### I Do — Demostración guiada (Yo hago)

1. Profiling: cProfile identifica que 80% del tiempo está en un loop. line_profiler confirma.
2. Numba `@njit(cache=True, fastmath=True)` en haversine distance: 100x speedup
3. Migrar pandas groupby → Polars lazy: 25x speedup en 10M rows

### We Do — Práctica guiada (Hacemos juntos)

1. Vectoriza un loop con `np.where` y `np.einsum` (10x speedup sin cambiar algoritmo)
2. Migra un notebook pandas a Polars y mide speedup + memory reduction

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Performance Optimization Case Study — Toma un script lento (propio o de GitHub), perfila, identifica bottlenecks, aplica 2+ optimizations (Numba, Polars, NumPy vectorization, CuPy). Documenta antes/después: tiempo, memoria, speedup. Es el tipo de caso de estudio que se presenta en architecture reviews.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `profiling-cprofile` | Aplicar | cProfile: function-level. line_profiler: line-level. Siempre perfil ANTES de optimizar. 80% del tiempo en 20% del código. |
| 2 | `numba-njit-jit` | Aplicar | `@njit` compila Python puro a LLVM IR. 100x para loops numéricos en arrays. NO funciona con pandas (object mode fallback). |
| 3 | `polars-lazy-api` | Aplicar | Polars: Rust + Arrow + multithreading. Lazy API (`pl.scan_*`) optimiza query plan. 25x sobre pandas en groupby/join >1M rows. |
| 4 | `numpy-vectorization` | Aplicar | SIMD: `arr*2` (vectorizado) vs `[x*2 for x in arr]` (loop). np.where para condicionales. np.einsum para tensores. |
| 5 | `cupy-gpu-computing` | Analizar | CuPy: drop-in NumPy en GPU. 10-100x en ops >10M elementos. Cuidado: PCIe transfer domina para arrays pequeños. |

#### Ejemplo de variantes

Para `numba-njit-jit`:

- **V1**: "Tu función calcula haversine distance en un loop de 1M puntos. ¿Numba o NumPy vectorization?" — ambos, Numba más flexible para lógica compleja
- **V2**: "Tu función @njit llama pandas methods. ¿Funciona?" — NO (object mode fallback, más lento que Python puro)
- **V3**: "Primera llamada a función @njit tarda 5s, segunda 0.001s. ¿Por qué?" — compilación JIT en primera llamada, cache=True persiste

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué hace cProfile?
2. ¿Cuándo Numba NO acelera?
3. ¿Por qué Polars es más rápido que pandas?
4. ¿Qué es vectorización en NumPy?
5. ¿Cuándo CuPy NO es más rápido que NumPy?

### Recursos principales

- Numba — Documentation
- Polars — User guide
- CuPy — Documentation
- "High Performance Python" (Micha Gorelick)
- Python — cProfile docs

---

## 39. Proyecto Integrador Fase 2

> **Tagline**: Un sistema de IA Senior que cualquier startup querría contratar para construir
> **Nivel**: Senior · **Horas estimadas**: 18h · **Ícono**: Trophy

### Relevancia laboral

Capstone Senior que demuestra capacidad de diseñar y operar sistemas AI end-to-end a nivel Senior. Diferenciador claro para roles Senior AI Engineer ($130K-$180K USD remote). Es el proyecto que se presenta como caso de estudio principal en entrevistas de sistema.

### Objetivos de aprendizaje

- Integrar multi-agent LangGraph (S28) coordinando tareas automáticamente
- Construir MLOps pipeline (S29) con monitoreo de drift y retraining automático
- Desplegar en Kubernetes (S32) con CI/CD y observabilidad
- Implementar streaming Kafka (S31) para eventos en tiempo real
- Integrar Smart CV module (S34) con análisis LLM de imágenes
- Documentar ADR (S35) para las principales decisiones arquitecturales
- Desplegar sistema completamente en la nube (GCP/AWS free tier)
- Comunicar arquitectura a stakeholders de negocio con presentation deck de 10 slides

### Temas de teoría

1. Arquitectura del sistema integrador Senior
2. CI/CD con canary deployment y auto-rollback
3. Comunicación técnica a stakeholders no técnicos

### I Do — Demostración guiada (Yo hago)

1. Diseñar arquitectura completa: Kafka + FastAPI + XGBoost + MLflow + Prometheus + Grafana + Streamlit
2. Implementar canary deployment con K8s: 5% → 25% → 100% con auto-rollback si drift >10%
3. Crear presentation deck de 10 slides explicando arquitectura a stakeholder de negocio

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa Smart CV module: sube foto CV → YOLO detecta secciones → Tesseract extrae → LLM estructura
2. Documenta 3 ADRs: K8s vs ECS, Kafka vs SQS, XGBoost vs LightGBM

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: End-to-End AI Platform Senior — evolución del proyecto integrador de Fase 1 con capacidades senior. Componentes adicionales: Multi-agent LangGraph (S28), MLOps pipeline (S29), Kubernetes deployment (S32), Streaming Kafka (S31), Smart CV module (S34), ADR documentado (S35). Entregables: sistema completamente deployado en la nube, architecture diagram con Mermaid, presentation deck de 10 slides.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 3 |
| Preguntas por intento | 3 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 3 correctas — todas requeridas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `senior-architecture-tradeoffs` | Analizar | Integrar 7+ servicios Senior (multi-agent, MLOps, K8s, Kafka, CV, ADR) requiere trade-offs en: consistencia vs latencia, costo vs performance, simplicidad vs escalabilidad. |
| 2 | `canary-cicd-rollback` | Aplicar | CI/CD con canary: build → test → deploy canary 5% → monitor → promote 100% o auto-rollback. Requiere metrics + alerting + decision automática. |
| 3 | `stakeholder-communication` | Aplicar | Senior debe comunicar arquitectura a no-técnicos: 10 slides, sin jargon, business impact primero, diagramas simples. Es lo que diferencia Senior de Mid en entrevistas. |

#### Ejemplo de variantes

Para `senior-architecture-tradeoffs`:

- **V1**: "Tu sistema necesita consistencia fuerte entre Kafka y PostgreSQL. ¿Cómo la logras?" — exactly-once semantics + transactional outbox pattern
- **V2**: "¿K8s o AWS ECS para tu sistema de 5 microservicios?" — K8s (portable, ecosystem) si equipo lo conoce, ECS (más simple) si no
- **V3**: "Tu MLOps muestra drift en producción. ¿Re-train inmediato o scheduled?" — depende de severidad; crítico → inmediato, leve → scheduled

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué trade-offs consideras al diseñar arquitectura Senior?
2. ¿Cómo implementas canary con auto-rollback?
3. ¿Cómo comunicas arquitectura a stakeholders de negocio?

### Recursos principales

- "Designing ML Systems" (Huyen Chip)
- Kubernetes — Documentation
- "Building Evolutionary Architectures" (Ford, Parsons, Kua)
- Google SRE Book
- "Staff Engineer" (Will Larson)

---

## Fase 3 — Master (Secciones 40-52)

> **Objetivo de la fase**: Llevar a un estudiante Senior (S27-S39) al nivel Master, donde puede arquitectar plataformas AI completas: agentic architectures, LLM fine-tuning (QLoRA), GraphRAG, LLMOps, multimodal AI, IaC (Terraform), GPU computing, open source publishing, AI governance, data contracts, tech leadership. El capstone S51 integra todo en una plataforma Agentic completa.
>
> **Horas totales fase 3**: 160h · **Prerrequisito**: haber aprobado Fase 2 (S27-S39) o demostrar equivalencia mediante entrevista técnica.

---

## 40. Agentic Architecture

> **Tagline**: Multi-agent systems, A2A communication, orchestración compleja
> **Nivel**: Master · **Horas estimadas**: 12h · **Ícono**: Workflow

### Relevancia laboral

Agentic Architecture es la frontera 2026 en AI. Startups y enterprises usan sistemas multi-agente para research, code review, data analysis, y operaciones autónomas. Master AI Engineer con experiencia en LangGraph + multi-agent cuesta $180K-$250K USD remote. Es la skill más demandada en Y Combinator startups.

### Objetivos de aprendizaje

- Diseñar arquitecturas multi-agent: 2-5 agentes especializados con roles claros
- Implementar agent-to-agent (A2A) communication con message passing
- Manejar shared state entre agentes con LangGraph MessagesState
- Implementar dynamic routing: un agente decide a quién delegar
- Manejar conflictos: qué pasa cuando dos agentes dan respuestas contradictorias
- Evaluar sistemas multi-agent: end-to-end task success, agent coordination quality

### Temas de teoría

1. Multi-agent patterns: hierarchical (supervisor → workers), sequential (chain), parallel (fan-out + reduce)
2. A2A communication: message passing, shared state, event-driven
3. LangGraph multi-agent: StateGraph, subgraphs, Command(goto=...) para routing
4. Dynamic delegation: un agente decide a quién llamar basado en task type
5. Conflict resolution: voting, priority, human escalation

### I Do — Demostración guiada (Yo hago)

1. Implementar sistema 3-agent: Researcher (busca) → Analyst (procesa) → Writer (sintetiza) con LangGraph
2. Agente supervisor que decide a cuál worker delegar basado en query type
3. Manejar conflictos: si Analyst y Researcher discrepan, escalar a human

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa fan-out pattern: 3 agentes paralelos analizan desde distintos ángulos, un reducer sintetiza
2. Crea evaluation harness: mide task success rate y agent coordination quality

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Autonomous Analysis Platform — Plataforma multi-agent que recibe un tema complejo (ej: "Analiza viabilidad de exportar café peruano a Japón"), descompone en sub-tareas, asigna a agentes especializados (market research, legal, logistics, financial), sintetiza en reporte ejecutivo. Debe incluir: 5+ agentes, dynamic routing, conflict resolution, evaluation harness.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `multi-agent-patterns` | Analizar | Hierarchical (supervisor→workers), sequential (chain), parallel (fan-out+reduce). Elegir según task: paralelo para independientes, secuencial para dependientes. |
| 2 | `a2a-communication` | Aplicar | Agent-to-agent: message passing (async) o shared state (sync). Message passing más escalable, shared state más simple. |
| 3 | `langgraph-multi-agent` | Aplicar | StateGraph con subgraphs (cada agente = subgrafo), Command(goto="agent_b", update={...}) para routing dinámico entre agentes. |
| 4 | `dynamic-delegation` | Analizar | Un supervisor agent decide a qué worker delegar basado en query classification. Requiere LLM con classification capability + tool calling. |
| 5 | `conflict-resolution-multi-agent` | Analizar | Cuando 2 agentes discrepan: voting (mayoría), priority (peso por expertise), human escalation (última opción). Sin resolución, sistema se deadlocks. |

#### Ejemplo de variantes

Para `multi-agent-patterns`:

- **V1**: "Tienes 3 tareas independientes (scrape, analyze, format). ¿Qué patrón multi-agent?" — parallel (fan-out + reduce)
- **V2**: "Tu tarea es sequential: research → analyze → write. ¿Patrón?" — sequential chain
- **V3**: "Tienes 1 supervisor y 5 workers especializados. ¿Patrón?" — hierarchical

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuándo usar hierarchical vs sequential multi-agent?
2. ¿Diferencia entre message passing y shared state?
3. ¿Cómo haces routing dinámico en LangGraph multi-agent?
4. ¿Cómo decide un supervisor a quién delegar?
5. ¿Cómo manejas conflictos entre agentes?

### Recursos principales

- LangGraph — Multi-agent systems
- AutoGen — Microsoft multi-agent framework
- CrewAI — Role-based multi-agent
- "Generative AI with LangChain" (Ben Auffarth)
- Andrew Ng — Agentic workflows

---

## 41. LLM Fine-tuning

> **Tagline**: QLoRA, PEFT, dataset curation — customiza LLMs sin GPUs caras
> **Nivel**: Master · **Horas estimadas**: 14h · **Ícono**: Cpu

### Relevancia laboral

Fine-tuning permite customizar LLMs para tareas específicas (legal peruano, medical, financial). QLoRA (4-bit quantization + LoRA adapters) permite fine-tunear modelos 7B-65B en una sola GPU de 24GB. Master AI Engineer con fine-tuning experience cuesta $200K-$300K USD remote. Esencial para startups que no pueden depender solo de OpenAI.

### Objetivos de aprendizaje

- Entender QLoRA: 4-bit NF4 quantization + LoRA adapters, fine-tunear 65B en 48GB GPU
- Preparar dataset: format (instruction/input/output), deduplicación, quality filter
- Implementar fine-tuning con TRL SFTTrainer + PEFT
- Evaluar con benchmarks: perplexity, human eval, task-specific metrics
- Merge adapter con modelo base para serving con vLLM
- Avoid catastrophic forgetting: blending con general data

### Temas de teoría

1. QLoRA math: 4-bit NF4 quant + LoRA low-rank adapters. Solo adapters se entrenan (~50MB vs 13GB base).
2. PEFT library: LoraConfig, target_modules (q_proj, k_proj, v_proj, o_proj), r=16, alpha=32
3. Dataset curation: Alpaca format, deduplicación con MinHash, quality filter con reward model
4. TRL SFTTrainer: Supervised Fine-Tuning, packing, learning rate scheduling
5. Evaluation: perplexity (lower=better), human eval (Elo rating), task-specific (BLEU, ROUGE)
6. Catastrophic forgetting: mezclar task data con general data (ej: 50% legal + 50% OpenOrca)

### I Do — Demostración guiada (Yo hago)

1. Preparar dataset de QA legal peruano (1K ejemplos) en formato instruction/input/output
2. QLoRA fine-tuning de Mistral-7B con LoRA r=16, alpha=32, target_modules all linear
3. Evaluar: perplexity 1.8 (vs 2.5 base), human eval muestra mejores respuestas legales

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa deduplicación con MinHash: remueve 15% ejemplos redundantes
2. Mide catastrophic forgetting: benchmark general MMLU antes/después del fine-tuning

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Domain-Specialized LLM — Fine-tunea Mistral-7B (o Llama-3-8B) en un dominio específico (legal peruano, medical español, financial LATAM). Entregables: dataset curado (1K+ ejemplos), script de fine-tuning QLoRA reproducible, evaluación comparativa vs base model, adapter mergeado listo para servir con vLLM.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `qlora-4bit-mechanics` | Analizar | QLoRA: quantiza base model a 4-bit NF4 (4GB para 7B), entrena solo LoRA adapters (~50MB). Permite fine-tunear 65B en 48GB GPU. |
| 2 | `peft-lora-config` | Aplicar | LoraConfig: r=16 (rank), alpha=32 (scaling), target_modules (q,k,v,o proj). r más alto = más capacidad pero más overfitting. |
| 3 | `dataset-curation-sft` | Aplicar | Alpaca format: {instruction, input, output}. Deduplicar con MinHash. Quality filter con reward model. 1K-100K ejemplos ideal. |
| 4 | `catastrophic-forgetting` | Analizar | Fine-tuning destruye conocimiento general del modelo. Mitigación: mezclar 50% task data + 50% general data (OpenOrca). |
| 5 | `adapter-merge-serving` | Aplicar | Para serving con vLLM, merge adapter con base: `peft.merge_and_unload()`. Si no merges, 2x runtime overhead. |

#### Ejemplo de variantes

Para `qlora-4bit-mechanics`:

- **V1**: "¿Cuánta VRAM necesitas para fine-tunear Mistral-7B con QLoRA?" — ~16GB (RTX 4080)
- **V2**: "¿Y sin QLoRA (full fine-tuning)?" — ~100GB (multiple A100)
- **V3**: "¿Por qué QLoRA usa 4-bit NF4 y no 8-bit?" — NF4 es óptimo para pesos (distribución normal), 4-bit ahorra 50% más VRAM que 8-bit

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es QLoRA y qué problema resuelve?
2. ¿Qué hiperparámetros de LoRA son críticos?
3. ¿Cómo curas un dataset para fine-tuning?
4. ¿Qué es catastrophic forgetting y cómo lo evitas?
5. ¿Por qué debes mergear el adapter antes de servir?

### Recursos principales

- QLoRA paper (Dettmers et al., 2023)
- PEFT — HuggingFace documentation
- TRL — Transformer Reinforcement Learning
- Unsloth — 2x faster fine-tuning
- "Build a Large Language Model" (Sebastian Raschka)

---

## 42. GraphRAG

> **Tagline**: Knowledge graphs + vector search — retrieval que entiende relaciones
> **Nivel**: Master · **Horas estimadas**: 12h · **Ícono**: Share2

### Relevancia laboral

GraphRAG combina knowledge graphs (Neo4j) con vector search para retrieval que entiende relaciones semánticas ("empresas co-fundadas por ex-Google employees" es 1 query en graph vs imposible en vector). Master AI Engineer con GraphRAG cuesta $180K-$250K USD. Útil para legal, fraud detection, recommendation.

### Objetivos de aprendizaje

- Modelar knowledge graphs: nodos (entities), edges (relations), properties
- Implementar con Neo4j + Cypher: CREATE, MATCH, WHERE, traversal
- Combinar graph + vector: hybrid retrieval en Neo4j 5.x
- Extraer entidades con LLM + structured outputs (entity recognition + relation extraction)
- Implementar GraphRAG: query → graph traversal + vector search → context enrichment → LLM

### Temas de teoría

1. Knowledge graphs: RDF vs property graphs (Neo4j). Neo4j gana en developer experience.
2. Cypher query language: MATCH (n:Person)-[:WORKS_AT]->(c:Company) RETURN c
3. Hybrid retrieval: vector index finds similar chunks, graph traversal follows relations
4. Entity extraction: LLM with structured outputs → (entity, relation, entity) triples
5. GraphRAG architecture: query → expand via graph → vector search enriched context → LLM

### I Do — Demostración guiada (Yo hago)

1. Modelar knowledge graph de empresas peruanas: Person→WORKS_AT→Company, Company→IN_SECTOR→Sector
2. LLM extrae entidades de 100 noticias: 500 entidades, 200 relaciones, persistir en Neo4j
3. GraphRAG query: "¿Quiénes son los CEOs conectados al sector minero?" — graph traversal + LLM synthesis

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa hybrid retrieval: vector search top-5 chunks + graph expand 2 hops → LLM context
2. Mide calidad vs vector-only RAG: GraphRAG 92% precision vs 78% vector-only

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Knowledge Graph RAG for Peruvian Business News — Pipeline que: (1) scrapea noticias de gestión.pe / Semana Económica, (2) LLM extrae entidades (empresas, personas, sectores), (3) persiste en Neo4j, (4) GraphRAG responde preguntas complejas ("¿Qué empresas del sector minero cambiaron de CEO en 2026?"). Incluye visualización del grafo.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `knowledge-graph-vs-vector` | Analizar | Vector search encuentra similares (semántica). Graph traversal sigue relaciones (estructura). "Empresas co-fundadas por ex-Google" = graph, "documentos sobre IA" = vector. |
| 2 | `cypher-traversal` | Aplicar | Cypher: `MATCH (p:Person)-[:WORKS_AT*2]->(c:Company) RETURN c`. Traversal multi-hop impossible en SQL puro. Neo4j optimizado para esto. |
| 3 | `hybrid-retrieval-neo4j` | Aplicar | Neo4j 5.x soporta vector index + graph en un DB. `db.index.vector.queryNodes` + `MATCH` traversal en una query. |
| 4 | `llm-entity-extraction` | Aplicar | LLM con structured outputs extrae (entity, relation, entity) triples. Pydantic schema garantiza formato. Quality check con human review. |
| 5 | `graphrag-architecture` | Analizar | GraphRAG: query → graph expand (find related entities) + vector search (find similar chunks) → enrich context → LLM synthesis. Supera vector-only en queries relacionales. |

#### Ejemplo de variantes

Para `knowledge-graph-vs-vector`:

- **V1**: "¿Qué tipo de query es mejor con graph que con vector?" — queries relacionales ("quién conoce a quién")
- **V2**: "¿Y con vector que con graph?" — queries semánticas ("documentos sobre topic X")
- **V3**: "¿Por qué GraphRAG combina ambos?" — graph para relaciones, vector para semántica, mejor de ambos mundos

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuándo usar knowledge graph vs vector search?
2. ¿Qué es una traversal multi-hop en Cypher?
3. ¿Cómo combinas graph y vector en Neo4j?
4. ¿Cómo extraes entidades con LLM?
5. ¿Cuál es la arquitectura de GraphRAG?

### Recursos principales

- Neo4j — Documentation
- Cypher — Reference manual
- neo4j-graphrag — Python library
- Microsoft GraphRAG paper (2024)
- "Graph Databases" (Ian Robinson et al.)

---

## 43. LLMOps

> **Tagline**: LangSmith, RAGAS, A/B testing — LLMs en producción con observabilidad
> **Nivel**: Master · **Horas estimadas**: 12h · **Ícono**: Activity

### Relevancia laboral

LLMOps es a LLMs lo que MLOps a ML tradicional. Sin LLMOps, tu RAG parece funcionar en demos pero falla en producción sin que sepas por qué. Empresas data-mature exigen LangSmith tracing + RAGAS evaluation + cost tracking. Master LLMOps Engineer cuesta $180K-$250K USD.

### Objetivos de aprendizaje

- Implementar tracing con LangSmith: cada LLM call, tool call, retriever capture
- Evaluar RAG con RAGAS: faithfulness, answer relevancy, context precision/recall
- A/B testing de prompts: serve 2 versiones, comparar con bootstrap CIs
- Cost tracking: tokens input/output, embeddings, rerankers, $/1K-queries
- Implementar guardrails: input/output filtering, PII detection, toxicity
- Canary deployments de LLMs: 5%→25%→100% con rollback en faithfulness drop

### Temas de teoría

1. LangSmith tracing: @traceable decorator, captures inputs/outputs/latency/tokens
2. RAGAS 4 metrics: faithfulness (grounded in context), answer relevancy, context precision/recall
3. A/B testing prompts: feature flag, log which prompt generated each response, bootstrap CIs
4. Cost tracking: input/output tokens × pricing, embeddings cost, vector DB egress
5. Guardrails: NeMo Guardrails, input/output schema, PII filter, toxicity classifier
6. Canary LLM deployment: route 5% traffic to new prompt/model, auto-rollback if faithfulness drops >10%

### I Do — Demostración guiada (Yo hago)

1. Implementar LangSmith tracing en pipeline RAG: ver full chain en UI con latency por step
2. RAGAS evaluation en 100 QA pairs: faithfulness 0.87, answer relevancy 0.91, context precision 0.83
3. A/B test 2 prompts: 200 responses cada uno, bootstrap CI muestra prompt B 8% mejor en relevancy

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa cost tracking: log $/1K-queries, identifica que embeddings son 40% del costo
2. Configura guardrail: PII detection en input, si detecta DNI peruano, rechaza con mensaje

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Production RAG with LLMOps — Sistema RAG completo con: LangSmith tracing, RAGAS evaluation automatizada semanal, A/B testing de prompts, cost dashboard, guardrails (PII + toxicity), canary deployment de nuevas versiones. Debe incluir alertas Slack si faithfulness baja >5% o costo sube >20%.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `langsmith-tracing` | Aplicar | LangSmith @traceable captura cada LLM call, tool, retriever con latency + tokens. Visualiza full chain. Free tier 5K traces/mes. |
| 2 | `ragas-4-metrics` | Aplicar | Faithfulness (respuesta grounded in context), answer relevancy, context precision (chunks útiles), context recall (todos relevantes). Reference-free except context_recall. |
| 3 | `ab-testing-prompts-bootstrap` | Aplicar | A/B test: feature flag sirve prompt A o B, log which, compara RAGAS con bootstrap CIs (no raw means, small samples ruidosos). |
| 4 | `cost-tracking-llm` | Analizar | Cost = input tokens × $X + output tokens × $Y + embeddings + vector DB egress. Sin tracking, surprise bills. LangSmith cost o OpenMeter. |
| 5 | `guardrails-llm` | Aplicar | Guardrails: input filter (PII, prompt injection), output filter (toxicity, schema validation). NeMo Guardrails framework. |

#### Ejemplo de variantes

Para `ragas-4-metrics`:

- **V1**: "Tu RAG responde correctamente pero no usa el context. ¿Qué métrica RAGAS falla?" — faithfulness (low)
- **V2**: "Tu RAG usa context pero la respuesta no responde la pregunta. ¿Qué métrica falla?" — answer relevancy (low)
- **V3**: "Tu RAG recupera 10 chunks pero solo 2 son útiles. ¿Qué métrica es baja?" — context precision (low)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué captura LangSmith tracing?
2. ¿Qué mide faithfulness en RAGAS?
3. ¿Cómo haces A/B testing de prompts?
4. ¿Qué componentes del costo LLM debes trackear?
5. ¿Cuándo necesitas guardrails?

### Recursos principales

- LangSmith — Documentation
- RAGAS — GitHub
- NeMo Guardrails — NVIDIA
- Langfuse — Open-source LLMOps
- "Engineering LLM Applications" (Valentina Alto)

---

## 44. Multimodal AI

> **Tagline**: CLIP, Whisper, Vision LLMs — modelos que ven, oyen, y leen
> **Nivel**: Master · **Horas estimadas**: 12h · **Ícono**: Eye

### Relevancia laboral

Multimodal AI es la frontera 2026: modelos que procesan imagen + texto + audio. Casos: medical imaging, content moderation, accessibility, creative tools. Master AI Engineer con multimodal cuesta $200K-$280K USD. Apple Vision Pro, GPT-4o, Gemini todos son multimodal.

### Objetivos de aprendizaje

- Implementar CLIP: zero-shot classification, image-text matching, multimodal embeddings
- Usar Whisper para speech-to-text: transcripción multi-idioma, word-level timestamps
- Implementar Vision LLMs (GPT-4o Vision, LLaVA): image understanding + Q&A
- Construir multimodal RAG: index images with CLIP, retrieve by text query, generate with Vision LLM
- Optimizar para producción: batch inference, GPU utilization, model quantization

### Temas de teoría

1. CLIP: joint text+image embedding space, cosine similarity, zero-shot classification
2. Whisper: 99 languages, large-v3 for accuracy, word_timestamps for word-level
3. Vision LLMs: GPT-4o Vision (API), LLaVA (open-source), Qwen-VL (Chinese+English)
4. Multimodal RAG: index images with CLIP embeddings, retrieve by text, pass to Vision LLM
5. Production optimization: batch inference, flash attention, quantization (4-bit, 8-bit)

### I Do — Demostración guiada (Yo hago)

1. CLIP zero-shot classification: clasificar 1000 imágenes en 10 categorías sin entrenar
2. Whisper transcription: 1h de audio español → texto con timestamps word-level, 95% WER
3. Multimodal RAG: index 500 PDFs con imágenes usando CLIP, query "diagramas de arquitectura" → retrieves relevantes

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa Vision LLM Q&A: sube imagen de factura, pregunta "¿cuál es el monto total?"
2. Optimiza batch inference: 100 imágenes en 10s con flash attention + 4-bit quant

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Multimodal Document Intelligence — Plataforma que procesa PDFs con texto + imágenes + tablas: extrae texto con PyMuPDF, indexa imágenes con CLIP, transcribe audio embebido con Whisper, responde queries con Vision LLM. Debe manejar 1000+ PDFs, multimodal RAG, y dashboard Streamlit para queries.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `clip-zero-shot` | Aplicar | CLIP encodea texto e imagen en espacio vectorial compartido. Zero-shot: encode class names as text, compare with image embedding, argmax = predicted class. |
| 2 | `whisper-transcription` | Aplicar | Whisper large-v3: 99 languages, word_timestamps=True for word-level. Para español, WER 5-8%. Mejor que soluciones comerciales 2024. |
| 3 | `vision-llm-gpt4o` | Aplicar | GPT-4o Vision: pasa imagen + pregunta, responde. Para Q&A sobre facturas, diagrams, screenshots. Más caro que OCR pero entiende semántica. |
| 4 | `multimodal-rag` | Analizar | Index images con CLIP embeddings. Query → embed text → retrieve images → pass to Vision LLM with text. Critical for PDFs con diagrams que text-RAG miss. |
| 5 | `multimodal-production-opt` | Analizar | Batch inference (10x throughput), flash attention (2x speedup), 4-bit quant (4x VRAM reduction). Sin esto, inference es prohibitivamente costoso. |

#### Ejemplo de variantes

Para `clip-zero-shot`:

- **V1**: "Clasificas 1000 imágenes en 10 categorías sin training data. ¿Cómo?" — CLIP zero-shot (encode class names + images, compare)
- **V2**: "CLIP fue entrenado en inglés. ¿Funciona bien con labels en español?" — subóptimo, traduce labels o fine-tune
- **V3**: "¿Por qué CLIP es mejor que entrenar un classifier from scratch?" — zero-shot, no necesitas data labeled

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué permite CLIP que un classifier tradicional no?
2. ¿Qué features tiene Whisper large-v3?
3. ¿Cuándo usar GPT-4o Vision vs OCR tradicional?
4. ¿Cómo implementas multimodal RAG?
5. ¿Cómo optimizas inference multimodal en producción?

### Recursos principales

- OpenAI — CLIP paper
- OpenAI — Whisper
- OpenAI — GPT-4o Vision
- LLaVA — Open-source vision LLM
- HuggingFace — Multimodal models

---

## 45. Infrastructure as Code

> **Tagline**: Terraform, ArgoCD, FinOps — infra reproducible y costo controlado
> **Nivel**: Master · **Horas estimadas**: 12h · **Ícono**: Cloud

### Relevancia laboral

IaC es non-negotiable en producción Senior/Master. Empresas data-mature no permiten clicks manuales en AWS console. Terraform + ArgoCD + FinOps son la trifecta de infra moderna. Master Engineer con IaC cuesta $200K-$280K USD. Sin FinOps, cloud bills explotan.

### Objetivos de aprendizaje

- Escribir Terraform para AWS/GCP: VPC, EC2/EKS, RDS, S3, IAM roles
- Implementar GitOps con ArgoCD: Git es source of truth, ArgoCD reconcilia cluster
- Manejar state de Terraform: remote backend (S3 + DynamoDB lock), workspaces
- Implementar FinOps: Kubecost, AWS Cost Optimization Hub, $/training-run, $/1K-inferences
- Automatizar GPU clusters: spot instances, auto-terminate, queue con KEDA

### Temas de teoría

1. Terraform basics: resource, provider, state, plan/apply/destroy
2. Terraform state: remote backend (S3+DynamoDB), workspaces (dev/staging/prod), import existing
3. ArgoCD GitOps: Application CRD, sync policies, self-heal, rollback con git revert
4. FinOps: Kubecost (per-namespace), AWS Cost Optimization Hub, tag-based cost allocation
5. GPU automation: spot instances (60-70% discount), auto-terminate user_data, KEDA for scaling

### I Do — Demostración guiada (Yo hago)

1. Terraform: levantar EKS cluster + RDS + S3 + IAM roles en 1 comando `terraform apply`
2. ArgoCD: deploy app via GitOps (push a Git → ArgoCD detecta → sync to cluster)
3. FinOps: Kubecost dashboard muestra $/namespace, identifica ML training como 60% del costo

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa GPU spot instance con auto-terminate: training job termina → instance se apaga
2. Configura KEDA scaling on Kafka lag: 0 replicas cuando no hay trabajo, 10 cuando hay backlog

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Production IaC for ML Platform — Repositorio Terraform completo para plataforma ML: EKS, RDS, S3, IAM, VPC. ArgoCD GitOps para deployments. Kubecost + AWS Cost Hub para FinOps. Documenta $/training-run y $/1K-inferences. Incluye runbook para灾难 recovery.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `terraform-state-management` | Aplicar | Terraform state: remote backend (S3 + DynamoDB lock para concurrent safety), workspaces (dev/staging/prod aislados), import para resources existentes. |
| 2 | `argocd-gitops` | Aplicar | ArgoCD: Git es source of truth. Application CRD define qué deployar. Sync policies: auto vs manual. Self-heal: si alguien cambia cluster manualmente, ArgoCD revierte. |
| 3 | `finops-cost-tracking` | Analizar | Kubecost: per-namespace GPU cost. AWS Cost Optimization Hub: idle resources. Tag-based: cost_center tag permite chargeback a teams. Sin FinOps, cloud bills sorpresa. |
| 4 | `gpu-spot-instances` | Aplicar | Spot instances: 60-70% discount, pueden ser terminadas con 2min notice. Ideal para training fault-tolerant. SIEMPRE user_data shutdown hook para auto-terminate. |
| 5 | `keda-event-driven-scaling` | Aplicar | KEDA scales K8s 0→N en Kafka lag, SQS depth, Prometheus metric. HPA solo CPU/RAM (useless for ML GPU-bound). KEDA scales on business metrics. |

#### Ejemplo de variantes

Para `gpu-spot-instances`:

- **V1**: "p4d.24xlarge on-demand cuesta $32/h. ¿Cuánto con spot?" — ~$10/h (60-70% discount)
- **V2**: "Tu training job en spot puede ser interrumpido. ¿Cómo lo haces fault-tolerant?" — checkpointing periódico + resume desde último checkpoint
- **V3**: "¿Por qué NO usar spot para serving de LLM en producción?" — latencia no puede tolerar 2min termination + restart

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Por qué Terraform state debe ser remote?
2. ¿Qué ventaja tiene ArgoCD sobre kubectl apply?
3. ¿Qué es FinOps y por qué importa?
4. ¿Cuándo usar spot instances y cuándo no?
5. ¿Por qué KEDA sobre HPA para ML workloads?

### Recursos principales

- Terraform — Documentation
- ArgoCD — GitOps docs
- Kubecost — Documentation
- AWS Cost Optimization Hub
- KEDA — Event-driven scaling

---

## 46. GPU Computing

> **Tagline**: CuPy, PyTorch DDP, vLLM — maximiza GPUs para ML
> **Nivel**: Master · **Horas estimadas**: 14h · **Ícono**: Cpu

### Relevancia laboral

GPU computing es esencial para LLMs y deep learning. Master ML Engineer que sabe PyTorch DDP + vLLM + CuPy cuesta $220K-$300K USD. Sin estas skills, no puedes servir LLMs en producción costo-eficientemente.

### Objetivos de aprendizaje

- Usar CuPy como drop-in NumPy en GPU (10-100x para ops >10M elementos)
- Implementar PyTorch DistributedDataParallel (DDP) para multi-GPU training
- Servir LLMs con vLLM: PagedAttention, continuous batching, 2-4x throughput
- Optimizar GPU utilization: profiling con nvprof, mixed precision, gradient checkpointing
- Manejar mixed precision: fp16/bf16 + GradScaler para evitar underflow

### Temas de teoría

1. CuPy vs NumPy: drop-in `import cupy as cp`, 10-100x para ops >10M. Cuidado: PCIe transfer.
2. PyTorch DDP: replica model per GPU, splits batch, syncs gradients via NCCL all-reduce. `torchrun --nproc_per_node=4`.
3. vLLM: PagedAttention (gestiona KV cache como memoria virtual), continuous batching, 2-4x vs HF TGI
4. Mixed precision: fp16 (cuidado underflow), bf16 (mejor rango), GradScaler para fp16
5. Gradient checkpointing: trade compute for memory, permite batch más grande en GPU limitada

### I Do — Demostración guiada (Yo hago)

1. CuPy benchmark: matrix multiply 5000x5000, NumPy 2.1s → CuPy 0.05s (42x)
2. PyTorch DDP: train ResNet en 4 GPUs, speedup 3.6x (perfecto sería 4x)
3. vLLM serving: Mistral-7B, 200 req/s vs 50 req/s con HF transformers (4x)

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa mixed precision training con GradScaler: 2x speedup, cuidado con underflow
2. Gradient checkpointing en LLM: 60% menos VRAM, 20% más lento, permite batch 4x más grande

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Production LLM Serving — Servir Mistral-7B (o Llama-3-8B) con vLLM: continuous batching, tensor parallelism, mixed precision. Benchmark: throughput, latency p99, cost/1K-tokens. Compara vs HF transformers + TGI. Documenta optimal config para tu hardware.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `cupy-numpy-gpu` | Aplicar | CuPy: drop-in NumPy en GPU. 10-100x para ops >10M elementos. Cuidado: PCIe transfer domina para arrays pequeños (keep data on GPU). |
| 2 | `pytorch-ddp-multi-gpu` | Aplicar | DDP: replica model per GPU, splits batch, syncs gradients via NCCL all-reduce. Launch: `torchrun --nproc_per_node=4 train.py`. Evitar legacy DataParallel (GIL-bound). |
| 3 | `vllm-paged-attention` | Aplicar | vLLM PagedAttention: gestiona KV cache como memoria virtual (pages). Continuous batching: 100s concurrent, sub-second TTFT. 2-4x vs HF TGI. |
| 4 | `mixed-precision-gradscaler` | Analizar | Mixed precision (fp16/bf16): 2x speedup + 50% VRAM. fp16 risk underflow (GradScaler fixes). bf16 no necesita scaler pero menos GPUs lo soportan. |
| 5 | `gradient-checkpointing` | Analizar | Gradient checkpointing: recomputa activations en backward en vez de guardarlas. Trade: 60% menos VRAM, 20% más lento. Permite batch 4x más grande en GPU limitada. |

#### Ejemplo de variantes

Para `vllm-paged-attention`:

- **V1**: "vLLM logra 2-4x throughput vs HF TGI. ¿Cómo?" — PagedAttention (KV cache como memoria virtual) + continuous batching
- **V2**: "Tu LLM serving tiene 50 req/s. Con vLLM esperas?" — 100-200 req/s (2-4x)
- **V3**: "¿Cuándo NO usar vLLM?" — modelos muy custom (architecture no soportada), o casos donde batch=1 (vLLM brilla en batch)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuándo CuPy NO es más rápido que NumPy?
2. ¿Por qué DDP sobre DataParallel?
3. ¿Qué es PagedAttention en vLLM?
4. ¿Por qué necesitas GradScaler con fp16?
5. ¿Cuándo usar gradient checkpointing?

### Recursos principales

- CuPy — Documentation
- PyTorch — Distributed training
- vLLM — Documentation
- NVIDIA — Mixed precision guide
- HuggingFace — Accelerate library

---

## 47. Open Source & Community

> **Tagline**: pyproject.toml, CI matrix, semver, contributing — de script a paquete profesional
> **Nivel**: Master · **Horas estimadas**: 10h · **Ícono**: Github

### Relevancia laboral

Publicar open source demuestra seniority. Empresas FAANG valoran OSS contributions. Maintainer de paquete PyPI con 100+ stars es signal de Master Engineer. Sin OSS, tu portafolio es invisible. Linus Torvalds, Sebastian Raschka, András Vajda todos son conocidos por OSS.

### Objetivos de aprendizaje

- Configurar pyproject.toml completo: PEP 621, hatchling, dynamic version, optional-dependencies
- Implementar CI matrix: Python 3.10/3.11/3.12 × ubuntu/macos/windows × múltiples dependencias
- Versionar con semver + python-semantic-release (auto-bump desde Conventional Commits)
- Escribir CONTRIBUTING.md, CODE_OF_CONDUCT.md, ISSUE_TEMPLATE, PR_TEMPLATE
- Mantener changelog con Keep a Changelog format
- Manejar releases: GitHub Releases, PyPI trusted publishing, Zenodo DOI

### Temas de teoría

1. PEP 621 pyproject.toml: hatchling, dynamic version (path = src/mypkg/__init__.py)
2. CI matrix GitHub Actions: os × python × deps, cache pip, parallel jobs
3. Semantic versioning: MAJOR.MINOR.PATCH, python-semantic-release from Conventional Commits
4. Community files: CONTRIBUTING.md (how to PR), CODE_OF_CONDUCT (Contributor Covenant), templates
5. Release management: GitHub Releases (changelog auto), PyPI trusted publishing (OIDC, no token), Zenodo DOI for academic citation

### I Do — Demostración guiada (Yo hago)

1. Configurar pyproject.toml completo con hatchling + dynamic version + optional-dependencies (dev, ml, docs)
2. GitHub Actions matrix: Python 3.10/3.11/3.12 × ubuntu/macos/windows, cache pip, 9 parallel jobs
3. python-semantic-release: detects `feat:` → minor bump, `BREAKING CHANGE:` → major, auto-creates GitHub Release + PyPI publish

### We Do — Práctica guiada (Hacemos juntos)

1. Escribe CONTRIBUTING.md: cómo fork, branch naming, PR template, code review process
2. Configura PyPI trusted publishing: OIDC, no API token needed, more secure

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Production-Grade OSS Package — Toma un script útil (tuyo o de curso) y conviértelo en paquete PyPI profesional: pyproject.toml completo, CI matrix, semver auto-release, CONTRIBUTING + CoC, changelog, 80%+ test coverage, README con badges, docs con MkDocs Material. Publícalo a PyPI. Es un signal enorme en entrevistas Senior/Master.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `pyproject-toml-pep621` | Aplicar | PEP 621: [project] en pyproject.toml como single source of truth. hatchling backend. dynamic=["version"] lee de __init__.py. |
| 2 | `ci-matrix-strategy` | Aplicar | GitHub Actions matrix: os × python × deps. `cache: pip` acelera. `fail-fast: false` para ver todos los fallos. 9-12 parallel jobs típico. |
| 3 | `semver-conventional-commits` | Aplicar | Conventional Commits: `feat:` → minor, `fix:` → patch, `BREAKING CHANGE:` → major. python-semantic-release auto-bumps desde commits. |
| 4 | `contributing-coc-templates` | Aplicar | CONTRIBUTING.md: cómo fork, branch, PR. CODE_OF_CONDUCT (Contributor Covenant). ISSUE_TEMPLATE (bug, feature). PR_TEMPLATE (checklist). |
| 5 | `pypi-trusted-publishing` | Analizar | Trusted publishing: OIDC, no API token. GitHub Action pide token temporal a PyPI. Más seguro que token guardado en secrets. |

#### Ejemplo de variantes

Para `semver-conventional-commits`:

- **V1**: "Commit: `feat: add streaming support`. ¿Qué bump?" — MINOR (1.1.0)
- **V2**: "Commit: `fix: handle null in parser`. ¿Qué bump?" — PATCH (1.0.1)
- **V3**: "Commit: `feat!: redesign API` con BREAKING CHANGE. ¿Qué bump?" — MAJOR (2.0.0)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es PEP 621?
2. ¿Cómo configuras CI matrix en GitHub Actions?
3. ¿Cómo se determina el bump desde Conventional Commits?
4. ¿Qué community files debe tener un repo OSS?
5. ¿Qué ventaja tiene PyPI trusted publishing?

### Recursos principales

- PEP 621 — pyproject.toml spec
- Conventional Commits — Spec
- Semantic Versioning — 2.0.0
- python-semantic-release — GitHub
- PyPI — Trusted publishing docs

---

## 48. AI Governance & Ethics

> **Tagline**: EU AI Act, fairness, model cards — IA responsable y compliant
> **Nivel**: Master · **Horas estimadas**: 10h · **Ícono**: Scale

### Relevancia laboral

AI Governance es obligatorio en 2026. EU AI Act (prohibido Feb 2025, high-risk Aug 2026). Empresas que operan en EU deben comply. Perú tiene Ley 29733 + directivas MIMP. Master AI Engineer con governance cuesta $200K-$280K USD. Sin governance, multas hasta 6% revenue global.

### Objetivos de aprendizaje

- Entender EU AI Act 2025: 4 risk tiers (prohibited, high-risk, limited, minimal)
- Implementar fairness metrics con fairlearn: demographic parity, equalized odds
- Generar model cards: Google template, intended use, training data, eval metrics by subgroup
- Auditar modelos con AI Fairness 360 (IBM): bias detection + mitigation
- Documentar data lineage para compliance: de dónde viene cada dato, consentimiento
- Implementar human oversight: HITL para decisiones high-stakes (crédito, hiring)

### Temas de teoría

1. EU AI Act 2025: prohibited (social scoring), high-risk (hiring/credit/biometric), limited (chatbots), minimal
2. Fairness metrics: demographic parity (p diff <0.1), equalized odds (TPR/FPR igual por grupo), calibration
3. fairlearn: MetricFrame, demographic_parity_difference, GridSearch mitigation
4. Model cards: intended use, training data, eval metrics by subgroup, ethical considerations, caveats
5. Human oversight: HITL para high-risk, explainability con SHAP, appeal process

### I Do — Demostración guiada (Yo hago)

1. fairlearn audit: modelo de churn, MetricFrame muestra TPR 0.85 hombres vs 0.65 mujeres (bias)
2. Mitigation con GridSearch: encuentra modelo con demographic parity <0.05, mantiene 80% accuracy
3. Model card completo para modelo de churn: intended use (retención), training data, metrics by gender/region

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa bias detection para modelo de scoring crediticio: disparate impact, statistical parity
2. Crea dashboard Streamlit que muestra fairness metrics por subgroup

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: AI Governance Audit — Audita un modelo real (tuyo o de Kaggle) para compliance: fairness audit con fairlearn, model card completo, data lineage documentation, human oversight plan. Documenta si cumple EU AI Act high-risk requirements y qué gaps existen.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `eu-ai-act-tiers` | Recordar | EU AI Act 2025: prohibited (social scoring), high-risk (hiring/credit/biometric ID), limited (chatbots disclosure), minimal. Prohibited enforced Feb 2025, high-risk Aug 2026. |
| 2 | `fairlearn-metricframe` | Aplicar | fairlearn MetricFrame: compute metrics by subgroup (gender, age, region). demographic_parity_difference >0.1 = bias. GridSearch mitigation. |
| 3 | `model-card-template` | Aplicar | Model card (Google template): intended use, training data, eval metrics by subgroup, ethical considerations, caveats. Required para high-risk EU AI Act. |
| 4 | `bias-mitigation-strategies` | Analizar | Pre-processing (reweight data), in-processing (fair optimization), post-processing (threshold calibration). Trade-off: fairness vs accuracy. |
| 5 | `human-oversight-hitl` | Analizar | High-risk AI requiere human oversight: HITL para decisiones críticas, explainability (SHAP), appeal process. Sin oversight, no cumple EU AI Act high-risk. |

#### Ejemplo de variantes

Para `eu-ai-act-tiers`:

- **V1**: "Tu modelo decide quién obtiene crédito. ¿Qué tier EU AI Act?" — high-risk (credit)
- **V2**: "Tu chatbot de customer service responde consultas. ¿Tier?" — limited (debes disclose que es AI)
- **V3**: "Tu sistema hace scoring social de ciudadanos. ¿Tier?" — prohibited (no permitido bajo ninguna circunstancia)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Cuáles son los 4 tiers del EU AI Act?
2. ¿Cómo detectas bias con fairlearn?
3. ¿Qué debe contener un model card?
4. ¿Cuáles son las 3 estrategias de bias mitigation?
5. ¿Cuándo es obligatorio human oversight?

### Recursos principales

- EU AI Act — Full text
- fairlearn — Documentation
- Model Cards for Model Reporting (Google paper)
- AI Fairness 360 — IBM
- "Weapons of Math Destruction" (Cathy O'Neil)

---

## 49. Data Contracts & Quality

> **Tagline**: Pydantic, Great Expectations, OpenLineage — datos confiables en producción
> **Nivel**: Master · **Horas estimadas**: 10h · **Ícono**: ShieldCheck

### Relevancia laboral

Data contracts es la frontera 2026 en data engineering. Sin contracts, pipelines se rompen cuando upstream cambia schema. Empresas data-mature (Netflix, Uber) adoptan contracts. Master Data Engineer con contracts cuesta $200K-$280K USD. Sin lineage, no puedes debuggear pipelines complejos.

### Objetivos de aprendizaje

- Definir data contracts con Pydantic: schema, validators, custom errors
- Implementar Great Expectations: declarative expectations, suite management, checkpoint validation
- Implementar OpenLineage: emit RunEvents, visualize lineage en Marquez/Dagster
- Manejar schema evolution con Avro + Schema Registry (BACKWARD compatibility)
- Implementar data quality gates: pipeline falla si expectations no se cumplen

### Temas de teoría

1. Data contracts con Pydantic: BaseModel, Field validators, model_validator, model_config
2. Great Expectations: expectations (expect_column_values_to_not_be_null), suites, checkpoints, DataDocs
3. OpenLineage: RunEvent (START/RUNNING/COMPLETE/FAIL), inputs/outputs datasets, Marquez/Airflow integration
4. Schema evolution: Avro + BACKWARD compatibility (new schema reads old data). Schema Registry en CI.
5. Data quality gates: Airflow/Dagster sensor que espera validación GE antes de proceder

### I Do — Demostración guiada (Yo hago)

1. Pydantic contract para transacciones: validar amount >0, currency in [PEN, USD, EUR], transaction_id unique
2. Great Expectations suite: 10 expectations (not_null, unique, range, type), validar 10K rows
3. OpenLineage: emit events desde Airflow DAG, visualizar lineage en Marquez UI

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa schema evolution: avro schema v1 → v2 (añade optional field), valida BACKWARD compatibility
2. Crea data quality gate: pipeline falla si GE suite no pasa, alerta Slack

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Data Quality Platform — Plataforma que: define contracts Pydantic para 3 datasets, valida con GE en cada ETL step, emite OpenLineage events, visualiza lineage en Marquez, alerta en Slack si quality falla. Debe manejar schema evolution con Avro + Schema Registry.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `pydantic-data-contracts` | Aplicar | Pydantic BaseModel define schema + validation. `Model(**row)` rechaza rows inválidos con error explícito. En boundary de pipeline. |
| 2 | `great-expectations-suites` | Aplicar | GE: declarative expectations (expect_column_values_to_not_be_null). Suites = conjunto. Checkpoints = run suite on data. DataDocs = HTML report. |
| 3 | `openlineage-marquez` | Aplicar | OpenLineage: RunEvent (START/RUNNING/COMPLETE/FAIL) with inputs/outputs. Marquez visualizes lineage DAG. Auto-built from Airflow/Dagster. |
| 4 | `avro-schema-evolution` | Analizar | Avro + Schema Registry: BACKWARD (new reads old), FORWARD (old reads new), FULL (both). NEVER delete field (deprecate + drop after N versions). |
| 5 | `data-quality-gates` | Aplicar | Quality gate: pipeline step que valida GE suite, si falla → no procede + alerta. Implementado como Airflow/Dagster task con short-circuit. |

#### Ejemplo de variantes

Para `avro-schema-evolution`:

- **V1**: "Añades un campo opcional a tu Avro schema. ¿Compatible BACKWARD?" — SÍ (new schema reads old data, optional default)
- **V2**: "Eliminas un campo de tu Avro schema. ¿Compatible BACKWARD?" — NO (old data still has it, new schema breaks)
- **V3**: "¿Cómo eliminas un campo Avro sin romper consumers?" — deprecate (mark @deprecated) → wait N versions → drop

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué es un data contract?
2. ¿Qué es una GE suite?
3. ¿Qué captura OpenLineage?
4. ¿Qué es BACKWARD compatibility en Avro?
5. ¿Cómo implementas un data quality gate?

### Recursos principales

- Pydantic — Documentation
- Great Expectations — Docs
- OpenLineage — Specification
- Marquez — Lineage UI
- Confluent Schema Registry — Docs

---

## 50. Tech Leadership & Communication

> **Tagline**: Design docs, postmortems, system design interviews — Senior to Staff
> **Nivel**: Master · **Horas estimadas**: 10h · **Ícono**: Users

### Relevancia laboral

Tech Leadership es lo que separa Senior de Staff/Principal. Empresas FAANG promueven basado en impact, no solo código. Staff Engineer escribe design docs, dirige postmortems, hace system design interviews. Sin leadership skills, te quedas Senior para siempre. $250K-$400K USD para Staff.

### Objetivos de aprendizaje

- Escribir design docs: Context, Goals/Non-Goals, Proposed Design, Alternatives, Timeline, Risks
- Liderar blameless postmortems: Timeline, Impact, Root Cause (5 whys), Action Items
- Ejecutar system design interviews: clarify reqs (5m), back-of-envelope (5m), high-level (15m), deep dive (15m), trade-offs (5m)
- Comunicar a stakeholders no técnicos: 10-slide deck, sin jargon, business impact primero
- Mentor engineers: 1:1s, code review culture, technical career ladders

### Temas de teoría

1. Design docs: Context, Goals/Non-Goals, Proposed Design (with alternatives), Timeline, Risks. 6-8 pages, 48h comment period.
2. Blameless postmortems (Google SRE): Timeline (facts only), Impact (users/$/SLA), Root Cause (5 whys), Action Items (owners + due dates)
3. System design interviews: 45min format, 5 stages. Practice en techniques.systemdesign.dev
4. Stakeholder communication: 10-slide deck, business problem first, architecture diagram simple, ROI/cost
5. Mentorship: 1:1 structure, code review best practices, career ladders (Senior → Staff → Principal)

### I Do — Demostración guiada (Yo hago)

1. Escribir design doc completo para "Real-time Recommendation System": 6 páginas, alternatives, risks
2. Liderar blameless postmortem de incidente real (ej: API caída 23min): timeline, root cause, action items
3. Ejecutar mock system design interview: "Diseña Twitter" en 45 min

### We Do — Práctica guiada (Hacemos juntos)

1. Escribe tu propio design doc para un proyecto en curso
2. Practica system design interview: "Diseña un sistema de URL shortener"

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Staff-Level Technical Artifacts — Portfolio de artifacts que demuestran leadership: (1) 2 design docs completos (6+ páginas cada uno), (2) 1 blameless postmortem, (3) recording de system design interview (mock), (4) presentation deck de 10 slides para stakeholder no técnico. Es lo que muestras en entrevistas Staff/Principal.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 12-18 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `design-doc-structure` | Aplicar | Design doc: Context, Goals/Non-Goals, Proposed Design (with alternatives), Timeline, Risks. 6-8 páginas. 48h comment period antes de approval. |
| 2 | `blameless-postmortem-5whys` | Aplicar | Blameless (Google SRE): focus on systems, not people. Timeline (facts only), Impact (users/$/SLA), Root Cause (5 whys), Action Items (owners + due dates). |
| 3 | `system-design-interview-format` | Aplicar | 45min: clarify reqs (5m), back-of-envelope (5m), high-level design (15m), deep dive (15m), trade-offs (5m). Practice en techniques.systemdesign.dev. |
| 4 | `stakeholder-communication` | Analizar | Stakeholder no técnico: 10 slides, business problem primero, architecture diagram simple (no arrows everywhere), ROI/cost. Sin jargon. |
| 5 | `mentorship-career-ladders` | Analizar | Mentorship: 1:1 structured (career + technical + blockers), code review culture (kind + specific), career ladders (Senior → Staff → Principal with criteria). |

#### Ejemplo de variantes

Para `blameless-postmortem-5whys`:

- **V1**: "API cae 23min. Postmortem blameless. ¿Qué evitas?" — culpar a personas ("Juan deployó el bug")
- **V2**: "5 Whys: API cae → DB pool agotado → ¿por qué?" → query sin índice → ¿por qué?" → migration no creó índice → ¿por qué?" → CI no valida migrations
- **V3**: "Action item del postmortem: 'Add CREATE INDEX CONCURRENTLY'. ¿Le falta algo?" — owner + due date (sin eso, nunca se hace)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué secciones tiene un design doc?
2. ¿Qué significa "blameless" en postmortems?
3. ¿Cuál es la estructura de una system design interview?
4. ¿Cómo comunicas arquitectura a un CEO no técnico?
5. ¿Qué hace un buen mentor?

### Recursos principales

- "Staff Engineer" (Will Larson)
- Google SRE Book — Postmortems
- "System Design Interview" (Alex Xu)
- "The Manager's Path" (Camille Fournier)
- techniques.systemdesign.dev — Practice

---

## 51. Proyecto Integrador Final

> **Tagline**: La plataforma agentic completa — tu tesis de Master
> **Nivel**: Master · **Horas estimadas**: 18h · **Ícono**: Trophy

### Relevancia laboral

Capstone Master que integra TODAS las habilidades del curso en una plataforma Agentic completa. Es el proyecto principal del portafolio, el que muestras primero en entrevistas Master/Staff. Diferenciador claro para roles Staff AI Engineer ($250K-$400K USD remote). Es el equivalente a una tesis de Master.

### Objetivos de aprendizaje

- Integrar multi-agent LangGraph (S28, S40) coordinando tareas en plataforma agentic
- Implementar QLoRA fine-tuning (S41) para especializar LLM en dominio
- Construir GraphRAG (S42) para retrieval relacional
- Implementar LLMOps completo (S43): tracing, RAGAS, A/B, cost, guardrails
- Servir con vLLM (S46) optimizado para producción
- Desplegar con Terraform + ArgoCD (S45) en K8s
- Documentar ADRs (S35) y model cards (S48)
- Comunicar a stakeholder con design doc + presentation (S50)

### Temas de teoría

1. Arquitectura de plataforma agentic completa
2. Integración de componentes Master
3. Comunicación técnica a stakeholders C-level

### I Do — Demostración guiada (Yo hago)

1. Diseñar arquitectura completa: LangGraph multi-agent + QLoRA + GraphRAG + vLLM + K8s
2. Implementar 2 agentes: Researcher (con GraphRAG) + Writer (con QLoRA fine-tuned)
3. Crear presentation deck de 10 slides para VP of Engineering

### We Do — Práctica guiada (Hacemos juntos)

1. Implementa LLMOps: LangSmith tracing + RAGAS semanal + canary deployment
2. Escribe 3 ADRs: vLLM vs TGI, QLoRA vs full fine-tune, Neo4j vs Postgres for GraphRAG

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Agentic Platform Master — Plataforma completa que integra: multi-agent LangGraph, QLoRA fine-tuned LLM, GraphRAG con Neo4j, LLMOps con LangSmith, vLLM serving, K8s deployment con Terraform, ADRs, model card, design doc, presentation deck. Es el proyecto que define tu carrera Master.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 3 |
| Preguntas por intento | 3 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (3 de 3 correctas — todas requeridas) |
| Tiempo estimado | 15-20 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `master-platform-integration` | Analizar | Integrar 10+ componentes Master (multi-agent, QLoRA, GraphRAG, LLMOps, vLLM, K8s, Terraform, ArgoCD, ADRs, model cards) requiere trade-offs profundos en arquitectura. |
| 2 | `production-llmops-e2e` | Aplicar | LLMOps end-to-end: tracing (LangSmith), evaluation (RAGAS), A/B (bootstrap CIs), cost tracking, guardrails, canary. Sin uno solo, sistema no es production-ready. |
| 3 | `stakeholder-c-level-comms` | Aplicar | Comunicar plataforma Agentic a C-level (CEO/CTO): 10 slides, business impact primero, arquitectura simplificada, ROI/costo. Es lo que diferencia Master de Senior. |

#### Ejemplo de variantes

Para `master-platform-integration`:

- **V1**: "Tu plataforma usa QLoRA fine-tuned LLM + GraphRAG. ¿Cómo los integras?" — GraphRAG retrieves context, QLoRA LLM generates response with that context
- **V2**: "¿vLLM o TGI para servir tu QLoRA LLM?" — vLLM (PagedAttention, mejor throughput) si architecture soportada
- **V3**: "Tu GraphRAG usa Neo4j. ¿Cómo lo deployas en K8s?" — Neo4j Helm chart + persistent volumes + backup strategy

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué componentes Master integras en una plataforma Agentic?
2. ¿Qué elementos de LLMOps son críticos en producción?
3. ¿Cómo comunicas tu plataforma a un C-level?

### Recursos principales

- "Designing Data-Intensive Applications" (Martin Kleppmann)
- "Staff Engineer" (Will Larson)
- "Building Microservices" (Sam Newman)
- LangGraph — Multi-agent docs
- vLLM — Production serving

---

## 52. Career Strategy & Job Search

> **Tagline**: Portfolio, CV, interviews, salary negotiation — de Master a empleo top
> **Nivel**: Master · **Horas estimadas**: 8h · **Ícono**: Briefcase

### Relevancia laboral

Career Strategy es lo que separa un Master Engineer que consigue $250K USD de uno que se queda en $80K. Portfolio site, CV ATS-optimized, networking en conferencias, salary negotiation. Sin estas skills, tu conocimiento técnico no se monetiza.

### Objetivos de aprendizaje

- Construir portfolio site profesional: 3-5 proyectos con live demos + GitHub + business metrics
- Escribir CV ATS-optimized: single column, no tables, keyword overlap con JD ~70%
- Networking en conferencias: PyCon LATAM, Khipu.ai, SciPy. Pre-evento + post-evento LinkedIn
- Preparar entrevistas: behavioral (STAR), technical (LeetCode medium), system design
- Salary negotiation: Levels.fyi data, multiple offers, anchoring, never accept first offer

### Temas de teoría

1. Portfolio site: 3-5 proyectos, live demos (Vercel/Streamlit Cloud), GitHub README, business metrics
2. CV ATS: single column, standard fonts, PDF only, keyword mirror JD, quantify achievements
3. Networking: PyCon LATAM, Khipu.ai (Peru ML), SciPy. Pre-evento stalk speakers, post-evento LinkedIn request
4. Interview prep: behavioral (STAR: Situation/Task/Action/Result), technical (LeetCode 75), system design (Alex Xu)
5. Salary negotiation: Levels.fyi research, multiple offers leverage, anchor high, total comp (base+equity+bonus)

### I Do — Demostración guiada (Yo hago)

1. Construir portfolio site con Next.js: 3 proyectos (capstone S13, S26, S39/51) con live demos + GitHub + impact metrics
2. CV ATS-optimized: single column, PDF, quantify achievements ("reduced churn 15%, saved S/2M")
3. Mock interview: behavioral STAR para "Cuéntame de un proyecto desafiante"

### We Do — Práctica guiada (Hacemos juntos)

1. LinkedIn profile optimization: headline con keywords, summary con story, featured posts
2. Practice salary negotiation: "Tengo otra oferta por X, pueden igualar?"

### You Do — Proyecto de portafolio (Tú haces)

**Proyecto**: Career Launch Kit — Kit completo para lanzar tu carrera Master: (1) portfolio site con 3+ capstones publicados, (2) CV ATS-optimized con 3 versiones (junior/mid/senior), (3) LinkedIn profile optimized, (4) 5 STAR stories escritas, (5) salary negotiation script. Es lo que te consigue el trabajo Master.

### Auto-evaluación — Requisitos detallados del examen

| Parámetro | Valor |
|-----------|-------|
| Conceptos evaluados | 5 |
| Preguntas por intento | 5 (1 por concepto) |
| Variantes por concepto | 3 |
| Intentos máximos | 3 (1 + 2 retries) |
| Nota mínima aprobatoria | 70% (4 de 5 correctas) |
| Tiempo estimado | 10-15 minutos |

#### Conceptos evaluados y slug de tracking

| # | Concepto (slug) | Bloom | Descripción |
|---|-----------------|-------|-------------|
| 1 | `portfolio-business-metrics` | Aplicar | Portfolio: 3-5 proyectos con live demo + GitHub + "what I learned" + business metric ("reduced churn 18%"). Static site en Vercel ($12/yr domain) = 10x recruiter response. |
| 2 | `cv-ats-keyword-optimization` | Aplicar | CV ATS: single column, no tables/graphics, standard fonts, PDF only. Keyword overlap con JD ~70% — mirror exact phrases ("XGBoost", "feature engineering"). |
| 3 | `conference-networking-strategy` | Aplicar | Networking: PyCon LATAM, Khipu.ai (Peru ML), SciPy. Pre-evento: stalk speakers LinkedIn, prepare 1 specific question. Post-evento: LinkedIn request referencing their talk. |
| 4 | `star-behavioral-interviews` | Aplicar | STAR: Situation, Task, Action (qué TÚ hiciste, no "we"), Result (cuantificado). 5 stories preparadas: challenging project, conflict, leadership, failure, achievement. |
| 5 | `salary-negotiation-tactics` | Analizar | Negotiation: Levels.fyi research, multiple offers leverage, anchor high (first number wins), total comp (base+equity+bonus), never accept first offer. 10-30% uplift típico. |

#### Ejemplo de variantes

Para `cv-ats-keyword-optimization`:

- **V1**: "Tu JD pide 'XGBoost, feature engineering, FastAPI'. ¿Cómo los mencionas en CV?" — usa exact phrases, no sinónimos
- **V2**: "Tu CV tiene tablas y columnas múltiples. ¿ATS lo lee bien?" — NO (ATS parsea single column mejor)
- **V3**: "Logro en CV: 'Trabajé en ML'. ¿Mejorable?" — SÍ: "Built churn model with XGBoost, reduced churn 15%, saved S/2M" (quantify)

#### Preguntas de auto-evaluación (modo sin login)

1. ¿Qué debe tener un portfolio site profesional?
2. ¿Qué hace un CV ATS-friendly?
3. ¿Cómo networking en conferencias?
4. ¿Qué es el método STAR?
5. ¿Cómo negocías salary?

### Recursos principales

- Levels.fyi — Salary data
- "Tech Resume Inside Out" (Gergely Orosz)
- "Staff Engineer" (Will Larson) — career paths
- PyCon LATAM — Conference
- Khipu.ai — Peru ML conference

---

## Estadísticas del curso

| Métrica | Fase 0 | Fase 1 | Fase 2 | Fase 3 | **Total** |
|---|---|---|---|---|---|
| Secciones | 13 | 13 | 13 | 13 | **52** |
| Horas estimadas | 122h | 150h | 168h | 160h | **600h** |
| Conceptos evaluados (examen) | 60 | 56 | 64 | 60 | **240** |
| Variantes por concepto | 3 | 3 | 3 | 3 | **3** |
| Preguntas totales en QuestionBank | ~180 | ~168 | ~192 | ~180 | **~720** |
| Proyectos de portafolio (You Do) | 13 | 13 | 13 | 13 | **52** |
| Demos interactivos Pyodide | 13 | 13 | 13 | 13 | **52** |
| Capstones integradores | 1 (S13) | 1 (S26) | 1 (S39) | 1 (S51) | **4** |

### Distribución por nivel cognitivo de Bloom (conceptos de examen)

| Bloom | Fase 0 | Fase 1 | Fase 2 | Fase 3 | **Total** | % |
|-------|--------|--------|--------|--------|-----------|---|
| Recordar | 12 | 6 | 4 | 3 | **25** | 10% |
| Aplicar | 28 | 30 | 36 | 35 | **129** | 54% |
| Analizar | 20 | 20 | 24 | 22 | **86** | 36% |
| Crear / Evaluar | 0 | 0 | 0 | 0 | **0** | 0% (evaluado via You Do) |

La distribución refleja progresión pedagógica: Fase 0 tiene más "Recordar" (fundamentos), Fase 3 tiene más "Analizar" (trade-offs arquitecturales). Crear y Evaluar se evalúan exclusivamente via proyectos You Do (portafolio), no via examen múltiple-choice.

## Notas pedagógicas para revisores

### Metodología I Do / We Do / You Do

Cada sección sigue el framework **Gradual Release of Responsibility** (Corwin/Ferry 2014):

1. **I Do (Yo hago)**: El instructor demuestra con código real, explicando el "por qué" de cada decisión
2. **We Do (Hacemos juntos)**: El estudiante practica con starter code, hints y solución para comparar
3. **You Do (Tú haces)**: Proyecto independiente para portafolio GitHub
4. **Auto-evaluación**: Quiz con feedback inmediato (sin login) o examen con anti-plagio (con login)

### Sistema de exámenes con anti-plagio

El sistema de exámenes está diseñado contra tres amenazas reales que observamos en cursos online anteriores: (1) estudiantes que comparten respuestas por WhatsApp entre cohortes, (2) estudiantes que reintentan el examen hasta memorizar las preguntas, y (3) estudiantes que usan los 3 intentos como estrategia de "fuerza bruta" en vez de estudio. Cada regla a continuación mitiga una de estas amenazas.

#### Reglas de evaluación (aplican a las 52 secciones)

| Regla | Valor | Justificación pedagógica |
|-------|-------|--------------------------|
| Variantes por concepto | **3 equivalentes** | Cada concepto clave se evalúa con 3 preguntas distintas pero isomorfas (mismo nivel cognitivo de Bloom, misma dificultad, mismo conocimiento evaluado). El sistema selecciona 1 al azar por intento, así dos estudiantes sentados juntos no ven la misma pregunta. |
| Intentos máximos por sección | **3 (1 + 2 retries)** | Permite recuperarse de un mal día o de un malentendido del concepto, pero obliga a estudiar entre intentos. El 4to intento es técnicamente bloqueado por la API (`/api/exam/start` devuelve HTTP 403). |
| Nota mínima para aprobar | **70%** | Umbral estándar en certificaciones técnicas (AWS, GCP, Azure). Por debajo de 70% el estudiante no demuestra dominio suficiente para avanzar al proyecto You Do de la siguiente sección. |
| Puntos por pregunta | **Igual peso** | Cada concepto contribuye igual al score. No hay preguntas "trampa" con peso doble. Esto evita que un estudiante pase por suerte acertando una sola pregunta de alto peso. |
| Selección de variante | **Aleatoria sin repetición** | En el intento 1, el sistema elige 1 de las 3 variantes al azar. En el intento 2, elige entre las 2 variantes no usadas. En el intento 3, usa la variante restante. Así los 3 intentos del mismo usuario siempre ven 3 preguntas diferentes para el mismo concepto. |
| Orden de preguntas | **Aleatorio por intento** | Las preguntas se barajan (Fisher-Yates) en cada inicio de examen. Dos estudiantes que rinden al mismo tiempo ven las preguntas en orden distinto. |
| Orden de opciones | **Fijo dentro de cada variante** | Las opciones A/B/C/D no se barajan, porque el `correctIndex` está almacenado en la base de datos. Cambiar el orden requeriría normalizar el índice — fuera de scope. |
| Tiempo límite | **Sin límite estricto** | Se mide `timeSpentSec` por intento (para analytics), pero no se bloquea. Razón: la presión de tiempo en exámenes autodidactas genera ansiedad sin mejorar el aprendizaje. El instructor puede revisar tiempos anómalos (>30 min) como señal de copia entre pestañas. |
| Feedback post-examen | **Inmediato y explicado** | Al submitir, el estudiante ve: score, qué respuestas acertó/falló, y la explicación pedagógica de cada concepto. Las explicaciones fueron redactadas a mano por el equipo curricular, no generadas. |
| Audit trail | **Completo en `ExamAttempt`** | Cada intento guarda: `attemptNumber`, `answers` (JSON con respuestas seleccionadas), `score`, `variantSeed` (JSON con qué variante se usó por concepto), `startedAt`, `completedAt`, `timeSpentSec`. Permite investigaciones de integridad académica. |

#### Taxonomía de conceptos evaluados

Cada sección evalúa entre **3 y 6 conceptos clave** (la mediana es 4). El número se determina por la complejidad de la sección: secciones Fundamentales (S1-S13) tienen 4-5 conceptos; secciones Senior (S27-S39) tienen 5-6 conceptos por su amplitud técnica; secciones Capstone (S26, S39, S51) tienen 3 conceptos enfocados en integración.

Cada concepto se identifica con un slug kebab-case (`venv-purpose`, `list-comprehension`, `pipeline-idempotency`) que se almacena en `QuestionBank.concept`. El slug es estable: si un estudiante falla el concepto `venv-purpose` en S1, el dashboard de progreso puede recomendarle repasar exactamente ese concepto — no "la sección S1 completa".

#### Estructura de cada variante

Las 3 variantes de un concepto comparten:
- **Mismo concepto evaluado** (slug idéntico)
- **Misma categoría cognitiva de Bloom** (las 3 son "Recordar", o las 3 son "Aplicar", o las 3 son "Analizar")
- **Misma dificultad subjetiva** (calibrada por el equipo curricular)
- **Mismo número de opciones** (siempre 4: A, B, C, D)
- **Mismo correctIndex relativo al patrón de distractores** (pero el contenido cambia)

Las 3 variantes difieren en:
- **Contexto del enunciado** (ej: variante 1 habla de "Instalar Django", variante 2 de "Instalar FastAPI", variante 3 de "Instalar scikit-learn")
- **Valores numéricos** en ejercicios de cálculo
- **Orden de mención** de las opciones correctas
- **Errores que distractores representan** (cada variante tiene distractores plausibles pero distintos)

#### Política de retries

1. **Intento 1**: El estudiante ve 1 variante aleatoria por concepto. Si aprueba (≥70%), la sección se marca completa.
2. **Intento 2** (si falló el 1): El sistema selecciona variantes no usadas en el intento 1. El estudiante ve preguntas **diferentes** sobre los **mismos conceptos**. Recomendación pedagógica: repasar la teoría antes de retry, no intentar inmediatamente.
3. **Intento 3** (si falló el 2): Última oportunidad. Se usa la variante restante. Si falla, la sección queda en estado "Reprobada" — el estudiante debe contactar al instructor para un plan de remediación (no se permite un 4to intento automáticamente).
4. **Bloqueo técnico**: La API `/api/exam/start` devuelve HTTP 403 con mensaje "Has alcanzado el máximo de 3 intentos para esta sección" cuando se intenta un 4to. El frontend (`ExamView.tsx`) muestra este mensaje y deshabilita el botón "Iniciar examen".

#### Anti-plagio: vector por vector

| Vector de fraude | Mitigación implementada |
|-------------------|--------------------------|
| Copiar entre estudiantes en paralelo | Variantes aleatorias + orden de preguntas barajado. Probabilidad de que 2 estudiantes vean la misma pregunta: 1/3 por concepto. |
| Memorizar preguntas del intento 1 para el intento 2 | Variante sin repetición. En el intento 2, 0% de probabilidad de ver la misma pregunta del intento 1. |
| Compartir respuestas entre cohortes (WhatsApp) | Rotación de variantes entre semestres no implementada aún, pero los slugs son estables: el equipo curricular puede reemplazar variantes específicas si se detecta fuga. |
| Usar LLM (ChatGPT) para responder | Las preguntas están redactadas con contexto específico del curso (ej: "En el pipeline ETL de la Sección 18, ¿qué pasa si...?"). Un LLM sin acceso al material del curso falla las preguntas de aplicación. Las preguntas de "Recordar" son vulnerables, pero su peso en el score es bajo. |
| Inspeccionar el DOM para ver `correctIndex` | El endpoint `/api/exam/start` devuelve solo `question` y `options`, NUNCA `correctIndex`. El `correctIndex` solo se revela post-submit vía `/api/exam/submit`, que compara y persiste atómicamente. |

#### Scoring y feedback

El score se calcula como `(# respuestas correctas / # preguntas totales) * 100`, redondeado a 2 decimales. El `passed` booleano es `score >= 70`.

El feedback post-examen muestra para cada pregunta:
- Tu respuesta seleccionada (resaltada)
- La respuesta correcta (resaltada en verde si acertaste, en rojo si fallaste)
- Una explicación pedagógica de 1-3 oraciones sobre por qué la opción correcta es correcta y por qué las otras son distractores comunes

Las explicaciones NO revelan la variante específica que se usó. Así, si un estudiante comparte su feedback con un compañero, este último no gana información sobre qué variante verá en su propio examen.

#### Integración con el sistema de progreso

Aprobar el examen (≥70%) marca el sub-step `quiz` como `completed=true` en la tabla `Progress`. Los 5 sub-steps por sección son: `theory`, `ido`, `wedo`, `youdo`, `quiz`. Una sección se considera "completa" solo cuando los 5 están marcados.

Si un estudiante reprueba los 3 intentos, los sub-steps `theory`, `ido`, `wedo`, `youdo` pueden seguir completados (trabajo hecho), pero `quiz` queda pendiente. El dashboard muestra la sección como "En progreso" con un indicador "Examen reprobado — contacta al instructor".

#### Limitaciones conocidas

1. **No hay timer estricto** — analíticamente medible pero no bloqueante. Trades off integridad por accesibilidad (estudiantes con TDAH, conexión inestable).
2. **Las opciones no se barajan dentro de cada variante** — vulnerabilidad menor si un estudiante memoriza "la correcta es siempre la B". Mitigación: en variantes 2 y 3, el `correctIndex` es distinto intencionalmente.
3. **No hay lock de pestaña** — un estudiante puede abrir el examen en una pestaña y consultar el material en otra. Se asume honestidad académica; el anti-plagio se enfoca en variantes, no en lockdown del browser.
4. **El seed file (`prisma/seed.ts`) actualmente solo cubre 8 de 52 secciones** — las 44 secciones restantes devuelven HTTP 404 al iniciar examen. **TODO curricular**: agregar 3 variantes × 4-5 conceptos × 44 secciones ≈ 528-660 preguntas adicionales. Mientras tanto, las secciones sin preguntas deben mostrar un Callout "Examen en construcción — usa el quiz de auto-evaluación abajo".

### Editor interactivo con Pyodide

- Las 52 secciones incluyen un **editor Python en el browser** (Pyodide/WebAssembly) con auto-carga de paquetes (numpy, pandas, matplotlib, sklearn)
- El estudiante puede modificar y ejecutar código sin instalar nada
- Comparación automática con output esperado (✓ correcto / ✗ incorrecto)
- Hints colapsables por ejercicio

### Cobertura de libros de referencia (EPUBs)

Se realizó gap analysis de 3 EPUBs contra las 13 secciones:

- **Python 101** (Michael Driscoll, 44 capítulos): ~85% cubierto
- **Python 201** (Michael Driscoll, 30 capítulos): ~75% cubierto (tras añadir S7 Data Acquisition y S12 Performance)
- **Use Python to Become AWESOME at Your Job** (Shantnu Tiwari, 8 capítulos): ~70% cubierto (tras añadir S13 RPA)

### Temas identificados como gaps y cubiertos

Los siguientes 10 temas fueron identificados como faltantes en el gap analysis de EPUBs y se cubren en las nuevas secciones:

1. ✅ Iterators & generators (S7)
2. ✅ Web scraping con BeautifulSoup (S7)
3. ✅ REST APIs con requests (S7)
4. ✅ SQL databases con sqlite3/SQLAlchemy (S7)
5. ✅ Multiprocessing & concurrent.futures (S12)
6. ✅ Regular expressions (S7)
7. ✅ collections (Counter, defaultdict, namedtuple) (S7)
8. ✅ Profiling & benchmarking (S12)
9. ✅ Logging (S12)
10. ✅ argparse / CLI tooling (S12)

### Temas de RPA/Automatización añadidos (requerimiento del VP)

1. ✅ Browser automation con Playwright (S13)
2. ✅ Desktop automation con pyautogui (S13)
3. ✅ OCR con pytesseract + OpenCV (S13)
4. ✅ IA local con Ollama (S13)
5. ✅ IA cloud con OpenAI API structured outputs (S13)
6. ✅ Orquestación con Prefect (S13)
7. ✅ Scheduling con GitHub Actions cron (S13)
8. ✅ Resilencia con tenacity (S13)

---

## Solicitudes de feedback

Pedimos a los expertos revisar:

1. **Orden de secciones**: ¿Es correcto enseñar Data Acquisition (S7) antes que Pandas (S8)?
2. **Profundidad**: ¿Hay temas demasiado superficiales o demasiado profundos para el nivel?
3. **Cobertura**: ¿Faltan temas críticos para un Data Analyst / Data Scientist junior-mid?
4. **Progresión**: ¿El capstone del Familiarity Dashboard se integra bien a lo largo del curso?
5. **RPA**: ¿Es apropiado incluir RPA con IA en un curso de Python DS, o debería ser un curso separado?
6. **Evaluación**: ¿Son suficientes 5 preguntas por sección con 3 variantes cada una?
7. **Horas**: ¿Las horas estimadas son realistas para aprendizaje autónomo?
8. **Idioma**: ¿El uso de español peruano ("chevere", "pega", etc.) es apropiado o distrae?

---

*Generado automáticamente desde el código fuente del curso en 2026-07-14.*
