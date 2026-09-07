# S39 — Full-scope Explorer report

## 1. Section Identification & Scope

- **Section:** S39 — Responsible ML Case Triage y cierre de nivel
- **Canonical source:** `src/lib/course/sections/s39-integrator-phase2.ts`
- **Source commit:** `535bd4d7b603283af9a39a813a79f05afbc47b48`
- **Canonical capstone:** `CP-N3-C` — Triaje Responsable de Casos con ML
- **Canonical rubric:** `course-state/capstones/CP-N3-C/RUBRIC.json`
- **Canonical brief:** `course-state/capstones/CP-N3-C/BRIEF.md`
- **Reviewed in this full-scope pass:** 33/33 theory/reference paragraphs, 9 theory code/output blocks, 9 callouts, figure, theory playground, 8/8 I Do demos, 24/24 We Do exercises, You Do project/starter/rubric, 5/5 self-check questions and 16/16 resources.
- **No production/course content was modified.** Only audit artifacts were added on `audit/lessons-only-adversarial-20260903`.

Existing theory audit: `audit/lessons-only/sections/S39.json` + paragraph/component shards. New practice shards: `S39.practice-audit-01.json` and `S39.practice-audit-02.json`.

## 2. Executive Summary of Quality

**Score: 2.5 / 10 — REPAIR_REQUIRED.**

S39 is not ready to serve as the closing gate of Level 3. The previous theory-only audit already recorded **52 material findings**. Opening the practical surfaces adds **16 more**, including **3 P0s**, for **68 total material findings**: P0=3, P1=56, P2=9.

The central failure is structural: the section repeatedly treats **declared evidence** as though it were **executed evidence**. Lists of stage names stand in for an E2E pipeline; booleans stand in for security controls; card names stand in for cards; hardcoded metrics stand in for evaluation; strings such as `regression_scope="S27-S39"` stand in for a regression run. This is especially damaging in a section whose learning objective is auditability and defensibility.

The practical sequence amplifies the defect. I Do mostly models small nominal structures rather than the integrated work the learner must later defend. We Do contains 24 exercises, but most repeat a narrow `PASS/REJECT/MISSING` predicate-repair grammar. Several reference solutions false-green the very edge cases their prose claims to block. You Do then asks the learner to close CP-N3-C with a scaffold that omits baseline, calibration, cost-derived threshold and reproducible subgroup evaluation while hardcoding performance numbers into cards.

## 3. Detailed Issue Registry

### S39-F53 — P0 — You Do does not satisfy canonical CP-N3-C

**Evidence:** You Do calls itself “cierre CP-N3-C”, yet its scaffold does not calculate a deterministic baseline, calibration, a threshold derived from `cost_fp/cost_fn` or declared utility, subgroup performance from labels, or an explicit temporal leakage test. The canonical BRIEF/RUBRIC require these items.

**Impact:** A learner can submit an apparently governed bundle without demonstrating the capstone’s required ML evidence.

### S39-F54 — P0 — Hardcoded evaluation becomes pseudo-evidence

**Evidence:** `model-card.md` receives fixed text such as `precision_at_k≈0.55`, `median_review_s≈90`, `canal_app false_queue=0.08`, and “alertas de drift de score y calibración”. No code computes those values.

**Impact:** The section teaches the opposite of provenance: write the expected metric into the report instead of deriving it.

### S39-F60 — P0 — Visible rubric contradicts canonical rubric

**Evidence:** You Do renders six percentages plus `bonus checklist`, `gate process`, and `gate privacy` in a “Peso” column. Canonical CP-N3-C uses scale 0–3 with weights 35/20/25/20 and rule `weighted >= 2.4/3`, no critical criterion <2 and zero P0.

**Impact:** Two incompatible scoring contracts exist for the same capstone.

### S39-F55 — P1 — Audit and appeal are not reconstructible

