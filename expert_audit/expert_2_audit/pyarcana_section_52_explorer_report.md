# 1. Section Identification & Scope

## Section under audit

- **Section:** 52
- **Current live label:** **Capstone FINAL**
- **Source title:** **Enterprise Relationship & Operations Intelligence Platform: capstone final**
- **Public route:** `https://pillb.github.io/pyarcana/#career-strategy`
- **Current source file:** `src/lib/course/sections/s52-career-strategy.ts`
- **Current source SHA observed:** `8d056386bd4641dc2400dac5363ea3ac1e0a110a`
- **Declared duration / level:** **80 hours · Master**
- **Declared capstone:** **CP-FINAL**, integrating the 12 preceding capstones.

The live landing page publicly registers Section 52 as an 80-hour Master capstone whose stated output is the integration of 12 capstones, a reproducible demo, a system card, and a CV impact case. The same live page describes the course-wide I Do / We Do / You Do / Autocheck sequence. citeturn907410view0 The registered source matches that card and exposes eight outcomes, eight theory subtopics, eight I Do demonstrations, 24 We Do exercises, one 80-hour You Do project, five public self-check questions, and a resource list. fileciteturn38file0L5-L27 fileciteturn22file0L38-L57 fileciteturn23file0L33-L68

## Scope boundary

This run analyzes **only Section 52**. References to Section 51, earlier checkpoints, the roadmap, shared rendering components, and external courses are used only when they are necessary to judge Section 52’s prerequisites, handoff, fidelity, accessibility, or comparative quality. No content was changed.

The audit covered:

1. The live landing representation and the Section 52 hash route.
2. The complete Section 52 source contract: metadata, outcomes, theory, I Do, We Do, You Do, self-check, resources, notes, rubrics, and starter code.
3. The authoritative roadmap requirements for S52, CP-FINAL, CF-1…CF-5, four topic evaluations, and an eight-item section exam.
4. The Section 51 handoff into CF-5.
5. The rendering and completion harness used by the public section.
6. External benchmarks for capstones, authentic assessment, worked-example fading, MLOps projects, responsible AI, reliability terminology, and accessibility.

## Audit method

The report used iterative passes:

- **Surface pass:** rendered title, route, duration, tabs, completion controls, and public assessment.
- **Graph pass:** every outcome, theory block, demo, exercise family, gate, artifact, rubric criterion, and assessment item was treated as a node; edges were checked for alignment and executable evidence.
- **Pedagogy pass:** I Do → We Do → You Do fading, authenticity, cognitive load, feedback, milestones, and transfer.
- **Technical pass:** gate semantics, reproducibility, benchmark validity, checkpoint lineage, SLO/RPO/RTO, HITL, privacy, and fail-closed logic.
- **Redaction pass:** Peruvian Spanish, code-switching, terminology, register, precision, and internal-text leakage.
- **Comparative pass:** current Section 52 against the roadmap, Section 51’s frozen handoff, current early-section modeling quality, and external capstone exemplars.
- **Regression pass:** historical Section 52 findings were checked against the current source rather than assumed still valid.

The 13 attached earlier reports were used **only as structural references**, not as evidence about current Section 52. fileciteturn0file8 fileciteturn0file12 fileciteturn0file9 fileciteturn0file2 fileciteturn0file10 fileciteturn0file6 fileciteturn0file0 fileciteturn0file11 fileciteturn0file4 fileciteturn0file7 fileciteturn0file5 fileciteturn0file3 fileciteturn0file1

---

# 2. Executive Summary of Quality

## Overall score: **6.4 / 10**

## Key verdict

**Section 52 is now a strong capstone blueprint and governance narrative, but it is not yet a defensible Master-level graduation assessment.**

Its strongest qualities are unusually explicit:

- six bounded contexts, including `relationship`;
- a strict HITL chain that does not equate matching or scores with fraud;
- eight required evidence artifacts;
- a six-layer verification matrix;
- explicit P0/P1 blocking;
- synthetic-only data;
- before/after measurement;
- RPO/RTO and restore evidence;
- personal-contribution disclosure;
- CP-N4-C non-compensation;
- clear normal / breach / uncertainty action codes.

Those contracts are substantially more coherent than the older repository Explorer report, which documented contradictions such as five versus six contexts, six versus eight artifacts, and shallow `print(True)` demonstrations. The current source has repaired those specific inconsistencies. fileciteturn16file0 fileciteturn17file0L7-L33 fileciteturn18file0L4-L38

However, the section’s central promise—**an evidence-based graduation gate**—is not enforced by its own final starter:

- `READY` does not actually verify 52/52 sections, 12/12 capstones, CP-FINAL, CF-1…CF-5, zero P0/P1, CP-N4-C independence, or a successful total regression.
- artifact “validation” accepts dictionary keys without checking whether files exist, contain the required evidence, or match frozen hashes;
- the regression command is accepted merely because it is a non-empty string;
- key milestones remain manually flippable booleans;
- the benchmark requires an improvement, creating pressure to cherry-pick rather than report an honest null or negative result;
- the 24 exercises overwhelmingly practice repairing flat Boolean predicates rather than integrating APIs, event schemas, tests, RAG, RPA, observability, or recovery evidence;
- no four topic evaluations are mounted;
- the public quiz has only five questions for eight subtopics;
- the final project rubric supplies weights but not performance standards or critical floors;
- the public UI can mark the 80-hour project complete with a click.

The result is a serious mismatch between **what the prose says must be proved** and **what the harness actually proves**.

## Dimension scores

| Dimension | Score | Verdict |
|---|---:|---|
| Technical and ethical framing | 8.5 | Strong fail-closed posture, HITL, synthetic data, and explicit boundaries |
| Narrative and connective tissue | 7.8 | Clear T1→T4 thread and meaningful closure from S51 |
| I Do modeling | 5.5 | Correct predicates, but little authentic system-level modeling |
| We Do / fading | 4.8 | Highly repetitive Boolean repair; weak transfer toward the real project |
| You Do authenticity | 7.0 | Ambitious and professionally relevant, but easily self-attested |
| Assessment alignment | 4.2 | Missing topic evaluations and incomplete public exam coverage |
| Cognitive-load management | 6.0 | Good roadmap, but a very large jump from micro-snippets to an 80-hour system |
| Roadmap fidelity | 5.8 | Counts partly match; checkpoint, evaluation, exam, and rubric contracts do not |
| Peruvian-Spanish redaction | 6.5 | Understandable and energetic, but excessively code-switched and inconsistent |
| Accessibility / completion UX | 5.2 | Basic tab UI is usable, but final completion and assessment semantics are misleading |
| External benchmark quality | 6.5 | Good documentation bundle; weaker milestone review, authentic practice, and evaluation evidence |

## Release recommendation

**Do not treat Section 52 as a final graduation gate yet.** It is acceptable as a provisional capstone specification, but it should remain blocked from “Master complete” status until Issues 1–4, 7–10, 12, and 17 are resolved.

---

# 3. Detailed Issue Registry

## Severity scale

- **P0 · Critical:** Can produce false graduation, unsafe claims, or a structurally invalid final assessment.
- **P1 · High:** Materially harms mastery, transfer, roadmap fidelity, or technical correctness.
- **P2 · Medium:** Degrades clarity, validity, accessibility, or professionalism.
- **P3 · Low:** Polish or maintainability issue with limited immediate learning impact.

## Issue 1 — **P0 · The executable `readiness()` gate does not enforce the headline graduation contract**

**Location:** `youDo.starterCode`, final `readiness()` function.

**Evidence**

The section map advertises five gates:

> `"gates": ["s52_of_52", "capstones_12_of_12", "cp_final", "regression_s1_s52", "zero_p0_p1"]`

and explicitly states that CP-N4-C cannot compensate. fileciteturn38file0L41-L61

The You Do objectives repeat:

> “Demostrar el gate: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.” fileciteturn22file0L41-L45

But `readiness()` never receives or checks:

- section completion count;
- capstone completion count;
- CF-1…CF-5 status;
- CP-FINAL assessment status;
- CP-N4-C independent result;
- P0/P1 counters;
- regression exit code or report.

It can return `READY` after checking broad evidence booleans, artifact-key counts, contexts, a Boolean HITL flag, a non-empty event list, manually supplied drill numbers, milestones, a defense script, and TTR improvement. fileciteturn22file0L120-L163

**Pedagogical impact**

This is the section’s most consequential contradiction. Learners are taught that evidence—not assertion—controls promotion, yet the final executable artifact can approve a portfolio without proving the advertised curriculum gate. That teaches the wrong professional habit: a checklist can substitute for a verified release record.

**Graph defect**

`headline_gate` has no executable edge to `readiness()`. The graph contains the nodes but not the proof relationship.

---

## Issue 2 — **P0 · The evidence harness validates labels and strings, not artifacts or executions**

**Location:** `youDo.starterCode`.

**Evidence**

The starter accepts:

```python
artifact_paths: dict[str, str] = {}
regression_cmd = "python -m pytest tests/ -q"
```

but checks only:

```python
if len(artifact_paths) < 8 or set(BUNDLE_8) - set(artifact_paths):
    ...
if not regression_cmd.strip():
    ...
```

