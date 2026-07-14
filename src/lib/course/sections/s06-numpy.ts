import type { CourseSection } from '../../types'

export const section06: CourseSection = {
  id: 'numpy',
  index: 6,
  title: 'NumPy: Vectorized Computing',
  shortTitle: 'NumPy',
  tagline: 'Arrays, vectorización, broadcasting — por qué NumPy es 100x más rápido que loops',
  estimatedHours: 6,
  level: 'Intermedio',
  phase: 0,
  icon: 'Calculator',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance:
    'NumPy es el motor numérico sobre el que se construyen pandas, scikit-learn y TensorFlow. Cuando escribes `df["col"] * 2` en pandas, internamente NumPy hace la multiplicación vectorizada. Entender broadcasting y vectorización es lo que separa un código que tarda 10 segundos de uno que tarda 10 minutos. En entrevistas técnicas te preguntan: "¿por qué NumPy es más rápido que Python puro?" — la respuesta es vectorización a nivel C.',
  learningOutcomes: [
    { text: 'Crear arrays con np.array, np.zeros, np.ones, np.eye, np.linspace, np.arange' },
    { text: 'Indexar y slicear arrays 1D, 2D y n-dimensionales' },
    { text: 'Aplicar boolean masking para filtrar elementos' },
    { text: 'Entender y aplicar reglas de broadcasting entre arrays de shapes distintas' },
    { text: 'Usar funciones estadísticas: mean, std, median, percentile, corrcoef' },
    { text: 'Reshaping: reshape, flatten, transpose, -1 wildcard' },
  ],
  theory: [
    {
      heading: 'Arrays de NumPy — la alternativa eficiente a listas',
      paragraphs: [
        'Un `np.array` es como una lista de Python, pero con superpoderes: (1) todos los elementos deben ser del mismo tipo (dtype), (2) las operaciones se vectorizan a nivel C sin loops de Python, (3) ocupa mucha menos memoria que una lista equivalente. Para datos numéricos de cualquier tamaño, siempre usa NumPy en vez de listas nativas. La diferencia de performance es brutal — para un array de 1 millón de elementos, NumPy es 50-100x más rápido.',
        'Para crear arrays, las funciones más usadas son: `np.array([1, 2, 3])` (desde lista), `np.zeros(5)` (vector de ceros), `np.ones((3, 4))` (matriz 3x4 de unos), `np.eye(3)` (matriz identidad 3x3), `np.arange(0, 10, 2)` (como range pero devuelve array), `np.linspace(0, 1, 5)` (5 valores equidistantes entre 0 y 1). Cada array tiene `.shape` (forma), `.dtype` (tipo de datos), `.size` (número total de elementos), `.ndim` (número de dimensiones).',
        'El atributo `dtype` es crucial. NumPy soporta tipos como `int32`, `int64`, `float32`, `float64`, `bool`. Por defecto usa 64-bit. Si trabajas con millones de elementos y no necesitas precisión de 64-bit, usar `float32` reduce memoria a la mitad. En deep learning con GPU, esto es estándar.',
      ],
      code: {
        language: 'python',
        title: 'arrays.py',
        code: `import numpy as np

# Crear arrays
a = np.array([1, 2, 3, 4, 5])           # 1D
b = np.array([[1, 2, 3], [4, 5, 6]])    # 2D (matriz)

# Arrays predefinidos
ceros = np.zeros(5)               # [0., 0., 0., 0., 0.]
unos = np.ones((2, 3))            # matriz 2x3 de unos
identidad = np.eye(3)             # matriz identidad 3x3
rango = np.arange(0, 10, 2)       # [0, 2, 4, 6, 8]
lin = np.linspace(0, 1, 5)        # [0., 0.25, 0.5, 0.75, 1.]

# Atributos clave
print(a.shape)    # (5,) — vector de 5 elementos
print(b.shape)    # (2, 3) — matriz 2x3
print(b.ndim)     # 2 — dos dimensiones
print(b.size)     # 6 — total elementos
print(b.dtype)    # int64

# Especificar dtype
a_float = np.array([1, 2, 3], dtype=np.float32)
a_bool = np.array([1, 0, 1, 1], dtype=bool)  # [True, False, True, True]

# Aleatorios (reproducible con seed)
np.random.seed(42)
random_arr = np.random.rand(5)            # uniforme [0, 1)
random_ints = np.random.randint(0, 100, (3, 3))  # enteros 0-99 en matriz 3x3
normal = np.random.randn(1000)            # normal estándar (media 0, std 1)`,
      },
    },
    {
      heading: 'Vectorización — por qué NumPy es 100x más rápido',
      paragraphs: [
        'La vectorización es la razón de existir de NumPy. Cuando escribes `a * 2` donde `a` es un array de 1 millón de elementos, NumPy no ejecuta un loop de Python — pasa el cálculo a código C optimizado que usa SIMD (instrucciones vectoriales del CPU). El resultado: 50-100x más rápido. La regla de oro: NUNCA escribas un loop for para operaciones matemáticas sobre arrays. Siempre busca la operación vectorizada equivalente.',
        'Las operaciones vectorizadas se aplican elemento a elemento automáticamente: `a + b` (suma), `a * b` (multiplicación), `a ** 2` (potencia), `a > 5` (comparación devuelve bool array), `np.sin(a)` (funciones universales "ufuncs"). Todas estas operan en C sin loops de Python. Para operaciones de reducción: `a.sum()`, `a.mean()`, `a.max()`, `a.std()`. Estas devuelven un escalar, no un array.',
        'Cuando encadenas operaciones, NumPy las optimiza internamente. `np.sqrt(np.square(a - a.mean()).sum() / len(a))` es el cálculo de desviación estándar manual, y es casi tan rápido como `a.std()`. En Python puro, el equivalente con loops sería 100x más lento. Esta es la diferencia entre código de investigación (Python puro) y código de producción (NumPy vectorizado).',
      ],
      code: {
        language: 'python',
        title: 'vectorizacion.py',
        code: `import numpy as np
import time

# Crear array grande
N = 1_000_000
a = np.random.rand(N)
b = np.random.rand(N)

# === FORMA LENTA (Python loops) ===
inicio = time.perf_counter()
resultado_loop = []
for i in range(N):
    resultado_loop.append(a[i] * b[i] + 1)
tiempo_loop = time.perf_counter() - inicio

# === FORMA RÁPIDA (vectorizada) ===
inicio = time.perf_counter()
resultado_vec = a * b + 1
tiempo_vec = time.perf_counter() - inicio

print(f"Loop:    {tiempo_loop*1000:.1f}ms")
print(f"Vector:  {tiempo_vec*1000:.1f}ms")
print(f"Speedup: {tiempo_loop/tiempo_vec:.0f}x más rápido")

# Operaciones vectorizadas comunes
a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

print(a + b)          # [11 22 33 44 55]
print(a * b)          # [10 40 90 160 250]
print(a ** 2)         # [1 4 9 16 25]
print(a > 3)          # [False False False True True]
print(np.sqrt(a))     # [1. 1.41 1.73 2. 2.24]
print(np.exp(a))      # exponencial
print(np.log(a))      # logaritmo natural

# Reducciones (devuelven escalar)
print(a.sum(), a.mean(), a.std(), a.min(), a.max())
# 15 3.0 1.414 1 5

# Operaciones por eje (axis)
matriz = np.array([[1, 2, 3], [4, 5, 6]])
print(matriz.sum(axis=0))  # [5 7 9] — suma por columnas
print(matriz.sum(axis=1))  # [6 15]   — suma por filas
print(matriz.mean(axis=0)) # [2.5 3.5 4.5]`,
        output: `Loop:    845.3ms
Vector:  4.2ms
Speedup: 201x más rápido
[11 22 33 44 55]
[10 40 90 160 250]
[1 4 9 16 25]
[False False False True True]
[1. 1.414 1.732 2. 2.236]
15 3.0 1.414 1 5
[5 7 9]
[6 15]
[2.5 3.5 4.5]`,
      },
      callout: {
        type: 'warning',
        title: 'Nunca escribas loops sobre arrays de NumPy',
        content:
          'Si estás escribiendo `for i in range(len(arr)): arr[i] * 2`, estás haciendo Python puro encima de NumPy — pierdes todo el beneficio. Busca la operación vectorizada: `arr * 2`. Si la operación no es trivial, busca funciones de NumPy o usa np.vectorize (aunque esto es solo wrapper). En último recurso, considera numba para JIT compilation.',
      },
    },
    {
      heading: 'Indexing, slicing y boolean masking',
      paragraphs: [
        'El indexing de NumPy es más poderoso que el de listas de Python. Para 1D es igual: `arr[0]` (primero), `arr[-1]` (último), `arr[1:4]` (slice del 1 al 3). Para 2D, usas coma: `matriz[0, 1]` (fila 0, columna 1), `matriz[:, 0]` (toda la primera columna), `matriz[1:3, :]` (filas 1-2, todas las columnas). El símbolo `:` significa "todo en esta dimensión".',
        'El boolean masking es la técnica más poderosa de NumPy. Creas un array booleano (con una condición como `arr > 5`) y lo usas como índice. NumPy devuelve solo los elementos donde la máscara es True. Es la forma idiomática de filtrar datos numéricos — mucho más rápida que cualquier loop.',
        'Para combinar condiciones, usa `&` (and), `|` (or), `~` (not). ATENCIÓN: en NumPy se usan operadores bitwise, no `and`/`or` de Python. Y los paréntesis son OBLIGATORIOS: `(arr > 5) & (arr < 10)`. Sin paréntesis, el orden de evaluación es ambiguo y da error.',
      ],
      code: {
        language: 'python',
        title: 'indexing.py',
        code: `import numpy as np

# 1D
a = np.array([10, 20, 30, 40, 50])
print(a[0])      # 10
print(a[-1])     # 50
print(a[1:4])    # [20 30 40]
print(a[::-1])   # [50 40 30 20 10] (reverso)

# 2D
m = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])
print(m[0, 1])       # 2 (fila 0, col 1)
print(m[1])          # [4 5 6] (fila 1 completa)
print(m[:, 1])       # [2 5 8] (columna 1 completa)
print(m[1:3, 0:2])   # [[4 5] [7 8]] (submatriz)

# Boolean masking — el superpoder
edades = np.array([15, 22, 35, 18, 45, 12, 28])
mayores_18 = edades > 18
print(mayores_18)  # [False True True False True False True]

# Usar la máscara como índice
print(edades[mayores_18])  # [22 35 45 28]

# Combinar condiciones con & y | (OBLIGATORIO paréntesis)
jovenes_adultos = (edades >= 18) & (edades <= 30)
print(edades[jovenes_adultos])  # [22 18 28]

mayores_o_menores = (edades < 18) | (edades > 40)
print(edades[mayores_o_menores])  # [15 45 12]

# Masking con asignación (modificar elementos que cumplen condición)
edades[edades < 18] = 0  # poner a 0 los menores
print(edades)  # [0 22 35 18 45 0 28]

# where: índices donde se cumple condición
indices = np.where(edades > 20)
print(indices)  # (array([1, 2, 4, 6]),)

# Fancy indexing (lista de índices)
print(a[[0, 2, 4]])  # [10 30 50]`,
      },
    },
    {
      heading: 'Broadcasting — operaciones entre shapes distintas',
      paragraphs: [
        'El broadcasting es la característica más poderosa (y confusa) de NumPy. Permite operar arrays de shapes distintas sin copiar datos. La regla: NumPy "estira" el array más pequeño para que coincida con el más grande, sin usar memoria extra. Ejemplo clásico: `matriz + vector` donde matriz es (3, 4) y vector es (4,). NumPy suma el vector a cada fila de la matriz automáticamente.',
        'Las reglas oficiales de broadcasting: (1) compara shapes desde la derecha, (2) dos dimensiones son compatibles si son iguales o si una es 1, (3) si no son compatibles, ValueError. Ejemplos: (3, 4) + (4,) funciona (vector se estira a (3, 4)). (3, 4) + (3, 1) funciona (columna se estira a (3, 4)). (3, 4) + (3,) FALLA (no alinea desde la derecha).',
        'El broadcasting es lo que permite escribir código limpio para normalización, scoring, y transformaciones. Por ejemplo, para normalizar cada fila de una matriz a suma 1: `matriz / matriz.sum(axis=1, keepdims=True)`. Sin broadcasting, necesitarías un loop. Con broadcasting, es una línea.',
      ],
      code: {
        language: 'python',
        title: 'broadcasting.py',
        code: `import numpy as np

# Caso 1: array + escalar (siempre funciona)
a = np.array([1, 2, 3, 4])
print(a + 10)  # [11 12 13 14] — escalar "estirado"

# Caso 2: matriz (3,4) + vector (4,)
matriz = np.array([[1, 2, 3, 4],
                   [5, 6, 7, 8],
                   [9, 10, 11, 12]])
vector = np.array([100, 200, 300, 400])
print(matriz + vector)
# [[101 202 303 404]
#  [105 206 307 408]
#  [109 210 311 412]]

# Caso 3: matriz (3,4) + columna (3,1) -> funciona
col = np.array([[1], [2], [3]])  # shape (3, 1)
print(matriz + col)
# [[ 2  3  4  5]
#  [ 7  8  9 10]
#  [12 13 14 15]]

# Caso 4: shapes incompatibles -> ValueError
# col_3 = np.array([1, 2, 3])  # shape (3,)
# matriz + col_3  # ERROR: shapes (3,4) and (3,) not aligned

# Normalización por fila ( broadcasting real)
datos = np.random.rand(5, 3)  # 5 muestras, 3 features
# Restar media y dividir por std (z-score)
medias = datos.mean(axis=0)   # shape (3,)
stds = datos.std(axis=0)      # shape (3,)
datos_normalizados = (datos - medias) / stds  # broadcasting automático
print(datos_normalizados.mean(axis=0))  # ~[0, 0, 0]
print(datos_normalizados.std(axis=0))   # ~[1, 1, 1]

# Normalización Min-Max por columna
minimos = datos.min(axis=0)
maximos = datos.max(axis=0)
datos_01 = (datos - minimos) / (maximos - minimos)
print(datos_01.min(axis=0))  # [0, 0, 0]
print(datos_01.max(axis=0))  # [1, 1, 1]`,
      },
    },
    {
      heading: 'Reshaping y estadísticas — preparando datos para ML',
      paragraphs: [
        'El reshaping es esencial para preparar datos en ML. Scikit-learn espera X de shape (n_samples, n_features). Si tienes un vector 1D, debes reshape a 2D: `arr.reshape(-1, 1)` lo convierte a columna (n, 1). El `-1` es un wildcard que NumPy calcula automáticamente. Para aplanar una matriz: `.flatten()` o `.ravel()` (este último es view, no copy).',
        'Las funciones estadísticas más usadas: `np.mean`, `np.median`, `np.std`, `np.var`, `np.percentile`, `np.quantile`, `np.corrcoef`, `np.histogram`. Para percentiles: `np.percentile(arr, [25, 50, 75])` devuelve los cuartiles. Para correlación: `np.corrcoef(x, y)` devuelve matriz 2x2 con coeficientes.',
        'Para eliminar outliers: usa el rango intercuartílico (IQR). `q1, q3 = np.percentile(arr, [25, 75]); iqr = q3 - q1; mask = (arr >= q1 - 1.5*iqr) & (arr <= q3 + 1.5*iqr); arr_limpio = arr[mask]`. Esta es la técnica estándar para limpieza de outliers en producción.',
      ],
      code: {
        language: 'python',
        title: 'reshape_stats.py',
        code: `import numpy as np

# Reshaping
a = np.arange(12)
print(a.shape)  # (12,)

# Convertir a matriz 3x4
m = a.reshape(3, 4)
print(m)
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# -1 wildcard: NumPy calcula la dimensión
m2 = a.reshape(2, -1)  # (2, 6)
m3 = a.reshape(-1, 3)  # (4, 3)

# Para sklearn: convertir 1D a 2D columna
vector = np.array([1, 2, 3, 4, 5])
print(vector.shape)         # (5,)
columna = vector.reshape(-1, 1)
print(columna.shape)        # (5, 1)
fila = vector.reshape(1, -1)
print(fila.shape)           # (1, 5)

# Flatten y ravel
matriz = np.array([[1, 2], [3, 4]])
print(matriz.flatten())  # [1 2 3 4]
print(matriz.ravel())    # [1 2 3 4] (view, más eficiente)
print(matriz.T)          # [[1 3] [2 4]] (transpuesta)

# Estadísticas
data = np.random.randn(1000)
print(f"Media: {data.mean():.3f}")
print(f"Std:   {data.std():.3f}")
print(f"Min:   {data.min():.3f}")
print(f"Max:   {data.max():.3f}")
print(f"Mediana: {np.median(data):.3f}")

# Percentiles
p25, p50, p75 = np.percentile(data, [25, 50, 75])
print(f"Q1={p25:.3f}, Q2={p50:.3f}, Q3={p75:.3f}")
print(f"IQR: {p75 - p25:.3f}")

# Correlación entre dos arrays
x = np.random.randn(100)
y = 2*x + np.random.randn(100) * 0.5  # y correlacionada con x
corr = np.corrcoef(x, y)
print(f"Correlación: {corr[0, 1]:.3f}")  # ~0.97

# Eliminar outliers con IQR
q1, q3 = np.percentile(data, [25, 75])
iqr = q3 - q1
limite_inf = q1 - 1.5 * iqr
limite_sup = q3 + 1.5 * iqr
mask = (data >= limite_inf) & (data <= limite_sup)
data_limpia = data[mask]
print(f"Outliers removidos: {len(data) - len(data_limpia)}")`,
      },
    },
  ],
  iDo: {
    intro:
      'Construyamos juntos un analizador de notas de exámenes usando solo NumPy. Vamos a generar 500 alumnos x 5 cursos, calcular promedios con vectorización, encontrar el top 10% con boolean masking, y normalizar. Es exactamente el tipo de análisis que harías en una universidad o en una empresa de educación.',
    steps: [
      {
        description: 'Generar datos sintéticos y calcular promedios vectorizados',
        code: {
          language: 'python',
          title: 'score_analyzer.py',
          code: `import numpy as np

# Generar datos: 500 alumnos, 5 cursos
np.random.seed(42)
# Notas entre 0 y 20 con distribución normal centrada en 13
notas = np.random.normal(loc=13, scale=4, size=(500, 5))
notas = np.clip(notas, 0, 20)  # limitar al rango 0-20
notas = np.round(notas, 1)

cursos = ["Matematica", "Lenguaje", "Ciencias", "Historia", "Ingles"]

print(f"Shape: {notas.shape}")  # (500, 5)
print(f"Primeras 3 filas:\\n{notas[:3]}")

# Promedio por alumno (axis=1: a lo largo de cursos)
promedio_alumno = notas.mean(axis=1)
print(f"\\nPromedio primeros 5 alumnos: {promedio_alumno[:5]}")

# Promedio por curso (axis=0: a lo largo de alumnos)
promedio_curso = notas.mean(axis=0)
for curso, prom in zip(cursos, promedio_curso):
    print(f"  {curso}: {prom:.2f}")

# Estadísticas globales
print(f"\\nPromedio general: {notas.mean():.2f}")
print(f"Std general: {notas.std():.2f}")
print(f"Mediana: {np.median(notas):.2f}")`,
          output: `Shape: (500, 5)
[[13.  12.3 16.3 14.6 13.9]
 [11.4  9.1 14.2 14.4 15.7]
 [13.8 13.2 13.6 16.3 12.5]]

  Matematica: 12.98
  Lenguaje: 12.97
  Ciencias: 12.86
  Historia: 13.06
  Ingles: 12.95

Promedio general: 12.96
Std general: 4.02
Mediana: 13.00`,
        },
        why: 'Todo el cálculo de promedios se hace en una sola operación vectorizada. Si lo hiciéramos con loops de Python sobre 500x5 = 2500 elementos, sería ~50x más lento. Para 500K alumnos, la diferencia sería de segundos vs minutos. La vectorización no es opcional en producción.',
      },
      {
        description: 'Identificar top 10% y normalizar con broadcasting',
        code: {
          language: 'python',
          title: 'score_analyzer.py',
          code: `# Top 10% de alumnos por promedio
umbral_top10 = np.percentile(promedio_alumno, 90)
print(f"Umbral top 10%: {umbral_top10:.2f}")

# Boolean masking
mask_top = promedio_alumno >= umbral_top10
top_alumnos_idx = np.where(mask_top)[0]
print(f"Cantidad de alumnos top 10%: {len(top_alumnos_idx)}")
print(f"Indices primeros 5 top: {top_alumnos_idx[:5]}")

# Notas de los top
notas_top = notas[mask_top]
print(f"\\nPromedio de top 10%: {notas_top.mean():.2f}")
print(f"Promedio del resto:   {notas[~mask_top].mean():.2f}")

# Normalización Min-Max por curso (broadcasting)
minimos = notas.min(axis=0)  # shape (5,)
maximos = notas.max(axis=0)  # shape (5,)
notas_norm = (notas - minimos) / (maximos - minimos)
# Broadcasting: (500, 5) - (5,) -> (500, 5) - (1, 5) estirado
print(f"\\nNotas normalizadas (rango 0-1):")
print(f"  Min por curso: {notas_norm.min(axis=0)}")
print(f"  Max por curso: {notas_norm.max(axis=0)}")

# Z-score normalization (media 0, std 1)
notas_z = (notas - notas.mean(axis=0)) / notas.std(axis=0)
print(f"\\nZ-score:")
print(f"  Media por curso: {notas_z.mean(axis=0).round(3)}")
print(f"  Std por curso:   {notas_z.std(axis=0).round(3)}")

# Guardar resultados
np.save("notas_summary.npy", {
    "notas": notas,
    "promedio_alumno": promedio_alumno,
    "promedio_curso": promedio_curso,
    "top_alumnos_idx": top_alumnos_idx,
    "notas_normalizadas": notas_norm
})
print("\\n✓ Resultados guardados en notas_summary.npy")`,
          output: `Umbral top 10%: 18.21
Cantidad de alumnos top 10%: 50
Indices primeros 5 top: [10 14 18 22 33]

Promedio de top 10%: 18.92
Promedio del resto:   12.65

Notas normalizadas (rango 0-1):
  Min por curso: [0. 0. 0. 0. 0.]
  Max por curso: [1. 1. 1. 1. 1.]

Z-score:
  Media por curso: [-0. 0. 0. 0. -0.]
  Std por curso:   [1. 1. 1. 1. 1.]

✓ Resultados guardados en notas_summary.npy`,
        },
        why: 'El broadcasting `(notas - minimos) / (maximos - minimos)` donde notas es (500, 5) y minimos es (5,), NumPy hace todo automáticamente. Sin broadcasting, necesitarías un loop sobre columnas. Esta es la forma idiomática de normalizar para ML — sklearn lo hace internamente con StandardScaler.',
      },
    ],
  },
  weDo: {
    intro:
      'Te toca practicar con un dataset de alturas. Vamos a calcular estadísticas, detectar outliers con IQR, y normalizar.',
    steps: [
      {
        instruction: 'Genera 1000 alturas (cm) con distribución normal (media 165, std 10), detecta outliers con IQR',
        hint: 'Usa np.random.normal, np.percentile([25, 75]), calcula IQR, mask booleana.',
        starterCode: {
          language: 'python',
          title: 'alturas.py',
          code: `import numpy as np

# Generar alturas
np.random.seed(42)
alturas = np.random.normal(loc=165, scale=10, size=1000)

# TODO: calcula Q1, Q3, IQR
# TODO: define límites (Q1 - 1.5*IQR, Q3 + 1.5*IQR)
# TODO: crea mask de outliers
# TODO: imprime cuántos outliers y cuáles son`,
        },
        solutionCode: {
          language: 'python',
          title: 'alturas.py',
          code: `import numpy as np

# Generar alturas
np.random.seed(42)
alturas = np.random.normal(loc=165, scale=10, size=1000)

# Calcular Q1, Q3, IQR
q1, q3 = np.percentile(alturas, [25, 75])
iqr = q3 - q1
print(f"Q1={q1:.2f}, Q3={q3:.2f}, IQR={iqr:.2f}")

# Límites para outliers
lim_inf = q1 - 1.5 * iqr
lim_sup = q3 + 1.5 * iqr
print(f"Rango válido: [{lim_inf:.2f}, {lim_sup:.2f}]")

# Detectar outliers
mask_outliers = (alturas < lim_inf) | (alturas > lim_sup)
outliers = alturas[mask_outliers]
print(f"\\nOutliers detectados: {len(outliers)}")
print(f"Valores: {sorted(outliers)}")

# Estadísticas sin outliers
alturas_limpias = alturas[~mask_outliers]
print(f"\\nCon outliers:    media={alturas.mean():.2f}, std={alturas.std():.2f}")
print(f"Sin outliers:    media={alturas_limpias.mean():.2f}, std={alturas_limpias.std():.2f}")

# Z-score
z_scores = (alturas - alturas.mean()) / alturas.std()
print(f"\\nZ-scores de outliers: {z_scores[mask_outliers].round(2)}")`,
          output: `Q1=158.16, Q3=171.84, IQR=13.68
Rango válido: [137.64, 192.36]

Outliers detectados: 0
Valores: []

Con outliers:    media=164.99, std=9.91
Sin outliers:    media=164.99, std=9.91

Z-scores de outliers: []`,
        },
      },
    ],
  },
  youDo: {
    title: 'Student Exam Score Analyzer — Análisis vectorizado completo',
    context:
      'Vas a construir un analizador de notas usando SOLO NumPy (sin pandas todavía). Generas datos sintéticos de 500 alumnos en 5 cursos, calculas promedios, identificas top performers, normalizas, y guardas resultados. Es el tipo de análisis que te pueden pedir en una entrevista técnica para un puesto de Data Analyst en una universidad o EdTech.',
    objectives: [
      'Generar array (500, 5) con np.random.normal y clip',
      'Calcular promedios por alumno y por curso con axis',
      'Identificar top 10% con np.percentile y boolean masking',
      'Normalizar Min-Max y Z-score con broadcasting',
      'Benchmark loop vs vectorizado con time module',
    ],
    requirements: [
      'Generar notas (500, 5) con distribución realista',
      'Calcular promedio por alumno (axis=1) y por curso (axis=0)',
      'Top 10% con np.percentile(promedios, 90) y mask',
      'Normalización Min-Max: (notas - min) / (max - min)',
      'Normalización Z-score: (notas - mean) / std',
      'Guardar resultados con np.save',
      'Benchmark: comparar tiempo de suma loop vs vectorizada',
      'Reporte impreso con todas las estadísticas',
    ],
    starterCode: `import numpy as np
import time

def generar_datos(n_alumnos=500, n_cursos=5, seed=42):
    """Genera notas sintéticas realistas."""
    # TODO
    pass

def calcular_estadisticas(notas):
    """Calcula promedios, top, etc."""
    # TODO
    pass

def normalizar(notas, metodo="minmax"):
    """Normaliza por columna. metodo: 'minmax' o 'zscore'."""
    # TODO
    pass

def benchmark(notas):
    """Compara loop vs vectorizado."""
    # TODO
    pass

def main():
    # Pipeline completo
    pass

if __name__ == "__main__":
    main()`,
    portfolioNote:
      'En el README, incluye el resultado del benchmark (loop vs vectorizado) con números concretos. Esa comparación es la mejor demostración de que entiendes por qué NumPy es esencial. Los entrevistadores aman candidatos que pueden cuantificar performance.',
    rubric: [
      { criterion: 'Generación correcta de datos sintéticos', weight: '15%' },
      { criterion: 'Cálculo vectorizado de estadísticas (sin loops)', weight: '25%' },
      { criterion: 'Boolean masking correcto para top 10%', weight: '20%' },
      { criterion: 'Broadcasting aplicado en normalización', weight: '20%' },
      { criterion: 'Benchmark cuantitativo loop vs vector', weight: '10%' },
      { criterion: 'Código modular y documentado', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Por qué NumPy es más rápido que Python puro para operaciones numéricas?',
        options: [
          'Porque está escrito en Python',
          'Porque vectoriza operaciones a nivel C y usa instrucciones SIMD del CPU',
          'Porque usa menos memoria',
          'Porque tiene mejor algoritmo',
        ],
        correctIndex: 1,
        explanation:
          'NumPy delega los cálculos a código C optimizado que opera en lotes (vectorización) y aprovecha instrucciones vectoriales del CPU (SIMD). Los loops de Python interpretado son 50-100x más lentos para la misma operación.',
      },
      {
        question: '¿Qué devuelve `arr[arr > 5]`?',
        options: [
          'True/False array',
          'Solo los elementos mayores a 5',
          'Los índices donde arr > 5',
          'Error',
        ],
        correctIndex: 1,
        explanation:
          'Cuando usas un array booleano como índice, NumPy devuelve solo los elementos donde la condición es True. Es "boolean masking" y es la forma idiomática de filtrar arrays.',
      },
      {
        question: 'En broadcasting, ¿qué significa -1 en `arr.reshape(-1, 1)`?',
        options: [
          'Eliminar esa dimensión',
          'NumPy calcula esa dimensión automáticamente',
          'Crear dimensión de tamaño 1',
          'Transponer el array',
        ],
        correctIndex: 1,
        explanation:
          'El -1 es un wildcard: NumPy lo calcula automáticamente basado en el tamaño total. Para un array de 12 elementos, `reshape(-1, 1)` da (12, 1), `reshape(3, -1)` da (3, 4), `reshape(-1, 3)` da (4, 3).',
      },
      {
        question: '¿Qué hace `matriz.sum(axis=0)` en una matriz 2D?',
        options: [
          'Suma todos los elementos',
          'Suma por columnas (devuelve vector)',
          'Suma por filas (devuelve vector)',
          'Suma la diagonal',
        ],
        correctIndex: 1,
        explanation:
          '`axis=0` significa "a lo largo del eje 0" (filas), es decir, colapsa filas y suma por columnas. `axis=1` colapsa columnas y suma por filas. Es contra-intuitivo al principio: axis=0 → reduce filas → quedan columnas.',
      },
      {
        question: '¿Cuál es la forma correcta de combinar dos condiciones booleanas en NumPy?',
        options: [
          '(arr > 5) and (arr < 10)',
          '(arr > 5) & (arr < 10)',
          '(arr > 5) && (arr < 10)',
          'arr > 5 & arr < 10',
        ],
        correctIndex: 1,
        explanation:
          'En NumPy se usan operadores bitwise: & (and), | (or), ~ (not). Los paréntesis son OBLIGATORIOS porque & tiene mayor precedencia que >. Sin paréntesis daría error o resultado incorrecto.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'NumPy — Official docs', url: 'https://numpy.org/doc/stable/', note: 'Documentación oficial con tutoriales' },
      { label: 'NumPy — Broadcasting', url: 'https://numpy.org/doc/stable/user/basics.broadcasting.html', note: 'Reglas oficiales de broadcasting' },
      { label: 'Real Python — NumPy tutorial', url: 'https://realpython.com/numpy-tutorial/', note: 'Tutorial completo con ejemplos' },
    ],
    books: [
      { label: 'Python Apprentice to Master', note: 'Capítulo sobre NumPy y computación numérica.' },
    ],
    courses: [
      { label: 'Kaggle Learn — NumPy', url: 'https://www.kaggle.com/learn/numpy', note: 'Micro-curso gratuito interactivo' },
    ],
  },
}
