# S49 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Agentes, herramientas y context engineering
- **shortTitle:** Agentes y tools
- **id:** `data-contracts` (archivo `s49-data-contracts.ts`; el **contenido** es agentes acotados, tools SRP, context engineering y HITL — **no** “data contracts” genéricos de schemas tabulares)
- **index:** 49
- **source:** `src/lib/course/sections/s49-data-contracts.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S49-T1-A workflow vs. agente · T1-B routing/planner/evaluator · T2-A tools SRP · T2-B schema/permisos/idempotencia · T3-A contexto JIT/checkpoint · T3-B compaction/LKG · T4-A budgets/stops · T4-B sandbox/HITL/recovery
- **hilo de caso:** entidad ficticia en Ayacucho **CASO-AYA-049** — agente que consulta casos y prepara reportes; no envía, no muta prod ni decide riesgo sin aprobación; gate **CP-N4-C** (agente acotado con aprobación humana; missing ≠ breach)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~337–552), `weDo.steps[]` (24 ejercicios, ~554–1918) y `youDo` (~1921–2016) en `s49-data-contracts.ts`.
- Contrastado con theory T1–T4, learning outcomes, códigos de acción del lab y gate CP-N4-C.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S49 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1–2 frases** (bajo o en el borde del rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + CASO-AYA-049 + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera agentes, **opaco** para newbie sin escena de promote en Ayacucho |
| We Do `feedback` | 1 frase; nombra el principio o pide “explica por qué…” (bien como semilla); poco *por qué importa al gate / al revisor / al portfolio* en forma de corrección inmediata |
| Starter `# DEFECT` | **Excelente** hábito en todos; predicados invertidos y missing→CONTINUE bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con CP-N4-C |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y códigos de acción (`KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, …); **no** proponer cambios de output salvo notas puntuales |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado de dominio → E2 tabla PASS/breach/MISSING → E3 CONTINUE/breach/rama de incertidumbre. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, verbos de acción fail-closed, fixtures sintéticos Ayacucho, stdlib sin frameworks de agentes ni red abierta) es maduro y alineado al puente S48 RAG/evidencia → S49 agentes/tools → S50 evals/red team. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al agente de reportes de Ayacucho, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (predicado → assess tres rutas → decide con rama de incertidumbre). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo del contrato”, E2 “separa válido/adverso/ausente”, E3 “enruta fail-closed en el run del agente”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Nota de naming interno:** el `id` del section es `data-contracts` y el archivo se llama `s49-data-contracts.ts`, pero el título y el contenido son agentes, tools y context engineering. No es defecto de ejercicio; el Fixer no debe “arreglar” el id en esta ronda salvo que el orchestrator lo pida. El learner ve el título correcto en UI.

**Nota de instruction E3:** varios E3 dicen “Salida: imprime el valor de `meets_contract`” pero el código imprime `*results` (tres códigos de acción). El Fixer debería alinear la frase de salida al print real sin cambiar el output canónico.

---

## Unit ledger

### S49-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de decisión ADR `workflow` / `agent_candidate` / `need_evidence` con fail-closed. La `description` nombra el skill; falta `preamble` que diga *qué observar* (cuatro dicts con `mode`+`reason`) y `retrospective` del misconception “si el agente sube el score, ya se promueve”. El `why` es denso pero corto.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de abrir un loop de agente sobre reportes de Ayacucho, el equipo debe **elegir el modo** con métricas, no por moda. En esta demo cuatro escenarios sintéticos (`known_steps`, baseline vs. agent, `plan_bounded`) devuelven `workflow`, `agent_candidate` o `need_evidence`. No escribas aún: predice el `mode` de cada fila y fíjate en que un agente “mejor” sin plan acotado **no** se promociona. Si crees que “falta evidencia = agente igual”, el ADR miente y el lab se convierte en riesgo de side effects.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `adr_mode` modela el contrato de promote local — baseline gana con pasos conocidos ⇒ workflow; agent solo si gana **y** hay plan acotado; en cualquier otro caso `need_evidence`. La razón va en el dict para auditar, no un string suelto. Orden: decisión de modo antes del router. Puente a We Do: reparar `workflow_preferred` invertido, tabla PASS/KEEP/MISSING y decide CONTINUE/KEEP/RUN_AGENT_BASELINE.
- **Proposed retrospective:**  
  Si puedes explicar por qué un agent_success alto con plan sin cota no es promote, ya tienes el hábito de ADR fail-closed. El error clásico es promocionar agente “por descarte”. En We Do practicarás el predicado, las tres rutas y la rama de incertidumbre cuando falta `agent_success`.
- **Code/output changes:** none
- **Validation notes:** Output de cuatro dicts con `mode`/`reason` alineado a theory T1-A.

---

### S49-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter invierte la regla y prefiere agente cuando baseline basta. Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback pide explicación pero no ancla “por qué el revisor del ADR lo exige antes del loop”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Preferir workflow cuando baseline gana
- **Proposed preamble:**  
  - **Contexto:** en `CASO-AYA-049-1A`, el equipo de reportes en Ayacucho solo abre un agente si el baseline no alcanza **y** el plan está justificado.  
  - **Meta:** corregir `workflow_preferred` (pasos conocidos, pocas ramas, tool choice cierta, baseline ≥ agent).  
  - **Éxito:** imprimes exactamente `S49-T1-A PASS` con el fixture válido.  
  - **Límites:** no inventes métricas; no borres el assert; no toques los datos del fixture; no “promuevas” agente reescribiendo el status a mano.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `workflow_preferred` devuelve True cuando *no* hay pasos conocidos o el agente gana (bug: invierte el ADR).  
  2. Exige `known_steps`, `branch_count <= 3`, `not tool_choice_uncertain` y `baseline_success >= agent_success`.  
  3. Conserva el print `S49-T1-A` y el status PASS / KEEP_DETERMINISTIC_WORKFLOW.  
  4. No mutes el record del fixture.
- **Proposed feedback improvement:**  
  PASS exige las cuatro anclas a la vez. Con baseline 0.96 ≥ agent 0.9 y pasos conocidos el ADR elige workflow; invertir la regla marca PASS justo cuando conviene *no* abrir el agente.
