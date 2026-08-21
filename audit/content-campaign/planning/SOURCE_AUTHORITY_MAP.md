# Source authority map and reconciliation of the prior package

**HEAD:** `7aa825ac`  ·  **Package baseline:** `8b8bfc38`  ·  **Date:** 2026-08-21

## 1. Authority hierarchy applied

1. Session/system constraints.
2. The explicit human requirements in the current task.
3. `AGENTS.md` preservation policy.
4. **The checked-out code and the active import graph** — authoritative for every
   implementation fact.
5. Current tests consistent with active behaviour.
6. The campaign package (`CAMPAIGN_REFERENCE_DIR`).
7. Historical roadmaps, `worklog.md`, `expert_audit/`.
8. Filenames — authority level: none. See `PROJECT_CONTEXT_INDEX.md` §5.

The package is well-made and its *method* is adopted wholesale. Its *findings*
were re-derived. Three of its four headline claims survived re-derivation in
modified form; one did not survive at its stated priority.

## 2. Reconciliation of the four candidate areas

### 2.1 Experimental and causal literacy — package said HIGH → **confirmed STILL_MISSING, and worse than described**

Search across the 52 **active** files:

| Term | Active-file hits |
|---|---|
| `aleatoriz*` (randomis*) | **none** |
| `randomiz*` | only `s09-sklearn.ts` — **inactive** |
| `grupo de control` | only `s09-sklearn.ts` — **inactive** |
| `estimand` / `estimando` | **none** |
| `contrafactual` | `s03` only, in a non-statistical sense |
| `guardrail`, `peeking`, `multiple testing`, `significancia práctica` | **none** |

Body inspection of S18 then produced something stronger than a simple absence.
S18 does not merely omit experiments — **it depends on them.**

- `S18-T2-B` builds a worked two-group comparison (group A mean ≈ 94, group B
  ≈ 108, Cohen's *d* ≈ 1.1) and closes with *"magnitud + incertidumbre, no
  veredicto causal de campaña."*
- `S18-T3-A` instructs the learner: *"Lista causas comunes y **diseños que las
  romperían (experimento, instrumento)** antes de cualquier afirmación causal."*
- `selfCheck` Q8 asks the learner to interpret exactly that A/B-shaped comparison.
- `youDo` requires *"Interpretar correlación/Spearman o segmentos **sin
  afirmaciones causales**."*

So the section names the remedy — an experiment — four times, tells the learner
their conclusions are blocked without it, and never explains what it is. The
learner is left with a prohibition and no route past it.

This is the exact defect the writing protocol §3.3 forbids (*"assumes hidden
knowledge"*, *"introduces terminology without clarifying it"*) and that the
campaign's own anti-Claude-speak rule names: *a cross-reference is a reminder,
not an explanation.*

**Verdict: `STILL_MISSING`, highest priority.** The evidence is stronger than the
package's, because the gap is self-inflicted by the current text rather than
merely absent from it.

### 2.2 Temporal validation — package said HIGH → **downgraded to largely `ALREADY_FIXED`**

This is the campaign's main factual correction. Body inspection shows the
concept is taught in **three** active sections, none of which the package's
table credited:

| Where | What is already taught |
|---|---|
| `S32-T4-A` *Split por entidad, grupo y tiempo* | Temporal split `train ts < cutoff`; group split by entity; `overlap` count; `REJECT_ENTITY_OVERLAP` gate; runnable code |
| `S33-T1-A` *Unidad, target y horizonte* | Unit, observable target, and **`horizon_days`** as an explicit, non-inventable contract (`REQUEST_HORIZON` rather than defaulting) |
| `S33-T4-B` *Validación cruzada por entidad* | Group CV, fold disjointness, why random splits inflate metrics |
| `S36-T4-A` *Splits, backtests y ventanas temporales* | **Backtest**: fit μ/σ on the past only, score the future; sliding windows; explicit `has_leakage` check; *"Rompes el experimento si el mes evaluado entra al fit o barajas filas como si el tiempo no existiera."* |

The package asserted *"the missing case is time-dependent prediction: future
observations must never enter training."* That sentence is a near-paraphrase of
what `S36-T4-A` already says. The package's reconciliation table also listed S36
as *"Clustering y anomalías"*, omitting the *"y validación temporal"* that is in
the current title — evidence that the table was built from a stale or partial
read.

What genuinely remains absent: rolling-**origin** cross-validation over multiple
successive origins, a seasonal-naive baseline, and MAE as a forecast metric.
Those are forecasting-course topics. PyArcana is not a forecasting course, and
its target role already gets the durable idea — *fit on the past, score the
future, never shuffle time* — three times over.

**Verdict: `ALREADY_FIXED` for the durable concept; the residue is `NOT_APPLICABLE`
at core priority.** Adding it would be duplication, which the campaign itself
classifies as a defect. Not implemented.

### 2.3 Columnar execution mental model — package said MEDIUM → **confirmed `STILL_MISSING`, medium**

`S15-T4-A` (*CSV, Excel y contrato Parquet*) teaches Parquet purely as a
**type-preservation** device: *"preserva tipos de forma nativa"*, round-trip,
`index=False`, the `Unnamed: 0` trap, and an honest fallback to CSV + schema JSON
when `pyarrow` is unavailable. That is good, and it is the whole of it.

Absent from all 52 active files: row-versus-column physical layout, projection or
filter pushdown, row-group / partition pruning, `EXPLAIN` as inspectable
evidence. The learner is told *which format to write* but never *why the format
changes what the machine has to read*.

**Verdict: `STILL_MISSING`, medium priority.** Genuine, but second to §2.1: it
improves a mental model, whereas §2.1 unblocks a conclusion the course actively
forbids the learner from reaching.

### 2.4 Neural / deep-learning foundations — package said OPTIONAL → **`NOT_APPLICABLE` for this campaign**

The package itself declines to promote it. It would require a new numbered
section or would displace existing material, both of which are out of scope
under the immutable "do not redesign levels/phases" requirement. Not implemented.

## 3. Package claims accepted without change

`19_SAVE_PROGRESS_COMPATIBILITY.md` was verified against the code and is
accurate: storage key `python-ds-progress`, the seven progress fields, the five
sub-step tokens, `(userId, sectionId, subStep)` server identity, and the 24-per-
section exercise-ID invariant all match `CURRENT_REPO_BASELINE.json` exactly.
Its four compatibility classes are adopted verbatim as this campaign's
vocabulary.

Its `ALREADY_FIXED` warn-list (do not re-add testing, MLOps, RAG, agents, evals,
production orchestration, basic Parquet awareness) is consistent with the
observed section titles and is honoured.

## 4. A methodological warning this campaign had to apply

Three of the "randomisation is missing" search hits landed in `s09-sklearn.ts`.
That file is **not imported** by `index.ts`. Had the negative/positive search been
taken at face value, the campaign would have concluded that control groups are
already taught. They are not — they are taught in a file no learner can reach.

Grep over `sections/*.ts` is a nomination signal. Only the active import graph
plus a body read is proof. This is recorded because it is the single easiest way
for a future campaign to reach a wrong conclusion in this repository.
