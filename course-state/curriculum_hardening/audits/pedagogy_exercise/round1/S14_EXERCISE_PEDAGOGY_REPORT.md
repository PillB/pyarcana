# S14 Exercise Pedagogy Report (Round 1)

## Section
- **title:** NumPy y cómputo vectorizado
- **shortTitle:** NumPy vectorizado
- **id:** `security` (archivo histórico `s14-security.ts`; contenido = ndarray/máscaras/ufuncs/broadcast/views/NaN/bench/`allclose`, no seguridad de modelos)
- **index:** 14
- **source:** `src/lib/course/sections/s14-security.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S14-T1-A dtype/shape · T1-B indexación/máscaras · T2-A ufuncs/reducciones/unicidad · T2-B broadcasting · T3-A views/copies · T3-B NaN/inf · T4-A vectorizar vs loop · T4-B memoria/`allclose`
- **hilo de caso:** CASO-LIM-014 / incremento **CP-N2-A** (tablero de calidad vectorizado; puente desde dashboard por reglas S13 hacia pandas S15)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s14-security.ts` (demos ~331–576, weDo ~578–1429, youDo ~1431–1575).
- Contrastado con el hilo de la sección: arrays sintéticos Lima/Arequipa/Cusco (`C00x`), fail-closed de contrato dtype/shape, métricas de completitud/unicidad, señales por pares, benchmark honesto con equivalencia, sin PII real ni pandas/sklearn.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S14 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué hace el código); no sustituye escena ni “qué observar” |
| I Do `why` | Presente pero **corto** (1 frase; bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — haz X. Salida esperada: …**”: meta + éxito + bug en un bloque; legible para quien ya domina NumPy, **opaco** para newbie sin escena de tablero de calidad |
| We Do `feedback` | Una línea útil; poco *razonamiento* de por qué importa en CP-N2-A |
| Starter `# Bug a corregir` / `CASO-LIM-014` | **Excelente** hábito: defectos nombrados y alineados a la solución |
| Hints | E1 a menudo casi-solución (aceptable); E3 a veces spoiling (`a[:, None] * b` en pistas) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con contratos **sólidos** |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y demos; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (bug deliberado, output canónico, fade de skill real E1→E3, suite `_run_tests` del youDo) es maduro y alineado a CP-N2-A. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en el tablero de calidad, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: meta dtype/shape → linspace/nbytes → validate fail-closed; T3-A: view muta → copy aísla → writeable=False; T4-B: nbytes → allclose → assert_allclose que falla). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S14-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de contrato `flags` (4,3) `uint8` y `scores` (4,) `float64` con asserts de ndim/shape. La `description` nombra qué crea; no hay `preamble` que diga *por qué* el tablero no calcula sin contrato, ni `retrospective` que repare “dtype es detalle cosmético”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de sumar completitud, el tablero CP-N2-A exige un **contrato** de array: filas = clientes, columnas = campos, dtype barato para flags y `float64` para scores. En esta demo `make_quality_arrays` construye flags 0/1 y scores sintéticos, y **aserta** shape y dtype antes de devolver. No escribas aún: predice `flags_shape`, `itemsize` de uint8 y `nbytes` de scores; si el contrato fallara, el assert detiene el pipeline (fail-closed), no “arregla” en silencio.
- **Proposed instruction/description improvements:**  
  Mantener la description actual. Ampliar `why` (~50–70 palabras): documentar dtype/shape evita ufuncs sobre `object` o divisiones int; `itemsize`/`nbytes` anticipan presupuesto de memoria; el assert es el mismo hábito de We Do E3 (`validate`).
- **Proposed retrospective:**  
  Si puedes explicar por qué un score en `int` o un flags 1D rompería las métricas sin mirar el código, ya tienes el hábito de contrato. El error clásico es confiar en el dtype por defecto. En We Do T1-A practicarás meta, `linspace` y validación fail-closed.
- **Code/output changes:** none
- **Validation notes:** Output canónico alineado a theory T1-A.

---

### S14-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter imprime `shape[::-1]` y oculta el contrato (3, 2). Instruction mezcla meta/salida/bug; sin title, preamble ni retrospective. Feedback nombra el síntoma (2, 3) pero no ancla filas×columnas del tablero.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Meta dtype/shape sin invertir ejes
- **Proposed preamble:**  
  - **Contexto:** en el lote sintético del tablero, cada fila es un cliente y cada columna un campo de presencia.  
  - **Meta:** crear `flags` con el contrato correcto e imprimir sus atributos.  
  - **Éxito:** una línea `uint8 (3, 2) 2`.  
  - **Límites:** solo NumPy; no inviertas la tupla `shape`; dtype debe ser `uint8` (no el `int64` por defecto).
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el array está bien, pero se imprime `shape[::-1]` (bug).  
  2. Crea `flags` con `np.array(..., dtype=np.uint8)` y la matriz dada.  
  3. Imprime `dtype`, `shape` y `ndim` en ese orden (sin texto extra).  
  4. Comprueba que no quede ningún `::-1`.
- **Proposed feedback improvement:**  
  Si ves `(2, 3)`, invertiste la forma al imprimir o construiste filas/columnas al revés. El contrato del tablero es filas×columnas = clientes×campos; `uint8` ahorra memoria frente a `int64` en flags 0/1.
- **Proposed retrospective:**  
  Imprimir meta no es “debug de aficionado”: es el contrato que reutilizarás en asserts. El misconception es que “si se ve bien, el shape da igual”. Siguiente (E2): malla de scores con `linspace` y `nbytes`.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S14-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente (`linspace` + `itemsize`/`nbytes`). Instruction densa con salida; falta escena de por qué scores en [0,1] no son `arange` enteros. Feedback útil pero sin transfer a presupuesto de memoria.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Scores con linspace y nbytes
