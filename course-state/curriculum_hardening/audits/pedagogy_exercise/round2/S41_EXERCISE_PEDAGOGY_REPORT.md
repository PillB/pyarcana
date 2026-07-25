# S41 Exercise Pedagogy Report (Round 2)

## Section
- **title:** APIs con FastAPI y contratos HTTP
- **shortTitle:** APIs FastAPI
- **id:** `llm-finetuning` (archivo `s41-llm-finetuning.ts`; contenido = control plane HTTP versionado, **no** fine-tuning de LLM)
- **index:** 41
- **source:** `src/lib/course/sections/s41-llm-finetuning.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A recursos/métodos/status · T1-B idempotencia/keyset/versionado · T2-A routing/DI · T2-B validación 422 + vista pública · T3-A sync/async/background · T3-B timeouts/Problem Details/lifecycle · T4-A pirámide unit/contract/integration · T4-B compat/429/observabilidad
- **hilo:** oficina ficticia Arequipa **CASO-ARE-041** — API versionada de jobs sintéticos; gates **CP-N4-A** (create idempotente, errores sin PII, lectura compatible v1); puente S40 → S41 → S42
- **modelo de lab:** progressive disclosure en **stdlib** isomorfo a FastAPI/OpenAPI/TestClient; tokens fail-closed de lab (`RETURN_*`, `THIN_THE_HANDLER`, …) ≠ enums de producción
- **Round 1 context:** `round1/S41_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (checklist preamble/retrospective, fade E1→E3, longitudes, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Measured word counts only as gates (no bulk prose generation).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Verified integrity traps (starter stdout would fail asserts vs solution PASS / triples canónicos) on representative units across all 8 subtemas.
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–6 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets weDo ~40–70 w (aceptable por spec “4 short bullets”); iDo narrativos ~59–84 w (T1-A en rango; varios bajo piso 80 pero legibles) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — muchas E2/E3 ~17–35 w (bajo piso 40; no bloquear en transfer) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (implementar dominio → assess válido/adverso/missing → decide CONTINUE/breach/incertidumbre) | Pass — **no** clones numéricos |
| **T2-B-E2 / T3-A-E2 fixtures** | Preambles de R1 aclaran PASS = rechazo 422 bien hecho y flags de capacidad, no create feliz / solo kind | Round-1 residual risks **cerrados** en prosa |
| **Feedback vs retrospective** | Feedback suele razonar el bug y el token; en **~5–8** unidades el retro **eco** del feedback (misconception duplicado, sin metacognición extra) | Residual **P2** sistemático |
| **Retrospective length** | weDo **24/24** &lt;40 w (spec 40–80); iDo varias 24–36 w; principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback | Residual **P2** dominante |
| **Feedback length** | ~8 unidades &lt;25 w (piso spec); peores: T1-B-E2 (~22), T1-B-E3 (~23), T2-B-E3 (~23), T3-A-E2/E3, T3-B-E3, T4-A-E3, T4-B-E3 | Residual **P2** |
| **iDo why** | T1-A/B y T2-A en ~42–53 w; T2-B…T4-B ~33–37 w (bajo o al borde del piso 40) | Residual **P2** en demos T2-B→T4-B |
| **Código/outputs** | Coherentes con theory y CASO-ARE-041; DEFECT `# DEFECT:` excelente; **wrong ≠ right** en traps verificados | **Sin** hueco de integridad |
| **youDo frame** | context CP-N4-A, objectives create/replay/conflict+422+GET, requirements, starter con `readiness()`, rubric 6, portfolioNote, retrospective de defensa (~66 w) | Pass |
| **Typo residual** | T2-B-E3 preamble: “se **redacting**/rechaza” (inglés mezclado) | **P2** polish |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (retros cortas sin self-check, eco feedback/retro, feedback &lt;25 w en varias, iDo why/retro levemente cortas, un typo). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish**, no reescritura estructural.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad leve) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S41-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido de matriz método/path/status (`201`/`404`/`200`/`200`). Preamble (~84 w) pide predicción y ancla “create ≠ 200 / colección vacía ≠ 404”. `why` (~53 w) en rango; retro repara 200 genérico y puente a We Do.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Title claro; bullets con éxito `S41-T1-A PASS` y límites anti-200-en-create. Instruction nombra DEFECT (POST → 200); feedback razona 201 vs clientes/OpenAPI; retro distinta (self-check “lista vacía → 200” + puente E2). Starter 200 → solution 201 discrimina.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~37 w → +1 frase de transferencia a contrato OpenAPI)
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T1-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Independiente fuerte: assess invertido (PASS con GET/200). Preamble ancla auditoría de tres samples. Feedback y retro cubren missing-first y matriz create; retro ~32 w sin self-check propio.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand if touched):**  
  Missing-first evita leer un campo que no existe. PASS exige la matriz de create (POST + `/jobs` + 201), no un 200 genérico de lectura. Pregunta: si el record trae `status=201` pero `method=GET`, ¿PASS o breach y por qué? Luego (E3) el mismo criterio se vuelve decisión de gate.
