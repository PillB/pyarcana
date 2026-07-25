# S04 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Iteración y resúmenes transaccionales
- **id:** `functions-modules`
- **index:** 4
- **shortTitle:** Iteración & Resúmenes
- **source file:** `src/lib/course/sections/s04-functions-modules.ts`
- **counts:** iDo **8**, weDo **24**, youDo **1**
- **subtopics:** S04-T1-A, S04-T1-B, S04-T2-A, S04-T2-B, S04-T3-A, S04-T3-B, S04-T4-A, S04-T4-B (E1→E2→E3 cada uno)
- **live site:** https://pillb.github.io/pyarcana/

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, lengths, E1/E2/E3 fade, checklists).
- Inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the canonical source.
- Cross-checked against section story (lotes de intake, gate CP-N1-A, CASO-LIM-004, datos sintéticos).
- Hand-crafted diagnosis and proposed prose per unit (Peruvian professional Spanish).
- **No** bulk generation, templates, scripts, or cross-section copy-paste of educational prose.
- **No** source edits in this round — report only.

## Global findings (section-level)

| Pattern | Observation |
|---------|-------------|
| Missing `preamble` | **All** 8 I Do + **all** 24 We Do: field absent. |
| Missing `retrospective` | **All** 8 I Do + **all** 24 We Do + You Do: field absent. |
| Missing We Do `title` | **All** 24 We Do: no short header; UI falls back to id/instruction. |
| Instruction style | Classic “E* (nivel) — Concepto: … Fixture: … Contrato: …” terminal-drill blend. Success criteria often *buried* in the same paragraph, not framed as meta/éxito. |
| `why` (I Do) | Present and technically sound, but **too short** (often 1 line) vs. 40–90 word target; no pre-code orientation. |
| `feedback` (We Do) | One-liner slogans (≈8–15 words); fails deliberate-practice feedback (no *reasoning*). |
| Fade E1→E2→E3 | **Mechanically present** (guided / independent / transfer + distinct defects). Surface form of prompts is still same “Concepto+fixture” mold — not three clones of content, but weak scaffold *language* differentiation. |
| Starter defects | Generally good and named in `# DEFECT:` comments. E1 often near-complete; E3 transfers surface. |
| You Do frame | Strong `context` / `objectives` / `requirements` / `rubric` / `portfolioNote`. Only gap is metacognitive **retrospective** after build. |
| Code/outputs | Canonical solutions look executable and consistent with stated expected prints. Prefer **preserve** unless Fixer re-runs and diffs. |

**Severity convention used here**
- **P0:** Newbie cannot answer what / why / success / stick-point without inventing the frame (missing preamble *and* retrospective on practice units; bare drill as primary task text).
- **P1:** Partial frame (e.g. success buried in instruction, short `why`, You Do missing only retrospective).
- **P2:** Polish (title, feedback length, mild hint spoil, wording).

---

## Unit ledger

### S04-T1-A-DEMO (iDo)
- **Diagnosis:** Demo runs a clean `for reg in lote` plus `range(n)`, with a one-line `why`. A true newbie lands on code without being told *what to watch* (for-por-valor vs. índices, stop exclusivo de `range`). No post-demo principle, misconception, or bridge to We Do counting/filtering.
- **Checklist:** context **fail** · goal **partial** (only in `description`) · success **fail** (no “qué debe coincidir al Run” beyond intro global) · constraints **fail** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el procesador de intake no validas una sola ficha: recorres un **lote**. Esta demo muestra el esqueleto más simple: un `for` por valor sobre tres registros sintéticos (`C001`…`C003`) y, al final, `range(n)` para ver los índices 0..n−1. No escribas aún. Observa que no hace falta `range(len(...))` para imprimir edades, y que `list(range(3))` termina en 2 (stop exclusivo). Datos ficticios; el `output` debe coincidir al pulsar Run.
- **Proposed instruction/description improvements:**  
  Keep description; optional tighten: “Recorrer lote sintético con `for` por valor y ver `range(n)`”. Expand `why` slightly: prefer `for reg in lote`; `range` only when the index is required; exclusive stop avoids the classic off-by-one when numbering N rows.
- **Proposed retrospective:**  
  Si puedes decir sin mirar el código por qué `range(3)` no incluye el 3, ya internalizaste el stop exclusivo. El hábito del for por valor es el esqueleto del gate CP-N1-A. En We Do arreglarás un print incompleto y un contador mal actualizado sobre el mismo tipo de lote.
- **Code/output changes:** none
- **Validation notes:** Output already matches the demo code.

---

### S04-T1-A-E1 (weDo, guided)
- **Diagnosis:** Instruction is Concepto+fixture+contrato in one block; success (`[0,1,2]` after three regions) is present but not framed. No `title`, `preamble`, or `retrospective`. Feedback is a slogan. Starter defect is clear (`print('ok', True)` instead of `list(range(3))`) — good guided near-complete scaffold.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Imprimir regiones y `range(3)`
- **Proposed preamble:**  
  - **Contexto:** el primer paso de un lote de intake es recorrer cada fila y, a veces, numerar posiciones con `range`.  
  - **Meta:** practicar `for` por valor y ver el stop exclusivo de `range`.  
  - **Éxito:** tres líneas `Lima` / `Cusco` / `Piura` y luego `[0, 1, 2]`.  
  - **Límites:** un for simple sin índices manuales; no mutes `regiones`; no dejes el `print('ok', True)` del starter.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: el for de regiones ya está bien.  
  2. El DEFECT es no imprimir `list(range(3))` (hay un `print('ok', True)` de relleno).  
  3. Sustituye ese print por `print(list(range(3)))`.  
  4. Ejecuta y compara con la salida esperada (sin texto extra).
- **Proposed retrospective:**  
  El for por valor es el default del procesador de lotes; `range(n)` solo cuando el índice importa. El error clásico es creer que `range(3)` produce 1..3. Este mismo recorrido reaparece al cerrar contadores del gate.
- **Code/output changes:** none (remove `print('ok', True)` only in solution path already done)
- **Validation notes:** Solution output is the contract.

---

