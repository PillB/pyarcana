# S49 Full-Scope Explorer Report — Repository Edition

## 1. Section Identification & Scope
S49 — **Agentes, herramientas y context engineering**. Canonical `src/lib/course/sections/s49-data-contracts.ts` (`2690c8b4dc12076f0b07d557184cf9e6f9f4de8c`). Stable legacy id `data-contracts` is compatibility-only. Roadmap: prerequisite S48; sandbox; workflow de herramientas; increment toward CP-N4-C. S49 was the first JSON gap after verified S01–S48 coverage. Live card says 20h; canonical source says 9h.

## 2. Executive Summary of Quality
**1.5/10 — FAIL / REPAIR_REQUIRED. 54 findings: P0=2, P1=42, P2=10. 124 granular elements inventoried.**
Release blockers: **F37** false HITL gate (sensitive actions can evade approval via naming/request flags) and **F44** false project READY (four manual booleans can certify the project).

## 3. Detailed Issue Registry
- **S49-F01 P1** — S49 depends on S48, but S48 remains REPAIR_REQUIRED with three P0 defects.
- **S49-F02 P1** — Canonical S49 metadata says 9 hours while the current live card shows 20h.
- **S49-F03 P1** — S49 repeatedly frames its local agent milestone as `CP-N4-C` evidence/gate even though the authoritative roadmap closes CP-N4-C at S51.
- **S49-F04 P1** — Architecture promotion is based on caller-supplied scalar `baseline_success` and `agent_success` rather than a versioned task/eval artifact.
- **S49-F05 P1** — Impossible or malformed success metrics can promote an agent.
- **S49-F06 P1** — Practice teaches only how to justify the deterministic workflow; it never gives learners a positive, bounded `agent_candidate` case to implement and defend.
- **S49-F07 P2** — `branch_count <= 3` is encoded as a hard rule for preferring workflow without evidence that three is a meaningful universal boundary.
- **S49-F08 P2** — The prose asks for a signed ADR in the repository, but no owner/reviewer/revision or artifact binding appears in code or acceptance.
- **S49-F09 P1** — `S49-tool-effects` teaches read-vs-side-effect idempotency, not workflow-vs-agent architecture.
- **S49-F10 P1** — `S49-context-budget` teaches context compaction/budget, not router→planner→worker→evaluator.
- **S49-F11 P1** — The section claims routing/planning/execution/evaluation but mostly manipulates counts, labels and precomputed scores instead of executing those relationships.
- **S49-F12 P1** — `evaluator_pass` and I Do score thresholds are caller-supplied; the evaluator never receives the worker output and criterion it allegedly judges.
- **S49-F13 P1** — Negative counts can satisfy the bounded-loop predicate.
- **S49-F14 P1** — Single responsibility is reduced to self-reported integers and schema length, so an overpowered tool can label itself compliant.
- **S49-F15 P1** — The strict solution equates 'valid single-responsibility tool' with exactly `{case_id}` and no side effect, overfitting one read tool instead of the general outcome.
- **S49-F16 P2** — `len(schema) <= 2` appears as a quality gate although parameter count is not a reliable measure of tool scope.
- **S49-F17 P2** — Learner-facing text contains internal review-process language.
- **S49-F18 P1** — Prose requires durable/atomic idempotency, but executable examples use process-local non-atomic dict state with a crash/concurrency duplicate-effect window.
- **S49-F19 P1** — The lesson says read-only tools do not need idempotency keys, but the reusable `call_tool` signature and You Do call path require/pass a key for every tool.
- **S49-F20 P1** — Least privilege is modeled only as `scope in granted`; resource/case-level authorization is absent.
- **S49-F21 P1** — Approval is bound only to a tool name, not the exact call ID and arguments.
- **S49-F22 P1** — S49 does not carry forward prompt-injection/tool-output defenses even though the roadmap explicitly starts evals and prompt-injection defense from S49.
- **S49-F23 P1** — A successful tool call is required to carry `error_kind ∈ {retryable, terminal}`, conflating success state with error classification.
- **S49-F24 P1** — Attempt/effect counters are not validated; `attempts` is ignored.
- **S49-F25 P1** — The theory function returns `ok=True` when retrieval finds zero facts.
- **S49-F26 P1** — The prose says checkpoints follow durable effects to support safe resume, but the worked example creates checkpoints after read-only retrieval.
- **S49-F27 P1** — Provenance is promised as a required context invariant but reduced to a boolean or omitted from the returned facts.
- **S49-F28 P1** — JIT retrieval resets S48 authorization/deletion/version invariants to plain substring matching.
- **S49-F29 P2** — Token counts are manually supplied fixture numbers, while the prose treats them as measured context consumption.
- **S49-F30 P1** — We Do requires `facts_before ⊆ facts_after`, which prevents dropping any noncritical fact and contradicts the theory's definition of compaction.
- **S49-F31 P1** — Compaction checks only names such as `budget` and `no_prod_write`, not their values, provenance or decision semantics.
- **S49-F32 P1** — `last_known_good.startswith('cp-')` treats a string shape as proof that a valid recoverable checkpoint exists.
- **S49-F33 P2** — `memory_retention_days <= 7` is encoded as a universal gate rather than a fixture policy.
- **S49-F34 P1** — The budget gate conflates 'goal not reached yet' with 'budget exhausted'.
- **S49-F35 P1** — Negative counters/maxima can pass.
- **S49-F36 P1** — The learning outcome requires steps/tokens/cost budgets, but reusable code paths omit token enforcement.
- **S49-F37 P0** — The central 'sensitive actions require human approval' contract can false-pass sensitive actions through naming conventions or caller-controlled `approval_required`.
- **S49-F38 P1** — `network='none'` and `filesystem='workspace-read'` are self-attested strings, not enforced isolation.
- **S49-F39 P1** — Recovery is reduced to `checkpoint.startswith('cp-')` and `replayed_effects == 0`; no resume occurs and no prior effect ledger is checked.
- **S49-F40 P1** — Missing replay evidence routes to `REQUEST_HUMAN_APPROVAL`, but human approval cannot establish whether an effect already occurred.
- **S49-F41 P1** — Missing-first routing masks already-observable breaches in all eight E3 families.
- **S49-F42 P1** — The 24 exercises reuse one dominant grammar: invert a boolean predicate → valid/adverse/missing rows → emit a route token.
- **S49-F43 P1** — E3 is labeled transfer but usually retains the same CASO-AYA fixture, record schema and conditionals as E2.
- **S49-F44 P0** — The final project can become `READY` by setting four booleans True without demonstrating the four mechanisms.
- **S49-F45 P1** — The starter claims integration of T1–T4 but does not implement router/planner/worker/evaluator orchestration, token budget, persistent checkpoint/LKG, real sandbox, or recovery.
- **S49-F46 P1** — README commands, fixed dependencies, expected output, residual risk, responsible owner, LKG/rollback and limitations are required in prose but ignored by readiness.
- **S49-F47 P2** — Any tool marked `side_effect=True`, including local report preparation, requires human approval, while the section's risk-based framing permits preparing proposals.
- **S49-F48 P1** — 15% of the rubric is `SLO, observabilidad y rollback`, although S49 does not provide observable SLO/trace-dashboard artifacts and S51 owns observability/operations for the copilot.
- **S49-F49 P1** — The four authentic topic evaluations mandated by the roadmap are absent.
- **S49-F50 P1** — Fallback self-check contains 7 questions, below the roadmap's exactly 8 displayed items (one per subtopic).
- **S49-F51 P1** — Answer-position distribution is repaired, but many distractors remain obviously absurd/off-construct.
- **S49-F52 P2** — Additional internal editorial ownership language leaks into the lesson.
- **S49-F53 P2** — The section carries a high density of unexplained/partially explained English operational terms and inconsistent Spanish-English morphology.
- **S49-F54 P2** — Resource list contains useful broad references but misses current direct primary pages for the exact controls S49 struggles with.

