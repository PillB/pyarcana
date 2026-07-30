# Fábrica de Reportes y Tablero Accesible

**Versión:** 2.0.0 · **Nivel:** 2 · **Gate:** S21

## Usuario y problema
- **Usuario:** Analista que publica reportes accesibles para stakeholders.
- **Problema:** Construir un tablero accesible con plantillas reutilizables, exportación de tablas y gráficos, lógica de filtros, trazabilidad fuente-claim, indicadores de frescura, estados de error y vacío, etiquetas accesibles, operación por teclado, salida PDF, y verificaciones automatizadas.

## Prerrequisitos
CP-N2-A. S18 (data engineering), S19 (databases/ORM), S20 (RAG (esto es, Generación Aumentada por Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada afirmación)), S21 (FastAPI).

## Secciones que contribuyen
S18, S19, S20, S21

## Datos
Datos sintéticos de KPIs por región y mes.

Campos: month, region, kpi, value, source_ref

## Criterios de aceptación
- render produce report bundle
- estado vacío manejado
- eje engañoso detectado por check
- codificación no es solo color
- cada claim tiene source_ref

## Fallos críticos (P0)
- Ejes engañosos
- Codificación solo por color
- Denominadores ocultos
- Claims ejecutivos no soportados

## Limitaciones
Tablero estático en el demo. La accesibilidad se verifica con chequeos automatizados.

## Remediación
Si un eje es engañoso, fija la escala. Si la codificación es solo color, agrega textura/etiqueta.

## Interfaz de integración final
`reports.render(spec) -> ReportBundle` — Recibe spec (dict con datos + plantilla). Devuelve ReportBundle con: tables, charts, pdf_bytes, traceability, freshness, errors, a11y_checks.
