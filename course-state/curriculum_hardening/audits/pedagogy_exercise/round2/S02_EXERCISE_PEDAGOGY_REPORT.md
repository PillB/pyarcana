# S02 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Valores, tipos, operadores e I/O
- **id:** `basics`
- **index:** 2
- **source:** `src/lib/course/sections/s02-basics.ts` (re-read after Round-1 fix)
- **counts:** iDo 8 · weDo 24 · youDo 1 (33 units under Gradual Release)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length caps, E1→E2→E3 fade, preamble/retrospective checklists).
- Manually re-inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source — not the Round-1 report as authority.
- Scored for a **true newbie**: can they answer what / why / success / constraints before code, and principle / misconception / transfer after?
- No bulk generation, no scripts to manufacture prose, no copy-paste of educational text across sections.
- Round-1 context used only to avoid re-diagnosing already-fixed shell absences.

## Cross-cutting diagnosis (post–Round 1)

| Area | Status after R1 fix | Residual for true newbie |
|------|---------------------|---------------------------|
| `preamble` present | All 8 iDo + 24 weDo | Content generally strong; few thin success/constraint nuances |
| `retrospective` present | All 33 units | **Systematically short** (many 20–35 words vs target 40–80); principle + misconception + transfer often compressed into one line |
| We Do `title` | All 24 present, distinct E1/E2/E3 | Pass |
| `instruction` task-only | Mostly clean steps | Pass; minor breadcrumb gaps on dense transfers |
| Success before start | In preambles (not only `tests`) | Pass for nearly all weDo |
| `why` (iDo) | Present | Several under 40 words; T1-A still echoes preamble |
| `feedback` | Present | **Most under 25 words** (target 25–60); cheer + next-step more than *reasoning* |
| Code/solutions/outputs | Unchanged and solid | No correctness rewrites needed |
| E1→E2→E3 fade | Titles and scaffolds differ | Pass — not three clones |

**Bottom line:** Round 1 closed the **shell gap** (bare drills → Gradual Release framing). Round 2 residual is **depth and length discipline** on retros, feedback, a few `why`s, and two high-load transfer scaffolds — not a second full rewrite of every preamble.

**Severity policy (Round 2)**
- **P0:** still a bare drill or high-stakes unit without usable framing for a newbie.
- **P1:** framing present but success/constraints unclear, or metacognitive close too thin to stick, or transfer without enough schema breadcrumbs.
- **P2:** polish (length caps, feedback reasoning, light de-duplication, optional self-check).
- **OK:** meets checklist and length band; only optional nits.

---

## Unit ledger

### S02-T1-A-DEMO (iDo)
- **Scores:** preamble **good** · description **good** · why **fair** · retrospective **good**
- **Diagnosis:** Preamble and retrospective match the spec exemplar tone (`42` vs `"42"`, no write yet, bridge to We Do). `why` opens with the same “antes de parsear… ver el tipo” idea as the preamble — redundant cognitive load; slightly under distinct value.
- **Checklist:** context pass · goal pass · success partial (observe prints; OK for demo) · constraints pass (sintético) · retrospective pass
- **Severity:** P2
- **Residual improvement:** Keep preamble/retrospective. Tighten `why` so it explains *technical* rationale only (not re-hook):
  - **Proposed why:** `type(x).__name__` hace visible la clase de cada campo. Teléfono y códigos deben modelarse como `str` aunque “parezcan números”. La igualdad `42 == "42"` es `False` a propósito: el pipeline no puede comparar cantidad con texto.
- **Code/output changes:** none
- **Validation notes:** Preserve exact demo output (types + `False`).

---

### S02-T1-B-DEMO (iDo)
- **Scores:** preamble **good** · description **good** · why **good** · retrospective **good**
- **Diagnosis:** Three-branch contract and “no `eval`” are clear. Retrospective names reuse sites. Length of retrospective is acceptable; `why` is solid.
- **Checklist:** context/goal/success/constraints/retrospective pass
- **Severity:** OK
- **Residual improvement:** Optional one self-check at end of retrospective: *¿Puedes nombrar las tres salidas de `safe_int` sin mirar el código?*
- **Code/output changes:** none

