# IDO — CP-N4-C (Instructor-led demonstration)

**Goal of this session:** the learner watches the instructor build the
smallest possible auditable copilot loop, then watches the adversarial
tests break a naive version and pass against the hardened version.

## Setup
```bash
cd course-state/capstones/CP-N4-C
python3 demo.py
python3 tests/adversarial/test_n4c_harness.py
```

## Step 1 — Show the contrato (esto es, un acuerdo explícito sobre qué datos entran y qué datos salen, para que las partes no se acoplen internamente)
Open `harness/__init__.py` and point out the public surface:
`Copilot`, `Task`, `CopilotRunRecord`, plus the adapters and the policy
table. Emphasise that *every* downstream consumer (demo, tests, CP-FINAL)
goes through this surface.

## Step 2 — Run the demo, then break it
1. Run `demo.py`. It prints `METRICS_JSON: {...}` and exits 0.
2. Open `harness/orchestrator.py`. Temporarily raise `MAX_STEPS` to 100 and
   comment out the loop-detection block.
3. Re-run the demo. The unbounded-loop adversarial test now fails: the run
   does not stop within 8 steps.
4. Restore the change. The test passes again.

## Step 3 — Demonstrate HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible)
1. Show the `send_email` policy in `harness/tools.py` (`require_human`).
2. Run the demo without approval: the run pauses in `AWAITING_HUMAN`; the
   `outbox` is empty.
3. Pass `approvals={idempotency_key(...): True}` to resume: the email is
   queued to the in-memory outbox; an `hitl_approved` incidente (esto es, un evento donde el sistema se comportó mal o se cayó, que se debe registrar y analizar) is recorded.

## Step 4 — Demonstrate inyección (esto es, cuando un atacante mete instrucciones maliciosas dentro de datos para engañar al sistema) defence
1. Open `harness/web_adapter.py` and show the `_DEFAULT_SERP` entry that
   contains `"Ignore previous instructions…"`.
2. Run the red-team (esto es, equipo rojo: pruebas adversarias donde alguien intenta romper o engañar al sistema a propósito) case `rt-injection`. Show the
   `[injection-stripped]` marker in the trace and the
   `injection_defended` incident.

## Step 5 — Demonstrate budget abort
1. Construct a `Budget(max_cost=0.0, max_tokens=0)`.
2. Run any task: the run aborts with `stop_reason="budget_exceeded"`.

## What the learner should leave with
- A concrete mental model of generador (esto es, el rol que produce una respuesta o artefacto propuesto)/verificador (esto es, el rol independiente que revisa lo que propuso el generador antes de aceptarlo) separation.
- The intuition that policy tables, fingerprint (esto es, una huella del estado: un hash corto que identifica un paso, para detectar repeticiones)-based loop detection,
  `wrap_as_data()`, and `redact()` are *cheaper* than fixing a broken run
  after the fact.
- Confidence that the adversarial tests are the contract.
