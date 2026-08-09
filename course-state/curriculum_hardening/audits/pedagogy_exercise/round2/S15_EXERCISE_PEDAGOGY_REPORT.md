# S15 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Pandas: ingesta, selección y tipos
- **shortTitle:** Pandas ingesta
- **id:** `stdlib-deep`
- **index:** 15
- **source file:** `src/lib/course/sections/s15-stdlib-deep.ts`
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtopics:** T1-A Series/DF/Index · T1-B parser CSV/Excel · T2-A loc/iloc/assign · T2-B chained assignment/copy · T3-A strings/nullable/fechas/category · T3-B schema/coerción · T4-A export CSV/Excel/contrato · T4-B manifest/memoria/hash
- **hilo de caso:** retailer peruano sintético (Lima/Arequipa/Cusco, ids `C00x`/`T00x`, montos PEN) · incremento **CP-N2-A**
- **live:** https://pillb.github.io/pyarcana/
- **Round 1 context:** `round1/S15_EXERCISE_PEDAGOGY_REPORT.md` (histórico only — not acceptance proof)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length targets, preamble/retrospective checklists, E1→E2→E3 fade, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Scored residual quality for a true newbie (what / why / success / what sticks), not mere field presence
- Word counts measured only for length gates (no generators of educational prose)
- No bulk generation; **no source edits** in this round

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| You Do has `retrospective` | **Met** (~68 palabras; defensa oral + ética score) |
| E1→E2→E3 fade preserved | **Met** (guided / independent / transfer; superficies distintas por subtema) |
| Tasks, starters, solutions, tests largely intact | **Met** (`# Error a corregir:` / DEFECT nombrado; outputs canónicos intactos) |
| Feedback expanded beyond one-line symptom | **Mostly met** (razonamiento en la mayoría; algunos siguen cortos o colapsan con retro) |
| I Do `why` en rango ~40–90 | **Met** en 8/8 (≈40–55 palabras) |

**Verdict:** Round-1 cerró el P0 sistémico “falta el andamiaje pedagógico verbal.” Round-2 **no** encuentra una nueva crisis de campos ausentes. El trabajo residual es de **calidad**: retrospectives puente-only (sin misconception o auto-chequeo), colapso feedback↔retrospective en 2 unidades, feedback ultra-corto en export/manifest, y en E3 de transferencia un exceso de API exacta en `instruction` (copy-from-instruction).

Bullet preambles de 4 líneas (**Contexto / Meta / Éxito / Límites**) cumplen el spec aunque midan &lt;80 palabras: el spec permite “80–150 words **(or 4 short bullets)**”. No se piden reescrituras masivas de preambles solo por contaje.

---

## Scoring key (residual quality for a true newbie)

| Score | Meaning |
|-------|---------|
| **Strong** | Checklist sólido; longitudes OK; sin spoiler indebido; misconception + transfer claros; sin cambio obligatorio |
| **Adequate** | Usable; nits menores (longitud, polish, solapamiento leve) |
| **Needs residual** | Spoiler de transferencia, metacognición delgada, colapso feedback/retro, o fallo claro de rol/longitud |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

