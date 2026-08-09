# S35 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Explicabilidad, equidad e incertidumbre
- **shortTitle:** Explicabilidad y equidad
- **id:** `system-design` (archivo `s35-system-design.ts`; contenido = ficha de caso CP-N3-C, no “system design” genérico)
- **index:** 35
- **source:** `src/lib/course/sections/s35-system-design.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A ranking por drop · T1-B explicación local y 4 capas · T2-A slices y low_n · T2-B proxies high-risk · T3-A banda p±q · T3-B OOD y abstención · T4-A model card · T4-B override/audit
- **hilo:** inicio **CP-N3-C** — ficha de caso sintético `CASO-LIM-035` (Red Andina, Lima); separa **evidencia | modelo | incertidumbre | humano**; **nunca** auto-etiqueta fraude ni parentesco; hilo S34 → S35 → portfolio de gobernanza
- **Round 1 context:** `round1/S35_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Integrity traps checked live: (1) **T1-A-E1** `min` + `means_fraud is True` → defect **visible**; (2) **T3-A-E1** `lo=hi=p` / `level=point` aunque `q>0` → defect de cálculo real; (3) **T3-B-E1** detector OOD OK, política `auto_fraud` → pedagogía de política pura; (4) **T4-B-E1** `not event.get("by")` → defect guiado observable; (5) fail-closed E3 **T1-A / T3-A / T4-B** con preambles diferenciados (drops / q / by).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–8 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción | Pass en estructura (bullets ≈36–55 w; spec permite “4 short bullets”) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass; **T4-B-E1** paso 4 es verificación mental (P2) |
| **E1→E2→E3 fade** | Superficies distintas por subtema: E1 repara dominio; E2 tri-ruta PASS/REJECT/MISSING; E3 fail-closed o **transfer real** (`build_ficha`, `build_slice_report`, `build_proxy_audit`, `build_uncertainty`, `build_card`) | Pass — no clones numéricos; T1-A-E3 / T3-A-E3 / T4-B-E3 diferenciados en prosa (drops vs q vs by) |
| **Feedback vs retrospective** | Feedback suele anclar ficha/cola/Red Andina; en **~16** unidades el retro **repite** el feedback (mismo principio, poco metacognición extra o self-check) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈17–29 palabras (spec 40–80); peores: **T3-A-E1** (~13 w), **T3-B-E1** (~14 w), **T4-A-E1** (~14 w). iDo demos: solo T1-A en rango (~41 w); **T4-B-DEMO** (~14 w), **T4-A-DEMO** (~18 w) | Residual **P2** (pocos rozan **P1** de metacognición fina en E1 cortos) |
| **iDo why** | Mayoría en o cerca del piso 40–90; **T3-A** (~33 w), **T4-A/B** (~35 w), **T2-B** (~38 w) bajo piso | Residual **P2** |
| **Código/outputs** | Coherentes con theory y CP-N3-C; DEFECT bien nombrados; outputs canónicos intactos | none residual de integridad |
| **youDo frame** | context, objectives, requirements (ético, OOD, card/by), rubric, portfolioNote, retrospective de defensa (~80 w) | Pass — fuerte |
| **Hints E1** | Casi-solución en varios guided (aceptable); E3 transfer da forma de `build_*` (andamiaje mínimo OK) | Residual **P2** opcional |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros cortas, why bajo piso en 3–4 demos, un paso mental). No hay P0 de cobertura ni defectos que invaliden outputs canónicos.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right total) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S35-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: `shared_phone` gana ranking con `means_fraud=False`. Preamble pide predicción y ancla “ranking ≠ acusación”. `why` (~52 w) en rango. Retrospective repara “top_feature = fraude” y puente a We Do.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S35-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito `S35-T1-A PASS`; instruction nombra doble DEFECT (`min` + `means_fraud is True`); feedback ancla ficha CP-N3-C. Retro (~29 w) repite el principio del feedback y solo añade “siguiente E2”.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Dirección del ranking + flag ético son el primer ladrillo de explicación **global**. Un drop alto no “demuestra” culpa: solo mide sensibilidad de la métrica de cola. Pregunta: si `amount_7d` tuviera drop 0.2, ¿cambiaría el top y seguirías con `means_fraud=False`? Siguiente (E2): tres rutas schema / contenido / missing.
- **Code/output changes:** none

