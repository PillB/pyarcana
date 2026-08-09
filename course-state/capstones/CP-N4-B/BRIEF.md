# Plataforma de Datos y ML en Producción

**Versión:** 2.0.0 · **Nivel:** 4 · **Gate:** S47

## Usuario y problema
- **Usuario:** Ingeniero MLOps que gobierna modelos en un entorno acotado.
- **Problema:** Implementar linaje de datos y modelos, experimentos reproducibles, versionado de datasets, registro, firmas de modelos/artefactos, consistencia train/serve, CI/CD, staging, gate de aprobación, evaluación shadow (esto es, correr el modelo nuevo en paralelo sin afectar a usuarios, solo para comparar)/canary (esto es, liberar primero a un grupo pequeño y vigilarlo antes de soltar el cambio para todos), SLO (esto es, un objetivo de nivel de servicio: la promesa medible de qué tan disponible o rápido debe estar el sistema), rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla) y recuperación last-known-good, registros de cambios e incidentes. Debe PROBAR rollback, no solo documentarlo.

## Prerrequisitos
CP-N4-A. S44 (multimodal), S45 (IaC), S46 (GPU computing), S47 (opensource).

## Secciones que contribuyen
S44, S45, S46, S47

## Datos
Datasets versionados sintéticos + modelos versionados (deterministas).

Campos: dataset_version, model_version, signature, slo_target

## Criterios de aceptación
- deploy → DeployRecord con linaje
- canary falla → rollback
- sin aprobación → no deploy
- rollback restaura last-known-good
- train/serve mismo esquema
- SLOs definidos y medidos
- linaje de datos y modelos

## Fallos críticos (P0)
- Sin rollback demostrado
- Sin aprobación
- Sin consistencia train/serve
- Sin SLOs

## Limitaciones
Demo local acotado. El 'shadow/canary' se simula. No despliega a la nube real.

## Remediación
Si no hay rollback demostrado, agrégalo y pruébalo. Si no hay aprobación, agrégala.

## Interfaz de integración final
`platform.deploy(model) -> DeployRecord` — Recibe model. Devuelve DeployRecord con: lineage (esto es, el linaje: el registro de qué dato derivó de qué otro), approval, canary_result, slo, rollback_available, rollback_proven, train_serve_consistent.
