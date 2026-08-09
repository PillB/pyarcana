# Flujo RPA y Analista IA con Aprobación Humana

**Versión:** 2.0.0 · **Nivel:** 2 · **Gate:** S26

## Usuario y problema
- **Usuario:** Analista que automatiza un informe recurrente con control humano.
- **Problema:** Construir un flujo Excel → validación → análisis → reporte → revisión humana → aprobación → borrador de correo, SIN envío externo automático, con idempotente (esto es, que repetir la misma operación no cambie el resultado), reintentos solo para errores transitorios seguros, auditoría, rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla), modo de prueba, validación de documentos, destinatarios seguros, logs redactados, expiración de aprobación y separación entre borrador y envío.

## Prerrequisitos
CP-N2-B. S22 (rapidfuzz/entity), S23 (computer vision), S24 (RPA advanced), S25 (streamlit), S26 (integrator).

## Secciones que contribuyen
S22, S23, S24, S25, S26

## Datos
Excel sintético de ventas mensuales + destinatarios seguros (example.test).

Campos: excel: month,region,revenue, recipients: name,email (safe)

## Criterios de aceptación
- flujo completo → borrador en cola
- aprobación expira → no se envía
- envío sin aprobación → bloqueado
- rerun del mismo job → mismo resultado
- rollback restaura estado previo
- logs no contienen correos

## Fallos críticos (P0)
- Envío externo sin aprobación
- Sin idempotencia
- Sin rollback
- Logs con PII

## Limitaciones
No envía correos reales. El 'envío' queda en cola. Modo de prueba por defecto.

## Remediación
Si un envío ocurre sin aprobación, revisa la separación draft/send. Si los logs tienen PII, aplica redacción.

## Interfaz de integración final
`rpa.run(job) -> RpaAudit` — Recibe job (dict con excel path + spec). Devuelve RpaAudit con: draft (queued, not sent), approvals, audit_trail, rollback_available, logs_redacted.
