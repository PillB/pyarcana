# Assessment validity report

> Governing spec Section 8 (Rubrics) and Section 13 (Harness Artifacts / Rubrics).
> Source of truth: `src/data/rubrics.ts`, `src/data/capstones.ts`,
> `src/lib/copilot-harness.ts`, `tests/capstones.test.ts`.

## 1. Outcomes align with tasks

Every capstone declares:

- `learningOutcomes` (the intended learning outcomes, ILOs),
- `sectionContributions[*].{iDo, weDo, youDo, assessment}` (the aligned tasks),
- `acceptanceCriteria` (what the artefact must satisfy),
- `rubric.criteria` (how the artefact is scored).

The rubric uses a fixed nine-criterion family (F, D, T, A, R, S, U, E, C) plus
per-capstone extra criteria (e.g. `FR` for CP-N1-C, `ER` for CP-N3-A, `BL/CI/HR/TR/EV`
for CP-N4-C). This is **constructive alignment** (Biggs): the ILO verb, the task
verb, and the rubric verb match.

## 2. Critical criteria are non-compensatory

A criterion with `critical: true` cannot be compensated by a high score on
other criteria. The base rubric always marks `D` (Data and failure handling),
`T` (Testing), `R` (Reproducibility), `S` (Security and privacy), and `U`
(Responsible use) as critical. Per-capstone extras (e.g. `FR`, `AC`, `AP`, `ER`,
`EV`, `MC`, `CE`, `RB`, `BL`, `CI`, `HR`, `TR`, `EV`, `12`, `CT`, `DR`, `SC`)
are also critical.

The `criticalFailures` array lists automatic-fail conditions (e.g. *"Use of real
confidential, personal, employer-owned or regulated information."*, *"Committed
secret or credential in the repository or logs."*, *"Automatic unsupported fraud
… inference."*). These are non-negotiable: triggering any one fails the
capstone regardless of the weighted score (see
`rubrics/critical_failure_matrix.json`).

## 3. Guided work is not counted as independent

Each `sectionContribution` distinguishes `iDo` (instructor demonstration), `weDo`
(guided practice), and `youDo` (independent transfer). The rubric's `T`
(Testing) and `R` (Reproducibility) criteria are scored on the **`youDo`**
artefact — the learner's independent work — not on the `iDo` or `weDo`
artefacts. The `C` (Communication and demonstration) criterion further requires
a *truthful CV narrative*, penalising claims that conflate guided work with
independent capability.

## 4. localStorage cannot forge a verified award

The learner UI stores per-capstone progress in `localStorage` **only** as a
 UX affordance (e.g. "marked as reviewed"). The disclaimer in
`src/app/page.tsx` documents this:

> Learner progress is stored locally per capstone. Never used to forge a
> verified award — a localStorage flag cannot pass an authenticated assessment.

Assessment is **server-side** (the `/api/copilot/run` route for CP-N4-C; the
future assessment endpoints for the other capstones). A `localStorage` edit
cannot produce a server-verified badge record.

## 5. Tests distinguish superficial from demonstrated capability

The automated test suite (`tests/capstones.test.ts`, 119 tests) enforces:

- **Cardinality invariant** — 13 capstones, 3 per level, exactly one CP-FINAL.
- **Consistency** — every capstone has a matching rubric, badge, and section
  contributions; every section maps to a real capstone.
- **Content** — every capstone has a non-empty brief, prerequisites, synthetic
  data contract, I-Do/We-Do/You-Do, assessment, rubric, evidence,
  remediation, security requirements, and final-integration interfaces.
- **Runtime (CP-N4-C)** — the harness runs end-to-end: plan → retrieve →
  propose tool → approval gate → verify → cited output → redacted trace.
- **Adversarial (CP-N4-C)** — prompt-injection, infinite-loop, budget
  exhaustion, missing approval, redaction, and provider-failure fallback all
  stop safely.
- **CP-FINAL integration** — 12 upstream dependencies, versioned interface
  contracts, dependency graph, executed rollback, system card, no-go condition,
  truthful contribution statement.
- **Backward compatibility** — stable section IDs S01–S52, capstone IDs
  (CP-N1-A … CP-N4-C, CP-FINAL), level stable IDs L1–L4, badge IDs.

A "polished chatbot without the harness controls" is explicitly listed as a
critical failure of CP-N4-C (`RUBRICS["CP-N4-C"].criticalFailures`), and the
adversarial tests verify the harness rejects it. The verifier enforces
faithfulness ≥ 0.90 and context precision ≥ 0.70, so a draft with ungrounded
claims is rejected and no cited output is produced.
