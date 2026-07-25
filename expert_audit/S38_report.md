# PyArcana Curriculum Audit — Section 38

**Section under audit:** S38 (the 38th section in course order).
**Source file:** `src/lib/course/sections/s38-performance-extreme.ts` (1 901 lines, Phase 2 — Senior, 27–39).
**Live site:** `https://pillb.github.io/pyarcana/#performance-extreme` (SPA; bundle chunk `app/page-*.js` carries the section data verbatim — confirmed 38 occurrences of `CASO-LIM-038`, 31 of `c-synth-1`, 17 of `CP-N3-C`, and the title `"Concurrencia, observabilidad y workflows resilientes"`).
**Authoritative metadata:** `id: "performance-extreme"`, `index: 38`, `title: "Concurrencia, observabilidad y workflows resilientes"`, `shortTitle: "Concurrencia y resiliencia"`, `estimatedHours: 19`, `level: "Competente a experto"`, `phase: 2`.

> Note on retry: A previous S38 attempt timed out after producing the extraction scripts and metric artefacts (`S38_prose.txt`, `S38_metrics.json`, `S38_lt.json`, `_s38_grammar.py`, `_s38_lt.py`). This run reuses those artefacts, completes the manual deep-read, the live/repo cross-check, the meta-leak and pedagogy passes, and writes the canonical report file.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Section # | 38 (Phase 2 — Senior, sections 27–39) |
| File | `src/lib/course/sections/s38-performance-extreme.ts` |
| `id` | `performance-extreme` |
| Title | "Concurrencia, observabilidad y workflows resilientes" |
| Short title | "Concurrencia y resiliencia" |
| Tagline | "pipeline reanudable con trace por caso, métricas de cola y manejo de proveedor lento, proceso caído y reejecución" |
| `estimatedHours` | 19 |
| Gate | CP-N3-C (operación) — feeds S39 integrator-phase2 (Case Triage N3) |
| Synthetic case | `CASO-LIM-038`, `c-synth-1` (Red Andina, ficticia, datos inventados) |
| Theory blocks | 8 (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) |
| I Do demos | 8 (S38-T1-A-DEMO … S38-T4-B-DEMO) |
| We Do exercises | 24 (8 subtopics × 3 levels E1/E2/E3 = guided/independent/transfer) |
| You Do capstone | Pipeline reanudable CP-N3-C (5 objectives + 5 requirements + 7-criterion rubric) |
| Self-check MCQs | 9 |
| Resources | 10 docs, 2 books, 6 courses |

**Topic coverage:** threads/processes/async by bound, GIL & IPC cost, pools/backpressure/rate-limits, timeouts/cancellation/resource cleanup, logs/metrics/traces + correlation_id, PII redaction + SLI/SLO/error budget, state machines/checkpoint/idempotency keys, retry/backoff/DLQ/replay/runbook. Stack: stdlib (`queue`, `json`, `time`, dicts) + conceptual contracts (asyncio/multiprocessing/OpenTelemetry referenced but not run).

**Scope of this audit:** all learner-facing Spanish prose (intro, why, instruction, hint(s), feedback, edgeCases, tests, heading, callout content/title, paragraphs, objectives, requirements, rubric criteria, MCQ question/options/explanation, portfolioNote, context) — 218 records, 395 sentences, 5 582 words after filtering code-only strings.

---

## 2. Executive Summary of Quality

**Composite score: 8.0 / 10.**

**Verdict:** Pedagogically a gold-standard Phase-2 section. The I Do / We Do / You Do scaffold is faithful (8 demos → 24 exercises in 8 subtopics × 3 difficulty levels → CP-N3-C capstone), every exercise has verified starter↔solution↔output alignment, the synthetic case `c-synth-1` is threaded coherently across T1–T4, the privacy posture is exemplary (PII redaction enforced as a contract, no real network, no real PII), and the 9-item self-check is calibrated against the actual learning outcomes. The shared `SectionView.tsx` interactive playground for `performance-extreme` is on-topic (backpressure + timeout + idempotency demo) — no legacy id-drift like S06/S09/S13. Backward/forward connective tissue to S37 (medir antes de cambiar) and S39 (Case Triage N3) is explicit.

**What holds the score back (−2.0):**

1. **Markdown-leak (−0.6, HIGH):** `jobRelevance` and the `weDo.steps[].instruction` field are rendered as raw JSX `{string}` in `SectionView.tsx` (lines 189, 491) without the `<RichText>` wrapper used for theory paragraphs (L387) and iDo/weDo intros (L426, L476). S38 contains `**observabilidad**` inside `jobRelevance` and `**ambos**` inside the instruction of S38-T3-B-E2; both would render as literal `**…**` asterisks on the live page. This is the same systemic issue documented in S06's audit.
2. **Cognitive load (−0.5, HIGH):** the section-opening "Diccionario de la sección" paragraph (L30) is a 102-word mega-glossary with 9 bolded terms inlined into one paragraph; 4 more theory paragraphs exceed 70 words (L66=116w, L33=95w, L115=105w, L68=108w). FH for those units drops to 4–11 ("muy difícil") for non-title prose.
3. **Spanish concordance defects (−0.3, HIGH/MEDIUM):** 2 real gender/number concordance errors confirmed by LanguageTool — "Red Andina sintético" (L33, L68; `Red` is feminine → `sintética`) and "presupuesto de error claros" (L276; `presupuesto` is masculine singular → `claro`). Plus a third debatable case: "un API mock" (L33; `API` feminine → `una API`, although "un API" is widespread in Peruvian tech jargon).
4. **Style/typography issues (−0.3, MEDIUM):** ~13 occurrences of `vs` without period (PUNTO_EN_ABREVIATURAS), 6 occurrences of unit-without-space (`120ms`, `2.5s`, `1A2`/`1A3` as case identifiers — these last two are false positives), and 1 hint (S38-T1-A-E3 hints[1]) containing `wall_ms * 0.8` where the standalone `*` is ambiguous between multiplication and markdown-italic if ever fed to `<RichText>`.
5. **DRY redundancy (−0.2, MEDIUM):** 24/24 weDo exercises have `hint` byte-identical to `hints[0]` — same systemic redundancy noted in S01/S09/S10/etc.
6. **Anaphoric monotony (−0.1, LOW):** every theory subtopic opens with a 1- or 2-sentence "Contrato operativo." paragraph (8 occurrences) and an "Aplicación a `CASO-LIM-038-…`" paragraph (8 occurrences). The pattern is intentional pedagogically (contract-first structure), but the identical openings compound with the `CASO-LIM-038-Tn-X`/`S38-Tn-X-En` code-identifier prefixes that surface verbatim in every exercise instruction (24 occurrences) — the same code-identifier-leak pattern flagged in S10/S11.

**Comparative placement:** S38 sits clearly above the Phase-2 median observed so far (S06 7.5, S09 8.0, S10 7.3, S13 8.0, S33 etc.). It avoids the catastrophic code-output integrity failures of S03 (5 critical drift bugs) and the wrong-section playground leak of S06/S13. The remaining defects are line-edit fixes plus one shared-component fix (RichText wrapping in SectionView.tsx).

---

## 3. Detailed Issue Registry

> Severity legend: **H**=High (affects every learner / breaks rendering or correctness), **M**=Medium (degrades quality for a subset), **L**=Low (style/typography).

### A. Markdown / rendering leak (systemic, shared component)

| # | Sev | Location | Evidence | Pedagogical impact |
|---|---|---|---|---|
| 1 | H | `SectionView.tsx:189` (`{section.jobRelevance}`) + S38 source L15 | `jobRelevance` field contains `**observabilidad** (logs/metrics/traces; o11y en jerga de industria)` | Every learner opening S38 sees the literal text `**observabilidad**` instead of bold "observabilidad" in the "¿Para qué te sirve esto?" panel. Confirmed by inspecting the JS bundle: 1 occurrence of `\*\*observabilidad\*\*` survives into the rendered chunk. Undermines the only typographic emphasis in the job-relevance string. |
| 2 | M | `SectionView.tsx:491` (`{step.instruction}` in `<span>`) + S38 source L1389 | Instruction for S38-T3-B-E2 contains `…True solo si **ambos** umbrales se cumplen.` | Learners expanding that We Do exercise see `**ambos**` literally. The visual noise draws attention away from the actual contract ("ambos umbrales"). |
| 3 | M (latent) | Same component, all S38 instructions/feedbacks | No other instruction/feedback currently uses `**…**` — verified by grep across all `instruction:`/`feedback:`/`context:`/`portfolioNote:`/`content:` fields. | If a future author adds bold to any instruction, it will leak silently. The component-level fix (route these 5 fields through `<RichText>`) prevents regression. |

### B. Spanish concordance (gender / number)

| # | Sev | Location | Evidence | Pedagogical impact |
|---|---|---|---|---|
| 4 | H | Source L33 (theory T1-A "Aplicación a CASO-LIM-038-T1A") and L68 (T1-A "Aplicación a CASO-LIM-038-T1A") | "Red Andina sintético" — `Red` is feminine (`la red`), so the postponed adjective must agree: `Red Andina sintética`. | Confirmed by LanguageTool `AGREEMENT_POSTPONED_ADJ` rule with replacement `sintética`. Two occurrences in the same subtopic; learners internalize the wrong gender of "red". |
| 5 | H | Source L276 (theory T3-B "Aplicación a CASO-LIM-038-T3B") | "con o11y y presupuesto de error claros, el workflow aún necesita…" — `presupuesto` is masculine singular → adjective should be `claro`, not `claros`. | LT `AGREEMENT_POSTPONED_ADJ` rule fires. The plural `claros` could mistakenly attach to "error" or "o11y y presupuesto" (a coordinated subject) — grammatically muddy. |
| 6 | M | Source L33 (theory T1-A "Aplicación") | "un worker de scoring recibe picos de I/O hacia un API mock" — `API` is the acronym of *Application Programming Interface* (feminine in Spanish, *interfaz*), so the canonical form is `una API`. | LT `AGREEMENT_DET_NOUN` rule fires with replacement `una API`. In Peruvian/LatAm tech jargon `un API` is widely used and increasingly accepted, hence Medium not High; but RAE-preferred Spanish is `una API`. |

