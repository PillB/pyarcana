# Explorer Report — Section 47

## 1. Section Identification & Scope

**Assigned scope:** Section 47 only.

**Current live identity**

- **Live title:** *MLOps: experimentos, registro y serving*
- **Short title:** *MLOps serving*
- **Level:** Master
- **Estimated duration:** 20 hours
- **Capstone/checkpoint:** CP-N4-B + CF-4
- **Current source:** `src/lib/course/sections/s47-opensource.ts`
- **Current public section ID/hash:** `opensource`
- **Canonical scenario:** `CASO-TAC-047`, a synthetic prioritisation model for a fictitious organisation in Tacna.

The live course card presents Section 47 as “MLOps serving” and describes an experiment-to-service platform with gates, lineage, rollback and CF-4. The canonical source confirms the full title, 20-hour estimate, Master level and eight learning outcomes.

The audit covered:

- The rendered live course card and navigation context.
- All eight theory subtopics.
- The eight I Do demonstrations.
- The 24 We Do exercises: guided, nominally independent and transfer.
- The You Do portfolio project, starter code, rubric and acceptance requirements.
- The eight visible self-check questions.
- The authenticated exam architecture: three attempts, one variant per concept per attempt and avoidance of previously used variants.
- Current course-state and capstone ledgers.
- The stale roadmap that still identifies S47 as “Open Source & Community”.
- Current primary documentation for MLflow, KServe, Feast, Google production ML guidance, NIST AI RMF and model cards.
- Programming-pedagogy research on worked examples, fading and active/constructive learning.

The previous reports were used only as a reference for the requested reporting structure, not as evidence about Section 47.

**Access limitation:** The live site is a client-rendered single-page application. Its public card and routing shell were directly inspected, but the browser text extractor did not expose every tab’s dynamically mounted body. Therefore, the exact learner-facing tab content was audited through the current canonical source and the actual `SectionView` renderer, which maps theory, I Do, We Do, You Do and quiz data into the visible interface.

---

## 2. Executive Summary of Quality

### Overall score: **6.4/10**

**Verdict:** Section 47 has a strong curricular skeleton, unusually good traceability and responsible fail-closed framing, but it is not yet credible as a Master-level MLOps section. A critical technical-freshness problem, an extensive authenticity gap and highly templated practice prevent the section from delivering what its title, 20-hour estimate and capstone gate promise.

### Dimension scores

| Dimension | Score | Verdict |
|---|---:|---|
| Technical currency | 4.0/10 | The registry workflow is built around deprecated MLflow stages. |
| Conceptual coverage | 8.0/10 | The lifecycle from run tracking to rollback is broad and logically ordered. |
| I Do / We Do / You Do fidelity | 6.5/10 | The phases exist, but fading and responsibility transfer are weak. |
| Authentic MLOps practice | 4.0/10 | Most practice reduces production operations to small Boolean predicates. |
| Cognitive-load design | 6.5/10 | Good lifecycle sequencing, but dense jargon and excessive repetitive volume. |
| Exercises and assessment | 6.0/10 | Complete counts and fail-closed cases, but limited construct depth. |
| Spanish redaction and editorial polish | 6.0/10 | Understandable, but heavily hybridised and occasionally exposes internal implementation language. |
| Safety, privacy and governance | 8.5/10 | Strong synthetic-data constraints, human-review framing and audit-preservation principles. |
| Roadmap and repository consistency | 4.5/10 | Live title, route, filename, ledger and roadmap disagree. |
| Portfolio value | 5.0/10 | The project brief is promising, but its scaffold cannot produce the declared deployable platform without a major unsupported leap. |

### Principal strengths to preserve

1. **The lifecycle is coherent.** T1 tracking and comparison lead to T2 registry and cards, then T3 serving readiness, then T4 canary and rollback. The transition from S46 data lineage to S47 model lineage is explicitly stated.

2. **The section distinguishes breach from missing evidence.** Actions such as `INVALIDATE_COMPARISON`, `STOP_CANARY` and `ROLLBACK_TO_LAST_GOOD` are separated from evidence-recovery actions such as `RESTORE_LINEAGE`, `COMPLETE_MODEL_CARD` and `COLLECT_MORE_SHADOW_EVIDENCE`.

3. **Safety language is responsible.** The section repeatedly states that the scenario is synthetic, contains no PII and does not establish fraud, kinship or wrongdoing.

4. **Traceability is excellent.** Eight outcomes map to eight subtopics, eight demos and 24 exercises. The course ledger records those counts, and S47 is correctly marked as the CP-N4-B and CF-4 gate in the current capstone ledger.

5. **The project has a useful governance rubric.** Correctness, recovery, privacy, reproducibility, operations and communication all receive explicit weights.

### Principal blockers

- MLflow’s `None → Staging → Production` model stages are taught as the recommended present-day registry workflow even though MLflow officially deprecated model stages and recommends aliases, tags and environment-oriented workflows instead.
- The section claims a “Production Data/ML Platform”, but its demonstrations and practice rarely manipulate real runs, model artefacts, registry versions, serving requests, monitoring output or deployment configuration.
- Twenty-four exercises largely repeat one syntactic transformation: correct an inverted Boolean predicate and classify valid/adversarial/missing fixtures.
- The public ID remains `opensource`, the source filename remains `s47-opensource.ts`, and the roadmap still says S47 is “Open Source & Community”.
- The You Do requirements are substantially broader than the provided starter code.

---

## 3. Detailed Issue Registry

### Issue 1 — Deprecated MLflow stages taught as the canonical workflow

**Severity:** Critical  
**Type:** Technical accuracy / curricular freshness

**Evidence**

The learning outcomes say:

> “Promover un modelo a Staging solo con firma compatible, stage correcto y aprobación explícita.”

The opening dictionary presents:

> “Model registry stage: None → Staging → Production.”

T2-A requires `stage == "staging"` and treats `production` as the next governed state.

MLflow’s current official guidance states that model stages are deprecated. The recommended approach uses model aliases such as `champion` or `challenger`, tags such as validation status, and separate registered models or environments when stronger isolation is required.

**Pedagogical impact**

This is not a minor API-name discrepancy. Registry governance is one of the section’s eight core outcomes and occupies an entire subtopic, three exercises, self-check content and the capstone project. Learners can finish S47 with a mental model that is already being removed from the principal tool cited by the course.

The problem is especially serious at Master level because learners are expected to make architecture and release-management decisions rather than merely recognise historical terminology.

**Required correction**

Teach aliases, tags, version metadata and environment boundaries as the default modern model. Stages may be mentioned only in a labelled historical/legacy note.

---

### Issue 2 — Public identity and route still expose the obsolete “opensource” taxonomy

**Severity:** High  
**Type:** Meta-configuration leakage / navigation consistency

**Evidence**

The current object declares:

```ts
id: "opensource",
title: "MLOps: experimentos, registro y serving",
shortTitle: "MLOps serving",
```

The file is still named `s47-opensource.ts`, and `index.ts` imports that historical path.

The routing shell resolves URL fragments by exact `section.id` and writes the same ID back to the URL. Therefore, the public MLOps lesson is shared under the semantically incorrect `#opensource` fragment.

The current course-state ledger likewise stores:

```json
{
  "id": "S47",
  "section_id": "opensource"
}
```

**Pedagogical and product impact**

- Learners cannot infer the lesson topic from its URL.
- Search, analytics, progress storage and future migrations retain the wrong concept label.
- Contributors may edit the wrong curriculum node.
- External links claiming to point to an “opensource” section now open an MLOps lesson.
- Automated agents can mistake the historical ID for the current pedagogical topic.

**Required correction**

Introduce `mlops-serving` as the canonical ID and preserve `opensource` only as a redirect and progress-key migration alias.

