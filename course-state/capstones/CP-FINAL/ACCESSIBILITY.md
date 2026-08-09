# Accesibilidad — CP-FINAL

El estado de la integración se comunica en texto plano y JSON.

## Controles
- Los estados se nombran en texto (`pass`, `no_go`, `pending_human_approval`); la información no se transmite solo por color.
- `reports.render` marca `color_only_encoding=False` y `accessible=True`.
- Las traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después) usan campos de texto legibles por máquina y por humano.
- Operación por teclado no aplica (no hay UI), pero la salida es consumible por lectores de pantalla al ser JSON + texto plano.

## Salidas accesibles
- `METRICS_JSON: {...}` en `demo.py`.
- Contratos serializables a JSON con `to_jsonable()`.
