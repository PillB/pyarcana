# S14 Exercise Pedagogy Report (Round 2)

## Section
- **title:** NumPy y cómputo vectorizado
- **shortTitle:** NumPy vectorizado
- **id:** `security` (archivo histórico `s14-security.ts`; contenido = ndarray/máscaras/ufuncs/broadcast/views/NaN/bench/`allclose`, **no** seguridad de modelos)
- **index:** 14
- **source file:** `src/lib/course/sections/s14-security.ts`
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** S14-T1-A dtype/shape · T1-B indexación/máscaras · T2-A ufuncs/reducciones/unicidad · T2-B broadcasting · T3-A views/copies · T3-B NaN/inf · T4-A vectorizar vs loop · T4-B memoria/`allclose`
- **hilo de caso:** CASO-LIM-014 / incremento **CP-N2-A** (tablero de calidad vectorizado; puente S13 → S15)
- **live:** https://pillb.github.io/pyarcana/
- **Round 1 context:** `round1/S14_EXERCISE_PEDAGOGY_REPORT.md` (histórico only — **not** acceptance proof)

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
| I Do `why` in ~40–90 words | **Met** (≈42–59 w across demos) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do preambles answer context/goal/success/constraints | **Met** (bullet form) |
| You Do has `retrospective` | **Met** (~86 w; defense triad) |
| E1→E2→E3 fade preserved (distinct surfaces, not clones) | **Met** |
| Named defects (`# Bug a corregir` / CASO-LIM-014), solutions, outputs intact | **Met** |
| Feedback with reasoning (not only symptom) on high-stakes units | **Mostly met** (some thin or echo retro) |
| T3-A-E1 “éxito = ver corrupción” explicit for newbie | **Met** (preamble: demo controlado, no patrón de producción) |
| T2-B-E2 hints less spoiling than R1 (`[:, None]` not in first hint) | **Improved** (still mildly leading — residual P2) |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: a few E2/E3 instructions that paste the one-liner, thin We Do retrospectives (some under ~20 words), feedback↔retrospective role collapse on a handful of pairs, and late I Do retros under the soft floor.

---

## Scoring key (residual quality for a true newbie)

| Score | Meaning |
|-------|---------|
| **Strong** | Checklist solid; lengths OK; no spoiler; misconception + transfer clear; no required change |
| **Adequate** | Usable; small nits only (length, polish, mild overlap) |
| **Needs residual** | Spoiler, thin metacognition, feedback/retro collapse, or clear length/role failure |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Transfer / independent instruction spoiler** | `T2-A-E3` step 2 gives `X - X.mean(axis=1, keepdims=True)`; `T3-B-E3` step 2 gives full `np.where(np.isinf(x), np.nan, x)`; `T1-B-E2` step 3 gives `ids[scores < med].tolist()`; `T4-B-E2` step 2 gives `np.allclose(..., atol=1e-8)` | E2/E3 become “type the instruction,” not judgment | **P1** (T2-A-E3, T3-B-E3) · **P2** (T1-B-E2, T4-B-E2, T1-A-E2) |
| **Thin We Do retrospectives** | Worst: T3-B-E1 ~13 w · T4-B-E1 ~15 w · T4-A-E1 ~16 w · T2-A-E1 ~21 w · T2-B-E1 ~22 w (spec 40–80 soft floor) | Principle/misconception/self-check missing; transfer reduced to “siguiente E2” | **P1** (worst three) · **P2** (cluster under ~30 w) |
| **Thin I Do retrospective** | T4-A-DEMO ~22 w; T1-B/T2-A/T2-B/T3-B ~29–31 w | Demo closes without sticky “allclose before ratio” metacognition | **P1** (T4-A-DEMO) · **P2** (short demos) |
| **Feedback ≈ retrospective** | T2-B-E2 (outer/newaxis both); T2-A-E3 (keepdims/axis both); T4-A-E2 (sum lineal both) | Corrective loop and close share one slogan | **P1** (T2-B-E2, T2-A-E3) · **P2** (T4-A-E2) |
| **Thin We Do feedback** | T2-B-E3 ~20 w; T3-A-E2 ~20 w; T4-A-E2/E3 ~23 w (target 25–60) | Little *why it matters* for deliberate practice | **P2** |
| **Thin We Do preamble (word count)** | T4-B-E1 ~37 w; T3-B-E2 ~39 w — bullets still hit checklist | Minor; only thicken if editing same unit for other reasons | **P2** optional |
| **Hints still near-solution on E2** | T2-B-E2 “columna (4, 1)”; T4-B-E2 first hint is full allclose | Softens independent fade | **P2** |
| **You Do shell** | context / objectives / requirements / rubric / portfolioNote + retrospective present | Strong; no residual required | **—** |

