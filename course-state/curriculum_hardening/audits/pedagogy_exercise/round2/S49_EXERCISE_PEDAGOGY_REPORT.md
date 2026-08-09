# S49 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Agentes, herramientas y context engineering
- **shortTitle:** Agentes y tools
- **id:** `data-contracts` (archivo `s49-data-contracts.ts`; el **contenido** es agentes acotados, tools SRP, context engineering y HITL — **no** “data contracts” tabulares)
- **index:** 49
- **source:** `src/lib/course/sections/s49-data-contracts.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A workflow vs. agente · T1-B routing/planner/evaluator · T2-A tools SRP · T2-B schema/permisos/idempotencia · T3-A contexto JIT/checkpoint · T3-B compaction/LKG · T4-A budgets/stops · T4-B sandbox/HITL/recovery
- **hilo:** entidad ficticia **CASO-AYA-049** (Ayacucho) — agente que consulta casos y prepara reportes; no envía, no muta prod ni decide riesgo sin aprobación; gate **CP-N4-C**; **missing ≠ breach**; stdlib sin frameworks de agentes ni red abierta
- **Round 1 context:** `round1/S49_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# DEFECT`, solution output, why).
- Integrity traps checked live:
  1. **Starters invertidos sobre fixture válido:** E1 de cada subtema falla el PASS canónico (predicado que aprueba lo roto: path abierto, plan sobre max, god-tool, multi-efecto, overflow, drop de LKG, budget agotado, red open/replay). Correcto: el learner ve KEEP/STOP/DISABLE/… y debe reparar el cuerpo del contrato.
  2. **E2/E3 reutilizan el mismo bug de predicado** y cambian la **superficie** (tabla assess vs. códigos de acción). Fade de *código* es estructuralmente repetitivo; fade de *prosa* y de *decisión* es real (escenas por subtema: ADR / traza / registry / store / attention / LKG / budget / sandbox).
  3. **missing → CONTINUE en starters E3** en los 8 subtemas — defecto de promote silencioso bien nombrado; solution enruta RUN_AGENT_BASELINE / REPLAN / SPLIT / CLASSIFY / RETRIEVE / REVIEW / ASK_FOR_SCOPE / REQUEST_HUMAN_APPROVAL.
  4. **Frases de salida E3:** instruction dice `print(*results)` / códigos en orden — alineado al print real (gap Round-1 “meets_contract” **cerrado**).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–9 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈45–70 w; spec permite “4 short bullets”); iDo narrativos con predicción pedida (≈55–85 w) | Pass en estructura; iDo en el piso del rango 80–150 en varios, pero legibles y con “no escribas / predice” |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra el defect del starter; E2/E3 con menos migas de “por qué” | Pass; E2/E3 siguen una plantilla de 4 pasos muy estable (aceptable Master; residual **P2** de variedad) |
