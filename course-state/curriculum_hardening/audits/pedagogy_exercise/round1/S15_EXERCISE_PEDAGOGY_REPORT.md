# S15 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Pandas: ingesta, selección y tipos
- **shortTitle:** Pandas ingesta
- **id:** `stdlib-deep`
- **index:** 15
- **source:** `src/lib/course/sections/s15-stdlib-deep.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S15-T1-A Series/DF/Index · T1-B parser CSV/Excel · T2-A loc/iloc/assign · T2-B chained assignment/copy · T3-A strings/nullable/fechas/category · T3-B schema/coerción · T4-A export CSV/Excel/contrato · T4-B manifest/memoria/hash
- **hilo de caso:** retailer peruano sintético (Lima/Arequipa/Cusco, ids `C00x`/`T00x`, montos PEN) · incremento **CP-N2-A** (ingesta tipada + reporte de coerciones + manifest con provenance)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s15-stdlib-deep.ts` (iDo ~337–594, weDo ~597–1452, youDo ~1455–1603).
- Contrastado con el hilo de la sección: fixtures sintéticos sin PII, fail-closed si falta columna del schema, `errors='coerce'` con conteo, `index=False` al exportar, hash del payload CSV (no del `repr`).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S15 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y **clara** (qué hace la demo); no sustituye preamble formal de “qué observar antes de correr” |
| I Do `why` | Presente pero **corto** (1 frase; bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 — …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — Concepto.** Fixture… Salida esperada…”. Meta + éxito + a veces paso mezclados; legible para quien ya domina pandas, **opaco** para newbie sin escena de CP-N2-A |
| We Do `feedback` | Una línea; nombra el síntoma, poco *razonamiento* del error típico |
| Starter `# Error a corregir:` | **Excelente** hábito en casi todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable); E2/E3 a veces spoiling de API exacta |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con `_run_tests()` **sólidos** |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y hilo sintético; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (defectos nombrados, outputs canónicos, fade real de skill E1→E3, fixtures de LatAm con `;` y decimal coma, `SIN_DATO` para delta de coerción) es maduro y alineado a CP-N2-A. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en la ingesta del retailer, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: set_index → acceso por etiqueta → alineación con `add`; T1-B: na_values → parse_dates → CSV latino+usecols; T3-B: delta isna → KeyError faltante → dtype string). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S15-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de DataFrame con `set_index('cliente_id')` y lectura `loc['C002']`. La `description` nombra el objetivo, pero no hay `preamble` que diga *qué observar* (nombre del index, lista de ids, región/score de C002) ni `retrospective` que cierre el misconception “el index es solo decoración”. El `why` es una frase y no alcanza el piso del spec.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de unir clientes y transacciones, el analista necesita un **Index de negocio estable**, no solo filas en orden 0, 1, 2. En esta demo un DataFrame sintético (C001/C002/C003, Lima/Arequipa/Cusco) pone `cliente_id` como index y tipa `score` a float64. No escribas aún: predice el nombre del index, la lista de ids y el par región/score de `C002`, luego compara con la salida. Si confundes etiqueta con posición, el pipeline de calidad miente cuando reordenas filas.
- **Proposed instruction/description improvements:**  
  Mantener description actual. Ampliar `why` (~50–70 palabras): `set_index` fija la identidad de negocio; `loc['C002']` lee por etiqueta, no por orden; sin eso alinear tablas es adivinar. Puente a We Do: practicar set_index, acceso por etiqueta y alineación de Series.
- **Proposed retrospective:**  
  Si puedes explicar por qué `loc['C002']` no es lo mismo que “la segunda fila” sin mirar el código, ya tienes el hábito de Index de negocio. El error clásico es exportar y perder la clave. En We Do T1-A practicarás set_index, Series por etiqueta y suma alineada.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto y alineado a theory T1-A.

---

### S15-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter imprime `columns` en vez del index. Instruction nombra fixture y éxito pero mezcla meta/pasos; sin title, preamble ni retrospective. Feedback de una línea no ancla *por qué* el index importa en CP-N2-A.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Index de negocio con set_index
- **Proposed preamble:**  
  - **Contexto:** en el lote de clientes del retailer sintético, la identidad es `cliente_id`, no la posición de la fila.  
  - **Meta:** poner `cliente_id` como index e imprimir la lista de etiquetas.  
  - **Éxito:** con el fixture del starter, `print(df.index.tolist())` muestra `['C001', 'C002']`.  
  - **Límites:** no borres los datos del starter; no uses joins ni validaciones de calidad avanzadas.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `columns` (DEFECT: falta `set_index`).  
  2. Aplica `set_index('cliente_id')` al DataFrame.  
  3. Imprime solo `df.index.tolist()` (sin texto extra).  
  4. Verifica que la salida sea `['C001', 'C002']`.
- **Proposed feedback improvement:**  
  Si ves nombres de columnas (`cliente_id`, `score`) en vez del index, el DataFrame aún no tiene eje de negocio: falta `set_index` antes de imprimir. Columnas e index son ejes distintos.
- **Proposed retrospective:**  
  El index estable es el puente a alinear tablas y auditar filas. No confundas “lista de columnas” con “lista de ids”. Siguiente (E2): leer un score por etiqueta, no por posición.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S15-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente (etiqueta vs. `iloc`). Instruction densa tipo mini-spec; sin escena de por qué el acceso posicional rompe al reordenar. Feedback corto pero útil (`iloc[0]` vs `C002`).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Series por etiqueta, no por posición
- **Proposed preamble:**  
  - **Contexto:** el score de un cliente se busca por id de negocio (`C002`), no por “el que quedó primero en el CSV”.  
  - **Meta:** leer el valor de la Series por etiqueta y publicarlo como float limpio.  
  - **Éxito:** imprime `0.9` (valor de `C002`); no `0.1` (primera posición).  
  - **Límites:** no uses `iloc`; conserva el fixture del starter.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: usa `s.iloc[0]` (DEFECT posicional).  
  2. Accede por etiqueta: `s['C002']` o `s.loc['C002']`.  
  3. Envuelve en `float(...)` e imprime solo ese número.  
  4. No reordenes ni reconstruyas la Series.
