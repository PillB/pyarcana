# S50 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Evals, red teaming y fiabilidad de IA
- **shortTitle:** Evals y red team
- **id:** `tech-leadership` (archivo `s50-tech-leadership.ts`; el **contenido** es evals, red team y fiabilidad del copiloto agentic — **no** soft skills de liderazgo genérico)
- **index:** 50
- **source:** `src/lib/course/sections/s50-tech-leadership.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S50-T1-A task dataset/rúbrica · T1-B outcome/process/trajectory/recovery · T2-A graders det/humano/LLM · T2-B calibración/order bias/holdout · T3-A injection/exfil/tool misuse · T3-B indirect injection/poisoning/least privilege · T4-A hallucination/abstención · T4-B latencia/costo/cache/rollback
- **hilo de caso:** copiloto sintético de operaciones **CASO-ICA-050** (Ica) — continuación del agente con tools de S49; gate **CP-N4-C** (evals retenidos y adversariales; holdout intocable; injection/exfil/tool P0; abstain en unsupported critical; p95/RTO); **stdlib only**, sin API de modelo de pago ni PII real

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist context/goal/success/constraints, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~381–585), `weDo.steps[]` (24 ejercicios, ~587–2057) y `youDo` (~2060–2187) en `s50-tech-leadership.ts`.
- Contrastado con theory T1–T4, learning outcomes y gate CP-N4-C.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.
- Nota: el andamiaje de *código* (bugs invertidos nombrados, fixtures `CASO-ICA-050-*`, outputs canónicos, fade E1 predicado → E2 assess → E3 decide fail-closed) es **maduro** y alineado a theory; los campos `preamble` / `title` (weDo) / `retrospective` **no existen** en el source (0 matches de campos pedagógicos formales).

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S50 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; 1 frase densa; a menudo **bajo** el rango 40–90 palabras del spec |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera evals de IA, **opaco** para newbie sin escena de promote en Ica |
| We Do `feedback` | 1 frase; nombra el principio y el siguiente lab (bien); poco *por qué importa al revisor de scorecard / al portfolio CP-N4-C* |
| Starter `# Bug intencional` | **Excelente** hábito en todos; defectos invertidos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con CP-N4-C |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N4-C; **no** proponer cambios de output salvo notas puntuales |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado → E2 tabla PASS/breach/MISSING → E3 CONTINUE/breach/rama de incertidumbre. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, códigos de acción de contención, fixtures sintéticos Ica, stdlib modelando gates de eval/red team/ops) es maduro y alineado al puente S49 (agente con tools/reanudación) → S50 (medir y bloquear promote). El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al copiloto de Ica, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (predicado → assess tres rutas → decide con rama humana/incertidumbre). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo del gate”, E2 “separa válido/adverso/ausente”, E3 “enruta fail-closed en promote”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Nota de naming interno:** el `id` del section es `tech-leadership` y el archivo se llama `s50-tech-leadership.ts`, pero el título y el contenido son evals/red team/fiabilidad de IA. No es defecto de ejercicio; el Fixer no debe “arreglar” el id en esta ronda salvo que el orchestrator lo pida. El learner ve el título correcto en UI.

**Nota de gold-tone (spec §12):** S50 se lista como referencia de tono de contenido. Eso se confirma en theory, contratos de gate y scaffold de código. **No** se confirma en campos `preamble`/`title`/`retrospective`, que faltan por igual que en secciones hermanas de fase 3.

---

## Unit ledger

### S50-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de manifiesto: slices suman tasks, rúbrica {0,1,2,3}, holdout no vacío. La `description` nombra el skill; falta `preamble` que diga *qué observar* (`coverage_ok`, `cite_sla@v1`, ancla 3) y `retrospective` del misconception “con 40 tasks en un CSV ya hay eval comparable”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de comparar baseline y candidato del copiloto de Ica, el **dataset de tareas** debe cerrar contrato: slices que suman, rúbrica anclada 0–3 y holdout no vacío. En esta demo un manifiesto sintético `cite_sla@v1` (normal 25 / edge 10 / adversarial 5, holdout 10) valida cobertura. No escribas aún: predice `coverage_ok`, el `manifest` y el texto de `anchor_3`. Si crees que “más filas” bastan sin anclas ni holdout sellado, el scorecard miente y el promote se basa en train contaminado.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `dataset_ok` exige tres predicados a la vez — suma de slices, set de rúbrica exacto y holdout en (0, tasks). El manifiesto versionado es la unidad de comparación, no un dump de chats. Sin ancla 3 observable (“cita + claim alineado”) la rúbrica es adjetivo. Puente a We Do: reparar `!=` y holdout siempre True, tabla PASS/REBUILD/MISSING y decide CONTINUE/REBUILD/CALIBRATE.
- **Proposed retrospective:**  
  Si puedes explicar por qué 40 tasks sin holdout o con rúbrica {1,2} no son un eval comparable, ya tienes el hábito de manifiesto. El error clásico es versionar el modelo y no el dataset. En We Do practicarás el predicado, las tres rutas y la rama cuando falta `holdout`.
- **Code/output changes:** none
- **Validation notes:** Output `coverage_ok True` / `manifest cite_sla@v1` / `anchor_3 cita + claim alineado` alineado a theory T1-A.

---

