# Newbie A (Explorer) selfcheck — agentic_B2 sections 01–26

- **attempt_id:** agentic_B2
- **persona:** explorer
- **method:** llm_packet_only_no_generator
- **source:** B2 section packets `active.selfCheck_stems` + theory (quiz_batch paths under B2 were absent; stems taken from this run packets; no correctIndex/solutions read)
- **justification prefix:** `B2-Explorer:`
- **exercises:** left unchanged in each `newbie_a_live.json`

- **total stems answered:** 120
- **sections:** 26
- **blocked_on:** all empty

## Per-section choices

### Section 01

- Q0 → **[1]** Para aislar las dependencias (paquetes) por proyecto y evitar conflictos de versiones _(conf 0.96)_
  - *¿Para qué sirve un entorno virtual (venv) en Python?*
- Q1 → **[2]** .venv/ (o venv/) _(conf 0.96)_
  - *¿Cuál de los siguientes archivos SÍ debería estar en tu .gitignore?*
- Q2 → **[2]** "feat: agregar cálculo de churn por segmento" _(conf 0.95)_
  - *¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?*
- Q3 → **[2]** pip install -r requirements.txt _(conf 0.95)_
  - *¿Qué comando te permite replicar el entorno de otro desarrollador?*
- Q4 → **[1]** Porque suele contener credenciales (API keys, passwords, tokens) que son secretos _(conf 0.97)_
  - *¿Por qué NO debes subir el archivo .env a GitHub?*
### Section 02

- Q0 → **[1]** NoneType _(conf 0.96)_
  - *¿Cuál es el tipo de None en Python?*
- Q1 → **[1]** str y False _(conf 0.96)_
  - *¿Qué imprime type("42").__name__ y la comparación 42 == "42"?*
- Q2 → **[1]** Porque no es una cantidad aritmética y puede necesitar ceros o formato _(conf 0.95)_
  - *¿Por qué el teléfono de un cliente de intake se modela como str?*
- Q3 → **[1]** [1, 2, 3] _(conf 0.96)_
  - *Tras `b = a` con `a = [1, 2]` y `b.append(3)`, ¿qué vale `a`?*
- Q4 → **[1]** if x is None: _(conf 0.97)_
  - *¿Cuál es el idioma correcto para comprobar ausencia de valor?*
### Section 03

- Q0 → **[1]** if campo is None: _(conf 0.96)_
  - *¿Cuál es la forma correcta de chequear ausencia de un campo opcional en un validador?*
- Q1 → **[1]** Se ejecuta esa rama y se omiten las siguientes _(conf 0.96)_
  - *En una cadena if/elif/else, ¿qué ocurre cuando la primera condición es verdadera?*
- Q2 → **[3]** "default" _(conf 0.95)_
  - *¿Qué devuelve la expresión `"" or "default"` en Python?*
- Q3 → **[1]** Un set de literales y el operador in _(conf 0.95)_
  - *Una allowlist de tipos de documento se implementa mejor como…*
- Q4 → **[1]** Cuando el sujeto es un literal/estado finito (códigos) y hay case _ _(conf 0.93)_
  - *¿Cuándo aporta más claridad `match/case` que `if` en un motor de reglas introductorio?*
### Section 04

- Q0 → **[1]** [0,1,2] _(conf 0.97)_
  - *¿Qué produce list(range(3))?*
- Q1 → **[1]** Empareja solo (1,10) y (2,20); el 3 se pierde en silencio _(conf 0.95)_
  - *zip([1,2,3],[10,20]) sin strict…*
- Q2 → **[1]** n_total de registros procesados (intentados) _(conf 0.95)_
  - *Para la tasa de reject del gate, el denominador debe ser…*
- Q3 → **[1]** Salta al siguiente ciclo del bucle _(conf 0.96)_
  - *¿Qué hace continue en un for de líneas de intake?*
- Q4 → **[2]** O(n²) _(conf 0.95)_
  - *Un doble for anidado sobre n elementos es aproximadamente…*