Cuando **no** se propone texto residual: el Fixer puede dejar la unidad sin cambios.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Retrospectives puente-only / muy cortas** | Peor: T3-A-E1 (~17w), T4-A-E1 (~17w), T4-B-E1 (~21w), T4-B-E2 (~22w), T2-A-E1 (~24w), T1-B-E1 (~25w), T3-B-E1 (~23w). Varios iDo ~30–36w con cierre = “We Do practica X” | Newbie cierra la pestaña sin misconception ni auto-chequeo | **P1** en los peores · **P2** en el resto del clúster |
| **Feedback ≈ retrospective** | T2-B-E2: “warning o la mutación fantasma regresan en producción” en ambos. T4-A-E2: abre con “Un BytesIO vacío no es un export” en ambos | El loop de práctica deliberada colapsa; el retro pierde trabajo metacognitivo | **P1** |
| **Feedback ultra-corto** | T4-B-E2 ~14w; T4-A-E3 ~15w; T2-B-E3 ~16w; T3-A-E3 ~18w (piso 25–60) | Corrección sin *razonamiento* del error típico | **P2** (P1 si el retro también es delgado en la misma unidad) |
| **E3 instruction con API exacta** | T1-A-E3: `s1.add(s2, fill_value=0)`; T2-A-E3: `iloc[1, 0]`; T4-B-E3: `blob = df.to_csv...hexdigest()[:8]` | Transferencia se vuelve “copiar de la instrucción” | **P2** (no reescribir starters; solo aflojar migas en instruction/hints) |
| **I Do retro solapa el puente del `why`** | T2-A, T4-A, T4-B: el cierre repite el listado “We Do practica …” del `why` sin misconception nuevo | Tras la demo no hay cierre distinto | **P2** · **P1** si además el retro es &lt;~32w y sin self-check (T4-B-DEMO) |
| **Hints E1 spoiling** | T1-A-E1, T2-A-E1, T3-B-E1: `hints[0]` es casi la solución | Aceptable en **guided**; no priorizar salvo que se toque la unidad por otro P1 | **P2 note** |
| **Código / outputs** | Hashes (`309b0e45`, demo manifest), fixtures `SIN_DATO`, openpyxl | No tocar salvo execute-and-diff justificado | **—** (preservar) |

**Section severity theme (Round 2):** shell sólido post-R1; residual es **P1 en metacognición y colapso feedback/retro**, más **P2 de longitud/dedup y migas de E3**. Ninguna unidad debe reescribirse desde cero.

---

## Unit ledger

### I Do

### S15-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (predicción index/ids/C002) · constraints pass (sintético) · retrospective pass
- **Diagnosis:** R1 landed bien. Predict targets concretos; `why` explica etiqueta vs. orden; retro repara “segunda fila” y puente a We Do. Ligero eco del puente en `why` y retro — cosmético.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

### S15-T1-B-DEMO (iDo)
- **Scores:** preamble **Strong** (~68w, ligeramente bajo 80 pero con predict filas/nulos/dtype) · why **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Escena LatAm `;`/`15,50` excelente. Retro ancla misconception del decimal. Opcional expandir preamble +1 frase de “contrato de archivo”, no obligatorio.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

### S15-T2-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Needs residual** (~32w; puente solapa `why`)
- **Checklist:** context pass · goal pass · success pass · constraints pass (nota ética score) · retrospective partial
- **Diagnosis:** Escena de laboratorio + “predice quién es si” es fuerte. El retro confirma la máscara pero repite el listado We Do del `why` y no repara un misconception de encadenamiento `df[cols][rows]`.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Si puedes decir por qué `C003` es «si» y `C001`/`C004` son «no» sin reejecutar, ya lees máscaras booleanas. El error clásico es filtrar con `df[df.region==...][cols]` encadenado y luego pelear con SettingWithCopy. Pregunta: ¿la etiqueta `prioridad_revision` es un veredicto sobre personas o un flag de laboratorio? We Do T2-A: umbral inclusivo, `assign` e `iloc`.
- **Code/output changes:** none

### S15-T2-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~39w)
- **Checklist:** all pass
- **Diagnosis:** “flag en pantalla / desaparece al exportar” ancla el bug. Retro separa padre vs. subset. Opcional +1 self-check (“¿el padre tiene `owner`?”) — no obligatorio.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

### S15-T3-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** (~40w piso) · retrospective **Needs residual** (~33w)
- **Checklist:** pass con cierre delgado
- **Diagnosis:** Predict `na_monto`/`na_alta` excelente. Retro confirma conteo pero no nombra el misconception “coerce limpia el lote en silencio” (sí está en preamble; el cierre debería reafirmarlo).
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Si puedes decir por qué hay 1 NaN en monto y 1 en alta sin reejecutar, ya separas fallo de conversión de «dato bueno». Coerce **sin** conteo es basura elegante: el número de NaN es evidencia, no ruido. Pregunta: ¿`?` y `2024-13-01` son nulos del parser o fallos de conversión? We Do T3-A: category, `to_numeric` y `to_datetime` por separado.
- **Code/output changes:** none

