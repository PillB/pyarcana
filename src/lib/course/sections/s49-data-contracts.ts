import type { CourseSection } from '../../types'

export const section49: CourseSection = {
  id: "data-contracts",
  index: 49,
  title: "Agentes, herramientas y context engineering",
  shortTitle: "Agentes y tools",
  tagline: "Agente acotado que consulta casos y reportes y prepara propuestas; no envía, no modifica prod ni decide riesgo sin aprobación.",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "FileCheck",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **agentes, herramientas y context engineering** orquestan pasos con tools de scope mínimo, presupuestos y checkpoints. Prefiere **workflow** cuando los pasos son conocidos y el baseline determinista iguala o supera al agente; promueve un **agente** solo si supera ese baseline con plan evaluado, budgets y tools de responsabilidad única. Todo side effect sensible exige aprobación humana explícita.",
  learningOutcomes: [
    { text: "Elegir workflow vs. agente con baseline documentado y ADR." },
    { text: "Diseñar routing planner/worker/evaluator con máximo de iteraciones." },
    { text: "Definir tools de responsabilidad única con casos válidos e inválidos." },
    { text: "Aplicar schema, permisos, idempotencia y errores tipados en tools." },
    { text: "Minimizar contexto con retrieval JIT y checkpoints consistentes." },
    { text: "Compactar memoria conservando restricciones críticas y LKG." },
    { text: "Definir stopping conditions y budgets con razón de parada explícita." },
    { text: "Operar sandbox, aprobación humana y recovery sin efectos duplicados." },
  ],
  theory: [
    {
      heading: "Ruta de S49: Agentes, herramientas y context engineering",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). Cada término se usa como enunciado y como contrato:\n\n- **Workflow vs. agente**: pasos conocidos vs. decisiones acotadas con evaluator.\n- **Planner / worker / evaluator**: descomponer, ejecutar, verificar.\n- **Tool de responsabilidad única**: un solo efecto, bien tipado.\n- **Idempotencia de tool**: misma key ⇒ un solo side effect.\n- **Context mínimo / JIT retrieval**: solo lo necesario, justo a tiempo.\n- **Checkpoint / LKG**: *last-known-good* para recovery.\n- **Budget**: `max_steps`, `max_tokens` y `max_cost_pen` (costo sintético en el lab).\n- **Sandbox + human approval**: sin red, prod ni riesgo sin aprobación explícita.\n\n**Códigos de acción del laboratorio** (fail-closed, nunca un éxito silencioso): `KEEP_DETERMINISTIC_WORKFLOW` (no promociones el agente aún; conserva el workflow), `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL`.",
        "Esta sección extiende el RAG con evidencia de S48 hacia **agentes y tools**: el retrieval ya no basta; hace falta decidir *si* conviene un agente, *qué* tools puede invocar, *cuánto* contexto y presupuesto consume, y *cuándo* parar o pedir aprobación. Stack didáctico: demos en **stdlib** (contadores, sets, dicts de estado) sin frameworks de agentes ni red abierta. El caso sintético `CASO-AYA-049` (entidad ficticia en Ayacucho) no trae PII real ni tools con red abierta. En S50 conectarás estas puertas a evals y red team del gate CP-N4-C.",
        "**Hilo conductor (trayectoria feliz):**\n\n1. Mides baseline vs. agente y eliges **workflow** o **agent** con ADR.\n2. El planner descompone en ≤ `max_steps` y el evaluator cierra el loop.\n3. Cada tool tiene schema estrecho, scope en allowlist e **idempotency key**.\n4. El contexto se arma con **JIT** y checkpoint.\n5. Si se agota el budget o falta approval, el run emite un código de stop — no inventa éxito.\n\n**Producto incremental:** propuesta de plan + tool calls auditables.\n**Fallos de promoción típicos:** «éxito» sin `known_steps`, *god-tool* multi-efecto, *replay* de side effects o `network=open` sin humano.",
        "Orden pedagógico: **T1** modo y routing → **T2** tools (SRP, schema, permisos, idempotencia) → **T3** context engineering (JIT, compaction, LKG) → **T4** stops, budgets, sandbox y HITL. En la demostración verás micro-mecanismos ejecutables; en el laboratorio repararás funciones de dominio y enrutarás **válido, adverso o incierto** hasta fallar cerrado. Esta sección enseña **uso gobernado de tools por un agente** (no validación tabular de datasets). Ritmo sugerido (~20 h): sesiones 1–2 en T1; 3–5 en T2; 6–8 en T3; 9–10 en T4 + portfolio y self-check.",
      ],
      code: {
        language: 'python',
        title: "s49_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-AYA-049",
        "gates": ["single_responsibility_tools", "idempotent_effects", "budget_stop", "human_approval_sensitive"],
        "topic_is_agent_tools": True,
        "prod_side_effect_without_approval_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("topic_is_agent_tools", c["topic_is_agent_tools"])
print("prod_side_effect_without_approval_ok", c["prod_side_effect_without_approval_ok"])
`,
        output: `case CASO-AYA-049
topic_is_agent_tools True
prod_side_effect_without_approval_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "Promueve solo con evidencia ejecutable (fixtures + asserts). La confianza verbal no basta: si falta un campo o un assert, el gate queda bloqueado.",
      },
    },
    {
      heading: "Workflow vs. agente",
      subtopicId: "S49-T1-A",
      paragraphs: [
        "Usa **workflow** cuando pasos y ramas son conocidos y deterministas; reserva **agente** solo para decisiones acotadas con beneficio medible frente a un baseline y salida verificable por un evaluator. Un agente abierto sin presupuesto ni tools de responsabilidad única no es «más inteligente»: es un riesgo de side effects (envíos, writes, costos) que un pipeline fijo no habría tomado.",
        "Mecanismo de decisión: anota en el ADR `known_steps`, `branch_count`, si la *tool choice* es cierta, y las tasas `baseline_success` vs. `agent_success` en un *holdout* local. Si los pasos son conocidos, hay pocas ramas y el baseline iguala o supera al agente, eliges **workflow**. Solo si el agente gana **y** el plan está acotado (`max_steps` / `max_cost`) con evaluator, documentas **agent_candidate** y dejas todo side effect detrás de aprobación humana. Si faltan métricas o no hay plan acotado, el resultado es **need_evidence** — nunca un `agent` por descarte. Entrada: objetivo + métricas + flag de plan. Salida: ADR con decisión y razón. Error o incertidumbre → stop o volver a medir el baseline, nunca promoción silenciosa.",
        "En `CASO-AYA-049` (entidad ficticia en Ayacucho), preparar un reporte con plantilla fija y tres pasos conocidos es **workflow**. Reordenar fuentes desconocidas con tools de lectura *puede* ser **agent_candidate**, pero solo después de medir baseline y acotar el plan. Evidencia mínima: ADR firmado en el repo del lab. Sin PII real ni inferencia de riesgo legal desde el caso sintético.",
      ],
      code: {
        language: 'python',
        title: "workflow_vs_agent.py",
        code: `def choose_mode(
    known_steps: bool,
    baseline: float,
    agent: float,
    plan_bounded: bool,
) -> str:
    """Fail-closed: never promote agent as residual else."""
    if known_steps and baseline >= agent:
        return "workflow"
    if agent > baseline and plan_bounded:
        return "agent_candidate"
    return "need_evidence"

print(choose_mode(True, 0.96, 0.90, False))
print(choose_mode(False, 0.40, 0.80, True))
print(choose_mode(True, 0.70, 0.88, False))
print(choose_mode(False, 0.40, 0.80, False))`,
        output: `workflow
agent_candidate
need_evidence
need_evidence`,
      },
      callout: {
        type: "tip",
        title: "ADR antes del loop",
        content:
          "Documenta workflow vs. agente con métricas locales antes de abrir el router. Sin baseline medido, el código de lab es `KEEP_DETERMINISTIC_WORKFLOW` o `RUN_AGENT_BASELINE` — no un agente libre.",
      },
    },
    {
      heading: "Routing, planner/worker y evaluator–optimizer",
      subtopicId: "S49-T1-B",
      paragraphs: [
        "El **router** elige la ruta (p. ej. caso vs. reporte), el **planner** descompone en pasos acotados, el **worker** ejecuta tools y el **evaluator** critica la salida. El patrón **evaluator–optimizer** cierra el loop: si el evaluator falla, se replanifica o se reintenta el worker — pero solo hasta un `max_steps` (o `max_iters`) explícito. Sin cota, el «agente» se convierte en un while infinito con costo y riesgo crecientes.",
        "Mecanismo de cota: exige `route` ∈ {`case`, `report`}, `plan_steps` ≤ `max_steps`, `worker_outputs == plan_steps` y `evaluator_pass` True. Si el plan crece sin techo, la ruta es desconocida o el evaluator queda en False tras agotar reintentos, el run termina con `STOP_AGENT_LOOP`. Entrada: goal + cota de iteraciones. Salida: trayectoria con roles (`router`→`planner`→`worker`→`evaluator`) y contador de loops. Error: loop abierto o plan sobre presupuesto → stop con razón, no «casi listo».",
        "En `CASO-AYA-049`, la ruta `report` con 3 pasos planificados, 3 outputs de worker y evaluator True es el happy path. Una ruta `unknown` con 12 pasos y evaluator False se detiene. Evidencia: traza de roles serializable (lista de dicts). Sin PII ni inferencia de fraude.",
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
        title: "Cota o stop",
        content:
          "Si `plan_steps` supera `max_steps` o el evaluator queda en False, el run emite `STOP_AGENT_LOOP`. Sin cota no hay promote.",
      },
    },
    {
      heading: "Funciones de responsabilidad única",
      subtopicId: "S49-T2-A",
      paragraphs: [
        "Una tool hace **una sola cosa observable**, usa schema estrecho y devuelve error tipado. La descripción en el prompt **no** concede autoridad: si un humano no podría elegir la tool con certeza mirando el catálogo, el agente tampoco debería. Las «god tools» (`do_everything`) mezclan lectura, escritura y red: rompen least privilege y hacen imposible auditar *qué* side effect ocurrió.",
        "Mecanismo de contrato: `responsibilities == 1`, `schema_fields` mínimo (p. ej. solo `case_id`), `side_effect` declarado y `typed_errors` True. Si la tool acumula varios efectos o acepta `raw` sin tipar, responde `DISABLE_OVERBROAD_TOOL` o `SPLIT_TOOL_CONTRACT` (divide en tools SRP). Entrada: catálogo. Salida: allowlist de tools válidas frente a deshabilitadas. Error: multi-duty sin descomponer → no se promociona el agente que la invoca.",
        "En `CASO-AYA-049`, `get_case_status` (1 responsabilidad, schema `{case_id}`, sin side effect) pasa; `do_everything` con 6 responsabilidades y schema `{raw}` se deshabilita. Evidencia: tabla de tools en el ADR o en el registry del portfolio. Sin secretos ni PII real en argumentos de demo.",
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
        title: "Catálogo auditable",
        content:
          "Cada tool del registry debe tener una sola responsabilidad, schema estrecho y errores tipados. Una *god-tool* bloquea el promote del agente que la invoca.",
      },
    },
    {
      heading: "Schema, permisos, idempotencia y errores",
      subtopicId: "S49-T2-B",
      paragraphs: [
        "El **schema** valida argumentos *antes* de ejecutar; los **permisos** se chequean en runtime contra un allowlist de scopes; la **idempotency key** garantiza que un retry no duplique side effects; los errores se clasifican en `retryable` vs. `terminal` **sin** volcar secretos al log. Un agente que reintenta ciegamente una tool de escritura sin key es un generador de dobles cargos o dobles envíos.",
        "Mecanismo de llamada: `schema_valid`, `scope` ∈ `granted`, key no vacía, `effects == 1` tras N intentos y `error_kind` ∈ {retryable, terminal}. Si el scope es `prod:write` sin grant, o hay effects duplicados, o el kind es un dump de secreto, responde `DENY_TOOL_CALL`. Entrada: call + store de keys. Salida: resultado o denegación tipada. El store se consulta *antes* de aplicar el efecto.",
        "En `CASO-AYA-049`, dos llamadas a `report:prepare` con la misma key devuelven el mismo efecto (replay seguro: `attempts` puede ser 2, `effects` sigue en 1). `prod:write` fuera del grant se niega. Evidencia: store de idempotencia serializable. Sin secretos reales en la salida del lab.",
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
        title: "Un efecto, una key",
        content:
          "Misma `idempotency_key` ⇒ un solo side effect aunque `attempts` suba. Scope fuera del grant o error no tipado → `DENY_TOOL_CALL`.",
      },
    },
    {
      heading: "Contexto mínimo, retrieval JIT y checkpoints",
      subtopicId: "S49-T3-A",
      paragraphs: [
        "El **contexto es un presupuesto de atención** finito: volcar todo el historial y todos los docs al prompt sube costo, latencia y riesgo de fuga de datos. Prefiere **retrieval just-in-time (JIT)** — solo lo necesario para el *paso actual* — y **checkpoints** después de efectos durables para reanudar sin volver a ejecutar side effects. Context engineering no es «más tokens»: es *elegir* qué entra y qué se archiva.",
        "Mecanismo de contexto: `context_tokens` ≤ `max_context_tokens`, `retrieved_just_in_time` True, `checkpoint_after_effect` True y `provenance` True (sabes de dónde salió cada hecho). Si el contexto desborda o falta checkpoint post-efecto, `COMPACT_AND_CHECKPOINT`; si falta provenance, `RETRIEVE_MINIMUM_CONTEXT`. Entrada: pool de facts + tope. Salida: contexto compacto + id de checkpoint. Error: overflow sin compactar → stop, no «el modelo ya se las arreglará».",
        "En `CASO-AYA-049`, recuperar solo el estado del caso C1 (≈1200 tokens bajo un max de 2000) y checkpoint tras preparar el borrador es el happy path; 9000 tokens sin JIT ni checkpoint activan compactación. Evidencia: reanudación desde checkpoint con los mismos hechos críticos. Sin PII real en el pool de demo.",
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
        title: "Atención acotada",
        content:
          "Si `context_tokens` supera el techo o falta checkpoint post-efecto, compacta y checkpointa. Sin provenance no continúes el run.",
      },
    },
    {
      heading: "Memoria, compaction y last-known-good",
      subtopicId: "S49-T3-B",
      paragraphs: [
        "La **memoria** del agente tiene propósito y retención acotada (días, no «para siempre»). **Compaction** resume el historial pero **debe conservar hechos y decisiones críticas** con provenance. **Last-known-good (LKG)** es el último checkpoint seguro al que puedes volver sin volver a ejecutar side effects. Compactar borrando `no_prod_write` es peor que no compactar: pierdes la restricción que evitaba un write en producción.",
        "Mecanismo de compactación: el conjunto de hechos post-compaction debe conservar las restricciones críticas (`facts_before` ⊆ `facts_after` en el lab), retención ≤ política (p. ej. 7 días) y `last_known_good` con prefijo `cp-`. Si se pierde `budget`/`no_prod_write` o el LKG está vacío, `RESTORE_LAST_KNOWN_GOOD` o `REVIEW_COMPACTION_LOSS`. Entrada: memoria + política. Salida: memoria compacta + LKG. Error: drop de restricción crítica → no continuar el run.",
        "En `CASO-AYA-049`, compactar el log puede borrar pasos ruidosos (`paso_ruidoso`, `log_largo`), pero `case_id`, `budget` y `no_prod_write` deben sobrevivir y el LKG apunta a `cp-7`. Evidencia: diff de sets de facts antes/después. Sin PII ni secretos en la memoria de demo.",
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
        title: "LKG o nada",
        content:
          "Si la compaction pierde una restricción crítica (`budget`, `no_prod_write`), restaura el last-known-good. Seguir sin LKG no es recovery.",
      },
    },
    {
      heading: "Stopping conditions y budgets",
      subtopicId: "S49-T4-A",
      paragraphs: [
        "Las **stopping conditions** incluyen meta alcanzada, máximo de pasos, tokens y costo. El lab usa `cost_pen` / `max_cost_pen` como **penalización de costo sintética** (no es moneda real): te obliga a comparar consumo frente al techo en cada iteración. Agotar presupuesto produce estado explícito (`STOP_BUDGET_EXHAUSTED`), no un loop infinito ni un «éxito inventado» porque el modelo «estaba cerca».",
        "Mecanismo de budget: exige `goal_met` y `steps` ≤ `max_steps` y `tokens` ≤ `max_tokens` y `cost_pen` ≤ `max_cost_pen`. Si falta `max_cost_pen` en la config, pide `ASK_FOR_SCOPE_REDUCTION` en lugar de seguir a ciegas. Entrada: contadores del run. Salida: continue o stop con razón legible en el log. Error: steps/cost sobre techo → stop con razón, no retry ciego ni elevar el techo sin humano.",
        "En `CASO-AYA-049`, 4 pasos / 3200 tokens / 0.04 de costo bajo techos 6 / 5000 / 0.06 con meta cumplida es PASS; 20 pasos y 0.4 de costo se detienen. Evidencia: string de parada en el log (`GOAL_MET` o `STOP_BUDGET_EXHAUSTED`). Sin PII.",
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
        title: "Stop con razón",
        content:
          "Al agotar `max_steps`, `max_tokens` o `max_cost_pen`, emite `STOP_BUDGET_EXHAUSTED` con la razón en el log. No inventes techo ni éxito.",
      },
    },
    {
      heading: "Sandbox, human approval y recuperación",
      subtopicId: "S49-T4-B",
      paragraphs: [
        "El **sandbox** limita filesystem y red (`network=none`, `filesystem=workspace-read` en el lab). Acciones sensibles (enviar, mutar prod, riesgo alto) exigen **aprobación humana contextual** — ligada a la tool y a la llamada, no un checkbox genérico en el README. La **recuperación** reanuda desde checkpoint y **nunca** vuelve a ejecutar side effects ya aplicados (`replayed_effects` debe quedar en 0). Un recovery que «vuelve a enviar el correo» no es recovery: es un incidente.",
        "Mecanismo de gate: red cerrada, FS de workspace, si `approval_required` entonces `approval_present`, checkpoint `cp-*` y `replayed_effects == 0`. Breach (red abierta, efectos duplicados, FS root-write) → `SANDBOX_AND_STOP`. Evidencia incompleta de replay o acción prod sin humano → `REQUEST_HUMAN_APPROVAL`. Entrada: política de sandbox + flags. Salida: allow/deny + ruta de recovery. Error: `prod_send` sin aprobación de esa tool → needs_human, no envío silencioso.",
        "En `CASO-AYA-049`, el agente prepara la propuesta y un checkpoint; `search_docs` corre en sandbox; `prod_send` sin aprobación se detiene. Recovery = `resume_checkpoint`, sin efectos duplicados. Sin PII ni red abierta en el happy path. Este cierre es el que S50 evaluará con red team y suites de gate.",
      ],
      code: {
        language: 'python',
        title: "sandbox_human_approval_recovery.py",
        code: `def run_tool(name: str, approved_for: str | None, replayed: int) -> str:
    if replayed > 0:
        return "SANDBOX_AND_STOP"
    if name.startswith("prod_") and approved_for != name:
        return "REQUEST_HUMAN_APPROVAL"
    return "sandbox_ok"

print(run_tool("search_docs", None, 0))
print(run_tool("prod_send", None, 0))
print(run_tool("prod_send", "prod_send", 2))`,
        output: `sandbox_ok
REQUEST_HUMAN_APPROVAL
SANDBOX_AND_STOP`,
      },
      callout: {
        type: "tip",
        title: "HITL y anti-replay",
        content:
          "La acción de producción es imposible sin aprobación de esa tool; documenta riesgo residual y límites del laboratorio basado en stdlib. Conserva evidencia de `SANDBOX_AND_STOP` y de `REQUEST_HUMAN_APPROVAL`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro ocho demostraciones de S49 (*Agentes, herramientas y context engineering*) alineadas al gate CP-N4-C. Cada una calcula un micro-mecanismo — decisión ADR, loop *evaluator–optimizer*, *tool call* con idempotencia, contexto JIT, *compaction/LKG*, budget o approval — y no se limita a imprimir etiquetas. Imita estos pasos en el laboratorio y en el portfolio.",
    steps: [
      {
        demoId: "S49-T1-A-DEMO",
        subtopicId: "S49-T1-A",
        environment: "local-python",
        description: "Demo: workflow vs. agente con baseline (fail-closed)",
        code: {
          language: 'python',
          title: "demo_workflow_vs_agent.py",
          code: `def adr_mode(
    known_steps: bool,
    baseline: float,
    agent: float,
    plan_bounded: bool,
) -> dict:
    if known_steps and baseline >= agent:
        return {"mode": "workflow", "reason": "baseline_wins"}
    if agent > baseline and plan_bounded:
        return {"mode": "agent_candidate", "reason": "beats_baseline_with_plan"}
    return {"mode": "need_evidence", "reason": "no_silent_agent_promote"}

print(adr_mode(True, 0.96, 0.90, False))
print(adr_mode(False, 0.40, 0.80, True))
print(adr_mode(True, 0.70, 0.88, False))
print(adr_mode(False, 0.40, 0.80, False))`,
          output: `{'mode': 'workflow', 'reason': 'baseline_wins'}
{'mode': 'agent_candidate', 'reason': 'beats_baseline_with_plan'}
{'mode': 'need_evidence', 'reason': 'no_silent_agent_promote'}
{'mode': 'need_evidence', 'reason': 'no_silent_agent_promote'}`,
        },
        why: "Modela la decisión ADR de `workflow vs. agente` con métricas locales y plan acotado: workflow si baseline gana; agent_candidate solo con plan; need_evidence si faltan garantías. Evidencia: decisión + razón, sin servicio externo.",
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
        description: "Demo: sandbox, approval y recovery sin efectos duplicados",
        code: {
          language: 'python',
          title: "demo_sandbox_human_approval_recovery.py",
          code: `def gate(action: str, network: str, approved_for: str | None, replayed: int) -> str:
    if network != "none" or replayed > 0:
        return "SANDBOX_AND_STOP"
    if action.startswith("prod_") and approved_for != action:
        return "REQUEST_HUMAN_APPROVAL"
    return "ALLOW_RESUME_CHECKPOINT"

print(gate("search_docs", "none", None, 0))
print(gate("prod_send", "none", None, 0))
print(gate("prod_send", "open", "prod_send", 0))
print(gate("prepare_report", "none", "prepare_report", 2))`,
          output: `ALLOW_RESUME_CHECKPOINT
REQUEST_HUMAN_APPROVAL
SANDBOX_AND_STOP
SANDBOX_AND_STOP`,
        },
        why: "Combina red cerrada, aprobación ligada a la acción y anti-replay: prod sin approved_for pide humano; red abierta o efectos duplicados detienen. Evidencia: gate fail-closed.",
      },
    ],
  },
  weDo: {
    intro: "S49 · Laboratorio de agentes y tools en tres capas sobre ocho fixtures sintéticos (`CASO-AYA-049-1A` … `4B`).\n\n**E1 (guiado):** repara una función de dominio con defecto deliberado (`workflow_preferred`, `bounded_loop_ok`, `is_srp_tool`, `tool_call_ok`, `context_ok`, `compaction_ok`, `budget_ok`, `sandbox_ok`).\n\n**E2 (independiente):** reutiliza esa función en una tabla de tres filas (válido / adverso situacional / missing) y emite códigos de acción (`KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, …).\n\n**E3 (transfer):** enruta `CONTINUE` / breach / incertidumbre sin inventar evidencia.\n\nGradual release: construyes el mecanismo → lo calificas → lo operas *fail-closed*. El portfolio une registry, budgets, checkpoints y approval humano. Nota: `KEEP_DETERMINISTIC_WORKFLOW` significa *no promocionar el agente aún* (conserva el workflow hasta justificación completa).",
    steps: [
      {
        id: "S49-T1-A-E1",
        subtopicId: "S49-T1-A",
        kind: "guided",
        instruction: "S49-T1-A-E1 · Implementa `workflow_preferred(record)` para el ADR de `workflow vs. agente` sobre `CASO-AYA-049-1A`. Debe devolver True solo cuando pasos conocidos, pocas ramas, tool choice cierta y baseline ≥ agente. El starter promueve agente sin necesidad: corrige la función, no los datos. Salida exacta: `S49-T1-A PASS`.",
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
        instruction: "S49-T1-A-E2 · Tabla ADR de `workflow vs. agente` en tres filas. (1) plantilla fija, baseline 0.96 ≥ agente 0.9 → `PASS`. (2) path abierto sin justificación completa → `KEEP_DETERMINISTIC_WORKFLOW` (no promociones aún). (3) sin `agent_success` → `MISSING:agent_success`. Reutiliza `workflow_preferred` del E1 en `assess`.",
        hint: "Primero se calcula `missing`; ningún acceso a agent_success debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a agent_success debe ocurrir antes de esa rama.",
          "Si el registro está completo, llama `workflow_preferred(record)` y mapea True→PASS / False→KEEP_DETERMINISTIC_WORKFLOW.",
        ],
        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `agent_success` ausente y produce exactamente `PASS KEEP_DETERMINISTIC_WORKFLOW MISSING:agent_success`.",
        feedback: "S49-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa KEEP_DETERMINISTIC_WORKFLOW y por qué faltar agent_success exige RUN_AGENT_BASELINE.",
        starterCode: {
          language: 'python',
          title: "s49-t1-a-e2.py",
          code: `# CASO-AYA-049 · assess KEEP_DETERMINISTIC_WORKFLOW
# DEFECT: workflow_preferred / assess promueven agente cuando baseline basta
# Contrato: corrige las funciones de dominio; salida alineada al assert del ejercicio
def workflow_preferred(record: dict) -> bool:
    # DEFECT: invierte la regla ADR
    return not record["known_steps"] or record["agent_success"] > record["baseline_success"]

def assess(record: dict) -> str:
    required = {"case_id", "known_steps", "branch_count", "tool_choice_uncertain", "baseline_success", "agent_success"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if workflow_preferred(record) else "KEEP_DETERMINISTIC_WORKFLOW"

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
          code: `def workflow_preferred(record: dict) -> bool:
    return (
        record["known_steps"]
        and record["branch_count"] <= 3
        and not record["tool_choice_uncertain"]
        and record["baseline_success"] >= record["agent_success"]
    )

def assess(record: dict) -> str:
    required = {"case_id", "known_steps", "branch_count", "tool_choice_uncertain", "baseline_success", "agent_success"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if workflow_preferred(record) else "KEEP_DETERMINISTIC_WORKFLOW"

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
        instruction: "S49-T1-A-E3 · Opera el gate de promoción: con `CASO-AYA-049-1A` completo y baseline ganador emite `CONTINUE`; con path abierto (known_steps=False, muchas ramas) emite `KEEP_DETERMINISTIC_WORKFLOW` (no promociones agentic); sin `agent_success` emite `RUN_AGENT_BASELINE`. No trates missing como breach ni inventes la métrica. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `RUN_AGENT_BASELINE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RUN_AGENT_BASELINE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla ADR de E1 (workflow cuando pasos conocidos y baseline gana); solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
        tests: "Fixtures `CASO-AYA-049-1A`, adverso y sin `agent_success` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S49-T1-A-E3: ¿por qué un path abierto con agent_success alto aún emite KEEP_DETERMINISTIC_WORKFLOW (no promocionar sin plan acotado), y por qué falta agent_success fuerza RUN_AGENT_BASELINE?",
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
        instruction: "S49-T1-B-E2 · Audita tres trayectorias del loop planner/worker/evaluator: (1) ruta `report` con plan 3≤5, outputs=3 y eval True, (2) ruta `unknown` con plan 12 y eval False, (3) traza sin `evaluator_pass`. Reutiliza `bounded_loop_ok` dentro de `assess`. Salidas exactas: `PASS`, `STOP_AGENT_LOOP`, `MISSING:evaluator_pass`.",
        hint: "Primero se calcula `missing`; ningún acceso a evaluator_pass debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a evaluator_pass debe ocurrir antes de esa rama.",
          "Si el registro está completo, `PASS` solo cuando `bounded_loop_ok(record)` es True; si no, `STOP_AGENT_LOOP`.",
        ],
        edgeCases: ["falta evaluator_pass", "adverso: route inválida, plan_steps>max o evaluator_pass=False", "CASO-AYA-049-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `evaluator_pass` ausente y produce exactamente `PASS STOP_AGENT_LOOP MISSING:evaluator_pass`.",
        feedback: "S49-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_AGENT_LOOP y por qué faltar evaluator_pass exige REPLAN_WITH_BOUNDS.",
        starterCode: {
          language: 'python',
          title: "s49-t1-b-e2.py",
          code: `# CASO-AYA-049 · assess STOP_AGENT_LOOP
# DEFECT: bounded_loop_ok / assess aceptan plan sobre max o eval fallida
# Contrato: corrige las funciones de dominio; salida alineada al assert del ejercicio
def bounded_loop_ok(record: dict) -> bool:
    # DEFECT: aprueba loops rotos
    return record["plan_steps"] > record["max_steps"] or not record["evaluator_pass"]

def assess(record: dict) -> str:
    required = {"case_id", "route", "plan_steps", "max_steps", "worker_outputs", "evaluator_pass"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if bounded_loop_ok(record) else "STOP_AGENT_LOOP"

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
          code: `def bounded_loop_ok(record: dict) -> bool:
    return (
        record["route"] in {"case", "report"}
        and record["plan_steps"] <= record["max_steps"]
        and record["worker_outputs"] == record["plan_steps"]
        and record["evaluator_pass"]
    )

def assess(record: dict) -> str:
    required = {"case_id", "route", "plan_steps", "max_steps", "worker_outputs", "evaluator_pass"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if bounded_loop_ok(record) else "STOP_AGENT_LOOP"

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
        instruction: "S49-T1-B-E3 · Cierra el loop evaluator–optimizer en producción sintética: trayectoria acotada y eval True → `CONTINUE`; plan o ruta inválidos → `STOP_AGENT_LOOP`; sin bandera de evaluator → `REPLAN_WITH_BOUNDS` (no asumas pass). Corrige el starter que trata missing como CONTINUE y acepta loops rotos. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `REPLAN_WITH_BOUNDS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REPLAN_WITH_BOUNDS` antes de evaluar el contenido.",
          "Para datos completos reutiliza bounded_loop_ok (ruta, plan≤max, outputs=plan, eval True); solo ese caso devuelve `CONTINUE`.",
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
        instruction: "S49-T2-A-E2 · Revisa el catálogo de tools del agente de reportes: (1) `get_case_status` SRP, (2) god-tool `do_everything` multi-duty, (3) tool sin flag `typed_errors`. Implementa o reutiliza `is_srp_tool` y clasifica. Salidas exactas: `PASS`, `DISABLE_OVERBROAD_TOOL`, `MISSING:typed_errors`.",
        hint: "Primero se calcula `missing`; ningún acceso a typed_errors debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a typed_errors debe ocurrir antes de esa rama.",
          "PASS solo si is_srp_tool: responsibilities==1, schema {case_id}, sin side_effect y typed_errors True.",
        ],
        edgeCases: ["falta typed_errors", "adverso: responsibilities>1, schema amplio o side_effect no acotado", "CASO-AYA-049-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `typed_errors` ausente y produce exactamente `PASS DISABLE_OVERBROAD_TOOL MISSING:typed_errors`.",
        feedback: "S49-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_OVERBROAD_TOOL y por qué faltar typed_errors exige SPLIT_TOOL_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s49-t2-a-e2.py",
          code: `# CASO-AYA-049 · assess DISABLE_OVERBROAD_TOOL
# DEFECT: is_srp_tool / assess aprueban multi-duty o side effect
# Contrato: corrige las funciones de dominio; salida alineada al assert del ejercicio
def is_srp_tool(record: dict) -> bool:
    # DEFECT: acepta tools multi-responsabilidad
    return record["responsibilities"] > 1 or record["side_effect"]

def assess(record: dict) -> str:
    required = {"case_id", "tool", "responsibilities", "schema_fields", "side_effect", "typed_errors"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if is_srp_tool(record) else "DISABLE_OVERBROAD_TOOL"

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
          code: `def is_srp_tool(record: dict) -> bool:
    return (
        record["responsibilities"] == 1
        and record["schema_fields"] == {"case_id"}
        and not record["side_effect"]
        and record["typed_errors"]
    )

def assess(record: dict) -> str:
    required = {"case_id", "tool", "responsibilities", "schema_fields", "side_effect", "typed_errors"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if is_srp_tool(record) else "DISABLE_OVERBROAD_TOOL"

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
        instruction: "S49-T2-A-E3 · Decide si el registry se promociona al agente: tool SRP válida → `CONTINUE`; god-tool o multi-side-effect → `DISABLE_OVERBROAD_TOOL`; contrato incompleto sin `typed_errors` → `SPLIT_TOOL_CONTRACT` (no promociones con schema ambiguo). Corrige missing→CONTINUE y el predicado invertido del starter. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `SPLIT_TOOL_CONTRACT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `SPLIT_TOOL_CONTRACT` antes de evaluar el contenido.",
          "Para datos completos reutiliza is_srp_tool; solo True devuelve `CONTINUE`.",
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
        instruction: "S49-T2-B-E2 · Simula el log de tool calls: (1) `report:prepare` con key y effects=1 tras retry, (2) `prod:write` fuera de grant con effects=2 y kind basura, (3) call sin `error_kind`. Reutiliza `tool_call_ok` dentro de `assess`. Salidas exactas: `PASS`, `DENY_TOOL_CALL`, `MISSING:error_kind`.",
        hint: "Primero se calcula `missing`; ningún acceso a error_kind debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a error_kind debe ocurrir antes de esa rama.",
          "PASS solo si tool_call_ok: schema, scope granted, key no vacía, effects==1 y error_kind tipado.",
        ],
        edgeCases: ["falta error_kind", "adverso: scope no granted, effects>1 o schema inválido", "CASO-AYA-049-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `error_kind` ausente y produce exactamente `PASS DENY_TOOL_CALL MISSING:error_kind`.",
        feedback: "S49-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DENY_TOOL_CALL y por qué faltar error_kind exige CLASSIFY_TOOL_ERROR.",
        starterCode: {
          language: 'python',
          title: "s49-t2-b-e2.py",
          code: `# CASO-AYA-049 · assess DENY_TOOL_CALL
# DEFECT: tool_call_ok / assess aprueban scope prohibido o multi-efecto
# Contrato: corrige las funciones de dominio; salida alineada al assert del ejercicio
def tool_call_ok(record: dict) -> bool:
    # DEFECT: aprueba llamadas fuera de grant o no idempotentes
    return record["scope"] not in record["granted"] or record["effects"] > 1

def assess(record: dict) -> str:
    required = {"case_id", "schema_valid", "scope", "granted", "idempotency_key", "attempts", "effects", "error_kind"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if tool_call_ok(record) else "DENY_TOOL_CALL"

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
          code: `def tool_call_ok(record: dict) -> bool:
    return (
        record["schema_valid"]
        and record["scope"] in record["granted"]
        and bool(record["idempotency_key"])
        and record["effects"] == 1
        and record["error_kind"] in {"retryable", "terminal"}
    )

def assess(record: dict) -> str:
    required = {"case_id", "schema_valid", "scope", "granted", "idempotency_key", "attempts", "effects", "error_kind"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if tool_call_ok(record) else "DENY_TOOL_CALL"

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
        instruction: "S49-T2-B-E3 · Enruta la política de tool-use fail-closed: call con schema/scope/idempotencia correctos → `CONTINUE`; scope no granted o multi-efecto → `DENY_TOOL_CALL`; sin `error_kind` tipado → `CLASSIFY_TOOL_ERROR` (no ejecutes a ciegas). Corrige missing→CONTINUE y el predicado del starter. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `CLASSIFY_TOOL_ERROR` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CLASSIFY_TOOL_ERROR` antes de evaluar el contenido.",
          "Para datos completos reutiliza tool_call_ok; solo True devuelve `CONTINUE`.",
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
        instruction: "S49-T3-A-E2 · Mide el attention budget de tres packs de contexto: (1) 1200≤2000 tokens con JIT+checkpoint+provenance, (2) 9000 tokens sin JIT ni checkpoint, (3) pack sin `provenance`. Reutiliza `context_ok` dentro de `assess`. Salidas exactas: `PASS`, `COMPACT_AND_CHECKPOINT`, `MISSING:provenance`.",
        hint: "Primero se calcula `missing`; ningún acceso a provenance debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a provenance debe ocurrir antes de esa rama.",
          "PASS solo si context_ok: tokens≤max, JIT, checkpoint_after_effect y provenance True.",
        ],
        edgeCases: ["falta provenance", "adverso: tokens>max, sin JIT o sin checkpoint post-efecto", "CASO-AYA-049-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `provenance` ausente y produce exactamente `PASS COMPACT_AND_CHECKPOINT MISSING:provenance`.",
        feedback: "S49-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa COMPACT_AND_CHECKPOINT y por qué faltar provenance exige RETRIEVE_MINIMUM_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s49-t3-a-e2.py",
          code: `# CASO-AYA-049 · assess COMPACT_AND_CHECKPOINT
# DEFECT: context_ok / assess aprueban overflow o falta de checkpoint
# Contrato: corrige las funciones de dominio; salida alineada al assert del ejercicio
def context_ok(record: dict) -> bool:
    # DEFECT: aprueba desborde de tokens o falta de checkpoint
    return record["context_tokens"] > record["max_context_tokens"] or not record["checkpoint_after_effect"]

def assess(record: dict) -> str:
    required = {"case_id", "context_tokens", "max_context_tokens", "retrieved_just_in_time", "checkpoint_after_effect", "provenance"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if context_ok(record) else "COMPACT_AND_CHECKPOINT"

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
          code: `def context_ok(record: dict) -> bool:
    return (
        record["context_tokens"] <= record["max_context_tokens"]
        and record["retrieved_just_in_time"]
        and record["checkpoint_after_effect"]
        and record["provenance"]
    )

def assess(record: dict) -> str:
    required = {"case_id", "context_tokens", "max_context_tokens", "retrieved_just_in_time", "checkpoint_after_effect", "provenance"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if context_ok(record) else "COMPACT_AND_CHECKPOINT"

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
        instruction: "S49-T3-A-E3 · Decide si el paso del agente puede correr con el contexto actual: bajo techo + JIT + checkpoint → `CONTINUE`; overflow o sin checkpoint → `COMPACT_AND_CHECKPOINT`; sin provenance → `RETRIEVE_MINIMUM_CONTEXT` (no ejecutes con hechos huérfanos). Corrige missing→CONTINUE y el predicado invertido. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `RETRIEVE_MINIMUM_CONTEXT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RETRIEVE_MINIMUM_CONTEXT` antes de evaluar el contenido.",
          "Para datos completos reutiliza context_ok; solo True devuelve `CONTINUE`.",
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
        instruction: "S49-T3-B-E2 · Diff de memoria post-compaction: (1) facts críticos conservados + LKG `cp-7`, (2) drop de `budget`/`no_prod_write` con retención 365 y LKG vacío, (3) registro sin `last_known_good`. Reutiliza `compaction_ok` dentro de `assess`. Salidas exactas: `PASS`, `RESTORE_LAST_KNOWN_GOOD`, `MISSING:last_known_good`.",
        hint: "Primero se calcula `missing`; ningún acceso a last_known_good debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a last_known_good debe ocurrir antes de esa rama.",
          "PASS solo si compaction_ok: facts_before ⊆ facts_after, retención ≤7 y LKG con prefijo cp-.",
        ],
        edgeCases: ["falta last_known_good", "adverso: pérdida de facts críticos o LKG vacío", "CASO-AYA-049-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `last_known_good` ausente y produce exactamente `PASS RESTORE_LAST_KNOWN_GOOD MISSING:last_known_good`.",
        feedback: "S49-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa RESTORE_LAST_KNOWN_GOOD y por qué faltar last_known_good exige REVIEW_COMPACTION_LOSS.",
        starterCode: {
          language: 'python',
          title: "s49-t3-b-e2.py",
          code: `# CASO-AYA-049 · assess RESTORE_LAST_KNOWN_GOOD
# DEFECT: compaction_ok / assess aprueban drop de facts o LKG vacío
# Contrato: corrige las funciones de dominio; salida alineada al assert del ejercicio
def compaction_ok(record: dict) -> bool:
    # DEFECT: aprueba pérdida de restricciones o LKG vacío
    return not record["facts_before"] <= record["facts_after"] or not record["last_known_good"]

def assess(record: dict) -> str:
    required = {"case_id", "facts_before", "facts_after", "memory_retention_days", "last_known_good"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if compaction_ok(record) else "RESTORE_LAST_KNOWN_GOOD"

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
          code: `def compaction_ok(record: dict) -> bool:
    return (
        record["facts_before"] <= record["facts_after"]
        and record["memory_retention_days"] <= 7
        and record["last_known_good"].startswith("cp-")
    )

def assess(record: dict) -> str:
    required = {"case_id", "facts_before", "facts_after", "memory_retention_days", "last_known_good"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if compaction_ok(record) else "RESTORE_LAST_KNOWN_GOOD"

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
        instruction: "S49-T3-B-E3 · Protege recovery: compactación segura con LKG → `CONTINUE`; pérdida de restricciones críticas o LKG vacío → `RESTORE_LAST_KNOWN_GOOD`; sin campo LKG → `REVIEW_COMPACTION_LOSS` (revisión humana del diff de facts). No continúes si no puedes nombrar el checkpoint de rollback. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_COMPACTION_LOSS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_COMPACTION_LOSS` antes de evaluar el contenido.",
          "Para datos completos reutiliza compaction_ok; solo True devuelve `CONTINUE`.",
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
        instruction: "S49-T4-A-E2 · Ledger de presupuesto sintético: (1) meta cumplida con steps/tokens/cost_pen bajo techo, (2) 20 pasos y cost_pen 0.4 sobre max, (3) run sin `max_cost_pen` configurado. Reutiliza `budget_ok` dentro de `assess`. Salidas exactas: `PASS`, `STOP_BUDGET_EXHAUSTED`, `MISSING:max_cost_pen`.",
        hint: "Primero se calcula `missing`; ningún acceso a max_cost_pen debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a max_cost_pen debe ocurrir antes de esa rama.",
          "PASS solo si budget_ok: goal_met y contadores steps/tokens/cost_pen ≤ sus máximos.",
        ],
        edgeCases: ["falta max_cost_pen", "adverso: steps/tokens/cost sobre max o goal_met=False", "CASO-AYA-049-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_cost_pen` ausente y produce exactamente `PASS STOP_BUDGET_EXHAUSTED MISSING:max_cost_pen`.",
        feedback: "S49-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_BUDGET_EXHAUSTED y por qué faltar max_cost_pen exige ASK_FOR_SCOPE_REDUCTION.",
        starterCode: {
          language: 'python',
          title: "s49-t4-a-e2.py",
          code: `# CASO-AYA-049 · assess STOP_BUDGET_EXHAUSTED
# DEFECT: budget_ok / assess aprueban steps/cost sobre techo
# Contrato: corrige las funciones de dominio; salida alineada al assert del ejercicio
def budget_ok(record: dict) -> bool:
    # DEFECT: aprueba agotamiento de presupuesto
    return record["steps"] > record["max_steps"] or record["cost_pen"] > record["max_cost_pen"]

def assess(record: dict) -> str:
    required = {"case_id", "goal_met", "steps", "max_steps", "tokens", "max_tokens", "cost_pen", "max_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if budget_ok(record) else "STOP_BUDGET_EXHAUSTED"

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
          code: `def budget_ok(record: dict) -> bool:
    return (
        record["goal_met"]
        and record["steps"] <= record["max_steps"]
        and record["tokens"] <= record["max_tokens"]
        and record["cost_pen"] <= record["max_cost_pen"]
    )

def assess(record: dict) -> str:
    required = {"case_id", "goal_met", "steps", "max_steps", "tokens", "max_tokens", "cost_pen", "max_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if budget_ok(record) else "STOP_BUDGET_EXHAUSTED"

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
        instruction: "S49-T4-A-E3 · Aplica stopping conditions operativas: meta dentro de budgets → `CONTINUE`; steps/tokens/cost sobre techo → `STOP_BUDGET_EXHAUSTED` (con razón en el log de tu portfolio); sin `max_cost_pen` en config → `ASK_FOR_SCOPE_REDUCTION` (reduce scope, no inventes techo). Corrige missing→CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `ASK_FOR_SCOPE_REDUCTION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASK_FOR_SCOPE_REDUCTION` antes de evaluar el contenido.",
          "Para datos completos reutiliza budget_ok; solo True devuelve `CONTINUE`.",
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
        instruction: "S49-T4-B-E1 · Implementa `sandbox_ok(record)` para sandbox/HITL/recovery sobre `CASO-AYA-049-4B`. Debe exigir network=none, FS workspace-read, approval si aplica, checkpoint `cp-*` y replayed_effects==0. El starter aprueba red abierta y efectos duplicados: corrige la función. Salida exacta: `S49-T4-B PASS`.",
        hint: "Si approval_required es True, approval_present también debe ser True; replayed_effects > 0 es siempre breach.",
        hints: [
          "Si approval_required es True, approval_present también debe ser True; replayed_effects > 0 es siempre breach.",
          "network distinto de `none` o filesystem que no sea workspace-read fallan el sandbox del lab.",
        ],
        edgeCases: ["falta replayed_effects", "adverso: network open, sin approval o replayed_effects>0", "CASO-AYA-049-4B es sintético"],
        tests: "El fixture `CASO-AYA-049-4B` hace que `sandbox_ok` sea True; imprime `S49-T4-B PASS` y el assert pasa.",
        feedback: "S49-T4-B-E1: por qué recovery debe reanudar desde checkpoint y nunca volver a ejecutar side effects.",
        starterCode: {
          language: 'python',
          title: "s49-t4-b-e1.py",
          code: `# CASO-AYA-049 · sandbox network + human approval
# DEFECT: sandbox_ok True con red abierta, sin HITL o efectos duplicados
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
        instruction: "S49-T4-B-E2 · Matriz de política sandbox+HITL: (1) network none + FS workspace-read + approval + cp-9 + replay 0, (2) network open + root-write + sin approval + replay 2, (3) sin contador `replayed_effects`. Reutiliza `sandbox_ok` dentro de `assess`. Salidas exactas: `PASS`, `SANDBOX_AND_STOP`, `MISSING:replayed_effects`.",
        hint: "Primero se calcula `missing`; ningún acceso a replayed_effects debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a replayed_effects debe ocurrir antes de esa rama.",
          "PASS solo si sandbox_ok: red none, FS workspace-read, approval si aplica, cp-* y replayed_effects==0.",
        ],
        edgeCases: ["falta replayed_effects", "adverso: network open, sin approval o replayed_effects>0", "CASO-AYA-049-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `replayed_effects` ausente y produce exactamente `PASS SANDBOX_AND_STOP MISSING:replayed_effects`.",
        feedback: "S49-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa SANDBOX_AND_STOP y por qué faltar replayed_effects exige REQUEST_HUMAN_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s49-t4-b-e2.py",
          code: `# CASO-AYA-049 · assess SANDBOX_AND_STOP
# DEFECT: sandbox_ok / assess aprueban red abierta, sin HITL o efectos duplicados
# Contrato: corrige las funciones de dominio; salida alineada al assert del ejercicio
def sandbox_ok(record: dict) -> bool:
    # DEFECT: aprueba network open, falta de approval o replay
    return record["network"] == "open" or not record["approval_present"] or record["replayed_effects"] > 0

def assess(record: dict) -> str:
    required = {"case_id", "network", "filesystem", "sensitive_action", "approval_required", "approval_present", "checkpoint", "replayed_effects"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if sandbox_ok(record) else "SANDBOX_AND_STOP"

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
          code: `def sandbox_ok(record: dict) -> bool:
    return (
        record["network"] == "none"
        and record["filesystem"] == "workspace-read"
        and (not record["approval_required"] or record["approval_present"])
        and record["checkpoint"].startswith("cp-")
        and record["replayed_effects"] == 0
    )

def assess(record: dict) -> str:
    required = {"case_id", "network", "filesystem", "sensitive_action", "approval_required", "approval_present", "checkpoint", "replayed_effects"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if sandbox_ok(record) else "SANDBOX_AND_STOP"

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
        instruction: "S49-T4-B-E3 · Cierra CP-N4-C en el lab: sandbox + approval + recovery limpio → `CONTINUE`; red abierta, efectos duplicados o FS inseguro → `SANDBOX_AND_STOP`; sin evidencia de `replayed_effects` → `REQUEST_HUMAN_APPROVAL` (no reanudes a ciegas). Corrige missing→CONTINUE y el predicado invertido del starter. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_HUMAN_APPROVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_HUMAN_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza sandbox_ok; solo True devuelve `CONTINUE`.",
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
    context: "Construye un **mini-lab de agente acotado** (stdlib) para preparación de reportes de una entidad ficticia en Ayacucho (`CASO-AYA-049`). Entrada: goal, catálogo de tools con scope, budgets (`max_steps` / `max_cost_pen`) y política de sandbox. Salida: propuesta trazable + checkpoint; **nunca** un cambio de producción ni red abierta. El run se detiene (fail-closed) si la tool no está permitida, el argumento es inválido, el presupuesto se agota, falta aprobación o el estado es incierto. Integra lo aprendido en T1–T4: ADR workflow/agente, loop evaluator acotado, registry SRP+idempotencia, JIT/checkpoint y gate HITL.",
    objectives: [
      "Documentar ADR workflow vs. agente con baseline local y razón explícita.",
      "Implementar un loop planner/worker/evaluator con `max_steps` y stop por eval o presupuesto.",
      "Exponer un registry de tools con schema, least privilege, idempotency store y errores tipados.",
      "Demostrar context JIT + checkpoint y recovery sin efectos duplicados; side effects sensibles con approval humano.",
      "Automatizar tres escenarios: normal (PASS), breach (`STOP_AGENT` / `SANDBOX_AND_STOP`) e incierto (`REQUEST_HUMAN_APPROVAL`).",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-AYA-049`.",
      "Incluye decisión workflow versus agente con métricas baseline/agent en el ADR o README del lab.",
      "Incluye router/planner/worker/evaluator acotados con traza de roles serializable.",
      "Incluye tools con schema, idempotencia y least privilege (al menos una tool de lectura y una con side_effect).",
      "Incluye checkpoints, budgets, stopping conditions y aprobación humana para side effects.",
      "Automatiza un caso normal, uno de breach (`STOP_AGENT` o código de acción equivalente) y uno incierto (`HUMAN_APPROVAL` / `REQUEST_HUMAN_APPROVAL`).",
      "Incluye comandos locales reproducibles, dependencias fijadas (stdlib) y salida esperada en el README.",
      "Registra riesgo residual, responsable, criterio de rollback (LKG) y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-AYA-049"
TOOLS = {
    "get_case": {"scope": "case:read", "side_effect": False},
    "prepare_report": {"scope": "report:prepare", "side_effect": True},
}
GRANTED = {"case:read", "report:prepare"}
BUDGET = {"max_steps": 6, "max_cost_pen": 0.06}
CRITICAL_FACTS = {"case_id", "budget", "no_prod_write"}
idempotency_store: dict[str, dict] = {}
checkpoints: list[str] = []

REQUIRED = [
    "decision_workflow_versus_agente",
    "router_planner_worker_evaluator_acotados",
    "tools_con_schema_idempotencia_y_least_privilege",
    "checkpoints_budgets_stopping_conditions_y_aprobacion",
]
evidence = {name: False for name in REQUIRED}

def decide_mode(known_steps: bool, baseline: float, agent: float, plan_bounded: bool = False) -> str:
    if known_steps and baseline >= agent:
        return "workflow"
    if agent > baseline and plan_bounded:
        return "agent_candidate"
    return "need_evidence"

def call_tool(name: str, key: str, approved_for: str | None = None) -> dict:
    """Micro-registry: scope, aprobación ligada a la tool e idempotencia."""
    tool = TOOLS[name]
    if tool["scope"] not in GRANTED:
        return {"error": "forbidden", "kind": "terminal"}
    if tool["side_effect"] and approved_for != name:
        return {"error": "needs_approval", "kind": "terminal"}
    if key in idempotency_store:
        return idempotency_store[key]
    result = {"ok": True, "name": name, "effect": 1 if tool["side_effect"] else 0}
    idempotency_store[key] = result
    if tool["side_effect"]:
        checkpoints.append(f"cp-after-{name}")
    return result

def within_budget(steps: int, cost_pen: float) -> bool:
    return steps <= BUDGET["max_steps"] and cost_pen <= BUDGET["max_cost_pen"]

def compact_ok(facts_after: set) -> bool:
    return CRITICAL_FACTS <= facts_after

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

# Smoke de mecanismos (stdlib). READY exige evidencia real en evidence + artefactos del repo.
print("mode_hint", decide_mode(True, 0.96, 0.90, plan_bounded=False))
print("read", call_tool("get_case", "get_case:C1"))
print("prep_no_approval", call_tool("prepare_report", "prep:C1"))
print("prep_ok", call_tool("prepare_report", "prep:C1", approved_for="prepare_report"))
print("prep_replay", call_tool("prepare_report", "prep:C1", approved_for="prepare_report"))
print("budget_ok", within_budget(4, 0.04), "budget_over", within_budget(20, 0.4))
print("compact", compact_ok(CRITICAL_FACTS | {"ruido"} - {"ruido"}))
print("checkpoints", checkpoints)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-C · agente acotado con aprobación humana: muestra ADR con baseline, traza de roles, log de tool calls (incl. replay idempotente), checkpoint/LKG, razón de stop y riesgo residual. La lista de verificación inicia en BLOCKED por diseño; conviértela en READY enlazando artefactos reales del proyecto (tests, README, logs), no cambiando asserts a True a mano.",
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
        question: "¿Qué evidencia permite aprobar `workflow vs. agente` en `CASO-AYA-049`?",
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
        options: ["reemplazarlo por datos reales sin consentimiento", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "subir secretos para facilitar la demo", "abrir network=open y omitir el sandbox del lab"],
        correctIndex: 1,
        explanation: "Los casos son sintéticos, mínimos y trazables; abrir red o omitir sandbox rompe el alcance del lab y del gate CP-N4-C.",
      },
      {
        question: "Una *tool* con `side_effect` y sin `approval_present` en red abierta debe…",
        options: ["bloquearse hasta approval y scope en granted", "ejecutarse para maximizar autonomía", "elevar privilegios de red automáticamente", "reproducir effects en cada replay sin log"],
        correctIndex: 0,
        explanation: "Tool-use fail-closed: side effects y network abiertos requieren approval y scope explícitos.",
      },
      {
        question: "¿Qué práctica reduce el «attention budget» sin perder una restricción crítica?",
        options: ["volcar todo el historial y todos los docs al prompt", "borrar el checkpoint para ahorrar tokens", "compactar conservando hechos/decisiones con provenance y LKG", "volver a ejecutar side effects en cada recovery"],
        correctIndex: 2,
        explanation: "Compaction + LKG es el contrato de S49-T3: menos tokens, sin perder restricciones ni efectos duplicados.",
      },
      {
        question: "Si `steps > max_steps` o `cost_pen > max_cost_pen`, el agente debe…",
        options: ["continuar hasta cumplir el goal a cualquier costo", "abrir network=open automáticamente", "duplicar effects para compensar", "detenerse con razón de presupuesto y no inventar éxito"],
        correctIndex: 3,
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
      { label: "Stanford CS224N", url: "https://web.stanford.edu/class/cs224n/", note: "Fundamentos de NLP (referencia opcional, no es el núcleo de agentes)" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Python y asserts (repaso si hace falta stdlib)" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles (repaso)" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first (repaso de progressive disclosure)" },
    ],
  },
}
