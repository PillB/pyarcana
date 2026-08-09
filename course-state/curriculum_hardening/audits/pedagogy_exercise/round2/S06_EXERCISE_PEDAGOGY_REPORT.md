# S06 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Colecciones y estructuras de datos
- **id:** `numpy` (index 6; archivo `s06-numpy.ts` — contenido es colecciones stdlib, no NumPy)
- **source:** `src/lib/course/sections/s06-numpy.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A secuencias/slicing · T1-B unpack/alias/copia · T2-A dicts · T2-B sets/dedup · T3-A anidado · T3-B missing · T4-A sorted · T4-B elección/JSON
- **Round 1 context:** `round1/S06_EXERCISE_PEDAGOGY_REPORT.md` + `round1/S06_PEDAGOGY_FIXER_REPORT.md` (no rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration)
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter defect, solution output, why)
- Verified one integrity trap by executing T3-B-E2 starter vs solution on the live fixture
- Compared against Round-1 gaps only to see what was filled; scores below are independent quality judgments for a true newbie
- No bulk generation; no source edits; measurement of word counts only for length gates

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: every iDo has `preamble`+`why`+`retrospective`; every weDo has `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo has `retrospective` + strong context | Round-1 P0 “zero fields” is **closed** |
| **We Do titles** | Present, 4–9 words, Spanish PE, role-aligned | Pass |
| **Preamble shape** | Almost all weDo use bullets contexto/meta/éxito/límites | Pass on structure; a few are thin on job hook |
| **Instruction = steps** | Task-only ordered steps; E1 names defect; E2/E3 mostly less spoon-fed | Pass with minor clarity nits |
| **E1→E2→E3 fade** | Distinct surfaces (ventana → tuple → AttributeError; get → merge; set ops → dedup_report; etc.) | Pass — not number-clones |
| **Feedback reasoning** | Mostly 22–32 words with misconception | A few still thin or echo retrospective |
| **Code/outputs** | Intact; defects intentional | One **learning-integrity** hole: T3-B-E2 (below) |
| **youDo frame** | context + run success + política idéntico≠conflicto + retrospective defensa | Pass |

**Net:** Round 1 closed the systematic missing-text gap. Round 2 residuals are **quality, thin closes, one broken distinction exercise, and feedback/retro overlap** — not empty scaffolds.

---

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie can answer what / why / success / what sticks; no residual fix needed |
| **B** | Usable; minor residual (thin retro, length, polish) |
| **C** | Partial; residual should be fixed in R2 (clarity, thin metacognition, mild integrity) |
| **D** | Fails true-newbie test on a critical checklist item (success invisible, wrong vs right indistinguishable) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S06-T1-A-DEMO (iDo) — **B**
- **Diagnosis:** Solid worked example. Preamble sequences what to watch (ventana, keys, len). `why` explains contract. Retrospective has principle + classic error + We Do bridge. Slightly under narrative length target; misconception (off-by-one / mutar keys) could be one explicit sentence.
- **Checklist:** context pass · goal pass · success pass (output named via len/ventana) · constraints pass (demo only) · retrospective pass
- **Severity residual:** P2
- **Proposed residual improvements:** Optional +1 sentence in retrospective: “El stop del slice es exclusivo: `[-2:]` no es lo mismo que el índice `[-2]`.” No change to code/output.
- **Code/output changes:** none

### S06-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Model We Do: title clear; preamble with exact dual success (happy + empty); instruction names `[:2]` vs `[-2:]`; feedback repairs “empty raises IndexError”; retro contrasts index vs slice. Starter defect pedagogical.
- **Checklist:** all pass
- **Severity residual:** none (optional P2: step 2 could say `empty[-2:]` explicitly — already implied)
- **Proposed residual:** none required
- **Code/output changes:** none

### S06-T1-A-E2 (weDo, independent) — **A− / B+**
- **Diagnosis:** Clear contract story; success lines explicit; instruction independent enough. Feedback (~23 w) slightly under 25–60 and nearly restates retrospective.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed feedback tweak (optional):**  
  Si dejas `KEYS = headers`, un `append` en otro helper muta el “contrato”. `tuple(headers)` congela el esquema; `KEYS + ('canal',)` crea **otra** secuencia y deja el snapshot intacto.
- **Code/output changes:** none

