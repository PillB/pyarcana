# S6 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:54:36.301+00:00
Section: Colecciones y estructuras de datos
File: `s06-numpy.ts`
STORM cycles: **6**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [Data structures](https://docs.python.org/3/tutorial/datastructures.html) — list dict set
- Python: [copy module](https://docs.python.org/3/library/copy.html) — shallow deep
- Python: [json](https://docs.python.org/3/library/json.html) — sort_keys
- Python Wiki: [TimeComplexity](https://wiki.python.org/moin/TimeComplexity) — cost
- Py4E: [Lists](https://www.py4e.com/html3/08-lists) — lists ped
- Python: [Sorting HOWTO](https://docs.python.org/3/howto/sorting.html) — sorted key
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — structures
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — aliasing
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — MOOC
- Kaggle: [Learn Python](https://www.kaggle.com/learn/python) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [dict views](https://docs.python.org/3/library/stdtypes.html#dict-views) — keys
- Python: [set types](https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset) — sets

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “NumPy vectorizado” a colecciones en memoria (mapa de la sección)
**P1** (rank 9.55/10)
> En V3, **S06 no es el path principal de NumPy arrays ni broadcasting**. Ese material se reubica conceptualmente hacia el bloque numérico/DS (p. ej. S14+). Aquí construyes el **m…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/datastructures.html; Python: https://docs.python.org/3/library/copy.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “NumPy vectorizado” a colecciones en memoria » in S06_STORM.json.

**P2** (rank 9.55/10)
> El hilo conductor es un **mini almacén en RAM** con datos sintéticos latam (`example.com`, ids `C00x`). **Sin** pandas ni NumPy en este incremento. En S08 ese modelo se conecta …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/copy.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “NumPy vectorizado” a colecciones en memoria » in S06_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Secuencias** (list/tuple/slicing → alias/copia) → **T2 Dicts/sets** (índices, dedup con conflictos) → **T3 Anidado y missing** → **T4 Orden y elección de estructura*…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python Wiki: https://wiki.python.org/moin/TimeComplexity
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “NumPy vectorizado” a colecciones en memoria » in S06_STORM.json.

### Listas, tuplas y slicing
**P1** (rank 9.55/10)
> Una **list** es mutable y ordenada: ideal para filas que crecen (`append`, `extend`). Una **tuple** es inmutable: ideal para **claves estables**, headers fijos o “contratos” de …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python Wiki: https://wiki.python.org/moin/TimeComplexity; Py4E: https://www.py4e.com/html3/08-lists
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Listas, tuplas y slicing» in S06_STORM.json.

**P2** (rank 9.55/10)
> El **slicing** `seq[i:j:k]` produce una **ventana** sin mutar el original (en listas/tuplas crea una nueva secuencia). `txs[-3:]` son las últimas tres transacciones. El **stop e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/08-lists; Python: https://docs.python.org/3/howto/sorting.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Listas, tuplas y slicing» in S06_STORM.json.

**P3** (rank 9.55/10)
> Membership `x in seq` es **O(n)** en listas: útil para lotes pequeños de demo; para lookups masivos preferirás **set/dict** (O(1) promedio) en T2. No uses lista de 100k ids para…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/howto/sorting.html; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Listas, tuplas y slicing» in S06_STORM.json.

### Unpacking, aliasing y copia
**P1** (rank 9.55/10)
> **Unpacking** `a, b = fila` o `head, *rest = fila` desempaqueta sin índices ruidosos. Falla si el largo no calza: **eso es bueno** (detecta shape roto en el lote).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Unpacking, aliasing y copia» in S06_STORM.json.

**P2** (rank 9.55/10)
> **Aliasing**: `b = a` **no** copia; ambas variables apuntan al **mismo** objeto. Si `a` es una lista de dicts y mutas `b[0][
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Unpacking, aliasing y copia» in S06_STORM.json.

**P3** (rank 9.55/10)
> ]`, también cambia `a[0]`. Ese bug clásico aparece al “clonar” clientes en memoria.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Unpacking, aliasing y copia» in S06_STORM.json.

**P4** (rank 9.55/10)
> `list.copy()` / `seq[:]` hacen **copia superficial**. Para dicts anidados necesitas `copy.deepcopy` o reconstruir por fila. En intake, shallow basta si solo reordenas filas **si…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Unpacking, aliasing y copia» in S06_STORM.json.

### Diccionarios y pertenencia
**P1** (rank 9.55/10)
> Un **dict** modela registros y **índices** `id → cliente`. Lookup promedio **O(1)**. Construye índices con `{c[
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/stdtypes.html#dict-views
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Diccionarios y pertenencia» in S06_STORM.json.

**P2** (rank 9.55/10)
> ]: c for c in filas}` cuando harás muchos accesos por clave en el almacén en RAM.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#dict-views; Python: https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Diccionarios y pertenencia» in S06_STORM.json.

**P3** (rank 9.55/10)
> `d.get(k)` o `d.get(k, default)` evita **KeyError** en campos opcionales. `k in d` prueba pertenencia de **clave**, no de valor — no confundes con “¿el cliente tiene email?” si …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset; Python: https://docs.python.org/3/tutorial/datastructures.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Diccionarios y pertenencia» in S06_STORM.json.

**P4** (rank 9.55/10)
> `update` / merge fusiona configs: el segundo dict **pisa** claves del primero. Documenta la precedencia (`override > base`) para no “pisar sin querer” políticas de normalización…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/datastructures.html; Python: https://docs.python.org/3/library/copy.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Diccionarios y pertenencia» in S06_STORM.json.

### Deduplicación y operaciones de set
**P1** (rank 9.55/10)
> Un **set** guarda elementos únicos (hashables). Ideal para **ids/emails** deduplicados y para **unión/intersección/diferencia** de cohortes de dos lotes sintéticos.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/copy.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Deduplicación y operaciones de set» in S06_STORM.json.

**P2** (rank 9.55/10)
> Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id` pero montos distintos deben **reportarse** en `conflicts`, no silenciarse. El patr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python Wiki: https://wiki.python.org/moin/TimeComplexity
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Deduplicación y operaciones de set» in S06_STORM.json.

**P3** (rank 9.55/10)
> Para exports **deterministas**, no dependas del orden del set: ordena con `sorted(...)` al exportar (JSON `sort_keys`, listas de ids ordenadas). Reproducibilidad > “orden de lle…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python Wiki: https://wiki.python.org/moin/TimeComplexity; Py4E: https://www.py4e.com/html3/08-lists
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Deduplicación y operaciones de set» in S06_STORM.json.

### Estructuras anidadas y recorridos
**P1** (rank 9.55/10)
> El modelo CP-N1-B anida: `cliente = {id, nombre, contacts: [...], txs: [...]}`. Recorres con `for c in clients: for t in c[
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/08-lists; Python: https://docs.python.org/3/howto/sorting.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estructuras anidadas y recorridos» in S06_STORM.json.

**P2** (rank 9.55/10)
> ]:` — bucles anidados **legibles** sobre el grafo en memoria.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/howto/sorting.html; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estructuras anidadas y recorridos» in S06_STORM.json.

**P3** (rank 9.55/10)
> **Aplanar** transacciones a filas densas (con `client_id` denormalizado) prepara el shape de export CSV en S08. **Contar** contactos por cliente valida integridad del almacén en…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estructuras anidadas y recorridos» in S06_STORM.json.

**P4** (rank 9.55/10)
> Shape inconsistente (falta clave `txs`, o no es lista) se detecta con `isinstance` y se manda a **review** — no asumas que todo dict llegó bien formado del lote sintético.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estructuras anidadas y recorridos» in S06_STORM.json.

### Acceso seguro y valores faltantes
**P1** (rank 9.55/10)
> Campos opcionales: `contact.get(
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Acceso seguro y valores faltantes» in S06_STORM.json.

**P2** (rank 9.55/10)
> )` puede devolver `None`. Encadenar `.get` en anidados evita KeyError: `(c.get(
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Acceso seguro y valores faltantes» in S06_STORM.json.

**P3** (rank 9.55/10)
> )` o un helper `get_nested`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/stdtypes.html#dict-views
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Acceso seguro y valores faltantes» in S06_STORM.json.

**P4** (rank 9.55/10)
> Distingue **missing** (`None` / clave ausente) de **vacío falsy** (`
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#dict-views; Python: https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Acceso seguro y valores faltantes» in S06_STORM.json.

**P5** (rank 9.55/10)
> `, `0`, `[]`). Un teléfono `
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset; Python: https://docs.python.org/3/tutorial/datastructures.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Acceso seguro y valores faltantes» in S06_STORM.json.

**P6** (rank 9.55/10)
> ` no es lo mismo que “no vino el campo”: el reporte de calidad debe etiquetar distinto si la política lo exige (eco de S03: `None≠0`).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/datastructures.html; Python: https://docs.python.org/3/library/copy.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Acceso seguro y valores faltantes» in S06_STORM.json.

**P7** (rank 9.55/10)
> Helpers `dig(obj, *path)` o `get_nested` centralizan la política y se **testean una vez**. No copies el mismo try/except de KeyError en 20 sitios del orquestador.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/copy.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Acceso seguro y valores faltantes» in S06_STORM.json.

### Ordenamiento y key
**P1** (rank 9.55/10)
> `sorted(seq, key=fn)` devuelve **nueva** lista. `list.sort(key=fn)` **muta in-place** y retorna `None` — un bug clásico si haces `x = rows.sort(...)` y pierdes las filas.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python Wiki: https://wiki.python.org/moin/TimeComplexity
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ordenamiento y key» in S06_STORM.json.

**P2** (rank 9.55/10)
> `key` multi-campo: `key=lambda r: (r[
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python Wiki: https://wiki.python.org/moin/TimeComplexity; Py4E: https://www.py4e.com/html3/08-lists
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ordenamiento y key» in S06_STORM.json.

**P3** (rank 9.55/10)
> ])` ordena **estable** por región y luego nombre. Timsort preserva el orden relativo de empates — útil para audits reproducibles.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com/html3/08-lists; Python: https://docs.python.org/3/howto/sorting.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ordenamiento y key» in S06_STORM.json.

**P4** (rank 9.55/10)
> Para montos, asegúrate de que el tipo sea **numérico** antes de ordenar; strings `
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/howto/sorting.html; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ordenamiento y key» in S06_STORM.json.

**P5** (rank 9.55/10)
> ` rompen el ranking. Normaliza tipos (S05) antes de `sorted`.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Ordenamiento y key» in S06_STORM.json.

### Estructura adecuada, complejidad y determinismo
**P1** (rank 9.55/10)
> Elige estructura por **operación dominante**: muchos appends → list; muchos lookups por id → dict; membership de cohortes → set; contrato fijo inmutable → tuple. **No** uses dic…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estructura adecuada, complejidad y determinismo» in S06_STORM.json.

**P2** (rank 9.55/10)
> Complejidad: membership en list **O(n)**; en set/dict **O(1)** promedio. No hagas `if x in big_list` dentro de un loop de n si puedes **preindexar** con un dict. Eso es deuda de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Kaggle: https://www.kaggle.com/learn/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estructura adecuada, complejidad y determinismo» in S06_STORM.json.

**P3** (rank 9.55/10)
> **Determinismo**: `json.dumps(obj, sort_keys=True, ensure_ascii=False)` + `sorted` de ids produce el mismo string en cada corrida. Reproducibilidad es parte del gate CP-N1-B — d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Kaggle: https://www.kaggle.com/learn/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Estructura adecuada, complejidad y determinismo» in S06_STORM.json.

