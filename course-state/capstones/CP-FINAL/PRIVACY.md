# Privacidad — CP-FINAL

Solo se usan datos sintéticos. Ningún subsistema recibe PII real.

## Principios
- **Minimización:** el escenario compartido solo contiene IDs sintéticos, nombres ficticios (`Ana Sintetico`, `Bruno Demo`, …) y correos en `@example.test`.
- **Sin recopilación:** la plataforma no recopila datos del entorno; solo consume `shared_scenario_v1`.
- **proveniencia (esto es, de dónde viene cada dato: qué archivo, qué fuente, qué fecha):** cada contrato lleva `contract_id` y `contract_version`; cada traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después) lleva `subsistema` y `run_id`.
- **Mecanismo de corrección:** `familiarity.review` expone `correction_mechanism=True`.
- **Hojas de privacidad:** `ReviewPacket.privacy_sheet` documenta minimización y retención.

## Redacción de trazas
- `copilot.run` marca `traces_redacted=True`.
- `rpa.run` marca `logs_pii_free=True`.

## Retención
- Los respaldos (`evidence_backups/`) se generan localmente; pueden eliminarse sin afectar la corrección del demo.
