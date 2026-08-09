# S41 Exercise Pedagogy Report (Round 1)

## Section
- **title:** APIs con FastAPI y contratos HTTP
- **shortTitle:** APIs FastAPI
- **id:** `llm-finetuning` (archivo `s41-llm-finetuning.ts`; contenido = control plane HTTP versionado, no fine-tuning de LLM)
- **index:** 41
- **source:** `src/lib/course/sections/s41-llm-finetuning.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S41-T1-A recursos/métodos/status · T1-B idempotencia/keyset/versionado · T2-A routing/DI · T2-B validación 422 + vista pública · T3-A sync/async/background · T3-B timeouts/Problem Details/lifecycle · T4-A pirámide unit/contract/integration · T4-B compat/429/observabilidad
- **hilo de caso:** oficina ficticia en Arequipa **CASO-ARE-041** — API versionada de jobs sintéticos; gates CP-N4-A: create idempotente, errores sin PII, lectura compatible v1; puente S40 (fronteras de dominio) → S41 (contratos HTTP) → S42 (authz/schemas/privacidad)
- **modelo de lab:** progressive disclosure en **stdlib** (dicts/funciones isomorfas a FastAPI/OpenAPI/TestClient); tokens de lab fail-closed (`RETURN_*`, `THIN_THE_HANDLER`, …) no son enums de producción

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~386–621), `weDo.steps[]` (24 ejercicios, ~627–1992) y `youDo` (~1996–2096) en `s41-llm-finetuning.ts`.
- Contrastado con theory T1–T4, learning outcomes y gate CP-N4-A (idempotencia, no PII en errores, read compat).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S41 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1–2 frases** (bajo o al borde del rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + CASO-ARE-041 + salida exacta” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera APIs, **opaco** para newbie sin escena de control plane |
| We Do `feedback` | 1–2 frases; nombra el principio y el token E2/E3 (bien); poco *por qué importa al cliente, al OpenAPI o al gate de promoción* |
| Starter `# DEFECT` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E2/E3 dan la predicado casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con gate `readiness()` medible |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N4-A; **no** proponer cambios de output salvo notas puntuales |
| Patrón E1→E2→E3 | **Implementa** función de dominio → **assess** válido/adverso/missing → **decide** CONTINUE/breach/incertidumbre. Fade de *contenido* real y consistente en los 8 subtemas |
| Tokens de lab | `RETURN_CORRECT_HTTP_STATUS`, `REVIEW_RESOURCE_SEMANTICS`, `RETURN_IDEMPOTENCY_CONFLICT`, `REPLAY_STORED_RESPONSE`, `THIN_THE_HANDLER`, `REVIEW_DEPENDENCY_BOUNDARY`, `REJECT_AND_REDACT`, `REGENERATE_OPENAPI`, `MOVE_WORK_OFF_EVENT_LOOP`, `CHOOSE_BACKGROUND_BOUNDARY`, `CANCEL_AND_CLOSE`, `RECALCULATE_TIMEOUT_BUDGET`, `BLOCK_UNTESTED_CONTRACT`, `ADD_MISSING_TEST_LEVEL`, `THROTTLE_AND_REDACT`, `INSPECT_COMPATIBILITY` — fail-closed; preambles deben anclar que no son enums de producción |

**Patrón dominante:** el andamiaje de *código* (bugs nombrados, outputs canónicos, stdlib progressive disclosure, fail-closed en assess/decide, DI, 422, 429, Problem Details) es maduro y alineado al gate CP-N4-A. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa al control plane de Arequipa, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real y homogénea: E1 repara la función de dominio (status, store de idempotencia, handler delgado, handle 422, boundary, budget, pirámide, admit+log); E2 evalúa tres rutas con predicado de dominio; E3 decide tokens de gate. **No** son tres clones idénticos de la misma instrucción: cambian superficie (implementar → assess → decide) y tokens. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S41-T1-A-DEMO (iDo)
- **Diagnosis:** Worked example sólido de matriz método/path/status (`POST /v1/jobs`→201, ítem ausente→404, colección→200, health→200). La `description` nombra el skill; falta `preamble` que diga *qué observar* (201 ≠ 200 en create; 404 es del ítem, no de la colección) y `retrospective` del misconception “colección vacía = 404”. El `why` es una frase densa pero corta.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de cablear FastAPI, el control plane de la oficina sintética en Arequipa (`CASO-ARE-041`) necesita una **matriz HTTP** asertable. En esta demo `status_for` decide el código a partir del método, el path y si el ítem existe. Observa cuatro llamadas: create de jobs, GET de un id ausente, listado de colección y health. No escribas aún: predice `201`, `404`, `200`, `200` y compáralos con la salida. Si confundes create con 200 o tratas la colección vacía como 404, el OpenAPI y los clientes mienten.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el create exitoso es 201 (recurso nuevo); el 404 vive en `/v1/jobs/{id}` cuando el ítem no existe; la colección (vacía o no) sigue en 200; health es 200. Así la matriz método/path/status queda testeable antes de `@app.post`. Puente a We Do: reparar el DEFECT que devuelve 200 en create.
- **Proposed retrospective:**  
  Si puedes explicar por qué un create no es 200 y por qué una lista vacía no es 404 sin mirar el código, ya tienes el hábito de status semánticos. El error clásico es un 200 genérico que confunde a OpenAPI. En We Do practicarás corregir `status_for` y luego assess/decide fail-closed.
- **Code/output changes:** none
- **Validation notes:** Output `201` / `404` / `200` / `200` alineado a theory T1-A.

---

### S41-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter devuelve 200 en POST create (DEFECT). Instruction densa mezcla ID, meta, defect y print de PASS; sin title, preamble ni retrospective. Feedback nombra 201 vs 200 y tokens E2/E3, pero no ancla “por qué el cliente y OpenAPI dependen del 201”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Create de jobs con status 201
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ARE-041-1A` la matriz del lab fija el create de jobs como POST + colección `/v1/jobs` ⇒ **201**, no 200.  
  - **Meta:** implementar `status_for(method, resource, *, item_exists)` con status semánticos.  
  - **Éxito:** los asserts del starter pasan e imprimes `S41-T1-A PASS` (POST create 201; health 200; colección 200; ítem ausente 404).  
  - **Límites:** no dejes 200 en create; no uses 404 en la colección; fixtures sintéticos sin PII.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: en POST + path que termina en `/jobs` devuelve `200` (bug).  
  2. Cámbialo a `201`.  
  3. Conserva health 200, colección 200, ítem ausente 404 y el fallback 405.  
  4. No borres los asserts ni el print final.
- **Proposed feedback improvement:**  
  Un create exitoso es 201 Created: comunica recurso nuevo a clientes y a OpenAPI. Devolver 200 confunde lectura con creación. La colección vacía no es 404; el 404 es del ítem `/v1/jobs/{id}`. En E2/E3, status incoherente ⇒ `RETURN_CORRECT_HTTP_STATUS`.
- **Proposed retrospective:**  
  Status = parte del contrato, no un adorno. El error clásico es 200 en create o 404 en lista vacía. Pregunta: ¿qué status usarías en `GET /v1/jobs` sin filas? (200.) Siguiente (E2): evaluar tres fixtures con assess.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S41-T1-A PASS` correctos.

