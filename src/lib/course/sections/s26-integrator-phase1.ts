import type { CourseSection } from '../../types'

export const section26: CourseSection = {
  id: "integrator-phase1",
  index: 26,
  title: "Orquestación y VP RPA + AI Analyst",
  shortTitle: "VP RPA + AI Analyst",
  tagline: "VP RPA + AI Analyst: Excel/sistema → validación → análisis → modelo/IA → informe → aprobación → borrador de correo. Demo con datos sintéticos, evidencia de cada estado y recuperación de fallas",
  estimatedHours: 19,
  level: "Competente",
  phase: 1,
  icon: "Award",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Cierras **CP-N2-C** orquestando Excel/sistema → validación → análisis → IA → informe → aprobación → borrador de correo, con regresión N2 y CF-2. La aprobación humana es obligatoria; matching no equivale a fraude.",
  learningOutcomes: [
    { text: "Modelar tasks/flows/DAG con estados" },
    { text: "Configurar límites, metadata y schedules" },
    { text: "Implementar checkpoints, retry/backoff y dead-letter" },
    { text: "Garantizar idempotencia, concurrencia y rollback" },
    { text: "Diseñar revisión humana de análisis/reporte/destinatario" },
    { text: "Operar aprobación, rechazo, edición y auditoría" },
    { text: "Definir SLO, alerts y runbook" },
    { text: "Validar E2E, seguridad, costo y métricas de valor" },
  ],
  theory: [
    {
      heading: "Cierre CP-N2-C: orquestación del VP y regresión N2",
      paragraphs: [
        "S26 cierra CP-N2-C y prepara la regresión de S14–S26 y CF-2: contratos entre análisis, reporting y automatización.",
        "El flujo canónico: **ingest Excel/sistema → validar → analizar → IA asistida → informe → aprobación humana → draft de correo**. Cada estado deja evidencia.",
        "Orden: **T1 Orquestación** → **T2 Resiliencia** → **T3 HITL** → **T4 Operación/E2E**. Privacidad: scores y matches no son veredictos de fraude.",
      ],
      callout: {
        type: "info",
        title: "Criterio de promoción N2",
        content:
          "La promoción exige CP-N2-A/B/C, regresión S14–S26 y CF-2 aprobados con evidencia reproducible.",
      },
    },
    {
      heading: "tasks/flows/DAG y estados",
      subtopicId: "S26-T1-A",
      paragraphs: [
        "Un **DAG** define dependencias: validar antes de analizar; aprobar antes de draft_email.",
        "Estados de task: pending, running, success, failed, skipped. El flow agrega el estado global.",
        "Implementación didáctica: dict de nodos + edges, ejecución topológica simple.",
      ],
      code: {
        language: 'python',
        title: "dag_states.py",
        code: `from collections import deque

edges = [
    ("ingest", "validate"),
    ("validate", "analyze"),
    ("analyze", "ai_assist"),
    ("ai_assist", "report"),
    ("report", "approve"),
    ("approve", "draft_email"),
]

def topo(edges):
    nodes = set()
    for a, b in edges:
        nodes.add(a); nodes.add(b)
    indeg = {n: 0 for n in nodes}
    adj = {n: [] for n in nodes}
    for a, b in edges:
        adj[a].append(b); indeg[b] += 1
    q = deque([n for n in nodes if indeg[n] == 0])
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order

print(topo(edges))`,
        output: `['ingest', 'validate', 'analyze', 'ai_assist', 'report', 'approve', 'draft_email']`,
      },
      callout: {
        type: "tip",
        title: "Estados visibles",
        content:
          "El dashboard del VP muestra el estado de cada nodo con timestamp.",
      },
    },
    {
      heading: "límites, metadata y schedules",
      subtopicId: "S26-T1-B",
      paragraphs: [
        "**Rate limits** protegen APIs. **Metadata** de run: run_id, trigger, git_sha sintético, data_cutoff.",
        "**Schedules** (cron) vs on-demand. Documenta ventana de mantenimiento.",
        "Límites de concurrencia por cola.",
      ],
      code: {
        language: 'python',
        title: "limits_meta.py",
        code: `run_meta = {
    "run_id": "cpn2c-close-01",
    "trigger": "manual",
    "schedule": None,
    "limits": {"max_parallel_tasks": 2, "api_rpm": 30},
    "data_cutoff": "2026-01-15",
}
print(run_meta["run_id"], run_meta["limits"]["api_rpm"])
# schedule example
cron = "0 6 * * 1-5"  # 06:00 L-V America/Lima conceptual
print("cron", cron, "tz", "America/Lima")`,
        output: `cpn2c-close-01 30
cron 0 6 * * 1-5 tz America/Lima`,
      },
      callout: {
        type: "info",
        title: "Metadata inmutable",
        content:
          "No reescribas metadata tras el start; versiona un nuevo run_id.",
      },
    },
    {
      heading: "checkpoints, retry/backoff y dead-letter",
      subtopicId: "S26-T2-A",
      paragraphs: [
        "**Checkpoint**: guarda progreso para reanudar sin rehacer ingest. **Backoff** exponencial en retries.",
        "**DLQ** (dead-letter queue) aísla items irrecuperables para análisis humano.",
        "No reintentes fallas de validación de negocio eternamente.",
      ],
      code: {
        language: 'python',
        title: "ckpt_dlq.py",
        code: `import random

def backoff_sleep_ms(attempt, base=100, cap=2000):
    return min(cap, base * (2 ** (attempt - 1)))

def process_with_dlq(items, flaky_ids):
    ok, dlq, ckpt = [], [], set()
    for it in items:
        if it in ckpt:
            continue
        if it in flaky_ids:
            dlq.append(it)
        else:
            ok.append(it); ckpt.add(it)
    return ok, dlq, sorted(ckpt)

print([backoff_sleep_ms(i) for i in range(1, 5)])
print(process_with_dlq(["a", "b", "c"], flaky_ids={"b"}))`,
        output: `[100, 200, 400, 800]
(['a', 'c'], ['b'], ['a', 'c'])`,
      },
      callout: {
        type: "warning",
        title: "DLQ no es basurero",
        content:
          "Cada mensaje en DLQ tiene owner y SLA de inspección.",
      },
    },
    {
      heading: "idempotencia, concurrencia y rollback",
      subtopicId: "S26-T2-B",
      paragraphs: [
        "Pasos **idempotentes** con keys de negocio. **Locks** optimistas por run_id/entity.",
        "**Rollback**: compensar efectos (borrar draft, marcar report superseded) si falla un paso posterior.",
        "Documenta el grafo de compensación.",
      ],
      code: {
        language: 'python',
        title: "rollback.py",
        code: `store = {"reports": {}, "drafts": {}}

def write_report(run_id, body):
    store["reports"][run_id] = body
    return run_id

def write_draft(run_id, body):
    store["drafts"][run_id] = body
    return run_id

def rollback(run_id):
    store["drafts"].pop(run_id, None)
    store["reports"].pop(run_id, None)

write_report("r1", "informe")
write_draft("r1", "draft")
rollback("r1")
print("reports", store["reports"], "drafts", store["drafts"])`,
        output: `reports {} drafts {}`,
      },
      callout: {
        type: "tip",
        title: "Compensación",
        content:
          "Rollback no siempre es transacción ACID; define compensaciones explícitas.",
      },
    },
    {
      heading: "revisión de análisis/reporte/destinatario",
      subtopicId: "S26-T3-A",
      paragraphs: [
        "Tres colas HITL: **análisis** (métricas), **reporte** (narrativa), **destinatario** (email verificado).",
        "Cada artefacto tiene checklist. Bloqueo si falta evidencia.",
        "El revisor no confirma fraude ni parentesco; confirma calidad del paquete de evidencia y la decisión operativa (aprobar/rechazar/editar).",
      ],
      code: {
        language: 'python',
        title: "review_queues.py",
        code: `queues = {
    "analysis": [{"id": "a1", "status": "pending"}],
    "report": [{"id": "r1", "status": "pending"}],
    "recipient": [{"id": "c1", "status": "pending"}],
}

def pending_counts(q):
    return {k: sum(1 for x in v if x["status"] == "pending") for k, v in q.items()}

print(pending_counts(queues))
print("all_clear", all(c == 0 for c in pending_counts(queues).values()))`,
        output: `{'analysis': 1, 'report': 1, 'recipient': 1}
all_clear False`,
      },
      callout: {
        type: "info",
        title: "Triple gate",
        content:
          "Sin las tres revisiones en verde, no hay draft_email.",
      },
    },
    {
      heading: "aprobación, rechazo, edición y auditoría",
      subtopicId: "S26-T3-B",
      paragraphs: [
        "Acciones: **approve**, **reject**, **edit** (vuelve a pending con diff). Todo a **audit trail**.",
        "Reject requiere razón. Edit versiona el artefacto.",
        "Sin audit, el capstone no es demostrable.",
      ],
      code: {
        language: 'python',
        title: "audit_hitl.py",
        code: `audit = []

def act(artifact_id, action, actor, reason=None):
    rec = {"id": artifact_id, "action": action, "actor": actor, "reason": reason}
    audit.append(rec)
    return rec

act("report-1", "edit", "ana", reason="clarificar n")
act("report-1", "approve", "luis")
print(len(audit), audit[-1]["action"], audit[0]["reason"])`,
        output: `2 approve clarificar n`,
      },
      callout: {
        type: "warning",
        title: "Razones obligatorias en reject",
        content:
          "Reject sin reason se rechaza a nivel API.",
      },
    },
    {
      heading: "SLO, alerts y runbook",
      subtopicId: "S26-T4-A",
      paragraphs: [
        "**SLO** ejemplos: 95% runs success en 7d; p95 duración < 15 min; 0 envíos sin approve.",
        "**Alerts** cuando burn rate de error sube. **Runbook**: pasos de mitigación y rollback.",
        "Incluye contacto y severidad.",
      ],
      code: {
        language: 'python',
        title: "slo_alerts.py",
        code: `slo = {
    "success_rate_7d": 0.95,
    "p95_duration_min": 15,
    "zero_send_without_approve": True,
}
metrics = {"success_rate_7d": 0.91, "p95_duration_min": 12, "sends_without_approve": 0}

def alerts(m, slo):
    out = []
    if m["success_rate_7d"] < slo["success_rate_7d"]:
        out.append("success_rate_low")
    if m["p95_duration_min"] > slo["p95_duration_min"]:
        out.append("latency_high")
    if m["sends_without_approve"] > 0:
        out.append("P0_unapproved_send")
    return out

print(alerts(metrics, slo))
print("runbook_step", "disable_schedule → drain queue → page oncall")`,
        output: `['success_rate_low']
runbook_step disable_schedule → drain queue → page oncall`,
      },
      callout: {
        type: "danger",
        title: "P0 unapproved send",
        content:
          "Cualquier envío sin approve es incidente P0 aunque sea sandbox mal configurado.",
      },
    },
    {
      heading: "pruebas E2E, seguridad, costo y métricas de valor",
      subtopicId: "S26-T4-B",
      paragraphs: [
        "**E2E** del VP con datos sintéticos: cada nodo success + draft final + audit.",
        "**Seguridad**: secretos, scopes, no PII real. **Costo**: tokens API + minutos RPA.",
        "**Valor**: tiempo humano ahorrado (estimado), tasa de rework, no “fraudes detectados”.",
        "**Regresión N2 (notas)**: reejecutar tests críticos de CP-N2-A/B/C, E2E de integración S14–S26, ítem de recuperación y controles de privacidad/seguridad. Gate: cero fallas críticas y ≥80% evidencia no crítica.",
      ],
      code: {
        language: 'python',
        title: "e2e_value.py",
        code: `def e2e_vp():
    steps = ["ingest", "validate", "analyze", "ai", "report", "approve", "draft"]
    evidence = {s: "success" for s in steps}
    evidence["audit_events"] = 3
    evidence["cost_tokens"] = 1200
    evidence["value_minutes_saved_est"] = 45
    evidence["fraud_labels"] = 0  # debe ser 0: no auto-fraude
    return evidence

ev = e2e_vp()
print("draft", ev["draft"], "audit", ev["audit_events"])
print("cost_tokens", ev["cost_tokens"], "fraud_labels", ev["fraud_labels"])
print("n2_regression_note", "re-run CP-N2-A/B/C critical + privacy checks")`,
        output: `draft success audit 3
cost_tokens 1200 fraud_labels 0
n2_regression_note re-run CP-N2-A/B/C critical + privacy checks`,
      },
      callout: {
        type: "info",
        title: "CF-2 y regresión",
        content:
          "CF-2 fija interfaces entre Familiarity, reporting y automatización. La regresión N2 no se “compensa” entre capstones.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el cierre de CP-N2-C: DAG del VP, resiliencia, HITL triple, SLO y E2E con notas de regresión N2/CF-2 — sin envío real ni fraude automático.",
    steps: [
      {
        demoId: "S26-T1-A-DEMO",
        subtopicId: "S26-T1-A",
        environment: "local/cloud controlado",
        description: "Modelar DAG con estados explícitos.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `order=["ingest","validate","analyze","report","approve","draft_email"]
print(order)
print("n_steps", len(order))`,
          output: `['ingest', 'validate', 'analyze', 'report', 'approve', 'draft_email']
n_steps 6`,
        },
        why: "El orden del VP es el contrato del flow.",
      },
      {
        demoId: "S26-T1-B-DEMO",
        subtopicId: "S26-T1-B",
        environment: "local/cloud controlado",
        description: "Programar con límites y metadata.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `meta={"run_id":"r1","api_rpm":30,"tz":"America/Lima"}
print(meta)`,
          output: `{'run_id': 'r1', 'api_rpm': 30, 'tz': 'America/Lima'}`,
        },
        why: "Metadata habilita auditoría y schedules.",
      },
      {
        demoId: "S26-T2-A-DEMO",
        subtopicId: "S26-T2-A",
        environment: "local/cloud controlado",
        description: "Checkpoint + retry + dead-letter.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `ckpt=set(["a"]); dlq=["b"]
print("resume_from", sorted(ckpt), "dlq", dlq)`,
          output: `resume_from ['a'] dlq ['b']`,
        },
        why: "Reanudar sin rehacer lo exitoso.",
      },
      {
        demoId: "S26-T2-B-DEMO",
        subtopicId: "S26-T2-B",
        environment: "local/cloud controlado",
        description: "Rollback seguro bajo fallo de draft.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `state={"report":"ok","draft":"ok"}
state.pop("draft"); print(state)`,
          output: `{'report': 'ok'}`,
        },
        why: "Compensación explícita.",
      },
      {
        demoId: "S26-T3-A-DEMO",
        subtopicId: "S26-T3-A",
        environment: "local/cloud controlado",
        description: "Colas de revisión multi-artefacto.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `q={"analysis":1,"report":1,"recipient":0}
print(q, "blocked", any(v>0 for v in q.values()))`,
          output: `{'analysis': 1, 'report': 1, 'recipient': 0} blocked True`,
        },
        why: "Triple revisión antes del correo.",
      },
      {
        demoId: "S26-T3-B-DEMO",
        subtopicId: "S26-T3-B",
        environment: "local/cloud controlado",
        description: "Aprobar/rechazar/editar con auditoría.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `audit=[{"action":"approve","actor":"r1"}]
print(audit[0])`,
          output: `{'action': 'approve', 'actor': 'r1'}`,
        },
        why: "Sin audit no hay capstone demostrable.",
      },
      {
        demoId: "S26-T4-A-DEMO",
        subtopicId: "S26-T4-A",
        environment: "local/cloud controlado",
        description: "Definir SLO, alerts y runbook N2.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `slo_ok=0.91<0.95
print("alert_success_rate" if slo_ok else "ok")`,
          output: `alert_success_rate`,
        },
        why: "SLO operativos del VP.",
      },
      {
        demoId: "S26-T4-B-DEMO",
        subtopicId: "S26-T4-B",
        environment: "local/cloud controlado",
        description: "E2E + seguridad + costo + valor (sin fraude auto).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `print({"e2e":"pass","cost_tokens":100,"value_min":30,"fraud_labels":0,"n2_regression":"planned"})`,
          output: `{'e2e': 'pass', 'cost_tokens': 100, 'value_min': 30, 'fraud_labels': 0, 'n2_regression': 'planned'}`,
        },
        why: "Cierre CP-N2-C con notas de regresión N2.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de DAG, limits, checkpoint/DLQ, rollback, colas HITL, audit, SLO y E2E/regresión.",
    steps: [
      {
        id: "S26-T1-A-E1",
        subtopicId: "S26-T1-A",
        kind: "guided",
        instruction:
          "Lista el orden canónico de 4 pasos: ingest,validate,analyze,report.",
        hint: "lista",
        hints: [
          "lista",
          "print",
        ],
        edgeCases: ["draft al final"],
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
          code: `print(['ingest','validate','analyze','report'])`,
          output: `['ingest', 'validate', 'analyze', 'report']`,
        },
      },
      {
        id: "S26-T1-A-E2",
        subtopicId: "S26-T1-A",
        kind: "independent",
        instruction:
          "Cuenta edges en pares (a,b) de un path lineal de 3 nodos.",
        hint: "len edges",
        hints: [
          "len edges",
          "n-1",
        ],
        edgeCases: ["ciclos prohibidos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes=['a','b','c']
# TODO edges
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes=['a','b','c']
edges=list(zip(nodes, nodes[1:]))
print(len(edges), edges)`,
          output: `2 [('a', 'b'), ('b', 'c')]`,
        },
      },
      {
        id: "S26-T1-A-E3",
        subtopicId: "S26-T1-A",
        kind: "transfer",
        instruction:
          "Estado global failed si algún task failed.",
        hint: "any",
        hints: [
          "any",
          "agregación",
        ],
        edgeCases: ["skipped vs failed"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `tasks={'a':'success','b':'failed'}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tasks={'a':'success','b':'failed'}
print('failed' if any(v=='failed' for v in tasks.values()) else 'success')`,
          output: `failed`,
        },
      },
      {
        id: "S26-T1-B-E1",
        subtopicId: "S26-T1-B",
        kind: "guided",
        instruction:
          "Imprime run_id de un dict metadata.",
        hint: "index dict",
        hints: [
          "index dict",
          "key",
        ],
        edgeCases: ["uuid en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `m={'run_id':'cpn2c-1'}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `m={'run_id':'cpn2c-1'}
print(m['run_id'])`,
          output: `cpn2c-1`,
        },
      },
      {
        id: "S26-T1-B-E2",
        subtopicId: "S26-T1-B",
        kind: "independent",
        instruction:
          "Si api_rpm>60 imprime 'too_high'.",
        hint: "umbral",
        hints: [
          "umbral",
          "límites",
        ],
        edgeCases: ["burst vs sustained"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `api_rpm=90
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `api_rpm=90
print('too_high' if api_rpm>60 else 'ok')`,
          output: `too_high`,
        },
      },
      {
        id: "S26-T1-B-E3",
        subtopicId: "S26-T1-B",
        kind: "transfer",
        instruction:
          "Schedule cron string '0 6 * * 1-5' e imprime tz America/Lima.",
        hint: "constantes",
        hints: [
          "constantes",
          "doc",
        ],
        edgeCases: ["DST"],
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
          code: `print('0 6 * * 1-5', 'America/Lima')`,
          output: `0 6 * * 1-5 America/Lima`,
        },
      },
      {
        id: "S26-T2-A-E1",
        subtopicId: "S26-T2-A",
        kind: "guided",
        instruction:
          "backoff ms: base*2**(attempt-1) para attempt=3 base=100.",
        hint: "exponencial",
        hints: [
          "exponencial",
          "print",
        ],
        edgeCases: ["cap"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `attempt, base = 3, 100
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `attempt, base = 3, 100
print(base * (2 ** (attempt - 1)))`,
          output: `400`,
        },
      },
      {
        id: "S26-T2-A-E2",
        subtopicId: "S26-T2-A",
        kind: "independent",
        instruction:
          "Añade 'x' a dlq si falla; imprime dlq.",
        hint: "lista",
        hints: [
          "lista",
          "append",
        ],
        edgeCases: ["owner DLQ"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `dlq=[]
fail=True
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `dlq=[]
fail=True
if fail:
    dlq.append('x')
print(dlq)`,
          output: `['x']`,
        },
      },
      {
        id: "S26-T2-A-E3",
        subtopicId: "S26-T2-A",
        kind: "transfer",
        instruction:
          "Checkpoint set: no reproceses ids ya en ckpt.",
        hint: "set membership",
        hints: [
          "set membership",
          "skip",
        ],
        edgeCases: ["persistencia"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ckpt={'a'}; items=['a','b']
# TODO print to_process
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ckpt={'a'}; items=['a','b']
print([i for i in items if i not in ckpt])`,
          output: `['b']`,
        },
      },
      {
        id: "S26-T2-B-E1",
        subtopicId: "S26-T2-B",
        kind: "guided",
        instruction:
          "Idempotent write: segunda vez no cambia valor.",
        hint: "if key not in",
        hints: [
          "if key not in",
          "store",
        ],
        edgeCases: ["upsert versioned"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `store={}

def put(k,v):
    # TODO only if missing
    pass
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `store={}

def put(k,v):
    if k not in store:
        store[k]=v
put('r','v1'); put('r','v2')
print(store['r'])`,
          output: `v1`,
        },
      },
      {
        id: "S26-T2-B-E2",
        subtopicId: "S26-T2-B",
        kind: "independent",
        instruction:
          "Rollback: borra draft key del state.",
        hint: "pop",
        hints: [
          "pop",
          "dict",
        ],
        edgeCases: ["compensar side effects"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `state={'report':'ok','draft':'ok'}
# TODO
print(state)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `state={'report':'ok','draft':'ok'}
state.pop('draft', None)
print(state)`,
          output: `{'report': 'ok'}`,
        },
      },
      {
        id: "S26-T2-B-E3",
        subtopicId: "S26-T2-B",
        kind: "transfer",
        instruction:
          "Lock: si locked True no entres; imprime 'busy'/'enter'.",
        hint: "flag",
        hints: [
          "flag",
          "concurrencia",
        ],
        edgeCases: ["ttl del lock"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `locked=True
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `locked=True
print('busy' if locked else 'enter')`,
          output: `busy`,
        },
      },
      {
        id: "S26-T3-A-E1",
        subtopicId: "S26-T3-A",
        kind: "guided",
        instruction:
          "Cuenta pending en cola analysis.",
        hint: "sum",
        hints: [
          "sum",
          "status",
        ],
        edgeCases: ["done vs approved"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `analysis=[{'status':'pending'},{'status':'done'}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `analysis=[{'status':'pending'},{'status':'done'}]
print(sum(1 for x in analysis if x['status']=='pending'))`,
          output: `1`,
        },
      },
      {
        id: "S26-T3-A-E2",
        subtopicId: "S26-T3-A",
        kind: "independent",
        instruction:
          "blocked si alguna cola >0.",
        hint: "any",
        hints: [
          "any",
          "values",
        ],
        edgeCases: ["triple gate"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `q={'analysis':1,'report':0,'recipient':0}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `q={'analysis':1,'report':0,'recipient':0}
print(any(v>0 for v in q.values()))`,
          output: `True`,
        },
      },
      {
        id: "S26-T3-A-E3",
        subtopicId: "S26-T3-A",
        kind: "transfer",
        instruction:
          "Imprime checklist mínima ['metrics','narrative','recipient'].",
        hint: "lista",
        hints: [
          "lista",
          "gate",
        ],
        edgeCases: ["evidencia adjunta"],
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
          code: `print(['metrics','narrative','recipient'])`,
          output: `['metrics', 'narrative', 'recipient']`,
        },
      },
      {
        id: "S26-T3-B-E1",
        subtopicId: "S26-T3-B",
        kind: "guided",
        instruction:
          "Registra action approve con actor.",
        hint: "append dict",
        hints: [
          "append dict",
          "audit",
        ],
        edgeCases: ["timestamp"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit=[]
# TODO
print(audit)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit=[]
audit.append({'action':'approve','actor':'rev'})
print(audit[0]['action'])`,
          output: `approve`,
        },
      },
      {
        id: "S26-T3-B-E2",
        subtopicId: "S26-T3-B",
        kind: "independent",
        instruction:
          "Reject sin reason → 'invalid'.",
        hint: "guard reason",
        hints: [
          "guard reason",
          "None",
        ],
        edgeCases: ["reason codes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `action, reason = 'reject', None
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `action, reason = 'reject', None
print('invalid' if action=='reject' and not reason else 'ok')`,
          output: `invalid`,
        },
      },
      {
        id: "S26-T3-B-E3",
        subtopicId: "S26-T3-B",
        kind: "transfer",
        instruction:
          "Edit incrementa version de 1 a 2.",
        hint: "version++",
        hints: [
          "version++",
          "artefacto",
        ],
        edgeCases: ["diff store"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ver=1
# TODO edit
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ver=1
ver += 1
print(ver)`,
          output: `2`,
        },
      },
      {
        id: "S26-T4-A-E1",
        subtopicId: "S26-T4-A",
        kind: "guided",
        instruction:
          "Alert si success_rate < 0.95.",
        hint: "comparación",
        hints: [
          "comparación",
          "slo",
        ],
        edgeCases: ["ventana 7d"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rate=0.9
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rate=0.9
print('alert' if rate < 0.95 else 'ok')`,
          output: `alert`,
        },
      },
      {
        id: "S26-T4-A-E2",
        subtopicId: "S26-T4-A",
        kind: "independent",
        instruction:
          "P0 si sends_without_approve>0.",
        hint: "severidad",
        hints: [
          "severidad",
          "security",
        ],
        edgeCases: ["sandbox misconfig"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `n=1
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `n=1
print('P0_unapproved_send' if n>0 else 'ok')`,
          output: `P0_unapproved_send`,
        },
      },
      {
        id: "S26-T4-A-E3",
        subtopicId: "S26-T4-A",
        kind: "transfer",
        instruction:
          "Runbook one-liner: disable_schedule → drain → page.",
        hint: "string",
        hints: [
          "string",
          "ops",
        ],
        edgeCases: ["oncall roster"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO print steps
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('disable_schedule -> drain -> page')`,
          output: `disable_schedule -> drain -> page`,
        },
      },
      {
        id: "S26-T4-B-E1",
        subtopicId: "S26-T4-B",
        kind: "guided",
        instruction:
          "E2E: todos los steps en success; imprime True.",
        hint: "all",
        hints: [
          "all",
          "lista",
        ],
        edgeCases: ["fallo parcial"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `steps=['ingest','validate','draft']
status={s:'success' for s in steps}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `steps=['ingest','validate','draft']
status={s:'success' for s in steps}
print(all(status[s]=='success' for s in steps))`,
          output: `True`,
        },
      },
      {
        id: "S26-T4-B-E2",
        subtopicId: "S26-T4-B",
        kind: "independent",
        instruction:
          "fraud_labels debe ser 0 en el VP; imprime ok/fail.",
        hint: "política",
        hints: [
          "política",
          "assert blando",
        ],
        edgeCases: ["no auto-fraude"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `fraud_labels=0
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `fraud_labels=0
print('ok' if fraud_labels==0 else 'fail')`,
          output: `ok`,
        },
      },
      {
        id: "S26-T4-B-E3",
        subtopicId: "S26-T4-B",
        kind: "transfer",
        instruction:
          "Imprime notas de regresión N2: 'CP-N2-A/B/C critical+privacy' y valor estimado 45 min.",
        hint: "dos prints o un dict",
        hints: [
          "dos prints o un dict",
          "cierre",
        ],
        edgeCases: ["gate ≥80% no crítica; 0 fallas críticas"],
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
          code: `print({'n2_regression': 'CP-N2-A/B/C critical+privacy', 'value_minutes_saved_est': 45, 'cf2': 'interfaces Familiarity-reporting-automation'})`,
          output: `{'n2_regression': 'CP-N2-A/B/C critical+privacy', 'value_minutes_saved_est': 45, 'cf2': 'interfaces Familiarity-reporting-automation'}`,
        },
      },
    ],
  },
  youDo: {
    title: "VP RPA + AI Analyst — cierre CP-N2-C + notas regresión N2",
    context:
      "Orquesta el VP sintético de punta a punta: ingest→validate→analyze→ai→report→approve→draft_email. Incluye checkpoint/DLQ, triple cola HITL, audit, SLO y un checklist de **regresión N2** (tests críticos CP-N2-A/B/C, E2E S14–S26, privacidad/seguridad, CF-2 interfaces). No envíes correo real; fraud_labels=0; matching no implica fraude. Esta entrega no marca section_passed ni escribe ledger.",
    objectives: [
      "DAG ejecutable con estados y metadata de run",
      "Resiliencia: checkpoint, retry/backoff, DLQ, rollback",
      "HITL: revisión análisis/reporte/destinatario + audit approve/reject/edit",
      "Operación: SLO/alerts/runbook + E2E con costo/valor",
      "Documentar notas de regresión N2 y CF-2 en el portafolio",
    ],
    requirements: [
      "Datos sintéticos only; sin secretos",
      "Cero envíos sin approve (y de hecho cero envíos reales)",
      "fraud_labels auto = 0",
      "Evidencia por estado del pipeline",
      "Notas de regresión N2 y CF-2 en You Do / README del proyecto",
      "es-PE en runbook y mensajes de UI",
    ],
    starterCode: `# VP RPA + AI Analyst — esqueleto de cierre CP-N2-C
STEPS = ["ingest", "validate", "analyze", "ai_assist", "report", "approve", "draft_email"]
state = {s: "pending" for s in STEPS}
audit = []
# TODO: ejecutar en orden, HITL gates, draft, e2e evidence, n2 regression notes
print("TODO VP", STEPS)
print("n2_regression", "re-run critical CP-N2-A/B/C + privacy + CF-2 contracts")
`,
    portfolioNote:
      "Paquete de cierre CP-N2-C: pipeline con evidencia, HITL y draft sandbox. Incluye sección de **regresión N2** (S14–S26) y **CF-2**. Otra lane califica PASS; no editar checkpoint/ledger desde autoría de contenido.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Notas de regresión N2 y CF-2 presentes y accionables", weight: "bonus checklist" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El orden draft_email respecto a approve es:",
        options: ["Draft antes de approve", "Approve antes de draft_email", "En paralelo sin gate", "Solo schedule"],
        correctIndex: 1,
        explanation:
          "Aprobación humana precede al borrador final.",
      },
      {
        question: "La regresión N2 incluye:",
        options: ["Solo un print", "Borrar S14", "Marcar passed sin tests", "Tests críticos de capstones N2, E2E y controles de privacidad/seguridad"],
        correctIndex: 3,
        explanation:
          "Definición de regresión de nivel en el roadmap V3.",
      },
      {
        question: "Un send sin approve es:",
        options: ["Incidente P0", "Warning menor", "OK en sandbox siempre", "Ignorable"],
        correctIndex: 0,
        explanation:
          "Cero envíos sin approve es SLO de seguridad.",
      },
      {
        question: "fraud_labels automáticos en el VP deben ser:",
        options: ["Maximizados", "Igual al score de matching", "0 — solo evidencia para humanos", "Exportados a prensa"],
        correctIndex: 2,
        explanation:
          "Matching/score ≠ fraude.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Prefect concepts (flows/tasks)",
        url: "https://docs.prefect.io/",
        note: "Orquestación conceptual",
      },
      {
        label: "SRE Workbook — SLOs",
        url: "https://sre.google/workbook/implementing-slos/",
        note: "SLO y alerts",
      },
    ],
    books: [
      {
        label: "Release It! (Nygard)",
        note: "Estabilidad, DLQ, rollback",
      },
      {
        label: "Site Reliability Engineering (Google)",
        note: "Runbooks y error budgets",
      },
    ],
    courses: [
      {
        label: "Pipeline orchestration patterns",
        url: "https://docs.prefect.io/v3/concepts/flows",
        note: "Flows y estados",
      },
    ],
  },
}
