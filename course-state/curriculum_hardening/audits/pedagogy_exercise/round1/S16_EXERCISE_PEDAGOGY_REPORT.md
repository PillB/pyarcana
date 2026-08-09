# S16 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Calidad, limpieza y contratos de datos
- **shortTitle:** Calidad y contratos
- **id:** `wxpython-gui` (archivo histórico `s16-wxpython-gui.ts`; contenido = quality gate pandas, no GUI wxPython)
- **index:** 16
- **source:** `src/lib/course/sections/s16-wxpython-gui.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S16-T1-A null policy · T1-B imputación/cap/indicador · T2-A exactos vs. conflictos · T2-B evidencia/cardinalidad · T3-A normalización PEN/raw · T3-B outliers dominio/IQR · T4-A schema/cross-field · T4-B métricas/audit
- **hilo de caso:** quality gate de **CP-N2-A** (fail-closed, cuarentena, audit append-only; dataset sintético Lima/Arequipa/Cusco, montos `S/`, ids `C00x`; puente a joins/portfolio de S17)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist context/goal/success/constraints, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (demos ~370–587), `weDo.steps[]` (~589–1465) y `youDo` (~1467–1536) en `s16-wxpython-gui.ts`.
- Contrastado con el hilo de la sección: nunca arreglar en silencio; required vs. optional; cap de imputación; clasificar antes de borrar; raw lateral; dominio sobre IQR; métricas aunque `pass=False`.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S16 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente, clara y técnica; **no** sustituye escena + qué observar |
| I Do `why` | Presente pero **muy corto** (1 frase; bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (prefijo “E1/E2/E3 …” solo dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — Concepto: … Fixture… Pass: …**”: meta + éxito + límites mezclados; legible para quien ya vive quality gates, **seco** para newbie sin job hook |
| We Do `feedback` | Una línea, a menudo útil (nombra el error típico); aún corto para *razonamiento* completo del spec |
| Starter defect | **Excelente**: casi todos invierten una comparación o pisan historial; defectos alineados a solution |
| Hints | Dos pistas conceptuales; en E1 a veces casi-solución (aceptable como andamiaje guiado) |
| You Do marco | `context` (con tabla de aceptación), `objectives`, `requirements`, `rubric`, `portfolioNote` **muy sólidos** |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y contrato fail-closed; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (DEFECT nombrado en comentarios del starter, oracle de salida, progresión real E1→E3 por subtema) está maduro. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en el gate CP-N2-A, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: conteo isna → mapa required → pass/fail; T3-B: domain mask → IQR → etiquetas error/flag/ok). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** una vez caigan preamble/instruction/retrospective.

---

## Unit ledger

### S16-T1-A-DEMO (iDo)
- **Diagnosis:** Demo correcta de policy required/optional y mapa `viol` + `optional_nulls`. La `description` nombra la skill, pero no hay escena de “por qué required no se rellena” ni cierre metacognitivo. El `why` es una sola frase que no repara el misconception “si el job necesita pasar, imputo el id”.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El lunes un batch de clientes sintéticos llega con `cliente_id` y `monto` null en filas distintas. Antes de “arreglar”, el quality gate de CP-N2-A debe **listar violaciones required** y solo **reportar** nulls en campos optional. En esta demo un `policy` marca required vs. optional; no escribas aún: predice el dict de violaciones y el conteo de nulls de `telefono`, luego compara con la salida. Observa que el optional no entra al mapa de fail.
- **Proposed instruction/description improvements:**  
  Mantener la description actual. Ampliar `why` (~50–70 palabras): required se traduce en fail/cuarentena; optional se mide como métrica; `isna` + filtro de policy evita fillna mágico de llaves de negocio; puente a We Do T1-A donde el newbie corrige conteo con `notna` invertido.
- **Proposed retrospective:**  
  Si puedes explicar por qué un null en `cliente_id` tumba el gate y uno en `telefono` solo se reporta, ya tienes la política por campo. El error clásico es rellenar required “para que pase el job”. En We Do practicarás conteo, mapa y decisión pass/fail.
- **Code/output changes:** none
- **Validation notes:** Output `{'cliente_id': 1, 'monto': 1}` + `optional_nulls 1` alineado a theory T1-A.

---

### S16-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter usa `notna` y etiqueta `ok`. Instruction mezcla concepto/pass/límites; sin title, preamble ni retrospective. Feedback nombra el error pero no ancla al job hook del gate.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar nulls required y etiquetar violates
- **Proposed preamble:**  
  - **Contexto:** en el gate de CP-N2-A, un `id` required con null no se “maquilla”: se cuenta y se etiqueta.  
  - **Meta:** practicar `isna().sum()` y la etiqueta `violates`/`ok`.  
  - **Éxito:** con el fixture del starter imprimes exactamente `1 violates`.  
  - **Límites:** no imputes antes de contar; no uses `notna` para ausencias.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: cuenta con `notna` e imprime `ok` (DEFECT).  
  2. Cambia el conteo a `isna().sum()` sobre `id`.  
  3. Si `n > 0`, etiqueta `violates`; si no, `ok`.  
  4. Imprime solo `n` y la etiqueta (sin texto extra).
- **Proposed feedback improvement:**  
  `notna` cuenta presentes; `isna` cuenta ausencias. Required con null ⇒ `violates`, no `ok`. Contar mal invierte la señal del gate y aprueba filas rotas.
- **Proposed retrospective:**  
  El primer paso del gate es **medir** ausencia required, no rellenar. El error clásico es confiar en `notna` o en fillna antes del conteo. Siguiente (E2): armar el mapa solo con campos required.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution `1 violates` correcta.

---

### S16-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente (dict solo required con n>0). Starter filtra `optional` a propósito. Instruction densa tipo mini-spec; falta escena de por qué el optional no ensucia el mapa de fail.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mapa de violaciones solo required
- **Proposed preamble:**  
  - **Contexto:** el reporte del run debe listar **solo** campos required con null; los optional van a métricas aparte.  
  - **Meta:** construir un dict `viol` filtrando la `policy`.  
  - **Éxito:** `{'a': 1}` (sin incluir `b` optional).  
  - **Límites:** no incluyas n=0 ni campos optional aunque tengan nulls.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: la comprensión filtra `p == "optional"` (DEFECT).  
  2. Itera `policy` e incluye solo `required` con `isna().any()`.  
  3. El valor del dict es el conteo entero de nulls.  
  4. Imprime el dict completo.
- **Proposed retrospective:**  
  El mapa de violaciones es el contrato legible del gate: required con n>0. Mezclar optional diluye el fail y confunde al auditor. Luego (E3) conviertes el mapa en decisión `pass`/`fail`.
- **Code/output changes:** none
- **Validation notes:** Output canónico `{'a': 1}`; fade con menos migas que E1 en instrucción propuesta.

---

### S16-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a fail-closed: starter deja `viol={}` e imprime `pass`. Instruction ya nombra “no rellenes nulls”; falta anclar *por qué* un pass ciego es el anti-patrón del lunes en fintech/retail.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate pass/fail desde violaciones required
- **Proposed preamble:**  
  - **Contexto:** el job no debe imprimir `pass` si el contrato required se rompe; eso es el anti-patrón del gate silencioso.  
  - **Meta:** decidir `fail` o `pass` a partir de violaciones reales de `id`.  
  - **Éxito:** con el fixture (id nulo) imprimes exactamente `fail`.  
  - **Límites:** no rellenes nulls para forzar pass; no dejes `viol` vacío a ciegas.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `pass` porque `viol` está vacío sin medir.  
  2. Llena `viol` desde `isna` del campo required.  
  3. Imprime `fail` si hay violaciones; si no, `pass`.  
  4. Una sola palabra de salida.
- **Proposed retrospective:**  
  Fail-closed = el gate publica el fallo en lugar de maquillar datos. Si `viol` no se llena, el pass es mentira operativa. Cierra T1-A: conteo → mapa → decisión. En T1-B practicarás imputar solo lo permitido.
- **Code/output changes:** none
- **Validation notes:** Transfer limpio; mismo principio, nueva decisión de runbook.

---

### S16-T1-B-DEMO (iDo)
- **Diagnosis:** Demo sólida de cap + `monto_was_null` + mediana. Sin preamble que diga *qué observar* (orden: rate → indicador → fill). `why` telegráfico; no cierra el misconception “imputo siempre y el indicador da igual”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Cuando el monto optional tiene nulls, el gate puede imputar **solo si** el `null_rate` no supera el cap, y debe dejar un indicador de qué filas se tocaron. En esta demo `cap=0.5` y un null de cuatro filas: sigue el `status`, el rate y el dict final. Predice si verás `imputed` o `blocked` y en qué posición `monto_was_null` es True.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: cap evita imputación masiva; el indicador preserva señal para auditor y modelo; la mediana se calcula pre-fill; puente a We Do donde el orden fill→isna borra la evidencia.
- **Proposed retrospective:**  
  Imputar sin indicador borra la diferencia entre cero real y cero inventado. Si el rate supera el cap, el status es `blocked`, no un fill silencioso. En We Do practicarás el orden del indicador y el umbral.
- **Code/output changes:** none
- **Validation notes:** Output `imputed 0.25` con lista canónica correcta.

---

### S16-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defect clásico y excelente (fillna antes de isna). Instruction describe el concepto bien pero sigue siendo drill sin escena de auditoría. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Marcar was_null antes de imputar
- **Proposed preamble:**  
  - **Contexto:** el auditor del gate debe ver qué montos fueron tocados; si rellenas primero, `isna()` ya no ve nulls.  
  - **Meta:** crear `was_null` **antes** de `fillna`.  
  - **Éxito:** `[False, True]` alineado a las filas del fixture.  
  - **Límites:** no crees el indicador después del fill; no uses abs ni drop.
- **Proposed instruction/description improvements:**  
  1. El starter hace `fillna` y luego `isna` (DEFECT).  
  2. Asigna `was_null = monto.isna()` primero.  
  3. Luego rellena con `0.0`.  
  4. Imprime solo `was_null.tolist()`.
- **Proposed retrospective:**  
  El orden es parte del contrato: medir ausencia → transformar → publicar. Indicador después del fill = evidencia falsa (todo False). Siguiente (E2): el cap decide si se permite imputar.
- **Code/output changes:** none
- **Validation notes:** Output `[False, True]`; defect pedagógico de alto valor.

---

### S16-T1-B-E2 (weDo, independent)
- **Diagnosis:** Cap invertido en starter (`rate < 0.3`). Instruction clara sobre umbral; falta job hook de “por qué bloquear al 50% null”. Feedback corto pero acertado.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Bloquear imputación si null_rate supera cap
- **Proposed preamble:**  
  - **Contexto:** si la mitad de los montos vienen vacíos, imputar “para que el KPI no falle” envenena el ticket promedio.  
  - **Meta:** comparar `null_rate` con umbral 0.3 y decidir `blocked`/`ok`.  
  - **Éxito:** con rate=0.5 imprimes `blocked`.  
  - **Límites:** no imputes si está bloqueado; no inviertas la comparación del umbral.
- **Proposed instruction/description improvements:**  
  1. Calcula `rate = isna().mean()` sobre la serie del fixture.  
  2. El starter bloquea cuando rate es **bajo** (DEFECT).  
  3. Corrige: `blocked` si `rate > 0.3`, si no `ok`.  
  4. Imprime solo la etiqueta.
- **Proposed retrospective:**  
  El cap es un freno de negocio, no un detalle de pandas. Rate alto ⇒ no rellenar en silencio. Luego (E3) practicarás mediana estable cuando sí se permite imputar.
- **Code/output changes:** none
- **Validation notes:** Output `blocked`; fixture 2/4 nulls bien elegido.

---

### S16-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a imputación por mediana (no cero). Instruction un poco densa y abstracta (“mediana de no-nulos se preserva conceptualmente”); el éxito observable es claro. Falta escena de por qué 0 inventa un cero de negocio en montos PE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Imputar mediana de no-nulos (no cero)
- **Proposed preamble:**  
  - **Contexto:** con cap respetado, el relleno permitido de monto no es `0` (cero de negocio falso en ticket PEN).  
  - **Meta:** calcular mediana skipna y `fillna` con ese valor.  
  - **Éxito:** `1.5 [1.0, 2.0, 1.5]`.  
  - **Límites:** no uses mean por defecto aquí; no rellenes con 0.
- **Proposed instruction/description improvements:**  
  1. El starter fija `med = 0.0` y `fillna(0.0)` (DEFECT).  
  2. Calcula `med = s.median()` (ignora NaN).  
  3. Rellena con `med`.  
  4. Imprime `float(med)` y la lista final.
- **Proposed retrospective:**  
  Mediana pre-fill es la regla documentada del gate cuando el cap lo permite. Rellenar con 0 inventa volumen y sesga KPIs. Cierra T1-B: indicador → cap → relleno justificado. En T2-A clasificarás filas, no solo celdas.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; transfer real respecto a E1/E2.

---

### S16-T2-A-DEMO (iDo)
- **Diagnosis:** Demo útil de `exact_dup_rows` vs. `conflict_ids`. Sin preamble que fuerce al learner a predecir C001 exacto vs. C002 conflicto. `why` no repara “drop_duplicates arregla todo”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En un maestro de clientes, C001 se repite idéntico y C002 aparece con Cusco y Arequipa. Si haces `drop_duplicates` ciego, puedes borrar el único rastro del conflicto. En esta demo no escribas: cuenta mentalmente filas exactas y lista de ids en conflicto, luego compara con la salida. Observa que la acción de limpieza **depende** de la clase.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: exacto colapsa tras log; conflicto exige evidencia y regla; `duplicated(keep=False)` vs. `nunique` de atributo; puente a We Do de conteo y clasificación.
- **Proposed retrospective:**  
  Clasificar antes de borrar es la regla de oro de T2. Exacto ≠ conflicto: el segundo no se “arregla” con keep first silencioso. En We Do practicarás cada máscara por separado y luego la etiqueta conjunta.
- **Code/output changes:** none
- **Validation notes:** Output `exact_dup_rows 2` / `conflict_ids ['C002']` alineado a theory.

---

### S16-T2-A-E1 (weDo, guided)
- **Diagnosis:** Defect sutil y valioso (`duplicated()` default omite primera). Instruction técnica correcta; sin escena de “por qué keep=False es evidencia completa del grupo”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar filas de duplicado exacto (keep=False)
- **Proposed preamble:**  
  - **Contexto:** para cuarentena o log, necesitas **todas** las copias del grupo exacto, no solo “la segunda”.  
  - **Meta:** contar filas con `duplicated(keep=False)`.  
  - **Éxito:** entero `2` con el fixture.  
  - **Límites:** no uses `drop` aún; no dejes el default de `keep`.
- **Proposed instruction/description improvements:**  
  1. El starter usa `duplicated()` sin `keep=False` (DEFECT).  
  2. Marca todas las copias del grupo exacto.  
  3. Suma la máscara e imprime el entero.  
  4. No modifiques el DataFrame.
- **Proposed retrospective:**  
  `keep=False` es la máscara de evidencia del grupo; el default es para drop, no para inventario. Contar 1 cuando hay 2 filas idénticas subestima la cuarentena. Siguiente (E2): conflictos multi-región.
- **Code/output changes:** none
- **Validation notes:** Output `2`; tip pandas bien elegido para E1.

---

### S16-T2-A-E2 (weDo, independent)
- **Diagnosis:** Conflicto vía `nunique > 1`; starter usa `== 1` (ids “limpios”). Instruction correcta; falta anclar a maestro mentiroso si se droppea el conflicto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Listar cliente_id con conflicto de región
- **Proposed preamble:**  
  - **Contexto:** misma clave con regiones distintas no es “duplicado exacto”; es conflicto que envenena el maestro.  
  - **Meta:** listar ids con `region.nunique() > 1`.  
  - **Éxito:** `['C001']` (C002 no entra).  
  - **Límites:** no uses solo `duplicated` de filas completas; no inviertas el umbral de nunique.
- **Proposed instruction/description improvements:**  
  1. Agrupa por `cliente_id` y mide nunique de `region`.  
  2. El starter filtra `ids == 1` (DEFECT: lista “limpios”).  
  3. Filtra `ids > 1` e imprime el índice como lista.  
  4. Sin drop ni fill.
- **Proposed retrospective:**  
  Conflicto = misma clave, atributos distintos. Listar limpios no es listar problemas. Luego (E3) etiquetas exact / conflict / clean en un solo id de prueba.
- **Code/output changes:** none
- **Validation notes:** Output `['C001']`; fade independiente adecuado.

---

### S16-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de clasificación; starter imprime `clean` a ciegas. Instruction ya ordena exact vs. conflict; solution un poco densa pero correcta. Falta cierre “por qué no borrar primero”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Clasificar exact, conflict o clean
- **Proposed preamble:**  
  - **Contexto:** el runbook del gate elige acción **después** de clasificar; imprimir `clean` sin mirar es el anti-patrón.  
  - **Meta:** para C001 del fixture, emitir `exact`, `conflict` o `clean`.  
  - **Éxito:** `conflict` (Lima vs. Cusco).  
  - **Límites:** clasifica antes de borrar; no asumas clean.
- **Proposed instruction/description improvements:**  
  1. Filtra el subconjunto del id C001.  
  2. Si hay más de una región distinta → `conflict`.  
  3. Si las filas son copias exactas → `exact`; si no, `clean`.  
  4. Imprime una sola etiqueta.
- **Proposed retrospective:**  
  El orden clasificar→actuar evita borrar el rastro del conflicto. Lima/Cusco en el mismo cliente_id nunca es `clean`. Cierra T2-A. En T2-B partirás clean vs. quarantine con evidencia.
- **Code/output changes:** none
- **Validation notes:** Output `conflict`; transfer real sobre E1/E2.

---

### S16-T2-B-DEMO (iDo)
- **Diagnosis:** Demo clara de clean + quarantine con columnas de evidencia. Sin preamble de “qué se pierde si solo keepas first sin log”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  C001 llega dos veces con scores distintos y batches `b1`/`b2`. El conjunto limpio puede quedarse con `keep='first'`, pero la cuarentena debe conservar **ambas** filas y columnas para auditoría. En esta demo predice `clean_ids` y el contenido de `quarantine` antes de mirar la salida. Observa que no se “desaparecen” filas sin rastro.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: clean alimenta joins de S17; quarantine es evidencia completa; keep documentado ≠ borrar sin log; puente a We Do de split y columnas.
- **Proposed retrospective:**  
  keep=first solo define el clean; no sustituye el audit trail. Sin quarantine con columnas de origen, el gate no es auditable ante riesgo o cumplimiento. En We Do armarás lens, columnas y chequeo de cardinalidad.
- **Code/output changes:** none
- **Validation notes:** Output clean + quarantine con `batch` correcto.

---

### S16-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter usa keep last y `print(0, …)` sin armar quarantine. Instruction densa; success como “tupla/lens del oracle” es un poco vago en prosa (aunque output es `2 2`).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Separar quarantine y clean por clave
- **Proposed preamble:**  
  - **Contexto:** al resolver clave duplicada, el gate parte evidencia (todas las dups) y clean (una fila por id).  
  - **Meta:** imprimir `len(quarantine)` y `len(clean)` con keep first.  
  - **Éxito:** `2 2` en el fixture (dos filas en q; dos ids en clean).  
  - **Límites:** no pierdas quarantine; documenta keep; no uses keep last sin regla.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `0` y usa `keep="last"` (DEFECT).  
  2. Arma `q` con `duplicated(id, keep=False)`.  
  3. Arma `c` con `drop_duplicates(id, keep="first")`.  
  4. Imprime `len(q), len(c)`.
- **Proposed retrospective:**  
  Quarantine completa + clean documentado es el split auditable. Contar 0 en q es mentir al auditor. Siguiente (E2): conservar columnas de evidencia, no solo la clave.
- **Code/output changes:** none
- **Validation notes:** Output `2 2`; lens claros.

---

### S16-T2-B-E2 (weDo, independent)
- **Diagnosis:** Defect fuerte: proyecta solo `["id"]` y pierde `batch`. Instruction y feedback ya lo dicen; falta escena de reconstrucción de origen del batch.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Conservar columnas de evidencia en cuarentena
- **Proposed preamble:**  
  - **Contexto:** sin `batch` (u origen), el auditor no reconstruye de dónde vino cada versión de la clave.  
  - **Meta:** cuarentena con **todas** las columnas del df filtrado.  
  - **Éxito:** `['id', 'batch']`.  
  - **Límites:** no proyectes solo la clave; no dropees cols de evidencia.
- **Proposed instruction/description improvements:**  
  1. El starter selecciona solo `["id"]` tras el mask (DEFECT).  
  2. Filtra dups con `keep=False` y `copy()`.  
  3. No subselecciones columnas.  
  4. Imprime `q.columns.tolist()`.
- **Proposed retrospective:**  
  Evidencia = fila completa del conflicto/dup. Proyectar solo la clave convierte la cuarentena en un id inútil. Luego (E3) chequearás si el clean puede ser 1:1 para S17.
- **Code/output changes:** none
- **Validation notes:** Output `['id', 'batch']`; independent bien calibrado.

---

### S16-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Cardinalidad 1:1; starter imprime `card_ok` a ciegas. Instruction conecta a join de S17 — buen hilo; falta preamble formal y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Validar cardinalidad 1:1 por id
- **Proposed preamble:**  
  - **Contexto:** S17 hará joins asumiendo una fila por cliente; si el clean tiene clave duplicada, el join miente.  
  - **Meta:** comparar `nunique(id)` con `len(df)`.  
  - **Éxito:** `card_bad` en el fixture con id repetido.  
  - **Límites:** no asumas card_ok; no compares con nunique de todas las columnas.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `card_ok` sin medir (DEFECT).  
  2. Si cada id aparece una vez → `card_ok`; si no → `card_bad`.  
  3. Imprime una sola etiqueta.  
  4. No dropees filas en este ejercicio.
- **Proposed retrospective:**  
  Cardinalidad 1:1 es un contrato del clean hacia S17, no un detalle cosmético. `card_ok` a ciegas es el mismo anti-patrón que `pass` sin medir. Cierra T2. En T3-A normalizarás sin borrar el raw.
- **Code/output changes:** none
- **Validation notes:** Output `card_bad`; transfer limpio al siguiente módulo.

---

### S16-T3-A-DEMO (iDo)
- **Diagnosis:** Demo rica de strip/title + `norm_money` con raw lateral. Sin preamble que diga “observa raw intacto y floats canónicos”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Los montos llegan como `S/12.5` y `3,00`; las regiones con espacios y mayúsculas. La normalización del gate hace canónicos **sin** pisar el raw, y el locale PEN está documentado (coma sola = decimal latino). En esta demo predice las cuatro columnas del dict final: raw vs. canónico. No escribas aún; sigue el `map` de montos y el `str.title` de región.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: normalizar ≠ imputar; raw permite disputar; contrato de coma/punto evita 300 en lugar de 3.0; puente a We Do de strip/title, locale y no-overwrite.
- **Proposed retrospective:**  
  Si el raw y el canónico viven juntos, el transform es auditable. El error clásico es pisar la columna original o borrar comas a ciegas. En We Do practicarás cada pieza del contrato.
- **Code/output changes:** none
- **Validation notes:** Output con raw + canónicos correcto.

---

### S16-T3-A-E1 (weDo, guided)
- **Diagnosis:** Strip sin title en starter. Drill básico correcto; falta anclar a regiones PE y canonicidad para groupby/KPI.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Normalizar región con strip y title
- **Proposed preamble:**  
  - **Contexto:** ` lima ` y `CUSCO` no deben generar tres buckets en un groupby de regiones PE.  
  - **Meta:** aplicar `strip` + `title` a la Series.  
  - **Éxito:** `['Lima', 'Cusco']`.  
  - **Límites:** no uses solo lower; no borres el raw si el lab lo pide en columnas separadas (aquí solo Series).
- **Proposed instruction/description improvements:**  
  1. El starter solo hace strip (DEFECT).  
  2. Encadena `.str.title()` tras strip.  
  3. Imprime `.tolist()`.  
  4. Sin replace manual de cada ciudad.
- **Proposed retrospective:**  
  Canonicidad de strings es el primer filtro antes de mapas de sinónimos. Solo strip deja `CUSCO` ruidoso. Siguiente (E2): locale de montos PEN.
- **Code/output changes:** none
- **Validation notes:** Output `['Lima', 'Cusco']`.

---

### S16-T3-A-E2 (weDo, independent)
- **Diagnosis:** Uno de los mejores DEFECT de la sección: borrar coma → 300. Instruction y feedback ya enseñan locale; falta preamble de impacto en KPI de ticket y title formal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Parsear montos PEN con decimal latino
- **Proposed preamble:**  
  - **Contexto:** en un batch sintético PEN, `3,00` es tres soles, no trescientos; borrar la coma a ciegas infla el ticket promedio.  
  - **Meta:** quitar `S/` y tratar **solo coma** como decimal latino; sumar.  
  - **Éxito:** `4.5` (1.5 + 3.0).  
  - **Límites:** no uses `replace(',', '')` como miles por defecto; no dejes el prefijo `S/`.
- **Proposed instruction/description improvements:**  
  1. Revisa `norm_money` del starter: borra comas (DEFECT).  
  2. Si hay coma y no hay punto, reemplaza coma por punto.  
  3. Convierte a float y suma la serie.  
  4. Imprime un solo float.
- **Proposed retrospective:**  
  Locale documentado es parte del contrato del gate, no un “detalle de formato”. `3,00` → 300 es un bug de negocio silencioso. Luego (E3) conservarás el raw al crear la columna canónica.
- **Code/output changes:** none
- **Validation notes:** Output `4.5`; defect de alto valor pedagógico.

---

### S16-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a no-overwrite de raw; starter pisa `region_raw`. Instruction clara; falta escena de disputa/auditoría.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Crear region canónica sin pisar el raw
- **Proposed preamble:**  
  - **Contexto:** si normalizas **en** `region_raw`, pierdes el valor original y no puedes defender el transform ante auditoría.  
  - **Meta:** escribir canónico en `region` y dejar `region_raw` intacto.  
  - **Éxito:** `['lima'] ['Lima']`.  
  - **Límites:** no dropees el raw; no sobreescribas la columna original.
- **Proposed instruction/description improvements:**  
  1. El starter asigna title sobre `region_raw` (DEFECT).  
  2. Crea `df["region"]` desde el raw.  
  3. Imprime raw y luego canónica.  
  4. Verifica mentalmente que raw sigue en minúsculas.
- **Proposed retrospective:**  
  Raw al lado = transform disputable. Pisar el original es normalizar de forma no auditable. Cierra T3-A. En T3-B clasificarás outliers sin borrar colas legítimas.
- **Code/output changes:** none
- **Validation notes:** Output `['lima'] ['Lima']`.

---

### S16-T3-B-DEMO (iDo)
- **Diagnosis:** Demo clave dominio vs. IQR (`plausible` = 1000). Sin preamble que fuerce a predecir por qué -3 es error y 1000 es flag. `why` telegráfico.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Una serie de montos trae `1000` (cola estadística) y `-3` (fuera de dominio de negocio). El gate **no** borra por IQR solo: primero marca error de dominio y luego flag estadístico. En esta demo predice `stat`, `error` y `plausible` antes de mirar la salida. Observa que dominio manda sobre la etiqueta final.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: IQR propone candidatos; bounds de dominio deciden error; no drop ciego de colas legítimas; puente a We Do de máscaras y etiquetas.
- **Proposed retrospective:**  
  Si puedes explicar por qué 1000 es `flag` y -3 es `error`, ya separas estadística de regla de negocio. El error clásico es borrar todo lo “raro” por IQR. En We Do practicarás cada capa.
- **Code/output changes:** none
- **Validation notes:** Output `stat [1000, -3]` / `error [-3]` / `plausible [1000]` correcto.

---

### S16-T3-B-E1 (weDo, guided)
- **Diagnosis:** Máscara invertida (`>= 0`). Simple y bien; falta contexto de monto negativo como domain_error del gate.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Marcar domain_error en montos negativos
- **Proposed preamble:**  
  - **Contexto:** en el contrato de montos del gate, un valor &lt; 0 es error de dominio, no “outlier curioso”.  
  - **Meta:** emitir máscara booleana `s < 0`.  
  - **Éxito:** `[False, True, False]`.  
  - **Límites:** no uses IQR aquí; no inviertas a `>= 0`.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `(s >= 0)` (DEFECT).  
  2. Cambia a `s < 0`.  
  3. Imprime `.tolist()`.  
  4. Sin abs ni drop.
- **Proposed retrospective:**  
  Domain bounds son reglas de negocio, no estadística. Invertir la máscara marca los montos válidos como error. Siguiente (E2): candidatos IQR aparte.
- **Code/output changes:** none
- **Validation notes:** Output `[False, True, False]`.

---

### S16-T3-B-E2 (weDo, independent)
- **Diagnosis:** Solo fence superior en starter; 100 cae bien igual, pero el hábito incompleto es el learning goal. Instruction pide “lista del oracle”; feedback correcto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Listar outliers IQR con ambos fences
- **Proposed preamble:**  
  - **Contexto:** el flag estadístico usa IQR 1.5 a **ambos** lados; un solo fence deja colas inferiores sin marcar.  
  - **Meta:** listar valores fuera de `[q1-1.5*iqr, q3+1.5*iqr]`.  
  - **Éxito:** `[100.0]` en el fixture.  
  - **Límites:** no dropees filas; no uses z-score aquí; domain se evalúa aparte.
- **Proposed instruction/description improvements:**  
  1. Calcula q1, q3 e iqr.  
  2. El starter solo mira el upper fence (DEFECT de hábito).  
  3. Une lower y upper con `|`.  
  4. Imprime `s[mask].tolist()`.
- **Proposed retrospective:**  
  IQR propone candidatos; no decide borrar. Ambos fences evitan ceguera a un lado. Luego (E3) combinas dominio + IQR en etiquetas error/flag/ok.
- **Code/output changes:** none
- **Validation notes:** Output `[100.0]`; conviene en feedback del Fixer recordar que el fixture solo ejercita upper pero la máscara debe ser bilateral.

---

### S16-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer rico de etiquetas; starter imprime todo `ok`. Instruction densa pero correcta; es el mini-capstone de T3-B. Falta preamble de priorización dominio→IQR→ok.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Etiquetar error, flag u ok por monto
- **Proposed preamble:**  
  - **Contexto:** el memo del gate no puede decir solo “raro”: debe distinguir error de dominio, flag estadístico y valor ok.  
  - **Meta:** para probes `[5000, -1, 10]`, priorizar domain sobre IQR.  
  - **Éxito:** `['flag', 'error', 'ok']`.  
  - **Límites:** no marques error por IQR solo; no drops; dominio: &lt;0 o &gt;10000.
- **Proposed instruction/description improvements:**  
  1. Calcula q1/q3/iqr sobre **toda** la serie.  
  2. Para cada probe: si domain → `error`; elif stat → `flag`; else `ok`.  
  3. El starter imprime tres `ok` (DEFECT).  
  4. Imprime la lista de etiquetas.
- **Proposed retrospective:**  
  Prioridad dominio → estadística → ok es el contrato de outliers del gate. 5000 puede ser cola legítima (flag); -1 no. Cierra T3. En T4-A el contrato pasa a schema y reglas cross-field.
- **Code/output changes:** none
- **Validation notes:** Output `['flag', 'error', 'ok']`; transfer excelente.

---

### S16-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de missing columns + cross_fail índices. Sin preamble de schema drift explicable. `why` una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El contrato del batch exige columnas `inicio`, `fin` y `monto`, y la regla de negocio `fin >= inicio`. En esta demo el schema está completo pero la segunda fila viola el orden temporal. Predice `missing` y `cross_fail` antes de mirar la salida. Observa que el mensaje es un índice y un código, no un crash opaco.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: schema drift y cross-field son capas del mismo contrato; fail explicable con códigos; puente a We Do de missing, máscara temporal y flag drift.
- **Proposed retrospective:**  
  Un gate sin reglas cross-field aprueba filas internamente inconsistentes. Schema ok no basta: el tiempo de vigencia también es contrato. En We Do practicarás cada capa del chequeo.
- **Code/output changes:** none
- **Validation notes:** Output `missing [] cross_fail [1]` correcto.

---

### S16-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter imprime `[]` a ciegas. Claro y alineado a drift de columnas; falta escena “mensaje de drift explicable para el operador del job”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Listar columnas required faltantes
- **Proposed preamble:**  
  - **Contexto:** si falta `monto` en el batch, el operador necesita ver `['monto']`, no un KeyError a mitad del pipeline.  
  - **Meta:** comparar `required` con `df.columns`.  
  - **Éxito:** `['monto']`.  
  - **Límites:** no trates columnas extra como fail aquí; no devuelvas lista vacía a ciegas.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `[]` sin comparar (DEFECT).  
  2. Lista comprehension: `c not in df.columns`.  
  3. Imprime la lista de faltantes.  
  4. No mutes el DataFrame.
- **Proposed retrospective:**  
  Missing columns = schema drift legible. Lista vacía fingida es el anti-patrón del gate silencioso. Siguiente (E2): inconsistencias entre campos presentes.
- **Code/output changes:** none
- **Validation notes:** Output `['monto']`.

---

### S16-T4-A-E2 (weDo, independent)
- **Diagnosis:** Comparación invertida `fin > inicio` lista filas válidas. Feedback bueno; falta anclar a vigencia de productos/campañas.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Índices donde fin es anterior a inicio
- **Proposed preamble:**  
  - **Contexto:** una vigencia con `fin < inicio` rompe el contrato temporal aunque las columnas existan.  
  - **Meta:** listar índices de la máscara `fin < inicio`.  
  - **Éxito:** `[1]` en el fixture.  
  - **Límites:** parsea fechas (ya vienen como datetime); no compares strings crudos; no inviertas la desigualdad.
- **Proposed instruction/description improvements:**  
  1. El starter usa `fin > inicio` (DEFECT: lista válidos).  
  2. Cambia a `fin < inicio`.  
  3. Imprime `df.index[mask].tolist()`.  
  4. Sin rellenar fechas.
- **Proposed retrospective:**  
  Cross-field = reglas entre columnas, no solo presencia. Invertir la máscara “falla” las filas buenas. Luego (E3) el flag de drift del schema cierra el gate de columnas.
- **Code/output changes:** none
- **Validation notes:** Output `[1]`.

---

### S16-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `drift`/`schema_ok`; starter calcula `missing` pero imprime `schema_ok`. Excelente anti-patrón; falta preamble fail-closed.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Flag de schema drift fail-closed
- **Proposed preamble:**  
  - **Contexto:** medir `missing` y aun así imprimir `schema_ok` es el mismo error que el job que “aprueba en silencio”.  
  - **Meta:** emitir `drift` si hay required faltantes; si no, `schema_ok`.  
  - **Éxito:** `drift` en el fixture sin `monto`.  
  - **Límites:** usa la lista missing; no asumas ok; no tragues KeyError sin mensaje.
- **Proposed instruction/description improvements:**  
  1. Ya tienes `missing` calculado.  
  2. El starter ignora missing e imprime `schema_ok` (DEFECT).  
  3. Imprime `drift` si missing no vacío; si no, `schema_ok`.  
  4. Una sola etiqueta.
- **Proposed retrospective:**  
  Fail-closed ante drift protege a S17 y a quien consume el clean. Calcular missing y no usarlo es teatro de validación. Cierra T4-A. En T4-B publicarás métricas y audit aunque el gate falle.
- **Code/output changes:** none
- **Validation notes:** Output `drift`; transfer nítido.

---

### S16-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de metrics JSON + audit append. Sin preamble de “publicar aunque pass=False”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El batch entra con 5 filas y 2 van a cuarentena por schema_drift y domain_error. El gate **publica** métricas con `pass: false` y un audit trail de al menos start + quarantine. En esta demo predice `rows_clean` y el último evento del audit antes de mirar la salida. Observa que el fallo no oculta números.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: operar un fallo exige métricas y razones; append-only permite reconstruir el run; puente a We Do de bloque metrics, append y `pass` booleano.
- **Proposed retrospective:**  
  Un gate que solo “explota” sin JSON no es operable. Métricas + audit son el producto del fail-closed. En We Do construirás cada pieza del reporte.
- **Code/output changes:** none
- **Validation notes:** Output JSON sort_keys + `2 quarantine` correcto.

---

### S16-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter suma quarantine a rows_in y fuerza `pass: True`. Instruction ya es de las más completas de la sección; aún mezcla todo en un bloque sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Armar el bloque metrics del run
- **Proposed preamble:**  
  - **Contexto:** el operador del job necesita un dict serializable: cuántas entraron, cuántas salieron limpias, cuántas a cuarentena y si el run aprobó.  
  - **Meta:** construir `metrics` y serializar con `json.dumps(..., sort_keys=True)`.  
  - **Éxito:** `{"pass": false, "rows_clean": 7, "rows_in": 10, "rows_quarantine": 3}`.  
  - **Límites:** `rows_clean = rows_in - len(quarantine)`; `pass` solo si quarantine vacía; no inventes literales sueltos.
- **Proposed instruction/description improvements:**  
  1. El starter suma quarantine a rows_in y pone pass True (DEFECT).  
  2. Corrige `rows_clean` por resta.  
  3. `pass = (len(quarantine) == 0)`.  
  4. Imprime el JSON con claves ordenadas.
- **Proposed retrospective:**  
  Las métricas se **derivan** del conteo real, no de literales optimistas. Sumar rechazos a rows_in es un bug de reporting. Siguiente (E2): el audit no se pisa al fallar.
- **Code/output changes:** none
- **Validation notes:** Output JSON canónico; defect de reporting de alto valor.

---

### S16-T4-B-E2 (weDo, independent)
- **Diagnosis:** Reasignación de lista vs. append — defect excelente. Instruction y feedback acertados; falta escena de rastro de auditoría append-only.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Append del evento quarantine sin pisar start
- **Proposed preamble:**  
  - **Contexto:** el audit trail es append-only: el evento `start` no se borra cuando llega `quarantine`.  
  - **Meta:** agregar un evento con `n=2` y reportar longitud + último event.  
  - **Éxito:** `2 quarantine`.  
  - **Límites:** no reasignes `audit = [solo el último]`; no omitas `n`.
- **Proposed instruction/description improvements:**  
  1. El starter reasigna la lista y pierde `start` (DEFECT).  
  2. Usa `append` del dict `quarantine`.  
  3. Imprime `len(audit)` y `audit[-1]["event"]`.  
  4. Sin borrar eventos previos.
- **Proposed retrospective:**  
  Append-only permite reconstruir el run; reasignar es perder historia. Len=1 con solo quarantine es un audit mentiroso. Luego (E3) el booleano `pass` cierra el contrato fail-closed.
- **Code/output changes:** none
- **Validation notes:** Output `2 quarantine`.

---

### S16-T4-B-E3 (weDo, transfer)
- **Diagnosis:** `pass` invertido (`n_q > 0`). Transfer mínimo y correcto; instruction ya dice “publica métricas aunque falle” en espíritu. Falta preamble formal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** metrics.pass False si hay cuarentena
- **Proposed preamble:**  
  - **Contexto:** con filas en cuarentena, `pass` debe ser False; invertir la comparación aprueba un batch roto.  
  - **Meta:** fijar `pass = (n_q == 0)` y imprimir el booleano.  
  - **Éxito:** `False` cuando `n_q=1`.  
  - **Límites:** no omitas la métrica; no pongas True “para no alarmar”.
- **Proposed instruction/description improvements:**  
  1. El starter usa `n_q > 0` (DEFECT: True con cuarentena).  
  2. Cambia a `n_q == 0`.  
  3. Imprime `metrics["pass"]`.  
  4. No alteres `rows_quarantine`.
- **Proposed retrospective:**  
  `pass` es el semáforo del job, no un mensaje de marketing. True con cuarentena rompe fail-closed. Cierra T4 y prepara el You Do: metrics + quarantine + audit juntos.
- **Code/output changes:** none
- **Validation notes:** Output `False`.

---

### S16-youDo (youDo)
- **Diagnosis:** Marco de proyecto **muy fuerte**: context con tabla de aceptación del fixture, objectives, requirements, starter con asserts, rubric y portfolioNote. Falta únicamente `retrospective` de defensa/reflexión post-build (spec §3 You Do y §8.3). Sin ese cierre, el learner puede “hacer que pasen los asserts” sin verbalizar invariantes del gate.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Quality gate explicable ante schema drift — mantener
- **Proposed preamble:** N/A (youDo usa `context`; no añadir preamble duplicado salvo que el Fixer unifique schema)
- **Proposed instruction/description improvements:**  
  Ninguno mayor en context/requirements. Opcional P2: en `portfolioNote`, una línea que recuerde alinear reasons del quarantine con la tabla de aceptación del context.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con `metrics.pass is False` y `rows_quarantine >= 2` en el fixture? (2) ¿qué reason codificada darías a null required, conflicto de región y monto negativo, y por qué no las “arreglas” con fillna o drop ciego? (3) En el memo, escribe una frase de impacto medible (filas fuera del clean / pass=False) que puedas defender en 30 segundos ante riesgo o cumplimiento. El clean, si lo publicas, es el único input válido para S17.
- **Code/output changes:** none (asserts del starter coherentes con el hilo)
- **Validation notes:** Fixture C001 conflicto + null + domain_error bien diseñado; no tocar outputs de asserts.

---

## Priority order

### P0 (implementar primero — We Do verbal scaffold)
Todos los 24 We Do: añadir `title`, `preamble` (checklist 4 puntos), acortar `instruction` a pasos de tarea, añadir `retrospective`; endurecer `feedback` donde se propuso (sin cambiar oracles).

Orden sugerido de fix por dependencia pedagógica del gate:
1. **T1-A** E1→E3 (null policy → fail-closed)  
2. **T1-B** E1→E3 (indicador → cap → mediana)  
3. **T2-A** E1→E3 (exact → conflict → classify)  
4. **T2-B** E1→E3 (split → evidencia → card 1:1)  
5. **T3-A** E1→E3 (strings → PEN locale → raw)  
6. **T3-B** E1→E3 (domain → IQR → labels)  
7. **T4-A** E1→E3 (missing → cross-field → drift)  
8. **T4-B** E1→E3 (metrics → audit → pass)

### P1
- **8 I Do:** `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras.  
- **You Do:** añadir `retrospective` de defensa (propuesta arriba).

