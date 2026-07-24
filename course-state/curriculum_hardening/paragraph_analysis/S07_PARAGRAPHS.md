# S7 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:58:20.582+00:00
Section: Texto, Unicode y expresiones regulares
File: `s07-data-acquisition.ts`
STORM cycles: **7**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [unicodedata](https://docs.python.org/3/library/unicodedata.html) — NFC
- Python: [re](https://docs.python.org/3/library/re.html) — regex
- Python: [Unicode HOWTO](https://docs.python.org/3/howto/unicode.html) — unicode
- Python: [str methods](https://docs.python.org/3/library/stdtypes.html#string-methods) — str ops
- Python: [Regex HOWTO](https://docs.python.org/3/howto/regex.html) — regex ped
- Py4E: [Strings](https://www.py4e.com/html3/06-strings) — strings
- RegexOne: [Interactive](https://regexone.com/) — practice
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — regex mod
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — MOOC
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [casefold](https://docs.python.org/3/library/stdtypes.html#str.casefold) — casefold
- Python: [fullmatch](https://docs.python.org/3/library/re.html#re.fullmatch) — fullmatch

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Adquisición multi-fuente” a texto Unicode y regex (mapa)
**P1** (rank 9.55/10)
> En V3, **S07 no es el path principal de scraping, SQL ni APIs**. Esos temas se reubican. Aquí el estudiante domina **texto latinoamericano**: normalización Unicode, nombres con …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/unicodedata.html; Python: https://docs.python.org/3/library/re.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Adquisición multi-fuente” a texto Unicode y » in S07_STORM.json.

**P2** (rank 9.55/10)
> El incremento CP-N1-B es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Datos sintéticos peruanos/latam; sin PII real. Contrato: …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/re.html; Python: https://docs.python.org/3/howto/unicode.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Adquisición multi-fuente” a texto Unicode y » in S07_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Unicode** → **T2 str ops y contacto** → **T3 regex** → **T4 similitud y FP/FN**. Caso sintético Perú: nombres sintéticos José/Quispe, emails/teléfonos ficticios, Lim…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/howto/unicode.html; Python: https://docs.python.org/3/library/stdtypes.html#string-methods
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Adquisición multi-fuente” a texto Unicode y » in S07_STORM.json.

### Code points, normalización y casefold
**P1** (rank 9.55/10)
> Python 3 `str` es Unicode. `ord('ñ')` / `chr(241)` exploran **code points**. La misma letra puede codificarse de formas distintas: **NFC** (compuesta) vs **NFD** (base + combini…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#string-methods; Python: https://docs.python.org/3/howto/regex.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Code points, normalización y casefold» in S07_STORM.json.

**P2** (rank 9.55/10)
> `unicodedata.normalize('NFC', s)` unifica formas **antes** de comparar o de tokenizar. Sin eso, `'José' == 'Jose\\u0301'` puede ser `False`. Contrato del normalizador CP-N1-B: e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/howto/regex.html; Py4E: https://www.py4e.com/html3/06-strings
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Code points, normalización y casefold» in S07_STORM.json.

**P3** (rank 9.55/10)
> `casefold()` es más agresivo que `lower()` para comparaciones case-insensitive (mejor para nombres/emails). Pipeline canónico: **NFC → strip/collapse → casefold (si política lo …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/06-strings; RegexOne: https://regexone.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Code points, normalización y casefold» in S07_STORM.json.

### Tildes, ñ, partículas y apellidos compuestos
**P1** (rank 9.55/10)
> En Perú y Latam es común **nombre(s) + apellido1 + apellido2**. No fuerces el formato US (first/last único). Conserva el **raw** siempre. En texto y similaridad, el *porqué* es …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** RegexOne: https://regexone.com/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tildes, ñ, partículas y apellidos compuestos» in S07_STORM.json.

**P2** (rank 9.55/10)
> Partículas (`de`, `del`, `de la`, `y`) pueden ir en nombres o apellidos (`María del Carmen`, `de la Cruz`). Un parser **suave** tokeniza y aplica heurísticas; si no hay segundo …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tildes, ñ, partículas y apellidos compuestos» in S07_STORM.json.

**P3** (rank 9.55/10)
> Espacios múltiples se colapsan; tildes y ñ se preservan en la forma normalizada visible (NFC). Caso sintético Perú: nombres sintéticos José/Quispe, emails/teléfonos ficticios, L…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tildes, ñ, partículas y apellidos compuestos» in S07_STORM.json.

### split / join / search / replace
**P1** (rank 9.55/10)
> Antes de regex: `strip`, `split`, `join`, `replace`, `find`, `startswith`. El **~80%** de limpieza de direcciones y tokens se resuelve así — regex es la excepción, no el default…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «split / join / search / replace» in S07_STORM.json.

**P2** (rank 9.55/10)
> `' '.join(s.split())` colapsa espacios. `split(',')` parsea CSV-like **simple** (sin comillas escapadas: ahí entra el módulo `csv` en S08). Contrato: entrada → transformación do…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/stdtypes.html#str.casefold
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «split / join / search / replace» in S07_STORM.json.

**P3** (rank 9.55/10)
> `replace` es **literal** y predecible; úsalo para normalizar guiones o prefijos **antes** de invocar regex. Caso sintético: Av. Larco, Miraflores — conserva `raw` en el record d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#str.casefold; Python: https://docs.python.org/3/library/re.html#re.fullmatch
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «split / join / search / replace» in S07_STORM.json.

### Nombres, emails y teléfonos sin sobrevalidación
**P1** (rank 9.55/10)
> Email: strip + casefold y una comprobación **modesta pero completa**: exactamente un `@`, parte local y dominio no vacíos, y ningún espacio. No confirma que el buzón exista; sol…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/re.html#re.fullmatch; Python: https://docs.python.org/3/library/unicodedata.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Nombres, emails y teléfonos sin sobrevalidación» in S07_STORM.json.

**P2** (rank 9.55/10)
> Teléfono PE sintético de demo: extraer dígitos y conservar el prefijo de país `51` cuando viene como `+51`; opcionalmente revisar 9 dígitos locales — no inventes validación de o…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/unicodedata.html; Python: https://docs.python.org/3/library/re.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Nombres, emails y teléfonos sin sobrevalidación» in S07_STORM.json.

**P3** (rank 9.55/10)
> Nombre: collapse + NFC; title-case es cosmético y puede pelear con partículas (`del` → `Del`). **Decide política y documenta**. Un score de similitud de nombres es **evidencia p…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/re.html; Python: https://docs.python.org/3/howto/unicode.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Nombres, emails y teléfonos sin sobrevalidación» in S07_STORM.json.

### Patrones, grupos y anchors
**P1** (rank 9.55/10)
> Regex cuando el patrón es **regular de verdad**: DNI sintético 8 dígitos, códigos de región, prefijos. Usa `re` con **grupos** `(...)` y anchors `^$` para full match. Si puedes …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/howto/unicode.html; Python: https://docs.python.org/3/library/stdtypes.html#string-methods
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Patrones, grupos y anchors» in S07_STORM.json.

**P2** (rank 9.55/10)
> `re.fullmatch` ancla inicio y fin. `re.search` encuentra en medio. Confundirlos produce **falsos positivos** en validación de códigos (un DNI embebido en texto “pasa” con search…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#string-methods; Python: https://docs.python.org/3/howto/regex.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Patrones, grupos y anchors» in S07_STORM.json.

**P3** (rank 9.55/10)
> Grupos con nombre `(?P<name>...)` mejoran legibilidad al extraer campos. Caso sintético: DNI 8 dígitos demo — **nunca** PII real ni claims de identidad legal.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/howto/regex.html; Py4E: https://www.py4e.com/html3/06-strings
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Patrones, grupos y anchors» in S07_STORM.json.

### Compilación, extracción y límites
**P1** (rank 9.55/10)
> `re.compile` reutiliza el patrón en loops (claridad + micro-ahorro). `findall` / `finditer` extraen múltiples matches de un log sintético — útil en demos de extración, no en ove…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/06-strings; RegexOne: https://regexone.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Compilación, extracción y límites» in S07_STORM.json.

**P2** (rank 9.55/10)
> Límites: **catastrophic backtracking** con patrones anidados ambiguos; **overfit** de validación que rechaza inputs reales válidos. Prefiere patrones **aburridos y simples**. Fa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** RegexOne: https://regexone.com/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Compilación, extracción y límites» in S07_STORM.json.

**P3** (rank 9.55/10)
> Si el patrón crece sin control, vuelve a `str` methods o a un parser explícito. Regex que “lo hacen todo” son un bug de producto disfrazado de elegancia.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Compilación, extracción y límites» in S07_STORM.json.

### Exacta y por tokens (Jaccard simple)
**P1** (rank 9.55/10)
> Matching de texto en intake: primero **igualdad normalizada** (NFC + casefold + collapse). Si no, **similitud por tokens** (Jaccard) como señal débil. En texto y similaridad, el…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Exacta y por tokens (Jaccard simple)» in S07_STORM.json.

**P2** (rank 9.55/10)
> Jaccard = |A∩B| / |A∪B| sobre sets de tokens. Score medio → **review**, no auto-merge. Contrato: entrada explícita → transformación documentada → salida medible; si falta eviden…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Exacta y por tokens (Jaccard simple)» in S07_STORM.json.

**P3** (rank 9.55/10)
> Nunca digas “es la misma persona” ni “parentesco” por un score. Conserva evidencia (score, raw A/B). Caso sintético Perú: nombres sintéticos José/Quispe, emails/teléfonos fictic…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/stdtypes.html#str.casefold
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Exacta y por tokens (Jaccard simple)» in S07_STORM.json.

### FP/FN y conservación de evidencia
**P1** (rank 9.55/10)
> **FP** (false positive): el sistema dice match y no debería. **FN**: debería matchear y no lo hizo. En nombres latam, tildes y partículas mueven ambos. En texto y similaridad, e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#str.casefold; Python: https://docs.python.org/3/library/re.html#re.fullmatch
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «FP/FN y conservación de evidencia» in S07_STORM.json.

**P2** (rank 9.55/10)
> Empaqueta evidencia: `{raw_a, raw_b, score, decision, reason}`. La decisión puede ser accept/review/reject de matching — **no** etiqueta familiar. Contrato: entrada explícita → …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/re.html#re.fullmatch; Python: https://docs.python.org/3/library/unicodedata.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «FP/FN y conservación de evidencia» in S07_STORM.json.

**P3** (rank 9.55/10)
> Documenta por qué no se afirma parentesco: falta de fuente autoritativa, riesgo legal/ético, score insuficiente. Caso sintético Perú: nombres sintéticos José/Quispe, emails/telé…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/unicodedata.html; Python: https://docs.python.org/3/library/re.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «FP/FN y conservación de evidencia» in S07_STORM.json.