### S04-T1-A-E2 (weDo, independent)
- **Diagnosis:** Strong skill (manual counter, no comprehension) and clear expected `3`, but still bare drill packaging. Starter counts *everyone* (`n += 1` without `if`) — excellent named defect. Feedback too thin. Missing title/preamble/retrospective. Fade from E1 is good (new skill: conditional count).
- **Checklist:** context **fail** · goal **partial** · success **pass** (enterrado) · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Contar adultos con `for` (sin comprehension)
- **Proposed preamble:**  
  - **Contexto:** en el resumen de un lote necesitas tasas por condición, no solo listar filas.  
  - **Meta:** practicar un contador manual en un `for` (base del gate de resúmenes).  
  - **Éxito:** imprimes un solo entero; con `edades = [30, 17, 45, 22]` el valor es `3`.  
  - **Límites:** no uses list comprehension; no mutes la lista; frontera `>= 18` inclusiva.
- **Proposed instruction/description improvements:**  
  1. El starter cuenta *todas* las edades (DEFECT).  
  2. Dentro del for, incrementa solo si `e >= 18`.  
  3. Imprime únicamente el contador (sin `ok True`).
- **Proposed retrospective:**  
  El contador en un pase O(n) es el mismo patrón de `n_accept` / `n_reject` del capstone. El error clásico es imprimir la lista entera o contar con un `sum` opaco antes de entender el bucle. ¿Cuántos quedarían si la frontera fuera `> 18`?
- **Code/output changes:** none
- **Validation notes:** Expected 3 with inclusive 18.

---

### S04-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer surface (dicts + monto filter) is pedagogically right. Instruction is short and thin on *why raw must stay intact*. Success (C1, C4, `n_original 4`) only fully visible in solution, not in learner instruction (tests say “C1 y C4; len 4”). Missing preamble framing auditoría. Starter prints all ids/montos — clear defect.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Reportar ids con monto positivo
- **Proposed preamble:**  
  - **Contexto:** en auditoría de intake a veces reportas solo filas con monto usable, sin borrar el raw del lote.  
  - **Meta:** filtrar al *imprimir* con `for` + `if` sobre dicts (misma lógica de T1, nueva superficie).  
  - **Éxito:** líneas `C1` y `C4`; luego `n_original 4` (lista intacta).  
  - **Límites:** no mutes `lote`; no imprimas montos 0 ni negativos; no uses comprehension si aún no la dominas aquí.
- **Proposed instruction/description improvements:**  
  1. El starter imprime todos los ids y montos (DEFECT).  
  2. Imprime solo `reg["id"]` cuando `reg["monto"] > 0`.  
  3. Al final imprime `n_original` con `len(lote)` para demostrar que no mutaste.
- **Proposed retrospective:**  
  Filtrar en el reporte sin destruir el raw es hábito de auditoría del gate. Cero y negativo no son “casi positivos”: la condición de negocio debe ser explícita. El siguiente subtema te pide alinear columnas sin perder filas en silencio.
- **Code/output changes:** none (instruction should name `n_original 4` so it matches solution)
- **Validation notes:** Align instruction success with solution’s final print.

---

### S04-T1-B-DEMO (iDo)
- **Diagnosis:** Good worked example of `enumerate(..., start=1)` + `zip_strict`. One-line `why`. Newbie is not primed to notice that silent zip would drop the third id, nor that human numbering ≠ list index.
- **Checklist:** context **fail** · goal **partial** · success **fail** · constraints **fail** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  Cuando el lote mezcla columnas (`ids`, `regiones`), dos peligros: numerar mal el reporte y emparejar columnas de distinta longitud. Esta demo recorre pares alineados con `enumerate(..., start=1)` y un helper `zip_strict` que lanza si las longitudes no coinciden. Observa el mensaje `desalineado detectado` al acortar `regiones`. No escribas; sigue el `output`.
- **Proposed instruction/description improvements:** Expand `why`: `start=1` is for humans; internal indices stay 0-based; validating `len` (or `zip(..., strict=True)` on 3.10+) prevents silent truncation that corrupts reject rates.
- **Proposed retrospective:**  
  Si puedes explicar por qué un zip corto “se ve bien” y aún así miente el resumen, ya tienes el gate de alineación. En We Do corregirás `start=0`, un producto cartesiano por nested loops, y un `zip_strict` incompleto.
- **Code/output changes:** none
- **Validation notes:** Demo output is consistent.

---

### S04-T1-B-E1 (weDo, guided)
- **Diagnosis:** Clear defect (`start` default 0 → `fila 0:`). Instruction mixes concept with contract. No preamble/title/retrospective. Feedback thin.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Numerar filas con `enumerate(start=1)`
- **Proposed preamble:**  
  - **Contexto:** al diagnosticar un reject, el humano lee “fila 1”, no “índice 0”.  
  - **Meta:** usar `enumerate` con `start=1` sin armar el índice a mano.  
  - **Éxito:** exactamente `fila 1: A`, `fila 2: B`, `fila 3: C`.  
  - **Límites:** no uses `range(len(ids))`; no dejes `start` en 0.
- **Proposed instruction/description improvements:**  
  1. El starter usa `enumerate(ids)` sin `start` (DEFECT → fila 0).  
  2. Cambia a `enumerate(ids, start=1)`.  
  3. Mantén el f-string `fila {i}: {x}`; quita el print de relleno.
- **Proposed retrospective:**  
  Numerar desde 1 acelera el diagnóstico en demos y tickets. El índice interno de la lista sigue siendo 0-based: no mezcles ambos mundos en el mismo cálculo. ¿Qué imprimiría `start=0` con el mismo f-string?
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T1-B-E2 (weDo, independent)
- **Diagnosis:** Excellent defect (nested loops → Cartesian product). Instruction asks for zip pairs *and* silent short zip — good dual observation. Still bare packaging; success “3 pares + 1 par” is cryptic for a newbie. Feedback ok-ish but short.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Emparejar columnas con `zip` (y ver el silencio)
- **Proposed preamble:**  
  - **Contexto:** nombres y edades de un intake deben ir en paralelo, no en producto cartesiano.  
  - **Meta:** emparejar con `zip` y observar el truncamiento silencioso al acortar una columna.  
  - **Éxito:** `Ana=30`, `Luis=25`, `María=40` y luego `zip corto [('Ana', 30)]`.  
  - **Límites:** un solo for sobre `zip`; no nested loops; aquí solo *observas* el silencio (en código real validarías `len`).
