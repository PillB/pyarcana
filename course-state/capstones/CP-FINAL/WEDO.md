# We Do (Hacemos juntos) — CP-FINAL

Instructor y persona que aprende trabajan en conjunto, con andamiaje.

1. Construir juntos un nuevo contrato tipado en `integration/contracts.py` y su test en `integration/contract_tests.py`.
2. Agregar un subsistema nuevo (acotado, sintético) y registrarlo en `integration/dependency_graph.py` y `integration/platform.py::SUBSYSTEM_RUNNERS`.
3. Ejercitar el no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias): forzar un fallo crítico y observar que la plataforma retorna `no_go=True`.

---

<!-- Additive expansion (PR #25). Original preserved text is above. -->

# WEDO — CP-FINAL (Guided practice)

**Goal of this session:** the learner and instructor walk through the
integration together, with the learner completing partially-specified steps.

## Setup
```bash
cd course-state/capstones/CP-FINAL
# Ensure all upstream capstones have their demo.py passing
for cp in CP-N1-A CP-N1-B CP-N1-C CP-N2-A CP-N2-B CP-N2-C \
          CP-N3-A CP-N3-B CP-N3-C CP-N4-A CP-N4-B CP-N4-C; do
  python3 ../$cp/demo.py > /dev/null 2>&1 && echo "✓ $cp" || echo "✗ $cp"
done
```

## Step 1 — Inspect the shared escenario (esto es, un conjunto de datos sintéticos compartidos que todos los subsistemas usan, para que la integración sea reproducible)
Open `integration/shared_scenario.py`. The learner identifies:
- The client (`ACME-001`), its transactions, ER candidates, and evidence.
- The `shared_trace_id` that will propagate across all twelve calls.
- The immutability guarantee: the scenario is a frozen dict.

## Step 2 — Trace the dependency graph
Open `integration/dependency_graph.py`. The learner:
1. Draws the topological order on paper.
2. Explains why `intake` must run before `etl` and `familiarity`.
3. Explains why `copilot` runs last (it consumes all upstream outputs).

## Step 3 — Run the contract tests together
The learner runs:
```bash
python3 -m unittest integration.contract_tests -v
```
and explains what each of the 12 tests asserts (request schema, response
schema, version compatibility). The learner then deliberately breaks one
contract (e.g. returns a wrong type) and observes the test failure.

## Step 4 — Run the end-to-end traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después)
The learner runs:
```bash
python3 -m unittest integration.e2e_test -v
```
and verifies that the `shared_trace_id` appears in every step's output.

## Step 5 — Exercise the rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla)
The learner runs `integration/backup_restore.py::demonstrate_rollback` and
answers:
1. What state was the snapshot taken from?
2. What was the `RollbackProof`?
3. Why is content-addressing important for immutability?

## Step 6 — Trigger the condición de no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias)
The learner modifies `integration/no_go.py` to add a new trigger (e.g.
"subgroup disparity > 0.2") and runs the E2E test to verify it fires
correctly.

