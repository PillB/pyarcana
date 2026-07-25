# S20 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Automatización robusta de Excel
- **shortTitle:** Excel factory
- **id:** `rag` (archivo histórico `s20-rag.ts`; contenido = excel factory openpyxl / plantillas / conciliación / batch / manifest — no RAG)
- **index:** 20
- **source:** `src/lib/course/sections/s20-rag.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S20-T1-A sheets/celdas/encabezados · T1-B fórmulas vs. valores materializados · T2-A estilos y plantilla copy→save · T2-B fechas ISO y merges · T3-A conciliación y pivots · T3-B validación estructural y dominios · T4-A batch corrupt/lock · T4-B backup, idempotencia y manifest
- **hilo de caso:** excel factory CP-N2-B / workbook sintético `cpn2b_factory.xlsx` (hojas canónicas Entrada/Salida, regiones Lima–Cusco–Arequipa, montos PEN; plantilla master intocable + manifest auditable; puente a empaquetado S21)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s20-rag.ts` (demos ~345–605, weDo ~607–1583, youDo ~1585–1724).
- Contrastado con el hilo de la sección: plantilla master, materialización de KPIs, conciliación fail-closed, batch con BadZipFile/locks, manifest JSON; sin PII real.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S20 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y clara (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente; a menudo **1–2 frases** (bajo o al borde del piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — Concepto: X. … Salida esperada:**”: meta + éxito mezclados; legible para quien ya maneja openpyxl, **opaco** para newbie sin escena del factory del VP |
| We Do `feedback` | Una o dos frases; a menudo nombra el error típico (bien); poco *por qué importa al auditor / al VP* |
| Starter con defect nombrado | **Bueno a excelente**: varios starters documentan el bug (`# Pista:…`, contador invertido, `mean` vs `sum`, `idempotent=False`, `structural_ok` con `==`) |
| Hints | E1 casi-solución (aceptable para guided); E2/E3 a veces dan la API exacta (spoiling leve en T4-A-E3 / T2-A-E2) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con huecos **sólidos** y alineados al gate CP-N2-B |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y con el mini-contrato del factory; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (defect intencional, output canónico, fade real E1→E3, E3 de plantilla copy→save y manifest como mini-integración) es maduro y alineado al excel factory. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en el cierre de mes del VP, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: renombrar A1 → append filas → sheetnames Entrada/Salida; T2-A: Font bold → PatternFill corporativo → copy→load→write→save; T4-B: manifest mínimo → dig orden-invariante → structural_ok superset). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S20-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de workbook con `Entrada`/`Salida`, append de filas y KPI `n_filas` materializado. La `description` nombra el contrato de sheets; falta `preamble` que diga *qué observar antes del código* (orden de `sheetnames`, que `max_row` incluye header) y `retrospective` del misconception “la hoja default `Sheet` ya es un nombre de negocio”. El `why` es corto pero acertado.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El excel factory del VP exige nombres de hoja estables: `Entrada` para el detalle y `Salida` para los KPIs. En esta demo creas ambos, escribes filas sintéticas Lima/Cusco y materializas `n_filas` en `Salida`. No escribas aún; predice `sheetnames`, el entero `n` y el valor de A2 antes de mirar la salida. Si dejas la hoja como `Sheet`, tres scripts ajenos rompen en el cierre de mes.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): los headers de la fila 1 anclan `iter_rows` y la conciliación; `n_filas = max_row - 1` es el mismo conteo que usará el gate con el dashboard de S19; nunca improvisar un sheet vacío en silencio si falta `Salida`. Puente a We Do T1-A: renombrar, append y crear el par canónico.
- **Proposed retrospective:**  
  Si puedes explicar por qué `['Entrada', 'Salida']` es un contrato y no decoración, ya tienes el hábito de sheetnames canónicos. El error clásico es renombrar a “Input_v2” y romper el factory. En We Do practicarás renombrar A1, append de filas y crear el par Entrada/Salida.
- **Code/output changes:** none
- **Validation notes:** Output `['Entrada', 'Salida']` / `n 2` / `A2 Lima` alineado a theory T1-A.

---

### S20-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado correcto: starter imprime `sheetnames` y A1 sin renombrar ni escribir header. Instruction telegráfica “Crea workbook… Salida esperada”; sin title, preamble ni retrospective. Feedback nombra `['Sheet']` y A1 None, pero no ancla al contrato del VP.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Renombrar hoja a Entrada y anclar header
- **Proposed preamble:**  
  - **Contexto:** sin hoja `Entrada` y sin header `region` en A1, el factory no sabe dónde leer el detalle del VP.  
  - **Meta:** renombrar la hoja activa y escribir el encabezado contractual.  
  - **Éxito:** dos líneas exactas: `['Entrada']` y `region`.  
  - **Límites:** no crees aún `Salida`; no uses nombres con espacios; imprime solo sheetnames y A1.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime la hoja default y A1 vacío (bug).  
  2. Asigna `ws.title = "Entrada"`.  
  3. Escribe `ws["A1"] = "region"`.  
  4. Imprime `wb.sheetnames` y luego `ws["A1"].value`.
- **Proposed feedback improvement:**  
  Si ves `['Sheet']` (o similar), te faltó renombrar a `Entrada`. Si A1 es `None`, falta el header `region`: sin él el factory no ancla lecturas ni conciliación.
- **Proposed retrospective:**  
  Nombre de hoja + header de fila 1 son el “schema” del xlsx. El error clásico es confiar en “la primera columna” sin nombre. Siguiente (E2): append de header + fila de datos y medir `max_row`.
- **Code/output changes:** none
- **Validation notes:** Defect implícito claro; solution y output correctos.

---

