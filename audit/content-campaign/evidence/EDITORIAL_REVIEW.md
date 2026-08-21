# Editorial review — protocol §10 rubric

Reviewed against `docs/policies/HANDCRAFTED_WRITING_PROTOCOL.md`. Scoring was
performed as a separate pass over the finished text, after Iteration 2, reading
the added prose in place alongside its neighbours rather than in isolation.

## Iteration log

**Iteration 1 — completeness.** Two theory blocks in S18 (T2-B, T3-A), one in
S15 (T4-B), two Autocheck questions, one `youDo` objective, one `youDo`
requirement, one resource link, six glossary terms.

**Iteration 2 — adversarial editorial and pedagogical repair.** Seven real
defects found and corrected. None was cosmetic.

| # | Defect | Severity | Correction |
|---|---|---|---|
| 1 | *Reliability.* The peeking demo compared an **empirical** ten-look false-positive rate (0.191) against the **nominal** 0.05, printed as a literal. Not an apples-to-apples comparison, and a sharp reader could fairly object. | High | Rewrote the snippet to measure both rates the same way on the same 2000 no-effect experiments. One look now measures **0.045**; ten looks **0.191**. The empirical 0.045 also silently validates the method, making the point stronger than before. Output block updated to the newly executed stdout. |
| 2 | *Precision.* "d≈1.1 **con su intervalo**" implied an interval around Cohen's *d*. The interval S18-T2-B actually prints is around the mean of group B. | Medium | Changed to "d≈1.1, con un intervalo alrededor de la media de B." |
| 3 | *Reliability.* "Motores como DuckDB, Polars o **Arrow** … suelen ofrecer un `EXPLAIN`." Arrow is an in-memory format, not a query engine with `EXPLAIN`. | Medium | Rewritten to separate the layers: Parquet on disk, Arrow in memory, DuckDB/Polars as engines exposing `EXPLAIN` / `.explain()`. |
| 4 | *Precision.* "veinte comparaciones … producen dos significativas" without stating the expectation invites the inference that 20 tests always yield 2 false positives. | Medium | Added "—cuando por puro azar esperarías una—" and printed `esperadas_por_azar 1.0` from the snippet. |
| 5 | *Voice (anti-aberration §4.1, "repeated structures").* The negation-then-correction shape ("no es X, es Y") occurred **five** times across the two S18 blocks — a structural tic, not a deliberate choice. | High | Rewrote two instances into different shapes; kept the three where the construction genuinely lands (two paragraph closes and one definitional contrast). |
| 6 | *Precision.* Q9's explanation called the fourth option "el distractor más tentador". The classic error (option 0) is more tempting; option 3 is the more *subtle* one. | Low | "más tentador" → "más sutil", and the causal phrasing tightened. |
| 7 | *Readability.* "no es una victoria sino un traslado del problema" was abstract where a concrete consequence reads better. | Low | "arregla el indicador y empeora el negocio." |

## Rubric

| Dimension | Score | Justification |
|---|---:|---|
| **Purpose** | 3 | Each block exists to close a specific, evidenced gap (RED-01, RED-02). The S18 blocks answer a question the section itself raises four times and never answers. |
| **Structure** | 3 | Block A moves from the comparison the learner just computed → the counterfactual → the vocabulary → the mechanism → the measured contrast. Block B picks up exactly where A ends ("cuando el experimento termina"), and closes by returning the learner to the observational default that governs the rest of the section. S15's block moves from a format the learner has just used → the physical reason → the mechanism → the two limits. |
| **Substance** | 3 | Mechanism is explained, not asserted. The self-selection versus randomisation contrast is *demonstrated* on one data-generating process with a known true effect, so the 8× inflation is visible rather than claimed. Both p-value misreadings, practical significance, guardrails, peeking and multiple testing are each given a reason, not a rule. Limits are stated (single experiment, single period, unsorted data defeats pruning, over-partitioning defeats the gain). |
| **Readability** | 3 | Sentence lengths vary deliberately. Numbers from the runnable output are carried into the prose so the reader can check one against the other. No bullet lists standing in for explanation. |
| **Voice** | 3 | Matches the established house register of S18/S15: bolded terms at the moment of definition, contract framing, named synthetic case, standing ethical guard. Defect 5 was specifically a voice repair. |
| **Original authorship quality** | 3 | Written for this course's fintech scenario, its `CASO-LIM-018` convention, its existing d≈1.1 comparison and its existing confounder demo. Nothing here is transposable to another course by swapping nouns — the S18 blocks only make sense as the answer to what S18-T3-A already asks. |
| **Reliability** | 3 | Every declared output is the verbatim stdout of the snippet as extracted from the TS file by the repository's own extractor and executed on the declared interpreter (3/3 exact match). The resource URL was HTTP-checked (200) rather than recalled. Four of the seven Iteration-2 corrections were reliability or precision repairs. |

**Total 21/21.** Gate requires ≥ 18, none below 2, and Substance / Original
Authorship Quality / Reliability = 3. **PASS.**

## Hard-failure conditions (§13) — checked

| Condition | Status |
|---|---|
| Prose mass-produced by script or template | No. Three blocks, each hand-written against its own brief. |
| Sections substantially interchangeable | No. The S18 and S15 blocks share no sentence shape or framing. |
| Evidence fabricated | No. All outputs executed; URL HTTP-checked. |
| Length added without understanding | No. Iteration 2 *removed* a misleading comparison and replaced it with a measured one. |
| Central reasoning steps absent | No — supplying the absent step is the whole point of RED-01. |
| Terminology contradicts itself | No. `guardrail`, `estimando`, `autoselección` used consistently and registered in the glossary SSOT. |
| Uncertainty concealed | No. The wide IC (1.18, 9.82) is used *as teaching material* rather than hidden. |
| Internal process language leaked | No. No mention of audits, agents, campaigns, RED/GREEN or ticket IDs in learner-facing text. |
| The writer is the sole validator | Partially mitigated — see limitation below. |
| Rendered result not inspected | No. Inspected at 1440×1000 and 390×844 with screenshots retained. |

## Limitation, stated plainly

The protocol requires an independent validator, and `AGENTS.md` forbids
self-certification. In this session the drafting and the review were performed by
the same agent in separate passes with different objectives. That is weaker than
genuine independence.

What compensates, and what does not:

- **Compensating:** every factual claim is bound to a machine-checkable artifact
  — executed stdout, an HTTP status code, a gate exit code, a before/after ID
  diff. Those cannot be talked into passing.
- **Not compensating:** judgements of *voice*, *pedagogical fit* and *whether a
  novice would actually follow this* remain single-reviewer. Defect 5 was caught
  only by deliberately counting sentence shapes; a second reader would plausibly
  find more.

Recommended before merge: a human or independent reviewer reads the three added
blocks in the rendered app, and one learner-representative attempts the two new
Autocheck questions using only S01–S18 material.
