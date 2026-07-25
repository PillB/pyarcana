# S39 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Responsible ML Case Triage y cierre de nivel
- **shortTitle:** Case Triage N3
- **id:** `integrator-phase2`
- **index:** 39
- **source:** `src/lib/course/sections/s39-integrator-phase2.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S39-T1-A pipeline canónico · T1-B registry/owners/semver · T2-A evidence packet · T2-B decisión/override/apelación · T3-A checklist de riesgo/fairness · T3-B modos ops/rollback · T4-A aceptación/regresión/CF-3 · T4-B cards/valor/post mórtem
- **hilo de caso:** **Responsible ML Case Triage** sintético **CASO-LIM-039** (onboarding digital, fintech ficticia en Lima) — intake→ER→grafo→features→score→cola humana; **score ≠ fraude ni parentesco**; `auto_fraud=False`; cierre **CP-N3-C** + smoke regresión **S27–S39** + expediente **CF-3** sin autodeclarar promoción

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction / 25–60 feedback, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~404–648), `weDo.steps[]` (24 ejercicios, ~650–2080) y `youDo` (~2082–2316) en `s39-integrator-phase2.ts`.
- Contrastado con theory T1–T4, learning outcomes, gate ético (`needs_review`, sin autofraude) y contrato de promoción (revisión externa).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S39 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble (escena + qué observar) |
| I Do `why` | Presente; suele ser **1 frase densa** (bajo el rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo `title` de archivos `.py` en starter/solution) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defecto del starter + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera triage N3, **opaco** para newbie sin escena de cola de onboarding en Lima |
| We Do `feedback` | 1 frase; nombra el principio de dominio (bien); poco *por qué importa al revisor HITL / al release / al expediente CF-3* |
| Starter `# DEFECTO` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 con tokens fail-closed; fade real de andamiaje de código |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter e2e **sólidos** y con gates éticos + CF-3 |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N3-C; **no** proponer cambios de output salvo notas puntuales |
| Solape T3-B-E1 ↔ T3-B-E2 | Ambos corrigen prioridad incident/drift en `mode()`; E1 es predicado PASS, E2 es tabla de tres salidas. Fade de código OK; el Fixer debe **diferenciar preambles** (prioridad de incidente vs. tabla operativa completa) |

**Patrón dominante:** el andamiaje de *código* (bugs nombrados, fixtures CASO-LIM-039-*, outputs canónicos, progresión E1 predicado → E2 assess de tres rutas → E3 decide fail-closed con tokens CONTINUE/REJECT/REQUEST, política `auto_fraud=False`, sin autodeclarar promoción) es maduro y alineado al cierre CP-N3-C. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa priorizar la cola sintética sin declarar fraude, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real en todos los subtemas (p. ej. T1-A: orden canónico → assess missing/orden → alcance ER sin parentesco; T2-A: packet mínimo → evidence vacía vs missing → score-only + uncertainty; T4-A: no_auto_fraud_label → regresión/CF-3 → demo paths). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S39-T1-A-DEMO (iDo)
- **Diagnosis:** Demo clara del pipeline intake→queue con `label_space=needs_review` y `auto_fraud=False`. La `description` nombra stages y política; falta `preamble` que diga *qué observar* (orden de fronteras, score no es veredicto) y `retrospective` del misconception “un score alto cierra el caso como fraude”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de ensamblar el workbench del revisor, el equipo de la fintech sintética en Lima fija el **orden de etapas** del triage N3. En esta demo `build_run` arma stages `intake → er → relation_graph → features → model_score → queue` sobre `CASO-LIM-039` con score 0.66. No escribas aún: predice las tres líneas de salida y fíjate en `label_space` y `auto_fraud`. Si reordenas ER después del grafo, o lees el score como culpa, rompes el contrato del nivel.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): cada stage es frontera de contrato; el score solo ordena trabajo humano; `needs_review` evita mapear ranking a veredicto legal o de parentesco. Puente a We Do: reparar la comparación de orden invertido y el fail-closed de alcance de ER.
- **Proposed retrospective:**  
  Si puedes explicar por qué el pipeline termina en cola y no en “fraude detectado”, ya tienes el hábito de fronteras. El error clásico es saltar ER o tratar el score como sanción. En We Do practicarás el predicado de orden y el rechazo de parentesco inventado.
- **Code/output changes:** none
- **Validation notes:** Output `intake > er > … > queue` / `label_space needs_review` / `auto_fraud False` alineado a theory T1-A.

---

### S39-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado sólido: starter compara stages contra el orden invertido. Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback nombra contrato pero no ancla “por qué el revisor de onboarding en Lima depende de fronteras ordenadas”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Orden canónico del pipeline N3
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-039-T1A` la cola de onboarding solo es auditable si las etapas siguen el orden intake→ER→grafo→features→score→queue.  
  - **Meta:** corregir el predicado que hoy compara stages con la lista invertida.  
  - **Éxito:** imprimes `S39-T1-A PASS` con fixture válido (`needs_review`, `auto_fraud False`).  
  - **Límites:** no inviertas el orden a mano; no marques fraude automático; no cambies el fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets` usa `reversed(CANON)` (bug).  
  2. Compara `record["stages"]` con `CANON` en el orden correcto.  
  3. Exige también `label_space == "needs_review"` y `auto_fraud is False`.  
  4. Conserva el print `S39-T1-A` + status.
- **Proposed feedback improvement:**  
  El orden de stages es el contrato del run: si ER va después del grafo, los features mienten. `needs_review` y `auto_fraud False` impiden que el score se lea como veredicto de conducta.
- **Proposed retrospective:**  
  Orden canónico + label de revisión = frontera del triage. El error clásico es invertir la comparación o olvidar `auto_fraud`. Siguiente (E2): separar orden malo de schema incompleto.
