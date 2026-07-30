# Interfaz de integración final

**Interfaz:** `familiarity.review(case) -> ReviewPacket`

Recibe un case (dict con señales). Devuelve ReviewPacket con: entity_evidence, relationship_evidence, risk_decisions (vacío), privacy_sheet, correction_mechanism, human_review_required=True.

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
