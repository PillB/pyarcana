import type { Rubric } from "./types";

// Every principal capstone ships a versioned rubric with the same nine
// criterion families (per spec Section 8). Critical criteria are
// non-compensatory: failing one means the capstone cannot pass, regardless
// of the overall score. The pass threshold is 80% by default.

const COMMON_CRITICAL_FAILURES = [
  "Use of real confidential, personal, employer-owned or regulated information.",
  "Committed secret or credential in the repository or logs.",
  "Unsafe SQL or unparameterised query that enables injection.",
  "Public sensitive attachment or unredacted PII in outputs.",
  "Automatic unsupported fraud, kinship, collusion, criminal-association, beneficial-ownership or causal-relationship inference.",
  "Unapproved external side effect (email send, API call, file mutation).",
  "Fabricated test evidence or a ledger substituted for execution evidence.",
  "Inaccessible core workflow (no keyboard operation, colour-only encoding).",
  "Unresolved critical security, privacy or responsible-use defect.",
  "Final demonstration that cannot be reproduced from the artifact repo.",
];

function baseCriteria(extra: { id: string; name: string; critical?: boolean }[] = []): Rubric["criteria"] {
  const core: Rubric["criteria"] = [
    { id: "F", name: "Functional correctness", weight: 0.18, critical: false, levels: [
      { level: "Excellent", description: "All acceptance criteria pass on the canonical fixtures." },
      { level: "Adequate", description: "Core paths pass; minor edge cases fail with a clear reason." },
      { level: "Insufficient", description: "Core paths fail or behave non-deterministically." },
    ]},
    { id: "D", name: "Data and failure handling", weight: 0.12, critical: true, levels: [
      { level: "Excellent", description: "Malformed input quarantined; denominators correct; failures explained." },
      { level: "Adequate", description: "Failures handled but reasons are thin." },
      { level: "Insufficient", description: "Failures crash the program or lose data." },
    ]},
    { id: "T", name: "Testing (normal, boundary, failure)", weight: 0.14, critical: true, levels: [
      { level: "Excellent", description: "Normal, boundary and failure tests present and passing." },
      { level: "Adequate", description: "Happy-path tests only, or boundary tests missing." },
      { level: "Insufficient", description: "No meaningful tests, or tests fabricated." },
    ]},
    { id: "A", name: "Architecture and maintainability", weight: 0.10, critical: false, levels: [
      { level: "Excellent", description: "Clear module boundaries; typed contracts; small functions." },
      { level: "Adequate", description: "Readable but with some coupling." },
      { level: "Insufficient", description: "Monolithic, hard to extend or test." },
    ]},
    { id: "R", name: "Reproducibility", weight: 0.10, critical: true, levels: [
      { level: "Excellent", description: "Reproduces from a clean environment in one command." },
      { level: "Adequate", description: "Reproduces with manual steps." },
      { level: "Insufficient", description: "Cannot reproduce outside the author's machine." },
    ]},
    { id: "S", name: "Security and privacy", weight: 0.12, critical: true, levels: [
      { level: "Excellent", description: "No secrets; synthetic data; least privilege; secure logging." },
      { level: "Adequate", description: "Minor gaps with documented remediation." },
      { level: "Insufficient", description: "Exposed secret, real PII, or unsafe operation." },
    ]},
    { id: "U", name: "Responsible use", weight: 0.10, critical: true, levels: [
      { level: "Excellent", description: "No unsupported inference; human review; correction mechanism." },
      { level: "Adequate", description: "Mostly responsible with one unclear claim." },
      { level: "Insufficient", description: "Automated adverse decision or unsupported causal claim." },
    ]},
    { id: "E", name: "Evidence and observability", weight: 0.08, critical: false, levels: [
      { level: "Excellent", description: "Inspectible traces, manifests, and lineage." },
      { level: "Adequate", description: "Some evidence present but incomplete." },
      { level: "Insufficient", description: "No inspectible evidence." },
    ]},
    { id: "C", name: "Communication and demonstration", weight: 0.06, critical: false, levels: [
      { level: "Excellent", description: "Clear brief, demo and limitations; truthful CV narrative." },
      { level: "Adequate", description: "Demonstrable but with unclear framing." },
      { level: "Insufficient", description: "No demo or misleading claims." },
    ]},
  ];
  for (const e of extra) {
    core.push({
      id: e.id,
      name: e.name,
      weight: 0.10,
      critical: e.critical ?? false,
      levels: [
        { level: "Excellent", description: "Criterion fully satisfied with inspectable evidence." },
        { level: "Adequate", description: "Criterion partially satisfied." },
        { level: "Insufficient", description: "Criterion not satisfied." },
      ],
    });
  }
  // normalise weights to sum to 1
  const sum = core.reduce((s, c) => s + c.weight, 0);
  return core.map((c) => ({ ...c, weight: Math.round((c.weight / sum) * 1000) / 1000 }));
}

