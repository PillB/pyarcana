# 1. Section Identification & Scope

**Section:** S44 — CI/CD y seguridad de la cadena de suministro  
**Canonical source:** `src/lib/course/sections/s44-multimodal.ts`  
**Audited main commit:** `535bd4d7b603283af9a39a813a79f05afbc47b48`  
**Source blob:** `eec61acc20c6a06558b4a13193522066152cbffb`  
**Stable legacy id:** `multimodal` — preserve unless a progress/URL migration is designed.  
**Roadmap contract:** prerequisite S43; environment `CI/cloud controlado`; S44 starts CP-N4-B; canonical CP-N4-B gate is S47.

This execution audited **S44 only**. The scope covered the current public S44 card, current main source, title/short title/tagline/job relevance, eight outcomes, all 32 theory/reference paragraphs, code/output/callouts/figures, eight I Do demos, 24 We Do exercises, You Do, visible rubric, eight self-check questions, 17 resources, authenticated exam delivery/question bank, shared Theory playground, figure registry/render path, prerequisite S43 audit state, and canonical/public CP-N4-B brief/rubric.

The public crawler exposes the current S44 title/tagline but not a trustworthy fresh hydrated lesson body. Therefore render-only claims are made only where shared source code deterministically proves the learner-facing behavior. The public card currently cached by the crawler says 20h while main source says 9h; because the crawl is last-month, this is kept as `UNRESOLVED_LIVE_SOURCE_DRIFT`, not promoted into a confirmed current deployment defect.

Audit methodology followed the PyArcana skeptical/anti-complacency contract and an audit-only adaptation of Solarize: source truth → adversarial counterexamples → independent shared-surface verifier → two quiet rescans after the last new material finding. No curriculum source was changed.

# 2. Executive Summary of Quality

**Score: 1.5/10 — REPAIR_REQUIRED — release FAIL.**

S44 has the right *topic list* but does not yet produce trustworthy evidence that the learner can execute the topic. Its strongest conceptual intentions are legitimate: fail-closed CI, action SHA pinning, least privilege, SBOM/provenance, environment approvals, same-artifact promotion, canary and rollback. The implementation repeatedly reduces those controls to learner-editable booleans or strings. That is not a minor code-style problem; it inverts the central lesson of supply-chain security: **claims about evidence are treated as evidence**.

The most serious defect is P0: You Do can return `READY` by setting four booleans to `True`, and `gate_case` hard-codes expected routes instead of inspecting the artifact bundle. The learner can therefore complete the nominal final gate without a workflow, SBOM, provenance, environment approval, canary log or rollback proof.

The pedagogical structure also fails the roadmap's target environment. V3 calls for controlled CI/cloud practice, but all eight I Do demos and all 24 We Do exercises are local Python predicates/parsers. The exercise family repeats nearly the same repair/classify/fail-closed template, so learners can become fluent in the *worksheet grammar* while never viewing a real Actions run, artifact download, attestation verification, protected environment or rollback record. GitHub's own learning materials favor repository/workflow-based, hands-on practice tied directly to the real procedure; its Quickstart has learners create a YAML workflow and inspect actual run logs, and GitHub Skills explicitly asks whether steps match what learners will do in the real world.

Two cross-surface defects make the section visibly incoherent. First, S44's stable legacy id `multimodal` still selects a shared Theory playground titled **“Practica CLIP y Whisper (simulado)”**. Second, S44 declares figure `S44-permission-scope`, but that id does not exist in either figure registry, so `FigureFrame` returns `null` and the visual never renders.

The final registry contains **47 confirmed findings: P0=1, P1=34, P2=12**, plus one unresolved live-hours drift. None of the rejected false positives were silently converted into defects.

# 3. Detailed Issue Registry

## Critical / P0

1. **S44-F02 — P0 — Self-attested final gate.** Evidence: `portfolio_ready` trusts four editable booleans and `gate_case` returns routes from the supplied case label; the runtime counterexample reaches `READY` with no artifacts. **Impact:** the final project can be passed without demonstrating any S44 control. **Repair:** derive readiness by opening/verifying the workflow, artifact digest, SBOM/provenance, deployment approval, canary and rollback evidence.

## Major / P1

2. **S44-F01 — P1 — Prerequisite integrity is broken.** S44 requires S43, but the current S43 audit is `REPAIR_REQUIRED`, score 1.0/10 with five P0s. **Impact:** CI/CD may promote an upstream service that never demonstrated its own canonical security/operability gate. **Repair:** block trusted capstone inheritance until S43 critical evidence is green, or provide an explicitly known-good synthetic fixture.

