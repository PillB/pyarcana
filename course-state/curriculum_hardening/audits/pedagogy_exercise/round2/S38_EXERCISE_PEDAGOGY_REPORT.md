# S38 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Concurrencia, observabilidad y workflows resilientes
- **shortTitle:** Concurrencia y resiliencia
- **id:** `performance-extreme`
- **index:** 38
- **source:** `src/lib/course/sections/s38-performance-extreme.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A bound/modelo · T1-B GIL/payload IPC · T2-A cola/rate limit · T2-B timeout/finally · T3-A o11y/corr · T3-B redacción/SLO · T4-A checkpoint/idempotencia · T4-B retry/DLQ/runbook
- **hilo:** operación del triage **CP-N3-C** — batch sintético `CASO-LIM-038` / `c-synth-1` (Red Andina ficticia); capas: medir bound → payload compacto → backpressure → timeout → o11y → SLO/error budget → checkpoint → retry/DLQ/runbook; sin red real ni PII; puente a S39 Case Triage N3
- **Round 1 context:** `round1/S38_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 / 40–80, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8 demos ~405–671), `weDo.steps[]` (24 retos ~678–1959) y `youDo` (~1962–2066): title, preamble, instruction, feedback, retrospective, why, starter `# DEFECTO`, solution output.
- Scored for a **true newbie** (qué practico / por qué importa / cómo sé que gané / qué debe quedar), independent of Round-1 proposal text.
- Word counts measured only as gates (no bulk prose generation).
- Integrity spot-checks: starter wrong path ≠ solution stdout on representative E1/E2/E3 across T1–T4.
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 3–7 palabras, español PE, skill-first | Pass; **T4-B-E1** embebe la respuesta (`attempt 3 = 0.8`) — spoiler leve **P2** |
| **Preamble shape** | weDo en 4 bullets contexto/meta/éxito/límites (~40–62 w; spec permite “4 short bullets”); iDo narrativos con “no escribas” + predicción (~55–76 w; varios bajo piso 80 narrativo, legibles) | Pass estructural |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECTO; E2/E3 menos migas | Pass; varias ~18–36 w (bajo piso 40; no bloquear) |
| **E1→E2→E3 fade** | Superficies distintas: cpu map ↔ io map ↔ measure_first; JSON ↔ GIL label ↔ compact_payload; bucket ↔ maxsize ↔ ban_risk; timeout/on_fail ↔ finally ↔ open_runbook; corr ↔ 3 pilares ↔ pii_raw; teléfono ↔ multi-SLI ↔ freeze; estados ↔ key:ver ↔ resume_from; backoff ↔ poison/DLQ ↔ runbook dict | Pass — **no** clones numéricos; riesgos R1 de E1/E2 espejo y redacción email/tel **mitigados** en prosa |
| **Token bucket estático** | T2-A-E1 preamble dice “didáctico estático, sin refill” | Riesgo R1 **cerrado** |
| **Feedback vs retrospective** | Feedback ancla bug + impacto a c-synth-1 / CP-N3-C (mejora clara vs R1). En **~15** unidades el retro **abre con la misma frase** del feedback (eco: principio repetido, metacognición débil) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈21–33 w (spec 40–80); iDo demos ~22–38 w. Principio + puente a menudo presentes; self-check (“Pregunta:”) en varios E2, ausente en muchos E1/E3/iDo | Residual **P2** |
| **Feedback length** | Mayoría ~20–36 w; varios en/bajo piso 25 (T1-A-E3 ~24, T1-B-E2 ~24, T1-B-E3 ~23, T3-B-E3 ~20, T4-B-E1 ~21, T4-B-E2 ~19) | Residual **P2** |
| **iDo why** | 8/8 en rango ~44–66 w | Pass |
| **Código/outputs** | Coherentes con theory y CP-N3-C; `# DEFECTO:` excelente; wrong ≠ right en traps verificados | **Sin** hueco de integridad |
| **youDo frame** | context, objectives, requirements, starter 4 pilares + `apply_once`/checkpoint, rubric, portfolioNote, retrospective de defensa (~69 w) | Pass — fuerte |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal (P0 title/preamble/retrospective). Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback↔retro, retros cortas sin self-check, feedback en piso, un title que spoilea 0.8). **No** hay campos ausentes ni defectos wrong≈right. Prioridad del Fixer R2 = **P2 polish selectivo**, no reescritura estructural.

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

