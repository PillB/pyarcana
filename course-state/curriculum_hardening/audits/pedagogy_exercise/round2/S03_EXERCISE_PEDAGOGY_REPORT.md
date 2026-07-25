# S03 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Decisiones y reglas de validación
- **id:** `data-structures`
- **index:** 3
- **source:** `src/lib/course/sections/s03-data-structures.ts`
- **counts:** iDo **8**, weDo **24**, youDo **1**
- **story spine:** motor de reglas de intake sintético (`CASO-LIM-003`) → tri-estado accept/reject/review → incremento **CP-N1-A**

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length limits, E1→E2→E3 fade, checklists).
- Re-inspected **current** source after Round-1 Fixer: every `iDo.steps[]`, `weDo.steps[]`, and `youDo`.
- Used Round-1 report only as context for *what was supposed to land*; scored what is actually in the file.
- No rubber-stamp: units that merely “have fields” still scored for true-newbie clarity.
- Hand-written only. No bulk generation. Source **not** edited (report only).

## Round-1 → Round-2 delta (campaign completeness)

| R1 gap | Status in current source |
|--------|---------------------------|
| Missing I Do `preamble` + `retrospective` (8) | **Fixed** — all 8 present and usable |
| Missing We Do `title` + `preamble` + `retrospective` (24) | **Fixed** — all 24 present |
| Missing You Do `retrospective` | **Fixed** |
| Mega-`instruction` packing context+goal | **Fixed** — instructions are task steps; contracts live in preamble |
| P1 starter: T2-A-E2 (`good` stub + loop 95/60/30) | **Fixed** |
| P1 starter: T3-A-E3 (4 cases incl. RUC) | **Fixed** |
| P1 starter: T4-A-E1 (`examples = []` + type DEFECT) | **Fixed** |
| P2 FOO label / T4-B-E2 DEFECT comment | **Fixed** |
| Thin feedback (many units) | **Partial** — some reasoning feedback; many still slogan or duplicate retrospective |
| Feedback ↔ retrospective near-clone | **Residual** — common pattern in T2/T3/T4 |

**Verdict:** Round-1 P0 schema/campaign completeness is **done**. Round-2 residual work is **quality polish** (P1 sparse, mostly P2): newbie friction, Spanish agreement, feedback that teaches *why wrong*, and one instruction that points at the solution list.

---

## Scoring key (true newbie)

| Score | Meaning |
|-------|---------|
| **pass** | Spec checklist met; a first-time learner can answer what/why/success/constraints without guessing |
| **pass+** | Exemplar tone; little to change |
| **soft** | Usable but one gap (thin feedback, minor bleed, Spanish niggle, soft success) |
| **fail** | Missing required role or blocks success for a newbie |

Checklist columns: **C** context · **G** goal · **S** success · **L** limits · **R** retrospective · **T** title (We Do) · **I** instruction task-only

---

## Unit ledger

### S03-T1-A-DEMO (iDo)
- **Scores:** preamble **pass+** · why **pass** · retrospective **pass+**
- **Checklist:** C/G/S/L/R all **pass**
- **Diagnosis:** Worked example is clear. Preamble tells the learner *what to predict* before run; retrospective names misconception (inventar booleano) and bridges to We Do. `why` slightly overlaps preamble but stays technical — acceptable.
- **Severity residual:** none required
- **Proposed changes:** none
- **Code/output:** preserve

---

### S03-T1-B-DEMO (iDo)
- **Scores:** preamble **pass+** · why **pass+** · retrospective **pass+**
- **Checklist:** all **pass**
- **Diagnosis:** Flagship gate demo. Framing of “falsy ≠ misma política” is excellent for newbies. Retrospective locks CP-N1-A habit.
- **Severity residual:** none
- **Proposed changes:** none
- **Code/output:** preserve

---

