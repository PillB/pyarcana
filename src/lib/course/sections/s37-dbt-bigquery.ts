import type { CourseSection } from '../../types'

export const section37: CourseSection = {
  id: "dbt-bigquery",
  index: 37,
  title: "Profiling, algoritmos y rendimiento",
  shortTitle: "Profiling y rendimiento",
  tagline: "reporte antes/después con mismo resultado, dataset, hardware y límites; optimización reversible y justificada",
  estimatedHours: 19,
  level: "Competente a experto",
  phase: 2,
  icon: "Timer",
  accentColor: "bg-gradient-to-br from-purple-400 to-indigo-900",
  jobRelevance:
    "Escala el triage midiendo **antes/después** con el mismo dataset sintético. En data eng y ML ops de la región, un speedup sin same_result o sin budget en CI es regresión disfrazada. Optimizar no justifica saltarse privacidad ni tests. Caso CASO-LIM-037.",
  learningOutcomes: [
    { text: "Profilear wall y CPU (perf_counter / process_time) y anotar memoria con n explícito" },
    { text: "Benchmarkear con warmup, mediana y una nota de variabilidad (rango o IQR simple)" },
    { text: "Analizar complejidad O(n²) y medir reducción por blocking sin abandonar recall" },
    { text: "Reducir candidatos con estructuras e índices invertidos antes del scorer" },
    { text: "Aplicar dtypes angostos, chunks y lectura columnar mínima con bound de memoria" },
    { text: "Diseñar cache con invalidación por versión/cutoff y estrategia out-of-core" },
    { text: "Fijar performance budgets y tests de regresión que pueden fallar en CI light" },
    { text: "Priorizar costo total y claridad sobre microoptimización del 2% sin medición" },
  ],
  theory: [
    {
      heading: "Rendimiento del triage (CP-N3-C escala)",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Wall time:** reloj de pared (`time.perf_counter`). **CPU time:** tiempo de procesador (`time.process_time`). **Warmup:** corrida descartada (el cold start miente). **Blocking:** particionar por clave para no generar todos los pares O(n²). **Performance budget:** umbral de ms/memoria/pares que el CI light puede fallar. **same_result:** el speedup no vale si cambia el resultado funcional del matching/features.",
        "Escalar el triage no es «hacer el código más clever»: es medir el path caliente, preservar el mismo resultado funcional y publicar un reporte antes/después con dataset, hardware y límites explícitos. Sin esa disciplina, la optimización es teatro y puede romper privacidad o tests. Historia típica: un PR mergea un shaving del 2% en un loop interno y, en n=1e5 pares, el wall se duplica porque nadie midió el fixture completo.",
        "Contrato del gate de escala. Entrada: fixture sintético `CASO-LIM-037`, métricas wall/CPU (y nota de memoria), conteo de pares candidatos y budgets acordados. Salida: reporte de escala con speedup y reducción de pares, más tests de regresión de performance. Error: cambiar el resultado semántico, omitir warmup o microoptimizar 2% sin medición bloquea el gate.",
        "Caso Red Andina (ficticio): matching y features sobre registros sintéticos de Lima/Cusco. Esta sección escala el path de triage (matching y features), no un laboratorio de SQL en la nube. Orden: T1 Medición → T2 Algos/blocking → T3 Memoria → T4 Budgets y costo total. Usamos **stdlib** (`time`, `statistics`, `collections`) para medir sin dependencias nuevas.",
        "Puente S14→S30→S37: en NumPy/vectorización (S14) mediste work denso; en entity resolution (S30) mediste **recall de blocking**. Aquí unes ambas líneas: mides **costo** (pares y wall) sin abandonar same_result. Un blocking más agresivo que baje recall no es victoria de escala. Puente S37→S38: los budgets y el reporte before/after de esta sección son la base cuando el path corra con colas, reintentos y variabilidad de proveedor.",
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
        "Wall time es el reloj de pared que percibe el usuario o el batch (`time.perf_counter`); CPU time es el tiempo de procesador (`time.process_time`). Cuando wall >> CPU, el job espera I/O o el SO; cuando ambos crecen, el path es compute-bound. La memoria pico limita si el job cabe en el worker: en stdlib, `tracemalloc` (ver recursos) muestrea alocaciones; en el lab reportamos un bound o un proxy (tamaño de estructuras) junto a n.",
        "Mecanismo: envuelve el path caliente, anota n del fixture, verifica el resultado funcional en el mismo run y solo entonces publicas ms. Un número sin n no sirve para decidir. El profile apunta al matching/grafo o features que dominan el batch sintético — no a un tramo frío del import.",
        "Aplicación a `CASO-LIM-037-T1A`: sumamos un rango sintético como proxy de trabajo, medimos wall y CPU, y confirmamos result True. En el path real del triage se sustituye por el scorer; la disciplina de medir wall+CPU+n se mantiene. Sin PII ni datasets productivos en el laboratorio del curso.",
      ],
      code: {
        language: 'python',
        title: "wall_cpu.py",
        code: `import time

def profile_wall_cpu(n: int):
    t0 = time.perf_counter()
    s = sum(range(n))
    wall = time.perf_counter() - t0
    t1 = time.process_time()
    sum(range(n))
    cpu = time.process_time() - t1
    # proxy de bound de memoria (int64 ≈ 8 B); en prod usa tracemalloc (recursos)
    mem_proxy_bytes = n * 8
    return round(wall * 1000, 3), round(cpu * 1000, 3), s > 0, n, mem_proxy_bytes

wall_ms, cpu_ms, ok, n, mem_proxy = profile_wall_cpu(100_000)
# ms exactos varían por máquina; el contrato didáctico es n + result + ms >= 0
print("wall_ms_ok", wall_ms >= 0)
print("cpu_ms_ok", cpu_ms >= 0)
print("result", ok)
print("n", n)
print("mem_proxy_ok", mem_proxy > 0)`,
        output: `wall_ms_ok True
cpu_ms_ok True
result True
n 100000
mem_proxy_ok True`,
      },
      callout: {
        type: "tip",
        title: "perf_counter, process_time y memoria",
        content:
          "perf_counter: reloj monotónico de alta resolución (wall). process_time: CPU del proceso. Siempre reporta n junto al ms. El mem_proxy (n×bytes) es un bound didáctico; para picos reales usa tracemalloc (ver recursos).",
      },
    },
    {
      heading: "Benchmark: fixture, warmup y variabilidad",
      subtopicId: "S37-T1-B",
      paragraphs: [
        "La primera corrida miente: caches de CPU, import y JIT de librerías distorsionan el cold start. El warmup descarta esa corrida. Luego se reporta mediana (robusta frente a un outlier) y, con más muestras, un proxy de cola (p. ej. max en N chico, o p95 con N grande). El fixture fija dataset sintético y una nota de hardware del laboratorio.",
        "Mecanismo: work(); luego N runs post-warmup; mediana en ms; anota n_runs y, si hace falta, rango o IQR simple como nota de variabilidad. Error: publicar un solo run sin warmup como «verdad». Si la variabilidad es alta, subes N o aíslas ruido (otras apps, thermal); no inventas un speedup con un solo shot.",
        "Aplicación a `CASO-LIM-037-T1B`: work = sum de cuadrados en rango 5000; warmup + 5 runs; mediana en ms. El mismo fixture viaja a CI light más adelante. Datos inventados; reproducible en la laptop del estudiante sin credenciales externas.",
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
          "La 1ª corrida miente. Publicar cold start como performance del algoritmo engaña al equipo y al PR.",
      },
    },
    {
      heading: "Complejidad y blocking",
      subtopicId: "S37-T2-A",
      paragraphs: [
        "Comparar todos los pares es O(n²) y mata el entity resolution y el grafo cuando n crece. El blocking particiona por clave (ciudad, prefijo, ventana) y solo genera candidatos dentro del bloque. La métrica de costo número uno es el conteo de pares antes y después del blocking.",
        "Mecanismo: all_pairs = n*(n-1)//2; con B bloques de tamaño ~n/B, blocked_pairs ≈ B * size*(size-1)//2; reduction = 1 − blocked/all (fracción de pares eliminados, en [0,1]). Error: bajar 1% el inner loop y dejar n² intacto. Criterio: la reducción de pares se mide y se reporta junto al mismo resultado de matching sobre el fixture sintético.",
        "Aplicación a `CASO-LIM-037-T2A`: n=100, 10 bloques → all_pairs=4950, blocked=450, reduction≈0.909. En S30 mediste recall de pares útiles; aquí el tradeoff es explícito: un blocking más agresivo que baje recall no es victoria de escala aunque los pares caigan. Primero cuentas costo; el recall sigue siendo gate del matching.",
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
          "La métrica de costo #1 del ER/grafo es el conteo de candidatos. Si no cuentas pares, no sabes si el blocking funciona; si no mides recall (S30), puedes «ganar» costo y perder matches verdaderos.",
      },
    },
    {
      heading: "Estructuras, vectorización y reducción de candidatos",
      subtopicId: "S37-T2-B",
      paragraphs: [
        "dict/set e índices invertidos evitan scans O(n) repetidos. La vectorización ayuda cuando hay arrays densos, pero no sustituye reducir candidatos antes de features caras. El orden correcto del path de escala es bloquear, indexar y recién después scorear con el modelo o reglas.",
        "Mecanismo: construye el inverted index una vez (ciudad → lista de entity_id); membership con set/dict es O(1) amortizado frente a list scan O(n). Error: scorear el producto cartesiano y luego «optimizar» el scorer. Criterio: los candidatos salen del bloque, no de un scan global costoso.",
        "Aplicación a `CASO-LIM-037-T2B`: filas Lima/Lima/Cusco → bloques {Lima:2, Cusco:1}. Solo comparamos dentro de Lima. Sin afirmar parentesco ni fraude a partir de la ciudad; es solo clave de blocking sintética de laboratorio.",
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
          "Construye el índice o blocking key primero; el scorer caro opera sobre candidatos ya reducidos.",
      },
    },
    {
      heading: "Dtypes, chunking y lectura columnar",
      subtopicId: "S37-T3-A",
      paragraphs: [
        "Elegir dtypes más angostos (int32 vs int64, categorías) reduce memoria: un int32 ocupa la mitad que un int64 por elemento si el dominio cabe. El chunking procesa el dataset por ventanas para no OOM. El enfoque columnar lee solo las columnas usadas (id, amount) en lugar del registro ancho que arrastra blobs innecesarios.",
        "Mecanismo: declara un bound de memoria; elige size de chunk como tradeoff entre overhead de bucle y pico de RAM; proyecta columnas antes de features. Error: cargar todo en RAM «porque en mi laptop cabe». Criterio: el job documenta chunk_sizes y col_subset medibles sobre el fixture sintético.",
        "Aplicación a `CASO-LIM-037-T3A`: range(10) en chunks de 3 → [3,3,3,1]; subset de columnas ['id','amount']. Didáctica con listas y array.array; el mismo criterio aplica a formatos columnares cuando el stack del curso ya los introdujo.",
      ],
      code: {
        language: 'python',
        title: "chunks.py",
        code: `def chunks(xs, size):
    for i in range(0, len(xs), size):
        yield xs[i:i + size]

data = list(range(10))
sizes = [len(c) for c in chunks(data, 3)]
print("chunk_sizes", sizes)
print("col_subset", ["id", "amount"])
print("ok", sizes == [3, 3, 3, 1])`,
        output: `chunk_sizes [3, 3, 3, 1]
col_subset ['id', 'amount']
ok True`,
      },
      callout: {
        type: "tip",
        title: "Chunk size",
        content:
          "Tradeoff overhead vs memoria. Demasiado pequeño: overhead; demasiado grande: OOM. Mide el pico.",
      },
    },
    {
      heading: "Caching, invalidación y out-of-core",
      subtopicId: "S37-T3-B",
      paragraphs: [
        "Cachear features o resultados de blocking acelera re-runs, pero un cache stale miente. La clave incluye versión del feature set y cutoff de datos. Out-of-core significa no asumir que todo cabe en RAM: chunk o spill a disco cuando n crece en el batch de triage.",
        "Mecanismo: put(key, value); hit si key ∈ store; al cambiar la versión del feature set (p. ej. fs-v1→fs-v2) o el cutoff, la key nueva no pega y se recomputa. Error: cache infinito sin versión de schema. Criterio: documentas invalidate_on=version_or_cutoff y ooc=chunk_if_needed de forma explícita.",
        "Aplicación a `CASO-LIM-037-T3B`: key=('fs-v1','2026-01-01') almacena n_pairs; hit True tras put. Invalidar por version_or_cutoff. Solo estructuras en memoria didácticas; sin Redis ni servicios externos en el ejercicio del estudiante.",
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
          "Invalidar es parte del diseño. Versiona features y cutoff; no reutilices scores de un schema viejo.",
      },
    },
    {
      heading: "Performance budget y tests",
      subtopicId: "S37-T4-A",
      paragraphs: [
        "Un performance budget fija límites: p95 latency < X ms, memoria < Y, pares candidatos < Z. Un test de regresión de performance falla el PR si se rompe el budget sobre el mismo fixture. CI light corre un bench corto; nightly puede ser más largo y estricto.",
        "Mecanismo: pass = measured_ms ≤ budget_ms (y análogos para memoria/pares). Error: «en mi máquina pasa» sin umbral en CI. Criterio: el budget se acuerda con el dueño del servicio de triage y se versiona junto al dataset de bench sintético del repositorio.",
        "Aplicación a `CASO-LIM-037-T4A`: budget 50ms, measured 12ms → pass True. Si un cambio de scorer sube a 80ms, el test falla y se exige justificar o revertir. Sin red real; medición local del proxy de trabajo del laboratorio.",
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
          "Bench corto en PR; largo en nightly. Mismo dataset de bench; no cambies n en silencio.",
      },
    },
    {
      heading: "Costo total, claridad y no microoptimización",
      subtopicId: "S37-T4-B",
      paragraphs: [
        "El costo total incluye ingeniería humana, compute y riesgo de bugs. Una microoptimización del 2% que oscurece el código suele ser pérdida neta. El entregable de escala es el reporte antes/después con mismo resultado, dataset y límites — no un leaderboard de microbenchmarks del autor.",
        "Mecanismo: speedup = before_ms / after_ms (ratio, no resta). pair_factor = before_pairs // after_pairs dice «cuántas veces menos pares»; no lo confundas con reduction = 1 − after/before de T2-A (fracción eliminada). micro_only=False cuando el ganador fue blocking/algo. El PR explica el tradeoff en español profesional.",
        "Aplicación a `CASO-LIM-037-T4B`: before 100ms/1e6 pares → after 20ms/5e4 pares: speedup 5×, pair_factor 20× (y reduction 0.95 si lo reportas como fracción). El equipo prefiere ese cambio al rewrite opaco de un 2%. Datos sintéticos del path N3 de Red Andina ficticia.",
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
          "Mismo resultado, dataset, hardware y límites. Before/after legible para el revisor humano del PR.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de medición, blocking, memoria y budgets del path de escala del triage sobre CASO-LIM-037 (sintético).",
    steps: [
      {
        demoId: "S37-T1-A-DEMO",
        subtopicId: "S37-T1-A",
        environment: "local-python",
        description: "Demo: wall y CPU del trabajo sintético con n.",
        code: {
          language: 'python',
          title: "s37_t1_a_demo.py",
          code: `import time

def wall_cpu_ms(n: int):
    t0 = time.perf_counter()
    result = sum(range(n))
    wall = (time.perf_counter() - t0) * 1000
    t1 = time.process_time()
    sum(range(n))
    cpu = (time.process_time() - t1) * 1000
    return round(wall, 3), round(cpu, 3), result

n = 10_000
wall_ms, cpu_ms, result = wall_cpu_ms(n)
print("wall_ms_ok", wall_ms >= 0)
print("cpu_ms_ok", cpu_ms >= 0)
print("n", n)
print("ok", result >= 0)`,
          output: `wall_ms_ok True
cpu_ms_ok True
n 10000
ok True`,
        },
        why: "Deriva wall y CPU del work real con n; los ms exactos varían por máquina, por eso el demo reporta predicados estables (ms >= 0).",
      },
      {
        demoId: "S37-T1-B-DEMO",
        subtopicId: "S37-T1-B",
        environment: "local-python",
        description: "Demo: warmup real + mediana de 5 runs.",
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
print("median_ms_ok", round(med * 1000, 3) >= 0)
print("warmup", True)
print("n_runs", 5)`,
          output: `median_ms_ok True
warmup True
n_runs 5`,
        },
        why: "Higiene de bench real: una corrida de warmup, N runs, mediana — no mediana de enteros inventados.",
      },
      {
        demoId: "S37-T2-A-DEMO",
        subtopicId: "S37-T2-A",
        environment: "local-python",
        description: "Demo: all_pairs vs blocked_pairs derivados de n y bloques.",
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
        why: "Contar all_pairs vs blocked derivados del tamaño de bloque es la métrica #1 de escala ER.",
      },
      {
        demoId: "S37-T2-B-DEMO",
        subtopicId: "S37-T2-B",
        environment: "local-python",
        description: "Demo: tamaño de bloque Lima en inverted index.",
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
        why: "El índice por ciudad sintética reduce candidatos antes del scorer.",
      },
      {
        demoId: "S37-T3-A-DEMO",
        subtopicId: "S37-T3-A",
        environment: "local-python",
        description: "Demo: tamaños de chunk y subset columnar.",
        code: {
          language: 'python',
          title: "s37_t3_a_demo.py",
          code: `def chunk_sizes(n: int, size: int):
    return [size] * (n // size) + ([n % size] if n % size else [])

def project(row, cols):
    return {c: row[c] for c in cols}

sizes = chunk_sizes(10, 3)
row = {"id": 1, "amount": 10, "blob": "xx", "notes": "n/a"}
subset = project(row, ["id", "amount"])
print("chunk_sizes", sizes)
print("col_subset", list(subset.keys()))
print("ok", sizes == [3, 3, 3, 1] and "blob" not in subset)`,
          output: `chunk_sizes [3, 3, 3, 1]
col_subset ['id', 'amount']
ok True`,
        },
        why: "Chunking acota memoria; el subset columnar evita cargar blobs innecesarios.",
      },
      {
        demoId: "S37-T3-B-DEMO",
        subtopicId: "S37-T3-B",
        environment: "local-python",
        description: "Demo: put, hit e invalidación por cambio de versión.",
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
        why: "Hit/miss y versión de features son parte del diseño: el put se ve; el cambio de versión invalida.",
      },
      {
        demoId: "S37-T4-A-DEMO",
        subtopicId: "S37-T4-A",
        environment: "local-python",
        description: "Demo: budget pass measured<=budget.",
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
        why: "El test de performance compara measured contra budget acordado.",
      },
      {
        demoId: "S37-T4-B-DEMO",
        subtopicId: "S37-T4-B",
        environment: "local-python",
        description: "Demo: speedup y pair_factor con same_result.",
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
        why: "Before/after con ratio, factor de pares y same_result; micro_only False cuando ganó el algoritmo.",
      },
    ],
  },
  weDo: {
    intro: "S37 · Laboratorio de escala del triage (24 retos). E1 repara el defecto de medición o costo, E2 fija la política y E3 transfiere el criterio al reporte before/after. Fixtures CASO-LIM-037; sin PII real. Cada reto exige un predicado calculado, no solo imprimir un lema.",
    steps: [
      {
        id: "S37-T1-A-E1",
        subtopicId: "S37-T1-A",
        kind: "guided",
        instruction: "S37-T1-A-E1 · CASO-LIM-037-1A: mide wall del work sintético con time.perf_counter y reporta n=1000, metric 'wall', ok True. El starter ya mide wall pero reporta n=0 (defect: el n del fixture no viaja al reporte). Corrige el reporte de medición.",
        hint: "Todo wall_ms viaja con su n.",
        hints: ["Todo wall_ms viaja con su n.", "print('n', n) con n=1000 del fixture."],
        edgeCases: ["ms sin n", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-A-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-A-E1: sin n el wall_ms no es comparable entre PRs.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e1.py",
          code: `# CASO-LIM-037 sintético · sin PII real
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
        instruction: "S37-T1-A-E2 · Mide wall y CPU del work sintético (perf_counter + process_time) con n=5000; imprime wall_ok True, cpu_ok True, n 5000. Starter mide solo wall y reporta n 0 (defect). Contrato wall+CPU del triage sintético CASO-LIM-037.",
        hint: "Wall=reloj; CPU=process_time del proceso.",
        hints: ["Mide wall con perf_counter y CPU con process_time.", "Reporta n del fixture junto a los predicados ms>=0."],
        edgeCases: ["solo wall", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-A-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-A-E2: wall y CPU juntos evitan optimizar la métrica equivocada.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e2.py",
          code: `# CASO-LIM-037 · wall + CPU con n
# DEFECT: no mide CPU y reporta n=0
import time
n = 5000

def work(n: int) -> int:
    return sum(range(n))

t0 = time.perf_counter()
result = work(n)
wall_ms = (time.perf_counter() - t0) * 1000
# DEFECT: falta process_time
print("wall_ok", wall_ms >= 0)
print("cpu_ok", False)
print("n", 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-a-e2.py",
          code: `import time
n = 5000

def work(n: int) -> int:
    return sum(range(n))

t0 = time.perf_counter()
result = work(n)
wall_ms = (time.perf_counter() - t0) * 1000
t1 = time.process_time()
work(n)
cpu_ms = (time.process_time() - t1) * 1000
print("wall_ok", wall_ms >= 0 and result >= 0)
print("cpu_ok", cpu_ms >= 0)
print("n", n)
`,
          output: `wall_ok True
cpu_ok True
n 5000`,
        },
      },
      {
        id: "S37-T1-A-E3",
        subtopicId: "S37-T1-A",
        kind: "transfer",
        instruction: "S37-T1-A-E3 · Correctitud junto a velocidad: calcula same_result comparando before_fn y after_fn sobre el mismo input; imprime same_result, ok (igual a same_result) y n 1. Starter usa after_fn defectuosa que cambia el resultado (defect: same_result False). El gate de escala exige mismo resultado funcional en CASO-LIM-037.",
        hint: "Performance sin same_result es regresión.",
        hints: ["Compara before_fn(x) == after_fn(x).", "Corrige after_fn para preservar el resultado; ok debe reflejar same_result."],
        edgeCases: ["cambio silencioso", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-A-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-A-E3: same_result se calcula, no se declara por fe.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e3.py",
          code: `# CASO-LIM-037 · same_result es predicado medible
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
        instruction: "S37-T1-B-E1 · Mediana de [5,1,4] con statistics.median; imprime 4, n_runs 3, warmup True. Starter usa mean y warmup False (defect). Fixture de bench sintético CASO-LIM-037-1B.",
        hint: "median es robusta a un outlier de run.",
        hints: ["median es robusta a un outlier de run.", "n_runs y warmup van en el reporte."],
        edgeCases: ["un solo run", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-B-E1: mediana + warmup es higiene mínima de bench.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e1.py",
          code: `# CASO-LIM-037 · mediana de runs
import statistics
vals = [5, 1, 4]
# DEFECT: imprime la media, no la mediana; y olvida warmup
print(statistics.mean(vals))
print("n_runs", 3)
print("warmup", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-b-e1.py",
          code: `import statistics
vals = [5, 1, 4]
med = statistics.median(vals)
print(med)
print("n_runs", len(vals))
print("warmup", True)
`,
          output: `4
n_runs 3
warmup True`,
        },
      },
      {
        id: "S37-T1-B-E2",
        subtopicId: "S37-T1-B",
        kind: "independent",
        instruction: "S37-T1-B-E2 · Implementa warmup real: ejecuta work() una vez (descartada), luego 3 runs y reporta n_runs, warmup True y discard_first True. Starter no descarta el primer run y reporta warmup False (defect).",
        hint: "Descarta la primera corrida (cold start).",
        hints: ["Llama work() una vez antes del bucle de medición.", "n_runs es la cantidad de runs post-warmup."],
        edgeCases: ["cold start publicado", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-B-E2: discard_first evita mentir en el PR.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e2.py",
          code: `# CASO-LIM-037 · warmup de bench
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
        instruction: "S37-T1-B-E3 · Variabilidad en muestra chica: con runs=[1,2,9] imprime max=9 como proxy de cola, spread=max-min=8, proxy 'p95_small_n', ok True. Starter usa min y spread=0 (defect). Nombra el proxy para no confundirlo con p95 real en prod.",
        hint: "Con N tiny, max es proxy pesimista; spread = max-min es nota de variabilidad.",
        hints: ["max(xs) y max(xs)-min(xs).", "En prod usa percentil real con más muestras."],
        edgeCases: ["variabilidad alta", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-B-E3: nombra el proxy y reporta spread; no lo confundes con p95 de prod.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e3.py",
          code: `# CASO-LIM-037 · proxy de cola + spread
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
        instruction: "S37-T2-A-E1 · Pares completos para n=10: usa n*(n-1)//2 = 45 (no n*n). Imprime 45, n 10, ok True. Starter usa n*n=100 (defect). Contrato all_pairs del ER sintético CASO-LIM-037.",
        hint: "Pares no ordenados: n*(n-1)//2.",
        hints: ["Pares no ordenados: n*(n-1)//2.", "No cuentes n² ni n."],
        edgeCases: ["doble conteo", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-A-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-A-E1: la fórmula de pares es la base del costo.",
        starterCode: {
          language: 'python',
          title: "s37-t2-a-e1.py",
          code: `# CASO-LIM-037 · pares n*(n-1)/2
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
        instruction: "S37-T2-A-E2 · Reducción de pares (fracción eliminada): blocked=10, all=45 → round(1-10/45,3)=0.778. Imprime 0.778, ok True, blocking True. Starter imprime blocked/all (defect: no es reduction).",
        hint: "reduction = 1 - blocked/all (fracción en [0,1]).",
        hints: ["reduction = 1 - blocked/all.", "No confundas con pair_factor = all//blocked de T4-B."],
        edgeCases: ["blocking sin métrica", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-A-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-A-E2: sin reduction no hay evidencia de escala.",
        starterCode: {
          language: 'python',
          title: "s37-t2-a-e2.py",
          code: `# CASO-LIM-037 · reducción por blocking
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
        instruction: "S37-T2-A-E3 · Prioriza algoritmo: con all_pairs=4950, blocked=450 y micro_pairs=4900 (shaving 1%), elige prefer 'blocking' si blocked < micro_pairs. Imprime prefer, ok True, micro False. Starter prefiere 'microopt' y micro True (defect).",
        hint: "Bajar pares O(n²) domina micro-optimizar.",
        hints: ["Compara blocked vs micro_pairs numéricamente.", "prefer = 'blocking' si blocked es menor."],
        edgeCases: ["teatro de 1%", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-A-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-A-E3: blocking primero se decide con números, no con lemas.",
        starterCode: {
          language: 'python',
          title: "s37-t2-a-e3.py",
          code: `# CASO-LIM-037 · preferir blocking a microopt
# DEFECT: prefiere microoptimización sin comparar pares
all_pairs, blocked, micro_pairs = 4950, 450, 4900
prefer = "microopt"  # DEFECT
micro = True
print("prefer", prefer)
print("ok", True)
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
print("ok", blocked < all_pairs)
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
        instruction: "S37-T2-B-E1 · Membership: con ids=[1,2,3,4,5] y target=4, construye un set, consulta membership y reporta structure 'set', found True, scan False. Starter consulta la lista y reporta structure 'list_scan' con scan True (defect de diseño).",
        hint: "set/dict evitan scan lineal repetido.",
        hints: ["Construye set(ids) y consulta target in s.", "structure debe ser 'set' y scan False."],
        edgeCases: ["O(n) en loop caliente", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-B-E1: la estructura correcta es optimización de verdad.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e1.py",
          code: `# CASO-LIM-037 · estructura de índice
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
        instruction: "S37-T2-B-E2 · Inverted index: filas Lima×2 → imprime 2, city 'Lima', ok True. Starter deja count=0 sin filtrar por ciudad Lima (defect). Fixture de ciudades sintéticas sin PII real ni parentesco inferido.",
        hint: "Cuenta entidades por clave de blocking.",
        hints: ["Cuenta entidades por clave de blocking.", "Cusco no entra en el bloque Lima."],
        edgeCases: ["bloque vacío", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-B-E2: el tamaño del bloque predice pares locales.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e2.py",
          code: `# CASO-LIM-037 · count Lima rows
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
        instruction: "S37-T2-B-E3 · Orden operativo: con n=10, all_pairs=n*(n-1)//2 y blocked con 5 bloques, el pipeline correcto es block→score. Imprime order ['block','score'], pairs_after_block (blocked), ok True. Starter usa order score→block y pairs_after_block=all_pairs (defect).",
        hint: "Primero reduces candidatos; luego features.",
        hints: ["Calcula blocked_pairs con bloques iguales.", "order debe ser ['block','score']."],
        edgeCases: ["features O(n²)", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-B-E3: el orden block→score se demuestra con el conteo de pares.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e3.py",
          code: `# CASO-LIM-037 · orden block → score
# DEFECT: invierte el orden y no reduce pares
n, blocks = 10, 5
all_pairs = n * (n - 1) // 2
size = n // blocks
blocked = blocks * size * (size - 1) // 2
order = ["score", "block"]  # DEFECT
pairs_after = all_pairs     # DEFECT: scorea el cartesiano
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
        instruction: "S37-T3-A-E1 · Chunks: 10 items size 4 → ceil = 3 chunks. Imprime 3, size 4, ok True. Starter usa n//size=2 (defect). Planifica el job out-of-core del fixture sintético.",
        hint: "Ceil: (n+size-1)//size.",
        hints: ["Ceil: (n+size-1)//size.", "Último chunk puede ser más corto."],
        edgeCases: ["OOM sin chunks", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-A-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-A-E1: contar chunks planifica el job out-of-core.",
        starterCode: {
          language: 'python',
          title: "s37-t3-a-e1.py",
          code: `# CASO-LIM-037 · número de chunks
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
        instruction: "S37-T3-A-E2 · Columnar subset: del row con id/amt/blob/notes, proyecta solo ['id','amt']; imprime las claves, ok True, columnar True. Starter imprime todas las columnas y columnar False (defect).",
        hint: "Lee solo columnas usadas por el scorer.",
        hints: ["Proyecta con un dict comprehension.", "blob y notes no deben quedar en el subset."],
        edgeCases: ["tabla ancha", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-A-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-A-E2: columnar es reducción de I/O, no solo de RAM.",
        starterCode: {
          language: 'python',
          title: "s37-t3-a-e2.py",
          code: `# CASO-LIM-037 · subset columnar
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
        instruction: "S37-T3-A-E3 · dtype angosto: con array.array, compara itemsize de 'i' (int32) vs 'q' (int64). Si itemsize_i < itemsize_q, imprime dtype 'int32', mem 'lower', ok True. Starter fuerza int64 y mem higher (defect).",
        hint: "Si el rango cabe en int32, ahorras memoria.",
        hints: ["import array; array.array('i').itemsize vs 'q'.", "Elige int32 cuando itemsize_i es menor."],
        edgeCases: ["overflow si no cabe", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-A-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-A-E3: dtype es decisión de presupuesto de RAM medida en bytes.",
        starterCode: {
          language: 'python',
          title: "s37-t3-a-e3.py",
          code: `# CASO-LIM-037 · dtype angosto
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
        instruction: "S37-T3-B-E1 · Cache key completa: imprime ('fs-v1','cut'), hit True, ok True. Starter key incompleta solo ('fs-v1',) (defect: colisiones). Fixture de features sintéticas versionadas.",
        hint: "Key = versión de features + cutoff.",
        hints: ["Key = versión de features + cutoff.", "Sin cutoff reutilizas scores viejos."],
        edgeCases: ["cache stale", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-B-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-B-E1: la key completa es la invalidación.",
        starterCode: {
          language: 'python',
          title: "s37-t3-b-e1.py",
          code: `# CASO-LIM-037 · cache key con cutoff
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
        instruction: "S37-T3-B-E2 · Invalidación por versión: con store pre-cargado en fs-v1, al pedir fs-v2 imprime reason 'version_change', hit False, stale True. Starter imprime 'keep_forever' y stale False (defect).",
        hint: "Al cambiar feature set, la key nueva no pega.",
        hints: ["hit = new_key in store.", "Si no hay hit tras cambio de versión, reason=version_change."],
        edgeCases: ["cutoff change", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-B-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-B-E2: invalidar es feature, no afterthought.",
        starterCode: {
          language: 'python',
          title: "s37-t3-b-e2.py",
          code: `# CASO-LIM-037 · invalidación por versión
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
        instruction: "S37-T3-B-E3 · Out-of-core: procesa range(10) en chunks de 4; imprime ooc 'chunk', max_chunk 4, ram 'bounded'. Starter usa ooc 'load_all' y max_chunk=len(data) (defect).",
        hint: "chunk/spill acotan RAM.",
        hints: ["max(len(c) for c in chunks) debe ser size.", "ooc='chunk' cuando no cargas load_all."],
        edgeCases: ["OOM en nightly", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-B-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-B-E3: ooc se demuestra con el tamaño máximo de chunk.",
        starterCode: {
          language: 'python',
          title: "s37-t3-b-e3.py",
          code: `# CASO-LIM-037 · out-of-core
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
        instruction: "S37-T4-A-E1 · Budget pass: measured 9 <= budget 10 → True. Imprime True, budget 10, measured 9. Starter compara al revés (defect). Assert del PR de performance sintético.",
        hint: "pass si measured <= budget.",
        hints: ["pass si measured <= budget.", "Publica ambos números en el test."],
        edgeCases: ["flaky sin warmup", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-A-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-A-E1: el signo del budget es el assert del PR.",
        starterCode: {
          language: 'python',
          title: "s37-t4-a-e1.py",
          code: `# CASO-LIM-037 · budget pass (bajo umbral)
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
        instruction: "S37-T4-A-E2 · Budget fail: measured 12 > budget 10 → False. Imprime False, budget 10, measured 12. Starter fuerza True (defect: test siempre verde). El budget debe poder fallar.",
        hint: "El test debe poder fallar.",
        hints: ["El test debe poder fallar.", "False aquí es salud del sistema."],
        edgeCases: ["assert True hardcode", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-A-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-A-E2: un budget que no puede fallar no es budget.",
        starterCode: {
          language: 'python',
          title: "s37-t4-a-e2.py",
          code: `# CASO-LIM-037 · budget fail (sobre umbral)
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
        instruction: "S37-T4-A-E3 · Budget multi-métrica: con límites {latency_p95:50, memory:512, pairs:10000} y medidos {12, 400, 8000}, imprime keys ['latency_p95','memory','pairs'], all_pass True, n 3. Starter solo budgetea latency y fuerza all_pass True (defect).",
        hint: "Latencia sola no basta: cada dimensión debe cumplir measured <= budget.",
        hints: ["Incluye las tres claves en el dict de límites.", "all_pass = all(measured[k] <= budget[k] for k in keys)."],
        edgeCases: ["solo p95", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-A-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-A-E3: budget multi-métrica evita tradeoffs ocultos (bajar p95 inflando pares).",
        starterCode: {
          language: 'python',
          title: "s37-t4-a-e3.py",
          code: `# CASO-LIM-037 · dimensiones del budget
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
        instruction: "S37-T4-B-E1 · Speedup 80/20 = 4.0 (ratio before/after, no el inverso). Imprime 4.0, ok True, micro_only False. Starter imprime after/before y marca micro_only True (defect). Fixture before/after sintético del path N3.",
        hint: "speedup = before_ms / after_ms.",
        hints: ["speedup = before_ms / after_ms.", "micro_only False si ganó el algo."],
        edgeCases: ["división por cero", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-B-E1: speedup es ratio, no diferencia ni inverso.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e1.py",
          code: `# CASO-LIM-037 · speedup before/after
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
        instruction: "S37-T4-B-E2 · Claridad sobre shaving 2%: con algo_gain=0.80 y micro_gain=0.02, prefiere 'clarity' si micro_gain < 0.05 y algo_gain > micro_gain; imprime prefer, ok True, shave '2pct_no'. Starter prefer 'micro_shave' y shave '2pct_yes' (defect).",
        hint: "Costo total incluye bugs y review.",
        hints: ["Compara algo_gain vs micro_gain.", "2% opaco suele ser pérdida neta."],
        edgeCases: ["heroics sin medición", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-B-E2: claridad es performance de equipo medida con gains.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e2.py",
          code: `# CASO-LIM-037 · claridad > shave 2%
# DEFECT: prefiere micro-shave
algo_gain, micro_gain = 0.80, 0.02
prefer = "micro_shave"  # DEFECT
shave = "2pct_yes"
print("prefer", prefer)
print("ok", True)
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
print("ok", algo_gain > micro_gain)
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
        instruction: "S37-T4-B-E3 · Claves del reporte before/after: construye un dict con before, after, dataset y hardware; imprime ['before','after','dataset','hardware'], ok True, n 4. Starter solo ['before','after'] (defect: omite dataset y hardware).",
        hint: "Sin hardware/dataset el speedup no es comparable.",
        hints: ["Cuatro claves mínimas del reporte.", "n = len(keys)."],
        edgeCases: ["bench no reproducible", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-B-E3: el reporte es el entregable, no el feeling.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e3.py",
          code: `# CASO-LIM-037 · reporte before/after completo
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
    "dataset": "CASO-LIM-037-synth",
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
    title: "Reporte antes/después de escala del triage (CP-N3-C escala)",
    context:
      "Mide path caliente, aplica blocking/estructuras, budget test y reporte. Solo datos sintéticos; mismo resultado funcional.",
    objectives: [
      "Profile wall (y CPU si aplica) con n y same_result",
      "Blocking reduction medible (pares before/after)",
      "Cache/chunks con invalidación o bound de memoria",
      "Budget que puede fallar + reporte before/after con dataset y hardware",
    ],
    requirements: [
      "Mismo resultado funcional",
      "Dataset/hardware anotados",
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
    size = n // blocks
    return blocks * size * (size - 1) // 2

def same_result(before_val, after_val) -> bool:
    return before_val == after_val

if __name__ == "__main__":
    n = 200
    # Proxies de trabajo: before ~ más trabajo; after ~ path reducido
    before_ms = bench(lambda: sum(range(n * n // 4))) * 1000
    after_ms = bench(lambda: sum(range(n))) * 1000
    before = {"ms": before_ms, "pairs": all_pairs(n), "result": all_pairs(n)}
    after = {
        "ms": after_ms,
        "pairs": blocked_pairs(n, 10),
        "result": all_pairs(n),  # same_result: misma semántica de conteo de referencia
    }
    budget_ms = 50.0
    # Completa el entregable del gate de escala:
    # 1) assert same_result(before["result"], after["result"])
    # 2) budget_pass = after["ms"] <= budget_ms
    # 3) report con before_ms, after_ms, pairs_before/after, dataset, hardware,
    #    budget_ms, budget_pass, same_result — y publícalo
    print("before", {k: (round(v, 3) if k == "ms" else v) for k, v in before.items()})
    print("after", {k: (round(v, 3) if k == "ms" else v) for k, v in after.items()})
    # print("report_keys", ...)  # arma el dict report y publícalo
`,
    portfolioNote:
      "Escala CP-N3-C: adjunta evidencia before/after reproducible (dataset, hardware, límites).",
    rubric: [
      { criterion: "Alineación al gate de escala de la sección (same_result + before/after + budget)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Before/after con mismo resultado", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Warmup sirve para:",
        options: [
          "Estabilizar benches descartando cold start",
          "Reemplazar la mediana por un solo run frío",
          "Eliminar la necesidad de reportar n",
          "Sustituir same_result en el gate de escala",
        ],
        correctIndex: 0,
        explanation: "La primera corrida incluye cold start; warmup la descarta para reportar el estado estacionario del algoritmo.",
      },
      {
        question: "Blocking reduce:",
        options: [
          "La necesidad de medir recall de pares útiles",
          "Solo el tamaño del log de auditoría",
          "Pares candidatos O(n²) (con tradeoff de recall)",
          "La obligación de anotar hardware en el reporte",
        ],
        correctIndex: 2,
        explanation: "Particionar por clave reduce el número de pares que entran al scorer caro; el recall sigue siendo gate (S30).",
      },
      {
        question: "Performance budget en CI:",
        options: [
          "Es opcional si el PR «se siente» más rápido",
          "Solo se mide en prod un año después",
          "Reemplaza tests funcionales de matching",
          "Falla si se rompe el límite acordado sobre el fixture",
        ],
        correctIndex: 3,
        explanation: "El test de regresión de performance debe poder poner rojo el PR cuando se viola el budget.",
      },
      {
        question: "Microoptimizar 2% sin medición:",
        options: [
          "Best practice si el código queda más opaco",
          "Teatro; prioriza claridad y cambios algorítmicos medidos",
          "Obligatorio antes de todo blocking",
          "Invalida la mediana del bench",
        ],
        correctIndex: 1,
        explanation: "El costo total incluye bugs y review; sin medición el 2% es ruido y a menudo pérdida neta.",
      },
      {
        question: "Un wall_ms sin n en el reporte:",
        options: [
          "No es comparable entre cambios de dataset",
          "Es suficiente para el gate de escala",
          "Reemplaza same_result",
          "Hace innecesario el warmup",
        ],
        correctIndex: 0,
        explanation: "Sin el tamaño del input no puedes comparar benches ni validar que el fixture no cambió en silencio.",
      },
    ],
  },
  resources: {
    docs: [
      { label: "Python time.perf_counter", url: "https://docs.python.org/3/library/time.html#time.perf_counter", note: "Wall clock monotónico" },
      { label: "Python time.process_time", url: "https://docs.python.org/3/library/time.html#time.process_time", note: "CPU del proceso" },
      { label: "Python timeit", url: "https://docs.python.org/3/library/timeit.html", note: "Microbenchmarks" },
      { label: "Python profilers (cProfile)", url: "https://docs.python.org/3/library/profile.html", note: "Hot path" },
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
