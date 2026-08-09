# S21 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Documentos, plantillas y reportes trazables
- **shortTitle:** Reportes trazables
- **id:** `fastapi` (archivo histórico `s21-fastapi.ts`; contenido = Reporting Factory Jinja/DOCX/PDF/narrativa/provenance, **no** APIs HTTP)
- **index:** 21
- **source:** `src/lib/course/sections/s21-fastapi.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S21-T1-A Jinja/context · T1-B condiciones/tablas/missing · T2-A DOCX real · T2-B PDF digital/render/OCR · T3-A narrativa H→evidencia · T3-B paridad/captions/límites · T4-A fmt_pen/a11y · T4-B provenance/checklist/aprobación
- **hilo de caso:** CASO-LIM-021 / cierre **CP-N2-B** (ticket mediano Lima 28.0 PEN, n=40, cobertura web-only; paridad dash/xlsx/doc; datos sintéticos Lima–Cusco sin PII; puente a email/aprobación S22)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s21-fastapi.ts` (iDo ~310–538, weDo ~540–1448, youDo ~1450–1537).
- Contrastado con theory T1–T4 y el hilo CASO-LIM-021 / Reporting Factory; sin PII real; artefactos de disco (no dict en memoria como “cierre”).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S21 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y útil (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente; casi siempre **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 (kind) — Concepto: …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**Concepto + fixture + éxito**”: meta y pass mezclados; legible para quien ya cierra reportes, **opaco** para newbie sin escena de comité CP-N2-B |
| We Do `feedback` | Una o dos frases; a menudo nombra el error típico (bien); poco anclaje a *por qué el comité rechaza el paquete* |
| Starter `# TODO` / CASO-LIM-021 | **Excelente** hábito; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable); E2/E3 a veces dan el resultado exacto en la pista (spoiling leve en T1-B-E2, T4-B-E2) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con contrato de funciones **sólidos** |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y con el mini-contrato del factory; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (bug intencional, output canónico, fade real E1→E3, artefactos reabiertos en T2, `pending_review` en T4-B) es maduro y alineado al cierre CP-N2-B. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en el comité de operaciones, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: portada → KPI multi-var → `render_kpi`; T2-A: heading+n → conteo estilos → tabla missing; T2-B: capa texto → PNG → needs_ocr; T4-B: manifiesto → huella → `ready`). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S21-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de context único (`run_id`, región, mediana, n, límite) renderizado con Jinja. La `description` nombra la separación datos/plantilla; falta `preamble` que diga *qué observar antes del código* y `retrospective` del misconception “cada informe inventa su propio string de KPI”. El `why` es una frase correcta pero insuficiente.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de exportar DOCX o PDF, el factory necesita un **solo** dict de contexto. En esta demo ves `run_id`, región Lima, mediana 28.0 PEN, n=40 y el límite “solo web” alimentando una plantilla Jinja. No escribas aún; predice la cadena completa y fíjate en que **nada** de la métrica se calcula dentro del template: solo se presenta. Si cada canal inventa su propio formato, la paridad con el Excel de S20 muere en el primer redondeo.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el context versionado es el contrato del factory; `Template.render(**context)` reutiliza los mismos campos en portada, KPI y más adelante correo de aprobación (S22); no hardcodees la línea final en un f-string fuera de Jinja si el objetivo es separación datos/presentación; puente a We Do donde se corrige portada incompleta y se centraliza `render_kpi`.
- **Proposed retrospective:**  
  Si puedes explicar por qué el template no debe recalcular la mediana, ya tienes el hábito de separar datos y presentación. El error clásico es armar el string a mano y “olvidar” el n. En We Do T1-A practicarás portada, KPI multi-var y una función reutilizable.
- **Code/output changes:** none
- **Validation notes:** Output canónico alineado a theory T1-A y CASO-LIM-021.

---

### S21-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: starter imprime portada sin `(n={{ n }})`. Instruction telegráfica “Concepto + fixture”; sin title, preamble ni retrospective. Feedback nombra el error técnico pero no ancla al comité que pide n visible en la portada.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Portada Jinja con región y n
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-021 la portada del paquete debe decir región y tamaño muestral, no solo un título bonito.  
  - **Meta:** renderizar con Jinja `CASO-LIM-021 · {{ region }} (n={{ n }})` desde el context.  
  - **Éxito:** imprime exactamente `CASO-LIM-021 · Lima (n=40)`.  
  - **Límites:** no armes la línea con f-string fuera de Jinja; no hardcodees “Lima (n=40)” en el `print`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime solo el prefijo sin n.  
  2. Crea un `Template` con `{{ region }}` y `{{ n }}`.  
  3. Llama `.render(region="Lima", n=40)`.  
  4. Imprime solo el texto renderizado (sin comillas extra).
- **Proposed feedback improvement:**  
  Si ves solo el prefijo o n vacío, el Template no recibe `region`/`n` en `.render()`. En un factory serio, `StrictUndefined` grita variables ausentes en lugar de dejar huecos silenciosos en la portada del comité.
- **Proposed retrospective:**  
  Portada = identity del caso + n. Sin n, el revisor no puede reconciliar con el EDA. Siguiente (E2): un KPI con mediana y n en la misma plantilla.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S21-T1-A-E2 (weDo, independent)
- **Diagnosis:** Foco independiente correcto (plantilla incompleta: falta `(n={{ n }})`). Instruction densa; no explica *por qué* el KPI sin n es inauditable ante el Excel. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** KPI Jinja con mediana y n
- **Proposed preamble:**  
  - **Contexto:** el comité compara el KPI del DOCX con el ticket mediano del workbook; sin n no hay reconciliación.  
  - **Meta:** renderizar `{{ m }} PEN (n={{ n }})` con m=28 y n=40.  
  - **Éxito:** imprime exactamente `28 PEN (n=40)`.  
  - **Límites:** no omitas la unidad PEN ni el prefijo `n=`; no inventes otro formato de KPI.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el Template solo tiene `{{ m }} PEN`.  
  2. Extiende la plantilla para incluir `(n={{ n }})`.  
  3. Pasa `m=28` y `n=40` en `.render(...)`.  
  4. Imprime solo la cadena resultante.
