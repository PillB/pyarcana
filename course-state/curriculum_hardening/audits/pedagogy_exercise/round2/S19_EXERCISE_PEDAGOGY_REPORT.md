# S19 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Visualización y comunicación accesible
- **shortTitle:** Viz accesible
- **id:** `databases-orm` (archivo histórico `s19-databases-orm.ts`; contenido = charts honestos, Matplotlib, a11y y claims — no ORM/SQL)
- **index:** 19
- **source file:** `src/lib/course/sections/s19-databases-orm.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** S19-T1-A chart choice · T1-B ejes/encodings · T2-A Matplotlib estático · T2-B composición/export · T3-A filtros/tooltips · T3-B estado/a11y/paridad · T4-A caption · T4-B color/alt/no sobreclaim
- **hilo de caso:** CASO-LIM-019 / dashboard ejecutivo **CP-N2-B** (medianas y n por Lima/Cusco/Arequipa, PEN, datos sintéticos web; puente S18 → S20/S21)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (roles de campo, longitudes, checklist preamble/retrospective, fade E1→E2→E3, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Used Round-1 report only as historical context — **not** as acceptance proof
- Scored residual quality for a true newbie (qué practico / por qué importa / cómo sé que gané / qué debe quedarme), not mere field presence
- No bulk generation; no source edits in this round
- Prose residual proposals in **español profesional peruano**, un objetivo primario por unidad

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| I Do `why` expanded toward 40–90 words | **Met** (~45–63 w) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do `preamble` in 4-bullet form (Contexto / Meta / Éxito / Límites) | **Met** — valid alternative to 80–150-word prose |
| You Do has `retrospective` of defense | **Met** |
| E1→E2→E3 fade preserved in *code* (guided / independent / transfer) | **Met** |
| Starters with `# Bug a corregir` / CASO-LIM-019, solutions, outputs intact | **Met** |
| “E_n (kind) — escenario…” telegraphic instruction removed | **Met** (pasos de tarea) |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: (1) a few **feedback ↔ retrospective role collapses**, (2) **E2 instructions that paste the full solution string**, (3) **short retrospectives** under the 40-word soft floor missing misconception or self-check, (4) **thin feedback** on mechanical units, (5) two **titles** under the 4-word soft floor.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Feedback ≈ retrospective** | Same core idea restated: **T2-B-E3** (suptitle vs panel title), **T4-A-E3** (`k: v` contract), milder on **T2-B-E2**, **T3-B-E1**, **T3-B-E2** | Feedback does not repair *reasoning* of the failed attempt; retro does not add metacognition | **P1** (clear pairs) · **P2** (mild) |
| **E2 full-string / full-logic spoiler** | **T3-A-E2** step 2 pastes exact `Lima: {28} PEN (n={40})`; **T1-B-E2** steps encode the entire `if/else` of `gate_baseline`; **T2-A-E2** gives exact ylabel + ylim literals | Independent tier stops being judgment; becomes paste | **P1** (T3-A-E2, T1-B-E2) · **P2** (T2-A-E2) |
| **Short We Do `retrospective`** | Many ~18–33 w (spec soft floor 40–80); worst: **T2-B-E1 ~18**, **T3-A-E1 ~21**, **T4-A-E2 ~22**, **T4-B-E2 ~23** | Principle present; misconception and/or self-check often missing | **P2** (expand collapsed pairs + worst shorts) |
| **Thin We Do `feedback`** | Under ~25 w: **T1-A-E3**, **T1-B-E3**, **T2-B-E2**, **T2-B-E3**, **T3-A-E3**, **T3-B-E3**, **T4-A-E1**, **T4-A-E3** | Corrective loop thin for deliberate practice | **P2** |
| **Title soft floor (4–12 words)** | **T3-A-E3** “Función tooltip reutilizable” (3); **T4-B-E1** “Rechazar sobreclaim nacional” (3) | Minor UI header shortness | **P2** |
| **I Do preamble slightly under 80-word prose floor** | Most demos ~68–77 w prose (not bullets); content already strong | Usable; optional +1 sentence on densest demos only if Fixer batches | **P2** optional |
| **I Do retro soft floor** | T1-B ~36, T2-B ~39, T3-A ~34, T4-A ~37, T4-B ~33 | Bridge + principle present; self-check often absent | **P2** optional (only densest) |
| **You Do shell** | context / objectives / requirements / rubric / portfolioNote + retrospective present | Defense frame strong (~96 w; slightly over soft max but matches exemplar multi-check style) | **—** / optional trim P2 |
| **Exact outputs / solutions** | All canonical strings aligned to theory and CP-N2-B | Fixer must not “polish” solution strings or outputs | residual risk — **keep** |
| **Hints still name outputs on some E1** | T4-B-E1 style “sobreclaim… sin marco” is OK; spoiling was reduced vs R1 | Acceptable for guided | no new P0 |