### S38-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example claro: `pick("io")` → async_or_threads, wall/cpu 100/95 → processes. Preamble pide predicción y ancla gate CP-N3-C. `why` (~66 w) en rango (GIL, measure_first, puente We Do). Retro repara “async siempre gana” y cierra al mapa bound→modelo.
- **Checklist:** all pass (preamble ~76 w cerca del piso narrativo)
- **Severity residual:** none (P2 opcional: retro ~37 w → +self-check “¿qué mediste para rechazar async en features?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Title skill-first; bullets con éxito de 3 líneas y límites anti-hardcode/pools. Instruction nombra DEFECTO (siempre async). Feedback ancla GIL + runbook “async por moda”; retro distinta (mapa como contrato + puente E2 normalización). Starter wrong → solution discrimina.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T1-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Espejo I/O real (no clone numérico): starter fuerza processes. Preamble diferencia escena (red mock, wall >> cpu). Feedback razona IPC innecesario; retro con self-check wall vs. CPU. Fade auténtico respecto a E1.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~27 w al piso 40)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer measure_first sólido. Feedback y retro **abren igual**: “Sin medición no hay elección defendible…” (eco fuerte). Feedback ~24 w (piso). Instruction y éxito claros.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Medir wall vs. CPU convierte la moda del framework en un bound defendible en el runbook. El error clásico es documentar “usamos async” y omitir el profile del path. Pregunta: con wall=100 y cpu=95, ¿qué bound imprime tu `measure_bound` y por qué no `io`? En T1-B medirás el blob que cruza procesos, no solo el modelo.
- **Proposed feedback (expand if touched):**  
  Sin medición no hay elección defendible de concurrencia. El gate CP-N3-C espera bound documentado en el runbook del batch (100/95 → cpu → processes), no el framework de moda que dejó el starter.
- **Code/output changes:** none

### S38-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Bytes 31 vs full, GIL limited, prefer compact. Preamble une IPC + PII. `why` en rango. Retro (~33 w) corta sin self-check; repara bien “process pool siempre acelera”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Compacto es performance y privacidad a la vez: menos bytes de IPC y sin email en el blob del worker. El error clásico es copiar el DataFrame o el email “por si acaso”. Pregunta: si compact y full midieran lo mismo, ¿seguirías enviando el email al process pool? We Do: JSON real, etiqueta GIL y prefer medido.
- **Code/output changes:** none

### S38-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Defecto sutil excelente (`str` vs JSON; ok exige parse real). Feedback y retro **comparten** “costo de IPC se mide sobre el blob…”, no el repr. Principio correcto; eco reduce metacognición.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El contrato entre procesos es un blob parseable, no el `repr` de Python. El error clásico es “el `len` coincidió, listo” y fallar el parse al otro lado. Pregunta: ¿por qué `str({"x": 2})` no pasa el assert de `ok` aunque tenga longitud parecida? Siguiente: etiquetar GIL limited en threads CPU.
- **Code/output changes:** none

