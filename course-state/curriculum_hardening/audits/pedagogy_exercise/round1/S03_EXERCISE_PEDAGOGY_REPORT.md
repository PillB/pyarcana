# S03 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Decisiones y reglas de validación
- **id:** `data-structures`
- **index:** 3
- **source:** `src/lib/course/sections/s03-data-structures.ts`
- **counts:** iDo **8**, weDo **24**, youDo **1**
- **story spine:** motor de reglas de intake sintético (`CASO-LIM-003`) → tri-estado accept/reject/review → incremento **CP-N1-A**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length limits, E1→E2→E3 fade, checklists).
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the canonical source.
- Cross-checked schema optional fields in `src/lib/types.ts` (`preamble`, `retrospective`, We Do `title`).
- No bulk generation, no scripts, no copy-paste across sections. Hand-written proposals only.
- Source files were **not** edited in this round (report only).

## Cross-cutting diagnosis

| Gap | Scope | Severity |
|-----|--------|----------|
| Missing `preamble` on all I Do demos | 8/8 | **P0** |
| Missing `retrospective` on all I Do demos | 8/8 | **P0** |
| Missing `title` on all We Do exercises | 24/24 | **P0** |
| Missing `preamble` on all We Do exercises | 24/24 | **P0** |
| Missing `retrospective` on all We Do exercises | 24/24 | **P0** |
| Missing `retrospective` on You Do | 1/1 | **P0** |
| Instruction packs context+goal+success into one dense block (role bleed) | most We Do | **P1** |
| Feedback often one thin line (reasoning light) | many We Do | **P2** |
| `why` on I Do is solid but short; demos are strong worked examples | all I Do | pass (keep) |
| You Do context/objectives/requirements/rubric already strong | youDo | pass (add retrospective only) |
| Code/output mostly pedagogically sound | nearly all | preserve unless noted |

**Strengths already present:** clear section story (motor de reglas, None ≠ 0), good DEFECT comments in starters, concrete success contracts embedded in many instructions, progressive hints (2), E1/E2/E3 kinds largely distinct (not clones), synthetic PE data, bridge to CP-N1-A.

**What newbies still cannot answer without new fields:** “what am I watching before the code?” (I Do), “what stuck and what misconception died?” (all units), “what is the short card title?” (We Do UI).

---

## Unit ledger

### S03-T1-A-DEMO (iDo)
- **Diagnosis:** Solid worked example of comparisons + `in` + chained range. `description` and `why` are clear. No `preamble` (learner drops into code without a scenario) and no `retrospective` (no bridge to E1’s repair of inverted booleans). True newbie may not know *what* to predict before running.
- **Checklist:** context **fail** · goal **partial** (in description) · success **partial** (output present, not framed) · constraints **fail** · retrospective **fail**
- **Severity:** **P0** (missing preamble + retrospective)
- **Proposed title:** N/A (I Do)
- **Proposed preamble:** Antes de armar un `if` de negocio, el analista de intake debe *predecir* booleanos sueltos. Aquí un registro sintético de `CASO-LIM-003` trae `region = "Lima"` y `monto = 1500` frente a un set de regiones permitidas. No escribas aún: ejecuta y confirma cada `True`/`False`. Presta atención al encadenamiento `1000 <= monto <= 2000` y a `region in ALLOWED` — son el vocabulario del motor de reglas. Solo datos ficticios; no hay PII real.
- **Proposed instruction/description improvements:** Keep description. Optional tighten: «Comparar región y monto de un registro sintético (booleanos sueltos)».
- **Proposed retrospective:** Si puedes decir por qué `monto < 500` es `False` sin mirar la salida, ya lees comparaciones como un revisor de reglas. El error clásico es inventar el booleano en la cabeza sin ejecutar. En We Do repararás expresiones invertidas y practicarás `in` sobre una allowlist de documentos.
- **Code/output changes:** none
- **Validation notes:** Output already matches code; preserve exactly.

---

### S03-T1-B-DEMO (iDo)
- **Diagnosis:** Critical gate demo (None vs 0 vs empty). Strong `why`. Missing framing that this is the *canonical* intake bug and missing close that names the misconception repaired.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** **P0**
- **Proposed preamble:** En intake, `None`, `0` y `""` son todos *falsy*, pero la política de monto **no** los trata igual. Esta demo muestra `bool(v)` al lado de una política real: ausencia → review, cero válido → accept, negativo → reject. Observa la fila de `monto_cero`: si crees que “falsy = rechazar”, el pipeline miente. No edites aún; predice cada línea de `policy` y compara con la salida.
- **Proposed instruction/description improvements:** Keep. Optional: «None, 0 y vacío bajo reglas distintas (gate del tri-estado)».
- **Proposed retrospective:** El hábito es: presencia con `is None`, rango con comparaciones, no con `if monto:`. Confundir `0` con ausencia es el falso positivo caro del CP-N1-A. En We Do reescribirás un validador que hoy rechaza el cero.
- **Code/output changes:** none
- **Validation notes:** Preserve policy strings and table order.

---

### S03-T2-A-DEMO (iDo)
- **Diagnosis:** Clean if/elif/else with frontier cases 80 and 50. Needs preamble that tells the learner *why* frontiers are in the loop, and retrospective on mutual exclusion.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** **P0**
- **Proposed preamble:** Un score de calidad de intake debe caer en **una sola** etiqueta: accept, review o reject. Aquí `classify_score` usa `if` / `elif` / `else` con umbrales documentados. Corre el bucle y fíjate en las fronteras: **80** debe ser accept (no review) y **50** review (no reject). No escribas; traza mentalmente cada valor antes de mirar la salida embebida.
- **Proposed instruction/description improvements:** Keep description (already names frontiers).
- **Proposed retrospective:** La primera condición verdadera gana; por eso el orden y el `elif` importan. El error clásico es usar dos `if` seguidos y pisar el status. En We Do repararás umbrales invertidos y un `bad` que sobrescribe accept con review.
- **Code/output changes:** none