**Section severity theme (Round 2):** shell is solid; **P1** only where learning integrity is at risk (role collapse on clear pairs; E2 full paste/logic). Most of the rest is **P2 polish**. Do **not** bulk-rewrite every preamble just to hit 80 words — 4-bullet form already satisfies the spec alternative.

Scoring key for residual quality (true newbie):
- **Strong** — checklist solid; lengths OK or bullets complete; no spoiler; misconception + transfer clear; feedback ≠ retro
- **Adequate** — usable; small nits only
- **Needs residual** — spoiler, role collapse, missing piece for newbie, or clear length/role failure

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

## Unit ledger

### I Do

### S19-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (predice best + `rechaza_pie_3d`) · constraints pass · retrospective pass
- **Diagnosis:** R1 prose landed. Newbie watches scores and rejects pie 3D; misconception “bonito = correcto” is explicit. No integrity gap.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S19-T1-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~36 w; light self-check)
- **Checklist:** all pass; retro bridge-heavy
- **Diagnosis:** Factor 10 prediction is excellent. Optional self-check on “misma diff absoluta ≠ honesto” — not required if We Do E1 already hammers the formula.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Misma diferencia absoluta, distinta historia visual: el truco multiplica la percepción. Si puedes explicar el factor 10 sin el código, ya desconfías del eje recortado. Pregunta de auto-chequeo: ¿por qué el denominador honesto es el máximo (100) y no la brecha 8? We Do: calcular factor, `gate_baseline` y rechazo de dual-axis.
- **Code/output changes:** none

### S19-T2-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Diagnosis:** Contrato CI (ylim0, ylabel, hatch) + close is explicit. Three watch targets for the newbie.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S19-T2-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~39 w)
- **Diagnosis:** “dict inventado ≠ PNG real” is clear; `png_bytes_ok` is a good prediction target.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S19-T3-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~34 w)
- **Diagnosis:** Spec-before-library + tooltip with n is strong. Optional self-check on Cusco string — mild.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Filtro sin recálculo es defecto de producto. Si puedes escribir de memoria el patrón `región: valor PEN (n=…)`, ya tienes la plantilla del portfolio. Pregunta de auto-chequeo: ¿qué cambia en el tooltip al pasar de Lima a Cusco? We Do: corregir lookup, incluir n y generalizar la función.
- **Code/output changes:** none

### S19-T3-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Diagnosis:** Parity fail 27.5 vs 28.0 is the right misconception. No residual required.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S19-T4-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate**
- **Diagnosis:** Pie with four pieces + travel to S21 is clear.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S19-T4-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~33 w)
- **Diagnosis:** PERMITIDO/RECHAZADO contrast trains the habit. Optional rewrite self-check already implied (“si puedes reescribir…”).
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do · T1-A (chart choice)

### S19-T1-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** (4 bullets) · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~33 w)
- **Checklist:** all pass for guided tier
- **Diagnosis:** Defect named (`line` for comparison); feedback anchors committee; retro has principle + classic error + bridge. Soft-short retro only.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Pregunta de comparación → barras; pregunta de tendencia → línea. El error clásico es “siempre uso el chart del último tutorial” o un pie “bonito”. Pregunta de auto-chequeo: ¿qué chart elegirías para “tendencia semanal de tickets”? Siguiente (E2): el brief (`pregunta`, `audiencia`, `chart`) debe viajar con la figura.
- **Code/output changes:** none

### S19-T1-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (names exact values — mild E2 breadcrumb) · feedback **Strong** · retrospective **Needs residual** (~28 w, light)
- **Diagnosis:** Feedback explains orphan brief vs S21 well. Instruction step 2 spells `ejecutivo` + `bar` (acceptable contract for exact-output lab; not a full function paste). Retro lacks self-check.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Tres claves mínimas: qué se pregunta, a quién se habla, cómo se encode. Un dict solo con `pregunta` es hallazgo huérfano. Pregunta de auto-chequeo: ¿qué clave faltaría si el informe S21 no puede defender “por qué barras”? Luego (E3) automatizarás la elección con una regla legible sobre el texto de la pregunta.
- **Code/output changes:** none