### S35-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tri-ruta limpia; éxito canónico. Feedback y retro casi clonan “Schema primero, ética después”; el self-check del retro es bueno pero la primera frase es eco literal.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Faltar `drops` es incertidumbre de schema; `means_fraud=True` con drops presentes es breach de **contenido**. No son el mismo ticket en la cola. Pregunta: ¿por qué un drop de 0.1 con flag malo no se “arregla” inventando un `MISSING`? Luego (E3): REQUEST vs REJECT en fail-closed de cola.
- **Code/output changes:** none

### S35-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Fail-closed con REQUEST_METRIC_DROP bien diferenciado de E2. Feedback ancla Red Andina; retro repara “continuar sin drops” y puente a ficha local. Eco leve “REQUEST no es PASS”, pero el transfer cue a T1-B es claro.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (acortar eco en feedback o retro)
- **Proposed residual:** none required
- **Code/output changes:** none

### S35-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Contrib value×weight y `causal=False` claros. Preamble de “no es SHAP ni causa legal” excelente. Retrospective corta (~28 w) sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Explicar el score no es acusar a la persona. El error clásico es leer el top local como fraude. Pregunta: si `shared_phone` aporta 0.9, ¿qué frase de la ficha sigue siendo falsa si escribes “causó el riesgo”? We Do: calcular contrib, armar capas y rechazar `causal=True`.
- **Code/output changes:** none

### S35-T1-B-E1 (weDo, guided) — **C+**
- **Diagnosis:** DEFECT doble excelente (ceros + `causal is True`). Feedback y retro **casi idénticos** (~16 w retro: peor eco de T1). Metacognición insuficiente para un guided tan denso.
- **Checklist:** all pass; retro fail (eco + ~16 w)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  La contribución se **calcula** (value×weight); `causal=False` evita que la capa modelo se confunda con veredicto. El error clásico del starter es “arreglar” el PASS invirtiendo solo el booleano y dejar contrib en cero. Pregunta: ¿por qué `shared_phone==0.9` y suma ≈1.0 demuestran cálculo, no hardcode? Siguiente (E2): PASS/REJECT/MISSING sobre layers.
- **Code/output changes:** none

