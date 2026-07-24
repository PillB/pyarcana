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
    "En equipos de plataforma y producto, **agentes, herramientas y context engineering** orquestan pasos con tools de scope mínimo, presupuestos y checkpoints. Prefiere **workflow** cuando los pasos son conocidos y el baseline determinista iguala o supera al agente; promueve un **agente** solo si supera ese baseline con plan evaluado, budgets y tools de responsabilidad única. Todo side effect sensible exige aprobación humana explícita.",
  learningOutcomes: [
    { text: "Elegir workflow vs agente con baseline documentado y ADR" },
    { text: "Diseñar routing planner/worker/evaluator con máximo de iteraciones" },
    { text: "Definir tools de responsabilidad única con casos válidos e inválidos" },
    { text: "Aplicar schema, permisos, idempotencia y errores tipados en tools" },
    { text: "Minimizar contexto con retrieval JIT y checkpoints consistentes" },
    { text: "Compactar memoria conservando restricciones críticas y LKG" },
    { text: "Definir stopping conditions y budgets con razón de parada explícita" },
    { text: "Operar sandbox, aprobación humana y recovery sin re-efectos" },
  ],
  theory: [
    {
      heading: "Ruta de S49: Agentes, herramientas y context engineering",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Workflow vs agente:** pasos conocidos vs decisiones acotadas con evaluator. **Planner/worker/evaluator:** descomponer, ejecutar, verificar. **Tool de responsabilidad única:** un efecto bien tipado. **Idempotencia de tool:** misma key ⇒ un solo side effect. **Context mínimo / JIT retrieval:** solo lo necesario, justo a tiempo. **Checkpoint / LKG:** last-known-good para recovery. **Budget:** `max_steps`, `max_tokens` y `max_cost_pen` (costo sintético en el lab). **Sandbox + human approval:** sin red/prod/riesgo sin aprobación explícita. **Códigos de acción** (laboratorio): p. ej. `KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL` — respuesta fail-closed, no éxito silencioso.",
        "Esta sección extiende RAG (S48) con **agentes y tools**: planes acotados, scopes, context windows y costos. Demos stdlib (contadores, sets, dicts de estado) sin frameworks de agentes reales. El caso `CASO-AYA-049` (Ayacucho sintético) no ejecuta tools de red abiertas ni PII. En S50 conectarás estas puertas a evals y red team del gate CP-N4-C.",
        "Producto incremental: propuesta de plan + tool calls auditables. Entrada: goal, tools con scope, max_steps/cost y evaluator. Salida: plan ≤ límites, effects=1 por tool idempotente, network closed sin approval. Error de promoción: éxito sin known_steps, side_effect multi-responsabilidad o replay de effects.",
        "Orden: T1 baseline vs agente → T2 tools/scope → T3 context/checkpoint → T4 cost/network/approval. En la demostración verás helpers mínimos; en el laboratorio corregirás contratos fallidos (modo agente mal acotado) hasta fallar cerrado. Esta sección no es solo «contratos de tablas»: es **uso gobernado de tools por un agente**. Stack didáctico: **stdlib** sin frameworks de agentes ni red abierta.",
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
      heading: "Workflow vs agente",
      subtopicId: "S49-T1-A",
      paragraphs: [
        "Usa **workflow** cuando pasos y ramas son conocidos y deterministas; reserva **agente** solo para decisiones acotadas con beneficio medible frente a un baseline y salida verificable por un evaluator. Un agente abierto sin presupuesto ni tools de responsabilidad única no es «más inteligente»: es un riesgo de side effects.",
        "Regla medible: si `known_steps` y el baseline determinista obtiene éxito ≥ al agente en el holdout local, el ADR elige **workflow**. Solo si el agente gana con plan acotado (`max_steps`/`max_cost`) y evaluator, documentas **agent** y dejas el side effect detrás de aprobación humana. Entrada del subtema: objetivo, métricas baseline/agente y flags de incertidumbre. Salida: ADR con decisión y razón. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto → stop.",
        "En `CASO-AYA-049` (entidad ficticia en Ayacucho), preparar un reporte con plantilla fija es workflow; reordenar fuentes desconocidas con tools de lectura puede ser agente — pero solo tras baseline. Evidencia: ADR. Sin PII real ni prueba de fraude/parentesco.",
      ],
      code: {
        language: 'python',
        title: "workflow_vs_agent.py",
        code: `def choose_mode(known_steps: bool, baseline: float, agent: float) -> str:
    if known_steps and baseline >= agent:
        return "workflow"
    return "agent"

print(choose_mode(True, 0.96, 0.90))
print(choose_mode(False, 0.40, 0.80))
print(choose_mode(True, 0.70, 0.88))`,
        output: `workflow
agent
agent`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S49-T1-A: ADR workflow/agente con baseline. Si falta, responde `KEEP_DETERMINISTIC_WORKFLOW`; si no alcanza para decidir, `RUN_AGENT_BASELINE`.",
      },
    },
    {
      heading: "Routing, planner/worker y evaluator–optimizer",
      subtopicId: "S49-T1-B",
      paragraphs: [
        "El **router** elige la ruta (p. ej. caso vs reporte), el **planner** descompone en pasos acotados, el **worker** ejecuta tools y el **evaluator** critica la salida. El patrón evaluator–optimizer cierra el loop: si el evaluator falla, se replanifica — pero solo hasta un `max_steps` explícito.",
        "Regla medible: `route` ∈ rutas permitidas, `plan_steps` ≤ `max_steps`, `worker_outputs` = `plan_steps` y `evaluator_pass` True. Si el plan crece sin cota o el evaluator queda en False sin replan, el run termina con `STOP_AGENT_LOOP`. Entrada: goal + cota de iteraciones. Salida: trayectoria con roles y contador de loops. Error: loop abierto o plan sobre presupuesto → stop.",
        "En `CASO-AYA-049`, la ruta `report` con 3 pasos planificados, 3 outputs de worker y evaluator en True es válida; una ruta `unknown` con 12 pasos y evaluator False se detiene. Evidencia: traza de roles. Sin PII ni inferencia de fraude.",
      ],
      code: {
        language: 'python',
        title: "routing_planner_evaluator.py",
        code: `def bounded_loop(plan_steps: int, max_steps: int, evaluator_pass: bool) -> str:
    if plan_steps > max_steps or not evaluator_pass:
        return "STOP_AGENT_LOOP"
    return "CONTINUE"

trace = []
for role in ("router", "planner", "worker", "evaluator"):
    trace.append(role)
print(trace)
print(bounded_loop(3, 5, True))
print(bounded_loop(12, 5, False))`,
        output: `['router', 'planner', 'worker', 'evaluator']
CONTINUE
STOP_AGENT_LOOP`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S49-T1-B, audita trayectoria con roles y máximo de iteraciones. Un breach activa `STOP_AGENT_LOOP` y una ausencia activa `REPLAN_WITH_BOUNDS`.",
      },
    },
    {
      heading: "Funciones de responsabilidad única",
      subtopicId: "S49-T2-A",
      paragraphs: [
        "Una tool hace **una sola cosa observable**, usa schema estrecho y devuelve error tipado. La descripción en el prompt no concede autoridad: si el humano no podría elegir la tool con certeza, el agente tampoco debería. Las «god tools» (`do_everything`) mezclan lectura, escritura y red y rompen least privilege.",
        "Regla medible: `responsibilities == 1`, `schema_fields` mínimo (p. ej. solo `case_id`), `side_effect` declarado y `typed_errors` True. Si la tool acumula varios efectos o acepta `raw` sin tipar, responde `DISABLE_OVERBROAD_TOOL` o `SPLIT_TOOL_CONTRACT`. Entrada: catálogo de tools. Salida: contratos válidos/inválidos. Error: tool multi-duty sin descomponer → no se promociona.",
        "En `CASO-AYA-049`, `get_case_status` (1 responsabilidad, schema `{case_id}`, sin side effect) pasa; `do_everything` con 6 responsabilidades y schema `{raw}` se deshabilita. Evidencia: tabla de tools. Sin secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "single_responsibility_fns.py",
        code: `def is_srp(tool: dict) -> bool:
    return (
        tool["responsibilities"] == 1
        and len(tool["schema_fields"]) <= 2
        and tool.get("typed_errors", False)
    )

ok = {"name": "get_case", "responsibilities": 1, "schema_fields": {"case_id"}, "typed_errors": True}
bad = {"name": "do_everything", "responsibilities": 6, "schema_fields": {"raw"}, "typed_errors": False}
print(ok["name"], is_srp(ok))
print(bad["name"], is_srp(bad))`,
        output: `get_case True
do_everything False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S49-T2-A conserva tool contract con casos válidos/inválidos; no conviertas `DISABLE_OVERBROAD_TOOL` ni `SPLIT_TOOL_CONTRACT` en éxito silencioso.",
      },
    },
    {
      heading: "Schema, permisos, idempotencia y errores",
      subtopicId: "S49-T2-B",
      paragraphs: [
        "El **schema** valida argumentos antes de ejecutar; los **permisos** se chequean en runtime contra un allowlist de scopes; la **idempotency key** garantiza que un retry no duplique side effects; los errores se clasifican en `retryable` vs `terminal` **sin** volcar secretos al log.",
        "Regla medible: `schema_valid`, `scope` ∈ `granted`, key no vacía, `effects == 1` tras N intentos y `error_kind` ∈ {retryable, terminal}. Si el scope es `prod:write` sin grant o hay effects duplicados, `DENY_TOOL_CALL`. Entrada: call + store de keys. Salida: resultado o denegación tipada. Error: secret dump como kind o effects>1 → stop.",
        "En `CASO-AYA-049`, dos llamadas a `report:prepare` con la misma key deben devolver el mismo efecto (replay seguro); `prod:write` fuera del grant se niega. Evidencia: store de idempotencia. Sin secretos reales en la salida.",
      ],
      code: {
        language: 'python',
        title: "schema_perms_idempotency_errors.py",
        code: `def call_tool(scope: str, granted: set, key: str, store: dict) -> dict:
    if scope not in granted:
        return {"error": "forbidden", "kind": "terminal"}
    if key in store:
        return store[key]  # replay: un solo efecto
    result = {"ok": True, "effect": 1, "idempotency_key": key}
    store[key] = result
    return result

store = {}
granted = {"report:prepare"}
print(call_tool("report:prepare", granted, "k1", store))
print(call_tool("report:prepare", granted, "k1", store))
print(call_tool("prod:write", granted, "k2", store))`,
        output: `{'ok': True, 'effect': 1, 'idempotency_key': 'k1'}
{'ok': True, 'effect': 1, 'idempotency_key': 'k1'}
{'error': 'forbidden', 'kind': 'terminal'}`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S49-T2-B: demuestra replay y denegación de tool probados. Falla cerrada con `DENY_TOOL_CALL` y deriva incertidumbre mediante `CLASSIFY_TOOL_ERROR`.",
      },
    },
    {
      heading: "Contexto mínimo, retrieval JIT y checkpoints",
      subtopicId: "S49-T3-A",
      paragraphs: [
        "El **contexto es un presupuesto de atención** finito: volcar todo el historial y todos los docs al prompt sube costo, latencia y riesgo de fuga. Prefiere **retrieval just-in-time** (solo lo necesario para el paso actual) y **checkpoints** después de efectos durables para reanudar sin re-ejecutar side effects.",
        "Regla medible: `context_tokens` ≤ `max_context_tokens`, `retrieved_just_in_time` True, `checkpoint_after_effect` True y `provenance` True. Si el contexto desborda o falta checkpoint post-efecto, `COMPACT_AND_CHECKPOINT`; si falta provenance, `RETRIEVE_MINIMUM_CONTEXT`. Entrada: facts + tope de tokens. Salida: contexto compacto + id de checkpoint. Error: overflow sin compactar → stop.",
        "En `CASO-AYA-049`, recuperar solo el estado del caso C1 (≈1200 tokens bajo un max de 2000) y checkpoint tras preparar el borrador es el happy path; 9000 tokens sin JIT ni checkpoint activa compactación. Evidencia: reanudación desde checkpoint. Sin PII real.",
      ],
      code: {
        language: 'python',
        title: "min_context_jit_checkpoints.py",
        code: `def jit_context(pool: list, need: str, max_tokens: int) -> dict:
    picked = [f for f in pool if need in f["text"]]
    tokens = sum(f["tokens"] for f in picked)
    if tokens > max_tokens:
        return {"ok": False, "action": "COMPACT_AND_CHECKPOINT"}
    return {"ok": True, "facts": picked, "tokens": tokens, "checkpoint": "cp-after-tool"}

pool = [
    {"text": "caso C1 abierto", "tokens": 400},
    {"text": "ruido de otra región", "tokens": 800},
]
print(jit_context(pool, "C1", 2000))
print(jit_context(pool, "C1", 100))`,
        output: `{'ok': True, 'facts': [{'text': 'caso C1 abierto', 'tokens': 400}], 'tokens': 400, 'checkpoint': 'cp-after-tool'}
{'ok': False, 'action': 'COMPACT_AND_CHECKPOINT'}`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S49-T3-A, el artefacto comprobable es reanudación desde checkpoint consistente. Sin él corresponde `COMPACT_AND_CHECKPOINT` o, si faltan datos, `RETRIEVE_MINIMUM_CONTEXT`.",
      },
    },
    {
      heading: "Memoria, compaction y last-known-good",
      subtopicId: "S49-T3-B",
      paragraphs: [
        "La **memoria** del agente tiene propósito y retención acotada (días, no «para siempre»). **Compaction** resume el historial pero **conserva hechos y decisiones críticas** con provenance. **Last-known-good (LKG)** es el último checkpoint seguro al que puedes volver sin re-ejecutar side effects.",
        "Regla medible: el conjunto de hechos post-compaction debe contener al menos las restricciones críticas pre-compaction (`facts_before` ⊆ `facts_after` en el lab), retención ≤ política (p. ej. 7 días) y `last_known_good` con prefijo `cp-`. Si se pierde `no_prod_write` o el LKG está vacío, `RESTORE_LAST_KNOWN_GOOD` / `REVIEW_COMPACTION_LOSS`. Entrada: memoria + política. Salida: memoria compacta + LKG. Error: drop de restricción crítica → no continuar.",
        "En `CASO-AYA-049`, compactar el log puede borrar pasos ruidosos, pero `case_id`, `budget` y `no_prod_write` deben sobrevivir y el LKG apunta a `cp-7`. Evidencia: diff de facts. Sin PII ni secretos en la memoria de demo.",
      ],
      code: {
        language: 'python',
        title: "memory_compaction_lkg.py",
        code: `CRITICAL = {"case_id", "budget", "no_prod_write"}

def compact(facts: set, drop: set, lkg_id: str) -> dict:
    kept = facts - drop
    lost = CRITICAL - kept
    if lost:
        return {"ok": False, "action": "RESTORE_LAST_KNOWN_GOOD", "lost": sorted(lost)}
    return {"ok": True, "facts": sorted(kept), "lkg": lkg_id}

before = CRITICAL | {"paso_ruidoso", "log_largo"}
print(compact(before, {"paso_ruidoso", "log_largo"}, "cp-7"))
print(compact(before, {"budget", "no_prod_write", "paso_ruidoso"}, "cp-7"))`,
        output: `{'ok': True, 'facts': ['budget', 'case_id', 'no_prod_write'], 'lkg': 'cp-7'}
{'ok': False, 'action': 'RESTORE_LAST_KNOWN_GOOD', 'lost': ['budget', 'no_prod_write']}`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S49-T3-B: prueba que la compaction no pierde restricciones críticas y registra por separado `RESTORE_LAST_KNOWN_GOOD` (breach) y `REVIEW_COMPACTION_LOSS` (missing).",
      },
    },
    {
      heading: "Stopping conditions y budgets",
      subtopicId: "S49-T4-A",
      paragraphs: [
        "Las **stopping conditions** incluyen meta alcanzada, máximo de pasos, tokens y costo. El lab usa `cost_pen` / `max_cost_pen` como **penalización de costo sintética** (no es moneda real): te obliga a comparar consumo vs techo. Agotar presupuesto produce estado explícito (`STOP_BUDGET_EXHAUSTED`), no un loop infinito ni un «éxito inventado».",
        "Regla medible: `goal_met` y `steps` ≤ `max_steps` y `tokens` ≤ `max_tokens` y `cost_pen` ≤ `max_cost_pen`. Si falta `max_cost_pen`, pide `ASK_FOR_SCOPE_REDUCTION` en lugar de seguir a ciegas. Entrada: contadores del run. Salida: continue o stop con razón. Error: steps/cost sobre techo → stop con razón, no retry ciego.",
        "En `CASO-AYA-049`, 4 pasos / 3200 tokens / 0.04 de costo bajo techos 6 / 5000 / 0.06 con meta cumplida es PASS; 20 pasos y 0.4 de costo se detienen. Evidencia: razón de parada en el log. Sin PII.",
      ],
      code: {
        language: 'python',
        title: "stopping_budgets.py",
        code: `def run_with_budget(max_steps: int, max_cost_pen: float, cost_per_step: float) -> str:
    steps, cost = 0, 0.0
    while steps < max_steps:
        steps += 1
        cost += cost_per_step
        if cost > max_cost_pen:
            return f"STOP_BUDGET_EXHAUSTED steps={steps} cost={cost:.2f}"
        if steps == 3:  # meta sintética alcanzada
            return f"GOAL_MET steps={steps} cost={cost:.2f}"
    return f"STOP_BUDGET_EXHAUSTED steps={steps} cost={cost:.2f}"

print(run_with_budget(6, 0.06, 0.01))
print(run_with_budget(6, 0.02, 0.02))`,
        output: `GOAL_MET steps=3 cost=0.03
STOP_BUDGET_EXHAUSTED steps=2 cost=0.04`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para promover S49-T4-A, el run debe terminar con razón explícita (meta o presupuesto). Una violación produce `STOP_BUDGET_EXHAUSTED`; un registro incompleto produce `ASK_FOR_SCOPE_REDUCTION`.",
      },
    },
    {
      heading: "Sandbox, human approval y recuperación",
      subtopicId: "S49-T4-B",
      paragraphs: [
        "El **sandbox** limita filesystem y red (`network=none`, `filesystem=workspace-read` en el lab). Acciones sensibles (enviar, mutar prod, riesgo) exigen **aprobación humana contextual**. La **recuperación** reanuda desde checkpoint y **nunca** re-ejecuta side effects ya aplicados (`replayed_effects` debe quedar en 0).",
        "Regla medible: red cerrada, FS de workspace, si `approval_required` entonces `approval_present`, checkpoint `cp-*` y `replayed_effects == 0`. Breach → `SANDBOX_AND_STOP`; evidencia incompleta de replay → `REQUEST_HUMAN_APPROVAL`. Entrada: política de sandbox + flags de approval. Salida: allow/deny + ruta de recovery. Error: `prod_send` sin human_ok → needs_human, no envío silencioso.",
        "En `CASO-AYA-049`, el agente prepara propuesta y checkpoint; `search_docs` corre en sandbox; `prod_send` sin aprobación se detiene. Recovery = `resume_checkpoint`, no re-efectos. Sin PII ni red abierta en el happy path.",
      ],
      code: {
        language: 'python',
        title: "sandbox_human_approval_recovery.py",
        code: `def run_tool(name: str, human_ok: bool, replayed: int) -> str:
    if replayed > 0:
        return "SANDBOX_AND_STOP"
    if name.startswith("prod_") and not human_ok:
        return "REQUEST_HUMAN_APPROVAL"
    return "sandbox_ok"

print(run_tool("search_docs", False, 0))
print(run_tool("prod_send", False, 0))
print(run_tool("prod_send", True, 2))`,
        output: `sandbox_ok
REQUEST_HUMAN_APPROVAL
SANDBOX_AND_STOP`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S49-T4-B: la acción de producción es imposible sin aprobación; conserva evidencia de `SANDBOX_AND_STOP` y la ruta humana `REQUEST_HUMAN_APPROVAL`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro ocho demostraciones de S49 (Agentes, herramientas y context engineering) alineadas a CP-N4-C: cada una calcula un micro-mecanismo (decisión ADR, loop evaluator–optimizer, tool call con idempotencia, contexto JIT, compaction/LKG, budget o approval), no solo imprime etiquetas. Imita estos pasos en el laboratorio y en el portfolio.",
    steps: [
      {
        demoId: "S49-T1-A-DEMO",
        subtopicId: "S49-T1-A",
        environment: "local-python",
        description: "Demo: workflow vs agente con baseline",
        code: {
          language: 'python',
          title: "demo_workflow_vs_agent.py",
          code: `def adr_mode(known_steps: bool, baseline: float, agent: float) -> dict:
    if known_steps and baseline >= agent:
        return {"mode": "workflow", "reason": "baseline_wins"}
    return {"mode": "agent", "reason": "open_or_beats_baseline"}

print(adr_mode(True, 0.96, 0.90))
print(adr_mode(False, 0.40, 0.80))
print(adr_mode(True, 0.70, 0.88))`,
          output: `{'mode': 'workflow', 'reason': 'baseline_wins'}
{'mode': 'agent', 'reason': 'open_or_beats_baseline'}
{'mode': 'agent', 'reason': 'open_or_beats_baseline'}`,
        },
        why: "Modela la decisión ADR de `workflow vs agente` con métricas locales: cuando pasos conocidos y baseline ≥ agente, se queda en workflow; si no, documenta agent. Evidencia: decisión + razón, sin servicio externo.",
      },
      {
        demoId: "S49-T1-B-DEMO",
        subtopicId: "S49-T1-B",
        environment: "local-python",
        description: "Demo: loop planner/worker/evaluator acotado",
        code: {
          language: 'python',
          title: "demo_routing_planner_evaluator.py",
          code: `def evaluator_optimizer(max_iters: int, scores: list) -> list:
    trace = []
    for i, score in enumerate(scores[:max_iters], start=1):
        trace.append({"iter": i, "role": "worker", "score": score})
        if score >= 0.9:
            trace.append({"iter": i, "role": "evaluator", "pass": True})
            return trace
        trace.append({"iter": i, "role": "evaluator", "pass": False})
    trace.append({"stop": "STOP_AGENT_LOOP"})
    return trace

print(evaluator_optimizer(3, [0.5, 0.95]))
print(evaluator_optimizer(2, [0.4, 0.5]))`,
          output: `[{'iter': 1, 'role': 'worker', 'score': 0.5}, {'iter': 1, 'role': 'evaluator', 'pass': False}, {'iter': 2, 'role': 'worker', 'score': 0.95}, {'iter': 2, 'role': 'evaluator', 'pass': True}]
[{'iter': 1, 'role': 'worker', 'score': 0.4}, {'iter': 1, 'role': 'evaluator', 'pass': False}, {'iter': 2, 'role': 'worker', 'score': 0.5}, {'iter': 2, 'role': 'evaluator', 'pass': False}, {'stop': 'STOP_AGENT_LOOP'}]`,
        },
        why: "Hace visible el loop evaluator–optimizer con tope de iteraciones: mejora hasta pasar o emite `STOP_AGENT_LOOP`. Evidencia: trayectoria de roles acotada.",
      },
      {
        demoId: "S49-T2-A-DEMO",
        subtopicId: "S49-T2-A",
        environment: "local-python",
        description: "Demo: filtrar tools de responsabilidad única",
        code: {
          language: 'python',
          title: "demo_single_responsibility_fns.py",
          code: `def audit_tools(catalog: list) -> dict:
    ok = [t["name"] for t in catalog if t["responsibilities"] == 1 and len(t["schema"]) <= 2]
    bad = [t["name"] for t in catalog if t["name"] not in ok]
    return {"allow": ok, "disable": bad}

catalog = [
    {"name": "get_case", "responsibilities": 1, "schema": ["case_id"]},
    {"name": "search_docs", "responsibilities": 1, "schema": ["query"]},
    {"name": "do_everything", "responsibilities": 6, "schema": ["raw"]},
]
print(audit_tools(catalog))`,
          output: `{'allow': ['get_case', 'search_docs'], 'disable': ['do_everything']}`,
        },
        why: "Separa tools SRP de god-tools por responsabilidades y schema; deja evidencia de contrato válido/inválido sin frameworks externos.",
      },
      {
        demoId: "S49-T2-B-DEMO",
        subtopicId: "S49-T2-B",
        environment: "local-python",
        description: "Demo: permisos + idempotencia en tool call",
        code: {
          language: 'python',
          title: "demo_schema_perms_idempotency_errors.py",
          code: `def call_tool(scope: str, granted: set, key: str, store: dict) -> dict:
    if scope not in granted:
        return {"error": "forbidden", "kind": "terminal"}
    if key in store:
        return store[key]  # replay: un solo efecto
    result = {"ok": True, "effect": 1, "idempotency_key": key}
    store[key] = result
    return result

store = {}
granted = {"report:prepare"}
print(call_tool("report:prepare", granted, "k1", store))
print(call_tool("report:prepare", granted, "k1", store))
print(call_tool("prod:write", granted, "k2", store))`,
          output: `{'ok': True, 'effect': 1, 'idempotency_key': 'k1'}
{'ok': True, 'effect': 1, 'idempotency_key': 'k1'}
{'error': 'forbidden', 'kind': 'terminal'}`,
        },
        why: "Demuestra allowlist de scopes y store de idempotency: el retry no duplica effects y el scope denegado es terminal. Evidencia: replay + DENY.",
      },
      {
        demoId: "S49-T3-A-DEMO",
        subtopicId: "S49-T3-A",
        environment: "local-python",
        description: "Demo: retrieval JIT y checkpoint",
        code: {
          language: 'python',
          title: "demo_min_context_jit_checkpoints.py",
          code: `def build_context(docs: list, query: str, max_tokens: int) -> dict:
    hits = [d for d in docs if query in d["text"]]
    tokens = sum(d["tokens"] for d in hits)
    if tokens > max_tokens or not hits:
        return {"status": "COMPACT_AND_CHECKPOINT", "tokens": tokens}
    return {
        "status": "ok",
        "context": [h["text"] for h in hits],
        "tokens": tokens,
        "checkpoint": "cp-after-retrieve",
    }

docs = [
    {"text": "caso C1 abierto Ayacucho", "tokens": 300},
    {"text": "manual genérico", "tokens": 2000},
]
print(build_context(docs, "C1", 2000))
print(build_context(docs, "manual", 500))`,
          output: `{'status': 'ok', 'context': ['caso C1 abierto Ayacucho'], 'tokens': 300, 'checkpoint': 'cp-after-retrieve'}
{'status': 'COMPACT_AND_CHECKPOINT', 'tokens': 2000}`,
        },
        why: "Calcula contexto mínimo por query y tokens; si desborda, emite compactación. Evidencia: checkpoint tras retrieval JIT.",
      },
      {
        demoId: "S49-T3-B-DEMO",
        subtopicId: "S49-T3-B",
        environment: "local-python",
        description: "Demo: compaction que conserva LKG",
        code: {
          language: 'python',
          title: "demo_memory_compaction_lkg.py",
          code: `CRITICAL = {"case_id", "budget", "no_prod_write"}

def compact_memory(facts: set, drop: set, lkg: str) -> dict:
    after = facts - drop
    if not CRITICAL <= after:
        return {"status": "RESTORE_LAST_KNOWN_GOOD", "lkg": lkg}
    return {"status": "ok", "facts": sorted(after), "lkg": lkg}

print(compact_memory(CRITICAL | {"ruido"}, {"ruido"}, "cp-7"))
print(compact_memory(CRITICAL | {"ruido"}, {"budget", "no_prod_write", "ruido"}, "cp-7"))`,
          output: `{'status': 'ok', 'facts': ['budget', 'case_id', 'no_prod_write'], 'lkg': 'cp-7'}
{'status': 'RESTORE_LAST_KNOWN_GOOD', 'lkg': 'cp-7'}`,
        },
        why: "Compacta memoria sin perder restricciones críticas; si el drop las rompe, restaura LKG. Evidencia: facts post-compaction + id de checkpoint.",
      },
      {
        demoId: "S49-T4-A-DEMO",
        subtopicId: "S49-T4-A",
        environment: "local-python",
        description: "Demo: loop con budgets y razón de parada",
        code: {
          language: 'python',
          title: "demo_stopping_budgets.py",
          code: `def agent_steps(max_steps: int, max_cost_pen: float, goal_at: int) -> str:
    cost = 0.0
    for step in range(1, max_steps + 1):
        cost += 0.02
        if cost > max_cost_pen:
            return f"STOP_BUDGET_EXHAUSTED step={step} cost_pen={cost:.2f}"
        if step == goal_at:
            return f"GOAL_MET step={step} cost_pen={cost:.2f}"
    return f"STOP_BUDGET_EXHAUSTED step={max_steps} cost_pen={cost:.2f}"

print(agent_steps(6, 0.06, 3))
print(agent_steps(6, 0.03, 5))`,
          output: `GOAL_MET step=3 cost_pen=0.06
STOP_BUDGET_EXHAUSTED step=2 cost_pen=0.04`,
        },
        why: "Simula un run con `max_steps` y `max_cost_pen`: o se cumple la meta o se detiene con razón de presupuesto. Evidencia: string de stop explícito.",
      },
      {
        demoId: "S49-T4-B-DEMO",
        subtopicId: "S49-T4-B",
        environment: "local-python",
        description: "Demo: sandbox, approval y recovery sin re-efectos",
        code: {
          language: 'python',
          title: "demo_sandbox_human_approval_recovery.py",
          code: `def gate(action: str, network: str, approval: bool, replayed: int) -> str:
    if network != "none" or replayed > 0:
        return "SANDBOX_AND_STOP"
    if action.startswith("prod_") and not approval:
        return "REQUEST_HUMAN_APPROVAL"
    return "ALLOW_RESUME_CHECKPOINT"

print(gate("search_docs", "none", False, 0))
print(gate("prod_send", "none", False, 0))
print(gate("prod_send", "open", True, 0))
print(gate("prepare_report", "none", True, 2))`,
          output: `ALLOW_RESUME_CHECKPOINT
REQUEST_HUMAN_APPROVAL
SANDBOX_AND_STOP
SANDBOX_AND_STOP`,
        },
        why: "Combina red cerrada, approval humano y anti-replay: prod sin aprobación pide humano; red abierta o re-efectos detienen. Evidencia: gate fail-closed.",
      },
    ],
  },
  weDo: {
    intro: "S49 · Laboratorio de agentes y tools en tres capas: 24 retos sobre ocho fixtures sintéticos (`CASO-AYA-049-1A`…`4B`). **E1** repara una **función de dominio** (elegir modo, loop acotado, audit SRP, call con idempotencia, JIT, compaction/LKG, budget o gate de sandbox). **E2** separa valid/adverso/missing. **E3** enruta CONTINUE/breach/incertidumbre. Así pasas de construir el micro-mecanismo a la puerta fail-closed que no deja promover un agente mal acotado. El portfolio integra registry, budgets, checkpoints y approval sobre estos mismos contratos.",
    steps: [
      {
        id: "S49-T1-A-E1",
        subtopicId: "S49-T1-A",
        kind: "guided",
        instruction: "S49-T1-A-E1 · Implementa `workflow_preferred(record)` para el ADR de `workflow vs agente` sobre `CASO-AYA-049-1A`. Debe devolver True solo cuando pasos conocidos, pocas ramas, tool choice cierta y baseline ≥ agente. El starter promueve agente sin necesidad: corrige la función, no los datos. Salida exacta: `S49-T1-A PASS`.",
        hint: "La demo de T1-A usa `known_steps and baseline >= agent`; aquí también acotas `branch_count` y `tool_choice_uncertain`.",
        hints: [
          "La demo de T1-A usa `known_steps and baseline >= agent`; aquí también acotas `branch_count` y `tool_choice_uncertain`.",
          "El fixture válido tiene baseline 0.96 ≥ agent 0.9: la función correcta devuelve True y el status es PASS.",
        ],
        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
        tests: "El fixture `CASO-AYA-049-1A` hace que `workflow_preferred` sea True; imprime `S49-T1-A PASS` y el assert pasa.",
        feedback: "S49-T1-A-E1: explica por qué el ADR elige workflow cuando baseline gana, y qué harías si known_steps fuera False.",
        starterCode: {
          language: 'python',
          title: "s49-t1-a-e1.py",
          code: `# CASO-AYA-049 · workflow vs agent choice
# DEFECT: workflow_preferred True cuando conviene promover agente sin baseline
# Contrato: corrige la función de dominio; salida alineada al assert del ejercicio
record = {"case_id": "CASO-AYA-049-1A", **{"known_steps":True,"branch_count":2,"tool_choice_uncertain":False,"baseline_success":0.96,"agent_success":0.9}}

def workflow_preferred(record: dict) -> bool:
    # DEFECT: invierte la regla de promoción (prefiere agente cuando baseline basta)
    return (not record["known_steps"] or record["agent_success"] > record["baseline_success"])

meets_contract = workflow_preferred(record)
status = "PASS" if meets_contract else "KEEP_DETERMINISTIC_WORKFLOW"
print("S49-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t1-a-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-1A", **{"known_steps":True,"branch_count":2,"tool_choice_uncertain":False,"baseline_success":0.96,"agent_success":0.9}}

def workflow_preferred(record: dict) -> bool:
    return (
        record["known_steps"]
        and record["branch_count"] <= 3
        and not record["tool_choice_uncertain"]
        and record["baseline_success"] >= record["agent_success"]
    )

meets_contract = workflow_preferred(record)
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
        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `agent_success` ausente y produce exactamente `PASS KEEP_DETERMINISTIC_WORKFLOW MISSING:agent_success`.",
        feedback: "S49-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa KEEP_DETERMINISTIC_WORKFLOW y por qué faltar agent_success exige RUN_AGENT_BASELINE.",
        starterCode: {
          language: 'python',
          title: "s49-t1-a-e2.py",
          code: `# CASO-AYA-049 · assess KEEP_DETERMINISTIC_WORKFLOW
# DEFECT: PASS cuando workflow determinista basta
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
        tests: "Fixtures `CASO-AYA-049-1A`, adverso y sin `agent_success` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa KEEP_DETERMINISTIC_WORKFLOW y por qué faltar agent_success exige RUN_AGENT_BASELINE.",
        starterCode: {
          language: 'python',
          title: "s49-t1-a-e3.py",
          code: `# CASO-AYA-049 · decide KEEP_DETERMINISTIC_WORKFLOW
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        instruction: "S49-T1-B-E1 · Implementa `bounded_loop_ok(record)` para routing planner/worker/evaluator sobre `CASO-AYA-049-1B`. Debe exigir ruta permitida, plan ≤ max_steps, outputs = plan_steps y evaluator True. El starter acepta loops rotos: corrige la función. Salida exacta: `S49-T1-B PASS`.",
        hint: "Rutas válidas en el lab: `case` y `report`. El worker debe completar exactamente `plan_steps` outputs.",
        hints: [
          "Rutas válidas en el lab: `case` y `report`. El worker debe completar exactamente `plan_steps` outputs.",
          "Si plan_steps > max_steps o evaluator_pass es False, la función debe devolver False (luego STOP_AGENT_LOOP en E2).",
        ],
        edgeCases: ["falta evaluator_pass", "adverso: route inválida, plan_steps>max o evaluator_pass=False", "CASO-AYA-049-1B es sintético"],
        tests: "El fixture `CASO-AYA-049-1B` hace que `bounded_loop_ok` sea True; imprime `S49-T1-B PASS` y el assert pasa.",
        feedback: "S49-T1-B-E1: nombra qué rol fallaría primero si plan_steps=12 con max_steps=5.",
        starterCode: {
          language: 'python',
          title: "s49-t1-b-e1.py",
          code: `# CASO-AYA-049 · planner steps + evaluator
# DEFECT: bounded_loop_ok True con plan sobre max o evaluator fail
# Contrato: corrige la función de dominio; salida alineada al assert del ejercicio
record = {"case_id": "CASO-AYA-049-1B", **{"route":"report","plan_steps":3,"max_steps":5,"worker_outputs":3,"evaluator_pass":True}}

def bounded_loop_ok(record: dict) -> bool:
    # DEFECT: aprueba el loop cuando debería detenerse
    return record["plan_steps"] > record["max_steps"] or not record["evaluator_pass"]

meets_contract = bounded_loop_ok(record)
status = "PASS" if meets_contract else "STOP_AGENT_LOOP"
print("S49-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t1-b-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-1B", **{"route":"report","plan_steps":3,"max_steps":5,"worker_outputs":3,"evaluator_pass":True}}

def bounded_loop_ok(record: dict) -> bool:
    return (
        record["route"] in {"case", "report"}
        and record["plan_steps"] <= record["max_steps"]
        and record["worker_outputs"] == record["plan_steps"]
        and record["evaluator_pass"]
    )

meets_contract = bounded_loop_ok(record)
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
        edgeCases: ["falta evaluator_pass", "adverso: route inválida, plan_steps>max o evaluator_pass=False", "CASO-AYA-049-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `evaluator_pass` ausente y produce exactamente `PASS STOP_AGENT_LOOP MISSING:evaluator_pass`.",
        feedback: "S49-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_AGENT_LOOP y por qué faltar evaluator_pass exige REPLAN_WITH_BOUNDS.",
        starterCode: {
          language: 'python',
          title: "s49-t1-b-e2.py",
          code: `# CASO-AYA-049 · assess STOP_AGENT_LOOP
# DEFECT: PASS con loop sin cota o evaluator fail
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        edgeCases: ["falta evaluator_pass", "adverso: route inválida, plan_steps>max o evaluator_pass=False", "CASO-AYA-049-1B es sintético"],
        tests: "Fixtures `CASO-AYA-049-1B`, adverso y sin `evaluator_pass` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_AGENT_LOOP y por qué faltar evaluator_pass exige REPLAN_WITH_BOUNDS.",
        starterCode: {
          language: 'python',
          title: "s49-t1-b-e3.py",
          code: `# CASO-AYA-049 · decide STOP_AGENT_LOOP
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        instruction: "S49-T2-A-E1 · Implementa `is_srp_tool(record)` para tools de responsabilidad única sobre `CASO-AYA-049-2A`. Debe exigir responsibilities==1, schema `{case_id}`, sin side_effect y typed_errors True. El starter aprueba god-tools: corrige la función. Salida exacta: `S49-T2-A PASS`.",
        hint: "Compara `schema_fields` con el conjunto mínimo `{\"case_id\"}` y exige typed_errors.",
        hints: [
          "Compara `schema_fields` con el conjunto mínimo `{\"case_id\"}` y exige typed_errors.",
          "Una tool de lectura de caso no debería tener side_effect True en este lab.",
        ],
        edgeCases: ["falta typed_errors", "adverso: responsibilities>1, schema amplio o side_effect no acotado", "CASO-AYA-049-2A es sintético"],
        tests: "El fixture `CASO-AYA-049-2A` hace que `is_srp_tool` sea True; imprime `S49-T2-A PASS` y el assert pasa.",
        feedback: "S49-T2-A-E1: por qué `do_everything` con schema `{raw}` se deshabilita aunque el nombre suene útil.",
        starterCode: {
          language: 'python',
          title: "s49-t2-a-e1.py",
          code: `# CASO-AYA-049 · single-responsibility tools
# DEFECT: is_srp_tool True con multi-duty o side_effect
# Contrato: corrige la función de dominio; salida alineada al assert del ejercicio
record = {"case_id": "CASO-AYA-049-2A", **{"tool":"get_case_status","responsibilities":1,"schema_fields":{"case_id"},"side_effect":False,"typed_errors":True}}

def is_srp_tool(record: dict) -> bool:
    # DEFECT: acepta tools multi-responsabilidad
    return record["responsibilities"] > 1 or record["side_effect"]

meets_contract = is_srp_tool(record)
status = "PASS" if meets_contract else "DISABLE_OVERBROAD_TOOL"
print("S49-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t2-a-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-2A", **{"tool":"get_case_status","responsibilities":1,"schema_fields":{"case_id"},"side_effect":False,"typed_errors":True}}

def is_srp_tool(record: dict) -> bool:
    return (
        record["responsibilities"] == 1
        and record["schema_fields"] == {"case_id"}
        and not record["side_effect"]
        and record["typed_errors"]
    )

meets_contract = is_srp_tool(record)
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
        edgeCases: ["falta typed_errors", "adverso: responsibilities>1, schema amplio o side_effect no acotado", "CASO-AYA-049-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `typed_errors` ausente y produce exactamente `PASS DISABLE_OVERBROAD_TOOL MISSING:typed_errors`.",
        feedback: "S49-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_OVERBROAD_TOOL y por qué faltar typed_errors exige SPLIT_TOOL_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s49-t2-a-e2.py",
          code: `# CASO-AYA-049 · assess DISABLE_OVERBROAD_TOOL
# DEFECT: PASS con tool multi-duty o side effect
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        edgeCases: ["falta typed_errors", "adverso: responsibilities>1, schema amplio o side_effect no acotado", "CASO-AYA-049-2A es sintético"],
        tests: "Fixtures `CASO-AYA-049-2A`, adverso y sin `typed_errors` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_OVERBROAD_TOOL y por qué faltar typed_errors exige SPLIT_TOOL_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s49-t2-a-e3.py",
          code: `# CASO-AYA-049 · decide DISABLE_OVERBROAD_TOOL
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        instruction: "S49-T2-B-E1 · Implementa `tool_call_ok(record)` para schema/permisos/idempotencia sobre `CASO-AYA-049-2B`. Debe exigir schema válido, scope en granted, key no vacía, effects==1 y error_kind tipado. El starter aprueba calls prohibidas: corrige la función. Salida exacta: `S49-T2-B PASS`.",
        hint: "Un retry con la misma idempotency_key puede tener attempts>1, pero effects debe seguir en 1.",
        hints: [
          "Un retry con la misma idempotency_key puede tener attempts>1, pero effects debe seguir en 1.",
          "error_kind solo puede ser retryable o terminal (nunca un dump de secreto).",
        ],
        edgeCases: ["falta error_kind", "adverso: scope no granted, effects>1 o schema inválido", "CASO-AYA-049-2B es sintético"],
        tests: "El fixture `CASO-AYA-049-2B` hace que `tool_call_ok` sea True; imprime `S49-T2-B PASS` y el assert pasa.",
        feedback: "S49-T2-B-E1: diferencia denegar por scope vs denegar por effects duplicados.",
        starterCode: {
          language: 'python',
          title: "s49-t2-b-e1.py",
          code: `# CASO-AYA-049 · tool scope + idempotency
# DEFECT: tool_call_ok True sin permiso o con effects>1
# Contrato: corrige la función de dominio; salida alineada al assert del ejercicio
record = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":True,"scope":"report:prepare","granted":{"report:prepare"},"idempotency_key":"tool-1","attempts":2,"effects":1,"error_kind":"retryable"}}

def tool_call_ok(record: dict) -> bool:
    # DEFECT: aprueba llamadas fuera de grant o no idempotentes
    return record["scope"] not in record["granted"] or record["effects"] > 1

meets_contract = tool_call_ok(record)
status = "PASS" if meets_contract else "DENY_TOOL_CALL"
print("S49-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t2-b-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-2B", **{"schema_valid":True,"scope":"report:prepare","granted":{"report:prepare"},"idempotency_key":"tool-1","attempts":2,"effects":1,"error_kind":"retryable"}}

def tool_call_ok(record: dict) -> bool:
    return (
        record["schema_valid"]
        and record["scope"] in record["granted"]
        and bool(record["idempotency_key"])
        and record["effects"] == 1
        and record["error_kind"] in {"retryable", "terminal"}
    )

meets_contract = tool_call_ok(record)
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
        edgeCases: ["falta error_kind", "adverso: scope no granted, effects>1 o schema inválido", "CASO-AYA-049-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `error_kind` ausente y produce exactamente `PASS DENY_TOOL_CALL MISSING:error_kind`.",
        feedback: "S49-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DENY_TOOL_CALL y por qué faltar error_kind exige CLASSIFY_TOOL_ERROR.",
        starterCode: {
          language: 'python',
          title: "s49-t2-b-e2.py",
          code: `# CASO-AYA-049 · assess DENY_TOOL_CALL
# DEFECT: PASS sin permiso o no idempotente
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        edgeCases: ["falta error_kind", "adverso: scope no granted, effects>1 o schema inválido", "CASO-AYA-049-2B es sintético"],
        tests: "Fixtures `CASO-AYA-049-2B`, adverso y sin `error_kind` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DENY_TOOL_CALL y por qué faltar error_kind exige CLASSIFY_TOOL_ERROR.",
        starterCode: {
          language: 'python',
          title: "s49-t2-b-e3.py",
          code: `# CASO-AYA-049 · decide DENY_TOOL_CALL
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        instruction: "S49-T3-A-E1 · Implementa `context_ok(record)` para contexto mínimo/JIT/checkpoint sobre `CASO-AYA-049-3A`. Debe exigir tokens ≤ max, retrieved_just_in_time, checkpoint_after_effect y provenance. El starter aprueba overflow: corrige la función. Salida exacta: `S49-T3-A PASS`.",
        hint: "El attention budget se viola si context_tokens > max_context_tokens aunque el resto esté bien.",
        hints: [
          "El attention budget se viola si context_tokens > max_context_tokens aunque el resto esté bien.",
          "JIT y provenance deben ser True; el checkpoint debe existir después de un efecto durable.",
        ],
        edgeCases: ["falta provenance", "adverso: tokens>max, sin JIT o sin checkpoint post-efecto", "CASO-AYA-049-3A es sintético"],
        tests: "El fixture `CASO-AYA-049-3A` hace que `context_ok` sea True; imprime `S49-T3-A PASS` y el assert pasa.",
        feedback: "S49-T3-A-E1: por qué volcar todo el corpus al prompt rompe el contrato aunque el modelo «tenga contexto».",
        starterCode: {
          language: 'python',
          title: "s49-t3-a-e1.py",
          code: `# CASO-AYA-049 · context budget + JIT retrieval
# DEFECT: context_ok True con overflow o sin checkpoint
# Contrato: corrige la función de dominio; salida alineada al assert del ejercicio
record = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":1200,"max_context_tokens":2000,"retrieved_just_in_time":True,"checkpoint_after_effect":True,"provenance":True}}

def context_ok(record: dict) -> bool:
    # DEFECT: aprueba desborde de tokens o falta de checkpoint
    return record["context_tokens"] > record["max_context_tokens"] or not record["checkpoint_after_effect"]

meets_contract = context_ok(record)
status = "PASS" if meets_contract else "COMPACT_AND_CHECKPOINT"
print("S49-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t3-a-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-3A", **{"context_tokens":1200,"max_context_tokens":2000,"retrieved_just_in_time":True,"checkpoint_after_effect":True,"provenance":True}}

def context_ok(record: dict) -> bool:
    return (
        record["context_tokens"] <= record["max_context_tokens"]
        and record["retrieved_just_in_time"]
        and record["checkpoint_after_effect"]
        and record["provenance"]
    )

meets_contract = context_ok(record)
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
        edgeCases: ["falta provenance", "adverso: tokens>max, sin JIT o sin checkpoint post-efecto", "CASO-AYA-049-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `provenance` ausente y produce exactamente `PASS COMPACT_AND_CHECKPOINT MISSING:provenance`.",
        feedback: "S49-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa COMPACT_AND_CHECKPOINT y por qué faltar provenance exige RETRIEVE_MINIMUM_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s49-t3-a-e2.py",
          code: `# CASO-AYA-049 · assess COMPACT_AND_CHECKPOINT
# DEFECT: PASS con contexto excesivo o sin checkpoint
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        edgeCases: ["falta provenance", "adverso: tokens>max, sin JIT o sin checkpoint post-efecto", "CASO-AYA-049-3A es sintético"],
        tests: "Fixtures `CASO-AYA-049-3A`, adverso y sin `provenance` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa COMPACT_AND_CHECKPOINT y por qué faltar provenance exige RETRIEVE_MINIMUM_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s49-t3-a-e3.py",
          code: `# CASO-AYA-049 · decide COMPACT_AND_CHECKPOINT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        instruction: "S49-T3-B-E1 · Implementa `compaction_ok(record)` para memoria/LKG sobre `CASO-AYA-049-3B`. Debe exigir facts_before ⊆ facts_after, retención ≤ 7 días y LKG con prefijo `cp-`. El starter aprueba pérdida de restricciones: corrige la función. Salida exacta: `S49-T3-B PASS`.",
        hint: "Usa inclusión de conjuntos: `facts_before <= facts_after` en Python significa ⊆.",
        hints: [
          "Usa inclusión de conjuntos: `facts_before <= facts_after` en Python significa ⊆.",
          "last_known_good vacío o sin prefijo cp- no es un checkpoint recuperable.",
        ],
        edgeCases: ["falta last_known_good", "adverso: pérdida de facts críticos o LKG vacío", "CASO-AYA-049-3B es sintético"],
        tests: "El fixture `CASO-AYA-049-3B` hace que `compaction_ok` sea True; imprime `S49-T3-B PASS` y el assert pasa.",
        feedback: "S49-T3-B-E1: qué restricción crítica no puede desaparecer al compactar y por qué.",
        starterCode: {
          language: 'python',
          title: "s49-t3-b-e1.py",
          code: `# CASO-AYA-049 · memory compaction last-known-good
# DEFECT: compaction_ok True si se pierden facts o falta LKG
# Contrato: corrige la función de dominio; salida alineada al assert del ejercicio
record = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id","budget","no_prod_write"},"memory_retention_days":7,"last_known_good":"cp-7"}}

def compaction_ok(record: dict) -> bool:
    # DEFECT: aprueba drop de restricciones o LKG vacío
    return not record["facts_before"] <= record["facts_after"] or not record["last_known_good"]

meets_contract = compaction_ok(record)
status = "PASS" if meets_contract else "RESTORE_LAST_KNOWN_GOOD"
print("S49-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t3-b-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-3B", **{"facts_before":{"case_id","budget","no_prod_write"},"facts_after":{"case_id","budget","no_prod_write"},"memory_retention_days":7,"last_known_good":"cp-7"}}

def compaction_ok(record: dict) -> bool:
    return (
        record["facts_before"] <= record["facts_after"]
        and record["memory_retention_days"] <= 7
        and record["last_known_good"].startswith("cp-")
    )

meets_contract = compaction_ok(record)
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
        edgeCases: ["falta last_known_good", "adverso: pérdida de facts críticos o LKG vacío", "CASO-AYA-049-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `last_known_good` ausente y produce exactamente `PASS RESTORE_LAST_KNOWN_GOOD MISSING:last_known_good`.",
        feedback: "S49-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa RESTORE_LAST_KNOWN_GOOD y por qué faltar last_known_good exige REVIEW_COMPACTION_LOSS.",
        starterCode: {
          language: 'python',
          title: "s49-t3-b-e2.py",
          code: `# CASO-AYA-049 · assess RESTORE_LAST_KNOWN_GOOD
# DEFECT: PASS con pérdida de facts o sin LKG
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        edgeCases: ["falta last_known_good", "adverso: pérdida de facts críticos o LKG vacío", "CASO-AYA-049-3B es sintético"],
        tests: "Fixtures `CASO-AYA-049-3B`, adverso y sin `last_known_good` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa RESTORE_LAST_KNOWN_GOOD y por qué faltar last_known_good exige REVIEW_COMPACTION_LOSS.",
        starterCode: {
          language: 'python',
          title: "s49-t3-b-e3.py",
          code: `# CASO-AYA-049 · decide RESTORE_LAST_KNOWN_GOOD
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        instruction: "S49-T4-A-E1 · Implementa `budget_ok(record)` para stopping conditions sobre `CASO-AYA-049-4A`. Debe exigir goal_met y contadores (steps/tokens/cost_pen) bajo sus máximos. El starter aprueba runs sobre presupuesto: corrige la función. Salida exacta: `S49-T4-A PASS`.",
        hint: "`cost_pen` es el costo sintético del lab; compáralo con `max_cost_pen`, no ignores tokens.",
        hints: [
          "`cost_pen` es el costo sintético del lab; compáralo con `max_cost_pen`, no ignores tokens.",
          "Si goal_met es False aunque los contadores estén bien, el run aún no es PASS de meta.",
        ],
        edgeCases: ["falta max_cost_pen", "adverso: steps/tokens/cost sobre max o goal_met=False", "CASO-AYA-049-4A es sintético"],
        tests: "El fixture `CASO-AYA-049-4A` hace que `budget_ok` sea True; imprime `S49-T4-A PASS` y el assert pasa.",
        feedback: "S49-T4-A-E1: qué string de stop emitirías si cost_pen supera max_cost_pen a mitad de camino.",
        starterCode: {
          language: 'python',
          title: "s49-t4-a-e1.py",
          code: `# CASO-AYA-049 · step/token/cost budgets
# DEFECT: budget_ok True con steps/cost sobre techo
# Contrato: corrige la función de dominio; salida alineada al assert del ejercicio
record = {"case_id": "CASO-AYA-049-4A", **{"goal_met":True,"steps":4,"max_steps":6,"tokens":3200,"max_tokens":5000,"cost_pen":0.04,"max_cost_pen":0.06}}

def budget_ok(record: dict) -> bool:
    # DEFECT: aprueba agotamiento de presupuesto
    return record["steps"] > record["max_steps"] or record["cost_pen"] > record["max_cost_pen"]

meets_contract = budget_ok(record)
status = "PASS" if meets_contract else "STOP_BUDGET_EXHAUSTED"
print("S49-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t4-a-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-4A", **{"goal_met":True,"steps":4,"max_steps":6,"tokens":3200,"max_tokens":5000,"cost_pen":0.04,"max_cost_pen":0.06}}

def budget_ok(record: dict) -> bool:
    return (
        record["goal_met"]
        and record["steps"] <= record["max_steps"]
        and record["tokens"] <= record["max_tokens"]
        and record["cost_pen"] <= record["max_cost_pen"]
    )

meets_contract = budget_ok(record)
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
        edgeCases: ["falta max_cost_pen", "adverso: steps/tokens/cost sobre max o goal_met=False", "CASO-AYA-049-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_cost_pen` ausente y produce exactamente `PASS STOP_BUDGET_EXHAUSTED MISSING:max_cost_pen`.",
        feedback: "S49-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_BUDGET_EXHAUSTED y por qué faltar max_cost_pen exige ASK_FOR_SCOPE_REDUCTION.",
        starterCode: {
          language: 'python',
          title: "s49-t4-a-e2.py",
          code: `# CASO-AYA-049 · assess STOP_BUDGET_EXHAUSTED
# DEFECT: PASS con budgets agotados
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        edgeCases: ["falta max_cost_pen", "adverso: steps/tokens/cost sobre max o goal_met=False", "CASO-AYA-049-4A es sintético"],
        tests: "Fixtures `CASO-AYA-049-4A`, adverso y sin `max_cost_pen` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_BUDGET_EXHAUSTED y por qué faltar max_cost_pen exige ASK_FOR_SCOPE_REDUCTION.",
        starterCode: {
          language: 'python',
          title: "s49-t4-a-e3.py",
          code: `# CASO-AYA-049 · decide STOP_BUDGET_EXHAUSTED
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        instruction: "S49-T4-B-E1 · Implementa `sandbox_ok(record)` para sandbox/HITL/recovery sobre `CASO-AYA-049-4B`. Debe exigir network=none, FS workspace-read, approval si aplica, checkpoint `cp-*` y replayed_effects==0. El starter aprueba red abierta y re-efectos: corrige la función. Salida exacta: `S49-T4-B PASS`.",
        hint: "Si approval_required es True, approval_present también debe ser True; replayed_effects > 0 es siempre breach.",
        hints: [
          "Si approval_required es True, approval_present también debe ser True; replayed_effects > 0 es siempre breach.",
          "network distinto de `none` o filesystem que no sea workspace-read fallan el sandbox del lab.",
        ],
        edgeCases: ["falta replayed_effects", "adverso: network open, sin approval o replayed_effects>0", "CASO-AYA-049-4B es sintético"],
        tests: "El fixture `CASO-AYA-049-4B` hace que `sandbox_ok` sea True; imprime `S49-T4-B PASS` y el assert pasa.",
        feedback: "S49-T4-B-E1: por qué recovery debe reanudar desde checkpoint y nunca re-ejecutar side effects.",
        starterCode: {
          language: 'python',
          title: "s49-t4-b-e1.py",
          code: `# CASO-AYA-049 · sandbox network + human approval
# DEFECT: sandbox_ok True con red abierta, sin HITL o re-efectos
# Contrato: corrige la función de dominio; salida alineada al assert del ejercicio
record = {"case_id": "CASO-AYA-049-4B", **{"network":"none","filesystem":"workspace-read","sensitive_action":"prepare-draft","approval_required":True,"approval_present":True,"checkpoint":"cp-9","replayed_effects":0}}

def sandbox_ok(record: dict) -> bool:
    # DEFECT: aprueba network open, falta de approval o replay
    return record["network"] == "open" or not record["approval_present"] or record["replayed_effects"] > 0

meets_contract = sandbox_ok(record)
status = "PASS" if meets_contract else "SANDBOX_AND_STOP"
print("S49-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s49-t4-b-e1.py",
          code: `record = {"case_id": "CASO-AYA-049-4B", **{"network":"none","filesystem":"workspace-read","sensitive_action":"prepare-draft","approval_required":True,"approval_present":True,"checkpoint":"cp-9","replayed_effects":0}}

def sandbox_ok(record: dict) -> bool:
    return (
        record["network"] == "none"
        and record["filesystem"] == "workspace-read"
        and (not record["approval_required"] or record["approval_present"])
        and record["checkpoint"].startswith("cp-")
        and record["replayed_effects"] == 0
    )

meets_contract = sandbox_ok(record)
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
        edgeCases: ["falta replayed_effects", "adverso: network open, sin approval o replayed_effects>0", "CASO-AYA-049-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `replayed_effects` ausente y produce exactamente `PASS SANDBOX_AND_STOP MISSING:replayed_effects`.",
        feedback: "S49-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa SANDBOX_AND_STOP y por qué faltar replayed_effects exige REQUEST_HUMAN_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s49-t4-b-e2.py",
          code: `# CASO-AYA-049 · assess SANDBOX_AND_STOP
# DEFECT: PASS con red abierta, sin HITL o re-efectos
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
        edgeCases: ["falta replayed_effects", "adverso: network open, sin approval o replayed_effects>0", "CASO-AYA-049-4B es sintético"],
        tests: "Fixtures `CASO-AYA-049-4B`, adverso y sin `replayed_effects` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa SANDBOX_AND_STOP y por qué faltar replayed_effects exige REQUEST_HUMAN_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s49-t4-b-e3.py",
          code: `# CASO-AYA-049 · decide SANDBOX_AND_STOP
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada al assert del ejercicio
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
    context: "Workflow de herramientas seguro y recuperable. Trabaja sobre un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida: propuesta trazable y checkpoint; nunca un cambio de producción. El run se detiene (fail-closed) si la tool no está permitida, el argumento es inválido, el presupuesto se agota o el estado es incierto.",
    objectives: [
      "Convertir objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto en propuesta trazable y checkpoint; nunca un cambio de producción.",
      "Demostrar el gate: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible.",
      "Probar el fallo cerrado: si la tool no está permitida, el argumento es inválido, el presupuesto se agota o el estado es incierto, el run se detiene.",
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
TOOLS = {
    "get_case": {"scope": "case:read", "side_effect": False},
    "prepare_report": {"scope": "report:prepare", "side_effect": True},
}
GRANTED = {"case:read", "report:prepare"}
BUDGET = {"max_steps": 6, "max_cost_pen": 0.06}
idempotency_store: dict[str, dict] = {}

REQUIRED = [
    "decision_workflow_versus_agente",
    "router_planner_worker_evaluator_acotados",
    "tools_con_schema_idempotencia_y_least_privilege",
    "checkpoints_budgets_stopping_conditions_y_aprobacion",
]
evidence = {
    "decision_workflow_versus_agente": False,
    "router_planner_worker_evaluator_acotados": False,
    "tools_con_schema_idempotencia_y_least_privilege": False,
    "checkpoints_budgets_stopping_conditions_y_aprobacion": False,
}

def decide_mode(known_steps: bool, baseline: float, agent: float) -> str:
    if known_steps and baseline >= agent:
        return "workflow"
    return "agent"

def call_tool(name: str, key: str, human_ok: bool = False) -> dict:
    """Micro-registry: scope, side-effect approval e idempotencia."""
    tool = TOOLS[name]
    if tool["scope"] not in GRANTED:
        return {"error": "forbidden", "kind": "terminal"}
    if tool["side_effect"] and not human_ok:
        return {"error": "needs_approval", "kind": "terminal"}
    if key in idempotency_store:
        return idempotency_store[key]
    result = {"ok": True, "name": name, "effect": 1 if tool["side_effect"] else 0}
    idempotency_store[key] = result
    return result

def within_budget(steps: int, cost_pen: float) -> bool:
    return steps <= BUDGET["max_steps"] and cost_pen <= BUDGET["max_cost_pen"]

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

# Smoke de mecanismos (stdlib); el portfolio READY exige evidencia real en evidence.
print("mode_hint", decide_mode(True, 0.96, 0.90))
print("read", call_tool("get_case", "get_case:C1"))
print("prep_no_approval", call_tool("prepare_report", "prep:C1", human_ok=False))
print("prep_ok", call_tool("prepare_report", "prep:C1", human_ok=True))
print("prep_replay", call_tool("prepare_report", "prep:C1", human_ok=True))
print("budget_ok", within_budget(4, 0.04), "budget_over", within_budget(20, 0.4))

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
      {
        question: "¿Qué práctica reduce el «attention budget» sin perder una restricción crítica?",
        options: [
          "volcar todo el historial y todos los docs al prompt",
          "compactar conservando hechos/decisiones con provenance y LKG",
          "borrar el checkpoint para ahorrar tokens",
          "re-ejecutar side effects en cada recovery",
        ],
        correctIndex: 1,
        explanation: "Compaction + LKG es el contrato de S49-T3: menos tokens, sin perder restricciones ni re-efectos.",
      },
      {
        question: "Si `steps > max_steps` o `cost_pen > max_cost_pen`, el agente debe…",
        options: [
          "continuar hasta cumplir el goal a cualquier costo",
          "detenerse con razón de presupuesto y no inventar éxito",
          "abrir network=open automáticamente",
          "duplicar effects para compensar",
        ],
        correctIndex: 1,
        explanation: "Stopping conditions y budgets terminan el run con estado explícito (STOP_BUDGET_EXHAUSTED).",
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
        label: "Anthropic — Effective context engineering for AI agents",
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
        note: "Attention budget, JIT retrieval, compaction y memoria",
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
