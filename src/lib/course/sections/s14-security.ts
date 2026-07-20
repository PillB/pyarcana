import type { CourseSection } from '../../types'

export const section14: CourseSection = {
  id: "security",
  index: 14,
  title: "NumPy y cómputo vectorizado",
  shortTitle: "NumPy vectorizado",
  tagline: "cálculo vectorizado de métricas de calidad y señales por pares, con benchmark honesto y resultados equivalentes al baseline",
  estimatedHours: 10,
  level: "Competente",
  phase: 1,
  icon: "ShieldCheck",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En data quality y analytics de banca, fintech y retail en Perú, el **cómputo vectorizado con NumPy** es la base de métricas de completitud, unicidad y señales por pares. Esta sección (id de plataforma `security` conservado) retematiza a V3 **NumPy y cómputo vectorizado** e inicia **CP-N2-A** con arrays sintéticos, benchmarks honestos y tests con tolerancia.",
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
      heading: "De “Seguridad para Automatizaciones e IA” a NumPy vectorizado (mapa de la sección)",
      paragraphs: [
        "En V3, **S14 no es el path principal de OWASP LLM, prompt injection ni presidio**. Ese material se reubica conceptualmente hacia el tramo de seguridad/IA. Aquí construyes el **inicio de CP-N2-A**: ndarrays, máscaras, ufuncs, broadcasting, views/copies, NaN y vectorización con **métricas de calidad sintéticas**.",
        "El hilo conductor es un **tablero de calidad** (completitud, unicidad, rangos, señales por pares) calculado en NumPy. Solo datos sintéticos latam (regiones Lima/Arequipa/Cusco, ids `C00x`).",
        "Orden: **T1 Arrays** → **T2 Operaciones** → **T3 Semántica** → **T4 Rendimiento**.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de seguridad/IA de este archivo **no es el camino V3 del estudiante en S14**. Target: NumPy vectorizado para CP-N2-A (inicio). Conserva datos sintéticos; nunca PII real.",
      },
    },
    {
      heading: "ndarray, dtype y shape",
      subtopicId: "S14-T1-A",
      paragraphs: [
        "Un **ndarray** es un bloque contiguo (o strided) de datos homogéneos. **dtype** fija el tipo (p. ej. `float64`, `int32`); **shape** es la tupla de dimensiones; **ndim** = `len(shape)`; **itemsize** es bytes por elemento.",
        "Crear con dtype explícito evita sorpresas (`int` vs `float` en divisiones). Valida siempre `arr.dtype`, `arr.shape` y `arr.ndim` al recibir un array de un pipeline.",
        "En calidad de datos, un vector de flags de completitud suele ser `bool` o `uint8`; un score de 0–1 es `float64`.",
      ],
      code: {
        language: 'python',
        title: "ndarray_basics.py",
        code: `import numpy as np

flags = np.array([1, 0, 1, 1], dtype=np.uint8)
scores = np.array([0.9, 0.4, 0.85, 0.7], dtype=np.float64)
print("flags", flags.dtype, flags.shape, flags.ndim, flags.itemsize)
print("scores", scores.dtype, scores.shape, scores.nbytes)`,
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
      heading: "creación, indexación y máscaras",
      subtopicId: "S14-T1-B",
      paragraphs: [
        "`np.array`, `arange`, `linspace` y `zeros`/`ones`/`full` crean arrays. **Indexación** clásica (`a[i]`, `a[i:j]`) y **fancy index** (`a[[0,2]]`) seleccionan elementos.",
        "Una **máscara booleana** `a > umbral` produce un array de `bool` del mismo shape; `a[mask]` filtra. Es la forma idiomática de calidad: “filas con score < 0.5”.",
        "Ojo: filtrar con máscara suele devolver **copia** (o array 1D nuevo); no asumas view.",
      ],
      code: {
        language: 'python',
        title: "masks_index.py",
        code: `import numpy as np

ids = np.array(["C001", "C002", "C003", "C004"])
score = np.array([0.9, 0.35, 0.8, 0.2])
mask = score < 0.5
print("bajo_score", ids[mask].tolist())
print("fancy", score[[0, 2]].tolist())
print("linspace", np.linspace(0, 1, 5).tolist())`,
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
      heading: "ufuncs y reducciones",
      subtopicId: "S14-T2-A",
      paragraphs: [
        "Las **ufuncs** (`np.add`, `np.sqrt`, operadores `+`, `*`) aplican elemento a elemento en C. Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan ejes.",
        "`axis=0` reduce filas→agrega por columna; `axis=1` por fila. `keepdims=True` preserva dimensiones para rebroadcast.",
        "Métricas de calidad: `mean(flags)` = completitud; `std(scores, axis=0)` = dispersión por variable.",
      ],
      code: {
        language: 'python',
        title: "ufuncs_reduce.py",
        code: `import numpy as np

# filas=clientes, cols=campos presentes (1/0)
M = np.array([[1, 1, 0], [1, 0, 1], [1, 1, 1]], dtype=float)
completitud_campo = M.mean(axis=0)
completitud_fila = M.mean(axis=1, keepdims=True)
print("por_campo", completitud_campo.round(3).tolist())
print("por_fila", completitud_fila.ravel().round(3).tolist())
print("global", float(M.mean().round(4)))`,
        output: `por_campo [1.0, 0.667, 0.667]
por_fila [0.667, 0.667, 1.0]
global 0.7778`,
      },
      callout: {
        type: "tip",
        title: "keepdims para rebroadcast",
        content:
          "Usa keepdims cuando vayas a restar/dividir el agregado contra la matriz original.",
      },
    },
    {
      heading: "broadcasting y compatibilidad de shapes",
      subtopicId: "S14-T2-B",
      paragraphs: [
        "El **broadcasting** alinea shapes de derecha a izquierda: dimensiones iguales, o una es 1, o ausente. Si no, `ValueError`.",
        "`newaxis` / `None` inserta un eje de tamaño 1 para alinear vectores de filas/columnas (p. ej. señales por pares).",
        "Documenta el shape esperado en comentarios: evita “magia” que falla en producción con un batch distinto.",
      ],
      code: {
        language: 'python',
        title: "broadcast.py",
        code: `import numpy as np

scores = np.array([[0.9, 0.8], [0.4, 0.5], [0.7, 0.6]])  # (3,2)
pesos = np.array([0.6, 0.4])  # (2,)
ponderado = scores * pesos  # broadcast (3,2)*(2,)
umbral = np.array([0.5])[:, None]  # (1,1) vía reshape
print("ponderado", ponderado.round(3).tolist())
print("sobre_umbral", (scores.mean(axis=1, keepdims=True) > umbral).ravel().tolist())
try:
    np.ones((3, 2)) + np.ones((3, 3))
except ValueError as e:
    print("shape_error", str(e)[:40])`,
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
      heading: "views/copies y mutabilidad",
      subtopicId: "S14-T3-A",
      paragraphs: [
        "Un **view** comparte memoria con el base (`arr.base is not None` a menudo); un **copy** es independiente. Slices simples suelen ser views; fancy index y boolean mask suelen copiar.",
        "`arr.flags.writeable` controla mutación. Mutar un view muta el original — fuente clásica de bugs en pipelines.",
        "Usa `.copy()` cuando debas aislar transformaciones (p. ej. normalizar scores sin tocar el raw).",
      ],
      code: {
        language: 'python',
        title: "views_copies.py",
        code: `import numpy as np

raw = np.array([10.0, 20.0, 30.0])
vista = raw[:2]
vista[0] = 99.0
print("raw_tras_view", raw.tolist())
raw2 = np.array([10.0, 20.0, 30.0])
copia = raw2[:2].copy()
copia[0] = 99.0
print("raw_tras_copy", raw2.tolist())
print("vista_base_is_raw", vista.base is raw)`,
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
        "`np.nan` y `±inf` rompen `mean`/`sum` clásicos. Usa `np.isnan`/`isinf`, `nansum`/`nanmean`, o máscaras.",
        "`np.finfo(float).eps` acota ruido de redondeo. Overflow en enteros y float produce wrap o inf.",
        "En calidad, un NaN en un campo no es “cero”: es **ausencia**. Métricas robustas lo documentan.",
      ],
      code: {
        language: 'python',
        title: "nan_inf.py",
        code: `import numpy as np

x = np.array([1.0, np.nan, 3.0, np.inf])
print("isnan", np.isnan(x).tolist())
print("isinf", np.isinf(x).tolist())
finite = x[np.isfinite(x)]
print("finite_mean", float(np.mean(finite)))
print("nansum_sin_inf", float(np.nansum(np.where(np.isinf(x), np.nan, x))))
print("eps", float(np.finfo(float).eps))`,
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
      heading: "vectorización frente a loops",
      subtopicId: "S14-T4-A",
      paragraphs: [
        "Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado.",
        "Benchmark **honesto**: mismo input, warmup opcional, `time.perf_counter`, reporta ratio. No compares N=10.",
        "A veces un loop claro gana en N pequeño o lógica irregular; documenta el umbral.",
      ],
      code: {
        language: 'python',
        title: "vec_vs_loop.py",
        code: `import numpy as np
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
print("ratio_loop_over_vec", round(t_loop / max(t_vec, 1e-12), 1))`,
        output: `equal True
ratio_loop_over_vec 135.8`,
      },
      callout: {
        type: "info",
        title: "Benchmark honesto",
        content:
          "Reporta N, dtype y máquina. Un ratio en laptop no es SLA de producción.",
      },
    },
    {
      heading: "memoria, medición y tests con tolerancia",
      subtopicId: "S14-T4-B",
      paragraphs: [
        "`nbytes` y `itemsize * size` estiman memoria del array. Evita copias innecesarias en datasets grandes.",
        "`np.allclose(a, b, rtol=, atol=)` compara floats con tolerancia. `np.testing.assert_allclose` falla con mensaje claro.",
        "En CP-N2-A, el baseline loop y la versión vectorizada deben ser **equivalentes dentro de rtol/atol**.",
      ],
      code: {
        language: 'python',
        title: "allclose_mem.py",
        code: `import numpy as np

base = np.array([1.0, 2.0, 3.0])
approx = base + 1e-9
print("nbytes", base.nbytes)
print("allclose", np.allclose(base, approx, rtol=1e-7, atol=1e-9))
try:
    np.testing.assert_allclose(base, base + 0.1, atol=1e-6)
except AssertionError as e:
    print("assert_fail", "not close" in str(e).lower() or True)`,
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
          code: `import numpy as np

ids = np.array(["C001", "C002", "C003", "C004", "C005"])
region = np.array(["Lima", "Arequipa", "Lima", "Cusco", "Lima"])
score = np.array([0.9, 0.3, 0.55, 0.8, 0.2])
mask = (region == "Lima") & (score < 0.6)
print("filtrados", ids[mask].tolist())
print("count", int(mask.sum()))`,
          output: `filtrados ['C003', 'C005']
count 2`,
        },
        why: "Máscaras combinadas expresan reglas de calidad sin loops.",
      },
      {
        demoId: "S14-T2-A-DEMO",
        subtopicId: "S14-T2-A",
        environment: "local-python",
        description: "Reducir métricas de completitud por campo y por cliente con ufuncs",
        code: {
          language: 'python',
          title: "demo_reductions.py",
          code: `import numpy as np

# 1 = presente, 0 = ausente
M = np.array([
    [1, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 1, 1],
], dtype=float)
por_campo = M.mean(axis=0)
por_cliente = M.mean(axis=1)
print("completitud_campo", np.round(por_campo, 3).tolist())
print("completitud_cliente", np.round(por_cliente, 3).tolist())
print("std_campos", float(np.round(por_campo.std(), 4)))`,
          output: `completitud_campo [1.0, 0.75, 0.75, 0.5]
completitud_cliente [0.75, 0.75, 0.5, 1.0]
std_campos 0.1768`,
        },
        why: "Reducciones por eje son el núcleo de tableros de calidad vectorizados.",
      },
      {
        demoId: "S14-T2-B-DEMO",
        subtopicId: "S14-T2-B",
        environment: "local-python",
        description: "Alinear scores de clientes con pesos de campos vía broadcast explícito",
        code: {
          language: 'python',
          title: "demo_broadcast.py",
          code: `import numpy as np

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
print("diff_00", float(diff[0, 0]))`,
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
          code: `import numpy as np

raw = np.array([100.0, 200.0, 50.0, 150.0])
# mal: normalizar en view
v = raw[:]
v /= v.max()
print("raw_corrupto", np.round(raw, 3).tolist())

raw = np.array([100.0, 200.0, 50.0, 150.0])
norm = raw.copy()
norm /= norm.max()
print("raw_ok", raw.tolist())
print("norm", np.round(norm, 3).tolist())`,
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
          code: `import numpy as np

scores = np.array([0.9, np.nan, 0.7, np.inf, 0.4, 0.85])
valid = scores[np.isfinite(scores)]
print("n_valid", valid.size, "de", scores.size)
print("mean_robusta", float(np.round(valid.mean(), 4)))
print("nanmean_solo_nan", float(np.round(np.nanmean(np.where(np.isinf(scores), np.nan, scores)), 4)))`,
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
          code: `import numpy as np
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
print("ratio", round(t_loop / max(t_vec, 1e-12), 1))`,
          output: `allclose True
ratio 117.5`,
        },
        why: "Equivalencia + ratio de tiempo justifican la vectorización en el portfolio.",
      },
      {
        demoId: "S14-T4-B-DEMO",
        subtopicId: "S14-T4-B",
        environment: "local-python",
        description: "Test con np.allclose y presupuesto de memoria para matriz de señales",
        code: {
          language: 'python',
          title: "demo_tol.py",
          code: `import numpy as np

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
print("assert_ok", True)`,
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
          "Crea un ndarray `flags` de shape (3, 2) dtype uint8 con valores [[1,0],[1,1],[0,1]] e imprime dtype, shape y ndim.",
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
          code: `import numpy as np
# TODO: flags
`,
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
          "Construye `scores = np.linspace(0, 1, 5, dtype=np.float64)` y reporta itemsize y nbytes.",
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
          code: `import numpy as np
# TODO
`,
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
          "Valida un contrato: si un array no es 1D float64, lanza ValueError; si es válido imprime 'ok' y el size.",
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
          code: `import numpy as np

def validate(a):
    # TODO
    pass
`,
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
          "Dado score = [0.2, 0.8, 0.4, 0.9], imprime los índices (0-based) donde score >= 0.5 usando máscara y np.where.",
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
          code: `import numpy as np
score = np.array([0.2, 0.8, 0.4, 0.9])
# TODO
`,
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
          "Crea ids C001..C004 y scores; imprime ids con score en el percentil inferior (score < mediana).",
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
          code: `import numpy as np
# TODO
`,
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
          "Fancy index: reordena el vector [10,20,30,40] al orden de índices [2,0,3,1] e imprime el resultado.",
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
          code: `import numpy as np
a = np.array([10, 20, 30, 40])
# TODO
`,
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
          "Matriz 2x3 de unos y ceros: calcula mean por axis=0 y axis=1; imprime ambas listas redondeadas a 2 decimales.",
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
          code: `import numpy as np
M = np.array([[1., 0., 1.], [1., 1., 0.]])
# TODO
`,
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
          "Con scores = [[0.5,0.5],[1.0,0.0],[0.8,0.6]], imprime std por columna (axis=0) con 4 decimales.",
        hint: "np.std(axis=0).",
        hints: [
          "np.std(axis=0).",
          "Por defecto ddof=0 en np.std.",
        ],
        edgeCases: ["ddof=1 vs 0", "axis=1 por error"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
scores = np.array([[0.5, 0.5], [1.0, 0.0], [0.8, 0.6]])
print(np.round(scores.std(axis=0), 4).tolist())`,
          output: `[0.2055, 0.2625]`,
        },
      },
      {
        id: "S14-T2-A-E3",
        subtopicId: "S14-T2-A",
        kind: "transfer",
        instruction:
          "Normaliza cada fila restando su media (keepdims) e imprime la media de cada fila tras normalizar (debe ser ~0).",
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
          code: `import numpy as np
X = np.array([[1., 3.], [10., 20.], [2., 2.]])
# TODO
`,
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
          "Suma el vector pesos [1,2,3] a cada fila de una matriz 2x3 de ceros usando broadcast; imprime la matriz.",
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
          code: `import numpy as np
# TODO
`,
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
          "Con a shape (4,) crea columna (4,1) con newaxis y multiplica por fila b shape (3,); imprime shape del producto.",
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
          code: `import numpy as np
a = np.arange(4)
b = np.arange(3)
# TODO
`,
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
          "Detecta incompatibilidad: intenta sumar (2,3) con (2,4) y captura ValueError imprimiendo 'incompatible'.",
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
          code: `import numpy as np
# TODO
`,
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
          "Toma raw=[1,2,3], crea vista de los dos primeros, pon vista[0]=9 e imprime raw.",
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
          code: `import numpy as np
# TODO
`,
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
          "Repite con .copy() y demuestra que raw queda [1,2,3] tras mutar la copia.",
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
          code: `import numpy as np
# TODO
`,
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
          "Marca un array como no escribible (flags.writeable=False) e intenta asignar; imprime 'blocked' al capturar ValueError.",
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
          code: `import numpy as np
# TODO
`,
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
          "Cuenta cuántos NaN hay en [1, nan, 2, nan] con np.isnan.",
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
          code: `import numpy as np
x = np.array([1.0, np.nan, 2.0, np.nan])
# TODO
`,
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
          "Calcula nanmean de [1, nan, 3] e imprime con 2 decimales.",
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
          code: `import numpy as np
# TODO
`,
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
          "Reemplaza inf por nan en [1, inf, 2] y luego usa nansum; imprime el resultado.",
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
          code: `import numpy as np
# TODO
`,
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
          "Suma a*b con loop y con (a*b).sum() para a=b=arange(1000); imprime si abs(diff)<1e-6.",
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
          code: `import numpy as np
# TODO
`,
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
          "Implementa suma de cuadrados vectorizada de arange(5) e imprime el total.",
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
          code: `import numpy as np
# TODO
`,
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
          "Mide con perf_counter un (a+b) vectorizado de n=10000 e imprime 'timed' y que el resultado mean sea 1.0 si a=0 y b=1.",
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
          code: `import numpy as np, time
# TODO
`,
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
          "Imprime nbytes de np.zeros(1000, dtype=np.float64) y verifica que sea 8000.",
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
          code: `import numpy as np
# TODO
`,
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
          "Usa allclose entre [1.0, 2.0] y [1.0+1e-9, 2.0] con atol=1e-8; imprime el booleano.",
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
          code: `import numpy as np
# TODO
`,
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
          "assert_allclose debe fallar entre [0,0] y [0,0.1] con atol=1e-3; captura e imprime 'fail'.",
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
          code: `import numpy as np
# TODO
`,
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
      "Alineación al incremento CP-N2-A (inicio) de S14",
    ],
    starterCode: `import numpy as np

def completeness(flags: np.ndarray) -> np.ndarray:
    """flags: (n_clients, n_fields) con 0/1 → media por campo."""
    # TODO
    raise NotImplementedError

def pairwise_diff(scores: np.ndarray) -> np.ndarray:
    """scores (n,) → matriz (n,n) de diferencias score_i - score_j."""
    # TODO
    raise NotImplementedError

if __name__ == "__main__":
    flags = np.array([[1, 1, 0], [1, 0, 1], [1, 1, 1]], dtype=float)
    print("completitud", completeness(flags))
`,
    portfolioNote:
      "Este incremento abre CP-N2-A (Executive Data Quality & EDA). Documenta shapes, dtypes, ratio de benchmark y tolerancias. No uses datos personales reales.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
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
        options: [
          "shape",
          "dtype",
          "ndim",
          "base",
        ],
        correctIndex: 1,
        explanation:
          "dtype fija el tipo de cada elemento (float64, int32, etc.).",
      },
      {
        question: "Una máscara booleana a > 0.5 se usa principalmente para:",
        options: [
          "Cambiar el dtype",
          "Filtrar o seleccionar elementos que cumplen la condición",
          "Forzar una copy siempre",
          "Aumentar ndim",
        ],
        correctIndex: 1,
        explanation:
          "Las máscaras booleanas filtran/seleccionan de forma vectorizada.",
      },
      {
        question: "axis=0 en una reducción sobre una matriz 2D suele agregar:",
        options: [
          "Por fila (colapsa columnas)",
          "Por columna (colapsa filas)",
          "Solo el elemento [0,0]",
          "Nada; axis solo existe en pandas",
        ],
        correctIndex: 1,
        explanation:
          "axis=0 reduce a lo largo de las filas → un valor por columna.",
      },
      {
        question: "Mutar un slice simple de un ndarray normalmente:",
        options: [
          "Nunca afecta al original",
          "Puede mutar el array base porque suele ser un view",
          "Convierte todo a object",
          "Borra el dtype",
        ],
        correctIndex: 1,
        explanation:
          "Los slices simples suelen ser views que comparten memoria.",
      },
    ],
  },
  resources: {
    docs: [
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
    ],
    books: [
      {
        label: "Python for Data Analysis (Wes McKinney) — NumPy basics",
        note: "Capítulos de ndarray y vectorización",
      },
    ],
    courses: [
      {
        label: "NumPy documentation tutorials",
        url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
        note: "Inicio oficial",
      },
    ],
  },
}
