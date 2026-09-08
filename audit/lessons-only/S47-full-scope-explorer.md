# 1. Section Identification & Scope

**S47 — MLOps: experimentos, registro y serving**  
Canonical source: `src/lib/course/sections/s47-opensource.ts` @ blob `667de86698328460bae59b7a0c36ec18a6228003`.  
Stable legacy id: `opensource` — compatibility key; preserve absent an explicit progress migration.  
Roadmap role: prerequisite S46; local/cloud; closes **CP-N4-B + CF-4**.

Continuity gate ran before analysis: S01 is covered by the running JSON; S02–S44 have dedicated JSON; S45 and S46 JSON are present; S47 had no JSON and was therefore the mandatory sole focus. Public GitHub Pages card was verified as `MLOps serving` with current tagline and 20h; canonical metadata says 9h. Deep SPA tabs were not browser-certified by the text extractor; canonical source and shared renderer were audited directly.

# 2. Executive Summary of Quality

**Score: 1.5/10 — REPAIR_REQUIRED — release FAIL.**  
**40 findings: P0=1 · P1=29 · P2=10.**  
**89 learner-facing elements inventoried in the complete granular JSON.**

The dominant defect is a false capstone closure. `path_ok` becomes true from five local predicates even when no CI/CD run, orchestration artifact, registry state, serving endpoint, staging E2E, immutable review, supply-chain evidence or executed rollback exists. The authoritative roadmap requires CP-N4-B to demonstrate CI/CD, orchestration, registry, serving and rollback, while CF-4 requires deployable architecture, lineage, SLO, rollback and immutable review evidence. This is P0 because the section can issue a green learner-facing closure without demonstrating the construct the capstone names.

A second systemic cluster replaces evidence with self-attestation: `approved=True`, `sha256:model`, `contract_tests=3`, `hooks=True`, `rollback_tested=True`, `audit_entry=True`. RED mutations produced additional false greens: baseline lineage can be unknown; malformed SHA-256 prefixes pass; negative p95/SLO and negative canary traffic/error can pass; bool `True` passes as batch size 1; an empty last-good identifier can pass; all eight E3 families mask a known breach when another field is missing.

# 3. Detailed Issue Registry

1. **F01 P1** — S47 requires S46, which remains REPAIR_REQUIRED/P0; S47 release is blocked even though provisional audit can proceed.
2. **F02 P1** — `estimatedHours: 9` conflicts with live `20h`.
3. **F03 P0** — CP-N4-B/CF-4 false closure: local flags can yield `path_ok=True` without integrated deployable evidence.
4. **F04 P1** — no immutable handoff from S44 supply-chain artifact or S46 production-data/lineage artifact.
5. **F05 P1** — run reproducibility is reduced to aggregate metric repeatability + seed/params; artifact/dataset/code/env evidence omitted.
6. **F06 P2** — malformed metric/tolerance evidence is conflated with genuine nonreproducibility.
7. **F07 P1** — baseline is a bare float, so candidate/baseline lineage equality cannot be checked.
8. **F08 P2** — provenance relies on blacklist sentinels (`latest`, `train`, `unknown`) instead of positive immutable IDs.
9. **F09 P1** — the product is described as a priority ranker but F1 is used without defining a classification target/threshold that makes F1 the intended construct.
10. **F10 P2** — theory calls model registry “ese archivo”; registry is a lifecycle store/API/catalog, not the model file.
11. **F11 P1** — figures are mis-sequenced: T1-A uses registry-promotion; T1-B alt promises data/code/env absent from the drawing; T2-A introduces shadow/canary before T4.
12. **F12 P1** — `approved=True` has no reviewer/time/review/candidate binding.
13. **F13 P1** — promotion is only `stage == staging`; no versioned registry transition/alias/tag state or audit exists.
14. **F14 P1** — any `sha256:` prefix passes, including `sha256:` and `sha256:model`.
15. **F15 P1** — four strings `{use,limits,metrics,risks}` are treated as a complete model card.
16. **F16 P1** — feature compatibility is equality of two caller-supplied version strings.
17. **F17 P1** — parity is one vector equality + `leakage=False` + `contract_tests>=3`; no tests are executed.
18. **F18 P2** — prose permits rules or previous-model fallback; code accepts only `rules-*`.
19. **F19 P1** — p95 and fallback testing are supplied, not measured/executed.
20. **F20 P1** — negative p95/SLO, bool batch and empty `rules-` version can pass.
21. **F21 P2** — batch cap 64 is an unexplained environment-independent magic threshold.
22. **F22 P1** — negative canary traffic/error and zero-exposure canary can pass.
23. **F23 P2** — one `traffic_pct` conflates mirrored shadow workload with user-visible candidate output.
24. **F24 P1** — `quality_delta`, error rate and `hooks` lack metric ID, control, window, sample size and actual check output.
25. **F25 P1** — rollback readiness does not prove last-good exists/loads/is healthy; empty last-good can pass.
26. **F26 P1** — CF-4 audit trail is `audit_entry=True`, not an immutable audit record.
27. **F27 P2** — rollback safety is coupled to retirement and exercises hard-code `1.0.0`.
28. **F28 P1** — all eight E3 families route missing-first and hide already-known breaches.
29. **F29 P1** — all 24 We Do exercises reuse almost the same predicate→valid/invalid/missing→router grammar.
30. **F30 P1** — E3 generally removes hints but does not change context/representation as required for independent transfer.
31. **F31 P1** — You Do mandatory path drops T1-B comparison, T2-B real artifact/card evidence, T3-B measured latency/fallback and part of T4-A monitoring evidence.
32. **F32 P1** — simultaneous canary+rollback failure emits only `STOP_CANARY`; rollback unreadiness disappears.
33. **F33 P2** — residual risk is hard-coded narrative, not derived evidence.
34. **F34 P1** — required commands, pinned dependencies and expected output are not checked by acceptance.
35. **F35 P1** — 15% security/privacy/least-privilege rubric row has no project evidence unless prior-section artifacts are explicitly imported, which they are not.
36. **F36 P1** — four authentic topic evaluations required by the roadmap are absent.
37. **F37 P1** — eight fallback questions are not one-per-subtopic; T1-B and T3-B are not directly assessed.
38. **F38 P1** — shared UI uses legacy id `opensource` to display obsolete packaging/CI playground content.
39. **F39 P2** — dense mixed-language jargon and Spanish/accessibility redaction defects, including unaccented alt text.
40. **F40 P2** — resources are too often broad landing pages rather than direct authoritative pages for disputed contracts.