---

### S02-T2-A-DEMO (iDo)
- **Scores:** preamble **good** · why **fair** · retrospective **thin**
- **Diagnosis:** Good “watch names and `==`” framing. Retrospective is ~27 words: principle + transfer present, misconception light.
- **Checklist:** context/goal pass · success pass (output of `if`) · constraints pass · retrospective partial (length)
- **Severity:** P2
- **Proposed retrospective (expand to ~50 words):**  
  Asignar es `=`; preguntar igualdad es `==` — mezclarlos es `SyntaxError` o lógica rota. `snake_case` y constantes `UPPER_CASE` reducen `NameError` en review. El error clásico es “el código se ve bien” con CamelCase y `if x = 1`. En We Do renombrarás variables y corregirás tres `if` rotos.
- **Code/output changes:** none

---

### S02-T2-B-DEMO (iDo)
- **Scores:** preamble **good** · why **fair** · retrospective **good**
- **Diagnosis:** Dense dual lesson, but preamble orders the watch path (raw → clean → alias → copy → `is None`). Retrospective separates string vs mutable habits. `why` is slightly short of the 40-word band.
- **Checklist:** pass overall
- **Severity:** P2
- **Residual improvement:** Expand `why` one sentence: lists are only a mutability preview; intake audit depends on `*_raw` keys, not on deep collections yet.
- **Code/output changes:** none

---

### S02-T3-A-DEMO (iDo)
- **Scores:** preamble **good** · why **fair** · retrospective **good**
- **Diagnosis:** Precedence trap and float-as-motivation for Decimal are well framed. `why` still slightly short and overlaps preamble.
- **Checklist:** pass
- **Severity:** P2
- **Residual improvement:** `why` focus on *why parens in code review* + float only as expression practice (not money). Keep output `118.0`.
- **Code/output changes:** none

---

### S02-T3-B-DEMO (iDo)
- **Scores:** preamble **good** · why **weak** · retrospective **thin**
- **Diagnosis:** Preamble is strong (soles, str constructor, no `Decimal(0.1)`). `why` is only ~22 words — below band and thin for the section’s money contract. Retrospective ~32 words misses a crisp self-check.
- **Checklist:** context/goal/success pass · constraints pass · retrospective partial
- **Severity:** P1
- **Proposed why:**  
  En soles, `float` miente por la base binaria. `Decimal` se construye **desde texto** para no heredar ese error; `quantize(..., ROUND_HALF_EVEN)` fija céntimos. Este es el contrato mínimo de montos en onboarding de data financiera en Perú — no contabilidad real, sí hábito de review.
- **Proposed retrospective:**  
  Dinero = `Decimal` desde `str` + `quantize` a `0.01`. El error clásico es `Decimal(0.1)` o “arreglar” con `round` al final. Pregunta de cierre: ¿por qué `0.1 + 0.2` no es `0.3` en float? En We Do compararás float vs Decimal y armarás propina y `parse_monto`.
- **Code/output changes:** none

---

### S02-T4-A-DEMO (iDo)
- **Scores:** preamble **good** · why **weak** · retrospective **thin**
- **Diagnosis:** Avoid-real-`input()` and `:.2f` on Decimal are clear in preamble. `why` (~20 words) and retrospective (~31) under-serve the “separar captura / parse / reporte” principle.
- **Checklist:** pass with thin close
- **Severity:** P1
- **Proposed why:**  
  `input()` siempre devuelve `str`; en demos y tests se simula con variables para poder ejecutar en Pyodide/CI. El reporte usa f-strings y `:.2f` sobre `Decimal` sin convertir a `float`. Separar captura, parse y formato es lo que hace testeable el intake.
- **Proposed retrospective:**  
  Si el resumen se arma sin consola real, los tests del parser no dependen del teclado. El error clásico es formatear con `float(monto)` “por comodidad”. We Do: saludo, reporte multi-línea y función que simula prompts.