### C. Cognitive load / run-on sentences

| # | Sev | Location | Words | Evidence | Pedagogical impact |
|---|---|---|---|---|---|
| 7 | H | L30 (theory opening, "Diccionario de la sección") | 102 | "**Diccionario de la sección** (léelo antes de T1). **Bound (I/O vs CPU):** cuello de botella medido. **GIL:** … **Backpressure:** … **Token bucket:** … **Observabilidad (o11y):** … **SLI/SLO:** … **Idempotency key:** … **DLQ:** … **last_done / resume_from:** …" | 9 bolded glossary terms inlined into one paragraph. FH=−14.3 ("muy difícil"). Same mega-paragraph pattern documented in S01 ("Diccionario del día 1", 438w/9 bolded terms) — a systemic curriculum tic. A glossary <dl> or bullet list would drop cognitive load sharply. |
| 8 | H | L66 (theory T1-A, paragraph 1) | 116 | "Threads conviene cuando el cuello es I/O concurrente (esperas de red o disco) y el trabajo por hilo es liviano. Processes conviene cuando el cuello es CPU (features densas, scoring vectorial) y quieres evadir el GIL de CPython. Async brilla con muchos I/O en un solo hilo de evento, siempre que no bloquees el loop con CPU pesada. **Mide primero** (wall vs CPU en el path caliente); la moda del framework no es un contrato. En stdlib, el modelo se materializa con `concurrent.futures.ThreadPoolExecutor` / `ProcessPoolExecutor` o `asyncio` + `wait_for` para timeouts; aquí practicamos el **criterio de elección**, colas acotadas y contratos de fallo sin lanzar pools pesados ni red real en el navegador." | FH≈3. Longest non-title paragraph in the section. Three parallel "X conviene cuando…" sentences + a 4th-comparing clause + a 5th-mechanism clause. The content is correct but it tries to introduce threads, processes, async, GIL, stdlib executors AND the meta-rule ("mide primero") in one breath. |
| 9 | H | L115 (theory T1-B, "Aplicación" paragraph) | 105 | "Aplicación a `CASO-LIM-038-T1B` (sigue `c-synth-1`): en lugar de enviar el registro completo del cliente sintético al process pool de features, enviamos `{case_id, score, feature_ids}`. `json.dumps` del dict compacto cabe en decenas de bytes; el GIL sigue limitando threads CPU, así que el scoring denso va a processes solo si el payload compacto justifica el IPC. En código de producción usarías `ProcessPoolExecutor` con ese payload mínimo; aquí medimos bytes y preferimos compacto sin lanzar procesos en el playground. Puente a T2: con el modelo elegido, la cola del worker aún puede crecer sin límite si no hay backpressure." | FH≈4. Combines the application narrative + a reasoning clause + a production-contract caveat + a forward bridge to T2 in one block. |
| 10 | H | L68 (theory T1-A, "Aplicación" paragraph) | 108 | "Aplicación a `CASO-LIM-038-T1A` (Red Andina sintético): el caso `c-synth-1` entra por intake (I/O al proveedor mock de normalización) y luego calcula features locales (CPU). Primero midemos wall vs CPU; si wall >> CPU en el tramo de red, usamos async/threads; si el tramo de features satura un core, movemos ese tramo a process pool con N acotado (p. ej. 4). Datos inventados; sin credenciales ni red real; sin PII en logs del bench. El mismo `c-synth-1` reaparece en T2 (cola y timeout), T3 (corr y SLO) y T4 (checkpoint y DLQ): es un solo batch que se endurece por capas." | FH≈5. Three scenarios + 4 disclaimers + a 4-step roadmap in one paragraph. |
| 11 | H | L33 (theory opening, "Caso sintético Red Andina") | 95 | "Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia un API mock y CPU de features en lotes. Seguiremos el caso `c-synth-1` a lo largo de T1–T4: medir bound → acotar cola y tasa → emitir o11y sin PII → checkpoint/idempotencia → retry/DLQ/runbook. El foco es **concurrencia correcta y resiliencia operativa**, no micro-optimización con Numba/Cython. Orden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, `queue`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real." | FH≈7. Synthetic-case intro + roadmap + scope disclaimer + topic order + stack declaration in one block. |
| 12 | M | L15 (jobRelevance) | 65 | "En operación de triage (fintech, retail, banca de procesos en Perú y la región), un batch de scoring no puede colgarse por un proveedor lento ni duplicar side effects al reiniciar. Esta sección entrena concurrencia correcta, **observabilidad** (logs/metrics/traces; o11y en jerga de industria) y workflows con checkpoint/idempotencia para el gate CP-N3-C. Logs sin PII real; datos sintéticos CASO-LIM-038." | FH≈−32. Visible at the top of every section view (panel "¿Para qué te sirve esto?"). Two clauses joined by `;` plus a third disclaimer sentence. |
| 13 | M | L380 (iDo.intro) | 83 | "Te muestro 8 demos sobre el hilo de `c-synth-1` / CASO-LIM-038 (sintético), en el mismo orden que endurecerías un batch en operación: medir bound (S37 → aquí) → payload compacto → cola acotada → timeout → observabilidad (o11y) → SLO/error budget → checkpoint → retry/DLQ/runbook. Cada demo ejecuta un mecanismo stdlib o un contrato local con think-aloud; sin red real ni PII. Al final del You Do ensamblas los cuatro pilares para el gate CP-N3-C (S39 los integrará en el Case Triage)." | FH≈10. The 8-step arrow chain alone is 30+ words. |
| 14 | M | L613 (weDo.intro) | 60 | "S38 · Laboratorio de operación resiliente del triage (24 retos). E1 repara un defecto del contrato, E2 fija la política válida/inválida y E3 transfiere el criterio a un incidente sintético nuevo (cambio de fixture, no solo renombrar el print). Sigue el hilo de `c-synth-1` cuando el fixture lo indique. Fixtures CASO-LIM-038; sin PII real ni red." | FH≈14. |
| 15–24 | M | weDo instructions | 46–63 each | 10 of the 24 exercise instructions cross the 45-word run-on threshold (e.g. L619 E1-T1-A=58w, L715 E3-T1-A=61w, L1059 E1-T2-B=60w, L1154 E3-T2-B=56w, L1255 E2-T3-A=63w, L1389 E2-T3-B=57w, L1438 E3-T3-B=56w, L1695 E3-T4-B=65w). | Each instruction mixes the contract, the expected output and the defect description in one sentence. Functional but dense; splitting at "Salida esperada:" / "Starter …" would reduce cognitive load before the learner opens the editor. |

### D. Style / typography

