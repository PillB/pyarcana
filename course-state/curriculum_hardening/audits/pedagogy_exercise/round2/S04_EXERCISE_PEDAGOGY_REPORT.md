# S04 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Iteración y resúmenes transaccionales
- **id:** `functions-modules`
- **index:** 4
- **shortTitle:** Iteración & Resúmenes
- **source file:** `src/lib/course/sections/s04-functions-modules.ts`
- **counts:** iDo **8**, weDo **24**, youDo **1**
- **subtopics:** S04-T1-A … S04-T4-B (E1→E2→E3 cada uno)
- **prior:** Round-1 report + Fix applied (fields present in source)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, lengths, E1/E2/E3 fade, checklists).
- Re-inspected **current** source: every `iDo.steps[]`, `weDo.steps[]`, `youDo` — after Round-1 Fix.
- Scored **quality for a true newbie**, not mere field presence. Round 1 was context only (not rubber-stamped).
- Verified Round-1 fixture risks: T3-A-E2 (3 statuses → `0.3333`) and T3-B-E3 (4 rows → tasa `0.5`) are **aligned** in starter/solution.
- Hand-crafted residual notes only. **No** source edits. **No** bulk generation of educational prose.

## Round-1 → Round-2 delta (global)

| Round-1 gap | Current state |
|-------------|----------------|
| Missing `preamble` / `retrospective` (all units) | **Present** on all 8 iDo + 24 weDo + youDo |
| Missing We Do `title` | **Present** (4–8 words; within 4–12) |
| Bare “Concepto+fixture+contrato” instruction | Split: preamble (4 bullets) + task-only `instruction` |
| Thin `why` / slogan `feedback` | `why` mostly 36–48 words; `feedback` mostly 20–32 words with reasoning |
| Fixture drift T3-A-E2 / T3-B-E3 | **Fixed** in source |
| You Do without retrospective | **Present** (strong defense prompts) |

**Verdict:** Round-1 structural campaign **succeeded**. Residual work is **quality differentiation**, not empty fields.

---

## Global residual findings (section-level)

| Pattern | Observation | Severity |
|---------|-------------|----------|
| **Feedback ≈ retrospective clone** | On ~18/24 We Do, `feedback` and `retrospective` share the same opening sentence(s). Spec roles differ: feedback = immediate corrective *reasoning* after attempt; retrospective = principle + misconception + **transfer** + optional self-check. Clone starves metacognition. Worst: **T4-B-E1** (byte-identical), **T2-A-E2**, **T3-A-E1**. | **P1** (systemic) |
| **Retrospective short of 40–80** | Many We Do retros land ~27–35 words (still useful, but thin on transfer/self-check). Spec target 40–80. | P2 (bulk) / P1 if also clone |
| **Preamble as 4 bullets** | 41–68 words; under 80-word prose target but **spec allows “4 short bullets”** — checklist items (context/goal/success/constraints) **pass**. Do not bloat. | OK |
| **E1 hints still near-paste** | Second hints often name the exact fix line (`list(range(3))`, `start=1`, etc.). Progressive fade could soft-step first. | P2 |
| **T4-B-E3 `nota:` string unpinned** | Preamble/instruction say “una línea `nota:`” but do not pin the solution string; learner may invent wording that fails output compare. | P1 |
| **T2-A-E3 instruction wording** | “imprime `rest` y la cola” can read as two prints; solution is one `print("rest", cola)`. | P2 |
| **T3-B-E1 abstraction** | Still squares/evens; preamble bridges intake lightly — acceptable. | P2 optional |
| **I Do** | Solid overall; a few `why`/`retrospective` slightly under length; no missing orientation. | P2 |
| **You Do** | Context/objectives/requirements/rubric/retrospective strong. | residual none critical |
| **Code/outputs** | Preserve; Round-1 fixture fixes hold. | none |

**Severity convention (Round 2)**
- **P0:** Newbie still cannot answer what / why / success / stick-point (field missing or prose unusable). **None found.**
- **P1:** Usable frame, but role collision or success ambiguity that still confuses or wastes metacognitive space.
- **P2:** Polish (length bands, hint spoil, mild wording).

**Quality scores used below:** preamble / title / instruction / retrospective each **strong | adequate | weak**, plus checklist pass/partial/fail.

---

## Unit ledger