### S20-T1-A-E2 (weDo, independent)
- **Diagnosis:** Foco independiente correcto (`append` header + fila → `max_row == 2`). Instruction densa; no explica *por qué* `max_row` cuenta el header (newbie suele esperar 1). Sin escena de “n de filas de datos para conciliar”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Append de header y fila; medir max_row
- **Proposed preamble:**  
  - **Contexto:** el gate de conciliación necesita saber cuántas filas de detalle hay; `max_row` es el primer contador del sheet.  
  - **Meta:** cargar header + una fila con `append` y reportar `max_row`.  
  - **Éxito:** un solo entero `2` (header + Lima 10.0).  
  - **Límites:** no borres el header; no imprimas texto extra; no uses `iter_rows` todavía.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `max_row` sin filas útiles.  
  2. Haz `ws.append(["region", "monto"])`.  
  3. Haz `ws.append(["Lima", 10.0])`.  
  4. Imprime solo `ws.max_row`.
- **Proposed retrospective:**  
  `max_row` incluye la fila de encabezado: datos de negocio = `max_row - 1`. Ese `n` reaparece en `Salida` y en el manifest. Luego (E3) fijarás el par canónico `Entrada`/`Salida`.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S20-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real al contrato de sheetnames del factory. Starter solo imprime la hoja default. Instruction ya da la salida canónica; falta anclar *por qué* el orden y los nombres importan al auditor, y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Sheetnames canónicos Entrada y Salida
- **Proposed preamble:**  
  - **Contexto:** el contrato mínimo del factory es `Entrada` + `Salida`; el resto del pipeline busca esos nombres, no “Hoja1”.  
  - **Meta:** renombrar la activa y crear la segunda hoja contractual.  
  - **Éxito:** una línea `['Entrada', 'Salida']`.  
  - **Límites:** no renombres a Input/Output; no dupliques nombres; imprime solo `sheetnames`.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: solo existe la hoja default.  
  2. Renombra `wb.active.title = "Entrada"`.  
  3. Crea `wb.create_sheet("Salida")`.  
  4. Imprime `wb.sheetnames`.
- **Proposed retrospective:**  
  El orden típico nace de “renombrar primero, crear después”. Pregunta de cierre: ¿qué rompe un script si alguien deja `Sheet` y crea `Salida`? Puente a T1-B: fórmulas vs. valores materializados en esas hojas.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico al contrato del You Do.

---

### S20-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro de fórmula como string vs. suma Python. Description y output enseñan `es_formula` / `python_value` / `no_evaluado_por_openpyxl`. Falta preamble de “CI sin Excel” y retrospective del misconception “si la fórmula se ve bien, el número está bien”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En CI Linux no hay motor Excel: openpyxl no “resuelve” `=B1+B2` solo porque lo leas. En esta demo ves la fórmula como texto, el valor materializado en Python (25) y la desigualdad deliberada entre ambos. No escribas aún; predice las tres líneas de salida. El auditor del factory mira el número materializado, no la estética de la fórmula.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `data_only=True` lee cache guardado, no ejecuta el motor; para asserts de KPI en el curso y en producción headless, escribe valores Python en `Salida`; puedes dejar la fórmula en celdas de presentación, pero el gate no depende de ella.
- **Proposed retrospective:**  
  Fórmula = contrato visual para el humano en Excel; valor Python = contrato auditable del factory. We Do: escribir el string `=…`, materializar sumas y detectar celdas con prefijo `=`.
- **Code/output changes:** none

---

### S20-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter pone A3=0 (numérico) en vez de fórmula — defect guiado perfecto. Instruction corta; sin escena de “fórmula para el VP / assert en CI”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Escribir fórmula como string en A3
- **Proposed preamble:**  
  - **Contexto:** a veces el VP quiere ver `=A1+A2` en la celda; el factory debe escribirla como texto, no como resultado.  
  - **Meta:** almacenar una fórmula real (string con prefijo `=`) y detectarla.  
  - **Éxito:** un booleano `True` (A3 empieza con `=`).  
  - **Límites:** no asignes el número 0 ni la suma; no uses `data_only`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: A3 es `0` y el print da False.  
  2. Reemplaza por `ws["A3"] = "=A1+A2"`.  
  3. Imprime `str(ws["A3"].value).startswith("=")`.  
  4. No calcules el resultado en la celda.
- **Proposed retrospective:**  
  La fórmula vive como string. Si imprimiste False, A3 sigue numérico o vacío. Siguiente (E2): materializar la suma en Python sin depender de Excel.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado en comentario del starter.

---

### S20-T1-B-E2 (weDo, independent)
- **Diagnosis:** Materialización numérica A1+A2 → 7. Starter usa `or 0` sobre celdas vacías (bug de no asignar). Instruction nombra “sin data_only”; falta por qué el factory prefiere este camino en headless.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Materializar suma de celdas en Python
- **Proposed preamble:**  
  - **Contexto:** el assert de KPI del factory se apoya en números ya calculados en Python, no en cache de Excel.  
  - **Meta:** asignar A1=3, A2=4 y materializar la suma leyendo `.value`.  
  - **Éxito:** un entero `7`.  
  - **Límites:** no uses `data_only`; no escribas fórmula en esta tarea; imprime solo el número.
- **Proposed instruction/description improvements:**  
  1. El starter suma celdas vacías con `or 0` → sale 0.  
  2. Asigna enteros a A1 y A2.  
  3. Imprime `ws["A1"].value + ws["A2"].value`.  
  4. No abras el archivo con `data_only=True`.
- **Proposed retrospective:**  
  Materializar = calcular en Python y (en el factory) volcar el número a `Salida`. El error clásico es creer que openpyxl “ya sumó” la fórmula. Luego (E3) un predicado `es_formula` reutilizable.
