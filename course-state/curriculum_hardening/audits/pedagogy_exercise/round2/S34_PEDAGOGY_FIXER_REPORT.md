# S34 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Métricas, desbalance, calibración y umbrales
- **id:** `cv-ai-integration`
- **index:** 34
- **source:** `src/lib/course/sections/s34-cv-ai-integration.ts`
- **basis:** `round2/S34_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8 · weDo 24 · youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 unit ledger.
- Edited **only** pedagogical prose fields (`retrospective`; no feedback rewrites needed beyond retro differentiation).
- Hand-wrote each change unit-by-unit; no generators, templates, bulk replace of prose blocks, or scripts to manufacture text.
- Preserved all starter/solution code and canonical `output` strings.
- Did not touch youDo (already **A**).

## What was fixed

### P0 / P1
- **None** — Round-2 confirmed coverage and outputs already closed.

### P2 — iDo demos: expand retro + self-check (7 units)
| Unit | Change |
|------|--------|
| S34-T1-B-DEMO | Self-check recall@3 with n_pos=2; bridge to denominador/overload |
| S34-T2-A-DEMO | Self-check: synthetic copies on fold test inflate which metric? |
| S34-T2-B-DEMO | Self-check: thr fijo when prevalence halves |
| S34-T3-A-DEMO | Self-check: Brier bajo + bins desalineados vs inverse |
| S34-T3-B-DEMO | Self-check: `train_in_sample` → which policy code? |
| S34-T4-A-DEMO | Self-check: capacity→1, thr up or down? warn no hardcode 0.6 |
| S34-T4-B-DEMO | Self-check: score 0.55 in band → abstain, not fraude |

**Unchanged (already A):** S34-T1-A-DEMO.

### P2 — weDo: break feedback↔retrospective echo + expand short retros
Rule applied: **feedback** = immediate bug/breach reason; **retrospective** = principle + misconception + self-check or transfer (no first-sentence clone of feedback).

| Unit | Residual addressed |
|------|-------------------|
| T1-A-E1 | Self-check F1=2/3 vs 0.75 |
| T1-A-E2 | Three-route principle; `region` missing ≠ FAIL PASS |
| T1-A-E3 | Fail-open fabrica matriz; transfer to T1-B capacity |
| T1-B-E1 | k vs n_pos roles; no re-teach formula in E2 |
| T1-B-E2 | Capacity as product predicate; load=8/cap=10 self-check |
| T1-B-E3 | No thr without capacity; transfer to T2-A fold |
| T2-A-E1 | Boolean flip = pipeline leak, not “forgot weights” |
| T2-A-E2 | n1 for audit; n0=n1 self-check |
| T2-A-E3 | Bridge to prevalencia T2-B |
| T2-B-E1 | Starter leaves panel happy at 97.5%; no re-calc all-neg in E2 |
| T2-B-E2 | Period base rate as slide anchor; all_neg alone ≠ PASS |
| T2-B-E3 | Callar base rate = compliance blind; thr when pop changes; bridge T3-A |
| T3-A-E1 | **Highest prior echo:** set-average habit vs cherry-pick (1,1); why 0.25 |
| T3-A-E2 | Contract needs Brier **and** \|mean_p−freq\| |
| T3-A-E3 | Score ≠ culpa; invent Brier=0 is metric fraud; bridge T3-B |
| T3-B-E1 | a·x+b moves scale; cal=1.0 not 1.3 self-check |
| T3-B-E2 | Set name is process evidence; length mismatch self-check |
| T3-B-E3 | T4 thr inherits distorted scores if cal in-sample |
| T4-A-E2 | thr-vN versioning; cost=None + thr-v1 route self-check |
| T4-A-E3 | No thr without cost matrix; capacity half → thr-v2?; bridge T4-B |
| T4-B-E2 | force_1 and skip in band both breach; missing low → MISSING |
| T4-B-E3 | CP-N3-B close; README with thr-v1 + banda; matching ≠ fraude |

**Left as-is (already strong feedback/retro pair or A):** T4-A-E1, T4-B-E1, youDo, T1-A-DEMO.

### Optional not done (non-blocking)
- Fixture adverso `decision=skip` en T4-B-E2 (report said optional; feedback already names skip).
- Softening E3 hints that near-state the predicate (acceptable transfer scaffold).

## Code / output changes
- **None.** All `output:` strings and DEFECT logic unchanged (thr 0.6 on 4-pt demos; You Do 5-pt thr ~0.9 still only in youDo context).

## Anti-aberration
- [x] No generators / loops / bulk prose templates
- [x] Hand-edited unit by unit from Round-2 proposed residuals
- [x] Spanish PE; score ≠ fraude preserved (T4-B, T3-A-E3, T4-B-E3)
- [x] Instruction fields untouched (still task-only)
- [x] Preambles untouched this round (already bullet-shaped)

## Acceptance (post-fix)
- [x] Every unit still has preamble + retrospective
- [x] We Do titles unchanged
- [x] Feedback ≠ retrospective on prior high-jaccard units (principle + self-check / transfer in retro)
- [x] Short iDo retros expanded toward 40–80 w with self-check
- [x] Exact outputs preserved
- [x] No real PII; CASO-LIM-034 / Red Andina intact

## Residual risks after fix
- Some retros may still share a *concept* with feedback (same skill) but no longer clone the lead sentence.
- Optional skip fixture and E3 hint softening remain open for a later polish pass if desired.

Section 34 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