### S50-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter usa `!=` en coverage y `holdout_ok = True`. Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback nombra el manifiesto pero no ancla “por qué el revisor de evals lo exige antes del scorecard”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Manifiesto de dataset con anclas 0–3
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ICA-050-1A`, el equipo de operaciones de Ica solo acepta un eval si el manifiesto cierra slices, rúbrica y holdout.  
  - **Meta:** corregir `coverage_ok`, `holdout_ok` y el gate que imprime PASS o `REBUILD_EVAL_DATASET`.  
  - **Éxito:** imprimes `coverage 40 / 40`, la ancla 3 y `S50-T1-A PASS`.  
  - **Límites:** no inventes slices; no fuerces PASS a mano; no toques los datos del fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `coverage_ok` usa `!=` (bug: aprueba cobertura rota) y `holdout_ok` es siempre True.  
  2. Cambia a `sum(slices.values()) == tasks`.  
  3. Exige `0 < holdout < tasks` y `rubric_levels == {0,1,2,3}`.  
  4. Conserva prints de coverage, `anchor_3` y status PASS/REBUILD_EVAL_DATASET.
- **Proposed feedback improvement:**  
  PASS exige las tres anclas a la vez: cobertura, rúbrica 0–3 y holdout vivo. Un `!=` o holdout “siempre ok” marca verde justo cuando el dataset es basura comparable.
- **Proposed retrospective:**  
  Manifiesto = evidencia de dataset versionado, no un conteo informal. El error clásico es solo mirar el total de tasks. Siguiente (E2): tres rutas válido / adverso / missing `holdout`.
- **Code/output changes:** none
- **Validation notes:** Bug intencional bien nombrado; solution y output `S50-T1-A PASS` correctos.

---

### S50-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: tres records (válido, slice único + rúbrica incompleta + holdout 0, sin `holdout`). Starter invierte el predicado. Falta escena “missing ≠ rebuild” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de dataset (PASS / REBUILD / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de evals en Ica no trata igual un manifiesto limpio, uno roto y uno sin clave `holdout`.  
  - **Meta:** implementar `assess` que distinga PASS, `REBUILD_EVAL_DATASET` y `MISSING:holdout`.  
  - **Éxito:** imprime `PASS REBUILD_EVAL_DATASET MISSING:holdout` en ese orden.  
  - **Límites:** si falta `holdout`, no evalúes cobertura; no inventes el campo; missing ≠ rebuild.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: con campos presentes da PASS cuando la cobertura es *inconsistente* (bug: invertido).  
  2. Primero: calcula `missing` de required; si hay → `MISSING:…`.  
  3. Luego: slices suman + rúbrica {0,1,2,3} + holdout en rango → PASS; si no → REBUILD_EVAL_DATASET.  
  4. Imprime los tres resultados con `print(*results)`.
- **Proposed retrospective:**  
  Missing es incertidumbre de schema; slices rotos o rúbrica incompleta son breach de contenido. El error clásico es tratar “falta holdout” como fallo de coverage. Luego (E3) enrutas CONTINUE / REBUILD / CALIBRATE_RUBRIC.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S50-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a códigos de acción de promote. Starter trata missing y predicado invertido como CONTINUE — defecto de promote silencioso. Falta preamble de “incertidumbre no es verde” y retrospective de reutilización en youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide dataset: CONTINUE o CALIBRATE
- **Proposed preamble:**  
  - **Contexto:** en el scorecard del copiloto de Ica, un manifiesto incompleto no “sigue con warning”: o continúa con evidencia o se calibra la rúbrica.  
  - **Meta:** `decide` → CONTINUE (válido), REBUILD_EVAL_DATASET (adverso), CALIBRATE_RUBRIC (sin holdout).  
  - **Éxito:** `CONTINUE REBUILD_EVAL_DATASET CALIBRATE_RUBRIC`.  
  - **Límites:** no inventes `holdout`; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige missing: sin `holdout` → `CALIBRATE_RUBRIC` (no CONTINUE).  
  2. Con record completo, reutiliza el predicado de E1/E2 (slices + rúbrica + holdout).  
  3. Solo el limpio es CONTINUE; el de slice único/holdout 0 es REBUILD_EVAL_DATASET.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Un campo ausente es calibración, no un allow optimista. El error clásico es promover con “falta holdout, igual se ve balanceado”. Pregunta: ¿por qué REBUILD no es lo mismo que CALIBRATE?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-A.

---

### S50-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: allowlist + `forbidden_used` fallan aunque el outcome sea 3. Falta preamble de “no solo texto final” y retrospective del misconception “si el usuario quedó contento, la trajectory pasó”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Habiendo cerrado el dataset, el riesgo es **calificar solo el párrafo final**. En esta demo un agente limpio con `get_case` pasa; el mismo outcome 3 con `export_csv` y `forbidden_used=True` es P0 de proceso. No escribas: predice `clean`, `p0_export` y por qué `not_only_final_text` es True. Si promueves por respuesta fluida tras tool prohibida, el puente S49 se rompe en el scorecard.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `trajectory_ok` exige cero tools fuera de allowlist y `not forbidden_used`; outcome no entra en este predicado a propósito. Un export fuera de scope es FAIL aunque el texto cite el SLA. Puente a We Do: corregir “solo outcome==3”, assess FAIL_UNSAFE / MISSING y decide HUMAN_REVIEW_PROCESS.
- **Proposed retrospective:**  
  Trajectory eval = proceso y tools, no estética del mensaje. El error clásico es celebrar outcome 3 con tool fuera de allowlist. We Do: predicado, tres rutas y rama de revisión humana de proceso.
- **Code/output changes:** none
- **Validation notes:** Output `clean True` / `p0_export False` / `not_only_final_text True` alineado a theory T1-B.

---

### S50-T1-B-E1 (weDo, guided)
- **Diagnosis:** Drill guiado: starter solo chequea `outcome==3`. Instruction densa; sin title/preamble/retrospective. Feedback apunta a E2 con export_csv pero no ancla el hábito de min(dims).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate de trajectory con allowlist
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ICA-050-1B`, el copiloto de Ica reanudó `get_case` (puente S49); debes calificar dims y tools, no solo el texto.  
  - **Meta:** implementar `trajectory_ok` con min de scores ≥ `min_dim` y tools ∈ ALLOWED.  
  - **Éxito:** imprimes `min_dim 2`, la lista de tools y `S50-T1-B PASS`.  
  - **Límites:** no ignores process/trajectory/recovery; no borres ALLOWED; no apruebes solo por outcome 3.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `trajectory_ok` solo mira `scores["outcome"] == 3`.  
  2. Exige `min(scores.values()) >= min_dim`.  
  3. Exige `all(t in ALLOWED for t in tools)`.  
  4. Conserva prints de min_dim, tools y status PASS/FAIL_UNSAFE_TRAJECTORY.
- **Proposed feedback improvement:**  
  Outcome 3 no salva process bajo o tool fuera de allowlist. El min de las cuatro dims y la allowlist son el mismo gate de promote del agente de S49.
- **Proposed retrospective:**  
  Trajectory = dims + tools, no un “se ve bien”. El error clásico es imprimir solo el score de outcome. Siguiente (E2): válido / export prohibido / missing `min_dimension`.
- **Code/output changes:** none
- **Validation notes:** Solution con `min` + allowlist correcta; output PASS.

---

