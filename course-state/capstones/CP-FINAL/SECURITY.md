# Seguridad — CP-FINAL

La plataforma no expone secretos, no se ejecuta como root, no realiza efectos externos sin aprobación humana.

## Controles obligatorios
- Sin secretos embebidos (auth es mock; tokens sintéticos).
- Entradas validadas (cada subsistema valida su entrada).
- Salidas sanitizadas (sin PII; solo IDs sintéticos).
- Datos sintéticos únicamente (dominio `@example.test`).
- Sin red ni dependencias de pago.
- Sin ejecución como root (registrado en `ApiResponse.body.is_root=False`).

## Superficies de la integración
- `platform.integrate(scenario)` — única entrada pública.
- `backup_restore.backup/restore` — opera solo sobre archivos JSON locales.
- `no_go.evaluate` — decide si la integración es GO/no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias).

## Lo que este proyecto NO hace
- No abre sockets ni hace HTTP real.
- No persiste a una base de datos externa.
- No envía correos reales (RPA y Copilot marcan `pending_human_approval`).