### S06-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Good transfer surface (AttributeError → list copy). Preamble and success clear. Instruction step 4 (“Deja la tuple original intacta en el mensaje de error”) confuses newbies: they do not author the exception text; the point is “no intentes mutar la tuple ni uses `except Exception`”.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** P2
- **Proposed instruction step 4 replacement:**  
  `4. En el except usa solo AttributeError (no Exception genérico); la tuple original no se muta.`
- **Code/output changes:** none

### S06-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Strong alias → shallow → deep story. Opening “confunde nombre con copia” can read as an imperative mishap rather than naming the pitfall. Output sequence is the teaching; prediction prompt is good.
- **Checklist:** all pass (context slightly partial on wording only)
- **Severity residual:** P2
- **Proposed preamble micro-edit (full opening only):**  
  Antes de «clonar» clientes en el store en RAM, el riesgo es **confundir nombre con copia**. Sigue la demo: `mal = clientes` **es alias**; al mutar `score` el original cambia. Luego `dict(c)` por fila aísla el nivel 1 si los campos son planos; `deepcopy` aísla anidados. Datos sintéticos `C00x`. No reescribas; predice cada `print` y compáralo con la salida.
- **Code/output changes:** none

### S06-T1-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Crossed indices in starter; unpack goal; success line exact. Tight and appropriate for E1.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Good alias vs copy with ints. Instruction step 4 (“Compara con el output”) is weak as a task step — better as self-check. Success is fully in preamble (OK for E2). Feedback short.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass (self-check question present)
- **Severity residual:** P2
- **Proposed instruction step 4:**  
  `4. Imprime en el orden del starter: tras alias, luego tras mutar la copia.`
- **Code/output changes:** none

### S06-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Excellent transfer to tags; keeps shallow experiment as contrast; feedback names “ya hice copy, estoy a salvo”; bridge to You Do. Success state matches solution output.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T2-A-DEMO (iDo) — **A**
- **Diagnosis:** Index + get + missing + sorted keys; preamble tells what to watch; retrospective bridges to We Do triad. Appropriate length for demo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Defect `d = pares` excellent. Feedback and retrospective both open with “`dict(pares)` es el constructor idiomático” — redundant. Retrospective short (~20 w) and light on misconception.
- **Checklist:** all pass for task; retrospective partial (thin)
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Lista de pares ≠ índice. El almacén necesita mapa id→valor, no cola de tuplas. El error clásico es seguir indexando con `d[1]` como si fuera lista. Siguiente: `get` cuando el id puede faltar (E2).
- **Code/output changes:** none

### S06-T2-A-E2 (weDo, independent) — **A**
- **Diagnosis:** get vs KeyError contrast well framed; success three lines explicit; limits ban bare Exception; starter omits get for C999. Ready for newbie.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Labor-real merge without mutating defaults. Instruction step 4 points at optional solution pattern (copy+update) — mild spoiler for transfer tier; better as hint. Feedback/retro both stress “no mutar config compartida”.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed instruction (drop optional spoil):**  
  `1. Observa el starter: update muta defaults.\n2. Construye merged sin mutar el base.\n3. Imprime merged y defaults.\n4. Verifica que defaults sigue con retry: 1.`  
  (Keep copy+update only in `hints` / solution panel.)
- **Code/output changes:** none

### S06-T2-B-DEMO (iDo) — **A**
- **Diagnosis:** Separates identical duplicate vs conflict; predict `n_conflicts`; synthetic emails. Retrospective short but principle+anti-pattern+bridge present.
- **Checklist:** all pass
- **Severity residual:** P2 optional expand retro to 40–50 w with self-check: “¿por qué n_conflicts es 1 y no 2?”
- **Code/output changes:** none

### S06-T2-B-E1 (weDo, guided) — **A**
- **Diagnosis:** set without sorted = non-deterministic export; success list exact; limits clear. Appropriate E1.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T2-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Wrong operators `|` / `-` in starter; success emails named; feedback distinguishes ops. Instruction has 3 steps (fine).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Star exercise for You Do. Policy identical≠conflict explicit in preamble; instruction builds seen as dict; feedback and retro ask why set-of-ids is insufficient. Output canonical.
- **Checklist:** all pass
- **Severity residual:** none (keep prose aligned with youDo — already is)
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T3-A-DEMO (iDo) — **A**
- **Diagnosis:** Store graph + summarize + flatten; bridges CP-N1-B and S08. Retrospective crisp (anidar vs aplanar).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Correct guided defect (print list vs len). Preamble thin on job story (~30 w bullets) but meta/success/constraints OK. Empty list → 0 is the learning gem.
- **Checklist:** context partial · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** P2
- **Proposed preamble (full):**  
  - **Contexto:** en el resumen del store CP-N1-B necesitas conteos por cliente, no volcar contactos crudos.  
  - **Meta:** `len(c['contacts'])` por fila.  
  - **Éxito:** `C001 → 2` y `C002 → 0` (lista vacía válida).  
  - **Límites:** no imprimas la lista cruda; no inventes contactos.
