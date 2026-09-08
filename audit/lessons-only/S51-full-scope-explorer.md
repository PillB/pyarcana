# S51 Full-Scope Explorer Audit — Observabilidad, gobernanza y UX del copiloto

> Repository persistence mirror. The canonical granular Explorer ledger for this run is `S51.json` in the current conversation, SHA-256 `d70279567bef99244ac2272059a24282909184d8f1b382ffd69b1ee888ebb414`, 178 nodes. No production content was changed.

## 1. Section Identification & Scope

- Section: **51**
- Canonical title: **Observabilidad, gobernanza y UX del copiloto**
- Stable compatibility id: `integrator-final`
- Source: `src/lib/course/sections/s51-integrator-final.ts`
- Main and audit-branch source blob: `461be0be91b1629fc28a3dc5375aa65bd865e3a3`
- Audit branch: `audit/lessons-only-adversarial-20260903`
- Live card: `Obs y UX copiloto` · `20h·Producción gobernada`
- Source metadata: `estimatedHours: 9`
- Continuity: S01 running log; S02–S50 dedicated/equivalent JSON; S50 re-read before progression; S51 was the first missing JSON.
- Scope: metadata, theory, all 8 subtopics, 2 figures, 8 I Do, 24 We Do, You Do, self-check, authenticated 24-variant bank, shared renderer/playground, resources and roadmap alignment.

Authoritative roadmap: S51 closes **CP-N4-C**. It is followed by **N4 regression**, then **CF-5**. CF-5 requires a manifest of all 12 capstones, frozen interfaces, system cards, demo/publication plan, 12/12 artifacts locatable, N4 regression green, zero P0/P1, and checkpoint metadata including version/revision/date/owner/reviewer/paths/hashes/commands/results/issues.

## 2. Executive Summary of Quality

**Score: 1.0 / 10 — REPAIR_REQUIRED**

**84 confirmed findings: 7 P0 · 64 P1 · 13 P2.**

The narrative is substantially better than the executable evidence. S51 correctly motivates traces, redaction, pinned releases, dual-control, SLOs, rollback, visible uncertainty and contestability, but the runnable curriculum repeatedly turns those properties into booleans, counts, prefixes and suffix tests.

Seven P0 blockers:

1. **F03 — stale semantic playground.** `integrator-final` opens `Practica arquitectura agenticaca`, not an S51 observability/governance/UX lab.
2. **F04 — false CF-5 closure.** Four local flags can make `readiness()` return READY without the authoritative CF-5 evidence.
3. **F11 — false reconstructable trace.** The project can PASS with four span names and no actual citation or tool-call arguments/results.
4. **F19 — false clean export.** `redacted_fields >= 1` can PASS even if other sensitive fields remain.
5. **F31 — false least privilege.** `global-admin-read` passes because the policy tests only `endswith('-read')`.
6. **F53 — caller-controlled HITL bypass.** A dangerous action can set `confirmation_required=False` and bypass confirmation.
7. **F70 — positional exam leak.** All 24 authenticated S51 variants use `correctIndex: 1` (option B).

## 3. Detailed Issue Registry

### P0 registry

- **F03** — stale `integrator-final` playground + typo `agenticaca`.
- **F04** — You Do falsely treats CP-N4-C, N4 regression and CF-5 as one four-flag gate.
- **F11** — trace validator does not require actual citations, exact tool calls, arguments, results or causal span tree.
- **F19** — redaction gate proves only that one field was redacted, not that zero sensitive values remain.
- **F31** — string-suffix authz accepts `global-admin-read` as least privilege.
- **F53** — confirmation requirement is caller-provided rather than derived from trusted action policy.
- **F70** — authenticated bank key distribution is 0/24/0/0.

### P1 registry by subsystem

**Release / checkpoint:** F01 S50 prerequisite remains open; F05 no 12-capstone manifest; F06 no N4 regression execution; F07 no zero-P0/P1 check; F08 checkpoint metadata missing; F09 system card not validated; F10 frozen interfaces and demo/publication plan absent; F81 learning outcome 8 reduces CF-5 to UX/a11y; F82 `cf5_freeze=True` is self-attested.