It does not:

- verify that each path exists;
- verify file type, content, non-emptiness, or hash;
- execute the regression command;
- record exit code, duration, stdout, test count, or report path;
- validate that the eight artifacts correspond to the same revision;
- confirm that `LICENSE`, cards, ADRs, and defense notes are internally consistent.

Likewise, `milestones`, `hitl_chain_ok`, and the four broad `evidence` flags are manually flippable Booleans. fileciteturn22file0L58-L126 fileciteturn22file0L130-L163

The comment says “no pases a READY solo volteando booleans,” but the function still permits exactly that behavior. fileciteturn22file0L58-L67

**Pedagogical impact**

The capstone teaches “evidence literacy” rhetorically but provides an anti-pattern technically. A Master-level learner should produce a machine-verifiable manifest, frozen revision, hashes, commands, and results—not self-attested flags.

**Professional impact**

A reviewer cannot reproduce the claimed state, distinguish stale files from current files, or detect a fabricated regression result.

---

## Issue 3 — **P1 · Graduation requires metric improvement, incentivizing cherry-picking and contradicting earlier responsible-ML principles**

**Location:** T4-A theory, I Do, We Do, and You Do.

**Evidence**

The section states:

> `result_ttr < baseline_ttr`

and the demo raises:

> `assert result_ttr < baseline_ttr, "sin mejora no hay claim"` fileciteturn17file0L129-L152

The final readiness function blocks:

> `ttr_no_improvement_vs_baseline` whenever `result_ttr_min >= baseline_ttr_min`. fileciteturn23file0L3-L13

Yet the live curriculum explicitly frames Section 33 as demonstrating when ML **does or does not** add value. citeturn907410view0 The authoritative roadmap requires before/after metrics, not guaranteed improvement. fileciteturn37file0L47-L56

**Pedagogical impact**

This creates a perverse incentive: students may alter the benchmark, metric, sample, or narrative until the result is favorable. Honest engineering sometimes concludes:

- no measurable gain;
- regression;
- gain too uncertain to support a claim;
- deterministic baseline remains preferable.

Those can be excellent capstone outcomes if the decision is evidence-based.

**Required correction**

The gate should validate **claim honesty and decision quality**, not require a positive result.

---

## Issue 4 — **P1 · The implementation hardcodes TTR despite promising “TTR u otra métrica”**

**Location:** You Do requirements, starter variables, and readiness.

**Evidence**

The project requirement allows:

> “benchmark antes/después (TTR u otra métrica con baseline congelado).” fileciteturn22file0L47-L56

But the starter requires:

```python
baseline_ttr_min = None
result_ttr_min = None
```

and the readiness logic recognizes no other metric. fileciteturn22file0L124-L128 fileciteturn23file0L9-L13

**Pedagogical impact**

The prose invites authentic metric selection, while the executable gate silently narrows the construct. Projects optimizing precision, review yield, abstention quality, cost, latency, accessibility, or recovery success cannot satisfy the supplied harness without pretending their outcome is TTR.

**Assessment-validity impact**

The assessed construct becomes “did TTR decrease?” rather than “did the learner choose, freeze, measure, and interpret an appropriate success metric?”

---

## Issue 5 — **P1 · CF-2, CF-3, CF-4, and CF-5 are not revalidated as versioned checkpoint evidence**

**Location:** learning outcomes, theory map, You Do gate.

**Evidence**

The roadmap requires S52 to start only after:

> “CP-N4-C/regresión N4 y CF-1…CF-5 `PASS`” fileciteturn36file0L13-L18

It also defines checkpoint artifacts with version/revision, date, responsible owner, reviewer, paths/hashes, commands, results, and issues. fileciteturn35file0L105-L115

Section 52 explicitly revalidates only CF-1. Its outcomes and starter do not require a checkpoint manifest proving CF-2, CF-3, CF-4, and CF-5, nor their immutable revisions. fileciteturn38file0L18-L26

Section 51’s close explicitly freezes CF-5 interfaces and artifacts for final integration, including accessibility and contestability. fileciteturn26file0L18-L35 The final S52 gate does not verify that frozen manifest or preserve the CF-5 WCAG / appeal requirements.

**Pedagogical impact**

Learners can build a plausible final package around reconstructed or changed artifacts without proving continuity from the approved checkpoints. This weakens lineage, configuration control, and the very “no compensation” principle the section emphasizes.

---

## Issue 6 — **P1 · Complex evidence is collapsed into counts, sets, and Booleans**

**Location:** theory code, I Do, and We Do fixtures.

**Evidence**

Examples include:

- `jobs: int` rather than actual jobs-to-be-done records;
- `risks_with_owner: int` rather than risk entries with owner, threshold, status, and acceptance;
- `residual_ok: bool` rather than signed risk acceptance;
- six test layers as Booleans rather than test reports;
- evidence artifacts as a set of names rather than paths, hashes, revisions, and validation results.

For example, T1-B claims to require risks “con dueño y umbral escritos,” but its code takes only a count and a Boolean. fileciteturn38file0L95-L114 T4-B’s demonstration validates a set of eight labels. fileciteturn18file0L211-L234

**Pedagogical impact**

The learner practices the **shape of a gate** without learning the evidence model behind it. This is reasonable in an early fundamentals section, but not sufficient in an 80-hour Master capstone whose purpose is integration, governance, and defense.

**Graph defect**

Rich evidence nodes are compressed into scalar proxies; provenance, ownership, revision, and review edges disappear.

---

## Issue 7 — **P1 · The eight I Do demonstrations model Boolean predicates, not the integration procedure they claim to model**

**Location:** `iDo.steps`.

**Evidence**

The introduction says:

> “Ocho demos de modelado de procedimiento … Observa el cómo se decide.” fileciteturn18file0L42-L44

But the demonstrations are predominantly short local functions that:

- compare sets;
- count contexts;
- test Boolean fields;
- return `PASS` or a block code;
- print synthetic dictionaries.

Representative examples are `contract_gate`, `hitl_ok`, `gate`, `disaster_gate`, and `bundle_ok`. fileciteturn18file0L94-L162 fileciteturn18file0L165-L234

They do not model:

- creating and versioning an OpenAPI contract;
- validating an event schema;
- running a contract test;
- tracing one case across six contexts;
- executing an eval or red-team suite;
- recording a restore drill;
- hashing and validating the evidence bundle;
- defending an ADR.

**Pedagogical impact**

Worked examples are effective when they expose the process and principled knowledge used in the target task. Research on programming worked examples and process-oriented examples supports explicit reasoning and gradual transfer, not merely showing a final predicate. citeturn174287search0turn174287search11

---

## Issue 8 — **P1 · The 24 We Do exercises are structurally repetitive and do not fade toward authentic system work**

**Location:** `weDo.steps`.

**Evidence**

The dominant pattern is repeated across subtopics:

- E1: repair an inverted Boolean;
- E2: classify valid / adverse / missing records;
- E3: map valid / breach / uncertainty to an action code.

Examples from T1-A, T1-B, T2-A, T4-A, and T4-B use near-identical dictionary validators and fixed outputs. fileciteturn19file0L4-L143 fileciteturn20file0L17-L68 fileciteturn20file0L72-L170 fileciteturn21file0L28-L79 fileciteturn21file0L83-L169

The content calls E2 “independent” and E3 “transfer,” but the representation, reasoning pattern, and output vocabulary remain almost unchanged.

**Pedagogical impact**

This is not sufficient fading. Research on worked-solution fading shows that support should be removed while the learner increasingly performs the **target task**, not merely the same small predicate with another field name. citeturn174287search5

**Transfer gap**

The learner goes from flat dictionaries directly to an 80-hour multi-context platform. Missing intermediate bridges include:

- a real OpenAPI / event-schema diff;
- a failing `pytest` contract test;
- a trace or manifest parser;
- a DR evidence log;
- a red-team regression artifact;
- an ADR critique;
- a system-card completeness review.

---

## Issue 9 — **P1 · The 80-hour project has a schedule, but no reviewable milestone deliverables or feedback gates**

**Location:** theory roadmap and You Do requirements.

**Evidence**

Section 52 provides a useful nine-week outline and four broad milestone Booleans. fileciteturn38file0L30-L36 fileciteturn22file0L103-L109

However, it does not define for each milestone:

- required deliverables;
- acceptance tests;
- reviewer;
- decision (`PASS`, `REVISE`, `NO-GO`);
- remediation path;
- evidence location;
- scope-reduction rule;
- maximum rework loop.

**Comparative benchmark**

CS50 final projects use proposal and status-report checkpoints to keep students on track, while FSDL projects include staff review and feedback. citeturn352916search1turn893892search5 Stanford CS329S treats the final project as the majority of the grade and culminates in a demo day. citeturn893892search3

**Pedagogical impact**

An 80-hour self-guided project without milestone evidence gates invites late discovery of architecture, scope, or safety failures. The action codes tell the learner **what state exists**, but not how to recover.

---

## Issue 10 — **P1 · Four required topic evaluations are absent**

**Location:** Section 52 object and public You Do rendering.

**Evidence**