### Section 05

- Q0 → **[2]** None _(conf 0.96)_
  - *Si una función no tiene return, ¿qué devuelve la llamada?*
- Q1 → **[1]** El default mutable se comparte entre llamadas _(conf 0.96)_
  - *¿Por qué `def f(xs=[])` es peligroso?*
- Q2 → **[2]** Mismo input → mismo output, sin efectos colaterales _(conf 0.95)_
  - *Una función pura…*
- Q3 → **[0]** Local, Enclosing, Global, Builtin _(conf 0.95)_
  - *LEGB significa…*
- Q4 → **[1]** f(f(x)) == f(x) para entradas del dominio _(conf 0.94)_
  - *Idempotencia de un normalizador f significa…*
### Section 06

- Q0 → **[1]** [3,4] _(conf 0.96)_
  - *¿Qué produce xs[-2:] si xs = [1,2,3,4]?*
- Q1 → **[1]** a también ve el append (alias) _(conf 0.96)_
  - *b = a (listas) y mutas b.append(1). ¿Qué pasa con a?*
- Q2 → **[2]** Listar conflicto en conflicts sin silenciar _(conf 0.94)_
  - *Para reportar dos filas con mismo id y payload distinto debes…*
- Q3 → **[1]** None (muta in-place) _(conf 0.95)_
  - *rows.sort(key=...) retorna…*
- Q4 → **[1]** salidas deterministas/reproducibles _(conf 0.94)_
  - *json.dumps(..., sort_keys=True) ayuda a…*
### Section 07

- Q0 → **[1]** Formas Unicode distintas (NFC vs NFD) _(conf 0.95)_
  - *¿Por qué 'José' y 'Jose\u0301' pueden fallar en == ?*
- Q1 → **[1]** Marcar review y conservar raw _(conf 0.94)_
  - *En nombres latam, si solo hay un token, la política segura es…*
- Q2 → **[1]** Cuando la transformación es literal/simple _(conf 0.94)_
  - *¿Cuándo preferir str.replace/split sobre regex?*
- Q3 → **[1]** None (no es full match) _(conf 0.95)_
  - *fullmatch(r'\d{8}', 'DNI 12345678') devuelve…*
- Q4 → **[2]** Ir a review con evidencia (raw, score) _(conf 0.95)_
  - *Un Jaccard 0.67 entre nombres debe…*
### Section 08

- Q0 → **[1]** Evita depender del locale del SO (p. ej. Windows) _(conf 0.95)_
  - *¿Por qué declarar encoding='utf-8' al abrir texto?*
- Q1 → **[1]** escribir temp y os.replace al destino _(conf 0.95)_
  - *Escritura atómica típica es…*
- Q2 → **[2]** Ir a cuarentena con motivo _(conf 0.95)_
  - *Una fila CSV con columnas de más debe…*
- Q3 → **[1]** n_in == n_clean + n_quarantine _(conf 0.96)_
  - *Reconciliación del manifest exige…*
- Q4 → **[1]** Fallar (exit non-zero) / fail closed _(conf 0.96)_
  - *Si reconcile falla, el pipeline debe…*
### Section 09

- Q0 → **[1]** Encadenar la causa en __cause__ sin perder contexto _(conf 0.95)_
  - *¿Para qué sirve `raise NewError(...) from e`?*
- Q1 → **[1]** Fail-fast (abortar el job) _(conf 0.94)_
  - *Un delimiter vacío en config del job debería…*
- Q2 → **[1]** Solo datos; diagnóstico a stderr _(conf 0.95)_
  - *¿Qué va a stdout en una CLI bien diseñada?*
- Q3 → **[1]** a***@ejemplo.pe _(conf 0.93)_
  - *mask_email('ana@ejemplo.pe') de forma segura podría ser…*
- Q4 → **[1]** Puede reintentarse con backoff; ValueError de datos no _(conf 0.94)_
  - *TimeoutError en un fetch remoto típico…*