---

### S03-T2-B-DEMO (iDo)
- **Diagnosis:** Excellent guard-chain demo with codes. Missing story of “why linear beats pyramid” and link to TypeError risk of comparing None.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** **P0**
- **Proposed preamble:** Un validador profesional no anida tres niveles: saca precondiciones con **guards** (early return). Observa el orden de `validate_edad`: primero `None` (MISSING), luego tipo (BAD_TYPE), luego rango, luego menores (NEEDS_REVIEW), y al final accept. Nota el uso de `repr(e)`: deja claro que `"25"` es str, no int. No edites; sigue cada caso del bucle hasta el dict de salida.
- **Proposed instruction/description improvements:** Keep.
- **Proposed retrospective:** Si comparas `edad < 18` antes de chequear `None`, obtienes `TypeError`. Guards no son “estilo fancy”: son el contrato legible del motor. En We Do completarás guards y refactorizarás una pirámide de monto sin cambiar semántica.
- **Code/output changes:** none

---

### S03-T3-A-DEMO (iDo)
- **Diagnosis:** Combined allowlist + range; good why. Needs preamble on *why* desconocido is review not hard reject, and retrospective on dual rules.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** **P0**
- **Proposed preamble:** El motor de reglas combina dos políticas de dominio: **allowlist** de región y **rango** de edad. En `CASO-LIM-003`, región desconocida o ausente va a **review** (catálogo incompleto), no a reject duro; edad fuera de 18–65 va a **reject**. Ejecuta los cuatro pares y predice el string de salida antes de leerlo. Solo regiones sintéticas de Perú; no es padrón oficial.
- **Proposed instruction/description improvements:** Keep.
- **Proposed retrospective:** Dos fallos distintos merecen dos destinos (review vs reject). El error es colapsar “no está en la lista” y “edad inválida” en el mismo status. En We Do armarás `check_region` y un rango de monto con outlier suave.
- **Code/output changes:** none

---

### S03-T3-B-DEMO (iDo)
- **Diagnosis:** Side-by-side if vs match is excellent. Missing preamble on *when* to choose each and retrospective that match does not deprecate if.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** **P0**
- **Proposed preamble:** La misma **tabla de decisión** (código → status) puede vivir en `if/elif` o en `match/case`. Esta demo implementa ambas y comprueba `same= True` en cada fila, incluido el comodín para códigos desconocidos (`FOO`). Observa los OR patterns (`MISSING | NEEDS_REVIEW`). Requiere Python 3.10+ (el curso usa 3.12). No inventes ramas que no estén en la tabla.
- **Proposed instruction/description improvements:** Keep.
- **Proposed retrospective:** `match` brilla con literales finitos; no depreca `if`. El error es “elegir match por moda” en un rango numérico. En We Do corregirás una tabla defectuosa y completarás cases con `case _`.
- **Code/output changes:** none

---

### S03-T4-A-DEMO (iDo)
- **Diagnosis:** Spec-as-data (`invariant_text` + `examples[]`) is the right model. Needs preamble that examples *are* the specification, and retrospective on vague invariants.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** **P0**
- **Proposed preamble:** Un invariante no es solo código: es una **promesa en español** más ejemplos accept/reject/review. Aquí `contacto` debe ser str de 9 dígitos o `None` (review). Corre la lista `examples` y verifica `ok= True` en cada fila; `repr` hace legible el caso de solo espacios. Si un colega no puede inventar un contraejemplo en 30 segundos, el invariante está vago.
- **Proposed instruction/description improvements:** Keep.
- **Proposed retrospective:** Ejemplos canónicos son especificación ejecutable. El error es solo probar el camino feliz. En We Do armarás `examples` de edad, un invariante multi-campo de apellidos y un contraejemplo que rompe una política demasiado estricta.
- **Code/output changes:** none

---

### S03-T4-B-DEMO (iDo)
- **Diagnosis:** Messages + branch suite demo is strong. Needs preamble on what “accionable” means and retrospective linking to You Do `_run_tests`.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** **P0**
- **Proposed preamble:** Decidir bien no basta: hay que **comunicar** el fallo y **probar** cada rama. Esta suite de `validate_edad_msg` devuelve `{status, code, message}` y un assert por código (`MISSING`, `BAD_TYPE`, `OUT_OF_RANGE`, `OK`). Lee cada mensaje: nombra campo, problema y acción. Es la misma disciplina del `_run_tests` del You Do. Solo datos sintéticos; no loguees PII.
- **Proposed instruction/description improvements:** Keep.
- **Proposed retrospective:** Un test por rama (incluido el default) es el mínimo profesional. Mensajes tipo “Error” no se pueden ejecutar. En We Do reescribirás mensajes vagos, armarás cases por rama y arreglarás un off-by-one en la frontera 18.
- **Code/output changes:** none

---

### S03-T1-A-E1 (weDo · guided)
- **Diagnosis:** Instruction is dense but has success contract (five bools). Starter DEFECT is clear (inverted comparisons). Missing `title`, `preamble`, `retrospective`. Feedback is a one-liner without naming the inversion bug. E1 correctly near-complete.
- **Checklist:** context fail · goal partial (in instruction) · success **pass** (embedded) · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Comparar edad y región (booleanos sueltos)
- **Proposed preamble:**
  - **Contexto:** en `CASO-LIM-003` el motor aún no escribe `if`; primero debe predecir booleanos de edad y región.
  - **Meta:** corregir cinco comparaciones invertidas o incompletas.
  - **Éxito:** con `edad = 25` y `region = "Cusco"`, imprimes exactamente: `True`, `True`, `True`, `False`, `True` (una línea cada una).
  - **Límites:** no uses `if` todavía; no inventes literales fijos; solo imprime la expresión booleana.
