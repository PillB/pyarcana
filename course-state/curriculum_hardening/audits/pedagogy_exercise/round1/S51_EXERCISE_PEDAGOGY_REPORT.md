# S51 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Observabilidad, gobernanza y UX del copiloto
- **shortTitle:** Obs y UX copiloto
- **id:** `integrator-final`
- **index:** 51
- **source:** `src/lib/course/sections/s51-integrator-final.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S51-T1-A traces/PII · T1-B tokens/costo/latencia/redacción · T2-A registry pin · T2-B dual-control/audit · T3-A multi-SLI/drift/owner · T3-B incidente/rollback/RTO · T4-A UX incertidumbre/citas/confirmación · T4-B a11y/corrección/apelación
- **hilo de caso:** entidad ficticia de **Moquegua** · `CASO-MOQ-051` — **Auditable AI Operations Copilot** y freeze **CF-5** (interfaces y artefactos congelados); stdlib + fixtures sintéticos; sin PII real ni backends externos

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~417–649), `weDo.steps[]` (24 ejercicios, ~651–1973) y `youDo` (~1976–2085) en `s51-integrator-final.ts`.
- Contrastado con theory T1–T4, learning outcomes y gate CP-N4-C + CF-5.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S51 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1–3 frases** (a veces bajo el rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + CASO-MOQ-051 + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera AI ops, **opaco** para newbie sin escena de on-call en Moquegua |
| We Do `feedback` | 1–2 frases; nombra el principio (bien); poco *por qué importa al auditor / al freeze CF-5 / al portfolio* |
| Starter `# DEFECT` | **Excelente** hábito en todos; defectos invertidos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con helpers de dominio **sólidos** y con CP-N4-C + CF-5 |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CF-5; **no** proponer cambios de output salvo notas puntuales de feedback |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado → E2 tabla PASS/breach/MISSING → E3 CONTINUE/breach/restore. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, verbos de acción fail-closed, fixtures sintéticos Moquegua, stdlib) es maduro y alinea S50 (evals/red team) → S51 (ops, registry, UX contestable). El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al copiloto de Moquegua, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (predicado → assess tres rutas → decide con rama de restore/cuarentena). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo del contrato”, E2 “separa válido/adverso/ausente”, E3 “enruta fail-closed en ops del copiloto”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Hilo de producto para el Fixer:** cada unidad debe anclarse a un eslabón del **Auditable AI Operations Copilot**: traza → métricas redactadas → bundle pinneado → change ticket → multi-SLI → incidente → UX → a11y. El learner debe sentir acumulación hacia CF-5, no 24 drills sueltos de booleanos.

---

## Unit ledger

### S51-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de traza como árbol padre/hijo (`prompt→retrieval→tool→answer`) con `trace_id` y cuarentena por PII. La `description` nombra el skill; falta `preamble` que diga *qué observar* (PASS con cuatro spans vs. `REDACT_AND_QUARANTINE_TRACE`) y `retrospective` del misconception “si los spans están, el email en el sink es un detalle”. El `why` es bueno pero corto.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de auditar un ticket del copiloto en Moquegua, el on-call debe **reconstruir** qué se citó y qué tool se llamó. En esta demo la traza `tr-moq-51` arma spans padre/hijo (prompt→retrieval→tool→answer) con citas `c1` y tool `get_case`. Observa el segundo print: con `pii=True` no hay “limpiar después del export” — la acción es cuarentena. No escribas aún; predice el dict PASS y el status de PII antes de mirar la salida.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el árbol de spans no es decoración — sin los cuatro nombres no hay auditoría de decisión. `trace_id` con prefijo `tr-` correlaciona; PII activa `REDACT_AND_QUARANTINE_TRACE` fail-closed. Orden: traza limpia antes del dashboard de tokens. Puente a We Do: reparar predicado invertido, tabla PASS/cuarentena/MISSING y decide CONTINUE/RESTORE.
- **Proposed retrospective:**  
  Si puedes explicar por qué un span de answer sin retrieval no es auditable, ya tienes el hábito de traza reconstruible. El error clásico es exportar PII “para depurar más rápido”. En We Do practicarás el predicado, las tres rutas y la rama cuando falta `pii_in_trace`.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T1-A (`PASS` + `REDACT_AND_QUARANTINE_TRACE`).

---

### S51-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter invierte `meets_contract` (aprueba traza vacía o con PII). Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback nombra el predicado pero no ancla “por qué el auditor de Moquegua lo exige antes del registry”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Traza limpia con cuatro spans y sin PII
- **Proposed preamble:**  
  - **Contexto:** en `CASO-MOQ-051-1A`, el on-call de la entidad ficticia de Moquegua solo acepta una traza si el `trace_id` correlaciona, hay cuatro spans y no hay PII en el sink.  
  - **Meta:** corregir `meets_contract` (`tr-` + spans completos + versiones pinneadas + `pii_in_trace is False`).  
  - **Éxito:** imprimes exactamente `S51-T1-A PASS` con el fixture válido.  
  - **Límites:** no borres el assert; no inventes spans; no toques los datos del fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` usa `not trace_id or pii_in_trace` (bug: aprueba basura).  
  2. Exige `trace_id.startswith("tr-")` y el conjunto `prompt/retrieval/tool/answer` ⊆ spans.  
  3. Añade `all(versions.values())` y `not pii_in_trace`.  
  4. Conserva el print `S51-T1-A` y el status PASS/REDACT_AND_QUARANTINE_TRACE.
- **Proposed feedback improvement:**  
  PASS exige correlación, cuatro spans, versiones y cero PII a la vez. Con PII la acción es cuarentena, no “limpiar después”. Invertir el booleano marca PASS justo cuando la traza es un incidente.
- **Proposed retrospective:**  
  Traza auditable = correlación + spans + sin PII exportable. El error clásico es celebrar “hay un answer span” y olvidar retrieval/tool. Siguiente (E2): tres rutas válido / adverso / missing `pii_in_trace`.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S51-T1-A PASS` correctos.

---