| **E1→E2→E3 fade** | Superficies distintas: predicado → assess PASS/breach/MISSING → decide CONTINUE/breach/rama. Escenas diferenciadas por subtema | Pass — no tres clones de *skill*; residual **código** repetido (mismo pred invertido en E1–E3) es patrón de sección Master, no bug de R2 |
| **Feedback vs retrospective** | Feedback razona principio + impacto al revisor/gate; en **~14/24** weDo el retro **repite** el feedback (mismo lead sentence; E3 peores). E3 suelen añadir self-check (mejor) | Residual **P2** sistemático; **P1** en T2-B-E3 / T3-A-E3 / T3-B-E3 / T4-A-E3 / T4-B-E3 donde eco ≈ copia |
| **Retrospective length** | weDo E1/E2 mediana ≈25–35 w (spec 40–80); E3 con pregunta ~32–50 w. iDo demos ~30–47 w | Residual **P2** (pocos **P1** de metacognición en temas de alto riesgo: ADR T1-A, idempotencia T2-B, HITL T4-B) |
| **iDo why** | Todos en o cerca del rango 40–90; anclan contrato del lab y puente a We Do | Pass |
| **Código/outputs** | Coherentes con theory y CP-N4-C; DEFECT bien nombrados; outputs canónicos preservados; starters fallan el fixture válido | none required |
| **youDo frame** | context con CP-N4-C, objectives, requirements, rubric, portfolioNote (BLOCKED→READY), starter calculado (mode, call_tool, budget, compact), retrospective de defensa (~73 w) | Pass — fuerte |
| **Hints E1** | Casi-solución (aceptable guided) | Residual **P2** opcional |
| **Hints E2/E3** | Dan la regla casi completa (andamiaje mínimo OK para Master) | Residual **P2** opcional |
| **Códigos de acción** | Intro de weDo y diccionario de theory traducen `KEEP_DETERMINISTIC_WORKFLOW` etc. a escena | Pass; carga cognitiva alta sigue siendo riesgo residual (no gap de campo) |
| **Id archivo vs contenido** | `data-contracts` / `s49-data-contracts.ts` vs título de agentes | No es gap de ejercicio; otra campaña |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal (title/preamble/instruction/retrospective) y amplió `why`/feedback. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro en E3, retros E1/E2 cortas sin self-check, instrucciones E2/E3 muy plantilla). **No hay P0** de cobertura ni defectos que invaliden outputs canónicos.

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

### S49-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example de ADR `workflow` / `agent_candidate` / `need_evidence` con predicción de cuatro `mode`+`reason`. Preamble ancla “métricas, no moda” y misconception “falta evidencia = agente”. `why` (~59 w) en rango con puente a We Do. Retro (~47 w) repara promote-por-descarte.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: self-check “si agent=0.99 y plan_bounded=False, ¿qué mode y por qué?”)
- **Code/output changes:** none

### S49-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito exacto `S49-T1-A PASS`; instruction nombra inversión del ADR y las cuatro anclas. Feedback con números del fixture (0.96 ≥ 0.9). Retro (~31 w) principio + error clásico + puente E2; sin self-check; bajo el piso 40 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Las cuatro anclas a la vez (pasos conocidos, ≤3 ramas, tool choice cierta, baseline ≥ agent) son el contrato de “no abras el loop”. El starter marca True justo cuando conviene KEEP. Pregunta: si baseline=0.96 y agent=0.9 con `known_steps`, ¿por qué PASS no es “anti-IA”? Siguiente (E2): válido / path abierto / missing `agent_success`.
- **Code/output changes:** none