### S03-T2-A-DEMO (iDo)
- **Scores:** preamble **pass+** · why **pass** · retrospective **pass+**
- **Checklist:** all **pass**
- **Diagnosis:** Frontiers 80/50 are called out *before* code — correct cognitive load. Bridge to dual-`if` overwrite is accurate.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T2-B-DEMO (iDo)
- **Scores:** preamble **pass+** · why **pass** · retrospective **pass+**
- **Checklist:** all **pass**
- **Diagnosis:** Guard order and `repr("25")` are explicit. TypeError risk named in retrospective — strong.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T3-A-DEMO (iDo)
- **Scores:** preamble **pass+** · why **pass** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Clear dual-policy (review vs reject). Synthetic PE caveat present.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T3-B-DEMO (iDo)
- **Scores:** preamble **pass+** · why **pass** · retrospective **pass+**
- **Checklist:** all **pass**
- **Diagnosis:** Side-by-side if/match + `same=` is ideal I Do. Python 3.10+ constraint present. Misconception “match por moda” is the right close.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T4-A-DEMO (iDo)
- **Scores:** preamble **pass+** · why **pass** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Spec-as-data message lands. “30 segundos, contraejemplo” is memorable for newbies.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T4-B-DEMO (iDo)
- **Scores:** preamble **pass+** · why **pass** · retrospective **pass+**
- **Checklist:** all **pass**
- **Diagnosis:** Message + assert suite models You Do discipline. No PII constraint explicit.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T1-A-E1 (weDo · guided)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **pass** · retrospective **pass**
- **Checklist:** C/G/S/L/R/T/I all **pass**
- **Diagnosis:** Clean E1: DEFECT named, five-bool contract exact, task-only steps. Feedback correctly warns against `print(True)`.
- **Severity residual:** none
- **Proposed changes:** none
- **Code/output:** preserve

---

### S03-T1-A-E2 (weDo · independent)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass** (feedback soft)
- **Diagnosis:** Case-sensitivity trap is well framed. Fade OK. Feedback is a slogan that nearly restates retrospective.
- **Severity residual:** **P2**
- **Proposed feedback:** Si `dni` te da True, aún comparas con `==` o normalizaste de más. El contrato de este ejercicio es **literal** `in TIPOS_DOC`: mayúsculas distintas → `False` a propósito, no un bug de Python.
- **Proposed changes:** feedback only
- **Code/output:** none

---

### S03-T1-A-E3 (weDo · transfer)
- **Scores:** title **pass** · preamble **pass** · instruction **pass** · feedback **soft** · retrospective **pass+**
- **Checklist:** all **pass** (feedback soft)
- **Diagnosis:** Transfer surface excellent. Retrospective is strong. Feedback is one line without a corrective path.
- **Severity residual:** **P2**
- **Proposed feedback:** Si `True is 1` te sale True, aún cruzaste los operadores del starter. Corrige a `is None` / `==` / `is` en ese orden de líneas; la nota debe decir *cuándo* usar cada uno, no solo repetir “identidad”.
- **Code/output:** none

---

### S03-T1-B-E1 (weDo · guided)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Truthiness table is the right guided drill. Feedback opening clones retrospective (“Memorizar la lista falsy…”).
- **Severity residual:** **P2**
- **Proposed feedback:** Si ves nueve `True` al inicio, aún imprimes `v is not None`. Sustituye por `bool(v)` y relee `[0]` vs `range(0)`: lista no vacía es truthy; rango vacío es falsy.
- **Code/output:** none

---

### S03-T1-B-E2 (weDo · independent)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **pass** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Short-circuit return values are high value. Success list matches solution. Feedback is thin but corrective enough.
- **Severity residual:** none required (optional: lengthen feedback to 25+ words)
- **Proposed changes:** none

---

### S03-T1-B-E3 (weDo · transfer)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **pass** · retrospective **pass+**
- **Checklist:** all **pass**
- **Diagnosis:** Section flagship transfer. Job cost of false reject is explicit. Contract exact. Keep as gold for this section.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T2-A-E1 (weDo · guided)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **pass** · retrospective **soft**
- **Checklist:** all **pass**
- **Diagnosis:** Frontiers and single chain are clear. Feedback is good; retrospective reuses almost the same first two sentences → less metacognitive lift.
- **Severity residual:** **P2**
- **Proposed retrospective:** La primera rama verdadera gana: por eso 80 no “baja” a review. El error clásico es invertir umbrales o usar dos `if` y pisar el status (lo verás en E2). Si puedes explicar 49 → reject sin mirar la salida, ya lees fronteras como un revisor de PR.
- **Code/output:** none

---

### S03-T2-A-E2 (weDo · independent)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** R1 P1 starter alignment **landed** (`good` stub + `[95, 60, 30]`). Pedagogy of contrast is excellent. Feedback still one slogan.
- **Severity residual:** **P2**
- **Proposed feedback:** Si `good(95)` es review, copiaste el segundo `if` de `bad`. En `good` usa `elif`/`else` para exclusión mutua; **no** “arregles” `bad` — el contraste es la lección de review de PR.
- **Code/output:** none (starter is correct now)

---

