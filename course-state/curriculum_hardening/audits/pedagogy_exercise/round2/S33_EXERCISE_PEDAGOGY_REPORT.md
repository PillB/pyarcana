# S33 Exercise Pedagogy Report (Round 2)

## Section
- **title:** ML supervisado y baselines responsables
- **shortTitle:** Baselines ML responsables
- **id:** `advanced-models`
- **index:** 33
- **source:** `src/lib/course/sections/s33-advanced-models.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A framing/unit/target/horizon · T1-B dual baseline dummy+regla/costo · T2-A logística/sigmoid/L2 · T2-B coeficientes escalados · T3-A stump+voto · T3-B overfit/seed · T4-A tracking honesto · T4-B group CV por entidad
- **hilo:** workbench **CP-N3-B** (Red Andina) con fixture sintético **CASO-LIM-033**; target `needs_review_7d` (cola de revisión, **no** fraude); dual baseline (dummy majority + regla simple); predicción de prioridad ≠ etiqueta de delito ni parentesco; un run con `beats_dummy=False` se loguea igual
- **Round 1 context:** `round1/S33_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Measured word counts only as gates (no bulk prose generation).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Verified integrity traps (starter stdout ≠ solution stdout) on representative units across all 8 subtemas.
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–7 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets weDo a menudo &lt;80 w (aceptable por spec “4 short bullets”); iDo narrativos ~55–77 w (varios bajo piso 80; legibles) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — varias ~25–39 w (bajo piso 40; no bloquear) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (prevalencia → assess framing → CONTINUE/REJECT/REQUEST_HORIZON; dual baseline → assess cost → REQUEST_COST; sigmoid/L2 → assess penalty → REQUEST_SIGMOID; rank \|coef\| → assess scale → REQUEST_SCALE_FLAG; stump → depth gate → REQUEST_STUMP; gap controlado → REJECT_OVERFIT → REQUEST_SEED; beats False válido → unlogged → dual win/lose; n_groups → random leak → REQUEST_GROUP_IDS) | Pass — **no** clones numéricos |
| **T3-B demo vs E1** | Preamble E1 nombra explícitamente “caso controlado (a diferencia del demo, overfit True)” | Round-1 residual risk **cerrado** |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~8–10** unidades el retro **eco** del feedback (misconception duplicado, sin metacognición extra) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈20–33 w (spec 40–80); iDo varias 23–36 w; principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback | Residual **P2** |
| **Feedback length** | ~6–8 unidades &lt;25 w (piso spec); peores: T4-A-E3 (~17), T2-A-E2 (~20), T2-B-E3 (~20) | Residual **P2** |
| **iDo why** | 8/8 en rango ~51–72 w | Pass |
| **Código/outputs** | Coherentes con theory y CASO-LIM-033; DEFECT `# DEFECT:` excelente; **wrong ≠ right** en traps verificados | **Sin** hueco de integridad |
| **youDo frame** | context CP-N3-B, thr defectuoso 0.9, objectives, requirements éticos, starter ejecutable, rubric 6+bonus, portfolioNote, retrospective de defensa (~60 w) | Pass |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback/retro, retros cortas sin self-check, feedback &lt;25 w en varias unidades, iDo retros levemente cortas). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish**, no reescritura estructural.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad leve) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S33-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido de framing: `entity_pair` + `needs_review_7d` + horizon 7, `fraud_name False`, prevalencia 0.25. Preamble pide predicción (fraud_name, prevalencia, por qué `is_fraud` rompe producto). `why` (~72 w) en rango: cola humana, breach de nombre, prevalencia antes del fit, no inventar horizonte. Retro repara “modelar fraude porque el negocio lo pide” y puente a We Do.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: preamble ~76 w → +1 frase de cola Lima si se toca)
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Title claro; bullets con éxito `S33-T1-A PASS` y límites anti off-by-one / fraud_name True. Instruction nombra DEFECT; feedback razona 0.25 vs 0.333 y gate invertido; retro distinta (prevalencia antes del fit + puente E2). Starter `len(y)-1` + `fraud_name is True` → solution PASS (discrimina).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~33 w → +self-check “¿por qué anotar prevalencia antes del fit?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Independiente fuerte: prevalence inventada + assess invertido. Preamble ancla gate de producto. Feedback (~24 w, piso) y retro (~30 w) se solapan en “breach de producto / no hardcodear prevalencia” (eco leve).
- **Checklist:** all pass; feedback/retro partial (longitud + eco leve)
- **Severity residual:** P2
- **Proposed feedback (expand if touched):**  
  El framing válido se alimenta de prevalencia calculada (0.25 sobre `y=[0,1,0,0]`), no inventada. `is_fraud` es breach de **producto** en la cola de revisión, no un schema vacío: el assess debe fallar el adverso aunque el dict “se vea completo”.
