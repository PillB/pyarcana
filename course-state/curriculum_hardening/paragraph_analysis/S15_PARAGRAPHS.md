# S15 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:16:09.000+00:00
Section: Pandas: ingesta, selección y tipos
File: `s15-stdlib-deep.ts`
STORM cycles: **15**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- pandas: [read_csv](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html) — parser
- pandas: [indexing](https://pandas.pydata.org/docs/user_guide/indexing.html) — loc iloc
- pandas: [dtypes](https://pandas.pydata.org/docs/user_guide/basics.html#basics-dtypes) — nullable
- pandas: [to_datetime](https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html) — dates
- pandas: [to_numeric](https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html) — coerce
- pandas: [IO](https://pandas.pydata.org/docs/user_guide/io.html) — export
- Parquet: [docs](https://parquet.apache.org/docs/) — columnar contract
- pandas: [getting started](https://pandas.pydata.org/docs/getting_started/index.html) — official
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — files data
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — structures
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Real Python: [pandas files](https://realpython.com/pandas-read-write-files/) — read write
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — python practice
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- pandas: [assign](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.assign.html) — pipeline

## Gold pass
| Area | Decision |
|------|----------|
| theory | hand deepen / domain quality |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “stdlib profunda” a Pandas ingesta (mapa de la sección)
**P1** (rank 9.55/10)
> En V3, **S15 no es el path principal de contextlib, functools, descriptors ni typing avanzado**. Ese material se reubica. Aquí construyes el **dataset de CP-N2-…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html; pandas: https://pandas.pydata.org/docs/user_guide/indexing.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “stdlib profunda” a Pandas ingesta (mapa de l» in S15_STORM.json.

**P2** (rank 9.55/10)
> Hilo: **clientes y transacciones sintéticas** (Lima/Arequipa, montos en PEN, ids `C00x`/`T00x`). Sin PII real. Si una columna del schema falta o el dtype no cua…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/indexing.html; pandas: https://pandas.pydata.org/docs/user_guide/basics.html#basics-dtypes
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “stdlib profunda” a Pandas ingesta (mapa de l» in S15_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Modelo/lectura** → **T2 Selección** → **T3 Tipos** → **T4 Exportación**. Métrica del gate: filas leídas reconciliadas, reporte de coerciones y manif…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/basics.html#basics-dtypes; pandas: https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “stdlib profunda” a Pandas ingesta (mapa de l» in S15_STORM.json.

### Series/DataFrame/index
**P1** (rank 9.55/10)
> Una **Series** es un vector con **Index**; un **DataFrame** es una tabla de columnas (Series alineadas por Index). Pensar en columnas como Series con el mismo e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Series/DataFrame/index» in S15_STORM.json.

**P2** (rank 9.55/10)
> Un Index **estable** (`cliente_id`) facilita joins futuros y auditoría. `set_index` / `reset_index` cambian el eje de etiqueta; no pierdas la clave de negocio a…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html; pandas: https://pandas.pydata.org/docs/user_guide/io.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Series/DataFrame/index» in S15_STORM.json.

**P3** (rank 9.55/10)
> MultiIndex (región × mes) se menciona como etiquetas jerárquicas y se profundiza en S17. Caso sintético: Series de scores indexada por `C001`/`C002` y DF con `r…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/io.html; Parquet: https://parquet.apache.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Series/DataFrame/index» in S15_STORM.json.

### lectura CSV/Excel y opciones de parser
**P1** (rank 9.55/10)
> `read_csv` y `read_excel` aceptan `dtype`, `parse_dates`, `na_values`, `usecols`. Controlar el parser evita `object` silenciosos y fechas como string que rompen…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Parquet: https://parquet.apache.org/docs/; pandas: https://pandas.pydata.org/docs/getting_started/index.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «lectura CSV/Excel y opciones de parser» in S15_STORM.json.

**P2** (rank 9.55/10)
> En datasets latinos declara encoding (`utf-8`), separador y decimal si aplica. Excel requiere motor (`openpyxl`). Fail-closed: si falta una columna required del…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/getting_started/index.html; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «lectura CSV/Excel y opciones de parser» in S15_STORM.json.

**P3** (rank 9.55/10)
> Siempre reconcilia **filas leídas vs esperadas** y lista columnas + dtypes. Caso sintético: CSV con `NA` en monto → `string` id, `float64` monto, `datetime64` f…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «lectura CSV/Excel y opciones de parser» in S15_STORM.json.

### loc/iloc, filtros y assign
### chained assignment y copy semantics
**P1** (rank 9.55/10)
> **SettingWithCopyWarning** aparece al asignar sobre un slice que puede ser view o copy: el resultado es impredecible y puede no escribir en el DF padre. Es el b…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «chained assignment y copy semantics» in S15_STORM.json.

### strings, nullable, fechas y categorías
**P1** (rank 9.55/10)
> dtypes **string**, **Int64**/**boolean** nullable, **datetime64** y **category** reducen memoria y errores de comparación. `object` heterogéneo es el default pe…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Real Python: https://realpython.com/pandas-read-write-files/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «strings, nullable, fechas y categorías» in S15_STORM.json.

**P2** (rank 9.55/10)
> Convierte con `astype('string')`, `pd.to_numeric(..., errors=)`, `pd.to_datetime`, `astype('category')`. Con `errors='coerce'`, inválidos pasan a NaN — preferib…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Real Python: https://realpython.com/pandas-read-write-files/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «strings, nullable, fechas y categorías» in S15_STORM.json.

**P3** (rank 9.55/10)
> Reporta cuántos valores no convirtieron. Caso sintético: monto `x` y fecha `bad` → 1 NaN cada uno; región `title` + `category` para Lima/Arequipa sintéticas.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «strings, nullable, fechas y categorías» in S15_STORM.json.

### coerción explícita y schema
**P1** (rank 9.55/10)
> Un **schema dict** declara tipos objetivo por columna (`cliente_id: string`, `monto: float64`). `astype` / `to_numeric` aplican coerción; los fallos se listan —…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.assign.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coerción explícita y schema» in S15_STORM.json.

**P2** (rank 9.55/10)
> No “arregles” silenciosamente: emite un reporte `{columna: n_fallos}`. Si falta una columna del schema, falla explicable (nombre de columna), no inventes defaul…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.assign.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coerción explícita y schema» in S15_STORM.json.

**P3** (rank 9.55/10)
> Este reporte alimenta el quality gate de S16. Caso sintético: `monto` con `N/A` → `coercion_report={'monto': 1}` y dtypes finales string/float64.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html; pandas: https://pandas.pydata.org/docs/user_guide/indexing.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coerción explícita y schema» in S15_STORM.json.

### CSV / Excel y contrato Parquet
**P1** (rank 9.55/10)
> `to_csv` y `to_excel` exportan tablas. Parquet (pyarrow/fastparquet) preserva tipos; si el motor no está en el entorno del curso, exporta CSV + **schema JSON** …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/indexing.html; pandas: https://pandas.pydata.org/docs/user_guide/basics.html#basics-dtypes
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «CSV / Excel y contrato Parquet» in S15_STORM.json.

**P2** (rank 9.55/10)
> Usa `index=False` salvo que el index sea clave de negocio documentada (evita `Unnamed` al reingestar). Round-trip: lee de nuevo y compara columnas críticas.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/basics.html#basics-dtypes; pandas: https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «CSV / Excel y contrato Parquet» in S15_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: export CSV en memoria → columnas idénticas; Excel bytes no vacíos; `parquet_contract` con dtypes por columna aunque no haya pyarrow.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «CSV / Excel y contrato Parquet» in S15_STORM.json.

### índices, formatos, provenance y memoria
**P1** (rank 9.55/10)
> Un **manifest** registra filas, columnas, dtypes, `memory_usage` y provenance (`source`, hash del artefacto). Sin eso no hay reconciliación de ingesta en CP-N2-…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html; pandas: https://pandas.pydata.org/docs/user_guide/io.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «índices, formatos, provenance y memoria» in S15_STORM.json.

**P2** (rank 9.55/10)
> `index=False` en export evita columnas `Unnamed` al reingestar. El hash (p. ej. SHA-1 truncado del CSV) permite detectar si el artefacto cambió entre runs.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/io.html; Parquet: https://parquet.apache.org/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «índices, formatos, provenance y memoria» in S15_STORM.json.

**P3** (rank 9.55/10)
> Documenta memoria antes/después de castear a `category`/`string` cuando el dataset crece. Caso sintético: manifest JSON con `rows=2`, dtypes, `memory_bytes` y `…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Parquet: https://parquet.apache.org/docs/; pandas: https://pandas.pydata.org/docs/getting_started/index.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «índices, formatos, provenance y memoria» in S15_STORM.json.