- **Code/output changes:** none

### S41-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real a CONTINUE / RETURN_CORRECT_HTTP_STATUS / REVIEW_RESOURCE_SEMANTICS. Instruction corta (aceptable en transfer). Retro con self-check de missing `method`. Feedback en piso (~26 w) pero razona cliente/OpenAPI.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Demo clara created/replay/conflict + keyset + `side_effects 1`. Preamble (~73 w) motiva reintento y gate CP-N4-A. `why` (~49 w) OK. Retro (~36 w) repara “misma key = replay sin mirar body” pero bajo piso 40 y sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Replay ≠ segundo create; body distinto bajo la misma key es conflicto. El error clásico es “si la key existe, reintento silencioso” sin comparar el body. Pregunta: ¿qué assert del gate mide un solo side effect? (`len(store)==1` / un job). We Do: implementar el store y luego assess/decide de auditoría.
- **Code/output changes:** none

### S41-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Guiado excelente: key mutada + siempre `"created"`. Feedback y retro **eco** fuerte (ambos “key liga body / store no crece / insertar siempre”). Instruction clara.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un reintento del cliente no debe crear un segundo job: la key es el candado, el body canónico es la llave. El error clásico es mutar la key (`key+len`) “para no pisar” y esconder el duplicado. Pregunta: si el segundo POST es idéntico, ¿qué label y qué largo de store esperas? Siguiente (E2): auditar hash, effects y version.
- **Code/output changes:** none

### S41-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess de idempotencia sana. Feedback (~22 w) y retro (~22 w) cortos y eco (“un efecto, hash, version”). Preamble desambigua cursor offset.
- **Checklist:** all pass; feedback/retro partial (longitud + eco)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Idempotencia sana es observable: un efecto, hash estable, cursor keyset (`job-*`) y versión explícita `v1`. Hash mismatch o effects&gt;1 ⇒ `RETURN_IDEMPOTENCY_CONFLICT` porque el cliente no debe ver un segundo job. Sin `version` no asumas v1.
- **Proposed retrospective (replace):**  
  No “arregles” inventando version o cursor: la evidencia incompleta es `MISSING`, no PASS. El error clásico es aprobar effects=2 si el hash “se ve”. Pregunta: ¿por qué un cursor `offset:20` no cuenta como keyset sano en este lab? Luego (E3): tokens de reintento fail-closed.
- **Code/output changes:** none

### S41-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer CONTINUE / RETURN_IDEMPOTENCY_CONFLICT / REPLAY_STORED_RESPONSE. Feedback corto (~23 w). Retro con self-check de body distinto (bueno). Token de incertidumbre `REPLAY_STORED_RESPONSE` es de lab (aceptable si preamble ancla tokens ≠ prod).
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Ante reintentos: el adverso activa `RETURN_IDEMPOTENCY_CONFLICT` por hash/effects (el cliente no debe ver un segundo job). Faltar version exige `REPLAY_STORED_RESPONSE` (token de lab: no inventes v1 ni “arregles” el record). CONTINUE solo con el predicado sano de E2.
- **Code/output changes:** none

### S41-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** DI con dos fakes (`swapped_stores 1 1`) excelente. Preamble (~64 w) ancla handler delgado. `why` (~42 w) al piso. Retro (~32 w) corta sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Handler delgado + store inyectable es el mismo hábito que `Depends` en FastAPI. El error clásico es meter SQL y status en el path. Pregunta: si el dominio importa `Request`, ¿puedes montar un test de contrato con fake store sin reescribir la ruta? We Do: reparar el handler gordo del starter.
- **Code/output changes:** none

### S41-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Multi-defect guiado (GLOBAL + status_code + ignora get_store). Instruction de 4 pasos; feedback razona tests con fakes; retro distinta (singleton/HTTP + puente E2).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T2-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Assess de métricas de boundary (líneas ≤5, flags). Feedback en rango (~39 w). Retro (~25 w) corta pero no es eco total.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Las métricas del lab (líneas, flags) son proxies de boundary, no dogmas de estilo de equipo. Sin `domain_called` no hay orquestación demostrada aunque el path “compile”. Pregunta: ¿qué fallaría en un TestClient si el dominio importara FastAPI? Luego (E3): tokens de review.
- **Code/output changes:** none

