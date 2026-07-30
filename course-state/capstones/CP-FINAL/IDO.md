# I Do (Yo demuestro) — CP-FINAL

El instructor modela el proceso paso a paso en voz alta.

1. Mostrar `platform.integrate(scenario) -> IntegrationBundle`: 12 subsistemas corren en orden topológico sobre el escenario compartido.
2. Mostrar la traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después) end-to-end y el evidence bundle (contratos + grafo + tarjetas).
3. Mostrar el rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla) demostrado (`integration/rollback.py::demonstrate_rollback`) y la condición de no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias) (`integration/no_go.py::evaluate`).
