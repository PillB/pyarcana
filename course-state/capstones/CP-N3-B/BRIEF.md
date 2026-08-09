# Mesa de Trabajo de Investigación de Relaciones

**Versión:** 2.0.0 · **Nivel:** 3 · **Gate:** S34

## Usuario y problema
- **Usuario:** Analista que investiga relaciones sobre un grafo sintético.
- **Problema:** Construir una mesa que representa entidades y evidencia como grafo explicable, preserva fuente y timestamp, soporta búsqueda de caminos, distingue enlaces directos de inferidos, limita profundidad, filtra por autorización, muestra incertidumbre, soporta notas y corrección, evita etiquetas automáticas de fraude, y soporta reproducibilidad de caso.

## Prerrequisitos
CP-N3-A. S31 (streaming data), S32 (microservices), S33 (advanced models), S34 (CV/AI integration).

## Secciones que contribuyen
S31, S32, S33, S34

## Datos
Grafo sintético de entidades y evidencia con enlaces directos e inferidos, timestamps y fuentes.

Campos: entity_id, edge: source, target, type, source_ref, timestamp, inferred (bool), uncertainty

## Criterios de aceptación
- búsqueda de camino → explicación
- profundidad limitada
- no etiqueta fraude automáticamente
- cada enlace responde 6 preguntas
- filtro por autorización
- mismo caso → mismo grafo

## Fallos críticos (P0)
- Etiquetas automáticas de fraude
- Sin distinción enlace directo/inferido
- Sin control de autorización
- Sin reproducibilidad de caso

## Limitaciones
No etiqueta fraude automáticamente. Profundidad limitada.

## Remediación
Si un enlace no tiene fuente, agrégala o elimínalo. Si se mezclan directos e inferidos, sepáralos.

## Interfaz de integración final
`graph.investigate(query) -> GraphCase` — Recibe query. Devuelve GraphCase con: paths, edges (cada uno con source/meaning/not_meaning/age/who_may_see/correction), uncertainty, notes, no fraud labels, reproducible.