- **Proposed retrospective (replace):**  
  Hardcodear 0.25 “porque ya sabes el número” esconde un pipeline que no recalcula desbalance en el siguiente lote. El error clásico es dar PASS al nombre `is_fraud` por un if invertido. Pregunta: si mañana el lote tiene prevalencia 0.05, ¿qué se rompe si dejaste el 0.25 fijo? Luego (E3): CONTINUE / REJECT / REQUEST en lugar de PASS genérico.
- **Code/output changes:** none

### S33-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real a fallo cerrado. Instruction corta (aceptable en transfer). Feedback y retro repiten REQUEST/REJECT/CONTINUE + “no rellenar 7 en silencio” (eco fuerte); feedback ~22 w.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  En ops de riesgo, ausencia de horizonte no es “OK con default”: se pide evidencia y se detiene el fit. El error clásico es rellenar 7 en silencio “porque el lab siempre usó 7”. Pregunta: si el negocio pidiera `is_fraud` y un horizon inventado a la vez, ¿qué código de fallo cierra primero y por qué? Ese hábito se reutiliza en el You Do al cerrar el framing de CP-N3-B.
- **Proposed feedback (expand if touched):**  
  CONTINUE solo con framing limpio y prevalencia mirada. REQUEST_* pide evidencia; REJECT_* cierra el breach de nombre. No rellenes horizon por defecto en silencio: distorsiona el target de cola.
- **Code/output changes:** none

### S33-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Dual baseline claro: dummy 0.667, cost 1, regla 1.0. Preamble motiva mesa de revisión Lima y “a veces la heurística ya gana”. `why` en rango. Retro (~36 w) repara “entrenar sin baseline” pero sin self-check y bajo piso 40.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Dummy y regla se calculan de y vs. pred, no se inventan. El error clásico es entrenar sin baseline “porque el modelo se ve bien” o documentar solo el dummy y olvidar que la regla ya es perfecta. Pregunta: si la regla acierta 1.0, ¿qué valor incremental debe demostrar el ML para promocionarse? We Do: dual ancla con max (no min) y cost real.
- **Code/output changes:** none

### S33-T1-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Guiado excelente: min/minoría, cost=0, regla invertida. Feedback razona FP y “baseline falso”; retro distinta (dual baseline + puente E2). Discrimina bien.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T1-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Assess con cost derivado; éxito exacto; feedback en piso (~25 w); retro ~30 w con puente E3 claro. Menos eco que en T1-A-E2.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro al piso 40 w con self-check de c_fn asimétrico)
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** REQUEST_COST transfer limpio; retro ya trae self-check (“¿qué riesgo si c_fn real es mayor?”). Feedback y retro alineados pero retro añade metacognición — usable sin eco mortal.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Demo clara: sigmoid, pred 0 con thr=0.6, l2_sq=5, penalty l2. Preamble de umbral de producto vs magia del modelo. Retro (~29 w) corta y sin self-check; repara bien “l2_sq no prueba L2”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Umbral ≠ veredicto de fraude; L2 se **declara** en params, no se “prueba” con Σw²&gt;0. El error clásico es creer que un vector no nulo ya está regularizado. Pregunta: si thr bajara a 0.5 con la misma p≈0.55, ¿qué cambia en la cola y por qué no es magia del modelo? We Do: arreglar L1 vs L2 y thr del lab.
- **Code/output changes:** none