### S38-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Política `gil_status(threads,cpu)→limited` clara. Feedback y retro se solapan en promesas de throughput al on-call; retro sí añade self-check I/O (bueno). Feedback ~24 w.
- **Checklist:** all pass; feedback/retro partial (eco leve + longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  La etiqueta `limited` evita promesas de speedup multi-thread que el on-call del scoring no verá. En CPython, CPU denso con threads no escala linealmente: documenta limited y evalúa processes con payload compacto.
- **Proposed residual on retro:** opcional expandir a ~40 w manteniendo la pregunta sobre bound I/O.
- **Code/output changes:** none

### S38-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer compact_payload medido; email sintético; éxito bytes 31. Feedback y retro cercanos (“privacidad y performance”) pero retro añade error clásico “por si acaso” + puente T2 — usable. Feedback ~23 w (bajo piso).
- **Checklist:** all pass
- **Severity residual:** P2 opcional (feedback +2–5 w anclando process pool de features)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T2-A-DEMO (iDo) — **A**
- **Diagnosis:** put_nowait/Full + token bucket; preamble ataca `full()` consultivo. `why` distingue capas cola vs tasa y bucket estático. Retro repara cola infinita / flood y puente We Do.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~38 w → self-check “¿quién protege memoria vs API?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** rate=2 vs starter rate=3; preamble nombra bucket estático (cierra riesgo R1). Feedback y retro **abren igual** (“El bucket acota la ráfaga…”). Éxito 2 / third False claro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Rate=2 fija dos allows y un deny visible; el fixture no rellena tokens (estático). El error clásico es subir el rate “para que pase el test” y disfrazar flood al mock. Pregunta: si en prod el bucket se rellena por ventana, ¿qué cambia en tu runbook respecto a este lab? Siguiente: acotar la cola del worker con maxsize.
- **Code/output changes:** none

### S38-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** maxsize=50 / backpressure vs unbounded. Feedback y retro repiten “maxsize es política de memoria”; retro añade pregunta de runbook (drop/block/DLQ) — self-check salva el eco.
- **Checklist:** all pass; retro partial (eco de apertura)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Una cola sin tope no es “más simple”: es deuda de memoria bajo pico. El error clásico es dejar `maxsize` None en staging y copiar a prod. Pregunta: bajo pico, ¿bloqueas, dropeas o mandas overflow a DLQ — y dónde lo escribes? Ese hábito se reutiliza cuando el productor del batch de c-synth-1 se acelera.
- **Code/output changes:** none

### S38-T2-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer ban_risk real (rate=1, no clone del E1 con otro número). Feedback y retro comparten “cortesía y supervivencia”; retro añade sandbox→prod y puente timeout T2-B. Distinción útil.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (diferenciar primera frase del retro)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Timeout 2.5s vs 1s + finally. Preamble del hang silencioso excelente. Retro (~27 w) corta: principio sí, self-check no.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Timeout + cierre determinista son el mínimo viable de I/O externa: fallar observable es mejor que colgar el pool. El error clásico es “el proveedor casi siempre responde”. Pregunta: si el `finally` no corriera tras timeout, ¿qué se filtra en el worker? We Do: política seconds>0, close y open_runbook.
- **Code/output changes:** none

### S38-T2-B-E1 (weDo, guided) — **A**
- **Diagnosis:** geocoding mock 8000 ms; starter seconds=0/ignore. Feedback ancla hang disfrazado; retro distinta (timeout sin on_fail + puente finally). Buen modelo post-fix.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** finally vs leak. Feedback y retro abren “Sin close determinista el pool se agota”; retro salva con pregunta de context manager. Feedback en piso (~24 w).
- **Checklist:** all pass; retro partial (eco de apertura)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Liberar la conn en `finally` (o context manager) es higiene de pool, no un detalle de sintaxis. El error clásico es cerrar solo en el happy path y agotar recursos bajo carga. Pregunta: en prod, ¿qué ventaja concreta da `with` frente a un `finally` manual olvidable? Ese hábito se reutiliza en todo fetch del triage.
- **Code/output changes:** none

### S38-T2-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer a incidente operable (open_runbook). Starter niega con timeout_s=0; solution corrige semántica y usa budget 1.0 — both paths hit after fix. Feedback y retro comparten “Nombrar el incidente…”; retro añade silence under hang + puente o11y T3. Eco parcial aceptable.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (variar primera frase del retro)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** scored + corr-1 + latency_ms + pii_raw False. Preamble de reconstrucción on-call fuerte. Retro (~29 w) corta sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Un on-call reconstruye el path con correlation_id, no con el email en claro ni con un print suelto. El error clásico es loggear el blob completo “para debug”. Pregunta: si solo tienes case_id en un servicio y no corr, ¿qué tramo del path se rompe? We Do: corr obligatorio, tres pilares y pii_raw False.
- **Code/output changes:** none

### S38-T3-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** corr=None → propaga corr-1. Feedback ancla intake→score; retro corta (~21 w) con error clásico case_id sin corr. Menos eco que el promedio.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (retro al piso 40 + self-check “¿corr y case_id son lo mismo?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres pilares; starter solo logs. Feedback y retro abren “Un solo pilar no basta…”; retro añade pregunta metrics sin corr (bueno). Eco de apertura.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Logs, metrics y traces responden preguntas distintas: evento local, agregados de cola/latencia y path del caso. El error clásico es “con un INFO basta”. Pregunta: si solo tienes metrics sin corr en el log, ¿qué incidente del batch no puedes cerrar? Ese hábito se reutiliza en el You Do al trazar c-synth-1.
- **Code/output changes:** none

### S38-T3-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** pii_raw + redact email (distinto de T3-B-E1 teléfono — bien). Feedback y retro repiten “Privacidad es parte del contrato de o11y…”. Principio correcto; eco.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `pii_raw=False` y máscara de email son contrato del gate, no un extra de compliance al final del sprint. El error clásico es “solo es sandbox / example.pe”. Pregunta: ¿por qué el case_id sintético no se enmascara igual que el email? En T3-B redactarás teléfono con otra máscara y evaluarás SLO con error budget.
- **Code/output changes:** none

### S38-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** SLO p95, redact, ship_features. Preamble de error budget como decisión. Retro (~27 w) corta; nombra misconception de comparar al revés / ignorar error_rate (puente We Do multi-SLI).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Error budget convierte el SLO en decisión de equipo (ship vs freeze), no en eslogan del dashboard. El error clásico es celebrar p95 bueno e ignorar error_rate, o comparar al revés. Pregunta: si p95=250 y budget=200, ¿qué action debe salir? We Do: redactar teléfono, slo_ok compuesto y freeze al agotar budget.
- **Code/output changes:** none

### S38-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** 90****01; escena on-call con case_id/corr. Feedback y retro eco “Redacción es mecánica…”. Instruction corta (~21 w) pero suficiente.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Enmascarar 2+****+2 es revisable en code review y deja al on-call con case_id y corr, no con el número crudo. El error clásico es loggear “solo un rato” para debug. Pregunta: si el teléfono sintético cambia de longitud, ¿qué invariante de máscara mantienes? Siguiente: evaluar p95 y error_rate juntos.
- **Code/output changes:** none

### S38-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** multi-SLI; starter invertido + ignora error_rate — excelente. Feedback y retro repiten “celebrar latencia buena con errores altos”; retro salva con self-check 0.05.
- **Checklist:** all pass; retro partial (eco de apertura)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un SLO multi-SLI obliga a mirar p95 **y** error_rate con `<=`, no un solo umbral al revés. El error clásico del starter es alerta falsa o silencio con error_rate alto. Pregunta: si p95=100 (ok) y error_rate=0.05, ¿qué debe devolver `slo_ok` y por qué miente el dashboard si devuelves True? Luego (E3): freeze cuando el budget llega a 0.
- **Code/output changes:** none

### S38-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** freeze al remaining=0; starter ship + uptime_only. Feedback (~20 w) y retro abren “Sin error budget el SLO es eslogan”; retro añade ship ciego + puente checkpoint T4.
- **Checklist:** all pass; feedback/retro partial (eco + feedback corto)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Sin error budget el SLO es eslogan. Al remaining=0 el scoring sintético congela deploys no urgentes: estabilidad primero. El starter que siempre shippea e imprime `uptime_only` niega la política operativa del gate.
- **Proposed retrospective (replace):**  
  El presupuesto de error convierte la violación en acción de equipo, no en un gráfico sin consecuencia. El error clásico es seguir shippeando features con remaining en cero. Pregunta: ¿qué documentarías en el runbook cuando el freeze se activa? En T4 el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.
- **Code/output changes:** none

### S38-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** key c1:features:v1 + resume score. Preamble de crash/side effects fuerte. Retro (~28 w) corta sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Reanudar mal es tan malo como no reanudar: volver a intake “por si acaso” duplica enqueues y tickets. El error clásico es rehacer un paso `done` sin store de claves. Pregunta: si last_done es features, ¿qué imprime `resume_from` y por qué no features otra vez? We Do: estados, key con versión y mapa NEXT.
- **Code/output changes:** none

### S38-T4-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** failed terminal; starter 3 estados. Feedback ancla DLQ/retry; retro corta (~20 w) pero con misconception “colapsar error en running” + puente key. Usable.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (retro al piso 40)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T4-A-E2 (weDo, independent) — **A**
- **Diagnosis:** case:step:ver; starter omite ver y dup True. Feedback razona colisión de deploys; retro con self-check sin ver. Menos eco mortal.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~21 w)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** resume_from score vs hardcode intake — anti-patrón de rehacer trabajo. Feedback ancla gate de idempotencia; retro distingue last_done vs resume_from + puente DLQ T4-B. Instruction corta (~18 w) OK en transfer. Fade auténtico.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** [0.1,0.2,0.4], poison→dlq, runbook True. Preamble de reinyección ciega de DLQ excelente. Retro (~22 w) la más corta de iDo; principio sí, self-check no.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Retriable espera con backoff; poison va a DLQ con replay controlado, no a retry_forever. El error clásico es reinyectar la DLQ entera sin inspección. Pregunta: ¿por qué 0.1→0.2→0.4 no es lineal? We Do: fórmula attempt=3, ruta poison y dict de on-call.
- **Code/output changes:** none

