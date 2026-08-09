# Arquitectura — CP-FINAL

## Diagrama (ASCII)

```
                                ┌────────────────────────────────────────┐
                                │      shared_scenario_v1 (read-only)    │
                                │  clients · transactions · entities ·   │
                                │  cases                                 │
                                └─────────────────┬──────────────────────┘
                                                  │  (the platform splits the
                                                  │   scenario into per-capstone
                                                  │   inputs — NO subsistema
                                                  │   imports another)
                                                  ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │                       platform.integrate(scenario)                        │
   │                        -> IntegrationBundle                               │
   └───────────────────────────────────────────────────────────────────────────┘
                                                  │  (topological order)
        ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼          ▼          ▼          ▼
   ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐
   │CP-N1-A  ││CP-N1-B  ││CP-N1-C  ││CP-N2-A  ││CP-N2-B  ││CP-N2-C  ││CP-N3-A  │
   │intake   ││etl      ││famil.   ││eda      ││reports  ││rpa      ││er       │
   │.run()   ││.run()   ││.review()││.profile()││.render()││.run()   ││.resolve()│
   └─────────┘└─────────┘└─────────┘└─────────┘└─────────┘└─────────┘└─────────┘
        ▼          ▼          ▼          ▼          ▼          ▼          ▼
   ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐
   │CP-N3-B  ││CP-N3-C  ││CP-N4-A  ││CP-N4-B  ││CP-N4-C  │
   │graph    ││triage   ││service  ││platform ││copilot  │
   │.invest()││.score() ││.serve() ││_ml.dep()││.run()   │
   └─────────┘└─────────┘└─────────┘└─────────┘└─────────┘
        │          │          │          │          │
        └──────────┴──────────┴──────────┴──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │  no_go.evaluate()  │
                  └─────────┬──────────┘
                            ▼
                  ┌────────────────────┐    ┌──────────────────┐
                  │  IntegrationBundle │───▶│ backup_restore   │
                  │  (contracts +      │    │  .backup/.restore│
                  │   trace + graph +  │    └──────────────────┘
                  │   cards + repro)   │    ┌──────────────────┐
                  │                    │───▶│ rollback proof   │
                  └────────────────────┘    └──────────────────┘
```

## ADRs (resumen)
- **ADR-001 Subsistemas por contrato, no por código acoplado.** Cada subsistema expone su interfaz catalogada y se comunica solo a través de `contracts.py`. Un AST guard en `tests/adversarial/test_cp_final_integration.py` impide que un subsistema importe a otro.
- **ADR-002 Grafo de dependencias topológico.** `dependency_graph.get_graph()` expone el orden canónico declarado en `capstone_validation/architecture/capstone_dependency_graph.json`; el orquestador respeta ese orden.
- **ADR-003 no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias) sobre éxito parcial.** Si un subsistema crítico falta o viola una bandera crítica, el bundle retorna `no_go=True` con un motivo accionable.
- **ADR-004 Reproducibilidad.** El escenario y las traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después) son deterministas dada la misma semilla; `duration_ms` se sintetiza por índice de paso para evitar `time.monotonic()` no determinista.
- **ADR-005 Sin `CP-N4-D`.** El catálogo prohíbe esa referencia; el orquestador solo integra los 12 capstones canónicos.
- **ADR-006 Stdlib únicamente.** Ninguna dependencia externa es requerida; el demo corre en un entorno limpio con Python 3.9+.

## data card (esto es, una tarjeta del dataset: documenta qué hay, de dónde viene, sus límites y usos permitidos)
- **Fuente:** `shared_scenario_v1` (determinista, semilla `4252`).
- **PII:** ninguna. Nombres ficticios; correos en `@example.test`.
- **Licencia:** uso interno de capacitación únicamente.
- **Sesgo:** no aplica (datos sintéticos, no representativos de población real).
- **Retención:** los respaldos JSON en `evidence_backups/` pueden eliminarse sin afectar la corrección del demo.