- **Code/output changes:** none

---

### S02-T4-B-DEMO (iDo)
- **Scores:** preamble **good** · why **fair** · retrospective **good**
- **Diagnosis:** Dense demo; preamble correctly names three gates and You Do alignment. `why` still almost restates preamble (“el gate no es imprimió algo”). Retrospective is one of the better closes in the section.
- **Checklist:** pass
- **Severity:** P2
- **Residual improvement:** Rewrite `why` to technical structure only: schema keys (`*_raw`, clean, `errors`), `clean_required`, optional `safe_int` for edad — not a second watch-list.
- **Code/output changes:** none

---

### S02-T1-A-E1 (weDo · guided)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **thin** · feedback **thin**
- **Diagnosis:** Shell complete; success order of types is pre-task. Retrospective ~31 words; feedback ~21 (cheer + next). Scaffold blanks intact.
- **Checklist:** context/goal/success/constraints pass · retrospective partial (length)
- **Severity:** P2
- **Proposed retrospective:**  
  El nombre del tipo se lee con `type(x).__name__`; `None` es `NoneType`, no la cadena `"None"`. El error clásico es tratar `False` como texto o `0` como `bool` en el reporte de tipos. Autochequeo: ¿qué imprime `type(None).__name__`? Siguiente: demostrar que `42` y `"42"` no son lo mismo.
- **Proposed feedback:**  
  Si acertaste `NoneType` y `bool`, ya no mezclas “ausencia”, “falso” y “cero” en el ojo. El `repr` muestra el literal real (comillas en str). Siguiente: igualdad cruda `42` vs `"42"`.
- **Code/output changes:** none

---

### S02-T1-A-E2 (weDo · independent)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **fair**
- **Diagnosis:** Independent fade is clear. Success multi-part is front-loaded. Retrospective covers equality + bool subtype. Feedback under band but already explains reasoning.
- **Checklist:** pass
- **Severity:** P2
- **Residual improvement:** Nudge feedback to ~35 words (keep the “tipo se decide antes de comparar” idea). No code change; note text may vary if tests stay semantic.
- **Code/output changes:** none

---

### S02-T1-A-E3 (weDo · transfer)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **thin**
- **Diagnosis:** Phone-as-`str` constraint is in preamble limits — good. Feedback is one sentence (~17 words).
- **Checklist:** pass
- **Severity:** P2
- **Proposed feedback:**  
  Si `contacto` quedó entre comillas y todos los `ok=True`, elegiste tipos por semántica de campo, no por “lo que Excel infiere”. Teléfono no es cantidad. Llevas este schema al dict del You Do.
- **Code/output changes:** none

---

### S02-T1-B-E1 (weDo · guided)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **thin** · feedback **thin / duplicate**
- **Diagnosis:** Success `21 int` is clear. Feedback and retrospective both say “strip + int mínimo viable” — redundant.
- **Checklist:** pass with de-dupe needed
- **Severity:** P2
- **Proposed feedback:**  
  `int` sin `strip` a veces “funciona” con espacios, pero el hábito falla en vacíos y en mensajes. Orden: limpiar → construir → reportar tipo. Sin `eval`.
- **Proposed retrospective:**  
  `strip` + `int` es el mínimo de campo numérico en texto. El error clásico es convertir y solo después descubrir `""`. Siguiente: envolver las tres ramas (OK / vacío / basura) en `safe_int`.
- **Code/output changes:** none

---

### S02-T1-B-E2 (weDo · independent)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **fair** · feedback **thin**
- **Diagnosis:** Core skill well framed. Feedback (~13 words) under-serves failed attempts (why empty ≠ garbage).
- **Checklist:** pass; feedback fails length/reasoning band
- **Severity:** P1
- **Proposed feedback:**  
  Vacío y basura son errores distintos: el mensaje debe decirlo y nombrar el campo. Sin `eval` ni `except: pass`. Si las cuatro líneas coinciden con la solución, ya tienes el contrato reutilizable del parser.