---

### Issue 3 — The roadmap and state ledgers contradict the live curriculum

**Severity:** High  
**Type:** Roadmap alignment / source-of-truth integrity

**Evidence**

The live section is S47 “MLOps serving”, 20 hours, Master. The older `learning_roadmap.md` still states:

> “47 | Open Source & Community | 10h | Production-Grade OSS Package”

It also preserves the sequence “GPU Computing → Open Source → AI Governance”.

The section ledger declares `state: "passed"` and `phase_detail: "PHASE_6_PASSED"`, while its note simultaneously says:

> “PHASE 4 complete; exam+P6 pending | V3 section close wave complete”

The current capstone ledger correctly describes S47 as CP-N4-B “Production Data/ML Platform”, with required CI/CD, orchestration, registry, serving and rollback.

**Pedagogical impact**

Curriculum alignment cannot be audited reliably when three official-looking artefacts disagree. Prerequisites, expected artefacts and neighbouring-section transitions become dependent on whichever file an agent happens to read.

This undermines the graph-engineering requirement because the S47 node has incompatible labels and edges.

**Required correction**

Designate one versioned roadmap as authoritative, update S47 in all derived ledgers, and remove contradictory completion notes.

---

### Issue 4 — Master-level MLOps is represented mainly as Boolean policy simulation

**Severity:** High  
**Type:** Authentic assessment / construct underrepresentation

**Evidence**

The introduction explicitly says:

> “Los demos usan stdlib al estilo MLflow/registry.”

It later reiterates:

> “Stack didáctico: stdlib que modela contratos al estilo MLflow/registry sin cluster GPU ni servicios externos obligatorios.”

The demonstrations compute predicates such as:

```python
return stage == "staging" and approved and sig_ok
```

```python
return batch == online and not leakage and tests >= 3
```

```python
return p95 <= slo and 1 <= batch <= 64 and fallback.startswith("rules-") and tested
```

The capstone ledger, however, requires actual CI/CD, orchestration, registry, serving and rollback evidence. CF-4 further requires deployable architecture, lineage, SLO, rollback and supply-chain evidence.

Official production-ML guidance treats MLOps as an integrated system involving data and model validation, pipelines, continuous integration, delivery, training, serving and monitoring—not merely policy checks over dictionaries.

**Pedagogical impact**

The exercises measure whether learners can reconstruct a Boolean expression from prose. They do not establish that learners can:

- Start and inspect a tracked run.
- Log a dataset, parameters, metrics and artefacts.
- Register a model version.
- Assign or move an alias.
- Serve a prediction endpoint.
- measure request latency.
- Compare online and offline feature output.
- Read canary metrics.
- Perform or simulate a deployment rollback.
- Produce an auditable release record.

The section therefore underrepresents the target construct.

**Required correction**

Keep small predicates as pre-training, but add a real local MLOps vertical slice using a local MLflow database/server, a tiny model, an input example/signature, a local inference endpoint and a scripted rollback decision. No cloud account or GPU is necessary.

---

### Issue 5 — Twenty-four exercises repeat one template instead of fading support

**Severity:** High  
**Type:** Gradual release / exercise diversity

**Evidence**

The We Do introduction states that the 24 challenges follow a regular sequence:

- E1 repairs a domain operation.
- E2 separates valid, invalid and missing.
- E3 demonstrates fail-closed recovery.

Across subtopics, the pattern remains almost identical:

1. A starter contains an inverted Boolean predicate.
2. The learner receives the exact expected output.
3. The learner replaces the predicate.
4. The next task wraps it in `assess()`.
5. The third wraps the same rule in `decide()`.
6. The fixtures remain valid/adversarial/missing in the same order.

For example, T4-B’s nominal “transfer” task still supplies all required fields, route names, expected ordering and decision vocabulary.

Research on programming worked examples supports guided examples, but stronger transfer generally requires fading completion support and increasing problem variability. Merely renaming near-identical tasks “independent” or “transfer” does not create genuine transfer.

**Pedagogical impact**

Learners can infer the meta-rule:

> “E1 invert the comparison; E2 check missing then copy the corrected predicate; E3 return the named recovery action.”

That becomes easier than reasoning about MLOps. Performance may therefore reflect template recognition rather than conceptual mastery.

Under the ICAP framework, much of this work remains active manipulation rather than constructive or interactive knowledge generation.

**Required correction**

Use different artefact types and cognitive operations:

- Diagnose an MLflow run table.
- Complete a model card.
- Compare two lineage manifests.
- Write contract tests.
- Interpret a latency histogram.
- Analyse a canary incident timeline.
- Edit a deployment manifest.
- Produce a rollback decision record.

E3 should remove most scaffolding and change context, data representation or failure combination.

---

### Issue 6 — The You Do starter is materially narrower than its requirements

**Severity:** High  
**Type:** Project scaffolding / constructive alignment

**Evidence**

The project requirements demand:

- Reproducible tracking of baseline and candidate.
- Registry with signature, card and approvals.
- Batch/online parity and fallback.
- Shadow/canary, monitoring hooks, rollback and retirement.
- Local reproducible commands and fixed dependencies.
- Residual risk, owner, rollback criteria and known limitations.

The starter supplies only five small functions:

- `log_run`
- `can_promote`
- `feature_parity`
- `canary_ok`
- `rollback_ready`

It does not scaffold:

- Dataset, code and environment lineage.
- Candidate-versus-baseline comparison.
- An artefact digest.
- A model card.
- Model version or alias metadata.
- A serving interface.
- p95 measurement or batching.
- A structured fallback.
- Quality delta.
- Retirement ownership.
- CI/CD or orchestration.
- Dependency locking.
- Evidence serialisation.

**Pedagogical impact**

The project moves directly from tiny predicates to a platform-grade artefact. This is not productive struggle; it is an unscaffolded change of task class.

Students can either submit the small dictionary exercise—which fails the capstone intent—or invent a complete architecture not taught by the section.

**Required correction**

Provide an intentionally incomplete but coherent repository scaffold containing:

- `runs.py`
- `registry.py`
- `features.py`
- `serving.py`
- `rollout.py`
- `evidence.py`
- `tests/`
- `requirements.lock` or `pyproject.toml`
- A sample model card and release manifest
- Explicit acceptance commands and outputs

---

### Issue 7 — The project’s breach aggregation masks simultaneous failure

**Severity:** High  
**Type:** Technical logic / auditability

**Evidence**

The starter creates a breach where both canary and rollback readiness are false:

```python
breach = {
    "canary": canary_ok("full", 100, 0.1, 0.01, False),
    "rollback": rollback_ready(
        "1.2.0", "1.1.0", False, False, set(), False
    ),
}
```

It then reports:

```python
breach_action = (
    "STOP_CANARY"
    if not breach["canary"]
    else "ROLLBACK_TO_LAST_GOOD"
)
```

Because `breach["canary"]` is false, the second failure is never surfaced.

**Technical impact**

This contradicts the stated emphasis on audit trails. A failed canary combined with an unavailable or unsafe rollback is more severe than a failed canary alone.

The current code collapses a compound incident into one action and may imply that rollback readiness is acceptable when it is not.

**Required correction**

Collect all failed gates and distinguish:

- Stop new traffic.
- Restore or identify last-known-good.
- Escalate when rollback itself is unavailable.
- Preserve the complete incident evidence.

---

### Issue 8 — Canary evidence is too thin to support promote/stop decisions

**Severity:** High  
**Type:** Operational realism / statistical validity

**Evidence**

The canary contract checks:

- mode
- traffic percentage
- quality delta
- error rate
- hooks

A canary passes if traffic is at most 10%, quality and errors remain under thresholds and hooks are enabled.

Missing elements include:

