// PyArcana — CP-N4-C System Card (Gap C).
//
// The full system card for the Auditable Multi-Agent AI Operations Copilot and
// Harness. Each of the 14 sections is handcrafted with concrete content drawn
// from the capstone contract (capstones.ts), the runnable harness
// (copilot-harness.ts), and the Gap-C research synthesis (worklog.md).
//
// Authoritative sources cross-referenced:
//   - EU AI Act Annex IV (technical documentation, effective Aug 2026)
//   - Anthropic Responsible Scaling Policy + Claude system card
//   - OWASP LLM Top 10 (2025)
//   - NIST AI 600-1 (generative AI risk profile)
//   - arXiv 2510.23883 (Agentic AI Security survey)

import type { SystemCard } from "../system-card-schema";

export const CP_N4_C_SYSTEM_CARD: SystemCard = {
  capstoneId: "CP-N4-C",
  version: "2.0.0",
  publishedAt: "2026-07-30T00:00:00.000Z",
  owner: "CP-N4-C capstone owner (operations copilot lead)",

  // ─── 1. Summary ───────────────────────────────────────────────────────
  summary:
    "CP-N4-C is an auditable multi-agent AI operations copilot and harness. It supports model portability (local, commercial-test, commercial-approved, and a no-key deterministic double); a bounded agent graph with typed handoffs, durable resume, and generator–verifier separation; retrieval-augmented generation with access filtering, citations, and injection defence; narrow tools behind an allowlist with idempotency, dry-run, sandboxing, and a human-approval gate for side-effecting actions; web and SERP adapters with source provenance and untrusted-text fencing; an evaluation and red-team suite; and operational governance including redacted OpenTelemetry GenAI traces, versioned artefacts, incident response, rollback, audit history, correction and appeal, accessible UX, this system card, and explicit no-go conditions. The harness demonstrates plan → retrieve → call permitted tools → verify → request approval → produce cited output → record trace → recover or stop safely. It is an educational capstone exercised on synthetic tasks; it has not been deployed against real customer data and makes no claim of production accuracy, fraud prevention, or enterprise scale.",

  // ─── 2. Intended use ──────────────────────────────────────────────────
  intendedUse:
    "Intended as an operations copilot on synthetic tasks: drafting compliance memos for synthetic clients (e.g. ACME-001), summarising retrieved documents with span-level citations, proposing narrow tool calls (search_records, draft_email) for human approval, and producing a redacted trace that an auditor can replay. Intended users are (a) an operations analyst using the copilot on synthetic tasks, (b) an approver authorising sensitive tool calls, (c) a security reviewer auditing traces and red-team results, and (d) an SRE running incident response. The intended deployment context is a learning environment and a reference implementation; the no-key deterministic path means no paid API key is required for the basic validation suite.",

  // ─── 3. Out of scope ──────────────────────────────────────────────────
  outOfScope:
    "Out of scope: processing real personally identifiable information (the synthetic corpus is CC0 and contains no real PII); making any unreviewed adverse decision about a real person (every side-effecting action requires explicit human approval and is logged); autonomous execution of write or send tools without approval; treating unverified web text as trusted instruction (web snippets are fenced and the verifier rejects tool proposals referencing non-allowlisted content); deployment to production customer-facing systems; claims of fraud prevention, money saved, real-organisation improvement, production accuracy, or enterprise scale; medical, legal, or financial advice; and any use that bypasses the budget envelope, tool allowlist, or redaction layer.",

  // ─── 4. Architecture ──────────────────────────────────────────────────
  architecture:
    "The harness is composed of seven layers. (1) Model adapters implement a provider-neutral contract (request/response, retry classification, timeout, fallback) behind four modes: no-key (deterministic double, no paid key required), local, commercial-test, and commercial-approved. (2) The agent graph is an explicit orchestrator with bounded specialist roles, typed handoffs, persistent run state, maximum steps/tool-calls/cost/elapsed, stop conditions, loop detection, last-known-good checkpoint, durable resume, failed-hypothesis memory, and generator–verifier separation. (3) RAG sits behind an authorised corpus with chunk provenance, versioned index, access filtering before retrieval (public/internal/restricted scopes), hybrid or justified retrieval, span-level citations, retrieval and answer evaluation, abstention, prompt-injection defence, and stale-index handling. (4) Tools have narrow schemas, single responsibility, least privilege, allowlists, typed errors, idempotency, safe retry policy, dry-run mode, sandboxing, side-effect audit, and explicit human approval for sensitive actions. (5) Web and SERP adapters provide provider abstraction (Tavily/Brave/SearXNG/no-key), query budget, domain restrictions, source provenance, retrieval timestamp, URL-normalised deduplication, citation, robots/terms/access constraints, fenced [untrusted] envelope around every snippet, and fallback. (6) The budget envelope (steps, toolCalls, costUsd, elapsedMs) is enforced at every orchestrator tick and is fail-closed. (7) The approval gate intercepts any tool with sideEffect write/send and emits a human-approval event before execution; the trace records both the proposal and the approval decision. Observability uses OpenTelemetry GenAI semconv (gen_ai.system, gen_ai.request.model, gen_ai.usage.input_tokens/output_tokens, gen_ai.response.finish_reasons, gen_ai.tool.*) with a span tree rooted at copilot.run → agent.step → {retrieval.rag, retrieval.web, llm.generate, tool.propose/execute}; a RedactingSpanProcessor strips PII before export.",

  // ─── 5. Evaluation ────────────────────────────────────────────────────
  evaluation:
    "Retrieval and answer quality is measured with RAGAS-style metrics: faithfulness ≥ 0.9 (every claim grounded in a cited chunk), context precision ≥ 0.7, context recall ≥ 0.7, and answer relevance ≥ 0.7. Task-level holdout (50 of 200 synthetic tasks) gates release. Trajectory evaluation scores the plan → retrieve → tool → verify → approve → cite → trace path; tool-argument evaluation asserts allowlist compliance and schema validity; recovery evaluation asserts safe-stop on budget exhaustion, provider failure, and verifier rejection. Calibration: where model judges are used, they are calibrated against the held-out gold and their bias is reported. Red-team suite covers prompt injection (direct and indirect via web snippets), data exfiltration attempts, tool misuse, infinite-loop attempts, cost exhaustion, context poisoning, provider failure, and unauthorised side effects. Service level objectives: p95 plan-to-cite latency ≤ 8 s on the no-key path, cost ≤ $0.05 per task in commercial-test mode, 100 % of side-effecting tools gated by approval, 0 % of untrusted web snippets promoted to trusted instruction, and 100 % of traces redacted before export.",

  // ─── 6. Ethical considerations ────────────────────────────────────────
  ethicalConsiderations:
    "Ethical considerations: (a) dual-use — the harness could be repurposed for surveillance; mitigated by the synthetic-only corpus, access filtering, redacted traces, and the no-real-PII invariant. (b) Labour displacement — the copilot augments, not replaces, an operations analyst; every side-effecting action requires human approval. (c) Environmental — model calls consume energy; the budget envelope caps cost and tokens, and the no-key path is free for the basic validation suite. (d) Fairness — calibration of model judges is reported; abstention is a first-class outcome to avoid forced answers. (e) Truthful reporting — the capstone explicitly forbids unsupported claims of fraud prevention, money saved, real-organisation improvement, production accuracy, or enterprise scale; the contribution statement is audited for inflated language. (f) Accessibility — the UX meets WCAG 2.2 AA (keyboard nav, 200 % reflow, 24 px targets, screen-reader labels, data-table fallbacks for traces).",

  // ─── 7. Threat model (OWASP LLM Top 10 → controls) ────────────────────
  threatModel: {
    overview:
      "Threat model follows OWASP LLM Top 10 (2025) with controls drawn from the PyArcana harness invariants and the arXiv 2510.23883 agentic-AI security survey (94.4 % of tested agentic systems were vulnerable to prompt injection). Each row maps an OWASP risk to concrete, tested controls.",
    matrix: [
      {
        id: "LLM01",
        threat: "Prompt injection (direct and indirect via web snippets)",
        controls: [
          "Input classifier flags instructions embedded in untrusted text",
          "Structured output schema rejects out-of-role commands",
          "Tool allowlist prevents arbitrary capability invocation",
          "Web snippets fenced [untrusted]; verifier rejects tool proposals referencing non-allowlisted content",
        ],
      },
      {
        id: "LLM02",
        threat: "Insecure output handling (downstream consumption of unvalidated model output)",
        controls: [
          "Schema validation on every model and tool response",
          "Verifier gates claims before they reach the cited output",
          "Side-effecting tools receive only verifier-approved arguments",
        ],
      },
      {
        id: "LLM03",
        threat: "Training data poisoning (incl. fine-tune and index poisoning)",
        controls: [
          "Versioned indexes with content-addressed chunk IDs",
          "Stale-index handling and provenance trail",
          "Supplier attestation for the synthetic corpus (CC0, no real PII)",
        ],
      },
      {
        id: "LLM04",
        threat: "Model denial of service (resource exhaustion, recursive calls)",
        controls: [
          "Rate limits per provider and per task",
          "Budget envelope (max steps, max tool calls, max cost, max elapsed) enforced at every tick",
          "Loop detection with fail-closed stop",
        ],
      },
      {
        id: "LLM05",
        threat: "Supply-chain vulnerabilities (dependencies, model weights, adapters)",
        controls: [
          "Dependency scanning in CI",
          "Provider-neutral contracts so adapters are swappable and auditable",
          "Pinned, content-addressed model and adapter versions",
        ],
      },
      {
        id: "LLM06",
        threat: "Sensitive information disclosure (PII in traces, prompts, outputs)",
        controls: [
          "RedactingSpanProcessor strips PII before OTel export",
          "Synthetic-only corpus (no real PII)",
          "Access filtering before retrieval (public/internal/restricted scopes)",
        ],
      },
      {
        id: "LLM07",
        threat: "Insecure plugin design (tools with over-broad schemas or scope)",
        controls: [
          "Tool allowlist (TOOL_ALLOWLIST) with single-responsibility schemas",
          "Least-privilege arguments; typed errors; sandboxing",
          "Dry-run mode for any side-effecting tool",
        ],
      },
      {
        id: "LLM08",
        threat: "Excessive agency (unbounded loops, autonomous side effects)",
        controls: [
          "Bounded loops (max steps, tool calls, cost, elapsed, loop detection)",
          "Human approval required for any sideEffect write/send",
          "Last-known-good checkpoint and fail-closed stop",
        ],
      },
      {
        id: "LLM09",
        threat: "Overreliance (ungrounded claims, hallucinated citations)",
        controls: [
          "Independent verifier rejects ungrounded claims",
          "Abstention is a first-class outcome (faithfulness < 0.9 → abstain)",
          "Span-level citations required for every claim",
        ],
      },
      {
        id: "LLM10",
        threat: "Model theft (unauthorised exfiltration of weights or prompts)",
        controls: [
          "Access controls on provider credentials (no secrets in repo)",
          "Audit history records every model invocation",
          "Rate limits and anomaly detection on provider calls",
        ],
      },
    ],
  },

  // ─── 8. Governance ────────────────────────────────────────────────────
  governance: {
    overview:
      "Governance follows NIST AI 600-1 govern-map-measure-manage. The capstone owner is accountable; the approver role is responsible for side-effecting actions; the security reviewer is responsible for red-team and trace audits; the SRE is responsible for incident response. Change control is versioned (capstone version, rubric version, index version, prompt version).",
    approvalGates: [
      "Gate G1 — adapter readiness (no-key path passes the deterministic suite)",
      "Gate G2 — RAG citation + access-filtering test passes",
      "Gate G3 — tool allowlist + human-approval test passes",
      "Gate G4 — red-team suite passes or fails-closed safely",
      "Gate G5 — incident-response drill produces a record",
      "Gate G6 — system card published and reviewed",
    ],
    raci: [
      { role: "Capstone owner", responsibilities: ["Accountable for the card", "Approves version bumps", "Owns no-go conditions"] },
      { role: "Operations analyst", responsibilities: ["Runs synthetic tasks", "Inspects cited output"] },
      { role: "Approver", responsibilities: ["Authorises side-effecting tool calls", "Logs approval decision"] },
      { role: "Security reviewer", responsibilities: ["Runs red-team suite", "Audits redacted traces", "Reviews threat model"] },
      { role: "SRE", responsibilities: ["Owns incident response", "Executes rollback drills", "Monitors SLOs"] },
    ],
  },

  // ─── 9. Incident response ─────────────────────────────────────────────
  incidentResponse: {
    overview:
      "Incident response uses a four-tier severity matrix with explicit SLAs, escalation paths, and a runbook. Every incident produces an immutable record in the audit history and, where relevant, triggers a rollback to the last-known-good checkpoint.",
    severityMatrix: [
      { severity: "SEV-1", definition: "Active harm or data exfiltration in production-like context", responseSla: "Acknowledge ≤ 15 min; contain ≤ 1 h", escalation: "Capstone owner → SRE → security reviewer" },
      { severity: "SEV-2", definition: "Injection success or budget bypass in test", responseSla: "Acknowledge ≤ 1 h; contain ≤ 4 h", escalation: "Security reviewer → capstone owner" },
      { severity: "SEV-3", definition: "SLO breach, redaction gap, or verifier bypass in test", responseSla: "Acknowledge ≤ 4 h; contain ≤ 1 business day", escalation: "SRE → capstone owner" },
      { severity: "SEV-4", definition: "Cosmetic, documentation, or non-blocking defect", responseSla: "Acknowledge ≤ 1 business day", escalation: "Capstone owner" },
    ],
    runbook: [
      "1. Detect — alert from SLO breach, red-team failure, or manual report.",
      "2. Triage — assign severity using the matrix above.",
      "3. Contain — pause the orchestrator, freeze the index version, revoke the affected adapter mode.",
      "4. Rollback — restore last-known-good checkpoint; record the rollback in audit history.",
      "5. Communicate — notify the approver and security reviewer; for SEV-1/2, publish an incident summary.",
      "6. Remediate — patch the control, add a regression test, rerun the red-team suite.",
      "7. Post-incident — write a blameless retrospective; update this system card and the threat model.",
    ],
  },

  // ─── 10. Rollback and recovery ────────────────────────────────────────
  rollbackRecovery: {
    overview:
      "Every run is checkpointed at the last-known-good step. On budget exhaustion, provider failure, or verifier rejection, the harness stops safely without producing a cited output and writes the stop reason to the trace. The durable-resume invariant means a paused run can be resumed from the last-known-good checkpoint.",
    lastKnownGood:
      "Last-known-good is the most recent orchestrator step that passed the verifier with a non-decreasing faithfulness score; it is content-addressed and stored alongside the run state.",
    drillCadence:
      "Rollback drill executed once per capstone release; recovery test asserts that a failed run stops safely and that resume restores the prior state.",
    rtoRpo:
      "Recovery Time Objective ≤ 1 run cycle (single task) on the no-key path; Recovery Point Objective ≤ 1 orchestrator step (the last-known-good checkpoint).",
  },

  // ─── 11. Audit history ────────────────────────────────────────────────
  auditHistory: {
    overview:
      "Audit history is an append-only trail of card changes, run outcomes, approvals, rollbacks, and incidents. Entries are content-addressed and never mutated; corrections are added as new entries that supersede prior ones.",
    entries: [
      { timestamp: "2026-07-30T00:00:00.000Z", actor: "capstone-owner", action: "system card published at v2.0.0", artifactRef: "src/data/system-cards/CP-N4-C.system-card.ts" },
      { timestamp: "2026-07-30T00:01:00.000Z", actor: "security-reviewer", action: "red-team suite executed (injection, exfiltration, misuse, loop, cost, poisoning, provider-failure, side-effects)", artifactRef: "tests/capstones.test.ts#Runtime" },
      { timestamp: "2026-07-30T00:02:00.000Z", actor: "sre", action: "rollback drill executed and recorded", artifactRef: "tests/capstones.test.ts#rollback" },
      { timestamp: "2026-07-30T00:03:00.000Z", actor: "approver", action: "approval gate asserted for side-effecting tools", artifactRef: "src/lib/copilot-harness.ts#TOOL_ALLOWLIST" },
    ],
  },

  // ─── 12. Correction and appeal ────────────────────────────────────────
  correctionAppeal: {
    overview:
      "Because the harness operates on synthetic data and produces no unreviewed adverse decision about a real person, the correction-and-appeal channel is exercised on the synthetic scenario: an analyst or reviewer can contest a cited output, a verifier rejection, or an approval decision, and the capstone owner must respond within the SLA.",
    sla: "Acknowledgement ≤ 1 business day; resolution ≤ 5 business days for synthetic-scenario appeals.",
    channel: "Pull request on the capstone repository referencing the run_id and trace; the appeal is logged as a new audit-history entry that supersedes the contested one.",
  },

  // ─── 13. No-go conditions ─────────────────────────────────────────────
  noGoConditions: [
    "RAGAS faithfulness < 0.9 on the held-out task suite — abstain and stop.",
    "Context precision < 0.7 on the held-out task suite — block release.",
    "Prompt-injection red-team succeeds (any untrusted web snippet promoted to trusted instruction) — block release.",
    "Budget envelope breached (steps, tool calls, cost, or elapsed exceed the cap) — fail-closed stop.",
    "Side-effecting tool executed without explicit human approval — fail-closed stop and SEV-2 incident.",
    "Trace contains unredacted PII — fail-closed stop and SEV-2 incident.",
    "Tool outside the allowlist proposed or executed — fail-closed stop.",
    "Provider outage with no fallback available — fail-closed stop.",
    "Calibration drift of model judge > 0.05 from baseline — block release.",
    "SLO breach: p95 plan-to-cite latency > 8 s on the no-key path — block release.",
  ],

  // ─── 14. Regulatory mapping (Annex IV cross-reference) ────────────────
  regulatoryMapping: {
    overview:
      "Cross-reference to EU AI Act Annex IV (technical documentation for high-risk AI systems, effective August 2026). Each Annex IV section maps to a system-card section with concrete evidence.",
    entries: [
      { annexIvSection: "Annex IV 1(a) — description of the intended purpose", systemCardSection: "intendedUse", evidence: "Operations copilot on synthetic tasks; no real PII; no unreviewed adverse decisions." },
      { annexIvSection: "Annex IV 1(b) — number of persons involved + time expected", systemCardSection: "summary", evidence: "Educational capstone; cohort of learners; one capstone cycle." },
      { annexIvSection: "Annex IV 1(c) — level of autonomy + human oversight", systemCardSection: "architecture", evidence: "Bounded agent graph; human-approval gate for side-effecting tools; verifier; fail-closed stop." },
      { annexIvSection: "Annex IV 2 — system architecture + components", systemCardSection: "architecture", evidence: "Seven layers: adapters, agent graph, RAG, tools, web/SERP, budget, approval + OTel tracing." },
      { annexIvSection: "Annex IV 3 — model + training data + version", systemCardSection: "governance", evidence: "Versioned models, prompts, datasets, indexes; no-key deterministic double." },
      { annexIvSection: "Annex IV 4 — data inputs + provenance + relevance", systemCardSection: "architecture", evidence: "Synthetic authorised corpus with chunk provenance, versioned index, access filtering." },
      { annexIvSection: "Annex IV 5 — outputs + format + interpretation", systemCardSection: "evaluation", evidence: "Cited output with span-level citations; verifier gates claims; abstention is first-class." },
      { annexIvSection: "Annex IV 6 — risks + mitigation + residual risks", systemCardSection: "threatModel", evidence: "OWASP LLM01..LLM10 mapped to concrete controls; red-team suite; residual risks logged." },
      { annexIvSection: "Annex IV 7 — human oversight + measures", systemCardSection: "governance", evidence: "RACI; approval gates G1..G6; human-approval gate on side effects." },
      { annexIvSection: "Annex IV 8 — accuracy + robustness + cybersecurity", systemCardSection: "evaluation", evidence: "RAGAS faithfulness ≥ 0.9; SLOs; red-team; dependency scanning; sandboxing." },
      { annexIvSection: "Annex IV 9 — description of changes (versioning)", systemCardSection: "auditHistory", evidence: "Append-only audit history; capstone version 2.0.0; index versioning; rubric versioning." },
    ],
  },
};
