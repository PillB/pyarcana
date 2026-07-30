# SUBGATES — CP-N4-C

CP-N4-C is the principal gate for the L4 capstone "Auditable Multi-Agent
Copilot harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan)". Per ADR-N4-C, the requested fourteenth capstone
is folded into CP-N4-C and delivered as three sub-gates
attached to sections S49, S50 and S51.

| Sub-gate | Section | Title | Focus |
|---|---|---|---|
| CP-N4-C.1 | S49 | Runtime: multi-agent, adapters, RAG (esto es, Generación Aumentada por Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada afirmación), tools, web/SERP (esto es, Search Engine Results Page: los resultados que devuelve un buscador; aquí se usan como datos con fuente, no como instrucciones), budgets, HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible) | Orchestration bounded; local+commercial adapters; RAG with ACLs and citations; least-privilege tools; web/SERP with provenance (esto es, la trazabilidad: de dónde viene cada dato o resultado); budgets and HITL. |
| CP-N4-C.2 | S50 | Evaluation, red-team (esto es, equipo rojo: pruebas adversarias donde alguien intenta romper o engañar al sistema a propósito), reliability, recovery | holdout (esto es, un conjunto de pruebas que el sistema nunca vio durante el diseño, para evaluarlo sin trampa) + trayectoria (esto es, la secuencia completa de pasos que siguió el agente, no solo el resultado final) evaluation; red-team (inyección (esto es, cuando un atacante mete instrucciones maliciosas dentro de datos para engañar al sistema), tool misuse, loop, budget breach); recovery tests. |
| CP-N4-C.3 | S51 | Observability, governance, incidents, contestability, accessibility, system card (esto es, una tarjeta del sistema: documenta el sistema completo, sus modos de fallo y sus salvaguardas) | Traces/span (esto es, un segmento de una traza: cuánto duró y qué hizo un solo paso); redaction; governance; release pinning; incidente (esto es, un evento donde el sistema se comportó mal o se cayó, que se debe registrar y analizar) response; contestability; accessibility; system card. |

## Evidence per sub-gate

### CP-N4-C.1 — S49
- `harness/local_model_adapter.py` — determinista (esto es, que dado el mismo input siempre produce el mismo output, sin azar), keyless.
- `harness/commercial_model_adapter.py` — provider-neutral contrato (esto es, un acuerdo explícito sobre qué datos entran y qué datos salen, para que las partes no se acoplen internamente);
  `MissingApiKey` in approved mode; test mode needs no key.
- `harness/provider.py` — mode selection, retry (esto es, reintentar: volver a intentar una operación que falló) classification
  (transient/permanent/provider_outage), timeout (esto es, un tiempo máximo: si la operación no termina, se cancela), commercial→local fallback (esto es, un plan B: si el primer proveedor falla, se usa otro automáticamente).
- `harness/orchestrator.py` — `Copilot.run(task) -> CopilotRunRecord`;
  bounded steps (max 8); bounded tool calls (max 12); stop conditions;
  loop detection via `RunState.step_fingerprint`; typed generador (esto es, el rol que produce una respuesta o artefacto propuesto)/verificador (esto es, el rol independiente que revisa lo que propuso el generador antes de aceptarlo)
  handoff (esto es, un traspaso tipado entre roles: el generador entrega un artefacto y el verificador lo recibe con un contrato claro); durable `state.json`; resume from `AWAITING_HUMAN`.
- `harness/rag.py` — synthetic KB, per-doc ACL (esto es, Lista de Control de Acceso: reglas que dicen qué documentos puede ver cada rol), per-claim citations,
  retrieval + answer evaluation.
- `harness/tools.py` — allow / require_human / deny policy; idempotency
  keys; dry-run (esto es, simular la ejecución sin realizar efectos reales, para ver qué pasaría); sandboxed handlers; HITL.
- `harness/web_adapter.py` — synthetic SERP with provenance per result;
  `wrap_as_data()` injection defence; SERP-unavailability handling.
- `harness/budget.py` — `max_cost` / `max_tokens`; `BudgetExceeded` abort.
- `harness/state.py` — durable `RunState`; `step_fingerprint()`;
  `fingerprint()`.

### CP-N4-C.2 — S50
- `harness/evaluation.py` — `run_holdout`, `evaluate_trajectory`,
  `build_red_team_cases`.
- `tests/adversarial/test_n4c_harness.py` — ten adversarial cases
  covering prompt injection, unbounded loop, budget breach, HITL, denied
  tools, redaction, rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla), citations, durable resume (esto es, reanudar desde donde se quedó tras una interrupción, sin perder lo hecho), and unknown-tool
  denial.
- `harness/rollback.py` — snapshot + restore + `RollbackProof`.

### CP-N4-C.3 — S51
- `harness/tracing.py` — spans + `redact()` (emails, tokens, keys).
- `harness/incident.py` — append-only incident log.
- `harness/versions.py` + `harness/versions.json` — pinned manifest (esto es, una lista firmada con hashes que describe exactamente qué salió del proceso)
  `3.0.0` covering models, prompts, datasets, indexes.
- `SYSTEM_CARD.md`, `SECURITY.md`, `PRIVACY.md`, `ACCESSIBILITY.md`,
  `RESPONSIBLE_USE.md`.
- `RUBRIC.json` — versioned rubric with `package_version: "3.0.0"`.

## Gate rule
The principal gate S51 passes when **all three** sub-gates have evidence
and the weighted conceptual average of the rubric is ≥ 2.4/3 with no
critical criterion < 2 and zero P0 security/privacy/fraud-inference
failures. The ten adversarial tests in
`tests/adversarial/test_n4c_harness.py` must all pass.