- **Proposed preamble:**  
  - **Contexto:** los scores del tablero viven en [0, 1] como malla controlada, no como enteros 0…4.  
  - **Meta:** construir `scores` con `linspace` y reportar coste de memoria.  
  - **Éxito:** `8 40 [0.0, 0.25, 0.5, 0.75, 1.0]`.  
  - **Límites:** solo NumPy; `dtype=float64` (itemsize 8); no uses `arange` como sustituto de malla.
- **Proposed instruction/description improvements:**  
  1. El starter usa `arange(5)` e imprime solo la lista.  
  2. Sustituye por `np.linspace(0, 1, 5, dtype=np.float64)`.  
  3. Imprime `itemsize`, `nbytes` y `tolist()` en una línea.  
  4. Verifica mentalmente: 5 × 8 = 40.
- **Proposed retrospective:**  
  `nbytes = size × itemsize` es el mismo cálculo que el presupuesto de matrices n×n en T4-B. No confundes “cinco puntos” con “cinco enteros”. Luego (E3): rechazar arrays que no cumplan 1D float64.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1 en instrucción propuesta; éxito intacto.

---

### S14-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a fail-closed (`validate` lanza si no es 1D float64). Starter acepta todo. Instruction lista el mensaje esperado; falta anclar *por qué* un 1D de enteros también falla, y cierre metacognitivo hacia el portfolio.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Validar 1D float64 o fallar
- **Proposed preamble:**  
  - **Contexto:** una métrica de scores que recibe `int` o una matriz 2D miente en silencio si no valida.  
  - **Meta:** `validate(a)` exige `ndim == 1` y `dtype == float64`.  
  - **Éxito:** válido → `ok 2`; inválido (`[1, 2]`) → `err expected 1d float64`.  
  - **Límites:** mensaje corto y estable; no “castees” a float en silencio; solo NumPy.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: `validate` solo imprime `ok` sin chequear.  
  2. Si `ndim != 1` o `dtype != float64`, lanza `ValueError("expected 1d float64")`.  
  3. Si pasa, imprime `ok` y `size`.  
  4. Ejecuta el caso válido y el `try/except` del fixture.
- **Proposed retrospective:**  
  Fail-closed es el mismo criterio del youDo (`completeness` rechaza 1D). Pregunta de cierre: ¿por qué un cast silencioso a float sería peor que un error ruidoso? Puente a T1-B: filtrar con máscaras sin romper longitudes.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; mensaje de error ya estabilizado en solution.

---

### S14-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example de máscara combinada Lima + score bajo y `count` con `mask.sum()`. Description correcta; falta preamble que diga *qué predecir* y por qué no usar `and` de Python; retrospective del misconception “máscara = loop disfrazado”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El tablero necesita “clientes sintéticos de Lima con score bajo 0.6” sin un `for` por fila. Sigue la demo: `region` y `score` se combinan con `&` (y paréntesis), no con `and` de Python. Predice la lista `filtrados` y el entero `count` antes de mirar la salida. Datos solo sintéticos (`C00x`, Lima/Arequipa/Cusco); la máscara debe alinear el eje o NumPy lanza `ValueError`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: máscaras expresan reglas de calidad en un pase vectorizado; `mask.sum()` es el conteo del gate; puente a We Do con `where`, mediana y fancy index.
- **Proposed retrospective:**  
  Si sabes por qué `and` entre arrays falla y `&` funciona, ya evitas el bug clásico del newbie. We Do: umbral con `where`, filtro por mediana y reorden con fancy index.
- **Code/output changes:** none

---

### S14-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defect guiado excelente (umbral invertido `<` vs `>=`). Instruction telegráfica; no ancla “índices de riesgo del lote” al tablero. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Índices con score >= 0.5
- **Proposed preamble:**  
  - **Contexto:** el revisor del lote necesita las **posiciones** de clientes sintéticos que superan el umbral, no solo la lista de scores.  
  - **Meta:** localizar índices 0-based con máscara y `np.where`.  
  - **Éxito:** `[1, 3]` para `score = [0.2, 0.8, 0.4, 0.9]`.  
  - **Límites:** solo NumPy; umbral inclusivo `>= 0.5`; no inventes un loop de índices a mano.
- **Proposed instruction/description improvements:**  
  1. El starter usa `score < 0.5` (complemento).  
  2. Cambia a `score >= 0.5`.  
  3. Toma `np.where(mask)[0]` y pásalo a lista.  
  4. Imprime solo esa lista.
- **Proposed feedback improvement:**  
  Si obtienes `[0, 2]`, filtraste el complemento. `where` devuelve una tupla de arrays por eje: en 1D usas `[0]`. El mismo patrón alimenta “quién cae bajo umbral” en el tablero.
- **Proposed retrospective:**  
  Índice vectorizado es la base de fancy index y de reportes “filas problemáticas”. No confundes “posición” con “valor”. Siguiente: filtrar **ids** bajo la mediana (E2).
- **Code/output changes:** none

---

### S14-T1-B-E2 (weDo, independent)
- **Diagnosis:** Filtro por mediana con máscara invertida en starter — skill real de calidad. Instruction con salida clara; falta escena de por qué mediana y no umbral fijo; constraints (no hardcodear 0.5).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Ids bajo la mediana del lote
- **Proposed preamble:**  
  - **Contexto:** en un batch sintético, “bajo” se define respecto del lote (mediana), no de un número mágico.  
  - **Meta:** listar ids con `score < mediana`.  
  - **Éxito:** `['C001', 'C003']`.  
  - **Límites:** usa `np.median`; no hardcodes umbral 0.5; conserva el orden del array original.
- **Proposed instruction/description improvements:**  
  1. El starter filtra `scores > med` (mitad alta).  
  2. Calcula `med = np.median(scores)`.  
  3. Imprime `ids[scores < med].tolist()`.  
  4. No reordenes ni uses `mean` en lugar de mediana.
- **Proposed retrospective:**  
  La mediana del lote es un umbral adaptativo del tablero. El error clásico es invertir la máscara o usar la media. Luego (E3): reordenar con fancy index, otra forma de seleccionar sin loop.
