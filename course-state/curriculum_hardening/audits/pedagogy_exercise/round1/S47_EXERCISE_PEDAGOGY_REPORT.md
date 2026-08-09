# S47 Exercise Pedagogy Report (Round 1)

## Section
- **title:** MLOps: experimentos, registro y serving
- **shortTitle:** MLOps serving
- **id:** `opensource` (archivo `s47-opensource.ts`; el **contenido** es Production Data/ML Platform — tracking, registry, feature parity, canary y rollback — **no** “open source” genérico)
- **index:** 47
- **source:** `src/lib/course/sections/s47-opensource.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S47-T1-A tracking/repro · T1-B lineage/comparación · T2-A firmas/stages/approvals · T2-B artefactos/card · T3-A batch/online parity · T3-B latencia/fallback · T4-A shadow/canary · T4-B rollback/retirement/audit
- **hilo de caso:** priorización sintética de atención **CASO-TAC-047** (Tacna) — ranker sintético sin GPU ni PII real; gate **CP-N4-B + CF-4** (modelo promovible y reversible; missing ≠ breach)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~311–492), `weDo.steps[]` (24 ejercicios, ~494–1675) y `youDo` (~1677–1752) en `s47-opensource.ts`.
- Contrastado con theory T1–T4, learning outcomes y gate CP-N4-B + CF-4.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S47 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1 frase** (bajo el rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + Caso 047 + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera MLOps, **opaco** para newbie sin escena de promote en Tacna |
| We Do `feedback` | 1 frase; nombra el principio (bien); poco *por qué importa al promote / al revisor / al portfolio* |
| Starter `# DEFECT` | **Excelente** hábito en todos; defectos invertidos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con CP-N4-B + CF-4 |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CF-4; **no** proponer cambios de output salvo notas puntuales |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado → E2 tabla PASS/breach/MISSING → E3 CONTINUE/breach/rama humana. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, verbos de acción, fixtures sintéticos Tacna, stdlib al estilo MLflow/registry) es maduro y alineado al puente S46 lineage de datos → S47 lineage de modelos y serving. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al ranker de Tacna, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (predicado → assess tres rutas → decide con rama humana). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo del contrato”, E2 “separa válido/adverso/ausente”, E3 “enruta fail-closed en promote/serving”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Nota de naming interno:** el `id` del section es `opensource` y el archivo se llama `s47-opensource.ts`, pero el título y el contenido son MLOps (experimentos, registry, serving). No es defecto de ejercicio; el Fixer no debe “arreglar” el id en esta ronda salvo que el orchestrator lo pida. El learner ve el título correcto en UI.

---

## Unit ledger

### S47-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de reproducibilidad: seed + params + `|metric−rerun| ≤ tol`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (run_ok, seed, delta 0.005) y `retrospective` del misconception “con seed=42 el número ya es evidencia de promote”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de comparar un candidato con el baseline en el ranker de Tacna, el run debe ser **re-ejecutable**. En esta demo un experiment sintético (`depth=4`, metric 0.81, rerun 0.805, tol 0.01) exige seed presente, params no vacíos y delta dentro de tolerancia. No escribas aún: predice `run_ok`, el `seed` y el `delta` antes de mirar la salida. Si crees que “semilla fija” basta sin params ni rerun, el dashboard miente y el promote se basa en anécdota.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `within_tol` modela el contrato de re-ejecución; `bool(params)` y `seed is not None` cierran el caso de run vacío o sin ancla aleatoria. El delta 0.005 ≤ 0.01 es evidencia, no magia del dashboard. Orden: tracking reproducible antes de lineage comparable. Puente a We Do: reparar el comparador invertido (`>` vs `≤`), tabla PASS/MARK/MISSING y decide CONTINUE/MARK/INVESTIGATE.
- **Proposed retrospective:**  
  Si puedes explicar por qué un F1 alto sin seed o con params vacíos no es promote, ya tienes el hábito de evidencia de run. El error clásico es confiar en un score de una sola corrida. En We Do practicarás el predicado, las tres rutas y la rama de incertidumbre cuando falta `tolerance`.
- **Code/output changes:** none
- **Validation notes:** Output `run_ok True` / `seed 42` / `delta 0.005` alineado a theory T1-A.

---

### S47-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter usa `>` en lugar de `≤` y omite seed/params. Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback nombra el comparador pero no ancla “por qué el revisor de experiments lo exige antes del registry”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rerun dentro de tolerancia con seed
- **Proposed preamble:**  
  - **Contexto:** en `CASO-TAC-047-1A`, el equipo de priorización en Tacna solo acepta un run si el rerun cae dentro de tolerancia con seed y params.  
  - **Meta:** corregir `meets_contract` (seed presente + params no vacíos + `|metric−rerun| ≤ tol`).  
  - **Éxito:** imprimes exactamente `S47-T1-A PASS` con el fixture válido.  
  - **Límites:** no inventes métricas; no borres el assert; no toques los datos del fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` usa `>` (bug: aprueba lo no reproducible).  
  2. Exige `record.get("seed") is not None` y `bool(record["params"])`.  
  3. Cambia a `abs(metric - rerun_metric) <= tolerance`.  
  4. Conserva el print `S47-T1-A` y el status PASS/MARK_RUN_NONREPRODUCIBLE.
- **Proposed feedback improvement:**  
  PASS exige las tres anclas a la vez: seed, params y delta ≤ tol. Un delta 0.005 con tol 0.01 es reproducible; invertir el comparador marca PASS justo cuando el run es basura.
- **Proposed retrospective:**  
  Reproducibilidad = re-ejecución controlada, no un score bonito. El error clásico es solo mirar el número grande. Siguiente (E2): tres rutas válido / adverso / missing `tolerance`.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S47-T1-A PASS` correctos.