- **Code/output changes:** none

---

### S20-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a función `es_formula(v)`: starter siempre retorna True. Buen fade (de celda concreta a helper de inspección). Falta escena de “clasificar celdas antes de materializar KPIs”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Predicado es_formula por tipo y prefijo
- **Proposed preamble:**  
  - **Contexto:** antes de confiar en un KPI, el factory distingue celdas-fórmula de celdas-número.  
  - **Meta:** implementar `es_formula(v)` con tipo + prefijo `=`.  
  - **Éxito:** dos líneas: `True` para `"=A1"` y `False` para `3`.  
  - **Límites:** no devuelvas siempre True; no trates un int como fórmula aunque “parezca suma”.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `return True` siempre.  
  2. Devuelve `isinstance(v, str) and v.startswith("=")`.  
  3. Imprime el resultado para `"=A1"` y para `3`.  
  4. No normalices espacios en este ejercicio.
- **Proposed retrospective:**  
  Un número nunca es fórmula. Pregunta de cierre: ¿qué harías con `" =A1"` (espacio antes)? Puente a T2-A: estilos y plantilla intocable, donde el valor de negocio sigue siendo el número materializado.
- **Code/output changes:** none

---

### S20-T2-A-DEMO (iDo)
- **Diagnosis:** Demo completa copy→load→style→write→save con master intacto. Description y why acertados pero `why` de una sola frase. Falta preamble de “nunca guardar in-place sobre el master del VP” y retrospective del misconception “el master es mi borrador de trabajo”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El master `cpn2b_factory.xlsx` es el contrato visual del VP: no se sobrescribe. En esta demo se copia a `out/results.xlsx`, se estiliza el header corporativo y se escribe Lima 28.0 solo en la copia. Observa las dos líneas de salida: nombre de archivo, master intacto y bold del header. Predice qué pasaría si `save` apuntara al master: la siguiente corrida arrancaría con datos de ayer.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: `shutil.copy` → `load_workbook(out)` → escribir rangos de datos → `wb.save(out)`; estilos solo en presentación; el bool `master.exists()` es evidencia mínima de plantilla intocable para el manifest.
- **Proposed retrospective:**  
  Copy → load → write → save es el esqueleto del excel factory. We Do: bold, fill corporativo y el flujo completo en directorio temporal.
- **Code/output changes:** none

---

### S20-T2-A-E1 (weDo, guided)
- **Diagnosis:** Font bold en header KPI. Starter escribe texto pero no aplica Font. Instruction de drill; sin ancla al “header ejecutivo que el VP reconoce”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Header en negrita con Font bold
- **Proposed preamble:**  
  - **Contexto:** el header de la plantilla del VP se lee en negrita; el estilo vive en la celda, no en el workbook.  
  - **Meta:** escribir “KPI” en A1 y aplicar `Font(bold=True)`.  
  - **Éxito:** un booleano `True` (`ws["A1"].font.bold`).  
  - **Límites:** no cambies el texto a otro valor; no apliques fill aún.
- **Proposed instruction/description improvements:**  
  1. El starter imprime bold falso/None.  
  2. Tras escribir “KPI”, asigna `ws["A1"].font = Font(bold=True)`.  
  3. Imprime `ws["A1"].font.bold`.  
  4. No reasignes A1 después del font.
- **Proposed retrospective:**  
  El estilo se adjunta a la celda después del valor. Siguiente (E2): color corporativo `1F4E79` con PatternFill — el fill por defecto no basta.
- **Code/output changes:** none

---

### S20-T2-A-E2 (weDo, independent)
- **Diagnosis:** PatternFill corporativo con validación de RGB — excelente trampa didáctica (fill default no es None). Instruction técnica; falta *por qué* el color es parte del contrato visual del master.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fill corporativo 1F4E79 en el header
- **Proposed preamble:**  
  - **Contexto:** el azul `1F4E79` es el color de encabezado de la plantilla; el fill por defecto de openpyxl no lo trae.  
  - **Meta:** aplicar `PatternFill("solid", fgColor="1F4E79")` y validar el RGB.  
  - **Éxito:** un booleano `True` (rgb termina en `1F4E79`).  
  - **Límites:** no basta `fgColor is not None`; no uses theme color genérico.
- **Proposed instruction/description improvements:**  
  1. El starter lee el fill default y falla el endswith.  
  2. Asigna el PatternFill solid con fgColor corporativo.  
  3. Lee `ws["A1"].fill.fgColor.rgb`.  
  4. Imprime la comparación con endswith `"1F4E79"`.
- **Proposed retrospective:**  
  Validar el RGB evita “se ve azul en mi laptop” sin contrato. Luego (E3) el patrón completo de plantilla intocable: copiar master, escribir en la copia, dejar master vivo.
- **Code/output changes:** none

---

### S20-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Mini-integración copy→load→write→save; starter falla con `no_output`/`False` si no se copia. Excelente transferencia al You Do. Instruction larga (aceptable para transfer) pero mezcla contexto y pasos; sin preamble formal ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Plantilla intocable: copy, load, save
- **Proposed preamble:**  
  - **Contexto:** el master del factory no se toca; todo el trabajo va a `out/results.xlsx`.  
  - **Meta:** copiar master, abrir la **copia**, escribir A2=`Lima`, guardar y probar que el master sigue existiendo.  
  - **Éxito:** dos líneas: `results.xlsx` y `True`.  
  - **Límites:** nunca `save` sobre el master; no omitas `shutil.copy`; no inventes otro path de salida.
