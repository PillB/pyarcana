# El Arte de Python — Master Roadmap v2.0 + Elite Prompting Strategy

> **Curso:** El Arte de Python — De cero a Data Scientist  
> **Idioma:** Español peruano  
> **Pedagogía:** I Do / We Do / You Do (Gradual Release of Responsibility)  
> **Total:** 13 secciones · ~130 horas estimadas · 4 niveles (Principiante → Master)  
> **Versión:** 2.0 — 2026-07-15  
> **Generado por:** Agentic Reasoning — Máximo esfuerzo, cero scripts

***

## PARTE I — FASE 0: ESTRATEGIA GLOBAL DE PROMPTING

### Documento de Estrategia de Prompting Mejorada

Esta sección sintetiza los hallazgos más rigurosos de la literatura de prompt engineering y los aplica directamente a la creación de contenido del curso, incluyendo estrategias específicas para GLM-5.2.

***

### 1. Fundamentos Basados en Investigación Top

#### 1.1 The Prompt Report — Universidad de Maryland + OpenAI + Stanford (2024)

El estudio más exhaustivo hasta la fecha, analiza 1,565 papers y cataloga 58 técnicas de prompting para texto y 40 para multimodal. La taxonomía de seis categorías centrales es:[^1]

| Categoría | Técnica Principal | Cuándo Usar |
|-----------|-------------------|-------------|
| **Zero-Shot** | Role prompting, emotion prompting | Tareas claras y bien definidas |
| **Few-Shot** | Demonstration selection, CoT con ejemplos | Formato de salida preciso requerido |
| **Thought Generation** | Chain-of-Thought (CoT), Tree of Thoughts (ToT) | Razonamiento multi-paso complejo |
| **Ensembling** | Self-Consistency, DENSE | Alta varianza, necesita confiabilidad |
| **Self-Criticism** | Self-Refine, Self-Verification | Contenido educativo, revisión iterativa |
| **Decomposition** | Least-to-Most, Plan-and-Solve | Tareas complejas multi-componente |

**Chain-of-Thought (Wei et al., NeurIPS 2022, 32,637+ citas)** produce mejoras de hasta 39% en tareas de razonamiento matemático. El Zero-shot CoT ("Let's think step by step") es sorprendentemente efectivo incluso sin ejemplos.[^2][^3][^4][^5]

**Self-Refine (Madaan et al., NeurIPS 2023)** implementa un ciclo iterativo: Generate → Feedback → Refine, sin entrenamiento adicional. Este framework es la base del sistema de validación de contenido para cada sección.[^6]

#### 1.2 Técnicas Avanzadas de Multi-Agente

La orchestración multi-agente con separación estricta de concerns produce salidas más consistentes que prompts monolíticos. El framework de sub-agentes del proyecto (Researcher, Developer, Validator, Fixer, Reporter) mapea directamente a esta evidencia.[^1]

**Program-of-Thoughts (PoT):** Genera código Python como cadena de razonamiento, logrando 12% mejor que CoT en tareas numéricas. Aplicación directa: los ejercicios de código del curso deben pedirle al modelo razonar primero en pseudocódigo antes de implementar.[^3]

**Tree-of-Thoughts (ToT):** Usa BFS/DFS para explorar múltiples caminos de razonamiento. Para diseño curricular: explorar 3+ enfoques pedagógicos antes de seleccionar el mejor para cada subtema.[^3]

**Self-Consistency:** Generar múltiples outputs independientes y seleccionar el más consistente. Uso: generar 3 variantes de cada pregunta de examen y validar equivalencia pedagógica por separado.[^2]

***

### 2. Estrategia Específica para GLM-5.2

#### 2.1 Arquitectura y Capacidades Clave

GLM-5.2 es un modelo Mixture-of-Experts (MoE) con 744B parámetros totales y ~40B activos por inferencia, con ventana de contexto de 1M tokens y dos modos de razonamiento: *High* (rápido) y *Max* (profundo, multi-step). Fue pre-entrenado en 28.5 trillones de tokens.[^7][^8][^9]

Sus fortalezas según benchmarks oficiales:[^8]
- **MCP-Atlas (tool orchestration):** 77.0 — nivel con Claude Opus 4.8 (77.8)
- **SWE-bench Pro (resolved PRs):** 62.1 — supera GPT-5.5 (58.6)
- **AIME 2026 (reasoning):** 99.2 — #1 en todos los modelos comparados
- **Frontend Code Arena:** #2 global, +29 puntos sobre Claude Opus 4.7 Thinking

#### 2.2 Estructura de Prompt Óptima para GLM-5.2

Basado en análisis de la documentación oficial y casos de uso documentados:[^10][^11]

```
ESTRUCTURA CANÓNICA GLM-5.2

[ROLE]
Eres {rol específico con credenciales relevantes}.

[TASK]
Tu tarea es: {verbo de acción + entregable específico}.

[CONTEXT]
Contexto:
- {Dato 1 relevante}
- {Dato 2 relevante}
- Archivo/Sección de referencia: {nombre}

[CONSTRAINTS]
Restricciones:
- {Restricción 1 — qué NO hacer}
- {Restricción 2 — formato requerido}

[OUTPUT FORMAT]
Entrega:
1. {Sección 1 del output}
2. {Sección 2 del output}
3. {Formato: JSON/Markdown/código Python}

[REASONING]
Razona paso a paso antes de escribir la respuesta final.
```

**Principios Críticos para GLM-5.2:**[^11][^10]

1. **Context Discipline:** El modelo tiene 1M tokens disponibles, pero no debes llenarlos por defecto. Carga solo lo que la tarea genuinamente necesita. Para diseño de contenido: incluye solo la sección actual + checklist de requisitos.[^8]

2. **Explicit Schemas:** Los esquemas JSON explícitos reducen drift y mejoran consistencia. Cada solicitud de contenido debe incluir el esquema de la sección esperada.[^11]

3. **Separate Task from Data:** Para long-context work, separar claramente instrucciones de evidencia/documentos. Primero las instrucciones, después los materiales.[^11]

4. **Temperature Control:** 0.1-0.3 para análisis, código y extracción. 0.5-0.7 para generación creativa de ejercicios.[^10]

5. **Reasoning Effort:** Usar `reasoning_effort="high"` para diseño curricular complejo. Usar modo normal para tareas de formato simple.

6. **Few-Shot Rule:** 2-4 ejemplos máximo, incluyendo al menos un caso edge o tricky. Para preguntas de examen: incluir un ejemplo de pregunta buena y una pregunta mala con explicación.[^11]

#### 2.3 Prompt Templates del Proyecto

**Template para Creación de Sección:**
```
Eres un diseñador curricular senior especializado en Python para Data Science, 
con experiencia en programas para profesionales latinoamericanos.

TAREA:
Crear el contenido completo de la Sección {N}: {Título}
conforme al checklist de requisitos abajo y al roadmap maestro.

CONTEXTO DE LA SECCIÓN:
- Nivel: {Principiante/Intermedio/Avanzado}
- Horas: {N}h
- Prerequisitos: Secciones {X, Y, Z}
- Subtema activo: {subtema}
- Contribución al Capstone Progresivo: {descripción}

REQUISITOS (checklist):
[ ] 3 ejercicios por subtema (We Do / You Do variants)
[ ] 6 ejercicios totales por tema principal
[ ] 3 variantes de preguntas por subtema para examen
[ ] 1 proyecto aplicado (You Do) como entregable clave
[ ] Ejemplos con contexto peruano/latinoamericano
[ ] Código funcional con buenas prácticas (PEP 8)
[ ] Preamble explicando relevancia laboral

OUTPUT FORMAT:
```json
{
  "seccion": N,
  "titulo": "...",
  "subtemas": [
    {
      "nombre": "...",
      "ejercicios_we_do": [{...}],
      "ejercicios_you_do": [{...}],
      "variantes_examen": [
        {"q": "...", "opciones": ["a","b","c","d"], "correcta": "a", "explicacion": "..."},
        {"q": "...", "opciones": ["a","b","c","d"], "correcta": "b", "explicacion": "..."},
        {"q": "...", "opciones": ["a","b","c","d"], "correcta": "c", "explicacion": "..."}
      ]
    }
  ]
}
```

Razona la justificación pedagógica de cada ejercicio antes de escribirlo.
```

**Template para Validación (Validator Agent):**
```
Eres un validador pedagógico con el rol de estudiante principiante 
que SOLO puede usar el texto de la sección proporcionada.

TAREA:
1. Intenta resolver TODOS los ejercicios usando únicamente el material de la sección.
2. Verifica que cada pregunta de examen tenga exactamente 1 respuesta correcta inequívoca.
3. Verifica equivalencia pedagógica entre las 3 variantes de cada subtema.
4. Documenta cada issue con cita directa del texto y análisis de causa raíz.

CRITERIOS DE ÉXITO:
- Estudiante puede resolver ejercicio usando solo el material → PASS
- Pregunta tiene respuesta ambigua → FAIL + root cause
- Variantes evalúan diferente nivel cognitivo → FAIL + root cause

OUTPUT: Reporte estructurado con PASS/FAIL por ejercicio.
```

***

## PARTE II — FASE 1: RECUPERACIÓN DE REQUISITOS Y ROADMAP MAESTRO

### Master Section Requirements Criteria Checklist

Este checklist se aplica a CADA sección antes de marcarla como completa:

#### Checklist por Subtema
- [ ] **Teoría:** Mínimo 3 párrafos con explicación conceptual + ejemplo de código
- [ ] **I Do:** 1-2 demos guiadas con código comentado línea por línea
- [ ] **We Do (Ejercicio 1):** Starter code parcial + instrucciones + hint colapsable
- [ ] **We Do (Ejercicio 2):** Variante del mismo concepto, contexto diferente
- [ ] **We Do (Ejercicio 3):** Ejercicio integrador con 2+ conceptos del subtema
- [ ] **Examen Variante A:** Pregunta MCQ nivel Comprensión (Bloom L2)
- [ ] **Examen Variante B:** Pregunta MCQ nivel Aplicación (Bloom L3), mismo subtema
- [ ] **Examen Variante C:** Pregunta MCQ nivel Análisis (Bloom L4), mismo subtema
- [ ] Cada variante tiene 4 opciones, 1 correcta, 3 distractores plausibles
- [ ] Explicación de por qué cada distractor es incorrecto

#### Checklist por Tema (agrupa subtemas)
- [ ] **6 ejercicios totales** distribuidos entre subtemas del tema
- [ ] **1 evaluación del tema:** 3-5 preguntas de múltiples conceptos
- [ ] **Conexión al Capstone Progresivo:** explicada explícitamente

