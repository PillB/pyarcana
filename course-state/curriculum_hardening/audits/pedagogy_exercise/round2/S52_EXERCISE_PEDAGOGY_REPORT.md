# S52 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Enterprise Relationship & Operations Intelligence Platform: capstone final
- **shortTitle:** Capstone FINAL
- **id:** `career-strategy` (archivo `s52-career-strategy.ts`; el **contenido** es CP-FINAL de plataforma multi-región defendible — no “estrategia de carrera” genérica de soft skills)
- **index:** 52
- **source:** `src/lib/course/sections/s52-career-strategy.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** S52-T1-A CF-1 revalidación · T1-B constraints/riesgos/no-go · T2-A bounded contexts/API/eventos · T2-B HITL (ER→triage→RPA→RAG→humano) · T3-A seis capas + cero P0/P1 · T3-B SLO/RPO/RTO + disaster drill · T4-A demo/CV con contribución personal · T4-B evidence bundle de 8
- **hilo:** plataforma nacional sintética **CASO-PER-052** (Lima, Arequipa, Cusco, Piura) — gate **CP-FINAL** (52/52 + 12/12 + CP-FINAL + regresión S1–S52, cero P0/P1, **sin compensar** CP-N4-C); **missing ≠ breach**; stdlib + fixtures sintéticos; sin PII real ni autofraude
- **Round 1 context:** `round1/S52_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# DEFECT`, solution output, why).
- Integrity traps checked live:
  1. **Starters invertidos sobre fixture válido:** E1 de cada subtema falla el PASS canónico (jobs==0, no_go vacío, shared_db, autofraude, P0 abiertos, desigualdades RPO/RTO, TTR sin mejora, artifacts&lt;8). Correcto: el learner ve breach y debe reparar el predicado.
  2. **E2/E3 reutilizan el mismo bug de predicado** y cambian la **superficie** (tabla assess vs. códigos de acción). Fade de *código* es estructuralmente repetitivo; fade de *prosa* y de *decisión* es real (escenas por subtema + missing≠breach).
  3. **missing → CONTINUE en starters E3** en los 8 subtemas — defecto de promote silencioso bien nombrado; solution enruta INTERVIEW/INDEPENDENT_RISK_REVIEW/MAP/REQUEST_HUMAN_REVIEW/FIX_AND_RERUN/RUN_DISASTER/RECORD/SCHEDULE_TECHNICAL_DEFENSE.
  4. **youDo readiness BLOCKED a propósito** con curriculum_gate, BUNDLE_8, drill con reloj, hitl_chain_ok y personal_contribution vacíos — no teatro de READY al abrir el starter.
- Scored for a **true newbie at Master close** (qué / por qué / éxito / qué queda), independent of Round-1 proposals. S52 asume 51 secciones previas; el test no es “¿sabe Python?” sino “¿entiende el revisor externo multi-región y missing≠breach?”.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–9 palabras, español PE, alineados al skill (baseline, no-go, contexts, HITL, P0/P1, RPO/RTO, TTR, bundle) | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈35–62 w; spec permite “4 short bullets”); iDo narrativos con predicción pedida (≈43–76 w) | Pass en estructura; iDo algo cortos vs 80–150 narrativo, pero legibles y con “no escribas / predice” |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra el defect del starter; E2/E3 con menos migas de “por qué” | Pass; E3 a veces ~18–24 w bajo el piso 40 del rango — OK por minimal transfer |
| **E1→E2→E3 fade** | Superficies distintas: predicado → assess PASS/breach/MISSING → decide CONTINUE/breach/rama. Escenas diferenciadas por subtema (CF-1, no-go, contexts, HITL, calidad, DR, portfolio, bundle) | Pass — no tres clones de prosa; residual **código** repetido (mismo pred invertido en E1–E3) es patrón de sección Master, no bug de R2 |
| **Feedback vs retrospective** | Feedback razona contrato + impacto al revisor de graduación; en **~18/24** weDo el retro **repite** el feedback (mismo principio; E3 añade pregunta self-check; E1/E2 a menudo solo “principio + error clásico + siguiente”) | Residual **P2** sistemático (algunos **P1** de metacognición en temas de alto riesgo: no-go, HITL, DR, bundle/CP-N4-C) |
| **Retrospective length** | weDo mediana ≈17–32 w (spec 40–80); iDo demos ~24–52 w (solo T1-A en rango pleno) | Residual **P2** (pocos **P1** donde el eco deja el misconception sin self-check) |
| **iDo why** | T1-A/T1-B/T2-A en o cerca de 40–90; T2-B…T4-B a menudo 30–39 w (puente We Do presente pero corto) | Residual **P2** |
| **Código/outputs** | Coherentes con theory y CP-FINAL; DEFECT bien nombrados; outputs canónicos preservados; starters fallan el fixture válido | none required |
| **youDo frame** | context, objectives, requirements, rubric, portfolioNote (weDo entrenó códigos; READY no es voltear booleans), starter calculado BLOCKED, retrospective de defensa (~71 w) | Pass — **excelente**; cierre de carrera defendible |
| **Hints E1** | Casi-solución / “relaciona campos con la regla” (aceptable guided) | Residual **P2** opcional |
| **Hints E2/E3** | Dan la regla casi completa (andamiaje mínimo OK para Master) | Residual **P2** opcional |
| **Id archivo vs contenido** | `career-strategy` / `s52-career-strategy.ts` vs título CP-FINAL | No es gap de ejercicio; otra campaña |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal (title/preamble/instruction/retrospective) y amplió `why`/feedback. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros E1/E2 cortas sin self-check, iDo pre/why/retro bajo piso narrativo, hints densos, patrón de código E1–E3 repetido). **No hay P0** de cobertura ni defectos que invaliden outputs canónicos.

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