- **Code/output changes:** none

### S06-T3-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Classic incomplete flatten (`txs[0]`); client_id denormalization; bridge to S08 in feedback/retro. Success = 3 rows.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** `bool(txs)` vs `isinstance(..., list)` is gold. Instruction short but enough for transfer; limits ban falsy check; success three statuses.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T3-B-DEMO (iDo) — **A**
- **Diagnosis:** dig + missing/empty/ok; C003 empty vs C004 missing; output space subtle but preamble prepares. Excellent.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Unguarded path → need dict/`in` guards; success 999 / N/A; limits discourage try/except-only design.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T3-B-E2 (weDo, independent) — **D (learning integrity)**
- **Diagnosis:** Prose is good (policy `''` = present; ban `if not c.get('email')`). **But the fixture never includes `email: ''`.** Executed starter vs solution:

  | id | starter (`not c.get`) | solution (`not in` / `is None`) |
  |----|----------------------|----------------------------------|
  | C001 | present | present |
  | C002 | missing | missing |
  | C003 | missing | missing |

  **Identical output.** A newbie can leave the starter unchanged, match “éxito”, and never practice the distinction the exercise claims to teach. Hints mention `''` = present, but it is not live. This was noted as optional P2 in Round 1; Round 2 reclassifies as **P1** (success criterion does not distinguish wrong from right).
- **Checklist:** context pass · goal pass · success **fail** (success does not enforce the policy) · constraints pass (stated) · retrospective pass (text only)
- **Severity residual:** **P1**
- **Proposed fixture + success (minimal code change justified):**  
  Add fourth client `{'id': 'C004', 'email': ''}` to starter and solution.  
  **Éxito (preamble line):**  
  `C001: present`, `C002: missing`, `C003: missing`, `C004: present` (string vacío cuenta present).  
  **Proposed instruction step 4:**  
  `4. No borres C004: su email '' debe quedar present.`  
  **Expected output:**  
  ```
  C001: present
  C002: missing
  C003: missing
  C004: present
  ```
- **Code/output changes:** **yes — fixture + solution output** (execute-and-diff justified; only way the graded surface teaches the policy)
- **Validation notes:** Wrong condition marks C004 missing; right marks present. Preserve policy text already in preamble/limits.

### S06-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Falsy table transfer; only `None` is missing; instruction four steps clear. Complements E2 conceptually (E2 needs fixture fix to land first).
- **Checklist:** all pass
- **Severity residual:** none for this unit; depends on E2 fix for progressive story
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Two ideas (multi-key sorted + sort→None) still high load; preamble sequences attention well. Retrospective short (~26 w) but both principles appear.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed retrospective expand (full):**  
  `sorted` devuelve lista nueva; `.sort` muta y retorna `None` — no lo asignes. El `key` multi-campo ordena lexicográficamente región→nombre sin reescribir comparadores. We Do: monto, multi-campo, y el bug de asignar `.sort()`.
- **Code/output changes:** none

### S06-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Task clear (id key → monto key). **Retrospective too thin (~16 w):** no misconception, almost no transfer. Feedback carries more teaching than retro.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective **partial**
- **Severity residual:** P1 (thin close only — not broken task)
- **Proposed retrospective (full):**  
  El `key` extrae el criterio de ranking sin mutar `rows`. Confundir orden por `id` con orden por monto da extractos “correctos” de forma y erróneos de negocio. Siguiente: dos criterios a la vez (región, nombre).
- **Code/output changes:** none

### S06-T4-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Multi-key; lambda only in hints (good E2 fade from Round 1). Success three lines; single sorted constraint.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Classic `x = lst.sort()` bug; keeps in-place experiment; success ret/base/copy clear. Strong transfer.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T4-B-DEMO (iDo) — **A**
- **Diagnosis:** Deterministic JSON story; a==b as test; portfolio bridge. Clear for newbie.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T4-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Conceptual structure choice; starter all-list; rubric link in feedback. Right cognitive load for E1 of T4-B.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S06-T4-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Exact golden string; sort ids + sort_keys; feedback/retro slightly echo but both solid. Independent enough.
- **Checklist:** all pass
- **Severity residual:** P2 optional: shorten retrospective so it does not repeat feedback first sentence; add self-check “¿qué pasa si ordenas ids pero omites sort_keys?”
- **Code/output changes:** none