- Minimum observation count.
- Minimum observation duration.
- Baseline pairing.
- Confidence or uncertainty.
- Latency evidence within the canary decision itself.
- Segment-level degradation.
- Data-drift window.
- Consecutive-window requirements.
- Rollout step schedule.

KServe’s current canary workflow treats traffic splitting as a deployment mechanism, but promotion still depends on observed evidence and explicit revision handling. Google’s production guidance recommends monitoring model quality, training-serving skew, API latency percentiles, query rates and operational health over time.

**Pedagogical impact**

Students may internalise “5% traffic + one quality number + hooks=True” as adequate evidence. The section discusses monitoring hooks but does not teach how much evidence is enough to act.

**Required correction**

Add observation-window and sample-size requirements, baseline-relative metrics and at least one sliced metric. Missing statistical evidence should route to continued shadow observation, not promotion.

---

### Issue 9 — The fallback rule contradicts the theory and overfits one string prefix

**Severity:** Medium–High  
**Type:** Internal consistency / domain modelling

**Evidence**

The theory correctly says a fallback may be:

> “reglas o modelo previo menos capaz”

The implementation accepts only strings beginning with `rules-`:

```python
fallback.startswith("rules-")
```

A valid previous-model fallback such as `model:ranker-1.1.0` would fail.

**Pedagogical impact**

The code teaches an accidental naming convention as though it were the safety property. The safety property should be typed identity, compatibility and successful testing, not a specific string prefix.

**Required correction**

Represent fallback as structured data:

```python
{
    "kind": "rules" | "model",
    "ref": "...",
    "compatible": True,
    "tested": True
}
```

---

### Issue 10 — Model-card validation checks headings rather than evidence quality

**Severity:** Medium–High  
**Type:** Governance depth / documentation quality

**Evidence**

T2-B considers a card sufficient when its set contains:

```python
{"use", "limits", "metrics", "risks"}
```

The foundational model-cards work describes documentation that communicates intended uses, evaluation procedures and performance across relevant conditions and groups, not merely the presence of four labels.

**Missing instructional elements**

- Model owner and reviewer.
- Model and dataset versions.
- Intended users and affected users.
- Out-of-scope uses.
- Evaluation dataset.
- Threshold or calibration decision.
- Slice performance.
- Known limitations.
- Ethical and safety considerations.
- Update and retirement policy.

**Pedagogical impact**

A learner can satisfy the gate with:

```python
{"use", "limits", "metrics", "risks"}
```

without writing any meaningful content.

**Required correction**

Validate meaningful non-empty sections and require at least one slice metric, one prohibited use, one owner and one version reference.

---

### Issue 11 — Reproducibility is reduced to one seed and one close metric

**Severity:** Medium–High  
**Type:** Scientific validity / conceptual precision

**Evidence**

T1-A defines reproducibility as:

- seed present
- params non-empty
- one rerun metric within tolerance

T1-B later adds data, code and environment lineage, which improves the overall sequence, but the first subtopic repeatedly labels its smaller predicate “reproducibility”.

MLflow can track run parameters, metrics, artefacts, code and datasets, including dataset source and digest. Production ML guidance also emphasises deterministic configuration, versioned code and compatibility tests.

**Pedagogical impact**

A close metric from one rerun is necessary evidence but not a full reproducibility claim. Learners are not taught to distinguish:

- **Repeatability:** same setup, same team/environment.
- **Reproducibility:** independently reconstructable from captured inputs and environment.
- **Robustness:** stable across legitimate stochastic variation.

**Required correction**

Rename the local predicate “repeatability check” and reserve “reproducible run package” for the combined T1-A/T1-B artefact.

---

### Issue 12 — Approval is represented as an unauditable Boolean

**Severity:** Medium–High  
**Type:** Governance / separation of duties

**Evidence**

T2-A checks only:

```python
approved: bool
```

and the project repeats the same pattern.

No approver identity, role, timestamp, evidence reference, decision reason or separation from the model author is required.

NIST AI RMF emphasises governance across the lifecycle and accountable management of AI risks. Its current functions remain Govern, Map, Measure and Manage.

**Pedagogical impact**

Learners may equate governance with flipping a Boolean. This is precisely the superficial behaviour the section warns against in its portfolio note.

**Required correction**

Use an approval record with:

- `approved_by`
- `approver_role`
- `approved_at`
- `evidence_ref`
- `decision`
- `reason`
- optional separation-of-duties check

---

### Issue 13 — The opening glossary compresses too many advanced constructs

**Severity:** Medium  
**Type:** Cognitive load / progressive disclosure

**Evidence**

The first paragraph asks learners to process all of the following before T1:

- Experiment run
- Lineage
- Registry stages
- Model card
- Feature consistency
- Shadow/canary
- Fallback
- Retirement

It combines Spanish explanation with English terminology and several lifecycle relationships in a single dense paragraph.

**Pedagogical impact**

The T1→T4 ordering is good, but the opening front-loads terminology that will not become meaningful until later. This creates avoidable extraneous load.

**Required correction**

Replace the paragraph with a lifecycle diagram or four-row route table. Define T1 terms first and progressively introduce later terminology at the point of use.

---

### Issue 14 — Learner-facing code exposes internal content-schema language

**Severity:** Medium  
**Type:** Meta-text leakage

**Evidence**

Many starter files include:

> `# Contrato: corrige el DEFECT; salida alineada a solutionCode`

The identifier `solutionCode` is a property in the curriculum data schema, not an MLOps or Python concept.

The I Do introduction says:

> “no imprime literales precomputados”

This reads like a harness-validation requirement rather than guidance a learner needs.

The portfolio note says:

> “no pases a READY solo flipando flags sin evidencia.”

**Pedagogical impact**

- `solutionCode` reveals the course implementation.
- “precomputed literals” addresses automated auditing rather than model understanding.
- “flipando flags” is informal hybrid phrasing and inconsistent with the otherwise professional register.

**Required correction**

Replace internal language with learner-relevant acceptance criteria.

---

### Issue 15 — Excessive and inconsistent English hybridisation

**Severity:** Medium  
**Type:** Peruvian Spanish redaction / technical writing

**Evidence**

The section frequently uses:

- experiment run
- params
- metrics
- dataset version
- intended use
- feature consistency
- train/serve
- shadow/canary
- fallback
- retirement
- approve
- promote
- breach
- missing
- trace
- last-good
- stdlib
- “un dict”

**Editorial assessment**

Many English terms are legitimate MLOps vocabulary and should not be forcibly translated. The problem is inconsistent introduction and grammatical integration.

For example:

- “promote” is used as a noun-like decision.
- “approve” alternates with “aprobación”.
- “retirement” appears without a stable Spanish explanation.
- “stdlib” is less accessible than “biblioteca estándar”.
- “un dict” is informal compared with “un diccionario”.

**Pedagogical impact**

Learners must decode both the domain concept and a shifting bilingual register. This is construct-irrelevant linguistic load.

**Required correction**

Introduce each professional English term once with a Spanish explanation, then use one stable form:

> “despliegue canario (*canary deployment*)”

> “versión de reserva (*fallback*)”

> “retiro de versión (*model retirement*)”

---

### Issue 16 — Self-check questions emphasise recognition over application

**Severity:** Medium  
**Type:** Assessment validity

**Evidence**

The eight visible self-check items mostly ask the learner to select a directly stated rule:

- What evidence approves tracking?
- What action preserves safety?
- What demonstrates the gate?
- Which treatment respects synthetic scope?
- What happens without approval?
- When is serving disabled?
- What happens at 100% traffic without hooks?
- What is missing from a weak artefact?

The authenticated exam platform itself is well designed operationally: it permits a maximum of three attempts, groups questions by concept, selects one unused variant per concept and shuffles them.

Repository history also records an exam-bank and runtime audit covering all sections.