### S33-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** thr 0.5 / penalty none / L1 → thr 0.6 / l2 / Σw². Feedback razona p≈0.55 y config L2; retro con cuatro piezas + puente E2. Buen modelo post-fix.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess: penalty l2, no solo l2_sq. Feedback (~20 w) y retro (~20 w) cortos y eco (“config ≠ magnitud / l2_sq=5 no prueba L2”).
- **Checklist:** all pass; feedback/retro partial (longitud + eco)
- **Severity residual:** P2
- **Proposed feedback (replace):**  
  El gate de regularización exige `penalty="l2"` documentada en params. Un `l2_sq=5` solo describe magnitudes de coeficientes: un fit sin regularizar también puede dejar pesos no nulos. El adverso con `penalty="none"` debe fallar aunque el número se vea “grande”.
- **Proposed retrospective (replace):**  
  Declarar L2 es un contrato de entrenamiento, no un umbral mágico sobre Σw². El error clásico es “ya hay pesos ⇒ ya hay L2”. Pregunta: ¿qué más reportarías junto a `penalty` (C o λ) para que un revisor de PR no tenga que adivinar la fuerza? Luego (E3): REQUEST_SIGMOID si falta p.
- **Code/output changes:** none

### S33-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** REQUEST_SIGMOID transfer limpio; retro con self-check de C/λ (bueno). Feedback (~21 w) eco parcial de “sin p / sin L2”.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Sin probabilidad sigmoid en [0,1] no se prioriza cola: es adivinar. Sin `penalty="l2"` documentada el modelo no pasa el gate del workbench de revisión, aunque `l2_sq` sea positivo. Missing de p → REQUEST, no CONTINUE.
- **Code/output changes:** none

### S33-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Ranking |coef| con shared_phone arriba, causal False, scaled True. Preamble ~55 w (bajo 80); retro ~23 w muy corta. Principio claro pero poca metacognición.
- **Checklist:** context/goal/success pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Ranking honesto = features escaladas + sin claim causal. El error clásico es leer “shared_phone alto ⇒ colusión” o comparar |w| de columnas crudas. Pregunta: si `amount` viniera en soles sin z-score, ¿por qué el ranking mentiría aunque el signo sea el mismo? We Do: orden descendente y flags de interpretación.
- **Code/output changes:** none

### S33-T2-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** reverse=True + causal False. Feedback razona amount_z “top” falso y gate anti-producto. Retro (~25 w) corta pero puente E2 claro.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro al piso 40)
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess de flags de interpretación. **Eco fuerte:** feedback y retro abren con “El adverso falla por flags de interpretación, no por schema vacío”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un informe de cola con `scaled=False` o `causal=True` no es “casi OK”: es un overclaim de importancia o de causa. El error clásico es rankear features crudas “porque el número se ve grande”. Pregunta: si el top correcto es `shared_phone` pero `causal=True`, ¿qué daño hace al mesa de revisión de Lima? Luego (E3): REQUEST_SCALE_FLAG.
- **Code/output changes:** none

### S33-T2-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** REQUEST_SCALE_FLAG; retro con self-check fuerte (scaled=True pero no z-score de S32). Feedback ~20 w corto.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Pedir el scale flag evita rankings engañosos en el informe de cola: sin z-score, |coef| miente sobre importancia relativa. Missing de `scaled` → REQUEST, no inventar True ni rankear “igual”.
- **Code/output changes:** none

### S33-T3-A-DEMO (iDo) — **A−**
- **Diagnosis:** Stump [0,1] + majority 1 + depth_unlimited False. Preamble aclara “no es RF completo”. Retro (~31 w) repara árbol profundo; sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Control de profundidad es parte del producto, no un detalle de sklearn. El error clásico es un árbol profundo que memoriza el fixture y “vence” al dummy en train. Pregunta: ¿por qué un voto mayoritario con depth libre sigue siendo rechazable aunque majority sea 1? We Do: thr invertido y majority rota.
- **Code/output changes:** none

