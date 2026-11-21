# Interfaz de integración final

**Interfaz:** `cp_n1_b.run(data_dir, out_dir, run_id=None) -> int`

Lee `clients.csv` y `transactions.json` de `data_dir` y escribe en `out_dir`: `clean/`,
`quarantine/`, `backups/{run_id}/` y, al final, `manifest.json`. Devuelve 0 si publicó todo y 1,
sin publicar nada, si una fuente no cumple `n_in == n_clean + n_quarantine`. El manifest tiene
`run_id`, `sources` (`name`, `sha256`, `n_in`, `n_clean`, `n_quarantine`, `n_blank_ignored` y
`reconcile_ok` de cada fuente) y los totales `n_in`, `n_clean`, `n_quarantine` y
`reconcile_ok`, sumados desde `sources`. Las reglas están en `BRIEF.md`.

Idempotente: con los mismos datos, `clean`, `quarantine` y `sources` son iguales en cada corrida;
solo cambia `run_id`, que identifica la corrida.

## Contrato de versión
- Versión del paquete: 3.0.0. La 2.0.0 nombraba `etl.run(batch) -> EtlManifest`, un módulo y un
  tipo que no existían; la 3.0.0 nombra el archivo que escribes y sigue el contrato del You Do de
  S08.
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL invoca esta interfaz a través del contrato declarado en
  `capstone_validation/architecture/final_integration_contracts.json`.

## Prohibiciones
- No exponer datos de personas reales a través de la interfaz.
- No escribir fuera de `out_dir`: un `run_id` que no sea solo letras y dígitos ASCII lanza `ValueError`.
- No tratar la cuarentena como una acusación: solo dice que la fila no cumple el contrato.
