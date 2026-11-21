# Requisitos de seguridad

El programa no usa credenciales, no abre conexiones de red y solo escribe dentro de `out_dir`.
Cada archivo de entrada queda identificado por su `sha256` en el manifest.

## Controles obligatorios
- No hay claves ni contraseñas en el código.
- Cada fila se valida antes de llegar a `clean` (reglas 3 a 5 de `BRIEF.md`).
- Las salidas se escriben con `write_atomic`: un lector nunca ve un archivo a medias.
- Solo datos sintéticos o reutilizables legalmente.
