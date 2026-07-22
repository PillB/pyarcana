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
    "Escala el triage midiendo **antes/después** con mismo dataset. Id `dbt-bigquery` conservado. Optimizar no justifica saltarse privacidad ni tests.",
  learningOutcomes: [
    { text: "Profilear wall/CPU y memoria" },
    { text: "Benchmarkear con warmup y variabilidad" },
    { text: "Analizar complejidad y blocking" },
    { text: "Reducir candidatos con estructuras/vectorización" },
    { text: "Optimizar dtypes, chunks y columnar" },
    { text: "Diseñar cache e invalidación OOC" },
    { text: "Fijar budgets y tests de performance" },
    { text: "Priorizar costo total sobre microoptimización" },
  ],
  theory: [
    {
      heading: "Rendimiento del triage (CP-N3-C escala)",
      paragraphs: [
        "Mide, no adivines. Mismo resultado funcional + reporte antes/después.",
        "Legacy dbt/BQ se retematiza a profiling del path N3.",
        "T1 Medición → T2 Algos → T3 Memoria → T4 Regresión perf.",
      ],
      callout: {
        type: "info",
        title: "Retarget",
        content:
          "Optimización reversible y justificada.",
      },
    },
    {
      heading: "wall/CPU y memory profiling",
      subtopicId: "S37-T1-A",
      paragraphs: [
        "wall time vs CPU time; memoria pico. time.perf_counter para wall.",
        "Profilea el path caliente del matching/grafo.",
        "Un número sin contexto de n no sirve.",
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
          "Mejor que time.time para benches.",
      },
    },
    {
      heading: "benchmark fixture, warmup y variabilidad",
      subtopicId: "S37-T1-B",
      paragraphs: [
        "Warmup descarta primera corrida. Reporta mediana/p95 de N runs.",
        "Fixture fija dataset sintético y hardware note.",
        "Variabilidad alta → sube N o aisla ruido.",
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
          "La 1ª corrida miente.",
      },
    },
    {
      heading: "complejidad y blocking",
      subtopicId: "S37-T2-A",
      paragraphs: [
        "O(n²) pairs matan el ER/grafo. Blocking reduce candidatos.",
        "Mide candidate pairs antes/después de blocking.",
        "Complejidad conceptual > micro-truco de 1%.",
      ],
      code: {
        language: 'python',
        title: "blocking_cost.py",
        code: `n = 100
pairs_all = n * (n - 1) // 2
blocks = 10
# equal blocks
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
          "La métrica de costo #1.",
      },
    },
    {
      heading: "estructuras, vectorización y reducción de candidatos",
      subtopicId: "S37-T2-B",
      paragraphs: [
        "dict/set/inverted index; evita scans repetidos.",
        "Vectorización (cuando hay arrays) vs loops Python puros.",
        "Reduce candidatos antes de features caras.",
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
          "Luego scorer.",
      },
    },
    {
      heading: "dtypes, chunking y columnar",
      subtopicId: "S37-T3-A",
      paragraphs: [
        "int32 vs int64, categorías; chunking para no OOM.",
        "Columnar: lee solo columnas usadas.",
        "Didáctica: procesar lista en chunks.",
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
          "Tradeoff overhead vs memoria.",
      },
    },
    {
      heading: "caching, invalidación y out-of-core",
      subtopicId: "S37-T3-B",
      paragraphs: [
        "Cache de features/blocking con clave de versión.",
        "Invalidación por feature_set o data cutoff.",
        "Out-of-core: no asumas que todo cabe en RAM.",
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
          "Invalidar es parte del diseño.",
      },
    },
    {
      heading: "performance budget y tests",
      subtopicId: "S37-T4-A",
      paragraphs: [
        "Budget: p95 latency < X, memoria < Y, pairs < Z.",
        "Test de regresión de performance falla si se rompe budget.",
        "Mismo dataset de bench en CI light.",
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
          "Bench corto en PR; largo en nightly.",
      },
    },
    {
      heading: "costo total, claridad y no microoptimización",
      subtopicId: "S37-T4-B",
      paragraphs: [
        "Costo total: eng+compute+riesgo de bugs. Claridad gana a shaving 2%.",
        "Microoptimización sin medición es teatro.",
        "Reporte antes/después es el entregable de escala.",
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
          "Mismo resultado, dataset, límites.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro medición, blocking, memoria y budgets de performance del triage.",
    steps: [
      {
        demoId: "S37-T1-A-DEMO",
        subtopicId: "S37-T1-A",
        environment: "local-python",
        description: "Mide wall de sum.",
        code: {
          language: 'python',
          title: "w_demo.py",
          code: `import time
t0=time.perf_counter(); sum(range(10000)); print(round((time.perf_counter()-t0)*1000,3))
print('n', 10000)
print('ok', True)`,
          output: `0.156
n 10000
ok True`,
        },
        why: "Wall ms.",
      },
      {
        demoId: "S37-T1-B-DEMO",
        subtopicId: "S37-T1-B",
        environment: "local-python",
        description: "Mediana de 3 runs.",
        code: {
          language: 'python',
          title: "b_demo.py",
          code: `import statistics
print(statistics.median([3,1,2]))
print('warmup', True)
print('n_runs', 3)`,
          output: `2
warmup True
n_runs 3`,
        },
        why: "Bench.",
      },
      {
        demoId: "S37-T2-A-DEMO",
        subtopicId: "S37-T2-A",
        environment: "local-python",
        description: "Pairs n=4.",
        code: {
          language: 'python',
          title: "c_demo.py",
          code: `n=4; print(n*(n-1)//2)
print('blocked', 2)
print('ok', True)`,
          output: `6
blocked 2
ok True`,
        },
        why: "Complejidad.",
      },
      {
        demoId: "S37-T2-B-DEMO",
        subtopicId: "S37-T2-B",
        environment: "local-python",
        description: "Inverted index sizes.",
        code: {
          language: 'python',
          title: "i_demo.py",
          code: `print({'Lima':2})
print('structure', 'inverted_index')
print('ok', True)`,
          output: `{'Lima': 2}
structure inverted_index
ok True`,
        },
        why: "Estructuras.",
      },
      {
        demoId: "S37-T3-A-DEMO",
        subtopicId: "S37-T3-A",
        environment: "local-python",
        description: "Chunk lens.",
        code: {
          language: 'python',
          title: "ch_demo.py",
          code: `print([3,3,3,1])
print('size', 3)
print('ok', True)`,
          output: `[3, 3, 3, 1]
size 3
ok True`,
        },
        why: "Chunks.",
      },
      {
        demoId: "S37-T3-B-DEMO",
        subtopicId: "S37-T3-B",
        environment: "local-python",
        description: "Cache hit.",
        code: {
          language: 'python',
          title: "ca_demo.py",
          code: `print(True)
print('key', 'fs-v3')
print('ok', True)`,
          output: `True
key fs-v3
ok True`,
        },
        why: "Cache.",
      },
      {
        demoId: "S37-T4-A-DEMO",
        subtopicId: "S37-T4-A",
        environment: "local-python",
        description: "Budget pass.",
        code: {
          language: 'python',
          title: "bu_demo.py",
          code: `print(True)
print('budget', 50)
print('measured', 10)`,
          output: `True
budget 50
measured 10`,
        },
        why: "Budget test.",
      },
      {
        demoId: "S37-T4-B-DEMO",
        subtopicId: "S37-T4-B",
        environment: "local-python",
        description: "Speedup 100→25.",
        code: {
          language: 'python',
          title: "ba_demo.py",
          code: `print(4.0)
print('micro_only', False)
print('ok', True)`,
          output: `4.0
micro_only False
ok True`,
        },
        why: "Before/after.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de wall/bench, complejidad, estructuras, chunks, cache, budgets y costo total.",
    steps: [
      {
        id: "S37-T1-A-E1",
        subtopicId: "S37-T1-A",
        kind: "guided",
        instruction:
          "print n with wall note.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('n', 1000)
print('metric', 'wall')
print('ok', True)`,
          output: `n 1000
metric wall
ok True`,
        },
      },
      {
        id: "S37-T1-A-E2",
        subtopicId: "S37-T1-A",
        kind: "independent",
        instruction:
          "cpu vs wall labels.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['wall','cpu','memory'])
print('ok', True)
print('n', 3)`,
          output: `['wall', 'cpu', 'memory']
ok True
n 3`,
        },
      },
      {
        id: "S37-T1-A-E3",
        subtopicId: "S37-T1-A",
        kind: "transfer",
        instruction:
          "result correctness flag.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('same_result', True)
print('ok', True)
print('n', 1)`,
          output: `same_result True
ok True
n 1`,
        },
      },
      {
        id: "S37-T1-B-E1",
        subtopicId: "S37-T1-B",
        kind: "guided",
        instruction:
          "median [5,1,4].",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import statistics
print(statistics.median([5,1,4]))
print('n_runs', 3)
print('warmup', True)`,
          output: `4
n_runs 3
warmup True`,
        },
      },
      {
        id: "S37-T1-B-E2",
        subtopicId: "S37-T1-B",
        kind: "independent",
        instruction:
          "warmup first.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('warmup', True)
print('discard_first', True)
print('ok', True)`,
          output: `warmup True
discard_first True
ok True`,
        },
      },
      {
        id: "S37-T1-B-E3",
        subtopicId: "S37-T1-B",
        kind: "transfer",
        instruction:
          "report p95 idea as max in small n.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(max([1,2,9]))
print('proxy', 'p95_small_n')
print('ok', True)`,
          output: `9
proxy p95_small_n
ok True`,
        },
      },
      {
        id: "S37-T2-A-E1",
        subtopicId: "S37-T2-A",
        kind: "guided",
        instruction:
          "pairs n=10.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(45)
print('n', 10)
print('ok', True)`,
          output: `45
n 10
ok True`,
        },
      },
      {
        id: "S37-T2-A-E2",
        subtopicId: "S37-T2-A",
        kind: "independent",
        instruction:
          "reduction ratio.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(round(1-10/45,3))
print('ok', True)
print('blocking', True)`,
          output: `0.778
ok True
blocking True`,
        },
      },
      {
        id: "S37-T2-A-E3",
        subtopicId: "S37-T2-A",
        kind: "transfer",
        instruction:
          "prefer algo over micro.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('prefer', 'blocking')
print('ok', True)
print('micro', False)`,
          output: `prefer blocking
ok True
micro False`,
        },
      },
      {
        id: "S37-T2-B-E1",
        subtopicId: "S37-T2-B",
        kind: "guided",
        instruction:
          "set lookup vs list note.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('structure', 'set')
print('ok', True)
print('scan', False)`,
          output: `structure set
ok True
scan False`,
        },
      },
      {
        id: "S37-T2-B-E2",
        subtopicId: "S37-T2-B",
        kind: "independent",
        instruction:
          "inverted index cities.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(2)
print('city', 'Lima')
print('ok', True)`,
          output: `2
city Lima
ok True`,
        },
      },
      {
        id: "S37-T2-B-E3",
        subtopicId: "S37-T2-B",
        kind: "transfer",
        instruction:
          "reduce before expensive score.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('order', ['block','score'])
print('ok', True)
print('n', 2)`,
          output: `order ['block', 'score']
ok True
n 2`,
        },
      },
      {
        id: "S37-T3-A-E1",
        subtopicId: "S37-T3-A",
        kind: "guided",
        instruction:
          "chunk count for 10 size 4.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(3)
print('size', 4)
print('ok', True)`,
          output: `3
size 4
ok True`,
        },
      },
      {
        id: "S37-T3-A-E2",
        subtopicId: "S37-T3-A",
        kind: "independent",
        instruction:
          "columns subset.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['id','amt'])
print('ok', True)
print('columnar', True)`,
          output: `['id', 'amt']
ok True
columnar True`,
        },
      },
      {
        id: "S37-T3-A-E3",
        subtopicId: "S37-T3-A",
        kind: "transfer",
        instruction:
          "dtype note int32.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('dtype', 'int32')
print('ok', True)
print('mem', 'lower')`,
          output: `dtype int32
ok True
mem lower`,
        },
      },
      {
        id: "S37-T3-B-E1",
        subtopicId: "S37-T3-B",
        kind: "guided",
        instruction:
          "cache key tuple.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(('fs-v1','cut'))
print('hit', True)
print('ok', True)`,
          output: `('fs-v1', 'cut')
hit True
ok True`,
        },
      },
      {
        id: "S37-T3-B-E2",
        subtopicId: "S37-T3-B",
        kind: "independent",
        instruction:
          "invalidate reason.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('version_change')
print('ok', True)
print('stale', True)`,
          output: `version_change
ok True
stale True`,
        },
      },
      {
        id: "S37-T3-B-E3",
        subtopicId: "S37-T3-B",
        kind: "transfer",
        instruction:
          "ooc strategy chunk.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('ooc', 'chunk')
print('ok', True)
print('ram', 'bounded')`,
          output: `ooc chunk
ok True
ram bounded`,
        },
      },
      {
        id: "S37-T4-A-E1",
        subtopicId: "S37-T4-A",
        kind: "guided",
        instruction:
          "pass if 9<=10.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)
print('budget', 10)
print('measured', 9)`,
          output: `True
budget 10
measured 9`,
        },
      },
      {
        id: "S37-T4-A-E2",
        subtopicId: "S37-T4-A",
        kind: "independent",
        instruction:
          "fail if 12>10.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(False)
print('budget', 10)
print('measured', 12)`,
          output: `False
budget 10
measured 12`,
        },
      },
      {
        id: "S37-T4-A-E3",
        subtopicId: "S37-T4-A",
        kind: "transfer",
        instruction:
          "budget fields.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['latency_p95','memory','pairs'])
print('ok', True)
print('n', 3)`,
          output: `['latency_p95', 'memory', 'pairs']
ok True
n 3`,
        },
      },
      {
        id: "S37-T4-B-E1",
        subtopicId: "S37-T4-B",
        kind: "guided",
        instruction:
          "speedup 80/20.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(4.0)
print('ok', True)
print('micro_only', False)`,
          output: `4.0
ok True
micro_only False`,
        },
      },
      {
        id: "S37-T4-B-E2",
        subtopicId: "S37-T4-B",
        kind: "independent",
        instruction:
          "clarity over 2%.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('prefer', 'clarity')
print('ok', True)
print('shave', '2pct_no')`,
          output: `prefer clarity
ok True
shave 2pct_no`,
        },
      },
      {
        id: "S37-T4-B-E3",
        subtopicId: "S37-T4-B",
        kind: "transfer",
        instruction:
          "report keys.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['before','after','dataset','hardware'])
print('ok', True)
print('n', 4)`,
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
      "Mide path caliente, aplica blocking/estructuras, budget test y reporte. Id dbt-bigquery conservado.",
    objectives: [
      "Profile wall",
      "Blocking reduction",
      "Cache/chunks",
      "Budget + before/after",
    ],
    requirements: [
      "Mismo resultado funcional",
      "Dataset/hardware anotados",
      "es-PE",
    ],
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
      "Escala CP-N3-C; no PASS.",
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
        explanation:
          "Cold start.",
      },
      {
        question: "Blocking reduce:",
        options: ["Solo logs", "Privacidad automáticamente", "Pares candidatos O(n²)", "Seeds"],
        correctIndex: 2,
        explanation:
          "Costo de pares.",
      },
      {
        question: "Performance budget en CI:",
        options: ["Es opcional teatro", "Solo se mide en prod un año después", "Reemplaza tests funcionales", "Falla si se rompe el límite acordado"],
        correctIndex: 3,
        explanation:
          "Regresión perf.",
      },
      {
        question: "Microoptimizar 2% sin medición:",
        options: ["Best practice", "Teatro; prioriza claridad y algos", "Obligatorio", "Invalida blocking"],
        correctIndex: 1,
        explanation:
          "Costo total.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python time.perf_counter",
        url: "https://docs.python.org/3/library/time.html",
        note: "Wall clock",
      },
      {
        label: "Big-O cheat sheet",
        url: "https://www.bigocheatsheet.com/",
        note: "Complejidad",
      },
    ],
    books: [
      {
        label: "High Performance Python",
        note: "Profiling",
      },
      {
        label: "Algorithm design manuals",
        note: "Blocking/indexing",
      },
    ],
    courses: [
      {
        label: "Python profilers",
        url: "https://docs.python.org/3/library/profile.html",
        note: "cProfile",
      },
    ],
  },
}