The roadmap requires exactly four topic evaluations per section, each with two authentic tasks and a 0–3 rubric. fileciteturn35file0L18-L35 fileciteturn35file0L87-L95

The `CourseSection` type and UI support `topicEvaluations`. fileciteturn24file0L89-L109 fileciteturn30file0L159-L195

Section 52 ends after `resources` and mounts no `topicEvaluations` property. fileciteturn23file0L70-L124

**Pedagogical impact**

The course lacks authentic, intermediate evidence that each pair of subtopics has been mastered before the learner attempts the final platform. The only visible formative assessment is the repetitive code repair and five-item quiz.

---

## Issue 11 — **P1 · The public self-check covers only five of eight subtopics**

**Location:** `selfCheck.questions`.

**Evidence**

The public source contains five questions. They directly cover:

1. T1-A CF-1;
2. T2-A contexts;
3. overall final gate;
4. T3-B resilience;
5. T4-A / T4-B claims and bundle.

There is no direct item for:

- T1-B no-go and risk acceptance;
- T2-B HITL chain;
- T3-A six-layer verification / P0/P1.

fileciteturn23file0L33-L68

The roadmap requires exactly one item per subtopic—eight items per attempt. fileciteturn35file0L23-L30 fileciteturn35file0L93-L97

**Pedagogical impact**

A learner can pass the public final quiz without being tested on three critical safety and verification constructs. For a capstone, this is a construct-underrepresentation problem.

---

## Issue 12 — **P2 · Quiz distractors are often implausible, reducing diagnostic value**

**Location:** public self-check.

**Evidence**

Distractors include:

- “publicar el DNI de stakeholders para ‘auditar’”;
- “inventar contract tests en el PR sin correrlos”;
- “se usó la herramienta más nueva”;
- “borrar el context relationship para simplificar el monólito.”

fileciteturn23file0L42-L66

These are easy to reject without understanding the target concept.

**Pedagogical impact**

The quiz measures recognition of obviously unethical or nonsensical options rather than discrimination among realistic professional misconceptions—for example, shared read replicas versus shared ownership, a tabletop versus a restore test, or human approval recorded after rather than before a side effect.

**Threshold defect**

With five equally weighted questions, the nominal 70% gate is effectively 80%: 3/5 is 60%, 4/5 is 80%. The UI communicates “70%,” but the discrete test cannot produce that score. fileciteturn30file0L224-L248

---

## Issue 13 — **P1 · The final rubric gives weights but not performance standards, critical floors, or defense criteria**

**Location:** `youDo.rubric`.

**Evidence**

The rubric contains six criterion names and weights totaling 100%, but no:

- 0–3 or 0–4 performance descriptors;
- minimum per criterion;
- critical-failure rule;
- evidence examples;
- oral-defense standard;
- reviewer calibration procedure;
- resubmission rule.

fileciteturn23file0L24-L31

The roadmap’s generic capstone contract sets a different distribution—35/20/15/10/10/10—and requires ≥80%, all acceptance criteria, and zero critical safety failures. fileciteturn35file0L99-L103 The Section 52 rubric changes weights without documenting why and removes an explicit “design” category.

CMU’s capstone-rubric guidance emphasizes both components and standards of performance, including final presentation. citeturn893892search7turn893892search13

**Pedagogical impact**

Two reviewers could assign materially different scores to the same project. Learners cannot self-assess what “excellent,” “adequate,” or “insufficient” evidence looks like.

---

## Issue 14 — **P1 · Benchmark validity is reduced to two numbers with no sample, window, uncertainty, or confound controls**

**Location:** T4-A and You Do.

**Evidence**

The benchmark model records only baseline and result TTR integers, a synthetic flag, demo duration, claim sourcing, and personal contribution. fileciteturn21file0L11-L25

It does not require:

- sample size;
- measurement window;
- workload equivalence;
- distribution / variance;
- confidence interval or bootstrap interval;
- test-retest stability;
- definition of the unit of analysis;
- missing-data treatment;
- hardware / environment;
- confound or leakage checks;
- practical-significance threshold.

**Pedagogical impact**

A change from 90 to 42 minutes may be a real improvement, a different workload, a tiny sample, or a cherry-picked run. A Master capstone should teach the learner to defend the measurement design, not only the direction of two values.

---

## Issue 15 — **P1 · SLO, RPO, and RTO are technically oversimplified**

**Location:** T3-B theory, callout, code, and You Do drill.

**Evidence**

The section defines RPO/RTO as:

> “cuánto dato y tiempo puedes perder”

and operationalizes:

```python
backup_age_h <= rpo_h
rollback_min <= rto_min
```

fileciteturn17file0L97-L125

NIST defines RPO as the **point in time to which data must be recovered**, not simply backup age. citeturn324953search0 It defines RTO as the overall length of time system components can remain in recovery before harming mission or business processes, not merely rollback duration. citeturn324953search1

The availability check also lacks an observation window and error-budget consumption, so `0.999 >= 0.995` is not yet a complete SLO demonstration.

**Pedagogical impact**

The code is useful as a first approximation, but its current wording presents the proxy as the concept. A Master learner should distinguish:

- objective;
- measured recovery point;
- total service-recovery time;
- rollback step time;
- restore verification;
- observation window.

---

## Issue 16 — **P2 · Peruvian-Spanish redaction is understandable but excessively code-switched and internally inconsistent**

**Location:** metadata, outcomes, theory, requirements, rubric, and resources.

**Evidence**

Representative learner-facing phrases include:

- “portfolio defendible”;
- “system/model cards”;
- “soft skills”;
- “trade-off”;
- “drill”;
- “stakeholder/job/métrica”;
- “success metrics”;
- “constraints”;
- “owner”;
- “bounded contexts”;
- “release”;
- “schema”;
- “human workflow”;
- “evidence bundle”;
- “claims sourced”;
- “lineage”;
- “least privilege”;
- “senior-master.”

fileciteturn38file0L8-L36 fileciteturn23file0L23-L30

Some English terms are legitimate industry vocabulary, but the section often uses several in one sentence without a stable Spanish head term. The live course elsewhere uses **portafolio**, while S52 repeatedly uses **portfolio**. citeturn907410view0

**Pedagogical impact**

Dense code-switching adds extraneous linguistic load, especially for a course explicitly branded as Peruvian Spanish. It also makes the section less searchable and less consistent with earlier lessons’ “define before use” style. Current Section 1, for example, repeatedly introduces the Spanish meaning before relying on an English or abbreviated term. fileciteturn27file0L17-L45

**Recommended style**

Use a Spanish head term first and preserve the English term in parentheses on first use:

- `portafolio (portfolio)`;
- `contexto delimitado (bounded context)`;
- `paquete de evidencias (evidence bundle)`;
- `simulacro de recuperación (disaster-recovery drill)`;
- `responsable (owner)`;
- `métricas de éxito (success metrics)`;
- `compensaciones de diseño (trade-offs)`.

---

## Issue 17 — **P2 · The route identifier `career-strategy` is stale semantic residue**

**Location:** Section 52 metadata and public hash route.

**Evidence**

The source uses:

```ts
id: "career-strategy"
```

while the actual section is an enterprise platform capstone. fileciteturn38file0L5-L10

Because the application routes sections by `section.id`, the mismatch is exposed in the URL as `#career-strategy`. fileciteturn14file0

**Meta-leak status**

This is not an AI instruction leak, TODO, or author note. It is a low-level implementation residue visible to learners and link sharers.

**Impact**

It weakens semantic URLs, analytics, deep links, test naming, and the credibility of the final capstone. Renaming requires a backward-compatible alias to avoid breaking saved links.

---

## Issue 18 — **P1 · The public completion harness can mark the final capstone complete without evidence**

**Location:** `SectionView`, You Do tab, public quiz behavior.

**Evidence**

The You Do tab ends with a generic button:

> “Proyecto enviado a mi GitHub”

which calls `toggleSubStep` and does not validate a repository, artifact bundle, defense, regression report, or gate. fileciteturn30file0L74-L85 fileciteturn30file0L197-L199

The five course tabs are counted equally in section progress. fileciteturn28file0L70-L94

The public quiz callout says:

> “Si sacas 70% o más, desbloqueas la siguiente sección.”

There is no next section after S52. fileciteturn30file0L250-L258

**Pedagogical impact**

This is a harness-level contradiction: the prose insists that graduation cannot be self-declared, but the public UI permits exactly that. The 80-hour final project is represented as one manually toggled fifth of a section.

**Required correction**

Section 52 needs a distinct completion state such as:

- `DRAFT`;
- `EVIDENCE_READY`;
- `DEFENSE_PENDING`;
- `PASSED`;
- `REVISION_REQUIRED`.

A simple local “done” toggle is appropriate for reading progress, not for Master promotion.

---

## Issue 19 — **P2 · Required resources do not fully support the section’s hardest deliverables**

**Location:** `resources`.

**Evidence**

The resources include strong references for README, C4, ADRs, SSDF, 12-factor applications, licensing, and disaster recovery. fileciteturn23file0L70-L121

But the section requires or heavily uses:

- system cards;
- model cards;
- AI risk management;
- OpenAPI;
- event schemas / AsyncAPI;
- contract testing;
- evaluation design;
- WCAG 2.2;
- benchmark validity;
- human oversight.

Direct primary references for those constructs are absent. NIST’s AI RMF Generative AI Profile explicitly addresses trustworthiness across design, development, use, and evaluation and is a better fit than SSDF alone. citeturn518261view1 WCAG 2.2 is the current W3C recommendation and should remain visible in the final integration resources, not only upstream in S51. citeturn174287search15

**Pedagogical impact**

Learners are told to produce high-stakes artifacts without the best source for how to produce or evaluate them.

---

## Issue 20 — **P2 · The tone is gate-heavy but remediation-light**

**Location:** theory, exercises, self-check, and project notes.

**Evidence**

The section repeatedly uses block codes:

- `REOPEN_CF1`;
- `DECLARE_NO_GO`;
- `STOP_INTEGRATION_RELEASE`;
- `BLOCK_AUTOMATED_RISK_DECISION`;
- `BLOCK_FINAL_ON_P0_P1`;
- `NO_GO_RESILIENCE`;
- `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM`;
- `BLOCK_INCOMPLETE_EVIDENCE_BUNDLE`.

That fail-closed posture is a strength. However, the section usually stops at the code and a brief reason. It does not provide a reusable remediation protocol: owner, next evidence, retest, re-review, and closure criteria.

**Pedagogical impact**

Learners can identify failure states but may not learn operational recovery and governance closure—the professional skill that turns a block into a controlled improvement loop.

---

# 4. Meta-Leak Report

## Hard developer / AI leakage

**None found in the current learner-facing Section 52 source.**

No current visible strings were found matching:

- “TODO”;
- “FIXME”;
- “moved from section…”;
- “developer note”;
- “AI: rewrite this”;
- prompt instructions to an authoring agent;
- generated-content disclaimers;
- comments telling a future developer what to repair.

The current repository’s automated audit also reports zero source boilerplate and no high issues, although that automated result is too narrow to substitute for the present pedagogical audit. fileciteturn34file0L3-L16

## Intentional instructional text that is **not** a leak

The following are deliberate exercise scaffolds:

- `# DEFECT: ...`;
- `# Contrato: corrige el DEFECT`;
- stable IDs such as `S52-T2-A-E3`;
- action codes such as `STOP_INTEGRATION_RELEASE`.

They are part of the learner task and should not be removed merely because they look implementation-oriented.

## Soft semantic residue

| Exact text | Location | Classification | Severity |
|---|---|---|---|
| `id: "career-strategy"` | Section metadata / public URL hash | Stale internal semantic identifier exposed through routing | P2 |
| `cierre senior-master` | Opening theory | Awkward hybrid register, not developer leakage | P3 |
| `portfolio`, `cards`, `drill`, `claims sourced` | Multiple learner-facing blocks | Unlocalized technical copy, not internal instructions | P2 |

## Regression note

An older repository Explorer report documented genuine learner-facing inconsistencies and legacy framing. The present source has corrected many of those exact problems, so they are **not repeated as current defects**. fileciteturn16file0

---

# 5. Pedagogical & Redaction Deep Dive

## 5.1 Graph-engineering view

### Core learner graph

The intended Section 52 graph is coherent:

```text
S1–S51 + 12 capstones + CF-1…CF-5
        ↓
T1-A CF-1 delta
        ↓
T1-B signed no-go / risks
        ↓
T2-A six bounded contexts + APIs/events
        ↓
T2-B HITL workflow
        ↓
T3-A tests/evals/red-team/performance
        ↓
T3-B SLO + recovery exercise
        ↓
T4-A demo + measured claim + personal contribution
        ↓
T4-B eight-artifact evidence bundle + defense
        ↓
CP-FINAL + total regression + Master promotion
```

The prose maintains these edges unusually well. The opening map, bridges at the end of each theory block, and the repeated normal / breach / uncertainty vocabulary create strong narrative continuity. fileciteturn38file0L30-L36 fileciteturn17file0L37-L72

### Broken proof edges

The implementation graph breaks at the last step:

```text
declared graduation gate ──X──> readiness()
artifact label ───────────────> assumed evidence
non-empty command ────────────> assumed test success
manual Boolean ───────────────> assumed milestone
two TTR values ───────────────> assumed valid impact
```

This is why the section can be both conceptually strong and operationally invalid as a final assessment.

## 5.2 Narrative flow and connective tissue

### Strengths

- The opening dictionary anticipates specialist vocabulary.
- The section explains why CP-FINAL is not a “dump” of repositories.
- Every theory block includes a bridge to the next subtopic.
- The progression from stakeholder validity to publication mirrors a real system lifecycle.
- The final celebration paragraph prevents the gate from ending solely in punitive language.
- The S51 handoff is meaningful: CF-5 freezes the copilot artifacts and S52 claims to integrate them. fileciteturn26file0L30-L35

### Weaknesses

- The checkpoint narrative jumps from CF-1 to the final bundle without explicitly revalidating CF-2…CF-5.
- “Eight artifacts” is repeated often, but the reader gets less explanation of how evidence inside those artifacts should reconcile.
- The 80-hour project is compressed into one large starter block rather than a sequence of learner-visible deliverable pages.
- The repeated action-code rhetoric sometimes replaces explanation of causal diagnosis and remediation.

## 5.3 I Do fidelity

The I Do phase has eight demos, one per subtopic, satisfying the **count** contract. It also improves on the old `print(True)` style by computing predicates from fixtures. That is a real gain.

However, the target construct is enterprise integration. A worked example should expose:

1. inputs and artifact state;
2. expert diagnosis;
3. transformation or integration step;
4. verification command;
5. evidence produced;
6. decision and trade-off;
7. failure and recovery.

The current demos mostly expose only steps 1 and 6.

A better I Do sequence would include one longitudinal case moving through actual files:

```text
checkpoint_manifest.json
→ openapi/intake.yaml
→ events/job.finished.schema.json
→ tests/contract/test_job_finished.py
→ traces/case-per-052.jsonl
→ evals/report.json
→ dr/drill-2026-07-25.json
→ evidence/manifest.sha256
```

That would make expert reasoning visible without requiring a full production deployment.

## 5.4 We Do fidelity and fading

The labels “guided,” “independent,” and “transfer” are present, but the task form barely changes. This is **nominal fading**, not substantive fading.

A proper progression for T2-A could be:

- **E1 guided:** identify why a supplied OpenAPI/event change is breaking.
- **E2 partially scaffolded:** write the missing schema and contract test.
- **E3 transfer:** integrate a second event and produce a compatibility report.

For T3-B:

- **E1 guided:** read a drill log and calculate achieved RPO/RTO.
- **E2 partially scaffolded:** repair a restore script and capture timings.
- **E3 transfer:** design a new scenario, run it, and defend whether the service meets the objective.

This matches research favoring process-oriented worked examples and fading toward the target performance. citeturn174287search0turn174287search5turn174287search11

## 5.5 You Do authenticity

### Strong authentic elements

The final product resembles professional work:

- multiple contexts;
- contracts;
- human oversight;
- security and privacy no-go;
- testing and red team;
- operations and recovery;
- documentation;
- demo;
- oral defense;
- personal attribution.

Authentic assessment guidance emphasizes products and performances that reflect disciplinary and workforce practice. Section 52 is strong at the **specification** level. citeturn174287search2turn174287search10

Stanford CS329S likewise centers stakeholders, deployable/reliable/scalable systems, privacy, fairness, security, and a major final project. citeturn893892search1turn893892search3 Full Stack Deep Learning uses end-to-end labs before a portfolio project and showcases source, reports, and presentations. citeturn893892search0turn893892search2

### Authenticity failure in the harness

The final starter does not actually inspect the product. It inspects learner-populated summaries. Therefore the **task is authentic but the scoring evidence is not**.

## 5.6 Cognitive load and progressive disclosure

### Load-reducing features

- one map before details;
- eight consistent subtopic IDs;
- repeated normal / breach / uncertainty pattern;
- fixed case ID;
- synthetic-only data;
- clear T1–T4 order;
- week ranges;
- explicit artifact names.

### Load-increasing features

- dense English-Spanish code-switching;
- a long opening dictionary with many acronyms;
- repeated gate codes;
- a large starter script shown as one block;
- no downloadable scaffold repository or file tree;
- no intermediate authentic artifacts;
- a huge jump from Boolean dictionaries to enterprise integration;
- no “core / better / best” scope tiers.

Worked examples can reduce cognitive load, but only when they represent the process learners must later perform. citeturn174287search0turn174287search13

## 5.7 Exercise and exam quality

### Exercise strengths

- every visible exercise has stable ID, hints, edge cases, tests text, feedback, starter, and solution;
- valid, adverse, and missing-schema cases are explicit;
- fail-closed behavior is reinforced;
- solution outputs are deterministic;
- privacy and HITL constraints are repeated.

### Exercise weaknesses

- three “levels” mostly differ in branch handling, not task complexity;
- no exercise asks the learner to create or inspect a real capstone artifact;
- no performance task uses multiple prior subtopics;
- the immediate “Ver solución” control can reveal full answers without an attempt record;
- verification text is descriptive rather than run by the exercise UI.