- Q5 → **[1]** La entrada más pequeña que reproduce el bug _(conf 0.95)_
  - *¿Cuál es un buen minimal repro?*
### Section 10

- Q0 → **[1]** Ejecutar el CLI/demo solo al correr el módulo, no al importar _(conf 0.96)_
  - *¿Para qué sirve `if __name__ == '__main__'`?*
- Q1 → **[1]** flags > env > file > defaults _(conf 0.94)_
  - *Precedencia correcta de config…*
- Q2 → **[1]** Error de uso/parseo de argumentos _(conf 0.94)_
  - *Exit code 2 en CLI argparse suele significar…*
- Q3 → **[1]** stderr _(conf 0.95)_
  - *¿Dónde van los logs de progreso?*
- Q4 → **[1]** minor _(conf 0.93)_
  - *Añadir un subcomando nuevo compatible es tipicamente…*
- Q5 → **[0]** .env con API_TOKEN _(conf 0.96)_
  - *¿Qué no debe ir al git del paquete?*
### Section 11

- Q0 → **[1]** Evita el default mutable compartido entre instancias _(conf 0.96)_
  - *¿Por qué `field(default_factory=list)` y no `= []`?*
- Q1 → **[1]** Una señal/dato numérico, no un veredicto de fraude o familia _(conf 0.95)_
  - *RelationshipEvidence.signal_score representa…*
- Q2 → **[1]** Definir un puerto get/save implementable por fakes y adapters _(conf 0.94)_
  - *Un Protocol EntityStore sirve para…*
- Q3 → **[1]** En la construcción (__post_init__/validate) _(conf 0.94)_
  - *Objeto inválido: ¿cuándo fallar?*
- Q4 → **[1]** A menudo es frágil; composición (Client tiene PersonInfo) suele bastar _(conf 0.93)_
  - *Client hereda de Person…*
- Q5 → **[1]** is_fraud() automático _(conf 0.95)_
  - *¿Qué no debe tener el dominio de familiaridad?*
### Section 12

- Q0 → **[1]** Tratarse como error de cliente (no retry ciego) _(conf 0.94)_
  - *Un 400 Bad Request del proveedor debe…*
- Q1 → **[1]** En variable de entorno / secret store _(conf 0.96)_
  - *¿Dónde debe vivir el token de API?*
- Q2 → **[1]** Inyección / inseguro; usar placeholders `?` _(conf 0.96)_
  - *SQL con f-string e input de usuario es…*
- Q3 → **[1]** Viola la política de egress de CP-N1-C _(conf 0.95)_
  - *Enviar document_id bancario a un geocoder público…*
- Q4 → **[2]** Una geoseñal de relación, no un veredicto _(conf 0.94)_
  - *1.2 km entre dos entidades sintéticas implica…*
### Section 13

- Q0 → **[1]** Mantenerse separados en la ficha de caso _(conf 0.95)_
  - *entity_resolution_score y relationship_signal_score deben…*
- Q1 → **[2]** Error de matching; no es veredicto legal de fraude _(conf 0.94)_
  - *Un false positive de ER implica…*
- Q2 → **[1]** Encolar needs_review / abstenerse según política _(conf 0.95)_
  - *En zona gris de score el sistema debe…*
- Q3 → **[1]** Privacy sheet, acceso, tests, demo y runbook _(conf 0.93)_
  - *CF-1 en S13 incluye…*
- Q4 → **[1]** Re-chequear paths críticos S01–S13 en runbook (sin editar ledger aquí) _(conf 0.93)_
  - *Level-1 regression notes en el You Do exigen…*
### Section 14

- Q0 → **[1]** dtype _(conf 0.96)_
  - *¿Qué atributo del ndarray indica el tipo homogéneo de sus elementos?*
- Q1 → **[1]** Filtrar o seleccionar elementos que cumplen la condición _(conf 0.95)_
  - *Una máscara booleana a > 0.5 se usa principalmente para:*
- Q2 → **[1]** Por columna (colapsa filas) _(conf 0.93)_
  - *axis=0 en una reducción sobre una matriz 2D suele agregar:*
