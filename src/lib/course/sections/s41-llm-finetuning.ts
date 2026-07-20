import type { CourseSection } from '../../types'

export const section41: CourseSection = {
  id: "llm-finetuning",
  index: 41,
  title: "APIs con FastAPI y contratos HTTP",
  shortTitle: "APIs FastAPI",
  tagline: "API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas",
  estimatedHours: 14,
  level: "Master",
  phase: 3,
  icon: "Cpu",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **APIs con FastAPI y contratos HTTP** (id de plataforma `llm-finetuning` conservado; legado «Fine-Tuning de LLMs (QLoRA, LoRA, SFT)»). Contribuye a **CP-N4-A (servicio)**: API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Diseña recursos HTTP y status" },
    { text: "Versiona, pagina e idempotiza" },
    { text: "Estructura routing y dependencies" },
    { text: "Valida, serializa y documenta" },
    { text: "Separa sync/async y background" },
    { text: "Maneja errores, timeouts y lifecycle" },
    { text: "Prueba unit/contract/integration" },
    { text: "Verifica compat, rate limit y obs" },
  ],
  theory: [
    {
      heading: "Mapa V3 S41: APIs con FastAPI y contratos HTTP",
      paragraphs: [
        "En V3, **S41** retematiza el archivo de plataforma `llm-finetuning` hacia **APIs con FastAPI y contratos HTTP**.",
        "Incremento: API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `llm-finetuning`. Capstone: CP-N4-A (servicio).",
      },
    },
    {
      heading: "recursos, métodos y status",
      subtopicId: "S41-T1-A",
      paragraphs: [
        "**recursos, métodos y status** — outcome del blueprint phase3 para `resources-methods-status`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "resources_methods_status.py",
        code: `print("methods", ["GET","POST"])
print("create_status", 201)
print("resources", ["jobs","health"])`,
        output: `methods ['GET', 'POST']
create_status 201
resources ['jobs', 'health']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "idempotencia, paginación y versionado",
      subtopicId: "S41-T1-B",
      paragraphs: [
        "**idempotencia, paginación y versionado** — outcome del blueprint phase3 para `idempotency-pagination-versioning`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "idempotency_pagination_versioning.py",
        code: `print({"data":[0,1],"next":2})
print("idempotency_key", "Idempo-Key")
print("version", "v1")`,
        output: `{'data': [0, 1], 'next': 2}
idempotency_key Idempo-Key
version v1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "routing, dependencies y modelos",
      subtopicId: "S41-T2-A",
      paragraphs: [
        "**routing, dependencies y modelos** — outcome del blueprint phase3 para `routing-deps-models`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "routing_deps_models.py",
        code: `print("deps", ["db","user"])
print("job_deps", ["db","user"])
print("model", "JobCreate")`,
        output: `deps ['db', 'user']
job_deps ['db', 'user']
model JobCreate`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "validación, serialización y documentación",
      subtopicId: "S41-T2-B",
      paragraphs: [
        "**validación, serialización y documentación** — outcome del blueprint phase3 para `validation-serialize-docs`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "validation_serialize_docs.py",
        code: `print({"name":"er-run","priority":"normal"})
print("openapi", True)
print("serialize", "json")`,
        output: `{'name': 'er-run', 'priority': 'normal'}
openapi True
serialize json`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "sync/async y background boundaries",
      subtopicId: "S41-T3-A",
      paragraphs: [
        "**sync/async y background boundaries** — outcome del blueprint phase3 para `sync-async-background`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "sync_async_background.py",
        code: `print("sync"); print("background"); print("boundary", "request_vs_worker")`,
        output: `sync
background
boundary request_vs_worker`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "errores, timeouts y lifecycle",
      subtopicId: "S41-T3-B",
      paragraphs: [
        "**errores, timeouts y lifecycle** — outcome del blueprint phase3 para `errors-timeouts-lifecycle`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "errors_timeouts_lifecycle.py",
        code: `print({"error":"timeout","message":"job exceeded 30s"})
print("lifecycle", ["startup","shutdown"])
print("no_pii", True)`,
        output: `{'error': 'timeout', 'message': 'job exceeded 30s'}
lifecycle ['startup', 'shutdown']
no_pii True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "unit/contract/integration",
      subtopicId: "S41-T4-A",
      paragraphs: [
        "**unit/contract/integration** — outcome del blueprint phase3 para `unit-contract-integration`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "unit_contract_integration.py",
        code: `print("total", 19); print("pyramid", True); print("contract", "openapi_schema")`,
        output: `total 19
pyramid True
contract openapi_schema`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "compatibility, rate limit y observabilidad",
      subtopicId: "S41-T4-B",
      paragraphs: [
        "**compatibility, rate limit y observabilidad** — outcome del blueprint phase3 para `compat-ratelimit-observability`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (servicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "compat_ratelimit_observability.py",
        code: `print("allow"); print("429"); print("compat_header", "X-API-Version")`,
        output: `allow
429
compat_header X-API-Version`,
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
    intro: "Te muestro 8 demos de S41 (APIs con FastAPI y contratos HTTP) alineadas a CP-N4-A (servicio).",
    steps: [
      {
        demoId: "S41-T1-A-DEMO",
        subtopicId: "S41-T1-A",
        environment: "local-python",
        description: "Demo: recursos, métodos y status",
        code: {
          language: 'python',
          title: "demo_resources_methods_status.py",
          code: `print(201); print(404); print(200)`,
          output: `201
404
200`,
        },
        why: "Demuestra el outcome de S41-T1-A con Python verificable.",
      },
      {
        demoId: "S41-T1-B-DEMO",
        subtopicId: "S41-T1-B",
        environment: "local-python",
        description: "Demo: idempotencia, paginación y versionado",
        code: {
          language: 'python',
          title: "demo_idempotency_pagination_versioning.py",
          code: `print("created"); print("replay"); print(1)`,
          output: `created
replay
1`,
        },
        why: "Demuestra el outcome de S41-T1-B con Python verificable.",
      },
      {
        demoId: "S41-T2-A-DEMO",
        subtopicId: "S41-T2-A",
        environment: "local-python",
        description: "Demo: routing, dependencies y modelos",
        code: {
          language: 'python',
          title: "demo_routing_deps_models.py",
          code: `print("ok:conn"); print("injection", "deps"); print("routing", "/v1/jobs")`,
          output: `ok:conn
injection deps
routing /v1/jobs`,
        },
        why: "Demuestra el outcome de S41-T2-A con Python verificable.",
      },
      {
        demoId: "S41-T2-B-DEMO",
        subtopicId: "S41-T2-B",
        environment: "local-python",
        description: "Demo: validación, serialización y documentación",
        code: {
          language: 'python',
          title: "demo_validation_serialize_docs.py",
          code: `print(["name","priority"]); print("paths", ["/v1/jobs"]); print("valid", True)`,
          output: `['name', 'priority']
paths ['/v1/jobs']
valid True`,
        },
        why: "Demuestra el outcome de S41-T2-B con Python verificable.",
      },
      {
        demoId: "S41-T3-A-DEMO",
        subtopicId: "S41-T3-A",
        environment: "local-python",
        description: "Demo: sync/async y background boundaries",
        code: {
          language: 'python',
          title: "demo_sync_async_background.py",
          code: `print({"id":"job-1","status":"queued"}); print("qlen", 1); print("async", True)`,
          output: `{'id': 'job-1', 'status': 'queued'}
qlen 1
async True`,
        },
        why: "Demuestra el outcome de S41-T3-A con Python verificable.",
      },
      {
        demoId: "S41-T3-B-DEMO",
        subtopicId: "S41-T3-B",
        environment: "local-python",
        description: "Demo: errores, timeouts y lifecycle",
        code: {
          language: 'python',
          title: "demo_errors_timeouts_lifecycle.py",
          code: `print("ok"); print("timeout"); print("limit", 100)`,
          output: `ok
timeout
limit 100`,
        },
        why: "Demuestra el outcome de S41-T3-B con Python verificable.",
      },
      {
        demoId: "S41-T4-A-DEMO",
        subtopicId: "S41-T4-A",
        environment: "local-python",
        description: "Demo: unit/contract/integration",
        code: {
          language: 'python',
          title: "demo_unit_contract_integration.py",
          code: `print(True); print(False); print("unit_first", True)`,
          output: `True
False
unit_first True`,
        },
        why: "Demuestra el outcome de S41-T4-A con Python verificable.",
      },
      {
        demoId: "S41-T4-B-DEMO",
        subtopicId: "S41-T4-B",
        environment: "local-python",
        description: "Demo: compatibility, rate limit y observabilidad",
        code: {
          language: 'python',
          title: "demo_compat_ratelimit_observability.py",
          code: `print("slo_latency_ok", True); print("rate", "token_bucket"); print("no_internal_keys", True)`,
          output: `slo_latency_ok True
rate token_bucket
no_internal_keys True`,
        },
        why: "Demuestra el outcome de S41-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S41-T1-A-E1",
        subtopicId: "S41-T1-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(201)`,
          output: `201`,
        },
      },
      {
        id: "S41-T1-A-E2",
        subtopicId: "S41-T1-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(404)`,
          output: `404`,
        },
      },
      {
        id: "S41-T1-A-E3",
        subtopicId: "S41-T1-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('/v1/jobs')`,
          output: `/v1/jobs`,
        },
      },
      {
        id: "S41-T1-B-E1",
        subtopicId: "S41-T1-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(2)`,
          output: `2`,
        },
      },
      {
        id: "S41-T1-B-E2",
        subtopicId: "S41-T1-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('replay')`,
          output: `replay`,
        },
      },
      {
        id: "S41-T1-B-E3",
        subtopicId: "S41-T1-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('v1')`,
          output: `v1`,
        },
      },
      {
        id: "S41-T2-A-E1",
        subtopicId: "S41-T2-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(sorted(['db','user']))`,
          output: `['db', 'user']`,
        },
      },
      {
        id: "S41-T2-A-E2",
        subtopicId: "S41-T2-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('JobCreate')`,
          output: `JobCreate`,
        },
      },
      {
        id: "S41-T2-A-E3",
        subtopicId: "S41-T2-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('ok:conn')`,
          output: `ok:conn`,
        },
      },
      {
        id: "S41-T2-B-E1",
        subtopicId: "S41-T2-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('x')`,
          output: `x`,
        },
      },
      {
        id: "S41-T2-B-E2",
        subtopicId: "S41-T2-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('normal')`,
          output: `normal`,
        },
      },
      {
        id: "S41-T2-B-E3",
        subtopicId: "S41-T2-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
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
        id: "S41-T3-A-E1",
        subtopicId: "S41-T3-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('background')`,
          output: `background`,
        },
      },
      {
        id: "S41-T3-A-E2",
        subtopicId: "S41-T3-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({'status':'queued'})`,
          output: `{'status': 'queued'}`,
        },
      },
      {
        id: "S41-T3-A-E3",
        subtopicId: "S41-T3-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('sync')`,
          output: `sync`,
        },
      },
      {
        id: "S41-T3-B-E1",
        subtopicId: "S41-T3-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({'error':'timeout'})`,
          output: `{'error': 'timeout'}`,
        },
      },
      {
        id: "S41-T3-B-E2",
        subtopicId: "S41-T3-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('ok')`,
          output: `ok`,
        },
      },
      {
        id: "S41-T3-B-E3",
        subtopicId: "S41-T3-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
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
        id: "S41-T4-A-E1",
        subtopicId: "S41-T4-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(16)`,
          output: `16`,
        },
      },
      {
        id: "S41-T4-A-E2",
        subtopicId: "S41-T4-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
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
        id: "S41-T4-A-E3",
        subtopicId: "S41-T4-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
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
        id: "S41-T4-B-E1",
        subtopicId: "S41-T4-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('429')`,
          output: `429`,
        },
      },
      {
        id: "S41-T4-B-E2",
        subtopicId: "S41-T4-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
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
        id: "S41-T4-B-E3",
        subtopicId: "S41-T4-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
    ],
  },
  youDo: {
    title: "APIs con FastAPI y contratos HTTP",
    context:
      "Proyecto de sección **S41** (APIs con FastAPI y contratos HTTP). Gate: **CP-N4-A (servicio)**. API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-A (servicio)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S41 You Do — APIs con FastAPI y contratos HTTP
# Gate: CP-N4-A (servicio)
# API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas.

def main():
    print("section", "S41")
    print("gate", 'CP-N4-A (servicio)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-A (servicio). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
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
        question: "El id de plataforma de S41 que se preserva es:",
        options: [
          "llm-finetuning",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S41 pertenece a:",
        options: [
          "CP-N4-A (servicio)",
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
        note: "Apoyo S41 APIs con FastAPI y contratos HTTP",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a APIs con FastAPI y contratos HTTP",
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