### S38-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Drill backoff correcto, pero **title spoilea** el resultado (`attempt 3 = 0.8`). Feedback y retro abren “Backoff exponencial reduce presión…”. Feedback ~21 w.
- **Checklist:** all pass; title partial (spoiler); retro partial (eco)
- **Severity residual:** P2
- **Proposed title:** Backoff exponencial, no lineal  
- **Proposed retrospective (replace):**  
  La espera crece como base×2^attempt y deja respirar al mock entre reintentos. El error clásico es sleep fijo o lineal que recrea la ráfaga. Pregunta: con base 0.1 y attempt 3, ¿por qué 0.8 y no 0.3? Siguiente: poison a DLQ con replay controlado.
- **Code/output changes:** none (output 0.8 se conserva; solo no adelantarlo en el title)
- **Validation notes:** Hints ya dan la fórmula; el title no necesita el valor canónico.

### S38-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** poison→dlq. Retro más corta del weDo (~18 w): eco del feedback + una pregunta. Principio correcto; metacognición mínima.
- **Checklist:** all pass; retro partial (eco + longitud); feedback ~19 w bajo piso
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  Poison + replay controlado es higiene de cola: retry_forever contamina el throughput del batch y reinyecta el mismo fallo malformado. El starter que imprime `uncontrolled` niega el contrato de DLQ del gate.
- **Proposed retrospective (replace):**  
  Un mensaje que falla siempre no se cura con más intentos: se aísla y se reinyecta caso a caso tras inspección. El error clásico es borrar la DLQ “para limpiar” o reinyectar en bucle. Pregunta: ¿por qué el replay ciego devuelve el mismo poison a la cola caliente? Ese hábito se reutiliza en el runbook del You Do.