### S19-T1-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~21 w thin) · retrospective **Adequate**
- **Diagnosis:** Transfer to `elige_chart` is real. Feedback states the rule but barely diagnoses “always bar”. Retro already has self-check on mayúsculas — good.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Si ambas líneas salen `bar`, la función aún ignora la pregunta. Busca la subcadena `"tendencia"` sobre `pregunta.lower()`; sin normalizar, `TENDENCIA` fallaría en producción. Keywords legibles se auditan en CI; un return fijo no.
- **Code/output changes:** none

---

### We Do · T1-B (ejes honestos)

### S19-T1-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** (formula OK for E1) · feedback **Strong** · retrospective **Needs residual** (~25 w)
- **Diagnosis:** Guided defect on honest denominator is excellent. Retro principle is thin; expand misconception + bridge.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Altura percibida = diff / span del eje. Recortar el span multiplica la historia aunque la diferencia absoluta sea la misma. El error clásico es usar la brecha entre barras como “denominador honesto”. Pregunta de auto-chequeo: con baseline 0 y máx 50, ¿cuál es el span? Siguiente (E2): automatizar el veredicto con `gate_baseline`.
- **Code/output changes:** none

### S19-T1-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (full gate logic in steps — E2 spoiler) · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Starter is good independent scaffold (always `ok_con_nota`). Instruction steps 2–3 paste the entire decision tree — reduces judgment. Feedback and retro are differentiated (ethics of PEN bars vs encoding-first order).
- **Severity:** **P1**
- **Proposed residual `instruction` (full text):**  
  1. Abre el starter: la función ignora argumentos y devuelve siempre `ok_con_nota` (bug).  
  2. Implementa tres veredictos según encoding y `ylim_bottom` (revisa el I Do y el contrato de barras absolutas).  
  3. Deja el print de prueba con bottom 40 y `bar_absolute`.  
  4. No trates `line_index` como si fuera barra de montos absolutos.
- **Code/output changes:** none (output `revisar` stays)

### S19-T1-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~18 w; mild ≈ retro) · retrospective **Adequate**
- **Diagnosis:** Ternary invert is clean transfer. Feedback only restates “dual-axis confuses” without diagnosing the inverted ternary.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Si imprimiste `ok`, el ternario sigue al revés: estás aprobando el encoding de riesgo. Dual-axis mezcla dos escalas Y y finge correlación por superposición. Preferir paneles separados (1×2) es el antídoto de diseño del dashboard.
- **Code/output changes:** none

---

### We Do · T2-A (Matplotlib estático)

### S19-T2-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~26 w)
- **Diagnosis:** `set_ylim(1, 3)` defect is perfect guided. Soft-short retro only.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Un booleano de `ylim0` es el test más barato de honestidad visual en CI. El error clásico es “empezar cerca del mínimo” para dramatizar la brecha. Pregunta de auto-chequeo: ¿qué imprime el check si bottom sigue en 1? Siguiente (E2): el contrato también exige ylabel con unidad PEN.
- **Code/output changes:** none

### S19-T2-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (exact API literals — mild E2 over-spec) · feedback **Strong** · retrospective **Adequate** (~25 w)
- **Diagnosis:** Goal is clear from preamble success dict. Instruction pastes exact `set_ylabel` / `set_ylim(0, 35)` — softens independence. Prefer bounds without full paste.
- **Severity:** P2
- **Proposed residual `instruction` (full text):**  
  1. Revisa el starter: imprime ylabel vacío y ylim por defecto (bug).  
  2. Fija ylabel con unidad PEN y fuerza baseline 0 (elige un top razonable, p. ej. por encima de 28).  
  3. Arma el dict con `get_ylabel()` y `float(get_ylim()[0])`.  
  4. Imprime el dict y cierra la figura.
- **Proposed residual `retrospective` (full text):**  
  Unidad en el eje, no solo en el título de la diapositiva. Sin PEN, el “28” no escala fuera del notebook. Pregunta de auto-chequeo: ¿por qué casteamos ylim0 a `float` nativo? Luego (E3) empaquetarás `n_bars` + `ylim0` en `meta_bar`.
- **Code/output changes:** none (solution strings stay)

### S19-T2-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (has self-check)
- **Diagnosis:** Transfer to portfolio API is real; float cast called out. No residual required.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do · T2-B (composición / export)