- **Proposed retrospective:**  
  Etiqueta ≠ posición: si reordenas filas, `iloc[0]` cambia y `C002` no. Ese hábito evita off-by-one en pipelines con Index de negocio. Luego (E3) la alineación de dos Series pone a prueba el mismo eje.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1 en instrucción propuesta; éxito observable intacto.

---

### S15-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a alineación de Index con `add(..., fill_value=0)`. Starter deja NaN con `+`. Instruction ya nombra el patrón; falta anclar *por qué* no es un join de tablas y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Alinear Series con add y fill_value
- **Proposed preamble:**  
  - **Contexto:** dos extractos parciales de score se suman por **etiqueta** de cliente; no es un join de DataFrames (eso llega después).  
  - **Meta:** sumar alineando índices y rellenar huecos con 0.  
  - **Éxito:** tras `sort_index()`, el dict redondeado es `{'C001': 1.0, 'C002': 2.5}`.  
  - **Límites:** no uses merge/join de tablas; no inventes filas a mano.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `s1 + s2` deja NaN en `C001`.  
  2. Reemplaza por `s1.add(s2, fill_value=0)`.  
  3. Ordena con `sort_index()` y redondea a 2 decimales.  
  4. Imprime el dict (sin texto extra).
- **Proposed retrospective:**  
  La alineación por Index es el mismo principio que unir tablas por clave, pero en Series. El error clásico es aceptar NaN “porque el operador + lo hizo”. Pregunta de cierre: ¿qué valor debería tener un cliente que solo aparece en una de las dos Series si el negocio dice “cero si falta”? Puente a T1-B: leer el CSV ya con dtypes.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; no clona E1/E2.

---

### S15-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example excelente de CSV latino (`;`, decimal coma) con dtype string, parse_dates y na_values. Description rica; falta preamble que diga *qué contar* (3 filas, 1 nulo en monto, dtype de fecha) y retrospective del misconception “el parser adivina el decimal”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En retail y banca de LatAm el CSV a menudo llega con `;` y montos `15,50`. Si lees como si el decimal fuera punto, el monto se vuelve basura o texto. En esta demo un extracto sintético declara `sep`, `decimal`, `dtype` de `cliente_id`, `parse_dates` y `na_values` para celdas vacías. No escribas aún: predice filas, cuántos nulos en `monto` y el dtype de `fecha`, luego compara con la salida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: cada parámetro es un contrato de archivo; `decimal=','` es idiomático frente a `.replace` manual; sin `parse_dates` las fechas rompen filtros temporales. Puente a We Do: na_values del proveedor, fechas y CSV latino+usecols.
- **Proposed retrospective:**  
  Si puedes explicar por qué `15,50` sin `decimal=','` no es 15.5, ya internalizaste el contrato del parser. El error clásico es “arreglar” el archivo a mano y perder trazabilidad. We Do T1-B practica na_values, parse_dates y usecols.
- **Code/output changes:** none
- **Validation notes:** Output `3 1` / `datetime64[ns]` / ids correcto.

---

### S15-T1-B-E1 (weDo, guided)
- **Diagnosis:** Drill guiado de `na_values=['SIN_DATO']` bien motivado (token del proveedor, no default de pandas). Instruction densa; sin title/preamble/retrospective. Feedback correcto pero corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** na_values del proveedor al leer CSV
- **Proposed preamble:**  
  - **Contexto:** el proveedor marca montos faltantes con `SIN_DATO`, un token **propio** que no es nulo por defecto en `read_csv`.  
  - **Meta:** declarar ese marcador al leer e informar cuántos nulos hay en `b`.  
  - **Éxito:** imprime `1` (un nulo en la columna `b`).  
  - **Límites:** no reescribas el CSV a mano; no uses el default de `NA` como atajo de este ejercicio.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: lee sin `na_values` y `isna` da 0.  
  2. Pasa `na_values=['SIN_DATO']` a `read_csv`.  
  3. Imprime `int(df['b'].isna().sum())`.  
  4. Verifica salida `1`.
- **Proposed feedback improvement:**  
  Sin `na_values`, `'SIN_DATO'` es texto y `isna` no lo ve. Decláralo en el parser y vuelve a contar. No confíes en `NA` del default para practicar este contrato.
- **Proposed retrospective:**  
  Distingue nulos del parser (tokens por defecto) de marcadores del proveedor. Ese hábito alimenta el reporte de calidad. Siguiente (E2): tipar fechas en la lectura.
- **Code/output changes:** none
- **Validation notes:** DEFECT pedagógico limpio; fixture mínimo suficiente.

---

### S15-T1-B-E2 (weDo, independent)
- **Diagnosis:** Foco independiente en `parse_dates`. Instruction telegráfica; no ancla el costo de fechas como string en filtros temporales del pipeline. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** parse_dates al ingerir la fecha
- **Proposed preamble:**  
  - **Contexto:** si `fecha` queda como texto, los filtros temporales y el orden cronológico fallan en silencio o con errores confusos.  
  - **Meta:** tipar la columna en la lectura con `parse_dates`.  
  - **Éxito:** `str(df['fecha'].dtype)` imprime `datetime64[ns]`.  
  - **Límites:** no conviertas después con un bucle manual; declara el contrato en `read_csv`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: lee sin `parse_dates` (dtype object/string).  
  2. Añade `parse_dates=['fecha']`.  
  3. Imprime `str(df['fecha'].dtype)`.  
  4. Confirma `datetime64[ns]`.
- **Proposed retrospective:**  
  Tipar en la ingesta es más barato que “arreglar” después. El error clásico es confiar en un `head()` bonito con strings de fecha. Luego (E3) el CSV latino combina sep, decimal y usecols.
- **Code/output changes:** none
- **Validation notes:** Independiente y acotado; output estable.

---