**Section severity theme (Round 2):** shell is solid and aligned to CP-N2-A; **P1** only where learning integrity fails (E3 one-liner paste, metacognition under ~20 w on key units, feedback/retro collapse). Most of the rest is **P2 length/dedup**. No unit needs a from-scratch rewrite.

---

## Unit ledger

### I Do

### S14-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** (~70 w) · why **Strong** (~59 w) · retrospective **Strong** (~46 w)
- **Checklist:** context pass · goal pass · success pass (predict shapes/nbytes) · constraints pass (fail-closed) · retrospective pass
- **Diagnosis:** R1 prose landed. Newbie watches contract assert before any metric. No residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S14-T1-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~31 w, under soft floor)
- **Checklist:** all pass; retro short but hits `&` vs `and` + bridge to We Do
- **Diagnosis:** Prediction targets (`filtrados`, `count`) are clear. Optional self-check in retro only if batching I Do polish.
- **Severity residual:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Si sabes por qué `and` entre arrays falla y `&` funciona, ya evitas el bug clásico del newbie. Pregunta de auto-chequeo: ¿la máscara y `ids` tienen la misma longitud? We Do: umbral con `where`, filtro por mediana y reorden con fancy index.
- **Code/output changes:** none

### S14-T2-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~31 w)
- **Diagnosis:** Unicidad 0.75 vs 1.0 is the sticky beat. Retro could name `len/len` more explicitly — already does. Optional expand only if batching.
- **Severity residual:** optional P2
- **Proposed residual:** none required (leave unless batching short I Do retros)
- **Code/output changes:** none

### S14-T2-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~30 w)
- **Diagnosis:** Diagonal-zero prediction is excellent pedagogy. No required residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S14-T3-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~33 w)
- **Diagnosis:** Mal/bueno contrast is gold; “predice `raw_corrupto`” forces self-explanation. No residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S14-T3-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~29 w)
- **Diagnosis:** NaN ≠ 0 is clear. Optional thicken retro with self-check; not required.
- **Severity residual:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Si sabes por qué `mean` del vector crudo no es 0.7125, ya separas ausencia de valor. Auto-chequeo: ¿`nanmean` solo basta si aún hay `inf`? We Do: contar NaN, promediar omitiendo NaN y limpiar inf antes de sumar.
- **Code/output changes:** none

### S14-T4-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Needs residual** (~22 w)
- **Checklist:** pass on preamble/why; retrospective partial (principle only; thin misconception + no self-check)
- **Diagnosis:** Preamble correctly separates `allclose` from machine-dependent ratio. Retro collapses to a slogan; for a true newbie this is the highest-stakes honesty habit of T4.
- **Severity residual:** **P1**
- **Proposed residual `retrospective` (full text):**  
  Si internalizas “`allclose` antes del ratio”, ya haces benchmarks honestos: un número de velocidad sin oráculo no demuestra corrección. El error clásico es publicar solo el ratio o tratarlo como SLA. Auto-chequeo: ¿qué reportarías si `allclose` fuera `False`? We Do: comparar sumas, suma de cuadrados y timing de suma vectorizada.
- **Code/output changes:** none

### S14-T4-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~33 w)
- **Diagnosis:** O(n²) budget + assert path is clear. No required residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T1-A

### S14-T1-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~35 w)
- **Checklist:** all pass for guided tier
- **Diagnosis:** Named `shape[::-1]` defect; feedback anchors filas×columnas. Optional retro expand only if batching short retros.
- **Severity residual:** optional P2
- **Proposed residual:** none required
- **Code/output changes:** none

### S14-T1-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (mild spoiler) · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Independent tier should not paste `np.linspace(0, 1, 5, dtype=np.float64)` in full; goal + success already pin the output.
- **Severity residual:** **P2**
- **Proposed residual `instruction` (full text):**  
  1. El starter usa `arange(5)` e imprime solo la lista.  
  2. Sustituye por una malla en [0, 1] con 5 puntos y `dtype=float64` (no enteros consecutivos).  
  3. Imprime `itemsize`, `nbytes` y `tolist()` en una línea.  
  4. Verifica mentalmente: 5 × 8 = 40.
