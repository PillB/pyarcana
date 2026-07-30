# System / Data card — CP-N4-C Auditable Multi-Agent Copilot Harness

| Campo | Valor |
|---|---|
| Capstone | CP-N4-C — Copiloto y Harness Auditable de Operaciones Multi-Agente con IA |
| Gate | S51 (principal) · sub-gates S49/S50/S51 |
| Versión del paquete | 3.0.0 |
| Tipo | System + Data card |
| Propósito | Harness multi-agente auditable con adaptadores local/comercial, RAG con citas y ACL, tools de mínimo privilegio, web/SERP con defensa de inyección, presupuestos, HITL, evaluaciones, trazas redactadas y recuperación. |
| Datos | Sintéticos únicamente (generados por `data/generate.py`); sin PII real. |
| Interfaces | `copilot.run(task) -> CopilotRunRecord` (ver `FINAL_INTERFACE.md`). |
| Seguridad | Sin secretos reales; política de tools allow/require_human/deny; defensa de inyección; redacción de trazas. |
| Privacidad | Minimización; sin PII real; ACL por documento; `redact()` sobre toda traza persistida. |
| Human-in-the-loop | `require_human` pausa en `AWAITING_HUMAN`; sin aprobación, el handler no ejecuta. |
| Presupuestos | `max_cost` + `max_tokens`; `BudgetExceeded` aborta la ejecución. |
| Observabilidad | Spans + `redact()` + incident log + budget summary en cada `CopilotRunRecord`. |
| Rollback / recovery | `RollbackManager` restaura snapshot previo y devuelve `RollbackProof`. |
| Versionado | Manifiesto `harness/versions.json` anclado a 3.0.0 (modelos/prompts/datasets/indexes). |
| Modos | `LOCAL` (default, sin clave), `COMMERCIAL_TEST` (stub sin clave), `COMMERCIAL` (requiere clave). |
| Limitaciones | Adaptador local es rule/template (no es LLM real); KB pequeña; sin red en el camino determinista. |

## No-go
- Inferencia automática de fraude/parentesco.
- Envío de datos reales a proveedores públicos.
- Afirmar impacto de negocio no medido.
- Títulos inflados (senior/master/experto/job-ready) en learner-facing copy.
- Cualquier artefacto de un decimocuarto capstone separado (folded into
  CP-N4-C per ADR-N4-C).

## Critical failures (catalog.ts)
- Bucles no acotados → mitigado por max 8 steps + fingerprint loop detection.
- RAG sin citas ni control de acceso → mitigado por per-claim citations + per-doc ACL.
- Contenido web tratado como instrucción → mitigado por `wrap_as_data()`.
- Sin HITL en efectos sensibles → mitigado por `require_human` policy.
- Sin redacción de trazas → mitigado por `redact()` en `tracing.py`.
- Sin rollback → mitigado por `RollbackManager` + `RollbackProof`.