---

### S41-T1-A-E2 (weDo, independent)
- **Diagnosis:** Assess de tres rutas (PASS / RETURN_CORRECT_HTTP_STATUS / MISSING:status) con predicado invertido en el starter. Instruction ya nombra campos y salidas; falta escena “auditoría de contrato antes de promover” y cierre metacognitivo de missing-first.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar create con assess de status
- **Proposed preamble:**  
  - **Contexto:** un revisor del control plane recibe tres samples de tráfico sintético: create bien formado, create con 200 incoherente y un registro sin campo `status`.  
  - **Meta:** implementar `assess(record)` que valide campos y aplique la regla de T1-A (POST + /jobs + created + 201).  
  - **Éxito:** imprimes exactamente `PASS RETURN_CORRECT_HTTP_STATUS MISSING:status`.  
  - **Límites:** no inventes status si falta el campo; no apruebes create con 200; solo sintético.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: el PASS usa `status==200` y `method==GET` (predicado invertido).  
  2. Mantén la rama `missing` primero.  
  3. PASS solo si POST, resource termina en `/jobs`, `created` y `status==201`.  
  4. Conserva el print de las tres rutas.
- **Proposed retrospective:**  
  Missing-first evita leer un campo que no existe. PASS exige la matriz de create, no un 200 genérico. Luego (E3) el mismo criterio se vuelve decisión de gate con tokens de incertidumbre.
- **Code/output changes:** none
- **Validation notes:** Output canónico alineado; fixtures CASO-ARE-041-1A coherentes.

---

### S41-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico a tokens de gate (CONTINUE / RETURN_CORRECT_HTTP_STATUS / REVIEW_RESOURCE_SEMANTICS). Starter confunde missing con CONTINUE y aprueba 200 en create. Falta preamble de “fail-closed en promoción” y self-check de incertidumbre.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate fail-closed de status HTTP
- **Proposed preamble:**  
  - **Contexto:** en transferencia de contrato OpenAPI, tres muestras de tráfico deciden si el flujo de jobs **sigue**, se **corrige** o se **revisa** por incertidumbre.  
  - **Meta:** `decide(record)` fail-closed: OK ⇒ `CONTINUE`; create con 200 ⇒ `RETURN_CORRECT_HTTP_STATUS`; sin `status` ⇒ `REVIEW_RESOURCE_SEMANTICS`.  
  - **Éxito:** `CONTINUE RETURN_CORRECT_HTTP_STATUS REVIEW_RESOURCE_SEMANTICS` en ese orden.  
  - **Límites:** no trates la ausencia como éxito; no inventes el código HTTP; tokens de lab, no enums de prod.
- **Proposed instruction/description improvements:**  
  1. Si faltan campos, devuelve `REVIEW_RESOURCE_SEMANTICS` (no CONTINUE).  
  2. CONTINUE solo con POST + /jobs + created + 201.  
  3. Cualquier otra combinación completa ⇒ `RETURN_CORRECT_HTTP_STATUS`.  
  4. Conserva el assert de orden de resultados.
- **Proposed retrospective:**  
  Incertidumbre ≠ CONTINUE: sin evidencia de status no se promueve. El error clásico es aprobar 200 en create o rellenar campos. Pregunta: ¿qué token usarías si falta `method`? (misma rama de missing.)
- **Code/output changes:** none
- **Validation notes:** Transfer real de superficie; alineado a demo y theory T1-A.

---

### S41-T1-B-DEMO (iDo)
- **Diagnosis:** Demo clara de created/replay/conflict + keyset pagination y `side_effects==1`. Description OK; falta preamble de “reintento del cliente sin segundo job” y retrospective del misconception “misma key siempre es replay aunque el body cambie”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El riesgo operativo del create no es solo el status: es el **reintento**. En esta demo `idempotent_create` liga una key al body canónico: idéntico ⇒ replay, distinto ⇒ conflict, y `side_effects` queda en 1. Luego `page_keyset` pagina por cursor (`next=job-002`), no por offset. No escribas: predice las tres etiquetas, el largo del store y las dos páginas. Si la misma key con body distinto crea un segundo job, el gate CP-N4-A se rompe.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: la key + hash del body evita side effects duplicados; conflict no es segundo create; keyset (`after_id` → `next`) es más estable que offset si el set crece al inicio. Puente a We Do: reparar un store que siempre inserta.
- **Proposed retrospective:**  
  Replay ≠ segundo create; body distinto bajo la misma key es conflicto. El error clásico es “si la key existe, reintento silencioso” sin comparar el body. We Do: implementar el store y luego assess/decide de auditoría.
- **Code/output changes:** none
- **Validation notes:** Output created/replay/conflict, `side_effects 1`, páginas keyset alineado a T1-B.

---