### Assessment strengths

- immediate explanation;
- safety-oriented content;
- final gate awareness;
- public access without requiring an account.

### Assessment weaknesses

- 5/8 subtopic coverage;
- implausible distractors;
- no critical-item enforcement;
- no authentic topic evaluations;
- no public evidence that three parallel variants exist for S52;
- no oral-defense assessment;
- no remediation route after final failure;
- a generic “next section” message in the last section.

The application’s authenticated exam architecture can select one variant per concept and avoid previously used variants, which is a sound platform pattern. fileciteturn32file0L49-L109 But that architecture does not establish that Section 52’s eight concepts and 24 variants are actually loaded, and the public edition still shows only the five-question self-check.

## 5.8 Roadmap and prior-section consistency

### Aligned

- 8 outcomes;
- 8 subtopics;
- 8 I Do demos;
- 24 exercises;
- one final project;
- six contexts;
- 12 capstones;
- eight evidence artifacts;
- CP-N4-C non-compensation;
- synthetic data and human review.

### Misaligned

- 0/4 mounted topic evaluations;
- 5/8 public exam items;
- no explicit CF-1…CF-5 manifest;
- no critical-item gate;
- no A/B/C evidence visible for S52;
- no explicit two-reviewer equivalence process;
- rubric differs from canonical capstone weighting without rationale;
- no accessibility/fairness evidence in final gate;
- no pilot/provisional label despite the roadmap requiring one until empirical timing and item data exist.

## 5.9 External benchmark comparison

| Benchmark | What it does well | S52 comparison |
|---|---|---|
| Stanford CS329S | Project-based, stakeholder-first, deployment, monitoring, reliability, privacy/fairness/security, major final project | S52 aligns strongly in scope and ethics; weaker in real intermediate artifacts and review |
| Full Stack Deep Learning | End-to-end labs precede portfolio project; project feedback and public showcase | S52 has a strong final brief but labs remain predicate repair |
| CS50P final project | Explicit runnable structure, pytest tests, dependency file, README, video, milestone questions | S52 has broader professional evidence but does not execute or verify its own evidence harness citeturn352916search0 |
| CS50 college final project | Proposal, status report, implementation, README, design document, video | S52 lacks formal review checkpoints and scope approval citeturn352916search1 |
| CMU authentic assessment / rubric guidance | Real-world product plus explicit standards of performance | S52’s product is authentic; rubric standards are missing |
| NIST AI RMF / GenAI profile | Lifecycle trustworthiness and risk measurement | S52 has strong risk language but should add direct risk-management evidence and source |
| NIST contingency terminology | Precise RPO/RTO definitions | S52 uses useful but technically incomplete proxies |
| W3C WCAG 2.2 | Current accessibility success criteria | S52 does not preserve CF-5 accessibility as a final gate |

## 5.10 Redaction and technical-writing judgment

The section’s voice is energetic, direct, and appropriate for a demanding final project. Several formulations are memorable and useful, such as:

- “ninguna señal prueba fraude o parentesco”;
- “un PDF de procedimientos sin ejercicio no reduce riesgo”;
- “no se arregla en el consumidor a escondidas”;
- “contribución personal” versus team or template work.

The main editorial problem is not grammar in the narrow sense. It is **terminological saturation**. Too many English nouns are left unintegrated into Spanish syntax. The fix should preserve industry vocabulary while giving each term a stable Spanish anchor.

The title itself should be localized or framed as a product name:

> **Capstone final: plataforma empresarial de inteligencia de relaciones y operaciones**  
> *Enterprise Relationship & Operations Intelligence Platform*

That is clearer than presenting the entire title in English followed by “capstone final.”

---

# 6. Proposed GitHub-style Diffs

These diffs are proposals only. They were not applied.

## Diff 1 — Replace the self-attested readiness gate with a verified graduation manifest

```diff
diff --git a/src/lib/course/sections/s52-career-strategy.ts b/src/lib/course/sections/s52-career-strategy.ts
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@ -1730,6 +1730,30 @@
 artifact_paths: dict[str, str] = {}
-regression_cmd = "python -m pytest tests/ -q"
+checkpoint_manifest = {
+    "sections_passed": 0,
+    "capstones_passed": 0,
+    "checkpoints": {"CF-1": "", "CF-2": "", "CF-3": "", "CF-4": "", "CF-5": ""},
+    "cp_n4c_passed": False,
+    "cp_final_passed": False,
+    "open_p0": None,
+    "open_p1": None,
+    "revision": "",
+}
+regression_result = {
+    "command": "python -m pytest tests/ -q",
+    "exit_code": None,
+    "report_path": "",
+    "critical_failures": None,
+}
+
+from pathlib import Path
+import hashlib
+
+def sha256(path: Path) -> str:
+    digest = hashlib.sha256()
+    with path.open("rb") as fh:
+        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
+            digest.update(chunk)
+    return digest.hexdigest()
+
+def verify_artifact_manifest(paths: dict[str, dict]) -> list[str]:
+    errors = []
+    for name in BUNDLE_8:
+        entry = paths.get(name) or {}
+        path = Path(entry.get("path", ""))
+        if not path.is_file():
+            errors.append(f"missing_file:{name}")
+        elif entry.get("sha256") != sha256(path):
+            errors.append(f"hash_mismatch:{name}")
+    return errors
@@ -1740,10 +1764,32 @@
 def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
     missing = [name for name in REQUIRED if bundle.get(name) is not True]
-    if len(artifact_paths) < 8 or set(BUNDLE_8) - set(artifact_paths):
-        missing.append("evidence_bundle_8_paths")
+    missing.extend(verify_artifact_manifest(artifact_paths))
+
+    if checkpoint_manifest["sections_passed"] != 52:
+        missing.append("sections_not_52_of_52")
+    if checkpoint_manifest["capstones_passed"] != 12:
+        missing.append("capstones_not_12_of_12")
+    if set(checkpoint_manifest["checkpoints"].values()) != {"PASS"}:
+        missing.append("cf1_cf5_not_all_pass")
+    if not checkpoint_manifest["cp_n4c_passed"]:
+        missing.append("cp_n4c_not_passed")
+    if not checkpoint_manifest["cp_final_passed"]:
+        missing.append("cp_final_not_passed")
+    if checkpoint_manifest["open_p0"] != 0 or checkpoint_manifest["open_p1"] != 0:
+        missing.append("open_p0_p1")
+    if not checkpoint_manifest["revision"]:
+        missing.append("unfrozen_revision")
+
+    if regression_result["exit_code"] != 0:
+        missing.append("regression_failed_or_not_run")
+    if regression_result["critical_failures"] != 0:
+        missing.append("critical_regression_failures")
+    if not Path(regression_result["report_path"]).is_file():
+        missing.append("regression_report_missing")
```

## Diff 2 — Use a generic, defensible measurement record and permit honest null results

```diff
diff --git a/src/lib/course/sections/s52-career-strategy.ts b/src/lib/course/sections/s52-career-strategy.ts
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@ -1718,8 +1718,24 @@
-baseline_ttr_min = None
-result_ttr_min = None
+metric_evidence = {
+    "name": "",                       # e.g. ttr_min, review_precision, cost_per_case
+    "direction": "",                  # lower_is_better | higher_is_better | target_range
+    "baseline": None,
+    "result": None,
+    "sample_size": None,
+    "measurement_window": "",
+    "same_workload": False,
+    "uncertainty_method": "",          # bootstrap, repeated runs, CI, etc.
+    "uncertainty": None,
+    "practical_threshold": None,
+    "claim": "",                        # improved | no_measurable_gain | regressed
+    "decision": "",                     # ship | iterate | retain_baseline | no-go
+}
+
+def claim_supported(m: dict) -> bool:
+    required = ("name", "direction", "baseline", "result", "sample_size",
+                "measurement_window", "uncertainty_method", "claim", "decision")
+    if any(m.get(k) in (None, "") for k in required) or not m["same_workload"]:
+        return False
+    observed = (
+        "improved" if (
+            (m["direction"] == "lower_is_better" and m["result"] < m["baseline"])
+            or (m["direction"] == "higher_is_better" and m["result"] > m["baseline"])
+        ) else "no_measurable_gain"
+    )
+    return m["claim"] in {observed, "regressed"} and bool(m["decision"])
@@ -1770,10 +1786,8 @@
-    if baseline_ttr_min is None or result_ttr_min is None:
-        missing.append("ttr_baseline_or_result_missing")
-    elif result_ttr_min >= baseline_ttr_min:
-        missing.append("ttr_no_improvement_vs_baseline")
+    if not claim_supported(metric_evidence):
+        missing.append("unsupported_or_incomplete_metric_claim")
```

And revise T4-A wording:

```diff
-Contrato de honestidad: `result_ttr < baseline_ttr`.
+Contrato de honestidad: el claim debe coincidir con la evidencia.
+Un resultado `no_measurable_gain` o `regressed` puede aprobar si el benchmark
+es comparable, la incertidumbre está documentada y la decisión conserva el
+baseline o declara no-go. Lo que bloquea es la afirmación no sustentada.
```

