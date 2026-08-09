# S17 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Joins, reshape, groupby y cierre analítico
- **shortTitle:** Joins · groupby · cierre
- **id:** `packaging` (archivo histórico `s17-packaging.ts`; contenido = joins/reshape/groupby/reconciliación, **no** empaquetado PyPI)
- **index:** 17
- **source:** `src/lib/course/sections/s17-packaging.ts` (re-leído **después** del fix Round-1)
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A claves/cardinalidad · T1-B validate/anti-join · T2-A concat/melt/pivot · T2-B nombres estables · T3-A groupby/agg/transform · T3-B ventanas/cohortes · T4-A denominadores/totales · T4-B leakage/cutoff
- **hilo:** CASO-LIM-017 / portfolio ejecutivo de calidad + EDA (clientes/tx sintéticos Lima–Cusco–Arequipa, PEN; puente a incertidumbre S18)
- **Round 1 context:** `round1/S17_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (roles de campo, longitudes, checklists preamble/retrospective, fade E1→E3, anti-aberration).
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source: title, preamble, instruction, feedback, retrospective, starter DEFECT, solution/output, why.
- Scored residual quality for a **true newbie** (what / why / success / what sticks) — field *presence* alone is not acceptance.
- Word counts measured only as gates (no generators of prose). Round-1 used only to avoid re-diagnosing the old “zero shell” crisis.
- **No** source edits in this round. Hand-crafted residual proposals only.

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8); `why` now ~53–81 words |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do `instruction` is ordered steps (not “Concepto + fixture” essay) | **Met** |
| You Do has `retrospective` | **Met** |
| E1→E2→E3 fade preserved (surfaces, not number clones) | **Met** |
| Starters, solutions, canonical outputs intact | **Met** (no execute-and-diff needed) |
| Spanish PE; synthetic ids; no real PII | **Met** |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no missing-field crisis**. Residual work is **quality**: short retrospectives (section-wide under the 40–80 floor), feedback↔retrospective echo, transfer-hint spoiling, thin feedback on a few drills, one instruction typo, and small Spanish nits.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **We Do retrospectives short** | 24/24 under or at the edge of 40 words (measured ≈21–39); many stop at “principio + puente” without misconception explícito o self-check | Metacognition thin; learner closes tab without a sticky self-test | **P1** (section theme: expand worst 10–12; not every unit needs a novel essay) |
| **I Do retrospectives short** | 6/8 under 40w (T1-B 29, T2-A 30, T2-B 27, T3-A 23, T3-B 26, T4-B 24); T1-A 47 and T4-A 35 are better | Demo → We Do bridge exists, but “misconception repaired” is often one clause | **P2** (expand the thinnest 3–4) |
| **Feedback ≈ retrospective** | Notable pairs: T2-A-E1, T3-A-E1, T1-B-E3, T2-B-E1, T4-A-E1 (same sentence spine in both fields) | Deliberate-practice loop collapses; retro loses distinct job | **P1** on worst pairs / **P2** elsewhere |
| **E3 transfer hint spoiling** | T4-B-E3 hints give full merge + total_pre + delta recipe; T2-A-E3 / T3-A-E3 hints near-complete | Transfer becomes “type the hint” not judgment | **P1** (T4-B-E3); **P2** (other E3s) |
| **Instruction typo** | T2-B-E3 step 2: ``rename(columns={'a': 'monto'})`` written with missing `}` before `)` | Newbie may copy broken syntax from the task step | **P2** |
| **Spanish nit** | T3-A-E2 límites: “no armemos map manual” (1ª persona plural) | Tone slip | **P2** |
| **Feedback under 25w** | T1-B-E1 ≈24, T2-B-E1 ≈22, T2-B-E3 ≈23, T3-B-E2 ≈21, T4-B-E1 ≈22 | Corrective loop thin | **P2** |
| **You Do** | Frame + dict contract + retrospective of defense **strong** (~62w) | No P0/P1 | — / optional P2 only |
| **Code/outputs** | Coherent with theory and portfolio mini-contract | Do **not** change pass outputs | — |

**Section severity theme (Round 2):** solid shell; residual is **length + role separation + soft spoiling**, not redesign. A true newbie *can* answer what/why/success from preambles; the gap is **what sticks after the tab closes** and **not being spoon-fed on transfer**.

### Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie answers what / why / success / what sticks; no required residual |
| **B** | Usable; residual polish (length, eco, soft spoiler) |
| **C** | Partial; R2 Fixer should tighten (integrity or metacognition) |
| **D** | Fails true-newbie on a critical item |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

When **Proposed residual: none required**, Fixer may leave the unit unchanged.

---

## Unit ledger

### S17-T1-A-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** · why **Strong** (~81w) · retrospective **Strong** (~47w)
- **Checklist:** context pass · goal pass · success pass (predice rows + dict) · constraints pass (no escribas aún) · retrospective pass
- **Diagnosis:** R1 prose landed. Fan-out 2→3, assert de unicidad, misconception “cada fila = un cliente” are clear. Output gate intact.
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S17-T1-A-E1 (weDo, guided) — **A− / B+**
- **Scores:** title **Strong** · preamble **Strong** (4 bullets) · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~39w, borderline floor)
- **Checklist:** all pass; retro partial (short, light self-check)
- **Diagnosis:** Model guided unit. DEFECT inner→left well named. Feedback anchors NaN/huérfanos to T1-B. Retro almost hits 40w and already separates principle from “si imprimiste 1”.
- **Severity residual:** P2 optional
- **Proposed residual retrospective (optional expand):**  
  Left = todos los del maestro, con o sin match; inner = solo intersección. El KPI de cobertura del maestro se rompe si empiezas con inner. Pregunta: si C002 no tiene tx, ¿debe aparecer en el merge? Siguiente (E2): medir unicidad de la clave **antes** del merge.
- **Code/output changes:** none

### S17-T1-A-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **Needs residual** (~27w)
- **Checklist:** all pass except retro length/self-check partial
- **Diagnosis:** Independent fade correct (measure before clean). Feedback already has stakeholder “rojo”. Retro is only two sentences — missing self-check.
- **Severity residual:** P1 (retro length/metacognition)
- **Proposed retrospective (replace):**  
  Primero mides, luego decides limpiar. Silenciar duplicados con `drop_duplicates` antes del gate oculta el rojo al stakeholder. Pregunta: ¿por qué un booleano inventado (`print(True)`) no es un gate? Luego (E3) documentarás fan-out del lado m con `rows_cli → rows_merge`.
- **Code/output changes:** none

### S17-T1-A-E3 (weDo, transfer) — **A−**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~37w)
- **Diagnosis:** Authentic transfer to portfolio dict. Starter `drop_duplicates` is excellent pedagogy. Retro has self-check (“¿qué suma se infla?”). Hints near-solution but acceptable for short transfer if learner already fixed E1/E2.
- **Severity residual:** P2 optional (hint 2 slightly spoils dict shape — already in éxito)
- **Proposed residual:** none required (keep; optional soften second hint to “dict con dos keys de conteo, sin deduplicar tx”)
- **Code/output changes:** none

---

### S17-T1-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective **Needs residual** (~29w)
- **Checklist:** context pass · goal pass · success pass · constraints partial · retrospective partial
- **Diagnosis:** Anti-join + validate worked example is solid. Retro names two problems but rushes the We Do bridge without a sticky self-check.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Huérfanos y fan-out no son el mismo ticket: unos son cobertura del maestro, el otro es cardinalidad rota. Si el merge “no truena”, la cobertura aún puede estar mal. Pregunta: ¿qué exportarías a la tabla de evidencia, la lista o solo un bool? We Do: `left_only`, `MergeError` controlado y KPI de conteo.
- **Code/output changes:** none

### S17-T1-B-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~24w) · retrospective **short** (~21w)
- **Checklist:** all pass structure; fb/retro under floor
- **Diagnosis:** DEFECT both→left_only excellent. Feedback and retro both restate left_only vs both without enough metacognition.
- **Severity residual:** P1 (retro) + P2 (feedback floor)
- **Proposed feedback (replace):**  
  Si listaste C001, filtraste `'both'` (matches). `left_only` son clientes del maestro sin transacciones: la evidencia que el dashboard de calidad necesita exportar, no la intersección.
- **Proposed retrospective (replace):**  
  `left_only` = en el maestro, sin match. `both` = ya matcheó (no es huérfano). El error clásico es listar matches y creer que “no hay huecos”. Pregunta: ¿aparecería C001 en el anti-join? Siguiente (E2): forzar fallo temprano con `validate='one_to_one'`.
- **Code/output changes:** none

### S17-T1-B-E2 (weDo, independent) — **A**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~35w, near floor but complete roles)
- **Diagnosis:** Gate vs crash misconception clear; constraint against bare `except Exception` is explicit. Fade independent is right.
- **Severity residual:** none required
- **Proposed residual:** none
- **Code/output changes:** none

### S17-T1-B-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~30w) + mild eco with feedback
- **Diagnosis:** KPI int vs list is good transfer. Feedback and retro both pivot on “lista vs conteo”.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Lista = evidencia de filas; conteo = KPI de cobertura en el resumen ejecutivo. Ambos sirven, pero el tablero pide el entero. Pregunta: si `left_only` baja de 2 a 0, ¿qué cambió en el negocio o en el join? Puente a T2: reshape long/wide con schema estable.
- **Code/output changes:** none

---

### S17-T2-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~30w)
- **Diagnosis:** melt/pivot shapes and aggfunc sum vs mean are well framed. Retro lacks a self-check on aggfunc.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Si sabes por qué 2×2 wide da 4 filas long, controlas el contrato de filas del reshape. El error clásico es confiar en el default de `pivot_table` (mean) cuando el total de PEN debe conservarse con sum. We Do: `len` del melt, columnas post-pivot y concat de lotes.
- **Code/output changes:** none

### S17-T2-A-E1 (weDo, guided) — **B** / **C** on eco
- **Scores:** shell Strong · feedback/retro **echo** (“melt multiplica filas…”)
- **Checklist:** structure pass; retrospective partial (eco)
- **Severity residual:** P1 (role separation)
- **Proposed retrospective (replace):**  
  El largo del long es un contrato predecible: filas × value_vars. Si no cuadra, el schema de `value_vars` (o el id) está mal — no “pandas falló”. Pregunta: con 3 meses y 10 clientes, ¿cuántas filas long esperas? Siguiente (E2): pivot de regreso con `id` como columna de export.
- **Code/output changes:** none

### S17-T2-A-E2 (weDo, independent) — **B**
- **Scores:** shell Strong · feedback thin (~24w) · retro short (~25w)
- **Diagnosis:** reset_index vs index is the right independent skill. Retro is one idea only.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Index ≠ columna de export: el dashboard une por clave visible, no por índice oculto. El error clásico es “el pivot ya tiene id” cuando solo está en el index. Luego (E3): apilar lotes diarios y reportar `n_lotes` / `n_filas`.
- **Code/output changes:** none

### S17-T2-A-E3 (weDo, transfer) — **B**
- **Scores:** shell Strong · retro short (~26w) · hint 1 near full solution
- **Diagnosis:** Transfer to batch contract is real. Hint 1 prints the exact dict — soft transfer spoiler.
- **Severity residual:** P2
- **Proposed residual hints (replace second tier; keep first softer):**  
  1. `pd.concat` vertical de las dos tablas; mide el largo del resultado, no solo de `a`.  
  2. El dict del memo lleva dos keys: cuántos lotes entraron y cuántas filas salieron (`axis=0`, no `axis=1`).
- **Proposed retrospective (replace):**  
  Concat `axis=0` apila evidencia; `axis=1` ensancha el schema. El contrato de filas es re-ejecutable y auditable. Pregunta: si `n_filas` es 1 con dos lotes, ¿qué olvidaste? Puente a T2-B: nombres estables post-pivot.
- **Code/output changes:** none

---

### S17-T2-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retro short (~27w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Schema estable = lo que el stakeholder y el diff del PR pueden auditar. El error clásico es renombrar “a ojo” en el notebook y creer que el dashboard seguirá. We Do: prefijo `monto_`, gate de set y `rename` con dict explícito.
- **Code/output changes:** none

### S17-T2-B-E1 (weDo, guided) — **B**
- **Scores:** preamble a bit short (~37w bullets OK) · feedback thin · retro thin (~21w) · eco with feedback
- **Severity residual:** P1 (retro) + P2 (feedback)
- **Proposed feedback (replace):**  
  Si listaste `['e','f']`, faltó el prefijo `monto_` del schema del dashboard. Sin él, colisiones con otras métricas son fáciles y el export deja de ser legible para el stakeholder.
- **Proposed retrospective (replace):**  
  Prefijo = contrato legible para el dashboard, no cosmética. El error clásico es dejar nombres crudos del pivot “porque el plot ya se entiende”. Pregunta: ¿qué pasa si otra métrica también se llama `e`? Siguiente (E2): validar `set(columns) == expected`.
- **Code/output changes:** none

### S17-T2-B-E2 (weDo, independent) — **A**
- **Scores:** shell Strong · feedback Strong · retro Adequate (~27w but distinct roles)
- **Diagnosis:** Expected-vs-reality gate is clear; sets-ignore-order is in instruction step 4. Good independent unit.
- **Severity residual:** none required
- **Proposed residual:** none
- **Code/output changes:** none

### S17-T2-B-E3 (weDo, transfer) — **B** / **C** (typo)
- **Scores:** shell usable · retro thin (~21w) · **instruction typo**
- **Diagnosis:** Step 2 shows ``rename(columns={'a': 'monto'})`` without the closing `}` of the dict (backtick closes early). Transfer skill is right; prose is thin.
- **Severity residual:** P2 (typo + retro)
- **Proposed instruction step 2 (fix):**  
  2. Aplica `rename(columns={'a': 'monto'})`.
- **Proposed retrospective (replace):**  
  Dict rename es auditable en el PR; reasignar `.columns` a ciegas no deja rastro de origen→destino. Pregunta: ¿qué prefiere el revisor, un dict o una lista opaca? Puente a T3: colapsar o reinyectar montos con groupby.
- **Code/output changes:** none (solution already correct)

---

### S17-T3-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retro **very short** (~23w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `agg` = tabla ejecutiva; `transform` = feature a nivel fila. Si “te quedaste sin filas”, usaste el operador del resumen donde ibas a scorear transacciones. We Do: sum vs mean, `transform('mean')` y named agg con schema `total`/`n`.
- **Code/output changes:** none

### S17-T3-A-E1 (weDo, guided) — **B** / **C** on eco
- **Scores:** shell Strong · feedback/retro both open on “mean vs sum no intercambiables”
- **Severity residual:** P1 (role separation)
- **Proposed retrospective (replace):**  
  El slide del comité se rompe cuando el código responde “promedio” a la pregunta “total de PEN”. Eso no es un detalle de API: es un error de contrato de negocio. Pregunta: con dos filas Lima 1 y 2, ¿qué imprime sum y qué mean? Siguiente (E2): reinyectar media con `transform` sin colapsar filas.
- **Code/output changes:** none

### S17-T3-A-E2 (weDo, independent) — **B**
- **Scores:** shell Strong · retro short (~23w) · Spanish nit in límites
- **Severity residual:** P2
- **Proposed preamble límites (fix phrase only):**  
  … no uses agg/sum del groupby (colapsa); no armes un map manual.
- **Proposed retrospective (replace):**  
  `transform` preserva el shape; `agg` lo reduce. Si la lista tiene 2 elementos en un DF de 3 filas, colapsaste. Pregunta: ¿para un score por tx usarías agg o transform? Luego (E3): named agg fija el schema del CSV ejecutivo.
- **Code/output changes:** none

### S17-T3-A-E3 (weDo, transfer) — **B**
- **Scores:** shell Strong · retro short (~22w) · hint near-complete
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Named agg es el contrato de columnas del resumen (`total`, `n`), no un alias cosmético. Sin nombres, el export es ambiguo para el stakeholder. Pregunta: ¿qué rompe un dashboard si la columna se llama solo `monto`? Puente a T3-B: ventanas y cohortes temporales.
- **Code/output changes:** none

---

### S17-T3-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retro short (~26w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Si sabes por qué C001 y C002 pueden compartir cohorte 2024-01, entiendes “entrada”, no “última actividad”. El error clásico es usar `max` o la fecha del informe de hoy. We Do: window=2 con NaN honesto, min vs max, y `sort_index` antes de rolling.
- **Code/output changes:** none

### S17-T3-B-E1 (weDo, guided) — **A−**
- **Scores:** shell Strong · feedback/retro roles **well separated** (fb = wrong window; retro = NaN honesty)
- **Diagnosis:** One of the better guided units post-R1. Retro short but purposeful.
- **Severity residual:** P2 optional (+1 self-check sentence)
- **Proposed residual:** optional only — add to retro: “Pregunta: ¿por qué el primer punto no debe inventar un 1.0?”
- **Code/output changes:** none

### S17-T3-B-E2 (weDo, independent) — **B**
- **Scores:** shell Strong · feedback thin (~21w) · retro Adequate
- **Diagnosis:** min vs max is the right independent misconception. Feedback under floor.
- **Severity residual:** P2
- **Proposed feedback (replace):**  
  Si C001 sale `2024-03`, usaste `max` (última actividad). Cohorte = primera fecha válida → `2024-01`. Confundirlos distorsiona retención en el tablero, aunque el código “corra”.
- **Code/output changes:** none

### S17-T3-B-E3 (weDo, transfer) — **A**
- **Scores:** shell Strong · feedback Strong · retro has self-check question · R1 spoiling of “2.5” in hints **softened** (hints no longer name 2.5; éxito still states 2.5 — correct for success criterion)
- **Diagnosis:** Transfer surface (unordered feed) is real. Preamble formula “(2+3)/2” slightly over-explains success — acceptable for pass clarity.
- **Severity residual:** none required
- **Proposed residual:** none
- **Code/output changes:** none

---

### S17-T4-A-DEMO (iDo) — **A−**
- **Scores:** preamble Strong · why Strong · retro Adequate (~35w)
- **Diagnosis:** Bridge + rate + denom framed for stakeholder. Near floor but checklist complete.
- **Severity residual:** none required
- **Proposed residual:** none
- **Code/output changes:** none

### S17-T4-A-E1 (weDo, guided) — **B**
- **Scores:** shell Strong · retro short (~22w) · mild eco with feedback on eps
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Eps laxo aprueba descuadres que un auditor ve a simple vista. El número del gate es parte del contrato, no un detalle de estilo. Pregunta: ¿pasaría un descuadre de 0.5 con umbral 1.0? Siguiente (E2): tasa con denominador correcto.
- **Code/output changes:** none

### S17-T4-A-E2 (weDo, independent) — **A**
- **Scores:** shell Strong · feedback Strong · retro Adequate with business-error framing
- **Diagnosis:** Inverted ratio is a professional misconception; prose already separates syntax vs business error.
- **Severity residual:** none required
- **Proposed residual:** none
- **Code/output changes:** none

### S17-T4-A-E3 (weDo, transfer) — **A−**
- **Scores:** shell Strong · retro short (~24w) but has self-check
- **Diagnosis:** Bridge table transfer is clear; starter sign flip is strong. Title is 3 words (“Tabla puente total–Lima–residual”) — acceptable compound title.
- **Severity residual:** P2 optional (retro +5–10w on “residual is evidence”)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S17-T4-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retro short (~24w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Si puedes explicar por qué 999 no es “ruido” sino contaminación post-cutoff, ya cierras el control as-of. El error clásico es filtrar en silencio y no reportar el delta al memo. We Do: máscara `<=`, delta y mini-integración join+cutoff.
- **Code/output changes:** none

### S17-T4-B-E1 (weDo, guided) — **B**
- **Scores:** shell Strong · feedback thin (~22w) · retro Adequate
- **Severity residual:** P2
- **Proposed feedback (replace):**  
  Si viste `[9.0]`, filtraste `fecha > cutoff` (post-periodo). El control as-of usa `fecha <= cutoff`; un signo al revés contamina el before/after y el score “a enero”.
- **Code/output changes:** none

### S17-T4-B-E2 (weDo, independent) — **A**
- **Scores:** shell Strong · feedback Strong · retro Strong enough (delta = transparency)
- **Diagnosis:** Independent fade correct; memo needs delta not only pre.
- **Severity residual:** none required
- **Proposed residual:** none
- **Code/output changes:** none

### S17-T4-B-E3 (weDo, transfer) — **C** on spoiling / **B** on shell
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retro Adequate · **hints over-scaffold transfer**
- **Checklist:** structure pass; transfer integrity **partial** (hints print the solution recipe)
- **Diagnosis:** Best integration drill of the section and true bridge to You Do. Hints currently:
  1. full left merge + `rows_merge = len(m)`
  2. exact `total_pre` / delta formulas  
  That collapses E3 into guided coding. Retro claim “reutiliza el mismo contrato de keys” is slightly over-strong: You Do also requires `n_huerfanos_left_only` and `reconciled`.
- **Severity residual:** **P1**
- **Proposed hints (replace — non-spoiling):**  
  1. Une maestro y tx con left merge; el dict debe incluir el largo del merge, no un max suelto por cliente.  
  2. Separa montos pre-cutoff de la suma total; el delta es la diferencia (contaminación), no el pre solo.  
  3. Tres keys en un solo `print` de dict; si solo imprimes un max, aún no integraste.
- **Proposed retrospective (replace):**  
  Tres números juntos (filas del merge, total pre-cutoff, delta de leakage) = evidencia re-ejecutable para el comité. Si solo entregas un max por cliente, no hay cardinalidad ni as-of. Este E3 es el **ensayo** del You Do: el portfolio añade además huérfanos y `reconciled`, pero la lógica de join + cutoff + delta es la misma.
- **Code/output changes:** none (pass dict stays)

---

### S17-youDo (youDo) — **A**
- **Scores:** context/objectives/requirements/rubric **Strong** · portfolioNote **Strong** · retrospective **Strong** (~62w, within 40–80)
- **Checklist:** context pass · goal pass · success pass (dict keys + rubric) · constraints pass (sintéticos, no PII) · retrospective pass
- **Diagnosis:** Defense triad (invariante / real vs sintético / frase de impacto 30s) matches the spec exemplar pattern without cloning S-numbers. Starter `NotImplementedError` + conceptual expected comment is appropriate for You Do. Do **not** rewrite the key contract.
- **Severity residual:** none required
- **Proposed residual:** none (optional P2: one line in portfolioNote reminding to print `portfolio_summary` — already implied by `if __name__`)
- **Code/output changes:** none

---

## Priority order (Round-2 Fixer)

### P1 (do first)
1. **Expand We Do retrospectives under ~35w** that lack misconception + self-check — priority queue (full text above where marked replace):  
   **T1-A-E2, T1-B-E1, T2-A-E1, T2-B-E1, T3-A-E1, T4-B-E3** (and apply the same checklist to other B units when touching them).
2. **Separate feedback vs retrospective** on echo pairs: **T2-A-E1, T3-A-E1, T1-B-E1, T2-B-E1** (feedback = immediate error; retro = principle + transfer + self-check).
3. **Soften T4-B-E3 hints** (transfer integrity) and tighten its retro key-contract wording vs You Do.

### P2 (polish)
1. I Do thin retros: **T1-B, T2-A, T2-B, T3-A, T3-B, T4-B** (full text proposed).
2. Remaining short We Do retros: T1-B-E3, T2-A-E2/E3, T2-B-E3, T3-A-E2/E3, T4-A-E1, etc.
3. **T2-B-E3 instruction typo** (`rename` dict brace).
4. **T3-A-E2** “no armemos” → “no armes un map…”.
5. Thin feedback floors: T1-B-E1, T2-B-E1, T3-B-E2, T4-B-E1 (text above).
6. Soften other E3 first-hints that paste the solution line (T2-A-E3, optional T1-A-E3).

### Leave alone (A / no required change)
- T1-A-DEMO, T1-A-E1 (optional only), T1-A-E3, T1-B-E2, T2-B-E2, T3-B-E1, T3-B-E3, T4-A-DEMO, T4-A-E2, T4-A-E3, T4-B-E2, **youDo**, and all code/outputs.

---

## Residual risks

1. **File name vs content:** `s17-packaging.ts` / id `packaging` still misleads scanners; do not “fix packaging” by inventing PyPI content.
2. **Groupby `to_dict` key order** depends on pandas sort; pass outputs assume alphabetical regions — **no** output edits without execute-and-diff.
3. **You Do keys ⊃ T4-B-E3 keys** by design; Fixer must not force E3 to print `n_huerfanos` / `reconciled`.
4. **Bullet preambles under 80 words** are allowed by spec (“or 4 short bullets”); do not pad bullets with filler just to hit 80.
5. **Over-expanding every retro to 80 words** would bloat the UI — target 40–60w with principle + misconception + transfer + optional self-check; use full proposed text only where marked.
6. **Anti-aberration:** expand unit-by-unit by hand; no loop that stamps the same retrospective skeleton across T1–T4.

---

## Fixer acceptance checklist (Round 2)

- [ ] No new missing `title` / `preamble` / `instruction` / `retrospective` fields
- [ ] Worst short retros expanded to ~40–60 words with distinct roles from feedback
- [ ] Echo pairs separated (feedback ≠ retrospective paraphrase)
- [ ] T4-B-E3 hints no longer paste the full solution
- [ ] T2-B-E3 instruction dict syntax fixed
- [ ] Canonical solution outputs unchanged
- [ ] Spanish PE; no real PII; no generators
- [ ] Section source still typechecks / static build OK

---

Section 17 exercise pedagogy review complete. Ready for the Fixer prompt.