- **Proposed retrospective (slight expand):**  
  Una `safe_*` reutilizable es el núcleo del gate de parse. Tres ramas, un mensaje accionable con `!r`. Reusarás esta función en el pipeline de dos campos y en el You Do — no reinventes otra firma a mitad de sección.
- **Code/output changes:** none

---

### S02-T1-B-E3 (weDo · transfer)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **fair**
- **Diagnosis:** Multi-field raw/errors transfer with clear three scenarios. Instruction is task-only. Solid unit.
- **Checklist:** pass
- **Severity:** OK
- **Residual improvement:** Optional: feedback +5 words naming “no pises `raw` al fallar clean”.
- **Code/output changes:** none

---

### S02-T2-A-E1 (weDo · guided)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **weak** · feedback **weak**
- **Diagnosis:** Exact names in success prevent silent wrong renames — good guided design. Retrospective (~20 words) and feedback (~10) are among the thinnest in the section.
- **Checklist:** success pass · retrospective fail length
- **Severity:** P1
- **Proposed feedback:**  
  Si el `print` listó los cinco sin `NameError`, los identificadores coinciden con el contrato del starter. `EDAD_MAXIMA` en mayúsculas marca tope de negocio; `l`/`O`/`I` quedan fuera a propósito.
- **Proposed retrospective:**  
  `snake_case` para variables, `UPPER_CASE` para constantes. Evitar `l`/`O`/`I` evita confusiones con `1`/`0` en review. El error clásico es renombrar en la cabeza pero no en el `print`. Siguiente: cazar `=` donde iba `==`.
- **Code/output changes:** none (names must match print)

---

### S02-T2-A-E2 (weDo · independent)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **thin** · feedback **fair**
- **Diagnosis:** Success three `ok` lines is clear; no-walrus in limits. Solution’s `if flag:` is allowed by preamble — good. Retrospective ~24 words.
- **Checklist:** pass with thin close
- **Severity:** P2
- **Proposed retrospective:**  
  `=` guarda; `==` pregunta. En un `if`, la asignación es `SyntaxError` en Python. Detectarlo en review es habilidad de producción. Preferir `if flag:` a `if flag == True` es estilo, no el bug principal. En E3 mapearás encabezados CSV a identificadores estables.
- **Code/output changes:** none

---

### S02-T2-A-E3 (weDo · transfer)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **thin**
- **Diagnosis:** Transfer surface (CSV headers) is clear. Slight newbie risk: preamble says “p. ej. teléfono → `contacto`” while solution prints require exact map keys; if learner chooses `telefono`, prints still work if dict is complete, but solution/output diverge. Acceptable for transfer if rubric is semantic.
- **Checklist:** pass
- **Severity:** P2
- **Residual improvement:** In preamble **Éxito** or **Límites**, pin one preferred map for teléfono (`contacto`) and dirección (`direccion`) so solution compare is fair without killing creativity elsewhere.
- **Code/output changes:** none preferred

---

### S02-T2-B-E1 (weDo · guided)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **fair**
- **Diagnosis:** Bool table success is pre-task — critical for this misconception drill. Strong unit; feedback still short of band.
- **Checklist:** pass
- **Severity:** P2
- **Proposed feedback:**  
  `None is None` y `[] is []` no se “sienten” igual: listas nuevas son objetos distintos. `1 == True` no autoriza `1 is True`. Si la tabla salió `True, True, False, True, False`, ya separas identidad de valor.
- **Code/output changes:** none

---

### S02-T2-B-E2 (weDo · independent)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **fair**
- **Diagnosis:** Clear asserts; good independent fade. Minor feedback length only.
- **Checklist:** pass
- **Severity:** OK
- **Residual improvement:** none required
- **Code/output changes:** none

---

### S02-T2-B-E3 (weDo · transfer)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **duplicate**
- **Diagnosis:** Core raw/clean transfer. Feedback text nearly clones retrospective — wastes the post-check slot.
- **Checklist:** pass; feedback should differ from retrospective
- **Severity:** P2
- **Proposed feedback:**  
  Tras `.upper()` en clean, si `nombres_raw` sigue con espacios y tildes, el assert de auditoría pasó. No hace falta mutar el string original: `str` es inmutable; el riesgo real es reutilizar el mismo nombre o clave.
