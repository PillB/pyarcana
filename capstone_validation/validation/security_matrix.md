# Security matrix

> Governing spec Section 7 (Security/privacy/responsible-use) and Section 13
> (Harness Artifacts / Validation).
> Source of truth: `src/data/capstones.ts` (per-capstone
> `securityRequirements`, `privacyRequirements`, `responsibleUseRequirements`,
> `testRequirements`), `src/lib/copilot-harness.ts` (runtime enforcement),
> `src/data/rubrics.ts` (`COMMON_CRITICAL_FAILURES` + per-capstone extras).

## 1. Synthetic data only

Every capstone's `syntheticDataContract` declares:

- `generator` — how the data is produced (no real PII).
- `schema` — fields and types.
- `size` — row count / volume.
- `license` — `Synthetic / CC0`.
- `piiRisk` — explicit PII risk statement (e.g. *"No real PII; documents and
  queries are synthetic"* for CP-N4-C).

The CP-N4-C harness ships a `DEFAULT_CORPUS` of three synthetic docs with
explicit access scopes (`public`, `internal`, `restricted`). No real PII
anywhere in the repository.

## 2. No secrets

- `COMMON_CRITICAL_FAILURES` includes *"Committed secret or credential in the
  repository or logs."* — automatic fail for every capstone.
- The harness's `redact()` masks emails, SSN-like patterns, card-like patterns,
  and ID-like patterns in every emitted trace.
- Commercial-test adapter reads `PYARCANA_COMMERCIAL_TEST_KEY` from the
  environment; the key is never logged and the adapter falls back to the
  deterministic double if the key is absent.

## 3. Tool allowlists

- `TOOL_ALLOWLIST = new Set(["draft_email", "lookup_client", "compute_metric"])`.
- `TOOL_REGISTRY` declares each tool's `sideEffect`, `idempotent`, `sandboxed`,
  `requiresApproval`.
- `proposeTool()` only proposes allowlisted tools; a non-allowlisted proposal
  stops the run safely (`stopReason = "tool-not-allowlisted"`).

## 4. Sandboxing

- Every tool in `TOOL_REGISTRY` has `sandboxed: true`.
- The orchestrator does not execute tools directly in the demo path; it proposes
  them and routes side-effecting ones through the approval gate.

## 5. Injection defence

- `retrieve()` filters by `accessibleScope()` before retrieval — a user with
  `internal` scope cannot retrieve `restricted` chunks.
- `verify()` enforces citation grounding (faithfulness ≥ 0.90) — ungrounded
  claims are rejected and no cited output is produced.
- Web/SERP content is never treated as trusted instruction (CP-N4-C acceptance
  criterion and rubric critical failure *"web content treated as trusted
  instruction"*).
- The red-team suite (CP-N4-C.2) covers injection attacks, data exfiltration
  attempts, tool misuse, infinite-loop attempts, cost exhaustion, context
  poisoning, provider failure, and unauthorised side effects.

## 6. Redaction

- `redact(text)` masks:
  - emails: `[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}` → `[REDACTED]`
  - SSN-like: `\b\d{3}-\d{2}-\d{4}\b` → `[REDACTED]`
  - card-like: `\b(?:\d[ -]*?){13,16}\b` → `[REDACTED]`
  - ID-like: `\b[A-Z]{2}\d{6,}\b` → `[REDACTED]`
- Applied to every emitted span in `runHarness()` and to the entire trace
  returned by `runCopilotHarness()`.

## 7. Human approval

- Tools with `sideEffect ∈ {write, send}` require `opts.approved === true` before
  a cited output is produced.
- Without approval, the run stops safely (`stopReason = "approval-withheld"`)
  and the cited output is replaced with: *"Run stopped safely: verifier
  rejected the draft or approval was not granted. No cited output produced."*
- The UI presents the approval gate interactively; programmatic runs without
  approval never execute the side effect.

## 8. Per-capstone critical failures (non-compensatory)

Beyond the common critical failures, each capstone that handles sensitive
ground adds extra critical failures (see
`rubrics/critical_failure_matrix.json`):

- CP-N1-C: familiarity dashboard collapsing ER evidence with relationship/risk
  decisions; automatic inference of fraud/kinship/collusion/criminal
  association/beneficial ownership/causal relationship.
- CP-N2-B: misleading axes, colour-only encoding, hidden denominators, stale
  results.
- CP-N2-C: automatic external send without approval; no separation between draft
  and send.
- CP-N3-A: automatic relationship or fraud inference from ER output.
- CP-N3-B: visual edge without source/meaning/age/authorisation/correction path.
- CP-N3-C: unreviewed adverse decision; data leakage; no abstention or
  human-review route.
- CP-N4-A: local-only demo that cannot reproduce in a clean environment.
- CP-N4-B: rollback documented but never executed; train/serve skew unresolved.
- CP-N4-C: agent without bounded loops; RAG without citations or access
  controls; web content treated as trusted instruction; polished chatbot
  without the harness controls; no-key path missing; mandatory paid key for the
  basic validation suite.
- CP-FINAL: final project as a folder of twelve unrelated repositories without
  explicit interfaces; unsupported claims about fraud prevention / money saved
  / real-organisation improvement / production accuracy / enterprise scale.