## 4. Meta-Leak Report
- CONFIRMED: `La revisión de S49-T2-A conserva que...` and `El dueño de S49-T4-A acepta que...` are internal editorial language in learner-facing callouts.
- REJECTED: source compatibility comment is not learner-facing; no stale `data-contracts` semantic playground mapping was found in SectionView.

## 5. Pedagogical & Redaction Deep Dive
The intended graph is architecture → bounded trajectory → tool authority/effects → context/state → stop/HITL/recovery. Current code repeatedly substitutes labels/booleans for those edges. T2-B contradicts its durable/atomic idempotency prose with a process-local dict. T3-B contradicts compaction theory by requiring `facts_before ⊆ facts_after`. T4-A conflates goal-pending with budget exhaustion. All eight E3 families can hide known breaches behind missing-first routing. The 24 We Do tasks repeat one predicate/table/router template, so E3 provides little transfer.

Carry forward S42 resource authorization and S48 authorized/versioned/provenance retrieval. Current primary guidance also supports per-call approvals/guardrails, persisted checkpoints for HITL/recovery, and agentic threat controls; S49 need not adopt a vendor framework, but its abstract contracts must preserve those properties.

## 6. Proposed GitHub-style Diffs
```diff
- if name.startswith("prod_") and approved_for != name: REQUEST_HUMAN_APPROVAL
+ derive sensitivity from TRUSTED_TOOL_POLICY + normalized args/resource risk
+ bind approval receipt to run_id + call_id + tool_name + args_digest
```
```diff
- process-local dict idempotency
+ durable atomic effect ledger (reserve/apply/complete + recovery reconciliation)
```
```diff
- scope in granted
+ schema validation + principal/resource authorization + input/output tool guardrails
```
```diff
- facts_before <= facts_after
+ critical values/provenance preserved; noncritical noise may be removed; LKG must exist/load/validate
```
```diff
- not budget_ok => STOP_BUDGET_EXHAUSTED
+ GOAL_MET | CONTINUE_WITHIN_BUDGET | STOP_BUDGET_EXHAUSTED
+ include steps + tokens + cost
```
```diff
- missing replay evidence => REQUEST_HUMAN_APPROVAL
+ unknown prior effect => VERIFY_RECOVERY_STATE
```
```diff
- READY = four booleans are True
+ READY = executed receipts for ADR, trajectory, auth/idempotency, context/checkpoint, budget, HITL/recovery
```
```diff
- Evidencia de CP-N4-C
+ S49-AGENT-GATE · evidencia hacia CP-N4-C
```
Add four topic evaluations; restore exactly 8 fallback items; replace absurd exam distractors; update direct resources to current OpenAI Agents SDK HITL/tool guardrails, LangGraph persistence/interrupts and OWASP Agentic Top 10 2026.