- **Code/output changes:** none
- **Validation notes:** DEFECTO bien nombrado; solution y output `S39-T1-A PASS` correctos.

---

### S39-T1-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas (PASS / REJECT_STAGE_ORDER / MISSING:label_space) excelentes para independiente. Instruction ya nombra tokens; falta escena “por qué missing ≠ orden malo en la cola” y cierre metacognitivo de tokens distintos.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Schema incompleto vs orden adverso
- **Proposed preamble:**  
  - **Contexto:** en operaciones de Lima, un registro sin `label_space` no se “arregla” inventando fraude; se reporta como missing.  
  - **Meta:** implementar `assess` que priorice campos faltantes y luego valide orden + política.  
  - **Éxito:** línea exacta `PASS REJECT_STAGE_ORDER MISSING:label_space`.  
  - **Límites:** no evalúes stages si falta clave; no uses un solo token genérico para todo fallo.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: acepta orden invertido como OK (bug).  
  2. Primero calcula `missing` de `case_id`, `stages`, `label_space`, `auto_fraud`.  
  3. Si hay missing, devuelve `MISSING:…`; si no, valida CANON + política.  
  4. Imprime las tres evaluaciones en una línea.
- **Proposed retrospective:**  
  Missing y contenido adverso bloquean la cola con señales distintas para el revisor. Confundirlos retrasa el fix correcto. Luego (E3) el alcance de ER no puede inventar parentesco.
- **Code/output changes:** none
- **Validation notes:** Solution exige también `auto_fraud is False`; instruction lo menciona de paso — el Fixer puede explicitarlo en un paso de instruction.

---

### S39-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico: CONTINUE / REJECT_STAGE_ORDER / REJECT_ER_SCOPE / REQUEST_STAGE_LIST. Starter multi-defecto (siempre CONTINUE, no pide stages, no rechaza parentesco) es excelente. Falta preamble de “ER = misma entidad” y retrospective de reutilización en el youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** ER sin parentesco: fail-closed del pipeline
- **Proposed preamble:**  
  - **Contexto:** en el triage sintético, ER solo decide si dos registros son la **misma entidad**; nunca familia ni culpa.  
  - **Meta:** enrutar cuatro fixtures con tokens exactos de fail-closed.  
  - **Éxito:** `CONTINUE REJECT_STAGE_ORDER REJECT_ER_SCOPE REQUEST_STAGE_LIST`.  
  - **Límites:** no inventes stages ni evidencia; incertidumbre (missing) ≠ breach de parentesco.
- **Proposed instruction/description improvements:**  
  1. Si falta `stages` → `REQUEST_STAGE_LIST`.  
  2. Si `er_claims_parentesco` → `REJECT_ER_SCOPE`.  
  3. Si orden o política incorrectos → `REJECT_STAGE_ORDER`.  
  4. Si no, `CONTINUE`. Imprime los cuatro resultados.
- **Proposed retrospective:**  
  Fail-closed protege al revisor: pide lo que falta y rechaza lo que inventa parentesco. El error clásico es `CONTINUE` silencioso. En el You Do el mismo principio vive en el packet y el audit.
- **Code/output changes:** none
- **Validation notes:** Asserts de solution alineados al output canónico.

---

### S39-T1-B-DEMO (iDo)
- **Diagnosis:** Demo de registry con owners y semver (`major_on_breaking`). Description y why presentes pero cortos; sin escena de on-call ni misconception “patch basta para breaking”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Sin dueño contactable no hay on-call del triage; sin semver no hay regresión confiable. Esta demo arma un registry mínimo (`er_engine`, `ranker`) con owners distintos y un flag `breaking` que fuerza política major. Observa el conteo de owners, el print de `semver_policy` y `owner_required`. No escribas: predice si un artefacto sin owner pasaría `registry_ok`.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: ownership y bump major en breaking evitan packets de cola con paths de grafo obsoletos. Puente a We Do: predicado de bump, assess de tres rutas y registry de cuatro artefactos.
- **Proposed retrospective:**  
  Owner + semver = contrato de evolución. Confundir patch con major rompe la cola. En We Do practicarás major ante breaking y escalamiento si falta owner.
- **Code/output changes:** none
- **Validation notes:** Output `2` / `semver_policy major_on_breaking` / `owner_required True` correcto.

---