### S41-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer CONTINUE / THIN_THE_HANDLER / REVIEW_DEPENDENCY_BOUNDARY. Retro con self-check de `Request`. Instruction telegráfica OK en transfer.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** 422 + allow-list + `secret_leaked False` claros. Preamble pide predicción. `why` (~37 w) y retro (~33 w) bajo piso; misconception “200 con defaults” bien nombrado.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand if touched):**  
  Validación antes del dominio (como Pydantic/FastAPI 422); serialización por allow-list. El secreto del body crudo no viaja a la respuesta: OpenAPI declara el shape público, no el interno. Así el contrato de entrada y salida se puede testear sin red. En We Do dejarás de devolver el body crudo.
- **Proposed retrospective (expand):**  
  422 tipado + vista pública es el par mínimo de contrato de entrada/salida. El error clásico es 200 con leak o defaults inventados. Pregunta: ¿qué status devuelve FastAPI por defecto ante body inválido? We Do: implementar `handle` y luego assess de OpenAPI alineado.
- **Code/output changes:** none

### S41-T2-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Starter always-200 + body crudo. Preamble ancla secret vs campos públicos. Feedback razona privacidad/OpenAPI; retro distingue validar vs serializar.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~24 w)
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T2-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Fixture PASS = rechazo 422 bien formado — **aclarado en preamble** (R1 residual cerrado). Feedback razona “fallar bien”; retro corta pero alineada. Newbie ya no busca create 200 si lee el preamble.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro +self-check “¿PASS es create o rechazo?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer CONTINUE / REJECT_AND_REDACT / REGENERATE_OPENAPI. Retro con self-check de FastAPI 422. **Typo:** preamble “se **redacting**/rechaza”. Feedback ~23 w.
- **Checklist:** all pass; preamble partial (typo)
- **Severity residual:** P2
- **Proposed preamble fix (Contexto bullet only):**  
  - **Contexto:** en revisión de PR del control plane, tres snapshots deciden si el contrato sigue, se **redacta/rechaza** o se regenera la doc.
- **Proposed feedback (expand if touched):**  
  En revisión de PR: `REJECT_AND_REDACT` ante leak o 200 inválido (el cliente no debe ver secretos). Sin `openapi_matches` regenera el contrato — `REGENERATE_OPENAPI`. No merges un 200 con secret “para depurar”.
- **Code/output changes:** none

### S41-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Boundary async vs background + efecto en cola. Preamble motiva event loop. `why` (~37 w) y retro (~28 w) cortos.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Boundary = decisión documentada + efecto observable (cola). El error clásico es `await` de trabajo CPU como si fuera red. Pregunta: si el POST encola, ¿qué `status` de job esperas ver en la respuesta? (`queued`.) We Do: implementar choose/enqueue y assess de offload.
- **Code/output changes:** none

### S41-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Todo-async + nunca encola → solution discrimina. Feedback razona ahogo del control plane; retro “async ≠ más rápido” es misconception útil y distinta del feedback.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T3-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Flags de capacidad aclarados en preamble (R1 residual cerrado). Feedback (~23 w) y retro (~19 w) cortos; retro casi sin transferencia.
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Documentar `cpu_offloaded` y `durable_job` evita asumir que “ya está en background” solo porque el kind es io. Sin flag no hay evidencia de capacidad. Pregunta: ¿por qué el fixture PASS exige flags True aunque el work_kind sea io? (capacidad del path documentada, no solo el kind del request actual.) Luego (E3): tokens de capacity.
- **Code/output changes:** none

### S41-T3-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer limpio; retro con self-check `queued`. Feedback ~21 w.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  En capacity review: `MOVE_WORK_OFF_EVENT_LOOP` si CPU/durable bloquea el request (el loop no aguanta). Sin `durable_job` no se asume offload — `CHOOSE_BACKGROUND_BOUNDARY`. Incertidumbre de durable no es luz verde para CONTINUE.
- **Code/output changes:** none

### S41-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** try/finally + Problem Details en ambos caminos — excelente. Preamble predice open `[]`. `why` (~33 w) y retro (~28 w) cortos; misconception “solo cerrar en camino feliz” bien anclado en preamble, no en retro.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Cancel + close + payload seguro es el trío de timeout. El error clásico es 500 genérico con PII o cerrar el pool solo si `outcome==ok`. Pregunta: ¿por qué el error lleva `trace_id` y no email? We Do: implementar budget y assess de cascada client&gt;service&gt;db.
- **Code/output changes:** none

