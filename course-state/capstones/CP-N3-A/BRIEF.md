# Motor de Resolución de Entidades (esto es, decidir si dos registros hablan de la misma persona o cosa, agrupándolos sin afirmar relaciones personales) Probable

**Versión:** 2.0.0 · **Nivel:** 3 · **Gate:** S30

## Usuario y problema
- **Usuario:** Ingeniero de datos que resuelve entidades sobre datos sintéticos.
- **Problema:** Construir un sistema ER con generación de candidatos, bloqueo, comparadores exactos y difusos, proveniencia (esto es, de dónde viene cada dato: qué archivo, qué fuente, qué fecha) de features, benchmark (esto es, un conjunto de pruebas etiquetadas para medir qué tan bien funciona un sistema) etiquetado, separación train/dev/test, precision y recall, selección de umbral (esto es, el valor de corte: por encima se decide una cosa, por debajo otra), cola de revisión de ambiguos, baseline (esto es, una línea base: el resultado más simple y determinista contra el que se compara todo lo demás) determinista, análisis de errores, y SIN inferir relaciones automáticamente.

## Prerrequisitos
CP-N2-C. S27 (async/concurrency), S28 (LLM agents), S29 (MLOps), S30 (security infra).

## Secciones que contribuyen
S27, S28, S29, S30

## Datos
Registros sintéticos de entidades con duplicados, aliases, Unicode, nombres comunes, hogares compartidos, identificadores conflictivos.

Campos: record_id, name, email, phone, address, label (gold)

## Criterios de aceptación
- duplicado exacto → mismo cluster
- umbral límite → revisión humana
- no infiere relación automáticamente
- nombres con acentos normalizados
- hogar compartido no se fusiona automáticamente
- análisis de falsos positivos (esto es, casos que el sistema marcó como coincidencia pero que un humano revisa y descarta) presente
- separación train/dev/test respetada

## Fallos críticos (P0)
- Infiere relaciones automáticamente
- Sin separación train/dev/test
- Sin baseline determinista
- Sin análisis de falsos positivos

## Limitaciones
No infiere relaciones. Solo agrupa entidades probables. Revisión humana para ambiguos.

## Remediación
Si el baseline no es determinista, fija la semilla. Si no hay separación train/dev/test, divídela.

## Interfaz de integración final
`er.resolve(records) -> ClusterSet` — Recibe records. Devuelve ClusterSet con: clusters, ambiguous_queue, metrics (precision, recall), fp_analysis, baseline (determinista), no relationship inference.