### S39-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter exige `minor` ante breaking (defecto pedagógico claro). Instruction densa; sin title/preamble/retrospective. Feedback correcto pero seco.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Breaking change exige bump major
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-039-T1B` el `graph_schema` rompe paths ya guardados en packets; el bump debe ser major.  
  - **Meta:** corregir el predicado que hoy exige `minor` ante `breaking=True`.  
  - **Éxito:** `S39-T1-B PASS` con owner presente y bump major.  
  - **Límites:** no borres el fixture; no aceptes owner vacío.
- **Proposed instruction/description improvements:**  
  1. Localiza el DEFECTO: `bump == "minor"`.  
  2. Cambia a `bump == "major"` cuando `breaking` es True.  
  3. Mantén `bool(record["owner"])`.  
  4. Imprime `S39-T1-B` + status.
- **Proposed feedback improvement:**  
  Semver major comunica breaking al equipo de investigations y a la regresión S27–S39. Un minor silencioso deja packets huérfanos en cola.
- **Proposed retrospective:**  
  Breaking → major + owner. El error clásico es “es solo un campo del grafo”. Siguiente: tres rutas de registry (política vs missing).
- **Code/output changes:** none
- **Validation notes:** Output `S39-T1-B PASS` OK.

---

### S39-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas PASS / REJECT_BUMP_POLICY / MISSING:owner; starter acepta minor ante breaking. Falta escena de “falta de owner no es lo mismo que bump malo”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Owner faltante vs política de bump
- **Proposed preamble:**  
  - **Contexto:** el ranker de `ml-risk` no puede ir a producción sin owner ni con bump incorrecto ante breaking.  
  - **Meta:** `assess` con missing-antes-de-contenido y rechazo de política.  
  - **Éxito:** `PASS REJECT_BUMP_POLICY MISSING:owner`.  
  - **Límites:** no mires bump si falta owner; no inventes owner por defecto.
- **Proposed instruction/description improvements:**  
  1. Calcula missing de claves requeridas.  
  2. Si `breaking` y `bump != "major"` → `REJECT_BUMP_POLICY`.  
  3. Owner vacío o ausente → missing/escalamiento según schema.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Owner y bump son chequeos independientes: uno es gente, el otro es contrato. Confundirlos retrasa el release. Luego: un registry de cuatro artefactos como conjunto.
- **Code/output changes:** none
- **Validation notes:** Solution también trata `not record["owner"]` después de keys — coherente con incomplete sin clave owner.

---

### S39-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de conjunto: un solo artefacto sin owner escala todo el registry; off-by-one en `len(registry)-1`. Excelente multi-ruta. Falta preamble de “registry = conjunto” y retrospective CF-3.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Registry completo o escala
- **Proposed preamble:**  
  - **Contexto:** el triage de Lima no se libera “por partes”: basta un artefacto sin owner para escalar.  
  - **Meta:** `decide` sobre registry happy, sin owner en ranker y breaking con minor en graph_schema.  
  - **Éxito:** `CONTINUE 4 ESCALATE_NO_OWNER REJECT_BUMP_POLICY`.  
  - **Límites:** corrige el off-by-one; no ignores owners vacíos.
- **Proposed instruction/description improvements:**  
  1. Recorre todos los artefactos en `decide`.  
  2. Sin owner → `ESCALATE_NO_OWNER`; breaking sin major → `REJECT_BUMP_POLICY`.  
  3. Imprime `CONTINUE`, `len(registry)` (=4), y las dos rutas adversas.  
  4. No uses `len - 1`.
- **Proposed retrospective:**  
  El registry es un conjunto: un hueco bloquea el release del triage. El off-by-one miente sobre cobertura. En CF-3 el revisor externo mira owners y versiones, no solo el happy path.
- **Code/output changes:** none
- **Validation notes:** Starter imprime `len(registry)-1` a propósito; solution usa `n_art = len(registry)`.

---

### S39-T2-A-DEMO (iDo)
- **Diagnosis:** Demo rica: claves mínimas, layers, score_alone_ok=False, bucket y carga de cola. Description densa; sin preamble de “qué mirar en el workbench del revisor” ni retrospective “score ≠ workbench”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El revisor de onboarding no puede trabajar con un número suelto. Esta demo ordena las claves del packet (`case_id`, `evidence`, `graph_path`, `score`), cuenta capas, marca que score solo no basta, calcula bucket con umbrales 0.75/0.40 y carga de cola frente a capacidad 3. Observa `score_alone_ok False` y `within_capacity True`. No escribas: predice bucket para score 0.81.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: umbral calibrado (S34) ordena capacidad; path y evidencia citables son el workbench. Puente a We Do: packet mínimo, evidence vacía vs missing, score-only + uncertainty.
- **Proposed retrospective:**  
  Packet = hechos + path + score (+ incertidumbre). El error clásico es encolar solo con 0.99. En We Do repararás el predicado “score > 0” y el fail-closed de gaps.
- **Code/output changes:** none
- **Validation notes:** Output de keys/layers/bucket/load alineado a theory T2-A.

---

### S39-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter solo mira `score > 0` (defecto score-alone clásico). Instruction correcta pero densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Packet mínimo con path y evidencia
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-039-T2A` el revisor necesita path `E1 → ph:900 → E2` y evidencia de teléfono sintético, no solo 0.81.  
  - **Meta:** exigir case_id, score, evidence y graph_path no vacíos.  
  - **Éxito:** `S39-T2-A PASS`.  
  - **Límites:** no aceptes score solo; no inventes path si faltara.
- **Proposed instruction/description improvements:**  
  1. Reemplaza `score > 0` por chequeos de las cuatro claves.  
  2. Verifica listas `evidence` y `graph_path` con longitud > 0.  
  3. Status PASS o REJECT_PACKET_INCOMPLETE.  
  4. Conserva el print del subtema.
- **Proposed feedback improvement:**  
  Sin path ni evidencia el caso no es “listo para cola”: es un score huérfano. El packet mínimo es el workbench mínimo.
- **Proposed retrospective:**  
  Cuatro piezas mínimas del packet. El error clásico es confiar en un score alto. Siguiente: distinguir lista vacía de clave ausente.
- **Code/output changes:** none
- **Validation notes:** Output `S39-T2-A PASS` OK.

---

### S39-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tres packets: completo, evidence=[], sin graph_path. Starter siempre PASS si hay claves. Excelente distinción missing vs incomplete; falta escena revisor.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Evidence vacía vs path ausente
- **Proposed preamble:**  
  - **Contexto:** en la cola de Lima, evidence vacía y path omitido se diagnostican distinto: uno es contenido inválido, el otro es schema incompleto.  
  - **Meta:** tokens `PASS`, `REJECT_PACKET_INCOMPLETE`, `MISSING:graph_path`.  
  - **Éxito:** esa línea exacta de tres tokens.  
  - **Límites:** score 0.99 sin path nunca es PASS.