**T1-A traces:** F12 set-of-names contradicts tree model; F13 tool args/results/status/call_id absent; F14 citations not resolved/authorized; F15 release/dataset/evaluator/system-card linkage incomplete; F16 PII flag self-reported; F17 builder manufactures required spans instead of validating telemetry.

**T1-B cost/redaction:** F20 theory-code cost contradiction; F21 retrieval/tool/storage charges omitted; F22 p50 promised but not practiced; F23 redaction scan is shallow; F24 secret-rotation response absent; F25 negative token/latency domains can PASS.

**T2-A registry:** F27 immutability is a bool; F28 arbitrary unknown versions PASS; F29 no binding digest; F30 system-card/eval digest promised but absent from gate.

**T2-B governance:** F32 least privilege incorrectly equated with read-only suffix; F33 negative retention passes; F35 append-only self-reported; F36 SoD only compares strings; F37 approval not bound to exact release/diff/time; F38 You Do drops risk/retention from the stronger T2-B contract.

**T3-A SLO/feedback/drift:** F39 error budget disconnected from decision; F40 budget only models availability; F41 feedback is not operationalized; F42 drift is an opaque scalar with no baseline/window/slice; F43 latency/abstain SLI disappear from executable gate; F44 invalid metric domains PASS; F45 owner is a free string, not a runbook reference; F46 missing owner masks a known severe SLI breach.

**T3-B incidents:** F47 any `copilot-*` string is accepted as last-good; F48 containment/owners/action counts self-reported; F49 incident timeline hard-coded instead of derived from events; F50 negative rollback time passes; F51 missing owners masks known containment/RTO breach; F52 incident not bound to trace/release/communication evidence.

**T4-A contestable actions:** F54 approval not bound to exact call/args/resource; F55 citations_resolve self-reported; F56 uncertainty reduced to bool; F57 any nonempty effect summary passes; F58 correction workflow promised but absent; F59 confirmation audit receipt absent; F60 missing confirmation can mask known UX evidence breach.

**T4-B accessibility/appeal:** F62 theory distinguishes WCAG contrast classes but code collapses to one threshold; F63 caller can lower `min_contrast`; F64 five booleans are named `meets_wcag_aa`, overstating conformance; F65 relevant AA criteria are untested; F66 appeal has no SLA/trace/release linkage; F67 correction persistence/audit absent; F68 missing appeal can mask known a11y failure.

**Assessment/pedagogy:** F69 four required topic evaluations absent; F71 distractors often absurd/off-construct; F72 E3 remains same case/schema rather than true transfer; F73 24 exercises repeat the same predicate/router grammar; F74 roadmap says local/cloud but closure remains stdlib/local only.

### P2 registry

- **F02** source 9h vs live 20h vs roadmap 16–24h provisional.
- **F18** `trace_id` prefix is not distributed correlation proof.
- **F26** fixed synthetic token price risks false precision.
- **F34** hard-coded 30-day retention risks false policy universality.
- **F61** meta-leak: `El dueño de S51-T4-A acepta que...`.
- **F75** fallback self-check breadth is weak.
- **F76** meta-leak: `En tu revisión...`.
- **F77** meta-leak: `La revisión de S51-T2-A conserva que...`.
- **F78** dense mixed English terminology without consistent first-use anchors.
- **F79** resources should point directly to current GenAI observability conventions.
- **F80** `Gate de promoción` title overstates a T1-A-local evidence check.
- **F83** figure alt text uses `arbol` instead of `árbol`.
- **F84** inconsistent `post mortem` / `postmortem` terminology.

### RED tests that falsified current gates

- Trace without citations/tool details → **True/PASS**.
- Only one redacted field → **True/PASS**.
- Negative token counters and p95 → **True/PASS**.
- Arbitrary unknown registry strings with `immutable=True` → **PASS**.
- `global-admin-read` → **PASS**.
- `retention_days=-999` → **PASS**.
- availability=2, faithfulness=2, drift=-5 → **PASS**.
- severe broken SLI + missing owner → `TRIAGE_DRIFT_SLICE` instead of preserving incident.
- `rolled_back_to='copilot-malicious'` → **PASS**.
- rollback_minutes=-10 → **PASS**.
- known containment/RTO breach + owners missing → `CONVENE_INCIDENT_REVIEW` instead of preserving breach.
- destructive effect + `confirmation_required=False` → **PASS**.
- contrast 1.1 with caller-provided min 1.0 → **PASS**.
- four fabricated local dicts, no 12-capstone manifest/N4 regression → **READY**.