However, the exact wording of S47’s 24 authenticated variants could not be independently inspected during this run. Therefore, the assessment finding applies directly to the eight visible self-check questions; authenticated-variant equivalence remains **not independently verified**.

**Pedagogical impact**

The visible questions can be answered by phrase matching. None requires the learner to:

- Read a run manifest.
- Calculate a metric delta.
- Identify incomplete lineage.
- Analyse a compound deployment failure.
- Interpret latency or canary evidence.
- Choose among several plausible release actions.

**Required correction**

Replace at least half the visible questions with short scenario, trace-reading or calculation items.

---

### Issue 17 — Dense fixtures and long instructions reduce readability and accessibility

**Severity:** Medium  
**Type:** Accessibility / mobile usability / technical presentation

**Evidence**

Many fixtures are written as single long lines:

```python
record = {"case_id": "CASO-TAC-047-4B", **{
    "current":"1.2.0","last_good":"1.1.0",
    ...
}}
```

In the actual source, several remain physically compressed into one line. Exercise headers also contain full input schemas, expected outputs and future-task references in one long sentence.

The UI itself has responsive navigation and collapsible solutions, which is a positive accessibility feature.

**Pedagogical impact**

- Horizontal scanning is harder on smaller screens.
- Differences between valid and adversarial fixtures are visually concealed.
- Learners spend effort parsing punctuation rather than reasoning about gates.
- Long exercise titles weaken the visual hierarchy.

**Required correction**

Use multiline dictionaries, diff-style fixture comparisons and separate “Input”, “Task”, “Expected evidence” and “Failure route” labels.

---

## 4. Meta-Leak Report

### Confirmed learner-visible or public-facing leaks

| ID | Exact text or configuration | Location | Classification | Action |
|---|---|---|---|---|
| M1 | `id: "opensource"` | Section object and public hash | Historical taxonomy leak | Migrate to `mlops-serving`; retain redirect. |
| M2 | `s47-opensource.ts` | Repository filename | Historical implementation drift | Rename file and update import. |
| M3 | `salida alineada a solutionCode` | Repeated starter-code comments | Internal schema leak | Replace with domain-specific expected behaviour. |
| M4 | `no imprime literales precomputados` | I Do introduction | Harness/auditor language | Replace with an explanation of computed evidence. |
| M5 | `no pases a READY solo flipando flags` | Portfolio note | Internal state vocabulary plus editorial register mismatch | Replace with measurable release criteria. |
| M6 | “Open Source & Community” for S47 | `learning_roadmap.md` | Stale curriculum identity | Update roadmap to current MLOps scope. |
| M7 | `exam+P6 pending` beside `PHASE_6_PASSED` | Section ledger note | Internal state contradiction | Regenerate or correct ledger note. |

### Intentional traceability markers that should **not** be removed

The following are not leaks:

- `S47-T1-A` through `S47-T4-B`
- `CP-N4-B`
- `CF-4`
- `CASO-TAC-047`
- Named failure actions such as `STOP_CANARY`

These identifiers provide useful graph traceability and should remain, provided the learner is given a concise legend.

### Negative finding

No explicit `TODO`, `FIXME`, hidden AI-to-developer instruction or “moved from Section X” note was found in the current S47 content.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Narrative and connective tissue

The section’s strongest feature is its macro-sequence:

1. Establish trustworthy run evidence.
2. Compare candidate and baseline.
3. Register a governed artefact.
4. Validate train/serve consistency.
5. Establish serving SLO and fallback.
6. Open controlled traffic.
7. Roll back and retire safely.

The source explains this progression in one incremental product narrative, which is much better than presenting eight unrelated MLOps definitions.

Transitions between the theory subtopics are also generally effective:

- “Habiendo fijado el rerun…”
- “Con un candidato que ya ganó…”
- “Habiendo registrado el modelo…”
- “Con features alineadas…”
- “El modelo ya sirve con SLO…”

These phrases help establish dependency edges between nodes.

#### Weakness

The case is said to move through the whole lifecycle, but the actual code artefacts do not accumulate. Each demonstration creates a fresh, independent dictionary or function. The “incremental product” exists narratively, not technically.

#### Recommended connective model

Each subtopic should read and extend one shared release manifest:

```json
{
  "case_id": "CASO-TAC-047",
  "run": {},
  "lineage": {},
  "model_version": {},
  "validation": {},
  "serving": {},
  "rollout": {},
  "rollback": {},
  "audit": []
}
```

Then every T1–T4 transition would be visible in the artefact, not merely described in prose.

---

### 5.2 I Do fidelity

#### What works

- Exactly one demonstration is provided per subtopic.
- Each demo has output and a “¿Por qué este código?” explanation.
- The UI explicitly asks learners to attend to the reason for each line rather than only the result.
- Positive and negative cases are shown.
- Examples are small enough to run locally.

#### What is missing

The I Do demonstrations mostly show the final code immediately. They do not consistently model expert reasoning such as:

- What evidence should be inspected first?
- Which failure modes are plausible?
- Why is one condition a breach and another uncertainty?
- Which operational action happens first?
- What evidence should be preserved?
- What trade-off is being accepted?

The `why` paragraphs explain the completed answer, but few demonstrations expose the process of constructing it.

#### Pedagogical judgement

The section has **worked examples**, but not enough **worked reasoning**. A stronger I Do would include an incident or release packet and model a think-aloud:

> “First I verify comparability; I do not inspect the candidate score yet because a high score is irrelevant without matching lineage.”

That would teach prioritisation and diagnostic order.

---

### 5.3 We Do fidelity and fading

#### Current sequence

- E1: guided repair.
- E2: marked independent, but still receives two hints, exact route names, exact outputs and almost identical fixtures.
- E3: marked transfer, but retains the same fields, route names and valid/adversarial/missing order.

#### Why this is not full gradual release

Responsibility shifts only slightly. The learner does not decide:

- What evidence is relevant.
- Which fields should be required.
- Which output taxonomy to use.
- What test cases to construct.
- What operational artefact to create.

The answer form is already determined.

#### Better fade sequence

**E1 — Completion example**

- Provide full fixture and partially complete predicate.
- Show tests.
- Discuss the order of checks.

**E2 — Faded implementation**

- Provide requirements and fixtures, but no predicate structure.
- Ask learner to write the validator and tests.

**E3 — Transfer incident**

- Present logs, run metadata or a short deployment report in a different shape.
- Ask learner to identify the failure, action and missing evidence.
- Require a short decision record, not merely a returned constant.

This would align better with evidence on faded worked examples and constructive learning.

---

### 5.4 You Do fidelity

The project title and rubric are appropriate for a portfolio artefact. The learner is asked to produce reproducible evidence rather than merely a notebook screenshot. That is a significant strength.

However, the current You Do is closer to an extended exercise than a “Production Data/ML Platform”. Its starter does not provide a file structure, persistence mechanism, service interface, real tracker or deployment representation.

#### Portfolio credibility test

An interviewer viewing the current completed starter would probably see:

- Several pure Python predicates.
- Synthetic dictionaries.
- Printed status messages.

They would not see:

- Tracked experiment history.
- A registered model.
- A model card document.
- A service endpoint.
- Tests for train/serve parity.
- Request or latency evidence.
- Canary rollout evidence.
- A rollback transaction or manifest.
- CI output.

Therefore, the portfolio claim is overstated.

#### Recommended minimum authentic artefact

A local-only solution can remain accessible while becoming credible:

- MLflow local tracking with SQLite.
- A tiny scikit-learn model or deterministic synthetic ranker.
- Logged dataset digest, parameters, metrics and model.
- Registered model alias `challenger`.
- Model-card Markdown or JSON.
- FastAPI or minimal local inference function.
- Timing harness producing p50/p95.
- Offline/online feature parity tests.
- JSON canary observation file.
- Promotion/stop decision.
- Rollback manifest.
- `pytest` suite and local CI workflow.