- **Proposed instruction:**
  1. Abre el starter: el DEFECT invierte o sustituye las cinco expresiones pedidas.
  2. Deja `edad = 25` y `region = "Cusco"`.
  3. Imprime, en este orden: `edad >= 18`, `edad < 65`, `18 <= edad <= 65`, `region == "Lima"`, `region != "Piura"`.
  4. Ejecuta y compara con el contrato de cinco booleanos.
- **Proposed retrospective:** Predecir booleanos sueltos es el hábito antes del `if` de negocio. El error clásico es imprimir el valor “que se espera” en lugar de la expresión real. El mismo vocabulario alimenta rangos y allowlists del motor.
- **Proposed feedback (optional tighten):** Las cinco líneas deben salir de expresiones reales, no de `print(True)`. Si `region == "Lima"` te da True, aún usas el operando incorrecto: `region` es Cusco.
- **Code/output changes:** none (starter DEFECT is pedagogically correct)
- **Validation notes:** Preserve output block exactly.

---

### S03-T1-A-E2 (weDo · independent)
- **Diagnosis:** Good membership focus and case-sensitivity trap. Instruction still mixes framing + task. Missing title/preamble/retrospective. Fade OK (less scaffolding than E1).
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Membership en allowlist de tipo de documento
- **Proposed preamble:**
  - **Contexto:** los códigos de documento del intake (`DNI`, `CE`, `PAS`) se validan con pertenencia, no con un `if` por cada literal.
  - **Meta:** usar `t in TIPOS_DOC` y ver el efecto de mayúsculas.
  - **Éxito:** para `DNI`, `dni`, `RUC` imprimes `t → True/False` → `True`, `False`, `False`.
  - **Límites:** no uses `t == "DNI"`; no normalices a upper en este ejercicio (el punto es documentar sensibilidad).
- **Proposed instruction:**
  1. Mantén `TIPOS_DOC = {"DNI", "CE", "PAS"}`.
  2. Recorre `["DNI", "dni", "RUC"]`.
  3. Sustituye el DEFECT (`t == "DNI"`) por `t in TIPOS_DOC`.
  4. Imprime `t →` y el booleano en cada iteración.
- **Proposed retrospective:** Allowlists literales fallan en silencio si el productor manda minúsculas. El error no es “Python está mal”: es contrato de normalización no documentado. En E3 contrastarás `is` vs `==` para presencia.
- **Code/output changes:** none

---

### S03-T1-A-E3 (weDo · transfer)
- **Diagnosis:** Transfer surface (identity vs equality) is good. Starter swaps `is`/`==` — excellent named defect. Instruction asks for a print explanation (good). Missing title/preamble/retrospective. Feedback names bug #1 but thin.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** `is None` frente a `==` en validadores
- **Proposed preamble:**
  - **Contexto:** en validadores de intake, chequear ausencia con el operador equivocado genera bugs silenciosos.
  - **Meta:** diagnosticar `is` vs `==` con `None` y con `True`/`1`.
  - **Éxito:** salida `True` / `True` / `False` más una nota que diga cuándo usar cada operador.
  - **Límites:** no uses `is` para comparar enteros o strings de negocio; solo para `None` (identidad de singleton).
- **Proposed instruction:**
  1. Con `valor = None`, imprime el resultado de `valor is None` (corrige el DEFECT que usa `==`).
  2. Imprime `True == 1` y `True is 1` (corrige el cruce del starter).
  3. Añade un `print` de nota: cuándo usar `is` y cuándo `==` en intake.
- **Proposed retrospective:** `is` pregunta identidad de objeto; `==` pregunta valor. `True == 1` es True por subtipo, pero `True is 1` es False. En el motor, presencia se escribe `is None`, no `== None` por estilo y claridad de review.
- **Code/output changes:** none (solution note text may vary slightly in learner work; canonical solution stays)

---

### S03-T1-B-E1 (weDo · guided)
- **Diagnosis:** Truthiness table is the right E1 drill. DEFECT (`is not None` as bool) is excellent. Missing scaffolding fields. Instruction long but success clear (9 False + 3 True).
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Tabla de truthiness (falsy vs truthy)
- **Proposed preamble:**
  - **Contexto:** el `if` de Python usa truthiness; en intake eso choca con ceros y strings vacíos válidos.
  - **Meta:** imprimir `repr(v) → bool(v)` para una lista canónica de valores.
  - **Éxito:** nueve `False` y tres `True` (`"x"`, `1`, `[0]`) en el orden del starter.
  - **Límites:** no reemplaces `bool(v)` por `v is not None`; no reordenes la lista.
- **Proposed instruction:**
  1. Revisa el DEFECT: el starter imprime `v is not None`, que no es truthiness.
  2. Recorre la lista `vals` dada.
  3. Imprime `repr(v)` y `bool(v)` en cada paso.
  4. Confirma que `range(0)` es falsy y `[0]` es truthy.
- **Proposed retrospective:** Memorizar la lista falsy evita sorpresas en `if campo:`. El error es creer que “no None” implica “hay valor de negocio útil”. En E2 verás que `and`/`or` ni siquiera devuelven siempre un bool.
- **Code/output changes:** none (note: `range(0, 0)` in output is environment-correct)

---

### S03-T1-B-E2 (weDo · independent)
- **Diagnosis:** Short-circuit return values — high value, independent fade OK. DEFECT swaps and/or. Missing title/preamble/retrospective.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Predecir valores de `and` / `or` (no solo bool)
- **Proposed preamble:**
  - **Contexto:** defaults de intake a menudo usan `valor or default`; hay que saber qué *objeto* devuelve la expresión.
  - **Meta:** imprimir el operando resultante de cinco expresiones `and`/`or`.
  - **Éxito:** `default`, `Lima`, `0`, `99`, `0` (como en el contrato del enunciado actual).
  - **Límites:** no conviertas a `bool(...)` el resultado; imprime el valor devuelto.
