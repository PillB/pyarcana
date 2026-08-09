# S19 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Visualización y comunicación accesible
- **shortTitle:** Viz accesible
- **id:** `databases-orm` (archivo histórico `s19-databases-orm.ts`; contenido = charts honestos, Matplotlib, a11y y claims — no ORM/SQL)
- **index:** 19
- **source:** `src/lib/course/sections/s19-databases-orm.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S19-T1-A chart choice · T1-B ejes/encodings honestos · T2-A Matplotlib estático · T2-B composición/export · T3-A filtros/tooltips · T3-B estado/a11y/paridad · T4-A caption/unidad/fuente · T4-B color/alt/no sobreclaim
- **hilo de caso:** CASO-LIM-019 / dashboard ejecutivo **CP-N2-B** (medianas y n por Lima/Cusco/Arequipa, PEN, datos sintéticos web; puente desde EDA S18 y hacia Excel S20 / reportes S21)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s19-databases-orm.ts` (iDo ~358–588, weDo ~590–1439, youDo ~1441–1579).
- Contrastado con el hilo de la sección: pregunta→chart, baseline 0, contrato visual Matplotlib (Agg), export real, tooltip con n, paridad chart↔tabla, caption y claims acotados a la muestra; sin PII real.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S19 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y clara (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente; casi siempre **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — escenario + bug + éxito**”: meta y resultado mezclados con tarea; legible para quien ya diseña dashboards, **opaco** para newbie sin escena de CP-N2-B |
| We Do `feedback` | Una o dos frases; a menudo nombra el error de diseño (bien); poco *por qué el comité o el lector de pantalla se ven afectados* |
| Starter `# Bug a corregir` / CASO-LIM-019 | **Excelente** hábito; defectos de diseño/contrato bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable para guided); E3 a veces nombra el output esperado en la pista (spoiling leve en T1-B-E2, T4-B-E1) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con checklist **sólidos** y con contrato de 4 PNG + vista lógica + paridad |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y con el mini-contrato del dashboard; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código y contrato visual* (bug intencional de diseño, output canónico, fade real E1→E3, hatch/alt/caption como gates) es maduro y alineado al deliverable CP-N2-B. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en el dashboard ejecutivo, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: corregir tipo → brief dict → `elige_chart` reutilizable; T2-A: ylim booleano → ylabel+ylim → `meta_bar` con contrato; T4-B: claim suelto → alt+hatch → `classify_claim`). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S19-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de scoring de candidatos (`bar` gana, `pie_3d` score 0) para comparar ticket mediano entre regiones ante un VP. La `description` nombra la decisión; falta `preamble` que diga *qué observar antes del código* (pregunta → encoding, no estética) y `retrospective` del misconception “el gráfico más llamativo es el correcto”. El `why` es una sola frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de abrir Matplotlib, el analista del dashboard CP-N2-B debe *elegir* el chart por la pregunta, no por la librería de moda. En esta demo un VP de operaciones pide comparar ticket mediano entre pocas regiones (datos sintéticos CASO-LIM-019). Observa el dict de scores: `bar` suma 3, `pie_3d` suma 0. No escribas aún; predice qué tipo gana y por qué se imprime `rechaza_pie_3d True`. Si eliges el gráfico “bonito” sin anclar la pregunta, el comité malinterpreta magnitudes.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): la elección se documenta como decisión de diseño (`pregunta`, `audiencia`, `chart`); comparar magnitudes absolutas entre pocas categorías se lee en barras; pie 3D distorsiona áreas y no sirve para ranking regional; el score didáctico es un gate testeable, no un modelo ML; puente a We Do donde se corrige `line` por `bar` y se completa el brief.
- **Proposed retrospective:**  
  Si puedes explicar por qué “comparar ticket mediano entre regiones” no es un pie 3D sin mirar el código, ya tienes el hábito de chart choice. El error clásico es copiar un template de marketing. En We Do T1-A practicarás alinear tipo, brief y una función `elige_chart`.
- **Code/output changes:** none
- **Validation notes:** Output canónico alineado a theory T1-A.

---

### S19-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: starter pone `chart = "line"` para una pregunta de comparación. Instruction telegráfica con bug y éxito; sin title, preamble ni retrospective. Feedback nombra línea/pie pero no ancla al comité de CP-N2-B.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Barras para comparar regiones
- **Proposed preamble:**  
  - **Contexto:** el comité de operaciones quiere **comparar** ticket mediano entre pocas regiones (magnitudes absolutas), no una serie temporal.  
  - **Meta:** corregir la elección de chart cuando el starter elige un tipo inadecuado.  
  - **Éxito:** imprimes una sola línea con el texto `bar`.  
  - **Límites:** no uses pie 3D ni line para esta pregunta; no imprimas frases extra; solo el tipo de chart.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `chart = "line"` es el bug (serie temporal para comparación).  
  2. Cambia el tipo a barras (`"bar"`).  
  3. Imprime solo la variable `chart`.  
  4. Verifica mentalmente: pocas categorías + magnitud absoluta → barras.
- **Proposed feedback improvement:**  
  Si imprimiste `line` o un pie, confundes tendencia con comparación. Barras con baseline 0 comunican magnitudes entre regiones; la línea es para series temporales. El brief del dashboard se rompe si el encoding no responde a la pregunta.
- **Proposed retrospective:**  
  Pregunta de comparación → barras; pregunta de tendencia → línea. El error clásico es “siempre uso el chart del último tutorial”. Siguiente (E2): el brief debe viajar con la figura (`pregunta`, `audiencia`, `chart`).
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `bar` correctos.

---

### S19-T1-A-E2 (weDo, independent)
- **Diagnosis:** Foco independiente correcto (dict de brief incompleto). Instruction densa; no explica *por qué* S21 necesita audiencia y chart en el metadata. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Brief de diseño con tres claves
- **Proposed preamble:**  
  - **Contexto:** la figura del portfolio no viaja sola: el informe (S21) necesita saber *por qué* ese encoding.  
  - **Meta:** completar un brief con `pregunta`, `audiencia` y `chart` para totales por región ante un ejecutivo.  
  - **Éxito:** un dict impreso con las tres claves y valores alineados (ejecutivo + bar).  
  - **Límites:** no inventes claves extra; no uses audiencia “técnica” para este brief de comité.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: solo imprime `pregunta` (bug: omitió audiencia y chart).  
  2. Completa el dict para totales por región, audiencia ejecutivo, chart bar.  
  3. Imprime el dict completo en una sola línea.  
  4. No hardcodees otro chart “más moderno”.
