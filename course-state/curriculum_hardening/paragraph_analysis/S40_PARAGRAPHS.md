# S40 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T03:58:57.914308+00:00
Section: Arquitectura, DDD y decisiones técnicas
File: `s40-agentic-architecture.ts`
STORM cycles: **40**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- C4: [C4 model](https://c4model.com/) — architecture views
- Fowler: [Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) — DDD boundaries
- Cockburn: [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) — ports adapters
- DDD: [DDD Reference](https://www.domainlanguage.com/ddd/reference/) — Evans patterns
- ADR: [ADR process AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html) — decision records
- GitHub: [ADR templates](https://github.com/joelparkerhenderson/architecture-decision-record) — ADR examples
- GitHub: [System Design Primer](https://github.com/donnemartin/system-design-primer) — trade-offs
- Microsoft: [Azure Architecture](https://learn.microsoft.com/azure/architecture/) — quality attributes
- Stanford: [CS146S](https://web.stanford.edu/class/cs146s/) — software design
- MIT: [MIT 6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python) — pedagogy
- Coursera: [Software architecture](https://www.coursera.org/courses?query=software%20architecture) — architecture MOOCs
- 12factor: [12-Factor App](https://12factor.net/) — ops boundaries
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive disclosure
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — learner surface
- Fowler: [CQRS](https://martinfowler.com/bliki/CQRS.html) — evolution patterns
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

### Ruta de S40: Arquitectura, DDD y decisiones técnicas
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Quality attribute (QA):** escenario medible (fuente, estímulo, respuesta, umbral, dueño). **Trade-off:** elección entre alternativas con scores y riesgo residual aceptado. **Bounded context:** frontera de lenguaje ubicuo. **…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Cockburn: https://alistair.cockburn.us/hexagonal-architecture/; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S40: Arquitectura, DDD y decisiones técn» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Esta sección abre el Nivel 4 (experto→máster) a partir del cierre CP-N3-C en S39. Solo reutiliza contratos, pruebas y controles ya enseñados: no hay APIs cloud ni credenciales. El caso `CASO-LIM-040` (Red Andina, Lima sintético) modela un mapa de arquitectura para intake → ER …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** DDD: https://www.domainlanguage.com/ddd/reference/; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S40: Arquitectura, DDD y decisiones técn» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Producto incremental: dossier de arquitectura gobernada. Entrada: FR, escenarios de quality attributes, vocabulario ubicuo y restricciones (latencia, dueños, secretos fuera del repo). Salida: capas/ports, bounded contexts, C4 (context/container) y ADRs versionados con medida, …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** ADR: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S40: Arquitectura, DDD y decisiones técn» in S40_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Orden pedagógico (liberación gradual): T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs. Teoría con criterio medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de dominio por ejercicio. Id legacy `agenti…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://github.com/joelparkerhenderson/architecture-decision-record; Stanford: https://web.stanford.edu/class/cs146s/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S40: Arquitectura, DDD y decisiones técn» in S40_STORM.json; edge `research_supports_paragraph`.


### requisitos funcionales y quality attributes
**P1** (rank 9.55/10)
> Un requisito funcional describe una capacidad del negocio (p. ej. «el triage acepta un lote sintético y devuelve scores de prioridad»); un atributo de calidad se expresa como **escenario medible** — fuente, estímulo, entorno, respuesta y medida — para evitar palabras vacías co…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** DDD: https://www.domainlanguage.com/ddd/reference/; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «requisitos funcionales y quality attributes» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones (latencia, dueños, secretos fuera del repo). Salida de este subtema: escenario QA completo con umbral y dueño contactable. Error: una frontera ambigua, una dependencia hacia …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** ADR: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «requisitos funcionales y quality attributes» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `requisitos funcionales y quality attributes` al caso sintético `CASO-LIM-040` (Red Andina, Lima): la evidencia es un escenario QA completo con umbral (p. ej. `latency_p95_ms ≤ 300`) y dueño `platform`. No contiene PII ni secretos; una señal incierta se deriva y …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://github.com/joelparkerhenderson/architecture-decision-record; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «requisitos funcionales y quality attributes» in S40_STORM.json; edge `research_supports_paragraph`.


### trade-offs, riesgos y criterios medibles
**P1** (rank 9.55/10)
> Un trade-off compara alternativas contra criterios ponderados y registra riesgo, probabilidad, impacto y mitigación; la arquitectura no tiene una opción universalmente mejor.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Microsoft: https://learn.microsoft.com/azure/architecture/; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «trade-offs, riesgos y criterios medibles» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato de decisión. Entrada: alternativas con score (p. ej. sync vs async) y matriz de riesgos residuales. Salida: opción elegida, scores visibles y dueño que acepta el residual. Error: elegir por moda o sin umbral medible. Criterio: la tabla de decisión se versiona junto al…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Stanford: https://web.stanford.edu/class/cs146s/; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «trade-offs, riesgos y criterios medibles» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-040-T1B` (Red Andina, sintético): score min_score elige async (2.2) sobre sync (3.8); el residual de complejidad de mensajes lo acepta el owner de plataforma, no el revisor de cola.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «trade-offs, riesgos y criterios medibles» in S40_STORM.json; edge `research_supports_paragraph`.


### cohesión/coupling y capas
**P1** (rank 9.55/10)
> Alta cohesión mantiene juntas reglas que cambian por la misma razón; bajo acoplamiento evita que presentación e infraestructura dicten el dominio.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://github.com/donnemartin/system-design-primer; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «cohesión/coupling y capas» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: diagrama de dependencias sin salto de capa. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el g…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Microsoft: https://learn.microsoft.com/azure/architecture/; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «cohesión/coupling y capas» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `cohesión/coupling y capas` a `CASO-LIM-040`: la evidencia es un diagrama donde presentación no salta al repositorio y dominio no importa infraestructura.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Stanford: https://web.stanford.edu/class/cs146s/; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «cohesión/coupling y capas» in S40_STORM.json; edge `research_supports_paragraph`.


### ports/adapters y dependencia hacia dominio
**P1** (rank 9.55/10)
> Un port define lo que necesita el dominio y un adapter traduce HTTP, SQL o colas; las flechas de código apuntan hacia políticas estables.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Cockburn: https://alistair.cockburn.us/hexagonal-architecture/; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «ports/adapters y dependencia hacia dominio» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: test del dominio con adapter en memoria. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** DDD: https://www.domainlanguage.com/ddd/reference/; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «ports/adapters y dependencia hacia dominio» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `ports/adapters` a `CASO-LIM-040`: un adapter en memoria prueba el dominio sin HTTP, SQL ni red; el contrato puede sustituirse sin cambiar la regla.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** ADR: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «ports/adapters y dependencia hacia dominio» in S40_STORM.json; edge `research_supports_paragraph`.


### bounded contexts y lenguaje ubicuo
**P1** (rank 9.55/10)
> Un bounded context da significado local a términos; el context map declara traducciones para que «caso» de intake no se confunda con un record de ER.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Microsoft: https://learn.microsoft.com/azure/architecture/; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «bounded contexts y lenguaje ubicuo» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: glosario ubicuo y context map revisado. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate.…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Stanford: https://web.stanford.edu/class/cs146s/; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «bounded contexts y lenguaje ubicuo» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `bounded contexts y lenguaje ubicuo` a `CASO-LIM-040`: el context map traduce términos entre intake, ER, relación, triage y reporting sin fusionar significados.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «bounded contexts y lenguaje ubicuo» in S40_STORM.json; edge `research_supports_paragraph`.


### entities, value objects y servicios
**P1** (rank 9.55/10)
> Una entity conserva identidad, un value object se compara por valor y un servicio de dominio contiene una regla que no pertenece naturalmente a una entidad.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** ADR: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «entities, value objects y servicios» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: invariantes de entity/VO probadas. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Crit…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://github.com/joelparkerhenderson/architecture-decision-record; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «entities, value objects y servicios» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `entities, value objects y servicios` a `CASO-LIM-040`: fixtures sintéticas prueban identidad, igualdad por valor e invariantes; ER no implica fraude ni parentesco.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** GitHub: https://github.com/donnemartin/system-design-primer; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «entities, value objects y servicios» in S40_STORM.json; edge `research_supports_paragraph`.


### diagramas C4/flujo y ADRs
**P1** (rank 9.55/10)
> C4 explica personas, sistemas y contenedores; un ADR conserva contexto, decisión, alternativas, estado y consecuencias, no solo un dibujo final.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Cockburn: https://alistair.cockburn.us/hexagonal-architecture/; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «diagramas C4/flujo y ADRs» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: C4 enlazado a ADR aceptado y reversible. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** DDD: https://www.domainlanguage.com/ddd/reference/; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «diagramas C4/flujo y ADRs» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `diagramas C4/flujo y ADRs` a `CASO-LIM-040`: C4 localiza el flujo y el ADR conserva alternativa rechazada, consecuencia y señal de reversión.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** ADR: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «diagramas C4/flujo y ADRs» in S40_STORM.json; edge `research_supports_paragraph`.


### APIs, eventos, deuda y evolución compatible
**P1** (rank 9.55/10)
> Los cambios compatibles son aditivos, preservan consumidores y versionan eventos; deuda técnica lleva dueño, fecha y criterio de retiro.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Cockburn: https://alistair.cockburn.us/hexagonal-architecture/; GitHub: https://github.com/joelparkerhenderson/architecture-decision-record
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «APIs, eventos, deuda y evolución compatible» in S40_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: consumer contract de versión previa en verde. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** DDD: https://www.domainlanguage.com/ddd/reference/; GitHub: https://github.com/donnemartin/system-design-primer
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «APIs, eventos, deuda y evolución compatible» in S40_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `APIs, eventos, deuda y evolución compatible` a `CASO-LIM-040`: un consumer contract anterior permanece verde y la deuda tiene dueño y criterio de retiro.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** ADR: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html; Microsoft: https://learn.microsoft.com/azure/architecture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «APIs, eventos, deuda y evolución compatible» in S40_STORM.json; edge `research_supports_paragraph`.


## Expert judgment
- Residual score 0; expert rank **9.55** (≥9.5).
- Git: keep worktree.
- V3 retarget guards preserved (not agent orchestration / not LLM fine-tuning).
