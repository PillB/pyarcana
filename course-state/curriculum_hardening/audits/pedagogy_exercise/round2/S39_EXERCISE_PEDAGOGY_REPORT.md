# S39 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Responsible ML Case Triage y cierre de nivel
- **shortTitle:** Case Triage N3
- **id:** `integrator-phase2`
- **index:** 39
- **source:** `src/lib/course/sections/s39-integrator-phase2.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A pipeline canónico · T1-B registry/owners/semver · T2-A evidence packet · T2-B decisión/override/apelación · T3-A checklist riesgo/fairness · T3-B modos ops/rollback · T4-A aceptación/regresión/CF-3 · T4-B cards/valor/post mórtem
- **hilo:** **Responsible ML Case Triage** sintético **CASO-LIM-039** (onboarding digital, fintech ficticia en Lima); intake→ER→grafo→features→score→cola; *score ≠ fraude ni parentesco*; `auto_fraud=False`; cierre **CP-N3-C** + smoke **S27–S39** + expediente **CF-3** sin autodeclarar promoción
- **Round 1 context:** `round1/S39_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 pre / 40–80 retro / 40–100 instruction / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, why, starter DEFECT, solution output).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposed text.
- Word counts and feedback↔retrospective Jaccard measured only as gates (no bulk prose generation).
- Integrity: DEFECT nombrados, outputs canónicos y tokens fail-closed verificados por lectura (no execute-and-diff requerido para este informe).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0/P1 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–7 palabras, español PE, skill-specific | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (~39–57 w; spec permite “4 short bullets”); iDo narrativos con predicción (~41–78 w) | Pass (bullets holgados en piso formal de 80 w; checklist de contenido OK) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas en prosa | Pass; instructions ~22–49 w (algunas E1/E2 bajo el piso 40 w pero legibles) |
| **E1→E2→E3 fade** | Superficies distintas: E1 repara predicado; E2 triages válido/adverso/missing; E3 CONTINUE/REJECT/REQUEST fail-closed | Pass — no clones numéricos; preambles T3-B-E1 (prioridad incidente) vs E2 (tabla de modos) **diferenciados** como pedía R1 |
| **Feedback vs retrospective** | Eco alto (Jaccard ≥0.35) en **~8** unidades; en varias el retro repite el feedback sin self-check | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ~13–34 w (spec 40–80); iDo 20–47 w (solo T1-A-DEMO holgado). Principio + misconception + puente suelen estar; a menudo falta self-check o 1 frase de expansión | Residual **P2** |
| **iDo why** | Todos en rango 40–90 (~44–66 w) | Pass |
| **Código/outputs** | Coherentes con theory y CASO-LIM-039; DEFECT bien nombrados; tokens canónicos intactos | Pass — no proponer cambios de output |
| **youDo frame** | context, objectives, requirements, rubric, portfolioNote, retrospective de defensa (~63 w) | Pass — fuerte |
| **Hints E3** | Cercanos al predicado (aceptable como andamiaje mínimo de transfer) | Residual **P2** opcional |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros cortas, polish de self-check). No hay P0 de cobertura ni defectos que invaliden outputs canónicos. Un Fixer Round-2 debería priorizar **diferenciar feedback (inmediato/bug) vs retrospective (principio + self-check + transferencia)** y alargar retros sub-piso en E1 y demos iDo cortas — no reescribir el andamiaje de código.

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

### S39-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: stages canónicos, `needs_review`, `auto_fraud False`. Preamble (~78 w) con predicción de salida y ancla fintech Lima. `why` (~66 w) en rango, puente a We Do. Retrospective repara “score = fraude detectado” y cierra con hábito de fronteras.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S39-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito `S39-T1-A PASS` y política ética; instruction nombra `reversed(CANON)`; feedback razona fronteras; retro no es eco (j≈0.13) y puente a E2. Retrospectiva ~29 w (bajo el piso formal).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand opcional):**  
  Orden canónico + `needs_review` + `auto_fraud False` = frontera del triage: el score solo prioriza cola. El error clásico es invertir la comparación o “arreglar” el fixture. Pregunta: si ER va después del grafo, ¿qué miente — features o el revisor? Siguiente (E2): separar orden malo de schema incompleto.
- **Code/output changes:** none