- **Proposed instruction:**
  1. El starter tiene operadores invertidos (`and` donde va `or` y viceversa).
  2. Corrige las cinco líneas: `"" or "default"`, `"Lima" or "default"`, `0 and 99`, `5 and 99`, `None or 0`.
  3. Ejecuta y verifica el contrato de cinco valores.
- **Proposed retrospective:** `and`/`or` hacen short-circuit y devuelven un operando. El error es “castear” mentalmente siempre a True/False. Úsalo con cuidado en defaults; no lo uses para validar montos.
- **Code/output changes:** none

---

### S03-T1-B-E3 (weDo · transfer)
- **Diagnosis:** Flagship transfer of the section gate (fix monto cero). Excellent. Needs preamble that names job cost of false reject. Missing title/retrospective.
- **Checklist:** context fail · goal partial · success pass · constraints pass (implied) · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Arreglar validador de monto (None ≠ 0)
- **Proposed preamble:**
  - **Contexto:** un validador de monto con `if not monto` rechaza ceros válidos y confunde ausencia con error — falso positivo caro en fintech/retail.
  - **Meta:** reescribir `validate_monto` con política tri-estado correcta.
  - **Éxito:** para `None`, `0`, `-1`, `100` imprimes review, accept, reject, accept.
  - **Límites:** no uses truthiness para presencia; primero `m is None`; cero debe ser accept.
- **Proposed instruction:**
  1. Sustituye `if not m: return "reject"`.
  2. Si `m is None` → `"review"`.
  3. Si `m < 0` → `"reject"`.
  4. En cualquier otro caso (incluye 0) → `"accept"`.
  5. Prueba el bucle dado y compara la salida.
- **Proposed retrospective:** Separar ausencia, negativo y cero es el gate CP-N1-A. El error canónico es `if not m`. Lleva este patrón a `validate_record` del You Do.
- **Code/output changes:** none

---

### S03-T2-A-E1 (weDo · guided)
- **Diagnosis:** Frontier-focused classify_score repair. Good. Missing title/preamble/retrospective. Instruction already strong on frontiers.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Bandas de score con if/elif/else
- **Proposed preamble:**
  - **Contexto:** el clasificador de calidad del intake etiqueta un score en una sola rama dominante.
  - **Meta:** corregir umbrales invertidos en `classify_score`.
  - **Éxito:** para 80, 50, 49, 100 → accept, review, reject, accept.
  - **Límites:** una sola cadena `if/elif/else`; no uses ifs independientes.
- **Proposed instruction:**
  1. El DEFECT devuelve accept en scores bajos.
  2. Escribe: `score >= 80` → accept; `elif score >= 50` → review; `else` → reject.
  3. Imprime `s → status` para 80, 50, 49, 100.
- **Proposed retrospective:** Documentar fronteras evita off-by-one en review de PR. 80 cae en la rama superior porque se evalúa primero. En E2 verás cómo dos `if` pisan el status.
- **Code/output changes:** none

---

### S03-T2-A-E2 (weDo · independent)
- **Diagnosis:** Classic overwrite bug — excellent pedagogy. Starter only has `bad`; learner must write `good` and change test values — instruction says 95/60/30 but starter loops 80/50/49. **Pedagogically required code alignment:** starter loop should match instruction/solution (95, 60, 30) or instruction should mention adding `good`. This is a real friction point for newbies.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0** (missing fields) + **P1** (starter/instruction mismatch on values and missing `good` stub)
- **Proposed title:** ifs secuenciales vs cadena exclusiva
- **Proposed preamble:**
  - **Contexto:** un bug clásico de review de PR es sobrescribir `status` con un segundo `if` no excluyente.
  - **Meta:** dejar `bad` como está, implementar `good` con `if/elif/else` y comparar.
  - **Éxito:** para 95, 60, 30 → `good` da accept, review, reject (y `bad(95)` sigue en review).
  - **Límites:** no “arregles” `bad`; el contraste es la lección.
- **Proposed instruction:**
  1. Lee `bad`: el segundo `if score >= 50` pisa accept.
  2. Implementa `good(score)` con `if/elif/else` y la misma política de umbrales.
  3. Cambia el bucle a 95, 60, 30 e imprime `bad=` y `good=` en cada valor.
- **Proposed retrospective:** ifs secuenciales ≠ cadena exclusiva. En review de PR busca `status =` repetido. El mismo patrón rompe motores de reglas en producción.
- **Code/output changes:** **Recommended:** align starter `for s in [...]` to `[95, 60, 30]` and add a stub `def good(score): ...` with a clear DEFECT/`pass` so E2 is not a blank transfer by accident. Keep solution output as is.
- **Validation notes:** Fixer should execute-and-diff after starter tweak.

---

### S03-T2-A-E3 (weDo · transfer)
- **Diagnosis:** Threshold order transfer is good and distinct from E1/E2. Missing title/preamble/retrospective.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Trazar bandas numéricas (orden de umbrales)
- **Proposed preamble:**
  - **Contexto:** cuando hay varias bandas (alto/medio/bajo/nulo), el orden de umbrales decide si 150 cae bien o mal.
  - **Meta:** implementar `band(n)` de más estricto a más general.
  - **Éxito:** 150→alto, 75→medio, 10→bajo, 0→nulo, -3→nulo.
  - **Límites:** umbral alto primero; `else` cubre 0 y negativos.
- **Proposed instruction:**
  1. El starter solo tiene un umbral (DEFECT).
  2. Escribe: `n > 100` → alto; `elif n > 50` → medio; `elif n > 0` → bajo; `else` → nulo.
  3. Prueba 150, 75, 10, 0, -3.
- **Proposed retrospective:** Simular 4–5 entradas en papel antes de codear reduce bugs de orden. Si pones “bajo” primero, 150 nunca llega a “alto”. Lleva este hábito a decision tables.
- **Code/output changes:** none

---

