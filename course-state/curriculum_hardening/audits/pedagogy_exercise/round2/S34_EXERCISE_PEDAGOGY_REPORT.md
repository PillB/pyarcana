# S34 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Métricas, desbalance, calibración y umbrales
- **shortTitle:** Métricas y umbrales
- **id:** `cv-ai-integration`
- **index:** 34
- **source:** `src/lib/course/sections/s34-cv-ai-integration.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A confusión/F1/AP · T1-B precision@k/capacidad · T2-A pesos/resample CV-safe · T2-B prevalencia · T3-A Brier/reliability · T3-B calibrador holdout · T4-A thr por costo · T4-B abstención/sensibilidad
- **hilo:** cierre **CP-N3-B** del **Relationship Investigation Workbench** (Red Andina, ficticia); mini-set sintético **CASO-LIM-034** (scores S33 → cola de revisión humana); `REJECT_*` / `REQUEST_*`; *score ≠ fraude* ni parentesco; sin PII real
- **Round 1 context:** `round1/S34_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts and feedback↔retrospective Jaccard measured only as gates (no bulk prose generation).
- Integrity: outputs canónicos y DEFECT nombrados verificados por lectura (F1=2/3 + tn=1; thr 0.6 en 4 pts; You Do 5 pts capacity 2).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0/P1 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–9 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción | Pass (bullets ~38–59 w; spec permite “4 short bullets”) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas en prosa | Pass; algunas instruction E1 cortas (~16–25 w) pero legibles |
| **E1→E2→E3 fade** | Superficies distintas: E1 repara fórmula/cálculo; E2 triages válido/adverso/missing; E3 CONTINUE/REJECT/REQUEST fail-closed | Pass — no clones numéricos; códigos REJECT/REQUEST por subtema |
| **Feedback vs retrospective** | En **~14** unidades el retro **repite** el feedback (mismo principio, poca metacognición extra) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ~26–35 w (spec 40–80); iDo demos 27–46 w (solo T1-A-DEMO holgado en rango). Principio + misconception + puente suelen estar; a menudo falta self-check o expansión | Residual **P2** |
| **iDo why** | Todos en o cerca del rango 40–90 (~43–57 w) | Pass |
| **Código/outputs** | Coherentes con theory y CASO-LIM-034; DEFECT bien nombrados; thr 0.6 (demo/E1 4 pts) vs thr ~0.9 (You Do 5 pts) **advertido** en preamble T4-A-DEMO y context youDo | Pass |
| **youDo frame** | context, objectives, requirements, rubric, portfolioNote, retrospective de defensa (~58 w) | Pass — fuerte |
| **Hints E3** | Aún cerca del predicado (aceptable como andamiaje mínimo de transfer) | Residual **P2** opcional |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros cortas, polish menor). No hay P0 de cobertura ni defectos que invaliden outputs canónicos. Un Fixer Round-2 debería priorizar **diferenciar feedback (inmediato/bug) vs retrospective (principio + self-check + transferencia)** en las unidades con eco alto, no reescribir el andamiaje de código.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad) |
| **D** | Falla el test de true-newbie en un ítem crítico |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S34-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: confusión completa, F1 0.667, AP 0.833, `accuracy_only False`. Preamble pide predicción y ancla cola de Red Andina. `why` (~57 w) en rango. Retrospective repara “F1 ≠ P+R” y “AP ≠ accuracy”; puente a We Do.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S34-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito `|f1−2/3|<1e-9` y `tn==1`; instruction nombra ambos DEFECT; feedback distingue media armónica vs suma; retro no es eco total (j≈0.23) y puente a E2. Retrospectiva ~35 w (bajo el piso formal, pero cierra).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand opcional):**  
  F1 castiga el desbalance entre P y R; sumar no es media armónica. El error clásico es ignorar TN porque «no va a la cola». Pregunta: con P=0.5 y R=1.0, ¿por qué 2/3 y no 0.75? Siguiente (E2): triages PASS / REJECT / MISSING sobre counts.
- **Code/output changes:** none