### S51-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: tres records (válido, PII/spans rotos, sin `pii_in_trace`). Starter invierte el predicado. Falta escena “missing ≠ breach” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de traza (PASS / cuarentena / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de observabilidad en Moquegua no trata igual una traza limpia, una con PII y una sin flag de privacidad.  
  - **Meta:** implementar `assess` que distinga PASS, REDACT_AND_QUARANTINE_TRACE y MISSING:pii_in_trace.  
  - **Éxito:** imprime `PASS REDACT_AND_QUARANTINE_TRACE MISSING:pii_in_trace` en ese orden.  
  - **Límites:** si falta `pii_in_trace`, no evalúes contenido; no inventes la clave; missing ≠ “cuarentena de PII”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: con campos presentes devuelve PASS si no hay `trace_id` o si hay PII (bug invertido).  
  2. Primero: calcula `missing` de required; si hay → `MISSING:…`.  
  3. Luego: `tr-` + cuatro spans + versiones + cero PII → PASS; si no → REDACT_AND_QUARANTINE_TRACE.  
  4. Imprime los tres resultados con `print(*results)`.
- **Proposed retrospective:**  
  Missing es incertidumbre de esquema; PII True o spans incompletos son breach de contenido. El error clásico es tratar “falta la clave de PII” como si ya hubiera email en el sink. Luego (E3) enrutas CONTINUE / cuarentena / RESTORE_TRACE_CONTEXT.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S51-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico con helpers `spans_complete` / `versions_pinned` y códigos de acción. Starter trata missing y predicado invertido como CONTINUE — defecto de promote silencioso. Falta preamble de “incertidumbre no es verde” y retrospective de reutilización en youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide traza: CONTINUE o RESTORE
- **Proposed preamble:**  
  - **Contexto:** en producción del copiloto de Moquegua, una traza incompleta no “sigue con warning”: o continúa limpia o se restaura el contexto.  
  - **Meta:** helpers + `decide` → CONTINUE (limpia), REDACT_AND_QUARANTINE_TRACE (adverso), RESTORE_TRACE_CONTEXT (sin `pii_in_trace`).  
  - **Éxito:** `CONTINUE REDACT_AND_QUARANTINE_TRACE RESTORE_TRACE_CONTEXT`.  
  - **Límites:** no inventes `pii_in_trace`; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige `spans_complete` (cuatro nombres, no `len==1`) y `versions_pinned` (todas no vacías y ≠ `latest`).  
  2. Missing → `RESTORE_TRACE_CONTEXT` (no CONTINUE).  
  3. Con record completo: `tr-` + helpers + no PII → CONTINUE; si no → REDACT_AND_QUARANTINE_TRACE.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Un campo ausente es restore, no un allow optimista. El error clásico es promover con “falta el flag de PII, igual se ve completo”. Pregunta: ¿por qué cuarentena no es lo mismo que RESTORE?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-A.

---

### S51-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: suma de tokens por etapa, costo = tokens/1000 × precio, p95 ≤ SLO y email redactado. Falta preamble de “dashboard que reconcilia” y retrospective del misconception “la media de latencia basta”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con la traza limpia, el dashboard miente si el total de tokens no cuadra o si exportas email. En esta demo 800+400+300 = 1500 tokens, costo 0.003 USD sintético, p95 900 ms ≤ SLO 1200 ms, y `ana@example.pe` sale como `[REDACTED]`. No escribas: predice total, costo, p95_ok y el export del email. Si confías solo en la media o dejas `prompt_raw` en el sink, el on-call de Moquegua no puede explicar el costo sin abrir un incidente de privacidad.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: p95 (no media) es lo que siente el usuario en los peores 5%; la suma por etapa es la prueba de reconciliación; redactar **antes** del export. Puente a We Do: predicado invertido, assess ALERT/MISSING y decide FIX_REDACTION_PIPELINE.
- **Proposed retrospective:**  
  Costo creíble = tokens reconciliados + percentil + sink limpio. El error clásico es promediar picos de latencia. We Do: predicado, tres rutas y helpers de compute.
- **Code/output changes:** none
- **Validation notes:** Output `1500 0.003 True [REDACTED]` alineado a theory T1-B.

---

### S51-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba total 0 o p95 > SLO (predicado al revés). Instruction densa; sin title/preamble/retrospective. Feedback nombra el principio sin escena de “por qué el on-call no promedia”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tokens reconciliados, p95 bajo SLO y redacción
- **Proposed preamble:**  
  - **Contexto:** en `CASO-MOQ-051-1B`, el dashboard del copiloto de Moquegua solo está sano si la suma por etapa cuadra, el p95 respeta el SLO y hay campos redactados.  
  - **Meta:** completar `meets_contract` (suma == total_tokens, p95 ≤ slo, redacted_fields ≥ 1).  
  - **Éxito:** `S51-T1-B PASS`.  
  - **Límites:** no cambies los contadores del fixture; no uses la media de latencia; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: PASS si total==0 o p95 > slo (bug).  
  2. Suma `prompt_tokens + retrieval_tokens + answer_tokens` y compárala con `total_tokens`.  
  3. Exige `p95_ms <= slo_ms` y `redacted_fields >= 1`.  
  4. Conserva print/status PASS/ALERT_COST_LATENCY.
- **Proposed feedback improvement:**  
  Un total que no cuadra o un p95 de 5 s con media baja es incidente de UX y costo, no “pico normal”. Sin al menos un campo redactado el export no es limpio.