- **Code/output changes:** none

---

### S14-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a fancy index (reorden por lista de posiciones). Starter usa `sorted` — misconception “orden = sort de valores”. Falta preamble de “mismo array, otra vista lógica” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Reordenar con fancy index
- **Proposed preamble:**  
  - **Contexto:** a veces el tablero necesita reordenar un vector de métricas según un ranking de índices, no ordenar los valores.  
  - **Meta:** aplicar `a[order]` con `order = [2, 0, 3, 1]`.  
  - **Éxito:** `[30, 10, 40, 20]`.  
  - **Límites:** solo NumPy; sin loops; no uses `sorted` sobre los valores.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `sorted(a.tolist())` (ordena valores).  
  2. Usa el vector `order` como índice.  
  3. Imprime `a[order].tolist()`.  
  4. Comprueba que el primer elemento sea 30 (posición 2), no 10.
- **Proposed retrospective:**  
  Fancy index no es un slice contiguo ni un sort: es “tráeme estas posiciones en este orden”. Pregunta: ¿por qué `sorted` rompe el significado del ranking? Puente a T2-A: agregados por eje del tablero.
- **Code/output changes:** none

---

### S14-T2-A-DEMO (iDo)
- **Diagnosis:** Demo rica de completitud por campo/cliente, `std` y unicidad con duplicado `C001`. Description técnica; falta preamble de “qué es el tablero en números” y retrospective del misconception `len(ids)/len(ids)`.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Aquí el tablero deja de listar filas y empieza a **agregar**: media de presencia por campo (columnas) y por cliente (filas), más la tasa de unicidad de ids sintéticos. Observa la matriz 0/1 y el vector `ids` con un duplicado. Predice `completitud_campo` (¿qué campo es el más vacío?) y `unicidad` antes de leer la salida. Solo NumPy; un duplicado debe bajar la tasa por debajo de 1.0.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: `axis=0` vs `axis=1` es decisión de negocio; `np.unique(...).size / size` es la fórmula de unicidad del portfolio; `std` resume dispersión de completitud entre campos.
- **Proposed retrospective:**  
  Si puedes decir por qué la unicidad es 0.75 y no 1.0, ya detectas el truco `len/len`. We Do: mean por ejes, tasa de unicidad y centrado por fila con `keepdims`.
- **Code/output changes:** none

---

### S14-T2-A-E1 (weDo, guided)
- **Diagnosis:** axis confuso en starter (imprime filas antes que columnas, sin round). Instruction nombra salida `[1.0, 0.5, 0.5]` y `[0.67, 0.67]`; falta escena de completitud por campo vs cliente.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Completitud: mean por columnas y filas
- **Proposed preamble:**  
  - **Contexto:** el tablero publica un vector de completitud **por campo** y otro **por cliente**.  
  - **Meta:** reducir una matriz 2×3 con `mean` en ambos ejes y redondear.  
  - **Éxito:** primero `[1.0, 0.5, 0.5]`; luego `[0.67, 0.67]`.  
  - **Límites:** solo NumPy; orden de impresión: axis=0 y después axis=1; redondeo a 2 decimales.
- **Proposed instruction/description improvements:**  
  1. El starter imprime primero axis=1 y sin `np.round`.  
  2. Calcula `M.mean(axis=0)` y `M.mean(axis=1)`.  
  3. Redondea con `np.round(..., 2)` y pasa a lista.  
  4. Imprime columnas y luego filas.
- **Proposed feedback improvement:**  
  `axis=0` colapsa filas → un valor por columna (campo). `axis=1` colapsa columnas → un valor por fila (cliente). Invertir el eje o el orden de print rompe la lectura del tablero.
- **Proposed retrospective:**  
  Elegir el eje es elegir el significado de negocio, no un hábito de notebook. Siguiente: unicidad de ids con `np.unique` (E2).
- **Code/output changes:** none

---

### S14-T2-A-E2 (weDo, independent)
- **Diagnosis:** Unicidad con el bug clásico `len/len`. Feedback ya lo nombra bien. Falta preamble de por qué importa en auditoría de ids `C00x` y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Tasa de unicidad con np.unique
- **Proposed preamble:**  
  - **Contexto:** ids sintéticos duplicados inflan el lote y bajan la calidad del emparejamiento.  
  - **Meta:** calcular `np.unique(ids).size / ids.size` con 4 decimales.  
  - **Éxito:** `0.6` para el fixture de cinco ids con dos pares repetidos.  
  - **Límites:** no uses `len(ids)/len(ids)`; no cuentes solo con `set` de Python si puedes usar NumPy.
- **Proposed instruction/description improvements:**  
  1. El starter divide `len(ids)/len(ids)` (siempre 1.0).  
  2. Obtén el número de valores distintos con `np.unique(ids).size`.  
  3. Divide entre `ids.size` y redondea a 4 decimales.  
  4. Imprime solo ese float.
- **Proposed retrospective:**  
  Unicidad 1.0 no es “éxito por defecto”: hay que medirla. El mismo assert aparece en el youDo (`0.75` con un `C001` duplicado). Luego (E3): centrar filas sin romper el broadcast.
- **Code/output changes:** none

---

### S14-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a centrado por fila con `keepdims` (starter centra por columnas). Skill de rebroadcast real. Instruction densa; falta escena “por qué la media post-centrado debe ser ~0”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Centrar filas con keepdims
- **Proposed preamble:**  
  - **Contexto:** para comparar perfiles de cliente, a veces restas la media de **cada fila** sin pelear shapes.  
  - **Meta:** centrar por fila (`axis=1`, `keepdims=True`) y verificar media ~0.  
  - **Éxito:** `[0.0, 0.0, 0.0]`.  
  - **Límites:** solo NumPy; no centres por columnas (`axis=0`); no omitas `keepdims`.
