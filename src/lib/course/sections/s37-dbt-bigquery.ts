import type { CourseSection } from '../../types'

export const section37: CourseSection = {
  id: "dbt-bigquery",
  index: 37,
  title: "Profiling, algoritmos y rendimiento",
  shortTitle: "Profiling y rendimiento",
  tagline: "Reporte antes/después con el mismo resultado, dataset, hardware y límites; optimización reversible y justificada.",
  estimatedHours: 19,
  level: "Competente a experto",
  phase: 2,
  icon: "Timer",
  accentColor: "bg-gradient-to-br from-purple-400 to-indigo-900",
  jobRelevance:
    "Escalar el triage significa medir antes y después con el mismo dataset, no declarar victoria porque «se siente más rápido». En data engineering y ML ops de la región, un speedup sin same_result (resultado funcional idéntico antes y después de optimizar) o sin budget (umbral acordado de ms/memoria que el CI puede romper) es una regresión disfrazada: con n grande, el wall time se duplica. Aquí aprendes a optimizar sin saltarte la privacidad ni los tests.",
  learningOutcomes: [
    { text: "Perfilar wall y CPU (`perf_counter` / `process_time`) y anotar memoria con `n` explícito." },
    { text: "Medir con benchmark: warmup, mediana y una nota de variabilidad (rango o IQR simple)." },
    { text: "Analizar complejidad O(n²) y medir reducción por blocking sin abandonar el recall." },
    { text: "Reducir candidatos con estructuras e índices invertidos antes del scorer." },
    { text: "Aplicar dtypes estrechos, chunks y lectura columnar mínima con bound de memoria." },
    { text: "Diseñar caché con invalidación por versión/cutoff y estrategia out-of-core." },
    { text: "Fijar performance budgets y tests de regresión que pueden fallar en CI light." },
    { text: "Priorizar costo total y claridad sobre microoptimización del 2 % sin medición." },
  ],
  theory: [
    {
      heading: "Rendimiento del triage (escala del matching)",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Wall time:** reloj de pared (`time.perf_counter`). **CPU time:** tiempo de procesador (`time.process_time`). **Warmup:** corrida descartada (el cold start — arranque en frío — miente). **Blocking:** particionar por clave para no generar todos los pares O(n²). **Performance budget:** umbral de ms/memoria/pares que el CI light puede fallar. **same_result:** el speedup no vale si cambia el resultado funcional del matching o de las features.",
        "Escalar el triage no es «hacer el código más ingenioso»: es medir el path caliente, preservar el mismo resultado funcional y publicar un reporte antes/después con dataset, hardware y límites explícitos. Sin esa disciplina, la optimización es teatro y puede romper privacidad o tests. Historia típica: un PR mergea un recorte del 2 % en un loop interno y, con n=1e5 pares, el wall se duplica porque nadie midió el fixture completo.",
        "Contrato del gate de escala. Entrada: fixture sintético `CASO-LIM-037`, métricas wall/CPU (y nota de memoria), conteo de pares candidatos y budgets acordados. Salida: reporte de escala con speedup y reducción de pares, más tests de regresión de performance. Error: cambiar el resultado semántico, omitir warmup o microoptimizar un 2 % sin medición bloquea el gate.",
        "Caso Red Andina (ficticio): matching y features sobre registros sintéticos de Lima/Cusco. Esta sección escala el path de triage (matching y features), no un laboratorio de SQL en la nube. Orden: T1 Medición → T2 Algos/blocking → T3 Memoria → T4 Budgets y costo total. Usamos **stdlib** (`time`, `statistics`, `collections`) para medir sin dependencias nuevas.",
        "Puente **S14 → S30 → S37**: en NumPy/vectorización (S14) mediste work denso; en entity resolution (S30) mediste **recall de blocking**. Aquí unes ambas líneas: mides **costo** (pares y wall) sin abandonar `same_result`. Un blocking más agresivo que baje el recall no es victoria de escala. Puente **S37 → S38**: los budgets y el reporte before/after de esta sección son la base cuando el path corra con colas, reintentos y variabilidad de proveedor.",
      ],
      code: {
        language: 'python',
        title: "s37_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-LIM-037",
        "gate": ["same_result", "before_after", "budget"],
        "micro_only_ok": False,
        "skip_privacy_or_tests": False,
    }

c = section_contract()
print("case", c["case"])
print("micro_only_ok", c["micro_only_ok"])
print("skip_privacy_or_tests", c["skip_privacy_or_tests"])
`,
        output: `case CASO-LIM-037
micro_only_ok False
skip_privacy_or_tests False`,
      },
      callout: {
        type: "info",
        title: "Gate de escala",
        content:
          "Mismo resultado funcional + reporte antes/después con dataset/hardware/límites. Optimización reversible y justificada; no salta privacidad ni tests.",
      },
    },
    {
      heading: "Wall, CPU y profiling de memoria",
      subtopicId: "S37-T1-A",
      paragraphs: [
        "Wall time es el reloj de pared que percibe el usuario o el batch (`time.perf_counter`); CPU time es el tiempo de procesador (`time.process_time`). Cuando wall >> CPU, el job espera I/O o al SO; cuando ambos crecen, el path es **compute-bound** (acotado por cómputo, no por I/O). La memoria pico limita si el job cabe en el worker: `tracemalloc` muestrea alocaciones del **mismo path** medido. Cuando el wall ya indicó *qué tramo* es caro, `cProfile` nombra la **función** exacta (hot path, la ruta o tramo más costoso del código) sin adivinar.",
        "Mecanismo: envuelve el path caliente, anota `n` del fixture, verifica el resultado funcional en el mismo run y solo entonces publicas los ms. Un número sin `n` no sirve para decidir. Orden profesional: (1) wall+CPU con `n`, (2) si el wall no basta, `cProfile` del pipeline para ver qué función domina, (3) si hay riesgo de OOM, `tracemalloc` sobre el path real (no una alocación aparte). El profile apunta al matching/grafo o features del batch sintético — no a un tramo frío del `import`.",
        "Aplicación al caso sintético T1-A: un pipeline con `cheap` y `expensive`; medimos wall/CPU, el pico de alocaciones del path con `tracemalloc` y, con `cProfile`, comprobamos que `expensive` es la función caliente. En el path real del triage se sustituye por el scorer; la disciplina wall+CPU+`n`+memoria+`hot_fn` se mantiene. Sin PII ni datos productivos en el laboratorio del curso.",
      ],
      code: {
        language: 'python',
        title: "wall_cpu_mem_cprofile.py",
        code: `import time
import tracemalloc
import cProfile

def expensive(n: int) -> int:
    # alocación en el hot path (lista de cuadrados)
    acc = [i * i for i in range(n)]
    return sum(acc)

def cheap(n: int) -> int:
    return n

def path(n: int) -> int:
    cheap(n)
    return expensive(n)

def profile_wall_cpu_mem(n: int):
    t0 = time.perf_counter()
    s = path(n)
    wall = time.perf_counter() - t0
    t1 = time.process_time()
    path(n)
    cpu = time.process_time() - t1
    # peak del path real, no de una alocación aparte
    tracemalloc.start()
    s2 = path(n)
    _current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return round(wall * 1000, 3), round(cpu * 1000, 3), s >= 0 and s2 >= 0, n, peak

def hot_function(n: int) -> str:
    """cProfile: nombra la función con más tiempo total en el pipeline."""
    pr = cProfile.Profile()
    pr.enable()
    path(n)
    pr.disable()
    times = {}
    for e in pr.getstats():
        code = e.code
        if hasattr(code, "co_name"):
            name = code.co_name
            times[name] = times.get(name, 0.0) + e.totaltime
    return "expensive" if times.get("expensive", 0.0) >= times.get("cheap", 0.0) else "cheap"

n = 20_000
wall_ms, cpu_ms, ok, n, peak = profile_wall_cpu_mem(n)
hot = hot_function(n)
# ms y peak exactos varían por máquina; predicados estables + hot_fn
print("wall_ms_ok", wall_ms >= 0)
print("cpu_ms_ok", cpu_ms >= 0)
print("result", ok)
print("n", n)
print("peak_ok", peak >= 0)
print("hot_fn", hot)
print("hot_ok", hot == "expensive")`,
        output: `wall_ms_ok True
cpu_ms_ok True
result True
n 20000
peak_ok True
hot_fn expensive
hot_ok True`,
      },
      callout: {
        type: "tip",
        title: "Orden: wall → cProfile → tracemalloc",
        content:
          "`perf_counter` (wall) y `process_time` (CPU) primero, siempre con `n`. `cProfile` nombra la función caliente del pipeline. `tracemalloc` acota el pico del **path medido**. No empieces por micro-shaving (recorte minucioso de líneas sueltas) de un loop que ni siquiera es el hot path (la ruta o tramo más costoso del código).",
      },
    },
    {
      heading: "Benchmark: fixture, warmup y variabilidad",
      subtopicId: "S37-T1-B",
      paragraphs: [
        "La primera corrida miente: las memorias caché de CPU, el `import` y el JIT de las librerías distorsionan el cold start (arranque en frío). El warmup descarta esa corrida. Luego se reporta la mediana (robusta frente a un outlier) y, con más muestras, un proxy de cola (p. ej. el máximo con N chico, o el p95 con N grande). El fixture fija el dataset sintético y una nota de hardware del laboratorio.",
        "Mecanismo: ejecuta `work()`; luego N runs post-warmup; mediana en ms; anota `n_runs` y, si hace falta, el rango o el IQR simple como nota de variabilidad. Error: publicar un solo run sin warmup como «verdad». Si la variabilidad es alta, sube N o aísla el ruido (otras apps, thermal); no presentes un speedup con una sola medición.",
        "Aplicación al caso sintético T1-B: `work` = suma de cuadrados en rango 5000; warmup + 5 runs; mediana en ms. El mismo fixture viaja a CI light más adelante. Datos inventados; reproducible en la laptop del estudiante sin credenciales externas.",
      ],
      code: {
        language: 'python',
        title: "bench.py",
        code: `import time, statistics

def work():
    return sum(i * i for i in range(5000))

work()  # warmup (descartada)
times = []
for _ in range(5):
    t0 = time.perf_counter()
    work()
    times.append(time.perf_counter() - t0)
med = statistics.median(times)
spread = max(times) - min(times)
print("median_ms_ok", round(med * 1000, 3) >= 0)
print("spread_ms_ok", round(spread * 1000, 3) >= 0)
print("n_runs", 5)
print("warmup", True)`,
        output: `median_ms_ok True
spread_ms_ok True
n_runs 5
warmup True`,
      },
      callout: {
        type: "warning",
        title: "Sin warmup",
        content:
          "La 1ª corrida miente. Publicar el cold start (arranque en frío) como performance del algoritmo engaña al equipo y al PR.",
      },
    },
    {
      heading: "Complejidad y blocking",
      subtopicId: "S37-T2-A",
      paragraphs: [
        "Comparar todos los pares es O(n²) e inutiliza el entity resolution y el grafo cuando `n` crece. El blocking particiona por clave (ciudad, prefijo, ventana) y solo genera candidatos dentro del bloque. La métrica de costo principal es el conteo de pares antes y después del blocking.",
        "Mecanismo: `all_pairs = n*(n-1)//2`; con B bloques de tamaño ~n/B, `blocked_pairs ≈ B * size*(size-1)//2`; `reduction = 1 − blocked/all` (fracción de pares eliminados, en [0,1]). Error: bajar un 1 % el inner loop y dejar n² intacto. Criterio: la reducción de pares se mide y se reporta junto con el mismo resultado de matching sobre el fixture sintético.",
        "Aplicación al caso sintético T2-A: n=100, 10 bloques → all_pairs=4950, blocked=450, reduction≈0.909. En S30 mediste recall de pares útiles; aquí el tradeoff es explícito: un blocking más agresivo que baje el recall no es victoria de escala aunque los pares caigan. Primero se cuenta el costo; el recall sigue siendo el gate del matching.",
      ],
      code: {
        language: 'python',
        title: "blocking_cost.py",
        code: `def blocking_cost(n: int, blocks: int):
    pairs_all = n * (n - 1) // 2
    size = n // blocks
    pairs_b = blocks * size * (size - 1) // 2
    reduction = round(1 - pairs_b / pairs_all, 3)  # fracción eliminada [0,1]
    return pairs_all, pairs_b, reduction

all_pairs, blocked_pairs, reduction = blocking_cost(100, 10)
print("all_pairs", all_pairs)
print("blocked_pairs", blocked_pairs)
print("reduction", reduction)`,
        output: `all_pairs 4950
blocked_pairs 450
reduction 0.909`,
      },
      callout: {
        type: "tip",
        title: "Cuenta pares y recall",
        content:
          "La métrica de costo principal del entity resolution (ER) y el grafo es el conteo de candidatos. Si no cuentas los pares, no sabes si el blocking funciona; si no mides el recall (S30), puedes «ganar» costo y perder matches verdaderos.",
      },
    },
    {
      heading: "Estructuras, vectorización y reducción de candidatos",
      subtopicId: "S37-T2-B",
      paragraphs: [
        "Los `dict`/`set` y los índices invertidos evitan scans O(n) repetidos. La vectorización ayuda cuando hay arrays densos, pero no sustituye reducir los candidatos antes de features caras. El orden correcto del path de escala es bloquear, indexar y recién después **puntuar** con el modelo o reglas.",
        "Mecanismo: construye el inverted index una vez (ciudad → lista de `entity_id`); la verificación de membership con `set`/`dict` es O(1) amortizado frente a un list scan O(n). Error: puntuar el producto cartesiano y luego «optimizar» el scorer. Criterio: los candidatos salen del bloque, no de un scan global costoso.",
        "Aplicación al caso sintético T2-B: filas Lima/Lima/Cusco → bloques {Lima:2, Cusco:1}. Solo comparamos dentro de Lima. Sin afirmar parentesco ni fraude a partir de la ciudad; es solo clave de blocking sintética de laboratorio.",
      ],
      code: {
        language: 'python',
        title: "inv_index.py",
        code: `from collections import defaultdict

def inverted_index(rows):
    inv = defaultdict(list)
    for city, e in rows:
        inv[city].append(e)
    return {k: len(v) for k, v in inv.items()}

rows = [("Lima", "e1"), ("Lima", "e2"), ("Cusco", "e3")]
blocks = inverted_index(rows)
print("blocks", blocks)
print("structure", "inverted_index")
print("ok", blocks.get("Lima") == 2 and blocks.get("Cusco") == 1)`,
        output: `blocks {'Lima': 2, 'Cusco': 1}
structure inverted_index
ok True`,
      },
      callout: {
        type: "tip",
        title: "Index first",
        content:
          "Construye el índice o la clave de blocking primero; el scorer caro opera sobre candidatos ya reducidos.",
      },
    },
    {
      heading: "Dtypes, chunking y lectura columnar",
      subtopicId: "S37-T3-A",
      paragraphs: [
        "Elegir `dtypes` más estrechos (`int32` vs. `int64`, categorías) reduce memoria: un `int32` ocupa la mitad que un `int64` por elemento si el dominio cabe. El chunking procesa el dataset por ventanas para no caer en OOM. El enfoque columnar lee solo las columnas usadas (`id`, `amount`) en lugar del registro ancho que arrastra blobs innecesarios.",
        "Mecanismo: mide bytes por elemento (`array.itemsize` o el dtype del stack); declara un bound de memoria; elige el tamaño de chunk como tradeoff entre el overhead del bucle y el pico de RAM; proyecta las columnas antes de features. Error: cargar todo en RAM «porque en mi laptop cabe». Criterio: el job documenta `chunk_sizes`, `col_subset` y un bound de bytes medible sobre el fixture sintético.",
        "Aplicación al caso sintético T3-A: `range(10)` en chunks de 3 → `[3,3,3,1]`; subset `['id','amount']`; `int32` vs. `int64` con `itemsize`. Didáctica con listas y `array.array`; el mismo criterio aplica a formatos columnares cuando el stack del curso ya los introdujo.",
      ],
      code: {
        language: 'python',
        title: "chunks_dtype.py",
        code: `import array

def chunks(xs, size):
    for i in range(0, len(xs), size):
        yield xs[i:i + size]

data = list(range(10))
sizes = [len(c) for c in chunks(data, 3)]
i32, i64 = array.array("i").itemsize, array.array("q").itemsize
bound_bytes = len(data) * i32  # bound si usamos int32
print("chunk_sizes", sizes)
print("col_subset", ["id", "amount"])
print("itemsize_i32", i32)
print("bound_ok", bound_bytes < len(data) * i64)
print("ok", sizes == [3, 3, 3, 1])`,
        output: `chunk_sizes [3, 3, 3, 1]
col_subset ['id', 'amount']
itemsize_i32 4
bound_ok True
ok True`,
      },
      callout: {
        type: "tip",
        title: "Chunk size y bound",
        content:
          "Tradeoff overhead vs. memoria. Demasiado pequeño: overhead; demasiado grande: OOM. Mide `itemsize` y el pico; no adivines el dtype.",
      },
    },
    {
      heading: "Caché, invalidación y out-of-core",
      subtopicId: "S37-T3-B",
      paragraphs: [
        "**Guardar en caché** features o resultados de blocking acelera las re-runs, pero un cache stale (obsoleto) miente. La clave incluye la versión del feature set y el cutoff (punto de corte temporal de los datos) de datos. **Out-of-core** (fuera de memoria principal) significa no asumir que todo cabe en RAM: chunk o spill (volcar a disco) cuando `n` crece en el batch de triage.",
        "Mecanismo: `put(key, value)`; hit si `key ∈ store`; al cambiar la versión del feature set (p. ej. `fs-v1 → fs-v2`) o el cutoff, la key nueva no pega y se recomputa. Error: cache infinito sin versión de schema. Criterio: se documenta `invalidate_on = version_or_cutoff` y `ooc = chunk_if_needed` de forma explícita.",
        "Aplicación al caso sintético T3-B: `key = ('fs-v1', '2026-01-01')` almacena `n_pairs`; hit `True` tras `put`. Invalidar por `version_or_cutoff`. Solo estructuras en memoria didácticas; sin Redis ni servicios externos en el ejercicio del estudiante.",
      ],
      code: {
        language: 'python',
        title: "cache.py",
        code: `def cache_put(store, key, value):
    store[key] = value
    return key in store

def invalidate_policy():
    return "version_or_cutoff"

cache = {}
key = ("fs-v1", "2026-01-01")
print("hit", cache_put(cache, key, {"n_pairs": 1000}))
print("invalidate_on", invalidate_policy())
print("ooc", "chunk_if_needed")`,
        output: `hit True
invalidate_on version_or_cutoff
ooc chunk_if_needed`,
      },
      callout: {
        type: "warning",
        title: "Cache stale",
        content:
          "Invalidar es parte del diseño. Mantén versionadas las features y el cutoff; no reutilices scores de un schema viejo.",
      },
    },
    {
      heading: "Performance budget y tests",
      subtopicId: "S37-T4-A",
      paragraphs: [
        "Un **performance budget** fija límites: p95 latency < X ms, memoria < Y, pares candidatos < Z. Un test de regresión de performance falla el PR si se rompe el budget sobre el mismo fixture. CI light corre un bench corto; el nightly puede ser más largo y estricto.",
        "Mecanismo: `pass = measured_ms ≤ budget_ms` (y análogos para memoria/pares). Error: «en mi máquina pasa» sin umbral en CI. Criterio: el budget se acuerda con el dueño del servicio de triage y se versiona junto al dataset de bench sintético del repositorio.",
        "Aplicación al caso sintético T4-A: budget de 50 ms, measured 12 ms → `pass = True`. Si un cambio de scorer sube a 80 ms, el test falla y se exige justificar o revertir. Sin red real; medición local del proxy de trabajo del laboratorio.",
      ],
      code: {
        language: 'python',
        title: "budget.py",
        code: `def budget_pass(budget_ms: float, measured_ms: float):
    return measured_ms <= budget_ms, budget_ms, measured_ms

ok, budget_ms, measured_ms = budget_pass(50, 12)
print("pass", ok)
print("budget_ms", budget_ms)
print("measured_ms", measured_ms)`,
        output: `pass True
budget_ms 50
measured_ms 12`,
      },
      callout: {
        type: "tip",
        title: "CI light",
        content:
          "Bench corto en PR; largo en nightly. Mismo dataset de bench; no cambies `n` en silencio.",
      },
    },
    {
      heading: "Costo total, claridad y no microoptimización",
      subtopicId: "S37-T4-B",
      paragraphs: [
        "El costo total incluye ingeniería humana, cómputo y riesgo de bugs. Una microoptimización del 2 % que oscurece el código suele ser pérdida neta. El entregable de escala es el reporte antes/después **con el mismo resultado**, dataset y límites — no un leaderboard (tabla de clasificación) de microbenchmarks (bancos de pruebas aislados del path real) desconectados del path de producción.",
        "Mecanismo: `speedup = before_ms / after_ms` (ratio, no resta). `pair_factor = before_pairs // after_pairs` dice «cuántas veces menos pares»; no lo confundas con `reduction = 1 − after/before` de T2-A (fracción eliminada). `micro_only = False` cuando el ganador fue el blocking o el algoritmo. El PR explica el tradeoff en español profesional.",
        "Aplicación al caso sintético T4-B: before 100 ms / 1e6 pares → after 20 ms / 5e4 pares: `speedup = 5×`, `pair_factor = 20×` (y `reduction = 0.95` si lo reportas como fracción). El equipo prefiere ese cambio al rewrite opaco de un 2 %. Datos sintéticos del path de Red Andina ficticia.",
      ],
      code: {
        language: 'python',
        title: "before_after.py",
        code: `def speedup(before_ms, after_ms):
    return before_ms / after_ms

def pair_factor(before_pairs, after_pairs):
    """Cuántas veces menos pares (factor entero). No es la reduction [0,1] de T2-A."""
    return before_pairs // after_pairs

before = {"ms": 100, "pairs": 1_000_000}
after = {"ms": 20, "pairs": 50_000}
print("speedup", speedup(before["ms"], after["ms"]))
print("pair_factor", pair_factor(before["pairs"], after["pairs"]))
print("micro_only", False)`,
        output: `speedup 5.0
pair_factor 20
micro_only False`,
      },
      callout: {
        type: "info",
        title: "Entregable",
        content:
          "El mismo resultado, dataset, hardware y límites. Before/after legible para el revisor humano del PR.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de medición, blocking, memoria y budgets del path de escala del triage sobre el caso sintético Red Andina (sin PII real).",
    steps: [
      {
        demoId: "S37-T1-A-DEMO",
        subtopicId: "S37-T1-A",
        environment: "local-python",
        description: "Demo: wall, CPU, pico de memoria y hot path (cProfile) del trabajo sintético con n.",
        preamble:
          "En el path de escala del triage sintético (`CASO-LIM-037`), un «se siente más rápido» no pasa el gate: necesitas wall, CPU, pico de alocaciones y el nombre de la función caliente. En esta demo un `path` llama a `cheap` y luego a `expensive` con `n=10000`. No escribas aún: predice qué función gana en `cProfile` y por qué el reporte usa predicados (`wall_ms_ok`) en lugar de ms fijos. Si omites `n` o mides un tramo frío del `import`, el revisor no puede comparar PRs.",
        code: {
          language: 'python',
          title: "s37_t1_a_demo.py",
          code: `import time
import tracemalloc
import cProfile

def expensive(n: int) -> int:
    acc = [i * i for i in range(n)]
    return sum(acc)

def cheap(n: int) -> int:
    return n

def path(n: int) -> int:
    cheap(n)
    return expensive(n)

def wall_cpu_mem(n: int):
    t0 = time.perf_counter()
    result = path(n)
    wall = (time.perf_counter() - t0) * 1000
    t1 = time.process_time()
    path(n)
    cpu = (time.process_time() - t1) * 1000
    # peak del path real (no una alocación aparte)
    tracemalloc.start()
    result2 = path(n)
    _cur, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return round(wall, 3), round(cpu, 3), result if result2 >= 0 else result, peak

def hot_fn(n: int) -> str:
    pr = cProfile.Profile()
    pr.enable()
    path(n)
    pr.disable()
    times = {}
    for e in pr.getstats():
        code = e.code
        if hasattr(code, "co_name"):
            times[code.co_name] = times.get(code.co_name, 0.0) + e.totaltime
    return "expensive" if times.get("expensive", 0.0) >= times.get("cheap", 0.0) else "cheap"

n = 10_000
wall_ms, cpu_ms, result, peak = wall_cpu_mem(n)
hot = hot_fn(n)
print("wall_ms_ok", wall_ms >= 0)
print("cpu_ms_ok", cpu_ms >= 0)
print("peak_ok", peak >= 0)
print("n", n)
print("hot_fn", hot)
print("ok", result >= 0 and hot == "expensive")`,
          output: `wall_ms_ok True
cpu_ms_ok True
peak_ok True
n 10000
hot_fn expensive
ok True`,
        },
        why: "`perf_counter` es reloj de pared; `process_time` es CPU del proceso; `tracemalloc` debe envolver el **work real**, no una alocación aparte; `cProfile` nombra el hot path después de saber que el wall importa. Los ms exactos varían por máquina: por eso el demo publica predicados y `hot_fn expensive`. En We Do repararás `n=0` y medirás CPU/peak del work.",
        retrospective:
          "Si puedes explicar por qué un wall sin `n` no es comparable y por qué `expensive` debe ganar a `cheap` sin mirar el código, ya tienes el hábito de medir el path caliente. El error clásico es micro-shave de un loop que ni es hot. En We Do corregirás el reporte de medición y el predicado `same_result`.",
      },
      {
        demoId: "S37-T1-B-DEMO",
        subtopicId: "S37-T1-B",
        environment: "local-python",
        description: "Demo: warmup real + mediana y spread de 5 runs.",
        preamble:
          "Un solo run frío mezcla `import`, cachés de CPU y el algoritmo; el PR de escala del triage no puede basarse en eso. En esta demo se descarta un warmup de `work()`, se miden 5 runs y se reportan predicados de mediana y spread (no ms fijos). No escribas: predice por qué `warmup True` y `n_runs 5` importan más que un número mágico de milisegundos. Si publicas el cold start, engañas al equipo y al budget.",
        code: {
          language: 'python',
          title: "s37_t1_b_demo.py",
          code: `import time, statistics

def work():
    return sum(i * i for i in range(3000))

work()  # warmup (descartada)
times = []
for _ in range(5):
    t0 = time.perf_counter()
    work()
    times.append(time.perf_counter() - t0)
med = statistics.median(times)
spread = max(times) - min(times)
print("median_ms_ok", round(med * 1000, 3) >= 0)
print("spread_ms_ok", round(spread * 1000, 3) >= 0)
print("warmup", True)
print("n_runs", 5)`,
          output: `median_ms_ok True
spread_ms_ok True
warmup True
n_runs 5`,
        },
        why: "El warmup descarta distorsión de arranque; la mediana es robusta a un outlier; el spread (max−min) es nota de variabilidad con N chico, no un p95 de producción. No uses mean de enteros inventados ni un solo run frío como «verdad». En We Do medirás de verdad y forzarás `discard_first`.",
        retrospective:
          "Bench serio = warmup + N runs + mediana + nota de variabilidad. El error clásico es mean de números inventados o un solo run frío vendido como performance del algoritmo. Pregunta: si publicas el cold start y el budget de CI light es justo, ¿quién paga el flaky? We Do: medir de verdad, `discard_first` y proxy de cola con nombre.",
      },
      {
        demoId: "S37-T2-A-DEMO",
        subtopicId: "S37-T2-A",
        environment: "local-python",
        description: "Demo: all_pairs vs. blocked_pairs derivados de n y bloques.",
        preamble:
          "Escalar entity resolution no empieza por shave del scorer: empieza por contar cuántos pares entran al scorer. En la demo, `n=4` y 2 bloques: 6 pares completos vs. 2 bloqueados. No escribas: predice por qué `all_p > blk` y qué implica para el wall del matching. Si no cuentas pares, no sabes si el blocking sirve; si bajas recall por un blocking ciego, no es victoria de escala (puente S30).",
        code: {
          language: 'python',
          title: "s37_t2_a_demo.py",
          code: `def pair_count(n: int) -> int:
    return n * (n - 1) // 2

def blocked_pairs(n: int, blocks: int) -> int:
    size = n // blocks
    return blocks * size * (size - 1) // 2

n, blocks = 4, 2
all_p = pair_count(n)
blk = blocked_pairs(n, blocks)
print("all_pairs", all_p)
print("blocked", blk)
print("ok", all_p > blk)`,
          output: `all_pairs 6
blocked 2
ok True`,
        },
        why: "`n*(n-1)//2` son pares no ordenados sin diagonal; el blocked asume bloques de tamaño `n//blocks`; la métrica de costo del path de Red Andina es el conteo de candidatos, no el «feeling» del loop. Un blocking agresivo que baje el recall no es victoria. En We Do corregirás `n*n` y calcularás `reduction`.",
        retrospective:
          "Contar pares es el primer instrumento de escala del matching. El error clásico es mirar solo ms del scorer con n² intacto o celebrar un blocking que baje recall (S30). Pregunta: si `all_p` no cae, ¿qué ganas micro-shaveando el inner loop? We Do: fórmula correcta, `reduction` y preferir blocking a microopt.",
      },
      {
        demoId: "S37-T2-B-DEMO",
        subtopicId: "S37-T2-B",
        environment: "local-python",
        description: "Demo: tamaño de bloque Lima en inverted index.",
        preamble:
          "Antes de features caras del matching, se reduce el espacio de candidatos. En la demo un índice invertido por ciudad sintética (Lima×2, Cusco×1) muestra tamaños de bloque. No escribas: predice el tamaño de Lima y el flag `ok`. La ciudad es solo clave de blocking de laboratorio: no afirma parentesco ni fraude. Si scoras el producto cartesiano y «optimizas» el scorer después, invertiste el orden del path de escala.",
        code: {
          language: 'python',
          title: "s37_t2_b_demo.py",
          code: `from collections import defaultdict

def block_sizes(rows):
    inv = defaultdict(list)
    for city, eid in rows:
        inv[city].append(eid)
    return {k: len(v) for k, v in inv.items()}

sizes = block_sizes([("Lima", "e1"), ("Lima", "e2"), ("Cusco", "e3")])
print("blocks", sizes)
print("structure", "inverted_index")
print("ok", sizes.get("Lima") == 2)`,
          output: `blocks {'Lima': 2, 'Cusco': 1}
structure inverted_index
ok True`,
        },
        why: "`defaultdict(list)` agrupa `entity_id` por clave; el scorer opera dentro del bloque; membership con set/dict es O(1) amortizado frente a list scan. Ciudad es clave de lab, no señal de parentesco. En We Do practicarás set vs. list_scan, count de Lima y el orden block→score.",
        retrospective:
          "Indexar primero es optimización de verdad: el scorer opera dentro del bloque. El error clásico es scan lineal repetido o puntuar el cartesiano «porque el scorer es el cuello». Pregunta: si Lima tiene tamaño 2 y Cusco 1, ¿cuántos pares locales predices en Lima? We Do: set vs. list_scan, count de Lima y orden block→score.",
      },
      {
        demoId: "S37-T3-A-DEMO",
        subtopicId: "S37-T3-A",
        environment: "local-python",
        description: "Demo: tamaños de chunk, subset columnar y bound de memoria por itemsize.",
        preamble:
          "El batch de features del triage puede caber en la laptop del lab y reventar en el worker nocturno. En esta demo se planifican chunks de 10 con size 3 (`[3,3,3,1]`), se proyectan solo `id`/`amount` (sin `blob`) y se compara bound int32 vs. int64. No escribas: predice por qué `blob` no debe viajar y por qué el bound de int32 es menor. Si cargas la tabla ancha «porque cabe», el OOM llega en silencio con `n` real.",
        code: {
          language: 'python',
          title: "s37_t3_a_demo.py",
          code: `import array

def chunk_sizes(n: int, size: int):
    return [size] * (n // size) + ([n % size] if n % size else [])

def project(row, cols):
    return {c: row[c] for c in cols}

sizes = chunk_sizes(10, 3)
row = {"id": 1, "amount": 10, "blob": "xx", "notes": "n/a"}
subset = project(row, ["id", "amount"])
i32 = array.array("i").itemsize
i64 = array.array("q").itemsize
bound_i32 = 10 * i32
bound_i64 = 10 * i64
print("chunk_sizes", sizes)
print("col_subset", list(subset.keys()))
print("bound_i32", bound_i32)
print("ok", sizes == [3, 3, 3, 1] and "blob" not in subset and bound_i32 < bound_i64)`,
          output: `chunk_sizes [3, 3, 3, 1]
col_subset ['id', 'amount']
bound_i32 40
ok True`,
        },
        why: "El chunk acota el pico de RAM; el subset columnar reduce I/O y memoria al dejar fuera blobs; `itemsize` justifica dtype angosto con bytes medibles, no con intuición de «int64 siempre seguro». En We Do planificarás chunks con ceil, proyectarás columnas y elegirás int32 por itemsize.",
        retrospective:
          "Memoria se diseña: chunks, columnas y dtypes con bound medible. El error clásico es `load_all` + int64 por defecto «porque en mi laptop cabe». Pregunta: si `blob` viaja al worker, ¿qué crece aunque el scorer no lo use? We Do: ceil de chunks, proyección y itemsize.",
      },
      {
        demoId: "S37-T3-B-DEMO",
        subtopicId: "S37-T3-B",
        environment: "local-python",
        description: "Demo: put, hit e invalidación por cambio de versión.",
        preamble:
          "Guardar features o pares de blocking acelera re-runs del triage, pero un cache sin versión de feature set miente al matching. En la demo se hace put con `fs-v1` (hit) y se consulta `fs-v2` (miss). No escribas: predice ambos hits y el `ok`. Si reutilizas scores de un schema viejo, el «speedup» es stale y puede romper `same_result` en silencio.",
        code: {
          language: 'python',
          title: "s37_t3_b_demo.py",
          code: `def cache_put(store, key, value):
    store[key] = value

store = {}
key_v1 = ("fs-v1", "2026-01-01")
cache_put(store, key_v1, {"n_pairs": 1000})
hit_v1 = key_v1 in store
key_v2 = ("fs-v2", "2026-01-01")
hit_v2 = key_v2 in store  # miss tras cambio de versión
print("hit_v1", hit_v1)
print("hit_v2", hit_v2)
print("ok", hit_v1 and not hit_v2)`,
          output: `hit_v1 True
hit_v2 False
ok True`,
        },
        why: "La key incluye versión y cutoff; el miss tras bump de versión es la invalidación visible; out-of-core (chunk) se documenta junto a la política de cache. Un hit con schema viejo no es victoria de performance. En We Do armarás la key completa, detectarás stale y acotarás RAM con chunks.",
        retrospective:
          "Hit/miss y versión son parte del diseño del path de triage, no un afterthought. El error clásico es cache infinito sin schema de feature set. Pregunta: si `hit_v2` fuera True con `fs-v1` en store, ¿qué mientes al matching? We Do: key completa, miss por versión y OOC por chunks.",
      },
      {
        demoId: "S37-T4-A-DEMO",
        subtopicId: "S37-T4-A",
        environment: "local-python",
        description: "Demo: budget pass measured<=budget.",
        preamble:
          "El PR de escala del triage no se aprueba porque «se siente más rápido»: se aprueba si measured ≤ budget en el fixture acordado. En la demo, budget 50 ms y measured 10 ms pasan el assert. No escribas: predice el booleano y fíjate que se publican ambos números. Si el test no puede fallar, no es un budget; es decoración de CI.",
        code: {
          language: 'python',
          title: "s37_t4_a_demo.py",
          code: `def under_budget(budget_ms: float, measured_ms: float) -> bool:
    return measured_ms <= budget_ms

budget, measured = 50, 10
print(under_budget(budget, measured))
print("budget", budget)
print("measured", measured)`,
          output: `True
budget 50
measured 10`,
        },
        why: "El test de regresión de performance compara measured contra umbral versionado con el dataset de bench; CI light corre bench corto; nightly puede ser más estricto. Publicar budget y measured juntos deja evidencia en el PR. En We Do practicarás signo correcto, fail real y multi-métrica.",
        retrospective:
          "Budget = umbral versionado que el PR puede romper en rojo. El error clásico es assert siempre verde o publicar solo el booleano sin budget/measured. Pregunta: si measured es 10 y budget 50, ¿qué falta en el PR si omites los dos números? We Do: pass, fail real y tres dimensiones a la vez.",
      },
      {
        demoId: "S37-T4-B-DEMO",
        subtopicId: "S37-T4-B",
        environment: "local-python",
        description: "Demo: speedup y pair_factor con same_result.",
        preamble:
          "El entregable de escala no es un leaderboard de microbenchmarks: es before/after con el mismo resultado, ratio de wall y factor de pares. En la demo, 100→25 ms (speedup 4×), 1e6→5e4 pares (factor 20) y `result=42` en ambos lados. No escribas: predice speedup, pair_factor y por qué `micro_only` es False. Si omites dataset/hardware o rompes `same_result`, el PR no es comparable.",
        code: {
          language: 'python',
          title: "s37_t4_b_demo.py",
          code: `def speedup(before_ms: float, after_ms: float) -> float:
    return before_ms / after_ms

def pair_factor(before_pairs: int, after_pairs: int) -> int:
    return before_pairs // after_pairs

before = {"ms": 100, "pairs": 1_000_000, "result": 42}
after = {"ms": 25, "pairs": 50_000, "result": 42}
same = before["result"] == after["result"]
print(speedup(before["ms"], after["ms"]))
print("pair_factor", pair_factor(before["pairs"], after["pairs"]))
print("same_result", same)
print("micro_only", False)`,
          output: `4.0
pair_factor 20
same_result True
micro_only False`,
        },
        why: "`speedup = before/after` (ratio, no resta ni inverso); `pair_factor` es «cuántas veces menos pares» (entero), distinto de `reduction` en [0,1] de T2-A; `same_result` se calcula sobre salidas. `micro_only` es False cuando ganó el algoritmo o el blocking. En We Do practicarás ratio correcto, claridad vs. 2 % y las claves del reporte.",
        retrospective:
          "Before/after con ratio, pares y `same_result` es el lenguaje del PR de escala. El error clásico es publicar after/before o un 2 % opaco sin dataset. Pregunta: ¿por qué `pair_factor` no es lo mismo que `reduction`? We Do: speedup, preferencia de claridad y reporte completo.",
      },
    ],
  },
  weDo: {
    intro: "Laboratorio de escala del triage (24 retos). E1 repara el defecto de medición o de costo, E2 fija la política y E3 transfiere el criterio al reporte before/after. Fixtures sintéticos Red Andina; sin PII real. Cada reto exige un predicado calculado, no solo imprimir un lema.",
    steps: [
      {
        id: "S37-T1-A-E1",
        subtopicId: "S37-T1-A",
        kind: "guided",
        title: "Wall con n del fixture",
        preamble:
          "- **Contexto:** en el lab de Red Andina el primer dato del reporte de escala es el wall del work sintético; sin el tamaño del input, dos PRs no son comparables.\n- **Meta:** medir wall con `perf_counter` y reportar el `n` real del fixture (`1000`).\n- **Éxito:** `n 1000` / `metric wall` / `ok True`.\n- **Límites:** no dejes `n=0`; no inventes ms fijos; solo fixture sintético sin PII.",
        instruction:
          "1. Abre el starter: el wall se mide bien, pero `print(\"n\", 0)` ignora el fixture.\n2. Usa el `n = 1000` ya definido al reportar.\n3. Mantén `metric` en `\"wall\"` y `ok` si el resultado y el wall son ≥ 0.\n4. Imprime solo `n`, `metric` y `ok` en ese orden.",
        hint: "Todo wall_ms viaja con su n.",
        hints: ["Todo wall_ms viaja con su n.", "print('n', n) con n=1000 del fixture."],
        edgeCases: ["ms sin n", "fixture sintético Red Andina"],
        tests: "Salida alinea con solution output; predicado de dominio sobre fixture sintético.",
        feedback:
          "Un `wall_ms` sin `n` no sirve al revisor: no sabes si el fixture creció en silencio. El número viaja con su tamaño; si no, el «speedup» es teatro entre datasets distintos.",
        retrospective:
          "Toda métrica de tiempo de un path de triage lleva el `n` del fixture. El error clásico es medir bien y reportar mal. Siguiente (E2): sumar CPU y peak del **mismo** work.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e1.py",
          code: `# E1 — wall con n (Red Andina sintético, sin PII real)
# DEFECT: mide wall pero reporta n=0 (el fixture n no viaja al reporte)
import time
n = 1000

def work(n: int) -> int:
    return sum(range(n))

t0 = time.perf_counter()
result = work(n)
wall_ms = round((time.perf_counter() - t0) * 1000, 3)
print("n", 0)  # DEFECT: debe ser n
print("metric", "wall")
print("ok", result >= 0 and wall_ms >= 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-a-e1.py",
          code: `import time
n = 1000

def work(n: int) -> int:
    return sum(range(n))

t0 = time.perf_counter()
result = work(n)
wall_ms = round((time.perf_counter() - t0) * 1000, 3)
print("n", n)
print("metric", "wall")
print("ok", result >= 0 and wall_ms >= 0)
`,
          output: `n 1000
metric wall
ok True`,
        },
      },
      {
        id: "S37-T1-A-E2",
        subtopicId: "S37-T1-A",
        kind: "independent",
        title: "Wall, CPU y peak del work",
        preamble:
          "- **Contexto:** un solo wall no dice si el path es I/O-bound o si se va de RAM; en CI light del triage necesitas wall, CPU y pico del **work medido**.\n- **Meta:** completar medición con `perf_counter`, `process_time` y `tracemalloc` sobre `work(n)` con `n=5000`.\n- **Éxito:** `wall_ok True` / `cpu_ok True` / `peak_ok True` / `n 5000`.\n- **Límites:** no midas el peak de una alocación aparte; no dejes `n 0`; no hardcodees los predicados en `True` sin medir.",
        instruction:
          "1. Revisa el starter: solo hay wall; `cpu_ok`/`peak_ok` están en `False` y `n` en `0`.\n2. Mide CPU con `process_time` alrededor de `work(n)`.\n3. Envuelve `work(n)` con `tracemalloc.start/stop` y usa el peak del path.\n4. Reporta los tres predicados ≥ 0 y el `n` del fixture.",
        hint: "Wall=reloj; CPU=process_time; peak=tracemalloc del work medido.",
        hints: [
          "Mide wall con perf_counter y CPU con process_time.",
          "Envuelve work(n) con tracemalloc.start/stop y lee get_traced_memory()[1] como peak del path.",
          "Reporta n del fixture junto a los predicados >= 0.",
        ],
        edgeCases: ["solo wall", "peak de alocación ajena al work"],
        tests: "Salida alinea con solution output; predicado de dominio sobre fixture sintético.",
        feedback:
          "Wall, CPU y peak del path juntos evitan optimizar la métrica equivocada o ignorar OOM. Un peak medido fuera de `work` engaña al budget de memoria del PR de escala.",
        retrospective:
          "Medir tres señales del mismo `work` es política de CI light, no un checklist vacío. El error clásico es hardcodear `cpu_ok`/`peak_ok` en `True` o envolver una alocación aparte con `tracemalloc`. Pregunta: si wall es bajo pero peak del path real supera el budget de RAM, ¿qué optimizas primero y por qué? Luego (E3): `same_result` se calcula, no se declara.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e2.py",
          code: `# E2 — wall + CPU + peak del work con n (sintético, sin PII)
# DEFECT: no mide CPU ni peak; reporta n=0
import time
import tracemalloc
n = 5000

def work(n: int) -> int:
    return sum(range(n))

t0 = time.perf_counter()
result = work(n)
wall_ms = (time.perf_counter() - t0) * 1000
# DEFECT: falta process_time y tracemalloc sobre work
print("wall_ok", wall_ms >= 0)
print("cpu_ok", False)
print("peak_ok", False)
print("n", 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-a-e2.py",
          code: `import time
import tracemalloc
n = 5000

def work(n: int) -> int:
    # lista en el path para que tracemalloc vea alocación real del work
    acc = list(range(n))
    return sum(acc)

t0 = time.perf_counter()
result = work(n)
wall_ms = (time.perf_counter() - t0) * 1000
t1 = time.process_time()
work(n)
cpu_ms = (time.process_time() - t1) * 1000
tracemalloc.start()
result2 = work(n)  # peak del work, no de una alocación aparte
_cur, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()
print("wall_ok", wall_ms >= 0 and result >= 0 and result2 >= 0)
print("cpu_ok", cpu_ms >= 0)
print("peak_ok", peak >= 0)
print("n", n)
`,
          output: `wall_ok True
cpu_ok True
peak_ok True
n 5000`,
        },
      },
      {
        id: "S37-T1-A-E3",
        subtopicId: "S37-T1-A",
        kind: "transfer",
        title: "same_result se calcula, no se declara",
        preamble:
          "- **Contexto:** el gate de escala de `CASO-LIM-037` exige el mismo resultado funcional antes y después del «optimizar»; un speedup que cambia el score del matching es regresión.\n- **Meta:** hacer que `after_fn` preserve la semántica de `before_fn` y reportar `same_result` como predicado medible.\n- **Éxito:** `same_result True` / `ok True` / `n 1`.\n- **Límites:** no hardcodees `True`; no «arregles» el print sin corregir la función; sin PII.",
        instruction:
          "1. Lee el starter: `after_fn` hace `v + 2` en lugar de `v * 2` (cambia semántica).\n2. Alinea `after_fn` a la misma semántica que `before_fn`.\n3. Calcula `same_result = before_fn(x) == after_fn(x)`.\n4. Imprime `same_result`, `ok` (igual a ese predicado) y `n 1`.",
        hint: "Performance sin same_result es regresión.",
        hints: ["Compara before_fn(x) == after_fn(x).", "Corrige after_fn para preservar el resultado; ok debe reflejar same_result."],
        edgeCases: ["cambio silencioso de semántica", "fixture sintético Red Andina"],
        tests: "Salida alinea con solution output; predicado de dominio sobre fixture sintético.",
        feedback:
          "`same_result` se calcula comparando salidas de las funciones, no se declara por fe. Sin ese predicado, el PR de escala es regresión disfrazada de optimización.",
        retrospective:
          "Performance sin `same_result` es regresión disfrazada. El error clásico es «optimizar» cambiando el contrato. En el You Do compararás las salidas de `before_path` y `after_path` antes de publicar el speedup.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e3.py",
          code: `# E3 — same_result es predicado medible (sintético, sin PII)
# DEFECT: after_fn cambia el resultado funcional
x = 10

def before_fn(v):
    return v * 2

def after_fn(v):  # DEFECT: «optimiza» cambiando semántica
    return v + 2

same_result = before_fn(x) == after_fn(x)
print("same_result", same_result)
print("ok", same_result)  # queda False hasta corregir after_fn
print("n", 1)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-a-e3.py",
          code: `x = 10

def before_fn(v):
    return v * 2

def after_fn(v):
    return v * 2  # misma semántica; el speedup vendría de otra capa

same_result = before_fn(x) == after_fn(x)
print("same_result", same_result)
print("ok", same_result)
print("n", 1)
`,
          output: `same_result True
ok True
n 1`,
        },
      },
      {
        id: "S37-T1-B-E1",
        subtopicId: "S37-T1-B",
        kind: "guided",
        title: "Mediana de runs reales con warmup",
        preamble:
          "- **Contexto:** el bench del path sintético debe basarse en tiempos medidos, no en enteros de juguete que «se ven bien».\n- **Meta:** ejecutar warmup, medir 3 runs con `perf_counter` y reportar el predicado de mediana.\n- **Éxito:** `True` / `n_runs 3` / `warmup True`.\n- **Límites:** no uses mean de listas inventadas; no publiques ms exactos como contrato (varían por máquina).",
        instruction:
          "1. Abre el starter: `vals = [5, 1, 4]` no son tiempos; `warmup` está en `False`.\n2. Llama `work()` una vez (descartada).\n3. Mide 3 runs, toma `statistics.median(times)` y convierte a ms solo para el predicado `>= 0`.\n4. Imprime el predicado, `n_runs` y `warmup True`.",
        hint: "median de los tiempos medidos, no mean de enteros inventados.",
        hints: ["Descarta cold start con un work() previo.", "statistics.median(times) sobre los 3 runs post-warmup."],
        edgeCases: ["un solo run", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E1; predicado de dominio sobre fixture sintético.",
        feedback:
          "Mediana + warmup sobre tiempos reales es higiene mínima de bench. Inventar enteros «que se ven bien» rompe el PR de escala: el revisor no puede reproducir ni comparar fixtures.",
        retrospective:
          "Inventar enteros «que se ven bien» rompe reproducibilidad del PR de escala: el revisor no puede re-ejecutar el fixture. El error clásico es `statistics.mean` de una lista de juguete. Pregunta: ¿por qué el contrato del lab es un predicado `med_ms >= 0` y no un ms exacto? Luego (E2): hacer explícito el `discard_first`.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e1.py",
          code: `# E1 — mediana de runs reales (sintético, sin PII)
# DEFECT: mean de enteros inventados; sin warmup ni medición
import time, statistics

def work():
    return sum(i * i for i in range(2000))

vals = [5, 1, 4]  # DEFECT: no son tiempos medidos
print(statistics.mean(vals))
print("n_runs", 3)
print("warmup", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-b-e1.py",
          code: `import time, statistics

def work():
    return sum(i * i for i in range(2000))

work()  # warmup
times = []
for _ in range(3):
    t0 = time.perf_counter()
    work()
    times.append(time.perf_counter() - t0)
med_ms = round(statistics.median(times) * 1000, 3)
print(med_ms >= 0)  # predicado estable (ms exactos varían por máquina)
print("n_runs", len(times))
print("warmup", True)
`,
          output: `True
n_runs 3
warmup True`,
        },
      },
      {
        id: "S37-T1-B-E2",
        subtopicId: "S37-T1-B",
        kind: "independent",
        title: "Warmup: descarta el cold start",
        preamble:
          "- **Contexto:** si el primer run entra a la mediana, el «algoritmo» se carga con el arranque en frío y el budget de CI light se vuelve flaky o engañoso.\n- **Meta:** implementar warmup real y reportar `discard_first True` con 3 runs post-warmup.\n- **Éxito:** `warmup True` / `discard_first True` / `n_runs 3` / `ok True`.\n- **Límites:** no cuentes el warmup dentro de `n_runs`; no dejes los flags en `False` sin cambiar el flujo.",
        instruction:
          "1. Starter mide 3 runs sin corrida previa y publica `warmup False`.\n2. Ejecuta `work()` una vez antes del bucle (descartada).\n3. Mide solo las 3 corridas siguientes.\n4. Imprime flags y `n_runs` de las post-warmup.",
        hint: "Descarta la primera corrida (cold start).",
        hints: ["Llama work() una vez antes del bucle de medición.", "n_runs es la cantidad de runs post-warmup."],
        edgeCases: ["cold start publicado", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E2; predicado de dominio sobre fixture sintético.",
        feedback:
          "`discard_first` evita reportar el cold start como performance del algoritmo. Si el warmup falla, le mientes al revisor del PR con un número inflado o flaky.",
        retrospective:
          "`discard_first` es política de bench documentada, no un booleano cosmético que se imprime en `True` sin cambiar el flujo. El error clásico es meter el primer run en la mediana y culpar al algoritmo. Pregunta: si `n_runs` incluye el warmup, ¿qué le mientes al revisor del budget? Luego (E3): proxy de cola con N chico.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e2.py",
          code: `# E2 — warmup de bench (sintético, sin PII)
# DEFECT: no descarta el primer run; warmup False
import time

def work():
    return sum(range(2000))

times = []
for _ in range(3):
    t0 = time.perf_counter()
    work()
    times.append(time.perf_counter() - t0)
print("warmup", False)
print("discard_first", False)
print("n_runs", len(times))
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-b-e2.py",
          code: `import time

def work():
    return sum(range(2000))

work()  # warmup descartada
times = []
for _ in range(3):
    t0 = time.perf_counter()
    work()
    times.append(time.perf_counter() - t0)
print("warmup", True)
print("discard_first", True)
print("n_runs", len(times))
print("ok", len(times) == 3)
`,
          output: `warmup True
discard_first True
n_runs 3
ok True`,
        },
      },
      {
        id: "S37-T1-B-E3",
        subtopicId: "S37-T1-B",
        kind: "transfer",
        title: "Proxy de cola y spread (N chico)",
        preamble:
          "- **Contexto:** con pocas muestras no inventas un p95 de producción; reportas un proxy pesimista y el spread, con el nombre del proxy a la vista.\n- **Meta:** de `runs=[1,2,9]` obtener cola `max=9`, `spread=8` y etiqueta `p95_small_n`.\n- **Éxito:** `9` / `spread 8` / `proxy p95_small_n` / `ok True`.\n- **Límites:** no uses `min` como cola; no digas que esto es el p95 real de prod; sintético.",
        instruction:
          "1. Lee el starter: imprime `min` y `spread 0`.\n2. Calcula `tail = max(xs)` y `spread = max - min`.\n3. Mantén el nombre del proxy.\n4. `ok` si `tail == 9` y `spread == 8`.",
        hint: "Con N tiny, max es proxy pesimista; spread = max-min es nota de variabilidad.",
        hints: ["max(xs) y max(xs)-min(xs).", "En prod usa percentil real con más muestras."],
        edgeCases: ["variabilidad alta", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E3; predicado de dominio sobre fixture sintético.",
        feedback:
          "Nombra el proxy y reporta el spread; no lo confundes con un p95 de producción. Con N chico el max es pesimista honesto, no un SLI de prod.",
        retrospective:
          "Nombrar el proxy evita que el equipo trate un max de 3 runs como SLI de producción. El error clásico es esconder la cola o no reportar variabilidad. En budgets (T4) la mediana/p95 reales necesitan más muestras.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e3.py",
          code: `# E3 — proxy de cola + spread (sintético, sin PII)
xs = [1, 2, 9]
# DEFECT: usa min y no calcula spread
print(min(xs))
print("spread", 0)
print("proxy", "p95_small_n")
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-b-e3.py",
          code: `xs = [1, 2, 9]
tail = max(xs)
spread = max(xs) - min(xs)
print(tail)
print("spread", spread)
print("proxy", "p95_small_n")
print("ok", tail == 9 and spread == 8)
`,
          output: `9
spread 8
proxy p95_small_n
ok True`,
        },
      },
      {
        id: "S37-T2-A-E1",
        subtopicId: "S37-T2-A",
        kind: "guided",
        title: "Pares no ordenados: n*(n-1)//2",
        preamble:
          "- **Contexto:** el costo base del matching sintético se expresa en pares candidatos, no en `n²` con diagonal y dobles.\n- **Meta:** calcular `all_pairs` para `n=10` con la fórmula de combinaciones.\n- **Éxito:** `45` / `n 10` / `ok True`.\n- **Límites:** no uses `n*n` ni `n`; no inventes el 45 sin fórmula.",
        instruction:
          "1. Starter imprime `n * n` (100).\n2. Calcula `pairs = n * (n - 1) // 2`.\n3. Imprime pares, `n` y `ok` si `pairs == 45`.",
        hint: "Pares no ordenados: n*(n-1)//2.",
        hints: ["Pares no ordenados: n*(n-1)//2.", "No cuentes n² ni n."],
        edgeCases: ["doble conteo", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-A-E1; predicado de dominio sobre fixture sintético.",
        feedback:
          "La fórmula de pares es la base del costo de escala. `n*n` incluye diagonal y dobles: el revisor del path de matching no puede confiar en ese conteo.",
        retrospective:
          "`n*(n-1)//2` excluye diagonal y dobles: es el conteo que el revisor del path de matching puede confiar. El error clásico es `n*n` o inventar el 45 sin fórmula. Pregunta: con `n=10`, ¿qué sobra en el 100 de `n*n`? Luego (E2): `reduction` como fracción eliminada, no residual.",
        starterCode: {
          language: 'python',
          title: "s37-t2-a-e1.py",
          code: `# E1 — pares n*(n-1)/2 (sintético, sin PII)
n = 10
# DEFECT: usa n*n (cuenta diagonales / dobles)
print(n * n)
print("n", n)
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-a-e1.py",
          code: `n = 10
pairs = n * (n - 1) // 2
print(pairs)
print("n", n)
print("ok", pairs == 45)
`,
          output: `45
n 10
ok True`,
        },
      },
      {
        id: "S37-T2-A-E2",
        subtopicId: "S37-T2-A",
        kind: "independent",
        title: "Reduction: fracción de pares eliminada",
        preamble:
          "- **Contexto:** el reporte de blocking no basta con «bajaron los pares»: necesitas la fracción eliminada en [0,1], comparable entre fixtures.\n- **Meta:** con `blocked=10` y `all=45`, calcular `round(1 - blocked/all, 3)`.\n- **Éxito:** `0.778` / `ok True` / `blocking True`.\n- **Límites:** no reportes `blocked/all` como reduction; no lo confundas con `pair_factor = all//blocked` (T4-B).",
        instruction:
          "1. Starter imprime `blocked/all_p` (0.222).\n2. Calcula `reduction = round(1 - blocked / all_p, 3)`.\n3. Imprime reduction, `ok` si es 0.778, y `blocking True`.",
        hint: "reduction = 1 - blocked/all (fracción en [0,1]).",
        hints: ["reduction = 1 - blocked/all.", "No confundas con pair_factor = all//blocked de T4-B."],
        edgeCases: ["blocking sin métrica", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-A-E2; predicado de dominio sobre fixture sintético.",
        feedback:
          "`blocked/all` es el residual de candidatos, no la fracción eliminada. `reduction = 1 − blocked/all` vive en [0,1] y se compara entre fixtures; no lo confundas con `pair_factor = all//blocked` (entero de T4-B).",
        retrospective:
          "La fracción eliminada es la métrica comparable del blocking; el residual `blocked/all` solo describe lo que quedó. Pregunta: si reduction sube pero el recall de S30 cae, ¿celebras o reabres el gate de matching? Luego (E3): preferir blocking a microopt con números de pares.",
        starterCode: {
          language: 'python',
          title: "s37-t2-a-e2.py",
          code: `# E2 — reducción por blocking (sintético, sin PII)
all_p, blocked = 45, 10
# DEFECT: reporta blocked/all_p en vez de 1 - blocked/all_p
print(round(blocked / all_p, 3))
print("ok", True)
print("blocking", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-a-e2.py",
          code: `all_p, blocked = 45, 10
reduction = round(1 - blocked / all_p, 3)
print(reduction)
print("ok", reduction == 0.778)
print("blocking", True)
`,
          output: `0.778
ok True
blocking True`,
        },
      },
      {
        id: "S37-T2-A-E3",
        subtopicId: "S37-T2-A",
        kind: "transfer",
        title: "Preferir blocking a microopt del 1 %",
        preamble:
          "- **Contexto:** en el path O(n²) del triage, bajar un 1 % el inner loop y dejar casi todos los pares es teatro; el blocking de 4950→450 gana en números.\n- **Meta:** elegir `prefer 'blocking'` cuando `blocked < micro_pairs` y marcar `micro False`.\n- **Éxito:** `prefer blocking` / `ok True` / `micro False`.\n- **Límites:** no hardcodees el prefer sin comparar; no celebres microopt sin conteo de pares.",
        instruction:
          "1. Starter fija `prefer=\"microopt\"` y `micro=True`.\n2. Compara `blocked` vs. `micro_pairs`.\n3. Asigna `prefer` y `micro = (prefer == \"microopt\")`.\n4. Imprime prefer, `ok` (blocked < all y prefer blocking) y micro.",
        hint: "Bajar pares O(n²) domina micro-optimizar.",
        hints: ["Compara blocked vs. micro_pairs numéricamente.", "prefer = 'blocking' si blocked es menor; micro = (prefer == 'microopt')."],
        edgeCases: ["teatro de 1%", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-A-E3; predicado de dominio sobre fixture sintético.",
        feedback:
          "Priorizar blocking se decide con números de pares, no con lemas de «código más ingenioso». El PR del 1 % con n² intacto es teatro de escala.",
        retrospective:
          "El PR del 1–2 % con n² casi intacto es teatro de escala: los números de pares deciden, no el lema de «código más ingenioso». El error clásico es hardcodear `prefer='blocking'` sin comparar `blocked` vs. `micro_pairs`. Pregunta: si micro_pairs fuera 400 y blocked 450, ¿qué preferirías y por qué? En T2-B el orden operativo será block→score.",
        starterCode: {
          language: 'python',
          title: "s37-t2-a-e3.py",
          code: `# E3 — preferir blocking a microopt (sintético, sin PII)
# DEFECT: prefiere microoptimización sin comparar pares
all_pairs, blocked, micro_pairs = 4950, 450, 4900
prefer = "microopt"  # DEFECT: no usa blocked < micro_pairs
micro = True
print("prefer", prefer)
print("ok", blocked < all_pairs)
print("micro", micro)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-a-e3.py",
          code: `all_pairs, blocked, micro_pairs = 4950, 450, 4900
prefer = "blocking" if blocked < micro_pairs else "microopt"
micro = prefer == "microopt"
print("prefer", prefer)
print("ok", blocked < all_pairs and prefer == "blocking")
print("micro", micro)
`,
          output: `prefer blocking
ok True
micro False`,
        },
      },
      {
        id: "S37-T2-B-E1",
        subtopicId: "S37-T2-B",
        kind: "guided",
        title: "Membership con set, no list scan",
        preamble:
          "- **Contexto:** en el hot path del triage, consultar si un id ya se vio con un scan de lista O(n) se multiplica por cada par candidato.\n- **Meta:** construir un `set`, consultar membership y documentar la estructura correcta.\n- **Éxito:** `structure set` / `found True` / `scan False`.\n- **Límites:** no dejes `list_scan`; no inventes `found` sin consulta; sintético.",
        instruction:
          "1. Starter hace `target in ids` sobre lista y reporta `list_scan` / `scan True`.\n2. Construye `index = set(ids)` y consulta `target in index`.\n3. Imprime `structure 'set'`, `found` y `scan False`.",
        hint: "set/dict evitan scan lineal repetido.",
        hints: ["Construye set(ids) y consulta target in s.", "structure debe ser 'set' y scan False."],
        edgeCases: ["O(n) en loop caliente", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E1; predicado de dominio sobre fixture sintético.",
        feedback:
          "Elegir la estructura correcta (set vs. list scan) es optimización de verdad, no micro-shave de sintaxis. En el hot path del triage el O(n) se multiplica por cada par.",
        retrospective:
          "Documentar `structure set` y `scan False` fuerza la decisión de diseño, no solo el booleano `found`. El error clásico es list membership en bucle caliente del triage (O(n) × pares). Pregunta: si `found` ya es True con lista, ¿por qué igual falla el gate del lab? Luego (E2): tamaño del bloque Lima.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e1.py",
          code: `# E1 — estructura de índice (sintético, sin PII)
# DEFECT: membership sobre list y reporta list_scan (diseño O(n) repetible)
ids = [1, 2, 3, 4, 5]
target = 4
found = target in ids  # list membership; el diseño documenta list_scan
print("structure", "list_scan")
print("found", found)
print("scan", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-b-e1.py",
          code: `ids = [1, 2, 3, 4, 5]
target = 4
index = set(ids)
found = target in index
print("structure", "set")
print("found", found)
print("scan", False)
`,
          output: `structure set
found True
scan False`,
        },
      },
      {
        id: "S37-T2-B-E2",
        subtopicId: "S37-T2-B",
        kind: "independent",
        title: "Tamaño del bloque Lima",
        preamble:
          "- **Contexto:** el índice invertido solo es útil si el scorer opera dentro del bloque; el tamaño de Lima predice cuántos pares locales se generarán.\n- **Meta:** contar filas con ciudad `\"Lima\"` en el fixture sintético (sin inferir parentesco).\n- **Éxito:** `2` / `city Lima` / `ok True`.\n- **Límites:** no cuentes Cusco dentro de Lima; no inventes PII ni parentesco.",
        instruction:
          "1. Starter deja `count = 0` sin filtrar.\n2. Cuenta filas donde la ciudad es Lima.\n3. Imprime el conteo, la ciudad y `ok` si es 2.",
        hint: "Cuenta entidades por clave de blocking.",
        hints: ["Cuenta entidades por clave de blocking.", "Cusco no entra en el bloque Lima."],
        edgeCases: ["bloque vacío", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E2; predicado de dominio sobre fixture sintético.",
        feedback:
          "El tamaño del bloque predice los pares locales del scorer (`size*(size-1)//2` dentro de Lima). Ciudad es clave de lab: no afirma parentesco ni fraude. Contar Cusco dentro de Lima miente al costo del matching.",
        retrospective:
          "Contar Lima fuerza a mirar el skew del fixture antes de celebrar el blocking global. Pregunta: si Lima concentra el 90 % de las filas, ¿el blocking «global» sigue salvándote? Luego (E3): el orden operativo es block→score, no al revés.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e2.py",
          code: `# E2 — count Lima rows (sintético, sin PII)
# DEFECT: count queda en 0 (no filtra por ciudad Lima)
rows = [("Lima", "e1"), ("Lima", "e2"), ("Cusco", "e3")]
count = 0
print(count)
print("city", "Lima")
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-b-e2.py",
          code: `rows = [("Lima", "e1"), ("Lima", "e2"), ("Cusco", "e3")]
count = sum(1 for c, _ in rows if c == "Lima")
print(count)
print("city", "Lima")
print("ok", count == 2)
`,
          output: `2
city Lima
ok True`,
        },
      },
      {
        id: "S37-T2-B-E3",
        subtopicId: "S37-T2-B",
        kind: "transfer",
        title: "Orden operativo: block luego score",
        preamble:
          "- **Contexto:** el path de escala del matching no es «puntuar todo y luego filtrar»: primero se bloquea, luego se puntúa sobre candidatos reducidos.\n- **Meta:** con `n=10` y 5 bloques, fijar el orden correcto y reportar pares después del block.\n- **Éxito:** `order ['block', 'score']` / `pairs_after_block 5` / `ok True`.\n- **Límites:** no inviertas a score→block; no dejes `pairs_after = all_pairs`.",
        instruction:
          "1. Starter pone `order = [\"score\", \"block\"]` y `pairs_after = all_pairs`.\n2. Calcula `blocked` con bloques iguales.\n3. Asigna `order = [\"block\", \"score\"]` y `pairs_after = blocked`.\n4. Imprime order, pares y `ok` si pares < all_pairs.",
        hint: "Primero reduces candidatos; luego features.",
        hints: ["Calcula blocked_pairs con bloques iguales.", "order debe ser ['block','score']."],
        edgeCases: ["features O(n²)", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E3; predicado de dominio sobre fixture sintético.",
        feedback:
          "El orden block→score se demuestra con el conteo de pares, no con un lema. Features O(n²) «porque el scorer es el cuello» invierten el path de escala.",
        retrospective:
          "Features O(n²) «porque el scorer es el cuello» invierten el path de escala: primero se reduce el espacio de candidatos. El error clásico es dejar `pairs_after = all_pairs` con un lema de block. Pregunta: con `pairs_after_block 5` y `all_pairs 45`, ¿qué evidencia llevas al revisor? En memoria (T3) acotarás el pico con chunks y dtypes.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e3.py",
          code: `# E3 — orden block → score (sintético, sin PII)
# DEFECT: invierte el orden y no reduce pares
n, blocks = 10, 5
all_pairs = n * (n - 1) // 2
size = n // blocks
blocked = blocks * size * (size - 1) // 2
order = ["score", "block"]  # DEFECT
pairs_after = all_pairs     # DEFECT: puntúa el cartesiano
print("order", order)
print("pairs_after_block", pairs_after)
print("ok", pairs_after < all_pairs)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-b-e3.py",
          code: `n, blocks = 10, 5
all_pairs = n * (n - 1) // 2
size = n // blocks
blocked = blocks * size * (size - 1) // 2
order = ["block", "score"]
pairs_after = blocked
print("order", order)
print("pairs_after_block", pairs_after)
print("ok", pairs_after < all_pairs)
`,
          output: `order ['block', 'score']
pairs_after_block 5
ok True`,
        },
      },
      {
        id: "S37-T3-A-E1",
        subtopicId: "S37-T3-A",
        kind: "guided",
        title: "Número de chunks con ceil",
        preamble:
          "- **Contexto:** planificar el job out-of-core del fixture sintético exige saber cuántas ventanas habrá; truncar con `//` pierde el resto.\n- **Meta:** con `n=10` y `size=4`, calcular 3 chunks (último más corto).\n- **Éxito:** `3` / `size 4` / `ok True`.\n- **Límites:** no uses solo `n//size`; no asumas chunks de tamaño uniforme sin resto.",
        instruction:
          "1. Starter imprime `n // size` (2).\n2. Usa `(n + size - 1) // size`.\n3. Imprime n_chunks, size y `ok` si es 3.",
        hint: "Ceil: (n+size-1)//size.",
        hints: ["Ceil: (n+size-1)//size.", "Último chunk puede ser más corto."],
        edgeCases: ["OOM sin chunks", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-A-E1; predicado de dominio sobre fixture sintético.",
        feedback:
          "Contar chunks con ceil planifica el job out-of-core. `n//size` reporta 2 en vez de 3 y el revisor del budget de memoria no ve el último lote del fixture sintético.",
        retrospective:
          "Truncar con `//` «pierde» el último lote: el plan del nightly queda incompleto y el resto se procesa en silencio o se cae. El error clásico es asumir chunks uniformes sin resto. Pregunta: con `n=10` y `size=4`, ¿qué filas quedarían fuera si usas solo `n//size`? Luego (E2): no cargar columnas basura.",
        starterCode: {
          language: 'python',
          title: "s37-t3-a-e1.py",
          code: `# E1 — número de chunks (sintético, sin PII)
n, size = 10, 4
# DEFECT: truncamiento n//size (pierde el resto)
print(n // size)
print("size", size)
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-a-e1.py",
          code: `n, size = 10, 4
n_chunks = (n + size - 1) // size
print(n_chunks)
print("size", size)
print("ok", n_chunks == 3)
`,
          output: `3
size 4
ok True`,
        },
      },
      {
        id: "S37-T3-A-E2",
        subtopicId: "S37-T3-A",
        kind: "independent",
        title: "Subset columnar sin blobs",
        preamble:
          "- **Contexto:** el scorer del triage usa pocas columnas; arrastrar `blob` y `notes` multiplica I/O y RAM sin ganar recall.\n- **Meta:** proyectar solo `['id','amt']` y marcar `columnar True`.\n- **Éxito:** `['id', 'amt']` / `ok True` / `columnar True`.\n- **Límites:** no imprimas todas las claves del row; no dejes `columnar False` si proyectaste.",
        instruction:
          "1. Starter hace `cols = list(row.keys())` y `columnar False`.\n2. Proyecta con un dict comprehension sobre `keep = [\"id\", \"amt\"]`.\n3. Imprime las claves del subset, `ok` si no hay blob, y `columnar True`.",
        hint: "Lee solo columnas usadas por el scorer.",
        hints: ["Proyecta con un dict comprehension.", "blob y notes no deben quedar en el subset."],
        edgeCases: ["tabla ancha", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-A-E2; predicado de dominio sobre fixture sintético.",
        feedback:
          "Columnar es reducción de I/O, no solo de RAM. Si el scorer solo usa `id` y `amt`, leer `notes` no se justifica ante el revisor del budget de memoria.",
        retrospective:
          "Proyectar solo las columnas del scorer es el bound de I/O del batch sintético; arrastrar `blob` multiplica bytes sin recall. Pregunta: si el scorer solo usa `id` y `amt`, ¿qué justificas al revisor por leer `notes`? Luego (E3): dtype estrecho por `itemsize`.",
        starterCode: {
          language: 'python',
          title: "s37-t3-a-e2.py",
          code: `# E2 — subset columnar (sintético, sin PII)
# DEFECT: carga todas las columnas
row = {"id": 1, "amt": 10, "blob": "xx", "notes": "n/a"}
cols = list(row.keys())  # DEFECT: sin proyección
print(cols)
print("ok", True)
print("columnar", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-a-e2.py",
          code: `row = {"id": 1, "amt": 10, "blob": "xx", "notes": "n/a"}
keep = ["id", "amt"]
subset = {c: row[c] for c in keep}
print(list(subset.keys()))
print("ok", "blob" not in subset)
print("columnar", True)
`,
          output: `['id', 'amt']
ok True
columnar True`,
        },
      },
      {
        id: "S37-T3-A-E3",
        subtopicId: "S37-T3-A",
        kind: "transfer",
        title: "dtype estrecho por itemsize",
        preamble:
          "- **Contexto:** el bound de memoria del batch sintético se discute en bytes, no en intuición de «int64 siempre seguro».\n- **Meta:** comparar `itemsize` de `'i'` vs. `'q'` y elegir int32 cuando cabe y ahorra.\n- **Éxito:** `dtype int32` / `ok True` / `mem lower`.\n- **Límites:** no fuerces int64 sin comparar; no ignores overflow si el dominio no cabe (aquí el lab asume que sí).",
        instruction:
          "1. Starter deja `dtype = \"int64\"` y `mem = \"higher\"`.\n2. Compara `i32` e `i64` con `array.array`.\n3. Elige dtype y mem según `i32 < i64`.\n4. Imprime dtype, `ok` y mem.",
        hint: "Si el rango cabe en int32, ahorras memoria.",
        hints: ["import array; array.array('i').itemsize vs. 'q'.", "Elige int32 cuando itemsize_i es menor."],
        edgeCases: ["overflow si no cabe", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-A-E3; predicado de dominio sobre fixture sintético.",
        feedback:
          "El dtype se elige midiendo `itemsize` (`'i'` vs. `'q'`), no por fe de «int64 siempre seguro». Sin comparar bytes, el default ancho infla el bound del batch sintético aunque el dominio quepa en int32.",
        retrospective:
          "Overflow sigue siendo riesgo si el dominio no cabe: aquí el lab asume que sí y exige evidencia de ahorro. El error clásico es forzar int64 sin medición. Pregunta: si `i32 == i64` en una plataforma rara, ¿qué imprime el lab y por qué `ok` depende de la comparación? En caché (T3-B) el riesgo pasa a ser datos stale, no solo bytes.",
        starterCode: {
          language: 'python',
          title: "s37-t3-a-e3.py",
          code: `# E3 — dtype estrecho (sintético, sin PII)
# DEFECT: usa int64 por defecto sin comparar itemsize
import array
i32 = array.array("i", [1, 2, 3]).itemsize
i64 = array.array("q", [1, 2, 3]).itemsize
dtype = "int64"  # DEFECT
mem = "higher"
print("dtype", dtype)
print("ok", True)
print("mem", mem)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-a-e3.py",
          code: `import array
i32 = array.array("i", [1, 2, 3]).itemsize
i64 = array.array("q", [1, 2, 3]).itemsize
dtype = "int32" if i32 < i64 else "int64"
mem = "lower" if i32 < i64 else "higher"
print("dtype", dtype)
print("ok", i32 < i64)
print("mem", mem)
`,
          output: `dtype int32
ok True
mem lower`,
        },
      },
      {
        id: "S37-T3-B-E1",
        subtopicId: "S37-T3-B",
        kind: "guided",
        title: "Cache key: versión + cutoff",
        preamble:
          "- **Contexto:** reutilizar features del triage con solo la versión de feature set colisiona: distinto cutoff, mismos scores viejos.\n- **Meta:** armar la key completa `('fs-v1','cut')` y obtener hit en el store sintético.\n- **Éxito:** `('fs-v1', 'cut')` / `hit True` / `ok True`.\n- **Límites:** no dejes la key de un solo elemento; no hardcodees hit sin `in cache`.",
        instruction:
          "1. Starter usa `key = (\"fs-v1\",)` y falla el hit.\n2. Incluye el cutoff en la tupla.\n3. Calcula `hit = key in cache`.\n4. Imprime key, hit y `ok` si hit y `len(key)==2`.",
        hint: "Key = versión de features + cutoff.",
        hints: ["Key = versión de features + cutoff.", "Sin cutoff reutilizas scores viejos."],
        edgeCases: ["cache stale", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-B-E1; predicado de dominio sobre fixture sintético.",
        feedback:
          "La key completa (versión + cutoff) evita colisiones entre corridas del triage. Sin cutoff reutilizas scores viejos y el matching miente en silencio aunque el print «se vea limpio».",
        retrospective:
          "Sin cutoff, distinto lote temporal colisiona con scores viejos y el hit «verde» es mentira. El error clásico es key de un solo elemento o hardcodear `hit True`. Pregunta: ¿por qué `ok` exige `len(key)==2` además del hit? Luego (E2): miss explícito al cambiar versión.",
        starterCode: {
          language: 'python',
          title: "s37-t3-b-e1.py",
          code: `# E1 — cache key con cutoff (sintético, sin PII)
# DEFECT: key sin cutoff → miss falso
key = ("fs-v1",)
cache = {("fs-v1", "cut"): True}
print(key)
print("hit", key in cache)
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-b-e1.py",
          code: `key = ("fs-v1", "cut")
cache = {("fs-v1", "cut"): True}
hit = key in cache
print(key)
print("hit", hit)
print("ok", hit and len(key) == 2)
`,
          output: `('fs-v1', 'cut')
hit True
ok True`,
        },
      },
      {
        id: "S37-T3-B-E2",
        subtopicId: "S37-T3-B",
        kind: "independent",
        title: "Miss al cambiar feature set",
        preamble:
          "- **Contexto:** al subir de `fs-v1` a `fs-v2` los pares o features cacheados no deben pegar; el miss es la señal de recompute.\n- **Meta:** detectar miss, publicar `reason 'version_change'` y `stale True`.\n- **Éxito:** `version_change` / `hit False` / `stale True`.\n- **Límites:** no inventes hit True; no uses `keep_forever` como política.",
        instruction:
          "1. Starter imprime `keep_forever` y fuerza `hit True`.\n2. Calcula `hit = new_key in store`.\n3. Si no hay hit → `reason = \"version_change\"` y `stale = not hit`.\n4. Imprime reason, hit y stale.",
        hint: "Al cambiar feature set, la key nueva no pega.",
        hints: ["hit = new_key in store.", "Si no hay hit tras cambio de versión, reason=version_change."],
        edgeCases: ["cutoff change", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-B-E2; predicado de dominio sobre fixture sintético.",
        feedback:
          "Invalidar al cambiar feature set es parte del diseño del cache, no un afterthought. Servir scores de `fs-v1` con el scorer de `fs-v2` rompe `same_result` en silencio y el hit verde es stale.",
        retrospective:
          "Un miss por `version_change` es la señal de recompute, no un fallo cosmético del cache. El error clásico es `keep_forever` o forzar `hit True`. Pregunta: ¿qué rompe en el matching si sirves scores de `fs-v1` con el scorer de `fs-v2`? Luego (E3): out-of-core por chunks acota RAM del batch.",
        starterCode: {
          language: 'python',
          title: "s37-t3-b-e2.py",
          code: `# E2 — invalidación por versión (sintético, sin PII)
# DEFECT: no detecta miss tras cambio de versión
store = {("fs-v1", "cut"): {"n_pairs": 100}}
new_key = ("fs-v2", "cut")
hit = new_key in store
print("keep_forever")
print("hit", True)  # DEFECT
print("stale", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-b-e2.py",
          code: `store = {("fs-v1", "cut"): {"n_pairs": 100}}
new_key = ("fs-v2", "cut")
hit = new_key in store
reason = "version_change" if not hit else "hit"
print(reason)
print("hit", hit)
print("stale", not hit)
`,
          output: `version_change
hit False
stale True`,
        },
      },
      {
        id: "S37-T3-B-E3",
        subtopicId: "S37-T3-B",
        kind: "transfer",
        title: "Out-of-core por chunks",
        preamble:
          "- **Contexto:** el batch de triage puede crecer de noche; asumir `load_all` en RAM es OOM programado.\n- **Meta:** procesar `range(10)` en chunks de 4 y demostrar RAM acotada con `max_chunk`.\n- **Éxito:** `ooc chunk` / `max_chunk 4` / `ram bounded`.\n- **Límites:** no uses `ooc load_all`; no reportes `max_chunk=len(data)`.",
        instruction:
          "1. Starter imprime load_all y `max_chunk` = longitud total.\n2. Parte `data` en ventanas de `size`.\n3. Calcula `max_chunk` y elige `ooc 'chunk'` / `ram 'bounded'` si el max ≤ size.\n4. Imprime los tres campos.",
        hint: "chunk/spill acotan RAM.",
        hints: ["max(len(c) for c in chunks) debe ser size.", "ooc='chunk' cuando no cargas load_all."],
        edgeCases: ["OOM en nightly", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-B-E3; predicado de dominio sobre fixture sintético.",
        feedback:
          "Out-of-core se demuestra con el tamaño máximo de chunk, no con un lema. «En mi laptop cabe» no es un bound de memoria para el nightly.",
        retrospective:
          "«En mi laptop cabe» no es un bound de memoria para el nightly del triage. El error clásico es reportar `max_chunk=len(data)` con `ooc load_all`. Pregunta: si `max_chunk` es 4 y `size` es 4, ¿qué evidencia de RAM acotada llevas al budget de T4? En T4 el umbral podrá fallar en CI light.",
        starterCode: {
          language: 'python',
          title: "s37-t3-b-e3.py",
          code: `# E3 — out-of-core (sintético, sin PII)
# DEFECT: asume todo en RAM
data = list(range(10))
size = 4
# DEFECT: load_all
print("ooc", "load_all")
print("max_chunk", len(data))
print("ram", "unbounded")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-b-e3.py",
          code: `data = list(range(10))
size = 4
chunks = [data[i:i + size] for i in range(0, len(data), size)]
max_chunk = max(len(c) for c in chunks)
print("ooc", "chunk")
print("max_chunk", max_chunk)
print("ram", "bounded" if max_chunk <= size else "unbounded")
`,
          output: `ooc chunk
max_chunk 4
ram bounded`,
        },
      },
      {
        id: "S37-T4-A-E1",
        subtopicId: "S37-T4-A",
        kind: "guided",
        title: "Budget pass: measured ≤ budget",
        preamble:
          "- **Contexto:** el assert del PR sintético de performance del triage debe ser `measured <= budget`, no al revés.\n- **Meta:** con measured 9 y budget 10, reportar pass y ambos números.\n- **Éxito:** `True` / `budget 10` / `measured 9`.\n- **Límites:** no inviertas el signo; no omitas publicar budget y measured.",
        instruction:
          "1. Starter imprime `measured > budget` (False incorrecto para el caso pass).\n2. Cambia a `measured <= budget`.\n3. Imprime el booleano, budget y measured.",
        hint: "pass si measured <= budget.",
        hints: ["pass si measured <= budget.", "Publica ambos números en el test."],
        edgeCases: ["flaky sin warmup", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-A-E1; predicado de dominio sobre fixture sintético.",
        feedback:
          "El signo del budget es el assert del PR de escala. Comparar al revés hace «pasar» cuando se viola el umbral y engaña a CI light: el revisor ve verde con measured por encima del umbral.",
        retrospective:
          "Comparar al revés hace «pasar» cuando se viola el umbral y engaña a CI light. El error clásico es `measured > budget` copiado de un test de «exceso». Pregunta: con measured 9 y budget 10, ¿qué imprime un signo invertido y por qué el revisor lo rechaza? Luego (E2): el caso fail debe imprimir `False` calculado.",
        starterCode: {
          language: 'python',
          title: "s37-t4-a-e1.py",
          code: `# E1 — budget pass bajo umbral (sintético, sin PII)
budget, measured = 10, 9
# DEFECT: compara al revés
print(measured > budget)
print("budget", budget)
print("measured", measured)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-a-e1.py",
          code: `budget, measured = 10, 9
print(measured <= budget)
print("budget", budget)
print("measured", measured)
`,
          output: `True
budget 10
measured 9`,
        },
      },
      {
        id: "S37-T4-A-E2",
        subtopicId: "S37-T4-A",
        kind: "independent",
        title: "Budget fail: el test puede poner rojo",
        preamble:
          "- **Contexto:** un budget que siempre imprime `True` no protege el path de escala; en CI light el rojo es salud del sistema.\n- **Meta:** con measured 12 y budget 10, reportar `False` calculado.\n- **Éxito:** `False` / `budget 10` / `measured 12`.\n- **Límites:** no hardcodees `True`; no «arregles» el caso cambiando measured.",
        instruction:
          "1. Starter hace `print(True)` aunque measured > budget.\n2. Usa el mismo predicado `measured <= budget`.\n3. Imprime el booleano y ambos números.",
        hint: "El test debe poder fallar.",
        hints: ["El test debe poder fallar.", "False aquí es salud del sistema."],
        edgeCases: ["assert True hardcode", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-A-E2; predicado de dominio sobre fixture sintético.",
        feedback:
          "Un budget que no puede fallar no es un budget. Si el scorer sube de 10 a 80 ms y el test sigue verde, nadie se entera antes de prod.",
        retrospective:
          "Hardcodear `print(True)` es decoración de CI, no regresión de performance. El error clásico es «arreglar» el caso bajando measured en el test. Pregunta: si el scorer sube de 10 a 80 ms y el test sigue verde, ¿quién se entera antes de prod? Luego (E3): budget en latency + memory + pairs a la vez.",
        starterCode: {
          language: 'python',
          title: "s37-t4-a-e2.py",
          code: `# E2 — budget fail sobre umbral (sintético, sin PII)
budget, measured = 10, 12
# DEFECT: hardcodea True aunque measured>budget
print(True)
print("budget", budget)
print("measured", measured)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-a-e2.py",
          code: `budget, measured = 10, 12
print(measured <= budget)
print("budget", budget)
print("measured", measured)
`,
          output: `False
budget 10
measured 12`,
        },
      },
      {
        id: "S37-T4-A-E3",
        subtopicId: "S37-T4-A",
        kind: "transfer",
        title: "Budget en tres dimensiones",
        preamble:
          "- **Contexto:** bajar p95 inflando pares candidatos o memoria es un tradeoff oculto; el gate de escala del triage mira las tres dimensiones.\n- **Meta:** con límites y medidos de latency/memory/pairs, calcular `all_pass` y listar las tres keys.\n- **Éxito:** `['latency_p95', 'memory', 'pairs']` / `all_pass True` / `n 3`.\n- **Límites:** no budgetees solo latency; no hardcodees `all_pass True`.",
        instruction:
          "1. Starter deja `budget` solo con latency y fuerza `all_pass True`.\n2. Completa budget con memory 512 y pairs 10000.\n3. `all_pass = all(measured[k] <= budget[k] for k in keys)`.\n4. Imprime keys, all_pass y `n` = 3.",
        hint: "Latencia sola no basta: cada dimensión debe cumplir measured <= budget.",
        hints: ["Incluye las tres claves en el dict de límites.", "all_pass = all(measured[k] <= budget[k] for k in keys)."],
        edgeCases: ["solo p95", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-A-E3; predicado de dominio sobre fixture sintético.",
        feedback:
          "Bajar p95 inflando pares candidatos o memoria es un tradeoff oculto. El gate de escala exige `measured[k] <= budget[k]` en latency, memory y pairs — no un `all_pass True` hardcodeado con solo latency en el dict.",
        retrospective:
          "El error clásico es «pasa p95» con el cartesiano intacto. Pregunta: si memory y pairs fallan pero latency pasa, ¿qué debe imprimir `all_pass` y por qué? En T4-B el entregable será el reporte before/after legible con dataset y hardware.",
        starterCode: {
          language: 'python',
          title: "s37-t4-a-e3.py",
          code: `# E3 — dimensiones del budget (sintético, sin PII)
# DEFECT: solo budgetea latency y hardcodea all_pass
budget = {"latency_p95": 50}
measured = {"latency_p95": 12, "memory": 400, "pairs": 8000}
keys = list(budget.keys())
print(keys)
print("all_pass", True)  # DEFECT: no compara las tres métricas
print("n", len(keys))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-a-e3.py",
          code: `budget = {"latency_p95": 50, "memory": 512, "pairs": 10_000}
measured = {"latency_p95": 12, "memory": 400, "pairs": 8000}
keys = ["latency_p95", "memory", "pairs"]
all_pass = all(measured[k] <= budget[k] for k in keys)
print(keys)
print("all_pass", all_pass)
print("n", len(keys))
`,
          output: `['latency_p95', 'memory', 'pairs']
all_pass True
n 3`,
        },
      },
      {
        id: "S37-T4-B-E1",
        subtopicId: "S37-T4-B",
        kind: "guided",
        title: "Speedup = before / after",
        preamble:
          "- **Contexto:** el revisor del PR de escala lee un ratio «cuántas veces más rápido», no el inverso ni una resta de ms.\n- **Meta:** con before 80 y after 20, calcular speedup 4.0 y marcar `micro_only False`.\n- **Éxito:** `4.0` / `ok True` / `micro_only False`.\n- **Límites:** no uses after/before; no marques micro_only si ganó el algoritmo/blocking.",
        instruction:
          "1. Starter imprime `after / before` (0.25) y `micro_only True`.\n2. Calcula `speedup = before / after`.\n3. Imprime speedup, `ok` si es 4.0 y `micro_only False`.",
        hint: "speedup = before_ms / after_ms.",
        hints: ["speedup = before_ms / after_ms.", "micro_only False si ganó el algo."],
        edgeCases: ["división por cero", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E1; predicado de dominio sobre fixture sintético.",
        feedback:
          "`speedup` es un ratio, no una diferencia ni el inverso. after/before (0.25) confunde al revisor del PR; `micro_only True` solo si el gain fue cosmético, no cuando ganó blocking o algoritmo.",
        retrospective:
          "after/before (0.25) confunde al revisor: no es «cuántas veces más rápido». El error clásico es marcar `micro_only True` cuando ganó blocking/algoritmo. Pregunta: con before 80 y after 20, ¿qué ratio debe ver el PR y por qué `micro_only` es False? Luego (E2): claridad vs. shave del 2 %.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e1.py",
          code: `# E1 — speedup before/after (sintético, sin PII)
before, after = 80, 20
# DEFECT: after/before (inverso) y marca micro_only
print(after / before)
print("ok", True)
print("micro_only", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-b-e1.py",
          code: `before, after = 80, 20
speedup = before / after
print(speedup)
print("ok", speedup == 4.0)
print("micro_only", False)
`,
          output: `4.0
ok True
micro_only False`,
        },
      },
      {
        id: "S37-T4-B-E2",
        subtopicId: "S37-T4-B",
        kind: "independent",
        title: "Claridad sobre un shave del 2 %",
        preamble:
          "- **Contexto:** el costo total del path de escala incluye bugs y review humana; un 2 % opaco suele ser pérdida neta frente a un gain algorítmico medido (0.80).\n- **Meta:** preferir `'clarity'` cuando `micro_gain < 0.05` y `algo_gain > micro_gain`, con `shave '2pct_no'`.\n- **Éxito:** `prefer clarity` / `ok True` / `shave 2pct_no`.\n- **Límites:** no hardcodees micro_shave; aplica la regla de gains.",
        instruction:
          "1. Starter fija `prefer=\"micro_shave\"` y `shave=\"2pct_yes\"`.\n2. Aplica la condición de umbral 0.05 y comparación de gains.\n3. Deriva `shave` del prefer.\n4. Imprime prefer, ok y shave.",
        hint: "Costo total incluye bugs y review.",
        hints: ["Compara algo_gain vs. micro_gain con la regla del umbral 0.05.", "2% opaco suele ser pérdida neta frente a un gain algorítmico medido."],
        edgeCases: ["heroics sin medición", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E2; predicado de dominio sobre fixture sintético.",
        feedback:
          "La claridad es performance de equipo medida con gains, no un lema. Un shave del 2 % que oscurece el scorer se paga a las 3 a. m. con un bug.",
        retrospective:
          "Aplicar la regla de gains (`micro_gain < 0.05` y `algo_gain > micro_gain`) es la decisión medible; hardcodear `prefer='clarity'` sin la condición es teatro. El error clásico es el PR del 2 % opaco sin medición. Pregunta: si micro_gain fuera 0.12 y algo_gain 0.10, ¿qué preferirías según la regla del lab? En E3: claves del reporte completo.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e2.py",
          code: `# E2 — claridad > shave 2% (sintético, sin PII)
# DEFECT: prefiere micro-shave sin aplicar la regla de gains
algo_gain, micro_gain = 0.80, 0.02
prefer = "micro_shave"  # DEFECT: ignora algo_gain > micro_gain y umbral 0.05
shave = "2pct_yes"
print("prefer", prefer)
print("ok", algo_gain > micro_gain)
print("shave", shave)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-b-e2.py",
          code: `algo_gain, micro_gain = 0.80, 0.02
prefer = "clarity" if micro_gain < 0.05 and algo_gain > micro_gain else "micro_shave"
shave = "2pct_no" if prefer == "clarity" else "2pct_yes"
print("prefer", prefer)
print("ok", algo_gain > micro_gain and prefer == "clarity")
print("shave", shave)
`,
          output: `prefer clarity
ok True
shave 2pct_no`,
        },
      },
      {
        id: "S37-T4-B-E3",
        subtopicId: "S37-T4-B",
        kind: "transfer",
        title: "Reporte: dataset y hardware incluidos",
        preamble:
          "- **Contexto:** un speedup sin dataset ni hardware no es comparable entre laptops ni entre PRs; el gate de `CASO-LIM-037` exige el reporte completo.\n- **Meta:** construir un dict con `before`, `after`, `dataset` y `hardware` y listar las cuatro keys.\n- **Éxito:** `['before', 'after', 'dataset', 'hardware']` / `ok True` / `n 4`.\n- **Límites:** no dejes solo before/after; no inventes PII en el dataset (usa etiqueta sintética).",
        instruction:
          "1. Starter solo tiene before/after.\n2. Añade `dataset` y `hardware` del lab sintético.\n3. Publica la lista canónica de keys y `ok` si el set del report coincide.\n4. Imprime keys, ok y n=4.",
        hint: "Sin hardware/dataset el speedup no es comparable.",
        hints: ["Cuatro claves mínimas del reporte.", "n = len(keys)."],
        edgeCases: ["bench no reproducible", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E3; predicado de dominio sobre fixture sintético.",
        feedback:
          "El reporte completo es el entregable, no el «feeling» del PR. Sin dataset/hardware el speedup no es comparable entre laptops ni entre revisores del gate de escala.",
        retrospective:
          "Publicar solo ms before/after no es comparable entre laptops ni entre PRs. El error clásico es dejar `ok True` con dos claves. Pregunta: si el set del report no coincide con `{before, after, dataset, hardware}`, ¿qué falla en el gate de CASO-LIM-037? En You Do armarás el dict `report` con pares, reduction, same_result y budget.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e3.py",
          code: `# E3 — reporte before/after completo (sintético, sin PII)
# DEFECT: omite dataset y hardware
report = {"before": 100, "after": 20}
keys = list(report.keys())
print(keys)
print("ok", True)
print("n", len(keys))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-b-e3.py",
          code: `report = {
    "before": 100,
    "after": 20,
    "dataset": "red-andina-synth",
    "hardware": "laptop-lab",
}
keys = ["before", "after", "dataset", "hardware"]
required = set(keys)
print(keys)
print("ok", set(report.keys()) == required)
print("n", len(keys))
`,
          output: `['before', 'after', 'dataset', 'hardware']
ok True
n 4`,
        },
      },
    ],
  },
  youDo: {
    title: "Reporte antes/después de escala del triage",
    context:
      "En `CASO-LIM-037` cierras el gate de escala del triage: mides el path caro O(n²), aplicas blocking, demuestras `same_result` comparando salidas de las funciones cronometradas y publicas un `report` con ms, pares, reduction, budget, dataset y hardware del lab. Solo fixture sintético Red Andina; sin PII real ni inferencia de fraude. El speedup sin `same_result` o sin dataset anotado no cuenta para el portfolio. No hardcodees `same_result=True`; anota hardware real del lab (p. ej. M2-16GB); si el budget falla con n=200, justifica o ajusta blocks/budget con transparencia.",
    objectives: [
      "Perfilar wall (y CPU si aplica) con `n` y `same_result` calculado sobre las funciones medibles.",
      "Medir blocking reduction (pares before/after) sin abandonar el recall como gate de matching.",
      "Aplicar caché/chunks con invalidación o bound de memoria.",
      "Publicar budget que puede fallar + reporte before/after con dataset y hardware.",
    ],
    requirements: [
      "El mismo resultado funcional (salidas de before/after, no un campo inventado)",
      "Dataset y hardware anotados",
      "Documentación en español profesional",
      "Budget que puede fallar en CI light",
    ],
    starterCode: `import time
import statistics

def bench(fn, n=5):
    fn()  # warmup
    ts = []
    for _ in range(n):
        t0 = time.perf_counter()
        fn()
        ts.append(time.perf_counter() - t0)
    return statistics.median(ts)

def all_pairs(n: int) -> int:
    return n * (n - 1) // 2

def blocked_pairs(n: int, blocks: int) -> int:
    """Cuenta los n registros (reparte el resto entre bloques)."""
    base, rem = divmod(n, blocks)
    total = 0
    for b in range(blocks):
        size = base + (1 if b < rem else 0)
        total += size * (size - 1) // 2
    return total

def match_score(values):
    """Resultado funcional sintético que ambas rutas deben preservar."""
    return sum(v * v for v in values)

def before_path(values):
    """Path caro: scrute pares O(n²) y devuelve el score semántico."""
    n = len(values)
    for i in range(n):
        for j in range(i + 1, n):
            _ = values[i] + values[j]
    return match_score(values)

def after_path(values, blocks):
    """Path reducido: trabajo por bloque; misma semántica de score."""
    n = len(values)
    base, rem = divmod(n, blocks)
    start = 0
    for b in range(blocks):
        size = base + (1 if b < rem else 0)
        block = values[start:start + size]
        start += size
        for i in range(len(block)):
            for j in range(i + 1, len(block)):
                _ = block[i] + block[j]
    return match_score(values)

if __name__ == "__main__":
    n = 200
    blocks = 10
    values = list(range(n))  # fixture sintético compartido
    # same_result se calcula sobre las salidas de las funciones cronometradas
    before_val = before_path(values)
    after_val = after_path(values, blocks)
    ok_same = before_val == after_val
    before_ms = bench(lambda: before_path(values)) * 1000
    after_ms = bench(lambda: after_path(values, blocks)) * 1000
    pairs_before = all_pairs(n)
    pairs_after = blocked_pairs(n, blocks)
    budget_ms = 50.0
    budget_pass = after_ms <= budget_ms
    reduction = round(1 - pairs_after / pairs_before, 3)
    # Completa el reporte del gate de escala (rellena dataset/hardware de tu lab):
    report = {
        "before_ms": round(before_ms, 3),
        "after_ms": round(after_ms, 3),
        "pairs_before": pairs_before,
        "pairs_after": pairs_after,
        "reduction": reduction,
        "same_result": ok_same,
        "budget_ms": budget_ms,
        "budget_pass": budget_pass,
        "dataset": "red-andina-synth-n200",  # anota el fixture exacto
        "hardware": "laptop-lab",  # p. ej. M2-16GB
    }
    assert ok_same, "same_result falló: no publiques speedup con semántica distinta"
    print("report", report)
    print("report_keys", sorted(report.keys()))
    print("gate_ok", ok_same and "dataset" in report and "hardware" in report)
`,
    portfolioNote:
      "Escala del triage: adjunta el dict `report` (before/after ms, pares, `reduction`, `same_result`, `budget`, `dataset`, `hardware`) y una nota breve del tradeoff en español profesional. Traspaso a S38: colas y reintentos sobre el mismo gate.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con el assert de `same_result` y el `budget_pass` calculado? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, n mayor, recall de S30)? (3) Escribe en el README una frase de impacto medible (p. ej. «pares 19900→~1800, same_result True, budget documentado») que puedas defender en 30 segundos ante un revisor. Puente a S38: colas y reintentos sobre el mismo gate.",
    rubric: [
      { criterion: "Alineación al gate de escala de la sección (same_result + before/after + budget)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Before/after con el mismo resultado (salidas de las funciones medibles)", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Warmup sirve para:",
        options: ["Estabilizar benches descartando cold start", "Reemplazar la mediana por un solo run frío", "Eliminar la necesidad de reportar n", "Sustituir same_result en el gate de escala"],
        correctIndex: 0,
        explanation: "La primera corrida incluye cold start (arranque en frío); el warmup la descarta para reportar el estado estacionario del algoritmo.",
      },
      {
        question: "Blocking reduce:",
        options: ["La necesidad de medir recall de pares útiles", "Solo el tamaño del log de auditoría", "Pares candidatos O(n²) (con tradeoff de recall)", "La obligación de anotar hardware en el reporte"],
        correctIndex: 2,
        explanation: "Particionar por clave reduce el número de pares que entran al scorer caro; el recall sigue siendo el gate (S30).",
      },
      {
        question: "Performance budget en CI:",
        options: ["Es opcional si el PR «se siente» más rápido", "Solo se mide en prod un año después", "Reemplaza tests funcionales de matching", "Falla si se rompe el límite acordado sobre el fixture"],
        correctIndex: 3,
        explanation: "El test de regresión de performance debe poder poner en rojo el PR cuando se viola el budget.",
      },
      {
        question: "Microoptimizar un 2 % sin medición:",
        options: ["Best practice si el código queda más opaco", "Teatro; prioriza claridad y cambios algorítmicos medidos", "Obligatorio antes de todo blocking", "Invalida la mediana del bench"],
        correctIndex: 1,
        explanation: "El costo total incluye bugs y review; sin medición, el 2 % es ruido y a menudo pérdida neta.",
      },
      {
        question: "Un wall_ms sin n en el reporte:",
        options: ["No es comparable entre cambios de dataset", "Es suficiente para el gate de escala si publicas hardware", "Reemplaza same_result cuando el budget pasa", "Hace innecesario el warmup si usas mediana"],
        correctIndex: 0,
        explanation: "Sin el tamaño del input no puedes comparar benches ni validar que el fixture no cambió en silencio. El hardware ayuda, pero no sustituye `n`.",
      },
    ],
  },
  resources: {
    docs: [
      { label: "Python time.perf_counter", url: "https://docs.python.org/3/library/time.html#time.perf_counter", note: "Wall clock monotónico" },
      { label: "Python time.process_time", url: "https://docs.python.org/3/library/time.html#time.process_time", note: "CPU del proceso" },
      { label: "Python timeit", url: "https://docs.python.org/3/library/timeit.html", note: "Microbenchmarks" },
      { label: "Python profilers (cProfile)", url: "https://docs.python.org/3/library/profile.html", note: "Nombra la función caliente tras medir wall" },
      { label: "Python tracemalloc", url: "https://docs.python.org/3/library/tracemalloc.html", note: "Memoria" },
      { label: "collections.defaultdict", url: "https://docs.python.org/3/library/collections.html#collections.defaultdict", note: "Índice invertido" },
      { label: "Big-O cheat sheet", url: "https://www.bigocheatsheet.com/", note: "Complejidad" },
      { label: "SRE workbook — monitoring", url: "https://sre.google/workbook/monitoring/", note: "Budgets y SLI" },
      { label: "pytest docs", url: "https://docs.pytest.org/", note: "Regresión de performance en CI" },
    ],
    books: [
      { label: "High Performance Python", note: "Profiling y memoria" },
      { label: "Algorithms (Sedgewick) / CLRS", note: "Complejidad y diseño" },
    ],
    courses: [
      { label: "MIT 6.006 Introduction to Algorithms (OCW)", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", note: "Asymptotics" },
      { label: "Coursera: Algorithms, Part I (Princeton)", url: "https://www.coursera.org/learn/algorithms-part1", note: "Big-O y costos" },
      { label: "Stanford CS161 Algorithms", url: "https://web.stanford.edu/class/cs161/", note: "Diseño algorítmico" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python", note: "Pedagogía progresiva" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Python con stdlib primero" },
    ],
  },
}
