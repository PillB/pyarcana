# Interfaz de integración final

**Interfaz:** `rpa.run(job) -> RpaAudit`

Recibe job (dict con excel path + spec). Devuelve RpaAudit con: draft (queued, not sent), approvals, audit_trail, rollback_available, logs_redacted.

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
