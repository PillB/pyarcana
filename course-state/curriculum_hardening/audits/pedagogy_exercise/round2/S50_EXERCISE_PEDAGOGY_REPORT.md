# S50 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Evals, red teaming y fiabilidad de IA
- **shortTitle:** Evals y red team
- **id:** `tech-leadership` (archivo `s50-tech-leadership.ts`; el **contenido** es evals, red team y fiabilidad del copiloto agentic — **no** soft skills de liderazgo genérico)
- **index:** 50
- **source:** `src/lib/course/sections/s50-tech-leadership.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** S50-T1-A task dataset/rúbrica · T1-B outcome/process/trajectory/recovery · T2-A graders det/humano/LLM · T2-B calibración/order bias/holdout · T3-A injection/exfil/tool misuse · T3-B indirect injection/poisoning/least privilege · T4-A hallucination/abstención · T4-B latencia/costo/cache/rollback
- **hilo de caso:** copiloto sintético de operaciones **CASO-ICA-050** (Ica) — continuación del agente con tools de S49; gate **CP-N4-C**; **stdlib only**, sin API de modelo de pago ni PII real
- **Round 1 context:** `round1/S50_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8 demos, ~381–624), `weDo.steps[]` (24 labs, ~627–2265) y `youDo` (~2268–2397): `title`, `preamble`, `instruction`, `feedback`, `retrospective`, `why`, starter `# Bug intencional`, solution/output.
- Integrity traps checked live:
  1. **Starters invertidos sobre fixture válido:** E1 de cada subtema falla el PASS canónico (`!=` coverage, solo outcome==3, cuenta desacuerdos, `ab+ba`, functions invertidas, elevación por “grant admin”, umbral invertido, solo p95). Correcto: el learner ve breach y repara el predicado.
  2. **E2/E3 reutilizan el bug de predicado** y cambian la **superficie** (tabla assess vs. códigos de acción). Fade de *código* es estructuralmente repetitivo; fade de *decisión y tokens de breach* es real y distinto por subtema.
  3. **missing → CONTINUE en starters E3** en los 8 subtemas — defecto de promote silencioso bien nombrado; solution enruta CALIBRATE / HUMAN_REVIEW / ADJUDICATE / SEAL / PRESERVE / REDUCE / REVIEW_ABSTENTION / ACTIVATE_INCIDENT.
  4. **T3-A disclaimer de lab:** preamble + comment en código (“marcadores de lab, no WAF real”) — residual R1 de misconception de producción **cerrado en prosa**.
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–10 palabras, español PE, alineados al skill (manifiesto, trajectory, order gap, injection≠exfil, canary…) | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈38–70 w; spec permite “4 short bullets”); iDo narrativos con “no escribas / predice” (≈55–82 w; T1-A en rango narrativo) | Pass en estructura; iDo T1-B–T4-B algo cortos vs 80–150 narrativo, pero legibles |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra el defect; E2/E3 con menos migas | Pass; E3 a menudo 22–25 w (bajo piso 40) — OK por transfer minimal; E2 a veces 26–36 w algo escuetas |
| **E1→E2→E3 fade** | Superficies distintas: predicado → assess PASS/breach/MISSING → decide CONTINUE/breach/rama. Escenas diferenciadas por subtema (dataset, trajectory, jueces, order bias, injection, corpus, abstain, RTO) | Pass de decisión; residual **prosa** E2/E3 con **esqueleto de frase clonado** (ver abajo) |
| **Feedback vs retrospective** | Feedback 25–60 w razona principio + impacto al scorecard; en **~18/24** weDo el retro **eco** del feedback (mismo principio, poco self-check en E1/E2). E3 suelen añadir pregunta — mejor | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈19–33 w (spec 40–80); iDo demos ~27–51 w (solo T1-A en rango pleno) | Residual **P2** (pocos **P1** de metacognición en holdout/injection/trajectory si el Fixer prioriza) |
| **iDo why** | Todos en o cerca del rango 40–90; anclan contrato y puente a We Do | Pass |
| **Código/outputs** | Coherentes con theory y CP-N4-C; bugs bien nombrados; outputs canónicos preservados; starters fallan el fixture válido | none required para pedagogía; notas de consistencia menores abajo |
| **youDo frame** | context CP-N4-C, objectives, requirements, rubric, portfolioNote (BLOCKED→READY), starter con P0_trajectory/injection/hallucination + P1_latency, retrospective de defensa (~61 w) | Pass — fuerte |
| **Hints E1** | Casi-solución (aceptable guided) | Residual **P2** opcional |
| **Hints E2/E3** | Dan la regla casi completa (andamiaje Master OK) | Residual **P2** opcional |
| **Id archivo vs contenido** | `tech-leadership` / `s50-tech-leadership.ts` vs título evals/red team | No es gap de ejercicio; otra campaña |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal y aplicó casi al pie las propuestas R1 (titles, preambles, instructions, retros, why ampliados, feedback, youDo retro). Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros cortas sin self-check en E1/E2, esqueleto templated en E2/E3, preambles iDo algo cortos). **No hay P0** de cobertura ni defectos que invaliden outputs canónicos.