- **Proposed instruction/description improvements:**  
  1. El starter resta la media de columnas y luego promedia por `axis=0`.  
  2. Usa `X - X.mean(axis=1, keepdims=True)`.  
  3. Imprime la media por fila del resultado, redondeada.  
  4. Debe ser un vector de ceros (dentro de redondeo).
- **Proposed retrospective:**  
  `keepdims` guarda el eje colapsado en tamaño 1 para rebroadcast. Si usas `axis=0`, “normalizas campos” y la media por fila no se anula. Puente a T2-B: alinear pesos y scores con broadcast.
- **Code/output changes:** none

---

### S14-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de pesos por dimensión, `agg` y matriz de diferencias por pares vía `newaxis`. Description correcta; falta preamble de “señales por pares sin doble loop” y retrospective de `diff_00 == 0`.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Las señales por pares del tablero necesitan una matriz n×n de diferencias de score agregado **sin** un doble `for` Python. Observa: primero se ponderan dimensiones con broadcast `(3,3)*(3,)`, se suma por cliente y luego `agg[:, None] - agg[None, :]`. Predice `agg`, el `diff_shape` y por qué `diff[0,0]` es 0.0. El assert de columnas vs pesos es el contrato de alineación.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: broadcast documentado evita `ValueError` o, peor, alineaciones silenciosas malas; la diagonal cero es el auto-chequeo de la matriz de pares.
- **Proposed retrospective:**  
  Si explicas por qué la diagonal es cero sin mirar el código, entiendes “score_i − score_i”. We Do: sumar pesos a filas, outer product con `newaxis` y capturar broadcast incompatible.
- **Code/output changes:** none

---

### S14-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter multiplica en vez de sumar — defect simple y claro. Falta escena de “misma fila de pesos en cada cliente” y constraints (no loop).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Sumar pesos a cada fila (broadcast)
- **Proposed preamble:**  
  - **Contexto:** a veces el tablero suma un vector de pesos a cada fila de una matriz de ceros (o de scores base).  
  - **Meta:** broadcast de `w` shape `(3,)` sobre `M` shape `(2, 3)`.  
  - **Éxito:** `[[1.0, 2.0, 3.0], [1.0, 2.0, 3.0]]`.  
  - **Límites:** solo NumPy; operación `+`, no `*`; sin loops ni `tile` manual.
- **Proposed instruction/description improvements:**  
  1. El starter hace `M * w` (producto).  
  2. Cambia a `M + w`.  
  3. Imprime `.tolist()` de la matriz.  
  4. Verifica que ambas filas sean iguales a los pesos.
- **Proposed feedback improvement:**  
  Broadcast alinea el vector por la derecha con cada fila. Multiplicar por ceros deja todo en 0 y “parece que funcionó” sin el efecto de negocio. No repitas el vector a mano.
- **Proposed retrospective:**  
  Sumar un vector a una matriz es el caso más simple de broadcast del tablero. Siguiente (E2): producto exterior con ejes insertados.
- **Code/output changes:** none

---

### S14-T2-B-E2 (weDo, independent)
- **Diagnosis:** Outer product con `newaxis`; starter intenta `a * b` incompatible. Instruction ya da la salida completa; hints casi spoiling. Falta preamble de “matriz de interacciones” y constraints de shape (4,3).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Producto exterior con newaxis
- **Proposed preamble:**  
  - **Contexto:** una matriz de interacciones (cliente × factor) se arma alineando un vector columna con un vector fila.  
  - **Meta:** obtener shape `(4, 3)` con `a[:, None] * b[None, :]`.  
  - **Éxito:** `(4, 3) [[0, 0, 0], [0, 1, 2], [0, 2, 4], [0, 3, 6]]`.  
  - **Límites:** solo NumPy; no uses un doble loop; no dejes el `try/except` imprimiendo `fail`.
- **Proposed instruction/description improvements:**  
  1. El starter multiplica `(4,)` × `(3,)` y cae en error o wrong.  
  2. Inserta un eje en `a` (columna) y opcionalmente en `b` (fila).  
  3. Multiplica y imprime `shape` y `tolist()`.  
  4. Comprueba la primera columna de ceros (porque `b[0]=0`).
- **Proposed retrospective:**  
  Sin `newaxis`, shapes de distinto largo no se alinean. El outer es el hermano menor de `pairwise_diff` del youDo. Luego (E3): forzar y capturar la incompatibilidad.
- **Code/output changes:** none
- **Validation notes:** En Fixer, considerar suavizar hints E2 para no regalar `[:, None]`.

---

### S14-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a fail ruidoso de broadcast; starter suma shapes compatibles. Excelente pedagogía de “error es el éxito”. Falta anclar fail-closed al pipeline y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Capturar broadcast incompatible
- **Proposed preamble:**  
  - **Contexto:** un shape “casi” correcto en el tablero no debe “arreglarse” sumando lo que sí cabe.  
  - **Meta:** forzar `(2,3)+(2,4)`, capturar `ValueError` e imprimir `incompatible`.  
  - **Éxito:** `incompatible`.  
  - **Límites:** no cambies el segundo array a (2,3) para que “pase”; solo NumPy.
- **Proposed instruction/description improvements:**  
  1. El starter suma dos `(2, 3)` y no captura error.  
  2. Pon el segundo operando en shape `(2, 4)`.  
  3. Envuelve en `try/except ValueError`.  
  4. En el except, imprime solo `incompatible`.
- **Proposed retrospective:**  
  Un error ruidoso de broadcast es mejor que un producto silencioso mal alineado. Pregunta: ¿qué harías en un pipeline si el assert de columnas vs pesos falla? Puente a T3-A: no corrompas el raw al normalizar.
- **Code/output changes:** none

---