### S19-T2-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~18 w — shortest in section)
- **Diagnosis:** savefig + panels from figure is well scaffolded. Retro is a slogan without misconception.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  `savefig` primero, metadata después: un dict con `panels: 2` sin bytes no es entrega. El error clásico es hardcodear `png_ok` o inventar el conteo de paneles. Pregunta de auto-chequeo: ¿qué falla si olvidas `BytesIO`? Siguiente (E2): el nombre de archivo versionado es parte del mismo contrato de re-render.
- **Code/output changes:** none

### S19-T2-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Adequate** (short but 4 bullets present) · instruction **Strong** · feedback **Needs residual** (~22 w; mild ≈ retro) · retrospective **Adequate**
- **Diagnosis:** Simple versioning task. Feedback and retro both say “version or history dies” — split roles.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Si imprimiste `fig_cpn2b.png`, aún falta `_v{version}` antes de la extensión. Un solo nombre sobrescribe el histórico en la factoría y rompe la trazabilidad hacia S21. Usa f-string con el `version` del fixture (3).
- **Proposed residual `retrospective` (full text):**  
  Versionar el binario es tan importante como versionar el código del builder. El error clásico es “un PNG para todos los re-renders”. Pregunta de auto-chequeo: ¿qué nombre esperas con `version = 1`? Luego (E3) cada panel necesita título propio (Vol vs Med).
- **Code/output changes:** none

### S19-T2-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual**
- **Diagnosis:** Clear role collapse: both fields argue “suptitle no basta; título de axes es el contrato.”
- **Severity:** **P1**
- **Proposed residual `feedback` (full text):**  
  Si la lista sale `['', '']`, solo hay `suptitle`: `get_title()` del axes no lo hereda. Asigna título en cada panel y vuelve a listar. El grader (y el comité) leen el axes, no el adorno de figura.
- **Proposed residual `retrospective` (full text):**  
  Suptitle es opcional; el título del axes es el contrato del panel. El error clásico es un “Dashboard” global sin Vol/Med. Pregunta de auto-chequeo: ¿qué lee un lector si ambos `get_title()` están vacíos? Puente a T3-A: la vista interactiva también debe recalcular el valor al filtrar región.
- **Code/output changes:** none

---

### We Do · T3-A (filtros / tooltips)

### S19-T3-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~21 w)
- **Diagnosis:** Viewport desync (Cusco vs Lima) is an excellent guided defect. Retro is slogan-only.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Lookup correcto = filtro honesto. El error clásico es dejar hardcodeado el valor de “otra región” o el KPI global de Lima. Pregunta de auto-chequeo: con filtro Lima, ¿por qué 22 sería un fail? Siguiente (E2): el tooltip de esa celda debe llevar unidad y n, no solo el número.
- **Code/output changes:** none

### S19-T3-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (**full solution paste**) · feedback **Strong** · retrospective **Adequate** (~23 w)
- **Diagnosis:** Preamble already fixes exact success string. Instruction step 2 pastes the entire f-string — independent tier collapses to transcription. This is the clearest E2 spoiler in the section.
- **Severity:** **P1**
- **Proposed residual `instruction` (full text):**  
  1. Revisa el starter: el tooltip tiene valor y unidad pero omite el tamaño muestral (bug).  
  2. Completa el f-string para incluir `n` en el formato acordado del contrato a11y (mismo orden de tokens que el I Do).  
  3. Imprime una sola línea.  
  4. No redondees ni insertes espacios extra.
- **Proposed residual `retrospective` (full text):**  
  El hover es un canal de honestidad, no solo de “detalle cosmético”. Sin n, 28 se lee como censo. Pregunta de auto-chequeo: ¿qué token falta si el string termina en `PEN` sin paréntesis? Luego (E3) generalizas la plantilla a cualquier fila con una función pura.
- **Code/output changes:** none (output `Lima: 28 PEN (n=40)` stays)

### S19-T3-A-E3 (weDo · transfer)
- **Scores:** title **Needs residual** (3 words) · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~19 w) · retrospective **Strong** (has self-check)
- **Diagnosis:** Transfer is clean. Title under soft floor; feedback thin but not collapsed with retro.
- **Severity:** P2
- **Proposed residual `title`:**  
  Plantilla tooltip reutilizable por fila
- **Proposed residual `feedback` (full text):**  
  Si falta `(n=…)`, la plantilla aún es incompleta aunque la región y el valor estén bien. Una función pura sobre `row` evita tooltips distintos “a mano” por región y pasa el gate de a11y del portfolio.