### S03-T2-A-E3 (weDo · transfer)
- **Scores:** title **pass** · preamble **pass** · instruction **pass** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Threshold-order transfer is distinct from E1/E2. Feedback clones retrospective first sentence.
- **Severity residual:** **P2**
- **Proposed feedback:** Si 150 imprime “medio” o “bajo”, el umbral alto no va primero. Ordena de más estricto a más general (`>100` → `>50` → `>0` → else nulo) y re-prueba 0 y -3.
- **Code/output:** none

---

### S03-T2-B-E1 (weDo · guided)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass** · feedback **pass** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Guard order and success matrix are clear. Instruction is a bit terse (“Elimina el DEFECT…”) but DEFECT comment + preamble carry a true newbie.
- **Severity residual:** none (optional instruction micro-expand below if Fixer has capacity)
- **Optional instruction tighten:**  
  1. Quita `if not edad` (truthiness).  
  2. Escribe guards en orden: `is None` → no `int` → fuera 0–120 → `< 18` → OK.  
  3. Devuelve dicts `{status, code}` (no un solo `"BAD"`).  
  4. Prueba con `repr(e)` los cuatro valores del bucle.
- **Code/output:** none

---

### S03-T2-B-E2 (weDo · independent)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass** · feedback **pass** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Semantic-preserving refactor is excellent independent work. Starter still only prints nested; learner must add guards + comparison — acceptable for E2. Feedback is OK.
- **Severity residual:** **P2** (optional scaffold)
- **Optional code note:** after learner implements guards, solution already compares both; starter could leave a comment `# compara nested vs guards en el mismo bucle` — not required for pass.
- **Proposed changes:** none required

---

### S03-T2-B-E3 (weDo · transfer)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **pass** · retrospective **pass+**
- **Checklist:** all **pass**
- **Diagnosis:** Dead-branch analysis is high metacognition value. Success includes explanatory print. Keep.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T3-A-E1 (weDo · guided)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **soft** · retrospective **soft**
- **Checklist:** all **pass** (Spanish niggle in retrospective)
- **Diagnosis:** Allowlist → review policy is clear. Feedback is slogan-thin. Retrospective has subject-verb mismatch: “operaciones aún **puede** capturar”.
- **Severity residual:** **P2**
- **Proposed feedback:** Si `None` o `Tacna` salen `reject`, aún usas el DEFECT de hard-reject. En esta política: ausencia y desconocido → **review**; solo allowlist → accept.
- **Proposed retrospective:** Allowlist + review para desconocidos es patrón de catálogos en evolución. El error es castigar con reject un valor que **operaciones aún pueden capturar**. Combínalo con rangos en E2/E3.
- **Code/output:** none

---

### S03-T3-A-E2 (weDo · independent)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Soft outlier vs hard negative is well contracted. Zero-valid gate reinforced.
- **Severity residual:** **P2**
- **Proposed feedback:** Si `0` es reject, aún usas `m <= 0`. Separa: negativo → reject; cero → accept; `>50000` → review (no reject).
- **Code/output:** none

---

### S03-T3-A-E3 (weDo · transfer)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **pass** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** R1 starter gap fixed (four cases incl. RUC). Codes matrix is the right transfer. Feedback is usable.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T3-B-E1 (weDo · guided)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **pass** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Table-first pedagogy solid. FOO default aligned. Feedback has reasoning. Keep.
- **Severity residual:** none
- **Proposed changes:** none

---

### S03-T3-B-E2 (weDo · independent)
- **Scores:** title **pass** · preamble **pass** · instruction **soft→fail on one line** · feedback **soft** · retrospective **pass**
- **Checklist:** C/G/S/L/R/T **pass** · I **soft** (anti-pattern)
- **Diagnosis:** Match OR patterns + wildcards are the right E2. **Residual P1:** instruction step 3 says “Prueba la lista de cinco códigos **de la solución**” — trains peeking instead of stating the fixture. Starter loop still has only three codes (`OK`, `MISSING`, `OUT_OF_RANGE`) while success needs five (incl. `FOO`, `NEEDS_REVIEW`).
- **Severity residual:** **P1**
- **Proposed instruction (full):**
  1. El DEFECT manda el default a accept.
  2. Añade cases: `OK`; `MISSING | NEEDS_REVIEW`; `OUT_OF_RANGE | NOT_IN_ALLOWLIST | BAD_TYPE`; `case _` → review.
  3. Amplía el bucle a: `OK`, `MISSING`, `OUT_OF_RANGE`, `FOO`, `NEEDS_REVIEW` e imprime `código → status`.
