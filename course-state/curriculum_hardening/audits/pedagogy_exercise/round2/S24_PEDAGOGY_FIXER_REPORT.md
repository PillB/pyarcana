# S24 Pedagogy Fixer Report (Round 2)

## Section
- **title:** OCR y Document AI
- **id:** `rpa-advanced`
- **index:** 24
- **source:** `src/lib/course/sections/s24-rpa-advanced.ts`
- **round2 review:** `round2/S24_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8, weDo 24, youDo 1 (33 units)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 residual ledger.
- Applied **hand-written** residual prose only in Section 24 source.
- **No** generators, bulk templates, or cross-section paste.
- Measurement-only word counts after edits; `tsc --noEmit` clean.
- Canonical solution **outputs** and starter defects left intact.

## Round-2 residuals addressed

### P1 — done
| Residual | Action |
|----------|--------|
| **S24-T4-A-E2** retrospective (~17w, thin) | Rewrote to principle + hardcode misconception + self-check (float en standup) + bridge E3 (`acc_ruc` *y* `coverage_auto`). ~52w. |

### P2 — done
| Residual | Action |
|----------|--------|
| Feedback ↔ retrospective echo | Desacoplados: **T1-B-E1**, **T1-B-E2**, **T2-B-E1**, **T2-B-E2**, **T3-B-E1**, **T3-B-E2**, **T4-B-E1**, **T4-B-E2** — feedback keeps immediate corrective; retro = principle + misconception + self-check/transfer |
| iDo `why` / `retrospective` cortos | Expanded **T1-B-DEMO**, **T2-A-DEMO** (why+retro), **T2-B-DEMO** (why+retro), **T3-A-DEMO**, **T3-B-DEMO** (why+retro), **T4-A-DEMO** (why+retro), **T4-B-DEMO** (why+retro) |
| **T1-A-E1** instruction paso 4 conceptual | Removed “Recuerda: upscaling…”; limits/hints/feedback already cover no tipografía inventada |

### Left unchanged (by design)
- **You Do** — already A; no residual
- Units scored **A** with “none required” (T1-A-DEMO/E2/E3, T1-B-E3, T2-A-E1/E2/E3, T2-B-E3, T3-A-E1/E2/E3, T3-B-E3, T4-A-E1/E3, T4-B-E3)
- Optional E3 hint softening (T1-B-E3, T2-A-E3, T3-B-E3) — not required for learner path
- Optional T3-A-E3 letter→None fixture in print — policy already in solution + You Do
- All `solutionCode.output` values
- Starter DEFECT codes, theory code blocks, filename/id `rpa-advanced`

## Unit change ledger

### I Do — why / retrospective expanded (7 demos)
| Unit | Change |
|------|--------|
| T1-B-DEMO | Retro + self-check score 0.4 → manual_orient |
| T2-A-DEMO | Why: dashboard mentiroso + HITL token débil; retro + self-check 0.55 vs 0.99 |
| T2-B-DEMO | Why: higiene strings; retro puente schema/golden/bbox valor |
| T3-A-DEMO | Retro: letras embebidas = siguiente fail-closed; bridge fecha/monto PE |
| T3-B-DEMO | Why: parsing vs captura; retro 140 vs 150 → needs_review no “culpable” |
| T4-A-DEMO | Why: golden 0.5 a propósito; retro cobertura vs acc_ruc |
| T4-B-DEMO | Why: capa 2 note; retro spoofable mime + bridge human_rescan |
| T1-A-DEMO | No change (already strong) |

### We Do — instruction / retrospectives
| Unit | Change |
|------|--------|
| T1-A-E1 | Instruction: 3 task steps only (drop conceptual step 4) |
| T1-B-E1 | **Desacoplar** retro: key vs score; error clásico print 0.8 |
| T1-B-E2 | **Desacoplar** retro: conteo vs longitud + self-check flags=0 |
| T2-B-E1 | **Desacoplar** retro: higiene parser + self-check float/golden |
| T2-B-E2 | **Desacoplar** retro: parsing error vs factura + hábito n_data_rows |
| T3-B-E1 | **Desacoplar** retro: never fraud + self-check eps 0.005 |
| T3-B-E2 | **Desacoplar** retro: raise vs lista vacía; bridge review_not_fraud |
| T4-A-E2 | **P1** retro rewrite (hardcode 1.0 / standup / par métricas) |
| T4-B-E1 | **Desacoplar** retro: fail-closed allowlist + self-check extensión |
| T4-B-E2 | **Desacoplar** retro: no “OCR y ver”; bridge human_rescan |

### Measurement spot-check (edited retros, measurement only)
| Unit | ~words retro |
|------|--------------|
| T4-A-E2 | 52 |
| T1-B-E1 | 49 |
| T1-B-E2 | 43 |
| T2-B-E1 | 54 |
| T2-B-E2 | 45 |
| T3-B-E1 | ~40+ |
| T3-B-E2 | ~40+ |
| T4-B-E1 | 43 |
| T4-B-E2 | 41 |

## Acceptance checklist (Round 2 Fixer)

- [x] No missing-field regressions (title / preamble / instruction / retrospective present on all exercise units)
- [x] P1 T4-A-E2 retro ≥ ~40w with principle + misconception + transfer/self-check
- [x] Echo pairs rewritten so feedback = immediate corrective; retro = metacognitive close
- [x] T1-A-E1 instruction is task-only
- [x] Outputs and starters intact; Spanish PE; synthetic fixtures; no real PII
- [x] No generators; hand-written residual prose only
- [x] Section source typechecks (`tsc --noEmit` clean)

## Residual risks (post-fix)
- Optional E3 hints still near-complete on some transfer units (acceptable fade scaffolding; not spoiling blockers).
- T3-A-E3 letter→None policy remains code-level + You Do; print fixture still does not exercise the letter path (intentional scope).
- iDo preambles already narrative and clear; not expanded further (non-blocking).
- Theory/code outputs unchanged; no execute-and-diff needed.

## Files touched
1. `src/lib/course/sections/s24-rpa-advanced.ts` — residual pedagogy prose (why / retrospective / one instruction)
2. `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S24_PEDAGOGY_FIXER_REPORT.md` — this report

---

Section 24 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
