# RUN — CP-N2-B (S21)

## Qué es
Paquete formal del gate **Accessible Insights Dashboard & Reporting Factory**. Demo sintética, sin PII real ni inferencia de fraude.

## Requisitos
- Python 3.10+ (stdlib).
- Opcional: `numpy` / `pandas` si están instalados (el demo cae a stdlib si faltan).

## Cómo correr

```bash
cd course-state/capstones/CP-N2-B
python3 demo.py
```

Esperado: exit code `0` y una línea JSON de métricas (prefijo `METRICS_JSON:`).

## Evidencia
Ver `evidence_manifest.json` y `execution.json` (generado al ejecutar el gate formal).

## Notas
- Datos 100% sintéticos (IDs ficticios, nombres inventados).
- No envía red ni guarda secretos.
- Rúbrica y criterios: `gate.json`.
- Ficha: `system_or_data_card.md`.
