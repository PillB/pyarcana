# Ficha de datos — Intake sintético N1-A

| Campo | Valor |
|---|---|
| Capstone | CP-N1-A — Client Intake & Data Quality Script |
| Gate | S04 |
| Tipo | Data card (sintético) |
| Fuente | Generada en `demo.py` con seed fija |
| PII real | **Ninguna** |
| Uso previsto | Enseñanza, demo de portafolio, gate formal |
| Uso no previsto | Decisiones legales, crédito, fraude, HR real |
| Retención | Ephemeral / local del estudiante |
| Calidad | Controlada por asserts del demo |
| Limitaciones | No representa distribución poblacional real del Perú ni de ningún mercado |
| Contacto de ownership | Learner + PyArcana formal lane |

## Campos típicos (sintéticos)
IDs (`C001`…), montos inventados, códigos de estado, scores de calidad. Nombres como `Ana Demo`, `Cliente Sintetico 3`.

## Controles
- No logging de secretos.
- No envío a APIs externas en el demo formal.
- Reproducibilidad vía seed.