### S04-T1-A-DEMO (iDo)
- **Quality:** preamble **strong** · why **strong** (~48w) · retrospective **strong** (~49w)
- **Checklist:** context **pass** · goal **pass** · success **pass** (output match) · constraints **pass** (no escribir; sintético) · retrospective **pass**
- **Diagnosis:** Round-1 proposals landed cleanly. Newbie is told what to watch (for por valor vs range, stop exclusivo) and gets We Do bridge.
- **Severity:** residual **none** (optional P2: none required)
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T1-A-E1 (weDo, guided)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **adequate** (overlaps feedback)
- **Checklist:** context **pass** · goal **pass** · success **pass** · constraints **pass** · retrospective **partial** (clone of feedback)
- **Diagnosis:** Guided scaffold is right (near-complete starter, named DEFECT). Feedback and retro both open with “for por valor es el default…”. Hints step 2 almost pastes `list(range(3))`.
- **Severity:** P2
- **Proposed title:** keep
- **Proposed preamble:** keep
- **Proposed instruction:** keep
- **Proposed feedback (tighten role):**  
  El for de regiones ya estaba bien: el fallo era el print de relleno. Si tu salida termina en `[0, 1, 2]` y no en `ok True`, cerraste el contrato del stop exclusivo.
- **Proposed retrospective:**  
  Principio: listar con for por valor; `range(n)` solo si el índice importa. Malentendido: creer que `range(3)` es 1..3. Transfer: el mismo recorrido alimenta contadores del gate. ¿Qué imprimiría `list(range(1, 4))` frente a `list(range(3))`?
- **Code/output changes:** none
- **Hints (optional):** first hint only “mira el print final”; second may name `range(3)`.

### S04-T1-A-E2 (weDo, independent)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **strong** (self-check present; less clone than neighbors)
- **Checklist:** all **pass**
- **Diagnosis:** Canonical counter exercise. Feedback and retro related but not identical; self-check on `> 18` is good metacognition.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T1-A-E3 (weDo, transfer)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **adequate** (partial overlap with feedback)
- **Checklist:** all **pass** (success names `n_original 4` — good)
- **Diagnosis:** Transfer surface (dicts + filter print, raw intact) is clear. Mild feedback/retro overlap on “filtrar sin mutar raw”.
- **Severity:** P2
- **Proposed retrospective (differentiate):**  
  Principio: filtrar al reportar no es borrar del lote. Malentendido: tratar 0 o negativo como “casi positivo”. Transfer: en el You Do el `raw` debe sobrevivir al pase; el reporte y el almacenamiento no son el mismo acto. ¿Por qué imprimir `len(lote)` al final y no confiar en “no toqué nada”?
- **Code/output changes:** none

### S04-T1-B-DEMO (iDo)
- **Quality:** preamble **strong** · why **adequate** (~38w, just under 40) · retrospective **adequate** (~38w)
- **Checklist:** all **pass**
- **Diagnosis:** Clear dual danger (numerar + zip). `why` slightly short; content complete for a newbie.
- **Severity:** P2
- **Proposed why (optional expand ~45w):**  
  `start=1` numera para humanos (“fila 1…”); el índice interno de la lista sigue siendo 0-based. Validar `len(a)==len(b)` (o `zip(..., strict=True)` en 3.10+) evita el truncamiento silencioso de `zip`, que corrompe tasas de reject cuando una columna llega incompleta. Observa el try/except: el error ruidoso es el diseño correcto del pipeline.
- **Proposed changes otherwise:** none
- **Code/output changes:** none

### S04-T1-B-E1 (weDo, guided)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **adequate** (self-check; mild feedback overlap)
- **Checklist:** all **pass**
- **Diagnosis:** Clean guided defect (`start` default 0). Good enough for ship; optional de-clone.
- **Severity:** P2
- **Proposed changes:** optional only — keep texts; if touching, keep retro self-check and shorten feedback to “si ves `fila 0:`, el start no se pasó”.
- **Code/output changes:** none

### S04-T1-B-E2 (weDo, independent)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **weak→adequate** (high overlap with feedback)
- **Checklist:** success **pass** · retrospective **partial** (clone)
- **Diagnosis:** Excellent Cartesian-product defect. Feedback and retro nearly share first two sentences.
- **Severity:** P1
- **Proposed feedback:**  
  Nested loops multiplican pares (9 líneas); `zip` alinea en paralelo. Si viste `zip corto` con un solo par, ya sentiste el truncamiento silencioso que miente resúmenes.