- **Proposed instruction/description improvements:**  
  1. El starter anida dos fors (DEFECT: 9 líneas basura).  
  2. Recorre `zip(nombres, edades)` e imprime `nombre=edad`.  
  3. Imprime `zip corto` con `list(zip(nombres, edades[:1]))` para ver la pérdida.
- **Proposed retrospective:**  
  Ver el truncamiento una vez evita bugs de columnas desalineadas que inflan o deflactan tasas. Nested loops no “emparejan”: multiplican. El siguiente ejercicio te obliga a fallar fuerte con `ValueError` en vez de callar.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer to implementing `zip_strict` is excellent. Starter returns silent zip; only one try/except in starter — solution needs second block for `OK`. Instruction mentions both paths but is dense. Missing preamble about pipeline asserts. Feedback good idea, short.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** `zip_strict`: fallar si hay desalineación
- **Proposed preamble:**  
  - **Contexto:** en un pipeline de calidad, desalineación de columnas debe ser error ruidoso, no pérdida silenciosa.  
  - **Meta:** implementar validación de longitudes (equivalente pedagógico a `zip(..., strict=True)`).  
  - **Éxito:** imprime `DESALINEADO` y luego `OK` (en ese orden).  
  - **Límites:** lanza `ValueError` si `len(a) != len(b)`; no uses la API `strict=` si tu entorno no es 3.10+ — el helper basta.
- **Proposed instruction/description improvements:**  
  1. Completa `zip_strict`: si longitudes difieren, `raise ValueError`.  
  2. Primer intento con listas 3 vs 2 → captura y `print("DESALINEADO")`.  
  3. Segundo intento con listas de longitud 2 → `print("OK")` si no lanza.
- **Proposed retrospective:**  
  Validar longitudes es un assert de alineación barato antes del zip. El malentendido es creer que “casi igual longitud” es inocuo. En el You Do del batch no zipees columnas a ciegas si las fuentes pueden llegar incompletas.
- **Code/output changes:** none (starter incompleto a propósito — ok for transfer)
- **Validation notes:** Ensure Fixer keeps dual try/except in solution.

---

### S04-T2-A-DEMO (iDo)
- **Diagnosis:** Clear while+END worked example. Short `why`. Newbie may miss *why* `i` always advances *before* the break check order, and that `ignorada` stays out. No retrospective on infinite-loop risk.
- **Checklist:** context **fail** · goal **partial** · success **fail** · constraints **fail** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  Cuando el lote llega como stream de líneas, no siempre conoces el tamaño de antemano: usas `while` y un **centinela**. Aquí el buffer simula stdin: `"Ana|Lima"`, `"Luis|Cusco"`, `"END"`, y basura posterior. Observa que `i` avanza siempre y que `END` corta sin procesarse; la línea `"ignorada"` no entra al resultado. No escribas; compara con el `output`.
- **Proposed instruction/description improvements:** Expand `why`: sentinel ends the batch; advancing `i` every iteration prevents infinite loops; post-sentinel data must not pollute counters.
- **Proposed retrospective:**  
  Antes de confiar en un while, responde: ¿qué variable cambia? ¿cuándo es falsa la condición o hay break? Si no puedes contestar, reescribe con for o añade un máximo. En We Do corregirás un `continue` que *no* corta el lote y un reintento sin prints.
- **Code/output changes:** none
- **Validation notes:** `indice final 3` is intentional (after END).

---

### S04-T2-A-E1 (weDo, guided)
- **Diagnosis:** Perfect defect (`continue` on blank skips but keeps reading `r3`). Instruction states expected `['r1','r2']` well. Still no structured preamble/title/retrospective. Feedback thin.
- **Checklist:** context **fail** · goal **partial** · success **pass** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** While hasta centinela vacío
- **Proposed preamble:**  
  - **Contexto:** un archivo de intake a veces trae basura *después* de una línea en blanco que marca fin de lote.  
  - **Meta:** con `while` e índice, cortar en string vacío **sin incluirlo**.  
  - **Éxito:** imprime `['r1', 'r2']` (sin `r3`).  
  - **Límites:** el blank es centinela → `break`, no `continue`; avanza `i` siempre.
- **Proposed instruction/description improvements:**  
  1. El starter hace `continue` en blank (DEFECT: sigue y se come `r3`).  
  2. Cambia a `break` cuando `line == ""`.  
  3. Imprime solo `out`.
- **Proposed retrospective:**  
  El centinela define el fin de lote aunque haya basura después. Confundir `continue` con `break` es el error #1 en streams: “salto” vs “cierro”. ¿Qué lista obtendrías si usaras `continue` aquí?
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T2-A-E2 (weDo, independent)
- **Diagnosis:** Retries with MAX is the right independent skill. Defect is missing per-attempt prints. Instruction weak on exact print format (`intento k`). Success “3 intentos + done 3” is informal.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Reintentos con tope `MAX`
- **Proposed preamble:**  
  - **Contexto:** un reintento de red o de parseo no puede colgarse: siempre hay cota superior.  
  - **Meta:** `while intentos < MAX` con variable de control que sube cada vuelta.  
  - **Éxito:** `intento 1`, `intento 2`, `intento 3`, luego `done 3`.  
  - **Límites:** incrementa *dentro* del while; no pongas `while True` aquí; no omitas los prints por intento.
- **Proposed instruction/description improvements:**  
  1. El starter ya incrementa y imprime `done`, pero no reporta cada intento (DEFECT).  
  2. Dentro del while, tras `intentos += 1`, imprime `f"intento {intentos}"`.  
  3. Mantén `print("done", intentos)` al salir.
- **Proposed retrospective:**  
  while con cota superior es el patrón de reintentos seguros. Si olvidas incrementar, el bucle es infinito: no es “Python raro”, es estado que no avanza. En producción combinarás esto con timeouts y logs.
- **Code/output changes:** none
- **Validation notes:** Exact f-string wording matters for output compare.

---