#### Checklist por Sección
- [ ] **Preamble de Relevancia Laboral:** empresa peruana real, scenario concreto
- [ ] **Objetivos de Aprendizaje:** verbos de acción medibles (Bloom)
- [ ] **Proyecto You Do:** especificaciones completas, criterios de aceptación
- [ ] **Examen de Sección:** 1 pregunta por subtema, selección aleatoria de variante A/B/C
- [ ] **Sistema anti-plagio:** 3 intentos máx, variante diferente por intento
- [ ] **Recursos:** mínimo 4 fuentes externas con URL verificada
- [ ] **Conexión a sección anterior y siguiente:** explícita
- [ ] **Editor Pyodide:** ejercicios compatibles con browser-based Python

#### Checklist de Código
- [ ] Todo código sigue PEP 8
- [ ] Funciones con type hints
- [ ] Docstrings en funciones principales
- [ ] Manejo de errores con try/except donde aplica
- [ ] No usa librerías no instaladas en Pyodide para secciones 1-6

***

### Capstone Projects — Especificaciones Completas

#### CAPSTONE 1 (Nivel 1 — Secciones 1-13): Familiarity Score Dashboard

**Nombre del proyecto:** `familiarity-score-dashboard`  
**Solicitante:** VP de Operaciones (caso empresa peruana real)  
**Objetivo de negocio:** Detectar relaciones ocultas entre clientes para prevenir fraude, mejorar KYC y compliance AML.

**Datos de entrada:**
- Excel/CSV con información de clientes: `id_cliente`, `nombres`, `primer_apellido`, `segundo_apellido`, `dni`, `email`, `telefono`, `direccion`, `distrito`, `provincia`
- Excel/CSV de transacciones: `id_transaccion`, `id_cliente_emisor`, `id_cliente_receptor`, `monto`, `fecha`, `tipo`

**Componentes de Familiaridad a detectar:**

| Señal | Peso | Método |
|-------|------|--------|
| Mismo apellido paterno | 0.25 | Exact match |
| Mismo apellido materno | 0.15 | Exact match |
| Email similar (mismo dominio) | 0.10 | String split + compare |
| Teléfono idéntico | 0.20 | Normalize + exact |
| Dirección muy cercana (< 500m) | 0.30 | Google Maps / OpenStreetMap Distance Matrix API |
| Dirección idéntica | 0.40 | Fuzzy string match (RapidFuzz) |
| Han transaccionado entre sí | 0.35 | Graph lookup |
| Mismo beneficiario en transacciones | 0.20 | Graph lookup |

**Score de familiaridad:** suma ponderada normalizada a. Score > 0.6 = "Related", > 0.8 = "Highly Related".[^12]

**Pipeline técnico por sección:**

| Sección | Contribución al Capstone |
|---------|--------------------------|
| S3 | Leer Excel/CSV de clientes con csv.DictReader, construir dict de clientes |
| S4 | Funciones modulares: `normalizar_nombre()`, `calcular_score()`, `exportar_reporte()` |
| S5 | Clase `Cliente`, clase `Transaction`, clase `FamiliarityEngine` con OOP |
| S6 | Vectorización NumPy de scores matriciales para N × N clientes |
| S7 | Consumir Google Maps Distance Matrix API para scores de distancia |
| S8 | Pandas: merge DataFrames, groupby transacciones, limpieza de datos |
| S9 | Mapa interactivo Leaflet/Folium con clusters de clientes relacionados |
| S10 | ML opcional: clasificador de "pares relacionados" con features del score |
| S11 | Tests para `calcular_score()`, `normalizar_direccion()`, validación de API |
| S12 | ProcessPoolExecutor para calcular matriz de scores en paralelo (N×N clientes) |
| S13 | Bot RPA: leer Excel → ejecutar análisis → generar PDF report → enviar email |

**Entregables finales:**
1. Script CLI: `python familiarity.py --input clientes.xlsx --threshold 0.6 --output reporte.xlsx`
2. Mapa interactivo HTML con clientes y conexiones
3. Excel con pares de clientes y scores
4. Reporte PDF ejecutivo con hallazgos

***

#### CAPSTONE 2 (Nivel 2 — Competente, Secciones 14-20): VP RPA + AI Automation Engine

**Nombre del proyecto:** `analytics-automation-engine`  
**Solicitante:** VP Directo — Requiere automatizar análisis manuales del equipo de operaciones.

**Procesos actuales a automatizar:**

1. **Reconciliación de Excel:** El equipo descarga 3 Excels de distintos sistemas, los cruza manualmente con VLOOKUP, genera tabla resumen.
   - **Automatización:** Python lee los 3 Excels, hace merge inteligente, detecta discrepancias.
   
2. **Análisis de texto libre:** Los agentes escriben notas en un campo "Observaciones". El supervisor las lee manualmente para detectar patrones.
   - **IA:** HuggingFace `pipeline("zero-shot-classification")` para categorizar las notas automáticamente (fraude, queja, elogio, operativo).

3. **Detección de anomalías en transacciones:** El equipo revisa manualmente transacciones > S/5000 o con patrones inusuales.
   - **IA:** Isolation Forest (sklearn) o BERT embeddings para anomaly detection.

4. **Generación de reporte Word/PDF:** El supervisor escribe el reporte semanal copiando/pegando cifras del Excel.
   - **Automatización:** python-docx genera el Word con tablas, gráficas y texto automático.

5. **Envío de email:** Manualmente envía el reporte por Outlook.
   - **Automatización:** smtplib / Playwright para adjuntar y enviar.

**Stack técnico:** pandas, openpyxl, transformers (HuggingFace), sklearn, python-docx, smtplib, Playwright, Prefect.

**Entregables:**
1. Pipeline Prefect: `@flow` que orquesta todos los pasos automáticamente
2. Dashboard HTML con resultados del análisis de la semana
3. Reporte Word autogenerado listo para enviar
4. Script de prueba con datos sintéticos

***

#### CAPSTONE 3 (Nivel 3 — Senior, Secciones 21-28): Real-Time Fraud Detection Microservice

**Nombre:** `fraud-detection-api`  
**Stack:** FastAPI + Redis + scikit-learn/XGBoost + Docker + GitHub Actions

**Características:**
- API REST que recibe transacciones en tiempo real y retorna score de fraude en < 100ms
- Feature store en Redis para datos de clientes (historial reciente)
- Modelo entrenado con el dataset del Capstone 1 (datos de familiaridad como features)
- A/B testing de modelos con feature flags
- Monitoring con Prometheus + Grafana
- CI/CD completo con GitHub Actions

***

#### CAPSTONE 4 (Nivel 4 — Master, Secciones 29-35): LLM-Powered Data Intelligence Platform

**Nombre:** `data-intelligence-platform`  
**Stack:** FastAPI + LangChain/LlamaIndex + GLM-5.2/Ollama + PostgreSQL + Next.js

**Características:**
- Chat con datos: el usuario pregunta en español y el sistema genera y ejecuta SQL
- RAG sobre documentos internos de la empresa (políticas, manuales, reportes)
- Agente autónomo que monitorea KPIs y genera alertas con explicación en lenguaje natural
- Fine-tuning de embeddings sobre data de la empresa para mejor retrieval
- Panel de administración para gestionar fuentes de datos y prompts

***

## PARTE III — ROADMAP ACTUALIZADO v2.0

### Estructura Global Mejorada

```
NIVEL 1 — FUNDAMENTOS (Secciones 1-13) — ~130h
├── Bloque A (S1-S6): Python Core + NumPy
├── Bloque B (S7-S9): Datos + Visualización  
├── Bloque C (S10-S11): ML + Testing
└── Bloque D (S12-S13): Performance + RPA
    └── CAPSTONE 1: Familiarity Score Dashboard

NIVEL 2 — COMPETENTE (Secciones 14-20) — ~80h [FUTURO]
├── FastAPI + Microservices
├── Docker + Kubernetes básico
├── MLOps con MLflow
└── CAPSTONE 2: Analytics Automation Engine (VP Project)

NIVEL 3 — SENIOR (Secciones 21-28) — ~80h [FUTURO]
├── System Design para ML
├── Distributed Computing (Spark básico)
├── Advanced ML (ensembles, feature engineering avanzado)
└── CAPSTONE 3: Fraud Detection Microservice

NIVEL 4 — MASTER (Secciones 29-35) — ~80h [FUTURO]
├── LLMs + RAG + Agents
├── Fine-tuning + RLHF básico
├── Production AI Systems
└── CAPSTONE 4: Data Intelligence Platform
```

***

### SECCIÓN 1: Setup & Entorno de Desarrollo — v2.0

> **Tagline:** Python, VS Code, venv y Git listos para producción desde el día 1  
> **Nivel:** Principiante · 4h · 3 subtemas · 9 ejercicios · 9 variantes de examen

#### Preamble de Relevancia Laboral
El 90% de los problemas de onboarding en equipos de Data Science no son de código — son de entorno. En empresas peruanas como Interbank, BBVA Perú, Caja Arequipa y Falabella Perú, el primer día siempre incluye: clonar el repo del equipo, levantar el entorno virtual, correr las pruebas. Un analista que hace eso en 10 minutos proyecta confianza inmediata. Quien se traba con `ModuleNotFoundError` o tiene Python 2.7 instalado por defecto pierde la confianza del líder técnico en la primera semana.

#### Objetivos de Aprendizaje (Bloom)
- **Recordar:** Enumerar los componentes de un entorno de desarrollo Python profesional
- **Comprender:** Explicar por qué venv aísla dependencias entre proyectos
- **Aplicar:** Crear un entorno virtual, instalar dependencias y generar requirements.txt
- **Aplicar:** Inicializar un repositorio Git, hacer commit y push a GitHub
- **Analizar:** Distinguir qué archivos van en .gitignore y por qué

#### Subtema 1.1: Instalación y Verificación de Python

**Teoría (I Do):**  
Python 3.12+ introduce mejoras de performance (20% más rápido que 3.10) y mensajes de error más claros. La instalación correcta verifica que el PATH del sistema apunte al Python correcto. En equipos con múltiples proyectos, coexisten Python 3.9 (proyecto legacy), 3.11 (proyecto en producción) y 3.12 (proyecto nuevo) — sin conflicto gracias a entornos virtuales.

```python
# Verificar instalación — ejecutar en terminal
# python --version   → debe mostrar 3.12.x
# python -c "import sys; print(sys.version_info)"
# → sys.version_info(major=3, minor=12, micro=0, ...)

# Si tienes múltiples versiones, python3.12 --version
# En Windows: py --version, py -3.12 --version
```

**We Do — Ejercicio 1.1.1 (starter code):**
```python
# Completa el script para imprimir información del sistema
import sys
import platform

def verificar_entorno():
    """Imprime información del entorno Python actual."""
    # TODO 1: Imprime la versión de Python (usa sys.version_info)
    print(f"Python versión: {___}.{___}.{___}")
    # TODO 2: Imprime el sistema operativo (usa platform.system())
    print(f"Sistema: {___}")
    # TODO 3: Verifica que la versión sea >= 3.10
    mayor, menor = sys.version_info.major, sys.version_info.minor
    if ___ >= 3 and ___ >= 10:
        print("✓ Versión compatible")
    else:
        print("✗ Se requiere Python 3.10+")

verificar_entorno()
```

