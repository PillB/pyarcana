# S3 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:50:39.071+00:00
Section: Decisiones y reglas de validación
File: `s03-data-structures.ts`
STORM cycles: **3**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [Truth testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing) — falsy
- Python: [Comparisons](https://docs.python.org/3/library/stdtypes.html#comparisons) — in is
- Python: [Control flow](https://docs.python.org/3/tutorial/controlflow.html) — if match
- PEP 636: [Pattern matching](https://peps.python.org/pep-0636/) — match
- Py4E: [Conditionals](https://www.py4e.com/html3/03-conditional) — if
- unittest: [Docs](https://docs.python.org/3/library/unittest.html) — branch tests
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — conditionals
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — control
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — MOOC
- Kaggle: [Learn Python](https://www.kaggle.com/learn/python) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [match statement](https://docs.python.org/3/reference/compound_stmts.html#the-match-statement) — match ref
- Python: [Boolean ops](https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not) — and or

## Gold pass
| Area | Decision |
|------|----------|
| theory | expert refresh / deepen |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Data Structures” a decisiones de validación (mapa de la sección)
**P1** (rank 9.55/10)
> En V3, **S03 no es el path principal de list/dict/CSV/JSON**. Esos temas viven conceptualmente en **S06** (y módulos posteriores). Aquí el estudiante domina lo que el **motor de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#truth-value-testing; Python: https://docs.python.org/3/library/stdtypes.html#comparisons
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Data Structures” a decisiones de validación » in S03_STORM.json.

**P2** (rank 9.55/10)
> El hilo conductor es un **validador de campos** (`validate_field` / `validate_record`) que devuelve `{status, code, message}` **accionables**. Datos ficticios únicamente (`examp…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#comparisons; Python: https://docs.python.org/3/tutorial/controlflow.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Data Structures” a decisiones de validación » in S03_STORM.json.

**P3** (rank 9.55/10)
> Orden pedagógico: **T1 Booleanos** (comparaciones → truthiness) → **T2 Control** (if/elif/else → guards) → **T3 Reglas** (rangos/allowlists → decision tables/match) → **T4 Verif…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/controlflow.html; PEP 636: https://peps.python.org/pep-0636/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Data Structures” a decisiones de validación » in S03_STORM.json.

### Comparaciones y el operador in
**P1** (rank 9.55/10)
> Un **booleano de negocio** nace de una comparación: `==`, `!=`, `<`, `<=`, `>`, `>=`. En intake, comparas edades, montos, códigos y regiones. Python también permite **encadenar*…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 636: https://peps.python.org/pep-0636/; Py4E: https://www.py4e.com/html3/03-conditional
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Comparaciones y el operador in» in S03_STORM.json.

**P2** (rank 9.55/10)
> **Pertenencia**: `x in coleccion` / `x not in coleccion` funciona con str, list, set, dict (busca **claves**). Para allowlists de códigos fijos, un **`set` de literales** es ide…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/03-conditional; unittest: https://docs.python.org/3/library/unittest.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Comparaciones y el operador in» in S03_STORM.json.

**P3** (rank 9.55/10)
> }` es `False` — normaliza antes o documenta el contrato.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** unittest: https://docs.python.org/3/library/unittest.html; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Comparaciones y el operador in» in S03_STORM.json.

**P4** (rank 9.55/10)
> **`is` vs `==`**: usa **`is None` / `is not None`** para ausencia. No uses `is` para comparar números o strings de negocio (`True is 1` es `False` aunque `True == 1` sea `True`)…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Comparaciones y el operador in» in S03_STORM.json.

### Qué es verdadero en un if (y qué no es “ausente”)
**P1** (rank 9.55/10)
> Python evalúa la **truthiness** de un valor en `if`, `while`, `and` y `or`. Son **falsy** (por defecto): `None`, `False`, `0`, `0.0`, `0j`, `
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Qué es verdadero en un if (y qué no es “ausente”» in S03_STORM.json.

**P2** (rank 9.55/10)
> `, `()`, `[]`, `{}`, `set()`, `range(0)`. Casi todo lo demás es **truthy**, incluso `[0]` o `
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Qué es verdadero en un if (y qué no es “ausente”» in S03_STORM.json.

**P3** (rank 9.55/10)
> ` — por eso **no** uses truthiness como “¿existe el campo?”.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Qué es verdadero en un if (y qué no es “ausente”» in S03_STORM.json.

**P4** (rank 9.55/10)
> El error canónico del gate V3: **`if monto:` trata `0` como “no hay monto”**. En negocio, **cero puede ser válido** y **`None` significa ausente**. Separa políticas: presencia c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/reference/compound_stmts.html#the-match-statement
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Qué es verdadero en un if (y qué no es “ausente”» in S03_STORM.json.

**P5** (rank 9.55/10)
> ` o `not s.strip()` según el contrato. **Nunca** conviertas ausencia en reject automático sin documentarlo.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/reference/compound_stmts.html#the-match-statement; Python: https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Qué es verdadero en un if (y qué no es “ausente”» in S03_STORM.json.

**P6** (rank 9.55/10)
> `and` / `or` hacen **short-circuit** y **devuelven un operando** (no siempre `True`/`False`). `
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not; Python: https://docs.python.org/3/library/stdtypes.html#truth-value-testing
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Qué es verdadero en un if (y qué no es “ausente”» in S03_STORM.json.

**P7** (rank 9.55/10)
> `; `0 and 99` → `0`. `not` sí devuelve booleano. Prioridad: `not` se une más fuerte que `and`, y `and` más que `or`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#truth-value-testing; Python: https://docs.python.org/3/library/stdtypes.html#comparisons
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Qué es verdadero en un if (y qué no es “ausente”» in S03_STORM.json.

### Ramas de decisión con if/elif/else
**P1** (rank 9.55/10)
> La forma canónica de una decisión exclusiva es **`if` / `elif` / `else`**. Se evalúan en orden; **la primera condición verdadera gana** y el resto no se ejecuta. El `else` es el…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#comparisons; Python: https://docs.python.org/3/tutorial/controlflow.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ramas de decisión con if/elif/else» in S03_STORM.json.

**P2** (rank 9.55/10)
> **Indentación** define el bloque: 4 espacios es el estilo del curso. Un `if` seguido de otro `if` (sin `elif`) **no es excluyente**: ambos pueden dispararse y **sobrescribir** e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/controlflow.html; PEP 636: https://peps.python.org/pep-0636/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ramas de decisión con if/elif/else» in S03_STORM.json.

**P3** (rank 9.55/10)
> Para el motor de reglas, un patrón limpio es devolver un **solo status** por campo: `accept`, `review` o `reject`. Fronteras (`score >= 80`) deben estar documentadas en la tabla…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 636: https://peps.python.org/pep-0636/; Py4E: https://www.py4e.com/html3/03-conditional
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ramas de decisión con if/elif/else» in S03_STORM.json.

### Salidas tempranas y ramas que nunca se tocan
**P1** (rank 9.55/10)
> Una **guard clause** (salida temprana) valida precondiciones y **retorna de inmediato** con `reject`/`review`, dejando el camino feliz al final sin pirámide de `if` anidados. Me…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/03-conditional; unittest: https://docs.python.org/3/library/unittest.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Salidas tempranas y ramas que nunca se tocan» in S03_STORM.json.

**P2** (rank 9.55/10)
> Orden típico en validadores: **1) ausencia (`is None`)** → **2) tipo** → **3) rango/allowlist** → **4) accept**. Si comparas `edad < 18` antes de chequear `None`, obtienes `Type…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** unittest: https://docs.python.org/3/library/unittest.html; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Salidas tempranas y ramas que nunca se tocan» in S03_STORM.json.

**P3** (rank 9.55/10)
> Una **rama muerta** es código que nunca se ejecuta porque una condición anterior ya la cubre (p. ej. `if x >= 0: ... elif x > 5:` — el `elif` solo vería negativos, nunca `x > 5`…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Salidas tempranas y ramas que nunca se tocan» in S03_STORM.json.

### Reglas de dominio: rangos y listas permitidas
**P1** (rank 9.55/10)
> Una **allowlist** es el conjunto de valores admitidos (`ALLOWED_REGIONES = {
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reglas de dominio: rangos y listas permitidas» in S03_STORM.json.

**P2** (rank 9.55/10)
> , ...}`). Si el valor no está, suele ir a **`review`** (dato desconocido) o **`reject`** (política estricta). Nombra constantes en **`UPPER_CASE`**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reglas de dominio: rangos y listas permitidas» in S03_STORM.json.

**P3** (rank 9.55/10)
> Un **rango** usa comparaciones o encadenamiento: `MIN_EDAD <= edad <= MAX_EDAD`. Combina reglas con **`and`/`or`** de forma explícita; documenta si el fallo de allowlist es dist…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reglas de dominio: rangos y listas permitidas» in S03_STORM.json.

**P4** (rank 9.55/10)
> Tri-estado en dominio: **accept** (cumple), **reject** (viola hard), **review** (ausente, desconocido u outlier suave). El cero en montos suele ser accept si el invariante lo pe…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/reference/compound_stmts.html#the-match-statement
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reglas de dominio: rangos y listas permitidas» in S03_STORM.json.

### Tablas de decisión y match/case
**P1** (rank 9.55/10)
> Una **decision table** es una tabla de negocio: filas de condiciones → acción. Primero la escribes en español (o en un dict de ejemplos); después la implementas. Evita inventar …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/reference/compound_stmts.html#the-match-statement; Python: https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tablas de decisión y match/case» in S03_STORM.json.

**P2** (rank 9.55/10)
> **`match` / `case`** (Python 3.10+) brilla cuando el sujeto es un **literal o estado finito** (`
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not; Python: https://docs.python.org/3/library/stdtypes.html#truth-value-testing
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tablas de decisión y match/case» in S03_STORM.json.

**P3** (rank 9.55/10)
> `, códigos de error). Soporta **OR patterns** (`case 
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#truth-value-testing; Python: https://docs.python.org/3/library/stdtypes.html#comparisons
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tablas de decisión y match/case» in S03_STORM.json.

**P4** (rank 9.55/10)
> :`) y el comodín **`case _:`** (debe ser explícito para defaults). El primer case que matchea gana.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#comparisons; Python: https://docs.python.org/3/tutorial/controlflow.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tablas de decisión y match/case» in S03_STORM.json.

**P5** (rank 9.55/10)
> **Cuándo preferir `if`**: rangos numéricos, combinaciones de varios campos, o condiciones que no son patrones de estructura. `match` no depreca `if`; elige por **claridad**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/controlflow.html; PEP 636: https://peps.python.org/pep-0636/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tablas de decisión y match/case» in S03_STORM.json.

### Invariantes: promesas que el dato debe cumplir
**P1** (rank 9.55/10)
> Un **invariante** de campo es una promesa en español: “`contacto` es un str de 9 dígitos, o `None` si aún no se capturó”. No es código todavía: es **especificación**. Los **ejem…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 636: https://peps.python.org/pep-0636/; Py4E: https://www.py4e.com/html3/03-conditional
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Invariantes: promesas que el dato debe cumplir» in S03_STORM.json.

**P2** (rank 9.55/10)
> Mínimo profesional: **al menos un ejemplo por estado de decisión** que tu regla produce. Si solo pruebas el camino feliz, el validador miente en producción.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/03-conditional; unittest: https://docs.python.org/3/library/unittest.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Invariantes: promesas que el dato debe cumplir» in S03_STORM.json.

**P3** (rank 9.55/10)
> `assert` sirve en desarrollo y tests, pero **no** como única validación de intake en producción (`python -O` desactiva asserts). Usa returns con `status`/`code`/`message` para r…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** unittest: https://docs.python.org/3/library/unittest.html; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Invariantes: promesas que el dato debe cumplir» in S03_STORM.json.

### Mensajes que se pueden ejecutar y pruebas por rama
**P1** (rank 9.55/10)
> Un mensaje accionable nombra el **campo**, el **problema** y la **acción esperada**: `Campo 
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Mensajes que se pueden ejecutar y pruebas por ra» in S03_STORM.json.

**P2** (rank 9.55/10)
> =-5 fuera de rango; usa 0–120.` Evita mensajes vagos como Error o inválido. Códigos estables (`MISSING`, `OUT_OF_RANGE`, `NOT_IN_ALLOWLIST`, `NEEDS_REVIEW`, `OK`) permiten métri…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Mensajes que se pueden ejecutar y pruebas por ra» in S03_STORM.json.

**P3** (rank 9.55/10)
> **Un test por rama** del validador: si tienes 4 caminos (None, tipo mal, rango, OK), necesitas ≥4 casos. El else/default también cuenta.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Mensajes que se pueden ejecutar y pruebas por ra» in S03_STORM.json.

**P4** (rank 9.55/10)
> No loguees secretos ni PII real. En el curso solo datos sintéticos. El ciclo **test rojo → arreglar regla → verde** es la forma de depurar off-by-one en fronteras (`>= 18` vs `>…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Mensajes que se pueden ejecutar y pruebas por ra» in S03_STORM.json.

