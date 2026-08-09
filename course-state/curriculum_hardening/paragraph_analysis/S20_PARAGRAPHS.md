# S20 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:21:59.000+00:00
Section: Automatización robusta de Excel
File: `s20-rag.ts`
STORM cycles: **20**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- openpyxl: [docs](https://openpyxl.readthedocs.io/) — API workbooks
- openpyxl: [tutorial](https://openpyxl.readthedocs.io/en/stable/tutorial.html) — sheets cells
- openpyxl: [styles](https://openpyxl.readthedocs.io/en/stable/styles.html) — fonts fills
- openpyxl: [charts](https://openpyxl.readthedocs.io/en/stable/charts/introduction.html) — embedded charts
- Microsoft: [Open XML SDK](https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk) — xlsx format
- ECMA: [ECMA-376](https://www.ecma-international.org/publications-and-standards/standards/ecma-376/) — OOXML
- Python: [pathlib](https://docs.python.org/3/library/pathlib.html) — template paths
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — files
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — logic
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- Real Python: [openpyxl](https://realpython.com/openpyxl-excel-spreadsheets-python/) — spreadsheets
- deeplearning.ai: [Data Engineering](https://www.deeplearning.ai/specializations/data-engineering) — delivery pipelines
- GitHub: [python-for-everybody-resources](https://github.com/sersavn/python-for-everybody-resources) — exercises
- Python: [shutil](https://docs.python.org/3/library/shutil.html) — backup copy
- Python: [tempfile](https://docs.python.org/3/library/tempfile.html) — safe temp files
- GitHub: [https-deeplearning-ai](https://github.com/https-deeplearning-ai) — org
- Automate the Boring Stuff: [Excel chapter](https://automatetheboringstuff.com/2e/chapter13/) — excel automation
- Python: [json](https://docs.python.org/3/library/json.html) — manifest changes

## Gold pass
| Area | Decision |
|------|----------|
| theory | strip workbench theater + domain depth |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “RAG en producción” a Excel factory (mapa)
**P1** (rank 9.55/10)
> En V3, **S20 no es RAG de embeddings en producción**. El id `rag` se conserva; el camino es la **automatización robusta de Excel** (openpyxl) como reporting fac…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** openpyxl: https://openpyxl.readthedocs.io/; openpyxl: https://openpyxl.readthedocs.io/en/stable/tutorial.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “RAG en producción” a Excel factory (mapa)» in S20_STORM.json.

**P2** (rank 9.55/10)
> Hilo: workbook sintético `cpn2b_factory.xlsx` con hojas Entrada/Datos/Salida, regiones Lima/Cusco y montos PEN. Una corrida debe ser reejecutable sin corromper …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** openpyxl: https://openpyxl.readthedocs.io/en/stable/tutorial.html; openpyxl: https://openpyxl.readthedocs.io/en/stable/styles.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “RAG en producción” a Excel factory (mapa)» in S20_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Modelo de libro** (sheets, celdas, tablas, named ranges; fórmulas vs cache) → **T2 Presentación** (estilos, charts Excel, fechas/locales, protección…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** openpyxl: https://openpyxl.readthedocs.io/en/stable/styles.html; openpyxl: https://openpyxl.readthedocs.io/en/stable/charts/introduction.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “RAG en producción” a Excel factory (mapa)» in S20_STORM.json.

### sheets, celdas, tablas y named ranges
**P1** (rank 9.55/10)
> Un libro es un grafo de **hojas + celdas + tablas + named ranges**. Nombra hojas de forma estable (`Entrada`, `Datos`, `Salida`); evita “Hoja1” en el entregable…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** openpyxl: https://openpyxl.readthedocs.io/en/stable/charts/introduction.html; Microsoft: https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «sheets, celdas, tablas y named ranges» in S20_STORM.json.

**P2** (rank 9.55/10)
> Contrato: crear workbook, set title, escribir encabezados, append filas, listar `sheetnames`. El gate verifica presencia de hojas requeridas y encabezado `regio…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Microsoft: https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk; ECMA: https://www.ecma-international.org/publications-and-standards/standards/ecma-376/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «sheets, celdas, tablas y named ranges» in S20_STORM.json.

**P3** (rank 9.55/10)
> Caso: `ws.title='Entrada'`, A1=`region`; segunda hoja `Salida`. Conteos de filas de datos (sin header) alimentan la conciliación con el dashboard S19 (mismos n)…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** ECMA: https://www.ecma-international.org/publications-and-standards/standards/ecma-376/; Python: https://docs.python.org/3/library/pathlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «sheets, celdas, tablas y named ranges» in S20_STORM.json.

### fórmulas vs valores cacheados
**P1** (rank 9.55/10)
> Las **fórmulas** viven en la celda; los **valores cacheados** son lo que Excel/openpyxl puede leer sin motor de cálculo completo. No asumas que `data_only=True`…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/pathlib.html; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fórmulas vs valores cacheados» in S20_STORM.json.

**P2** (rank 9.55/10)
> Contrato didáctico: separa “escribir fórmula” de “assert de valor de negocio”. Para asserts de KPI en CI del curso, escribe **valores materializados** o documen…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fórmulas vs valores cacheados» in S20_STORM.json.

**P3** (rank 9.55/10)
> Caso: celda `=SUM(B2:B10)` vs valor 120 precalculado en Python. El factory de CP-N2-B prefiere materializar métricas ya validadas en pandas y copiar el número a…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fórmulas vs valores cacheados» in S20_STORM.json.

### estilos, charts y plantillas
**P1** (rank 9.55/10)
> Estilos (fuentes, fills, borders), charts embebidos y plantillas reutilizables dan pinta ejecutiva — pero el **contrato de datos** manda sobre el formato. No ro…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «estilos, charts y plantillas» in S20_STORM.json.

**P2** (rank 9.55/10)
> Contrato: estilos solo en rangos de presentación; datos crudos en hoja Entrada sin merges que impidan `iter_rows`. Charts Excel son opcionales si el PNG de S19 …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «estilos, charts y plantillas» in S20_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: plantilla con logo placeholder y tabla de KPIs; el script rellena filas sin tocar la fila 1 de encabezados fijos. Diff estructural del xlsx debe…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; Real Python: https://realpython.com/openpyxl-excel-spreadsheets-python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «estilos, charts y plantillas» in S20_STORM.json.

### fechas, locales, celdas combinadas y protección
**P1** (rank 9.55/10)
> Fechas y locales: serializa fechas ISO o datetime timezone-aware documentado; no dependas del locale del SO del alumno para parsear “03/04/24”. Celdas combinada…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Real Python: https://realpython.com/openpyxl-excel-spreadsheets-python/; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fechas, locales, celdas combinadas y protección» in S20_STORM.json.

**P2** (rank 9.55/10)
> Contrato: evita merges en rangos de datos; si la plantilla legacy los trae, lee el valor de la celda ancla y documenta. Protección: el script debe fallar claro …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; GitHub: https://github.com/sersavn/python-for-everybody-resources
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fechas, locales, celdas combinadas y protección» in S20_STORM.json.

**P3** (rank 9.55/10)
> Caso: corte `2024-06-30` en celda de metadata; región en columna A sin merge. El data note del factory repite el corte — alineado a S18.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/sersavn/python-for-everybody-resources; Python: https://docs.python.org/3/library/shutil.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «fechas, locales, celdas combinadas y protección» in S20_STORM.json.

### conciliación y pivots
**P1** (rank 9.55/10)
> **Conciliación**: totales del Excel de salida deben cuadrar con los del dataframe fuente (suma de montos, n de filas). Pivots en Excel son para el usuario final…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/shutil.html; Python: https://docs.python.org/3/library/tempfile.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «conciliación y pivots» in S20_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `assert abs(sum_xlsx - sum_df) < tol` y `n_xlsx == n_df`. Si no cuadra, **fail-closed**: no emitas el paquete a S21. Documenta tolerancia de redondeo …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/tempfile.html; GitHub: https://github.com/https-deeplearning-ai
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «conciliación y pivots» in S20_STORM.json.

**P3** (rank 9.55/10)
> Caso: df montos 10+20+30 vs hoja Salida; pivot región→suma. El gate imprime `reconcile True` solo si ambos lados coinciden.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/https-deeplearning-ai; Automate the Boring Stuff: https://automatetheboringstuff.com/2e/chapter13/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «conciliación y pivots» in S20_STORM.json.

### reglas de validación y preservación de estructura
**P1** (rank 9.55/10)
> Reglas de validación (listas, enteros, custom) y **preservación de estructura**: no borres hojas de catálogo; no renombres `Entrada` en caliente sin migrar refe…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Automate the Boring Stuff: https://automatetheboringstuff.com/2e/chapter13/; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas de validación y preservación de estructur» in S20_STORM.json.

**P2** (rank 9.55/10)
> Contrato: conjunto de sheetnames requeridas ⊆ sheetnames reales; encabezados exactos; tipos coercibles. Ante fila inválida, cuarentena de fila o abort del batch…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; openpyxl: https://openpyxl.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas de validación y preservación de estructur» in S20_STORM.json.

**P3** (rank 9.55/10)
> Caso: need `{'Datos','Salida'}`; si falta `Salida`, `structural_ok` es False y no se genera el zip del reporting package.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** openpyxl: https://openpyxl.readthedocs.io/; openpyxl: https://openpyxl.readthedocs.io/en/stable/tutorial.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas de validación y preservación de estructur» in S20_STORM.json.

### batch, archivos corruptos y locks
**P1** (rank 9.55/10)
> Batch de muchos xlsx: itera paths, captura corruptos (BadZipFile), respeta locks de archivo ajenos (no crashear el pipeline entero). Un archivo malo se aísla; e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** openpyxl: https://openpyxl.readthedocs.io/en/stable/tutorial.html; openpyxl: https://openpyxl.readthedocs.io/en/stable/styles.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «batch, archivos corruptos y locks» in S20_STORM.json.

**P2** (rank 9.55/10)
> Contrato operativo: contadores `ok` / `skip_corrupt` / `skip_locked`; log de paths sintéticos. Timeout y tamaño máximo por archivo evitan DoS accidental en carp…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** openpyxl: https://openpyxl.readthedocs.io/en/stable/styles.html; openpyxl: https://openpyxl.readthedocs.io/en/stable/charts/introduction.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «batch, archivos corruptos y locks» in S20_STORM.json.

**P3** (rank 9.55/10)
> Caso didáctico: lista de 3 paths, uno corrupto → ok=2, skip_corrupt=1. El summary JSON alimenta el audit del factory.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** openpyxl: https://openpyxl.readthedocs.io/en/stable/charts/introduction.html; Microsoft: https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «batch, archivos corruptos y locks» in S20_STORM.json.

### backups, idempotencia y pruebas estructurales
**P1** (rank 9.55/10)
> **Backups e idempotencia**: antes de sobrescribir, copia a `backup/` o escribe a path versionado. Misma entrada + misma versión de script → mismos hashes de hoj…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Microsoft: https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk; ECMA: https://www.ecma-international.org/publications-and-standards/standards/ecma-376/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «backups, idempotencia y pruebas estructurales» in S20_STORM.json.

**P2** (rank 9.55/10)
> Contrato: digest de filas ordenadas; `structural_ok(sheetnames, need)`; re-ejecutar dos veces no duplica filas. Prueba estructural en CI del curso sin abrir Exc…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** ECMA: https://www.ecma-international.org/publications-and-standards/standards/ecma-376/; Python: https://docs.python.org/3/library/pathlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «backups, idempotencia y pruebas estructurales» in S20_STORM.json.

**P3** (rank 9.55/10)
> Caso: `dig(rows)` estable; segunda corrida con misma key de corrida no agrega filas fantasma. Cierra el tramo Excel hacia documentos S21.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/pathlib.html; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «backups, idempotencia y pruebas estructurales» in S20_STORM.json.