### S33-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** `x < thr` y `sum > len` → stump y majority correctos. Feedback aritmético claro; retro de “sentido del umbral” + puente E2. Discrimina.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Reject depth_unlimited. Feedback (~21 w) y retro (~27 w) alineados en “depth libre / train sube” — eco leve.
- **Checklist:** all pass; feedback/retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El adverso no es “stump vacío de idea”: es profundidad sin control frente al dummy de cola. El error clásico es `max_depth=None` porque el accuracy de train sube. Pregunta: si train_acc=0.99 y valid_acc=0.60 con depth libre, ¿qué compararías antes de promocionar? Luego (E3): REQUEST_STUMP.
- **Code/output changes:** none

### S33-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer con preds calculados + REQUEST_STUMP. Retro con self-check (“¿por qué depth_unlimited se rechaza aunque majority sea 1?”). Feedback y retro no son clones.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T3-B-DEMO (iDo) — **A**
- **Diagnosis:** overfit True (0.95−0.70) + seed 42. Preamble aclara umbral 0.2 de lab. Retro y why ya advierten que We Do es **caso controlado** — cierra el riesgo R1 de confusión demo/E1.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Preamble nombra explícitamente diferencia vs demo (overfit True). thr 0.15 + meets=is_overfit → thr 0.2 + not overfit. Feedback y retro alineados sin eco mortal; retro menciona “no forzar overfit True imitando el demo”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** REJECT_OVERFIT. Feedback y retro casi idénticos (“seed no perdona gap / loguear seed y celebrar train”) — eco; retro ~19 w muy corta.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Seed presente hace **reproducible** la memoria, no la absuelve: un gap 0.39 sigue siendo overfit de lab. El error clásico es loguear seed y celebrar train_acc 0.99. Pregunta: si eligieras depth mirando solo train, ¿qué métrica del valid te faltaría en el log del PR? Luego (E3): REQUEST_SEED.
- **Code/output changes:** none

### S33-T3-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** REQUEST_SEED; retro con self-check de params (seed + depth). Feedback (~23 w) y retro se solapan en “no inventar 42” (eco leve).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: separar feedback del “siempre usamos 42” para que retro conserve el self-check solo)
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Dual win/lose + lose_run_ok True — núcleo ético de la sección. Preamble pide predecir por qué derrota no invalida el log. Retro (~26 w) corta pero clara.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  `beats_dummy=False` bien logueado es válido: la derrota es evidencia, no basura. El error clásico es borrar el run que “quedó mal” y sesgar el historial. Pregunta: si la regla ya tiene acc 1.0, ¿basta ganar al dummy para promocionar el modelo? We Do: quitar el gate anti-ML que exige victoria.
- **Code/output changes:** none

### S33-T4-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Unidad central del lab: starter exige `beats is True`; solution PASS con beats False. Feedback razona REJECT_UNLOGGED_RUN vs derrota; retro “validez ≠ victoria” + puente E2. Excelente.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S33-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Adverso = mal logueado, no perdedor. Feedback y retro alineados (“mal logueado ≠ perdió”) — eco leve; retro ~21 w.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El if del gate de tracking mira **completitud del log**, no el signo de `beats_dummy`. El error clásico es mezclar “perdió al dummy” y “metrics vacías” en la misma rama. Pregunta: con beats False, metrics llenas y run_id, ¿qué imprime el assess y por qué es correcto? Luego (E3): dual win/lose + REQUEST_METRICS.
- **Code/output changes:** none

### S33-T4-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer rico (cuatro salidas). Feedback (~17 w, bajo piso) y retro (~30 w) **eco fuerte** de “documentar ambas caras / dashboard del jefe”. Retro trae self-check de beats_rule (bueno) pero el núcleo es clon del feedback.
- **Checklist:** all pass; feedback/retro partial (eco + fb corto)
- **Severity residual:** P2
- **Proposed feedback (replace):**  
  Tracking responsable loguea victoria **y** derrota frente al dummy 0.667. Exigir `beats True` para CONTINUE es un gate anti-ML: oculta experimentos y sesga el historial del workbench. Metrics vacías o `run_id` vacío sí rechazan; falta de metrics → REQUEST.
