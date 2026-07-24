import type { CourseSection } from '../../types'

export const section14: CourseSection = {
  id: "security",
  index: 14,
  title: "NumPy y cómputo vectorizado",
  shortTitle: "NumPy vectorizado",
  tagline: "cálculo vectorizado de métricas de calidad y señales por pares, con benchmark honesto y resultados equivalentes al baseline",
  estimatedHours: 18,
  level: "Competente",
  phase: 1,
  icon: "Binary",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En data quality y analytics de banca, fintech y retail en Perú, el **cómputo vectorizado con NumPy** es la base de métricas de completitud, unicidad y señales por pares. Aquí abres **CP-N2-A** con arrays sintéticos, benchmarks honestos y tests con tolerancia numérica.",
  learningOutcomes: [
    { text: "Construir y validar ndarrays con dtype y shape correctos" },
    { text: "Indexar y filtrar con máscaras booleanas de forma segura" },
    { text: "Aplicar ufuncs y reducciones por eje para métricas de calidad" },
    { text: "Resolver broadcasting y documentar compatibilidad de shapes" },
    { text: "Distinguir views de copies y controlar mutabilidad" },
    { text: "Manejar NaN/inf y evaluar estabilidad numérica" },
    { text: "Vectorizar frente a loops con benchmark honesto" },
    { text: "Medir memoria y probar equivalencia con tolerancia" },
  ],
  theory: [
    {
      heading: "Mapa de la sección: NumPy para un tablero de calidad",
      paragraphs: [
        "**Diccionario rápido:** **ndarray** (bloque homogéneo), **dtype** (tipo de cada elemento), **shape** (dimensiones), **máscara** (filtro booleano), **ufunc** (operación elemento a elemento), **broadcast** (alinear shapes), **view vs copy** (compartir o no la memoria), **NaN/inf** (ausencia o no-finito — no son ceros de negocio). Tras el dashboard de evidencia de S13 (reglas y scores por caso, sin NumPy), aquí calculas **métricas vectorizadas** sobre lotes sintéticos: pasas de juicios por reglas a **vectores numéricos** para el tablero de calidad del nivel 2 (inicio de **CP-N2-A**).",
        "El hilo conductor es un **tablero de calidad** (completitud, unicidad, rangos, señales por pares) en NumPy. Solo datos sintéticos latam (Lima/Arequipa/Cusco, ids `C00x`). Si el shape o dtype no cumple el contrato de la función, **aserta y falla de forma segura** (fail-closed) — no “arregles” en silencio. Stack: NumPy ndarray/ufunc/broadcast; **sin** pandas (S15) ni sklearn.",
        "Orden: **T1 Arrays** → **T2 Operaciones** → **T3 Semántica** → **T4 Rendimiento**. Criterio de entrega del incremento: métricas vectorizadas equivalentes al baseline en loop dentro de tolerancia (`allclose`). Nunca PII real ni scores tratados como culpa.",
      ],
      callout: {
        type: "info",
        title: "Límite de esta sección",
        content:
          "Solo NumPy sobre datos sintéticos. No uses pandas (S15), sklearn ni PII real. Si el contrato dtype/shape falla, reporta el error; no lo ocultes.",
      },
    },
    {
      heading: "ndarray, dtype y shape",
      subtopicId: "S14-T1-A",
      paragraphs: [
        "Tras S01–S13 trabajaste con listas y dicts de Python. Un **ndarray** es distinto: un bloque contiguo (o strided) de datos **homogéneos** — un solo tipo — que permite ufuncs en código compilado. **dtype** fija ese tipo (`float64`, `int32`, `uint8`); **shape** es la tupla de dimensiones; **ndim** = `len(shape)`; **itemsize** es bytes por elemento. Documentar este cuádruple es el contrato de entrada de toda métrica de CP-N2-A.",
        "Crear con dtype **explícito** evita sorpresas (`int` vs `float` en divisiones, o `object` lento y no vectorizable). Valida `arr.dtype`, `arr.shape` y `arr.ndim` al recibir un array de un pipeline; si no cuadra, `assert` o `ValueError` temprano (falla de forma segura).",
        "En calidad de datos, flags de completitud suelen ser `bool`/`uint8`; scores en [0,1] son `float64`. Caso sintético: `flags` (4,) `uint8` y `scores` (4,) `float64` con `nbytes` documentado en el demo.",
      ],
      code: {
        language: 'python',
        title: "ndarray_basics.py",
        code: `def s14_th_1():
    import numpy as np

    flags = np.array([1, 0, 1, 1], dtype=np.uint8)
    scores = np.array([0.9, 0.4, 0.85, 0.7], dtype=np.float64)
    print("flags", flags.dtype, flags.shape, flags.ndim, flags.itemsize)
    print("scores", scores.dtype, scores.shape, scores.nbytes)

s14_th_1()`,
        output: `flags uint8 (4,) 1 1
scores float64 (4,) 32`,
      },
      callout: {
        type: "tip",
        title: "Documenta el contrato del array",
        content:
          "Cada función que recibe un ndarray debe documentar dtype y shape esperados (o asertarlos).",
      },
    },
    {
      heading: "Creación, indexación y máscaras",
      subtopicId: "S14-T1-B",
      paragraphs: [
        "`np.array`, `arange`, `linspace` y `zeros`/`ones`/`full` crean arrays. **Indexación** clásica (`a[i]`, `a[i:j]`) y **fancy index** (indexación avanzada con lista de enteros, p. ej. `a[[0,2]]`) seleccionan elementos sin loops Python por cliente.",
        "Una **máscara booleana** `a > umbral` produce `bool` del mismo shape; `a[mask]` filtra. Es la forma idiomática de calidad: “clientes sintéticos con score bajo 0.5” o “Lima y score bajo 0.6”. La máscara debe alinear el eje — si no, `ValueError`.",
        "Filtrar con máscara suele devolver **copia** (o 1D nuevo); no asumas view ni mutes el padre por accidente. Caso sintético: `ids[score < 0.5]` → `C002`, `C004` con fancy index de scores en [0,2].",
      ],
      code: {
        language: 'python',
        title: "masks_index.py",
        code: `def s14_th_2():
    import numpy as np

    ids = np.array(["C001", "C002", "C003", "C004"])
    score = np.array([0.9, 0.35, 0.8, 0.2])
    mask = score < 0.5
    print("bajo_score", ids[mask].tolist())
    print("fancy", score[[0, 2]].tolist())
    print("linspace", np.linspace(0, 1, 5).tolist())

s14_th_2()`,
        output: `bajo_score ['C002', 'C004']
fancy [0.9, 0.8]
linspace [0.0, 0.25, 0.5, 0.75, 1.0]`,
      },
      callout: {
        type: "warning",
        title: "Máscaras y longitudes",
        content:
          "La máscara debe tener la misma shape que el eje indexado; de lo contrario ValueError.",
      },
    },
    {
      heading: "Ufuncs y reducciones",
      subtopicId: "S14-T2-A",
      paragraphs: [
        "Las **ufuncs** (`np.add`, `np.sqrt`, operadores `+`, `*`) aplican elemento a elemento en código compilado. Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan uno o más ejes y son el corazón de las métricas de calidad.",
        "`axis=0` agrega por columna (campo); `axis=1` por fila (cliente). `keepdims=True` preserva dimensiones para rebroadcast (restar media por fila sin pelear shapes). Elige el eje con el significado de negocio, no por costumbre.",
        "Métricas: `mean(flags, axis=0)` = completitud por campo; `mean` por fila = completitud del cliente; `std(scores)` = dispersión. **Unicidad** de ids sintéticos: `n_unique / n = np.unique(ids).size / ids.size` (p. ej. ids `C00x` con un duplicado baja la tasa). Caso sintético: matriz 3×3 de presencia → completitud por campo ~[1.0, 0.67, 0.67] y global ~0.78; unicidad de `['C001','C002','C001']` → 2/3.",
      ],
      code: {
        language: 'python',
        title: "ufuncs_reduce.py",
        code: `def s14_th_3():
    import numpy as np

    # filas=clientes, cols=campos presentes (1/0)
    M = np.array([[1, 1, 0], [1, 0, 1], [1, 1, 1]], dtype=float)
    completitud_campo = M.mean(axis=0)
    completitud_fila = M.mean(axis=1, keepdims=True)
    ids = np.array(["C001", "C002", "C001"])
    unicidad = np.unique(ids).size / ids.size
    print("por_campo", completitud_campo.round(3).tolist())
    print("por_fila", completitud_fila.ravel().round(3).tolist())
    print("global", float(M.mean().round(4)))
    print("unicidad", round(unicidad, 4))

s14_th_3()`,
        output: `por_campo [1.0, 0.667, 0.667]
por_fila [0.667, 0.667, 1.0]
global 0.7778
unicidad 0.6667`,
      },
      callout: {
        type: "tip",
        title: "keepdims para rebroadcast",
        content:
          "Usa keepdims cuando vayas a restar/dividir el agregado contra la matriz original.",
      },
    },
    {
      heading: "Broadcasting y compatibilidad de shapes",
      subtopicId: "S14-T2-B",
      paragraphs: [
        "El **broadcasting** alinea shapes de **derecha a izquierda**: dimensiones iguales, o una es 1, o ausente. Si no son compatibles, `ValueError` — mejor un error ruidoso que un producto silencioso mal alineado.",
        "`newaxis` / `None` inserta un eje de tamaño 1 para alinear vectores de filas o columnas (p. ej. pesos por variable o umbral por cliente). Úsalo cuando multipliques scores (n, k) por pesos (k,).",
        "Documenta el shape esperado en el docstring: evita “magia” que rompe con un batch de tamaño distinto. Caso sintético: scores (3,2) × pesos (2,) y un intento (3,2)+(3,3) que debe fallar con mensaje de broadcast.",
      ],
      code: {
        language: 'python',
        title: "broadcast.py",
        code: `def s14_th_4():
    import numpy as np

    scores = np.array([[0.9, 0.8], [0.4, 0.5], [0.7, 0.6]])  # (3,2)
    pesos = np.array([0.6, 0.4])  # (2,)
    ponderado = scores * pesos  # broadcast (3,2)*(2,)
    umbral = np.array([0.5])[:, None]  # (1,1) vía reshape
    print("ponderado", ponderado.round(3).tolist())
    print("sobre_umbral", (scores.mean(axis=1, keepdims=True) > umbral).ravel().tolist())
    try:
        np.ones((3, 2)) + np.ones((3, 3))
    except ValueError as e:
        print("shape_error", str(e)[:40])

s14_th_4()`,
        output: `ponderado [[0.54, 0.32], [0.24, 0.2], [0.42, 0.24]]
sobre_umbral [True, False, True]
shape_error operands could not be broadcast together`,
      },
      callout: {
        type: "warning",
        title: "Broadcast silencioso",
        content:
          "Shapes “casi” compatibles pueden broadcastar mal. Valida shape antes de operar en pipelines.",
      },
    },
    {
      heading: "Views/copies y mutabilidad",
      subtopicId: "S14-T3-A",
      paragraphs: [
        "Un **view** comparte memoria con el base (`arr.base is not None` a menudo); un **copy** es independiente. Slices simples suelen ser views; fancy index y boolean mask suelen copiar. Confundirlos corrompe el raw del pipeline de calidad.",
        "`arr.flags.writeable` controla mutación. Mutar un view muta el original — bug clásico cuando una función “solo normaliza un slice”. Prefiere copiar o pasar `writeable=False` en entradas de solo lectura.",
        "Usa `.copy()` al aislar transformaciones (normalizar scores sin tocar el raw de auditoría). Caso sintético: `raw[:2][0]=99` altera raw; la misma operación sobre `.copy()` no.",
      ],
      code: {
        language: 'python',
        title: "views_copies.py",
        code: `def s14_th_5():
    import numpy as np

    raw = np.array([10.0, 20.0, 30.0])
    vista = raw[:2]
    vista[0] = 99.0
    print("raw_tras_view", raw.tolist())
    raw2 = np.array([10.0, 20.0, 30.0])
    copia = raw2[:2].copy()
    copia[0] = 99.0
    print("raw_tras_copy", raw2.tolist())
    print("vista_base_is_raw", vista.base is raw)

s14_th_5()`,
        output: `raw_tras_view [99.0, 20.0, 30.0]
raw_tras_copy [10.0, 20.0, 30.0]
vista_base_is_raw True`,
      },
      callout: {
        type: "danger",
        title: "Side effects por view",
        content:
          "Si pasas un slice a una función que escribe, puede corromper el array padre. Copia o marca writeable=False.",
      },
    },
    {
      heading: "NaN, inf y estabilidad numérica",
      subtopicId: "S14-T3-B",
      paragraphs: [
        "`np.nan` y `±inf` rompen `mean`/`sum` clásicos (NaN contagia; inf domina). Usa `np.isnan`/`isinf`/`isfinite`, `nansum`/`nanmean`, o máscaras explícitas antes de publicar una métrica de negocio.",
        "`np.finfo(float).eps` acota ruido de redondeo al comparar con tolerancia. Overflow en float produce `inf`; no lo trates como un score válido de calidad. Fail-closed: si el batch trae inf donde no es semántico, rechaza o filtra con traza.",
        "En calidad, un NaN **no es cero**: es **ausencia**. Reporta tasa de no-finitos aparte de la media de finitos. Caso sintético: array con nan e inf → `finite_mean` solo sobre `isfinite`, `nansum` sin inf.",
      ],
      code: {
        language: 'python',
        title: "nan_inf.py",
        code: `def s14_th_6():
    import numpy as np

    x = np.array([1.0, np.nan, 3.0, np.inf])
    print("isnan", np.isnan(x).tolist())
    print("isinf", np.isinf(x).tolist())
    finite = x[np.isfinite(x)]
    print("finite_mean", float(np.mean(finite)))
    print("nansum_sin_inf", float(np.nansum(np.where(np.isinf(x), np.nan, x))))
    print("eps", float(np.finfo(float).eps))

s14_th_6()`,
        output: `isnan [False, True, False, False]
isinf [False, False, False, True]
finite_mean 2.0
nansum_sin_inf 4.0
eps 2.220446049250313e-16`,
      },
      callout: {
        type: "tip",
        title: "isfinite primero",
        content:
          "Filtra con np.isfinite antes de reducciones de negocio si inf no es un valor válido.",
      },
    },
    {
      heading: "Vectorización frente a loops",
      subtopicId: "S14-T4-A",
      paragraphs: [
        "Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado (`dot`, ufuncs). Para N grande (decenas de miles de clientes sintéticos), el ratio suele ser de órdenes de magnitud — el número exacto **depende de tu máquina**.",
        "Benchmark **honesto**: mismo input, mismo dtype, `time.perf_counter`, reporta `ratio_loop_over_vec` y verifica **equivalencia numérica** (`abs(s_loop-s_vec) < 1e-6`). No compares N=10 ni omitas el check de igualdad.",
        "A veces un loop claro gana en N pequeño o lógica irregular (early-exit). Documenta el umbral de N en el memo del portfolio. Caso sintético: `n=50_000` dot product loop vs `np.dot` con `equal True` y `ratio > 1` en una laptop típica.",
      ],
      code: {
        language: 'python',
        title: "vec_vs_loop.py",
        code: `def s14_th_7():
    import numpy as np
    import time

    n = 50_000
    a = np.arange(n, dtype=float)
    b = np.arange(n, dtype=float)

    t0 = time.perf_counter()
    s_loop = 0.0
    for i in range(n):
        s_loop += a[i] * b[i]
    t_loop = time.perf_counter() - t0

    t1 = time.perf_counter()
    s_vec = float(np.dot(a, b))
    t_vec = time.perf_counter() - t1
    print("equal", abs(s_loop - s_vec) < 1e-6)
    ratio = t_loop / max(t_vec, 1e-12)
    print("ratio_gt_1", ratio > 1.0)

s14_th_7()`,
        output: `equal True
ratio_gt_1 True`,
      },
      callout: {
        type: "info",
        title: "Benchmark honesto",
        content:
          "Reporta N, dtype y máquina. Un ratio en laptop no es SLA de producción; el valor exacto varía entre equipos.",
      },
    },
    {
      heading: "Memoria, medición y tests con tolerancia",
      subtopicId: "S14-T4-B",
      paragraphs: [
        "`nbytes` y `itemsize * size` estiman memoria del array. Evita copias innecesarias en datasets grandes del tablero de calidad: cada `.copy()` duplica RAM del batch.",
        "`np.allclose(a, b, rtol=, atol=)` compara floats con tolerancia. `np.testing.assert_allclose` falla con mensaje claro — úsalo en tests del portfolio CP-N2-A. `rtol` escala con la magnitud; `atol` cubre cercanos a cero.",
        "El baseline loop y la versión vectorizada deben ser **equivalentes dentro de rtol/atol**. Caso sintético: `base` vs `base+1e-9` pasa `allclose`; `base+0.1` debe disparar `AssertionError` en el assert estricto.",
      ],
      code: {
        language: 'python',
        title: "allclose_mem.py",
        code: `def s14_th_8():
    import numpy as np

    base = np.array([1.0, 2.0, 3.0])
    approx = base + 1e-9
    print("nbytes", base.nbytes)
    print("allclose", np.allclose(base, approx, rtol=1e-7, atol=1e-9))
    try:
        np.testing.assert_allclose(base, base + 0.1, atol=1e-6)
    except AssertionError as e:
        print("assert_fail", "not close" in str(e).lower() or True)

s14_th_8()`,
        output: `nbytes 24
allclose True
assert_fail True`,
      },
      callout: {
        type: "tip",
        title: "rtol vs atol",
        content:
          "rtol escala con la magnitud; atol cubre cercanos a cero. Elige según la métrica de negocio.",
      },
    },
  ],
  iDo: {
    intro: "Observa 8 demos: contrato dtype/shape, máscaras, reducciones, broadcast, views/copies, NaN/inf, benchmark y allclose/memoria. Datos sintéticos; español peruano.",
    steps: [
      {
        demoId: "S14-T1-A-DEMO",
        subtopicId: "S14-T1-A",
        environment: "local-python",
        description: "Crear arrays de flags y scores con dtype/shape documentados y validar ndim",
        code: {
          language: 'python',
          title: "demo_ndarray.py",
          code: `import numpy as np

def make_quality_arrays(n_clients=4):
    flags = np.ones((n_clients, 3), dtype=np.uint8)  # 3 campos obligatorios
    flags[1, 2] = 0
    scores = np.array([0.92, 0.41, 0.78, 0.65], dtype=np.float64)
    assert flags.ndim == 2 and flags.shape == (n_clients, 3)
    assert scores.ndim == 1 and scores.dtype == np.float64
    return flags, scores

f, s = make_quality_arrays()
print("flags_shape", f.shape, "dtype", f.dtype, "itemsize", f.itemsize)
print("scores_shape", s.shape, "nbytes", s.nbytes)`,
          output: `flags_shape (4, 3) dtype uint8 itemsize 1
scores_shape (4,) nbytes 32`,
        },
        why: "Fija el contrato dtype/shape antes de calcular métricas de calidad.",
      },
      {
        demoId: "S14-T1-B-DEMO",
        subtopicId: "S14-T1-B",
        environment: "local-python",
        description: "Indexar y filtrar clientes sintéticos con máscara booleana",
        code: {
          language: 'python',
          title: "demo_masks.py",
          code: `def s14_ido_2():
    import numpy as np

    ids = np.array(["C001", "C002", "C003", "C004", "C005"])
    region = np.array(["Lima", "Arequipa", "Lima", "Cusco", "Lima"])
    score = np.array([0.9, 0.3, 0.55, 0.8, 0.2])
    mask = (region == "Lima") & (score < 0.6)
    print("filtrados", ids[mask].tolist())
    print("count", int(mask.sum()))

s14_ido_2()`,
          output: `filtrados ['C003', 'C005']
count 2`,
        },
        why: "Máscaras combinadas expresan reglas de calidad sin loops.",
      },
      {
        demoId: "S14-T2-A-DEMO",
        subtopicId: "S14-T2-A",
        environment: "local-python",
        description: "Reducir métricas de completitud y unicidad por campo/cliente con ufuncs",
        code: {
          language: 'python',
          title: "demo_reductions.py",
          code: `def s14_ido_3():
    import numpy as np

    # 1 = presente, 0 = ausente
    M = np.array([
        [1, 1, 1, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 1, 1],
    ], dtype=float)
    ids = np.array(["C001", "C002", "C001", "C003"])  # un duplicado sintético
    por_campo = M.mean(axis=0)
    por_cliente = M.mean(axis=1)
    unicidad = np.unique(ids).size / ids.size
    print("completitud_campo", np.round(por_campo, 3).tolist())
    print("completitud_cliente", np.round(por_cliente, 3).tolist())
    print("std_campos", float(np.round(por_campo.std(), 4)))
    print("unicidad", round(unicidad, 4))

s14_ido_3()`,
          output: `completitud_campo [1.0, 0.75, 0.75, 0.5]
completitud_cliente [0.75, 0.75, 0.5, 1.0]
std_campos 0.1768
unicidad 0.75`,
        },
        why: "Reducciones por eje y unicidad con np.unique son el núcleo del tablero de calidad vectorizado.",
      },
      {
        demoId: "S14-T2-B-DEMO",
        subtopicId: "S14-T2-B",
        environment: "local-python",
        description: "Alinear scores de clientes con pesos de campos vía broadcast explícito",
        code: {
          language: 'python',
          title: "demo_broadcast.py",
          code: `def s14_ido_4():
    import numpy as np

    scores = np.array([  # clientes x dimensiones de calidad
        [0.9, 0.8, 0.7],
        [0.4, 0.5, 0.6],
        [0.85, 0.9, 0.75],
    ])
    pesos = np.array([0.5, 0.3, 0.2])  # (3,)
    assert scores.shape[1] == pesos.shape[0]
    weighted = scores * pesos  # (3,3)*(3,)
    agg = weighted.sum(axis=1)
    print("agg", np.round(agg, 4).tolist())
    # señales por pares: diferencia de agg vía newaxis
    diff = agg[:, None] - agg[None, :]
    print("diff_shape", diff.shape)
    print("diff_00", float(diff[0, 0]))

s14_ido_4()`,
          output: `agg [0.83, 0.47, 0.845]
diff_shape (3, 3)
diff_00 0.0`,
        },
        why: "Broadcast documentado evita ValueError y fan-out silencioso de shapes.",
      },
      {
        demoId: "S14-T3-A-DEMO",
        subtopicId: "S14-T3-A",
        environment: "local-python",
        description: "Demostrar mutación vía view y aislar normalización con copy",
        code: {
          language: 'python',
          title: "demo_views.py",
          code: `def s14_ido_5():
    import numpy as np

    raw = np.array([100.0, 200.0, 50.0, 150.0])
    # mal: normalizar en view
    v = raw[:]
    v /= v.max()
    print("raw_corrupto", np.round(raw, 3).tolist())

    raw = np.array([100.0, 200.0, 50.0, 150.0])
    norm = raw.copy()
    norm /= norm.max()
    print("raw_ok", raw.tolist())
    print("norm", np.round(norm, 3).tolist())

s14_ido_5()`,
          output: `raw_corrupto [0.5, 1.0, 0.25, 0.75]
raw_ok [100.0, 200.0, 50.0, 150.0]
norm [0.5, 1.0, 0.25, 0.75]`,
        },
        why: "Copia antes de mutar cuando el raw alimenta auditoría o reprocess.",
      },
      {
        demoId: "S14-T3-B-DEMO",
        subtopicId: "S14-T3-B",
        environment: "local-python",
        description: "Calcular media robusta de scores ignorando NaN/inf documentados",
        code: {
          language: 'python',
          title: "demo_nan.py",
          code: `def s14_ido_6():
    import numpy as np

    scores = np.array([0.9, np.nan, 0.7, np.inf, 0.4, 0.85])
    valid = scores[np.isfinite(scores)]
    print("n_valid", valid.size, "de", scores.size)
    print("mean_robusta", float(np.round(valid.mean(), 4)))
    print("nanmean_solo_nan", float(np.round(np.nanmean(np.where(np.isinf(scores), np.nan, scores)), 4)))

s14_ido_6()`,
          output: `n_valid 4 de 6
mean_robusta 0.7125
nanmean_solo_nan 0.7125`,
        },
        why: "Métricas de calidad deben declarar política ante NaN/inf.",
      },
      {
        demoId: "S14-T4-A-DEMO",
        subtopicId: "S14-T4-A",
        environment: "local-python",
        description: "Comparar loop vs vectorizado para score ponderado con timing honesto",
        code: {
          language: 'python',
          title: "demo_bench.py",
          code: `def s14_ido_7():
    import numpy as np
    import time

    rng = np.random.default_rng(42)
    n, k = 20_000, 5
    X = rng.random((n, k))
    w = rng.random(k)
    w = w / w.sum()

    t0 = time.perf_counter()
    out_loop = np.empty(n)
    for i in range(n):
        s = 0.0
        for j in range(k):
            s += X[i, j] * w[j]
        out_loop[i] = s
    t_loop = time.perf_counter() - t0

    t1 = time.perf_counter()
    out_vec = X @ w
    t_vec = time.perf_counter() - t1
    print("allclose", np.allclose(out_loop, out_vec))
    ratio = t_loop / max(t_vec, 1e-12)
    print("ratio_gt_1", ratio > 1.0)

s14_ido_7()`,
          output: `allclose True
ratio_gt_1 True`,
        },
        why: "Equivalencia + ratio de tiempo (el número exacto depende de la máquina) justifican la vectorización en el portfolio.",
      },
      {
        demoId: "S14-T4-B-DEMO",
        subtopicId: "S14-T4-B",
        environment: "local-python",
        description: "Test con np.allclose y presupuesto de memoria para matriz de señales",
        code: {
          language: 'python',
          title: "demo_tol.py",
          code: `def s14_ido_8():
    import numpy as np

    n = 500
    base = np.linspace(0, 1, n)
    vec = base * 0.5 + 0.1
    # simula error numérico leve
    vec_approx = vec + 1e-10
    budget = 8 * n * n  # float64 de matriz n x n
    pair = base[:, None] - base[None, :]
    print("pair_nbytes", pair.nbytes, "budget_ok", pair.nbytes <= budget)
    print("allclose", np.allclose(vec, vec_approx, rtol=1e-8, atol=1e-12))
    np.testing.assert_allclose(vec, vec_approx, rtol=1e-8, atol=1e-12)
    print("assert_ok", True)

s14_ido_8()`,
          output: `pair_nbytes 2000000 budget_ok True
allclose True
assert_ok True`,
        },
        why: "Presupuesto de memoria + allclose cierran el incremento S14 de CP-N2-A.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios E1/E2/E3 (guiado/independiente/transfer) por los 8 subtemas de NumPy. Dos pistas cada uno. Ejecuta y compara la salida.",
    steps: [
      {
        id: "S14-T1-A-E1",
        subtopicId: "S14-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Crea un ndarray `flags` de shape `(3, 2)`, dtype `uint8`, con valores `[[1,0],[1,1],[0,1]]` e imprime `dtype`, `shape` y `ndim`. Salida esperada: `uint8 (3, 2) 2`. Solo NumPy; corrige el bug del starter (shape invertida).",
        hint: "Usa np.array(..., dtype=np.uint8).",
        hints: [
          "Usa np.array(..., dtype=np.uint8).",
          "Imprime tres atributos: dtype, shape, ndim.",
        ],
        edgeCases: ["dtype incorrecto (int64 por defecto)", "shape transpuesta"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · ndarray meta
# Bug a corregir: imprime shape invertida y dtype wrong
import numpy as np
flags = np.array([[1, 0], [1, 1], [0, 1]], dtype=np.uint8)
print(flags.dtype, flags.shape[::-1], flags.ndim)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
flags = np.array([[1, 0], [1, 1], [0, 1]], dtype=np.uint8)
print(flags.dtype, flags.shape, flags.ndim)`,
          output: `uint8 (3, 2) 2`,
        },
      },
      {
        id: "S14-T1-A-E2",
        subtopicId: "S14-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Construye `scores = np.linspace(0, 1, 5, dtype=np.float64)` e imprime `itemsize`, `nbytes` y la lista de valores. Salida esperada: `8 40 [0.0, 0.25, 0.5, 0.75, 1.0]`. Solo NumPy; corrige el bug del starter (`arange` en lugar de `linspace`).",
        hint: "linspace con dtype=float64.",
        hints: [
          "linspace con dtype=float64.",
          "nbytes = size * itemsize.",
        ],
        edgeCases: ["float32 por accidente", "endpoint de linspace"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · linspace nbytes
# Bug a corregir: arange no linspace; no imprime itemsize
import numpy as np
scores = np.arange(5, dtype=np.float64)
print(scores.tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
scores = np.linspace(0, 1, 5, dtype=np.float64)
print(scores.itemsize, scores.nbytes, scores.tolist())`,
          output: `8 40 [0.0, 0.25, 0.5, 0.75, 1.0]`,
        },
      },
      {
        id: "S14-T1-A-E3",
        subtopicId: "S14-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Valida un contrato: si un array no es 1D float64, lanza `ValueError`; si es válido imprime `ok` y el size. Caso inválido: `np.array([1, 2])` (1D pero no float64). Salida esperada: `ok 2` y `err expected 1d float64`. Solo NumPy; corrige el bug del starter.",
        hint: "Comprueba ndim y dtype.",
        hints: [
          "Comprueba ndim y dtype.",
          "raise ValueError con mensaje corto.",
        ],
        edgeCases: ["aceptar int64", "no validar ndim"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · validate 1d float64
# Bug a corregir: no valida ndim/dtype
import numpy as np

def validate(a):
    print("ok", a.size)

validate(np.array([0.1, 0.2], dtype=np.float64))
try:
    validate(np.array([1, 2]))  # 1D pero no float64
except ValueError as e:
    print("err", e)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np

def validate(a):
    if a.ndim != 1 or a.dtype != np.float64:
        raise ValueError("expected 1d float64")
    print("ok", a.size)

validate(np.array([0.1, 0.2], dtype=np.float64))
try:
    validate(np.array([1, 2]))
except ValueError as e:
    print("err", e)`,
          output: `ok 2
err expected 1d float64`,
        },
      },
      {
        id: "S14-T1-B-E1",
        subtopicId: "S14-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Dado `score = [0.2, 0.8, 0.4, 0.9]`, imprime los índices (0-based) donde `score >= 0.5` con máscara y `np.where`. Salida esperada: `[1, 3]`. Solo NumPy; corrige el bug del starter (umbral invertido).",
        hint: "mask = score >= 0.5.",
        hints: [
          "mask = score >= 0.5.",
          "np.where(mask)[0].",
        ],
        edgeCases: ["comparación estricta >", "olvidar [0] en where"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · boolean mask where
# Bug a corregir: threshold invertido < 0.5
import numpy as np
score = np.array([0.2, 0.8, 0.4, 0.9])
idx = np.where(score < 0.5)[0]
print(idx.tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
score = np.array([0.2, 0.8, 0.4, 0.9])
idx = np.where(score >= 0.5)[0]
print(idx.tolist())`,
          output: `[1, 3]`,
        },
      },
      {
        id: "S14-T1-B-E2",
        subtopicId: "S14-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Con ids `C001..C004` y sus scores, imprime los ids con score bajo la mediana (`score < mediana`). Salida esperada: `['C001', 'C003']`. Solo NumPy; corrige el bug del starter (máscara invertida).",
        hint: "np.median(scores).",
        hints: [
          "np.median(scores).",
          "ids[scores < med].",
        ],
        edgeCases: ["usar mean en vez de median", "máscara invertida"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · mask by median
# Bug a corregir: scores > med (debería < med)
import numpy as np
ids = np.array(["C001", "C002", "C003", "C004"])
scores = np.array([0.1, 0.9, 0.4, 0.7])
med = np.median(scores)
print(ids[scores > med].tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
ids = np.array(["C001", "C002", "C003", "C004"])
scores = np.array([0.1, 0.9, 0.4, 0.7])
med = np.median(scores)
print(ids[scores < med].tolist())`,
          output: `['C001', 'C003']`,
        },
      },
      {
        id: "S14-T1-B-E3",
        subtopicId: "S14-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Fancy index: reordena el vector `[10, 20, 30, 40]` con el orden de índices `[2, 0, 3, 1]` e imprime el resultado. Salida esperada: `[30, 10, 40, 20]`. Solo NumPy; sin loops; corrige el bug del starter.",
        hint: "a[order] con lista de índices.",
        hints: [
          "a[order] con lista de índices.",
          "No uses un loop.",
        ],
        edgeCases: ["argsort confuso", "copia accidental del orden"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · fancy index order
# Bug a corregir: order mal aplicado (sorted order)
import numpy as np
a = np.array([10, 20, 30, 40])
order = [2, 0, 3, 1]
print(sorted(a.tolist()))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
a = np.array([10, 20, 30, 40])
order = [2, 0, 3, 1]
print(a[order].tolist())`,
          output: `[30, 10, 40, 20]`,
        },
      },
      {
        id: "S14-T2-A-E1",
        subtopicId: "S14-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Matriz 2×3 de unos y ceros: calcula `mean` por `axis=0` y por `axis=1`; imprime ambas listas redondeadas a 2 decimales (primero columnas, luego filas). Salida esperada: `[1.0, 0.5, 0.5]` y `[0.67, 0.67]`. Solo NumPy; corrige el bug del starter.",
        hint: "M.mean(axis=0) y axis=1.",
        hints: [
          "M.mean(axis=0) y axis=1.",
          "np.round(..., 2).tolist().",
        ],
        edgeCases: ["axis invertido", "no redondear"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · mean axis
# Bug a corregir: axis confuso; no redondea
import numpy as np
M = np.array([[1., 0., 1.], [1., 1., 0.]])
print(M.mean(axis=1).tolist())
print(M.mean(axis=0).tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
M = np.array([[1., 0., 1.], [1., 1., 0.]])
print(np.round(M.mean(axis=0), 2).tolist())
print(np.round(M.mean(axis=1), 2).tolist())`,
          output: `[1.0, 0.5, 0.5]
[0.67, 0.67]`,
        },
      },
      {
        id: "S14-T2-A-E2",
        subtopicId: "S14-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Con ids sintéticos `['C001','C002','C001','C003','C002']`, calcula la **tasa de unicidad** `np.unique(ids).size / ids.size` e imprímela con 4 decimales. Salida esperada: `0.6`. Solo NumPy; corrige el bug del starter (usa `len` sobre el array crudo y no `unique`).",
        hint: "n_unique = np.unique(ids).size; tasa = n_unique / ids.size.",
        hints: [
          "n_unique = np.unique(ids).size; tasa = n_unique / ids.size.",
          "Redondea con round(..., 4) o imprime el float exacto 0.6.",
        ],
        edgeCases: ["contar con set de Python en vez de np.unique", "dividir por n_unique"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · unicidad de ids
# Bug a corregir: usa len(ids) como si todos fueran únicos
import numpy as np
ids = np.array(["C001", "C002", "C001", "C003", "C002"])
unicidad = len(ids) / len(ids)  # siempre 1.0 — incorrecto
print(round(unicidad, 4))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
ids = np.array(["C001", "C002", "C001", "C003", "C002"])
unicidad = np.unique(ids).size / ids.size
print(round(unicidad, 4))`,
          output: `0.6`,
        },
      },
      {
        id: "S14-T2-A-E3",
        subtopicId: "S14-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Centra cada fila restando su media con `keepdims=True` e imprime la media de cada fila tras centrar (debe ser ~0). Salida esperada: `[0.0, 0.0, 0.0]`. Solo NumPy; corrige el bug del starter (centra por columnas).",
        hint: "row - row.mean(axis=1, keepdims=True).",
        hints: [
          "row - row.mean(axis=1, keepdims=True).",
          "Verifica con mean axis=1 redondeado.",
        ],
        edgeCases: ["olvidar keepdims", "axis=0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · center rows
# Bug a corregir: center por columnas (axis=0)
import numpy as np
X = np.array([[1., 3.], [10., 20.], [2., 2.]])
Xc = X - X.mean(axis=0, keepdims=True)
print(np.round(Xc.mean(axis=0), 10).tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
X = np.array([[1., 3.], [10., 20.], [2., 2.]])
Xc = X - X.mean(axis=1, keepdims=True)
print(np.round(Xc.mean(axis=1), 10).tolist())`,
          output: `[0.0, 0.0, 0.0]`,
        },
      },
      {
        id: "S14-T2-B-E1",
        subtopicId: "S14-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Suma el vector de pesos `[1, 2, 3]` a cada fila de una matriz 2×3 de ceros con broadcast e imprime la matriz. Salida esperada: `[[1.0, 2.0, 3.0], [1.0, 2.0, 3.0]]`. Solo NumPy; corrige el bug del starter (multiplica en vez de sumar).",
        hint: "zeros + pesos (shape (3,)).",
        hints: [
          "zeros + pesos (shape (3,)).",
          "Broadcast alinea por la derecha.",
        ],
        edgeCases: ["shape (2,) incompatible", "usar loop"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · broadcast add
# Bug a corregir: multiplica en vez de sumar
import numpy as np
M = np.zeros((2, 3))
w = np.array([1., 2., 3.])
print((M * w).tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
M = np.zeros((2, 3))
w = np.array([1., 2., 3.])
print((M + w).tolist())`,
          output: `[[1.0, 2.0, 3.0], [1.0, 2.0, 3.0]]`,
        },
      },
      {
        id: "S14-T2-B-E2",
        subtopicId: "S14-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Con `a` de shape `(4,)` crea columna `(4, 1)` con `newaxis` y multiplica por `b` de shape `(3,)`; imprime shape y valores del producto. Salida esperada: `(4, 3) [[0, 0, 0], [0, 1, 2], [0, 2, 4], [0, 3, 6]]`. Solo NumPy; no pandas (S15) ni sklearn.",
        hint: "a[:, None] * b[None, :] o a[:, None] * b.",
        hints: [
          "a[:, None] * b[None, :] o a[:, None] * b.",
          "Resultado (4,3).",
        ],
        edgeCases: ["broadcast a (3,4)", "outer manual incorrecto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · outer product broadcast
# Bug a corregir: a * b sin reshape (falla o wrong)
import numpy as np
a = np.arange(4)
b = np.arange(3)
try:
    out = a * b
    print(out.shape, out.tolist())
except ValueError:
    print("fail")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
a = np.arange(4)
b = np.arange(3)
out = a[:, None] * b[None, :]
print(out.shape, out.tolist())`,
          output: `(4, 3) [[0, 0, 0], [0, 1, 2], [0, 2, 4], [0, 3, 6]]`,
        },
      },
      {
        id: "S14-T2-B-E3",
        subtopicId: "S14-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Detecta incompatibilidad de broadcast: intenta sumar shapes `(2, 3)` y `(2, 4)`, captura `ValueError` e imprime `incompatible`. Salida esperada: `incompatible`. Solo NumPy; corrige el bug del starter (shapes compatibles).",
        hint: "try/except ValueError.",
        hints: [
          "try/except ValueError.",
          "No uses shapes compatibles.",
        ],
        edgeCases: ["no capturar excepción", "shapes que sí broadcastan"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · incompatible broadcast
# Bug a corregir: no captura ValueError
import numpy as np
print(np.ones((2, 3)) + np.ones((2, 3)))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
try:
    np.ones((2, 3)) + np.ones((2, 4))
except ValueError:
    print("incompatible")`,
          output: `incompatible`,
        },
      },
      {
        id: "S14-T3-A-E1",
        subtopicId: "S14-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Con `raw=[1,2,3]`, crea una **view** de los dos primeros elementos, asigna `vista[0]=9` e imprime `raw` (debe mutar). Salida esperada: `[9, 2, 3]`. Solo NumPy; corrige el bug del starter (usa `.copy()` y oculta el efecto).",
        hint: "raw[:2] es view.",
        hints: [
          "raw[:2] es view.",
          "Mutar vista muta raw.",
        ],
        edgeCases: ["usar copy por error", "fancy index copia"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · view mutates
# Bug a corregir: copy() silencia el bug de view
import numpy as np
raw = np.array([1, 2, 3])
v = raw[:2].copy()
v[0] = 9
print(raw.tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
raw = np.array([1, 2, 3])
v = raw[:2]
v[0] = 9
print(raw.tolist())`,
          output: `[9, 2, 3]`,
        },
      },
      {
        id: "S14-T3-A-E2",
        subtopicId: "S14-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Repite el escenario con `.copy()`: muta la copia y demuestra que `raw` queda `[1, 2, 3]`. Salida esperada: `[1, 2, 3] [9, 2]`. Solo NumPy; corrige el bug del starter (view sin copy).",
        hint: "raw[:2].copy().",
        hints: [
          "raw[:2].copy().",
          "Imprime raw y copia.",
        ],
        edgeCases: ["olvidar copy", "slice que no es view en todos backends"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · copy isolation
# Bug a corregir: view sin copy; raw muta
import numpy as np
raw = np.array([1, 2, 3])
c = raw[:2]
c[0] = 9
print(raw.tolist(), c.tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
raw = np.array([1, 2, 3])
c = raw[:2].copy()
c[0] = 9
print(raw.tolist(), c.tolist())`,
          output: `[1, 2, 3] [9, 2]`,
        },
      },
      {
        id: "S14-T3-A-E3",
        subtopicId: "S14-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Marca un array como no escribible (`flags.writeable=False`), intenta asignar y captura `ValueError` imprimiendo `blocked`. Salida esperada: `blocked`. Solo NumPy; corrige el bug del starter.",
        hint: "a.flags.writeable = False.",
        hints: [
          "a.flags.writeable = False.",
          "Asignar a[0] debe fallar.",
        ],
        edgeCases: ["no desactivar writeable", "capturar Exception genérica sin print"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · writeable False
# Bug a corregir: no set writeable; muta
import numpy as np
a = np.array([1.0, 2.0])
a[0] = 3.0
print(a.tolist())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
a = np.array([1.0, 2.0])
a.flags.writeable = False
try:
    a[0] = 3.0
except ValueError:
    print("blocked")`,
          output: `blocked`,
        },
      },
      {
        id: "S14-T3-B-E1",
        subtopicId: "S14-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Cuenta cuántos `NaN` hay en `[1, nan, 2, nan]` con `np.isnan` e imprime el entero. Salida esperada: `2`. Solo NumPy; no uses `x == np.nan` (siempre False).",
        hint: "np.isnan(x).sum().",
        hints: [
          "np.isnan(x).sum().",
          "Imprime int.",
        ],
        edgeCases: ["usar x == np.nan (siempre False)", "contar inf"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · count nan
# Bug a corregir: usa sum de nan == nan (wrong)
import numpy as np
x = np.array([1.0, np.nan, 2.0, np.nan])
print(int((x == np.nan).sum()))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([1.0, np.nan, 2.0, np.nan])
print(int(np.isnan(x).sum()))`,
          output: `2`,
        },
      },
      {
        id: "S14-T3-B-E2",
        subtopicId: "S14-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Calcula `np.nanmean` de `[1, nan, 3]` e imprime con 2 decimales. Salida esperada: `2.0`. Solo NumPy; corrige el bug del starter (`mean` propaga nan).",
        hint: "np.nanmean.",
        hints: [
          "np.nanmean.",
          "Resultado 2.0.",
        ],
        edgeCases: ["mean normal da nan", "redondeo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · nanmean
# Bug a corregir: mean propaga nan
import numpy as np
x = np.array([1.0, np.nan, 3.0])
print(float(np.mean(x)))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([1.0, np.nan, 3.0])
print(round(float(np.nanmean(x)), 2))`,
          output: `2.0`,
        },
      },
      {
        id: "S14-T3-B-E3",
        subtopicId: "S14-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — En `[1, inf, 2]`, reemplaza `inf` por `nan` y luego usa `nansum`; imprime el resultado. Salida esperada: `3.0`. Solo NumPy; corrige el bug del starter (suma con inf).",
        hint: "np.where(np.isinf(x), np.nan, x).",
        hints: [
          "np.where(np.isinf(x), np.nan, x).",
          "nansum ignora nan.",
        ],
        edgeCases: ["sum con inf da inf", "no convertir inf"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · inf → nan then nansum
# Bug a corregir: suma con inf
import numpy as np
x = np.array([1.0, np.inf, 2.0])
print(float(np.sum(x)))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([1.0, np.inf, 2.0])
y = np.where(np.isinf(x), np.nan, x)
print(float(np.nansum(y)))`,
          output: `3.0`,
        },
      },
      {
        id: "S14-T4-A-E1",
        subtopicId: "S14-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Suma `a*b` con un loop y con `(a*b).sum()` para `a=b=arange(1000)`; imprime si `abs(diff) < 1e-6`. Salida esperada: `True`. Solo NumPy; el starter imprime `False` sin comparar — corrígelo.",
        hint: "np.arange(1000, dtype=float).",
        hints: [
          "np.arange(1000, dtype=float).",
          "Compara resultados no tiempos.",
        ],
        edgeCases: ["int overflow en loop", "comparar identidades"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · vectorized vs loop
# Bug a corregir: no compara; imprime False
import numpy as np
a = np.arange(1000, dtype=float)
b = a.copy()
s1 = float((a * b).sum())
print(False)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
a = np.arange(1000, dtype=float)
b = a.copy()
s1 = 0.0
for i in range(len(a)):
    s1 += a[i] * b[i]
s2 = float((a * b).sum())
print(abs(s1 - s2) < 1e-6)`,
          output: `True`,
        },
      },
      {
        id: "S14-T4-A-E2",
        subtopicId: "S14-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Implementa la suma de cuadrados vectorizada de `arange(5)` e imprime el total. Salida esperada: `30.0`. Solo NumPy; corrige el bug del starter (suma lineal en vez de cuadrados).",
        hint: "(a**2).sum() o np.dot(a,a).",
        hints: [
          "(a**2).sum() o np.dot(a,a).",
          "Resultado 0+1+4+9+16=30.",
        ],
        edgeCases: ["olvidar dtype float", "sumar a no a**2"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · sum squares
# Bug a corregir: suma lineal no cuadrados
import numpy as np
a = np.arange(5, dtype=float)
print(float(a.sum()))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
a = np.arange(5, dtype=float)
print(float((a ** 2).sum()))`,
          output: `30.0`,
        },
      },
      {
        id: "S14-T4-A-E3",
        subtopicId: "S14-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Mide con `time.perf_counter` un `(a+b)` vectorizado de `n=10000` (a=ceros, b=unos) e imprime `timed` junto a si la media del resultado es `1.0`. Salida esperada: `timed True`. Solo NumPy; corrige el bug del starter (loop sin check de mean).",
        hint: "time.perf_counter antes/después.",
        hints: [
          "time.perf_counter antes/después.",
          "No necesitas ratio; solo demostrar timing + correctness.",
        ],
        edgeCases: ["no crear arrays", "mean != 1"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · timed vector add
# Bug a corregir: loop lento sin mean check
import numpy as np, time
n = 10000
a = np.zeros(n)
b = np.ones(n)
c = np.empty(n)
for i in range(n):
    c[i] = a[i] + b[i]
print("timed", float(c[0]) == 1.0)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np, time
n = 10000
a = np.zeros(n)
b = np.ones(n)
t0 = time.perf_counter()
c = a + b
_ = time.perf_counter() - t0
print("timed", float(c.mean()) == 1.0)`,
          output: `timed True`,
        },
      },
      {
        id: "S14-T4-B-E1",
        subtopicId: "S14-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Imprime `nbytes` de `np.zeros(1000, dtype=np.float64)` y verifica que sea `8000`. Salida esperada: `8000 True`. Solo NumPy; corrige el bug del starter (compara con 4000 como si fuera float32).",
        hint: "float64 = 8 bytes.",
        hints: [
          "float64 = 8 bytes.",
          "print nbytes y comparación.",
        ],
        edgeCases: ["float32", "shape 2d"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · nbytes float64
# Bug a corregir: compara nbytes con 4000 (como si fuera float32)
import numpy as np
a = np.zeros(1000, dtype=np.float64)
print(a.nbytes, a.nbytes == 4000)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
a = np.zeros(1000, dtype=np.float64)
print(a.nbytes, a.nbytes == 8000)`,
          output: `8000 True`,
        },
      },
      {
        id: "S14-T4-B-E2",
        subtopicId: "S14-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Usa `np.allclose` entre `[1.0, 2.0]` y `[1.0+1e-9, 2.0]` con `atol=1e-8` e imprime el booleano. Salida esperada: `True`. Solo NumPy; corrige el bug del starter (la comparación exacta con `==` no sirve para floats).",
        hint: "np.allclose(..., atol=1e-8).",
        hints: [
          "np.allclose(..., atol=1e-8).",
          "Debe ser True.",
        ],
        edgeCases: ["atol demasiado estricto", "listas sin numpy"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · allclose con atol
# Bug a corregir: comparación exacta (==) en floats
import numpy as np
a = np.array([1.0, 2.0])
b = np.array([1.0 + 1e-9, 2.0])
print(a == b)  # comparación exacta: incorrecta para floats
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
print(np.allclose([1.0, 2.0], [1.0 + 1e-9, 2.0], atol=1e-8))`,
          output: `True`,
        },
      },
      {
        id: "S14-T4-B-E3",
        subtopicId: "S14-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — `assert_allclose` debe fallar entre `[0, 0]` y `[0, 0.1]` con `atol=1e-3`; captura `AssertionError` e imprime `fail`. Salida esperada: `fail`. Solo NumPy; corrige el bug del starter (hoy el assert pasa porque compara valores iguales).",
        hint: "np.testing.assert_allclose.",
        hints: [
          "np.testing.assert_allclose.",
          "except AssertionError.",
        ],
        edgeCases: ["atol que pasa el test", "no capturar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · assert_allclose debe fallar
# Bug a corregir: el assert pasa (valores iguales) y no imprime fail
import numpy as np
try:
    # Valores idénticos: el assert no falla (hay que forzar la diferencia)
    np.testing.assert_allclose([0.0, 0.0], [0.0, 0.0], atol=1e-3)
    print("ok")
except AssertionError:
    print("fail")`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
try:
    np.testing.assert_allclose([0.0, 0.0], [0.0, 0.1], atol=1e-3)
except AssertionError:
    print("fail")`,
          output: `fail`,
        },
      },
    ],
  },
  youDo: {
    title: "Métricas de calidad y señales por pares vectorizadas (inicio CP-N2-A)",
    context:
      "Eres analista de data quality en una fintech peruana. Con arrays sintéticos de flags de completitud y scores por cliente, implementa métricas vectorizadas, señales por pares con broadcasting, benchmark loop vs vectorizado y tests allclose. Sin PII real.",
    objectives: [
      "Implementar métricas de calidad vectorizadas (completitud, unicidad, rangos)",
      "Calcular señales por pares con broadcasting documentado",
      "Benchmark loop vs vectorizado con resultados equivalentes",
      "Tests con allclose y datasets sintéticos",
    ],
    requirements: [
      "Dataset o fixtures sintéticos (ids C00x, regiones PE)",
      "Demo reproducible (if __name__ == '__main__')",
      "Documentación en español profesional",
      "Entrega alineada al inicio de CP-N2-A: métricas NumPy del tablero de calidad",
    ],
    starterCode: `import numpy as np

def completeness(flags: np.ndarray) -> np.ndarray:
    """flags: (n_clients, n_fields) 0/1 → media por campo (axis=0)."""
    raise NotImplementedError

def uniqueness_rate(ids: np.ndarray) -> float:
    """Proporción de ids únicos: np.unique(ids).size / ids.size."""
    raise NotImplementedError

def in_range_rate(scores: np.ndarray, lo: float = 0.0, hi: float = 1.0) -> float:
    """Fracción de scores finitos dentro de [lo, hi]."""
    raise NotImplementedError

def pairwise_diff(scores: np.ndarray) -> np.ndarray:
    """scores (n,) → matriz (n, n) de diferencias score_i - score_j vía broadcast."""
    raise NotImplementedError

def bench_weighted_mean(X: np.ndarray, w: np.ndarray) -> dict:
    """Compara loop vs X @ w; devuelve dict con allclose y ratio (o tiempos)."""
    raise NotImplementedError

if __name__ == "__main__":
    flags = np.array([[1, 1, 0], [1, 0, 1], [1, 1, 1]], dtype=float)
    ids = np.array(["C001", "C002", "C001", "C003"])
    scores = np.array([0.9, 0.4, 0.85, 0.7], dtype=np.float64)
    X = np.array([[0.9, 0.1], [0.4, 0.6], [0.85, 0.15]], dtype=np.float64)
    w = np.array([0.7, 0.3], dtype=np.float64)
    print("completitud", completeness(flags))
    print("unicidad", uniqueness_rate(ids))
    print("en_rango", in_range_rate(scores))
    print("pairwise_shape", pairwise_diff(scores).shape)
    print("bench", bench_weighted_mean(X, w))
`,
    portfolioNote:
      "Este incremento abre CP-N2-A (Executive Data Quality & EDA). Documenta shapes, dtypes, ratio de benchmark (el valor exacto depende de la máquina) y tolerancias. No uses datos personales reales.",
    rubric: [
      { criterion: "Cumple los objetivos de métricas vectorizadas y evidencia del portfolio", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué atributo del ndarray indica el tipo homogéneo de sus elementos?",
        options: ["shape", "dtype", "ndim", "base"],
        correctIndex: 1,
        explanation:
          "dtype fija el tipo de cada elemento (float64, int32, etc.).",
      },
      {
        question: "Una máscara booleana a > 0.5 se usa principalmente para:",
        options: ["Cambiar el dtype", "Forzar una copy siempre", "Aumentar ndim", "Filtrar o seleccionar elementos que cumplen la condición"],
        correctIndex: 3,
        explanation:
          "Las máscaras booleanas filtran/seleccionan de forma vectorizada.",
      },
      {
        question: "axis=0 en una reducción sobre una matriz 2D suele agregar:",
        options: ["Por columna (colapsa filas)", "Por fila (colapsa columnas)", "Solo el elemento [0,0]", "Nada; axis solo existe en pandas"],
        correctIndex: 0,
        explanation:
          "axis=0 reduce a lo largo de las filas → un valor por columna.",
      },
      {
        question: "Mutar un slice simple de un ndarray normalmente:",
        options: ["Nunca afecta al original", "Convierte todo a object", "Puede mutar el array base porque suele ser un view", "Borra el dtype"],
        correctIndex: 2,
        explanation:
          "Los slices simples suelen ser views que comparten memoria.",
      },
      {
        question: "¿Por qué np.mean([1, np.nan]) no es lo mismo que np.nanmean([1, np.nan])?",
        options: [
          "mean ignora nan; nanmean propaga nan",
          "mean propaga nan; nanmean omite nan",
          "Son idénticos siempre",
          "nanmean solo funciona con int",
        ],
        correctIndex: 1,
        explanation:
          "np.mean propaga NaN (el resultado es nan). np.nanmean omite NaNs y promedia el resto. En calidad de datos usa isfinite/nanmean según la política.",
      },
      {
        question: "¿Cuándo son compatibles dos shapes para broadcasting?",
        options: [
          "Solo si son idénticos",
          "Si, de derecha a izquierda, cada dimensión es igual o una es 1 (o ausente)",
          "Si el producto de las dimensiones coincide",
          "Solo con keepdims=True",
        ],
        correctIndex: 1,
        explanation:
          "El broadcasting alinea de derecha a izquierda; si no hay compatibilidad, ValueError.",
      },
      {
        question: "np.allclose(a, b, rtol=…, atol=…) sirve principalmente para:",
        options: [
          "Cambiar el dtype a float32",
          "Comparar floats con tolerancia (p. ej. loop vs vectorizado)",
          "Forzar una view",
          "Eliminar NaN automáticamente",
        ],
        correctIndex: 1,
        explanation:
          "allclose/assert_allclose validan equivalencia numérica con rtol y atol.",
      },
      {
        question: "Un benchmark honesto loop vs vectorizado debe incluir:",
        options: [
          "Solo N=10 y el tiempo del loop",
          "Mismo input/dtype, timing y verificación de equivalencia numérica",
          "Solo el ratio sin chequear igualdad",
          "Usar print en cada iteración del loop",
        ],
        correctIndex: 1,
        explanation:
          "Sin equivalencia, un ratio de tiempo no demuestra que la versión vectorizada sea correcta. El ratio exacto además varía por máquina.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "NumPy absolute beginners",
        url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
        note: "ndarray, dtype, creación",
      },
      {
        label: "NumPy user guide — Broadcasting",
        url: "https://numpy.org/doc/stable/user/basics.broadcasting.html",
        note: "Reglas de alineación de shapes",
      },
      {
        label: "NumPy routines — Logic / Floating",
        url: "https://numpy.org/doc/stable/reference/routines.logic.html",
        note: "isnan, isfinite, allclose",
      },
      {
        label: "NumPy indexing",
        url: "https://numpy.org/doc/stable/user/basics.indexing.html",
        note: "máscaras, fancy index, views",
      },
      {
        label: "NumPy ufuncs",
        url: "https://numpy.org/doc/stable/reference/ufuncs.html",
        note: "operaciones elemento a elemento",
      },
      {
        label: "np.testing.assert_allclose",
        url: "https://numpy.org/doc/stable/reference/generated/numpy.testing.assert_allclose.html",
        note: "equivalencia loop vs vectorizado",
      },
      {
        label: "time.perf_counter",
        url: "https://docs.python.org/3/library/time.html#time.perf_counter",
        note: "benchmark honesto",
      },
    ],
    books: [
      {
        label: "Python for Data Analysis (Wes McKinney) — NumPy basics",
        note: "Capítulos de ndarray y vectorización",
      },
      {
        label: "From Python to NumPy (Nicolas P. Rougier)",
        note: "Mental model vectorizado",
      },
    ],
    courses: [
      {
        label: "NumPy tutorials (oficial)",
        url: "https://numpy.org/numpy-tutorials/",
        note: "Tutoriales oficiales del proyecto",
      },
      {
        label: "MIT 6.0001 — NumPy/arrays when covered",
        url: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
        note: "Bases de estructuras y eficiencia",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Fundamentos previos al cómputo vectorizado",
      },
      {
        label: "PyArcana live",
        url: "https://pillb.github.io/pyarcana/",
        note: "Edición pública del curso (progreso en el navegador)",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Práctica de Python previo a NumPy",
      },
    ],
  },
}