The final audit event lacks actor, reason, timestamp, auto action, model/policy version and appeal linkage. Appeal is described in a card but never implemented.

### S39-F56 — P1 — Final EvidencePacket loses lineage and uncertainty

The dataclass contains only `case_id`, `score`, `graph_path`, `evidence`, `label_space`, `auto_fraud`. It omits evidence source refs, graph/model versions, model run id, decision time and uncertainty.

### S39-F57 — P1 — Registry/SemVer objective disappears from You Do

The project promises a registry of versions/owners and breaking-change policy, but emits no registry artifact and no compatibility test.

### S39-F58 — P1 — Privacy/fairness/security gate is prose, not evidence

No RBAC test, secret scanner, input/URL policy, minimization test or derived fairness report exists in You Do; the card simply claims properties and numbers.

### S39-F59 — P1 — `force_failure` is not a verified ops/rollback test

The code flips `human_only`, later raises `RuntimeError`, then writes an audit line saying rollback. It never verifies a rollback bundle, drift measurement or that forbidden automatic actions are technically blocked.

### S39-F61 — P1 — I Do is lower fidelity than the stated objective

The eight demos model stage lists, owner truthiness, packet keys, `audit=True`, checklist booleans, mode booleans, criterion names and card names. These are useful sketches, but they are presented as the teacher’s model of the closing workflow and they reproduce the same nominal-validation anti-pattern found in theory.

### S39-F62 — P1 — We Do overtrains token/predicate repair

Twenty-four exercises use the same E1/E2/E3 pattern: repair a boolean, distinguish `PASS/REJECT/MISSING`, print an exact line. The practice does not progressively approach baseline/calibration/threshold/audit durability/fairness/rollback/regression integration.

### S39-F63 — P1 — Reference solutions false-green their own specifications

Concrete counterexamples:

1. `S39-T1-B-E3`: deleting a required registry artifact can still return `CONTINUE` because the solution never checks the required set.
2. `S39-T4-A-E1`: PASS checks only three of six acceptance names; baseline, abstention or regression can be missing.
3. `S39-T4-B-E2`: PASS requires only `override_rate`, although the theory names three operational metrics.
4. `S39-T1-A-E2`: stage-order and auto-fraud policy failures collapse into the same `REJECT_STAGE_ORDER` despite prose claiming separate remediation signals.

### S39-F64 — P1 — Appeal does not enforce independent review

`second_reviewer` need only be truthy; the exercise has no original reviewer id and cannot prove the second reviewer is different.

### S39-F65 — P1 — Missing fairness metric is interpreted as zero

`S39-T3-A-E3` uses `s.get("fp_rate", 0)`. A slice missing `fp_rate` therefore appears perfectly safe and can pass.

### S39-F66 — P1 — Self-check is badly under-aligned

Five recognition MCQs do not assess baseline, calibration vs threshold, cost/utility, leakage, fairness support/uncertainty, audit fields, drift vs degradation, provenance or cards derived from evidence.

### S39-F67 — P2 — Incident quiz conflates human-only and rollback

Human-only is an immediate safety mode; rollback is a separate treatment that requires a verified compatible target. The option `human_only / rollback a artefacto previo` collapses the distinction.

### S39-F68 — P2 — Resource list contains misleading or low-value mappings

- `modelcards.withgoogle.com/about` now redirects to a DeepMind catalog: useful examples, not a construction guide.
- Python `logging` is not by itself an audit-trail standard.
- Twelve-Factor is broad SaaS guidance, not a Responsible ML control-plane reference.
- CS50P/Py4E are beginner Python resources and create noise in a Level-3 gate section.

## 4. Meta-Leak Report

**No learner-facing developer/meta leak newly confirmed.** The comments about the legacy `integrator-phase2` id and previously misplaced agent diagrams are TypeScript comments and do not render. Do not rename the stable id without a progress-key migration.