## model card (esto es, una tarjeta del modelo: documenta qué hace, cómo se evaluó, sus límites y usos responsables) (triage — CP-N3-C)
- **Tipo:** baseline (esto es, una línea base: el resultado más simple y determinista contra el que se compara todo lo demás) determinista (sin pesos aprendidos); `score = min(1, amount_sum / 1000)`.
- **calibración (esto es, verificar que los puntajes del modelo correspondan a probabilidades reales):** reportada como buckets fijos `[0, 0.33)`, `[0.33, 0.66)`, `[0.66, 1]`.
- **abstención (esto es, que el modelo diga 'no sé' en vez de adivinar cuando no está seguro):** soportada (`abstained=True` cuando no hay señales o `amount_sum == 0`).
- **Revisión humana:** siempre requerida (`human_review_required=True`).
- **Fuga de datos:** prevenida (`data_leakage_prevented=True`); solo se usan señales declaradas en el caso.

## system card (esto es, una tarjeta del sistema: documenta el sistema completo, sus modos de fallo y sus salvaguardas)
Ver `system_or_data_card.md` para el system card formal. Resumen:
- Sin root; sin secretos embebidos; sin red.
- Health checks presentes (`ApiResponse.health_check_passed`).
- Migraciones declaradas (`ApiResponse.migrations_applied`).
- SLO (esto es, un objetivo de nivel de servicio: la promesa medible de qué tan disponible o rápido debe estar el sistema) definidos y medidos (`DeployRecord.slo`).
- Rollback demostrado (`DeployRecord.rollback_proven`).
- HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible) en efectos sensibles (`CopilotRunRecord.hitl_on_sensitive_effects`).

## modelo de amenazas (esto es, un análisis de qué podría atacar al sistema y cómo, para diseñar defensas)
| Activo | Amenaza | Mitigación |
|---|---|---|
| Escenario compartido | Mutación accidental por un subsistema | `shared_scenario.clone()` y AST guard |
| Contratos | Falsificación de `contract_id`/`contract_version` | `no_go.evaluate` valida tipo + versión |
| Trazas | Fuga de PII | `traces_redacted=True`, `logs_pii_free=True` |
| Rollback | Falta de prueba | `_prove_rollback` en `platform_ml.py` y `demonstrate_rollback` en `rollback.py` |
| Respaldo | Archivo corrupto | `backup_restore.restore` valida `schema` |

## runbook (esto es, un manual de operaciones: qué hacer paso a paso cuando algo falla en producción) operacional
1. **Ejecutar demo:** `python3 course-state/capstones/CP-FINAL/demo.py` → exit 0 + `METRICS_JSON`.
2. **Inspeccionar bundle:** `evidence_backups/cp_final_backup_<scenario_id>.json`.
3. **Fallo de subsistema:** si `no_go=True`, leer `no_go_reason`; corregir el subsistema; re-correr.
4. **Rollback de emergencia:** `integration.rollback.demonstrate_rollback()` restaura el snapshot previo (en memoria).
5. **Restaurar respaldo:** `integration.backup_restore.restore(path)` devuelve el bundle serializado.
6. **Verificar reproducibilidad:** comparar dos runs con la misma semilla; deben ser idénticos salvo `backup_path`.

## Demo concisa
```bash
cd course-state/capstones/CP-FINAL
python3 demo.py
# METRICS_JSON: {"capstone_id":"CP-FINAL", "status":"pass", "subsystem_count":12, ...}
# CP-FINAL Integration OK — 12/12 subsystems green
```

## Notas de defensa técnica
- **¿Por qué 12 contratos separados en lugar de un monolito?** Porque el spec prohíbe "doce proyectos en un repositorio". Los contratos permiten cambiar la implementación de un subsistema sin romper el resto.
- **¿Por qué un AST guard?** Un test de tipos no impediría acoplamiento runtime (por ejemplo, imports dinámicos). El AST guard declara la intención a nivel de código fuente.
- **¿Por qué `duration_ms` sintético?** `time.monotonic()` no es determinista; usarlo rompería el test de reproducibilidad. El índice de paso es suficiente para ordenar la traza.
- **¿Por qué `no_go` evalúa type + version + flags?** Sin los tres, un subsistema podría devolver un objeto "parecido" al contrato correcto pero con la versión equivocada y romper downstream silenciosamente.
