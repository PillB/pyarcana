# S13 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Familiarity Evidence Dashboard y cierre de nivel
- **id:** `rpa-automation` (index 13; archivo histórico `s13-rpa-automation.ts` — contenido es evidencia de familiaridad / ER N1 + CF-1, no RPA de browser)
- **source file:** `src/lib/course/sections/s13-rpa-automation.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A normalización/blocking/ER · T1-B precision/recall/cola clerical · T2-A señales de relación · T2-B graphlet txs · T3-A ficha/uncertainty · T3-B umbrales/ops · T4-A dashboard/mapa · T4-B CF-1/ops/regresión
- **live:** https://pillb.github.io/pyarcana/

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length targets, preamble/retrospective checklists, E1→E2→E3 fade, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Used Round-1 report only as historical context — **not** as acceptance proof
- Scored residual quality for a true newbie (what / why / success / what sticks), not mere field presence
- No bulk generation; no source edits in this round

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| You Do has `retrospective` | **Met** |
| E1→E2→E3 fade preserved in *code* (guided / independent / transfer) | **Met** |
| Tasks, starters, solutions, outputs, `# DEFECT:` largely intact | **Met** |
| Story alignment (CASO-LIM-013, Lima/Cusco, scores separados, sin `is_family`/`auto_fraud`, CF-1, regresión S01–S13) | **Met** |
| “Concepto: S13-T…” drill template removed from instructions | **Met** (pasos de tarea) |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: feedback↔retrospective role collapse on many units (especially ethics/policy E3s), one hard independent spoiler, short retrospectives under the 40-word soft floor, and thin feedback on a few mechanical units.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Feedback ≈ retrospective** | Same opening idea in both fields: T1-A-E2/E3, T1-B-E2/E3, T3-A-E3, T3-B-E3, T4-A-E3, T4-B-E1/E3; near-duplicates on T2-A-E2 | Feedback does not repair *reasoning*; retro does not close metacognition | **P1** (policy/ethics pairs) · **P2** (resto) |
| **Independent instruction spoiler** | `S13-T2-B-E2` step 1: “El starter usa `\|` — cámbialo a `&`” is the full patch | E2 stops being judgment; becomes one-character paste | **P1** |
| **Mild E2 breadcrumb over-spec** | `S13-T1-B-E2` gives full `low <= score <= high` in step 1; `S13-T3-A-E2` gives full if-order | Acceptable if fade is still real in starter; prefer goal+bounds | **P2** |
| **Short We Do `retrospective`** | Most ~20–33 words (spec soft floor 40–80); worst: T3-A-E3 ~20 w, T2-B-E1 ~23 w | Principle/misconception/transfer often present but compressed | **P2** (expand only collapsed pairs + units missing a checklist item) |
| **Thin We Do `feedback`** | Under ~25 w: T2-A-E1, T2-B-E1, T2-B-E2, T3-A-E1, T4-B-E3 | Corrective loop thin for deliberate practice | **P2** |
| **I Do `why` / retro soft floor** | Several `why` ~27–38 w; retros T1-B/T2-A/T3-A ~22–27 w | Demos usable; optional thicken on densest concepts | **P2** (optional) |
| **Hints telegraphic / mixed register** | Many one-liners (`re.sub…`, `set equality…`); functional but thin PE | Progressive scaffold weak | **P2** (only if batching) |
| **Title soft floor** | `S13-T4-B-E1` “Privacy sheet synthetic_only” (~3 words) | Minor UI header shortness | **P2** |
| **You Do shell** | context/objectives/requirements/rubric/oracle + retrospective present | Strong defense frame; no residual required | **—** |
| **Exact test strings** | E3 disclaimers, demo cmd, level1_regression, fp_not_fraud | Fixer must not “polish” solution strings | residual risk — **keep** |

**Section severity theme (Round 2):** shell is solid; **P1** only where learning integrity is at risk (feedback/retro collapse on gate ethics, E2 set-operator spoiler). Most of the rest is **P2 polish**.

Scoring key for residual quality (true newbie):
- **Strong** — checklist solid; lengths OK; no spoiler; misconception + transfer clear; feedback ≠ retro
- **Adequate** — usable; small nits only
- **Needs residual** — spoiler, role collapse, missing piece for newbie, or clear length/role failure

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

