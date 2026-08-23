import type { CourseSection } from '../../types'

export const section14: CourseSection = {
  id: "security",
  index: 14,
  title: "NumPy y cómputo vectorizado",
  shortTitle: "NumPy vectorizado",
  tagline: "cálculo vectorizado de métricas de calidad y señales por pares, con benchmark honesto y resultados equivalentes al baseline",
  estimatedHours: 18,
  level: "Práctica independiente",
  phase: 1,
  icon: "Binary",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En data quality y analytics de banca, fintech y retail en Perú, el cómputo vectorizado con NumPy sostiene las métricas de completitud, unicidad y señales por pares. Aquí aprendes a operar arrays de miles de filas sin un bucle explícito, con benchmarks honestos y tests de tolerancia numérica (esto es, comparaciones que aceptan una diferencia mínima en vez de exigir igualdad exacta). Es la base para cualquier métrica de calidad de datos que un comité pueda auditar.",
  learningOutcomes: [
    { text: "Construir y validar ndarrays con dtype y shape correctos" },
    { text: "Indexar y filtrar con máscaras booleanas de forma segura" },
    { text: "Aplicar ufuncs y reducciones por eje (completitud, unicidad con np.unique)" },
    { text: "Resolver broadcasting y documentar compatibilidad de shapes" },
    { text: "Distinguir views de copies y controlar mutabilidad" },
    { text: "Manejar NaN/inf y evaluar estabilidad numérica" },
    { text: "Vectorizar frente a loops con benchmark honesto" },
    { text: "Medir memoria y probar equivalencia con tolerancia" },
  ],
  theory: [
    {
            heading: "Dejar de contar uno por uno",
      paragraphs: [
        "Hasta S13 tratabas cada caso por separado: un bucle recorre la lista, evalúa una regla y acumula. Funciona, se lee bien y con mil filas es instantáneo. Con dos millones deja de serlo, y el problema no es que Python sea lento — es que le estás pidiendo dos millones de decisiones pequeñas en vez de una grande.",
        "La diferencia es la de contar monedas de una en una frente a pesarlas todas juntas. Un **ndarray** de NumPy es un bloque de memoria donde todos los elementos tienen el mismo tipo y el mismo tamaño, y eso permite que la operación se aplique al bloque entero de una vez. Por eso importa el **dtype**, el tipo de cada elemento: es lo que hace posible ese tratamiento uniforme. Si mezclas textos y números, se pierde la ventaja y vuelves a contar monedas.",
        "El segundo concepto es la **forma**. Un array conoce sus dimensiones, y casi todo error de NumPy es un desacuerdo entre formas: sumar algo de diez elementos con algo de doce. La ventaja es que ese desacuerdo se detecta al instante en lugar de propagarse; la desventaja es que hay que aprender a leer el mensaje.",
        "De ahí sale la herramienta que reemplaza al `if` dentro del bucle. En vez de preguntar caso por caso, construyes una **máscara**: un array de verdaderos y falsos del mismo tamaño que los datos, que dice qué posiciones cumplen la condición. Filtrar es entonces aplicar la máscara, y contar es sumar los verdaderos. La condición se expresa una vez, sobre todo el conjunto.",
        "La pregunta que atraviesa la sección es un hábito nuevo: **¿estoy pidiendo una operación sobre todo el bloque, o lo estoy recorriendo a mano sin darme cuenta?** El hilo es un tablero de calidad —completitud, unicidad, rangos— sobre datos sintéticos. Aquí no entra pandas todavía: eso es S15.",
      ],
      callout: {
        type: "info",
        title: "Límite de esta sección",
        content:
          "Solo NumPy sobre datos sintéticos. No uses pandas (S15), sklearn ni PII real. Si el contrato dtype/shape falla, reporta el error; no lo ocultes. El foco es el tablero de calidad vectorizado: no deep learning ni frameworks de ML.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, ritmo y límites.",
        "**Orden de los subtemas.** T1 cubre arrays: dtype, forma y máscaras. T2 pasa a operaciones: funciones universales, reducciones y broadcast. T3 trata la semántica que más sorprende: vistas frente a copias, y NaN e infinito. T4 cierra con rendimiento, memoria y comparación aproximada.",
        "**Ritmo orientativo.** Unas dieciocho horas repartidas entre los cuatro subtemas, con el proyecto y el autochequeo al final.",
        "**Límites.** Solo NumPy sobre datos sintéticos: nada de pandas, sklearn ni datos personales reales. Si el contrato de tipo o forma falla, se reporta el error en lugar de ocultarlo. El foco es el tablero de calidad vectorizado, no el aprendizaje profundo.",
      ],
     },
     {
      heading: "ndarray, dtype y shape",
      subtopicId: "S14-T1-A",
      paragraphs: [
        "Tras S01–S13 trabajaste con listas y dicts de Python. Un **ndarray** es distinto: un bloque contiguo (o strided) de datos **homogéneos** — un solo tipo — que permite ufuncs en código compilado. **dtype** fija ese tipo (`float64`, `int32`, `uint8`); **shape** es la tupla de dimensiones; **ndim** = `len(shape)`; **itemsize** es bytes por elemento. Documentar este cuádruple es el contrato de entrada de toda métrica de CP-N2-A.",
        "Crear con dtype **explícito** evita sorpresas (`int` vs `float` en divisiones, o `object` lento y no vectorizable). Valida `arr.dtype`, `arr.shape` y `arr.ndim` al recibir un array de un pipeline; si no cuadra, `assert` o `ValueError` temprano (falla de forma segura). No “castées” en silencio a lo que el llamador no pidió.",
        "En calidad de datos, flags de completitud suelen ser `bool`/`uint8` (1 = presente); scores en [0, 1] son `float64`. Documenta también `nbytes` cuando el batch crece. Caso sintético: `flags` (4,) `uint8` y `scores` (4,) `float64` con meta impreso en el demo — es el contrato que reutilizarás en CP-N2-A.",
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
        "`np.array`, `arange`, `linspace` y `zeros`/`ones`/`full` crean arrays. **Indexación** clásica (`a[i]`, `a[i:j]`) y **fancy index** (indexación avanzada con lista de enteros, p. ej. `a[[0,2]]`) seleccionan elementos sin un loop Python por cliente. Esa diferencia importa: en un tablero de calidad con miles de filas sintéticas, el índice vectorizado evita el coste del intérprete en cada fila.",
        "Una **máscara booleana** `a > umbral` produce un array `bool` del mismo shape; `a[mask]` filtra. Es la forma idiomática de calidad: “clientes sintéticos con score bajo 0.5” o “región Lima y score bajo 0.6”. Combina condiciones con `&` / `|` (y paréntesis); no uses `and`/`or` de Python entre arrays. La máscara debe alinear el eje indexado — si no, `ValueError` (falla de forma segura).",
        "Filtrar con máscara suele devolver **copia** (o un 1D nuevo); no asumas que es un view ni mutes el padre por accidente. Caso sintético Lima/Arequipa/Cusco: `ids[score < 0.5]` → `C002`, `C004`; fancy index `score[[0, 2]]` recupera scores de dos clientes sin recorrer la lista a mano.",
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
        "Las **ufuncs** (`np.add`, `np.sqrt`, operadores `+`, `*`) aplican elemento a elemento en código compilado, sin un `for` Python por celda. Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan uno o más ejes. Son el corazón de las métricas del tablero: convierten una matriz de flags en un vector de completitud por campo.",
        "`axis=0` agrega por columna (campo); `axis=1` por fila (cliente). `keepdims=True` preserva dimensiones para rebroadcast (restar la media por fila sin pelear shapes). Elige el eje por el significado de negocio — “¿agrego clientes o campos?” — no por costumbre de copiar un notebook.",
        "Métricas del tablero: `mean(flags, axis=0)` = completitud por campo; `mean` por fila = completitud del cliente; `std(scores)` = dispersión. **Unicidad** de ids sintéticos: `n_unique / n = np.unique(ids).size / ids.size` (un duplicado en `C00x` baja la tasa; no uses `len(ids)/len(ids)`). Caso sintético: matriz 3×3 de presencia → completitud por campo ~[1.0, 0.67, 0.67] y global ~0.78; unicidad de `['C001','C002','C001']` → 2/3.",
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
        "El **broadcasting** alinea shapes de **derecha a izquierda**: en cada dimensión, los tamaños son iguales, o uno es 1, o la dimensión está ausente en el array de menor rango. Si no hay compatibilidad, NumPy lanza `ValueError` — mejor un error ruidoso que un producto silencioso mal alineado (por ejemplo, restar un umbral a la dimensión equivocada del tablero).",
        "`newaxis` / `None` inserta un eje de tamaño 1 para alinear vectores de filas o columnas (pesos por variable, umbral por cliente, o matriz de diferencias `score_i - score_j`). Es el mecanismo de las **señales por pares**: `agg[:, None] - agg[None, :]` produce una matriz (n, n) sin un doble loop Python.",
        "Documenta el shape esperado en el docstring y, si el batch puede cambiar de tamaño, aserta la compatibilidad antes de operar. Caso sintético: scores (3, 2) × pesos (2,) pondera bien; un intento (3, 2) + (3, 3) debe fallar con mensaje de broadcast y no “arreglarse” en silencio.",
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
      figure: {
        id: "S14-view-vs-copy",
        caption:
          "El corte no trae números nuevos: trae otra forma de mirar los mismos. La copia sí los trae, y por eso cuesta memoria — el precio de no afectar al original.",
        alt:
          "Arriba, un único bloque de cuatro celdas con dos nombres apuntando a él: el array original y una vista sobre parte de él; escribir en la vista cambia el bloque. Abajo, un bloque distinto y separado, con borde punteado, al que apunta la copia.",
      },
      subtopicId: "S14-T3-A",
      paragraphs: [
        "Un **view** comparte memoria con el array base (`arr.base is not None` a menudo); un **copy** es un bloque independiente. Los slices simples (`raw[:2]`, `raw[:]`) suelen ser views; fancy index y máscaras booleanas suelen copiar. Confundirlos es el bug más caro en un pipeline de calidad: normalizas un slice “temporal” y corrompes el raw que alimenta la auditoría.",
        "`arr.flags.writeable` (esto es, el flag que controla si el array admite escritura) decide si se puede mutar. Mutar un view muta el original — clásico cuando una función “solo normaliza un slice” y el llamador pierde los scores crudos. Para entradas de solo lectura, marca `writeable=False` o trabaja siempre sobre `.copy()` cuando la transformación escribe.",
        "Regla operativa del tablero CP-N2-A: **copia antes de mutar** si el array crudo se reutiliza (reprocess, logs, tests). Caso sintético: `vista = raw[:2]; vista[0] = 99` altera `raw`; la misma asignación sobre `raw[:2].copy()` deja el original intacto.",
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
        title: "Efectos colaterales por view",
        content:
          "Si pasas un slice a una función que escribe, puede corromper el array padre. Copia o marca `writeable=False`.",
      },
    },
    {
      heading: "NaN, inf y estabilidad numérica",
      subtopicId: "S14-T3-B",
      paragraphs: [
        "`np.nan` y `±inf` rompen `mean`/`sum` clásicos: NaN **contagia** (el resultado de la media es nan) e inf **domina** (una suma con inf es inf). Antes de publicar una métrica de negocio usa `np.isnan` / `isinf` / `isfinite`, o reducciones `nansum` / `nanmean` con la política documentada del tablero.",
        "`np.finfo(float).eps` acota el ruido de redondeo cuando comparas con tolerancia (`allclose`). Un overflow en float produce `inf`; no lo trates como un score válido de calidad. **Falla de forma segura** (fail-closed): si el batch trae inf donde no es semántico, rechaza el lote o filtra con traza — no sustituyas por 0 en silencio.",
        "En calidad de datos, un NaN **no es cero**: es **ausencia de medición**. Reporta la tasa de no-finitos aparte de la media de los finitos; mezclarlos distorsiona completitud y rangos. Caso sintético: `[1, nan, 3, inf]` → media solo sobre `isfinite` (= 2.0); convierte inf a nan antes de `nansum` si inf no es un valor de negocio.",
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
        "Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado (`dot`, ufuncs, `@` — el operador de producto matriz-vector). Para N grande (decenas de miles de clientes sintéticos del tablero), el ratio suele ser de órdenes de magnitud. El número exacto **depende de tu máquina**; por eso el demo reporta `ratio_gt_1` y no un SLA (acuerdo de nivel de servicio) fijo.",
        "Benchmark **honesto**: mismo input, mismo dtype, el contador monotónico `time.perf_counter` (no la función civil de reloj), reporta `ratio_loop_over_vec` y verifica **equivalencia numérica** (`allclose` o `abs(s_loop - s_vec) < 1e-6`). No midas N=10, no imprimas dentro del loop y no omitas el check de igualdad: un ratio sin equivalencia no demuestra que la versión vectorizada sea correcta. En producción conviene repetir mediciones y reportar la mediana; aquí un solo par de tiempos basta para enseñar el contrato.",
        "A veces un loop claro gana en N pequeño o con lógica irregular (early-exit, ramas por cliente). Documenta el umbral de N en la **nota del portfolio**. Caso sintético: `n=50_000` producto punto loop vs. `np.dot` con `equal True` y `ratio_gt_1 True` en una laptop típica — en el portfolio CP-N2-A repites el patrón con `X @ w`.",
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
        "`nbytes` y `itemsize * size` estiman la memoria del array en bytes (p. ej. 1000 float64 → 8000). En el tablero de calidad, una matriz de señales por pares es O(n²) — esto es, crece con el cuadrado del número de clientes —: con n=500 y float64 ya son ~2 MB; con n=50_000 sin cuidado agotas RAM. Evita `.copy()` innecesarios y documenta un **presupuesto** (`pair.nbytes <= max_bytes`) en la nota del portfolio.",
        "`np.allclose(a, b, rtol=, atol=)` compara floats con tolerancia relativa y absoluta. `np.testing.assert_allclose` lanza `AssertionError` con un mensaje útil — es el oráculo de tests del incremento CP-N2-A. `rtol` escala con la magnitud del valor; `atol` cubre diferencias cercanas a cero (scores en [0, 1] suelen priorizar un `atol` razonable).",
        "El baseline (la versión en loop que usas como referencia) y la versión vectorizada deben ser **equivalentes dentro de rtol/atol**; sin ese check, un ratio de tiempo no demuestra corrección. Caso sintético: `base` vs `base + 1e-9` pasa `allclose` con `atol=1e-8`; `base + 0.1` debe disparar `AssertionError` en el assert estricto y reportarse como fallo controlado.",
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
    except AssertionError:
        print("assert_fail", True)
    else:
        raise AssertionError("el caso negativo debía fallar")

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
    intro: "Yo demuestro (I Do): 8 demos de punta a punta. Cubren ocho frentes del tablero — contrato dtype/shape; máscaras; reducciones y unicidad; broadcast con señales por pares; views/copies; NaN/inf; benchmark honesto y allclose/memoria. Observa el patrón: asertar el contrato (validar dtype/shape y fallar si no cuadra) → calcular → imprimir evidencia. Datos sintéticos Lima/Arequipa/Cusco; solo NumPy.",
    steps: [
      {
        demoId: "S14-T1-A-DEMO",
        subtopicId: "S14-T1-A",
        environment: "local-python",
        description: "Crear arrays de flags y scores con dtype/shape documentados y validar ndim",
        preamble:
          "Antes de sumar completitud, el tablero CP-N2-A exige un **contrato** de array: filas = clientes, columnas = campos, dtype barato para flags y `float64` para scores. En esta demo `make_quality_arrays` construye flags 0/1 y scores sintéticos, y **aserta** shape y dtype antes de devolver. No escribas aún: predice `flags_shape`, `itemsize` de uint8 y `nbytes` de scores; si el contrato fallara, el assert detiene el pipeline (fail-closed), no “arregla” en silencio.",
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
        why: "Documentar dtype y shape evita ufuncs sobre `object` o divisiones enteras no deseadas. `itemsize` y `nbytes` anticipan el presupuesto de memoria del lote. El `assert` es el mismo hábito fail-closed que practicarás en We Do T1-A E3 (`validate`): si el contrato no cuadra, el pipeline se detiene. No se “casta” en silencio a lo que el llamador no pidió.",
        retrospective:
          "Si puedes explicar por qué un score en `int` o un flags 1D rompería las métricas sin mirar el código, ya tienes el hábito de contrato. El error clásico es confiar en el dtype por defecto. En We Do T1-A practicarás meta, `linspace` y validación fail-closed.",
      },
      {
        demoId: "S14-T1-B-DEMO",
        subtopicId: "S14-T1-B",
        environment: "local-python",
        description: "Indexar y filtrar clientes sintéticos con máscara booleana",
        preamble:
          "El tablero necesita “clientes sintéticos de Lima con score bajo 0.6” sin un `for` por fila. Sigue la demo: `region` y `score` se combinan con `&` (y paréntesis), no con `and` de Python. Predice la lista `filtrados` y el entero `count` antes de mirar la salida. Datos solo sintéticos (`C00x`, Lima/Arequipa/Cusco); la máscara debe alinear el eje o NumPy lanza `ValueError`.",
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
        why: "Las máscaras expresan reglas de calidad en un pase vectorizado, sin un loop Python por cliente. `mask.sum()` es el conteo del gate (cuántos cumplen). Combina condiciones con `&`/`|` y paréntesis; `and`/`or` de Python entre arrays falla. En We Do practicarás umbral con `where`, filtro por mediana y reorden con fancy index.",
        retrospective:
          "Si sabes por qué `and` entre arrays falla y `&` funciona, ya evitas el bug clásico del newbie. Pregunta de auto-chequeo: ¿la máscara y `ids` tienen la misma longitud? We Do: umbral con `where`, filtro por mediana y reorden con fancy index.",
      },
      {
        demoId: "S14-T2-A-DEMO",
        subtopicId: "S14-T2-A",
        environment: "local-python",
        description: "Reducir métricas de completitud y unicidad por campo/cliente con ufuncs",
        preamble:
          "Aquí el tablero deja de listar filas y empieza a **agregar**: media de presencia por campo (columnas) y por cliente (filas), más la tasa de unicidad de ids sintéticos. Observa la matriz 0/1 y el vector `ids` con un duplicado. Predice `completitud_campo` (¿qué campo es el más vacío?) y `unicidad` antes de leer la salida. Solo NumPy; un duplicado debe bajar la tasa por debajo de 1.0.",
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
        why: "La elección entre `axis=0` y `axis=1` es de negocio (¿agrego clientes o campos?), no un hábito de notebook. La unicidad se calcula como `np.unique(ids).size` dividido entre `ids.size`; usar `len(ids)/len(ids)` siempre da 1.0 y miente. La dispersión de completitud entre campos se resume con `std`.",
        retrospective:
          "Si puedes decir por qué la unicidad es 0.75 y no 1.0, ya detectas el truco `len/len`. We Do: mean por ejes, tasa de unicidad y centrado por fila con `keepdims`.",
      },
      {
        demoId: "S14-T2-B-DEMO",
        subtopicId: "S14-T2-B",
        environment: "local-python",
        description: "Alinear scores de clientes con pesos de campos vía broadcast explícito",
        preamble:
          "Las señales por pares del tablero necesitan una matriz n×n de diferencias de score agregado **sin** un doble `for` Python. Observa: primero se ponderan dimensiones con broadcast `(3,3)*(3,)`, se suma por cliente y luego `agg[:, None] - agg[None, :]`. Predice `agg`, el `diff_shape` y por qué `diff[0,0]` es 0.0. El assert de columnas vs pesos es el contrato de alineación.",
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
        why: "Broadcast documentado evita `ValueError` o, peor, alineaciones silenciosas malas (restar un umbral a la dimensión equivocada). La diagonal cero de la matriz de pares es el auto-chequeo: `score_i − score_i = 0`. El assert de columnas vs pesos es el mismo contrato que `pairwise_diff` del youDo.",
        retrospective:
          "Si explicas por qué la diagonal es cero sin mirar el código, entiendes “score_i − score_i”. We Do: sumar pesos a filas, producto exterior con `newaxis` y capturar broadcast incompatible.",
      },
      {
        demoId: "S14-T3-A-DEMO",
        subtopicId: "S14-T3-A",
        environment: "local-python",
        description: "Demostrar mutación vía view y aislar normalización con copy",
        preamble:
          "En calidad, el array crudo alimenta logs, reprocess y tests. Si normalizas un **view** (`raw[:]`), el raw se corrompe y la auditoría miente. Sigue el mal camino y el bueno: predice `raw_corrupto` tras `v /= v.max()` y luego `raw_ok` cuando usas `.copy()`. Solo datos sintéticos; el principio es mutabilidad, no el score en sí.",
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
        why: "Los slices simples suelen compartir memoria (view); fancy index y máscaras booleanas suelen copiar. Mutar un view muta el original: el bug más caro del pipeline de calidad. Regla operativa CP-N2-A: **copia antes de mutar** si el array crudo se reutiliza en auditoría, reprocess o tests.",
        retrospective:
          "Si puedes explicar por qué el primer `raw` ya no tiene 100.0, nunca volverás a “normalizar en sitio” sin pensarlo. We Do: forzar la mutación vía view, aislar con copy y bloquear escritura.",
      },
      {
        demoId: "S14-T3-B-DEMO",
        subtopicId: "S14-T3-B",
        environment: "local-python",
        description: "Calcular media robusta de scores ignorando NaN/inf documentados",
        preamble:
          "Un score ausente (`nan`) o no finito (`inf`) no es un 0 de calidad: contamina `mean` o domina la suma. Observa el vector mixto: cuenta válidos con `isfinite`, promedia solo finitos y compara con `nanmean` tras convertir inf a nan. Predice `n_valid` y `mean_robusta` antes de la salida. Política del tablero: documentar el filtro; no sustituir por 0 en silencio.",
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
        why: "NaN no es cero de negocio: es ausencia de medición. `nanmean` solo no basta si hay `inf` (hay que mapear inf→nan o filtrar con `isfinite`). Fail-closed o traza de no-finitos; no sustituyas por 0 en silencio. En We Do contarás NaN, promediarás omitiendo ausencias y limpiarás inf antes de sumar.",
        retrospective:
          "Si sabes por qué `mean` del vector crudo no es 0.7125, ya separas ausencia de valor. Auto-chequeo: ¿`nanmean` solo basta si aún hay `inf`? We Do: contar NaN, promediar omitiendo NaN y limpiar inf antes de sumar.",
      },
      {
        demoId: "S14-T4-A-DEMO",
        subtopicId: "S14-T4-A",
        environment: "local-python",
        description: "Comparar loop vs vectorizado para score ponderado con timing honesto",
        preamble:
          "Vectorizar el score ponderado del tablero solo se defiende si (1) el resultado **coincide** con el loop y (2) el tiempo del loop supera al de `X @ w` en N grande. Observa el demo con n=20_000: `perf_counter`, sin prints dentro del loop, `allclose` primero, luego `ratio_gt_1`. El número exacto del ratio **depende de tu máquina**; no lo trates como SLA del portfolio.",
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
        why: "Benchmark honesto: mismo input y dtype, el contador monotónico `time.perf_counter` (no la función civil de reloj), equivalencia (`allclose`) **antes** del ratio de tiempo. Un ratio sin equivalencia no demuestra que la versión vectorizada sea correcta. En CP-N2-A, `bench_weighted_mean` devuelve ambos; el número exacto del ratio depende de la máquina.",
        retrospective:
          "Si internalizas “allclose antes del ratio”, ya haces benchmarks honestos: un número de velocidad sin oráculo no demuestra corrección. El error clásico es publicar solo el ratio o tratarlo como SLA. Auto-chequeo: ¿qué reportarías si `allclose` fuera `False`? We Do: comparar sumas, suma de cuadrados y timing de suma vectorizada.",
      },
      {
        demoId: "S14-T4-B-DEMO",
        subtopicId: "S14-T4-B",
        environment: "local-python",
        description: "Test con np.allclose y presupuesto de memoria para matriz de señales",
        preamble:
          "Las señales por pares son O(n²): con n=500 y float64, `pair.nbytes` ya es ~2 MB. Observa el demo: construye la matriz con broadcast, compara con un **budget**, y valida equivalencia numérica con ruido 1e-10 vía `allclose` y `assert_allclose`. Predice `budget_ok` y por qué el assert no lanza. En el portfolio, documenta rtol/atol y el presupuesto; nunca PII real.",
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
    max_bytes = 2_500_000  # presupuesto independiente (2.5 MB)
    pair = base[:, None] - base[None, :]
    print("pair_nbytes", pair.nbytes, "budget_ok", pair.nbytes <= max_bytes)
    print("allclose", np.allclose(vec, vec_approx, rtol=1e-8, atol=1e-12))
    np.testing.assert_allclose(vec, vec_approx, rtol=1e-8, atol=1e-12)
    print("assert_ok", True)

s14_ido_8()`,
          output: `pair_nbytes 2000000 budget_ok True
allclose True
assert_ok True`,
        },
        why: "La memoria es contrato del incremento. Materializar n×n sin presupuesto agota RAM. El oráculo de tests de CP-N2-A es `assert_allclose` — esto es, lanza error si dos arrays no son equivalentes dentro de la tolerancia. La `rtol` (tolerancia relativa) escala con la magnitud. La `atol` (tolerancia absoluta) cubre cercanos a cero, útil en scores [0, 1]. Sin ese check, un ratio de tiempo no demuestra corrección.",
        retrospective:
          "Si sabes por qué 2e6 bytes es “ok” bajo el budget, ya piensas en memoria antes de materializar n×n. We Do: `nbytes` de float64, `allclose` con atol y un assert que **debe** fallar.",
      },
    ],
  },
  weDo: {
    intro: "Lo hacemos juntos (We Do): 24 micro-ejercicios (E1 guiado → E2 independiente → E3 transferencia) en los 8 subtemas. Cada **starter** (el código inicial que recibes) trae un **bug** deliberado — un defecto intencional que debes corregir. Corrígelo hasta igualar la salida esperada. En E1 las pistas son más directas; en E2 y E3 el apoyo se reduce. Solo NumPy (sin pandas ni sklearn).",
    steps: [
      {
        id: "S14-T1-A-E1",
        subtopicId: "S14-T1-A",
        kind: "guided",
        title: "Meta dtype/shape sin invertir ejes",
        preamble:
          "- **Contexto:** en el lote sintético del tablero, cada fila es un cliente y cada columna un campo de presencia.\n- **Meta:** crear `flags` con el contrato correcto e imprimir sus atributos.\n- **Éxito:** una línea `uint8 (3, 2) 2`.\n- **Límites:** solo NumPy; no inviertas la tupla `shape`; dtype debe ser `uint8` (no el `int64` por defecto).",
        instruction:
          "1. Abre el starter: el array está bien, pero se imprime `shape[::-1]` (bug).\n2. Crea `flags` con `np.array(..., dtype=np.uint8)` y la matriz dada.\n3. Imprime `dtype`, `shape` y `ndim` en ese orden (sin texto extra).\n4. Comprueba que no quede ningún `::-1`.",
        hint: "Usa np.array(..., dtype=np.uint8).",
        hints: [
          "Usa np.array(..., dtype=np.uint8).",
          "Imprime tres atributos: dtype, shape, ndim.",
        ],
        edgeCases: ["dtype incorrecto (int64 por defecto)", "shape transpuesta"],
        tests: "dtype == uint8; shape == (3, 2); ndim == 2",
        feedback:
          "Si ves `(2, 3)`, invertiste la forma al imprimir o construiste filas/columnas al revés. El contrato del tablero es filas×columnas = clientes×campos; `uint8` ahorra memoria frente a `int64` en flags 0/1.",
        retrospective:
          "Imprimir meta no es “debug de aficionado”: es el contrato que reutilizarás en asserts. El misconception es que “si se ve bien, el shape da igual”. Siguiente (E2): malla de scores con `linspace` y `nbytes`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · ndarray meta
# Bug a corregir: imprime shape invertida y dtype equivocado
import numpy as np
flags = np.array([[1, 0], [1, 1], [0, 1]], dtype=np.uint8)
print(flags.dtype, flags.shape[::-1], flags.ndim)`,
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
        title: "Scores con linspace y nbytes",
        preamble:
          "- **Contexto:** los scores del tablero viven en [0, 1] como malla controlada, no como enteros 0…4.\n- **Meta:** construir `scores` con `linspace` y reportar coste de memoria.\n- **Éxito:** `8 40 [0.0, 0.25, 0.5, 0.75, 1.0]`.\n- **Límites:** solo NumPy; `dtype=float64` (itemsize 8); no uses `arange` como sustituto de malla.",
        instruction:
          "1. El starter usa `arange(5)` e imprime solo la lista.\n2. Sustituye por una malla en [0, 1] con 5 puntos y `dtype=float64` (no enteros consecutivos).\n3. Imprime `itemsize`, `nbytes` y `tolist()` en una línea.\n4. Verifica mentalmente: 5 × 8 = 40.",
        hint: "linspace con dtype=float64.",
        hints: [
          "linspace con dtype=float64.",
          "nbytes = size * itemsize.",
        ],
        edgeCases: ["float32 por accidente", "endpoint de linspace"],
        tests: "itemsize == 8; nbytes == 40; valores = linspace(0,1,5)",
        feedback:
          "`arange` da enteros consecutivos, no una malla en [0, 1]. Usa `linspace` y verifica itemsize=8; ese mismo cálculo de `nbytes` escala al presupuesto de matrices n×n.",
        retrospective:
          "`nbytes = size × itemsize` es el mismo cálculo que el presupuesto de matrices n×n en T4-B. No confundes “cinco puntos” con “cinco enteros”. Luego (E3): rechazar arrays que no cumplan 1D float64.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · linspace nbytes
# Bug a corregir: arange no linspace; no imprime itemsize
import numpy as np
scores = np.arange(5, dtype=np.float64)
print(scores.tolist())`,
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
        title: "Validar 1D float64 o fallar",
        preamble:
          "- **Contexto:** una métrica de scores que recibe `int` o una matriz 2D miente en silencio si no valida.\n- **Meta:** `validate(a)` exige `ndim == 1` y `dtype == float64`.\n- **Éxito:** válido → `ok 2`; inválido (`[1, 2]`) → `err expected 1d float64`.\n- **Límites:** mensaje corto y estable; no “castees” a float en silencio; solo NumPy.",
        instruction:
          "1. Lee el DEFECT: `validate` solo imprime `ok` sin chequear.\n2. Si `ndim != 1` o `dtype != float64`, lanza `ValueError(\"expected 1d float64\")`.\n3. Si pasa, imprime `ok` y `size`.\n4. Ejecuta el caso válido y el `try/except` del fixture.",
        hint: "Comprueba ndim y dtype.",
        hints: [
          "Comprueba ndim y dtype.",
          "El mensaje del ValueError debe ser corto y estable.",
        ],
        edgeCases: ["aceptar int64", "no validar ndim"],
        tests: "válido → 'ok' + size; inválido (int) → ValueError expected 1d float64",
        feedback:
          "Valida `ndim == 1` y `dtype == float64`. Un array 1D de enteros también debe fallar: cast silencioso a float ocultaría el error del llamador.",
        retrospective:
          "Fail-closed es el mismo criterio del youDo (`completeness` rechaza 1D). Pregunta de cierre: ¿por qué un cast silencioso a float sería peor que un error ruidoso? Puente a T1-B: filtrar con máscaras sin romper longitudes.",
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
        title: "Índices con score >= 0.5",
        preamble:
          "- **Contexto:** el revisor del lote necesita las **posiciones** de clientes sintéticos que superan el umbral, no solo la lista de scores.\n- **Meta:** localizar índices 0-based con máscara y `np.where`.\n- **Éxito:** `[1, 3]` para `score = [0.2, 0.8, 0.4, 0.9]`.\n- **Límites:** solo NumPy; umbral inclusivo `>= 0.5`; no inventes un loop de índices a mano.",
        instruction:
          "1. El starter usa `score < 0.5` (complemento).\n2. Cambia a `score >= 0.5`.\n3. Toma `np.where(mask)[0]` y pásalo a lista.\n4. Imprime solo esa lista.",
        hint: "mask = score >= 0.5.",
        hints: [
          "mask = score >= 0.5.",
          "np.where(mask)[0].",
        ],
        edgeCases: ["comparación estricta >", "olvidar [0] en where"],
        tests: "índices donde score >= 0.5 → [1, 3]",
        feedback:
          "Si obtienes `[0, 2]`, filtraste el complemento. `where` devuelve una tupla de arrays por eje: en 1D usas `[0]`. El mismo patrón alimenta “quién cae bajo umbral” en el tablero.",
        retrospective:
          "Índice vectorizado es la base de fancy index y de reportes “filas problemáticas”. El misconception es confundir **posición** con **valor** del score. Auto-chequeo: si el umbral es inclusivo, ¿por qué `>` cambiaría el resultado? Siguiente: filtrar **ids** bajo la mediana (E2).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · boolean mask where
# Bug a corregir: umbral invertido < 0.5
import numpy as np
score = np.array([0.2, 0.8, 0.4, 0.9])
idx = np.where(score < 0.5)[0]
print(idx.tolist())`,
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
        title: "Ids bajo la mediana del lote",
        preamble:
          "- **Contexto:** en un batch sintético, “bajo” se define respecto del lote (mediana), no de un número mágico.\n- **Meta:** listar ids con `score < mediana`.\n- **Éxito:** `['C001', 'C003']`.\n- **Límites:** usa `np.median`; no hardcodes umbral 0.5; conserva el orden del array original.",
        instruction:
          "1. El starter filtra la mitad alta del lote (máscara invertida).\n2. Calcula la mediana del vector de scores (no un umbral fijo 0.5).\n3. Filtra los ids con score **bajo** esa mediana y pásalos a lista.\n4. Conserva el orden original; no uses `mean` en lugar de mediana.",
        hint: "np.median(scores).",
        hints: [
          "np.median(scores).",
          "ids[scores < med].",
        ],
        edgeCases: ["usar mean en vez de median", "máscara invertida"],
        tests: "ids con score < mediana; orden del array original",
        feedback:
          "Calcula la mediana sobre scores y filtra con máscara. Un umbral fijo inventado no se adapta al lote; invertir `>` vs `<` selecciona la mitad equivocada.",
        retrospective:
          "La mediana del lote es un umbral adaptativo del tablero. El error clásico es invertir la máscara o usar la media. Luego (E3): reordenar con fancy index, otra forma de seleccionar sin loop.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · mask by median
# Bug a corregir: scores > med (debería < med)
import numpy as np
ids = np.array(["C001", "C002", "C003", "C004"])
scores = np.array([0.1, 0.9, 0.4, 0.7])
med = np.median(scores)
print(ids[scores > med].tolist())`,
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
        title: "Reordenar con fancy index",
        preamble:
          "- **Contexto:** a veces el tablero necesita reordenar un vector de métricas según un ranking de índices, no ordenar los valores.\n- **Meta:** aplicar `a[order]` con `order = [2, 0, 3, 1]`.\n- **Éxito:** `[30, 10, 40, 20]`.\n- **Límites:** solo NumPy; sin loops; no uses `sorted` sobre los valores.",
        instruction:
          "1. El starter imprime `sorted(a.tolist())` (ordena valores).\n2. Usa el vector `order` como índice.\n3. Imprime `a[order].tolist()`.\n4. Comprueba que el primer elemento sea 30 (posición 2), no 10.",
        hint: "a[order] con lista de índices.",
        hints: [
          "a[order] con lista de índices.",
          "El resultado debe respetar el orden de los índices dados.",
        ],
        edgeCases: ["argsort confuso", "copia accidental del orden"],
        tests: "fancy index con [2,0,3,1] → [30, 10, 40, 20]",
        feedback:
          "Fancy index reordena con la lista de posiciones; no es un slice contiguo ni un `sorted` de valores. Si el primer elemento es 10, ordenaste valores en vez de posiciones.",
        retrospective:
          "Fancy index no es un slice contiguo ni un sort: es “tráeme estas posiciones en este orden”. Pregunta: ¿por qué `sorted` rompe el significado del ranking? Puente a T2-A: agregados por eje del tablero.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · fancy index order
# Bug a corregir: order mal aplicado (ordena valores en vez de posiciones)
import numpy as np
a = np.array([10, 20, 30, 40])
order = [2, 0, 3, 1]
print(sorted(a.tolist()))`,
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
        title: "Completitud: mean por columnas y filas",
        preamble:
          "- **Contexto:** el tablero publica un vector de completitud **por campo** y otro **por cliente**.\n- **Meta:** reducir una matriz 2×3 con `mean` en ambos ejes y redondear.\n- **Éxito:** primero `[1.0, 0.5, 0.5]`; luego `[0.67, 0.67]`.\n- **Límites:** solo NumPy; orden de impresión: axis=0 y después axis=1; redondeo a 2 decimales.",
        instruction:
          "1. El starter imprime primero axis=1 y sin `np.round`.\n2. Calcula `M.mean(axis=0)` y `M.mean(axis=1)`.\n3. Redondea con `np.round(..., 2)` y pasa a lista.\n4. Imprime columnas y luego filas.",
        hint: "M.mean(axis=0) y axis=1.",
        hints: [
          "M.mean(axis=0) y axis=1.",
          "np.round(..., 2).tolist().",
        ],
        edgeCases: ["axis invertido", "no redondear"],
        tests: "mean axis=0 y axis=1 redondeados a 2 decimales",
        feedback:
          "`axis=0` colapsa filas → un valor por columna (campo). `axis=1` colapsa columnas → un valor por fila (cliente). Invertir el eje o el orden de print rompe la lectura del tablero.",
        retrospective:
          "Elegir el eje es elegir el significado de negocio (campo vs cliente), no un hábito de notebook. El error clásico es imprimir filas primero o omitir el redondeo y “no coincidir” con el tablero. Siguiente: unicidad de ids con `np.unique` (E2).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · media por eje
# Bug a corregir: axis confuso; no redondea
import numpy as np
M = np.array([[1., 0., 1.], [1., 1., 0.]])
print(M.mean(axis=1).tolist())
print(M.mean(axis=0).tolist())`,
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
        title: "Tasa de unicidad con np.unique",
        preamble:
          "- **Contexto:** ids sintéticos duplicados inflan el lote y bajan la calidad del emparejamiento.\n- **Meta:** calcular `np.unique(ids).size / ids.size` con 4 decimales.\n- **Éxito:** `0.6` para el fixture de cinco ids con dos pares repetidos.\n- **Límites:** no uses `len(ids)/len(ids)`; no cuentes solo con `set` de Python si puedes usar NumPy.",
        instruction:
          "1. El starter divide `len(ids)/len(ids)` (siempre 1.0).\n2. Obtén el número de valores distintos con `np.unique(ids).size`.\n3. Divide entre `ids.size` y redondea a 4 decimales.\n4. Imprime solo ese float.",
        hint: "n_unique = np.unique(ids).size; tasa = n_unique / ids.size.",
        hints: [
          "n_unique = np.unique(ids).size; tasa = n_unique / ids.size.",
          "Redondea con round(..., 4) o imprime el float exacto 0.6.",
        ],
        edgeCases: ["contar con set de Python en vez de np.unique", "dividir por n_unique"],
        tests: "unicidad = unique.size / ids.size ≈ 0.6000",
        feedback:
          "`len(ids)/len(ids)` siempre da 1.0 y miente ante duplicados. La tasa correcta es `np.unique(ids).size / ids.size` — el mismo assert del youDo con un `C001` duplicado.",
        retrospective:
          "Unicidad 1.0 no es “éxito por defecto”: hay que medirla. El mismo assert aparece en el youDo (`0.75` con un `C001` duplicado). Luego (E3): centrar filas sin romper el broadcast.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · unicidad de ids
# Bug a corregir: usa len(ids) como si todos fueran únicos
import numpy as np
ids = np.array(["C001", "C002", "C001", "C003", "C002"])
unicidad = len(ids) / len(ids)  # siempre 1.0 — incorrecto
print(round(unicidad, 4))`,
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
        title: "Centrar filas con keepdims",
        preamble:
          "- **Contexto:** para comparar perfiles de cliente, a veces restas la media de **cada fila** sin pelear shapes.\n- **Meta:** centrar por fila (`axis=1`, `keepdims=True`) y verificar media ~0.\n- **Éxito:** `[0.0, 0.0, 0.0]`.\n- **Límites:** solo NumPy; no centres por columnas (`axis=0`); no omitas `keepdims`.",
        instruction:
          "1. El starter resta la media de **columnas** y luego promedia por el eje equivocado.\n2. Centra **por fila** de modo que el rebroadcast no pelee shapes (media de cada fila, eje de columnas colapsado con tamaño 1).\n3. Imprime la media por fila del resultado, redondeada.\n4. Debe ser un vector de ceros (dentro de redondeo).",
        hint: "row - row.mean(axis=1, keepdims=True).",
        hints: [
          "row - row.mean(axis=1, keepdims=True).",
          "Tras centrar bien, la media por fila es ~0.",
        ],
        edgeCases: ["olvidar keepdims", "axis=0"],
        tests: "media por fila tras centrar ≈ 0 (keepdims en axis=1)",
        feedback:
          "Si la media por fila no es ~0, o centraste por columnas (`axis=0`) o perdiste el eje al restar. Resta la media de cada fila de forma que la matriz y el vector de medias sigan alineados; el tablero usa el mismo truco al normalizar perfiles de cliente.",
        retrospective:
          "`keepdims` guarda el eje colapsado en tamaño 1 para rebroadcast. El misconception es “ya resté una media, da igual el eje”: con `axis=0` normalizas campos y la media por fila no se anula. Auto-chequeo: ¿qué shape tiene `X.mean(axis=1)` sin `keepdims` frente a `X`? Puente a T2-B: alinear pesos y scores con broadcast.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · centrar filas
# Bug a corregir: centra por columnas (axis=0)
import numpy as np
X = np.array([[1., 3.], [10., 20.], [2., 2.]])
Xc = X - X.mean(axis=0, keepdims=True)
print(np.round(Xc.mean(axis=0), 10).tolist())`,
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
        title: "Sumar pesos a cada fila (broadcast)",
        preamble:
          "- **Contexto:** a veces el tablero suma un vector de pesos a cada fila de una matriz de ceros (o de scores base).\n- **Meta:** broadcast de `w` shape `(3,)` sobre `M` shape `(2, 3)`.\n- **Éxito:** `[[1.0, 2.0, 3.0], [1.0, 2.0, 3.0]]`.\n- **Límites:** solo NumPy; operación `+`, no `*`; sin loops ni `tile` manual.",
        instruction:
          "1. El starter hace `M * w` (producto).\n2. Cambia a `M + w`.\n3. Imprime `.tolist()` de la matriz.\n4. Verifica que ambas filas sean iguales a los pesos.",
        hint: "zeros + pesos (shape (3,)).",
        hints: [
          "zeros + pesos (shape (3,)).",
          "Broadcast alinea por la derecha.",
        ],
        edgeCases: ["shape (2,) incompatible", "usar loop"],
        tests: "pesos (3,) sumados a cada fila de (2,3)",
        feedback:
          "Broadcast alinea el vector por la derecha con cada fila. Multiplicar por ceros deja todo en 0 y “parece que funcionó” sin el efecto de negocio. No repitas el vector a mano.",
        retrospective:
          "Sumar un vector a una matriz es el caso más simple de broadcast del tablero: el vector se alinea por la derecha a cada fila. El error clásico es multiplicar por ceros y creer que “funcionó” porque no hay excepción. Siguiente (E2): producto exterior con ejes insertados.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · broadcast add
# Bug a corregir: multiplica en vez de sumar
import numpy as np
M = np.zeros((2, 3))
w = np.array([1., 2., 3.])
print((M * w).tolist())`,
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
        title: "Producto exterior con newaxis",
        preamble:
          "- **Contexto:** una matriz de interacciones (cliente × factor) se arma alineando un vector columna con un vector fila.\n- **Meta:** obtener shape `(4, 3)` con broadcast de `a` y `b`.\n- **Éxito:** `(4, 3) [[0, 0, 0], [0, 1, 2], [0, 2, 4], [0, 3, 6]]`.\n- **Límites:** solo NumPy; no uses un doble loop; no dejes el `try/except` imprimiendo `fail`.",
        instruction:
          "1. El starter multiplica `(4,)` × `(3,)` y cae en error o wrong.\n2. Inserta un eje en `a` (columna) y opcionalmente en `b` (fila).\n3. Multiplica y imprime `shape` y `tolist()`.\n4. Comprueba la primera columna de ceros (porque `b[0]=0`).",
        hint: "Inserta un eje en `a` antes de multiplicar.",
        hints: [
          "Convierte `a` en columna antes de multiplicar por `b`.",
          "El producto exterior debe tener shape (4, 3); si ves fail o ValueError, los ejes aún no alinean.",
        ],
        edgeCases: ["broadcast a (3,4)", "outer manual incorrecto"],
        tests: "shape del producto == (4, 3); valores = a[:, None] * b",
        feedback:
          "Si ves `fail` o `ValueError`, los shapes `(4,)` y `(3,)` no se alinean sin un eje extra. Inserta dimensión en el vector que debe comportarse como **columna** (y, si hace falta, como **fila** en el otro). La primera columna de ceros del resultado confirma que `b[0]=0`, no un bug.",
        retrospective:
          "El outer product es el hermano menor de `pairwise_diff` del youDo: columna × fila → matriz de interacciones. El misconception es “si multiplico dos 1D, NumPy ya entiende filas y columnas”. Luego (E3): forzar y capturar la incompatibilidad a propósito.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · outer product broadcast
# Bug a corregir: a * b sin reshape (falla o resultado incorrecto)
import numpy as np
a = np.arange(4)
b = np.arange(3)
try:
    out = a * b
    print(out.shape, out.tolist())
except ValueError:
    print("fail")`,
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
        title: "Capturar broadcast incompatible",
        preamble:
          "- **Contexto:** un shape “casi” correcto en el tablero no debe “arreglarse” sumando lo que sí cabe.\n- **Meta:** forzar `(2,3)+(2,4)`, capturar `ValueError` e imprimir `incompatible`.\n- **Éxito:** `incompatible`.\n- **Límites:** no cambies el segundo array a (2,3) para que “pase”; solo NumPy.",
        instruction:
          "1. El starter suma dos `(2, 3)` y no captura error.\n2. Pon el segundo operando en shape `(2, 4)`.\n3. Envuelve en `try/except ValueError`.\n4. En el except, imprime solo `incompatible`.",
        hint: "try/except ValueError con shapes (2,3) y (2,4).",
        hints: [
          "Cambia el segundo array a shape (2, 4).",
          "El mensaje de error de NumPy menciona broadcast.",
        ],
        edgeCases: ["no capturar excepción", "shapes que sí broadcastan"],
        tests: "ValueError de broadcast → print incompatible",
        feedback:
          "Shapes `(2,3)+(2,4)` son incompatibles. Captura `ValueError` e imprime solo `incompatible`. No “arregles” el segundo array a `(2,3)` solo para ver un número: en el tablero un shape casi correcto debe fallar ruidoso, no alinearse a medias.",
        retrospective:
          "Un error ruidoso de broadcast es mejor que un producto silencioso mal alineado. Pregunta: ¿qué harías en un pipeline si el assert de columnas vs pesos falla? Puente a T3-A: no corrompas el raw al normalizar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · incompatible broadcast
# Bug a corregir: shapes compatibles (2,3)+(2,3) y sin try/except
import numpy as np
print(np.ones((2, 3)) + np.ones((2, 3)))`,
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
        title: "Demostrar que el view muta raw",
        preamble:
          "- **Contexto:** antes de copiar siempre, debes **ver** el efecto colateral de un slice.\n- **Meta:** mutar una view de los dos primeros elementos y observar `raw`.\n- **Éxito:** `[9, 2, 3]`.\n- **Límites:** no uses `.copy()` en este ejercicio; solo NumPy; es un demo controlado, no un patrón de producción.",
        instruction:
          "1. El starter hace `raw[:2].copy()` y el raw no cambia.\n2. Quita el `.copy()`: `v = raw[:2]`.\n3. Asigna `v[0] = 9` e imprime `raw.tolist()`.\n4. Confirma que el primer valor del original es 9.",
        hint: "raw[:2] es view.",
        hints: [
          "raw[:2] es view.",
          "Mutar vista muta raw.",
        ],
        edgeCases: ["usar copy por error", "fancy index copia"],
        tests: "raw mutado a [9, 2, 3] vía view",
        feedback:
          "Un slice simple es view: mutar `vista[0]` escribe en el buffer del padre. Si dejas `.copy()`, “arreglas” el síntoma y no aprendes el riesgo del pipeline.",
        retrospective:
          "Ver el bug es parte de la formación: no todo éxito es un raw intacto. Siguiente (E2): el patrón de producción — copiar antes de mutar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · vista muta
# Bug a corregir: copy() silencia el bug de view
import numpy as np
raw = np.array([1, 2, 3])
v = raw[:2].copy()
v[0] = 9
print(raw.tolist())`,
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
        title: "Aislar mutación con copy",
        preamble:
          "- **Contexto:** la normalización del tablero no puede reescribir el array que alimenta el reprocess.\n- **Meta:** mutar una copia y dejar `raw` en `[1, 2, 3]`.\n- **Éxito:** `[1, 2, 3] [9, 2]`.\n- **Límites:** usa `.copy()`; solo NumPy; imprime raw y copia en ese orden.",
        instruction:
          "1. El starter asigna sobre la view y corrompe raw.\n2. Cambia a `c = raw[:2].copy()`.\n3. Asigna `c[0] = 9`.\n4. Imprime `raw.tolist()` y `c.tolist()`.",
        hint: "raw[:2].copy().",
        hints: [
          "raw[:2].copy().",
          "Imprime raw y copia.",
        ],
        edgeCases: ["olvidar copy", "slice que no es view en todos los backends."],
        tests: "raw intacto [1, 2, 3] tras mutar la copia",
        feedback:
          "Necesitas `.copy()` antes de mutar. Sin copia, `c` sigue siendo view del original y la auditoría del raw miente aunque no reasignes el nombre `raw`. Imprime raw y copia en ese orden: raw intacto, copia con el 9.",
        retrospective:
          "Copia antes de mutar es la regla operativa de CP-N2-A. El misconception es “si no reasigno el nombre `raw`, el original está a salvo”. Luego (E3): bloquear escritura con flags.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · aislar con copy
# Bug a corregir: view sin copy; raw muta
import numpy as np
raw = np.array([1, 2, 3])
c = raw[:2]
c[0] = 9
print(raw.tolist(), c.tolist())`,
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
        title: "Bloquear escritura con writeable=False",
        preamble:
          "- **Contexto:** a veces pasas un array crudo a una función de normalización y quieres **fallar** si intenta escribir.\n- **Meta:** marcar `writeable=False`, intentar asignar y capturar el error.\n- **Éxito:** `blocked`.\n- **Límites:** solo NumPy; captura `ValueError` (no un `print` del array mutado).",
        instruction:
          "1. El starter asigna `a[0]=3` e imprime el array.\n2. Pon `a.flags.writeable = False` antes de asignar.\n3. Envuelve la asignación en `try/except ValueError`.\n4. En el except, imprime `blocked`.",
        hint: "a.flags.writeable = False.",
        hints: [
          "Marca el flag de escritura del array como desactivado antes de asignar.",
          "La asignación sobre un array no escribible lanza ValueError; captura e imprime blocked.",
        ],
        edgeCases: ["no desactivar writeable", "capturar Exception genérica sin print"],
        tests: "writeable=False → ValueError al asignar",
        feedback:
          "Marca `flags.writeable = False` y captura `ValueError` al intentar `a[0] = …`. Si imprimes el array mutado, no estás defendiendo el contrato de solo lectura.",
        retrospective:
          "`writeable=False` es defensa de contrato, no maquillaje: la función de normalización debe **fallar** si intenta escribir. Auto-chequeo: ¿cuándo preferirías `.copy()` (trabajar aislado) vs `writeable=False` (rechazar escritura)? Puente a T3-B: NaN/inf también “rompen” métricas si no hay política.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · writeable False
# Bug a corregir: no activa writeable=False; muta
import numpy as np
a = np.array([1.0, 2.0])
a[0] = 3.0
print(a.tolist())`,
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
        title: "Contar NaN con isnan",
        preamble:
          "- **Contexto:** el tablero reporta la **tasa de ausencia**, no solo la media de lo presente.\n- **Meta:** contar NaN en `[1, nan, 2, nan]` con `np.isnan`.\n- **Éxito:** `2`.\n- **Límites:** no uses `x == np.nan` (siempre False); no cuentes `inf` como NaN.",
        instruction:
          "1. El starter suma `(x == np.nan)` y obtiene 0.\n2. Usa `np.isnan(x).sum()`.\n3. Imprime el entero.\n4. Verifica mentalmente: dos posiciones con nan.",
        hint: "np.isnan(x).sum().",
        hints: [
          "np.isnan(x).sum().",
          "Imprime int.",
        ],
        edgeCases: ["usar x == np.nan (siempre False)", "contar inf"],
        tests: "isnan(...).sum() == 2",
        feedback:
          "IEEE hace que NaN no sea igual a sí mismo; por eso `==` miente y da 0. `np.isnan` (o `~np.isfinite` con cuidado) es el detector idiomático del tablero.",
        retrospective:
          "Contar ausencias es tan importante como promediar presentes: el tablero publica tasa de NaN aparte de la media. El misconception es “`x == np.nan` detecta huecos” — IEEE hace que NaN no sea igual a sí mismo. Auto-chequeo: ¿contarías `inf` con `isnan`? Siguiente: `nanmean` vs `mean` (E2).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · count nan
# Bug a corregir: usa sum de nan == nan (incorrecto)
import numpy as np
x = np.array([1.0, np.nan, 2.0, np.nan])
print(int((x == np.nan).sum()))`,
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
        title: "Media omitiendo NaN",
        preamble:
          "- **Contexto:** publicar `nan` como “media del lote” rompe el dashboard de negocio.\n- **Meta:** promediar `[1, nan, 3]` omitiendo NaN.\n- **Éxito:** `2.0`.\n- **Límites:** usa `np.nanmean` (o filtra con `isnan`); no rellenes NaN con 0 sin documentarlo.",
        instruction:
          "1. El starter usa `np.mean` y propaga nan.\n2. Cambia a `np.nanmean`.\n3. Imprime el float redondeado a 2 decimales.\n4. Resultado esperado: 2.0.",
        hint: "np.nanmean.",
        hints: [
          "np.nanmean.",
          "Resultado 2.0.",
        ],
        edgeCases: ["mean normal da nan", "redondeo"],
        tests: "nanmean([1,nan,3]) == 2.0",
        feedback:
          "`np.mean` propaga NaN y el dashboard se llena de “sin dato”. `np.nanmean` omite NaNs y promedia el resto: es una política documentada, no un relleno silencioso con 0.",
        retrospective:
          "`nanmean` documenta una política: “ausencia no entra al promedio”. No es lo mismo que tratar ausencia como cero. Luego (E3): `inf` tampoco es un valor de negocio.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · nanmean
# Bug a corregir: mean propaga nan
import numpy as np
x = np.array([1.0, np.nan, 3.0])
print(float(np.mean(x)))`,
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
        title: "Inf a nan y luego nansum",
        preamble:
          "- **Contexto:** un overflow o valor no finito no debe volverse un “score total infinito” en el tablero.\n- **Meta:** reemplazar `inf` por `nan` y sumar con `nansum`.\n- **Éxito:** `3.0` para `[1, inf, 2]`.\n- **Límites:** solo NumPy; no uses `sum` crudo sobre inf; documenta la conversión.",
        instruction:
          "1. El starter hace `np.sum` y obtiene `inf`.\n2. Antes de agregar, convierte los no-finitos `inf` en `nan` (no dejes el `inf` intacto).\n3. Suma omitiendo NaN e imprime el float.\n4. Confirma 1+2=3 (el `inf` no debe dominar).",
        hint: "Detecta inf (`isinf`) y conviértelo a nan antes de agregar.",
        hints: [
          "Detecta inf y conviértelo a nan antes de agregar (`isinf` / `where`).",
          "nansum ignora nan; inf no se omite solo con nansum.",
        ],
        edgeCases: ["sum con inf da inf", "no convertir inf"],
        tests: "inf→nan y nansum → 3.0",
        feedback:
          "Sustituye inf por nan (`np.where`/`isinf`) y luego `nansum`; un `sum` con inf devuelve inf y el tablero publica basura. `nansum` solo no basta si dejas el inf intacto.",
        retrospective:
          "`inf` no se omite solo: hay que convertirlo o filtrar con `isfinite`. El youDo (`in_range_rate`) exige finitos en rango; el mismo hábito. Puente a T4-A: equivalencia loop vs vectorizado.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · inf → nan then nansum
# Bug a corregir: suma con inf
import numpy as np
x = np.array([1.0, np.inf, 2.0])
print(float(np.sum(x)))`,
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
        title: "Equivalencia loop y suma vectorizada",
        preamble:
          "- **Contexto:** un ratio de tiempo sin chequear igualdad no demuestra que la versión vectorizada sea correcta.\n- **Meta:** sumar `a*b` con loop y con `(a*b).sum()` y comparar con tolerancia.\n- **Éxito:** `True` (`abs(diff) < 1e-6`).\n- **Límites:** `arange(1000, dtype=float)`; no imprimas un booleano fijo; solo NumPy + aritmética.",
        instruction:
          "1. El starter calcula `s2` vectorizado e imprime `False`.\n2. Acumula `s1` con un `for` sobre índices.\n3. Compara `abs(s1 - s2) < 1e-6`.\n4. Imprime solo ese booleano.",
        hint: "np.arange(1000, dtype=float).",
        hints: [
          "np.arange(1000, dtype=float).",
          "Compara resultados no tiempos.",
        ],
        edgeCases: ["int overflow en loop", "comparar identidades"],
        tests: "abs(loop - vec) < 1e-6 → True",
        feedback:
          "Imprimir `False` fijo “pasa el gesto” pero no el contrato. Primero equivalencia; el timing llega en E3. Usa float para evitar rarezas de tipo.",
        retrospective:
          "Equivalencia es el oráculo del portfolio: sin comparar loop y vectorizado, el timing no demuestra nada. El error clásico es imprimir un booleano fijo o solo mirar tiempos. Auto-chequeo: ¿por qué `dtype=float` aquí? Siguiente: una reducción vectorizada concreta (suma de cuadrados) sin loop.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · vectorized vs loop
# Bug a corregir: no compara; imprime False
import numpy as np
a = np.arange(1000, dtype=float)
b = a.copy()
s1 = float((a * b).sum())
print(False)`,
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
        title: "Suma de cuadrados vectorizada",
        preamble:
          "- **Contexto:** varias métricas del tablero elevan scores al cuadrado antes de agregar (energía, norma al cuadrado).\n- **Meta:** sumar los cuadrados de `arange(5)` de forma vectorizada.\n- **Éxito:** `30.0`.\n- **Límites:** solo NumPy; no sumes `a` lineal (eso da 10); dtype float.",
        instruction:
          "1. El starter hace `a.sum()` (0+1+2+3+4).\n2. Eleva al cuadrado: `a**2` o `np.square(a)`.\n3. Suma e imprime el float.\n4. Verifica 0+1+4+9+16 = 30.",
        hint: "(a**2).sum() o np.dot(a,a).",
        hints: [
          "(a**2).sum() o np.dot(a,a).",
          "Resultado 0+1+4+9+16=30.",
        ],
        edgeCases: ["olvidar dtype float", "sumar a no a**2"],
        tests: "suma de cuadrados de arange(5) == 30",
        feedback:
          "Si obtienes `10.0`, sumaste la serie lineal (0+1+2+3+4), no los cuadrados. Usa elevación al cuadrado y luego reduce; el tablero comete el mismo error cuando “vectoriza” la métrica equivocada.",
        retrospective:
          "La ufunc correcta es tan importante como “usar NumPy”. Un sum lineal “parece vectorizado” pero mide otra cosa (energía/norma al cuadrado ≠ suma de scores). Luego (E3): medir tiempo y verificar la media del resultado, no solo un elemento.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · sum squares
# Bug a corregir: suma lineal no cuadrados
import numpy as np
a = np.arange(5, dtype=float)
print(float(a.sum()))`,
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
        title: "Timing de suma vectorizada con chequeo",
        preamble:
          "- **Contexto:** el portfolio documenta tiempo de la operación vectorizada, no de un loop de aprendizaje.\n- **Meta:** medir `a+b` con `perf_counter` y verificar `mean == 1.0`.\n- **Éxito:** `timed True`.\n- **Límites:** n=10000; zeros + ones; no midas el loop del starter; no imprimas el float del tiempo (solo la etiqueta y el booleano).",
        instruction:
          "1. El starter llena `c` con un loop y chequea solo `c[0]`.\n2. Sustituye el cuerpo por `c = a + b` entre dos `perf_counter`.\n3. Verifica `float(c.mean()) == 1.0`.\n4. Imprime `\"timed\"` y el booleano.",
        hint: "time.perf_counter antes/después.",
        hints: [
          "time.perf_counter antes/después de la operación vectorizada.",
          "El booleano resume la verificación del resultado (mean), no solo el primer elemento.",
        ],
        edgeCases: ["no crear arrays", "mean != 1"],
        tests: "timed True tras (a+b).mean() == 1.0",
        feedback:
          "Mide solo la operación vectorizada (`a + b`) y verifica `mean == 1.0`. Chequear solo `c[0]` deja pasar un array a medias; no midas el loop del starter ni imprimas el float del tiempo — solo la etiqueta y el booleano.",
        retrospective:
          "Un micro-bench honesto mide la operación que publicarás, no el andamiaje del ejercicio. Pregunta: ¿por qué chequear mean y no solo el primer elemento? Puente a T4-B: memoria y `allclose`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · suma vectorizada cronometrada
# Bug a corregir: loop lento sin verificar la media
import numpy as np, time
n = 10000
a = np.zeros(n)
b = np.ones(n)
c = np.empty(n)
for i in range(n):
    c[i] = a[i] + b[i]
print("timed", float(c[0]) == 1.0)`,
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
        title: "nbytes de 1000 float64",
        preamble:
          "- **Contexto:** el presupuesto de memoria del tablero empieza por `itemsize × size`.\n- **Meta:** reportar `nbytes` de 1000 float64 y validar 8000.\n- **Éxito:** `8000 True`.\n- **Límites:** `dtype=np.float64`; no uses el presupuesto de float32 (4000).",
        instruction:
          "1. El starter compara con 4000.\n2. Calcula o recuerda: 8 bytes × 1000 = 8000.\n3. Imprime `a.nbytes` y `a.nbytes == 8000`.\n4. Sin texto extra.",
        hint: "float64 = 8 bytes.",
        hints: [
          "float64 = 8 bytes.",
          "print nbytes y comparación.",
        ],
        edgeCases: ["float32", "shape 2d"],
        tests: "nbytes == 8000 para 1000 float64",
        feedback:
          "float64 = 8 bytes/elemento → 1000×8=8000. Comparar con 4000 es el error de “pensé en float32”. El mismo hábito escala a matrices n×n del demo.",
        retrospective:
          "`nbytes` es evidencia de portfolio, no un print ornamental: `itemsize × size` es el mismo hábito que el budget n×n del demo. El misconception es “pensé en float32” (4000). Auto-chequeo: ¿cuántos bytes tiene una matriz 500×500 float64? Siguiente: comparar floats con tolerancia (E2).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · nbytes float64
# Bug a corregir: compara nbytes con 4000 (como si fuera float32)
import numpy as np
a = np.zeros(1000, dtype=np.float64)
print(a.nbytes, a.nbytes == 4000)`,
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
        title: "allclose con atol en floats",
        preamble:
          "- **Contexto:** loop y vectorizado raramente coinciden bit a bit; el oráculo del tablero es tolerancia.\n- **Meta:** `np.allclose` entre `[1.0, 2.0]` y un vecino a 1e-9 con `atol=1e-8`.\n- **Éxito:** `True`.\n- **Límites:** no uses igualdad exacta `==`; solo NumPy.",
        instruction:
          "1. El starter hace igualdad exacta elemento a elemento y obtiene False.\n2. Compara los dos vectores con tolerancia absoluta adecuada al ruido 1e-9 del fixture (orden 1e-8).\n3. Imprime solo el booleano.\n4. No aprietes la tolerancia por debajo del ruido del fixture.",
        hint: "Compara con tolerancia absoluta del orden 1e-8 (ruido del fixture ~1e-9).",
        hints: [
          "Compara con tolerancia absoluta del orden 1e-8 (ruido del fixture ~1e-9).",
          "Debe ser True; no uses igualdad exacta elemento a elemento.",
        ],
        edgeCases: ["atol demasiado estricto", "listas sin numpy"],
        tests: "allclose(..., atol=1e-8) → True",
        feedback:
          "La igualdad exacta (`==`) falla con 1e-9 de ruido numérico. `np.allclose` con `atol=1e-8` es el mismo oráculo que une loop y vectorizado en el portfolio.",
        retrospective:
          "`allclose` (y `assert_allclose` en tests) es el puente entre “más rápido” y “igual de correcto”. El misconception es “si no son idénticos bit a bit, falló la vectorización”. Luego (E3): forzar un fallo controlado del assert.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-014 · allclose con atol
# Bug a corregir: comparación exacta (==) en floats
import numpy as np
a = np.array([1.0, 2.0])
b = np.array([1.0 + 1e-9, 2.0])
# Exacta elemento a elemento: no es el booleano de equivalencia con tolerancia
print(bool((a == b).all()))`,
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
        title: "assert_allclose que debe fallar",
        preamble:
          "- **Contexto:** un test que solo ve el camino feliz no protege el tablero.\n- **Meta:** forzar diferencia 0.1 con `atol=1e-3`, capturar `AssertionError` e imprimir `fail`.\n- **Éxito:** `fail`.\n- **Límites:** no dejes arrays idénticos; no imprimas `ok` en el camino feliz de este ejercicio.",
        instruction:
          "1. El starter compara `[0,0]` consigo mismo y cae en `ok`.\n2. Cambia el segundo vector a incluir `0.1`.\n3. Llama `np.testing.assert_allclose(..., atol=1e-3)`.\n4. En `except AssertionError`, imprime `fail`.",
        hint: "np.testing.assert_allclose.",
        hints: [
          "np.testing.assert_allclose.",
          "La rama except debe ser la única que imprime fail.",
        ],
        edgeCases: ["atol que pasa el test", "no capturar"],
        tests: "assert_allclose falla → print fail",
        feedback:
          "Fuerza una diferencia mayor que `atol` (por ejemplo, 0.1) y captura `AssertionError`. Si los arrays son idénticos, el assert no falla y el test “verde” no protege nada.",
        retrospective:
          "Diseñar el fallo es parte del oficio: el assert debe doler cuando la métrica se desvía. Cierre del tramo We Do: ya puedes defender contratos, máscaras, ejes, broadcast, mutabilidad, NaN y equivalencia numérica en el youDo CP-N2-A.",
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
      "Tú lo haces (You Do). Eres analista de data quality en una fintech peruana. Implementas el núcleo vectorizado del tablero de calidad con arrays sintéticos de flags de completitud e ids/scores por cliente (Lima/Arequipa/Cusco, `C00x`). El entregable: métricas, señales por pares, benchmark loop vs. `@` (el operador de producto matriz-vector) y tests `allclose` (esto es, comparación con tolerancia). Sin PII real (datos personales identificables reales). Este incremento abre **CP-N2-A**.",
    objectives: [
      "Implementar métricas de calidad vectorizadas (completitud por campo, unicidad de ids, tasa en rango)",
      "Calcular señales por pares con broadcasting documentado (matriz n×n)",
      "Benchmark loop vs vectorizado con equivalencia numérica (`allclose`)",
      "Presupuesto de memoria y tests reproducibles sobre fixtures sintéticos",
    ],
    requirements: [
      "Fixtures sintéticos (ids C00x; flags 0/1; scores en [0,1] con posibles NaN/inf en tests de borde)",
      "Cinco funciones: completeness, uniqueness_rate, in_range_rate, pairwise_diff, bench_weighted_mean",
      "Suite de asserts en _run_tests() que demuestre correctitud (no solo prints)",
      "main() + if __name__ == '__main__' reproducible",
      "Documentación en español profesional: shapes, dtypes, rtol/atol y nota de que el ratio de tiempo depende de la máquina",
      "Sin PII real; sin pandas ni sklearn",
    ],
    starterCode: `"""quality_board_numpy.py — incremento CP-N2-A (S14)
Tablero de calidad vectorizado sobre datos sintéticos (Perú).
Implementa las cinco funciones y haz pasar _run_tests().
Solo NumPy. Sin PII real.
"""

from __future__ import annotations

import time
import numpy as np


def completeness(flags: np.ndarray) -> np.ndarray:
    """flags: (n_clients, n_fields) con 0/1 → media por campo (axis=0).

    Contrato: flags.dtype numérico o booleano; ndim == 2.
    Si ndim != 2, lanza ValueError (fail-closed).
    """
    # Implementa: valida ndim; media por campo (axis=0)
    raise NotImplementedError


def uniqueness_rate(ids: np.ndarray) -> float:
    """Proporción de ids únicos: np.unique(ids).size / ids.size."""
    # Implementa: np.unique — no uses len(ids)/len(ids)
    raise NotImplementedError


def in_range_rate(scores: np.ndarray, lo: float = 0.0, hi: float = 1.0) -> float:
    """Fracción de scores finitos dentro de [lo, hi] inclusive.

    NaN e inf no cuentan como “en rango”. Denominador = scores.size.
    """
    # Implementa: isfinite y máscara de rango; cuenta / size
    raise NotImplementedError


def pairwise_diff(scores: np.ndarray) -> np.ndarray:
    """scores (n,) → matriz (n, n) de diferencias score_i - score_j.

    Usa broadcast (newaxis); diagonal debe ser 0.0.
    """
    # Implementa: scores[:, None] - scores[None, :]
    raise NotImplementedError


def bench_weighted_mean(X: np.ndarray, w: np.ndarray) -> dict:
    """Compara loop vs X @ w.

    Devuelve dict con claves: allclose (bool), ratio_loop_over_vec (float),
    t_loop (float), t_vec (float). Mismo input/dtype; no imprimas en el loop.
    """
    # Implementa: loop, X @ w, allclose, tiempos con time.perf_counter
    raise NotImplementedError


def _run_tests() -> None:
    flags = np.array([[1, 1, 0], [1, 0, 1], [1, 1, 1]], dtype=float)
    comp = completeness(flags)
    assert comp.shape == (3,)
    assert np.allclose(comp, np.array([1.0, 2 / 3, 2 / 3]))

    # fail-closed: 1D no es matriz de flags
    try:
        completeness(np.array([1, 0, 1], dtype=float))
        raise AssertionError("expected ValueError for 1D flags")
    except ValueError:
        pass

    ids = np.array(["C001", "C002", "C001", "C003"])
    u = uniqueness_rate(ids)
    assert abs(u - 0.75) < 1e-9

    scores = np.array([0.9, 0.4, 0.85, 0.7, np.nan], dtype=np.float64)
    r = in_range_rate(scores, 0.0, 1.0)
    # 4 finitos en [0,1] de 5 elementos → 0.8
    assert abs(r - 0.8) < 1e-9

    # inf no es “en rango”; 2 finitos en rango de 4 elementos → 0.5
    scores_inf = np.array([0.5, np.inf, 0.2, -np.inf], dtype=np.float64)
    r_inf = in_range_rate(scores_inf, 0.0, 1.0)
    assert abs(r_inf - 0.5) < 1e-9

    s = np.array([0.9, 0.4, 0.85], dtype=np.float64)
    D = pairwise_diff(s)
    assert D.shape == (3, 3)
    assert abs(D[0, 0]) < 1e-12
    assert np.allclose(D, s[:, None] - s[None, :])

    X = np.array([[0.9, 0.1], [0.4, 0.6], [0.85, 0.15]], dtype=np.float64)
    w = np.array([0.7, 0.3], dtype=np.float64)
    bench = bench_weighted_mean(X, w)
    assert bench["allclose"] is True
    assert bench["ratio_loop_over_vec"] > 0.0
    assert "t_loop" in bench and "t_vec" in bench

    print("tests OK")


def main() -> None:
    _run_tests()
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


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Este incremento abre CP-N2-A (Executive Data Quality & EDA). En el README del repo documenta:\n\n- shapes y dtypes de cada métrica;\n- el `rtol`/`atol` de `allclose`;\n- el presupuesto de memoria si calculas matrices n×n;\n- que el ratio de tiempo depende de la máquina (no es un SLA).\n\nSube solo datos sintéticos — nunca PII real.",
    rubric: [
      { criterion: "Métricas vectorizadas correctas (completitud, unicidad, rangos) con shapes documentados", weight: "25%" },
      { criterion: "Señales por pares y benchmark con equivalencia allclose demostrada", weight: "20%" },
      { criterion: "Privacidad: sin PII real, sin secretos, fixtures sintéticos", weight: "20%" },
      { criterion: "Pruebas (_run_tests) y casos de borde (NaN, shapes) documentados", weight: "15%" },
      { criterion: "Código legible, contratos dtype/shape y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional (nota de portfolio)", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con `_run_tests` (shape de completitud, unicidad < 1 con duplicado, `in_range_rate` con NaN/inf, diagonal 0 de pares, `allclose` del bench)? (2) ¿qué harías distinto con PII real vs. sintéticos `C00x`? (3) En el README, una frase de impacto medible (p. ej. “métricas vectorizadas equivalentes al baseline en loop dentro de atol X; presupuesto n×n documentado”) que puedas defender en 30 segundos. El ratio de tiempo **no** es el SLA: la equivalencia y el contrato dtype/shape sí lo son.",
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
        options: ["Reordenar los elementos que cumplen la condición al inicio", "Contar cuántos elementos cumplen sin devolverlos", "Reemplazar por NaN los elementos que no cumplen", "Filtrar o seleccionar elementos que cumplen la condición"],
        correctIndex: 3,
        explanation:
          "Las máscaras booleanas filtran/seleccionan de forma vectorizada.",
      },
      {
        question: "axis=0 en una reducción sobre una matriz 2D suele agregar:",
        options: ["Por columna (colapsa filas)", "Por fila (colapsa columnas)", "Solo el elemento 0,0", "Nada; axis solo existe en pandas"],
        correctIndex: 0,
        explanation:
          "axis=0 reduce a lo largo de las filas → un valor por columna.",
      },
      {
        question: "Mutar un slice simple de un ndarray normalmente:",
        options: ["Nunca afecta al original: el corte siempre copia", "Afecta al original solo si el corte no es contiguo", "Puede mutar el array base porque suele ser un view", "Afecta al original solo si los dtypes coinciden"],
        correctIndex: 2,
        explanation:
          "Los slices simples suelen ser views que comparten memoria.",
      },
      {
        question: "¿Por qué np.mean([1, np.nan]) no es lo mismo que np.nanmean([1, np.nan])?",
        options: ["mean ignora nan; nanmean propaga nan", "mean propaga nan; nanmean omite nan", "Son idénticos siempre", "nanmean solo funciona con int"],
        correctIndex: 1,
        explanation:
          "np.mean propaga NaN (el resultado es nan). np.nanmean omite NaNs y promedia el resto. En calidad de datos usa isfinite/nanmean según la política.",
      },
      {
        question: "¿Cuándo son compatibles dos shapes para broadcasting?",
        options: ["Solo si las formas son idénticas en todas las dimensiones", "Si el producto de las dimensiones coincide", "Solo si una de las dos formas tiene una única dimensión", "Sí, de derecha a izquierda: cada dimensión es igual, o una es 1, o está ausente"],
        correctIndex: 3,
        explanation:
          "El broadcasting alinea de derecha a izquierda; si no hay compatibilidad, ValueError.",
      },
      {
        question: "np.allclose(a, b, rtol=…, atol=…) sirve principalmente para:",
        options: ["Comparar floats con tolerancia (p. ej. loop vs vectorizado)", "Comparar con == tras redondear ambos a seis decimales", "Comprobar que ambos arrays comparten el mismo dtype", "Comparar la suma de ambos arrays en vez de elemento a elemento"],
        correctIndex: 0,
        explanation:
          "allclose/assert_allclose validan equivalencia numérica con rtol (tolerancia relativa, escala con la magnitud) y atol (tolerancia absoluta, cubre cercanos a cero).",
      },
      {
        question: "Un benchmark honesto loop vs vectorizado debe incluir:",
        options: ["El tiempo de ambos con el mismo N, sin comparar resultados", "El ratio de tiempos repetido varias veces y promediado", "Mismo input/dtype, timing y verificación de equivalencia numérica", "El tiempo del vectorizado con N grande y el del loop con N pequeño"],
        correctIndex: 2,
        explanation:
          "Sin equivalencia, un ratio de tiempo no demuestra que la versión vectorizada sea correcta. El ratio exacto además varía por máquina.",
      },
      {
        question: "¿Cuántos bytes ocupa np.zeros(1000, dtype=np.float64)?",
        options: ["1000", "8000", "4000", "Depende solo de la forma, no del dtype"],
        correctIndex: 1,
        explanation:
          "float64 usa 8 bytes por elemento; 1000 × 8 = 8000. nbytes = itemsize × size. Úsalo para presupuestos de memoria del tablero (p. ej. matrices n×n).",
      },
      {
        question: "Si marcas a.flags.writeable = False e intentas a[0] = 3.0, NumPy:",
        options: ["Ignora la asignación en silencio", "Convierte el array a copy automáticamente", "Cambia el dtype a object", "Lanza ValueError (escritura bloqueada)"],
        correctIndex: 3,
        explanation:
          "writeable=False protege entradas de solo lectura; la asignación lanza ValueError. Es una defensa útil cuando pasas arrays crudos a funciones de normalización.",
      },
      {
        question: "La tasa de unicidad de ids sintéticos se calcula de forma idiomática como:",
        options: ["np.unique(ids).size / ids.size", "len(ids) / len(ids) (siempre 1.0)", "ids.mean()", "np.sum(ids) / ids.size"],
        correctIndex: 0,
        explanation:
          "np.unique devuelve los valores distintos; la tasa es n_únicos / n. len(ids)/len(ids) es un truco que siempre da 1.0 y no detecta duplicados (p. ej. dos C001).",
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
