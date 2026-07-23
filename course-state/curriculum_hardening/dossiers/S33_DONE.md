# S33 DONE — ML supervisado y baselines responsables

**File:** `src/lib/course/sections/s33-advanced-models.ts`  
**Research:** `S33_RESEARCH.md`

## Before (stub)

| Metric | Value |
|--------|------:|
| kb | 38.5 |
| avg_para | 80.8 |
| avg_instr | 32.7 |
| todo_starters | 24 |
| residual score | 3 (stub) |

## After (gold target)

| Metric | Value |
|--------|------:|
| kb | 86.6 |
| n_heads | 9 |
| n_para | 27 |
| avg_para | 350.0 |
| min_para | 301 |
| n_instr | 24 |
| avg_instr | 387.8 |
| min_instr | 362 |
| weDo starters | 24 enriched |
| solutions | 24 runtime-verified |
| selfCheck | 4 preserved |
| index / id | 33 / `advanced-models` |

## Validation

- Structure ok; runtime 64/64
- Target framing: needs_review_7d (rejects fraud name)
- Baseline-first: dummy + cost before model; group CV by entity
- Fixtures: CASO-LIM-033

## Breach codes

REJECT_FRAUD_TARGET, REJECT_NO_BASELINE, REJECT_UNREGULARIZED, REJECT_UNSCALED_COEF, REJECT_DEPTH_UNLIMITED, REJECT_OVERFIT, REJECT_UNLOGGED_RUN, REJECT_RANDOM_LEAK