## Diff 3 — Add an immutable CF-1…CF-5 checkpoint manifest

```diff
@@ -32,6 +32,10 @@
-**Entrada:** artefactos congelados S1–S51, contratos, riesgos, no-go y benchmark.
+**Entrada:** manifest inmutable de CF-1…CF-5 con revisión, fecha, responsable,
+revisor, paths, SHA-256, comandos, resultados e issues; artefactos congelados
+S1–S51; contratos; riesgos; no-go; benchmark.
+
+S52 no reconstruye silenciosamente un checkpoint: si un hash cambió, vuelve al
+owner del CF correspondiente y registra `REOPEN_CF2`…`REOPEN_CF5`.
```

```diff
@@ -174,6 +178,7 @@
       "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
+      "Incluye `checkpoint_manifest.json` con CF-1…CF-5 PASS, paths/hashes y revisores.",
       "Registra riesgo residual, responsable, criterio de rollback, limitaciones y contribución personal.",
```

## Diff 4 — Replace scalar risk and job proxies with traceable records

```diff
@@ -74,11 +74,29 @@
-def revalidate_cf1(stakeholders: set, jobs: int, metrics: set, baseline_frozen: bool) -> str:
-    required_sh = {"ops", "relationship", "privacy"}
-    required_m = {"ttr", "review_precision"}
-    if required_sh <= stakeholders and jobs >= 3 and required_m <= metrics and baseline_frozen:
+def revalidate_cf1(matrix: dict, change_log: list[dict], baseline: dict) -> str:
+    stakeholder_roles = {x["role"] for x in matrix["stakeholders"]}
+    jobs = matrix["jobs_to_be_done"]
+    metric_names = {x["name"] for x in matrix["success_metrics"]}
+    evidence_paths = [x.get("evidence_path") for x in matrix["success_metrics"]]
+    if (
+        {"ops", "relationship", "privacy"} <= stakeholder_roles
+        and len(jobs) >= 3
+        and {"ttr", "review_precision"} <= metric_names
+        and all(evidence_paths)
+        and baseline.get("frozen_revision")
+        and change_log
+    ):
         return "PASS"
     return "REOPEN_CF1"
```

```diff
@@ -104,10 +122,22 @@
-def nogo_ok(constraints: set, risks_with_owner: int, no_go: set, residual_ok: bool) -> bool:
+def nogo_ok(constraints: set, risks: list[dict], no_go: set, acceptance: dict) -> bool:
+    owned = all(r.get("owner") and r.get("threshold") for r in risks)
+    signed = all(
+        acceptance.get(k)
+        for k in ("accepted_by", "reviewed_by", "revision", "accepted_at")
+    )
     return (
         {"synthetic-only", "human-review"} <= constraints
-        and risks_with_owner >= 1
+        and bool(risks)
+        and owned
         and {"real-pii", "auto-risk-decision"} <= no_go
-        and residual_ok
+        and signed
     )
```

## Diff 5 — Make I Do model real artifacts, not only predicates

Representative T2-A replacement:

```diff
@@ -390,18 +390,38 @@
- description: "Demo: seis bounded contexts con contratos versionados y sin DB compartida",
+ description: "Demo: versionar un evento, provocar una ruptura y ejecutar el contract test",
  code: {
    language: 'python',
-   title: "demo_bounded_apis_events.py",
-   code: `REQUIRED = {...}
-...
-print(contract_gate(...))`,
+   title: "demo_contract_test_job_finished.py",
+   code: `import json
+from pathlib import Path
+
+schema = json.loads(Path("events/job.finished.v1.json").read_text())
+producer = json.loads(Path("fixtures/job_finished.valid.json").read_text())
+breaking = json.loads(Path("fixtures/job_finished.breaking.json").read_text())
+
+def validate_required(payload: dict, schema: dict) -> list[str]:
+    return sorted(set(schema["required"]) - payload.keys())
+
+print("valid_missing", validate_required(producer, schema))
+print("breaking_missing", validate_required(breaking, schema))
+assert validate_required(producer, schema) == []
+assert validate_required(breaking, schema) == ["case_id"]
+print("STOP_INTEGRATION_RELEASE")`,
    output: `valid_missing []
 breaking_missing ['case_id']
 STOP_INTEGRATION_RELEASE`,
  },
- why: "Enumera los seis contexts..."
+ why: "Muestra el artefacto versionado, el cambio incompatible, el test que lo
+detecta y la decisión de release. El mapa de seis contexts sigue siendo requisito,
+pero el aprendizaje ya no se reduce a contar nombres."
```

Apply the same pattern to all eight demonstrations:

- T1-A: checkpoint manifest + change log;
- T1-B: risk register + signed no-go;
- T2-A: OpenAPI/event schema + contract test;
- T2-B: end-to-end trace with human decision;
- T3-A: actual test/eval/red-team report aggregation;
- T3-B: drill log with timestamps and achieved objectives;
- T4-A: benchmark report with uncertainty;
- T4-B: evidence manifest with hashes.

## Diff 6 — Rebuild E1/E2/E3 as genuine fading

Representative T2-A exercise family:

```diff
- E1: corrige el Booleano invertido sobre un dict.
- E2: clasifica válido/adverso/missing sobre el mismo dict.
- E3: devuelve CONTINUE/STOP/MAP sobre el mismo dict.
+ E1 guiado: identifica el campo incompatible entre
+ `job.finished.v1.json` y `job.finished.v2.breaking.json`; ejecuta el test dado.
+
+ E2 independiente con andamiaje: completa el validador de compatibilidad,
+ añade el caso de campo opcional y conserva el reporte JSON.
+
+ E3 transferencia: incorpora `case.updated.v1`, escribe su contract test,
+ produce `compatibility_report.json` y justifica si el release continúa.
```

Representative T3-B family:

```diff
+ E1 guiado: calcula RPO alcanzado y tiempo total de recuperación desde un drill log.
+ E2 independiente: repara el script de restore y captura timestamps verificables.
+ E3 transferencia: diseña un segundo escenario, ejecuta el simulacro y emite
+ `PASS`, `NO_GO_RESILIENCE` o `RUN_DISASTER_EXERCISE` con evidencia.
```

## Diff 7 — Mount all four authentic topic evaluations

```diff
@@ -1890,6 +1890,78 @@
   selfCheck: {
     ...
   },
+  topicEvaluations: [
+    {
+      id: "S52-TE1",
+      topic_id: "S52-T1",
+      title: "Revalidación y no-go versionados",
+      subtopics_covered: ["S52-T1-A", "S52-T1-B"],
+      tasks: [
+        {
+          id: "S52-TE1-A",
+          title: "Auditar el delta de CF-1",
+          authentic: true,
+          deliverable: "change_log.md + checkpoint_manifest.json con paths/hashes y baseline congelado",
+        },
+        {
+          id: "S52-TE1-B",
+          title: "Defender el no-go",
+          authentic: true,
+          deliverable: "risk_register.json + no_go.md firmado, con owner, threshold y riesgo residual",
+        },
+      ],
+      rubric_0_3: {
+        correctness: "0 sin contrato; 1 parcial; 2 completo; 3 completo y reconciliado con CF-1",
+        robustness: "0 sin adversos; 1 uno; 2 normal/breach/missing; 3 incluye revisión independiente",
+        maintainability: "0 manual; 1 paths; 2 schema/version; 3 hashes y comando reproducible",
+        responsible_use: "0 auto-riesgo/PII; 1 límites vagos; 2 no-go explícito; 3 owners y trazabilidad",
+      },
+    },
+    {
+      id: "S52-TE2",
+      topic_id: "S52-T2",
+      title: "Integración contractual y HITL",
+      subtopics_covered: ["S52-T2-A", "S52-T2-B"],
+      tasks: [
+        { id: "S52-TE2-A", title: "Contratos entre contexts", authentic: true,
+          deliverable: "OpenAPI/event schemas versionados + contract tests ejecutados" },
+        { id: "S52-TE2-B", title: "Traza HITL", authentic: true,
+          deliverable: "trace de caso con ER→triage→RPA→RAG→human_decides e infers_fraud=False" },
+      ],
+      rubric_0_3: { correctness: "...", robustness: "...", maintainability: "...", responsible_use: "..." },
+    },
+    {
+      id: "S52-TE3",
+      topic_id: "S52-T3",
+      title: "Verificación y recuperación",
+      subtopics_covered: ["S52-T3-A", "S52-T3-B"],
+      tasks: [
+        { id: "S52-TE3-A", title: "Matriz ejecutada", authentic: true,
+          deliverable: "reportes unit/contract/integration/evals/red_team/performance con cero P0/P1" },
+        { id: "S52-TE3-B", title: "Simulacro medido", authentic: true,
+          deliverable: "drill log, recovery point, recovery duration, restore proof y decisión" },
+      ],
+      rubric_0_3: { correctness: "...", robustness: "...", maintainability: "...", responsible_use: "..." },
+    },
+    {
+      id: "S52-TE4",
+      topic_id: "S52-T4",
+      title: "Publicación y defensa",
+      subtopics_covered: ["S52-T4-A", "S52-T4-B"],
+      tasks: [
+        { id: "S52-TE4-A", title: "Claim defendible", authentic: true,
+          deliverable: "benchmark report + guion ≤10 min + contribución personal" },
+        { id: "S52-TE4-B", title: "Bundle verificable", authentic: true,
+          deliverable: "manifest de 8 artefactos con SHA-256 + defensa oral grabada o revisada" },
+      ],
+      rubric_0_3: { correctness: "...", robustness: "...", maintainability: "...", responsible_use: "..." },
+    },
+  ],
```