- **Proposed retrospective:**  
  Dos variables en un template es el mínimo de un KPI auditable (valor + tamaño). Pregunta de cierre: ¿qué falla si el DOCX dice 28 PEN y el Excel n=32? Luego (E3) encapsularás el formato en `render_kpi`.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S21-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a función reutilizable y **otro context** (Cusco n=18 ≠ desfase de paridad Lima). Starter omite n en la plantilla — excelente. Instruction ya aclara el matiz de muestra distinta; falta cierre metacognitivo y title/preamble formales.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Función render_kpi con context dict
- **Proposed preamble:**  
  - **Contexto:** cada autor del informe no debe inventar su propio string de KPI; el factory centraliza el formato.  
  - **Meta:** implementar `render_kpi(ctx)` que use región, mediana y n del dict.  
  - **Éxito:** `Cusco: 22.5 PEN (n=18)` (muestra regional distinta; no es fallo de paridad del paquete Lima).  
  - **Límites:** no hardcodees Cusco fuera del dict; no omitas n en la plantilla.
- **Proposed instruction/description improvements:**  
  1. Lee el TODO: la plantilla del starter no declara `{{ n }}`.  
  2. Completa el Template dentro de `render_kpi` con región, mediana y n.  
  3. Pasa el dict completo con `**ctx`.  
  4. Imprime el resultado de la prueba Cusco / 22.5 / 18.
- **Proposed retrospective:**  
  Centralizar el template evita divergencia entre canales. n=18 es **otro context**, no un bug de paridad del paquete Lima n=40. Puente a T1-B: cuando el valor falta, no inventes 0 — usa em-dash.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; matiz n=18 vs n=40 bien documentado en instruction actual — conservar en preamble.

---

### S21-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: Lima con mediana, Cusco con `None` → `—`. Description correcta; falta preamble de “cero engaña al comité” y retrospective del misconception “0.00 es lo mismo que sin dato”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En un informe de operaciones, un “0.00” en reclamos se lee como “no hubo reclamos”, no como “no medimos”. Esta demo renderiza filas con Jinja: Lima 28.0 y Cusco sin mediana. Observa la rama `is not none` y el glifo `—`. No escribas aún; predice las dos líneas. Si confundes missing con cero, el Excel y el DOCX mienten de forma distinta y la paridad se rompe en silencio.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: missing es decisión de reporting; el caption o data note debe decir por qué la celda está vacía; no uses 0 “para no romper la tabla”.
- **Proposed retrospective:**  
  Missing se declara; no se inventa. El em-dash es el contrato visual del lab. En We Do practicarás celda missing, formato a 2 decimales y un bucle de filas.
- **Code/output changes:** none

---

### S21-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter imprime `None` crudo — defect guiado perfecto. Instruction corta; sin escena de comité ni title/preamble/retrospective. Feedback ya ancla bien al comité.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Missing como em-dash (no cero)
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-021, un KPI sin medición no puede aparecer como 0.00 en la tabla del informe.  
  - **Meta:** mapear `median = None` a la celda `—` (em dash Unicode).  
  - **Éxito:** imprime exactamente el carácter `—`.  
  - **Límites:** no imprimas `None`, `0` ni la cadena `"None"`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: hace `print(median)` con `median = None`.  
  2. Escribe un condicional: si es `None` → `"—"`, si no → el valor.  
  3. Imprime solo el resultado de la celda.  
  4. No inventes un cero “para rellenar”.
- **Proposed retrospective:**  
  El comité lee 0 como hecho medido. Missing honesto protege totales y promedios. Siguiente (E2): formatear un número real a dos decimales sin redondeo a ojo en Word.
- **Code/output changes:** none
- **Validation notes:** Output `—` es el glifo canónico del lab; no cambiar.

---

### S21-T1-B-E2 (weDo, independent)
- **Diagnosis:** Formato `.2f` correcto; instruction ya da el éxito `28.46`. Hint spoila el valor (aceptable en independent si se mueve el número al success del preamble). Sin title/preamble/retrospective. Feedback bueno sobre “no a ojo en la plantilla”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Formato a dos decimales (.2f)
- **Proposed preamble:**  
  - **Contexto:** las tablas de detalle del factory usan 2 decimales explícitos; el redondeo “a ojo” en el Word del autor rompe paridad.  
  - **Meta:** formatear `x = 28.456` a exactamente dos decimales en Python.  
  - **Éxito:** imprime `28.46`.  
  - **Límites:** no redondees mentalmente y hardcodees el string; no uses locale con coma.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `x` crudo.  
  2. Usa f-string con `:.2f` (o formato equivalente).  
  3. Imprime solo el valor formateado.  
  4. Verifica mentalmente: 28.456 → 28.46, no 28.45 ni 28.5.
- **Proposed retrospective:**  
  Formatear en Python (o con filtro Jinja explícito) deja un rastro auditable. En resúmenes ejecutivos a menudo usarás 1 decimal PEN (T4); aquí el detalle pide 2. Luego (E3): emitir filas con bucle Jinja.
- **Code/output changes:** none
- **Validation notes:** Hint 2 spoila “28.46”; el Fixer puede suavizarlo a “usa :.2f y compara con el test”.

---

