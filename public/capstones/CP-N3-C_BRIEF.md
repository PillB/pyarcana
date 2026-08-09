# Triaje Responsable de Casos con ML

**Versión:** 2.0.0 · **Nivel:** 3 · **Gate:** S39

## Usuario y problema
- **Usuario:** Científico de datos que tria casos sintéticos con salvaguardas.
- **Problema:** Construir un modelo de apoyo a decisiones que comienza con baseline (esto es, una línea base: el resultado más simple y determinista contra el que se compara todo lo demás) determinista, previene fuga de datos, separa entrenamiento y evaluación, reporta calibración (esto es, verificar que los puntajes del modelo correspondan a probabilidades reales), elige umbrales por costos declarados, soporta abstención (esto es, que el modelo diga 'no sé' en vez de adivinar cuando no está seguro), rutea casos inciertos a revisión humana, mide desempeño por subgrupo y temporal, produce tarjeta de modelo, monitorea drift (esto es, deriva: cuando los datos reales cambian con el tiempo y el modelo envejece) y calidad, y NO toma decisiones adversas sin revisión.

## Prerrequisitos
CP-N3-B. S35 (system design), S36 (AI APIs advanced), S37 (dbt/bigquery), S38 (performance extreme), S39 (integrator).

## Secciones que contribuyen
S35, S36, S37, S38, S39

## Datos
Casos sintéticos etiquetados con features, costo de FP/FN declarado, subgrupos y timestamp.

Campos: case_id, features (dict), label (gold), subgrupo (esto es, un segmento de la población, para verificar que el sistema funcione bien en cada uno), timestamp, cost_fp, cost_fn

## Criterios de aceptación
- triage produce score + decisión de apoyo
- umbral (esto es, el valor de corte: por encima se decide una cosa, por debajo otra) por costo → revisión humana
- no decisión adversa sin revisión
- no fuga de datos
- calibración reportada
- abstención soportada
- desempeño por subgrupo
- tarjeta de modelo presente

## Fallos críticos (P0)
- Decisión adversa sin revisión
- Fuga de datos
- Sin calibración
- Sin abstención

## Limitaciones
No toma decisiones adversas sin revisión. Apoyo a decisiones, no automatización.

## Remediación
Si hay fuga de datos, revisa la separación. Si no hay calibración, agrégala.

## Interfaz de integración final
`triage.score(case) -> TriageDecision` — Recibe case. Devuelve TriageDecision con: score, threshold (esto es, un umbral: el valor de corte sobre el que se decide), decision (support only), abstention, human_review_required, calibration, subgroup_metrics, model_card, no adverse auto decision.
