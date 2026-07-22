# NEWBIE_B selfcheck 01–26 (agentic_B2, Skeptic)

- **attempt_id:** `agentic_B2`
- **method:** `llm_packet_only_no_generator`
- **persona:** `skeptic`
- **source:** `section_XX/packet.json` → `active.selfCheck_stems` + theory/iDo quotes
- **justifications:** start with `B2-Skeptic:` and quote the card
- **exercises:** preserved unchanged
- **boundary:** no correctIndex, no solutions, no other-attempt answers, no TypeScript, no code-exec

| sec | n | indices | title |
|-----|---|---------|-------|
| 01 | 5 | `[1, 2, 2, 2, 1]` | Setup & Entorno de Desarrollo |
| 02 | 5 | `[1, 1, 1, 1, 1]` | Valores, tipos, operadores e I/O |
| 03 | 5 | `[1, 1, 3, 1, 1]` | Decisiones y reglas de validación |
| 04 | 5 | `[1, 1, 1, 1, 2]` | Iteración y resúmenes transaccionales |
| 05 | 5 | `[2, 1, 2, 0, 1]` | Funciones, contratos y descomposición |
| 06 | 5 | `[1, 1, 2, 1, 1]` | Colecciones y estructuras de datos |
| 07 | 5 | `[1, 1, 1, 1, 2]` | Texto, Unicode y expresiones regulares |
| 08 | 5 | `[1, 1, 2, 1, 1]` | Archivos, CSV, JSON y contratos de ingesta |
| 09 | 6 | `[1, 1, 1, 1, 1, 1]` | Excepciones, debugging y logging seguro |
| 10 | 6 | `[1, 1, 1, 1, 1, 0]` | Módulos, packaging y CLI profesional |
| 11 | 6 | `[1, 1, 1, 1, 1, 1]` | OOP y modelo de dominio |
| 12 | 5 | `[1, 1, 1, 1, 2]` | APIs, SQL y geodatos responsables |
| 13 | 5 | `[1, 2, 1, 1, 1]` | Familiarity Evidence Dashboard y cierre de nivel |
| 14 | 4 | `[1, 1, 1, 1]` | NumPy y cómputo vectorizado |
| 15 | 4 | `[1, 1, 1, 1]` | Pandas: ingesta, selección y tipos |
| 16 | 4 | `[1, 0, 1, 1]` | Calidad, limpieza y contratos de datos |
| 17 | 4 | `[1, 0, 1, 1]` | Joins, reshape, groupby y cierre analítico |
| 18 | 4 | `[1, 1, 1, 1]` | EDA, estadística descriptiva e incertidumbre |
| 19 | 4 | `[1, 1, 1, 1]` | Visualización y comunicación accesible |
| 20 | 4 | `[1, 1, 1, 1]` | Automatización robusta de Excel |
| 21 | 4 | `[1, 1, 1, 1]` | Documentos, plantillas y reportes trazables |
| 22 | 4 | `[1, 2, 1, 1]` | Email, identidad y aprobación humana |
| 23 | 4 | `[1, 2, 1, 1]` | Browser RPA con Playwright |
| 24 | 4 | `[2, 1, 1, 1]` | OCR y Document AI |
| 25 | 4 | `[1, 1, 1, 1]` | Endpoints de IA, Hugging Face y prompting evalua |
| 26 | 4 | `[1, 1, 1, 1]` | Orquestación y VP RPA + AI Analyst |

## Per-section choices

### S01 — Setup & Entorno de Desarrollo
- **Q0 [1]** (conf=0.88): Para aislar las dependencias (paquetes) por proyecto y evitar conflictos de versiones
  - ¿Para qué sirve un entorno virtual (venv) en Python?
- **Q1 [2]** (conf=0.9): .venv/ (o venv/)
  - ¿Cuál de los siguientes archivos SÍ debería estar en tu .gitignore?