### S04-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Queue + PAUSE transfer is good. Defect: missing `PAUSE` and residual print. Instruction mentions expected rest but lightly. Missing job-hook preamble.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Cola con pause y `break`
- **Proposed preamble:**  
  - **Contexto:** un worker saca jobs de una cola hasta una condición de negocio (pausa), no hasta vaciar siempre.  
  - **Meta:** `while cola` + `pop(0)` + `break` condicional, dejando el resto visible.  
  - **Éxito:** `job1`, `job2`, `PAUSE`, `rest ['job3']`.  
  - **Límites:** no uses `for` sobre una copia si practicas while; no vacíes la cola tras el break.
- **Proposed instruction/description improvements:**  
  1. El starter imprime jobs y hace break en `job2`, pero no imprime `PAUSE` ni la cola restante (DEFECT parcial).  
  2. Tras detectar `job2`, imprime `PAUSE` y `break`.  
  3. Fuera del while, imprime `rest` y la cola.
- **Proposed retrospective:**  
  while + cola modela procesamiento hasta condición de negocio. El break deja estado residual que debes reportar (auditoría). ¿Qué pasaría si hicieras `continue` en vez de `break` en `job2`?
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T2-B-DEMO (iDo)
- **Diagnosis:** continue vs break on ERROR is clear. Short `why`. No pre-orientation that empty lines are noise vs fatal ERROR as configuration stop. No retrospective linking to intake lines.
- **Checklist:** context **fail** · goal **partial** · success **fail** · constraints **fail** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  En un lote de líneas, no todo error es igual: el vacío es ruido (sáltalo); un `ERROR` de configuración puede ser **fatal** (corta el lote). Esta demo mezcla `""`, `ok:1`, `ok:2` y `ERROR` antes de un `ok:3` que no debe procesarse. Observa el orden: primero el mensaje fatal, luego `kept` solo con los ok previos. No escribas; verifica el `output`.
- **Proposed instruction/description improvements:** Expand `why`: `continue` cleans noise; `break` stops the batch on fatal config; post-break rows must not inflate success counters.
- **Proposed retrospective:**  
  Si confundes continue y break, o dejas pasar filas fatales o cortas demasiado pronto. Pregunta de control: ¿`ok:3` debía contarse? No. En We Do limpiarás whitespace y cortarás en 5xx.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T2-B-E1 (weDo, guided)
- **Diagnosis:** Whitespace `continue` is clear. Success Lima/Cusco stated. Still bare frame. Starter prints everything including blanks — good.
- **Checklist:** context **fail** · goal **partial** · success **pass** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Saltar vacíos con `continue`
- **Proposed preamble:**  
  - **Contexto:** archivos de intake traen filas en blanco o solo espacios que no son regiones.  
  - **Meta:** filtrar con `continue` cuando `not x.strip()`.  
  - **Éxito:** dos líneas: `Lima` y `Cusco`.  
  - **Límites:** no uses `break` (no es fin de lote, solo basura); no mutes `raw`.
- **Proposed instruction/description improvements:**  
  1. El starter imprime también blanks (DEFECT).  
  2. Si `not x.strip()`, `continue`.  
  3. Si no, `print(x)`.
- **Proposed retrospective:**  
  continue es el filtro de filas vacías del intake por líneas. strip evita que `"  "` se cuelue como región válida. El siguiente ejercicio usa break para errores fatales, no para basura.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T2-B-E2 (weDo, independent)
- **Diagnosis:** HTTP-ish codes as fatal 5xx is a good independent surface. Starter prints `ERR` without break and still processes final 200 — rich defect. Instruction says `STOP` and `n_ok` 2 but weakly. Feedback good concept, short.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Cortar el lote en error fatal (5xx)
- **Proposed preamble:**  
  - **Contexto:** un 5xx de configuración no es “otra fila más”: debe detener el procesamiento del lote.  
  - **Meta:** `break` en `code >= 500`, contar solo los `ok` previos.  
  - **Éxito:** `ok`, `ok`, `STOP`, `n_ok 2` (el 200 final no se procesa).  
  - **Límites:** no solo imprimas error y sigas; no cuentes el 500 como ok.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `ERR` y sigue (DEFECT: no break; el último 200 se cuenta).  
  2. Si `c >= 500`: imprime `STOP`, `break`.  
  3. Si no: imprime `ok` e incrementa `n_ok`.  
  4. Al final imprime `n_ok` con etiqueta.
- **Proposed retrospective:**  
  Errores fatales deben cortar el lote, no solo contarse. Si solo “marcas” y continúas, el resumen miente y el daño se propaga. ¿Por qué `n_ok` no es 3?
- **Code/output changes:** none (wording STOP vs ERR already fixed in solution)
- **Validation notes:** Instruction must say `STOP` to match solution.

---

### S04-T2-B-E3 (weDo, transfer)
- **Diagnosis:** `while True` + END + guard is advanced and correct for transfer. Starter never breaks on END (appends END too) — good defect. Instruction light on not appending END. Missing safety narrative in preamble form.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** `while True` con END y salvaguarda
- **Proposed preamble:**  
  - **Contexto:** a veces el patrón natural es `while True` + break; es legítimo solo si la salida es obvia y hay red de seguridad.  
  - **Meta:** leer buffer con índice, break en `END`, guard `i > 10`.  
  - **Éxito:** imprime `['a', 'b']` (sin `END`).  
  - **Límites:** no proceses END como dato; no quites la salvaguarda; avanza `i` siempre.
- **Proposed instruction/description improvements:**  
  1. El starter agrega todo al `out`, incluido END (DEFECT).  
  2. Tras leer `item`, si es `END` haz `break` *antes* de append.  
  3. Mantén el `if i > 10: raise ...`.
- **Proposed retrospective:**  
  while True documentado + centinela + MAX es aceptable y testeable. El malentendido es “while True siempre es malo”: lo malo es no tener salida garantizada. En el You Do prefiere for sobre listas en memoria; reserva while para streams.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T3-A-DEMO (iDo)