- **Proposed retrospective:**  
  Principio: emparejar columnas es `zip` (o validación de `len`), no doble for. Malentendido: “se ve bien” con zip corto = datos correctos. Transfer: el siguiente ejercicio te obliga a `ValueError` en vez de callar. ¿Qué tasa de reject se inventaría si se pierde la última edad de un lote real?
- **Code/output changes:** none

### S04-T1-B-E3 (weDo, transfer)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **adequate** (overlap)
- **Checklist:** all **pass**; starter incomplete by design (transfer) **OK**
- **Diagnosis:** Dual path DESALINEADO/OK is clear in instruction. Starter still only first try — intentional. Feedback/retro share “assert de alineación” opener.
- **Severity:** P2
- **Proposed retrospective:**  
  Principio: desalineación debe ser error ruidoso. Malentendido: “casi igual longitud” es inocuo. Transfer: en el You Do no zipees columnas de fuentes distintas sin assert. Self-check: ¿qué imprime el segundo bloque si olvidas el `raise` y solo haces `zip` silencioso?
- **Code/output changes:** none (keep dual try/except in solution)

### S04-T2-A-DEMO (iDo)
- **Quality:** preamble **strong** · why **strong** · retrospective **strong**
- **Checklist:** all **pass**
- **Diagnosis:** Centinela + avance de `i` + basura posterior bien orientados. `indice final 3` explained in why.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T2-A-E1 (weDo, guided)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **adequate** (clone-ish + good self-check)
- **Checklist:** all **pass** (self-check helps)
- **Diagnosis:** Perfect continue-vs-break defect. Feedback/retro open identically; retro adds good question.
- **Severity:** P2
- **Proposed feedback:**  
  Si tu lista incluye `r3`, usaste `continue` (saltas el blank y sigues). Con `break` en `""` el centinela cierra el lote y la basura posterior no entra.
- **Proposed retrospective:** keep self-check; lead with principle/misconception without repeating feedback word-for-word:  
  Principio: blank como fin de lote = `break`, no `continue`. Malentendido: “saltar vacío” siempre es continue. Transfer: basura *después* del centinela no debe inflar contadores. ¿Qué lista obtienes si dejas `continue` aquí?
- **Code/output changes:** none

### S04-T2-A-E2 (weDo, independent)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **weak** (**feedback is full prefix of retro**)
- **Checklist:** success **pass** · retrospective **partial**
- **Diagnosis:** Exact print contract is clear. Clone is severe: retro = feedback + “En producción…”.
- **Severity:** P1
- **Proposed feedback:**  
  Si solo ves `done 3` sin `intento 1..3`, el contador sube pero no reportas cada vuelta. El f-string va **dentro** del while, tras el incremento.
- **Proposed retrospective:**  
  Principio: reintentos con cota = variable de control que avanza. Malentendido: “el while se cuelga por magia” — casi siempre es estado que no cambia. Transfer: en streams reales combinas tope + timeout + log. Self-check: ¿qué pasa si mueves `intentos += 1` fuera del while?
- **Code/output changes:** none

### S04-T2-A-E3 (weDo, transfer)
- **Quality:** title **strong** · preamble **strong** · instruction **adequate** · retrospective **adequate**
- **Checklist:** success **pass** · instruction **partial** (wording “rest y la cola”)
- **Diagnosis:** Transfer surface good. Instruction step 3 can mislead to two prints; solution is `print("rest", cola)`.
- **Severity:** P2
- **Proposed instruction step 3:**  
  3. Fuera del while, un solo print: `print("rest", cola)` (debe quedar `['job3']`).
- **Proposed retrospective:**  
  Principio: while + cola hasta condición de negocio, no hasta vaciar siempre. Malentendido: break “pierde” datos — en realidad deja residual auditable. Transfer: reportar resto es hábito de worker. ¿Qué pasa si en `job2` usas `continue` en vez de `break`?
- **Code/output changes:** none

### S04-T2-B-DEMO (iDo)
- **Quality:** preamble **strong** · why **adequate** (~38w) · retrospective **adequate** (~30w, short)
- **Checklist:** all **pass** content-wise
- **Diagnosis:** continue vs break fatal is crystal clear. Retro short but has control question.
- **Severity:** P2
- **Proposed retrospective (optional ~45w):**  
  Si confundes continue y break, o dejas pasar filas fatales o cortas demasiado pronto. Control: ¿`ok:3` debía contarse? No. Principio: ruido ≠ fatal. En We Do limpiarás whitespace con continue y cortarás en 5xx con break — dos herramientas, dos intenciones.
