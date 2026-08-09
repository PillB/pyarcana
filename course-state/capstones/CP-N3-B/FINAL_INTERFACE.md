# Interfaz de integración final

**Interfaz:** `graph.investigate(query) -> GraphCase`

Recibe query. Devuelve GraphCase con: paths, edges (cada uno con source/meaning/not_meaning/age/who_may_see/correction), uncertainty, notes, no fraud labels, reproducible.

## Contrato de versión
- Versión del paquete: 2.0.0
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