- **Diagnosis:** Counters dict + tasa with total n is central to CP-N1-A. Short `why`. Newbie not told to watch denominator vs “only accepts”.
- **Checklist:** context **fail** · goal **partial** · success **fail** · constraints **fail** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  El gate CP-N1-A no se cierra listando filas: se cierra con un **resumen**. Esta demo recorre statuses sintéticos, llena contadores `accept`/`reject`/`review` en un pase, y calcula `tasa_reject` con denominador `n = len(statuses)`. Observa que el total es 5 y la tasa es 0.4 (2/5), no 2/3 de solo accepts. No escribas; verifica el `output`.
- **Proposed instruction/description improvements:** Expand `why`: one O(n) pass; rate uses attempted total; empty batch would use `None` (shown later in We Do).
- **Proposed retrospective:**  
  Si puedes defender por qué el denominador no es “solo aceptados”, ya evitas dashboards mentirosos. En We Do arreglarás un `n_total` que no sube y una división por cero en lista vacía.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T3-A-E1 (weDo, guided)
- **Diagnosis:** Core gate counters. Defect: never increments `n_total`. Success `2 1 3` clear. Bare frame otherwise.
- **Checklist:** context **fail** · goal **partial** · success **pass** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Contadores accept/reject/total en un pase
- **Proposed preamble:**  
  - **Contexto:** el resumen del batch necesita tres números honestos: accept, reject y total intentado.  
  - **Meta:** incrementar contadores en un solo `for` O(n).  
  - **Éxito:** imprime `2 1 3` (accept, reject, total).  
  - **Límites:** `n_total` sube en *cada* fila, no solo en accept; no uses comprehensions aquí.
- **Proposed instruction/description improvements:**  
  1. El starter no toca `n_total` (DEFECT → imprime 0 al final).  
  2. Al inicio de cada iteración (o al final simétrico), `n_total += 1`.  
  3. Mantén los if de accept/reject; imprime los tres en ese orden.
- **Proposed retrospective:**  
  Contadores en un pase son la base del resumen CP-N1-A. Si `n_total` queda en 0, cualquier tasa posterior es basura o crash. ¿Qué imprimirías si olvidaras el `elif reject`?
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T3-A-E2 (weDo, independent)
- **Diagnosis:** Rate + empty list is critical. Starter has *two* defects: counts accept as reject, and divides by zero on empty. Instruction says ~0.333 and None but solution uses three-element list for 0.3333 — **instruction says “sts del E1” (3 elems) vs starter first call with 2 elems**. Pedagogical inconsistency: Fixer should align fixture.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0 (also fixture drift = Fixer attention)
- **Proposed title:** Tasa de reject sin división por cero
- **Proposed preamble:**  
  - **Contexto:** un lote vacío no es tasa 0 automática ni crash: se reporta `None`.  
  - **Meta:** `tasa_reject = n_reject / n_total` solo si `n_total > 0`.  
  - **Éxito:** con `["accept","reject","accept"]` imprime `0.3333`; con `[]` imprime `None`.  
  - **Límites:** cuenta **reject**, no accept; no dejes que `[]` lance `ZeroDivisionError`.
- **Proposed instruction/description improvements:**  
  1. El starter divide siempre y además cuenta accepts como si fueran rejects (DEFECT doble).  
  2. Si `n_total == 0`, retorna `None`.  
  3. Si no, cuenta `status == "reject"` y divide.  
  4. Imprime `round(..., 4)` del primer caso y el segundo caso crudo.
- **Proposed retrospective:**  
  Denominador cero se reporta, no se crashea. El otro error clásico es usar el numerador equivocado (accept vs reject) y “pasar tests” con la tasa invertida. El dashboard del gate asume esta convención.
- **Code/output changes:** **Align starter/tests with solution fixture** — prefer three statuses for 0.3333 as in `solutionCode`; update starter’s first call from 2 to 3 elements. Keep empty case.
- **Validation notes:** Instruction currently says “sts del E1” but starter uses a shorter list; Fixer must unify.

---

### S04-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Linear search for first `review` is good transfer. Starter searches `accept` and only prints index. Solution prints `1 C2`. Instruction mentions that; ok. Missing preamble on why first-hit matters in triage.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Primer `review` con búsqueda y `break`
- **Proposed preamble:**  
  - **Contexto:** en triaje de calidad a veces basta el *primer* registro en review, no el catálogo completo.  
  - **Meta:** búsqueda lineal con `enumerate` + `break` (sin `.index()`).  
  - **Éxito:** imprime `1 C2` (índice e id); si no hubiera review, `-1`.  
  - **Límites:** no uses `.index()`; no sigas el bucle tras el primer match; no busques `accept`.
- **Proposed instruction/description improvements:**  
  1. El starter busca `accept` y solo imprime el índice (DEFECT).  
  2. Cambia la condición a `status == "review"`.  
  3. Si `idx == -1` imprime `-1`; si no, imprime índice e `id`.
- **Proposed retrospective:**  
  Búsqueda lineal con break evita trabajo innecesario y modela “primer hallazgo” del intake. El malentendido es confiar en `.index()` sin manejar ausencia (lanza). ¿Por qué no imprimir también el segundo review C3?
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T3-B-DEMO (iDo)
- **Diagnosis:** Comprehension filter of rejects + rate. Short `why`. Does not warn when *not* to use comprehensions (multi-branch validation).
- **Checklist:** context **fail** · goal **partial** · success **fail** · constraints **fail** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  Cuando el filtro del resumen es simple, una list comprehension legible reduce ruido. Esta demo construye `rejects` con ids en status reject y calcula la tasa con `len(rows)` como denominador. Observa que no hace I/O dentro de la comprehension. No escribas; el `output` muestra dos rejects y tasa 2/3.
- **Proposed instruction/description improvements:** Expand `why`: readable filter; denominator remains full batch length; multi-branch or side effects → explicit for.
- **Proposed retrospective:**  
  Comprehension ≠ siempre mejor: contadores múltiples y try/except por fila piden for clásico. En We Do practicarás map/filter básico, set de categorías y un mini-resumen id→status.
- **Code/output changes:** none
- **Validation notes:** Floating tasa is fine as printed.

---

