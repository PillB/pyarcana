# SECURITY — CP-N4-C harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan)

## modelo de amenazas (esto es, un análisis de qué podría atacar al sistema y cómo, para diseñar defensas)
1. **Prompt inyección (esto es, cuando un atacante mete instrucciones maliciosas dentro de datos para engañar al sistema) via web content.** Adversarial snippets try to override
   system instructions ("Ignore previous instructions…"). Mitigation:
   `web_adapter.wrap_as_data()` strips instruction-looking lines and fences
   the remainder as a DATA block. The orchestrator never feeds raw web
   content into a system prompt; it only appends wrapped data to the
   user-role turn. The verificador (esto es, el rol independiente que revisa lo que propuso el generador antes de aceptarlo) rejects answers that quote raw instruction
   lines.
2. **Tool misuse.** A proposed tool is outside the allowlist. Mitigation:
   `ToolRegistry.policy` is the single source of truth; unknown tools are
   `deny` by construction. `delete_records` and `shell_exec` are denied
   unconditionally.
3. **Sensitive side effects without human.** `send_email` is
   `require_human`. Without approval the orchestrator pauses in
   `AWAITING_HUMAN`; the handler never executes.
4. **Secret leakage in traces.** `tracing.redact()` scrubs emails, bearer
   tokens, secret-looking key/value pairs, and long opaque tokens (e.g. JWT
   bodies). incidente (esto es, un evento donde el sistema se comportó mal o se cayó, que se debe registrar y analizar) context is redacted before persistence.
5. **Runaway spend.** `Budget.charge` runs before and after every model and
   tool call; `BudgetExceeded` aborts the run.
6. **Unbounded loop.** `MAX_STEPS=8`, `MAX_TOOL_CALLS=12`, and per-step
   fingerprint (esto es, una huella del estado: un hash corto que identifica un paso, para detectar repeticiones) comparison stop identical repeats.
7. **Provider outage (esto es, una caída del servicio: el proveedor deja de responder).** Classified, falls back to the local adapter (esto es, un adaptador: un pedazo de código que traduce entre nuestro formato y el de un proveedor de modelos); the
   incident log records the reason.

## Key handling
- No real API key is required in `LOCAL` or `COMMERCIAL_TEST` modes.
- In `COMMERCIAL` mode, a missing key raises `MissingApiKey` *before* any
  call is attempted. The key is never logged, never included in traces, and
  never persisted to `state.json`.

## sandboxing (esto es, ejecutar en un recinto aislado donde no puede tocar archivos ni redes reales)
- Tool handlers receive only their declared `args`. They have no access to
  the environment, the filesystem, or the network.
- `send_email` enqueues to an in-memory outbox only; no socket is opened.
- `export_report` returns a determinista (esto es, que dado el mismo input siempre produce el mismo output, sin azar) path; no file is written.

## Reporting security issues
File an incident via `IncidentLog.record(severity="critical", kind=...)`.
The incident log is append-only and is included (redacted) in every
`CopilotRunRecord`.