### S15-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia fuerte al CSV latino + `usecols` (superficie nueva, mismo principio de contrato de parser). Starter omite decimal y usecols. Instruction ya prohíbe `.replace` manual — bien. Falta escena de “columna basura z” y cierre.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** CSV latino con decimal y usecols
- **Proposed preamble:**  
  - **Contexto:** un extracto de retail llega con `;`, monto `15,50` y una columna basura `z` que no pertenece al schema de laboratorio.  
  - **Meta:** declarar sep, decimal y columnas útiles en el parser.  
  - **Éxito:** `monto.tolist()` es `[15.5]` (float, no texto).  
  - **Límites:** no uses `.replace(',', '.')` sobre el CSV crudo; no dejes entrar `z`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: solo `sep=';'` — el monto queda como texto.  
  2. Añade `decimal=','` y `usecols=['cliente_id', 'monto']`.  
  3. Imprime `df['monto'].tolist()`.  
  4. Verifica `[15.5]`.
- **Proposed retrospective:**  
  El contrato del archivo se declara en parámetros, no en parches de string. Pregunta de cierre: ¿qué pasa si omites `usecols` y tipas después? Puente a T2-A: ya con tabla limpia, seleccionar filas con `loc`.
- **Code/output changes:** none
- **Validation notes:** Transfer real LatAm; alineado a demo T1-B.

---

### S15-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de `loc` por región Lima + `assign` de `prioridad_revision` (etiqueta neutra de laboratorio). Description y `why` ya advierten que el score no es culpa; faltan preamble de observación y retrospective formal.
- **Checklist:** context fail · goal partial · success partial · constraints partial (nota ética en why) · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Tras ingerir, el analista filtra un subconjunto y deriva una etiqueta de **laboratorio** (prioridad de revisión), no un veredicto sobre personas. En esta demo se copian filas de Lima, se asigna `prioridad_revision` si `score < 0.5`, y se imprime el dict de ids/scores/prioridad. Observa el orden: `loc` del filtro → `copy` → `assign`. Predice quién queda en “si” antes de mirar la salida. El score sintético no es culpa ni fraude.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: un solo `loc` + `assign` deja pipelines legibles y testeables; evita `df[cols][rows]` encadenado; la etiqueta es de laboratorio. Puente a We Do: filtro inclusivo, assign y `iloc`.
- **Proposed retrospective:**  
  Si puedes decir por qué `C003` es “si” y `C001`/`C004` son “no” sin reejecutar, ya lees máscaras booleanas. We Do T2-A practica umbral inclusivo, columnas derivadas y posición con `iloc`.
- **Code/output changes:** none
- **Validation notes:** Output y nota ética alineados a jobRelevance.

---

### S15-T2-A-E1 (weDo, guided)
- **Diagnosis:** Excelente defecto pedagógico: `>` estricto excluye el borde 0.5. Instruction ya avisa del umbral; sin title/preamble/retrospective. Feedback bueno y corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Filtro inclusivo con loc y umbral
- **Proposed preamble:**  
  - **Contexto:** un gate de laboratorio marca clientes con score en o por encima del umbral 0.5.  
  - **Meta:** seleccionar con `loc` y un comparador **inclusivo**.  
  - **Éxito:** lista de `cliente_id` = `['C002']` (score exacto 0.5 no se cae).  
  - **Límites:** no uses solo `iloc` posicional; no mutes el DF.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: usa `score > 0.5` y sale `[]`.  
  2. Cambia a `>= 0.5` dentro de `loc`.  
  3. Selecciona la columna `cliente_id` y `tolist()`.  
  4. Imprime solo esa lista.
- **Proposed feedback improvement:**  
  Con score 0.5 en el borde, `>` excluye a C002 y devuelve lista vacía. Si el umbral del negocio es inclusivo, usa `>=`. El bug no es “pandas raro”: es el comparador.
- **Proposed retrospective:**  
  Umbral inclusivo vs. estricto es un error de negocio disfrazado de off-by-one. Siguiente (E2): derivar columnas con `assign` sin mutar a ciegas.
- **Code/output changes:** none
- **Validation notes:** Fixture de borde intencional; no tocar scores.

---

### S15-T2-A-E2 (weDo, independent)
- **Diagnosis:** Foco en `assign` vs. mutación in-place con factor incorrecto (`*1`). Instruction clara; sin escena de por qué `assign` encaja en pipelines. Feedback nombra el fix.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Columna derivada con assign
- **Proposed preamble:**  
  - **Contexto:** en un pipeline legible, las columnas derivadas se construyen sin ensuciar el DF original como paso obligatorio.  
  - **Meta:** crear `doble = score * 2` con `assign` e imprimir la lista.  
  - **Éxito:** `[2.0, 4.0]`.  
  - **Límites:** no dejes el factor `*1`; prefiere `assign` sobre mutación opaca.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: multiplica por 1 e in-place.  
  2. Usa `df.assign(doble=lambda x: x['score'] * 2)`.  
  3. Selecciona `['doble']` y `tolist()`.  
  4. Imprime solo esa lista.
- **Proposed retrospective:**  
  `assign` devuelve un objeto nuevo y hace la intención visible en una línea. El error clásico es mutar in-place con la fórmula incorrecta y no notar el factor. Luego (E3): posición pura con `iloc`.
- **Code/output changes:** none
- **Validation notes:** Independiente; solution idiomática.

---

### S15-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `iloc` (superficie posicional, mismo tema de selección). Starter usa `loc[0,0]`. Instruction mínima; falta anclar cuándo sí quieres posición (matriz 2×2 sin Index de negocio).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Celda por posición con iloc
- **Proposed preamble:**  
  - **Contexto:** a veces el contrato es **posición** (fila 1, columna 0 de una grilla), no etiqueta de cliente.  
  - **Meta:** leer con `iloc` la celda inferior izquierda del DF 2×2.  
  - **Éxito:** imprime `3`.  
  - **Límites:** no uses `loc` (etiquetas); índices base 0, no 1-based.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `loc[0, 0]` devuelve 1.  
  2. Cambia a `iloc[1, 0]`.  
  3. Envuelve en `int(...)` e imprime.  
  4. No reindexes el DataFrame.