### S04-T3-B-E1 (weDo, guided)
- **Diagnosis:** Squares + evens is classic but slightly disconnected from intake story (abstract nums). Still valid skill. Starter identity + empty filter. Success clear. Bare frame.
- **Checklist:** context **fail** · goal **partial** · success **pass** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Cuadrados y pares con list comprehension
- **Proposed preamble:**  
  - **Contexto:** antes de filtrar rejects del batch, practicas la forma corta de map/filter.  
  - **Meta:** una comprehension de transformación y una de filtro.  
  - **Éxito:** `[1, 4, 9, 16, 25]` y `[2, 4]`.  
  - **Límites:** sin `for` explícito en este ejercicio; una comprehension por lista.
- **Proposed instruction/description improvements:**  
  1. El starter imprime la lista identidad y un filtro imposible `> 10` (DEFECT).  
  2. Primera línea: cuadrados `x * x`.  
  3. Segunda: pares con `x % 2 == 0`.
- **Proposed retrospective:**  
  Comprehension corta para map/filter simple. El error típico es anidar tres niveles “porque cabe” o meter prints dentro. Cuando el filtro del intake tenga varias ramas, vuelve al for.
- **Code/output changes:** none
- **Validation notes:** Abstract fixture is acceptable if preamble bridges to intake.

---

### S04-T3-B-E2 (weDo, independent)
- **Diagnosis:** Set comprehension + sorted for status taxonomy — good independent. Starter list with duplicates. Success clear. Bare frame.
- **Checklist:** context **fail** · goal **partial** · success **pass** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Categorías únicas con set comprehension
- **Proposed preamble:**  
  - **Contexto:** el reporte de calidad lista qué statuses *aparecieron*, sin duplicar.  
  - **Meta:** set comprehension + `sorted` para un catálogo estable.  
  - **Éxito:** `['accept', 'reject', 'review']`.  
  - **Límites:** no dejes la lista sucia con duplicados; no hardcodees las tres cadenas.
- **Proposed instruction/description improvements:**  
  1. El starter hace list comprehension y repite `reject` (DEFECT).  
  2. Usa `{r["status"] for r in rows}` y envuélvelo en `sorted(...)`.  
  3. Imprime esa lista ordenada.
- **Proposed retrospective:**  
  Set comprehension resume categorías presentes en el lote. Ordenar hace el reporte determinista (útil en tests). ¿Qué pasaría si un status nuevo llegara al lote sin tocar el print hardcodeado? Por eso no hardcodeas.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T3-B-E3 (weDo, transfer)
- **Diagnosis:** dict comp + rejects + rate — strong transfer toward You Do summary. Starter only prints ids and has only 2 rows vs solution’s 4 — **fixture drift** similar to T3-A-E2. Instruction mentions tasa 0.5 implicitly via tests.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Dict id→status y tasa de reject
- **Proposed preamble:**  
  - **Contexto:** el resumen del gate combina un mapa por id y una tasa sobre el lote completo.  
  - **Meta:** dict comprehension + lista de rejects + `len(rejects)/len(rows)`.  
  - **Éxito:** imprime `reject ['C2', 'C4'] 0.5` (status de C2, lista, tasa).  
  - **Límites:** denominador = `len(rows)`; no mutes `rows`; datos sintéticos del starter ampliado a 4 filas.
- **Proposed instruction/description improvements:**  
  1. Amplía el fixture a cuatro filas (como la solución) si el starter aún tiene dos.  
  2. Construye `by = {id: status ...}`.  
  3. `rejects` desde el dict o desde rows; calcula tasa; imprime `by["C2"]`, rejects y tasa.
- **Proposed retrospective:**  
  Comprehensions + denominador `len(rows)` cierran el patrón de resumen legible. El error es calcular tasa solo sobre rejects o solo sobre accepts. Este mini-pipeline es el puente directo al You Do.
- **Code/output changes:** **Expand starter `rows` to 4 records** matching solution; remove placeholder `ok True`.
- **Validation notes:** Fixture alignment required.

---

### S04-T4-A-DEMO (iDo)
- **Diagnosis:** TRACE table is excellent pedagogy. Short `why`. Newbie not told *how to read* the columns or that False must not bump `n_ok`.
- **Checklist:** context **fail** · goal **partial** · success **fail** · constraints **fail** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  Cuando el resumen “sale raro”, no adivines: **traza**. Esta demo imprime en cada paso `i`, el flag y el contador `n_ok` que solo sube si el flag es True. Sigue la fila donde `False` deja `n_ok` en 1. El `FINAL 3` debe cuadrar con la última fila de la tabla. No escribas; lee el `output` como si fuera tu libreta.
- **Proposed instruction/description improvements:** Expand `why`: TRACE makes counter updates visible; mismatch with final summary means state bug, not “Python raro”.
- **Proposed retrospective:**  
  Si la traza no cuadra con el print final, el bug está en la actualización del estado. En We Do corregirás sumar negativos y un doble `n += 1` por fila — ambos se cazan con traza mental.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T4-A-E1 (weDo, guided)
- **Diagnosis:** Running sum of positives with TRACE. Starter sums all. Success table implied. Bare frame.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Traza de acumulador (solo positivos)
- **Proposed preamble:**  
  - **Contexto:** depurar un acumulador del resumen exige ver el estado *por fila*.  
  - **Meta:** sumar solo `val > 0` e imprimir traza `i, val, s`.  
  - **Éxito:** filas `0 2 2`, `1 -1 2`, `2 3 5` y `final 5`.  
  - **Límites:** el negativo no mueve `s`; imprime la traza en cada paso, no solo el final.
- **Proposed instruction/description improvements:**  
  1. El starter suma todos los valores (DEFECT: en i=1, s baja a 1).  
  2. Envuelve la suma en `if val > 0`.  
  3. Mantén `print(i, val, s)` y `final`.
- **Proposed retrospective:**  
  La traza confirma que -1 no movió el acumulador. Sin columnas de estado, “arreglar a ciegas” multiplica bugs. ¿Qué `final` saldría si la condición fuera `>= 0`?
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T4-A-E2 (weDo, independent)
- **Diagnosis:** Double increment is a perfect independent debug task. Defect comment even labels the bug. Instruction is ok; still missing metacognitive frame. Almost could be P1 for content quality, but missing preamble/retrospective keeps P0 for campaign fields.
- **Checklist:** context **fail** · goal **partial** · success **pass** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Corregir doble conteo por fila
- **Proposed preamble:**  
  - **Contexto:** un resumen que cuenta el doble destruye tasas del gate (parecen 200%).  
  - **Meta:** localizar el DEFECT de incremento duplicado y dejar un solo `n += 1` por fila.  
  - **Éxito:** imprime `3`.  
  - **Límites:** no hardcodees `print(3)`; no borres el for.