3. **S44-F03 — P1 — Target environment mismatch.** Roadmap says controlled CI/cloud; practice is local-Python simulation. **Impact:** learner never sees target procedure before independent work. **Repair:** use local predicates only as a short preflight, then run an actual controlled workflow.

4. **S44-F04 — P1 — Malformed digests pass.** Prefix checks accept `sha256:def`, `sha256:abc`, `sha256:x`. Runtime: `publish_if(True,'sha256:x',7)` publishes. **Impact:** malformed strings are taught as cryptographic identity. **Repair:** require `sha256:<64 lowercase hex>` and bind it to a measured artifact.

5. **S44-F05 — P1 — Artifact digest is supplied, not measured.** **Impact:** evidence can refer to a nonexistent/different file. **Repair:** build a fixture artifact, hash it, upload/download it and re-hash.

6. **S44-F07 — P1 — Cache key is not evidence of the actual lockfile.** It truncates a supplied hash to eight characters. **Impact:** collision/drift can look valid. **Repair:** compute full lockfile digest plus relevant runtime dimensions; remain explicit that cache is non-authoritative.

7. **S44-F08 — P1 — Conditions are self-reported.** Tags/branches/forks/manual paths are not actually inspected. **Impact:** release bypasses can remain invisible. **Repair:** parse workflow triggers/`if:` and test each relevant route.

8. **S44-F10 — P1 — Secret finding is conflated with confirmed compromise.** Any hit maps to revoke/rotate. **Impact:** detection, false-positive classification and incident response are collapsed. **Repair:** block first, classify/validate, rotate confirmed active exposed credentials, record approved false-positive/test-secret handling.

9. **S44-F11 — P1 — Effective permissions are not computed.** Substring checks do not model workflow/job inheritance/elevation. **Impact:** least privilege is claimed rather than proven. **Repair:** parse YAML structure and calculate permissions at workflow/job scope.

10. **S44-F12 — P1 — `pin_ok` overwrite bug.** A later pinned action hides an earlier unpinned one. Runtime counterexample: `evil/action@v1` followed by a full-SHA action yields a green final pin state. **Repair:** collect and require every external `uses:` reference to satisfy policy.

11. **S44-F13 — P1 — SHA format is mistaken for action identity.** Any 40-hex ref passes without proving it belongs to the intended action repository. GitHub secure-use guidance says pinning is strongest with a full-length commit SHA and recommends verifying that SHA belongs to the intended repository. **Repair:** preserve repository + commit identity and verify both.

12. **S44-F14 — P1 — Dependency review is a boolean.** **Impact:** supply-chain review can be invented. **Repair:** consume a real/synthetic dependency-review report/check outcome and evaluate configured policy.

13. **S44-F15 — P1 — Incorrect SBOM/provenance digest model.** Current lesson requires artifact digest == SBOM document digest == provenance subject. **Impact:** valid SBOMs can be rejected and fabricated equal strings accepted. **Repair:** separate artifact digest, SBOM document digest, SBOM subject digest and provenance subject digest; subjects bind to the artifact.

14. **S44-F16 — P1 — Attestation validity is a boolean.** **Impact:** cryptographic verification becomes self-assertion. **Repair:** verify attestation subject and trusted identity/policy.

15. **S44-F17 — P1 — Provenance gate omits builder/source identity.** It does not inspect builder/issuer, repository/workflow or source revision. SLSA defines provenance as *verifiable* information tracking where/when/how an artifact was produced. **Repair:** validate subject plus expected builder/issuer/repo/workflow/revision.

16. **S44-F19 — P1 — Truthy `approved_by` is treated as independent approval.** **Impact:** learner can type any name or self-approve. **Repair:** verify initiator, allowed reviewer and approval record; require reviewer != initiator when independence is the lab policy.

17. **S44-F20 — P1 — Environment policy is descriptive, not enforced.** GitHub environments can require reviewers, prevent self-review and restrict branches/tags. **Repair:** inspect/use protected-environment evidence rather than a list of names.

18. **S44-F21 — P1 — Promotion reuses malformed digest logic.** Same-string equality does not help if both are invalid/unmeasured. **Repair:** validate and re-hash staged artifact before promotion.

19. **S44-F23 — P1 — Canary accepts impossible negative metrics.** Runtime: `canary_ok(-1,.01,-999,120) -> True`. **Repair:** validate numeric domains before policy comparison.

20. **S44-F24 — P1 — You Do weakens T3-B.** It drops `migration_compatible` and `rollback_tested`. **Impact:** final evidence is less demanding than guided practice. **Repair:** carry forward the full critical contract.