### S34-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Predicado invertido (PASS si `accuracy_only True`) — independent limpio. Éxito canónico. Feedback y retro se solapan en “ausencia ≠ breach de contenido”.
- **Checklist:** all pass; retro partial (eco + ~30 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Tres rutas distintas protegen el informe: evidencia incompleta, evidencia mala y evidencia usable. El error clásico es mezclar «falta `tp`» con «accuracy sola». Pregunta: si `region` falta pero `tp` está, ¿debe fallar el predicado de PASS? Luego (E3): CONTINUE / REJECT / REQUEST.
- **Code/output changes:** none

### S34-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real a fail-closed; self-check a compliance presente. Feedback≈retro sobre inventar `tp=0` (j≈0.40).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  REQUEST_CONFUSION protege el informe a compliance: ausencia no es «cero observados». Fallar abierto (CONTINUE ante missing) fabrica matriz. Pregunta: ¿qué frase dirías si el reporte llega sin counts? En T1-B el mismo patrón protege capacity, no confusión.
- **Code/output changes:** none

### S34-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** precision@3 / recall@3 / overload claros. Preamble de “tope diario” excelente. Retrospective corta (~30 w) sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Top-k sin capacidad es métrica de pizarra, no de turno. El error clásico es dividir recall entre k. Pregunta: si n_pos=2 y el top-3 atrapa ambos, ¿recall@3 puede ser 1.0 con precision 0.667? We Do: corrige denominador y triages overload.
- **Code/output changes:** none

### S34-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT perfecto (recall / k). Feedback razona denominadores; retro muy corta (~22 w) y sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  k mide el recorte del top; n_pos mide el universo de positivos reales. Confundirlos rompe el informe del turno aunque el print «se vea numérico». Siguiente (E2): assess de overload vs missing capacity — no re-enseñar la fórmula.
- **Code/output changes:** none

### S34-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS si load > capacity — adverso limpio. Feedback y retro casi clonan “cola brillante / saturada” (j≈0.50).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Capacity es un predicado de producto, no decoración del JSON. El error clásico es maximizar recall@k e ignorar headcount. Pregunta: con load=8 y capacity=10, ¿por qué PASS aunque precision no sea 1.0? Luego (E3): REQUEST_CAPACITY fail-closed.
- **Code/output changes:** none

### S34-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer a REQUEST_CAPACITY; self-check de thr sin tope presente. Eco con feedback sobre default “100 alertas/día” (j≈0.53).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Pedir capacity es más seguro que un default generoso que quema al equipo de 3 analistas. El error clásico es CONTINUE ante missing y “seguir el thr del notebook”. Pregunta: sin tope del turno, ¿qué thr defenderías ante producto? En T2-A el mismo fail-closed protege el plan de fold, no la cola.
- **Code/output changes:** none

### S34-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** weight_ratio 9.0 + plan train-only claros. Preamble de “dos cajas” implícito en predicción. Retro corta (~29 w).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  CV-safe = rebalance en train, test intacto. El error clásico es balancear todo el CSV al inicio. Pregunta: si el test del fold «ve» copias sintéticas, ¿qué se infla — train loss o métrica de validación? We Do: corrige el flag invertido y cierra la política de pesos.
- **Code/output changes:** none

### S34-T2-A-E1 (weDo, guided) — **B+**
- **Diagnosis:** `resample_train_only = resample_global` — defecto booleano ideal. Feedback y retro cercanos en “negación del global” (j≈0.44); aprendizaje del flag es sólido.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un solo booleano al revés convierte un plan CV-safe en fuga de pipeline. El error clásico no es “olvidar weights”; es copiar el flag global. Siguiente (E2): assess de política de fold con n0/n1 auditables.
- **Code/output changes:** none

### S34-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS con resample_global True. Retro corta (~20 w); eco parcial con feedback sobre n1.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin n1 no hay weight ratio defendible ante auditoría. El error clásico es «poner pesos a ojo» o inventar minority counts. Pregunta: si n0=n1, ¿el plan sigue documentando desbalance? Luego (E3): REQUEST_WEIGHTS.
- **Code/output changes:** none

### S34-T2-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Fail-closed limpio; self-check “¿qué métrica se infla con resample global?” diferencia bien del feedback. Transfer auténtico.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (retro ~26 w → +1 frase de puente a prevalencia T2-B)
- **Proposed residual:** none required
- **Code/output changes:** none

### S34-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** prev 0.025 / all-neg 0.975 / accuracy_enough False. Preamble de ancla de base rate excelente. Retro corta (~29 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Sin base rate, precision no es comparable entre periodos. El error clásico es celebrar accuracy alta con clase rara. Pregunta: si la prevalencia cae a la mitad y el thr no se mueve, ¿precision suele subir o bajar? We Do: fuerza accuracy_enough=False y pide base rate.
- **Code/output changes:** none

### S34-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** accuracy_enough=True — DEFECT guiado perfecto. Feedback≈retro sobre all-neg (j≈0.56).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  All-neg accuracy ≈ 1 − prev: brilla cuando la clase positiva es rara y no prioriza cola. El error del starter es dejar el panel ejecutivo feliz con 97.5%. Siguiente (E2): assess con period/region de contexto, no re-calcular el all-neg.
- **Code/output changes:** none

### S34-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess de prevalencia honesta. Feedback≈retro “comparar precision entre trimestres” (j≈0.52).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La prevalencia del period sintético es el ancla del slide, no un opcional. Omitirla hace «ganar» al modelo por cambio de población. Pregunta: ¿por qué `all_neg_acc` solo no basta como gate de PASS? Luego (E3): REQUEST_BASE_RATE.
- **Code/output changes:** none

### S34-T2-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Frase de portafolio en retro + self-check de thr con prevalencia — fuerte. Eco parcial con feedback (j≈0.49) pero el self-check aporta metacognición.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (acortar feedback si se expande retro — o dejar)
- **Proposed residual:** none required
- **Code/output changes:** none

### S34-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Brier 0.175 + bin 0.85 vs 0.5 — excelente anti-“score 0.8 = 80% de culpa”. Retro ~32 w.
- **Checklist:** all pass; retro partial (longitud / sin self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Calibración se mide en conjunto y en bins, no en un solo acierto. El error clásico es «p=1, y=1 ⇒ ya está». Pregunta: ¿un Brier bajo con bins desalineados cuenta la misma historia que bins perfectos con Brier alto? We Do: Brier medio 0.25 en un mini-set equilibrado.
- **Code/output changes:** none

### S34-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Brier de un punto (1,1) — DEFECT ideal. Feedback y retro **casi idénticos** (j≈0.68) — peor eco de la sección.
- **Checklist:** all pass; retro partial (eco fuerte)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un Brier de un caso no demuestra calibración del modelo. Elegir el ejemplo que luce bien es autoengaño de notebook, no de workbench. Pregunta: con ps=[0.5,0.5] y ys=[0,1], ¿por qué 0.25 y no 0? Siguiente (E2): assess con umbrales del contrato (no re-promediar a mano).
- **Code/output changes:** none

### S34-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS si desalineado — adverso limpio. Eco calibración vs discriminación (j≈0.58); retro ~22 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Bins alineados con Brier alto (o al revés) cuentan historias distintas: calibración vs discriminación. El error clásico es mirar solo un número del dashboard. Pregunta: con brier=0.1 y |mean_p−freq|=0.05, ¿qué ruta imprime y por qué no basta el Brier solo? Luego (E3): REQUEST_BRIER.
- **Code/output changes:** none

### S34-T3-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Frase “score no afirma culpa” + self-check “clip ≠ calibración” — fuerte cierre de T3-A. Eco parcial con feedback.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S34-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** Mapa afín holdout_v1 claro; anti-train_in_sample en preamble. Retro muy corta (~27 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Clip recorta rango; calibración aprende la relación score–frecuencia. El error clásico es fit in-sample. Pregunta: si `calibrator_set=train_in_sample`, ¿qué código de política activa el workbench? We Do: repara el mapa y cierra la política del set.
- **Code/output changes:** none

### S34-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Clip sin a·x+b — DEFECT excelente. Instruction corta (~19 w) pero pasos suficientes. Eco “clip ≠ calibración” (j≈0.60).
- **Checklist:** all pass; retro partial (eco); instruction partial (corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Clip sin coeficientes no mueve mean_p hacia freq: solo acota el dominio. El error clásico es «ya está en [0,1]». Pregunta: con raw=1.5, a=0.8, b=0.1, ¿por qué cal=1.0 y no 1.3? Siguiente (E2): assess del nombre del set, no del aritmética.
- **Code/output changes:** none

### S34-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS con train_in_sample. Eco fuerte con feedback (j≈0.67); retro ~20 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin set versionado no hay auditoría de «dónde se ajustó». Callar el holdout es riesgo de compliance, no de estilo. Pregunta: si raw y cal tienen distinta longitud, ¿debe PASS aunque el set diga holdout_v1? Luego (E3): REQUEST_CAL_SET.
- **Code/output changes:** none

### S34-T3-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Política de una línea + self-check thr de T4 si calibras in-sample — excelente transferencia entre subtemas. Eco parcial con feedback.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S34-T4-A-DEMO (iDo) — **A−**
- **Diagnosis:** choose_thr → 0.6 cost 0 thr-v1. Preamble **advierte no memorizar 0.6** (crítico para You Do). Retro ~30 w sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual (optional expand):**  
  Thr versionado = auditoría y rollback cuando cambia headcount o prevalencia. El error clásico es thr fijo 0.5. Pregunta: si capacity cae a 1, ¿el thr óptimo suele subir o bajar? We Do: implementa la búsqueda — no hardcodees el thr del demo.
- **Code/output changes:** none

### S34-T4-A-E1 (weDo, guided) — **A**
- **Diagnosis:** thr fijo 0.5 — DEFECT guiado perfecto. Feedback razona thr 0.6 bajo capacity 2; retro de c_fn↑ diferencia bien (j≈0.04). Mejor par feedback/retro de la sección.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S34-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS con thr_id default. Eco thr-v1/v2 y headcount (j≈0.68).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  thr-v1 vs thr-v2 permite rollback cuando el equipo pasa de 10 a 6 analistas. Un thr_id «default» sin cost no se audita. Pregunta: si cost is None pero thr_id=thr-v1, ¿qué ruta debe devolver assess? Luego (E3): REQUEST_COST_MATRIX.
- **Code/output changes:** none

### S34-T4-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Frase a auditor + self-check capacity a la mitad — fuerte. Eco parcial con feedback.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S34-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** abstain / n_flip / force_label False; cierre de CP-N3-B. Retro ~28 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Abstener es salida de producto, no un error del pipeline. El error clásico es force_1 en zona gris. Pregunta: con score 0.55, low=0.3 y high=0.7, ¿qué decide el workbench y por qué no es fraude? We Do: decide(0.5)==abstain y política fail-closed.
- **Code/output changes:** none

### S34-T4-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** return "review" en banda — DEFECT ideal. Instruction muy corta (~16 w) pero tres pasos suficientes. Feedback y retro bien diferenciados (j≈0.10).
- **Checklist:** all pass; instruction partial (corta)
- **Severity residual:** P2 opcional (añadir paso de no devolver labels binarios)
- **Proposed residual:** none required
- **Code/output changes:** none

### S34-T4-B-E2 (weDo, independent) — **B+**
- **Diagnosis:** PASS con force_1. Feedback menciona skip en 0.5 como breach (buen rigor); retro no eco total. Nota R1: fixture no incluye decision=skip — opcional.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (fixture adverso skip en banda; no bloqueante)
- **Proposed residual:** none required for prose; optional code edgeCase only if Fixer wants rigor extra
- **Code/output changes:** none (fixtures actuales correctos para PASS/REJECT/MISSING)

### S34-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Cierre del arco CP-N3-B; retro con promesa “ranking para humanos” + self-check README junto a thr-v1. Transfer auténtico y no clon de T1-A-E3 en escena.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### youDo — Workbench: métricas + thr versionado + abstain (cierre CP-N3-B) — **A**
- **Diagnosis:** Marco **sólido**: context ancla CASO-LIM-034 y advierte thr ~0.9 vs 0.6 del demo; objectives/requirements/rubric/portfolioNote alineados; starter con cuatro DEFECT (choose_thr fijo, decide→review, thr_id default, accuracy_only True). Retrospective de defensa (~58 w) con thr hallado, Brier/abstain y puente S35 — cumple checklist post-build.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (portfolioNote y retro se solapan levemente en S35 — aceptable)
- **Code/output changes:** none

---

## Priority order (Round-2 Fix)

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están cerrados.

### P1
- **Ninguno bloqueante.** No hay unidad que falle el test de true-newbie en ítem crítico (éxito invisible o wrong≈right).

### P2 (calidad — orden sugerido)
1. **Romper eco feedback↔retrospective** en unidades con jaccard alto (~≥0.5), priorizando:  
   **T3-A-E1**, **T3-B-E2**, **T4-A-E2**, **T3-A-E2**, **T2-B-E1**, **T1-B-E2**, **T1-B-E3**, **T3-B-E1**, **T2-B-E2**, **T3-A-E3**, **T4-A-E3**, **T1-A-E3**.  
   Regla: feedback = bug inmediato + porqué del breach; retrospective = principio + misconception + self-check o transferencia (sin clonar la primera frase del feedback).
2. **Expandir retrospectives cortas** (<~30–35 w) hacia 40–80, con self-check de una línea:  
   iDo: T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B demos.  
   weDo: T1-B-E1, T2-A-E2, T3-A-E2, T3-B-E2, T4-B-E1.
3. **Opcional:** fixture adverso `decision=skip` en banda en T4-B-E2 (feedback ya lo nombra; no es P1).
4. **Opcional:** aflojar hints E3 que casi repiten el predicado (dejar una miga, no la solución completa).

### No tocar sin execute-and-diff
- Código starter/solution/outputs canónicos (`S34-T*-* PASS`, triples CONTINUE/REJECT/REQUEST, thr 0.6 en 4 pts).
- Advertencias thr 0.6 vs You Do 5 pts — ya están; no borrarlas.

---

## Residual risks
- **Patrón E2/E3 repetido 8 veces:** el código ya diferencia códigos REJECT/REQUEST; la prosa R1 ya diferencia escena por subtema. El riesgo residual es **eco local feedback/retro**, no clones entre subtemas. Fixer debe editar unidad a unidad.
- **Thr 0.6 vs ~0.9:** mitigado en T4-A-DEMO preamble y youDo context/starter; no reintroducir thr hardcodeado en solución del You Do.
- **Lenguaje de fraude:** la sección mantiene score ≠ fraude; no diluir en polish de retro (especialmente T4-B y youDo).
- **Longitudes:** al expandir retros, no convertir preambles en ensayos; mantener instruction solo-pasos.
- **Anti-aberración:** implementar residuales a mano desde este ledger; no script de “si jaccard>0.5 replace template”.

---

## Counts summary for Fixer (Round 2)
| Bloque | Unidades | Estado R1 | Residual R2 prioritario |
|--------|----------|-----------|-------------------------|
| iDo | 8 | preamble/why/retro presentes | expand retro corta + self-check (7 demos) |
| weDo | 24 | title/preamble/instruction/retro presentes | diferenciar feedback vs retro (~12–14 ecos); expand retros cortas |
| youDo | 1 | retrospective presente | none |
| **Total** | **33** | P0/P1 cobertura **cerrados** | solo P2 calidad; sin cambios de output |

---

## Acceptance snapshot (Fixer checklist, post-R1)
- [x] Every non-trivial unit has `preamble` + `retrospective`
- [x] We Do has short `title`
- [x] `instruction` is task-only
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used (this review)
- [ ] Round-2 polish: feedback≠retrospective en ecos altos; retros hacia 40–80 w (opcional pero recomendado)

Section 34 exercise pedagogy review complete. Ready for the Fixer prompt.