### S15-T3-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~36w)
- **Checklist:** all pass
- **Diagnosis:** Demo estrella; par `(df, report)` y KeyError bien motivados. Retro distingue reporte 0 vs 1. Opcional self-check sobre nulo previo vs. coerción nueva — mejora menor.
- **Severity residual:** P2 (opcional)
- **Proposed residual retrospective (full text, optional):**  
  Si puedes explicar por qué `cliente_id` reporta 0 y `monto` reporta 1, ya separas «ya era nulo» de «la conversión lo volvió nulo». Fail-closed (columna faltante) no se negocia con defaults. Pregunta: ¿dónde viaja el `report` en CP-N2-A — junto al DF o en un chat? We Do T3-B: delta, KeyError y dtype `string`.
- **Code/output changes:** none

### S15-T4-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Needs residual** (~34w; puente = listado del `why`)
- **Checklist:** pass con cierre delgado
- **Diagnosis:** openpyxl y assert post re-read bien. Retro no repara el misconception `Unnamed: 0` / “exporté bien porque el head se veía bien”.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Si puedes explicar por qué el assert de columnas va **después** del re-read, ya tienes el hábito de round-trip. El error clásico es confiar en el DF en memoria y descubrir `Unnamed: 0` al reingestar. Pregunta: ¿qué prueba el `excel_ok` además del CSV? We Do T4-A: CSV sin index, Excel en memoria y contrato de dtypes.
- **Code/output changes:** none (dependencia openpyxl intacta)

### S15-T4-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Needs residual** (~30w; principio + puente, sin self-check)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial
- **Diagnosis:** “hashea el blob, no el repr” es el núcleo. El cierre repite el puente del `why` y no empuja a defender provenance en 10 segundos.
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  Si puedes explicar por qué el hash debe salir del CSV y no del display, ya tienes provenance profesional. El error clásico es hashear `str(df)` o el index por defecto y obtener un “mismo dataset, hash distinto”. Pregunta de auto-chequeo: con el fixture de la demo, ¿`rows` es 3 y el hash es del payload con `index=False`? We Do T4-B: memoria deep, manifest mínimo y hash truncado.
- **Code/output changes:** none (hash canónico del demo intacto)

---

### We Do — T1-A

### S15-T1-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** (4 bullets) · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~31w)
- **Checklist:** all pass
- **Diagnosis:** DEFECT columns vs index excelente. Feedback razona ejes distintos. Retro útil; le falta 1 self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  El index estable es el puente a alinear tablas y auditar filas. No confundas «lista de columnas» con «lista de ids». Pregunta: si mañana reordenas el CSV, ¿tus etiquetas `C001`/`C002` siguen siendo las mismas? Siguiente (E2): leer un score por etiqueta, no por posición.
- **Code/output changes:** none

### S15-T1-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** (~23w, casi piso) · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Fade independiente limpio. Feedback nombra el síntoma 0.1 vs 0.9. Retro con “reordenas filas” es el sticky.
- **Severity residual:** P2 (feedback +2–5 palabras de razonamiento opcional)
- **Proposed residual feedback (full text, optional):**  
  `iloc[0]` lee la primera **posición** (0.1), no la etiqueta `C002`. Usa `s['C002']` o `s.loc['C002']` y `float(...)` para un print limpio. Si reordenas la Series, `iloc[0]` cambia y la etiqueta no.
- **Proposed residual:** none obligatorio en retro
- **Code/output changes:** none

### S15-T1-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (API exacta en paso 2) · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass; transfer integrity partial
- **Diagnosis:** Superficie de alineación es transferencia real. Instruction nombra `s1.add(s2, fill_value=0)` y quita el pensamiento de transferencia; el starter ya nombra el DEFECT. Aflojar un paso basta.
- **Severity residual:** P2
- **Proposed residual instruction (full text):**  
  1. Lee el DEFECT: `s1 + s2` deja NaN en `C001`.  
  2. Suma alineando por Index y rellenando huecos con 0 (método de Series, no `merge`).  
  3. Ordena con `sort_index()` y redondea a 2 decimales.  
  4. Imprime el dict (sin texto extra); verifica `{'C001': 1.0, 'C002': 2.5}`.