### S41-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter siempre crea e inserta con key mutada (`key + str(len(store))`) — defect guiado excelente. Instruction telegráfica; sin escena de reintento de cliente. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Store de Idempotency-Key sin duplicar
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ARE-041-1B` un cliente reintenta `POST /v1/jobs` con la misma Idempotency-Key; el lab debe dejar **un solo** side effect.  
  - **Meta:** implementar `idempotent_create(store, key, body)` → `created` | `replay` | `conflict`.  
  - **Éxito:** created → replay → conflict y `len(store)==1`; imprime `S41-T1-B PASS`.  
  - **Límites:** no insertes con key mutada; no crees un segundo job en replay; no silencies body distinto.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: ignora el store real y siempre devuelve `"created"`.  
  2. Si `key in store`, compara body: igual ⇒ `replay`, distinto ⇒ `conflict`.  
  3. Si la key es nueva, guarda `store[key] = body` y devuelve `created`.  
  4. Conserva los asserts de longitud 1.
- **Proposed retrospective:**  
  La key liga el body canónico: igualdad ⇒ replay, mismatch ⇒ conflict, y el store no crece. El error clásico es insertar siempre. Siguiente (E2): auditar hash, effects y version.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass correcto.

---

### S41-T1-B-E2 (weDo, independent)
- **Diagnosis:** Assess de idempotencia sana (hash estable, effects==1, cursor keyset, version v1) vs conflicto. Instruction densa; falta ancla de “auditoría de reintentos” y por qué sin `version` no se asume v1.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar hash, effects y versión
- **Proposed preamble:**  
  - **Contexto:** el gateway te entrega tres records de auditoría de reintentos: uno sano, uno con hash mismatch + effects>1, y uno sin `version`.  
  - **Meta:** `assess` con missing-first y predicado de T1-B (hash igual, un efecto, cursor tipo `job-*`, version `v1`).  
  - **Éxito:** `PASS RETURN_IDEMPOTENCY_CONFLICT MISSING:version`.  
  - **Límites:** no apruebes effects>1; no inventes version; cursor offset no cuenta como keyset sano.
- **Proposed instruction/description improvements:**  
  1. Corrige el predicado invertido (hoy PASS si effects>1 o hash distinto).  
  2. PASS solo con hash estable, effects==1, cursor que empieza por `job-` y version `v1`.  
  3. Mantén `MISSING:` + campos ordenados.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Idempotencia sana es observable: un efecto, hash estable, versión explícita. Falta version ⇒ no asumas v1. Luego (E3): tokens de reintento fail-closed.
- **Code/output changes:** none
- **Validation notes:** Output canónico; fixture adverso mezcla hash/effects/cursor/version rotos — el predicado de solution es conjunto (bien).

---

### S41-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a CONTINUE / RETURN_IDEMPOTENCY_CONFLICT / REPLAY_STORED_RESPONSE. Starter confunde missing con CONTINUE y acepta effects>1. Falta preamble de “no inventes v1 ante incertidumbre”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Reintentos: continue, conflict o replay
- **Proposed preamble:**  
  - **Contexto:** un cliente reintenta POST y el gateway pide una decisión fail-closed sobre tres records (válido, hash/effects rotos, sin version).  
  - **Meta:** `decide` → `CONTINUE` | `RETURN_IDEMPOTENCY_CONFLICT` | `REPLAY_STORED_RESPONSE`.  
  - **Éxito:** `CONTINUE RETURN_IDEMPOTENCY_CONFLICT REPLAY_STORED_RESPONSE`.  
  - **Límites:** sin version no inventes v1; breach por hash o effects>1; tokens de lab.
- **Proposed instruction/description improvements:**  
  1. Missing ⇒ `REPLAY_STORED_RESPONSE` (no CONTINUE).  
  2. CONTINUE solo con el predicado sano de E2.  
  3. Resto completo ⇒ `RETURN_IDEMPOTENCY_CONFLICT`.  
  4. Conserva el assert de orden.
- **Proposed retrospective:**  
  Ante incertidumbre de version, reutiliza la respuesta almacenada o escala: no “arregles” inventando v1. El error clásico es CONTINUE cuando falta evidencia. Pregunta: ¿por qué body distinto bajo la misma key no es replay?
- **Code/output changes:** none
- **Validation notes:** Alineado a gate CP-N4-A de no duplicar side effects.

---

### S41-T2-A-DEMO (iDo)
- **Diagnosis:** Demo excelente de DI: dos fakes (`mem_a`, `mem_b`) reciben un job cada uno sin reescribir el handler. Falta preamble de “handler delgado vs dominio puro” y retrospective del misconception “el dominio puede conocer status HTTP”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En FastAPI (y en este modelo stdlib) el **path operation** solo orquesta. Esta demo muestra `thin_handler(get_store, body)` que llama a `create_job` sin status codes: al inyectar dos stores distintos, cada uno crece por su cuenta (`swapped_stores 1 1`). No escribas: predice los dos jobs y los largos. Si el dominio importa HTTP o un global, no puedes sustituir el store en tests de contrato.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: DI = sustituir `get_store` sin tocar la ruta; dominio recibe store+body; flag mental `domain_imports_http == False`. Puente a We Do: sacar status_code y el global del dominio.
- **Proposed retrospective:**  
  Handler delgado + store inyectable es el mismo hábito que `Depends` en FastAPI. El error clásico es meter SQL y status en el path. We Do: reparar el handler gordo del starter.
- **Code/output changes:** none
- **Validation notes:** Output con dos jobs y `swapped_stores 1 1` correcto.

---

### S41-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter con GLOBAL + `status_code` en dominio e ignora `get_store` — multi-defect guiado de calidad. Instruction densa; sin escena de “montar tests con fakes”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Handler delgado con store inyectable
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ARE-041-2A` el POST de jobs debe poder probarse con dos fakes sin reescribir la ruta.  
  - **Meta:** `create_job(store, body)` puro y `thin_handler(get_store, body)` que solo orquesta.  
  - **Éxito:** cada fake recibe un job, sin `status_code` en el body; imprime `S41-T2-A PASS`.  
  - **Límites:** no uses un global; no pongas status HTTP en el dominio; no ignores `get_store`.
- **Proposed instruction/description improvements:**  
  1. Elimina `GLOBAL` y el campo `status_code`.  
  2. `create_job` recibe `store` y hace append.  
  3. `thin_handler` es `return create_job(get_store(), body)`.  
  4. Conserva asserts de longitud y ausencia de status_code.
- **Proposed retrospective:**  
  DI se demuestra sustituyendo el store. El error clásico es dominio acoplado a HTTP o a un singleton. Siguiente (E2): assess de líneas del handler y flags de boundary.
- **Code/output changes:** none
- **Validation notes:** DEFECT multi-capa bien nombrado; solution limpia.

---

### S41-T2-A-E2 (weDo, independent)
- **Diagnosis:** Assess de handler delgado (≤5 líneas, injectable, sin domain_imports_http, domain_called). Predicado invertido en starter. Falta ancla de code review métrico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Medir si el handler se engordó
- **Proposed preamble:**  
  - **Contexto:** en code review del control plane mides si el path operation sigue delgado o se mezcló con HTTP/dominio.  
  - **Meta:** `assess` → PASS si handler corto, DI, dominio sin HTTP y `domain_called`; si no, `THIN_THE_HANDLER`; missing ⇒ `MISSING:domain_called`.  
  - **Éxito:** `PASS THIN_THE_HANDLER MISSING:domain_called`.  
  - **Límites:** no apruebes handlers gordos ni `domain_imports_http`; no inventes domain_called.