- **Proposed feedback:** Si `MISSING` o `FOO` salen accept, el `case _` (o la falta de OR patterns) aún es permisivo. Default de negocio aquí es **review**, no accept.
- **Code/output changes:** **Recommended:** expand starter `for c in [...]` to the five codes so independent success is self-evident without opening solution. Preserve solution output.
- **Validation notes:** execute-and-diff if starter loop changes (output shape only after learner completes).

---

### S03-T3-B-E3 (weDo · transfer)
- **Scores:** title **pass** · preamble **pass** · instruction **pass** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass** (success partly rubric-style — OK for transfer)
- **Diagnosis:** Design choice if vs match is excellent transfer. Open-ended justification print is intentional. Feedback is a slogan.
- **Severity residual:** **P2**
- **Proposed feedback:** Si `map_edad(None)` es accept, falta el guard de ausencia. Si usaste `match` para el rango 18–65, reescribe con `if` y deja `match` solo en códigos finitos; la justificación debe nombrar *claridad del sujeto*, no “porque es moderno”.
- **Code/output:** none

---

### S03-T4-A-E1 (weDo · guided)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** R1 guided scaffold **landed** (`examples = []` + type DEFECT). Good E1 now. Feedback slogan-thin / overlaps retrospective.
- **Severity residual:** **P2**
- **Proposed feedback:** Si al probar `"x"` crashea, falta `isinstance` antes de comparar. Si `examples` vacío no imprime filas, llena cuatro dicts `{value, expected}` y verifica `got == expected` en cada uno.
- **Code/output:** none

---

### S03-T4-A-E2 (weDo · independent)
- **Scores:** title **pass** · preamble **pass** · instruction **pass** · feedback **soft** · retrospective **pass**
- **Checklist:** C/G/L/R/T/I **pass** · S **soft** (open wording of `invariant_text`)
- **Diagnosis:** Multi-field step-up is correct. Success is partially free-text — acceptable for independent if learner checks three examples. Feedback thin.
- **Severity residual:** **P2**
- **Proposed feedback:** Si un solo apellido vacío cae en reject, aún usas el DEFECT “cualquier falta = reject”. Distingue: uno vacío → review; ambos vacíos → reject; ambos con texto → accept (`strip` cuenta).
- **Code/output:** none

---

### S03-T4-A-E3 (weDo · transfer)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Counterexample-to-strict-policy is strong metacognition. Feedback clones retrospective start.
- **Severity residual:** **P2**
- **Proposed feedback:** Si `fixed(15)` sigue en reject, no separaste menores (review) de fuera de 0–120 (reject). El contraejemplo debe *verse* en prints: strict vs fixed lado a lado, más el invariante corregido en español.
- **Code/output:** none

---

### S03-T4-B-E1 (weDo · guided)
- **Scores:** title **pass** · preamble **soft** · instruction **pass** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass** (Spanish agreement in preamble)
- **Diagnosis:** Message rewrite is the right guided prose task. **Spanish:** “operaciones de intake **no puede** actuar” → subject plural / verb singular.
- **Severity residual:** **P2**
- **Proposed preamble (bullet block, full):**
  - **Contexto:** el equipo de operaciones de intake **no puede** actuar con mensajes “Error” o “inválido”.
  - **Meta:** reescribir tres mensajes vagos a plantilla campo + problema + acción.
  - **Éxito:** tres strings que nombren `edad`, el problema y qué hacer (sin PII real).
  - **Límites:** no inventes DNI ni teléfonos reales; usa valores sintéticos si citas un número.
- **Proposed feedback:** Si aún ves “Error”/“inválido”, no cumpliste la plantilla. Cada línea debe poder ejecutarla operaciones sin adivinar: nombre de campo, qué falló, y la acción (p. ej. “usa 0–120”).
- **Code/output:** none (wording of solution exemplar stays)

---

### S03-T4-B-E2 (weDo · independent)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass** · feedback **soft** · retrospective **pass**
- **Checklist:** all **pass**
- **Diagnosis:** Branch-coverage task clear; DEFECT comment aligned. Mild soft spot: preamble “idealmente fronteras 80 y 50” vs hint “Opcional 80 y 50” — solution includes both; prefer one voice.
- **Severity residual:** **P2**
- **Proposed hint line 1 (optional):** Incluye al menos un caso por rama y las fronteras 80 y 50 (como en el clasificador de T2).
- **Proposed feedback:** Si solo imprimes `score status` sin `expected`, aún no hay prueba. Arma `cases = [(val, expected), ...]` y `assert` (o comparación explícita) antes de imprimir `PASS`.
- **Code/output:** none

---