- **Code/output changes:** none

### S38-T4-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Cierre operativo fuerte: runbook con restart_worker. Feedback y retro comparten “entregable de operación / no wiki”; retro añade error clásico del incidente pasado + puente You Do/S39. Eco parcial; transfer real.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (variar apertura del retro)
- **Proposed residual:** none required
- **Code/output changes:** none

### S38-youDo (youDo) — **A**
- **Diagnosis:** Marco de proyecto maduro (4 pilares, apply_once, checkpoint, NotImplemented en measure/pick/fetch/runbook). Retrospective de defensa con tres preguntas (invariante / real vs sintético / frase de impacto 30s ante CP-N3-C/S39) ~69 w en rango. Context no se duplica en preamble — correcto.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
- Ninguno. Cobertura de campos completa; sin wrong≈right; outputs canónicos intactos.

### P1
- Ninguno bloqueante. (Si el Fixer solo tiene presupuesto mínimo: atacar el **eco feedback↔retro** en los peores ~8–10 units y el **title spoiler** de T4-B-E1.)

### P2 (polish selectivo — no reescritura masiva)
1. **Eco feedback/retrospective** (misma oración de apertura) — priorizar:  
   T1-A-E3, T1-B-E1, T2-A-E1, T2-A-E2, T2-B-E2, T3-A-E2, T3-A-E3, T3-B-E1, T3-B-E2, T3-B-E3, T4-B-E1, T4-B-E2  
   → retro debe añadir self-check y/o transfer; feedback se queda con el *por qué del bug*.