### S03-T2-B-E1 (weDo · guided)
- **Diagnosis:** Guards on edad — core skill. Missing fields. Instruction dense but success clear. Feedback thin.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Guards de `validate_edad` (MISSING a OK)
- **Proposed preamble:**
  - **Contexto:** el validador de edad del motor usa early returns con códigos estables, no un solo `"BAD"`.
  - **Meta:** completar guards de ausencia, tipo, rango y menores.
  - **Éxito:** `None`→review/MISSING; `"25"`→reject/BAD_TYPE; `15`→review/NEEDS_REVIEW; `30`→accept/OK.
  - **Límites:** `is None` antes de comparar; devuelve dicts `{status, code}`; sin `if not edad`.
- **Proposed instruction:**
  1. Elimina el DEFECT de truthiness.
  2. Orden: None → no int → fuera 0–120 → `< 18` → OK.
  3. Prueba con `repr(e)` los cuatro valores del bucle.
- **Proposed retrospective:** Early exit de tipo es el primer guard serio. El error es tratar `None` y `"25"` como el mismo rechazo. Reutilizarás estos códigos en el You Do.
- **Code/output changes:** none

---

### S03-T2-B-E2 (weDo · independent)
- **Diagnosis:** Refactor nested→guards without semantic change — excellent independent task. Missing title/preamble/retrospective. Instruction good on “don’t change policy”.
- **Checklist:** context fail · goal partial · success pass · constraints pass · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Refactor de pirámide a guards (monto)
- **Proposed preamble:**
  - **Contexto:** `validate_monto_nested` ya tiene la política correcta, pero la pirámide es frágil en review de PR.
  - **Meta:** escribir `validate_monto_guards` con early returns **sin** cambiar semántica.
  - **Éxito:** en `[None, "x", -1, 0, 500, 20000]` nested y guards coinciden (`ok= True`).
  - **Límites:** no reescribas la política; 0 sigue accept; `>10000` sigue review.
- **Proposed instruction:**
  1. Deja nested intacta.
  2. Implementa guards: None→review; no int→reject; `<0`→reject; `<=10000`→accept; else review.
  3. Compara ambas funciones en el bucle de seis casos.
- **Proposed retrospective:** Misma matriz, menos indentación: se nota en el merge. El error es “mejorar” la política al refactorizar. En E3 detectarás ramas muertas por orden.
- **Code/output changes:** none (optional: starter could print both once `guards` exists; solution already does)

---

### S03-T2-B-E3 (weDo · transfer)
- **Diagnosis:** Dead branch analysis is high metacognition value. Solution is richer than starter expects (prints notes). Missing title/preamble/retrospective. Good transfer surface.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Detectar y reparar una rama muerta
- **Proposed preamble:**
  - **Contexto:** en review de PR, un `elif` puede ser código muerto por solapamiento de condiciones.
  - **Meta:** explicar por qué `elif x > 5` nunca corre y reescribir `etiqueta_ok` con ramas alcanzables.
  - **Éxito:** tras el fix, 6→positivo, -2→negativo, 0→cero; y una nota visible de que el elif del bug era inalcanzable.
  - **Límites:** no “arregles” solo el número mágico; cambia el diseño de ramas.
- **Proposed instruction:**
  1. Ejecuta `etiqueta_bug` en 6, -2, 0 y observa que 6 nunca es “grande-positivo”.
  2. Explica en un print por qué `if x >= 0` tapa el `elif x > 5`.
  3. Implementa `etiqueta_ok`: `x > 0` / `x < 0` / else cero.
- **Proposed retrospective:** Leer el orden de condiciones es skill de revisor, no solo de sintaxis. El error es añadir elifs sin preguntar “¿qué valores llegan aquí?”. Aplícalo a umbrales del motor de reglas.
- **Code/output changes:** none (learner prints may vary; keep canonical solution)

---

### S03-T3-A-E1 (weDo · guided)
- **Diagnosis:** Allowlist region with review for unknown — good. Missing fields. Clear success.
- **Checklist:** context fail · goal partial · success pass · constraints pass · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Allowlist de regiones (desconocido → review)
- **Proposed preamble:**
  - **Contexto:** catálogos incompletos en intake suelen mandar desconocidos a **review**, no a reject duro.
  - **Meta:** implementar `check_region` con allowlist sintética de Perú.
  - **Éxito:** Lima→accept; Tacna→review; None→review.
  - **Límites:** no uses reject para desconocidos en esta política; chequea `None` antes de `not in`.
- **Proposed instruction:**
  1. Corrige el DEFECT que manda todo lo no-allowlisted a reject (incluido None).
  2. Si `r is None` o `r not in ALLOWED` → review; else accept.
  3. Prueba Lima, Tacna, None.
- **Proposed retrospective:** Allowlist + review para desconocidos es patrón de catálogos en evolución. El error es castigar con reject un valor que operaciones aún puede capturar. Combínalo con rangos en E2/E3.
- **Code/output changes:** none

---

### S03-T3-A-E2 (weDo · independent)
- **Diagnosis:** Soft outlier vs hard negative — good independent. DEFECT rejects 0. Missing fields.
- **Checklist:** context fail · goal partial · success pass · constraints pass · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Rango de monto con outlier suave
- **Proposed preamble:**
  - **Contexto:** data quality real distingue hard fail (negativo) de outlier suave (monto muy alto → review).
  - **Meta:** implementar `monto_ingreso` con tri-estado y cero válido.
  - **Éxito:** None, -1, 0, 1200, 60000 → review, reject, accept, accept, review.
  - **Límites:** 0 no es reject; umbral de outlier 50000 es review, no reject.
- **Proposed instruction:**
  1. Corrige `m <= 0` (rechaza el cero).
  2. Orden: None→review; `<0`→reject; `>50000`→review; else accept.
  3. Prueba la lista de cinco montos en orden.