### S06-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Membership cost derived from `n`; forbids hardcoding; labels fixed for compare. Closes T4 into You Do. Good.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### youDo — Modelo tabular en memoria (CP-N1-B) — **A**
- **Diagnosis:** Strong project frame. Context includes run success and política idéntico≠conflicto. Objectives/requirements/rubric/portfolioNote aligned with T2-B-E3 and T4. Retrospective is defense-style (invariant, real vs synthetic, 30s line, shallow vs deep) — matches spec §8.3. Starter APIs clean.
- **Checklist:** context pass · goal pass · success pass (run criterion + rubric) · constraints pass · retrospective pass
- **Severity residual:** P2 optional only
- **Proposed residual (optional):** In `main` rows fixture, add one identical duplicate `{id:C001,v:1}` so the portfolio demo also shows “idéntico no es conflicto” live (mirrors T2-B-E3). Not required if README text covers it.
- **Code/output changes:** none required

---

## Priority order (Round 2 Fixer)

### P1 (do first)
1. **S06-T3-B-E2** — Add `C004` with `email: ''`; update éxito, instruction, solution output so wrong `if not c.get('email')` **fails** visible success. This is the only integrity break.
2. **S06-T4-A-E1** — Expand retrospective (full text above) so the close is not a one-liner.

### P2 (polish if time)
3. **S06-T1-A-E3** — Clarify instruction step 4 (AttributeError only; don’t promise editing the exception message).
4. **S06-T2-A-E1** — Rewrite retrospective to avoid cloning feedback’s opening line.
5. **S06-T2-A-E3** — Move copy+update optional path out of instruction into hints.
6. **S06-T1-B-DEMO** — Preamble “el riesgo es confundir…” wording.
7. **S06-T1-B-E2** — Instruction step 4 = print order, not “compare with solution”.
8. **S06-T3-A-E1** — Slightly richer context bullet (CP-N1-B summary).
9. **S06-T4-A-DEMO** — Slightly fuller retrospective (two principles + bridge).
10. **S06-T1-A-E2 / T4-B-E2** — Optional feedback/retro dedupe.
11. **youDo** — Optional identical-payload row in `main` demo rows.

### No residual (leave alone)
All other units score **A** with field completeness and true-newbie usability. Do **not** re-rewrite working preambles wholesale.

---

## Summary scores

| Kind | Units | A | B | C | D | Notes |
|------|------:|--:|--:|--:|--:|-------|
| iDo | 8 | 5 | 3 | 0 | 0 | Thin length / wording only |
| weDo | 24 | 18 | 5 | 0 | 1 | D = T3-B-E2 integrity |
| youDo | 1 | 1 | 0 | 0 | 0 | Portfolio-ready |

**Field completeness (R2):** preamble 32/32 exercise units that need it · retrospective 33/33 · weDo titles 24/24.

---

## Residual risks
1. **T3-B-E2 without fixture fix:** policy prose looks correct but practice does not enforce it; E3 (falsy table) then feels unmotivated.
2. **Feedback ≈ retrospective clones** in a handful of units reduce metacognitive value of the solution panel close — polish, not rewrite campaign.
3. **T4-A-DEMO dual lesson** remains higher load; acceptable if learners follow the “first multi-sort, then sort→None” attention order in preamble.
4. **Section `id: "numpy"`** vs title “Colecciones” remains product debt; out of exercise-pedagogy scope.
5. **No re-run of full browser suite in this review** — Fixer must re-check exact output strings after T3-B-E2 fixture change only.

---

## Round-1 vs Round-2 delta
| Round 1 | Round 2 |
|---------|---------|
| Zero preamble/title/retrospective across board | Fields present and generally strong |
| Systematic P0 on 24 We Do | **No P0** remaining |
| Optional note on T3-B-E2 `''` row | **Elevated to P1** after execute proof starter≡solution |
| youDo missing retrospective | youDo retrospective + run success **pass** |

Section 6 exercise pedagogy review complete. Ready for the Fixer prompt.
