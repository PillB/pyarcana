# S09 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Excepciones, debugging y logging seguro
- **id:** `visualization` (index 9; archivo histórico `s09-visualization.ts` — contenido es excepciones/logs/resiliencia, no gráficos)
- **source:** `src/lib/course/sections/s09-visualization.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A tipos/raise/chaining · T1-B fronteras try/else/finally · T2-A traceback · T2-B minimal repro · T3-A logging estructurado · T3-B correlation_id + PII · T4-A fail-fast vs cuarentena · T4-B retry/idempotencia
- **story:** inicio **CP-N1-C**, job de intake sintético CASO-LIM-009, bridge desde ETL/manifest S08 hacia CLI S10
- **Round 1 context:** `round1/S09_EXERCISE_PEDAGOGY_REPORT.md` (context only — **not** acceptance proof)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length targets, preamble/retrospective checklists, E1→E2→E3 fade, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Scored residual quality for a **true newbie** (what / why / success / what sticks), not mere field presence
- Word-count measurement only on thin fields (no bulk generation of prose)
- No source edits in this round; hand-crafted unit-by-unit judgment

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| You Do has `retrospective` | **Met** |
| E1→E2→E3 fade preserved | **Met** (guided / independent / transfer per subtopic; not number-clones) |
| Tasks, starters, solutions, tests largely intact | **Met** (no pedagogy-driven code rewrites observed) |
| Instructions split from essay preambles | **Met** with minor nits |

**Verdict:** Round-1 closed the systemic P0 “zero preamble/title/retrospective.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: thin closes, a few hint/instruction integrity nits, feedback↔retrospective echo, and polish on drill E1s.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Thin We Do retrospectives** | T4-B-E1 ~18 w; T1-B-E1 ~25 w; T2-A-E1 ~32 w (target 40–80) | Principle lands; misconception or self-check often missing | **P1** (T4-B-E1); **P2** (others) |
| **Thin feedback** | T1-A-E3 ~15 w; T3-A-E1 ~17 w; T1-B-E2 ~18 w (target 25–60) | Corrective loop restates rule without starter misconception | **P2** (cluster) |
| **Feedback ≈ retrospective** | T1-B-E2, T3-A-E1, T4-B-E1, T2-A-E2 pairs reuse same sentence | Weak deliberate-practice loop; retro loses metacognitive job | **P1** (fix worst pairs only) |
| **Hint ≠ exercise contract** | T4-B-E2 `hint`: “Backoff creciente”; solution/tests have **no** sleep/backoff | Newbie may implement sleep/backoff that tests never check | **P1** |
| **Instruction spoiler / soft target** | T1-A-E2 “loop de la solución”; T2-A-E1 step 4 teaches “most recent call last” mid-task | Mild transfer/guide pollution | **P2** |
| **I Do `why` under target** | T4-B-DEMO ~33 w; T2-B-DEMO ~45 w OK; most others 40–60 | One demo under-explains retry vs quarantine | **P2** |
| **You Do retrospective long** | ~87 w (target 40–80) | Content strong; slight bloat | **P2** |
| **Drill-heavy E1 maps** | Exception types, levels, taxonomy, retry table, recover/fail-fast | Operational preambles fixed R1 “trivia” risk; retro must keep carrying *why* | Residual risk only |
| **Historical id `visualization`** | Section id vs title mismatch | Tooling/learner confusion outside exercise prose | Out of Fixer scope unless orchestrator asks |

**Section severity theme (Round 2):** shell is **solid**; residuals are **quality and a few integrity nits**, not empty scaffolds. No P0. One clear P1 integrity fix (T4-B-E2 hint) + thin T4-B-E1 retro + feedback/retro collapse on worst pairs.

---

## Scoring key

| Score | Meaning |
|-------|---------|
| **A** | Newbie can answer what / why / success / what sticks; no residual fix needed |
| **B** | Usable; minor residual (thin retro/feedback, length, polish) |
| **C** | Partial; residual should be fixed in R2 (clarity, thin metacognition, mild integrity) |
| **D** | Fails true-newbie test on a critical checklist item |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

## Unit ledger

### I Do

### S09-T1-A-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** · description **Strong** · why **Strong** (~46 w) · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (C001 dict + C002 cause line named) · constraints pass · retrospective pass
- **Diagnosis:** R1 prose landed. Newbie sees two paths, Decimal chain, and `__cause__`. Classic error (raise without `from e`) is explicit. No residual required.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T1-B-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** all pass; prediction of output order is a good worked-example habit
- **Diagnosis:** Clear `with` + else-of-try + finally + fail-fast encoding. Distinguishes else-of-try from else-of-if in `why`. Ready for newbie.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T2-A-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** all pass (constraints: no full row dump)
- **Diagnosis:** Frame-filter story is clear; predicts useful frame (`normalize_email`). Bridges to “no imprimir row” well.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T2-B-DEMO (iDo) — **A− / B+**
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Minimal repro path (total_fallos → minimal_repro → root_symptom) is excellent. Silent 3+ token bug called out in `why` without overloading the demo. Optional only: one self-check in retro (“¿por qué no el CSV entero?”) already present.
- **Severity residual:** optional P2
- **Proposed residual:** none required
- **Code/output changes:** none

### S09-T3-A-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** all pass; duration_ms=7 as observation success is explicit
- **Diagnosis:** Injected clock + structured fields + propagate=False well framed. Newbie can answer “why 7 ms” from the ticks.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T3-B-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** all pass (PII constraints strongest in section)
- **Diagnosis:** Star I Do of the section. mask → exception → assert of absent full email. Retrospective treats failed PII assert as compliance incident — correct tone for CP-N1-C.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T4-A-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** all pass; reconcile + abort both named as watch targets
- **Diagnosis:** Policy demo bridges S08 manifest cleanly. Taxonomy (data quarantine vs config abort) is the sticky principle.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T4-B-DEMO (iDo) — **B**
- **Scores:** preamble **Strong** · why **Needs residual** (~33 w, under 40–90) · retrospective **Strong**
- **Checklist:** context/goal/success/constraints pass · why partial (short)
- **Diagnosis:** Preamble prediction prompt is excellent (“why second case never hits 3 attempts”). `why` states the rule but is thin on *idempotency / max_attempts as incident control* that theory T4-B stresses.
- **Severity residual:** P2
- **Proposed residual `why` (full text):**  
  Transitorio de red ≠ dato ilegal. Solo `TimeoutError` consume el bucle hasta el tope; un `ValueError` de monto sale al primer intento hacia cuarentena. Reintentar un dato inválido gasta cuota del proveedor y ensucia ERROR sin arreglar la fila. El tope de intentos es parte de la resiliencia: sin él, un bucle eterno se disfraza de “robustez”.
- **Code/output changes:** none

---

### We Do · T1-A

### S09-T1-A-E1 (weDo · guided) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Model E1 map drill with operational on-call context. Starter “todo ValueError” is the right defect. Feedback distinguishes dominio vs stdlib. No residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none  
- **Validation notes:** Starter still prints `ok True`; solution drops it — contract is the five `fallo -> Tipo` lines in `tests`.

### S09-T1-A-E2 (weDo · independent) — **B**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Strong Decimal / no-float story. Residual: instruction step 4 says “Demuestra con el loop de la **solución**” — soft spoiler / odd phrasing for independent tier; should point at the demo loop in the starter or list the four values.
- **Severity residual:** P2
- **Proposed residual instruction step 4:**  
  `4. Si es negativo: otro ValueError explícito. Demuestra con el loop del starter ampliado a ["10.5", "3,25", "abc", "-1"].`
- **Code/output changes:** none

### S09-T1-A-E3 (weDo · transfer) — **B**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~15 w) · retrospective **Strong**
- **Checklist:** all pass; feedback thin
- **Diagnosis:** Real transfer (`from e` + OSError). Starter defect correct. Feedback names the principle but not the starter’s double defect (FileNotFoundError-only + missing `from e`).
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  El starter solo captura `FileNotFoundError` y relanza sin `from e`: `__cause__` queda `None` y un `PermissionError` (también `OSError`) se escapa sin capa de dominio. Amplía a `OSError` y usa `from e` para que el post mórtem vea I/O + `DataLoadError`.
- **Code/output changes:** none

---

### We Do · T1-B

### S09-T1-B-E1 (weDo · guided) — **B**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Needs residual** (~25 w)
- **Checklist:** all pass; retro short on misconception wording
- **Diagnosis:** Starter swallow → `"err"` is excellent. Feedback explains finally-before-propagate well. Retro needs one explicit classic error sentence to hit length/role.
- **Severity residual:** P2
- **Proposed residual retrospective (full text):**  
  Cleanup ≠ recuperación: `finally` marca el flag; la política de reintentar o abortar es **otro** borde. El error clásico es capturar dentro de `work` y devolver `"err"` — el llamador cree que hubo éxito controlado. Siguiente (E2): clasificar recover vs fail-fast.
- **Code/output changes:** none

### S09-T1-B-E2 (weDo · independent) — **B / C+**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Adequate** (echoes feedback)
- **Checklist:** all pass on structure; feedback/retro collapse
- **Diagnosis:** Policy classification is core skill. Preamble differentiates well from T4-A taxonomy. **Residual:** feedback and retrospective both restate the same rule; feedback should name the starter defect (“todo recover”).
- **Severity residual:** P1 (feedback/retro collapse — worst pair)
- **Proposed residual feedback (full text):**  
  El starter marca **todo** como `recover` para “no tumbar el job”: eso envenena el manifest si el delimiter o el token faltan. Config/secretos → fail-fast; fila/parse/timeout de un record → recover (cuarentena o retry), **no** silenciar.
- **Proposed residual retrospective (keep distinct):**  
  Config rota multiplica basura; fila sucia se cuarentena. Pregunta de auto-chequeo: si todo fuera recover, ¿qué vería el on-call a las 02:10? Luego (E3) refactorizarás un handler que traga `Exception` genérico.
- **Code/output changes:** none

### S09-T1-B-E3 (weDo · transfer) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Bad vs good handler contrast is transfer gold. Starter leaves good_handler identical to bad — correct. No residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T2-A

### S09-T2-A-E1 (weDo · guided) — **B**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · feedback **Strong** · retrospective **Adequate** (~32 w)
- **Checklist:** all pass
- **Diagnosis:** Text-only stack parse is good guided skill. Residual: instruction step 4 embeds theory (“most recent call last”) that belongs in feedback/hint; retro light on misconception.
- **Severity residual:** P2
- **Proposed residual instruction (steps only):**  
  `1. El starter solo imprime la primera línea del traceback.\n2. Busca líneas con ", in " y toma el nombre de función.\n3. Imprime frame1–frame3 en orden (main → run → normalize).\n4. No re-ejecutes el código original; parsea el string tb.`
- **Proposed residual retrospective (full text):**  
  El orden de frames es un mapa del call graph: el frame útil del bug de email suele ser el más profundo de **tu** código, no `cli`. El error clásico es leer solo la primera línea o culpar al entrypoint. Siguiente (E2): simular breakpoint con locals seguros.
- **Code/output changes:** none

### S09-T2-A-E2 (weDo · independent) — **A− / B+**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Safe breakpoint without PII — excellent bridge to T3-B. Feedback and retro both open on “locals ≠ dump” but each adds a distinct next beat (KeyError contract vs ERROR logs). Acceptable overlap.
- **Severity residual:** optional P2 (no change required)
- **Proposed residual:** none required
- **Code/output changes:** none

### S09-T2-A-E3 (weDo · transfer) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** One-line root cause from text is clean transfer. Feedback repairs “no culpes a cli”. Bridge to T2-B solid.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T2-B

### S09-T2-B-E1 (weDo · guided) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass (synthetic DNI constraint explicit)
- **Diagnosis:** Starter `minimal = fixture[0]` is a clean guided defect. Success lines exact. Ready.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T2-B-E2 (weDo · independent) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (thin but E2-appropriate) · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass; S07 “solo dígitos” carried in preamble
- **Diagnosis:** Hypothesis thinking exercise (not just API). Distinguishes “lose +” from “lose 51”. Instruction step 4 relies on preamble success — correct fade for independent.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T2-B-E3 (weDo · transfer) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** RED → pass → GREEN documents root cause. Cultural/technical transfer (partículas de/la) is distinctive. Bridge to T3-A good.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T3-A

### S09-T3-A-E1 (weDo · guided) — **B**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~17 w) · retrospective **Strong**
- **Checklist:** all pass; feedback thin + mild echo with retro
- **Diagnosis:** Level mapping with dashboard-noise context is good. Feedback should name starter “todo INFO” misconception more explicitly and leave “ERROR en cada cuarentena” to the retro (already there).
- **Severity residual:** P2
- **Proposed residual feedback (full text):**  
  El starter pone **todo** en INFO: el dashboard no prioriza. Fila opcional rara = WARNING (el job sigue); parse/config ilegible = ERROR; detalle de loop = DEBUG, no INFO de progreso.
- **Code/output changes:** none

### S09-T3-A-E2 (weDo · independent) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Core logger skill. Starter print-as-log is clear. Instruction names handler pieces without over-spoiling. Bridge to S10 CLI solid.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T3-A-E3 (weDo · transfer) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** RESULT vs LOGS is the right transfer to S10. Starter leaves good = print. Preserve current LOGS trailing `|` oráculo (do not “clean” without re-run).
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none (keep output format)

---

### We Do · T3-B

### S09-T3-B-E1 (weDo · guided) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** mask_email/phone with synthetic pe fixtures. Edge cases (sin @, corto) in limits/edgeCases. Ready.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T3-B-E2 (weDo · independent) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass (no global / no contextvars)
- **Diagnosis:** Three-layer correlation_id is clear independent practice. Feedback names “no variable global”. Good.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T3-B-E3 (weDo · transfer) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Audit template without re-leaking PII is the subtle star transfer of T3-B. Feedback clava starter misconception. No residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T4-A

### S09-T4-A-E1 (weDo · guided) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Taxonomy data|config|provider differentiated from T1-B-E2 *policy* by preamble (“errores de política, no de sintaxis”). ROOT_PATH and 503 called out. Good.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T4-A-E2 (weDo · independent) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Silent drop → quarantined + reconcile is the S08 echo. Starter defect pedagogical. Bridge to You Do invariant explicit in retro.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S09-T4-A-E3 (weDo · transfer) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Multi-rule `should_abort` with “una fila no basta” is excellent operational transfer. Feedback names starter aggressiveness. No residual.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T4-B

### S09-T4-B-E1 (weDo · guided) — **C**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~18 w)
- **Checklist:** context/goal/success/constraints pass · retrospective **partial** (principle + transfer only; misconception thin)
- **Diagnosis:** Table drill works with good preamble. Retrospective is the thinnest We Do close in the section — no classic error, no self-check, under length target. Feedback already carries “datos y permisos no se arreglan”; retro should not just restate “retry es para el canal”.
- **Severity residual:** P1
- **Proposed residual retrospective (full text):**  
  Retry es para el **canal** (timeout, connection), no para el **dato** ni para permisos. El error clásico del starter es marcar yes en ValueError/KeyError “por si acaso” y multiplicar ERROR sin curar la fila. Auto-chequeo: ¿PermissionError se arregla reintentando? Siguiente (E2): implementar el loop con tope de intentos.
- **Code/output changes:** none

### S09-T4-B-E2 (weDo · independent) — **C**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong** · **hint integrity Needs residual**
- **Checklist:** preamble/task pass · **hint fails contract alignment**
- **Diagnosis:** Core retry loop is clear; starter single-attempt is right. **Integrity residual:** primary `hint` says “Backoff creciente; tope en max_attempts” but neither instruction, tests, nor solution implement sleep/backoff. A true newbie may add `time.sleep` or fail searching for backoff in the contract. Theory owns backoff; this exercise owns tope + TimeoutError only.
- **Severity residual:** P1
- **Proposed residual `hint` (full text):**  
  `Bucle hasta max_attempts capturando solo TimeoutError; si agotas, relanza el último.`
- **Proposed residual `hints[0]` if it still implies backoff:** keep “Devuelve el resultado o relanza el último TimeoutError.” (already fine)
- **Code/output changes:** none (do not require backoff in solution unless intentionally expanding the exercise)
- **Validation notes:** Output `done calls 3` is the contract; preserve.

### S09-T4-B-E3 (weDo · transfer) — **A**
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Checklist:** all pass
- **Diagnosis:** Idempotency key with stable JSON hash closes resiliencia and feeds You Do. Starter id-only defect is correct. Preserve hash `bc63c11b44d5` oráculo.
- **Severity residual:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### You Do

### youDo — Bitácora auditable del pipeline (inicio CP-N1-C) — **A− / B+**
- **Scores:** context **Strong** · objectives **Strong** · requirements **Strong** · rubric **Strong** · starter **Strong** · retrospective **Strong** (slightly long ~87 w)
- **Checklist:** context pass · goal pass · success pass (assert reconcile + zero full PII + fail-fast) · constraints pass · retrospective pass
- **Diagnosis:** Best frame in the section. Context now names run success (R1 gap closed). Retrospective defense triad is gold; only residual is mild length bloat — optional tighten, do not cut the three self-check questions.
- **Severity residual:** P2 optional
- **Proposed residual retrospective (optional trim, full text if Fixer wants ≤80 w):**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con `in == ok + quarantined` y con un test de fail-fast de config? (2) ¿qué cambia con datos reales vs. sintéticos (PII, secretos en logs)? (3) Una frase de impacto medible en el README («antes: email completo en ERROR; después: máscara + correlation_id») defendible en 30 s. Si no separas timeout de provider de monto NaN, vuelve a T4-A/T4-B.
- **Code/output changes:** none  
- **Validation notes:** Starter intentionally incomplete; do not “solve” TODOs in pedagogy pass.

---

## Priority order (Round 2 Fixer)

### P1 (fix first — integrity / metacognition)
1. **S09-T4-B-E2** — rewrite `hint` so it does **not** demand backoff; align with max_attempts + TimeoutError only.
2. **S09-T4-B-E1** — expand `retrospective` (principle + classic starter error + self-check + transfer).
3. **S09-T1-B-E2** — split feedback vs retrospective (feedback = starter “todo recover”; retro = self-check + transfer).

### P2 (polish after P1)
4. Expand thin feedback: **T1-A-E3**, **T3-A-E1** (full texts above).
5. Expand thin I Do why: **T4-B-DEMO**.
6. Micro instruction polish: **T1-A-E2** step 4; **T2-A-E1** steps (move theory out of step 4); **T1-B-E1** / **T2-A-E1** retrospectives if still short.
7. Optional youDo retrospective trim to ≤80 words (content already strong).
8. No code/output changes required unless Fixer discovers execute-and-diff drift (not observed statically).

### Leave unchanged (A units)
All I Do except optional T4-B-DEMO why; We Do units scored **A** above (majority of T2-B, T3-B, T4-A, several E3 transfers, T1-A-E1, T1-B-E3, etc.).

---

## Residual risks

- **Historical id `visualization`:** pedagogy prose correctly says excepciones/logs; renaming id is orchestrator territory, not this Fixer pass.
- **Drill E1 maps** remain classification tables by design; operational preambles + strong retros keep them from trivia — do not convert them into mini-projects.
- **T1-B-E2 vs T4-A-E1:** policy vs taxonomy axes are now differentiated; Fixer must not merge or clone prose between them.
- **T2-B-E2 / S07 dependency:** preamble already carries “solo dígitos”; keep that if editing.
- **Exact outputs:** preserve solution `output` strings (especially idempotency hash, LOGS trailing format, mask fixtures).
- **Anti-aberration:** Fixer must hand-edit residual units only; no bulk template fill across the 24 We Do.
- **Backoff scope:** if product later wants backoff in E2, that is a **code + tests** expansion — not a one-line hint lie.

---

## Counts summary for Round-2 Fixer

| Unit type | N | Missing shell fields | Residual text recommended | Code/output change |
|-----------|---|----------------------|---------------------------|--------------------|
| iDo | 8 | 0 | 1 (T4-B why) | none |
| weDo | 24 | 0 | ~8 units with full residual text (P1: 3; P2: ~5) | none |
| youDo | 1 | 0 | optional trim | none |

**Net quality after R1:** shell complete and mostly **A/B**. Round-2 is a **tightening** pass, not a rebuild.

Section 9 exercise pedagogy review complete. Ready for the Fixer prompt.