- **Proposed retrospective:** Tri-estado con outlier suave evita matar el pipeline por un techo arbitrario. El error es tratar todo lo “raro” como reject. Documenta la constante 50000 en el README del You Do.
- **Code/output changes:** none

---

### S03-T3-A-E3 (weDo · transfer)
- **Diagnosis:** Combined allowlist + length table with codes — strong transfer. Instruction cases list slightly under-specifies RUC case (solution includes RUC). Missing fields. Starter incomplete vs solution matrix.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0** (+ **P1** starter loop missing RUC case vs solution)
- **Proposed title:** Tipo de documento y longitud (códigos)
- **Proposed preamble:**
  - **Contexto:** DNI/CE/PAS tienen longitudes distintas; fallos de catálogo y de longitud deben llevar **códigos distintos**.
  - **Meta:** devolver dict `{status, code}` con MISSING, NOT_IN_ALLOWLIST, OUT_OF_RANGE, OK.
  - **Éxito:** DNI+8→OK; DNI corto→OUT_OF_RANGE; RUC→NOT_IN_ALLOWLIST; None→MISSING.
  - **Límites:** orden guards: ausencia → allowlist → longitud; no un solo `"reject"` genérico.
- **Proposed instruction:**
  1. Completa `tipo_doc_len(tipo, numero)` con dicts de resultado.
  2. Usa `DOC_LEN` para la longitud esperada.
  3. Prueba: `("DNI","12345678")`, `("DNI","123")`, `("RUC","20123456789")`, `(None,"1")`.
- **Proposed retrospective:** Códigos distintos habilitan dashboards de calidad. El error es un solo status string sin `code`. Este patrón es el del You Do campo a campo.
- **Code/output changes:** **Recommended:** expand starter loop to four cases including RUC so E3 success is self-evident without peeking at solution.
- **Validation notes:** Preserve solution output.

---

### S03-T3-B-E1 (weDo · guided)
- **Diagnosis:** Decision table as dict — good. DEFECT maps wrong statuses. Missing fields. Feedback good one-liner.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Decision table código → status
- **Proposed preamble:**
  - **Contexto:** primero se escribe la tabla de negocio; después el código. Así se evitan ramas inventadas.
  - **Meta:** corregir el dict `TABLE` y aplicar `get` con default review.
  - **Éxito:** OK→accept; MISSING→review; OUT_OF_RANGE→reject; FOO→review.
  - **Límites:** no añadas códigos de negocio que no estén en la tabla; el default cubre desconocidos.
- **Proposed instruction:**
  1. Corrige MISSING (review) y OUT_OF_RANGE (reject).
  2. Implementa `apply(code)` con `TABLE.get(code, "review")`.
  3. Imprime el status de OK, MISSING, OUT_OF_RANGE y FOO.
- **Proposed retrospective:** Primero la tabla, después el código. El error es hardcodear ifs sin fila default. En E2 la misma semántica vive en `match`.
- **Code/output changes:** none (instruction says “X”; solution uses “FOO” — **P2** align label to FOO for consistency)

---

### S03-T3-B-E2 (weDo · independent)
- **Diagnosis:** match/case completion — good independent. Missing fields. Python 3.10+ noted in hints (good).
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Misma tabla con match/case y OR patterns
- **Proposed preamble:**
  - **Contexto:** con sujetos de estado finito, `match` hace legible la misma decision table.
  - **Meta:** completar cases con OR patterns y `case _`.
  - **Éxito:** OK accept; MISSING/NEEDS_REVIEW review; OUT_OF_RANGE reject; FOO review.
  - **Límites:** Python 3.10+; si no hay match, if/elif equivalente (anótalo). No dejes que MISSING caiga en accept.
- **Proposed instruction:**
  1. El DEFECT manda el default a accept.
  2. Añade cases: OK; MISSING|NEEDS_REVIEW; OUT_OF_RANGE|NOT_IN_ALLOWLIST|BAD_TYPE; `_` → review.
  3. Prueba la lista de cinco códigos de la solución.
- **Proposed retrospective:** match legible no cambia la política; cambia la forma. El error es un `case _` demasiado permisivo (accept). Elige match cuando el sujeto es literal finito.
- **Code/output changes:** none (optional: expand starter loop to five codes)

---

### S03-T3-B-E3 (weDo · transfer)
- **Diagnosis:** Choose if vs match — excellent design transfer. Rubric is partly open-ended (prints). Missing fields. Starter very sparse.
- **Checklist:** context fail · goal partial · success partial (rubric) · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Elegir if o match según el sujeto
- **Proposed preamble:**
  - **Contexto:** claridad de diseño > moda de sintaxis en el motor de reglas.
  - **Meta:** mapear códigos finitos con match y rango de edad con if; justificar en un print.
  - **Éxito:** `map_code` distingue OK/MISSING/OUT_OF_RANGE; `map_edad` da review/accept/reject en None/30/10; print de justificación.
  - **Límites:** no fuerces match sobre rangos numéricos; no dejes None→accept.
- **Proposed instruction:**
  1. Implementa `map_code` con match (o if/elif) según la tabla OK/MISSING/OUT_OF_RANGE/_ → review.
  2. Implementa `map_edad`: None→review; 18–65→accept; else reject.
  3. Imprime resultados de prueba y una línea “por qué match no es ideal para el rango”.
- **Proposed retrospective:** Elige la forma por claridad del sujeto. El error es reescribir todo a match “porque es nuevo”. En T4 documentarás invariantes que esas ramas deben cumplir.
- **Code/output changes:** none

---

