# Interfaz de integración final — CP-FINAL

**Interfaz:** `platform.integrate(scenario) -> IntegrationBundle`

## Contrato de versión
- Versión del paquete: **2.0.0**.
- La interfaz es estable dentro de la misma versión mayor.
- CP-FINAL es invocado por el catálogo de capstones (`src/lib/capstones/catalog.ts`) a través del contrato declarado en `capstone_validation/architecture/final_integration_contracts.json`.

## Parámetros
- `scenario` (opcional): una instancia de `integration.shared_scenario.SharedScenario`. Si se omite, se usa el escenario canónico `shared_scenario_v1` (semilla `4252`).
- `backup_dir` (opcional): directorio donde serializar un respaldo JSON del bundle.
- `run_id` (opcional): identificador de ejecución; por defecto se deriva de la semilla del escenario.

## Retorno — `IntegrationBundle`
| Campo | Tipo | Descripción |
|---|---|---|
| `contract_id` | str | `"CP-FINAL"` |
| `contract_version` | str | `"2.0.0"` |
| `scenario_id` | str | Identificador del escenario |
| `subsystem_results` | dict[str, dict] | Los 12 contratos serializados |
| `end_to_end_trace` | list[dict] | traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después) en orden topológico |
| `dependency_graph` | dict | Nodos, aristas y `topological_order` |
| `evidence_bundle` | dict | `contracts`, `trace`, `dependency_graph`, `cards`, `reproducibility` |
| `no_go` | bool | True si un subsistema crítico falló |
| `no_go_reason` | str | Motivo (vacío si no es no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias)) |
| `backup_path` | str? | Ruta del respaldo JSON |
| `reproducible` | bool | True si la salida es determinista |

## Contratos de los 12 subsistemas
| Capstone | Interfaz | Tipo retornado |
|---|---|---|
| CP-N1-A | `intake_cli.run(records) -> IntakeResult` | `contracts.IntakeResult` |
| CP-N1-B | `etl.run(batch) -> EtlManifest` | `contracts.EtlManifest` |
| CP-N1-C | `familiarity.review(case) -> ReviewPacket` | `contracts.ReviewPacket` |
| CP-N2-A | `eda.profile(dataset) -> EdaReport` | `contracts.EdaReport` |
| CP-N2-B | `reports.render(spec) -> ReportBundle` | `contracts.ReportBundle` |
| CP-N2-C | `rpa.run(job) -> RpaAudit` | `contracts.RpaAudit` |
| CP-N3-A | `er.resolve(records) -> ClusterSet` | `contracts.ClusterSet` |
| CP-N3-B | `graph.investigate(query) -> GraphCase` | `contracts.GraphCase` |
| CP-N3-C | `triage.score(case) -> TriageDecision` | `contracts.TriageDecision` |
| CP-N4-A | `service.serve(request) -> ApiResponse` | `contracts.ApiResponse` |
| CP-N4-B | `platform.deploy(model) -> DeployRecord` | `contracts.DeployRecord` |
| CP-N4-C | `copilot.run(task) -> CopilotRunRecord` | `contracts.CopilotRunRecord` |

## Prohibiciones
- No exponer PII real a través de la interfaz.
- No realizar efectos secundarios externos sin aprobación humana (cuando aplica).
- No inferir relaciones, fraude ni causalidad automáticamente (cuando aplica).
- No crear referencias a `CP-N4-D` (no existe en el catálogo).