- **Code/output changes:** none

### S14-T1-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Fail-closed transfer with stable message; self-check question in retro. No residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T1-B

### S14-T1-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~25 w)
- **Diagnosis:** Complement threshold is well scaffolded. Retro short but names posición vs valor.
- **Severity residual:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Índice vectorizado es la base de fancy index y de reportes “filas problemáticas”. El misconception es confudir **posición** con **valor** del score. Auto-chequeo: si el umbral es inclusivo, ¿por qué `>` cambiaría el resultado? Siguiente: filtrar **ids** bajo la mediana (E2).
- **Code/output changes:** none

### S14-T1-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (near-solution) · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Step 3 prints the full solution expression. Independent fade needs goal-level steps; leave median API as soft breadcrumb only if needed in hints, not instruction.
- **Severity residual:** **P2**
- **Proposed residual `instruction` (full text):**  
  1. El starter filtra la mitad alta del lote (máscara invertida).  
  2. Calcula la mediana del vector de scores (no un umbral fijo 0.5).  
  3. Filtra los ids con score **bajo** esa mediana y pásalos a lista.  
  4. Conserva el orden original; no uses `mean` en lugar de mediana.
- **Code/output changes:** none

### S14-T1-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** `sorted` vs fancy index is a real transfer surface; step 4 check (first element 30) is good success cue without full paste beyond the necessary `a[order]`. Acceptable for transfer.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T2-A

### S14-T2-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~21 w)
- **Diagnosis:** Axis order + round is clear. Retro is a single slogan without misconception.
- **Severity residual:** **P2** (elevate to P1 only if Fixer has budget after worst retros)
- **Proposed residual `retrospective` (full text):**  
  Elegir el eje es elegir el significado de negocio (campo vs cliente), no un hábito de notebook. El error clásico es imprimir filas primero o omitir el redondeo y “no coincidir” con el tablero. Siguiente: unicidad de ids con `np.unique` (E2).
- **Code/output changes:** none

### S14-T2-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Classic `len/len` defect; feedback already names youDo assert. No residual required.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S14-T2-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (one-liner paste) · feedback **Adequate** · retrospective **Needs residual** (echo feedback)
- **Diagnosis:** Transfer dies if step 2 is the exact solution. Feedback and retro both rehearse keepdims/`axis=0`.
- **Severity residual:** **P1**
- **Proposed residual `instruction` (full text):**  
  1. El starter resta la media de **columnas** y luego promedia por el eje equivocado.  
  2. Centra **por fila** de modo que el rebroadcast no pelee shapes (media de cada fila, eje de columnas colapsado con tamaño 1).  
  3. Imprime la media por fila del resultado, redondeada.  
  4. Debe ser un vector de ceros (dentro de redondeo).
- **Proposed residual `retrospective` (full text):**  
  `keepdims` guarda el eje colapsado en tamaño 1 para rebroadcast. El misconception es “ya resté una media, da igual el eje”: con `axis=0` normalizas campos y la media por fila no se anula. Auto-chequeo: ¿qué shape tiene `X.mean(axis=1)` sin `keepdims` frente a `X`? Puente a T2-B: alinear pesos y scores con broadcast.
- **Proposed residual `feedback` (full text):**  
  Si la media por fila no es ~0, o centraste por columnas (`axis=0`) o perdiste el eje al restar. Resta la media de cada fila de forma que la matriz y el vector de medias sigan alineados; el tablero usa el mismo truco al normalizar perfiles de cliente.
- **Code/output changes:** none

---

### We Do · T2-B

### S14-T2-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~22 w)
- **Diagnosis:** `*` vs `+` defect is clean. Retro is slogan-only.
- **Severity residual:** **P2**
- **Proposed residual `retrospective` (full text):**  
  Sumar un vector a una matriz es el caso más simple de broadcast del tablero: el vector se alinea por la derecha a cada fila. El error clásico es multiplicar por ceros y creer que “funcionó” porque no hay excepción. Siguiente (E2): producto exterior con ejes insertados.
- **Code/output changes:** none

### S14-T2-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual** (≈ feedback)
- **Checklist:** pass; role collapse on close
- **Diagnosis:** R1 spoil (`a[:, None] * b` in preamble meta) is gone — good. Instruction keeps independent judgment. Feedback and retro both say “sin newaxis / hermano de pairwise_diff.”
- **Severity residual:** **P1** (dedup roles)
- **Proposed residual `feedback` (full text):**  
  Si ves `fail` o `ValueError`, los shapes `(4,)` y `(3,)` no se alinean sin un eje extra. Inserta dimensión en el vector que debe comportarse como **columna** (y, si hace falta, como **fila** en el otro). La primera columna de ceros del resultado confirma que `b[0]=0`, no un bug.