- **Proposed instruction/description improvements:**  
  1. Invierte el predicado: PASS no es “líneas >20 y domain_imports_http”.  
  2. Criterio: `handler_lines <= 5` y flags sanos.  
  3. Missing-first.  
  4. Print de tres rutas.
- **Proposed retrospective:**  
  Las métricas del lab (líneas, flags) son proxies de boundary, no dogmas de estilo. Sin `domain_called` no hay orquestación demostrada. Luego (E3): tokens de review.
- **Code/output changes:** none
- **Validation notes:** Umbral ≤5 alineado a demo de pocas líneas.

---

### S41-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / THIN_THE_HANDLER / REVIEW_DEPENDENCY_BOUNDARY. Starter aprueba gordos y omite incertidumbre. Falta preamble de “no asumas orquestación sin evidencia”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Review: adelgazar o revisar boundary
- **Proposed preamble:**  
  - **Contexto:** tres mediciones de capas deciden si el path sigue, se adelgaza o se revisa la boundary de dependencias.  
  - **Meta:** `decide` fail-closed con tokens de lab.  
  - **Éxito:** `CONTINUE THIN_THE_HANDLER REVIEW_DEPENDENCY_BOUNDARY`.  
  - **Límites:** sin `domain_called` no asumas orquestación; tokens ≠ enums de producción.
- **Proposed instruction/description improvements:**  
  1. Missing ⇒ `REVIEW_DEPENDENCY_BOUNDARY`.  
  2. CONTINUE con el predicado sano de E2.  
  3. Resto ⇒ `THIN_THE_HANDLER`.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Code review fail-closed: falta de evidencia de dominio no es CONTINUE. El error clásico es “compila, ya está”. Pregunta: ¿por qué el dominio no debe importar `Request`?
- **Code/output changes:** none
- **Validation notes:** Alineado a T2-A y al puente FastAPI Depends.

---

### S41-T2-B-DEMO (iDo)
- **Diagnosis:** Demo clara de 422 + allow-list y `secret_leaked False`. Falta preamble de “validar antes del dominio” y retrospective del misconception “200 con defaults silenciosos está bien”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El handler delgado asume un body confiable: hay que **validar y redactar**. En esta demo `handle` devuelve 422 si falta `priority` y, si es válido, una vista allow-list sin `secret`. Observa las dos rutas y el flag `secret_leaked`. No escribas: predice los pares status/body. Si el secreto del body crudo sale en la respuesta, el contrato y la privacidad fallan aunque el status sea 200.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: validación antes del dominio (como Pydantic/FastAPI 422); serialización por allow-list; OpenAPI debe declarar el shape público, no el interno. Puente a We Do: dejar de devolver el body crudo.
- **Proposed retrospective:**  
  422 tipado + vista pública es el par mínimo de contrato de entrada/salida. El error clásico es 200 con leak o defaults inventados. We Do: implementar `handle` y luego assess de OpenAPI alineado.
- **Code/output changes:** none
- **Validation notes:** Output 200 sin secret / 422 con fields / secret_leaked False correcto.

---

### S41-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter siempre 200 + body crudo (leak). Guided excelente. Falta escena de “no filtrar internal_key al cliente”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Validar 422 y redactar la vista
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ARE-041-2B` un job sintético `er-run` puede traer `secret`; el cliente solo debe ver campos públicos.  
  - **Meta:** `handle(body)` → 422 tipado si falta `priority`; 200 con allow-list `{name, priority}` si es válido.  
  - **Éxito:** asserts de 200 sin secret y 422 con fields; imprime `S41-T2-B PASS`.  
  - **Límites:** no devuelvas el body crudo; no uses 200 con defaults silenciosos; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Define required `{name, priority}`.  
  2. Si faltan campos, 422 + error/fields ordenados.  
  3. Si pasa, `public_view` con allow-list.  
  4. Conserva los asserts del starter.
- **Proposed retrospective:**  
  Validación y redaction son dos pasos: primero rechazas, luego serializas. El error clásico es echo del body. Siguiente (E2): auditar status, leak y OpenAPI.
- **Code/output changes:** none
- **Validation notes:** Solution con `public_view` helper limpia.

---

### S41-T2-B-E2 (weDo, independent)
- **Diagnosis:** Assess de rechazo tipado + no leak + openapi_matches. Fixture “válido” es un 422 correcto (input_valid False). Instruction no aclara que el caso PASS es **rechazo bien hecho**, no un create 200 — riesgo de confusión para newbie.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar 422, leak y OpenAPI
- **Proposed preamble:**  
  - **Contexto:** revisas tres snapshots: rechazo 422 bien formado (PASS), 200 con secret en response (breach), y un record sin flag `openapi_matches`.  
  - **Meta:** `assess` — PASS si input inválido fue rechazado con 422, sin intersección con campos internos y OpenAPI alineado.  
  - **Éxito:** `PASS REJECT_AND_REDACT MISSING:openapi_matches`.  
  - **Límites:** no apruebes 200 con secret; no inventes openapi_matches; el PASS de este lab es un rechazo correcto, no un create feliz.
- **Proposed instruction/description improvements:**  
  1. Corrige el predicado invertido (hoy PASS con 200 y leak).  
  2. PASS: `not input_valid` y status 422 y sets disjuntos y openapi_matches.  
  3. Missing-first.  
  4. Print de tres rutas.
- **Proposed retrospective:**  
  Un contrato sano también se demuestra fallando bien (422). OpenAPI desalineado es deuda de contrato. Luego (E3): tokens de PR review.
- **Code/output changes:** none (opcional Fixer: en instruction dejar explícito que el fixture “valid” es validación de rechazo, no body de create OK)
- **Validation notes:** Semántica de fixtures correcta pero contraintuitiva sin preamble; documentar en prosa.

---

### S41-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / REJECT_AND_REDACT / REGENERATE_OPENAPI. Starter trata leak como CONTINUE. Falta preamble de “sin OpenAPI no se promueve el shape”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** PR: rechazar leak o regenerar OpenAPI
- **Proposed preamble:**  
  - **Contexto:** en revisión de PR del control plane, tres snapshots deciden si el contrato sigue, se redacting/rechaza o se regenera la doc.  
  - **Meta:** `decide` con tokens fail-closed.  
  - **Éxito:** `CONTINUE REJECT_AND_REDACT REGENERATE_OPENAPI`.  
  - **Límites:** sin `openapi_matches` no evalúes el body como confiable; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Missing ⇒ `REGENERATE_OPENAPI`.  
  2. CONTINUE con el predicado sano de E2.  
  3. Resto ⇒ `REJECT_AND_REDACT`.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  OpenAPI es evidencia del contrato: si el flag falta, regenera, no asumas. El error clásico es mergear un 200 con secret “para depurar”. Pregunta: ¿qué status devuelve FastAPI ante body inválido por defecto?
- **Code/output changes:** none
- **Validation notes:** Tokens alineados a theory T2-B.

---

### S41-T3-A-DEMO (iDo)
- **Diagnosis:** Demo clara de boundary async vs background y efecto en cola. Falta preamble de “no bloquear el event loop con CPU” y retrospective del misconception “todo lo async es await en el request”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El contrato HTTP puede ser correcto y aun así **bloquear el event loop**. Esta demo clasifica `io_wait` → async (sin encolar) y `cpu_heavy` → background (encola `queued`). Observa las tuplas boundary/longitud y el contenido de la cola. No escribas: predice `('async', 0)` y luego un item en queue. Si el score CPU vive en el path del POST, el control plane se ahoga bajo carga.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: async brilla en I/O wait; CPU/durable salen a worker con store confiable; la demo muestra decisión + efecto, no un booleano vacío. Puente a We Do: dejar de marcar todo como async.
- **Proposed retrospective:**  
  Boundary = decisión documentada + efecto observable (cola). El error clásico es `await` de trabajo CPU como si fuera red. We Do: implementar choose/enqueue y assess de offload.
- **Code/output changes:** none
- **Validation notes:** Output y `queued` alineados a T3-A.

---

### S41-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter todo-async y nunca encola. Guided claro. Falta escena de “score durable que debe sobrevivir al request”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Encolar CPU fuera del event loop
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ARE-041-3A` un GET ligero puede ser I/O; un score CPU o job durable no debe quedarse en el request.  
  - **Meta:** `choose_boundary` + `enqueue_if_needed` (background encola `status=queued`).  
  - **Éxito:** io_wait no encola; cpu_heavy encola uno; imprime `S41-T3-A PASS`.  
  - **Límites:** no marques todo async; no dejes CPU en el loop; sin PII en ids.
