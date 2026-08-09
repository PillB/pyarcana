# S52 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Enterprise Relationship & Operations Intelligence Platform: capstone final
- **shortTitle:** Capstone FINAL
- **id:** `career-strategy` (archivo `s52-career-strategy.ts`; el **contenido** es CP-FINAL de plataforma multi-región defendible — no “estrategia de carrera” genérica de soft skills)
- **index:** 52
- **source:** `src/lib/course/sections/s52-career-strategy.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S52-T1-A CF-1 revalidación · T1-B constraints/riesgos/no-go · T2-A bounded contexts/API/eventos · T2-B HITL (ER→triage→RPA→RAG→humano) · T3-A seis capas + cero P0/P1 · T3-B SLO/RPO/RTO + disaster drill · T4-A demo/CV con contribución personal · T4-B evidence bundle de 8
- **hilo de caso:** plataforma nacional sintética **CASO-PER-052** (Lima, Arequipa, Cusco, Piura) — gate **CP-FINAL** (52/52 + 12/12 + CP-FINAL + regresión S1–S52, cero P0/P1, **sin compensar** CP-N4-C); **missing ≠ breach**; stdlib + fixtures sintéticos; sin PII real ni autofraude

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~319–515), `weDo.steps[]` (24 ejercicios, ~517–1673) y `youDo` (~1675–1844) en `s52-career-strategy.ts`.
- Contrastado con theory T1–T4, learning outcomes, `section_contract` y gate de promoción máster.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S52 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill y el caso; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1 frase** (bajo el rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera gates de plataforma, **opaco** para quien llega al cierre sin escena de revisor externo multi-región |
| We Do `feedback` | 1–3 frases; nombra códigos de acción y campos (bien); poco *por qué importa al revisor de graduación / al portfolio de entrevista / a no compensar CP-N4-C* |
| Starter `# DEFECT` | **Excelente** hábito en todos; predicados invertidos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la regla casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **muy sólidos** (readiness BLOCKED a propósito, BUNDLE_8, curriculum_gate, drill con reloj) |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-FINAL; **no** proponer cambios de output salvo notas puntuales |
| Fade E1→E2→E3 (código) | **Excelente y real:** E1 repara predicado de dominio → E2 tabla PASS/breach/MISSING → E3 CONTINUE/breach/rama de incertidumbre. **No** son tres clones de prosa distinta sobre el mismo bug sin capas |

**Patrón dominante:** el andamiaje de *código* (bugs invertidos, missing≠breach, códigos de acción por subtema, fixtures `CASO-PER-052-*`, stdlib, no-go ético, HITL, RPO/RTO medidos, bundle de 8) es maduro y alineado al cierre del currículo. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al revisor que no conoce mi laptop, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión auténtica en los 8 subtemas (predicado → assess tres rutas → decide fail-closed con código de acción). El fade de *prosa* no se ve porque no hay preambles diferenciados: el Fixer debe escribir E1 “arregla el cuerpo del predicado”, E2 “separa válido/adverso/ausente”, E3 “enruta CONTINUE / breach / incertidumbre sin convertir missing en éxito”.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

**Nota de naming interno:** el `id` del section es `career-strategy` y el archivo se llama `s52-career-strategy.ts`, pero el título y el contenido son CP-FINAL de plataforma de relación y operaciones. No es defecto de ejercicio; el Fixer no debe “arreglar” el id en esta ronda salvo que el orchestrator lo pida. El learner ve el título correcto en UI. “Carrera” aquí significa **portfolio técnico defendible**, no soft skills genéricos.

---

## Unit ledger

### S52-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de delta de métricas (`latency` retirada, `review_precision` añadida) y predicado CF-1 (ops+relationship+privacy, jobs≥3, ttr+review_precision, baseline_frozen). La `description` nombra el skill; falta `preamble` que diga *qué observar* (delta vs. valid PASS vs. adverse REOPEN_CF1) y `retrospective` del misconception “la matriz de S01 sigue válida sin change_log”. El `why` es una frase corta.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de cablear la plataforma final multi-región, el portfolio debe defender **esta** versión de stakeholders, jobs y métricas — no la de S01. En esta demo un fixture sintético `CASO-PER-052` calcula el delta (`latency` se retira, entra `review_precision`) y el predicado CF-1. No escribas aún: predice `PASS` para el válido y `REOPEN_CF1` para el que solo tiene `ops` y jobs=0. Si reutilizas la matriz vieja sin baseline congelado, el revisor de graduación ve un producto fantasma.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `cf1_delta` hace visible el change_log; `revalidate` exige el conjunto mínimo de stakeholders y métricas con `baseline_frozen`. El adverso no es “casi listo”: fuerza reabrir CF-1. Orden: matriz viva antes de firmar no-go. Puente a We Do: reparar el predicado invertido (PASS si jobs==0), tabla PASS/REOPEN/MISSING y decide INTERVIEW_STAKEHOLDER.
- **Proposed retrospective:**  
  Si puedes explicar por qué un fixture solo con `ops` y jobs=0 reabre CF-1 sin mirar el print, ya tienes el hábito de matriz viva. El error clásico es tratar el baseline de S01 como eterno. En We Do practicarás el predicado, las tres rutas y la rama de incertidumbre sin `baseline_frozen`.
- **Code/output changes:** none
- **Validation notes:** Output `delta {'retired': ['latency'], 'added': ['review_precision']}` / `valid PASS` / `adverse REOPEN_CF1` alineado a theory T1-A.

---