| # | Sev | Location | Evidence | Pedagogical impact |
|---|---|---|---|---|
| 25 | M | L33, L66, L110, L145, L234, L271, L276, L344, plus iDo demos and several instructions | `vs` without period — `I/O vs CPU`, `wall vs CPU`, `latencia mock vs presupuesto`, `p95=120ms vs SLO 200ms`, `full vs compacto`, etc. | LT `PUNTO_EN_ABREVIATURAS` × 13. RAE-preferred form is `vs.` (abbreviation of *versus*). In Peruvian tech prose `vs` without period is common; treat as consistency polish. |
| 26 | L | L276, L276 (callout context) | `p95=120ms`, `SLO 200ms`, `p95 sube a 400ms`, `2.5s`, `1s` | LT `SPACE_UNITIES` × 6. SI/RAE style is a thin/non-breaking space between number and unit (`120 ms`, `2.5 s`). Numbers+unit-without-space is widespread in code-adjacent Spanish; fix only if the curriculum standardizes SI. |
| 27 | L | L671 (weDo E2-T1-A hint) | "processes añaden IPC innecesario si no hay CPU densa." | LT `english_dominant_suspect` — `es_markers=0`. Hint sentence is short and almost entirely code-switched; readable but flagged by the heuristic. |
| 28 | L | L1308, L1574, L1696, L532 | "redact(s) = s[:2] + '***' si len>2; conserva case_id sintético." / "No vuelvas a intake si features ya está done." / "Runbook: síntomas → checks → acciones; no improvise bajo presión." / "Observabilidad (o11y) = logs + metrics + traces correlacionados." | LT `english_dominant_suspect` × 4. These are deliberate code-switching fragments inside hints/whys where the technical lexicon is English (case_id, intake, done, logs, metrics, traces). Acceptable in tech-ES pedagogy. |
| 29 | L | L1532 (weDo E2-T1-A hint `hints[1]`) | "Si cpu_ms >= wall_ms * 0.8 el bound es cpu." | The standalone `* 0.8` is ambiguous: meant as multiplication, but if the hint is ever piped through `<RichText>` it would italicize "0.8 el bound es cpu". Currently rendered as raw text (safe) — but the latent issue plus the readability of `*` vs `×` is a polish opportunity. |
| 30 | L | L8 (tagline) | "pipeline reanudable con trace por caso, métricas de cola y manejo de proveedor lento, proceso caído y reejecución" | Tagline has no terminal period and starts lowercase ("pipeline…"). Intentional (it's a tagline, not a sentence) but flagged by the heuristic. Acceptable. |

### E. Anaphoric monotony / code-identifier leakage (systemic)

| # | Sev | Location | Evidence | Pedagogical impact |
|---|---|---|---|---|
| 31 | L | All 8 theory subtopics | Every subtopic opens with a paragraph "Contrato operativo. Entrada: … Salida: … Error: … Criterio: …" (L32, L67, L114, L146, L195, L238, L275, L312, L348). The pattern is intentional (contract-first pedagogy) but the literal phrase "Contrato operativo." appears 8 times. | Mild template rhythm fatigue. Alternative: vary the contract lead-in ("Contrato del tramo", "Contrato de operación", "Acuerdo operativo"). |
| 32 | M | All 24 weDo instructions | Every exercise instruction begins `S38-T1-A-E1 · CASO-LIM-038-1A: …`, `S38-T1-A-E2 · CASO-LIM-038-1A2: …`, …, `S38-T4-B-E3 · CASO-LIM-038-4B (transfer): …` — internal taxonomy IDs (`S38-T*-**-E*`, `CASO-LIM-038-…`) visible verbatim to learners. | Same code-identifier-leak pattern flagged in S10/S11 (CASO-LIM-010 × 31, subtopic IDs in instructions). Learners don't need the internal ID to do the exercise; the prefix adds ~30 chars of noise per instruction × 24 = ~720 chars of cognitive overhead. The IDs are useful for analytics/review, but should be hidden behind a `<code>` chip or moved to an aria-label. |
| 33 | L | All 24 weDo exercises | `hint` field is byte-identical to `hints[0]` in 24/24 exercises. | Systemic DRY issue (same in S01/S09/S10). The duplicated string is a maintenance hazard: a fix to `hint` will drift from `hints[0]`. Either drop `hint` and render `hints[0]`, or auto-derive `hint = hints[0]` in the loader. |

### F. Code/output integrity (spot-check) — NO defects

All 24 We Do exercises were manually traced starter→solution→expected output:

- E1-T1-A: starter always returns `"async_or_threads"`; solution maps bound→model and outputs `processes / bound cpu / ok True` ✓
- E2-T1-A: solution outputs `async_or_threads / bound io / ok True` ✓
- E3-T1-A: solution outputs `processes / measure_first True / ok True` ✓
- E1-T1-B: `json.dumps({"x":2}).encode()` = 8 bytes, decode = `{"x": 2}` ✓
- E2-T1-B: `gil_status("threads","cpu")` → `"limited"` ✓
- E3-T1-B: `payload_bytes(compact)=31 < payload_bytes(full)` → `compact_payload` ✓
- E1-T2-A: `TokenBucket(2)` → `[True,True,False]`, `sum=2`, `third=False` ✓
- E2-T2-A: `Queue(maxsize=50)`, qsize=2 ✓
- E3-T2-A: `TokenBucket(1)` → first True, second False ✓
- E1-T2-B: `fetch_policy(8000,5)` → `{"status":"timeout","seconds":5,"on_fail":"retry_or_dlq"}` ✓
- E2-T2-B: try/except/finally → `closed=True` ✓
- E3-T2-B: `needs_incident(5000,1.0)=True`, `action_for(True)="open_runbook"` ✓
- E1-T3-A: `emit_scored(...)` returns dict with `corr="corr-1"`, `pii_raw=False` ✓
- E2-T3-A: `active_pillars({logs:T,metrics:T,traces:T})` = `["logs","metrics","traces"]` ✓
- E3-T3-A: `redact("ana@example.pe")` = `"an***"`, `pii_raw=False` ✓
- E1-T3-B: `"90000001"[:2]+"****"+"90000001"[-2:]` = `"90****01"` ✓
- E2-T3-B: `slo_ok(p95=100≤200 AND err=0.01≤0.02)` = `True` ✓
- E3-T3-B: `budget_action(0)` = `"freeze_nonurgent_deploys"` ✓
- E1-T4-A: `WORKFLOW_STATES` = 4 states, `is_terminal("failed")=True` ✓
- E2-T4-A: `idem_key("c-synth-1","features","v3")` = `"c-synth-1:features:v3"` ✓
- E3-T4-A: `NEXT["features"]="score"` ✓
- E1-T4-B: `0.1 * 2**3 = 0.8` ✓
- E2-T4-B: `route("poison")="dlq"` ✓
- E3-T4-B: `runbook["actions"]` contains `"restart_worker"` ✓

All 8 I Do demos similarly trace correctly. **Zero code/output drift.** This is the strongest dimension of S38 and a clear improvement over S03 (5 critical drift bugs) — the synthetic-data refresh pass that broke S03 appears to have been applied cleanly here.

### G. Self-check MCQs — quality and alignment

9 MCQs, each `correctIndex` verified:

| # | Topic | correctIndex | Alignment |
|---|---|---|---|
| Q1 | CPU-bound preference | 1 ("Procesos") | T1-A, T1-B |
| Q2 | Backpressure evita | 3 ("Colas infinitas y OOM") | T2-A |
| Q3 | Idempotencia permite | 0 ("Reejecutar sin side effects duplicados") | T4-A |
| Q4 | Logs de prod | 2 ("Redactar PII y correlacionar") | T3-A, T3-B |
| Q5 | Proveedor sin timeout | 1 ("Hang de workers y cola bloqueada") | T2-B |
| Q6 | Error budget agotado | 3 ("Priorizar estabilidad y remediación") | T3-B |
| Q7 | Mensaje poison | 0 ("DLQ con replay controlado") | T4-B |
| Q8 | Antes de elegir concurrencia | 2 ("Medir bottleneck y documentar bound") | T1-A, S37 bridge |
| Q9 | Tras checkpoint last_done='features' | 1 ("score — siguiente paso") | T4-A |

Coverage: 8/8 learning outcomes are probed; correctIndex distribution {0,3,0,2,1,3,0,2,1} — no positional bias (3× at index 0, 1× at index 1, 2× at index 2, 2× at index 3, plus index 3 again). Explanations are concise and pedagogically sound. ✓

### H. Meta-leak audit — CLEAN

Patterns scanned (case-sensitive, word-boundary): `TODO`, `FIXME`, `XXX`, `TBD`, `WIP`, `STUB`, `PLACEHOLDER`, `moved from`, `moved-from`, `curriculum_hardening`, `STORM`, `FIXER`, `hardening`, `pseudonym`, `scratch`, `ad hoc`, `lorem`, `ipsum`, `developer note`, `note to self`, `@author`, `@internal`, `@private`, `never surface`, `do not render`, `delete me`, `temp\b`, `tmp\b`.

**Zero matches** in `s38-performance-extreme.ts`. The internal IDs that *do* surface (`S38-T1-A-E1`, `CASO-LIM-038-1A`) are pedagogically framed (each is followed by a learner-facing description), but they are the same code-identifier-leak pattern flagged in §E #32 — they are not author-to-developer leaks; they are taxonomy that arguably should be hidden.

### I. Identity / id-drift audit — NO defect (unlike S06/S09/S13)

| Field | Value | Content match? |
|---|---|---|
| `id` | `performance-extreme` | ✓ Content is concurrency + observability + resilience = "performance engineering at the operational extreme" |
| Filename | `s38-performance-extreme.ts` | ✓ Matches id |
| URL hash | `#performance-extreme` | ✓ Matches id |
| `shortTitle` | "Concurrencia y resiliencia" | ✓ Matches content |
| `SectionView.tsx` playground dictionary key `'performance-extreme'` | "Practica backpressure, timeout e idempotencia" demo | ✓ On-topic (backpressure + token bucket + timeout + idem_key) |
| `PdfReport.tsx` label (not audited directly here but flagged in S09) | — | No S38-specific defect found |

Unlike S06 (id `numpy` for a no-NumPy collections section), S09 (id `visualization` for an exceptions section), S13 (id `rpa-automation` for a Familiarity Evidence Dashboard), the `performance-extreme` id is consistent with the actual content. No downstream-consumer mismatch to fix.

---

## 4. Meta-Leak Report

| Location | Leaked text | Severity | Recommendation |
|---|---|---|---|
| (none in source file) | — | — | — |
| `SectionView.tsx:189, 401, 491, 571, 614, 649` (shared component, affects S38) | Raw JSX `{section.jobRelevance}`, `{block.callout.content}`, `{step.instruction}`, `{step.feedback}`, `{project.context}`, `{project.portfolioNote}` — not routed through `<RichText>` | H (systemic, shared) | Wrap these 6 fields in `<RichText content={…} sectionId={section.id} />`. Confirmed live impact in S38: `**observabilidad**` and `**ambos**` would render as literal asterisks. |
| S38 source L32, L67, L114, L146, L195, L238, L275, L312, L348 (8 paragraphs) | "Contrato operativo. Entrada: …" — template phrasing | L (intentional pattern, not a leak) | Optional: vary the lead-in. Not a developer-to-learner leak. |
| S38 source all 24 weDo instructions | `S38-T1-A-E1 · CASO-LIM-038-1A: …` (taxonomy ID prefix) | M (systemic across S10/S11/S38) | Hide the prefix behind a `<code>` chip with `aria-label`, or strip it before rendering. |
| S38 source L30 (Diccionario) and L8 (tagline) | No leak; intentional Spanish lowercase openings | — | — |

**No AI-to-developer comments, no "moved from section X", no design notes, no internal instructions** leaked into user-facing text.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — 9.5/10

- **I Do (8 demos):** each demo has `demoId`, `subtopicId`, `environment: "local-python"`, `description` (1-line), `code` (title + code + output) and `why` (think-aloud). Demos follow the same `c-synth-1` thread in the same order as the theory: measure_bound → payload bytes → queue+token bucket → timeout+finally → emit_scored → SLO+redact → checkpoint+idem_key → backoff+DLQ+runbook. Each `why` is a genuine think-aloud ("no elijo processes por moda; mido wall vs CPU del tramo features y solo entonces documento processes").
- **We Do (24 exercises):** strictly 3 per subtopic, with `kind` ramp `guided → independent → transfer`. Each has `instruction`, `hint`, `hints` (2 items), `edgeCases` (3 items), `tests` (1 line, "Salida exacta de tres líneas…"), `feedback` (1 line), `starterCode` (with a `# DEFECTO` comment), `solutionCode` (with `output`). The defect-driven pedagogy is exemplary: every starter is a *plausible wrong* answer that mirrors a real production mistake (async for CPU-bound, unlimited queue, hang without timeout, PII in logs, retry_forever on poison, runbook vacío). The `transfer` exercises (E3) introduce a *new fixture variant* (`CASO-LIM-038-1A3`, `1B3`, `2A3`, `2B3`, `3A3`, `3B3`, `4A3`, `4B3`) rather than renaming the print, exactly as the weDo.intro promises ("cambio de fixture, no solo renombrar el print").
- **You Do capstone:** CP-N3-C pipeline reanudable, with 4 objectives, 5 requirements, full scaffold (4 `NotImplementedError` stubs for measure_bound, pick, fetch_policy, runbook) plus 4 working helpers (redact, checkpoint, backoff, route), `portfolioNote` describing the deliverable, and a 7-criterion rubric (with `bonus` for "Idempotencia + runbook de fallos"). Strongly aligned with S39 integrator-phase2.

### 5.2 Connective tissue — 9/10

- **Backward:** explicit "Continúa la disciplina de S37 (medir antes de cambiar)" (L31), "S37 → aquí" (L380), "S37 y S38 comparten la regla: medir primero" (Q8 explanation).
- **Forward:** "prepara los contratos que S39 ensamblará en el Case Triage N3" (L31), "S39 los integrará en el Case Triage" (L380), "Estos contratos de operación alimentan el Case Triage N3 en S39" (L349).
- **Lateral:** the same `c-synth-1` thread is reused across T1→T2→T3→T4 ("es un solo batch que se endurece por capas", L33), with each subtopic's "Aplicación" paragraph explicitly naming the bridge to the next subtopic ("Puente a T2: con el modelo elegido, la cola del worker aún puede crecer sin límite si no hay backpressure", L68).

### 5.3 Cognitive load & progressive disclosure — 7/10

- The 8-subtopic × 3-exercise grid is well-paced: T1 (concurrency choice) → T2 (load control) → T3 (observability) → T4 (resilient workflows). Each subtopic adds exactly one mechanism on top of the previous.
- **The single biggest load problem is the "Diccionario de la sección" mega-paragraph (L30, 102 words, 9 bolded terms).** It front-loads the entire glossary before any of the concepts have been introduced. The S01 audit flagged the same pattern (438-word mega-glossary). Recommended fix: move to a `<dl>` or bullet list, or distribute the terms to their first-occurrence subtopic.
- The "Contrato operativo. Entrada: … Salida: … Error: … Criterio: …" structure (8 occurrences) is pedagogically sound (contract-first) but the sentences are dense — averaging 50–60 words each. Splitting at "Salida:" / "Error:" / "Criterio:" with periods (instead of running them as one sentence with `.` separators inside one paragraph) would help.

### 5.4 Exercise and exam quality — 9/10

- All 24 exercises verified for starter↔solution↔output alignment (see §3.F).
- Defect-driven pedagogy: every `# DEFECTO` comment names the specific production anti-pattern being fixed ("DEFECTO: CPU-bound necesita processes por el GIL", "DEFECTO: sin maxsize finito — política de cola ilimitada", "DEFECTO: no enmascara", "DEFECTO: reintenta veneno en bucle"). This is industry-grade.
- The `edgeCases` arrays (3 per exercise × 24 = 72 items) are short labels ("hang", "retry infinito", "sintético", "OOM", "429 storm", "p95 explotado", "doble side effect", "loop de fallo", etc.) — useful as review checklist.
- The `feedback` field (1 line per exercise) reinforces the why, not the what.
- Self-check (§3.G): 9 MCQs, all correctIndex values verified, no positional bias, all aligned to LOs.
- **Minor alignment gap:** the weDo.intro claims "E1 repara un defecto del contrato, E2 fija la política válida/inválida y E3 transfiere el criterio a un incidente sintético nuevo". The E3 (transfer) exercises do introduce a new fixture variant (e.g. `CASO-LIM-038-1A3`), but the underlying *code* of E3 is largely isomorphic to E1/E2 (same `pick`, same `measure_bound`, same `route`). The "transfer" claim is partially true: the *scenario* changes but the *mechanism* doesn't. This is acceptable for Phase-2 but a future iteration could make E3 truly transfer (e.g. ask the learner to apply the same mechanism to a new bound like `mixed`, not just re-run the same logic with a new fixture label).

### 5.5 Consistency with roadmap and previous sections — 9/10

- Phase-2 gate CP-N3-C is explicitly named in: jobRelevance (L15), theory opening (L28), callout (L57), youDo.title (L1733), portfolioNote (L1806), rubric (L1817). ✓
- `CASO-LIM-038` synthetic-case pattern matches the curriculum-wide `CASO-LIM-NNN` convention.
- `c-synth-1` thread matches the convention used in other Phase-2 sections.
- Stdlib-only stack matches S06's "Si tu solución de S06 importa numpy o pandas, está fuera de alcance" discipline (no external libs in starter/solution code).
- The privacy posture (no PII real, no real network, no real secrets) is consistent with S14 (security) and S30 (security-infra).

### 5.6 Comparison with best-in-class external materials

| Source | How S38 compares |
|---|---|
| Google SRE Book — Service Level Objectives (cited in resources) | S38's SLI/SLO/error-budget treatment (T3-B) is a faithful distillation of the SRE chapter, with the bonus of an actionable Python `slo_status()` / `budget_action()` contract. Better pedagogically than the book for a beginner because it shows code, not prose. |
| Google SRE — Addressing Cascading Failures (cited) | S38's T2-A (backpressure) + T2-B (timeout) + T4-B (retry/DLQ) cover the same patterns. The token-bucket simplification ("didáctico estático: sin refill por tiempo") is honestly flagged as a simplification, not a production rate-limiter. |
| Python `asyncio` / `concurrent.futures` docs (cited) | S38 deliberately *does not* run real asyncio/ProcessPoolExecutor in the playground ("sin red real ni event loop en el navegador"). The conceptual contracts (`pick(bound)`, `pool_plan`, `measure_bound`) are correct and the `# En prod: ThreadPoolExecutor / ProcessPoolExecutor(max_workers=n)` comments bridge to the real API. |
| Twelve-Factor App (cited) | Factor VII (logs as event streams) and Factor IX (disposability) are encoded in the `scored_event` / `fetch_policy` contracts. |
| MIT 6.824 / Stanford CS110 (cited) | S38 is lighter on distributed-systems theory (no consensus, no quorum, no leader election) — appropriate for a 19-hour Python-centric section, not a graduate OS course. |

S38's external-resource list (10 docs, 2 books, 6 courses) is the right shape and the citations are accurate. No link rot checked in this pass (would require HTTP HEAD per URL, out of scope).

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Before/After

> Method: 218 prose records extracted via line-aware TS regex, split into 395 sentences by a Spanish-aware tokenizer (protecting `p.ej.`, `vs.`, decimals, initials). For each unit computed Fernández-Huerta (FH), Szigriszt-Pazos/INFLESZ, words-per-sentence (WPS), syllables-per-word (SPW) and 13 pedagogical heuristics. Aggregate: **FH mean 79.2** ("fácil"), **INFLESZ mean 75.1** ("bastante fácil"), **WPS mean 14.13**, **SPW mean 1.888**. Band distribution: 140 muy_fácil, 70 bastante_fácil, 63 fácil, 47 normal, 38 bastante_difícil, 20 difícil, 17 muy_difícil (mostly short titles and code-switched fragments, not prose). LanguageTool `es` via public API on 4 chunks (~24.7k chars total): 1 094 raw matches, 68 after MORFOLOGIK/HUNSPELL filter, of which ~30 are real findings (rest are false positives on tech identifiers, English nouns, code paths).

Below: rewrites for each tab where real issues were found. Sentences flagged only by false-positive heuristics (e.g. short titles with no terminal period, MCQ questions ending in `:`, English-dominant code-switched hints) are omitted.

### 6.1 Theory — "Operación del triage (CP-N3-C)" (L28–L33)

**L15 jobRelevance — Before (65w, FH≈−32):**
> En operación de triage (fintech, retail, banca de procesos en Perú y la región), un batch de scoring no puede colgarse por un proveedor lento ni duplicar side effects al reiniciar. Esta sección entrena concurrencia correcta, **observabilidad** (logs/metrics/traces; o11y en jerga de industria) y workflows con checkpoint/idempotencia para el gate CP-N3-C. Logs sin PII real; datos sintéticos CASO-LIM-038.

**After (split + concordance-safe; assumes `<RichText>` will be applied — without it, remove the `**`):**
> En operación de triage (fintech, retail, banca de procesos en Perú y la región), un batch de scoring no puede colgarse por un proveedor lento ni duplicar side effects al reiniciar. Esta sección entrena concurrencia correcta, **observabilidad** (logs, metrics y traces; o11y en jerga de industria) y workflows con checkpoint e idempotencia para el gate CP-N3-C. Logs sin PII real; datos sintéticos CASO-LIM-038.

(Rewrite note: replaced `logs/metrics/traces` with `logs, metrics y traces` for Spanish-list coherence; replaced `checkpoint/idempotencia` with `checkpoint e idempotencia` for the `y`→`e` rule before `i`.)

**L30 "Diccionario de la sección" (102w, FH≈−14) — Before:**
> **Diccionario de la sección** (léelo antes de T1). **Bound (I/O vs CPU):** cuello de botella medido. **GIL:** Global Interpreter Lock de CPython (limita CPU multi-thread). **Backpressure:** cola con `maxsize` que frena al productor. **Token bucket:** rate limit didáctico (aquí estático; en prod se rellena por ventana). **Observabilidad (o11y):** logs + metrics + traces unidos por correlation_id. **SLI/SLO:** indicador vs objetivo de servicio; **error budget** es lo que se consume al violar el SLO. **Idempotency key:** `case:step:ver` para no duplicar side effects. **DLQ:** dead-letter queue de mensajes venenosos. **last_done / resume_from:** último paso checkpointed vs siguiente pendiente.

**After (as a definition list, dramatically reduces cognitive load):**
> **Diccionario de la sección** (léelo antes de T1).
>
> - **Bound (I/O vs. CPU):** cuello de botella medido.
> - **GIL:** Global Interpreter Lock de CPython (limita CPU multi-thread).
> - **Backpressure:** cola con `maxsize` que frena al productor.
> - **Token bucket:** rate limit didáctico (aquí estático; en prod se rellena por ventana).
> - **Observabilidad (o11y):** logs + metrics + traces unidos por `correlation_id`.
> - **SLI/SLO:** indicador vs. objetivo de servicio; **error budget** es lo que se consume al violar el SLO.
> - **Idempotency key:** `case:step:ver` para no duplicar side effects.
> - **DLQ:** dead-letter queue de mensajes venenosos.
> - **last_done / resume_from:** último paso checkpointed vs. siguiente pendiente.

(Rewrite note: bullet list drops the paragraph from 102w/1sentence to 9 short clauses. Also added `vs.` with period for consistency. If `<RichText>` is applied to jobRelevance but not to theory paragraphs… wait, theory paragraphs ARE rendered through `<RichText>` (SectionView.tsx:387) so the markdown bullet list would render correctly.)

**L33 "Caso sintético Red Andina" (95w, FH≈7) — Before:**
> Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia un API mock y CPU de features en lotes. Seguiremos el caso `c-synth-1` a lo largo de T1–T4: medir bound → acotar cola y tasa → emitir o11y sin PII → checkpoint/idempotencia → retry/DLQ/runbook. El foco es **concurrencia correcta y resiliencia operativa**, no micro-optimización con Numba/Cython. Orden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, `queue`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real.

**After (split into 3 sentences, fix `un API` → `una API`, fix `checkpoint/idempotencia` → `checkpoint e idempotencia`):**
> Caso sintético Red Andina (organización ficticia, datos inventados): una worker de scoring recibe picos de I/O hacia una API mock y CPU de features en lotes. Seguiremos el caso `c-synth-1` a lo largo de T1–T4: medir bound → acotar cola y tasa → emitir o11y sin PII → checkpoint e idempotencia → retry/DLQ/runbook. El foco es **concurrencia correcta y resiliencia operativa**, no micro-optimización con Numba/Cython.
>
> Orden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, `queue`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real.

(Actually "worker" is masculine in tech-ES loanword usage — "un worker". Keep `un worker`. Only change `un API` → `una API`. Final: "un worker de scoring recibe picos de I/O hacia una API mock…")

### 6.2 Theory — "Threads, processes y async" (T1-A, L63–L68)

**L66 (116w, FH≈3) — Before:**
> Threads conviene cuando el cuello es I/O concurrente (esperas de red o disco) y el trabajo por hilo es liviano. Processes conviene cuando el cuello es CPU (features densas, scoring vectorial) y quieres evadir el GIL de CPython. Async brilla con muchos I/O en un solo hilo de evento, siempre que no bloquees el loop con CPU pesada. **Mide primero** (wall vs CPU en el path caliente); la moda del framework no es un contrato. En stdlib, el modelo se materializa con `concurrent.futures.ThreadPoolExecutor` / `ProcessPoolExecutor` o `asyncio` + `wait_for` para timeouts; aquí practicamos el **criterio de elección**, colas acotadas y contratos de fallo sin lanzar pools pesados ni red real en el navegador.

**After (split into 3 paragraphs: when-to-use, the rule, the stdlib bridge):**
> Threads conviene cuando el cuello es I/O concurrente (esperas de red o disco) y el trabajo por hilo es liviano. Processes conviene cuando el cuello es CPU (features densas, scoring vectorial) y quieres evadir el GIL de CPython. Async brilla con muchos I/O en un solo hilo de evento, siempre que no bloquees el loop con CPU pesada.
>
> **Mide primero** (wall vs. CPU en el path caliente); la moda del framework no es un contrato.
>
> En stdlib, el modelo se materializa con `concurrent.futures.ThreadPoolExecutor` / `ProcessPoolExecutor` o `asyncio` + `wait_for` para timeouts. Aquí practicamos el **criterio de elección**, colas acotadas y contratos de fallo sin lanzar pools pesados ni red real en el navegador.

**L68 "Aplicación a CASO-LIM-038-T1A" (108w, FH≈5) — Before:**
> Aplicación a `CASO-LIM-038-T1A` (Red Andina sintético): el caso `c-synth-1` entra por intake (I/O al proveedor mock de normalización) y luego calcula features locales (CPU). Primero midemos wall vs CPU; si wall >> CPU en el tramo de red, usamos async/threads; si el tramo de features satura un core, movemos ese tramo a process pool con N acotado (p. ej. 4). Datos inventados; sin credenciales ni red real; sin PII en logs del bench. El mismo `c-synth-1` reaparece en T2 (cola y timeout), T3 (corr y SLO) y T4 (checkpoint y DLQ): es un solo batch que se endurece por capas.

**After (fix `Red Andina sintético` → `Red Andina sintética`; split into 3 paragraphs):**
> Aplicación a `CASO-LIM-038-T1A` (Red Andina sintética): el caso `c-synth-1` entra por intake (I/O al proveedor mock de normalización) y luego calcula features locales (CPU). Primero midemos wall vs. CPU; si wall >> CPU en el tramo de red, usamos async/threads; si el tramo de features satura un core, movemos ese tramo a process pool con N acotado (p. ej. 4).
>
> Datos inventados; sin credenciales ni red real; sin PII en logs del bench.
>
> El mismo `c-synth-1` reaparece en T2 (cola y timeout), T3 (corr y SLO) y T4 (checkpoint y DLQ): es un solo batch que se endurece por capas.

### 6.3 Theory — "I/O vs CPU, GIL y serialización" (T1-B, L110–L115)

**L115 "Aplicación a CASO-LIM-038-T1B" (105w, FH≈4) — Before:**
> Aplicación a `CASO-LIM-038-T1B` (sigue `c-synth-1`): en lugar de enviar el registro completo del cliente sintético al process pool de features, enviamos `{case_id, score, feature_ids}`. `json.dumps` del dict compacto cabe en decenas de bytes; el GIL sigue limitando threads CPU, así que el scoring denso va a processes solo si el payload compacto justifica el IPC. En código de producción usarías `ProcessPoolExecutor` con ese payload mínimo; aquí medimos bytes y preferimos compacto sin lanzar procesos en el playground. Puente a T2: con el modelo elegido, la cola del worker aún puede crecer sin límite si no hay backpressure.

**After (split into 3 paragraphs):**
> Aplicación a `CASO-LIM-038-T1B` (sigue `c-synth-1`): en lugar de enviar el registro completo del cliente sintético al process pool de features, enviamos `{case_id, score, feature_ids}`. `json.dumps` del dict compacto cabe en decenas de bytes; el GIL sigue limitando threads CPU, así que el scoring denso va a processes solo si el payload compacto justifica el IPC.
>
> En código de producción usarías `ProcessPoolExecutor` con ese payload mínimo; aquí medimos bytes y preferimos compacto sin lanzar procesos en el playground.
>
> Puente a T2: con el modelo elegido, la cola del worker aún puede crecer sin límite si no hay backpressure.

### 6.4 Theory — "Correlation, redacción y SLI/SLO" (T3-B, L271–L276)

**L276 "Aplicación a CASO-LIM-038-T3B" (70w, FH≈?) — Before:**
> Aplicación a `CASO-LIM-038-T3B` (`c-synth-1`): p95=120ms vs SLO 200ms y error_rate=0.01 vs 0.02 → slo_ok True. Si p95 sube a 400ms, se abre incidente y se pausan deploys no urgentes según política de error budget. Solo datos sintéticos. Puente a T4: con o11y y presupuesto de error claros, el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.

**After (fix `presupuesto de error claros` → `presupuesto de error claro`; fix `120ms` → `120 ms`, `400ms` → `400 ms`, `vs` → `vs.`):**
> Aplicación a `CASO-LIM-038-T3B` (`c-synth-1`): p95 = 120 ms vs. SLO 200 ms y error_rate = 0.01 vs. 0.02 → slo_ok True. Si p95 sube a 400 ms, se abre incidente y se pausan deploys no urgentes según política de error budget. Solo datos sintéticos. Puente a T4: con o11y y presupuesto de error claro, el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.

### 6.5 I Do — intro (L380)

**L380 (83w, FH≈10) — Before:**
> Te muestro 8 demos sobre el hilo de `c-synth-1` / CASO-LIM-038 (sintético), en el mismo orden que endurecerías un batch en operación: medir bound (S37 → aquí) → payload compacto → cola acotada → timeout → observabilidad (o11y) → SLO/error budget → checkpoint → retry/DLQ/runbook. Cada demo ejecuta un mecanismo stdlib o un contrato local con think-aloud; sin red real ni PII. Al final del You Do ensamblas los cuatro pilares para el gate CP-N3-C (S39 los integrará en el Case Triage).

**After (split into 2 paragraphs):**
> Te muestro 8 demos sobre el hilo de `c-synth-1` / CASO-LIM-038 (sintético), en el mismo orden que endurecerías un batch en operación: medir bound (S37 → aquí) → payload compacto → cola acotada → timeout → observabilidad (o11y) → SLO/error budget → checkpoint → retry/DLQ/runbook.
>
> Cada demo ejecuta un mecanismo stdlib o un contrato local con think-aloud; sin red real ni PII. Al final del You Do ensamblas los cuatro pilares para el gate CP-N3-C (S39 los integrará en el Case Triage).

### 6.6 I Do — `why` fields (8 demos)

The 8 `why` fields are concise (30–40w each), all starting with the literal phrase "Think-aloud:". The phrase is pedagogically intentional (signaling the think-aloud technique) but 8 identical openings is mild anaphoric monotony. **Low severity, no rewrite required.** If polish is desired, vary 2–3 of them: "Razonamiento:", "En voz alta:", "Paso a paso:".

### 6.7 We Do — intro (L613) and instruction prefixes

**L613 weDo.intro (60w, FH≈14) — Before:**
> S38 · Laboratorio de operación resiliente del triage (24 retos). E1 repara un defecto del contrato, E2 fija la política válida/inválida y E3 transfiere el criterio a un incidente sintético nuevo (cambio de fixture, no solo renombrar el print). Sigue el hilo de `c-synth-1` cuando el fixture lo indique. Fixtures CASO-LIM-038; sin PII real ni red.

**After (split the lab framing from the E1/E2/E3 contract):**
> S38 · Laboratorio de operación resiliente del triage (24 retos). Sigue el hilo de `c-synth-1` cuando el fixture lo indique. Fixtures CASO-LIM-038; sin PII real ni red.
>
> Cada subtopic tiene tres retos: **E1** repara un defecto del contrato, **E2** fija la política válida o inválida, y **E3** transfiere el criterio a un incidente sintético nuevo (cambio de fixture, no solo renombrar el print).

**Instruction prefixes (24 exercises, e.g. L619) — Before:**
> S38-T1-A-E1 · CASO-LIM-038-1A: el path de features es CPU-bound (wall≈cpu en el profile sintético). Contrato: implementa pick(bound) para que bound='cpu' devuelva 'processes'; imprime la elección, la etiqueta bound y ok True. El starter ignora bound y devuelve siempre 'async_or_threads' (defect). Salida esperada: processes / bound cpu / ok True.

**After (strip the internal taxonomy prefix; keep the learner-facing contract):**
> El path de features es CPU-bound (wall ≈ cpu en el profile sintético). Contrato: implementa `pick(bound)` para que `bound='cpu'` devuelva `'processes'`; imprime la elección, la etiqueta bound y `ok True`. El starter ignora bound y devuelve siempre `'async_or_threads'` (defecto). Salida esperada: `processes` / `bound cpu` / `ok True`.

(The `S38-T1-A-E1 · CASO-LIM-038-1A:` prefix should move to a `<code>` chip with `aria-label="Exercise S38-T1-A-E1, case CASO-LIM-038-1A"` or be stripped entirely; the learner-facing instruction reads cleaner without it. Also fixed `defect` → `defecto` for Spanish consistency — the curriculum uses `# DEFECTO:` in code comments but `defect` (English noun) in instructions, which is inconsistent.)

### 6.8 We Do — instruction S38-T3-B-E2 (L1389, the `**ambos**` leak)

**Before:**
> S38-T3-B-E2 · CASO-LIM-038-3B2: SLI compuesto: p95_ms=100 (SLO≤200) y error_rate=0.01 (SLO≤0.02). Implementa slo_ok(sli, slo) que sea True solo si **ambos** umbrales se cumplen. Imprime True, p95 100 y limit 200. Starter solo mira p95 y además compara al revés (defect: ignora error_rate y invierte el signo).

**After (until `<RichText>` is applied to instructions, remove the `**` markers):**
> SLI compuesto: `p95_ms=100` (SLO ≤ 200) y `error_rate=0.01` (SLO ≤ 0.02). Implementa `slo_ok(sli, slo)` que sea `True` solo si ambos umbrales se cumplen. Imprime `True`, `p95 100` y `limit 200`. El starter solo mira p95 y además compara al revés (defecto: ignora error_rate e invierte el signo).

(Removed `**ambos**` since the field renders as raw text; "ambos" remains as plain emphasis via word order. Also fixed `defect` → `defecto`.)

### 6.9 You Do — context and portfolioNote (L1735, L1806)

**L1735 context (41w, FH≈?) — Before:**
> Construye un mini-worker sintético con pool/backpressure, logs redactados, checkpoint idempotente, retry/DLQ y runbook de proveedor lento. Integra el hilo de `c-synth-1` visto en T1–T4. Solo datos CASO-LIM-038; sin PII real ni servicios externos.

**After (the only issue is `pool/backpressure` and `retry/DLQ` slash-compounds — replace with `y`):**
> Construye un mini-worker sintético con pool y backpressure, logs redactados, checkpoint idempotente, retry con DLQ y runbook de proveedor lento. Integra el hilo de `c-synth-1` visto en T1–T4. Solo datos CASO-LIM-038; sin PII real ni servicios externos.

**L1806 portfolioNote (41w) — Before:**
> Operación CP-N3-C; evidencia de pipeline reanudable con trace por caso. Completa measure_bound + pick, fetch_policy (timeout mock), métrica de cola y runbook() con síntomas→acciones. Documenta en markdown un drill de proveedor lento. Sin red real ni PII.

**After (no real issue; minor `;` → `.` for sentence closure):**
> Operación CP-N3-C. Evidencia de pipeline reanudable con trace por caso. Completa `measure_bound` + `pick`, `fetch_policy` (timeout mock), métrica de cola y `runbook()` con síntomas → acciones. Documenta en markdown un drill de proveedor lento. Sin red real ni PII.

### 6.10 Self-check (9 MCQs)

All 9 questions end in `:` (e.g. "Para CPU bound en CPython suele preferirse:") — flagged by the `missing_terminal` heuristic but this is a false positive (MCQ stems conventionally end in colon). No rewrites needed.

The MCQ explanations are concise (1 line each), technically correct and pedagogically reinforcing. The Q8 explanation explicitly cites S37 ("S37 y S38 comparten la regla: medir primero") — strong backward connective tissue.

### 6.11 Aggregate grammar metrics

| Metric | Value | Band | Verdict |
|---|---|---|---|
| Mean FH | 79.16 | "fácil" | Healthy for technical Spanish (target 50–80 for tech-ES). |
| Mean INFLESZ | 75.1 | "bastante fácil" | Healthy. |
| Mean WPS | 14.13 | — | Below the 15–32 soft target; many short code-switched fragments pull the mean down. |
| Mean SPW | 1.888 | — | Normal Spanish lexical complexity. |
| Run-on (>45w) | 4 paragraphs + 0 sentences flagged as run-on at sentence level; 22 paragraphs flagged at paragraph level (mostly the "Contrato operativo" and "Aplicación a" patterns) | — | The sentence-level count is low because the section uses `;` and `.` aggressively inside long paragraphs; the paragraph-level count is the real load signal. |
| Long (>32w) | 11 sentences | — | Mostly exercise instructions and a few theory sentences. |
| missing_terminal | 25 | — | Almost entirely false positives (8 headings, 5 youDo objectives/requirements bullets, 7 MCQ stems, 1 tagline, plus the 4 actual sentence fragments). |
| english_dominant_suspect | 24 | — | All in code-switched hints/whys ("redact(s) = s[:2] + '***' si len>2", "No vuelvas a intake si features ya está done", "Runbook: síntomas → checks → acciones"). Acceptable in tech-ES pedagogy. |
| high_comma_density | 3 | — | All in the callouts ("Documento del on-call: síntomas, checks, acciones (restart worker, replay batch, escalar proveedor)", etc.). Acceptable for enumerations. |
| space_before_punct | 2 | — | Both in hints where `* 0.8` markdown-stripping left double spaces (false positives from the LT preprocessor). |

---

## 7. Proposed GitHub-style Diffs

> All diffs are proposals only; do not apply. Line numbers refer to `src/lib/course/sections/s38-performance-extreme.ts` unless otherwise noted.

### Diff 1 (HIGH) — Fix `Red Andina sintético` → `sintética` (2 occurrences)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ -33,1 +33,1 @@
-        "Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia un API mock y CPU de features en lotes. Seguiremos el caso `c-synth-1` a lo largo de T1–T4: medir bound → acotar cola y tasa → emitir o11y sin PII → checkpoint/idempotencia → retry/DLQ/runbook. El foco es **concurrencia correcta y resiliencia operativa**, no micro-optimización con Numba/Cython. Orden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, `queue`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real.",
+        "Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia una API mock y CPU de features en lotes. Seguiremos el caso `c-synth-1` a lo largo de T1–T4: medir bound → acotar cola y tasa → emitir o11y sin PII → checkpoint e idempotencia → retry/DLQ/runbook. El foco es **concurrencia correcta y resiliencia operativa**, no micro-optimización con Numba/Cython.\n\nOrden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, `queue`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real.",
@@ -68,1 +68,1 @@
-        "Aplicación a `CASO-LIM-038-T1A` (Red Andina sintético): el caso `c-synth-1` entra por intake (I/O al proveedor mock de normalización) y luego calcula features locales (CPU). Primero midemos wall vs CPU; si wall >> CPU en el tramo de red, usamos async/threads; si el tramo de features satura un core, movemos ese tramo a process pool con N acotado (p. ej. 4). Datos inventados; sin credenciales ni red real; sin PII en logs del bench. El mismo `c-synth-1` reaparece en T2 (cola y timeout), T3 (corr y SLO) y T4 (checkpoint y DLQ): es un solo batch que se endurece por capas.",
+        "Aplicación a `CASO-LIM-038-T1A` (Red Andina sintética): el caso `c-synth-1` entra por intake (I/O al proveedor mock de normalización) y luego calcula features locales (CPU). Primero midemos wall vs. CPU; si wall >> CPU en el tramo de red, usamos async/threads; si el tramo de features satura un core, movemos ese tramo a process pool con N acotado (p. ej. 4).\n\nDatos inventados; sin credenciales ni red real; sin PII en logs del bench.\n\nEl mismo `c-synth-1` reaparece en T2 (cola y timeout), T3 (corr y SLO) y T4 (checkpoint y DLQ): es un solo batch que se endurece por capas.",
```

### Diff 2 (HIGH) — Fix `presupuesto de error claros` → `claro` + unit spacing

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ -276,1 +276,1 @@
-        "Aplicación a `CASO-LIM-038-T3B` (`c-synth-1`): p95=120ms vs SLO 200ms y error_rate=0.01 vs 0.02 → slo_ok True. Si p95 sube a 400ms, se abre incidente y se pausan deploys no urgentes según política de error budget. Solo datos sintéticos. Puente a T4: con o11y y presupuesto de error claros, el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.",
+        "Aplicación a `CASO-LIM-038-T3B` (`c-synth-1`): p95 = 120 ms vs. SLO 200 ms y error_rate = 0.01 vs. 0.02 → slo_ok True. Si p95 sube a 400 ms, se abre incidente y se pausan deploys no urgentes según política de error budget. Solo datos sintéticos. Puente a T4: con o11y y presupuesto de error claro, el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.",
```

### Diff 3 (HIGH, shared component) — Route raw-rendered fields through `<RichText>`

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -189,1 +189,1 @@
-                <p className="text-sm text-foreground/80">{section.jobRelevance}</p>
+                <p className="text-sm text-foreground/80">
+                  <RichText content={section.jobRelevance} sectionId={section.id} />
+                </p>
@@ -401,1 +401,3 @@
-              {block.callout.content}
+              <RichText
+                content={block.callout.content}
+                sectionId={section.id}
+              />
@@ -491,1 +493,1 @@
-                <span className="text-sm font-semibold">{step.instruction}</span>
+                <span className="text-sm font-semibold">
+                  <RichText content={step.instruction} sectionId={section.id} />
+                </span>
@@ -571,1 +575,1 @@
-                      {step.feedback}
+                      <RichText content={step.feedback} sectionId={section.id} />
@@ -614,1 +618,1 @@
-            <p className="mt-1 text-sm text-foreground/80">{project.context}</p>
+            <p className="mt-1 text-sm text-foreground/80">
+              <RichText content={project.context} sectionId={section.id} />
+            </p>
@@ -649,1 +653,1 @@
-            {project.portfolioNote}
+            <RichText content={project.portfolioNote} sectionId={section.id} />
```

### Diff 4 (HIGH, cognitive load) — Split "Diccionario de la sección" mega-paragraph into bullet list

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ -30,1 +30,11 @@
-        "**Diccionario de la sección** (léelo antes de T1). **Bound (I/O vs CPU):** cuello de botella medido. **GIL:** Global Interpreter Lock de CPython (limita CPU multi-thread). **Backpressure:** cola con `maxsize` que frena al productor. **Token bucket:** rate limit didáctico (aquí estático; en prod se rellena por ventana). **Observabilidad (o11y):** logs + metrics + traces unidos por correlation_id. **SLI/SLO:** indicador vs objetivo de servicio; **error budget** es lo que se consume al violar el SLO. **Idempotency key:** `case:step:ver` para no duplicar side effects. **DLQ:** dead-letter queue de mensajes venenosos. **last_done / resume_from:** último paso checkpointed vs siguiente pendiente.",
+        "**Diccionario de la sección** (léelo antes de T1).\n\n" +
+        "- **Bound (I/O vs. CPU):** cuello de botella medido.\n" +
+        "- **GIL:** Global Interpreter Lock de CPython (limita CPU multi-thread).\n" +
+        "- **Backpressure:** cola con `maxsize` que frena al productor.\n" +
+        "- **Token bucket:** rate limit didáctico (aquí estático; en prod se rellena por ventana).\n" +
+        "- **Observabilidad (o11y):** logs + metrics + traces unidos por `correlation_id`.\n" +
+        "- **SLI/SLO:** indicador vs. objetivo de servicio; **error budget** es lo que se consume al violar el SLO.\n" +
+        "- **Idempotency key:** `case:step:ver` para no duplicar side effects.\n" +
+        "- **DLQ:** dead-letter queue de mensajes venenosos.\n" +
+        "- **last_done / resume_from:** último paso checkpointed vs. siguiente pendiente.",
```

### Diff 5 (HIGH, cognitive load) — Split L66 (116w) into 3 paragraphs

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ -66,1 +66,3 @@
-        "Threads conviene cuando el cuello es I/O concurrente (esperas de red o disco) y el trabajo por hilo es liviano. Processes conviene cuando el cuello es CPU (features densas, scoring vectorial) y quieres evadir el GIL de CPython. Async brilla con muchos I/O en un solo hilo de evento, siempre que no bloquees el loop con CPU pesada. **Mide primero** (wall vs CPU en el path caliente); la moda del framework no es un contrato. En stdlib, el modelo se materializa con `concurrent.futures.ThreadPoolExecutor` / `ProcessPoolExecutor` o `asyncio` + `wait_for` para timeouts; aquí practicamos el **criterio de elección**, colas acotadas y contratos de fallo sin lanzar pools pesados ni red real en el navegador.",
+        "Threads conviene cuando el cuello es I/O concurrente (esperas de red o disco) y el trabajo por hilo es liviano. Processes conviene cuando el cuello es CPU (features densas, scoring vectorial) y quieres evadir el GIL de CPython. Async brilla con muchos I/O en un solo hilo de evento, siempre que no bloquees el loop con CPU pesada.",
+        "**Mide primero** (wall vs. CPU en el path caliente); la moda del framework no es un contrato.",
+        "En stdlib, el modelo se materializa con `concurrent.futures.ThreadPoolExecutor` / `ProcessPoolExecutor` o `asyncio` + `wait_for` para timeouts. Aquí practicamos el **criterio de elección**, colas acotadas y contratos de fallo sin lanzar pools pesados ni red real en el navegador.",
```

### Diff 6 (MEDIUM) — Remove `**ambos**` leak in instruction (until Diff 3 lands)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ -1389,1 +1389,1 @@
-        instruction: "S38-T3-B-E2 · CASO-LIM-038-3B2: SLI compuesto: p95_ms=100 (SLO≤200) y error_rate=0.01 (SLO≤0.02). Implementa slo_ok(sli, slo) que sea True solo si **ambos** umbrales se cumplen. Imprime True, p95 100 y limit 200. Starter solo mira p95 y además compara al revés (defect: ignora error_rate y invierte el signo).",
+        instruction: "SLI compuesto: `p95_ms=100` (SLO ≤ 200) y `error_rate=0.01` (SLO ≤ 0.02). Implementa `slo_ok(sli, slo)` que sea `True` solo si ambos umbrales se cumplen. Imprime `True`, `p95 100` y `limit 200`. El starter solo mira p95 y además compara al revés (defecto: ignora error_rate e invierte el signo).",
```

### Diff 7 (MEDIUM) — Standardize `vs` → `vs.` across the file

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ (13 occurrences across L30, L33, L66, L110, L145, L234, L271, L276, L344, etc.)
-  vs CPU
-  vs SLO
-  vs presupuesto
-  vs objetivo
-  vs 0.02
-  vs compacto
-  wall vs CPU
+  vs. CPU
+  vs. SLO
+  vs. presupuesto
+  vs. objetivo
+  vs. 0.02
+  vs. compacto
+  wall vs. CPU
```

(Use `replace_all: true` with care: `vs` appears in `vs CPU`, `vs SLO`, `vs objetivo`, `vs 0.02`, `vs presupuesto`, `vs compacto`, `vs siguiente` — but the literal string `vs ` (with trailing space) is the safe replacement target. Avoid replacing `vs` inside code identifiers — there are none in this file.)

### Diff 8 (MEDIUM, DRY) — Drop duplicated `hint` field (or auto-derive from `hints[0]`)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ -620,1 +620,0 @@
-        hint: "Para CPU-bound en CPython prefiere processes por el GIL.",
        hints: [
          "Para CPU-bound en CPython prefiere processes por el GIL.",
          "pick debe mapear io→async_or_threads, cpu→processes, mixed→batch_then_io.",
        ],
@@ (repeat for all 24 exercises; then update the loader in src/lib/types.ts and SectionView.tsx
    to derive `hint = hints?.[0]` when `hint` is absent)
```

(Alternative, lower-risk approach: keep `hint` as-is but add a unit test / CI check that asserts `hint === hints[0]` for every exercise, so future drift is caught.)

### Diff 9 (LOW) — Replace ambiguous `wall_ms * 0.8` in hint with `wall_ms × 0.8`

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ -1532,1 +1532,1 @@
-          "Si cpu_ms >= wall_ms * 0.8 el bound es cpu.",
+          "Si cpu_ms >= wall_ms × 0.8 el bound es cpu.",
```

### Diff 10 (LOW) — Hide taxonomy ID prefix from learner-facing instruction

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -491,1 +491,5 @@
-                <span className="text-sm font-semibold">{step.instruction}</span>
+                <span className="text-sm font-semibold">
+                  {step.id && (
+                    <code className="mr-2 rounded bg-muted px-1 py-0.5 text-xs" aria-label={`Ejercicio ${step.id}`}>{step.id}</code>
+                  )}
+                  {stripTaxonomyPrefix(step.instruction)}
+                </span>
```

(Where `stripTaxonomyPrefix` is a small util that removes a leading `S\d+-T\d+-[A-Z]-E\d+\s*·\s*CASO-LIM-\d+-[A-Z0-9]+:\s*` regex. The `step.id` chip preserves discoverability for analytics and learner support without putting the raw ID at the start of every instruction.)

### Diff 11 (LOW) — Vary the 8 "Contrato operativo." paragraph openings

```diff
@@ L32  - "Contrato operativo de la sección. Entrada: …"
@@ L67  - "Contrato del tramo. Entrada: …"
@@ L114 - "Acuerdo del paso. Entrada: …"
@@ L146 - "Contrato de carga. Entrada: …"
@@ L195 - "Contrato de timeout. Entrada: …"
@@ L238 - "Contrato de observabilidad. Entrada: …"
@@ L275 - "Contrato de SLO. Entrada: …"
@@ L312 - "Contrato de workflow. Entrada: …"
@@ L348 - "Contrato de fallo. Entrada: …"
```

(Optional polish — the current uniform "Contrato operativo." is intentional contract-first pedagogy, but varying the noun reduces anaphoric monotony and gives each subtopic a memorable label.)

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|---|---|---|---|
| **P0** | Diff 3 — Route `jobRelevance`, `callout.content`, `step.instruction`, `step.feedback`, `project.context`, `project.portfolioNote` through `<RichText>` in `SectionView.tsx` | ~1.5h | Fixes the systemic markdown-leak across all 52 sections. Immediately fixes S38's `**observabilidad**` and `**ambos**` leaks. |
| **P0** | Diff 1 — Fix `Red Andina sintético` → `sintética` (2 occurrences) + `un API` → `una API` | 10min | Real grammar concordance error visible in theory tab. |
| **P0** | Diff 2 — Fix `presupuesto de error claros` → `claro` + `120ms`/`400ms` → `120 ms`/`400 ms` | 10min | Real grammar concordance error + SI style. |
| **P1** | Diff 4 — Split "Diccionario de la sección" mega-paragraph (L30) into a 9-item bullet list | 15min | Largest cognitive-load win in the section. Same pattern as S01. |
| **P1** | Diff 5 — Split L66 (116w) into 3 paragraphs | 10min | Second-largest cognitive-load win. |
| **P1** | Diff 6 — Remove `**ambos**` from instruction (if Diff 3 is delayed) | 5min | Prevents visible markdown leak in We Do tab. |
| **P2** | Diff 7 — Standardize `vs` → `vs.` (13 occurrences) | 15min | Style consistency. |
| **P2** | Split 4 remaining run-on theory paragraphs (L33, L68, L115, L380) at "Puente a" / "Datos inventados" / "En código de producción" boundaries | 30min | Each is a 95–108w paragraph that becomes 2–3 readable paragraphs. |
| **P2** | Diff 8 — Drop `hint` field duplication (or add CI assertion) | 30min + loader change | Systemic DRY across all sections (S01/S09/S10 also affected). |
| **P3** | Diff 10 — Hide taxonomy ID prefix from instruction rendering | 1h (shared component) | Systemic code-identifier-leak (S10/S11 also affected). |
| **P3** | Diff 9 — Replace `*` with `×` in hint to avoid markdown ambiguity | 2min | Future-proofing. |
| **P4** | Diff 11 — Vary "Contrato operativo." openings | 20min | Polish; current uniform pattern is acceptable. |

**Total P0+P1 effort: ~2.5h.** P0+P1+P2: ~4h.

---

## 9. Graph Memory Update Notes

For the shared context files / orchestrator:

- **S38 composite score: 8.0/10** — confirmed gold-standard Phase-2 section, on par with S09 and S13.
- **No id-drift defect** in S38 (unlike S06 `numpy`/`colecciones`, S09 `visualization`/`exceptions`, S13 `rpa-automation`/`Familiarity Evidence Dashboard`). The `performance-extreme` id matches the file name, URL hash, and section content. The `SectionView.tsx` playground dictionary entry for `performance-extreme` (L2963) is on-topic (backpressure + token bucket + timeout + idem_key demo).
- **Systemic issues confirmed present in S38** (cross-section pattern):
  - **Markdown-leak** (raw JSX for 6 fields in `SectionView.tsx`) — first flagged in S06, still present. S38 exhibits 2 confirmed leak sites (`jobRelevance` `**observabilidad**`, instruction `**ambos**`). P0 shared-component fix recommended across all 52 sections.
  - **`hint` === `hints[0]` duplication** — first flagged in S01, present in 24/24 S38 exercises. Systemic.
  - **Taxonomy ID prefix in instructions** (`S38-T1-A-E1 · CASO-LIM-038-1A:`) — same pattern as S10/S11. Systemic.
  - **"Diccionario de la sección" mega-paragraph** — same pattern as S01's "Diccionario del día 1". Systemic authoring tic.
- **New S38-specific findings** (not yet seen elsewhere):
  - `Red Andina sintético` → `sintética` (gender concordance, 2 occurrences).
  - `presupuesto de error claros` → `claro` (number concordance).
- **Code/output integrity: CLEAN** — all 24 We Do exercises verified starter↔solution↔output. Unlike S03 (5 critical drift bugs), the synthetic-data refresh pass landed cleanly in S38.
- **Self-check: 9 MCQs, all correctIndex verified, no positional bias.**
- **Meta-leak: CLEAN** in source file.
- **Auxiliary artefacts** (reused from prior attempt, available for orchestrator/fixer):
  - `/home/z/my-project/audits/S38_prose.txt` (40 KB extracted prose)
  - `/home/z/my-project/audits/S38_metrics.json` (113 KB; per-paragraph + per-sentence + worst-15 + aggregate)
  - `/home/z/my-project/audits/S38_lt.json` (26 KB; 1 094 raw LT matches, 68 after filter)
  - `/home/z/my-project/audits/_s38_grammar.py` (grammar scanner)
  - `/home/z/my-project/audits/_s38_lt.py` (LT API chunker)

---

## Method Note (Spanish Grammar Dimension)

**Research basis:** Fernández-Huerta (1959) Spanish Flesch adaptation (`206.84 − 60·(syll/word) − 1.02·(word/sent)`); Szigriszt-Pazos / INFLESZ (`206.835 − 62.3·(syll/word) − (word/sent)`); WPS and SPW surface metrics; LanguageTool `es` rule engine (public API, chunked to ≤18k chars with 4s sleep between requests); 13 pedagogical heuristics from `_GRAMMAR_SUBPLAN.md` (run-on >45w, long >32w, missing terminal, missing `¿`/`¡`, unbalanced delimiters, repeated words, DET–NOUN concordance, English-dominant, meta-leak, gerund pile-up, high comma density, paragraph-as-one-sentence, anaphoric monotony, space-before-punct).

**Spanish syllable counter:** vowel-group heuristic with strong/weak vowel distinction and accent handling (diphthongs collapse to one nucleus; two strong vowels or any accented vowel breaks the nucleus). Validated against known words (`pyarcana` → 4, `observabilidad` → 6, `idempotencia` → 5).

**Sentence splitter:** regex on `(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚ¿¡(])` with abbreviation protection (`p.ej.`, `p.e`, `etc.`, `Sr.`, `Sra.`, `Dr.`, `vs.`, `aprox.`, `máx.`, `mín.`, `Ud.`, `Uds.`, `S.A.`, `S.R.L.`), decimal protection (`N.N`), and initial protection (`A. Pérez`). Template literals `${…}` stripped before analysis.

**False-positive classes documented:**
- `MORFOLOGIK_RULE_ES` (1 026 of 1 094 raw LT matches): spelling on tech identifiers (`asyncio`, `backpressure`, `corr`, `idem_key`, `last_done`, `resume_from`, `c-synth-1`, `CASO-LIM-038`, etc.). Filtered out.
- `SUBJUNTIVO_INCORRECTO` on `traces` (English noun misread as Spanish subjunctive verb `trazar`).
- `PREP_VERB` on `con trace` / `con traje` (English noun `trace` misread as Spanish verb).
- `SUBJUNTIVO_PASADO` on `done` / `case` (English loanwords misread as Spanish subjunctive).
- `EL_TILDE` on `el resume continúa` (article + English loanword `resume` misread as pronoun `él`).
- `ESPACIO_DESPUES_DE_PUNTO` on `queue.Queue(maxsize=Q)` / `concurrent.futures.ThreadPoolExecutor` (module paths).
- `SPACE_UNITIES` on `1A2`, `1A3` (case-identifier suffixes, not units).
- `DOUBLE_PUNCTUATION` on `0..3` (range notation).
- `ES_UNPAIRED_BRACKETS` on `{"x": 2}` (JSON literal inside instruction).
- `WHITESPACE_RULE` on `wall_ms  0.8` (asterisk stripped by LT preprocessor left double space; in source it's `wall_ms * 0.8`).

**Real findings after false-positive filter:** ~30, of which the high-severity ones are the 2 concordance errors (Diffs 1–2), the markdown leak (Diff 3 + Diff 6), the cognitive-load mega-paragraph (Diff 4), and the run-on L66 (Diff 5). The rest are `vs` → `vs.` style polish (Diff 7) and unit spacing.

**Validation:** aggregate FH=79.16 is in the plausible "fácil" band for technical Spanish; SPW=1.888 is normal; 395 sentences and 5 582 words is consistent with a 19-hour section's prose volume; worst-15 list correctly identifies the mega-glossary and run-on paragraphs as the lowest-FH units.

---

**This is the complete Explorer report for Section 38. Ready for the Fixer prompt.**