- **Code/output changes:** none

---

### We Do · T3-B (paridad / sampling / alt)

### S19-T3-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~24 w; mild theme with feedback)
- **Diagnosis:** 27.5 vs 28.0 “slide rounding” is excellent. Mild theme overlap feedback/retro (“parity or alt lies”) but feedback is diagnostic enough.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Chart y tabla son dos vistas del mismo contrato a la precisión publicada. El error clásico es “redondear bonito” solo en la diapositiva. Pregunta de auto-chequeo: ¿28 vs 28.0 fallan igualdad en este lab? Siguiente (E2): el estado del viewport también declara `sample_n` y `universe_n`.
- **Code/output changes:** none

### S19-T3-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · feedback **Strong** · retrospective **Adequate** (~24 w)
- **Diagnosis:** Sampling honesty is well framed. Instruction names exact keys/values (needed for exact JSON output lab) — acceptable. Mild feedback/retro theme overlap; not a hard collapse.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Transparencia de sampling es integridad, no un “extra técnico”. El error clásico es mostrar 5000 y callarlo censo. Pregunta de auto-chequeo: ¿qué oculta un estado solo con `sample_n`? Luego (E3) el alt desde tabla lleva unidad PEN en cada par región=valor.
- **Code/output changes:** none

### S19-T3-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~19 w; mild ≈ retro) · retrospective **Adequate**
- **Diagnosis:** Unit in alt is the right transfer. Split feedback (diagnose missing PEN) from retro (principle + bridge to caption).
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Si el string es `Lima=28; Cusco=22`, aún falta la unidad en cada par. El lector de pantalla recibe números ambiguos en un comité multi-métrica. Añade ` PEN` dentro del f-string del join, sin cambiar el separador `"; "`.
- **Code/output changes:** none

---

### We Do · T4-A (caption)

### S19-T4-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~22 w) · retrospective **Needs residual** (~23 w)
- **Diagnosis:** Minimal pie is clear guided. Both fields short; feedback names portfolio gate, retro is slogan — expand retro primarily.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Si solo ves `unidad=PEN`, falta la fuente: no hay trazabilidad para auditar ni re-renderizar con el mismo marco. Completa el pie en el orden unidad luego fuente; el token `sintetico` del lab no se inventa por diapositiva.
- **Proposed residual `retrospective` (full text):**  
  Pie mínimo = qué mide + de dónde sale. El error clásico es dejar la unidad suelta en el título y olvidar la fuente. Pregunta de auto-chequeo: ¿entra al portfolio un pie sin `fuente=`? Siguiente (E2): el dict de caption también exige la clave `limitacion`.
- **Code/output changes:** none

### S19-T4-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~22 w)
- **Diagnosis:** Superset of keys is good independent. Retro lacks self-check.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Tres claves mínimas del pie estructurado: `unidad`, `fuente`, `limitacion`. Sin la tercera, el título puede vender “todo el canal” o “todo el Perú”. Pregunta de auto-chequeo: ¿`set(cap)` con typo `limitación` pasa el gate? Luego (E3) un formatter reutilizable une `k: v` para S21.
- **Code/output changes:** none

### S19-T4-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro on `k: v`) · retrospective **Strong** (has self-check)
- **Diagnosis:** Hard role collapse on “k: v is the contract toward S21.”
- **Severity:** **P1**
- **Proposed residual `feedback` (full text):**  
  Si la salida es `unidad | n`, el join aún recorre solo keys: perdiste los valores. Usa `.items()` y formatea `k: v`. Un pie de nombres de clave no comunica nada al lector del informe.
- **Proposed residual `retrospective` (full text):**  
  `k: v` es el contrato estable hacia S21: el DOCX no debe reinventar el string por figura. El error clásico es listar solo claves o hardcodear el pie. Pregunta de auto-chequeo: ¿qué imprime si añades `fuente` al dict de prueba? Puente a T4-B: el lenguaje del claim y el alt con n cierran la integridad ética.
- **Code/output changes:** none

---

### We Do · T4-B (claims / a11y)

### S19-T4-B-E1 (weDo · guided)
- **Scores:** title **Needs residual** (3 words) · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Always-`OK` defect is excellent guided. Feedback ≠ retro (impact vs didactic hardness). Title soft floor only.
- **Severity:** P2
- **Proposed residual `title`:**  
  Rechazar sobreclaim nacional sin muestra