- **Proposed retrospective:**  
  Workflow preferred no es “anti-IA”: es baseline que ya basta. El error clásico es promover agente porque “suena más moderno”. Siguiente (E2): tres rutas válido / path abierto / missing `agent_success`.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S49-T1-A PASS` correctos.

---

### S49-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: tres records (válido, path abierto, sin `agent_success`). Starter invierte el predicado. Falta escena “missing ≠ KEEP” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas ADR (PASS / KEEP / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor del ADR en Ayacucho no trata igual un caso limpio, un path abierto y un registro sin métrica de agente.  
  - **Meta:** implementar `assess` que distinga PASS, KEEP_DETERMINISTIC_WORKFLOW y MISSING:agent_success.  
  - **Éxito:** imprime `PASS KEEP_DETERMINISTIC_WORKFLOW MISSING:agent_success` en ese orden.  
  - **Límites:** si falta `agent_success`, no evalúes el predicado; no inventes el campo; missing ≠ “promover agente”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: con campos presentes invierte la preferencia de workflow.  
  2. Primero: calcula `missing` de required; si hay → `MISSING:…`.  
  3. Luego: llama `workflow_preferred` → PASS o KEEP_DETERMINISTIC_WORKFLOW.  
  4. Imprime los tres resultados con `print(*results)`.
- **Proposed retrospective:**  
  Missing es incertidumbre de medición; path abierto es “no promociones aún”. El error clásico es tratar “falta agent_success” como FAIL de contenido. Luego (E3) enrutas CONTINUE / KEEP / RUN_AGENT_BASELINE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S49-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a códigos de acción de promote. Starter trata missing y predicado invertido como CONTINUE — defecto de promote silencioso. Falta preamble de “incertidumbre no es verde” y retrospective de reutilización en youDo. Instruction dice “imprime meets_contract” pero el print es la tupla de códigos.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide modo: CONTINUE o baseline
- **Proposed preamble:**  
  - **Contexto:** en el run de reportes de Ayacucho, un ADR incompleto no “sigue con warning”: o continúa con evidencia o pide baseline.  
  - **Meta:** `decide` → CONTINUE (workflow justificado), KEEP_DETERMINISTIC_WORKFLOW (path abierto), RUN_AGENT_BASELINE (sin agent_success).  
  - **Éxito:** `CONTINUE KEEP_DETERMINISTIC_WORKFLOW RUN_AGENT_BASELINE`.  
  - **Límites:** no inventes `agent_success`; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige missing: sin `agent_success` → `RUN_AGENT_BASELINE` (no CONTINUE).  
  2. Con record completo, reutiliza la regla ADR de E1 (pasos conocidos, ramas acotadas, baseline ≥ agent).  
  3. Solo el limpio es CONTINUE; el path abierto es KEEP_DETERMINISTIC_WORKFLOW.  
  4. Imprime los tres códigos en orden (`print(*results)`).
- **Proposed retrospective:**  
  Un campo ausente es medición pendiente, no un allow optimista. El error clásico es abrir el agente “mientras tanto” sin baseline. Pregunta: ¿por qué KEEP no es lo mismo que RUN_AGENT_BASELINE?
- **Code/output changes:** none (solo alinear redacción de “salida” al print real)
- **Validation notes:** Transfer real; alineado a callout T1-A y códigos del diccionario de sección.

---

### S49-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro del loop evaluator–optimizer con `max_iters` y `STOP_AGENT_LOOP`. Falta preamble de “cota o stop” y retrospective del misconception “si el score sube, el while puede seguir”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Habiendo elegido el modo, el riesgo es un **loop sin techo**. En esta demo un evaluator–optimizer recorre scores con `max_iters`: si un score ≥ 0.9, cierra con evaluator pass; si agota el tope sin pasar, emite `STOP_AGENT_LOOP`. No escribas: predice la traza corta (pasa en iter 2) y la larga (stop). Si crees que “casi listo” justifica otra vuelta sin cota, el costo y el riesgo crecen sin evidencia de promote.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el tope `max_iters` recorta `scores`; cada iter añade worker + evaluator; solo score ≥ 0.9 cierra en verde; si no, stop explícito. Evidencia = trayectoria de roles serializable. Puente a We Do: `bounded_loop_ok`, assess STOP/MISSING y decide REPLAN_WITH_BOUNDS.
- **Proposed retrospective:**  
  Un agente sin cota no es “más inteligente”: es un while con factura. El error clásico es seguir porque el último score “iba mejorando”. We Do: predicado de loop acotado, tres rutas y rama de replan.
- **Code/output changes:** none
- **Validation notes:** Output de traza + STOP alineado a theory T1-B.

---

### S49-T1-B-E1 (weDo, guided)
- **Diagnosis:** Predicado de loop acotado con defect invertido (aprueba plan sobre max o eval fallida). Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Loop acotado con evaluator en True
- **Proposed preamble:**  
  - **Contexto:** en `CASO-AYA-049-1B`, la ruta `report` del agente de Ayacucho solo continúa si el plan cabe en `max_steps` y el evaluator cierra en True.  
  - **Meta:** corregir `bounded_loop_ok` (ruta permitida, plan ≤ max, outputs = plan, eval True).  
  - **Éxito:** imprimes `S49-T1-B PASS`.  
  - **Límites:** rutas solo `case`/`report`; no inventes evaluator_pass; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: devuelve True cuando el plan *supera* max o eval falla (bug invertido).  
  2. Exige `route in {case, report}`, `plan_steps <= max_steps`, `worker_outputs == plan_steps`, `evaluator_pass`.  
  3. Conserva print `S49-T1-B` y status PASS/STOP_AGENT_LOOP.  
  4. No mutes el fixture.
- **Proposed feedback improvement:**  
  Con plan 3 ≤ max 5, outputs 3 y eval True el loop es sano. Si plan_steps=12 con max=5, el planner falla primero aunque el worker “quiera” seguir.
- **Proposed retrospective:**  
  Cota + evaluator = contrato del loop, no un detalle de logging. El error clásico es mirar solo el score del worker. Siguiente (E2): PASS / STOP / MISSING:evaluator_pass.
- **Code/output changes:** none
- **Validation notes:** Solution y output `S49-T1-B PASS` correctos.

---

### S49-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tabla de tres trayectorias bien diseñada; starter aprueba loops rotos. Falta escena missing≠STOP y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres trayectorias del loop (PASS / STOP / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de trazas en Ayacucho no confunde un loop limpio, uno desbordado y una traza sin bandera de evaluator.  
  - **Meta:** `assess` → PASS, STOP_AGENT_LOOP, MISSING:evaluator_pass.  
  - **Éxito:** `PASS STOP_AGENT_LOOP MISSING:evaluator_pass`.  
  - **Límites:** sin `evaluator_pass` no evalúes el contenido; no inventes el campo.
- **Proposed instruction/description improvements:**  
  1. Corrige `bounded_loop_ok` (hoy aprueba planes rotos).  
  2. Primero `missing`; si hay → MISSING:….  
  3. Completo: PASS solo si `bounded_loop_ok`; si no STOP_AGENT_LOOP.  
  4. Imprime los tres con `print(*results)`.
- **Proposed retrospective:**  
  Ruta unknown + plan 12 es breach de cota; falta de evaluator es incertidumbre de cierre. El error clásico es asumir eval True “porque el worker terminó”. Luego (E3): CONTINUE / STOP / REPLAN_WITH_BOUNDS.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S49-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a códigos de operación del loop. Starter missing→CONTINUE y pred invertido. Misma inconsistencia “meets_contract” vs print de códigos.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide loop: CONTINUE o REPLAN
- **Proposed preamble:**  
  - **Contexto:** en producción sintética del agente de reportes, un loop sin bandera de evaluator no “sigue de verde”.  
  - **Meta:** `decide` → CONTINUE, STOP_AGENT_LOOP, REPLAN_WITH_BOUNDS.  
  - **Éxito:** `CONTINUE STOP_AGENT_LOOP REPLAN_WITH_BOUNDS`.  
  - **Límites:** no trates missing como CONTINUE; no asumas evaluator_pass.
- **Proposed instruction/description improvements:**  
  1. Missing → REPLAN_WITH_BOUNDS.  
  2. Completo: reutiliza la regla de loop acotado de E1/E2.  
  3. Solo trayectoria limpia → CONTINUE; ruta/plan inválidos → STOP_AGENT_LOOP.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Replanear con cotas no es castigo: es pedir un plan medible. El error clásico es STOP por “falta de campo” o CONTINUE por optimismo. Pregunta: ¿qué rol fallaría primero con plan 12 y max 5?
- **Code/output changes:** none (alinear frase de salida)
- **Validation notes:** Transfer real; códigos alineados a theory T1-B.

---

### S49-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de audit de catálogo SRP vs god-tool. Falta preamble de “descripción en prompt ≠ autoridad” y retrospective del misconception “una tool multi-efecto es más útil”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El agente de Ayacucho solo puede invocar tools que un humano elegiría con certeza mirando el catálogo. En esta demo `audit_tools` separa `get_case` y `search_docs` (1 responsabilidad, schema corto) de `do_everything` (6 responsabilidades, `raw`). No escribas: predice `allow` y `disable`. Si crees que el nombre “do_everything” basta porque el prompt lo describe, el least privilege ya se rompió antes del primer call.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el filtro usa `responsibilities == 1` y `len(schema) <= 2`; lo demás va a `disable`. Evidencia de contrato sin frameworks. Puente a We Do: `is_srp_tool` estricto (`schema == {case_id}`, sin side_effect, typed_errors), assess DISABLE/MISSING y decide SPLIT_TOOL_CONTRACT.
- **Proposed retrospective:**  
  SRP de tool = una cosa observable y auditable. El error clásico es “una sola tool para todo el caso”. We Do: predicado, tres rutas y split de contrato incompleto.
- **Code/output changes:** none
- **Validation notes:** Output `allow`/`disable` alineado a theory T2-A.

---

### S49-T2-A-E1 (weDo, guided)
- **Diagnosis:** Predicado SRP con defect que aprueba multi-duty. Instruction densa; sin scaffolding verbal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tool SRP con schema de case_id
- **Proposed preamble:**  
  - **Contexto:** en `CASO-AYA-049-2A`, el registry del agente de reportes solo admite lectura de caso con contrato estrecho.  
  - **Meta:** corregir `is_srp_tool` (responsibilities==1, schema `{case_id}`, sin side_effect, typed_errors).  
  - **Éxito:** `S49-T2-A PASS`.  
  - **Límites:** no amplíes el schema a `raw`; no “arregles” el fixture; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: True si responsibilities>1 o side_effect (bug: aprueba god-tools).  
  2. Exige las cuatro condiciones de la solución.  
  3. Conserva print `S49-T2-A` y status PASS/DISABLE_OVERBROAD_TOOL.  
  4. No mutes el record.
- **Proposed feedback improvement:**  
  `get_case_status` con schema `{case_id}` y typed_errors pasa; `do_everything` con `{raw}` se deshabilita aunque el nombre “suene útil”.
- **Proposed retrospective:**  
  Schema estrecho + errores tipados son el contrato, no el marketing del prompt. El error clásico es confiar en la descripción verbal de la tool. Siguiente (E2): PASS / DISABLE / MISSING:typed_errors.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S49-T2-A-E2 (weDo, independent)
- **Diagnosis:** Catálogo de tres tools bien armado; starter aprueba multi-duty. Falta preamble missing≠DISABLE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar catálogo SRP (PASS / DISABLE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor del registry en Ayacucho clasifica tools válidas, god-tools y contratos incompletos.  
  - **Meta:** `assess` → PASS, DISABLE_OVERBROAD_TOOL, MISSING:typed_errors.  
  - **Éxito:** `PASS DISABLE_OVERBROAD_TOOL MISSING:typed_errors`.  
  - **Límites:** sin `typed_errors` no evalúes SRP; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Corrige `is_srp_tool` (hoy acepta multi-duty).  
  2. Primero missing; luego PASS/DISABLE.  
  3. Reutiliza el predicado estricto de E1.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Multi-duty es breach de least privilege; falta de typed_errors es incertidumbre de contrato. El error clásico es DISABLE por “campo ausente”. Luego (E3): CONTINUE / DISABLE / SPLIT_TOOL_CONTRACT.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S49-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de promoción del registry. Starter missing→CONTINUE y pred invertido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide registry: CONTINUE o SPLIT
- **Proposed preamble:**  
  - **Contexto:** antes de enganchar el catálogo al agente de Ayacucho, el gate debe fallar cerrado.  
  - **Meta:** `decide` → CONTINUE, DISABLE_OVERBROAD_TOOL, SPLIT_TOOL_CONTRACT.  
  - **Éxito:** `CONTINUE DISABLE_OVERBROAD_TOOL SPLIT_TOOL_CONTRACT`.  
  - **Límites:** no promociones con schema ambiguo; no trates missing como CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → SPLIT_TOOL_CONTRACT.  
  2. Completo: reutiliza `is_srp_tool`; solo True → CONTINUE.  
  3. God-tool / multi-side-effect → DISABLE_OVERBROAD_TOOL.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Split no es “más burocracia”: es descomponer hasta que un humano elija la tool con certeza. El error clásico es CONTINUE sin typed_errors. Pregunta: ¿por qué `{raw}` rompe el least privilege?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T2-A.

---

### S49-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de allowlist + store de idempotencia con replay seguro y DENY por scope. Falta preamble de “retry ≠ doble efecto” y retrospective del misconception “si reintento, debo volver a aplicar el write”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Una tool de preparación de reporte puede reintentarse; **no** puede cobrar dos veces el side effect. En esta demo `call_tool` chequea scope en `granted`, guarda por `idempotency_key` y reusa el resultado en el segundo call; `prod:write` fuera del grant devuelve error terminal. No escribas: predice los tres dicts (ok, ok replay, forbidden). Si crees que `attempts` debe igualar `effects`, el retry se convierte en incidente.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: allowlist primero; key en store ⇒ replay sin nuevo efecto; scope denegado es terminal tipado. Evidencia = store serializable. Puente a We Do: `tool_call_ok` (schema, key, effects==1, error_kind), assess DENY/MISSING y decide CLASSIFY_TOOL_ERROR.
- **Proposed retrospective:**  
  Misma key ⇒ un solo effect aunque attempts suba. El error clásico es reintentar write sin store. We Do: predicado de call segura, tres rutas y clasificación de error.
- **Code/output changes:** none
- **Validation notes:** Output de tres llamadas alineado a theory T2-B.

---

### S49-T2-B-E1 (weDo, guided)
- **Diagnosis:** Predicado de call con defect que aprueba fuera de grant o multi-efecto. Scaffolding verbal ausente.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Call con scope e idempotencia
- **Proposed preamble:**  
  - **Contexto:** en `CASO-AYA-049-2B`, el log del agente de Ayacucho solo acepta `report:prepare` con key y un solo effect tras retry.  
  - **Meta:** corregir `tool_call_ok` (schema válido, scope granted, key no vacía, effects==1, error_kind tipado).  
  - **Éxito:** `S49-T2-B PASS`.  
  - **Límites:** no inventes scopes; no borres el assert; attempts puede ser 2 si effects sigue en 1.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: True si scope *no* granted o effects>1 (bug invertido).  
  2. Exige las cinco condiciones de la solución (`error_kind` ∈ {retryable, terminal}).  
  3. Conserva print `S49-T2-B` y status PASS/DENY_TOOL_CALL.  
  4. No mutes el fixture.
- **Proposed feedback improvement:**  
  Retry con la misma key y effects=1 es PASS; denegar por scope (prod:write) no es lo mismo que denegar por effects duplicados — ambos fallan, por razones distintas.
- **Proposed retrospective:**  
  Permiso y unicidad de efecto son puertas distintas. El error clásico es confiar solo en el schema. Siguiente (E2): PASS / DENY / MISSING:error_kind.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S49-T2-B-E2 (weDo, independent)
- **Diagnosis:** Log de tres calls bien construido (válido, prod:write basura, sin error_kind). Falta preamble missing≠DENY.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Log de calls (PASS / DENY / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor del tool log en Ayacucho separa call limpia, breach de scope/efectos y call sin clasificación de error.  
  - **Meta:** `assess` → PASS, DENY_TOOL_CALL, MISSING:error_kind.  
  - **Éxito:** `PASS DENY_TOOL_CALL MISSING:error_kind`.  
  - **Límites:** sin `error_kind` no evalúes el contenido; no inventes “secret dump” como kind válido.
- **Proposed instruction/description improvements:**  
  1. Corrige `tool_call_ok` (hoy aprueba fuera de grant).  
  2. Primero missing; luego PASS/DENY.  
  3. Reutiliza el predicado de E1.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Scope denegado o multi-efecto es breach; falta de kind es incertidumbre de política de retry. El error clásico es ejecutar a ciegas sin tipar el error. Luego (E3): CONTINUE / DENY / CLASSIFY_TOOL_ERROR.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S49-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de política de tool-use fail-closed. Starter missing→CONTINUE y pred invertido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide tool-use: CONTINUE o CLASSIFY
- **Proposed preamble:**  
  - **Contexto:** en el run del agente de reportes, un error sin kind no se “resuelve” reintentando.  
  - **Meta:** `decide` → CONTINUE, DENY_TOOL_CALL, CLASSIFY_TOOL_ERROR.  
  - **Éxito:** `CONTINUE DENY_TOOL_CALL CLASSIFY_TOOL_ERROR`.  
  - **Límites:** no ejecutes a ciegas sin error_kind; no trates missing como CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → CLASSIFY_TOOL_ERROR.  
  2. Completo: reutiliza `tool_call_ok`; solo True → CONTINUE.  
  3. Scope/efectos rotos → DENY_TOOL_CALL.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Clasificar el error es prerrequisito de retry; denegar es rechazo de política. El error clásico es CONTINUE con dump de secreto como kind. Pregunta: ¿por qué attempts=2 con effects=1 sigue siendo válido?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T2-B.

---

### S49-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de JIT + techo de tokens + checkpoint. Falta preamble de “atención acotada” y retrospective del misconception “más contexto = mejor agente”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El contexto del agente de Ayacucho es un **presupuesto de atención**, no un cajón de basura. En esta demo `build_context` recupera solo hits de la query: C1 bajo 2000 tokens pasa con checkpoint; el manual genérico de 2000 tokens con techo 500 falla a `COMPACT_AND_CHECKPOINT`. No escribas: predice status, tokens y checkpoint. Si crees que volcar todo el corpus “por si acaso” mejora el run, subes costo, latencia y riesgo de fuga.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: filtra por query, suma tokens, desborde o sin hits ⇒ compactar; ok incluye checkpoint post-retrieve. Puente a We Do: `context_ok` (tokens≤max, JIT, checkpoint, provenance), assess COMPACT/MISSING y decide RETRIEVE_MINIMUM_CONTEXT.
- **Proposed retrospective:**  
  JIT + checkpoint = elegir hechos y poder reanudar. El error clásico es “el modelo se las arreglará con 9k tokens”. We Do: predicado de contexto mínimo, tres rutas y provenance.
- **Code/output changes:** none
- **Validation notes:** Output ok + COMPACT alineado a theory T3-A.

---

### S49-T3-A-E1 (weDo, guided)
- **Diagnosis:** Predicado de attention budget con defect que aprueba overflow. Scaffolding verbal ausente.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contexto bajo techo con JIT
- **Proposed preamble:**  
  - **Contexto:** en `CASO-AYA-049-3A`, el paso actual del agente solo puede cargar hechos del caso C1 bajo techo con provenance.  
  - **Meta:** corregir `context_ok` (tokens ≤ max, JIT, checkpoint_after_effect, provenance).  
  - **Éxito:** `S49-T3-A PASS`.  
  - **Límites:** no subas el techo a mano; no borres el assert; no inventes provenance.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: True si tokens *superan* max o falta checkpoint (bug invertido).  
  2. Exige las cuatro condiciones de la solución.  
  3. Conserva print `S49-T3-A` y status PASS/COMPACT_AND_CHECKPOINT.  
  4. No mutes el fixture.
- **Proposed feedback improvement:**  
  1200 ≤ 2000 con JIT+checkpoint+provenance es PASS. Volcar el corpus “porque el modelo aguanta” rompe el contrato aunque el run “funcione” en la laptop.
- **Proposed retrospective:**  
  Attention budget es política de run, no un tip de prompt. El error clásico es ignorar provenance si los tokens caben. Siguiente (E2): PASS / COMPACT / MISSING:provenance.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S49-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tres packs de contexto bien armados; starter aprueba overflow. Falta preamble missing≠COMPACT.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres packs de contexto (PASS / COMPACT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de context engineering en Ayacucho no confunde pack limpio, overflow y pack sin provenance.  
  - **Meta:** `assess` → PASS, COMPACT_AND_CHECKPOINT, MISSING:provenance.  
  - **Éxito:** `PASS COMPACT_AND_CHECKPOINT MISSING:provenance`.  
  - **Límites:** sin provenance no evalúes tokens; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Corrige `context_ok` (hoy aprueba desborde).  
  2. Primero missing; luego PASS/COMPACT.  
  3. Reutiliza el predicado de E1.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Overflow o sin checkpoint es breach de presupuesto; falta de provenance es incertidumbre de hechos. El error clásico es COMPACT por “campo ausente”. Luego (E3): CONTINUE / COMPACT / RETRIEVE_MINIMUM_CONTEXT.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S49-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de “¿puede correr el paso?”. Starter missing→CONTINUE y pred invertido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide contexto: CONTINUE o RETRIEVE
- **Proposed preamble:**  
  - **Contexto:** en el run del agente de reportes, hechos huérfanos no se ejecutan “por velocidad”.  
  - **Meta:** `decide` → CONTINUE, COMPACT_AND_CHECKPOINT, RETRIEVE_MINIMUM_CONTEXT.  
  - **Éxito:** `CONTINUE COMPACT_AND_CHECKPOINT RETRIEVE_MINIMUM_CONTEXT`.  
  - **Límites:** no ejecutes sin provenance; no trates missing como CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → RETRIEVE_MINIMUM_CONTEXT.  
  2. Completo: reutiliza `context_ok`; solo True → CONTINUE.  
  3. Overflow/sin JIT/checkpoint → COMPACT_AND_CHECKPOINT.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Recuperar mínimo con provenance no es “menos IA”: es no inventar hechos. El error clásico es CONTINUE con 9k tokens. Pregunta: ¿qué hace falta además de tokens≤max?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T3-A.

---

### S49-T3-B-DEMO (iDo)
- **Diagnosis:** Demo de compaction que conserva restricciones críticas o restaura LKG. Falta preamble de “compactar sin borrar no_prod_write” y retrospective del misconception “menos tokens siempre es mejor recovery”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Compactar el log del agente de Ayacucho puede borrar ruido; **no** puede borrar `budget` ni `no_prod_write`. En esta demo `compact_memory` deja facts críticos + LKG `cp-7` en el caso bueno, y emite `RESTORE_LAST_KNOWN_GOOD` si el drop rompe el conjunto crítico. No escribas: predice ambos status. Si crees que recovery = “volver a ejecutar el write”, el LKG dejó de ser recovery y pasó a incidente.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `CRITICAL <= after` es el invariante; si falla, se apunta al LKG sin inventar facts. Puente a We Do: `compaction_ok` (⊆, retención ≤7, prefijo `cp-`), assess RESTORE/MISSING y decide REVIEW_COMPACTION_LOSS.
- **Proposed retrospective:**  
  LKG es el último checkpoint seguro, no un string decorativo. El error clásico es compactar borrando la restricción que evitaba prod write. We Do: predicado, tres rutas y revisión humana del diff.
- **Code/output changes:** none
- **Validation notes:** Output ok + RESTORE alineado a theory T3-B.

---

### S49-T3-B-E1 (weDo, guided)
- **Diagnosis:** Predicado de compaction con defect que aprueba pérdida de facts o LKG vacío. Scaffolding verbal ausente.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Compaction que conserva LKG
- **Proposed preamble:**  
  - **Contexto:** en `CASO-AYA-049-3B`, la memoria del agente de Ayacucho solo se compacta si las restricciones críticas sobreviven y hay checkpoint `cp-*`.  
  - **Meta:** corregir `compaction_ok` (`facts_before ⊆ facts_after`, retención ≤7, LKG con prefijo `cp-`).  
  - **Éxito:** `S49-T3-B PASS`.  
  - **Límites:** no inventes LKG; no borres el assert; usa `<=` de conjuntos para ⊆.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: True si *no* hay inclusión o LKG vacío (bug invertido).  
  2. Exige las tres condiciones de la solución (`startswith("cp-")`).  
  3. Conserva print `S49-T3-B` y status PASS/RESTORE_LAST_KNOWN_GOOD.  
  4. No mutes el fixture.
- **Proposed feedback improvement:**  
  Conservar `case_id`/`budget`/`no_prod_write` con LKG `cp-7` es PASS. Borrar `budget` o dejar LKG vacío no es “ahorro de tokens”: es pérdida de recovery.
- **Proposed retrospective:**  
  Compaction segura = menos ruido con las mismas puertas de seguridad. El error clásico es LKG vacío “porque no hubo efecto”. Siguiente (E2): PASS / RESTORE / MISSING:last_known_good.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S49-T3-B-E2 (weDo, independent)
- **Diagnosis:** Diff de memoria bien armado; starter aprueba drop de facts. Falta preamble missing≠RESTORE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Diff de memoria (PASS / RESTORE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de recovery en Ayacucho no confunde compactación limpia, pérdida de restricciones y registro sin campo LKG.  
  - **Meta:** `assess` → PASS, RESTORE_LAST_KNOWN_GOOD, MISSING:last_known_good.  
  - **Éxito:** `PASS RESTORE_LAST_KNOWN_GOOD MISSING:last_known_good`.  
  - **Límites:** sin `last_known_good` no evalúes el diff; no inventes `cp-`.
- **Proposed instruction/description improvements:**  
  1. Corrige `compaction_ok` (hoy aprueba drop).  
  2. Primero missing; luego PASS/RESTORE.  
  3. Reutiliza el predicado de E1.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Pérdida de facts críticos es breach de recovery; falta de campo LKG es incertidumbre de rollback. El error clásico es seguir el run “porque case_id quedó”. Luego (E3): CONTINUE / RESTORE / REVIEW_COMPACTION_LOSS.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S49-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de protección de recovery. Starter missing→CONTINUE y pred invertido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide recovery: CONTINUE o REVIEW
- **Proposed preamble:**  
  - **Contexto:** en el run del agente de reportes, sin poder nombrar el checkpoint de rollback no se continúa.  
  - **Meta:** `decide` → CONTINUE, RESTORE_LAST_KNOWN_GOOD, REVIEW_COMPACTION_LOSS.  
  - **Éxito:** `CONTINUE RESTORE_LAST_KNOWN_GOOD REVIEW_COMPACTION_LOSS`.  
  - **Límites:** no continúes sin LKG; no trates missing como CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Missing → REVIEW_COMPACTION_LOSS.  
  2. Completo: reutiliza `compaction_ok`; solo True → CONTINUE.  
  3. Drop de críticos o LKG vacío → RESTORE_LAST_KNOWN_GOOD.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Review del diff de facts es humano; restore es automático al LKG. El error clásico es CONTINUE tras borrar `no_prod_write`. Pregunta: ¿qué prefijo debe tener un LKG recuperable?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T3-B.

---

### S49-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de budgets con `GOAL_MET` vs `STOP_BUDGET_EXHAUSTED`. Falta preamble de “stop con razón” y retrospective del misconception “estaba cerca del goal, sube el techo”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El agente de Ayacucho no “casi termina”: o cumple la meta bajo techo o se detiene con razón. En esta demo `agent_steps` acumula `cost_pen` 0.02 por paso: con techo 0.06 y goal en paso 3 emite `GOAL_MET`; con techo 0.03 se corta en `STOP_BUDGET_EXHAUSTED`. No escribas: predice ambos strings. Si crees que el modelo puede inventar éxito porque “iba bien”, el log del portfolio miente.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el loop chequea costo antes de la meta; stop lleva step y cost_pen legibles. `cost_pen` es sintético del lab, no moneda real. Puente a We Do: `budget_ok` (goal + steps/tokens/cost ≤ max), assess STOP/MISSING y decide ASK_FOR_SCOPE_REDUCTION.
- **Proposed retrospective:**  
  Stop con razón es evidencia; inventar techo no lo es. El error clásico es elevar max_cost_pen sin humano. We Do: predicado de budget, tres rutas y reducción de scope.
- **Code/output changes:** none
- **Validation notes:** Output GOAL_MET / STOP alineado a theory T4-A. (Nota: demo usa cost 0.02/step; theory sample usa 0.01 — ambos coherentes internamente.)

---

### S49-T4-A-E1 (weDo, guided)
- **Diagnosis:** Predicado de budget con defect que aprueba agotamiento. Scaffolding verbal ausente.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Meta dentro de steps y cost_pen
- **Proposed preamble:**  
  - **Contexto:** en `CASO-AYA-049-4A`, el run de reportes en Ayacucho solo es PASS si la meta se cumplió **y** steps/tokens/cost_pen caben en sus máximos.  
  - **Meta:** corregir `budget_ok` (goal_met y contadores ≤ techos).  
  - **Éxito:** `S49-T4-A PASS`.  
  - **Límites:** no ignores tokens; no inventes max_cost_pen; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: True si steps o cost *superan* el techo (bug invertido).  
  2. Exige goal_met y los tres contadores bajo max.  
  3. Conserva print `S49-T4-A` y status PASS/STOP_BUDGET_EXHAUSTED.  
  4. No mutes el fixture.
- **Proposed feedback improvement:**  
  4 pasos / 3200 tokens / 0.04 de cost bajo techos 6 / 5000 / 0.06 con meta True es PASS. Si cost_pen supera max a mitad de camino, el string de stop es `STOP_BUDGET_EXHAUSTED`, no un PASS optimista.
- **Proposed retrospective:**  
  Budget es política de parada, no un KPI de vanidad. El error clásico es PASS con goal_met False. Siguiente (E2): PASS / STOP / MISSING:max_cost_pen.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S49-T4-A-E2 (weDo, independent)
- **Diagnosis:** Ledger de tres runs bien armado; starter aprueba sobre-presupuesto. Falta preamble missing≠STOP.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ledger de presupuesto (PASS / STOP / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de costos sintéticos en Ayacucho no confunde run limpio, run desbordado y config sin `max_cost_pen`.  
  - **Meta:** `assess` → PASS, STOP_BUDGET_EXHAUSTED, MISSING:max_cost_pen.  
  - **Éxito:** `PASS STOP_BUDGET_EXHAUSTED MISSING:max_cost_pen`.  
  - **Límites:** sin max_cost_pen no evalúes el contenido; no inventes el techo.
- **Proposed instruction/description improvements:**  
  1. Corrige `budget_ok` (hoy aprueba agotamiento).  
  2. Primero missing; luego PASS/STOP.  
  3. Reutiliza el predicado de E1.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Steps/cost sobre techo es breach de budget; falta de max_cost_pen es incertidumbre de config. El error clásico es STOP por “campo ausente” o inventar 0.06. Luego (E3): CONTINUE / STOP / ASK_FOR_SCOPE_REDUCTION.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S49-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de stopping conditions operativas. Starter missing→CONTINUE y pred invertido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide budget: CONTINUE o reducir scope
- **Proposed preamble:**  
  - **Contexto:** en el run del agente de reportes, sin techo de costo no se “sigue a ciegas”.  
  - **Meta:** `decide` → CONTINUE, STOP_BUDGET_EXHAUSTED, ASK_FOR_SCOPE_REDUCTION.  
  - **Éxito:** `CONTINUE STOP_BUDGET_EXHAUSTED ASK_FOR_SCOPE_REDUCTION`.  
  - **Límites:** no inventes techo; no trates missing como CONTINUE; deja razón de stop en el log del portfolio.
- **Proposed instruction/description improvements:**  
  1. Missing → ASK_FOR_SCOPE_REDUCTION.  
  2. Completo: reutiliza `budget_ok`; solo True → CONTINUE.  
  3. Sobre techo o sin meta → STOP_BUDGET_EXHAUSTED.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Reducir scope es política; inventar techo es fraude de evidencia. El error clásico es CONTINUE con 20 pasos y cost 0.4. Pregunta: ¿qué tres contadores deben caber además de goal_met?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T4-A.

---

### S49-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de sandbox + approval ligada a la acción + anti-replay. Falta preamble de “HITL contextual” y retrospective del misconception “approval genérica en el README basta”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Preparar un borrador en sandbox no es lo mismo que `prod_send`. En esta demo `gate` exige `network=none`, approval **por acción** y `replayed==0`: search pasa; prod sin approved_for pide humano; red open o replay detienen con `SANDBOX_AND_STOP`. No escribas: predice las cuatro salidas. Si crees que un checkbox genérico del README autoriza cualquier tool, el gate CP-N4-C ya falló.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: red abierta o efectos duplicados ganan a la approval; approval debe igualar el nombre de la acción `prod_*`. Evidencia fail-closed. Puente a We Do: `sandbox_ok` (none, workspace-read, approval si aplica, cp-*, replay 0), assess SANDBOX/MISSING y decide REQUEST_HUMAN_APPROVAL.
- **Proposed retrospective:**  
  Recovery = reanudar desde checkpoint sin re-ejecutar side effects. El error clásico es “volver a enviar el correo” al recuperar. We Do: predicado, tres rutas y HITL cuando falta evidencia de replay.
- **Code/output changes:** none
- **Validation notes:** Output de cuatro gates alineado a theory T4-B.

---

### S49-T4-B-E1 (weDo, guided)
- **Diagnosis:** Predicado sandbox/HITL con defect que aprueba red open o replay. Scaffolding verbal ausente.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Sandbox con approval y sin replay
- **Proposed preamble:**  
  - **Contexto:** en `CASO-AYA-049-4B`, el agente de Ayacucho solo prepara el draft con red cerrada, FS de workspace, approval si aplica y cero efectos rejugados.  
  - **Meta:** corregir `sandbox_ok` (network none, FS workspace-read, approval si required, checkpoint `cp-*`, replayed_effects==0).  
  - **Éxito:** `S49-T4-B PASS`.  
  - **Límites:** no abras network; no borres el assert; replayed > 0 es siempre breach.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: True si network open, sin approval o replay>0 (bug invertido).  
  2. Exige las cinco condiciones de la solución (`not approval_required or approval_present`).  
  3. Conserva print `S49-T4-B` y status PASS/SANDBOX_AND_STOP.  
  4. No mutes el fixture.
- **Proposed feedback improvement:**  
  prepare-draft con none + workspace-read + approval + cp-9 + replay 0 es PASS. Recovery reanuda desde checkpoint; volver a ejecutar side effects no es recovery — es incidente.
- **Proposed retrospective:**  
  HITL es contextual a la tool, no un permiso global del lab. El error clásico es PASS con replayed_effects=2. Siguiente (E2): PASS / SANDBOX / MISSING:replayed_effects.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S49-T4-B-E2 (weDo, independent)
- **Diagnosis:** Matriz de política bien armada; starter aprueba breach de sandbox. Falta preamble missing≠SANDBOX.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Matriz sandbox+HITL (PASS / SANDBOX / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de operación en Ayacucho no confunde run sandboxed, breach de red/FS/replay y registro sin contador de replay.  
  - **Meta:** `assess` → PASS, SANDBOX_AND_STOP, MISSING:replayed_effects.  
  - **Éxito:** `PASS SANDBOX_AND_STOP MISSING:replayed_effects`.  
  - **Límites:** sin replayed_effects no evalúes el contenido; no inventes 0.
- **Proposed instruction/description improvements:**  
  1. Corrige `sandbox_ok` (hoy aprueba open/replay).  
  2. Primero missing; luego PASS/SANDBOX.  
  3. Reutiliza el predicado de E1.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Red open o replay es breach de sandbox; falta de contador es incertidumbre de anti-replay. El error clásico es SANDBOX por “campo ausente” o reanudar a ciegas. Luego (E3): CONTINUE / SANDBOX / REQUEST_HUMAN_APPROVAL.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S49-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de cierre CP-N4-C en el lab. Starter missing→CONTINUE y pred invertido. Cierra el arco de la sección hacia youDo y S50.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide gate: CONTINUE o pedir humano
- **Proposed preamble:**  
  - **Contexto:** en el cierre de CP-N4-C para el agente de reportes de Ayacucho, sin evidencia de replay no se reanuda a ciegas.  
  - **Meta:** `decide` → CONTINUE, SANDBOX_AND_STOP, REQUEST_HUMAN_APPROVAL.  
  - **Éxito:** `CONTINUE SANDBOX_AND_STOP REQUEST_HUMAN_APPROVAL`.  
  - **Límites:** no trates missing como CONTINUE; no abras red; no dupliques effects en recovery.
- **Proposed instruction/description improvements:**  
  1. Missing → REQUEST_HUMAN_APPROVAL.  
  2. Completo: reutiliza `sandbox_ok`; solo True → CONTINUE.  
  3. Red/FS/replay/approval rotos → SANDBOX_AND_STOP.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Pedir humano ante incertidumbre de replay es fail-closed de operación. El error clásico es CONTINUE con network open “porque hay approval en el README”. Pregunta: ¿por qué approval_present debe ligarse a la acción y no a un flag global? Esto es lo que S50 evaluará con red team.
- **Code/output changes:** none
- **Validation notes:** Transfer real; cierra T4-B y el hilo CP-N4-C del lab.

---

### S49-YOU-DO (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context con caso Ayacucho, objectives medibles, requirements con ADR/loop/tools/budgets/HITL, starter stdlib con smoke, rubric y portfolioNote de CP-N4-C. Falta **solo** `retrospective` de defensa/metacognición post-build. El learner puede construir y aún no se le pide articular invariantes, PII sintético vs real, y frase de impacto defendible.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (youDo ya tiene title de sección)
- **Proposed preamble:** N/A (youDo usa `context`; no añadir preamble duplicado)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements. Opcional P2: en `portfolioNote`, una línea que recuerde conservar evidencia de `REQUEST_HUMAN_APPROVAL` y de replay idempotente (ya implícito; no obligatorio).
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante del gate CP-N4-C demuestras con un test o print (p. ej. misma key ⇒ un effect, o prod sin approval ⇒ needs_human)? (2) ¿qué harías distinto con datos reales vs. `CASO-AYA-049` sintético (PII, red, secretos)? (3) En el README, una frase de impacto medible (antes/después: side effects sin control → fail-closed con LKG y HITL) que puedas defender en 30 segundos ante un revisor de plataforma.
- **Code/output changes:** none
- **Validation notes:** Starter inicia evidence en False y readiness BLOCKED por diseño — correcto; no “arreglar” a READY.

---

## Priority order

### P0 (bloquear “true newbie” sin escena de práctica)
1. **Todos los 24 We Do:** añadir `title` + `preamble` (contexto/meta/éxito/límites) + `retrospective`; dejar `instruction` solo-tarea (pasos numerados).
2. **Alinear frases de salida E3** que dicen “imprime meets_contract” al print real de códigos de acción (sin cambiar outputs canónicos).
3. **Diferenciar prosa E1→E2→E3** en cada subtema (reparar predicado → tabla tres rutas → decide fail-closed), no tres clones del mismo párrafo.

Orden sugerido de implementación por subtema (mismo skill end-to-end):
1. S49-T1-A E1→E2→E3 (workflow vs. agente / ADR)
2. S49-T1-B E1→E2→E3 (loop planner/evaluator)
3. S49-T2-A E1→E2→E3 (tools SRP)
4. S49-T2-B E1→E2→E3 (schema/permisos/idempotencia)
5. S49-T3-A E1→E2→E3 (JIT/checkpoint)
6. S49-T3-B E1→E2→E3 (compaction/LKG)
7. S49-T4-A E1→E2→E3 (budgets/stops)
8. S49-T4-B E1→E2→E3 (sandbox/HITL) — cierra CP-N4-C del lab

### P1
1. **8 I Do:** `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras donde quede en 1 frase.
2. **You Do:** añadir `retrospective` de defensa (invariante / PII / frase de impacto).

