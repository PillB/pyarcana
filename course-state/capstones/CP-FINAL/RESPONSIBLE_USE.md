# Uso responsable — CP-FINAL

La plataforma integra doce capstones con controles heredados de cada uno.

## Lo que este proyecto NO hace
- No decide adversamente sobre personas sin revisión humana.
- No infiere automáticamente fraude, parentesco, colusión, asociación criminal, propiedad beneficiaria ni relación causal.
- No sobreinterpreta asociaciones como causalidad.
- No envía efectos externos (correo, publicación, eliminación) sin aprobación humana explícita.

## Controles heredados
- CP-N1-A: maneja entrada malformada; denominadores correctos.
- CP-N1-B: idempotente (esto es, que repetir la misma operación no cambie el resultado); cuarentena (esto es, separar las filas que no cumplen el contrato para revisarlas); proveniencia (esto es, de dónde viene cada dato: qué archivo, qué fuente, qué fecha).
- CP-N1-C: revisión humana obligatoria; sin inferencia automática de fraude.
- CP-N2-A: solo estadística descriptiva; sin interpretación causal.
- CP-N2-B: sin codificación solo por color; sin denominadores ocultos.
- CP-N2-C: sin envío externo sin aprobación; rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla) disponible.
- CP-N3-A: no infiere relaciones automáticamente.
- CP-N3-B: no etiqueta fraude automáticamente.
- CP-N3-C: abstención (esto es, que el modelo diga 'no sé' en vez de adivinar cuando no está seguro) soportada; sin fuga de datos; revisión humana.
- CP-N4-A: sin root; sin secretos embebidos; health checks.
- CP-N4-B: rollback demostrado; aprobación; SLO (esto es, un objetivo de nivel de servicio: la promesa medible de qué tan disponible o rápido debe estar el sistema).
- CP-N4-C: bucles acotados; RAG (esto es, Generación Aumentada por Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada afirmación) citado; HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible) en efectos sensibles; traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después) redactadas.

## no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias)
Si un subsistema crítico falla (falta, tipo incorrecto, versión incorrecta o bandera crítica violada), la plataforma retorna `no_go=True` en lugar de éxito parcial.