- **Proposed instruction/description improvements:**  
  1. El starter intenta `load_workbook(out)` sin copiar → `no_output` / False.  
  2. Tras crear `out`, haz `shutil.copy(master, out)`.  
  3. `load_workbook(out)`, escribe A2=`"Lima"`, `wb.save(out)`.  
  4. Imprime `out.name` y `master.exists() and A2 == "Lima"`.
- **Proposed retrospective:**  
  Si la segunda línea es False, no copiaste, no escribiste A2 o dañaste el master. Este es el esqueleto del *Tú haces*. Puente a T2-B: fechas ISO y merges sin romper el layout.
- **Code/output changes:** none
- **Validation notes:** Starter con try/except didáctico es fuerte; no cambiar outputs.

---

### S20-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de fecha ISO + merge B1:D1 con lectura de ancla vs. no-ancla (`None`). Why de una frase. Falta preamble de locale ambiguo “03/04/24” y retrospective “leer C1/D1 del merge devuelve el valor”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Las fechas ambiguas por locale rompen pipelines entre laptops; aquí se usa `date(2024, 6, 30)` e `isoformat()`. Además un merge de presentación: el valor vive solo en la celda ancla B1; D1 lee `None`. Observa las tres líneas antes de copiar el patrón. Un merge sobre filas de detalle (no solo portada) rompe `iter_rows` y la conciliación.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: serializar ISO o datetime documentado; merges solo en presentación; leer/escribir siempre en ancla; no silenciar errores de archivo bloqueado (se reutiliza en T4).
- **Proposed retrospective:**  
  ISO evita “¿marzo o abril?”. Ancla = top-left del merge. We Do: fecha en metadata, valor de no-ancla y conteo de rangos merged.
- **Code/output changes:** none

---

### S20-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter asigna string `"2024-01-15"` en vez de `date` — trampa perfecta (getattr isoformat cae al string). Sin escena de “corte de mes en metadata del factory”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Fecha de corte como date ISO
- **Proposed preamble:**  
  - **Contexto:** el data note del factory repite el corte de mes en metadata; un string no es un `date`.  
  - **Meta:** escribir `date(2024, 1, 15)` y serializar con `isoformat()`.  
  - **Éxito:** una línea `2024-01-15`.  
  - **Límites:** no dejes el string en A1; no uses locale del SO.
- **Proposed instruction/description improvements:**  
  1. El starter asigna el string y no garantiza `isoformat` real.  
  2. Asigna `date(2024, 1, 15)` a A1.  
  3. Imprime `ws["A1"].value.isoformat()`.  
  4. No formatees a mano con f-string.
- **Proposed retrospective:**  
  `date` + `isoformat` = contrato portable. Siguiente (E2): el valor del merge no vive en la celda no-ancla.
- **Code/output changes:** none

---

### S20-T2-B-E2 (weDo, independent)
- **Diagnosis:** Merge B1:C1; éxito es `None` en C1. Starter mergea pero no escribe en ancla (aún así C1 es None — el learner puede “pasar” sin escribir en B1). Pedagogically the success criterion is only C1 None, which is true even without writing anchor. Worth noting for Fixer: instruction asks to write "x" in B1; starter already prints C1 without write — solution writes B1 but output is still None. Diagnosis should mention that partial completion can still match output if they only print C1 after merge without writing B1 — still pedagogically OK because the point is non-anchor is None.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Leer celda no-ancla de un merge
- **Proposed preamble:**  
  - **Contexto:** automatizar merges sin mapear la ancla lee `None` donde el VP “ve” un valor.  
  - **Meta:** mergear B1:C1, escribir en la ancla B1 e imprimir C1.  
  - **Éxito:** una línea `None` (C1 no-ancla).  
  - **Límites:** no escribas el valor en C1; no unmerges; el valor de negocio va en B1.
- **Proposed instruction/description improvements:**  
  1. Ya hay `merge_cells("B1:C1")`.  
  2. Escribe `ws["B1"] = "x"`.  
  3. Imprime `ws["C1"].value` (debe ser None).  
  4. No uses C1 como fuente de verdad.
- **Proposed retrospective:**  
  Ancla = esquina superior izquierda. Si lees no-ancla, el pipeline “pierde” montos. Luego (E3) contar cuántos bloques merged hay activos.
- **Code/output changes:** none (opcional nota Fixer: el output no verifica que B1 tenga "x"; si se quiere endurecer tests, habría que imprimir también la ancla — fuera de scope si se preservan outputs)

---

### S20-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Contar dos merges con `len(merged_cells.ranges)`. Starter solo crea uno → 1. Transfer limpio. Falta por qué el factory inventaría un check de merges antes de `iter_rows` en rangos de datos.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar bloques merged activos
- **Proposed preamble:**  
  - **Contexto:** antes de leer detalle, conviene saber cuántos merges de presentación hay; un merge sobre datos rompe el factory.  
  - **Meta:** crear dos merges e imprimir cuántos rangos activos hay.  
  - **Éxito:** un entero `2`.  
  - **Límites:** no unmerges; no cuentes celdas sueltas, solo bloques.
- **Proposed instruction/description improvements:**  
  1. Ya existe merge A1:B1.  
  2. Añade `ws.merge_cells("C1:D1")`.  
  3. Imprime `len(ws.merged_cells.ranges)`.  
  4. Si sale 1, falta el segundo bloque.
- **Proposed retrospective:**  
  `len(ranges)` cuenta bloques, no celdas del merge. Pregunta: ¿qué pasa si alguien mergea A2:A100 “para que se vea lindo”? Puente a T3-A: conciliar totales y pivots lógicos.
- **Code/output changes:** none

---

