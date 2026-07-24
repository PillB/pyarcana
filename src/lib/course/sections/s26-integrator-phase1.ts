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
    "Cierras **CP-N2-C** orquestando Excel/sistema → validación → análisis → IA → informe → aprobación → borrador de correo, con regresión N2 y costo acotado. Sin auto-fraude ni envío sin approve. Id legacy `integrator-phase1` se conserva; el path V3 es orquestación del VP RPA + AI Analyst.",
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
        "S26 cierra el **Value Proposition RPA + AI Analyst** de CP-N2-C: orquestas el pipeline sintético Excel/sistema → validación → análisis → IA asistida → informe → aprobación humana → borrador de correo, con evidencia por estado y recuperación ante fallas. En un escritorio de operaciones en Lima, el run_id une logs, artefactos y la cola HITL sin reescribir historial.",
        "La regresión N2 (S14–S26 + CF-2) exige contratos estables entre análisis, reporting y automatización: mismos fixtures sintéticos, mismos predicates de éxito, y cero etiquetas automáticas de fraude. Matching o score de IA solo alimentan revisión humana; el correo no se envía sin aprobación explícita registrada en audit.",
        "Orden pedagógico: **T1 Orquestación** (DAG/estados/límites) → **T2 Resiliencia** (checkpoint, retry, DLQ, idempotencia, rollback) → **T3 HITL** (colas, approve/reject/edit) → **T4 Operación/E2E** (SLO, runbook, costo/valor). Privacidad: datos de demo son sintéticos; no uses RUC/nombres reales de clientes en los ejercicios.",
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
        "Un **DAG** (directed acyclic graph) codifica dependencias de negocio: no puedes analizar antes de validar ni generar draft_email antes de approve. En la práctica del VP peruano sintético, edges como (ingest→validate→analyze→ai_assist→report→approve→draft_email) evitan carreras donde un informe parcial se aprueba por error.",
        "Cada **task** expone estados observables: `pending`, `running`, `success`, `failed`, `skipped`. El **flow** agrega un estado global (p. ej. `failed` si un nodo crítico falló). El dashboard del analista muestra **timestamp + run_id** por nodo para reanudar sin adivinar.",
        "Implementación didáctica con dicts de nodos + edges y **orden topológico** (sin Prefect/Airflow instalado): si hay ciclo, el pipeline **no arranca**. Contrato: `edges list[(str,str)]` → `order list[str]`; `approve` **antes** de `draft_email` es dependencia de negocio, no de “preferencia”.",
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
        "**Rate limits** (api_rpm, max_parallel_tasks) protegen APIs y colas compartidas: un burst nocturno de reintentos no debe tumbar el endpoint de export del sistema sintético. Metadata inmutable al start del run: run_id, trigger (manual|schedule), git_sha sintético, data_cutoff — versionas un nuevo run_id si cambias la foto de datos.",
        "**Schedules** tipo cron (`0 6 * * 1-5` America/Lima) cubren días hábiles 06:00; on-demand cubre cierre de mes o reprocesos. En deploy: **`disable_schedule` → drain** antes de cambiar schema de informe — no mezclar versiones a mitad del batch.",
        "Caso PE: San Isidro fija `max_parallel_tasks=2` y `api_rpm=30`; si `api_rpm>60` el preflight imprime `too_high` y **bloquea** el schedule hasta revisión humana del límite.",
      ],
      code: {
        language: 'python',
        title: "limits_meta.py",
        code: `def build_run_meta(run_id, api_rpm=30):
    return {
        "run_id": run_id,
        "trigger": "manual",
        "schedule": None,
        "limits": {"max_parallel_tasks": 2, "api_rpm": api_rpm},
        "data_cutoff": "2026-01-15",
    }

run_meta = build_run_meta("cpn2c-close-01")
print(run_meta["run_id"], run_meta["limits"]["api_rpm"])
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
        "Un **checkpoint** persiste ids ya procesados para reanudar sin rehacer ingest costoso: tras un crash a mitad de `analyze`, solo quedan pendientes los no marcados. Lab: set en memoria; capstone: JSON. Contrato: **skip si id ∈ ckpt**.",
        "**Retry con backoff** exponencial (`base * 2**(attempt-1)`, con cap) absorbe 429/timeout. **No** reintentes schema inválido de negocio: eso va a **DLQ** con owner y SLA — DLQ no es basurero silencioso.",
        "Caso PE: item flaky de export → DLQ `timeout_exhausted`, owner=`ops_rpa`. Contrato lab: `process_with_dlq` → `(ok, dlq, ckpt)` **sin duplicar** ok tras reanudación.",
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
        "Pasos **idempotentes** usan keys de negocio (`run_id`, `entity_id`): la segunda escritura no pisa un valor ya materializado (create-once). Un retry **no** duplica drafts por reentrega del mensaje.",
        "**Concurrencia**: locks/flags `locked` por entidad evitan dos workers en el mismo informe. Si `locked=True` → busy y reencola. Lab: flag fail-closed; prod: lease con TTL.",
        "**Rollback/compensación** no siempre es ACID: si falla `draft_email` tras `write_report`, borra draft y marca report `superseded`. Documenta el grafo de compensación en el runbook del VP.",
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
        "HITL del VP exige **tres colas**: `analysis` (métricas/outliers), `report` (narrativa), `recipient` (destinatario). Cualquier `pending>0` **bloquea** envío: `blocked = any(count>0)`. Checklist mínima: metrics + narrative + recipient.",
        "La IA asistida **solo propone** texto/highlights; **no cierra** el caso. Si `analysis` pending, el flow queda en `human_review` aunque `report` esté listo — evita “correo automático con narrativa alucinada”.",
        "Caso: `cpn2c-hitl-01` con analysis=1, report=1, recipient=0 → `blocked True`. Scores de matching alimentan `analysis` como **evidencia**, nunca como veredicto de fraude.",
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
        "Toda decisión humana deja **audit** `{action, actor, ts, reason?}`. `approve` avanza; `reject` exige reason no vacío; `edit` versiona (1→2) sin borrar historia. Sin audit, CP-N2-C no es defendible en el capstone.",
        "Actor = id sintético (`r1`, `r2`), no correo personal real. El sistema **no envía**: solo materializa `draft_email` tras approve. Rechazos reabren cola según reason code del runbook.",
        "Política PE: `quality_narrative` → reencola report; `wrong_recipient` → reencola recipient. Audit **append-only** — nunca reescritura de entradas previas.",
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
        "**SLO** del VP sintético: `success_rate ≥ 0.95` diario; si rate=0.90 → `alert_success_rate`. P0: `sends_without_approve > 0` — violación de control, no warning suave.",
        "Runbook de incidente: **`disable_schedule → drain → page`**. Primero detienes el cron America/Lima, drenas workers, luego pages on-call con severidad explícita.",
        "Métricas del metadata de run: throughput, fallas, HITL latency, costo de tokens. **No** inventes `fraud_rate` en el dashboard — matching/score ≠ culpabilidad.",
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
        "E2E del cierre: path canónico `ingest…draft` en success con fixtures sintéticos. Seguridad: secretos fuera del repo, scopes mínimos, **`fraud_labels=0`** (el VP no auto-etiqueta fraude).",
        "Costo: tokens de IA + minutos de RPA acotados. Valor: minutos ahorrados estimados (p. ej. 45) vs manual — estimación de producto, no promesa financiera.",
        "Regresión N2: CP-N2-A/B/C critical+privacy y CF-2. Paquete de defensa: e2e, cost, value, `fraud_labels=0`, n2_regression pass.",
        "Caso PE: `cpn2c-close-e2e` con `data_cutoff` fijo; si un step failed → E2E False y **no** se firma promoción. Matching/OCR/RPA solo encolan evidencia — nunca claim de colusión/fraude en el informe final.",
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
          code: `def pipeline_order():
    return ["ingest", "validate", "analyze", "report", "approve", "draft_email"]

order = pipeline_order()
print(order)
print("n_steps", len(order))
print("ok", True)
`,
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
          code: `def run_meta(run_id, api_rpm=30, tz="America/Lima"):
    return {"run_id": run_id, "api_rpm": api_rpm, "tz": tz}

print(run_meta("r1"))
print("ok", True)
`,
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
          code: `def resume_and_dlq(ckpt, dlq):
    return sorted(ckpt), list(dlq)

rf, d = resume_and_dlq({"a"}, ["b"])
print("resume_from", rf, "dlq", d)
print("ok", True)
`,
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
          code: `def drop_draft(state):
    s = dict(state)
    s.pop("draft", None)
    return s

print(drop_draft({"report": "ok", "draft": "ok"}))
print("ok", True)
`,
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
          code: `def queue_blocked(q):
    return any(v > 0 for v in q.values())

q = {"analysis": 1, "report": 1, "recipient": 0}
print(q, "blocked", queue_blocked(q))
print("ok", True)
`,
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
          code: `def first_audit(audit):
    return audit[0]

print(first_audit([{"action": "approve", "actor": "r1"}]))
print("ok", True)
`,
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
          code: `def slo_alert(rate, thr=0.95):
    return "alert_success_rate" if rate < thr else "ok"

# note: 0.91 < 0.95 → alert
print(slo_alert(0.91))
print("ok", True)
`,
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
          code: `def vp_summary():
    return {
        "e2e": "pass",
        "cost_tokens": 100,
        "value_min": 30,
        "fraud_labels": 0,
        "n2_regression": "planned",
    }

print(vp_summary())
print("ok", True)
`,
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
          "CASO-PE orquestación VP: con el path canónico de cuatro pasos de negocio (sin AI ni email aún), imprime la lista exacta ['ingest','validate','analyze','report']. Contrato: sin inputs externos; salida must-match el orden de dependencias del DAG didáctico. Pass string: ['ingest', 'validate', 'analyze', 'report'].",
        hint: "lista",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["draft al final"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · path canónico parcial
# DEFECT: omite validate
print(['ingest','analyze','report'])
print('ok', True)
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
          "Dado nodes=['a','b','c'] como path lineal del flow sintético, construye edges (a,b),(b,c) con zip y cuenta len(edges). Contrato: input lista de 3 nodos → output '2 [(...) ]' con pares ordenados. Ciclos prohibidos en producción; aquí solo path. Pass: 2 [('a', 'b'), ('b', 'c')].",
        hint: "len edges",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["ciclos prohibidos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · edges del path
# DEFECT: imprime solo len
nodes=['a','b','c']
edges=list(zip(nodes, nodes[1:]))
print(len(edges))
print('ok', True)
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
          "Agregación de estado global del flow: tasks={'a':'success','b':'failed'}. Si cualquier task == 'failed', imprime failed; si no, success. Contrato: dict[str,str] → 'failed'|'success'. Skipped no cuenta como failed en este lab. Pass string exacto: failed.",
        hint: "any",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["skipped vs failed"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · any failed
# DEFECT: siempre success
tasks={'a':'success','b':'failed'}
print('success')
print('ok', True)
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
          "Metadata de run CP-N2-C: m={'run_id':'cpn2c-1'}. Extrae e imprime m['run_id'] sin mutar el dict. Contrato: metadata inmutable al leer; output texto del id. Fixture id conceptual cpn2c-1. Pass: cpn2c-1.",
        hint: "index dict",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["uuid en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · run_id
# DEFECT: imprime dict entero
m={'run_id':'cpn2c-1'}
print(m)
print('ok', True)
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
          "Preflight de límites: api_rpm=90 supera el umbral didáctico 60 del adapter sintético. Imprime 'too_high' si api_rpm>60, si no 'ok'. Contrato: int → etiqueta de gate. En ops Lima esto bloquearía enable del schedule. Pass: too_high.",
        hint: "umbral",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["burst vs sustained"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · api_rpm cap 60
# DEFECT: umbral 100
api_rpm=90
print('too_high' if api_rpm>100 else 'ok')
print('ok', True)
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
          "Schedule del escritorio PE: imprime el cron de días hábiles a las 06:00 y la zona 'America/Lima' en una sola línea. Contrato: constantes documentadas; sin librería cron. Pass exacto: 0 6 * * 1-5 America/Lima.",
        hint: "constantes",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["DST"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · cron Lima
# DEFECT: UTC
print('0 6 * * 1-5', 'UTC')
print('ok', True)
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
          "Backoff exponencial de reintentos: attempt=3, base=100 → base*(2**(attempt-1)). Imprime el entero ms de espera. Contrato: no aplica cap en este ejercicio; solo la fórmula. Pass: 400. (En prod añadirías jitter y cap.)",
        hint: "exponencial",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["cap"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · backoff base*2**(attempt-1)
# DEFECT: lineal base*attempt
attempt, base = 3, 100
print(base * attempt)
print('ok', True)
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
          "Dead-letter: dlq=[] y fail=True modelan un item irrecuperable del export sintético. Si fail, append 'x' a dlq e imprime la lista. Contrato: no reintentar validación de negocio aquí. Pass: ['x']. Owner/SLA de DLQ se documentan fuera del print.",
        hint: "lista",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["owner DLQ"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · DLQ on fail
# DEFECT: no append
dlq=[]
fail=True
print(dlq)
print('ok', True)
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
          "Checkpoint de reanudación: ckpt={'a'}; items=['a','b']. Imprime solo los ids aún no procesados (no ∈ ckpt). Contrato: list comprehension fail-open solo sobre pendientes. Pass: ['b'].",
        hint: "set membership",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["persistencia"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · resume skips ckpt
# DEFECT: reprocess all
ckpt={'a'}; items=['a','b']
print(items)
print('ok', True)
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
          "Write idempotente create-once: implementa put(k,v) que solo escribe si k no está en store. Llama put('r','v1') y put('r','v2'); imprime store['r'] (debe seguir v1). Contrato: segunda escritura no pisa. Pass: v1.",
        hint: "if key not in",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["upsert versioned"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · create-once put
store={}

def put(k,v):
    # DEFECT: siempre sobrescribe
    store[k]=v

put('r','v1'); put('r','v2')
print(store.get('r'))
print('ok', True)
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
          "Compensación/rollback: state={'report':'ok','draft':'ok'}. Elimina la key draft (pop) tras falla posterior simulada e imprime state. Contrato: report permanece; draft side-effect revertido. Pass: {'report': 'ok'}.",
        hint: "pop",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["compensar side effects"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · pop draft
# DEFECT: no pop
state={'report':'ok','draft':'ok'}
print(state)
print('ok', True)
`,
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
          "Lock optimista de concurrencia: locked=True significa otro worker en la entidad. Imprime 'busy' si locked else 'enter'. Contrato: fail-closed, no esperar en busy-loop en el lab. Pass: busy.",
        hint: "flag",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["ttl del lock"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · lock busy
# DEFECT: enter aunque locked
locked=True
print('enter' if locked else 'busy')
print('ok', True)
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
          "Cola HITL analysis: analysis=[{'status':'pending'},{'status':'done'}]. Cuenta cuántos status=='pending' e imprime el entero. Contrato: solo analysis en este step; no mutes la lista. Pass: 1.",
        hint: "sum",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["done vs approved"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · count pending
# DEFECT: cuenta done
analysis=[{'status':'pending'},{'status':'done'}]
print(sum(1 for x in analysis if x['status']=='done'))
print('ok', True)
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
          "Gate multi-cola: q={'analysis':1,'report':0,'recipient':0}. Imprime True si alguna cola >0 (blocked), False si todas 0. Contrato: any sobre values. Pass: True (aún no se puede draft_email).",
        hint: "any",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["triple gate"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · any queue >0
# DEFECT: all >0
q={'analysis':1,'report':0,'recipient':0}
print(all(v>0 for v in q.values()))
print('ok', True)
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
          "Checklist mínima de revisión humana antes del borrador: imprime exactamente ['metrics','narrative','recipient']. Contrato: orden canónico didáctico del VP. Pass: ['metrics', 'narrative', 'recipient'].",
        hint: "lista",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["evidencia adjunta"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · report fields
# DEFECT: omite recipient
print(['metrics','narrative'])
print('ok', True)
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
          "Auditoría append-only: audit=[] registra la decisión. Append un dict con action 'approve' y actor sintético; imprime el action de la solución (approve). Contrato: no reescribir historial de audit. Pass: approve.",
        hint: "append dict",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["timestamp"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · audit action
# DEFECT: imprime actor
audit=[]
audit.append({'action':'approve','actor':'rev'})
print(audit[0]['actor'])
print('ok', True)
`,
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
          "Reject con razón obligatoria: action='reject', reason=None. Si reject y reason vacío/None → imprime 'invalid'; si no, 'ok'. Contrato: fail-closed en rechazo sin justificación. Pass: invalid.",
        hint: "guard reason",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["reason codes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · reject requires reason
# DEFECT: ok sin reason
action, reason = 'reject', None
print('ok')
print('ok', True)
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
          "Edit versiona artefacto del informe sintético: partiendo de ver=1, al editar incrementa a 2 e imprime ver. Contrato: versión monotónica; no borrar entradas de audit previas. Pass exacto: 2.",
        hint: "version++",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["diff store"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · version bump
# DEFECT: no incrementa
ver=1
print(ver)
print('ok', True)
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
          "SLO success_rate del VP: rate=0.9. Si rate < 0.95 imprime 'alert', si no 'ok'. Contrato: umbral didáctico del VP diario operativo. Pass: alert. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "comparación",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["ventana 7d"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · success rate SLO 0.95
# DEFECT: alert si rate > 0.95
rate=0.9
print('alert' if rate > 0.95 else 'ok')
print('ok', True)
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
          "Control P0 de cumplimiento: n=sends_without_approve=1. Si n>0 imprime 'P0_unapproved_send', si no 'ok'. Contrato: cero envíos sin approve humano. Pass: P0_unapproved_send.",
        hint: "severidad",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["sandbox misconfig"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · unapproved send P0
# DEFECT: ok aunque n>0
n=1
print('ok' if n>0 else 'P0_unapproved_send')
print('ok', True)
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
          "Runbook de incidente one-liner: imprime la secuencia disable_schedule -> drain -> page (espacios alrededor de flechas como en la solución). Contrato: orden fijo de contención. Pass: disable_schedule -> drain -> page.",
        hint: "string",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["oncall roster"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · runbook incident
# DEFECT: solo page
print('page')
print('ok', True)
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
          "E2E sintético: steps=['ingest','validate','draft'] con status success en todos. Imprime True si all success. Contrato: un failed tumba el E2E. Pass: True.",
        hint: "all",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["fallo parcial"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · e2e all success
# DEFECT: any success
steps=['ingest','validate','draft']
status={s:'success' for s in steps}
print(any(status[s]=='success' for s in steps))
print('ok', True)
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
          "Política anti-fraude-auto: fraud_labels=0 en el paquete del VP. Imprime 'ok' si fraud_labels==0 else 'fail'. Matching/OCR no generan labels de fraude. Pass: ok.",
        hint: "política",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["no auto-fraude"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · zero fraud labels
# DEFECT: fail cuando 0
fraud_labels=0
print('fail' if fraud_labels==0 else 'ok')
print('ok', True)
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
          "Cierre de regresión N2: imprime el dict con n2_regression='CP-N2-A/B/C critical+privacy', value_minutes_saved_est=45 y cf2 interfaces Familiarity-reporting-automation (ver solución). Contrato: evidencia de defensa, no envío real. Pass debe coincidir el dict de solution output.",
        hint: "dos prints o un dict",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["gate ≥80% no crítica; 0 fallas críticas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · cf2 package keys
# DEFECT: omite value estimate
print({'n2_regression': 'CP-N2-A/B/C critical+privacy', 'cf2': 'interfaces'})
print('ok', True)
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
# Orden: path canónico, HITL gates, draft tras approve, e2e evidenciace, n2 regression notes
print("VP", STEPS)
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
      {
        question: "draft_email respecto a approve en el VP debe…",
        options: ["enviarse antes de approve para ahorrar tiempo", "ejecutarse solo después de approve humano con audit", "omitir audit si el SLO está en verde", "etiquetar fraude si el análisis tiene score alto"],
        correctIndex: 1,
        explanation:
          "Aprobación humana precede el borrador/envío; fraud_labels=0 y audit son parte del gate CP-N2-C.",
      }
    ],
  },
  resources: {
    docs: [
      {
        label: "Prefect — concepts",
        url: "https://docs.prefect.io/",
        note: "Flows, tasks y estados",
      },
      {
        label: "Prefect — flows",
        url: "https://docs.prefect.io/v3/concepts/flows",
        note: "Orquestación y dependencias",
      },
      {
        label: "Apache Airflow — concepts",
        url: "https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html",
        note: "DAGs y scheduling (referencia)",
      },
      {
        label: "SRE Workbook — Implementing SLOs",
        url: "https://sre.google/workbook/implementing-slos/",
        note: "SLO y alerts",
      },
      {
        label: "SRE Book — Postmortem culture",
        url: "https://sre.google/sre-book/postmortem-culture/",
        note: "Incidentes y aprendizaje",
      },
      {
        label: "12factor App",
        url: "https://12factor.net/",
        note: "Config, logs y procesos",
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
        label: "Coursera — data engineering / orchestration",
        url: "https://www.coursera.org/courses?query=data%20pipeline%20orchestration",
        note: "Pipelines y workflows",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos verificables",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Tests y proyectos",
      },
      {
        label: "deeplearning.ai — data engineering",
        url: "https://www.deeplearning.ai/specializations/data-engineering",
        note: "Pipelines de datos",
      },
    ],
  },
}