- **Code/output changes:** none

---

### S02-T3-A-E1 (weDo · guided)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **thin**
- **Diagnosis:** Operator table success numbers are in preamble — fixed the old “hidden in tests” problem. Good.
- **Checklist:** pass
- **Severity:** P2
- **Proposed feedback:**  
  Con `n=17`, `d=5`: `//` 3, `%` 2, `**` 16, `/` 3.4. En Python 3 el `/` no trunca. Si la nota menciona float, ya no confundes división entera con real.
- **Code/output changes:** none

---

### S02-T3-A-E2 (weDo · independent)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **thin** · feedback **fair**
- **Diagnosis:** One-misconception focus is excellent. Retrospective ~24 words — expand misconception slightly.
- **Checklist:** pass
- **Severity:** P2
- **Proposed retrospective:**  
  `-3**2` es `-(3**2)`, no `(-3)**2`. Precedencia de `**` sobre el unario `-` no se adivina: se demuestra con prints y paréntesis. El error clásico es “cuadrado de negativo” sin paréntesis en una fórmula de scoring. En E3 aplicarás paréntesis en la tasa IGV.
- **Code/output changes:** none

---

### S02-T3-A-E3 (weDo · transfer)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **good**
- **Diagnosis:** Float garbage is correctly framed as expected — critical residual risk from Round 1 is closed. Do not “fix” output to `94.4`.
- **Checklist:** pass
- **Severity:** OK
- **Residual improvement:** Optional self-check in retrospective: *¿Por qué no usas `round` aquí aunque el print “se vea feo”?*
- **Code/output changes:** none — keep float garbage

---

### S02-T3-B-E1 (weDo · guided)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **thin** · feedback **fair**
- **Diagnosis:** Contrast drill well framed for Perú review culture. Retrospective short.
- **Checklist:** pass
- **Severity:** P2
- **Proposed retrospective:**  
  Si viste `0.30000000000000004`, ya tienes el argumento de review. `Decimal` se construye desde texto para no heredar el error binario; `Decimal(0.1)` lo reintroduce. Siguiente: propina con `quantize` a céntimos.
- **Code/output changes:** none

---

### S02-T3-B-E2 (weDo · independent)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **thin**
- **Diagnosis:** Exact Decimal targets in success. Strong independent practice.
- **Checklist:** pass
- **Severity:** P2
- **Proposed feedback:**  
  `8.55` y `94.05` con `ROUND_HALF_EVEN` demuestran céntimos estables sin `float`. Quantize en propina y en total, no solo “al final por suerte”.
- **Code/output changes:** none

---

### S02-T3-B-E3 (weDo · transfer)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **fair**
- **Diagnosis:** `parse_monto` mirrors `safe_int`; punto decimal constraint is in limits. Instruction “sigue el contrato de la pista” is slightly vague for transfer — hints carry the weight.
- **Checklist:** pass; instruction could name empty → InvalidOperation path more explicitly
- **Severity:** P2
- **Residual improvement:** Instruction step 1: “strip → vacío → `Decimal` → `quantize(0.01)` → `except InvalidOperation`” (one line), keep task-only.
- **Code/output changes:** none

---

### S02-T4-A-E1 (weDo · guided)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **thin** · feedback **fair**
- **Diagnosis:** Exact greeting + f-string constraint. Feedback now explains missing `f` — good residual from Round-1 P2. Retrospective still short.
- **Checklist:** pass
- **Severity:** P2
- **Proposed retrospective:**  
  Unicode en f-strings funciona en Python 3 sin trucos. El error clásico es olvidar la `f` y ver `{nombre}` literal. Autochequeo: ¿qué sale si quitas la `f`? Siguiente: reporte multi-línea con monto `:.2f`.
- **Code/output changes:** none

---

