# S24 Exercise Pedagogy Report (Round 2)

## Section
- **title:** OCR y Document AI
- **shortTitle:** OCR Document AI
- **id:** `rpa-advanced` (archivo `s24-rpa-advanced.ts`; contenido = document intake OCR/Document AI, no RPA de escritorio clásico)
- **index:** 24
- **source:** `src/lib/course/sections/s24-rpa-advanced.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A DPI/deskew/crop · T1-B ruido/orientación · T2-A idiomas/layout/confidence · T2-B texto/tablas/KV · T3-A schema/normalización PE · T3-B cross-field/cola HITL · T4-A golden/accuracy/cobertura · T4-B privacidad/hostiles/fallback
- **hilo:** document intake **CP-N2-C** (backoffice sintético facturas/boletas Lima; artefacto S23 → preproceso → OCR conf+bbox → schema → validación → golden; `needs_review ≠ fraude`)
- **Round 1 context:** `round1/S24_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Integrity traps checked live: (1) T3-A-E2 starter US `%m/%d/%Y` on `15/01/2026` → `ValueError` (defect teaches crash/mis-locale); (2) T3-A-E3 starter `replace(",", "")` on `"150,00"` → `15000.0` vs solution `150.0`; (3) T2-B-E1 sin strip → valor con espacio residual vs `Total 12.5`.
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–8 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción | Pass en estructura; bullets a menudo 40–60 palabras (aceptable por spec “4 short bullets”) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas en la mayoría | Pass; **T1-A-E1** paso 4 es nota conceptual (“Recuerda…”) no tarea — P2 |
| **E1→E2→E3 fade** | Superficies distintas por subtema (DPI → deskew → preprocess_meta; max → sum ruido → action; thr → bbox → min+weak; strip → header → evidencia; limpia → fecha PE → RUC+total; mismatch → reasons → validate dual; acc → field RUC → par; mime → size → gate+fallback) | Pass — no clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug *y* el impacto al HITL/SLO; en **~10** unidades el retro **repite** el feedback (misconception duplicado, sin metacognición extra o self-check) | Residual **P2** sistemático |
| **Retrospective length** | Mediana weDo ≈22–31 palabras (spec 40–80); principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback. Peor caso: **T4-A-E2** (~17 w) | Residual **P2** (pocos **P1** de metacognición fina) |
| **iDo why** | Varios bajo el piso 40–90: T2-A (~35), T2-B (~35), T3-B (~31), T4-A (~26) | Residual **P2** |
| **Código/outputs** | Coherentes con theory y CP-N2-C; DEFECT bien nombrados; anti-patrones de producto fuertes (fraud, 15000.0, promediar conf, hardcode 1.0) | Sin hueco wrong≈right detectado |
| **youDo frame** | context pasos 1–5, objectives, requirements (PE, bbox, review≠fraude, conf ausente), rubric, portfolioNote, retrospective de defensa (~70 w) | Pass |
| **Hints E3** | Aún cerca de la fórmula en varios transfer (aceptable como andamiaje mínimo; opcional aflojar 1 miga) | Residual **P2** opcional |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros cortas, `why` iDo cortos) y un par de polish de instruction. No hay P0 de cobertura ni defectos de integridad que invaliden outputs.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S24-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: metadata 72 DPI / skew 2.0° → `200 True`. Preamble pide predicción y ancla “no culpes al motor”. `why` (~57 w) en rango. Retrospective repara “cambiar de modelo sin preflight” y puente a We Do.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S24-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito `200`; instruction nombra bug 96; feedback razona cola de RUC ilegibles; retro distingue preflight vs modelo. Paso 4 de instruction es recordatorio conceptual, no acción.
- **Checklist:** all pass; instruction partial (paso 4 no-tarea)
- **Severity residual:** P2
- **Proposed instruction (step 4 tweak):**  
  1. Abre el starter: imprime `dpi` crudo (bug: deja 96).  
  2. Aplica `max(dpi, 200)`.  
  3. Imprime solo el entero resultante.  
  *(Mover la nota de upscaling al feedback o al preamble límites — ya está en límites.)*