- **Proposed instruction/description improvements:**  
  1. Mapea io_wait→async; cpu_heavy/durable→background; resto→sync.  
  2. Solo background hace append a la cola.  
  3. Devuelve (boundary, len(queue)).  
  4. Conserva los asserts.
- **Proposed retrospective:**  
  I/O no llena la cola; CPU sí se encola. El error clásico es “async = más rápido” sin offload. Siguiente (E2): assess de uses_await y cpu_offloaded.
- **Code/output changes:** none
- **Validation notes:** Solution y asserts alineados a demo.

---

### S41-T3-A-E2 (weDo, independent)
- **Diagnosis:** Assess de I/O awaited + offload + durable_job. Fixture PASS exige también `cpu_offloaded` y `durable_job` True aunque work_kind sea io — semántica de lab “flags de capacidad documentados”, no solo kind. Instruction no lo explica; newbie puede confundirse.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar offload del event loop
- **Proposed preamble:**  
  - **Contexto:** capacity review del path: ¿el I/O usa await y los flags de offload/durable están documentados?  
  - **Meta:** `assess` — PASS si work_kind io, uses_await, cpu_offloaded y durable_job; adverso CPU sin offload ⇒ `MOVE_WORK_OFF_EVENT_LOOP`; sin flag durable ⇒ `MISSING:durable_job`.  
  - **Éxito:** `PASS MOVE_WORK_OFF_EVENT_LOOP MISSING:durable_job`.  
  - **Límites:** no apruebes CPU en el request; no inventes durable_job; en este lab PASS exige flags de capacidad presentes, no solo el kind.
- **Proposed instruction/description improvements:**  
  1. Invierte el predicado (hoy PASS con cpu + await sin offload).  
  2. PASS con el conjunto de flags del fixture válido.  
  3. Missing-first.  
  4. Print de tres rutas.
- **Proposed retrospective:**  
  Documentar durable/offload evita asumir que “ya está en background”. Sin flag no hay evidencia. Luego (E3): tokens de capacity.
- **Code/output changes:** none (nota Fixer: preamble debe explicitar que el fixture io válido también exige flags de capacidad True)
- **Validation notes:** Predicado de solution coherente con fixtures; prosa debe prevenir confusión.

---

### S41-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / MOVE_WORK_OFF_EVENT_LOOP / CHOOSE_BACKGROUND_BOUNDARY. Starter confunde missing con CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Capacity: offload o elegir boundary
- **Proposed preamble:**  
  - **Contexto:** tres clasificaciones de trabajo deciden si el request sigue, se saca del loop o se elige boundary de background ante incertidumbre.  
  - **Meta:** `decide` fail-closed.  
  - **Éxito:** `CONTINUE MOVE_WORK_OFF_EVENT_LOOP CHOOSE_BACKGROUND_BOUNDARY`.  
  - **Límites:** sin `durable_job` no asumas offload; tokens de lab.
- **Proposed instruction/description improvements:**  
  1. Missing ⇒ `CHOOSE_BACKGROUND_BOUNDARY`.  
  2. CONTINUE con predicado sano.  
  3. Resto ⇒ `MOVE_WORK_OFF_EVENT_LOOP`.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Incertidumbre de durable no es luz verde. El error clásico es dejar CPU en el path “por ahora”. Pregunta: ¿qué status de job devolverías al encolar? (`queued`.)
- **Code/output changes:** none
- **Validation notes:** Alineado a T3-A.

---

### S41-T3-B-DEMO (iDo)
- **Diagnosis:** Demo excelente de try/finally + Problem Details sin PII en ambos caminos (ok y timeout). Falta preamble de cascada de timeouts y retrospective del misconception “solo cerrar el pool en el camino feliz”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando el upstream tarda de más, el cliente no debe recibir un stack ni un email. Esta demo corre con budget: ok cierra el pool; timeout devuelve `UPSTREAM_TIMEOUT` con `trace_id` y **también** deja `open []` gracias al `finally`. Observa ambos prints. No escribas: predice outcome y recursos. Si solo cierras en el camino feliz, el timeout deja sockets abiertos.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: budget decide ok vs timeout; finally cierra siempre; error con type/title/status/trace_id estilo RFC 9457, sin PII. Puente a We Do: quitar el 500 con email del starter.
- **Proposed retrospective:**  
  Cancel + close + payload seguro es el trío de timeout. El error clásico es 500 genérico con PII. We Do: implementar budget y assess de cascada client>service>db.