### S41-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Starter 500+email sin finally en timeout — defect de seguridad/lifecycle de calidad. Feedback razona trío cancel/close/payload; retro corta pero con puente E2.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Cascada 900/700/450 vs invertida. Feedback y retro **eco** (ambos “cascada client&gt;service&gt;db / pool abierto”).
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Budgets invertidos matan el cancel interno: el cliente corta antes que la DB y el worker sigue ocupado. Pool abierto tras timeout es breach de lifecycle, no solo de status. Pregunta: si `resource_closed` falta, ¿inventas True o devuelves MISSING? Luego (E3): tokens de incidente.
- **Code/output changes:** none

### S41-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer CONTINUE / CANCEL_AND_CLOSE / RECALCULATE_TIMEOUT_BUDGET. Retro con self-check trace_id vs email. Feedback ~24 w (piso).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: feedback +1 frase de por qué RECALCULATE ante missing)
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** seed→nivel + pirámide 12≥5≥2. Preamble anti-e2e-único. `why` (~35 w) y retro (~24 w) cortos; retro casi sin self-check.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  El nivel correcto localiza el diseño roto. El error clásico es solo unit o solo e2e. Pregunta: un 200 en create sembrado, ¿qué nivel debe atraparlo? (contract.) We Do: mapear seeds y forma de pirámide.
- **Code/output changes:** none

### S41-T4-A-E1 (weDo, guided) — **A**
- **Diagnosis:** siempre True + pyramid_ok solo suma — DEFECT claro. Feedback razona localización; retro “pirámide invertida” es misconception distinto.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess de tres capas + seed. Feedback y retro **eco** (“tres capas + seed / colador”).
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Una sola capa unit no demuestra el contrato HTTP: un 200 en create puede pasar desapercibido. Sin `seeded_failure_detected` no hay prueba de que el colador funciona aunque la pirámide “tenga tres nombres”. Pregunta: ¿qué bloqueas en el merge si el seed http no se atrapa? Luego (E3): tokens de test plan.
- **Code/output changes:** none

### S41-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer limpio; retro con self-check “200 en create → contract”. Feedback ~23 w.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: feedback al piso 25 w)
- **Proposed residual:** none required
- **Code/output changes:** none

### S41-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** 429 + log sin email. Preamble gate CP-N4-A. `why` (~36 w) y retro (~32 w) bajo piso.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Throttle real + log limpio cierran el edge del control plane. El error clásico es 200 con remaining negativo o PII en log “para depurar”. Pregunta: ¿qué header/campo de compat v1 preserva el lab además de `job_id`? (`trace_id` / `X-API-Version` en theory.) We Do: implementar admit/log y assess de consumer v1.
- **Code/output changes:** none

### S41-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Nunca 429 + log crudo. Feedback y retro **eco** (429 recuperable + redaction del log).
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Remaining solo existe en allow; en 429 la señal útil es `retry_after_s`, no un remaining negativo. Redaction del log es parte del contrato de observabilidad, no un “extra de seguridad”. Pregunta: si used=110, ¿qué status y qué campo debe ver el cliente? Siguiente (E2): assess de consumer, cuota y pii_in_log.
- **Code/output changes:** none

### S41-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess consumer+cuota+trace+no pii. Feedback y retro **eco** fuerte (“compat + cuota + privacidad / sin flag pii”).
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El edge del gate CP-N4-A no se juzga por un solo número: consumer v1 roto con cuota “OK” sigue siendo breach. Sin flag `pii_in_log` no asumas redaction. Pregunta: ¿por qué el valid exige `trace_id` con prefijo `tr-`? Luego (E3): tokens del gate.
- **Code/output changes:** none

### S41-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Cierre natural hacia You Do. Retro con pregunta de puente a You Do (create/replay/conflict + 422 + GET). Feedback ~21 w.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: feedback +frase de por qué INSPECT ante missing pii)
- **Proposed residual:** none required
- **Code/output changes:** none

### youDo (youDo) — **A**
- **Diagnosis:** Marco de proyecto **sólido**: context Arequipa, objectives create/replay/conflict + 422 + GET, requirements medibles, starter con DEFECT de idempotencia ignorada y `readiness()` que aserta side effect único, secret fuera, get 200. `portfolioNote` y rúbrica cubren gate y trade-offs stdlib/FastAPI. **Retrospective presente** (~66 w): invariantes, PII, frase de impacto, puente S42 — cierra el gap R1.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none (no tocar asserts de `readiness()`)

