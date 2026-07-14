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

---

## Flujo de Aprendizaje

```
Secciones 1-6: Fundamentos de Python (Setup → Basics → Data Structures → Functions → OOP → NumPy)
                  ↓
Sección 7: Adquisición de Datos (scraping, regex, SQL, APIs, generators) ← NUEVA
                  ↓
Secciones 8-9: Análisis y Visualización (Pandas → Visualization con Leaflet)
                  ↓
Secciones 10-11: ML y Testing (scikit-learn → pytest + CI)
                  ↓
Secciones 12-13: Producción y Automatización (Performance/Logging → RPA con IA)
                  ↓
CAPSTONE PROGRESIVO: Familiarity Score Dashboard (Excel upload → entity resolution → mapa → scoring)
```

### Capstone Progresivo: Familiarity Score Dashboard

El **Familiarity Score Dashboard** (feature solicitada por el VP) se integra como un capstone progresivo que se construye a lo largo de múltiples secciones:

- **Sección 6 (NumPy)**: Procesamiento vectorizado de datos de clientes
- **Sección 7 (Data Acquisition)**: Adquirir datos de clientes desde Excel/CSV/SQL
- **Sección 8 (Pandas)**: EDA y limpieza de datos demográficos
- **Sección 9 (Visualization)**: Mapa interactivo con Leaflet mostrando ubicación de clientes
- **Sección 12 (Performance)**: Optimizar el algoritmo de entity resolution para datasets grandes
- **Sección 13 (RPA)**: Automatizar el pipeline completo (Excel → análisis → reporte)

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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


### Auto-evaluación (conceptos evaluados)

*Examen con 3 intentos máximo, 3 variantes por concepto (anti-plagio), 70% para aprobar.*

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

## Estadísticas del curso

| Métrica | Valor |
|---|---|
| Total de secciones | 13 |
| Horas estimadas totales | 122h |
| Objetivos de aprendizaje | 96 |
| Bloques de teoría | 62 |
| Ejercicios I Do | 34 |
| Ejercicios We Do | 22 |
| Proyectos de portafolio | 13 |
| Preguntas de auto-evaluación | 65 |
| Recursos externos | 92 |

## Notas pedagógicas para revisores

### Metodología I Do / We Do / You Do

Cada sección sigue el framework **Gradual Release of Responsibility** (Corwin/Ferry 2014):

1. **I Do (Yo hago)**: El instructor demuestra con código real, explicando el "por qué" de cada decisión
2. **We Do (Hacemos juntos)**: El estudiante practica con starter code, hints y solución para comparar
3. **You Do (Tú haces)**: Proyecto independiente para portafolio GitHub
4. **Auto-evaluación**: Quiz con feedback inmediato (sin login) o examen con anti-plagio (con login)

### Sistema de exámenes con anti-plagio

- **3 variantes equivalentes** por concepto (3 preguntas diferentes que evalúan el mismo aprendizaje)
- Selección aleatoria de UNA variante por intento (no se repite entre intentos del mismo usuario)
- Máximo **3 intentos** por sección (2 retries)
- **70% mínimo** para aprobar
- Audit trail completo: cada intento guarda qué variante se usó, respuestas, score y tiempo

### Editor interactivo con Pyodide

- Las secciones 1-11 incluyen un **editor Python en el browser** (Pyodide/WebAssembly)
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