### S52-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example de delta (`latency` retirada, `review_precision` añadida) y predicado CF-1 con predicción pedida (`PASS` / `REOPEN_CF1`). Preamble ancla “esta versión, no la de S01” y producto fantasma. `why` en rango (~57 w): change_log visible, stakeholders mínimos, adverso no es “casi listo”, puente We Do. Retrospective repara baseline eterno de S01 (~52 w).
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: self-check “¿jobs=3 con solo ops es PASS?”)
- **Code/output changes:** none

### S52-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito exacto `S52-T1-A PASS`; instruction nombra jobs==0 / baseline no frozen. Feedback ancla producto fantasma y `INTERVIEW_STAKEHOLDER` en E3. Retro (~31 w) principio + error clásico + puente E2; sin self-check.
- **Checklist:** all pass; retro partial (longitud + sin self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  CF-1 vivo = matriz stakeholder/job/métrica + `baseline_frozen`, no nostalgia de S01. El starter aprueba lo incompleto (jobs==0 o baseline suelto): el revisor multi-región vería un portfolio fantasma. Pregunta: si el print dice PASS con solo `ops` y jobs=0, ¿falló el assert o el contrato? Siguiente (E2): PASS / REOPEN_CF1 / MISSING:baseline_frozen.
- **Code/output changes:** none

### S52-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Fade real a tres rutas. Preamble “missing ≠ aceptar” excelente. Feedback y retro casi idénticos (Missing es incertidumbre… matriz vacía es breach).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un `baseline_frozen` ausente no es una matriz rota: es evidencia de schema incompleto. Solo ops + jobs=0 sí es breach de CF-1. El error clásico es rankear contenido sin el campo para “completar” la tabla. Pregunta: ¿en qué orden evalúas missing vs predicado de stakeholders, y por qué? Luego (E3): CONTINUE / REOPEN_CF1 / INTERVIEW_STAKEHOLDER.
- **Code/output changes:** none

### S52-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer auténtico a códigos de acción. Starter missing→CONTINUE y adverso→CONTINUE (promote silencioso). Preamble “no hay continuar con warning”. Retro con self-check REOPEN vs INTERVIEW — metacognición usable. Fade real desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none (hints casi dan la regla — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S52-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** PASS vs DECLARE_NO_GO con `match_is_fraud False` explícito. Preamble “sello ético y operativo” y predicción pedida. `why` en rango bajo (~43 w). Retro corta (~28 w): gate no adorno de README; misconception ER=fraude; puente We Do sin self-check.
- **Checklist:** all pass; retro partial (longitud / self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  No-go firmado es gate de despliegue, no párrafo de README. Matching/ER proponen; no condenan. Pregunta: si residual_ok es False pero el no-go lista real-pii, ¿qué imprime el predicado y por qué no es PASS? We Do: predicado invertido, tres rutas y INDEPENDENT_RISK_REVIEW.
- **Code/output changes:** none

### S52-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter aprueba no-go vacío o residual no aceptado — excelente. Instruction guiada. Feedback rico (disclaimer no arregla; ER≠fraude). Retro eco “ethics fail-closed” sin self-check (~29 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Constraints synthetic-only+human-review, risks con owner, no-go real-pii+auto-risk-decision y residual explícito son el contrato. El starter invierte y “aprueba” la ausencia. Pregunta: ¿un disclaimer en el README puede convertir DECLARE_NO_GO en PASS? Siguiente: PASS / DECLARE_NO_GO / MISSING:residual_risk_accepted.
- **Code/output changes:** none

### S52-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas firmado / vacío / sin residual. Feedback ≈ retro (residual ausente vs breach ético).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Residual ausente es incertidumbre de firma; constraints vacíos son breach ético — no “seguir con fe”. El error clásico es inventar residual_ok=True para forzar PASS. Pregunta: ¿por qué MISSING no se trata igual que DECLARE_NO_GO? Luego (E3): CONTINUE / DECLARE_NO_GO / INDEPENDENT_RISK_REVIEW.
- **Code/output changes:** none

### S52-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer a INDEPENDENT_RISK_REVIEW. Starter missing→CONTINUE. Retro con self-check disclaimer vs DECLARE — fuerte. Instruction muy corta (~23 w) pero transfer-ok.
- **Checklist:** all pass; instruction partial (mínima)
- **Severity residual:** P2 (opcional: +1 paso “solo el válido es CONTINUE”)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S52-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Seis contexts (incluye relationship), PASS vs monólito all-in-one. Preamble “relationship no es opcional”. `why` en piso (~40 w). Retro corta (~30 w): monólito “más rápido” como misconception.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Contexts + API/eventos versionados + sin DB compartida + ≥10 contract tests. El monólito con shared DB no es atajo legítimo: es breach de integración. Pregunta: si omites `relationship` pero tienes 12 tests, ¿PASS o STOP? We Do: predicado, assess y MAP_BOUNDED_CONTEXTS.
- **Code/output changes:** none

### S52-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter PASS si shared_database o APIs sin versionar. Feedback nombra relationship y MAP. Retro eco (~25 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Integración por contrato, no por tabla compartida. El starter premia el monólito. Pregunta: con shared_database=True y 12 tests, ¿el print es PASS o STOP_INTEGRATION_RELEASE? Siguiente: PASS / STOP / MISSING:contract_tests.
- **Code/output changes:** none

### S52-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas mapa limpio / monólito / sin contador. Feedback≈retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin contador de tests no hay evidencia de contrato; monólito es breach de integración. El error clásico es inventar contract_tests=10 para “completar” el schema. Pregunta: ¿por qué missing de contract_tests no es lo mismo que shared_database=True? Luego (E3): CONTINUE / STOP / MAP_BOUNDED_CONTEXTS.
- **Code/output changes:** none

### S52-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a MAP_BOUNDED_CONTEXTS. Preamble “no seguir y arreglar el consumidor después”. Retro con self-check disclaimer/shared_database. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S52-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Cadena HITL completa vs autofraude. Preamble “proponer no es decidir”; `rag_mode cited`. `why` corto (~36 w). Retro muy corta (~24 w): score alto ≠ etiqueta de fraude.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand, opcional):**  
  `all(chain)` y `not infers_fraud` son el contrato HITL: proponer no es decidir. Autofraude es no-go de graduación, no un warning. RAG en modo cita documenta; no emite veredicto. Orden: cadena completa antes de cualquier claim de riesgo. En We Do: predicado invertido, tres rutas y REQUEST_HUMAN_REVIEW.
- **Proposed retrospective (expand):**  
  HITL = propose-not-decide. El error clásico es autoetiquetar fraude porque el score “se ve alto”. Pregunta: si human_decides=True pero infers_fraud=True, ¿qué imprime y por qué no es PASS? We Do: predicado, assess y decide de la cadena.
- **Code/output changes:** none

### S52-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter PASS si infers_fraud o sin human_decides. Feedback sólido (REQUEST_HUMAN_REVIEW en schema). Retro eco (~22 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Señales proponen; humanos deciden. El starter invierte y premia el autofraude. Pregunta: ¿omitir human_decides es lo mismo que infers_fraud=True en el print del status? Siguiente: PASS / BLOCK / MISSING:infers_fraud.
- **Code/output changes:** none

### S52-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas limpia / autofraude / sin flag. Feedback≈retro (~17 w retro — de las más cortas de la sección).
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P1 (metacognición HITL en cierre de carrera)
- **Proposed retrospective (replace):**  
  Flag `infers_fraud` ausente es incertidumbre de schema; autofraude es breach ético de graduación. El error clásico es rellenar False “para que pase” sin demostrar la cadena. Pregunta: ¿por qué missing no se imprime como BLOCK_AUTOMATED_RISK_DECISION? Luego (E3): CONTINUE / BLOCK / REQUEST_HUMAN_REVIEW.
- **Code/output changes:** none

### S52-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a REQUEST_HUMAN_REVIEW. Retro con self-check “draft de RPA no autoriza”. Ancla youDo hitl_chain_ok en feedback. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S52-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Matriz de seis capas + contadores P0/P1; clean vs dirty. Preamble “print de todo ok no es regresión”. `why` ~39 w (casi piso). Retro ~29 w: video no cierra P0 / no compensa CP-N4-C.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Calidad medible = seis capas verdes + open_p0=open_p1=0. El error clásico es graduar con P0 abierto “porque el video se ve bien”. Pregunta: si red_team=False y open_p0=0, ¿PASS o BLOCK_FINAL_ON_P0_P1? We Do: predicado, assess y FIX_AND_RERUN_REGRESSION.
- **Code/output changes:** none

### S52-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter PASS si red_team falso o contadores &gt;0. Feedback nombra no-compensación CP-N4-C — excelente. Retro eco (~23 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Gate de calidad = capas + severidad contada. El starter premia el suite roto. Pregunta: ¿un open_p0=1 con unit/contract verdes puede ser PASS? Siguiente: PASS / BLOCK / MISSING:open_p1.
- **Code/output changes:** none

### S52-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas limpio / P0 / sin open_p1. Feedback ancla regresión permanente S1–S52. Retro eco.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Contador ausente es incertidumbre de evidencia; P0 abierto es breach de graduación. El error clásico es inventar open_p1=0 sin re-ejecutar la suite. Pregunta: ¿por qué MISSING:open_p1 no es lo mismo que BLOCK_FINAL_ON_P0_P1? Luego (E3): CONTINUE / BLOCK / FIX_AND_RERUN_REGRESSION.
- **Code/output changes:** none

### S52-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a FIX_AND_RERUN_REGRESSION. Retro self-check “video no cierra P0 de red_team”. Feedback ancla curriculum_gate del youDo. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S52-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** RPO/RTO con reloj; PASS vs NO_GO_RESILIENCE. Preamble “tabletop sin números no cuenta”. `why` corto (~30 w). Retro ~24 w: “hablamos de qué haríamos”.
- **Checklist:** all pass; why/retro partial
- **Severity residual:** P2
- **Proposed why (expand, opcional):**  
  Cuatro predicados medibles: availability≥slo, backup_age≤rpo, rollback≤rto y `restored`. El reloj cierra el loop del drill; un PDF de runbook no cuenta. Orden: matriz de tests en verde (T3-A) antes de narrar DR. En We Do: predicado invertido, tres rutas y RUN_DISASTER_EXERCISE.
- **Proposed retrospective (expand):**  
  DR medido, no promesa de runbook. El error clásico es tabletop verbal sin reloj. Pregunta: con rollback_min=120 y rto_min=15, ¿qué token imprime y por qué no es PASS? We Do: predicado, assess y decide de resiliencia.
- **Code/output changes:** none

### S52-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter invierte desigualdades (PASS si avail &lt; slo o rollback &gt; rto). Feedback con números del fixture (0.999, 3 h, 8 min) — de los mejores de la sección. Retro eco (~24 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  RPO/RTO se miden con reloj y restore verificado. El starter invierte comparadores y “aprueba” el fallo. Pregunta: si disaster_exercise=False pero los números de RPO/RTO cumplen, ¿PASS o NO_GO? Siguiente: PASS / NO_GO / MISSING:disaster_exercise.
- **Code/output changes:** none

### S52-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas limpio / breach numérico / sin flag. Feedback ancla youDo drill incompleto. Retro eco (~19 w).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Flag ausente es “corre el drill”; números rotos son no-go de resiliencia. El error clásico es marcar disaster_exercise=True sin restore verificado en disco. Pregunta: ¿por qué MISSING no se imprime como NO_GO_RESILIENCE? Luego (E3): CONTINUE / NO_GO / RUN_DISASTER_EXERCISE.
- **Code/output changes:** none

### S52-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a RUN_DISASTER_EXERCISE. Retro self-check tabletop 30 min vs restore. Fuerte; ancla youDo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S52-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Guion ≤10 min TTR 90→42 + contribución personal. Preamble honestidad de portfolio. `why` ~35 w. Retro ~26 w: inflar ownership / demo sin baseline.
- **Checklist:** all pass; why/retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Portfolio = números + fuente + contribución personal. El error clásico es inflar ownership o demo sin baseline. Pregunta: si result_ttr=120 y baseline=90, ¿el assert del demo_script pasa? We Do: predicado, assess y RECORD_PERSONAL_CONTRIBUTION.
- **Code/output changes:** none

### S52-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter PASS si TTR no mejora o claims sin fuente. Feedback nombra REJECT/RECORD. Retro eco (~22 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Honestidad de portfolio es gate de carrera: mejora medible + sintético + ≤10 min + fuentes + contribución personal. El starter premia el claim vacío. Pregunta: ¿demo_minutes=30 con TTR mejorado es PASS? Siguiente: PASS / REJECT / MISSING:personal_contribution.
- **Code/output changes:** none

### S52-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas limpio / sin mejora / sin contribución. Feedback ancla defense_script del youDo. Retro eco.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Contribución ausente es “regístrala”; TTR peor o sin fuente es reject de claim. El error clásico es rellenar personal_contribution=True sin frase en defense_notes. Pregunta: ¿por qué MISSING no se imprime como REJECT_UNSUPPORTED_PORTFOLIO_CLAIM? Luego (E3): CONTINUE / REJECT / RECORD_PERSONAL_CONTRIBUTION.
- **Code/output changes:** none

### S52-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a RECORD_PERSONAL_CONTRIBUTION. Retro self-check demo 30 min sin baseline. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S52-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** Bundle de 8 + cpn4c_independent; PASS vs solo README. Preamble revisor sin conocimiento tribal. `why` ~38 w. Retro ~24 w: “mi laptop corre, listo”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Bundle de 8 + reproducible + trade-offs + independencia de CP-N4-C. El error clásico es “mi laptop corre, listo”. Pregunta: con 7 artefactos y cpn4c_independent=True, ¿PASS o BLOCK_INCOMPLETE_EVIDENCE_BUNDLE? We Do: predicado, assess y SCHEDULE_TECHNICAL_DEFENSE.
- **Code/output changes:** none

### S52-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter PASS si artifacts&lt;8 o no cpn4c_independent. Feedback lista los 8 nombres — excelente. Retro eco (~20 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Paquete defendible = 8 nombres + comando + trade-offs + cpn4c_independent; no la laptop del autor. El starter premia bundle incompleto. Pregunta: ¿solo README con reproducible_command=True es PASS? Siguiente: PASS / BLOCK / MISSING:cpn4c_independent.
- **Code/output changes:** none

### S52-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas completo / solo README / sin flag. Feedback ancla artifact_paths del youDo. Retro eco.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Flag de independencia ausente es incertidumbre de rúbrica; README solo es breach de evidencia. El error clásico es inventar cpn4c_independent=True sin declarar en curriculum_gate. Pregunta: ¿por qué MISSING no es lo mismo que BLOCK_INCOMPLETE_EVIDENCE_BUNDLE? Luego (E3): CONTINUE / BLOCK / SCHEDULE_TECHNICAL_DEFENSE.
- **Code/output changes:** none

### S52-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a SCHEDULE_TECHNICAL_DEFENSE. Retro self-check video sin LICENSE/ADR. Cierre del arco hacia defensa oral y youDo. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S52-YOU-DO (youDo) — **A**
- **Diagnosis:** Marco de proyecto **excelente**: context (gate bloquea graduación), objectives, requirements (BUNDLE_8, RPO/RTO, curriculum_gate, missing≠breach), rubric ponderada, portfolioNote (weDo entrenó códigos; READY no es voltear booleans), starter `readiness` que inicia BLOCKED a propósito (contexts, HITL, drill, paths, milestones 80 h, defense_script, contribución personal, gate 52/52+12/12). Retrospective de defensa (~71 w) con tres self-checks + “sin laptop del revisor = teatro”. Cumple checklist de cierre de carrera.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: en portfolioNote ya está casi todo; no reescribir starter)
- **Code/output changes:** none

---

## Priority order (Round 2 residual only)

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están cerrados.

### P1 (metacognición en temas de alto riesgo del cierre)
1. **S52-T2-B-E2** — retro ~17 w y eco duro del feedback; HITL/autofraude merece self-check missing≠BLOCK.  
2. (Opcional agrupado) Si el Fixer toca E2 en lote, priorizar también **T1-B-E2**, **T3-B-E2**, **T4-B-E2** (ethics / DR / CP-N4-C) con el mismo patrón: retro distinta del feedback + 1 pregunta.

### P2 (polish de calidad; no bloquean learner usable)
1. **Ecos feedback≈retro** en ~18 weDo (sobre todo E1/E2): expandir o reemplazar retro con principle + misconception + self-check + puente; dejar feedback con el *por qué al revisor*.  
2. **iDo retro/why cortos** (T1-B … T4-B demos): +10–20 palabras o self-check; T2-B/T3-B/T4-A why bajo piso 40.  
3. **Instructions E3 muy densas/cortas** (~18–24 w): opcional +1 paso de “solo el válido es CONTINUE”; no inflar a ensayo.  
4. **Hints E1 plantilla** (“Relaciona los campos… con la regla”): opcional una pista más situada al defect del starter.  
5. **Patrón de código E1–E3** con el mismo predicado invertido: no reescribir lógica; es andamiaje Master intencional.

---

## Residual risks

1. **Prosa clonada E1/E2/E3 en un segundo fix** si el Fixer reutiliza el mismo párrafo cambiando solo el código de acción: el código ya hace fade; la prosa residual debe diferenciar guided (defect del cuerpo) / independent (missing≠breach) / transfer (códigos de acción + self-check).  
2. **Confundir “carrera” con soft skills** al expandir retros: el hilo es portfolio técnico defendible (demo, métricas, límites, contribución personal), no networking genérico.  
3. **Tocar outputs o predicados** al “mejorar” pedagogía: exact outputs y starter DEFECT están correctos; no reescribir la lógica de gate.  
4. **youDo sobrecargado:** no reescribir context/requirements; solo tocar retrospective si se propone polish (hoy **A**, no hace falta).  
5. **Naming interno** `career-strategy` vs título UI: no “arreglar” el id en esta ronda salvo orchestrator.  
6. **Carga cognitiva Master:** preambles cortos en bullets son aceptables; no re-enseñar Python ni reescribir theory en cada E3.  
7. **Sobre-expandir todos los retros a 80 palabras** por mecánica de conteo: priorizar P1 HITL/ethics/DR/bundle; el resto es P2.

---

## Round-1 → Round-2 delta (honest)

| Round 1 gap | Round 2 status |
|-------------|----------------|
| 24 weDo sin title/preamble/retrospective | **Cerrado** — campos presentes y usables |
| 8 iDo sin preamble/retrospective | **Cerrado** — presentes; residual longitud/self-check (P2) |
| youDo sin retrospective | **Cerrado** — defensa fuerte (~71 w) |
| instruction densa “concepto+fixture” | **Cerrado** — steps solo-tarea |
| feedback plantilla E2/E3 | **Mejorado** — la mayoría razona revisor/portfolio; residual eco con retro |
| why iDo 1 frase | **Mejorado** — T1-A pleno; varios aún ~30–39 w (P2) |
| Fade E1→E2→E3 de código | **Sigue excelente** (sin regresión) |
| DEFECT / outputs | **Intactos** (sin regresión) |

**Verdict:** S52 está **learner-ready** tras Round 1. Round 2 residual es **calidad de metacognición** (ecos, retros cortas en E1/E2, un P1 en HITL E2), no cobertura ni integridad de gates. Un Fixer R2 acotado a retros (y why iDo opcionales) basta; no reabrir el starter/solution.

---

## Fixer handoff (Round 2 checklist)

- [ ] **No P0 de cobertura** — no añadir campos desde cero salvo regresión  
- [ ] Priorizar **P1:** S52-T2-B-E2 retrospective (y opcional E2 ethics/DR/bundle)  
- [ ] **P2:** romper ecos feedback/retro en E1/E2; expandir retros iDo cortas; why iDo bajo piso  
- [ ] Outputs y DEFECT **intactos**  
- [ ] Español PE; sin PII real; sin generadores  
- [ ] youDo: **no reescribir** salvo polish opcional de retrospective (hoy A)  
- [ ] Section compila en static build  

Section 52 exercise pedagogy review complete. Ready for the Fixer prompt.