- Q3 → **[1]** Puede mutar el array base porque suele ser un view _(conf 0.94)_
  - *Mutar un slice simple de un ndarray normalmente:*
### Section 15

- Q0 → **[1]** loc _(conf 0.96)_
  - *¿Qué método de selección usa etiquetas de index/columnas?*
- Q1 → **[1]** Asignación sobre slices que pueden ser view/copy (chained assignment) _(conf 0.94)_
  - *SettingWithCopyWarning se relaciona con:*
- Q2 → **[1]** Convierte inválidos a NaN _(conf 0.95)_
  - *errors='coerce' en to_numeric:*
- Q3 → **[1]** Filas, columnas y provenance/hash del artefacto _(conf 0.94)_
  - *Un manifest de export debería incluir al menos:*
### Section 16

- Q0 → **[1]** Generar violación/cuarentena o fail del gate _(conf 0.95)_
  - *Un campo required con null debe:*
- Q1 → **[0]** Misma clave con atributos distintos _(conf 0.95)_
  - *Conflicto de duplicados significa:*
- Q2 → **[1]** Conservar filas rechazadas con razón _(conf 0.95)_
  - *La cuarentena debe:*
- Q3 → **[1]** Fallar de forma explicable con el nombre de la columna _(conf 0.94)_
  - *Ante schema drift (columna required faltante):*
### Section 17

- Q0 → **[1]** Fallar si la cardinalidad no es 1:1 _(conf 0.95)_
  - *validate='one_to_one' en merge sirve para:*
- Q1 → **[0]** Filas del left sin match en right _(conf 0.95)_
  - *Un anti-join left_only identifica:*
- Q2 → **[1]** Reinyecta el agregado al shape original _(conf 0.94)_
  - *transform en groupby:*
- Q3 → **[1]** Incluyes datos posteriores al cutoff en features/métricas del pasado _(conf 0.94)_
  - *Leakage temporal ocurre cuando:*
### Section 18

- Q0 → **[1]** Mediana (y opcionalmente IQR) _(conf 0.95)_
  - *¿Qué comunica mejor un ticket “típico” con outliers fuertes?*
- Q1 → **[1]** Asociación observada (no causal por sí sola) _(conf 0.95)_
  - *Una correlación alta entre X e Y implica:*
- Q2 → **[1]** Origen, filtros, n y límites de cobertura _(conf 0.94)_
  - *¿Qué debe incluir un data note mínimo?*
- Q3 → **[1]** La muestra no representa la población de interés _(conf 0.94)_
  - *El sesgo de muestra ocurre cuando:*
### Section 19

- Q0 → **[1]** Barras con baseline 0 _(conf 0.95)_
  - *Para comparar magnitudes entre categorías, ¿qué chart es usualmente preferible?*
- Q1 → **[1]** Repetir los mismos números clave del chart _(conf 0.94)_
  - *Una alternativa accesible debe:*
- Q2 → **[1]** Sobreclaim / generalización indebida _(conf 0.94)_
  - *“Lima es la mejor región del Perú” a partir de una muestra web es:*
- Q3 → **[1]** Unidad, fuente y limitaciones _(conf 0.94)_
  - *El caption de un gráfico de portfolio debe incluir:*
### Section 20

- Q0 → **[1]** No; suele devolver la fórmula o cache si existe _(conf 0.94)_
  - *openpyxl sin Excel instalado evalúa fórmulas automáticamente:*
- Q1 → **[1]** Escribir en la celda ancla (top-left) _(conf 0.94)_
  - *Al escribir en celdas combinadas debes:*
- Q2 → **[1]** Estados de batch, conciliación y backups _(conf 0.93)_
  - *Un manifest del excel factory debe permitir auditar:*
- Q3 → **[1]** Misma entrada → mismo resultado lógico _(conf 0.95)_
  - *Idempotencia significa:*
### Section 21

