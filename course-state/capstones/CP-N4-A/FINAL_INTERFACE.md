# Interfaz de integración final

**Interfaz:** `service.serve(request) -> ApiResponse`

Recibe request. Devuelve ApiResponse con: status, body, request_id, redacted_logs. Validado, rate-limited, non-root (esto es, ejecutar el proceso con un usuario sin privilegios).

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