The complete Attack → Defense → Verdict, current content, proposed improved content and justification for every finding and 89 individual elements is integrity-bound in the current project conversation artifact `S47.json`, SHA-256 `99063a8ba32c1d614d15486a10c4a0a83f004333458b3605f722c09b7f53379c`. The branch JSON is the compact continuity manifest.

# 4. Meta-Leak Report

**Confirmed exact leak in `src/components/course/SectionView.tsx`:**

> `Practica empaquetado y CI`
>
> `# Simulacion de conceptos de open source`
>
> `# 1. Simular pyproject.toml`

It is selected through the legacy id `opensource`. This directly violates the canonical S47 source warning that the pre-V3 id is only a URL/progress/save key and no longer describes the lesson. **Do not rename the id.** Decouple semantic playground selection from it.

Missing-figure suspicion was rejected: the S47 figures exist. Their placement/alignment is the problem.

# 5. Pedagogical & Redaction Deep Dive

The high-level lifecycle is good and should be preserved: experiment → honest comparison → registry/governance → train/serve consistency → SLO/fallback → gradual rollout → rollback. The missing connective tissue is evidence continuity: S47 should consume S44/S46 manifests rather than inventing replacement strings.

The I Do/We Do volume meets the nominal 8/24 count, but practice is structurally monocultural. Worked-example fading should approach the independent target, not merely remove hints around the same dict. Stronger surfaces: run manifests, baseline/candidate diffs, approval records, card files, digest recomputation, contract-test output, latency CSVs, canary control/candidate tables and append-only rollback audit logs.

No paid/public cloud is required. A serious local CF-4 can use local MLflow/SQLite/files, a local FastAPI endpoint, versioned manifests, GitHub Actions or equivalent CI evidence, a synthetic load test and an executed version switch/rollback. The defect is not locality; it is non-evidence.

Current MLflow documentation confirms Tracking records parameters/code/metrics/artifacts and dataset metadata; Registry is a centralized lifecycle store and stages are deprecated in favor of aliases/tags/separate environments. S47 already acknowledges stage deprecation, so “uses staging” was rejected as a standalone defect. KServe and Google SRE reinforce that canary/rollback are actual deployment state transitions evaluated from measurements, not booleans.

Spanish should introduce standard vocabulary through function: `corrida de experimento (run)`, `registro de modelos (model registry)`, `despliegue en sombra (shadow)`, `despliegue canario (canary)`, `reversión (rollback)`, `última versión conocida como buena (last-known-good)`, and repair accessibility accents such as `código`, `acompañando`, `saturación`.

