# S11 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:07:19.183+00:00
Section: OOP y modelo de dominio
File: `s11-testing.ts`
STORM cycles: **11**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [dataclasses](https://docs.python.org/3/library/dataclasses.html) — frozen field post_init
- Python: [typing.Protocol](https://docs.python.org/3/library/typing.html#typing.Protocol) — ports
- Python: [unittest](https://docs.python.org/3/library/unittest.html) — pure domain tests
- Python: [decimal](https://docs.python.org/3/library/decimal.html) — money amounts
- Python: [data model eq](https://docs.python.org/3/reference/datamodel.html#object.__eq__) — eq hash
- PEP: [PEP 544 Protocols](https://peps.python.org/pep-0544/) — structural typing
- pytest: [pytest docs](https://docs.pytest.org/) — quality support not V3 core
- Real Python: [Python Classes](https://realpython.com/python-classes/) — OOP basics
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — objects
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [typing module](https://docs.python.org/3/library/typing.html) — annotations
- Cosmic Python: [Architecture patterns book site](https://www.cosmicpython.com/) — repo service

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + strip theater fillers |
| weDo | CASO DEFECT |
| git | NO restore (WT DEFECT>HEAD) |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Testing pytest/CI” a OOP y modelo de dominio (mapa)
**P1** (rank 9.55/10)
> En V3, **S11 no es el path principal de pytest fixtures/coverage/CI** (ese material se reubica como soporte de calidad). Aquí modelas el **dominio de familiarid…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/dataclasses.html; Python: https://docs.python.org/3/library/typing.html#typing.Protocol
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Testing pytest/CI” a OOP y modelo de dominio» in S11_STORM.json.

**P2** (rank 9.55/10)
> Ninguna clase emite veredicto de **fraude** ni **parentesco**. Los scores son **datos**, no decisiones legales. Entorno **local-python**. Id de plataforma `test…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/typing.html#typing.Protocol; Python: https://docs.python.org/3/library/unittest.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Testing pytest/CI” a OOP y modelo de dominio» in S11_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Objetos** → **T2 Encapsulación** → **T3 Diseño** → **T4 Límites** (repos/tests). Caso sintético PE: ids `C00x`/`E0x`, emails `@ejemplo.pe`, montos `…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/unittest.html; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Testing pytest/CI” a OOP y modelo de dominio» in S11_STORM.json.

### Clases, instancias y dataclass
**P1** (rank 9.55/10)
> Una **clase** define el molde; una **instancia** es un objeto concreto. `@dataclass` genera `__init__`, `__repr__` y opcionalmente comparación — reduce boilerpl…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; Python: https://docs.python.org/3/reference/datamodel.html#object.__eq__
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Clases, instancias y dataclass» in S11_STORM.json.

### Invariantes y estados válidos
**P1** (rank 9.55/10)
> `__post_init__` en dataclasses valida justo después de construir. Si el estado es inválido, **falla al crear** — un `ClientRecord` a medias en un set de resoluc…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/reference/datamodel.html#object.__eq__; PEP: https://peps.python.org/pep-0544/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Invariantes y estados válidos» in S11_STORM.json.

**P2** (rank 9.55/10)
> Método `validate()` reutilizable ayuda en factories `from_dict` y rehidratación desde JSON. **Sin side-effects de negocio** al validar: no llames APIs, no escri…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** PEP: https://peps.python.org/pep-0544/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Invariantes y estados válidos» in S11_STORM.json.

**P3** (rank 9.55/10)
> Ejemplo: `document_id` no vacío; en `Transaction`, `amount` es `Decimal` **positivo** y `currency` ∈ allowlist `{'PEN','USD'}`. Nunca conviertas PEN→USD en el c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pytest: https://docs.pytest.org/; Real Python: https://realpython.com/python-classes/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Invariantes y estados válidos» in S11_STORM.json.

### Propiedades y métodos
**P1** (rank 9.55/10)
> `@property` expone campos calculados (`display_name`, `masked_email`) **sin** mutación peligrosa desde afuera. La UI y los logs deben preferir la máscara; el em…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Real Python: https://realpython.com/python-classes/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Propiedades y métodos» in S11_STORM.json.

**P2** (rank 9.55/10)
> Métodos de instancia encapsulan consultas puras (`age_days_since(as_of)`). Evita side-effects en properties: no envían mail, no escriben disco, no llaman red. F…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Propiedades y métodos» in S11_STORM.json.

**P3** (rank 9.55/10)
> Setters validados solo cuando la mutación es parte del modelo de negocio; si no, prefiere **`frozen`** o devolver una **nueva instancia**. Caso sintético: `c.di…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/typing.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Propiedades y métodos» in S11_STORM.json.

### Igualdad, hash y mutabilidad consciente
**P1** (rank 9.55/10)
> La identidad de `ResolvedEntity` usa su **`entity_id` estable**, no `document_id`: un documento es PII, puede corregirse/reemitirse y no debe fusionar entidades…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/typing.html; Cosmic Python: https://www.cosmicpython.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Igualdad, hash y mutabilidad consciente» in S11_STORM.json.

**P2** (rank 9.55/10)
> Entidades mutables como keys de dict son una fuente clásica de bugs: el hash cambia si mutas campos del `__eq__`. Usa `field(compare=False)` para etiquetas visi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Cosmic Python: https://www.cosmicpython.com/; Python: https://docs.python.org/3/library/dataclasses.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Igualdad, hash y mutabilidad consciente» in S11_STORM.json.

**P3** (rank 9.55/10)
> Value objects (`RelationshipEvidence`) suelen ser frozen; agregados (`CaseFile` con listas) pueden ser mutables con cuidado y métodos `add`. Caso sintético: set…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/dataclasses.html; Python: https://docs.python.org/3/library/typing.html#typing.Protocol
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Igualdad, hash y mutabilidad consciente» in S11_STORM.json.

### Composición antes que herencia
**P1** (rank 9.55/10)
> **has-a** (composición) modela mejor el caso: `CaseFile` tiene una `ResolvedEntity` y una lista de `RelationshipEvidence`. No fuerces `Client(Person(BaseEntity)…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/typing.html#typing.Protocol; Python: https://docs.python.org/3/library/unittest.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Composición antes que herencia» in S11_STORM.json.

### Protocolos y polimorfismo con propósito
**P1** (rank 9.55/10)
> `typing.Protocol` describe un **puerto** (`EntityStore` con `get`/`save`) sin forzar herencia. Duck typing estructural: cualquier objeto con esos métodos cumple…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/unittest.html; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Protocolos y polimorfismo con propósito» in S11_STORM.json.

**P2** (rank 9.55/10)
> Útil para **fakes en tests** y para no acoplar dominio a SQLite/HTTP. Evita ABC pesados si Protocol basta. Fail-closed en el adaptador real si la DB no responde…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; Python: https://docs.python.org/3/reference/datamodel.html#object.__eq__
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Protocolos y polimorfismo con propósito» in S11_STORM.json.

**P3** (rank 9.55/10)
> No introduzcas Protocol “por si acaso” con una sola implementación y sin tests — YAGNI. Caso sintético: `FakeStore` en memoria para T4 tests; el adapter SQL lle…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/reference/datamodel.html#object.__eq__; PEP: https://peps.python.org/pep-0544/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Protocolos y polimorfismo con propósito» in S11_STORM.json.

### Repositorios, servicios y serialización
**P1** (rank 9.55/10)
> **Repository** light: `get`/`save`. **Service** light: orquesta reglas de dominio sin conocer CLI ni HTTP. `to_dict`/`from_dict` viven en el **borde** de serial…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** PEP: https://peps.python.org/pep-0544/; pytest: https://docs.pytest.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Repositorios, servicios y serialización» in S11_STORM.json.

**P2** (rank 9.55/10)
> Serializa sin password fields ni PII innecesaria en logs. DTOs de borde no tienen que ser idénticos a las entidades internas (p. ej. omite `emails` crudos en un…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pytest: https://docs.pytest.org/; Real Python: https://realpython.com/python-classes/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Repositorios, servicios y serialización» in S11_STORM.json.

**P3** (rank 9.55/10)
> CLI (S10) llama al service; el service **no** imprime ni parsea argparse. Caso sintético: `ClientService(InMemoryClientRepository()).register("C001", "a@ejemplo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Real Python: https://realpython.com/python-classes/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Repositorios, servicios y serialización» in S11_STORM.json.

### Dependencias y pruebas del dominio
**P1** (rank 9.55/10)
> Tests del dominio son **puros**: sin red, sin DB real, sin reloj de red. Fakes del `Protocol` bastan. Eso permite CI rápida y demos offline del gate CP-N1-C.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dependencias y pruebas del dominio» in S11_STORM.json.