- **Code/output changes:** none

### S24-T1-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Operador invertido `<` vs `>=` excelente. Preamble ancla auditoría del revisor y abs. Feedback y retro se complementan (flag falso vs bug silencioso de calidad); retro puente a E3.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~35 w → +1 self-check “¿qué imprime con skew=−1.2?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S24-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real a `preprocess_meta` compuesto; éxito exacto `200 True (50, 50, 950, 950)`; feedback nombra contrato auditable; retro con self-check sobre crop sin OpenCV. Buen fade desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S24-T1-B-DEMO (iDo) — **B+**
- **Diagnosis:** `best_orientation` elige 180°. Preamble con predicción y “conf alta en basura”. Retrospective correcta pero corta (~32 w); `why` en rango bajo.
- **Checklist:** all pass; retro partial (longitud / sin self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Orientación correcta *antes* del motor evita RUC permutados y conf engañosa. El error clásico es confiar en un score alto de una página mal rotada. Pregunta: si el mejor score fuera 0.4, ¿forzarías OCR o `manual_orient`? We Do: max (no min), conteo de ruido y gate auto/manual.
- **Code/output changes:** none

### S24-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter `min` perfecto. Éxito `90` (grados, no score). Feedback y retro casi clonan “max = mejor / min envía la peor”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La key del score máximo es la rotación candidata del preflight; el valor del score se usa después (umbral auto vs manual). El error clásico es imprimir el score 0.8 en vez de los grados. Siguiente (E2): contar flags de ruido para el runbook, no el largo del vector.
- **Code/output changes:** none

### S24-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** `sum` vs `len` — contrato de auditoría bien delimitado vs denoise real. Feedback/retro se solapan en sum=ruido / len=longitud.
- **Checklist:** all pass; retro partial (eco + corto)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El runbook necesita *cuántos* píxeles sintéticos están marcados, no cuántas celdas tiene el vector. Confundir longitud con calidad miente al preflight. Pregunta: si todos los flags fueran 0, ¿qué imprime `sum` y qué diría un `len`? Luego (E3): best + score + action.
- **Code/output changes:** none

### S24-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer preflight con anti-patrón `ocr_now`; éxito `180 0.7 auto`; retro con self-check “auto aún exige rotar”. Alineado a theory.
- **Checklist:** all pass
- **Severity residual:** none (hints E3 casi dan la fórmula — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

### S24-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Filtro low-conf con token `20X` a 0.55. Preamble del anti-promedio fuerte. `why` (~35 w) bajo el piso; retro (~32 w) sin self-check.
- **Checklist:** context pass · goal pass · success pass · constraints partial · retrospective partial
- **Severity residual:** P2
- **Proposed why (expand ~50–60 w):**  
  Abstención por campo crítico es control de calidad: umbral didáctico 0.85, se encola sin inventar dígitos. Promediar un 0.55 con «FACTURA 0.99» oculta el dígito débil y pinta un dashboard verde mentiroso. Nunca rellenes caracteres corruptos del OCR en el parser: el revisor HITL necesita el token débil listado, no un RUC “arreglado”.
- **Proposed retrospective (expand):**  
  Low-conf se encola; no se inventa. El error clásico es promediar o “corregir” RUC a mano en el parser. Si puedes decir por qué 0.55 no se salva con 0.99, ya tienes el hábito de abstención. We Do: umbral 0.85, orden de lectura por bbox y gate min-conf.
- **Code/output changes:** none

### S24-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Umbral 0.5→0.85; éxito `['A']`; feedback ancla SLO de RUC; retro puente a orden bbox. Limpio.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S24-T2-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Orden de lectura por `(y0,x0)` — skill real. Preamble “no concatenes columnas” excelente. Instruction da la key casi completa (aceptable para bbox; E2 algo guiado). Retro corta pero principia bien.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (aflojar un hint de la fórmula exacta en instruction paso 2)
- **Proposed residual:** none required
- **Code/output changes:** none

### S24-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Anti-patrón promediar + weak vacío; éxito `0.75 review ['total']`; retro con self-check thr vs coverage/acc_ruc. Transfer fuerte de producto.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none  
- **Nota:** thr=0.8 aquí vs 0.85 en E1/demo — coherente como “umbral de campo” distinto; no es bug.

### S24-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Parse KV limpio. Preamble del espacio residual que rompe golden. `why` y retro cortos (~35 / ~29 w).
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Evidencia textual limpia es el puente al schema y al golden. El espacio residual es un bug silencioso: el revisor no lo ve y la normalización falla. We Do: strip en ambos lados, filas de datos sin header y bbox del *valor* para HITL.
- **Code/output changes:** none

### S24-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT sin strip clásico. Feedback y retro repiten “espacio invisible rompe golden”.
- **Checklist:** all pass; retro partial (eco + ~22 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Strip en clave y valor es higiene de parser, no cosmética. El error clásico es comparar strings “a ojo” en el editor y no ver el espacio. Pregunta: ¿qué fallaría después si el valor quedara `' 12.5'` al hacer `float` o match de golden? Siguiente (E2): no contar el header de tabla como ítem.
- **Code/output changes:** none

### S24-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** `len-1` vs `len` — bug de negocio silencioso bien anclado a `total_mismatch` falso. Retro muy corta (~20 w), eco del feedback.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Header ≠ ítem de negocio: contarlo infla la suma y manda a revisión por error de *parsing*, no de factura. El hábito es `n_data_rows = len(table) - 1` antes de `sum(líneas)`. Luego (E3): fields con bbox del valor para que el humano resalte el dígito.
- **Code/output changes:** none

### S24-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Evidencia (name, value, bbox) ordenada; starter solo valores; retro con self-check del label. Contrato HITL alineado a callout theory.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S24-T3-A-DEMO (iDo) — **A−**
- **Diagnosis:** RUC a dígitos + ok longitud 11. Preamble honesta: no modela letra→None (We Do E3 / You Do). Retro corta (~26 w) pero misconception “inventar dígitos” clara.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Solo dígitos + longitud fija es el contrato mínimo de RUC; inventar ceros o dígitos es el anti-patrón prohibido. Esta demo no rechaza letras embebidas — eso es el siguiente nivel de fail-closed. We Do: limpiar parcial, fecha day-first PE y montos con coma decimal.
- **Code/output changes:** none (scope demo intencional; no unificar con E3 aquí)

### S24-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Scope E1 bien acotado (limpia sin len 11). Éxito `20123`; límites claros; retro puente a fecha PE.
- **Checklist:** all pass
- **Severity residual:** none (retro corta OK con puente)
- **Proposed residual:** none required
- **Code/output changes:** none

### S24-T3-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Formato US vs PE — defecto de dominio excelente; starter revienta con mes 15. Preamble nombra el caso; feedback y retro alineados a “locale es contrato”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none  
- **Validation:** `strptime('15/01/2026', '%m/%d/%Y')` → ValueError (esperado).

### S24-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer PE fuerte; starter 15000.0; solution con letras→None aunque el fixture no las ejercita en print (política en código + pregunta del retro). Éxito `20123456789 150.0`.
- **Checklist:** all pass
- **Severity residual:** P2 opcional — un fixture de letra en tests/edgeCases o mención en instruction de que `norm_ruc` debe devolver None con letra (ya en límites)
- **Proposed residual:** none required for learner path
- **Code/output changes:** none

### S24-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** Cross-field → `ok`; preamble “producto = cola, no acusación”. `why` (~31) y retro (~25) cortos; mensaje de política correcto.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand):**  
  Tolerancia monetaria 0.01 cubre redondeo de soles; status `ok`/`needs_review` es control de calidad del intake. Nunca emitas `auto_fraud` desde un mismatch de OCR: el producto es la cola HITL con reasons, no un veredicto legal. Un total que no cuadra puede ser error de parsing, de preproceso o de captura — el humano decide.
- **Proposed retrospective (expand):**  
  Discrepancia contable ≠ fraude. El error clásico es emitir label de riesgo desde un mismatch de OCR. Si las líneas sumaran 140 frente a 150, el status sería `needs_review`, no “culpable”. We Do: status condicional, `reasons[]` y política `review_not_fraud`.
- **Code/output changes:** none

### S24-T3-B-E1 (weDo, guided) — **B+**
- **Diagnosis:** Starter siempre `auto` — anti-patrón de producto. Feedback razona cola vs fraude; retro eco parcial pero puente a reasons.
- **Checklist:** all pass; retro partial (eco / ~22 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Autoaceptar siempre es el anti-patrón del starter: la cola es el producto de calidad. Nunca imprimas `fraud` por un descuadre de 1.0. Pregunta: con diferencia 0.005, ¿auto o needs_review (eps=0.01)? Siguiente (E2): acumular reasons sin crashear el batch.
- **Code/output changes:** none

### S24-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Append `ruc_missing` — traza HITL. Feedback/retro se solapan en “lista vacía oculta el fallo”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `reasons[]` es la traza auditable del documento para el revisor nocturno; un `raise` tumba el worker, una lista vacía miente. El hábito es acumular codes, no abortar. Luego (E3): varias rules + status + política explícita `review_not_fraud`.
- **Code/output changes:** none

### S24-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer dual + política; starter tres `fraud`; output canónico de tres líneas; retro con self-check `conf_ruc` ausente. Punto alto de la sección en política de producto.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S24-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** field_accuracy 0.5. Preamble distingue accuracy vs coverage. `why` (~26) y retro (~26) cortos — bajo piso.
- **Checklist:** all pass; why/retro partial
- **Severity residual:** P2
- **Proposed why (expand):**  
  Exact match por campo crítico (RUC, total) detecta fallos que un accuracy global o una coverage_auto alta disimulan. Coverage_auto se mide aparte: son hermanas, no intercambiables. Un golden sintético de dos filas con un acierto y un fallo produce 0.5 a propósito — no “el modelo se ve bien”.
- **Proposed retrospective (expand):**  
  Mide el campo caro (RUC/total), no solo la sensación del OCR. El error clásico es reportar solo cobertura HITL y ocultar acc_ruc bajo. We Do: `correct/n`, accuracy por filas de RUC y el par 0.5 / 0.7 del lab.
- **Code/output changes:** none

### S24-T4-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Error rate vs accuracy — defecto conceptual limpio; éxito `0.75`; feedback y retro distinguen métricas que suman 1.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S24-T4-A-E2 (weDo, independent) — **C+**
- **Diagnosis:** Hardcode 1.0 — anti-patrón de dashboard. Preamble e instruction OK; **retrospective demasiado delgada** (~17 w): solo “se calcula / no se declara” + puente E3. Falta misconception explícita y self-check para un true newbie.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective **partial/fail longitud**
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  La métrica se calcula sobre el golden, no se declara “porque el OCR se ve bien”. Hardcodear 1.0 miente al reporte de CP-N2-C y oculta el RUC caro. Pregunta: si 1 de 2 filas falla, ¿qué float debes imprimir y qué dirías en el standup? Luego (E3): reportar `acc_ruc` *y* `coverage_auto` juntos.
- **Code/output changes:** none

### S24-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Par 0.5 0.7; starter confunde review rate y hardcodea acc; retro con self-check umbral vs cada métrica. Alineado a theory golden_eval.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S24-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** Gate mime+size → `ok`. Preamble capa 1 vs antivirus honesta. Retro corta (~23 w); `why` borderline.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Gate temprano protege al worker OCR: zip y binarios enormes no deben quemar el batch. Confiar en la extensión del nombre es frágil; el mime del caller es spoofable en prod (capa 1 ≠ firmas mágicas). We Do: reject zip, reject size y `ocr_fail` → `human_rescan`.
- **Code/output changes:** none

### S24-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Ramas invertidas aceptan zip — excelente. Feedback y retro clonan “zip = reject / hostiles queman worker”.
- **Checklist:** all pass; retro partial (eco + ~19 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Fail-closed de admisión: si el mime no está en la allowlist, no hay OCR. El error clásico es invertir el ternario y “dejar pasar” lo desconocido. Pregunta: ¿por qué no basta con mirar `.zip` en el nombre? Siguiente (E2): tope de tamaño 5e6.
- **Code/output changes:** none

### S24-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Umbral size invertido. Feedback/retro eco sobre DoS/zip-bomb.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Size cap es capa 1 barata y obligatoria: 6e6 supera 5e6 → reject. Invertir el umbral abre abuso al worker. El hábito es fallar cerrado ante tamaño hostil, no “intentar OCR y ver”. Luego (E3): mime + size + fallback `human_rescan`.
- **Code/output changes:** none

### S24-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Pipeline de admisión + fallback; starter `continue`; tres líneas canónicas; retro con self-check human_rescan vs batch a ciegas. Puente al You Do.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### youDo (You Do project) — **A**
- **Diagnosis:** Marco de proyecto sólido (pasos 1–5, objectives, requirements PE/bbox/fraud/conf ausente, rubric, starter con stubs y `gate_file`). Retrospective de defensa post-build (~70 w) con invariante, PII sintético vs real y frase de impacto medible — cumple §8.3 del spec.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none (starter generoso mitigado por retro de defensa y requirements)
- **Proposed residual:** none
- **Code/output changes:** none

---

## Priority order

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están sanos.

### P1
1. **S24-T4-A-E2** — reescribir `retrospective` (hoy ~17 palabras; sin misconception/self-check suficientes).

### P2 (calidad / polish; orden sugerido)
1. **Ecos feedback↔retro (reemplazar retro, no alargar feedback):** T1-B-E1, T1-B-E2, T2-B-E1, T2-B-E2, T3-B-E1, T3-B-E2, T4-B-E1, T4-B-E2.  
2. **iDo `why` / `retrospective` cortos:** T2-A-DEMO, T2-B-DEMO, T3-B-DEMO, T4-A-DEMO, T1-B-DEMO, T4-B-DEMO, T3-A-DEMO.  
3. **T1-A-E1** — quitar paso 4 “Recuerda…” de instruction (ya está en límites/feedback).  
4. **Opcional:** aflojar un hint E3 que da la fórmula casi completa (T1-B-E3, T2-A-E3, T3-B-E3) sin romper transfer.  
5. **Opcional:** T3-A-E3 — nota o edgeCase que ejercite letra→None en el print (política ya en solution + You Do).

---

## Residual risks

1. **Retrospectives sistemáticamente bajo 40 palabras:** el learner cierra el panel sin self-check; el Fixer R2 debe *enriquecer* metacognición, no duplicar el feedback.  
2. **Eco feedback/retro:** en gates de seguridad (mime/size) y drills simples (strip, sum/len) el cierre metacognitivo se siente “el mismo párrafo otra vez”.  
3. **Política fraud:** bien cubierta en código, T3-B-E3 y youDo; sin refuerzo en retros cortas de E1/E2, el hábito “mismatch = fraude” aún puede sobrevivir en la cabeza del newbie.  
4. **Locale PE montos:** T3-A-E3 sigue siendo el único drill que fuerza 15000.0; no diluir.  
5. **Capa 1 vs seguridad real:** preambles mantienen honestidad “spoofable / no antivirus”; no vender gate mime como capa 2.  
6. **Sin cambios de output propuestos:** Fixer no debe “mejorar” prints canónicos sin execute-and-diff.

---

## Summary counts

| Tipo | N | Con preamble | Con retrospective | Con title | Score dominante | Severidad residual |
|------|---|--------------|-------------------|-----------|-----------------|--------------------|
| iDo  | 8 | 8 | 8 | N/A | A / B | P2 (longitud why/retro) |
| weDo | 24 | 24 | 24 | 24 | A / B (1 C+) | 1× P1, resto P2 o none |
| youDo | 1 | N/A (context OK) | 1 | OK | A | none |

**Round-1 P0 “campos ausentes”:** cerrado.  
**Round-2 trabajo del Fixer:** calidad de cierre metacognitivo (1 P1 + P2 sistemáticos), no reescritura de lógica.

---

Section 24 exercise pedagogy review complete. Ready for the Fixer prompt.
