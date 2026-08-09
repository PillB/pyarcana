# system card (esto es, una tarjeta del sistema: documenta el sistema completo, sus modos de fallo y sus salvaguardas) — CP-N4-C Auditable Multi-Agent Copilot harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan)

**Package version:** 3.0.0 · **Principal gate:** S51 · **Sub-gates:** S49 / S50 / S51

## 1. What the system is
A bounded, auditable multi-agent harness that drives a small copilot
end-to-end over a synthetic operations knowledge base. It is *not* a chatbot:
it is the scaffolding (adapters, provider, orchestrator, RAG (esto es, Generación Aumentada por Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada afirmación), tools, web,
evaluation, tracing, budget, state, incidents, rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla), versioning) that a
real copilot would sit on top of. The public entry point is the typed
contrato (esto es, un acuerdo explícito sobre qué datos entran y qué datos salen, para que las partes no se acoplen internamente) `copilot.run(task) -> CopilotRunRecord`.

## 2. Intended use & users
Learners in the L4 band of the PyArcana curriculum demonstrating that they
can operate an auditable copilot without a paid LLM key. The harness is also
the integration surface consumed by CP-FINAL.

## 3. Components
| Component | Module | Role |
|---|---|---|
| Local adapter (esto es, un adaptador: un pedazo de código que traduce entre nuestro formato y el de un proveedor de modelos) | `local_model_adapter.py` | determinista (esto es, que dado el mismo input siempre produce el mismo output, sin azar), keyless, rule/template responses |
| Commercial adapter | `commercial_model_adapter.py` | Provider-neutral contract; raises if key missing in approved mode |
| Provider | `provider.py` | Mode selection, retry (esto es, reintentar: volver a intentar una operación que falló) classification, timeout (esto es, un tiempo máximo: si la operación no termina, se cancela), commercial→local fallback (esto es, un plan B: si el primer proveedor falla, se usa otro automáticamente) |
| Orchestrator | `orchestrator.py` | Bounded loop, generador (esto es, el rol que produce una respuesta o artefacto propuesto)/verificador (esto es, el rol independiente que revisa lo que propuso el generador antes de aceptarlo) handoff (esto es, un traspaso tipado entre roles: el generador entrega un artefacto y el verificador lo recibe con un contrato claro), durable state, resume |
| RAG | `rag.py` | Synthetic KB, per-doc ACL (esto es, Lista de Control de Acceso: reglas que dicen qué documentos puede ver cada rol), per-claim citations, answer grading |
| Tools | `tools.py` | allow/require_human/deny policy, idempotency, dry-run (esto es, simular la ejecución sin realizar efectos reales, para ver qué pasaría), sandboxing (esto es, ejecutar en un recinto aislado donde no puede tocar archivos ni redes reales), HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible) |
| Web adapter | `web_adapter.py` | Synthetic SERP (esto es, Search Engine Results Page: los resultados que devuelve un buscador; aquí se usan como datos con fuente, no como instrucciones), provenance (esto es, la trazabilidad: de dónde viene cada dato o resultado), `wrap_as_data()` inyección (esto es, cuando un atacante mete instrucciones maliciosas dentro de datos para engañar al sistema) defence |
| Evaluation | `evaluation.py` | holdout (esto es, un conjunto de pruebas que el sistema nunca vio durante el diseño, para evaluarlo sin trampa) + trayectoria (esto es, la secuencia completa de pasos que siguió el agente, no solo el resultado final) + red-team (esto es, equipo rojo: pruebas adversarias donde alguien intenta romper o engañar al sistema a propósito) cases |
| Tracing | `tracing.py` | span (esto es, un segmento de una traza: cuánto duró y qué hizo un solo paso) + `redact()` for emails/tokens/keys |
| Budget | `budget.py` | Cost & token ceilings; `BudgetExceeded` abort |
| State | `state.py` | Durable `state.json`, `step_fingerprint()`, `fingerprint()` |
| Incidents | `incidente.py` | Append-only incident log |
| Rollback | `rollback.py` | Snapshot + restore + proof |
| Versions | `versions.py` + `versions.json` | Pinned manifest (esto es, una lista firmada con hashes que describe exactamente qué salió del proceso) 3.0.0 |

## 4. Failure modes & mitigations
| Failure | Mitigation |
|---|---|
| Unbounded loop | max 8 steps, max 12 tool calls, fingerprint-based loop detection |
| Budget drain | per-call `Budget.charge`; `BudgetExceeded` aborts the run |
| Prompt injection via web content | `wrap_as_data()` strips instruction-looking lines; web is DATA never INSTRUCTION |
| Sensitive side effect without human | `require_human` policy pauses the run in `AWAITING_HUMAN` |
| Denied tool proposed | `deny` policy returns `denied` and never executes |
| Provider outage (esto es, una caída del servicio: el proveedor deja de responder) | classified, falls back to local adapter, incident logged |
| Trace leaks PII | `redact()` scrubs emails, bearer tokens, API keys, long opaque tokens |
| State loss | `state.json` persisted after every step; resume from `AWAITING_HUMAN` |
| Bad mutation | `RollbackManager` restores prior snapshot and proves restoration |
| Runaway red-team case | every adversarial input produces a defined `stop_reason` |

## 5. Operating modes
| Mode | Key required | Network | Use case |
|---|---|---|---|
| `LOCAL` | no | no | default; deterministic; CI-safe |
| `COMMERCIAL_TEST` | no | no | exercises commercial contract with canned responses |
| `COMMERCIAL` | yes | only with a real adapter | production wiring; missing key raises `MissingApiKey` |

## 6. Responsible-use notes
- No real PII is ever ingested; the synthetic KB is generated by
  `data/generate.py`.
- No automatic fraud or kinship inference is performed.
- Sensitive side effects (`send_email`, `delete_records`, `shell_exec`) are
  gated by policy; even approved `send_email` enqueues to an in-memory
  outbox and is never transmitted.
- Every persisted trace passes through `redact()`.
- Every model call, tool call, fallback, injection attempt, budget breach
  and HITL pause produces an incident entry.

## 7. Limits
- The local adapter is intentionally unimpressive; it is a fallback, not a
  replacement for a real LLM.
- The commercial adapter does not perform real network calls; production
  wiring is the integrator's responsibility.
- Retrieval is BM25-style over a small synthetic KB; relevance is bounded
  by the KB contents.

## 8. Versioning & reproducibility
- Manifest pinned to `3.0.0` in `harness/versions.json`.
- `RunState` is fully serialisable; the same manifest + same `state.json`
  replay identically.
- `RollbackProof` proves a rollback restored prior state.
