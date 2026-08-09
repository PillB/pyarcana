# Interfaz de integración final

**Interfaz:** `reports.render(spec) -> ReportBundle`

Recibe spec (dict con datos + plantilla). Devuelve ReportBundle con: tables, charts, pdf_bytes, traceability, freshness, errors, a11y_checks.

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