2. **iDo retrospectives cortas** (~22–38 w) — expandir con self-check donde se toque: T1-B, T2-B, T3-A, T3-B, T4-A, T4-B demos.
3. **Feedback bajo piso 25 w** — T1-A-E3, T1-B-E3, T3-B-E3, T4-B-E1, T4-B-E2 (+1–2 frases de impacto a c-synth-1 / gate).
4. **S38-T4-B-E1 title** — quitar el valor `0.8` del título (p. ej. “Backoff exponencial, no lineal”).
5. **weDo retros al piso 40 w** solo en unidades ya tocadas por (1)–(3); no inflar las que ya son **A**.

---

## Residual risks
- **Playground sin pools reales:** contratos (pick, timeout, GIL) sin Thread/ProcessPoolExecutor en browser — no “arreglar” con multiproceso en el playground; You Do ya pide ensayo local.
- **Token bucket estático:** E1 ya lo declara; no presentar el lab como bucket de prod completo.
- **Hints E3** a veces cerca de la fórmula (measure_bound, backoff) — andamiaje mínimo OK; no es P0.
- **Nivel “Competente a experto”:** prosa PE operativa (on-call, runbook, batch) sin diluir GIL/IPC/idempotencia; polish R2 no debe infantilizar.
- **Outputs canónicos de 3 líneas:** no cambiar strings de solución salvo execute-and-diff justificado.
- **T2-B-E3 starter vs solution call site:** starter invoca `needs_incident(5000, 0)`; solution usa `(5000, 1.0)` tras arreglar la semántica — ambos deben producir incident True; no unificar a ciegas sin re-ejecutar.

---

## Fixer R2 handoff (checklist)
- [ ] No hay P0 de cobertura; **no** regenerar preambles en masa
- [ ] Diferenciar feedback vs retrospective en units listados (eco)
- [ ] Expandir retros iDo/weDo cortas **solo** donde se edite
- [ ] Title T4-B-E1 sin spoiler del 0.8
- [ ] Feedback bajo piso: +impacto operativo donde se toque
- [ ] Español profesional peruano; sin PII real; fixtures CASO-LIM-038 / c-synth-1
- [ ] No alterar outputs de solución salvo justificación
- [ ] Sin generadores ni plantillas bulk
- [ ] Validar que la sección sigue compilando en el build estático del curso

---

Section 38 exercise pedagogy review complete. Ready for the Fixer prompt.