### S21-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a `{% for %}` de filas; starter con template estático. Instruction clara sobre no unir con `|`. Falta escena de “tabla serializable del workbook” y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Bucle Jinja de filas region:v
- **Proposed preamble:**  
  - **Contexto:** el factory serializa filas del context a líneas o celdas; un string único con pipes no es tabla.  
  - **Meta:** con un Template Jinja, emitir una línea `region:v` por fila.  
  - **Éxito:** dos líneas — `Lima:1` y `Cusco:2` (sin espacios extra).  
  - **Límites:** no unir regiones con `|`; no hardcodees las dos líneas fuera del bucle.
- **Proposed instruction/description improvements:**  
  1. Reemplaza el template `"static"` por un `{% for r in rows %}…{% endfor %}`.  
  2. Dentro del bucle: `{{ r.region }}:{{ r.v }}` y salto de línea.  
  3. Pasa la lista de dicts en `.render(rows=...)`.  
  4. Usa `print(..., end="")` si el template ya trae `\n` final.
- **Proposed retrospective:**  
  Una fila del context = una línea de salida. El pipe entre regiones no se reabre como tabla. Puente a T2-A: materializar el mismo contrato en un DOCX real con headings y celdas.
- **Code/output changes:** none

---

### S21-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de crear/guardar/reabrir DOCX con Heading y firma PK. Description fuerte; falta preamble de “dict en memoria ≠ artefacto” y retrospective del misconception “se veía bien en mi Word”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  T1 te dio un context limpio; T2 lo baja a **disco**. Un DOCX trazable usa estilos Heading reales, se guarda y se **reabre** para extraer texto y estilos. En esta demo creas `reporte.docx`, verificas la firma ZIP (`PK`) y lees el heading “Resumen ejecutivo”. No escribas aún; predice `suffix`, booleano PK y la lista de headings. “Se veía bien en la sesión del autor” no es evidencia ante un revisor sin tu Word abierto.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: reabrir prueba el paquete OOXML; `style.name` empieza por Heading; la negrita sola no es outline auditable.
- **Proposed retrospective:**  
  Evidencia = archivo reabierto, no el objeto en RAM. En We Do construirás outline con Resumen/n=40, contarás Heading 1 y armarás tabla con missing honesto.
- **Code/output changes:** none

---

### S21-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter usa `add_paragraph` para el título y omite heading Resumen + n=40 — defect guiado excelente. Instruction mezcla éxito (dos líneas `True True`) con la tarea; sin title/preamble/retrospective formales. Feedback acertado sobre disco vs memoria.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** DOCX con Resumen y n=40 reabierto
- **Proposed preamble:**  
  - **Contexto:** el paquete CP-N2-B exige un DOCX en disco con sección Resumen y el n de la muestra.  
  - **Meta:** crear, guardar y reabrir un Document con headings reales y párrafo `n=40`.  
  - **Éxito:** dos líneas `True True` (existe+PK; contiene Resumen y n=40).  
  - **Límites:** no dejes el texto solo en un dict; no uses solo `add_paragraph` para fingir el heading Resumen.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: solo un párrafo genérico, sin “Resumen” ni n=40.  
  2. Agrega heading de título y heading “Resumen” (nivel 1).  
  3. Agrega un párrafo que incluya `n=40`; guarda y reabre.  
  4. Imprime los dos pares de booleanos del scaffold (no inventes otro formato de salida).
- **Proposed retrospective:**  
  El segundo `True True` solo es posible si el archivo guardado trae el texto. Outline primero, prosa después. Siguiente (E2): contar estilos Heading al reabrir.
- **Code/output changes:** none
- **Validation notes:** Solution usa level 0 + level 1; preservar outputs.

---

### S21-T2-A-E2 (weDo, independent)
- **Diagnosis:** Starter con `add_paragraph` en vez de `add_heading` — misconception central del subtema. Instruction pide conteo + lista de style.name. Falta anclar *por qué* el outline importa al revisor de accesibilidad y de estructura.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar Heading 1 al reabrir el DOCX
- **Proposed preamble:**  
  - **Contexto:** el revisor audita `style.name`, no el tamaño de fuente que “se veía como título”.  
  - **Meta:** crear headings reales Resumen(1), Método(2), Anexos(1); guardar, reabrir y reportar estilos.  
  - **Éxito:** primera línea `2`; segunda `['Heading 1', 'Heading 2', 'Heading 1']`.  
  - **Límites:** no uses `add_paragraph` + negrita; la evidencia debe venir del archivo reabierto.
- **Proposed instruction/description improvements:**  
  1. El bucle del starter llama `add_paragraph` (bug).  
  2. Cámbialo a `add_heading(text, level)` con el level del tuple.  
  3. Guarda, reabre y construye la lista de `style.name` de párrafos con texto.  
  4. Imprime el conteo de `"Heading 1"` y la lista completa.
- **Proposed retrospective:**  
  Heading real = outline navegable y a11y. Negrita visual = maquillaje. Luego (E3): tabla de métricas con Reclamos como `—`, no 0.
- **Code/output changes:** none

---

### S21-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a tabla DOCX con missing; starter pone Reclamos=`"0"` — defect de reporting de alto valor pedagógico. Instruction densa pero clara. Falta title/preamble/retrospective y anclaje al “comité cree que no hubo reclamos”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tabla DOCX con Reclamos como —
- **Proposed preamble:**  
  - **Contexto:** en auditoría del CASO-LIM-021, un 0 en reclamos se interpreta como “no hubo”, no como “no medimos”.  
  - **Meta:** tabla métrica/valor con Ticket mediano=28.0 y Reclamos=`—`; verificar al reabrir.  
  - **Éxito:** `['Ticket mediano', '28.0']` y `['Reclamos', '—'] True`.  
  - **Límites:** no uses `"0"` para rellenar; la lectura debe salir del DOCX reabierto.