### S49-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Fade real a tres rutas. Preamble “missing ≠ promover agente” excelente. Feedback ancla KEEP vs MISSING al revisor del ADR. Retro distingue medición vs path abierto; eco parcial del feedback.
- **Checklist:** all pass; retro partial (eco / longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un `agent_success` ausente no es un path abierto: es evidencia de medición incompleta. Path abierto (known_steps=False, agent > baseline) sí es KEEP. El error clásico es inventar 0.8 para “completar” la tabla. Pregunta: ¿en qué orden evalúas missing vs `workflow_preferred`, y por qué? Luego (E3): CONTINUE / KEEP / RUN_AGENT_BASELINE.
- **Code/output changes:** none

### S49-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer auténtico a códigos de promote. Starter missing→CONTINUE y pred invertido (promote silencioso). Preamble “no sigue con warning”. Retro con self-check KEEP vs RUN_AGENT_BASELINE — metacognición usable. Fade real.
- **Checklist:** all pass
- **Severity residual:** none (hints casi dan la regla — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S49-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Loop evaluator–optimizer con `max_iters` y `STOP_AGENT_LOOP`; predicción de traza corta vs larga. `why` denso con puente. Retro (~36 w) repara “casi listo ⇒ otra vuelta”; ligeramente bajo el piso 40.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Un agente sin cota no es “más inteligente”: es un while con factura. El error clásico es seguir porque el último score “iba mejorando”. Pregunta: con scores `[0.4, 0.5]` y `max_iters=2`, ¿qué token de stop imprime y por qué no CONTINUE? We Do: predicado, tres rutas y REPLAN_WITH_BOUNDS.
- **Code/output changes:** none

### S49-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter aprueba plan sobre max o eval fallida — excelente. Instruction guiada con las cuatro condiciones. Feedback con plan 3 ≤ max 5. Retro corta sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Cota + evaluator + outputs==plan son el contrato del loop, no logging. Si plan_steps=12 con max=5, el planner falla primero aunque el worker “quiera” seguir. Pregunta: ¿por qué `worker_outputs == plan_steps` importa además del score? Siguiente: PASS / STOP / MISSING:evaluator_pass.
- **Code/output changes:** none

### S49-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres trayectorias limpio / unknown+plan12 / sin evaluator. Feedback ≈ retro (STOP vs MISSING). Fade de prosa OK.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Ruta unknown + plan 12 es breach de cota; falta de `evaluator_pass` es incertidumbre de cierre — no asumas True “porque el worker terminó”. El error clásico es STOP por campo ausente. Pregunta: ¿qué imprime assess si solo falta la bandera de eval? Luego (E3): CONTINUE / STOP / REPLAN_WITH_BOUNDS.
- **Code/output changes:** none

### S49-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a operación del loop. Starter missing→CONTINUE. Retro con self-check “qué rol falla primero con plan 12”. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S49-T2-A-DEMO (iDo) — **A−**
- **Diagnosis:** Audit allow/disable de catálogo SRP vs god-tool. Preamble “descripción ≠ autoridad”. Retro (~30 w) corta; misconception “una tool para todo” claro.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual:** none required unless Fixer batch-expands iDo retros (opcional: “¿por qué `raw` en schema impide auditar el side effect?”)
- **Code/output changes:** none

### S49-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Predicado SRP estricto; starter aprueba multi-duty. Feedback ancla `get_case_status` vs `do_everything`. Retro sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Schema `{case_id}` + typed_errors + sin side_effect son el contrato, no el marketing del prompt. El starter aprueba god-tools. Pregunta: si responsibilities=1 pero schema=`{raw}`, ¿pasa is_srp_tool en este lab? Siguiente: PASS / DISABLE / MISSING:typed_errors.
- **Code/output changes:** none

### S49-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tabla válida / do_everything / sin typed_errors. Feedback bien diferencia DISABLE vs MISSING (y anticipa SPLIT). Retro eco de breach vs incertidumbre.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed residual:** expand retro con self-check “¿DISABLE por typed_errors ausente o MISSING?” (respuesta: MISSING en E2).
- **Code/output changes:** none

### S49-T2-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer SPLIT_TOOL_CONTRACT. Retro con self-check `{raw}` y least privilege. Feedback y retro comparten lead “Split no es burocracia / descomponer…” — eco leve.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed residual:** none required (opcional: feedback se queda en “promote silencioso del registry”; retro en self-check `{raw}`)
- **Code/output changes:** none

---

### S49-T2-B-DEMO (iDo) — **A**
- **Diagnosis:** Allowlist + store de idempotencia; tres dicts (ok, replay, forbidden). Preamble “retry ≠ doble effect”. `why` y retro anclan key⇒un effect. Puente claro a We Do.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S49-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Fixture con attempts=2, effects=1 (excelente trampa didáctica). Feedback distingue DENY por scope vs multi-efecto. Retro corta (“permiso y unicidad son puertas distintas”).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2 (casi P1 por criticidad de side effects)
- **Proposed retrospective (expand):**  
  Schema, scope granted, key no vacía, effects==1 y kind ∈ {retryable, terminal} son cinco puertas, no una. attempts puede ser 2 si el store reusa el effect. Pregunta: ¿por qué `error_kind="secret dump"` no es válido aunque el resto pase? Siguiente: PASS / DENY / MISSING:error_kind.
- **Code/output changes:** none

### S49-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Log limpio / prod:write basura / sin error_kind. Feedback y retro casi paralelos (breach vs incertidumbre de retry).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Scope denegado o multi-efecto es DENY de política; falta de kind es incertidumbre de retry — no ejecutes a ciegas. El error clásico es inventar `retryable` para forzar PASS. Pregunta: ¿en qué orden miras missing vs tool_call_ok? Luego (E3): CONTINUE / DENY / CLASSIFY_TOOL_ERROR.
- **Code/output changes:** none

### S49-T2-B-E3 (weDo, transfer) — **C**
- **Diagnosis:** Transfer real a CLASSIFY_TOOL_ERROR; starter missing→CONTINUE correcto. **Eco casi literal:** feedback y retrospective abren con la misma frase (“Clasificar el error es prerrequisito de retry; denegar es rechazo de política”). Self-check de attempts/effects es bueno pero no compensa el clone.
- **Checklist:** all pass; retro partial (eco fuerte) · feedback partial (bajo piso 25 w ~22)
- **Severity residual:** **P1**
- **Proposed feedback (expand, distinto del retro):**  
  CONTINUE solo con call limpia (schema, grant, key, un effect, kind tipado). DENY es rechazo de política (scope/effects). Falta kind no se “cura” reintentando: el log del revisor exige CLASSIFY antes del retry.
- **Proposed retrospective (replace):**  
  Idempotencia: misma key ⇒ un effect aunque attempts suba. El error clásico es CONTINUE con dump de secreto como kind o re-aplicar write sin store. Pregunta: ¿por qué attempts=2 con effects=1 sigue siendo válido en el fixture limpio?
- **Code/output changes:** none

---

### S49-T3-A-DEMO (iDo) — **A**
- **Diagnosis:** JIT + techo de tokens + checkpoint; predicción ok vs COMPACT. Preamble “presupuesto de atención”. Retro repara “9k tokens por si acaso”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S49-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Cuatro anclas de context_ok; starter aprueba overflow. Feedback con 1200≤2000. Retro sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Attention budget es política de run (tokens + JIT + checkpoint + provenance), no un tip de prompt. Caber en tokens sin provenance sigue fallando el contrato. Pregunta: ¿qué falta además de tokens≤max en el PASS del fixture? Siguiente: PASS / COMPACT / MISSING:provenance.
- **Code/output changes:** none

### S49-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres packs limpio / 9k sin JIT / sin provenance. Feedback y retro distinguen COMPACT vs MISSING; eco moderado.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed residual:** self-check “¿COMPACT o MISSING si solo falta provenance?” en el retro.
- **Code/output changes:** none

### S49-T3-A-E3 (weDo, transfer) — **C**
- **Diagnosis:** Transfer RETRIEVE_MINIMUM_CONTEXT correcto. **Eco casi literal** feedback↔retro (“Recuperar mínimo con provenance no es «menos IA»…”). Self-check “además de tokens≤max” es el único valor nuevo del retro.
- **Checklist:** all pass; retro partial (eco fuerte)
- **Severity residual:** **P1**
- **Proposed feedback (distinct):**  
  CONTINUE exige pack bajo techo con JIT, checkpoint post-efecto y provenance. Overflow o sin checkpoint → COMPACT_AND_CHECKPOINT. Hechos huérfanos (sin provenance) no se “arreglan” con velocidad: enruta RETRIEVE_MINIMUM_CONTEXT.
- **Proposed retrospective (replace):**  
  Context engineering es elegir hechos y poder reanudar, no maximizar tokens. El error clásico es CONTINUE con 9k tokens “porque el modelo aguanta”. Pregunta: nombra las cuatro condiciones de `context_ok` sin mirar el código.
- **Code/output changes:** none

---

### S49-T3-B-DEMO (iDo) — **A**
- **Diagnosis:** Compaction que conserva CRITICAL o RESTORE LKG. Preamble “no borrar budget/no_prod_write”. Retro ancla LKG ≠ string decorativo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S49-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** ⊆ + retención ≤7 + prefijo `cp-`. Starter invierte inclusión/LKG. Feedback con case_id/budget/no_prod_write. Retro corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Compaction segura = menos ruido con las mismas puertas (`budget`, `no_prod_write`). LKG vacío “porque no hubo efecto” no es recovery. Pregunta: ¿`facts_before <= facts_after` en Python es ⊆ o ⊇? Siguiente: PASS / RESTORE / MISSING:last_known_good.
- **Code/output changes:** none

### S49-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Diff limpio / drop críticos+LKG vacío / sin campo LKG. Feedback y retro paralelos (RESTORE vs MISSING).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed residual:** self-check “si solo falta el campo LKG, ¿RESTORE o MISSING?”
- **Code/output changes:** none

### S49-T3-B-E3 (weDo, transfer) — **C**
- **Diagnosis:** Transfer REVIEW_COMPACTION_LOSS correcto. **Eco casi literal** feedback↔retro (“Review del diff… restore es automático al LKG”). Self-check de prefijo `cp-` útil.
- **Checklist:** all pass; retro partial (eco fuerte)
- **Severity residual:** **P1**
- **Proposed feedback (distinct):**  
  CONTINUE solo si el diff conserva críticos, retención ≤7 y LKG `cp-*`. Drop de `no_prod_write` o LKG vacío → RESTORE. Sin campo LKG no inventes `cp-7`: REVIEW_COMPACTION_LOSS es la rama de incertidumbre.
- **Proposed retrospective (replace):**  
  Review del diff es humano; restore es automático al último checkpoint seguro. El error clásico es CONTINUE tras borrar `no_prod_write` “porque case_id quedó”. Pregunta: ¿qué prefijo debe tener un LKG recuperable en este lab?
- **Code/output changes:** none

---

### S49-T4-A-DEMO (iDo) — **A**
- **Diagnosis:** `GOAL_MET` vs `STOP_BUDGET_EXHAUSTED` con cost_pen sintético; predicción de strings. Nota interna: demo usa 0.02/step vs theory 0.01 — coherente cada una por separado. Retro repara inventar techo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S49-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** goal_met + steps/tokens/cost ≤ max. Starter aprueba agotamiento. Feedback numérico sólido. Retro corta (“budget no es KPI de vanidad”).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Las cuatro condiciones (meta + tres contadores) son el contrato de parada. PASS con goal_met=False es mentira de portfolio. Pregunta: con steps=4, tokens=3200, cost=0.04 y techos 6/5000/0.06, ¿qué falta si goal_met=False? Siguiente: PASS / STOP / MISSING:max_cost_pen.
- **Code/output changes:** none

### S49-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Ledger limpio / 20 pasos+0.4 / sin max_cost_pen. Feedback y retro distinguen STOP vs inventar techo; eco moderado.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed residual:** self-check “¿STOP o MISSING si falta max_cost_pen?”
- **Code/output changes:** none

### S49-T4-A-E3 (weDo, transfer) — **C**
- **Diagnosis:** Transfer ASK_FOR_SCOPE_REDUCTION correcto. **Eco casi literal** feedback↔retro (“Reducir scope es política; inventar techo es fraude…”). Self-check de tres contadores bueno.
- **Checklist:** all pass; retro partial (eco fuerte)
- **Severity residual:** **P1**
- **Proposed feedback (distinct):**  
  CONTINUE solo bajo meta y techos. Sobre presupuesto → STOP_BUDGET_EXHAUSTED con razón en el log. Sin `max_cost_pen` no sigas a ciegas ni inventes 0.06: ASK_FOR_SCOPE_REDUCTION.
- **Proposed retrospective (replace):**  
  Inventar techo es fraude de evidencia; reducir scope es política legítima. El error clásico es CONTINUE con 20 pasos y cost 0.4. Pregunta: ¿qué tres contadores deben caber además de goal_met?
- **Code/output changes:** none

---

### S49-T4-B-DEMO (iDo) — **A**
- **Diagnosis:** Cuatro salidas (ALLOW / REQUEST_HUMAN / SANDBOX×2). Preamble HITL contextual + anti-replay. Retro “recovery ≠ re-enviar el correo”. Cierra el arco hacia S50.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S49-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Cinco anclas de sandbox_ok; starter aprueba open/sin approval/replay. Feedback prepare-draft vs incidente de replay. Retro corta (HITL contextual); alto riesgo de gate → casi P1 por longitud.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2 (priorizar en batch si hay capacidad P1 de polish)
- **Proposed retrospective (expand):**  
  HITL es contextual a la tool (`approval_present` si required), no un checkbox del README. network=none, FS workspace-read, cp-*, replayed=0 cierran el lab. Pregunta: si replayed_effects=2 y hay approval, ¿PASS o SANDBOX? Siguiente: PASS / SANDBOX / MISSING:replayed_effects.
- **Code/output changes:** none

### S49-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Matriz limpia / open+root-write+replay2 / sin contador. Feedback y retro paralelos (breach vs incertidumbre anti-replay).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed residual:** self-check “si falta replayed_effects, ¿SANDBOX o MISSING?”
- **Code/output changes:** none

### S49-T4-B-E3 (weDo, transfer) — **C**
- **Diagnosis:** Cierre CP-N4-C del lab; transfer REQUEST_HUMAN_APPROVAL correcto; puente S50 en retro. **Eco fuerte** feedback↔retro (“Pedir humano ante incertidumbre de replay…”). Self-check de approval ligada a la acción es el valor diferencial — mantenerlo, reescribir el lead.
- **Checklist:** all pass; retro partial (eco fuerte)
- **Severity residual:** **P1**
- **Proposed feedback (distinct):**  
  CONTINUE solo sandboxed (none, workspace-read, approval si aplica, cp-*, replay 0). Breach de red/FS/replay/approval → SANDBOX_AND_STOP. Sin evidencia de replay no reanudes inventando 0: REQUEST_HUMAN_APPROVAL.
- **Proposed retrospective (replace):**  
  Recovery = reanudar desde checkpoint **sin** re-ejecutar side effects. El error clásico es CONTINUE con network open “porque hay approval en el README”. Pregunta: ¿por qué `approval_present` debe ligarse a la acción y no a un flag global? Esto es lo que S50 evaluará con red team.
- **Code/output changes:** none

---

### S49-YOU-DO (youDo) — **A**
- **Diagnosis:** Marco de proyecto **sólido**: context Ayacucho+CP-N4-C, objectives medibles, requirements ADR/loop/tools/budgets/HITL, starter stdlib con smoke (mode, call_tool needs_approval, replay, budget, compact, readiness BLOCKED), rubric y portfolioNote. Retrospective de defensa (~73 w) con invariante / PII vs sintético / frase de impacto 30s — cumple checklist youDo del spec. evidence inicia en False por diseño.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: una línea en portfolioNote sobre conservar log de `REQUEST_HUMAN_APPROVAL` — ya implícito)
- **Code/output changes:** none

---

## Priority order (Round 2 residual)

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están listos para learner.

### P1 (arreglar en R2 fix si hay capacidad — metacognición de alto riesgo)
1. **S49-T2-B-E3** — desacoplar feedback/retro (idempotencia + CLASSIFY); textos propuestos arriba.
2. **S49-T3-A-E3** — desacoplar feedback/retro (cuatro condiciones de context_ok).
3. **S49-T3-B-E3** — desacoplar feedback/retro (REVIEW vs RESTORE; prefijo `cp-`).
4. **S49-T4-A-E3** — desacoplar feedback/retro (scope reduction vs inventar techo).
5. **S49-T4-B-E3** — desacoplar feedback/retro (cierre CP-N4-C / HITL contextual); conservar puente S50.

### P2 (polish; batch por familia)
1. **Expandir retros E1/E2** (~40–60 w + 1 self-check) en subtemas de alto riesgo: T1-A, T2-B, T4-A, T4-B (textos de expansión propuestos en ledger).
2. **Resto de E2 retros** con eco moderado (T1-B, T2-A, T3-A, T3-B): añadir self-check missing vs breach sin reescribir todo.
3. **iDo retros cortas** (T1-B, T2-A): +1 frase self-check si el Fixer toca el archivo.
4. **Hints E2/E3:** bajar un grado el “casi-solución” solo si se percibe spoiling excesivo (opcional Master).
5. **Variar plantilla de instruction E2/E3** sin cambiar semántica (mismo orden missing→predicado→print; distinta wording por subtema).
6. **Naming interno** `data-contracts` vs agentes: solo si orchestrator lo pide.

Orden sugerido de fix R2:
1. Los 5 E3 con eco P1 (T2-B, T3-A, T3-B, T4-A, T4-B)
2. Expansión retros E1 de T1-A, T2-B, T4-B (gate path)
3. Batch P2 restante si hay tiempo

---

## Residual risks

1. **Homogeneidad estructural del lab:** predicado → assess → decide en 8 subtemas es **buena** ingeniería curricular. El learner puede percibir “el mismo ejercicio con otro código de acción” si el Fixer R2 no desacopla feedback/retro y no añade self-checks distintos. Las *escenas* (ADR / traza / registry / store / attention / LKG / budget / sandbox) ya diferencian; el residual es **prosa de cierre**, no de contexto.
2. **Carga cognitiva Master/phase 3:** muchos verbos de acción. Intro de weDo y preambles ya traducen varios; no reintroducir jerga sin escena.
3. **Eco feedback/retro en E3:** patrón sistemático post-R1 (Fixer pegó principio en ambos campos). R2 debe **reescribir a mano** cada par P1, no search-replace de un token.
4. **You Do breadth:** el proyecto integra T1–T4; retrospective ya exige discurso de gate. No hinchar requirements.
5. **Id de archivo vs contenido:** documentado; no “arreglar” el tema a data contracts tabulares.
6. **Outputs canónicos:** no tocar strings de PASS/códigos ni fixtures `CASO-AYA-049-*`.
7. **Anti-aberración en R2 fix:** cada unidad a mano; prohibido script que fabrique 24 retros por sustitución.

---

## Acceptance handoff for Round-2 Fixer

- [ ] P1: desacoplar feedback/retrospective en T2-B-E3, T3-A-E3, T3-B-E3, T4-A-E3, T4-B-E3 (textos propuestos o equivalentes hand-written)
- [ ] P2 preferidos: expandir retros E1/E2 de alto riesgo (T1-A, T2-B, T4-B) con self-check
- [ ] Exact outputs preservados
- [ ] Español profesional peruano; sin PII real; caso sintético Ayacucho
- [ ] Sin generadores
- [ ] Section source compila en static build
- [ ] No rubber-stamp: si un E3 queda con lead sentence idéntico en feedback y retro, no está listo

---

## Round-2 summary scores (counts)

| Score | Units (approx) |
|-------|----------------|
| **A / A−** | ~12 (todos los iDo fuertes o leves; E3 no-eco; youDo; varios transfer limpios) |
| **B** | ~16 (mayoría E1/E2 + algunos E3 con eco leve) |
| **C** | **5** (E3 con eco fuerte: T2-B, T3-A, T3-B, T4-A, T4-B) |
| **D** | **0** |

**Verdict:** Section 49 is **learner-ready** after Round 1. Round 2 residual work is **quality polish**, concentrated on **feedback/retrospective decoupling** in five transfer units and optional metacognitive expansion in high-stakes guided drills. Ready for the Fixer prompt.

---

Section 49 exercise pedagogy review complete. Ready for the Fixer prompt.
