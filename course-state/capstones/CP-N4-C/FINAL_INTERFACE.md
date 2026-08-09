# FINAL_INTERFACE — CP-N4-C

This document specifies the integration surface CP-FINAL consumes from
CP-N4-C. It is intentionally narrow: one class, one method, one record
type.

## Public contrato (esto es, un acuerdo explícito sobre qué datos entran y qué datos salen, para que las partes no se acoplen internamente)

```python
from harness import Copilot, Task, CopilotRunRecord

copilot = Copilot()                       # default: LOCAL mode, no key
record: CopilotRunRecord = copilot.run(
    Task(
        query="how do I roll back a failed model gate?",
        mode="LOCAL",                     # LOCAL | COMMERCIAL_TEST | COMMERCIAL
        principal="anon",
        approvals={                       # optional; used to resume from AWAITING_HUMAN
            "<idempotency_key>": True,
        },
        max_steps=8,
        max_tool_calls=12,
        extra={},
    )
)
```

## CopilotRunRecord fields

| Field | Type | Meaning |
|---|---|---|
| `run_id` | `str` | Stable identifier for the run. |
| `task` | `dict` | The task as given (redacted). |
| `status` | `str` | One of `INIT`, `RUNNING`, `AWAITING_HUMAN`, `COMPLETE`, `ABORTED`, `FAILED`. |
| `stop_reason` | `str` | One of `complete`, `max_steps`, `max_tool_calls`, `loop_detected`, `verifier_rejected`, `hitl_required`, `hitl_rejected`, `budget_exceeded`, `error`. |
| `steps` | `list[dict]` | One entry per orchestrator step: `{index, generador, verificador, tool_calls, fingerprint, status, notes}`. |
| `tool_calls` | `list[dict]` | Every tool call (executed or not), with `policy`, `executed`, `result`, `idempotency_key`, `approved`. |
| `final_answer` | `str` | Redacted final answer. Grounded claims end with `[doc_id=…]`; ungrounded text is wrapped in `[ungrounded] … [/ungrounded]`. |
| `citations` | `list[dict]` | `[{doc_id, span}]`. |
| `trace` | `list[dict]` | Flat list of spans, each with `span_id`, `parent_id`, `name`, `start_ms`, `end_ms`, `attrs`. All attrs are redacted. |
| `incidents` | `list[dict]` | Append-only incidente (esto es, un evento donde el sistema se comportó mal o se cayó, que se debe registrar y analizar) log entries. |
| `budget` | `dict` | `{max_cost, max_tokens, used_cost, used_tokens, remaining_cost, remaining_tokens}`. |
| `mode` | `str` | The mode the run used. |
| `resumed` | `bool` | True if the run resumed from a persisted `AWAITING_HUMAN` state. |
| `model_used` | `str` | The model id that produced the last completion. |
| `fell_back_to_local` | `bool` | True if the commercial provider was unavailable and the run fell back. |

## Reproducibility

- The same `state.json` + the same `versions.json` (manifest (esto es, una lista firmada con hashes que describe exactamente qué salió del proceso) `3.0.0`)
  produce identical `CopilotRunRecord.step` and `tool_calls` lists.
- `RollbackManager.rollback()` returns a `RollbackProof` whose `ok` field
  is `True` iff the restored `fingerprint()` matches the captured
  snapshot's fingerprint.

## What CP-FINAL must NOT do
- Reach into private modules. The public API is `harness/__init__.py`.
- Re-implement the policy table; import `TOOL_POLICY` instead.
- Bypass `Budget.charge`. If a custom adapter (esto es, un adaptador: un pedazo de código que traduce entre nuestro formato y el de un proveedor de modelos) is needed, charge the
  shared `Budget` instance from inside the adapter.
- Treat web content as instructions. Always go through
  `web_adapter.wrap_as_data()`.