21. **S44-F25 — P1 — Rollback is not bound to last-known-good.** **Impact:** a fast arbitrary action can be called rollback. **Repair:** retain before/failed/restored digests and prove restoration to known-good configuration/data state.

22. **S44-F26 — P1 — Migration compatibility and rollback testing are booleans.** **Repair:** execute fixtures/tests and retain results.

23. **S44-F28 — P1 — Branch protection is modeled as values/sets.** **Impact:** governance is descriptive. **Repair:** inspect repository/ruleset fixture or exported policy with required checks/reviews/bypass conditions.

24. **S44-F31 — P1 — Healthy path is broken.** T4-B PASS requires `critical_failure=True`; a healthy run becomes `STOP_SILENT_FAILURE`. **Impact:** state machine teaches incorrect normal semantics. **Repair:** separate healthy-success from critical-failure-response paths.

25. **S44-F32 — P1 — Remediation code points to the wrong missing control.** Missing `evidence_retained` can produce `ASSIGN_INCIDENT_OWNER` even when owner exists. **Repair:** remediation codes must correspond to the missing evidence/control.

26. **S44-F33 — P1 — Auditability fields are self-attested.** `logs_redacted`, owner and evidence retention are fields, not inspected evidence. **Repair:** inspect redacted log, evidence manifest and ownership record.

27. **S44-F34 — P1 — 24-exercise predicate-repair monoculture.** **Impact:** template fluency substitutes for domain skill. **Repair:** diversify representations and actions: YAML editing, log inspection, artifact hashing, attestation verification, environment policy diagnosis, rollback evidence.

28. **S44-F35 — P1 — E3 does not create meaningful transfer.** It usually keeps the same schema/context. EEF worked-example guidance supports fading scaffolds as competence grows; transfer should not be the identical exercise with fewer hints. **Repair:** change representation/context and require learner selection of the relevant control.

29. **S44-F36 — P1 — All eight I Do demos miss the authentic procedure.** **Impact:** worked examples do not model what You Do requires. **Repair:** at least one complete actual CI run, then faded component demonstrations.

30. **S44-F37 — P1 — Learner-facing CLIP/Whisper leak.** Exact shared title: **“Practica CLIP y Whisper (simulado)”** selected from `demos[sectionId]` when S44's stable id is `multimodal`. **Impact:** direct topic contamination. **Repair:** keep id, replace semantic demo mapping with S44 CI/supply-chain content.

31. **S44-F38 — P1 — CP-N4-B brief leaks stale pre-V3 section names.** Exact prerequisite text: `S44 (multimodal), S45 (IaC), S46 (GPU computing), S47 (opensource)`. Current V3 names are different. **Impact:** learner sees contradictory roadmap. **Repair:** update human-readable labels while preserving stable IDs separately.

32. **S44-F40 — P1 — Self-check misnames the capstone gate.** Question asks which result demonstrates `el gate CP-N4-B · cadena de suministro verificable`, but canonical gate is S47. **Repair:** call it the S44 contribution/checkpoint, and explicitly say CP-N4-B gate closes at S47.

33. **S44-F42 — P1 — Four authentic topic assessments are missing.** V3 requires one integrated authentic evaluation per topic. **Impact:** section lacks mandated evidence between exercises and section exam. **Repair:** add four artifact-based topic assessments covering each pair of subtopics.

34. **S44-F45 — P1 — Action pinning and package locking are conflated.** Intro says dependencies are fixed by immutable SHA instead of ranges. **Impact:** learner may apply GitHub Action ref semantics to Python package dependency management. **Repair:** distinguish action commit-SHA pinning from package lockfiles/version constraints/hashes.

35. **S44-F46 — P1 — Attestation generation permissions are omitted.** GitHub's current attestation guidance requires `id-token: write`, `contents: read`, `attestations: write`. **Impact:** least-privilege narrative cannot be implemented correctly. **Repair:** teach a dedicated attestation job with those explicit permissions and verification step.

## Moderate / P2

36. **S44-F06 — P2 — Seven-day retention is false precision.** Repair: label it as CASO-PIU-044 policy, not universal practice.

37. **S44-F09 — P2 — Permission/pinning figure is attached to T1-A rather than T2-A.** Repair: move to the security/pinning concept if retained.

38. **S44-F18 — P2 — Provenance prose overstates “en qué máquina”.** Repair: describe builder/workflow/runtime/environment metadata according to the attestation format rather than promise physical machine identity.

39. **S44-F22 — P2 — `prod` vs `production` terminology drift.** Repair: one canonical machine identifier plus display label.