- **Proposed instruction/description improvements:**  
  1. Primero missing de claves requeridas.  
  2. Luego rechaza listas vacías de evidence o graph_path.  
  3. Imprime las tres evaluaciones.  
  4. No hardcodees tokens sin evaluar fixtures.
- **Proposed retrospective:**  
  Missing pide datos; incomplete rechaza basura. El revisor gana tiempo si el token es honesto. Luego: uncertainty y capas de explicación.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S39-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a workbench: CONTINUE 4 / REJECT_SCORE_ALONE / REQUEST_UNCERTAINTY. Starter siempre CONTINUE con layers=1. Falta preamble de capas S35 y retrospective de “no enmascarar gaps”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Capas de explicación o rechazo
- **Proposed preamble:**  
  - **Contexto:** la explicación usable (S35) solo tiene sentido con packet completo e incertidumbre declarada.  
  - **Meta:** devolver status + layers (4 solo si OK).  
  - **Éxito:** `CONTINUE 4 REJECT_SCORE_ALONE REQUEST_UNCERTAINTY`.  
  - **Límites:** no inventes `in_distribution` ni path en el adverso score-only.
- **Proposed instruction/description improvements:**  
  1. Score-only (solo case_id+score) → REJECT_SCORE_ALONE.  
  2. Sin `uncertainty` → REQUEST_UNCERTAINTY.  
  3. Packet OK → CONTINUE, layers 4.  
  4. Imprime unpack del happy y los status de adversarios.
- **Proposed retrospective:**  
  Capas sin evidencia son teatro. El error clásico es CONTINUE con layers=1. En el You Do el packet y las cards deben contar la misma historia.
- **Code/output changes:** none
- **Validation notes:** Lógica de solution con set de keys y uncertainty bien alineada.

---

### S39-T2-B-DEMO (iDo)
- **Diagnosis:** Override humano a skip con audit y conteo de overrides. Why corto; sin escena “el auto sugiere, el humano manda”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El modelo prioriza; el revisor decide. En esta demo score 0.9 haría queue automático, pero el humano elige `skip` y el log marca override con audit. Observa la acción final, `n_overrides` y que todos los overrides tienen `audit True`. No escribas: predice qué pasa si `human=None`.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: override sin audit no es control humano verificable; el score no ordena al revisor. Puente a We Do: precedencia humana, apelación con segundo revisor, audit de feedback.
- **Proposed retrospective:**  
  Humano gana al auto y deja rastro. El error clásico es override silencioso. En We Do practicarás precedencia, apelación y fail-closed de audit.
- **Code/output changes:** none
- **Validation notes:** Output `skip` / `n_overrides 1` / `audit True` OK.

---