- **Proposed retrospective (replace):**  
  El historial del workbench debe mostrar wins y losses: la comparación honesta es el producto, no un score de vanidad. El error clásico es filtrar “solo wins” para el dashboard. Pregunta: si la regla ya tiene acc 1.0, ¿basta `beats_dummy True` para promocionar, o miras también `beats_rule` y el costo de cola? Ese criterio cierra el You Do de CP-N3-B.
- **Code/output changes:** none

### S33-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** mean 0.65, n_groups 3, disjoint True. Preamble explica e1 repetido ≠ 4 filas y random leak. Retro (~32 w) repara len(entities)/KFold; sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Disyunción por entidad es el contrato, no solo el mean de folds. El error clásico es `len(entities)` o confiar en KFold clásico con pares repetidos. Pregunta: si e1 cayera en train y valid del mismo fold, ¿qué métrica inflada verías y por qué? We Do: n_groups=3 y mean=0.65 exactos.
- **Code/output changes:** none

### S33-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** set / round 3 / isdisjoint. Feedback excelente (3 vs 4 grupos, round 2 “por casualidad”). Retro (~19 w) muy corta: solo “tres chequeos + contar filas”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Tres chequeos: grupos únicos, media a 3 decimales, disyunción calculada. El error clásico es contar filas o hardcodear `disjoint=True` y esconder un leak futuro. Pregunta: ¿por qué round a 2 “funciona” en este fixture pero no es el contrato del lab? Siguiente (E2): assess con random_split True como adverso.
- **Code/output changes:** none

### S33-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess group CV. Feedback (~21 w) y retro (~28 w) se solapan en “cálculos vs dict pre-rellenado / random infla” — eco leve.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Group CV se alimenta de `n_groups` y mean **calculados**, no de un dict pre-rellenado a mano. El error clásico es poner `random_split=False` sin verificar entidades únicas. Pregunta: con entities `["e1","e1"]` y random_split True, ¿qué falla primero — el conteo de grupos o la disyunción conceptual? Luego (E3): REQUEST_GROUP_IDS.
- **Code/output changes:** none

### S33-T4-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** REQUEST_GROUP_IDS. **Eco fuerte:** feedback y retro abren casi idénticos (“n_groups se calcula de entidades únicas; sin group ids se pide evidencia”). Retro salva con self-check de e1 en ambos folds.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin ids de entidad no hay CV confiable por grupo: se pide la lista, no se inventa el split ni se asume KFold “porque sklearn es fácil”. El error clásico es rellenar entities sintéticas al azar para forzar CONTINUE. Pregunta: ¿qué pasaría si e1 apareciera en train y valid del mismo fold, y cómo lo detectarías con `isdisjoint`? Ese hábito cierra el group CV del You Do.
- **Code/output changes:** none

### youDo (youDo) — **A**
- **Diagnosis:** Proyecto de cierre CP-N3-B sólido: framing → dummy+costo+regla → stump con thr defectuoso 0.9 → run log con beats_dummy/beats_rule → group CV. `context` ya subraya thr sensato y loguear aunque pierdas. Objectives, requirements (sin PII, sin fraud), portfolioNote y rubric (bonus de dual beats + group CV) alineados. Retrospective de defensa (~60 w) con tres preguntas (invariante, sintético vs real, frase de impacto medible) — cumple el patrón del spec.
- **Checklist:** context pass · goal pass · success partial (rubric, no output único — esperado en You Do) · constraints pass · retrospective pass
- **Severity residual:** none (P2 opcional: una línea en context recordando que thr=0.9 es defect **intencional** del starter, ya implícito en starterCode comments)
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order

### P0
- **Ninguno.** Cobertura de campos completa; integridad wrong≠right intacta; fade E1→E2→E3 real; riesgo demo/E1 de T3-B cerrado.

### P1
- **Ninguno bloqueante.** No hay unidad que falle el test de true-newbie en un ítem crítico.

