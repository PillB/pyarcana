# S16 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:16:09.000+00:00
Section: Calidad, limpieza y contratos de datos
File: `s16-wxpython-gui.ts`
STORM cycles: **16**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- pandas: [missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html) — nulls
- pandas: [drop_duplicates](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html) — dups
- pandas: [groupby nunique](https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.nunique.html) — conflicts
- GE: [Great Expectations](https://greatexpectations.io/docs/) — contracts
- pandas: [text](https://pandas.pydata.org/docs/user_guide/text.html) — normalize
- pandas: [quantile](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.quantile.html) — IQR
- Python: [json](https://docs.python.org/3/library/json.html) — audit metrics
- pandas: [user guide](https://pandas.pydata.org/docs/user_guide/index.html) — cleaning
- deeplearning.ai: [Data Engineering](https://www.deeplearning.ai/specializations/data-engineering) — quality pipelines
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — foundations
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — validation
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — practice
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- GitHub: [python-for-everybody-resources](https://github.com/sersavn/python-for-everybody-resources) — exercises
- pandas: [fillna](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.fillna.html) — impute cap

## Gold pass
| Area | Decision |
|------|----------|
| theory | hand deepen / domain quality |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “GUI wxPython” a calidad y contratos de datos (mapa)
**P1** (rank 9.55/10)
> En V3, **S16 no es el path de wx.Frame ni sizers**. El id de plataforma `wxpython-gui` se conserva, pero el camino del estudiante es el **quality gate de CP-N2-…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/missing_data.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “GUI wxPython” a calidad y contratos de datos» in S16_STORM.json.

**P2** (rank 9.55/10)
> Regla de oro: **nunca “arreglar” silenciosamente**. Toda transformación deja métrica, indicador o rastro en cuarentena. Datos sintéticos de clientes y montos (r…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.nunique.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “GUI wxPython” a calidad y contratos de datos» in S16_STORM.json.

**P3** (rank 9.55/10)
> Orden pedagógico: **T1 Ausencia** (required/optional, indicadores, cap de imputación) → **T2 Duplicados** (exactos vs conflictos, evidencia de clave) → **T3 Nor…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.nunique.html; GE: https://greatexpectations.io/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “GUI wxPython” a calidad y contratos de datos» in S16_STORM.json.

### nulls y políticas por campo
**P1** (rank 9.55/10)
> Cada campo del contrato tiene política **required** (null ⇒ cuarentena o fail del gate) u **optional** (null permitido, idealmente con indicador de ausencia). M…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GE: https://greatexpectations.io/docs/; pandas: https://pandas.pydata.org/docs/user_guide/text.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «nulls y políticas por campo» in S16_STORM.json.

**P2** (rank 9.55/10)
> Contrato operativo: documenta un dict `{campo: 'required'|'optional'}`, mide con `isna`/`notna`, y arma un mapa `violations` solo para required con n>0. No impu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/text.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.quantile.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «nulls y políticas por campo» in S16_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético Perú: `cliente_id` y `monto` required; `email` optional. Filas con id o monto nulo entran a violaciones; la tasa de null de email se reporta como…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.quantile.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «nulls y políticas por campo» in S16_STORM.json.

### indicadores y límites de imputación
**P1** (rank 9.55/10)
> Un **indicador de ausencia** (`monto_was_null`) preserva señal cuando imputas un optional: el modelo, el auditor y el stakeholder de riesgo ven qué filas fueron…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; pandas: https://pandas.pydata.org/docs/user_guide/index.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «indicadores y límites de imputación» in S16_STORM.json.

**P2** (rank 9.55/10)
> Límites del gate: no imputar más del **cap** (p. ej. 30–40% null en la columna), no imputar llaves de negocio (`cliente_id`), y documentar la regla (mediana, co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/index.html; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «indicadores y límites de imputación» in S16_STORM.json.

**P3** (rank 9.55/10)
> Caso: monto con 2/5 null y cap=0.4 → se permite `fillna(mediana)` + columna `was_null`. Si el rate supera el cap, no hay fill silencioso. La mediana se calcula …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «indicadores y límites de imputación» in S16_STORM.json.

### duplicados exactos vs conflictos
**P1** (rank 9.55/10)
> **Duplicado exacto**: mismas columnas relevantes idénticas. **Conflicto**: misma clave de negocio con atributos distintos (p. ej. dos regiones para un `cliente_…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «duplicados exactos vs conflictos» in S16_STORM.json.

### claves, cardinalidad y conservación de evidencia
**P1** (rank 9.55/10)
> Define la **clave de negocio** y la cardinalidad esperada (típicamente 1 fila por cliente). Los duplicados de clave van a **cuarentena con evidencia completa** …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves, cardinalidad y conservación de evidencia» in S16_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `clean = drop_duplicates(key, keep=...)` con regla documentada; `quarantine = filas con clave duplicada` sin pérdida de columnas. El set limpio alimen…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves, cardinalidad y conservación de evidencia» in S16_STORM.json.

**P3** (rank 9.55/10)
> Caso: C001 con scores 0.9 y 0.4 de src a/b. `keep='first'` deja 0.9 en clean; `quarantine_n=2` conserva ambas filas y columnas de evidencia. Sin esa evidencia, …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves, cardinalidad y conservación de evidencia» in S16_STORM.json.

### normalización de strings, números, fechas y categorías
**P1** (rank 9.55/10)
> Normalización: strings (`strip`, colapso de espacios, `title`/`casefold`), números (quitar `S/`, comas de miles, decimal latino), fechas multi-formato, categorí…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; GitHub: https://github.com/sersavn/python-for-everybody-resources
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «normalización de strings, números, fechas y cate» in S16_STORM.json.

**P2** (rank 9.55/10)
> Contrato: conserva **raw** en columna lateral (`region_raw`, `monto_raw`) cuando el valor canónico puede disputarse o re-parsearse. Valida dtypes post-normaliza…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/sersavn/python-for-everybody-resources; pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.fillna.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «normalización de strings, números, fechas y cate» in S16_STORM.json.

**P3** (rank 9.55/10)
> Caso Perú sintético: ` lima `, `AREQUIPA`, montos `S/ 10.50` y textos con coma de miles. Salida canónica Lima/Arequipa y floats en PEN ficticios; raw intacto pa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.fillna.html; pandas: https://pandas.pydata.org/docs/user_guide/missing_data.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «normalización de strings, números, fechas y cate» in S16_STORM.json.

### outliers plausibles vs errores
**P1** (rank 9.55/10)
> Un outlier **plausible** está lejos estadísticamente pero dentro del dominio de negocio (monto alto legítimo en una campaña). Un **error de dominio** viola boun…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/missing_data.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «outliers plausibles vs errores» in S16_STORM.json.

### reglas de schema y cross-field
**P1** (rank 9.55/10)
> Contrato de **schema**: columnas presentes, dtypes esperados y nullability por campo. **Cross-field**: p. ej. `fecha_fin >= fecha_ini`, `monto > 0` si estado=pa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.nunique.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas de schema y cross-field» in S16_STORM.json.

**P2** (rank 9.55/10)
> Ante **schema drift** (columna required faltante o renombrada), el gate falla con el **nombre** de la columna — no con un `KeyError` opaco al final del pipeline…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.nunique.html; GE: https://greatexpectations.io/docs/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas de schema y cross-field» in S16_STORM.json.

**P3** (rank 9.55/10)
> Caso: expected `{inicio, fin, monto}`; detecta cross-field `fin<inicio` e índices de monto negativo. Imprime `drift`, `cross_fail_idx` y `neg_idx` con códigos l…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GE: https://greatexpectations.io/docs/; pandas: https://pandas.pydata.org/docs/user_guide/text.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas de schema y cross-field» in S16_STORM.json.

### métricas, cuarentena y audit trail
**P1** (rank 9.55/10)
> Métricas operables del run: `rows_in`, `rows_clean`, `rows_quarantine`, tasas de null/dup/fail_schema y `pass` booleano. Un fail **sin métricas** no se puede op…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/user_guide/text.html; pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.quantile.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «métricas, cuarentena y audit trail» in S16_STORM.json.

**P2** (rank 9.55/10)
> Cuarentena = tabla de filas rechazadas + razón codificada. **Audit trail** = lista append-only de eventos (`ingest`, `quarantine`, `promote`). El gate publica e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.quantile.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «métricas, cuarentena y audit trail» in S16_STORM.json.

**P3** (rank 9.55/10)
> Caso: 2 filas in, 1 clean, 1 quarantine por `null_required_monto`; audit con evento quarantine. `metrics.pass` es false. S17 solo debe consumir `clean` y el mem…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; pandas: https://pandas.pydata.org/docs/user_guide/index.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «métricas, cuarentena y audit trail» in S16_STORM.json.