- **Code/output changes:** none (hints pueden seguir siendo más directos que instruction)

---

### We Do — T1-B

### S15-T1-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~25w)
- **Checklist:** pass; retro thin
- **Diagnosis:** `SIN_DATO` vs default `NA` es el hábito de calidad. Retro no repara “isna vio 0 porque el CSV está bien”.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Distingue nulos del parser (tokens por defecto) de marcadores del proveedor. Si `isna` da 0 con basura visible, el contrato del parser está incompleto — no el “CSV mágico”. Pregunta: ¿`SIN_DATO` es lo mismo que `NA` del default de pandas? Siguiente (E2): tipar fechas en la lectura.
- **Code/output changes:** none

### S15-T1-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Adequate** · instruction **Strong** · feedback **Needs residual** (~21w) · retrospective **Adequate**
- **Checklist:** pass
- **Diagnosis:** Meta clara. Feedback no nombra el costo de filtros temporales con strings.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  Sin `parse_dates` la columna queda como texto: un `head()` bonito miente. Declara el contrato en `read_csv` para que el dtype sea `datetime64` desde la ingesta y los filtros temporales no fallen en silencio.
- **Code/output changes:** none

### S15-T1-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (nombra `decimal`/`usecols` — aceptable en transfer de parser multi-param) · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Superficie LatAm + basura `z` es transfer auténtico. Instruction un poco dirigida pero el starter solo tiene `sep`; el learner aún debe combinar tres params. Self-check en retro bueno.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do — T2-A

### S15-T2-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~24w)
- **Checklist:** pass; retro thin
- **Diagnosis:** Borde 0.5 pedagógico excelente. Feedback “no es pandas raro” es de oro. Retro sin self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Umbral inclusivo vs. estricto es un error de negocio disfrazado de off-by-one. Pregunta: si el gate dice «score al menos 0.5», ¿qué comparador usas? Siguiente (E2): derivar columnas con `assign` sin mutar a ciegas.
- **Code/output changes:** none

### S15-T2-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Adequate** · instruction **Strong** (nombra lambda — guided-ish para independent; aceptable con DEFECT `*1`) · feedback **Adequate** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Factor incorrecto + in-place es buen defecto. Fade E2 un poco spoon-fed en el paso 2; no reescribir si no se toca la unidad.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

### S15-T2-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (da `iloc[1, 0]` exacto) · feedback **Strong** · retrospective **Strong**
- **Checklist:** pass; transfer integrity partial
- **Diagnosis:** Superficie posicional es transfer. El paso 2 regala la celda; el starter ya dice el DEFECT `loc`.
- **Severity residual:** P2
- **Proposed residual instruction (full text):**  
  1. Lee el DEFECT: `loc[0, 0]` devuelve 1 (etiqueta, no “abajo-izquierda”).  
  2. Lee por **posición** la celda inferior izquierda del DF 2×2 (base 0).  
  3. Envuelve en `int(...)` e imprime solo ese número.  
  4. No reindexes el DataFrame; verifica `3`.
- **Code/output changes:** none

---

### We Do — T2-B

### S15-T2-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~28w)
- **Checklist:** pass
- **Diagnosis:** Un solo `loc` + `fillna` solo al print es el hábito correcto. Retro sin self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Un solo `loc` es el patrón seguro de mutación del padre. El error clásico es la cadena que no escribe y el ticket de calidad que regresa al exportar. Pregunta: ¿`fillna('')` inventa un valor de negocio o solo limpia el print? Siguiente (E2): copiar el subset antes de mutarlo.
- **Code/output changes:** none

