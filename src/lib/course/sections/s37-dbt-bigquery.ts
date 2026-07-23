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
    "Escala el triage midiendo **antes/después** con el mismo dataset sintético. En data eng y ML ops de la región, un speedup sin same_result o sin budget en CI es regresión disfrazada. Id `dbt-bigquery` conservado (legacy). Optimizar no justifica saltarse privacidad ni tests. Caso CASO-LIM-037.",
  learningOutcomes: [
    { text: "Profilear wall/CPU y memoria con n explícito" },
    { text: "Benchmarkear con warmup, mediana y nota de variabilidad" },
    { text: "Analizar complejidad O(n²) y medir reducción por blocking" },
    { text: "Reducir candidatos con estructuras e índices invertidos" },
    { text: "Aplicar dtypes, chunks y lectura columnar mínima" },
    { text: "Diseñar cache con invalidación y estrategia out-of-core" },
    { text: "Fijar performance budgets y tests de regresión en CI light" },
    { text: "Priorizar costo total y claridad sobre microoptimización del 2%" },
  ],
  theory: [
    {
      heading: "Rendimiento del triage (CP-N3-C escala)",
      paragraphs: [
        "Escalar el triage no es «hacer el código más clever»: es medir el path caliente, preservar el mismo resultado funcional y publicar un reporte antes/después con dataset, hardware y límites explícitos. Sin esa disciplina, la optimización es teatro y puede romper privacidad o tests.",
        "Contrato operativo de la sección. Entrada: fixture sintético `CASO-LIM-037`, métricas wall/CPU/memoria, conteo de pares candidatos y budgets acordados. Salida: reporte de escala con speedup y reducción de pares, más tests de regresión de performance. Error: cambiar el resultado semántico, omitir warmup o microoptimizar 2% sin medición bloquea el gate de escala.",
        "Caso Red Andina (ficticio): matching y features sobre registros sintéticos de Lima/Cusco. El id de plataforma `dbt-bigquery` se conserva por legacy; el path V3 es profiling y algoritmos del triage N3, no un lab de SQL cloud. Orden: T1 Medición → T2 Algos/blocking → T3 Memoria → T4 Budgets y costo total.",
      ],
      callout: {
        type: "info",
        title: "Gate de escala",
        content:
          "Mismo resultado funcional + reporte antes/después con dataset/hardware/límites. Optimización reversible y justificada; no salta privacidad ni tests.",
      },
    },
    {
      heading: "wall/CPU y memory profiling",
      subtopicId: "S37-T1-A",
      paragraphs: [
        "Wall time es el reloj de pared que percibe el usuario o el batch; CPU time es el tiempo de procesador; la memoria pico limita si el job cabe en el worker. Para benches didácticos usamos `time.perf_counter` en wall. Un número sin el tamaño n del input no sirve para decidir.",
        "Contrato operativo. Entrada: función del path caliente y n del fixture. Salida: wall_ms, result de correctitud y n. Error: reportar solo ms sin n, o optimizar un tramo frío. Criterio: el profile apunta al matching/grafo o features que dominan el batch sintético, y el resultado funcional se verifica en el mismo run.",
        "Aplicación a `CASO-LIM-037-T1A`: sumamos un rango sintético como proxy de trabajo, anotamos wall_ms y confirmamos result True. En el path real del triage se sustituye por el scorer; la disciplina de medir wall+n se mantiene. Sin PII ni datasets productivos en el laboratorio del curso.",
      ],
      code: {
        language: 'python',
        title: "wall.py",
        code: `import time
t0 = time.perf_counter()
s = sum(range(100000))
wall = time.perf_counter() - t0
print("wall_ms", round(wall * 1000, 3))
print("result", s > 0)
print("n", 100000)`,
        output: `wall_ms 1.505
result True
n 100000`,
      },
      callout: {
        type: "tip",
        title: "perf_counter",
        content:
          "Mejor que time.time para benches: reloj monotónico de alta resolución. Siempre reporta n junto al ms.",
      },
    },
    {
      heading: "benchmark fixture, warmup y variabilidad",
      subtopicId: "S37-T1-B",
      paragraphs: [
        "La primera corrida miente: caches de CPU, import y JIT de librerías distorsionan el cold start. El warmup descarta esa corrida. Luego se reporta mediana (robusta) y, con más muestras, un proxy de p95. El fixture fija dataset sintético y una nota de hardware del laboratorio.",
        "Contrato operativo. Entrada: función work, N runs post-warmup. Salida: median_ms, n_runs, warmup=True. Error: publicar un solo run sin warmup como «verdad». Criterio: si la variabilidad es alta, subes N o aíslas ruido (otras apps, thermal); no inventas un speedup con un solo shot de medición.",
        "Aplicación a `CASO-LIM-037-T1B`: work = sum de cuadrados en rango 5000; warmup + 5 runs; mediana en ms. El mismo fixture viaja a CI light más adelante. Datos inventados; reproducible en la laptop del estudiante sin credenciales externas.",
      ],
      code: {
        language: 'python',
        title: "bench.py",
        code: `import time, statistics
def work():
    return sum(i*i for i in range(5000))
work()  # warmup
times = []
for _ in range(5):
    t0 = time.perf_counter(); work(); times.append(time.perf_counter()-t0)
print("median_ms", round(statistics.median(times)*1000, 3))
print("n_runs", 5)
print("warmup", True)`,
        output: `median_ms 0.323
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
      heading: "complejidad y blocking",
      subtopicId: "S37-T2-A",
      paragraphs: [
        "Comparar todos los pares es O(n²) y mata el entity resolution y el grafo cuando n crece. El blocking particiona por clave (ciudad, prefijo, ventana) y solo genera candidatos dentro del bloque. La métrica de costo número uno es el conteo de pares antes y después del blocking.",
        "Contrato operativo. Entrada: n y número de bloques (didáctico: bloques iguales). Salida: all_pairs, blocked_pairs, reduction. Error: bajar 1% el inner loop y dejar n² intacto. Criterio: la reducción de pares se mide y se reporta junto al mismo resultado de matching sobre el fixture sintético del triage.",
        "Aplicación a `CASO-LIM-037-T2A`: n=100, 10 bloques → all_pairs=4950, blocked=450, reduction≈0.909. En producción las claves de blocking se validan por recall de pares útiles; aquí aprendemos a contar y a priorizar el algoritmo sobre micro-trucos de un porcentaje.",
      ],
      code: {
        language: 'python',
        title: "blocking_cost.py",
        code: `n = 100
pairs_all = n * (n - 1) // 2
blocks = 10
pairs_b = blocks * (n // blocks) * (n // blocks - 1) // 2
print("all_pairs", pairs_all)
print("blocked_pairs", pairs_b)
print("reduction", round(1 - pairs_b / pairs_all, 3))`,
        output: `all_pairs 4950
blocked_pairs 450
reduction 0.909`,
      },
      callout: {
        type: "tip",
        title: "Cuenta pares",
        content:
          "La métrica de costo #1 del ER/grafo. Si no cuentas candidatos, no sabes si el blocking funciona.",
      },
    },
    {
      heading: "estructuras, vectorización y reducción de candidatos",
      subtopicId: "S37-T2-B",
      paragraphs: [
        "dict/set e índices invertidos evitan scans O(n) repetidos. La vectorización ayuda cuando hay arrays densos, pero no sustituye reducir candidatos antes de features caras. El orden correcto del path de escala es bloquear, indexar y recién después scorear con el modelo o reglas.",
        "Contrato operativo. Entrada: filas (ciudad, entity_id) sintéticas. Salida: tamaños por bloque del inverted index y flag structure. Error: scorear el producto cartesiano y luego «optimizar» el scorer. Criterio: el índice se construye una vez y los candidatos salen del bloque, no de un scan global costoso.",
        "Aplicación a `CASO-LIM-037-T2B`: filas Lima/Lima/Cusco → bloques {Lima:2, Cusco:1}. Solo comparamos dentro de Lima. Sin afirmar parentesco ni fraude a partir de la ciudad; es solo clave de blocking sintética de laboratorio.",
      ],
      code: {
        language: 'python',
        title: "inv_index.py",
        code: `from collections import defaultdict
rows = [("Lima", "e1"), ("Lima", "e2"), ("Cusco", "e3")]
inv = defaultdict(list)
for city, e in rows:
    inv[city].append(e)
print("blocks", {k: len(v) for k, v in inv.items()})
print("structure", "inverted_index")
print("ok", True)`,
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
      heading: "dtypes, chunking y columnar",
      subtopicId: "S37-T3-A",
      paragraphs: [
        "Elegir dtypes más angostos (int32 vs int64, categorías) reduce memoria. El chunking procesa el dataset por ventanas para no OOM. El enfoque columnar lee solo las columnas usadas (id, amount) en lugar del registro ancho completo que arrastra blobs innecesarios.",
        "Contrato operativo. Entrada: lista o tabla sintética y size de chunk. Salida: chunk_sizes y col_subset. Error: cargar todo en RAM «porque en mi laptop cabe». Criterio: el job declara un bound de memoria y el tamaño de chunk es un tradeoff medido entre overhead de bucle y pico de RAM.",
        "Aplicación a `CASO-LIM-037-T3A`: range(10) en chunks de 3 → [3,3,3,1]; subset de columnas ['id','amount']. Didáctica pura con listas; el mismo criterio aplica a formatos columnares cuando el stack del curso lo permita en secciones previas.",
      ],
      code: {
        language: 'python',
        title: "chunks.py",
        code: `def chunks(xs, size):
    for i in range(0, len(xs), size):
        yield xs[i:i+size]
data = list(range(10))
sizes = [len(c) for c in chunks(data, 3)]
print("chunk_sizes", sizes)
print("col_subset", ["id", "amount"])
print("ok", True)`,
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
      heading: "caching, invalidación y out-of-core",
      subtopicId: "S37-T3-B",
      paragraphs: [
        "Cachear features o resultados de blocking acelera re-runs, pero un cache stale miente. La clave incluye versión del feature set y cutoff de datos. Out-of-core significa no asumir que todo cabe en RAM: chunk o spill a disco cuando n crece en el batch de triage.",
        "Contrato operativo. Entrada: key (feature_set_version, cutoff). Salida: hit booleano y política de invalidación. Error: cache infinito sin versión de schema. Criterio: al cambiar fs-v3→fs-v4 o el cutoff, el hit cae y se recomputa; el diseño documenta ooc=chunk_if_needed de forma explícita.",
        "Aplicación a `CASO-LIM-037-T3B`: key=('fs-v3','2026-01-01') almacena n_pairs; hit True. Invalidar por version_or_cutoff. Solo estructuras en memoria didácticas; sin Redis ni servicios externos en el ejercicio del estudiante.",
      ],
      code: {
        language: 'python',
        title: "cache.py",
        code: `cache = {}
key = ("fs-v3", "2026-01-01")
cache[key] = {"n_pairs": 1000}
print("hit", key in cache)
print("invalidate_on", "version_or_cutoff")
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
      heading: "performance budget y tests",
      subtopicId: "S37-T4-A",
      paragraphs: [
        "Un performance budget fija límites: p95 latency < X ms, memoria < Y, pares candidatos < Z. Un test de regresión de performance falla el PR si se rompe el budget sobre el mismo fixture. CI light corre un bench corto; nightly puede ser más largo y estricto.",
        "Contrato operativo. Entrada: budget_ms y measured_ms del fixture. Salida: pass booleano y ambos números. Error: «en mi máquina pasa» sin umbral en CI. Criterio: el budget se acuerda con el dueño del servicio de triage y se versiona junto al dataset de bench sintético del repositorio.",
        "Aplicación a `CASO-LIM-037-T4A`: budget 50ms, measured 12ms → pass True. Si un cambio de scorer sube a 80ms, el test falla y se exige justificar o revertir. Sin red real; medición local del proxy de trabajo del laboratorio.",
      ],
      code: {
        language: 'python',
        title: "budget.py",
        code: `budget_ms = 50
measured_ms = 12
print("pass", measured_ms <= budget_ms)
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
      heading: "costo total, claridad y no microoptimización",
      subtopicId: "S37-T4-B",
      paragraphs: [
        "El costo total incluye ingeniería humana, compute y riesgo de bugs. Una microoptimización del 2% que oscurece el código suele ser pérdida neta. El entregable de escala es el reporte antes/después con mismo resultado, dataset y límites — no un leaderboard de microbenchmarks vanidosos del autor.",
        "Contrato operativo. Entrada: métricas before/after (ms, pairs). Salida: speedup y pair_reduction; micro_only=False cuando el ganador fue blocking/algo. Error: shaving 2% sin medición ni reporte. Criterio: claridad y reducción algorítmica ganan a trucos opacos; el PR explica el tradeoff en español profesional (es-PE).",
        "Aplicación a `CASO-LIM-037-T4B`: before 100ms/1e6 pares → after 20ms/5e4 pares: speedup 5×, pair_reduction 20×. El equipo prefiere ese cambio al rewrite en C de un 2%. Datos sintéticos del path N3 de Red Andina ficticia.",
      ],
      code: {
        language: 'python',
        title: "before_after.py",
        code: `before = {"ms": 100, "pairs": 1_000_000}
after = {"ms": 20, "pairs": 50_000}
print("speedup", before["ms"] / after["ms"])
print("pair_reduction", before["pairs"] // after["pairs"])
print("micro_only", False)`,
        output: `speedup 5.0
pair_reduction 20
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
        description: "Demo: anotar wall del trabajo sintético con n.",
        code: {
          language: 'python',
          title: "s37_t1_a_demo.py",
          code: `import time
t0=time.perf_counter(); sum(range(10000)); print(round((time.perf_counter()-t0)*1000,3))
print('n', 10000)
print('ok', True)`,
          output: `0.156
n 10000
ok True`,
        },
        why: "Muestra wall_ms + n; el ms exacto puede variar — el demo fija un output de referencia didáctico.",
      },
      {
        demoId: "S37-T1-B-DEMO",
        subtopicId: "S37-T1-B",
        environment: "local-python",
        description: "Demo: mediana y flags de warmup.",
        code: {
          language: 'python',
          title: "s37_t1_b_demo.py",
          code: `import statistics
print(statistics.median([3,1,2]))
print('warmup', True)
print('n_runs', 3)`,
          output: `2
warmup True
n_runs 3`,
        },
        why: "Higiene de bench: mediana, N y warmup visibles en el reporte.",
      },
      {
        demoId: "S37-T2-A-DEMO",
        subtopicId: "S37-T2-A",
        environment: "local-python",
        description: "Demo: pares n=4 y blocked.",
        code: {
          language: 'python',
          title: "s37_t2_a_demo.py",
          code: `n=4; print(n*(n-1)//2)
print('blocked', 2)
print('ok', True)`,
          output: `6
blocked 2
ok True`,
        },
        why: "Contar all_pairs vs blocked es la métrica #1 de escala ER.",
      },
      {
        demoId: "S37-T2-B-DEMO",
        subtopicId: "S37-T2-B",
        environment: "local-python",
        description: "Demo: tamaño de bloque Lima en inverted index.",
        code: {
          language: 'python',
          title: "s37_t2_b_demo.py",
          code: `print({'Lima':2})
print('structure', 'inverted_index')
print('ok', True)`,
          output: `{'Lima': 2}
structure inverted_index
ok True`,
        },
        why: "El índice por ciudad sintética reduce candidatos antes del scorer.",
      },
      {
        demoId: "S37-T3-A-DEMO",
        subtopicId: "S37-T3-A",
        environment: "local-python",
        description: "Demo: tamaños de chunk size=3.",
        code: {
          language: 'python',
          title: "s37_t3_a_demo.py",
          code: `print([3,3,3,1])
print('size', 3)
print('ok', True)`,
          output: `[3, 3, 3, 1]
size 3
ok True`,
        },
        why: "Chunking acota memoria; el último chunk puede ser corto.",
      },
      {
        demoId: "S37-T3-B-DEMO",
        subtopicId: "S37-T3-B",
        environment: "local-python",
        description: "Demo: cache hit por key de features.",
        code: {
          language: 'python',
          title: "s37_t3_b_demo.py",
          code: `print(True)
print('key', 'fs-v3')
print('ok', True)`,
          output: `True
key fs-v3
ok True`,
        },
        why: "Hit/miss y versión de features son parte del diseño.",
      },
      {
        demoId: "S37-T4-A-DEMO",
        subtopicId: "S37-T4-A",
        environment: "local-python",
        description: "Demo: budget pass measured<=budget.",
        code: {
          language: 'python',
          title: "s37_t4_a_demo.py",
          code: `print(True)
print('budget', 50)
print('measured', 10)`,
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
        description: "Demo: speedup 100→25 = 4.0.",
        code: {
          language: 'python',
          title: "s37_t4_b_demo.py",
          code: `print(4.0)
print('micro_only', False)
print('ok', True)`,
          output: `4.0
micro_only False
ok True`,
        },
        why: "Before/after con ratio; micro_only False cuando ganó el algoritmo.",
      },
    ],
  },
  weDo: {
    intro: "S37 · Laboratorio de escala del triage (24 retos). E1 repara el defecto de medición o costo, E2 fija la política y E3 transfiere el criterio al reporte before/after. Fixtures CASO-LIM-037; sin PII real.",
    steps: [
      {
        id: "S37-T1-A-E1",
        subtopicId: "S37-T1-A",
        kind: "guided",
        instruction: "S37-T1-A-E1 · CASO-LIM-037-1A: reporta el tamaño del fixture de profile con métrica wall. Contrato: print n 1000, metric 'wall', ok True. El starter imprime n 0 y metric 'guess' (defect). Corrige el reporte de medición sintético.",
        hint: "Todo wall_ms viaja con su n.",
        hints: ["Todo wall_ms viaja con su n.", "metric wall distingue de cpu/memory."],
        edgeCases: ["ms sin n", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-A-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-A-E1: sin n el wall_ms no es comparable entre PRs.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e1.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("n", 1000)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-a-e1.py",
          code: `print("n", 1000)
print("metric", "wall")
print("ok", True)
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
        instruction: "S37-T1-A-E2 · Lista las tres métricas base del profile: wall, cpu, memory. Imprime la lista, ok True, n 3. Starter solo ['wall'] (defect). Completa el contrato de métricas de performance del triage sintético CASO-LIM-037.",
        hint: "Wall=reloj, CPU=procesador, memory=pico.",
        hints: ["Wall=reloj, CPU=procesador, memory=pico.", "Las tres informan el bottleneck."],
        edgeCases: ["solo wall", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-A-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-A-E2: el trío evita optimizar la métrica equivocada.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e2.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
metrics = ["wall", "cpu", "memory"]
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(metrics)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-a-e2.py",
          code: `metrics = ["wall", "cpu", "memory"]
print(metrics)
print("ok", True)
print("n", len(metrics))
`,
          output: `['wall', 'cpu', 'memory']
ok True
n 3`,
        },
      },
      {
        id: "S37-T1-A-E3",
        subtopicId: "S37-T1-A",
        kind: "transfer",
        instruction: "S37-T1-A-E3 · Correctitud junto a velocidad: imprime same_result True, ok True, n 1. Starter False (defect: permite «optimizar» cambiando el resultado). El gate de escala exige mismo resultado funcional en CASO-LIM-037.",
        hint: "Performance sin same_result es regresión.",
        hints: ["Performance sin same_result es regresión.", "Verifica asserts de matching en el mismo bench."],
        edgeCases: ["cambio silencioso", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-A-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-A-E3: same_result es parte del contrato de escala.",
        starterCode: {
          language: 'python',
          title: "s37-t1-a-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("same_result", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-a-e3.py",
          code: `print("same_result", True)
print("ok", True)
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
        instruction: "S37-T1-B-E1 · Mediana de [5,1,4] con statistics.median; imprime 4, n_runs 3, warmup True. Starter usa mean (defect). Fixture de bench sintético CASO-LIM-037-1B sin red real ni PII.",
        hint: "median es robusta a un outlier de run.",
        hints: ["median es robusta a un outlier de run.", "n_runs y warmup van en el reporte."],
        edgeCases: ["un solo run", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-B-E1: mediana + warmup es higiene mínima de bench.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e1.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
import statistics
vals = [5, 1, 4]
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(statistics.median(vals))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-b-e1.py",
          code: `import statistics
vals = [5, 1, 4]
print(statistics.median(vals))
print("n_runs", 3)
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
        instruction: "S37-T1-B-E2 · Política de warmup: imprime warmup True, discard_first True, ok True. Starter niega warmup (defect). Contrato del fixture de CI light sintético del path de escala.",
        hint: "Descarta la primera corrida (cold start).",
        hints: ["Descarta la primera corrida (cold start).", "CI light también hace warmup."],
        edgeCases: ["cold start publicado", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-B-E2: discard_first evita mentir en el PR.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("warmup", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-b-e2.py",
          code: `print("warmup", True)
print("discard_first", True)
print("ok", True)
`,
          output: `warmup True
discard_first True
ok True`,
        },
      },
      {
        id: "S37-T1-B-E3",
        subtopicId: "S37-T1-B",
        kind: "transfer",
        instruction: "S37-T1-B-E3 · Proxy de p95 en muestra chica: imprime max([1,2,9])=9 como proxy, proxy 'p95_small_n', ok True. Starter imprime min (defect). Nombra el proxy para no confundirlo con p95 real en prod.",
        hint: "Con N tiny, max es proxy pesimista de lab.",
        hints: ["Con N tiny, max es proxy pesimista de lab.", "En prod usa percentil real con más muestras."],
        edgeCases: ["variabilidad alta", "sintético"],
        tests: "Salida alinea con solution output de S37-T1-B-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T1-B-E3: nombra el proxy para no confundirlo con p95 real.",
        starterCode: {
          language: 'python',
          title: "s37-t1-b-e3.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
xs = [1, 2, 9]
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(max(xs))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t1-b-e3.py",
          code: `xs = [1, 2, 9]
print(max(xs))
print("proxy", "p95_small_n")
print("ok", True)
`,
          output: `9
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
n = 10
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(n * (n - 1) // 2)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-a-e1.py",
          code: `n = 10
print(n * (n - 1) // 2)
print("n", n)
print("ok", True)
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
        instruction: "S37-T2-A-E2 · Reducción de pares: blocked=10, all=45 → round(1-10/45,3)=0.778. Imprime 0.778, ok True, blocking True. Starter imprime blocked/all (defect: no es reduction).",
        hint: "reduction = 1 - blocked/all.",
        hints: ["reduction = 1 - blocked/all.", "Reporta reduction junto a all y blocked."],
        edgeCases: ["blocking sin métrica", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-A-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-A-E2: sin reduction no hay evidencia de escala.",
        starterCode: {
          language: 'python',
          title: "s37-t2-a-e2.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
all_p, blocked = 45, 10
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(round(1 - blocked / all_p, 3))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-a-e2.py",
          code: `all_p, blocked = 45, 10
print(round(1 - blocked / all_p, 3))
print("ok", True)
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
        instruction: "S37-T2-A-E3 · Prioriza algoritmo: imprime prefer 'blocking', ok True, micro False. Starter prefiere 'micro_loop' (defect). Complejidad y blocking ganan a shaving del 1% en CASO-LIM-037.",
        hint: "Bajar pares O(n²) domina micro-optimizar.",
        hints: ["Bajar pares O(n²) domina micro-optimizar.", "micro False cuando ganó el algo."],
        edgeCases: ["teatro de 1%", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-A-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-A-E3: blocking primero, micro después y solo si se mide.",
        starterCode: {
          language: 'python',
          title: "s37-t2-a-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("prefer", "blocking")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-a-e3.py",
          code: `print("prefer", "blocking")
print("ok", True)
print("micro", False)
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
        instruction: "S37-T2-B-E1 · Estructura preferida para membership: imprime structure 'set', ok True, scan False. Starter 'list' con scan True (defect). Contrato de lookup del path de candidatos sintético.",
        hint: "set/dict evitan scan lineal repetido.",
        hints: ["set/dict evitan scan lineal repetido.", "scan False documenta la intención."],
        edgeCases: ["O(n) en loop caliente", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-B-E1: la estructura correcta es optimización de verdad.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e1.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("structure", "set")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-b-e1.py",
          code: `print("structure", "set")
print("ok", True)
print("scan", False)
`,
          output: `structure set
ok True
scan False`,
        },
      },
      {
        id: "S37-T2-B-E2",
        subtopicId: "S37-T2-B",
        kind: "independent",
        instruction: "S37-T2-B-E2 · Inverted index: filas Lima×2 → imprime 2, city 'Lima', ok True. Starter cuenta 0 (defect). Fixture de ciudades sintéticas sin PII real ni parentesco inferido.",
        hint: "Cuenta entidades por clave de blocking.",
        hints: ["Cuenta entidades por clave de blocking.", "Cusco no entra en el bloque Lima."],
        edgeCases: ["bloque vacío", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-B-E2: el tamaño del bloque predice pares locales.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e2.py",
          code: `rows = [("Lima", "e1"), ("Lima", "e2"), ("Cusco", "e3")]
count = 0  # TODO count Lima
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
print("ok", True)
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
        instruction: "S37-T2-B-E3 · Orden operativo: imprime order ['block','score'], ok True, n 2. Starter ['score','block'] (defect: scorea el cartesiano). Transferencia del pipeline de candidatos del triage.",
        hint: "Primero reduces candidatos; luego features.",
        hints: ["Primero reduces candidatos; luego features.", "Invertir el orden destruye el budget."],
        edgeCases: ["features O(n²)", "sintético"],
        tests: "Salida alinea con solution output de S37-T2-B-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T2-B-E3: el orden block→score es el diseño.",
        starterCode: {
          language: 'python',
          title: "s37-t2-b-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("order", ["block", "score"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t2-b-e3.py",
          code: `print("order", ["block", "score"])
print("ok", True)
print("n", 2)
`,
          output: `order ['block', 'score']
ok True
n 2`,
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
n, size = 10, 4
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print((n + size - 1) // size)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-a-e1.py",
          code: `n, size = 10, 4
print((n + size - 1) // size)
print("size", size)
print("ok", True)
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
        instruction: "S37-T3-A-E2 · Columnar subset: imprime ['id','amt'], ok True, columnar True. Starter incluye raw_blob y notes (defect). Contrato de lectura mínima del batch sintético CASO-LIM-037.",
        hint: "Lee solo columnas usadas por el scorer.",
        hints: ["Lee solo columnas usadas por el scorer.", "raw_blob fuera reduce I/O y riesgo."],
        edgeCases: ["tabla ancha", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-A-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-A-E2: columnar es reducción de I/O, no solo de RAM.",
        starterCode: {
          language: 'python',
          title: "s37-t3-a-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(["id", "amt"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-a-e2.py",
          code: `print(["id", "amt"])
print("ok", True)
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
        instruction: "S37-T3-A-E3 · dtype angosto: imprime dtype 'int32', ok True, mem 'lower'. Starter 'int64' y mem 'higher' (defect). Política de memoria del fixture cuando el rango del dominio cabe en 32 bits.",
        hint: "Si el rango cabe en int32, ahorras memoria.",
        hints: ["Si el rango cabe en int32, ahorras memoria.", "Documenta el bound del dominio."],
        edgeCases: ["overflow si no cabe", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-A-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-A-E3: dtype es decisión de presupuesto de RAM.",
        starterCode: {
          language: 'python',
          title: "s37-t3-a-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("dtype", "int32")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-a-e3.py",
          code: `print("dtype", "int32")
print("ok", True)
print("mem", "lower")
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
          code: `key = ("fs-v1",)  # TODO include cutoff
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
print(key)
print("hit", key in cache)
print("ok", True)
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
        instruction: "S37-T3-B-E2 · Razón de invalidación: imprime 'version_change', ok True, stale True. Starter 'never' (defect). Contrato de diseño del cache del triage sintético Red Andina.",
        hint: "Al cambiar feature set, invalida.",
        hints: ["Al cambiar feature set, invalida.", "stale True nombra el riesgo."],
        edgeCases: ["cutoff change", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-B-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-B-E2: invalidar es feature, no afterthought.",
        starterCode: {
          language: 'python',
          title: "s37-t3-b-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("version_change")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-b-e2.py",
          code: `print("version_change")
print("ok", True)
print("stale", True)
`,
          output: `version_change
ok True
stale True`,
        },
      },
      {
        id: "S37-T3-B-E3",
        subtopicId: "S37-T3-B",
        kind: "transfer",
        instruction: "S37-T3-B-E3 · Out-of-core: imprime ooc 'chunk', ok True, ram 'bounded'. Starter ooc 'load_all' (defect). Cuando n no cabe en RAM del worker sintético, chunk acota memoria.",
        hint: "chunk/spill acotan RAM.",
        hints: ["chunk/spill acotan RAM.", "load_all no escala con n."],
        edgeCases: ["OOM en nightly", "sintético"],
        tests: "Salida alinea con solution output de S37-T3-B-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T3-B-E3: ooc es parte del diseño de escala.",
        starterCode: {
          language: 'python',
          title: "s37-t3-b-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("ooc", "chunk")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t3-b-e3.py",
          code: `print("ooc", "chunk")
print("ok", True)
print("ram", "bounded")
`,
          output: `ooc chunk
ok True
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
budget, measured = 10, 9
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(measured <= budget)
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
budget, measured = 10, 12
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(measured <= budget)
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
        instruction: "S37-T4-A-E3 · Campos del budget: imprime ['latency_p95','memory','pairs'], ok True, n 3. Starter solo ['latency_p95'] (defect). Contrato multi-dimensional del gate de escala CASO-LIM-037.",
        hint: "Latencia sola no basta.",
        hints: ["Latencia sola no basta.", "Versiona los tres en CI."],
        edgeCases: ["solo p95", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-A-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-A-E3: budget multi-métrica evita tradeoffs ocultos.",
        starterCode: {
          language: 'python',
          title: "s37-t4-a-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(["latency_p95", "memory", "pairs"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-a-e3.py",
          code: `print(["latency_p95", "memory", "pairs"])
print("ok", True)
print("n", 3)
`,
          output: `['latency_p95', 'memory', 'pairs']
ok True
n 3`,
        },
      },
      {
        id: "S37-T4-B-E1",
        subtopicId: "S37-T4-B",
        kind: "guided",
        instruction: "S37-T4-B-E1 · Speedup 80/20 = 4.0 (ratio, no resta). Imprime 4.0, ok True, micro_only False. Starter 80-20=60 (defect). Fixture before/after sintético del path N3.",
        hint: "speedup = before_ms / after_ms.",
        hints: ["speedup = before_ms / after_ms.", "micro_only False si ganó el algo."],
        edgeCases: ["división por cero", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E1; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-B-E1: speedup es ratio, no diferencia.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e1.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
before, after = 80, 20
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(before / after)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-b-e1.py",
          code: `before, after = 80, 20
print(before / after)
print("ok", True)
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
        instruction: "S37-T4-B-E2 · Claridad sobre shaving 2%: imprime prefer 'clarity', ok True, shave '2pct_no'. Starter prefer 'opaque_2pct' (defect). Política de costo total del equipo sintético Red Andina.",
        hint: "Costo total incluye bugs y review.",
        hints: ["Costo total incluye bugs y review.", "2% opaco suele ser pérdida neta."],
        edgeCases: ["heroics sin medición", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E2; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-B-E2: claridad es performance de equipo.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("prefer", "clarity")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-b-e2.py",
          code: `print("prefer", "clarity")
print("ok", True)
print("shave", "2pct_no")
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
        instruction: "S37-T4-B-E3 · Claves del reporte before/after: imprime ['before','after','dataset','hardware'], ok True, n 4. Starter omite hardware (defect). Entregable del gate de escala CASO-LIM-037.",
        hint: "Sin hardware/dataset el speedup no es comparable.",
        hints: ["Sin hardware/dataset el speedup no es comparable.", "Cuatro claves mínimas del reporte."],
        edgeCases: ["bench no reproducible", "sintético"],
        tests: "Salida alinea con solution output de S37-T4-B-E3; predicado de dominio sobre fixture sintético.",
        feedback: "S37-T4-B-E3: el reporte es el entregable, no el feeling.",
        starterCode: {
          language: 'python',
          title: "s37-t4-b-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(["before", "after", "dataset", "hardware"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s37-t4-b-e3.py",
          code: `print(["before", "after", "dataset", "hardware"])
print("ok", True)
print("n", 4)
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
      "Mide path caliente, aplica blocking/estructuras, budget test y reporte. Id dbt-bigquery conservado. Solo datos sintéticos; mismo resultado funcional.",
    objectives: ["Profile wall con n", "Blocking reduction medible", "Cache/chunks con invalidación", "Budget + before/after"],
    requirements: ["Mismo resultado funcional", "Dataset/hardware anotados", "es-PE", "Budget que puede fallar en CI light"],
    starterCode: `import time
def bench(fn, n=5):
    fn(); ts=[]
    for _ in range(n):
        t0=time.perf_counter(); fn(); ts.append(time.perf_counter()-t0)
    return sorted(ts)[len(ts)//2]
if __name__=='__main__':
    print(bench(lambda: sum(range(1000))))
`,
    portfolioNote:
      "Escala CP-N3-C; evidencia before/after. No PASS automático de carrera.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
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
        options: ["Estabilizar benches descartando cold start", "Inflar métricas", "Borrar cache siempre", "Evitar tests"],
        correctIndex: 0,
        explanation: "La primera corrida incluye cold start; warmup la descarta para reportar el estado estacionario del algoritmo.",
      },
      {
        question: "Blocking reduce:",
        options: ["Solo logs", "Privacidad automáticamente", "Pares candidatos O(n²)", "Seeds"],
        correctIndex: 2,
        explanation: "Particionar por clave reduce el número de pares que entran al scorer caro.",
      },
      {
        question: "Performance budget en CI:",
        options: ["Es opcional teatro", "Solo se mide en prod un año después", "Reemplaza tests funcionales", "Falla si se rompe el límite acordado"],
        correctIndex: 3,
        explanation: "El test de regresión de performance debe poder poner rojo el PR cuando se viola el budget.",
      },
      {
        question: "Microoptimizar 2% sin medición:",
        options: ["Best practice", "Teatro; prioriza claridad y algos", "Obligatorio", "Invalida blocking"],
        correctIndex: 1,
        explanation: "El costo total incluye bugs y review; sin medición el 2% es ruido y a menudo pérdida neta.",
      },
      {
        question: "Un wall_ms sin n en el reporte:",
        options: ["No es comparable entre cambios de dataset", "Es suficiente para el gate", "Reemplaza same_result", "Invalida el warmup"],
        correctIndex: 0,
        explanation: "Sin el tamaño del input no puedes comparar benches ni validar que el fixture no cambió en silencio.",
      },
    ],
  },
  resources: {
    docs: [
      { label: "Python time.perf_counter", url: "https://docs.python.org/3/library/time.html", note: "Wall clock" },
      { label: "Python profilers", url: "https://docs.python.org/3/library/profile.html", note: "cProfile" },
      { label: "Big-O cheat sheet", url: "https://www.bigocheatsheet.com/", note: "Complejidad" },
    ],
    books: [
      { label: "High Performance Python", note: "Profiling y memoria" },
      { label: "Algorithms (Sedgewick) / CLRS", note: "Complejidad y diseño" },
    ],
    courses: [
      { label: "MIT 6.006 Introduction to Algorithms (OCW)", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", note: "Asymptotics" },
      { label: "Coursera: Algorithms, Part I (Princeton)", url: "https://www.coursera.org/learn/algorithms-part1", note: "Big-O y costos" },
    ],
  },
}