- **Proposed retrospective:**  
  `loc` = etiqueta; `iloc` = posición. Confundirlos es el off-by-one clásico cuando el Index ya no es 0..n-1. Pregunta: si el index fuera `cliente_id`, ¿`iloc[1]` seguiría siendo “el segundo cliente”? Puente a T2-B: mutar con seguridad.
- **Code/output changes:** none
- **Validation notes:** Transfer limpio; fixture numérico abstracto OK.

---

### S15-T2-B-DEMO (iDo)
- **Diagnosis:** Demo correcta de `loc` sobre el padre + subset con `.copy()` y `owner`. Description nombra el patrón; faltan preamble de “qué no hacer” (cadena) y retrospective del bug de export que pierde el flag.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En pipelines de ingesta, el bug clásico es asignar en cadena (`df[mask]['col'] = ...`): en pantalla el flag parece seteado y al exportar desaparece. En esta demo se marca `estado='revisar'` con un solo `loc` sobre el original, se materializa un subset con `.copy()`, se añade `owner` y se imprimen ambos. Observa que el padre no tiene `owner` y el subset sí. No escribas aún; sigue el flujo seguro.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: un solo `loc` sobre el padre actualiza de forma fiable; `.copy()` declara independencia del subset; chained assignment nunca es el contrato profesional (Copy-on-Write lo hace más determinista, no más “mágico”).
- **Proposed retrospective:**  
  Si puedes explicar por qué `C002` no tiene `estado` y por qué mutar el subset no inventa `owner` en el padre, ya separaste mutación del original vs. trabajo en copia. We Do T2-B practica loc, copy y aislamiento.
- **Code/output changes:** none
- **Validation notes:** Output con nan en estado alineado a theory.

---

### S15-T2-B-E1 (weDo, guided)
- **Diagnosis:** Guiado a asignar `flag` con `loc` y normalizar NaN al imprimir. Starter no asigna la columna. Instruction clara; sin escena del ticket de calidad que regresa. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Asignar flag con un solo loc
- **Proposed preamble:**  
  - **Contexto:** el pipeline debe marcar scores bajos en el **DataFrame original**, no en un fantasma de vista.  
  - **Meta:** donde `score < 0.5`, asignar `flag = 'x'` con un solo `loc`.  
  - **Éxito:** `flag.fillna('').tolist()` es `['x', '']`.  
  - **Límites:** no uses `df[df...]['flag'] = ...` en cadena; normaliza NaN solo al imprimir.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: no existe `flag` (imprime vacíos).  
  2. Asigna con `df.loc[df['score'] < 0.5, 'flag'] = 'x'`.  
  3. Imprime `df['flag'].fillna('').tolist()`.  
  4. Verifica `['x', '']`.
- **Proposed feedback improvement:**  
  Asigna con `loc` sobre el original: una sola indexación en la asignación. Luego normaliza NaN con `fillna('')` solo para el print limpio, no para “inventar” datos de negocio.
- **Proposed retrospective:**  
  Un solo `loc` es el patrón seguro de mutación del padre. El error clásico es la cadena que no escribe. Siguiente (E2): copiar el subset antes de mutarlo.
- **Code/output changes:** none
- **Validation notes:** DEFECT y solución alineados.

---

### S15-T2-B-E2 (weDo, independent)
- **Diagnosis:** Independiente sobre `.copy()` antes de mutar el subset. Instruction menciona SettingWithCopy; sin preamble de “vida propia del subset”. Feedback telegráfico.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** copy antes de mutar el subset
- **Proposed preamble:**  
  - **Contexto:** a veces el subset viaja a otra función (revisión DQ) y necesita columnas propias sin tocar el padre.  
  - **Meta:** filtrar, materializar con `.copy()`, añadir `ok=True` e imprimir.  
  - **Éxito:** lista de `ok` = `[True, True]`.  
  - **Límites:** no mutes el slice sin `.copy()`; conserva el filtro `score > 0.5`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `sub = df.loc[...]` sin `.copy()`.  
  2. Encadena `.copy()` tras el `loc`.  
  3. Asigna `sub['ok'] = True`.  
  4. Imprime `sub['ok'].tolist()`.
- **Proposed retrospective:**  
  `.copy()` declara independencia: el subset tiene vida propia. Sin eso, el warning o la mutación fantasma regresan en producción. Luego (E3): demostrar aislamiento mutando la copia y leyendo el original.
- **Code/output changes:** none
- **Validation notes:** Independiente; solution canónica.

---

### S15-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer metacognitivo excelente: `c = df` vs `df.copy()`. Instruction y feedback ya enseñan identidad de objetos. Falta title/preamble/retrospective formales.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Aislar mutación con df.copy
- **Proposed preamble:**  
  - **Contexto:** en un code review te piden probar que mutar un “working set” no corrompe el dataset exportable.  
  - **Meta:** crear una copia real, mutarla, e imprimir los scores del **original**.  
  - **Éxito:** `[1.0, 2.0]` (el original intacto).  
  - **Límites:** no uses `c = df` (alias); imprime el original, no la copia.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `c = df` comparte identidad.  
  2. Cambia a `c = df.copy()`.  
  3. Muta `c` (p. ej. `iloc[0, 0] = 99.0`).  
  4. Imprime `df['score'].tolist()` del original.
- **Proposed retrospective:**  
  Alias (`c = df`) no es copia. Si el original cambió, no tenías aislamiento. Pregunta de cierre: ¿qué imprimirías para demostrar que la copia sí cambió? Puente a T3-A: tipar columnas sin esconder basura.
- **Code/output changes:** none
- **Validation notes:** Transfer conceptual fuerte; no clona E1/E2.

---