- **Proposed feedback improvement:**  
  Sin audiencia y chart en el brief, el DOCX de S21 no puede defender la decisión de diseño. Un dict con solo la pregunta es un hallazgo huérfano, no un contrato de visualización.
- **Proposed retrospective:**  
  Tres claves mínimas: qué se pregunta, a quién se habla, cómo se encode. Luego (E3) automatizarás la elección con una regla legible sobre el texto de la pregunta.
- **Code/output changes:** none
- **Validation notes:** Output canónico del brief alineado al I Do y a theory.

---

### S19-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a función reutilizable `elige_chart` con keyword “tendencia”. Starter siempre devuelve bar — excelente. Instruction ya nombra la regla; falta anclar *por qué* debe ser testeable y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Función elige_chart por keyword
- **Proposed preamble:**  
  - **Contexto:** en el lab, la elección de chart no es un modelo opaco: es una regla legible que puedes testear en CI.  
  - **Meta:** implementar `elige_chart(pregunta)` que devuelve `line` si aparece “tendencia” (ignorando mayúsculas) y `bar` en caso contrario.  
  - **Éxito:** dos líneas de salida — `line` y luego `bar` — para “tendencia mensual” y “comparar regiones”.  
  - **Límites:** no uses ML ni librerías extra; no hardcodees solo un return fijo.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: la función siempre devuelve `"bar"`.  
  2. Normaliza la pregunta con `.lower()` y busca la subcadena `"tendencia"`.  
  3. Devuelve `"line"` o `"bar"` según la regla.  
  4. Deja los dos `print` de prueba en el orden dado.
- **Proposed retrospective:**  
  Una regla explícita se audita; un “modelo de chart” sin tests no. Pregunta de cierre: ¿qué devolverías si la pregunta dice “TENDENCIA” en mayúsculas? Puente a T1-B: aunque elijas bar, un eje recortado puede mentir igual.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; edge case de mayúsculas ya en hints.

---

### S19-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro del factor de inflación (diff 8, fracción honesta 0.08 vs truco 0.8 → factor 10). Description nombra distorsión; falta preamble de “predice el factor antes de mirar” y retrospective del misconception “si la diferencia absoluta es la misma, el gráfico es honesto”. `why` de una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un eje Y que empieza cerca del mínimo infla la brecha percibida entre barras de PEN absolutas. En esta demo comparas 100 vs 92: la diferencia absoluta es 8 en ambos casos, pero con baseline 90 la “altura relativa” del truco es diez veces la del baseline 0. No escribas aún; predice `factor_inflacion` y decide si ese chart pasaría el gate de integridad de CP-N2-B. Mentir en el origen es mentir en la longitud percibida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el baseline es un encoding; el factor de inflación educa al comité antes de exportar; en barras de magnitudes absolutas el default ético es ylim bottom=0 o justificación escrita; puente a We Do donde se corrige el denominador honesto y se implementa `gate_baseline`.
- **Proposed retrospective:**  
  Misma diferencia absoluta, distinta historia visual: el truco multiplica la percepción. Si puedes explicar el factor 10 sin el código, ya desconfías del eje recortado. We Do: calcular factor, gate de baseline y rechazo de dual-axis.
- **Code/output changes:** none

---

### S19-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter pone denominador honesto como `(50-45)/(50-45)=1` — defect guiado perfecto. Instruction da la fórmula en el texto (casi spoiling, aceptable en E1). Sin title/preamble/retrospective; feedback nombra factor >1 pero no ancla al gate del dashboard.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Factor de inflación del eje recortado
- **Proposed preamble:**  
  - **Contexto:** valores 50 y 45 con baseline truco 40 vs baseline honesto 0: el comité ve “brechas” distintas.  
  - **Meta:** calcular el factor de inflación visual (altura relativa truco ÷ altura relativa honesta).  
  - **Éxito:** una línea `factor 5.0` (redondeado a 2 decimales).  
  - **Límites:** no uses el span entre barras como denominador honesto; no imprimas solo el truco.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `hon` divide por `(50-45)` (bug: denominador 1).  
  2. Corrige la altura honesta a `(50-45)/50` (span desde 0).  
  3. Mantén truco como `(50-45)/(50-40)`.  
  4. Imprime `factor` con `round(truco/hon, 2)`.
- **Proposed feedback improvement:**  
  Si el factor es 1.0 o absurdo, el denominador honesto sigue mal. Con baseline 0 el span es el máximo (50), no la diferencia entre barras. Un factor >1 es señal de que el eje recortado no pasa el gate sin justificación escrita.
- **Proposed retrospective:**  
  Altura percibida = diff / span del eje. Recortar el span multiplica la historia. Siguiente (E2): automatizar el veredicto con `gate_baseline` según encoding y `ylim_bottom`.
- **Code/output changes:** none
- **Validation notes:** Output `factor 5.0` coherente con theory T1-B.

---

### S19-T1-B-E2 (weDo, independent)
- **Diagnosis:** Gate de honestidad por encoding — buen E2. Instruction ya describe la lógica completa (casi un pseudo-código en la consigna); hint revela el resultado `revisar`. Sin escena de “default ético en PEN absolutas”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate de baseline en barras absolutas
- **Proposed preamble:**  
  - **Contexto:** no todo encoding exige y=0 (una línea de índice puede partir de otro valor si se documenta); las barras de PEN absolutas sí.  
  - **Meta:** implementar `gate_baseline(ylim_bottom, encoding)` con tres salidas: `honesto`, `revisar`, `ok_con_nota`.  
  - **Éxito:** con `(40, "bar_absolute")` imprime exactamente `revisar`.  
  - **Límites:** no devuelvas siempre `ok_con_nota`; no trates `line_index` como `bar_absolute`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: la función ignora argumentos y devuelve `ok_con_nota` (bug).  
  2. Si encoding es `bar_absolute` y bottom es 0 → `honesto`; si bottom ≠ 0 → `revisar`.  
  3. Otros encodings → `ok_con_nota`.  
  4. Deja el print de prueba con bottom 40 y bar_absolute.