### S20-T3-A-DEMO (iDo)
- **Diagnosis:** Conciliación portada 35.5 vs. detalle + pivot por región. Why corto. Falta preamble de “portada optimista a gerencia” y retrospective fail-closed.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un total de portada que no cuadra con el detalle es el error típico de cierre de mes. Aquí el detalle Lima/Lima/Arequipa/Cusco suma 35.5 y el pivot materializa sumas por región. Observa el dict del pivot y el booleano `reconcile True`. Sin este control, el paquete viaja a S21 con números “optimistas”.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: `abs(sum_det - portada) < tol` con tol típica 0.01 PEN; el pivot en Excel es para el humano, el factory pega el groupby ya calculado; el resultado vive también en el manifest (`reconcile_ok`).
- **Proposed retrospective:**  
  Conciliar n y montos es el quality gate del workbook. We Do: corregir portada desde celdas, groupby sum y función `reconcile` con tolerancia.
- **Code/output changes:** none

---

### S20-T3-A-E1 (weDo, guided)
- **Diagnosis:** Portada B1=16 incorrecta vs. B2+B3=15; learner debe corregir B1. Feedback bueno. Falta escena fail-closed del factory.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Corregir portada para conciliar con detalle
- **Proposed preamble:**  
  - **Contexto:** la portada del Excel (B1) no puede “inventar” un total distinto del detalle B2+B3.  
  - **Meta:** materializar la suma del detalle, alinear B1 y chequear tolerancia 0.01.  
  - **Éxito:** un booleano `True`.  
  - **Límites:** no cambies B2/B3 para “hacer cuadrar”; corrige la portada; no uses tol=0.
- **Proposed instruction/description improvements:**  
  1. El starter deja B1=16 → print False.  
  2. Calcula `det = B2 + B3` (15).  
  3. Escribe B1=15 (o 15.0).  
  4. Imprime `abs(det - portada) < 0.01`.
- **Proposed retrospective:**  
  El detalle manda; la portada se alinea o se falla. Fail-closed = no emitir paquete si no cuadra. Siguiente (E2): pivot lógico con groupby sum.
- **Code/output changes:** none

---

### S20-T3-A-E2 (weDo, independent)
- **Diagnosis:** Starter usa `mean` en vez de `sum` — defect excelente y alineado al factory. Instruction nombra la salida esperada del dict.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Pivot lógico: groupby sum por región
- **Proposed preamble:**  
  - **Contexto:** el factory materializa el pivot en pandas y lo pega en `Salida`; no es un promedio de montos.  
  - **Meta:** sumar montos por región con `groupby`.  
  - **Éxito:** `{'Cusco': 7.0, 'Lima': 15.0}`.  
  - **Límites:** no uses `mean`; no reordenes a mano el dict (el orden de groupby es el canónico del output).
- **Proposed instruction/description improvements:**  
  1. El starter imprime promedios (mean) — bug.  
  2. Cambia a `.sum().to_dict()`.  
  3. Imprime el dict resultante.  
  4. Verifica mentalmente: Lima 10+5=15, Cusco 7.
- **Proposed retrospective:**  
  Mean vs sum es el bug silencioso del “KPI que se ve razonable”. El pivot del factory es suma. Luego (E3) empaquetar la regla en `reconcile(det, portada, tol)`.
- **Code/output changes:** none

---

### S20-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Función `reconcile` con tol default 0.0 (bug) vs. 0.01. Transfer limpio al gate. Falta anclar PEN y fail-closed.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Función reconcile con tolerancia 0.01
- **Proposed preamble:**  
  - **Contexto:** en PEN a 2 decimales, “casi igual” necesita tolerancia documentada (0.01), no igualdad bit a bit.  
  - **Meta:** completar `reconcile` con `tol=0.01` por defecto.  
  - **Éxito:** dos líneas: `True` (22.0 vs 22.005) y `False` (22.0 vs 23.0).  
  - **Límites:** no dejes `tol=0.0`; no uses `<=` con semántica distinta sin documentar.
- **Proposed instruction/description improvements:**  
  1. El starter tiene `tol=0.0` y falla el primer caso.  
  2. Cambia el default a `0.01`.  
  3. Mantén `abs(det_sum - portada) < tol`.  
  4. Imprime los dos pares del enunciado.
- **Proposed retrospective:**  
  Tol documentada evita discusiones de fin de mes. Pregunta: ¿por qué 22.005 pasa y 23.0 no? Puente a T3-B: validar headers y dominios **antes** de materializar.
- **Code/output changes:** none

---

### S20-T3-B-DEMO (iDo)
- **Diagnosis:** Headers OK + regiones Piura/Ica fuera de allowlist → abort. Why corto. Falta preamble de “validar antes de escribir el lote a las 23:00”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Headers exactos y dominios de región son el schema del workbook del VP. En esta demo los headers coinciden, pero Piura e Ica no están en la allowlist Lima/Cusco/Arequipa: se listan violators y se aborta. Observa las tres líneas. Un `structural_ok False` debe ir al manifest, no solo a un print fugaz.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: fail-fast evita rehacer el paquete a medianoche; no “arreglar” en silencio el orden de columnas ni inventar regiones; la lista de violators es evidencia auditable.
- **Proposed retrospective:**  
  Primero headers, luego dominio, luego escritura. We Do: completar header en hoja, filtrar violators y función `validate_rows`.
- **Code/output changes:** none

---

### S20-T3-B-E1 (weDo, guided)
- **Diagnosis:** Falta B1=`monto` en la hoja; comparación de listas de headers. Feedback OK. Sin escena de schema contractual.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Completar headers region y monto
- **Proposed preamble:**  
  - **Contexto:** si falta el header `monto`, el lote no debe escribirse: el schema del VP está roto.  
  - **Meta:** completar B1 y validar igualdad exacta de listas de headers.  
  - **Éxito:** un booleano `True`.  
  - **Límites:** no reordenes columnas; no ignores `None` en B1; comparación sensible al orden.