40. **S44-F27 — P2 — Canary is one-dimensional.** Repair: require window/sample and another health/SLO signal in the advanced example, while labeling any simplified lab policy.

41. **S44-F29 — P2 — `signed_commits` is decorative/inconsistent.** Repair: teach/assess it explicitly or remove it from the gate example.

42. **S44-F30 — P2 — Release-note headings can be empty.** Runtime counterexample passes empty values. Repair: require non-empty actionable change/risk/migration/verification/rollback information.

43. **S44-F39 — P2 — S44 visible rubric and canonical CP-N4-B rubric differ without a bridge.** This is not inherently wrong because S44 is formative. Repair: label it explicitly as S44 checkpoint and map it to the canonical S47 rubric.

44. **S44-F41 — P2 — Exam is current but recognition-heavy.** Examples ask what a matrix validates or what failing mypy/ruff means. Repair: keep retrieval practice but add workflow/diff/log mini-vignettes.

45. **S44-F43 — P2 — Resource set lacks direct operational first-party links for some core procedures.** Repair: add current docs for artifact attestations/verification, dependency review and secret/push protection alongside broad security docs.

46. **S44-F44 — P2 — Dense unexplained English/ops vocabulary in Peruvian Spanish.** Examples include `artifact`, `provenance`, `attestation`, `owner`, `hold`, `breach`, `lead`, `ops`. Repair: define once causally, standardize thereafter, avoid widow terms.

47. **S44-F47 — P2 — Declared figure never renders.** S44 references `S44-permission-scope`; it is absent from `FIGURES` and from `FIGURE_DATA` (flow+graph+misc). `FigureFrame` returns `null` for unknown IDs. **Impact:** planned visual support silently disappears. **Repair:** register the figure or remove/replace the dead reference; add a registry test for every lesson figure id.

### Rejected findings

- **Rename `multimodal` id/file — REJECTED.** It is a stable URL/save key; migration would be required.
- **S44 must close CP-N4-B — REJECTED.** Canonical gate is S47.
- **S44 must deploy to a real public cloud — REJECTED.** Controlled CI/local fixtures can produce authentic evidence.
- **Caches are incompatible with reproducibility — REJECTED.** Cache is a valid optimization; it just cannot be evidence/source of truth.
- **Full 40-hex action SHA pinning is needless — REJECTED.** Current GitHub secure-use guidance supports it.
- **Developer comments in the TS source are learner-facing meta-leak — REJECTED.** They are not rendered; the shared CLIP/Whisper playground is the actual learner-facing leak.

# 4. Meta-Leak Report

## Confirmed learner-facing leak

**Location:** `src/components/course/SectionView.tsx`, shared Theory demo map keyed by `sectionId`.

**Exact leaked text:**

> `Practica CLIP y Whisper (simulado)`

The associated demo code simulates multimodal concepts. S44's current canonical subject is CI/CD and supply-chain security. The leak occurs because the stable legacy id `multimodal` is incorrectly used as a semantic content selector.

**Attack:** resolve S44's id through `demos[sectionId]`.  
**Defense:** preserve the stable id because it protects URLs/progress.  
**Verdict:** `CONFIRMED_FINDING` F37. Decouple stable identity from semantic/current demo selection.

## Confirmed stale learner-facing roadmap metadata

**Location:** canonical and public CP-N4-B brief.  
**Exact stale line:** `S44 (multimodal), S45 (IaC), S46 (GPU computing), S47 (opensource).`

This is not a reason to rename stable internal identifiers. It is a reason to update learner-facing labels to V3 names.

## Rejected meta-leak

The developer comment at the top of `s44-multimodal.ts` explaining the pre-V3 filename/id is source-only and is not rendered. It is therefore not counted as a learner-facing leak.

# 5. Pedagogical & Redaction Deep Dive

## I Do / We Do / You Do fidelity

The nominal count is correct: eight I Do and 24 We Do. The **functional gradual release is not**. I Do teaches abstract predicates; We Do repeats predicate repair; You Do suddenly asks for portfolio-grade evidence. This is a representation jump rather than a scaffold fade.

GitHub's own Actions Quickstart puts the learner in `.github/workflows`, triggers the workflow and has them inspect the actual run/logs. GitHub Skills' current authoring guidance asks whether the learning workflow matches what the learner will do in the real world and recommends practical in-repository steps. EEF guidance on worked examples describes fading scaffolds progressively, not preserving the same solved grammar until the final leap. S44 should therefore retain compact Python models only as *mental-model previews*, then fade into authentic workflow/evidence operations.