### S15-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de normalización de región + coerce numérico/fecha con conteo de NaN. Description y why cortos; falta preamble de “cuenta fallos de conversión” y retrospective del misconception “coerce limpia el lote en silencio”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Tipar es declarar intención: región como categoría, monto como número, alta como fecha. En esta demo se normaliza `region` con `str.title()` antes de `category`, se coerciona monto y alta con `errors='coerce'`, y se **cuentan** los NaN. Observa un fallo en monto (`?`) y uno en fecha (`2024-13-01`). Predice `na_monto` y `na_alta` antes de mirar la salida. Sin conteo, coerce es una forma elegante de esconder basura.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: title evita categorías duplicadas lima/Lima; coerce prefiere NaN contable a tumbar el lote; el conteo es evidencia de calidad. Puente a We Do: category, to_numeric y to_datetime.
- **Proposed retrospective:**  
  Si puedes decir por qué hay 1 NaN en monto y 1 en alta sin reejecutar, ya separas fallo de conversión de “dato bueno”. We Do T3-A practica cada conversión por separado.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T3-A.

---

### S15-T3-A-E1 (weDo, guided)
- **Diagnosis:** Guiado title + category. Instruction telegráfica; no ancla el costo de categorías duplicadas por casing. Feedback de una línea.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Región normalizada a category
- **Proposed preamble:**  
  - **Contexto:** “lima” y “Lima” no deben ser dos categorías distintas en un reporte de regiones.  
  - **Meta:** normalizar con `str.title()` y castear a `category`.  
  - **Éxito:** `dtype.name` imprime `category`.  
  - **Límites:** no dejes `object`; title **antes** del astype.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime el dtype crudo (`object`).  
  2. Encadena `.str.title().astype('category')` sobre la serie.  
  3. Imprime `s.dtype.name`.  
  4. Verifica `category`.
- **Proposed feedback improvement:**  
  Sin `title`, las mayúsculas inconsistentes duplican categorías. Sin `astype('category')`, el dtype sigue siendo object. Encadena ambos en ese orden.
- **Proposed retrospective:**  
  Normalizar texto antes de category es higiene de schema. Siguiente (E2): convertir montos basura a NaN contable.
- **Code/output changes:** none
- **Validation notes:** DEFECT y solution correctos.

---

### S15-T3-A-E2 (weDo, independent)
- **Diagnosis:** Independiente `to_numeric` con coerce. Starter con try/except enseña el fallo sin coerce. Instruction densa; sin preamble de “no tumbar el lote”. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** to_numeric con errors coerce
- **Proposed preamble:**  
  - **Contexto:** un monto inválido (`'a'`) no debe tumbar todo el lote si el contrato permite NaN contable.  
  - **Meta:** convertir con `errors='coerce'` e imprimir la lista.  
  - **Éxito:** `[1.0, nan, 3.0]`.  
  - **Límites:** no uses `errors='raise'` ni conviertas a int a la fuerza.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: sin coerce falla o no produce NaN.  
  2. Llama `pd.to_numeric(..., errors='coerce')`.  
  3. Imprime `s.tolist()`.  
  4. Confirma el NaN en la posición del `'a'`.
- **Proposed retrospective:**  
  Coerce sin conteo es ocultar basura; aquí el NaN visible es el primer paso del reporte. Luego (E3): el mismo principio en fechas con NaT.
- **Code/output changes:** none
- **Validation notes:** Independiente; output canónico estable.

---

### S15-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `to_datetime` + conteo de NaT. Starter usa `errors='ignore'`. Instruction y feedback ya contrastan ignore vs coerce. Faltan title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Fechas inválidas a NaT contable
- **Proposed preamble:**  
  - **Contexto:** una fecha basura (`no-fecha`) debe volverse NaT y contarse, no quedarse como string opaco.  
  - **Meta:** parsear con `errors='coerce'` e imprimir cuántos NaT hay.  
  - **Éxito:** imprime `1`.  
  - **Límites:** no uses `errors='ignore'`; cuenta con `isna`, no con `len` del series entero.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `errors='ignore'` no deja NaT contable de forma fiable.  
  2. Cambia a `errors='coerce'`.  
  3. Imprime `int(s.isna().sum())`.  
  4. Verifica `1`.
- **Proposed retrospective:**  
  NaT contable es el gemelo del NaN numérico en el reporte de calidad. Pregunta: ¿por qué `ignore` es peligroso en un pipeline auditado? Puente a T3-B: schema + reporte `{columna: n_fallos}`.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; no clona E2.

---

### S15-T3-B-DEMO (iDo)
- **Diagnosis:** Demo estrella de la sección: `apply_schema` con KeyError fail-closed, delta isna y reporte por columna. Description y why sólidos pero cortos; falta preamble de contrato `(df, report)` y retrospective hacia You Do.
- **Checklist:** context fail · goal partial · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El schema es el acuerdo entre el dueño del dato y el pipeline: columna → tipo. En esta demo una función aplica string/float/datetime, **falla en voz alta** si falta una columna, y emite `report` con fallos nuevos de coerción (`monto: 1`, `fecha: 1`). Sigue el bucle por el schema y predice dtypes y reporte antes de mirar la salida. En CP-N2-A este par `(df, report)` viaja junto al DataFrame, no en un mensaje de chat.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: delta isna aísla coerciones nuevas de nulos del parser; tipos no soportados → TypeError; faltante → KeyError. Puente a We Do y al You Do de dos tablas.
- **Proposed retrospective:**  
  Si puedes explicar por qué el reporte de `cliente_id` es 0 y el de `monto` es 1, ya entiendes “fallo de conversión vs. nulo previo”. We Do T3-B practica delta, fail-closed y dtype string.
- **Code/output changes:** none
- **Validation notes:** Función demo alineada a You Do; no tocar outputs.

---

### S15-T3-B-E1 (weDo, guided)
- **Diagnosis:** Guiado al delta de isna tras `to_numeric`. Starter calcula delta sin convertir. Instruction clara; sin escena de por qué el delta importa en el report. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar coerciones nuevas en monto
- **Proposed preamble:**  
  - **Contexto:** el reporte de calidad necesita **cuántos** valores se volvieron NaN por la conversión, no solo “hay nulos”.  
  - **Meta:** aplicar `to_numeric` con coerce y reportar el delta isna.  
  - **Éxito:** imprime `1` (el `'x'`).  
  - **Límites:** resta isna después − antes; no rellenes con 0.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: guarda `before` pero no convierte.  
  2. Asigna `df['monto'] = pd.to_numeric(..., errors='coerce')`.  
  3. Imprime `int(df['monto'].isna().sum() - before)`.  
  4. Verifica `1`.