### S52-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter aprueba si `jobs==0` o baseline no frozen (predicado invertido). Instruction densa mezcla ID, meta, defect y print; sin title, preamble ni retrospective. Feedback nombra stakeholders y métricas pero no ancla “por qué el revisor multi-región exige change_log antes del no-go”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Revalidar CF-1 con baseline congelado
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PER-052-1A`, ops, relationship y privacy deben estar en la matriz viva; el baseline sintético de TTR y review_precision está congelado.  
  - **Meta:** corregir `meets_contract` (stakeholders mínimos + jobs≥3 + métricas + `baseline_frozen`).  
  - **Éxito:** imprimes exactamente `S52-T1-A PASS` con el fixture válido.  
  - **Límites:** no borres el assert; no inventes stakeholders; no toques los datos del fixture; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` aprueba si jobs==0 o baseline no frozen (bug).  
  2. Exige `{"ops","relationship","privacy"} <= stakeholders`, `jobs >= 3`, `{"ttr","review_precision"} <= metrics` y `baseline_frozen`.  
  3. Conserva el print `S52-T1-A` y el status PASS/REOPEN_CF1.  
  4. No rellenes campos ni mutes el record.
- **Proposed feedback improvement:**  
  El predicado exige ops+relationship+privacy, jobs≥3, ttr+review_precision y baseline_frozen. Sin delta ni baseline, el portfolio defiende un producto fantasma (`REOPEN_CF1`). Si el schema no trae `baseline_frozen`, no improvises: en E3 verás `INTERVIEW_STAKEHOLDER`.