### S39-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter ignora `human_action` y deja override=False. Defecto perfecto para guided. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Override humano gana al auto
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-039-T2B` el auto pondría queue (0.9 ≥ 0.7); el revisor de Lima hace skip por evidencia insuficiente.  
  - **Meta:** que final=human_action y override=True cuando hay humano.  
  - **Éxito:** `S39-T2-B PASS`.  
  - **Límites:** no borres el score; no ignores human_action.
- **Proposed instruction/description improvements:**  
  1. Calcula auto por umbral.  
  2. Si `human_action` no es None, final = human_action y override True.  
  3. Verifica final skip + override True.  
  4. Imprime status del subtema.
- **Proposed feedback improvement:**  
  El score solo sugiere prioridad. Si el humano no puede ganar al auto, el HITL es cosmético y el audit miente.
- **Proposed retrospective:**  
  Precedencia humana es el núcleo del triage responsable. Siguiente: apelación exige segundo revisor.
- **Code/output changes:** none
- **Validation notes:** Output `S39-T2-B PASS` OK.

---

### S39-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tres decisiones: auto queue, override skip, appeal sin second_reviewer. Starter reabre sin segundo par de ojos. Falta escena de apelación en fintech peruana sintética.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Apelación con segundo revisor
- **Proposed preamble:**  
  - **Contexto:** si el cliente apela, el caso reabre con **otro** revisor; no con el mismo criterio silencioso.  
  - **Meta:** devolver `queue`, `skip` o `MISSING:second_reviewer` según el fixture.  
  - **Éxito:** línea `queue skip MISSING:second_reviewer`.  
  - **Límites:** appeal sin second_reviewer no cierra; override solo con human_action.
- **Proposed instruction/description improvements:**  
  1. Si appeal y no hay second_reviewer → MISSING.  
  2. Si hay human_action → devuélvelo.  
  3. Si no, auto por umbral.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Apelación = segundo par de ojos documentado. El error clásico es “reopen” sin control. Luego: audit de feedback sin leakage.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; instruction dice “resultados de acción/estado” de forma un poco confusa — Fixer puede simplificar a “imprime las tres salidas de assess”.

---

### S39-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a audit de feedback: LOGGED / REJECT_NO_AUDIT / REQUEST_FEEDBACK_ID. Starter siempre LOGGED. Excelente política leakage_care; falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Feedback solo con audit completo
- **Proposed preamble:**  
  - **Contexto:** el feedback del revisor puede mejorar reglas o datasets, pero sin audit ni id se reinyecta basura o se pierde la cadena de custodia.  
  - **Meta:** fail-closed en tres eventos de log.  
  - **Éxito:** `LOGGED True REJECT_NO_AUDIT REQUEST_FEEDBACK_ID`.  
  - **Límites:** sin audit_entry no hay override válido; feedback sin id no se loguea; cuida leakage temporal.
- **Proposed instruction/description improvements:**  
  1. Override sin audit_entry → REJECT_NO_AUDIT.  
  2. Feedback sin feedback_id → REQUEST_FEEDBACK_ID.  
  3. Happy con leakage_care → LOGGED True.  
  4. Imprime unpack del happy + tokens adversarios.
- **Proposed retrospective:**  
  Audit y feedback_id hacen al feedback reutilizable sin leakage. El error clásico es “LOGGED siempre”. En el You Do el audit.jsonl es la prueba del HITL.
- **Code/output changes:** none
- **Validation notes:** Solution también rechaza feedback sin leakage_care (ruta no ejercitada en prints del fixture) — opcional documentar en edgeCases; no cambiar output.

---

### S39-T3-A-DEMO (iDo)
- **Diagnosis:** Checklist de release con secrets y auto_fraud en false. Why una frase; sin escena de release gate de plataforma en Lima.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Liberar el triage no es “el modelo midió bien”: es un checklist firmable. Esta demo exige sin secretos en repo, sin autofraude, con RBAC y PII minimizada. Observa que `risk_release_ok` es True solo con el paquete limpio. No escribas: predice el resultado si `secrets_in_repo` fuera True.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: blockers duros (secretos, autofraude) vs. controles positivos (rbac, minimización). Puente a We Do: negar secrets, separar missing/reject, fairness por slice.
- **Proposed retrospective:**  
  Release del triage es política, no solo métrica. El error clásico es tratar secrets como “detalle de DevOps”. En We Do practicarás el predicado y el fairness operativo.
- **Code/output changes:** none
- **Validation notes:** Output `True` / flags False OK.

---

### S39-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter usa `secrets_in_repo` sin negar (con fixture limpio False, el bug no se ve en PASS — **nota pedagógica importante**). Con checklist limpio, `all([... secrets_in_repo ...])` con False hace meets=False, así que el starter **falla** y el learner corrige a `not secrets`. Bien. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Secretos bloquean el release
- **Proposed preamble:**  
  - **Contexto:** en el release de `CASO-LIM-039-T3A`, un secreto en el repo es blocker duro aunque el resto del checklist esté verde.  
  - **Meta:** `release_ok` con `not secrets_in_repo` y demás flags True.  
  - **Éxito:** `S39-T3-A PASS` en el fixture limpio.  
  - **Límites:** no borres campos; no trates True de secrets como “OK”.
- **Proposed instruction/description improvements:**  
  1. Abre el DEFECTO: incluye `checklist["secrets_in_repo"]` en el `all` sin negar.  
  2. Usa `not checklist["secrets_in_repo"]`.  
  3. Mantén pii, rbac, slice_metrics, input_limits.  
  4. Imprime status del subtema.
- **Proposed feedback improvement:**  
  Secretos en repo invalidan el expediente de seguridad del triage. No se “compensan” con un buen AUC ni con RBAC verde.
- **Proposed retrospective:**  
  `not secrets` es el hábito de release. Siguiente: distinguir secrets activos de controles ausentes.
- **Code/output changes:** none
- **Validation notes:** Starter con secrets=False hace que el bug se manifieste como FAIL (meets False) — pedagogically OK.

---

### S39-T3-A-E2 (weDo, independent)
- **Diagnosis:** PASS / REJECT_SECRETS / MISSING:rbac. Starter no bloquea secrets. Excelente separación missing vs breach.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Missing de control vs secrets activos
- **Proposed preamble:**  
  - **Contexto:** falta de RBAC y secrets en repo no se arreglan igual: uno pide el control, el otro rechaza la violación.  
  - **Meta:** tres tokens exactos en una línea.  
  - **Éxito:** `PASS REJECT_SECRETS MISSING:rbac`.  
  - **Límites:** no confundes missing con reject genérico.
- **Proposed instruction/description improvements:**  
  1. Missing de claves requeridas primero.  
  2. Si secrets_in_repo True → REJECT_SECRETS.  
  3. Si no, valida resto y PASS/REJECT_RELEASE.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Tokens distintos aceleran la remediación. Luego: fairness de cola por slice, no culpa grupal.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S39-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Fairness operativa con fp_rate por slice sintético de canal. Starter devuelve auc. Excelente anti-misconception “fairness = etiquetar grupos”. Falta preamble ético fuerte.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fairness de cola por slice, no culpa
- **Proposed preamble:**  
  - **Contexto:** en el batch sintético, un `fp_rate` alto en `canal_app` significa **demasiado daño de revisión** en ese canal, no “ese canal es culpable”.  
  - **Meta:** CONTINUE con métrica `fp_rate`, o REQUEST/REJECT según slices.  
  - **Éxito:** `CONTINUE fp_rate REQUEST_SLICE_METRICS REJECT_SLICE_FP`.  
  - **Límites:** no uses el score para afirmar fraude en un slice; no inventes slices.
- **Proposed instruction/description improvements:**  
  1. Slices vacíos o ausentes → REQUEST_SLICE_METRICS.  
  2. Si algún fp_rate > umbral → REJECT_SLICE_FP.  
  3. Si no → CONTINUE, métrica `fp_rate` (no auc).  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Fairness operativa protege a usuarios de revisión injusta por canal. El error clásico es mirar solo AUC global. En cards del You Do documentas slices sintéticos sin PII real.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S39-T3-B-DEMO (iDo)
- **Diagnosis:** human_only ante incidente, rollback a prev_model, prioridad incident sobre drift. Why corto; sin escena de incidente en producción.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Ante incidente, el throughput no manda: se corta automatización. Esta demo devuelve `human_only`, apunta rollback a `prev_model` y demuestra que incident gana aunque drift también esté alto. Observa las tres líneas. No escribas: predice el modo si solo hubiera drift.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: fail-closed a humano + artefacto versionado previo. Puente a We Do: prioridad de modo, tabla de tres escenarios, rollback vs monitor.
- **Proposed retrospective:**  
  Incident → human_only; drift → más abstención. Confundirlos deja el sistema en “casi normal” cuando ya hay fuego. En We Do codificarás la tabla y el rollback.
- **Code/output changes:** none
- **Validation notes:** Output `human_only` / `rollback prev_model` / `priority incident_over_drift` OK.

---

### S39-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter prioriza drift sobre incident. Fixture con ambos True exige human_only. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Incidente manda sobre drift
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-039-T3B` hay incidente y drift a la vez; el modo seguro es human_only, no “abstener un poco más”.  
  - **Meta:** corregir la prioridad de `mode(drift_high, incident)`.  
  - **Éxito:** `S39-T3-B PASS`.  
  - **Límites:** no devuelvas abstain_more si incident es True.