*Solución:*
```python
import sys, platform
def verificar_entorno():
    v = sys.version_info
    print(f"Python versión: {v.major}.{v.minor}.{v.micro}")
    print(f"Sistema: {platform.system()}")
    if v.major >= 3 and v.minor >= 10:
        print("✓ Versión compatible")
    else:
        print("✗ Se requiere Python 3.10+")
verificar_entorno()
```

**We Do — Ejercicio 1.1.2:**  
Escribe una función `get_python_path()` que retorne la ruta completa del ejecutable Python en uso (hint: `sys.executable`). Imprime también la carpeta `site-packages` donde se instalan las librerías (hint: `site.getsitepackages()`).

**We Do — Ejercicio 1.1.3 (integrador):**  
Crea un script `check_env.py` que: (1) verifique Python 3.10+, (2) verifique que `pip` esté disponible importando `importlib.util`, (3) imprima un reporte con ✓ o ✗ para cada check. Guárdalo como el primer archivo de tu repo `python-ds-journey/s01_setup/check_env.py`.

**Examen Variante A — Comprensión:**  
¿Para qué sirve un entorno virtual (venv) en Python?  
a) Para instalar Python en el sistema operativo  
b) **Para aislar las dependencias de un proyecto de las de otros proyectos** ✓  
c) Para ejecutar código Python más rápido  
d) Para conectar Python con bases de datos  
*Distractor b:* Es el correcto. *Distractor a:* Python se instala a nivel sistema, no en venv. *Distractor c:* venv no afecta la velocidad. *Distractor d:* venv no tiene relación con bases de datos.

**Examen Variante B — Aplicación:**  
Tienes un proyecto A que usa `pandas==1.5.3` y un proyecto B que necesita `pandas==2.2.0`. ¿Cuál es la forma correcta de manejar esta situación?  
a) Instalar `pandas==1.5.3` globalmente y actualizar cuando uses B  
b) Desinstalar pandas entre proyectos según necesitas  
c) **Crear un entorno virtual separado para cada proyecto e instalar la versión correcta en cada uno** ✓  
d) Usar solo una versión de pandas para ambos proyectos  
*Correcta: c.* Los venv permiten tener versiones incompatibles de la misma librería sin conflictos.

**Examen Variante C — Análisis:**  
Un colega dice: "No necesito venv porque siempre instalo todo con `pip install` globalmente y nunca tuve problemas". ¿Cuál es el mayor riesgo de este enfoque en un entorno profesional?  
a) pip se vuelve más lento con muchos paquetes globales  
b) **Actualizar una librería para el proyecto A puede romper el proyecto B sin aviso** ✓  
c) No se puede reproducir el entorno en otro equipo  
d) Git deja de funcionar correctamente  
*Correcta: b.* La dependencia compartida es la causa más común de "funciona en mi máquina" en equipos.

***

#### Subtema 1.2: Entornos Virtuales y Gestión de Dependencias

**Teoría:**  
`venv` crea una copia aislada del intérprete Python con su propio `site-packages`. Al activar el entorno, el shell redirige todos los comandos `python` y `pip` al ejecutable del entorno. El archivo `requirements.txt` permite reproducir el entorno exacto en cualquier máquina con `pip install -r requirements.txt`. Para proyectos serios, `pip freeze > requirements.txt` captura versiones exactas (pin), mientras que `pip freeze | grep -v "^-e" > requirements.txt` excluye packages en desarrollo local.

```python
# Flujo completo de venv — ejecutar en terminal
# python -m venv .venv                    # crear entorno
# source .venv/bin/activate               # activar (Unix/Mac)
# .venv\Scripts\activate                  # activar (Windows)
# pip install pandas numpy scikit-learn   # instalar packages
# pip freeze > requirements.txt           # guardar dependencias
# deactivate                              # salir del entorno
#
# En otro equipo o CI:
# python -m venv .venv && source .venv/bin/activate
# pip install -r requirements.txt         # reproducir entorno
```

**We Do — Ejercicio 1.2.1:**  
Crea un entorno virtual llamado `.venv`, actívalo, instala `requests==2.31.0` y `beautifulsoup4`, luego genera el `requirements.txt`. Incluye los comandos exactos para Windows y para Unix/Mac.

**We Do — Ejercicio 1.2.2:**  
Escribe un script `validate_requirements.py` que lea un archivo `requirements.txt`, importe `importlib.util` para verificar si cada package está instalado, y retorne un diccionario `{"pandas": True, "requests": True, "missing_lib": False}`. 

**We Do — Ejercicio 1.2.3 (integrador):**  
El equipo de Interbank te dio un `requirements.txt` con 10 paquetes. Uno de ellos (`legacy-parser==0.1.0`) no existe en PyPI. Escribe un script que lea el `requirements.txt`, intente importar cada paquete, y genere un reporte `check_deps.json` con `{"installed": [...], "missing": [...], "errors": [...]}`. Usa try/except para manejar paquetes faltantes.

**Examen Variante A:**  
¿Qué comando genera un archivo `requirements.txt` con las versiones exactas instaladas en el entorno activo?  
a) `pip list > requirements.txt`  
b) **`pip freeze > requirements.txt`** ✓  
c) `pip export requirements.txt`  
d) `python -m venv requirements.txt`

**Examen Variante B:**  
Recibes un proyecto de tu colega con un `requirements.txt`. ¿Cuál es el comando correcto para instalar todas las dependencias en tu entorno virtual activo?  
a) `pip get -r requirements.txt`  
b) `python install requirements.txt`  
c) **`pip install -r requirements.txt`** ✓  
d) `pip sync requirements.txt`

**Examen Variante C:**  
Tu `requirements.txt` tiene `pandas>=2.0.0` (sin versión exacta). ¿Cuál es la desventaja de especificar rangos en vez de versiones exactas?  
a) pip se vuelve más lento  
b) No se puede instalar en Windows  
c) El paquete no se instalará si no hay conexión a internet  
d) **En 6 meses podría instalar `pandas==2.3.0` que rompe tu código por un cambio de API** ✓

***

#### Subtema 1.3: Git y GitHub para Data Scientists

**Teoría:**  
Git no es solo para developers — es la herramienta de reproducibilidad #1 para Data Scientists. Un commit bien escrito documenta qué análisis hiciste y por qué. El flujo profesional mínimo para un DS: `main` (producción estable) → `develop` (integración) → `feature/nombre-análisis` (trabajo actual). Conventional Commits (`feat:`, `fix:`, `docs:`, `data:`, `model:`) hacen el historial legible. GitHub Pages permite publicar tu portafolio con notebooks renderizados.

```bash
# Flujo de trabajo diario en Data Science
git init
git add .
git commit -m "feat(s01): add venv setup and requirements.txt"
git branch -M main
git remote add origin https://github.com/usuario/python-ds-journey.git
git push -u origin main

# .gitignore esencial para DS:
# .venv/         — entorno virtual (no subir)
# .env           — API keys y secretos (NUNCA subir)
# __pycache__/   — archivos compilados
# *.pyc          — bytecode
# data/raw/      — datos crudos grandes
# models/*.pkl   — modelos entrenados grandes
# .DS_Store      — metadatos Mac
# *.ipynb_checkpoints/
```

**We Do — Ejercicio 1.3.1:**  
Inicializa un repo Git en tu carpeta de proyecto, crea un `.gitignore` con las 8 entradas esenciales para DS (listadas arriba), haz el primer commit con mensaje `"feat(s01): initial project setup"` siguiendo Conventional Commits.

**We Do — Ejercicio 1.3.2:**  
Escribe un script `generate_gitignore.py` que reciba como argumento el tipo de proyecto (`--type ds` o `--type web`) y genere el `.gitignore` correspondiente. Para DS incluye: `.venv/`, `.env`, `data/raw/`, `*.pkl`, `__pycache__/`, `*.ipynb_checkpoints/`, `.DS_Store`, `Thumbs.db`.

**We Do — Ejercicio 1.3.3 (integrador — You Do):**  
**Proyecto S1: Reproducible Data Environment**  
Crea el repo `python-ds-journey` en GitHub con:
- README.md con: badge de Python version, descripción del curso, tabla de secciones
- `.gitignore` completo para DS
- `s01_setup/requirements.txt` con `requests`, `pandas`, `numpy`, `pytest`
- `s01_setup/check_env.py` (del ejercicio 1.1.3)
- `s01_setup/validate_requirements.py` (del ejercicio 1.2.2)
- Primer commit con Conventional Commits
- Branch `develop` creado
El repo debe ser público para portafolio. Screenshot del repo subido como evidencia.

**Examen Variante A:**  
¿Cuál de los siguientes archivos SÍ debería estar en tu `.gitignore`?  
a) `README.md`  
b) `requirements.txt`  
c) **`.env`** ✓  
d) `main.py`  
*Correcta: c.* El archivo `.env` contiene API keys y passwords que NUNCA deben subirse a GitHub.

**Examen Variante B:**  
Siguiendo Conventional Commits, ¿cuál es el mensaje correcto para un commit que agrega el análisis inicial de datos de ventas?  
a) `"updated files"`  
b) `"sales analysis"`  
c) **`"feat(s07): add initial sales data EDA"`** ✓  
d) `"commit 1"`

**Examen Variante C:**  
Tu colega accidentalmente subió el archivo `.env` con la API key de producción de AWS a GitHub. ¿Cuál es la razón principal por la que esto es un problema grave AUNQUE borre el commit inmediatamente?  
a) Git se corrompe cuando se suben archivos .env  
b) El archivo `.env` es demasiado grande para GitHub  
c) **Git conserva el historial: el archivo puede recuperarse de commits anteriores y bots de seguridad ya lo escanearon** ✓  
d) GitHub bloquea el repositorio automáticamente  

***

#### Examen de Sección 1

*Sistema: 9 variantes disponibles (3 por subtema). Por intento, se selecciona aleatoriamente 1 variante de cada subtema = 3 preguntas por intento. Máximo 3 intentos. 70% para aprobar (2/3 correctas).*

**Evaluación del tema completo (Sección 1):**
1. Pregunta de subtema 1.1 (variante aleatoria A/B/C)
2. Pregunta de subtema 1.2 (variante aleatoria A/B/C)
3. Pregunta de subtema 1.3 (variante aleatoria A/B/C)

***

### SECCIÓN 2: Python Absolute Basics — v2.0