**Patrón residual anti-aberration (P2, no P0):** en E2/E3, la *superficie* y los *tokens* cambian (REBUILD vs FAIL_UNSAFE vs BLOCK_SECURITY…), pero muchas oraciones de preamble/instruction/retro siguen el mismo molde (“Primero missing… Luego predicado… Missing es schema; X es breach… Pregunta…”). Correcto pedagógicamente; el Fixer R2 no debe reescribir en masa con otro template — solo **expandir/variar** donde el eco o la longitud fallan el test de newbie, a mano y por subtema.

**Notas de integridad (código, no bloquean R2 prose):**
1. Demo T1-A imprime `anchor_3 cita + claim alineado` (sin “al SLA”); theory/E1 usan “cita + claim alineado al SLA”. Cosmético.
2. Demo T1-B `ALLOWED = {get_case, search}` vs We Do `{get_case, search_sla}`. Cosmético.
3. Demo T4-B omite costo/ACL (documentado en `why`); We Do multi-eje — fade de complexity, no bug.
4. youDo inicia BLOCKED con evidence False — intencional; no “arreglar” asserts.

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

### S50-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example de manifiesto `cite_sla@v1` con predicción pedida (`coverage_ok`, `manifest`, `anchor_3`). Preamble ~82 w en rango; misconception “más filas bastan”. `why` ~61 w triple predicado + puente We Do. Retro ~51 w con hábito de manifiesto.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: alinear texto de `anchor_3` con theory “al SLA” si se toca código)
- **Code/output changes:** none for pedagogy

### S50-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito exacto `coverage 40 / 40` + `S50-T1-A PASS`; instruction nombra `!=` y holdout siempre True. Feedback ancla “basura comparable”. Retro ~31 w eco + puente E2; sin self-check.
- **Checklist:** all pass; retro partial (longitud + eco)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Manifiesto = evidencia versionada de slices + rúbrica 0–3 + holdout vivo, no un conteo informal de filas. El starter aprueba con `!=` y holdout “siempre ok” justo cuando el dataset es basura comparable. Pregunta: si `coverage 39 / 40` y el print dice PASS, ¿falló el assert o el contrato del eval? Siguiente (E2): válido / adverso / missing `holdout`.
- **Code/output changes:** none

### S50-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Fade real a tres rutas. Preamble “missing ≠ rebuild” excelente. Feedback y retro casi idénticos (schema vs contenido).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un holdout ausente no es un slice mal balanceado: es eval incompleto (schema). Slices que no suman o rúbrica {1,2} sí son breach de contenido. El error clásico es rellenar `holdout=10` a mano para “completar” la tabla. Pregunta: ¿en qué orden evalúas missing vs suma de slices, y por qué? Luego (E3): CONTINUE / REBUILD / CALIBRATE_RUBRIC.
- **Code/output changes:** none

