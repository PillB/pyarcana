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
        preamble:
          "Antes de abrir un loop de agente sobre reportes de Ayacucho, el equipo debe **elegir el modo** con métricas, no por moda. En esta demo cuatro escenarios sintéticos (`known_steps`, baseline vs. agent, `plan_bounded`) devuelven `workflow`, `agent_candidate` o `need_evidence`. No escribas aún: predice el `mode` de cada fila y fíjate en que un agente «mejor» sin plan acotado **no** se promociona. Si crees que «falta evidencia = agente igual», el ADR miente y el lab se convierte en riesgo de side effects.",
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
        why: "`adr_mode` modela el contrato de promote local: baseline gana con pasos conocidos ⇒ `workflow`; agent solo si gana **y** hay plan acotado; en cualquier otro caso `need_evidence`. La razón va en el dict para auditar, no un string suelto. Orden: decisión de modo antes del router. En We Do repararás `workflow_preferred` invertido, la tabla PASS/KEEP/MISSING y el decide CONTINUE/KEEP/RUN_AGENT_BASELINE.",
        retrospective:
          "Si puedes explicar por qué un `agent_success` alto con plan sin cota no es promote, ya tienes el hábito de ADR fail-closed. El error clásico es promocionar agente «por descarte». En We Do practicarás el predicado, las tres rutas y la rama de incertidumbre cuando falta `agent_success`.",
      },
      {
        demoId: "S49-T1-B-DEMO",
        subtopicId: "S49-T1-B",
        environment: "local-python",
        description: "Demo: loop planner/worker/evaluator acotado",
        preamble:
          "Habiendo elegido el modo, el riesgo es un **loop sin techo**. En esta demo un evaluator–optimizer recorre scores con `max_iters`: si un score ≥ 0.9, cierra con evaluator pass; si agota el tope sin pasar, emite `STOP_AGENT_LOOP`. No escribas: predice la traza corta (pasa en iter 2) y la larga (stop). Si crees que «casi listo» justifica otra vuelta sin cota, el costo y el riesgo crecen sin evidencia de promote.",
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
        why: "El tope `max_iters` recorta `scores`; cada iter añade worker + evaluator; solo score ≥ 0.9 cierra en verde; si no, stop explícito. Evidencia = trayectoria de roles serializable. En We Do practicarás `bounded_loop_ok`, assess STOP/MISSING y decide REPLAN_WITH_BOUNDS.",
        retrospective:
          "Un agente sin cota no es «más inteligente»: es un while con factura. El error clásico es seguir porque el último score «iba mejorando». Pregunta: con scores `[0.4, 0.5]` y `max_iters=2`, ¿qué token de stop imprime y por qué no CONTINUE? We Do: predicado de loop acotado, tres rutas y REPLAN_WITH_BOUNDS.",
      },
      {
        demoId: "S49-T2-A-DEMO",
        subtopicId: "S49-T2-A",
        environment: "local-python",
        description: "Demo: filtrar tools de responsabilidad única",
        preamble:
          "El agente de Ayacucho solo puede invocar tools que un humano elegiría con certeza mirando el catálogo. En esta demo `audit_tools` separa `get_case` y `search_docs` (1 responsabilidad, schema corto) de `do_everything` (6 responsabilidades, `raw`). No escribas: predice `allow` y `disable`. Si crees que el nombre «do_everything» basta porque el prompt lo describe, el least privilege ya se rompió antes del primer call.",
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
        why: "El filtro usa `responsibilities == 1` y `len(schema) <= 2`; lo demás va a `disable`. Evidencia de contrato sin frameworks. En We Do practicarás `is_srp_tool` estricto (`schema == {case_id}`, sin side_effect, typed_errors), assess DISABLE/MISSING y decide SPLIT_TOOL_CONTRACT.",
        retrospective:
          "SRP de tool = una cosa observable y auditable. El error clásico es «una sola tool para todo el caso». Pregunta: ¿por qué `raw` en schema impide auditar el side effect? We Do: predicado, tres rutas y SPLIT_TOOL_CONTRACT.",
      },
      {
        demoId: "S49-T2-B-DEMO",
        subtopicId: "S49-T2-B",
        environment: "local-python",
        description: "Demo: permisos + idempotencia en tool call",
        preamble:
          "Una tool de preparación de reporte puede reintentarse; **no** puede cobrar dos veces el side effect. En esta demo `call_tool` chequea scope en `granted`, guarda por `idempotency_key` y reusa el resultado en el segundo call; `prod:write` fuera del grant devuelve error terminal. No escribas: predice los tres dicts (ok, ok replay, forbidden). Si crees que `attempts` debe igualar `effects`, el retry se convierte en incidente.",
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
        why: "Allowlist primero; key en store ⇒ replay sin nuevo efecto; scope denegado es terminal tipado. Evidencia = store serializable. En We Do practicarás `tool_call_ok` (schema, key, effects==1, error_kind), assess DENY/MISSING y decide CLASSIFY_TOOL_ERROR.",
        retrospective:
          "Misma key ⇒ un solo effect aunque attempts suba. El error clásico es reintentar write sin store. We Do: predicado de call segura, tres rutas y clasificación de error.",
      },
      {
        demoId: "S49-T3-A-DEMO",
        subtopicId: "S49-T3-A",
        environment: "local-python",
        description: "Demo: retrieval JIT y checkpoint",
        preamble:
          "El contexto del agente de Ayacucho es un **presupuesto de atención**, no un cajón de basura. En esta demo `build_context` recupera solo hits de la query: C1 bajo 2000 tokens pasa con checkpoint; el manual genérico de 2000 tokens con techo 500 falla a `COMPACT_AND_CHECKPOINT`. No escribas: predice status, tokens y checkpoint. Si crees que volcar todo el corpus «por si acaso» mejora el run, subes costo, latencia y riesgo de fuga.",
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
        why: "Filtra por query, suma tokens; desborde o sin hits ⇒ compactar; ok incluye checkpoint post-retrieve. En We Do practicarás `context_ok` (tokens≤max, JIT, checkpoint, provenance), assess COMPACT/MISSING y decide RETRIEVE_MINIMUM_CONTEXT.",
        retrospective:
          "JIT + checkpoint = elegir hechos y poder reanudar. El error clásico es «el modelo se las arreglará con 9k tokens». We Do: predicado de contexto mínimo, tres rutas y provenance.",
      },
      {
        demoId: "S49-T3-B-DEMO",
        subtopicId: "S49-T3-B",
        environment: "local-python",
        description: "Demo: compaction que conserva LKG",
        preamble:
          "Compactar el log del agente de Ayacucho puede borrar ruido; **no** puede borrar `budget` ni `no_prod_write`. En esta demo `compact_memory` deja facts críticos + LKG `cp-7` en el caso bueno, y emite `RESTORE_LAST_KNOWN_GOOD` si el drop rompe el conjunto crítico. No escribas: predice ambos status. Si crees que recovery = «volver a ejecutar el write», el LKG dejó de ser recovery y pasó a incidente.",
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
        why: "`CRITICAL <= after` es el invariante; si falla, se apunta al LKG sin inventar facts. En We Do practicarás `compaction_ok` (⊆, retención ≤7, prefijo `cp-`), assess RESTORE/MISSING y decide REVIEW_COMPACTION_LOSS.",
        retrospective:
          "LKG es el último checkpoint seguro, no un string decorativo. El error clásico es compactar borrando la restricción que evitaba prod write. We Do: predicado, tres rutas y revisión humana del diff.",
      },
      {
        demoId: "S49-T4-A-DEMO",
        subtopicId: "S49-T4-A",
        environment: "local-python",
        description: "Demo: loop con budgets y razón de parada",
        preamble:
          "El agente de Ayacucho no «casi termina»: o cumple la meta bajo techo o se detiene con razón. En esta demo `agent_steps` acumula `cost_pen` 0.02 por paso: con techo 0.06 y goal en paso 3 emite `GOAL_MET`; con techo 0.03 se corta en `STOP_BUDGET_EXHAUSTED`. No escribas: predice ambos strings. Si crees que el modelo puede inventar éxito porque «iba bien», el log del portfolio miente.",
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
        why: "El loop chequea costo antes de la meta; stop lleva step y cost_pen legibles. `cost_pen` es sintético del lab, no moneda real. En We Do practicarás `budget_ok` (goal + steps/tokens/cost ≤ max), assess STOP/MISSING y decide ASK_FOR_SCOPE_REDUCTION.",
        retrospective:
          "Stop con razón es evidencia; inventar techo no lo es. El error clásico es elevar max_cost_pen sin humano. We Do: predicado de budget, tres rutas y reducción de scope.",
      },
      {
        demoId: "S49-T4-B-DEMO",
        subtopicId: "S49-T4-B",
        environment: "local-python",
        description: "Demo: sandbox, approval y recovery sin efectos duplicados",
        preamble:
          "Preparar un borrador en sandbox no es lo mismo que `prod_send`. En esta demo `gate` exige `network=none`, approval **por acción** y `replayed==0`: search pasa; prod sin approved_for pide humano; red open o replay detienen con `SANDBOX_AND_STOP`. No escribas: predice las cuatro salidas. Si crees que un checkbox genérico del README autoriza cualquier tool, el gate CP-N4-C ya falló.",
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
        why: "Red abierta o efectos duplicados ganan a la approval; approval debe igualar el nombre de la acción `prod_*`. Evidencia fail-closed. En We Do practicarás `sandbox_ok` (none, workspace-read, approval si aplica, cp-*, replay 0), assess SANDBOX/MISSING y decide REQUEST_HUMAN_APPROVAL.",
        retrospective:
          "Recovery = reanudar desde checkpoint sin re-ejecutar side effects. El error clásico es «volver a enviar el correo» al recuperar. We Do: predicado, tres rutas y HITL cuando falta evidencia de replay.",
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
        title: "Preferir workflow cuando baseline gana",
        preamble:
          "- **Contexto:** en `CASO-AYA-049-1A`, el equipo de reportes en Ayacucho solo abre un agente si el baseline no alcanza **y** el plan está justificado.\n- **Meta:** corregir `workflow_preferred` (pasos conocidos, pocas ramas, tool choice cierta, baseline ≥ agent).\n- **Éxito:** imprimes exactamente `S49-T1-A PASS` con el fixture válido.\n- **Límites:** no inventes métricas; no borres el assert; no toques los datos del fixture; no «promuevas» agente reescribiendo el status a mano.",
        instruction:
          "1. Abre el starter: `workflow_preferred` devuelve True cuando *no* hay pasos conocidos o el agente gana (bug: invierte el ADR).\n2. Exige `known_steps`, `branch_count <= 3`, `not tool_choice_uncertain` y `baseline_success >= agent_success`.\n3. Conserva el print `S49-T1-A` y el status PASS / KEEP_DETERMINISTIC_WORKFLOW.\n4. No mutes el record del fixture.",
        hint: "La demo de T1-A usa `known_steps and baseline >= agent`; aquí también acotas `branch_count` y `tool_choice_uncertain`.",
        hints: [
          "La demo de T1-A usa `known_steps and baseline >= agent`; aquí también acotas `branch_count` y `tool_choice_uncertain`.",
          "El fixture válido tiene baseline 0.96 ≥ agent 0.9: la función correcta devuelve True y el status es PASS.",
        ],
        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
        tests: "El fixture `CASO-AYA-049-1A` hace que `workflow_preferred` sea True; imprime `S49-T1-A PASS` y el assert pasa.",
        feedback:
          "PASS exige las cuatro anclas a la vez. Con baseline 0.96 ≥ agent 0.9 y pasos conocidos el ADR elige workflow; invertir la regla marca PASS justo cuando conviene *no* abrir el agente.",
        retrospective:
          "Las cuatro anclas a la vez (pasos conocidos, ≤3 ramas, tool choice cierta, baseline ≥ agent) son el contrato de «no abras el loop». El starter marca True justo cuando conviene KEEP. Pregunta: si baseline=0.96 y agent=0.9 con `known_steps`, ¿por qué PASS no es «anti-IA»? Siguiente (E2): válido / path abierto / missing `agent_success`.",
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
        title: "Tres rutas ADR (PASS / KEEP / MISSING)",
        preamble:
          "- **Contexto:** el revisor del ADR en Ayacucho no trata igual un caso limpio, un path abierto y un registro sin métrica de agente.\n- **Meta:** implementar `assess` que distinga PASS, KEEP_DETERMINISTIC_WORKFLOW y MISSING:agent_success.\n- **Éxito:** imprime `PASS KEEP_DETERMINISTIC_WORKFLOW MISSING:agent_success` en ese orden.\n- **Límites:** si falta `agent_success`, no evalúes el predicado; no inventes el campo; missing ≠ «promover agente».",
        instruction:
          "1. Revisa el starter: con campos presentes invierte la preferencia de workflow.\n2. Primero: calcula `missing` de required; si hay → `MISSING:…`.\n3. Luego: llama `workflow_preferred` → PASS o KEEP_DETERMINISTIC_WORKFLOW.\n4. Imprime los tres resultados con `print(*results)`.",
        hint: "Primero se calcula `missing`; ningún acceso a agent_success debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a agent_success debe ocurrir antes de esa rama.",
          "Si el registro está completo, llama `workflow_preferred(record)` y mapea True→PASS / False→KEEP_DETERMINISTIC_WORKFLOW.",
        ],
        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `agent_success` ausente y produce exactamente `PASS KEEP_DETERMINISTIC_WORKFLOW MISSING:agent_success`.",
        feedback:
          "El path abierto activa KEEP (no promociones aún). Faltar `agent_success` es MISSING, no FAIL de contenido: el revisor del ADR pide medir baseline antes de abrir el loop.",
        retrospective:
          "Un `agent_success` ausente no es un path abierto: es evidencia de medición incompleta. Path abierto (`known_steps=False`, agent > baseline) sí es KEEP. El error clásico es inventar 0.8 para «completar» la tabla. Pregunta: ¿en qué orden evalúas missing vs `workflow_preferred`, y por qué? Luego (E3): CONTINUE / KEEP / RUN_AGENT_BASELINE.",
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
        title: "Decide modo: CONTINUE o baseline",
        preamble:
          "- **Contexto:** en el run de reportes de Ayacucho, un ADR incompleto no «sigue con warning»: o continúa con evidencia o pide baseline.\n- **Meta:** `decide` → CONTINUE (workflow justificado), KEEP_DETERMINISTIC_WORKFLOW (path abierto), RUN_AGENT_BASELINE (sin agent_success).\n- **Éxito:** `CONTINUE KEEP_DETERMINISTIC_WORKFLOW RUN_AGENT_BASELINE`.\n- **Límites:** no inventes `agent_success`; no conviertas missing en CONTINUE; no toques los fixtures.",
        instruction:
          "1. Corrige missing: sin `agent_success` → `RUN_AGENT_BASELINE` (no CONTINUE).\n2. Con record completo, reutiliza la regla ADR de E1 (pasos conocidos, ramas acotadas, baseline ≥ agent).\n3. Solo el limpio es CONTINUE; el path abierto es KEEP_DETERMINISTIC_WORKFLOW.\n4. Imprime los tres códigos en orden (`print(*results)`).",
        hint: "Una ausencia no equivale a breach: enrútala a `RUN_AGENT_BASELINE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RUN_AGENT_BASELINE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla ADR de E1 (workflow cuando pasos conocidos y baseline gana); solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
        tests: "Fixtures `CASO-AYA-049-1A`, adverso y sin `agent_success` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Un path abierto con agent_success alto aún es KEEP: no promociones sin plan acotado. Falta agent_success fuerza RUN_AGENT_BASELINE — medir, no inventar el score.",
        retrospective:
          "Un campo ausente es medición pendiente, no un allow optimista. El error clásico es abrir el agente «mientras tanto» sin baseline. Pregunta: ¿por qué KEEP no es lo mismo que RUN_AGENT_BASELINE?",
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
        title: "Loop acotado con evaluator en True",
        preamble:
          "- **Contexto:** en `CASO-AYA-049-1B`, la ruta `report` del agente de Ayacucho solo continúa si el plan cabe en `max_steps` y el evaluator cierra en True.\n- **Meta:** corregir `bounded_loop_ok` (ruta permitida, plan ≤ max, outputs = plan, eval True).\n- **Éxito:** imprimes `S49-T1-B PASS`.\n- **Límites:** rutas solo `case`/`report`; no inventes evaluator_pass; no borres el assert.",
        instruction:
          "1. Abre el starter: devuelve True cuando el plan *supera* max o eval falla (bug invertido).\n2. Exige `route in {case, report}`, `plan_steps <= max_steps`, `worker_outputs == plan_steps`, `evaluator_pass`.\n3. Conserva print `S49-T1-B` y status PASS/STOP_AGENT_LOOP.\n4. No mutes el fixture.",
        hint: "Rutas válidas en el lab: `case` y `report`. El worker debe completar exactamente `plan_steps` outputs.",
        hints: [
          "Rutas válidas en el lab: `case` y `report`. El worker debe completar exactamente `plan_steps` outputs.",
          "Si plan_steps > max_steps o evaluator_pass es False, la función debe devolver False (luego STOP_AGENT_LOOP en E2).",
        ],
        edgeCases: ["falta evaluator_pass", "adverso: route inválida, plan_steps>max o evaluator_pass=False", "CASO-AYA-049-1B es sintético"],
        tests: "El fixture `CASO-AYA-049-1B` hace que `bounded_loop_ok` sea True; imprime `S49-T1-B PASS` y el assert pasa.",
        feedback:
          "Con plan 3 ≤ max 5, outputs 3 y eval True el loop es sano. Si plan_steps=12 con max=5, el planner falla primero aunque el worker «quiera» seguir.",
        retrospective:
          "Cota + evaluator + outputs==plan son el contrato del loop, no logging. Si plan_steps=12 con max=5, el planner falla primero aunque el worker «quiera» seguir. Pregunta: ¿por qué `worker_outputs == plan_steps` importa además del score? Siguiente: PASS / STOP / MISSING:evaluator_pass.",
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
        title: "Tres trayectorias del loop (PASS / STOP / MISSING)",
        preamble:
          "- **Contexto:** el revisor de trazas en Ayacucho no confunde un loop limpio, uno desbordado y una traza sin bandera de evaluator.\n- **Meta:** `assess` → PASS, STOP_AGENT_LOOP, MISSING:evaluator_pass.\n- **Éxito:** `PASS STOP_AGENT_LOOP MISSING:evaluator_pass`.\n- **Límites:** sin `evaluator_pass` no evalúes el contenido; no inventes el campo.",
        instruction:
          "1. Corrige `bounded_loop_ok` (hoy aprueba planes rotos).\n2. Primero `missing`; si hay → MISSING:….\n3. Completo: PASS solo si `bounded_loop_ok`; si no STOP_AGENT_LOOP.\n4. Imprime los tres con `print(*results)`.",
        hint: "Primero se calcula `missing`; ningún acceso a evaluator_pass debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a evaluator_pass debe ocurrir antes de esa rama.",
          "Si el registro está completo, `PASS` solo cuando `bounded_loop_ok(record)` es True; si no, `STOP_AGENT_LOOP`.",
        ],
        edgeCases: ["falta evaluator_pass", "adverso: route inválida, plan_steps>max o evaluator_pass=False", "CASO-AYA-049-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `evaluator_pass` ausente y produce exactamente `PASS STOP_AGENT_LOOP MISSING:evaluator_pass`.",
        feedback:
          "Ruta unknown + plan 12 es STOP. Faltar evaluator_pass es MISSING: no asumas pass «porque el worker terminó»; el revisor de trazas exige la bandera explícita.",
        retrospective:
          "Ruta unknown + plan 12 es breach de cota; falta de `evaluator_pass` es incertidumbre de cierre — no asumas True «porque el worker terminó». El error clásico es STOP por campo ausente. Pregunta: ¿qué imprime assess si solo falta la bandera de eval? Luego (E3): CONTINUE / STOP / REPLAN_WITH_BOUNDS.",
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
        title: "Decide loop: CONTINUE o REPLAN",
        preamble:
          "- **Contexto:** en producción sintética del agente de reportes, un loop sin bandera de evaluator no «sigue de verde».\n- **Meta:** `decide` → CONTINUE, STOP_AGENT_LOOP, REPLAN_WITH_BOUNDS.\n- **Éxito:** `CONTINUE STOP_AGENT_LOOP REPLAN_WITH_BOUNDS`.\n- **Límites:** no trates missing como CONTINUE; no asumas evaluator_pass.",
        instruction:
          "1. Missing → REPLAN_WITH_BOUNDS.\n2. Completo: reutiliza la regla de loop acotado de E1/E2.\n3. Solo trayectoria limpia → CONTINUE; ruta/plan inválidos → STOP_AGENT_LOOP.\n4. Imprime los tres códigos en orden (`print(*results)`).",
        hint: "Una ausencia no equivale a breach: enrútala a `REPLAN_WITH_BOUNDS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REPLAN_WITH_BOUNDS` antes de evaluar el contenido.",
          "Para datos completos reutiliza bounded_loop_ok (ruta, plan≤max, outputs=plan, eval True); solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta evaluator_pass", "adverso: route inválida, plan_steps>max o evaluator_pass=False", "CASO-AYA-049-1B es sintético"],
        tests: "Fixtures `CASO-AYA-049-1B`, adverso y sin `evaluator_pass` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "REPLAN_WITH_BOUNDS pide un plan medible, no castiga. STOP es breach de cota/ruta; missing no es CONTINUE optimista ni STOP de contenido.",
        retrospective:
          "Replanear con cotas no es castigo: es pedir un plan medible. El error clásico es STOP por «falta de campo» o CONTINUE por optimismo. Pregunta: ¿qué rol fallaría primero con plan 12 y max 5?",
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
        title: "Tool SRP con schema de case_id",
        preamble:
          "- **Contexto:** en `CASO-AYA-049-2A`, el registry del agente de reportes solo admite lectura de caso con contrato estrecho.\n- **Meta:** corregir `is_srp_tool` (responsibilities==1, schema `{case_id}`, sin side_effect, typed_errors).\n- **Éxito:** `S49-T2-A PASS`.\n- **Límites:** no amplíes el schema a `raw`; no «arregles» el fixture; no borres el assert.",
        instruction:
          "1. Abre el starter: True si responsibilities>1 o side_effect (bug: aprueba god-tools).\n2. Exige responsibilities==1, schema `{case_id}`, sin side_effect y typed_errors True.\n3. Conserva print `S49-T2-A` y status PASS/DISABLE_OVERBROAD_TOOL.\n4. No mutes el record.",
        hint: "Compara `schema_fields` con el conjunto mínimo `{\"case_id\"}` y exige typed_errors.",
        hints: [
          "Compara `schema_fields` con el conjunto mínimo `{\"case_id\"}` y exige typed_errors.",
          "Una tool de lectura de caso no debería tener side_effect True en este lab.",
        ],
        edgeCases: ["falta typed_errors", "adverso: responsibilities>1, schema amplio o side_effect no acotado", "CASO-AYA-049-2A es sintético"],
        tests: "El fixture `CASO-AYA-049-2A` hace que `is_srp_tool` sea True; imprime `S49-T2-A PASS` y el assert pasa.",
        feedback:
          "`get_case_status` con schema `{case_id}` y typed_errors pasa; `do_everything` con `{raw}` se deshabilita aunque el nombre «suene útil» en el prompt.",
        retrospective:
          "Schema `{case_id}` + typed_errors + sin side_effect son el contrato, no el marketing del prompt. El starter aprueba god-tools. Pregunta: si responsibilities=1 pero schema=`{raw}`, ¿pasa `is_srp_tool` en este lab? Siguiente: PASS / DISABLE / MISSING:typed_errors.",
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
        title: "Auditar catálogo SRP (PASS / DISABLE / MISSING)",
        preamble:
          "- **Contexto:** el revisor del registry en Ayacucho clasifica tools válidas, god-tools y contratos incompletos.\n- **Meta:** `assess` → PASS, DISABLE_OVERBROAD_TOOL, MISSING:typed_errors.\n- **Éxito:** `PASS DISABLE_OVERBROAD_TOOL MISSING:typed_errors`.\n- **Límites:** sin `typed_errors` no evalúes SRP; no inventes el flag.",
        instruction:
          "1. Corrige `is_srp_tool` (hoy acepta multi-duty).\n2. Primero missing; luego PASS/DISABLE.\n3. Reutiliza el predicado estricto de E1.\n4. Imprime los tres resultados (`print(*results)`).",
        hint: "Primero se calcula `missing`; ningún acceso a typed_errors debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a typed_errors debe ocurrir antes de esa rama.",
          "PASS solo si is_srp_tool: responsibilities==1, schema {case_id}, sin side_effect y typed_errors True.",
        ],
        edgeCases: ["falta typed_errors", "adverso: responsibilities>1, schema amplio o side_effect no acotado", "CASO-AYA-049-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `typed_errors` ausente y produce exactamente `PASS DISABLE_OVERBROAD_TOOL MISSING:typed_errors`.",
        feedback:
          "Multi-duty es DISABLE de least privilege. Faltar typed_errors es MISSING de contrato: no es lo mismo que god-tool; el revisor pide SPLIT, no DISABLE por ausencia.",
        retrospective:
          "Multi-duty es breach de least privilege; falta de typed_errors es incertidumbre de contrato. El error clásico es DISABLE por «campo ausente». Pregunta: si solo falta `typed_errors`, ¿DISABLE o MISSING? (respuesta: MISSING en E2). Luego (E3): CONTINUE / DISABLE / SPLIT_TOOL_CONTRACT.",
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
        title: "Decide registry: CONTINUE o SPLIT",
        preamble:
          "- **Contexto:** antes de enganchar el catálogo al agente de Ayacucho, el gate debe fallar cerrado.\n- **Meta:** `decide` → CONTINUE, DISABLE_OVERBROAD_TOOL, SPLIT_TOOL_CONTRACT.\n- **Éxito:** `CONTINUE DISABLE_OVERBROAD_TOOL SPLIT_TOOL_CONTRACT`.\n- **Límites:** no promociones con schema ambiguo; no trates missing como CONTINUE.",
        instruction:
          "1. Missing → SPLIT_TOOL_CONTRACT.\n2. Completo: reutiliza `is_srp_tool`; solo True → CONTINUE.\n3. God-tool / multi-side-effect → DISABLE_OVERBROAD_TOOL.\n4. Imprime los tres códigos en orden (`print(*results)`).",
        hint: "Una ausencia no equivale a breach: enrútala a `SPLIT_TOOL_CONTRACT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `SPLIT_TOOL_CONTRACT` antes de evaluar el contenido.",
          "Para datos completos reutiliza is_srp_tool; solo True devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta typed_errors", "adverso: responsibilities>1, schema amplio o side_effect no acotado", "CASO-AYA-049-2A es sintético"],
        tests: "Fixtures `CASO-AYA-049-2A`, adverso y sin `typed_errors` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE solo con SRP estricto. God-tool o multi-side-effect → DISABLE. CONTINUE sin typed_errors es promote silencioso del registry: el revisor no asume el flag.",
        retrospective:
          "Split no es «más burocracia»: es descomponer hasta que un humano elija la tool con certeza. El error clásico es CONTINUE sin typed_errors. Pregunta: ¿por qué `{raw}` rompe el least privilege?",
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
        title: "Call con scope e idempotencia",
        preamble:
          "- **Contexto:** en `CASO-AYA-049-2B`, el log del agente de Ayacucho solo acepta `report:prepare` con key y un solo effect tras retry.\n- **Meta:** corregir `tool_call_ok` (schema válido, scope granted, key no vacía, effects==1, error_kind tipado).\n- **Éxito:** `S49-T2-B PASS`.\n- **Límites:** no inventes scopes; no borres el assert; attempts puede ser 2 si effects sigue en 1.",
        instruction:
          "1. Abre el starter: True si scope *no* granted o effects>1 (bug invertido).\n2. Exige schema válido, scope en granted, key no vacía, effects==1 y error_kind ∈ {retryable, terminal}.\n3. Conserva print `S49-T2-B` y status PASS/DENY_TOOL_CALL.\n4. No mutes el fixture.",
        hint: "Un retry con la misma idempotency_key puede tener attempts>1, pero effects debe seguir en 1.",
        hints: [
          "Un retry con la misma idempotency_key puede tener attempts>1, pero effects debe seguir en 1.",
          "error_kind solo puede ser retryable o terminal (nunca un dump de secreto).",
        ],
        edgeCases: ["falta error_kind", "adverso: scope no granted, effects>1 o schema inválido", "CASO-AYA-049-2B es sintético"],
        tests: "El fixture `CASO-AYA-049-2B` hace que `tool_call_ok` sea True; imprime `S49-T2-B PASS` y el assert pasa.",
        feedback:
          "Retry con la misma key y effects=1 es PASS. Denegar por scope (`prod:write`) no es lo mismo que denegar por effects duplicados: ambos fallan, por razones distintas.",
        retrospective:
          "Schema, scope granted, key no vacía, effects==1 y kind ∈ {retryable, terminal} son cinco puertas, no una. attempts puede ser 2 si el store reusa el effect. Pregunta: ¿por qué `error_kind=\"secret dump\"` no es válido aunque el resto pase? Siguiente: PASS / DENY / MISSING:error_kind.",
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
        title: "Log de calls (PASS / DENY / MISSING)",
        preamble:
          "- **Contexto:** el revisor del tool log en Ayacucho separa call limpia, breach de scope/efectos y call sin clasificación de error.\n- **Meta:** `assess` → PASS, DENY_TOOL_CALL, MISSING:error_kind.\n- **Éxito:** `PASS DENY_TOOL_CALL MISSING:error_kind`.\n- **Límites:** sin `error_kind` no evalúes el contenido; no inventes «secret dump» como kind válido.",
        instruction:
          "1. Corrige `tool_call_ok` (hoy aprueba fuera de grant).\n2. Primero missing; luego PASS/DENY.\n3. Reutiliza el predicado de E1.\n4. Imprime los tres resultados (`print(*results)`).",
        hint: "Primero se calcula `missing`; ningún acceso a error_kind debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a error_kind debe ocurrir antes de esa rama.",
          "PASS solo si tool_call_ok: schema, scope granted, key no vacía, effects==1 y error_kind tipado.",
        ],
        edgeCases: ["falta error_kind", "adverso: scope no granted, effects>1 o schema inválido", "CASO-AYA-049-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `error_kind` ausente y produce exactamente `PASS DENY_TOOL_CALL MISSING:error_kind`.",
        feedback:
          "Scope denegado o multi-efecto es DENY. Faltar error_kind es MISSING: no ejecutes a ciegas sin tipar el error; el revisor del log exige kind antes del retry.",
        retrospective:
          "Scope denegado o multi-efecto es DENY de política; falta de kind es incertidumbre de retry — no ejecutes a ciegas. El error clásico es inventar `retryable` para forzar PASS. Pregunta: ¿en qué orden miras missing vs `tool_call_ok`? Luego (E3): CONTINUE / DENY / CLASSIFY_TOOL_ERROR.",
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
        title: "Decide tool-use: CONTINUE o CLASSIFY",
        preamble:
          "- **Contexto:** en el run del agente de reportes, un error sin kind no se «resuelve» reintentando.\n- **Meta:** `decide` → CONTINUE, DENY_TOOL_CALL, CLASSIFY_TOOL_ERROR.\n- **Éxito:** `CONTINUE DENY_TOOL_CALL CLASSIFY_TOOL_ERROR`.\n- **Límites:** no ejecutes a ciegas sin error_kind; no trates missing como CONTINUE.",
        instruction:
          "1. Missing → CLASSIFY_TOOL_ERROR.\n2. Completo: reutiliza `tool_call_ok`; solo True → CONTINUE.\n3. Scope/efectos rotos → DENY_TOOL_CALL.\n4. Imprime los tres códigos en orden (`print(*results)`).",
        hint: "Una ausencia no equivale a breach: enrútala a `CLASSIFY_TOOL_ERROR` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CLASSIFY_TOOL_ERROR` antes de evaluar el contenido.",
          "Para datos completos reutiliza tool_call_ok; solo True devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta error_kind", "adverso: scope no granted, effects>1 o schema inválido", "CASO-AYA-049-2B es sintético"],
        tests: "Fixtures `CASO-AYA-049-2B`, adverso y sin `error_kind` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE solo con call limpia (schema, grant, key, un effect, kind tipado). DENY es rechazo de política (scope o effects). Falta kind no se «cura» reintentando: el log del revisor exige CLASSIFY antes del retry.",
        retrospective:
          "Idempotencia: misma key ⇒ un effect aunque attempts suba. El error clásico es CONTINUE con dump de secreto como kind o re-aplicar write sin store. Pregunta: ¿por qué attempts=2 con effects=1 sigue siendo válido en el fixture limpio?",
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
        title: "Contexto bajo techo con JIT",
        preamble:
          "- **Contexto:** en `CASO-AYA-049-3A`, el paso actual del agente solo puede cargar hechos del caso C1 bajo techo con provenance.\n- **Meta:** corregir `context_ok` (tokens ≤ max, JIT, checkpoint_after_effect, provenance).\n- **Éxito:** `S49-T3-A PASS`.\n- **Límites:** no subas el techo a mano; no borres el assert; no inventes provenance.",
        instruction:
          "1. Abre el starter: True si tokens *superan* max o falta checkpoint (bug invertido).\n2. Exige tokens ≤ max, retrieved_just_in_time, checkpoint_after_effect y provenance True.\n3. Conserva print `S49-T3-A` y status PASS/COMPACT_AND_CHECKPOINT.\n4. No mutes el fixture.",
        hint: "El attention budget se viola si context_tokens > max_context_tokens aunque el resto esté bien.",
        hints: [
          "El attention budget se viola si context_tokens > max_context_tokens aunque el resto esté bien.",
          "JIT y provenance deben ser True; el checkpoint debe existir después de un efecto durable.",
        ],
        edgeCases: ["falta provenance", "adverso: tokens>max, sin JIT o sin checkpoint post-efecto", "CASO-AYA-049-3A es sintético"],
        tests: "El fixture `CASO-AYA-049-3A` hace que `context_ok` sea True; imprime `S49-T3-A PASS` y el assert pasa.",
        feedback:
          "1200 ≤ 2000 con JIT+checkpoint+provenance es PASS. Volcar el corpus «porque el modelo aguanta» rompe el contrato aunque el run «funcione» en la laptop.",
        retrospective:
          "Attention budget es política de run (tokens + JIT + checkpoint + provenance), no un tip de prompt. Caber en tokens sin provenance sigue fallando el contrato. Pregunta: ¿qué falta además de tokens≤max en el PASS del fixture? Siguiente: PASS / COMPACT / MISSING:provenance.",
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
        title: "Tres packs de contexto (PASS / COMPACT / MISSING)",
        preamble:
          "- **Contexto:** el revisor de context engineering en Ayacucho no confunde pack limpio, overflow y pack sin provenance.\n- **Meta:** `assess` → PASS, COMPACT_AND_CHECKPOINT, MISSING:provenance.\n- **Éxito:** `PASS COMPACT_AND_CHECKPOINT MISSING:provenance`.\n- **Límites:** sin provenance no evalúes tokens; no inventes el flag.",
        instruction:
          "1. Corrige `context_ok` (hoy aprueba desborde).\n2. Primero missing; luego PASS/COMPACT.\n3. Reutiliza el predicado de E1.\n4. Imprime los tres resultados (`print(*results)`).",
        hint: "Primero se calcula `missing`; ningún acceso a provenance debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a provenance debe ocurrir antes de esa rama.",
          "PASS solo si context_ok: tokens≤max, JIT, checkpoint_after_effect y provenance True.",
        ],
        edgeCases: ["falta provenance", "adverso: tokens>max, sin JIT o sin checkpoint post-efecto", "CASO-AYA-049-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `provenance` ausente y produce exactamente `PASS COMPACT_AND_CHECKPOINT MISSING:provenance`.",
        feedback:
          "9000 tokens sin JIT es COMPACT. Faltar provenance es MISSING: no es overflow; el revisor pide hechos con origen antes de compactar a ciegas.",
        retrospective:
          "Overflow o sin checkpoint es breach de presupuesto; falta de provenance es incertidumbre de hechos. El error clásico es COMPACT por «campo ausente». Pregunta: si solo falta provenance, ¿COMPACT o MISSING? Luego (E3): CONTINUE / COMPACT / RETRIEVE_MINIMUM_CONTEXT.",
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
        title: "Decide contexto: CONTINUE o RETRIEVE",
        preamble:
          "- **Contexto:** en el run del agente de reportes, hechos huérfanos no se ejecutan «por velocidad».\n- **Meta:** `decide` → CONTINUE, COMPACT_AND_CHECKPOINT, RETRIEVE_MINIMUM_CONTEXT.\n- **Éxito:** `CONTINUE COMPACT_AND_CHECKPOINT RETRIEVE_MINIMUM_CONTEXT`.\n- **Límites:** no ejecutes sin provenance; no trates missing como CONTINUE.",
        instruction:
          "1. Missing → RETRIEVE_MINIMUM_CONTEXT.\n2. Completo: reutiliza `context_ok`; solo True → CONTINUE.\n3. Overflow/sin JIT/checkpoint → COMPACT_AND_CHECKPOINT.\n4. Imprime los tres códigos en orden (`print(*results)`).",
        hint: "Una ausencia no equivale a breach: enrútala a `RETRIEVE_MINIMUM_CONTEXT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RETRIEVE_MINIMUM_CONTEXT` antes de evaluar el contenido.",
          "Para datos completos reutiliza context_ok; solo True devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta provenance", "adverso: tokens>max, sin JIT o sin checkpoint post-efecto", "CASO-AYA-049-3A es sintético"],
        tests: "Fixtures `CASO-AYA-049-3A`, adverso y sin `provenance` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE exige pack bajo techo con JIT, checkpoint post-efecto y provenance. Overflow o sin checkpoint → COMPACT_AND_CHECKPOINT. Hechos huérfanos (sin provenance) no se «arreglan» con velocidad: enruta RETRIEVE_MINIMUM_CONTEXT.",
        retrospective:
          "Context engineering es elegir hechos y poder reanudar, no maximizar tokens. El error clásico es CONTINUE con 9k tokens «porque el modelo aguanta». Pregunta: nombra las cuatro condiciones de `context_ok` sin mirar el código.",
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
        title: "Compaction que conserva LKG",
        preamble:
          "- **Contexto:** en `CASO-AYA-049-3B`, la memoria del agente de Ayacucho solo se compacta si las restricciones críticas sobreviven y hay checkpoint `cp-*`.\n- **Meta:** corregir `compaction_ok` (`facts_before ⊆ facts_after`, retención ≤7, LKG con prefijo `cp-`).\n- **Éxito:** `S49-T3-B PASS`.\n- **Límites:** no inventes LKG; no borres el assert; usa `<=` de conjuntos para ⊆.",
        instruction:
          "1. Abre el starter: True si *no* hay inclusión o LKG vacío (bug invertido).\n2. Exige facts_before ⊆ facts_after, retención ≤7 y LKG con `startswith(\"cp-\")`.\n3. Conserva print `S49-T3-B` y status PASS/RESTORE_LAST_KNOWN_GOOD.\n4. No mutes el fixture.",
        hint: "Usa inclusión de conjuntos: `facts_before <= facts_after` en Python significa ⊆.",
        hints: [
          "Usa inclusión de conjuntos: `facts_before <= facts_after` en Python significa ⊆.",
          "last_known_good vacío o sin prefijo cp- no es un checkpoint recuperable.",
        ],
        edgeCases: ["falta last_known_good", "adverso: pérdida de facts críticos o LKG vacío", "CASO-AYA-049-3B es sintético"],
        tests: "El fixture `CASO-AYA-049-3B` hace que `compaction_ok` sea True; imprime `S49-T3-B PASS` y el assert pasa.",
        feedback:
          "Conservar `case_id`/`budget`/`no_prod_write` con LKG `cp-7` es PASS. Borrar `budget` o dejar LKG vacío no es «ahorro de tokens»: es pérdida de recovery.",
        retrospective:
          "Compaction segura = menos ruido con las mismas puertas (`budget`, `no_prod_write`). LKG vacío «porque no hubo efecto» no es recovery. Pregunta: ¿`facts_before <= facts_after` en Python es ⊆ o ⊇? Siguiente: PASS / RESTORE / MISSING:last_known_good.",
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
        title: "Diff de memoria (PASS / RESTORE / MISSING)",
        preamble:
          "- **Contexto:** el revisor de recovery en Ayacucho no confunde compactación limpia, pérdida de restricciones y registro sin campo LKG.\n- **Meta:** `assess` → PASS, RESTORE_LAST_KNOWN_GOOD, MISSING:last_known_good.\n- **Éxito:** `PASS RESTORE_LAST_KNOWN_GOOD MISSING:last_known_good`.\n- **Límites:** sin `last_known_good` no evalúes el diff; no inventes `cp-`.",
        instruction:
          "1. Corrige `compaction_ok` (hoy aprueba drop).\n2. Primero missing; luego PASS/RESTORE.\n3. Reutiliza el predicado de E1.\n4. Imprime los tres resultados (`print(*results)`).",
        hint: "Primero se calcula `missing`; ningún acceso a last_known_good debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a last_known_good debe ocurrir antes de esa rama.",
          "PASS solo si compaction_ok: facts_before ⊆ facts_after, retención ≤7 y LKG con prefijo cp-.",
        ],
        edgeCases: ["falta last_known_good", "adverso: pérdida de facts críticos o LKG vacío", "CASO-AYA-049-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `last_known_good` ausente y produce exactamente `PASS RESTORE_LAST_KNOWN_GOOD MISSING:last_known_good`.",
        feedback:
          "Pérdida de `budget`/`no_prod_write` es RESTORE. Faltar el campo LKG es MISSING: no sigas el run «porque case_id quedó»; el revisor exige checkpoint nombrable.",
        retrospective:
          "Pérdida de facts críticos es breach de recovery; falta de campo LKG es incertidumbre de rollback. El error clásico es seguir el run «porque case_id quedó». Pregunta: si solo falta el campo LKG, ¿RESTORE o MISSING? Luego (E3): CONTINUE / RESTORE / REVIEW_COMPACTION_LOSS.",
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
        title: "Decide recovery: CONTINUE o REVIEW",
        preamble:
          "- **Contexto:** en el run del agente de reportes, sin poder nombrar el checkpoint de rollback no se continúa.\n- **Meta:** `decide` → CONTINUE, RESTORE_LAST_KNOWN_GOOD, REVIEW_COMPACTION_LOSS.\n- **Éxito:** `CONTINUE RESTORE_LAST_KNOWN_GOOD REVIEW_COMPACTION_LOSS`.\n- **Límites:** no continúes sin LKG; no trates missing como CONTINUE.",
        instruction:
          "1. Missing → REVIEW_COMPACTION_LOSS.\n2. Completo: reutiliza `compaction_ok`; solo True → CONTINUE.\n3. Drop de críticos o LKG vacío → RESTORE_LAST_KNOWN_GOOD.\n4. Imprime los tres códigos en orden (`print(*results)`).",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_COMPACTION_LOSS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_COMPACTION_LOSS` antes de evaluar el contenido.",
          "Para datos completos reutiliza compaction_ok; solo True devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta last_known_good", "adverso: pérdida de facts críticos o LKG vacío", "CASO-AYA-049-3B es sintético"],
        tests: "Fixtures `CASO-AYA-049-3B`, adverso y sin `last_known_good` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE solo si el diff conserva críticos, retención ≤7 y LKG `cp-*`. Drop de `no_prod_write` o LKG vacío → RESTORE. Sin campo LKG no inventes `cp-7`: REVIEW_COMPACTION_LOSS es la rama de incertidumbre.",
        retrospective:
          "Review del diff es humano; restore es automático al último checkpoint seguro. El error clásico es CONTINUE tras borrar `no_prod_write` «porque case_id quedó». Pregunta: ¿qué prefijo debe tener un LKG recuperable en este lab?",
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
        title: "Meta dentro de steps y cost_pen",
        preamble:
          "- **Contexto:** en `CASO-AYA-049-4A`, el run de reportes en Ayacucho solo es PASS si la meta se cumplió **y** steps/tokens/cost_pen caben en sus máximos.\n- **Meta:** corregir `budget_ok` (goal_met y contadores ≤ techos).\n- **Éxito:** `S49-T4-A PASS`.\n- **Límites:** no ignores tokens; no inventes max_cost_pen; no borres el assert.",
        instruction:
          "1. Abre el starter: True si steps o cost *superan* el techo (bug invertido).\n2. Exige goal_met y steps/tokens/cost_pen ≤ sus máximos.\n3. Conserva print `S49-T4-A` y status PASS/STOP_BUDGET_EXHAUSTED.\n4. No mutes el fixture.",
        hint: "`cost_pen` es el costo sintético del lab; compáralo con `max_cost_pen`, no ignores tokens.",
        hints: [
          "`cost_pen` es el costo sintético del lab; compáralo con `max_cost_pen`, no ignores tokens.",
          "Si goal_met es False aunque los contadores estén bien, el run aún no es PASS de meta.",
        ],
        edgeCases: ["falta max_cost_pen", "adverso: steps/tokens/cost sobre max o goal_met=False", "CASO-AYA-049-4A es sintético"],
        tests: "El fixture `CASO-AYA-049-4A` hace que `budget_ok` sea True; imprime `S49-T4-A PASS` y el assert pasa.",
        feedback:
          "4 pasos / 3200 tokens / 0.04 de cost bajo techos 6 / 5000 / 0.06 con meta True es PASS. Si cost_pen supera max a mitad de camino, el string de stop es `STOP_BUDGET_EXHAUSTED`, no un PASS optimista.",
        retrospective:
          "Las cuatro condiciones (meta + tres contadores) son el contrato de parada. PASS con goal_met=False es mentira de portfolio. Pregunta: con steps=4, tokens=3200, cost=0.04 y techos 6/5000/0.06, ¿qué falta si goal_met=False? Siguiente: PASS / STOP / MISSING:max_cost_pen.",
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
        title: "Ledger de presupuesto (PASS / STOP / MISSING)",
        preamble:
          "- **Contexto:** el revisor de costos sintéticos en Ayacucho no confunde run limpio, run desbordado y config sin `max_cost_pen`.\n- **Meta:** `assess` → PASS, STOP_BUDGET_EXHAUSTED, MISSING:max_cost_pen.\n- **Éxito:** `PASS STOP_BUDGET_EXHAUSTED MISSING:max_cost_pen`.\n- **Límites:** sin max_cost_pen no evalúes el contenido; no inventes el techo.",
        instruction:
          "1. Corrige `budget_ok` (hoy aprueba agotamiento).\n2. Primero missing; luego PASS/STOP.\n3. Reutiliza el predicado de E1.\n4. Imprime los tres resultados (`print(*results)`).",
        hint: "Primero se calcula `missing`; ningún acceso a max_cost_pen debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a max_cost_pen debe ocurrir antes de esa rama.",
          "PASS solo si budget_ok: goal_met y contadores steps/tokens/cost_pen ≤ sus máximos.",
        ],
        edgeCases: ["falta max_cost_pen", "adverso: steps/tokens/cost sobre max o goal_met=False", "CASO-AYA-049-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_cost_pen` ausente y produce exactamente `PASS STOP_BUDGET_EXHAUSTED MISSING:max_cost_pen`.",
        feedback:
          "20 pasos y cost 0.4 es STOP. Faltar max_cost_pen es MISSING: no inventes 0.06 ni marques STOP por «campo ausente»; el revisor pide scope reduction.",
        retrospective:
          "Steps/cost sobre techo es breach de budget; falta de max_cost_pen es incertidumbre de config. El error clásico es inventar 0.06 o STOP por «campo ausente». Pregunta: si falta max_cost_pen, ¿STOP o MISSING? Luego (E3): CONTINUE / STOP / ASK_FOR_SCOPE_REDUCTION.",
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
        title: "Decide budget: CONTINUE o reducir scope",
        preamble:
          "- **Contexto:** en el run del agente de reportes, sin techo de costo no se «sigue a ciegas».\n- **Meta:** `decide` → CONTINUE, STOP_BUDGET_EXHAUSTED, ASK_FOR_SCOPE_REDUCTION.\n- **Éxito:** `CONTINUE STOP_BUDGET_EXHAUSTED ASK_FOR_SCOPE_REDUCTION`.\n- **Límites:** no inventes techo; no trates missing como CONTINUE; deja razón de stop en el log del portfolio.",
        instruction:
          "1. Missing → ASK_FOR_SCOPE_REDUCTION.\n2. Completo: reutiliza `budget_ok`; solo True → CONTINUE.\n3. Sobre techo o sin meta → STOP_BUDGET_EXHAUSTED.\n4. Imprime los tres códigos en orden (`print(*results)`).",
        hint: "Una ausencia no equivale a breach: enrútala a `ASK_FOR_SCOPE_REDUCTION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASK_FOR_SCOPE_REDUCTION` antes de evaluar el contenido.",
          "Para datos completos reutiliza budget_ok; solo True devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta max_cost_pen", "adverso: steps/tokens/cost sobre max o goal_met=False", "CASO-AYA-049-4A es sintético"],
        tests: "Fixtures `CASO-AYA-049-4A`, adverso y sin `max_cost_pen` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE solo bajo meta y techos. Sobre presupuesto → STOP_BUDGET_EXHAUSTED con razón en el log. Sin `max_cost_pen` no sigas a ciegas ni inventes 0.06: ASK_FOR_SCOPE_REDUCTION.",
        retrospective:
          "Inventar techo es fraude de evidencia; reducir scope es política legítima. El error clásico es CONTINUE con 20 pasos y cost 0.4. Pregunta: ¿qué tres contadores deben caber además de goal_met?",
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
        title: "Sandbox con approval y sin replay",
        preamble:
          "- **Contexto:** en `CASO-AYA-049-4B`, el agente de Ayacucho solo prepara el draft con red cerrada, FS de workspace, approval si aplica y cero efectos rejugados.\n- **Meta:** corregir `sandbox_ok` (network none, FS workspace-read, approval si required, checkpoint `cp-*`, replayed_effects==0).\n- **Éxito:** `S49-T4-B PASS`.\n- **Límites:** no abras network; no borres el assert; replayed > 0 es siempre breach.",
        instruction:
          "1. Abre el starter: True si network open, sin approval o replay>0 (bug invertido).\n2. Exige network none, FS workspace-read, approval si required, checkpoint `cp-*` y replayed_effects==0.\n3. Conserva print `S49-T4-B` y status PASS/SANDBOX_AND_STOP.\n4. No mutes el fixture.",
        hint: "Si approval_required es True, approval_present también debe ser True; replayed_effects > 0 es siempre breach.",
        hints: [
          "Si approval_required es True, approval_present también debe ser True; replayed_effects > 0 es siempre breach.",
          "network distinto de `none` o filesystem que no sea workspace-read fallan el sandbox del lab.",
        ],
        edgeCases: ["falta replayed_effects", "adverso: network open, sin approval o replayed_effects>0", "CASO-AYA-049-4B es sintético"],
        tests: "El fixture `CASO-AYA-049-4B` hace que `sandbox_ok` sea True; imprime `S49-T4-B PASS` y el assert pasa.",
        feedback:
          "prepare-draft con none + workspace-read + approval + cp-9 + replay 0 es PASS. Recovery reanuda desde checkpoint; volver a ejecutar side effects no es recovery — es incidente.",
        retrospective:
          "HITL es contextual a la tool (`approval_present` si required), no un checkbox del README. network=none, FS workspace-read, cp-*, replayed=0 cierran el lab. Pregunta: si replayed_effects=2 y hay approval, ¿PASS o SANDBOX? Siguiente: PASS / SANDBOX / MISSING:replayed_effects.",
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
        title: "Matriz sandbox+HITL (PASS / SANDBOX / MISSING)",
        preamble:
          "- **Contexto:** el revisor de operación en Ayacucho no confunde run sandboxed, breach de red/FS/replay y registro sin contador de replay.\n- **Meta:** `assess` → PASS, SANDBOX_AND_STOP, MISSING:replayed_effects.\n- **Éxito:** `PASS SANDBOX_AND_STOP MISSING:replayed_effects`.\n- **Límites:** sin replayed_effects no evalúes el contenido; no inventes 0.",
        instruction:
          "1. Corrige `sandbox_ok` (hoy aprueba open/replay).\n2. Primero missing; luego PASS/SANDBOX.\n3. Reutiliza el predicado de E1.\n4. Imprime los tres resultados (`print(*results)`).",
        hint: "Primero se calcula `missing`; ningún acceso a replayed_effects debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a replayed_effects debe ocurrir antes de esa rama.",
          "PASS solo si sandbox_ok: red none, FS workspace-read, approval si aplica, cp-* y replayed_effects==0.",
        ],
        edgeCases: ["falta replayed_effects", "adverso: network open, sin approval o replayed_effects>0", "CASO-AYA-049-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `replayed_effects` ausente y produce exactamente `PASS SANDBOX_AND_STOP MISSING:replayed_effects`.",
        feedback:
          "Red open o replay es SANDBOX. Faltar el contador es MISSING: no marques SANDBOX por «campo ausente» ni reanudes a ciegas inventando replay=0.",
        retrospective:
          "Red open o replay es breach de sandbox; falta de contador es incertidumbre de anti-replay. El error clásico es SANDBOX por «campo ausente» o reanudar a ciegas. Pregunta: si falta `replayed_effects`, ¿SANDBOX o MISSING? Luego (E3): CONTINUE / SANDBOX / REQUEST_HUMAN_APPROVAL.",
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
        title: "Decide gate: CONTINUE o pedir humano",
        preamble:
          "- **Contexto:** en el cierre de CP-N4-C para el agente de reportes de Ayacucho, sin evidencia de replay no se reanuda a ciegas.\n- **Meta:** `decide` → CONTINUE, SANDBOX_AND_STOP, REQUEST_HUMAN_APPROVAL.\n- **Éxito:** `CONTINUE SANDBOX_AND_STOP REQUEST_HUMAN_APPROVAL`.\n- **Límites:** no trates missing como CONTINUE; no abras red; no dupliques effects en recovery.",
        instruction:
          "1. Missing → REQUEST_HUMAN_APPROVAL.\n2. Completo: reutiliza `sandbox_ok`; solo True → CONTINUE.\n3. Red/FS/replay/approval rotos → SANDBOX_AND_STOP.\n4. Imprime los tres códigos en orden (`print(*results)`).",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_HUMAN_APPROVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_HUMAN_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza sandbox_ok; solo True devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta replayed_effects", "adverso: network open, sin approval o replayed_effects>0", "CASO-AYA-049-4B es sintético"],
        tests: "Fixtures `CASO-AYA-049-4B`, adverso y sin `replayed_effects` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE solo sandboxed (none, workspace-read, approval si aplica, cp-*, replay 0). Breach de red/FS/replay/approval → SANDBOX_AND_STOP. Sin evidencia de replay no reanudes inventando 0: REQUEST_HUMAN_APPROVAL.",
        retrospective:
          "Recovery = reanudar desde checkpoint **sin** re-ejecutar side effects. El error clásico es CONTINUE con network open «porque hay approval en el README». Pregunta: ¿por qué `approval_present` debe ligarse a la acción y no a un flag global? Esto es lo que S50 evaluará con red team.",
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
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante del gate CP-N4-C demuestras con un test o print (p. ej. misma key ⇒ un effect, o prod sin approval ⇒ needs_human)? (2) ¿qué harías distinto con datos reales vs. `CASO-AYA-049` sintético (PII, red, secretos)? (3) En el README, una frase de impacto medible (antes/después: side effects sin control → fail-closed con LKG y HITL) que puedas defender en 30 segundos ante un revisor de plataforma.",
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