- **Proposed feedback improvement:**  
  ylim_bottom=0 es el default ético en barras de montos PEN. Truncar sin nota es defecto de integridad; una línea de índice puede no partir de 0 **si** lo documentas en el caption.
- **Proposed retrospective:**  
  El gate mira primero el tipo de encoding, luego el número. Pregunta de cierre: ¿qué devuelve `gate_baseline(0, "bar_absolute")`? Luego (E3) el riesgo de dual-axis, otro encoding engañoso.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1 en el starter; la instruction actual se puede acortar al pasar meta/éxito al preamble.

---

### S19-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia simple pero conceptualmente fuerte: dual_axis → riesgo_alto. Starter invierte la lógica — excelente. Instruction corta; sin anclar *por qué* el comité se confunde con dos escalas Y. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Marcar dual-axis como riesgo alto
- **Proposed preamble:**  
  - **Contexto:** dos escalas Y en un solo panel mezclan unidades y engañan al ejecutivo que “ve correlación” donde solo hay superposición visual.  
  - **Meta:** clasificar el encoding `dual_axis` como `riesgo_alto` (no “ok”).  
  - **Éxito:** imprime una línea con `riesgo_alto`.  
  - **Límites:** no apruebes dual_axis por defecto; prefiere paneles separados en el diseño real del dashboard.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: el ternario imprime `ok` cuando encoding es dual_axis.  
  2. Invierte la lógica: dual_axis → `riesgo_alto`; otro → `ok`.  
  3. Imprime solo el string del veredicto.  
  4. No cambies el valor de `encoding` en este lab.
- **Proposed retrospective:**  
  Dual-axis no es “más datos en menos espacio”: es dos historias con reglas distintas. Preferir 1×2 subplots (T2-B) es el antídoto. Puente a T2-A: construir barras con ylim desde 0 en código real.
- **Code/output changes:** none

---

### S19-T2-A-DEMO (iDo)
- **Diagnosis:** Demo rica: bar con hatch, ylabel PEN, ylim 0, bar_label, close. Description cubre baseline, unidad y canal no-color. Falta preamble de “contrato verificable en CI” y retrospective del misconception “si se ve bien en mi monitor, el test pasa”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El contrato visual del portfolio no es “se ve bonito en mi laptop”: es `ylim0==0`, ylabel con unidad y un canal no-color (hatch) para categorías. En esta demo Matplotlib (backend Agg) dibuja Lima/Arequipa/Cusco con patrones `//`, `\\`, `..`. Observa los tres prints booleanos/listas antes de copiar código: si el color fuera el único canal, un lector daltónico pierde el ranking. Cierra siempre con `plt.close(fig)` en scripts y CI.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: Agg evita display interactivo en servidor; hatch complementa color (WCAG 1.4.1); bar_label no sustituye la tabla de paridad; get_ylim/get_ylabel son lo que el grader puede assertar; puente a We Do de ylim, ylabel y `meta_bar`.
- **Proposed retrospective:**  
  Figura mínima viable = baseline 0 + unidad + segundo canal. Si puedes listar los tres checks sin mirar la salida, ya piensas en contrato, no en screenshot. We Do: forzar ylim, armar dict de meta y castear float nativo.
- **Code/output changes:** none

---

### S19-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter con `set_ylim(1, 3)` — defect guiado perfecto y medible. Instruction clara; sin escena de “gate de honestidad en barras absolutas”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Forzar ylim desde cero
- **Proposed preamble:**  
  - **Contexto:** en barras de magnitud absoluta el bottom del eje Y debe ser 0; el starter lo deja en 1 y “recorta aire”.  
  - **Meta:** construir un bar chart Agg de dos barras y verificar `get_ylim()[0] == 0`.  
  - **Éxito:** imprime el booleano `True`.  
  - **Límites:** backend Agg antes de pyplot; cierra la figura; no imprimas el tuple completo del ylim.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `set_ylim(1, 3)` es el bug.  
  2. Cambia a `set_ylim(0, …)` (p. ej. 0, 3).  
  3. Imprime `ax.get_ylim()[0] == 0`.  
  4. Mantén `plt.close(fig)`.
- **Proposed feedback improvement:**  
  Si imprime `False`, el bottom aún no es 0. Barras de magnitud absoluta no deben “empezar cerca del mínimo” para dramatizar la brecha: el gate del dashboard lo rechaza.
- **Proposed retrospective:**  
  Un booleano de ylim0 es el test más barato de honestidad visual. Siguiente (E2): el contrato también exige ylabel con unidad PEN, no solo el baseline.
- **Code/output changes:** none

---

### S19-T2-A-E2 (weDo, independent)
- **Diagnosis:** Contrato ylabel + ylim0 en dict — buen E2 independiente. Starter omite set_ylabel y set_ylim. Instruction larga (mezcla meta y pasos). Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ylabel con PEN y baseline 0
- **Proposed preamble:**  
  - **Contexto:** “28” sin unidad es un defecto de reporte; el comité no puede escalar ni comparar.  
  - **Meta:** dibujar Lima=28 y Cusco=22.5 con ylabel `Ticket mediano (PEN)`, ylim desde 0, e imprimir el dict de contrato.  
  - **Éxito:** `{'ylabel': 'Ticket mediano (PEN)', 'ylim0': 0.0}`.  
  - **Límites:** convierte ylim0 a `float` nativo; cierra la figura; no dejes ylabel vacío.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime ylabel vacío y ylim por defecto (bug).  
  2. Llama `set_ylabel("Ticket mediano (PEN)")` y `set_ylim(0, 35)`.  
  3. Arma el dict con `get_ylabel()` y `float(get_ylim()[0])`.  
  4. Imprime el dict y cierra la figura.
- **Proposed feedback improvement:**  
  Un ylabel con PEN y baseline 0 hacen honesto el encoding de longitud del ticket mediano. Sin unidad, el número de la barra es ilegible fuera del contexto del notebook.
- **Proposed retrospective:**  
  Unidad en el eje, no solo en el título de la diapositiva. Luego (E3) empaquetarás n_bars + ylim0 en una función `meta_bar` reutilizable del portfolio.
- **Code/output changes:** none

---