- **Code/output changes:** none

### S04-T2-B-E1 (weDo, guided)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** (short, fine for E1) · retrospective **adequate** (clone)
- **Checklist:** all **pass**
- **Diagnosis:** Clear strip+continue. Feedback/retro open the same.
- **Severity:** P2
- **Proposed feedback:**  
  Si aún imprime líneas en blanco, falta el `if not x.strip(): continue` **antes** del print. `break` aquí cerraría el lote por error.
- **Proposed retrospective:**  
  Principio: basura intermitente = continue; fin de lote = break (otro ejercicio). Malentendido: `"  "` es región válida. Transfer: el siguiente We Do usa break en 5xx, no en vacíos. ¿Por qué `strip` y no solo `if not x`?
- **Code/output changes:** none

### S04-T2-B-E2 (weDo, independent)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **adequate** (clone + good self-check)
- **Checklist:** success **pass** (`STOP` / `n_ok 2` named)
- **Diagnosis:** Strong independent. Starter still says `ERR`/`print(n_ok)` — good defect contrast with solution `STOP`/`n_ok`.
- **Severity:** P2
- **Proposed feedback:**  
  Si procesas el 200 final, no hubo `break`. Si imprimiste `ERR` en vez de `STOP`, el contrato de salida no cuadra aunque el conteo sea 2.
- **Proposed retrospective:** keep “¿Por qué `n_ok` no es 3?”; rephrase principle without copying feedback wholesale.
- **Code/output changes:** none

### S04-T2-B-E3 (weDo, transfer)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **strong** (best differentiation in T2-B: misconception + You Do bridge)
- **Checklist:** all **pass**
- **Diagnosis:** Transfer quality is high; feedback slightly shorter but roles are clearer than average.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T3-A-DEMO (iDo)
- **Quality:** preamble **strong** · why **strong** · retrospective **adequate** (~32w)
- **Checklist:** all **pass**
- **Diagnosis:** Denominator 2/5 vs “solo accepts” is the right watch-point for CP-N1-A.
- **Severity:** residual **none** (optional P2 length on retro)
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T3-A-E1 (weDo, guided)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **weak** (feedback fully contained in retro)
- **Checklist:** success **pass** · retrospective **partial**
- **Diagnosis:** Core gate counters. Clone is severe.
- **Severity:** P1
- **Proposed feedback:**  
  Si al final ves `2 1 0`, accept/reject están bien pero `n_total` nunca subió. El `+= 1` de total va en **cada** iteración, no solo en accept.
- **Proposed retrospective:**  
  Principio: tres números honestos en un pase O(n). Malentendido: total = solo accepts. Transfer: sin `n_total` real, `tasa_reject` del You Do es basura o crash. Self-check: ¿qué imprimirías si olvidaras el `elif reject` con el fixture actual?
- **Code/output changes:** none

### S04-T3-A-E2 (weDo, independent)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **strong**
- **Checklist:** all **pass**; fixture **aligned** (3 statuses + empty)
- **Diagnosis:** Double defect (wrong numerator + no zero guard) well framed. Feedback/retro related but not identical. Round-1 fixture risk **cleared**.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T3-A-E3 (weDo, transfer)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **strong** (self-check on not printing C3)
- **Checklist:** all **pass**
- **Diagnosis:** Search-first-review is clear; `.index()` warning is good.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T3-B-DEMO (iDo)
- **Quality:** preamble **strong** · why **adequate** (~36w) · retrospective **adequate** (~26w, short)
- **Checklist:** all **pass** content
- **Diagnosis:** Good “when not comprehension” seed. Retro is thin but bridges We Do.
- **Severity:** P2
- **Proposed retrospective (optional):**  
  Comprehension ≠ siempre mejor: contadores múltiples y try/except por fila piden for clásico. Principio: filtro simple + denominador `len(rows)`. En We Do: map/filter básico, set de categorías y mini-resumen id→status hacia el You Do.
- **Code/output changes:** none

### S04-T3-B-E1 (weDo, guided)
- **Quality:** title **strong** · preamble **adequate** (bridge thin but present) · instruction **strong** · retrospective **adequate**
- **Checklist:** context **partial** (abstract nums) · goal/success/constraints **pass**
- **Diagnosis:** Skill-valid guided drill. Intake bridge is one line — enough for Round 2 if not expanded.
- **Severity:** P2
- **Proposed preamble tweak (optional bullet 1 only):**  
  - **Contexto:** antes de filtrar rejects del batch, practicas map/filter corto con números sintéticos (misma forma que filtrar ids por status).