- **Proposed instruction/description improvements:**  
  1. Corrige la lista `metrics`: Reclamos debe ser em-dash.  
  2. Conserva encabezados Métrica/Valor y el bucle de filas.  
  3. Guarda, reabre y lee `rows[1]` y `rows[2]`.  
  4. Imprime la fila 2 y el booleano `valor != "0"`.
- **Proposed retrospective:**  
  Missing en celda de Word es el mismo contrato que en Jinja. Pregunta: ¿qué decisión falsa toma el comité si lee 0? Puente a T2-B: PDF digital con capa de texto extraíble.
- **Code/output changes:** none

---

### S21-T2-B-DEMO (iDo)
- **Diagnosis:** Demo PDF + extract + PNG con evidencia separada. Description clara; falta preamble de “tres artefactos, tres pruebas” y retrospective del misconception “si el PNG se ve bien, el PDF es digital”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un PDF digital tiene texto seleccionable; un escaneo es imagen. En esta demo generas `reporte.pdf` con ReportLab, extraes con pypdf y renderizas la primera página a PNG con PyMuPDF. Observa tres checks: firma `%PDF`, presencia de “H1” en el texto extraído y tamaño del PNG. No escribas aún; predice los booleanos. Ninguna de las tres pruebas sustituye sola la reconciliación tabular — pero juntas cierran el artefacto.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: extracción = capa digital; PNG = legibilidad visual; hash del PDF entra al provenance (T4-B).
- **Proposed retrospective:**  
  Si la extracción queda vacía, el contrato es `needs_ocr`, no inventar texto. We Do: capa con n=40, render PNG y caso imagen-only.
- **Code/output changes:** none

---

### S21-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter omite `n=40` en `drawString` — defect guiado limpio. Instruction clara. Falta title/preamble/retrospective y escena de “sin n en capa de texto no hay auditoría”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** PDF digital con n=40 extraíble
- **Proposed preamble:**  
  - **Contexto:** el revisor del factory extrae texto del PDF; si n no está en la capa digital, el artefacto no es auditable.  
  - **Meta:** generar PDF con ReportLab que incluya n=40 y verificar firma + extracción.  
  - **Éxito:** dos líneas `True` (firma `%PDF` y `"n=40" in text`).  
  - **Límites:** no declares “digital” sin extraer; no hardcodees los booleanos a True.
- **Proposed instruction/description improvements:**  
  1. El starter dibuja “Resumen sintetico” sin n.  
  2. Incluye `n=40` en el `drawString` **antes** de `save()`.  
  3. Extrae con `PdfReader` y normaliza `or ""`.  
  4. Imprime los dos booleanos del scaffold.
- **Proposed retrospective:**  
  `drawString` crea capa de texto; `save()` sin el string correcto no se arregla después. Siguiente (E2): render de página a PNG con tamaño > 0.
- **Code/output changes:** none
- **Validation notes:** ASCII “sintetico” sin tilde es intencional (Helvetica ReportLab); no “corregir” a sintético en canvas.

---

### S21-T2-B-E2 (weDo, independent)
- **Diagnosis:** Starter genera PDF pero nunca crea PNG — defect de integración. Instruction pide dos booleanos en una línea. Falta title/preamble y énfasis en “ambas evidencias son archivos”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Render de página PDF a PNG
- **Proposed preamble:**  
  - **Contexto:** la checklist visual del cierre CP-N2-B exige ver el informe, no solo confiar en el path.  
  - **Meta:** generar PDF, renderizar página 0 a PNG con fitz y verificar tamaños.  
  - **Éxito:** `True True` (PDF y PNG con `st_size > 0`).  
  - **Límites:** no imprimas True si el PNG no existe; no verifiques solo el nombre del archivo.
- **Proposed instruction/description improvements:**  
  1. Tras `save()` del PDF, abre con `fitz.open(pdf)`.  
  2. En la página 0, `get_pixmap().save(png)`.  
  3. Compara tamaños positivos de ambos paths.  
  4. Imprime los dos booleanos en una línea.
- **Proposed retrospective:**  
  Extracción prueba capa digital; PNG prueba legibilidad. Ambas son archivos reales. Luego (E3): PDF solo-imagen y abstención `needs_ocr`.
- **Code/output changes:** none

---

### S21-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia de alto valor: imagen en PDF sin `drawString`; starter fuerza `needs_ocr: False` y prueba `"n=17" in text` (incorrecto). Instruction y feedback excelentes. Falta title/preamble formales y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** PDF imagen-only y needs_ocr
- **Proposed preamble:**  
  - **Contexto:** un “PDF” que solo incrusta un PNG con texto dibujado no es capa digital; inventar lectura es fraude de reporting.  
  - **Meta:** insertar imagen (sin `drawString`), extraer con pypdf y marcar `needs_ocr` si la capa está vacía.  
  - **Éxito:** `True True` y `{'needs_ocr': True, 'n_chars': 0}`.  
  - **Límites:** no agregues `drawString` “para que pase”; no inventes el texto de n=17 en el extract.
- **Proposed instruction/description improvements:**  
  1. Conserva el pipeline PNG → `drawImage` (sin texto vectorial).  
  2. Extrae y normaliza `extract_text() or ""`.  
  3. Imprime si es PDF válido y si **n=17 NO** está en el texto.  
  4. Calcula `needs_ocr` con `not bool(text.strip())` y `n_chars=len(text)`.
- **Proposed retrospective:**  
  Abstenerse con honestidad es el contrato; OCR llega en S24. Pregunta: ¿qué daño hace inventar “n=17” desde el PNG? Puente a T3-A: narrativa con H→evidencia y `decision=None`.
- **Code/output changes:** none
- **Validation notes:** Solution cambia el segundo print a `"n=17" not in text` — defect intencional del starter; no alterar outputs canónicos.

---

