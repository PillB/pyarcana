# Interfaz de integración final

**Interfaz:** `cp_n1_c.review(case) -> ReviewPacket` y
`cp_n1_c.apply_correction(packet, pair_id, new_status, reason) -> ReviewPacket`

`review` recibe un caso, `{"case_id": ..., "people": [...]}`, y devuelve un `ReviewPacket`
congelado (`@dataclass(frozen=True)`) con tres capas separadas: `entity_evidence`,
`relationship_evidence` (con `kinship_verdict: None` en cada par) y `decisions` (un estado de
`invalid_input`, `abstain`, `needs_review` o `accept_pair` por par). Lleva también
`risk_decisions` (siempre vacío), `review_queue` (seudónimos), `privacy_sheet`, `corrections` y
`human_review_required=True`. `apply_correction` devuelve un paquete nuevo con la corrección
anotada y rechaza un motivo vacío. Las reglas están en `BRIEF.md`.

## Contrato de versión
- Versión del paquete: 3.0.0. La 2.0.0 nombraba `familiarity.review(case)`, un módulo que no
  existía, y su demo marcaba pares como la misma entidad sin revisión. La 3.0.0 nombra el archivo
  que escribes y sigue el contrato del You Do de S13.
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en
  `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer datos de personas reales a través de la interfaz.
- No escribir `auto_fraud`, `is_family` ni ninguna decisión de riesgo.
- No mezclar el score de relación en la decisión de identidad.