- **Proposed changes otherwise:** none mandatory
- **Code/output changes:** none

### S04-T3-B-E2 (weDo, independent)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **strong** (hardcode self-check)
- **Checklist:** all **pass**
- **Diagnosis:** Mild feedback overlap but retro adds the hardcode question — acceptable.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T3-B-E3 (weDo, transfer)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **strong** (You Do bridge)
- **Checklist:** all **pass**; fixture **4 rows aligned**
- **Diagnosis:** Direct bridge to You Do summary. Round-1 fixture risk **cleared**. Slight feedback/retro opener overlap — not blocking.
- **Severity:** P2 optional de-clone
- **Proposed changes:** none mandatory
- **Code/output changes:** none

### S04-T4-A-DEMO (iDo)
- **Quality:** preamble **strong** · why **strong** · retrospective **strong**
- **Checklist:** all **pass**
- **Diagnosis:** TRACE reading skill well primed.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T4-A-E1 (weDo, guided)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **adequate** (clone + self-check)
- **Checklist:** all **pass**
- **Diagnosis:** Good TRACE contract. Feedback/retro share first sentence.
- **Severity:** P2
- **Proposed feedback:**  
  En la fila `i=1` el valor es -1: si `s` bajó, sumaste sin filtro. La traza debe mostrar `1 -1 2` (s sin moverse) y `final 5`.
- **Proposed retrospective:**  
  Principio: traza por fila confirma la regla de actualización. Malentendido: “arreglar a ciegas el final”. Transfer: el mismo hábito caza el doble conteo del siguiente ejercicio. ¿Qué `final` sale si la condición es `>= 0`?
- **Code/output changes:** none

### S04-T4-A-E2 (weDo, independent)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **adequate** (overlap with feedback)
- **Checklist:** all **pass**
- **Diagnosis:** Excellent defect (double `n += 1`). Comment `# bug: doble conteo` is acceptable scaffolding inside independent.
- **Severity:** P2
- **Proposed feedback:**  
  Con 3 filas y dos `n += 1`, el resultado es 6. Borra **una** de las dos líneas de incremento; no hardcodees `print(3)`.
- **Proposed retrospective:** keep mental-trace principle; avoid repeating feedback’s first sentence verbatim.
- **Code/output changes:** none

### S04-T4-A-E3 (weDo, transfer)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** (pins TRACE format) · retrospective **strong**
- **Checklist:** all **pass**
- **Diagnosis:** TRACE format pinned in instruction — good for compare. Roles mostly differentiated via “malentendido” line.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T4-B-DEMO (iDo)
- **Quality:** preamble **strong** · why **strong** · retrospective **strong**
- **Checklist:** all **pass**
- **Diagnosis:** 4 vs 16 + skipped first row — clear dual enemy frame.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T4-B-E1 (weDo, guided)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **weak** (**identical to feedback**)
- **Checklist:** success **pass** · retrospective **fail** (no independent metacognitive close)
- **Diagnosis:** Skill is fine; pedagogical fields collapse into one text shown twice.
- **Severity:** **P1**
- **Proposed feedback:**  
  Si ambos números son 5, `quad` se incrementó en el for lineal. Necesitas un **segundo** par de fors anidados solo para contar pasos cuadráticos; con `n=5` debes ver `5 25`.
- **Proposed retrospective:**  
  Principio: contar pasos delata n² antes de que el lote “se sienta” lento. Malentendido: doble for = más rigor de calidad. Transfer: el gate CP-N1-A pide demos rápidas — resumen O(n²) es olor a rediseño. Self-check: ¿cuántos pasos tendría un triple for anidado con n=5?
- **Code/output changes:** none

### S04-T4-B-E2 (weDo, independent)
- **Quality:** title **strong** · preamble **strong** · instruction **strong** · retrospective **strong**
- **Checklist:** all **pass**
- **Diagnosis:** Off-by-one framed well; feedback and retro related but not identical; prefer-for-por-valor transfer is good.
- **Severity:** residual **none**
- **Proposed changes:** none
- **Code/output changes:** none

### S04-T4-B-E3 (weDo, transfer)
- **Quality:** title **strong** · preamble **adequate** · instruction **partial** (nota unpinned) · retrospective **strong**
- **Checklist:** success **partial** (says “una línea `nota:`” without exact text) · other **pass**
- **Diagnosis:** Algorithm choice transfer is excellent. Success string for the note is **not** pinned; solution uses  
  `nota: la tasa solo necesita conteo O(n), no pares O(n2)`.  
  Newbie may write a different sentence and fail output compare.