### S19-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a API de función con contrato del portfolio (`n_bars`, `ylim0` float). Starter no fuerza ylim ni caste a float — excelente. Instruction densa; sin anclar por qué numpy float rompe igualdad de strings en graders. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** meta_bar con n_bars y ylim0
- **Proposed preamble:**  
  - **Contexto:** el portfolio reusa builders; el test no mira el PNG píxel a píxel, mira un dict estable.  
  - **Meta:** implementar `meta_bar(labels, values)` que dibuja barras, fija ylim 0…max*1.2 y devuelve `n_bars` y `ylim0` como float de Python.  
  - **Éxito:** para Lima/Cusco y 28/22.5 imprime `{'n_bars': 2, 'ylim0': 0.0}`.  
  - **Límites:** no devuelvas tipos numpy en ylim0; cierra la figura dentro de la función.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: no hay `set_ylim` y ylim0 no se caste a float.  
  2. Dentro de `meta_bar`, dibuja, fuerza ylim y arma el dict.  
  3. Usa `float(ax.get_ylim()[0])` y `len(values)`.  
  4. Deja el print de prueba con las dos regiones.
- **Proposed retrospective:**  
  Contrato estable = tipos nativos + conteos + baseline. Pregunta de cierre: ¿qué pasa si `values` está vacío? Puente a T2-B: export real y metadata de paneles.
- **Code/output changes:** none

---

### S19-T2-B-DEMO (iDo)
- **Diagnosis:** Demo fuerte: 1×2, savefig a BytesIO, dpi 120, bytes > 1000. Description nombra PNG real y metadata. Falta preamble de “dict inventado ≠ export” y retrospective del misconception “el metadata basta sin archivo”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El dashboard CP-N2-B no se entrega con un dict de intenciones: se entrega un PNG real (o buffer) versionado. En esta demo ves un 1×2 (n por región + mediana horizontal), `savefig` a `BytesIO` a 120 dpi y un check `png_bytes_ok`. Observa que `panels` y `dpi` salen de la figura real, no de un hardcode. Predice si `bytes > 1000` será True antes de mirar la salida. Sin binario, S20/S21 no pueden re-renderizar ni archivar.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: savefig real habilita re-render; nombre versionado evita sobrescribir histórico; seed_data documenta reproducibilidad; close libera memoria en CI; puente a We Do de export, filename y títulos de panel.
- **Proposed retrospective:**  
  Metadata miente si no hay bytes. Si puedes decir por qué un dict con `panels: 2` sin savefig no es entrega, ya pasaste el gate de export. We Do: corregir panels inventados, versionar el nombre y titular cada panel.
- **Code/output changes:** none

---

### S19-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter declara `panels: 1` y `png_ok: False` sin savefig — defect excelente. Instruction larga pero completa. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Export PNG real y meta de paneles
- **Proposed preamble:**  
  - **Contexto:** un dict de export inventado no viaja a la factoría Excel ni a los reportes: hace falta `savefig` y paneles contados de la figura.  
  - **Meta:** subplots 1×2, PNG a BytesIO dpi=120, dict con `fmt`, `dpi`, `panels`, `png_ok`.  
  - **Éxito:** `{'fmt': 'png', 'dpi': 120, 'panels': 2, 'png_ok': True}`.  
  - **Límites:** no hardcodees `panels=1`; buffer > 500 bytes; cierra la figura.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: no hay savefig y panels=1 (bugs).  
  2. Crea `io.BytesIO()`, llama `fig.savefig(..., format="png", dpi=120)`.  
  3. Cuenta paneles con `len(axes)` y `png_ok` con `len(buf.getvalue()) > 500`.  
  4. Imprime el dict y cierra la figura.
- **Proposed feedback improvement:**  
  El metadata debe reflejar la figura real. Un dict bonito sin bytes no es entregable: S20/S21 necesitan el PNG (o un buffer no vacío) y el conteo honesto de paneles.
- **Proposed retrospective:**  
  savefig primero, metadata después. Siguiente (E2): el nombre de archivo versionado es parte del mismo contrato de re-render.
- **Code/output changes:** none

---

### S19-T2-B-E2 (weDo, independent)
- **Diagnosis:** Filename versionado — E2 simple y correcto. Instruction corta; starter imprime nombre sin `_v{version}`. Sin anclar riesgo de sobrescritura del histórico del portfolio. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Nombre versionado del PNG
- **Proposed preamble:**  
  - **Contexto:** si todas las figuras se llaman `fig_cpn2b.png`, el re-render borra el histórico del portfolio.  
  - **Meta:** generar `fig_cpn2b_v{version}.png` con `version = 3`.  
  - **Éxito:** imprime exactamente `fig_cpn2b_v3.png`.  
  - **Límites:** usa f-string; no omitas el prefijo acordado `fig_cpn2b`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `fig_cpn2b.png` sin versión (bug).  
  2. Usa `f"fig_cpn2b_v{version}.png"` con version=3.  
  3. Imprime solo ese string.  
  4. No insertes espacios ni mayúsculas distintas.
- **Proposed feedback improvement:**  
  Sin versión en el filename, la factoría no distingue re-renders. Un solo nombre sobrescribe el histórico y rompe la trazabilidad hacia S21.
- **Proposed retrospective:**  
  Versionar el binario es tan importante como versionar el código. Luego (E3) cada panel necesita título propio para que el comité lea Vol vs Med.
- **Code/output changes:** none

---

### S19-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer: títulos de panel vs solo suptitle. Starter deja `get_title()` vacío — excelente. Instruction clara; sin anclar por qué el grader no hereda suptitle. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Títulos de panel Vol y Med
- **Proposed preamble:**  
  - **Contexto:** un `suptitle` “Dashboard” no dice qué lee cada panel; el comité necesita “Vol” vs “Med” sin ambigüedad.  
  - **Meta:** subplots 1×2 con `set_title` en cada axes e imprimir la lista de títulos.  
  - **Éxito:** `['Vol', 'Med']`.  
  - **Límites:** no confíes solo en `fig.suptitle`; cierra la figura.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: solo hay suptitle; `get_title()` de cada ax queda vacío.  
  2. Asigna `axes[0].set_title("Vol")` y `axes[1].set_title("Med")`.  
  3. Imprime la lista por comprehension sobre axes.  
  4. Mantén el close.