### S21-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de estructura resumen/método/hallazgos con id, evidencia y `decision=None`. Description correcta; falta preamble de “hallazgo ≠ decisión de negocio” y retrospective del misconception “recomendamos subir precios es un hallazgo”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con DOCX/PDF reales, falta la **voz ejecutiva** sin contaminar el método con opinión. Esta demo empaqueta resumen con n=40, método (fuente y filtros) y un hallazgo H1 que apunta a Tabla1 con `decision=None`. Observa que el claim “Lima > Cusco” no trae recomendación de precios. No escribas aún; predice las tres líneas de salida. Sin id de evidencia, el párrafo es eslogan, no paquete de aprobación.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: ids habilitan revisión selectiva; `decision=None` deja la acción de negocio a la cola humana (S22); eco de S18.
- **Proposed retrospective:**  
  Hallazgo = claim + evidencia; decisión = humano. En We Do completarás el dict H1, validarás resumen con n= y PEN, y armarás `pack_report` de tres claves.
- **Code/output changes:** none

---

### S21-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter con `decision: "subir precios"` y sin id/evidencia — defect pedagógico de primer nivel. Instruction ya nombra hallazgo ≠ decisión. Falta title/preamble/retrospective formales.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Hallazgo H1 con evidencia y decision=None
- **Proposed preamble:**  
  - **Contexto:** el comité de Lima aprueba evidencia, no eslóganes de pricing embebidos en el factory.  
  - **Meta:** completar el dict del hallazgo con id, claim, evidencia Tabla1 y `decision=None`.  
  - **Éxito:** imprime `H1 Tabla1 True` (id, evidencia, decision es None).  
  - **Límites:** no dejes una acción de negocio en `decision`; no omitas el id.
- **Proposed instruction/description improvements:**  
  1. El starter trae claim y una decisión de negocio (bug).  
  2. Agrega `"id": "H1"` y `"evidencia": "Tabla1"`.  
  3. Pon `decision` en `None`.  
  4. Imprime id, evidencia y el booleano `decision is None` (no el claim).
- **Proposed retrospective:**  
  Sin Tabla1, H1 no entra al paquete. `decision=None` es honestidad de proceso, no timidez. Siguiente (E2): el resumen debe llevar `n=` y `PEN`.
- **Code/output changes:** none

---

### S21-T3-A-E2 (weDo, independent)
- **Diagnosis:** Validación de resumen auditable; starter con string pobre. Instruction clara. Falta anclar al revisor que reconcilia con EDA/S20 y title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Resumen con n= y unidad PEN
- **Proposed preamble:**  
  - **Contexto:** un resumen sin tamaño muestral ni unidad no se reconcilia con el workbook ni el dashboard.  
  - **Meta:** corregir el string y validar presencia de `n=` y `PEN`.  
  - **Éxito:** imprime `True`.  
  - **Límites:** no basta el número 28 suelto; no uses “pen” en minúsculas si el test busca `PEN`.
- **Proposed instruction/description improvements:**  
  1. Reemplaza `s = "mediana 28"` por un resumen que incluya unidad y n.  
  2. Valida con `"n=" in s and "PEN" in s`.  
  3. Imprime un solo booleano.  
  4. Ejemplo válido del lab: mencionar mediana, PEN y n=40.
- **Proposed retrospective:**  
  Eslogan ≠ resumen auditable. El revisor busca n y unidad en un vistazo. Luego (E3): empaquetar resumen, método y hallazgos en un solo dict.
- **Code/output changes:** none

---

### S21-T3-A-E3 (weDo, transfer)
- **Diagnosis:** `pack_report` incompleto (falta `metodo`) — transfer limpio al contrato de tres claves. Instruction minimalista (apropiado a transfer). Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** pack_report con tres claves
- **Proposed preamble:**  
  - **Contexto:** sin clave `metodo`, el paquete mezcla opinión con procedimiento y el revisor no separa evidencia de sesgo.  
  - **Meta:** implementar `pack_report` que devuelva resumen, metodo y hallazgos.  
  - **Éxito:** `['hallazgos', 'metodo', 'resumen']` (claves ordenadas).  
  - **Límites:** no omitas `metodo`; no agregues claves de decisión de negocio aquí.
- **Proposed instruction/description improvements:**  
  1. El return del starter solo tiene resumen y hallazgos.  
  2. Incluye `"metodo": metodo` en el dict.  
  3. Imprime `sorted(...keys())` del resultado de la llamada de prueba.  
  4. No alteres los argumentos de la firma.
- **Proposed retrospective:**  
  Tres claves = contrato de narrativa ejecutiva. Método documentado protege de “insights” opacos. Puente a T3-B: paridad numérica entre dash y doc más limitaciones visibles.
- **Code/output changes:** none

---

### S21-T3-B-DEMO (iDo)
- **Diagnosis:** Demo de paridad dash/xlsx/doc y limits. Description correcta; falta preamble de “un número, tres superficies” y retrospective del misconception “si el DOCX se ve bien, el Excel puede decir otra cosa”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El corazón de CP-N2-B es **paridad**: dashboard, Excel y documento con la misma mediana Lima 28.0. Esta demo compara tres dicts, adjunta límites (cobertura web, n Cusco bajo) y empaqueta `parity` + `fuente`. Observa que `parity` es un booleano de igualdad de estructuras de métricas, no un “se ve similar”. No escribas aún; predice el bundle. Si el PNG dice 28 y el DOCX 30, el factory ya falló antes de hablar de diseño.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: paridad es el gate de cierre; limits deben ser visibles al lector, no solo en anexo escondido.
- **Proposed retrospective:**  
  Un solo número, tres superficies. We Do: alinear dash/doc + “solo web”, captions con Fuente, y `check_parity` a tres vías.
- **Code/output changes:** none

---