### Rejected false positives

- Renaming `integrator-final` — rejected; it is a stable compatibility id.
- “Figures missing” — rejected; `S51-trace-spans` and `S51-redaction-classes` exist.
- “Append-only means eternal PII retention” — rejected; theory correctly separates audit integrity from retention policy.
- “All write tools must be forbidden” — rejected; bounded, approved side-effects are valid.
- “WCAG always requires 4.5:1” — rejected; theory correctly distinguishes 4.5 normal text and 3:1 cases.
- “Fallback self-check must have exactly 8” — rejected; exact-eight applies to authenticated section exam.
- “S51 must use a specific cloud vendor” — rejected; construct should remain portable.

## 4. Meta-Leak Report

Learner-facing leaks:

1. T1-B: `En tu revisión, exige siempre...`
2. T2-A: `La revisión de S51-T2-A conserva que...`
3. T4-A: `El dueño de S51-T4-A acepta que...`
4. Shared semantic leak: `Practica arquitectura agenticaca` exposes obsolete pre-V3 semantics.

The source comment explaining that `integrator-final` is a compatibility id is **not** a learner-facing leak and should remain as engineering documentation.

## 5. Pedagogical & Redaction Deep Dive

The opening sequence is strong: failure → trace → telemetry privacy → SLO ownership → contestability. The executable layer collapses that rich model into self-reported labels. Two figures are pedagogically useful, but their visual mental models are not instantiated in code: `S51-trace-spans` is a tree while exercises validate a set of four strings.

I Do / We Do has the right count but weak transfer. Across eight subtopics, E1 repairs an inverted predicate, E2 routes PASS/breach/MISSING, E3 routes CONTINUE/breach/restore. E3 continues to use `CASO-MOQ-051` and essentially the same record schema, contrary to the roadmap requirement that E3 change context and require transfer.

Current OpenTelemetry GenAI practice models agent/LLM/tool operations as related spans and records model/token/tool information. S51 does not need vendor lock-in, but it should preserve causal span relationships and exact call evidence.

The T1-B prose is more correct than its code: it warns that retrieval/tools can be priced differently from LLM token usage, then the runnable example charges prompt+retrieval+generation using one token price. Repair the code, not the explanation.

T2 correctly names immutability, dual-control, least privilege and bounded retention, but none is proven. Digests/registry lookups, policy authorization and append-only event receipts are the appropriate teaching objects.

T3 computes an error-budget burn but does not use it to govern the release. Feedback is not practiced, drift has no baseline/window, and incident order is returned as a constant list. The learner therefore does not produce the operational evidence promised by the narrative.

T4-A has the highest direct safety consequence: the caller decides whether confirmation is required. Approval must derive from trusted tool/action policy and bind to exact call ID + normalized args + resource. T4-B also overclaims full WCAG AA from five booleans and a caller-controlled threshold. Scope the accessibility check honestly or implement a broader test suite.

The largest curriculum architecture defect is checkpoint conflation: **CP-N4-C**, **N4 regression**, and **CF-5** are sequential non-substitutable gates in the roadmap. A local S51 readiness function cannot redefine CF-5.

## 6. Proposed GitHub-style Diffs

### A. Decouple legacy ID from pedagogy
```diff
- 'integrator-final': { title: 'Practica arquitectura agenticaca', ... }
+ 'integrator-final': { title: 'Practica una traza auditable y rollback verificable', ... }
```
Prefer a semantic `playgroundKey` independent of `section.id`.

### B. Separate CP-N4-C → N4 regression → CF-5
```diff
- title: "Portafolio CF-5 ... (CP-N4-C + Level-4 regression)"
+ title: "CP-N4-C · Auditable AI Operations Copilot"
```
Then require a separate `CF5Receipt` with 12-capstone manifest, frozen interfaces, system cards, demo plan, N4 regression and issue gate.

### C. Trace evidence
```diff
- "spans": {"prompt","retrieval","tool","answer"}
+ "spans": [{"span_id":...,"parent":...,"kind":...,"attrs":...}]
+ "tool_call": {"call_id":...,"args_digest":...,"result_status":...}
+ "citation_receipts": [...]
+ "release_digest": "..."
```