### S39-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas (PASS / REJECT_STAGE_ORDER / MISSING:label_space) excelentes. Instruction ya nombra `auto_fraud is False`. Feedback y retro se solapan en “señales distintas” (j≈0.40).
- **Checklist:** all pass; retro partial (eco + ~28 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Tres tokens distintos protegen tres tickets distintos: schema incompleto, orden adverso y política de score. El error clásico es un solo `REJECT` genérico. Pregunta: si falta `label_space`, ¿por qué no inventar `fraud_certainty`? Luego (E3): alcance de ER sin parentesco.
- **Code/output changes:** none

### S39-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer auténtico a fail-closed con cuatro tokens; multi-defecto en starter. Feedback y retro se diferencian (j≈0.19); puente a You Do presente. Retro ~34 w (cerca del piso).
- **Checklist:** all pass
- **Severity residual:** P2 opcional (self-check)
- **Proposed residual (optional self-check):**  
  Fail-closed protege al revisor: pide lo que falta y rechaza parentesco inventado. El error clásico es `CONTINUE` silencioso. Pregunta: ¿missing de stages es lo mismo que claim de familia? En el You Do el mismo principio vive en packet y audit.
- **Code/output changes:** none

### S39-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Registry, owners, `major_on_breaking` claros. Preamble con predicción de `registry_ok` sin owner. Retrospective corta (~26 w) sin self-check; repite el puente “We Do major/owner” ya dicho en `why`.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Owner + semver = contrato de evolución del triage. Confundir patch con major deja packets de cola con paths de grafo muertos. Pregunta: si `graph_schema` elimina un tipo de nodo, ¿qué bump firmas ante investigations? We Do: predicado major, tres rutas y registry de cuatro artefactos.
- **Code/output changes:** none

### S39-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT `bump == "minor"` perfecto. Feedback ancla regresión S27–S39; retro corta (~23 w) y sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Breaking → major + owner contactable. El error clásico es «es solo un campo del grafo» y publicar patch. Pregunta: ¿quién recibe el semver en el on-call de la cola? Siguiente (E2): tres rutas (política vs missing de owner).
- **Code/output changes:** none

### S39-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS / REJECT_BUMP_POLICY / MISSING:owner limpio. Feedback≈retro “chequeos independientes” (j≈0.55).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Gente (owner) y contrato (bump) se fallan por caminos distintos: un ticket de staffing no es un ticket de semver. El error clásico es inventar owner por defecto para “pasar” el release. Pregunta: si el owner está vacío pero el bump es major, ¿qué token gana? Luego: registry de cuatro artefactos como conjunto.
- **Code/output changes:** none

### S39-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer de conjunto + off-by-one; excelente. Feedback y retro casi clonan “registry es conjunto / off-by-one” (j≈0.61); CF-3 solo en retro (bien).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El registry se libera entero o se escala: un hueco de owner no se “compensa” con tres artefactos verdes. El off-by-one miente sobre cobertura ante auditoría. Pregunta: ¿qué miraría primero un revisor de CF-3 — happy path o owners vacíos? En el You Do el mismo conjunto vive en system-card y manifest.
- **Code/output changes:** none

### S39-T2-A-DEMO (iDo) — **A−**
- **Diagnosis:** Packet keys, layers, `score_alone_ok False`, bucket, load — rico y alineado a theory. Preamble pide bucket para 0.81. Retro ~31 w (ligeramente corta) pero repara “encolar con 0.99”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Packet = hechos + path + score (+ incertidumbre). El error clásico es encolar solo con 0.99 y llamar eso workbench. Pregunta: con thr_hi=0.75 y capacity=3, ¿por qué `within_capacity True` con dos `queue_now`? We Do: predicado mínimo, empty vs missing, capas + uncertainty.
- **Code/output changes:** none

### S39-T2-A-E1 (weDo, guided) — **B+**
- **Diagnosis:** DEFECT `score > 0` clásico y didáctico. Feedback ancla workbench HITL; retro corta (~21 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Cuatro piezas mínimas del packet: sin path ni evidencia el revisor no puede citar. El error clásico es confiar en un score alto. Pregunta: ¿`score=0.99` con `evidence=[]` es PASS? Siguiente: distinguir lista vacía de clave ausente.
- **Code/output changes:** none

### S39-T2-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Evidence vacía vs path ausente bien enseñados; feedback y retro se diferencian bien (j≈0.05). Retro ~21 w corta pero con principio claro.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Missing pide schema; incomplete rechaza basura. El revisor gana tiempo si el token es honesto. Pregunta: evidence `[]` y path omitido — ¿mismo ticket de remediación? Luego: uncertainty y capas de explicación (S35).
- **Code/output changes:** none

### S39-T2-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer a capas/uncertainty; starter layers=1. Feedback y retro alineados sin clon total (j≈0.32); puente You Do. Bien.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (self-check)
- **Proposed residual (optional):**  
  Capas sin evidencia son teatro. El error clásico es CONTINUE con layers=1. Pregunta: ¿puedes inventar `in_distribution` para “completar” capas? En el You Do packet y cards deben contar la misma historia.
- **Code/output changes:** none

### S39-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Override a skip con audit y n_overrides claros. Preamble con predicción `human=None`. Retro muy corta (~23 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Humano gana al auto y deja rastro auditado. El error clásico es override silencioso (HITL cosmético). Pregunta: si `human=None` y score=0.9, ¿qué acción final ves y por qué? We Do: precedencia, apelación con segundo revisor y fail-closed de audit.
- **Code/output changes:** none

### S39-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT ignora `human_action` — perfecto. Feedback fuerte; retro mínima (~13 w) casi solo “puente a E2”.
- **Checklist:** all pass; retro partial (muy corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Precedencia humana es el núcleo del triage responsable: el score sugiere, no ordena al revisor. El error clásico es dejar `final = auto` aunque haya skip humano. Pregunta: ¿override sin cambiar la acción final engaña al audit? Siguiente: apelación exige segundo revisor.
- **Code/output changes:** none

### S39-T2-B-E2 (weDo, independent) — **B+**
- **Diagnosis:** queue / skip / MISSING:second_reviewer; instruction acortada a “tres salidas de assess” (R1 P2 cerrado). Eco moderado feedback/retro (j≈0.38).
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Apelación = segundo par de ojos documentado, no un `reopen` mágico. El error clásico es reabrir sin `second_reviewer`. Pregunta: ¿por qué el mismo revisor no basta para el expediente? Luego: audit de feedback sin leakage.
- **Code/output changes:** none

### S39-T2-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** LOGGED / REJECT_NO_AUDIT / REQUEST_FEEDBACK_ID; leakage_care en solution (rama no ejercitada en prints — residual de integridad documentado, no bloquear). Retro con puente You Do.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (edgeCases leakage_care; self-check)
- **Proposed residual:** none required for prose; opcional documentar `leakage_care False` en `edgeCases` (ya listado)
- **Code/output changes:** none

### S39-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Checklist firmable, predicción secrets. Why en rango. Retro ~28 w sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Release del triage es política firmable, no solo métrica de modelo. El error clásico es tratar secrets como «detalle de DevOps» compensable con AUC. Pregunta: si `secrets_in_repo=True` y todo lo demás verde, ¿`risk_release_ok`? We Do: predicado, missing vs reject y fairness por slice.
- **Code/output changes:** none

### S39-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT sin `not secrets` se manifiesta bien con fixture limpio (meets=False). Feedback fuerte; retro mínima (~14 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `not secrets_in_repo` es hábito de release: un True bloquea aunque RBAC y PII estén verdes. El error clásico es leer el flag “en positivo” dentro del `all`. Pregunta: ¿un buen AUC limpia un secreto en el repo? Siguiente: secrets activos vs controles ausentes.
- **Code/output changes:** none

### S39-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS / REJECT_SECRETS / MISSING:rbac limpio. Retro ~14 w (muy corta); feedback ya lleva el peso metacognitivo.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Tokens distintos aceleran remediación: missing pide el control; secrets rechaza la violación. El error clásico es un `REJECT_RELEASE` genérico para ambos. Pregunta: ¿falta de RBAC se arregla igual que una API key en el repo? Luego: fairness de cola por slice, no culpa grupal.
- **Code/output changes:** none

### S39-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Fairness operativa con fp_rate por canal sintético; anti-misconception “slice culpable” fuerte en preamble y feedback. Retro con You Do (~29 w). Transfer auténtico.
- **Checklist:** all pass
- **Severity residual:** none (optional +self-check)
- **Proposed residual:** none required
- **Code/output changes:** none

### S39-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** human_only, rollback prev_model, priority incident_over_drift. Preamble pide modo solo-drift. Retro ~27 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Incident → human_only; drift → más abstención. Confundirlos deja el sistema en «casi normal» con fuego real. Pregunta: con solo drift alto, ¿rollback de modelo o `abstain_more`? We Do: prioridad, tabla de tres modos y rollback versionado.
- **Code/output changes:** none

### S39-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter prioriza drift; fixture con ambos True. Preamble bien diferenciado de E2 (prioridad única). Retro ~11 w — la más corta del lab.
- **Checklist:** all pass; retro partial (muy corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Orden de `if`s = política de seguridad: incident gana aunque drift también esté alto. El error clásico es “abstener un poco más” en pleno incidente. Pregunta: ¿por qué el throughput espera en human_only? Siguiente: tabla completa normal / drift / incident.
- **Code/output changes:** none

### S39-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tabla de tres salidas; preambles diferenciados de E1 (R1 residual de solape **mitigado en prosa**). Código aún solapa el bug de ramas; pedagogically OK como independent de tabla. Eco feedback/retro (j≈0.38).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La tabla del runbook es el contrato de ops: (F,F) normal, drift abstain_more, incident human_only. El error clásico es intercambiar ramas y mentir cuando hay fuego. Pregunta: con ambos True, ¿qué fila gana y por qué no basta “solo drift”? Luego: rollback versionado vs monitor de drift.
- **Code/output changes:** none

### S39-T3-B-E3 (weDo, transfer) — **B+**
- **Diagnosis:** ROLLBACK / REQUEST_PREV_MODEL / MONITOR; puente You Do `force_failure`. Eco moderado con feedback (j≈0.33).
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Rollback apunta a `prev_model_id` versionado; drift sin incidente no revierte a ciegas. El error clásico es STAY en current_model con incidente. Pregunta: sin prev, ¿inventas un id o pides REQUEST? En el You Do `force_failure` empuja a human_only con audit.
- **Code/output changes:** none

### S39-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Seis criterios, scope, CF-3 external, no self-declare. Preamble de “tú dejas expediente”. Retro muy corta (~20 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Expediente listo ≠ nivel cerrado: la promoción la confirma un evaluador externo. El error clásico es auto-PASS de promoción en el script. Pregunta: si `self_declared_promotion` fuera True, ¿qué diría el revisor de CF-3? We Do: membership de aceptación, gate_notes y demo paths.
- **Code/output changes:** none

### S39-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT `auto_fraud_ok` vs `no_auto_fraud_label` excelente. Feedback razona contrato de producto; retro ~13 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Aceptación = criterios citables con el string exacto del producto, no alias “casi iguales”. El error clásico es un e2e verde que aún declara fraude. Pregunta: ¿por qué no basta `auto_fraud_ok` como sinónimo? Siguiente: regresión y CF-3 sin autodeclarar promoción.
- **Code/output changes:** none

### S39-T4-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Corazón del cierre de nivel; feedback y retro bien diferenciados (j≈0.15); puente You Do al manifest. Sólido.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (self-check)
- **Proposed residual:** none required
- **Code/output changes:** none

### S39-T4-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Demo happy+override+ood_abstain; anti-happy-only. Feedback y retro cercanos en tema demo (j≈0.22) pero retro ancla You Do. Bien.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual (optional self-check):**  
  La demo demuestra control humano y abstención OOD, no solo que el score “funciona”. Pregunta: ¿por qué `ood_abstain` y no un alias vago `ood`? En el You Do los tres `demo_cases` son ese contrato.
- **Code/output changes:** none

### S39-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** Valor operativo, tres cards, post mórtem. Preamble con predicción blameless=False. Retro ~26 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Cards y valor operativo cierran el producto; el post mórtem cierra el incidente sin cacería de brujas. El error clásico es publicar solo AUC. Pregunta: ¿un post mórtem con `blameless=False` pasa `postmortem_ready`? We Do: set de cards, métricas de valor y tokens del post mórtem.
- **Code/output changes:** none

### S39-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT exige `ops` extra — didáctico. Feedback CF-3; retro ~13 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  model/data/system = paquete mínimo de límites y ownership. El error clásico es inventar una card `ops` o omitir `system` “porque sobra”. Pregunta: ¿una card extra compensa la falta de system ante CF-3? Siguiente: métricas de valor que negocio sí lee.
- **Code/output changes:** none

### S39-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS / REJECT_VALUE_METRICS / MISSING:value; anti-AUC-only. Eco feedback/retro “valor = cola” (j≈0.38).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Valor operativo del triage = cómo opera la cola (override_rate, tiempo de review), no un AUC offline suelto. El error clásico es enorgullecerse del ranking y omitir overrides. Pregunta: con solo `auc=0.91`, ¿qué token devuelves? Luego: post mórtem blameless con root_cause y actions.
- **Code/output changes:** none

### S39-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Cuatro rutas de post mórtem; cierre metacognitivo de sección fuerte. Feedback y retro se diferencian (j≈0.12); puente You Do. Transfer excelente.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S39-YOUDO (youDo) — **A**
- **Diagnosis:** Marco de proyecto excelente (context, objectives, requirements, rubric, portfolioNote, starter e2e con tres demo paths, audit, cards, manifest CF-3, force_failure→human_only). Retrospective de defensa (~63 w) con tres self-checks y prohibición de autodeclarar promoción — cumple el patrón del spec §8.3.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (no duplicar context en un campo preamble)
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos OK; no hay unidades que fallen el test true-newbie en un ítem crítico de schema o de tokens.

### P1
- **Ninguno bloqueante.** No hay ambigüedad de éxito, instruction confusa ni mismatch de output que impida completar el lab.

### P2 (calidad / metacognición — priorizar si hay presupuesto de fix)
1. **Retros E1 muy cortas (~11–21 w):** T2-B-E1, T3-A-E1, T3-A-E2, T3-B-E1, T4-A-E1, T4-B-E1 — expandir a 40–80 w con principle + misconception + self-check + bridge (textos propuestos arriba).
2. **Eco feedback≈retrospective (j≥0.35):** T1-A-E2, T1-B-E2, T1-B-E3, T2-B-E2, T3-B-E2, T3-B-E3, T4-B-E2 — reescribir retro para que no clone el feedback (feedback = por qué falló el bug; retro = qué queda + pregunta + transferencia).
3. **iDo retros cortas (~20–31 w):** T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B — +1 frase de self-check sin alargar el `why`.
4. **Opcional:** self-check en T1-A-E3, T2-A-E3, T4-A-E3; documentar `leakage_care` ya listado en edgeCases de T2-B-E3 (sin cambiar prints).

---

## Residual risks
- **Densidad N3:** S39 integra S27–S38; las preambles mitigan el ahogo, pero un newbie que salte theory aún puede atascarse en tokens — no es defecto de prosa residual, es de diseño de cierre de nivel.
- **Solape T3-B-E1/E2 (código):** mismos `mode` con bugs de prioridad/ramas; preambles ya diferencian *prioridad única* vs *tabla*. No reescribir starters salvo que el Fixer quiera un defect distinto en E2 (fuera de alcance de prosa).
- **T2-B-E3 leakage_care:** rama en solution no ejercitada en el print de las tres rutas; no cambiar output; edgeCases ya menciona `leakage_care False`.
- **Longitudes formales:** muchas preambles-bullet y retros están bajo el piso de palabras del spec; el checklist de contenido (contexto/meta/éxito/límites) **sí** se cumple. El Fixer R2 no debe inflar por relleno: solo añadir self-check y separar eco.
- **No tocar outputs canónicos** ni regenerar exercises.
- **You Do:** starter es un mini-producto; no competir con context alargando la retrospective (ya en rango y completa).

---

## Round-1 vs Round-2 (contrast only)
| Round 1 | Round 2 |
|---------|---------|
| 0 preambles / 0 titles weDo / 0 retrospectives | Campos presentes en 33/33 unidades |
| Instruction densa “ID · concepto + fixture” | Instructions solo-tarea, pasos numerados |
| You Do sin retrospective | Retrospective de defensa con 3 self-checks |
| P0 masivo de cobertura | Residuales **P2** de calidad (eco, longitud, self-check) |
| Solape T3-B-E1/E2 sin preambles distintos | Preambles diferenciados; solape de código aceptable |

---

## Fixer handoff notes
- Implementar solo expansiones/reemplazos de `retrospective` (y opcional polish de feedback) listados; **no** regenerar código ni cambiar outputs.
- Respetar longitudes del PEDAGOGY_EXERCISE_SPEC.md; prosa es-PE; fixtures sintéticos; cero PII real.
- Preferir **replace** de retro donde j feedback/retro es alto; **expand** donde solo falta longitud/self-check.
- Tras el fix: typecheck/static build de la sección.
- Closer del Fixer (cuando corresponda):  
  `Section 39 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.`

---

Section 39 exercise pedagogy review complete. Ready for the Fixer prompt.
