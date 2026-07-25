# S47 Exercise Pedagogy Report (Round 2)

## Section
- **title:** MLOps: experimentos, registro y serving
- **shortTitle:** MLOps serving
- **id:** `opensource` (archivo `s47-opensource.ts`; el **contenido** es Production Data/ML Platform — tracking, registry, feature parity, canary y rollback — **no** “open source” genérico)
- **index:** 47
- **source:** `src/lib/course/sections/s47-opensource.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A tracking/repro · T1-B lineage/comparación · T2-A firmas/stages/approvals · T2-B artefactos/card · T3-A batch/online parity · T3-B latencia/fallback · T4-A shadow/canary · T4-B rollback/retirement/audit
- **hilo:** priorización sintética de atención **CASO-TAC-047** (Tacna) — ranker sintético sin GPU ni PII real; gate **CP-N4-B + CF-4** (modelo promovible y reversible; missing ≠ breach)
- **Round 1 context:** `round1/S47_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# DEFECT`, solution output, why).
- Integrity traps checked live:
  1. **Starters invertidos sobre fixture válido:** cada E1 falla el PASS canónico (p. ej. T1-A-E1 usa `>` y el fixture limpio cae en MARK; T2-A-E1 aprueba `not approved or stage==production`; T4-B-E1 aprueba `not compatible or not tested`). Correcto: el learner repara el predicado.
  2. **E2/E3 reutilizan el bug de predicado** y cambian la **superficie** (assess PASS/breach/MISSING → decide CONTINUE/breach/rama humana). Fade de *código* isomorfo por diseño Master; fade de *prosa y decisión* es real.
  3. **Adversos multi-falla** (p. ej. T2-B invalid: latest + skew + thin card; T4-A invalid: full/100%/drop/hooks false): cualquiera basta para breach; no descomponer fixtures.
  4. **Demo vs We Do T4-B:** demo usa `bool(retired)`; We Do exige `"1.0.0" in retired` — estricto a propósito; instruction de E1 ya lo nombra.
  5. **quality_delta T4-A:** demo −0.01; E1 fixture +0.01; ambos PASS bajo el predicado. No “unificar”.
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–9 palabras, español PE, skill-specific | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈33–64 w; spec permite “4 short bullets”); iDo narrativos con predicción pedida (≈60–77 w) | Pass en estructura; weDo cortos pero legibles para Master |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra defect; **E2/E3 a menudo 14–22 w** (bajo 40–100 del spec) — pasos telegráficos del tipo “Starter invierte / Missing primero / predicado / imprime” | Residual **P2** sistemático desde T2-A en adelante |
| **E1→E2→E3 fade** | Superficies distintas y verbos de acción por subtema (MARK/INVESTIGATE, INVALIDATE/RESTORE, DENY/REQUEST, REJECT/COMPLETE, DISABLE/TRACE, ACTIVATE/TUNE, STOP/COLLECT, ROLLBACK/REVIEW). Escenas Tacna diferenciadas | Pass — no tres clones de prosa; residual **código** repetido es patrón de sección |
| **Feedback vs retrospective** | Feedback razona principio + revisor de promote; en **~16/24** weDo el retro **repite** el feedback (mismo principio, self-check solo en la mayoría de E3) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈22–34 w (spec 40–80); E3 suelen tener pregunta self-check; E1 a menudo solo “principio + error clásico + siguiente”. iDo: T1-A fuerte (54 w); T1-B…T4-B ~25–30 w | Residual **P2** (pocos **P1** de metacognición fina en demos T3/T4) |
| **iDo why** | T1-A/B y T2-A en rango; T2-B/T3-B/T4-A/T4-B **ligeramente bajo** (34–38 w vs 40–90) | Residual **P2** |
| **Código/outputs** | Coherentes con theory y CF-4; DEFECT bien nombrados; outputs canónicos preservados; starters fallan el fixture válido | none required |
| **youDo frame** | context CF-4, objectives, requirements, rubric, portfolioNote (missing≠breach + rollback sin borrar), starter calculado, retrospective de defensa (~64 w) | Pass — fuerte |
| **Hints E1** | Casi-solución (aceptable guided) | Residual **P2** opcional |
| **Hints E2/E3** | Dan la regla casi completa (andamiaje mínimo OK para Master) | Residual **P2** opcional |
| **Id archivo vs contenido** | `opensource` / `s47-opensource.ts` vs título MLOps | No es gap de ejercicio; otra campaña |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal (title/preamble/instruction/retrospective) y amplió `why`/feedback. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros E1/E2/iDo cortas sin self-check, instructions E2/E3 telegráficas, `why` iDo al borde del piso). **No hay P0** de cobertura ni defectos que invaliden outputs canónicos.

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