### S21-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter con mediana divergente 27.0 y limits vacía — doble defect guiado excelente. Instruction clara. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Paridad dash/doc y límite solo web
- **Proposed preamble:**  
  - **Contexto:** el paquete del comité debe reconciliar métricas y declarar cobertura web-only donde el lector la vea.  
  - **Meta:** alinear `median_Lima` en dash y doc e incluir `"solo web"` en limits.  
  - **Éxito:** `True True` (paridad y limitación presentes).  
  - **Límites:** no dejes 27.0 “porque redondeaste a mano”; no uses limits vacía.
- **Proposed instruction/description improvements:**  
  1. Corrige `doc["median_Lima"]` a 28.0.  
  2. Pon `limits = ["solo web"]`.  
  3. Imprime `dash == doc` y `"solo web" in limits`.  
  4. No inventes otras claves de métrica.
- **Proposed retrospective:**  
  Paridad sin límites es incompleta: el lector debe ver la cobertura. Siguiente (E2): caption de figura con campo Fuente visible.
- **Code/output changes:** none

---

### S21-T3-B-E2 (weDo, independent)
- **Diagnosis:** Caption sin “Fuente”; instruction y feedback alineados al factory. Falta title/preamble/retrospective y recordatorio de n=40 del lab.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Caption con campo Fuente visible
- **Proposed preamble:**  
  - **Contexto:** un pie de figura sin Fuente impide reconciliar el PNG del dashboard con el dataset del factory.  
  - **Meta:** construir un caption CASO-LIM-021 que declare Fuente y n de Lima.  
  - **Éxito:** imprime `True` cuando `"Fuente" in cap`.  
  - **Límites:** no uses solo `n=40` sin nombrar Fuente; no inventes otro n de muestra.
- **Proposed instruction/description improvements:**  
  1. El starter tiene `Fig1 | n=40` sin Fuente.  
  2. Amplía el string con un segmento `| Fuente: sintético |` (o equivalente legible).  
  3. Conserva n=40 de la muestra Lima.  
  4. Imprime el booleano de presencia de `"Fuente"`.
- **Proposed retrospective:**  
  Caption = puente visual al dataset. Sin Fuente, el PNG es decoración. Luego (E3): checksum a tres artefactos con `a == b == c`.
- **Code/output changes:** none

---

### S21-T3-B-E3 (weDo, transfer)
- **Diagnosis:** `check_parity` solo compara a==b — defect clásico de cierre. Transfer limpio. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** check_parity en tres artefactos
- **Proposed preamble:**  
  - **Contexto:** comparar solo dashboard y Excel deja pasar un DOCX divergente; el cierre exige tres vías.  
  - **Meta:** implementar `check_parity(a, b, c)` como `a == b == c`.  
  - **Éxito:** dos líneas — `True` luego `False`.  
  - **Límites:** no uses solo `a == b`; no ignores el tercer argumento.
- **Proposed instruction/description improvements:**  
  1. El starter hace `return a == b` (bug).  
  2. Cambia a igualdad encadenada de a, b y c.  
  3. Conserva los dos prints de prueba (alineado y divergente).  
  4. No mutes los dicts de entrada.
- **Proposed retrospective:**  
  Tres superficies, un número. Pregunta: ¿qué artefacto “se salva” si solo comparas dos? Puente a T4-A: misma precisión decimal y a11y mínima.
- **Code/output changes:** none

---

### S21-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de `fmt_pen` y gate a11y (H1 + alts largos). Description correcta; falta preamble de “28.0 vs 28 se leen como dos números” y retrospective del misconception “has_h1 basta para a11y”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Antes de mandar a revisión, el factory unifica **cómo se escribe** el número y si el paquete es mínimamente accesible. Esta demo formatea 28.04 y 28.0 a `28.0 PEN`, verifica un solo string decimal y un alt de figura con longitud útil. Observa que `a11y_min` exige H1 **y** alts no vacíos con más de 10 caracteres. No escribas aún; predice las tres líneas. Si un canal imprime `28` y otro `28.0`, el revisor ve dos métricas aunque sean iguales.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: centralizar `fmt_pen` evita divergencia Jinja/Excel; checklist mínima no es WCAG completa pero bloquea paquetes ilegibles.
- **Proposed retrospective:**  
  Una función de formato + gate a11y = consistencia tipográfica y mínima inclusión. We Do: round a 1 decimal, `fmt_pen` con unidad y `a11y_min` robusto frente a lista vacía.
- **Code/output changes:** none

---

### S21-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter redondea a 0 decimales — defect guiado perfecto. Instruction clara. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Precisión a 1 decimal PEN
- **Proposed preamble:**  
  - **Contexto:** el contrato del lab unifica métricas PEN a 1 decimal en dashboard, Excel e informe.  
  - **Meta:** redondear `vals = [28.04, 28.0]` a 1 decimal.  
  - **Éxito:** imprime `[28.0, 28.0]`.  
  - **Límites:** no uses `round(..., 0)`; no hardcodees la lista de salida.
- **Proposed instruction/description improvements:**  
  1. El starter hace `round(v, 0)` (bug).  
  2. Cambia a `round(v, 1)` en la comprehension.  
  3. Imprime la lista resultante.  
  4. Verifica que ambos elementos sean 28.0.
- **Proposed retrospective:**  
  0 decimales “aplana” y rompe el contrato de 1 decimal del factory. Siguiente (E2): encapsular redondeo + unidad en `fmt_pen`.
- **Code/output changes:** none

---

