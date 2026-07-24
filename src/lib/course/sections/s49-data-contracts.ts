import type { CourseSection } from '../../types'

export const section49: CourseSection = {
  id: "data-contracts",
  index: 49,
  title: "Agentes, herramientas y context engineering",
  shortTitle: "Agentes y tools",
  tagline: "agente acotado consulta casos/reportes y prepara propuesta; no envía, no modifica prod ni decide riesgo sin aprobación",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "FileCheck",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **agentes, herramientas y context engineering** orquestan pasos con tools de scope mínimo, presupuestos y checkpoints. Se promueve solo cuando el agente no supera baseline en tareas conocidas sin plan evaluado, y los side effects exigen approval. Id legacy `data-contracts` se conserva; el path V3 es agentes/tools (no solo contratos de tablas).",
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
      heading: "Ruta de S49: Agentes, herramientas y context engineering",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Workflow vs agente:** pasos conocidos vs decisiones acotadas con evaluator. **Planner/worker/evaluator:** descomponer, ejecutar, verificar. **Tool de responsabilidad única:** un efecto bien tipado. **Idempotencia de tool:** misma key ⇒ un solo side effect. **Context mínimo / JIT retrieval:** solo lo necesario, justo a tiempo. **Checkpoint / LKG:** last-known-good para recovery. **Budget:** max_steps y max_cost. **Sandbox + human approval:** sin red/prod/riesgo sin aprobación explícita.",
        "Esta sección extiende RAG (S48) con **agentes y tools**: planes acotados, scopes, context windows y costos. Demos stdlib (contadores, sets) sin frameworks de agentes reales. El caso `CASO-AYA-049` (Ayacucho sintético) no ejecuta tools de red abiertas ni PII.",
        "Producto incremental: propuesta de plan + tool calls auditables. Entrada: goal, tools con scope, max_steps/cost y evaluator. Salida: plan ≤ límites, effects=1 por tool idempotente, network closed sin approval. Error de promoción: éxito sin known_steps, side_effect multi-responsabilidad o replay de effects.",
        "Orden: T1 baseline vs agente → T2 tools/scope → T3 context/checkpoint → T4 cost/network/approval. Teoría medible, iDo con helpers, weDo con defecto agentic por ejercicio. Id legacy no limita a data contracts tabulares; V3 es agent tool-use gobernado. Stack didáctico: **stdlib** sin frameworks de agentes ni red abierta.",
      ],
      code: {
        language: 'python',
        title: "s49_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-AYA-049",
        "gates": ["single_responsibility_tools", "idempotent_effects", "budget_stop", "human_approval_sensitive"],
        "tabular_contracts_only_topic": False,
        "prod_side_effect_without_approval_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("tabular_contracts_only_topic", c["tabular_contracts_only_topic"])
print("prod_side_effect_without_approval_ok", c["prod_side_effect_without_approval_ok"])
`,
        output: `case CASO-AYA-049
tabular_contracts_only_topic False
prod_side_effect_without_approval_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-C · agente acotado con aprobación humana: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "workflow vs agente",
      subtopicId: "S49-T1-A",
      paragraphs: [
        "Usa **workflow** cuando pasos y ramas son conocidos y deterministas; reserva **agente** solo para decisiones acotadas con beneficio medible frente a un baseline y salida verificable por un evaluator. Un agente abierto sin presupuesto ni tools de responsabilidad única no es «más inteligente»: es un riesgo de side effects.",
        "Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto (`max_steps`/`max_cost`). Salida de este subtema: ADR workflow/agente con baseline documentado. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de éxito: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible (red/prod/riesgo).",
        "Aplicación de `workflow vs agente` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es ADR que elige `workflow` cuando el path es determinista. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "workflow_vs_agent.py",
        code: `def choose_mode(deterministic: bool) -> str:
    return "workflow" if deterministic else "agent"

print(choose_mode(True))
print(choose_mode(False))
print("default", "workflow_when_deterministic")`,
        output: `workflow
agent
default workflow_when_deterministic`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S49-T1-A: ADR workflow/agente con baseline. Si falta, responde `KEEP_DETERMINISTIC_WORKFLOW`; si no alcanza para decidir, `RUN_AGENT_BASELINE`.",
      },
    },
    {
      heading: "routing, planner/worker y evaluator–optimizer",
      subtopicId: "S49-T1-B",
      paragraphs: [
        "Router elige ruta, planner descompone, worker ejecuta y evaluator critica; límites evitan un ciclo abierto entre roles.",
        "Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: trayectoria con roles y máximo de iteraciones. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de éxito: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
        "Aplicación de `routing, planner/worker y evaluator–optimizer` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es trayectoria con roles y máximo de iteraciones. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "routing_planner_evaluator.py",
        code: `def agent_roles() -> list:
    return sorted(["evaluator", "planner", "router", "worker"])

print(agent_roles())
print("loop", "evaluator->worker")
print("pattern", "optimizer")`,
        output: `['evaluator', 'planner', 'router', 'worker']
loop evaluator->worker
pattern optimizer`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S49-T1-B, audita trayectoria con roles y máximo de iteraciones. Un breach activa `STOP_AGENT_LOOP` y una ausencia activa `REPLAN_WITH_BOUNDS`.",
      },
    },
    {
      heading: "funciones de responsabilidad única",
      subtopicId: "S49-T2-A",
      paragraphs: [
        "Una tool hace una sola cosa observable, usa schema estrecho y devuelve error tipado; descripción no concede autoridad.",
        "Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: tool contract con casos válidos/inválidos. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de éxito: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
        "Aplicación de `funciones de responsabilidad única` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es tool contract con casos válidos/inválidos. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "single_responsibility_fns.py",
        code: `def srp_tools(names: list) -> list:
    return list(names)

print(srp_tools(["get_case", "search_docs"]))
print("srp", True)
print("no_god_tool", True)`,
        output: `['get_case', 'search_docs']
srp True
no_god_tool True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S49-T2-A conserva tool contract con casos válidos/inválidos; no conviertas `DISABLE_OVERBROAD_TOOL` ni `SPLIT_TOOL_CONTRACT` en éxito silencioso.",
      },
    },
    {
      heading: "schema, permisos, idempotencia y errores",
      subtopicId: "S49-T2-B",
      paragraphs: [
        "Permisos se verifican en ejecución, idempotency key protege retries y errores separan retryable/terminal sin filtrar secretos.",
        "Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: replay y denegación de tool probados. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de éxito: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
        "Aplicación de `schema, permisos, idempotencia y errores` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es replay y denegación de tool probados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "schema_perms_idempotency_errors.py",
        code: `def tool_call(allowed: bool, key: str) -> dict:
    if not allowed:
        return {"error": "forbidden"}
    return {"ok": True, "idempotency_key": key}

print(tool_call(True, "k"))
print(tool_call(False, "k"))
print("idempotent", True)`,
        output: `{'ok': True, 'idempotency_key': 'k'}
{'error': 'forbidden'}
idempotent True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S49-T2-B: demuestra replay y denegación de tool probados. Falla cerrada con `DENY_TOOL_CALL` y deriva incertidumbre mediante `CLASSIFY_TOOL_ERROR`.",
      },
    },
    {
      heading: "contexto mínimo, retrieval JIT y checkpoints",
      subtopicId: "S49-T3-A",
      paragraphs: [
        "Contexto mínimo reduce costo y fuga; retrieval just-in-time aporta evidencia y checkpoints guardan estado tras efectos durables.",
        "Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: reanudación desde checkpoint consistente. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de éxito: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
        "Aplicación de `contexto mínimo, retrieval JIT y checkpoints` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es reanudación desde checkpoint consistente. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "min_context_jit_checkpoints.py",
        code: `def min_context(facts: list) -> list:
    return [{"text": t} for t in facts]

print(min_context(["caso C1 abierto"]))
print("checkpoint", "after_tool")
print("min_context", True)`,
        output: `[{'text': 'caso C1 abierto'}]
checkpoint after_tool
min_context True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S49-T3-A, el artefacto comprobable es reanudación desde checkpoint consistente. Sin él corresponde `COMPACT_AND_CHECKPOINT` o, si faltan datos, `RETRIEVE_MINIMUM_CONTEXT`.",
      },
    },
    {
      heading: "memoria, compaction y last-known-good",
      subtopicId: "S49-T3-B",
      paragraphs: [
        "Memoria tiene propósito/retención; compaction conserva hechos y decisiones con provenance, y last-known-good permite volver a estado seguro.",
        "Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: compaction no pierde restricción crítica. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de éxito: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
        "Aplicación de `memoria, compaction y last-known-good` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es compaction no pierde restricción crítica. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "memory_compaction_lkg.py",
        code: `def compact(steps: list, keep: int) -> tuple:
    return steps[-keep:], 1, True

kept, lkg, drop = compact(["s1", "s2", "s3", "s4"], 2)
print(kept)
print("lkg", lkg)
print("drop_old", drop)`,
        output: `['s3', 's4']
lkg 1
drop_old True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S49-T3-B: prueba compaction no pierde restricción crítica y registra por separado `RESTORE_LAST_KNOWN_GOOD` (breach) y `REVIEW_COMPACTION_LOSS` (missing).",
      },
    },
    {
      heading: "stopping conditions y budgets",
      subtopicId: "S49-T4-A",
      paragraphs: [
        "Stopping conditions incluyen meta, máximo de pasos, tiempo, tokens y costo; agotamiento produce estado explícito, no continuación infinita.",
        "Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: budget exhaustion termina con razón. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de éxito: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
        "Aplicación de `stopping conditions y budgets` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es budget exhaustion termina con razón. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "stopping_budgets.py",
        code: `def step(budget_left: int, goal_met: bool) -> str:
    if goal_met or budget_left <= 0:
        return "stop"
    return "continue"

print(step(0, False))
print(step(3, True))
print(step(3, False))`,
        output: `stop
stop
continue`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S49-T4-A acepta solo budget exhaustion termina con razón; una violación produce `STOP_BUDGET_EXHAUSTED` y un registro incompleto produce `ASK_FOR_SCOPE_REDUCTION`.",
      },
    },
    {
      heading: "sandbox, human approval y recuperación",
      subtopicId: "S49-T4-B",
      paragraphs: [
        "Sandbox limita filesystem/red; acciones sensibles requieren aprobación contextual y recovery evita repetir una tool con efecto.",
        "Contrato human-in-the-loop. Entrada: nombre de tool y flag human_ok. Salida: `needs_human` si la tool es `prod_*` sin aprobación; `sandbox_ok` si es lectura. Error: enviar o mutar prod sin gate. Criterio: en Ayacucho sintético `run_tool('prod_send', False)` se detiene; search_docs no.",
        "Aplicación a `CASO-AYA-049-T4B`: el agente prepara propuesta y checkpoint; nunca envía ni cambia prod. Recovery = resume_checkpoint, no re-ejecutar side effects.",
      ],
      code: {
        language: 'python',
        title: "sandbox_human_approval_recovery.py",
        code: `def run_tool(name: str, human_ok: bool) -> str:
    if name.startswith("prod_") and not human_ok:
        return "needs_human"
    return "sandbox_ok"

print(run_tool("search_docs", False))
print(run_tool("prod_send", False))
print(run_tool("search_docs", True))`,
        output: `sandbox_ok
needs_human
sandbox_ok`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S49-T4-B: conserva acción de producción imposible sin aprobación, la evidencia de `SANDBOX_AND_STOP` y la ruta humana `REQUEST_HUMAN_APPROVAL`.",
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
          code: `def prefer(mode: str) -> str:
    return "prefer_workflow" if mode != "must_agent" else "agent_ok"

print("agent_when", "open_ended")
print("workflow_when", "fixed_steps")
print("safety", prefer("default"))`,
          output: `agent_when open_ended
workflow_when fixed_steps
safety prefer_workflow`,
        },
        why: "Hace observable `workflow vs agente` con un caso local pequeño y deja como evidencia ADR workflow/agente con baseline; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S49-T1-B-DEMO",
        subtopicId: "S49-T1-B",
        environment: "local-python",
        description: "Demo: routing, planner/worker y evaluator–optimizer",
        code: {
          language: 'python',
          title: "demo_routing_planner_evaluator.py",
          code: `def max_loops(n: int) -> int:
    return max(1, min(n, 5))

print("route", "planner")
print("eval", True)
print("max_loops", max_loops(3))`,
          output: `route planner
eval True
max_loops 3`,
        },
        why: "Hace observable `routing, planner/worker y evaluator–optimizer` con un caso local pequeño y deja como evidencia trayectoria con roles y máximo de iteraciones; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S49-T2-A-DEMO",
        subtopicId: "S49-T2-A",
        environment: "local-python",
        description: "Demo: funciones de responsabilidad única",
        code: {
          language: 'python',
          title: "demo_single_responsibility_fns.py",
          code: `def tools_n(tools: list) -> int:
    return len(tools)

print("one_tool_one_job", True)
print("tools_n", tools_n(["get_case", "search_docs"]))
print("compose", "agent")`,
          output: `one_tool_one_job True
tools_n 2
compose agent`,
        },
        why: "Hace observable `funciones de responsabilidad única` con un caso local pequeño y deja como evidencia tool contract con casos válidos/inválidos; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S49-T2-B-DEMO",
        subtopicId: "S49-T2-B",
        environment: "local-python",
        description: "Demo: schema, permisos, idempotencia y errores",
        code: {
          language: 'python',
          title: "demo_schema_perms_idempotency_errors.py",
          code: `def perms_mode(strict: bool) -> str:
    return "allowlist" if strict else "open"

print("schema", True)
print("perms", perms_mode(True))
print("errors", "typed")`,
          output: `schema True
perms allowlist
errors typed`,
        },
        why: "Hace observable `schema, permisos, idempotencia y errores` con un caso local pequeño y deja como evidencia replay y denegación de tool probados; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S49-T3-A-DEMO",
        subtopicId: "S49-T3-A",
        environment: "local-python",
        description: "Demo: contexto mínimo, retrieval JIT y checkpoints",
        code: {
          language: 'python',
          title: "demo_min_context_jit_checkpoints.py",
          code: `def top_k(items: list, k: int) -> int:
    return min(k, len(items))

print("jit", True)
print("k", top_k(["a", "b", "c"], 2))
print("checkpoint", True)`,
          output: `jit True
k 2
checkpoint True`,
        },
        why: "Hace observable `contexto mínimo, retrieval JIT y checkpoints` con un caso local pequeño y deja como evidencia reanudación desde checkpoint consistente; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S49-T3-B-DEMO",
        subtopicId: "S49-T3-B",
        environment: "local-python",
        description: "Demo: memoria, compaction y last-known-good",
        code: {
          language: 'python',
          title: "demo_memory_compaction_lkg.py",
          code: `def memory_bound(n: int) -> int:
    return max(1, n)

print("compaction", True)
print("lkg", True)
print("memory_bound", memory_bound(2))`,
          output: `compaction True
lkg True
memory_bound 2`,
        },
        why: "Hace observable `memoria, compaction y last-known-good` con un caso local pequeño y deja como evidencia compaction no pierde restricción crítica; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S49-T4-A-DEMO",
        subtopicId: "S49-T4-A",
        environment: "local-python",
        description: "Demo: stopping conditions y budgets",
        code: {
          language: 'python',
          title: "demo_stopping_budgets.py",
          code: `def budgets(tokens: int, steps: int) -> tuple:
    return tokens, steps, "limit"

t, s, stop = budgets(2000, 5)
print("budget_tokens", t)
print("budget_steps", s)
print("stop_on", stop)`,
          output: `budget_tokens 2000
budget_steps 5
stop_on limit`,
        },
        why: "Hace observable `stopping conditions y budgets` con un caso local pequeño y deja como evidencia budget exhaustion termina con razón; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S49-T4-B-DEMO",
        subtopicId: "S49-T4-B",
        environment: "local-python",
        description: "Demo: sandbox, human approval y recuperación",
        code: {
          language: 'python',
          title: "demo_sandbox_human_approval_recovery.py",
          code: `def human_gate(sensitive: bool) -> bool:
    return sensitive

print("sandbox", True)
print("human_gate", human_gate(True))
print("recovery", "resume_checkpoint")`,
          output: `sandbox True
human_gate True
recovery resume_checkpoint`,
        },
        why: "Hace observable `sandbox, human approval y recuperación` con un caso local pequeño y deja como evidencia acción de producción imposible sin aprobación; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S49 · Laboratorio Workflow de herramientas seguro y recuperable: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S49-T1-A-E1",
        subtopicId: "S49-T1-A",
        kind: "guided",
        instruction: "S49-T1-A-E1 · Calcula el contrato de `workflow vs agente` sobre `CASO-AYA-049-1A`. La entrada es el dict completo del starter; la operación debe demostrar workflow preferido cuando pasos conocidos y baseline gana. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S49-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `KEEP_DETERMINISTIC_WORKFLOW` en E2.",
        hint: "Relaciona los campos `known_steps`, `branch_count`, `tool_choice_uncertain`, `baseline_success`, `agent_success` con la regla explicada en S49-T1-A.",
        hints: [
          "Relaciona los campos `known_steps`, `branch_count`, `tool_choice_uncertain`, `baseline_success`, `agent_success` con la regla explicada en S49-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva ADR workflow/agente con baseline; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta agent_success", "fixture adverso: workflow preferido cuando pasos conocidos y baseline gana", "CASO-AYA-049-1A es sintético"],
        tests: "El fixture `CASO-AYA-049-1A` satisface un predicado de dominio real; imprime `S49-T1-A PASS` y el assert booleano pasa.",
        feedback: "S49-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa KEEP_DETERMINISTIC_WORKFLOW y por qué faltar agent_success exige RUN_AGENT_BASELINE.",
        starterCode: {
          language: 'python',
          title: "s49-t1-a-e1.py",
          code: `# CASO-LIM-049 · workflow vs agent choice
# DEFECT: PASS si known_steps False o agent>baseline (pref agent sin necesidad)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-AYA-049-1A", **{"known_steps":True,"branch_count":2,"tool_choice_uncertain":False,"baseline_success":0.96,"agent_success":0.9}}
# DEFECT: sin known_steps o agente no supera baseline
meets_contract = not record["known_steps"] or record["agent_success"] > record["baseline_success"]
status = "PASS" if meets_contract else "KEEP_DETERMINISTIC_WORKFLOW"
print("S49-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t1-a-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-1A", **{"known_steps":True,"branch_count":2,"tool_choice_uncertain":False,"baseline_success":0.96,"agent_success":0.9}}
meets_contract = record["known_steps"] and record["branch_count"] <= 3 and not record["tool_choice_uncertain"] and record["baseline_success"] >= record["agent_success"]
status = "PASS" if meets_contract else "KEEP_DETERMINISTIC_WORKFLOW"
print("S49-T1-A", status)
assert meets_contract is True` ,
          output: `S49-T1-A PASS` ,
        },
      },
      {
        id: "S49-T1-A-E2",
        subtopicId: "S49-T1-A",
        kind: "independent",
        instruction: "S49-T1-A-E2 · Modela tres rutas de `workflow vs agente`: fixture válido, fixture adverso y registro sin `agent_success`. Entrada: dict con case_id, known_steps, branch_count, tool_choice_uncertain, baseline_success, agent_success. Salidas exactas: `PASS`, `KEEP_DETERMINISTIC_WORKFLOW`, `MISSING:agent_success`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a agent_success debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a agent_success debe ocurrir antes de esa rama.",
          "Después aplica la regla de S49-T1-A: workflow preferido cuando pasos conocidos y baseline gana. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta agent_success", "fixture adverso: workflow preferido cuando pasos conocidos y baseline gana", "CASO-AYA-049-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `agent_success` ausente y produce exactamente `PASS KEEP_DETERMINISTIC_WORKFLOW MISSING:agent_success`.",
        feedback: "S49-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa KEEP_DETERMINISTIC_WORKFLOW y por qué faltar agent_success exige RUN_AGENT_BASELINE.",
        starterCode: {
          language: 'python',
          title: "s49-t1-a-e2.py",
          code: `# CASO-LIM-049 · assess KEEP_DETERMINISTIC_WORKFLOW
# DEFECT: PASS cuando workflow determinista basta
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "known_steps", "branch_count", "tool_choice_uncertain", "baseline_success", "agent_success"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["known_steps"] or record["agent_success"] > record["baseline_success"] else "KEEP_DETERMINISTIC_WORKFLOW"

valid = {"case_id": "CASO-AYA-049-1A", **{"known_steps":True,"branch_count":2,"tool_choice_uncertain":False,"baseline_success":0.96,"agent_success":0.9}}
invalid = {"case_id": "CASO-AYA-049-1A", **{"known_steps":False,"branch_count":20,"tool_choice_uncertain":True,"baseline_success":0.4,"agent_success":0.8}}
incomplete = {**valid}
incomplete.pop("agent_success")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "known_steps", "branch_count", "tool_choice_uncertain", "baseline_success", "agent_success"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["known_steps"] and record["branch_count"] <= 3 and not record["tool_choice_uncertain"] and record["baseline_success"] >= record["agent_success"] else "KEEP_DETERMINISTIC_WORKFLOW"

valid = {"case_id": "CASO-AYA-049-1A", **{"known_steps":True,"branch_count":2,"tool_choice_uncertain":False,"baseline_success":0.96,"agent_success":0.9}}
invalid = {"case_id": "CASO-AYA-049-1A", **{"known_steps":False,"branch_count":20,"tool_choice_uncertain":True,"baseline_success":0.4,"agent_success":0.8}}
incomplete = {**valid}
incomplete.pop("agent_success")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS KEEP_DETERMINISTIC_WORKFLOW MISSING:agent_success` ,
        },
      },
      {
        id: "S49-T1-A-E3",
        subtopicId: "S49-T1-A",
        kind: "transfer",
        instruction: "S49-T1-A-E3 · Simula fallo cerrado para `workflow vs agente` con tres fixtures distintos. `CASO-AYA-049-1A` debe continuar, el adverso debe devolver `KEEP_DETERMINISTIC_WORKFLOW` y la ausencia de `agent_success` debe devolver `RUN_AGENT_BASELINE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RUN_AGENT_BASELINE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RUN_AGENT_BASELINE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró workflow preferido cuando pasos conocidos y baseline gana; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta agent_success", "fixture adverso: workflow preferido cuando pasos conocidos y baseline gana", "CASO-AYA-049-1A es sintético"],
        tests: "Fixtures `CASO-AYA-049-1A`, adverso y sin `agent_success` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa KEEP_DETERMINISTIC_WORKFLOW y por qué faltar agent_success exige RUN_AGENT_BASELINE.",
        starterCode: {
          language: 'python',
          title: "s49-t1-a-e3.py",
          code: `# CASO-LIM-049 · decide KEEP_DETERMINISTIC_WORKFLOW
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "known_steps", "branch_count", "tool_choice_uncertain", "baseline_success", "agent_success"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["known_steps"] or record["agent_success"] > record["baseline_success"] else "KEEP_DETERMINISTIC_WORKFLOW"

valid = {"case_id": "CASO-AYA-049-1A", **{"known_steps":True,"branch_count":2,"tool_choice_uncertain":False,"baseline_success":0.96,"agent_success":0.9}}
invalid = {"case_id": "CASO-AYA-049-1A", **{"known_steps":False,"branch_count":20,"tool_choice_uncertain":True,"baseline_success":0.4,"agent_success":0.8}}
uncertain = {**valid}
uncertain.pop("agent_success")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "known_steps", "branch_count", "tool_choice_uncertain", "baseline_success", "agent_success"}
    missing = sorted(required - record.keys())
    if missing:
        return "RUN_AGENT_BASELINE"
    return "CONTINUE" if record["known_steps"] and record["branch_count"] <= 3 and not record["tool_choice_uncertain"] and record["baseline_success"] >= record["agent_success"] else "KEEP_DETERMINISTIC_WORKFLOW"

valid = {"case_id": "CASO-AYA-049-1A", **{"known_steps":True,"branch_count":2,"tool_choice_uncertain":False,"baseline_success":0.96,"agent_success":0.9}}
invalid = {"case_id": "CASO-AYA-049-1A", **{"known_steps":False,"branch_count":20,"tool_choice_uncertain":True,"baseline_success":0.4,"agent_success":0.8}}
uncertain = {**valid}
uncertain.pop("agent_success")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "KEEP_DETERMINISTIC_WORKFLOW", "RUN_AGENT_BASELINE"]` ,
          output: `CONTINUE KEEP_DETERMINISTIC_WORKFLOW RUN_AGENT_BASELINE` ,
        },
      },
      {
        id: "S49-T1-B-E1",
        subtopicId: "S49-T1-B",
        kind: "guided",
        instruction: "S49-T1-B-E1 · Compara el contrato de `routing, planner/worker y evaluator–optimizer` sobre `CASO-AYA-049-1B`. La entrada es el dict completo del starter; la operación debe demostrar ruta válida, plan acotado, outputs completos y evaluación. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S49-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `STOP_AGENT_LOOP` en E2.",
        hint: "Relaciona los campos `route`, `plan_steps`, `max_steps`, `worker_outputs`, `evaluator_pass` con la regla explicada en S49-T1-B.",
        hints: [
          "Relaciona los campos `route`, `plan_steps`, `max_steps`, `worker_outputs`, `evaluator_pass` con la regla explicada en S49-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva trayectoria con roles y máximo de iteraciones; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta evaluator_pass", "fixture adverso: ruta válida, plan acotado, outputs completos y evaluación", "CASO-AYA-049-1B es sintético"],
        tests: "El fixture `CASO-AYA-049-1B` satisface un predicado de dominio real; imprime `S49-T1-B PASS` y el assert booleano pasa.",
        feedback: "S49-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa STOP_AGENT_LOOP y por qué faltar evaluator_pass exige REPLAN_WITH_BOUNDS.",
        starterCode: {
          language: 'python',
          title: "s49-t1-b-e1.py",
          code: `# CASO-LIM-049 · planner steps + evaluator
# DEFECT: PASS si plan_steps>max o evaluator_pass False
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-AYA-049-1B", **{"route":"report","plan_steps":3,"max_steps":5,"worker_outputs":3,"evaluator_pass":True}}
# DEFECT: plan sobre max_steps o evaluator fail
meets_contract = record["plan_steps"] > record["max_steps"] or not record["evaluator_pass"]
status = "PASS" if meets_contract else "STOP_AGENT_LOOP"
print("S49-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t1-b-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-1B", **{"route":"report","plan_steps":3,"max_steps":5,"worker_outputs":3,"evaluator_pass":True}}
meets_contract = record["route"] in {"case","report"} and record["plan_steps"] <= record["max_steps"] and record["worker_outputs"] == record["plan_steps"] and record["evaluator_pass"]
status = "PASS" if meets_contract else "STOP_AGENT_LOOP"
print("S49-T1-B", status)
assert meets_contract is True` ,
          output: `S49-T1-B PASS` ,
        },
      },
      {
        id: "S49-T1-B-E2",
        subtopicId: "S49-T1-B",
        kind: "independent",
        instruction: "S49-T1-B-E2 · Verifica tres rutas de `routing, planner/worker y evaluator–optimizer`: fixture válido, fixture adverso y registro sin `evaluator_pass`. Entrada: dict con case_id, route, plan_steps, max_steps, worker_outputs, evaluator_pass. Salidas exactas: `PASS`, `STOP_AGENT_LOOP`, `MISSING:evaluator_pass`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a evaluator_pass debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a evaluator_pass debe ocurrir antes de esa rama.",
          "Después aplica la regla de S49-T1-B: ruta válida, plan acotado, outputs completos y evaluación. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta evaluator_pass", "fixture adverso: ruta válida, plan acotado, outputs completos y evaluación", "CASO-AYA-049-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `evaluator_pass` ausente y produce exactamente `PASS STOP_AGENT_LOOP MISSING:evaluator_pass`.",
        feedback: "S49-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_AGENT_LOOP y por qué faltar evaluator_pass exige REPLAN_WITH_BOUNDS.",
        starterCode: {
          language: 'python',
          title: "s49-t1-b-e2.py",
          code: `# CASO-LIM-049 · assess STOP_AGENT_LOOP
# DEFECT: PASS con loop sin cota o evaluator fail
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "route", "plan_steps", "max_steps", "worker_outputs", "evaluator_pass"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["plan_steps"] > record["max_steps"] or not record["evaluator_pass"] else "STOP_AGENT_LOOP"

valid = {"case_id": "CASO-AYA-049-1B", **{"route":"report","plan_steps":3,"max_steps":5,"worker_outputs":3,"evaluator_pass":True}}
invalid = {"case_id": "CASO-AYA-049-1B", **{"route":"unknown","plan_steps":12,"max_steps":5,"worker_outputs":2,"evaluator_pass":False}}
incomplete = {**valid}
incomplete.pop("evaluator_pass")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "route", "plan_steps", "max_steps", "worker_outputs", "evaluator_pass"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["route"] in {"case","report"} and record["plan_steps"] <= record["max_steps"] and record["worker_outputs"] == record["plan_steps"] and record["evaluator_pass"] else "STOP_AGENT_LOOP"

valid = {"case_id": "CASO-AYA-049-1B", **{"route":"report","plan_steps":3,"max_steps":5,"worker_outputs":3,"evaluator_pass":True}}
invalid = {"case_id": "CASO-AYA-049-1B", **{"route":"unknown","plan_steps":12,"max_steps":5,"worker_outputs":2,"evaluator_pass":False}}
incomplete = {**valid}
incomplete.pop("evaluator_pass")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS STOP_AGENT_LOOP MISSING:evaluator_pass` ,
        },
      },
      {
        id: "S49-T1-B-E3",
        subtopicId: "S49-T1-B",
        kind: "transfer",
        instruction: "S49-T1-B-E3 · Extiende fallo cerrado para `routing, planner/worker y evaluator–optimizer` con tres fixtures distintos. `CASO-AYA-049-1B` debe continuar, el adverso debe devolver `STOP_AGENT_LOOP` y la ausencia de `evaluator_pass` debe devolver `REPLAN_WITH_BOUNDS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REPLAN_WITH_BOUNDS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REPLAN_WITH_BOUNDS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ruta válida, plan acotado, outputs completos y evaluación; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta evaluator_pass", "fixture adverso: ruta válida, plan acotado, outputs completos y evaluación", "CASO-AYA-049-1B es sintético"],
        tests: "Fixtures `CASO-AYA-049-1B`, adverso y sin `evaluator_pass` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_AGENT_LOOP y por qué faltar evaluator_pass exige REPLAN_WITH_BOUNDS.",
        starterCode: {
          language: 'python',
          title: "s49-t1-b-e3.py",
          code: `# CASO-LIM-049 · decide STOP_AGENT_LOOP
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "route", "plan_steps", "max_steps", "worker_outputs", "evaluator_pass"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["plan_steps"] > record["max_steps"] or not record["evaluator_pass"] else "STOP_AGENT_LOOP"

valid = {"case_id": "CASO-AYA-049-1B", **{"route":"report","plan_steps":3,"max_steps":5,"worker_outputs":3,"evaluator_pass":True}}
invalid = {"case_id": "CASO-AYA-049-1B", **{"route":"unknown","plan_steps":12,"max_steps":5,"worker_outputs":2,"evaluator_pass":False}}
uncertain = {**valid}
uncertain.pop("evaluator_pass")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "route", "plan_steps", "max_steps", "worker_outputs", "evaluator_pass"}
    missing = sorted(required - record.keys())
    if missing:
        return "REPLAN_WITH_BOUNDS"
    return "CONTINUE" if record["route"] in {"case","report"} and record["plan_steps"] <= record["max_steps"] and record["worker_outputs"] == record["plan_steps"] and record["evaluator_pass"] else "STOP_AGENT_LOOP"

valid = {"case_id": "CASO-AYA-049-1B", **{"route":"report","plan_steps":3,"max_steps":5,"worker_outputs":3,"evaluator_pass":True}}
invalid = {"case_id": "CASO-AYA-049-1B", **{"route":"unknown","plan_steps":12,"max_steps":5,"worker_outputs":2,"evaluator_pass":False}}
uncertain = {**valid}
uncertain.pop("evaluator_pass")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "STOP_AGENT_LOOP", "REPLAN_WITH_BOUNDS"]` ,
          output: `CONTINUE STOP_AGENT_LOOP REPLAN_WITH_BOUNDS` ,
        },
      },
      {
        id: "S49-T2-A-E1",
        subtopicId: "S49-T2-A",
        kind: "guided",
        instruction: "S49-T2-A-E1 · Filtra el contrato de `funciones de responsabilidad única` sobre `CASO-AYA-049-2A`. La entrada es el dict completo del starter; la operación debe demostrar una responsabilidad, schema estrecho y error tipado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S49-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `DISABLE_OVERBROAD_TOOL` en E2.",
        hint: "Relaciona los campos `tool`, `responsibilities`, `schema_fields`, `side_effect`, `typed_errors` con la regla explicada en S49-T2-A.",
        hints: [
          "Relaciona los campos `tool`, `responsibilities`, `schema_fields`, `side_effect`, `typed_errors` con la regla explicada en S49-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva tool contract con casos válidos/inválidos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta typed_errors", "fixture adverso: una responsabilidad, schema estrecho y error tipado", "CASO-AYA-049-2A es sintético"],
        tests: "El fixture `CASO-AYA-049-2A` satisface un predicado de dominio real; imprime `S49-T2-A PASS` y el assert booleano pasa.",
        feedback: "S49-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_OVERBROAD_TOOL y por qué faltar typed_errors exige SPLIT_TOOL_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s49-t2-a-e1.py",
          code: `# CASO-LIM-049 · single-responsibility tools
# DEFECT: PASS si responsibilities>1 o side_effect True
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-AYA-049-2A", **{"tool":"get_case_status","responsibilities":1,"schema_fields":{"case_id"},"side_effect":False,"typed_errors":True}}
# DEFECT: tool multi-responsabilidad o side_effect no declarado
meets_contract = record["responsibilities"] > 1 or record["side_effect"]
status = "PASS" if meets_contract else "DISABLE_OVERBROAD_TOOL"
print("S49-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t2-a-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-2A", **{"tool":"get_case_status","responsibilities":1,"schema_fields":{"case_id"},"side_effect":False,"typed_errors":True}}
meets_contract = record["responsibilities"] == 1 and record["schema_fields"] == {"case_id"} and not record["side_effect"] and record["typed_errors"]
status = "PASS" if meets_contract else "DISABLE_OVERBROAD_TOOL"
print("S49-T2-A", status)
assert meets_contract is True` ,
          output: `S49-T2-A PASS` ,
        },
      },
      {
        id: "S49-T2-A-E2",
        subtopicId: "S49-T2-A",
        kind: "independent",
        instruction: "S49-T2-A-E2 · Clasifica tres rutas de `funciones de responsabilidad única`: fixture válido, fixture adverso y registro sin `typed_errors`. Entrada: dict con case_id, tool, responsibilities, schema_fields, side_effect, typed_errors. Salidas exactas: `PASS`, `DISABLE_OVERBROAD_TOOL`, `MISSING:typed_errors`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a typed_errors debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a typed_errors debe ocurrir antes de esa rama.",
          "Después aplica la regla de S49-T2-A: una responsabilidad, schema estrecho y error tipado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta typed_errors", "fixture adverso: una responsabilidad, schema estrecho y error tipado", "CASO-AYA-049-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `typed_errors` ausente y produce exactamente `PASS DISABLE_OVERBROAD_TOOL MISSING:typed_errors`.",
        feedback: "S49-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_OVERBROAD_TOOL y por qué faltar typed_errors exige SPLIT_TOOL_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s49-t2-a-e2.py",
          code: `# CASO-LIM-049 · assess DISABLE_OVERBROAD_TOOL
# DEFECT: PASS con tool multi-duty o side effect
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "tool", "responsibilities", "schema_fields", "side_effect", "typed_errors"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["responsibilities"] > 1 or record["side_effect"] else "DISABLE_OVERBROAD_TOOL"

valid = {"case_id": "CASO-AYA-049-2A", **{"tool":"get_case_status","responsibilities":1,"schema_fields":{"case_id"},"side_effect":False,"typed_errors":True}}
invalid = {"case_id": "CASO-AYA-049-2A", **{"tool":"do_everything","responsibilities":6,"schema_fields":{"raw"},"side_effect":True,"typed_errors":False}}
incomplete = {**valid}
incomplete.pop("typed_errors")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "tool", "responsibilities", "schema_fields", "side_effect", "typed_errors"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["responsibilities"] == 1 and record["schema_fields"] == {"case_id"} and not record["side_effect"] and record["typed_errors"] else "DISABLE_OVERBROAD_TOOL"

valid = {"case_id": "CASO-AYA-049-2A", **{"tool":"get_case_status","responsibilities":1,"schema_fields":{"case_id"},"side_effect":False,"typed_errors":True}}
invalid = {"case_id": "CASO-AYA-049-2A", **{"tool":"do_everything","responsibilities":6,"schema_fields":{"raw"},"side_effect":True,"typed_errors":False}}
incomplete = {**valid}
incomplete.pop("typed_errors")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DISABLE_OVERBROAD_TOOL MISSING:typed_errors` ,
        },
      },
      {
        id: "S49-T2-A-E3",
        subtopicId: "S49-T2-A",
        kind: "transfer",
        instruction: "S49-T2-A-E3 · Defiende fallo cerrado para `funciones de responsabilidad única` con tres fixtures distintos. `CASO-AYA-049-2A` debe continuar, el adverso debe devolver `DISABLE_OVERBROAD_TOOL` y la ausencia de `typed_errors` debe devolver `SPLIT_TOOL_CONTRACT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `SPLIT_TOOL_CONTRACT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `SPLIT_TOOL_CONTRACT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró una responsabilidad, schema estrecho y error tipado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta typed_errors", "fixture adverso: una responsabilidad, schema estrecho y error tipado", "CASO-AYA-049-2A es sintético"],
        tests: "Fixtures `CASO-AYA-049-2A`, adverso y sin `typed_errors` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_OVERBROAD_TOOL y por qué faltar typed_errors exige SPLIT_TOOL_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s49-t2-a-e3.py",
          code: `# CASO-LIM-049 · decide DISABLE_OVERBROAD_TOOL
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "tool", "responsibilities", "schema_fields", "side_effect", "typed_errors"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["responsibilities"] > 1 or record["side_effect"] else "DISABLE_OVERBROAD_TOOL"

valid = {"case_id": "CASO-AYA-049-2A", **{"tool":"get_case_status","responsibilities":1,"schema_fields":{"case_id"},"side_effect":False,"typed_errors":True}}
invalid = {"case_id": "CASO-AYA-049-2A", **{"tool":"do_everything","responsibilities":6,"schema_fields":{"raw"},"side_effect":True,"typed_errors":False}}
uncertain = {**valid}
uncertain.pop("typed_errors")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "tool", "responsibilities", "schema_fields", "side_effect", "typed_errors"}
    missing = sorted(required - record.keys())
    if missing:
        return "SPLIT_TOOL_CONTRACT"
    return "CONTINUE" if record["responsibilities"] == 1 and record["schema_fields"] == {"case_id"} and not record["side_effect"] and record["typed_errors"] else "DISABLE_OVERBROAD_TOOL"

valid = {"case_id": "CASO-AYA-049-2A", **{"tool":"get_case_status","responsibilities":1,"schema_fields":{"case_id"},"side_effect":False,"typed_errors":True}}
invalid = {"case_id": "CASO-AYA-049-2A", **{"tool":"do_everything","responsibilities":6,"schema_fields":{"raw"},"side_effect":True,"typed_errors":False}}
uncertain = {**valid}
uncertain.pop("typed_errors")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DISABLE_OVERBROAD_TOOL", "SPLIT_TOOL_CONTRACT"]` ,
          output: `CONTINUE DISABLE_OVERBROAD_TOOL SPLIT_TOOL_CONTRACT` ,
        },
      },
      {
        id: "S49-T2-B-E1",
        subtopicId: "S49-T2-B",
        kind: "guided",
        instruction: "S49-T2-B-E1 · Modela el contrato de `schema, permisos, idempotencia y errores` sobre `CASO-AYA-049-2B`. La entrada es el dict completo del starter; la operación debe demostrar schema/scope válidos y retry con un solo efecto. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S49-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `DENY_TOOL_CALL` en E2.",
        hint: "Relaciona los campos `schema_valid`, `scope`, `granted`, `idempotency_key`, `attempts`, `effects`, `error_kind` con la regla explicada en S49-T2-B.",
        hints: [
          "Relaciona los campos `schema_valid`, `scope`, `granted`, `idempotency_key`, `attempts`, `effects`, `error_kind` con la regla explicada en S49-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva replay y denegación de tool probados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta error_kind", "fixture adverso: schema/scope válidos y retry con un solo efecto", "CASO-AYA-049-2B es sintético"],
        tests: "El fixture `CASO-AYA-049-2B` satisface un predicado de dominio real; imprime `S49-T2-B PASS` y el assert booleano pasa.",
        feedback: "S49-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DENY_TOOL_CALL y por qué faltar error_kind exige CLASSIFY_TOOL_ERROR.",
        starterCode: {
          language: 'python',
          title: "s49-t2-b-e1.py",
          code: `# CASO-LIM-049 · tool scope + idempotency
# DEFECT: PASS si scope no granted o effects>1
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":True,"scope":"report:prepare","granted":{"report:prepare"},"idempotency_key":"tool-1","attempts":2,"effects":1,"error_kind":"retryable"}}
# DEFECT: scope no granted o effects duplicados
meets_contract = record["scope"] not in record["granted"] or record["effects"] > 1
status = "PASS" if meets_contract else "DENY_TOOL_CALL"
print("S49-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t2-b-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":True,"scope":"report:prepare","granted":{"report:prepare"},"idempotency_key":"tool-1","attempts":2,"effects":1,"error_kind":"retryable"}}
meets_contract = record["schema_valid"] and record["scope"] in record["granted"] and bool(record["idempotency_key"]) and record["effects"] == 1 and record["error_kind"] in {"retryable","terminal"}
status = "PASS" if meets_contract else "DENY_TOOL_CALL"
print("S49-T2-B", status)
assert meets_contract is True` ,
          output: `S49-T2-B PASS` ,
        },
      },
      {
        id: "S49-T2-B-E2",
        subtopicId: "S49-T2-B",
        kind: "independent",
        instruction: "S49-T2-B-E2 · Audita tres rutas de `schema, permisos, idempotencia y errores`: fixture válido, fixture adverso y registro sin `error_kind`. Entrada: dict con case_id, schema_valid, scope, granted, idempotency_key, attempts, effects, error_kind. Salidas exactas: `PASS`, `DENY_TOOL_CALL`, `MISSING:error_kind`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a error_kind debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a error_kind debe ocurrir antes de esa rama.",
          "Después aplica la regla de S49-T2-B: schema/scope válidos y retry con un solo efecto. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta error_kind", "fixture adverso: schema/scope válidos y retry con un solo efecto", "CASO-AYA-049-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `error_kind` ausente y produce exactamente `PASS DENY_TOOL_CALL MISSING:error_kind`.",
        feedback: "S49-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DENY_TOOL_CALL y por qué faltar error_kind exige CLASSIFY_TOOL_ERROR.",
        starterCode: {
          language: 'python',
          title: "s49-t2-b-e2.py",
          code: `# CASO-LIM-049 · assess DENY_TOOL_CALL
# DEFECT: PASS sin permiso o no idempotente
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "schema_valid", "scope", "granted", "idempotency_key", "attempts", "effects", "error_kind"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["scope"] not in record["granted"] or record["effects"] > 1 else "DENY_TOOL_CALL"

valid = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":True,"scope":"report:prepare","granted":{"report:prepare"},"idempotency_key":"tool-1","attempts":2,"effects":1,"error_kind":"retryable"}}
invalid = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":False,"scope":"prod:write","granted":{"report:prepare"},"idempotency_key":"","attempts":2,"effects":2,"error_kind":"secret dump"}}
incomplete = {**valid}
incomplete.pop("error_kind")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "schema_valid", "scope", "granted", "idempotency_key", "attempts", "effects", "error_kind"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["schema_valid"] and record["scope"] in record["granted"] and bool(record["idempotency_key"]) and record["effects"] == 1 and record["error_kind"] in {"retryable","terminal"} else "DENY_TOOL_CALL"

valid = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":True,"scope":"report:prepare","granted":{"report:prepare"},"idempotency_key":"tool-1","attempts":2,"effects":1,"error_kind":"retryable"}}
invalid = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":False,"scope":"prod:write","granted":{"report:prepare"},"idempotency_key":"","attempts":2,"effects":2,"error_kind":"secret dump"}}
incomplete = {**valid}
incomplete.pop("error_kind")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DENY_TOOL_CALL MISSING:error_kind` ,
        },
      },
      {
        id: "S49-T2-B-E3",
        subtopicId: "S49-T2-B",
        kind: "transfer",
        instruction: "S49-T2-B-E3 · Recupera fallo cerrado para `schema, permisos, idempotencia y errores` con tres fixtures distintos. `CASO-AYA-049-2B` debe continuar, el adverso debe devolver `DENY_TOOL_CALL` y la ausencia de `error_kind` debe devolver `CLASSIFY_TOOL_ERROR`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `CLASSIFY_TOOL_ERROR` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CLASSIFY_TOOL_ERROR` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró schema/scope válidos y retry con un solo efecto; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta error_kind", "fixture adverso: schema/scope válidos y retry con un solo efecto", "CASO-AYA-049-2B es sintético"],
        tests: "Fixtures `CASO-AYA-049-2B`, adverso y sin `error_kind` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DENY_TOOL_CALL y por qué faltar error_kind exige CLASSIFY_TOOL_ERROR.",
        starterCode: {
          language: 'python',
          title: "s49-t2-b-e3.py",
          code: `# CASO-LIM-049 · decide DENY_TOOL_CALL
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "schema_valid", "scope", "granted", "idempotency_key", "attempts", "effects", "error_kind"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["scope"] not in record["granted"] or record["effects"] > 1 else "DENY_TOOL_CALL"

valid = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":True,"scope":"report:prepare","granted":{"report:prepare"},"idempotency_key":"tool-1","attempts":2,"effects":1,"error_kind":"retryable"}}
invalid = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":False,"scope":"prod:write","granted":{"report:prepare"},"idempotency_key":"","attempts":2,"effects":2,"error_kind":"secret dump"}}
uncertain = {**valid}
uncertain.pop("error_kind")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "schema_valid", "scope", "granted", "idempotency_key", "attempts", "effects", "error_kind"}
    missing = sorted(required - record.keys())
    if missing:
        return "CLASSIFY_TOOL_ERROR"
    return "CONTINUE" if record["schema_valid"] and record["scope"] in record["granted"] and bool(record["idempotency_key"]) and record["effects"] == 1 and record["error_kind"] in {"retryable","terminal"} else "DENY_TOOL_CALL"

valid = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":True,"scope":"report:prepare","granted":{"report:prepare"},"idempotency_key":"tool-1","attempts":2,"effects":1,"error_kind":"retryable"}}
invalid = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":False,"scope":"prod:write","granted":{"report:prepare"},"idempotency_key":"","attempts":2,"effects":2,"error_kind":"secret dump"}}
uncertain = {**valid}
uncertain.pop("error_kind")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DENY_TOOL_CALL", "CLASSIFY_TOOL_ERROR"]` ,
          output: `CONTINUE DENY_TOOL_CALL CLASSIFY_TOOL_ERROR` ,
        },
      },
      {
        id: "S49-T3-A-E1",
        subtopicId: "S49-T3-A",
        kind: "guided",
        instruction: "S49-T3-A-E1 · Verifica el contrato de `contexto mínimo, retrieval JIT y checkpoints` sobre `CASO-AYA-049-3A`. La entrada es el dict completo del starter; la operación debe demostrar contexto bajo presupuesto, JIT, provenance y checkpoint. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S49-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `COMPACT_AND_CHECKPOINT` en E2.",
        hint: "Relaciona los campos `context_tokens`, `max_context_tokens`, `retrieved_just_in_time`, `checkpoint_after_effect`, `provenance` con la regla explicada en S49-T3-A.",
        hints: [
          "Relaciona los campos `context_tokens`, `max_context_tokens`, `retrieved_just_in_time`, `checkpoint_after_effect`, `provenance` con la regla explicada en S49-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva reanudación desde checkpoint consistente; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta provenance", "fixture adverso: contexto bajo presupuesto, JIT, provenance y checkpoint", "CASO-AYA-049-3A es sintético"],
        tests: "El fixture `CASO-AYA-049-3A` satisface un predicado de dominio real; imprime `S49-T3-A PASS` y el assert booleano pasa.",
        feedback: "S49-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa COMPACT_AND_CHECKPOINT y por qué faltar provenance exige RETRIEVE_MINIMUM_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s49-t3-a-e1.py",
          code: `# CASO-LIM-049 · context budget + JIT retrieval
# DEFECT: PASS si tokens>max o no checkpoint_after_effect
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":1200,"max_context_tokens":2000,"retrieved_just_in_time":True,"checkpoint_after_effect":True,"provenance":True}}
# DEFECT: context overflow o sin checkpoint post-efecto
meets_contract = record["context_tokens"] > record["max_context_tokens"] or not record["checkpoint_after_effect"]
status = "PASS" if meets_contract else "COMPACT_AND_CHECKPOINT"
print("S49-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t3-a-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":1200,"max_context_tokens":2000,"retrieved_just_in_time":True,"checkpoint_after_effect":True,"provenance":True}}
meets_contract = record["context_tokens"] <= record["max_context_tokens"] and record["retrieved_just_in_time"] and record["checkpoint_after_effect"] and record["provenance"]
status = "PASS" if meets_contract else "COMPACT_AND_CHECKPOINT"
print("S49-T3-A", status)
assert meets_contract is True` ,
          output: `S49-T3-A PASS` ,
        },
      },
      {
        id: "S49-T3-A-E2",
        subtopicId: "S49-T3-A",
        kind: "independent",
        instruction: "S49-T3-A-E2 · Decide tres rutas de `contexto mínimo, retrieval JIT y checkpoints`: fixture válido, fixture adverso y registro sin `provenance`. Entrada: dict con case_id, context_tokens, max_context_tokens, retrieved_just_in_time, checkpoint_after_effect, provenance. Salidas exactas: `PASS`, `COMPACT_AND_CHECKPOINT`, `MISSING:provenance`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a provenance debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a provenance debe ocurrir antes de esa rama.",
          "Después aplica la regla de S49-T3-A: contexto bajo presupuesto, JIT, provenance y checkpoint. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta provenance", "fixture adverso: contexto bajo presupuesto, JIT, provenance y checkpoint", "CASO-AYA-049-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `provenance` ausente y produce exactamente `PASS COMPACT_AND_CHECKPOINT MISSING:provenance`.",
        feedback: "S49-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa COMPACT_AND_CHECKPOINT y por qué faltar provenance exige RETRIEVE_MINIMUM_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s49-t3-a-e2.py",
          code: `# CASO-LIM-049 · assess COMPACT_AND_CHECKPOINT
# DEFECT: PASS con contexto excesivo o sin checkpoint
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "context_tokens", "max_context_tokens", "retrieved_just_in_time", "checkpoint_after_effect", "provenance"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["context_tokens"] > record["max_context_tokens"] or not record["checkpoint_after_effect"] else "COMPACT_AND_CHECKPOINT"

valid = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":1200,"max_context_tokens":2000,"retrieved_just_in_time":True,"checkpoint_after_effect":True,"provenance":True}}
invalid = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":9000,"max_context_tokens":2000,"retrieved_just_in_time":False,"checkpoint_after_effect":False,"provenance":False}}
incomplete = {**valid}
incomplete.pop("provenance")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "context_tokens", "max_context_tokens", "retrieved_just_in_time", "checkpoint_after_effect", "provenance"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["context_tokens"] <= record["max_context_tokens"] and record["retrieved_just_in_time"] and record["checkpoint_after_effect"] and record["provenance"] else "COMPACT_AND_CHECKPOINT"

valid = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":1200,"max_context_tokens":2000,"retrieved_just_in_time":True,"checkpoint_after_effect":True,"provenance":True}}
invalid = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":9000,"max_context_tokens":2000,"retrieved_just_in_time":False,"checkpoint_after_effect":False,"provenance":False}}
incomplete = {**valid}
incomplete.pop("provenance")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS COMPACT_AND_CHECKPOINT MISSING:provenance` ,
        },
      },
      {
        id: "S49-T3-A-E3",
        subtopicId: "S49-T3-A",
        kind: "transfer",
        instruction: "S49-T3-A-E3 · Contrasta fallo cerrado para `contexto mínimo, retrieval JIT y checkpoints` con tres fixtures distintos. `CASO-AYA-049-3A` debe continuar, el adverso debe devolver `COMPACT_AND_CHECKPOINT` y la ausencia de `provenance` debe devolver `RETRIEVE_MINIMUM_CONTEXT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RETRIEVE_MINIMUM_CONTEXT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RETRIEVE_MINIMUM_CONTEXT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró contexto bajo presupuesto, JIT, provenance y checkpoint; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta provenance", "fixture adverso: contexto bajo presupuesto, JIT, provenance y checkpoint", "CASO-AYA-049-3A es sintético"],
        tests: "Fixtures `CASO-AYA-049-3A`, adverso y sin `provenance` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa COMPACT_AND_CHECKPOINT y por qué faltar provenance exige RETRIEVE_MINIMUM_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s49-t3-a-e3.py",
          code: `# CASO-LIM-049 · decide COMPACT_AND_CHECKPOINT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "context_tokens", "max_context_tokens", "retrieved_just_in_time", "checkpoint_after_effect", "provenance"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["context_tokens"] > record["max_context_tokens"] or not record["checkpoint_after_effect"] else "COMPACT_AND_CHECKPOINT"

valid = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":1200,"max_context_tokens":2000,"retrieved_just_in_time":True,"checkpoint_after_effect":True,"provenance":True}}
invalid = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":9000,"max_context_tokens":2000,"retrieved_just_in_time":False,"checkpoint_after_effect":False,"provenance":False}}
uncertain = {**valid}
uncertain.pop("provenance")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "context_tokens", "max_context_tokens", "retrieved_just_in_time", "checkpoint_after_effect", "provenance"}
    missing = sorted(required - record.keys())
    if missing:
        return "RETRIEVE_MINIMUM_CONTEXT"
    return "CONTINUE" if record["context_tokens"] <= record["max_context_tokens"] and record["retrieved_just_in_time"] and record["checkpoint_after_effect"] and record["provenance"] else "COMPACT_AND_CHECKPOINT"

valid = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":1200,"max_context_tokens":2000,"retrieved_just_in_time":True,"checkpoint_after_effect":True,"provenance":True}}
invalid = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":9000,"max_context_tokens":2000,"retrieved_just_in_time":False,"checkpoint_after_effect":False,"provenance":False}}
uncertain = {**valid}
uncertain.pop("provenance")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "COMPACT_AND_CHECKPOINT", "RETRIEVE_MINIMUM_CONTEXT"]` ,
          output: `CONTINUE COMPACT_AND_CHECKPOINT RETRIEVE_MINIMUM_CONTEXT` ,
        },
      },
      {
        id: "S49-T3-B-E1",
        subtopicId: "S49-T3-B",
        kind: "guided",
        instruction: "S49-T3-B-E1 · Clasifica el contrato de `memoria, compaction y last-known-good` sobre `CASO-AYA-049-3B`. La entrada es el dict completo del starter; la operación debe demostrar compaction conserva restricciones, retención y LKG. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S49-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `RESTORE_LAST_KNOWN_GOOD` en E2.",
        hint: "Relaciona los campos `facts_before`, `facts_after`, `memory_retention_days`, `last_known_good` con la regla explicada en S49-T3-B.",
        hints: [
          "Relaciona los campos `facts_before`, `facts_after`, `memory_retention_days`, `last_known_good` con la regla explicada en S49-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva compaction no pierde restricción crítica; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta last_known_good", "fixture adverso: compaction conserva restricciones, retención y LKG", "CASO-AYA-049-3B es sintético"],
        tests: "El fixture `CASO-AYA-049-3B` satisface un predicado de dominio real; imprime `S49-T3-B PASS` y el assert booleano pasa.",
        feedback: "S49-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa RESTORE_LAST_KNOWN_GOOD y por qué faltar last_known_good exige REVIEW_COMPACTION_LOSS.",
        starterCode: {
          language: 'python',
          title: "s49-t3-b-e1.py",
          code: `# CASO-LIM-049 · memory compaction last-known-good
# DEFECT: PASS si facts se pierden o no last_known_good
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id","budget","no_prod_write"},"memory_retention_days":7,"last_known_good":"cp-7"}}
# DEFECT: hechos no monótonos o sin last_known_good
meets_contract = not record["facts_before"] <= record["facts_after"] or not record["last_known_good"]
status = "PASS" if meets_contract else "RESTORE_LAST_KNOWN_GOOD"
print("S49-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t3-b-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id","budget","no_prod_write"},"memory_retention_days":7,"last_known_good":"cp-7"}}
meets_contract = record["facts_before"] <= record["facts_after"] and record["memory_retention_days"] <= 7 and record["last_known_good"].startswith("cp-")
status = "PASS" if meets_contract else "RESTORE_LAST_KNOWN_GOOD"
print("S49-T3-B", status)
assert meets_contract is True` ,
          output: `S49-T3-B PASS` ,
        },
      },
      {
        id: "S49-T3-B-E2",
        subtopicId: "S49-T3-B",
        kind: "independent",
        instruction: "S49-T3-B-E2 · Calcula tres rutas de `memoria, compaction y last-known-good`: fixture válido, fixture adverso y registro sin `last_known_good`. Entrada: dict con case_id, facts_before, facts_after, memory_retention_days, last_known_good. Salidas exactas: `PASS`, `RESTORE_LAST_KNOWN_GOOD`, `MISSING:last_known_good`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a last_known_good debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a last_known_good debe ocurrir antes de esa rama.",
          "Después aplica la regla de S49-T3-B: compaction conserva restricciones, retención y LKG. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta last_known_good", "fixture adverso: compaction conserva restricciones, retención y LKG", "CASO-AYA-049-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `last_known_good` ausente y produce exactamente `PASS RESTORE_LAST_KNOWN_GOOD MISSING:last_known_good`.",
        feedback: "S49-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa RESTORE_LAST_KNOWN_GOOD y por qué faltar last_known_good exige REVIEW_COMPACTION_LOSS.",
        starterCode: {
          language: 'python',
          title: "s49-t3-b-e2.py",
          code: `# CASO-LIM-049 · assess RESTORE_LAST_KNOWN_GOOD
# DEFECT: PASS con pérdida de facts o sin LKG
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "facts_before", "facts_after", "memory_retention_days", "last_known_good"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["facts_before"] <= record["facts_after"] or not record["last_known_good"] else "RESTORE_LAST_KNOWN_GOOD"

valid = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id","budget","no_prod_write"},"memory_retention_days":7,"last_known_good":"cp-7"}}
invalid = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id"},"memory_retention_days":365,"last_known_good":""}}
incomplete = {**valid}
incomplete.pop("last_known_good")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "facts_before", "facts_after", "memory_retention_days", "last_known_good"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["facts_before"] <= record["facts_after"] and record["memory_retention_days"] <= 7 and record["last_known_good"].startswith("cp-") else "RESTORE_LAST_KNOWN_GOOD"

valid = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id","budget","no_prod_write"},"memory_retention_days":7,"last_known_good":"cp-7"}}
invalid = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id"},"memory_retention_days":365,"last_known_good":""}}
incomplete = {**valid}
incomplete.pop("last_known_good")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS RESTORE_LAST_KNOWN_GOOD MISSING:last_known_good` ,
        },
      },
      {
        id: "S49-T3-B-E3",
        subtopicId: "S49-T3-B",
        kind: "transfer",
        instruction: "S49-T3-B-E3 · Instrumenta fallo cerrado para `memoria, compaction y last-known-good` con tres fixtures distintos. `CASO-AYA-049-3B` debe continuar, el adverso debe devolver `RESTORE_LAST_KNOWN_GOOD` y la ausencia de `last_known_good` debe devolver `REVIEW_COMPACTION_LOSS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_COMPACTION_LOSS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_COMPACTION_LOSS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró compaction conserva restricciones, retención y LKG; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta last_known_good", "fixture adverso: compaction conserva restricciones, retención y LKG", "CASO-AYA-049-3B es sintético"],
        tests: "Fixtures `CASO-AYA-049-3B`, adverso y sin `last_known_good` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa RESTORE_LAST_KNOWN_GOOD y por qué faltar last_known_good exige REVIEW_COMPACTION_LOSS.",
        starterCode: {
          language: 'python',
          title: "s49-t3-b-e3.py",
          code: `# CASO-LIM-049 · decide RESTORE_LAST_KNOWN_GOOD
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "facts_before", "facts_after", "memory_retention_days", "last_known_good"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["facts_before"] <= record["facts_after"] or not record["last_known_good"] else "RESTORE_LAST_KNOWN_GOOD"

valid = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id","budget","no_prod_write"},"memory_retention_days":7,"last_known_good":"cp-7"}}
invalid = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id"},"memory_retention_days":365,"last_known_good":""}}
uncertain = {**valid}
uncertain.pop("last_known_good")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "facts_before", "facts_after", "memory_retention_days", "last_known_good"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_COMPACTION_LOSS"
    return "CONTINUE" if record["facts_before"] <= record["facts_after"] and record["memory_retention_days"] <= 7 and record["last_known_good"].startswith("cp-") else "RESTORE_LAST_KNOWN_GOOD"

valid = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id","budget","no_prod_write"},"memory_retention_days":7,"last_known_good":"cp-7"}}
invalid = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id"},"memory_retention_days":365,"last_known_good":""}}
uncertain = {**valid}
uncertain.pop("last_known_good")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "RESTORE_LAST_KNOWN_GOOD", "REVIEW_COMPACTION_LOSS"]` ,
          output: `CONTINUE RESTORE_LAST_KNOWN_GOOD REVIEW_COMPACTION_LOSS` ,
        },
      },
      {
        id: "S49-T4-A-E1",
        subtopicId: "S49-T4-A",
        kind: "guided",
        instruction: "S49-T4-A-E1 · Audita el contrato de `stopping conditions y budgets` sobre `CASO-AYA-049-4A`. La entrada es el dict completo del starter; la operación debe demostrar meta lograda dentro de pasos, tokens y costo. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S49-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `STOP_BUDGET_EXHAUSTED` en E2.",
        hint: "Relaciona los campos `goal_met`, `steps`, `max_steps`, `tokens`, `max_tokens`, `cost_pen`, `max_cost_pen` con la regla explicada en S49-T4-A.",
        hints: [
          "Relaciona los campos `goal_met`, `steps`, `max_steps`, `tokens`, `max_tokens`, `cost_pen`, `max_cost_pen` con la regla explicada en S49-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva budget exhaustion termina con razón; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta max_cost_pen", "fixture adverso: meta lograda dentro de pasos, tokens y costo", "CASO-AYA-049-4A es sintético"],
        tests: "El fixture `CASO-AYA-049-4A` satisface un predicado de dominio real; imprime `S49-T4-A PASS` y el assert booleano pasa.",
        feedback: "S49-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa STOP_BUDGET_EXHAUSTED y por qué faltar max_cost_pen exige ASK_FOR_SCOPE_REDUCTION.",
        starterCode: {
          language: 'python',
          title: "s49-t4-a-e1.py",
          code: `# CASO-LIM-049 · step/token/cost budgets
# DEFECT: PASS si steps>max o cost>max
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-AYA-049-4A", **{"goal_met":True,"steps":4,"max_steps":6,"tokens":3200,"max_tokens":5000,"cost_pen":0.04,"max_cost_pen":0.06}}
# DEFECT: steps/cost sobre presupuesto
meets_contract = record["steps"] > record["max_steps"] or record["cost_pen"] > record["max_cost_pen"]
status = "PASS" if meets_contract else "STOP_BUDGET_EXHAUSTED"
print("S49-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t4-a-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-4A", **{"goal_met":True,"steps":4,"max_steps":6,"tokens":3200,"max_tokens":5000,"cost_pen":0.04,"max_cost_pen":0.06}}
meets_contract = record["goal_met"] and record["steps"] <= record["max_steps"] and record["tokens"] <= record["max_tokens"] and record["cost_pen"] <= record["max_cost_pen"]
status = "PASS" if meets_contract else "STOP_BUDGET_EXHAUSTED"
print("S49-T4-A", status)
assert meets_contract is True` ,
          output: `S49-T4-A PASS` ,
        },
      },
      {
        id: "S49-T4-A-E2",
        subtopicId: "S49-T4-A",
        kind: "independent",
        instruction: "S49-T4-A-E2 · Compara tres rutas de `stopping conditions y budgets`: fixture válido, fixture adverso y registro sin `max_cost_pen`. Entrada: dict con case_id, goal_met, steps, max_steps, tokens, max_tokens, cost_pen, max_cost_pen. Salidas exactas: `PASS`, `STOP_BUDGET_EXHAUSTED`, `MISSING:max_cost_pen`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a max_cost_pen debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a max_cost_pen debe ocurrir antes de esa rama.",
          "Después aplica la regla de S49-T4-A: meta lograda dentro de pasos, tokens y costo. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta max_cost_pen", "fixture adverso: meta lograda dentro de pasos, tokens y costo", "CASO-AYA-049-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_cost_pen` ausente y produce exactamente `PASS STOP_BUDGET_EXHAUSTED MISSING:max_cost_pen`.",
        feedback: "S49-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_BUDGET_EXHAUSTED y por qué faltar max_cost_pen exige ASK_FOR_SCOPE_REDUCTION.",
        starterCode: {
          language: 'python',
          title: "s49-t4-a-e2.py",
          code: `# CASO-LIM-049 · assess STOP_BUDGET_EXHAUSTED
# DEFECT: PASS con budgets agotados
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "goal_met", "steps", "max_steps", "tokens", "max_tokens", "cost_pen", "max_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["steps"] > record["max_steps"] or record["cost_pen"] > record["max_cost_pen"] else "STOP_BUDGET_EXHAUSTED"

valid = {"case_id": "CASO-AYA-049-4A", **{"goal_met":True,"steps":4,"max_steps":6,"tokens":3200,"max_tokens":5000,"cost_pen":0.04,"max_cost_pen":0.06}}
invalid = {"case_id": "CASO-AYA-049-4A", **{"goal_met":False,"steps":20,"max_steps":6,"tokens":20000,"max_tokens":5000,"cost_pen":0.4,"max_cost_pen":0.06}}
incomplete = {**valid}
incomplete.pop("max_cost_pen")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "goal_met", "steps", "max_steps", "tokens", "max_tokens", "cost_pen", "max_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["goal_met"] and record["steps"] <= record["max_steps"] and record["tokens"] <= record["max_tokens"] and record["cost_pen"] <= record["max_cost_pen"] else "STOP_BUDGET_EXHAUSTED"

valid = {"case_id": "CASO-AYA-049-4A", **{"goal_met":True,"steps":4,"max_steps":6,"tokens":3200,"max_tokens":5000,"cost_pen":0.04,"max_cost_pen":0.06}}
invalid = {"case_id": "CASO-AYA-049-4A", **{"goal_met":False,"steps":20,"max_steps":6,"tokens":20000,"max_tokens":5000,"cost_pen":0.4,"max_cost_pen":0.06}}
incomplete = {**valid}
incomplete.pop("max_cost_pen")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS STOP_BUDGET_EXHAUSTED MISSING:max_cost_pen` ,
        },
      },
      {
        id: "S49-T4-A-E3",
        subtopicId: "S49-T4-A",
        kind: "transfer",
        instruction: "S49-T4-A-E3 · Aísla fallo cerrado para `stopping conditions y budgets` con tres fixtures distintos. `CASO-AYA-049-4A` debe continuar, el adverso debe devolver `STOP_BUDGET_EXHAUSTED` y la ausencia de `max_cost_pen` debe devolver `ASK_FOR_SCOPE_REDUCTION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ASK_FOR_SCOPE_REDUCTION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASK_FOR_SCOPE_REDUCTION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró meta lograda dentro de pasos, tokens y costo; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta max_cost_pen", "fixture adverso: meta lograda dentro de pasos, tokens y costo", "CASO-AYA-049-4A es sintético"],
        tests: "Fixtures `CASO-AYA-049-4A`, adverso y sin `max_cost_pen` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_BUDGET_EXHAUSTED y por qué faltar max_cost_pen exige ASK_FOR_SCOPE_REDUCTION.",
        starterCode: {
          language: 'python',
          title: "s49-t4-a-e3.py",
          code: `# CASO-LIM-049 · decide STOP_BUDGET_EXHAUSTED
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "goal_met", "steps", "max_steps", "tokens", "max_tokens", "cost_pen", "max_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["steps"] > record["max_steps"] or record["cost_pen"] > record["max_cost_pen"] else "STOP_BUDGET_EXHAUSTED"

valid = {"case_id": "CASO-AYA-049-4A", **{"goal_met":True,"steps":4,"max_steps":6,"tokens":3200,"max_tokens":5000,"cost_pen":0.04,"max_cost_pen":0.06}}
invalid = {"case_id": "CASO-AYA-049-4A", **{"goal_met":False,"steps":20,"max_steps":6,"tokens":20000,"max_tokens":5000,"cost_pen":0.4,"max_cost_pen":0.06}}
uncertain = {**valid}
uncertain.pop("max_cost_pen")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "goal_met", "steps", "max_steps", "tokens", "max_tokens", "cost_pen", "max_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "ASK_FOR_SCOPE_REDUCTION"
    return "CONTINUE" if record["goal_met"] and record["steps"] <= record["max_steps"] and record["tokens"] <= record["max_tokens"] and record["cost_pen"] <= record["max_cost_pen"] else "STOP_BUDGET_EXHAUSTED"

valid = {"case_id": "CASO-AYA-049-4A", **{"goal_met":True,"steps":4,"max_steps":6,"tokens":3200,"max_tokens":5000,"cost_pen":0.04,"max_cost_pen":0.06}}
invalid = {"case_id": "CASO-AYA-049-4A", **{"goal_met":False,"steps":20,"max_steps":6,"tokens":20000,"max_tokens":5000,"cost_pen":0.4,"max_cost_pen":0.06}}
uncertain = {**valid}
uncertain.pop("max_cost_pen")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "STOP_BUDGET_EXHAUSTED", "ASK_FOR_SCOPE_REDUCTION"]` ,
          output: `CONTINUE STOP_BUDGET_EXHAUSTED ASK_FOR_SCOPE_REDUCTION` ,
        },
      },
      {
        id: "S49-T4-B-E1",
        subtopicId: "S49-T4-B",
        kind: "guided",
        instruction: "S49-T4-B-E1 · Decide el contrato de `sandbox, human approval y recuperación` sobre `CASO-AYA-049-4B`. La entrada es el dict completo del starter; la operación debe demostrar sandbox mínimo, aprobación y reanudación sin repetir efectos. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S49-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `SANDBOX_AND_STOP` en E2.",
        hint: "Relaciona los campos `network`, `filesystem`, `sensitive_action`, `approval_required`, `approval_present`, `checkpoint`, `replayed_effects` con la regla explicada en S49-T4-B.",
        hints: [
          "Relaciona los campos `network`, `filesystem`, `sensitive_action`, `approval_required`, `approval_present`, `checkpoint`, `replayed_effects` con la regla explicada en S49-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva acción de producción imposible sin aprobación; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta replayed_effects", "fixture adverso: sandbox mínimo, aprobación y reanudación sin repetir efectos", "CASO-AYA-049-4B es sintético"],
        tests: "El fixture `CASO-AYA-049-4B` satisface un predicado de dominio real; imprime `S49-T4-B PASS` y el assert booleano pasa.",
        feedback: "S49-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa SANDBOX_AND_STOP y por qué faltar replayed_effects exige REQUEST_HUMAN_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s49-t4-b-e1.py",
          code: `# CASO-LIM-049 · sandbox network + human approval
# DEFECT: PASS si network open o sin approval o replay effects
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-AYA-049-4B", **{"network":"none","filesystem":"workspace-read","sensitive_action":"prepare-draft","approval_required":True,"approval_present":True,"checkpoint":"cp-9","replayed_effects":0}}
# DEFECT: network open sin approval o replay de effects
meets_contract = record["network"] == "open" or not record["approval_present"] or record["replayed_effects"] > 0
status = "PASS" if meets_contract else "SANDBOX_AND_STOP"
print("S49-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t4-b-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-4B", **{"network":"none","filesystem":"workspace-read","sensitive_action":"prepare-draft","approval_required":True,"approval_present":True,"checkpoint":"cp-9","replayed_effects":0}}
meets_contract = record["network"] == "none" and record["filesystem"] == "workspace-read" and (not record["approval_required"] or record["approval_present"]) and record["checkpoint"].startswith("cp-") and record["replayed_effects"] == 0
status = "PASS" if meets_contract else "SANDBOX_AND_STOP"
print("S49-T4-B", status)
assert meets_contract is True` ,
          output: `S49-T4-B PASS` ,
        },
      },
      {
        id: "S49-T4-B-E2",
        subtopicId: "S49-T4-B",
        kind: "independent",
        instruction: "S49-T4-B-E2 · Filtra tres rutas de `sandbox, human approval y recuperación`: fixture válido, fixture adverso y registro sin `replayed_effects`. Entrada: dict con case_id, network, filesystem, sensitive_action, approval_required, approval_present, checkpoint, replayed_effects. Salidas exactas: `PASS`, `SANDBOX_AND_STOP`, `MISSING:replayed_effects`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a replayed_effects debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a replayed_effects debe ocurrir antes de esa rama.",
          "Después aplica la regla de S49-T4-B: sandbox mínimo, aprobación y reanudación sin repetir efectos. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta replayed_effects", "fixture adverso: sandbox mínimo, aprobación y reanudación sin repetir efectos", "CASO-AYA-049-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `replayed_effects` ausente y produce exactamente `PASS SANDBOX_AND_STOP MISSING:replayed_effects`.",
        feedback: "S49-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa SANDBOX_AND_STOP y por qué faltar replayed_effects exige REQUEST_HUMAN_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s49-t4-b-e2.py",
          code: `# CASO-LIM-049 · assess SANDBOX_AND_STOP
# DEFECT: PASS con red abierta, sin HITL o re-efectos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "network", "filesystem", "sensitive_action", "approval_required", "approval_present", "checkpoint", "replayed_effects"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["network"] == "open" or not record["approval_present"] or record["replayed_effects"] > 0 else "SANDBOX_AND_STOP"

valid = {"case_id": "CASO-AYA-049-4B", **{"network":"none","filesystem":"workspace-read","sensitive_action":"prepare-draft","approval_required":True,"approval_present":True,"checkpoint":"cp-9","replayed_effects":0}}
invalid = {"case_id": "CASO-AYA-049-4B", **{"network":"open","filesystem":"root-write","sensitive_action":"prod-write","approval_required":True,"approval_present":False,"checkpoint":"","replayed_effects":2}}
incomplete = {**valid}
incomplete.pop("replayed_effects")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "network", "filesystem", "sensitive_action", "approval_required", "approval_present", "checkpoint", "replayed_effects"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["network"] == "none" and record["filesystem"] == "workspace-read" and (not record["approval_required"] or record["approval_present"]) and record["checkpoint"].startswith("cp-") and record["replayed_effects"] == 0 else "SANDBOX_AND_STOP"

valid = {"case_id": "CASO-AYA-049-4B", **{"network":"none","filesystem":"workspace-read","sensitive_action":"prepare-draft","approval_required":True,"approval_present":True,"checkpoint":"cp-9","replayed_effects":0}}
invalid = {"case_id": "CASO-AYA-049-4B", **{"network":"open","filesystem":"root-write","sensitive_action":"prod-write","approval_required":True,"approval_present":False,"checkpoint":"","replayed_effects":2}}
incomplete = {**valid}
incomplete.pop("replayed_effects")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS SANDBOX_AND_STOP MISSING:replayed_effects` ,
        },
      },
      {
        id: "S49-T4-B-E3",
        subtopicId: "S49-T4-B",
        kind: "transfer",
        instruction: "S49-T4-B-E3 · Demuestra fallo cerrado para `sandbox, human approval y recuperación` con tres fixtures distintos. `CASO-AYA-049-4B` debe continuar, el adverso debe devolver `SANDBOX_AND_STOP` y la ausencia de `replayed_effects` debe devolver `REQUEST_HUMAN_APPROVAL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_HUMAN_APPROVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_HUMAN_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró sandbox mínimo, aprobación y reanudación sin repetir efectos; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta replayed_effects", "fixture adverso: sandbox mínimo, aprobación y reanudación sin repetir efectos", "CASO-AYA-049-4B es sintético"],
        tests: "Fixtures `CASO-AYA-049-4B`, adverso y sin `replayed_effects` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa SANDBOX_AND_STOP y por qué faltar replayed_effects exige REQUEST_HUMAN_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s49-t4-b-e3.py",
          code: `# CASO-LIM-049 · decide SANDBOX_AND_STOP
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "network", "filesystem", "sensitive_action", "approval_required", "approval_present", "checkpoint", "replayed_effects"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["network"] == "open" or not record["approval_present"] or record["replayed_effects"] > 0 else "SANDBOX_AND_STOP"

valid = {"case_id": "CASO-AYA-049-4B", **{"network":"none","filesystem":"workspace-read","sensitive_action":"prepare-draft","approval_required":True,"approval_present":True,"checkpoint":"cp-9","replayed_effects":0}}
invalid = {"case_id": "CASO-AYA-049-4B", **{"network":"open","filesystem":"root-write","sensitive_action":"prod-write","approval_required":True,"approval_present":False,"checkpoint":"","replayed_effects":2}}
uncertain = {**valid}
uncertain.pop("replayed_effects")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "network", "filesystem", "sensitive_action", "approval_required", "approval_present", "checkpoint", "replayed_effects"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_HUMAN_APPROVAL"
    return "CONTINUE" if record["network"] == "none" and record["filesystem"] == "workspace-read" and (not record["approval_required"] or record["approval_present"]) and record["checkpoint"].startswith("cp-") and record["replayed_effects"] == 0 else "SANDBOX_AND_STOP"

valid = {"case_id": "CASO-AYA-049-4B", **{"network":"none","filesystem":"workspace-read","sensitive_action":"prepare-draft","approval_required":True,"approval_present":True,"checkpoint":"cp-9","replayed_effects":0}}
invalid = {"case_id": "CASO-AYA-049-4B", **{"network":"open","filesystem":"root-write","sensitive_action":"prod-write","approval_required":True,"approval_present":False,"checkpoint":"","replayed_effects":2}}
uncertain = {**valid}
uncertain.pop("replayed_effects")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "SANDBOX_AND_STOP", "REQUEST_HUMAN_APPROVAL"]` ,
          output: `CONTINUE SANDBOX_AND_STOP REQUEST_HUMAN_APPROVAL` ,
        },
      },
    ],
  },
  youDo: {
    title: "Agentes, herramientas y context engineering",
    context: "Workflow de herramientas seguro y recuperable. Trabaja sobre un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida: propuesta trazable y checkpoint; nunca un cambio de producción. El gate se bloquea ante: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run.",
    objectives: [
      "Convertir objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto en propuesta trazable y checkpoint; nunca un cambio de producción.",
      "Demostrar el gate: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
      "Probar el fallo: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-AYA-049`.",
      "Incluye decisión workflow versus agente.",
      "Incluye router/planner/worker/evaluator acotados.",
      "Incluye tools con schema, idempotencia y least privilege.",
      "Incluye checkpoints, budgets, stopping conditions y aprobación.",
      "Automatiza un caso normal, uno de breach (`STOP_AGENT`) y uno incierto (`HUMAN_APPROVAL`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-AYA-049"
REQUIRED = ['decision_workflow_versus_agente', 'router_planner_worker_evaluator_acotados', 'tools_con_schema_idempotencia_y_least_privilege', 'checkpoints_budgets_stopping_conditions_y_aprobacion']
evidence = {
    "decision_workflow_versus_agente": False,
    "router_planner_worker_evaluator_acotados": False,
    "tools_con_schema_idempotencia_y_least_privilege": False,
    "checkpoints_budgets_stopping_conditions_y_aprobacion": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-C · agente acotado con aprobación humana: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
    rubric: [
      { criterion: "Correctitud del contrato y gate", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar `workflow vs agente` en CASO-AYA-049?",
        options: ["ADR workflow/agente con baseline", "un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"],
        correctIndex: 0,
        explanation: "La teoría exige ADR workflow/agente con baseline; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S49, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "emitir STOP_AGENT y conservar evidencia", "borrar el trace para reducir ruido"],
        correctIndex: 2,
        explanation: "El contrato falla cerrado con STOP_AGENT; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-C · agente acotado con aprobación humana`?",
        options: ["el archivo S49 existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva", "cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible"],
        correctIndex: 3,
        explanation: "El gate es conductual y medible: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
      },
      {
        question: "¿Qué tratamiento de `CASO-AYA-049` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER"],
        correctIndex: 1,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
      {
        question: "Una tool con side_effect y sin approval_present en red abierta debe…",
        options: ["bloquearse hasta approval y scope en granted", "ejecutarse para maximizar autonomía", "elevar privilegios de red automáticamente", "reproducir effects en cada replay sin log"],
        correctIndex: 0,
        explanation: "Tool-use fail-closed: side effects y network abiertos requieren approval y scope explícitos.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Anthropic — Building effective agents",
        url: "https://www.anthropic.com/research/building-effective-agents",
        note: "Workflows, routing y evaluator-optimizer",
      },
      {
        label: "OpenAI function calling",
        url: "https://platform.openai.com/docs/guides/function-calling",
        note: "Schemas y tool calls",
      },
      {
        label: "JSON Schema",
        url: "https://json-schema.org/understanding-json-schema/",
        note: "Schemas de argumentos de tools",
      },
      {
        label: "NIST AI RMF",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        note: "Control y gestión de riesgo",
      },
      {
        label: "OWASP LLM Top 10",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        note: "Riesgos de agentes y tools",
      },
      {
        label: "LangGraph / agent orchestration concepts",
        url: "https://langchain-ai.github.io/langgraph/",
        note: "Checkpoints y control de loops (referencia)",
      },
      {
        label: "LlamaIndex agents guide",
        url: "https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/",
        note: "Agentes y tools (referencia)",
      },
      {
        label: "Microsoft Semantic Kernel",
        url: "https://learn.microsoft.com/semantic-kernel/",
        note: "Plugins y planners (referencia)",
      },
      {
        label: "SRE — Addressing Cascading Failures",
        url: "https://sre.google/sre-book/addressing-cascading-failures/",
        note: "Budgets, stops y recovery",
      },
      {
        label: "Twelve-Factor App",
        url: "https://12factor.net/",
        note: "Config y procesos del servicio de agente",
      },
    ],
    books: [
      { label: "Building ML Powered Applications", note: "Tooling y feedback humano" },
      { label: "Site Reliability Engineering", note: "Budgets, stops y recovery" },
    ],
    courses: [
      { label: "deeplearning.ai — Agentic AI / tools courses", url: "https://www.deeplearning.ai/", note: "Agentes y tool use intro" },
      { label: "Coursera AI agents", url: "https://www.coursera.org/courses?query=ai%20agents", note: "Agentes MOOCs" },
      { label: "Stanford CS224N", url: "https://web.stanford.edu/class/cs224n/", note: "NLP foundations" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
    ],
  },
}