- **Proposed instruction/description improvements:**  
  1. Solo A1=`region` está escrito.  
  2. Asigna B1=`"monto"`.  
  3. Arma `got` con A1 y B1.  
  4. Imprime `expected == got`.
- **Proposed retrospective:**  
  Headers incompletos fallan antes de materializar `Salida`. Siguiente (E2): allowlist de regiones leídas desde la hoja.
- **Code/output changes:** none

---

### S20-T3-B-E2 (weDo, independent)
- **Diagnosis:** Starter imprime todas las regiones sin filtrar. Instruction clara con violators. Buen independent.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Listar regiones fuera de la allowlist
- **Proposed preamble:**  
  - **Contexto:** el factory aborta con la lista de violators, no con un bool silencioso que el auditor no puede auditar.  
  - **Meta:** leer A2/A3 y devolver solo regiones no permitidas.  
  - **Éxito:** `['Piura']` (Lima está permitida).  
  - **Límites:** no imprimas todas las regiones; no inviertas el predicado hacia las válidas.
- **Proposed instruction/description improvements:**  
  1. El starter hace `print(regs)` sin filtrar.  
  2. Filtra con `r not in allowed`.  
  3. Imprime la lista de violators.  
  4. Case-sensitive: no normalices a lower en este ejercicio.
- **Proposed retrospective:**  
  Violators nombrados = evidencia. Si imprimiste Lima, invertiste el predicado. Luego (E3) la misma regla en función reutilizable sobre filas dict.
- **Code/output changes:** none

---

### S20-T3-B-E3 (weDo, transfer)
- **Diagnosis:** `validate_rows` con predicado invertido (`in` vs `not in`) — defect clásico excelente. Transfer a API de función.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** validate_rows devuelve violators
- **Proposed preamble:**  
  - **Contexto:** la validación de dominio se reutiliza en batch y en el manifest; debe devolver **quién** falló.  
  - **Meta:** corregir el predicado para listar regiones fuera de `allowed`.  
  - **Éxito:** `['Ica']` con fixture Lima+Ica y allowlist Lima/Cusco/Arequipa.  
  - **Límites:** no devuelvas las válidas; no mutes `rows`.
- **Proposed instruction/description improvements:**  
  1. El starter filtra `in allowed` (invierte violators).  
  2. Cambia a `not in allowed`.  
  3. Imprime el resultado de la llamada dada.  
  4. No hardcodees `['Ica']`.
- **Proposed retrospective:**  
  `in` vs `not in` es el typo que manda Ica a gerencia. Pregunta: ¿qué va al manifest si la lista no está vacía? Puente a T4-A: batch con corruptos y locks.
- **Code/output changes:** none

---

### S20-T4-A-DEMO (iDo)
- **Diagnosis:** Batch de 4 paths con contadores ok/corrupt/locked. Why de una frase. Falta preamble de “archivo abierto por el contador no tumba el lote de la noche”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En una carpeta compartida de finanzas, un xlsx corrupto o bloqueado no debe tumbar el batch nocturno. Esta demo clasifica ok/corrupt/locked y resume conteos: 2 ok, 1 corrupt, 1 locked. Observa el dict por path y el summary. El auditor mira primero `ok_count`; el corrupt va a cuarentena con su nombre en el log.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: `BadZipFile` porque xlsx es zip; `PermissionError` = lock; el lote continúa; contadores alimentan el summary JSON del factory.
- **Proposed retrospective:**  
  Aislar fallos, no abortar todo el lote. We Do: ok_count, classify con try/except y Counter del summary.
- **Code/output changes:** none

---

### S20-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter cuenta `corrupt` en vez de `ok` — bug explícito y alineado al auditor. Instruction ya habla de manifest; falta preamble formal.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** ok_count del batch para el summary
- **Proposed preamble:**  
  - **Contexto:** el summary del factory reporta cuántos archivos quedaron `ok`; ese número es lo primero que mira el auditor.  
  - **Meta:** contar estados `"ok"` en el mapa de clasificación.  
  - **Éxito:** un entero `2` (a y c ok; b corrupt).  
  - **Límites:** no cuentes corrupt ni keys; itera `status.values()`.
- **Proposed instruction/description improvements:**  
  1. El BUG del starter suma `v == "corrupt"`.  
  2. Cambia a `v == "ok"`.  
  3. Imprime el `sum(...)`.  
  4. No hardcodees 2.
- **Proposed retrospective:**  
  Contador correcto = evidencia de lote sano. Siguiente (E2): implementar `classify` real con excepciones.
- **Code/output changes:** none

---

### S20-T4-A-E2 (weDo, independent)
- **Diagnosis:** `classify` sin try/except; `in_use.xlsx` → PermissionError debe ser locked. Feedback corto pero certero.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** classify: ok, corrupt o locked
- **Proposed preamble:**  
  - **Contexto:** cada path del batch se clasifica sin tumbar el proceso: éxito, zip roto o archivo en uso.  
  - **Meta:** capturar `BadZipFile` → corrupt y `PermissionError` → locked.  
  - **Éxito:** una línea `locked` para `in_use.xlsx`.  
  - **Límites:** no devuelvas siempre `ok`; no tragues `Exception` genérica silenciando bugs ajenos.
- **Proposed instruction/description improvements:**  
  1. El starter llama `opener` sin try y siempre retorna ok (o crashea).  
  2. Envuelve en try/except BadZipFile y PermissionError.  
  3. Imprime `classify("in_use.xlsx", fake_open)`.  
  4. Success path retorna `"ok"`.
