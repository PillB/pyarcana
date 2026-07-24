# S2 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:50:39.071+00:00
Section: Valores, tipos, operadores e I/O
File: `s02-basics.ts`
STORM cycles: **2**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [Tutorial intro](https://docs.python.org/3/tutorial/introduction.html) — literals
- Python: [Built-in types](https://docs.python.org/3/library/stdtypes.html) — types
- Python: [decimal](https://docs.python.org/3/library/decimal.html) — money
- PEP 8: [Style](https://peps.python.org/pep-0008/) — names
- Python: [I/O tutorial](https://docs.python.org/3/tutorial/inputoutput.html) — f-strings
- Py4E: [Variables](https://www.py4e.com/html3/02-variables) — types ped
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — input types
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — MOOC
- Kaggle: [Learn Python](https://www.kaggle.com/learn/python) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [NoneType](https://docs.python.org/3/library/constants.html#None) — None
- Python: [isinstance](https://docs.python.org/3/library/functions.html#isinstance) — validation

## Gold pass
| Area | Decision |
|------|----------|
| theory | expert refresh / deepen |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Absolute Basics” a valores y tipos (mapa de la sección)
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Literal:** valor escrito en el código (`34`, `
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/introduction.html; Python: https://docs.python.org/3/library/stdtypes.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Absolute Basics” a valores y tipos (mapa de » in S02_STORM.json.

**P2** (rank 9.55/10)
> `, `True`). **Tipo:** clase del valor (`int`, `float`, `str`, `bool`, `NoneType`). **Asignación vs comparación:** `=` guarda; `==` pregunta igualdad. **Identidad vs igualdad:** …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Absolute Basics” a valores y tipos (mapa de » in S02_STORM.json.

**P3** (rank 9.55/10)
> En V3, **S02 no cubre condicionales, loops, funciones avanzadas ni comprehensions** como camino principal del estudiante. Esos temas se posponen a secciones posteriores. Aquí do…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; PEP 8: https://peps.python.org/pep-0008/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Absolute Basics” a valores y tipos (mapa de » in S02_STORM.json.

**P4** (rank 9.55/10)
> El hilo conductor es un **registro sintético de cliente** (nombres, dos apellidos, contacto, dirección, y a veces edad o monto). Todo el material usa datos ficticios (`example.c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 8: https://peps.python.org/pep-0008/; Python: https://docs.python.org/3/tutorial/inputoutput.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Absolute Basics” a valores y tipos (mapa de » in S02_STORM.json.

**P5** (rank 9.55/10)
> Orden pedagógico: **T1 Valores** (literales → inspección/conversión) → **T2 Nombres** (asignación/PEP 8 → identidad y copias) → **T3 Operadores** (precedencia → Decimal para din…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/inputoutput.html; Py4E: https://www.py4e.com/html3/02-variables
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Absolute Basics” a valores y tipos (mapa de » in S02_STORM.json.

### Literales y tipos básicos
**P1** (rank 9.55/10)
> Un **literal** es un valor escrito directamente en el código: `34`, `150.5`, `
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/02-variables; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Literales y tipos básicos» in S02_STORM.json.

**P2** (rank 9.55/10)
> `, `True`, `None`. Python clasifica cada valor en un **tipo**. Los tipos básicos de S02 son: **`int`** (enteros: `0`, `34`, `-7`), **`float`** (punto flotante: `150.5`, `1.0`), …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Literales y tipos básicos» in S02_STORM.json.

**P3** (rank 9.55/10)
> `), **`bool`** (`True` / `False`) y **`None`** (ausencia de valor; su tipo es **`NoneType`**).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Literales y tipos básicos» in S02_STORM.json.

**P4** (rank 9.55/10)
> La trampa clásica de intake: el número **`42`** (int) y el texto **`
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Literales y tipos básicos» in S02_STORM.json.

**P5** (rank 9.55/10)
> `** (str) **no son el mismo valor**. `42 == 
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Literales y tipos básicos» in S02_STORM.json.

**P6** (rank 9.55/10)
> ` es `False`. En formularios y CSV **casi todo llega como str**. Si sumas o comparas sin convertir, obtienes `TypeError` o lógica silenciosamente incorrecta. El teléfono **`9990…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/constants.html#None
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Literales y tipos básicos» in S02_STORM.json.

**P7** (rank 9.55/10)
> Para ver el tipo usa **`type(x)`** (devuelve la clase) o, en reportes didácticos, `type(x).__name__` (`
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/constants.html#None; Python: https://docs.python.org/3/library/functions.html#isinstance
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Literales y tipos básicos» in S02_STORM.json.

**P8** (rank 9.55/10)
> `, …). Más adelante preferirás `isinstance` para validar; primero entrenas el ojo con literales. Nota avanzada (no abuses): en Python **`bool` es subtipo de `int`**, así que `is…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/functions.html#isinstance; Python: https://docs.python.org/3/tutorial/introduction.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Literales y tipos básicos» in S02_STORM.json.

### Inspección, conversión y validación
**P1** (rank 9.55/10)
> **`type(x)`** responde “¿qué es esto ahora?”. **`isinstance(x, int)`** responde “¿puedo tratarlo como int?” (incluye subtipos). En parsers, `isinstance` suele ser más útil que c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/introduction.html; Python: https://docs.python.org/3/library/stdtypes.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Inspección, conversión y validación» in S02_STORM.json.

**P2** (rank 9.55/10)
> La conversión explícita usa constructores: **`int()`**, **`float()`**, **`str()`**. El texto de formularios trae espacios: **`valor.strip()`** antes de convertir. `int(
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Inspección, conversión y validación» in S02_STORM.json.

**P3** (rank 9.55/10)
> )` lanzan **`ValueError`**. **Nunca uses `eval()`** sobre input de usuario: es un riesgo de seguridad y un anti-patrón de calidad de datos.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; PEP 8: https://peps.python.org/pep-0008/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Inspección, conversión y validación» in S02_STORM.json.

**P4** (rank 9.55/10)
> Validación profesional: capturar el fallo, **nombrar el campo** en el mensaje y **no tragar el error en silencio**. Un patrón útil es devolver una tupla `(ok, valor_o_None, mens…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 8: https://peps.python.org/pep-0008/; Python: https://docs.python.org/3/tutorial/inputoutput.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Inspección, conversión y validación» in S02_STORM.json.

### Asignación y convenciones de nombres
**P1** (rank 9.55/10)
> **`=` asigna** un nombre a un valor en el namespace actual. **`==` compara** igualdad y devuelve un `bool`. En versiones modernas de Python, `if x = 1:` es **SyntaxError** (el w…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/inputoutput.html; Py4E: https://www.py4e.com/html3/02-variables
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Asignación y convenciones de nombres» in S02_STORM.json.

**P2** (rank 9.55/10)
> PEP 8 (guía de estilo): **`snake_case`** para variables y funciones (`apellido_paterno`, `parse_client`), **`UPPER_CASE`** para constantes (`EDAD_MINIMA`, `IGV_TASA`), **`CapWor…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/02-variables; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Asignación y convenciones de nombres» in S02_STORM.json.

**P3** (rank 9.55/10)
> En el schema de intake usa nombres estables y en español técnico claro: `nombres`, `apellido_paterno`, `apellido_materno`, `contacto`, `direccion`. No inventes parentesco real a…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Asignación y convenciones de nombres» in S02_STORM.json.

### Identidad, mutabilidad y copias superficiales
**P1** (rank 9.55/10)
> **`==` compara valor**; **`is` / `is not` comparan identidad** (¿mismo objeto en memoria?). El idioma correcto para ausencia es **`x is None`** (no `x == None`, aunque a veces “…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Identidad, mutabilidad y copias superficiales» in S02_STORM.json.

**P2** (rank 9.55/10)
> Los **`str` son inmutables**: `.strip()` o concatenar devuelve **otro** string; el original no cambia. Las **`list` son mutables**: `append` altera el mismo objeto. Si `b = a` y…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Identidad, mutabilidad y copias superficiales» in S02_STORM.json.

**P3** (rank 9.55/10)
> Patrón de calidad de datos: guarda **`campo_raw`** (o un dict `raw`) con el texto original y trabaja en **`campo` / `clean`**. Si el parse falla, **el raw sigue ahí** para el me…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Identidad, mutabilidad y copias superficiales» in S02_STORM.json.

### Operadores y precedencia
**P1** (rank 9.55/10)
> Los operadores aritméticos de S02: **`+`**, **`-`**, **`*`**, **`/`** (división verdadera → `float`), **`//`** (división entera hacia −∞), **`%`** (resto) y **`**`** (potencia).…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/constants.html#None
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Operadores y precedencia» in S02_STORM.json.

**P2** (rank 9.55/10)
> La **precedencia** importa: `*` y `/` van antes que `+` y `-`; `**` es aún más prioritario y se asocia a la derecha. Trampa clásica: **`-3**2` vale `-9`**, no `9`, porque el una…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/constants.html#None; Python: https://docs.python.org/3/library/functions.html#isinstance
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Operadores y precedencia» in S02_STORM.json.

**P3** (rank 9.55/10)
> En intake peruano, un precio con IGV 18% se escribe mentalmente como *base × (1 + 0.18)*. Si escribes `base + base * 0.18` sin paréntesis extra, la precedencia de `*` ya lo resu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/functions.html#isinstance; Python: https://docs.python.org/3/tutorial/introduction.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Operadores y precedencia» in S02_STORM.json.

### Decimal para dinero y redondeo
**P1** (rank 9.55/10)
> **`float` no es dinero.** `0.1 + 0.2` produce `0.30000000000000004` por representación binaria. En montos en **soles (S/)** de fintech, retail o bancos, usa **`decimal.Decimal`*…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/introduction.html; Python: https://docs.python.org/3/library/stdtypes.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Decimal para dinero y redondeo» in S02_STORM.json.

**P2** (rank 9.55/10)
> )`, **nunca** `Decimal(0.1)` (ya arrastras el error del float).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Decimal para dinero y redondeo» in S02_STORM.json.

**P3** (rank 9.55/10)
> Redondeo a céntimos: **`quantize(Decimal(
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; PEP 8: https://peps.python.org/pep-0008/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Decimal para dinero y redondeo» in S02_STORM.json.

**P4** (rank 9.55/10)
> ))`**. El redondeo bancario por defecto suele ser **`ROUND_HALF_EVEN`** (mitad al par). Importa: `from decimal import Decimal, ROUND_HALF_EVEN`. Patrón: subtotal + IGV 18% → qua…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 8: https://peps.python.org/pep-0008/; Python: https://docs.python.org/3/tutorial/inputoutput.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Decimal para dinero y redondeo» in S02_STORM.json.

**P5** (rank 9.55/10)
> En intake, el campo monto llega como **texto** (`
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/inputoutput.html; Py4E: https://www.py4e.com/html3/02-variables
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Decimal para dinero y redondeo» in S02_STORM.json.

**P6** (rank 9.55/10)
> `). Parseas con `Decimal(texto.strip())`, capturas `InvalidOperation`, y reportas error con nombre de campo. **Convención S02: punto decimal** (`150.50`), no coma; si el CSV tra…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/02-variables; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Decimal para dinero y redondeo» in S02_STORM.json.

### input, print y f-strings
**P1** (rank 9.55/10)
> **`input(prompt)`** siempre devuelve **`str`**, aunque el usuario escriba dígitos. En el browser/Pyodide a menudo **simulas input** con variables o parámetros de función (testea…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «input, print y f-strings» in S02_STORM.json.

**P2** (rank 9.55/10)
> )`** controla separadores y fin de línea.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «input, print y f-strings» in S02_STORM.json.

**P3** (rank 9.55/10)
> Las **f-strings** (`f
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «input, print y f-strings» in S02_STORM.json.

**P4** (rank 9.55/10)
> `) son el formato preferido en S02: legibles, con expresiones cortas y especificadores (`{monto:.2f}`, `{nombre!r}`). Después de T3-B, todo monto de negocio continúa como `Decim…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «input, print y f-strings» in S02_STORM.json.

**P5** (rank 9.55/10)
> Patrón profesional: separa **captura** (valores str), **parse** (tipos) y **reporte** (f-strings). Así puedes unit-testear el parse sin depender de la consola. Un resumen de cli…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/constants.html#None
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «input, print y f-strings» in S02_STORM.json.

### Parsing de intake y mensajes de error
**P1** (rank 9.55/10)
> Un **parser de intake** recibe un registro sintético, conserva **`*_raw`**, produce campos limpios (strip) y acumula **`errors: list[str]`** sin tragar excepciones. El raw **sie…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/constants.html#None; Python: https://docs.python.org/3/library/functions.html#isinstance
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Parsing de intake y mensajes de error» in S02_STORM.json.

**P2** (rank 9.55/10)
> Casos mínimos del gate CP-N1-A: **vacío** (mensaje accionable + raw `
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/functions.html#isinstance; Python: https://docs.python.org/3/tutorial/introduction.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Parsing de intake y mensajes de error» in S02_STORM.json.

**P3** (rank 9.55/10)
> `), **Unicode** (García, Ñahui, María — round-trip sin errores ASCII), **número inválido** (`edad=
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/introduction.html; Python: https://docs.python.org/3/library/stdtypes.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Parsing de intake y mensajes de error» in S02_STORM.json.

**P4** (rank 9.55/10)
> ` → error con nombre de campo, raw intacto). Los tests son **asserts** o pytest: no “mirar la consola y ya”.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Parsing de intake y mensajes de error» in S02_STORM.json.

**P5** (rank 9.55/10)
> Mensaje accionable = **qué campo**, **qué valor se recibió** (`!r` / repr), **qué se esperaba**. Evita `except: pass`. No afirmes parentesco real por dos apellidos: son **campos…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; PEP 8: https://peps.python.org/pep-0008/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Parsing de intake y mensajes de error» in S02_STORM.json.