- **Proposed residual `retrospective` (full text):**  
  El outer product es el hermano menor de `pairwise_diff` del youDo: columna × fila → matriz de interacciones. El misconception es “si multiplico dos 1D, NumPy ya entiende filas y columnas”. Luego (E3): forzar y capturar la incompatibilidad a propósito.
- **Proposed residual hints (optional P2):**  
  Mantener primer hint sin shape numérico `(4, 1)`; p. ej. “Convierte `a` en columna antes de multiplicar por `b`.” Segundo hint puede mencionar shape objetivo `(4, 3)` sin la expresión `[:, None]`.
- **Code/output changes:** none

### S14-T2-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~20 w) · retrospective **Strong**
- **Diagnosis:** “Error is success” pedagogy is intact. Feedback thin.
- **Severity residual:** **P2**
- **Proposed residual `feedback` (full text):**  
  Shapes `(2,3)+(2,4)` son incompatibles. Captura `ValueError` e imprime solo `incompatible`. No “arregles” el segundo array a `(2,3)` solo para ver un número: en el tablero un shape casi correcto debe fallar ruidoso, no alinearse a medias.
- **Code/output changes:** none

---

### We Do · T3-A

### S14-T3-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~26 w)
- **Checklist:** all pass; **success = controlled corruption** is explicit (R1 residual risk closed)
- **Diagnosis:** Best-fixed unit from R1. Newbie cannot confuse this with production pattern if they read the preamble.
- **Severity residual:** —
- **Proposed residual:** none required (optional: one self-check in retro — leave unless batching)
- **Code/output changes:** none

### S14-T3-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~20 w) · retrospective **Strong**
- **Diagnosis:** Mirror of E1 is clear. Feedback is thin on *why* audit cares.
- **Severity residual:** **P2**
- **Proposed residual `feedback` (full text):**  
  Necesitas `.copy()` antes de mutar. Sin copia, `c` sigue siendo view del original y la auditoría del raw miente aunque no reasignes el nombre `raw`. Imprime raw y copia en ese orden: raw intacto, copia con el 9.
- **Code/output changes:** none

### S14-T3-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · feedback **Strong** · retrospective **Adequate** (~24 w)
- **Diagnosis:** Instruction names `writeable=False` (API is the skill); acceptable for transfer. Hints are softened (good). Retro has self-check question — slightly short.
- **Severity residual:** optional P2
- **Proposed residual `retrospective` (full text):**  
  `writeable=False` es defensa de contrato, no maquillaje: la función de normalización debe **fallar** si intenta escribir. Auto-chequeo: ¿cuándo preferirías `.copy()` (trabajar aislado) vs `writeable=False` (rechazar escritura)? Puente a T3-B: NaN/inf también “rompen” métricas si no hay política.
- **Code/output changes:** none

---

### We Do · T3-B

### S14-T3-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~13 w)
- **Diagnosis:** Classic `== nan` defect. Retro is the thinnest metacognitive close in the section.
- **Severity residual:** **P1**
- **Proposed residual `retrospective` (full text):**  
  Contar ausencias es tan importante como promediar presentes: el tablero publica tasa de NaN aparte de la media. El misconception es “`x == np.nan` detecta huecos” — IEEE hace que NaN no sea igual a sí mismo. Auto-chequeo: ¿contarías `inf` con `isnan`? Siguiente: `nanmean` vs `mean` (E2).
- **Code/output changes:** none

### S14-T3-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Adequate** (~39 w bullets) · instruction **Adequate** · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Naming `nanmean` is the learning target; mild API breadcrumb is OK at E2. Feedback already separates policy from zero-fill. No required residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S14-T3-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (full expression paste) · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Transfer should force inventing the map inf→nan; step 2 currently is the solution line.
- **Severity residual:** **P1**
- **Proposed residual `instruction` (full text):**  
  1. El starter hace `np.sum` y obtiene `inf`.  
  2. Antes de agregar, convierte los no-finitos `inf` en `nan` (no dejes el `inf` intacto).  
  3. Suma omitiendo NaN e imprime el float.  
  4. Confirma 1+2=3 (el `inf` no debe dominar).