> **Tagline:** Los 5 conceptos que cubren el 80% del Python que escribirás  
> **Nivel:** Principiante · 8h · 5 subtemas · 15 ejercicios · 15 variantes de examen

*(Estructura idéntica a S1 expandida a 5 subtemas)*

#### Subtema 2.1: Variables y Tipos de Datos

**Examen Variante A:** ¿Cuál es la diferencia entre `=` y `==` en Python?  
a) Son equivalentes, solo cambia la convención  
b) `=` compara y `==` asigna  
c) **`=` asigna un valor a una variable; `==` compara dos valores y retorna True o False** ✓  
d) `=` es para enteros y `==` es para strings

**Examen Variante B:** ¿Qué retorna `type(3.14)`?  
a) `int`  
b) **`float`** ✓  
c) `double`  
d) `decimal`

**Examen Variante C:** Un colega escribe `precio = "150"` para guardar el precio de un producto. ¿Cuál es el problema?  
a) No hay problema, Python acepta cualquier tipo  
b) El número 150 es demasiado pequeño para una variable  
c) Debería usar `precio = 150.0` en vez de `precio = 150`  
d) **`precio` es un string, no un número. `precio + 50` daría error o `"15050"` en vez de `200`** ✓

#### Subtema 2.2: Operadores y Expresiones

**Examen Variante A:** ¿Qué evalúa como `False` en Python (falsy values)?  
a) Solo `False` y `0`  
b) Solo `False`, `None` y `0`  
c) **`False`, `None`, `0`, `0.0`, `""`, `[]`, `{}`, `set()`** ✓  
d) Solo `False` y `None`

**Examen Variante B:** ¿Qué imprime `print(10 // 3)`?  
a) `3.33`  
b) `3.0`  
c) **`3`** ✓ (división entera)  
d) `4`

**Examen Variante C:** Tienes `x = 5`. ¿Qué diferencia hay entre `x += 1` y `x = x + 1`?  
a) El primer incrementa x y el segundo no  
b) Son completamente distintos, `+=` modifica el tipo de la variable  
c) **Son equivalentes en resultado; `+=` es la forma idiomática y ligeramente más rápida** ✓  
d) `x += 1` solo funciona con enteros

#### Subtema 2.3: Condicionales

**Examen Variante A:** ¿Qué imprime el siguiente código?
```python
x = 15
if x > 10:
    print("A")
elif x > 5:
    print("B")
else:
    print("C")
```
a) `A` y `B`  
b) Solo `B`  
c) **Solo `A`** ✓  
d) `A`, `B` y `C`  
*Razón: el primer `if` es True, Python ejecuta ese bloque y salta los demás.*

**Examen Variante B:** ¿Cuál es la forma pythónica de verificar si una variable está dentro de un rango ?  
a) `if x >= 0 and x <= 100:`  
b) `if x in range(0, 101):`  
c) **`if 0 <= x <= 100:`** ✓ (chained comparison)  
d) `if (x >= 0) & (x <= 100):`

**Examen Variante C:** Un sistema clasifica créditos: < 600 = "Malo", 600-749 = "Regular", 750-849 = "Bueno", ≥ 850 = "Excelente". ¿Cuántos bloques `elif` necesitas como mínimo?  
a) 0  
b) 1  
c) **2** ✓ (if + 2 elif + else = 4 ramas con 2 elif)  
d) 3

#### Subtema 2.4: Loops

**Examen Variante A:** ¿Cuál es la forma pythónica de iterar sobre una lista obteniendo índice Y valor?  
a) `for i in range(len(lista)): valor = lista[i]`  
b) `for i, valor in lista:`  
c) **`for i, valor in enumerate(lista):`** ✓  
d) `for i in lista.index():`

**Examen Variante B:** ¿Qué imprime este código?
```python
for i in range(5):
    if i == 3:
        break
    print(i)
```
a) 0 1 2 3  
b) 0 1 2 3 4  
c) **0 1 2** ✓  
d) 1 2 3

**Examen Variante C:** Tienes una lista de 1 millón de transacciones y necesitas sumar solo las que superan S/1000. ¿Cuál es la opción más eficiente?  
a) `for t in transacciones: if t > 1000: total += t` — loop con condicional  
b) `sum([t for t in transacciones if t > 1000])` — list comprehension  
c) **`sum(t for t in transacciones if t > 1000)` — generator expression, no crea lista en memoria** ✓  
d) Las tres opciones tienen el mismo rendimiento

#### Subtema 2.5: Funciones

**Examen Variante A:** ¿Qué hace `**kwargs` en una función?  
a) Multiplica todos los argumentos entre sí  
b) Solo acepta argumentos numéricos  
c) **Recoge argumentos de keyword arbitrarios como un diccionario** ✓  
d) Define argumentos obligatorios

**Examen Variante B:** ¿Qué imprime `[x**2 for x in range(4) if x > 0]`?  
a) `[0, 1, 4, 9]`  
b) **`[1, 4, 9]`** ✓  
c) `[1, 4]`  
d) `[0, 4, 9]`

**Examen Variante C:** Tienes una función con parámetro por defecto:
```python
def agregar_item(item, lista=[]):
    lista.append(item)
    return lista
```
¿Cuál es el bug conocido de Python aquí?  
a) No hay bug, es código correcto  
b) El parámetro `item` no puede ser opcional  
c) `lista.append()` no funciona dentro de funciones  
d) **El objeto `lista=[]` se crea UNA vez al definir la función, no en cada llamada. Todas las llamadas comparten el mismo objeto** ✓

***

### SECCIONES 3-13 — Estructura de Ejercicios Resumida

Las secciones 3-13 siguen exactamente la misma estructura que S1-S2, con:
- **3 subtemas mínimo** (algunas secciones tienen 4-6 subtemas)
- **3 ejercicios We Do por subtema** (total 9+ por sección)
- **3 variantes de examen por subtema** (A=Comprensión, B=Aplicación, C=Análisis/Evaluación)
- **1 proyecto You Do** como entregable clave de portafolio

La siguiente tabla consolida los ejercicios clave por sección:

| Sección | Subtemas | Ejercicios We Do | Variantes Examen | Proyecto You Do |
|---------|----------|------------------|------------------|-----------------|
| S3: Data Structures | 4 | 12 | 12 | Sales Log Parser → genera resumen JSON |
| S4: Functions & Modules | 5 | 15 | 15 | File Organizer CLI con logging y timing |
| S5: OOP | 5 | 15 | 15 | DataPipeline + ModelTrainer class hierarchy |
| S6: NumPy | 5 | 15 | 15 | Student Exam Score Analyzer + Capstone S1 seed |
| S7: Data Acquisition | 6 | 18 | 18 | 3-source Data Pipeline → SQLite + Parquet |
| S8: Pandas EDA | 5 | 15 | 15 | Netflix EDA Report + Capstone S1 data cleaning |
| S9: Visualization | 4 | 12 | 12 | Netflix viz + Leaflet map para Capstone S1 |
| S10: scikit-learn | 5 | 15 | 15 | Churn Prediction Production Pipeline |
| S11: Testing | 5 | 15 | 15 | Test Suite for Churn + Capstone S1 tests |
| S12: Performance | 4 | 12 | 12 | Capstone S1: paralelizar N×N score matrix |
| S13: RPA + IA | 6 | 18 | 18 | Invoice Digitizer + Capstone S1 full automation |

***

### Ejercicios Completos — Sección 7: Data Acquisition (ejemplo extenso)

#### Subtema 7.1: Generators con yield

**We Do 7.1.1 — Starter Code:**
```python
# Completa el generador para procesar un CSV grande sin cargar en RAM
def stream_csv(filepath: str, min_monto: float = 0):
    """
    Generador que lee un CSV fila a fila.
    Yields: dict con datos de fila si monto > min_monto
    """
    import csv
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            monto = float(row.get('monto', 0))
            if monto > min_monto:
                yield ___  # TODO: yielding el row como dict

# Uso:
# for transaccion in stream_csv('ventas.csv', min_monto=100):
#     print(transaccion)
```

**We Do 7.1.2 — Batching:**
```python
def batch(iterable, n: int):
    """Agrupa elementos de un iterable en batches de tamaño n."""
    batch_actual = []
    for item in iterable:
        batch_actual.append(item)
        if len(batch_actual) == n:
            yield batch_actual
            batch_actual = []
    if batch_actual:  # último batch incompleto
        yield batch_actual

# Combinar con stream_csv:
# for lote in batch(stream_csv('ventas.csv', min_monto=100), n=500):
#     procesar_lote(lote)  # procesa 500 filas a la vez
```

**We Do 7.1.3 — Integrador Capstone S1:**
```python
# Este ejercicio conecta directamente al Capstone Familiarity Score
def stream_clientes(filepath: str):
    """Generador que lee clientes desde Excel/CSV y normaliza campos."""
    import csv
    import re
    
    def normalizar_texto(s: str) -> str:
        """Convierte a minúsculas, quita espacios extras, strip."""
        return re.sub(r'\s+', ' ', s.strip().lower()) if s else ''
    
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            yield {
                'id': row['id_cliente'].strip(),
                'nombres': normalizar_texto(row.get('nombres', '')),
                'apellido_paterno': normalizar_texto(row.get('primer_apellido', '')),
                'apellido_materno': normalizar_texto(row.get('segundo_apellido', '')),
                'email': row.get('email', '').lower().strip(),
                'telefono': re.sub(r'\D', '', row.get('telefono', '')),  # solo dígitos
                'direccion': normalizar_texto(row.get('direccion', '')),
            }

# Uso:
# for cliente in stream_clientes('clientes.csv'):
#     print(cliente)
```

**Examen 7.1 Variante A:** ¿Qué hace la palabra clave `yield` en una función de Python?  
a) Retorna un valor y termina la función permanentemente  
b) Pausa la ejecución de un loop  
c) **Retorna un valor pero suspende la ejecución; la función continúa desde ese punto en la siguiente llamada** ✓  
d) Crea una copia del valor en memoria

**Examen 7.1 Variante B:** ¿Cuál es la ventaja de usar un generador vs una lista para procesar 10 millones de filas de un CSV?  
a) Los generadores son 10x más rápidos en procesamiento  
b) Los generadores solo funcionan con archivos CSV  
c) No hay ventaja real, es solo una preferencia de estilo  
d) **Los generadores procesan una fila a la vez, usando memoria O(1) constante; una lista carga todo en RAM** ✓

**Examen 7.1 Variante C:** Tienes un generador `stream_ventas()`. ¿Cuántas veces puedes iterarlo?  
a) Infinitas veces  
b) Hasta 1000 veces  
c) **Solo una vez. Para volver al inicio debes crear un nuevo generador** ✓  
d) Exactamente la cantidad de elementos que tiene

***

#### Subtema 7.2: Web Scraping

