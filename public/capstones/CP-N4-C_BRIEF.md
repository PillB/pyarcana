# BRIEF — CP-N4-C Auditable Multi-Agent Copilot harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan)

**Capstone:** CP-N4-C · **Version:** 3.0.0 · **Principal gate:** S51
**Sub-gates:** S49 (runtime), S50 (eval & resilience), S51 (governance & system card (esto es, una tarjeta del sistema: documenta el sistema completo, sus modos de fallo y sus salvaguardas))
**Final integration interface:** `copilot.run(task) -> CopilotRunRecord`

## Intended user
A learner finishing the L4 band of the PyArcana curriculum who can design,
instrument and defend a small multi-agent system. The brief assumes the
learner has completed CP-N4-A (governed service) and CP-N4-B (data & ML
platform) and is now asked to operate an *auditable copilot* on top of that
platform — **without** requiring a paid LLM key to demonstrate competence.

## Problem
Production copilots fail in four predictable ways: they loop forever, they
spend unbounded money, they treat untrusted web content as instructions, and
they perform sensitive side effects without human approval. The capstone
asks the learner to build a harness where **none of those failures is
possible by construction**, and to prove it with adversarial tests.

## What you will build
A Python stdlib-only harness at `course-state/capstones/CP-N4-C/harness/`
implementing every mechanism enumerated in ADR-N4-C:

- local + commercial model adapters with a provider-neutral contrato (esto es, un acuerdo explícito sobre qué datos entran y qué datos salen, para que las partes no se acoplen internamente) and a
  determinista (esto es, que dado el mismo input siempre produce el mismo output, sin azar) no-key path
- provider with retry (esto es, reintentar: volver a intentar una operación que falló) classification (transient / permanent / outage (esto es, una caída del servicio: el proveedor deja de responder)),
  timeouts, and commercial→local fallback (esto es, un plan B: si el primer proveedor falla, se usa otro automáticamente)
- bounded orchestrator (max 8 steps, max 12 tool calls) with loop detection
  via step fingerprints and typed generador (esto es, el rol que produce una respuesta o artefacto propuesto)/verificador (esto es, el rol independiente que revisa lo que propuso el generador antes de aceptarlo) handoff (esto es, un traspaso tipado entre roles: el generador entrega un artefacto y el verificador lo recibe con un contrato claro)
- RAG (esto es, Generación Aumentada por Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada afirmación) with per-doc ACLs and per-claim citations
- least-privilege tools (`allow` / `require_human` / `deny`) with
  idempotency, dry-run (esto es, simular la ejecución sin realizar efectos reales, para ver qué pasaría) and sandboxed handlers
- web/SERP (esto es, Search Engine Results Page: los resultados que devuelve un buscador; aquí se usan como datos con fuente, no como instrucciones) adapter (esto es, un adaptador: un pedazo de código que traduce entre nuestro formato y el de un proveedor de modelos) with provenance (esto es, la trazabilidad: de dónde viene cada dato o resultado) and `wrap_as_data()` inyección (esto es, cuando un atacante mete instrucciones maliciosas dentro de datos para engañar al sistema) defence
- holdout (esto es, un conjunto de pruebas que el sistema nunca vio durante el diseño, para evaluarlo sin trampa) + trayectoria (esto es, la secuencia completa de pasos que siguió el agente, no solo el resultado final) + red-team (esto es, equipo rojo: pruebas adversarias donde alguien intenta romper o engañar al sistema a propósito) evaluation
- tracing with email/token/key redaction
- cost & token budgets that abort the run on breach
- durable run state (`state.json`) with resume from `AWAITING_HUMAN`
- incidente (esto es, un evento donde el sistema se comportó mal o se cayó, que se debe registrar y analizar) log, rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla) manager, versioned manifest (esto es, una lista firmada con hashes que describe exactamente qué salió del proceso)

## Prerequisites
- CP-N4-A and CP-N4-B completed (or equivalent familiarity with the
  platform).
- Comfortable with the Python standard library: `dataclasses`, `json`,
  `hashlib`, `re`, `unittest`.
- A concrete mental model of *generator vs verifier* separation and of
  *policy table vs handler* separation.

## Limitations of this harness
- The local adapter is rule/template based; it is **not** a substitute for a
  real LLM. It exists so the harness is runnable end-to-end with no key and
  no network.
- The commercial adapter is a stub: in *test mode* it returns canned
  responses; in *approved mode* it raises `MissingApiKey` if no key is
  provided. It never sends a network request from the deterministic path.
- The KB is small and synthetic; retrieval uses BM25-style scoring without
  learned weights.
- No real email is ever sent. The `send_email` handler enqueues to an
  in-memory outbox used only by tests.

## Remediation guidance (if you get stuck)
1. **Loop not detected?** Confirm `RunState.step_fingerprint` includes the
   generator's plan and the tool args, not the step index.
2. **Budget not enforced?** `Provider._call_with_retry` and `ToolRegistry.call`
   both charge the budget; ensure you did not bypass them.
3. **Injection not defended?** `wrap_as_data()` must be the only path web
   content takes into the prompt, and the verifier must reject answers that
   quote raw instruction-looking lines.
4. **HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible) not pausing?** `tools.call` returns `executed=False` for
   `require_human` tools without approval; the orchestrator must persist
   `state.json` and return `AWAITING_HUMAN` *before* recording a step that
   would have executed the tool.

## Out of scope (explicit no-gos)
- Real PII, real API keys, real network calls in the deterministic path.
- Automatic fraud or kinship inference.
- Inflated claims of "senior", "master", "expert" or "job-ready" status.
- Any separate fourteenth capstone artefact (the multi-agent project is
  folded into CP-N4-C per ADR-N4-C).
