# Interfaz de integración final

**Interfaz:** `etl.run(batch) -> EtlManifest`

Recibe un batch (dict con paths o listas). Devuelve EtlManifest con: accepted_count, quarantined_count, manifest_sha256, sources, lineage (esto es, el linaje: el registro de qué dato derivó de qué otro). idempotente (esto es, que repetir la misma operación no cambie el resultado).

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