---

### S47-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: tres records (válido, params vacíos+delta alto, sin `tolerance`). Starter invierte el predicado. Falta escena “missing ≠ breach” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de tracking (PASS / MARK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de experiments en Tacna no trata igual un run limpio, uno divergente y uno sin tolerancia declarada.  
  - **Meta:** implementar `assess` que distinga PASS, MARK_RUN_NONREPRODUCIBLE y MISSING:tolerance.  
  - **Éxito:** imprime `PASS MARK_RUN_NONREPRODUCIBLE MISSING:tolerance` en ese orden.  
  - **Límites:** si falta `tolerance`, no evalúes el delta; no inventes el campo; missing ≠ “marcar no reproducible”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: con campos presentes devuelve PASS si el delta es *mayor* que tol (bug: invertido).  
  2. Primero: calcula `missing` de required; si hay → `MISSING:…`.  
  3. Luego: seed + params + delta ≤ tol → PASS; si no → MARK_RUN_NONREPRODUCIBLE.  
  4. Imprime los tres resultados con `print(*results)`.
- **Proposed retrospective:**  
  Missing es incertidumbre de protocolo; params vacíos o delta alto son breach de contenido. El error clásico es tratar “falta tolerancia” como fallo de métrica. Luego (E3) enrutas CONTINUE / MARK / INVESTIGATE_RANDOMNESS.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S47-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a códigos de acción de promote. Starter trata missing y predicado invertido como CONTINUE — defecto de promote silencioso. Falta preamble de “incertidumbre no es verde” y retrospective de reutilización en youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide tracking: CONTINUE o INVESTIGATE
- **Proposed preamble:**  
  - **Contexto:** en producción del ranker de Tacna, un run incompleto no “sigue con warning”: o continúa con evidencia o se investiga.  
  - **Meta:** `decide` → CONTINUE (reproducible), MARK_RUN_NONREPRODUCIBLE (adverso), INVESTIGATE_RANDOMNESS (sin tolerance).  
  - **Éxito:** `CONTINUE MARK_RUN_NONREPRODUCIBLE INVESTIGATE_RANDOMNESS`.  
  - **Límites:** no inventes `tolerance`; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige missing: sin `tolerance` → `INVESTIGATE_RANDOMNESS` (no CONTINUE).  
  2. Con record completo, reutiliza el predicado de E1/E2 (seed + params + delta ≤ tol).  
  3. Solo el limpio es CONTINUE; el de params vacíos/delta alto es MARK_RUN_NONREPRODUCIBLE.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Un campo ausente es investigación, no un allow optimista. El error clásico es promover con “falta tolerancia, igual se ve estable”. Pregunta: ¿por qué MARK no es lo mismo que INVESTIGATE?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-A.

---

### S47-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: lineage completo + versionado + candidate > baseline vs. train/latest inválidos. Falta preamble de “comparación honesta” y retrospective del misconception “un F1 0.90 en train gana al baseline”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Habiendo fijado el rerun, el riesgo es **comparar manzanas con naranjas**. En esta demo un candidato 0.82 en holdout-v1 con lineage `ds-v3` / `git:abc` / `locked` supera al baseline 0.78; un run con split=train o code=latest se invalida aunque el score sea 0.90. No escribas: predice `ok`, `invalid` y el `delta` 0.04. Si promueves por score sin anclas de data/code/env/split/métrica, el registry recibe basura comparable solo en el papel.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `lineage` exige campos no vacíos; `versioned` bloquea `latest`, `train` y `unknown`; solo entonces `candidate > baseline` cuenta. Un score alto en train no es evidencia de promote. Puente a We Do: corregir predicado invertido, assess INVALIDATE/MISSING y decide RESTORE_LINEAGE.
- **Proposed retrospective:**  
  Comparación honesta = mismas anclas + holdout + métrica definida. El error clásico es celebrar F1 de train. We Do: predicado, tres rutas y rama de restaurar lineage.
- **Code/output changes:** none
- **Validation notes:** Output `ok True` / `invalid False` / `delta 0.04` alineado a theory T1-B.

---

### S47-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter niega data o exige candidate ≤ baseline (predicado al revés). Instruction densa; sin title/preamble/retrospective. Feedback pregunta por el campo adverso pero el learner no tiene escena de “por qué el holdout importa en Tacna”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Lineage completo y candidato > baseline
- **Proposed preamble:**  
  - **Contexto:** en `CASO-TAC-047-1B`, el ranker de Tacna solo entra a la tabla de comparación si data/code/env/split/métrica están versionados y el candidato gana en holdout.  
  - **Meta:** completar `meets_contract` (lineage + no latest/train/unknown + candidate > baseline).  
  - **Éxito:** `S47-T1-B PASS`.  
  - **Límites:** no cambies scores del fixture; no aceptes `code=latest` “por conveniencia”.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `not record["data"] or candidate <= baseline` (bug: aprueba lo inválido).  
  2. Calcula `lineage_ok` con `all(...)` sobre data/code/env/split/metric_definition.  
  3. Añade `versioned` (code ≠ latest, split ≠ train, metric ≠ unknown).  
  4. Exige `candidate > baseline` y conserva print/status.