- **Proposed feedback improvement:**  
  Sin `to_numeric`, el delta es 0 aunque haya basura en texto. Convierte, luego resta isna anterior del posterior: ese entero es la entrada del `coercion_report`.
- **Proposed retrospective:**  
  El delta es honestidad de métrica: nulos del parser ≠ fallos de conversión. Siguiente (E2): si falta la columna del schema, no inventes defaults.
- **Code/output changes:** none
- **Validation notes:** Fixture `["1","x"]` ideal para delta=1.

---

### S15-T3-B-E2 (weDo, independent)
- **Diagnosis:** Independiente fail-closed con KeyError → print `missing`. Instruction y starter claros; sin preamble de “no rellenar ceros para que corra”. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Schema fail-closed si falta columna
- **Proposed preamble:**  
  - **Contexto:** el schema exige `monto`, pero el extracto solo trae `cliente_id`. Inventar la columna con ceros es una mentira de pipeline.  
  - **Meta:** validar columnas del schema y, si falta, fallar de forma explicable.  
  - **Éxito:** imprime `missing` (capturando KeyError).  
  - **Límites:** no crees `monto` vacío ni imprimas `ok`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `ok` sin validar.  
  2. Recorre las claves del schema; si la columna no está, `raise KeyError`.  
  3. En `except KeyError`, imprime `missing`.  
  4. No inventes la columna.
- **Proposed retrospective:**  
  Fail-closed = el contrato habla antes que el dashboard. El error clásico es “rellenar para que pase el test”. Luego (E3): tipar ids a dtype `string` de pandas (no object).
- **Code/output changes:** none
- **Validation notes:** Independiente; alineado a demo y You Do.

---

### S15-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a dtype `string` de pandas vs. `object`. Instruction ya nombra el contrato; feedback correcto. Faltan title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Ids como dtype string de pandas
- **Proposed preamble:**  
  - **Contexto:** el schema de CP-N2-A declara `cliente_id: string`; el default de Series de texto suele ser `object`.  
  - **Meta:** castear a dtype `string` de pandas e imprimir `str(dtype)`.  
  - **Éxito:** imprime `string`.  
  - **Límites:** no dejes `object`; no uses `category` para ids casi únicos.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: imprime el dtype por defecto (`object`).  
  2. Aplica `astype('string')`.  
  3. Imprime `str(s.dtype)`.  
  4. Verifica `string`.
- **Proposed retrospective:**  
  `string` nullable es el contrato tipado; `object` es el default opaco. Pregunta: ¿por qué no castear ids únicos a category “por costumbre”? Puente a T4-A: exportar sin perder el mapa de columnas.
- **Code/output changes:** none
- **Validation notes:** Transfer de dtype; no clona E1/E2.

---

### S15-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de round-trip CSV + Excel en memoria + contrato de dtypes. Description completa; faltan preamble de `index=False` y openpyxl, y retrospective de dependencias honestas.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Exportar es materializar el dataset analítico sin inventar columnas. En esta demo se escribe CSV con `index=False`, se relee y se **assert** de columnas críticas; se escribe Excel en `BytesIO` con `openpyxl`; se emite un dict de dtypes (contrato estilo Parquet sin motor). Observa `rows`, `excel_ok` y `contract`. Predice si el round-trip conserva `cliente_id`/`monto`/`region`. Sin `openpyxl` el tramo Excel no arranca: es dependencia de entorno, no fallo de lógica.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `index=False` evita `Unnamed: 0`; el assert de columnas es la prueba mínima de export; el dict de dtypes documenta el contrato aunque no haya pyarrow.
- **Proposed retrospective:**  
  Si puedes explicar por qué el assert de columnas va **después** del re-read, ya tienes el hábito de round-trip. We Do T4-A practica CSV, Excel y contrato de dtypes por separado.
- **Code/output changes:** none
- **Validation notes:** Depende de openpyxl en el entorno de demos (ya documentado en theory).

---

### S15-T4-A-E1 (weDo, guided)
- **Diagnosis:** Guiado a `index=False` en round-trip CSV. Starter usa default de index. Instruction y feedback claros; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** CSV round-trip sin columna Unnamed
- **Proposed preamble:**  
  - **Contexto:** al reingestar un CSV exportado con index por defecto suele aparecer una columna basura (`Unnamed: 0`).  
  - **Meta:** exportar con `index=False`, releer e imprimir columnas.  
  - **Éxito:** `['a', 'b']`.  
  - **Límites:** no omitas `seek(0)`; no uses index=True “por costumbre”.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `to_csv(buf)` sin `index=False`.  
  2. Pasa `index=False`.  
  3. `seek(0)`, `read_csv`, imprime `columns.tolist()`.  
  4. Verifica `['a', 'b']`.
- **Proposed feedback improvement:**  
  Sin `index=False`, el index se escribe y al releer contamina el schema. Usa `index=False` y `seek(0)` para reposicionar el buffer en memoria.
- **Proposed retrospective:**  
  Round-trip de columnas es la prueba mínima de export. Siguiente (E2): Excel en memoria con openpyxl.
- **Code/output changes:** none
- **Validation notes:** Guiado limpio; output estable.

---