## Unit ledger

### I Do

### S13-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** (~38 w) · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (output) · constraints pass · retrospective pass
- **Diagnosis:** R1 prose landed. Newbie predicts `block` / `match` / score; materno misconception is explicit. `why` just under soft floor but already names auditability + score separation.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S13-T1-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Adequate** (short ~24 w)
- **Checklist:** all pass; retro is bridge-heavy, light on self-check
- **Diagnosis:** Precision/cola scene is clear. Optional: one self-check on FP≠fraude in retro — not required if We Do E3 already hammers it.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Si puedes decir por qué un score 0.55 no debe auto-aceptarse, ya internalizaste human-in-the-loop. Un FP es colisión de matching, no delito. Pregunta de auto-chequeo: ¿precision 1.0 borra los FN de la cola? We Do: formulas precision/recall, cola inclusive y reporte ético `fp_not_fraud`.
- **Code/output changes:** none

### S13-T2-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Adequate** (~27 w)
- **Diagnosis:** Canónico 0.5/0.3/0.2 + `kinship_verdict=None` are explicit. No integrity issue.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S13-T2-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** (~28 w) · retrospective **Adequate**
- **Diagnosis:** “Evidencia, no acusación” is clear; `via` / `collusion_claim False` are prediction targets.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S13-T3-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Needs residual** (short ~22 w; light on misconception)
- **Diagnosis:** Prediction of gap |0.88−0.45| vs high is excellent. Retro only bridges to We Do without restating “no maquillar”.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Si puedes recalcular 0.708 a mano y decir por qué falta `email` pone uncertainty en med (no high), confías en la ficha. El error clásico es esconder missing o maquillar el score. We Do: plantilla de tres bullets, bandas low/med/high y caso conflictivo ER vs REL sin cosméticos.
- **Code/output changes:** none

### S13-T3-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Adequate**
- **Diagnosis:** Cascada invalid → high → abstain → review → accept is explicit; 0.85/high no-accept is a strong watch target.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S13-T4-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Strong**
- **Diagnosis:** CASE-2 as “ER medio / REL alto sin parentesco” is good reviewer literacy. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S13-T4-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate**
- **Diagnosis:** CF-1 package + `demo_writes_course_progress False` are clear. No residual required.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T1-A

### S13-T1-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (short ~29 w)
- **Checklist:** all pass for guided tier
- **Diagnosis:** Defect named without pasting the full `re.sub` line as one blob; feedback explains *when* it hurts (ER lies even if blocking is right). Retro could name empty-string/doc punctuation misconception more explicitly — optional.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Normalizar *antes* de comparar es el 80 % del ER por reglas: casefold + colapsar espacios + doc solo alfanumérico. El error clásico es `strip` solo o dejar `D-12.34` “bonito”. El mismo hábito aplica a emails y teléfonos en T2. Siguiente: armar la clave de blocking paterno|región.
- **Code/output changes:** none (starter `print('ok', True)` may be harness-ignored; leave outputs as-is)

### S13-T1-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · feedback **Needs residual** (role collapse with retro) · retrospective **Needs residual**
- **Diagnosis:** Feedback and retrospective open with the same “Blocking no es veredicto…” idea. Instruction still names `parts[1]` (contract breadcrumb — OK for N1; not a one-line paste of the full function).
- **Severity:** P1 (role collapse)
- **Proposed residual `feedback` (full text):**  
  Si la salida es el nombre completo o `soto|cusco`, estás usando el string crudo o el materno (último token). En nombres sintéticos N1 el paterno es el **segundo** token; sin casefold en región tampoco matcheas el fixture de la demo.
- **Proposed residual `retrospective` (full text):**  
  Blocking no es veredicto de identidad: solo reduce el espacio de pares. Confundir paterno con materno rompe el contrato N1 del memo y desalineas el dashboard con el I Do. Pregunta de auto-chequeo: ¿qué clave sale con un solo token de nombre? Siguiente: combinar doc + bloque en score 1.0/0.5/0.0.