### P2 (polish — Fixer R2)
1. **Eco feedback/retro (replace retro o expand feedback):** T1-A-E2, T1-A-E3, T2-A-E2, T2-B-E2, T3-A-E2, T3-B-E2, T4-A-E2, T4-A-E3, T4-B-E2, T4-B-E3  
2. **Feedback &lt;25 w (expand si se toca la unidad):** T1-A-E3, T2-A-E2, T2-A-E3, T2-B-E3, T3-A-E2, T3-B-E2, T4-A-E3 (~17 w, prioritario entre feedbacks), T4-B-E2, T4-B-E3  
3. **Retrospectives iDo cortas (expand + self-check):** T1-B-DEMO, T2-A-DEMO, T2-B-DEMO, T3-A-DEMO, T4-A-DEMO, T4-B-DEMO  
4. **Retrospectives weDo muy cortas:** T2-A-E2, T3-B-E2, T4-B-E1, T4-A-E2  
5. **Opcional longitud instruction (no bloquear):** varias E2/E3 ~25–39 w; legibles como pasos; no reescribir en masa

---

## Residual risks

1. **Eco feedback/retro:** en transfer units (T4-A-E3, T4-B-E3, T1-A-E3) el learner lee el mismo misconception dos veces; diluye la metacognición. Fixer: retro con principio + self-check **distinto** del bug aritmético del feedback.  
2. **Vocabulario técnico (beats_dummy, l2_sq, group CV):** correcto para nivel “Competente a experto”; los preambles ya anclan en cola de revisión — no diluir a jerga pura si se expanden retros.  
3. **You Do thr abierto:** sin test automático de thr “óptimo”, el learner puede hardcodear thr que maximice un solo número; rubric + retrospective + portfolioNote ya empujan beats_rule y comparación honesta — no tocar starter thr=0.9 (defect intencional).  
4. **S33 como gold tone de código:** el Fixer R2 **no** debe reescribir fixtures ni outputs canónicos al pulir prosa; riesgo de regresión de asserts alto.  
5. **Longitud vs anti-bloat:** al expandir retros al piso 40–80, no convertir preambles en ensayos; preferir 1 frase de self-check + transfer.  
6. **Sin PII real** en fixtures — mantener CASO-LIM-033 sintético en cualquier ejemplo nuevo del Fixer.

---

## Integrity spot-checks (starter ≠ solution)

| Unit | Starter trap | Solution signal |
|------|--------------|-----------------|
| T1-A-E1 | `len(y)-1`, `fraud_name is True` | PASS con 0.25 / False |
| T1-B-E1 | `min`, cost=0, `v < 1` | PASS 0.667 / cost 1 / rule 1.0 |
| T2-A-E1 | thr 0.5, penalty none, L1 | PASS thr 0.6 / l2 / Σw²=5 |
| T2-B-E1 | sorted asc, causal True | PASS shared_phone top / causal False |
| T3-A-E1 | `x < thr`, `sum > len` | PASS [0,1] / maj 1 |
| T3-B-E1 | thr 0.15, meets=is_overfit | PASS gap 0.05 controlado |
| T4-A-E1 | `beats is True` | PASS con beats False |
| T4-A-E3 | exige victoria; missing→CONTINUE | CONTINUE CONTINUE REJECT REQUEST |
| T4-B-E1 | len(entities), round 2, disjoint=True | PASS n_groups 3 / mean 0.65 / isdisjoint |

**No wrong≈right integrity defects found.**

---

## Fixer R2 handoff (checklist)

- [ ] **No** reintroducir campos: ya están; solo polish P2  
- [ ] Priorizar replace de retrospectives con eco fuerte (lista P2 #1)  
- [ ] Expandir feedbacks &lt;25 w solo en unidades ya tocadas  
- [ ] Expandir iDo retros cortas con self-check + puente We Do  
- [ ] Outputs y asserts **intactos**  
- [ ] Español PE profesional; sin PII real; sin generators  
- [ ] Fade E1→E2→E3 de prosa **ya diferenciado** — no clonar al expandir  
- [ ] Build/typecheck de la sección tras editar el source  

Section 33 exercise pedagogy review complete. Ready for the Fixer prompt.