### S15-T4-A-E2 (weDo, independent)
- **Diagnosis:** Independiente Excel/`BytesIO`. Starter deja buffer vacío. Instruction advierte dependencia openpyxl; sin preamble de “bytes no vacíos = export real”. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Excel en memoria con openpyxl
- **Proposed preamble:**  
  - **Contexto:** a veces el entregable del stakeholder es Excel; el test de humo es “hay bytes en el buffer”.  
  - **Meta:** escribir un DF a `BytesIO` con `to_excel` e `engine='openpyxl'`.  
  - **Éxito:** imprime `True` (`len(getvalue()) > 0`).  
  - **Límites:** requiere `openpyxl` instalado; no escribas a disco obligatorio.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime sobre buffer vacío.  
  2. Llama `to_excel(bio, index=False, engine='openpyxl')` con un DF mínimo.  
  3. Imprime `len(bio.getvalue()) > 0`.  
  4. Si falta openpyxl, instálalo o documenta el límite (no finjas éxito).
- **Proposed retrospective:**  
  Un BytesIO vacío no es un export. La honestidad de dependencias es parte de la calidad. Luego (E3): emitir el contrato de dtypes sin motor Parquet.
- **Code/output changes:** none
- **Validation notes:** Independiente; dependencia ya en theory/callout.

---

### S15-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a dict `{col: str(dtype)}` ordenado. Starter deja contract vacío. Instruction clara; sin escena de “schema JSON cuando no hay Parquet”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Contrato de dtypes por columna
- **Proposed preamble:**  
  - **Contexto:** si el entorno no tiene motor Parquet, un dict columna→dtype es el contrato de tipos que acompaña al CSV.  
  - **Meta:** construir `{col: str(dtype)}` e imprimirlo ordenado por clave.  
  - **Éxito:** `{'cliente_id': 'object', 'monto': 'float64'}`.  
  - **Límites:** no dejes el dict vacío; usa `str(dtype)`, no el objeto dtype crudo sin convertir.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `contract = {}`.  
  2. Llena con comprehension sobre `df.columns`.  
  3. Imprime `dict(sorted(contract.items()))`.  
  4. Verifica el mapa del fixture.
- **Proposed retrospective:**  
  El contrato de dtypes es la mitad del manifest (la otra es provenance/hash). Pregunta: ¿por qué ordenar al imprimir ayuda al assert? Puente a T4-B: filas, memoria y hash del artefacto.
- **Code/output changes:** none
- **Validation notes:** Transfer de serialización de schema; outputs fijos.

---

### S15-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de manifest JSON con rows/columns/dtypes/memory/source/hash truncado. Description y why buenos pero cortos; falta preamble de “hashea el payload, no el repr” y retrospective hacia CP-N2-A.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Sin manifest no hay reconciliación de ingesta: no sabes si el CSV de “esta mañana” es el de ayer. En esta demo se serializa con `to_csv(index=False)`, se hashea el **mismo** blob, y se emite un JSON con filas, columnas, dtypes, memoria, `source` y `content_sha256` corto. Observa `sort_keys=True` en el dump. Predice `rows=3` y que el hash no es el del `repr` del DataFrame. Ese JSON es evidencia auditable para CP-N2-A.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: hashear el payload exportado (no `str(df)`) hace el hash estable entre corridas; `memory_usage(deep=True)` no subestima strings; `source` es provenance mínima.
- **Proposed retrospective:**  
  Si puedes explicar por qué el hash debe salir del CSV y no del display, ya tienes provenance profesional. We Do T4-B practica memoria, manifest mínimo y hash truncado.
- **Code/output changes:** none
- **Validation notes:** Hash canónico fijo en output; no cambiar fixture.

---

### S15-T4-B-E1 (weDo, guided)
- **Diagnosis:** Guiado a `memory_usage(deep=True)`. Starter imprime `False` fijo. Instruction y feedback correctos; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Memoria real con deep True
- **Proposed preamble:**  
  - **Contexto:** al castear a `category`/`string` en datasets grandes, necesitas medir memoria **real** de object/string.  
  - **Meta:** calcular `memory_usage(deep=True).sum()` y decir si es `> 0`.  
  - **Éxito:** imprime `True`.  
  - **Límites:** no imprimas un booleano fijo; `deep=True` importa para strings.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `False` sin medir.  
  2. Calcula `int(df.memory_usage(deep=True).sum()) > 0`.  
  3. Imprime ese booleano.  
  4. Verifica `True` con el fixture de strings.
- **Proposed feedback improvement:**  
  Un booleano hardcodeado no es una medición. `deep=True` cuenta el contenido de object/string; sin él subestimas el costo real de columnas de texto.
- **Proposed retrospective:**  
  Medir antes/después de castear es el hábito de optimización honesta. Siguiente (E2): armar el manifest mínimo de filas y columnas.
- **Code/output changes:** none
- **Validation notes:** Guiado; no requiere valor exacto de bytes (solo > 0).

---

### S15-T4-B-E2 (weDo, independent)
- **Diagnosis:** Independiente manifest `rows`/`columns`. Starter con 0 y []. Instruction clara; sin escena de reconciliación de ingesta. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Manifest mínimo de filas y columnas
- **Proposed preamble:**  
  - **Contexto:** el primer chequeo de reconciliación es “¿cuántas filas salieron y con qué columnas?”.  
  - **Meta:** construir un dict `rows`/`columns` desde el DF e imprimir ambos.  
  - **Éxito:** `3 ['a']`.  
  - **Límites:** no dejes ceros/listas vacías; `columns` debe ser lista, no Index crudo sin convertir.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `rows=0`, `columns=[]`.  
  2. Asigna `len(df)` y `df.columns.tolist()`.  
  3. Imprime `manifest['rows']` y `manifest['columns']`.  
  4. Verifica `3 ['a']`.
- **Proposed retrospective:**  
  Filas y columnas son el esqueleto del manifest; el hash y el source completan la provenance. Luego (E3): hashear el artefacto exportado.
- **Code/output changes:** none
- **Validation notes:** Independiente; alineado a You Do `reconcile`/`export_with_manifest`.

---