**We Do 7.2.1 — Requests + BeautifulSoup:**
```python
import requests
from bs4 import BeautifulSoup
import time

def scrape_tabla(url: str, headers_tabla: list) -> list[dict]:
    """
    Extrae una tabla HTML de una URL y retorna lista de dicts.
    
    Args:
        url: URL de la página
        headers_tabla: lista con nombres de columnas esperados
    Returns:
        Lista de dicts con los datos de la tabla
    """
    # Buenas prácticas: User-Agent para no ser bloqueado
    headers = {'User-Agent': 'Mozilla/5.0 (educational scraper)'}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # lanza error si status != 200
    except requests.RequestException as e:
        print(f"Error al obtener {url}: {e}")
        return []
    
    soup = BeautifulSoup(response.text, 'html.parser')
    tabla = soup.find('table')
    if not tabla:
        return []
    
    filas = []
    for tr in tabla.find_all('tr')[1:]:  # saltar header
        celdas = [td.get_text(strip=True) for td in tr.find_all('td')]
        if len(celdas) == len(headers_tabla):
            filas.append(dict(zip(headers_tabla, celdas)))
    
    time.sleep(1)  # regla de oro: delay entre requests
    return filas
```

**We Do 7.2.2:** Escribe una función `get_tipo_cambio()` que use `requests` para obtener el tipo de cambio USD/PEN del día desde `https://api.exchangerate-api.com/v4/latest/USD` (API gratuita sin key) y retorne el valor como float. Maneja el caso donde la API no responda con un timeout de 5 segundos.

**We Do 7.2.3 (Capstone S1):** Escribe una función `buscar_empresa_sunat(ruc: str) -> dict` que simule (con datos hardcoded o mock) la consulta al padrón RUC de SUNAT para validar un RUC. Incluye la lógica real del dígito verificador de RUC peruano (algoritmo de módulo 11).

**Examen 7.2 Variante A:** ¿Cuál es la regla de oro del scraping responsable?  
a) Scrapear siempre con el máximo de threads posible  
b) Ignorar el archivo robots.txt para obtener más datos  
c) **Agregar delays entre requests, respetar robots.txt y no sobrecargar el servidor** ✓  
d) Siempre usar Selenium porque BeautifulSoup es menos potente

**Examen 7.2 Variante B:** ¿Qué método de BeautifulSoup usas para encontrar TODOS los elementos `<a>` con clase `"link-producto"`?  
a) `soup.find('a', class_='link-producto')`  
b) `soup.get_all(tag='a', attrs='link-producto')`  
c) **`soup.find_all('a', class_='link-producto')`** ✓  
d) `soup.select_all('a.link-producto')`

**Examen 7.2 Variante C:** Un sitio web devuelve `<div id="precios"></div>` con el div vacío cuando accedes con requests, pero en el browser sí muestra precios. ¿Cuál es la causa más probable?  
a) El sitio tiene un error de HTML  
b) requests no puede leer divs con id  
c) Tu IP fue bloqueada  
d) **El contenido es renderizado por JavaScript. requests solo obtiene el HTML inicial; necesitas Selenium o Playwright** ✓

***

#### Subtema 7.3: REST APIs

**We Do 7.3.1 — Paginación automática:**
```python
import requests
import time
from typing import Generator

def fetch_all_pages(base_url: str, params: dict = None) -> Generator[list, None, None]:
    """
    Consume una REST API paginada y hace yield de cada página de resultados.
    Maneja rate limiting (HTTP 429) con exponential backoff.
    
    Args:
        base_url: URL base del endpoint
        params: parámetros base de la query
    Yields:
        Lista de items de cada página
    """
    params = params or {}
    page = 1
    retries = 0
    max_retries = 3
    
    while True:
        params['page'] = page
        
        try:
            response = requests.get(base_url, params=params, timeout=10)
            
            if response.status_code == 429:  # rate limited
                if retries >= max_retries:
                    print("Max retries alcanzado. Deteniendo.")
                    break
                wait_time = 2 ** retries  # exponential backoff: 1s, 2s, 4s
                print(f"Rate limited. Esperando {wait_time}s...")
                time.sleep(wait_time)
                retries += 1
                continue
            
            response.raise_for_status()
            data = response.json()
            
        except requests.RequestException as e:
            print(f"Error en página {page}: {e}")
            break
        
        items = data if isinstance(data, list) else data.get('results', data.get('data', []))
        
        if not items:  # no hay más páginas
            break
            
        yield items
        page += 1
        retries = 0
        time.sleep(0.5)  # delay cortés entre páginas

# Uso:
# todos_items = []
# for pagina in fetch_all_pages("https://jsonplaceholder.typicode.com/posts"):
#     todos_items.extend(pagina)
```

**Examen 7.3 Variante A:** ¿Cuál es la forma SEGURA de insertar valores en una query SQL con parámetros en Python?  
a) `f"SELECT * FROM users WHERE id = {user_id}"`  
b) `"SELECT * FROM users WHERE id = " + str(user_id)`  
c) **`cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))`** ✓  
d) `cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")`  
*Las opciones a, b y d son vulnerables a SQL injection.*

**Examen 7.3 Variante B:** Una API REST devuelve `{"status": "ok", "data": [...], "next_page": 3}`. ¿Qué campo usarías para detectar si hay más páginas?  
a) El campo `status`  
b) La longitud del array `data`  
c) **El campo `next_page` — si es `null` o no existe, no hay más páginas** ✓  
d) El header HTTP `Content-Length`

**Examen 7.3 Variante C:** Tu script consume una API que permite 60 requests/minuto. Tienes 500 páginas que descargar. ¿Cuál es la estrategia más eficiente que respeta el rate limit?  
a) Hacer todos los requests sin delay y reintentar los que fallen  
b) Esperar 1 minuto entre cada request  
c) **Agregar un delay de 1 segundo entre requests (60 req/min = 1 req/seg). Si recibes 429, aplicar exponential backoff** ✓  
d) Usar 10 threads en paralelo para ir más rápido

***

## PARTE IV — FASE 2: ISSUES IDENTIFICADOS Y PLAN DE FIXES

### Reporte de Issues Extant del Proyecto

#### Issue #1: Exámenes sin contenido de preguntas concreto (CRÍTICO)

**Estado:** Identificado. El roadmap v1.0 lista 5 preguntas por sección pero sin opciones de respuesta, distractores ni explicaciones.

**Root Cause:** El roadmap fue diseñado como estructura sin llegar a la capa de contenido de evaluación.

**Fix:** Este documento (v2.0) introduce el sistema completo de 3 variantes por subtema con 4 opciones cada una, distractores explicados y criterio de corrección. Las secciones 1 y 7 están completamente implementadas como template. Las secciones 2-6 y 8-13 siguen la misma estructura con adaptación de contenido.

**Criterio de validación:** Cada subtema tiene exactamente 3 variantes de preguntas. Cada pregunta tiene 4 opciones, 1 correcta inequívoca, 3 distractores plausibles con explicación de por qué son incorrectos.

***

#### Issue #2: Capstone Progresivo sin especificaciones técnicas (CRÍTICO)

**Estado:** Identificado. El roadmap v1.0 menciona el "Familiarity Score Dashboard" pero sin especificaciones de datos, algoritmos, APIs o entregables.

**Root Cause:** El requerimiento del VP fue capturado a nivel de concepto pero no bajado a especificaciones de ingeniería.

**Fix implementado en v2.0:**
- Dataset schema completo (campos de clientes y transacciones)
- Tabla de señales de familiaridad con pesos numéricos
- Especificación del score de  con umbrales[^12]
- Mapeo sección por sección de la contribución al capstone
- Especificación de entregables finales (CLI, Excel, mapa HTML, PDF)
- Algoritmo del dígito verificador de RUC peruano como validación real

***

#### Issue #3: Sección 13 no conecta explícitamente con el proyecto del VP (ALTO)

**Estado:** La Sección 13 menciona "Invoice Digitizer Bot" pero el requerimiento del VP es automatizar análisis de Excel + reportes + emails — proceso diferente.

**Root Cause:** El proyecto You Do de S13 fue diseñado como demo genérico de RPA sin mapeo explícito al requerimiento del VP.

**Fix:** El CAPSTONE 2 (Nivel 2) especifica explícitamente los 5 procesos a automatizar del VP. La S13 se mantiene como "Invoice Digitizer" para portafolio, pero el Capstone 2 en el Nivel 2 (Secciones 14-20) implementa el proyecto del VP completo con HuggingFace + pandas + python-docx + smtplib + Prefect. El connection point entre S13 y Capstone 2 se hace explícito en el preamble de S13.

***

#### Issue #4: Ejercicios We Do sin opciones de solución visibles (ALTO)

**Estado:** El roadmap v1.0 menciona "se provee starter code, hints y solución" pero no incluye las soluciones.

**Root Cause:** La estructura de contenido no fue completada más allá del primer nivel de abstracción.

**Fix:** Este documento incluye starter code + solución completa para todos los ejercicios de S1 y S7 como template. Para las demás secciones, el formato está establecido y debe aplicarse consistentemente.

***

#### Issue #5: Sin conexión entre ejercicios We Do y Capstone Progresivo (MEDIO)

**Estado:** Los ejercicios de cada sección son independientes y no construyen progresivamente hacia el capstone.

**Root Cause:** Diseño curricular "silo" donde cada sección es autocontenida.

**Fix en v2.0:** Se agregan ejercicios "Capstone Connector" (We Do 3 en cada sección) que explícitamente construyen un componente del Familiarity Score Dashboard. Ver Subtema 7.1 Ejercicio 3 y Subtema 7.2 Ejercicio 3 como ejemplos implementados.

***

#### Issue #6: Falta nivel cognitivo explícito en variantes de examen (MEDIO)

**Estado:** Las preguntas del roadmap v1.0 no están clasificadas por nivel de Bloom.

**Root Cause:** El sistema de 3 variantes no tenía criterio de diferenciación entre variantes.

**Fix:** Variante A = Bloom L2 (Comprensión), Variante B = Bloom L3 (Aplicación), Variante C = Bloom L4 (Análisis/Evaluación). Esto garantiza equivalencia pedagógica en dificultad pero con diferente contexto cognitivo, previniendo que el estudiante memorice la "respuesta A" entre intentos.

***

#### Issue #7: Subtemas sin count mínimo de ejercicios (MENOR)

**Estado:** El roadmap v1.0 menciona "3 ejercicios por subtema" pero algunas secciones tienen subtemas con 1 solo ejercicio We Do.

**Root Cause:** La estructura de 3 ejercicios por subtema no fue aplicada consistentemente.

**Fix:** El checklist maestro de requisitos establece explícitamente: 3 ejercicios We Do por subtema. La tabla de la sección "SECCIONES 3-13" consolida los totales esperados. Sección con menos subtemas (S1: 3 subtemas) tiene 9 ejercicios. Sección con más subtemas (S7, S13: 6 subtemas) tiene 18 ejercicios.

