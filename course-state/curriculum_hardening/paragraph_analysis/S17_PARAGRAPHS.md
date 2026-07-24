# S17 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:19:14.000+00:00
Section: Joins, reshape, groupby y cierre analítico
File: `s17-packaging.ts`
STORM cycles: **17**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- pandas: [merge](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html) — validate indicator
- pandas: [groupby](https://pandas.pydata.org/docs/user_guide/groupby.html) — agg transform
- pandas: [reshaping](https://pandas.pydata.org/docs/user_guide/reshaping.html) — melt pivot
- pandas: [window](https://pandas.pydata.org/docs/user_guide/window.html) — rolling
- pandas: [timeseries](https://pandas.pydata.org/docs/user_guide/timeseries.html) — cohorts
- pandas: [MergeError](https://pandas.pydata.org/docs/reference/api/pandas.errors.MergeError.html) — validate fail
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — foundations
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — structures
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- deeplearning.ai: [Data Engineering](https://www.deeplearning.ai/specializations/data-engineering) — pipelines
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- GitHub: [python-for-everybody-resources](https://github.com/sersavn/python-for-everybody-resources) — exercises
- pandas: [concat](https://pandas.pydata.org/docs/reference/api/pandas.concat.html) — stack frames
- pandas: [pivot_table](https://pandas.pydata.org/docs/reference/api/pandas.pivot_table.html) — aggfunc
- Real Python: [pandas merge join](https://realpython.com/pandas-merge-join-and-concat/) — join patterns
- GitHub: [https-deeplearning-ai](https://github.com/https-deeplearning-ai) — course orgs

## Gold pass
| Area | Decision |
|------|----------|
| theory | domain depth + ethics |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Packaging y CLI” a joins/groupby y cierre CP-N2-A (mapa)
**P1** (rank 9.55/10)
> En V3, **S17 no es el path de pyproject.toml ni PyPI**. El id de plataforma `packaging` se conserva, pero el camino del estudiante es el **cierre de CP-N2-A**: …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html; pandas: https://pandas.pydata.org/docs/user_guide/groupby.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Packaging y CLI” a joins/groupby y cierre CP» in S17_STORM.json.

**P2** (rank 9.55/10)
> El hilo conductor es un **portfolio ejecutivo de data quality + EDA** con regiones ficticias (Lima, Cusco, Arequipa), `cliente_id` tipo `C00x` y montos en PEN s…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/groupby.html; pandas: https://pandas.pydata.org/docs/user_guide/reshaping.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Packaging y CLI” a joins/groupby y cierre CP» in S17_STORM.json.

**P3** (rank 9.55/10)
> Orden pedagógico: **T1 Joins** (claves, cardinalidad, validate, anti-join) → **T2 Forma** (concat, melt, pivot, nombres estables) → **T3 Agregación** (groupby/a…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/reshaping.html; pandas: https://pandas.pydata.org/docs/user_guide/window.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Packaging y CLI” a joins/groupby y cierre CP» in S17_STORM.json.

### claves y cardinalidad en joins
**P1** (rank 9.55/10)
> `merge`/`join` combina tablas por clave con `how` ∈ {inner, left, right, outer}. La **cardinalidad** esperada (1:1, 1:m, m:1, m:m) determina si el número de fil…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/window.html; pandas: https://pandas.pydata.org/docs/user_guide/timeseries.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves y cardinalidad en joins» in S17_STORM.json.

**P2** (rank 9.55/10)
> Contrato operativo: **antes del merge** verifica dtype alineado (ambos `str` tras normalización S16), unicidad de la clave en el lado 1 (`Series.is_unique` o `n…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/timeseries.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.errors.MergeError.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves y cardinalidad en joins» in S17_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético Perú: `cli` (C001 Lima, C002 Cusco) left-merge con `tx` (dos filas C001, ninguna C003). Salida esperada: C001 se duplica por monto; C002 queda co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.errors.MergeError.html; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves y cardinalidad en joins» in S17_STORM.json.

### validate, duplicación accidental y anti-join
**P1** (rank 9.55/10)
> El parámetro `validate='one_to_one'|'one_to_many'|...` hace que pandas **falle temprano** con `MergeError` si la cardinalidad real no coincide con el contrato. …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «validate, duplicación accidental y anti-join» in S17_STORM.json.

**P2** (rank 9.55/10)
> `indicator=True` agrega la columna `_merge` con valores `left_only` / `right_only` / `both`. El **anti-join** clásico filtra `left_only` (clientes sin transacci…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «validate, duplicación accidental y anti-join» in S17_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: cli={C001,C002}, tx={C001,C003}. Left anti-join → C002; right-only → C003. Si intentas `validate='one_to_one'` con C001 duplicado en tx, debes c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «validate, duplicación accidental y anti-join» in S17_STORM.json.

### concat, melt y pivot
**P1** (rank 9.55/10)
> `concat` apila filas (`axis=0`) o alinea columnas (`axis=1`). `melt` lleva **wide→long** (ideal para series por mes); `pivot` / `pivot_table` hacen **long→wide*…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «concat, melt y pivot» in S17_STORM.json.

**P2** (rank 9.55/10)
> Contrato: declara `id_vars` / `value_vars` o `index`+`columns`+`values`, y en `pivot_table` fija **`aggfunc` explícito** (p. ej. `sum`) para no depender del def…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «concat, melt y pivot» in S17_STORM.json.

**P3** (rank 9.55/10)
> Fixture sintético: wide con columnas `ene`/`feb` por `cliente_id` → melt a (`cliente_id`,`mes`,`monto`) → pivot_table de regreso. Verifica `len(long)==n_cliente…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; GitHub: https://github.com/sersavn/python-for-everybody-resources
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «concat, melt y pivot» in S17_STORM.json.

### long/wide y nombres estables
**P1** (rank 9.55/10)
> Tras un pivot, las columnas pueden ser MultiIndex o nombres crudos (`ene`, `feb`). El portfolio exige un **schema estable**: p. ej. `cliente_id`, `monto_ene`, `…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://github.com/sersavn/python-for-everybody-resources; pandas: https://pandas.pydata.org/docs/reference/api/pandas.concat.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «long/wide y nombres estables» in S17_STORM.json.

**P2** (rank 9.55/10)
> Contrato de nombres: lista ordenada en el memo del CP-N2-A; cualquier rename silencioso rompe el dashboard o el diff del PR. Prefiere `rename(columns={...})` co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.concat.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.pivot_table.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «long/wide y nombres estables» in S17_STORM.json.

**P3** (rank 9.55/10)
> Caso: long (`cliente_id`,`mes`,`monto`) → pivot → prefijo `monto_`. Imprime columnas y un booleano de igualdad de sets. Si falta `monto_feb`, el gate de schema …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.pivot_table.html; Real Python: https://realpython.com/pandas-merge-join-and-concat/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «long/wide y nombres estables» in S17_STORM.json.

### groupby / agg / transform
**P1** (rank 9.55/10)
> `groupby` + `agg` **colapsa** grupos a una fila por clave (resúmenes ejecutivos). `transform` **reinyecta** el agregado al shape original (features a nivel fila…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/pandas-merge-join-and-concat/; GitHub: https://github.com/https-deeplearning-ai
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «groupby / agg / transform» in S17_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `as_index=False` facilita merges posteriores; no mezcles sin documentar si el index del groupby es la clave. Evita aplicar `mean` cuando la pregunta d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** GitHub: https://github.com/https-deeplearning-ai; pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «groupby / agg / transform» in S17_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: regiones Lima/Cusco con montos → `agg` produce total y n; `transform('mean')` deja la media regional en cada fila. El EDA del portfolio usa agg …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html; pandas: https://pandas.pydata.org/docs/user_guide/groupby.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «groupby / agg / transform» in S17_STORM.json.

### ventanas, fechas y cohortes
**P1** (rank 9.55/10)
> `rolling` construye **ventanas móviles** sobre series ordenadas; `resample` requiere DatetimeIndex. Una **cohorte** etiqueta a cada cliente por el periodo de su…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/groupby.html; pandas: https://pandas.pydata.org/docs/user_guide/reshaping.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ventanas, fechas y cohortes» in S17_STORM.json.

### denominadores y totales
**P1** (rank 9.55/10)
> Reconciliación ejecutiva: la **suma de partes debe igualar el total** de referencia (o la diferencia queda documentada con tolerancia `abs(diff)<eps`). Los **de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/reshaping.html; pandas: https://pandas.pydata.org/docs/user_guide/window.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «denominadores y totales» in S17_STORM.json.

**P2** (rank 9.55/10)
> Contrato bridge: `total → segmento_A → residual`. Si Lima=60 y total=100, el residual del resto es 40. Nunca uses un denominador de otro corte temporal o geográ…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/window.html; pandas: https://pandas.pydata.org/docs/user_guide/timeseries.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «denominadores y totales» in S17_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: total nacional 100 PEN; partes Lima/Cusco/Arequipa; tasa de completitud 150/200=0.75. El portfolio imprime `diff`, `reconciled` y la tasa con su…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/timeseries.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.errors.MergeError.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «denominadores y totales» in S17_STORM.json.

### leakage temporal y controles antes/después
**P1** (rank 9.55/10)
> **Leakage temporal** es usar información con fecha posterior al **cutoff** para features o métricas de un periodo “antes”. Invalida comparaciones before/after y…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.errors.MergeError.html; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «leakage temporal y controles antes/después» in S17_STORM.json.

**P2** (rank 9.55/10)
> Controles: cutoff estricto (`fecha <= t`), agregados solo sobre el subconjunto pre-cutoff, y comparación explícita `sum_total - sum_pre` como **delta de leakage…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «leakage temporal y controles antes/después» in S17_STORM.json.

**P3** (rank 9.55/10)
> Caso: C001 con tx 10 PEN en ene y 999 en mar; cutoff 2024-01-31 → feature segura 10, leaky 1009, delta de leakage 999. El cierre CP-N2-A debe demostrar al menos…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «leakage temporal y controles antes/después» in S17_STORM.json.