- **Q2 [2]** (conf=0.9): "feat: agregar cálculo de churn por segmento"
  - ¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?
- **Q3 [2]** (conf=0.88): pip install -r requirements.txt
  - ¿Qué comando te permite replicar el entorno de otro desarrollador?
- **Q4 [1]** (conf=0.92): Porque suele contener credenciales (API keys, passwords, tokens) que son secretos
  - ¿Por qué NO debes subir el archivo .env a GitHub?

### S02 — Valores, tipos, operadores e I/O
- **Q0 [1]** (conf=0.9): NoneType
  - ¿Cuál es el tipo de None en Python?
- **Q1 [1]** (conf=0.92): str y False
  - ¿Qué imprime type("42").__name__ y la comparación 42 == "42"?
- **Q2 [1]** (conf=0.88): Porque no es una cantidad aritmética y puede necesitar ceros o formato
  - ¿Por qué el teléfono de un cliente de intake se modela como str?
- **Q3 [1]** (conf=0.92): [1, 2, 3]
  - Tras `b = a` con `a = [1, 2]` y `b.append(3)`, ¿qué vale `a`?
- **Q4 [1]** (conf=0.94): if x is None:
  - ¿Cuál es el idioma correcto para comprobar ausencia de valor?

### S03 — Decisiones y reglas de validación
- **Q0 [1]** (conf=0.9): if campo is None:
  - ¿Cuál es la forma correcta de chequear ausencia de un campo opcional en un validador?
- **Q1 [1]** (conf=0.92): Se ejecuta esa rama y se omiten las siguientes
  - En una cadena if/elif/else, ¿qué ocurre cuando la primera condición es verdadera?
- **Q2 [3]** (conf=0.92): "default"
  - ¿Qué devuelve la expresión `"" or "default"` en Python?
- **Q3 [1]** (conf=0.88): Un set de literales y el operador in
  - Una allowlist de tipos de documento se implementa mejor como…
- **Q4 [1]** (conf=0.86): Cuando el sujeto es un literal/estado finito (códigos) y hay case _
  - ¿Cuándo aporta más claridad `match/case` que `if` en un motor de reglas introductorio?

### S04 — Iteración y resúmenes transaccionales
- **Q0 [1]** (conf=0.94): [0,1,2]
  - ¿Qué produce list(range(3))?
- **Q1 [1]** (conf=0.9): Empareja solo (1,10) y (2,20); el 3 se pierde en silencio
  - zip([1,2,3],[10,20]) sin strict…
- **Q2 [1]** (conf=0.88): n_total de registros procesados (intentados)
  - Para la tasa de reject del gate, el denominador debe ser…
- **Q3 [1]** (conf=0.92): Salta al siguiente ciclo del bucle
  - ¿Qué hace continue en un for de líneas de intake?
- **Q4 [2]** (conf=0.88): O(n²)
  - Un doble for anidado sobre n elementos es aproximadamente…

### S05 — Funciones, contratos y descomposición
- **Q0 [2]** (conf=0.92): None
  - Si una función no tiene return, ¿qué devuelve la llamada?
- **Q1 [1]** (conf=0.94): El default mutable se comparte entre llamadas
  - ¿Por qué `def f(xs=[])` es peligroso?
- **Q2 [2]** (conf=0.9): Mismo input → mismo output, sin efectos colaterales
  - Una función pura…
- **Q3 [0]** (conf=0.92): Local, Enclosing, Global, Builtin
  - LEGB significa…
- **Q4 [1]** (conf=0.9): f(f(x)) == f(x) para entradas del dominio
  - Idempotencia de un normalizador f significa…

### S06 — Colecciones y estructuras de datos
- **Q0 [1]** (conf=0.92): [3,4]
  - ¿Qué produce xs[-2:] si xs = [1,2,3,4]?
- **Q1 [1]** (conf=0.92): a también ve el append (alias)
  - b = a (listas) y mutas b.append(1). ¿Qué pasa con a?