## Cognitive load and progressive disclosure

The lesson introduces many legitimate advanced terms: digest, artifact, SBOM, provenance, attestation, least privilege, action pin, dependency review, environment protection, canary, SLO, RTO, rollback, branch protection. The problem is not the number alone; it is that several terms lack causal grounding before the learner must manipulate them.

A stronger sequence is:

1. **Workflow evidence:** one real CI file, one run, one log, one artifact.
2. **Artifact identity:** calculate and re-check a digest.
3. **Third-party code trust:** inspect every action ref and permission.
4. **Supply-chain evidence:** SBOM subject vs artifact identity, provenance/attestation verification.
5. **Promotion:** protected environment + same digest.
6. **Progressive release:** telemetry → decision → last-known-good rollback.
7. **Governance:** branch/ruleset + release record + incident evidence.

This sequence reduces widow terms because each new noun is attached to a concrete object/action/result.

## Mental-model correctness

The most dangerous misconception is: **“if the evidence fields look right, the control happened.”** That misconception is reinforced across dependency review, attestation, approvals, rollback, log redaction and final readiness.

The second is the SBOM/provenance equality error. Learners need the graph:

`artifact bytes -> artifact digest`  
`SBOM document -> its own document digest`  
`SBOM subject -> artifact digest`  
`provenance/attestation subject -> artifact digest`  
`verification policy -> trusted builder/issuer/repo/workflow/revision`

The third is dependency pinning: **GitHub Action commit-SHA pinning is not the same operation as Python dependency locking.** That distinction should be explicit before teaching both in one supply-chain section.

## Exercise and exam alignment

The 24 We Do tasks overfit to one code pattern. At Level 4, the learner should inspect representations they will encounter professionally. At least half the exercises should operate on YAML, logs, manifests, attestation fixtures, deployment records or telemetry rather than Python boolean dictionaries.

The authenticated question bank is at least topically current and has server-side variant sampling. That is worth preserving. But it mainly probes recognition. The bigger alignment failure is the complete absence of the four authentic topic assessments mandated by V3.

## Redaction quality / Peruvian Spanish

The prose often has energy and contextual specificity (Piura, synthetic case, no real secrets/PII), but it imports English nouns faster than it teaches them. The repair is not Spanish purism. Keep industry terms where useful, but define the term by role and consequence on first use.

Example:

Current idea: `attestation válida`.  
Improved causal phrasing: **“una atestación de artefacto: un registro firmado que vincula el artefacto con información verificable sobre cómo se construyó; el pipeline verifica su sujeto y la identidad esperada antes de promover.”**

Use `artefacto (artifact)` once, then standardize to `artefacto`; `provenance` can be introduced as `procedencia verificable (provenance)`; `owner` as `responsable`; `hold` as `pausa`; `breach` as `incumplimiento del gate` where no special code token is needed.

## Accessibility and visuals

The generic Figure shell has strong accessible behavior when a figure resolves: SVG title/aria, figcaption and screen-reader text. S44-F47 bypasses all of that because the id is unknown and `FigureFrame` returns `null`. A registry integrity test is therefore an accessibility/content integrity requirement, not just a developer convenience.

## Comparison with best-in-class external materials

- **GitHub Actions Quickstart / Tutorials:** authentic YAML and actual run/log inspection. S44 is weaker because it mainly simulates the workflow in Python.
- **GitHub Secure use reference:** full-length action SHA pinning and verification of intended repository identity. S44 teaches the first but not the second robustly.
- **GitHub Artifact Attestations:** explicit job permissions and generated/verifiable attestations. S44 currently substitutes a boolean.
- **GitHub Environments:** actual deployment protection rules, required reviewers and prevent-self-review. S44 currently substitutes `approved_by` truthiness.
- **GitHub Dependency Review:** actual PR dependency diff/check that can block merging. S44 currently substitutes a flag.
- **SLSA Provenance v1.2:** provenance is verifiable information about where/when/how artifacts were produced. S44's matching-string gate is too weak.
- **EEF worked examples:** scaffold fading should reduce support toward independent performance. S44 keeps the same predicate grammar rather than fading toward authentic CI artifacts.

# 6. Proposed GitHub-style Diffs

These are **proposed only**. They were not applied to curriculum source.