- **Code/output changes:** none
- **Validation notes:** Ambos caminos `open []` y 504 tipado correctos.

---

### S41-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter no cierra en timeout y filtra email en el error — defect de seguridad/lifecycle excelente. Falta escena de incidente operativo.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Timeout con finally y sin PII
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ARE-041-3B` el job sintético puede superar el budget de servicio; el pool debe cerrarse siempre.  
  - **Meta:** `run_with_budget` con try/finally; timeout ⇒ 504 Problem Details + `trace_id` sintético, sin email.  
  - **Éxito:** ok y timeout dejan resources vacío; error tipado; imprime `S41-T3-B PASS`.  
  - **Límites:** no devuelvas 500 con email; no omitas finally; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Envuelve la lógica en try/finally con `clear()`.  
  2. Si elapsed > limit, arma error type/title/status 504/trace_id.  
  3. Si no, outcome ok.  
  4. Conserva los asserts de ambos caminos.
- **Proposed retrospective:**  
  El finally no es opcional: cierra en ok y en timeout. El error clásico es PII “para depurar”. Siguiente (E2): assess de cascada de budgets.
- **Code/output changes:** none
- **Validation notes:** Solution canónica con tr-are-041.

---

### S41-T3-B-E2 (weDo, independent)
- **Diagnosis:** Assess de cascada db < service < client + error_code + resource_closed. Predicado invertido. Falta ancla de “budgets invertidos matan el cancel interno”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar cascada de timeouts
- **Proposed preamble:**  
  - **Contexto:** telemetría de tres mediciones: cascada sana y recurso cerrado; budgets invertidos + pool abierto; flag de cierre ausente.  
  - **Meta:** `assess` — PASS si db < service < client, error `UPSTREAM_TIMEOUT` y `resource_closed`; si no `CANCEL_AND_CLOSE`; missing ⇒ `MISSING:resource_closed`.  
  - **Éxito:** `PASS CANCEL_AND_CLOSE MISSING:resource_closed`.  
  - **Límites:** no apruebes budgets invertidos; no inventes resource_closed.
- **Proposed instruction/description improvements:**  
  1. Invierte el predicado (hoy PASS con db > client o cerrado False).  
  2. PASS con cascada estricta + código estable + closed True.  
  3. Missing-first.  
  4. Print de tres rutas.
- **Proposed retrospective:**  
  Cascada client > service > db deja cancelar primero lo interno. Pool abierto tras timeout es breach. Luego (E3): tokens de incidente.
- **Code/output changes:** none
- **Validation notes:** Fixtures 900/700/450 vs 500/700/900 correctos.

---

### S41-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / CANCEL_AND_CLOSE / RECALCULATE_TIMEOUT_BUDGET. Starter aprueba ante incertidumbre y budgets rotos.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Incidente: cancelar o recalcular budget
- **Proposed preamble:**  
  - **Contexto:** en un incidente de timeout del control plane, tres mediciones deciden continuar, cancelar/cerrar o recalcular budgets ante evidencia incompleta.  
  - **Meta:** `decide` fail-closed.  
  - **Éxito:** `CONTINUE CANCEL_AND_CLOSE RECALCULATE_TIMEOUT_BUDGET`.  
  - **Límites:** sin `resource_closed` no hay promoción; tokens de lab.
- **Proposed instruction/description improvements:**  
  1. Missing ⇒ `RECALCULATE_TIMEOUT_BUDGET`.  
  2. CONTINUE con predicado sano.  
  3. Resto ⇒ `CANCEL_AND_CLOSE`.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Sin flag de cierre no se asume lifecycle sano. El error clásico es 500 genérico y pool abierto. Pregunta: ¿por qué el error lleva `trace_id` y no email?
- **Code/output changes:** none
- **Validation notes:** Alineado a RFC 9457 estilo del lab y T3-B.

---

### S41-T4-A-DEMO (iDo)
- **Diagnosis:** Demo clara de seed→nivel (domain→unit, http→contract) y forma de pirámide. Falta preamble de “un solo e2e no localiza el diseño” y retrospective del misconception “integration atrapa todo”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Ya tienes contratos y timeouts: falta **demostrar** que un fallo se atrapa en el nivel correcto. Esta demo siembra `domain` (solo unit lo ve) y `http` (solo contract); integration no debe ser el único colador. Observa True/False por semilla y `pyramid True` con 12≥5≥2. No escribas: predice cada fila. Si solo confías en un e2e, un 200 en create puede esconderse.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: unit = regla de dominio; contract = status/schema/headers; integration = adapter controlado; forma unit ≥ contract ≥ integration. Puente a We Do: dejar de devolver siempre True.
- **Proposed retrospective:**  
  El nivel correcto localiza el diseño roto. El error clásico es solo unit o solo e2e. We Do: mapear seeds y forma de pirámide.
- **Code/output changes:** none
- **Validation notes:** Output domain/unit True, domain/integration False, http/contract True, pyramid True.

---

### S41-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter siempre True y pyramid_ok solo suma >0. Guided excelente. Falta escena de “seed de status 200 en create → contract”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Mapear seed al nivel de test
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ARE-041-4A` siembras un bug de dominio o de HTTP y exiges que el nivel correcto lo detecte.  
  - **Meta:** `level_detects` (domain→unit, http→contract, adapter→integration) y `pyramid_ok` con unit ≥ contract ≥ integration.  
  - **Éxito:** asserts de seeds y pirámides; imprime `S41-T4-A PASS`.  
  - **Límites:** no dejes siempre True; no inviertas la forma de la pirámide.
- **Proposed instruction/description improvements:**  
  1. Mapea seed→nivel y compara igualdad.  
  2. `pyramid_ok` = cadena de conteos.  
  3. Conserva asserts positivos y el caso 2,5,12 False.  
  4. Print final PASS.
- **Proposed retrospective:**  
  Seed + nivel correcto es la red de seguridad del contrato. El error clásico es pirámide invertida (más integration que unit). Siguiente (E2): assess de capas y seed detectado.
- **Code/output changes:** none
- **Validation notes:** Solution con mapping dict limpia.

---