- **Code/output changes:** none

### S13-T1-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual**
- **Diagnosis:** Transfer cascade is clear; feedback and retro both start from “score de tres niveles documenta…”. Need split: feedback = diagnostic of always-1.0; retro = principle + bridge to PR.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si los tres pares imprimen `1.0`, no estás mirando `same_doc` y `same_block` por separado. Doc igual + bloque distinto debe ser 0.5 (migración/error de región), no auto-match; doc distinto es 0.0 aunque el nombre se parezca.
- **Proposed residual `retrospective` (full text):**  
  Un score de tres niveles documenta *por qué* un par es dudoso sin inventar parentesco ni fraude. Es identidad estimada en el fixture. En T1-B medirás si la regla ayuda con precision/recall y empujarás la banda gris a la cola clerical.
- **Code/output changes:** none

---

### We Do · T1-B

### S13-T1-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Feedback already repairs inverted-denominator reasoning. Solid guided unit.
- **Severity:** optional P2 (retro length only)
- **Proposed residual `retrospective` (full text):**  
  Métricas simples bastan para N1 si son correctas y auditables. El error clásico es confiar en «accuracy alto» sin TP/FP/FN, o invertir denominadores bajo presión. En alto riesgo priorizas precision y empujas duda a la cola. Siguiente: la cola clerical de la banda gris.
- **Code/output changes:** none

### S13-T1-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (mild spoiler) · feedback **Needs residual** (≈ retro) · retrospective **Needs residual**
- **Diagnosis:** Step 1 gives the full corrected predicate. Feedback/retro share “Human-in-the-loop es un filtro de banda…”.
- **Severity:** P1 (collapse) · P2 (instruction fade)
- **Proposed residual `instruction` (full text):**  
  1. El starter encola la banda de accept (`score >= high`) — ese es el DEFECT.  
  2. Cambia el filtro a la **banda de duda** inclusiva definida en la meta (low…high).  
  3. Conserva el orden de aparición de `pairs`.  
  4. Imprime la lista de ids; no borres P1–P4.
- **Proposed residual `feedback` (full text):**  
  Si ves `['P4']` o `['P3','P4']`, estás encolando accept o el borde alto mal. Si falta `P3` (0.7), el bound no es inclusive. La cola es para duda humana, no para celebrar scores altos.
- **Proposed residual `retrospective` (full text):**  
  Human-in-the-loop es un **filtro de banda**, no «todo lo alto». Encolar accept desperdicia al revisor; ignorar 0.7 pierde el borde que el humano debe ver. Siguiente: unir métricas y límites éticos en un mismo report (FP ≠ fraude).
- **Code/output changes:** none

### S13-T1-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual**
- **Diagnosis:** Highest-stakes ethics unit of T1. Feedback and retro both open with “El artefacto de gate une número y límite ético”. Exact disclaimer string must stay in solution.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si precision/recall siguen en 0.0, no calculaste desde tp/fp/fn. Si `ops_action` queda `auto_fraud` o el texto dice que el FP «implica delito», estás convirtiendo un error de matching en acusación — el harness y el revisor de portfolio lo rechazan.
- **Proposed residual `retrospective` (full text):**  
  El artefacto de gate une **número** y **límite ético** en el mismo reporte. Tratar FP como fraude es el error más grave de N1. Pregunta de auto-chequeo: ¿qué `ops_action` defiendes en la demo si hay un FP? En T2 practicarás señales de relación con el mismo espíritu: señal ≠ parentesco.
- **Code/output changes:** none — **do not** rephrase solution disclaimer strings

---

### We Do · T2-A

### S13-T2-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** (~23 w, just thin) · retrospective **Adequate**
- **Diagnosis:** Empty-string defect is well taught. Feedback already names “ausencia de dato”.
- **Severity:** optional P2
- **Proposed residual `feedback` (full text):**  
  Dos vacíos iguales no son un contacto real: son ausencia de dato. Si no filtras `''` o no haces casefold, inflas señales (`True` espurio) y engañas la ficha del revisor aunque el email “parezca” match.
- **Code/output changes:** none