- **Proposed instruction/description improvements:**  
  1. Primero `if incident: return "human_only"`.  
  2. Luego drift → abstain_more.  
  3. Si no, normal.  
  4. Imprime status del assert del fixture.
- **Proposed feedback improvement:**  
  human_only es fail-closed de incidente: el revisor manda y el modelo deja de auto-saltar casos. El throughput espera.
- **Proposed retrospective:**  
  Orden de ifs = política de seguridad. Siguiente: tabla completa normal/drift/incident.
- **Code/output changes:** none
- **Validation notes:** Output `S39-T3-B PASS` OK.

---

### S39-T3-B-E2 (weDo, independent)
- **Diagnosis:** Misma función `mode` que E1 pero con tres prints y ramas invertidas (drift→human_only, incident→abstain). Solape de bug con E1; el Fixer debe diferenciar preambles. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tabla de modos ops del triage
- **Proposed preamble:**  
  - **Contexto:** el runbook de ops de la fintech sintética necesita la tabla completa, no solo el caso de incidente.  
  - **Meta:** (F,F)→normal, (T,F)→abstain_more, (F,T)→human_only.  
  - **Éxito:** `normal abstain_more human_only`.  
  - **Límites:** no inventes labels de fraude al subir abstención; no intercambies ramas.
- **Proposed instruction/description improvements:**  
  1. Corrige las ramas invertidas del starter.  
  2. Prioriza incident sobre drift.  
  3. Imprime las tres combinaciones del enunciado.  
  4. No hardcodees la línea sin llamar a `mode`.
- **Proposed retrospective:**  
  Drift reduce automatización; incident la corta. El error clásico es invertir los modos. Luego: rollback versionado vs monitor de drift.
- **Code/output changes:** none
- **Validation notes:** Contenido solapa E1; preambles deben enfatizar tabla vs. prioridad única.

---

### S39-T3-B-E3 (weDo, transfer)
- **Diagnosis:** ROLLBACK previous_model / REQUEST_PREV_MODEL / MONITOR abstain_more. Starter siempre STAY. Excelente separación rollback vs abstención. Falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rollback versionado o monitor de drift
- **Proposed preamble:**  
  - **Contexto:** rollback no es “reiniciar la laptop”: apunta a `prev_model_id` versionado. Drift sin incidente no revierte el modelo a ciegas.  
  - **Meta:** tres respuestas ops exactas.  
  - **Éxito:** `ROLLBACK previous_model REQUEST_PREV_MODEL MONITOR abstain_more`.  
  - **Límites:** sin prev no inventes id; no mezcles STAY con human_only.
- **Proposed instruction/description improvements:**  
  1. Incident con prev → ROLLBACK + id.  
  2. Incident sin prev → REQUEST_PREV_MODEL.  
  3. Solo drift → MONITOR abstain_more.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Rollback y abstención son controles distintos. El error clásico es quedarse en current_model en pleno incidente. En el You Do `force_failure` empuja a human_only con audit.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S39-T4-A-DEMO (iDo)
- **Diagnosis:** Seis criterios de aceptación, scope S27–S39, CF-3 external, self_declared_promotion False. Why corto; sin escena de “tú dejas expediente, no te promocionas”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Cerrar el nivel no es imprimir OK en un script. Esta demo cuenta seis criterios de aceptación, fija regresión `S27-S39`, revisión CF-3 externa y prohíbe autodeclarar promoción. Observa las cuatro líneas de salida. No escribas: predice qué diría un revisor si `self_declared_promotion` fuera True.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: aceptación medible + regresión documentada; la promoción la confirma un evaluador externo. Puente a We Do: no_auto_fraud_label, notas de gate, demo paths.
- **Proposed retrospective:**  
  Expediente listo ≠ nivel cerrado. El error clásico es auto-PASS de promoción. En We Do practicarás los predicados del gate.
- **Code/output changes:** none
- **Validation notes:** Output `6` / `regression S27-S39` / `cf3_review external` / `self_declared_promotion False` OK.

---

### S39-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter busca clave `auto_fraud_ok` en vez de `no_auto_fraud_label`. Defecto claro. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Aceptación sin auto-label de fraude
- **Proposed preamble:**  
  - **Contexto:** el checklist de `CASO-LIM-039-T4A` debe incluir el string exacto `no_auto_fraud_label`: el score no etiqueta fraude.  
  - **Meta:** membership correcto en la lista de aceptación.  
  - **Éxito:** `S39-T4-A PASS`.  
  - **Límites:** no inventes alias `auto_fraud_ok`; no reescribas la lista.
- **Proposed instruction/description improvements:**  
  1. Reemplaza `"auto_fraud_ok" in acceptance` por `"no_auto_fraud_label"`.  
  2. Exige también e2e_synthetic_run y audit_log.  
  3. Imprime status del subtema.  
  4. No hardcodees PASS sin membership.
- **Proposed feedback improvement:**  
  Sin la prohibición explícita de auto-label, el e2e puede “pasar” y aun así declarar fraude. El string del criterio es el contrato del producto.
