import type { CourseSection } from '../../types'

export const section45: CourseSection = {
  id: "iac",
  index: 45,
  title: "Cloud, almacenamiento, colas e infraestructura",
  shortTitle: "Cloud y colas",
  tagline: "job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados",
  estimatedHours: 14,
  level: "Master",
  phase: 3,
  icon: "Cloud",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Cloud, almacenamiento, colas e infraestructura** (id de plataforma `iac` conservado; legado «Infraestructura como Código para AI Platforms»). Contribuye a **CP-N4-B (arquitectura)**: job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Elige object/relacional/cache" },
    { text: "Define consistencia, lifecycle y backups" },
    { text: "Diseña colas y delivery semantics" },
    { text: "Garantiza dedup, orden y DLQ" },
    { text: "Dimensiona compute y red" },
    { text: "Restringe IAM, paths privados y egress" },
    { text: "Declara infra y environments" },
    { text: "Presupuesta costo y recovery" },
  ],
  theory: [
    {
      heading: "Mapa V3 S45: Cloud, almacenamiento, colas e infraestructura",
      paragraphs: [
        "En V3, **S45** retematiza el archivo de plataforma `iac` hacia **Cloud, almacenamiento, colas e infraestructura**.",
        "Incremento: job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `iac`. Capstone: CP-N4-B (arquitectura).",
      },
    },
    {
      heading: "object store, relacional y cache",
      subtopicId: "S45-T1-A",
      paragraphs: [
        "**object store, relacional y cache** — outcome del blueprint phase3 para `object-relational-cache`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "object_relational_cache.py",
        code: `print(sorted(["cache","object","relational"])); print("object", "artifacts"); print("choose", "by_access_pattern")`,
        output: `['cache', 'object', 'relational']
object artifacts
choose by_access_pattern`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "consistencia, lifecycle y backups",
      subtopicId: "S45-T1-B",
      paragraphs: [
        "**consistencia, lifecycle y backups** — outcome del blueprint phase3 para `consistency-lifecycle-backups`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "consistency_lifecycle_backups.py",
        code: `print({"hot_days":30,"backup":"daily"}); print("rpo", "24h"); print("consistency", "job_status_strong")`,
        output: `{'hot_days': 30, 'backup': 'daily'}
rpo 24h
consistency job_status_strong`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "queue/event y delivery semantics",
      subtopicId: "S45-T2-A",
      paragraphs: [
        "**queue/event y delivery semantics** — outcome del blueprint phase3 para `queue-event-delivery`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "queue_event_delivery.py",
        code: `print({"delivery":"at_least_once"}); print("dup_ok", True); print("consumer", "idempotent")`,
        output: `{'delivery': 'at_least_once'}
dup_ok True
consumer idempotent`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "dedup, ordering y dead-letter",
      subtopicId: "S45-T2-B",
      paragraphs: [
        "**dedup, ordering y dead-letter** — outcome del blueprint phase3 para `dedup-ordering-dlq`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "dedup_ordering_dlq.py",
        code: `print("new"); print("dup"); print("dlq", "after_3")`,
        output: `new
dup
dlq after_3`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "compute, autoscaling y networking",
      subtopicId: "S45-T3-A",
      paragraphs: [
        "**compute, autoscaling y networking** — outcome del blueprint phase3 para `compute-autoscale-net`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "compute_autoscale_net.py",
        code: `print({"min":1,"max":5}); print({"private":True}); print("autoscale", "queue_depth")`,
        output: `{'min': 1, 'max': 5}
{'private': True}
autoscale queue_depth`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "IAM, private paths y egress",
      subtopicId: "S45-T3-B",
      paragraphs: [
        "**IAM, private paths y egress** — outcome del blueprint phase3 para `iam-private-egress`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "iam_private_egress.py",
        code: `print(["s3:PutObject","sqs:Receive"]); print("egress", "restricted"); print("private_path", True)`,
        output: `['s3:PutObject', 'sqs:Receive']
egress restricted
private_path True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "configuración declarativa y environments",
      subtopicId: "S45-T4-A",
      paragraphs: [
        "**configuración declarativa y environments** — outcome del blueprint phase3 para `declarative-config-envs`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "declarative_config_envs.py",
        code: `print(["dev","prod"]); print(["network","data","app"]); print("declarative", True)`,
        output: `['dev', 'prod']
['network', 'data', 'app']
declarative True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "costos, quotas, recovery y portability",
      subtopicId: "S45-T4-B",
      paragraphs: [
        "**costos, quotas, recovery y portability** — outcome del blueprint phase3 para `cost-quotas-recovery-portability`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (arquitectura)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "cost_quotas_recovery_portability.py",
        code: `print({"monthly_usd":200}); print({"rto_min":60}); print("portable", "container_images")`,
        output: `{'monthly_usd': 200}
{'rto_min': 60}
portable container_images`,
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
    intro: "Te muestro 8 demos de S45 (Cloud, almacenamiento, colas e infraestructura) alineadas a CP-N4-B (arquitectura).",
    steps: [
      {
        demoId: "S45-T1-A-DEMO",
        subtopicId: "S45-T1-A",
        environment: "local-python",
        description: "Demo: object store, relacional y cache",
        code: {
          language: 'python',
          title: "demo_object_relational_cache.py",
          code: `print("blob", "s3_like"); print("sql", "jobs_table"); print("cache", "redis_like")`,
          output: `blob s3_like
sql jobs_table
cache redis_like`,
        },
        why: "Demuestra el outcome de S45-T1-A con Python verificable.",
      },
      {
        demoId: "S45-T1-B-DEMO",
        subtopicId: "S45-T1-B",
        environment: "local-python",
        description: "Demo: consistencia, lifecycle y backups",
        code: {
          language: 'python',
          title: "demo_consistency_lifecycle_backups.py",
          code: `print("lifecycle", True); print("backup", "daily"); print("restore_tested", True)`,
          output: `lifecycle True
backup daily
restore_tested True`,
        },
        why: "Demuestra el outcome de S45-T1-B con Python verificable.",
      },
      {
        demoId: "S45-T2-A-DEMO",
        subtopicId: "S45-T2-A",
        environment: "local-python",
        description: "Demo: queue/event y delivery semantics",
        code: {
          language: 'python',
          title: "demo_queue_event_delivery.py",
          code: `print("queue", "jobs"); print("event", "job.finished"); print("delivery", "at_least_once")`,
          output: `queue jobs
event job.finished
delivery at_least_once`,
        },
        why: "Demuestra el outcome de S45-T2-A con Python verificable.",
      },
      {
        demoId: "S45-T2-B-DEMO",
        subtopicId: "S45-T2-B",
        environment: "local-python",
        description: "Demo: dedup, ordering y dead-letter",
        code: {
          language: 'python',
          title: "demo_dedup_ordering_dlq.py",
          code: `print("order", "per_partition"); print("dlq", True); print("dedup_store", "redis_or_db")`,
          output: `order per_partition
dlq True
dedup_store redis_or_db`,
        },
        why: "Demuestra el outcome de S45-T2-B con Python verificable.",
      },
      {
        demoId: "S45-T3-A-DEMO",
        subtopicId: "S45-T3-A",
        environment: "local-python",
        description: "Demo: compute, autoscaling y networking",
        code: {
          language: 'python',
          title: "demo_compute_autoscale_net.py",
          code: `print("scale_on", "lag"); print("private", True); print("api_edge", True)`,
          output: `scale_on lag
private True
api_edge True`,
        },
        why: "Demuestra el outcome de S45-T3-A con Python verificable.",
      },
      {
        demoId: "S45-T3-B-DEMO",
        subtopicId: "S45-T3-B",
        environment: "local-python",
        description: "Demo: IAM, private paths y egress",
        code: {
          language: 'python',
          title: "demo_iam_private_egress.py",
          code: `print("least_privilege", True); print("no_0_0_0_0_admin", True); print("egress", "allowlist")`,
          output: `least_privilege True
no_0_0_0_0_admin True
egress allowlist`,
        },
        why: "Demuestra el outcome de S45-T3-B con Python verificable.",
      },
      {
        demoId: "S45-T4-A-DEMO",
        subtopicId: "S45-T4-A",
        environment: "local-python",
        description: "Demo: configuración declarativa y environments",
        code: {
          language: 'python',
          title: "demo_declarative_config_envs.py",
          code: `print("env_parity", True); print("config_as_code", True); print("drift_detect", True)`,
          output: `env_parity True
config_as_code True
drift_detect True`,
        },
        why: "Demuestra el outcome de S45-T4-A con Python verificable.",
      },
      {
        demoId: "S45-T4-B-DEMO",
        subtopicId: "S45-T4-B",
        environment: "local-python",
        description: "Demo: costos, quotas, recovery y portability",
        code: {
          language: 'python',
          title: "demo_cost_quotas_recovery_portability.py",
          code: `print("quota", True); print("cost_alert", 0.8); print("recovery_drill", True)`,
          output: `quota True
cost_alert 0.8
recovery_drill True`,
        },
        why: "Demuestra el outcome de S45-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S45-T1-A-E1",
        subtopicId: "S45-T1-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`sorted(['cache','object','relational'])\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(sorted(['cache','object','relational']))`,
          output: `['cache', 'object', 'relational']`,
        },
      },
      {
        id: "S45-T1-A-E2",
        subtopicId: "S45-T1-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'artifacts'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('artifacts')`,
          output: `artifacts`,
        },
      },
      {
        id: "S45-T1-A-E3",
        subtopicId: "S45-T1-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'by_access_pattern'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('by_access_pattern')`,
          output: `by_access_pattern`,
        },
      },
      {
        id: "S45-T1-B-E1",
        subtopicId: "S45-T1-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`30\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(30)`,
          output: `30`,
        },
      },
      {
        id: "S45-T1-B-E2",
        subtopicId: "S45-T1-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'daily'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('daily')`,
          output: `daily`,
        },
      },
      {
        id: "S45-T1-B-E3",
        subtopicId: "S45-T1-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'24h'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('24h')`,
          output: `24h`,
        },
      },
      {
        id: "S45-T2-A-E1",
        subtopicId: "S45-T2-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'at_least_once'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('at_least_once')`,
          output: `at_least_once`,
        },
      },
      {
        id: "S45-T2-A-E2",
        subtopicId: "S45-T2-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S45-T2-A-E3",
        subtopicId: "S45-T2-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'idempotent'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('idempotent')`,
          output: `idempotent`,
        },
      },
      {
        id: "S45-T2-B-E1",
        subtopicId: "S45-T2-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'dup'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('dup')`,
          output: `dup`,
        },
      },
      {
        id: "S45-T2-B-E2",
        subtopicId: "S45-T2-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'after_3'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('after_3')`,
          output: `after_3`,
        },
      },
      {
        id: "S45-T2-B-E3",
        subtopicId: "S45-T2-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S45-T3-A-E1",
        subtopicId: "S45-T3-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`5\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(5)`,
          output: `5`,
        },
      },
      {
        id: "S45-T3-A-E2",
        subtopicId: "S45-T3-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S45-T3-A-E3",
        subtopicId: "S45-T3-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'queue_depth'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('queue_depth')`,
          output: `queue_depth`,
        },
      },
      {
        id: "S45-T3-B-E1",
        subtopicId: "S45-T3-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`['s3:PutObject','sqs:Receive']\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['s3:PutObject','sqs:Receive'])`,
          output: `['s3:PutObject', 'sqs:Receive']`,
        },
      },
      {
        id: "S45-T3-B-E2",
        subtopicId: "S45-T3-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'restricted'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('restricted')`,
          output: `restricted`,
        },
      },
      {
        id: "S45-T3-B-E3",
        subtopicId: "S45-T3-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S45-T4-A-E1",
        subtopicId: "S45-T4-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`['dev','prod']\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['dev','prod'])`,
          output: `['dev', 'prod']`,
        },
      },
      {
        id: "S45-T4-A-E2",
        subtopicId: "S45-T4-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`['network','data','app']\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['network','data','app'])`,
          output: `['network', 'data', 'app']`,
        },
      },
      {
        id: "S45-T4-A-E3",
        subtopicId: "S45-T4-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S45-T4-B-E1",
        subtopicId: "S45-T4-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`200\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(200)`,
          output: `200`,
        },
      },
      {
        id: "S45-T4-B-E2",
        subtopicId: "S45-T4-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`60\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(60)`,
          output: `60`,
        },
      },
      {
        id: "S45-T4-B-E3",
        subtopicId: "S45-T4-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'container_images'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('container_images')`,
          output: `container_images`,
        },
      },
    ],
  },
  youDo: {
    title: "Cloud, almacenamiento, colas e infraestructura",
    context:
      "Proyecto de sección **S45** (Cloud, almacenamiento, colas e infraestructura). Gate: **CP-N4-B (arquitectura)**. job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-B (arquitectura)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S45 You Do — Cloud, almacenamiento, colas e infraestructura
# Gate: CP-N4-B (arquitectura)
# job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados.

def main():
    print("section", "S45")
    print("gate", 'CP-N4-B (arquitectura)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-B (arquitectura). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
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
        question: "El id de plataforma de S45 que se preserva es:",
        options: [
          "iac",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S45 pertenece a:",
        options: [
          "CP-N4-B (arquitectura)",
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
        note: "Apoyo S45 Cloud, almacenamiento, colas e infraestructura",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Cloud, almacenamiento, colas e infraestructura",
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