- **Proposed instruction/description improvements:**  
  1. Traza mental: 3 filas × 2 incrementos = 6 (DEFECT visible en el starter).  
  2. Elimina el segundo `n += 1`.  
  3. Imprime solo `n`.
- **Proposed retrospective:**  
  Traza mental: si n sube 2 por fila, el resumen miente el doble. Este bug es más común de lo que parece al copiar bloques. Antes de “optimizar”, cuenta a mano 3 filas.
- **Code/output changes:** none
- **Validation notes:** Comment `# bug: doble conteo` is helpful for guided feel inside independent — acceptable.

---

### S04-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Dict counter TRACE transfer is strong. Starter uses `counts[st] = 1` (overwrite). Solution uses get+1 and TRACE lines. Instruction vague on exact TRACE format (“copy o str”).
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Traza del dict de contadores
- **Proposed preamble:**  
  - **Contexto:** cuando los contadores viven en un dict, un typo de clave o un “pisado” deja el resumen incoherente.  
  - **Meta:** incrementar con `get` e imprimir TRACE del estado completo por registro.  
  - **Éxito:** tres líneas `TRACE i status {...}` crecientes y `FINAL {'accept': 2, 'reject': 1}`.  
  - **Límites:** no asignes `counts[st] = 1` (pisa); no omitas TRACE intermedias.
- **Proposed instruction/description improvements:**  
  1. El starter pisa el contador a 1 (DEFECT).  
  2. Usa `counts[st] = counts.get(st, 0) + 1`.  
  3. Cada iteración: `print("TRACE", i, st, dict(counts))`.  
  4. Al final: `print("FINAL", counts)`.
- **Proposed retrospective:**  
  Trazar el dict entero evita bugs de clave mal escrita y de asignación que pisa. El malentendido es “el dict ya cuenta solo”: no, tú defines la actualización. Este hábito se lleva al logging del procesador real.
- **Code/output changes:** none (pin TRACE format in instruction to match solution)
- **Validation notes:** Exact TRACE string needed for automated compare if any.

---

### S04-T4-B-DEMO (iDo)
- **Diagnosis:** linear vs quad steps + `range(1,len)` skip first — high value. Short `why`. Newbie needs pre-frame: why n² hurts batches and why skipping index 0 is a business off-by-one.
- **Checklist:** context **fail** · goal **partial** · success **fail** · constraints **fail** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  Dos enemigos del resumen a escala: el costo **cuadrático** disfrazado de “doble for inocente” y el **off-by-one** que se salta el primer registro. Esta demo cuenta pasos con n=4 (4 vs 16) y muestra `range(1, len(vals))` omitiendo el 10 inicial. No escribas; relaciona los números con “¿mi tasa miró todas las filas?”.
- **Proposed instruction/description improvements:** Expand `why`: 4 vs 16 steps; `range(1,len)` drops first row — classic incomplete summary; prefer single O(n) pass for rates.
- **Proposed retrospective:**  
  Si tu resumen anida dos fors solo para contar, reescribe a un pase. Si tu range “empieza en 1 por costumbre de Excel”, puedes estar botando la primera fila del intake. We Do te hace sentir 5 vs 25 y arreglar un IndexError.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T4-B-E1 (weDo, guided)
- **Diagnosis:** Count linear vs nested steps. Starter increments both in one loop. Success `5 25` clear. Bare frame.
- **Checklist:** context **fail** · goal **partial** · success **pass** · constraints **partial** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Contar pasos O(n) vs O(n²)
- **Proposed preamble:**  
  - **Contexto:** con n chico el cuadrático no “se siente”, pero el conteo de pasos sí lo delata.  
  - **Meta:** derivar pasos de un for simple y de un doble for con `n=5`.  
  - **Éxito:** imprime `5 25`.  
  - **Límites:** no inventes los números; cuéntalos con incrementos reales en bucles.
- **Proposed instruction/description improvements:**  
  1. El starter sube `lin` y `quad` en el mismo for (DEFECT: ambos 5).  
  2. Deja el for lineal como está.  
  3. Añade doble for anidado solo para `quad`.  
  4. Imprime `lin, quad`.
- **Proposed retrospective:**  
  Sentir n² con números chicos prepara el ojo para lotes grandes. El gate CP-N1-A espera demos rápidas: un resumen O(n²) “por si acaso” es un olor a rediseño.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T4-B-E2 (weDo, independent)
- **Diagnosis:** Off-by-one IndexError is excellent. Starter `range(1, len+1)` will crash or skip+crash — good. Instruction strong relative to others. Still missing preamble/retrospective fields.
- **Checklist:** context **fail** · goal **partial** · success **pass** · constraints **pass** (instruction has contrato) · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Corregir off-by-one en `range`
- **Proposed preamble:**  
  - **Contexto:** un IndexError al final del lote suele ser stop exclusivo mal usado, no “lista rota”.  
  - **Meta:** recorrer todos los índices válidos con `range(len(data))`.  
  - **Éxito:** `r0`, `r1`, `r2` (una por línea).  
  - **Límites:** corrige el `range`, no parches con `if i < len` sobre el range roto; no uses `range(1, len+1)`.
- **Proposed instruction/description improvements:**  
  1. El starter usa `range(1, len(data)+1)` (DEFECT: intenta `data[3]`).  
  2. Cámbialo a `range(len(data))`.  
  3. Imprime `data[i]` en cada paso.
- **Proposed retrospective:**  
  stop exclusivo de range es la fuente #1 de IndexError en lotes. Preferir `for x in data` elimina el índice cuando no lo necesitas. Si el índice es obligatorio, dibuja 0..n−1 antes de codificar.
- **Code/output changes:** none
- **Validation notes:** —

---