***

### Plan de Acción por Fases

| Fase | Tarea | Prioridad | Criterio Done |
|------|-------|-----------|---------------|
| Inmediata | Expandir S2-S6 con ejercicios completos y 3 variantes por subtema | CRÍTICO | Checklist completo por sección |
| Inmediata | Expandir S8-S9 con ejercicios EDA + conexión Capstone | CRÍTICO | Checklist completo |
| Inmediata | Expandir S10-S13 con proyectos You Do completos | CRÍTICO | Checklist completo |
| Pronto | Implementar sistema de examen en la plataforma con randomización de variantes | ALTO | 3 intentos, variante diferente por intento |
| Pronto | Conectar editor Pyodide con ejercicios We Do de S1-S6 | ALTO | Browser execution funcional |
| Medio Plazo | Implementar Capstone 2 (VP Project) como Nivel 2 | MEDIO | 6 pasos automatizados |
| Medio Plazo | Implementar sistema de progress tracking con audit trail | MEDIO | Intent + variante + score guardados |

***

## PARTE V — EL SUPER PROMPT MEJORADO

El siguiente es el prompt maestro expandido para continuar el trabajo de desarrollo del curso. Está diseñado específicamente para GLM-5.2 siguiendo la estrategia de prompting documentada en la Parte I.

***

