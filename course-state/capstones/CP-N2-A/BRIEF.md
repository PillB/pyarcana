# Portafolio Ejecutivo de Calidad de Datos y EDA

**Versión:** 2.0.0 · **Nivel:** 2 · **Gate:** S17

## Usuario y problema
- **Usuario:** Analista que prepara un informe ejecutivo sobre datos sintéticos.
- **Problema:** Producir un paquete analítico reproducible con diccionario, profiling, missingness, reconciliación, distribuciones, comparaciones por segmento, outliers con justificación, supuestos, limitaciones y memo ejecutivo que distinga observación/asociación/hipótesis/recomendación/limitación.

## Prerrequisitos
CP-N1-C. S14 (seguridad), S15 (stdlib deep), S16 (wxPython GUI), S17 (packaging).

## Secciones que contribuyen
S14, S15, S16, S17

## Datos
Dataset sintético de ventas con missingness, outliers y segmentos (región, producto).

Campos: date, region, product, units, revenue, cost

## Criterios de aceptación
- profiling produce diccionario + distribuciones
- missingness reportado por columna
- no hay interpretación causal sin soporte
- mismo seed → mismo reporte
- memo tiene 5 categorías

## Fallos críticos (P0)
- Interpretación causal no soportada
- Sin reproducibilidad
- Sin memo ejecutivo
- Sin limitaciones

## Limitaciones
No establece causalidad. El memo distingue observación de decisión. Reproducible con entorno fijado.

## Remediación
Si el memo confunde observación con recomendación, separa las cinco categorías. Si no es reproducible, fija la semilla y versiona dependencias.

## Interfaz de integración final
`eda.profile(dataset) -> EdaReport` — Recibe dataset. Devuelve EdaReport con: dictionary, profiling, missingness, reconciliation, distributions, segments, outliers, assumptions, limitations, executive_memo (5 categorías).
