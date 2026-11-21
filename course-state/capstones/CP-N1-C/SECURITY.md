# Requisitos de seguridad

El programa no usa credenciales, no abre conexiones de red y no escribe archivos: `review`
devuelve un paquete en memoria.

## Controles obligatorios
- No hay claves ni contraseñas en el código.
- Cada entrada se valida: un score que no es número o no es finito da `invalid_input`, y un `id`
  repetido detiene el caso con `ValueError`.
- La cola muestra seudónimos, no nombres.
- Solo datos sintéticos.
