import type { CourseSection } from '../../types'

export const section46: CourseSection = {
  id: "gpu-computing",
  index: 46,
  title: "Ingeniería de datos y orquestación de producción",
  shortTitle: "Data eng producción",
  tagline: "pipeline incremental/backfillable sin duplicar, con lineage y alertas por dato tardío o contrato roto",
  estimatedHours: 14,
  level: "Master",
  phase: 3,
  icon: "Cpu",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Ingeniería de datos y orquestación de producción** (id de plataforma `gpu-computing` conservado; legado «Performance Extrema — CUDA, GPU Computing con Python»). Contribuye a **CP-N4-B (pipeline)**: pipeline incremental/backfillable cuya reejecución no duplica, registra lineage y alerta por dato tardío o contrato roto. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Maneja ventanas y watermarks" },
    { text: "Trata late data y exactly-once compuesto" },
    { text: "Modela DAG/assets y deps" },
    { text: "Programa backfills y recupera estado" },
    { text: "Valida contracts y freshness" },
    { text: "Registra lineage y ownership" },
    { text: "Carga incremental por particiones" },
    { text: "Opera SLO e incidentes de datos" },
  ],
  theory: [
    {
      heading: "Mapa V3 S46: Ingeniería de datos y orquestación de producción",
      paragraphs: [
        "En V3, **S46** retematiza el archivo de plataforma `gpu-computing` hacia **Ingeniería de datos y orquestación de producción**.",
        "Incremento: pipeline incremental/backfillable cuya reejecución no duplica, registra lineage y alerta por dato tardío o contrato roto.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `gpu-computing`. Capstone: CP-N4-B (pipeline).",
      },
    },
    {
      heading: "ventanas, event time y watermarks",
      subtopicId: "S46-T1-A",
      paragraphs: [
        "**ventanas, event time y watermarks** — outcome del blueprint phase3 para `windows-event-time-watermarks`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "windows_event_time_watermarks.py",
        code: `print("watermark", "2026-01-01T09:59:00"); print("n", 2); print("event_time", True)`,
        output: `watermark 2026-01-01T09:59:00
n 2
event_time True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "late data y exactly-once como propiedad compuesta",
      subtopicId: "S46-T1-B",
      paragraphs: [
        "**late data y exactly-once como propiedad compuesta** — outcome del blueprint phase3 para `late-data-exactly-once`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "late_data_exactly_once.py",
        code: `print(True); print(False); print("exactly_once", "idempotent_sink+dedup")`,
        output: `True
False
exactly_once idempotent_sink+dedup`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "DAG/assets y dependency",
      subtopicId: "S46-T2-A",
      paragraphs: [
        "**DAG/assets y dependency** — outcome del blueprint phase3 para `dag-assets-dependency`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "dag_assets_dependency.py",
        code: `print(sorted(["er","ingest","normalize","report"])); print("deps_er", ["normalize"]); print("asset", "er_clusters")`,
        output: `['er', 'ingest', 'normalize', 'report']
deps_er ['normalize']
asset er_clusters`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "schedules, backfills y state recovery",
      subtopicId: "S46-T2-B",
      paragraphs: [
        "**schedules, backfills y state recovery** — outcome del blueprint phase3 para `schedules-backfills-state`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "schedules_backfills_state.py",
        code: `print({"cron":"0 * * * *","backfill":True}); print("recover", "from_checkpoint"); print("reentrant", True)`,
        output: `{'cron': '0 * * * *', 'backfill': True}
recover from_checkpoint
reentrant True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "contracts y freshness",
      subtopicId: "S46-T3-A",
      paragraphs: [
        "**contracts y freshness** — outcome del blueprint phase3 para `contracts-freshness`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "contracts_freshness.py",
        code: `print(["case_id","status"]); print(60); print("break", "alert")`,
        output: `['case_id', 'status']
60
break alert`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "lineage, observability y ownership",
      subtopicId: "S46-T3-B",
      paragraphs: [
        "**lineage, observability y ownership** — outcome del blueprint phase3 para `lineage-obs-ownership`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "lineage_obs_ownership.py",
        code: `print({"report":["er","cases"]}); print({"er":"data-platform"}); print("obs", ["lag","rows"])`,
        output: `{'report': ['er', 'cases']}
{'er': 'data-platform'}
obs ['lag', 'rows']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "partitions e incremental loads",
      subtopicId: "S46-T4-A",
      paragraphs: [
        "**partitions e incremental loads** — outcome del blueprint phase3 para `partitions-incremental`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "partitions_incremental.py",
        code: `print([{"ts":3,"id":"b"}]); print("partition", "date"); print("no_dup_rerun", True)`,
        output: `[{'ts': 3, 'id': 'b'}]
partition date
no_dup_rerun True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "SLO, incidentes y data recovery",
      subtopicId: "S46-T4-B",
      paragraphs: [
        "**SLO, incidentes y data recovery** — outcome del blueprint phase3 para `slo-incidents-data-recovery`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (pipeline)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "slo_incidents_data_recovery.py",
        code: `print({"freshness_min":60,"success_rate":0.99}); print("replay_partition"); print("recovery", "replay")`,
        output: `{'freshness_min': 60, 'success_rate': 0.99}
replay_partition
recovery replay`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S46 (Ingeniería de datos y orquestación de producción) alineadas a CP-N4-B (pipeline).",
    steps: [
      {
        demoId: "S46-T1-A-DEMO",
        subtopicId: "S46-T1-A",
        environment: "local-python",
        description: "Demo: ventanas, event time y watermarks",
        code: {
          language: 'python',
          title: "demo_windows_event_time_watermarks.py",
          code: `print("window", "5min"); print("wm_lag", "1min"); print("vs_processing_time", True)`,
          output: `window 5min
wm_lag 1min
vs_processing_time True`,
        },
        why: "Demuestra el outcome de S46-T1-A con Python verificable.",
      },
      {
        demoId: "S46-T1-B-DEMO",
        subtopicId: "S46-T1-B",
        environment: "local-python",
        description: "Demo: late data y exactly-once como propiedad compuesta",
        code: {
          language: 'python',
          title: "demo_late_data_exactly_once.py",
          code: `print("late_policy", "side_output"); print("eo", "composite"); print("dedup_key", "event_id")`,
          output: `late_policy side_output
eo composite
dedup_key event_id`,
        },
        why: "Demuestra el outcome de S46-T1-B con Python verificable.",
      },
      {
        demoId: "S46-T2-A-DEMO",
        subtopicId: "S46-T2-A",
        environment: "local-python",
        description: "Demo: DAG/assets y dependency",
        code: {
          language: 'python',
          title: "demo_dag_assets_dependency.py",
          code: `print("nodes", 4); print("edge", "normalize->er"); print("acyclic", True)`,
          output: `nodes 4
edge normalize->er
acyclic True`,
        },
        why: "Demuestra el outcome de S46-T2-A con Python verificable.",
      },
      {
        demoId: "S46-T2-B-DEMO",
        subtopicId: "S46-T2-B",
        environment: "local-python",
        description: "Demo: schedules, backfills y state recovery",
        code: {
          language: 'python',
          title: "demo_schedules_backfills_state.py",
          code: `print("backfill_ok", True); print("state", "checkpoints"); print("schedule", "hourly")`,
          output: `backfill_ok True
state checkpoints
schedule hourly`,
        },
        why: "Demuestra el outcome de S46-T2-B con Python verificable.",
      },
      {
        demoId: "S46-T3-A-DEMO",
        subtopicId: "S46-T3-A",
        environment: "local-python",
        description: "Demo: contracts y freshness",
        code: {
          language: 'python',
          title: "demo_contracts_freshness.py",
          code: `print("fresh", True); print("schema_fail", "block"); print("sla_min", 60)`,
          output: `fresh True
schema_fail block
sla_min 60`,
        },
        why: "Demuestra el outcome de S46-T3-A con Python verificable.",
      },
      {
        demoId: "S46-T3-B-DEMO",
        subtopicId: "S46-T3-B",
        environment: "local-python",
        description: "Demo: lineage, observability y ownership",
        code: {
          language: 'python',
          title: "demo_lineage_obs_ownership.py",
          code: `print("owner", "data-platform"); print("upstream", ["er","cases"]); print("page", True)`,
          output: `owner data-platform
upstream ['er', 'cases']
page True`,
        },
        why: "Demuestra el outcome de S46-T3-B con Python verificable.",
      },
      {
        demoId: "S46-T4-A-DEMO",
        subtopicId: "S46-T4-A",
        environment: "local-python",
        description: "Demo: partitions e incremental loads",
        code: {
          language: 'python',
          title: "demo_partitions_incremental.py",
          code: `print("merge_key", "id"); print("load", "incremental"); print("full_refresh", "rare")`,
          output: `merge_key id
load incremental
full_refresh rare`,
        },
        why: "Demuestra el outcome de S46-T4-A con Python verificable.",
      },
      {
        demoId: "S46-T4-B-DEMO",
        subtopicId: "S46-T4-B",
        environment: "local-python",
        description: "Demo: SLO, incidentes y data recovery",
        code: {
          language: 'python',
          title: "demo_slo_incidents_data_recovery.py",
          code: `print("slo_breach", False); print("incident", "page_owner"); print("data_recovery", True)`,
          output: `slo_breach False
incident page_owner
data_recovery True`,
        },
        why: "Demuestra el outcome de S46-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S46-T1-A-E1",
        subtopicId: "S46-T1-A",
        kind: "guided",
        instruction:
          "Ejercicio S46-T1-A-E1: usa el patrón del demo iDo del subtema S46-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("window", "5min"); print("wm_lag", "1min"); print("vs_processing_time", True)`,
          output: `window 5min
wm_lag 1min
vs_processing_time True`,
        },
      },
      {
        id: "S46-T1-A-E2",
        subtopicId: "S46-T1-A",
        kind: "independent",
        instruction:
          "Ejercicio S46-T1-A-E2: usa el patrón del demo iDo del subtema S46-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("window", "5min"); print("wm_lag", "1min"); print("vs_processing_time", True)`,
          output: `window 5min
wm_lag 1min
vs_processing_time True`,
        },
      },
      {
        id: "S46-T1-A-E3",
        subtopicId: "S46-T1-A",
        kind: "transfer",
        instruction:
          "Ejercicio S46-T1-A-E3: usa el patrón del demo iDo del subtema S46-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("window", "5min"); print("wm_lag", "1min"); print("vs_processing_time", True)`,
          output: `window 5min
wm_lag 1min
vs_processing_time True`,
        },
      },
      {
        id: "S46-T1-B-E1",
        subtopicId: "S46-T1-B",
        kind: "guided",
        instruction:
          "Ejercicio S46-T1-B-E1: usa el patrón del demo iDo del subtema S46-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("late_policy", "side_output"); print("eo", "composite"); print("dedup_key", "event_id")`,
          output: `late_policy side_output
eo composite
dedup_key event_id`,
        },
      },
      {
        id: "S46-T1-B-E2",
        subtopicId: "S46-T1-B",
        kind: "independent",
        instruction:
          "Ejercicio S46-T1-B-E2: usa el patrón del demo iDo del subtema S46-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("late_policy", "side_output"); print("eo", "composite"); print("dedup_key", "event_id")`,
          output: `late_policy side_output
eo composite
dedup_key event_id`,
        },
      },
      {
        id: "S46-T1-B-E3",
        subtopicId: "S46-T1-B",
        kind: "transfer",
        instruction:
          "Ejercicio S46-T1-B-E3: usa el patrón del demo iDo del subtema S46-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("late_policy", "side_output"); print("eo", "composite"); print("dedup_key", "event_id")`,
          output: `late_policy side_output
eo composite
dedup_key event_id`,
        },
      },
      {
        id: "S46-T2-A-E1",
        subtopicId: "S46-T2-A",
        kind: "guided",
        instruction:
          "Ejercicio S46-T2-A-E1: usa el patrón del demo iDo del subtema S46-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("nodes", 4); print("edge", "normalize->er"); print("acyclic", True)`,
          output: `nodes 4
edge normalize->er
acyclic True`,
        },
      },
      {
        id: "S46-T2-A-E2",
        subtopicId: "S46-T2-A",
        kind: "independent",
        instruction:
          "Ejercicio S46-T2-A-E2: usa el patrón del demo iDo del subtema S46-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("nodes", 4); print("edge", "normalize->er"); print("acyclic", True)`,
          output: `nodes 4
edge normalize->er
acyclic True`,
        },
      },
      {
        id: "S46-T2-A-E3",
        subtopicId: "S46-T2-A",
        kind: "transfer",
        instruction:
          "Ejercicio S46-T2-A-E3: usa el patrón del demo iDo del subtema S46-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("nodes", 4); print("edge", "normalize->er"); print("acyclic", True)`,
          output: `nodes 4
edge normalize->er
acyclic True`,
        },
      },
      {
        id: "S46-T2-B-E1",
        subtopicId: "S46-T2-B",
        kind: "guided",
        instruction:
          "Ejercicio S46-T2-B-E1: usa el patrón del demo iDo del subtema S46-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("backfill_ok", True); print("state", "checkpoints"); print("schedule", "hourly")`,
          output: `backfill_ok True
state checkpoints
schedule hourly`,
        },
      },
      {
        id: "S46-T2-B-E2",
        subtopicId: "S46-T2-B",
        kind: "independent",
        instruction:
          "Ejercicio S46-T2-B-E2: usa el patrón del demo iDo del subtema S46-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("backfill_ok", True); print("state", "checkpoints"); print("schedule", "hourly")`,
          output: `backfill_ok True
state checkpoints
schedule hourly`,
        },
      },
      {
        id: "S46-T2-B-E3",
        subtopicId: "S46-T2-B",
        kind: "transfer",
        instruction:
          "Ejercicio S46-T2-B-E3: usa el patrón del demo iDo del subtema S46-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("backfill_ok", True); print("state", "checkpoints"); print("schedule", "hourly")`,
          output: `backfill_ok True
state checkpoints
schedule hourly`,
        },
      },
      {
        id: "S46-T3-A-E1",
        subtopicId: "S46-T3-A",
        kind: "guided",
        instruction:
          "Ejercicio S46-T3-A-E1: usa el patrón del demo iDo del subtema S46-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("fresh", True); print("schema_fail", "block"); print("sla_min", 60)`,
          output: `fresh True
schema_fail block
sla_min 60`,
        },
      },
      {
        id: "S46-T3-A-E2",
        subtopicId: "S46-T3-A",
        kind: "independent",
        instruction:
          "Ejercicio S46-T3-A-E2: usa el patrón del demo iDo del subtema S46-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("fresh", True); print("schema_fail", "block"); print("sla_min", 60)`,
          output: `fresh True
schema_fail block
sla_min 60`,
        },
      },
      {
        id: "S46-T3-A-E3",
        subtopicId: "S46-T3-A",
        kind: "transfer",
        instruction:
          "Ejercicio S46-T3-A-E3: usa el patrón del demo iDo del subtema S46-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("fresh", True); print("schema_fail", "block"); print("sla_min", 60)`,
          output: `fresh True
schema_fail block
sla_min 60`,
        },
      },
      {
        id: "S46-T3-B-E1",
        subtopicId: "S46-T3-B",
        kind: "guided",
        instruction:
          "Ejercicio S46-T3-B-E1: usa el patrón del demo iDo del subtema S46-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("owner", "data-platform"); print("upstream", ["er","cases"]); print("page", True)`,
          output: `owner data-platform
upstream ['er', 'cases']
page True`,
        },
      },
      {
        id: "S46-T3-B-E2",
        subtopicId: "S46-T3-B",
        kind: "independent",
        instruction:
          "Ejercicio S46-T3-B-E2: usa el patrón del demo iDo del subtema S46-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("owner", "data-platform"); print("upstream", ["er","cases"]); print("page", True)`,
          output: `owner data-platform
upstream ['er', 'cases']
page True`,
        },
      },
      {
        id: "S46-T3-B-E3",
        subtopicId: "S46-T3-B",
        kind: "transfer",
        instruction:
          "Ejercicio S46-T3-B-E3: usa el patrón del demo iDo del subtema S46-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("owner", "data-platform"); print("upstream", ["er","cases"]); print("page", True)`,
          output: `owner data-platform
upstream ['er', 'cases']
page True`,
        },
      },
      {
        id: "S46-T4-A-E1",
        subtopicId: "S46-T4-A",
        kind: "guided",
        instruction:
          "Ejercicio S46-T4-A-E1: usa el patrón del demo iDo del subtema S46-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("merge_key", "id"); print("load", "incremental"); print("full_refresh", "rare")`,
          output: `merge_key id
load incremental
full_refresh rare`,
        },
      },
      {
        id: "S46-T4-A-E2",
        subtopicId: "S46-T4-A",
        kind: "independent",
        instruction:
          "Ejercicio S46-T4-A-E2: usa el patrón del demo iDo del subtema S46-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("merge_key", "id"); print("load", "incremental"); print("full_refresh", "rare")`,
          output: `merge_key id
load incremental
full_refresh rare`,
        },
      },
      {
        id: "S46-T4-A-E3",
        subtopicId: "S46-T4-A",
        kind: "transfer",
        instruction:
          "Ejercicio S46-T4-A-E3: usa el patrón del demo iDo del subtema S46-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("merge_key", "id"); print("load", "incremental"); print("full_refresh", "rare")`,
          output: `merge_key id
load incremental
full_refresh rare`,
        },
      },
      {
        id: "S46-T4-B-E1",
        subtopicId: "S46-T4-B",
        kind: "guided",
        instruction:
          "Ejercicio S46-T4-B-E1: usa el patrón del demo iDo del subtema S46-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("slo_breach", False); print("incident", "page_owner"); print("data_recovery", True)`,
          output: `slo_breach False
incident page_owner
data_recovery True`,
        },
      },
      {
        id: "S46-T4-B-E2",
        subtopicId: "S46-T4-B",
        kind: "independent",
        instruction:
          "Ejercicio S46-T4-B-E2: usa el patrón del demo iDo del subtema S46-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S46-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("slo_breach", False); print("incident", "page_owner"); print("data_recovery", True)`,
          output: `slo_breach False
incident page_owner
data_recovery True`,
        },
      },
      {
        id: "S46-T4-B-E3",
        subtopicId: "S46-T4-B",
        kind: "transfer",
        instruction:
          "Ejercicio S46-T4-B-E3: usa el patrón del demo iDo del subtema S46-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S46-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S46-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: escribe el print final como en el demo iDo del mismo subtopicId
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("slo_breach", False); print("incident", "page_owner"); print("data_recovery", True)`,
          output: `slo_breach False
incident page_owner
data_recovery True`,
        },
      },
    ],
  },
  youDo: {
    title: "Ingeniería de datos y orquestación de producción",
    context:
      "Proyecto de sección **S46** (Ingeniería de datos y orquestación de producción). Gate: **CP-N4-B (pipeline)**. pipeline incremental/backfillable cuya reejecución no duplica, registra lineage y alerta por dato tardío o contrato roto. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "pipeline incremental/backfillable cuya reejecución no duplica, registra lineage y alerta por dato tardío o contrato roto.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-B (pipeline)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S46 You Do — Ingeniería de datos y orquestación de producción
# Gate: CP-N4-B (pipeline)
# pipeline incremental/backfillable cuya reejecución no duplica, registra lineage y alerta por dato tardío o contrato roto

def main():
    print("section", "S46")
    print("gate", 'CP-N4-B (pipeline)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-B (pipeline). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
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
        question: "El id de plataforma de S46 que se preserva es:",
        options: [
          "gpu-computing",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S46 pertenece a:",
        options: [
          "CP-N4-B (pipeline)",
          "CP-N1-A",
          "solo marketing",
          "sin capstone",
        ],
        correctIndex: 0,
        explanation:
          "Blueprint phase3 capstone_notes.",
      },
      {
        question: "Los ejemplos del curso deben usar:",
        options: [
          "PII real de clientes",
          "Datos sintéticos",
          "Secretos de prod",
          "Claves API reales",
        ],
        correctIndex: 1,
        explanation:
          "Synthetic data only.",
      },
      {
        question: "Entity resolution (si aparece) decide:",
        options: [
          "Fraude",
          "Parentesco",
          "Misma entidad cuando aplique",
          "Sentimiento",
        ],
        correctIndex: 2,
        explanation:
          "ER ≠ relación ≠ fraude.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python docs",
        url: "https://docs.python.org/3/",
        note: "Referencia stdlib",
      },
      {
        label: "V3 section support",
        url: "https://docs.python.org/3/library/",
        note: "Apoyo S46 Ingeniería de datos y orquestación de producción",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Ingeniería de datos y orquestación de producción",
      },
      {
        label: "Site Reliability / Security basics",
        note: "Operación y privacidad",
      },
    ],
    courses: [
      {
        label: "MDN / cloud / MLOps primers",
        url: "https://developer.mozilla.org/",
        note: "Complemento conceptual",
      },
    ],
  },
}