- **Code/output changes:** none

### S19-T4-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~23 w)
- **Diagnosis:** Dual gate alt+hatch is rich. Instruction hints `n=40` (mild; acceptable with dual boolean success). Retro short.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Dos canales de honestidad: texto no visual con `n=` y encoding no solo-color (hatch). El error clásico es confiar en el contraste del azul. Pregunta de auto-chequeo: ¿`hatch = ""` pasa el check `is not None`? Luego (E3) un clasificador reutilizable de claims cierra el subtema.
- **Code/output changes:** none

### S19-T4-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Transfer + self-check + bridge to You Do already solid. Mild theme with feedback on “didactic rule” but roles split (habit vs production refine + rewrite).
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### You Do

### S19-youDo (youDo)
- **Scores:** context **Strong** · objectives **Strong** · requirements **Strong** · rubric **Strong** · portfolioNote **Strong** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (requirements + rubric + checklist in starter) · constraints pass · retrospective pass
- **Diagnosis:** R1 retrospective of defense landed (baseline, parity, claim rewrite, 30-second impact phrase). `portfolioNote` already mentions claim permitido vs rechazado for oral defense. Starter gradual-release (one complete builder + TODOs) is correct. Word count ~96 slightly over soft 80 for retros, but matches multi-check exemplar style for You Do — **do not force-trim** unless Fixer wants a single optional compress.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order

### P1 (learning integrity — do first)
1. **S19-T1-B-E2** — strip full `gate_baseline` logic from `instruction` (keep success in preamble)
2. **S19-T3-A-E2** — remove exact f-string paste from `instruction` (success already in preamble)
3. **S19-T2-B-E3** — split feedback (diagnose empty titles) vs retrospective (principle + self-check + bridge)
4. **S19-T4-A-E3** — split feedback (diagnose keys-only join) vs retrospective (principle + self-check + bridge)

### P2 (polish — batch if touching nearby units)
- Expand shortest retrospectives: **T2-B-E1**, **T3-A-E1**, **T4-A-E1**, **T4-A-E2**, **T4-B-E2**, plus optional T1-A-E1/E2, T1-B-E1, T2-A-E1, T3-B-E1/E2
- Thicken thin feedback: **T1-A-E3**, **T1-B-E3**, **T2-B-E2**, **T3-A-E3**, **T3-B-E3**, **T4-A-E1**
- Soften mild E2 over-spec: **T2-A-E2** instruction (no full ylabel literal)
- Title soft floor: **T3-A-E3**, **T4-B-E1**
- Optional I Do retro self-check: **T1-B-DEMO**, **T3-A-DEMO**

### Leave unchanged unless batching
- All I Do units with **Strong** scores (T1-A, T2-A, T2-B, T3-B, T4-A, T4-B demos)
- We Do: T2-A-E3, T4-B-E3, and other **Strong/Adequate** units without proposed residual
- You Do entire shell
- **All `starterCode` / `solutionCode` / `output`** unless execute-and-diff later justifies a bugfix

---

## Residual risks
- **Historical id/filename** (`databases-orm` / `s19-databases-orm.ts`) vs title “Viz accesible”: orchestration confusion only; do not rename id in this campaign without routing plan.
- **Matplotlib/Agg dependency** in T2 We Do: environment risk, not prose; Fixer must not change outputs without re-run.
- **Exact-output labs** (tooltips, JSON, pie strings): when de-spoiling E2 instructions, keep success criteria in **preamble**, not in freestyle answers — graders depend on canonical strings.
- **Bulk length chasing:** expanding every 4-bullet preamble to 80+ prose words would bloat and risk template smell — **forbidden**. Only expand retros/feedback where role or checklist fails.
- **E1 formula spoilers** (T1-B-E1, T1-A-E1): acceptable for guided tier; do not “independent-ize” E1.
- **No generators** in the Fixer pass; hand-edit only the P1 set first, then selective P2.

---

## Fixer handoff (resumen operativo)
- **No editar** en Round 2 Review (este archivo es solo diagnóstico + prosa residual).
- Priorizar los **4 P1** arriba; luego P2 cortos en feedback/retro/title.
- No tocar outputs ni solutions salvo bug real de ejecución.
- Validar es-PE, sin PII real, longitudes solo donde se reescriba, sin generadores.
- Al cerrar: re-leer cada unidad tocada y confirmar feedback ≠ retrospective.

---

Section 19 exercise pedagogy review complete. Ready for the Fixer prompt.