## Diff group A — Preserve stable id, remove semantic leak (F37)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@
-  'multimodal': {
-    title: 'Practica CLIP y Whisper (simulado)',
-    code: `# Simulacion de conceptos multi-modales ...`,
-  },
+  'multimodal': {
+    // Stable legacy section id; semantic content is S44 CI/CD supply chain.
+    title: 'Inspecciona un gate CI/CD y su evidencia',
+    code: `# Fixture sintético: parsea un workflow y falla si una action no está pinned,
+# si falta evidencia de artifact o si el gate crítico está rojo.`,
+  },
```

Longer-term: add a semantic `demoKey`/index-based mapping so stable ids are never assumed to be current titles.

## Diff group B — Fix missing/misplaced figure and add integrity test (F09, F47)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ T1-A
-      figure: { id: "S44-permission-scope", ... },
@@ T2-A
+      figure: {
+        id: "S44-permission-scope",
+        caption: "El permiso efectivo se calcula por workflow/job y cada action externa se fija a una revisión inmutable verificada.",
+        alt: "Workflow con permisos mínimos por defecto, job de attestation con permisos acotados y actions fijadas por commit.",
+      },
```

```diff
--- a/src/components/course/figures/data/flows.ts
+++ b/src/components/course/figures/data/flows.ts
@@
+  'S44-permission-scope': {
+    kind: 'flow',
+    headline: 'Permisos mínimos por etapa, sin convertir el id del workflow en evidencia',
+    stages: [
+      { label: 'CI', sub: 'contents: read', tint: 1 },
+      { label: 'attest', sub: 'id-token + attestations: write', tint: 4 },
+      { label: 'publish', sub: 'solo permiso necesario', tint: 3 },
+    ],
+    outcome: 'Cada elevación está acotada al job que la necesita.',
+  },
```

Add a test that walks every section figure id and asserts it exists in `FIGURE_IDS`.

## Diff group C — Make CI authentic and fade scaffolding (F03, F34, F35, F36, F42)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ I Do / We Do
- environment: 'local-python'
- starterCode: Python predicates over dicts/booleans
+ environment: 'controlled-ci'
+ starter: '.github/workflows/s44-ci.yml' + fixture repo
+ evidence: workflow run id, job logs, uploaded artifact, downloaded artifact hash
```

Keep the current functions as 5-minute preflight examples, then require real YAML/run evidence. Replace repeated E2/E3 schemas with different representations. Add four authentic topic evaluations, one per T1–T4, with the V3 0–3 rubric contract.

## Diff group D — Digest/cache/artifact evidence (F04, F05, F06, F07, F08, F21)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
+import hashlib
+import re
+
+DIGEST_RE = re.compile(r'^sha256:[0-9a-f]{64}$')
+
+def sha256_file(path):
+    h = hashlib.sha256()
+    with open(path, 'rb') as f:
+        for chunk in iter(lambda: f.read(65536), b''):
+            h.update(chunk)
+    return 'sha256:' + h.hexdigest()
@@
-def publish_if(success, digest, retention_days):
-    ok = success and digest.startswith('sha256:') and retention_days >= 7
+def publish_if(success, artifact_path, expected_digest, retention_days, policy):
+    actual = sha256_file(artifact_path)
+    ok = (success and DIGEST_RE.fullmatch(expected_digest)
+          and actual == expected_digest
+          and retention_days >= policy['min_retention_days'])
```

Compute cache key from the actual lockfile; test workflow trigger/condition routes instead of passing a boolean. State explicitly that seven days is a case policy.

## Diff group E — Pinning, permissions, secret/dependency checks (F10-F14, F46)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-def workflow_security(... dependency_review: bool ...):
-    ...
+def audit_workflow(workflow, dependency_report, resolved_action_identities):
+    # calculate effective permissions per workflow/job
+    # require ALL non-local uses refs to be full commit SHAs
+    # require resolved repo+commit identity to match policy
+    # consume dependency-review report instead of boolean
+    # secret findings -> BLOCK_AND_CLASSIFY; rotate only confirmed active secrets
```

Teach the attestation job explicitly:

```yaml
permissions:
  contents: read
  id-token: write
  attestations: write
```

## Diff group F — Correct SBOM/provenance/attestation model (F15-F18)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-def provenance_ok(artifact_digest, sbom_digest, provenance_subject, attestation_valid):
-    return artifact_digest == sbom_digest == provenance_subject and attestation_valid
+def provenance_ok(evidence, policy):
+    return (
+        valid_digest(evidence['artifact_digest'])
+        and evidence['sbom_subject_digest'] == evidence['artifact_digest']
+        and evidence['provenance_subject_digest'] == evidence['artifact_digest']
+        and evidence['verified_issuer'] in policy['trusted_issuers']
+        and evidence['repository'] == policy['repository']
+        and evidence['workflow'] == policy['workflow']
+        and evidence['source_revision'] == policy['source_revision']
+    )
```

