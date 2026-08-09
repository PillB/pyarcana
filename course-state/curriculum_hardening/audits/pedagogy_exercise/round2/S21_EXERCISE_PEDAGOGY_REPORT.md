# S21 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Documentos, plantillas y reportes trazables
- **shortTitle:** Reportes trazables
- **id:** `fastapi` (archivo histórico `s21-fastapi.ts`; contenido = Reporting Factory Jinja/DOCX/PDF/narrativa/provenance, **no** APIs HTTP)
- **index:** 21
- **source:** `src/lib/course/sections/s21-fastapi.ts` (re-leído **después** del fix Round-1)
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A Jinja/context · T1-B condiciones/tablas/missing · T2-A DOCX real · T2-B PDF digital/render/OCR · T3-A narrativa H→evidencia · T3-B paridad/captions/límites · T4-A fmt_pen/a11y · T4-B provenance/checklist/aprobación
- **hilo:** CASO-LIM-021 / cierre **CP-N2-B** (ticket mediano Lima 28.0 PEN, n=40, cobertura web-only; paridad dash/xlsx/doc; datos sintéticos Lima–Cusco sin PII; puente a email/aprobación S22)
- **Round 1 context:** `round1/S21_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (roles de campo, longitudes, checklists preamble/retrospective, fade E1→E3, anti-aberration).
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source: title, preamble, instruction, feedback, retrospective, starter DEFECT, solution/output, why.
- Scored residual quality for a **true newbie** (what / why / success / what sticks) — field *presence* alone is not acceptance.
- Word counts measured only as gates (no generators of prose). Round-1 used only to avoid re-diagnosing the old “zero shell” crisis.
- **No** source edits in this round. Hand-crafted residual proposals only.

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8); `why` now ~46–63 words (in floor) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do `instruction` is ordered steps (not “Concepto + fixture” essay) | **Met** |
| You Do has `retrospective` | **Met** (~84w, defense triad) |
| E1→E2→E3 fade preserved (surfaces, not number clones) | **Met** |
| Starters, solutions, canonical outputs intact | **Met** (no execute-and-diff needed) |
| Spanish PE; synthetic ids; no real PII | **Met** |
| Hint spoiling from R1 (T1-B-E2 hard value) | **Improved** (hint 2 now “compara con el test”) |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no missing-field crisis**. Residual work is **quality**: short retrospectives (section-wide under the 40–80 floor), feedback↔retrospective echo, transfer-hint spoiling, thin feedback on a few drills, and one title under the 4-word floor.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **We Do retrospectives short** | 23/24 under 40w (measured ≈15–37; only T4-B-E3 ≈40); many stop at “principio + puente” without misconception explícito o self-check | Metacognition thin; learner closes tab without a sticky self-test | **P1** (section theme: expand worst 12–14; not every unit needs a novel essay) |
| **I Do retrospectives short** | 7/8 under 40w (T1-B 29, T2-A 25, T2-B 22, T3-A 27, T3-B 20, T4-A 29, T4-B 22); T1-A 46 is better | Demo → We Do bridge exists, but “misconception repaired” is often one clause | **P2** (expand the thinnest 4–5) |
| **Feedback ≈ retrospective** | Worst pairs: **T4-B-E2** (near-verbatim), **T2-B-E2**, **T3-B-E1**, **T1-B-E2/E3**, **T4-A-E1** | Deliberate-practice loop collapses; retro loses distinct job | **P1** on worst pairs / **P2** elsewhere |
| **E3 transfer hint spoiling** | T3-B-E3 / T4-A-E3 / T4-B-E3 hints give the full `return` expression | Transfer becomes “type the hint” not judgment | **P1** (those three) |
| **Feedback under 25w** | T1-B-E2 ≈23, T1-B-E3 ≈24, T2-A-E2 ≈22, T2-B-E2 ≈22, T2-B-E3 ≈18, T3-A-E2/E3, T3-B-E1/E3, T4-A-E1/E2, T4-B-E1/E2 | Corrective loop thin | **P2** (expand when also touching retro) |
| **Title under floor** | T4-B-E3 `ready(checklist) con all()` = 3 words | Minor header polish | **P2** |
| **We Do preambles** | 4-bullet format; many ≈39–65w total (spec allows 4 bullets) | True newbie can answer what/why/success | **Pass** (no residual required for structure) |
| **You Do** | Frame + dict contract + retrospective of defense **strong** (~84w); portfolioNote links to retro | No P0/P1 | — |
| **Code/outputs** | Coherent with theory and CP-N2-B mini-contract; ASCII `sintetico` intentional | Do **not** change pass outputs | — |

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

### S21-T1-A-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** (~76w) · why **Strong** (~63w) · retrospective **Strong** (~46w)
- **Checklist:** context pass · goal pass · success pass (predice cadena) · constraints pass (no escribas aún) · retrospective pass
- **Diagnosis:** R1 prose landed. Context único, “nada se calcula en el template”, misconception “armar string a mano y olvidar n” are clear. Output gate intact.
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S21-T1-A-E1 (weDo, guided) — **B**
- **Scores:** title **Strong** · preamble **Strong** (4 bullets) · instruction **Strong** · feedback **Strong** (~34w) · retrospective **Needs residual** (~29w)
- **Checklist:** all pass structure; retro partial (short, light self-check)
- **Diagnosis:** Model guided unit. DEFECT portada sin n well named. Feedback already anchors StrictUndefined + comité. Retro is two sentences — missing self-check.
- **Severity residual:** P1 (retro length/metacognition)
- **Proposed retrospective (replace):**  
  Portada = identity del caso + n visible. Sin n, el revisor no reconcilia con el EDA ni con el Excel de S20. El error clásico es imprimir un f-string “bonito” fuera de Jinja y creer que ya hay plantilla. Pregunta: si la portada dice solo “CASO-LIM-021 · Lima”, ¿qué falta para auditar la muestra? Siguiente (E2): un KPI con mediana y n en la misma plantilla.
- **Code/output changes:** none

### S21-T1-A-E2 (weDo, independent) — **A− / B+**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **Adequate** (~37w, near floor, has self-check)
- **Checklist:** all pass; retro borderline length but roles complete
- **Diagnosis:** Independent fade correct. Self-check “¿qué falla si DOCX 28 y Excel n=32?” already sticky. No forced rewrite.
- **Severity residual:** P2 optional (could add one clause on unidad PEN)
- **Proposed residual:** none required
- **Code/output changes:** none

### S21-T1-A-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong (matiz n=18 vs n=40 **conservado**) · instruction Strong · feedback Strong · retrospective **Needs residual** (~33w)
- **Checklist:** all pass structure; retro partial (no self-check)
- **Diagnosis:** Authentic transfer to `render_kpi` + another context. Feedback and retro both restate “otro context / no paridad Lima” — mild eco; retro needs sticky question.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Centralizar el template evita que cada autor invente su string de KPI. n=18 es **otro context** (Cusco), no un bug de paridad del paquete Lima n=40. Pregunta: si hardcodeas “Cusco” fuera del dict, ¿qué pasa al reutilizar la función en Lima? Puente a T1-B: cuando el valor falta, no inventes 0 — usa em-dash.
- **Code/output changes:** none

---

### S21-T1-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong (~69w) · why Strong · retrospective **Needs residual** (~29w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial
- **Diagnosis:** Missing vs 0 framing is excellent. Retro names the principle but rushes the We Do bridge without a sticky self-check.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Missing se declara; no se inventa. El em-dash es el contrato visual del lab y debe cuadrar con el workbook. Si puedes decir por qué “0.00” engaña al comité sin mirar el código, ya tienes el hábito. Pregunta: ¿qué total se distorsiona si Cusco sin dato entra como 0? We Do: celda missing, formato `.2f` y bucle de filas.
- **Code/output changes:** none

### S21-T1-B-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~28w)
- **Checklist:** all pass structure; retro under floor
- **Diagnosis:** DEFECT `print(None)` excellent. Feedback already has comité + totales. Retro restates without self-check.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  El comité lee 0 como hecho medido, no como “no medimos”. Missing honesto protege totales, promedios y la paridad con el Excel. El error clásico es rellenar con cero “para no romper la tabla”. Pregunta: ¿imprimir `"None"` como texto es mejor o igual de malo? Siguiente (E2): formatear un número real a dos decimales sin redondeo a ojo en Word.
- **Code/output changes:** none

### S21-T1-B-E2 (weDo, independent) — **B** / **C** on eco
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~23w) · retrospective short (~34w) + **eco** with feedback (“Formatea en Python…”)
- **Diagnosis:** Independent fade OK; R1 spoiler on hint value was fixed. Feedback and retro share the same spine — retro must pivot to precision tiers (2 vs 1 decimal) + self-check.
- **Severity residual:** P1 (eco + retro role)
- **Proposed feedback (replace):**  
  Si ves `28.456` crudo o `28.5`, no usaste formato a 2 decimales. El redondeo “a ojo” en Word del autor rompe paridad con el workbook; el rastro debe ser auditable en código.
- **Proposed retrospective (replace):**  
  Formatear en Python (o con filtro Jinja explícito) deja un rastro que el revisor puede re-ejecutar. Aquí el detalle pide 2 decimales; en resúmenes ejecutivos a menudo usarás 1 decimal PEN (T4). Pregunta: ¿por qué hardcodear `"28.46"` falla el espíritu del drill aunque el print pase? Luego (E3): emitir filas con bucle Jinja.
- **Code/output changes:** none

### S21-T1-B-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback ~24w · retrospective ~33w + mild eco (fila/pipe)
- **Diagnosis:** Transfer to `{% for %}` is real. Feedback/retro both pivot on “una fila = una línea / no pipe”.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Una fila del context = una línea (o celda) de salida. Un string único con `|` no se reabre como tabla en el workbook. Pregunta: si `rows` crece a 10 regiones, ¿tu solución escala sin editar el template a mano? Puente a T2-A: materializar el mismo contrato en un DOCX real con headings y celdas.
- **Code/output changes:** none

---

### S21-T2-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~25w)
- **Diagnosis:** Disco + reabrir + PK framing solid. Retro lacks self-check on “negrita ≠ Heading”.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Evidencia = archivo reabierto, no el objeto en RAM. “Se veía bien en mi Word” no es audit. Pregunta: si `style.name` es `Normal` con negrita, ¿pasa la prueba de outline? We Do: outline con Resumen/n=40, conteo de Heading 1 y tabla con missing honesto.
- **Code/output changes:** none

### S21-T2-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~25w)
- **Diagnosis:** DEFECT paragraph-only starter excellent. Feedback already anchors disco vs memoria. Retro thin.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  El segundo `True True` solo es posible si el archivo guardado trae “Resumen” y `n=40`. Outline primero, prosa después; un dict en memoria no cierra CP-N2-B. Pregunta: ¿por qué basta `add_paragraph("Resumen")` para engañarte en pantalla pero no al revisor? Siguiente (E2): contar estilos Heading al reabrir.
- **Code/output changes:** none

### S21-T2-A-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~22w) · retrospective short (~22w)
- **Diagnosis:** Core misconception (paragraph vs heading) clear. Both fb and retro under floor; expand both without cloning.
- **Severity residual:** P1 (retro) + P2 (feedback floor)
- **Proposed feedback (replace):**  
  Si el conteo de Heading 1 es 0, el bucle sigue usando `add_paragraph`. Al reabrir, `style.name` debe ser `Heading 1`/`Heading 2`: el outline real habilita a11y y navegación del revisor.
- **Proposed retrospective (replace):**  
  Heading real = outline navegable y a11y; negrita visual = maquillaje. La evidencia sale del archivo reabierto, no del input del bucle. Pregunta: ¿cuántos Heading 1 esperas con Resumen y Anexos a nivel 1 y Método a nivel 2? Luego (E3): tabla de métricas con Reclamos como `—`, no 0.
- **Code/output changes:** none

### S21-T2-A-E3 (weDo, transfer) — **A− / B+**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~32w, has self-check)
- **Diagnosis:** High-value transfer (0 vs — in DOCX table). Self-check “¿qué decisión falsa si lee 0?” already good.
- **Severity residual:** P2 optional (could name “mismo contrato que Jinja” more as misconception)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S21-T2-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~22w)
- **Diagnosis:** Tres checks (capa / firma / PNG) well framed. Retro is almost only the needs_ocr bridge.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un PNG legible no prueba por sí solo que el PDF sea digital: hace falta extracción. Si la capa queda vacía, el contrato es `needs_ocr`, no inventar texto. Pregunta: ¿qué evidencia llevarías al manifiesto si solo tienes un PNG bonito? We Do: n=40 en capa, render PNG y caso imagen-only.
- **Code/output changes:** none

### S21-T2-B-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~25w)
- **Diagnosis:** DEFECT sin n en drawString clean. Mild eco (drawString/capa) between fb and retro; separate roles.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  `drawString` escribe la capa digital **antes** de `save()`; no se “arregla” después con un print True inventado. Sin n en el extract, el revisor no audita el paquete. Pregunta: ¿por qué hardcodear `print(True)` falla el espíritu aunque “pase” visualmente? Siguiente (E2): render de página a PNG con tamaño > 0.
- **Code/output changes:** none
- **Validation notes:** ASCII `sintetico` intentional — do not “fix” tildes on canvas.

### S21-T2-B-E2 (weDo, independent) — **C** (eco + thin retro)
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback ~22w · retrospective **~18w** + **high eco** with feedback
- **Diagnosis:** DEFECT no PNG is clear. Feedback and retro are near-paraphrases of “extracción vs PNG / archivos reales”. This is the worst eco cluster in T2.
- **Severity residual:** P1 (separate fb/retro + length)
- **Proposed feedback (replace):**  
  Si el segundo booleano es False, nunca creaste el PNG o no verificaste `st_size > 0`. La checklist visual del cierre CP-N2-B exige ver el informe, no solo confiar en que el path “suena bien”.
- **Proposed retrospective (replace):**  
  Extracción y render son pruebas distintas: una mira capa digital, la otra legibilidad. Ambas deben ser archivos reales en disco. Pregunta: ¿un PDF con `st_size > 0` y un PNG de 0 bytes cierra la checklist visual? Luego (E3): PDF solo-imagen y abstención `needs_ocr`.
- **Code/output changes:** none

### S21-T2-B-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~18w) · retrospective ~27w (has self-check)
- **Diagnosis:** Highest-value transfer in T2 (needs_ocr honesty). Feedback under floor; retro quality OK despite length.
- **Severity residual:** P2 (feedback) + optional retro expand
- **Proposed feedback (replace):**  
  Si `needs_ocr` queda False, o inventaste texto o agregaste `drawString`. Un PNG con “n=17” dibujado no es capa digital: abstente; no finjas PDF nativo ante el comité.
- **Proposed residual retrospective:** none required (keep self-check); optional minor expand only if touching the unit.
- **Code/output changes:** none

---

### S21-T3-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~27w)
- **Diagnosis:** Hallazgo ≠ decisión well framed. Retro lacks sticky self-check.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Hallazgo = claim + evidencia; decisión = humano en la cola (S22). Sin id de evidencia, el párrafo es eslogan. Pregunta: ¿“recomendamos subir precios” es hallazgo o decisión? We Do: dict H1, resumen con n=/PEN y `pack_report` de tres claves.
- **Code/output changes:** none

### S21-T3-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~23w)
- **Diagnosis:** DEFECT `decision: "subir precios"` is gold pedagogy. Retro thin.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Sin Tabla1, H1 no entra al paquete de aprobación. `decision=None` es honestidad de proceso, no timidez: el factory no aprueba pricing. Pregunta: si dejas `decision="subir precios"`, ¿qué riesgo corre el comité al leer el DOCX? Siguiente (E2): el resumen debe llevar `n=` y `PEN`.
- **Code/output changes:** none

### S21-T3-A-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback ~22w · retrospective ~24w + mild eco (eslogan/revisor)
- **Diagnosis:** Validation drill is clear. Expand retro with self-check; keep feedback on reconciliation.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Eslogan ≠ resumen auditable. El revisor busca `n=` y unidad en un vistazo para reconciliar con EDA/S20. Pregunta: ¿por qué `"mediana 28 pen"` con p minúscula puede fallar el test aunque “se entienda”? Luego (E3): empaquetar resumen, método y hallazgos en un solo dict.
- **Code/output changes:** none

### S21-T3-A-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~20w) · retrospective short (~25w)
- **Diagnosis:** Clean transfer (missing `metodo`). Both under floor.
- **Severity residual:** P1 (retro) + P2 (feedback)
- **Proposed feedback (replace):**  
  Si en las claves ordenadas no aparece `metodo`, el return del starter sigue incompleto. Sin método, el revisor no separa procedimiento de opinión en el paquete.
- **Proposed retrospective (replace):**  
  Tres claves = contrato de narrativa ejecutiva (resumen / método / hallazgos). Método documentado protege de “insights” opacos. Pregunta: ¿dónde meterías una recomendación de precios si no va en el hallazgo? Puente a T3-B: paridad numérica entre dash y doc más limitaciones visibles.
- **Code/output changes:** none

---

### S21-T3-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~20w) — thinnest iDo retro
- **Diagnosis:** Parity as equality of structures is clear. Retro is almost only a We Do list.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un solo número, tres superficies: si el PNG dice 28 y el DOCX 30, el factory ya falló antes de hablar de diseño. Paridad no es “se ve similar”. Pregunta: ¿basta alinear dash y xlsx si el doc diverge? We Do: alinear dash/doc + “solo web”, captions con Fuente, y `check_parity` a tres vías.
- **Code/output changes:** none

### S21-T3-B-E1 (weDo, guided) — **C** (eco)
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback ~21w · retrospective ~20w + **same opening spine** (“Paridad sin límites es incompleta”)
- **Diagnosis:** Double DEFECT (27.0 + limits vacía) excellent. Feedback and retro must stop cloning.
- **Severity residual:** P1 (eco + length)
- **Proposed feedback (replace):**  
  Si el primer booleano es False, `doc["median_Lima"]` sigue en 27.0 (redondeo a mano). Si el segundo falla, `limits` no incluye el string exacto `"solo web"`: el lector no ve la cobertura.
- **Proposed retrospective (replace):**  
  Paridad y límites viajan juntos: números reconciliados sin cobertura visible aún engañan al comité sobre la muestra web-only. Pregunta: ¿qué malinterpreta el lector si ve 28.0 sin “solo web”? Siguiente (E2): caption de figura con campo Fuente visible.
- **Code/output changes:** none

### S21-T3-B-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback ~23w · retrospective short (~24w)
- **Diagnosis:** Caption/Fuente drill clear. Retro needs self-check.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Caption = puente visual al dataset. Sin `Fuente`, el PNG es decoración y no se reconcilia con el factory. Pregunta: ¿basta poner solo `n=40` sin nombrar la fuente? Luego (E3): checksum a tres artefactos con `a == b == c`.
- **Code/output changes:** none

### S21-T3-B-E3 (weDo, transfer) — **B** / **C** on hint spoil
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~16w) · retrospective ~22w (has self-check) · **hints = full solution**
- **Diagnosis:** Transfer is correct. Hint 1 is literally `return a == b == c.` — spoils transfer judgment.
- **Severity residual:** P1 (hints) + P2 (fb/retro length)
- **Proposed hints (replace):**  
  1. La igualdad debe involucrar los **tres** argumentos, no solo los dos primeros.  
  2. Conserva los dos prints de prueba (caso alineado y caso divergente).
- **Proposed feedback (replace):**  
  Si el segundo print sale True con doc divergente, tu función sigue en `a == b`. El cierre CP-N2-B exige tres vías (dash, xlsx, doc).
- **Proposed retrospective (replace):**  
  Tres superficies, un número. Comparar solo dos deja “salvarse” al artefacto omitido. Pregunta: en un fallo real, ¿qué artefacto conviene listar primero en el reporte de discrepancia? Puente a T4-A: misma precisión decimal y a11y mínima.
- **Code/output changes:** none

---

### S21-T4-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~29w)
- **Diagnosis:** fmt_pen + a11y_min framing solid; mentions `all([])` in why. Retro thin on misconception.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Una función de formato + gate a11y = consistencia tipográfica y mínima inclusión. `has_h1` solo no basta: una lista vacía de alts aprueba por el truco de `all([])`. Pregunta: ¿por qué `28` y `28.0` se leen como dos métricas? We Do: round a 1 decimal, `fmt_pen` con unidad y `a11y_min` robusto.
- **Code/output changes:** none

### S21-T4-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong (short but complete) · feedback ~22w · retrospective ~20w + mild eco (0 decimales / contrato)
- **Diagnosis:** DEFECT `round(..., 0)` perfect. Separate fb (symptom) from retro (principle).
- **Severity residual:** P1 (retro) + P2 (feedback)
- **Proposed feedback (replace):**  
  Si imprimes `[28.0, 28.0]` con `round(v, 0)` “de casualidad” en este fixture, el bug sigue ahí: el contrato del lab es **1** decimal, no 0. Cambia el segundo argumento de `round`.
- **Proposed retrospective (replace):**  
  0 decimales “aplana” y rompe el contrato de 1 decimal PEN del factory en dash, Excel e informe. Pregunta: ¿qué pasa con 28.04 si redondeas a 0 decimales en un lote real? Siguiente (E2): encapsular redondeo + unidad en `fmt_pen`.
- **Code/output changes:** none

### S21-T4-A-E2 (weDo, independent) — **C** (thinnest We Do retro)
- **Scores:** title Strong · preamble Strong · instruction short · feedback thin (~18w) · retrospective **~15w** (section minimum)
- **Diagnosis:** DEFECT sin sufijo PEN is clear. Retro is one-and-a-half sentences — fails “what sticks”.
- **Severity residual:** P1 (retro + feedback floor)
- **Proposed feedback (replace):**  
  Si ves solo `28.0` sin unidad, el f-string no concatena ` PEN`. Sin formatter central, Jinja y Excel inventan “soles”, “PEN” o nada y el comité ve tres idiomas.
- **Proposed retrospective (replace):**  
  Formatter central = paridad tipográfica entre canales. El error clásico es formatear el número en un sitio y la unidad en otro. Pregunta: ¿qué imprime `fmt_pen(28.04)` si redondeas a 0 decimales y omites la unidad? Luego (E3): gate a11y que no se engañe con `all([])`.
- **Code/output changes:** none

### S21-T4-A-E3 (weDo, transfer) — **B** / **C** on hint spoil
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~23w) · **hint 1 = full formula**
- **Diagnosis:** Pedagogically gold (`all([])`). Hint gives the entire return expression — kills transfer.
- **Severity residual:** P1 (hints + retro)
- **Proposed hints (replace):**  
  1. Combina tres condiciones: H1, lista no vacía, y longitud útil en **cada** alt.  
  2. El caso de lista vacía debe fallar: no confíes solo en `all(...)` sobre una lista sin elementos.
- **Proposed retrospective (replace):**  
  `all([])` aprueba por vacío; por eso exiges `len(alts) > 0` además de la longitud de cada alt. `has_h1` solo no es a11y. Pregunta: ¿qué imprime el tercer print si olvidas el check de lista vacía? Puente a T4-B: provenance, huella y `ready` con `all()` sobre la checklist visual.
- **Code/output changes:** none

---

### S21-T4-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong (~86w) · why Strong · retrospective short (~22w)
- **Diagnosis:** Governance + pending_review framing excellent. Retro is a We Do teaser only.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `pending_review` es el estado honesto de cierre de contenido: el script no se autoaprueba. Un print “ok” no sustituye manifiesto ni archivos en disco. Pregunta: ¿quién pone `approved` y en qué sección del currículum? We Do: completar manifiesto, huella corta y `ready` con `all()` no `any()`.
- **Code/output changes:** none

### S21-T4-B-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback ~21w · retrospective short (~25w)
- **Diagnosis:** DEFECT `approved` hardcodeado is excellent. Expand retro with self-check.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Manifiesto sin `run_id` no es provenance. `pending_review` deja la puerta abierta a comentarios del revisor humano (S22); `approved` en código es fraude de proceso. Pregunta: ¿qué falta en un dict que solo tiene `artifacts` y status? Siguiente (E2): calcular la huella corta del payload de lab.
- **Code/output changes:** none

### S21-T4-B-E2 (weDo, independent) — **C** (near-verbatim eco)
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback ~20w · retrospective ~28w + **overlap ≈ 1.0** with feedback
- **Diagnosis:** Worst feedback/retro clone in the section (lab 8-hex vs SHA-256 production). Keep that content in **one** field; give the other a distinct job.
- **Severity residual:** P1 (eco)
- **Proposed feedback (replace):**  
  Si imprimes 40 caracteres hex, falta el slice `[:8]`. Conserva el payload `b"synthetic"`: otro input produce otra huella y no cuadrará con el manifiesto del lab (`385fcd67`).
- **Proposed retrospective (replace):**  
  Recorte de 8 hex = id didáctico (débil ante colisiones). En producción firmas el artefacto completo con SHA-256, no un string de juguete. Pregunta: ¿por qué el manifiesto necesita huella además de `run_id`? Luego (E3): `ready` exige **todos** los artefactos, no “alguno”.
- **Code/output changes:** none
- **Validation notes:** Canonical `385fcd67` must stay.

### S21-T4-B-E3 (weDo, transfer) — **B** / **C** on hint spoil
- **Scores:** title **short** (3 words) · preamble Strong but short (~39w bullets) · instruction Strong · feedback Strong · retrospective **Strong** (~40w, has self-check) · **hints = full solution**
- **Diagnosis:** Best retro of the We Do set. Hints 1–2 give `all(checklist.values())` and “no any” — transfer spoiled. Title under 4-word floor.
- **Severity residual:** P1 (hints) + P2 (title)
- **Proposed title:** `ready` con all sobre la checklist  
- **Proposed hints (replace):**  
  1. Un solo artefacto en verde no debe bastar para cerrar el paquete.  
  2. Piensa en el opuesto de “¿hay alguno listo?”: “¿están listos todos?”.
- **Proposed residual feedback/retrospective:** none required (already distinct enough; retro has self-check + You Do bridge)
- **Code/output changes:** none

---

### youDo — Reporting Factory — cierre CP-N2-B — **A**
- **Scores:** context **Strong** · objectives/requirements/rubric **Strong** · starter contract **Strong** · portfolioNote links to retro · retrospective **Strong** (~84w, defense triad)
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective pass
- **Diagnosis:** R1 retrospective landed. Newbie can defend parity invariant, `pending_review`, and 30-second impact line. No residual required.
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P1 — do first (metacognition + integrity of deliberate practice)
1. **Expand We Do retrospectives under floor** (worst first):  
   T4-A-E2 → T2-B-E2 → T3-B-E1 → T4-A-E1 → T3-A-E1 → T2-A-E1/E2 → T1-A-E1 → T1-B-E1 → T4-B-E1 → T3-A-E2/E3 → T3-B-E2 → T1-A-E3 → (rest as capacity allows)
2. **Break feedback↔retrospective eco:**  
   **T4-B-E2** (verbatim), **T2-B-E2**, **T3-B-E1**, **T1-B-E2**, then lighter pairs (T1-B-E3, T4-A-E1)
3. **Soften transfer hints that give the full return:**  
   **T3-B-E3**, **T4-A-E3**, **T4-B-E3**

### P2 — polish
1. Expand thinnest **iDo** retrospectives: T3-B, T2-B, T4-B, T2-A, T3-A (then T1-B, T4-A)
2. Feedback under 25w when already editing the unit (T2-B-E3, T3-B-E3, T4-A-E2, etc.)
3. Title T4-B-E3 → ≥4 words (`ready` con all sobre la checklist)
4. Optional: mild preamble length on T4-B-E3 bullets if touching that unit

### Leave alone (no required residual)
- **S21-T1-A-DEMO**, **S21-T1-A-E2**, **S21-T2-A-E3**, **youDo**
- All **code / starter DEFECT / solution / canonical output** unless a real runtime bug appears (none found)
- ASCII `sintetico` on ReportLab canvas; em-dash `—`; historical id `fastapi`

---

## Residual risks

1. **Nombre histórico `fastapi` / `s21-fastapi.ts`:** sigue confundiendo a quien busca APIs HTTP; no “corregir” el id sin plan de migración; prosa debe seguir anclada a Reporting Factory.
2. **ASCII `sintetico` en canvas ReportLab:** intencional; no introducir tildes en demos/PDF de lab.
3. **Em-dash `—` vs guion `-`:** contrato del lab; no normalizar a ASCII en preambles/retros.
4. **Volumen 24 We Do:** el Fixer debe reescribir a mano; no bulk-replace un párrafo-plantilla entre subtemas (anti-aberration).
5. **E3 T1-A n=18 (Cusco):** el matiz “otro context ≠ fallo de paridad Lima” ya está en preamble — **conservarlo** al tocar el retro.
6. **Hints vs instruction:** al suavizar hints E3, no borrar el defect naming de la instruction (E1/E2 may keep near-complete hints).
7. **Código/outputs:** estables; no execute-and-diff salvo regresión.

---

## Fixer notes (operativos Round 2)

- **No** re-add missing fields (shell is complete). Focus on **quality gates**: retro 40–80w with principle + misconception + transfer/self-check; feedback 25–60w with *corrective* job distinct from retro.
- Role split: **feedback** = qué falló y por qué el test/comité lo rechaza *ahora*; **retrospective** = qué se queda al cerrar la pestaña + self-check + puente.
- Longitudes: title 4–12 palabras; preamble bullets OK; instruction steps only; why already in floor on iDo.
- Conservar `tests`, `output`, starters y solutionCodes.
- Español profesional peruano; datos sintéticos; sin PII.
- Fade E1→E3 de *código* ya es real — no aplanar hints E3 a spoiler de solución.
- No generators; no bulk replace de prosa entre secciones.

---

Section 21 exercise pedagogy review complete. Ready for the Fixer prompt.