### D. Redaction
```diff
- export_clean = redacted_fields >= 1
+ export_clean = sensitive_detected == sensitive_redacted and sensitive_residual == 0
```

### E. Cost accounting
```diff
- cost = (prompt + retrieval + generation) / 1000 * PRICE_PER_1K
+ cost = model_token_cost(input_tokens, output_tokens) + retrieval_query_cost + tool_cost + storage_cost
```

### F. Registry/governance
```diff
- immutable is True and version != "latest"
+ registry.resolve(version).digest == declared_digest and state == "approved"
```
```diff
- access_scope.endswith("-read")
+ POLICY.allows(principal, action, resource, constraints)
```
Validate `0 <= retention_days <= policy_max` and bind approval to release digest/diff.

### G. Append-only receipt
```diff
- audit_append_only: True
+ event = append_event(previous_hash, change)
+ assert verify_hash_chain(events)
+ assert mutation_attempt_rejected(event.id)
```

### H. SLO/error budget/drift
Use domain validation, multi-window burn policy, baseline/current windows and slice IDs. Never let missing owner erase known breaches.

### I. Incident rollback
```diff
- rolled_back_to.startswith("copilot-")
+ rollback.target_digest == registry.last_known_good_digest
```
Derive timeline from timestamped events rather than hard-code it.

### J. Human confirmation
```diff
- confirmation_required = ui["confirmation_required"]
+ confirmation_required = TOOL_POLICY.requires_confirmation(tool,args,resource)
+ approval.args_digest = digest(normalize(args))
```

### K. Contestability/a11y
Replace self-reported citation/correction/appeal booleans with receipts. Rename `meets_wcag_aa` to scoped lab checks unless full conformance evidence is produced; derive contrast thresholds from element class, not caller input.

### L. Assessments
Add 4 topic evaluations. Rebalance authenticated key positions to **6/6/6/6** and replace absurd distractors with plausible misconceptions. Redesign E3 with different contexts/representations.

### M. Environment
Keep stdlib worked examples, then close S51 with a vendor-neutral OpenTelemetry collector/backend exercise and optional controlled cloud export.

## 7. Recommended Priority Order for fixing

1. stale playground;
2. CF-5 architecture/readiness;
3. trace reconstructability;
4. residual redaction;
5. least-privilege authz;
6. HITL binding;
7. authenticated exam;
8. cost accounting;
9. registry/audit/rollback receipts;
10. SLO/error-budget/feedback/drift;
11. scoped WCAG + appeal/correction receipts;
12. four topic evaluations + true E3 transfer;
13. local/cloud observability lab;
14. hours/meta-text/terminology/resources.

## 8. Graph Memory Update notes

Critical edges:
- F03 → legacy id → wrong playground
- F04 → You Do readiness → false CF-5 closure
- F11 → CP-N4-C reconstructability → false trace evidence
- F19 → redaction → false clean export
- F31 → least privilege → suffix authz bug
- F39 → error budget → disconnected policy
- F46/F51/F60/F68 → missing-first → known breach masked
- F47 → rollback → fake last-good
- F53 → confirmation → caller-controlled HITL
- F62 → a11y → theory/code contradiction
- F70 → exam → positional key leak
- F69 → roadmap → missing topic-evaluation layer

Fixer invariants:
1. preserve `integrator-final` compatibility id but decouple semantic playground;
2. CF-5 uses authoritative checkpoint evidence;
3. trace = real causal tree + citations + exact tool calls/results + release digest;
4. zero residual sensitive data for clean export;
5. heterogeneous cost accounting;
6. digest/lookup-backed registry;
7. policy-based least privilege;
8. missing metadata never erases known breach;
9. rollback targets exact approved last-good;
10. confirmation derived from policy and bound to exact call;
11. scoped WCAG evidence, no caller-controlled threshold;
12. balanced authenticated exam;
13. E3 changes context/representation;
14. CP-N4-C, N4 regression and CF-5 remain distinct gates.

Full granular ledger: **178 nodes**, SHA-256 `d70279567bef99244ac2272059a24282909184d8f1b382ffd69b1ee888ebb414`.

This is the complete Explorer report for Section 51. Ready for the Fixer prompt.