- **Proposed retrospective:**  
  suptitle es opcional; el título del axes es el contrato del grader y del lector. Puente a T3-A: la vista interactiva también debe recalcular el valor al filtrar región.
- **Code/output changes:** none

---

### S19-T3-A-DEMO (iDo)
- **Diagnosis:** Demo limpia de `view(region)` con tooltip unidad+n. Description nombra filtro y tooltip honesto. Falta preamble de “spec antes de Plotly” y retrospective del misconception “el tooltip solo es cosmético”. `why` de una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Antes de instalar Plotly o Streamlit, modelamos la vista interactiva como datos: filtro activo, plantilla de tooltip, unidad y n. En esta demo `view("Lima")` y `view("Cusco")` devuelven tooltips distintos con PEN y tamaño muestral. Observa que al cambiar el filtro **cambia** el texto: no se reutiliza el párrafo global de “Lima lidera”. Predice el string de Cusco antes de mirar la salida. Un tooltip sin n invita a leer el KPI como censo.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: unidad y n son contrato a11y del viewport; el lookup O(n) basta para el lab; la spec es migrable a librería interactiva; puente a We Do de lookup, formato y función `tooltip`.
- **Proposed retrospective:**  
  Filtro sin recálculo es defecto de producto. Si puedes escribir de memoria el patrón `región: valor PEN (n=…)`, ya tienes la plantilla del portfolio. We Do: corregir lookup, incluir n y generalizar la función.
- **Code/output changes:** none

---

### S19-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter filtra Cusco en vez de Lima — defect guiado perfecto y análogo a “viewport desincronizado”. Instruction corta; sin escena de paridad filtro↔valor. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Lookup de mediana filtrada a Lima
- **Proposed preamble:**  
  - **Contexto:** si el filtro del dashboard es Lima, el valor mostrado no puede ser el de Cusco: rompe la paridad con el tooltip y la tabla.  
  - **Meta:** recuperar la mediana de la fila cuya región es Lima.  
  - **Éxito:** imprime el entero `28`.  
  - **Límites:** no hardcodees 28 sin filtrar; no imprimas el dict completo.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el `next(...)` filtra `"Cusco"` (bug).  
  2. Cambia la comparación a `"Lima"`.  
  3. Imprime solo el campo `median` de la fila.  
  4. Verifica mentalmente: 28, no 22.
- **Proposed feedback improvement:**  
  Mostrar Cusco cuando el filtro es Lima es un bug de viewport, no un detalle cosmético. El valor filtrado debe recalcularse; si no, el comité decide con el KPI equivocado.
- **Proposed retrospective:**  
  Lookup correcto = filtro honesto. Siguiente (E2): el tooltip de esa celda debe llevar unidad y n, no solo el número.
- **Code/output changes:** none

---

### S19-T3-A-E2 (weDo, independent)
- **Diagnosis:** Formato de tooltip con n — E2 claro. Starter omite `(n=40)`. Instruction ya da el string exacto (aceptable en independent si el foco es el contrato). Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Tooltip con unidad y n
- **Proposed preamble:**  
  - **Contexto:** un tooltip que dice solo “Lima: 28 PEN” invita a leer 28 como población completa.  
  - **Meta:** formatear el tooltip de Lima con valor, unidad PEN y n=40.  
  - **Éxito:** imprime exactamente `Lima: 28 PEN (n=40)`.  
  - **Límites:** no omitas la unidad ni el n; no uses otro orden de tokens.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: falta `(n=…)` en el f-string (bug).  
  2. Completa a `Lima: {28} PEN (n={40})`.  
  3. Imprime una sola línea.  
  4. No redondees ni cambies espacios.
- **Proposed feedback improvement:**  
  Unidad + n son parte del contrato a11y del viewport. Sin n, el KPI se vende como censo; sin unidad, el número es ambiguo en un comité multi-métrica.
- **Proposed retrospective:**  
  El hover es un canal de honestidad, no solo de “detalle”. Luego (E3) generalizas la plantilla a cualquier fila con una función pura.
- **Code/output changes:** none

---

### S19-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `tooltip(row)` reutilizable. Starter omite n en la plantilla. Instruction nombra el formato; falta anclar reutilización multi-región. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Función tooltip reutilizable
- **Proposed preamble:**  
  - **Contexto:** tooltips distintos “a mano” por región divergen y fallan el gate de a11y.  
  - **Meta:** escribir `tooltip(row)` que devuelva `"{region}: {median} PEN (n={n})"`.  
  - **Éxito:** para Cusco 22.5 n=32 imprime `Cusco: 22.5 PEN (n=32)`.  
  - **Límites:** función pura solo con claves del dict; no hardcodees solo Lima.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: la plantilla omite n.  
  2. Incluye `(n={row['n']})` en el f-string.  
  3. Deja el print de prueba con Cusco.  
  4. No capturas KeyError en este lab (keys completas).
- **Proposed retrospective:**  
  Una plantilla = un contrato. Pregunta de cierre: ¿qué falla si falta la clave `n` en el row? Puente a T3-B: paridad chart↔tabla y sampling honesto del estado.
- **Code/output changes:** none

---

### S19-T3-B-DEMO (iDo)
- **Diagnosis:** Demo de paridad chart dict ↔ tabla y texto unido con `;`. Description nombra alternativa tabular. Falta preamble de “sin tabla hermana no entra al portfolio” y retrospective del misconception “agrandar la imagen basta”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El gate de accesibilidad de CP-N2-B exige alternativa no visual con **los mismos números** que el chart. En esta demo el dict de medianas se convierte en tabla y en un texto `Lima=28.0 PEN; Cusco=22.5 PEN`, y `parity` es True. Observa que no se “redondea bonito” en la tabla a 27.5. Predice el booleano de paridad. Sin tabla hermana, un lector de pantalla (o un auditor) no puede reconstruir el hallazgo.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: paridad a la precisión publicada; alt/texto no es “imagen más grande”; el join de filas con unidad es el patrón del alt del portfolio; puente a We Do de igualdad, JSON de sampling y alt desde tabla.
- **Proposed retrospective:**  
  Misma precisión, mismos valores, dos canales (visual y no visual). Si puedes explicar por qué 27.5 en tabla y 28.0 en chart es un fail, ya piensas en integridad. We Do: alinear números, serializar estado con universe_n y generar alt con PEN.