The existing off-topic Theory playground remains a confirmed topic-drift defect (`S39-F47`) and is not double-counted.

## 5. Pedagogical & Redaction Deep Dive

### I Do / We Do / You Do fidelity

The Gradual Release shape exists nominally, but fidelity does not increase correctly. I Do should model expert reasoning and a complete minimal workflow; We Do should preserve the same conceptual object while withdrawing support; You Do should then ask for independent transfer. Instead, the sequence changes task type:

- **I Do:** inspect tiny dict/list/boolean examples;
- **We Do:** repair intentionally wrong predicates and exact output tokens;
- **You Do:** suddenly assemble a bundle with files/cards/audit while major canonical ML evidence remains absent.

This is not merely “too easy”. It trains a different skill than the terminal task.

### Cognitive load

The 24 exercises are repetitive in surface form and dense in labels/tokens. Repetition is only helpful when it rehearses the target schema. Here it risks schema substitution: the learner can form “responsible ML = lots of fail-closed status strings” instead of “responsible ML = measurable contracts, evidence, governance and human review linked by lineage”.

### Assessment alignment

The mismatch is severe. The section advertises nine outcomes, the canonical capstone has four weighted rubric dimensions plus P0 blockers, the visible You Do rubric defines a third scheme, and the self-check uses a fourth rule (70% recognition quiz). These layers need explicit roles:

- formative exercise feedback;
- diagnostic self-check;
- canonical CP-N3-C scoring;
- external CF-3 promotion review.

They currently blur.

### Technical writing / es-PE

Most prose is intelligible, but technical nouns frequently become proof substitutes: “audit”, “registry”, “card”, “rollback”, “calibración” and “regresión” are named in places where the implementation does not instantiate the concept. The redaction problem therefore cannot be solved by adding definitions. The prose must state what artifact proves each term.

### External comparison

Relevant best-practice anchors point in the opposite direction from the current scaffold:

- NIST AI RMF treats oversight, monitoring, testing, appeals and go/no-go as lifecycle processes with measurement/documentation, not a one-time boolean checklist.
- scikit-learn separates probability calibration from the decision threshold and provides threshold tuning against metrics/cost-sensitive objectives.
- Model Cards guidance expects evaluated performance, limitations and intended use under relevant conditions.
- OWASP logging guidance emphasizes who/what/when, integrity, protection and verification of log mechanisms.

## 6. Proposed GitHub-style Diffs

These diffs are proposals only. **Do not apply as-is without the Fixer pass and tests.**

### Diff A — Remove false CP-N3-C closure claim and align project objectives

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ youDo.context
- "Entrega el sistema e2e sintético de triage ... cierre CP-N3-C ..."
+ "Entrega evidencia candidata para CP-N3-C. El bundle solo queda `ready_for_external_review`
+ cuando enlaza resultados ejecutados de baseline, calibración, threshold por costo/utility,
+ abstención, desempeño por subgrupo, revisión humana y los controles de release."
@@ youDo.objectives
- "Pipeline intake→queue con label_space needs_review y auto_fraud False",
- "Registry de versiones/owners ...",
- ...
+ "Ejecutar baseline y candidato sobre el mismo holdout versionado",
+ "Medir calibración en datos independientes y guardar calibration-report.json",
+ "Derivar threshold desde cost_fp/cost_fn o utility declarada y guardar threshold-report.json",
+ "Construir evidence packets con source refs, graph/model versions, model_run_id e uncertainty",
+ "Persistir overrides y apelaciones como eventos reconstruibles",
+ "Derivar risk_evidence desde tests de RBAC/secrets/input policy/fairness",
+ "Demostrar human_only y rollback hacia bundle verificado",
+ "Ejecutar regresión S27-S39 y dejar CF-3 pending_external_review"
```

### Diff B — Replace hardcoded metrics with generated evaluation artifacts

```diff
@@ build_bundle
- thr = 0.70
+ evaluation = evaluate_cp_n3_c(fixtures, baseline, candidate)
+ write_json(out / "evaluation.json", evaluation)
+ threshold_report = tune_threshold(
+     evaluation["calibrated_scores"],
+     evaluation["labels"],
+     costs=evaluation["costs"],
+ )
+ write_json(out / "threshold-report.json", threshold_report)
+ thr = threshold_report["threshold"]
@@ model-card.md
- "Metrics by slice (sintético): canal_app false_queue=0.08 ..."
- "Operational value: precision_at_k≈0.55; median_review_s≈90."
+ render_model_card(
+     evaluation_ref="evaluation.json",
+     threshold_ref="threshold-report.json",
+     risk_ref="risk_evidence.json",
+ )
```

### Diff C — Make packet/audit reconstructible

```diff
 @dataclass(frozen=True)
 class EvidencePacket:
     case_id: str
