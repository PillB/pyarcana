# SECURITY — CP-FINAL integration platform

## modelo de amenazas (esto es, un análisis de qué podría atacar al sistema y cómo, para diseñar defensas)

1. **Contract mismatch.** A subsystem emits a response the consumer cannot
   parse. Mitigation: 12 contract tests assert request/response schema
   conformance; all interfaces are versioned (`/v1/`) and additive-only.
   Breaking changes require a new `/v2/` and a migration ADR.

2. **Dependency cascade failure.** One subsystem outage takes down the
   platform. Mitigation: per-interface timeout + fallback; the copilot's
   no-key double; the end-to-end test asserts a partial failure produces
   `noGo=true` rather than a crash.

3. **Shared-state corruption.** The shared synthetic scenario is mutated.
   Mitigation: the scenario is an immutable JSON fixture; the
   `shared_trace_id` is generated once and propagated read-only; the
   backup/restore test asserts the snapshot can be restored to a known
   state.

4. **Excessive agency at the integration layer.** The copilot autonomously
   triggers `automation.run` or `mlplatform.deploy`. Mitigation: both
   require approval at the integration boundary; the copilot budget
   envelope caps total integration cost; no-go conditions halt the
   platform if any interface exceeds its SLO.

5. **Integration-layer prompt inyección (esto es, cuando un atacante mete instrucciones maliciosas dentro de datos para engañar al sistema).** A malicious payload traverses
   intake → ETL → RAG and reaches the copilot. Mitigation: schema
   validation at every interface boundary rejects malformed payloads
   before they propagate; the synthetic scenario is CC0 and reviewed; no
   untrusted external data enters the pipeline; the copilot's
   `wrap_as_data()` and verifier apply at the integration boundary too.

6. **Overreliance on upstream outputs.** A flawed ER or triage score
   propagates as fact. Mitigation: `triage.score` returns a
   `calibrated_prob` and an `abstain` flag; `er.resolve` returns an
   `ambiguous_queue` for low-confidence matches; CP-FINAL `noGo=true` if
   any subsystem reports a faithfulness/SLO violation.

## Key handling
- No real API keys are required for any subsystem in `LOCAL` mode.
- The copilot's `COMMERCIAL` mode key is never logged, never included in
  traces, and never persisted to `state.json`.
- All other subsystems are keyless by design (synthetic data, in-process).

## sandboxing (esto es, ejecutar en un recinto aislado donde no puede tocar archivos ni redes reales)
- All 12 subsystem stubs are in-process; no network calls, no filesystem
  writes outside the `course-state/capstones/CP-FINAL/` directory.
- `backup_restore.py` writes to an in-memory snapshot; no real database.
- `send_email` (via `rpa.run`) enqueues to an in-memory outbox only.

## Reporting security issues
File an incident via `integration/no_go.py::evaluate`. The no-go evaluation
produces a structured `NoGoResult` with triggers, severity, and a
recommended action. The result is included in every `IntegrationBundle`.