- **Proposed retrospective:**  
  CF-1 vivo = matriz + baseline congelado, no nostalgia de S01. El error clásico es invertir el predicado y “aprobar” lo incompleto. Siguiente (E2): tres rutas PASS / REOPEN_CF1 / MISSING:baseline_frozen.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S52-T1-A PASS` correctos.

---

### S52-T1-A-E2 (weDo, independent)
- **Diagnosis:** Excelente capa independent: válido (matriz completa), adverso (solo ops, jobs=0), sin `baseline_frozen`. Starter reusa el predicado invertido. Falta escena “missing ≠ breach” en preamble y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de CF-1 (PASS / REOPEN / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de CF-1 en la plataforma multi-región no trata igual una matriz limpia, una incompleta de contenido y una sin campo de baseline.  
  - **Meta:** implementar `assess` que distinga PASS, REOPEN_CF1 y MISSING:baseline_frozen.  
  - **Éxito:** imprime `PASS REOPEN_CF1 MISSING:baseline_frozen` en ese orden.  
  - **Límites:** si falta `baseline_frozen`, no evalúes el contenido; no inventes el campo; missing ≠ “aceptar”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: assess aprueba con jobs==0 (mismo defecto de E1).  
  2. Primero: campos required; si falta `baseline_frozen` → `MISSING:baseline_frozen`.  
  3. Luego: predicado de stakeholders/jobs/métricas/baseline → PASS o REOPEN_CF1.  
  4. Imprime los tres resultados con `print(*results)`.
- **Proposed retrospective:**  
  Missing es incertidumbre de schema; matriz vacía o jobs=0 es breach de CF-1. El error clásico es rankear contenido sin el campo. Luego (E3) enrutas CONTINUE / REOPEN_CF1 / INTERVIEW_STAKEHOLDER.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade real respecto de E1.

---

### S52-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a códigos de acción de pipeline. Starter trata missing como CONTINUE y aprueba el adverso — defecto de promote silencioso. Falta preamble de “producción fail-closed” y retrospective de reutilización en youDo (change_log + entrevista a stakeholder).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide CF-1: CONTINUE o INTERVIEW
- **Proposed preamble:**  
  - **Contexto:** el gate de ensamblaje decide si CF-1 **sigue** o se detiene: no hay “continuar con warning de baseline”.  
  - **Meta:** `decide` → CONTINUE (matriz viva), REOPEN_CF1 (contenido roto), INTERVIEW_STAKEHOLDER (sin baseline_frozen).  
  - **Éxito:** `CONTINUE REOPEN_CF1 INTERVIEW_STAKEHOLDER`.  
  - **Límites:** no inventes baseline_frozen; no conviertas missing en CONTINUE; no toques los fixtures.
- **Proposed instruction/description improvements:**  
  1. Corrige missing: sin `baseline_frozen` → `INTERVIEW_STAKEHOLDER` (no CONTINUE).  
  2. Con schema completo, aplica el predicado de stakeholders/jobs/métricas/baseline.  
  3. Solo el válido es CONTINUE; el adverso es REOPEN_CF1.  
  4. Imprime los tres códigos en orden.
- **Proposed retrospective:**  
  Un campo de baseline ausente es entrevista a stakeholder, no un allow optimista. El error clásico es promover portfolio sin matriz viva. Pregunta: ¿por qué REOPEN_CF1 no es lo mismo que INTERVIEW_STAKEHOLDER?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-A.

---

### S52-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: PASS vs DECLARE_NO_GO según constraints, owners y residual; deja explícito `match_is_fraud False`. Falta preamble de “el no-go no se gestiona con disclaimer” y retrospective del misconception “ER/score ya es prueba de fraude”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con CF-1 vivo, el siguiente sello es **ético y operativo**: constraints, riesgos con dueño y no-go firmado. En esta demo un registro sintético exige synthetic-only + human-review, no-go de real-pii y auto-risk-decision, y residual aceptado. No escribas: predice PASS para el válido y DECLARE_NO_GO para el vacío. Observa también `match_is_fraud False`: matching/ER proponen; no condenan.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: hard-block de PII real y auto-riesgo; cada riesgo lleva owner; residual debe ser explícito. Puente a We Do: predicado invertido, tabla PASS/DECLARE/MISSING y decide INDEPENDENT_RISK_REVIEW.
- **Proposed retrospective:**  
  No-go firmado es gate, no adorno de README. El error clásico es tratar score/ER como veredicto de fraude. We Do: predicado, tres rutas y rama de residual ausente.
- **Code/output changes:** none
- **Validation notes:** Output `PASS` / `DECLARE_NO_GO` / `match_is_fraud False` alineado a T1-B.

---

### S52-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte el predicado (PASS si no hay no_go o residual no aceptado). Instruction densa; sin title/preamble/retrospective. Feedback ya es de los más ricos de la sección (nombra ER≠fraude) — falta escena de revisor y metacognición formal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Firmar no-go con riesgos con dueño
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PER-052-1B`, la plataforma multi-región no despliega si falta no-go de PII real o de decisión automática de riesgo.  
  - **Meta:** corregir `meets_contract` (synthetic-only + human-review, risks_with_owner≥1, no-go real-pii+auto-risk-decision, residual aceptado).  
  - **Éxito:** imprimes exactamente `S52-T1-B PASS`.  
  - **Límites:** no borres el assert; no “gestiones” el breach con un disclaimer; sin PII real en fixtures.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` aprueba cuando el no-go está vacío o el residual no se aceptó (bug).  
  2. Exige subsets de constraints y no_go, `risks_with_owner >= 1` y `residual_risk_accepted`.  
  3. Conserva print `S52-T1-B` y status PASS/DECLARE_NO_GO.  
  4. No mutes los sets del fixture.
- **Proposed feedback improvement:**  
  Constraints synthetic-only+human-review, risks con owner, no-go real-pii+auto-risk-decision y residual aceptado. Violación → DECLARE_NO_GO (no se “arregla” con disclaimer). ER/score nunca prueba fraude; schema sin residual → INDEPENDENT_RISK_REVIEW en E3.
- **Proposed retrospective:**  
  Ethics fail-closed: lo que no está firmado no se despliega. El error clásico es invertir el predicado y “aprobar” ausencia de no-go. Siguiente (E2): PASS / DECLARE_NO_GO / MISSING:residual_risk_accepted.
- **Code/output changes:** none
- **Validation notes:** Solution y output `S52-T1-B PASS` correctos.

---

### S52-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas bien modeladas; starter reusa predicado invertido. Falta preamble de separación schema vs. contenido y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de no-go (PASS / DECLARE / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el comité de riesgo no confunde un registro firmado, uno vacío de no-go y uno sin flag de residual.  
  - **Meta:** `assess` → PASS, DECLARE_NO_GO, MISSING:residual_risk_accepted.  
  - **Éxito:** `PASS DECLARE_NO_GO MISSING:residual_risk_accepted`.  
  - **Límites:** calcula `missing` antes de leer residual; no rellenes evidencia; el adverso falla por contenido.
- **Proposed instruction/description improvements:**  
  1. Corrige assess: deja de aprobar ausencia de no-go.  
  2. Primero required keys; si falta residual → MISSING.  
  3. Luego predicado completo de T1-B.  
  4. Imprime los tres resultados en orden.
- **Proposed retrospective:**  
  Residual ausente es incertidumbre de firma, no “seguir con fe”. El adverso sin constraints es breach ético. Luego (E3): CONTINUE / DECLARE_NO_GO / INDEPENDENT_RISK_REVIEW.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S52-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a códigos de acción; starter convierte missing en CONTINUE. Sin escena fail-closed ni cierre metacognitivo hacia youDo risk register.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide no-go: CONTINUE o REVIEW
- **Proposed preamble:**  
  - **Contexto:** el release gate no “sigue con warning” si falta residual o se violó el no-go.  
  - **Meta:** CONTINUE (firmado), DECLARE_NO_GO (breach), INDEPENDENT_RISK_REVIEW (schema incompleto).  
  - **Éxito:** `CONTINUE DECLARE_NO_GO INDEPENDENT_RISK_REVIEW`.  
  - **Límites:** missing ≠ CONTINUE; no inventes residual; no toques fixtures.
- **Proposed instruction/description improvements:**  
  1. Missing → INDEPENDENT_RISK_REVIEW.  
  2. Completo: predicado T1-B → CONTINUE o DECLARE_NO_GO.  
  3. Imprime los tres códigos.  
  4. Conserva el assert de orden.
- **Proposed retrospective:**  
  Ausencia de residual es revisión independiente; no-go vacío es breach. Pregunta: ¿por qué un disclaimer en el README no sustituye DECLARE_NO_GO?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a callout T1-B.

---

### S52-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de seis contexts (incluye relationship), PASS vs monólito all-in-one con DB compartida. Falta preamble de “relationship no es opcional” y retrospective del misconception “shared_database es más simple y por tanto mejor”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Tras el no-go, la plataforma se descompone en **seis bounded contexts** integrados por API y eventos versionados — no por una base compartida. En esta demo el fixture válido trae intake, er, relationship, triage, reporting y copilot con 12 contract tests. No escribas: predice PASS y STOP_INTEGRATION_RELEASE para el monólito `all-in-one`. Si omites relationship, el nombre de la plataforma es teatro.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: REQUIRED es el mapa mínimo; `shared_db` prohíbe acoplamiento oculto; n_tests≥10 hace fallar al productor, no al consumidor en silencio. Puente a We Do: predicado invertido, tres rutas y MAP_BOUNDED_CONTEXTS.
- **Proposed retrospective:**  
  Contexts + contratos versionados + sin DB compartida. El error clásico es “un monólito con shared DB es más rápido de entregar”. We Do: predicado, assess y decide de integración.
- **Code/output changes:** none
- **Validation notes:** Output lista contexts / PASS / STOP_INTEGRATION_RELEASE alineado a T2-A.

---

### S52-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba si shared_database o APIs sin versionar. Instruction densa; feedback ya nombra los seis contexts y relationship — falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Seis contexts sin base compartida
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PER-052-2A`, el ensamblaje multi-región exige mapa de contexts, OpenAPI/eventos versionados y ≥10 contract tests.  
  - **Meta:** corregir `meets_contract` (seis contexts, apis/events versionados, not shared_database, contract_tests≥10).  
  - **Éxito:** `S52-T2-A PASS`.  
  - **Límites:** no borres el assert; no apruebes monólito; no inventes tests.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si shared_database o APIs no versionadas (bug).  
  2. Exige subset de los seis contexts (incluye relationship).  
  3. `not shared_database` y `contract_tests >= 10`.  
  4. Conserva print y status STOP_INTEGRATION_RELEASE.
- **Proposed feedback improvement:**  
  Nombra los seis contexts (incluye relationship). shared_database o API sin versionar → STOP_INTEGRATION_RELEASE. Faltar el contador de tests en schema → MAP_BOUNDED_CONTEXTS antes de seguir el cableado real del youDo.