- **Proposed retrospective:**  
  Dashboard sano = reconciliación + percentil + redacción. El error clásico es solo mirar el total bonito. Siguiente (E2): PASS / ALERT / MISSING:redacted_fields.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S51-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas sólidas; adverso con total 900, p95 5000 y redacted_fields 0. Falta preamble de missing≠breach y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de costo/latencia (PASS / ALERT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de métricas en Moquegua separa fila limpia, fila con costo/latencia rota y registro sin contador de redacción.  
  - **Meta:** `assess` → PASS, ALERT_COST_LATENCY, MISSING:redacted_fields.  
  - **Éxito:** `PASS ALERT_COST_LATENCY MISSING:redacted_fields`.  
  - **Límites:** sin `redacted_fields` no evalúes la suma; no rellenes el campo ausente.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si total==0 o p95 > slo (bug).  
  2. Primero missing de required.  
  3. Luego suma + p95 ≤ slo + redacted_fields ≥ 1.  
  4. Imprime la tripleta en orden.
- **Proposed retrospective:**  
  Missing de redacción es FIX_REDACTION_PIPELINE en E3, no ALERT. Un p95 alto con total descuadrado sigue siendo ALERT por contenido. Luego decides CONTINUE / ALERT / FIX.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto. Nota: feedback actual menciona `FIX_REDACTION_PIPELINE` pero la salida E2 es `MISSING:…` — el Fixer puede alinear el feedback a la salida exacta o dejar el puente a E3 explícito.

---

### S51-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer con `reconcile_tokens`, `estimate_cost_usd` y `export_clean`. Starter helpers invertidos y missing→CONTINUE. Falta cierre metacognitivo sobre costo = f(tokens, precio).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide costo: CONTINUE o FIX redacción
- **Proposed preamble:**  
  - **Contexto:** en ops del copiloto, un export incompleto no se “promueve con disclaimer”: o continúa limpio o se repara el pipeline de redacción.  
  - **Meta:** helpers de compute + `decide` → CONTINUE, ALERT_COST_LATENCY, FIX_REDACTION_PIPELINE.  
  - **Éxito:** `CONTINUE ALERT_COST_LATENCY FIX_REDACTION_PIPELINE` (costo válido 0.003).  
  - **Límites:** no inventes `redacted_fields`; no uses media de latencia; no toques fixtures.
- **Proposed instruction/description improvements:**  
  1. Implementa `reconcile_tokens` (suma por etapa == total).  
  2. `estimate_cost_usd` = round(total/1000 * 0.002, 6); `export_clean` = redacted_fields ≥ 1.  
  3. Missing → FIX_REDACTION_PIPELINE; con datos: helpers + p95_ok + cost ≥ 0 → CONTINUE.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Si el total miente, el costo miente. El error clásico es tratar missing de redacción como CONTINUE. Pregunta: ¿por qué p95 y no la media en el gate?
- **Code/output changes:** none
- **Validation notes:** Assert de costo 0.003 en solution; transfer real.

---

### S51-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de pin de release y rechazo de `latest`/mutable. Falta preamble de “sin pin no hay rollback” y retrospective del misconception “`latest` es más moderno”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con traza y dashboard listos, el registry fija **qué versión** generó la respuesta. En esta demo el bundle `copilot-7` (m2/p3/d5/i4/e2) pasa solo si es inmutable; `model=latest` y `immutable=False` emiten `FREEZE_RELEASE_BUNDLE`. No escribas: predice las tres salidas. Si dejas `latest` en prod del copiloto de Moquegua, el post mortem no puede reproducir la decisión.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: cada artefacto del bundle debe estar pinneado; el system card se enlaza al release, no a un tag móvil. Puente a We Do: predicado, assess FREEZE/MISSING y decide REGISTER_MISSING_VERSION.
- **Proposed retrospective:**  
  Release auditable = pin + inmutabilidad. El error clásico es confiar en `latest` “porque el CI lo actualiza”. We Do: predicado, tres rutas y helpers de pin.
- **Code/output changes:** none
- **Validation notes:** Output `PASS` / `FREEZE` / `FREEZE` alineado a theory T2-A.

---

### S51-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba mutable o `latest`. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Bundle pinneado e inmutable (sin latest)
- **Proposed preamble:**  
  - **Contexto:** en `CASO-MOQ-051-2A`, el equipo de Moquegua congela el release `copilot-7` solo si modelo/prompt/dataset/índice/evaluador están pinneados e inmutables.  
  - **Meta:** corregir `meets_contract` (seis claves ≠ vacío/`latest` y `immutable is True`).  
  - **Éxito:** `S51-T2-A PASS`.  
  - **Límites:** no aceptes `latest` “por conveniencia”; no borres el assert; no cambies IDs del fixture.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si not immutable o hay `latest` (bug).  
  2. Recorre release/model/prompt/dataset/index/evaluator: todos truthy y ≠ `latest`.  
  3. Exige `immutable is True`.  
  4. Conserva print PASS/FREEZE_RELEASE_BUNDLE.
- **Proposed feedback improvement:**  
  En prod cada artefacto va pinneado e inmutable. `latest` o mutable congela el release; sin pin no hay rollback ni system card auditable.
- **Proposed retrospective:**  
  Pin = reproducibilidad del post mortem. El error clásico es solo mirar el número de release y olvidar el modelo. Siguiente (E2): PASS / FREEZE / MISSING:immutable.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S51-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con adverso full-`latest`/mutable. Falta escena missing≠breach.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de registry (PASS / FREEZE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de registry en Moquegua separa bundle limpio, bundle con `latest`/mutable y registro sin flag `immutable`.  
  - **Meta:** `assess` → PASS, FREEZE_RELEASE_BUNDLE, MISSING:immutable.  
  - **Éxito:** `PASS FREEZE_RELEASE_BUNDLE MISSING:immutable`.  
  - **Límites:** sin `immutable` no evalúes pins; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Starter invierte el predicado de pin.  
  2. Primero missing de required.  
  3. Luego seis versiones pinneadas + immutable True.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  Falta de `immutable` es REGISTER_MISSING_VERSION en E3, no FREEZE. Bundle con `latest` es freeze por contenido. Luego decides CONTINUE / FREEZE / REGISTER.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto. Feedback E2 menciona `REGISTER_MISSING_VERSION` — anclarlo como puente a E3.

---

### S51-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Helpers `versions_pinned` / `bundle_immutable`; starter invertido y missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide registry: CONTINUE o FREEZE
- **Proposed preamble:**  
  - **Contexto:** en el freeze CF-5, un release incompleto no se promociona: se registra la versión faltante o se congela el bundle.  
  - **Meta:** helpers + `decide` → CONTINUE, FREEZE_RELEASE_BUNDLE, REGISTER_MISSING_VERSION.  
  - **Éxito:** `CONTINUE FREEZE_RELEASE_BUNDLE REGISTER_MISSING_VERSION`.  
  - **Límites:** no inventes `immutable`; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Corrige `versions_pinned` (all pinneados, no any latest).  
  2. `bundle_immutable` = `immutable is True` (no False).  
  3. Missing → REGISTER_MISSING_VERSION; ambos helpers True → CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Missing del flag no es lo mismo que bundle mutable: uno es incertidumbre de registro, el otro es breach de prod. Pregunta: ¿por qué el system card se enlaza al release pinneado y no a `latest`?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout “Prohibido latest en prod”.

---

### S51-T2-B-DEMO (iDo)
- **Diagnosis:** Demo clara de dual-control, scope `-read`, retención ≤30 y audit append-only. Falta preamble de segregación de funciones y retrospective del misconception “self-approve acelera el release”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El bundle `copilot-7` no se promueve solo: hace falta **quién escribió** y **quién aprobó**. En esta demo `dev-a` propone y `owner-b` aprueba con scope `ops-read`, 30 días de retención y audit append-only; self-approve + `global-admin` se rechaza. No escribas: predice PASS y REJECT. Si confundes “yo mismo lo apruebo” con gobernanza, el auditor de Moquegua no puede reconstruir el change.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: author ≠ approver; scope least-privilege termina en `-read`; retención acotada; audit no es un wiki editable. Puente a We Do: predicado, assess REJECT/MISSING y decide REQUEST_INDEPENDENT_APPROVAL.
- **Proposed retrospective:**  
  Dual-control = dos personas + política de acceso + rastro inmutable. El error clásico es autoaprobar “porque el owner está de vacaciones”. We Do: predicado, tres rutas y helpers SoD/policy.
- **Code/output changes:** none
- **Validation notes:** Output `PASS` / `REJECT_UNGOVERNED_CHANGE` alineado a theory T2-B.

---

### S51-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba self-approve o scope admin. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Dual-control con scope read y audit append-only
- **Proposed preamble:**  
  - **Contexto:** en `CASO-MOQ-051-2B`, el change ticket de Moquegua exige autor ≠ aprobador, risk válido, scope de lectura, retención ≤30 y audit append-only.  
  - **Meta:** corregir `meets_contract` con esas cinco anclas.  
  - **Éxito:** `S51-T2-B PASS`.  
  - **Límites:** no cambies author/approver del fixture; no “arregles” self-approve en silencio; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si author==approver o scope admin (bug).  
  2. Exige author ≠ approver y risk ∈ {low, medium, high}.  
  3. Scope `endswith("-read")`, retención ≤ 30, audit_append_only True.  
  4. Conserva print PASS/REJECT_UNGOVERNED_CHANGE.
- **Proposed feedback improvement:**  
  Self-approve o admin global son cambio no gobernado. Dual-control no es un formulario: es segregación de funciones con rastro append-only.
- **Proposed retrospective:**  
  Gobernanza operable = SoD + least privilege + TTL + audit. El error clásico es solo mirar “hay un aprobador” sin verificar que sea otra persona. Siguiente (E2): PASS / REJECT / MISSING:audit_append_only.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S51-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; adverso con self-approve, risk unknown, admin, retención 3650. Falta escena missing≠breach.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de change (PASS / REJECT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de change control en Moquegua separa ticket limpio, ticket no gobernado y registro sin flag de audit append-only.  
  - **Meta:** `assess` → PASS, REJECT_UNGOVERNED_CHANGE, MISSING:audit_append_only.  
  - **Éxito:** `PASS REJECT_UNGOVERNED_CHANGE MISSING:audit_append_only`.  
  - **Límites:** sin `audit_append_only` no evalúes SoD; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Starter invierte dual-control.  
  2. Primero missing.  
  3. Luego SoD + risk + scope read + retención + audit.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  Falta de audit es REQUEST_INDEPENDENT_APPROVAL en E3, no REJECT. Self-approve sigue siendo REJECT por contenido. Luego decides CONTINUE / REJECT / REQUEST.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S51-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Helpers `sod_ok` / `access_policy_ok`; starter invertido y missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide change: CONTINUE o pedir aprobación
- **Proposed preamble:**  
  - **Contexto:** en CF-5, un change incompleto no se “aprueba con disclaimer”: se pide aprobación independiente o se rechaza.  
  - **Meta:** helpers + `decide` → CONTINUE, REJECT_UNGOVERNED_CHANGE, REQUEST_INDEPENDENT_APPROVAL.  
  - **Éxito:** `CONTINUE REJECT_UNGOVERNED_CHANGE REQUEST_INDEPENDENT_APPROVAL`.  
  - **Límites:** no inventes `audit_append_only`; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. `sod_ok`: author ≠ approver y risk válido.  
  2. `access_policy_ok`: scope `-read`, retención ≤30, audit True.  
  3. Missing → REQUEST_INDEPENDENT_APPROVAL; ambos True → CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  SoD y policy son dos puertas: fallar una ya es rechazo. Missing de audit no es lo mismo que self-approve. Pregunta: ¿por qué retención eterna de PII en audit no es “más seguro”?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout self-approve.

---

### S51-T3-A-DEMO (iDo)
- **Diagnosis:** Demo multi-SLI + error budget burn 0.2 + owner. Falta preamble de “owner antes de reentrenar” y retrospective del misconception “thumbs-down = reentrenar ya”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con release pinneado, el copiloto se mide en **varios SLI**, no solo uptime. En esta demo availability 0.999, faithfulness 0.93 y drift 0.04 con owner `ai-oncall` pasan; faithfulness 0.4 abre `OPEN_COPILOT_INCIDENT`; el burn del error budget es 0.2 en ventana 100. No escribas: predice PASS, burn e incidente. Si reentrenas por un spike de feedback sin dueño del slice, quemas presupuesto sin runbook en Moquegua.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: multi-SLI (disponibilidad + calidad + drift); error budget cuantifica margen; sin owner no hay acción. Puente a We Do: predicado, assess OPEN/MISSING y decide TRIAGE_DRIFT_SLICE.
- **Proposed retrospective:**  
  Señal accionable = SLI + umbral + owner. El error clásico es reentrenar por thumbs-down sin slice ni baseline. We Do: predicado, tres rutas y burn.
- **Code/output changes:** none
- **Validation notes:** Output `PASS burn 0.2` / `OPEN_COPILOT_INCIDENT` alineado a theory T3-A.

---

### S51-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba availability bajo SLO o drift alto. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Multi-SLI con owner antes de reentrenar
- **Proposed preamble:**  
  - **Contexto:** en `CASO-MOQ-051-3A`, el slice de Moquegua solo está verde si availability/faithfulness/drift cumplen umbral y hay owner del runbook.  
  - **Meta:** corregir `meets_contract` (tres SLI + owner no vacío).  
  - **Éxito:** `S51-T3-A PASS`.  
  - **Límites:** no inventes owner; no “promedies” faithfulness; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si availability < slo o drift > max (bug).  
  2. Exige availability ≥ slo, faithfulness ≥ slo, drift ≤ max.  
  3. Añade `bool(owner)`.  
  4. Conserva print PASS/OPEN_COPILOT_INCIDENT.
- **Proposed feedback improvement:**  
  Multi-SLI + owner es el mínimo antes de reentrenar. SLI roto abre incidente; owner vacío es triage del slice, no un responsable inventado.
- **Proposed retrospective:**  
  Un solo float de uptime no basta para un copiloto. El error clásico es ignorar faithfulness. Siguiente (E2): PASS / OPEN / MISSING:owner.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S51-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; adverso con SLI rotos y owner vacío. Falta escena missing≠breach (clave ausente vs. owner vacío en contenido).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de SLO (PASS / OPEN / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de SLO en Moquegua separa slice sano, slice en incidente y registro sin clave `owner`.  
  - **Meta:** `assess` → PASS, OPEN_COPILOT_INCIDENT, MISSING:owner.  
  - **Éxito:** `PASS OPEN_COPILOT_INCIDENT MISSING:owner`.  
  - **Límites:** sin clave `owner` no evalúes SLI; owner vacío en el adverso es breach de contenido (no MISSING).
- **Proposed instruction/description improvements:**  
  1. Starter invierte comparaciones de SLI.  
  2. Primero missing de required.  
  3. Luego multi-SLI + bool(owner).  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  Falta de clave `owner` es TRIAGE en E3; owner vacío con SLI rotos es OPEN. No mezcles las dos rutas. Luego decides CONTINUE / OPEN / TRIAGE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto. Feedback E2 ya distingue bien TRIAGE vs OPEN — mantener al alinear preamble.

---

### S51-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Helpers `sli_ok` + `error_budget_burn`; starter missing→CONTINUE e sli invertido. Falta cierre sobre burn finito.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide SLO: CONTINUE o TRIAGE del slice
- **Proposed preamble:**  
  - **Contexto:** en ops del copiloto, un slice sin dueño no se “optimiza en silencio”: se triajea o se abre incidente.  
  - **Meta:** `sli_ok` + burn + `decide` → CONTINUE, OPEN_COPILOT_INCIDENT, TRIAGE_DRIFT_SLICE.  
  - **Éxito:** `CONTINUE OPEN_COPILOT_INCIDENT TRIAGE_DRIFT_SLICE` (burn válido 0.2).  
  - **Límites:** no inventes owner; no ignores faithfulness; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Implementa `error_budget_burn` (errors/allowed en ventana 100).  
  2. `sli_ok`: availability, faithfulness y drift vs. umbrales.  
  3. Missing de owner → TRIAGE_DRIFT_SLICE; sli_ok + owner + burn finito → CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Error budget cuantifica margen; owner hace la alerta accionable. El error clásico es reentrenar sin runbook. Pregunta: ¿por qué un burn de 0.2 aún no es “quemar el presupuesto”?
- **Code/output changes:** none
- **Validation notes:** Assert burn 0.2 en solution; transfer real.

---

### S51-T3-B-DEMO (iDo)
- **Diagnosis:** Demo de contención → rollback a `copilot-6` dentro de RTO → post mortem con dueños. Falta preamble del orden de IR y retrospective del misconception “primero debatir la causa raíz”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando el multi-SLI rompe el presupuesto (o entra `latest`), el orden es **contener → rollback → comunicar → post mortem blameless**. En esta demo el simulacro de Moquegua revierte a `copilot-6` en 7 min (RTO 10), con 4 acciones y owners; sin contención o con 90 min falla a `ROLLBACK_AND_CONTAIN`. No escribas: predice PASS y la acción de fallo. Si debates la causa en prod sin congelar el release, el RTO se quema.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: last-good pinneado del registry; reloj ≤ RTO; dueños de acciones; sin owners → CONVENE. Puente a We Do: predicado, assess ROLLBACK/MISSING y decide CONVENE_INCIDENT_REVIEW.
- **Proposed retrospective:**  
  IR de IA = timeline con reloj y dueños, no un chat de culpas. El error clásico es “seguir investigando en prod”. We Do: predicado, tres rutas y helpers RTO/IR.
- **Code/output changes:** none
- **Validation notes:** Output `PASS` / `ROLLBACK_AND_CONTAIN` alineado a theory T3-B.

---

### S51-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba sin contención o fuera de RTO. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contención, rollback en RTO y dueños del post mortem
- **Proposed preamble:**  
  - **Contexto:** en `CASO-MOQ-051-3B`, el simulacro de incidente del copiloto de Moquegua exige contención, pin last-good, reloj ≤ RTO, ≥1 acción y owners.  
  - **Meta:** corregir `meets_contract` con esas anclas.  
  - **Éxito:** `S51-T3-B PASS`.  
  - **Límites:** no alargues el RTO “a mano”; no borres owners del fixture; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si not contained o minutos > RTO (bug).  
  2. Exige contained True y `rolled_back_to.startswith("copilot-")`.  
  3. Minutos ≤ RTO, postmortem_actions ≥ 1, owners_assigned True.  
  4. Conserva print PASS/ROLLBACK_AND_CONTAIN.
- **Proposed feedback improvement:**  
  El gate de incidente exige contención, pin last-good, reloj ≤ RTO y dueños del post mortem; sin owners la ruta es CONVENE, no un PASS improvisado.
- **Proposed retrospective:**  
  Contener primero, explicar después. El error clásico es post mortem sin contención. Siguiente (E2): PASS / ROLLBACK / MISSING:owners_assigned.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S51-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; adverso sin contención, pin vacío, 90 min, 0 acciones. Falta escena missing≠breach.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de incidente (PASS / ROLLBACK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de IR en Moquegua separa simulacro listo, respuesta incompleta y registro sin flag de owners.  
  - **Meta:** `assess` → PASS, ROLLBACK_AND_CONTAIN, MISSING:owners_assigned.  
  - **Éxito:** `PASS ROLLBACK_AND_CONTAIN MISSING:owners_assigned`.  
  - **Límites:** sin `owners_assigned` no evalúes RTO; no inventes dueños.
- **Proposed instruction/description improvements:**  
  1. Starter invierte contención/RTO.  
  2. Primero missing.  
  3. Luego contained + pin + RTO + acciones + owners.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  Falta de owners es CONVENE en E3; sin contención es ROLLBACK. El post mortem no sustituye la contención inmediata. Luego decides CONTINUE / ROLLBACK / CONVENE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S51-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Helpers `within_rto` / `ir_complete`; starter invertido y missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide IR: CONTINUE o convocar revisión
- **Proposed preamble:**  
  - **Contexto:** en CF-5, un incidente sin dueños no se cierra con un print: se convoca revisión o se fuerza contención.  
  - **Meta:** helpers + `decide` → CONTINUE, ROLLBACK_AND_CONTAIN, CONVENE_INCIDENT_REVIEW.  
  - **Éxito:** `CONTINUE ROLLBACK_AND_CONTAIN CONVENE_INCIDENT_REVIEW`.  
  - **Límites:** no inventes owners; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. `within_rto`: minutos ≤ RTO y pin `copilot-*`.  
  2. `ir_complete`: contained + ≥1 acción + owners True.  
  3. Missing → CONVENE_INCIDENT_REVIEW; ambos True → CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  RTO mide el reloj del rollback; IR complete mide contención y aprendizaje. Missing de owners no es lo mismo que rollback lento. Pregunta: ¿por qué el post mortem blameless nombra condiciones sistémicas y no “el on-call falló”?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout “Contener antes de debatir”.

---

### S51-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de incertidumbre + citas + resumen de efecto + confirmación. Falta preamble de “side-effect sin confirmación = dark pattern” y retrospective del misconception “auto-ejecutar tools es productividad”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La ops interna no basta: el usuario ve la **UX** del copiloto. En esta demo el borrador de Moquegua muestra incertidumbre, citas resolubles y el resumen «prepara borrador»; sin `confirmed` se bloquea con `BLOCK_UNCONFIRMED_ACTION`. No escribas: predice PASS y el bloqueo. Si ocultas “no sé” o escribes a producción sin confirmación, no hay contestabilidad aunque el modelo sea bueno.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: incertidumbre visible; citas al doc fuente (mismas del span retrieval); effect_summary antes del side-effect; confirmación humana cuando se exige. Puente a We Do: predicado, assess BLOCK/MISSING y decide ASK_USER_TO_CONFIRM.
- **Proposed retrospective:**  
  UX contestable = evidencia visible + efecto explícito + OK humano. El error clásico es auto-ejecutar tools de escritura. We Do: predicado, tres rutas y helpers de evidencia/confirmación.
- **Code/output changes:** none
- **Validation notes:** Output `PASS` / `BLOCK_UNCONFIRMED_ACTION` alineado a theory T4-A.

---

### S51-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba sin incertidumbre/citas/confirmación. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Incertidumbre, citas y confirmación del efecto
- **Proposed preamble:**  
  - **Contexto:** en `CASO-MOQ-051-4A`, el copiloto de Moquegua solo habilita la tool de escritura si muestra incertidumbre, citas, resumen del efecto y confirmación humana.  
  - **Meta:** corregir `meets_contract` (evidence + confirmación condicional).  
  - **Éxito:** `S51-T4-A PASS`.  
  - **Límites:** no inventes `confirmed`; no vacíes `effect_summary`; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si falta incertidumbre/citas/confirmed (bug).  
  2. Exige uncertainty_shown, citations_resolve y effect_summary truthy.  
  3. Si confirmation_required, exige confirmed.  
  4. Conserva print PASS/BLOCK_UNCONFIRMED_ACTION.
- **Proposed feedback improvement:**  
  Incertidumbre + citas + resumen del efecto van antes del side-effect. Si se exige confirmación y no hay `confirmed`, bloqueas la acción irreversible.
- **Proposed retrospective:**  
  “Prepara borrador” no es lo mismo que “envía a producción”: el resumen del efecto es el contrato con el usuario. Siguiente (E2): PASS / BLOCK / MISSING:confirmed.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S51-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; adverso sin evidencia ni confirmación. Falta escena missing≠breach.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de UX (PASS / BLOCK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de UX en Moquegua separa respuesta listable, acción bloqueada y registro sin clave `confirmed`.  
  - **Meta:** `assess` → PASS, BLOCK_UNCONFIRMED_ACTION, MISSING:confirmed.  
  - **Éxito:** `PASS BLOCK_UNCONFIRMED_ACTION MISSING:confirmed`.  
  - **Límites:** sin `confirmed` no evalúes el resto; no inventes la clave.
- **Proposed instruction/description improvements:**  
  1. Starter invierte uncertainty/citations/confirmed.  
  2. Primero missing.  
  3. Luego evidence + confirmación condicional.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  Clave `confirmed` ausente es ASK_USER_TO_CONFIRM en E3; confirmed False con side-effect es BLOCK. No mezcles incertidumbre de schema con rechazo de contenido. Luego decides CONTINUE / BLOCK / ASK.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto. Feedback E2 ya nombra ASK vs BLOCK — mantener.

---

### S51-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Helpers `evidence_visible` / `effect_confirmed`; starter invertido y missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide UX: CONTINUE o pedir confirmación
- **Proposed preamble:**  
  - **Contexto:** en CF-5, un side-effect sin evidencia visible no se “manda con warning”: se pide confirmación o se bloquea.  
  - **Meta:** helpers + `decide` → CONTINUE, BLOCK_UNCONFIRMED_ACTION, ASK_USER_TO_CONFIRM.  
  - **Éxito:** `CONTINUE BLOCK_UNCONFIRMED_ACTION ASK_USER_TO_CONFIRM`.  
  - **Límites:** no inventes `confirmed`; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. `evidence_visible`: incertidumbre + citas + effect_summary.  
  2. `effect_confirmed`: not required or confirmed is True.  
  3. Missing → ASK_USER_TO_CONFIRM; ambos True → CONTINUE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Evidencia es lo que el usuario ve; confirmación es el control del irreversible. Missing no es lo mismo que “el usuario dijo no”. Pregunta: ¿por qué el effect_summary debe quedar también en el audit trail de T2?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout side-effect.

---

### S51-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de contraste AA, teclado, labels, corrección y apelación. Falta preamble de “panel bonito no es CF-5” y retrospective del misconception “a11y es cosmético”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La confirmación de T4-A no basta si el panel es solo-mouse o ilegible. En esta demo contraste 5.1 (≥4.5), teclado, labels, corrección y `appeal_to_human` pasan; contraste 2.1 sin appeal falla `FAIL_ACCESSIBILITY_GATE`. No escribas: predice PASS y el fallo. Si el usuario de Moquegua no puede apelar sin mouse, CF-5 no se cierra aunque el copilot “se vea pro”.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: WCAG 2.2 AA (teclado, labels, contraste ≥4.5); corrección del dato fuente; apelación humana con SLA. Puente a We Do: predicado, assess FAIL/MISSING y decide ROUTE_CONTESTATION.
- **Proposed retrospective:**  
  Contestabilidad completa = a11y + corrección + humano. El error clásico es un banner de disclaimer sin teclado. We Do: predicado, tres rutas y helper WCAG.
- **Code/output changes:** none
- **Validation notes:** Output `PASS` / `FAIL_ACCESSIBILITY_GATE` alineado a theory T4-B.

---

### S51-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba solo-mouse o contraste bajo. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** WCAG AA con corrección y apelación humana
- **Proposed preamble:**  
  - **Contexto:** en `CASO-MOQ-051-4B`, el panel del copiloto de Moquegua solo cierra CF-5 si es operable por teclado, legible (contraste AA), con corrección y apelación a humano.  
  - **Meta:** corregir `meets_contract` (teclado + labels + contraste ≥ min + corrección + appeal).  
  - **Éxito:** `S51-T4-B PASS`.  
  - **Límites:** no uses igualdad exacta de contraste; no borres appeal del fixture; no borres el assert.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si not keyboard o contraste < min o not appeal (bug).  
  2. Exige keyboard_complete y screen_reader_labels.  
  3. `contrast_ratio >= min_contrast`, correction_available y appeal_to_human.  
  4. Conserva print PASS/FAIL_ACCESSIBILITY_GATE.
- **Proposed feedback improvement:**  
  WCAG AA + corrección + apelación humana cierran CF-5. Un panel solo-mouse o ilegible falla el gate aunque “se vea bonito”.
- **Proposed retrospective:**  
  Accesibilidad es gate de producto, no polish final. El error clásico es solo medir contraste y olvidar el teclado. Siguiente (E2): PASS / FAIL / MISSING:appeal_to_human.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S51-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas; adverso solo-mouse, contraste 2.1, sin corrección/appeal. Falta escena missing≠breach.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de a11y (PASS / FAIL / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el gate de a11y en Moquegua separa panel completable, panel no accesible y registro sin ruta de apelación humana.  
  - **Meta:** `assess` → PASS, FAIL_ACCESSIBILITY_GATE, MISSING:appeal_to_human.  
  - **Éxito:** `PASS FAIL_ACCESSIBILITY_GATE MISSING:appeal_to_human`.  
  - **Límites:** sin `appeal_to_human` no evalúes contraste; no inventes la clave.
- **Proposed instruction/description improvements:**  
  1. Starter invierte keyboard/contraste/appeal.  
  2. Primero missing.  
  3. Luego teclado + labels + contraste ≥ min + corrección + appeal.  
  4. Imprime la tripleta.
- **Proposed retrospective:**  
  Falta de appeal es ROUTE_CONTESTATION en E3; contraste bajo es FAIL. No promociones un panel “bonito” que el usuario no puede operar. Luego decides CONTINUE / FAIL / ROUTE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S51-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Helper `meets_wcag_aa`; starter contraste invertido, ignora labels/corrección, missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide a11y: CONTINUE o enrutar contestación
- **Proposed preamble:**  
  - **Contexto:** en el cierre de CF-5, un panel sin ruta humana no se “aprueba con disclaimer”: se enruta a contestación o se falla el gate.  
  - **Meta:** `meets_wcag_aa` + `decide` → CONTINUE, FAIL_ACCESSIBILITY_GATE, ROUTE_CONTESTATION.  
  - **Éxito:** `CONTINUE FAIL_ACCESSIBILITY_GATE ROUTE_CONTESTATION`.  
  - **Límites:** no inventes appeal; compara contraste con `>=`, no con igualdad exacta; no conviertas missing en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Implementa `meets_wcag_aa` con las cinco anclas (teclado, labels, contraste, corrección, appeal).  
  2. Missing → ROUTE_CONTESTATION.  
  3. Helper True → CONTINUE; si no → FAIL_ACCESSIBILITY_GATE.  
  4. Imprime los tres códigos.
- **Proposed retrospective:**  
  Sin appeal no hay contestabilidad completa aunque el contraste sea 5.1. El error clásico es inventar un humano en el if. Pregunta: ¿cómo enlazas la apelación al `trace_id` y al release pinneado del system card?
- **Code/output changes:** none
- **Validation notes:** Transfer real; cierra el hilo T1→T4 del producto.

---

### youDo (portafolio CF-5)
- **Diagnosis:** Marco de proyecto **sólido**: context, objectives, requirements, rubric, portfolioNote y starter con helpers de dominio (`traces_redacted_ok`, `registry_changelog_ok`, `slo_incident_ok`, `ux_contestability_a11y_ok`) que ensamblan T1–T4. El checklist inicia BLOCKED a propósito con dicts vacíos — excelente anti-trampa. Falta `retrospective` metacognitiva de defensa del portfolio (qué invariante demuestras, PII vs sintético, frase de impacto).
- **Checklist:** context pass · goal pass · success pass (READY + missing) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) Portafolio CF-5: Observabilidad, gobernanza y UX del copiloto
- **Proposed preamble:** N/A — el `context` ya cubre escena, entrada/salida y bloqueos; no duplicar en un segundo ensayo. Opcional: una viñeta corta al final del context si el Fixer quiere reforzar “dict vacío = BLOCKED por diseño”.
- **Proposed instruction/description improvements:**  
  Mantener requirements y starter. Asegurar en portfolioNote (si se toca) que el learner **no** asigne `True` a mano y que las tres rutas (normal / breach ROLLBACK_AND_CONTAIN / incertidumbre CONVENE o ASK) queden en evidencia reproducible.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿puedes reconstruir con un solo `trace_id` qué se citó, qué tool se llamó, qué release pinneado respondió y quién aprobó? (2) ¿qué harías distinto con logs reales vs. fixtures de Moquegua (PII, retención, dual-control)? (3) Escribe en el README una frase de impacto medible (antes/después: p. ej. “export sin redacción → cuarentena; con pin + RTO se revierte en ≤10 min”) que puedas defender en 30 segundos ante un revisor de plataforma.
- **Code/output changes:** none (starter BLOCKED por diseño es intencional)
- **Validation notes:** Rubric y helpers alineados a CP-N4-C + CF-5; no proponer reescritura del starter en esta ronda.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective)
1. **S51-T1-A-E1, E2, E3** — traza / PII / RESTORE  
2. **S51-T1-B-E1, E2, E3** — tokens / p95 / redacción / FIX  
3. **S51-T2-A-E1, E2, E3** — registry pin / FREEZE / REGISTER  
4. **S51-T2-B-E1, E2, E3** — dual-control / REJECT / REQUEST  
5. **S51-T3-A-E1, E2, E3** — multi-SLI / OPEN / TRIAGE  
6. **S51-T3-B-E1, E2, E3** — IR / ROLLBACK / CONVENE  
7. **S51-T4-A-E1, E2, E3** — UX / BLOCK / ASK  
8. **S51-T4-B-E1, E2, E3** — a11y / FAIL / ROUTE  

### P1 (I Do preamble + retrospective; youDo retrospective; why a rango)
- Las 8 demos **S51-T\*-DEMO**  
- **youDo** retrospective de defensa  
- Ampliar `why` donde quede en 1 frase corta  

### P2 (polish)
- Feedback We Do: 25–60 palabras con *por qué importa al auditor / CF-5 / portfolio* (varias ya nombran el principio; añadir ancla de rol)  
- Alinear feedback E2 que menciona verbos de E3 (`FIX_…`, `REGISTER_…`, `TRIAGE_…`, `ASK_…`) con frase explícita “en E3 la acción de restore será…” si se mantiene el puente  
- Hints E1: mantener guided; evitar spoiler completo de la expresión final si el Fixer reescribe  

---

## Residual risks

1. **Prosa densa residual:** si el Fixer solo pega preambles sin recortar `instruction` a pasos, el learner sigue leyendo un muro. Instruction debe quedar **solo-tarea** (40–100 palabras).  
2. **Homogeneidad E1/E2/E3:** el código ya hace fade real; el riesgo es preambles clonados entre subtemas. Cada subtema debe nombrar su artefacto del copiloto (traza, costo, pin, SoD, SLI, IR, UX, a11y).  
3. **Vocabulario de acciones:** la sección usa muchos verbos fail-closed; el Fixer no debe renombrar outputs (`REDACT_AND_QUARANTINE_TRACE`, `FREEZE_RELEASE_BUNDLE`, etc.) — solo envolver pedagogía alrededor.  
4. **Master-level vs. newbie:** S51 es Master; igual el spec exige escena y éxito observable para quien no vive on-call de IA. No diluir el rigor técnico; sí hacer explícito el *por qué* operativo.  
5. **You Do anti-trampa:** no “arreglar” el starter BLOCKED con dicts pre-rellenos; eso rompería el diseño del portfolio.  
6. **Acumulación CF-5:** sin preambles de puente (“con la traza de T1…”), el youDo se siente desconectado de 24 drills. Los preambles propuestos ya anclan eslabones; el Fixer debe preservarlos.  
7. **PII sintético:** mantener `example.pe` / sin PII real en cualquier prosa nueva; no inventar emails reales de personas.

---

## Fixer acceptance hints (no implementar en Round 1)

- [ ] Cada iDo no trivial: `preamble` + `retrospective`  
- [ ] Cada weDo: `title` + `preamble` + `instruction` solo pasos + `retrospective`  
- [ ] youDo: `retrospective` de defensa  
- [ ] Outputs exactos preservados  
- [ ] Español PE; fixtures `CASO-MOQ-051`; sin PII real  
- [ ] Sin generadores ni copy-paste mecánico  
- [ ] Section compila en static build  

---

Section 51 exercise pedagogy review complete. Ready for the Fixer prompt.