### S50-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer auténtico a códigos de acción. Starter missing→CONTINUE y pred invertido (promote silencioso). Preamble “no sigue con warning”. Retro con self-check REBUILD vs CALIBRATE. Fade real.
- **Checklist:** all pass
- **Severity residual:** none (hints casi dan la regla — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S50-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Trajectory fail-closed con predicción `clean` / `p0_export` / `not_only_final_text`. Preamble puente S49 fuerte. `why` en rango. Retro ~34 w repara “outcome 3 = pasó”; sin self-check explícito.
- **Checklist:** all pass; retro partial (longitud / self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Trajectory eval = proceso y tools, no estética del mensaje. Outcome 3 con `export_csv` sigue siendo P0. Pregunta: si el usuario “quedó contento” tras tool prohibida, ¿qué imprime el gate y por qué no basta el párrafo final? We Do: predicado, tres rutas y HUMAN_REVIEW_PROCESS.
- **Code/output changes:** none (opcional alinear ALLOWED con We Do `search_sla`)

### S50-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter solo `outcome==3` — defect memorable. Instruction guiada (algo corta ~36 w). Feedback ancla min(dims)+allowlist al promote S49. Retro eco sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Cuatro dims con umbral y tools ∈ ALLOWED son el mismo gate de promote del agente de S49. El starter celebra outcome 3 e ignora process/trajectory/recovery. Pregunta: con process=1 y tools limpios, ¿PASS o FAIL_UNSAFE? Siguiente: válido / export prohibido / missing `min_dimension`.
- **Code/output changes:** none

### S50-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas outcome-3-con-tool-prohibida vs limpio vs missing umbral. Preamble “texto limpio ≠ proceso seguro”. Feedback≈retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Forbidden tool es breach de contenido; falta `min_dimension` es schema de umbral. El error clásico es “el usuario recibió la respuesta correcta”. Pregunta: ¿por qué outcome 3 no absuelve `forbidden_tool_used`? Luego (E3): CONTINUE / FAIL / HUMAN_REVIEW_PROCESS.
- **Code/output changes:** none

### S50-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a HUMAN_REVIEW_PROCESS. Starter missing→CONTINUE. Retro con self-check HUMAN_REVIEW ≠ FAIL_UNSAFE. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S50-T2-A-DEMO (iDo) — **A−**
- **Diagnosis:** Agreement 0.75 + adjudicate [2] con predicción pedida. Misconception “LLM-judge = oráculo”. Retro ~31 w corta; principle claro.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Ensemble = det + humano + LLM con acuerdo medible, no un oráculo. Coincidencias/n ≠ promedio de scores. Pregunta: con agreement 0.75 y un índice en conflicto, ¿promote silencioso o adjudicación? We Do: tasa, tres rutas y ADJUDICATE_DISAGREEMENT.
- **Code/output changes:** none

### S50-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter cuenta desacuerdos como matches — excelente. Feedback y retro cortos; retro ~25 w eco “no asumes oráculo”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Acuerdo = coincidencias / n; desacuerdos van a lista de adjudicación, no se promedian. El starter marca PASS cuando el ensemble está roto. Pregunta: con human=[2,3,2,1] y llm=[2,3,1,1], ¿por qué disagree_idx es [2] y no “casi bien”? Siguiente: scores fuera de [0,1] y missing umbral.
- **Code/output changes:** none

### S50-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Válido (0.78) / adverso (score 1.2 + acuerdo 0.3) / missing min_agreement. Feedback≈retro sobre recalibrar vs schema.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Score 1.2 o acuerdo 0.3 es ensemble roto (RECALIBRATE); falta umbral es política ausente (MISSING). El error clásico es clippear 1.2 a 1.0 en silencio. Pregunta: ¿por qué no “arreglar” el score fuera de rango sin recalibrar? Luego (E3): CONTINUE / RECALIBRATE / ADJUDICATE.
- **Code/output changes:** none

### S50-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** ADJUDICATE_DISAGREEMENT bien motivado. Retro con self-check clip vs recalibrar. Transfer real.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S50-T2-B-DEMO (iDo) — **A−**
- **Diagnosis:** Gap 0.30 → INVALIDATE aunque holdout intacto. Preamble predice por qué holdout_touched=False no salva. Retro ~33 w; misconception “solo invalido si el holdout se ve mal”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Juez válido = anclas + gap bajo + holdout sellado (AND). Order bias se mide con swap AB/BA, no se intuye. Pregunta: gap 0.02 con holdout tocado — ¿OK o INVALIDATE, y por qué? We Do: |AB−BA|, tres rutas y SEAL_NEW_HOLDOUT.
- **Code/output changes:** none

### S50-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter suma rates (gap inventado 1.2). Feedback excelente con números 0.02 vs 1.2. Retro ~29 w sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Order bias = |rate_AB − rate_BA|, no suma ni “se siente sesgado”. Sumar rates mata un juez sano (0.61/0.59). Pregunta: con gap 0.02 y holdout intacto, ¿qué token imprime y qué cambiaría si holdout_touched=True? Siguiente: válido / gap 0.30+holdout tocado / missing flag.
- **Code/output changes:** none

### S50-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas con anclas, gap y flag. Feedback “holdout tocado es P0 de metodología” fuerte; retro eco.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Holdout tocado o gap alto invalidan al juez; falta flag es schema (no asumas intacto). El error clásico es retunear temperatura con el holdout “un ratito”. Pregunta: ¿anclas 0.92 salvan un holdout tocado? Luego (E3): CONTINUE / INVALIDATE / SEAL_NEW_HOLDOUT.
- **Code/output changes:** none

### S50-T2-B-E3 (weDo, transfer) — **B+**
- **Diagnosis:** SEAL_NEW_HOLDOUT bien enrutado. Retro ~20 w (muy corta) pero con self-check gap+holdout tocado. Transfer real; longitud falla el rango.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Sellar holdout nuevo no es castigo: es honestidad metodológica antes de volver a comparar baseline/candidato. Missing del flag no es CONTINUE optimista. Pregunta: ¿por qué un gap 0.02 con holdout tocado igual invalida, y por qué SEAL no es lo mismo que INVALIDATE? El scorecard del youDo hereda este hábito.
- **Code/output changes:** none

---

### S50-T3-A-DEMO (iDo) — **A**
- **Diagnosis:** Injection ≠ exfil con predicción de cuatro líneas. Disclaimer lab≠WAF en preamble. `why` predicados distintos. Retro ~27 w corta pero misconception “security_ok genérico” clara.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Injection = entrada hostil; exfil = secreto en salida; son P0 distintos y se miden por separado. Un booleano genérico no deja traza usable. Pregunta: texto limpio con `sk-live` en la salida — ¿falla injection o exfil? We Do: dos controles, tres rutas y PRESERVE_ATTACK_TRACE.
- **Code/output changes:** none

### S50-T3-A-E1 (weDo, guided) — **B+**
- **Diagnosis:** Ambas funciones invertidas; preamble con disclaimer lab. Feedback contención medible. Retro ~27 w eco; hints recuerdan “en producción no basta frase clave” (bien).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Red team mide contención medible (limpio pasa, ataque se detecta, salida sin secreto), no suerte del system prompt. Invertir predicados marca PASS cuando el ataque gana. Pregunta: ¿por qué no unificar injection y exfil en un solo `security_ok`? Siguiente: PASS / BLOCK_SECURITY_P0 / MISSING severity.
- **Code/output changes:** none

### S50-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Multi-eje (injection, exfil bytes, scope, args, severity). Feedback “2048 B no se compensa con task_pass”. Retro eco schema vs BLOCK.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Breach de seguridad es BLOCK con evidencia; falta severity es schema para preservar traza de incidente. El error clásico es “mejoró el scorecard de tasks, igual promote”. Pregunta: injection libre + task_pass alto — ¿qué token gana y por qué? Luego (E3): CONTINUE / BLOCK / PRESERVE_ATTACK_TRACE.
- **Code/output changes:** none

### S50-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** PRESERVE_ATTACK_TRACE bien motivado. Retro con self-check leak vs task_pass. Fuerte para domain de alto riesgo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S50-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** PDF `grant admin` como dato; privilege min; write denegado. Preamble indirect injection clara. Retro ~27 w misconception “el PDF lo pide”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Corpus = datos, no control. Least privilege es de sesión; un HTML comment no es grant de IAM. Pregunta: si el modelo “obedeció” el chunk y elevó tools, ¿qué falló — el retrieval o la política de permisos? We Do: least privilege, cuarentena y REDUCE_TOOL_PRIVILEGE.
- **Code/output changes:** none

### S50-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter añade write si ve grant admin — defect memorable. Feedback “no es grant de IAM”. Retro corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `effective_permissions` devuelve solo la sesión; el PDF nunca expande el allowlist. Indirect injection se mitiga tratando el corpus como dato. Pregunta: con sesión {read} y doc «grant admin», ¿write_denied debe ser True o False? Siguiente: PASS / QUARANTINE / MISSING permission.
- **Code/output changes:** none

### S50-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas treat-as-data / poison / requested. Feedback “indexar igual y filtrar en el prompt” no cierra. Retro eco.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Cuarentena es breach de corpus (elevación, poison residual, permiso fuera); falta `requested_permission` es schema. El error clásico es “filtramos en el prompt y listo”. Pregunta: ¿por qué missing de requested no se asume como read? Luego (E3): CONTINUE / QUARANTINE / REDUCE.
- **Code/output changes:** none

### S50-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** REDUCE_TOOL_PRIVILEGE bien enrutado. Retro ~19 w (más corta de la sección) con self-check QUARANTINE vs REDUCE — buena idea, mal rango.
- **Checklist:** all pass; retro partial (longitud crítica)
- **Severity residual:** P2 (casi P1 por brevedad en tema de privilegio)
- **Proposed retrospective (expand):**  
  Reducir privilegio responde a incertidumbre de scope (no inventes requested=read). Cuarentena responde a corpus envenenado o elevación demostrada. No son el mismo incidente. Pregunta: sin `requested_permission`, ¿por qué REDUCE y no CONTINUE “con fe” de que la sesión es mínima? El least privilege del youDo se defiende con este hábito.
- **Code/output changes:** none

---

### S50-T4-A-DEMO (iDo) — **A−**
- **Diagnosis:** high answer / low abstain / critical 0. Misconception “siempre contestar”. Preamble groundedness. Retro ~29 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Abstenerse es resultado válido, no fallo de UX. Fluidez o p95 bajo no salvan claim crítico inventado en holdout. Pregunta: support 0.1 con thr 0.5 — ¿answer o abstain, y por qué latencia no importa aquí? We Do: claim_action, tres rutas y REVIEW_ABSTENTION_SLICE.
- **Code/output changes:** none

### S50-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Umbral invertido (answer cuando support bajo). Feedback groundedness claro. Retro corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Claim sin soporte → abstain. El starter responde justo cuando el support es basura. Pregunta: support exacto 0.5 con thr 0.5 — ¿answer o abstain (y por qué el `>=` importa)? Siguiente: tasa de soporte, críticas y missing flag de abstain.
- **Code/output changes:** none

### S50-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** PASS / BLOCK_HALLUCINATION / MISSING abstained_when_empty. Feedback “task_pass no absuelve inventar claim”. Retro eco.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Hallucination crítica es breach de contenido; falta flag de abstain es schema de evidencia. El error clásico es promediar 2 críticas malas con 18 buenas. Pregunta: unsupported_critical=2 y rate 0.9 — ¿PASS o BLOCK? Luego (E3): CONTINUE / BLOCK / REVIEW_ABSTENTION_SLICE.
- **Code/output changes:** none

### S50-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** REVIEW_ABSTENTION_SLICE. Retro con self-check “no promediar críticas”. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S50-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** healthy/slow/rto_breach. Preamble “canary puede romper aunque T1–T4A verdes”. `why` documenta omisión costo/ACL. Retro ~31 w misconception “reiniciar el pod = rollback”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Fiabilidad operativa = p95 + costo + ACL + rollback en RTO (We Do multi-eje). Restart hope no es rollback medido. Pregunta: p95 800 y rollback 60 vs RTO 10 — ¿qué token y por qué task_pass no salva? We Do: reliability_gate, tres rutas e ACTIVATE_INCIDENT_RESPONSE.
- **Code/output changes:** none

### S50-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter solo p95. Feedback “rollback 60 min sigue ROLLBACK”. Retro corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Multi-eje cierra el scorecard operativo del Tú haces: latencia, costo, cache ACL y RTO. Un p95 sano no absuelve rollback fuera de política. Pregunta: snapshot 850/0.07/True/60/10 — ¿PASS o ROLLBACK, y por qué el starter no lo veía? Siguiente: canary sano / roto / missing RTO.
- **Code/output changes:** none

### S50-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas canary. Feedback “subir task_pass no pospone p95 roto”. Retro eco.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Canary roto es rollback con evidencia; falta `rto_minutes` es schema de incidente (no compares rollback sin RTO). El error clásico es “el p95 ya se verá en prod”. Pregunta: ¿por qué missing RTO no se trata igual que p95 2500? Luego (E3): CONTINUE / ROLLBACK / ACTIVATE_INCIDENT_RESPONSE.
- **Code/output changes:** none

### S50-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** ACTIVATE_INCIDENT_RESPONSE. Retro con self-check rollback 60 vs reiniciar pod. Cierra el scorecard del youDo. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### youDo · Evals, red teaming y fiabilidad de IA — **A**
- **Diagnosis:** Marco portfolio sólido: context CASO-ICA-050 + puente S49, starter con 3 filas (normal / trajectory P0 / injection+hallucination), candidato p95>SLO → P1_latency, `scorecard` + `readiness` + evidence checklist False a propósito. Rubric y portfolioNote alineados a CP-N4-C. Retrospective de defensa (~61 w) con invariante P0, PII sintético e impacto medible en 30 s — cumple checklist youDo del spec.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: una línea en portfolioNote recordando holdout sellado si el learner solo mira task_pass)
- **Code/output changes:** none — no suavizar asserts ni forzar PROMOTE

---

## Priority order

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están en forma.

### P1
- **Ninguno obligatorio** para “cerrar” la sección al learner.  
- Si el Fixer tiene presupuesto limitado de prosa de alto riesgo, priorizar expansión de retros en: **T1-B** (trajectory), **T2-B** (holdout/order bias), **T3-A** (injection≠exfil), **T3-B-E3** (REDUCE vs QUARANTINE), **T4-A** (abstain) — hoy son **P2** por longitud/eco, no por contenido erróneo.

### P2 (calidad residual — preferible, no bloqueante)
1. **Expandir retros E1/E2** (y iDo demos cortas) al rango ~40–80 w con **un** self-check; evitar eco literal del `feedback`.
2. **Variar a mano** (no plantilla nueva) 4–6 preambles/instructions E2 que hoy son esqueleto clonado — solo donde suene a copy-paste al leer en voz alta.
3. **Hints E2/E3:** opcional bajar spoiler de la regla completa (Master tolera densos).
4. **Cosmético código (opcional, no pedido):** alinear `anchor_3` demo T1-A con “al SLA”; ALLOWED demo T1-B con `search_sla`.
5. **youDo:** opcional micro-refuerzo holdout en portfolioNote.

---

## Residual risks

1. **Dominio Master:** un “true newbie” de Python puro puede atascarse en vocabulario (holdout, order bias, trajectory) aunque la prosa de escena Ica esté bien. Las preambles ya anclan el caso; no diluir con essays.
2. **Fade de prosa vs. código:** el código hace fade real E1→E2→E3; la prosa E2/E3 comparte molde. Reescritura masiva con *otro* template violaría anti-aberration — solo edits quirúrgicos.
3. **Naming interno `tech-leadership`:** el learner ve el título correcto; no renombrar id/archivo en esta ronda.
4. **Demo T4-B más simple que E1:** documentado en `why`; no unificar outputs sin mandato.
5. **Marcadores de injection en stdlib:** disclaimer presente; no vender como WAF de producción.
6. **youDo READY con evidence False:** intencional; no suavizar asserts.
7. **Outputs canónicos:** no cambiar strings de PASS/tokens de breach.

---

## Fixer handoff (Round 2)

| Acción | Unidades |
|--------|----------|
| Expandir/reemplazar `retrospective` (self-check, anti-eco) | ~16–20 weDo E1/E2 + 6–7 iDo demos cortas; E3 mayormente OK |
| Micro-polish instruction E2 (1 línea de claridad) | opcional, solo si retro no basta |
| Cambios de código/output | **ninguno** salvo cosmético opcional documentado |
| Generators / bulk paste | **prohibidos** |
| Campos ausentes | **0** — no reintroducir fix R1 de “añadir title/preamble” |

Prosa learner-facing: **español profesional peruano**, longitudes del spec, un objetivo primario por unidad, fade E1 construye → E2 assess → E3 decide.

---

Section 50 exercise pedagogy review complete. Ready for the Fixer prompt.