### S13-T2-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** (variante etiquetada) · instruction **Adequate** · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Variante 0.6/0.4 is honestly labeled vs canónico — keep that. Feedback and retro both stress “pesos documentados” but are not pure clones; still room to differentiate.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Si ambos casos imprimen `0.5`, ignoraste km y solo devolvistes el jaccard. Si `km=5.0` no baja el score, el término geo no está en cero. Esta es **variante de práctica**, no el canónico 0.5/0.3/0.2 de la ficha.
- **Proposed residual `retrospective` (full text):**  
  Pesos documentados permiten auditar el score; confundir variante de práctica con canónico de producto rompe el memo del curso. El revisor debe poder decir *qué* pesos usaste. Siguiente: score canónico de tres señales + disclaimer de no parentesco.
- **Code/output changes:** none

### S13-T2-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Feedback (score+disclaimer together / wrong kinship claim) already differs from retro (UI lies by omission → T2-B). Good ethics transfer.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none — keep exact disclaimer text

---

### We Do · T2-B

### S13-T2-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** (guided may name set equality) · feedback **Adequate** (~21 w) · retrospective **Needs residual** (short ~23 w)
- **Diagnosis:** Solid guided symmetry lesson. Retro is bridge-only.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  El patrón de sets de endpoints modela el **par**, no la dirección del wire. El error clásico es filtrar solo A→B y perder B→A en la ficha. Reaparece en tests de grafo y en el You Do. Siguiente: contrapartes comunes por **intersección** de vecinos (no unión).
- **Code/output changes:** none

### S13-T2-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (**spoiler**) · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Step 1 literally says change `|` to `&` — the entire solution. Independent tier fails.
- **Severity:** P1
- **Proposed residual `instruction` (full text):**  
  1. El starter arma un conjunto de vecinos “demasiado amplio” — lee el DEFECT y el resultado esperado.  
  2. Reutiliza `neighbors` del starter.  
  3. Devuelve solo nodos que son vecinos de **ambos** extremos; ordena con `sorted`.  
  4. Imprime el resultado para A y C (no inventes nodos).
- **Proposed residual `feedback` (full text):**  
  Si la lista incluye E y F, usaste unión (o listaste todo lo tocado por A o C). Intersección responde *quién es puente entre ambos* — ese es el `via` de la ficha. No hardcodees `['D']`.
- **Proposed residual `retrospective` (full text):**  
  Common counterparty es traza operativa, no cartel. El error clásico es unión o hardcodear `via` sin calcular. Pregunta de auto-chequeo: ¿qué imprime si A y C no comparten nodos? Siguiente: adjuntar disclaimers de no colusión/no parentesco al objeto de evidencia.
- **Code/output changes:** none

### S13-T2-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Feedback (acusación) vs retro (someone completes the accusation if only `via`) already differentiated. Keep exact disclaimer strings.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do · T3-A

### S13-T3-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Missing-bullet defect is clear; feedback and retro share “esconder missing” slightly but are usable.
- **Severity:** optional P2
- **Proposed residual `feedback` (full text):**  
  Si la lista tiene len 2, omitiste `missing`. El revisor confía en un score incompleto cuando no ve `phone`/`email` ausentes. No reformatees los nombres de claves del f-string.
- **Code/output changes:** none

### S13-T3-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (order given — mild for complex band) · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Feedback already diagnoses wrong if-order. Order in instruction is acceptable for multi-branch independent; optional fade of step 2.
- **Severity:** optional P2
- **Proposed residual `instruction` (full text):**  
  1. Reemplaza el return fijo `"low"`.  
  2. Implementa la cascada de la meta: conflicto y/o muchos missing elevan la banda; un missing eleva a med; vacío y sin conflicto → low.  
  3. Imprime los cuatro casos del starter.  
  4. No cambies los argumentos de prueba.
- **Code/output changes:** none

### S13-T3-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual** (short ~20 w)
- **Diagnosis:** Both open with “Explicación honesta > score cosmético”. Critical honesty unit for the ficha.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si uncertainty queda en `low` o la note dice `ok`, no detectaste `|er−rel| > 0.5`. El score 0.58 puede “verse normal”; sin high + note de conflicto el revisor no ve la tensión 0.9 vs 0.1.
- **Proposed residual `retrospective` (full text):**  
  Explicación honesta > score cosmético: no suavices hacia 0.5 ni escondas el gap. La ficha debe hacer visible la tensión ER vs REL. En T3-B traducirás score+uncertainty a estados operativos sin `auto_fraud` ni `is_family`.