- **Q2 [2]** (conf=0.88): Listar conflicto en conflicts sin silenciar
  - Para reportar dos filas con mismo id y payload distinto debes…
- **Q3 [1]** (conf=0.94): None (muta in-place)
  - rows.sort(key=...) retorna…
- **Q4 [1]** (conf=0.9): salidas deterministas/reproducibles
  - json.dumps(..., sort_keys=True) ayuda a…

### S07 — Texto, Unicode y expresiones regulares
- **Q0 [1]** (conf=0.92): Formas Unicode distintas (NFC vs NFD)
  - ¿Por qué 'José' y 'Jose\u0301' pueden fallar en == ?
- **Q1 [1]** (conf=0.88): Marcar review y conservar raw
  - En nombres latam, si solo hay un token, la política segura es…
- **Q2 [1]** (conf=0.9): Cuando la transformación es literal/simple
  - ¿Cuándo preferir str.replace/split sobre regex?
- **Q3 [1]** (conf=0.92): None (no es full match)
  - fullmatch(r'\d{8}', 'DNI 12345678') devuelve…
- **Q4 [2]** (conf=0.9): Ir a review con evidencia (raw, score)
  - Un Jaccard 0.67 entre nombres debe…

### S08 — Archivos, CSV, JSON y contratos de ingesta
- **Q0 [1]** (conf=0.9): Evita depender del locale del SO (p. ej. Windows)
  - ¿Por qué declarar encoding='utf-8' al abrir texto?
- **Q1 [1]** (conf=0.92): escribir temp y os.replace al destino
  - Escritura atómica típica es…
- **Q2 [2]** (conf=0.9): Ir a cuarentena con motivo
  - Una fila CSV con columnas de más debe…
- **Q3 [1]** (conf=0.92): n_in == n_clean + n_quarantine
  - Reconciliación del manifest exige…
- **Q4 [1]** (conf=0.92): Fallar (exit non-zero) / fail closed
  - Si reconcile falla, el pipeline debe…

### S09 — Excepciones, debugging y logging seguro
- **Q0 [1]** (conf=0.92): Encadenar la causa en __cause__ sin perder contexto
  - ¿Para qué sirve `raise NewError(...) from e`?
- **Q1 [1]** (conf=0.9): Fail-fast (abortar el job)
  - Un delimiter vacío en config del job debería…
- **Q2 [1]** (conf=0.9): Solo datos; diagnóstico a stderr
  - ¿Qué va a stdout en una CLI bien diseñada?
- **Q3 [1]** (conf=0.88): a***@ejemplo.pe
  - mask_email('ana@ejemplo.pe') de forma segura podría ser…
- **Q4 [1]** (conf=0.9): Puede reintentarse con backoff; ValueError de datos no
  - TimeoutError en un fetch remoto típico…
- **Q5 [1]** (conf=0.92): La entrada más pequeña que reproduce el bug
  - ¿Cuál es un buen minimal repro?

### S10 — Módulos, packaging y CLI profesional
- **Q0 [1]** (conf=0.92): Ejecutar el CLI/demo solo al correr el módulo, no al importar
  - ¿Para qué sirve `if __name__ == '__main__'`?
- **Q1 [1]** (conf=0.9): flags > env > file > defaults
  - Precedencia correcta de config…
- **Q2 [1]** (conf=0.9): Error de uso/parseo de argumentos
  - Exit code 2 en CLI argparse suele significar…
- **Q3 [1]** (conf=0.9): stderr
  - ¿Dónde van los logs de progreso?
- **Q4 [1]** (conf=0.86): minor
  - Añadir un subcomando nuevo compatible es tipicamente…
- **Q5 [0]** (conf=0.94): .env con API_TOKEN
  - ¿Qué no debe ir al git del paquete?

