# S38 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Concurrencia, observabilidad y workflows resilientes
- **id:** `performance-extreme`
- **index:** 38
- **source:** `src/lib/course/sections/s38-performance-extreme.ts`
- **review:** `round2/S38_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand edits only; no generators, bulk templates, or scripted prose manufacture.

## Scope applied
Round-2 residual **P2 polish selectivo** (no P0/P1). Did **not** regenerate preambles, rewrite A-rated units, or change solution outputs/code.

| Track | Units touched |
|-------|----------------|
| iDo retrospective expand + self-check | T1-B, T2-B, T3-A, T3-B, T4-A, T4-B demos (6) |
| weDo eco feedback↔retro | T1-A-E3, T1-B-E1, T1-B-E2, T2-A-E1, T2-A-E2, T2-B-E2, T2-B-E3, T3-A-E2, T3-A-E3, T3-B-E1, T3-B-E2, T3-B-E3, T4-B-E1, T4-B-E2 (14) |
| weDo feedback floor / impacto | T1-A-E3, T1-B-E2, T1-B-E3, T2-A-E2, T2-B-E2, T3-A-E3, T3-B-E2, T3-B-E3, T4-B-E1, T4-B-E2 |
| Title spoiler | **S38-T4-B-E1** → `Backoff exponencial, no lineal` (quitó `attempt 3 = 0.8`) |

**Left untouched (A / none required):** T1-A-DEMO, T1-A-E1, T1-A-E2, T2-A-DEMO, T2-A-E3, T2-B-E1, T3-A-E1, T4-A-E1/E2/E3, T4-B-E3, youDo; theory/code/outputs.

## Principle of edits
- **Feedback** keeps the *why of the bug* + operational impact (c-synth-1 / CP-N3-C / gate).
- **Retrospective** opens on a **different** sentence: principle + misconception + self-check (`Pregunta:`) and/or transfer bridge.
- Prefer fewer stronger sentences; Spanish PE; fixtures CASO-LIM-038 / c-synth-1; no real PII.

## Unit changelog (prose only)

### iDo demos
| Unit | Change |
|------|--------|
| S38-T1-B-DEMO | Retro expanded: privacidad+IPC, self-check email al pool, puente We Do |
| S38-T2-B-DEMO | Retro expanded: fail observable vs hang, self-check finally, puente política/close |
| S38-T3-A-DEMO | Retro expanded: corr vs print, self-check path sin corr |
| S38-T3-B-DEMO | Retro expanded: ship vs freeze, self-check p95>budget |
| S38-T4-A-DEMO | Retro expanded: rehacer done, self-check resume_from features→score |
| S38-T4-B-DEMO | Retro expanded: poison≠retry_forever, self-check serie no lineal |

### weDo priority eco + length
| Unit | Change |
|------|--------|
| S38-T1-A-E3 | Feedback +bound 100/95; retro reescrito (medida vs moda + self-check bound) |
| S38-T1-B-E1 | Retro reescrito (blob parseable + self-check str vs JSON) |
| S38-T1-B-E2 | Feedback +processes/payload; retro distinta (runbook limited + self-check I/O) |
| S38-T1-B-E3 | Feedback +bytes 31 / process pool de features |
| S38-T2-A-E1 | Retro reescrito (rate=2 estático + self-check refill prod) |
| S38-T2-A-E2 | Feedback +c-synth-1; retro reescrito (deuda maxsize None + drop/block/DLQ) |
| S38-T2-B-E2 | Feedback +batch; retro reescrito (finally vs with + self-check) |
| S38-T2-B-E3 | Retro reescrito (bool local vs incidente + self-check timeout_s=0) |
| S38-T3-A-E2 | Retro reescrito (tres preguntas o11y + self-check metrics sin corr) |
| S38-T3-A-E3 | Feedback +logs del batch; retro reescrito (pii_raw gate + case_id vs email) |
| S38-T3-B-E1 | Retro reescrito (máscara 2+****+2 + self-check longitud) |
| S38-T3-B-E2 | Feedback +c-synth-1; retro reescrito (multi-SLI + self-check error_rate 0.05) |
| S38-T3-B-E3 | Feedback +starter uptime_only; retro reescrito (freeze + runbook + puente T4) |
| S38-T4-B-E1 | **Title** sin spoiler 0.8; feedback +c-synth-1; retro (base×2^n + self-check 0.8 vs 0.3) |
| S38-T4-B-E2 | Feedback +uncontrolled starter; retro (aislar poison + self-check replay ciego) |

## Code / outputs
- **None changed.** Canonical three-line solution outputs preserved.
- Starter `# DEFECTO` paths unchanged.
- T2-B-E3 starter `(5000, 0)` vs solution `(5000, 1.0)` left as-is (both hit incident after fix).

## Validation
- [x] Manual re-read of every edited field against PEDAGOGY_EXERCISE_SPEC (feedback 25–60, retro 40–80 targets; eco openings broken on priority list)
- [x] T4-B-E1 title no longer embeds `0.8`
- [x] Priority units: opening of feedback ≠ opening of retrospective
- [x] `npx tsc --noEmit -p tsconfig.json` — exit 0
- [x] No generators / bulk prose mechanisms
- [x] Español PE; sin PII real; CASO-LIM-038 / c-synth-1

## Acceptance checklist (spec §11)
- [x] Non-trivial units keep `preamble` + `retrospective` (unchanged coverage)
- [x] We Do short `title` (T4-B-E1 fixed)
- [x] `instruction` task-only (untouched)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks

## Residual (accepted, non-blocking)
- Some **A**-rated units still have retros ~20–38 w (e.g. T1-A-E1, T4-A-E1/E2) — not expanded per “no inflar las que ya son A”.
- Playground still contracts-only (no real pools); token bucket E1 remains didactic static; documented in R2 review.
- Hints on E3 may still surface formula near solution — intentional minimal scaffold, not a spoiler title.

## Files
- Edited: `src/lib/course/sections/s38-performance-extreme.ts`
- This report: `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S38_PEDAGOGY_FIXER_REPORT.md`

Section 38 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