### S03-T4-B-E3 (weDo · transfer)
- **Scores:** title **pass** · preamble **pass+** · instruction **pass+** · feedback **soft** · retrospective **pass+**
- **Checklist:** all **pass**
- **Diagnosis:** Red→green off-by-one is professional and well aligned starter/solution. Feedback clones retrospective opener.
- **Severity residual:** **P2**
- **Proposed feedback:** Si 18 sigue en review, la condición aún es `e > 18`. Cambia a rango inclusivo (`18 <= e <= 65`); **no** edites el expected del case para “hacer pasar” el test.
- **Code/output:** none

---

### youDo — Motor de reglas del intake (CP-N1-A)
- **Scores:** context **pass+** · objectives/requirements/rubric **pass+** · retrospective **pass+**
- **Checklist:** C/G/S/L/R all **pass**
- **Diagnosis:** Strong project frame. Starter DEFECTs + `_run_tests` remain the executable contract (fails by design — correct). Retrospective forces defense (None≠0, PII, 30s impact line, region policy). No bloat needed.
- **Severity residual:** none
- **Proposed changes:** none
- **Code/output:** preserve intentional defects and assertions

---

## Priority order (Round 2 Fixer)

### P1 — fix first
1. **S03-T3-B-E2:** rewrite instruction step 3 so it does **not** say “de la solución”; list the five codes explicitly. Prefer expanding starter loop to those five codes (execute-and-diff only if output contract of starter changes — learner still implements cases).

### P2 — polish (same pass if capacity)
1. **Spanish agreement:** T4-B-E1 preamble (`pueden` / rewrite as proposed); T3-A-E1 retrospective (`pueden capturar`).
2. **Feedback that does not clone retrospective** (use proposed texts where listed):  
   T1-A-E2, T1-A-E3, T1-B-E1, T2-A-E2, T2-A-E3, T3-A-E1, T3-A-E2, T3-B-E2, T3-B-E3, T4-A-E1, T4-A-E2, T4-A-E3, T4-B-E1, T4-B-E2, T4-B-E3.
3. **Retrospective de-dupe:** T2-A-E1 (proposed full retrospective above).
4. **Optional:** T2-B-E1 instruction micro-expand; T4-B-E2 hint voice on frontiers 80/50.
5. Length-check edited prose (feedback ~25–60 words; retrospective ~40–80).

### Explicit non-goals this round
- Do **not** re-add fields that already exist.
- Do **not** rewrite I Do demos (all pass / pass+).
- Do **not** rewrite You Do context/rubric/starter policy.
- Do **not** change solution **outputs** unless an execute-and-diff is forced by the T3-B-E2 starter loop expansion (learner-facing starter only).

---

## Cross-cutting residual risks

1. **Feedback = first sentence of retrospective** remains the main quality debt: newbies get the same paragraph twice and little *immediate* corrective signal after a wrong run.
2. **Open-ended units** (T4-B-E1 messages, T3-B-E3 justification, T4-A-E2 invariant text) stay rubric-style — do not over-constrain strings.
3. **match/case** still needs Pyodide 3.10+; T3-B-E2 preamble already notes it — keep.
4. **You Do starter fails `_run_tests` by design** — docs/retrospective correctly imply fix-first; do not “green” the starter.
5. **Section id** `data-structures` vs title “Decisiones…” — out of scope for this campaign.
6. **Volume:** only residual P1 + targeted P2 edits — Fixer must hand-edit unit-by-unit, no template paste.

---

## Fixer handoff checklist (Round 2)

- [ ] **P1** S03-T3-B-E2: instruction without “de la solución”; five codes explicit; optional starter loop expand
- [ ] **P2** Spanish: T4-B-E1 preamble; T3-A-E1 retrospective
- [ ] **P2** Feedback rewrites listed above (reasoning, non-clone)
- [ ] **P2** T2-A-E1 retrospective rewrite
- [ ] Execute-and-diff only if starter code/output touched
- [ ] Professional Peruvian Spanish; no real PII; no generators
- [ ] Section static build still compiles
- [ ] Do not re-open pass+ I Do / You Do bodies

---

## Summary counts

| Bucket | Count |
|--------|------:|
| Units reviewed | 33 |
| Campaign-complete (fields present) | 33/33 |
| Residual **P1** | 1 (T3-B-E2 instruction/starter) |
| Residual **P2** units (feedback/ES/polish) | ~16 |
| No residual change needed | ~16 (incl. all 8 I Do + flagship We Dos + You Do) |

Round-1 completeness **accepted**. Round-2 is a **tighten pass**, not a second full rewrite.

---

Section 3 exercise pedagogy review complete. Ready for the Fixer prompt.