### S02-T4-A-E2 (weDo · independent)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **thin** · feedback **fair**
- **Diagnosis:** Ticket-paste context is good. Retrospective ~23 words.
- **Checklist:** pass
- **Severity:** P2
- **Proposed retrospective:**  
  Formato consistente gana a creatividad en reportes de datos. `Decimal` acepta `:.2f` sin pasarlo a `float`. El error clásico es `str(monto)` sin dos decimales fijos. En E3 harás la captura testeable sin `input()` real.
- **Code/output changes:** none

---

### S02-T4-A-E3 (weDo · transfer)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **good** · feedback **good**
- **Diagnosis:** Pure function + no `input()` constraints are front-loaded. Strong transfer. One of the better shell+task pairs.
- **Checklist:** pass
- **Severity:** OK
- **Residual improvement:** none required
- **Code/output changes:** none

---

### S02-T4-B-E1 (weDo · guided)
- **Scores:** title **good** · preamble **good** · instruction **good** · retrospective **thin** · feedback **fair**
- **Diagnosis:** Empty-field gate well framed. Retrospective ~25 words — expand slightly.
- **Checklist:** pass
- **Severity:** P2
- **Proposed retrospective:**  
  Raw siempre presente aunque clean sea `None`. Mensaje accionable = campo + `raw` con `!r`. El error clásico es borrar el original al fallar. Este micro-contrato se multiplica a todos los campos requeridos del You Do.
- **Code/output changes:** none

---

### S02-T4-B-E2 (weDo · independent)
- **Scores:** title **good** · preamble **good** · instruction **minimal** · retrospective **good** · feedback **thin**
- **Diagnosis:** Code task is two assignments; pedagogy now carries the principle (Perú Unicode). Instruction is correct but still reads like busywork without restating *why* in one task line. Framing is enough that severity is not P0.
- **Checklist:** pass
- **Severity:** P2
- **Proposed instruction:**  
  1. Asigna `raw` al original (con espacios).  
  2. Asigna `clean` con `strip` (sin tocar codificación).  
  3. Corre los asserts: raw idéntico al original; clean es `"Ñahui"`.
- **Proposed feedback:**  
  Si `Ñahui` sobrevive con ñ intacta, tu pipeline no es del siglo ASCII. Obligatorio en datos peruanos; no hace falta `encode`/`decode` aquí.
- **Code/output changes:** none

---

### S02-T4-B-E3 (weDo · transfer)
- **Scores:** title **good** · preamble **good** · instruction **fair** · retrospective **good** · feedback **good**
- **Diagnosis:** Highest-load We Do. Preamble correctly lists three gates and forbids uncaught `ValueError`. Starter is still bare `pass` with one-line comments; You Do starter documents full key list. For a true newbie, transfer fade is intentional but **schema keys should appear in instruction or starter comment** so “schema completo” is not a memory test of the demo.
- **Checklist:** context/goal/success/constraints pass · instruction partial (schema breadcrumbs)
- **Severity:** P1
- **Proposed instruction:**  
  1. Implementa `safe_int` (vacío / OK / basura) con el contrato de la sección.  
  2. Implementa `parse_client`: todas las claves `*_raw`, limpios, `edad`, `errors`; edad opcional con `safe_int`.  
  3. No modifiques los tres bloques de assert; ejecuta hasta `3 tests OK`.  
  (Opcional en comentario de starter, no en essay: listar las claves como en el You Do.)
- **Proposed retrospective (keep differentiation from You Do):**  
  Si la suite pasa en local y en Pyodide, el incremento S02 del capstone está listo. Tres invariantes: Unicode, vacío, número inválido. El You Do añade `mostrar_resumen`, `main` y un **cuarto** caso de edad en blanco — no copies solo esta suite y marques el portafolio listo.
- **Code/output changes:** optional starter comment with key list only; no assert changes

---

