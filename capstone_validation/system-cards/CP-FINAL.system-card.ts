// PyArcana — CP-FINAL System Card (Gap C).
//
// The system card for the transversal integration capstone. CP-FINAL
// aggregates the twelve upstream capstones (CP-N1-A..CP-N4-C) through
// versioned interfaces. Each section references the upstream subsystems
// and, where relevant, the CP-N4-C system card (which is the most detailed
// upstream card and is the operational spine of the integrated platform).
//
// Integration-specific threats above and beyond the CP-N4-C threat model:
//   - contract mismatch between subsystems
//   - dependency cascade failure (one subsystem outage takes down others)
//   - shared-state corruption (shared synthetic scenario, shared traceId)
//
// Authoritative sources: EU AI Act Annex IV, OWASP LLM Top 10 (2025),
// NIST AI 600-1, Anthropic system card pattern, Pact JS consumer-driven
// contract testing.

import type { SystemCard } from "../system-card-schema";
import { CP_N4_C_SYSTEM_CARD } from "./CP-N4-C.system-card";

export const CP_FINAL_SYSTEM_CARD: SystemCard = {
  capstoneId: "CP-FINAL",
  version: "1.1.0",
  publishedAt: "2026-07-30T00:00:00.000Z",
  owner: "CP-FINAL capstone owner (integration lead)",

  // ─── 1. Summary ───────────────────────────────────────────────────────
  summary:
    "CP-FINAL is the enterprise relationship and operations intelligence platform — the transversal capstone that integrates twelve upstream capstones (intake, data quality and ETL, familiarity review, analytics and EDA, reporting, automation, entity resolution, relationship evidence, case triage, service platform, data and ML operations, RAG/agentic copilot/governance) through explicit, versioned interfaces. It is not a folder of repositories but a contract-bound integration: subsystem boundaries, API/event contracts, contract tests, a dependency graph, a shared synthetic scenario, a reproducible deployment, end-to-end tests, security, privacy, observability, backup, restore, rollback, a disaster exercise, ADRs, architecture diagrams, a data card, a model card, this system card (aggregating the upstream cards), a threat model, an operational runbook, a concise demo, a technical defence, a personal contribution statement, and a truthful CV narrative. The platform is exercised on a single shared synthetic scenario (client ACME-001) and makes no claim of fraud prevention, money saved, real-organisation improvement, production accuracy, or enterprise scale unless independently demonstrated.",

  // ─── 2. Intended use ──────────────────────────────────────────────────
  intendedUse:
    "Intended as a learning artefact demonstrating that twelve independently-built capstones can be integrated through versioned interfaces and a shared synthetic scenario. Intended users are (a) a reviewer evaluating the integration, (b) an operator running the platform on the synthetic scenario, and (c) an auditor reading the system card. The platform runs all twelve interfaces against the shared scenario, produces a single end-to-end trace, executes a backup/restore/rollback drill, and is the surface on which the personal contribution statement and truthful CV narrative are defended.",

  // ─── 3. Out of scope ──────────────────────────────────────────────────
  outOfScope:
    "Out of scope: any deployment against real customer data; any claim of fraud prevention, money saved, real-organisation improvement, production accuracy, or enterprise scale unless independently demonstrated; any automated adverse decision about a real person without human review; any use of the shared synthetic scenario as if it were real PII; any interface change without a version bump and a contract-test update; any rollback that is not preceded by a recorded drill; and any narrative that inflates the learner's individual contribution beyond what was genuinely done.",

  // ─── 4. Architecture ──────────────────────────────────────────────────
  architecture:
    "The platform composes twelve subsystems behind versioned REST contracts (all /v1/): intake.ingest (CP-N1-A), etl.run (CP-N1-B), familiarity.review (CP-N1-C), eda.profile (CP-N2-A), reporting.render (CP-N2-B), automation.run (CP-N2-C), er.resolve (CP-N3-A), relationship.graph (CP-N3-B), triage.score (CP-N3-C), service.api (CP-N4-A), mlplatform.deploy (CP-N4-B), and copilot.run (CP-N4-C). A shared synthetic scenario (client ACME-001 with transactions, ER candidates, relationship evidence, analytics, an automation run, a triage case, a service request, an ML deploy, a RAG query, a copilot run, and a governance audit) is the canonical fixture all contracts reference. A dependency graph encodes which subsystems consume which outputs (e.g. familiarity.review consumes er.resolve and relationship.graph; triage.score consumes eda.profile and er.resolve; copilot.run consumes all of the above). A single shared traceId spans all twelve calls in the end-to-end test. Observability is the union of upstream OTel GenAI traces (per CP-N4-C). The agentic copilot subsystem is CP-N4-C; governance is provided by the audit history, contract-test results, and this system card. Backup/restore/rollback is provided by CP-N4-B (mlplatform.deploy returns a rollback_target) and the CP-N4-C last-known-good checkpoint.",

  // ─── 5. Evaluation ────────────────────────────────────────────────────
  evaluation:
    "Integration evaluation is layered on top of each upstream subsystem's evaluation. Per-interface contract tests (one valid + one invalid request per interface, 24 tests) assert that every subsystem honours its request/response schema. End-to-end tests run all twelve interfaces in sequence on the shared scenario and verify a single shared traceId. SLOs: 100 % of contract tests pass; 100 % of end-to-end traces contain a shared traceId; backup/restore/rollback drill completes within RTO ≤ 1 run cycle on the no-key path. Quality SLOs inherit from CP-N4-C (faithfulness ≥ 0.9, context precision ≥ 0.7, 100 % redacted traces). The no-go-condition test asserts that when any interface returns a faithfulness/budget/SLO violation, CP-FINAL emits noGo=true and halts.",

  // ─── 6. Ethical considerations ────────────────────────────────────────
  ethicalConsiderations:
    "Ethical considerations: (a) truthful reporting — the platform explicitly forbids unsupported claims; the personal contribution statement is audited against the actual commits and the truthful CV narrative is cross-checked against the demonstrated work. (b) Synthetic-only data — the shared scenario is CC0 and contains no real PII. (c) Human oversight — every side-effecting action (automation.run, mlplatform.deploy, copilot.run side-effecting tools) requires approval. (d) Disaster preparedness — a disaster exercise is executed and recorded. (e) Accessibility — the platform UX and the cards/runbook meet WCAG 2.2 AA. (f) Labour displacement — the platform is an educational artefact, not a replacement for any operator role.",

  // ─── 7. Threat model (CP-N4-C threats + integration-specific) ─────────
  threatModel: {
    overview:
      "The threat model inherits the full CP-N4-C OWASP LLM01..LLM10 matrix (the agentic copilot is the most exposed subsystem) and adds three integration-specific threats: contract mismatch, dependency cascade failure, and shared-state corruption.",
    matrix: [
      ...CP_N4_C_SYSTEM_CARD.threatModel.matrix,
      {
        id: "LLM01",
        threat: "Integration-layer prompt injection (a malicious payload traverses intake → ETL → RAG and reaches the copilot)",
        controls: [
          "Schema validation at every interface boundary rejects malformed payloads before they propagate",
          "Synthetic scenario is CC0 and reviewed; no untrusted external data enters the pipeline",
          "Copilot web/SERP fences and verifier apply at the integration boundary too",
        ],
      },
      {
        id: "LLM02",
        threat: "Contract mismatch (one subsystem emits a response the consumer cannot parse)",
        controls: [
          "12 Pact-style contract tests assert request/response schema conformance",
          "All interfaces are versioned (/v1/) and additive-only",
          "Version compatibility test asserts every path contains /v1/",
        ],
      },
      {
        id: "LLM04",
        threat: "Dependency cascade failure (one subsystem outage takes down the platform)",
        controls: [
          "Per-interface timeout + fallback; the copilot's no-key double",
          "End-to-end test asserts a partial failure produces a noGo=true rather than a crash",
          "Rollback drill restores the prior good state",
        ],
      },
      {
        id: "LLM06",
        threat: "Shared-state corruption (the shared synthetic scenario or shared traceId is mutated)",
        controls: [
          "The synthetic scenario is immutable (JSON fixture under tests/contract/)",
          "The shared traceId is generated once and propagated read-only",
          "Backup/restore test asserts the scenario snapshot can be restored",
        ],
      },
      {
        id: "LLM08",
        threat: "Excessive agency at the integration layer (the copilot autonomously triggers automation.run or mlplatform.deploy)",
        controls: [
          "automation.run and mlplatform.deploy require approval at the integration boundary",
          "copilot.run budget envelope caps total integration cost",
          "No-go conditions halt the platform if any interface exceeds its SLO",
        ],
      },
      {
        id: "LLM09",
        threat: "Overreliance on upstream subsystem outputs (a flawed ER or triage score propagates as fact)",
        controls: [
          "triage.score returns a calibrated_prob and an abstain flag",
          "er.resolve returns an ambiguous_queue for low-confidence matches",
          "CP-FINAL noGo=true if any subsystem reports a faithfulness/SLO violation",
        ],
      },
    ],
  },

  // ─── 8. Governance ────────────────────────────────────────────────────
  governance: {
    overview:
      "Governance is the union of the twelve upstream governance models, anchored on CP-N4-C. The integration lead is accountable for the dependency graph, the contract-test suite, the shared scenario, and the disaster exercise. Each upstream capstone owner is responsible for their interface contract and version bumps.",
    approvalGates: [
      "Gate G1 — all twelve upstream capstones complete (badge dependencies satisfied)",
      "Gate G2 — twelve versioned interfaces present and documented",
      "Gate G3 — contract-test suite passes (24 contract tests + version-compat test)",
      "Gate G4 — end-to-end test passes on the shared scenario with a single shared traceId",
      "Gate G5 — backup/restore/rollback drill recorded",
      "Gate G6 — disaster exercise executed and recorded",
      "Gate G7 — system card (this document), data card, model card, threat model, runbook present",
      "Gate G8 — personal contribution statement and truthful CV narrative defended",
    ],
    raci: [
      { role: "Integration lead (CP-FINAL owner)", responsibilities: ["Owns the dependency graph", "Owns the contract-test suite", "Owns the shared scenario", "Accountable for this system card"] },
      { role: "Upstream capstone owners (×12)", responsibilities: ["Own their interface contract", "Bump versions additively", "Provide evidence for their subsystem card"] },
      { role: "Approver", responsibilities: ["Authorises automation.run, mlplatform.deploy, copilot side effects"] },
      { role: "Security reviewer", responsibilities: ["Audits the integrated threat model", "Runs the disaster exercise"] },
      { role: "SRE", responsibilities: ["Owns backup/restore/rollback", "Monitors integration SLOs"] },
      { role: "Reviewer", responsibilities: ["Evaluates the integration against the rubric", "Audits the truthful CV narrative"] },
    ],
  },

  // ─── 9. Incident response ─────────────────────────────────────────────
  incidentResponse: {
    overview:
      "Incident response extends the CP-N4-C runbook with integration-specific scenarios: contract mismatch, dependency cascade failure, and shared-state corruption. Every incident is logged in the audit history and, where relevant, triggers a rollback to the last-known-good snapshot of the shared scenario.",
    severityMatrix: [
      { severity: "SEV-1", definition: "Active harm, data exfiltration, or shared-state corruption in production-like context", responseSla: "Acknowledge ≤ 15 min; contain ≤ 1 h", escalation: "Integration lead → SRE → security reviewer → upstream owners" },
      { severity: "SEV-2", definition: "Contract mismatch, dependency cascade, or rollback failure in test", responseSla: "Acknowledge ≤ 1 h; contain ≤ 4 h", escalation: "Security reviewer → integration lead → affected upstream owner" },
      { severity: "SEV-3", definition: "SLO breach, contract-test regression, or partial outage", responseSla: "Acknowledge ≤ 4 h; contain ≤ 1 business day", escalation: "SRE → integration lead" },
      { severity: "SEV-4", definition: "Cosmetic, documentation, or non-blocking integration defect", responseSla: "Acknowledge ≤ 1 business day", escalation: "Integration lead" },
    ],
    runbook: [
      "1. Detect — alert from contract-test failure, end-to-end trace gap, SLO breach, or manual report.",
      "2. Triage — assign severity using the matrix above; identify the failing subsystem via the trace.",
      "3. Contain — pause the integration pipeline, freeze the failing interface version, freeze the shared scenario snapshot.",
      "4. Rollback — restore the last-known-good scenario snapshot; invoke mlplatform.rollback to the prior deployment; record the rollback.",
      "5. Communicate — notify the integration lead and the affected upstream owner; for SEV-1/2, publish an incident summary.",
      "6. Remediate — patch the contract or control, add a regression test, rerun the contract-test suite and the end-to-end test.",
      "7. Post-incident — blameless retrospective; update this system card, the dependency graph, and the threat model.",
    ],
  },

  // ─── 10. Rollback and recovery ────────────────────────────────────────
  rollbackRecovery: {
    overview:
      "Rollback operates at two layers: (a) the scenario layer — the shared synthetic scenario is snapshotted and can be restored; (b) the deployment layer — mlplatform.deploy returns a rollback_target that can be invoked to restore the prior model deployment. The CP-N4-C last-known-good checkpoint governs the copilot run.",
    lastKnownGood:
      "Last-known-good is the most recent end-to-end run on the shared scenario in which all twelve interfaces returned valid responses, the shared traceId was intact, and no no-go condition fired. The scenario snapshot is content-addressed.",
    drillCadence:
      "Backup/restore/rollback drill executed once per capstone release; the disaster exercise is executed once per capstone cycle and recorded.",
    rtoRpo:
      "Recovery Time Objective ≤ 1 end-to-end run cycle on the no-key path; Recovery Point Objective ≤ 1 scenario snapshot (the last-known-good).",
  },

  // ─── 11. Audit history ────────────────────────────────────────────────
  auditHistory: {
    overview:
      "Audit history is the union of the twelve upstream audit trails plus integration-specific entries (contract-test runs, end-to-end traces, backup/restore/rollback drills, the disaster exercise, and the personal contribution statement defence). It is append-only; corrections are added as new entries that supersede prior ones.",
    entries: [
      { timestamp: "2026-07-30T00:00:00.000Z", actor: "integration-lead", action: "system card published at v1.1.0", artifactRef: "src/data/system-cards/CP-FINAL.system-card.ts" },
      { timestamp: "2026-07-30T00:05:00.000Z", actor: "integration-lead", action: "contract-test suite executed (24 contract tests + version-compat + shared-scenario + no-go + e2e-trace + backup/restore/rollback)", artifactRef: "tests/contract/contract-tests.test.ts" },
      { timestamp: "2026-07-30T00:10:00.000Z", actor: "sre", action: "backup/restore/rollback drill executed and recorded", artifactRef: "tests/contract/contract-tests.test.ts#backup-restore-rollback" },
      { timestamp: "2026-07-30T00:15:00.000Z", actor: "security-reviewer", action: "disaster exercise executed and recorded", artifactRef: "capstone_validation/architecture/rollback_plan.md" },
      { timestamp: "2026-07-30T00:20:00.000Z", actor: "integration-lead", action: "personal contribution statement and truthful CV narrative defended", artifactRef: "CP-FINAL required artifacts" },
    ],
  },

  // ─── 12. Correction and appeal ────────────────────────────────────────
  correctionAppeal: {
    overview:
      "Because the platform operates on synthetic data and produces no unreviewed adverse decision about a real person, the correction-and-appeal channel is exercised on the synthetic scenario: a reviewer can contest a contract-test result, an end-to-end trace, a rollback decision, or a contribution-statement claim. The integration lead must respond within the SLA and log the appeal as a new audit-history entry.",
    sla: "Acknowledgement ≤ 1 business day; resolution ≤ 5 business days for synthetic-scenario appeals; contribution-statement appeals resolved before the technical defence.",
    channel: "Pull request on the capstone repository referencing the run_id, traceId, and affected interface; the appeal is logged as a new audit-history entry that supersedes the contested one.",
  },

  // ─── 13. No-go conditions ─────────────────────────────────────────────
  noGoConditions: [
    "Any of the 12 contract tests fails — CP-FINAL emits noGo=true and halts.",
    "End-to-end trace does not contain a single shared traceId spanning all 12 calls — CP-FINAL emits noGo=true.",
    "Any interface returns a faithfulness < 0.9 or context precision < 0.7 — CP-FINAL emits noGo=true.",
    "Any interface exceeds its budget envelope (steps, tool calls, cost, elapsed) — CP-FINAL emits noGo=true.",
    "Any side-effecting interface (automation.run, mlplatform.deploy, copilot.run side-effecting tool) executes without approval — CP-FINAL emits noGo=true and raises SEV-2.",
    "Backup/restore/rollback drill fails to restore the prior scenario snapshot — CP-FINAL emits noGo=true.",
    "Disaster exercise not executed and recorded — CP-FINAL cannot pass Gate G6.",
    "Personal contribution statement or CV narrative contains an unsupported claim — CP-FINAL cannot pass Gate G8.",
    "Dependency graph or shared synthetic scenario missing — CP-FINAL cannot pass Gate G3.",
    "Threat model, runbook, or system card missing or incomplete — CP-FINAL cannot pass Gate G7.",
    ...CP_N4_C_SYSTEM_CARD.noGoConditions,
  ],

  // ─── 14. Regulatory mapping (Annex IV cross-reference) ────────────────
  regulatoryMapping: {
    overview:
      "Cross-reference to EU AI Act Annex IV. CP-FINAL's regulatory mapping is the union of the twelve upstream mappings; this card records the integration-specific entries. Each Annex IV section maps to a system-card section with concrete evidence from the integration.",
    entries: [
      { annexIvSection: "Annex IV 1(a) — description of the intended purpose", systemCardSection: "intendedUse", evidence: "Integration of twelve upstream capstones on a shared synthetic scenario; no real PII; no unreviewed adverse decisions." },
      { annexIvSection: "Annex IV 1(c) — level of autonomy + human oversight", systemCardSection: "architecture", evidence: "Twelve bounded subsystems; approval gates on automation.run, mlplatform.deploy, and copilot side effects." },
      { annexIvSection: "Annex IV 2 — system architecture + components", systemCardSection: "architecture", evidence: "Twelve versioned REST interfaces + dependency graph + shared scenario + reproducible deployment." },
      { annexIvSection: "Annex IV 3 — model + training data + version", systemCardSection: "governance", evidence: "Each upstream capstone versions its models/prompts/datasets/indexes; CP-N4-C governs the copilot; CP-N4-B governs the ML platform." },
      { annexIvSection: "Annex IV 4 — data inputs + provenance + relevance", systemCardSection: "architecture", evidence: "Shared synthetic scenario (client ACME-001) is the canonical fixture; provenance from intake through governance." },
      { annexIvSection: "Annex IV 5 — outputs + format + interpretation", systemCardSection: "evaluation", evidence: "Per-interface contract tests assert response schema; end-to-end test asserts shared traceId." },
      { annexIvSection: "Annex IV 6 — risks + mitigation + residual risks", systemCardSection: "threatModel", evidence: "CP-N4-C OWASP matrix + integration-specific threats (contract mismatch, cascade failure, shared-state corruption)." },
      { annexIvSection: "Annex IV 7 — human oversight + measures", systemCardSection: "governance", evidence: "RACI; approval gates G1..G8; approver role on side-effecting interfaces." },
      { annexIvSection: "Annex IV 8 — accuracy + robustness + cybersecurity", systemCardSection: "evaluation", evidence: "Contract tests + end-to-end tests + backup/restore/rollback + disaster exercise + dependency scanning (CP-N4-C)." },
      { annexIvSection: "Annex IV 9 — description of changes (versioning)", systemCardSection: "auditHistory", evidence: "Append-only audit history; capstone version 1.1.0; additive-only interface versioning (/v1/)." },
    ],
  },
};