- **Severity:** **P1**
- **Proposed preamble éxito bullet:**  
  - **Éxito:** `3 0.6` y exactamente  
    `nota: la tasa solo necesita conteo O(n), no pares O(n2)`.
- **Proposed instruction step 4:**  
  4. Imprime **exactamente**:  
     `print("nota: la tasa solo necesita conteo O(n), no pares O(n2)")`.
- **Proposed retrospective:** keep (already strong)
- **Code/output changes:** none (pin prose only)

### youDo — Client Intake & Data Quality Script (cierre CP-N1-A)
- **Quality:** context **strong** · objectives/requirements/rubric **strong** · retrospective **strong** (~68w defense prompts)
- **Checklist:** context **pass** · goal **pass** · success **pass** · constraints **pass** · retrospective **pass**
- **Diagnosis:** Round-1 only needed retrospective; it landed with three defend-questions + impact sentence. Portfolio note complements without replacing metacognition. Starter `_run_tests` remains the oracle.
- **Severity:** residual **none**
- **Proposed changes:** none (do not bloat context)
- **Code/output changes:** none

---

## Priority order (Round-2 Fixer)

### P0
- **None.** Field coverage is complete; no unit leaves a true newbie without frame.

### P1 (fix first)
1. **Systemic: de-clone `feedback` vs `retrospective` on We Do** — highest ROI. Priority units where clone is worst or identical:  
   - **S04-T4-B-E1** (identical)  
   - **S04-T2-A-E2**, **S04-T3-A-E1** (feedback is full prefix of retro)  
   - **S04-T1-B-E2**, **S04-T2-A-E3** / neighbors with ≥70% shared opener  
   Pattern: feedback = “what just failed / how to read the fix”; retrospective = principle + misconception + transfer + optional self-check. **Do not** bulk-template; rewrite per unit using proposed texts above where given.
2. **S04-T4-B-E3** — pin exact `nota:` string in preamble éxito + instruction step 4.

### P2 (polish if time)
- Soften E1 second-hints that paste full solution lines (T1-A-E1, T1-B-E1, T2-B-E1).
- Mild length bumps on short I Do retros (T2-B, T3-B) and short We Do retros that remain after de-clone (aim 40–80 words without essay).
- T2-A-E3 instruction wording for single `print("rest", cola)`.
- Optional T3-B-E1 context bridge (one phrase).
- Optional I Do T1-B `why` +1 sentence.

### Preserve
- All `solutionCode.output` values (unless execute-and-diff later).
- Aligned fixtures on T3-A-E2 and T3-B-E3.
- You Do frame and retrospective as-is.
- Starter `print('ok', True)` noise where intentional.

---

## Residual risks

1. **Clone fatigue:** if Fixer only lengthens retros without differentiating from feedback, learners still read the same idea twice — campaign goal (metacognition) fails even with “fields present”.
2. **T4-B-E3 nota variance:** without pinned string, automated/human output compare is unfair.
3. **Hint spoil vs guided fade:** E1 is allowed more breadcrumbs; still prefer progressive two-step over paste-complete first click.
4. **Volume discipline:** do not expand preambles past bullet form “to hit 80 words”; they already satisfy the 4-bullet alternative.
5. **No real PII / CASO-LIM-004:** keep synthetic tone in any rewrite.
6. **Anti-aberration:** hand-write each de-cloned pair; no section-wide search-replace of a single retrospective template.

---

## Acceptance snapshot (Round 2, pre-Fix)

| Spec item | Status |
|-----------|--------|
| Every non-trivial unit has preamble + retrospective | **Yes** |
| We Do has short title | **Yes** |
| instruction is task-only | **Yes** (T2-A-E3 minor wording) |
| Exact outputs preserved | **Yes** |
| Spanish PE; no real PII | **Yes** |
| Feedback vs retrospective distinct roles | **Partial — main residual** |
| E1/E2/E3 not content clones | **Yes** (defects and surfaces differ) |
| You Do retrospective | **Yes** |

---

## Method attestation
Hand-crafted unit-by-unit re-review of Section 4 current source only. Round 1 was not rubber-stamped: field presence verified, then quality scored for a true newbie. No generators, no bulk educational prose, no source edits.

Section 4 exercise pedagogy review complete. Ready for the Fixer prompt.