### P2
- Unificar tono de feedback a 25–60 palabras con *razonamiento* del error típico (varios ya están cerca).  
- Revisar hints E1 que casi copian solution: dejar conceptuales si el Fixer reescribe instruction a pasos.  
- Nota menor T3-B-E2: fixture solo ejercita upper fence; feedback puede explicitar por qué la máscara bilateral sigue siendo obligatoria.

---

## Residual risks

1. **Nombre de archivo vs. contenido:** `s16-wxpython-gui.ts` / id `wxpython-gui` vs. título de calidad de datos — no es gap de ejercicio, pero puede confundir al Fixer o a búsquedas; no cambiar id en round de pedagogía salvo que el orchestrator lo pida.  
2. **Instruction actual ya densa:** al añadir preamble hay riesgo de **duplicar** pass/constraints; el Fixer debe **mover** éxito y límites al preamble y dejar instruction como pasos (spec §4).  
3. **Hints casi-solución en E1:** aceptables en guided, pero si se copian al preamble se pierde faded worked example; no reutilizar hints como prose de preamble.  
4. **You Do sin solution canónica en source:** retrospective debe anclarse a asserts del starter y a la tabla de aceptación, no inventar un `rows_clean` numérico rígido más allá de `>= 2` quarantine.  
5. **Falsos positivos de “todo P0”:** el código es maduro; el riesgo real es que el Fixer reescriba starters/oracles “por claridad”. **Prohibido** salvo justificación execute-and-diff: outputs actuales son el contrato de tests del curso.  
6. **Prosa PE:** términos fail-closed, quarantine, audit trail ya se glosan en theory; en preambles propuestos se mantienen con ancla de negocio (operador, KPI, S17).

---

## Counts summary

| Tipo | N | Con preamble hoy | Con retrospective hoy | Con title hoy |
|------|---|------------------|----------------------|---------------|
| iDo | 8 | 0 | 0 | N/A |
| weDo | 24 | 0 | 0 | 0 |
| youDo | 1 | N/A (usa context) | 0 | 1 (title de proyecto) |

**Hallazgo central:** S16 tiene un **hilo de quality gate de clase portfolio** (DEFECT bien diseñados, outputs estables, fade real E1→E3, You Do con tabla de aceptación). Lo que falta para true newbie es el andamiaje verbal Gradual Release: **preamble → tarea → retrospective** en cada unidad, y **title** corto en We Do.

---

Section 16 exercise pedagogy review complete. Ready for the Fixer prompt.
