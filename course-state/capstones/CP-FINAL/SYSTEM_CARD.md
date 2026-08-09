# system card — CP-FINAL Enterprise Relationship & Operations Intelligence Platform

**Package version:** 2.0.0 · **Principal gate:** S52 · **Integration of:** 12 upstream capstones

## 1. What the system is

CP-FINAL is the transversal capstone that integrates the twelve upstream level
capstones (CP-N1-A through CP-N4-C) into one defensible platform through
explicit, versioned interfaces. It is *not* a folder of twelve unrelated
repositories: it is a contract-bound integration where each subsystem exposes
a typed contract, every contract is tested, and the whole assembly is
exercised on a single shared synthetic scenario (client ACME-001).

## 2. Intended use & users

Learners in the L4 band demonstrating they can integrate, observe, secure
and defend a bounded production-style data and AI system. The platform is
exercised on synthetic data only; no claim is made of fraud prevention,
money saved, real-organisation improvement, production accuracy, or
enterprise scale.

## 3. Components (subsystem boundaries)

| Subsystem | Upstream capstone | Interface |
|---|---|---|
| Intake | CP-N1-A | intake_cli.run(records) -> IntakeResult |
| ETL | CP-N1-B | etl.run(batch) -> EtlManifest |
| Familiarity review | CP-N1-C | familiarity.review(case) -> ReviewPacket |
| Analytics & EDA | CP-N2-A | eda.profile(dataset) -> EdaReport |
| Reporting | CP-N2-B | reports.render(spec) -> ReportBundle |
| Automation | CP-N2-C | rpa.run(job) -> RpaAudit |
| Entity resolution | CP-N3-A | er.resolve(records) -> ClusterSet |
| Relationship evidence | CP-N3-B | graph.investigate(query) -> GraphCase |
| Case triage | CP-N3-C | triage.score(case) -> TriageDecision |
| Service platform | CP-N4-A | service.serve(request) -> ApiResponse |
| Data & ML platform | CP-N4-B | mlplatform.deploy(model) -> DeployRecord |
| Agentic copilot | CP-N4-C | copilot.run(task) -> CopilotRunRecord |

## 4. Failure modes & mitigations

| Failure | Mitigation |
|---|---|
| Contract mismatch | 12 contract tests; all interfaces versioned /v1/; additive-only |
| Dependency cascade failure | Per-interface timeout + fallback; noGo=true rather than crash |
| Shared-state corruption | Immutable JSON fixture; read-only shared_trace_id |
| Excessive agency | Approval gates at integration boundary; budget envelope |
| Integration-layer injection | Schema validation at every boundary; copilot wrap_as_data() |
| Overreliance | triage.score abstain flag; er.resolve ambiguous_queue; noGo on SLO violation |

## 5. Operating modes

| Mode | Key required | Network | Use case |
|---|---|---|---|
| LOCAL (default) | no | no | Deterministic; CI-safe |
| DYNAMIC | yes (copilot) | with real adapter | Production wiring |

## 6. Responsible-use notes

- No real PII; shared scenario is CC0 synthetic.
- No automatic fraud or kinship inference.
- Contribution statement disclaims outcomes beyond synthetic scenario.
- Backup/restore/rollback demonstrated, not merely documented.

## 7. Limits

- Single synthetic scenario (ACME-001); not a production deployment.
- Contract tests use in-process stubs, not live servers.
- Copilot uses deterministic local adapter by default.

## 8. Versioning & reproducibility

- All twelve interfaces versioned /v1/; additive-only.
- contracts.py pins contract versions; breaking changes require /v2/ + ADR.
- e2e_test.py produces deterministic trace.
- backup_restore.py proves snapshot restoration.