### S21-T4-A-E2 (weDo, independent)
- **Diagnosis:** `fmt_pen` sin sufijo PEN — defect de centralización. Instruction y feedback buenos. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** fmt_pen con unidad PEN
- **Proposed preamble:**  
  - **Contexto:** si Jinja y Excel inventan el sufijo por separado, un canal escribe “PEN” y otro “soles” o nada.  
  - **Meta:** implementar `fmt_pen(x)` a 1 decimal con sufijo ` PEN`.  
  - **Éxito:** imprime `28.0 PEN` para 28.04.  
  - **Límites:** no omitas la unidad; no redondees a 0 decimales.
- **Proposed instruction/description improvements:**  
  1. El return del starter solo formatea el número.  
  2. Agrega el literal ` PEN` al f-string.  
  3. Conserva `round(float(x), 1)`.  
  4. Imprime `fmt_pen(28.04)`.
- **Proposed retrospective:**  
  Formatter central = paridad tipográfica. Luego (E3): gate a11y que no se engañe con `all([])`.
- **Code/output changes:** none

---

### S21-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de alto valor pedagógico (`all([])` es True). Starter solo mira `has_h1`. Instruction y feedback ya enseñan el truco de Python. Falta title/preamble formales y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** a11y_min con H1 y alts útiles
- **Proposed preamble:**  
  - **Contexto:** publicar un paquete sin alternativas de figura falla a lectores con tecnología asistiva — y al checklist del lab.  
  - **Meta:** `a11y_min(has_h1, alts)` exige H1, lista no vacía y todos los alt con más de 10 caracteres.  
  - **Éxito:** tres líneas — `True`, `False`, `False`.  
  - **Límites:** no devuelvas solo `has_h1`; recuerda que `all([])` es True en Python.
- **Proposed instruction/description improvements:**  
  1. El starter retorna solo `has_h1`.  
  2. Combina `bool(has_h1)`, `len(alts) > 0` y `all(len(a) > 10 for a in alts)`.  
  3. Conserva los tres prints de prueba (válido, corto, vacío).  
  4. No borres el caso de lista vacía: es el truco del edge case.
- **Proposed retrospective:**  
  `all([])` aprueba por vacío; por eso exiges longitud de lista. Puente a T4-B: provenance, huella y `ready` con `all()` sobre la checklist visual.
- **Code/output changes:** none

---

### S21-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de manifiesto JSON con run_id, huella, artefactos, checklist visual y `pending_review`. Description correcta; falta preamble de “print ok ≠ cierre” y retrospective del misconception “el script puede marcar approved”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El cierre del factory es **gobernanza**: quién generó qué, con qué datos, y quién miró el paquete. Esta demo emite un manifiesto con run_id, recorte sha1 de lab, lista de artefactos, checklist visual completa y `approval.status = pending_review`. Observa también `ready_for_review` con `all(...)` sobre la checklist. No escribas aún; predice el JSON y el booleano. Un print de “ok” o un dict solo en memoria no sustituye el manifiesto ni los archivos en disco — y **nunca** marques `approved` desde el factory (eso es S22 humano).
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: provenance + checklist cierran CP-N2-B; en producción preferir SHA-256 del artefacto completo; el recorte de 8 hex es id didáctico.
- **Proposed retrospective:**  
  `pending_review` es el estado honesto de cierre de contenido. We Do: completar manifiesto, calcular huella corta y `ready` con `all()` no `any()`.
- **Code/output changes:** none

---

### S21-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter con `approved` hardcodeado y sin run_id/huella — defect de gobernanza excelente. Instruction clara. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Manifiesto pending_review (no approved)
- **Proposed preamble:**  
  - **Contexto:** el factory prepara el paquete; la aprobación humana es S22. Marcar `approved` en código es fraude de proceso.  
  - **Meta:** completar run_id, data_sha1_8 y `approval.status = pending_review`.  
  - **Éxito:** imprime `cpn2b-01 pending_review`.  
  - **Límites:** no hardcodees `approved`; no omitas run_id.
- **Proposed instruction/description improvements:**  
  1. El starter tiene status `approved` y no trae run_id/huella.  
  2. Agrega `"run_id": "cpn2b-01"` y `"data_sha1_8": "385fcd67"`.  
  3. Cambia status a `"pending_review"`.  
  4. Imprime run_id y status desde el dict (una línea, espacio entre ambos).
- **Proposed retrospective:**  
  Manifiesto sin run_id no es provenance. `pending_review` deja la puerta abierta a comentarios del revisor. Siguiente (E2): calcular la huella corta del payload de lab.
- **Code/output changes:** none

---

### S21-T4-B-E2 (weDo, independent)
- **Diagnosis:** Starter imprime digest completo; hay que cortar a 8 hex. Instruction ya aclara SHA-256 en producción. Hint spoila levemente el slice. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Huella corta sha1[:8] de lab
- **Proposed preamble:**  
  - **Contexto:** el manifiesto necesita un id de payload; en el lab usamos 8 hex de sha1 como didáctica.  
  - **Meta:** calcular sha1 de `b"synthetic"` y mostrar solo los primeros 8 hex.  
  - **Éxito:** imprime `385fcd67`.  
  - **Límites:** no imprimas el digest completo; no uses otro payload.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `hexdigest()` entero.  
  2. Aplica el slice `[:8]` al resultado.  
  3. Conserva `hashlib.sha1(b"synthetic")`.  
  4. Imprime solo la cadena de 8 caracteres.
- **Proposed retrospective:**  
  Recorte de 8 hex = id de lab (débil ante colisiones). En producción firma el artefacto completo con SHA-256. Luego (E3): `ready` exige todos los artefactos, no “alguno”.
- **Code/output changes:** none
- **Validation notes:** Valor canónico 385fcd67 alineado a theory T4-B; no cambiar.

---