# 6. Proposed GitHub-style Diffs

```diff
@@ CF-4 You Do
-path_ok = all([normal["run"]["ok"], normal["promote"], normal["parity"], normal["canary"], normal["rollback"]])
+evidence = load_cf4_manifest("evidence/cf4.json")
+assert verify_s44_supply_chain(evidence)
+assert verify_s46_data_lineage(evidence)
+assert ci_passed(evidence["ci_run"])
+assert orchestration_e2e_passed(evidence["orchestration_run"])
+assert registry_version_exists(evidence["model_version"])
+assert staging_serving_e2e_passed(evidence["staging_endpoint"])
+assert rollback_drill_passed(evidence["rollback_run"])
+assert immutable_review_binds_candidate(evidence["approval"])
+path_ok = all_cf4_evidence_green(evidence)
```

```diff
@@ T1-B
-def comparable(run, baseline: float):
+def comparable(candidate: RunManifest, baseline: RunManifest):
+    same_eval = (
+      candidate.dataset_digest == baseline.dataset_digest
+      and candidate.split_id == baseline.split_id
+      and candidate.metric_id == baseline.metric_id
+      and candidate.eval_protocol == baseline.eval_protocol
+    )
+    return same_eval and immutable(candidate) and immutable(baseline) and candidate.score > baseline.score
```

```diff
@@ T2-B digest
-return digest.startswith("sha256:")
+actual = "sha256:" + hashlib.sha256(Path(path).read_bytes()).hexdigest()
+return hmac.compare_digest(actual, expected_digest)
```

```diff
@@ E3 state machines
-if missing:
-    return "REVIEW_*"
+missing = missing_fields(record)
+breaches = observable_breaches(record)
+if breaches:
+    return {"decision":"BLOCK_*","breaches":breaches,"missing":missing}
+if missing:
+    return {"decision":"REVIEW_*","missing":missing}
```

```diff
@@ You Do compound breach
-breach_action = "STOP_CANARY" if not breach["canary"] else "ROLLBACK_TO_LAST_GOOD"
+violations = []
+if not breach["canary"]: violations.append("STOP_CANARY")
+if not breach["rollback"]: violations.append("ROLLBACK_NOT_READY")
```

```diff
@@ SectionView semantic mapping
-'opensource': { title: 'Practica empaquetado y CI', ... }
+// section.id is compatibility-only
+const playground = PLAYGROUNDS_BY_SECTION_INDEX[section.index]
```

Additional diff groups required by the full ledger: split metric-repeatability from run reproducibility; bind approval to exact digest/review; replace card section tokens with a versioned card document; execute feature parity tests; derive p95 from measurements; separate shadow mirrored traffic from served exposure; execute/load-test fallback; resolve/load/smoke-test last-good; write append-only audit entry; repair T1/T2 figure placement; add four topic evaluations and exact T1-A…T4-B self-check coverage.

# 7. Recommended Priority Order for fixing

1. F03 P0: rebuild CF-4/CP-N4-B around integrated immutable S43–S47 artifacts and executed staging/E2E/rollback.
2. F01: do not release S47 while S46 remains P0/P1-open.
3. F07/F12/F14/F17/F19/F24/F25/F26: replace self-attestation with derived evidence.
4. F31/F32/F34/F35: make You Do integrate every required contract and preserve compound failures.
5. F28: fix breach+missing precedence in all eight E3 families.
6. Repair the remaining T1–T4 technical contracts and input validation.
7. F29/F30: diversify exercise representations and implement genuine transfer.
8. F11/F38: fix visual sequencing and legacy-id semantic leak.
9. F36/F37: restore authentic topic evaluations and exact subtopic exam coverage.
10. Reconcile workload, Spanish/accessibility and resource targeting.
11. Re-run RED suite plus clean install, CI, staging E2E, canary evidence and rollback drill before release.

# 8. Graph Memory Update notes

Root edge: `F03 → {CP-N4-B, CF-4}` false closure. `F04 → {S44,S46}` records missing immutable handoffs. `F28 → F29` records breach-masking within repeated exercise grammar. `F38 → legacy-id:opensource` records compatibility-key semantic leakage.

Permanent invariant: **CF-4 PASS is derived from immutable integrated artifacts and executed state transitions; it is never a conjunction of learner-supplied booleans.**

This is the complete Explorer report for Section 47. Ready for the Fixer prompt.
