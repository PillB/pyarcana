# Curriculum requirements

## CR-01 — S18 must teach the remedy it already prescribes

**Learner starting point.** By S18 the learner has completed S01–S17. They can
write functions with contracts (S05), handle collections (S06), read and clean
tabular data (S15–S16), join and aggregate (S17), and — within S18 itself —
compute centre and spread, diagnose sampling bias, build a confidence interval,
bootstrap a mean, and compute Cohen's *d*.

**Missing knowledge.** They cannot say what makes a comparison causal. S18
repeatedly instructs them to avoid causal verbs *"sin diseño"* and names
"experimento" as the design that would license them, but never defines it.

**Required outcome.** After the addition, a learner finishing S18 can:

1. state the causal question behind a comparison and name its unit, treatment,
   control, outcome and estimand;
2. explain what random assignment buys — balance in expectation on *all*
   characteristics, observed and unobserved — and what it does not buy;
3. read an effect with its interval and refuse the two standard misreadings of a
   p-value;
4. distinguish statistical from practical significance;
5. name a primary metric and at least one guardrail metric;
6. explain why stopping early on a good-looking result, or testing many metrics,
   inflates false positives;
7. recognise self-selection as the failure mode that makes a comparison
   non-causal, and connect it back to the confounder already taught in S18-T3-A.

**Prerequisite graph.** All prerequisites are satisfied *inside S18 before the
insertion point*: sampling and bias in T2-A, intervals and effect size in T2-B,
confounding in T3-A. No forward reference to any section after S18 is permitted.

**Placement.** Inside the existing `S18-T2-B` and `S18-T3-A` subtopics. T2-B
already contains the A-versus-B comparison the concept explains; T3-A already
contains the confounder the concept resolves. This is the placement the package
proposed and body inspection independently confirms.

**Misconceptions to handle explicitly.**
- "p < 0.05 means the probability the null is true is under 5 %."
- "A non-significant result proves there is no effect."
- "Randomisation makes the groups identical." (It makes them *comparable in
  expectation*; a single small experiment can still be unbalanced by chance.)
- "A big *d* means the campaign worked." (Only if assignment was random.)

**Transfer.** The `youDo` brief (CP-N2-B) must let the learner state whether
their comparison is observational or experimental, and justify the verb they use.

## CR-02 — S15 must teach why columnar layout changes the work

**Learner starting point.** They have just learned to export CSV, Excel and a
Parquet type contract, and to prove it with a round-trip.

**Missing knowledge.** Why any of it matters at scale. Parquet is presented as a
type-preservation trick; the reason a columnar file lets a query engine skip work
is absent from the whole course.

**Required outcome.** The learner can explain, in their own words, that row
layout stores a record contiguously while column layout stores a field
contiguously; that reading three columns out of forty therefore touches roughly
three-fortieths of the bytes; that statistics stored per row group let a reader
skip a group entirely when a filter cannot match it; and that the durable idea is
about *layout and planning*, not about any particular engine's name.

**Placement.** Inside the existing `S15-T4-B` (*Índices, formatos, provenance y
memoria*), which already concerns physical representation and memory.

**Constraint.** The course must not acquire a dependency on DuckDB, Polars or
`pyarrow`. The existing text already treats `pyarrow` as optional, and the
runtime audit must keep passing on a machine without it. Any demonstration must
run on the standard library.

## CR-03 — Duplication is a defect

Temporal validation is **not** added. It is already taught in S32-T4-A,
S33-T1-A, S33-T4-B and S36-T4-A. See `SOURCE_AUTHORITY_MAP.md` §2.2.

## CR-04 — Assessment must follow the teaching, not precede it

Any Autocheck question added must be answerable from the S18 prose as written,
must have at least one distractor that is a genuine misconception rather than an
obvious absurdity, and must explain why the strongest wrong answer is wrong.