+    decision_time: str
+    evidence_refs: list[EvidenceRef]
+    graph_version: str
     graph_path: list
-    evidence: list
+    model_run_id: str
+    model_version: str
     score: Optional[float]
+    uncertainty: dict
@@ append_audit
- {"run_id", "case_id", "action", "score", "override", "human_only"}
+ {"event_id", "run_id", "case_id", "auto_action", "final_action",
+  "actor_id", "reason", "decided_at", "model_run_id", "policy_version",
+  "override", "appeal_of"}
```

### Diff D — Add actual registry and risk evidence

```diff
@@ build_bundle
+ registry = build_registry(required_artifacts=REQUIRED_CP_N3_C_ARTIFACTS)
+ assert_registry_complete(registry)
+ write_json(out / "registry.json", registry)
+
+ risk_evidence = run_risk_tests(
+     pii_minimization=True,
+     rbac=True,
+     secret_scan=True,
+     input_policy=True,
+     fairness=True,
+     no_auto_fraud=True,
+ )
+ write_json(out / "risk_evidence.json", risk_evidence)
+ if not risk_evidence["release_ok"]:
+     raise GateBlocked("risk evidence failed")
```

### Diff E — Correct the canonical rubric conflict

```diff
@@ youDo.rubric
- { criterion: "Alineación ...", weight: "25%" },
- ...
- { criterion: "Regresión N3/CF-3 ...", weight: "gate process" },
- { criterion: "Sin fraude/parentesco ...", weight: "gate privacy" },
+ { criterion: "Correctitud", weight: "35% · escala 0–3" },
+ { criterion: "Robustez", weight: "20% · escala 0–3" },
+ { criterion: "Mantenibilidad", weight: "25% · escala 0–3" },
+ { criterion: "Uso responsable", weight: "20% · escala 0–3" },
```

And render separately:

```diff
+ Gate CP-N3-C: promedio ponderado >= 2.4/3,
+ ningún criterio crítico < 2 y cero P0.
+ Checklist de evidencia: e2e, override, OOD, leakage, subgrupos,
+ privacy/security, cards y regression S27-S39.
```

### Diff F — Fix false-positive We Do validators

```diff
@@ S39-T1-B-E3
+ REQUIRED = {"er_engine", "graph_schema", "feature_set", "ranker",
+             "calibrator_threshold_policy", "packet_schema"}
 def decide(reg):
+    missing = REQUIRED - reg.keys()
+    if missing:
+        return "MISSING_ARTIFACT:" + ",".join(sorted(missing))
     ...