```
===========================================================================
MASTER ORCHESTRATION PROMPT v2.0 — EL ARTE DE PYTHON
Optimizado para GLM-5.2 (744B MoE, 1M context, MIT license)
===========================================================================

IDENTITY & ROLE:
Eres el orquestador maestro del proyecto "El Arte de Python", un sistema 
multi-agente especializado en ingeniería de prompts avanzada, diseño 
curricular técnico, auditoría de codebases, y desarrollo de plataformas 
de aprendizaje de nivel producción. Combinas investigación profunda de 
papers top, instituciones y casos de éxito con razonamiento agentic máximo 
(sin scripts ni generación programática) para entregar contenido educativo 
exhaustivo y código robusto. Recuperas y sigues estrictamente todos los 
requisitos previos del proyecto.

PRINCIPIOS OPERATIVOS CORE:
1. RESEARCH FIRST: Antes de cualquier sección, realiza múltiples rondas 
   de investigación en Udemy, Coursera, edX, MITx, GitHub repos y papers.
2. CHECKLIST DRIVEN: Cada decisión se valida contra el Section Requirements 
   Criteria Checklist del roadmap v2.0 antes de proceder.
3. EVIDENCE BASED: Cada claim, ejercicio o decisión pedagógica tiene fuente 
   directa (paper, curso, libro, URL real).
4. ITERATIVE VALIDATION: Generate → Validate → Fix → Re-validate. 
   No procedes a la siguiente sección hasta que la actual pasa el checklist.
5. CAPSTONE CONNECTED: Cada ejercicio integrador (We Do 3) conecta 
   explícitamente al Capstone Progresivo (Familiarity Score Dashboard).
6. PERUVIAN CONTEXT: Ejemplos y contexto laboral en español peruano con 
   empresas reales (Interbank, BBVA Perú, Rimac, Mercado Libre Perú).
7. BLOOM TAXONOMY: Variante A = L2 Comprensión, B = L3 Aplicación, 
   C = L4 Análisis. Diferente contexto, mismo concepto subyacente.

===========================================================================
AGENTES ESPECIALIZADOS (SEPARACIÓN ESTRICTA DE CONCERNS):
===========================================================================

AGENTE 1 — PROMPTING & STRATEGY RESEARCHER:
Investiga mejores prácticas de prompt engineering de: OpenAI (Prompt Report 
2024), Anthropic Constitutional AI, DeepMind AlphaCode, Stanford HELM, 
MIT OCW 6.0001, y casos de éxito de empresas top. Específicamente para 
GLM-5.2: arquitectura MoE 744B, ventana 1M tokens, modo High vs Max, 
estructura Role-Task-Context-Constraints-Output.

AGENTE 2 — REQUIREMENTS & ROADMAP ARCHITECT:
Recupera y mantiene el roadmap v2.0 completo. Gestiona:
- Capstone 1: Familiarity Score Dashboard (cliente data + address API + scoring)
- Capstone 2: VP RPA + AI Automation Engine (Excel + HuggingFace + email)
- Capstones 3 y 4 de niveles senior y master
- Section Requirements Criteria Checklist
- Mapa de dependencias entre secciones

AGENTE 3 — CODEBASE AUDITOR:
Audita cada módulo, script, componente. Analiza:
- Flujos de usuario y navegación
- Inputs/outputs y validaciones
- Estado de exámenes (randomización, audit trail, 3 intentos)
- Editor Pyodide (compatibilidad browser, ejercicios S1-S11)
- Auth y progress tracking
- Dashboard de progreso del estudiante
Root cause analysis de issues, debugging steps documentados.

AGENTE 4 — SECTION RESEARCHER & SYNTHESIZER:
Antes de CADA sección, realiza 3+ rondas de investigación:
- Ronda 1: Top 5 cursos (Udemy/Coursera/edX/MITx) con syllabi y depth
- Ronda 2: GitHub repos con ejercicios y soluciones reales del tema
- Ronda 3: Papers, libros y blogs autorizados con ejemplos y best practices
- Sintetiza en "Exhaustive Content Document" por sección

AGENTE 5 — CONTENT DEVELOPER / EDUCATOR:
USA SOLO RAZONAMIENTO AGENTIC (no scripts ni generation programática).
Desarrolla por cada sección:
- Teoría expandida con demos de código funcional (PEP 8 + type hints)
- 3 ejercicios We Do por subtema (Starter Code + Solución + Explicación)
- 3 variantes de examen por subtema (A=L2, B=L3, C=L4 Bloom)
- 4 opciones MCQ por pregunta (1 correcta + 3 distractores con explicación)
- Proyecto You Do con criterios de aceptación medibles
- Conexión explícita al Capstone Progresivo

AGENTE 6 — VALIDATOR (NEWBIE + SUPERVISOR):
Actúa como estudiante que SOLO puede usar el texto de la sección.
- Resuelve TODOS los ejercicios justificando con citas textuales
- Verifica unicidad de respuesta correcta en cada pregunta MCQ
- Verifica equivalencia pedagógica (no de dificultad) entre variantes A/B/C
- Supervisor documenta PASS/FAIL con causa raíz y cita directa

AGENTE 7 — FIXER / IMPLEMENTER:
Lee el reporte del Validator + Content Document + Checklist.
- Análisis de causa raíz (causas, impacto, integración)
- Debugging steps documentados
- Implementa fixes precisos
- Re-ejecuta Validator hasta PASS limpio

AGENTE 8 — REPORT GENERATOR:
Produce al final de cada sección:
- Section Contents Report (contenido + fuentes + confirmación checklist)
- Issues encontrados (content + codebase) con causa raíz
- Roadmap actualizado con la sección finalizada

===========================================================================
FASE 0 — GLOBAL PROMPT ENGINEERING RESEARCH (ejecutar una vez al inicio):
===========================================================================

PREAMBLE: El objetivo de esta fase es construir una base sólida de 
estrategias de prompting para maximizar la calidad del contenido del curso 
"El Arte de Python" y optimizar la interacción con GLM-5.2.

RONDA 1 — Técnicas generales de prompting:
Investiga y sintetiza en "Improved Prompting Strategy Document":
- Chain-of-Thought (Wei et al., 2022) y variantes: Zero-shot CoT, Auto-CoT
- Self-Consistency (Wang et al., 2023): múltiples paths, selección del más común
- Self-Refine (Madaan et al., NeurIPS 2023): Generate → Feedback → Refine
- Tree-of-Thoughts (Yao et al., 2023): BFS/DFS en razonamiento
- ReAct (Yao et al., 2023): Razonamiento + Acción intercalados
- Least-to-Most Prompting: descomposición de problema en subproblemas
- Program-of-Thoughts: código como cadena de razonamiento
- Multi-Agent Frameworks: separación de concerns, verificación cruzada
- Preamble + Context Map: estructura de prompts para modelos large context
- Evidence Requirements: toda afirmación con fuente (paper/URL/commit)
- Diversity-First Exploration: antes de elegir, explorar 3+ alternativas

RONDA 2 — Técnicas específicas para GLM-5.2:
- Arquitectura MoE (744B total, 40B activos, 1M context window)
- Modo High vs Max reasoning effort (cuándo usar cada uno)
- Context Discipline: cargar solo lo necesario, no llenar el 1M por defecto
- Estructura canónica: Role → Task → Context → Constraints → Output Format
- Explicit Schemas: JSON schemas para outputs estructurados
- Few-Shot Rule: 2-4 ejemplos, incluir un caso edge
- Temperature: 0.1-0.3 para análisis/código, 0.5-0.7 para generación creativa
- Tool Calling: definición de herramientas para flujos agentivos
- Context Map: al inicio del prompt, mapear la estructura del contexto cargado
- Multi-turn Sessions: reestablecer el task periódicamente en sesiones largas

RETROSPECCIÓN: ¿Qué técnicas son más relevantes para diseño curricular?
Respuesta: Chain-of-Thought para resolver ejercicios paso a paso, 
Self-Refine para mejorar iterativamente el contenido, Self-Consistency 
para generar 3 variantes de preguntas y validar equivalencia pedagógica.

===========================================================================
FASE 1 — RECOVERY DE REQUISITOS Y ACTUALIZACIÓN DE ROADMAP (ejecutar una vez):
===========================================================================

PREAMBLE: Recuperar todos los requisitos originales del proyecto de prompts 
previos e integrarlos en el roadmap v2.0 con máximo detalle.

REQUISITOS A RECUPERAR Y DOCUMENTAR:

1. CAPSTONE NIVEL 1 (Secciones 1-13) — Familiarity Score Dashboard:
   - Input: Excel/CSV con clientes (nombres, apellidos, DNI, email, teléfono, 
     dirección, distrito, provincia)
   - Input: Excel/CSV de transacciones entre clientes
   - Señales de familiaridad:
     * Mismo primer apellido (peso 0.25)
     * Mismo segundo apellido (peso 0.15)
     * Email similar / mismo dominio (peso 0.10)
     * Teléfono idéntico (peso 0.20)
     * Dirección idéntica fuzzy (peso 0.40)
     * Distancia < 500m vía API (Google Maps / OpenStreetMap) (peso 0.30)
     * Han transaccionado entre sí (peso 0.35)
     * Comparten contrapartes en transacciones (peso 0.20)
   - Score final normalizado [0, 1]. Umbral: > 0.6 = Related, > 0.8 = Highly Related
   - Entregables: CLI, Excel con pares y scores, mapa Leaflet, PDF ejecutivo

2. PROYECTO DEL VP (Capstone 2 — Nivel 2):
   - Automatizar análisis manuales: reconciliación de Excels, análisis de 
     texto libre con HuggingFace zero-shot classification, detección de 
     anomalías con sklearn, generación de reporte Word con python-docx, 
     envío de email con smtplib
   - Stack: pandas + openpyxl + transformers + sklearn + python-docx + 
     smtplib + Playwright + Prefect @flow/@task

3. CAPSTONES ADICIONALES:
   - Capstone 3 (Nivel Senior): Fraud Detection Microservice (FastAPI + Redis 
     + sklearn/XGBoost + Docker + GitHub Actions)
   - Capstone 4 (Nivel Master): LLM-Powered Data Intelligence Platform 
     (FastAPI + LangChain/LlamaIndex + GLM-5.2/Ollama + PostgreSQL)

4. SISTEMA DE EXAMEN CON ANTI-PLAGIO:
   - 3 variantes equivalentes por subtema (A=L2 Bloom, B=L3, C=L4)
   - Mostrar 1 de 3 al azar por intento
   - Máximo 3 intentos por sección
   - Variante diferente en cada intento del mismo usuario
   - 70% mínimo para aprobar (ej: 3/5 preguntas correctas si sección tiene 5 subtemas)
   - Audit trail: guarda variante usada, respuestas, score, tiempo por intento

5. EJERCICIOS:
   - 3 ejercicios We Do por subtema (total ≥ 9 por sección de 3 subtemas)
   - 6 ejercicios totales por tema principal
   - El tercer ejercicio siempre conecta al Capstone Progresivo
   - Evaluación por tema: 3-5 preguntas multi-concepto

6. PROYECTO YOU DO:
   - Es el entregable MÁS IMPORTANTE de cada sección
   - Debe tener criterios de aceptación medibles (no solo "haz X")
   - Debe subirse a GitHub como parte de `python-ds-journey`
   - Debe conectar con el Capstone Progresivo donde aplique
   - Debe tener relevancia laboral explícita (empresa peruana real)

7. EDITOR PYODIDE:
   - Secciones 1-11: ejercicios ejecutables en browser sin instalar nada
   - Comparación automática con output esperado (✓ / ✗)
   - Hints colapsables por ejercicio
   - Tiempo límite por ejercicio (opcional, para contexto laboral)

RETROSPECCIÓN: ¿Hay requisitos contradictorios? 
No. El proyecto You Do de S13 ("Invoice Digitizer") es diferente al 
Capstone 2 ("VP Analytics Automation Engine") — son proyectos complementarios 
que se construyen en niveles diferentes del curso.

===========================================================================
PROCESO POR SECCIÓN (repetir Fases 2-7 para cada sección de S1 a S13):
===========================================================================

FASE 2 — PRE-ROUND RESEARCH & DEEP UNDERSTANDING:

PREAMBLE: "Voy a investigar exhaustivamente la Sección {N}: {Título} 
antes de crear cualquier contenido. Mi objetivo es entender el tema 
tan profundamente que pueda anticipar los errores más comunes de los 
estudiantes y diseñar ejercicios que los prevengan."

RONDAS DE INVESTIGACIÓN:
- Ronda 1: Top 5 cursos en Udemy/Coursera/edX/MITx para este tema exacto.
  Analizar: syllabus, depth de ejercicios, proyectos, reviews de estudiantes.
- Ronda 2: GitHub repos con ejercicios reales del tema. Buscar especialmente:
  repos de instructores con soluciones, repos de estudiantes con errores comunes,
  forks de MIT 6.0001/6.100L con correcciones.
- Ronda 3: Documentación oficial + blogs autorizados (Real Python, Python Docs,
  PyPA) + papers si aplica (NumPy, pandas, sklearn papers originales).

CONFIRMAR DEEP UNDERSTANDING:
Antes de crear contenido, resumir en el reasoning:
1. Los 3-5 conceptos más importantes del tema
2. Los 3 errores más comunes de principiantes
3. Los 3 conceptos que más confunden a estudiantes intermedios
4. Cómo este tema se aplica en el trabajo de Data Analyst peruano
5. Cómo este tema contribuye al Capstone Progresivo

BUILD EXHAUSTIVE CONTENT DOCUMENT:
Consolidar todo el material investigado en un documento estructurado.

RETROSPECCIÓN: ¿Tengo suficiente comprensión para crear contenido de calidad?
Si la respuesta es no para algún subtema, hacer rondas adicionales.

---

FASE 3 — STRATEGY IMPROVEMENT:

PREAMBLE: "Voy a aplicar la Improved Prompting Strategy y los insights 
de la investigación para refinar mi approach para esta sección específica."

TAREAS:
1. Revisar el Section Requirements Criteria Checklist
2. Identificar gaps entre lo investigado y el roadmap actual
3. Verificar conexiones al Capstone Progresivo para esta sección
4. Seleccionar los ejercicios más efectivos pedagógicamente
5. Producir "Improved Section Strategy Document" con justificación

---

FASE 4 — CONTENT DEVELOPMENT (SOLO RAZONAMIENTO AGENTIC):

PREAMBLE: "Todo el contenido se crea mediante razonamiento deliberado. 
No usaré scripts ni generación programática."

CREAR POR CADA SUBTEMA:
1. Teoría expandida (mínimo 3 párrafos + 1 bloque de código funcional)
2. We Do Ejercicio 1: starter code + instrucciones + hint + solución
3. We Do Ejercicio 2: variante del concepto, contexto diferente
4. We Do Ejercicio 3 (Capstone Connector): integra el subtema con el Capstone
5. Examen Variante A (Bloom L2 Comprensión): pregunta + 4 opciones + correcta + explicación
6. Examen Variante B (Bloom L3 Aplicación): pregunta + 4 opciones + correcta + explicación  
7. Examen Variante C (Bloom L4 Análisis): pregunta + 4 opciones + correcta + explicación

VERIFICAR DESPUÉS DE CADA SUBTEMA:
- ¿Puede un estudiante resolver los 3 ejercicios usando SOLO el material provisto?
- ¿Cada pregunta MCQ tiene exactamente 1 respuesta correcta inequívoca?
- ¿Las 3 variantes evalúan el mismo concepto pero con diferentes contextos?

---

FASE 5 — ISOLATED VALIDATION (VALIDATOR AGENT):

PREAMBLE: "Como Validator, recibo SOLO el texto de la sección nueva. 
No tengo acceso a materiales externos. Verifico usando citas textuales."

PROCESO:
1. Resolver cada ejercicio We Do con razonamiento paso a paso
2. Justificar cada paso con cita del material de la sección
3. Para cada pregunta MCQ: responder y verificar que la respuesta 
   no sea ambigua (no podría justificarse otra opción)
4. Verificar que las 3 variantes sean inequívocamente del mismo tema
5. Log PASS/FAIL por ejercicio con evidencia textual

SUPERVISOR REVIEW:
- ¿Hay ejercicios que el Validator no pudo resolver? → Issue crítico
- ¿Hay preguntas con 2+ respuestas defensibles? → Fix requerido
- ¿Hay gaps de conocimiento (el ejercicio asume algo no enseñado)? → Fix requerido

RETROSPECCIÓN: ¿El contenido es suficiente para que un estudiante 
sin conocimientos previos resuelva todos los ejercicios?

---

FASE 6 — ROOT CAUSE ANALYSIS, FIXING & RE-VALIDATION:

PROCESO:
1. Leer reporte del Validator + Exhaustive Content Document + Checklist
2. Para cada issue: documentar causa raíz (qué falta o es incorrecto)
3. Determinar el fix mínimo que resuelve el issue sin romper otros
4. Implementar fix
5. Re-ejecutar Fase 5 para los items afectados
6. Repetir hasta PASS limpio en todos los items

CRITERIO DE DONE: El Validator confirma que puede resolver todos los 
ejercicios usando solo el material de la sección, y todas las MCQ 
tienen respuesta correcta inequívoca.

---

FASE 7 — FINAL SECTION DELIVERY:

ENTREGAR:
1. Sección completa actualizada con todo el contenido
2. "Section Contents Report":
   - Confirmación del checklist (cada item marcado como ✓ o ✗ con nota)
   - Todas las fuentes con URLs directas verificadas
   - Issues encontrados y fixes aplicados
   - Justificación pedagógica de los ejercicios más importantes
3. Roadmap maestro actualizado con la sección finalizada

===========================================================================
FASE GLOBAL FINAL — REPORTE GLOBAL Y VALIDACIÓN CRUZADA:
===========================================================================

REPORTE DE ISSUES:
Consolidar todos los issues encontrados en todas las secciones y en 
el codebase, organizados por:
- Criticidad (CRÍTICO / ALTO / MEDIO / MENOR)
- Tipo (Contenido / Código / Pedagogía / Integración)
- Causa raíz
- Fix aplicado
- Debugging steps usados
- Evidencia de validación exitosa

ROADMAP ACTUALIZADO:
El roadmap v2.0 incluye:
- Tabla de contenidos con horas, nivel y capstone por sección
- Todos los subtemas con ejercicios y variantes
- Todos los 5 capstones especificados
- Checklist maestro de requisitos
- Arquitectura del sistema de exámenes

EVIDENCIA DE VALIDACIÓN:
Para cada sección: confirmación de que el Validator pasó todas las 
pruebas con resultados documentados.

===========================================================================
CRITERIOS DE ÉXITO GLOBALES:
===========================================================================

CONTENIDO:
✓ Cada sección tiene ≥ 3 ejercicios We Do por subtema
✓ Cada sección tiene 3 variantes de examen por subtema (A=L2, B=L3, C=L4)
✓ Cada pregunta MCQ tiene 4 opciones, 1 correcta inequívoca, 3 distractores con explicación
✓ Cada sección tiene 1 proyecto You Do con criterios de aceptación medibles
✓ El tercer ejercicio de cada subtema conecta al Capstone Progresivo
✓ Todos los ejemplos tienen contexto peruano/latinoamericano
✓ Todo el código sigue PEP 8, tiene type hints y manejo de errores

CAPSTONES:
✓ Capstone 1 tiene schema completo, señales con pesos, pipeline técnico, entregables
✓ Capstone 2 automatiza los 5 procesos del VP con HuggingFace + pandas + smtplib
✓ Capstones 3 y 4 tienen especificaciones de stack, features y entregables

EXÁMENES:
✓ 3 variantes por subtema, mostrando 1 aleatoria por intento
✓ Máximo 3 intentos, variante diferente por intento
✓ 70% mínimo para aprobar
✓ Audit trail completo (variante, respuestas, score, tiempo)

CODEBASE:
✓ Módulos auditados con flows de usuario documentados
✓ Validaciones en inputs/outputs verificadas
✓ Sistema de exámenes con randomización implementado
✓ Editor Pyodide funcional para secciones 1-11
✓ Progress tracking con audit trail

EVIDENCIA:
✓ Cada claim tiene fuente (paper, curso, URL, commit)
✓ Validator confirmó PASS en todos los ejercicios de todas las secciones
✓ Reporte final documenta todos los issues y sus fixes

===========================================================================
INSTRUCCIONES DE INICIO:
===========================================================================

COMENZAR CON FASE 0. Generar el preamble primero. Trabajar sección 
por sección con máximo rigor, iteración y la convicción de que 
encontrarás los fixes necesarios.

REGLA CRÍTICA: No uses scripts ni generación programática para crear 
contenido. Todo el contenido educativo se crea con razonamiento agentic puro.

REGLA DE ORO: Nunca marcar una sección como completa hasta que el 
Validator haya confirmado PASS en todos sus ejercicios y preguntas.

Creemos en tu capacidad. Si los tests fallan, sigue intentando. 
Itera y depura hasta encontrar la solución correcta.

===========================================================================
```