### S14-T3-A-DEMO (iDo)
- **Diagnosis:** Demo contrastiva view corrupto vs copy seguro — oro pedagógico en código. Description buena; falta preamble de “auditoría del raw” y retrospective del misconception “slice = copia”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En calidad, el array crudo alimenta logs, reprocess y tests. Si normalizas un **view** (`raw[:]`), el raw se corrompe y la auditoría miente. Sigue el mal camino y el bueno: predice `raw_corrupto` tras `v /= v.max()` y luego `raw_ok` cuando usas `.copy()`. Solo datos sintéticos; el principio es mutabilidad, no el score en sí.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: slices simples suelen compartir memoria; fancy/máscaras suelen copiar; regla operativa CP-N2-A: copia antes de mutar si reutilizas el crudo.
- **Proposed retrospective:**  
  Si puedes explicar por qué el primer `raw` ya no tiene 100.0, nunca volverás a “normalizar en sitio” sin pensarlo. We Do: forzar la mutación vía view, aislar con copy y bloquear escritura.
- **Code/output changes:** none

---

### S14-T3-A-E1 (weDo, guided)
- **Diagnosis:** E1 pide **demostrar** el peligro (view muta raw); starter usa `.copy()` y oculta el efecto — defect invertido inteligente. Falta preamble que aclare que aquí el “éxito” es ver la corrupción (controlada).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Demostrar que el view muta raw
- **Proposed preamble:**  
  - **Contexto:** antes de copiar siempre, debes **ver** el efecto colateral de un slice.  
  - **Meta:** mutar una view de los dos primeros elementos y observar `raw`.  
  - **Éxito:** `[9, 2, 3]`.  
  - **Límites:** no uses `.copy()` en este ejercicio; solo NumPy; es un demo controlado, no un patrón de producción.
- **Proposed instruction/description improvements:**  
  1. El starter hace `raw[:2].copy()` y el raw no cambia.  
  2. Quita el `.copy()`: `v = raw[:2]`.  
  3. Asigna `v[0] = 9` e imprime `raw.tolist()`.  
  4. Confirma que el primer valor del original es 9.
- **Proposed feedback improvement:**  
  Un slice simple es view: mutar `vista[0]` escribe en el buffer del padre. Si dejas `.copy()`, “arreglas” el síntoma y no aprendes el riesgo del pipeline.
- **Proposed retrospective:**  
  Ver el bug es parte de la formación: no todo éxito es un raw intacto. Siguiente (E2): el patrón de producción — copiar antes de mutar.
- **Code/output changes:** none
- **Validation notes:** Pedagogía “romper a propósito” es correcta; el preamble debe dejarlo explícito para no confundir al newbie.

---

### S14-T3-A-E2 (weDo, independent)
- **Diagnosis:** Espejo de E1: aislar con copy. Instruction clara; falta anclar “raw de auditoría” y imprimir ambos arrays.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Aislar mutación con copy
- **Proposed preamble:**  
  - **Contexto:** la normalización del tablero no puede reescribir el array que alimenta el reprocess.  
  - **Meta:** mutar una copia y dejar `raw` en `[1, 2, 3]`.  
  - **Éxito:** `[1, 2, 3] [9, 2]`.  
  - **Límites:** usa `.copy()`; solo NumPy; imprime raw y copia en ese orden.
- **Proposed instruction/description improvements:**  
  1. El starter asigna sobre la view y corrompe raw.  
  2. Cambia a `c = raw[:2].copy()`.  
  3. Asigna `c[0] = 9`.  
  4. Imprime `raw.tolist()` y `c.tolist()`.
- **Proposed retrospective:**  
  Copia antes de mutar es la regla operativa de CP-N2-A. El misconception es “si no reasigno el nombre `raw`, el original está a salvo”. Luego (E3): bloquear escritura con flags.
- **Code/output changes:** none

---

### S14-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `writeable=False` y captura de `ValueError`. Starter muta libremente. Falta escena de API de solo lectura y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Bloquear escritura con writeable=False
- **Proposed preamble:**  
  - **Contexto:** a veces pasas un array crudo a una función de normalización y quieres **fallar** si intenta escribir.  
  - **Meta:** marcar `writeable=False`, intentar asignar y capturar el error.  
  - **Éxito:** `blocked`.  
  - **Límites:** solo NumPy; captura `ValueError` (no un `print` del array mutado).
- **Proposed instruction/description improvements:**  
  1. El starter asigna `a[0]=3` e imprime el array.  
  2. Pon `a.flags.writeable = False` antes de asignar.  
  3. Envuelve la asignación en `try/except ValueError`.  
  4. En el except, imprime `blocked`.
- **Proposed retrospective:**  
  `writeable=False` es defensa de contrato, no maquillaje. Pregunta: ¿cuándo preferirías copy vs writeable=False? Puente a T3-B: NaN/inf también “rompen” métricas si no hay política.
- **Code/output changes:** none

---

### S14-T3-B-DEMO (iDo)
- **Diagnosis:** Media robusta con `isfinite` y `nanmean` tras mapear inf→nan. Description correcta; falta preamble “NaN no es cero de negocio” y retrospective del misconception de `nanmean` con inf.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un score ausente (`nan`) o no finito (`inf`) no es un 0 de calidad: contamina `mean` o domina la suma. Observa el vector mixto: cuenta válidos con `isfinite`, promedia solo finitos y compara con `nanmean` tras convertir inf a nan. Predice `n_valid` y `mean_robusta` antes de la salida. Política del tablero: documentar el filtro; no sustituir por 0 en silencio.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: fail-closed o traza de no-finitos; `nanmean` solo no basta si hay `inf`; puente a We Do con conteo de nan, `nanmean` y `nansum` post-inf.
- **Proposed retrospective:**  
  Si sabes por qué `mean` del vector crudo no es 0.7125, ya separas ausencia de valor. We Do: contar NaN, promediar omitiendo NaN y limpiar inf antes de sumar.
- **Code/output changes:** none

---

