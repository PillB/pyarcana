# S28 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:31:14.861+00:00
Section: Pruebas de datos, propiedades e integración
File: `s28-llm-agents.ts`
STORM cycles: **28**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Hypothesis: [Docs](https://hypothesis.readthedocs.io/) — property testing
- Hypothesis: [Data](https://hypothesis.readthedocs.io/en/latest/data.html) — strategies
- Python: [sqlite3](https://docs.python.org/3/library/sqlite3.html) — integration
- Python: [unittest.mock](https://docs.python.org/3/library/unittest.mock.html) — doubles
- pytest: [Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html) — isolation
- Great Expectations: [Docs](https://docs.greatexpectations.io/) — data contracts
- testcontainers: [Docs](https://testcontainers.com/) — CI deps
- Coursera: [Data quality testing](https://www.coursera.org/courses?query=data%20quality%20testing) — MOOC
- deeplearning.ai: [Data engineering](https://www.deeplearning.ai/specializations/data-engineering) — pipelines
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — tests
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### QA de datos del motor ER
**P1** (rank 9.55/10)
> Aquí construyes la **suite de QA** del ER: propiedades, schema, goldens, dobles e integración determinista. Los tests de datos convierten supuestos de schema y matching en regre…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Hypothesis: https://hypothesis.readthedocs.io/; Hypothesis: https://hypothesis.readthedocs.io/en/latest/data.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «QA de datos del motor ER» in S28_STORM.json.

**P2** (rank 9.55/10)
> Fixtures sintéticas mínimas deben cazar encoding, cardinalidad, orden, timeout y reanudación — antes de confiar en scores de matching. Contrato operativo: entrada fixture `CASO-…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Hypothesis: https://hypothesis.readthedocs.io/en/latest/data.html; Python: https://docs.python.org/3/library/sqlite3.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «QA de datos del motor ER» in S28_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Propiedades** → **T2 Datos** (schema/golden) → **T3 Dobles** → **T4 Sistema/CI**. ER **solo** decide misma entidad — nunca parentesco ni fraude. Caso PE: batch de co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/sqlite3.html; Python: https://docs.python.org/3/library/unittest.mock.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «QA de datos del motor ER» in S28_STORM.json.

### invariantes y generación de casos
**P1** (rank 9.55/10)
> Una **invariante** es una propiedad que **siempre** debe cumplirse en el dominio ER: `normalize` es **idempotente**; scores en **[0,1]**; ids no vacíos; pares canónicos `entity_…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/unittest.mock.html; pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «invariantes y generación de casos» in S28_STORM.json.

**P2** (rank 9.55/10)
> Genera casos **desde la invariante** (tabla exhaustiva pequeña, random acotado con **seed**, o Hypothesis conceptual) en lugar de un único ejemplo feliz. Un solo case “Ana López…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html; Great Expectations: https://docs.greatexpectations.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «invariantes y generación de casos» in S28_STORM.json.

**P3** (rank 9.55/10)
> Documenta la invariante en **español** junto al test (`# invariante: normalize es idempotente`): es el contrato legible del dominio ER y el oráculo del revisor humano. Sin enunc…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Great Expectations: https://docs.greatexpectations.io/; testcontainers: https://testcontainers.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «invariantes y generación de casos» in S28_STORM.json.

### idempotencia, simetría y metamorphic tests
**P1** (rank 9.55/10)
> **Idempotencia**: aplicar dos veces = una. **Simetría**: `sim(a,b)==sim(b,a)` en comparadores simétricos. Los tests de datos convierten supuestos de schema y matching en regresi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** testcontainers: https://testcontainers.com/; Coursera: https://www.coursera.org/courses?query=data%20quality%20testing
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «idempotencia, simetría y metamorphic tests» in S28_STORM.json.

**P2** (rank 9.55/10)
> **Metamorphic tests**: transforma el input de forma que la relación de salida sea predecible (p.ej. añadir espacios no cambia normalize). Contrato operativo: entrada fixture `CA…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=data%20quality%20testing; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «idempotencia, simetría y metamorphic tests» in S28_STORM.json.

**P3** (rank 9.55/10)
> Útiles cuando no hay oráculo absoluto pero sí relación entre salidas. Caso sintético PE: batch de contactos `@example.pe` en CI local; un fallo de golden muestra expected vs act…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «idempotencia, simetría y metamorphic tests» in S28_STORM.json.

### schema y quality contracts
**P1** (rank 9.55/10)
> Un **schema contract** fija tipos, nullability y dominios (email con @, score 0..1). Un **quality contract** fija reglas de negocio (unique id, cardinalidad de pares). Los tests…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «schema y quality contracts» in S28_STORM.json.

**P2** (rank 9.55/10)
> Valida en ingest del ER: registros fuente rechazados no entran silenciosos. Contrato operativo: entrada fixture `CASO-LIM-028` (run_id=cpn3a-dataqa) → asserts de schema/propieda…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «schema y quality contracts» in S28_STORM.json.

**P3** (rank 9.55/10)
> Implementación didáctica: funciones validadoras que devuelven lista de errores. Caso sintético PE: batch de contactos `@example.pe` en CI local; un fallo de golden muestra expec…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «schema y quality contracts» in S28_STORM.json.

### golden datasets, drift y reconciliación
**P1** (rank 9.55/10)
> Un **golden** es un snapshot de salida esperada (JSON/CSV sintético versionado). Sirve de regresión de pipeline. Los tests de datos convierten supuestos de schema y matching en …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Hypothesis: https://hypothesis.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «golden datasets, drift y reconciliación» in S28_STORM.json.

**P2** (rank 9.55/10)
> **Drift**: la salida actual difiere del golden. Clasifica: bug real vs cambio intencional. Contrato operativo: entrada fixture `CASO-LIM-028` (run_id=cpn3a-dataqa) → asserts de …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Hypothesis: https://hypothesis.readthedocs.io/; Hypothesis: https://hypothesis.readthedocs.io/en/latest/data.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «golden datasets, drift y reconciliación» in S28_STORM.json.

**P3** (rank 9.55/10)
> **Reconciliación**: actualizar golden solo con review y nota de cambio — nunca en silencio en CI. Caso sintético PE: batch de contactos `@example.pe` en CI local; un fallo de go…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Hypothesis: https://hypothesis.readthedocs.io/en/latest/data.html; Python: https://docs.python.org/3/library/sqlite3.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «golden datasets, drift y reconciliación» in S28_STORM.json.

### mocks/fakes de HTTP, DB y reloj
**P1** (rank 9.55/10)
> **Mock**: verifica interacciones. **Fake**: implementación liviana en memoria. **Stub**: respuestas fijas. Los tests de datos convierten supuestos de schema y matching en regres…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/sqlite3.html; Python: https://docs.python.org/3/library/unittest.mock.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «mocks/fakes de HTTP, DB y reloj» in S28_STORM.json.

**P2** (rank 9.55/10)
> HTTP: fake de status/JSON. DB: dict o sqlite memoria. Reloj: inyecta `now` callable — no `datetime.now` global sin control. Contrato operativo: entrada fixture `CASO-LIM-028` (r…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/unittest.mock.html; pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «mocks/fakes de HTTP, DB y reloj» in S28_STORM.json.

**P3** (rank 9.55/10)
> Objetivo: tests rápidos y deterministas del ER sin red real. Caso sintético PE: batch de contactos `@example.pe` en CI local; un fallo de golden muestra expected vs actual sin P…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html; Great Expectations: https://docs.greatexpectations.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «mocks/fakes de HTTP, DB y reloj» in S28_STORM.json.

### contract tests sin sobre-mocking
**P1** (rank 9.55/10)
> El **sobre-mocking** acopla el test a detalles internos (orden de calls, nombres privados) y se rompe en refactors inocuos. Prefiere bordes observables: filas escritas, status, …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Great Expectations: https://docs.greatexpectations.io/; testcontainers: https://testcontainers.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «contract tests sin sobre-mocking» in S28_STORM.json.

**P2** (rank 9.55/10)
> Prefiere **contratos de borde**: dado input, output y efectos observables (filas escritas, status). Contrato operativo: entrada fixture `CASO-LIM-028` (run_id=cpn3a-dataqa) → as…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** testcontainers: https://testcontainers.com/; Coursera: https://www.coursera.org/courses?query=data%20quality%20testing
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «contract tests sin sobre-mocking» in S28_STORM.json.

**P3** (rank 9.55/10)
> Mockea solo I/O externo; deja la lógica de matching real bajo prueba. Caso sintético PE: batch de contactos `@example.pe` en CI local; un fallo de golden muestra expected vs act…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=data%20quality%20testing; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «contract tests sin sobre-mocking» in S28_STORM.json.

### integración/E2E y test containers
**P1** (rank 9.55/10)
> Integración ejerce **2+ componentes reales** (app + sqlite). E2E cubre flujo punta a punta (`ingest→pares→review`) con datos sintéticos. Containers son concepto de CI (mismo sch…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «integración/E2E y test containers» in S28_STORM.json.

**P2** (rank 9.55/10)
> **Testcontainers** (concepto): DB efímera en contenedor. En el curso usamos sqlite `:memory:` o archivo temp como análogo local. Contrato operativo: entrada fixture `CASO-LIM-02…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «integración/E2E y test containers» in S28_STORM.json.

**P3** (rank 9.55/10)
> Mide encoding, cardinalidad de pares, orden de paginación, timeout y reanudación (checkpoint). Caso sintético PE: batch de contactos `@example.pe` en CI local; un fallo de golde…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «integración/E2E y test containers» in S28_STORM.json.

### flakes, determinismo y CI
**P1** (rank 9.55/10)
> Un **flake** pasa/falla sin cambio de código: orden, tiempo, red, random. En CI del ER son **inaceptables** en la suite gate — cuarentena documentada o fix, no “retry 3 hasta qu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «flakes, determinismo y CI» in S28_STORM.json.

**P2** (rank 9.55/10)
> Mitigaciones: seed, reloj inyectado, sort estable, retries solo con cuarentena documentada (no ocultar bugs). Contrato operativo: entrada fixture `CASO-LIM-028` (run_id=cpn3a-da…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Hypothesis: https://hypothesis.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «flakes, determinismo y CI» in S28_STORM.json.

**P3** (rank 9.55/10)
> Pipeline CI: lint → unit → property/data → integration. Falla el job si hay drift de golden no aprobado. Caso sintético PE: batch de contactos `@example.pe` en CI local; un fall…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Hypothesis: https://hypothesis.readthedocs.io/; Hypothesis: https://hypothesis.readthedocs.io/en/latest/data.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «flakes, determinismo y CI» in S28_STORM.json.