- **Code/output changes:** none

---

### S19-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter con tabla 27.5 vs chart 28.0 — defect de “redondeo de diapositiva” excelente y realista. Instruction clara. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Paridad chart y tabla a 28.0
- **Proposed preamble:**  
  - **Contexto:** la alternativa accesible miente si la tabla muestra 27.5 y la barra 28.0 “porque se veía mejor en la slide”.  
  - **Meta:** alinear el ticket mediano de Lima a la precisión publicada e imprimir el booleano de igualdad.  
  - **Éxito:** imprime `True`.  
  - **Límites:** misma precisión (un decimal); no uses redondeos distintos entre canales.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: tabla en 27.5 vs chart 28.0 (bug).  
  2. Corrige la tabla a `28.0` (o alinea ambos a la precisión publicada).  
  3. Imprime `chart["Lima"] == table[0]["ticket_mediano_pen"]`.  
  4. No imprimas texto extra.
- **Proposed feedback improvement:**  
  Sin paridad numérica, la alternativa accesible miente. El gate del portfolio exige los mismos números a la precisión publicada, no un “casi igual” de diseño de diapositiva.
- **Proposed retrospective:**  
  Chart y tabla son dos vistas del mismo contrato. Siguiente (E2): el estado del viewport también debe ser honesto sobre sampling (`sample_n` y `universe_n`).
- **Code/output changes:** none

---

### S19-T3-B-E2 (weDo, independent)
- **Diagnosis:** JSON de estado + sampling — E2 fuerte. Starter omite `universe_n` y usa `ensure_ascii=True`. Instruction completa; sin anclar el riesgo “5000 se lee como censo”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Estado JSON con sample y universo
- **Proposed preamble:**  
  - **Contexto:** si el viewport muestra 5 000 filas de un universo de 50 000, ocultar el universo vende un sample como censo.  
  - **Meta:** serializar estado con filtro Lima, `sample_n=5000`, `universe_n=50000` y `ensure_ascii=False`.  
  - **Éxito:** el JSON impreso incluye las tres claves de negocio con esos valores.  
  - **Límites:** no dejes el estado solo con sample_n; no uses objetos no serializables.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: falta `universe_n` y ensure_ascii=True (bugs).  
  2. Completa el dict de state.  
  3. Serializa con `json.dumps(state, ensure_ascii=False)`.  
  4. Imprime el string JSON resultante.
- **Proposed feedback improvement:**  
  Estado no serializable no se audita. `sample_n` sin `universe_n` oculta el sesgo del viewport: documenta ambos para no vender un sample como censo ante el comité.
- **Proposed retrospective:**  
  Transparencia de sampling es integridad, no un “extra técnico”. Luego (E3) el alt text desde tabla debe llevar unidad PEN en cada par región=valor.
- **Code/output changes:** none

---

### S19-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer: join de alt desde tabla con unidad. Starter omite PEN. Instruction clara. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Alt text con unidad desde tabla
- **Proposed preamble:**  
  - **Contexto:** el alt text es la versión no visual del chart; sin unidad el lector de pantalla recibe números ambiguos.  
  - **Meta:** unir cada fila como `region=v PEN` con separador `"; "`.  
  - **Éxito:** `Lima=28 PEN; Cusco=22 PEN`.  
  - **Límites:** no omitas PEN; mantén el orden de la tabla.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: el f-string une región=valor sin unidad.  
  2. Añade ` PEN` dentro del f-string.  
  3. Deja el `"; ".join(...)`.  
  4. Imprime el string completo.
- **Proposed retrospective:**  
  Alt sin unidad es incompleto; alt sin n (T4-B) también. Puente a T4-A: el pie de figura (caption) aporta fuente y limitación que el alt no siempre detalla.
- **Code/output changes:** none

---

### S19-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de pie de figura con unidad, fuente, corte y limitación. Description nombra caption estructurado. Falta preamble de “número huérfano no se audita” y retrospective del misconception “el título de la figura basta”. `why` de una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Sin fuente y limitación, el gráfico no entra al portfolio CP-N2-B: un “28” huérfano no se puede auditar ni re-renderizar con confianza. En esta demo el caption se empaqueta en un pie estable `Unidad | Fuente | Corte | Límite` con datos sintéticos y canal web. Observa el orden y el contenido de `limitacion` (“n bajo en Cusco”). Predice el string del pie antes de mirar la salida. El mismo pie viaja a S21 para que el DOCX no invente otra fuente.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: caption es entregable, no extra; unidad omitida es defecto de reporte; limitación acota el claim del título; puente a We Do de string mínimo, claves obligatorias y formatter `pie(cap)`.
- **Proposed retrospective:**  
  Trazabilidad = unidad + fuente + marco. Si puedes redactar un pie de cuatro piezas sin copiar, ya cierras el loop ético antes de S20/S21. We Do: completar fuente, validar claves e implementar el join `k: v`.
- **Code/output changes:** none

---

### S19-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter imprime solo `unidad=PEN` — defect guiado mínimo y claro. Instruction da el formato exacto. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Pie mínimo con unidad y fuente
- **Proposed preamble:**  
  - **Contexto:** unidad sola no basta para trazabilidad; el portfolio exige al menos unidad y fuente en el pie.  
  - **Meta:** completar el string al formato `unidad=PEN | fuente=sintetico`.  
  - **Éxito:** esa línea exacta.  
  - **Límites:** orden unidad luego fuente; no inventes un pie distinto por diapositiva.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: solo imprime unidad (bug).  
  2. Completa con ` | fuente=sintetico`.  
  3. Imprime una sola línea.  
  4. No cambies el token `sintetico` en este lab.
- **Proposed feedback improvement:**  
  Sin fuente, el gráfico no entra al portfolio CP-N2-B. Unidad sola no permite auditar ni re-renderizar con el mismo marco de datos.
- **Proposed retrospective:**  
  Pie mínimo = qué mide + de dónde sale. Siguiente (E2): el dict de caption también exige la clave `limitacion` como tercer pilar.
- **Code/output changes:** none

---