export const RUBRICS: Record<string, Rubric> = {
  "CP-N1-A": { version: "1.3.0", passThreshold: 80, criteria: baseCriteria(), criticalFailures: COMMON_CRITICAL_FAILURES },
  "CP-N1-B": { version: "1.3.0", passThreshold: 80, criteria: baseCriteria(), criticalFailures: COMMON_CRITICAL_FAILURES },
  "CP-N1-C": { version: "1.4.0", passThreshold: 80, criteria: baseCriteria([
    { id: "FR", name: "Familiarity-evidence separation (ER / relationship / decision)", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Familiarity dashboard collapses entity-resolution evidence with relationship or risk decisions.",
    "Familiarity dashboard automatically infers fraud, collusion, kinship, criminal association, beneficial ownership or causal relationship.",
  ] },
  "CP-N2-A": { version: "1.2.0", passThreshold: 80, criteria: baseCriteria([
    { id: "MO", name: "Memo distinguishes observation/association/hypothesis/recommendation/limitation", critical: true },
  ]), criticalFailures: COMMON_CRITICAL_FAILURES },
  "CP-N2-B": { version: "1.2.0", passThreshold: 80, criteria: baseCriteria([
    { id: "AC", name: "Accessibility (keyboard, non-colour-only, 200% zoom)", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Misleading axes, colour-only encoding, hidden denominators, or stale results presented as current.",
  ] },
  "CP-N2-C": { version: "1.2.0", passThreshold: 80, criteria: baseCriteria([
    { id: "AP", name: "Human approval before any external side effect", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Automatic external send without approval; no separation between draft and send.",
  ] },
  "CP-N3-A": { version: "1.2.0", passThreshold: 80, criteria: baseCriteria([
    { id: "ER", name: "ER evaluation (precision, recall, threshold, false-positive controls)", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Automatic relationship or fraud inference from ER output.",
  ] },
  "CP-N3-B": { version: "1.2.0", passThreshold: 80, criteria: baseCriteria([
    { id: "EV", name: "Every visual edge answers the six required questions", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Visual edge without source, meaning, age, authorisation or correction path.",
  ] },
  "CP-N3-C": { version: "1.2.0", passThreshold: 80, criteria: baseCriteria([
    { id: "MC", name: "Model card reproducible from artifact repo", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Unreviewed adverse decision; data leakage; no abstention or human-review route.",
  ] },
  "CP-N4-A": { version: "1.2.0", passThreshold: 80, criteria: baseCriteria([
    { id: "CE", name: "Clean-environment reproduction", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Local-only demo that cannot reproduce in a clean environment.",
  ] },
  "CP-N4-B": { version: "1.2.0", passThreshold: 80, criteria: baseCriteria([
    { id: "RB", name: "Proven rollback (executed, not documented)", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Rollback documented but never executed; train/serve skew unresolved.",
  ] },
  "CP-N4-C": { version: "2.0.0", passThreshold: 80, criteria: baseCriteria([
    { id: "BL", name: "Bounded loops (max steps, max tool calls, max cost, max elapsed, loop detection)", critical: true },
    { id: "CI", name: "RAG citations + access filtering + injection defence", critical: true },
    { id: "HR", name: "Human approval for sensitive side effects", critical: true },
    { id: "TR", name: "Redacted OTel traces + system card + incident response", critical: true },
    { id: "EV", name: "Eval suite (holdout, trajectory, injection, tool-misuse, cost-exhaustion, recovery)", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Agent without bounded loops; RAG without citations or access controls; web content treated as trusted instruction.",
    "Polished chatbot without the harness controls (adapters, budgets, approval, tracing, red-team, recovery).",
    "No-key path missing; mandatory paid key for the basic validation suite.",
  ] },
  "CP-FINAL": { version: "1.1.0", passThreshold: 80, criteria: baseCriteria([
    { id: "12", name: "Twelve upstream capstones integrated via explicit versioned interfaces", critical: true },
    { id: "CT", name: "Contract tests + dependency graph + shared synthetic scenario", critical: true },
    { id: "DR", name: "Backup, restore, rollback and disaster exercise executed", critical: true },
    { id: "SC", name: "System card aggregating data/model/system cards + threat model + runbook", critical: true },
  ]), criticalFailures: [...COMMON_CRITICAL_FAILURES,
    "Final project is a folder of twelve unrelated repositories without explicit interfaces.",
    "Unsupported claim that the learner prevented fraud, saved money, improved a real organisation, achieved production accuracy, or operated at enterprise scale.",
  ] },
};

export const RUBRIC_REGISTRY = {
  version: "1.0.0",
  rubrics: Object.entries(RUBRICS).map(([id, r]) => ({ capstoneId: id, version: r.version, passThreshold: r.passThreshold })),
  criticalFailureMatrix: COMMON_CRITICAL_FAILURES,
};
