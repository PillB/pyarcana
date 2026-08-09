# RUN — CP-N4-C (S51) · package version 3.0.0

## Qué es
Paquete formal del gate **Copiloto y harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan) Auditable de Operaciones Multi-Agente con IA**.
El harness real vive en `harness/`; `demo.py` es un punto de entrada delgado
que lo ejercita end-to-end en modo determinista sin clave. Datos 100%
sintéticos, sin PII real, sin inferencia de fraude.

## Requisitos
- Python 3.10+ (solo stdlib).
- Sin dependencias de pip, sin red, sin claves de API en el camino determinista.

## Cómo correr

```bash
cd course-state/capstones/CP-N4-C
python3 demo.py                            # exit 0 + METRICS_JSON
python3 tests/adversarial/test_n4c_harness.py   # 10/10 OK
```

Esperado: exit code `0` y una línea JSON de métricas (prefijo `METRICS_JSON:`).

## Estructura

```
CP-N4-C/
├── demo.py                 # thin entry point → harness
├── harness/                # the real implementation (15 modules)
│   ├── __init__.py         # public API
│   ├── local_model_adapter.py
│   ├── commercial_model_adapter.py
│   ├── provider.py
│   ├── orchestrator.py     # Copilot.run(task) -> CopilotRunRecord
│   ├── RAG.py              # KB + ACL + citations + grading
│   ├── tools.py            # allow/require_human/deny + idempotency + dry-run
│   ├── web_adapter.py      # synthetic SERP + wrap_as_data()
│   ├── evaluation.py       # holdout + trayectoria + red-team
│   ├── tracing.py          # span + redact()
│   ├── budget.py           # max_cost/max_tokens + BudgetExceeded
│   ├── state.py            # durable RunState + step_fingerprint
│   ├── incidente.py         # append-only incident log
│   ├── rollback.py         # snapshot + restore + proof
│   ├── versions.py + versions.json   # pinned manifest 3.0.0
│   └── STARTER/            # scaffold for WEDO/YOUDO
├── data/generate.py        # synthetic KB + holdout + red-team generador
├── BRIEF.md, RUBRIC.json, SYSTEM_CARD.md
├── SECURITY.md, PRIVACY.md, ACCESSIBILITY.md, RESPONSIBLE_USE.md
├── IDO.md, WEDO.md, YOUDO.md
├── FINAL_INTERFACE.md, SUBGATES.md
├── gate.json               # version 3.0.0
├── evidence_manifest.json  # version 3.0.0
├── execution.json          # regenerated on each demo run
├── RUN.md                  # this file
└── system_or_data_card.md  # version 3.0.0
```

## Evidencia
Ver `evidence_manifest.json` y `execution.json` (generado al ejecutar el demo).

## Notas
- Datos 100% sintéticos (IDs ficticios, nombres inventados).
- No envía red ni guarda secretos.
- El modo `LOCAL` (default) es determinista y sin clave.
- El modo `COMMERCIAL_TEST` ejerce el contrato comercial con respuestas canned.
- El modo `COMMERCIAL` requiere clave; sin clave levanta `MissingApiKey`.
- Los 10 tests adversariales en `tests/adversarial/test_n4c_harness.py` son
  el contrato de robustez del harness.