- **Proposed retrospective:**  
  Aceptación = criterios citables, no vibes. Siguiente: regresión y CF-3 sin autodeclarar promoción.
- **Code/output changes:** none
- **Validation notes:** Output `S39-T4-A PASS` OK.

---

### S39-T4-A-E2 (weDo, independent)
- **Diagnosis:** PASS / REJECT_AUTO_PASS / MISSING:regression_scope. Starter siempre PASS si hay claves. Corazón del cierre de nivel. Falta preamble de revisor externo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** CF-3 externo, sin auto-promoción
- **Proposed preamble:**  
  - **Contexto:** documentas smoke S27–S39 y CF-3; un revisor externo confirma. Autodeclarar promoción es rechazo de política.  
  - **Meta:** assess de gate_notes con tres rutas.  
  - **Éxito:** `PASS REJECT_AUTO_PASS MISSING:regression_scope`.  
  - **Límites:** self_declared_promotion True nunca es PASS; scope debe ser exacto `S27-S39`.
- **Proposed instruction/description improvements:**  
  1. Missing de claves primero.  
  2. Si self_declared_promotion True → REJECT_AUTO_PASS.  
  3. Valida scope y cf3_review external.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Tú dejas evidencia; otro cierra el nivel. El error clásico es `promotion=True` en el manifest. En el You Do el manifest ya trae `self_declared_promotion: false`.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S39-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Demo paths happy+override+ood_abstain. Starter acepta cualquier lista. Excelente anti-happy-only. Falta preamble de “demo de triage no es demo de marketing”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Demo e2e: happy, override y abstención
- **Proposed preamble:**  
  - **Contexto:** la demo de aceptación del triage debe mostrar override humano y abstención OOD, no solo el caso feliz.  
  - **Meta:** conjunto canónico de tres paths.  
  - **Éxito:** `CONTINUE 3 REJECT_HAPPY_ONLY REQUEST_DEMO_PATH`.  
  - **Límites:** usa el token `ood_abstain` (no un alias vago); no inventes paths.
- **Proposed instruction/description improvements:**  
  1. Conjunto vacío o incompleto (sin ood_abstain) → REQUEST_DEMO_PATH.  
  2. Solo happy → REJECT_HAPPY_ONLY.  
  3. Happy+override+ood_abstain → CONTINUE 3.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  La demo demuestra control humano y abstención, no solo que el score “funciona”. En el You Do los tres demo_cases del starter son ese contrato.
- **Code/output changes:** none
- **Validation notes:** Solution usa `CANON.issubset`; partial sin ood_abstain pide REQUEST — correcto.

---

### S39-T4-B-DEMO (iDo)
- **Diagnosis:** Métricas de valor, tres cards, post mórtem blameless. Why una frase; sin escena de cierre de nivel para negocio.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El negocio no lee solo AUC: lee overrides, tiempo de review y si el post mórtem es blameless. Esta demo lista claves de valor, ordena cards model/data/system y valida un post mórtem con root_cause y actions. Observa las tres líneas. No escribas: predice si un post mórtem con blameless=False pasaría.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: cierre de nivel con valor operativo + cards + aprendizaje sin cacería de brujas. Puente a We Do: set de cards, métricas de valor, tokens de post mórtem.
- **Proposed retrospective:**  
  Cards y valor operativo cierran el producto; el post mórtem cierra el incidente. El error clásico es publicar solo AUC. En We Do codificarás cada predicado.
- **Code/output changes:** none
- **Validation notes:** Output de keys/cards/postmortem True OK.

---

### S39-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter exige card `ops` extra. Defecto claro de “ni de más ni de menos”. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres cards: model, data, system
- **Proposed preamble:**  
  - **Contexto:** el paquete mínimo de cierre de `CASO-LIM-039-T4B` son model, data y system cards — límites y ownership publicados.  
  - **Meta:** igualdad de sets con esas tres.  
  - **Éxito:** `S39-T4-B PASS`.  
  - **Límites:** no exijas `ops`; no omitas `system`.
- **Proposed instruction/description improvements:**  
  1. Corrige el set que incluye `"ops"`.  
  2. `set(cards) == {"model", "data", "system"}`.  
  3. Imprime status.  
  4. No rellenes una cuarta card para “compensar”.
- **Proposed feedback improvement:**  
  Las tres cards son el mínimo legible para un revisor externo de CF-3. Una card inventada no sustituye system.
- **Proposed retrospective:**  
  model/data/system = paquete de límites. Siguiente: métricas de valor que negocio sí lee.
- **Code/output changes:** none
- **Validation notes:** Output `S39-T4-B PASS` OK.

---

### S39-T4-B-E2 (weDo, independent)
- **Diagnosis:** PASS / REJECT_VALUE_METRICS / MISSING:value. Starter acepta auc solo. Excelente anti-AUC-only. Falta preamble de valor operativo de cola.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Valor operativo, no solo AUC
- **Proposed preamble:**  
  - **Contexto:** en la cola de onboarding, override_rate y tiempo de review cuentan más para el cierre que un AUC offline suelto.  
  - **Meta:** exigir clave `value` con al menos `override_rate`.  
  - **Éxito:** `PASS REJECT_VALUE_METRICS MISSING:value`.  
  - **Límites:** auc solo → REJECT; sin dict value → MISSING.
- **Proposed instruction/description improvements:**  
  1. Si falta clave value → MISSING:value.  
  2. Si no hay override_rate → REJECT_VALUE_METRICS.  
  3. Si no → PASS.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Valor = cómo opera la cola, no solo ranking offline. El error clásico es enorgullecerse del AUC. Luego: post mórtem blameless con root_cause y actions.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S39-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Cuatro rutas de post mórtem: CONTINUE / REJECT_BLAMEFUL / REQUEST_ROOT_CAUSE / REQUEST_ACTIONS. Starter siempre CONTINUE. Excelente cierre metacognitivo de sección. Falta preamble y retrospective fuertes.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Post mórtem blameless con acciones