### S21-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Starter usa `any()` — el anti-patrón del cierre del paquete. Transfer limpio y feedback excelente. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** ready(checklist) con all()
- **Proposed preamble:**  
  - **Contexto:** un solo artefacto “ok” no cierra CP-N2-B; faltan dashboard, xlsx y doc.  
  - **Meta:** implementar `ready(checklist)` como `all(checklist.values())`.  
  - **Éxito:** dos líneas — `True` luego `False`.  
  - **Límites:** no uses `any()`; un artefacto fallido bloquea el cierre.
- **Proposed instruction/description improvements:**  
  1. El starter retorna `any(...)` (bug).  
  2. Cámbialo a `all(checklist.values())`.  
  3. Conserva los dos prints (checklist completa e incompleta).  
  4. No rellenes a mano los booleanos de salida.
- **Proposed retrospective:**  
  `any()` aprueba con un solo verde; el factory exige el paquete completo. Pregunta de cierre: ¿qué checklist dejarías en False a propósito para detener un envío a S22? El You Do une DOCX, PDF, PNG y manifiesto en una corrida.
- **Code/output changes:** none

---

### youDo (youDo) — Reporting Factory — cierre CP-N2-B
- **Diagnosis:** Marco de proyecto **muy sólido**: context con CASO-LIM-021, objectives, requirements (missing, paridad, pending_review, sin PII), starter con `build_docx` / `build_pdf` / `extract_and_render` / `manifest`, portfolioNote y rubric. Falta únicamente `retrospective` de defensa metacognitiva post-build. Un newbie puede “completar funciones” sin poder defender el paquete en 30 segundos ante el comité.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context ya cumple rol de escena; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Ningún cambio estructural. Opcional (P2): en `portfolioNote` o al pie del starter, una línea que diga “antes de marcar listo, responde las tres preguntas de la retrospective”.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante de paridad demuestras con un print o assert (median_Lima y n_Lima iguales en context, DOCX reabierto y PDF extraído)? (2) ¿por qué el manifiesto deja `pending_review` y no `approved`, y qué revisaría un humano en la checklist visual? (3) Escribe en el README una frase de impacto medible (antes: tres exportaciones divergentes / después: un run_id y un número) que puedas defender en 30 segundos ante un comité de operaciones en Lima. Datos solo sintéticos; sin PII.
- **Code/output changes:** none
- **Validation notes:** Starter y rubric alineados a T1–T4; no proponer reescritura del scaffold.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si aplica)
1. **T1-A** E1 → E2 → E3 (portada → KPI → render_kpi)  
2. **T1-B** E1 → E2 → E3 (missing → .2f → for filas)  
3. **T2-A** E1 → E2 → E3 (DOCX Resumen/n → Heading count → tabla —)  
4. **T2-B** E1 → E2 → E3 (PDF n=40 → PNG → needs_ocr)  
5. **T3-A** E1 → E2 → E3 (H1 decision=None → resumen n=/PEN → pack_report)  
6. **T3-B** E1 → E2 → E3 (paridad+limits → caption Fuente → check_parity 3 vías)  
7. **T4-A** E1 → E2 → E3 (1 decimal → fmt_pen → a11y_min)  
8. **T4-B** E1 → E2 → E3 (manifiesto pending_review → sha1[:8] → ready all)

### P1 (I Do preamble + retrospective + why ampliado; You Do retrospective)
1. Ocho demos S21-T1-A … T4-B  
2. youDo retrospective de defensa

### P2 (polish)
1. Suavizar hints que spoilean el output exacto (T1-B-E2, T4-B-E2)  
2. Feedback: una frase extra de *impacto en el comité* donde hoy solo hay corrección técnica  
3. Opcional: enlace explícito “responde la retrospective” en portfolioNote del You Do

---

## Residual risks

1. **Nombre histórico `fastapi` / archivo `s21-fastapi.ts`:** confunde a quien busca APIs HTTP; el contenido es Reporting Factory. El Fixer no debe “corregir” el id sin plan de migración, pero la prosa pedagógica debe seguir anclada a documentos/paridad, no a FastAPI.  
2. **ASCII “sintetico” en canvas ReportLab:** es intencional; no “arreglar” tildes en PDF de lab o fallarán expectativas de extracción/hash.  
3. **Em-dash `—` vs guion `-`:** el contrato del lab usa em-dash Unicode; el Fixer debe preservar el glifo en preambles y no normalizar a ASCII.  
4. **Carga cognitiva de T2 (deps reales):** DOCX/PDF/PNG requieren venv; preambles deben recordar “archivos en disco”, no solo dicts, para no empujar a soluciones en memoria.  
5. **E3 de T1-A con n=18 (Cusco):** riesgo de que el learner crea que rompe paridad del paquete Lima n=40; la instruction actual lo aclara — la preamble propuesta debe **conservar** ese matiz.  
6. **Volumen (24 We Do):** el Fixer debe escribir a mano; no reutilizar un párrafo-plantilla entre subtemas o se viola anti-aberration.  
7. **Código/outputs:** estables y alineados a theory; cambios de código solo si un defect del starter deja de ser intencional o un test miente — no es el caso en esta revisión.

---

## Fixer notes (operativos)

- Campos schema preferidos: I Do `preamble` + `retrospective` (+ `why` ampliado); We Do `title` + `preamble` + `instruction` (solo pasos) + `retrospective` (+ `feedback` refinado); You Do `retrospective`.  
- Longitudes del spec: title 4–12 palabras; preamble 80–150 palabras o 4 bullets; instruction 40–100 palabras; retrospective 40–80; feedback 25–60; why 40–90.  
- Conservar `tests`, `output`, starters y solutionCodes salvo bug real de ejecución.  
- Español profesional peruano; datos sintéticos; sin PII.  
- Fade: E1 nombra el defect; E2 menos migas; E3 superficie nueva (función, needs_ocr, all, tres vías).  
- No generators; no bulk replace de prosa entre secciones.

---

Section 21 exercise pedagogy review complete. Ready for the Fixer prompt.