- **Code/output changes:** none  
- **Validation notes:** Hints may keep a softer breadcrumb (`isinf` / `where`); do not put the full one-liner in `instruction`.

---

### We Do · T4-A

### S14-T4-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~16 w)
- **Diagnosis:** Printing fixed `False` is excellent defect design. Retro is slogan-only.
- **Severity residual:** **P1**
- **Proposed residual `retrospective` (full text):**  
  Equivalencia es el oráculo del portfolio: sin comparar loop y vectorizado, el timing no demuestra nada. El error clásico es imprimir un booleano fijo o solo mirar tiempos. Auto-chequeo: ¿por qué `dtype=float` aquí? Siguiente: una reducción vectorizada concreta (suma de cuadrados) sin loop.
- **Code/output changes:** none

### S14-T4-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** (~23 w; mild retro echo) · retrospective **Adequate**
- **Diagnosis:** “Almost the right ufunc” is good independent skill. Feedback and retro both hit linear sum — mild collapse.
- **Severity residual:** **P2**
- **Proposed residual `feedback` (full text):**  
  Si obtienes `10.0`, sumaste la serie lineal (0+1+2+3+4), no los cuadrados. Usa elevación al cuadrado y luego reduce; el tablero comete el mismo error cuando “vectoriza” la métrica equivocada.
- **Proposed residual `retrospective` (full text):**  
  La ufunc correcta es tan importante como “usar NumPy”. Un sum lineal “parece vectorizado” pero mide otra cosa (energía/norma al cuadrado ≠ suma de scores). Luego (E3): medir tiempo y verificar la media del resultado, no solo un elemento.
- **Code/output changes:** none

### S14-T4-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** (~23 w) · retrospective **Strong**
- **Diagnosis:** Timing + mean check; solution discards delta (coherent with not printing float). Optional thicken feedback.
- **Severity residual:** optional P2
- **Proposed residual `feedback` (full text):**  
  Mide solo la operación vectorizada (`a + b`) y verifica `mean == 1.0`. Chequear solo `c[0]` deja pasar un array a medias; no midas el loop del starter ni imprimas el float del tiempo — solo la etiqueta y el booleano.
- **Code/output changes:** none

---

### We Do · T4-B

### S14-T4-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Adequate** (~37 w) · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~15 w)
- **Diagnosis:** float32 vs float64 budget defect is clear. Retro is ornamental.
- **Severity residual:** **P1**
- **Proposed residual `retrospective` (full text):**  
  `nbytes` es evidencia de portfolio, no un print ornamental: `itemsize × size` es el mismo hábito que el budget n×n del demo. El misconception es “pensé en float32” (4000). Auto-chequeo: ¿cuántos bytes tiene una matriz 500×500 float64? Siguiente: comparar floats con tolerancia (E2).
- **Code/output changes:** none

### S14-T4-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (mild API paste) · feedback **Strong** · retrospective **Adequate** (~23 w)
- **Diagnosis:** Exact `np.allclose(..., atol=1e-8)` in step 2 weakens independent judgment; success already pins `True`.
- **Severity residual:** **P2**
- **Proposed residual `instruction` (full text):**  
  1. El starter hace igualdad exacta elemento a elemento y obtiene False.  
  2. Compara los dos vectores con tolerancia absoluta adecuada al ruido 1e-9 del fixture (orden 1e-8).  
  3. Imprime solo el booleano.  
  4. No aprietes la tolerancia por debajo del ruido del fixture.
- **Proposed residual `retrospective` (full text):**  
  `allclose` (y `assert_allclose` en tests) es el puente entre “más rápido” y “igual de correcto”. El misconception es “si no son idénticos bit a bit, falló la vectorización”. Luego (E3): forzar un fallo controlado del assert.
- **Code/output changes:** none

### S14-T4-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong** (~37 w)
- **Diagnosis:** “Design the red test” closes the We Do track well and bridges to youDo. No residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### You Do

### youDo — Métricas de calidad y señales por pares vectorizadas (inicio CP-N2-A)
- **Scores:** context **Strong** · objectives **Strong** · requirements **Strong** · rubric **Strong** · portfolioNote **Strong** · retrospective **Strong** (~86 w)
- **Checklist:** context pass · goal pass · success pass (`_run_tests`) · constraints pass (sin PII, solo NumPy) · retrospective pass
- **Diagnosis:** Defense triad (invariants / PII vs sintéticos / impacto medible) is present; ratio ≠ SLA is explicit. Starter contracts and NaN/inf cases remain solid. No residual required.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none  
- **Optional note (not a fix):** a one-line delivery order in `context` (“métricas → pares → bench → nota”) remains optional polish only — do not expand into a second essay.