### P2
1. **We Do `feedback`:** de pregunta suelta o 1 línea a 25–60 palabras de corrección con *por qué* al gate/portfolio (semillas ya existen en varios E1).
2. **Hints:** en E3, bajar un grado el “casi-solución” si el Fixer ve spoiling excesivo (opcional; el transfer de código ya es real).
3. **Naming interno** `data-contracts` vs. título de agentes: solo si el orchestrator lo pide; no es bug de ejercicio.

---

## Residual risks

1. **Homogeneidad estructural del lab:** los 8 subtemas comparten el esqueleto predicado → assess → decide. Es **buena** ingeniería curricular (códigos de acción consistentes), pero el Fixer debe **variar** contexto de Ayacucho, metáforas (ADR / traza / registry / store / attention / LKG / budget / sandbox) y misconceptions; si pega la misma plantilla de 4 bullets con solo el nombre del código, el learner percibe clones y se desconecta.
2. **Carga cognitiva Master/phase 3:** muchos verbos de acción (`KEEP_DETERMINISTIC_WORKFLOW`, `RUN_AGENT_BASELINE`, `CLASSIFY_TOOL_ERROR`, …). El preamble debe traducir cada uno a una escena concreta (“no promociones el agente aún”, “mide baseline”, “tipa el error antes de reintentar”); no asumir que el diccionario de theory se memorizó.
3. **Confusión workflow vs. agent_candidate vs. need_evidence:** T1-A es la puerta de toda la sección; si el Fixer escatima escena aquí, T2–T4 se leen como drills de booleanos sin “por qué no abrimos el loop”.
4. **You Do breadth:** el proyecto integra T1–T4; sin retrospective el portfolio puede pasar asserts y aún no demostrar discurso de gate. El Fixer no debe hinchar requirements — solo el cierre metacognitivo.
5. **Id de archivo vs. contenido:** un revisor futuro puede auditar “data contracts” y no encontrar schemas tabulares; documentar en el report (hecho) evita “arreglar” el tema por error.
6. **Outputs canónicos:** no tocar strings de PASS/códigos ni fixtures `CASO-AYA-049-*` salvo execute-and-diff justificado; la pedagogía va en campos de prosa.
7. **Anti-aberración en la fix:** al implementar, cada unidad a mano; prohibido script que fabrique 24 preambles por sustitución de tokens.

---

## Acceptance handoff for Fixer

- [ ] Cada iDo no trivial: `preamble` + `retrospective` (+ `why` en rango si aplica)
- [ ] Cada weDo: `title` + `preamble` + `instruction` solo-tarea + `retrospective` (+ feedback reforzado donde P2)
- [ ] youDo: `retrospective`
- [ ] Exact outputs preservados
- [ ] Español profesional peruano; sin PII real; caso sintético Ayacucho
- [ ] Sin generadores
- [ ] Section source compila en static build

---

Section 49 exercise pedagogy review complete. Ready for the Fixer prompt.
