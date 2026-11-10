# CLI Reproducible de Admisión de Clientes y Calidad de Datos

**Versión:** 2.0.0 · **Nivel:** 1 · **Gate:** S04

## Usuario y problema
- **Usuario:** Analista junior que ingresa clientes de prueba en un entorno de capacitación.
- **Problema:** Capturar registros sintéticos, validar cada campo, preservar el valor crudo de cada registro, explicar rechazos y revisiones, calcular denominadores correctamente y emitir resúmenes legibles por máquina y por humano.

## Prerrequisitos
Haber completado S01 (instalación), S02 (tipos y operadores), S03 (estructuras de datos) y S04 (iteración y resúmenes).

## Secciones que contribuyen
S01, S02, S03, S04

## Datos
Registros sintéticos con cuatro campos: `edad`, `region`, `monto_ingreso` y `raw_line`. `raw_line` es la línea cruda que llegó del intake y no se modifica.

- `edad` (int, 0 a 120): ausente → revisión; no numérica → rechazo; menor de 18 → revisión; resto → aceptado.
- `region`: una de `R-NORTE`, `R-SUR`, `R-CENTRO` o `R-COSTA` → aceptado; ausente o fuera del catálogo → revisión.
- `monto_ingreso` (int o Decimal, >= 0): ausente → revisión; no numérico → rechazo; negativo → rechazo; mayor que 50000 → revisión; resto (incluido el cero) → aceptado.

Cada registro toma el peor estado de sus campos: `reject` si algún campo rechaza, `review` si ninguno rechaza y alguno revisa, `accept` en los demás casos.

## Criterios de aceptación
- registro con campos válidos → `accept`
- `monto_ingreso = 0` → `accept` (cero es un monto válido)
- `edad` ausente → `review`
- `region` fuera del catálogo → `review`
- `monto_ingreso` negativo → `reject`
- `edad` como texto → `reject`
- el resumen cumple `n_total = n_accept + n_review + n_reject`
- `tasa_reject = n_reject / n_total`, y vale `None` cuando el lote está vacío

## Fallos críticos (P0)
- Usa PII real
- Calcula denominadores incorrectamente (dividir entre accepts, o entre cero sin guardia)
- No maneja entrada malformada (un registro malo no detiene el lote)
- Sin tests, o tests que no pueden fallar

## Limitaciones
No usa datos reales. No persiste en base de datos. La validación es de esquema y de rango, no de identidad.

## Remediación
Si un registro malformado detiene el lote, repasa S02 y S03 y agrega una rama por caso. Si falla el cálculo de denominadores, escribe una prueba que compare el conteo a mano con el del programa, incluido el lote vacío.

## Interfaz de integración final
`intake_cli.run(records) -> IntakeResult` — Recibe una lista de registros (dicts con `edad`, `region`, `monto_ingreso`, `raw_line`). Devuelve IntakeResult con: `results`, `n_total`, `n_accept`, `n_reject`, `n_review`, `tasa_reject`. Determinista. En este paquete la función vive en `demo.py` como `run(records)`.