### S19-T4-A-E2 (weDo, independent)
- **Diagnosis:** Validación de claves del caption con set superset — buen E2. Starter omite `limitacion`. Instruction usa la expresión de éxito en la consigna. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Caption con unidad, fuente y limitación
- **Proposed preamble:**  
  - **Contexto:** sin `limitacion`, el título del chart puede sobre-extenderse (“todo el canal”, “todo el Perú”) sin marco.  
  - **Meta:** completar el dict de caption y validar que incluye `unidad`, `fuente` y `limitacion`.  
  - **Éxito:** imprime `True`.  
  - **Límites:** valor de limitacion no vacío (p. ej. `web`); no typos en el nombre de la clave.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: faltan la clave y el valor de `limitacion` (bug).  
  2. Añade `limitacion` al dict.  
  3. Deja el print del superset de claves.  
  4. No borres unidad ni fuente.
- **Proposed feedback improvement:**  
  `limitacion` documenta el marco (solo canal web, n bajo, etc.). Sin ella el claim del título puede vender generalizaciones que el EDA de S18 no soporta.
- **Proposed retrospective:**  
  Tres claves mínimas del pie estructurado. Luego (E3) un formatter reutilizable une `k: v` para S21 sin reinventar el string por figura.
- **Code/output changes:** none

---

### S19-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer: `pie(cap)` que une items, no solo keys. Starter solo keys — excelente. Instruction clara. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Formatter pie k: v
- **Proposed preamble:**  
  - **Contexto:** un pie que solo lista nombres de clave (“unidad | n”) no comunica nada al lector del informe.  
  - **Meta:** implementar `pie(cap)` que une `k: v` con `" | "`.  
  - **Éxito:** `unidad: PEN | n: 10` para el dict de prueba.  
  - **Límites:** usa `.items()`; respeta el orden de inserción del dict.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: join solo sobre keys.  
  2. Cambia a `f"{k}: {v}"` sobre `cap.items()`.  
  3. Deja el print de prueba.  
  4. No hardcodees el string de salida.
- **Proposed retrospective:**  
  `k: v` es el contrato estable hacia S21. Pregunta de cierre: ¿qué imprime si añades `fuente` al dict? Puente a T4-B: el lenguaje del claim y el alt con n cierran la integridad ética.
- **Code/output changes:** none

---

### S19-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de contraste PERMITIDO vs RECHAZADO y conteo de palabras del alt. Description nombra alt y sobreclaim. Falta preamble de “muestra ≠ población” y retrospective del misconception “un título impactante es bueno para el comité”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El color y el contraste no redimen un sobreclaim en el título. En esta demo un claim acotado a la muestra web es PERMITIDO y “Lima es la mejor región del Perú” es RECHAZADO. El alt describe hallazgo + marco sintético, no “imagen de barras”. Observa las dos clasificaciones y el conteo de palabras del alt. Predice cuál claim falla y por qué. El lenguaje del dashboard no puede exceder la evidencia del EDA de S18.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: marco muestral en el claim; alt con n y hallazgo; contraste de claims entrena el hábito antes del export; puente a We Do de regla “del Perú” sin “muestra”, alt+hatch y `classify_claim`.
- **Proposed retrospective:**  
  Muestra ≠ población. Si puedes reescribir el claim rechazado en una frase permitida sin mirar el código, ya cierras el loop ético. We Do: implementar la regla, completar alt/hatch y generalizar el clasificador.
- **Code/output changes:** none

---

### S19-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba todo con `print("OK")` — defect guiado perfecto. Instruction da la regla casi completa (aceptable en E1). Hint revela RECHAZADO. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Rechazar sobreclaim nacional
- **Proposed preamble:**  
  - **Contexto:** generalizar de una muestra web a “todo el Perú” es el sobreclaim típico del dashboard ejecutivo.  
  - **Meta:** clasificar el claim “Lima es la mejor del Perú”: RECHAZADO si menciona “del Perú” y no menciona “muestra”.  
  - **Éxito:** imprime `RECHAZADO`.  
  - **Límites:** no apruebes el claim por “sonar confiado”; no uses NLP externo.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `OK` a mano (bug).  
  2. Implementa la regla con substrings `"del Perú"` y `"muestra"`.  
  3. Imprime `RECHAZADO` u `OK` según la condición.  
  4. Deja el claim del fixture sin editarlo para “hacerlo pasar”.
- **Proposed feedback improvement:**  
  Generalizar de una muestra web a “todo el Perú” es sobreclaim. Exige el marco muestral en el lenguaje del dashboard; el contraste de color no lo arregla.
- **Proposed retrospective:**  
  La regla didáctica es dura a propósito: entrena el hábito antes de la política fina. Siguiente (E2): alt con `n=` y hatch como canal no-color (doble gate a11y).
- **Code/output changes:** none

---

### S19-T4-B-E2 (weDo, independent)
- **Diagnosis:** Doble gate alt+hatch — E2 rico y alineado a WCAG 1.4.1. Starter falla ambos. Instruction densa (dos booleanos). Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Alt con n= y hatch no-color
- **Proposed preamble:**  
  - **Contexto:** alt sin tamaño muestral es incompleto; categorías solo por color fallan a lectores daltónicos (WCAG 1.4.1).  
  - **Meta:** (1) alt con patrón `n=`; (2) hatch distinto de `None`. Imprimir dos booleanos, uno por línea.  
  - **Éxito:**  
    `True`  
    `True`  
  - **Límites:** hatch real (p. ej. `//`); no uses string vacío como hatch.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: alt sin n y hatch=None (bugs).  
  2. Completa el alt (p. ej. incluye `n=40`).  
  3. Asigna un patrón de hatch y verifica `hatch is not None`.  
  4. Imprime primero el check de n, luego el de hatch.
- **Proposed feedback improvement:**  
  Alt sin `n=` es incompleto. Hatch (o etiqueta/posición) evita que el daltonismo pierda la categoría: color solo no basta para el gate de a11y del portfolio.
- **Proposed retrospective:**  
  Dos canales de honestidad: texto no visual y encoding no solo-color. Luego (E3) un clasificador reutilizable de claims cierra el subtema de integridad.
- **Code/output changes:** none

---