### S15-T2-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual** (colapso léxico)
- **Checklist:** pass en meta; fail en separación feedback/retro
- **Diagnosis:** Misma frase de “mutación fantasma en producción” en feedback y retrospective. Feedback debe corregir el *cómo ahora*; retro el *principio + cuándo reutilizar*.
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  El starter hace `sub = df.loc[...]` y muta: es un slice sin independencia. Encadena `.copy()` tras el `loc` del filtro y **después** asigna `ok=True`. El print debe salir de ese subset materializado.
- **Proposed residual retrospective (full text):**  
  `.copy()` declara que el subset tiene vida propia (p. ej. viaja a una función de DQ). Sin eso, el warning o la mutación fantasma regresan en producción. Pregunta: si solo lees el subset, ¿necesitas `copy`? Siguiente (E3): mutar la copia y demostrar que el original no cambió.
- **Code/output changes:** none

### S15-T2-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~16w) · retrospective **Strong**
- **Checklist:** pass
- **Diagnosis:** Alias vs copy es transfer conceptual fuerte; self-check en retro excelente. Feedback demasiado corto.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  `c = df` no copia: es el mismo objeto. Tras `c.iloc[0,0] = 99`, el original también cambia. Usa `df.copy()`, muta solo `c`, e imprime `df['score']` — debe seguir `[1.0, 2.0]`.
- **Code/output changes:** none

---

### We Do — T3-A

### S15-T3-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Adequate** (bullets OK; job hook corto) · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~17w — peor de la sección)
- **Checklist:** context/goal/success pass · retrospective **fail** (solo puente)
- **Diagnosis:** DEFECT object vs category limpio. El retro es “higiene + siguiente E2” sin misconception ni auto-chequeo. Newbie no se lleva *por qué* el orden title→category importa.
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  Normalizar texto **antes** de `category` evita dos categorías para el mismo valor de negocio (`lima`/`Lima`). El error clásico es castear a category y “limpiar mayúsculas después”, cuando ya fijaste etiquetas duplicadas. Pregunta: ¿cuántas categorías distintas tendrías con el fixture del starter si omites `title`? Siguiente (E2): montos basura a NaN contable.
- **Code/output changes:** none

### S15-T3-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Adequate** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~25w)
- **Checklist:** pass; retro thin
- **Diagnosis:** try/except del starter enseña el fallo. Retro menciona “primer paso del reporte” pero no empuja el conteo como hábito.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Coerce sin conteo es ocultar basura; el NaN visible en la lista es el embrión del `coercion_report`. Pregunta: ¿cuántos NaN nuevos hay aquí y en qué posición? Siguiente (E3): el mismo principio en fechas con NaT.
- **Code/output changes:** none

### S15-T3-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~18w) · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** ignore vs coerce es transfer real. Feedback corto; retro con pregunta de pipeline auditado es fuerte.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  `errors='ignore'` no deja un NaT contable de forma fiable: la basura puede seguir como string opaco. Usa `errors='coerce'`, cuenta con `isna` (NaT es nulo) e imprime el entero — aquí debe ser `1`.
- **Code/output changes:** none

---

### We Do — T3-B

### S15-T3-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~23w)
- **Checklist:** pass
- **Diagnosis:** Delta isna es el núcleo de CP-N2-A. Retro nombra el principio pero no self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  El delta es honestidad de métrica: nulos del parser ≠ fallos de conversión. Pregunta: si `before` ya tuviera un nulo y conviertes un `'x'`, ¿el delta sería 1 o 2? Siguiente (E2): si falta la columna del schema, no inventes defaults.
- **Code/output changes:** none

### S15-T3-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Fail-closed + “mentira de pipeline” ancla bien. Feedback y retro están separados (rellenar vs. contrato). Sin cambio obligatorio.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

### S15-T3-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** `string` vs `object` + “no category para ids” es transfer de schema. Self-check en retro bueno.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do — T4-A

### S15-T4-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Adequate** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~17w — puente-only)
- **Checklist:** pass; retrospective fail
- **Diagnosis:** Round-trip `Unnamed` es el hábito de export. El retro es solo “prueba mínima + siguiente E2”.
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  Round-trip de columnas es la prueba mínima de export: escribes, reposicionas el buffer, relees y comparas el schema. El error clásico es `index=True` por costumbre y un `Unnamed: 0` que rompe el contrato al reingestar. Pregunta: ¿por qué `seek(0)` es parte del test y no un detalle de IO? Siguiente (E2): Excel en memoria con openpyxl.
- **Code/output changes:** none

