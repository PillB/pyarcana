# Interfaz de integración final

**Interfaz:** `triage.score(case) -> TriageDecision`

Recibe case. Devuelve TriageDecision con: score, threshold (esto es, un umbral: el valor de corte sobre el que se decide), decision (support only), abstention, human_review_required, calibration, subgroup_metrics, model_card, no adverse auto decision.

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