### S47-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example de re-ejecución con predicción pedida (`run_ok` / seed / delta 0.005). Preamble ancla “semilla fija sin params/rerun = anécdota”. `why` en rango (56 w) con puente a We Do. Retrospective repara “F1 alto sin seed” y cierra hábito de evidencia de run.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S47-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito exacto `S47-T1-A PASS`; instruction nombra `>` vs `≤` y seed/params. Feedback ancla tres anclas al revisor de experiments. Retro (~27 w) eco parcial + puente a E2; sin self-check.
- **Checklist:** all pass; retro partial (longitud + eco)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Reproducibilidad = re-ejecución controlada, no un score bonito. El starter marca PASS justo cuando el delta **supera** la tol. El error clásico es solo mirar el número grande. Pregunta: con delta 0.005 y tol 0.01, ¿por qué `>` es exactamente el anti-predicado del promote? Siguiente (E2): tres rutas válido / adverso / missing `tolerance`.
- **Code/output changes:** none

### S47-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Fade real a tres records. Preamble “missing ≠ marcar no reproducible” excelente. Feedback y retro casi idénticos (missing = protocolo vs breach de contenido).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Missing es incertidumbre de protocolo; params vacíos o delta alto son breach de métrica. El error clásico es tratar “falta tolerancia” como fallo de score. Pregunta: si el revisor ve `MISSING:tolerance`, ¿pide un rerun o un MARK? Luego (E3): CONTINUE / MARK / INVESTIGATE_RANDOMNESS.
- **Code/output changes:** none

