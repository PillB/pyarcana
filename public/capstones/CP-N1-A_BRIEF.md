# CLI Reproducible de Admisión de Clientes y Calidad de Datos

**Versión:** 2.0.0 · **Nivel:** 1 · **Gate:** S04

## Usuario y problema
- **Usuario:** Analista junior que ingresa clientes de prueba en un entorno de capacitación.
- **Problema:** Capturar registros sintéticos, validar campos requeridos, preservar valores crudos y normalizados, explicar rechazos, calcular denominadores correctamente y emitir resúmenes legibles por máquina y por humano.

## Prerrequisitos
Haber completado S01 (instalación), S02 (tipos y operadores), S03 (estructuras de datos).

## Secciones que contribuyen
S01, S02, S03, S04

## Datos
Registros sintéticos: id, name, email, amount. Incluye casos ok, warn (amount=0) y error.

Campos: id (str, requerido), name (str, no vacío), email (str, formato válido), amount (num, >= 0)

## Criterios de aceptación
- registro válido → status ok
- amount=0 → warn
- id faltante → error
- email mal → error
- amount negativo → error

## Fallos críticos (P0)
- Usa PII real
- Calcula denominadores incorrectamente
- No maneja entrada malformada
- Sin tests

## Limitaciones
No usa datos reales. No persiste en base de datos. La validación es de esquema, no de identidad.

## Remediación
Si falla en manejar entrada malformada, repasa S02 y agrega pruebas por rama. Si falla el cálculo de denominadores, escribe una prueba que compare el conteo manual con el del programa.

## Interfaz de integración final
`intake_cli.run(records) -> IntakeResult` — Recibe una lista de registros (dicts). Devuelve IntakeResult con: results, n_total, n_ok, n_warn, n_error, error_rate. Determinista.
