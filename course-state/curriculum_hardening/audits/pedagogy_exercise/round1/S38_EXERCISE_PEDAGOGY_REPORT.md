# S38 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Concurrencia, observabilidad y workflows resilientes
- **shortTitle:** Concurrencia y resiliencia
- **id:** `performance-extreme`
- **index:** 38
- **source:** `src/lib/course/sections/s38-performance-extreme.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S38-T1-A bound/modelo · T1-B GIL/payload IPC · T2-A cola/rate limit · T2-B timeout/finally · T3-A o11y/corr · T3-B redacción/SLO · T4-A checkpoint/idempotencia · T4-B retry/DLQ/runbook
- **hilo de caso:** operación del triage **CP-N3-C** — batch sintético `CASO-LIM-038` / `c-synth-1` (Red Andina ficticia); endurece por capas: medir bound → payload compacto → backpressure → timeout → o11y → SLO/error budget → checkpoint → retry/DLQ/runbook; sin red real ni PII; puente a S39 Case Triage N3

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective, checklist context/goal/success/constraints, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~404–631), `weDo.steps[]` (24 ejercicios, ~637–1751) y `youDo` (~1754–1856) en `s38-performance-extreme.ts`.
- Contrastado con theory T1–T4, learning outcomes de operación CP-N3-C y contratos (GIL, put_nowait/Full, corr, last_done→resume_from, poison→DLQ).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S38 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra skill + fixture; no sustituye preamble formal |
| I Do `why` | Presente; think-aloud útil (1–3 frases), a menudo **bajo el piso 40–90 palabras** del spec |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · CASO-LIM-038 · Contrato · DEFECTO del starter · salidas exactas” en un solo bloque: meta, éxito y límites mezclados; legible para quien ya opera batch de scoring, **opaco** para newbie sin escena de on-call en Lima |
| We Do `feedback` | 1 frase; nombra el principio (bien); a menudo plantilla “explica por qué…” sin anclar *por qué importa al worker de c-synth-1 o al gate CP-N3-C* |
| Starter `# DEFECTO:` | **Excelente** en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable para guided); E3 transfer a veces da la forma casi completa (andamiaje mínimo OK) |
| Fade E1→E2→E3 | **Real por contenido**: E1 repara un defecto del contrato; E2 fija política válida/inválida o segundo pilar del subtema; E3 transfiere a incidente sintético (measure_first, ban_risk, open_runbook, error_budget, resume_from, runbook dict). **No** son tres clones del mismo print con números distintos |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter de 4 pilares **sólidos**; `NotImplementedError` en measure/pick/fetch/runbook; apply_once y checkpoint ya scaffolded |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N3-C; **no** proponer cambios de output salvo notas puntuales |
| Ética / privacidad del hilo | Consistente: PII sintético, `pii_raw=False`, redacción, sin red real |

**Patrón dominante:** el andamiaje de *código* (bugs nombrados, outputs canónicos de 3 líneas, fade E1→E3 con transfer real, youDo con pilares y drill de crash/resume) es maduro y alineado a operación CP-N3-C. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa el batch de `c-synth-1` bajo proveedor lento, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S38-T1-A-DEMO (iDo)
- **Diagnosis:** Worked example claro: `measure_bound(100, 95)` → cpu → `processes`, y `pick("io")` → `async_or_threads`. La `description` nombra wall/CPU y modelo; falta `preamble` que diga *qué observar* (bound medido, no moda de framework) y `retrospective` del misconception “async siempre gana”. El `why` es think-aloud corto (bajo piso de palabras).
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el batch sintético de Red Andina, el tramo de features de `c-synth-1` satura CPU y el de normalización espera red mock. En esta demo mido wall vs. CPU y elijo el modelo de concurrencia *después* de etiquetar el bound. No escribas aún: predice si 100 ms wall y 95 ms CPU piden processes o async, y por qué `pick("io")` no usa processes. Si eliges framework por moda, el runbook del gate CP-N3-C no se defiende.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): wall ≈ cpu implica bound `cpu` y en CPython conviene processes por el GIL; wall >> cpu implica espera I/O y async/threads liberan el hilo; `measure_first` es disciplina de S37 aplicada a concurrencia. Puente a We Do: reparar `pick` que ignora bound o fuerza processes en I/O.
- **Proposed retrospective:**  
  Si puedes justificar processes para features densas *sin* decir “porque me gusta multiproceso”, ya mides antes de elegir. El error clásico es async en CPU pura. En We Do corregirás el mapa bound→modelo y el flag `measure_first`.
- **Code/output changes:** none
- **Validation notes:** Output `async_or_threads` / `cpu processes` / `ok True` alineado a theory T1-A.

---