### youDo — Parser de intake (youDo)
- **Scores:** context **good** · objectives/requirements/rubric **good** · retrospective **good**
- **Diagnosis:** Strongest project frame in the section. Retrospective defense prompts match the campaign exemplar. Residual: `context` still does not spell the operational success gate (`_run_tests()` → `tests OK` + demo summary), though the starter makes it obvious to careful readers.
- **Checklist:** context/goal/success (via starter) pass · constraints pass · retrospective pass
- **Severity:** P2
- **Proposed context add-on (one sentence at end of existing context, not a rewrite):**  
  Éxito operativo: `_run_tests()` imprime `tests OK` y `main()` muestra un resumen demo — sin modificar los asserts fijos.
- **Code/output changes:** none to tests

---

## Priority order

### P0
- **None remaining.** Round 1 eliminated bare drills and unframed high-stakes units.

### P1 (fix first in Round-2 Fix)
1. **S02-T3-B-DEMO** — expand thin `why` + retrospective (money contract for Perú).
2. **S02-T4-A-DEMO** — expand thin `why` + retrospective (testable I/O story).
3. **S02-T1-B-E2** — feedback must explain empty vs garbage reasoning (core skill).
4. **S02-T2-A-E1** — thinnest weDo retrospective/feedback pair; exact names need a proper close.
5. **S02-T4-B-E3** — instruction (or starter comment) must name schema keys; keep three-assert suite.

### P2 (batch polish)
- **Length band:** most `feedback` lines (currently ~10–22 words → target 25–60 with *reasoning*).
- **Retrospectives** under ~40 words: especially T2-A-DEMO, T2-A-E1/E2, T3-A-E2, T3-B-E1, T4-A-E1/E2, T4-B-E1, and other thin closes listed in the ledger.
- **De-duplicate:** T1-B-E1 and T2-B-E3 feedback vs retrospective.
- **T1-A-DEMO `why`:** stop echoing preamble.
- **T2-A-E3:** pin preferred `contacto` / `direccion` names for fair solution compare.
- **T3-B-E3 instruction:** one-line pipeline of steps (strip → vacío → Decimal → quantize → InvalidOperation).
- **youDo context:** one sentence on `tests OK`.
- **Optional self-checks** on high-stakes closes (T1-B-DEMO, T3-A-E3, T3-B-DEMO).

### OK (no change required)
- S02-T1-B-DEMO (optional self-check only)
- S02-T1-B-E3, S02-T2-B-E2, S02-T3-A-E3, S02-T4-A-E3
- Most preambles/titles already meet checklist; do **not** rewrite working shells for style alone

---

## Residual risks

1. **Thin retrospective epidemic** — shell fields exist, but many closes are one sentence; newbies may not retain principle + misconception + transfer. Prefer expanding retros over inventing new exercises.
2. **Feedback still post-solution only (UI)** — even improved feedback arrives after “Ver solución”; success must stay in preamble (already true). Feedback’s job is *why it worked*, not first-time success criteria.
3. **Float garbage in T3-A-E3** — still intentional; do not clean to `94.4`.
4. **T4-B-E3 ≈ You Do** — retrospectives must keep the fourth blank-age case and `mostrar_resumen` / `main` as You Do differentiators.
5. **Anti-aberration** — 24 weDo invites template paste when “expanding all feedback”; each expansion must stay hand-written to the unit’s misconception.
6. **No opportunistic code rewrites** — solutions/outputs remain aligned; Round-2 Fix is almost entirely prose length and clarity.

---

## Fixer handoff checklist (Round 2)

- [ ] No unit left without `preamble` + `retrospective` (already true — do not strip)
- [ ] Address all **P1** items with full proposed text above (or equivalent hand-written quality)
- [ ] Expand thin **feedback** / **retrospective** / iDo **why** toward spec bands without essay bloat
- [ ] De-duplicate feedback vs retrospective where noted
- [ ] T4-B-E3: schema key breadcrumbs without spoiling assert suite
- [ ] Exact outputs preserved (float demos, `safe_int` messages, Decimal asserts)
- [ ] Spanish PE; synthetic data only
- [ ] No generators / bulk paste of pedagogical prose
- [ ] Section source still typechecks / static build

---

Section 2 exercise pedagogy review complete. Ready for the Fixer prompt.