## Diff 8 — Expand the public self-check to eight items and use plausible distractors

```diff
@@ -183,6 +183,33 @@
       {
+        question: "El registro de riesgos enumera cinco riesgos, pero ninguno tiene owner ni umbral. ¿Qué corresponde?",
+        options: [
+          "Aceptar porque el conteo de riesgos es mayor que cero",
+          "INDEPENDENT_RISK_REVIEW hasta asignar responsables, umbrales y aceptación residual",
+          "DECLARE_NO_GO solo si aparece PII real; la falta de owner no importa",
+          "Convertir los riesgos en comentarios del README sin versionarlos",
+        ],
+        correctIndex: 1,
+        explanation: "T1-B exige evidencia gobernable, no solo un conteo.",
+      },
+      {
+        question: "ER propone un match y triage prioriza el caso; el sistema envía la decisión sin `human_decides`. ¿Qué acción preserva el contrato?",
+        options: [
+          "PASS porque ER y triage ya coincidieron",
+          "BLOCK_AUTOMATED_RISK_DECISION",
+          "REQUEST_HUMAN_REVIEW únicamente si el score es menor que 0.5",
+          "Registrar la decisión humana después del side effect",
+        ],
+        correctIndex: 1,
+        explanation: "La revisión humana debe ocurrir antes de la decisión sensible.",
+      },
+      {
+        question: "Todas las pruebas unitarias pasan, pero red team falla y existe un P1 abierto. ¿Puede promoverse CP-FINAL?",
+        options: [
+          "Sí, porque unit tests pesan más que red team",
+          "Sí, si el P1 está documentado como deuda técnica",
+          "No: BLOCK_FINAL_ON_P0_P1 hasta corregir y conservar la regresión",
+          "Sí, si la demo dura menos de diez minutos",
+        ],
+        correctIndex: 2,
+        explanation: "T3-A exige las seis capas y cero P0/P1.",
+      },
```

Also rewrite existing distractors around realistic failure modes rather than obviously absurd behavior.

## Diff 9 — Add milestone deliverables, review decisions, and remediation loops

```diff
@@ -154,7 +154,31 @@
-      "Hitos 80 h (orientativo): sem. 1–2 ...",
+      "Hito M1 (sem. 1–2): checkpoint_manifest + change_log + risk_register + no_go. Gate: PASS/REVISE/NO_GO por revisor.",
+      "Hito M2 (sem. 3–5): C4 + OpenAPI/event schemas + ≥10 contract tests + trace HITL. Gate: integración reproducible.",
+      "Hito M3 (sem. 6–7): reportes de seis capas + cero P0/P1 + drill log con restore. Gate: calidad y resiliencia.",
+      "Hito M4 (sem. 8–9): benchmark report + bundle con hashes + demo + defensa. Gate: ≥80%, cero falla crítica.",
+      "Cada REVISE registra owner, evidencia faltante, fecha objetivo, comando de retest y criterio de cierre.",
```

Add a learner-visible review record:

```diff
+review_log = [
+    # {
+    #   "milestone": "M1",
+    #   "decision": "REVISE",
+    #   "reviewer": "",
+    #   "issues": [],
+    #   "owner": "",
+    #   "retest_command": "",
+    #   "closed_at": "",
+    # }
+]
```

## Diff 10 — Correct the resilience model and terminology

```diff
@@ -97,10 +97,19 @@
-def resilience(availability, slo, backup_age_h, rpo_h, rollback_min, rto_min, restored):
+def resilience(
+    availability,
+    slo,
+    observation_window,
+    last_committed_at,
+    recovered_to,
+    outage_started_at,
+    service_restored_at,
+    rpo_h,
+    rto_min,
+    restored,
+):
+    achieved_rpo_h = (last_committed_at - recovered_to).total_seconds() / 3600
+    achieved_rto_min = (service_restored_at - outage_started_at).total_seconds() / 60
     ok = (
         availability >= slo
-        and backup_age_h <= rpo_h
-        and rollback_min <= rto_min
+        and bool(observation_window)
+        and achieved_rpo_h <= rpo_h
+        and achieved_rto_min <= rto_min
         and restored
     )
-    return {"ok": ok, "rpo_h": rpo_h, "rto_min": rto_min}
+    return {
+        "ok": ok,
+        "achieved_rpo_h": achieved_rpo_h,
+        "achieved_rto_min": achieved_rto_min,
+        "restore_verified": restored,
+    }
```

Redaction:

```diff
-**RPO/RTO:** Recovery Point/Time Objective (cuánto dato y tiempo puedes perder).
+**RPO (objetivo de punto de recuperación):** punto temporal al que deben
+recuperarse los datos después de una interrupción.
+**RTO (objetivo de tiempo de recuperación):** tiempo total máximo para
+restablecer el servicio antes de afectar el proceso de negocio.
```

## Diff 11 — Make the final rubric criterion-referenced

```diff
@@ -180,12 +180,20 @@
     rubric: [
-      { criterion: "Correctitud del contrato y gate (...)", weight: "25%" },
+      {
+        criterion:
+          "Correctitud y diseño · 3: 52/52, 12/12, CF1–CF5, CP-FINAL y regresión verificados por manifest; 2: completos con una observación no crítica; 1: evidencia parcial; 0: gate auto-declarado o falla crítica",
+        weight: "35%",
+      },
       {
-        criterion: "Pruebas normal/breach/uncertain y recuperación fail-closed",
+        criterion:
+          "Datos y casos borde · 3: normal/breach/missing + benchmark comparable y incertidumbre; 2: cobertura completa con límites menores; 1: cobertura parcial; 0: PII real, leakage o inferencia automática",
         weight: "20%",
       },
-      { criterion: "Seguridad, privacidad...", weight: "15%" },
-      { criterion: "Reproducibilidad...", weight: "15%" },
-      { criterion: "Operación...", weight: "15%" },
+      { criterion: "Pruebas · 3: seis capas, reportes y cero P0/P1; 2: completas sin una capa no crítica; 1: parciales; 0: falla crítica", weight: "15%" },
+      { criterion: "Diseño y trade-offs · 3: ADRs reconciliados y defensa causal; 2: decisiones justificadas; 1: descriptivo; 0: arquitectura no defendible", weight: "10%" },
+      { criterion: "Reproducibilidad · 3: revisión congelada, hashes y un comando; 2: reproducible con ajuste menor; 1: conocimiento tribal; 0: no ejecutable", weight: "10%" },
       { criterion: "Comunicación de trade-offs, límites y contribución personal", weight: "10%" },
     ],
```

Add the gate:

```diff
+    portfolioNote:
+      "Gate: ≥80%, cada criterio crítico ≥2, cero falla crítica de seguridad,
+      privacidad, secretos, SQL inseguro, auto-riesgo o regresión; defensa oral
+      15–20 min con preguntas sobre una decisión, un fallo y una limitación.",
```

## Diff 12 — Localize learner-facing terminology consistently

```diff
- title: "Enterprise Relationship & Operations Intelligence Platform: capstone final",
+ title: "Capstone final: plataforma empresarial de inteligencia de relaciones y operaciones",
- shortTitle: "Capstone FINAL",
+ shortTitle: "Capstone final",
- tagline: "CP-FINAL: integración de 12 capstones, demo reproducible, system card y caso de impacto para CV",
+ tagline: "CP-FINAL: integración de 12 capstones, demostración reproducible, ficha de sistema y caso de impacto para el CV",
```

Representative replacements:

```diff
-portfolio defendible
+portafolio defendible

-system/model cards
+fichas de sistema y de modelo (system/model cards)

-bounded contexts
+contextos delimitados (bounded contexts)

-success metrics
+métricas de éxito

-constraints
+restricciones

-owner
+responsable

-disaster exercise / drill
+simulacro de recuperación

-evidence bundle
+paquete de evidencias

-claims sourced
+afirmaciones respaldadas por fuentes

-trade-offs
+compensaciones de diseño (trade-offs)

-lineage
+linaje

-least privilege
+mínimo privilegio
```

## Diff 13 — Add the missing primary resources

