# RUN — CP-FINAL (S52)

## Qué es
Paquete formal del gate final **Plataforma de Inteligencia de Relaciones y Operaciones**. Integra los 12 capstones previos mediante interfaces versionadas y contratos. Demo sintética, sin PII real ni inferencia de fraude.

## Requisitos
- Python 3.9+ (stdlib únicamente — sin dependencias externas).

## Cómo correr

```bash
cd course-state/capstones/CP-FINAL
python3 demo.py
```

Esperado: exit code `0` y una línea `METRICS_JSON: {...}` con `"status": "pass"` y `"subsystem_count": 12`.

## Tests

```bash
# Contratos + end-to-end locales
python3 -m unittest integration.contract_tests integration.e2e_test -v

# Adversarial (repo-wide)
python3 tests/adversarial/test_cp_final_integration.py
```

## Estructura del paquete
- `integration/` — orquestador, contratos, escenario compartido, 12 subsistemas, no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias), backup/restore, rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla), contract_tests, e2e_test.
- `data/generate.py` — generador del escenario sintético.
- `STARTER/` — scaffold para la persona que aprende.
- `BRIEF.md`, `RUBRIC.json`, `ARCHITECTURE.md`, `FINAL_INTERFACE.md` — documentación.
- `SECURITY.md`, `PRIVACY.md`, `ACCESSIBILITY.md`, `RESPONSIBLE_USE.md` — controles.
- `IDO.md`, `WEDO.md`, `YOUDO.md` — andamiaje pedagógico.

## Evidencia
Ver `evidence_manifest.json` y `execution.json` (generado al ejecutar el gate formal).

## Notas
- Datos 100% sintéticos (IDs ficticios, nombres inventados, `@example.test`).
- No envía red ni guarda secretos.
- Rúbrica y criterios: `gate.json` y `RUBRIC.json`.
- Tarjetas: `system_or_data_card.md` (system/data/model condensadas).
- Arquitectura y runbook (esto es, un manual de operaciones: qué hacer paso a paso cuando algo falla en producción): `ARCHITECTURE.md`.
