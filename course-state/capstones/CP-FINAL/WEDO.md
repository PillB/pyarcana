# We Do (Hacemos juntos) — CP-FINAL

Instructor y persona que aprende trabajan en conjunto, con andamiaje.

1. Construir juntos un nuevo contrato tipado en `integration/contracts.py` y su test en `integration/contract_tests.py`.
2. Agregar un subsistema nuevo (acotado, sintético) y registrarlo en `integration/dependency_graph.py` y `integration/platform.py::SUBSYSTEM_RUNNERS`.
3. Ejercitar el no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias): forzar un fallo crítico y observar que la plataforma retorna `no_go=True`.
