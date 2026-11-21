# Requisitos de seguridad

El programa no recibe datos por la red, no abre conexiones y nunca ejecuta como código lo que
llega en un registro: cada valor solo se compara. Los registros son sintéticos.

## Controles obligatorios
- No hay claves ni contraseñas en el código.
- Cada campo se valida antes de usarse (reglas 1 a 3 de `BRIEF.md`).
- `raw_line` se copia a la salida tal como llegó y no se interpreta.
- Solo datos sintéticos o reutilizables legalmente.