---

### 5.5 Cognitive load and progressive disclosure

#### Positive design

The lifecycle is chunked into four topics with two subtopics each. That is a strong macro-level chunking decision.

#### Load problems

1. The opening dictionary introduces all later concepts at once.
2. Every exercise repeats long field lists and expected outputs.
3. Acronyms such as SLO and p95 are used without sufficiently prominent conceptual explanation.
4. Technical English is not consistently pre-trained.
5. Twenty-four near-identical exercises create volume without corresponding conceptual breadth.

#### Better disclosure

- Introduce only T1 vocabulary in the opening.
- Add a one-page route map with later terms shown but not fully defined.
- Include a visual “evidence chain”.
- Use one summary matrix after T4:

| Gate | Evidence | Breach | Missing evidence |
|---|---|---|---|
| Run | lineage + repeatability | invalidate | restore lineage |
| Registry | alias + signature + approval | deny | request approval |
| Serving | parity + SLO + fallback | disable/fallback | trace/tune |
| Rollout | window + quality + rollback | stop/rollback | collect evidence |

This would reduce repetition while strengthening schema formation.

---

### 5.6 Exercise and exam alignment

#### Alignment strengths

Each visible outcome has:

- One theory subtopic.
- One I Do demo.
- Three exercises.
- One self-check concept.

The counts are internally complete, and the exam engine supports three variants per concept and avoids reuse across attempts.

#### Alignment weakness

The learning outcomes use high-level verbs:

- register
- compare
- promote
- publish
- guarantee
- maintain
- deploy
- execute rollback

The tasks mostly ask learners to:

- replace
- classify
- return
- print

The assessment behaviour is therefore lower than the outcome behaviour.

#### Bloom-level judgement

- Theory/self-check: largely understand/recognise.
- E1: apply a known rule.
- E2: apply the same rule with missing data.
- E3: nominally analyse, but heavily signposted.
- You Do: potentially create, but insufficiently scaffolded.

The middle of the progression needs more real analysis before the final creation task.

---

### 5.7 Technical-writing and Peruvian Spanish assessment

#### Positive qualities

- The tone is direct and generally uses consistent second-person singular.
- Examples are contextualised in Peru without using real institutions or personal data.
- Sentences frequently state input, output, breach and missing-evidence behaviour.
- Failure actions are visually distinctive and memorable.

#### Redaction weaknesses

- Too many unintegrated English verbs: “promote”, “approve”.
- “Flipando flags” is not appropriate professional Peruvian technical prose.
- “Stdlib” is unnecessary shorthand in student-facing Spanish.
- “Un dict” is colloquial.
- Long nominal chains such as “data/code/env lineage y comparación” reduce naturalness.
- English and Spanish vary even within the same concept: “approval”, “approve”, “aprobación”.

#### Recommended style standard

Use Spanish prose with the recognised English professional term once:

> “Registra una ejecución de experimento (*experiment run*)…”

> “Realiza un despliegue canario (*canary deployment*)…”

> “Configura una alternativa segura (*fallback*)…”

Subsequent references may use the accepted English noun consistently.

---

### 5.8 Comparison with best-in-class external materials

| Reference | Best-practice strength | Gap in S47 |
|---|---|---|
| MLflow Tracking | Actual runs, parameters, metrics, artefacts, datasets and lineage | S47 simulates these with dictionaries. |
| MLflow Registry | Versioning, aliases, tags and lineage | S47 teaches deprecated stages. |
| MLflow Evaluation | Threshold-based validation over evaluation results | S47 manually compares isolated numbers. |
| Feast | Point-in-time-correct feature retrieval and offline/online consistency | S47 compares literal vectors only. |
| KServe | Real revision traffic splitting and promotion | S47 models one Boolean function. |
| Google MLOps guidance | CI/CD/CT, validation, deployment and monitoring as an integrated system | S47’s project does not implement the integration. |
| Google production monitoring | Model quality, skew, age, latency percentiles and query rates | S47’s canary evidence is narrow. |
| Model Cards | Intended use, evaluation procedure and performance conditions/slices | S47 checks four heading names. |
| NIST AI RMF | Govern, Map, Measure, Manage with lifecycle accountability | S47 represents approval as one Boolean. |

---

## 6. Proposed GitHub-style Diffs

These are proposals only. No repository changes were applied.

### Diff Group 1 — Modernise registry governance

Addresses Issues 1 and 12.

```diff
diff --git a/src/lib/course/sections/s47-opensource.ts b/src/lib/course/sections/s47-opensource.ts
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
@@ learningOutcomes
-    { text: "Promover un modelo a Staging solo con firma compatible, stage correcto y aprobación explícita" },
+    {
+      text:
+        "Versionar un modelo candidato, registrar su firma, marcar su validación con tags y mover aliases de despliegue solo con aprobación auditable"
+    },

@@ theory[0].paragraphs
-        "**Diccionario de la sección** ... **Model registry stage:** None → Staging → Production (con approve). ...
+        "**Diccionario inicial.** **Ejecución de experimento (experiment run):** parámetros, métricas, seed, artefactos y versión del dataset. **Lineage:** versiones de datos, código y entorno que produjeron el run. **Versión registrada:** artefacto inmutable dentro del registry. **Tag:** metadato como `validation_status=passed`. **Alias:** nombre mutable como `challenger` o `champion` que apunta a una versión. Los stages `Staging` y `Production` se presentan solo como un flujo heredado de MLflow y no como el mecanismo recomendado para proyectos nuevos.",

@@ theory T2-A heading
-      heading: "S47-T2-A · Firmas de I/O, stages del registry y approvals",
+      heading: "S47-T2-A · Firmas de I/O, versiones, aliases, tags y aprobación",

@@ theory T2-A paragraphs
-        "Con un candidato que ya ganó en holdout, el registry exige otra capa de gobernanza. ... los stages (None → Staging → Production) son estados gobernados...",
+        "Con un candidato que ya ganó en holdout, el registry exige otra capa de gobernanza. La firma fija nombres y tipos de entrada/salida. La versión registrada es inmutable; tags como `validation_status=passed` documentan el resultado de validación y aliases como `challenger` o `champion` permiten seleccionar una versión sin codificar su número en el servicio.",

-        "Contrato de promoción. Entrada: `input_signature`, `output_signature`, `stage`, `approved`...",
+        "Contrato de promoción. Entrada: `input_signature`, `output_signature`, `target_alias`, `validation_status` y un registro de aprobación con identidad, rol, fecha y evidencia. Salida: `PASS` solo si la firma coincide con `SERVICE_SIG`, la validación está aprobada y existe una aprobación independiente y trazable.",

@@ T2-A code
- def can_promote(stage: str, approved: bool, inp: dict, out: dict) -> bool:
-     sig_ok = inp == SERVICE_SIG["input"] and out == SERVICE_SIG["output"]
-     return stage == "staging" and approved and sig_ok
+ def can_promote(
+     target_alias: str,
+     validation_status: str,
+     approval: dict,
+     inp: dict,
+     out: dict,
+ ) -> bool:
+     sig_ok = inp == SERVICE_SIG["input"] and out == SERVICE_SIG["output"]
+     approval_ok = all(
+         approval.get(key)
+         for key in ("approved_by", "approver_role", "approved_at", "evidence_ref")
+     )
+     return (
+         target_alias == "challenger"
+         and validation_status == "passed"
+         and approval_ok
+         and sig_ok
+     )
```

---

### Diff Group 2 — Repair S47 identity while preserving legacy links

Addresses Issues 2 and 3.