```diff
@@ -1900,6 +1900,34 @@
       {
+        label: "NIST AI RMF 1.0 + GenAI Profile",
+        url: "https://www.nist.gov/itl/ai-risk-management-framework",
+        note: "Riesgo, medición, gobernanza y uso responsable durante el ciclo de vida",
+      },
+      {
+        label: "Model Cards for Model Reporting",
+        url: "https://research.google/pubs/model-cards-for-model-reporting/",
+        note: "Contenido y límites de la ficha de modelo",
+      },
+      {
+        label: "OpenAPI Specification",
+        url: "https://spec.openapis.org/oas/latest.html",
+        note: "Contratos HTTP versionados entre contextos",
+      },
+      {
+        label: "AsyncAPI Specification",
+        url: "https://www.asyncapi.com/docs/reference/specification/latest",
+        note: "Contratos versionados de eventos",
+      },
+      {
+        label: "W3C WCAG 2.2",
+        url: "https://www.w3.org/TR/WCAG22/",
+        note: "Preservar la accesibilidad congelada en CF-5 durante la integración final",
+      },
+      {
+        label: "Stanford CS329S — Machine Learning Systems Design",
+        url: "https://stanford-cs329s.github.io/",
+        note: "Benchmark de proyecto: stakeholders, despliegue, fiabilidad y trade-offs",
+      },
```

## Diff 14 — Give Section 52 a real completion state in the UI

```diff
diff --git a/src/components/course/SectionView.tsx b/src/components/course/SectionView.tsx
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -715,7 +715,18 @@
-      <MarkDoneButton onDone={onDone} done={done} label="Proyecto enviado a mi GitHub" />
+      {section.index === 52 ? (
+        <Callout type="warning" title="La promoción no es un checkbox">
+          El proyecto queda como <strong>EVIDENCE_READY</strong> cuando adjuntas
+          manifest, regresión y bundle. La promoción a <strong>PASSED</strong>
+          requiere aplicar la rúbrica y registrar la defensa técnica.
+        </Callout>
+      ) : (
+        <MarkDoneButton onDone={onDone} done={done} label="Proyecto enviado a mi GitHub" />
+      )}
@@ -815,7 +826,11 @@
-        Active recall: ... Si sacas 70% o más, desbloqueas la siguiente sección.
+        {section.index === 52
+          ? 'Active recall: contesta sin mirar la teoría. Este autocheck no sustituye el CP-FINAL, la regresión ni la defensa.'
+          : 'Active recall: contesta sin mirar la teoría. Si sacas 70% o más, desbloqueas la siguiente sección.'}
```

## Diff 15 — Preserve backward compatibility while fixing the stale route ID

```diff
diff --git a/src/lib/course/sections/s52-career-strategy.ts b/src/lib/course/sections/s52-capstone-final.ts
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-capstone-final.ts
@@ -3,7 +3,7 @@
 export const section52: CourseSection = {
-  id: "career-strategy",
+  id: "capstone-final",
```

```diff
diff --git a/src/app/page.tsx b/src/app/page.tsx
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -40,6 +40,10 @@
 const LEGACY_SECTION_ALIASES: Record<string, string> = {
+  "career-strategy": "capstone-final",
 }
```

---

# 7. Recommended Priority Order for Fixing

## Release-blocking sequence

### Priority 1 — Make graduation evidence executable

Fix Issues **1, 2, 5, and 18** first.

Deliverables:

- verified graduation manifest;
- CF-1…CF-5 immutable evidence;
- actual artifact existence and hashes;
- executed regression report;
- explicit zero P0/P1;
- CP-N4-C and CP-FINAL independence;
- non-clickable final promotion state.

**Reason:** Until this is fixed, Section 52 can falsely report completion.

### Priority 2 — Repair assessment validity

Fix Issues **10, 11, 12, and 13**.

Deliverables:

- four authentic topic evaluations;
- eight public assessment items;
- three variants per subtopic in the bank;
- plausible distractors;
- critical-item rules;
- criterion-referenced capstone and defense rubric;
- remediation / resubmission path.

**Reason:** The current assessment under-samples the curriculum and cannot reliably distinguish mastery.

### Priority 3 — Rebuild the instructional bridge

Fix Issues **6, 7, 8, and 9**.

Deliverables:

- process-oriented I Do artifacts;
- authentic E1/E2/E3 fading;
- milestone deliverables and reviews;
- real contract, trace, eval, DR, and manifest tasks.

**Reason:** The learner currently jumps from Boolean repair to enterprise integration.

### Priority 4 — Correct measurement and reliability semantics

Fix Issues **3, 4, 14, and 15**.

Deliverables:

- generic metric evidence;
- honest null/negative result path;
- sample/window/uncertainty requirements;
- correct RPO/RTO measurements;
- availability observation window and error-budget evidence.

**Reason:** The current gate can reward cherry-picking and teach imprecise reliability concepts.

### Priority 5 — Preserve responsible-AI and accessibility lineage

Complete Issue **5** with explicit:

- CF-5 manifest validation;
- WCAG 2.2 evidence;
- contestability and appeal check;
- system/model-card reconciliation;
- human-approval trace.

**Reason:** Final integration must not silently drop upstream governance controls.

### Priority 6 — Redaction, resources, and semantic polish

Fix Issues **16, 17, 19, and 20**.

Deliverables:

- localized title and stable Spanish terminology;
- route alias migration;
- primary resources for cards, APIs/events, AI RMF, and WCAG;
- remediation protocol attached to every block code.

**Reason:** These changes improve cognitive accessibility and professional finish after the gate is trustworthy.

---

# 8. Graph Memory Update Notes

## Canonical Section 52 node

```yaml
section: 52
source_file: src/lib/course/sections/s52-career-strategy.ts
source_sha: 8d056386bd4641dc2400dac5363ea3ac1e0a110a
live_route: "#career-strategy"
declared_hours: 80
level: Master
capstone: CP-FINAL
score_current_audit: 6.4
release_recommendation: PROVISIONAL_BLOCKED
```

## Confirmed strong nodes

```yaml
strengths:
  - six_bounded_contexts_including_relationship
  - hitl_before_sensitive_decision
  - no_match_equals_fraud
  - synthetic_only_data
  - eight_artifact_bundle
  - six_verification_layers
  - zero_open_p0_p1_intent
  - measured_recovery_intent
  - personal_contribution_disclosure
  - cp_n4c_non_compensation
  - clear_t1_to_t4_narrative
  - 8_ido_demos_present
  - 24_exercises_present
```

## Critical unresolved nodes

```yaml
critical:
  - id: S52-GATE-EXEC
    issue: readiness_does_not_verify_headline_gate
    edges_missing:
      - 52_of_52_to_readiness
      - 12_of_12_to_readiness
      - cf1_cf5_to_readiness
      - cp_final_to_readiness
      - zero_p0_p1_to_readiness
      - regression_exit_to_readiness
  - id: S52-EVIDENCE-VERIFY
    issue: labels_and_strings_substitute_for_files_hashes_and_execution
  - id: S52-COMPLETION-HARNESS
    issue: public_ui_can_self_mark_final_project_complete
```

## High-priority pedagogical nodes

```yaml
pedagogy:
  - id: S52-IDO-AUTHENTICITY
    issue: demos_model_predicates_not_system_procedure
  - id: S52-WEDO-FADING
    issue: 24_exercises_repeat_flat_dict_gate_repair
  - id: S52-TRANSFER-GAP
    issue: abrupt_jump_to_80_hour_platform
  - id: S52-MILESTONE-FEEDBACK
    issue: schedule_without_reviewable_gates_or_remediation
```

## Assessment nodes

```yaml
assessment:
  topic_evaluations_expected: 4
  topic_evaluations_mounted: 0
  subtopics_expected: 8
  public_selfcheck_items: 5
  directly_missing:
    - S52-T1-B
    - S52-T2-B
    - S52-T3-A
  rubric_issue: weights_without_performance_descriptors_or_critical_floor
  distractor_issue: low_plausibility
```

## Technical-accuracy nodes

```yaml
technical:
  - forced_positive_improvement_claim
  - hardcoded_ttr_despite_generic_metric_promise
  - benchmark_without_sample_window_or_uncertainty
  - rpo_modeled_as_backup_age
  - rto_modeled_as_rollback_duration
  - slo_without_observation_window_or_error_budget
  - checkpoint_lineage_cf2_cf5_not_verified
```

## Redaction and meta nodes

```yaml
redaction:
  hard_meta_leak_found: false
  semantic_residue:
    - career-strategy_route_id
  language_load:
    - excessive_english_nouns_without_spanish_anchor
    - portfolio_vs_portafolio_inconsistency
    - awkward_senior_master_phrase
```

## Fixer guardrails

1. Preserve the six-context architecture and `relationship`.
2. Preserve eight evidence artifacts; do not regress to six.
3. Preserve synthetic-only data and explicit HITL.
4. Preserve normal / breach / uncertainty distinctions.
5. Do not replace fail-closed gates with warnings.
6. Do not force a positive benchmark outcome.
7. Do not let a Boolean, screenshot, filename, or non-empty command stand in for evidence.
8. Keep CP-N4-C independently graded.
9. Add CF-1…CF-5 immutable lineage rather than only revalidating CF-1.
10. Keep the public section usable without an account, but distinguish reading progress from Master promotion.
11. Treat the older Explorer report as historical regression evidence, not current source truth.
12. After fixes, rerun a Section 52-only Explorer audit and verify the live hash route, public quiz, topic evaluations, and completion state.

**This is the complete Explorer report for Section 52. Ready for the Fixer prompt.**
