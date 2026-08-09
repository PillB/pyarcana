# S16 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Calidad, limpieza y contratos de datos
- **shortTitle:** Calidad y contratos
- **id:** `wxpython-gui` (archivo histórico `s16-wxpython-gui.ts`; contenido = quality gate pandas, no GUI wxPython)
- **index:** 16
- **source file:** `src/lib/course/sections/s16-wxpython-gui.ts`
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A null policy · T1-B imputación/cap/indicador · T2-A exactos vs. conflictos · T2-B evidencia/cardinalidad · T3-A normalización PEN/raw · T3-B outliers dominio/IQR · T4-A schema/cross-field · T4-B métricas/audit
- **hilo:** quality gate **CP-N2-A** (fail-closed, cuarentena, audit append-only; sintético PE; puente a S17)
- **live:** https://pillb.github.io/pyarcana/
- **Round 1 context:** `round1/S16_EXERCISE_PEDAGOGY_REPORT.md` (histórico only — **not** acceptance proof)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (roles, longitudes, checklist preamble/retrospective, fade E1→E2→E3, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Scored residual quality for a true newbie (what / why / success / what sticks), not mere field presence
- Word counts measured only for length gates (no generators of educational prose)
- No bulk generation; **no source edits** in this round

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| All iDo `why` expanded beyond one line | **Met** (≈56–68 palabras; within/near 40–90) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do `instruction` is steps-only (pass/constraints moved to preamble) | **Met** |
| You Do has `retrospective` | **Met** (defensa 3 preguntas; solid) |
| E1→E2→E3 fade preserved | **Met** (guided / independent / transfer; surfaces distinct per subtopic) |
| Starters, solutions, exact outputs intact | **Met** (DEFECT still named; oracles unchanged) |
| Feedback has reasoning (not only “wrong”) | **Mostly met** (some thin; a few echo retro) |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: thin retrospectives (cluster), some short preambles, feedback↔retro collapse on a few pairs, two prose defects (`inventaría`, `lens`), and mild polish on feedback/instruction length. **Do not rewrite units from scratch.**

---

## Scoring key (residual quality for a true newbie)

| Score | Meaning |
|-------|---------|
| **Strong** | Checklist solid; lengths OK; no spoiler; misconception + transfer clear; no required change |
| **Adequate** | Usable; small nits only (length, polish, mild overlap) |
| **Needs residual** | Spoiler, thin metacognition, feedback/retro collapse, prose bug, or clear length/role failure |

Checklist items: **context · goal · success · constraints · retrospective** → pass / partial / fail.

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Thin retrospectives (cluster)** | Nearly all weDo retro ≈21–36 w (spec 40–80); late iDo T3-A/T4-A/T4-B retro ≈26–33 w | Newbie closes tab with principle slogan only; weak self-check | **P1** on worst units below · **P2** elsewhere |
| **I Do preambles under 80 w** | T1-B…T4-B pre ≈51–60 w (T1-A 74 w is best); bullet We Do form is OK by spec | Demo “what to watch” a bit short; still has predict cue | **P2** (cluster; expand only if Fixer has budget) |
| **Feedback thin or ≈ retro** | Several fb ≈20–24 w (floor 25); T3-B-E1, T4-A-E1, T1-B-E1 share core idea with retro | Corrective loop and metacognitive close collapse | **P1** on named pairs · **P2** thin-only |
| **Prose defect in T2-A-DEMO `why`** | `` `duplicated(keep=False)` inventaría el grupo exacto `` | False verb confuses exact-dup mask | **P1** (one-line fix) |
| **Prose defect in T2-B-DEMO retro** | “armarás **lens**, columnas” | English/typo residue; should be conteos/longitudes | **P2** |
| **T2-B-E1 feedback accuracy** | Dice `clean_n=1` si keep last; fixture con keep last sigue en 2 ids | Newbie feedback slightly wrong for this fixture | **P2** |
| **We Do preambles as 4 bullets** | All 24 use Contexto/Meta/Éxito/Límites; often 42–58 w total | Spec allows “4 short bullets”; checklist **pass** even if under 80 prose words | — (not a fail) |
| **Hints nearly solution (E1)** | E1 hints often print the exact expression | Acceptable for guided; do not copy into preamble | **P2 note** (no forced change) |
| **Filename vs content** | `s16-wxpython-gui.ts` / id `wxpython-gui` | Confuses search; out of scope for exercise prose | **Note only** |

**Section severity theme (Round 2):** solid shell after R1; residual is **P1 where metacognition or a prose bug hurts learning integrity**, else **P2 length/polish**. No unit needs a full rewrite of starter/oracle.

---

## Unit ledger

### I Do

### S16-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (output visible) · constraints pass (sintético, no fill) · retrospective pass
- **Diagnosis:** R1 prose landed. Predict `viol` + `optional_nulls`; why separates required fail vs optional metric; retro names fillna-on-required misconception and bridges to We Do.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none

### S16-T1-B-DEMO (iDo)
- **Scores:** preamble **Adequate** (~60 w) · why **Strong** · retrospective **Needs residual** (~37 w)
- **Checklist:** all pass for demo tier; retro slightly thin (no self-check)
- **Diagnosis:** Cap + order of `was_null` clear. Retro states the principle but under-targets length and lacks a question the learner can answer without code.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Imputar sin indicador borra la diferencia entre cero real y cero inventado. Si el rate supera el cap, el status es `blocked`, no un fill silencioso. Pregunta de auto-chequeo: ¿en qué fila del demo `monto_was_null` es True y por qué se marca *antes* del fill? En We Do practicarás el orden del indicador y el umbral.
- **Code/output changes:** none

### S16-T2-A-DEMO (iDo)
- **Scores:** preamble **Adequate** · why **Needs residual** (prose bug) · retrospective **Adequate** (~36 w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass (thin)
- **Diagnosis:** Scene C001 exact / C002 conflict is strong. In `why`, the clause `` `duplicated(keep=False)` inventaría el grupo exacto `` is wrong Spanish (should *mark/identify*, not “invent”). Rest of why is sound.
- **Severity residual:** P1 (fix the verb in `why`; optional P2 length on retro)
- **Proposed residual `why` (full text — replace current):**  
  Duplicado exacto y conflicto de atributo no se tratan igual: el exacto puede colapsarse tras log; el conflicto exige evidencia y regla explícita, no `keep='first'` silencioso. `duplicated(keep=False)` **marca todas las filas** del grupo exacto; `nunique` sobre un atributo detecta claves con versiones distintas. Clasificar antes de borrar evita un maestro mentiroso. En We Do practicarás cada máscara y la etiqueta conjunta.
- **Optional residual retrospective (if Fixer expands):**  
  Clasificar antes de borrar es la regla de oro de T2. Exacto ≠ conflicto: el segundo no se “arregla” con keep first silencioso. Pregunta: si solo hicieras `drop_duplicates`, ¿qué evidencia de C002 perderías? En We Do practicarás cada máscara y luego la etiqueta conjunta.
- **Code/output changes:** none

### S16-T2-B-DEMO (iDo)
- **Scores:** preamble **Adequate** (~51 w) · why **Strong** · retrospective **Needs residual** (~35 w + “lens”)
- **Checklist:** pass; retro partial (typo + thin)
- **Diagnosis:** Clean + quarantine with `batch` is clear. Retro ends with “armarás **lens**” — residue from R1 English shorthand for `len(q)/len(c)`; fix to Spanish.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  `keep='first'` solo define el clean; no sustituye el audit trail. Sin quarantine con columnas de origen, el gate no es auditable ante riesgo o cumplimiento. Pregunta: ¿por qué `quarantine` guarda *ambas* filas de C001 y no solo la descartada? En We Do armarás conteos (`len`), columnas de evidencia y chequeo de cardinalidad 1:1.
- **Code/output changes:** none

### S16-T3-A-DEMO (iDo)
- **Scores:** preamble **Adequate** · why **Strong** · retrospective **Needs residual** (~33 w)
- **Checklist:** pass; retro thin
- **Diagnosis:** Predict raw vs canónico is excellent. Retro names overwrite/comas but is bridge-heavy.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Si el raw y el canónico viven juntos, el transform es auditable. El error clásico es pisar la columna original o borrar comas a ciegas (`3,00` → 300). Pregunta: ¿qué KPI de ticket se infla si tratas la coma como miles? En We Do practicarás strip/title, locale PEN y no-overwrite del raw.
- **Code/output changes:** none

### S16-T3-B-DEMO (iDo)
- **Scores:** preamble **Adequate** · why **Strong** · retrospective **Adequate** (~35 w)
- **Checklist:** all pass
- **Diagnosis:** Predict `stat` / `error` / `plausible` is the right cognitive demand. Retro already states flag vs error; optional self-check only.
- **Severity residual:** P2 (optional)
- **Proposed residual retrospective (full text, optional):**  
  Si puedes explicar por qué 1000 es `flag` y -3 es `error`, ya separas estadística de regla de negocio. El error clásico es borrar todo lo “raro” por IQR. Pregunta: ¿quién manda si un valor es a la vez outlier estadístico y domain_error? En We Do practicarás cada capa (domain → IQR → etiquetas).
- **Code/output changes:** none

### S16-T4-A-DEMO (iDo)
- **Scores:** preamble **Adequate** · why **Strong** · retrospective **Needs residual** (~28 w)
- **Checklist:** success pass · retrospective partial (thin, mostly bridge)
- **Diagnosis:** Predict `missing` / `cross_fail` works. Retro under-sells the misconception “schema ok ⇒ filas coherentes.”
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Un gate sin reglas cross-field aprueba filas internamente inconsistentes. Schema ok no basta: el tiempo de vigencia también es contrato. Pregunta: en la demo, ¿por qué `missing` es `[]` y aun así el gate debe reportar un fallo? En We Do practicarás missing, máscara temporal y el flag `drift`/`schema_ok`.
- **Code/output changes:** none

### S16-T4-B-DEMO (iDo)
- **Scores:** preamble **Adequate** · why **Strong** · retrospective **Needs residual** (~26 w)
- **Checklist:** success pass · retrospective partial
- **Diagnosis:** “Publicar aunque pass=false” is clear in preamble/why; retro is slogan + bridge only.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Un gate que solo “explota” sin JSON no es operable. Métricas + audit son el producto del fail-closed: el operador ve filas in/clean/quarantine aunque el exit code sea ≠ 0. Pregunta: ¿qué evento debe quedar *antes* de `quarantine` en el audit? En We Do construirás el bloque metrics, el append y el booleano `pass`.
- **Code/output changes:** none

---

### We Do — T1-A

### S16-T1-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** (4 bullets) · instruction **Strong** · feedback **Adequate** (~24 w, just under floor) · retrospective **Needs residual** (~33 w)
- **Checklist:** context/goal/success/constraints pass · retrospective partial
- **Diagnosis:** Classic DEFECT (`notna` + `ok`). Instruction task-only. Retro lacks self-check; feedback almost at floor.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  `notna` cuenta presentes; `isna` cuenta ausencias. Required con null ⇒ `violates`, no `ok`. Contar mal invierte la señal del gate y aprueba filas rotas ante el auditor del run.
- **Proposed residual retrospective (full text):**  
  El primer paso del gate es **medir** ausencia required, no rellenar. El error clásico es confiar en `notna` o en fillna antes del conteo. Pregunta: con el fixture, ¿por qué `n` debe ser 1 y no 2? Siguiente (E2): armar el mapa solo con campos required.
- **Code/output changes:** none

### S16-T1-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~30 w)
- **Checklist:** all pass; retro thin
- **Diagnosis:** Filter flip optional→required is high-value. Fade vs E1 is real.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  El mapa de violaciones es el contrato legible del gate: solo required con n>0. Mezclar optional diluye el fail y confunde al auditor. Pregunta: ¿por qué `b` no entra al dict aunque tenga null? Luego (E3) conviertes el mapa en decisión `pass`/`fail`.
- **Code/output changes:** none

### S16-T1-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Adequate** (~36 w)
- **Checklist:** all pass
- **Diagnosis:** Fail-closed transfer is clean. Retro already closes the T1-A chain. Optional +1 self-check only.
- **Severity residual:** P2 (optional)
- **Proposed residual retrospective (full text, optional):**  
  Fail-closed = el gate publica el fallo en lugar de maquillar datos. Si `viol` no se llena, el pass es mentira operativa. Pregunta: ¿qué imprimirías si `id` no tuviera nulls? Cierra T1-A: conteo → mapa → decisión. En T1-B practicarás imputar solo lo permitido.
- **Code/output changes:** none

---

### We Do — T1-B

### S16-T1-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (overlap with feedback + thin)
- **Checklist:** pass; retro partial (echoes “orden del indicador”)
- **Diagnosis:** Best defect in T1-B (fill then isna). Feedback and retro both hammer order; retro should add metacognition, not repeat the corrective note.
- **Severity residual:** P1 (dedupe retro from feedback)
- **Proposed residual retrospective (full text):**  
  El orden es parte del contrato de evidencia: medir ausencia → transformar → publicar. Si el indicador queda todo False, no es un “bug de pandas”: es evidencia inventada. Pregunta: ¿por qué el auditor necesita `was_null` además del monto ya rellenado? Siguiente (E2): el cap decide si se permite imputar.
- **Code/output changes:** none

### S16-T1-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~29 w)
- **Checklist:** all pass; retro thin
- **Diagnosis:** Threshold inversion is clear; job hook (ticket promedio) is in preamble.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  El cap es un freno de negocio, no un detalle de pandas. Rate alto ⇒ no rellenar en silencio. Pregunta: con rate=0.5 y umbral 0.3, ¿qué etiqueta imprime el gate y qué *no* debe hacer con `fillna`? Luego (E3) practicarás mediana estable cuando sí se permite imputar.
- **Code/output changes:** none

### S16-T1-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~21 w, under floor) · retrospective **Adequate**
- **Checklist:** pass; feedback thin
- **Diagnosis:** Median vs zero is the right transfer. Feedback needs one more sentence of KPI reasoning.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  `fillna(0)` inventa un cero de negocio y sesga KPIs de ticket PEN. Usa `median()` de no-nulos (skipna) y rellena con esa mediana pre-fill; no recalcules la mediana después del fill para maquillar el reporte.
- **Code/output changes:** none

---

### We Do — T2-A

### S16-T2-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Adequate** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~30 w; mild echo of feedback)
- **Checklist:** pass
- **Diagnosis:** `keep=False` vs default is excellent guided tip. Retro should stress inventory vs drop, not restate the count error alone.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  `keep=False` es la máscara de **evidencia** del grupo; el default de `duplicated` sirve para drop, no para inventariar cuarentena. Contar 1 cuando hay 2 filas idénticas subestima el rastro. Pregunta: ¿cuántas filas debe ver el auditor del grupo exacto? Siguiente (E2): conflictos multi-región.
- **Code/output changes:** none

### S16-T2-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~26 w)
- **Checklist:** pass; retro thin
- **Diagnosis:** List limpios vs conflictos is a sharp independent surface.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Conflicto = misma clave, atributos distintos. Listar limpios no es listar problemas del maestro. Pregunta: ¿por qué C002 no debe aparecer en la lista de conflicto del fixture? Luego (E3) etiquetas exact / conflict / clean en un solo id de prueba.
- **Code/output changes:** none

### S16-T2-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~27 w)
- **Checklist:** pass
- **Diagnosis:** Transfer classification is real; solution is dense but instruction stays goal-level. Retro should restate classify→act order with self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  El orden clasificar→actuar evita borrar el rastro del conflicto. Lima/Cusco en el mismo `cliente_id` nunca es `clean`. Pregunta: si `score` es idéntico pero `region` difiere, ¿es exact o conflict? Cierra T2-A. En T2-B partirás clean vs. quarantine con evidencia.
- **Code/output changes:** none

---

### We Do — T2-B

### S16-T2-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (slightly inaccurate) · retrospective **Needs residual** (~27 w)
- **Checklist:** pass; feedback partial
- **Diagnosis:** Split q/c is clear. Feedback claims `clean_n=1` for keep last — with this fixture (`a,a,b`), keep last still yields 2 clean ids. Rephrase failure modes to match the starter (`0` hard-coded; wrong keep).
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  Si imprimiste `0` en quarantine, no armaste la máscara `duplicated(..., keep=False)`. Si usaste solo `keep='last'` sin armar `q`, pierdes el inventario de evidencia aunque el clean tenga dos ids. Separa `q` (todas las dups) y `c` (`keep='first'` documentado).
- **Proposed residual retrospective (full text):**  
  Quarantine completa + clean documentado es el split auditable. Contar 0 en `q` es mentir al auditor. Pregunta: ¿por qué `len(q)` puede ser 2 y `len(c)` también 2 en el mismo fixture? Siguiente (E2): conservar columnas de evidencia, no solo la clave.
- **Code/output changes:** none

### S16-T2-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~21 w under floor) · retrospective **Adequate** (~28 w)
- **Checklist:** pass
- **Diagnosis:** Project-only-`id` defect is excellent. Feedback needs a bit more reasoning.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  Si imprimiste solo `['id']`, perdiste la evidencia de `batch`. La cuarentena es la fila completa: sin origen/batch no hay reconstrucción auditable de por qué se eligió una versión de la clave.
- **Code/output changes:** none

### S16-T2-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~33 w)
- **Checklist:** all pass
- **Diagnosis:** Card 1:1 → S17 bridge is the right transfer close for T2. Optional self-check only.
- **Severity residual:** P2 (optional)
- **Proposed residual retrospective (full text, optional):**  
  Cardinalidad 1:1 es un contrato del clean hacia S17, no un detalle cosmético. `card_ok` a ciegas es el mismo anti-patrón que `pass` sin medir. Pregunta: si `nunique(id) < len(df)`, ¿qué le pasa a un join one-to-one en S17? Cierra T2. En T3-A normalizarás sin borrar el raw.
- **Code/output changes:** none

---

### We Do — T3-A

### S16-T3-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Adequate** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~23 w — thinnest retro in T3-A)
- **Checklist:** pass; retro partial
- **Diagnosis:** strip+title is basic guided; preamble limits line about “aquí solo Series” is slightly meta for a newbie but harmless. Retro needs canonicity principle + self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Canonicidad de strings es el primer filtro antes de mapas de sinónimos (`LIM`→Lima). Solo strip deja `CUSCO` ruidoso y parte el groupby de regiones PE. Pregunta: ¿qué buckets falsos evitas con `title` en este fixture? Siguiente (E2): locale de montos PEN.
- **Code/output changes:** none

### S16-T3-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong** (relative to section; still ~32 w)
- **Checklist:** all pass
- **Diagnosis:** Best defect in the section (`3,00`→300). Feedback names ~301.5. Optional self-check only.
- **Severity residual:** P2 (optional)
- **Proposed residual retrospective (full text, optional):**  
  Locale documentado es parte del contrato del gate, no un “detalle de formato”. `3,00` → 300 es un bug de negocio silencioso que infla el ticket promedio. Pregunta: con solo coma, ¿decimal latino o miles? Luego (E3) conservarás el raw al crear la columna canónica.
- **Code/output changes:** none

### S16-T3-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~25 w)
- **Checklist:** pass
- **Diagnosis:** No-overwrite transfer is clean. Retro thin.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Raw al lado = transform disputable. Pisar el original es normalizar de forma no auditable. Pregunta: si solo queda `region` en Title Case, ¿puedes defender el valor de entrada ante auditoría? Cierra T3-A. En T3-B clasificarás outliers sin borrar colas legítimas.
- **Code/output changes:** none

---

### We Do — T3-B

### S16-T3-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~22 w; echoes feedback “invertir la máscara”)
- **Checklist:** pass; retro partial
- **Diagnosis:** Domain mask flip is simple guided. Retro must not only restate invert-mask.
- **Severity residual:** P1 (dedupe retro)
- **Proposed residual retrospective (full text):**  
  Domain bounds son reglas de negocio, no estadística: un monto negativo no es “outlier curioso”. Si la máscara marca positivos, el gate cuarentenará filas válidas. Pregunta: ¿por qué este lab **prohíbe** IQR a propósito? Siguiente (E2): candidatos IQR en una capa aparte.
- **Code/output changes:** none

### S16-T3-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** (already notes bilateral habit) · retrospective **Needs residual** (~22 w)
- **Checklist:** pass
- **Diagnosis:** R1 note about upper-only fixture was partially fixed in feedback (good). Retro still thin.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  IQR propone candidatos; no decide borrar. Ambos fences evitan ceguera a un lado aunque el fixture solo ejercite el upper. Pregunta: si mañana llega un −50 legible por domain, ¿la máscara IQR bilateral lo habría visto como candidato? Luego (E3) combinas dominio + IQR en etiquetas error/flag/ok.
- **Code/output changes:** none

### S16-T3-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~33 w)
- **Checklist:** all pass
- **Diagnosis:** Mini-capstone of outliers; priority domain→stat→ok is clear. Optional self-check.
- **Severity residual:** P2 (optional)
- **Proposed residual retrospective (full text, optional):**  
  Prioridad dominio → estadística → ok es el contrato de outliers del gate. 5000 puede ser cola legítima (flag); -1 no. Pregunta: si un valor es domain_error y también IQR, ¿qué etiqueta gana y por qué? Cierra T3. En T4-A el contrato pasa a schema y reglas cross-field.
- **Code/output changes:** none

---

### We Do — T4-A

### S16-T4-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~21 w; thinnest in T4-A; echoes “lista vacía”)
- **Checklist:** pass; retro partial
- **Diagnosis:** Missing columns is clear guided. Retro should stress operator-facing drift message, not only the empty-list anti-pattern already in feedback.
- **Severity residual:** P1 (thin + echo)
- **Proposed residual retrospective (full text):**  
  Missing columns = schema drift **legible** para el operador del job (nombres de columna, no KeyError opaco). Lista vacía fingida es el anti-patrón del gate silencioso. Pregunta: ¿qué columna debe aparecer en la lista del fixture y por qué `id` no? Siguiente (E2): inconsistencias entre campos ya presentes.
- **Code/output changes:** none

### S16-T4-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~28 w)
- **Checklist:** pass
- **Diagnosis:** Cross-field inequality flip is solid independent practice.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Cross-field = reglas entre columnas, no solo presencia. Invertir la máscara “falla” las filas buenas de vigencia. Pregunta: si `fin > inicio` en la fila 0, ¿debe entrar a `cross_fail`? Luego (E3) el flag de drift del schema cierra el gate de columnas.
- **Code/output changes:** none

### S16-T4-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~33 w)
- **Checklist:** all pass
- **Diagnosis:** Measure-but-print-ok is excellent fail-closed transfer. Instruction still names DEFECT (course pattern); not over-spoon-fed beyond that.
- **Severity residual:** P2 (optional)
- **Proposed residual retrospective (full text, optional):**  
  Fail-closed ante drift protege a S17 y a quien consume el clean. Calcular `missing` y no usarlo es teatro de validación. Pregunta: ¿qué etiqueta imprime el gate si `missing` es no vacío? Cierra T4-A. En T4-B publicarás métricas y audit aunque el gate falle.
- **Code/output changes:** none

---

### We Do — T4-B

### S16-T4-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~29 w)
- **Checklist:** pass
- **Diagnosis:** Reporting bug (sum quarantine into rows_in + pass True) is high-value guided. Retro can add self-check on derived metrics.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Las métricas se **derivan** del conteo real, no de literales optimistas. Sumar rechazos a `rows_in` o forzar `pass: True` es un bug de reporting. Pregunta: con 10 in y 3 en quarantine, ¿qué es `rows_clean` y por qué `pass` es false? Siguiente (E2): el audit no se pisa al fallar.
- **Code/output changes:** none

### S16-T4-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~26 w)
- **Checklist:** pass
- **Diagnosis:** Reassign vs append is excellent. Retro thin.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Append-only permite reconstruir el run; reasignar es perder historia. Len=1 con solo quarantine es un audit mentiroso. Pregunta: ¿qué evento debe seguir visible en `audit[0]` después del append? Luego (E3) el booleano `pass` cierra el contrato fail-closed.
- **Code/output changes:** none

### S16-T4-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~20 w under floor) · retrospective **Adequate** (~29 w)
- **Checklist:** pass
- **Diagnosis:** Minimal transfer (flip `pass`) is intentional fade into You Do. Feedback needs one sentence tying to job semaphore.
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  Con `n_q=1`, `pass` debe ser False. Invertir la comparación (`n_q > 0`) aprueba un batch con cuarentena: el semáforo del job miente y rompe fail-closed aunque `rows_quarantine` diga la verdad.
- **Proposed residual retrospective (full text, optional polish):**  
  `pass` es el semáforo del job, no un mensaje de marketing. True con cuarentena rompe fail-closed. Pregunta: ¿puedes tener `rows_quarantine > 0` y `pass=True` en un gate honesto? Cierra T4 y prepara el You Do: metrics + quarantine + audit juntos.
- **Code/output changes:** none

---

### You Do

### S16-youDo (youDo)
- **Scores:** context **Strong** · objectives **Strong** · requirements **Strong** · rubric **Strong** · portfolioNote **Strong** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (asserts + tabla de aceptación) · constraints pass (sintético, no PII, no silent fix) · retrospective pass
- **Diagnosis:** Round-1 retrospective landed as defense/reflection with three self-checks and S17 bridge. Table of acceptance + starter asserts remain the success contract. No residual rewrite required.
- **Severity residual:** — (none required)
- **Proposed residual:** none
- **Code/output changes:** none (do not invent a rigid `rows_clean` beyond `rows_quarantine >= 2`)

---

## Priority order

### P1 (Fixer first — integrity / metacognition)
1. **S16-T2-A-DEMO** — replace erroneous `` inventaría `` in `why` (full text above).
2. **S16-T1-B-E1** — rewrite retrospective so it does not clone feedback (order → evidence/auditor self-check).
3. **S16-T3-B-E1** — rewrite retrospective (domain vs IQR purpose; not only “máscara invertida”).
4. **S16-T4-A-E1** — expand retrospective (legible drift for operator; self-check on which column is missing).

### P2 (length / polish / accuracy — batch if budget)
1. **I Do thin retros:** T1-B, T2-B (`lens`→conteos), T3-A, T4-A, T4-B (+ optional T3-B).
2. **We Do thin retros** (all remaining under ~40 w): prefer units with self-check proposals above; do **not** auto-expand every unit with filler.
3. **Feedback under floor / accuracy:** T1-A-E1, T1-B-E3, T2-B-E1 (accuracy), T2-B-E2, T4-B-E3.
4. **Optional** self-check polish on already-Adequate E3 units (T1-A-E3, T2-B-E3, T3-B-E3, T4-A-E3).
5. **I Do preambles** 51–60 w: expand only if Fixer still has capacity after P1/P2 retros; not blocking.

### Do not touch
- Starter defects, solution code, exact `output` strings, You Do asserts, theory blocks, selfCheck quiz (unless Fixer finds a separate bug).
- Section id / filename rename (orchestrator-only).

---

## Residual risks

1. **Expand-all temptation:** many retros are “short but correct.” Expanding every unit with synonym soup violates anti-bloat; prefer the P1 list + the thinnest retros that lack self-check.
2. **Feedback/retro collapse:** if Fixer only lengthens retro by pasting feedback, Round-2 fails its metacognitive job. Retro = principle + misconception + transfer (+ optional self-check); feedback = immediate corrective reasoning.
3. **Instruction re-bloat:** do not re-merge pass criteria into `instruction`; they already live in preamble bullets.
4. **Hints as solution:** E1 hints are near-complete (acceptable guided). Do not promote them into preamble/instruction.
5. **Oracle stability:** T3-B-E2 fixture only hits upper fence; feedback already teaches bilateral habit — do **not** change fixture/output “to force lower fence” unless execute-and-diff is planned.
6. **Filename `wxpython-gui`:** still misleading; out of scope for pedagogy fix pass.
7. **You Do has no single solution in source:** retrospective correctly stays at invariants (`pass is False`, `rows_quarantine >= 2`, coded reasons) — keep it that way.

---

## Counts summary (current source after R1)

| Tipo | N | preamble | retrospective | title | Residual theme |
|------|---|----------|---------------|-------|----------------|
| iDo | 8 | 8/8 present | 8/8 present | N/A | 1 P1 why typo; several thin retros |
| weDo | 24 | 24/24 + title | 24/24 | 24/24 | Thin retros cluster; 2–3 feedback/retro collapses |
| youDo | 1 | N/A (context) | 1/1 Strong | 1 | No residual |

**Hallazgo central (Round 2):** S16 is **exercise-ready for a true newbie at the schema level** (preamble → task → retrospective, real E1→E3 fade, strong You Do defense). Residual work is **not** another missing-field campaign: it is **tighten metacognitive closes**, **fix two prose defects**, and **dedupe a few feedback/retro pairs** without touching oracles.

---

Section 16 exercise pedagogy review complete. Ready for the Fixer prompt.