Rewrite prose to say provenance records verifiable builder/workflow/environment information according to the format, not universally a physical machine identity.

## Diff group G — Environment approval + same artifact (F19, F20, F22)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-def promotion_ok(tested, promoted, approved_by):
-    return tested == promoted and bool(approved_by)
+def promotion_ok(staging_record, production_request, env_policy):
+    return (
+      valid_digest(staging_record['artifact_digest'])
+      and staging_record['artifact_digest'] == production_request['artifact_digest']
+      and production_request['reviewer'] in env_policy['allowed_reviewers']
+      and production_request['reviewer'] != production_request['initiator']
+      and production_request['branch'] in env_policy['allowed_branches']
+      and production_request['protection_rule_passed'] is True
+    )
```

Use one canonical identifier such as `production` in machine values.

## Diff group H — Canary/rollback evidence (F23-F27)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
+def valid_canary(m):
+    return (0 <= m['error_rate'] <= 1
+            and m['sample_n'] >= CASE_POLICY['min_sample_n']
+            and m['window_seconds'] > 0
+            and m['rollback_seconds'] >= 0
+            and m['rto_seconds'] > 0)
@@
-    return error_rate <= max_error and rollback_s <= rto
+    return (valid_canary(m)
+            and m['error_rate'] <= m['max_error']
+            and m['p95_ms'] <= m['max_p95_ms']
+            and m['migration_test_passed']
+            and m['rollback_test_passed']
+            and m['restored_digest'] == m['last_known_good_digest'])
```

## Diff group I — Branch/release/incident state (F28-F33)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-def notes_operable(notes):
-    return REQUIRED <= set(notes)
+def notes_operable(notes):
+    return all(str(notes.get(k, '')).strip() for k in REQUIRED)
@@
-if critical_failure and blocked and logs_redacted and owner and evidence_retained:
-    return 'PASS'
+if not critical_failure:
+    return 'CONTINUE' if normal_checks_green else 'BLOCK_PIPELINE'
+if not blocked: return 'BLOCK_RELEASE'
+if not logs_redacted: return 'REDACT_AND_RETAIN_LOGS'
+if not owner: return 'ASSIGN_INCIDENT_OWNER'
+if not evidence_retained: return 'RETAIN_INCIDENT_EVIDENCE'
+return 'INCIDENT_EVIDENCE_COMPLETE'
```

Replace branch-policy booleans with a ruleset fixture. Either remove `signed_commits` or make its role explicit and assessed.

## Diff group J — Final You Do verifier (F02, F24, F26, F33)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-def portfolio_ready(ci_ok, supply_chain_ok, promotion_ok, rollback_ok):
-    return 'READY' if all([...]) else 'BLOCKED'
+def portfolio_ready(paths, policy):
+    evidence = load_evidence(paths)
+    checks = {
+      'ci': verify_ci_run(evidence['workflow'], evidence['run']),
+      'artifact': verify_artifact(evidence['artifact']),
+      'supply_chain': verify_attestations(evidence, policy),
+      'promotion': verify_environment_approval(evidence, policy),
+      'rollback': verify_canary_and_rollback(evidence, policy),
+      'incident': verify_redacted_retained_evidence(evidence),
+    }
+    return {'status': 'READY' if all(checks.values()) else 'BLOCKED', 'checks': checks}
```

Delete/harden `gate_case` so case labels cannot dictate the expected result.

## Diff group K — Capstone labels/rubric/self-check (F38-F40)

```diff
--- a/course-state/capstones/CP-N4-B/BRIEF.md
+++ b/course-state/capstones/CP-N4-B/BRIEF.md
@@
-CP-N4-A. S44 (multimodal), S45 (IaC), S46 (GPU computing), S47 (opensource).
+CP-N4-A. S44 (CI/CD y seguridad de la cadena de suministro),
+S45 (Cloud y colas), S46 (Data eng producción), S47 (MLOps serving).
+
+S44 inicia la evidencia de CP-N4-B; el gate canónico se ejecuta en S47.
```

Mirror the label update in the public brief. Label the S44 rubric as a formative checkpoint mapped to the canonical 0–3 S47 rubric. Rewrite the self-check question from “gate CP-N4-B” to “checkpoint S44 que alimenta CP-N4-B”.

