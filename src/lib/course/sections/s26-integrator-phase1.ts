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
    "Cierras **CP-N2-C** orquestando el Value Proposition **RPA + AI Analyst**: Excel/sistema → validación → análisis → IA asistida → informe → aprobación humana → borrador de correo. En un escritorio de operaciones (p. ej. Lima) demuestras evidencia por estado, recuperación ante fallas, regresión N2 reproducible y costo acotado. Sin auto-fraude ni envío sin approve registrado en audit.",
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
        "S25 te dejó **ai_assist** evaluado: la IA propone, el humano cierra. S26 cierra el **Value Proposition RPA + AI Analyst** de CP-N2-C orquestando el pipeline sintético Excel/sistema → validación → análisis → IA asistida → informe → aprobación humana → borrador de correo, con evidencia por estado y recuperación ante fallas. En un escritorio de operaciones en Lima, el run_id une logs, artefactos y la cola HITL sin reescribir historial.",
        "La regresión N2 (S14–S26 + CF-2) exige contratos estables entre análisis, reporting y automatización: mismos fixtures sintéticos, mismos predicates de éxito, y cero etiquetas automáticas de fraude. Matching o score de IA solo alimentan revisión humana; el correo no se envía sin aprobación explícita registrada en audit.",
        "Orden pedagógico: **T1 Orquestación** (DAG/estados/límites) → **T2 Resiliencia** (checkpoint, retry, DLQ, idempotencia, rollback) → **T3 HITL** (colas, approve/reject/edit) → **T4 Operación/E2E** (SLO, runbook, costo/valor). Cada bloque asume el anterior: sin path no hay checkpoint; sin HITL no hay draft; sin E2E no hay promoción.",
        "Diccionario rápido de la sección: **DAG** = grafo de dependencias sin ciclos; **HITL** (human-in-the-loop) = revisión humana obligatoria; **DLQ** (dead-letter queue) = cola de ítems que agotaron reintentos; **SLO** = objetivo de servicio medible; **fail-closed** = ante duda, bloquear; **drain** = vaciar workers antes de cambiar schema; **page on-call** = avisar al turno de guardia con severidad explícita. Privacidad: datos de demo sintéticos; no uses RUC/nombres reales de clientes.",
      ],
      callout: {
        type: "info",
        title: "Criterio de promoción N2",
        content:
          "La promoción exige CP-N2-A/B/C, regresión S14–S26 y CF-2 aprobados con evidencia reproducible.",
      },
    },
    {
      heading: "Tasks, flows, DAG y estados del VP",
      subtopicId: "S26-T1-A",
      paragraphs: [
        "Un **DAG** (directed acyclic graph) codifica dependencias de negocio: no puedes analizar antes de validar ni generar draft_email antes de approve. Path canónico del VP (7 steps): **ingest → validate → analyze → ai_assist → report → approve → draft_email**. Ese orden es el contrato del cierre CP-N2-C; las vistas parciales de ejercicios lo declaran cuando omiten AI o email a propósito.",
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
          "El dashboard del VP muestra el estado de cada nodo con timestamp y run_id.",
      },
    },
    {
      heading: "Límites, metadata y schedules del run",
      subtopicId: "S26-T1-B",
      paragraphs: [
        "Acabas de fijar el DAG; ahora sin **límites** un schedule tumba el export. **Rate limits** (api_rpm, max_parallel_tasks) protegen APIs y colas compartidas: un *burst* (ráfaga) nocturno de reintentos no debe tumbar el endpoint de export del sistema sintético. Metadata inmutable al start del run: run_id, trigger (manual|schedule), git_sha sintético, data_cutoff — versionas un nuevo run_id si cambias la foto de datos.",
        "**Schedules** tipo cron (`0 6 * * 1-5` America/Lima) cubren días hábiles 06:00; on-demand cubre cierre de mes o reprocesos. En deploy: **`disable_schedule` → drain** (vaciar workers) antes de cambiar schema de informe — no mezclar versiones a mitad del batch.",
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
      heading: "Checkpoints, reintentos con backoff y dead-letter (DLQ)",
      subtopicId: "S26-T2-A",
      paragraphs: [
        "Con el path estable, un crash a mitad de `analyze` exige **checkpoint**: persiste ids ya procesados para reanudar sin rehacer ingest costoso. Tras el fallo, solo quedan pendientes los no marcados. Lab: set en memoria; capstone: JSON. Contrato: **skip si id ∈ ckpt**.",
        "Glosa: **checkpoint** = marca de progreso persistida; **backoff** = espera creciente entre reintentos (`base * 2**(attempt-1)`, con cap); **DLQ (dead-letter queue)** = cola de ítems que agotaron reintentos y requieren dueño humano. **Retry con backoff** absorbe 429/timeout. **No** reintentes schema inválido de negocio: eso va a DLQ con owner y SLA — DLQ no es basurero silencioso.",
        "Caso PE: item flaky de export reintenta hasta `max_attempts`; si sigue fallando → DLQ con `reason=timeout_exhausted`, owner=`ops_rpa`. Contrato lab: `process_with_dlq` → `(ok, dlq, ckpt)` **sin duplicar** ok tras reanudación; flaky no cae a DLQ en el primer intento.",
      ],
      code: {
        language: 'python',
        title: "ckpt_dlq.py",
        code: `def backoff_sleep_ms(attempt, base=100, cap=2000):
    return min(cap, base * (2 ** (attempt - 1)))

def process_with_dlq(items, flaky_ids, max_attempts=3):
    ok, dlq, ckpt = [], [], set()
    for it in items:
        if it in ckpt:
            continue
        attempts = 0
        while attempts < max_attempts:
            attempts += 1
            # flaky siempre falla el intento; tras agotar → DLQ con owner
            if it in flaky_ids:
                if attempts >= max_attempts:
                    dlq.append({
                        "id": it,
                        "reason": "timeout_exhausted",
                        "owner": "ops_rpa",
                    })
                    break
                continue
            ok.append(it)
            ckpt.add(it)
            break
    return ok, dlq, sorted(ckpt)

print([backoff_sleep_ms(i) for i in range(1, 5)])
print(process_with_dlq(["a", "b", "c"], flaky_ids={"b"}))`,
        output: `[100, 200, 400, 800]
(['a', 'c'], [{'id': 'b', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa'}], ['a', 'c'])`,
      },
      callout: {
        type: "warning",
        title: "DLQ no es basurero",
        content:
          "Cada mensaje en DLQ tiene owner y SLA de inspección; no se borra el rastro.",
      },
    },
    {
      heading: "Idempotencia, concurrencia y rollback",
      subtopicId: "S26-T2-B",
      paragraphs: [
        "Tras checkpoint y DLQ, el siguiente riesgo es el **reintento exitoso dos veces**: pasos **idempotentes** usan keys de negocio (`run_id`, `entity_id`) para que la segunda escritura no pise un valor ya materializado (create-once). Un retry **no** duplica drafts por reentrega del mensaje.",
        "**Concurrencia**: locks/flags `locked` por entidad evitan dos workers en el mismo informe. Si `locked=True` → busy y reencola (**fail-closed**: ante duda, no entras). Lab: flag; prod: lease con TTL.",
        "**Rollback/compensación** no siempre es ACID: si falla `draft_email` tras `write_report`, borra el draft y marca el report como `superseded` (no lo eliminas del historial de defensa). Documenta el grafo de compensación en el runbook del VP.",
      ],
      code: {
        language: 'python',
        title: "rollback.py",
        code: `store = {"reports": {}, "drafts": {}}

def write_report(run_id, body):
    store["reports"][run_id] = {"body": body, "status": "active"}
    return run_id

def write_draft(run_id, body):
    store["drafts"][run_id] = body
    return run_id

def rollback(run_id):
    store["drafts"].pop(run_id, None)
    if run_id in store["reports"]:
        store["reports"][run_id] = {"status": "superseded"}

write_report("r1", "informe")
write_draft("r1", "draft")
rollback("r1")
print("reports", store["reports"], "drafts", store["drafts"])`,
        output: `reports {'r1': {'status': 'superseded'}} drafts {}`,
      },
      callout: {
        type: "tip",
        title: "Compensación",
        content:
          "Rollback no siempre es transacción ACID; define compensaciones explícitas (draft fuera, report superseded).",
      },
    },
    {
      heading: "Revisión de análisis, reporte y destinatario (HITL)",
      subtopicId: "S26-T3-A",
      paragraphs: [
        "Con resiliencia y compensación listas, el path aún no puede materializar correo: el HITL del VP exige **tres colas** — `analysis` (métricas/outliers), `report` (narrativa), `recipient` (destinatario). Cualquier `pending>0` **bloquea** envío: `blocked = any(count>0)`. Checklist mínima: metrics + narrative + recipient.",
        "La IA asistida (**ai_assist**, handoff de S25) **solo propone** texto/highlights; **no cierra** el caso. Si `analysis` pending, el flow queda en `human_review` aunque `report` esté listo — evita “correo automático con narrativa alucinada”.",
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
      heading: "Aprobación, rechazo, edición y auditoría",
      subtopicId: "S26-T3-B",
      paragraphs: [
        "Las colas HITL se vacían con decisiones humanas; cada una deja **audit** `{action, actor, ts, reason?}`. `approve` avanza; `reject` exige reason no vacío; `edit` versiona (1→2) sin borrar historia. Sin audit, CP-N2-C no es defendible en el capstone.",
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
      heading: "SLO, alertas y runbook operativo",
      subtopicId: "S26-T4-A",
      paragraphs: [
        "Con el gate HITL y el audit en verde, falta **operar** el VP en producción. **SLO** sintético: `success_rate ≥ 0.95` diario; si rate=0.90 → alerta `alert_success_rate` (mismo nombre en prosa, lab y runbook). P0: `sends_without_approve > 0` — violación de control, no warning suave.",
        "Runbook de incidente: **`disable_schedule → drain → page`**. Primero detienes el cron America/Lima, drenas workers (vacías la cola en vuelo), luego *pages on-call* (avisas al turno de guardia) con severidad explícita.",
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
        out.append("alert_success_rate")
    if m["p95_duration_min"] > slo["p95_duration_min"]:
        out.append("latency_high")
    if m["sends_without_approve"] > 0:
        out.append("P0_unapproved_send")
    return out

print(alerts(metrics, slo))
print("runbook_step", "disable_schedule → drain queue → page oncall")`,
        output: `['alert_success_rate']
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
      heading: "Pruebas E2E, seguridad, costo y métricas de valor",
      subtopicId: "S26-T4-B",
      paragraphs: [
        "SLO y runbook protegen el día a día; el **cierre de nivel** exige evidencia E2E del path canónico **ingest → validate → analyze → ai_assist → report → approve → draft_email** en success con fixtures sintéticos. Seguridad: secretos fuera del repo, scopes mínimos, **`fraud_labels=0`** (el VP no auto-etiqueta fraude).",
        "Costo: tokens de IA + minutos de RPA acotados. Valor: minutos ahorrados estimados (p. ej. 45) vs manual — estimación de producto, no promesa financiera.",
        "Regresión N2: re-ejecutar tests críticos de CP-N2-A/B/C, E2E del tramo S14–S26 y controles de privacidad/seguridad, más CF-2. Paquete de defensa: e2e, cost, value, `fraud_labels=0`, `n2_regression=pass` con evidencia real (no “planned”).",
        "Caso PE: `cpn2c-close-e2e` con `data_cutoff` fijo; si un step failed → E2E False y **no** se firma promoción. Matching/OCR/RPA solo encolan evidencia — nunca claim de colusión/fraude en el informe final.",
      ],
      code: {
        language: 'python',
        title: "e2e_value.py",
        code: `def e2e_vp():
    steps = [
        "ingest", "validate", "analyze", "ai_assist",
        "report", "approve", "draft_email",
    ]
    evidence = {s: "success" for s in steps}
    evidence["audit_events"] = 3
    evidence["cost_tokens"] = 1200
    evidence["value_minutes_saved_est"] = 45
    evidence["fraud_labels"] = 0  # debe ser 0: no auto-fraude
    return evidence

ev = e2e_vp()
print("draft_email", ev["draft_email"], "audit", ev["audit_events"])
print("cost_tokens", ev["cost_tokens"], "fraud_labels", ev["fraud_labels"])
print("n2_regression_note", "re-run CP-N2-A/B/C critical + privacy checks")`,
        output: `draft_email success audit 3
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
    intro: "Te muestro el cierre de CP-N2-C pensando en voz alta: path canónico de 7 steps, resiliencia, HITL triple, SLO y un mini-runner E2E con regresión N2/CF-2 — sin envío real ni fraude automático.",
    steps: [
      {
        demoId: "S26-T1-A-DEMO",
        subtopicId: "S26-T1-A",
        environment: "local/cloud controlado",
        description: "Derivo el path canónico de 7 steps desde edges (ai_assist + draft_email).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Thinking aloud: el orden no se inventa; sale de las dependencias de negocio.
edges = [
    ("ingest", "validate"),
    ("validate", "analyze"),
    ("analyze", "ai_assist"),   # handoff S25
    ("ai_assist", "report"),
    ("report", "approve"),
    ("approve", "draft_email"),  # gate HITL: approve antes del borrador
]

def order_from_edges(edges):
    # Path lineal del VP: cada arista es "antes → después"
    first = edges[0][0]
    order = [first]
    for a, b in edges:
        if a == order[-1]:
            order.append(b)
    return order

order = order_from_edges(edges)
print(order)
print("n_steps", len(order))
print("ok", True)
`,
          output: `['ingest', 'validate', 'analyze', 'ai_assist', 'report', 'approve', 'draft_email']
n_steps 7
ok True`,
        },
        why: "El orden del VP es el contrato del flow: se deriva de edges; omitir ai_assist rompe el handoff de S25.",
      },
      {
        demoId: "S26-T1-B-DEMO",
        subtopicId: "S26-T1-B",
        environment: "local/cloud controlado",
        description: "Metadata de run con límites y zona America/Lima (thinking aloud).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Thinking aloud: el run_id une logs/HITL; api_rpm y tz fijan el contrato del schedule.
def run_meta(run_id, api_rpm=30, tz="America/Lima"):
    # Metadata inmutable al start: no reescribir tras el primer tick
    return {"run_id": run_id, "api_rpm": api_rpm, "tz": tz}

meta = run_meta("r1")
print(meta)
# Preflight didáctico San Isidro: >60 bloquearía enable del schedule
print("preflight", "too_high" if meta["api_rpm"] > 60 else "ok")
print("ok", True)
`,
          output: `{'run_id': 'r1', 'api_rpm': 30, 'tz': 'America/Lima'}
preflight ok
ok True`,
        },
        why: "Sin metadata (run_id, límites, tz) no hay auditoría ni schedule defendible; el preflight evita tumbar el export.",
      },
      {
        demoId: "S26-T2-A-DEMO",
        subtopicId: "S26-T2-A",
        environment: "local/cloud controlado",
        description: "Checkpoint de reanudación + reintentos hasta max_attempts y DLQ con owner.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def resume_and_dlq(ckpt, flaky_id, max_attempts=3):
    # ckpt = ya OK; flaky falla cada intento; al agotar → DLQ con razón y owner
    pending = [x for x in ["a", "b", "c"] if x not in ckpt]
    dlq = []
    for it in pending:
        if it == flaky_id:
            for attempt in range(1, max_attempts + 1):
                if attempt >= max_attempts:
                    dlq.append({
                        "id": it,
                        "reason": "timeout_exhausted",
                        "owner": "ops_rpa",
                        "attempts": attempt,
                    })
            continue
        ckpt.add(it)
    return sorted(ckpt), dlq

rf, d = resume_and_dlq({"a"}, "b")
print("resume_from", rf, "dlq", d)
print("ok", True)
`,
          output: `resume_from ['a', 'c'] dlq [{'id': 'b', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa', 'attempts': 3}]
ok True`,
        },
        why: "Reanudar sin rehacer lo exitoso; reintentar hasta max_attempts y solo entonces DLQ con owner — no basurero silencioso ni DLQ al primer fallo.",
      },
      {
        demoId: "S26-T2-B-DEMO",
        subtopicId: "S26-T2-B",
        environment: "local/cloud controlado",
        description: "Thinking aloud: create-once no pisa; si falla el draft, pop draft y report → superseded.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Thinking aloud: idempotencia create-once + compensación parcial.
store = {}

def put_once(k, v):
    if k not in store:
        store[k] = v
    return store[k]

put_once("report", "v1")
put_once("report", "v2")  # no pisa
print("idempotent", store["report"])

def compensate_failed_draft(state):
    # Si falla draft_email tras report: pop draft, report → superseded
    s = dict(state)
    s.pop("draft", None)
    if "report" in s:
        s["report"] = "superseded"
    return s

print(compensate_failed_draft({"report": "ok", "draft": "ok"}))
print("ok", True)
`,
          output: `idempotent v1
{'report': 'superseded'}
ok True`,
        },
        why: "Create-once evita drafts duplicados; compensación parcial deja report superseded (no borra evidencia).",
      },
      {
        demoId: "S26-T3-A-DEMO",
        subtopicId: "S26-T3-A",
        environment: "local/cloud controlado",
        description: "Thinking aloud: cuento pending en analysis/report/recipient y demuestro que un solo pending bloquea draft_email.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Thinking aloud: tres colas; basta una >0 para bloquear el borrador.
def queue_blocked(q):
    return any(v > 0 for v in q.values())

q = {"analysis": 1, "report": 1, "recipient": 0}
print(q, "blocked", queue_blocked(q))
# Si vaciamos analysis y report, recipient=0 → all_clear
q_clear = {"analysis": 0, "report": 0, "recipient": 0}
print("all_clear", not queue_blocked(q_clear))
print("ok", True)
`,
          output: `{'analysis': 1, 'report': 1, 'recipient': 0} blocked True
all_clear True
ok True`,
        },
        why: "Triple revisión antes del correo: un solo pending basta para bloquear; all_clear solo con las tres en 0.",
      },
      {
        demoId: "S26-T3-B-DEMO",
        subtopicId: "S26-T3-B",
        environment: "local/cloud controlado",
        description: "Thinking aloud: reject sin reason es invalid; approve append-only deja rastro defendible.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Thinking aloud: reject exige reason; approve append-only sin reescribir.
def decide(action, actor, reason=None):
    if action == "reject" and not reason:
        return {"status": "invalid"}
    return {"status": "recorded", "action": action, "actor": actor, "reason": reason}

log = []
print(decide("reject", "r1", reason=None))  # fail-closed
rec = decide("approve", "r1")
log.append(rec)
print(log[-1]["action"], "events", len(log))
print("ok", True)
`,
          output: `{'status': 'invalid'}
approve events 1
ok True`,
        },
        why: "Reject sin reason se rechaza; approve deja audit append-only — sin eso el capstone no es defendible.",
      },
      {
        demoId: "S26-T4-A-DEMO",
        subtopicId: "S26-T4-A",
        environment: "local/cloud controlado",
        description: "Thinking aloud: evalúo success_rate y sends_without_approve; nombro alertas como en el runbook.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Thinking aloud: nombres de alerta = contrato del runbook (no aliases).
def slo_alerts(rate, sends_without_approve, thr=0.95):
    out = []
    if rate < thr:
        out.append("alert_success_rate")
    if sends_without_approve > 0:
        out.append("P0_unapproved_send")
    return out or ["ok"]

print(slo_alerts(0.91, 0))
print(slo_alerts(0.99, 1))
print("ok", True)
`,
          output: `['alert_success_rate']
['P0_unapproved_send']
ok True`,
        },
        why: "alert_success_rate y P0_unapproved_send son contratos de runbook; un alias informal rompe la página on-call.",
      },
      {
        demoId: "S26-T4-B-DEMO",
        subtopicId: "S26-T4-B",
        environment: "local/cloud controlado",
        description: "Mini-runner E2E: estados nodo a nodo, gate approve→draft, regresión pass.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `STEPS = [
    "ingest", "validate", "analyze", "ai_assist",
    "report", "approve", "draft_email",
]

def run_vp(fail_at=None):
    state = {s: "pending" for s in STEPS}
    audit = []
    for s in STEPS:
        if fail_at == s:
            state[s] = "failed"
            break
        if s == "draft_email" and not any(a["action"] == "approve" for a in audit):
            state[s] = "blocked"
            break
        state[s] = "success"
        if s == "approve":
            audit.append({"action": "approve", "actor": "r1"})
    return state, audit

st, au = run_vp()
print([st[s] for s in STEPS])
print("audit", len(au), "fraud_labels", 0, "n2_regression", "pass")
print("ok", True)
`,
          output: `['success', 'success', 'success', 'success', 'success', 'success', 'success']
audit 1 fraud_labels 0 n2_regression pass
ok True`,
        },
        why: "Un solo run lifecycle une path, gate HITL, fraud_labels=0 y regresión N2 con evidencia pass.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de DAG, limits, checkpoint/DLQ, rollback, colas HITL, audit, SLO y E2E/regresión. Cada starter trae un **DEFECT** (fallo intencional) marcado en un comentario: tu trabajo es corregirlo hasta igualar el output de la solución.",
    steps: [
      {
        id: "S26-T1-A-E1",
        subtopicId: "S26-T1-A",
        kind: "guided",
        instruction:
          "Vista parcial del path canónico (sin AI ni email): imprime exactamente ['ingest','validate','analyze','report']. El full path del VP **inserta** `ai_assist` entre analyze y report, y cierra con approve → draft_email; aquí solo el tramo base de negocio. Sin inputs externos. Pass: ['ingest', 'validate', 'analyze', 'report'].",
        hint: "lista en orden de dependencias",
        hints: [
          "Orden parcial: ingest → validate → analyze → report (incluye validate).",
          "No omitas validate: es dependencia de analyze.",
          "Full path canónico: …analyze → ai_assist → report → approve → draft_email.",
        ],
        edgeCases: ["draft_email solo tras approve en el path completo"],
        tests: "print de la lista de 4 steps en orden canónico parcial",
        feedback: "Si falta validate, el DAG de negocio se rompe antes de llegar a AI o email.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · path canónico parcial (sin AI/email)
# DEFECT: omite validate
print(['ingest','analyze','report'])
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
        hint: "zip(nodes, nodes[1:])",
        hints: [
          "edges = list(zip(nodes, nodes[1:])) produce pares consecutivos.",
          "Imprime len(edges) y luego edges en la misma línea.",
          "Con 3 nodos lineales siempre hay 2 aristas.",
        ],
        edgeCases: ["ciclos prohibidos"],
        tests: "salida '2 [(\\'a\\', \\'b\\'), (\\'b\\', \\'c\\')]' o equivalente al solution output",
        feedback: "Imprimir solo len pierde la evidencia de qué dependencias modelaste.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · edges del path
# DEFECT: imprime solo len
nodes=['a','b','c']
edges=list(zip(nodes, nodes[1:]))
print(len(edges))
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
        hint: "any(...) sobre values",
        hints: [
          "Usa any(v == 'failed' for v in tasks.values()).",
          "Si any es True imprime 'failed'; si no 'success'.",
          "No hardcodees 'success' sin mirar el dict.",
        ],
        edgeCases: ["skipped vs failed"],
        tests: "agregación failed|success según any failed en values",
        feedback: "Un solo nodo failed debe tumbar el estado global del flow.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · any failed
# DEFECT: siempre success
tasks={'a':'success','b':'failed'}
print('success')
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
          "Metadata inmutable de run: m={'run_id':'cpn2c-1','api_rpm':30,'tz':'America/Lima'}. Construye un snapshot de solo lectura con las claves run_id y api_rpm e imprime (run_id, api_rpm, n_keys) donde n_keys es el tamaño del snapshot. No mutes m. Pass: ('cpn2c-1', 30, 2).",
        hint: "snapshot con dos claves + len",
        hints: [
          "snap = {'run_id': m['run_id'], 'api_rpm': m['api_rpm']}.",
          "Imprime (snap['run_id'], snap['api_rpm'], len(snap)).",
          "No reasignes claves en m; el snapshot es la foto inmutable del start.",
        ],
        edgeCases: ["uuid en prod", "metadata no se reescribe tras start"],
        tests: "tupla (run_id, api_rpm, 2) desde snapshot de dos claves",
        feedback: "Imprimir el dict entero no sirve como llave de join; el ops necesita run_id + límite en un snapshot legible.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · snapshot run_id + api_rpm
# DEFECT: imprime dict entero sin snapshot
m={'run_id':'cpn2c-1','api_rpm':30,'tz':'America/Lima'}
print(m)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `m={'run_id':'cpn2c-1','api_rpm':30,'tz':'America/Lima'}
snap={'run_id': m['run_id'], 'api_rpm': m['api_rpm']}
print((snap['run_id'], snap['api_rpm'], len(snap)))`,
          output: `('cpn2c-1', 30, 2)`,
        },
      },
      {
        id: "S26-T1-B-E2",
        subtopicId: "S26-T1-B",
        kind: "independent",
        instruction:
          "Preflight de límites: api_rpm=90 supera el umbral didáctico 60 del adapter sintético. Imprime 'too_high' si api_rpm>60, si no 'ok'. Contrato: int → etiqueta de gate. En ops Lima esto bloquearía enable del schedule. Pass: too_high.",
        hint: "umbral 60",
        hints: [
          "Compara api_rpm > 60, no > 100.",
          "Si supera: 'too_high'; si no: 'ok'.",
          "Este gate impide enable del schedule en el lab.",
        ],
        edgeCases: ["burst vs sustained"],
        tests: "etiqueta too_high|ok según umbral 60",
        feedback: "Con umbral 100 el preflight deja pasar un rpm que tumba el export.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · api_rpm cap 60
# DEFECT: umbral 100
api_rpm=90
print('too_high' if api_rpm>100 else 'ok')
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
        hint: "cron + America/Lima",
        hints: [
          "La expresión es 0 6 * * 1-5 (L–V a las 06:00).",
          "La zona debe ser America/Lima, no UTC.",
          "print(cron, tz) en una línea con espacio.",
        ],
        edgeCases: ["DST"],
        tests: "línea exacta 0 6 * * 1-5 America/Lima",
        feedback: "UTC desplaza el batch fuera del horario operativo de Lima.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · cron de escritorio en America/Lima
# DEFECT: agenda weekday 06:00 como si fuera UTC
# Completa: emite la expresión cron local y la zona America/Lima (no UTC).
cron = '0 6 * * 1-5'
zone = 'UTC'  # defecto incorrecto
# zone = 'America/Lima'
print(cron, zone)
assert zone == 'America/Lima'
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
        hint: "base * 2**(attempt-1)",
        hints: [
          "attempt=3 → 2**(3-1) = 4; 100*4 = 400.",
          "No uses base*attempt (eso es lineal, no exponencial).",
          "El lab no aplica cap; solo la fórmula.",
        ],
        edgeCases: ["cap"],
        tests: "entero 400 según fórmula de backoff",
        feedback: "Backoff lineal no da el respiro creciente que absorbe 429/timeout.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · backoff base*2**(attempt-1)
# DEFECT: lineal base*attempt
attempt, base = 3, 100
print(base * attempt)
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
          "Dead-letter tras agotar reintentos: attempts=3, max_attempts=3, item id='x'. Si attempts>=max_attempts, append a dlq el dict {'id':'x','reason':'timeout_exhausted','owner':'ops_rpa','attempts':3} e imprime la lista. Si aún quedan reintentos, imprime []. Pass: [{'id': 'x', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa', 'attempts': 3}].",
        hint: "append solo si attempts >= max_attempts",
        hints: [
          "Compara attempts con max_attempts antes de append.",
          "Incluye attempts en el dict para evidencia del runbook.",
          "No envíes a DLQ en el primer fallo si aún hay cupo de reintento.",
        ],
        edgeCases: ["owner DLQ", "no DLQ prematura"],
        tests: "lista con un dict id/reason/owner/attempts tras agotar",
        feedback: "Una DLQ sin owner o sin attempts no es defendible; DLQ al primer fallo contradice el retry.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · DLQ after max_attempts with owner
# DEFECT: DLQ vacía aunque attempts agotados
dlq=[]
attempts, max_attempts = 3, 3
print(dlq)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `dlq=[]
attempts, max_attempts = 3, 3
if attempts >= max_attempts:
    dlq.append({
        'id': 'x',
        'reason': 'timeout_exhausted',
        'owner': 'ops_rpa',
        'attempts': attempts,
    })
print(dlq)`,
          output: `[{'id': 'x', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa', 'attempts': 3}]`,
        },
      },
      {
        id: "S26-T2-A-E3",
        subtopicId: "S26-T2-A",
        kind: "transfer",
        instruction:
          "Checkpoint de reanudación: ckpt={'a'}; items=['a','b']. Imprime solo los ids aún no procesados (no ∈ ckpt). Contrato: list comprehension que filtra solo pendientes (skip si id ya está en ckpt). Pass: ['b'].",
        hint: "i not in ckpt",
        hints: [
          "Filtra: [i for i in items if i not in ckpt].",
          "No reimprimas items completo (eso reprocesa).",
          "'a' ya está en ckpt → solo queda 'b'.",
        ],
        edgeCases: ["persistencia"],
        tests: "lista de pendientes no presentes en ckpt",
        feedback: "Reprocesar todo tras un crash desperdicia ingest y rompe el checkpoint.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · resume skips ckpt
# DEFECT: reprocess all
ckpt={'a'}; items=['a','b']
print(items)
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
        hint: "if k not in store",
        hints: [
          "Dentro de put: escribe solo si k no está en store.",
          "La segunda put('r','v2') no debe cambiar el valor.",
          "Imprime store['r'] al final (esperado v1).",
        ],
        edgeCases: ["upsert versioned"],
        tests: "store['r'] permanece v1 tras dos puts",
        feedback: "Sobrescribir en cada put duplica drafts bajo reentrega del mensaje.",
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
          "Compensación/rollback parcial: state={'report':'ok','draft':'ok'}. Elimina draft (pop) y marca report='superseded' (no lo borres). Imprime state. Contrato: draft side-effect revertido; report queda para defensa. Pass: {'report': 'superseded'}.",
        hint: "pop draft + superseded",
        hints: [
          "state.pop('draft', None) quita el borrador.",
          "Asigna state['report'] = 'superseded' (no pop del report).",
          "El grafo de compensación del VP no borra evidencia del informe.",
        ],
        edgeCases: ["compensar side effects"],
        tests: "state sin draft y report superseded",
        feedback: "Borrar el report pierde la evidencia; superseded es la compensación correcta.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · pop draft + supersede report
# DEFECT: no pop ni superseded
state={'report':'ok','draft':'ok'}
print(state)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `state={'report':'ok','draft':'ok'}
state.pop('draft', None)
state['report'] = 'superseded'
print(state)`,
          output: `{'report': 'superseded'}`,
        },
      },
      {
        id: "S26-T2-B-E3",
        subtopicId: "S26-T2-B",
        kind: "transfer",
        instruction:
          "Lock optimista de concurrencia: locked=True significa otro worker en la entidad. Imprime 'busy' si locked else 'enter'. Contrato: fail-closed, no esperar en busy-loop en el lab. Pass: busy.",
        hint: "busy si locked",
        hints: [
          "Si locked es True → 'busy'; si no → 'enter'.",
          "El DEFECT invierte la condición: no lo copies.",
          "Fail-closed: ante lock, no entras.",
        ],
        edgeCases: ["ttl del lock"],
        tests: "busy cuando locked=True",
        feedback: "Entrar con locked=True permite dos workers sobre el mismo informe.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · lock busy
# DEFECT: enter aunque locked
locked=True
print('enter' if locked else 'busy')
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
        hint: "sum status==pending",
        hints: [
          "Filtra x['status']=='pending', no 'done'.",
          "sum(1 for x in analysis if ...) da el conteo.",
          "No mutes la lista; solo lees.",
        ],
        edgeCases: ["done vs approved"],
        tests: "entero de pendientes en analysis",
        feedback: "Contar 'done' en vez de 'pending' subestima la cola HITL.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · count pending
# DEFECT: cuenta done
analysis=[{'status':'pending'},{'status':'done'}]
print(sum(1 for x in analysis if x['status']=='done'))
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
        hint: "any(v > 0 ...)",
        hints: [
          "blocked = any(v > 0 for v in q.values()).",
          "all(v > 0) sería incorrecto: basta un pending.",
          "Con analysis=1 el gate debe ser True.",
        ],
        edgeCases: ["triple gate"],
        tests: "True si any queue > 0",
        feedback: "Usar all exige las tres colas llenas; el gate real bloquea con una sola.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · any queue >0
# DEFECT: all >0
q={'analysis':1,'report':0,'recipient':0}
print(all(v>0 for v in q.values()))
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
          "Checklist HITL del VP: given queues={'analysis':'pending','report':'done','recipient':'pending'}, construye la lista de claves aún pending e imprime solo esas (orden: analysis, report, recipient). Contrato: no hardcodees el checklist fijo; deriva de status. Pass: ['analysis', 'recipient'].",
        hint: "filtra keys con status pending",
        hints: [
          "Recorre el orden canónico analysis → report → recipient.",
          "Incluye la clave solo si value == 'pending'.",
          "report está done → no entra en la lista.",
        ],
        edgeCases: ["evidencia adjunta"],
        tests: "lista de colas pending en orden canónico",
        feedback: "Hardcodear metrics/narrative/recipient no enseña a leer el estado de las colas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · pending checklist from queues
# DEFECT: imprime checklist fijo sin mirar status
queues={'analysis':'pending','report':'done','recipient':'pending'}
print(['metrics','narrative','recipient'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `queues={'analysis':'pending','report':'done','recipient':'pending'}
order=['analysis','report','recipient']
print([k for k in order if queues[k]=='pending'])`,
          output: `['analysis', 'recipient']`,
        },
      },
      {
        id: "S26-T3-B-E1",
        subtopicId: "S26-T3-B",
        kind: "guided",
        instruction:
          "Auditoría append-only: audit=[] registra la decisión. Append un dict con action 'approve' y actor 'rev'; imprime (action, len(audit)). Contrato: no reescribir historial. Pass: ('approve', 1).",
        hint: "print (action, len)",
        hints: [
          "Tras append, lee audit[0]['action'] y len(audit).",
          "No reasignes audit a otra lista (append-only).",
          "La tupla demuestra decisión + que hay exactamente un evento.",
        ],
        edgeCases: ["timestamp", "no reescritura"],
        tests: "tupla (approve, 1) del primer evento append-only",
        feedback: "Imprimir solo el actor no demuestra la decisión; len(audit) prueba que no se reescribió el log.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · audit action + len
# DEFECT: imprime solo actor
audit=[]
audit.append({'action':'approve','actor':'rev'})
print(audit[0]['actor'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit=[]
audit.append({'action':'approve','actor':'rev'})
print((audit[0]['action'], len(audit)))`,
          output: `('approve', 1)`,
        },
      },
      {
        id: "S26-T3-B-E2",
        subtopicId: "S26-T3-B",
        kind: "independent",
        instruction:
          "Reject con razón obligatoria: action='reject', reason=None. Si reject y reason vacío/None → imprime 'invalid'; si no, 'ok'. Contrato: fail-closed en rechazo sin justificación. Pass: invalid.",
        hint: "reject and not reason",
        hints: [
          "Condición: action=='reject' and not reason → 'invalid'.",
          "No imprimas 'ok' a ciegas.",
          "reason vacío o None son ambos inválidos.",
        ],
        edgeCases: ["reason codes"],
        tests: "invalid cuando reject sin reason",
        feedback: "Reject sin reason se rechaza a nivel API; el lab lo modela como 'invalid'.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · reject requires reason
# DEFECT: ok sin reason
action, reason = 'reject', None
print('ok')
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
          "Edit con audit append-only: parte de ver=1 y audit=[]. Al editar, incrementa ver y append {'action':'edit','actor':'ana','from':1,'to':2}. Imprime (ver, len(audit), audit[-1]['action']). Contrato: no borrar eventos previos. Pass: (2, 1, 'edit').",
        hint: "ver += 1 luego audit.append",
        hints: [
          "Primero ver += 1; luego audit.append(...).",
          "Usa las claves action/actor/from/to del contrato.",
          "len(audit) debe ser 1 tras un solo edit.",
        ],
        edgeCases: ["diff store"],
        tests: "tupla (2, 1, 'edit') con audit append-only",
        feedback: "El versionado sin evento de audit no es defendible en CP-N2-C.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · version bump + audit
# DEFECT: no incrementa ni audita
ver=1
audit=[]
print((ver, len(audit), None))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ver=1
audit=[]
from_v = ver
ver += 1
audit.append({'action':'edit','actor':'ana','from':from_v,'to':ver})
print((ver, len(audit), audit[-1]['action']))`,
          output: `(2, 1, 'edit')`,
        },
      },
      {
        id: "S26-T4-A-E1",
        subtopicId: "S26-T4-A",
        kind: "guided",
        instruction:
          "SLO success_rate del VP: rate=0.9. Si rate < 0.95 imprime 'alert_success_rate', si no 'ok'. Contrato: nombre de alerta alineado al runbook (no un alias genérico). Pass: alert_success_rate.",
        hint: "rate < 0.95 → alert_success_rate",
        hints: [
          "Compara rate < 0.95 (no >).",
          "El string de alerta es alert_success_rate.",
          "0.9 está bajo el umbral → alerta.",
        ],
        edgeCases: ["ventana 7d"],
        tests: "print alert_success_rate cuando rate bajo umbral",
        feedback: "Invertir la comparación o usar un nombre informal rompe el contrato del runbook.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · success rate SLO 0.95
# DEFECT: alert si rate > 0.95 y nombre genérico
rate=0.9
print('alert' if rate > 0.95 else 'ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rate=0.9
print('alert_success_rate' if rate < 0.95 else 'ok')`,
          output: `alert_success_rate`,
        },
      },
      {
        id: "S26-T4-A-E2",
        subtopicId: "S26-T4-A",
        kind: "independent",
        instruction:
          "Control P0 de cumplimiento: n=sends_without_approve=1. Si n>0 imprime 'P0_unapproved_send', si no 'ok'. Contrato: cero envíos sin approve humano. Pass: P0_unapproved_send.",
        hint: "n > 0 es P0",
        hints: [
          "Si n>0 → 'P0_unapproved_send'; si no → 'ok'.",
          "El DEFECT invierte la lógica: no lo copies.",
          "Un solo envío sin approve ya es incidente P0.",
        ],
        edgeCases: ["sandbox misconfig"],
        tests: "P0_unapproved_send cuando n>0",
        feedback: "Tratar unapproved send como ok en sandbox sigue siendo P0 en el VP.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · unapproved send P0
# DEFECT: ok aunque n>0
n=1
print('ok' if n>0 else 'P0_unapproved_send')
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
          "Runbook de incidente P0: parts=['disable_schedule','drain','page'] y severity='P0'. Une parts con ' -> ' e imprime severity y la secuencia en una línea (p. ej. P0 disable_schedule -> drain -> page). Contrato: orden fijo de contención + severidad explícita para on-call. Pass: P0 disable_schedule -> drain -> page.",
        hint: "print severity y join(parts)",
        hints: [
          "seq = ' -> '.join(parts).",
          "print(severity, seq) en una sola línea.",
          "El orden disable_schedule → drain → page es fijo; no omitas severity.",
        ],
        edgeCases: ["oncall roster", "severidad P0 vs warning"],
        tests: "línea P0 disable_schedule -> drain -> page",
        feedback: "Saltar disable_schedule/drain o no declarar severidad deja al on-call sin contención clara.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · runbook incident + severity
# DEFECT: solo page sin severity ni secuencia
parts=['disable_schedule','drain','page']
severity='P0'
print('page')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `parts=['disable_schedule','drain','page']
severity='P0'
print(severity, ' -> '.join(parts))`,
          output: `P0 disable_schedule -> drain -> page`,
        },
      },
      {
        id: "S26-T4-B-E1",
        subtopicId: "S26-T4-B",
        kind: "guided",
        instruction:
          "Gate E2E del path canónico: steps con los 7 nodos del VP y status success en todos; audit=[{'action':'approve'}]. Imprime True solo si all(status[s]=='success' for s in steps) **y** hay al menos un action=='approve' en audit. Contrato: draft_email no se defiende sin approve. Pass: True.",
        hint: "all success AND any approve",
        hints: [
          "steps debe ser el path de 7: ingest…draft_email.",
          "Combina all(...) de status con any(a['action']=='approve' for a in audit).",
          "Sin approve el E2E del cierre debe ser False aunque todo esté success.",
        ],
        edgeCases: ["fallo parcial", "success sin approve"],
        tests: "True solo con full path success + approve en audit",
        feedback: "Un E2E de tres steps sin approve no demuestra el gate draft del VP.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · e2e path + approve gate
# DEFECT: path corto y solo any success
steps=['ingest','validate','draft']
status={s:'success' for s in steps}
audit=[{'action':'approve'}]
print(any(status[s]=='success' for s in steps))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `steps=['ingest','validate','analyze','ai_assist','report','approve','draft_email']
status={s:'success' for s in steps}
audit=[{'action':'approve'}]
ok = all(status[s]=='success' for s in steps) and any(a['action']=='approve' for a in audit)
print(ok)`,
          output: `True`,
        },
      },
      {
        id: "S26-T4-B-E2",
        subtopicId: "S26-T4-B",
        kind: "independent",
        instruction:
          "Paquete de defensa anti-fraude-auto: pkg={'fraud_labels':0,'approved':True}. Imprime 'ok' solo si fraud_labels==0 **y** approved es True; si no, 'fail'. Matching/OCR no generan labels de fraude; draft no se defiende sin approve. Pass: ok.",
        hint: "ambas condiciones del gate",
        hints: [
          "Combina fraud_labels==0 y approved con and.",
          "El DEFECT invierte o ignora approved.",
          "Matching/score nunca justifican labels automáticos.",
        ],
        edgeCases: ["no auto-fraude", "success sin approve"],
        tests: "ok solo con fraud_labels=0 y approved True",
        feedback: "fraud_labels=0 sin approve no cierra el E2E; ambas condiciones son obligatorias.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · zero fraud labels + approved
# DEFECT: solo mira fraud_labels e invierte
pkg={'fraud_labels':0,'approved':True}
print('fail' if pkg['fraud_labels']==0 else 'ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pkg={'fraud_labels':0,'approved':True}
print('ok' if pkg['fraud_labels']==0 and pkg['approved'] else 'fail')`,
          output: `ok`,
        },
      },
      {
        id: "S26-T4-B-E3",
        subtopicId: "S26-T4-B",
        kind: "transfer",
        instruction:
          "Cierre de regresión N2: imprime el dict con n2_regression='CP-N2-A/B/C critical+privacy', value_minutes_saved_est=45 y cf2 interfaces Familiarity-reporting-automation (ver solución). Contrato: evidencia de defensa, no envío real. Pass debe coincidir el dict de solution output.",
        hint: "tres claves del paquete de defensa",
        hints: [
          "Incluye n2_regression, value_minutes_saved_est y cf2.",
          "No omitas value_minutes_saved_est=45.",
          "cf2 documenta interfaces Familiarity-reporting-automation.",
        ],
        edgeCases: ["gate ≥80% no crítica; 0 fallas críticas"],
        tests: "dict completo de regresión N2 + valor + CF-2",
        feedback: "Sin value estimate o CF-2 el paquete de cierre no es defendible.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-026 · cf2 package keys
# DEFECT: omite value estimate
print({'n2_regression': 'CP-N2-A/B/C critical+privacy', 'cf2': 'interfaces'})
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
      "Orquesta el VP sintético de punta a punta: ingest→validate→analyze→ai_assist→report→approve→draft_email. Incluye checkpoint/DLQ, triple cola HITL, audit, SLO y un checklist de **regresión N2** (tests críticos CP-N2-A/B/C, E2E S14–S26, privacidad/seguridad, CF-2 interfaces). No envíes correo real; fraud_labels=0; matching no implica fraude.",
    objectives: [
      "DAG ejecutable con estados y metadata de run",
      "Resiliencia: checkpoint, retry/backoff, DLQ, rollback",
      "HITL: revisión análisis/reporte/destinatario + audit approve/reject/edit",
      "Operación: SLO/alerts/runbook + E2E con costo/valor",
      "Documentar notas de regresión N2 y CF-2 en el portafolio",
    ],
    requirements: [
      "Solo datos sintéticos; sin secretos ni PII real",
      "Cero envíos sin approve (y de hecho cero envíos reales)",
      "fraud_labels automáticos = 0 (matching ≠ fraude)",
      "Evidencia por estado del pipeline (manifest de steps)",
      "Notas de regresión N2 y CF-2 en You Do / README del proyecto",
      "Español profesional (es-PE) en runbook y mensajes de UI",
    ],
    starterCode: `# VP RPA + AI Analyst — esqueleto de cierre CP-N2-C
# Path canónico (no renombres): ingest→validate→analyze→ai_assist→report→approve→draft_email
STEPS = ["ingest", "validate", "analyze", "ai_assist", "report", "approve", "draft_email"]
state = {s: "pending" for s in STEPS}
audit = []
hitl = {"analysis": 0, "report": 0, "recipient": 0}  # pending counts (0 = clear)
ckpt, dlq = set(), []
fraud_labels = 0  # debe permanecer 0: matching ≠ fraude
run_meta = {"run_id": "cpn2c-close-01", "api_rpm": 30, "tz": "America/Lima"}

def advance(step, ok=True):
    """Marca un step success|failed; si es approve exitoso, append al audit."""
    state[step] = "success" if ok else "failed"
    if ok and step == "approve":
        audit.append({"action": "approve", "actor": "r1"})
    if ok:
        ckpt.add(step)

def can_draft():
    """draft_email solo si hay approve en audit y triple cola HITL en 0."""
    approved = any(a.get("action") == "approve" for a in audit)
    clear = all(v == 0 for v in hitl.values())
    return approved and clear

def run_all(fail_at=None):
    """Recorre STEPS; respeta can_draft; opcional fail_at para simular crash."""
    for s in STEPS:
        if fail_at == s:
            advance(s, ok=False)
            break
        if s == "draft_email" and not can_draft():
            state[s] = "blocked"
            break
        advance(s, ok=True)
    return state, audit

def package_e2e():
    """Paquete de defensa del cierre (amplíalo en el portafolio)."""
    return {
        "path": STEPS,
        "states": dict(state),
        "audit_events": len(audit),
        "fraud_labels": fraud_labels,
        "cost_tokens": 1200,
        "value_minutes_saved_est": 45,
        "n2_regression": "pass",  # re-run real: CP-N2-A/B/C + privacy + CF-2
        "run_id": run_meta["run_id"],
    }

# TODO del portafolio (completa sobre este esqueleto ejecutable):
# 1) Simula fail_at='analyze', resume desde ckpt y un item flaky → DLQ con owner.
# 2) HITL: sube pending, decide reject con reason / edit versionado / approve; audit append-only.
# 3) Empaqueta e2e + nota de privacidad (solo datos sintéticos).
# 4) Notas de regresión N2: lista de tests re-ejecutados + resultado; interfaces CF-2.
# No envíes correo real.

st, au = run_all()
print("states", [st[s] for s in STEPS])
print("can_draft_after", can_draft(), "fraud_labels", fraud_labels)
print("package", package_e2e()["n2_regression"], package_e2e()["value_minutes_saved_est"])
`,
    portfolioNote:
      "Paquete de cierre CP-N2-C para portafolio: pipeline con evidencia por estado, HITL triple, draft en sandbox y sección explícita de **regresión N2** (S14–S26) más contratos **CF-2** (Familiarity ↔ reporting ↔ automatización). Documenta límites: datos sintéticos, fraud_labels=0 y cero envíos reales. Artefactos mínimos sugeridos: manifest de estados por step, sample de audit append-only, línea de costo (tokens/minutos) y nota de privacidad.",
    rubric: [
      { criterion: "Cobertura del pipeline VP y de los criterios de cierre CP-N2-C (7 steps canónicos + HITL)", weight: "25%" },
      { criterion: "Correctitud técnica: estados, checkpoint/DLQ, rollback superseded y gate approve→draft_email", weight: "20%" },
      { criterion: "Privacidad: sin PII real, sin secretos, fraud_labels=0 y matching ≠ fraude", weight: "20%" },
      { criterion: "Casos de borde documentados: fallos, resume, reject con reason, blocked sin approve", weight: "15%" },
      { criterion: "Código legible: run_id, metadata inmutable y límites (api_rpm) explícitos", weight: "10%" },
      { criterion: "Documentación en español profesional (es-PE): runbook y mensajes de UI", weight: "10%" },
      { criterion: "Notas de regresión N2 y CF-2 con: lista de tests re-ejecutados, resultado, y interfaces CF-2 verificadas", weight: "bonus checklist" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El orden draft_email respecto a approve en el path canónico es:",
        options: ["Draft antes de approve", "Approve antes de draft_email", "En paralelo sin gate", "Solo schedule"],
        correctIndex: 1,
        explanation:
          "Aprobación humana precede al borrador final; draft_email solo tras approve con audit.",
      },
      {
        question: "La regresión N2 del cierre incluye:",
        options: ["Solo un print", "Borrar S14", "Marcar passed sin tests", "Tests críticos de capstones N2, E2E y controles de privacidad/seguridad"],
        correctIndex: 3,
        explanation:
          "La regresión N2 revalida tests críticos de capstones, E2E del tramo y controles de privacidad/seguridad.",
      },
      {
        question: "Las colas HITL analysis, report y recipient con un solo pending>0 deben:",
        options: ["Bloquear draft_email hasta all_clear", "Permitir draft_email igual", "Etiquetar fraude automático", "Borrar el audit previo"],
        correctIndex: 0,
        explanation:
          "Triple gate: any(pending>0) bloquea el borrador; la IA solo propone, no cierra el caso.",
      },
      {
        question: "fraud_labels automáticos en el VP deben ser:",
        options: ["Maximizados", "Igual al score de matching", "0 — solo evidencia para humanos", "Exportados a prensa"],
        correctIndex: 2,
        explanation:
          "Matching/score ≠ fraude; fraud_labels automáticos deben ser 0.",
      },
      {
        question: "Un item agota reintentos de timeout de export. ¿Dónde debe quedar y con qué atributo mínimo?",
        options: ["Reinyectado en success sin registro", "En DLQ con owner y razón (p. ej. timeout_exhausted)", "Marcado fraud_labels=1 automáticamente", "Borrado del checkpoint para rehacer todo el batch"],
        correctIndex: 1,
        explanation:
          "DLQ no es basurero: conserva el item con owner/SLA; no se convierte en fraude ni se pierde sin rastro.",
      },
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
