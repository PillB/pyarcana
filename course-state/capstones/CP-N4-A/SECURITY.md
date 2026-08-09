# Requisitos de seguridad

Auth + authz. Rate limits. non-root (esto es, ejecutar el proceso con un usuario sin privilegios). Secretos en env, no en código. Logs redactados.

## Controles obligatorios
- No secretos embebidos.
- Entradas validadas.
- Salidas sanitizadas.
- Datos sintéticos o legalmente reutilizables.