### S11 — OOP y modelo de dominio
- **Q0 [1]** (conf=0.94): Evita el default mutable compartido entre instancias
  - ¿Por qué `field(default_factory=list)` y no `= []`?
- **Q1 [1]** (conf=0.92): Una señal/dato numérico, no un veredicto de fraude o familia
  - RelationshipEvidence.signal_score representa…
- **Q2 [1]** (conf=0.9): Definir un puerto get/save implementable por fakes y adapters
  - Un Protocol EntityStore sirve para…
- **Q3 [1]** (conf=0.9): En la construcción (__post_init__/validate)
  - Objeto inválido: ¿cuándo fallar?
- **Q4 [1]** (conf=0.88): A menudo es frágil; composición (Client tiene PersonInfo) suele bastar
  - Client hereda de Person…
- **Q5 [1]** (conf=0.92): is_fraud() automático
  - ¿Qué no debe tener el dominio de familiaridad?

### S12 — APIs, SQL y geodatos responsables
- **Q0 [1]** (conf=0.9): Tratarse como error de cliente (no retry ciego)
  - Un 400 Bad Request del proveedor debe…
- **Q1 [1]** (conf=0.94): En variable de entorno / secret store
  - ¿Dónde debe vivir el token de API?
- **Q2 [1]** (conf=0.94): Inyección / inseguro; usar placeholders `?`
  - SQL con f-string e input de usuario es…
- **Q3 [1]** (conf=0.9): Viola la política de egress de CP-N1-C
  - Enviar document_id bancario a un geocoder público…
- **Q4 [2]** (conf=0.9): Una geoseñal de relación, no un veredicto
  - 1.2 km entre dos entidades sintéticas implica…

### S13 — Familiarity Evidence Dashboard y cierre de nivel
- **Q0 [1]** (conf=0.9): Mantenerse separados en la ficha de caso
  - entity_resolution_score y relationship_signal_score deben…
- **Q1 [2]** (conf=0.9): Error de matching; no es veredicto legal de fraude
  - Un false positive de ER implica…
- **Q2 [1]** (conf=0.92): Encolar needs_review / abstenerse según política
  - En zona gris de score el sistema debe…
- **Q3 [1]** (conf=0.88): Privacy sheet, acceso, tests, demo y runbook
  - CF-1 en S13 incluye…
- **Q4 [1]** (conf=0.88): Re-chequear paths críticos S01–S13 en runbook (sin editar ledger aquí)
  - Level-1 regression notes en el You Do exigen…

### S14 — NumPy y cómputo vectorizado
- **Q0 [1]** (conf=0.92): dtype
  - ¿Qué atributo del ndarray indica el tipo homogéneo de sus elementos?
- **Q1 [1]** (conf=0.9): Filtrar o seleccionar elementos que cumplen la condición
  - Una máscara booleana a > 0.5 se usa principalmente para:
- **Q2 [1]** (conf=0.88): Por columna (colapsa filas)
  - axis=0 en una reducción sobre una matriz 2D suele agregar:
- **Q3 [1]** (conf=0.9): Puede mutar el array base porque suele ser un view
  - Mutar un slice simple de un ndarray normalmente:

### S15 — Pandas: ingesta, selección y tipos
- **Q0 [1]** (conf=0.92): loc
  - ¿Qué método de selección usa etiquetas de index/columnas?
- **Q1 [1]** (conf=0.9): Asignación sobre slices que pueden ser view/copy (chained assignment)
  - SettingWithCopyWarning se relaciona con:
- **Q2 [1]** (conf=0.92): Convierte inválidos a NaN
  - errors='coerce' en to_numeric:
- **Q3 [1]** (conf=0.88): Filas, columnas y provenance/hash del artefacto
  - Un manifest de export debería incluir al menos:

### S16 — Calidad, limpieza y contratos de datos
- **Q0 [1]** (conf=0.92): Generar violación/cuarentena o fail del gate
  - Un campo required con null debe:
- **Q1 [0]** (conf=0.9): Misma clave con atributos distintos
  - Conflicto de duplicados significa:
- **Q2 [1]** (conf=0.92): Conservar filas rechazadas con razón
  - La cuarentena debe:
- **Q3 [1]** (conf=0.9): Fallar de forma explicable con el nombre de la columna
  - Ante schema drift (columna required faltante):

### S17 — Joins, reshape, groupby y cierre analítico
- **Q0 [1]** (conf=0.9): Fallar si la cardinalidad no es 1:1
  - validate='one_to_one' en merge sirve para:
- **Q1 [0]** (conf=0.9): Filas del left sin match en right
  - Un anti-join left_only identifica:
- **Q2 [1]** (conf=0.9): Reinyecta el agregado al shape original
  - transform en groupby:
- **Q3 [1]** (conf=0.92): Incluyes datos posteriores al cutoff en features/métricas del pasado
  - Leakage temporal ocurre cuando:

### S18 — EDA, estadística descriptiva e incertidumbre
- **Q0 [1]** (conf=0.9): Mediana (y opcionalmente IQR)
  - ¿Qué comunica mejor un ticket “típico” con outliers fuertes?
- **Q1 [1]** (conf=0.92): Asociación observada (no causal por sí sola)
  - Una correlación alta entre X e Y implica:
- **Q2 [1]** (conf=0.92): Origen, filtros, n y límites de cobertura
  - ¿Qué debe incluir un data note mínimo?
- **Q3 [1]** (conf=0.92): La muestra no representa la población de interés
  - El sesgo de muestra ocurre cuando:

### S19 — Visualización y comunicación accesible
- **Q0 [1]** (conf=0.92): Barras con baseline 0
  - Para comparar magnitudes entre categorías, ¿qué chart es usualmente preferible?
- **Q1 [1]** (conf=0.9): Repetir los mismos números clave del chart
  - Una alternativa accesible debe:
- **Q2 [1]** (conf=0.94): Sobreclaim / generalización indebida
  - “Lima es la mejor región del Perú” a partir de una muestra web es:
- **Q3 [1]** (conf=0.9): Unidad, fuente y limitaciones
  - El caption de un gráfico de portfolio debe incluir:

### S20 — Automatización robusta de Excel
- **Q0 [1]** (conf=0.92): No; suele devolver la fórmula o cache si existe
  - openpyxl sin Excel instalado evalúa fórmulas automáticamente:
- **Q1 [1]** (conf=0.92): Escribir en la celda ancla (top-left)
  - Al escribir en celdas combinadas debes:
- **Q2 [1]** (conf=0.88): Estados de batch, conciliación y backups
  - Un manifest del excel factory debe permitir auditar:
- **Q3 [1]** (conf=0.92): Misma entrada → mismo resultado lógico
  - Idempotencia significa:

### S21 — Documentos, plantillas y reportes trazables
- **Q0 [1]** (conf=0.9): Para reutilizar presentación y auditar métricas en Python
  - ¿Por qué separar datos y plantilla Jinja?
- **Q1 [1]** (conf=0.9): OCR / tratamiento de imagen
  - Un PDF con casi sin caracteres en capa de texto suele requerir:
- **Q2 [1]** (conf=0.9): Mismas métricas clave en dashboard, Excel y documento
  - Paridad en el Reporting Factory significa:
- **Q3 [1]** (conf=0.88): Provenance, checklist visual y hallazgos trazables
  - El cierre de contenido de CP-N2-B incluye:

### S22 — Email, identidad y aprobación humana
- **Q0 [1]** (conf=0.94): Solo drafts/.eml en sandbox y aprobación humana
  - ¿Qué garantiza no enviar correo real en el gate de S22?
- **Q1 [2]** (conf=0.92): Solo evidencia débil de contacto a revisar; no prueba de fraude
  - Un score alto de similitud entre dos emails implica:
- **Q2 [1]** (conf=0.92): Solo los scopes mínimos (p. ej. draft) necesarios
  - Least privilege en OAuth de correo significa:
- **Q3 [1]** (conf=0.92): Reutilizar el mismo draft_id si la key existe
  - La idempotency key al reintentar create_draft debe:

### S23 — Browser RPA con Playwright
- **Q0 [1]** (conf=0.92): Refleja la UI accesible y suele ser más estable
  - ¿Por qué preferir get_by_role a CSS nth-child?
- **Q1 [2]** (conf=0.94): Detenerse y hacer handoff humano
  - Ante un CAPTCHA el robot debe:
- **Q2 [1]** (conf=0.92): Buscar integración no-UI antes de automatizar el browser
  - API/export primero significa:
- **Q3 [1]** (conf=0.92): Solo fallas transitorias (timeout/red), no captcha/403 de negocio
  - Un retry seguro reintenta:

### S24 — OCR y Document AI
- **Q0 [2]** (conf=0.92): Abstener y encolar revisión
  - ¿Qué haces si confidence de RUC es 0.6?
- **Q1 [1]** (conf=0.92): Cola de revisión / corrección
  - Un mismatch total vs líneas implica:
- **Q2 [1]** (conf=0.92): Los campos críticos pueden fallar aunque el global se vea bien
  - ¿Por qué medir accuracy por campo?
- **Q3 [1]** (conf=0.9): Gate reject/review por mime no permitido
  - Archivo application/zip en intake de facturas:

### S25 — Endpoints de IA, Hugging Face y prompting evaluado
- **Q0 [1]** (conf=0.92): Cuando el problema es determinista y auditabilidad importa
  - ¿Cuándo preferir reglas a LLM?
- **Q1 [1]** (conf=0.92): Se descarta / human review
  - Salida del generador sin JSON válido:
- **Q2 [1]** (conf=0.92): Tratando el texto como untrusted y filtrando/ no elevando a system
  - Prompt injection desde un PDF OCR se mitiga:
- **Q3 [1]** (conf=0.94): Nunca de forma autónoma en este curso; solo evidencia para humano
  - El AI assist puede etiquetar fraude solo:

### S26 — Orquestación y VP RPA + AI Analyst
- **Q0 [1]** (conf=0.94): Approve antes de draft_email
  - El orden draft_email respecto a approve es:
- **Q1 [1]** (conf=0.9): Tests críticos de capstones N2, E2E y controles de privacidad/seguridad
  - La regresión N2 incluye:
- **Q2 [1]** (conf=0.94): Incidente P0
  - Un send sin approve es:
- **Q3 [1]** (conf=0.94): 0 — solo evidencia para humanos
  - fraud_labels automáticos en el VP deben ser:

## Sample justifications (S01 Q0, S16 Q1, S26 Q2)
- S01 Q0: B2-Skeptic: card «Por qué el setup importa más de lo que crees» — quote: «La regla de oro: **un proyecto = un entorno virtual = un requirements.txt**. Nunca instales paquetes en el Python global del sistema. Nunca. Si lo haces, en 3 meses no va…». Choose [1] «Para aislar las dependencias (paquetes) por proyecto y evita…
- S16 Q1: B2-Skeptic: card «duplicados exactos vs conflictos» — quote: «…es. **Conflicto**: misma clave, valores distintos en atributos.». Choose [0] «Misma clave con atributos distintos». Duplicate conflict = same key with different attributes.…
- S26 Q2: B2-Skeptic: card «SLO, alerts y runbook» — quote: «…n < 15 min; 0 envíos sin approve.». Choose [1] «Incidente P0». Send without approve is P0 incident (0 sends without approve).…

## Integrity checks
- errors: none
- exercises arrays not rewritten
- justifications all start with B2-Skeptic:

- bad_prefix_count: 0