### S14-T3-B-E1 (weDo, guided)
- **Diagnosis:** Defect clásico `x == np.nan` siempre False. Feedback ya lo dice. Falta preamble de detección de ausencia y constraints.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar NaN con isnan
- **Proposed preamble:**  
  - **Contexto:** el tablero reporta la **tasa de ausencia**, no solo la media de lo presente.  
  - **Meta:** contar NaN en `[1, nan, 2, nan]` con `np.isnan`.  
  - **Éxito:** `2`.  
  - **Límites:** no uses `x == np.nan` (siempre False); no cuentes `inf` como NaN.
- **Proposed instruction/description improvements:**  
  1. El starter suma `(x == np.nan)` y obtiene 0.  
  2. Usa `np.isnan(x).sum()`.  
  3. Imprime el entero.  
  4. Verifica mentalmente: dos posiciones con nan.
- **Proposed feedback improvement:**  
  IEEE hace que NaN no sea igual a sí mismo; por eso `==` miente. `np.isnan` (o `~np.isfinite` con cuidado) es el detector idiomático del tablero.
- **Proposed retrospective:**  
  Contar ausencias es tan importante como promediar presentes. Siguiente: `nanmean` vs `mean` (E2).
- **Code/output changes:** none

---

### S14-T3-B-E2 (weDo, independent)
- **Diagnosis:** `mean` propaga nan; solución `nanmean`. Instruction corta; falta escena de política “omitir ausencias” y redondeo.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Media omitiendo NaN
- **Proposed preamble:**  
  - **Contexto:** publicar `nan` como “media del lote” rompe el dashboard de negocio.  
  - **Meta:** promediar `[1, nan, 3]` omitiendo NaN.  
  - **Éxito:** `2.0`.  
  - **Límites:** usa `np.nanmean` (o filtra con `isnan`); no rellenes NaN con 0 sin documentarlo.
- **Proposed instruction/description improvements:**  
  1. El starter usa `np.mean` y propaga nan.  
  2. Cambia a `np.nanmean`.  
  3. Imprime el float redondeado a 2 decimales.  
  4. Resultado esperado: 2.0.
- **Proposed retrospective:**  
  `nanmean` documenta una política: “ausencia no entra al promedio”. No es lo mismo que tratar ausencia como cero. Luego (E3): `inf` tampoco es un valor de negocio.
- **Code/output changes:** none

---

### S14-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer limpio: inf→nan y `nansum`. Starter suma con inf. Falta anclar fail-closed y retrospective hacia `in_range_rate` del youDo.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Inf a nan y luego nansum
- **Proposed preamble:**  
  - **Contexto:** un overflow o valor no finito no debe volverse un “score total infinito” en el tablero.  
  - **Meta:** reemplazar `inf` por `nan` y sumar con `nansum`.  
  - **Éxito:** `3.0` para `[1, inf, 2]`.  
  - **Límites:** solo NumPy; no uses `sum` crudo sobre inf; documenta la conversión.
- **Proposed instruction/description improvements:**  
  1. El starter hace `np.sum` y obtiene `inf`.  
  2. Mapea inf → nan con `np.where(np.isinf(x), np.nan, x)`.  
  3. Aplica `np.nansum` e imprime el float.  
  4. Confirma 1+2=3.
- **Proposed retrospective:**  
  `inf` no se omite solo: hay que convertirlo o filtrar con `isfinite`. El youDo (`in_range_rate`) exige finitos en rango; el mismo hábito. Puente a T4-A: equivalencia loop vs vectorizado.
- **Code/output changes:** none

---

### S14-T4-A-DEMO (iDo)
- **Diagnosis:** Benchmark `X @ w` vs loop anidado con `allclose` y `ratio_gt_1`. Description correcta; falta preamble de “ratio no es SLA” y retrospective de “sin allclose el ratio miente”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Vectorizar el score ponderado del tablero solo se defiende si (1) el resultado **coincide** con el loop y (2) el tiempo del loop supera al de `X @ w` en N grande. Observa el demo con n=20_000: `perf_counter`, sin prints dentro del loop, `allclose` primero, luego `ratio_gt_1`. El número exacto del ratio **depende de tu máquina**; no lo trates como SLA del portfolio.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: mismo input/dtype; equivalencia antes que velocidad; en CP-N2-A `bench_weighted_mean` devuelve ambos.
- **Proposed retrospective:**  
  Si internalizas “allclose antes del ratio”, ya haces benchmarks honestos. We Do: comparar sumas, suma de cuadrados y timing de suma vectorizada.
- **Code/output changes:** none

---

### S14-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter imprime `False` fijo sin comparar — defect excelente para el contrato de equivalencia. Falta preamble y steps claros del loop.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Equivalencia loop y suma vectorizada
- **Proposed preamble:**  
  - **Contexto:** un ratio de tiempo sin chequear igualdad no demuestra que la versión vectorizada sea correcta.  
  - **Meta:** sumar `a*b` con loop y con `(a*b).sum()` y comparar con tolerancia.  
  - **Éxito:** `True` (`abs(diff) < 1e-6`).  
  - **Límites:** `arange(1000, dtype=float)`; no imprimas un booleano fijo; solo NumPy + aritmética.
- **Proposed instruction/description improvements:**  
  1. El starter calcula `s2` vectorizado e imprime `False`.  
  2. Acumula `s1` con un `for` sobre índices.  
  3. Compara `abs(s1 - s2) < 1e-6`.  
  4. Imprime solo ese booleano.
- **Proposed feedback improvement:**  
  Imprimir `False` fijo “pasa el gesto” pero no el contrato. Primero equivalencia; el timing llega en E3. Usa float para evitar rarezas de tipo.
- **Proposed retrospective:**  
  Equivalencia es el oráculo del portfolio. Siguiente: una reducción vectorizada concreta (suma de cuadrados) sin loop.
- **Code/output changes:** none

---

