# Interfaz de integración final

**Interfaz:** `cp_n1_a.run(records) -> dict`

Recibe una lista de registros (dicts con `edad`, `region`, `monto_ingreso` y `raw_line`).
Devuelve un dict con `results` (una entrada por registro con `raw_line`, `estado` y `motivos`),
`n_total`, `n_accept`, `n_review`, `n_reject` y `tasa_reject` (`None` si el lote está vacío).
Determinista. Las reglas están en `BRIEF.md`.

## Contrato de versión
- Versión del paquete: 3.0.0. La 2.0.0 nombraba `intake_cli.run(...) -> IntakeResult`, un
  módulo que no existía; la 3.0.0 nombra el archivo que escribes y devuelve un dict.
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en
  `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer datos de personas reales a través de la interfaz.
- No tomar decisiones sobre personas: `reject` describe el formato del registro.