### S15-T4-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual** (colapso de apertura)
- **Checklist:** pass en meta; fail en separación feedback/retro
- **Diagnosis:** Ambos bloques abren con “Un BytesIO vacío no es un export.” Feedback debe orientar al fix; retro a honestidad de dependencias + transfer.
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  El starter imprime sobre un buffer vacío. Escribe un DF mínimo con `to_excel(..., index=False, engine='openpyxl')` y vuelve a medir `len(bio.getvalue()) > 0`. Si falta el motor, instálalo (`pip install openpyxl`) o documenta el límite — no hardcodees `True`.
- **Proposed residual retrospective (full text):**  
  La honestidad de dependencias es parte de la calidad: un “export Excel” sin `openpyxl` es teatro. Pregunta: ¿qué entregarías si el entorno no tiene el motor (CSV + schema JSON)? Siguiente (E3): contrato de dtypes sin motor Parquet.
- **Code/output changes:** none

### S15-T4-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~15w) · retrospective **Strong**
- **Checklist:** pass
- **Diagnosis:** Dict de dtypes es transfer de serialización. Feedback es “no dejes vacío” sin *por qué* `str(dtype)` y `sorted`.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  Un `contract = {}` no documenta el schema. Llena `{col: str(df[col].dtype) for col in df.columns}` y ordena al imprimir (`dict(sorted(...))`) para un assert estable entre corridas.
- **Code/output changes:** none

---

### We Do — T4-B

### S15-T4-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Adequate** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~21w)
- **Checklist:** pass; retro thin
- **Diagnosis:** `deep=True` bien motivado. Retro “optimización honesta” sin self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Medir antes/después de castear es el hábito de optimización honesta. El error clásico es imprimir un booleano fijo o usar `deep=False` y subestimar strings. Pregunta: ¿por qué este fixture de regiones necesita `deep=True`? Siguiente (E2): armar el manifest mínimo de filas y columnas.
- **Code/output changes:** none

### S15-T4-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~14w) · retrospective **Needs residual** (~22w)
- **Checklist:** pass en meta; metacognición parcial
- **Diagnosis:** Feedback es casi la solución en dos asignaciones sin razonar reconciliación. Retro es esqueleto + puente, sin misconception.
- **Severity residual:** P1
- **Proposed residual feedback (full text):**  
  El starter deja `rows=0` y `columns=[]`: eso no reconcilia nada. Toma hechos del DF real (`len(df)`, `df.columns.tolist()`) y publícalos en el manifest. Un Index de columnas no es lo mismo que una lista serializable.
- **Proposed residual retrospective (full text):**  
  Filas y columnas son el esqueleto del manifest; hash y `source` completan la provenance. El error clásico es hardcodear ceros “porque el print pasa” y mentir en la reconciliación de ingesta. Pregunta: si el DF crece a 300 filas, ¿qué debe cambiar en el print? Siguiente (E3): hashear el artefacto exportado.
- **Code/output changes:** none

### S15-T4-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (línea canónica completa) · feedback **Strong** · retrospective **Strong**
- **Checklist:** pass; transfer integrity partial
- **Diagnosis:** Contraste `str(df)` vs `to_csv` es el sticky de provenance. Instruction regala la serialización exacta; el starter ya nombra el DEFECT. Aflojar migas preservando output `309b0e45`.
- **Severity residual:** P2
- **Proposed residual instruction (full text):**  
  1. Lee el DEFECT: se hashea `str(df)`, no el artefacto.  
  2. Serializa el DF a CSV **sin** index y codifica a bytes.  
  3. Calcula SHA-256 de ese blob e imprime los primeros 8 hex.  
  4. Verifica `309b0e45` (mismo fixture; no cambies el DF).
- **Code/output changes:** none (preservar fixture y hash canónico)

---

### You Do

