# S27 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:31:14.861+00:00
Section: Estrategia de pruebas con pytest
File: `s27-async-concurrency.ts`
STORM cycles: **27**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- pytest: [Docs](https://docs.pytest.org/en/stable/) — discovery fixtures
- pytest: [Getting started](https://docs.pytest.org/en/stable/getting-started.html) — first tests
- pytest: [Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html) — scopes
- pytest: [Parametrize](https://docs.pytest.org/en/stable/how-to/parametrize.html) — tables
- pytest: [Assertions](https://docs.pytest.org/en/stable/how-to/assert.html) — assert rewrite
- Coverage.py: [Docs](https://coverage.readthedocs.io/) — branch coverage
- Python: [unittest.mock](https://docs.python.org/3/library/unittest.mock.html) — doubles
- Real Python: [Effective Python Testing](https://realpython.com/python-testing/) — pyramid AAA
- Coursera: [Software testing Python](https://www.coursera.org/courses?query=software%20testing%20python) — MOOC
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — asserts
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

### Estrategia pytest e inicio CP-N3-A
**P1** (rank 9.55/10)
> Aquí **inicias CP-N3-A**: convertir supuestos de normalización y matching en **contratos de prueba** con pytest. La pirámide y el diseño AAA hacen que normalización/matching sea…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/; pytest: https://docs.pytest.org/en/stable/getting-started.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estrategia pytest e inicio CP-N3-A» in S27_STORM.json.

**P2** (rank 9.55/10)
> El hilo: un módulo sintético `normalize_name` / `exact_match` sobre contactos fakes (`run_id=cpn3a-01`, `@example.pe`). Cada bug reproducido → test de regresión. Contrato operat…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/getting-started.html; pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estrategia pytest e inicio CP-N3-A» in S27_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Diseño** (pirámide/riesgo/AAA) → **T2 Pytest** (discovery/fixtures) → **T3 Bordes** (excepciones/negativos) → **T4 Cobertura** (rama + mutación conceptual). Privacid…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html; pytest: https://docs.pytest.org/en/stable/how-to/parametrize.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estrategia pytest e inicio CP-N3-A» in S27_STORM.json.

### riesgos y pirámide de pruebas
**P1** (rank 9.55/10)
> La **pirámide** prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E. El **riesgo** reordena: un bug en matching de entidades justifica más tests que un t…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/how-to/parametrize.html; pytest: https://docs.pytest.org/en/stable/how-to/assert.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «riesgos y pirámide de pruebas» in S27_STORM.json.

**P2** (rank 9.55/10)
> Clasifica riesgo por impacto (datos incorrectos, regresión silenciosa) y probabilidad. En ER, normalización y comparadores son capa de alto riesgo. Contrato operativo: entrada c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/how-to/assert.html; Coverage.py: https://coverage.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «riesgos y pirámide de pruebas» in S27_STORM.json.

**P3** (rank 9.55/10)
> No inviertas la pirámide: E2E lentas no sustituyen contratos unitarios de `strip`/`casefold`. Caso sintético PE: módulo `normalize_name`/`exact_match` sobre contactos Lima `@exa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coverage.py: https://coverage.readthedocs.io/; Python: https://docs.python.org/3/library/unittest.mock.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «riesgos y pirámide de pruebas» in S27_STORM.json.

### Arrange–Act–Assert y oráculos confiables
**P1** (rank 9.55/10)
> **AAA** separa preparación (Arrange), ejecución (Act) y verificación (Assert). Evita asserts mezclados con setup. La pirámide y el diseño AAA hacen que normalización/matching se…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/unittest.mock.html; Real Python: https://realpython.com/python-testing/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Arrange–Act–Assert y oráculos confiables» in S27_STORM.json.

**P2** (rank 9.55/10)
> Un **oráculo** es la fuente de verdad del assert: valor fijo conocido, propiedad invariante o resultado de un algoritmo de referencia simple. Contrato operativo: entrada casos p…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/python-testing/; Coursera: https://www.coursera.org/courses?query=software%20testing%20python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Arrange–Act–Assert y oráculos confiables» in S27_STORM.json.

**P3** (rank 9.55/10)
> Oráculos frágiles (timestamps de reloj real, orden de dicts en JSON sin sort) generan flakes. Prefiere fixtures sintéticas deterministas. Caso sintético PE: módulo `normalize_na…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=software%20testing%20python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Arrange–Act–Assert y oráculos confiables» in S27_STORM.json.

### discovery y assertions
**P1** (rank 9.55/10)
> pytest **descubre** funciones `test_*` y clases `Test*` en archivos `test_*.py` / `*_test.py`. Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten re-c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «discovery y assertions» in S27_STORM.json.

**P2** (rank 9.55/10)
> Las **assertions** reescritas muestran diff útil: `assert a == b` explica ambos lados. Usa `pytest.raises` para excepciones esperadas. Contrato operativo: entrada casos pytest d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «discovery y assertions» in S27_STORM.json.

**P3** (rank 9.55/10)
> Parametriza con `@pytest.mark.parametrize` para tablas de casos sin copiar el cuerpo del test. Caso sintético PE: módulo `normalize_name`/`exact_match` sobre contactos Lima `@ex…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «discovery y assertions» in S27_STORM.json.

### fixtures, scopes y aislamiento
**P1** (rank 9.55/10)
> Las **fixtures** inyectan dependencias (datos sintéticos, `tmp_path`) **sin globals**. **Scopes**: function (default), class, module, session — un fixture de session sucio conta…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; pytest: https://docs.pytest.org/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fixtures, scopes y aislamiento» in S27_STORM.json.

**P2** (rank 9.55/10)
> El aislamiento evita que un test contamine al siguiente: cada function-scope recrea el estado. Session-scope sirve para recursos caros de solo lectura. Contrato operativo: entra…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/; pytest: https://docs.pytest.org/en/stable/getting-started.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fixtures, scopes y aislamiento» in S27_STORM.json.

**P3** (rank 9.55/10)
> Factory fixtures devuelven callables para crear N entidades sintéticas por caso. Caso sintético PE: módulo `normalize_name`/`exact_match` sobre contactos Lima `@example.pe`; cob…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/getting-started.html; pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fixtures, scopes y aislamiento» in S27_STORM.json.

### excepciones, floats, fechas y archivos temporales
**P1** (rank 9.55/10)
> Prueba **excepciones** con el tipo y, si aplica, el **mensaje** (`match=`). Para **floats**/scores usa tolerancia (`math.isclose`) o decimal cuantizado — `==` exacto en 0.1+0.2 …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html; pytest: https://docs.pytest.org/en/stable/how-to/parametrize.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «excepciones, floats, fechas y archivos temporale» in S27_STORM.json.

**P2** (rank 9.55/10)
> **Fechas**: fija el reloj o usa valores UTC sintéticos; no compares `now()` con literales frágiles. Contrato operativo: entrada casos pytest del fixture `CASO-LIM-027` (run_id=c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/how-to/parametrize.html; pytest: https://docs.pytest.org/en/stable/how-to/assert.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «excepciones, floats, fechas y archivos temporale» in S27_STORM.json.

**P3** (rank 9.55/10)
> **tmp_path** / `tempfile` evita escribir en el repo. Limpia o usa context managers. Caso sintético PE: módulo `normalize_name`/`exact_match` sobre contactos Lima `@example.pe`; …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/how-to/assert.html; Coverage.py: https://coverage.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «excepciones, floats, fechas y archivos temporale» in S27_STORM.json.

**P4** (rank 9.55/10)
> Dos APIs frecuentes: (1) **`tempfile.TemporaryDirectory()`** crea un directorio temporal y lo borra al salir del `with`; ideal para varios archivos (`Path(td) / "f.txt"`). (2) *…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coverage.py: https://coverage.readthedocs.io/; Python: https://docs.python.org/3/library/unittest.mock.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «excepciones, floats, fechas y archivos temporale» in S27_STORM.json.

### casos negativos y mensajes
**P1** (rank 9.55/10)
> Los **casos negativos** prueban inputs inválidos: `None`, vacío, tipo incorrecto, encoding roto. Deben fallar de forma **controlada** (excepción tipada), no con `AttributeError`…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/unittest.mock.html; Real Python: https://realpython.com/python-testing/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «casos negativos y mensajes» in S27_STORM.json.

**P2** (rank 9.55/10)
> Mensajes de error **útiles** nombran el campo y el valor ofensivo (sin PII real). Facilita debug en CI. Contrato operativo: entrada casos pytest del fixture `CASO-LIM-027` (run_…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/python-testing/; Coursera: https://www.coursera.org/courses?query=software%20testing%20python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «casos negativos y mensajes» in S27_STORM.json.

**P3** (rank 9.55/10)
> Tabla: input → excepción esperada → fragmento de mensaje. Cubre al menos un caso happy path y tres negativos por función pública. Caso sintético PE: módulo `normalize_name`/`exa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=software%20testing%20python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «casos negativos y mensajes» in S27_STORM.json.

### branch y risk coverage
**P1** (rank 9.55/10)
> **Branch coverage** mide si cada rama (if/else) se ejecutó. 100% de líneas ≠ 100% de riesgo cubierto. La pirámide y el diseño AAA hacen que normalización/matching sean *contrato…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «branch y risk coverage» in S27_STORM.json.

**P2** (rank 9.55/10)
> **Risk coverage**: prioriza ramas de negocio (match/no-match, missing fields) sobre logs y pretty-print. Contrato operativo: entrada casos pytest del fixture `CASO-LIM-027` (run…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «branch y risk coverage» in S27_STORM.json.

**P3** (rank 9.55/10)
> Reporta cobertura como **evidencia**, no como meta vacía del 100%. Una rama de umbral (match/review/no-match) sin test es deuda del gate CP-N3-A. Caso PE: `normalize_name`/`exac…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «branch y risk coverage» in S27_STORM.json.

### mutación conceptual, fallas útiles y mantenimiento
**P1** (rank 9.55/10)
> **Mutación conceptual**: cambia deliberadamente el código (quita un `strip`, invierte un umbral) y verifica que **algún test falle**. Si la suite sigue verde, el test es teatro.…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; pytest: https://docs.pytest.org/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «mutación conceptual, fallas útiles y mantenimien» in S27_STORM.json.

**P2** (rank 9.55/10)
> Fallas **útiles** muestran input sintético, esperado vs actual y el contrato violado. Evita `assert False`. Contrato operativo: entrada casos pytest del fixture `CASO-LIM-027` (…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/; pytest: https://docs.pytest.org/en/stable/getting-started.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «mutación conceptual, fallas útiles y mantenimien» in S27_STORM.json.

**P3** (rank 9.55/10)
> Mantenimiento: borra tests que solo copian implementación; renombra; parametriza tablas; no duplices oráculos en tres sitios. Caso sintético PE: módulo `normalize_name`/`exact_m…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pytest: https://docs.pytest.org/en/stable/getting-started.html; pytest: https://docs.pytest.org/en/stable/how-to/fixtures.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «mutación conceptual, fallas útiles y mantenimien» in S27_STORM.json.