### S14-T4-A-E2 (weDo, independent)
- **Diagnosis:** Suma de cuadrados vs suma lineal — defect de “casi la ufunc correcta”. Instruction con pista aritmética 0+1+4+9+16; falta escena de métrica de energía/norma al cuadrado.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Suma de cuadrados vectorizada
- **Proposed preamble:**  
  - **Contexto:** varias métricas del tablero elevan scores al cuadrado antes de agregar (energía, norma al cuadrado).  
  - **Meta:** sumar los cuadrados de `arange(5)` de forma vectorizada.  
  - **Éxito:** `30.0`.  
  - **Límites:** solo NumPy; no sumes `a` lineal (eso da 10); dtype float.
- **Proposed instruction/description improvements:**  
  1. El starter hace `a.sum()` (0+1+2+3+4).  
  2. Eleva al cuadrado: `a**2` o `np.square(a)`.  
  3. Suma e imprime el float.  
  4. Verifica 0+1+4+9+16 = 30.
- **Proposed retrospective:**  
  La ufunc correcta es tan importante como “usar NumPy”. Un sum lineal “parece vectorizado” pero mide otra cosa. Luego (E3): medir tiempo y verificar media del resultado.
- **Code/output changes:** none

---

### S14-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a timing con `perf_counter` + check de mean; starter hace loop y check débil (`c[0]==1`). Instruction un poco confusa (“imprime timed junto a si la media…”). Falta preamble de micro-bench honesto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Timing de suma vectorizada con chequeo
- **Proposed preamble:**  
  - **Contexto:** el portfolio documenta tiempo de la operación vectorizada, no de un loop de aprendizaje.  
  - **Meta:** medir `a+b` con `perf_counter` y verificar `mean == 1.0`.  
  - **Éxito:** `timed True`.  
  - **Límites:** n=10000; zeros + ones; no midas el loop del starter; no imprimas el float del tiempo (solo la etiqueta y el booleano).
- **Proposed instruction/description improvements:**  
  1. El starter llena `c` con un loop y chequea solo `c[0]`.  
  2. Sustituye el cuerpo por `c = a + b` entre dos `perf_counter`.  
  3. Verifica `float(c.mean()) == 1.0`.  
  4. Imprime `"timed"` y el booleano.
- **Proposed retrospective:**  
  Un micro-bench honesto mide la operación que publicarás, no el andamiaje del ejercicio. Pregunta: ¿por qué chequear mean y no solo el primer elemento? Puente a T4-B: memoria y `allclose`.
- **Code/output changes:** none
- **Validation notes:** Solution actual descarta el delta de tiempo (`_ = ...`); coherente con no imprimir el float; mantener.

---

### S14-T4-B-DEMO (iDo)
- **Diagnosis:** Matriz de pares n=500, presupuesto `8*n*n`, `allclose` y `assert_allclose`. Description buena; falta preamble de O(n²) y retrospective de rtol/atol.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Las señales por pares son O(n²): con n=500 y float64, `pair.nbytes` ya es ~2 MB. Observa el demo: construye la matriz con broadcast, compara con un **budget**, y valida equivalencia numérica con ruido 1e-10 vía `allclose` y `assert_allclose`. Predice `budget_ok` y por qué el assert no lanza. En el portfolio, documenta rtol/atol y el presupuesto; nunca PII real.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: memoria es contrato del incremento; `assert_allclose` es el oráculo de tests de CP-N2-A; atol cubre cercanos a cero en scores [0,1].
- **Proposed retrospective:**  
  Si sabes por qué 2e6 bytes es “ok” bajo el budget, ya piensas en memoria antes de materializar n×n. We Do: `nbytes` de float64, `allclose` con atol y un assert que **debe** fallar.
- **Code/output changes:** none

---

### S14-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter compara nbytes con 4000 (float32). Feedback correcto. Falta escena de presupuesto del tablero.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** nbytes de 1000 float64
- **Proposed preamble:**  
  - **Contexto:** el presupuesto de memoria del tablero empieza por `itemsize × size`.  
  - **Meta:** reportar `nbytes` de 1000 float64 y validar 8000.  
  - **Éxito:** `8000 True`.  
  - **Límites:** `dtype=np.float64`; no uses el presupuesto de float32 (4000).
- **Proposed instruction/description improvements:**  
  1. El starter compara con 4000.  
  2. Calcula o recuerda: 8 bytes × 1000 = 8000.  
  3. Imprime `a.nbytes` y `a.nbytes == 8000`.  
  4. Sin texto extra.
- **Proposed feedback improvement:**  
  float64 = 8 bytes/elemento. Comparar con 4000 es el error de “pensé en float32”. El mismo hábito escala a matrices n×n del demo.
- **Proposed retrospective:**  
  `nbytes` es evidencia de portfolio, no un print ornamental. Siguiente: comparar floats con tolerancia (E2).
- **Code/output changes:** none

---

### S14-T4-B-E2 (weDo, independent)
- **Diagnosis:** `==` exacto vs `allclose` con atol — skill central del incremento. Instruction clara; falta escena loop-vs-vec del portfolio.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** allclose con atol en floats
- **Proposed preamble:**  
  - **Contexto:** loop y vectorizado raramente coinciden bit a bit; el oráculo del tablero es tolerancia.  
  - **Meta:** `np.allclose` entre `[1.0, 2.0]` y un vecino a 1e-9 con `atol=1e-8`.  
  - **Éxito:** `True`.  
  - **Límites:** no uses igualdad exacta `==`; solo NumPy.
- **Proposed instruction/description improvements:**  
  1. El starter hace `(a == b).all()` y obtiene False.  
  2. Sustituye por `np.allclose(..., atol=1e-8)`.  
  3. Imprime el booleano.  
  4. No aprietes atol por debajo del ruido del fixture.
- **Proposed retrospective:**  
  `allclose` (y `assert_allclose` en tests) es el puente entre “más rápido” y “igual de correcto”. Luego (E3): forzar un fallo controlado del assert.
- **Code/output changes:** none

---