### S15-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer fuerte: SHA-256 de `to_csv(index=False)` vs. `str(df)`. Instruction y feedback ya contrastan. Faltan title/preamble/retrospective formales. Output canónico `309b0e45` debe preservarse.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Hash del CSV exportado
- **Proposed preamble:**  
  - **Contexto:** el hash del artefacto detecta si el archivo cambió entre corridas; hashear el `repr` del DataFrame no sirve (el display cambia con opciones).  
  - **Meta:** hashear los bytes de `to_csv(index=False)` e imprimir los primeros 8 hex.  
  - **Éxito:** `309b0e45`.  
  - **Límites:** no hashees `str(df)`; codifica a bytes con `.encode()`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `sha256(str(df).encode())`.  
  2. Serializa `blob = df.to_csv(index=False).encode()`.  
  3. Imprime `hashlib.sha256(blob).hexdigest()[:8]`.  
  4. Verifica `309b0e45`.
- **Proposed retrospective:**  
  Provenance = source + filas + hash del **mismo** payload que entregas. Pregunta de cierre: ¿por qué `index=False` también importa para el hash? Puente al You Do: dos tablas, reportes y manifests auditable.
- **Code/output changes:** none (preservar fixture y hash canónico)
- **Validation notes:** Transfer auténtico; no alterar el DF del starter.

---

### S15-YouDo (youDo)
- **Diagnosis:** Marco de proyecto **fuerte**: context de retailer sintético, objectives CP-N2-A, requirements de cuatro funciones, fixtures `SIN_DATO` para delta de coerción, `_run_tests()` con fail-closed, rubric y portfolioNote. Falta únicamente el campo `retrospective` de cierre metacognitivo / defensa oral que el spec exige para You Do. Un newbie puede implementar y aún no articula “qué invariante demuestro” ni “qué haría con datos reales vs. sintéticos”.
- **Checklist:** context pass · goal pass · success pass (via tests/rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (mantener título actual del proyecto)
- **Proposed preamble:** N/A (el `context` ya cumple rol de escena; no duplicar en preamble de We Do)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/starter. Opcional menor (P2): en portfolioNote, añadir una línea que recuerde defender el delta de coerción en 30 segundos. No reescribir el starter ni los asserts.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con `_run_tests()` (filas, `report['score'|'monto'] >= 1`, KeyError si falta columna, hash del CSV)? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, encoding del proveedor, openpyxl)? (3) Escribe en el README una frase de impacto medible (antes: CSV opaco / después: schema + coercion_report + manifest) que puedas defender en 30 segundos. Recuerda: un score sintético no es culpa ni decisión sobre personas.
- **Code/output changes:** none
- **Validation notes:** Starter y asserts son el oro de la sección; solo añadir `retrospective` en fix round.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si hace falta)
1. **S15-T1-A-E1** — set_index  
2. **S15-T1-A-E2** — Series por etiqueta  
3. **S15-T1-A-E3** — alineación `add`  
4. **S15-T1-B-E1** — na_values  
5. **S15-T1-B-E2** — parse_dates  
6. **S15-T1-B-E3** — CSV latino + usecols  
7. **S15-T2-A-E1** — loc umbral inclusivo  
8. **S15-T2-A-E2** — assign  
9. **S15-T2-A-E3** — iloc  
10. **S15-T2-B-E1** — loc flag  
11. **S15-T2-B-E2** — copy subset  
12. **S15-T2-B-E3** — aislamiento copy  
13. **S15-T3-A-E1** — category + title  
14. **S15-T3-A-E2** — to_numeric coerce  
15. **S15-T3-A-E3** — to_datetime coerce  
16. **S15-T3-B-E1** — delta isna  
17. **S15-T3-B-E2** — KeyError missing  
18. **S15-T3-B-E3** — dtype string  
19. **S15-T4-A-E1** — CSV index=False  
20. **S15-T4-A-E2** — Excel BytesIO  
21. **S15-T4-A-E3** — contrato dtypes  
22. **S15-T4-B-E1** — memory deep  
23. **S15-T4-B-E2** — manifest rows/columns  
24. **S15-T4-B-E3** — hash del CSV  

### P1 (I Do preamble + retrospective + why ampliado; You Do retrospective)
25. **S15-T1-A-DEMO** … **S15-T4-B-DEMO** (8 demos)  
26. **S15-YouDo** — añadir `retrospective` de defensa  

### P2 (polish opcional)
- Enriquecer `feedback` de We Do donde el P0 solo copió el de una línea (priorizar E1 de cada subtema).  
- Acortar hints spoiling en E3 si el Fixer encuentra que revelan la API completa.  
- Una línea extra en `portfolioNote` del You Do sobre defensa oral del delta de coerción.

---

## Residual risks
- **Dependencia openpyxl:** demos/ejercicios T4-A Excel fallan sin el motor; la theory ya lo documenta — el Fixer no debe “arreglar” el código para ocultar la dependencia.  
- **Hashes canónicos** (T4-B-E3 `309b0e45`, demos de manifest): cualquier cambio de fixture o de `index`/`line_terminator` rompe el output; no tocar código salvo justificación execute-and-diff.  
- **Volumen (24 We Do):** riesgo de prosa genérica si el Fixer plantilla; cada unidad de este ledger tiene escena y meta distintas — respetar el fade E1→E2→E3.  
- **Score sintético ≠ culpa:** mantener la nota ética en demos T2-A y en You Do retrospective.  
- **SIN_DATO vs. NA default:** E1 de T1-B y el You Do dependen de tokens no-default; no “simplificar” a `NA` en el fix.  
- **Schema fields opcionales:** confirmar que el schema TS de `CourseSection` acepta `preamble`/`retrospective`/`title` en iDo/weDo/youDo antes del fix masivo (mismo riesgo que S01–S14).

---

## Summary counts for Fixer

| Tipo | Unidades | Campo faltante dominante | Severidad típica |
|------|----------|--------------------------|------------------|
| iDo | 8 | preamble + retrospective (+ why corto) | P1 |
| weDo | 24 | title + preamble + retrospective (+ instruction split) | P0 |
| youDo | 1 | retrospective | P1 |
| **Total** | **33** | | |

**No se editó** `s15-stdlib-deep.ts` en este round — solo este reporte.

Section 15 exercise pedagogy review complete. Ready for the Fixer prompt.
