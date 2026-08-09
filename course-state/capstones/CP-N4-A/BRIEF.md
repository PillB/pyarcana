# Plataforma de Servicio Python Gobernada

**Versión:** 2.0.0 · **Nivel:** 4 · **Gate:** S43

## Usuario y problema
- **Usuario:** Ingeniero de plataforma que despliega un servicio acotado.
- **Problema:** Convertir lógica previa en un servicio estilo producción con API versionada, validación de esquema, auth y authz, rate limits, configuración segura, dependencias fijas, imagen de contenedor, ejecución no-root, health y readiness checks, límites de recursos, logging estructurado y redactado, migraciones, backup, recovery, security scanning, y tests de contrato e integración.

## Prerrequisitos
CP-N3-C. S40 (architecture/DDD), S41 (LLM finetuning), S42 (graph RAG (esto es, Generación Aumentada por Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada afirmación)), S43 (LLMOps).

## Secciones que contribuyen
S40, S41, S42, S43

## Datos
Requests sintéticos al servicio (no PII).

Campos: request_id, payload (dict), auth_token (synthetic)

## Criterios de aceptación
- request válido → response 200
- rate limit excedido → 429
- sin auth → 401
- health endpoint → ok
- servicio no corre como root
- logs redactan tokens
- migraciones presentes

## Fallos críticos (P0)
- Ejecución como root
- Sin health checks
- Secretos embebidos
- Sin migraciones

## Limitaciones
Demo local acotado. El 'contenedor' se especifica via Dockerfile (no se construye en el demo).

## Remediación
Si el servicio corre como root, fija non-root (esto es, ejecutar el proceso con un usuario sin privilegios). Si no hay health checks, agrégalos.

## Interfaz de integración final
`service.serve(request) -> ApiResponse` — Recibe request. Devuelve ApiResponse con: status, body, request_id, redacted_logs. Validado, rate-limited, non-root.