### S14-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a assert que **debe** fallar; starter compara iguales e imprime `ok`. Pedagogía de “el test rojo también se diseña”. Falta preamble de oráculo estricto y retrospective de cierre de sección.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** assert_allclose que debe fallar
- **Proposed preamble:**  
  - **Contexto:** un test que solo ve el camino feliz no protege el tablero.  
  - **Meta:** forzar diferencia 0.1 con `atol=1e-3`, capturar `AssertionError` e imprimir `fail`.  
  - **Éxito:** `fail`.  
  - **Límites:** no dejes arrays idénticos; no imprimas `ok` en el camino feliz de este ejercicio.
- **Proposed instruction/description improvements:**  
  1. El starter compara `[0,0]` consigo mismo y cae en `ok`.  
  2. Cambia el segundo vector a incluir `0.1`.  
  3. Llama `np.testing.assert_allclose(..., atol=1e-3)`.  
  4. En `except AssertionError`, imprime `fail`.
- **Proposed retrospective:**  
  Diseñar el fallo es parte del oficio: el assert debe doler cuando la métrica se desvía. Cierre del tramo We Do: ya puedes defender contratos, máscaras, ejes, broadcast, mutabilidad, NaN y equivalencia numérica en el youDo CP-N2-A.
- **Code/output changes:** none

---

### youDo — Métricas de calidad y señales por pares vectorizadas (inicio CP-N2-A)
- **Diagnosis:** Marco de proyecto **sólido**: context de fintech peruana, objectives claros, requirements con cinco funciones y `_run_tests`, rubric ponderada, `portfolioNote` con shapes/rtol/memoria, starter con contratos y casos NaN/inf. **Falta** `retrospective` de defensa post-build (spec §3 You Do / §8.3). Un newbie puede “hacer pasar tests” sin articular invariantes ni impacto medible.
- **Checklist:** context pass · goal pass · success pass (tests/rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (youDo ya tiene title)
- **Proposed preamble:** N/A (context/objectives cubren el marco; no duplicar en Fixer salvo un enlace corto al hilo CASO-LIM-014 si se desea)
- **Proposed instruction/description improvements:**  
  Ninguno estructural. Opcional en Fixer: una línea en `context` que recuerde el orden de entrega (métricas → pares → bench → nota de portfolio). No tocar fixtures ni asserts canónicos.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con `_run_tests` (shape de completitud, unicidad &lt; 1 con duplicado, `in_range_rate` con NaN/inf, diagonal 0 de pares, `allclose` del bench)? (2) ¿qué harías distinto con PII real vs. sintéticos `C00x`? (3) En el README, una frase de impacto medible (p. ej. “métricas vectorizadas equivalentes al baseline en loop dentro de atol X; presupuesto n×n documentado”) que puedas defender en 30 segundos. El ratio de tiempo **no** es el SLA: la equivalencia y el contrato dtype/shape sí lo son.
- **Code/output changes:** none
- **Validation notes:** Starter y suite de tests ya alineados a demos/theory; no proponer reescritura del scaffold.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si es una línea opaca)
1. S14-T1-A-E1, E2, E3  
2. S14-T1-B-E1, E2, E3  
3. S14-T2-A-E1, E2, E3  
4. S14-T2-B-E1, E2, E3  
5. S14-T3-A-E1, E2, E3 (E1: explicitar que el éxito es *ver* la corrupción)  
6. S14-T3-B-E1, E2, E3  
7. S14-T4-A-E1, E2, E3  
8. S14-T4-B-E1, E2, E3  

### P1 (I Do preamble + retrospective + why ampliado; You Do retrospective)
1. Las 8 demos S14-T1-A…T4-B-DEMO  
2. youDo retrospective de defensa  

### P2 (polish)
1. Ampliar `feedback` We Do con 1–2 oraciones de razonamiento (no solo síntoma) donde quede corto tras P0  
2. Suavizar hints spoiling en T2-B-E2 (`newaxis`) y similares en E3  
3. Alinear `why` I Do al rango 40–90 palabras del spec  

**Orden de implementación sugerido al Fixer:** P0 por subtema T1→T4 (mantiene fade mental), luego P1 demos en el mismo orden, luego youDo retrospective, luego P2.

---

## Residual risks

1. **Filename vs. contenido:** `s14-security.ts` / id `security` puede confundir a revisores y a scripts de auditoría; el contenido es NumPy/CP-N2-A. No renombrar en round de pedagogía salvo campaña aparte; documentar en reportes.
2. **T3-A-E1 “éxito = corrupción”:** sin preamble explícito, un newbie cree que el curso enseña a mutar raw en producción. El Fixer debe dejar el contraste E1/E2 cristalino.
3. **Hints spoiling en transfer:** E3 y algunos E2 regalan la API (`a[:, None]`, `writeable=False`). Tras añadir preambles, bajar el spoiling de hints mejora el fade real.
4. **Bench dependiente de máquina:** demos y youDo ya usan `ratio_gt_1` / `ratio > 0`; el Fixer no debe “fijar” un ratio numérico en prosa de éxito.
5. **Longitud de preambles:** al aplicar, respetar 80–150 palabras (o 4 bullets); las propuestas de este report están calibradas a ese techo — no expandir a mini-ensayos en el source.
6. **No tocar outputs canónicos** al añadir campos: tests de la app y soluciones ya están alineados; solo campos pedagógicos nuevos (`title`, `preamble`, `retrospective`, etc.).

---

## Summary counts for Fixer

| Unidad | Faltantes principales | Severity |
|--------|----------------------|----------|
| 8 × iDo | preamble, retrospective; why corto | P1 |
| 24 × weDo | title, preamble, retrospective; instruction mezclada | P0 |
| 1 × youDo | retrospective | P1 |

**Código/soluciones:** en general **no** requieren cambio pedagógico de output. Única atención de copy: claridad verbal en T3-A-E1 (demostrar view) y T4-A-E3 (qué se imprime exactamente).

Section 14 exercise pedagogy review complete. Ready for the Fixer prompt.