### S41-T4-A-E2 (weDo, independent)
- **Diagnosis:** Assess de tres capas + flags + seeded_failure_detected. Predicado invertido. Falta ancla de “una sola capa no basta”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar pirámide y seed atrapado
- **Proposed preamble:**  
  - **Contexto:** tres reportes de test plan: pirámide completa con seed atrapado; solo unit sin seed; flag de seed ausente.  
  - **Meta:** `assess` → PASS si layers incluyen unit/contract/integration y todos los flags; si no `BLOCK_UNTESTED_CONTRACT`; missing ⇒ `MISSING:seeded_failure_detected`.  
  - **Éxito:** `PASS BLOCK_UNTESTED_CONTRACT MISSING:seeded_failure_detected`.  
  - **Límites:** no apruebes una sola capa; no inventes seed detectado.
- **Proposed instruction/description improvements:**  
  1. Invierte el predicado (hoy PASS con layers==1 y seed False).  
  2. PASS con subset de capas y all(flags).  
  3. Missing-first.  
  4. Print de tres rutas.
- **Proposed retrospective:**  
  Tres capas + seed visible = evidencia de red de seguridad. Sin seeded_failure_detected no hay prueba de que el colador funciona. Luego (E3): tokens de test plan.
- **Code/output changes:** none
- **Validation notes:** Fixtures alineados a theory T4-A.

---

### S41-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / BLOCK_UNTESTED_CONTRACT / ADD_MISSING_TEST_LEVEL. Starter aprueba pirámides incompletas.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Test plan: bloquear o añadir nivel
- **Proposed preamble:**  
  - **Contexto:** antes de promover el control plane, el test plan debe atrapar seeds en el nivel correcto o bloquear el merge.  
  - **Meta:** `decide` fail-closed.  
  - **Éxito:** `CONTINUE BLOCK_UNTESTED_CONTRACT ADD_MISSING_TEST_LEVEL`.  
  - **Límites:** sin flag de seed no asumas cobertura; tokens de lab.
- **Proposed instruction/description improvements:**  
  1. Missing ⇒ `ADD_MISSING_TEST_LEVEL`.  
  2. CONTINUE con predicado sano.  
  3. Resto ⇒ `BLOCK_UNTESTED_CONTRACT`.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  Un contrato sin red de seguridad no se promueve. El error clásico es “tenemos un e2e”. Pregunta: ¿qué nivel atrapa un 200 en create sembrado?
- **Code/output changes:** none
- **Validation notes:** Contract es la respuesta correcta al seed http.

---

### S41-T4-B-DEMO (iDo)
- **Diagnosis:** Demo clara de 429 con retry_after y log sin email. Falta preamble de “abuso recuperable + traza limpia” y retrospective del misconception “loguear PII ayuda a depurar en prod”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El gate CP-N4-A también pide que el abuso no tire el servicio y que la traza no filtre PII. Esta demo calcula `admit`: used 73 ⇒ remaining 27; used 110 ⇒ 429 con `retry_after_s`. Luego `log_fields` saca el email y deja `trace_id`/`job_id`. No escribas: predice los tres prints. Si respondes 500 opaco o logueas el email “para depurar”, rompes privacidad y recuperabilidad.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: 429 es recuperable; remaining solo en allow; ban-set de email/dni/secret; campos estables de compat v1. Puente a We Do: dejar de admitir siempre y de devolver el event crudo.
- **Proposed retrospective:**  
  Throttle real + log limpio cierran el edge del control plane. El error clásico es 200 con remaining negativo o PII en log. We Do: implementar admit/log y assess de consumer v1.
- **Code/output changes:** none
- **Validation notes:** Output 200/remaining, 429, log sin email correcto.

---

### S41-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter nunca throttle y log pasa el event crudo. Guided de calidad. Falta escena de cuota sintética 100 de Arequipa.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** 429 recuperable y log sin PII
- **Proposed preamble:**  
  - **Contexto:** en `CASO-ARE-041-4B` la cuota sintética es 100; la traza `tr-are-041` no debe llevar email.  
  - **Meta:** `admit(used, limit)` y `log_fields` con ban-set.  
  - **Éxito:** remaining 27 bajo cuota; 429 over-limit; log sin email; imprime `S41-T4-B PASS`.  
  - **Límites:** no dejes siempre 200; no inventes remaining en 429; no loguees PII.
- **Proposed instruction/description improvements:**  
  1. Si used > limit ⇒ 429 + retry_after_s.  
  2. Si no ⇒ 200 + remaining = limit - used.  
  3. log_fields filtra email/dni/secret.  
  4. Conserva los asserts.
- **Proposed retrospective:**  
  429 es señal recuperable, no un 500. Redaction del log es parte del contrato de observabilidad. Siguiente (E2): assess de consumer, cuota y pii_in_log.
- **Code/output changes:** none
- **Validation notes:** Solution alineada a demo.

---

### S41-T4-B-E2 (weDo, independent)
- **Diagnosis:** Assess de old_consumer_passes + used≤limit + trace_id tr-* + no pii. Predicado invertido. Falta ancla de “compat v1 + throttle + redaction en un solo gate”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar cuota, consumer y redaction
- **Proposed preamble:**  
  - **Contexto:** tres telemetrías de edge: consumer v1 + cuota sana + log limpio; over-limit + consumer roto + PII; flag pii ausente.  
  - **Meta:** `assess` — PASS si consumer pasa, used en rango, trace con prefijo `tr-` y no pii; si no `THROTTLE_AND_REDACT`; missing ⇒ `MISSING:pii_in_log`.  
  - **Éxito:** `PASS THROTTLE_AND_REDACT MISSING:pii_in_log`.  
  - **Límites:** no apruebes over-limit ni PII en log; no inventes el flag.
- **Proposed instruction/description improvements:**  
  1. Invierte el predicado (hoy PASS con over-limit o pii).  
  2. PASS con el conjunto sano del fixture válido.  
  3. Missing-first.  
  4. Print de tres rutas.
- **Proposed retrospective:**  
  Compat + cuota + privacidad se evalúan juntos en el edge. Sin flag de pii no asumas redaction. Luego (E3): tokens del gate CP-N4-A.
- **Code/output changes:** none
- **Validation notes:** Fixtures 73/100 vs 110/100 correctos.

---

