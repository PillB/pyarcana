# CP-FINAL — STARTER

Copia este directorio y completa `scaffold.py` según `BRIEF.md`.

El scaffold ya invoca al orquestador real (`integration.platform.integrate`)
para que puedas ejecutar y observar la integración; reemplaza la
implementación por la tuya una vez que entiendas el flujo.

## Comandos

```bash
# Demo formal (debe salir 0 y mostrar METRICS_JSON)
python3 demo.py

# Tests de contrato y end-to-end
python3 -m unittest integration.contract_tests integration.e2e_test -v

# Test adversarial
python3 tests/adversarial/test_cp_final_integration.py
```