- Q0 → **[1]** Para reutilizar presentación y auditar métricas en Python _(conf 0.94)_
  - *¿Por qué separar datos y plantilla Jinja?*
- Q1 → **[1]** OCR / tratamiento de imagen _(conf 0.94)_
  - *Un PDF con casi sin caracteres en capa de texto suele requerir:*
- Q2 → **[1]** Mismas métricas clave en dashboard, Excel y documento _(conf 0.94)_
  - *Paridad en el Reporting Factory significa:*
- Q3 → **[1]** Provenance, checklist visual y hallazgos trazables _(conf 0.93)_
  - *El cierre de contenido de CP-N2-B incluye:*
### Section 22

- Q0 → **[1]** Solo drafts/.eml en sandbox y aprobación humana _(conf 0.95)_
  - *¿Qué garantiza no enviar correo real en el gate de S22?*
- Q1 → **[2]** Solo evidencia débil de contacto a revisar; no prueba de fraude _(conf 0.95)_
  - *Un score alto de similitud entre dos emails implica:*
- Q2 → **[1]** Solo los scopes mínimos (p. ej. draft) necesarios _(conf 0.95)_
  - *Least privilege en OAuth de correo significa:*
- Q3 → **[1]** Reutilizar el mismo draft_id si la key existe _(conf 0.94)_
  - *La idempotency key al reintentar create_draft debe:*
### Section 23

- Q0 → **[1]** Refleja la UI accesible y suele ser más estable _(conf 0.95)_
  - *¿Por qué preferir get_by_role a CSS nth-child?*
- Q1 → **[2]** Detenerse y hacer handoff humano _(conf 0.95)_
  - *Ante un CAPTCHA el robot debe:*
- Q2 → **[1]** Buscar integración no-UI antes de automatizar el browser _(conf 0.94)_
  - *API/export primero significa:*
- Q3 → **[1]** Solo fallas transitorias (timeout/red), no captcha/403 de negocio _(conf 0.94)_
  - *Un retry seguro reintenta:*
### Section 24

- Q0 → **[2]** Abstener y encolar revisión _(conf 0.95)_
  - *¿Qué haces si confidence de RUC es 0.6?*
- Q1 → **[1]** Cola de revisión / corrección _(conf 0.94)_
  - *Un mismatch total vs líneas implica:*
- Q2 → **[1]** Los campos críticos pueden fallar aunque el global se vea bien _(conf 0.94)_
  - *¿Por qué medir accuracy por campo?*
- Q3 → **[1]** Gate reject/review por mime no permitido _(conf 0.94)_
  - *Archivo application/zip en intake de facturas:*
### Section 25

- Q0 → **[1]** Cuando el problema es determinista y auditabilidad importa _(conf 0.95)_
  - *¿Cuándo preferir reglas a LLM?*
- Q1 → **[1]** Se descarta / human review _(conf 0.95)_
  - *Salida del generador sin JSON válido:*
- Q2 → **[1]** Tratando el texto como untrusted y filtrando/ no elevando a system _(conf 0.95)_
  - *Prompt injection desde un PDF OCR se mitiga:*
- Q3 → **[1]** Nunca de forma autónoma en este curso; solo evidencia para humano _(conf 0.96)_
  - *El AI assist puede etiquetar fraude solo:*
### Section 26

- Q0 → **[1]** Approve antes de draft_email _(conf 0.95)_
  - *El orden draft_email respecto a approve es:*
- Q1 → **[1]** Tests críticos de capstones N2, E2E y controles de privacidad/seguridad _(conf 0.94)_
  - *La regresión N2 incluye:*
- Q2 → **[1]** Incidente P0 _(conf 0.95)_
  - *Un send sin approve es:*
- Q3 → **[1]** 0 — solo evidencia para humanos _(conf 0.96)_
  - *fraud_labels automáticos en el VP deben ser:*

## Notes

- Independent second dual-newbie run voice (B2-Explorer), not copied from A1/A2 selfcheck answers.
- Explorer persona: confident packet-grounded picks; no blocked stems.

