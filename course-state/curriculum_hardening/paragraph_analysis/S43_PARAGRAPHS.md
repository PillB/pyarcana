# S43 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:02:12.753752+00:00
Section: Contenedores y reproducibilidad operativa
File: `s43-llmops.ts`
STORM cycles: **43**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Docker: [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) — layers
- Docker: [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/) — size
- Docker: [Compose file](https://docs.docker.com/compose/compose-file/) — services
- Docker: [Best practices](https://docs.docker.com/build/building/best-practices/) — cache non-root
- OCI: [Image Spec](https://github.com/opencontainers/image-spec) — portable images
- OWASP: [Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html) — container security
- NIST: [SP 800-190](https://csrc.nist.gov/publications/detail/sp/800-190/final) — container threats
- 12factor: [12-Factor App](https://12factor.net/) — config processes
- GitHub: [Trivy](https://github.com/aquasecurity/trivy) — image scanning
- GitHub: [Syft SBOM](https://github.com/anchore/syft) — SBOM
- MIT: [MIT 6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python) — pedagogy
- Coursera: [Docker courses](https://www.coursera.org/courses?query=docker) — containers MOOC
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive disclosure
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — learner surface
- Docs: [signal handling](https://docs.python.org/3/library/signal.html) — graceful shutdown
- Live: [PyArcana](https://pillb.github.io/pyarcana/)

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | map glossary + computed demos |
| weDo | CASO DEFECT 24/24 |
| git | NO restore |
| STORM | hand_STORM_domain_sources |
| expert pass | deepened theory + expanded resources |

## Theory (paragraph-level)

### Ruta de S43: Contenedores y reproducibilidad operativa
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Layer cache:** ordenar deps antes de app para no invalidar en cada commit. **Non-root:** proceso con UID sin privilegios. **Secret injection:** secretos en runtime, nunca horneados en la imagen. **Health/readiness:** el proc…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S43: Contenedores y reproducibilidad ope» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Esta sección empaqueta el servicio seguro de S42 en **contenedores reproducibles** sin cluster real: contratos al estilo Dockerfile/Compose (referencia Docker; progressive disclosure con dicts y checks stdlib). El caso `CASO-TRU-043` (plataforma ficticia en Trujillo) es sintét…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S43: Contenedores y reproducibilidad ope» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Producto incremental: Governed Python Service Platform. Entrada: código fijado, lock de deps, config no secreta y secretos inyectados en runtime. Salida: layers cacheables, non-root, health/readiness, compose API/worker/DB/cache y runbook de recovery. Error de promoción: root …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** 12factor: https://12factor.net/; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S43: Contenedores y reproducibilidad ope» in S43_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Orden: T1 Dockerfile/non-root → T2 config/secrets/signals → T3 compose y migraciones → T4 locks, multi-stage, scan y límites. Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto ops por ejercicio. Id legacy `llmops` no implica LLMOps de modelos; V3 es rep…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://github.com/aquasecurity/trivy; GitHub: https://github.com/aquasecurity/trivy
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S43: Contenedores y reproducibilidad ope» in S43_STORM.json; edge `research_supports_paragraph`.


### Dockerfile, layers y cache
**P1** (rank 9.55/10)
> Ordena layers de **estable a cambiante**: base y dependencias primero, código de aplicación después. Así el cache de build acelera commits de app sin re-resolver pip en cada push. Un cache «mágico» que depende de estado oculto del host rompe la reproducibilidad entre máquinas.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docker: https://docs.docker.com/compose/compose-file/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Dockerfile, layers y cache» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato de cache. Entrada: secuencia de layers `base→deps→app→cmd` y lock de dependencias. Salida: `cache_hint=deps_before_app` y digest lógico estable entre dos builds con el mismo lock. Error: copiar el source antes del lock (invalida cache en cada commit) o hornear secreto…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docker: https://docs.docker.com/build/building/best-practices/; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Dockerfile, layers y cache» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-TRU-043-T1A`: `layer_order` valida deps antes de app. Sin secretos en el Dockerfile; el secret se inyecta en runtime (T2-A). Evidencia: dos builds con el mismo lock producen el mismo digest lógico de deps.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OCI: https://github.com/opencontainers/image-spec; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Dockerfile, layers y cache» in S43_STORM.json; edge `research_supports_paragraph`.


### bases, usuarios no root y tamaño
**P1** (rank 9.55/10)
> Una base mínima reduce superficie, pero debe seguir parchable; fija versión/digest y ejecuta con UID sin privilegios, filesystem y capabilities mínimos.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «bases, usuarios no root y tamaño» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: proceso non-root verificado. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxi…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** 12factor: https://12factor.net/; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «bases, usuarios no root y tamaño» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `bases, usuarios no root y tamaño` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es proceso non-root verificado. No contiene PII ni secretos; una señal incierta se deriva …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://github.com/aquasecurity/trivy; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «bases, usuarios no root y tamaño» in S43_STORM.json; edge `research_supports_paragraph`.


### config, secrets y volumes
**P1** (rank 9.55/10)
> Config no secreta puede declararse; secretos se inyectan, rotan y no se hornean. Volumes distinguen estado durable de datos descartables.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «config, secrets y volumes» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: imagen e inspección sin secreto. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «config, secrets y volumes» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `config, secrets y volumes` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es imagen e inspección sin secreto. No contiene PII ni secretos; una señal incierta se deriva y n…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** 12factor: https://12factor.net/; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «config, secrets y volumes» in S43_STORM.json; edge `research_supports_paragraph`.


### networking, health checks y signals
**P1** (rank 9.55/10)
> Redes limitan quién habla con quién; readiness expresa capacidad de servir, liveness bloqueo, y SIGTERM drena trabajo antes de salir.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docker: https://docs.docker.com/build/building/best-practices/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «networking, health checks y signals» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: health checks y shutdown ensayados. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OCI: https://github.com/opencontainers/image-spec; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «networking, health checks y signals» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `networking, health checks y signals` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es health checks y shutdown ensayados. No contiene PII ni secretos; una señal incierta …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «networking, health checks y signals» in S43_STORM.json; edge `research_supports_paragraph`.


### API/worker/DB/cache
**P1** (rank 9.55/10)
> Compose hace explícitos API, worker, DB y cache con redes y health dependencies; `depends_on` no reemplaza retries de aplicación.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docker: https://docs.docker.com/build/building/multi-stage/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «API/worker/DB/cache» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: stack sano desde entorno limpio. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docker: https://docs.docker.com/compose/compose-file/; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «API/worker/DB/cache» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `API/worker/DB/cache` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es stack sano desde entorno limpio. No contiene PII ni secretos; una señal incierta se deriva y nunca p…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docker: https://docs.docker.com/build/building/best-practices/; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «API/worker/DB/cache» in S43_STORM.json; edge `research_supports_paragraph`.


### dependencias, migrations y datos efímeros
**P1** (rank 9.55/10)
> Migraciones son jobs controlados con compatibilidad expand/contract; datos efímeros se recrean y los durables tienen backup/restore.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docker: https://docs.docker.com/build/building/best-practices/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «dependencias, migrations y datos efímeros» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: migración y rollback de prueba. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OCI: https://github.com/opencontainers/image-spec; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «dependencias, migrations y datos efímeros» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `dependencias, migrations y datos efímeros` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es migración y rollback de prueba. No contiene PII ni secretos; una señal inciert…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «dependencias, migrations y datos efímeros» in S43_STORM.json; edge `research_supports_paragraph`.


### locks y multi-stage builds
**P1** (rank 9.55/10)
> Locks fijan resolución completa y multi-stage separa toolchain de runtime; el artefacto final contiene solo lo necesario.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docker: https://docs.docker.com/build/building/best-practices/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «locks y multi-stage builds» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: lock verificado e imagen runtime reducida. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. C…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OCI: https://github.com/opencontainers/image-spec; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «locks y multi-stage builds» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `locks y multi-stage builds` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es lock verificado e imagen runtime reducida. No contiene PII ni secretos; una señal incierta se…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «locks y multi-stage builds» in S43_STORM.json; edge `research_supports_paragraph`.


### scanning, resource limits y debugging
**P1** (rank 9.55/10)
> Scanning alimenta una política, límites evitan noisy neighbors y debugging usa logs/metrics controlados, nunca un shell root permanente.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «scanning, resource limits y debugging» in S43_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: vulnerabilidad crítica y OOM simulados bloquean. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea rele…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** 12factor: https://12factor.net/; NIST: https://csrc.nist.gov/publications/detail/sp/800-190/final
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «scanning, resource limits y debugging» in S43_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `scanning, resource limits y debugging` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es vulnerabilidad crítica y OOM simulados bloquean. No contiene PII ni secretos; una …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://github.com/aquasecurity/trivy; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «scanning, resource limits y debugging» in S43_STORM.json; edge `research_supports_paragraph`.


## Expert judgment
- Residual score 0; expert rank **9.55** (≥9.5).
- Git: keep worktree.
- V3 retarget guards preserved.
