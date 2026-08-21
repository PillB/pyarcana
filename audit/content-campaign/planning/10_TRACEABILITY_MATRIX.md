# Traceability matrix

Every implemented item traces from a human requirement to a validated result.
No orphan requirements; no unmotivated content.

## U1 — S18 experimentation and causal literacy

| Link | Value |
|---|---|
| Human requirement | UR-01, UR-07, UR-08 |
| Curriculum requirement | CR-01 |
| RED defect | `RED-01` — S18 prescribes a design (`experimento`) in T3-A, builds an A/B comparison in T2-B, quizzes it in selfCheck Q8 and constrains it in `youDo`, while never defining randomised assignment anywhere in the 52 active sections |
| Evidence of absence | `aleatoriz*` zero active hits; `randomiz`/`grupo de control` only in unimported `s09-sklearn.ts`; `estimand`, `guardrail`, `peeking` zero active hits; body read of T2-B and T3-A |
| Source evidence | Executed demo (self-selection 41.35 vs randomised 5.50 against a true effect of 5.00); `numpy.random.Generator` docs, HTTP 200 |
| Implementation | `src/lib/course/sections/s18-data-engineering.ts` — 2 theory blocks (`subtopicId` S18-T2-B and S18-T3-A), 2 Autocheck questions, 1 `youDo` objective, 1 `youDo` requirement, 1 resource; `src/lib/glossary/terms.ts` — 4 terms |
| Yo hago | Not modified — the 8 demo IDs are frozen; each new theory block carries its own executed demonstration |
| Hacemos juntos | Not modified — all 24 exercise IDs frozen |
| Tú haces | `youDo` extended: classify the comparison as observational or experimental and justify the verb |
| Autocheck | 8 → 10 questions, positions conforming to the S18 cycle `[1,3,0,2]` |
| Project / capstone | Feeds CP-N2-B; brief identity and rubric weights unchanged |
| Badge | Not touched; no badge criterion references theory content |
| Tests | `v3` ×3, `preservation`, `preservation_sentinel`, `rebalance_selfcheck_positions`, `exam-pedagogy`, `tsc`, `eslint`, `tests/adversarial/content-campaign-progress-fixture.test.ts` (7) |
| Rendered evidence | `evidence/render/new-s18.png`, `new-s18b.png`, `render_inspection.json` |
| Compatibility class | `COMPATIBLE_ADDITIVE` (theory, Autocheck, resource, glossary) + `COMPATIBLE_SEMANTIC_REFINEMENT` (`youDo` wording) |
| Validation result | **PASS** — `+139/-0`; all identity sets identical |

## U2 — S15 columnar execution mental model

| Link | Value |
|---|---|
| Human requirement | UR-01, UR-07 |
| Curriculum requirement | CR-02 |
| RED defect | `RED-02` — S15-T4-A teaches Parquet only as type preservation; no active section explains why columnar layout changes the work |
| Evidence of absence | zero active hits for `pushdown`, `row group`, `projection`; body read of S15-T4-A and T4-B |
| Source evidence | Executed demo: 36 values read row-wise → 12 with projection → 4 after row-group pruning |
| Implementation | `src/lib/course/sections/s15-stdlib-deep.ts` — 1 theory block (`subtopicId` S15-T4-B); `src/lib/glossary/terms.ts` — 2 terms |
| iDo / weDo / youDo / selfCheck | Not modified |
| Constraint honoured | `pyarrow`, `duckdb`, `polars` all absent → standard-library demonstration; verified to run under `python3 -I` |
| Tests | Same battery; additionally **passes the repository's own runtime gate** (`status: pass, reason: ok`) because it needs no optional dependency |
| Rendered evidence | `evidence/render/new-s15.png`, `s15-desktop.png`, `s15-mobile.png` |
| Compatibility class | `COMPATIBLE_ADDITIVE` |
| Validation result | **PASS** — `+57/-0` |

## Requirements with no implementation, and why

| Requirement / candidate | Disposition |
|---|---|
| Temporal validation (package HIGH) | `ALREADY_FIXED` — S32-T4-A, S33-T1-A, S33-T4-B, S36-T4-A. Implementing it would be duplication |
| Neural / DL bridge | `NOT_APPLICABLE` — would need a new section; blocked by UR-02/UR-03 |
| New tracked exercises for the new material | Blocked by the 24-ID invariant; teaching landed in theory + Autocheck instead |
| New badge | Requires schema change and explicit approval |
| 2 pre-existing glossary forward refs | Pre-existing and unrelated; fixing would widen scope into `rpa-automation` |
| 4 pre-existing `test_s03` errors | Pre-existing Python 3.9 vs `match` syntax; proven by stashing this campaign's changes |

## Reverse check — is anything in the diff untraceable?

| Changed file | Traces to |
|---|---|
| `s18-data-engineering.ts` | RED-01 / CR-01 / UR-01 |
| `s15-stdlib-deep.ts` | RED-02 / CR-02 / UR-01 |
| `glossary/terms.ts` | UR-08 (terminology support for both units) + IR glossary row |
| `tests/adversarial/content-campaign-progress-fixture.test.ts` | UR-14 / SYSR-01 / E2–E3 |
| `audit/content-campaign/**` | UR-05, UR-10, UR-11 (ledger and evidence) |
| `course-state/*.json`, `audit/safe-agent/preservation-sentinel-result.json` | Regenerated report artifacts produced by *running* the gates; not hand-edited |

No orphans.