---

## Priority order

### P1 (learning integrity — do first)
1. **S14-T2-A-E3** — defade instruction (remove one-liner); rewrite feedback + retrospective roles  
2. **S14-T3-B-E3** — defade instruction (inf→nan without pasting `where` expression)  
3. **S14-T2-B-E2** — split feedback vs retrospective (both currently outer/newaxis)  
4. **S14-T4-A-DEMO** — expand retrospective (allclose-before-ratio sticky close)  
5. **S14-T3-B-E1** — expand retrospective (~13 w → full checklist)  
6. **S14-T4-A-E1** — expand retrospective  
7. **S14-T4-B-E1** — expand retrospective  

### P2 (polish — after P1, or when already editing the unit)
1. **Instruction mild spoilers:** T1-A-E2 (`linspace` full call), T1-B-E2 (full filter expr), T4-B-E2 (`allclose` full call)  
2. **Short retrospectives / feedback:** T2-A-E1, T2-B-E1, T2-B-E3, T3-A-E2, T4-A-E2 (feedback/retro mild echo), T1-B-E1, T3-A-E3  
3. **Optional I Do retro thicken:** T1-B-DEMO, T3-B-DEMO  
4. **Hints:** T2-B-E2 drop explicit `(4, 1)` in first hint  

**Orden sugerido al Fixer:** P1 transfer spoilers (T2-A-E3, T3-B-E3) → P1 feedback/retro split (T2-B-E2) → P1 thin retros (I Do T4-A + We Do T3-B-E1, T4-A-E1, T4-B-E1) → P2 cluster.

---

## Residual risks

1. **Filename vs. contenido:** `s14-security.ts` / id `security` sigue siendo trampa para revisores y scripts; no renombrar en round de pedagogía.
2. **T3-A-E1 “romper a propósito”:** R1 risk is **closed** in current prose; do not soften the intentional corruption output.
3. **No tocar outputs canónicos** al reescribir instruction/feedback/retro: solutions y tests del youDo ya alineados.
4. **Bench dependiente de máquina:** no fijar ratios numéricos en prosa de éxito; `ratio_gt_1` / `ratio > 0` se mantienen.
5. **Longitud:** preambles en bullets ya cumplen checklist con menos de 80–150 palabras corridas — no expandir a mini-ensayos; sí expandir **retrospectives** que estén bajo ~20–25 palabras.
6. **Hints spoiling residual:** tras P1, un pass P2 en hints de E2 (T2-B-E2, T4-B-E2) mejora el fade real sin cambiar código.
7. **Over-fix:** la mayoría de unidades están en Strong/Adequate; Fixer no debe reescribir preambles fuertes de R1 “por simetría”.

---

## Summary counts for Fixer

| Unidad | Shell R1 | Residual R2 principal | Severity |
|--------|----------|----------------------|----------|
| 8 × iDo | preamble + why + retro presentes | T4-A retro thin; 2–3 retros opcionales | 1× **P1**, resto —/P2 |
| 24 × weDo | title + preamble + instruction + retro presentes | 2× E3 instruction spoiler; 1× feedback/retro collapse; 3× retro &lt;20 w; mild E2 spoilers | **7× P1** items (across 7 units), resto P2/— |
| 1 × youDo | retrospective de defensa presente | none | **—** |

**Código/soluciones/outputs:** no requieren cambio pedagógico. Solo campos de prosa: `instruction` (defade), `feedback`, `retrospective` (y hints opcionales).

---

## Acceptance checklist for Round-2 Fixer

- [ ] P1 instruction defade: T2-A-E3, T3-B-E3 (no one-liner paste)
- [ ] P1 feedback/retro roles: T2-B-E2 (and T2-A-E3 retro/feedback pair)
- [ ] P1 retrospectives expanded: T4-A-DEMO, T3-B-E1, T4-A-E1, T4-B-E1
- [ ] P2 only if time: E2 mild spoilers, thin feedback cluster, optional I Do retros
- [ ] Exact solution outputs preserved
- [ ] Spanish PE; no real PII; CASO-LIM-014 / CP-N2-A thread intact
- [ ] No generators; hand-edited prose only
- [ ] Section source compiles in static build

Section 14 exercise pedagogy review complete. Ready for the Fixer prompt.