## 7. Recommended Priority Order for fixing
1. F37 P0 trusted HITL policy. 2. F44 P0 receipt-derived READY. 3. Block release while S48 remains P0/P1. 4. Durable idempotency/resource auth/exact-call approval. 5. Executed recovery + truthful sandbox. 6. Correct compaction/LKG and budget state machine. 7. Explicit trajectory/evaluator evidence. 8. Preserve S42/S48 invariants + minimum hostile tool-output boundary. 9. Fix E3 breach masking and diversify transfer. 10. Restore gate naming/topic evals/quiz/exam/redaction/resources/workload.

## 8. Graph Memory Update notes
- `S49-F37 → roadmap:S49-gate` — FALSE_HITL_GATE
- `S49-F44 → YouDo:READY` — FALSE_PROJECT_READINESS
- `S49-F18 → S49-F39` — IDEMPOTENCY_RECOVERY_DEPENDENCY
- `S49-F30 → T3B:compaction` — THEORY_PRACTICE_CONTRADICTION
- `S49-F20 → S42:authz` — BROKEN_PREREQUISITE_INVARIANT
- `S49-F28 → S48:authorized_retrieval` — BROKEN_PREREQUISITE_INVARIANT
- `S49-F22 → roadmap:prompt-injection-from-S49` — MISSING_CROSSCUTTING_CONTROL
- `S49-F41 → all:E3` — MISSING_FIRST_MASKS_BREACH
- `S49-F42 → S49-F43` — TEMPLATE_PATTERN_BLOCKS_TRANSFER
- `S49-F03 → roadmap:CP-N4-C@S51` — GATE_IDENTITY_CONFLICT

Fixer invariants:
- Sensitive-action policy is derived from trusted tool metadata + arguments/resource risk, never prefixes or caller-supplied approval_required.
- Human approval is bound to the exact call ID and normalized arguments and is revalidated immediately before execution.
- Project READY is derived from executed immutable receipts, never learner-edited booleans.
- Workflow-vs-agent ADR binds to a versioned task/baseline receipt and validates metric domains.
- Agent trajectories contain explicit plan steps, tool calls/results and evaluator receipts with nonnegative bounded counters.
- Tool SRP is evaluated by capability/effect scope; field count or self-reported responsibility is insufficient.
- Resource-level authorization is enforced inside/pre-tool execution; scope visibility alone is insufficient.
- Idempotency for effects uses a durable/atomic ledger and survives crash/concurrency.
- Tool output is untrusted context and receives minimum prompt-injection/guardrail treatment before re-entry to the agent.
- JIT context preserves S48 authorization/deletion/version/provenance invariants.
- Compaction may drop noise but preserves critical record values/provenance; LKG must exist, load and validate.
- Budget state distinguishes GOAL_MET, CONTINUE_WITHIN_BUDGET and STOP_BUDGET_EXHAUSTED and includes steps/tokens/cost.
- Recovery reconciles the effect ledger before new approval or execution.
- Known breach is never hidden by unrelated missing evidence.
- S49 is an increment toward CP-N4-C; official CP-N4-C closes at S51.
- Stable legacy id data-contracts remains compatibility-only.

Full granular JSON SHA-256: `eb4d05521b03909bf8f7cd032aa9bc079432a9bbb03a2d63b4fddc01b016a6ed`.

This is the complete Explorer report for Section 49. Ready for the Fixer prompt.