## Diff group L — Assessment/resources/language (F41-F45)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
+topicAssessments: [
+  // T1: inspect/run workflow + artifact evidence
+  // T2: identify/repair supply-chain evidence and verify attestation
+  // T3: protected promotion + canary/rollback record
+  // T4: ruleset/release/incident evidence audit
+]
```

Upgrade some exam variants from pure definitions to 6–12 line YAML/diff/log vignettes. Add direct first-party resource links for artifact attestations, dependency review and secret/push protection. Rewrite the introductory dependency sentence to separate GitHub Action SHA pins from Python package lockfiles/hashes. Add one-time Peruvian-Spanish bridges for key English operations terms.

# 7. Recommended Priority Order for Fixing

1. **P0 final-gate integrity (F02)** — no other repair matters if READY is still self-attested.
2. **Authentic environment + gradual release (F03, F34-F36, F42)** — make the learner actually run/inspect CI evidence before You Do.
3. **Supply-chain correctness (F04-F17, F45-F46)** — artifact digests, action identity, permissions, dependency review, SBOM/provenance and attestation verification.
4. **Promotion/rollback correctness (F19-F27)** — enforced approval, metric domains, last-known-good and real rollback evidence.
5. **Branch/release/incident state machine (F28-F33)** — fix healthy path and evidence-derived governance.
6. **Shared-surface contamination (F37, F47, F09)** — remove CLIP/Whisper leak and restore the missing figure with registry test.
7. **Capstone/assessment contract coherence (F38-F41)** — current labels, S47 gate wording, formative-vs-canonical rubric mapping, stronger exam variants.
8. **Redaction/resources/false precision (F06, F18, F22, F27, F29, F30, F43, F44)** — after technical and pedagogical semantics are stable.
9. **Fresh deployed QA** — Playwright/browser verification of the full rendered S44, figure presence, playground topic, responsive/accessibility behavior and 20h↔9h drift.

# 8. Graph Memory Update Notes

## Nodes added/updated

- `S44` -> prerequisite -> `S43` with status **blocked/untrusted evidence** until S43 P0s close.
- `S44` -> starts -> `CP-N4-B`; `CP-N4-B` -> gate -> `S47`.
- Stable identity node `multimodal` -> current semantic section `S44 CI/CD supply chain`; **must not** imply multimodal learner content.
- `SectionView.demo[multimodal]` -> obsolete CLIP/Whisper -> **bad edge / learner-facing leak**.
- `S44-T1-A.figure` -> `S44-permission-scope` -> **dangling edge / registry miss**.
- `S44-supply-chain` -> figure registry -> valid flow visual.
- `artifact_digest` -> subject of -> SBOM/provenance attestations; **not equal-to relation with SBOM document digest**.
- `action pin` -> requires -> full commit SHA + intended repository identity.
- `attestation generation` -> requires -> `contents:read`, `id-token:write`, `attestations:write` in scoped job.
- `environment promotion` -> requires -> verified independent approval + same measured artifact digest.
- `rollback` -> requires -> last-known-good identity + measured restoration + RTO evidence.
- `You Do readiness` -> currently depends on -> self-attested booleans (**invalid evidence edge**); proposed edge is readiness -> verified evidence manifest.

## Regression memories

Keep the following adversarial cases permanently:

- `sha256:x` never counts as a valid digest.
- One unpinned action anywhere makes the all-actions pin gate fail.
- Equal garbage digest strings never prove SBOM/provenance.
- Negative canary rates/times are invalid input, not green telemetry.
- Empty release-note values are not operable notes.
- Healthy pipeline is not an incident.
- Manual boolean flags cannot create READY.
- Every declared figure id must resolve.
- S44 Theory must never render CLIP/Whisper content solely because the stable id is `multimodal`.

## Persisted audit artifacts

- `audit/lessons-only/sections/S44.json`
- `audit/lessons-only/sections/S44.paragraphs-01.json`
- `audit/lessons-only/sections/S44.paragraphs-02.json`
- `audit/lessons-only/sections/S44.paragraphs-03.json`
- `audit/lessons-only/sections/S44.paragraphs-04.json`
- `audit/lessons-only/sections/S44.practice-audit-01.json`
- `audit/lessons-only/sections/S44.practice-audit-02.json`
- `audit/lessons-only/sections/S44.components.json`
- `audit/lessons-only/sections/S44.solarize-cycle.json`
- `audit/lessons-only/sections/S44.full-scope-index.json`
- `audit/lessons-only/wiki/S44.md`
- `audit/lessons-only/S44-full-scope-explorer.md`

**Release conclusion:** S44 remains `REPAIR_REQUIRED`. The content should not be considered release-ready until the P0 self-attested final gate and the P1 authentic-evidence/supply-chain/promotion/assessment defects are repaired and re-verified.

This is the complete Explorer report for Section 44. Ready for the Fixer prompt.