```diff
diff --git a/src/lib/course/sections/s47-opensource.ts b/src/lib/course/sections/s47-mlops-serving.ts
similarity index 99%
rename from src/lib/course/sections/s47-opensource.ts
rename to src/lib/course/sections/s47-mlops-serving.ts
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@
-  id: "opensource",
+  id: "mlops-serving",
```

```diff
diff --git a/src/lib/course/index.ts b/src/lib/course/index.ts
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@
-import { section47 } from './sections/s47-opensource'
+import { section47 } from './sections/s47-mlops-serving'
```

```diff
diff --git a/src/app/page.tsx b/src/app/page.tsx
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@
 type View = 'home' | 'section' | 'resources' | 'admin' | 'familiarity' | 'pricing'

+const SECTION_ID_ALIASES: Record<string, string> = {
+  opensource: 'mlops-serving',
+}
+
@@ syncFromHash
-        const section = COURSE_SECTIONS.find((s) => s.id === hash)
+        const resolvedHash = SECTION_ID_ALIASES[hash] ?? hash
+        const section = COURSE_SECTIONS.find((s) => s.id === resolvedHash)
         if (section) {
-          setActiveSectionId(hash)
+          setActiveSectionId(resolvedHash)
           setView('section')
+          if (resolvedHash !== hash) {
+            window.history.replaceState(
+              null,
+              '',
+              `${window.location.pathname}#${resolvedHash}`,
+            )
+          }
         }
```

```diff
diff --git a/learning_roadmap.md b/learning_roadmap.md
--- a/learning_roadmap.md
+++ b/learning_roadmap.md
@@ Phase 3 table
-| 47 | Open Source & Community | 10h | Production-Grade OSS Package |
+| 47 | MLOps: experimentos, registro y serving | 20h | Production Data/ML Platform |

@@ Phase 3 flow
-              IaC → GPU Computing → Open Source → AI Governance
+              IaC → GPU Computing → MLOps Serving → AI Governance
```

```diff
diff --git a/course-state/section_ledger.json b/course-state/section_ledger.json
--- a/course-state/section_ledger.json
+++ b/course-state/section_ledger.json
@@ S47
-      "section_id": "opensource",
+      "section_id": "mlops-serving",
@@
-      "notes": "PHASE 4 complete; exam+P6 pending | V3 section close wave complete",
+      "notes": "PHASE 6 passed; S47 current identity is MLOps serving and CP-N4-B/CF-4 gate evidence is linked",
```

A one-time migration should copy saved progress from `opensource` to `mlops-serving` before removing the old key.

---

### Diff Group 3 — Add one authentic local MLflow vertical slice

Addresses Issue 4.

```diff
diff --git a/src/lib/course/sections/s47-mlops-serving.ts b/src/lib/course/sections/s47-mlops-serving.ts
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ I Do T1-A
-        description: "Demo: tracking y reproducibilidad — delta dentro de tolerancia",
+        description: "Demo: registrar y reconstruir un run local con MLflow",

@@ code
-        code: `def within_tol(metric: float, rerun: float, tol: float) -> bool:
-    return abs(metric - rerun) <= tol
-...
-print("delta", ...)`,
+        code: `from pathlib import Path
+import json
+import mlflow
+
+mlflow.set_tracking_uri("sqlite:///mlruns.db")
+mlflow.set_experiment("CASO-TAC-047")
+
+dataset_manifest = {
+    "dataset_version": "tacna-synth-v3",
+    "dataset_digest": "sha256:demo-dataset",
+    "split": "holdout-v1",
+}
+
+with mlflow.start_run(run_name="ranker-candidate-v1") as run:
+    mlflow.log_params({"depth": 4, "seed": 42})
+    mlflow.log_metrics({"holdout_f1": 0.81, "rerun_f1": 0.805})
+    mlflow.log_dict(dataset_manifest, "lineage/dataset.json")
+    mlflow.set_tags({
+        "git_commit": "abc123",
+        "env_lock_digest": "sha256:demo-lock",
+        "metric_definition": "f1-v2",
+    })
+    Path("run_id.txt").write_text(run.info.run_id, encoding="utf-8")
+
+print("run_id", run.info.run_id)
+print("tracking_uri", mlflow.get_tracking_uri())
+print("repeatable", abs(0.81 - 0.805) <= 0.01)
+`,
@@ why
-        why: "Corrige la idea de que «seed=42» basta..."
+        why:
+          "El run deja evidencia inspeccionable: parámetros, métricas, dataset, commit y entorno. `seed=42` por sí solo no demuestra repetibilidad ni permite reconstruir el experimento."
```

Add a command callout:

```diff
+      callout: {
+        type: "tip",
+        title: "Inspecciona el tracker local",
+        content:
+          "Instala dependencias fijadas y ejecuta `mlflow ui --backend-store-uri sqlite:///mlruns.db`. No se requiere una cuenta cloud ni GPU."
+      },
```

---

### Diff Group 4 — Replace the repeated E1/E2/E3 morphology with genuine fading

Addresses Issue 5.

```diff
diff --git a/src/lib/course/sections/s47-mlops-serving.ts b/src/lib/course/sections/s47-mlops-serving.ts
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ weDo.intro
-    intro: "S47 · ... 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed...",
+    intro:
+      "S47 · Cada subtema usa una retirada gradual de apoyo. E1 completa un ejemplo modelado; E2 construye y prueba el artefacto con menos estructura; E3 analiza un incidente nuevo y produce una decisión auditada. Los ejercicios cambian de representación para evitar memorizar una plantilla.",

@@ representative T2-A E2
- instruction: "Clasifica tres rutas ... Salidas exactas: PASS, DENY_MODEL_PROMOTION, MISSING:approved..."
+ instruction:
+   "Recibe dos versiones registradas con aliases y tags. Escribe `select_challenger()` para elegir la única versión con firma compatible, `validation_status=passed` y aprobación trazable. Crea al menos cuatro tests: candidata válida, firma incompatible, validación fallida y aprobación ausente. No se proporciona la forma de la condición final."