- **Code/output changes:** none

---

### We Do · T3-B

### S13-T3-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Inverted thresholds + assert is excellent guided pedagogy. Feedback already explains inverted intervals.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S13-T3-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** (dense cascade OK for 7-row matrix) · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Heart of ops policy. Feedback diagnoses high-over-score and NaN/`isfinite`; retro bridges to You Do matrix. Leave cascade detail — complexity warrants it.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none — preserve exact 7-line output

### S13-T3-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual**
- **Diagnosis:** Both open with “Política N1 se demuestra en código…”. Split: feedback = leftover keys; retro = portfolio grep / CF-1 bridge.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si `sorted(keys)` aún muestra `is_family` o `auto_fraud`, copiaste el dict sin filtrar. `pop` o un set `forbidden` deben dejar solo lo permitido (`score`, `status` en este fixture). Un status correcto no salva claves prohibidas.
- **Proposed residual `retrospective` (full text):**  
  Política N1 se demuestra en código ejecutable, no solo en el README. El mismo checklist de “grep de portfolio” aparece en el You Do y en CF-1. En T4 pasarás a UI pseudonimizada y artefactos de ops (privacy, demo, incidente).
- **Code/output changes:** none

---

### We Do · T4-A

### S13-T4-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Feedback (privacy fail if full name) already differs from retro (helper → You Do). Good.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S13-T4-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (short; names canonical keys — OK as contract) · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Anti-pattern `er`/`rel` + `is_family` is well framed. Instruction is goal-like enough for independent.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S13-T4-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual**
- **Diagnosis:** Both open with “Tooltip sin source no se audita…”. Split provenance vs bridge to T4-B.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si la línea solo tiene lat/lon, faltan `geo_distance_km` y `source`. Sin `source=mock` el revisor no distingue geoseñal de curso de un egress real a geocoder público (política S12).
- **Proposed residual `retrospective` (full text):**  
  Provenance en el tooltip cierra el puente S12→S13: el mapa es auditable, no decorativo. En T4-B cierras el nivel con privacy sheet, demo de un comando y playbook de incidente + regresión S01–S13.
- **Code/output changes:** none — keep exact format string

---

### We Do · T4-B

### S13-T4-B-E1 (weDo · guided)
- **Scores:** title **Adequate** (short; optional expand) · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Needs residual**
- **Diagnosis:** Feedback and retro both open with “Privacy sheet es artefacto…”. Core CF-1 unit.
- **Severity:** P1
- **Proposed residual `title`:** Privacy sheet: synthetic_only y pii_real
- **Proposed residual `feedback` (full text):**  
  Si imprimes `True` o `data_class` es `production`, no corregiste el DEFECT. CF-1 exige `synthetic_only` + `pii_real=False` + roles viewer/reviewer; un score “bonito” no compensa privacy roto.
- **Proposed residual `retrospective` (full text):**  
  Privacy sheet es artefacto de gate, no un print decorativo. Si `pii_real` queda True, el portfolio N1 se rechaza. Pregunta de auto-chequeo: ¿qué roles listas en el sheet? Siguiente: el comando de demo reproducible con `--synthetic`.
- **Code/output changes:** none

### S13-T4-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Feedback (`--live-pii` is CF-1 fail) already differs from retro (reproducibility friction). Good independent.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none — exact cmd string

### S13-T4-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (≈ retro) · retrospective **Adequate** (already bridges You Do)
- **Diagnosis:** Both open with “Incidente y regresión forman parte del cierre N1…”. Exact regression line is a test contract.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si ves `ignore|continue` o `level1_regression: skip`, no implementaste el playbook. El orden fijo es rotate → redact → postmortem; el segundo print debe re-checkear S01–S13, no “saltar” la regresión.
- **Proposed residual `retrospective` (full text):**  
  Incidente y regresión forman parte del cierre N1: no basta con que el dashboard “corra otra vez”. En el You Do ensamblas ER, REL, matriz de decisión, privacy y las 13 filas de regresión en un solo entregable que puedas defender en el gate.
