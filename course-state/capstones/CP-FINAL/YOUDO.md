# You Do (Haces tú) — CP-FINAL

Trabajo independiente.

1. Agrega un verificador de reproducibilidad que compare dos bundles producidos con la misma semilla.
2. Agrega un nuevo tipo de evidencia al bundle (por ejemplo, un `audit_log` con hashes de cada contrato).
3. Documenta una nueva ADR en `ARCHITECTURE.md` y un caso del runbook (esto es, un manual de operaciones: qué hacer paso a paso cuando algo falla en producción) operacional.

## Criterios de éxito
- El código corre desde un entorno limpio (solo stdlib).
- `python3 demo.py` → exit 0 + `METRICS_JSON`.
- `python3 -m unittest integration.contract_tests integration.e2e_test -v` pasa.
- `python3 tests/adversarial/test_cp_final_integration.py` pasa.
- No hay PII real ni secretos.
- Las limitaciones están documentadas.
- Ningún subsistema importa a otro (AST guard).