### S47-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer auténtico. Starter missing→CONTINUE y pred invertido (promote silencioso). Retro con self-check MARK vs INVESTIGATE. Feedback un poco corto (24 w) pero nombra el principio.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (ampliar feedback a 30–40 w con impacto al portfolio)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S47-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Lineage + versionado + candidate > baseline vs train/latest. Predicción `ok`/`invalid`/`delta` 0.04. `why` en rango. Retro corta (~28 w) sin self-check: principle + error train + “We Do: tres capas”.
- **Checklist:** all pass; retro partial (longitud / self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Comparación honesta = mismas anclas + holdout + métrica definida. Un F1 0.90 en train no gana al baseline: la comparación se invalida. Pregunta: si `code=latest` y el score es 0.85, ¿qué falta para que el delta cuente en el registry? We Do: predicado, tres rutas y rama RESTORE_LINEAGE.
- **Code/output changes:** none

### S47-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter `not data or candidate ≤ baseline` (aprueba basura). Instruction guiada clara. Feedback fuerte sobre train. Retro (~28 w) sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Lineage completo es el ticket de entrada a la tabla; `candidate > baseline` solo cuenta después. El starter invierte y “aprueba” lo no comparable. Pregunta: con candidate 0.90 y split=train, ¿PASS o INVALIDATE aunque gane al 0.78? Siguiente: PASS / INVALIDATE / MISSING:baseline.
- **Code/output changes:** none

### S47-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas sólidas. Instruction algo corta (31 w). Feedback ≈ retro (RESTORE vs INVALIDATE).
- **Checklist:** all pass; retro partial (eco); instruction partial (bajo piso)
- **Severity residual:** P2
- **Proposed instruction (expand steps):**  
  1. Starter: PASS si falta data o candidate ≤ baseline (bug: aprueba lo no comparable).  
  2. Primero: calcula `missing` de required; si hay → `MISSING:…` (sin tocar baseline).  
  3. Luego: `lineage_ok` + `versioned` + `candidate > baseline` → PASS; si no → INVALIDATE_COMPARISON.  
  4. Imprime `PASS INVALIDATE_COMPARISON MISSING:baseline` con `print(*results)`.
- **Proposed retrospective (replace):**  
  Missing de baseline es incertidumbre (luego RESTORE), no trampa de score. Un 0.90 con train sigue siendo INVALIDATE por contenido. Pregunta: ¿por qué no rellenar `baseline` inventado para forzar PASS? Luego: CONTINUE / INVALIDATE / RESTORE_LINEAGE.
- **Code/output changes:** none

### S47-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a CONTINUE/INVALIDATE/RESTORE. Instruction telegráfica (22 w) compensada por preamble y hints. Retro con self-check de anclas (data/code/env) — metacognición usable.
- **Checklist:** all pass; instruction partial (corto, transfer OK)
- **Severity residual:** P2 opcional (expandir instruction 1–2 frases)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S47-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** SERVICE_SIG + staging + approved vs production sin approve y firma rota. Predicción clara. Retro corta (~30 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Promote = firma exacta al servicio + stage gobernado + aprobación explícita. Un digest válido no es permiso. Pregunta: si el JSON ya dice `stage=production` sin `approved`, ¿qué imprime `prod_no_approve` y por qué? We Do: predicado, tres rutas y REQUEST_MODEL_APPROVAL.
- **Code/output changes:** none

### S47-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter invertido excelente. Instruction 24 w (bajo piso). Retro 22 w muy corta.
- **Checklist:** all pass; instruction partial · retro partial
- **Severity residual:** P2
- **Proposed instruction (expand):**  
  1. Starter: `not approved or stage == "production"` (bug: aprueba promote ilegal).  
  2. Compara `input_signature`/`output_signature` con `SERVICE_SIG`.  
  3. Exige `stage == "staging"` y `approved` truthy.  
  4. Conserva print `S47-T2-A` y status PASS/DENY_MODEL_PROMOTION.
- **Proposed retrospective (expand):**  
  Aprobación y firma son gates distintos del digest. El starter da luz verde justo cuando production no está aprobada. Pregunta: con firma `age:str` y stage staging, ¿PASS o DENY aunque approved=True? Siguiente: PASS / DENY / MISSING:approved.
- **Code/output changes:** none

### S47-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas con adverso multi-falla. Instruction 17 w telegráfica. Feedback ≈ retro.
- **Checklist:** all pass; instruction partial · retro partial (eco)
- **Severity residual:** P2
- **Proposed instruction (expand):**  
  1. Starter invierte PASS/DENY cuando el record está completo.  
  2. Primero `missing` de required; sin `approved` → `MISSING:approved` (no evalúes stage).  
  3. Luego `sig_ok` + staging + approved → PASS; si no → DENY_MODEL_PROMOTION.  
  4. Imprime la tripleta con `print(*results)`.
- **Proposed retrospective (replace):**  
  Missing approved es REQUEST en E3, no DENY. El adverso combina firma rota y production: breach de contenido. Pregunta: ¿por qué no inventar `approved=True` para “desbloquear” el lab? Luego: CONTINUE / DENY / REQUEST.
- **Code/output changes:** none

### S47-T2-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer REQUEST_MODEL_APPROVAL. Self-check en retro (“qué pedirías en la card”). Instruction 17 w telegráfica — aceptable transfer con preamble.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S47-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Digest sha256, features alineadas, card de 4 secciones. `why` 38 w (borde). Retro 29 w sin self-check.
- **Checklist:** all pass; why partial · retro partial
- **Severity residual:** P2
- **Proposed why (expand ~15 w):**  
  `startswith("sha256:")` modela digest real; la igualdad train/serve evita skew silencioso; `REQUIRED <= sections` exige card mínima (use/limits/metrics/risks). Thin card y `latest` no son cosméticos: bloquean el artefacto antes del canary. En We Do practicarás predicado, REJECT/MISSING y COMPLETE_MODEL_CARD.
- **Proposed retrospective (expand):**  
  Artefacto gobernado = digest + paridad de features + card completa. Promote con `latest` es el error clásico del registry. Pregunta: si la card solo tiene `use`, ¿qué sección falta para que producto sepa cuándo el score no aplica? We Do: tres capas hasta COMPLETE_MODEL_CARD.
- **Code/output changes:** none

### S47-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter aprueba skew o card corta. Feedback fuerte (len&lt;4 es proxy). Retro corta eco “card incompleta”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Card incompleta es riesgo de producto, no de formato markdown. El starter aprueba justo cuando hay skew o secciones de menos. Pregunta: con digest sha256 y features alineadas pero card solo `{use}`, ¿PASS o REJECT? Siguiente: PASS / REJECT / MISSING:card_sections.
- **Code/output changes:** none

### S47-T2-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Tres rutas correctas en código. **Instruction 18 w** y **feedback ≈ retro casi palabra por palabra** (ambas “Missing card es COMPLETE… No rellenes placeholders”). Peor eco de la sección en artefacto.
- **Checklist:** all pass; instruction fail (piso) · retro partial (eco fuerte)
- **Severity residual:** P1 (eco + instruction)
- **Proposed instruction (full):**  
  1. Starter: con campos presentes devuelve PASS si hay skew o `len(card) < 4` (bug: aprueba basura).  
  2. Primero calcula `missing`; si falta `card_sections` → `MISSING:card_sections` sin mirar digest.  
  3. Luego exige `startswith("sha256:")`, train==serve y card ⊇ {use, limits, metrics, risks}.  
  4. Imprime `PASS REJECT_MODEL_ARTIFACT MISSING:card_sections`.
- **Proposed retrospective (replace):**  
  Missing card es COMPLETE en E3; skew/`latest` es REJECT de contenido. Rellenar secciones inventadas no es gobernanza. Pregunta: en el invalid, ¿basta una de latest/skew/thin para REJECT? Luego: CONTINUE / REJECT / COMPLETE.
- **Code/output changes:** none

### S47-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer COMPLETE_MODEL_CARD. Self-check “qué sección fallaría primero” — fuerte. Instruction corta OK en transfer.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S47-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Paridad batch/online, anti-leakage, ≥3 tests. Retro muy corta (~25 w): formula + “online casi igual” + “tres capas”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Paridad + anti-leakage + contract tests = permiso de servir. “Online es casi igual” no es paridad: un float distinto en el vector es skew real. Pregunta: con vectores idénticos pero `leakage=True`, ¿por qué el predicado sigue en False? We Do: DISABLE / TRACE_FEATURE_PIPELINE.
- **Code/output changes:** none

### S47-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter aprueba skew o leakage. Feedback bueno. Retro 23 w sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Training-serving skew se corta **antes** del canary. El starter da PASS cuando batch≠online o hay leakage. Pregunta: con vectores iguales, leakage=False y `contract_tests=2`, ¿PASS o DISABLE? Siguiente: PASS / DISABLE / MISSING:contract_tests.
- **Code/output changes:** none

### S47-T3-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Instruction **14 w** (mínimo de la sección). Feedback ≈ retro (TRACE vs DISABLE). Fade de código real; prosa de tarea insuficiente para newbie que no leyó theory al detalle.
- **Checklist:** goal pass · success pass · constraints pass · instruction fail · retro partial
- **Severity residual:** P1
- **Proposed instruction (full):**  
  1. Starter: PASS si batch≠online o leakage (bug: aprueba skew).  
  2. Primero `missing` de required; sin `contract_tests` → `MISSING:contract_tests`.  
  3. Luego batch==online y not leakage y tests≥3 → PASS; si no → DISABLE_INCONSISTENT_SERVING.  
  4. Imprime `PASS DISABLE_INCONSISTENT_SERVING MISSING:contract_tests`.
- **Proposed retrospective (replace):**  
  Missing tests es TRACE en E3; skew/leakage es DISABLE de contenido. Un F1 de lab no salva online divergente. Pregunta: ¿por qué no inventar `contract_tests=3` para forzar PASS? Luego: CONTINUE / DISABLE / TRACE.
- **Code/output changes:** none

### S47-T3-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer TRACE_FEATURE_PIPELINE. Self-check “qué contract test primero” bueno. Instruction 17 w.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S47-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** p95/SLO/batch/fallback. `why` 34 w (bajo piso). Retro 25 w.
- **Checklist:** all pass; why partial · retro partial
- **Severity residual:** P2
- **Proposed why (expand):**  
  p95≤slo es presupuesto de experiencia del ranker; batch acotado (1–64) evita sobrecarga; `fallback.startswith("rules-")` y `tested` exigen salida tipada y ensayada. Sin fallback el timeout no tiene salida segura. En We Do practicarás predicado, ACTIVATE/MISSING y TUNE_BATCH_OR_CAPACITY.
- **Proposed retrospective (expand):**  
  SLO + batch + fallback ensayado = permiso de tráfico real. “Luego medimos p95” es el error clásico del serving. Pregunta: con p95 120 y fallback `none`, ¿por qué `no_fb` es False aunque la latencia esté bien? We Do: tres capas hasta TUNE.
- **Code/output changes:** none

### S47-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter invertido (PASS si p95 alto o not tested). Feedback claro. Retro 24 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Fallback no ensayado es deuda operativa, no un TODO del README. El starter aprueba justo cuando el serving no está listo. Pregunta: con p95 OK, batch 16 y fallback `rules-v2` pero `tested=False`, ¿PASS o ACTIVATE? Siguiente: PASS / ACTIVATE / MISSING:fallback_tested.
- **Code/output changes:** none

### S47-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Instruction 14 w. Feedback y retro muy cercanos (TUNE vs ACTIVATE) pero retro añade “timeout sin salida”.
- **Checklist:** all pass; instruction partial · retro partial (eco ligero)
- **Severity residual:** P2
- **Proposed instruction (expand):**  
  1. Starter invierte PASS/ACTIVATE con campos presentes.  
  2. Primero `missing`; sin `fallback_tested` → `MISSING:fallback_tested` (no evalúes p95).  
  3. Luego p95≤slo, batch 1–64, fallback `rules-*` y tested → PASS; si no → ACTIVATE_SAFE_FALLBACK.  
  4. Imprime la tripleta canónica.
- **Proposed retrospective (replace):**  
  Missing tested es TUNE en E3; p95 900 con batch 512 es ACTIVATE de contenido. Pregunta: ¿por qué “falta evidencia de prueba” no es lo mismo que “activar fallback ya”? Luego: CONTINUE / ACTIVATE / TUNE.
- **Code/output changes:** none

### S47-T3-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer TUNE_BATCH_OR_CAPACITY. Self-check p95/batch en README del canary. Bueno.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S47-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Canary → gates_green/stop. `why` 34 w. Retro 27 w formulaica.
- **Checklist:** all pass; why partial · retro partial
- **Severity residual:** P2
- **Proposed why (expand):**  
  mode ∈ {shadow, canary}, traffic≤10, quality_delta ≥ −max_drop, error≤max y hooks unen presupuesto y observabilidad. `full` no es modo válido de canary: es deploy a ciegas. En We Do repararás predicado, STOP/MISSING y COLLECT_MORE_SHADOW_EVIDENCE.
- **Proposed retrospective (expand):**  
  Canary = presupuesto de tráfico + calidad + errores + hooks. Full rollout “porque el digest es bueno” no es canary. Pregunta: con canary 5% y quality_delta −0.2 bajo max_drop 0.05, ¿por qué `quality_drop` es stop? We Do: tres capas hasta COLLECT.
- **Code/output changes:** none (quality_delta demo vs E1 distintos a propósito)

### S47-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter PASS si traffic>10 o error>max (incompleto e invertido). Feedback fuerte sobre mode full. Retro **21 w** (mínimo weDo de la sección).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Canary sin hooks es teatro de despliegue. El starter aprueba just cuando hay over-traffic o error alto y además omite mode/quality/hooks. Pregunta: con traffic 5% y hooks=False, ¿PASS o STOP aunque el error esté bajo? Siguiente: PASS / STOP / MISSING:hooks.
- **Code/output changes:** none

### S47-T4-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Instruction 19 w; retro 22 w eco de feedback (“Missing hooks es COLLECT… mode full es STOP… No inventes quality_delta”).
- **Checklist:** all pass; instruction partial · retro partial (eco)
- **Severity residual:** P1
- **Proposed instruction (full):**  
  1. Starter: PASS si traffic>10 o error>max (bug: invierte y omite mode/quality/hooks).  
  2. Primero `missing`; sin `hooks` → `MISSING:hooks`.  
  3. Luego mode in {shadow, canary}, traffic≤10, quality_delta ≥ −max_drop, error≤max y hooks → PASS; si no → STOP_CANARY.  
  4. Imprime `PASS STOP_CANARY MISSING:hooks`.
- **Proposed retrospective (replace):**  
  Missing hooks es COLLECT en E3; mode `full` al 100% es STOP de contenido. Inventar `quality_delta` en el chat no es panel de monitoreo. Pregunta: en el invalid, ¿basta hooks=False para STOP aunque bajaras traffic a 5%? Luego: CONTINUE / STOP / COLLECT.
- **Code/output changes:** none

### S47-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer COLLECT_MORE_SHADOW_EVIDENCE. Self-check “qué hook de drift pedirías” — cierre fuerte hacia youDo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S47-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** Rollback last-good + retirement + audit. Retro 26 w formulaica. `why` 38 w borde.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Rollback sin audit no cierra CF-4: “ya volvimos a la versión anterior” sin evidencia es anécdota. Borrar el trace para limpiar el tablero destruye el gate. Pregunta: con features incompatibles, ¿por qué `incompat` es False aunque exista last_good? We Do: ROLLBACK / REVIEW_RETIREMENT.
- **Code/output changes:** none

### S47-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Instruction nombra `"1.0.0" in retired` (bien vs demo). Feedback exige retiro explícito. Retro 24 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Retirement auditado es parte del rollback, no un extra de cleanup. El starter aprueba cuando compatible/tested fallan. Pregunta: con todo OK salvo `retired` vacío, ¿PASS o ROLLBACK_TO_LAST_GOOD? Siguiente: PASS / ROLLBACK / MISSING:audit_entry.
- **Code/output changes:** none

### S47-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Instruction 18 w. Feedback y retro cercanos (REVIEW vs ROLLBACK) con eco parcial.
- **Checklist:** all pass; instruction partial · retro partial
- **Severity residual:** P2
- **Proposed instruction (expand):**  
  1. Starter invierte PASS/ROLLBACK con campos presentes.  
  2. Primero `missing`; sin `audit_entry` → `MISSING:audit_entry`.  
  3. Luego current≠last_good, compatible, tested, `"1.0.0" in retired` y audit → PASS; si no → ROLLBACK_TO_LAST_GOOD.  
  4. Imprime la tripleta canónica.
- **Proposed retrospective (replace):**  
  Missing audit es REVIEW en E3; compatible=False o untested es ROLLBACK de contenido — no uncertainty. Pregunta: ¿por qué untested no se “arregla” inventando `rollback_tested=True` en el lab? Luego: CONTINUE / ROLLBACK / REVIEW.
- **Code/output changes:** none

### S47-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer REVIEW_RETIREMENT. Self-check “qué campo del audit defenderías en 30 s” — cierre CF-4 excelente hacia youDo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### youDo (youDo) — **A**
- **Diagnosis:** Marco de proyecto **sólido**: context de plataforma MLOps en Tacna, objectives alineados a CP-N4-B + CF-4, requirements con normal/breach/uncertain, starter con predicados reales (no flags muertos), portfolioNote que advierte missing≠breach y rollback sin borrar evidencia. **Retrospective** de defensa post-build con tres preguntas medibles (~64 w) — cumple checklist de metacognición. No hay hueco P1 residual de cobertura.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none (P2 opcional: una línea en portfolioNote que nombre explícitamente “segundo breach de skew” del comentario del starter — ya está en starter comments)
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order

### P0
- **Ninguno.** Cobertura de campos Round-1 completa; outputs y starters coherentes con CF-4.

### P1 (Fixer Round-2 — calidad de tarea/metacognición)
1. **S47-T2-B-E2** — instruction telegráfica + feedback≈retro casi idénticos; reescribir instruction (pasos con defect/missing/predicado) y retrospective distinta del feedback.
2. **S47-T3-A-E2** — instruction 14 w; expandir pasos y desacoplar retro del feedback (TRACE vs DISABLE + self-check).
3. **S47-T4-A-E2** — instruction + retro eco; expandir y self-check sobre multi-falla del invalid.

### P2 (polish, orden sugerido por impacto al newbie)
4. **iDo retros cortas (T1-B…T4-B):** expandir a ~40–60 w con self-check; T1-A ya está bien.
5. **iDo why bajo piso (T2-B, T3-B, T4-A; opcional T4-B):** +5–15 palabras de racional técnico + puente We Do.
6. **We Do E1 retros** (todos los subtemas): añadir self-check + un detalle del starter invertido (no solo “siguiente E2”).
7. **We Do E2 instructions telegráficas** (T2-A-E2, T2-B-E2, T3-A-E2, T3-B-E2, T4-A-E2, T4-B-E2, y vecinos similares): subir a ~40–60 w con defect nombrado.
8. **We Do E2 feedback/retro ecos** restantes (T1-A-E2, T1-B-E2, T2-A-E2, T3-B-E2, T4-B-E2): retrospective debe añadir self-check o matiz distinto (missing≠breach ya dicho en feedback).
9. **Hints E1/E2 densos:** opcional aflojar un spoiler en E1 si se quiere más lucha guiada; no bloquea promote del learner.
10. **Naming interno `opensource`:** documentar; no renombrar en esta ronda.

---

## Residual risks

- **Prosa plantilla residual:** el código E1/E2/E3 es isomorfo por diseño Master. Tras Round-1, los *preambles* sí usan vocabulario de subtema; el riesgo residual es **retro/feedback genéricos** (“Missing X es Y en E3; … Luego decides…”) copiados con sustitución de verbos. El Fixer R2 debe reescribir a mano, no sed global.
- **Instruction vs preamble:** si solo se pegan preambles y las instructions E2 quedan en 14–18 w, el learner depende del preamble para el defect — aceptable en independent **si** el defect del starter está nombrado en algún sitio visible; hoy a veces solo en `# DEFECT` del código.
- **Strictness de retired:** E1–E3 de T4-B usan `"1.0.0" in retired`; demo usa `bool(retired)`. No unificar; sí mantener la mención en instruction de E1.
- **quality_delta T4-A:** demo −0.01 vs E1 +0.01 — ambos PASS; no “corregir”.
- **Carga cognitiva Master:** 24 We Do + 8 demos; preambles en bullets ya ayudan. Ampliar retros no debe convertir cada unidad en ensayo (mantener 40–80 w).
- **No tocar:** outputs canónicos, edgeCases, tests strings, solutionCode, fixtures CASO-TAC-047, selfCheck, resources, id `opensource`.

---

## Summary for Fixer (Round 2)

| Unidad / clase | Score típico | Residual |
|----------------|--------------|----------|
| 8× iDo | A / B | Expandir 7 retros cortas; 3–4 `why` al piso |
| 24× weDo | A− / B / **3× C** | P1: T2-B-E2, T3-A-E2, T4-A-E2; P2: ecos + instructions E2 telegráficas + retros E1 |
| 1× youDo | **A** | none required |
| Código/outputs | — | sin cambios requeridos |

**Gold tone references (no copiar contenido):** S26, S30, S33, S50.  
**Anti-aberration:** este reporte se re-inspeccionó unidad por unidad sobre el **source actual** post Round-1; no se copió el ledger de Round-1. El Fixer R2 debe implementar residuales a mano sin generadores.

Section 47 exercise pedagogy review complete. Ready for the Fixer prompt.
