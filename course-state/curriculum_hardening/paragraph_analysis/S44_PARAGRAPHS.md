# S44 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:05:49.123133+00:00
Section: CI/CD y seguridad de la cadena de suministro
File: `s44-multimodal.ts`
STORM cycles: **44**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- GitHub: [Actions security hardening](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) — least privilege
- GitHub: [Environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) — approvals
- GitHub: [Branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) — review policy
- SLSA: [SLSA specification](https://slsa.dev/spec/) — provenance levels
- Sigstore: [Sigstore docs](https://docs.sigstore.dev/) — signing attestations
- CycloneDX: [CycloneDX SBOM](https://cyclonedx.org/docs/) — SBOM
- SPDX: [SPDX](https://spdx.dev/) — SBOM standard
- in-toto: [in-toto](https://in-toto.io/) — supply chain integrity
- NIST: [SSDF](https://csrc.nist.gov/Projects/ssdf) — secure software development
- Docs: [pip secure installs](https://pip.pypa.io/en/stable/topics/secure-installs/) — pinning
- MIT: [MIT 6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python) — pedagogy
- Coursera: [DevOps CI/CD](https://www.coursera.org/courses?query=devops%20cicd) — CI/CD MOOCs
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive disclosure
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — learner surface
- SRE: [Release engineering](https://sre.google/sre-book/release-engineering/) — release
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

### Ruta de S44: CI/CD y seguridad de la cadena de suministro
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **CI matrix:** combinaciones soportadas de runtime/OS. **Least privilege:** permisos mínimos del workflow. **Pinning:** deps y actions por digest/versión fija. **SBOM:** inventario de componentes del artefacto. **Provenance/at…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Sigstore: https://docs.sigstore.dev/; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S44: CI/CD y seguridad de la cadena de s» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Esta sección lleva el servicio de S43 a una **cadena de suministro verificable**: CI con lint/types/tests, permisos mínimos, SBOM/provenance y promoción con rollback. Solo contratos al estilo GitHub Actions/SLSA (referencia profesional; progressive disclosure con dicts stdlib)…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** CycloneDX: https://cyclonedx.org/docs/; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S44: CI/CD y seguridad de la cadena de s» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Producto incremental: pipeline con supply-chain gates. Entrada: commit revisado, deps fijadas, workflow least-privilege. Salida: artefacto por digest, SBOM, provenance y evidencia de promote/rollback. Error de promoción: test crítico rojo, secreto en logs, dep vulnerable sin p…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SPDX: https://spdx.dev/; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S44: CI/CD y seguridad de la cadena de s» in S44_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Orden: T1 matrices de check → T2 permisos/secretos y SBOM → T3 environments/canary/rollback → T4 branch protection y fallos auditables. Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de pipeline por ejercicio. Id legacy `multimodal` no implica multim…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** in-toto: https://in-toto.io/; NIST: https://csrc.nist.gov/Projects/ssdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S44: CI/CD y seguridad de la cadena de s» in S44_STORM.json; edge `research_supports_paragraph`.


### lint/types/tests y matrices
**P1** (rank 9.55/10)
> CI ejecuta **checks rápidos antes de costosos** (lint → types → tests), usa matrices solo para combinaciones de runtime/OS **soportadas** (no combinatoria infinita) y conserva logs/artifacts suficientes para reproducir un fallo en otra máquina. Un test verde sin evidencia no e…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SPDX: https://spdx.dev/; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «lint/types/tests y matrices» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: lint/types/tests y matriz soportada en verde. Error: test crítico rojo, secreto en logs, dependencia insegura o attestación ausente impide publicar. Crit…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** in-toto: https://in-toto.io/; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «lint/types/tests y matrices» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `lint/types/tests y matrices` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es matriz `['3.11','3.12']` + steps `lint/typecheck/test` en verde. No contiene PII ni secretos; una señal i…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://csrc.nist.gov/Projects/ssdf; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «lint/types/tests y matrices» in S44_STORM.json; edge `research_supports_paragraph`.


### caches, artifacts y condiciones
**P1** (rank 9.55/10)
> Caches son optimización no fuente de verdad; artifacts llevan digest/retención y condiciones de workflow no omiten gates en forks o tags.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SLSA: https://slsa.dev/spec/; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «caches, artifacts y condiciones» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: cache miss conserva resultado y artifact es verificable. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criter…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Sigstore: https://docs.sigstore.dev/; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «caches, artifacts y condiciones» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `caches, artifacts y condiciones` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es cache miss conserva resultado y artifact es verificable. No contiene PII ni secretos; una señal incie…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** CycloneDX: https://cyclonedx.org/docs/; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «caches, artifacts y condiciones» in S44_STORM.json; edge `research_supports_paragraph`.


### permisos mínimos, pinning y secret scanning
**P1** (rank 9.55/10)
> Tokens de CI empiezan read-only, acciones se fijan por commit y secret scanning bloquea exposición; una dependencia nueva requiere revisión.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** in-toto: https://in-toto.io/; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «permisos mínimos, pinning y secret scanning» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: permisos mínimos y acciones pinned. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipel…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://csrc.nist.gov/Projects/ssdf; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «permisos mínimos, pinning y secret scanning» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `permisos mínimos, pinning y secret scanning` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es permisos mínimos y acciones pinned. No contiene PII ni secretos; una señal incierta se de…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docs: https://pip.pypa.io/en/stable/topics/secure-installs/; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «permisos mínimos, pinning y secret scanning» in S44_STORM.json; edge `research_supports_paragraph`.


### SBOM, provenance y attestations
**P1** (rank 9.55/10)
> SBOM enumera componentes; provenance enlaza fuente/build/artefacto y una attestation firmada permite verificar, no garantiza calidad por sí sola.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «SBOM, provenance y attestations» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato de integridad. Entrada: digest del artefacto y digest referenciado por el SBOM/provenance. Salida: `provenance_ok` solo si coinciden. Error: publicar sin attestation o con SBOM de otro build. Criterio: en el lab Piura sintético el gate `REJECT_ATTESTATION` bloquea rel…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «SBOM, provenance y attestations» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-PIU-044-T2B`: `sbom_summary` cuenta 3 pkgs; `provenance_ok(d,d)` es True. SLSA-style evidence, no magia de seguridad.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SLSA: https://slsa.dev/spec/; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «SBOM, provenance y attestations» in S44_STORM.json; edge `research_supports_paragraph`.


### environments y approvals
**P1** (rank 9.55/10)
> Environments separan credenciales y políticas; producción exige aprobación independiente y evidencia del mismo artefacto probado.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** in-toto: https://in-toto.io/; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «environments y approvals» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: promoción sin rebuild y con aprobación. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el p…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://csrc.nist.gov/Projects/ssdf; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «environments y approvals» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `environments y approvals` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es promoción sin rebuild y con aprobación. No contiene PII ni secretos; una señal incierta se deriva y nunca pr…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Docs: https://pip.pypa.io/en/stable/topics/secure-installs/; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «environments y approvals» in S44_STORM.json; edge `research_supports_paragraph`.


### migrations, canary/blue-green y rollback
**P1** (rank 9.55/10)
> Migraciones preceden tráfico solo si son compatibles; canary mide señal y rollback restaura código/config/datos con criterio temporal.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** CycloneDX: https://cyclonedx.org/docs/; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «migrations, canary/blue-green y rollback» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: canary fallido revierte dentro del RTO. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el p…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SPDX: https://spdx.dev/; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «migrations, canary/blue-green y rollback» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `migrations, canary/blue-green y rollback` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es canary fallido revierte dentro del RTO. No contiene PII ni secretos; una señal incierta se d…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** in-toto: https://in-toto.io/; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «migrations, canary/blue-green y rollback» in S44_STORM.json; edge `research_supports_paragraph`.


### branch/review policy y release notes
**P1** (rank 9.55/10)
> Branch protection exige checks/review y release notes explican cambio, riesgo, migración y reversión para operadores.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SLSA: https://slsa.dev/spec/; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «branch/review policy y release notes» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: release trazable a review y changelog. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pi…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Sigstore: https://docs.sigstore.dev/; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «branch/review policy y release notes» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `branch/review policy y release notes` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es release trazable a review y changelog. No contiene PII ni secretos; una señal incierta se deriva…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** CycloneDX: https://cyclonedx.org/docs/; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «branch/review policy y release notes» in S44_STORM.json; edge `research_supports_paragraph`.


### failure handling y evidencia auditable
**P1** (rank 9.55/10)
> Un fallo conserva logs redactados, clasificación, dueño y decisión; el pipeline no convierte `continue-on-error` en aprobación silenciosa.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment; CycloneDX: https://cyclonedx.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «failure handling y evidencia auditable» in S44_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: fallo crítico bloquea y deja evidencia auditable. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de é…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches; SPDX: https://spdx.dev/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «failure handling y evidencia auditable» in S44_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `failure handling y evidencia auditable` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es fallo crítico bloquea y deja evidencia auditable. No contiene PII ni secretos; una señal incie…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SLSA: https://slsa.dev/spec/; in-toto: https://in-toto.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «failure handling y evidencia auditable» in S44_STORM.json; edge `research_supports_paragraph`.


## Expert judgment
- Residual score 0; expert rank **9.55** (≥9.5).
- Git: keep worktree.
- V3 retarget guards preserved.