- **Proposed retrospective:**  
  Integración por contrato, no por tabla compartida. El error clásico es invertir el predicado y “aprobar” el monólito. Siguiente (E2): PASS / STOP / MISSING:contract_tests.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S52-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas bien definidas; starter reusa defecto. Sin escena missing≠breach ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de contexts (PASS / STOP / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de arquitectura no iguala un mapa limpio, un monólito con DB compartida y un registro sin contador de contract tests.  
  - **Meta:** `assess` → PASS, STOP_INTEGRATION_RELEASE, MISSING:contract_tests.  
  - **Éxito:** `PASS STOP_INTEGRATION_RELEASE MISSING:contract_tests`.  
  - **Límites:** missing antes de leer contract_tests; adverso falla por contenido; no inventes el campo.
- **Proposed instruction/description improvements:**  
  1. Corrige assess (deja de premiar shared_database).  
  2. Required keys primero.  
  3. Predicado completo de T2-A.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Sin contador de tests no hay evidencia de contrato; monólito es breach de integración. Luego (E3): CONTINUE / STOP / MAP_BOUNDED_CONTEXTS.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S52-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a MAP_BOUNDED_CONTEXTS; starter trata missing como CONTINUE. Falta ancla al ensamblaje real (OpenAPI + job.finished/case.updated).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide integración: CONTINUE o MAP
- **Proposed preamble:**  
  - **Contexto:** el release de integración falla cerrado: no hay “seguir y arreglar el consumidor después”.  
  - **Meta:** CONTINUE, STOP_INTEGRATION_RELEASE, MAP_BOUNDED_CONTEXTS.  
  - **Éxito:** `CONTINUE STOP_INTEGRATION_RELEASE MAP_BOUNDED_CONTEXTS`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes contract_tests; no toques fixtures.
- **Proposed instruction/description improvements:**  
  1. Missing → MAP_BOUNDED_CONTEXTS.  
  2. Completo: predicado de contexts/API/eventos/DB/tests.  
  3. Imprime los tres códigos.  
  4. Conserva el assert de orden.
- **Proposed retrospective:**  
  Sin mapa de tests no se integra a ciegas. Pregunta: ¿por qué shared_database no se “arregla” con un disclaimer en el README?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T2-A.

---

### S52-T2-B-DEMO (iDo)
- **Diagnosis:** Cadena HITL clara (propose→prioritize→draft→cite→human) y bloqueo de autofraude. Falta preamble de “proponer no es decidir” y retrospective del misconception “si el RAG cita, el humano es opcional”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con los seis contexts cableados, datos/modelos/RPA/RAG **apoyan** un human workflow; no lo sustituyen. En esta demo la cadena completa con `infers_fraud=False` pasa; la que omite humano e infiere fraude se bloquea. No escribas: predice PASS y BLOCK_AUTOMATED_RISK_DECISION. Observa `rag_mode cited`: citar no es condenar.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: all(chain) y not infers_fraud es el contrato; autofraude es no-go de graduación. Puente a We Do: predicado invertido, tres rutas y REQUEST_HUMAN_REVIEW.
- **Proposed retrospective:**  
  HITL = propose-not-decide. El error clásico es autoetiquetar fraude porque el score “se ve alto”. We Do: predicado, assess y decide de la cadena.
- **Code/output changes:** none
- **Validation notes:** Output `PASS BLOCK_AUTOMATED_RISK_DECISION` / `rag_mode cited` alineado a T2-B.

---

### S52-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba si infers_fraud o no hay human_decides. Feedback E1 es genérico (“explica qué campo…”) — más débil que E1 de T1-B/T3-A. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cadena HITL sin autofraude
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PER-052-2B`, ER propone, triage prioriza, RPA prepara draft, RAG cita y **el humano decide**.  
  - **Meta:** corregir `meets_contract` (toda la cadena en True y `infers_fraud` en False).  
  - **Éxito:** `S52-T2-B PASS`.  
  - **Límites:** no borres el assert; no apruebes autofraude; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si infers_fraud o sin human_decides (bug).  
  2. Exige all de er/triage/rpa/rag/human y `not infers_fraud`.  
  3. Conserva print y BLOCK_AUTOMATED_RISK_DECISION.  
  4. No mutes el record.
- **Proposed feedback improvement:**  
  La cadena completa y `infers_fraud=False` son el contrato. Omitir humano o autoetiquetar riesgo → BLOCK_AUTOMATED_RISK_DECISION. Schema sin flag de fraude → REQUEST_HUMAN_REVIEW (incertidumbre, no “seguir optimista”).
- **Proposed retrospective:**  
  Señales proponen; humanos deciden. El error clásico es invertir el predicado y premiar el autofraude. Siguiente (E2): PASS / BLOCK / MISSING:infers_fraud.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S52-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas sólidas; feedback plantilla “explica qué campo…”. Falta escena de revisor HITL.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas HITL (PASS / BLOCK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el auditor de riesgo no trata igual una cadena limpia, una con autofraude y una sin el flag `infers_fraud`.  
  - **Meta:** PASS, BLOCK_AUTOMATED_RISK_DECISION, MISSING:infers_fraud.  
  - **Éxito:** `PASS BLOCK_AUTOMATED_RISK_DECISION MISSING:infers_fraud`.  
  - **Límites:** missing antes de leer infers_fraud; no inventes el flag; adverso falla por contenido.
- **Proposed instruction/description improvements:**  
  1. Corrige assess (deja de premiar autofraude).  
  2. Required keys primero.  
  3. Predicado de cadena + not infers_fraud.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Flag ausente es incertidumbre de schema; autofraude es breach ético. Luego (E3): CONTINUE / BLOCK / REQUEST_HUMAN_REVIEW.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S52-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a REQUEST_HUMAN_REVIEW; starter convierte missing en CONTINUE. Sin ancla a youDo hitl_chain_ok.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide HITL: CONTINUE o REQUEST_REVIEW
- **Proposed preamble:**  
  - **Contexto:** el workflow sensible no “sigue con warning” si falta el flag de fraude o se omite el humano.  
  - **Meta:** CONTINUE, BLOCK_AUTOMATED_RISK_DECISION, REQUEST_HUMAN_REVIEW.  
  - **Éxito:** `CONTINUE BLOCK_AUTOMATED_RISK_DECISION REQUEST_HUMAN_REVIEW`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes infers_fraud; no toques fixtures.
- **Proposed instruction/description improvements:**  
  1. Missing → REQUEST_HUMAN_REVIEW.  
  2. Completo: cadena + not infers_fraud.  
  3. Imprime los tres códigos.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Incertidumbre de schema pide humano; autofraude bloquea. Pregunta: ¿por qué un draft de RPA no autoriza la decisión final?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T2-B.

---

### S52-T3-A-DEMO (iDo)
- **Diagnosis:** Matriz de seis capas + contadores P0/P1; clean PASS vs dirty con open_p0. Falta preamble de “demo bonita no cierra P0” y retrospective del misconception “compenso CP-N4-C con video”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Integración cableada no basta: la **matriz de verificación** (unit, contract, integration, evals, red_team, performance) debe estar en verde con cero P0/P1 abiertos. En esta demo el suite limpio pasa; el que tiene red_team roto y open_p0=1 se bloquea. No escribas: predice PASS y BLOCK_FINAL_ON_P0_P1. Un print de “todo ok” no es regresión S1–S52.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: all(layers) y contadores en 0 es el gate; hallazgo P0/P1 deja regression test permanente. Puente a We Do: predicado invertido, tres rutas y FIX_AND_RERUN_REGRESSION.
- **Proposed retrospective:**  
  Calidad medible, no teatro de demo. El error clásico es graduar con P0 abierto “porque el video se ve bien”. We Do: predicado, assess y decide de la matriz.
- **Code/output changes:** none
- **Validation notes:** Output `PASS BLOCK_FINAL_ON_P0_P1` y lista de layers alineados a T3-A.

---

### S52-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter invierte el predicado (PASS si red_team falso o P0/P1 abiertos). Feedback E1 ya es rico (nombra capas y no-compensación de CP-N4-C). Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Seis capas con cero P0/P1
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PER-052-3A`, la graduación exige unit/contract/integration/evals/red_team/performance en True y open_p0=open_p1=0.  
  - **Meta:** corregir `meets_contract` (seis capas + contadores en cero).  
  - **Éxito:** `S52-T3-A PASS`.  
  - **Límites:** no borres el assert; no “compenses” un P0 con demo; sin PII en red team.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si red_team falso o contadores >0 (bug).  
  2. `all` de las seis capas y `open_p0 == 0` y `open_p1 == 0`.  
  3. Conserva print y BLOCK_FINAL_ON_P0_P1.  
  4. No mutes el suite del fixture.
- **Proposed feedback improvement:**  
  Las seis capas en True y open_p0=open_p1=0. open_p0≥1 o red_team en False → BLOCK_FINAL_ON_P0_P1. Schema sin open_p1 → FIX_AND_RERUN_REGRESSION. Demo bonita no compensa CP-N4-C ni P0 abiertos.
- **Proposed retrospective:**  
  Gate de calidad = capas + severidad contada. El error clásico es premiar el suite roto. Siguiente (E2): PASS / BLOCK / MISSING:open_p1.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S52-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas claras; feedback plantilla. Falta escena de regresión permanente por hallazgo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de calidad (PASS / BLOCK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de release no confunde suite limpio, suite con P0 y schema sin contador open_p1.  
  - **Meta:** PASS, BLOCK_FINAL_ON_P0_P1, MISSING:open_p1.  
  - **Éxito:** `PASS BLOCK_FINAL_ON_P0_P1 MISSING:open_p1`.  
  - **Límites:** missing antes de leer open_p1; adverso falla por contenido; no inventes contadores.
- **Proposed instruction/description improvements:**  
  1. Corrige assess (deja de premiar P0 abiertos).  
  2. Required keys primero.  
  3. Predicado de capas + ceros.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Contador ausente es incertidumbre de evidencia; P0 abierto es breach de graduación. Luego (E3): CONTINUE / BLOCK / FIX_AND_RERUN_REGRESSION.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S52-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a FIX_AND_RERUN_REGRESSION; starter convierte missing en CONTINUE. Anclar a youDo curriculum_gate y regresión S1–S52.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide calidad: CONTINUE o RERUN
- **Proposed preamble:**  
  - **Contexto:** el gate final no promociona con contadores de severidad faltantes ni con P0 abiertos.  
  - **Meta:** CONTINUE, BLOCK_FINAL_ON_P0_P1, FIX_AND_RERUN_REGRESSION.  
  - **Éxito:** `CONTINUE BLOCK_FINAL_ON_P0_P1 FIX_AND_RERUN_REGRESSION`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes open_p1; no toques fixtures.
- **Proposed instruction/description improvements:**  
  1. Missing → FIX_AND_RERUN_REGRESSION.  
  2. Completo: capas + ceros.  
  3. Imprime los tres códigos.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Sin contador no hay promote; P0 fuerza bloqueo. Pregunta: ¿por qué un video de demo no cierra un P0 de red_team?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T3-A.

---

### S52-T3-B-DEMO (iDo)
- **Diagnosis:** RPO/RTO medidos con reloj; PASS vs NO_GO_RESILIENCE. Falta preamble de “tabletop sin números no cuenta” y retrospective del misconception “runbook en PDF = DR”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con la matriz en verde, toca demostrar **resiliencia con reloj**: availability ≥ SLO, edad de backup ≤ RPO, rollback ≤ RTO y restore verificado. En esta demo el drill 0.999/3h/8min pasa; el de avail 0.7 y rollback 120 min se bloquea. No escribas: predice PASS y NO_GO_RESILIENCE. Un tabletop verbal sin números no reduce el riesgo operativo.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: cuatro predicados medibles; `restored` cierra el loop del drill. Puente a We Do: predicado invertido, tres rutas y RUN_DISASTER_EXERCISE.
- **Proposed retrospective:**  
  DR medido, no promesa de runbook. El error clásico es “hablamos de qué haríamos” sin reloj. We Do: predicado, assess y decide de resiliencia.
- **Code/output changes:** none
- **Validation notes:** Output PASS / NO_GO_RESILIENCE / measured RPO/RTO alineado a T3-B.

---

### S52-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte comparadores (PASS si avail < slo o rollback > rto). Feedback E1 ya pide números del fixture — bueno. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** RPO/RTO medidos con restore
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PER-052-3B`, el drill sintético exige avail≥slo, backup_age≤rpo, rollback≤rto y disaster_exercise True.  
  - **Meta:** corregir `meets_contract` con comparadores en la dirección correcta + flag de restore.  
  - **Éxito:** `S52-T3-B PASS`.  
  - **Límites:** no borres el assert; no apruebes tabletop sin reloj; no inventes números.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si availability < slo o rollback > rto (bug).  
  2. `availability >= slo` y `backup_age_h <= rpo_h` y `rollback_min <= rto_min` y `disaster_exercise`.  
  3. Conserva print y NO_GO_RESILIENCE.  
  4. No mutes el fixture.
- **Proposed feedback improvement:**  
  Con los números del fixture válido (0.999, 3 h, 8 min) el predicado pasa. El adverso (p. ej. rollback 120 min) fuerza NO_GO_RESILIENCE. Sin flag de drill, emite RUN_DISASTER_EXERCISE — un PDF de procedimientos no cuenta.
- **Proposed retrospective:**  
  RPO/RTO se miden con reloj y restore. El error clásico es invertir desigualdades y “aprobar” el fallo. Siguiente (E2): PASS / NO_GO / MISSING:disaster_exercise.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S52-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas claras; feedback plantilla. Anclar missing al drill incompleto del youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de DR (PASS / NO_GO / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de operación no confunde drill limpio, breach de SLO/RTO y registro sin flag de ejercicio.  
  - **Meta:** PASS, NO_GO_RESILIENCE, MISSING:disaster_exercise.  
  - **Éxito:** `PASS NO_GO_RESILIENCE MISSING:disaster_exercise`.  
  - **Límites:** missing antes de leer disaster_exercise; adverso falla por números; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Corrige assess (deja de premiar breach).  
  2. Required keys primero.  
  3. Predicado de resiliencia.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Flag ausente es “corre el drill”; números rotos son no-go de resiliencia. Luego (E3): CONTINUE / NO_GO / RUN_DISASTER_EXERCISE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S52-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a RUN_DISASTER_EXERCISE; starter convierte missing en CONTINUE. Anclar a youDo drill dict y readiness.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide DR: CONTINUE o RUN_DRILL
- **Proposed preamble:**  
  - **Contexto:** el gate de resiliencia no promociona con drill no corrido ni con RTO incumplido.  
  - **Meta:** CONTINUE, NO_GO_RESILIENCE, RUN_DISASTER_EXERCISE.  
  - **Éxito:** `CONTINUE NO_GO_RESILIENCE RUN_DISASTER_EXERCISE`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes disaster_exercise; no toques fixtures.
- **Proposed instruction/description improvements:**  
  1. Missing → RUN_DISASTER_EXERCISE.  
  2. Completo: predicado de availability/SLO/RPO/RTO + restore.  
  3. Imprime los tres códigos.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Sin flag de drill no hay evidencia; breach de reloj es no-go. Pregunta: ¿por qué un tabletop de 30 minutos no sustituye restore verificado?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T3-B.

---

### S52-T4-A-DEMO (iDo)
- **Diagnosis:** Guion de demo ≤10 min con TTR 90→42 y contribución personal. Falta preamble de “honestidad de portfolio” y retrospective del misconception “video bonito sin baseline es claim válido”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con la plataforma verificada y resiliente, la **demo de entrevista** narra problema → baseline → decisión → métrica → límite en ≤10 minutos. En esta demo el TTR sintético 90→42 min, claims sourced y contribución personal (`blocking + contract tests en triage API`) arman el guion. No escribas: predice el dict y `cv_ok True`. Si no hay mejora vs. baseline, no hay claim.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: assert result < baseline es el contrato de honestidad; personal_contribution distingue tu trabajo de plantillas del curso. Puente a We Do: predicado invertido, tres rutas y RECORD_PERSONAL_CONTRIBUTION.
- **Proposed retrospective:**  
  Portfolio = números + fuente + contribución personal. El error clásico es inflar ownership o demo sin baseline. We Do: predicado, assess y decide del claim.
- **Code/output changes:** none
- **Validation notes:** Output demo dict / cv_ok True alineado a T4-A.

---

### S52-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba si TTR no mejora o claims sin fuente. Feedback E1 ya nombra REJECT/RECORD. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Claim de TTR con contribución personal
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PER-052-4A`, el revisor de CV exige result_ttr < baseline, benchmark sintético, demo≤10 min, claims sourced y personal_contribution.  
  - **Meta:** corregir `meets_contract` con esas cinco condiciones.  
  - **Éxito:** `S52-T4-A PASS`.  
  - **Límites:** no borres el assert; no inventes mejora; sin PII real en el guion.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si result ≥ baseline o claims no sourced (bug).  
  2. Exige result < baseline, benchmark_synthetic, demo_minutes ≤ 10, cv_claims_sourced y personal_contribution.  
  3. Conserva print y REJECT_UNSUPPORTED_PORTFOLIO_CLAIM.  
  4. No mutes el fixture.
- **Proposed feedback improvement:**  
  Claim válido = mejora medible + sintético + ≤10 min + fuentes + contribución personal. Teatro de video sin números → REJECT_UNSUPPORTED_PORTFOLIO_CLAIM. Schema sin contribución → RECORD_PERSONAL_CONTRIBUTION.
- **Proposed retrospective:**  
  Honestidad de portfolio es gate de carrera. El error clásico es premiar el claim vacío. Siguiente (E2): PASS / REJECT / MISSING:personal_contribution.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S52-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas sólidas; feedback plantilla. Anclar a defense_script del youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de demo (PASS / REJECT / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor de portfolio no confunde un claim limpio, uno sin mejora/fuentes y uno sin contribución personal documentada.  
  - **Meta:** PASS, REJECT_UNSUPPORTED_PORTFOLIO_CLAIM, MISSING:personal_contribution.  
  - **Éxito:** `PASS REJECT_UNSUPPORTED_PORTFOLIO_CLAIM MISSING:personal_contribution`.  
  - **Límites:** missing antes de leer personal_contribution; adverso falla por contenido; no inventes el campo.
- **Proposed instruction/description improvements:**  
  1. Corrige assess (deja de premiar claims sin fuente).  
  2. Required keys primero.  
  3. Predicado de T4-A.  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Contribución ausente es “regístrala”; TTR peor o sin fuente es reject de claim. Luego (E3): CONTINUE / REJECT / RECORD_PERSONAL_CONTRIBUTION.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S52-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a RECORD_PERSONAL_CONTRIBUTION; starter convierte missing en CONTINUE. Anclar a entrevista 15–20 min y youDo personal_contribution.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide portfolio: CONTINUE o RECORD
- **Proposed preamble:**  
  - **Contexto:** el gate de CV no “sigue con warning” si falta contribución personal o el claim no se sostiene.  
  - **Meta:** CONTINUE, REJECT_UNSUPPORTED_PORTFOLIO_CLAIM, RECORD_PERSONAL_CONTRIBUTION.  
  - **Éxito:** `CONTINUE REJECT_UNSUPPORTED_PORTFOLIO_CLAIM RECORD_PERSONAL_CONTRIBUTION`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes personal_contribution; no toques fixtures.
- **Proposed instruction/description improvements:**  
  1. Missing → RECORD_PERSONAL_CONTRIBUTION.  
  2. Completo: predicado de mejora/demo/fuentes.  
  3. Imprime los tres códigos.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Sin contribución personal no hay defensa ética de ownership. Pregunta: ¿por qué un demo de 30 minutos sin baseline no es PASS?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T4-A.

---

### S52-T4-B-DEMO (iDo)
- **Diagnosis:** Bundle de 8 artefactos + cpn4c_independent; PASS vs solo README. Falta preamble de “paquete defendible para revisor externo” y retrospective del misconception “README solo basta si el código corre en mi laptop”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Cierre del capstone: **ocho artefactos** permiten a un revisor ejecutar y cuestionar el sistema sin conocimiento tribal. En esta demo el set completo (architecture, README, ADR, system/model cards, LICENSE, video, defense) con comando reproducible y trade-offs pasa; un bundle solo con README se bloquea. No escribas: predice n=8, PASS y BLOCK_INCOMPLETE_EVIDENCE_BUNDLE. CP-FINAL no se compensa con demos parciales ni con CP-N4-C.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: REQUIRED es el set de 8 (no 6); reproducible + tradeoffs + cpn4c_independent cierran el predicado. Puente a We Do: predicado invertido, tres rutas y SCHEDULE_TECHNICAL_DEFENSE.
- **Proposed retrospective:**  
  Bundle de 8 + independencia de CP-N4-C. El error clásico es “mi laptop corre, listo”. We Do: predicado, assess y decide del evidence bundle.
- **Code/output changes:** none
- **Validation notes:** Output n 8 / PASS / BLOCK_INCOMPLETE_EVIDENCE_BUNDLE alineado a T4-B.

---

### S52-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter aprueba si artifacts<8 o no independiente. Feedback E1 ya lista los 8 — bueno. Falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Evidence bundle de ocho artefactos
- **Proposed preamble:**  
  - **Contexto:** en `CASO-PER-052-4B`, la graduación exige los 8 nombres + comando reproducible + trade-offs defendidos + cpn4c_independent.  
  - **Meta:** corregir `meets_contract` con subset de artefactos y los tres flags en True.  
  - **Éxito:** `S52-T4-B PASS`.  
  - **Límites:** no borres el assert; no apruebes monorepo solo con README; no compenses CP-N4-C.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si len(artifacts)<8 o no cpn4c_independent (bug).  
  2. Exige subset de los 8 nombres y all de reproducible/tradeoffs/cpn4c_independent.  
  3. Conserva print y BLOCK_INCOMPLETE_EVIDENCE_BUNDLE.  
  4. No mutes el set del fixture.
- **Proposed feedback improvement:**  
  Bundle de graduación = 8 artefactos (architecture, README, ADR, system_card, model_card, LICENSE, video, defense) + reproducible + trade-offs + cpn4c_independent. Solo README se bloquea; sin independencia de CP-N4-C → SCHEDULE_TECHNICAL_DEFENSE.
- **Proposed retrospective:**  
  Paquete defendible, no laptop del autor. El error clásico es premiar bundle incompleto. Siguiente (E2): PASS / BLOCK / MISSING:cpn4c_independent.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S52-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas sólidas; feedback plantilla. Anclar a artifact_paths y readiness del youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de bundle (PASS / BLOCK / MISSING)
- **Proposed preamble:**  
  - **Contexto:** el revisor externo no confunde bundle completo, monorepo solo con README y registro sin flag cpn4c_independent.  
  - **Meta:** PASS, BLOCK_INCOMPLETE_EVIDENCE_BUNDLE, MISSING:cpn4c_independent.  
  - **Éxito:** `PASS BLOCK_INCOMPLETE_EVIDENCE_BUNDLE MISSING:cpn4c_independent`.  
  - **Límites:** missing antes de leer cpn4c_independent; adverso falla por contenido; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Corrige assess (deja de premiar bundle corto).  
  2. Required keys primero.  
  3. Predicado de T4-B (subset de 8 + flags).  
  4. Imprime los tres resultados.
- **Proposed retrospective:**  
  Flag de independencia ausente es incertidumbre de rúbrica; README solo es breach de evidencia. Luego (E3): CONTINUE / BLOCK / SCHEDULE_TECHNICAL_DEFENSE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S52-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a SCHEDULE_TECHNICAL_DEFENSE; starter convierte missing en CONTINUE. Cierre del arco hacia defensa oral 15–20 min y youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Decide bundle: CONTINUE o DEFENSE
- **Proposed preamble:**  
  - **Contexto:** el gate senior-master no promociona con independencia de CP-N4-C no declarada ni con bundle incompleto.  
  - **Meta:** CONTINUE, BLOCK_INCOMPLETE_EVIDENCE_BUNDLE, SCHEDULE_TECHNICAL_DEFENSE.  
  - **Éxito:** `CONTINUE BLOCK_INCOMPLETE_EVIDENCE_BUNDLE SCHEDULE_TECHNICAL_DEFENSE`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes cpn4c_independent; no toques fixtures.
- **Proposed instruction/description improvements:**  
  1. Missing → SCHEDULE_TECHNICAL_DEFENSE.  
  2. Completo: subset de 8 + reproducible + tradeoffs + cpn4c_independent.  
  3. Imprime los tres códigos.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Sin independencia de CP-N4-C no hay defensa técnica válida. Pregunta: ¿por qué un video convincente sin LICENSE y sin ADR no es PASS?
- **Code/output changes:** none
- **Validation notes:** Transfer real; alineado a T4-B y al youDo.

---

### S52-YOU-DO (youDo)
- **Diagnosis:** Marco de proyecto **excelente**: context, objectives, requirements, rubric, portfolioNote y starter `readiness` que inicia BLOCKED a propósito (contexts, HITL, drill con reloj, BUNDLE_8 paths, milestones 80 h, defense_script, curriculum_gate 52/52+12/12, contribución personal). Falta solo `retrospective` de defensa/reflexión post-build para el learner que cierra el curso.
- **Checklist:** context pass · goal pass · success pass (rubric + READY) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) CP-FINAL · Enterprise Relationship & Operations Intelligence Platform (portfolio defendible)
- **Proposed preamble:** N/A — `context` ya cumple el rol de escena; no duplicar en campo preamble del schema youDo.
- **Proposed instruction/description improvements:**  
  Mantener requirements y starter. Opcional (P2): en `portfolioNote`, una línea que recuerde “weDo entrenó códigos de acción; READY no se logra volteando booleans” — ya está casi dicho; no reescribir el starter.
- **Proposed retrospective:**  
  Antes de marcar READY: (1) ¿qué invariante del gate demuestras con un path real del bundle de 8 y un número de drill (RPO/RTO o TTR antes/después)? (2) ¿qué harías distinto con datos reales vs. sintéticos multi-región (PII, autofraude, shared DB)? (3) En defense_notes, una frase de contribución personal y un trade-off defendible en 30 segundos. Si el revisor externo no puede ejecutar sin tu laptop, no es graduación: es teatro.
- **Code/output changes:** none
- **Validation notes:** Starter y rubric alineados a theory y a los 24 weDo; no tocar outputs del readiness inicial (BLOCKED esperado).

---

## Priority order

### P0 (24 weDo — title + preamble + instruction solo-tarea + retrospective; feedback polish donde se indicó)
1. S52-T1-A-E1, E2, E3  
2. S52-T1-B-E1, E2, E3  
3. S52-T2-A-E1, E2, E3  
4. S52-T2-B-E1, E2, E3  
5. S52-T3-A-E1, E2, E3  
6. S52-T3-B-E1, E2, E3  
7. S52-T4-A-E1, E2, E3  
8. S52-T4-B-E1, E2, E3  

### P1 (8 iDo preamble+retrospective+why ampliado; 1 youDo retrospective)
1. S52-T1-A-DEMO … S52-T4-B-DEMO (8 demos)  
2. S52-YOU-DO retrospective  

### P2 (polish residual tras P0/P1)
- Unificar feedback plantilla de E2/E3 (“explica qué campo…”) hacia 1–2 frases de *por qué importa al revisor / portfolio / no compensar CP-N4-C* (varias E1 ya están bien: T1-B, T3-A, T3-B, T4-A, T4-B).  
- Ampliar `why` de iDo al rango 40–90 palabras.  
- Opcional: acortar instructions densas una vez el preamble absorba contexto/éxito/límites.

---

## Residual risks

1. **Prosa clonada E1/E2/E3** si el Fixer reutiliza el mismo párrafo cambiando solo el código de acción: el código ya hace fade real; la prosa debe reflejar guided → independent → transfer.  
2. **Confundir “carrera” con soft skills** al escribir preambles: el hilo es portfolio técnico defendible (demo, métricas, límites, contribución personal), no networking genérico.  
3. **Tocar outputs o predicados** al “mejorar” pedagogía: exact outputs y starter DEFECT están correctos; no reescribir la lógica de gate.  
4. **youDo sobrecargado** de texto: solo añadir `retrospective`; no reescribir context/requirements que ya son sólidos.  
5. **Naming interno** `career-strategy` vs título UI: no “arreglar” el id en esta ronda salvo orchestrator.  
6. **Carga cognitiva del true newbie en Master**: S52 asume 51 secciones previas; preambles deben anclar *revisor externo multi-región* y *missing≠breach*, no re-enseñar Python básico.

---

## Fixer handoff (checklist)

- [ ] Cada iDo: `preamble` + `retrospective` (+ `why` ampliado si cabe)  
- [ ] Cada weDo: `title` + `preamble` + `instruction` solo-tarea + `retrospective` (+ feedback polish P2)  
- [ ] youDo: `retrospective` de defensa  
- [ ] Outputs y DEFECT intactos salvo justificación execute-and-diff  
- [ ] Español PE; sin PII real; sin generadores  
- [ ] Section compila en static build  

Section 52 exercise pedagogy review complete. Ready for the Fixer prompt.