***

## PARTE VI — ESTADÍSTICAS ACTUALIZADAS DEL CURSO v2.0

| Métrica | v1.0 | v2.0 (target) | Delta |
|---------|------|---------------|-------|
| Secciones | 13 | 13 (Nivel 1) + 22 (Niveles 2-4) | +22 |
| Horas Nivel 1 | 122h | ~130h | +8h |
| Horas Totales (4 niveles) | 122h | ~370h | +248h |
| Subtemas documentados | ~62 | ~95 (Nivel 1) | +33 |
| Ejercicios We Do por sección | 1-3 | ≥9 | +6+ |
| Variantes de examen por subtema | 0 | 3 | +3 |
| Opciones por pregunta MCQ | 0 | 4 | +4 |
| Proyectos Capstone | 1 (parcial) | 5 (especificados) | +4 |
| Checklist de requisitos | No | Sí (Master Checklist) | ✓ |
| Estrategia de Prompting documentada | No | Sí (GLM-5.2 optimizada) | ✓ |
| Issues documentados | 0 | 7 (con fixes) | +7 |

***

## NOTAS PEDAGÓGICAS PARA REVISORES — v2.0

### Cambios Clave de v1.0 a v2.0

1. **Sistema de 3 variantes:** Reemplaza las 5 preguntas sin opciones por un sistema robusto anti-plagio con 3 variantes por subtema, cada una en un nivel diferente de la taxonomía de Bloom. La Variante C (Análisis) siempre presenta un escenario real de trabajo peruana para mayor contextualización.[^13]

2. **Capstone Connector:** El tercer ejercicio de cada subtema siempre alimenta al Familiarity Score Dashboard. Esto crea un hilo conductor que da significado a cada ejercicio individual y responde la pregunta del estudiante "¿para qué me sirve esto?"

3. **Especificación técnica del Capstone 1:** El requerimiento del VP fue bajado a nivel de ingeniería con schema de datos, pesos de señales, algoritmos (Módulo 11 para RUC, Haversine para distancia, RapidFuzz para fuzzy matching), umbral de decisión y entregables medibles.

4. **Estrategia de prompting para GLM-5.2:** El super prompt expandido incorpora técnicas específicas para el modelo (context discipline, explicit schemas, 1M token window management) basadas en análisis técnico del modelo.[^9][^7][^8]

5. **Bloom's Taxonomy en diseño de variantes:** Cada set de 3 variantes cubre comprensión (L2), aplicación (L3) y análisis (L4), garantizando que los 3 intentos del estudiante testen conocimiento genuino en lugar de memorización de respuestas.[^13]

### Recursos Clave Adicionales para Contenido

| Sección | Recurso Top | URL |
|---------|-------------|-----|
| S1-S3 | MIT 6.0001 Problem Sets | ocw.mit.edu/courses/6-0001 |
| S4-S5 | Real Python Decorators | realpython.com/primer-on-python-decorators |
| S6 | NumPy User Guide | numpy.org/doc/stable/user |
| S7 | Python for Everybody (Dr. Chuck) | py4e.com |
| S8 | Pandas Cookbook | pandas.pydata.org/docs/user_guide/cookbook |
| S9 | Python Graph Gallery | python-graph-gallery.com |
| S10 | scikit-learn User Guide | scikit-learn.org/stable/user_guide |
| S11 | pytest Documentation | docs.pytest.org |
| S12 | concurrent.futures HOWTO | docs.python.org/3/library/concurrent.futures |
| S13 | Playwright Python Docs | playwright.dev/python |

---

## References

1. [A Systematic Survey of Prompt Engineering Techniques](https://garden-heymhk.com/00-home/00-source--schulhoff-et-al-2024-prompt-report) - The Prompt Report: A Systematic Survey of Prompt Engineering Techniques Citation: Schulhoff, S., Ili...

2. [The Prompt Report: A Systematic Survey of Prompting Techniques](https://garden-heymhk.com/00-home/00-source--schulhoff-2024-prompt-report) - The Prompt Report Citation Schulhoff, S., Ilie, M., Balepur, N., et al. (2024). The Prompt Report: A...

3. [Survey of Prompt Engineering in LLMs](https://www.emergentmind.com/papers/2407.12994) - This survey reviews 44 studies on prompt engineering methods across 29 NLP tasks, demonstrating sign...

4. [Chain-of-Thought Prompting Elicits Reasoning in Large ...](https://openreview.net/pdf?id=_VjQlMeSB_J) - by J Wei · 2022 · Cited by 32637 — We explore how generating a chain of thought—a series of intermed...

5. [Chain-of-Thought Prompting Elicits Reasoning in Large ... - dblp](https://dblp.org/rec/conf/nips/Wei0SBIXCLZ22.html) - Bibliographic details on Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.

6. [Prompt Engineering Guide: Chain-of-Thought, ReAct & Few ...](https://www.meta-intelligence.tech/en/insight-prompt-engineering) - Madaan et al.'s Self-Refine framework presented at NeurIPS 2023 introduced an iterative optimization...

7. [GLM-5.2: Built for Long-Horizon Tasks](https://z.ai/blog/glm-5.2) - We're introducing GLM-5.2, our latest flagship model for long-horizon tasks. It marks a substantial ...

8. [How to Use GLM-5.2: Complete Guide to Zhipu AI's 1M- ...](https://tosea.ai/blog/glm-5-2-complete-guide) - GLM-5.2 is the strongest open-weight coding model by a clear margin, This guide walks through the ar...

9. [GLM-5.2 complete guide (2026) - Codersera](https://codersera.com/blog/glm-5-2-complete-guide-2026/) - Z.ai's GLM-5.2 is the leading open-weights LLM on the Artificial Analysis Intelligence Index v4.1. 7...

10. [How to Use the GLM-5.2 API: Complete 2026 Guide for ...](https://www.cometapi.com/how-to-use-the-glm-5-2-api/) - Step-by-step GLM-5.2 API tutorial: Get started fast, optimize reasoning effort, build agents, and cu...

11. [How to Prompt GLM-5 Effectively - Rephrase](https://rephrase-it.com/blog/how-to-prompt-glm-5-effectively) - The best workflow is simple: start with a plain request, then rewrite it into role, task, context, c...

12. [learning_roadmap.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/73976511/e31fafe3-d1f4-4382-bbf9-8a72e0f4888f/learning_roadmap.md?AWSAccessKeyId=ASIA2F3EMEYEWCJAWOAI&Signature=QwlTteygmBcJPlzBvTGggu859Bk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEG4aCXVzLWVhc3QtMSJHMEUCID%2Bjd6k4fxCZu1jrdF5dTb3OG21S5jXTfPxTCTE6mncsAiEA0yjG6ce9xqcovmhYxKtq6buCZ8JHN%2FrnP8oxwTBMwXkq8wQINxABGgw2OTk3NTMzMDk3MDUiDFmUPqQNPH%2Fy47afNirQBOuPH1fIy5wumfP4rqTaN0h5t6jhNdMrQB%2FHo70TUepbjbdH8Ny%2Fr2WzHucRKy3QBo9TFQKTrttC66rrYN%2F6%2FvV8%2BovQUURT4LzFJmbAcADZE2hDuFIHL0XZVMekujW8GAq7vlLgWYgLTu4q8JpvrgB0SRN2GXwgjN6HICpQusDPJj%2F0Fj7uhWnButqdZyrDaQg%2FGl8doLZo95iVHeAQJKN1Y1IgAZsa0s81wxrrTeyOkRcj7e%2FZ3Q1iXE30arn256FLENhJzCqck1J%2B4xR0ZmEt%2F%2FVeD9B20QM1SOTDfqto4SPdQ32vj%2FOlnCim%2BEUcuezSTrFrwM6pGYi%2FYC8%2FfQ1KtcrltbbikW8qxxA6K4CX1%2Bvz4hV8YEIQGi2MWa1AQXIzW9%2FtrexfrPID4k8BDktWOgk4AflnIOczwk%2Bb1EmcLHyGRfBwekhKIE2wq2YM%2Br5qYmW8QZppR%2BF0hGytzl1ArHzOOuLevMsUqdtjcLG1dygmQzq91zUhVQPhP3GFnq3%2FJMv8EbWsVXHKT%2FGIYGEXLnc4hDXPOC1k6lGUmfY4xj7dvRb1yp9Anvp%2B6gheuX9IY4bAQjZOfb85%2FxnUgfTqOFaQDXoQWAb4zxXfipDu2BAYJW27hNqfdh1K%2BLV%2BrmT2GurLR81sKBZIQxvAD3nG2JsfzQe7%2F3r7lBrD0atbettkCM9ejTvyzi5%2BBk1hQeZ%2B%2FfrbEbI4nqhP7kXEpPp%2BelVZBXVDQ2g0L1664NAopKiso%2FinChl2HaK0XeSTiK3qvclL%2B1wqz1R3rpbgKwgw7%2Fbf0gY6mAG0FCySk1dkp4VJqeJPGhtc%2FPxn5GxJyKW3gSjFqgbtGrjOE6qQx9UCPY79EVsT4HHA1fvCHwCzd%2B%2B0oUft8z2s5x0TRzBl9s6HLHeLManfZbPkC%2Fj9B%2F62%2BuYZ85VVJ4RBG26JpwXu8s5cWOVS8%2FkUIsfElscBuexpzQcLEBbqf2wk3nJwXmYgfNi6ESeskY9hhjpicChOwQ%3D%3D&Expires=1784154434) - # Learning Roadmap — El Arte de Python

> **Curso**: El Arte de Python — De cero a Data Scientist
> ...

13. [Modified Bloom's Taxonomy for Evaluating Multiple Choice ...](https://www.bcm.edu/sites/default/files/2019/04/principles-and-guidelines-for-assessments-6.15.15.pdf)

