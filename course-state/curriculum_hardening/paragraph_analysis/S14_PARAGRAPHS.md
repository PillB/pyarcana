# S14 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:12:42.000+00:00
Section: NumPy y cómputo vectorizado
File: `s14-security.ts`
STORM cycles: **14**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- NumPy: [Absolute beginners](https://numpy.org/doc/stable/user/absolute_beginners.html) — ndarray
- NumPy: [Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) — shapes
- NumPy: [Logic routines](https://numpy.org/doc/stable/reference/routines.logic.html) — isnan isfinite
- NumPy: [Indexing](https://numpy.org/doc/stable/user/basics.indexing.html) — masks views
- NumPy: [ufuncs](https://numpy.org/doc/stable/reference/ufuncs.html) — vector ops
- NumPy: [assert_allclose](https://numpy.org/doc/stable/reference/generated/numpy.testing.assert_allclose.html) — equivalence
- Python: [perf_counter](https://docs.python.org/3/library/time.html#time.perf_counter) — benchmark
- NumPy: [Tutorials](https://numpy.org/numpy-tutorials/) — official
- MIT: [6.0001](https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/) — efficiency
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — foundations
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — python practice
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- NumPy: [ndarray object](https://numpy.org/doc/stable/reference/arrays.ndarray.html) — memory layout

## Gold pass
| Area | Decision |
|------|----------|
| theory | hand deepen + strip theater |
| weDo | CASO DEFECT |
| git | NO restore (WT DEFECT>HEAD) |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Seguridad para Automatizaciones e IA” a NumPy vectorizado (mapa de la sección)
**P1** (rank 9.55/10)
> En V3, **S14 no es el path principal de OWASP LLM, prompt injection ni Presidio**. Ese material se reubica al tramo de seguridad/IA. Aquí inicia **CP-N2-A**: nd…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/user/absolute_beginners.html; NumPy: https://numpy.org/doc/stable/user/basics.broadcasting.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Seguridad para Automatizaciones e IA” a NumP» in S14_STORM.json.

**P2** (rank 9.55/10)
> El hilo conductor es un **tablero de calidad** (completitud, unicidad, rangos, señales por pares) en NumPy. Solo datos sintéticos latam (Lima/Arequipa/Cusco, id…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/user/basics.broadcasting.html; NumPy: https://numpy.org/doc/stable/reference/routines.logic.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Seguridad para Automatizaciones e IA” a NumP» in S14_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Arrays** → **T2 Operaciones** → **T3 Semántica** → **T4 Rendimiento**. Métrica del gate: métricas vectorizadas equivalentes al baseline loop dentro …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/routines.logic.html; NumPy: https://numpy.org/doc/stable/user/basics.indexing.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Seguridad para Automatizaciones e IA” a NumP» in S14_STORM.json.

### ndarray, dtype y shape
**P1** (rank 9.55/10)
> Un **ndarray** es un bloque contiguo (o strided) de datos **homogéneos**. **dtype** fija el tipo (`float64`, `int32`, `uint8`); **shape** es la tupla de dimensi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/user/basics.indexing.html; NumPy: https://numpy.org/doc/stable/reference/ufuncs.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ndarray, dtype y shape» in S14_STORM.json.

**P2** (rank 9.55/10)
> Crear con dtype **explícito** evita sorpresas (`int` vs `float` en divisiones, o `object` lento). Valida `arr.dtype`, `arr.shape` y `arr.ndim` al recibir un arr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/ufuncs.html; NumPy: https://numpy.org/doc/stable/reference/generated/numpy.testing.assert_allclose.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ndarray, dtype y shape» in S14_STORM.json.

### creación, indexación y máscaras
### ufuncs y reducciones
**P1** (rank 9.55/10)
> Las **ufuncs** (`np.add`, `np.sqrt`, operadores `+`, `*`) aplican elemento a elemento en código compilado. Las **reducciones** (`sum`, `mean`, `std`, `min`, `ma…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/generated/numpy.testing.assert_allclose.html; Python: https://docs.python.org/3/library/time.html#time.perf_counter
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ufuncs y reducciones» in S14_STORM.json.

**P2** (rank 9.55/10)
> `axis=0` agrega por columna (campo); `axis=1` por fila (cliente). `keepdims=True` preserva dimensiones para rebroadcast (restar media por fila sin pelear shapes…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/time.html#time.perf_counter; NumPy: https://numpy.org/numpy-tutorials/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ufuncs y reducciones» in S14_STORM.json.

### broadcasting y compatibilidad de shapes
**P1** (rank 9.55/10)
> El **broadcasting** alinea shapes de **derecha a izquierda**: dimensiones iguales, o una es 1, o ausente. Si no son compatibles, `ValueError` — mejor un error r…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/numpy-tutorials/; MIT: https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «broadcasting y compatibilidad de shapes» in S14_STORM.json.

**P2** (rank 9.55/10)
> `newaxis` / `None` inserta un eje de tamaño 1 para alinear vectores de filas o columnas (p. ej. pesos por variable o umbral por cliente). Úsalo cuando multipliq…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «broadcasting y compatibilidad de shapes» in S14_STORM.json.

**P3** (rank 9.55/10)
> Documenta el shape esperado en el docstring: evita “magia” que rompe con un batch de tamaño distinto. Caso sintético: scores (3,2) × pesos (2,) y un intento (3,…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «broadcasting y compatibilidad de shapes» in S14_STORM.json.

### views/copies y mutabilidad
**P1** (rank 9.55/10)
> Un **view** comparte memoria con el base (`arr.base is not None` a menudo); un **copy** es independiente. Slices simples suelen ser views; fancy index y boolean…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «views/copies y mutabilidad» in S14_STORM.json.

**P2** (rank 9.55/10)
> `arr.flags.writeable` controla mutación. Mutar un view muta el original — bug clásico cuando una función “solo normaliza un slice”. Prefiere copiar o pasar `wri…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «views/copies y mutabilidad» in S14_STORM.json.

### NaN, inf y estabilidad numérica
**P1** (rank 9.55/10)
> `np.nan` y `±inf` rompen `mean`/`sum` clásicos (NaN contagia; inf domina). Usa `np.isnan`/`isinf`/`isfinite`, `nansum`/`nanmean`, o máscaras explícitas antes de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; NumPy: https://numpy.org/doc/stable/reference/arrays.ndarray.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «NaN, inf y estabilidad numérica» in S14_STORM.json.

**P2** (rank 9.55/10)
> `np.finfo(float).eps` acota ruido de redondeo al comparar con tolerancia. Overflow en float produce `inf`; no lo trates como un score válido de calidad. Fail-cl…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/arrays.ndarray.html; NumPy: https://numpy.org/doc/stable/user/absolute_beginners.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «NaN, inf y estabilidad numérica» in S14_STORM.json.

**P3** (rank 9.55/10)
> En calidad, un NaN **no es cero**: es **ausencia**. Reporta tasa de no-finitos aparte de la media de finitos. Caso sintético: array con nan e inf → `finite_mean…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/user/absolute_beginners.html; NumPy: https://numpy.org/doc/stable/user/basics.broadcasting.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «NaN, inf y estabilidad numérica» in S14_STORM.json.

### vectorización frente a loops
**P1** (rank 9.55/10)
> Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado (`dot`, ufuncs). Para N grande (decenas d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/user/basics.broadcasting.html; NumPy: https://numpy.org/doc/stable/reference/routines.logic.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «vectorización frente a loops» in S14_STORM.json.

**P2** (rank 9.55/10)
> Benchmark **honesto**: mismo input, mismo dtype, `time.perf_counter`, reporta `ratio_loop_over_vec` y verifica **equivalencia numérica** (`abs(s_loop-s_vec) < 1…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/routines.logic.html; NumPy: https://numpy.org/doc/stable/user/basics.indexing.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «vectorización frente a loops» in S14_STORM.json.

**P3** (rank 9.55/10)
> A veces un loop claro gana en N pequeño o lógica irregular (early-exit). Documenta el umbral de N en el memo del gate. Caso sintético: `n=50_000` dot product lo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/user/basics.indexing.html; NumPy: https://numpy.org/doc/stable/reference/ufuncs.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «vectorización frente a loops» in S14_STORM.json.

### memoria, medición y tests con tolerancia
**P1** (rank 9.55/10)
> `nbytes` y `itemsize * size` estiman memoria del array. Evita copias innecesarias en datasets grandes del tablero de calidad: cada `.copy()` duplica RAM del bat…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/ufuncs.html; NumPy: https://numpy.org/doc/stable/reference/generated/numpy.testing.assert_allclose.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «memoria, medición y tests con tolerancia» in S14_STORM.json.

**P2** (rank 9.55/10)
> `np.allclose(a, b, rtol=, atol=)` compara floats con tolerancia. `np.testing.assert_allclose` falla con mensaje claro — úsalo en tests del gate CP-N2-A. `rtol` …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NumPy: https://numpy.org/doc/stable/reference/generated/numpy.testing.assert_allclose.html; Python: https://docs.python.org/3/library/time.html#time.perf_counter
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «memoria, medición y tests con tolerancia» in S14_STORM.json.

**P3** (rank 9.55/10)
> El baseline loop y la versión vectorizada deben ser **equivalentes dentro de rtol/atol**. Caso sintético: `base` vs `base+1e-9` pasa `allclose`; `base+0.1` debe…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/time.html#time.perf_counter; NumPy: https://numpy.org/numpy-tutorials/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «memoria, medición y tests con tolerancia» in S14_STORM.json.

