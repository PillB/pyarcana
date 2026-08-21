# System requirements

| ID | Requirement | Gate |
|---|---|---|
| SYSR-01 | No learner progress may be lost or reset | Legacy fixture replay against the built app |
| SYSR-02 | No historical `ExerciseAttempt` may be orphaned | Exercise-ID set unchanged (1248) |
| SYSR-03 | No section-ID churn | `CURRENT_REPO_BASELINE.json` diff |
| SYSR-04 | Active section count stays 52 | `test:v3-counts` |
| SYSR-05 | Static export keeps working on GitHub Pages | `npm run build:static` |
| SYSR-06 | Readability and contrast unaffected | Prose only; no styling touched |
| SYSR-07 | No secrets, credentials or real PII introduced | New examples are synthetic; existing "sin PII real" convention followed |
| SYSR-08 | Reproducibility — every claimed output regenerable | Snippets are deterministic (fixed literals or seeded RNG) |
| SYSR-09 | Observability — validation produces inspectable artifacts | `audit/content-campaign/evidence/` |
| SYSR-10 | Preservation sentinel passes: no unauthorised tracked-file deletion, no removed protected ID | `node scripts/preservation_sentinel.mjs` |
| SYSR-11 | Pre-existing failures must not worsen | Glossary gate counts compared before/after |

## Performance

Section files are already 90–160 KB and are statically imported. The additions in
this campaign are on the order of 4 KB per touched section — under 5 % growth on
the two files involved, with no new imports and no new runtime work. No
performance gate applies.