### S35-T1-B-E2 (weDo, independent) — **B+**
- **Diagnosis:** Tri-ruta sobre layers y causal; retro distingue contenido vs schema y anuncia build en E3. Feedback algo genérico pero usable.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (retro ~26 w → +1 self-check “¿qué falta si layers=[evidence, model]?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S35-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real excelente (`build_ficha`). Feedback≈retro “ensamblar el producto”. Fade auténtico; el eco no impide el aprendizaje si se reescribe el retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Transferir es montar evidence|model|uncertainty|human **antes** de aplicar el gate. El error clásico es flip de CONTINUE/REJECT sobre un dict ya listo. Pregunta: sin `evidence` en raw, ¿por qué REQUEST y no inventar `["shared_phone"]`? En el You Do reutilizarás este hábito en `fill_*`.
- **Code/output changes:** none

### S35-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** LIM ok_n vs AQP low_n; preamble de “precision 0.9 no es paridad” fuerte. Retro corta (~27 w).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Métrica sin n no es equidad defendible. El error clásico es celebrar precision alta en muestra chica. Pregunta: con AQP n=8 y precision 0.9, ¿qué puedes afirmar y qué no? We Do: flag desde n, tri-ruta y reporte de slice.
- **Code/output changes:** none

### S35-T2-A-E1 (weDo, guided) — **C+**
- **Diagnosis:** Flag invertido bien nombrado. Feedback y retro abren con la **misma** frase (“El flag se calcula desde n; precision alta no salva low_n”); retro ~17 w sin self-check.
- **Checklist:** all pass; retro fail (eco + corto)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  El flag se deriva de **n vs min_n**, no del brillo de la precision. Un n chico con 0.95 no “mejora” el reporte: lo vuelve `low_n`. Pregunta: con n=100 y precision 0.6, ¿por qué PASS no es un juicio de “buena equity” sino de muestra usable? Siguiente (E2): rechazar claim con n=5.
- **Code/output changes:** none

### S35-T2-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Adverso n=5 + precision 0.95 excelente. Retro distingue REJECT vs REQUEST en E3; eco moderado con feedback.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S35-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real `build_slice_report` + claim parity; feedback y retro alineados pero no idénticos; puente a proxies. Fade auténtico.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S35-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Tag high + `action=review` + `means_fraud=False`. Preamble anti-auto_label clara. Retro muy corta (~21 w). `why` ~38 w (bajo piso).
- **Checklist:** all pass; retro partial; why partial
- **Severity residual:** P2
- **Proposed why (expand ~+15 w):**  
  El tag high se justifica con evidencia de gap (asociación o FP entre grupos sintéticos); mitigar es review, mitigate o drop — nunca auto_label. `means_fraud=False` cierra el contrato ético: el proxy documenta daño diferencial potencial, no culpa individual. En We Do filtrarás high bien y prohibirás auto_label.
- **Proposed retrospective (expand):**  
  Mitigar proxy documenta daño potencial; no acusa al individuo. Pregunta: ¿por qué `district_code` high + review es compatible con `means_fraud=False`? We Do: lista high, gate de action y audit desde tags crudos.
- **Code/output changes:** none

### S35-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Doble DEFECT (`"low"` + auto_label) excelente. Feedback/retro eco “dos mitades del contrato”.
- **Checklist:** all pass; retro partial (eco + ~20 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Detectar high y elegir acción de mitigación son mitades distintas: listar mal el proxy deja `district_code` fuera; auto_label lo convierte en acusación. Pregunta: si filtras `"med"`, ¿qué falla del contrato? Siguiente (E2): tres rutas de action.
- **Code/output changes:** none

### S35-T2-B-E2 (weDo, independent) — **B+**
- **Diagnosis:** Tri-ruta clara; retro anticipa REQUEST en E3. Eco con feedback en “auto_label es breach”.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S35-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real `build_proxy_audit`. Retro corta (~20 w) pero con puente a T3; feedback eco “arma desde tags”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  El audit se arma desde tags; el gate viene después. El error clásico es devolver CONTINUE sin listar `high_risk` o con `means_fraud=True`. Pregunta: sin `features` en raw, ¿por qué REQUEST_PROXY_AUDIT y no inventar `district_code`? En T3 comunicas incertidumbre del score restante tras mitigar proxies.
- **Code/output changes:** none

### S35-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Banda toy [0.5, 0.7] con `coverage_claim=False`. Preamble de “punto sin ancho engaña” fuerte. `why` ~33 w (bajo piso). Retro ~25 w.
- **Checklist:** all pass; why partial; retro partial
- **Severity residual:** P2
- **Proposed why (expand):**  
  La banda toy entrena el hábito de no publicar solo p; conformal real (MAPIE/cobertura empírica) queda en recursos y **no** se afirma con `level=toy`. `q==0` o `level=point` es REJECT_POINT_ONLY. En We Do calcularás lo/hi de verdad, no inventarás el punto.
- **Proposed retrospective (expand):**  
  Intervalo honesto (aunque toy) prepara abstención y override. El error clásico es vender “conformal calibrado” con banda ilustrativa. Pregunta: si q=0.1 y level=toy, ¿qué puedes decir al analista y qué no? We Do: score_band y fail-closed por q.
- **Code/output changes:** none

### S35-T3-A-E1 (weDo, guided) — **C**
- **Diagnosis:** Defect de cálculo real (no solo booleano) — excelente. Retro **~13 w** (“La banda se calcula; level=toy es honesto. Siguiente…”) = eco mínimo del feedback; no repara misconception ni self-check.
- **Checklist:** all pass; retro fail (longitud + eco)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  La banda se **calcula** (p±q); `level=toy` es honesto, no un atajo para afirmar cobertura. El error clásico del starter es dejar lo=hi=p aunque q>0. Pregunta: con p=0.6 y q=0.1, ¿por qué hi debe ser 0.7 y no “cualquier número mayor”? Siguiente (E2): tri-ruta con q==0 adverso.
- **Code/output changes:** none

### S35-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tri-ruta q/level; feedback y retro clonan “q==0 contenido / faltar q schema” — principio correcto, eco fuerte.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un punto solo (q==0, level=point) es breach de **contenido** de la ficha; faltar la key `q` es schema. Pregunta: si alguien hardcodea q=0.1 en el adverso, ¿qué invariante rompes? En E3 la misma lógica se enruta a CONTINUE/REJECT/REQUEST para la cola.
- **Code/output changes:** none

### S35-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Fail-closed diferenciado de T1-A-E3 (REQUEST_INTERVAL vs drops). Feedback nombra la diferencia; retro puente a OOD excelente.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S35-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** OOD + abstain; preamble de detector univariante de lab. Retro corta (~21 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  OOD cambia de dominio; no se “arregla” con más confianza en el score. Pregunta: si z max=3.5 y thr=3, ¿por qué `auto_fraud` miente aunque el score “se vea seguro”? We Do: abstain obligatorio y capa uncertainty ensamblada.
- **Code/output changes:** none

### S35-T3-B-E1 (weDo, guided) — **C**
- **Diagnosis:** Pedagogía de política pura (detector ya OK). Retro ~14 w eco de feedback; no nombra el misconception “detecté OOD = listo”.
- **Checklist:** all pass; retro fail (eco + corto)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Detectar OOD no basta: la **acción** de ficha es fail-closed hacia humano (`abstain`). El starter ya calcula ood bien y aún falla el contrato por `auto_fraud`. Pregunta: ¿qué capa de la ficha mientes si fuerzas label fuera de soporte? Siguiente (E2): tri-ruta de action.
- **Code/output changes:** none

### S35-T3-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Tri-ruta clara; retro anticipa build en E3. Feedback ancla capa uncertainty.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (retro ~20 w)
- **Proposed residual:** none required
- **Code/output changes:** none

### S35-T3-B-E3 (weDo, transfer) — **B+**
- **Diagnosis:** Transfer real `build_uncertainty` con `reason=ood`. Retro corta (~17 w) pero puente a T4 útil; feedback eco leve.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  `reason=ood` hace auditable la abstención: no es un print suelto, es capa de ficha. El error clásico es CONTINUE con action≠abstain en OOD. Pregunta: sin `zs`, ¿por qué REQUEST_OOD_POLICY y no inventar z=0? En T4 documentas usos permitidos (card) y el rastro del override humano.
- **Code/output changes:** none

### S35-T4-A-DEMO (iDo) — **B−**
- **Diagnosis:** Card con queue_rank / fraud_label / contestability. Preamble fuerte. Retro **~18 w** (“contrato de producto… We Do: card_ok…”) sin self-check. `why` ~35 w bajo piso.
- **Checklist:** all pass; retro partial; why partial
- **Severity residual:** P2
- **Proposed why (expand):**  
  Keys mínimas + fraud_label fuera de scope + contestability habilitan apelación sin borrar histórico. `use=queue_rank` es el único uso permitido del ranker de cola en este lab: si use fuera fraud_label, el score se cuela como etiqueta automática. En We Do validarás la card y la construirás desde `prohibited` crudo.
- **Proposed retrospective (expand):**  
  La card es contrato de producto, no un README decorativo. Pregunta: si `contestability=False`, ¿qué derecho del caso se pierde aunque out_of_scope esté bien? We Do: card_ok, gate de scope y build_card.
- **Code/output changes:** none

### S35-T4-A-E1 (weDo, guided) — **C**
- **Diagnosis:** Defect de validador (`use==fraud_label`) excelente. Retro ~14 w eco de “out_of_scope no es decorativo”.
- **Checklist:** all pass; retro fail (eco + corto)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  `out_of_scope` fija el límite de producto: fraud_label **fuera** del ranker de cola. El error clásico del starter es invertir el predicado y “aceptar” el uso prohibido. Pregunta: ¿por qué hace falta **también** contestability=True, no solo el set de keys? Siguiente (E2): tri-ruta de scope.
- **Code/output changes:** none

### S35-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tri-ruta scope; feedback/retro eco “use=fraud_label es breach”. Usable.
- **Checklist:** all pass; retro partial (eco + ~17 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  use=fraud_label es breach de producto aunque el score sea “preciso”. Faltar `out_of_scope` es schema, no un “casi PASS”. Pregunta: con out_of_scope=[] y use=queue_rank, ¿PASS o REJECT y por qué? Luego construirás la card desde `prohibited` crudo.
- **Code/output changes:** none

### S35-T4-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real `build_card` desde prohibited. Feedback≈retro “construir y validar son dos pasos”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Construir la card (`out_of_scope = list(prohibited)`) y validar scope son dos pasos: saltar el build deja la ficha sin contrato. Pregunta: si prohibited=[], ¿por qué no puedes “inventar” fraud_label en out_of_scope para forzar CONTINUE? En T4-B cierras con audit del override humano.
- **Code/output changes:** none

### S35-T4-B-DEMO (iDo) — **B−**
- **Diagnosis:** audit_min + audit_portfolio con by/ts. Preamble de override silencioso excelente. Retro **~14 w** — la más corta de demos. `why` ~35 w bajo piso.
- **Checklist:** all pass; retro partial; why partial
- **Severity residual:** P2 (cerca de P1 por metacognición de cierre de sección)
- **Proposed why (expand):**  
  Mínimo case/human/by no vacío; portfolio añade ts, reason y model_version para reconstrucción forense. Sin by el override es silencioso aunque el score se vea “correcto”: no hay gobernanza reconstruible. En We Do corregirás el validador que acepta by vacío.
- **Proposed retrospective (expand):**  
  Sin by no hay gobernanza. El error clásico es “el score ya era bueno, no hace falta actor”. Pregunta: ¿qué falla de audit_min si by="" y qué añade ts al portfolio? We Do: audit_event, tri-ruta y fail-closed de override silencioso.
- **Code/output changes:** none

### S35-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT `not event.get("by")` perfecto. Instruction paso 4 “verifica mentalmente” no es tarea de código. Retro eco de feedback (~17 w).
- **Checklist:** all pass; instruction partial (paso 4); retro partial
- **Severity residual:** P2
- **Proposed instruction (step 4 tweak):**  
  1. Starter: return True cuando by está vacío.  
  2. Exige keys case/human/by y bool(by), bool(case), bool(human).  
  3. Imprime `S35-T4-B` y el status; el assert debe pasar con by=analyst_7.  
  *(Mover “verifica mentalmente” al feedback o límites — no como paso de instruction.)*
- **Proposed retrospective (replace):**  
  by vacío es override silencioso: no hay actor reconstruible aunque el score se vea “correcto”. El error clásico del starter es premiar la ausencia de by. Pregunta: ¿por qué bool(by) no es lo mismo que `"by" in event`? Siguiente (E2): tres rutas de audit.
- **Code/output changes:** none

### S35-T4-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Distingue MISSING:by vs by="" — pedagogía fina. Feedback y retro casi clonan esa distinción (eco), pero el contenido es el learning goal correcto.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Faltar la key `by` (MISSING) no es lo mismo que `by=""` (REJECT): schema vs override silencioso. Pregunta: ¿qué código devuelve cada uno y por qué la cola no los trata igual? En E3 enrutas missing a REQUEST_AUDIT_FIELDS.
- **Code/output changes:** none

### S35-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Fail-closed de gobernanza diferenciado (REQUEST_AUDIT_FIELDS). Feedback nombra la diferencia vs drops/q; retro cierra la sección con self-check de portfolio (ts, reason, model_version). Mejor cierre del arco.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S35-YOU-DO (youDo) — **A**
- **Diagnosis:** Marco de proyecto **sólido**: context Red Andina, objectives de 4 capas + card + OOD, requirements éticos, rubric, portfolioNote, starter con tres `fill_*` rotos (contrib/ethics, banda+auto_fraud, card+by vacío). Retrospective de defensa con 3 prompts + impacto medible (~80 w) — alineada al exemplar del spec.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (slice/proxy en nota, no en asserts — intencional y OK)
- **Code/output changes:** none

---

## Priority order

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos cerrados tras Round 1.

### P1 (metacognición fina — retros que no enseñan más que el feedback)
1. **S35-T1-B-E1** — retro ~16 w eco total; reescribir con self-check de hardcode vs cálculo.  
2. **S35-T2-A-E1** — retro clona feedback palabra por palabra; reescribir.  
3. **S35-T3-A-E1** — retro ~13 w; reescribir (peor longitud weDo).  
4. **S35-T3-B-E1** — retro ~14 w; enfatizar “detector OK ≠ política OK”.  
5. **S35-T4-A-E1** — retro ~14 w; self-check contestability + out_of_scope.

### P2 (polish sistemático)
1. **Eco feedback≈retro** en ~11 unidades más: T1-A-E1/E2, T1-B-E3, T2-B-E1/E3, T3-A-E2, T3-B-E3, T4-A-E2/E3, T4-B-E1/E2 (propuestas arriba donde el eco es fuerte).  
2. **iDo retros cortas:** T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B-DEMO — expandir a ~40–60 w con 1 self-check.  
3. **iDo why bajo piso:** T2-B, T3-A, T4-A, T4-B — +10–20 palabras sin cambiar código.  
4. **T4-B-E1** instruction: quitar paso 4 mental.  
5. **Hints E1** (opcional): no endurecer; ya son guided aceptables.

### Oleada sugerida para Fixer R2
1. **Oleada P1:** cinco retros E1 listadas.  
2. **Oleada iDo:** expandir demos T4-B, T4-A, T3-A, T2-B (cierre de sección y bandas).  
3. **Oleada eco:** reescribir retros E2/E3 con eco fuerte (solo full text donde este reporte propone replace).  
4. **No tocar** outputs, DEFECT names, ni lógica de solution salvo bug de ejecución.

---

## Residual risks

1. **Prosa vs. código:** el Fixer R2 debe rellenar/expandir campos y **preservar** outputs exactos. Si se toca código de solución, re-ejecutar y diff es obligatorio.  
2. **Eco sistemático:** el patrón Round-1 “feedback ancla + retro = feedback + puente de una línea” dejó retros bajo el piso del spec. Sin reescritura selectiva, el learner cierra la pestaña sin self-check.  
3. **Fail-closed E3 (T1-A / T3-A / T4-B):** ya diferenciados en preambles y códigos REQUEST; no re-clonar prosa al “mejorar” retros.  
4. **Carga cognitiva S35:** asume S34 y workbench; preambles no deben re-enseñar toda la theory al expandir retros.  
5. **You Do slice/proxy en nota:** no inventar asserts de slice en el starter; la retrospective ya empuja la nota de portfolio.  
6. **Ética y PII:** mantener `CASO-LIM-035`, Red Andina ficticia, `means_fraud=False` / no auto_label en cualquier prosa nueva.  
7. **Longitudes:** al implementar, apuntar retros a 40–80 palabras y why iDo a 40–90; preambles en bullets cortos ya cumplen el escape del spec (“4 short bullets”).

---

## Fixer handoff notes (Round 2)

- **No editar source en este Round 2 Review** (solo diagnóstico + prosa residual).  
- Priorizar **replace** de retrospectives P1; no reescribir preambles/instructions enteras salvo T4-B-E1 paso 4.  
- Preservar outputs exactos y comentarios `# DEFECT:`.  
- Español PE profesional; sin PII real.  
- Tras fix: typecheck/build estático de la sección; no generadores de prosa.  
- Gold tone (no copiar contenido): S26, S30, S33, S50.

---

Section 35 exercise pedagogy review complete. Ready for the Fixer prompt.