- **Code/output changes:** none — keep exact action order and regression string

---

### youDo (You Do)

### youDo
- **Scores:** context **Strong** · objectives/requirements/rubric **Strong** · starter DEFECTS **Strong** · retrospective **Strong** (~72 w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Diagnosis:** Defense triad (invariants / real vs synthetic / 30s impact phrase) is already present. Starter order 1–4 and oracles (er=1.0, rel=1.0, pseudo, 9-row matrix, 13-row regression) are coherent. No residual required.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

## Priority order

### P1 (Fixer first — learning integrity)
1. **Split feedback vs retrospective** on collapsed ethics/policy units (hand-write both fields; do not only expand one):  
   - `S13-T1-A-E2`, `S13-T1-A-E3`  
   - `S13-T1-B-E2`, `S13-T1-B-E3`  
   - `S13-T3-A-E3`  
   - `S13-T3-B-E3`  
   - `S13-T4-A-E3`  
   - `S13-T4-B-E1`, `S13-T4-B-E3`
2. **Defuse independent spoiler:** `S13-T2-B-E2` instruction (do not say “change `|` to `&`”; state “both ends share the neighbor”).
3. **Mild E2 fade:** `S13-T1-B-E2` instruction (band of doubt without pasting the full predicate if easy).

Suggested Fixer wave (story dependency, P1 first):  
**T1-A-E2/E3 → T1-B-E2/E3 → T2-B-E2 → T3-A-E3 → T3-B-E3 → T4-A-E3 → T4-B-E1/E3**

### P2 (polish if batching)
- Expand short retrospectives that miss misconception or transfer only where still thin after P1 edits  
- Optional I Do retro thicken: T1-B, T3-A  
- Optional feedback thicken: T2-A-E1, T2-B-E1, T3-A-E1  
- Optional: `S13-T4-B-E1` → “Privacy sheet: synthetic_only y pii_real”  
- Optional instruction fade: T3-A-E2 cascade wording  
- Hints: slightly more PE progressive language (only if touching the unit anyway)

### Leave unchanged (no residual required)
- All 8 I Do preambles (usable as-is)  
- We Do already differentiated: T1-B-E1, T2-A-E3, T2-B-E3, T3-B-E1, T3-B-E2, T4-A-E1, T4-A-E2, T4-B-E2  
- youDo entire shell + retrospective  
- **All** starter/solution outputs and exact ethical/test strings unless execute-and-diff proves a bug

---

## Residual risks

1. **Role collapse returns if Fixer “expands both fields with the same paragraph.”** Feedback = diagnostic of *this* anti-pattern; retrospective = principle + misconception + transfer.  
2. **Exact test strings:** `fp_not_fraud` text, relationship/collusion/kinship disclaimers, demo cmd, incident actions, `level1_regression` line, 7-row decide_ops output. Preamble/retro may paraphrase; **solutionCode must not**.  
3. **Variante vs canónico (T2-A-E2):** keep “variante 0.6/0.4” labeling; do not “unify” to 0.5/0.3/0.2 in that unit.  
4. **Id vs content:** file/id `rpa-automation` still misnames Evidence Dashboard — out of scope for exercise-prose Fixer; confuses agents.  
5. **Starter `print('ok', True)`:** still present on many weDo starters; do not “clean” unless harness requires it.  
6. **Anti-aberration:** rewrite only the units listed; no section-wide template paste of feedback/retro shells.

---

## Counts summary for Fixer

| Block | Units | Shell after R1 | Round-2 residual focus |
|-------|-------|----------------|------------------------|
| iDo | 8 | preamble+retro present | optional retro T1-B, T3-A |
| weDo | 24 | title+preamble+instruction+retro present | ~10 P1 feedback/retro splits + 1–2 instruction fades |
| youDo | 1 | retrospective present | none |
| **Code/output** | — | intact | **none required** |

---

Section 13 exercise pedagogy review complete. Ready for the Fixer prompt.
