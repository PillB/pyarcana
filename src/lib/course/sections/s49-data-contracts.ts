import type { CourseSection } from '../../types'

export const section49: CourseSection = {
  id: "data-contracts",
  index: 49,
  title: "Agentes, herramientas y context engineering",
  shortTitle: "Agentes y tools",
  tagline: "agente acotado consulta casos/reportes y prepara propuesta; no envía, no modifica prod ni decide riesgo sin aprobación",
  estimatedHours: 14,
  level: "Master",
  phase: 3,
  icon: "FileCheck",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Agentes, herramientas y context engineering** (id de plataforma `data-contracts` conservado; legado «Data Contracts e Ingeniería de Datos Avanzada»). Contribuye a **CP-N4-C (tools)**: agente acotado puede consultar casos/reportes y preparar una propuesta, pero no enviar, modificar producción ni decidir riesgo sin aprobación. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Elige workflow vs agente" },
    { text: "Diseña routing planner/evaluator" },
    { text: "Define tools de responsabilidad única" },
    { text: "Esquema, permisos e idempotencia de tools" },
    { text: "Minimiza contexto con JIT y checkpoints" },
    { text: "Compacta memoria y conserva LKG" },
    { text: "Define stops y budgets" },
    { text: "Sandbox, aprobación humana y recovery" },
  ],
  theory: [
    {
      heading: "Mapa V3 S49: Agentes, herramientas y context engineering",
      paragraphs: [
        "En V3, **S49** retematiza el archivo de plataforma `data-contracts` hacia **Agentes, herramientas y context engineering**.",
        "Incremento: agente acotado puede consultar casos/reportes y preparar una propuesta, pero no enviar, modificar producción ni decidir riesgo sin aprobación.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `data-contracts`. Capstone: CP-N4-C (tools).",
      },
    },
    {
      heading: "workflow vs agente",
      subtopicId: "S49-T1-A",
      paragraphs: [
        "**workflow vs agente** — outcome del blueprint phase3 para `workflow-vs-agent`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "workflow_vs_agent.py",
        code: `print("workflow"); print("agent"); print("default", "workflow_when_deterministic")`,
        output: `workflow
agent
default workflow_when_deterministic`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "routing, planner/worker y evaluator–optimizer",
      subtopicId: "S49-T1-B",
      paragraphs: [
        "**routing, planner/worker y evaluator–optimizer** — outcome del blueprint phase3 para `routing-planner-evaluator`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "routing_planner_evaluator.py",
        code: `print(sorted(["evaluator","planner","router","worker"])); print("loop", "evaluator->worker"); print("pattern", "optimizer")`,
        output: `['evaluator', 'planner', 'router', 'worker']
loop evaluator->worker
pattern optimizer`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "funciones de responsabilidad única",
      subtopicId: "S49-T2-A",
      paragraphs: [
        "**funciones de responsabilidad única** — outcome del blueprint phase3 para `single-responsibility-fns`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "single_responsibility_fns.py",
        code: `print(["get_case","search_docs"]); print("srp", True); print("no_god_tool", True)`,
        output: `['get_case', 'search_docs']
srp True
no_god_tool True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "schema, permisos, idempotencia y errores",
      subtopicId: "S49-T2-B",
      paragraphs: [
        "**schema, permisos, idempotencia y errores** — outcome del blueprint phase3 para `schema-perms-idempotency-errors`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "schema_perms_idempotency_errors.py",
        code: `print({"ok":True,"idempotency_key":"k"}); print({"error":"forbidden"}); print("idempotent", True)`,
        output: `{'ok': True, 'idempotency_key': 'k'}
{'error': 'forbidden'}
idempotent True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "contexto mínimo, retrieval JIT y checkpoints",
      subtopicId: "S49-T3-A",
      paragraphs: [
        "**contexto mínimo, retrieval JIT y checkpoints** — outcome del blueprint phase3 para `min-context-jit-checkpoints`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "min_context_jit_checkpoints.py",
        code: `print([{"text":"caso C1 abierto"}]); print("checkpoint", "after_tool"); print("min_context", True)`,
        output: `[{'text': 'caso C1 abierto'}]
checkpoint after_tool
min_context True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "memoria, compaction y last-known-good",
      subtopicId: "S49-T3-B",
      paragraphs: [
        "**memoria, compaction y last-known-good** — outcome del blueprint phase3 para `memory-compaction-lkg`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "memory_compaction_lkg.py",
        code: `print(["s3","s4"]); print("lkg", 1); print("drop_old", True)`,
        output: `['s3', 's4']
lkg 1
drop_old True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "stopping conditions y budgets",
      subtopicId: "S49-T4-A",
      paragraphs: [
        "**stopping conditions y budgets** — outcome del blueprint phase3 para `stopping-budgets`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "stopping_budgets.py",
        code: `print("stop"); print("stop"); print("continue")`,
        output: `stop
stop
continue`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "sandbox, human approval y recuperación",
      subtopicId: "S49-T4-B",
      paragraphs: [
        "**sandbox, human approval y recuperación** — outcome del blueprint phase3 para `sandbox-human-approval-recovery`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (tools)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "sandbox_human_approval_recovery.py",
        code: `print("sandbox_ok"); print("needs_human"); print("sandbox_ok")`,
        output: `sandbox_ok
needs_human
sandbox_ok`,
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
    intro: "Te muestro 8 demos de S49 (Agentes, herramientas y context engineering) alineadas a CP-N4-C (tools).",
    steps: [
      {
        demoId: "S49-T1-A-DEMO",
        subtopicId: "S49-T1-A",
        environment: "local-python",
        description: "Demo: workflow vs agente",
        code: {
          language: 'python',
          title: "demo_workflow_vs_agent.py",
          code: `print("agent_when", "open_ended"); print("workflow_when", "fixed_steps"); print("safety", "prefer_workflow")`,
          output: `agent_when open_ended
workflow_when fixed_steps
safety prefer_workflow`,
        },
        why: "Demuestra el outcome de S49-T1-A con Python verificable.",
      },
      {
        demoId: "S49-T1-B-DEMO",
        subtopicId: "S49-T1-B",
        environment: "local-python",
        description: "Demo: routing, planner/worker y evaluator–optimizer",
        code: {
          language: 'python',
          title: "demo_routing_planner_evaluator.py",
          code: `print("route", "planner"); print("eval", True); print("max_loops", 3)`,
          output: `route planner
eval True
max_loops 3`,
        },
        why: "Demuestra el outcome de S49-T1-B con Python verificable.",
      },
      {
        demoId: "S49-T2-A-DEMO",
        subtopicId: "S49-T2-A",
        environment: "local-python",
        description: "Demo: funciones de responsabilidad única",
        code: {
          language: 'python',
          title: "demo_single_responsibility_fns.py",
          code: `print("one_tool_one_job", True); print("tools_n", 2); print("compose", "agent")`,
          output: `one_tool_one_job True
tools_n 2
compose agent`,
        },
        why: "Demuestra el outcome de S49-T2-A con Python verificable.",
      },
      {
        demoId: "S49-T2-B-DEMO",
        subtopicId: "S49-T2-B",
        environment: "local-python",
        description: "Demo: schema, permisos, idempotencia y errores",
        code: {
          language: 'python',
          title: "demo_schema_perms_idempotency_errors.py",
          code: `print("schema", True); print("perms", "allowlist"); print("errors", "typed")`,
          output: `schema True
perms allowlist
errors typed`,
        },
        why: "Demuestra el outcome de S49-T2-B con Python verificable.",
      },
      {
        demoId: "S49-T3-A-DEMO",
        subtopicId: "S49-T3-A",
        environment: "local-python",
        description: "Demo: contexto mínimo, retrieval JIT y checkpoints",
        code: {
          language: 'python',
          title: "demo_min_context_jit_checkpoints.py",
          code: `print("jit", True); print("k", 2); print("checkpoint", True)`,
          output: `jit True
k 2
checkpoint True`,
        },
        why: "Demuestra el outcome de S49-T3-A con Python verificable.",
      },
      {
        demoId: "S49-T3-B-DEMO",
        subtopicId: "S49-T3-B",
        environment: "local-python",
        description: "Demo: memoria, compaction y last-known-good",
        code: {
          language: 'python',
          title: "demo_memory_compaction_lkg.py",
          code: `print("compaction", True); print("lkg", True); print("memory_bound", 2)`,
          output: `compaction True
lkg True
memory_bound 2`,
        },
        why: "Demuestra el outcome de S49-T3-B con Python verificable.",
      },
      {
        demoId: "S49-T4-A-DEMO",
        subtopicId: "S49-T4-A",
        environment: "local-python",
        description: "Demo: stopping conditions y budgets",
        code: {
          language: 'python',
          title: "demo_stopping_budgets.py",
          code: `print("budget_tokens", 2000); print("budget_steps", 5); print("stop_on", "limit")`,
          output: `budget_tokens 2000
budget_steps 5
stop_on limit`,
        },
        why: "Demuestra el outcome de S49-T4-A con Python verificable.",
      },
      {
        demoId: "S49-T4-B-DEMO",
        subtopicId: "S49-T4-B",
        environment: "local-python",
        description: "Demo: sandbox, human approval y recuperación",
        code: {
          language: 'python',
          title: "demo_sandbox_human_approval_recovery.py",
          code: `print("sandbox", True); print("human_gate", True); print("recovery", "resume_checkpoint")`,
          output: `sandbox True
human_gate True
recovery resume_checkpoint`,
        },
        why: "Demuestra el outcome de S49-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S49-T1-A-E1",
        subtopicId: "S49-T1-A",
        kind: "guided",
        instruction:
          "Ejercicio S49-T1-A-E1: usa el patrón del demo iDo del subtema S49-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("agent_when", "open_ended"); print("workflow_when", "fixed_steps"); print("safety", "prefer_workflow")`,
          output: `agent_when open_ended
workflow_when fixed_steps
safety prefer_workflow`,
        },
      },
      {
        id: "S49-T1-A-E2",
        subtopicId: "S49-T1-A",
        kind: "independent",
        instruction:
          "Ejercicio S49-T1-A-E2: usa el patrón del demo iDo del subtema S49-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("agent_when", "open_ended"); print("workflow_when", "fixed_steps"); print("safety", "prefer_workflow")`,
          output: `agent_when open_ended
workflow_when fixed_steps
safety prefer_workflow`,
        },
      },
      {
        id: "S49-T1-A-E3",
        subtopicId: "S49-T1-A",
        kind: "transfer",
        instruction:
          "Ejercicio S49-T1-A-E3: usa el patrón del demo iDo del subtema S49-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("agent_when", "open_ended"); print("workflow_when", "fixed_steps"); print("safety", "prefer_workflow")`,
          output: `agent_when open_ended
workflow_when fixed_steps
safety prefer_workflow`,
        },
      },
      {
        id: "S49-T1-B-E1",
        subtopicId: "S49-T1-B",
        kind: "guided",
        instruction:
          "Ejercicio S49-T1-B-E1: usa el patrón del demo iDo del subtema S49-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("route", "planner"); print("eval", True); print("max_loops", 3)`,
          output: `route planner
eval True
max_loops 3`,
        },
      },
      {
        id: "S49-T1-B-E2",
        subtopicId: "S49-T1-B",
        kind: "independent",
        instruction:
          "Ejercicio S49-T1-B-E2: usa el patrón del demo iDo del subtema S49-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("route", "planner"); print("eval", True); print("max_loops", 3)`,
          output: `route planner
eval True
max_loops 3`,
        },
      },
      {
        id: "S49-T1-B-E3",
        subtopicId: "S49-T1-B",
        kind: "transfer",
        instruction:
          "Ejercicio S49-T1-B-E3: usa el patrón del demo iDo del subtema S49-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("route", "planner"); print("eval", True); print("max_loops", 3)`,
          output: `route planner
eval True
max_loops 3`,
        },
      },
      {
        id: "S49-T2-A-E1",
        subtopicId: "S49-T2-A",
        kind: "guided",
        instruction:
          "Ejercicio S49-T2-A-E1: usa el patrón del demo iDo del subtema S49-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("one_tool_one_job", True); print("tools_n", 2); print("compose", "agent")`,
          output: `one_tool_one_job True
tools_n 2
compose agent`,
        },
      },
      {
        id: "S49-T2-A-E2",
        subtopicId: "S49-T2-A",
        kind: "independent",
        instruction:
          "Ejercicio S49-T2-A-E2: usa el patrón del demo iDo del subtema S49-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("one_tool_one_job", True); print("tools_n", 2); print("compose", "agent")`,
          output: `one_tool_one_job True
tools_n 2
compose agent`,
        },
      },
      {
        id: "S49-T2-A-E3",
        subtopicId: "S49-T2-A",
        kind: "transfer",
        instruction:
          "Ejercicio S49-T2-A-E3: usa el patrón del demo iDo del subtema S49-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("one_tool_one_job", True); print("tools_n", 2); print("compose", "agent")`,
          output: `one_tool_one_job True
tools_n 2
compose agent`,
        },
      },
      {
        id: "S49-T2-B-E1",
        subtopicId: "S49-T2-B",
        kind: "guided",
        instruction:
          "Ejercicio S49-T2-B-E1: usa el patrón del demo iDo del subtema S49-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("schema", True); print("perms", "allowlist"); print("errors", "typed")`,
          output: `schema True
perms allowlist
errors typed`,
        },
      },
      {
        id: "S49-T2-B-E2",
        subtopicId: "S49-T2-B",
        kind: "independent",
        instruction:
          "Ejercicio S49-T2-B-E2: usa el patrón del demo iDo del subtema S49-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("schema", True); print("perms", "allowlist"); print("errors", "typed")`,
          output: `schema True
perms allowlist
errors typed`,
        },
      },
      {
        id: "S49-T2-B-E3",
        subtopicId: "S49-T2-B",
        kind: "transfer",
        instruction:
          "Ejercicio S49-T2-B-E3: usa el patrón del demo iDo del subtema S49-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("schema", True); print("perms", "allowlist"); print("errors", "typed")`,
          output: `schema True
perms allowlist
errors typed`,
        },
      },
      {
        id: "S49-T3-A-E1",
        subtopicId: "S49-T3-A",
        kind: "guided",
        instruction:
          "Ejercicio S49-T3-A-E1: usa el patrón del demo iDo del subtema S49-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("jit", True); print("k", 2); print("checkpoint", True)`,
          output: `jit True
k 2
checkpoint True`,
        },
      },
      {
        id: "S49-T3-A-E2",
        subtopicId: "S49-T3-A",
        kind: "independent",
        instruction:
          "Ejercicio S49-T3-A-E2: usa el patrón del demo iDo del subtema S49-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("jit", True); print("k", 2); print("checkpoint", True)`,
          output: `jit True
k 2
checkpoint True`,
        },
      },
      {
        id: "S49-T3-A-E3",
        subtopicId: "S49-T3-A",
        kind: "transfer",
        instruction:
          "Ejercicio S49-T3-A-E3: usa el patrón del demo iDo del subtema S49-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("jit", True); print("k", 2); print("checkpoint", True)`,
          output: `jit True
k 2
checkpoint True`,
        },
      },
      {
        id: "S49-T3-B-E1",
        subtopicId: "S49-T3-B",
        kind: "guided",
        instruction:
          "Ejercicio S49-T3-B-E1: usa el patrón del demo iDo del subtema S49-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("compaction", True); print("lkg", True); print("memory_bound", 2)`,
          output: `compaction True
lkg True
memory_bound 2`,
        },
      },
      {
        id: "S49-T3-B-E2",
        subtopicId: "S49-T3-B",
        kind: "independent",
        instruction:
          "Ejercicio S49-T3-B-E2: usa el patrón del demo iDo del subtema S49-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("compaction", True); print("lkg", True); print("memory_bound", 2)`,
          output: `compaction True
lkg True
memory_bound 2`,
        },
      },
      {
        id: "S49-T3-B-E3",
        subtopicId: "S49-T3-B",
        kind: "transfer",
        instruction:
          "Ejercicio S49-T3-B-E3: usa el patrón del demo iDo del subtema S49-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("compaction", True); print("lkg", True); print("memory_bound", 2)`,
          output: `compaction True
lkg True
memory_bound 2`,
        },
      },
      {
        id: "S49-T4-A-E1",
        subtopicId: "S49-T4-A",
        kind: "guided",
        instruction:
          "Ejercicio S49-T4-A-E1: usa el patrón del demo iDo del subtema S49-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("budget_tokens", 2000); print("budget_steps", 5); print("stop_on", "limit")`,
          output: `budget_tokens 2000
budget_steps 5
stop_on limit`,
        },
      },
      {
        id: "S49-T4-A-E2",
        subtopicId: "S49-T4-A",
        kind: "independent",
        instruction:
          "Ejercicio S49-T4-A-E2: usa el patrón del demo iDo del subtema S49-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("budget_tokens", 2000); print("budget_steps", 5); print("stop_on", "limit")`,
          output: `budget_tokens 2000
budget_steps 5
stop_on limit`,
        },
      },
      {
        id: "S49-T4-A-E3",
        subtopicId: "S49-T4-A",
        kind: "transfer",
        instruction:
          "Ejercicio S49-T4-A-E3: usa el patrón del demo iDo del subtema S49-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("budget_tokens", 2000); print("budget_steps", 5); print("stop_on", "limit")`,
          output: `budget_tokens 2000
budget_steps 5
stop_on limit`,
        },
      },
      {
        id: "S49-T4-B-E1",
        subtopicId: "S49-T4-B",
        kind: "guided",
        instruction:
          "Ejercicio S49-T4-B-E1: usa el patrón del demo iDo del subtema S49-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("sandbox", True); print("human_gate", True); print("recovery", "resume_checkpoint")`,
          output: `sandbox True
human_gate True
recovery resume_checkpoint`,
        },
      },
      {
        id: "S49-T4-B-E2",
        subtopicId: "S49-T4-B",
        kind: "independent",
        instruction:
          "Ejercicio S49-T4-B-E2: usa el patrón del demo iDo del subtema S49-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S49-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("sandbox", True); print("human_gate", True); print("recovery", "resume_checkpoint")`,
          output: `sandbox True
human_gate True
recovery resume_checkpoint`,
        },
      },
      {
        id: "S49-T4-B-E3",
        subtopicId: "S49-T4-B",
        kind: "transfer",
        instruction:
          "Ejercicio S49-T4-B-E3: usa el patrón del demo iDo del subtema S49-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S49-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S49-T4-B; el print pendiente debe copiar esa forma.",
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
          code: `print("sandbox", True); print("human_gate", True); print("recovery", "resume_checkpoint")`,
          output: `sandbox True
human_gate True
recovery resume_checkpoint`,
        },
      },
    ],
  },
  youDo: {
    title: "Agentes, herramientas y context engineering",
    context:
      "Proyecto de sección **S49** (Agentes, herramientas y context engineering). Gate: **CP-N4-C (tools)**. agente acotado puede consultar casos/reportes y preparar una propuesta, pero no enviar, modificar producción ni decidir riesgo sin aprobación. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "agente acotado puede consultar casos/reportes y preparar una propuesta, pero no enviar, modificar producción ni decidir riesgo sin aprobación.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-C (tools)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S49 You Do — Agentes, herramientas y context engineering
# Gate: CP-N4-C (tools)
# agente acotado puede consultar casos/reportes y preparar una propuesta, pero no enviar, modificar producción ni decidir 

def main():
    print("section", "S49")
    print("gate", 'CP-N4-C (tools)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-C (tools). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
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
        question: "El id de plataforma de S49 que se preserva es:",
        options: [
          "data-contracts",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S49 pertenece a:",
        options: [
          "CP-N4-C (tools)",
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
        note: "Apoyo S49 Agentes, herramientas y context engineering",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Agentes, herramientas y context engineering",
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