@@ representative T2-A E3
- instruction: "Recupera fallo cerrado ... tres fixtures distintos..."
+ instruction:
+   "Incidente de transferencia: el servicio apunta al alias `champion`, pero una automatización intenta moverlo a una versión cuyo tag de validación está aprobado y cuya firma cambió `age:int` a `age:str`. Escribe un registro de decisión con `decision`, `reasons`, `missing_evidence` y `next_action`. Justifica por qué un resultado de evaluación alto no compensa la incompatibilidad."
```

Apply the same fading principle across all eight subtopics, but vary the artefacts:

- Run table
- Lineage manifest
- Registry version metadata
- Model card
- Feature contract
- Latency report
- Canary observation window
- Incident/rollback record

---

### Diff Group 5 — Expand the You Do scaffold and fix compound incident handling

Addresses Issues 6 and 7.

```diff
diff --git a/src/lib/course/sections/s47-mlops-serving.ts b/src/lib/course/sections/s47-mlops-serving.ts
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ youDo.starterCode
-CASE_ID = "CASO-TAC-047"
-
-def log_run(...):
-    ...
+from dataclasses import dataclass, field
+from typing import Any
+
+CASE_ID = "CASO-TAC-047"
+
+
+@dataclass
+class GateResult:
+    gate: str
+    passed: bool
+    breaches: list[str] = field(default_factory=list)
+    missing_evidence: list[str] = field(default_factory=list)
+    evidence: dict[str, Any] = field(default_factory=dict)
+
+
+@dataclass
+class ReleaseDecision:
+    decision: str
+    actions: list[str]
+    failed_gates: list[str]
+    missing_evidence: list[str]
+    audit_entry: dict[str, Any]
+
+
+def combine_gate_results(results: list[GateResult]) -> ReleaseDecision:
+    failed = [result.gate for result in results if not result.passed]
+    breaches = [
+        breach
+        for result in results
+        for breach in result.breaches
+    ]
+    missing = [
+        item
+        for result in results
+        for item in result.missing_evidence
+    ]
+
+    actions: list[str] = []
+    if "STOP_CANARY" in breaches:
+        actions.append("STOP_CANARY")
+    if "ROLLBACK_UNAVAILABLE" in breaches:
+        actions.append("ESCALATE_ROLLBACK_UNAVAILABLE")
+    elif "ROLLBACK_TO_LAST_GOOD" in breaches:
+        actions.append("ROLLBACK_TO_LAST_GOOD")
+    if missing:
+        actions.append("COLLECT_REQUIRED_EVIDENCE")
+
+    return ReleaseDecision(
+        decision="BLOCK" if failed or missing else "PROMOTE",
+        actions=actions or ["PROMOTE_ALIAS"],
+        failed_gates=failed,
+        missing_evidence=missing,
+        audit_entry={
+            "case_id": CASE_ID,
+            "decision_owner": "",
+            "evidence_refs": [],
+            "residual_risk": "",
+        },
+    )
```

Add explicit project structure:

```diff
@@ youDo.requirements
+      "Entrega una estructura `src/`, `tests/`, `evidence/` y `model_card.md`.",
+      "Persiste un run real en MLflow local y registra una versión con alias/tag.",
+      "Expone una función o endpoint de inferencia con validación de firma.",
+      "Produce `evidence/canary_observation.json` y `evidence/release_decision.json`.",
+      "Incluye una prueba donde el canary falla y el rollback también es inseguro; ambas fallas deben aparecer en la decisión.",
+      "Incluye `pyproject.toml` o lockfile y un workflow local/CI que ejecute los tests.",
```

---

### Diff Group 6 — Strengthen canary evidence and fallback modelling

Addresses Issues 8 and 9.

```diff
diff --git a/src/lib/course/sections/s47-mlops-serving.ts b/src/lib/course/sections/s47-mlops-serving.ts
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ T3-B code
-def serving_ready(p95: float, slo: float, batch: int, fallback: str, tested: bool) -> bool:
-    return p95 <= slo and 1 <= batch <= 64 and fallback.startswith("rules-") and tested
+def serving_ready(
+    p95: float,
+    slo: float,
+    batch: int,
+    fallback: dict,
+) -> bool:
+    fallback_ok = (
+        fallback.get("kind") in {"rules", "model"}
+        and bool(fallback.get("ref"))
+        and fallback.get("compatible") is True
+        and fallback.get("tested") is True
+    )
+    return p95 <= slo and 1 <= batch <= 64 and fallback_ok
```

```diff
@@ T4-A code
 def canary_ok(
     mode: str,
     traffic_pct: float,
+    sample_count: int,
+    window_minutes: int,
     quality_delta: float,
     max_drop: float,
+    p95_ms: float,
+    max_p95_ms: float,
     error_rate: float,
     max_err: float,
+    worst_slice_delta: float,
+    max_slice_drop: float,
     hooks: bool,
 ) -> bool:
     return (
         mode in {"shadow", "canary"}
         and 0 < traffic_pct <= 10
+        and sample_count >= 500
+        and window_minutes >= 30
         and quality_delta >= -max_drop
+        and p95_ms <= max_p95_ms
         and error_rate <= max_err
+        and worst_slice_delta >= -max_slice_drop
         and hooks
     )
```

Missing sample size or duration should produce `COLLECT_MORE_SHADOW_EVIDENCE`, not `PASS`.

---

### Diff Group 7 — Deepen reproducibility and model-card evidence

Addresses Issues 10 and 11.

```diff
diff --git a/src/lib/course/sections/s47-mlops-serving.ts b/src/lib/course/sections/s47-mlops-serving.ts
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ T1-A heading
-      heading: "S47-T1-A · Tracking y reproducibilidad de experiment runs",
+      heading: "S47-T1-A · Tracking y repetibilidad de una ejecución",

@@ T1-A paragraph
-        "Reproducibilidad ... re-ejecutar el run con el mismo seed y params..."
+        "En este subtema verificamos **repetibilidad local**: ejecutar nuevamente bajo la misma configuración y obtener la métrica dentro de una tolerancia. La reproducibilidad completa se cierra en T1-B cuando también quedan fijados dataset, código, entorno, split y definición de métrica.",
```

```diff
@@ T2-B code
-REQUIRED = {"use", "limits", "metrics", "risks"}
-
-def artifact_ok(digest, train_fv, serve_fv, card):
-    return digest.startswith("sha256:") and train_fv == serve_fv and REQUIRED <= card
+REQUIRED_CARD_FIELDS = {
+    "model_version",
+    "owner",
+    "intended_users",
+    "intended_use",
+    "out_of_scope_use",
+    "dataset_version",
+    "evaluation_procedure",
+    "overall_metrics",
+    "slice_metrics",
+    "limitations",
+    "risks",
+    "retirement_policy",
+}
+
+
+def card_complete(card: dict) -> bool:
+    fields_present = REQUIRED_CARD_FIELDS <= card.keys()
+    values_present = all(card.get(field) for field in REQUIRED_CARD_FIELDS)
+    return (
+        fields_present
+        and values_present
+        and isinstance(card["slice_metrics"], dict)
+        and len(card["slice_metrics"]) >= 1
+    )
+
+
+def artifact_ok(digest, train_fv, serve_fv, card):
+    return (
+        digest.startswith("sha256:")
+        and train_fv == serve_fv
+        and card_complete(card)
+    )
```

---

### Diff Group 8 — Remove meta-text and standardise Spanish terminology

Addresses Issues 13–15 and 17.

```diff
diff --git a/src/lib/course/sections/s47-mlops-serving.ts b/src/lib/course/sections/s47-mlops-serving.ts
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ iDo.intro
-    intro: "Te muestro 8 demos ... no imprime literales precomputados.",
+    intro:
+      "Te muestro ocho demostraciones conectadas al gate CP-N4-B + CF-4. Cada una calcula evidencia a partir de entradas visibles y explica por qué un resultado permite continuar, bloquea el despliegue o exige recopilar más información.",

@@ starter comments repeated
-# Contrato: corrige el DEFECT; salida alineada a solutionCode
+# Corrige la regla de dominio sin modificar el fixture.
+# Verifica el resultado con el assert y la salida esperada.

@@ portfolioNote
-    portfolioNote: "... no pases a READY solo flipando flags sin evidencia.",
+    portfolioNote:
+      "Evidencia de CP-N4-B + CF-4: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. No declares el artefacto listo cambiando valores booleanos; cada gate debe enlazar evidencia reproducible.",

@@ terminology
- "Los demos usan **stdlib**..."
+ "Las demostraciones iniciales usan la **biblioteca estándar de Python**..."

- "la entrada es el dict completo"
+ "la entrada es el diccionario completo"
```

Multiline fixture formatting:

```diff
-record = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":True,"rollback_tested":True,"retired":{"1.0.0"},"audit_entry":True}}
+record = {
+    "case_id": "CASO-TAC-047-4B",
+    "current": "1.2.0",
+    "last_good": "1.1.0",
+    "compatible_features": True,
+    "rollback_tested": True,
+    "retired": {"1.0.0"},
+    "audit_entry": {
+        "actor": "release-manager",
+        "evidence_ref": "incident-047.json",
+    },
+}
```

---

### Diff Group 9 — Raise self-check questions to application and analysis

Addresses Issue 16.

```diff
diff --git a/src/lib/course/sections/s47-mlops-serving.ts b/src/lib/course/sections/s47-mlops-serving.ts
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ selfCheck question: registry
-        question: "Un modelo en stage production sin approved=True debe…",
-        options: [
-          "servirse igual porque el digest existe",
-          "escalar a 100% de tráfico",
-          "bloquearse hasta aprobación y card mínima",
-          "borrar el baseline para forzar el candidate"
-        ],
+        question:
+          "La versión 12 tiene alias `challenger`, `validation_status=passed`, firma compatible y digest válido. El registro de aprobación no contiene `approved_by` ni `evidence_ref`. ¿Qué decisión corresponde?",
+        options: [
+          "Mover inmediatamente el alias `champion` a la versión 12",
+          "Solicitar una aprobación auditable antes de cambiar el alias",
+          "Ignorar la aprobación porque la firma coincide",
+          "Enviar 100% del tráfico para obtener evidencia"
+        ],

