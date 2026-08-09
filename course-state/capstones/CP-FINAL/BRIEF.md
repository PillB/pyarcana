# Plataforma de Inteligencia de Relaciones y Operaciones (CP-FINAL)

**Versión:** 2.0.0 · **Nivel:** 4 · **Gate:** S52 · **Final:** sí

## Usuario y problema
- **Usuario:** Egresando del curso que monta una demostración integrada sobre un escenario sintético compartido.
- **Problema:** Integrar los **doce** capstones previos (CP-N1-A … CP-N4-C) mediante **interfaces versionadas**, contratos explícitos, grafo de dependencias, despliegue reproducible y pruebas end-to-end. El spec prohíbe explícitamente "doce proyectos en un repositorio": la integración debe ser por **contrato**, no por código acoplado.

## Prerrequisitos
Los 12 capstones previos: CP-N1-A, CP-N1-B, CP-N1-C, CP-N2-A, CP-N2-B, CP-N2-C, CP-N3-A, CP-N3-B, CP-N3-C, CP-N4-A, CP-N4-B, CP-N4-C.
Secciones contribuyentes: S04, S08, S13, S17, S21, S26, S30, S34, S39, S43, S47, S51, S52.

## Datos
- Escenario sintético compartido (`shared_scenario_v1`) con clientes, transacciones, entidades y casos.
- Sin PII real. Sin red. Sin dependencias de pago. Stdlib de Python solamente.

## Interfaz de integración final
`platform.integrate(scenario) -> IntegrationBundle`

`IntegrationBundle` contiene:
- `subsystem_results`: los 12 contratos serializados.
- `end_to_end_trace`: traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después) ordenadas topológicamente.
- `dependency_graph`: nodos, aristas y orden topológico.
- `evidence_bundle`: contratos + traza + grafo + tarjetas (data/model/system) + reproducibilidad.
- `no_go`, `no_go_reason`: evaluación de condición de no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias).
- `backup_path`: respaldo JSON del bundle.
- `reproducible`: True si la salida es determinista dada la misma semilla.

## Criterios de aceptación
- Las 12 dependencias están presentes en el bundle.
- Cada subsistema devuelve su contrato declarado (`contract_id` y `contract_version`).
- Pruebas end-to-end presentes y pasan.
- rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla) demostrado (restaura estado previo).
- No-go dispara si un subsistema crítico falla.
- Traza end-to-end presente y ordenada.
- Evidence bundle presente (contratos + traza + grafo + tarjetas).
- Reproducible (misma semilla → mismo bundle).
- AST guard: ningún subsistema importa a otro (comunican vía contratos).
- Tarjetas data/model/system presentes.
- runbook (esto es, un manual de operaciones: qué hacer paso a paso cuando algo falla en producción) operacional presente.

## Fallos críticos (P0)
- Colección de repositorios sin contratos.
- Sin pruebas end-to-end.
- Sin rollback.
- Sin tarjetas (data/model/system).
- Sin runbook operacional.

## Limitaciones
- Demo pedagógica local; no es un despliegue enterprise real.
- Los subsistemas son versiones acotadas y sintéticas de cada capstone; no reemplazan a los capstones completos.
- No se conecta a redes reales ni a proveedores externos.
- Los "SLO (esto es, un objetivo de nivel de servicio: la promesa medible de qué tan disponible o rápido debe estar el sistema)" y "canary (esto es, liberar primero a un grupo pequeño y vigilarlo antes de soltar el cambio para todos)" se simulan.

## Remediación
- Si falta un contrato, agrégalo en `integration/contracts.py` y un test en `integration/contract_tests.py`.
- Si un subsistema importa a otro, refactoriza para comunicar vía contrato desde `platform.py`.
- Si no hay rollback demostrado, ejercita `integration/rollback.py::demonstrate_rollback`.

## Declaración de contribución personal
Este paquete es trabajo pedagógico individual. El estudiante integra, documenta y prueba la plataforma; no reclama autoría sobre código de terceros ni sobre los capstones previos más allá de su propia implementación de los subsistemas acotados.

## Narrativa de CV (veraz)
- **No afirmar:** "construí una plataforma enterprise en producción".
- **Sí afirmar:** "integré doce capstones de un curso de Python mediante interfaces versionadas y contratos, con pruebas end-to-end, rollback demostrado y tarjetas de modelo/sistema, en un entorno sintético local".
- **No afirmar:** antigüedad laboral, nivel "senior"/"staff", ni certificación profesional externa.