### S03-T4-A-E1 (weDo · guided)
- **Diagnosis:** Instruction asks for `examples[]` but starter is a bare validate loop — role mismatch: learner may not know to build the structure. Solution adds isinstance + examples. Missing fields. **P1** scaffold gap for guided E1.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0** (fields) + **P1** (starter too far from examples[] task for “guided”)
- **Proposed title:** Ejemplos canónicos del campo edad
- **Proposed preamble:**
  - **Contexto:** un invariante usable trae al menos un ejemplo por estado de decisión.
  - **Meta:** completar `validate_edad` (con type check) y una lista `examples` ejecutable.
  - **Éxito:** cuatro filas con `ok`/True: 30 accept, -1 reject, None review, `"x"` reject.
  - **Límites:** no uses solo el camino feliz; incluye missing y tipo mal.
- **Proposed instruction:**
  1. Añade guard de tipo (`isinstance`) al DEFECT.
  2. Define `examples` como lista de dicts `{value, expected}`.
  3. Recorre examples, imprime valor, got y comparación booleana.
- **Proposed retrospective:** Ejemplos canónicos son la mitad del invariante. El error es validar solo 30 y declarar “listo”. En E2 el invariante cruza dos campos.
- **Code/output changes:** **Recommended for guided fade:** starter should include empty `examples = []` and a partial validate with DEFECT comment on type check, so E1 is repair-not-invent.
- **Validation notes:** Preserve solution outputs.

---

### S03-T4-A-E2 (weDo · independent)
- **Diagnosis:** Multi-field invariant — good step up. Missing fields. Open-ended text OK for independent.
- **Checklist:** context fail · goal partial · success partial · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Invariante multi-campo de apellidos
- **Proposed preamble:**
  - **Contexto:** `validate_record` del You Do combina campos; aquí practicas un invariante de dos apellidos.
  - **Meta:** accept solo si ambos no vacíos; un faltante → review; ambos vacíos → reject.
  - **Éxito:** texto de invariante en español + 3 examples ejecutables con expected correcto.
  - **Límites:** aplica `strip`; trata `None` y `""` como vacío; sin PII real.
- **Proposed instruction:**
  1. Reescribe `validate_apellidos` (el DEFECT rechaza cualquier falta).
  2. Escribe `invariant_text` en español.
  3. Arma 3 examples (accept / review / reject) y verifícalos en un loop.
- **Proposed retrospective:** Multi-campo anticipa el record completo. El error es `if not ap or not am: reject` sin matiz de review. Documenta el invariante en el README del proyecto.
- **Code/output changes:** none

---

### S03-T4-A-E3 (weDo · transfer)
- **Diagnosis:** Counterexample to over-strict invariant — excellent metacognition. Missing fields. Solution renames fixed function; good.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Contraejemplo a un invariante demasiado estricto
- **Proposed preamble:**
  - **Contexto:** “edad siempre 18–65 o reject” choca con la política real del curso (menores → review).
  - **Meta:** mostrar el contraejemplo (15, None) y proponer `validate_edad_fixed` + nuevo texto de invariante.
  - **Éxito:** strict muestra reject en 15/None; fixed da review en 15/None y accept en 30; print del invariante corregido.
  - **Límites:** no dejes menores como reject duro; fuera de 0–120 sí reject.
- **Proposed instruction:**
  1. Ejecuta la versión strict y nombra qué casos rompen la política de negocio.
  2. Implementa fixed con guards (None, tipo, rango, menores, banda 18–65).
  3. Imprime el nuevo invariante en español.
- **Proposed retrospective:** Contraejemplos mejoran requisitos mejor que más ifs a ciegas. El error es codificar un invariante vago o cruel. En T4-B conectarás mensajes y tests a cada rama.
- **Code/output changes:** none

---

### S03-T4-B-E1 (weDo · guided)
- **Diagnosis:** Message rewrite is pure prose-in-prints — fine for guided. Missing fields. Success is rubric keywords (softer). Good PE examples in solution.
- **Checklist:** context fail · goal partial · success partial · constraints pass (no PII) · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Reescribir mensajes accionables de edad
- **Proposed preamble:**
  - **Contexto:** operaciones de intake no puede actuar con mensajes “Error” o “inválido”.
  - **Meta:** reescribir tres mensajes vagos a plantilla campo + problema + acción.
  - **Éxito:** tres strings que nombren `edad`, el problema y qué hacer (sin PII real).
  - **Límites:** no inventes DNI ni teléfonos reales; usa valores sintéticos si citas un número.
- **Proposed instruction:**
  1. Sustituye las tres cadenas del starter.
  2. Cubre al menos: ausencia, tipo incorrecto y fuera de rango.
  3. Imprime una línea por mensaje.
- **Proposed retrospective:** Mensajes accionables bajan tickets de soporte. El error es loguear solo un código interno sin acción. En E2 la disciplina se vuelve suite de asserts por rama.
- **Code/output changes:** none (wording may vary; solution is canonical exemplar)

---

### S03-T4-B-E2 (weDo · independent)
- **Diagnosis:** Branch coverage tests — good. Starter “DEFECT: mensaje genérico” is slightly misaligned with the real task (build `cases` + assert), not just messages. Missing fields.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** **P0** (+ **P2** DEFECT comment vs real task)
- **Proposed title:** Un caso de prueba por cada rama
- **Proposed preamble:**
  - **Contexto:** si solo pruebas el camino feliz, el clasificador miente en fronteras.
  - **Meta:** armar `cases` con expected y un loop assert/print PASS sobre `classify_score`.
  - **Éxito:** al menos un caso por rama (accept/review/reject) e idealmente fronteras 80 y 50; todos PASS.
  - **Límites:** no borres la función; no uses prints sin assert (o sin comparación explícita).
- **Proposed instruction:**
  1. Define `cases` como lista de `(score, expected)`.
  2. Incluye al menos 90, 55, 10 y las fronteras 80 y 50.
  3. Por cada caso: calcula, assert igualdad, imprime `PASS`.
- **Proposed retrospective:** Cobertura de ramas es el mínimo del motor. El error es una lista de prints sin expected. El You Do exige la misma matriz en `_run_tests`.
- **Code/output changes:** optional: change starter DEFECT comment to “falta lista cases + assert por rama”