@@ selfCheck question: canary
-        question: "Un canary con traffic_pct=100 y hooks=False debe…",
+        question:
+          "Un canary al 5% muestra 0.2% de errores y p95 bajo SLO, pero solo recibió 18 solicitudes durante tres minutos. ¿Cuál es la mejor acción?",
         options: [
-          "promoverse porque el modelo ya está en Staging",
-          "detenerse con STOP_CANARY y recolectar más evidencia si faltan hooks",
-          "ignorar el error budget si el digest es correcto",
-          "pasar a Production sin shadow previo"
+          "Promover porque todas las métricas observadas son positivas",
+          "Continuar en shadow/canary y recopilar una ventana y muestra suficientes",
+          "Mover 100% del tráfico para acelerar la prueba",
+          "Borrar la observación por ser demasiado pequeña"
         ],
```

Add at least one metric-calculation item:

```diff
+      {
+        question:
+          "El baseline obtiene F1=0.784 y el candidato F1=0.791 bajo el mismo holdout. El gate exige una mejora mínima de 0.010. ¿Qué decisión es correcta?",
+        options: [
+          "Promover: el candidato es numéricamente mayor",
+          "No promover todavía: la mejora es 0.007 y no alcanza el gate",
+          "Promover porque ambos usan F1",
+          "Cambiar al split de train para aumentar la diferencia"
+        ],
+        correctIndex: 1,
+        explanation:
+          "La mejora es 0.791 − 0.784 = 0.007. Ser mayor que el baseline no basta cuando el gate declara una mejora mínima de 0.010."
+      },
```

---

## 7. Recommended Priority Order for Fixing

### P0 — Must be corrected before presenting S47 as current Master-level MLOps

1. **Replace deprecated MLflow stages with aliases, tags and auditable version selection.**
2. **Correct the S47 identity split:** filename, section ID, route, roadmap and ledger.
3. **Fix the You Do compound-incident bug that hides rollback failure.**
4. **Align CP-N4-B/CF-4 claims with the project’s actual artefacts.**

### P1 — Required for genuine Master-level learning

5. Add one authentic local MLflow-to-serving vertical slice.
6. Redesign the 24-exercise family using fading and varied artefacts.
7. Expand the You Do repository scaffold and acceptance commands.
8. Add statistically meaningful canary evidence requirements.
9. Replace string-prefix fallback validation with structured fallback modelling.
10. Expand approval evidence and model-card content.

### P2 — Required for assessment validity and conceptual precision

11. Distinguish repeatability from full reproducibility.
12. Raise visible self-check questions from recognition to application and analysis.
13. Independently inspect and validate the exact 24 authenticated S47 exam variants for A/B/C equivalence.
14. Add compound-failure and insufficient-evidence scenarios.

### P3 — Editorial and accessibility refinement

15. Remove `solutionCode`, harness terminology and `READY`/“flipando flags” residue.
16. Establish a consistent Spanish–English terminology policy.
17. Replace the opening terminology dump with progressive disclosure.
18. Reformat fixtures and exercise instructions for mobile readability.

### Preserve during fixing

- T1→T4 lifecycle.
- CP-N4-B and CF-4 traceability.
- Synthetic Tacna scenario.
- No-PII and no-secret requirements.
- Breach-versus-missing distinction.
- Explicit rollback and audit-trail emphasis.
- Normal, adversarial and uncertain cases.
- Local-first accessibility with no mandatory cloud account or GPU.

---

## 8. Graph Memory Update Notes

```yaml
section:
  number: 47
  canonical_topic: "MLOps: experimentos, registro y serving"
  proposed_canonical_id: "mlops-serving"
  current_legacy_id: "opensource"
  current_source: "src/lib/course/sections/s47-opensource.ts"
  level: "Master"
  hours: 20
  gate:
    capstone: "CP-N4-B"
    checkpoint: "CF-4"

verified_nodes:
  - S47-T1-A: "tracking and local repeatability"
  - S47-T1-B: "data/code/environment lineage and honest comparison"
  - S47-T2-A: "registry signature and approval"
  - S47-T2-B: "artefacts, model card and feature compatibility"
  - S47-T3-A: "offline/online feature consistency and leakage"
  - S47-T3-B: "latency, batching and fallback"
  - S47-T4-A: "shadow, canary and monitoring"
  - S47-T4-B: "rollback, retirement and audit trail"

recommended_updated_nodes:
  - S47-T2-A:
      replace: "None → Staging → Production"
      with:
        - "immutable registered versions"
        - "aliases: challenger/champion"
        - "validation tags"
        - "auditable approval record"
        - "environment separation where required"
  - S47-T1-A:
      rename_concept: "local repeatability check"
  - S47-T2-B:
      expand_model_card:
        - intended users
        - out-of-scope use
        - evaluation procedure
        - slice metrics
        - owner
        - dataset/model version
        - retirement policy
  - S47-T4-A:
      add:
        - minimum sample count
        - observation duration
        - latency gate
        - sliced quality gate
        - baseline comparison
  - S47-T3-B:
      replace_string_fallback_with: "typed fallback record"

graph_edges:
  incoming:
    - from: S46
      relation: "data/platform lineage supplies model-training evidence"
  internal:
    - from: S47-T1-A
      to: S47-T1-B
      relation: "repeatability requires complete lineage before comparison"
    - from: S47-T1-B
      to: S47-T2-A
      relation: "only a comparable winning candidate enters governance"
    - from: S47-T2-A
      to: S47-T2-B
      relation: "registry selection depends on governed artefact evidence"
    - from: S47-T2-B
      to: S47-T3-A
      relation: "registered feature contract must hold in serving"
    - from: S47-T3-A
      to: S47-T3-B
      relation: "correct features precede SLO and fallback validation"
    - from: S47-T3-B
      to: S47-T4-A
      relation: "serving readiness precedes controlled traffic"
    - from: S47-T4-A
      to: S47-T4-B
      relation: "failed rollout invokes reversible recovery"
  outgoing:
    - to: S48
      relation: "deployment evidence and audit records feed governance/evidence work"

quality_flags:
  critical:
    - "deprecated MLflow model stages taught as current"
  high:
    - "legacy opensource route and stale roadmap"
    - "Boolean simulation underrepresents Master-level MLOps"
    - "24-exercise template overfitting"
    - "You Do starter/requirements mismatch"
    - "compound breach masks rollback failure"
  medium:
    - "thin canary evidence"
    - "fallback string-prefix overfit"
    - "model-card heading-only validation"
    - "approval represented as Boolean"
    - "recognition-heavy self-check"
    - "Spanglish and internal-schema residue"

evidence_status:
  live_card: "verified"
  canonical_source_all_tabs: "verified"
  renderer_mapping: "verified"
  self_check_items: "verified"
  authenticated_exam_sampler: "verified"
  exact_authenticated_S47_question_wording: "not independently inspected"
  repository_changes_applied: false
```

**This is the complete Explorer report for Section 47. Ready for the Fixer prompt.**
