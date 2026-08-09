# S17 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Joins, reshape, groupby y cierre analítico
- **shortTitle:** Joins · groupby · cierre
- **id:** `packaging` (archivo histórico `s17-packaging.ts`; contenido = joins/reshape/groupby/reconciliación, no empaquetado PyPI)
- **index:** 17
- **source:** `src/lib/course/sections/s17-packaging.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S17-T1-A claves/cardinalidad · T1-B validate/anti-join · T2-A concat/melt/pivot · T2-B nombres estables · T3-A groupby/agg/transform · T3-B ventanas/cohortes · T4-A denominadores/totales · T4-B leakage/cutoff
- **hilo de caso:** CASO-LIM-017 / portfolio ejecutivo de calidad + EDA (clientes/tx sintéticos Lima–Cusco–Arequipa, PEN; puente a incertidumbre S18)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s17-packaging.ts` (demos ~343–545, weDo ~547–1381, youDo ~1383–1445).
- Contrastado con el hilo de la sección: maestro de clientes, transacciones 1:m, long/wide, groupby, reconciliación, cutoff anti-leakage; sin PII real.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S17 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y clara (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente; a menudo **1–2 frases** (bajo o al borde del piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — Concepto: X. Fixture… Pass: …**”: meta + éxito + a veces límites mezclados; legible para quien ya une tablas, **opaco** para newbie sin escena de portfolio |
| We Do `feedback` | Una o dos frases; a menudo nombra el error típico (bien); poco *por qué importa al stakeholder* |
| Starter `# Bug a corregir` / CASO-LIM-017 | **Excelente** hábito; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable); E3 a veces da el resultado numérico en la pista (spoiling leve) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` **sólidos** y con contrato de dict mínimo |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y con el mini-contrato del portfolio; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (bug intencional, output canónico, fade real E1→E3, E3 de T4-B como mini-integración) es maduro y alineado al cierre del nivel. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en el portfolio de calidad + EDA, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: left vs inner → is_unique → fan-out documentado; T4-B: filtro as-of → delta → join+cutoff integrado). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S17-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de left join 1:m con conteo `rows 2 -> 3` y tamaño por cliente. La `description` nombra fan-out; falta `preamble` que diga *qué observar antes del código* y `retrospective` del misconception “más filas = más clientes”. El `why` es corto pero acertado.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el portfolio ejecutivo unes un maestro de clientes sintéticos (Lima, Cusco) con transacciones en PEN. Antes de sumar montos, el analista debe *ver* si el join es 1:1 o 1:m. En esta demo `C001` tiene dos tx y `C002` una: el left join crece de 2 a 3 filas. No escribas aún; predice `rows` y el dict de conteos por `cliente_id`, luego compara con la salida. Si no cuentas filas pre/post, el fan-out se cuela al tablero.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el conteo pre/post es el gate de cardinalidad; sin él, sumas de monto se inflan; `assert` de unicidad en el lado 1 del maestro es el contrato previo al merge; puente a We Do donde se corrige inner vs left y se documenta fan-out.
- **Proposed retrospective:**  
  Si puedes explicar por qué 2 clientes pueden dar 3 filas tras un left join, ya tienes el hábito de cardinalidad. El error clásico es tratar cada fila del merge como un cliente distinto. En We Do T1-A practicarás left, unicidad y el dict `rows_cli → rows_merge`.
- **Code/output changes:** none
- **Validation notes:** Output canónico alineado a theory T1-A.

---

### S17-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: starter usa `how="inner"` y pierde C002. Instruction telegráfica “Concepto + fixture + Pass”; sin title, preamble ni retrospective. Feedback nombra el error pero no ancla al maestro de clientes del portfolio.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Left join que conserva clientes sin tx
- **Proposed preamble:**  
  - **Contexto:** el maestro de clientes del portfolio no debe desaparecer solo porque aún no hay transacciones.  
  - **Meta:** practicar left merge por `cliente_id` y medir el largo del resultado.  
  - **Éxito:** una línea con el entero `2` (C001 y C002 se conservan; C002 sin monto).  
  - **Límites:** no uses `how='inner'`; no borres filas del maestro; imprime solo `len`, sin texto extra.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el merge es `inner` (bug) y corta a 1 fila.  
  2. Cambia a `how='left'` sobre `cli` y `tx`.  
  3. Imprime solo `len(...)` del resultado.  
  4. Verifica mentalmente: C002 debe seguir contando aunque no tenga tx.
- **Proposed feedback improvement:**  
  Si imprimiste `1`, usaste inner y perdiste C002. Left join conserva el maestro aunque no haya transacciones; el monto de huérfanos queda en NaN y se documenta aparte (anti-join en T1-B).
- **Proposed retrospective:**  
  Left = “todos los del maestro, con o sin match”. Inner = solo intersección. En el portfolio, el KPI de cobertura del maestro se rompe si empiezas con inner. Siguiente (E2): medir unicidad de la clave antes del merge.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S17-T1-A-E2 (weDo, independent)
- **Diagnosis:** Foco independiente correcto (`is_unique` → `False` con C001 duplicado). Instruction densa; no explica *por qué* no se limpia con `drop_duplicates` antes de medir. Sin escena de gate 1:1 del portfolio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Medir unicidad del maestro (is_unique)
- **Proposed preamble:**  
  - **Contexto:** un join “1:1” con ids duplicados en el maestro es un gate de calidad fallido, no un detalle cosmético.  
  - **Meta:** reportar si `cliente_id` es único **antes** de limpiar.  
  - **Éxito:** imprime exactamente `False` con el fixture de dos filas C001.  
  - **Límites:** no uses `drop_duplicates` para “arreglar” antes de medir; no inventes otro booleano.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `True` a mano (bug).  
  2. Mide `cli['cliente_id'].is_unique` sobre la Series real.  
  3. Envuelve en `bool(...)` e imprime solo ese valor.  
  4. No mutes ni dedupliques el DataFrame.
- **Proposed retrospective:**  
  Primero mides, luego decides limpiar. Silenciar duplicados con `drop_duplicates` antes del gate oculta el problema al stakeholder. Luego (E3) documentarás fan-out del lado m con conteos pre/post.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S17-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real al contrato del portfolio (`rows_cli` / `rows_merge`). Starter oculta fan-out con `drop_duplicates` — excelente. Instruction ya nombra el dict; falta anclar *por qué* el memo no acepta un solo int suelto y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Documentar fan-out 1:m (rows pre/post)
- **Proposed preamble:**  
  - **Contexto:** el memo del portfolio reporta `rows_cli → rows_merge`, no un número suelto que “se ve bien”.  
  - **Meta:** hacer inner merge **sin** colapsar el lado m y devolver conteos pre/post.  
  - **Éxito:** `{'rows_cli': 1, 'rows_merge': 3}` con un cliente y tres transacciones.  
  - **Límites:** no uses `drop_duplicates` en tx antes del merge; no imprimas solo un entero.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `drop_duplicates` en tx deja `rows_merge=1`.  
  2. Haz `cli.merge(tx, on='cliente_id', how='inner')` sin deduplicar.  
  3. Imprime un dict con `len(cli)` y `len(m)`.  
  4. Si `rows_merge` es 1, aún estás ocultando el fan-out.
- **Proposed retrospective:**  
  El lado m multiplica filas; eso no es bug si el contrato es 1:m, pero **debe** documentarse. Pregunta de cierre: ¿qué suma de montos se infla si creías 1:1? Puente a T1-B: `validate` y anti-join de huérfanos.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico al contrato del You Do.

---

### S17-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example de anti-join (`left_only` → C002, C003) y `validate` que captura fan-out. Description clara; falta preamble de “tabla de evidencia de calidad” y retrospective del misconception “si el merge no truena, la cobertura está bien”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El KPI de cobertura del maestro no es “el merge corrió”. En esta demo ves dos herramientas: anti-join con `indicator=True` (lista quién no matcheó) y `validate='one_to_one'` (falla si hay fan-out). Predice la lista `anti` y si `validate_caught_fanout` es True antes de mirar la salida. Sin exportar huérfanos, el dashboard de calidad queda opaco.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: anti-join alimenta la tabla de evidencia; `MergeError` es un gate, no un crash a silenciar con `except Exception`.
- **Proposed retrospective:**  
  Huérfanos y fan-out son problemas distintos: unos son cobertura, el otro es cardinalidad rota. We Do: filtrar `left_only`, capturar `MergeError` e imprimir el conteo de huérfanos para el KPI.
- **Code/output changes:** none

---

### S17-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter filtra `'both'` en vez de `'left_only'` — defect guiado perfecto. Instruction corta; sin escena de “clientes sin transacciones” del portfolio. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Anti-join: clientes sin transacciones
- **Proposed preamble:**  
  - **Contexto:** el portfolio exporta huérfanos del maestro (clientes sin tx) a una tabla de evidencia.  
  - **Meta:** left merge con `indicator=True` y listar `left_only`.  
  - **Éxito:** `['C002']` con el fixture cli={C001,C002}, tx solo C001.  
  - **Límites:** no filtres `'both'`; no uses right anti-join en este ejercicio.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: filtra `_merge == 'both'` (bug).  
  2. Cambia el filtro a `'left_only'`.  
  3. Imprime `.tolist()` de `cliente_id` de esas filas.  
  4. Comprueba que C001 no aparece en la lista.
- **Proposed retrospective:**  
  `left_only` = en el maestro, sin match. `both` = ya matcheó (no es huérfano). Siguiente (E2): forzar fallo temprano con `validate='one_to_one'`.
- **Code/output changes:** none

---

### S17-T1-B-E2 (weDo, independent)
- **Diagnosis:** Gate `validate` con captura de `MergeError` → `fail`. Instruction prohíbe `except Exception` (bien en constraints implícitos). Falta preamble de *por qué* no se deja pasar el fan-out silencioso.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate validate one_to_one (MergeError)
- **Proposed preamble:**  
  - **Contexto:** un m:m accidental multiplica filas y sesga sumas de PEN en el comité.  
  - **Meta:** intentar merge 1:1 y reportar fallo controlado si hay fan-out.  
  - **Éxito:** imprime exactamente la cadena `fail` (sin comillas extra).  
  - **Límites:** captura solo `pd.errors.MergeError`; no uses `validate='many_to_many'` ni `except Exception` genérico.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: merge sin validate e imprime `len` (bug).  
  2. Envuelve el merge con `validate='one_to_one'`.  
  3. En el `except` de `MergeError`, imprime `fail`.  
  4. No imprimas el largo del merge “exitoso”.
- **Proposed retrospective:**  
  Fallar temprano es un quality gate, no un error de programación. Si el contrato real es 1:m, decláralo y no uses `one_to_one`. Luego (E3): el KPI es el *conteo* de huérfanos, no solo la lista.
- **Code/output changes:** none

---

### S17-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a KPI numérico `(left_only).sum() → 2`. Starter cuenta `'both'`. Instruction ya nombra el dashboard de calidad; falta retrospective y título formal.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** KPI de huérfanos (conteo left_only)
- **Proposed preamble:**  
  - **Contexto:** el tablero de calidad del portfolio muestra un entero de cobertura, no la lista cruda de ids.  
  - **Meta:** tras left merge con indicator, contar filas `left_only`.  
  - **Éxito:** el entero `2` (3 clientes, tx solo en C001).  
  - **Límites:** no cuentes `'both'`; no listes ids; imprime un int.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: cuenta `'both'` y sale 1.  
  2. Cambia la condición a `'left_only'`.  
  3. Convierte el sum a `int` e imprime.  
  4. Ese número alimenta el dashboard, no el listado.
- **Proposed retrospective:**  
  Lista = evidencia de filas; conteo = KPI de cobertura. Ambos sirven, pero el portfolio pide el número en el resumen ejecutivo. Puente a T2: reshape long/wide con schema estable.
- **Code/output changes:** none

---

### S17-T2-A-DEMO (iDo)
- **Diagnosis:** Demo melt → pivot_table con shapes (4,3) y (2,2). Description correcta; falta preamble de “cuándo long vs wide en el reporte al stakeholder” y retrospective del misconception del default de `aggfunc`.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El portfolio a veces necesita series por periodo (long) y a veces una fila por cliente con columnas por mes (wide). En esta demo un wide de dos clientes y dos periodos se apila con `melt` y regresa con `pivot_table(..., aggfunc='sum')`. Observa shapes y la lista de periodos: el total de montos se conserva solo si el aggfunc es suma, no el default (mean).
- **Proposed instruction/description improvements:**  
  Ampliar `why`: long para multipunto temporal; wide para el tablero tabular; `aggfunc` explícito es contrato de negocio, no detalle de API.
- **Proposed retrospective:**  
  Si sabes por qué 2×2 wide da 4 filas long, ya controlas el contrato de filas del reshape. We Do: medir `len` del melt, columnas post-pivot y concat de lotes.
- **Code/output changes:** none

---

### S17-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter imprime `len(df)` del wide (2) en vez del melt (4). Instruction nombra el contrato n_long = n_filas × n_value_vars; sin preamble de escena.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Melt wide→long (contar filas)
- **Proposed preamble:**  
  - **Contexto:** al pasar un reporte mensal a series, el número de filas debe crecer de forma predecible.  
  - **Meta:** aplicar `melt` y medir el largo del long.  
  - **Éxito:** entero `4` (2 filas × 2 value_vars).  
  - **Límites:** no imprimas `len` del wide; declara `id_vars` y `value_vars`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `len(df)` sin melt (bug).  
  2. Aplica `melt(id_vars='id', value_vars=['a','b'])`.  
  3. Imprime solo el `len` del resultado.  
  4. Recuerda: 2×2 = 4, no 2.
- **Proposed retrospective:**  
  Melt multiplica filas por el número de columnas de valor. Si el largo no cuadra, el schema de value_vars está mal. Siguiente (E2): pivot de regreso con columnas incluyendo el id.
- **Code/output changes:** none

---

### S17-T2-A-E2 (weDo, independent)
- **Diagnosis:** Foco en `reset_index` para que `id` aparezca en columns. Feedback acertado. Falta preamble de schema del export wide.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Pivot_table y columnas con id
- **Proposed preamble:**  
  - **Contexto:** el export wide del portfolio necesita la clave de cliente como columna, no solo como index.  
  - **Meta:** `pivot_table` con `aggfunc='sum'` y `reset_index`, luego listar columnas.  
  - **Éxito:** `['id', 'a', 'b']`.  
  - **Límites:** no dejes el index sin promover; no uses mean por defecto.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: lista `w.columns` sin `reset_index` (falta `id`).  
  2. Encadena `.reset_index()` tras el pivot_table.  
  3. Imprime `columns.tolist()`.  
  4. Verifica que `id` sea la primera columna del pass.
- **Proposed retrospective:**  
  Index ≠ columna de export. Sin `reset_index`, el dashboard no ve la clave. Luego (E3): apilar lotes diarios con concat y reportar n_lotes / n_filas.
- **Code/output changes:** none

---

### S17-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a contrato de lotes (`n_lotes`, `n_filas`). Starter solo mide la primera tabla. Instruction ya nombra axis=0; falta title/preamble/retrospective formales.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Concat de lotes (n_lotes y n_filas)
- **Proposed preamble:**  
  - **Contexto:** el portfolio une snapshots diarios; el memo debe decir cuántos lotes entraron y cuántas filas salieron.  
  - **Meta:** `pd.concat` vertical de dos DataFrames de una fila e imprimir el dict de contrato.  
  - **Éxito:** `{'n_lotes': 2, 'n_filas': 2}`.  
  - **Límites:** no uses `axis=1` (alinea columnas, no apila casos); no midas solo `len(a)`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `n_filas` es `len(a)`.  
  2. `out = pd.concat([a, b], ignore_index=True)`.  
  3. Imprime el dict con `n_lotes=2` y `n_filas=len(out)`.  
  4. Si n_filas es 1, aún no apilaste.
- **Proposed retrospective:**  
  Concat axis=0 apila evidencia; axis=1 ensancha el schema. El contrato de filas del portfolio es re-ejecutable y auditable. Puente a T2-B: nombres de columnas estables post-pivot.
- **Code/output changes:** none

---

### S17-T2-B-DEMO (iDo)
- **Diagnosis:** Schema estable `monto_ene` / `monto_feb` con validación de set. Falta preamble de “rename silencioso rompe el PR” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Tras un pivot, las columnas crudas (`ene`, `feb`) no son el contrato del dashboard. En esta demo se prefijan a `monto_*` y se valida `set(columns) == expected`. Observa la lista final y el booleano True: un rename ad hoc en el notebook no es auditable; el gate de schema sí.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: sets ignoran orden (orden se documenta en el memo si el export lo exige); el gate falla de forma explicable si falta `monto_feb`.
- **Proposed retrospective:**  
  Schema estable = lo que el stakeholder y el diff del PR pueden auditar. We Do: renombrar con prefijo, alinear expected y usar `rename` con dict explícito.
- **Code/output changes:** none

---

### S17-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter imprime columnas sin prefijo `monto_`. Instruction clara en pass; sin escena de schema del dashboard.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Prefijo monto_ tras pivot
- **Proposed preamble:**  
  - **Contexto:** el schema del portfolio exige `monto_e`, `monto_f`, no el MultiIndex/nombres crudos del pivot.  
  - **Meta:** pivot long→wide y renombrar columnas con prefijo.  
  - **Éxito:** `['monto_e', 'monto_f']`.  
  - **Límites:** no dejes `['e','f']`; el prefijo es obligatorio.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime columnas crudas (bug).  
  2. Tras pivot, asigna `w.columns = [f'monto_{c}' for c in w.columns]`.  
  3. Imprime `list(w.columns)`.  
  4. Comprueba el prefijo en ambas.
- **Proposed retrospective:**  
  Prefijo = contrato legible para el dashboard. Sin él, colisiones con otras métricas son fáciles. Siguiente (E2): validar el set expected.
- **Code/output changes:** none

---

### S17-T2-B-E2 (weDo, independent)
- **Diagnosis:** Expected pide `monto_feb` inexistente → False; solución alinea expected. Feedback bueno. Falta anclar “sets ignoran orden”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate set(columns) == expected
- **Proposed preamble:**  
  - **Contexto:** el script del portfolio debe fallar de forma explicable si falta una columna de negocio.  
  - **Meta:** comparar `set(df.columns)` con el set expected real.  
  - **Éxito:** `True` con columns `cliente_id`, `monto_ene`.  
  - **Límites:** expected debe listar columnas reales; no uses igualdad de listas ordenadas para este gate.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: expected pide `monto_feb` (bug).  
  2. Corrige expected a las columnas reales del DF.  
  3. Imprime `set(df.columns) == expected`.  
  4. El orden no importa en el set; el orden de export va al memo.
- **Proposed retrospective:**  
  Expected mal escrito da falsos rojos o verdes. El gate compara la realidad del DF, no el deseo del slide. Luego (E3): `rename` con dict origen→destino documentable.
- **Code/output changes:** none

---

### S17-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a rename de negocio (`a` → `monto`). Starter exporta nombre crudo. Instruction ya contrasta con reasignar `.columns`; falta formalización pedagógica.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rename explícito a nombre de negocio
- **Proposed preamble:**  
  - **Contexto:** el diccionario de datos del portfolio llama a la métrica `monto`, no `a`.  
  - **Meta:** `rename(columns=...)` e imprimir la lista de columnas.  
  - **Éxito:** `['monto']`.  
  - **Límites:** no reasignes `.columns` a una lista opaca sin dict origen→destino.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: imprime `['a']` sin rename.  
  2. Aplica `rename(columns={'a': 'monto'})`.  
  3. Imprime `.columns.tolist()`.  
  4. El schema del export debe ser el nombre de negocio.
- **Proposed retrospective:**  
  Dict rename es auditable en el PR; reasignar `.columns` a ciegas no. Puente a T3: colapsar o reinyectar montos con groupby.
- **Code/output changes:** none

---

### S17-T3-A-DEMO (iDo)
- **Diagnosis:** Demo agg (total, n) + transform mean por región. Description correcta; falta preamble de “suma vs media según la pregunta de negocio” y retrospective del bug “me quedé sin filas”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El stakeholder pide total de PEN por región y, a la vez, un score por fila (monto vs media regional). En esta demo `agg` colapsa a una fila por región y `transform('mean')` reinyecta la media al shape original. Observa el resumen y la lista `mean_reg`: si usas agg donde ibas a usar transform, “te quedas sin filas” en el feature store.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: named agg documenta el schema del CSV ejecutivo; `as_index=False` facilita merges posteriores; no mezclar sum y mean sin contrato.
- **Proposed retrospective:**  
  agg = tabla ejecutiva; transform = feature a nivel fila. We Do: sum vs mean, transform mean y named agg con schema `total`/`n`.
- **Code/output changes:** none

---

### S17-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter usa `mean` (Lima 1.5) en vez de `sum` (3.0). Feedback nombra el contrato de negocio. Sin preamble de “total de PEN”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Groupby sum de montos por región
- **Proposed preamble:**  
  - **Contexto:** el tablero ejecutivo pide **total** de PEN por región, no el promedio de filas.  
  - **Meta:** `groupby('region')['monto'].sum()` e imprimir dict.  
  - **Éxito:** `{'Arequipa': 3.0, 'Lima': 3.0}` (orden de keys según sort de pandas).  
  - **Límites:** no uses mean; no mutes el DF original.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: usa `.mean()` (bug).  
  2. Cambia a `.sum()`.  
  3. Imprime `.to_dict()`.  
  4. Lima con dos filas (1+2) debe sumar 3.0, no 1.5.
- **Proposed retrospective:**  
  Mean y sum no son intercambiables: el error clásico del slide es “promedio” cuando el comité pidió “total”. Siguiente (E2): reinyectar media con transform sin colapsar filas.
- **Code/output changes:** none

---

### S17-T3-A-E2 (weDo, independent)
- **Diagnosis:** Starter colapsa con sum → 2 elementos; solution transform mean → 3 filas. Feedback acertado. Falta escena de feature por fila.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Transform mean sin colapsar filas
- **Proposed preamble:**  
  - **Contexto:** un score por transacción necesita la media regional en *cada* fila, no una tabla de dos regiones.  
  - **Meta:** `transform('mean')` e imprimir la lista de tres valores.  
  - **Éxito:** `[2.0, 2.0, 2.0]` (Lima media 2, Arequipa media 2).  
  - **Límites:** no uses agg/sum del groupby (colapsa); no armemos map manual.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `.sum().tolist()` deja 2 elementos.  
  2. Usa `groupby('region')['monto'].transform('mean')`.  
  3. Imprime `.tolist()` (debe haber 3 floats).  
  4. Si la lista tiene 2 elementos, aún colapsaste.
- **Proposed retrospective:**  
  transform preserva el shape; agg lo reduce. Si “desaparecieron filas”, miraste el operador equivocado. Luego (E3): named agg fija el schema del resumen.
- **Code/output changes:** none

---

### S17-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Named agg → columns `['region','total','n']`. Starter da `['region','monto']`. Transfer claro al schema del CSV ejecutivo.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Named agg: schema total y n
- **Proposed preamble:**  
  - **Contexto:** el CSV del portfolio que ve el stakeholder debe llamarse `total` y `n`, no el genérico `monto`.  
  - **Meta:** `groupby(..., as_index=False).agg(total=..., n=...)` y listar columnas.  
  - **Éxito:** `['region', 'total', 'n']`.  
  - **Límites:** no uses solo `sum().reset_index()`; declara nombres de agregación.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: sum simple → `['region','monto']`.  
  2. Usa named aggregation con `total` y `n`.  
  3. `as_index=False` para que `region` sea columna.  
  4. Imprime `columns.tolist()`.
- **Proposed retrospective:**  
  Named agg es el contrato de columnas del resumen. Sin nombres, el export es ambiguo. Puente a T3-B: ventanas y cohortes temporales.
- **Code/output changes:** none

---

### S17-T3-B-DEMO (iDo)
- **Diagnosis:** Cohorte con min(fecha) y rolling(2) sobre serie diaria. Description buena; falta preamble de “primera observación ≠ batch de hoy” y retrospective de no-claims.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Retención y evolución se miden con cohortes y ventanas, no con la fecha del informe de hoy. En esta demo cada cliente recibe el mes de su **primera** tx y la serie diaria de montos lleva media móvil de 2 periodos (con NaN iniciales). Predice dict de cohortes y la lista del rolling antes de mirar la salida. El memo declara no-claims: series bien definidas, no causalidad.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: ordenar antes de rolling; cohorte = min, nunca max ni fecha de batch; puente a S18 para incertidumbre.
- **Proposed retrospective:**  
  Si sabes por qué C001 y C002 pueden compartir cohorte 2024-01, entiendes “entrada”, no “última actividad”. We Do: window=2, min vs max, sort_index antes de rolling.
- **Code/output changes:** none

---

### S17-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter rolling(1) sin NaN inicial; solution window=2 → `[None, 1.5, 2.5]`. Feedback bueno. Sin preamble de ventana incompleta.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Rolling mean con NaN inicial
- **Proposed preamble:**  
  - **Contexto:** una media móvil de 2 periodos no inventa valor en el primer punto.  
  - **Meta:** `rolling(2).mean()` y listar con NaN como `None`.  
  - **Éxito:** `[None, 1.5, 2.5]`.  
  - **Límites:** no uses window=1; documenta mentalmente que el primer punto no tiene ventana completa.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `rolling(1)` (bug).  
  2. Cambia a window=2.  
  3. Convierte NaN a `None` al armar la lista.  
  4. Imprime la lista completa.
- **Proposed retrospective:**  
  NaN inicial no es error: es honestidad de la ventana. Ocultarlo con window=1 miente al gráfico. Siguiente (E2): cohorte con min de fecha.
- **Code/output changes:** none

---

### S17-T3-B-E2 (weDo, independent)
- **Diagnosis:** Starter usa `max` (C001 → 2024-03); solution `min` → 2024-01. Feedback excelente. Falta escena de retención.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cohorte mensual (primera fecha)
- **Proposed preamble:**  
  - **Contexto:** segmentar retención por “cuándo entró el cliente”, no por su última compra.  
  - **Meta:** asignar cohorte YYYY-MM con `min` de fecha por cliente.  
  - **Éxito:** `{'C001': '2024-01', 'C002': '2024-02'}`.  
  - **Límites:** no uses `max`; no cortes el string de la fecha a mano de forma frágil.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `transform('max')` (bug).  
  2. Cambia a `transform('min')` y `to_period('M')`.  
  3. Imprime dict id→cohort de filas únicas por cliente.  
  4. C001 con ene y mar debe ser 2024-01.
- **Proposed retrospective:**  
  max = última actividad; min = entrada a la cohorte. Confundirlos distorsiona retención. Luego (E3): ordenar el índice antes de rolling en un feed desordenado.
- **Code/output changes:** none

---

### S17-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer real: serie desordenada; sin sort el “último” valor miente. Pass `2.5` tras ordenar. Instruction nombra tendencia falsa al stakeholder — buen gancho; falta formalización.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Sort_index antes de rolling
- **Proposed preamble:**  
  - **Contexto:** los feeds llegan desordenados; una ventana sobre el orden de llegada inventa tendencias.  
  - **Meta:** ordenar el índice temporal, rolling(2).mean, reportar el último valor.  
  - **Éxito:** float `2.5` (tras orden 1→2→3, ventana final (2+3)/2).  
  - **Límites:** no hagas rolling sin `sort_index`; no cambies la window.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: rolling directo sobre índice desordenado.  
  2. `s = s.sort_index()` antes del rolling.  
  3. Imprime `float(...iloc[-1])` del mean.  
  4. Sin sort, el “último” no es el último día del calendario.
- **Proposed retrospective:**  
  Orden temporal es precondición de ventanas, no un detail opcional. Pregunta: ¿qué le dirías al stakeholder si el gráfico “subió” solo por desorden? Puente a T4: reconciliar totales y denominadores.
- **Code/output changes:** none  
- **Validation notes:** La pista E3 revela el 2.5 — Fixer puede suavizar el spoiling sin cambiar el pass.

---

### S17-T4-A-DEMO (iDo)
- **Diagnosis:** Reconciliación diff=0 y tasa 0.75 con denominador 200. Falta preamble de “tabla puente” y retrospective del denominador cómodo.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Tras joins y agregaciones, el stakeholder pregunta “¿cuadra el total?”. En esta demo partes Lima/Arequipa/Cusco suman 100 y la tasa de completitud usa el denominador declarado (200). Observa `diff`, `reconciled` y la tasa con su `den`: un residual se documenta, no se redondea a ojo ni se esconde en el slide.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: imprimir numerador, denominador y tasa juntos; residual es evidencia de la tabla puente.
- **Proposed retrospective:**  
  Si puedes explicar por qué el denominador debe ser el mismo universo del hallazgo, ya evitas el error clásico del EDA ejecutivo. We Do: eps estricto, tasa bien orientada y residual de la bridge table.
- **Code/output changes:** none

---

### S17-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter tolera `< 1.0` (laxo); solution `1e-9`. Feedback acertado. Sin escena de gate de reconciliación del portfolio.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Reconciliar totales con eps 1e-9
- **Proposed preamble:**  
  - **Contexto:** el gate del portfolio declara si las partes cuadran con el total de referencia.  
  - **Meta:** `abs(sum(parts) - total) < 1e-9`.  
  - **Éxito:** `True` con parts 10+20+70 y total 100.  
  - **Límites:** no uses tolerancia 1.0; no compares con `==` frágil como única estrategia sin eps documentado.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: umbral `< 1.0` (bug).  
  2. Cambia a `1e-9`.  
  3. Imprime el booleano.  
  4. Un descuadre de casi un sol no debe pasar el gate.
- **Proposed retrospective:**  
  Eps laxo aprueba descuadres que un auditor ve. El número del gate es parte del contrato. Siguiente (E2): tasa con denominador correcto.
- **Code/output changes:** none

---

### S17-T4-A-E2 (weDo, independent)
- **Diagnosis:** Starter invierte cociente (4.0); solution 0.25. Feedback bueno. Falta anclar “universo activo”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tasa pagados sobre activos
- **Proposed preamble:**  
  - **Contexto:** la tasa de conversión del hallazgo usa el universo activo como denominador, no el de “éxitos”.  
  - **Meta:** imprimir `pagados / activos`.  
  - **Éxito:** float `0.25` (10/40).  
  - **Límites:** no imprimas 25 ni inviertas el cociente; no uses pagados como denominador.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `activos / pagados` (bug).  
  2. Invierte a `pagados / activos`.  
  3. Imprime el float (no porcentaje).  
  4. 10 de 40 es 0.25, no 4.0.
- **Proposed retrospective:**  
  Denominador = universo del texto del hallazgo. Invertir el cociente es un error de negocio, no de sintaxis. Luego (E3): tabla puente total → Lima → residual.
- **Code/output changes:** none

---

### S17-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Bridge table con residual 40.0; starter invierte signo y podría omitir keys. Transfer al memo del portfolio bien planteado.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tabla puente total–Lima–residual
- **Proposed preamble:**  
  - **Contexto:** el memo del portfolio documenta total → segmento → residual, no un descuadre oculto.  
  - **Meta:** construir el dict de la bridge table con residual = total − lima.  
  - **Éxito:** `{'total': 100.0, 'lima': 60.0, 'residual': 40.0}`.  
  - **Límites:** no restes lima−total; no imprimas solo un float suelto.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: residual = lima − total (−40).  
  2. Calcula residual = total − lima.  
  3. Imprime el dict con las tres keys en floats.  
  4. El residual es evidencia del resto del país, no un error a esconder.
- **Proposed retrospective:**  
  Residual documentado > total “redondeado” en el slide. Pregunta: ¿qué partes faltan si residual es 40? Puente a T4-B: cutoff y delta de leakage.
- **Code/output changes:** none

---

### S17-T4-B-DEMO (iDo)
- **Diagnosis:** safe 10 vs leaky 1009, delta 999. Description y why claros; falta preamble de “mira el futuro” y retrospective formal.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un score de “riesgo a enero” que suma febrero es leakage temporal: mira el futuro. En esta demo cutoff 2024-01-31 deja `safe=10` y el total sin filtro `1009`, con delta 999. Observa los tres prints: el portfolio no basta con filtrar en silencio; el memo lleva el **delta de leakage** explícito.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: as-of = solo lo conocido a t; delta = total − pre; sin ese número el stakeholder no calibra confianza.
- **Proposed retrospective:**  
  Si puedes explicar por qué 999 no es “ruido” sino contaminación, ya cierras el control as-of. We Do: máscara `<=`, delta y mini-integración join+cutoff.
- **Code/output changes:** none

---

### S17-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter filtra `>` (post); solution `<=` → `[1.0]`. Feedback excelente. Sin preamble de control as-of.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Filtro as-of fecha <= cutoff
- **Proposed preamble:**  
  - **Contexto:** el control as-of del portfolio solo usa datos conocidos hasta el cutoff.  
  - **Meta:** filtrar montos con `fecha <= cutoff` e imprimir la lista.  
  - **Éxito:** `[1.0]` (queda enero; sale febrero).  
  - **Límites:** no uses `>`; cuidado con comparar strings de fecha en vez de timestamps.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: máscara `fecha > cutoff` (bug).  
  2. Invierte a `fecha <= cutoff`.  
  3. Imprime `.tolist()` de montos.  
  4. El post-periodo (9.0) no debe aparecer.
- **Proposed retrospective:**  
  `<=` vs `>` es el interruptor del as-of. Un signo al revés contamina el before/after. Siguiente (E2): reportar el delta de leakage, no solo el pre.
- **Code/output changes:** none

---

### S17-T4-B-E2 (weDo, independent)
- **Diagnosis:** Starter imprime solo pre (10.0); solution delta 5.0. Instruction ya dice que el memo necesita el delta. Falta formalización title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Delta de leakage (total − pre)
- **Proposed preamble:**  
  - **Contexto:** el memo del portfolio no basta con el total “seguro”; debe cuantificar cuánto del total mira el futuro.  
  - **Meta:** `float(sum_total - sum_pre)` con cutoff fin de enero.  
  - **Éxito:** `5.0` (la tx de marzo).  
  - **Límites:** no imprimas solo pre; no inviertas el delta.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `pre` (bug).  
  2. Calcula total − pre.  
  3. Imprime el float del delta.  
  4. 5.0 es la contaminación, no el monto “bueno”.
- **Proposed retrospective:**  
  Delta = transparencia con el stakeholder. Solo pre sin delta oculta el tamaño del problema. Luego (E3): unir join + cutoff en un solo dict de contrato (puente al You Do).
- **Code/output changes:** none

---

### S17-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Mini-integración excelente (join + pre-cutoff + delta) con pass `{'rows_merge': 3, 'total_pre': 5.0, 'leakage_delta': 10.0}`. Starter hace max global — defect pedagógico fuerte. Es el puente al You Do; la prosa aún es drill sin title/preamble/retrospective formales.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mini-integración join + cutoff + delta
- **Proposed preamble:**  
  - **Contexto:** el portfolio exige cardinalidad, as-of y leakage juntos, no drills sueltos.  
  - **Meta:** left merge, `total_pre` con `fecha<=cutoff` y `leakage_delta` en un solo dict.  
  - **Éxito:** `{'rows_merge': 3, 'total_pre': 5.0, 'leakage_delta': 10.0}`.  
  - **Límites:** no uses max por cliente sin merge; no omitas ninguna de las tres keys; no inviertas el delta.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `groupby(...).max()` sin merge ni filtro.  
  2. Left merge cli–tx; `rows_merge = len(m)`.  
  3. `total_pre` = suma de montos con fecha <= cutoff; delta = suma total − total_pre.  
  4. Imprime un solo dict con las tres keys del contrato.
- **Proposed retrospective:**  
  Tres números juntos = evidencia re-ejecutable para el comité. Si solo entregas un max, no hay cardinalidad ni as-of. Este E3 es el ensayo del You Do: reutiliza el mismo contrato de keys.
- **Code/output changes:** none  
- **Validation notes:** Output canónico coherente con fixture (3+2 pre = 5; 10 post = delta 10; 3 filas merge).

---

### S17-youDo (youDo)
- **Diagnosis:** Marco de proyecto **fuerte**: context con contrato mínimo del dict, objectives, requirements, starter con `NotImplementedError`, rubric ponderada y `portfolioNote` hacia S18. Falta `retrospective` de defensa metacognitiva (qué invariante demuestras, PII sintético, frase de impacto medible). Para un newbie, el starter sugiere pasos pero no cierra el ciclo “después de construir, ¿qué defiendes en 30 segundos?”.
- **Checklist:** context pass · goal pass (objectives) · success pass (rubric + keys del dict) · constraints pass (sintéticos, no PII) · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (youDo ya tiene `title`)
- **Proposed preamble:** N/A (context ya cubre escena; no duplicar)
- **Proposed instruction/description improvements:**  
  Opcional (P2): en `portfolioNote` o al final de `context`, una línea que recuerde imprimir `portfolio_summary` y adjuntar memo con delta de leakage y no-claims. No reescribir el contrato de keys.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con `rows_merge`, `n_huerfanos_left_only` y `leakage_delta` juntos? (2) ¿qué cambiarías con datos reales vs. sintéticos (PII, cutoff de producción)? (3) Escribe en el memo una frase de impacto medible (antes/después de gates) que puedas defender en 30 segundos sin claims causales. En S18 no reescribas los joins: reutiliza este dataset limpio para hallazgo vs. hipótesis.
- **Code/output changes:** none
- **Validation notes:** Starter y rubric alineados a T1–T4 y al E3 de T4-B; no tocar outputs conceptuales del comentario `# Esperado conceptual`.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si es demasiado seco)
1. **S17-T1-A-E1, E2, E3** — left join, is_unique, fan-out documentado  
2. **S17-T1-B-E1, E2, E3** — anti-join, validate, KPI huérfanos  
3. **S17-T2-A-E1, E2, E3** — melt, pivot+reset_index, concat lotes  
4. **S17-T2-B-E1, E2, E3** — prefijo monto_, set expected, rename  
5. **S17-T3-A-E1, E2, E3** — sum vs mean, transform, named agg  
6. **S17-T3-B-E1, E2, E3** — rolling NaN, cohorte min, sort+rolling  
7. **S17-T4-A-E1, E2, E3** — eps, tasa, bridge residual  
8. **S17-T4-B-E1, E2, E3** — as-of, delta leakage, mini-integración (prioridad alta: puente You Do)

### P1
- **8 I Do demos:** añadir `preamble` + `retrospective`; alargar `why` al rango 40–90 palabras donde quede en una frase.  
- **You Do:** añadir `retrospective` de defensa (invariantes, PII, frase de impacto / no-claims).

### P2
- Suavizar hints E3 que revelan el número exacto del pass (p. ej. T3-B-E3 “2.5”).  
- Enriquecer `feedback` de We Do con una frase de impacto al stakeholder cuando hoy es solo “si imprimiste X…”.  
- Opcional: alinear tono de `description` I Do con “predice la salida antes de correr”.

---

## Residual risks

1. **Nombre de archivo vs. contenido:** `s17-packaging.ts` / id `packaging` vs. título de joins/groupby puede confundir a Fixers y a navegación histórica; no es bug de ejercicio, pero el reporte de fix debe no “empaquetar PyPI”.  
2. **Outputs de groupby dict:** orden de keys en `to_dict()` depende del sort de pandas; los pass actuales asumen orden alfabético de regiones — no cambiar outputs sin execute-and-diff.  
3. **E3 T4-B y You Do:** el dict del You Do es más rico (`n_huerfanos`, `reconciled`); el E3 es subset a propósito. El Fixer no debe forzar keys idénticas en E3, solo anclar el puente narrativo.  
4. **Hints spoiling en transfer:** especialmente rolling y residual; bajar spoiling sin vaciar el andamiaje.  
5. **Longitud de preambles propuestos:** respetar 80–150 palabras / 4 bullets al implementar; este reporte ya apunta a ese rango — el Fixer debe contar palabras, no copiar ensayos.  
6. **Fade de prosa:** al implementar, E1 más paso-a-paso y E3 más “meta + éxito + límites” sin repetir el mismo párrafo con otros números.

---

## Fixer acceptance (preview — no implementar en Round 1)

- [ ] Cada iDo no trivial: `preamble` + `retrospective`  
- [ ] Cada weDo: `title`, `preamble`, `instruction` solo-tarea, `retrospective`  
- [ ] youDo: `retrospective`  
- [ ] Outputs canónicos preservados salvo justificación execute-and-diff  
- [ ] Español PE; sin PII real  
- [ ] Sin generadores ni copy-paste mecánico entre subtemas  
- [ ] Build estático de la sección compila  

---

Section 17 exercise pedagogy review complete. Ready for the Fixer prompt.