---

### S03-T4-B-E3 (weDo · transfer)
- **Diagnosis:** Red→green off-by-one — excellent professional flow. Missing fields. Instruction and starter well aligned.
- **Checklist:** context fail · goal partial · success pass · constraints pass · retrospective fail
- **Severity:** **P0**
- **Proposed title:** Test rojo: frontera inclusiva en edad 18
- **Proposed preamble:**
  - **Contexto:** off-by-one en fronteras es el bug más caro de reglas de edad/monto.
  - **Meta:** hacer pasar la suite donde 18 debe ser accept.
  - **Éxito:** PASS en 18 accept, 17 review, None review, 30 accept (asserts en verde).
  - **Límites:** corrige `>` por rango inclusivo; mantén guard de None; no borres los cases.
- **Proposed instruction:**
  1. Observa el test rojo: 18 falla con la condición `e > 18`.
  2. Cambia a `18 <= e <= 65` (o equivalente).
  3. Descomenta/usa assert y confirma los cuatro PASS.
- **Proposed retrospective:** Test rojo → fix → verde es el flujo profesional de depurar reglas. El error es “ajustar el test” en vez de la frontera. Lleva la disciplina al README y a `_run_tests` del You Do.
- **Code/output changes:** none

---

### youDo — Motor de reglas del intake (CP-N1-A)
- **Diagnosis:** Strong project frame: context, objectives, requirements, rubric weights, portfolioNote, and a starter full of intentional DEFECTs with `_run_tests` that encode the true policy. For a true newbie the starter is rich but the **retrospective** (defense/reflection after build) is missing — the only P0 field gap on You Do. Feedback/success live in rubric + tests (pass).
- **Checklist:** context **pass** · goal **pass** · success **pass** (rubric + `_run_tests`) · constraints **pass** · retrospective **fail**
- **Severity:** **P0** (missing retrospective only)
- **Proposed title:** (keep) Motor de reglas del intake (incremento CP-N1-A)
- **Proposed preamble:** N/A as separate field — existing `context` already serves; optional micro-add inside context is **not required** if retrospective is added. Do not bloat.
- **Proposed instruction/description improvements:** None required. Optional Fixer note: ensure starter comments point learners to fix `validate_edad` / `validate_region` / `validate_monto` before expecting `_run_tests` green (already implied by DEFECT comments).
- **Proposed retrospective:** Antes de marcar listo: (1) ¿en qué campo demuestras con un test que `None` y `0` no comparten rama? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII)? (3) Escribe en el README una frase de impacto medible (p. ej. “ceros válidos ya no caen a reject”) que puedas defender en 30 segundos ante un lead de datos. Si un desconocido de región va a reject, aún no cumples la política del curso.
- **Code/output changes:** none for pedagogy fields; starter defects are intentional for the project.
- **Validation notes:** `_run_tests` is the executable success contract; keep assertions as the source of truth for Fixer.

---

## Priority order

### P0 — do first (schema/campaign completeness)
1. Add `preamble` + `retrospective` to all **8** I Do demos (proposals above).
2. Add `title` + `preamble` + `retrospective` to all **24** We Do steps; split current mega-`instruction` into task-only steps (keep contracts in preamble).
3. Add `retrospective` to **You Do**.
4. Optionally tighten We Do `feedback` where still one slogan line (especially T1-A-E1, T2-A-E1, T3-B-E1) using the reasoning-oriented drafts above.

### P1 — scaffold integrity (same Fixer pass if capacity)
1. **S03-T2-A-E2:** align starter loop values and add `good` stub; instruction already assumes both.
2. **S03-T3-A-E3:** expand starter cases to include RUC + dict return shape.
3. **S03-T4-A-E1:** scaffold empty `examples` + type DEFECT for true guided fade.
4. Re-check E1→E2→E3 fade after preambles: E1 should name the defect (most already do via DEFECT comments); E3 should stay transfer-surfaced (already mostly true).

### P2 — polish
1. Align instruction token `"X"` vs solution `"FOO"` in S03-T3-B-E1.
2. Align DEFECT comment on S03-T4-B-E2 with “missing cases/assert” task.
3. Length-check all new prose against 80–150 word preambles and 40–80 word retrospectives after paste into source.
4. Preserve all existing solution **outputs** unless an execute-and-diff is forced by starter alignment (T2-A-E2, T3-A-E3, T4-A-E1).

---

## Residual risks

1. **Instruction bloat after Fixer:** if preambles are pasted *and* old instruction blocks are left intact, units double-load the newbie. Fixer must **trim** instruction to steps only.
2. **Open-ended message/table exercises (T4-B-E1, T3-B-E3):** automated graders if any may not match exact strings; keep rubric-style `tests` text as today.
3. **match/case environments:** browser Pyodide must remain 3.10+; preamble already should restate for E2 of T3-B.
4. **Section id mismatch:** filesystem id is `data-structures` while title is “Decisiones y reglas…” — do not “fix” id in this campaign; only pedagogy fields.
5. **Volume:** 33 units of new PE prose is large; Fixer should apply unit-by-unit from this ledger, not regenerate with a template.
6. **You Do starter fails tests by design:** retrospective and docs must not imply the starter is already green; learners fix defects first.

---

## Fixer handoff checklist (from this report)

- [ ] 8× I Do: `preamble`, `retrospective` (keep `why`, code, output)
- [ ] 24× We Do: `title`, `preamble`, slim `instruction`, `retrospective`; improve `feedback` where noted
- [ ] 1× You Do: `retrospective` only (context/rubric stay)
- [ ] P1 starter alignments: T2-A-E2, T3-A-E3, T4-A-E1
- [ ] Execute-and-diff any code/output touched
- [ ] Professional Peruvian Spanish; no real PII; no bulk generators
- [ ] Section static build still compiles

---

Section 3 exercise pedagogy review complete. Ready for the Fixer prompt.