- **Proposed retrospective:**  
  Lock ≠ corrupt: políticas de reintento distintas. Luego (E3) agregar conteos con Counter para el manifest.
- **Code/output changes:** none

---

### S20-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Counter sobre values del mapa de estados; starter lista values crudos. Transfer al summary del factory. Hint casi da la solución exacta (spoiling leve aceptable en transfer corto).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Summary del batch con Counter
- **Proposed preamble:**  
  - **Contexto:** el manifest no quiere la lista cruda de estados; quiere conteos por categoría.  
  - **Meta:** construir `dict(Counter(files.values()))` del mapa dado.  
  - **Éxito:** `{'ok': 2, 'corrupt': 1, 'locked': 1}`.  
  - **Límites:** no cuentes keys de archivo; no omitas locked.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `list(files.values())`.  
  2. Usa `Counter` sobre esos values.  
  3. Convierte a `dict` e imprime.  
  4. Verifica ok=2, corrupt=1, locked=1.
- **Proposed retrospective:**  
  Counter del summary es lo que el revisor de CP-N2-B abre en 30 segundos. Puente a T4-B: backup, idempotencia y manifest con hash.
- **Code/output changes:** none

---

### S20-T4-B-DEMO (iDo)
- **Diagnosis:** Manifest JSON con sha1_8, idempotent, backup y tests estructurales. Why de una frase. Falta preamble de “sin manifest el incremento no cierra” y retrospective del misconception “re-ejecutar puede agregar filas si el hash cambió por orden”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El manifest es la evidencia de la corrida: hash de entrada, sheets, flag de idempotencia, backup y tests estructurales. Aquí dos corridas lógicas con filas en distinto orden producen el mismo payload canónico (`idempotent: true`). Observa el JSON. Sin este artefacto, el revisor de CP-N2-B no cierra el excel factory hacia S21.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: orden canónico de filas antes de hashear; backup path versionado; tests `has_header` / `n_data` sin abrir Excel GUI; el JSON es obligatorio en el checklist de entrega.
- **Proposed retrospective:**  
  Idempotencia + backup + tests + manifest cierran el factory. We Do: armar el dict mínimo, dig orden-invariante y `structural_ok` como superset.
- **Code/output changes:** none

---

### S20-T4-B-E1 (weDo, guided)
- **Diagnosis:** Manifest incompleto con `idempotent=False` y hash `00000000`. Instruction densa con salida exacta del dict — buena para guided; falta preamble de auditoría.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Manifest mínimo con input_sha1_8
- **Proposed preamble:**  
  - **Contexto:** sin `sheets`, `reconcile_ok`, `input_sha1_8` e `idempotent=True`, el auditor no cierra el incremento.  
  - **Meta:** completar el dict de manifest con hash real del payload sintético.  
  - **Éxito:** el dict canónico con `input_sha1_8` = `651f3b6b`.  
  - **Límites:** no hardcodees el hash si no lo calculas; no dejes `idempotent=False`; no metas paths con secretos.
- **Proposed instruction/description improvements:**  
  1. El starter tiene hash falso e idempotent False.  
  2. Añade sheets Entrada/Salida y reconcile_ok True.  
  3. Calcula `hashlib.sha1(payload).hexdigest()[:8]`.  
  4. Pon `idempotent=True` e imprime el dict.
- **Proposed retrospective:**  
  Hash truncado a 8 hex identifica la entrada sin volcar datos. Siguiente (E2): dig de filas orden-invariante para re-runs.
- **Code/output changes:** none
- **Validation notes:** Output del solution usa repr de dict Python (True/False), coherente con `print(manifest)`.

---

### S20-T4-B-E2 (weDo, independent)
- **Diagnosis:** `dig` sin `sorted` — re-run con filas reordenadas rompe idempotencia. Defect de producción real. Excelente independent.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Digest orden-invariante de filas
- **Proposed preamble:**  
  - **Contexto:** si el orden de filas en el sheet cambia, el hash no debe cambiar: es el mismo multiconjunto de negocio.  
  - **Meta:** ordenar filas antes de hashear en `dig(rows)`.  
  - **Éxito:** un booleano `True` comparando lista original vs. invertida.  
  - **Límites:** no uses el orden de entrada tal cual; no mutes la lista del caller de forma frágil (sorted en el join basta).
- **Proposed instruction/description improvements:**  
  1. El starter hashea sin `sorted` → comparación False.  
  2. Cambia a `for a, b in sorted(rows)`.  
  3. Imprime la igualdad de dig de ambas listas.  
  4. No hardcodees True.
- **Proposed retrospective:**  
  Orden canónico = idempotencia lógica. Sin él, re-ejecutar “cambia” el artefacto y el factory pierde confianza. Luego (E3) `structural_ok` con superset de sheets.
- **Code/output changes:** none

---

### S20-T4-B-E3 (weDo, transfer)
- **Diagnosis:** `structural_ok` con `==` falla si hay hoja extra `Log`. Transfer al contrato need ⊆ sheetnames. Feedback nombra el error clásico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** structural_ok: need es subconjunto
- **Proposed preamble:**  
  - **Contexto:** una hoja extra `Log` o `Catálogo` no invalida el contrato mínimo Entrada/Salida.  
  - **Meta:** devolver True si `sheetnames` es superset de `need`.  
  - **Éxito:** un booleano `True` con need Entrada/Salida y sheets que incluyen Log.  
  - **Límites:** no exijas igualdad exacta de conjuntos; no ignores mayúsculas en este ejercicio.
- **Proposed instruction/description improvements:**  
  1. El starter usa `==` y falla con Log extra.  
  2. Cambia a `set(sheetnames) >= set(need)`.  
  3. Imprime el resultado de la llamada dada.  
  4. No borres Log del fixture.
