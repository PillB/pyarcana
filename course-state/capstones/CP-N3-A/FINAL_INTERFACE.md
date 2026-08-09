# Interfaz de integración final

**Interfaz:** `er.resolve(records) -> ClusterSet`

Recibe records. Devuelve ClusterSet con: clusters, ambiguous_queue, metrics (precision, recall), fp_analysis, baseline (esto es, una línea base: el resultado más simple y determinista contra el que se compara todo lo demás) (determinista), no relationship inference.

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
