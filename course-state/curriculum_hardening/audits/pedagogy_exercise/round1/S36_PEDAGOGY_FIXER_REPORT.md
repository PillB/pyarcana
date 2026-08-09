# S36 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Clustering, anomalías y validación temporal
- **id:** `ai-apis-advanced`
- **source:** `src/lib/course/sections/s36-ai-apis-advanced.ts`
- **review input:** `round1/S36_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s36-ai-apis-advanced.ts` (prose fields + instruction/feedback/why polish).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective only; context already framed)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (numbered steps; no dense essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S36-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: scale/assign–update/density sin veredicto → k multi-seed (acuerdo ≠ ARI) → PCA toy lupa → far en PC encola → σ + path IF → contamination≠fraude → backtest fit-past → P@k + HITL.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with cola HITL / gate ético / portfolio anchor

Fade preserved per subtema: T1-A media → z-score → assign–update+density; T1-B argmax → sanction_from_metric (prosa diferenciada) → stable==; T2-A pc → batch → weight_share; T2-B nombre → ready → far/review_queue; T3-A σ → path → human_review (E3 como política de ruta); T3-B expected_flags → overflow → novelty; T4-A fit-past → mes test → spike; T4-B P@k → HITL scarce → choose_metric.

**Overlap handling (review residual risks):**
- **T1-B-E1 vs E2:** same min→max bug; preambles differ (elegir k multi-seed vs. no sancionar por métrica + bandera ética).
- **T3-A-E1 vs E3:** both touch z=0; E3 preamble sells **ruta human_review / auto_sanction**, not re-drill of z alone.
- **T1-A-E2:** instruction now requires returning `(z, safe_sd)` and printing the function’s `safe_sd` (aligns learner contract with solution without changing starter/output).

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariante del gate, sintético vs real, frase de impacto medible sin overclaim de fraude).
- Light touch on `context` (defender tres invariantes en 30 s) and `portfolioNote` (P@k + HITL obligatorio; no «detectamos fraude»).
- Left `objectives` / `requirements` / `rubric` / starter pipeline unchanged (starter remains nearly complete; retrospective pushes defense).

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT` markers | **Unchanged** (54 markers retained) |
| Ethical prints (`verdict`/`misconduct`/`auto_guilt` False) | **Unchanged** |
| You Do starter almost-pipeline | **Unchanged** (intentional; retrospective mitigates “run and done”) |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 expanded why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual essay instructions without leading `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: demo labels/core_density, k/score/stable, PCA 2.0, far/review_queue, flags/path, expected_flags 5, mean_flag_rate 0.103, P@k 0.5; weDo 1.5 centroid, c1/c2, weight_share 0.8, human_review, novelty, precision_at_k, labels scarce
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. **T1-B-E1/E2** still share min→max code defect; prose is differentiated — Round 2 could strengthen code fade only with justified execute-and-diff if desired.
3. **T3-A-E1/E3** both touch z; keep E3 framed as routing policy if prose is rewritten.
4. You Do starter is generous; retrospective + rubric gate mitigate “run and done” — do not empty starter in R2 without design decision.
5. Domain vocabulary (contamination, path length, P@k) stays appropriate for “Competente a experto” — keep cola-de-revisión anchors if preambles expand.
6. Fade E1→E2→E3 of prose must stay differentiated if Round 2 rewrites; do not collapse to a single template.
7. Canonical outputs and ethical False flags remain frozen without execute-and-diff.

## Files touched
1. `src/lib/course/sections/s36-ai-apis-advanced.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S36.md`
