# S33 Pedagogy Fixer Report (Round 1)

## Section
- **title:** ML supervisado y baselines responsables
- **id:** `advanced-models`
- **source:** `src/lib/course/sections/s33-advanced-models.ts`
- **review input:** `round1/S33_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s33-advanced-models.ts` (prose fields + instruction/feedback/why polish).
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
| S33-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: framing unit/target/horizon + prevalencia → dual baseline dummy+regla/costo → sigmoid/thr/L2 declarada → ranking \|coef\| sin claim causal → stump+voto controlado → gap lab 0.2 + seed → tracking win/lose honesto → group CV con disyunción de entidades.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with cola/workbench anchor where it was telegraphic

Fade preserved per subtema: fix numérico (E1) → assess de tres fixtures (E2) → decide CONTINUE/REJECT/REQUEST (E3). Highlights:
- **T1-A:** prevalencia/fraud_name → assess framing → REQUEST_HORIZON
- **T1-B:** dual baseline max+cost → assess cost → REQUEST_COST
- **T2-A:** thr 0.6 + Σw² + penalty l2 → assess penalty → REQUEST_SIGMOID
- **T2-B:** reverse=True + causal False → assess scaled → REQUEST_SCALE_FLAG
- **T3-A:** stump thr + majority → reject depth free → REQUEST_STUMP
- **T3-B:** caso **controlado** gap 0.05 (explícito vs demo overfit) → REJECT_OVERFIT → REQUEST_SEED
- **T4-A:** beats False válido (ética del lab) → REJECT_UNLOGGED_RUN → dual win/lose + REQUEST_METRICS
- **T4-B:** n_groups/set + mean 3 dec + isdisjoint → reject random_split → REQUEST_GROUP_IDS

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariante del gate, sintético vs real, frase de impacto medible sin overclaim de fraude).
- Light touch on `context` (thr=0.9 defectuoso como decisión de producto) and `portfolioNote` (README thr + assert disyunción).
- Left `objectives` / `requirements` / `rubric` / starter smoke path unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` markers | **Unchanged** (53 markers retained) |
| Canonical PASS / CONTINUE / REJECT / REQUEST strings | **Unchanged** |
| You Do starter thr=0.9 defect | **Unchanged** (intentional learner choice) |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 expanded why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual essay instructions without leading `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: framing PASS, dual baseline PASS, logistics/coefs/stump/overfit/tracking/group-cv PASS and transfer routes, demo outputs (`dummy_acc 0.667`, `lose_run_ok True`, `n_groups 3`, `prevalence 0.25`)
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Domain vocabulary (`beats_dummy`, `l2_sq`, group CV) stays appropriate for “Competente a experto” — keep cola-de-revisión anchors if preambles expand.
3. Fade E1→E2→E3 of prose must stay differentiated if Round 2 rewrites; do not collapse to a single “Contexto: el workbench…” template.
4. **T3-B demo vs E1:** demo shows overfit True; E1 practices controlled gap — preamble now explicit; Round 2 should not blur that distinction.
5. You Do thr abierto: retrospective + rubric push honest beats_rule comparison; no automated thr “óptimo”.
6. Gold-tone code scaffolding was already strong; Round 2 should not “improve” Pass strings without execute-and-diff.

## Files touched
1. `src/lib/course/sections/s33-advanced-models.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S33.md`
