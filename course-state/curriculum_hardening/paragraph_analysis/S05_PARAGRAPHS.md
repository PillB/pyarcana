# S5 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:54:36.301+00:00
Section: Funciones, contratos y descomposición
File: `s05-oop.ts`
STORM cycles: **5**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [Defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions) — def
- PEP 257: [Docstrings](https://peps.python.org/pep-0257/) — docs
- Python: [typing](https://docs.python.org/3/library/typing.html) — hints
- Python: [Scopes LEGB](https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces) — LEGB
- PEP 8: [Function names](https://peps.python.org/pep-0008/#function-and-variable-names) — names
- Py4E: [Functions](https://www.py4e.com/html3/04-functions) — pedagogy
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — functions
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — abstraction
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — MOOC
- Kaggle: [Learn Python](https://www.kaggle.com/learn/python) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [lambda](https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions) — lambda
- Python: [assert](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement) — tests

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “OOP” a funciones y contratos (mapa de la sección)
**P1** (rank 9.55/10)
> En V3, **S05 no es el path principal de clases, herencia ni dunders de sklearn**. Eso vive en **S11** (OOP y modelo de dominio). Aquí el estudiante domina **funciones con contra…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/controlflow.html#defining-functions; PEP 257: https://peps.python.org/pep-0257/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “OOP” a funciones y contratos (mapa de la sec» in S05_STORM.json.

**P2** (rank 9.55/10)
> El hilo conductor es un conjunto de **funciones puras** `normalize_nombre`, `normalize_email`, `normalize_telefono`, `normalize_direccion` que transforman texto sintético **sin*…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 257: https://peps.python.org/pep-0257/; Python: https://docs.python.org/3/library/typing.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “OOP” a funciones y contratos (mapa de la sec» in S05_STORM.json.

**P3** (rank 9.55/10)
> Orden pedagógico: **T1 Funciones** (def/return → params/defaults) → **T2 Contratos** (pre/post/docstrings → hints y errores de dominio) → **T3 Diseño** (funciones pequeñas → pur…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/typing.html; Python: https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “OOP” a funciones y contratos (mapa de la sec» in S05_STORM.json.

### Definición, llamada y retorno
**P1** (rank 9.55/10)
> Una función se define con **`def nombre(params):`** y devuelve con **`return`**. Sin `return` explícito, Python devuelve **`None`** (bug silencioso en pipelines). Llamar es `nom…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces; PEP 8: https://peps.python.org/pep-0008/#function-and-variable-names
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Definición, llamada y retorno» in S05_STORM.json.

**P2** (rank 9.55/10)
> Las funciones son **valores de primera clase**: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalizac…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 8: https://peps.python.org/pep-0008/#function-and-variable-names; Py4E: https://www.py4e.com/html3/04-functions
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Definición, llamada y retorno» in S05_STORM.json.

**P3** (rank 9.55/10)
> Un solo `return` temprano por caso de error de dominio es legible; evita funciones de 100 líneas con muchos returns confusos — **descompón** (T3). Los normalizadores **retornan*…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/04-functions; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Definición, llamada y retorno» in S05_STORM.json.

### Posicionales, keyword y defaults seguros
**P1** (rank 9.55/10)
> Argumentos **posicionales** se atan por orden; **keyword** por nombre (`fn(x=1)`). Los **defaults** se evalúan **una vez** en la definición: **nunca uses lista/dict mutable como…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Posicionales, keyword y defaults seguros» in S05_STORM.json.

**P2** (rank 9.55/10)
> Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los keyword tras posicionales mejoran la lectura en sites de llamada largos y evitan inv…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Posicionales, keyword y defaults seguros» in S05_STORM.json.

**P3** (rank 9.55/10)
> Para normalizadores: `def normalize_telefono(raw, *, country=\"PE\")` con **keyword-only** documenta la política regional sin confundir posiciones. El `*` fuerza `country=` en l…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Posicionales, keyword y defaults seguros» in S05_STORM.json.

### Pre/postcondiciones y docstrings
**P1** (rank 9.55/10)
> Una **precondición** es lo que debe cumplirse **antes** de llamar (p. ej. `raw` es str). Una **postcondición** es lo que garantiza el return (p. ej. sin espacios extremos, minús…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pre/postcondiciones y docstrings» in S05_STORM.json.

**P2** (rank 9.55/10)
> El **docstring** (PEP 257) documenta contrato en español o inglés consistente del proyecto: qué hace, parámetros, retorno, errores. **No** copies la firma; explica la **política…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pre/postcondiciones y docstrings» in S05_STORM.json.

**P3** (rank 9.55/10)
> En intake sintético: pre = tipo str o None; post = forma canónica o `ValueError`/resultado de error de dominio según el diseño elegido. Si docstring y código discrepan, el revis…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions; Python: https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pre/postcondiciones y docstrings» in S05_STORM.json.

### Type hints graduales y errores de dominio
**P1** (rank 9.55/10)
> Los **type hints** (`def f(x: str) -> str`) **no** convierten en runtime (salvo checkers externos). Son documentación verificable. En S05 usamos hints **graduales**: anota lo pú…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement; Python: https://docs.python.org/3/tutorial/controlflow.html#defining-functions
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Type hints graduales y errores de dominio» in S05_STORM.json.

**P2** (rank 9.55/10)
> Un **error de dominio** no es un bug de Python: es un valor de negocio inválido. Opciones: `raise ValueError`, devolver `(ok, value, error)`, o un dict de resultado. **Sé consis…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/controlflow.html#defining-functions; PEP 257: https://peps.python.org/pep-0257/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Type hints graduales y errores de dominio» in S05_STORM.json.

**P3** (rank 9.55/10)
> `Optional[str]` / `str | None` documenta ausencia. **No** uses hints falsos (`-> str` si puedes devolver `None`). Los hints mienten si el código no los cumple.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 257: https://peps.python.org/pep-0257/; Python: https://docs.python.org/3/library/typing.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Type hints graduales y errores de dominio» in S05_STORM.json.

### Funciones pequeñas y composición
**P1** (rank 9.55/10)
> Una función debe hacer **una cosa** en el nivel de abstracción correcto. Si normalizas nombre y además escribes archivo y logueas, **sepáralas**. **Componer** es llamar funcione…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/typing.html; Python: https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Funciones pequeñas y composición» in S05_STORM.json.

**P2** (rank 9.55/10)
> Beneficio: tests unitarios fáciles, reuso en CLI (S10) y en ETL (S08). El orquestador `normalize_record` llama a cuatro normalizadores y arma el dict **sin** I/O en el núcleo.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces; PEP 8: https://peps.python.org/pep-0008/#function-and-variable-names
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Funciones pequeñas y composición» in S05_STORM.json.

**P3** (rank 9.55/10)
> Regla práctica: si necesitas un comentario de sección en medio de la función, **probablemente es otra función**. Extrae y nombra el verbo.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 8: https://peps.python.org/pep-0008/#function-and-variable-names; Py4E: https://www.py4e.com/html3/04-functions
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Funciones pequeñas y composición» in S05_STORM.json.

### Pureza, efectos e inyección de I/O
**P1** (rank 9.55/10)
> Una función **pura** devuelve el mismo resultado para los mismos argumentos y **no tiene efectos** (no imprime, no lee disco, no muta globales ni los argumentos mutables del cal…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/04-functions; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pureza, efectos e inyección de I/O» in S05_STORM.json.

**P2** (rank 9.55/10)
> La **I/O** (stdin, archivos, red) se queda en el **borde**: `main`, CLI, o funciones `load_*` / `save_*`. Los normalizadores deben ser **idempotentes**: `f(f(x)) == f(x)` para e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pureza, efectos e inyección de I/O» in S05_STORM.json.

**P3** (rank 9.55/10)
> **Inyección**: pasar una función `reader` o un path como argumento en vez de hardcodear `open(
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pureza, efectos e inyección de I/O» in S05_STORM.json.

**P4** (rank 9.55/10)
> )` dentro del core facilita tests con fakes. El core no conoce el filesystem.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pureza, efectos e inyección de I/O» in S05_STORM.json.

**P5** (rank 9.55/10)
> **`lambda`**: función anónima de **una expresión**. Úsala para inyectar un normalizador rápido en tests; si la lógica crece, prefiere un `def` con nombre. No admite múltiples st…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pureza, efectos e inyección de I/O» in S05_STORM.json.

### LEGB y closures básicos
**P1** (rank 9.55/10)
> **LEGB**: orden de búsqueda de nombres — **L**ocal, **E**nclosing (funciones anidadas), **G**lobal, **B**uiltin. Si Python no halla el nombre, `NameError`. Saber LEGB evita “¿po…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «LEGB y closures básicos» in S05_STORM.json.

**P2** (rank 9.55/10)
> Un **closure** es una función interna que recuerda variables del enclosing scope. Útil para fabricar normalizadores configurados (`make_phone_normalizer(prefix)`), **sin** clase…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions; Python: https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «LEGB y closures básicos» in S05_STORM.json.

**P3** (rank 9.55/10)
> `global` y `nonlocal` existen pero en S05 **casi no** los necesitas: prefiere **return** de valores nuevos. Mutar globales complica tests y rompe pureza.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement; Python: https://docs.python.org/3/tutorial/controlflow.html#defining-functions
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «LEGB y closures básicos» in S05_STORM.json.

### Pruebas de ejemplo y refactor sin cambiar conducta
**P1** (rank 9.55/10)
> Antes de refactorizar, fija **ejemplos ejecutables**: `assert normalize_email(
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/controlflow.html#defining-functions; PEP 257: https://peps.python.org/pep-0257/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pruebas de ejemplo y refactor sin cambiar conduc» in S05_STORM.json.

**P2** (rank 9.55/10)
> `. Luego cambia la forma interna; si los asserts siguen verdes, la **conducta se preservó**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 257: https://peps.python.org/pep-0257/; Python: https://docs.python.org/3/library/typing.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pruebas de ejemplo y refactor sin cambiar conduc» in S05_STORM.json.

**P3** (rank 9.55/10)
> El refactor típico de S05: extraer `strip_collapse`, unificar defaults, renombrar. **No** cambies la política de negocio “de paso” sin actualizar tests y docstring — eso es un c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/typing.html; Python: https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pruebas de ejemplo y refactor sin cambiar conduc» in S05_STORM.json.

**P4** (rank 9.55/10)
> Idempotencia se prueba con doble llamada. Fronteras: vacío, solo espacios, Unicode (`Ñ`, tildes), y `None` solo si el contrato lo admite. Cada frontera es un caso de prueba perm…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces; PEP 8: https://peps.python.org/pep-0008/#function-and-variable-names
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Pruebas de ejemplo y refactor sin cambiar conduc» in S05_STORM.json.