### S41-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / THROTTLE_AND_REDACT / INSPECT_COMPATIBILITY. Starter aprueba over-limit y omite el flag. Cierre natural del lab hacia el You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate edge: throttle o inspeccionar
- **Proposed preamble:**  
  - **Contexto:** cierre del gate CP-N4-A en el edge: cuota, consumer v1 y redaction deben demostrarse o el flujo se bloquea/inspecciona.  
  - **Meta:** `decide` fail-closed.  
  - **Éxito:** `CONTINUE THROTTLE_AND_REDACT INSPECT_COMPATIBILITY`.  
  - **Límites:** sin `pii_in_log` no asumas redaction; tokens de lab, no enums de prod.
- **Proposed instruction/description improvements:**  
  1. Missing ⇒ `INSPECT_COMPATIBILITY`.  
  2. CONTINUE con predicado sano.  
  3. Resto ⇒ `THROTTLE_AND_REDACT`.  
  4. Conserva el assert.
- **Proposed retrospective:**  
  El edge no se promueve a ciegas: sin evidencia de redaction se inspecciona. El error clásico es silenciar el 429 o loguear email. Pregunta de puente: ¿qué tres piezas ensambla el You Do de esta sección?
- **Code/output changes:** none
- **Validation notes:** Tokens alineados al callout T4-B del theory.

---

### youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context de Arequipa, objectives de create/replay/conflict + 422 + GET, requirements medibles, starter con `readiness()` que aserta side effect único, secret fuera de response y get de status. `portfolioNote` y rúbrica cubren gate y trade-offs stdlib/FastAPI. **Falta `retrospective`** de defensa metacognitiva post-build (invariantes, PII, frase de impacto). Sin ella el learner cierra el tab sin ritual de transferencia al portafolio/S42.
- **Checklist:** context pass · goal pass · success pass (readiness READY) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) APIs con FastAPI y contratos HTTP
- **Proposed preamble:** N/A — `context` ya cumple rol de escena; no duplicar en un segundo bloque largo. Opcional Fixer: una línea de “éxito observable” si el UI no destaca `readiness() → READY`.
- **Proposed instruction/description improvements:**  
  Mantener objectives/requirements/starter. Asegurar que el DEFECT del starter (ignora Idempotency-Key) quede visible en el copy de inicio del proyecto. Ningún cambio de asserts de `readiness()` salvo justificación execute-and-diff.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con `readiness()` (un side effect, replay, conflict, 422, sin secret, GET 200)? (2) ¿qué harías distinto con PII real vs. sintético de Arequipa? (3) En el README, una frase de impacto medible (antes: create duplicaba; después: key+body ⇒ un job) defendible en 30 segundos. Siguiente en S42: authz, schemas estrictos y privacidad de servicios sobre este control plane.
- **Code/output changes:** none
- **Validation notes:** Starter y rúbrica listos para portafolio; solo falta cierre metacognitivo.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si aplica)
1. **S41-T1-A-E1, E2, E3** — status semánticos: 201 create, missing-first, tokens RETURN_CORRECT_HTTP_STATUS / REVIEW_RESOURCE_SEMANTICS  
2. **S41-T1-B-E1, E2, E3** — store de idempotencia, hash/effects/version, REPLAY_STORED_RESPONSE  
3. **S41-T2-A-E1, E2, E3** — thin handler + DI, THIN_THE_HANDLER / REVIEW_DEPENDENCY_BOUNDARY  
4. **S41-T2-B-E1, E2, E3** — 422 + redaction; aclarar en E2 que PASS es rechazo bien hecho  
5. **S41-T3-A-E1, E2, E3** — boundary/enqueue; aclarar flags de capacidad en E2  
6. **S41-T3-B-E1, E2, E3** — finally + Problem Details + cascada de budgets  
7. **S41-T4-A-E1, E2, E3** — seed→nivel y forma de pirámide  
8. **S41-T4-B-E1, E2, E3** — 429 + log sin PII + gate edge  

### P1
- **Todas las 8 demos iDo** — añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras donde quede corto  
- **youDo** — añadir `retrospective` de defensa (invariantes, PII, frase de impacto, puente S42)

### P2
- Unificar tono de `feedback` We Do (25–60 palabras) con *por qué importa al cliente/OpenAPI/gate*, no solo el token  
- En T2-B-E2 y T3-A-E2, una frase en preamble que desambigüe fixtures “PASS” no intuitivos  
- Revisar que `instruction` quede solo-pasos (40–100 palabras) una vez extraído el ensayo al preamble  

---

## Residual risks

1. **Nombre de archivo vs. contenido:** `s41-llm-finetuning.ts` / id `llm-finetuning` no reflejan “APIs FastAPI”; riesgo de confusión en navegación del repo — fuera del alcance de prosa de ejercicios, pero el Fixer no debe “corregir” el id sin orquestación de curso.  
2. **Tokens de lab vs. producción:** si preambles no anclan que `RETURN_*` / `THIN_THE_HANDLER` son fail-closed de lab, el learner puede copiarlos a un servicio real.  
3. **Homogeneidad E2/E3:** el esqueleto assess/decide es el mismo en 8 subtemas; sin preambles diferenciados por *escena* (auditoría de status vs. reintento vs. capacity vs. incidente), el fade se siente mecánico aunque el dominio cambie.  
4. **T2-B-E2 fixture “valid”:** es un 422 correcto; sin prosa clara, el newbie busca un create 200 y se frustra.  
5. **T3-A-E2 flags:** PASS exige `cpu_offloaded` y `durable_job` True con work_kind io; sin explicación parece arbitario.  
6. **youDo sin retrospective:** el proyecto ya mide READY/BLOCKED; el riesgo es cerrar sin articulo de portafolio defendible.  
7. **Código/outputs:** no hay indicios de outputs rotos; el Fixer no debe reescribir asserts canónicos al rellenar prosa.  
8. **Longitud:** 24 preambles + 8 demos + youDo es mucho texto; el Fixer debe respetar techos del spec (80–150 / 40–80) y no ensayar en `instruction`.

---

## Fixer notes (operativos)

- **No** editar theory ni selfCheck en esta pasada salvo que un campo se comparta por error.  
- Añadir campos opcionales del schema: `preamble`, `retrospective`, We Do `title`; reordenar `instruction` a pasos.  
- Preservar salidas exactas: `S41-T*-* PASS`, triples assess/decide, y `readiness()` del youDo.  
- Español profesional peruano; fixtures sintéticos Arequipa; sin PII real.  
- Una meta primaria por unidad; E1 nombra defect; E2 meta+éxito; E3 superficie nueva (tokens de gate).  
- Validar build estático de la sección tras el fix.

---

Section 41 exercise pedagogy review complete. Ready for the Fixer prompt.