### S04-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Rewrite n² pairs to O(n) reject count + pedagogical note print — excellent transfer. Starter double loop miscounts. Instruction asks for note print — good. Success “3 0.6 + nota” informal.
- **Checklist:** context **fail** · goal **partial** · success **partial** · constraints **fail** · retrospective **fail**
- **Severity:** P0
- **Proposed title:** Reescribe conteo n² a O(n)
- **Proposed preamble:**  
  - **Contexto:** alguien “contó pares reject-reject” con doble for para una tasa que solo necesita rejects.  
  - **Meta:** reescribir a conteo O(n) de rejects y tasa `n_reject/n`.  
  - **Éxito:** `3 0.6` y una línea `nota:` explicando por qué O(n) basta.  
  - **Límites:** no dejes el doble for; no inventes otra métrica de pares.
- **Proposed instruction/description improvements:**  
  1. El starter anida fors y cuenta mal (DEFECT).  
  2. Calcula `n` y `n_reject` en un pase (o `sum` simple).  
  3. Imprime `n_reject` y `round(n_reject/n, 2)`.  
  4. Imprime una nota breve: la tasa no necesita pares O(n²).
- **Proposed retrospective:**  
  Elegir el algoritmo correcto es parte del gate de calidad. El malentendido es “más bucles = más rigor”. Para tasas del batch, un pase O(n) es el rigor correcto. Lleva esta decisión al You Do.
- **Code/output changes:** none (keep note string stable for compare)
- **Validation notes:** Pin the exact `nota:` string from solution in instruction success.

---

### youDo — Client Intake & Data Quality Script (cierre CP-N1-A)
- **Diagnosis:** Strong project frame: context ties S02/S03 → batch O(n), requirements and rubric are observable, starter with `_run_tests` and empty-batch case is excellent. **Missing `retrospective`** for defense/metacognition after build (spec §8.3 pattern). No other structural failure. Portfolio note partially covers “what to show” but not self-check questions after completion.
- **Checklist:** context **pass** · goal **pass** (objectives) · success **pass** (requirements + tests) · constraints **pass** · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (keep) Client Intake & Data Quality Script (cierre CP-N1-A)
- **Proposed preamble:** N/A as separate field — `context` already serves; optional light expand only if Fixer wants symmetry. Prefer **do not bloat** context; add retrospective only.
- **Proposed instruction/description improvements:**  
  Minor: ensure `validate_record` expectations for the 3-row fixture are discoverable (edad/region/monto tri-state) without requiring re-read of all S03 — already hinted. No mandatory rewrite of requirements.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿puedes defender en 30 segundos por qué `tasa_reject` usa `n_total` y no solo accepts, y por qué el vacío es `None`? (2) ¿qué invariante demuestras con `_run_tests` (raw intacto, n_total, lote vacío)? (3) Si mañana el lote trae 100_000 filas, ¿tu `process_batch` sigue siendo un solo pase O(n)? Escribe en el README una frase de impacto medible (antes/después del gate) sin PII real.
- **Code/output changes:** none
- **Validation notes:** Starter tests are the success oracle; preserve.

---

## Priority order

### P0 (fix first — all We Do missing title/preamble/retrospective; bare-drill packaging)
1. **S04-T3-A-E1 / E2 / E3** — heart of CP-N1-A counters & rate (E2 also has fixture drift).  
2. **S04-T1-A-E1 / E2 / E3** — entry loop skills; E2 is the canonical counter.  
3. **S04-T2-A-E1** and **S04-T2-B-E1 / E2** — continue vs break confusion is high-severity for newbies.  
4. **S04-T1-B-E2 / E3** — silent zip / zip_strict (quality-data footgun).  
5. **S04-T4-A-E2** and **S04-T4-B-E2 / E3** — debug + complexity decisions for the gate.  
6. **Remaining We Do** (T2-A-E2/E3, T2-B-E3, T3-B-*, T4-A-E1/E3, T4-B-E1, T1-B-E1): same field gaps; apply proposed texts.

### P1
- **All 8 I Do:** add `preamble` + `retrospective`; mildly expand `why` toward 40–90 words.  
- **You Do:** add `retrospective` only (context already strong).

### P2
- We Do `feedback`: expand each to 25–60 words with *reasoning* (not slogans).  
- We Do `title` polish (4–12 words) as proposed.  
- Soften over-spoiling first hints where they paste full solution lines (esp. T1-A-E1, T1-B-E1) — progressive, not paste-complete.  
- Align instruction success strings with `solutionCode.output` everywhere (especially T2-B-E2 STOP, T4-A-E3 TRACE, T4-B-E3 nota).

---

## Residual risks

1. **Fixture drift** in T3-A-E2 (2 vs 3 statuses) and T3-B-E3 (2 vs 4 rows): if Fixer only adds prose without aligning starter to solution, learners will fail output compare.  
2. **Starter `print('ok', True)`** noise across many We Do: solutions remove it; instructions must say so or automated checks will confuse.  
3. **Hint spoilers:** several first hints are full solution lines — conflicts with faded worked examples if left as-is when preambles improve.  
4. **Abstract E1 on comprehensions (T3-B-E1)** vs intake story: low risk if preamble bridges; otherwise feels like a detour.  
5. **Volume:** 33 units × new fields will bulk the section file; Fixer must respect length caps (preamble 80–150 words, retrospective 40–80) to avoid cognitive overload.  
6. **Schema compile:** ensure optional fields `preamble` / `retrospective` / `title` are accepted by `CourseSection` types before merge.  
7. **No real PII / CASO-LIM-004:** preserve synthetic-only tone in all new Spanish prose.

---

## Fixer handoff notes (non-binding)

- Do **not** bulk search-replace a single preamble template across 24 We Do.  
- Preserve exact `solutionCode.output` unless execute-and-diff justifies a change.  
- Prefer splitting current mega-`instruction` into: short task steps + move context/success/constraints into `preamble`.  
- You Do: only add retrospective; do not rewrite the whole project brief.

---

## Method attestation
Hand-crafted unit-by-unit review of Section 4 only. No generators, loops, or cross-section prose reuse. Ready for Round-1 Fixer under anti-aberration rules.

Section 4 exercise pedagogy review complete. Ready for the Fixer prompt.