### S15-YouDo (youDo)
- **Scores:** context **Strong** · objectives/requirements/rubric **Strong** · portfolioNote **Strong** · retrospective **Strong** (~68w)
- **Checklist:** context pass · goal pass · success pass (via `_run_tests`/rubric) · constraints pass (SIN_DATO, fail-closed, sin PII, score ≠ culpa) · retrospective pass
- **Diagnosis:** R1 closed the only gap (missing retrospective). Defensa oral (1)(2)(3), ética del score y impacto medible están presentes. `portfolioNote` ya pide 30s sobre el delta de coerción — alineado al retro sin colapsar.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none (no tocar starter ni asserts)

---

## Priority order (Round 2 Fixer)

### P1 (integridad de aprendizaje / metacognición / colapso de roles)
1. **S15-T3-A-E1** — retrospective puente-only (~17w) → full text arriba  
2. **S15-T4-A-E1** — retrospective puente-only (~17w)  
3. **S15-T4-B-E2** — feedback ultra-corto + retro delgado  
4. **S15-T2-B-E2** — colapso feedback ↔ retrospective  
5. **S15-T4-A-E2** — colapso “BytesIO vacío…” en feedback y retro  
6. **S15-T4-B-DEMO** — retrospective delgado / sin self-check de provenance  

### P2 (polish: longitudes, feedback, E3 migas, iDo cierres)
7. **S15-T2-A-DEMO**, **S15-T3-A-DEMO**, **S15-T4-A-DEMO** — retros con misconception/self-check (full text opcional arriba)  
8. **S15-T1-A-E1**, **S15-T1-B-E1**, **S15-T2-A-E1**, **S15-T2-B-E1**, **S15-T3-A-E2**, **S15-T3-B-E1**, **S15-T4-B-E1** — alargar retros delgadas  
9. **S15-T1-A-E2**, **S15-T1-B-E2**, **S15-T2-B-E3**, **S15-T3-A-E3**, **S15-T4-A-E3** — feedback al piso 25–60 con razonamiento  
10. **S15-T1-A-E3**, **S15-T2-A-E3**, **S15-T4-B-E3** — aflojar instruction de transferencia (sin cambiar solución/output)  
11. **S15-T3-B-DEMO** — retro opcional con self-check de report 0 vs 1  

### No change required (shell + calidad residual suficiente)
- iDo: T1-A, T1-B, T2-B  
- weDo: T1-B-E3, T2-A-E2, T3-B-E2, T3-B-E3  
- youDo: **S15-YouDo**  

---

## Residual risks
- **openpyxl:** T4-A demo/E2 siguen dependiendo del motor; no “arreglar” código para ocultar la dependencia.  
- **Hashes canónicos** (T4-B-E3 `309b0e45`, demo manifest): no tocar fixtures ni `index`/`line_terminator`.  
- **Plantillas del Fixer:** el riesgo R1 de prosa genérica se materializó como retros “Siguiente (E2)…” clónicas — el R2 Fixer debe **reescribir a mano** solo las unidades P1/P2 listadas, no regenerar las 24.  
- **Score sintético ≠ culpa:** mantener nota ética en T2-A demo y You Do.  
- **SIN_DATO:** no simplificar a `NA` en fixtures de T1-B-E1 ni You Do.  
- **E3 aflojado:** al quitar API exacta de `instruction`, no vaciar el starter DEFECT ni las hints progresivas (hints pueden ser más directas que instruction en transfer).

---

## Summary counts for Fixer (Round 2)

| Tipo | Unidades | Residual dominante | Acción típica |
|------|----------|--------------------|---------------|
| iDo | 8 | 1× P1 (T4-B) + 3× P2 retro | reescribir `retrospective` (a veces +self-check) |
| weDo | 24 | 5× P1 (T3-A-E1, T4-A-E1, T4-B-E2, T2-B-E2, T4-A-E2) + cluster P2 | retro y/o feedback; 3 instructions E3 |
| youDo | 1 | none | leave |
| **Total con texto propuesto prioritario** | **~6 P1 + ~15 P2 opcionales** | | hand-craft only |

**No se editó** `s15-stdlib-deep.ts` en este round — solo este reporte.

Section 15 exercise pedagogy review complete. Ready for the Fixer prompt.
