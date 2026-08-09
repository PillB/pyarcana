# Pipeline ETL Reproducible de Clientes y Transacciones

**Versión:** 2.0.0 · **Nivel:** 1 · **Gate:** S08

## Usuario y problema
- **Usuario:** Ingeniero de datos en formación procesando lotes sintéticos.
- **Problema:** Ingerir CSV y JSON, validar contratos explícitos, preservar proveniencia (esto es, de dónde viene cada dato: qué archivo, qué fuente, qué fecha), separar filas aceptadas y en cuarentena (esto es, separar las filas que no cumplen el contrato para revisarlas), producir salidas deterministas, registrar hashes y manifiestos, soportar reruns seguros, manejar codificación y filas malformadas, sin secretos.

## Prerrequisitos
Haber completado S05 (OOP), S06 (NumPy), S07 (adquisición de datos), S08 (pandas).

## Secciones que contribuyen
S05, S06, S07, S08

## Datos
Dos fuentes sintéticas: clients.csv (id,name,email) y transactions.json (tx_id,client_id,amount,date).

Campos: clients: id,name,email, transactions: tx_id,client_id,amount,date

## Criterios de aceptación
- lote válido → accepted + manifest (esto es, una lista firmada con hashes que describe exactamente qué salió del proceso)
- fila con campo extra → cuarentena
- fila malformada → cuarentena, no crashea
- rerun produce mismo manifest hash
- cada accepted fila tiene source_file

## Fallos críticos (P0)
- Expone secretos
- No es idempotente (esto es, que repetir la misma operación no cambie el resultado)
- Sin cuarentena
- Pierde proveniencia

## Limitaciones
Procesamiento en lote local, no streaming. No usa base de datos externa.

## Remediación
Si falla idempotencia, verifica que un rerun produzca el mismo manifiesto. Si pierde proveniencia, agrega el campo source_file a cada fila.

## Interfaz de integración final
`etl.run(batch) -> EtlManifest` — Recibe un batch (dict con paths o listas). Devuelve EtlManifest con: accepted_count, quarantined_count, manifest_sha256, sources, lineage (esto es, el linaje: el registro de qué dato derivó de qué otro). Idempotente.