- **Proposed retrospective:**  
  Superset permitido = contrato mínimo, no camisa de fuerza. Pregunta de cierre: ¿qué debe pasar si falta `Salida`? En *Tú haces* unirás copy→materializar→reconcile→manifest con este mismo rigor.
- **Code/output changes:** none

---

### S20-youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context del VP en Lima, objectives alineados al factory, requirements (master intocable, manifest, sin PII, headers, es-PE), starter con tres huecos claros (`materialize_salida`, `reconcile`, escritura del JSON), rubric y portfolioNote con checklist de entrega. **Falta `retrospective`** de defensa post-build (spec You Do). Sin ella el learner no cierra metacognición antes de marcar listo hacia S21.
- **Checklist:** context pass · goal pass · success pass (checklist en requirements/portfolioNote) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (ya tiene `title`: “Excel factory CP-N2-B”)
- **Proposed preamble:** N/A (context actual cumple rol de escena; no reescribir salvo el Fixer quiera un `preamble` opcional — el schema You Do prioriza retrospective)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/starter. Opcional P2: en portfolioNote, añadir una línea explícita de “salida de consola esperada” (`master_intact True`, `reconcile_ok True`, `manifest_written True`) si el Fixer quiere éxito aún más observable.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿puedes demostrar con el manifest que el master no cambió de hash y que `reconcile_ok` es True? (2) ¿qué harías distinto con un xlsx real bloqueado por el contador o corrupto en la carpeta compartida? (3) Escribe en el README una frase de impacto medible (antes: plantilla editada a mano / después: results.xlsx + manifest re-ejecutable) que puedas defender en 30 segundos ante el revisor de CP-N2-B y el puente a S21.
- **Code/output changes:** none (starter y prints de verificación ya son el contrato de corrida exitosa)
- **Validation notes:** You Do ya es el ensamblaje natural de T2-A-E3 + T3-A + T4-B; no diluir con más huecos.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective en los 24)
1. **S20-T1-A-E1, E2, E3** — contrato de hojas y headers (base de todo el factory).  
2. **S20-T1-B-E1, E2, E3** — fórmulas vs. materialización (CI headless).  
3. **S20-T2-A-E1, E2, E3** — estilos y plantilla intocable (E3 es mini-You-Do).  
4. **S20-T2-B-E1, E2, E3** — fechas ISO y merges/ancla.  
5. **S20-T3-A-E1, E2, E3** — conciliación y pivots (gate de credibilidad).  
6. **S20-T3-B-E1, E2, E3** — headers y allowlist (fail-fast estructural).  
7. **S20-T4-A-E1, E2, E3** — batch ok/corrupt/locked y summary.  
8. **S20-T4-B-E1, E2, E3** — manifest, dig e structural_ok (cierre CP-N2-B).

### P1 (I Do preamble+retrospective × 8; You Do retrospective × 1)
9. **S20-T1-A-DEMO … S20-T4-B-DEMO** — añadir preamble y retrospective; ampliar `why` corto a 40–90 palabras donde aplique.  
10. **S20-youDo** — añadir `retrospective` de defensa (tres preguntas).

### P2 (polish)
11. Feedback We Do: una frase de *impacto al auditor/VP* donde hoy solo nombra el bug técnico (prioridad en T3-A, T3-B, T4-B).  
12. Hints E3 muy spoiling (p. ej. T4-A-E3, T2-A-E2): acortar a pista de concepto, no línea de código completa, si el Fixer toca hints.  
13. Nota opcional T2-B-E2: el output solo valida C1=`None` (no verifica escritura en ancla); endurecer solo si se acepta cambiar tests/output.  
14. You Do portfolioNote: línea de prints de éxito canónicos si se desea éxito aún más explícito.

---

## Residual risks

- **Nombre de archivo/id `rag`:** el id interno y el path `s20-rag.ts` no coinciden con el contenido (Excel factory). No es un fallo de pedagogy de ejercicios, pero confunde a revisores y a quien busque “RAG” en el repo; documentar en orchestrator, no “arreglar” id en este round de ejercicios salvo decisión de producto.  
- **Volumen 24 We Do:** el Fixer debe aplicar campos nuevos sin alterar `solutionCode.output` ni tests de igualdad de salida; cualquier reorden de prints rompe verificación.  
- **openpyxl no disponible en todos los sandboxes:** las unidades asumen `local-python` con openpyxl; el Fixer no debe reescribir a CSV “por si acaso” — rompería el hilo del factory.  
- **E2 T2-B (merge):** riesgo de false-pass si el learner no escribe en B1; impacto pedagógico bajo (el concepto de no-ancla sigue visible) pero tests frágiles si se endurece mal.  
- **You Do starter con JSON comentado:** el learner puede imprimir `manifest_written False` y creer que “casi listo”; la retrospective debe insistir en persistir el archivo.  
- **Sin bulk generation en el Fix:** cada preamble/retrospective de este report está hand-crafted; el Fixer debe copiar con criterio, no plantillar con placeholders `{subtopic}`.

---

## Counts summary for Fixer

| Tipo | Unidades | preamble missing | retrospective missing | title missing |
|------|----------|------------------|----------------------|---------------|
| iDo  | 8        | 8                | 8                    | N/A           |
| weDo | 24       | 24               | 24                   | 24            |
| youDo| 1        | N/A (context OK) | 1                    | N/A (has title)|
| **Total gaps P0/P1** | **33** | **32 campos preamble** | **33** | **24** |

Código/output: **sin cambios requeridos** para pedagogía (salvo notas P2 opcionales de endurecimiento de tests).

Section 20 exercise pedagogy review complete. Ready for the Fixer prompt.