### S50-T1-B-E2 (weDo, independent)
- **Diagnosis:** Capa independent fuerte: válido limpio, adverso con tool prohibida pese a outcome 3, missing `min_dimension`. Starter premia `forbidden_tool_used`. Falta preamble de “texto limpio ≠ proceso seguro”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de trajectory (PASS / FAIL / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de proceso en Ica distingue run seguro, run con tool prohibida y registro sin umbral de dimensión.  
  - **Meta:** `assess` → PASS, FAIL_UNSAFE_TRAJECTORY, MISSING:min_dimension.  
  - **Éxito:** `PASS FAIL_UNSAFE_TRAJECTORY MISSING:min_dimension`.  
  - **Límites:** no evalúes dims si falta `min_dimension`; outcome 3 no absuelve `forbidden_tool_used`.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS cuando hay tool prohibida y outcome 3 (bug).  
  2. Primero missing de required.  
  3. Luego min de cuatro dims ≥ min_dimension y `not forbidden_tool_used`.  
  4. Imprime la terna exacta.
- **Proposed retrospective:**  
  Forbidden tool es breach de contenido; falta umbral es schema. El error clásico es “el usuario recibió la respuesta correcta”. Luego (E3): CONTINUE / FAIL / HUMAN_REVIEW_PROCESS.
- **Code/output changes:** none
- **Validation notes:** Fade real; fixtures 1B coherentes.

---

### S50-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a códigos de promote de proceso. Starter missing→CONTINUE y confunde outcome con seguridad. Falta retrospective de “cuándo mandar a humano de proceso”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide trajectory: CONTINUE o HUMAN_REVIEW
- **Proposed preamble:**  
  - **Contexto:** en promote del copiloto de Ica, un run sin `min_dimension` no “pasa con asterisco”: o continúa seguro o va a revisión humana de proceso.  
  - **Meta:** CONTINUE (seguro), FAIL_UNSAFE_TRAJECTORY (adverso), HUMAN_REVIEW_PROCESS (incertidumbre).  
  - **Éxito:** `CONTINUE FAIL_UNSAFE_TRAJECTORY HUMAN_REVIEW_PROCESS`.  
  - **Límites:** no inventes scores; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → HUMAN_REVIEW_PROCESS.  
  2. Completo: reutiliza min(dims) y not forbidden.  
  3. Solo el limpio es CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Incertidumbre de umbral ≠ breach de tool. El error clásico es promover sin min_dimension “porque el outcome era 3”. Pregunta: ¿por qué HUMAN_REVIEW no es FAIL_UNSAFE?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T1-B.

---

### S50-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de acuerdo humano–LLM (0.75) y índice en desacuerdo [2]. Falta preamble de calibración del ensemble y retrospective del misconception “si el LLM-judge coincide en promedio, ya es oráculo de promote”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con trajectory auditable, el volumen se escala con **jueces**. En esta demo human=[2,3,2,1] y llm=[2,3,1,1] dan agreement 0.75 (en umbral) y un desacuerdo en el índice 2. No escribas: predice `agreement`, si está `calibrated` y la lista `adjudicate`. Si confías en el LLM-judge sin medir acuerdo ni mandar desacuerdos a humano, el scorecard baseline/candidato se sesga en silencio.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `agreement_rate` es coincidencias/n, no promedio de scores; el umbral 0.75 es política de lab, no magia; los índices en desacuerdo van a adjudicación, no a promote silencioso. Puente a We Do: invertir matches, assess RECALIBRATE/MISSING y decide ADJUDICATE.
- **Proposed retrospective:**  
  Ensemble = det + humano + LLM con acuerdo medible. El error clásico es tratar al LLM-judge como verdad. We Do: tasa de acuerdo, tres rutas y rama de adjudicación.
- **Code/output changes:** none
- **Validation notes:** Output `agreement 0.75` / `calibrated True` / `adjudicate [2]` correcto.

---

### S50-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter cuenta desacuerdos como matches. Instruction densa; feedback apunta a E2 de scores fuera de rango. Sin preamble de “por qué 0.75 importa al promote”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Acuerdo humano–LLM y desacuerdos
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ICA-050-2A`, tres jueces puntúan `cite_sla` en Ica; debes medir si el ensemble es confiable.  
  - **Meta:** corregir `agreement_rate` (coincidencias, no desacuerdos) y listar índices en conflicto.  
  - **Éxito:** `agreement 0.75`, `disagree_idx [2]`, `S50-T2-A PASS`.  
  - **Límites:** no inventes pares; no bajes el umbral a mano; no uses un solo score como oráculo.
- **Proposed instruction/description improvements:**  
  1. Starter: `sum(a != b …)` (bug: cuenta desacuerdos).  
  2. Cambia a `a == b`.  
  3. Construye `disagree` con índices donde difieren.  
  4. PASS si rate ≥ 0.75; imprime agreement, disagree_idx y status.
- **Proposed feedback improvement:**  
  Acuerdo 0.75 con un índice en conflicto es calibrado en el lab, no unánime. Contar desacuerdos como matches marca PASS cuando el ensemble está roto.
- **Proposed retrospective:**  
  Mides acuerdo; no asumes oráculo. El error clásico es promediar scores en lugar de contar coincidencias. Siguiente (E2): scores fuera de [0,1] y missing umbral.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S50-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas: válido (scores en rango + acuerdo 0.78), adverso (score 1.2 + acuerdo 0.3), missing `min_agreement`. Starter invierte el umbral. Falta escena de rango de scores.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de graders (PASS / RECALIBRATE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de jueces en Ica no confía en un ensemble con score 1.2 o acuerdo 0.3.  
  - **Meta:** `assess` → PASS, RECALIBRATE_GRADERS, MISSING:min_agreement.  
  - **Éxito:** `PASS RECALIBRATE_GRADERS MISSING:min_agreement`.  
  - **Límites:** si falta `min_agreement`, no compares; scores deben estar en [0,1].
- **Proposed instruction/description improvements:**  
  1. Starter da PASS cuando el acuerdo es *bajo* (bug).  
  2. Primero missing.  
  3. Luego all scores en [0,1] y agreement ≥ min.  
  4. Imprime la terna exacta.
- **Proposed retrospective:**  
  Score fuera de rango o acuerdo bajo es recalibración; falta umbral es schema. El error clásico es “el LLM ya califica solo”. Luego (E3): CONTINUE / RECALIBRATE / ADJUDICATE_DISAGREEMENT.
- **Code/output changes:** none
- **Validation notes:** Solution exige rango + umbral; correcto.

---

### S50-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a ADJUDICATE_DISAGREEMENT. Starter missing→CONTINUE y premia desacuerdo. Falta retrospective de “no inventes el umbral de acuerdo”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide graders: CONTINUE o ADJUDICATE
- **Proposed preamble:**  
  - **Contexto:** sin umbral de acuerdo declarado, el promote del copiloto de Ica no puede “seguir verde”: debe adjudicar desacuerdos.  
  - **Meta:** CONTINUE / RECALIBRATE_GRADERS / ADJUDICATE_DISAGREEMENT.  
  - **Éxito:** `CONTINUE RECALIBRATE_GRADERS ADJUDICATE_DISAGREEMENT`.  
  - **Límites:** no inventes `min_agreement`; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → ADJUDICATE_DISAGREEMENT.  
  2. Completo: scores en [0,1] y agreement ≥ min.  
  3. Solo el calibrado es CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Adjudicar no es lo mismo que recalibrar: uno es incertidumbre de política, el otro es ensemble roto. Pregunta: ¿por qué un score 1.2 no se “clippea” a 1.0 en silencio?
- **Code/output changes:** none
- **Validation notes:** Transfer real; tokens de acción coherentes con theory T2-A.

---

### S50-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de order bias: gap 0.30 → INVALIDATE aunque holdout intacto. Falta preamble de swap AB/BA y retrospective del misconception “si el holdout no se tocó, el juez es válido”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Calibrado el acuerdo, aún queda el **sesgo de orden**. En esta demo rate_AB=0.60 y rate_BA=0.30 dan gap 0.30 > 0.05 → juez INVALIDATE; el holdout no se tocó. No escribas: predice `gap`, `judge` y por qué holdout_touched=False no salva el gap. Si confías en un LLM-judge que prefiere “la primera opción”, el scorecard AB/BA miente.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `order_gap` es valor absoluto de la diferencia de tasas, no suma ni promedio; umbral 0.05 es política de lab; holdout tocado *también* invalida, pero aquí falla solo el gap. Puente a We Do: arreglar suma de rates, assess INVALIDATE/MISSING y decide SEAL_NEW_HOLDOUT.
- **Proposed retrospective:**  
  Juez válido = anclas + gap bajo + holdout sellado. El error clásico es invalidar solo si “se ve mal el holdout”. We Do: gap correcto, tres rutas y sello de holdout nuevo.
- **Code/output changes:** none
- **Validation notes:** Output `gap 0.3` / `judge INVALIDATE` / `holdout_touched False` correcto.

---

### S50-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter suma rates en vez de |AB−BA|. Fixture sano (0.61/0.59 → 0.02). Sin preamble de por qué el swap importa al promote.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Order gap AB/BA del juez
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ICA-050-2B`, el LLM-judge de Ica se mide con swap de opciones; un gap alto invalida.  
  - **Meta:** corregir `order_gap` a valor absoluto y aplicar política OK/INVALIDATE con holdout intacto.  
  - **Éxito:** `order_gap 0.02`, `judge OK`, `S50-T2-B PASS`.  
  - **Límites:** no inventes rates; no subas MAX_GAP; no ignores `holdout_touched`.
- **Proposed instruction/description improvements:**  
  1. Starter: `return ab + ba` (bug).  
  2. Cambia a `abs(ab - ba)`.  
  3. Juez OK solo si gap ≤ MAX_GAP y not holdout_touched.  
  4. Imprime gap, judge y status.
- **Proposed feedback improvement:**  
  Gap 0.02 ≤ 0.05 con holdout intacto es OK; sumar rates inventa un “gap” 1.2 y mata el juez sano. En E2 un gap 0.30 + holdout tocado invalida de verdad.
- **Proposed retrospective:**  
  Order bias se mide con swap, no se intuye. El error clásico es confiar en una sola presentación AB. Siguiente (E2): válido / gap alto+holdout tocado / missing flag.
- **Code/output changes:** none
- **Validation notes:** Solution y output PASS correctos.

---

### S50-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con anclas, gap y flag de holdout. Starter da PASS al sesgado. Falta escena “holdout tocado es P0 de metodología”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de calibración (PASS / INVALIDATE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de calibración en Ica sella el holdout: si se tocó o el gap es 0.30, el juez no sirve.  
  - **Meta:** PASS / INVALIDATE_JUDGE / MISSING:holdout_touched.  
  - **Éxito:** `PASS INVALIDATE_JUDGE MISSING:holdout_touched`.  
  - **Límites:** no asumas holdout intacto si falta el flag; no ignores anclas bajas.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS cuando gap es alto u holdout tocado (bug).  
  2. Primero missing.  
  3. Luego accuracy≥min, gap≤max y not holdout_touched.  
  4. Imprime la terna.
- **Proposed retrospective:**  
  Holdout tocado o gap alto invalidan; falta flag es schema. El error clásico es retunear temperatura con el holdout “un ratito”. Luego (E3): CONTINUE / INVALIDATE / SEAL_NEW_HOLDOUT.
- **Code/output changes:** none
- **Validation notes:** Solution completa con anclas; correcta.

---

### S50-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a SEAL_NEW_HOLDOUT. Starter missing→CONTINUE. Falta retrospective de “sella de nuevo, no asumas intacto”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide calibración: CONTINUE o SEAL
- **Proposed preamble:**  
  - **Contexto:** sin flag de sellado, el pipeline de Ica no asume holdout limpio: sella uno nuevo y re-evalúa.  
  - **Meta:** CONTINUE / INVALIDATE_JUDGE / SEAL_NEW_HOLDOUT.  
  - **Éxito:** `CONTINUE INVALIDATE_JUDGE SEAL_NEW_HOLDOUT`.  
  - **Límites:** no inventes `holdout_touched=False`; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → SEAL_NEW_HOLDOUT.  
  2. Completo: anclas + gap + not touched.  
  3. Solo el válido es CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Sellar holdout nuevo no es castigo: es honestidad metodológica. Pregunta: ¿por qué un gap 0.02 con holdout tocado igual invalida?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a callout T2-B.

---

### S50-T3-A-DEMO (iDo)
- **Diagnosis:** Demo que separa injection (marcadores de entrada) de exfil (secreto en salida). Falta preamble de “contención, no suerte del prompt” y retrospective del misconception “si el modelo ‘se portó bien’, injection pasó”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con jueces calibrados, el red team ataca **entrada y salida**. En esta demo un texto limpio es `inj_ok`; “Ignore previous…” es `inj_p0`; la salida sin `sk-live` es `exfil_ok`; tools read-only. No escribas: predice las cuatro líneas. Si mezclas injection y exfil en un solo booleano, no sabes qué control falló ni dejas traza P0 usable.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: injection_signal mira marcadores de lab (stdlib, no defensa de producción); injection_blocked es la negación; exfil_blocked exige que ningún secreto aparezca en salida. Son predicados distintos. Puente a We Do: desinvertir ambas funciones, assess BLOCK_SECURITY_P0 y decide PRESERVE_ATTACK_TRACE.
- **Proposed retrospective:**  
  Injection ≠ exfil: entrada hostil vs. secreto en salida. El error clásico es un “security_ok” genérico. We Do: dos controles, tres rutas de fixture y traza preservada.
- **Code/output changes:** none
- **Validation notes:** Output `inj_ok True` / `inj_p0 True` / `exfil_ok True` / `tools read-only` correcto. Nota pedagógica: el lab usa marcadores — el Fixer no debe presentar esto como WAF de producción.

---

### S50-T3-A-E1 (weDo, guided)
- **Diagnosis:** Ambas funciones invertidas de propósito. Instruction densa pero nombra bien “dos controles”. Falta preamble de contención y disclaimer de lab vs producción en el marco de aprendizaje.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Injection y exfil como controles distintos
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ICA-050-3A`, el red team sintético de Ica prueba entrada hostil y leak de token (marcadores de lab, no WAF real).  
  - **Meta:** corregir `injection_signal`/`exfil_blocked` invertidos y demostrar limpio + ataque + sin secreto.  
  - **Éxito:** `inj_ok True`, `atk_caught True`, `exfil_ok True`, `S50-T3-A PASS`.  
  - **Límites:** no unifiques en un solo bool; no borres ATTACK_MARKERS; no uses secretos vivos.
- **Proposed instruction/description improvements:**  
  1. Starter: signal devuelve `not any(…)` y exfil devuelve `any(…)` (ambos invertidos).  
  2. Signal = any marcador en lower.  
  3. Exfil blocked = not any secreto en salida.  
  4. Imprime inj_ok, atk_caught, exfil_ok y status.
- **Proposed feedback improvement:**  
  Contención medible: texto limpio pasa, ataque se detecta, salida sin secreto. Invertir predicados marca PASS cuando el ataque gana.
- **Proposed retrospective:**  
  Red team mide contención, no suerte del system prompt. El error clásico es un booleano genérico. Siguiente (E2): flags de fixture PASS / BLOCK_SECURITY_P0 / MISSING severity.
- **Code/output changes:** none
- **Validation notes:** Solution desinvertida correcta; disclaimer de lab presente en código.

---

### S50-T3-A-E2 (weDo, independent)
- **Diagnosis:** Assess con injection_blocked, exfil bytes, tool scope, severity. Starter pasa cuando injection libre. Falta escena “P0 con traza”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de red team (PASS / BLOCK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de seguridad de Ica no promueve si hay injection libre, bytes de leak o tools admin.  
  - **Meta:** PASS / BLOCK_SECURITY_P0 / MISSING:severity.  
  - **Éxito:** `PASS BLOCK_SECURITY_P0 MISSING:severity`.  
  - **Límites:** sin severity no inventes P0/P1; exige contención + cero exfil + read-only + args válidos.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS cuando injection no se bloqueó (bug).  
  2. Primero missing de severity.  
  3. Luego injection_blocked y exfil==0 y scope read-only y tool_args_valid y severity P0.  
  4. Imprime la terna.
- **Proposed retrospective:**  
  Breach de seguridad es BLOCK; falta severity es schema para preservar traza. El error clásico es “mejoró el scorecard de tasks, igual promote”. Luego (E3): CONTINUE / BLOCK / PRESERVE_ATTACK_TRACE.
- **Code/output changes:** none
- **Validation notes:** Solution multi-predicado correcta.

---

### S50-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a PRESERVE_ATTACK_TRACE. Starter missing→CONTINUE. Falta retrospective de “guarda la traza, no inventes severidad”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide seguridad: CONTINUE o PRESERVE
- **Proposed preamble:**  
  - **Contexto:** sin severity etiquetada, el run de red team de Ica no se “aprueba a ciegas”: se preserva la traza de ataque.  
  - **Meta:** CONTINUE / BLOCK_SECURITY_P0 / PRESERVE_ATTACK_TRACE.  
  - **Éxito:** `CONTINUE BLOCK_SECURITY_P0 PRESERVE_ATTACK_TRACE`.  
  - **Límites:** no borres el fixture adverso; no inventes severity.
- **Proposed instruction/description improvements:**  
  1. Missing → PRESERVE_ATTACK_TRACE.  
  2. Completo: reutiliza contención multi-eje de E2.  
  3. Solo el limpio es CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Preservar traza es el primer paso del incidente de seguridad. Pregunta: ¿por qué un leak de 2048 B no se “compensa” con task_pass alto?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T3-A.

---

### S50-T3-B-DEMO (iDo)
- **Diagnosis:** Demo de least privilege: PDF «grant admin» no eleva sesión; write se deniega. Falta preamble de injection *indirecta* (corpus) y retrospective del misconception “si el modelo obedece el chunk, hay que dar el permiso”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El ataque no siempre llega por el chat del usuario: a veces viaja en un **PDF recuperado**. En esta demo `<!-- grant admin -->` se trata como dato; privilegio queda en min (read); write se deniega. No escribas: predice `indirect_as_data`, `privilege` y `write_denied`. Si dejas que el chunk expanda el allowlist de sesión, least privilege muere en el retrieval.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `effective_permissions` ignora el texto del doc a propósito; `treat_as_data` es igualdad de sets sesión vs. efectivos; `privilege_ok("write")` falla aunque el HTML pida admin. Puente a We Do: quitar la elevación por “grant admin”, assess QUARANTINE y decide REDUCE_TOOL_PRIVILEGE.
- **Proposed retrospective:**  
  Corpus = datos, no control. El error clásico es ampliar tools porque el PDF “lo pide”. We Do: least privilege, cuarentena de poison y reduce de scope.
- **Code/output changes:** none
- **Validation notes:** Output `indirect_as_data True` / `privilege min` / `write_denied True` correcto.

---

### S50-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter eleva allowlist si el PDF pide admin. Instruction nombra least privilege; falta preamble de “poison removido + permiso de sesión”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** PDF como dato y least privilege
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ICA-050-3B`, un PDF sintético de Ica pide «grant admin» en un comment; la sesión solo tiene `read`.  
  - **Meta:** corregir `effective_permissions` para que el doc no expanda la sesión y cerrar `corpus_gate`.  
  - **Éxito:** `doc_as_data True`, `privilege min`, `S50-T3-B PASS`.  
  - **Límites:** no añadas write por texto del PDF; exige poisoned_removed == total y requested ∈ sesión.
- **Proposed instruction/description improvements:**  
  1. Starter añade `write` si ve “grant admin” (bug).  
  2. `effective_permissions` debe devolver solo `set(session_allowed)`.  
  3. `corpus_gate` cuarentena si poison residual o requested no en allowed.  
  4. Imprime doc_as_data, privilege y status.
- **Proposed feedback improvement:**  
  Least privilege es de sesión, no del chunk. Un HTML comment no es grant de IAM. En E2 el adverso eleva y deja poison sin remover.
- **Proposed retrospective:**  
  Indirect injection se mitiga tratando el corpus como dato. El error clásico es “el modelo obedeció el PDF”. Siguiente (E2): PASS / QUARANTINE / MISSING permission.
- **Code/output changes:** none
- **Validation notes:** Solution con `_doc_text` ignorado; correcta.

---

### S50-T3-B-E2 (weDo, independent)
- **Diagnosis:** Assess con treat-as-data, poison removido, permiso ⊆ allowlist. Starter da PASS al elevador. Falta escena de cuarentena de corpus.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de corpus (PASS / QUARANTINE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de corpus de Ica cuarentena si la instrucción eleva, queda poison o se pide write sin permiso.  
  - **Meta:** PASS / QUARANTINE_POISONED_CORPUS / MISSING:requested_permission.  
  - **Éxito:** `PASS QUARANTINE_POISONED_CORPUS MISSING:requested_permission`.  
  - **Límites:** sin requested no asumas read; exige treat-as-data y poison removido.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS cuando no se trata como datos o el permiso no está (bug).  
  2. Primero missing de requested_permission.  
  3. Luego treat-as-data y poisoned_removed≥1 y requested in tool_permissions.  
  4. Imprime la terna.
- **Proposed retrospective:**  
  Cuarentena es breach de corpus; falta permiso pedido es schema. El error clásico es “indexamos igual y ya filtramos en el prompt”. Luego (E3): CONTINUE / QUARANTINE / REDUCE_TOOL_PRIVILEGE.
- **Code/output changes:** none
- **Validation notes:** Solution correcta (umbral ≥1 de poison removido alineado a fixture).

---

### S50-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a REDUCE_TOOL_PRIVILEGE. Starter missing→CONTINUE. Falta retrospective de “reduce scope, no inventes el permiso”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide corpus: CONTINUE o REDUCE
- **Proposed preamble:**  
  - **Contexto:** sin `requested_permission` declarado, el pipeline de Ica no asume el mínimo: reduce privilegio de tools y revisa.  
  - **Meta:** CONTINUE / QUARANTINE_POISONED_CORPUS / REDUCE_TOOL_PRIVILEGE.  
  - **Éxito:** `CONTINUE QUARANTINE_POISONED_CORPUS REDUCE_TOOL_PRIVILEGE`.  
  - **Límites:** no inventes requested=read; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → REDUCE_TOOL_PRIVILEGE.  
  2. Completo: reutiliza treat-as-data + poison + permiso.  
  3. Solo el limpio es CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Reducir privilegio es la respuesta a incertidumbre de scope. Pregunta: ¿por qué QUARANTINE no es lo mismo que REDUCE?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T3-B.

---

### S50-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de abstain: support 0.9 → answer, 0.1 → abstain, critical_unsupported 0. Falta preamble de groundedness y retrospective del misconception “mejor contestar siempre que quedarse callado”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Tras red team de entrada/corpus, el holdout mide **claims sin soporte**. En esta demo support alto permite answer; bajo fuerza abstain; críticas sin soporte en 0. No escribas: predice `high`, `low` y `critical_unsupported`. Si el copiloto inventa un umbral de SLA no presente en el chunk, latencia baja no salva el gate de hallucination.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `claim_action` es umbral simple de lab; thr 0.5; groundedness no se compensa con fluidez ni p95. Una claim crítica inventada en holdout es regresión P0. Puente a We Do: desinvertir el umbral, assess BLOCK_HALLUCINATION y decide REVIEW_ABSTENTION_SLICE.
- **Proposed retrospective:**  
  Abstenerse es un resultado válido, no un fallo de UX. El error clásico es “siempre contestar”. We Do: claim_action, tres rutas de tasa de soporte y revisión de slice.
- **Code/output changes:** none
- **Validation notes:** Output `high answer` / `low abstain` / `critical_unsupported 0` correcto.

---

### S50-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter invierte el umbral (answer cuando support bajo). Instruction clara de high/low. Falta preamble de “fail-closed en holdout”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Abstain cuando support es bajo
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ICA-050-4A`, el copiloto de Ica no debe inventar un SLA ausente del chunk recuperado.  
  - **Meta:** corregir `claim_action` (answer si support≥thr, si no abstain) y mantener critical_unsupported=0.  
  - **Éxito:** `high answer`, `low abstain`, `critical_unsupported 0`, `S50-T4-A PASS`.  
  - **Límites:** no inviertas el umbral; no inventes claims; no borres el conteo crítico.
- **Proposed instruction/description improvements:**  
  1. Starter: `answer if support < thr` (bug).  
  2. Cambia a `support >= thr`.  
  3. Verifica high/low y critical==0.  
  4. Imprime high, low, critical_unsupported y status.
- **Proposed feedback improvement:**  
  Groundedness es abstenerse sin evidencia, no inventar fluidez. Invertir el umbral responde justo cuando el support es basura.
- **Proposed retrospective:**  
  Claim sin soporte → abstain. El error clásico es “el usuario prefiere una respuesta”. Siguiente (E2): tasa de soporte, críticas y missing flag de abstain.
- **Code/output changes:** none
- **Validation notes:** Solution y output PASS correctos.

---

### S50-T4-A-E2 (weDo, independent)
- **Diagnosis:** Assess con support rate, unsupported_critical, abstained_when_empty. Starter da PASS con críticas inventadas. Falta escena “hallucination en holdout es P0”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de groundedness (PASS / BLOCK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de holdout de Ica bloquea si hay críticas sin soporte o no se abstiene cuando falta evidencia.  
  - **Meta:** PASS / BLOCK_HALLUCINATION_REGRESSION / MISSING:abstained_when_empty.  
  - **Éxito:** `PASS BLOCK_HALLUCINATION_REGRESSION MISSING:abstained_when_empty`.  
  - **Límites:** sin flag de abstain no asumas True; rate≥min y critical==0.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS cuando critical>0 o no abstiene (bug).  
  2. Primero missing de abstained_when_empty.  
  3. Luego supported/total ≥ min y critical==0 y abstained_when_empty.  
  4. Imprime la terna.
- **Proposed retrospective:**  
  Hallucination crítica es breach de contenido; falta flag de abstain es schema. El error clásico es “task_pass subió, da igual inventar un claim”. Luego (E3): CONTINUE / BLOCK / REVIEW_ABSTENTION_SLICE.
- **Code/output changes:** none
- **Validation notes:** Solution con rate y flags correcta.

---

### S50-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a REVIEW_ABSTENTION_SLICE. Starter missing→CONTINUE. Falta retrospective de “revisa el slice, no rellenes el flag”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide abstención: CONTINUE o REVIEW
- **Proposed preamble:**  
  - **Contexto:** sin evidencia de que el sistema se abstuvo en vacío, el revisor de Ica no asume groundedness: revisa el slice de abstención.  
  - **Meta:** CONTINUE / BLOCK_HALLUCINATION_REGRESSION / REVIEW_ABSTENTION_SLICE.  
  - **Éxito:** `CONTINUE BLOCK_HALLUCINATION_REGRESSION REVIEW_ABSTENTION_SLICE`.  
  - **Límites:** no inventes abstained_when_empty=True; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → REVIEW_ABSTENTION_SLICE.  
  2. Completo: rate + critical==0 + abstain flag.  
  3. Solo el grounded es CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Revisar el slice de abstención es incertidumbre metodológica, no un “casi PASS”. Pregunta: ¿por qué 2 críticas unsupported no se “promedian” con 18 claims buenas?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T4-A.

---

### S50-T4-B-DEMO (iDo)
- **Diagnosis:** Demo operativa: p95 y rollback vs. RTO. Tres casos healthy/slow/rto_breach. Falta preamble de “aunque T1–T4A pasen, canary roto no promote” y retrospective del misconception “reiniciar el pod es rollback”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Aunque dataset, trajectory, jueces, red team y abstain estén verdes, el **canary** puede romper el SLO. En esta demo p95 850 y rollback 8 min pasan; p95 2500 o rollback 60 vs. RTO 10 activan ROLLBACK_AI_RELEASE. No escribas: predice healthy, slow y rto_breach. Si “reinicias el pod” sin evidencia ni RTO, no hay fiabilidad operativa.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `ops_ok` es conjunción p95≤slo y rollback≤rto; en el lab se omiten costo/ACL para foco visual, pero theory y We Do los exigen. Rollback no es “restart hope”. Puente a We Do: gate multi-eje, assess ROLLBACK/MISSING rto y decide ACTIVATE_INCIDENT_RESPONSE.
- **Proposed retrospective:**  
  Fiabilidad = latencia + costo + ACL + rollback en RTO. El error clásico es promover por task_pass con p95 roto. We Do: reliability_gate completo, tres rutas y incidente sin RTO.
- **Code/output changes:** none (demo intencionalmente más simple que E1; Fixer no debe alinear outputs salvo que se unifique el contrato en ronda de fix de código — no pedido aquí)
- **Validation notes:** Output `healthy PASS` / `slow ROLLBACK_AI_RELEASE` / `rto_breach ROLLBACK_AI_RELEASE` correcto. Nota: demo no imprime costo/ACL; We Do E1 sí los exige — coherente con fade de complexity, no es bug.

---

### S50-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter solo mira p95. Instruction nombra multi-eje. Falta preamble de scorecard operativo del canary de Ica.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Scorecard p95, costo, ACL y RTO
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ICA-050-4B`, el canary del copiloto de Ica solo se acepta si p95, costo, cache ACL y rollback caben en política.  
  - **Meta:** completar `reliability_gate` multi-eje (no solo p95).  
  - **Éxito:** `healthy PASS`, `p95_ok True`, `S50-T4-B PASS`.  
  - **Límites:** no ignores costo/ACL/RTO; no fuerces PASS; snapshot sano del starter se conserva.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS solo si p95≤slo (bug: incompleto).  
  2. Añade cost≤cap y cache_acl_safe y rollback_min≤rto_min.  
  3. Evalúa snapshot 850/0.07/True/8/10.  
  4. Imprime healthy, p95_ok y status.
- **Proposed feedback improvement:**  
  Un p95 sano con rollback de 60 min sigue siendo ROLLBACK. Multi-eje cierra el scorecard operativo del Tú haces.
- **Proposed retrospective:**  
  Fiabilidad operativa no se reduce a latencia. El error clásico es “p95 ok, ya promote”. Siguiente (E2): canary sano / roto / missing RTO.
- **Code/output changes:** none
- **Validation notes:** Solution multi-eje correcta; output PASS.

---

### S50-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con p95, costo, ACL, rollback, RTO. Starter da PASS al canary roto. Falta escena “RTO ausente ≠ PASS”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de canary (PASS / ROLLBACK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el on-call de Ica distingue canary sano, canary con p95/ACL/RTO rotos y registro sin RTO documentado.  
  - **Meta:** PASS / ROLLBACK_AI_RELEASE / MISSING:rto_minutes.  
  - **Éxito:** `PASS ROLLBACK_AI_RELEASE MISSING:rto_minutes`.  
  - **Límites:** sin rto_minutes no compares rollback; no apruebes p95 2500 ni ACL False.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS cuando p95>slo o ACL rota (bug).  
  2. Primero missing de rto_minutes.  
  3. Luego p95≤slo, cost≤cap, ACL safe, rollback≤rto.  
  4. Imprime la terna.
- **Proposed retrospective:**  
  Canary roto es rollback con evidencia; falta RTO es schema de incidente. El error clásico es “subimos task_pass, el p95 ya se verá”. Luego (E3): CONTINUE / ROLLBACK / ACTIVATE_INCIDENT_RESPONSE.
- **Code/output changes:** none
- **Validation notes:** Solution multi-eje correcta.

---

### S50-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a ACTIVATE_INCIDENT_RESPONSE. Starter missing→CONTINUE. Falta retrospective de “abre incidente, no asumas RTO”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide ops: CONTINUE o INCIDENT
- **Proposed preamble:**  
  - **Contexto:** sin RTO documentado, el release de IA en Ica no “sigue con fe”: se activa respuesta a incidente.  
  - **Meta:** CONTINUE / ROLLBACK_AI_RELEASE / ACTIVATE_INCIDENT_RESPONSE.  
  - **Éxito:** `CONTINUE ROLLBACK_AI_RELEASE ACTIVATE_INCIDENT_RESPONSE`.  
  - **Límites:** no inventes rto_minutes=10; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → ACTIVATE_INCIDENT_RESPONSE.  
  2. Completo: reutiliza reliability multi-eje de E1/E2.  
  3. Solo el canary sano es CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Incidente sin RTO no es lo mismo que rollback medido. Pregunta: ¿por qué un rollback de 60 min con RTO 10 no se “arregla” reiniciando el pod?
- **Code/output changes:** none
- **Validation notes:** Transfer cierra T4-B y el scorecard del youDo.

---

### youDo · Evals, red teaming y fiabilidad de IA (youDo)
- **Diagnosis:** Proyecto portfolio sólido: context de CASO-ICA-050, starter con 3 filas (normal / trajectory P0 / injection+hallucination), baseline vs. candidato con p95 sobre SLO, `scorecard` + `readiness` + checklist de evidencia REQUIRED. Rubric y portfolioNote alineados a CP-N4-C. **Falta `retrospective`** de defensa post-build (invariantes, PII sintético, impacto medible).
- **Checklist:** context pass · goal pass · success pass (rubric + asserts) · constraints pass (sintético, sin PII) · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Evals, red teaming y fiabilidad de IA
- **Proposed preamble:** N/A como campo separado — el `context` ya cumple rol de escena; no reescribir en fix salvo acortar si el Fixer unifica tono. Opcional micro-refuerzo en portfolioNote si se desea.
- **Proposed instruction/description improvements:**  
  Mantener objectives/requirements. En fix, añadir solo `retrospective` (abajo). No cambiar outputs del starter: el lab debe abrir en BLOCKED con issues P0_trajectory, P0_injection, P0_hallucination, P1_latency_slo.
- **Proposed retrospective:**  
  Antes de marcar READY: (1) ¿qué invariante del gate CP-N4-C demuestras con el print del scorecard (P0 bloquea promote)? (2) ¿qué harías distinto con datos reales vs. sintéticos de Ica (PII, secretos, holdout sellado)? (3) En el README, una frase de impacto medible (antes/después de bloquear regresión P0) que puedas defender en 30 segundos ante un revisor de plataforma.
- **Code/output changes:** none
- **Validation notes:** Starter coherente; evidence inicia en False a propósito; asserts permiten READY/BLOCKED sin forzar PROMOTE falso.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback polish opcional)
1. **S50-T1-A-E1, E2, E3** — manifiesto dataset / assess / decide CALIBRATE_RUBRIC  
2. **S50-T1-B-E1, E2, E3** — trajectory allowlist / FAIL_UNSAFE / HUMAN_REVIEW_PROCESS  
3. **S50-T2-A-E1, E2, E3** — agreement / RECALIBRATE / ADJUDICATE_DISAGREEMENT  
4. **S50-T2-B-E1, E2, E3** — order gap / INVALIDATE / SEAL_NEW_HOLDOUT  
5. **S50-T3-A-E1, E2, E3** — injection≠exfil / BLOCK_SECURITY_P0 / PRESERVE_ATTACK_TRACE  
6. **S50-T3-B-E1, E2, E3** — least privilege / QUARANTINE / REDUCE_TOOL_PRIVILEGE  
7. **S50-T4-A-E1, E2, E3** — abstain / BLOCK_HALLUCINATION / REVIEW_ABSTENTION_SLICE  
8. **S50-T4-B-E1, E2, E3** — reliability multi-eje / ROLLBACK / ACTIVATE_INCIDENT_RESPONSE  

### P1
- **8× iDo demos** — añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras  
- **youDo** — añadir `retrospective` de defensa CP-N4-C  

### P2
- Acortar We Do `instruction` a pasos solo-tarea (40–100 palabras) una vez exista preamble  
- Enriquecer `feedback` (25–60 palabras) con *por qué importa al revisor de scorecard / portfolio*  
- Opcional: alinear disclaimer “marcadores de lab ≠ defensa de producción” en preambles T3-A (no en código)

---

## Residual risks

1. **Carga cognitiva del dominio:** S50 es Master / fase 3; un “true newbie” de Python puro puede atascarse en el *vocabulario* (holdout, order bias, trajectory) aunque el scaffold de código sea limpio. Las preambles deben anclar el caso Ica en lenguaje concreto, no solo tokens de gate.  
2. **Fade de prosa vs. código:** el código ya hace fade real E1→E2→E3; si el Fixer copia la misma plantilla de bullets en los 24 labs, se rompe el anti-aberration. Cada subtema necesita escena y misconception propios (dataset vs. tool prohibida vs. gap AB/BA vs. PDF grant admin vs. abstain vs. RTO).  
3. **Naming interno `tech-leadership`:** el learner ve el título correcto; no renombrar id/archivo en esta ronda sin mandato del orchestrator.  
4. **Demo T4-B más simple que E1:** no “arreglar” la demo para incluir costo/ACL salvo decisión explícita de unificación; documentar en fix si se toca.  
5. **Marcadores de injection en stdlib:** riesgo de que el learner crea que una frase clave es defensa de producción; preamble/retrospective T3-A deben cerrar ese misconception.  
6. **youDo READY con evidence False:** el diseño es intencional (BLOCKED hasta artefactos reales); el Fixer no debe “suavizar” asserts para un false PROMOTE.  
7. **Outputs canónicos:** no cambiar strings de PASS/tokens de breach; el scorecard del live site y tests implícitos dependen de ellos.

---

## Fixer handoff (summary)

| Acción | Unidades |
|--------|----------|
| Añadir `title` + `preamble` + `retrospective`; separar `instruction` a pasos | 24 weDo |
| Añadir `preamble` + `retrospective`; ampliar `why` | 8 iDo |
| Añadir `retrospective` | 1 youDo |
| Cambios de código/output | **ninguno** salvo bug de ejecución descubierto en fix |
| Generators / bulk paste | **prohibidos** |

Prosa learner-facing: **español profesional peruano**, longitudes del spec, un objetivo primario por unidad, fade E1 construye → E2 assess → E3 decide.

---

Section 50 exercise pedagogy review complete. Ready for the Fixer prompt.