### S38-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: starter siempre devuelve `async_or_threads` aunque bound sea `cpu`. Instruction densa mezcla ID, contrato, DEFECT y salidas; sin title, preamble ni retrospective. Feedback pide “explica por qué processes…” pero no ancla escena de features densas del triage.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** CPU-bound pide processes, no async
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-038-1A` el profile sintético del tramo features muestra wall≈cpu; el worker no puede “ganar” con async puro.  
  - **Meta:** implementar `pick(bound)` para que `cpu` devuelva `processes`.  
  - **Éxito:** tres líneas `processes` / `bound cpu` / `ok True`.  
  - **Límites:** no hardcodees solo el caso feliz sin mapa; no lances pools reales; datos sintéticos sin red.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `pick` ignora `bound` y devuelve siempre `async_or_threads` (DEFECTO).  
  2. Mapea `io`→`async_or_threads`, `cpu`→`processes`, `mixed`→`batch_then_io`.  
  3. Con `bound = "cpu"`, imprime la elección, `bound cpu` y `ok True`.  
  4. No uses red ni PII.
- **Proposed feedback improvement:**  
  Processes evaden el GIL en features densas de Python puro; async no acelera CPU. Documentar el bound en el runbook evita reabrir el incidente “elegimos async por moda”.
- **Proposed retrospective:**  
  El mapa bound→modelo es el primer contrato operable del batch. El error clásico es async en CPU. Siguiente (E2): el tramo de red mock debe liberar espera, no pagar IPC de processes.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output canónicos correctos.

---

### S38-T1-A-E2 (weDo, independent)
- **Diagnosis:** Espejo I/O del E1: starter fuerza `processes` en bound `io`. Buen fade independiente (política opuesta). Instruction densa; falta escena “normalización espera red mock” y cierre metacognitivo sobre IPC innecesario.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** I/O-bound: async o threads, no processes
- **Proposed preamble:**  
  - **Contexto:** el tramo de normalización de `CASO-LIM-038-1A2` espera red mock (wall >> cpu); forzar processes solo añade serialización e IPC.  
  - **Meta:** `pick("io")` → `async_or_threads` con justificación de bound.  
  - **Éxito:** `async_or_threads` / `bound io` / `ok True`.  
  - **Límites:** no lances procesos reales; no copies el mapa a ciegas sin leer el bound del fixture.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `pick` siempre devuelve `processes` (DEFECTO de copy-paste).  
  2. Restaura el mapa io/cpu/mixed.  
  3. Con `bound = "io"`, imprime elección, etiqueta y ok.  
  4. Fixture local; sin red.
- **Proposed retrospective:**  
  I/O y CPU no comparten el mismo modelo: processes en espera de red pagan pickle sin ganancia. Pregunta: ¿qué mediste (wall vs. CPU) para rechazar processes aquí?
- **Code/output changes:** none
- **Validation notes:** Fade real respecto a E1 (defecto invertido); output canónico OK.

---

### S38-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer real: medir bound con wall/cpu y fijar `measure_first=True`. Starter salta medición y elige async por moda. Falta preamble que distinga “elegir modelo” de “medir primero”, y retrospective de reutilización en el runbook del batch.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Medir bound antes de elegir modelo
- **Proposed preamble:**  
  - **Contexto:** en el incidente sintético `CASO-LIM-038-1A3`, alguien eligió async sin profile; el path de features (100/95 ms) pedía otra cosa.  
  - **Meta:** implementar `measure_bound` + `pick` y dejar `measure_first=True`.  
  - **Éxito:** `processes` / `measure_first True` / `ok True`.  
  - **Límites:** no dejes `measure_first=False`; no elijas async por moda; sin red real.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: `measure_first=False` y `choice="async_or_threads"` sin medir.  
  2. Con wall=100 y cpu=95, calcula bound (`cpu` si cpu ≥ 0.8×wall).  
  3. `pick(bound)` → `processes`; imprime modelo, measure_first y ok.  
  4. Sin pools reales.
- **Proposed retrospective:**  
  Sin medición no hay elección defendible de concurrencia. El error clásico es documentar el framework y omitir el bound. En T1-B medirás el costo del payload que cruza procesos.
- **Code/output changes:** none
- **Validation notes:** Transfer de disciplina measure-first (no clone de E1/E2); alineado a callout theory.

---

### S38-T1-B-DEMO (iDo)
- **Diagnosis:** Demo de bytes compact vs. full y etiqueta GIL limited. Description OK; falta preamble de “IPC cuesta bytes y puede filtrar PII” y retrospective del misconception “process pool siempre acelera”. Why corto pero bueno.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Ya elegiste processes para features densas; ahora el blob que cruza el boundary puede ser más caro que el score. En la demo se miden bytes de un payload compacto (`case_id`+`score`) frente a uno full con email sintético. No escribas: predice si compact gana y por qué el GIL sigue limitando threads CPU. Si mandas el registro completo a la cola, inflas IPC y arriesgas PII en logs de worker.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `json.dumps(...).encode()` mide el blob real de IPC; el email en el blob no hace falta para score y viola el contrato de privacidad; GIL limited en threads CPU justifica processes *solo* con payload mínimo. Puente a We Do: serializar JSON real (no `str(dict)`) y preferir compact_payload.
- **Proposed retrospective:**  
  Compacto es performance y privacidad a la vez. El error clásico es copiar el DataFrame o el email al process pool. We Do: bytes del blob JSON y política GIL en el runbook.
- **Code/output changes:** none
- **Validation notes:** Output `31` / `gil limited` / `ok True` alineado a theory T1-B.

---

### S38-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defecto sutil y pedagógico: `str(payload)` produce comillas simples; el contrato IPC exige JSON. Instruction densa; sin escena de “blob que cruzará procesos”. Feedback nombra el principio bien.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Serializa IPC con JSON, no str(dict)
- **Proposed preamble:**  
  - **Contexto:** el worker de features de `CASO-LIM-038-1B` debe medir el blob que viajará entre procesos; `str(dict)` no es contrato de IPC.  
  - **Meta:** serializar `{"x": 2}` con `json.dumps(...).encode("utf-8")` y validar el texto decodificado.  
  - **Éxito:** `8` / `ok True` / `format json`.  
  - **Límites:** no uses `str(payload)`; no inventes formato pickle aquí; sin PII.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `blob = str(payload).encode(...)` y `format "str"` (DEFECTO).  
  2. Cambia a `json.dumps(payload).encode("utf-8")`.  
  3. `ok` solo si `blob.decode() == '{"x": 2}'`.  
  4. Imprime len, ok y format json.
- **Proposed retrospective:**  
  El costo de IPC se mide sobre el blob real, no sobre el repr de Python. El error clásico es confiar en `len` coincidente y fallar el parse en el otro proceso. Siguiente: etiquetar GIL limited en threads CPU.
- **Code/output changes:** none
- **Validation notes:** ok exige JSON real — buen anti-cheat pedagógico; conservar output.

---

### S38-T1-B-E2 (weDo, independent)
- **Diagnosis:** Política de runbook `gil_status(threads, cpu) → limited`. Starter asume unlimited. Falta preamble de expectativas falsas de speedup multi-thread y retrospective de cuándo migrar a processes.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** GIL limited en threads CPU
- **Proposed preamble:**  
  - **Contexto:** el runbook del batch documenta expectativas de paralelismo; si model=threads y bound=cpu, CPython no da speedup lineal.  
  - **Meta:** `gil_status("threads", "cpu")` → `limited`.  
  - **Éxito:** `limited` / `ok True` / `cpu_threads True`.  
  - **Límites:** no lances threads reales; no digas unlimited en CPU puro.
- **Proposed instruction/description improvements:**  
  1. Starter devuelve siempre `unlimited` (DEFECTO).  
  2. Si threads+cpu → `limited`; processes pueden reportar bypass.  
  3. Imprime status, ok y `cpu_threads True`.  
  4. Sin red ni pools.
- **Proposed retrospective:**  
  Etiquetar `limited` evita promesas de throughput que el on-call no verá. Pregunta: si el bound es I/O, ¿sigue siendo correcta la etiqueta limited?
- **Code/output changes:** none
- **Validation notes:** Output canónico OK; no requiere threads reales (correcto para playground).

---

### S38-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer: preferir compact_payload midiendo bytes full vs. compact; starter elige full_record sin medir. Buen enlace privacidad+performance. Falta preamble de cola de worker y retrospective de reuso en T2.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Prefiere compact_payload medido
- **Proposed preamble:**  
  - **Contexto:** al encolar hacia el process pool de features, un full_record con email sintético infla bytes y arriesga PII en logs de cola.  
  - **Meta:** comparar bytes JSON y elegir `compact_payload` si compact < full.  
  - **Éxito:** `compact_payload` / `ok True` / `bytes 31`.  
  - **Límites:** no hardcodees prefer sin medir; no loguees el email en claro; fixture sintético.
- **Proposed instruction/description improvements:**  
  1. Starter fija `prefer = "full_record"` y bytes 0 (DEFECTO).  
  2. Mide `payload_bytes` de full y compact con json.dumps.encode.  
  3. Elige compact si es menor; imprime prefer, ok y bytes del compact.  
  4. Email solo sintético example.pe.
- **Proposed retrospective:**  
  Compact_payload es privacidad y performance a la vez. El error clásico es “por si acaso mando todo el registro”. En T2 acotarás la cola que transporta esos payloads.
- **Code/output changes:** none
- **Validation notes:** bytes 31 alineado a theory; email sintético OK.

---

### S38-T2-A-DEMO (iDo)
- **Diagnosis:** Demo fuerte de put_nowait/Full + token bucket estático. Description OK; falta preamble de “maxsize es política de memoria” y retrospective del misconception de confiar en `full()` consultivo. Why think-aloud bueno pero corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con el modelo de concurrencia elegido, el productor del batch aún puede llenar la RAM si la cola es infinita. En esta demo una `Queue(maxsize=2)` bloquea el tercer `put_nowait` con `Full`, y un token bucket de 2 niega el tercer allow. No escribas: predice quién queda en backpressure y la lista de allows. Si confías solo en `full()` entre hilos, el rechazo no es atómico.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: señal segura = `put_nowait` + `Full` (o put con timeout); bucket didáctico sin refill fija allow/deny; primero acotas cola del worker, después tasa hacia el proveedor. Puente a We Do: rate=2, maxsize=50 y ban_risk del proveedor.
- **Proposed retrospective:**  
  Backpressure y rate limit son capas distintas: una protege memoria del worker, la otra al API mock. El error clásico es cola sin tope o flood de requests. We Do: token bucket, Queue acotada y riesgo de ban.
- **Code/output changes:** none
- **Validation notes:** Output `[True, True, False]` / `backpressure ['c3']` / `ok True` alineado a theory T2-A.

---

### S38-T2-A-E1 (weDo, guided)
- **Diagnosis:** Token bucket rate=2 vs. starter rate=3. Drill simple y claro; instruction densa; falta escena de ráfaga hacia proveedor mock.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Token bucket: dos allows, tercero deny
- **Proposed preamble:**  
  - **Contexto:** el batch de Lima sintético lanza una ráfaga al mock; con rate=2 el tercero debe denegarse.  
  - **Meta:** contar allows True en 3 intentos con `TokenBucket(2)`.  
  - **Éxito:** `2` / `third False` / `ok True`.  
  - **Límites:** no rellenes tokens entre llamadas en este fixture estático; sin red real.
- **Proposed instruction/description improvements:**  
  1. Starter usa `TokenBucket(3)` (DEFECTO).  
  2. Cambia a rate=2; genera 3 `allow()`.  
  3. Imprime la suma de True, el third y ok.  
  4. Fixture estático sin refill.
- **Proposed retrospective:**  
  El bucket acota la ráfaga visible al proveedor. El error clásico es rate “generoso” que disfraza flood. Siguiente: acotar la cola del worker con maxsize.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S38-T2-A-E2 (weDo, independent)
- **Diagnosis:** Política de cola: maxsize=50 y label backpressure vs. unbounded_queue. Buen independent. Falta preamble de OOM bajo pico y retrospective de put_nowait en prod.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cola maxsize=50 con backpressure
- **Proposed preamble:**  
  - **Contexto:** el worker de scoring de `CASO-LIM-038` no puede crecer la cola sin tope bajo un pico sintético.  
  - **Meta:** crear `Queue(maxsize=50)`, encolar c1/c2 y reportar política `backpressure`.  
  - **Éxito:** `backpressure` / `ok True` / `maxsize 50`.  
  - **Límites:** no dejes maxsize None; no uses cola ilimitada “por simplicidad”.
- **Proposed instruction/description improvements:**  
  1. Starter reporta `unbounded_queue` y maxsize None (DEFECTO).  
  2. Instancia `Queue(maxsize=50)` y encola dos case_id sintéticos.  
  3. Imprime política, ok (maxsize==50 y qsize==2) y maxsize.  
  4. Sin red.
- **Proposed retrospective:**  
  maxsize es política de memoria, no un detalle de API. Pregunta: bajo pico, ¿bloqueas, dropeas o mandas a DLQ de overflow? (documenta en runbook).
- **Code/output changes:** none
- **Validation notes:** Solution usa put sin put_nowait — OK en single-thread del playground; no exigir cambio.

---

### S38-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a incidente de ban: rate=1, second deny, imprimir provider + ban_risk True. Starter flood con rate=99. Falta preamble de “rate limit es supervivencia del batch” y retrospective hacia timeout de T2-B.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rate limit evita ban del proveedor
- **Proposed preamble:**  
  - **Contexto:** sin límite de tasa el mock/API puede banear la IP del batch y tumbar todo el triage sintético.  
  - **Meta:** con `TokenBucket(1)` demostrar second=False y documentar `ban_risk True`.  
  - **Éxito:** `provider` / `ok True` / `ban_risk True`.  
  - **Límites:** no uses rate “infinito”; no ignores el deny; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Starter usa rate=99, imprime flood y ban_risk False (DEFECTO).  
  2. Rate=1; first True, second False.  
  3. Imprime `provider`, ok y ban_risk True.  
  4. Sin red real.
- **Proposed retrospective:**  
  Rate limit es cortesía y supervivencia. El error clásico es flood “solo en sandbox” que se cuela a prod. En T2-B un proveedor lento sin timeout colgará workers aunque la tasa esté bien.
- **Code/output changes:** none
- **Validation notes:** Transfer de criterio operativo (ban_risk), no clone del E1 con otro número.

---

### S38-T2-B-DEMO (iDo)
- **Diagnosis:** Timeout por latencia mock 2.5s vs. budget 1s + finally. Description OK; falta preamble del incidente “sin timeout → pool saturado” y retrospective de on_fail hacia retry/DLQ. Why bueno y corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Aunque la cola esté acotada, un fetch sin presupuesto de tiempo puede colgar un worker indefinidamente. En la demo el mock tarda 2500 ms y el timeout es 1 s: status timeout, on_fail hacia DLQ, y el `finally` cierra la conn sintética igual. No escribas: predice status y por qué finally corre. Si omites timeout, el p95 del batch explota en silencio.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: clasificar latencia mock vs. presupuesto es el contrato didáctico (en async real, `wait_for` cancela); `finally` libera recurso siempre; on_fail explícito evita hang eterno. Puente a We Do: política seconds>0, close en finally, open_runbook.
- **Proposed retrospective:**  
  Timeout + cierre determinista son el mínimo viable de I/O externa. El error clásico es “el proveedor casi siempre responde”. We Do: política, finally y incidente operable.
- **Code/output changes:** none
- **Validation notes:** Output `{'seconds': 1, 'on_fail': 'dlq'}` / `finally True` / `ok True` OK.

---

### S38-T2-B-E1 (weDo, guided)
- **Diagnosis:** fetch_policy con timeout_s=5 y on_fail retry_or_dlq vs. starter seconds=0/ignore. Excelente defecto de hang. Instruction densa; falta escena de geocoding mock lento.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Timeout con on_fail retry_or_dlq
- **Proposed preamble:**  
  - **Contexto:** el geocoding mock de `c-synth-1` llega a 8000 ms; sin presupuesto el worker cuelga.  
  - **Meta:** devolver status timeout, seconds=5 y on_fail `retry_or_dlq`.  
  - **Éxito:** `5` / `on_fail retry_or_dlq` / `ok True`.  
  - **Límites:** no uses timeout_s=0; no ignores el fallo; simulación local sin threads reales.
- **Proposed instruction/description improvements:**  
  1. Starter ignora latency y devuelve seconds=0, on_fail ignore, status ok (DEFECTO).  
  2. Compara latency_ms > timeout_s*1000.  
  3. Si superado → status timeout; siempre on_fail retry_or_dlq y seconds=timeout_s.  
  4. Imprime seconds, on_fail y ok.
- **Proposed retrospective:**  
  Timeout sin on_fail es un bool sin ruta. El error clásico es status ok con seconds=0. Siguiente: liberar la conn en finally aunque falle el fetch.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S38-T2-B-E2 (weDo, independent)
- **Diagnosis:** try/except sin finally → closed=False. Defecto de leak clásico. Falta preamble de pool agotado y retrospective de context manager en prod.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cierra la conn en finally
- **Proposed preamble:**  
  - **Contexto:** bajo carga, un leak de conn sintética agota el pool del worker de scoring.  
  - **Meta:** marcar `closed=True` en `finally` aunque el fetch mock falle.  
  - **Éxito:** `True` / `resource conn` / `ok True`.  
  - **Límites:** no dejes el close solo en el happy path; sin sockets reales.
- **Proposed instruction/description improvements:**  
  1. Starter atrapa RuntimeError y no cierra (DEFECTO).  
  2. Añade `finally: closed = True`.  
  3. Imprime closed, resource conn y ok.  
  4. Fixture local.
- **Proposed retrospective:**  
  Sin close determinista el pool se agota. Pregunta: ¿qué cambia en prod si usas context manager en lugar de finally manual?
- **Code/output changes:** none
- **Validation notes:** Solution correcta; output OK.

---

### S38-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a incidente operable: needs_incident + open_runbook. Starter niega incidente con timeout_s=0 y action ignore. Excelente puente a operación. Falta preamble de “nombrar el incidente es el primer paso” y retrospective hacia o11y T3.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Incidente de timeout abre el runbook
- **Proposed preamble:**  
  - **Contexto:** latency 5000 ms con budget 1 s (o sin presupuesto) debe generar incidente de proveedor lento, no “seguir ignorando”.  
  - **Meta:** `needs_incident` True y `action_for` → `open_runbook`.  
  - **Éxito:** `incident True` / `ok True` / `action open_runbook`.  
  - **Límites:** no devuelvas ignore; timeout_s≤0 también es hang = incidente.
- **Proposed instruction/description improvements:**  
  1. Starter: timeout_s=0 niega incidente y action ignore (DEFECTO).  
  2. Sin presupuesto o latencia sobre budget → incidente.  
  3. Si hit → open_runbook; imprime incident, ok y action.  
  4. Fixture CASO-LIM-038 sintético.
- **Proposed retrospective:**  
  Nombrar el incidente y abrir el runbook es el primer paso operable. El error clásico es silence under hang. En T3 el on-call necesitará logs, metrics y traces con correlation_id, no solo un bool de timeout.
- **Code/output changes:** none
- **Validation notes:** Transfer de política de on-call; no clone de E1.

---

### S38-T3-A-DEMO (iDo)
- **Diagnosis:** Evento scored con corr, metric latency_ms, pii_raw False. Description OK; falta preamble de tres pilares unidos por corr y retrospective del misconception “un print local basta para operar”. Why bueno y corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando aparece un timeout, el on-call no puede reconstruir el path de `c-synth-1` con un print suelto. En esta demo se emite un evento `scored` con `corr-1`, métrica de latencia y `pii_raw=False`. No escribas: predice event, nombre de métrica y flag de PII. Si omites correlation_id, el trace del caso se rompe entre intake y score.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: o11y = logs + metrics + traces; corr une el camino sin volcar el payload del cliente; pii_raw False es contrato del gate, no un extra. Puente a We Do: emitir corr, activar tres pilares y redactar email.
- **Proposed retrospective:**  
  Un on-call reconstruye el caso con corr, no con email en claro. El error clásico es loggear el blob completo. We Do: corr obligatorio, tres pilares y pii_raw False.
- **Code/output changes:** none
- **Validation notes:** Output `scored corr-1` / `metric latency_ms` / `pii_raw False` OK.

---

### S38-T3-A-E1 (weDo, guided)
- **Diagnosis:** emit_scored ignora corr (None). Defecto guiado limpio. Falta escena de reconstrucción del path intake→score.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Evento scored con correlation_id
- **Proposed preamble:**  
  - **Contexto:** al marcar scored en `c-synth-1`, el log debe llevar `corr-1` para unir spans del path.  
  - **Meta:** `emit_scored` devuelve dict con event, case_id, corr y pii_raw=False.  
  - **Éxito:** `True` / `event scored` / `ok True`.  
  - **Límites:** no dejes corr=None; no pongas PII en el evento; sin red.
- **Proposed instruction/description improvements:**  
  1. Starter fija corr=None e ignora el parámetro (DEFECTO).  
  2. Propaga el corr recibido al dict.  
  3. Imprime bool(corr), event y ok (corr-1 y pii_raw False).  
  4. Fixture sintético.
- **Proposed retrospective:**  
  correlation_id une spans del caso. El error clásico es case_id sin corr entre servicios. Siguiente: activar logs, metrics y traces juntos.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S38-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tres pilares: starter solo logs y signals incompletos. Buen independent. Falta preamble de “un solo pilar no diagnostica cola+latencia+caso” y retrospective de o11y mínima.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres pilares activos de o11y
- **Proposed preamble:**  
  - **Contexto:** diagnosticar cola llena, latencia p95 y path de un caso exige logs, metrics y traces, no solo un log INFO.  
  - **Meta:** `active_pillars` devuelve en orden fijo las claves True entre logs/metrics/traces.  
  - **Éxito:** `['logs', 'metrics', 'traces']` / `ok True` / `n 3`.  
  - **Límites:** no hardcodees la lista si puedes filtrar el dict; activa los tres en el fixture.
- **Proposed instruction/description improvements:**  
  1. Starter solo considera logs y deja metrics/traces en False (DEFECTO).  
  2. Filtra ORDER por signals.get(k).  
  3. Señales con los tres True; imprime lista, ok y n.  
  4. Sin OpenTelemetry real.
- **Proposed retrospective:**  
  Un solo pilar no basta para diagnosticar cola + latencia + caso. Pregunta: ¿qué falta si solo tienes metrics sin corr en el log?
- **Code/output changes:** none
- **Validation notes:** Output canónico OK; solution también corrige signals del fixture (necesario).

---

### S38-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de privacidad: pii_raw False + redact an***. Starter True y sin máscara. Buen enlace al gate CP-N3-C. Falta preamble de “privacidad es parte de o11y” y retrospective hacia SLO T3-B.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** pii_raw False y email redactado
- **Proposed preamble:**  
  - **Contexto:** el contrato de operación CP-N3-C prohíbe PII cruda en logs del pipeline, aunque el email sea sintético de lab.  
  - **Meta:** `pii_raw=False` y `redact(email)=="an***"`.  
  - **Éxito:** `False` / `ok True` / `redact True`.  
  - **Límites:** nunca pii_raw True en operación; conserva case_id sintético sin enmascararlo como email.
- **Proposed instruction/description improvements:**  
  1. Starter: redact identidad y pii_raw True (DEFECTO).  
  2. Implementa s[:2]+"***"; pii_raw False.  
  3. Imprime pii_raw, ok y redact.  
  4. Solo example.pe sintético.
- **Proposed retrospective:**  
  Privacidad es parte del contrato de o11y, no un extra de compliance al final. El error clásico es “solo es sandbox”. En T3-B redactarás teléfono y evaluarás SLO con error budget.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S38-T3-B-DEMO (iDo)
- **Diagnosis:** SLO ok + redact + ship_features. Description OK; falta preamble de error budget como decisión operativa y retrospective del misconception “SLO es eslogan sin consecuencia”. Why corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con logs y corr en su lugar, el servicio aún necesita objetivos: p95 120 ≤ 200 y redacción de email sintético. En la demo, si el SLO se cumple se pueden shippear features; si se viola, la política de error budget empuja a freeze de deploys no urgentes. No escribas: predice ok, redacted y action. Si celebras latencia peor que el límite, el dashboard miente.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: SLI mide realidad, SLO es el acuerdo; error budget convierte la violación en acción; redacción siempre aunque el dato sea inventado. Puente a We Do: máscara de teléfono, slo multi-SLI y freeze al agotar budget.
- **Proposed retrospective:**  
  Error budget convierte el SLO en decisión de equipo. El error clásico es comparar al revés o ignorar error_rate. We Do: redactar, slo_ok compuesto y freeze operativo.
- **Code/output changes:** none
- **Validation notes:** Output `True` / `redacted an***` / `ok True` OK.

---

### S38-T3-B-E1 (weDo, guided)
- **Diagnosis:** Redacción de teléfono 90000001 → 90****01. Drill mecánico claro; falta escena de log de operación y note de no PII real.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Redacta teléfono sintético en logs
- **Proposed preamble:**  
  - **Contexto:** un log de operación no debe llevar el teléfono sintético completo; el on-call usa case_id y corr.  
  - **Meta:** enmascarar a `90****01` (2+****+2).  
  - **Éxito:** `90****01` / `ok True` / `pii False`.  
  - **Límites:** no uses PII real; no imprimas el número crudo “para debug”.
- **Proposed instruction/description improvements:**  
  1. Starter asigna redacted = phone (DEFECTO).  
  2. Aplica phone[:2]+"****"+phone[-2:].  
  3. Imprime redactado, ok y pii False.  
  4. Fixture sintético 90000001.
- **Proposed retrospective:**  
  Redacción es mecánica y revisable en code review. El error clásico es loggear “solo un rato”. Siguiente: evaluar p95 y error_rate juntos.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK; pii False hardcodeado en solution (intencional al contrato).

---

### S38-T3-B-E2 (weDo, independent)
- **Diagnosis:** slo_ok multi-SLI; starter solo p95 e invertido. Excelente defecto de “alerta al revés”. Falta preamble de por qué ambos umbrales importan.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** SLO multi-SLI: p95 y error_rate
- **Proposed preamble:**  
  - **Contexto:** celebrar p95 bueno con error_rate alto engaña al dueño del servicio de triage.  
  - **Meta:** `slo_ok` True solo si p95≤200 y error_rate≤0.02.  
  - **Éxito:** `True` / `p95 100` / `limit 200`.  
  - **Límites:** no compares al revés; no ignores error_rate.
- **Proposed instruction/description improvements:**  
  1. Starter: `p95 > limit` e ignora error_rate (DEFECTO doble).  
  2. AND de ambos umbrales con `<=`.  
  3. Imprime ok, p95 y limit.  
  4. Fixture sintético.
- **Proposed retrospective:**  
  Un SLO multi-SLI evita celebrar latencia buena con errores altos. Pregunta: si p95 ok y error_rate 0.05, ¿qué debe devolver slo_ok?
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S38-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a política de error budget: remaining=0 → freeze. Starter ship_features e imprime uptime_only. Falta preamble de “SLO sin consecuencia es eslogan” y retrospective hacia checkpoint T4.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Error budget agotado: freeze deploys
- **Proposed preamble:**  
  - **Contexto:** al agotarse el error budget del servicio de scoring sintético, la operación prioriza estabilidad sobre features nuevas.  
  - **Meta:** `budget_action(0)` → `freeze_nonurgent_deploys` y documentar mecanismo `error_budget`.  
  - **Éxito:** `error_budget` / `ok True` / `n 1`.  
  - **Límites:** no ignores remaining; no imprimas uptime_only como si no hubiera política.
- **Proposed instruction/description improvements:**  
  1. Starter siempre ship_features e imprime uptime_only, n 0 (DEFECTO).  
  2. remaining==0 → freeze; si no → ship_features.  
  3. Imprime error_budget, ok y n 1.  
  4. Fixture didáctico.
- **Proposed retrospective:**  
  Sin error budget el SLO es eslogan. El error clásico es seguir shippeando con presupuesto en cero. En T4 el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.
- **Code/output changes:** none
- **Validation notes:** Transfer de política operativa; output canónico OK.

---

### S38-T4-A-DEMO (iDo)
- **Diagnosis:** idem_key + resume_from score tras last_done features. Description OK; falta preamble de “reanudar mal = side effects duplicados” y retrospective del misconception “last_done se rehace por seguridad”. Why bueno y corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Tras un crash del worker a mitad de batch, el proceso nuevo no debe rehacer features si ya están done. En la demo, `c1:features:v1` identifica el intento y `resume_from("features")` avanza a score. No escribas: predice key y siguiente paso. Si reejecutas un paso done sin store de claves, puedes duplicar enqueues o tickets de review.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: last_done nombra el paso terminado; resume_from es el siguiente pendiente; la key case:step:ver es estable entre deploys de lógica. Puente a We Do: estados terminales, idem_key con ver, mapa NEXT.
- **Proposed retrospective:**  
  Reanudar mal es tan malo como no reanudar. El error clásico es volver a intake “por si acaso”. We Do: estados, key con versión y resume al siguiente.
- **Code/output changes:** none
- **Validation notes:** Output `c1:features:v1` / `status done` / `ok True` OK.

---

### S38-T4-A-E1 (weDo, guided)
- **Diagnosis:** WORKFLOW_STATES sin failed; is_terminal solo done. Defecto claro de modelo de estados. Falta escena de ruta a DLQ/retry.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cuatro estados; failed es terminal
- **Proposed preamble:**  
  - **Contexto:** el workflow de triage necesita pending/running/done/failed; sin failed no hay ruta clara a DLQ o retry.  
  - **Meta:** lista de 4 estados e `is_terminal` True para done y failed.  
  - **Éxito:** lista con failed / `ok True` / `n 4`.  
  - **Límites:** no omitas failed; no marques pending como terminal.
- **Proposed instruction/description improvements:**  
  1. Starter: tres estados y terminal solo done (DEFECTO).  
  2. Añade failed; is_terminal en (done, failed).  
  3. Imprime lista, ok y n.  
  4. Fixture sintético.
- **Proposed retrospective:**  
  Failed es estado terminal de error, distinto de pending. El error clásico es colapsar error en running. Siguiente: key case:step:ver.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S38-T4-A-E2 (weDo, independent)
- **Diagnosis:** idem_key sin :ver → colisiones al cambiar lógica. Buen independent. Falta preamble de colisión entre deploys y retrospective de store APPLIED.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Idempotency key case:step:ver
- **Proposed preamble:**  
  - **Contexto:** al reintentar features de `c-synth-1` tras un deploy de lógica v3, la key debe incluir versión para no colisionar con v2.  
  - **Meta:** `idem_key` → `c-synth-1:features:v3` y dup False.  
  - **Éxito:** key completa / `ok True` / `dup False`.  
  - **Límites:** no omitas ver; no marques dup True en el happy path.
- **Proposed instruction/description improvements:**  
  1. Starter omite ver y deja dup True (DEFECTO).  
  2. Formato f"{case}:{step}:{ver}".  
  3. Imprime key, ok (2 dos puntos y ends with :v3) y dup False.  
  4. Sin side effects reales.
- **Proposed retrospective:**  
  La key estable es la base de la idempotencia del checkpoint. Pregunta: ¿qué pasa si dos deploys comparten case:step sin ver?
- **Code/output changes:** none
- **Validation notes:** Output `c-synth-1:features:v3` / ok / dup False OK.

---

### S38-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer resume_from: starter hardcodea intake. Excelente anti-patrón de rehacer trabajo. Falta preamble de crash/resume y retrospective hacia retry/DLQ T4-B.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Resume al siguiente, no al intake
- **Proposed preamble:**  
  - **Contexto:** tras crash con last_done=features, el worker nuevo debe ir a score; volver a intake duplica trabajo y side effects.  
  - **Meta:** `resume = NEXT[last_done]` → score.  
  - **Éxito:** `score` / `ok True` / `checkpoint True`.  
  - **Límites:** no hardcodees intake; no reuses last_done como resume_from.
- **Proposed instruction/description improvements:**  
  1. Starter fija resume="intake" (DEFECTO).  
  2. Usa NEXT[state["last_done"]].  
  3. Imprime resume, ok y checkpoint True.  
  4. Fixture CASO-LIM-038.
- **Proposed retrospective:**  
  last_done nombra lo terminado; resume_from avanza. El error clásico es “siempre desde el inicio por seguridad”. En T4-B, si score falla de forma no transitoria, irás a DLQ en lugar de reintentar infinito.
- **Code/output changes:** none
- **Validation notes:** Transfer de semántica de checkpoint; output canónico OK.

---

### S38-T4-B-DEMO (iDo)
- **Diagnosis:** Backoff [0.1,0.2,0.4], poison→DLQ, runbook True. Description OK; falta preamble de “retry infinito vs. DLQ” y retrospective del misconception “DLQ se reinyecta entera”. Why bueno y corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un fallo retriable se espera con backoff; un mensaje venenoso no debe reintentarse a ciegas. En la demo ves la serie 0.1/0.2/0.4, la ruta poison→DLQ y el flag de runbook presente. No escribas: predice si poison va a retry o dlq y por qué el runbook es entregable. Si reinyectas la DLQ entera sin inspección, el veneno vuelve a la cola.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: exponencial base×2^attempt (jitter en prod); poison o max_attempts → dlq; runbook síntomas→checks→acciones se prueba en drill. Puente a We Do: 0.8 en attempt=3, route poison, dict de on-call.
- **Proposed retrospective:**  
  Retriable usa backoff; poison usa DLQ con replay controlado. El error clásico es retry_forever. We Do: fórmula, ruta y runbook mínimo documentado.
- **Code/output changes:** none
- **Validation notes:** Output `[0.1, 0.2, 0.4]` / `dlq True` / `runbook True` OK.

---

### S38-T4-B-E1 (weDo, guided)
- **Diagnosis:** Backoff lineal vs. exponencial. Drill clásico; falta escena de presión sobre el proveedor mock.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Backoff exponencial attempt 3 = 0.8
- **Proposed preamble:**  
  - **Contexto:** reintentos lineales golpean el mock en ráfaga; el fixture pide base×2^attempt.  
  - **Meta:** `backoff(3, 0.1)` → 0.8.  
  - **Éxito:** `0.8` / `ok True` / `attempt 3`.  
  - **Límites:** no uses base*attempt lineal; jitter opcional en prod, no aquí.
- **Proposed instruction/description improvements:**  
  1. Starter: base*attempt (DEFECTO).  
  2. Cambia a base * (2 ** attempt).  
  3. Imprime wait, ok y attempt 3.  
  4. Fixture didáctico.
- **Proposed retrospective:**  
  Backoff exponencial reduce presión sobre el proveedor. El error clásico es sleep fijo o lineal. Siguiente: poison a DLQ con replay controlado.
- **Code/output changes:** none
- **Validation notes:** Output `0.8` exacto; conservar.

---

### S38-T4-B-E2 (weDo, independent)
- **Diagnosis:** poison → dlq vs. retry_forever. Falta preamble de higiene de cola y retrospective de replay caso a caso.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Poison va a DLQ, no retry forever
- **Proposed preamble:**  
  - **Contexto:** un payload malformado que falla siempre no se cura con más reintentos; contamina el throughput del batch.  
  - **Meta:** `route("poison")` → `dlq` y replay controlled.  
  - **Éxito:** `dlq` / `ok True` / `replay controlled`.  
  - **Límites:** no reintentes veneno en bucle; no borres DLQ sin análisis.
- **Proposed instruction/description improvements:**  
  1. Starter: retry_forever y replay uncontrolled (DEFECTO).  
  2. if kind == "poison": return "dlq".  
  3. Imprime dest, ok y replay controlled.  
  4. Fixture sintético.
- **Proposed retrospective:**  
  Poison + replay controlado es higiene de cola. Pregunta: ¿por qué el replay ciego reinyecta el mismo fallo?
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

---

### S38-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer final: dict runbook con symptoms y actions; starter vacío. Excelente cierre operativo hacia You Do/S39. Falta preamble de drill on-call y retrospective de “runbook es entregable del gate”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Runbook on-call con restart_worker
- **Proposed preamble:**  
  - **Contexto:** el drill sintético de `c-synth-1` exige un playbook antes de prod: síntomas (provider_slow, worker_down) y acciones (restart_worker, replay_batch, escalate_provider).  
  - **Meta:** dict no vacío con `restart_worker` en actions.  
  - **Éxito:** `True` / `oncall True` / `ok True`.  
  - **Límites:** no dejes runbook={}; no improvises acciones solo en la cabeza bajo presión.
- **Proposed instruction/description improvements:**  
  1. Starter: runbook vacío y oncall False (DEFECTO).  
  2. Define symptoms y actions mínimas.  
  3. Imprime bool(runbook), oncall True y ok si restart_worker ∈ actions.  
  4. Transferencia a operación CP-N3-C.
- **Proposed retrospective:**  
  El runbook es entregable de operación, no un wiki opcional. El error clásico es “ya lo sabíamos del incidente pasado”. En el You Do ensamblarás los cuatro pilares y demostrarás resume + idempotencia + runbook para el gate.
- **Code/output changes:** none
- **Validation notes:** Transfer de entregable operativo; cierra el hilo T1–T4; output canónico OK.

---

### S38-youDo (youDo)
- **Diagnosis:** Marco de proyecto sólido: context de mini-worker con pool/backpressure, o11y, checkpoint durable, retry/DLQ y runbook; objectives y requirements alineados a CP-N3-C; starter con NotImplementedError en measure/pick/fetch/runbook y apply_once/checkpoint ya útiles; rubric y portfolioNote de drill crash/resume. **Falta `retrospective`** de defensa metacognitiva (qué invariante demuestras, qué harías con datos reales, frase de impacto). Context es bueno pero no sustituye el cierre post-build del spec.
- **Checklist:** context pass · goal pass (objectives) · success pass (rubric/requirements) · constraints pass (sin PII/red) · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (youDo ya tiene title)
- **Proposed preamble:** N/A — no añadir preamble duplicado del context; el Fixer puede, si el schema lo permite, dejar context y solo añadir retrospective. Opcional: una línea de “antes de codear, elige un bound medido y un drill de crash” solo si se unifica con context sin inflar.
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/rubric/starter. Asegurar en portfolioNote (ya bueno) que el learner demuestre: (1) measure_bound+pick documentados, (2) apply_once dos veces → un side effect, (3) resume last_done→siguiente, (4) runbook con restart_worker, (5) log redactado con corr.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con dos `apply_once` del mismo `case:step:ver` y un resume desde checkpoint? (2) ¿qué cambiarías con red real (timeouts, jitter, store durable) vs. el mock sintético, sin PII? (3) Escribe en el README una frase de impacto medible (p. ej. “mismo resultado tras kill del worker; 0 side effects duplicados”) que puedas defender en 30 segundos ante el gate CP-N3-C / S39.
- **Code/output changes:** none (starter y contratos correctos)
- **Validation notes:** Scaffold de 4 pilares maduro; solo falta cierre metacognitivo formal.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback reforzado)
1. **S38-T1-A-E1, E2, E3** — mapa bound→modelo y measure_first (base del hilo)
2. **S38-T1-B-E1, E2, E3** — JSON IPC, GIL limited, compact_payload
3. **S38-T2-A-E1, E2, E3** — token bucket, maxsize, ban_risk
4. **S38-T2-B-E1, E2, E3** — timeout/on_fail, finally, open_runbook
5. **S38-T3-A-E1, E2, E3** — corr, tres pilares, pii_raw
6. **S38-T3-B-E1, E2, E3** — redact teléfono, multi-SLI, error budget
7. **S38-T4-A-E1, E2, E3** — estados, idem_key, resume_from
8. **S38-T4-B-E1, E2, E3** — backoff, DLQ, runbook dict

### P1
9. **Todas las 8 iDo demos** — añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras sin reescribir el código
10. **youDo** — añadir `retrospective` de defensa (invariante / real vs sintético / frase de impacto)

### P2
11. **Feedback We Do** — de “explica por qué…” genérico a 25–60 palabras ancladas al incidente de `c-synth-1` / gate CP-N3-C (propuestas ya en varios E1 del ledger; aplicar al resto con el mismo criterio)
12. **Instruction** — separar ensayo del bloque de pasos numerados (meta y límites viven en preamble)

---

## Residual risks
- **Playground sin pools reales:** varios ejercicios modelan contratos (pick, timeout, GIL) sin Thread/ProcessPoolExecutor; el Fixer no debe “arreglar” eso con red o multiproceso en el browser — el You Do ya pide ensayo local.
- **Token bucket estático:** el lab no rellena tokens por ventana; preambles deben decir “didáctico estático” para no enseñar un bucket de prod incompleto como si bastara.
- **Fade percibido en T1-A E1/E2:** son mapas simétricos (cpu vs io); preambles y retrospectives deben diferenciar escena (features densas vs normalización red) o el learner sentirá clones.
- **T3-A-E3 vs T3-B-E1:** ambos tocan redacción; E3 es pii_raw+email, E1 es teléfono con otra máscara — mantener esa distinción en títulos y preambles.
- **You Do densidad:** el scaffold es rico; sin retrospective el learner cierra el portfolio sin ensayar la defensa oral del gate.
- **Outputs canónicos de 3 líneas:** no cambiar strings de solución salvo execute-and-diff justificado; la campaña es de prosa pedagógica, no de reescritura de asserts.
- **Nivel “Competente a experto”:** la prosa PE debe ser concreta y operativa (on-call, batch, runbook) sin jerga académica innecesaria; no diluir el rigor de GIL/IPC/idempotencia.

---

## Fixer handoff (checklist)
- [ ] 24 We Do: `title`, `preamble` (80–150 palabras o 4 bullets), `instruction` solo pasos, `retrospective` (40–80), `feedback` reforzado donde se indicó
- [ ] 8 I Do: `preamble` + `retrospective`; `why` ampliado al rango del spec
- [ ] 1 You Do: `retrospective` de defensa
- [ ] Español profesional peruano; sin PII real; fixtures CASO-LIM-038 / c-synth-1
- [ ] No alterar outputs de solución salvo justificación
- [ ] Sin generadores ni plantillas bulk
- [ ] Validar que la sección sigue compilando en el build estático del curso

---

Section 38 exercise pedagogy review complete. Ready for the Fixer prompt.
