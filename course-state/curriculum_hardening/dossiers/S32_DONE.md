# S32 DONE — Feature engineering y pipelines sin leakage

**File:** `src/lib/course/sections/s32-microservices.ts`  
**Research:** `S32_RESEARCH.md`

## Before (stub)

| Metric | Value |
|--------|------:|
| kb | 41.3 |
| avg_para | 84.6 |
| avg_instr | 40.3 |
| todo_starters | 24 |
| residual score | 4 (stub) |

## After (gold target)

| Metric | Value |
|--------|------:|
| kb | 88.1 |
| n_heads | 9 |
| n_para | 27 |
| avg_para | 338.3 |
| min_para | 200 |
| n_instr | 24 |
| avg_instr | 390.7 |
| min_instr | 356 |
| weDo starters | 24 enriched |
| solutions | 24 runtime-verified |
| selfCheck | 4 preserved |
| index / id | 32 / `microservices` (legacy id) |

## Validation

- Structure ok; runtime 64/64
- No Docker/K8s content; pure feature engineering for CP-N3-B
- Half-open windows, fit/transform, group/time split, leakage scan
- Fixtures: CASO-LIM-032, run_id=cpn3b-feat, fs-vN

## Breach codes

REJECT_UNKNOWN_FEATURE, REJECT_SILENT_FILL, REJECT_LABEL_AS_FEATURE, REJECT_FUTURE_TS, REJECT_TRANSFORM_BEFORE_FIT, REJECT_UNVERSIONED, REJECT_ENTITY_OVERLAP, REJECT_LEAKAGE
