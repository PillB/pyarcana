# Auditoría curricular S14–S39

Fecha: 2026-07-22

Autoridad: `learning_roadmap_52_V3.md`

Alcance: 26 secciones estables, sin consultar respuestas/transcripciones de principiantes.

## Alineación y estructura

- Los títulos S14–S39 coinciden con la secuencia V3: NumPy/Pandas/calidad/EDA/reporting/RPA, seguidos por testing/SQL/ER/grafos/ML responsable/operación.
- Cada sección contiene 8 `subtopicId` únicos, 8 `demoId` únicos y 24 ejercicios con IDs V3: 208 subtemas, 208 demos y 624 ejercicios en este tramo.
- La auditoría de banco y autocheck reporta 1,248 variantes globales, 416 conceptos, cero P0 y cero P1.
- No aparecen las frases de boilerplate detectadas en la versión previa de S40–S52.

## Barrido runtime por sección

Se ejecutó `python_content_runtime_audit.py --only sNN- --workers 4` de forma independiente para cada sección S14…S39. Resultado agregado:

| Evidencia | Resultado |
|---|---:|
| Artefactos ejecutables aprobados | 1,347 |
| Fallas | 0 |
| P0 / P1 | 0 / 0 |
| Skips declarados | 8 |

Los 8 skips pertenecen a artefactos multiarchivo de S21 que el auditor clasifica explícitamente fuera del runner de un solo snippet; las demás 25 secciones no tuvieron skips. Las soluciones, demos y starters clasificados como ejecutables terminaron sin error ni timeout.

## Hallazgo pedagógico y corrección

### SELF-CHECK-POSITION-001 — P1

La mayoría de los autochecks ponía la respuesta correcta en `correctIndex: 1` en sus cuatro preguntas. Aunque el contenido fuera correcto, un estudiante podía explotar la posición en vez de razonar.

Corrección aplicada:

- se conservó exactamente la misma respuesta correcta y los mismos distractores;
- se reordenaron opciones con el ciclo determinista `0, 2, 3, 1` dentro de cada sección;
- las 26 secciones ahora usan las cuatro posiciones una vez en cada autocheck de cuatro preguntas;
- `scripts/rebalance_selfcheck_positions.mjs` funciona como check y como migración mecánica explícita; en modo check falla si una sección vuelve a concentrar posiciones.

Verificación posterior:

- 26/26 secciones sin sesgo posicional estructural;
- auditoría pedagógica global nuevamente verde (P0=0, P1=0);
- `git diff --check` limpio para el cambio.

## Revisión de diseño

La revisión estática cubrió cada archivo S14–S39 y confirmó:

- contratos visibles de input/output/error en ejercicios;
- starters deliberadamente incompletos acompañados por soluciones completas (no stubs de publicación);
- datos sintéticos y límites de inferencia en ER/ML;
- baseline, split/leakage, métricas, calibración, explicabilidad, equidad y abstención antes de operación;
- controles de aprobación humana, privacidad, recovery y observabilidad donde corresponden;
- cero `Lorem`, `John Doe`, `Acme`, `coming soon` o contenido “por implementar”.

Esta auditoría técnica/pedagógica no sustituye el gate agentic: los dos principiantes aislados todavía deben resolver el tramo usando únicamente el contenido secuencial publicado.
