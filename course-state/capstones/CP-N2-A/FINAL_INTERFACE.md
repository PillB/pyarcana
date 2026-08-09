# Interfaz de integración final

**Interfaz:** `eda.profile(dataset) -> EdaReport`

Recibe dataset. Devuelve EdaReport con: dictionary, profiling, missingness, reconciliation, distributions, segments, outliers, assumptions, limitations, executive_memo (5 categorías).

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