```

```diff
@@ S39-T2-B-E2
+ if record["second_reviewer_id"] == record["original_reviewer_id"]:
+     return "REJECT_SAME_REVIEWER"
```

```diff
@@ S39-T3-A-E3
- if s.get("fp_rate", 0) > thr:
+ required = {"n", "false_queue_count", "false_queue_rate"}
+ if required - s.keys():
+     return "REQUEST_SLICE_METRICS", None
+ if s["false_queue_rate"] > thr:
```

```diff
@@ S39-T4-A-E1
- meets = "no_auto_fraud_label" in acceptance and ...
+ REQUIRED_ACCEPTANCE = {...all critical criteria...}
+ meets = REQUIRED_ACCEPTANCE.issubset(executed_results.keys()) \
+         and all(executed_results[k]["status"] == "PASS" for k in REQUIRED_ACCEPTANCE)
```

```diff
@@ S39-T4-B-E2
- if "override_rate" not in v: return "REJECT_VALUE_METRICS"
+ required = {"precision_at_k", "override_rate", "median_review_s"}
+ if required - v.keys(): return "REJECT_VALUE_METRICS"
```

### Diff G — Reframe self-check as diagnostic and add missing concepts

```diff
@@ selfCheck
- 5 recognition questions
+ 8–10 microcases covering:
+ - calibration vs decision threshold
+ - threshold from cost/utility
+ - leakage by decision_time
+ - audit/appeal schema
+ - fairness support/uncertainty
+ - data/score drift vs calibration degradation
+ - evidence packet lineage
+ - external review vs local readiness
```

### Diff H — Repair resource list

```diff
@@ resources.docs
- Google Model Cards -> modelcards.withgoogle.com/about
+ Model Cards for Model Reporting -> research.google/pubs/model-cards-for-model-reporting/
+ Google/DeepMind model cards catalog -> example cards (explicitly labeled as examples)
@@ resources.docs
- Python logging (audit trail)
+ OWASP Logging Cheat Sheet (audit/security event design and protection)
+ Python logging (implementation primitive; not an audit standard)
@@ resources.courses
- CS50P
- Py4E
+ move to global Python resources; remove from S39 local resource list
```

## 7. Recommended Priority Order for Fixing

1. **P0 — Rebuild You Do around the canonical CP-N3-C contract (F53/F54).** Until this is repaired, S39 cannot honestly claim capstone closure.
2. **P0 — Unify rubric (F60).** There must be one formal scoring contract.
3. **P1 — Make packet/audit/registry/risk/ops artifacts executable (F55–F59).**
4. **P1 — Fix known false-positive We Do solutions (F63–F65) before any pedagogical polish.**
5. **P1 — Re-architect I Do/We Do fidelity and progression (F61/F62).**
6. **P1/P2 — Rebuild self-check and resources (F66–F68).**
7. Then return to the original 52 theory findings and resolve them against the repaired practical contract rather than fixing prose in isolation.

## 8. Graph Memory Update notes

Add/retain these edges in the shared graph:

- `S39 -> CP-N3-C/RUBRIC.json`: **CONTRADICTS_VISIBLE_RUBRIC**.
- `S39 YouDo -> baseline/calibration/cost-threshold/subgroup`: **MISSING_IMPLEMENTATION**.
- `S39 cards -> evaluation evidence`: **HARDCODED_NOT_DERIVED**.
- `S39 WeDo T1-B-E3 -> registry completeness`: **FALSE_POSITIVE_PATH**.
- `S39 WeDo T2-B-E2 -> independent appeal reviewer`: **NOT_ENFORCED**.
- `S39 WeDo T3-A-E3 -> fairness missingness`: **FALSE_GREEN**.
- `S39 IDo/WeDo -> YouDo`: **LOW_FIDELITY_TRANSFER**.
- `S39 -> CF-3`: **PENDING_EXTERNAL_REVIEW_ONLY; never self-certify**.

Do not forget in the Fixer wave:

1. Strings/booleans are summaries, not gate evidence.
2. Cards must be generated from or explicitly reference evaluation artifacts.
3. Calibration and decision threshold are separate problems.
4. Human-only and rollback are separate controls.
5. The canonical CP-N3-C rubric is the only formal scoring contract unless an ADR explicitly changes it.

**This is the complete Explorer report for Section 39. Ready for the Fixer prompt.**