- **Proposed preamble:**  
  - **Contexto:** el aprendizaje del incidente del triage es de sistemas y procesos, no de cacería de brujas.  
  - **Meta:** validar blameless, root_cause no vacío y actions no vacía.  
  - **Éxito:** `CONTINUE True REJECT_BLAMEFUL REQUEST_ROOT_CAUSE REQUEST_ACTIONS`.  
  - **Límites:** no uses nombres de personas como root_cause; no dejes actions=[].
- **Proposed instruction/description improvements:**  
  1. blameless no True → REJECT_BLAMEFUL.  
  2. root_cause vacío → REQUEST_ROOT_CAUSE.  
  3. actions vacía → REQUEST_ACTIONS.  
  4. Happy → CONTINUE True. Imprime las cuatro rutas.
- **Proposed retrospective:**  
  Post mórtem cierra el ciclo: causa + acciones + sin culpa personal. El error clásico es CONTINUE con lista vacía. En el You Do documenta un post mórtem sintético alineado a este contrato.
- **Code/output changes:** none
- **Validation notes:** Cuatro fixtures; output canónico OK.

---

### S39-YOUDO (youDo)
- **Diagnosis:** Marco de proyecto **excelente**: context, objectives, requirements, rubric, portfolioNote y starter e2e con tres demo paths, audit, cards, manifest CF-3 y force_failure→human_only. Falta **solo** `retrospective` de defensa metacognitiva post-build (spec You Do). Sin ella, el learner no tiene checklist de “antes de marcar listo” ni puente a revisión externa.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Responsible ML Case Triage (cierre CP-N3-C) + notas regresión N3/CF-3 — mantener
- **Proposed preamble:** N/A (You Do usa `context`; no requiere preamble de We Do). Opcional: el Fixer no debe duplicar context en un campo preamble si el schema no lo soporta.
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements. Asegurar que el learner vea en UI la defensa post-build (retrospective). Sin reescribir el starter salvo bugs de ejecución (ninguno requerido para pedagogía verbal).
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con el audit (override, ood_abstain o human_only) y un digest del bundle? (2) ¿dónde queda escrito `auto_fraud=False` y `self_declared_promotion=false` para un revisor externo de CF-3? (3) Escribe en el README una frase de impacto medible (p. ej. paths de demo + tasa de override sintética) defendible en 30 segundos. No autodeclares la promoción de nivel.
- **Code/output changes:** none
- **Validation notes:** Starter alineado a theory y a T4-A-E3 (tres paths); rubric ya cubre gates éticos y CF-3.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback + why polish)
1. **S39-T1-A-E1, E2, E3** — pipeline orden / missing / alcance ER  
2. **S39-T1-B-E1, E2, E3** — semver, owner, registry conjunto  
3. **S39-T2-A-E1, E2, E3** — packet mínimo / incomplete vs missing / capas  
4. **S39-T2-B-E1, E2, E3** — override / apelación / audit feedback  
5. **S39-T3-A-E1, E2, E3** — secrets / missing vs reject / fairness slice  
6. **S39-T3-B-E1, E2, E3** — modos ops (diferenciar preambles E1↔E2) / rollback  
7. **S39-T4-A-E1, E2, E3** — aceptación / CF-3 / demo paths  
8. **S39-T4-B-E1, E2, E3** — cards / valor / post mórtem  

### P1
- **Todas las 8 iDo demos:** añadir `preamble` + `retrospective`; ampliar `why` a 40–90 palabras.  
- **You Do:** añadir `retrospective` de defensa (gate CP-N3-C + CF-3 + no autodeclarar).  

### P2
- Feedback We Do: 25–60 palabras con ancla a cola HITL / release / expediente.  
- Hints E3: revisar que no spoileen la fórmula completa cuando el starter ya nombra el defecto (hoy aceptable para transfer).  
- Instruction T2-B-E2: acortar redacción “acción/estado” → “tres salidas de assess”.  

---

## Residual risks
- **Densidad de la sección:** S39 integra S27–S38; sin preambles el newbie se ahoga en tokens. El Fixer debe priorizar escena de cola de onboarding en Lima y el mantra *score ≠ fraude*.  
- **Solape T3-B-E1/E2:** mismo bug de prioridad; preambles e instrucciones deben enfatizar *prioridad única* vs *tabla de tres modos* para no sentirse clones.  
- **T2-B-E3 leakage_care:** solution tiene rama no ejercitada en prints; documentar en edgeCases o dejar como defensa silenciosa — no cambiar output.  
- **You Do largo:** el starter ya es un mini-producto; la retrospective debe ser corta (40–80 palabras) para no competir con el context.  
- **No tocar outputs canónicos** en el fix salvo execute-and-diff justificado: los asserts y tokens son el contrato del laboratorio.  
- **Schema:** confirmar en el Fixer que `preamble`, `title`, `retrospective` son campos opcionales aceptados por `CourseSection` types (como en secciones gold ya fijadas).  

---

## Fixer handoff notes
- Implementar solo campos pedagógicos en `s39-integrator-phase2.ts`; no regenerar exercises.  
- Respetar longitudes del PEDAGOGY_EXERCISE_SPEC.md.  
- Prosa es-PE profesional; fixtures sintéticos; cero PII real.  
- Tras el fix: typecheck/static build de la sección.  
- Closer del Fixer (cuando corresponda):  
  `Section 39 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.`

---

Section 39 exercise pedagogy review complete. Ready for the Fixer prompt.