- **Proposed feedback improvement:**  
  Un candidate 0.90 con split=train se invalida aunque “gane” al baseline: no hay comparación homogénea. El holdout y la definición de métrica son parte del contrato, no adornos.
- **Proposed retrospective:**  
  Lineage completo es el ticket de entrada a la tabla de comparación. El error clásico es solo mirar `candidate > baseline`. Siguiente (E2): PASS / INVALIDATE / MISSING:baseline.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S47-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas sólidas; adverso con data/env vacíos, latest, train, unknown. Falta preamble de missing≠breach y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de comparación (PASS / INVALIDATE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de comparación en Tacna separa run limpio, run no comparable y registro sin baseline.  
  - **Meta:** `assess` → PASS, INVALIDATE_COMPARISON, MISSING:baseline.  
  - **Éxito:** `PASS INVALIDATE_COMPARISON MISSING:baseline`.  
  - **Límites:** sin baseline no evalúes candidate; no rellenes lineage vacío.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si falta data o candidate ≤ baseline (bug).  
  2. Primero missing de required.  
  3. Luego lineage_ok + versioned + candidate > baseline.  
  4. Imprime la tripleta en orden.
- **Proposed retrospective:**  
  Missing de baseline es RESTORE_LINEAGE en E3, no INVALIDATE. Un score 0.90 con train sigue siendo INVALIDATE por contenido. Luego decides CONTINUE / INVALIDATE / RESTORE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S47-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a CONTINUE/INVALIDATE/RESTORE_LINEAGE. Starter missing→CONTINUE y pred invertido. Falta cierre metacognitivo sobre “score alto no salva lineage”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide comparación: CONTINUE o RESTORE
- **Proposed preamble:**  
  - **Contexto:** sin baseline o con lineage roto, el promote del ranker no “sigue con fe”.  
  - **Meta:** `decide` → CONTINUE / INVALIDATE_COMPARISON / RESTORE_LINEAGE.  
  - **Éxito:** esa tripleta exacta.  
  - **Límites:** no inventes baseline; no conviertas uncertainty en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → RESTORE_LINEAGE (no CONTINUE).  
  2. Completo: reutiliza predicado de E1/E2.  
  3. Adverso (latest/train/unknown) → INVALIDATE_COMPARISON.  
  4. Imprime en orden valid/invalid/uncertain.
- **Proposed retrospective:**  
  Restaurar lineage es trabajo de evidencia, no castigo por score bajo. El error clásico es invalidar un run incompleto como si fuera trampa. Pregunta: ¿qué ancla falta más a menudo en tu equipo — data, code o env?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T1-B.

---

### S47-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de SERVICE_SIG + staging + approved vs. production sin approve y firma rota. Falta preamble de gobernanza vs. digest y retrospective del misconception “si el hash existe, production está bien”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con un candidato que ya ganó en holdout, el **registry** exige otra capa. En esta demo la firma `age:int`, `region:str` → `priority:float` solo promueve en `staging` con `approved=True`. Un fixture en production sin approve o con firma rota se deniega. No escribas: predice `staging_ok`, `prod_no_approve` y `bad_sig`. Si confundes digest válido con permiso de promote, el entorno de producción se abre sin gobernanza.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: la igualdad es contra `SERVICE_SIG` (contrato del servicio), no contra “lo que el run diga”; `approved` es independiente del hash; en lab `staging` modela el gate pre-producción (alias/tag en MLflow moderno). Puente a We Do: reparar predicado, assess DENY/MISSING y REQUEST_MODEL_APPROVAL.
- **Proposed retrospective:**  
  Promote = firma + stage gobernado + aprobación explícita. El error clásico es “ya está en production en el JSON”. We Do: predicado, tres rutas y rama de pedir aprobación.
- **Code/output changes:** none
- **Validation notes:** Output True/False/False alineado a theory T2-A.

---

### S47-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba si no approved o stage=production (invertido). Sin title/preamble/retrospective; instruction densa.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Firma, staging y approved=True
- **Proposed preamble:**  
  - **Contexto:** en `CASO-TAC-047-2A`, el ranker de Tacna solo entra a staging con firma exacta al servicio y aprobación explícita.  
  - **Meta:** `meets_contract` con SERVICE_SIG + stage=staging + approved.  
  - **Éxito:** `S47-T2-A PASS`.  
  - **Límites:** no saltes a production; no aflojes la firma “por demo”.
- **Proposed instruction/description improvements:**  
  1. Starter: `not approved or stage == production` (bug).  
  2. Compara input/output con SERVICE_SIG.  
  3. Exige stage=="staging" y approved truthy.  
  4. Conserva print PASS/DENY_MODEL_PROMOTION.
- **Proposed feedback improvement:**  
  Production sin approve es DENY, no “casi listo”. La firma rota (age:str, output vacío) también deniega aunque el stage sea staging.
- **Proposed retrospective:**  
  Aprobación y firma son gates distintos del digest. El error clásico es promover por hash. Siguiente (E2): PASS / DENY / MISSING:approved.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S47-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con adverso production+firma rota. Falta escena missing≠DENY.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de promote (PASS / DENY / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor del registry en Tacna separa promote limpio, promote ilegal y registro sin flag de aprobación.  
  - **Meta:** `assess` → PASS, DENY_MODEL_PROMOTION, MISSING:approved.  
  - **Éxito:** esa tripleta exacta.  
  - **Límites:** sin approved no evalúes stage; no rellenes el booleano.
- **Proposed instruction/description improvements:**  
  1. Starter invierte PASS/DENY.  
  2. Missing primero.  
  3. Luego sig_ok + staging + approved.  
  4. Imprime `print(*results)`.
- **Proposed retrospective:**  
  Missing approved es REQUEST en E3, no DENY. El adverso combina firma y stage ilegal: breach de contenido. Luego decides CONTINUE / DENY / REQUEST.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S47-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a CONTINUE/DENY/REQUEST_MODEL_APPROVAL. Starter missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide promote: CONTINUE o REQUEST
- **Proposed preamble:**  
  - **Contexto:** en el camino CF-4, falta de aprobación es trabajo humano, no luz verde silenciosa.  
  - **Meta:** CONTINUE / DENY_MODEL_PROMOTION / REQUEST_MODEL_APPROVAL.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** no inventes approved; no sirvas production “mientras piden el OK”.
- **Proposed instruction/description improvements:**  
  1. Missing → REQUEST_MODEL_APPROVAL.  
  2. Completo: predicado de E1/E2.  
  3. Adverso → DENY_MODEL_PROMOTION.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  La aprobación es independiente del digest. El error clásico es “el artefacto existe, listo”. Pregunta: ¿qué pedirías en la card de aprobación antes de tocar production?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T2-A.

---

### S47-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de digest sha256, features alineadas y card de 4 secciones vs. skew y thin card. Falta preamble de “artefacto gobernado” y retrospective del misconception “latest basta si el F1 es alto”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El registry no solo guarda un pickle: el artefacto del ranker de Tacna necesita **digest versionado**, **misma feature version** en train y serving, y **model card** con uso, límites, métricas y riesgos. Observa `ok`, `skew` y `thin`: latest, skew o card solo con `use` son rechazo. No escribas aún. Si publicas sin card, producto no sabe cuándo el score no aplica.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `startswith("sha256:")` modela digest real; igualdad train/serve evita skew silencioso; `REQUIRED <= sections` exige card mínima. Thin card y latest no son “cosméticos”. Puente a We Do: predicado, REJECT/MISSING y COMPLETE_MODEL_CARD.
- **Proposed retrospective:**  
  Artefacto gobernado = digest + paridad de features + card completa. El error clásico es promote con digest `latest`. We Do: tres capas hasta la rama de completar card.
- **Code/output changes:** none
- **Validation notes:** Output True/False/False alineado a theory T2-B.

---

### S47-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba con skew o card incompleta (invertido). Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Digest, features alineadas y card completa
- **Proposed preamble:**  
  - **Contexto:** en `CASO-TAC-047-2B`, el artefacto del ranker solo pasa si hay sha256, features-v3 en train y serve, y card de cuatro secciones.  
  - **Meta:** corregir `meets_contract` (digest + igualdad features + card ⊇ REQUIRED).  
  - **Éxito:** `S47-T2-B PASS`.  
  - **Límites:** no uses `latest`; no recortes la card a “use”.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si hay skew o card corta (bug).  
  2. Exige `artifact_digest.startswith("sha256:")`.  
  3. `feature_version == serving_feature_version`.  
  4. `{"use","limits","metrics","risks"} <= card_sections` y print PASS/REJECT.
- **Proposed feedback improvement:**  
  En el adverso fallan latest, skew y card thin a la vez; cualquiera basta para REJECT. Contar `len < 4` es un proxy; el contrato real es el conjunto de secciones.
- **Proposed retrospective:**  
  Card incompleta es riesgo de producto, no de formato. El error clásico es documentar solo el uso feliz. Siguiente (E2): PASS / REJECT / MISSING:card_sections.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S47-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas sólidas; falta escena missing≠REJECT.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de artefacto (PASS / REJECT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de artefactos en Tacna distingue card completa, artefacto basura y ausencia de secciones.  
  - **Meta:** PASS / REJECT_MODEL_ARTIFACT / MISSING:card_sections.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** sin card_sections no evalúes digest; no inventes secciones.
- **Proposed instruction/description improvements:**  
  1. Starter invierte PASS/REJECT.  
  2. Missing primero.  
  3. Luego digest + paridad + card completa.  
  4. Imprime resultados.
- **Proposed retrospective:**  
  Missing card es COMPLETE en E3; skew/latest es REJECT de contenido. No rellenes la card con placeholders. Luego decides CONTINUE / REJECT / COMPLETE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S47-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE/REJECT/COMPLETE_MODEL_CARD. Starter missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide artefacto: CONTINUE o COMPLETE
- **Proposed preamble:**  
  - **Contexto:** sin card no se inventan límites: se deriva a completar evidencia.  
  - **Meta:** CONTINUE / REJECT_MODEL_ARTIFACT / COMPLETE_MODEL_CARD.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** no inventes secciones; no promote con latest.
- **Proposed instruction/description improvements:**  
  1. Missing → COMPLETE_MODEL_CARD.  
  2. Completo: predicado de E1/E2.  
  3. Adverso → REJECT_MODEL_ARTIFACT.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  Completar card es trabajo de gobernanza, no un “warning de markdown”. El error clásico es copiar un README de una línea. Pregunta: ¿qué sección de la card fallaría primero en tu ranker sintético?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T2-B.

---

### S47-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de paridad batch/online, anti-leakage y ≥3 contract tests. Falta preamble de training-serving skew y retrospective del misconception “F1 de lab salva features distintas”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Habiendo registrado el modelo, el riesgo clásico de production es el **training-serving skew**. En esta demo batch y online emiten `[0.1, 0.4, 0.8]` con leakage=False y 3 contract tests; si online diverge o hay leakage, el predicado falla. No escribas: predice `ok`, `skew` y `leak`. Si sirves con features distintas, el F1 de laboratorio no describe el tráfico de Tacna.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: igualdad de vectores modela paridad; `not leakage` bloquea información del futuro/label; `tests >= 3` exige contract tests mínimos antes del canary. Puente a We Do: predicado, DISABLE/MISSING y TRACE_FEATURE_PIPELINE.
- **Proposed retrospective:**  
  Paridad + anti-leakage + tests = permiso de servir. El error clásico es “online es casi igual”. We Do: tres capas hasta trazar el pipeline.
- **Code/output changes:** none
- **Validation notes:** Output True/False/False alineado a theory T3-A.

---

### S47-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba skew o leakage. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Paridad batch/online sin leakage
- **Proposed preamble:**  
  - **Contexto:** en `CASO-TAC-047-3A`, el path batch y online del ranker de Tacna deben emitir el mismo vector sin leakage y con ≥3 contract tests.  
  - **Meta:** `meets_contract` = batch==online y not leakage y tests≥3.  
  - **Éxito:** `S47-T3-A PASS`.  
  - **Límites:** no “promuevas con fe”; no bajes el umbral de tests.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si batch≠online o leakage (bug).  
  2. Invierte a igualdad de features.  
  3. Añade `not leakage` y `contract_tests >= 3`.  
  4. Conserva print PASS/DISABLE_INCONSISTENT_SERVING.
- **Proposed feedback improvement:**  
  El adverso combina skew y leakage: el serving se deshabilita aunque el laboratorio luzca bien. Online distinto del batch es skew real, no “ruido de float”.
- **Proposed retrospective:**  
  Training-serving skew se corta antes del canary. El error clásico es confiar en F1 de lab. Siguiente (E2): PASS / DISABLE / MISSING:contract_tests.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S47-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; falta missing≠DISABLE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de features (PASS / DISABLE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de features en Tacna separa paridad limpia, skew/leakage y ausencia de contract tests.  
  - **Meta:** PASS / DISABLE_INCONSISTENT_SERVING / MISSING:contract_tests.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** sin contract_tests no evalúes paridad; no inventes tests.
- **Proposed instruction/description improvements:**  
  1. Starter invierte PASS/DISABLE.  
  2. Missing primero.  
  3. Luego predicado completo.  
  4. Imprime resultados.
- **Proposed retrospective:**  
  Missing tests es TRACE en E3; skew es DISABLE de contenido. Un F1 alto no salva online divergente. Luego decides CONTINUE / DISABLE / TRACE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S47-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE/DISABLE/TRACE_FEATURE_PIPELINE. Starter missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide features: CONTINUE o TRACE
- **Proposed preamble:**  
  - **Contexto:** sin contract tests no se sirve “a ciegas”: se traza el pipeline.  
  - **Meta:** CONTINUE / DISABLE_INCONSISTENT_SERVING / TRACE_FEATURE_PIPELINE.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** no inventes tests; no ignores leakage.
- **Proposed instruction/description improvements:**  
  1. Missing → TRACE_FEATURE_PIPELINE.  
  2. Completo: predicado de E1/E2.  
  3. Adverso → DISABLE_INCONSISTENT_SERVING.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  Training-serving skew no se “promueve con fe”. El error clásico es seguir sirviendo mientras “revisan el drift”. Pregunta: ¿qué contract test escribirías primero para el vector de prioridad?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T3-A.

---

### S47-T3-B-DEMO (iDo)
- **Diagnosis:** Demo de p95≤SLO, batch 1–64 y fallback rules-* probado. Falta preamble de “timeout sin salida segura” y retrospective del misconception “fallback none es aceptable en demo”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con features alineadas, el serving aún puede fallar por **latencia y capacidad**. En esta demo p95 120 ms con SLO 180, batch 16 y `rules-v2` ensayado pasa; p95 900 o batch 512 con fallback `none` falla. No escribas: predice `ok`, `slow` y `no_fb`. Si no hay fallback probado, el timeout del ranker de Tacna se convierte en caída silenciosa del producto.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: p95≤slo es presupuesto de experiencia; batch acotado evita sobrecarga; `fallback.startswith("rules-")` y `tested` exigen salida tipada y ensayada. Puente a We Do: predicado, ACTIVATE/MISSING y TUNE_BATCH_OR_CAPACITY.
- **Proposed retrospective:**  
  SLO + batch + fallback ensayado = permiso de tráfico real. El error clásico es “luego medimos p95”. We Do: tres capas hasta tunear capacidad.
- **Code/output changes:** none
- **Validation notes:** Output True/False/False alineado a theory T3-B.

---

### S47-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba p95 alto o fallback no tested. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** p95 bajo SLO y fallback probado
- **Proposed preamble:**  
  - **Contexto:** en `CASO-TAC-047-3B`, el ranker de Tacna solo sirve si p95≤SLO, batch 1–64 y fallback rules-* ensayado.  
  - **Meta:** corregir `meets_contract` con esos cuatro chequeos.  
  - **Éxito:** `S47-T3-B PASS`.  
  - **Límites:** no aceptes fallback `none`; no subas batch “para ir más rápido”.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si p95>slo o not tested (bug).  
  2. Invierte a p95 ≤ slo.  
  3. Añade `1 <= batch_size <= 64` y `fallback.startswith("rules-")` y tested.  
  4. Conserva print PASS/ACTIVATE_SAFE_FALLBACK.
- **Proposed feedback improvement:**  
  El adverso viola latencia, batch y fallback a la vez: ACTIVATE_SAFE_FALLBACK, no “intentar otra vez”. Fallback none nunca es PASS.
- **Proposed retrospective:**  
  Fallback no ensayado es deuda operativa. El error clásico es confiar en el modelo principal sin salida. Siguiente (E2): PASS / ACTIVATE / MISSING:fallback_tested.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S47-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; falta missing≠ACTIVATE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de SLO (PASS / ACTIVATE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de latencia en Tacna separa serving listo, breach de SLO/fallback y ausencia de evidencia de prueba de fallback.  
  - **Meta:** PASS / ACTIVATE_SAFE_FALLBACK / MISSING:fallback_tested.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** sin fallback_tested no evalúes p95; no inventes el booleano.
- **Proposed instruction/description improvements:**  
  1. Starter invierte PASS/ACTIVATE.  
  2. Missing primero.  
  3. Luego predicado completo.  
  4. Imprime resultados.
- **Proposed retrospective:**  
  Missing tested es TUNE en E3; p95 900 con batch 512 es ACTIVATE de contenido. Sin fallback ensayado el timeout no tiene salida. Luego decides CONTINUE / ACTIVATE / TUNE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S47-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE/ACTIVATE/TUNE_BATCH_OR_CAPACITY. Starter missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide SLO: CONTINUE o TUNE
- **Proposed preamble:**  
  - **Contexto:** sin evidencia de prueba de fallback se tunear capacidad, no se abre tráfico.  
  - **Meta:** CONTINUE / ACTIVATE_SAFE_FALLBACK / TUNE_BATCH_OR_CAPACITY.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** no inventes tested; no ignores batch 512.
- **Proposed instruction/description improvements:**  
  1. Missing → TUNE_BATCH_OR_CAPACITY.  
  2. Completo: predicado de E1/E2.  
  3. Adverso → ACTIVATE_SAFE_FALLBACK.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  Fallback none nunca es PASS. El error clásico es “subimos batch y ya”. Pregunta: ¿qué p95 y batch declararías en el README del canary de Tacna?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T3-B.

---

### S47-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de canary ≤10% con quality_delta, error budget y hooks → gates_green vs stop. Falta preamble de “deploy a ciegas” y retrospective del misconception “mode full al 100% es canary ambicioso”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El modelo ya sirve con SLO; ahora el tráfico se abre con cuidado. En esta demo canary al 5% con error 0.4%, quality dentro de presupuesto y hooks activos devuelve `gates_green`; mode `full` al 100% o quality drop fuerte devuelve `stop`. No escribas: predice las tres salidas. Si abres al 100% sin hooks, no es canary: es deploy a ciegas del ranker de Tacna.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: mode ∈ {shadow, canary}, traffic≤10, quality_delta ≥ −max_drop, error≤max y hooks unen presupuesto y observabilidad. `full` no es modo válido. Puente a We Do: predicado, STOP/MISSING y COLLECT_MORE_SHADOW_EVIDENCE.
- **Proposed retrospective:**  
  Canary = presupuesto + calidad + errores + hooks. El error clásico es full rollout “porque el digest es bueno”. We Do: tres capas hasta recolectar shadow.
- **Code/output changes:** none
- **Validation notes:** Output gates_green/stop/stop alineado a theory T4-A. Nota: el fixture E1 usa quality_delta=0.01 (positivo) vs demo −0.01; ambos pasan el predicado — no cambiar outputs.

---

### S47-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba over-traffic o error alto (invertido). Sin title/preamble/retrospective. Hint menciona mode/hooks pero el starter defect no los chequea del todo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Canary ≤10% con hooks activos
- **Proposed preamble:**  
  - **Contexto:** en `CASO-TAC-047-4A`, el equipo abre canary al 5% del tráfico de priorización en Tacna solo si mode, quality, error y hooks están en presupuesto.  
  - **Meta:** `meets_contract` con shadow/canary, traffic≤10, quality y error OK, hooks True.  
  - **Éxito:** `S47-T4-A PASS`.  
  - **Límites:** no uses mode full; no apagues hooks “para ir más rápido”.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si traffic>10 o error>max (bug).  
  2. Exige mode in {shadow, canary}.  
  3. traffic≤10, quality_delta ≥ −max_quality_drop, error≤max, hooks.  
  4. Conserva print PASS/STOP_CANARY.
- **Proposed feedback improvement:**  
  Mode full al 100% es STOP aunque el digest sea válido. Hooks apagados también detienen: sin señales no hay criterio promote/stop.
- **Proposed retrospective:**  
  Canary sin hooks es teatro de despliegue. El error clásico es medir solo error_rate. Siguiente (E2): PASS / STOP / MISSING:hooks.
- **Code/output changes:** none
- **Validation notes:** Solution correcta; fixture E1 quality_delta=0.01 es válido.

---

### S47-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; adverso full/100%/drop/hooks false. Falta missing≠STOP.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de canary (PASS / STOP / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de tráfico en Tacna separa canary sano, over-traffic y ausencia de hooks.  
  - **Meta:** PASS / STOP_CANARY / MISSING:hooks.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** sin hooks no evalúes traffic; no inventes métricas.
- **Proposed instruction/description improvements:**  
  1. Starter invierte PASS/STOP.  
  2. Missing primero.  
  3. Luego predicado completo (mode, traffic, quality, error, hooks).  
  4. Imprime resultados.
- **Proposed retrospective:**  
  Missing hooks es COLLECT en E3; mode full es STOP de contenido. No inventes quality_delta. Luego decides CONTINUE / STOP / COLLECT.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S47-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE/STOP/COLLECT_MORE_SHADOW_EVIDENCE. Starter missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide canary: CONTINUE o COLLECT
- **Proposed preamble:**  
  - **Contexto:** sin hooks se recolecta más evidencia de shadow, no se inventan paneles.  
  - **Meta:** CONTINUE / STOP_CANARY / COLLECT_MORE_SHADOW_EVIDENCE.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** no inventes hooks; no abras al 100%.
- **Proposed instruction/description improvements:**  
  1. Missing → COLLECT_MORE_SHADOW_EVIDENCE.  
  2. Completo: predicado de E1/E2.  
  3. Adverso → STOP_CANARY.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  Sin hooks no inventes métricas: recolecta. El error clásico es “ya medimos a mano en el chat”. Pregunta: ¿qué hook de drift o calidad pedirías antes del promote?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T4-A.

---

### S47-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de rollback a last-good con retirement y audit vs. incompat y no_audit. Falta preamble de “borrar el trace no es cleanup” y retrospective del misconception “rollback sin audit cierra el incidente”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Si el canary falla — o una versión envejeció — CF-4 exige **rollback al last-known-good** con features compatibles y **retirement** auditado. En esta demo `1.2.0` → `1.1.0` con retired `1.0.0` y audit pasa; incompat o sin audit falla. No escribas: predice `ok`, `incompat` y `no_audit`. Borrar el trace para “limpiar el tablero” destruye el gate de auditoría del ranker de Tacna.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: current≠last_good, compatible, tested, retired no vacío y audit son predicados de seguridad; no son checklist cosmético. Puente a We Do: predicado, ROLLBACK/MISSING y REVIEW_RETIREMENT.
- **Proposed retrospective:**  
  Rollback sin audit no cierra CF-4. El error clásico es “ya volvimos a la versión anterior” sin evidencia. We Do: tres capas hasta review de retiro.
- **Code/output changes:** none
- **Validation notes:** Output True/False/False alineado a theory T4-B.

---

### S47-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba si features incompatibles o rollback no tested (invertido). Sin title/preamble/retrospective. Solution también exige `"1.0.0" in retired` — el learner debe ver eso en instruction.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rollback a last-good con audit
- **Proposed preamble:**  
  - **Contexto:** en `CASO-TAC-047-4B`, el equipo restaura de `1.2.0` a `1.1.0` solo si hay features compatibles, rollback ensayado, retiro de `1.0.0` y audit entry.  
  - **Meta:** `meets_contract` con current≠last_good, compatible, tested, retired y audit.  
  - **Éxito:** `S47-T4-B PASS`.  
  - **Límites:** no borres el trace; no marques PASS sin retired.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si not compatible o not tested (bug).  
  2. Exige current ≠ last_good.  
  3. Añade compatible, rollback_tested, `"1.0.0" in retired`, audit_entry.  
  4. Conserva print PASS/ROLLBACK_TO_LAST_GOOD.
- **Proposed feedback improvement:**  
  El adverso rompe compat, tested, retired y audit a la vez. Cualquiera basta para no dar PASS; el verbo de breach en el flujo es ROLLBACK_TO_LAST_GOOD.
- **Proposed retrospective:**  
  Retirement auditado es parte del rollback, no un extra. El error clásico es vaciar retired “para simplificar”. Siguiente (E2): PASS / ROLLBACK / MISSING:audit_entry.
- **Code/output changes:** none
- **Validation notes:** Solution correcta; note que E1 solution usa `"1.0.0" in retired` (más estricto que `bool(retired)` del demo) — preservar.

---

### S47-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; falta missing≠ROLLBACK.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de rollback (PASS / ROLLBACK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de restauración en Tacna separa path seguro, breach de compat/tested y ausencia de audit.  
  - **Meta:** PASS / ROLLBACK_TO_LAST_GOOD / MISSING:audit_entry.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** sin audit_entry no evalúes compatible; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Starter invierte PASS/ROLLBACK.  
  2. Missing primero.  
  3. Luego predicado completo (incl. `"1.0.0" in retired`).  
  4. Imprime resultados.
- **Proposed retrospective:**  
  Missing audit es REVIEW en E3; compatible=False es ROLLBACK de contenido. Compatible=False o untested no es uncertainty. Luego decides CONTINUE / ROLLBACK / REVIEW.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S47-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE/ROLLBACK/REVIEW_RETIREMENT. Starter missing→CONTINUE. Cierre natural hacia youDo CF-4.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide rollback: CONTINUE o REVIEW
- **Proposed preamble:**  
  - **Contexto:** sin audit entry el retiro se revisa con humanos; no se borra el trace ni se da CONTINUE.  
  - **Meta:** CONTINUE / ROLLBACK_TO_LAST_GOOD / REVIEW_RETIREMENT.  
  - **Éxito:** tripleta exacta.  
  - **Límites:** no inventes audit; no limpies el tablero borrando evidencia.
- **Proposed instruction/description improvements:**  
  1. Missing → REVIEW_RETIREMENT.  
  2. Completo: predicado de E1/E2.  
  3. Adverso → ROLLBACK_TO_LAST_GOOD.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  Borrar el trace no es rollback: es pérdida de evidencia. El error clásico es “ya restauramos, borramos el ruido”. Pregunta de cierre CF-4: ¿qué campo del audit defenderías en 30 segundos ante un revisor?
- **Code/output changes:** none
- **Validation notes:** Alineado a callout T4-B y youDo.

---

### youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context de plataforma MLOps en Tacna, objectives alineados a CP-N4-B + CF-4, requirements con normal/breach/uncertain, starter con predicados reales y portfolioNote que advierte no flipar flags. **Falta `retrospective`** de defensa post-build (qué invariante demuestras, PII sintético, impacto medible). Sin ella el learner cierra el capstone sin metacognición de promote reversible.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context ya cumple rol de escena; opcional no duplicar)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/rubric/starter. Opcional en portfolioNote: una línea que enlace explicitamente “missing ≠ breach” y “rollback sin borrar evidencia” al checklist de READY. No reescribir el starter salvo que el Fixer quiera un assert de salida canónica documentada.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante de CF-4 demuestras con un caso normal, un breach (`STOP_CANARY` / `ROLLBACK_TO_LAST_GOOD`) y un incierto (`REVIEW_RETIREMENT`)? (2) ¿qué harías distinto con datos reales vs. sintéticos de Tacna (PII, secretos, servicios externos)? (3) Escribe en el README una frase de impacto medible (antes/después del gate de promote) que puedas defender en 30 segundos sin flipar flags a mano.
- **Code/output changes:** none (starter ya educa; outputs de print son guía, no tests automáticos del curso)
- **Validation notes:** Rubric y requirements cubren el gate; retrospective es el único hueco P1 de youDo.

---

## Priority order

### P0 (Fixer primero — We Do verbal scaffold)
1. **Todos los 24 We Do:** añadir `title`, `preamble` (context/goal/success/constraints), recortar `instruction` a pasos solo-tarea, añadir `retrospective`; reforzar `feedback` donde se propuso.
2. Orden sugerido por dependencias de historia: T1-A → T1-B → T2-A → T2-B → T3-A → T3-B → T4-A → T4-B (E1 luego E2 luego E3 en cada subtema).

### P1
3. **8 I Do:** añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras sin tocar código/output.
4. **youDo:** añadir `retrospective` de defensa post-build (tres preguntas medibles).

### P2
5. Pulir feedback de We Do que ya nombra el verbo pero no ancla impacto al promote/revisor/portfolio (cuando caigan P0).
6. Nota de naming: `id: opensource` / archivo `s47-opensource.ts` vs título MLOps — documentar; no renombrar en esta ronda salvo orchestrator.

---

## Residual risks

- **Prosa plantilla residual:** el código E1/E2/E3 es isomorfo por diseño (patrón de sección Master). El Fixer debe **re-escribir** preambles con el vocabulario de cada subtema (repro, lineage, firma, card, skew, SLO, canary, rollback) y **no** copiar un único bloque con sustitución de verbos.
- **Instruction vs. starter:** si solo se pega preamble y se deja instruction densa, el learner sigue con doble ensayo; instruction debe quedar en pasos 1–4 cortos.
- **Strictness de retired:** E1–E3 de T4-B usan `"1.0.0" in retired` en solution; el demo usa `bool(retired)`. No unificar outputs; sí aclarar en instruction de E1 que se exige el retiro de `1.0.0`.
- **quality_delta de T4-A:** demo usa −0.01; E1 fixture usa +0.01 — ambos PASS. No “corregir” a la misma cifra sin necesidad pedagógica.
- **Naming interno `opensource`:** confunde a revisores de código, no al learner en UI; riesgo de PR confuso si alguien “arregla” el id sin migrar rutas.
- **Carga cognitiva Master:** 24 We Do + 8 demos es denso; preambles cortos en bullets (como el spec) reducen carga mejor que párrafos largos.
- **No tocar:** outputs canónicos, edgeCases, tests strings, solutionCode, fixtures CASO-TAC-047, selfCheck, resources.

---

## Summary for Fixer

| Unidad | Severity | Campos faltantes críticos |
|--------|----------|---------------------------|
| 8× iDo | P1 | preamble, retrospective; why corto |
| 24× weDo | P0 | title, preamble, retrospective; instruction densa; feedback delgado |
| 1× youDo | P1 | retrospective |
| Código/outputs | — | sin cambios requeridos |

**Gold tone references (no copiar contenido):** S26, S30, S33, S50.  
**Anti-aberration:** este reporte se redactó unidad por unidad; el Fixer debe implementar a mano sin generadores.

Section 47 exercise pedagogy review complete. Ready for the Fixer prompt.
