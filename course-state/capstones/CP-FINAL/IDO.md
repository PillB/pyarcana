# IDO — CP-FINAL (Instructor-led demonstration)

**Goal of this session:** the learner watches the instructor integrate all
twelve upstream capstones into one defensible platform, then watches the
contract tests fail when a subsystem is deliberately broken and pass when it
is restored.

## Setup
```bash
cd course-state/capstones/CP-FINAL
python3 demo.py
python3 -m unittest integration.contract_tests -v
python3 -m unittest integration.e2e_test -v
```

## Step 1 — Show the twelve contratos (esto es, acuerdos explícitos sobre qué datos entran y qué datos salen, para que las partes no se acoplen internamente)
Open `integration/contracts.py` and point out the twelve versioned interfaces
(`/v1/`). Each contract declares a request schema, a response schema, and a
direction. Emphasise that *no* subsystem reaches into another's internals —
they communicate only through these typed contracts.

## Step 2 — Run the integration, then break it
1. Run `demo.py`. It prints `METRICS_JSON: {...}` and exits 0.
2. Open `integration/intake.py`. Temporarily change the `run()` function to
   return an invalid response (e.g. remove the `accepted` field).
3. Re-run the contract tests: `test_intake` now fails because the response
   does not honour the contract schema.
4. Restore the change. All 12 contract tests pass again.

## Step 3 — Demonstrate the end-to-end traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después)
1. Run `integration/e2e_test.py`. It executes all twelve subsystems in
   topological order on the shared synthetic scenario (client ACME-001).
2. Show that a single `shared_trace_id` propagates across all twelve calls.
3. Open `integration/dependency_graph.py` and trace the edge from
   `intake → etl → familiarity → er → graph → triage → service → mlplatform → copilot`.

## Step 4 — Demonstrate backup, restore, and rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla)
1. Run `integration/backup_restore.py::demonstrate_backup_restore`.
2. Show the snapshot is content-addressed (sha256 hash) and immutable.
3. Run `demonstrate_rollback`: a simulated subsystem outage triggers
   `noGo=true`; the rollback restores the prior snapshot and proves
   restoration with a `RollbackProof`.

## Step 5 — Demonstrate the condición de no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias)
1. Open `integration/no_go.py`. Show the five no-go triggers:
   contract test failure, faithfulness below threshold, budget overrun,
   SLO violation, and missing shared trace.
2. Temporarily set `triage.score` to return `abstain=True` with no
   human-review route.
3. Re-run the E2E test: `noGo=true` is emitted and the platform halts.
4. Restore the change. The platform completes successfully.

## What the learner should leave with
- A concrete mental model of subsystem boundaries and contract tests.
- The intuition that a shared synthetic scenario + a shared traceId are
  *cheaper* than debugging twelve uncoordinated repositories.
- Confidence that the no-go condition is the safety net: the platform
  stops rather than producing a broken result.