---

## Priority order

### P0
- **Ninguno.** Cobertura de campos y fade E1→E2→E3 cumplen el test de true-newbie a nivel estructural. Código/outputs íntegros.

### P1
- **Ninguno bloqueante.** Ninguna unidad deja al newbie sin escena, meta, éxito o cierre usable.

### P2 (polish — Fixer R2 si hay presupuesto)
1. **Retrospectives weDo (24/24 bajo piso 40 w):** expandir a 40–80 w con principle + misconception *distinto* del feedback + self-check o puente; priorizar unidades con **eco** fuerte:  
   T1-B-E1, T1-B-E2, T3-B-E2, T4-A-E2, T4-B-E1, T4-B-E2  
2. **Feedback corto (&lt;25 w):** T1-B-E2, T1-B-E3, T2-B-E3, T3-A-E2, T3-A-E3, T3-B-E3, T4-A-E3, T4-B-E3 — +1 frase de *por qué importa al cliente/OpenAPI/gate*  
3. **iDo why/retro T2-B → T4-B:** subir al piso 40–50 w; T1-B-DEMO retro también  
4. **Typo T2-B-E3:** “redacting” → “redacta”  
5. **Opcional:** instructions E3 muy cortas (~17 w) — no bloquear; si se tocan, 1 línea de “conserva assert de orden” ya basta  

---

## Residual risks

1. **Nombre de archivo vs. contenido:** `s41-llm-finetuning.ts` / id `llm-finetuning` no reflejan “APIs FastAPI”; fuera del alcance de prosa de ejercicios — el Fixer no debe renombrar el id sin orquestación de curso.  
2. **Tokens de lab vs. producción:** preambles de E3 anclan “tokens de lab, no enums de prod” en varios subtemas; el intro de weDo también. Riesgo residual bajo si el learner salta el intro.  
3. **Homogeneidad del esqueleto assess/decide:** el patrón E2/E3 es el mismo en 8 subtemas; las **escenas** de preamble ya diferencian (auditoría de status vs reintento vs capacity vs incidente vs edge). No es clone vacío, pero un learner fatigado puede “solo invertir el if” sin leer el dominio.  
4. **T1-B-E3 token `REPLAY_STORED_RESPONSE` ante missing version:** es convención de lab (fail-closed de incertidumbre), no semántica HTTP estándar; la preamble debe seguir anclando tokens de lab.  
5. **Retros cortas:** el mayor riesgo post-R1 es cerrar el tab sin metacognición (eco feedback → sensa de “ya lo leí”). Prioridad P2 de expandir retros con eco.  
6. **Código/outputs:** sin indicios de wrong≈right; el Fixer **no** debe reescribir asserts canónicos al pulir prosa.  
7. **Longitud anti-bloat:** no ensayar en `instruction` al expandir retros/feedback.

---

## Fixer notes (Round 2 operativos)

- **No** reintroducir essay en `instruction`; solo pasos.  
- Preferir **reemplazar** retrospectives con eco (texto completo propuesto en ledger) antes de tocar preambles que ya pasan checklist.  
- Un typo obligatorio si se toca T2-B-E3: `redacting` → `redacta`.  
- Preservar salidas exactas: `S41-T*-* PASS`, triples assess/decide, y `readiness()` del youDo.  
- Español profesional peruano; fixtures sintéticos Arequipa; sin PII real.  
- Validar build estático de la sección tras el polish.  
- Si el presupuesto es mínimo: solo (1) retros con eco, (2) typo T2-B-E3, (3) feedback &lt;25 w en E3 de cierre de subtema.

---

## Round-1 → Round-2 delta (contrast only)

| R1 issue | R2 status |
|----------|-----------|
| 8 iDo sin preamble/retrospective | **Fixed** — presentes en las 8 |
| 24 weDo sin title/preamble/retrospective | **Fixed** — presentes en las 24 |
| instruction essay denso | **Fixed** — solo pasos |
| youDo sin retrospective | **Fixed** — defensa ~66 w |
| T2-B-E2 PASS = rechazo confuso | **Fixed** en preamble |
| T3-A-E2 flags confusos | **Fixed** en preamble |
| Feedback thin | **Mejorado** en la mayoría; residual P2 en ~8 unidades |
| Retros metacognitivas | **Presentes** pero sistemáticamente cortas / a veces eco — residual P2 |

---

Section 41 exercise pedagogy review complete. Ready for the Fixer prompt.
