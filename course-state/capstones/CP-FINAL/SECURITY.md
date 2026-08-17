# Seguridad — CP-FINAL

La plataforma no expone secretos, no se ejecuta como root, no realiza efectos externos sin aprobación humana.

## Controles obligatorios
- Sin secretos embebidos (auth es mock; tokens sintéticos).
- Entradas validadas (cada subsistema valida su entrada).
- Salidas sanitizadas (sin PII; solo IDs sintéticos).
- Datos sintéticos únicamente (dominio `@example.test`).
- Sin red ni dependencias de pago.
- Sin ejecución como root (registrado en `ApiResponse.body.is_root=False`).

## Superficies de la integración
- `platform.integrate(scenario)` — única entrada pública.
- `backup_restore.backup/restore` — opera solo sobre archivos JSON locales.
- `no_go.evaluate` — decide si la integración es GO/no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias).

## Lo que este proyecto NO hace
- No abre sockets ni hace HTTP real.
- No persiste a una base de datos externa.
- No envía correos reales (RPA y Copilot marcan `pending_human_approval`).

---

<!-- Additive expansion (PR #25). Original preserved text is above. -->

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

---

<!-- Additive correction (ready-hardening). Original and PR #25 text are preserved above. -->

# Implemented API map (authoritative)

| Claimed in earlier notes | Implemented |
|---|---|
| `NoGoResult` | `no_go.evaluate -> Tuple[bool, str]`; the pair is stored as `IntegrationBundle.no_go` / `no_go_reason` |
| `backup_restore.py` in-memory snapshot | `backup_restore.backup` / `restore` write and read **JSON files** under the caller-supplied directory |
| `demonstrate_rollback` / `RollbackProof` | `integration/rollback.py::demonstrate_rollback` returns a dict with `rollback_proven` |
| Faithfulness / budget / SLO no-go triggers | Not implemented as separate evaluators. Live triggers are missing subsystem, `None`, type/version mismatch, and computed flag violations |
| 12 imported capstone packages | **In-process pedagogical twins**. They do not import the twelve package trees |

The 12 runners are in-process pedagogical twins. They do **not** import the
twelve capstone package trees. Empty contracts are fail-closed.

