# System card — Plataforma de Inteligencia de Relaciones y Operaciones (CP-FINAL)

| Campo | Valor |
|---|---|
| Capstone | CP-FINAL — Plataforma de Inteligencia de Relaciones y Operaciones |
| Gate | S52 |
| Versión del paquete | 2.0.0 |
| Tipo | System card (incluye data card y model card condensados) |
| Propósito | Integrar los 12 capstones previos mediante interfaces versionadas y contratos, con pruebas end-to-end, rollback demostrado, tarjetas y runbook operacional. |
| Datos | Sintéticos únicamente (`shared_scenario_v1`, semilla `4252`); sin PII real. |
| Interfaces | `platform.integrate(scenario) -> IntegrationBundle` (ver `FINAL_INTERFACE.md`). |
| Seguridad | Sin secretos reales; auth mock; sin root; sin red. |
| Privacidad | Minimización; sin PII real; trazas redactadas; logs sin PII. |
| Human-in-the-loop | Requerido en decisiones sensibles (RPA, Copilot, triage). |
| Observabilidad | Métricas JSON + traza end-to-end + evidence bundle. |
| Rollback / recovery | Demostrado (`integration/rollback.py`, `integration/platform_ml.py::_prove_rollback`). |
| Backup / restore | `integration/backup_restore.py` (JSON local). |
| No-go | Si un subsistema crítico falla, `no_go=True` con motivo accionable. |
| Reproducibilidad | Determinista dada la misma semilla del escenario. |
| Limitaciones | Demo pedagógica local; no es despliegue enterprise real. |

## Data card (condensada)
- Fuente: `shared_scenario_v1` (determinista, semilla `4252`).
- PII: ninguna. Nombres ficticios; correos en `@example.test`.
- Licencia: uso interno de capacitación únicamente.
- Sesgo: no aplica (datos sintéticos).
- Retención: respaldos en `evidence_backups/` eliminables sin afectar corrección.

## Model card (condensada — triage CP-N3-C)
- Tipo: baseline determinista (sin pesos aprendidos).
- Calibración: buckets fijos `[0, 0.33)`, `[0.33, 0.66)`, `[0.66, 1]`.
- Abstención: soportada.
- Revisión humana: siempre requerida.
- Fuga de datos: prevenida.

## No-go
- Inferencia automática de fraude/parentesco.
- Envío de datos reales a proveedores públicos.
- Afirmar impacto de negocio no medido.
- Referencias a `CP-N4-D` (no existe en el catálogo).
- Acoplamiento directo entre subsistemas (prohibido por AST guard).

## Runbook
Ver `ARCHITECTURE.md` (sección Runbook operacional).
