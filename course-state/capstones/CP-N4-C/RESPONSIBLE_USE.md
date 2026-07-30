# RESPONSIBLE USE — CP-N4-C harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan)

## What this system is *not*
- It is **not** a fraud detector. Entity-resolution scores are not used as
  fraud labels and never drive an automatic decision.
- It is **not** a kinship inference system.
- It is **not** a substitute for human review of sensitive actions.
- It does **not** establish workplace seniority, professional licensure, or
  "job-ready" status for the learner.

## What this system *is*
A pedagogical harness that demonstrates, end-to-end, the *mechanisms* a
production copilot must have to be operable safely: bounded loops, budgets,
HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible), citations, redaction, inyección (esto es, cuando un atacante mete instrucciones maliciosas dentro de datos para engañar al sistema) defence, incidente (esto es, un evento donde el sistema se comportó mal o se cayó, que se debe registrar y analizar) logging, rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla),
and reproducible state.

## Human-in-the-loop policy
- Any side effect classified `require_human` (e.g. `send_email`) pauses the
  run in `AWAITING_HUMAN` until a human explicitly approves. The handler
  never executes speculatively.
- Any side effect classified `deny` (e.g. `delete_records`, `shell_exec`)
  is never executed, even with approval.
- HITL approvals are recorded as incidents so an operator can audit who
  approved what.

## Cost & resource discipline
- The default budget is `max_cost=1.0`, `max_tokens=20_000`. These are
  deliberately small so a runaway loop cannot quietly spend money.
- `BudgetExceeded` aborts the run and sets `status=ABORTED,
  stop_reason="budget_exceeded"`.

## Transparency
- Every run produces a `CopilotRunRecord` containing: steps, tool calls,
  final answer with citations, redacted trace, incident log, budget
  summary, mode used, and whether a fallback (esto es, un plan B: si el primer proveedor falla, se usa otro automáticamente) occurred.
- The manifest (esto es, una lista firmada con hashes que describe exactamente qué salió del proceso) is pinned to `3.0.0`; reproducibility is a property of the
  system, not an afterthought.

## Communication limits
- Learner-facing copy avoids inflated workplace titles ("senior", "master",
  "experto", "job-ready"). Capability is described as *curricular*
  proficiency, not employment status.
- The system card (esto es, una tarjeta del sistema: documenta el sistema completo, sus modos de fallo y sus salvaguardas), security and privacy notes name the failure modes
  explicitly so operators cannot mistake a demo for a deployment.

## Out-of-scope uses (explicit no-gos)
- Pointing the harness at real customer PII.
- Wiring `send_email` to a real SMTP server without an additional layer of
  consent, audit, and rate-limiting.
- Removing or weakening the `deny` policy on `delete_records` or
  `shell_exec`.
- Treating web content as instructions.
