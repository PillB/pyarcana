# Interfaz de integración final

**Interfaz:** `intake_cli.run(records) -> IntakeResult`

Recibe una lista de registros (dicts con `edad`, `region`, `monto_ingreso`, `raw_line`). Devuelve IntakeResult con: `results`, `n_total`, `n_accept`, `n_reject`, `n_review`, `tasa_reject` (None si el lote está vacío). Determinista.

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