### S19-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer: `classify_claim` binario por substring “muestra”. Starter siempre PERMITIDO. Instruction nombra las dos frases de prueba. Sin title/preamble/retrospective. Buen cierre del fade de la sección.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** classify_claim por marco muestral
- **Proposed preamble:**  
  - **Contexto:** el gate didáctico del portfolio: sin la palabra “muestra” (u otro marco explícito en producción), el claim no pasa.  
  - **Meta:** implementar `classify_claim(text)` → PERMITIDO si contiene “muestra”, si no RECHAZADO; clasificar dos frases.  
  - **Éxito:**  
    `PERMITIDO`  
    `RECHAZADO`  
  - **Límites:** regla de substring, no NLP; dos prints en el orden de las frases dadas.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: siempre devuelve PERMITIDO.  
  2. Condiciona con `"muestra" in text`.  
  3. Deja los dos prints de prueba.  
  4. No edites las frases para forzar el pass.
- **Proposed retrospective:**  
  En producción refinarías la política; aquí la regla es explícita y testeable. Pregunta de cierre: ¿cómo reescribirías “es la mejor del país” para que pase? Puente al You Do: el dashboard completo aplica chart choice, baseline, export, a11y y claims juntos.
- **Code/output changes:** none

---

### S19-youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context del CP-N2-B, objectives, requirements detallados (4 PNG, vista lógica, paridad, hatch, sample/universe, claims), starter con `build_bar_median` completo y TODOs en el resto, rubric ponderada y portfolioNote hacia S20/S21. **Falta `retrospective`** de defensa/metacognición post-build. Un newbie puede completar builders y aún no ensayar la defensa de 30 segundos ante un comité. Sin pregunta de auto-chequeo formal de cierre (el selfCheck de la sección es aparte, no sustituye retrospective del youDo).
- **Checklist:** context pass · goal pass · success pass (requirements + rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (youDo ya tiene title “Dashboard accesible CP-N2-B”)
- **Proposed preamble:** N/A — el `context` actual ya cumple rol de escena; no reescribir salvo micro-ajuste opcional del Fixer si quiere alinear vocabulario “preamble” del spec (no es bloqueante).
- **Proposed instruction/description improvements:**  
  Mantener requirements y starter. Opcional (P2): en `portfolioNote`, añadir una línea de “defensa oral”: listar los 4 PNG + un claim permitido vs uno rechazado en el README.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué assert o print demuestra baseline 0 y ylabel con PEN en cada barra de magnitudes absolutas? (2) ¿la tabla de paridad y cada alt usan la misma precisión y el mismo n que el chart? (3) Elige un claim del dashboard y reescríbelo en 15 segundos acotado a la muestra web sintética — si suena a “todo el Perú”, aún no entregas. (4) En el README, una frase de impacto medible (antes: eje recortado / sin alt; después: contrato visual + a11y) que puedas defender en 30 segundos ante operaciones.
- **Code/output changes:** none (el esqueleto y smoke de medianas son pedagógicamente correctos)
- **Validation notes:** Rubric y requirements ya operan como success criteria; el gap es solo cierre metacognitivo.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si quedó telegráfico)
1. **S19-T1-A-E1, E2, E3** — chart choice → brief → `elige_chart` (base del resto del dashboard)
2. **S19-T1-B-E1, E2, E3** — inflación visual → gate baseline → dual_axis
3. **S19-T2-A-E1, E2, E3** — ylim → ylabel+ylim → `meta_bar`
4. **S19-T2-B-E1, E2, E3** — export real → filename versionado → títulos de panel
5. **S19-T3-A-E1, E2, E3** — lookup → tooltip con n → función tooltip
6. **S19-T3-B-E1, E2, E3** — paridad → JSON sampling → alt con unidad
7. **S19-T4-A-E1, E2, E3** — pie mínimo → claves caption → formatter `pie`
8. **S19-T4-B-E1, E2, E3** — sobreclaim → alt+hatch → `classify_claim`

### P1
- **Todas las 8 I Do demos:** añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras del spec.
- **You Do:** añadir `retrospective` de defensa (baseline, paridad, claim, frase de impacto).

### P2
- Ajustar `feedback` de We Do donde solo nombra el error técnico y no el impacto al comité / a11y / S20–S21 (propuestas ya en el ledger).
- Reducir spoiling leve en hints que revelan el output exacto cuando el preamble ya fija el éxito (p. ej. T1-B-E2, T4-B-E1).
- Opcional: micro-refuerzo en `portfolioNote` del youDo para defensa oral en README.

---

## Residual risks
- **Nombre de archivo histórico** (`s19-databases-orm.ts`, id `databases-orm`) vs título real “Viz accesible”: riesgo de confusión para Fixers/orquestación; no es gap de ejercicio pero conviene no “corregir” id en esta campaña sin plan de routing.
- **Dependencia Matplotlib/Agg en ejercicios:** si el entorno del learner no tiene Matplotlib, varios We Do T2 fallan por import — fuera de scope de prosa, pero el Fixer no debe tocar outputs sin re-ejecutar.
- **E1 muy cortos (print de un string):** el riesgo pedagógico es que el learner “adivine el output” sin internalizar el principio; preambles + retrospectives mitigan eso sin inflar el código.
- **You Do incompleto por diseño (TODOs):** correcto para gradual release; la retrospective debe empujar verificación (assert ylim, paridad, claims), no solo “llenar TODOs”.
- **Fade de prosa ausente:** al implementar, el Fixer debe **diferenciar** tonos E1 (pasos + defecto nombrado) / E2 (meta + éxito) / E3 (superficie nueva, mismas reglas) — no clonar el mismo preamble con el id cambiado.
- **No se proponen cambios de `solutionCode`/`output`** en este round: el contrato visual y los strings canónicos están alineados a theory y al dashboard CP-N2-B.

---

## Fixer handoff (resumen operativo)
- **No editar** en Round 1 Review (este archivo es solo diagnóstico + prosa propuesta).
- Por cada We Do: insertar `title`, `preamble`, recortar `instruction` a pasos, añadir `retrospective`; opcional pulir `feedback`.
- Por cada I Do: insertar `preamble` y `retrospective`; expandir `why` sin tocar `code`/`output` salvo justificación execute-and-diff.
- You Do: solo `retrospective` (marco actual es suficiente).
- Validar longitudes del spec, es-PE, sin PII real, sin generadores.

---

Section 19 exercise pedagogy review complete. Ready for the Fixer prompt.
