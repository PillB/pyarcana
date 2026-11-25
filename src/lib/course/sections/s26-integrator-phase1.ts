/**
 * S26 — Orquestación y VP RPA + AI Analyst
 *
 * The filename and the exported id ("integrator-phase1") both come from a pre-V3 ordering
 * and no longer describe what this section teaches. The id is the URL hash and
 * a learner save key, so it cannot be changed without losing progress.
 *
 * Read `title` below, never the slug. Matching content to the slug is how three
 * agent diagrams ended up attached to a data-testing lesson.
 */
import type { CourseSection } from '../../types'

export const section26: CourseSection = {
  id: "integrator-phase1",
  index: 26,
  title: "Orquestación y VP RPA + AI Analyst",
  shortTitle: "VP RPA + AI Analyst",
  tagline: "VP es el nombre del proyecto: el flujo que prepara el informe para el VP, el vicepresidente del desk de S19 a S25. VP RPA + AI Analyst: Excel/sistema → validación → análisis → modelo/IA → informe → aprobación → borrador de correo. Demo con datos sintéticos, evidencia de cada estado y recuperación de fallas.",
  estimatedHours: 9,
  level: "Práctica independiente",
  phase: 1,
  icon: "Award",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Aquí orquestas una cadena completa de principio a fin: Excel o sistema → validación → análisis → IA asistida → informe → aprobación humana → borrador de correo. En un escritorio de operaciones en Lima demuestras evidencia por estado, recuperación ante fallas y costo acotado. Sin autofraude ni envío sin aprobación registrada en el audit trail.",
  learningOutcomes: [
    { text: "Modelar tasks/flows/DAG con estados" },
    { text: "Configurar límites, metadata y schedules" },
    { text: "Implementar checkpoints, retry/backoff y dead-letter" },
    { text: "Garantizar idempotencia, concurrencia y rollback" },
    { text: "Diseñar revisión humana de análisis/reporte/destinatario" },
    { text: "Operar aprobación, rechazo, edición y auditoría" },
    { text: "Definir SLO, alerts y runbook" },
    { text: "Validar E2E (de extremo a extremo), seguridad, costo y métricas de valor" },
  ],
  theory: [
    {
            heading: "Seis piezas que funcionan por separado todavía no son un sistema",
      paragraphs: [
        "Tienes ingesta, calidad, análisis, reporte, correo y asistencia de IA. Cada una anda. Conectarlas revela lo que ninguna mostraba sola. ¿Qué pasa cuando la tercera falla y la cuarta ya empezó? ¿Quién decide reintentar? ¿Cómo se retoma el trabajo a mitad de camino sin repetir lo que ya salió?",
        "El primer instrumento es hacer explícito el orden. Un grafo de dependencias dice qué necesita qué, y su única regla dura es que no puede tener ciclos. Con esa forma dibujada aparecen las preguntas que importan. ¿Qué pasos pueden correr a la vez y cuáles bloquean a los demás? ¿Dónde conviene guardar un punto de control para no rehacer todo tras una caída?",
        "Después viene la resiliencia, que es sobre todo saber distinguir fallos. Un tiempo de espera agotado suele curarse solo y merece un reintento; un dato mal formado no se cura reintentando y solo desperdicia tiempo. Lo que agota sus reintentos va a una cola aparte para que alguien lo mire, en vez de bloquear la fila. Y como todo esto implica repetir pasos, cada uno tiene que poder ejecutarse dos veces sin duplicar su efecto.",
        "Luego está la parte que hace responsable al conjunto. La IA propone y una persona cierra. La cola de revisión con aprobar, rechazar o editar no es una etapa opcional al final: es lo que convierte una cadena de automatismos en un proceso del que alguien responde. Cada decisión queda con su autor y su momento.",
        "La pregunta que cierra el nivel es operativa: si esto se cae a mitad de camino, **¿qué se repite, qué se pierde y quién se entera?** Responderla es la tarea. El nivel se promociona con evidencia reproducible sobre datos sintéticos, no con una demostración que salió bien una vez.",
      ],
      callout: {
        type: "info",
        title: "Criterio de promoción N2",
        content:
          "La promoción exige CP-N2-A/B/C, regresión S14–S26 y CF-2 aprobados con evidencia reproducible. CF-2 es el control de cierre del Nivel 2, como CF-1 lo fue del Nivel 1 en S13. Comprueba tres interfaces entre Familiarity, el reporting y la automatización; Familiarity es el proyecto que reúne lo que hiciste de S01 a S25. Son `familiarity_to_reporting(metrics) -> report_body`, `reporting_to_automation(run_id) -> draft_ref` y `automation_to_audit(event) -> audit_record`; cada una se prueba con un fixture sintético.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas y condiciones de promoción.",
        "**Orden de los subtemas.** T1 arma la orquestación: grafo, estados y límites. T2 pasa a la resiliencia: puntos de control, reintentos, cola de descarte, idempotencia y reversión. T3 cubre la revisión humana: colas y decisiones de aprobar, rechazar o editar. T4 cierra con la operación y la prueba de extremo a extremo.",
        "**Contexto.** S26 orquesta el VP sintético completo: hoja de cálculo y sistema, validación, análisis, reporte y notificación. El capstone CP-N2-C se entrega aparte con su propio contrato (`rpa.run(job) -> RpaAudit`); el VP de esta sección construye las piezas que ese contrato reutiliza.",
        "**Promoción de nivel.** Exige CP-N2-A, B y C, la regresión de S14 a S26 y CF-2 (las tres interfaces del callout inicial), todos aprobados con evidencia reproducible. La regresión pide contratos estables entre análisis, reporte y automatización: mismos fixtures, mismos predicados de éxito y ninguna etiqueta automática de fraude.",
      ],
     },
     {
      heading: "Tasks, flows, DAG y estados del VP",
      figure: {
        id: "S26-dag-states",
        caption:
          "Confundir skipped con success infla la tasa de éxito con tareas que nunca corrieron.",
        alt:
          "Cinco guardas que asignan a cada tarea su estado, de pending a skipped.",
      },
      subtopicId: "S26-T1-A",
      paragraphs: [
        "Un **DAG** (directed acyclic graph) codifica dependencias de negocio: no puedes analizar antes de validar ni generar draft_email antes de approve. Path canónico del VP (7 steps): **ingest → validate → analyze → ai_assist → report → approve → draft_email**. Ese orden es el contrato del VP. Algunos ejercicios usan un tramo parcial y lo dicen en su enunciado.",
        "Cada **task** expone estados observables: `pending`, `running`, `success`, `failed`, `skipped` y `blocked`. Si A falla, B no se ejecuta y queda `skipped`. Una task queda `blocked` cuando un gate humano sigue abierto (por ejemplo, `draft_email` sin approve). El **flow** agrega un estado global (p. ej. `failed` si un nodo crítico falló). El dashboard del analista muestra **timestamp + run_id** por nodo para reanudar sin adivinar.",
        "Implementación didáctica con dicts de nodos + edges y **orden topológico** (un orden en que cada nodo va después de todos los que necesita), sin Prefect/Airflow instalado. Si hay ciclo, ese orden no existe: `topo` lanza `ValueError` y el pipeline **no arranca**. Contrato: `edges list[(str,str)]` → `order list[str]`; `approve` **antes** de `draft_email` es dependencia de negocio, no de «preferencia».",
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
    if len(order) != len(nodes):
        raise ValueError(f"ciclo en {sorted(nodes - set(order))}")
    return order

print(topo(edges))
try:
    topo([("report", "approve"), ("approve", "report")])
except ValueError as e:
    print("no arranca:", e)`,
        output: `['ingest', 'validate', 'analyze', 'ai_assist', 'report', 'approve', 'draft_email']
no arranca: ciclo en ['approve', 'report']`,
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
        "Acabas de fijar el DAG; ahora, sin **límites**, un schedule tumba el export. **Rate limits** (`api_rpm`, `max_parallel_tasks`) protegen las API y las colas compartidas: un *burst* (ráfaga) nocturno de reintentos no debe tumbar el endpoint de export del sistema sintético. Metadata inmutable al start del run: `run_id`, `trigger` (manual|schedule), `git_sha` sintético, `data_cutoff`. El `run_id` es la clave con la que encuentras los logs de un run en cada sistema que tocó. Si cambias la foto de datos, versiona un nuevo `run_id`.",
        "**Schedules** tipo cron (`0 6 * * 1-5` America/Lima) cubren días hábiles 06:00; Lima no tiene horario de verano (UTC-5 todo el año), así que la hora no se corre. On-demand cubre cierre de mes o reprocesos. Documenta también la **ventana de solape**: el tiempo en que un run anterior todavía puede seguir corriendo cuando empieza el siguiente. En deploy: **`disable_schedule` → drain** (vaciar workers) antes de cambiar schema de informe — no mezclar versiones a mitad del batch.",
        "Caso PE: San Isidro fija `max_parallel_tasks=2` y `api_rpm=30`; si `api_rpm>60` el preflight imprime `too_high` y **bloquea** el schedule hasta revisión humana del límite.",
      ],
      code: {
        language: 'python',
        title: "limits_meta.py",
        code: `def build_run_meta(run_id, api_rpm=30):
    return {
        "run_id": run_id,
        "trigger": "manual",
        "git_sha": "a1b2c3d",  # sintético
        "schedule": None,
        "limits": {"max_parallel_tasks": 2, "api_rpm": api_rpm},
        "data_cutoff": "2026-01-15",
    }

def preflight(meta):
    return "too_high" if meta["limits"]["api_rpm"] > 60 else "ok"

run_meta = build_run_meta("cpn2c-close-01")
print(run_meta["run_id"], run_meta["git_sha"], run_meta["limits"]["api_rpm"], preflight(run_meta))
print("preflight rpm=90", preflight(build_run_meta("cpn2c-close-02", api_rpm=90)))
cron = "0 6 * * 1-5"  # 06:00 L-V America/Lima conceptual
print("cron", cron, "tz", "America/Lima")`,
        output: `cpn2c-close-01 a1b2c3d 30 ok
preflight rpm=90 too_high
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
      figure: {
        id: "S26-orchestration",
        caption:
          "El checkpoint solo cumple su promesa si sobrevive al proceso; un set en memoria muere con él.",
        alt:
          "Cuatro etapas —ingest, analyze, checkpoint, report— con la frontera dibujada tras el checkpoint.",
      },
      subtopicId: "S26-T2-A",
      paragraphs: [
        "Con el path estable, un crash a mitad de `analyze` exige **checkpoint**: dejar por escrito qué ids ya se procesaron, para reanudar sin rehacer un ingest costoso. Tras el fallo, solo quedan pendientes los no marcados. El contrato es una línea — **skip si id ∈ ckpt** — y es lo que practicas aquí con un `set` en memoria. Sé claro sobre lo que ese `set` demuestra y lo que no. Te deja ejercitar el contrato dentro de un proceso vivo, pero muere con el proceso, así que no sobreviviría al crash del que estamos hablando. Reanudar de verdad exige que la marca viva fuera del proceso; en el capstone eso es un JSON en disco, y en producción una tabla o un almacén de estado.",
        "Glosa: **checkpoint** = marca de progreso persistida; **backoff** = espera creciente entre reintentos (`base * 2**(attempt-1)`, con cap); **DLQ (dead-letter queue)** = cola de ítems que agotaron reintentos y requieren dueño humano. **Retry con backoff** absorbe 429/timeout. **No** reintentes schema inválido de negocio: eso va a DLQ con owner y SLA — DLQ no es basurero silencioso.",
        "Caso PE: item flaky de export reintenta hasta `max_attempts`; si sigue fallando → DLQ con `reason=timeout_exhausted`, owner=`ops_rpa`. Contrato lab: `process_with_dlq(items, flaky_ids, ckpt)` → `(ok, dlq, ckpt)`. Si le pasas el ckpt de una corrida anterior, no repite lo ya hecho; flaky no cae a DLQ en el primer intento. Cada reintento registra la espera de backoff que tocaría (`waits_ms`); el lab no duerme de verdad para correr rápido.",
      ],
      code: {
        language: 'python',
        title: "ckpt_dlq.py",
        code: `def backoff_sleep_ms(attempt, base=100, cap=2000):
    return min(cap, base * (2 ** (attempt - 1)))

def process_with_dlq(items, flaky_ids, ckpt=None, max_attempts=3):
    ok, dlq = [], []
    ckpt = set() if ckpt is None else set(ckpt)
    for it in items:
        if it in ckpt:
            continue
        waits = []
        for attempt in range(1, max_attempts + 1):
            if it not in flaky_ids:
                ok.append(it)
                ckpt.add(it)
                break
            if attempt == max_attempts:
                dlq.append({"id": it, "reason": "timeout_exhausted",
                            "owner": "ops_rpa", "waits_ms": waits})
            else:
                waits.append(backoff_sleep_ms(attempt))  # en prod: time.sleep
    return ok, dlq, sorted(ckpt)

print([backoff_sleep_ms(i) for i in range(1, 5)])
print(process_with_dlq(["a", "b", "c"], flaky_ids={"b"}))
# Reanudación: ckpt de la corrida anterior; "a" no se repite
print(process_with_dlq(["a", "b", "c"], flaky_ids=set(), ckpt={"a"}))`,
        output: `[100, 200, 400, 800]
(['a', 'c'], [{'id': 'b', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa', 'waits_ms': [100, 200]}], ['a', 'c'])
(['b', 'c'], [], ['a', 'b', 'c'])`,
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
        "Tras checkpoint y DLQ, el siguiente riesgo es el **reintento exitoso dos veces**. Los pasos **idempotentes** usan claves de negocio (`run_id`, `entity_id`) para que la segunda escritura no pise un valor ya materializado (create-once). Un retry **no** duplica borradores por reentrega del mensaje.",
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
        store["reports"][run_id]["status"] = "superseded"  # el body se queda

write_report("r1", "informe")
write_draft("r1", "draft")
rollback("r1")
print("reports", store["reports"], "drafts", store["drafts"])`,
        output: `reports {'r1': {'body': 'informe', 'status': 'superseded'}} drafts {}`,
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
        "Con resiliencia y compensación listas, el path aún no puede materializar correo: el HITL del VP exige **tres colas** — `analysis` (métricas/outliers), `report` (narrativa), `recipient` (destinatario). Cualquier `pending > 0` **bloquea** envío: `blocked = any(count>0)`. Checklist mínima: metrics + narrative + recipient.",
        "La IA asistida (**ai_assist**, traspaso desde S25) **solo propone** texto y *highlights*; **no cierra** el caso. Si `analysis` está pendiente, el flow queda en `human_review` aunque `report` esté listo: así evitas «correo automático con narrativa alucinada».",
        "Caso: `cpn2c-hitl-01` con analysis=1, report=1, recipient=0 → `blocked True`. Scores de matching alimentan `analysis` como **evidencia**, nunca como veredicto de fraude.",
      ],
      code: {
        language: 'python',
        title: "review_queues.py",
        code: `queues = {
    "analysis": [{"id": "a1", "status": "pending"}],
    "report": [{"id": "r1", "status": "pending"}],
    "recipient": [{"id": "c1", "status": "done"}],
}

def pending_counts(q):
    return {k: sum(1 for x in v if x["status"] == "pending") for k, v in q.items()}

print(pending_counts(queues))
print("all_clear", all(c == 0 for c in pending_counts(queues).values()))`,
        output: `{'analysis': 1, 'report': 1, 'recipient': 0}
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
        "Las colas HITL se vacían con decisiones humanas; cada una deja **audit** `{action, actor, ts, reason?}`; un `edit` añade `from` y `to`, las versiones antes y después. `approve` avanza; `reject` exige reason no vacío y deja el borrador en estado `rejected`, sin envío, hasta que la cola se reabre; `edit` versiona (1→2) sin borrar historia. Sin audit, CP-N2-C no es defendible en el capstone.",
        "Actor = id sintético (`r1`, `r2`), no correo personal real. El sistema **no envía**: solo materializa `draft_email` tras approve. Rechazos reabren cola según reason code del runbook.",
        "Política PE: `quality_narrative` → reencola report; `wrong_recipient` → reencola recipient. Audit **append-only** — nunca reescritura de entradas previas.",
      ],
      code: {
        language: 'python',
        title: "audit_hitl.py",
        code: `audit = []

def act(artifact_id, action, actor, ts, reason=None, **extra):
    rec = {"id": artifact_id, "action": action, "actor": actor, "ts": ts, "reason": reason, **extra}
    audit.append(rec)
    return rec

act("report-1", "edit", "r1", "2026-01-15T09:00", reason="clarificar n", **{"from": 1, "to": 2})
act("report-1", "approve", "r2", "2026-01-15T09:30")
print(len(audit), audit[-1]["action"], audit[-1]["actor"], audit[0]["reason"], audit[0]["from"], audit[0]["to"])`,
        output: `2 approve r2 clarificar n 1 2`,
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
        "Con el gate HITL y el audit en verde, falta **operar** el VP en producción. **SLO** sintético: `success_rate ≥ 0.95` en una ventana de 7 días (`success_rate_7d`); si rate=0.90 → alerta `alert_success_rate` (mismo nombre en prosa, lab y runbook). P0: `sends_without_approve > 0` — violación de control, no warning suave.",
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
        "SLO y runbook protegen el día a día; el **cierre de nivel** exige evidencia E2E del path canónico **ingest → validate → analyze → ai_assist → report → approve → draft_email** en success con fixtures sintéticos. Seguridad: secretos fuera del repo, scopes mínimos, **`fraud_labels=0`** (el VP no autoetiqueta fraude).",
        "Costo: tokens de IA + minutos de RPA acotados. Valor: minutos ahorrados estimados (p. ej. 45) frente al proceso manual — estimación de producto, no promesa financiera.",
        "Regresión N2: re-ejecutar tests críticos de CP-N2-A/B/C, E2E del tramo S14–S26 y controles de privacidad/seguridad, más CF-2. Paquete de defensa: e2e, cost, value, `fraud_labels=0` y `n2_regression`. Ese valor sale de un `regression_log` con los comandos que corriste y su código de salida. Es `pass` solo si hay comandos y todos salieron con 0; sin log es `not_run`, nunca «planned».",
        "Caso PE: `cpn2c-close-e2e` con `data_cutoff` fijo; si un step failed → E2E False y **no** se firma promoción. Matching/OCR/RPA solo encolan evidencia — nunca claim de colusión/fraude en el informe final.",
      ],
      code: {
        language: 'python',
        title: "e2e_value.py",
        code: `STEPS = ["ingest", "validate", "analyze", "ai_assist", "report", "approve", "draft_email"]

def regression_status(log):
    if not log:
        return "not_run"
    return "pass" if all(rc == 0 for _, rc in log) else "fail"

def e2e_vp(run_state, audit, regression_log):
    e2e = all(run_state.get(s) == "success" for s in STEPS) and any(a["action"] == "approve" for a in audit)
    return {
        "e2e": e2e,
        "audit_events": len(audit),
        "fraud_labels": 0,  # política: el VP no autoetiqueta fraude
        "n2_regression": regression_status(regression_log),
    }

ok_run = {s: "success" for s in STEPS}
audit = [{"action": "approve", "actor": "r2"}]
log = [("python -m unittest tests.test_vp", 0), ("python -m unittest tests.test_cf2", 0)]
print(e2e_vp(ok_run, audit, log))
print(e2e_vp({**ok_run, "analyze": "failed"}, audit, []))`,
        output: `{'e2e': True, 'audit_events': 1, 'fraud_labels': 0, 'n2_regression': 'pass'}
{'e2e': False, 'audit_events': 1, 'fraud_labels': 0, 'n2_regression': 'not_run'}`,
      },
      callout: {
        type: "info",
        title: "CF-2 y regresión",
        content:
          "CF-2 fija las tres interfaces entre Familiarity (tu proyecto de S01 a S25), reporting y automatización. La regresión N2 no se «compensa» entre capstones.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el cierre de CP-N2-C pensando en voz alta: path canónico de 7 steps, resiliencia, HITL triple, SLO y un mini-runner E2E con regresión N2/CF-2. Sin envío real ni fraude automático.",
    steps: [
      {
        demoId: "S26-T1-A-DEMO",
        subtopicId: "S26-T1-A",
        environment: "local/cloud controlado",
        description: "Derivo el path canónico de 7 steps desde edges (ai_assist + draft_email). Pensando en voz alta: el orden sale de las dependencias de negocio, no de una lista inventada.",
        preamble:
          "El cierre CP-N2-C no «elige un orden a gusto»: el path del VP sale de dependencias de negocio. En esta demo recorres aristas `a→b` desde `ingest` hasta `draft_email`, con `ai_assist` (traspaso de S25) y `approve` **antes** del borrador. No escribas aún: predice la lista de 7 nodos y por qué omitir `validate` o poner `draft_email` antes de `approve` rompería el contrato. Observa `n_steps` y el chequeo final: el último nodo es `draft_email` y aparece una vez.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Pensando en voz alta: el orden no se inventa; sale de las dependencias de negocio.
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
print("approve_antes_de_draft", order.index("approve") < order.index("draft_email"))
`,
          output: `['ingest', 'validate', 'analyze', 'ai_assist', 'report', 'approve', 'draft_email']
n_steps 7
approve_antes_de_draft True`,
        },
        why:
          "El orden se deriva de edges, no de una lista hardcodeada. `ai_assist` es el handoff de la IA que solo propone; el gate HITL (`approve` antes de `draft_email`) es dependencia de negocio, no preferencia de UX. Un ciclo o un salto (omitir `validate`) impide arrancar el flow con evidencia auditable. En We Do derivarás un tramo parcial, armarás aristas con `zip` y agregarás el estado global del flow.",
        retrospective:
          "Si puedes explicar por qué `approve` precede a `draft_email` sin mirar el código, ya internalizaste el contrato del VP. El error clásico es inventar el orden o «ahorrar» `validate`. En We Do derivarás un tramo parcial y agregarás el estado del flow.",
      },
      {
        demoId: "S26-T1-B-DEMO",
        subtopicId: "S26-T1-B",
        environment: "local/cloud controlado",
        description: "Metadata de run con límites y zona America/Lima (pensando en voz alta). Versión didáctica: en producción añade trigger, git_sha y data_cutoff.",
        preamble:
          "Antes de habilitar un schedule en un escritorio de ops (p. ej. San Isidro), el run necesita metadata mínima: `run_id`, límite de `api_rpm` y zona `America/Lima`. En esta demo construyes esa foto y un preflight didáctico que marca `too_high` si el rpm supera 60. No escribas: predice el dict impreso, los dos preflights y por qué un burst sin límite tumbaría el export sintético.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Pensando en voz alta: el run_id une logs/HITL; api_rpm y tz fijan el contrato del schedule.
def run_meta(run_id, api_rpm=30, tz="America/Lima"):
    # Metadata inmutable al start: no reescribir tras el primer tick
    return {"run_id": run_id, "api_rpm": api_rpm, "tz": tz}

def preflight(meta):
    # Preflight didáctico San Isidro: >60 bloquea el enable del schedule
    return "too_high" if meta["api_rpm"] > 60 else "ok"

meta = run_meta("r1")
print(meta)
print("preflight", preflight(meta))
print("preflight rpm=90", preflight(run_meta("r2", api_rpm=90)))
`,
          output: `{'run_id': 'r1', 'api_rpm': 30, 'tz': 'America/Lima'}
preflight ok
preflight rpm=90 too_high`,
        },
        why:
          "El `run_id` une logs, HITL y artefactos; la metadata es inmutable al start (no reescribir a mitad del batch). El preflight protege el endpoint compartido del export. En prod se suman `trigger`, `git_sha` y `data_cutoff`. Sin metadata no hay auditoría ni schedule defendible. En We Do: snapshot de dos claves, umbral 60 y cron con tz Lima.",
        retrospective:
          "Metadata + límites son el contrato del schedule, no adornos del dict. El error clásico es «subir el rpm y ver qué pasa» o reescribir `run_id` a mitad del batch. Pregunta: ¿qué uniría logs y cola HITL si la foto del start no fuera inmutable? We Do: snapshot de dos claves, preflight 60 y cron con tz Lima.",
      },
      {
        demoId: "S26-T2-A-DEMO",
        subtopicId: "S26-T2-A",
        environment: "local/cloud controlado",
        description: "Checkpoint de reanudación + reintentos hasta max_attempts y DLQ con owner.",
        preamble:
          "Un crash a mitad de `analyze` no debe rehacer el ingest: el checkpoint marca lo ya OK y solo reanuda pendientes. En esta demo `a` ya está en ckpt, `b` es flaky y agota 3 intentos hacia DLQ con `owner=ops_rpa`, y `c` se completa. No escribas: predice `resume_from` (lo que falta hacer), el checkpoint final y el contenido de `dlq` (razón + attempts). Observa que flaky **no** cae a DLQ en el primer intento.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def resume_and_dlq(ckpt, flaky_id, max_attempts=3):
    # ckpt = ya OK; flaky falla cada intento; al agotar → DLQ con razón y owner
    pending = [x for x in ["a", "b", "c"] if x not in ckpt]
    resume_from = list(pending)
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
    return resume_from, sorted(ckpt), dlq

rf, ck, d = resume_and_dlq({"a"}, "b")
print("resume_from", rf)
print("ckpt", ck, "dlq", d)
`,
          output: `resume_from ['b', 'c']
ckpt ['a', 'c'] dlq [{'id': 'b', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa', 'attempts': 3}]`,
        },
        why:
          "Skip si id ∈ ckpt; retry hasta `max_attempts`; solo entonces DLQ con reason y owner (no basurero silencioso). Schema inválido de negocio no se reintenta como timeout. Reanudar sin duplicar y escalar a humano con owner es el núcleo de resiliencia del VP. En We Do: fórmula de backoff, append a DLQ y filtro de pendientes.",
        retrospective:
          "Reanudar sin duplicar y escalar a humano con owner es el núcleo de resiliencia del VP. El error clásico es reprocess-all o una DLQ silenciosa sin razón ni dueño. Pregunta: ¿por qué un schema inválido de negocio no debe seguir el mismo camino de retry que un timeout de export? We Do: backoff, mensaje de DLQ y lista de pendientes.",
      },
      {
        demoId: "S26-T2-B-DEMO",
        subtopicId: "S26-T2-B",
        environment: "local/cloud controlado",
        description: "Pensando en voz alta: create-once no pisa; si falla el draft, pop draft y report → superseded.",
        preamble:
          "Un reintento exitoso dos veces no debe pisar un informe ya materializado, y un fallo de `draft_email` no borra la evidencia del report. En esta demo `put_once` deja `v1` aunque llegue `v2`, y la compensación quita el draft y marca `report_status` como `superseded` sin tocar el texto del report. No escribas: predice ambas salidas y por qué no haces `del` del report.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Pensando en voz alta: idempotencia create-once + compensación parcial.
store = {}

def put_once(k, v):
    if k not in store:
        store[k] = v
    return store[k]

put_once("report", "v1")
put_once("report", "v2")  # no pisa
print("idempotent", store["report"])

def compensate_failed_draft(state):
    # Si falla draft_email tras report: pop draft; el report se queda, marcado superseded
    s = dict(state)
    s.pop("draft", None)
    if "report" in s:
        s["report_status"] = "superseded"
    return s

print(compensate_failed_draft({"report": "ok", "draft": "ok"}))
`,
          output: `idempotent v1
{'report': 'ok', 'report_status': 'superseded'}`,
        },
        why:
          "Create-once evita reescribir un informe (o un draft) ya materializado cuando el mensaje se reentrega; la demo lo muestra con el report. La compensación no es ACID mágica sino un grafo explícito (draft fuera, report intacto con `report_status` `superseded` para defensa del historial). Idempotencia y compensación parcial protegen el rastro del VP cuando falla un step tardío. En We Do: `put` condicional, pop+superseded y lock fail-closed entre workers.",
        retrospective:
          "Idempotencia y compensación parcial protegen el historial del VP sin «wipe» del informe. El error clásico es sobrescribir en cada put o borrar el report como si fuera rollback de base de datos. Pregunta: ¿qué evidencia perderías en el capstone si hicieras `del` del report? We Do: create-once, rollback parcial y busy cuando locked.",
      },
      {
        demoId: "S26-T3-A-DEMO",
        subtopicId: "S26-T3-A",
        environment: "local/cloud controlado",
        description: "Pensando en voz alta: cuento pending en analysis/report/recipient y demuestro que un solo pending bloquea draft_email.",
        preamble:
          "El VP no materializa correo con colas humanas abiertas. En esta demo hay tres contadores (`analysis`, `report`, `recipient`): con analysis=1 y report=1, `blocked` es True. Con un solo pending (recipient=1), también. Con las tres en 0, `all_clear` es True. No escribas: predice las tres líneas y por qué un solo pending basta. Recuerda: la IA solo propone; no cierra el caso.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Pensando en voz alta: tres colas; basta una >0 para bloquear el borrador.
def queue_blocked(q):
    return any(v > 0 for v in q.values())

q = {"analysis": 1, "report": 1, "recipient": 0}
print(q, "blocked", queue_blocked(q))
q_one = {"analysis": 0, "report": 0, "recipient": 1}
print(q_one, "blocked", queue_blocked(q_one))
q_clear = {"analysis": 0, "report": 0, "recipient": 0}
print("all_clear", not queue_blocked(q_clear))
`,
          output: `{'analysis': 1, 'report': 1, 'recipient': 0} blocked True
{'analysis': 0, 'report': 0, 'recipient': 1} blocked True
all_clear True`,
        },
        why:
          "`any(v>0)` es el gate, no `all`: basta un pending para bloquear. Scores de matching alimentan analysis como evidencia, nunca como fraude. Sin triple verde no hay `draft_email`. Triple revisión antes del correo es el control anti «correo con narrativa alucinada». En We Do: contar pending, any blocked y checklist de claves.",
        retrospective:
          "Triple gate es el control anti «correo con narrativa alucinada»: basta un pending para bloquear `draft_email`. El error clásico es exigir las tres colas llenas (`all`) o ignorar un solo pending. Pregunta: ¿por qué un score de matching no puede «saltar» analysis a cero pendientes? We Do: conteo, `any` y lista de colas pendientes.",
      },
      {
        demoId: "S26-T3-B-DEMO",
        subtopicId: "S26-T3-B",
        environment: "local/cloud controlado",
        description: "Pensando en voz alta: reject sin reason es invalid; approve append-only deja rastro defendible.",
        preamble:
          "Sin audit, CP-N2-C no se defiende en el capstone. En esta demo un `reject` sin `reason` devuelve `invalid` (fail-closed) y un `approve` se append al log sin reescribir historia. No escribas: predice la primera línea y el `action`/`events` del approve. Observa que el sistema **no envía** correo: solo registra la decisión.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Pensando en voz alta: reject exige reason; approve append-only sin reescribir.
def decide(action, actor, reason=None):
    if action == "reject" and not reason:
        return {"status": "invalid"}
    return {"status": "recorded", "action": action, "actor": actor, "reason": reason}

log = []
print(decide("reject", "r1", reason=None))  # fail-closed
rec = decide("approve", "r1")
log.append(rec)
print(log[-1]["action"], "events", len(log))
`,
          output: `{'status': 'invalid'}
approve events 1`,
        },
        why:
          "Reject exige reason no vacío; audit es append-only; actor sintético (`r1`), no correo personal. Reject con reason code reabre cola según runbook. Decisiones humanas dejan rastro append-only o no existen para defensa. En We Do: tupla de approve, invalid sin reason y edit versionado.",
        retrospective:
          "Decisiones humanas dejan rastro append-only o no existen para defensa en CP-N2-C. El error clásico es reject «sin justificación» o reescribir el log como si fuera el último estado de un dict. Pregunta: ¿qué no podrías demostrar en el capstone si el approve no incrementara `events`? We Do: approve con len, gate de reason y edit 1→2.",
      },
      {
        demoId: "S26-T4-A-DEMO",
        subtopicId: "S26-T4-A",
        environment: "local/cloud controlado",
        description: "Pensando en voz alta: evalúo success_rate y sends_without_approve; nombro alertas como en el runbook.",
        preamble:
          "En operación del VP, el nombre de la alerta **es** el contrato del runbook: si el dashboard dice otra cosa, la página on-call se confunde. En esta demo evalúas `success_rate` bajo 0.95 y un envío sin approve. No escribas: predice las tres listas de alertas. Observa que unapproved send es P0 aunque el rate esté bien.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `# Pensando en voz alta: nombres de alerta = contrato del runbook (no aliases).
def slo_alerts(rate, sends_without_approve, thr=0.95):
    out = []
    if rate < thr:
        out.append("alert_success_rate")
    if sends_without_approve > 0:
        out.append("P0_unapproved_send")
    return out or ["ok"]

print(slo_alerts(0.91, 0))
print(slo_alerts(0.99, 1))
print(slo_alerts(0.99, 0))
`,
          output: `['alert_success_rate']
['P0_unapproved_send']
['ok']`,
        },
        why:
          "Umbral 0.95 en ventana de 7 días, didáctico; `P0_unapproved_send` es violación de control, no warning suave. No inventes `fraud_rate` en el dashboard. `alert_success_rate` y `P0_unapproved_send` son contratos de runbook; un alias informal rompe la página on-call. En We Do: string de alerta, P0 de envíos y secuencia disable→drain→page.",
        retrospective:
          "Nombres de alerta estables unen lab, prosa y runbook: si el dashboard inventa un alias, la página on-call se confunde. El error clásico es «alert genérico» o tratar unapproved send como ok en sandbox. Pregunta: ¿por qué un rate sano no cancela un P0 de envío sin approve? We Do: umbral, P0 y secuencia de contención.",
      },
      {
        demoId: "S26-T4-B-DEMO",
        subtopicId: "S26-T4-B",
        environment: "local/cloud controlado",
        description: "Mini-runner E2E: estados nodo a nodo, fallo en analyze, gate approve→draft, regresión not_run sin log. Pensando en voz alta: un solo lifecycle une path, crash y gate HITL.",
        preamble:
          "El cierre de nivel exige un solo lifecycle: path de 7, gate HITL, evidencia de regresión y cero fraude automático. En esta demo el camino feliz marca 7 `success` y un approve en audit; el camino con `fail_at=analyze` deja analyze `failed` y los pasos siguientes `skipped`; sin approve, `draft_email` queda `blocked`. `n2_regression` sale de un `regression_log`: sin comandos corridos es `not_run`. No escribas: predice las salidas y por qué la demo no puede imprimir `pass` por su cuenta. Observa `fraud_labels 0`.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `STEPS = [
    "ingest", "validate", "analyze", "ai_assist",
    "report", "approve", "draft_email",
]

def run_vp(fail_at=None, approver=None):
    # Pensando en voz alta: un solo lifecycle une path, fallo, gate HITL y draft.
    state = {s: "pending" for s in STEPS}
    audit = []
    for i, s in enumerate(STEPS):
        if fail_at == s:
            state[s] = "failed"
            for later in STEPS[i + 1:]:
                state[later] = "skipped"
            break
        if s == "approve":
            if approver is None:
                state[s] = "pending"  # nadie aprobó: la cola sigue abierta
                continue
            audit.append({"action": "approve", "actor": approver})
        if s == "draft_email" and not any(a["action"] == "approve" for a in audit):
            state[s] = "blocked"
            break
        state[s] = "success"
    return state, audit

def regression_status(log):
    if not log:
        return "not_run"
    return "pass" if all(rc == 0 for _, rc in log) else "fail"

st, au = run_vp(approver="r1")
print([st[s] for s in STEPS])
print("audit", len(au), "fraud_labels", 0, "n2_regression", regression_status([]))
st_no, _ = run_vp()
print("sin approve", st_no["approve"], st_no["draft_email"])
st_fail, _ = run_vp(fail_at="analyze", approver="r1")
print("fail_at_analyze", st_fail["analyze"], "report", st_fail["report"])
`,
          output: `['success', 'success', 'success', 'success', 'success', 'success', 'success']
audit 1 fraud_labels 0 n2_regression not_run
sin approve pending blocked
fail_at_analyze failed report skipped`,
        },
        why:
          "Un runner une path, crash observable y gate approve→draft; `fraud_labels=0` es política de producto. La regresión N2 revalida CP-N2-A/B/C + E2E + privacy + CF-2 con evidencia: `pass` solo cuando el `regression_log` tiene comandos y todos salieron con 0. Esta demo no corre la regresión, por eso imprime `not_run`. Un solo lifecycle defendible muestra success, blocked y failed con la misma máquina de estados. En We Do: all+approve, fraud_labels+approved y paquete de cierre.",
        retrospective:
          "Un lifecycle defendible muestra success, blocked y failed con la misma máquina de estados. El error clásico es «todo success hardcodeado» o regresión «planned». We Do: all+approve, fraud_labels+approved y paquete de cierre.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de DAG, limits, checkpoint/DLQ, rollback, colas HITL, audit, SLO y E2E/regresión. Cada starter trae un **DEFECT** (fallo intencional) marcado en un comentario: tu trabajo es corregirlo hasta igualar el output de la solución. En T1-A pasas de derivar un path parcial desde edges a armar aristas con zip y, al final, a agregar el estado global del flow. Son tres escalas del mismo contrato de orquestación.",
    steps: [
      {
        id: "S26-T1-A-E1",
        subtopicId: "S26-T1-A",
        kind: "guided",
        title: "Derivar path parcial desde edges",
        preamble:
          "- **Contexto:** en el lab del VP a veces trabajas un tramo base (sin AI ni email) para validar dependencias antes del path completo.\n- **Meta:** derivar el orden lineal de `partial_edges` empezando en `ingest`, sin inventar nodos.\n- **Éxito:** `['ingest', 'validate', 'analyze', 'report']` para el tramo base y `['ingest', 'validate', 'report']` para un tramo más corto.\n- **Límites:** no hardcodees la lista; no omitas `validate`; no inserts aún `ai_assist` ni `draft_email` (vista parcial declarada).",
        instruction:
          "1. Abre el starter: imprime una lista que salta `validate` (DEFECT).\n2. Inicializa `order` con el primer nodo de la primera arista.\n3. Recorre cada `(a, b)` y, si `a` es el último de `order`, haz `append(b)`.\n4. Imprime `order` de cada tramo.",
        hint: "parte de first=edges[0][0] y append b si a==último",
        hints: [
          "order = [partial_edges[0][0]]; luego for a,b in partial_edges: si a==order[-1], append b.",
          "No omitas validate: el DEFECT salta de ingest a analyze.",
          "Full path canónico: …analyze → ai_assist → report → approve → draft_email.",
        ],
        edgeCases: ["draft_email solo tras approve en el path completo", "vista parcial declarada ≠ full path"],
        tests: "orden derivado de partial_edges (4 steps) sin hardcodear la lista a ciegas",
        feedback:
          "Saltar `validate` rompe el DAG de negocio antes de AI o correo. Derivar de edges evita inventar el orden y deja evidencia auditable en el dashboard del run.",
        retrospective:
          "El path se *lee* de dependencias; hardcodear es un atajo que falla al cambiar el grafo. El error clásico es omitir un nodo «obvio». Siguiente (E2): construir aristas consecutivas con `zip`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `tramos = [
    [("ingest", "validate"), ("validate", "analyze"), ("analyze", "report")],
    [("ingest", "validate"), ("validate", "report")],
]
for partial_edges in tramos:
    # DEFECT: salta validate y hardcodea sin recorrer edges
    print(["ingest", "analyze", "report"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tramos = [
    [("ingest", "validate"), ("validate", "analyze"), ("analyze", "report")],
    [("ingest", "validate"), ("validate", "report")],
]
for partial_edges in tramos:
    order = [partial_edges[0][0]]
    for a, b in partial_edges:
        if a == order[-1]:
            order.append(b)
    print(order)`,
          output: `['ingest', 'validate', 'analyze', 'report']
['ingest', 'validate', 'report']`,
        },
      },
      {
        id: "S26-T1-A-E2",
        subtopicId: "S26-T1-A",
        kind: "independent",
        title: "Aristas lineales con zip de nodos",
        preamble:
          "- **Contexto:** un path lineal del flow sintético necesita aristas consecutivas para el grafo, no solo una lista de nombres.\n- **Meta:** con `nodes=['a','b','c']`, construir edges con `zip` y reportar cuántas hay y cuáles son.\n- **Éxito:** `2 [('a', 'b'), ('b', 'c')]` y `1 [('x', 'y')]`.\n- **Límites:** solo path lineal (sin ciclos); no imprimas solo el `len`.",
        instruction:
          "1. Revisa el starter: calcula `edges` bien pero imprime solo `len` (DEFECT).\n2. Deja `list(zip(nodes, nodes[1:]))`.\n3. Para cada lista de nodos, imprime `len(edges)` y `edges` en la misma línea.\n4. No inventes aristas hacia atrás ni ciclos.",
        hint: "zip(nodes, nodes[1:])",
        hints: [
          "edges = list(zip(nodes, nodes[1:])) produce pares consecutivos.",
          "Imprime len(edges) y luego edges en la misma línea.",
          "Con 3 nodos lineales siempre hay 2 aristas.",
        ],
        edgeCases: ["ciclos prohibidos"],
        tests: "salida '2 [(\\'a\\', \\'b\\'), (\\'b\\', \\'c\\')]' o equivalente al solution output",
        feedback:
          "Imprimir solo `len` pierde la evidencia de qué dependencias modelaste. El audit del grafo necesita los pares consecutivos, no solo el número de edges.",
        retrospective:
          "Modelar el grafo es dejar *pares* auditables, no un contador suelto: el dashboard del run y un revisor de CF-2 deben ver qué depende de qué. Si confundes «hay 2 aristas» con «el contrato de orquestación está modelado», el audit del path queda incompleto. Pregunta: ¿qué arista faltaría si mañana insertas `ai_assist` entre analyze y report? Luego (E3) agregas el estado global del flow.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `for nodes in (['a', 'b', 'c'], ['x', 'y']):
    edges = list(zip(nodes, nodes[1:]))
    print(len(edges))  # DEFECT: imprime solo len
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for nodes in (['a', 'b', 'c'], ['x', 'y']):
    edges = list(zip(nodes, nodes[1:]))
    print(len(edges), edges)`,
          output: `2 [('a', 'b'), ('b', 'c')]
1 [('x', 'y')]`,
        },
      },
      {
        id: "S26-T1-A-E3",
        subtopicId: "S26-T1-A",
        kind: "transfer",
        title: "Estado global del flow si hay failed",
        preamble:
          "- **Contexto:** el dashboard del VP no muestra solo nodos sueltos: necesita un estado agregado del flow.\n- **Meta:** con dos corridas, decidir `failed` o `success` con `any`.\n- **Éxito:** `failed` para {'a': 'success', 'b': 'failed'} y `success` para {'a': 'success', 'b': 'skipped'}.\n- **Límites:** `skipped` no cuenta como failed en este lab; no hardcodees `success`.",
        instruction:
          "1. Lee el DEFECT: siempre imprime `success`.\n2. Evalúa si algún valor es `'failed'`.\n3. Imprime `'failed'` o `'success'` para cada corrida.\n4. No mutes el dict de tasks.",
        hint: "any(...) sobre values",
        hints: [
          "Usa any(v == 'failed' for v in tasks.values()).",
          "Si any es True imprime 'failed'; si no 'success'.",
          "No hardcodees 'success' sin mirar el dict.",
        ],
        edgeCases: ["skipped frente a failed"],
        tests: "agregación failed|success según any failed en values",
        feedback:
          "Un solo nodo failed debe tumbar el estado global del flow. «Casi todo OK ⇒ success» es el error clásico del dashboard.",
        retrospective:
          "El estado global del flow es un contrato de dashboard: un nodo crítico en `failed` debe tumbar el agregado aunque el resto diga success. El error clásico es promediar «casi todo OK» o tratar `skipped` como fallo de negocio. Pregunta: si `b` estuviera `skipped` y `a` en success, ¿qué imprimirías aquí y por qué? Ese hábito te sirve al reanudar un run con nodos omitidos a propósito.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `runs = [{'a': 'success', 'b': 'failed'}, {'a': 'success', 'b': 'skipped'}]
for tasks in runs:
    print('success')  # DEFECT: siempre success
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `runs = [{'a': 'success', 'b': 'failed'}, {'a': 'success', 'b': 'skipped'}]
for tasks in runs:
    print('failed' if any(v == 'failed' for v in tasks.values()) else 'success')`,
          output: `failed
success`,
        },
      },
      {
        id: "S26-T1-B-E1",
        subtopicId: "S26-T1-B",
        kind: "guided",
        title: "Snapshot inmutable run_id y api_rpm",
        preamble:
          "- **Contexto:** ops necesita una foto legible del start del run para unir logs y límites, no el dict completo con ruido.\n- **Meta:** armar un snapshot de solo lectura con `run_id` y `api_rpm` e imprimir tupla con el tamaño.\n- **Éxito:** `('cpn2c-1', 30, 2)` y `('cpn2c-2', 45, 2)`.\n- **Límites:** no mutes `m`; no reescribas claves tras el start; no imprimas el dict entero.",
        instruction:
          "1. Abre el starter: imprime `m` completo (DEFECT).\n2. Crea `snap` solo con `run_id` y `api_rpm`.\n3. Para cada metadata, imprime `(snap['run_id'], snap['api_rpm'], len(snap))`.\n4. Deja `tz` fuera del snapshot de este ejercicio.",
        hint: "snapshot con dos claves + len",
        hints: [
          "snap = {'run_id': m['run_id'], 'api_rpm': m['api_rpm']}.",
          "Imprime (snap['run_id'], snap['api_rpm'], len(snap)).",
          "No reasignes claves en m; el snapshot es la foto inmutable del start.",
        ],
        edgeCases: ["uuid en prod", "metadata no se reescribe tras start"],
        tests: "tupla (run_id, api_rpm, 2) desde snapshot de dos claves",
        feedback:
          "El dict entero no sirve como llave de join. Un snapshot de dos claves deja `run_id` + límite legibles para el dashboard y el audit del start.",
        retrospective:
          "La foto del start es inmutable: versionas un nuevo `run_id` si cambia la foto de datos. El error clásico es reescribir metadata a mitad del batch. Siguiente (E2): preflight del umbral de rpm.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `metas = [
    {'run_id': 'cpn2c-1', 'api_rpm': 30, 'tz': 'America/Lima'},
    {'run_id': 'cpn2c-2', 'api_rpm': 45, 'tz': 'America/Lima'},
]
for m in metas:
    print(m)  # DEFECT: imprime dict entero sin snapshot
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `metas = [
    {'run_id': 'cpn2c-1', 'api_rpm': 30, 'tz': 'America/Lima'},
    {'run_id': 'cpn2c-2', 'api_rpm': 45, 'tz': 'America/Lima'},
]
for m in metas:
    snap = {'run_id': m['run_id'], 'api_rpm': m['api_rpm']}
    print((snap['run_id'], snap['api_rpm'], len(snap)))`,
          output: `('cpn2c-1', 30, 2)
('cpn2c-2', 45, 2)`,
        },
      },
      {
        id: "S26-T1-B-E2",
        subtopicId: "S26-T1-B",
        kind: "independent",
        title: "Preflight api_rpm sobre umbral 60",
        preamble:
          "- **Contexto:** en el adapter sintético de Lima, un `api_rpm` demasiado alto tumba el export compartido.\n- **Meta:** clasificar `api_rpm` 90, 60 y 61 como `too_high` o `ok` con umbral 60 (estricto: 60 pasa).\n- **Éxito:** `too_high`, `ok` y `too_high`, una por línea.\n- **Límites:** umbral didáctico 60 (no 100); este gate bloquearía `enable` del schedule.",
        instruction:
          "1. Revisa el starter: compara contra 100 (DEFECT).\n2. Cambia a `api_rpm > 60`.\n3. Imprime `'too_high'` o `'ok'`.\n4. No alteres los valores del fixture: 60 y 61 fijan el borde.",
        hint: "umbral 60",
        hints: [
          "Compara api_rpm > 60, no > 100.",
          "Si supera: 'too_high'; si no: 'ok'.",
          "Este gate impide enable del schedule en el lab.",
        ],
        edgeCases: ["burst frente a sustained"],
        tests: "etiqueta too_high|ok según umbral 60",
        feedback:
          "Con umbral 100 el preflight deja pasar un rpm que tumba el export. El gate de Lima es fail-closed: mejor bloquear el schedule que tumbar el endpoint.",
        retrospective:
          "El umbral didáctico 60 es política de capacidad del export compartido, no un número «generoso por comodidad». Confundir holgura con seguridad es un bug de ops: el preflight debe bloquear `enable` del schedule antes de que el burst tumbe el endpoint. Pregunta: si midieras rpm real en un cierre de mes, ¿bajarías el umbral o subirías capacidad con revisión humana? Luego (E3) armarás el cron con zona Lima.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `for api_rpm in (90, 60, 61):
    print('too_high' if api_rpm > 100 else 'ok')  # DEFECT: umbral 100
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for api_rpm in (90, 60, 61):
    print('too_high' if api_rpm > 60 else 'ok')`,
          output: `too_high
ok
too_high`,
        },
      },
      {
        id: "S26-T1-B-E3",
        subtopicId: "S26-T1-B",
        kind: "transfer",
        title: "Schedule 06:00 America/Lima listo",
        preamble:
          "- **Contexto:** el batch del escritorio PE corre a las 06:00 en días hábiles en zona Lima, no en UTC «por defecto de servidor».\n- **Meta:** fijar cron + tz correctos y un preflight `ready`/`blocked`.\n- **Éxito:** `ready` y `0 6 * * 1-5 America/Lima` para el schedule corregido; `blocked` para el schedule de control en UTC.\n- **Límites:** no uses UTC; el cron debe empezar por `0 6`; enable solo si ready.",
        instruction:
          "1. Corrige el DEFECT: `tz` está en UTC.\n2. Deja `America/Lima` y el cron `0 6 * * 1-5`.\n3. Calcula `ready` con tz correcta y prefijo del cron.\n4. Imprime la etiqueta y luego `cron` y `tz`; al final, la etiqueta del schedule de control.",
        hint: "preflight tz + prefijo de cron; luego print cron tz",
        hints: [
          "Condición ready: schedule['tz']=='America/Lima' y schedule['cron'].startswith('0 6').",
          "El DEFECT pone tz='UTC' → debe quedar America/Lima.",
          "Segunda línea: print(schedule['cron'], schedule['tz']).",
        ],
        edgeCases: ["Lima no tiene horario de verano: UTC-5 todo el año", "enable schedule solo si ready"],
        tests: "línea ready y línea 0 6 * * 1-5 America/Lima",
        feedback:
          "UTC o un cron sin 06:00 local desplaza el batch fuera del horario operativo de Lima. El «servidor ya está en UTC» no es argumento de negocio.",
        retrospective:
          "El horario del batch es un contrato de negocio en America/Lima, no un default del host. El error clásico es dejar UTC «porque el servidor ya lo usa» y descubrir el desfase en el primer lunes operativo. Pregunta: ¿qué harías antes de un deploy que cambia el schema del informe? (disable schedule → drain workers → luego cutover). Ese orden evita mezclar versiones a mitad del batch.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `schedule = {"cron": "0 6 * * 1-5", "tz": "UTC"}  # DEFECT: tz UTC

def ready_for(s):
    return s["tz"] == "America/Lima" and s["cron"].startswith("0 6")

print("ready" if ready_for(schedule) else "blocked")
print(schedule["cron"], schedule["tz"])
control = {"cron": "0 6 * * 1-5", "tz": "UTC"}  # 06:00 UTC son las 01:00 en Lima
print("ready" if ready_for(control) else "blocked")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `schedule = {"cron": "0 6 * * 1-5", "tz": "America/Lima"}

def ready_for(s):
    return s["tz"] == "America/Lima" and s["cron"].startswith("0 6")

print("ready" if ready_for(schedule) else "blocked")
print(schedule["cron"], schedule["tz"])
control = {"cron": "0 6 * * 1-5", "tz": "UTC"}  # 06:00 UTC son las 01:00 en Lima
print("ready" if ready_for(control) else "blocked")`,
          output: `ready
0 6 * * 1-5 America/Lima
blocked`,
        },
      },
      {
        id: "S26-T2-A-E1",
        subtopicId: "S26-T2-A",
        kind: "guided",
        title: "Backoff exponencial attempt 3 base 100",
        preamble:
          "- **Contexto:** un 429 o timeout de export no se resuelve reintentando a ritmo fijo; el lab usa espera creciente.\n- **Meta:** calcular `base * 2**(attempt-1)` con base=100 para attempt 1, 3 y 4.\n- **Éxito:** `100`, `400` y `800`, uno por línea.\n- **Límites:** no uses `base*attempt` (lineal); este ejercicio no aplica cap ni jitter.",
        instruction:
          "1. Abre el starter: `base * attempt` (DEFECT lineal).\n2. Cambia a `base * (2 ** (attempt - 1))`.\n3. Imprime el entero de milisegundos de cada intento.\n4. No inventes un sleep real en el lab.",
        hint: "base * 2**(attempt-1)",
        hints: [
          "attempt=3 → 2**(3-1) = 4; 100*4 = 400.",
          "No uses base*attempt (eso es lineal, no exponencial).",
          "El lab no aplica cap; solo la fórmula.",
        ],
        edgeCases: ["cap"],
        tests: "entero 400 según fórmula de backoff",
        feedback:
          "Con attempt=3, `2**(3-1)=4` y `100*4=400`. El backoff lineal (`base*attempt`) martilla el export sintético ante 429/timeout; el exponencial da el respiro creciente que el lab modela sin cap ni jitter.",
        retrospective:
          "Exponencial da aire al servicio compartido; lineal confunde «número de intento» con multiplicador seguro. El error clásico es copiar un sleep fijo o un `base*attempt` «porque se ve simple». Pregunta: ¿dónde pondrías un `cap` en prod sin perder el crecimiento inicial? Siguiente (E2): materializar la DLQ con owner.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `base = 100
for attempt in (1, 3, 4):
    print(base * attempt)  # DEFECT: lineal base*attempt
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `base = 100
for attempt in (1, 3, 4):
    print(base * (2 ** (attempt - 1)))`,
          output: `100
400
800`,
        },
      },
      {
        id: "S26-T2-A-E2",
        subtopicId: "S26-T2-A",
        kind: "independent",
        title: "DLQ con owner tras agotar intentos",
        preamble:
          "- **Contexto:** cuando un ítem agota reintentos de timeout, no se borra: va a DLQ con dueño y razón.\n- **Meta:** si `attempts >= max_attempts`, append el dict de evidencia e imprimir la lista.\n- **Éxito:** `[]` para el ítem con attempts=1 de 3, y `[{'id': 'x', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa', 'attempts': 3}]` para el ítem que agotó sus 3.\n- **Límites:** no envíes a DLQ en el primer fallo si aún hay cupo; incluye `attempts` en el dict.",
        instruction:
          "1. Revisa el starter: imprime `dlq` vacía aunque attempts=3 (DEFECT).\n2. Compara `attempts` con `max_attempts`.\n3. Append id, reason, owner y attempts.\n4. Imprime la lista `dlq` de cada caso.",
        hint: "append solo si attempts >= max_attempts",
        hints: [
          "Compara attempts con max_attempts antes de append.",
          "Incluye attempts en el dict para evidencia del runbook.",
          "No envíes a DLQ en el primer fallo si aún hay cupo de reintento.",
        ],
        edgeCases: ["owner DLQ", "no DLQ prematura"],
        tests: "lista con un dict id/reason/owner/attempts tras agotar",
        feedback:
          "Una DLQ sin owner o sin attempts no es defendible; DLQ al primer fallo contradice el retry. El runbook necesita dueño humano y evidencia de intentos.",
        retrospective:
          "La DLQ es una cola de trabajo con dueño y SLA, no un basurero: reason + attempts permiten al runbook decidir reintento, fix de adapter o abandono controlado. El error clásico es DLQ prematura (primer fallo) o append sin `owner`. Pregunta: ¿quién reabre el ítem si `ops_rpa` no mira la cola en 24 h? Luego (E3) filtras pendientes del checkpoint.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `max_attempts = 3
for attempts in (1, 3):
    dlq = []
    # DEFECT: DLQ vacía aunque attempts agotados
    print(dlq)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `max_attempts = 3
for attempts in (1, 3):
    dlq = []
    if attempts >= max_attempts:
        dlq.append({
            'id': 'x',
            'reason': 'timeout_exhausted',
            'owner': 'ops_rpa',
            'attempts': attempts,
        })
    print(dlq)`,
          output: `[]
[{'id': 'x', 'reason': 'timeout_exhausted', 'owner': 'ops_rpa', 'attempts': 3}]`,
        },
      },
      {
        id: "S26-T2-A-E3",
        subtopicId: "S26-T2-A",
        kind: "transfer",
        title: "Pendientes del checkpoint tras crash",
        preamble:
          "- **Contexto:** tras un crash, solo quieres reprocesar lo que no está en el checkpoint.\n- **Meta:** imprimir solo los pendientes de dos corridas: ckpt={'a'} con items ['a','b'], y ckpt={'a','b'} con items ['a','b','c'].\n- **Éxito:** `['b']` y `['c']`.\n- **Límites:** no reimprimas `items` completo; no mutes `ckpt` en este lab.",
        instruction:
          "1. Lee el DEFECT: imprime todos los items.\n2. Filtra con `i not in ckpt`.\n3. Imprime la lista de pendientes.\n4. No hardcodees `['b']` sin mirar ckpt.",
        hint: "i not in ckpt",
        hints: [
          "Filtra: [i for i in items if i not in ckpt].",
          "No reimprimas items completo (eso reprocesa).",
          "'a' ya está en ckpt → solo queda 'b'.",
        ],
        edgeCases: ["persistencia"],
        tests: "lista de pendientes no presentes en ckpt",
        feedback:
          "Reprocesar todo tras un crash desperdicia ingest y rompe el checkpoint. Skip si id ∈ ckpt es el contrato de reanudación del VP.",
        retrospective:
          "Skip si id ∈ ckpt es el contrato de reanudación. El error clásico es rehacer ingest costoso. Pregunta: ¿dónde persistirías el ckpt fuera del lab en memoria?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `runs = [({'a'}, ['a', 'b']), ({'a', 'b'}, ['a', 'b', 'c'])]
for ckpt, items in runs:
    print(items)  # DEFECT: reprocess all
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `runs = [({'a'}, ['a', 'b']), ({'a', 'b'}, ['a', 'b', 'c'])]
for ckpt, items in runs:
    print([i for i in items if i not in ckpt])`,
          output: `['b']
['c']`,
        },
      },
      {
        id: "S26-T2-B-E1",
        subtopicId: "S26-T2-B",
        kind: "guided",
        title: "Write create-once sin pisar valor",
        preamble:
          "- **Contexto:** un mensaje de cola puede reentregarse; la segunda escritura no debe pisar el report ya creado.\n- **Meta:** implementar `put(k,v)` que solo escribe si la clave no existe.\n- **Éxito:** tras `v1` y `v2`, imprimir `v1`.\n- **Límites:** no hagas upsert versionado aquí; no borres el store entre puts.",
        instruction:
          "1. Abre el starter: `put` siempre asigna (DEFECT).\n2. Escribe solo si `k not in store`.\n3. Ejecuta las dos llamadas y imprime `store['r']`.\n4. No cambies el orden de las puts.",
        hint: "if k not in store",
        hints: [
          "Dentro de put: escribe solo si k no está en store.",
          "La segunda put('r','v2') no debe cambiar el valor.",
          "Imprime store['r'] al final (esperado v1).",
        ],
        edgeCases: ["upsert versioned"],
        tests: "store['r'] permanece v1 tras dos puts",
        feedback:
          "Sobrescribir en cada put duplica o corrompe drafts bajo reentrega de cola. Create-once deja la primera materialización estable: el segundo mensaje con la misma clave de negocio no pisa `v1`.",
        retrospective:
          "Create-once es el hábito de idempotencia del lab: la clave de negocio gana al «último write». El error clásico es un upsert silencioso «para no fallar». Pregunta: ¿cuándo sí querrías un write versionado en lugar de create-once? Siguiente (E2): compensación cuando falla el draft.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `store={}

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
        title: "Compensar draft y report superseded",
        preamble:
          "- **Contexto:** falló `draft_email` después de materializar el informe; hay que revertir el side-effect del draft sin borrar evidencia.\n- **Meta:** `pop` del draft y marcar el status del report como `superseded`, con la misma forma que la teoría: el report es un dict con `body` y `status`.\n- **Éxito:** `{'report': {'body': 'informe', 'status': 'superseded'}}` en las dos corridas: con draft y sin draft (la compensación no falla si el draft nunca se escribió).\n- **Límites:** no borres el report; no dejes el draft huérfano.",
        instruction:
          "1. Revisa el starter: imprime el state intacto (DEFECT).\n2. Quita del state la clave del borrador, sin fallar si no estuviera.\n3. Cambia solo `status` del reporte a `superseded`; el `body` se queda.\n4. Imprime `state` de cada corrida.",
        hint: "pop draft + superseded",
        hints: [
          "state.pop('draft', None) quita el borrador.",
          "Asigna state['report']['status'] = 'superseded' (no pop del report, no reemplaces el dict).",
          "El grafo de compensación del VP no borra evidencia del informe.",
        ],
        edgeCases: ["compensar side effects"],
        tests: "state sin draft y report superseded",
        feedback:
          "Borrar el report pierde la evidencia del run; `superseded` es la compensación correcta para defensa del capstone. El draft se saca con `pop`; el informe se marca, no se elimina del historial.",
        retrospective:
          "Compensar no es «dejar el state como si nada hubiera pasado»: es un grafo de side-effects (draft fuera, report superseded). El error clásico es `del` del report o dejar el draft huérfano. Pregunta: ¿qué dirías en un postmortem si el dashboard ya no muestra el informe fallido? Luego (E3) el lock de concurrencia.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `states = [
    {'report': {'body': 'informe', 'status': 'active'}, 'draft': 'd1'},
    {'report': {'body': 'informe', 'status': 'active'}},
]
for state in states:
    # DEFECT: no pop ni superseded
    print(state)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `states = [
    {'report': {'body': 'informe', 'status': 'active'}, 'draft': 'd1'},
    {'report': {'body': 'informe', 'status': 'active'}},
]
for state in states:
    state.pop('draft', None)
    state['report']['status'] = 'superseded'
    print(state)`,
          output: `{'report': {'body': 'informe', 'status': 'superseded'}}
{'report': {'body': 'informe', 'status': 'superseded'}}`,
        },
      },
      {
        id: "S26-T2-B-E3",
        subtopicId: "S26-T2-B",
        kind: "transfer",
        title: "Lock fail-closed: busy si locked",
        preamble:
          "- **Contexto:** dos workers no deben editar el mismo informe; si `locked=True`, reencolas.\n- **Meta:** imprimir `('busy', id)` o `('enter', id)` según el flag.\n- **Éxito:** `('busy', 'report-1')` y `('enter', 'report-2')`.\n- **Límites:** fail-closed (ante duda, no entras); sin busy-loop en el lab.",
        instruction:
          "1. Lee el DEFECT: la condición está invertida (enter cuando locked).\n2. Si locked → `busy` + id; si no → `enter` + id.\n3. Imprime la tupla de cada entidad.\n4. No ignores el `id` en la salida.",
        hint: "busy + id si locked; enter + id si libre",
        hints: [
          "Lee entity['locked'] y entity['id'].",
          "Si locked → ('busy', id); si no → ('enter', id).",
          "El DEFECT invierte la condición: no lo copies.",
        ],
        edgeCases: ["ttl del lock", "reencolar cuando busy"],
        tests: "tupla (busy, report-1) cuando locked=True",
        feedback:
          "Entrar con locked=True permite dos workers sobre el mismo informe; el id en la tupla deja evidencia para el runbook.",
        retrospective:
          "Busy + id deja evidencia para el runbook; entrar con lock permite corrupción. El error clásico es invertir el booleano «para probar». Pregunta: ¿qué TTL de lease usarías en prod?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `entities = [{"id": "report-1", "locked": True}, {"id": "report-2", "locked": False}]
for entity in entities:
    # DEFECT: enter aunque locked
    print(("enter", entity["id"]) if entity["locked"] else ("busy", entity["id"]))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `entities = [{"id": "report-1", "locked": True}, {"id": "report-2", "locked": False}]
for entity in entities:
    print(("busy", entity["id"]) if entity["locked"] else ("enter", entity["id"]))`,
          output: `('busy', 'report-1')
('enter', 'report-2')`,
        },
      },
      {
        id: "S26-T3-A-E1",
        subtopicId: "S26-T3-A",
        kind: "guided",
        title: "Contar pendientes en cola analysis",
        preamble:
          "- **Contexto:** la cola HITL de analysis muestra ítems aún por revisar; el dashboard necesita el conteo de `pending`.\n- **Meta:** con tres ítems (dos pending y uno done), imprimir cuántos están pending.\n- **Éxito:** el entero `2` (el starter imprime `1`).\n- **Límites:** solo la cola analysis; no mutes la lista; no cuentes `done`.",
        instruction:
          "1. Abre el starter: filtra `status=='done'` (DEFECT).\n2. Cambia a `status=='pending'`.\n3. Imprime el `sum`/conteo.\n4. No alteres los dicts de la lista.",
        hint: "sum status==pending",
        hints: [
          "Filtra x['status']=='pending', no 'done'.",
          "sum(1 for x in analysis if ...) da el conteo.",
          "No mutes la lista; solo lees.",
        ],
        edgeCases: ["done frente a approved"],
        tests: "entero de pendientes en analysis",
        feedback:
          "Contar `done` subestima la cola HITL y puede liberar el gate antes de tiempo. El revisor necesita pendientes reales, no «lo ya cerrado».",
        retrospective:
          "Pending es el único status que bloquea avance en este lab. El error clásico es mezclar done/approved en el conteo. Siguiente (E2): gate multi-cola con `any`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: cuenta done
analysis=[{'status': 'pending'}, {'status': 'done'}, {'status': 'pending'}]
print(sum(1 for x in analysis if x['status']=='done'))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `analysis=[{'status': 'pending'}, {'status': 'done'}, {'status': 'pending'}]
print(sum(1 for x in analysis if x['status']=='pending'))`,
          output: `2`,
        },
      },
      {
        id: "S26-T3-A-E2",
        subtopicId: "S26-T3-A",
        kind: "independent",
        title: "Gate blocked si alguna cola > 0",
        preamble:
          "- **Contexto:** el borrador del VP se bloquea si **cualquier** cola HITL tiene trabajo pendiente.\n- **Meta:** decidir blocked con `any` para tres estados de colas.\n- **Éxito:** `True` (analysis=1), `True` (report=2) y `False` (las tres en 0).\n- **Límites:** no uses `all` (exigiría las tres llenas); no inventes un cuarto gate.",
        instruction:
          "1. Revisa el starter: usa `all(v>0)` (DEFECT).\n2. Cambia a `any(v>0 ...)`.\n3. Imprime el booleano de cada estado.\n4. No hardcodees `True` sin mirar `q`.",
        hint: "any(v > 0 ...)",
        hints: [
          "blocked = any(v > 0 for v in q.values()).",
          "all(v > 0) sería incorrecto: basta un pending.",
          "Con analysis=1 el gate debe ser True.",
        ],
        edgeCases: ["triple gate"],
        tests: "True si any queue > 0",
        feedback:
          "Usar `all` exige las tres colas llenas; el gate real bloquea con una sola. Confundir `all` con `any` es un bug silencioso de cumplimiento.",
        retrospective:
          "Fail-closed de correo: un solo pending debe bastar para bloquear el borrador, aunque report y recipient estén en cero. Confundir `all` con `any` es un bug silencioso de cumplimiento (parece «estricto» pero libera el gate con colas a medias). Pregunta: con analysis=0, report=2, recipient=0, ¿qué booleano esperas y por qué? Luego (E3) listas las claves aún pending.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `estados = [
    {'analysis': 1, 'report': 0, 'recipient': 0},
    {'analysis': 0, 'report': 2, 'recipient': 0},
    {'analysis': 0, 'report': 0, 'recipient': 0},
]
for q in estados:
    print(all(v > 0 for v in q.values()))  # DEFECT: all >0
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `estados = [
    {'analysis': 1, 'report': 0, 'recipient': 0},
    {'analysis': 0, 'report': 2, 'recipient': 0},
    {'analysis': 0, 'report': 0, 'recipient': 0},
]
for q in estados:
    print(any(v > 0 for v in q.values()))`,
          output: `True
True
False`,
        },
      },
      {
        id: "S26-T3-A-E3",
        subtopicId: "S26-T3-A",
        kind: "transfer",
        title: "Checklist de colas aún pending",
        preamble:
          "- **Contexto:** el revisor del VP necesita saber **qué** colas siguen pending, no un checklist genérico de nombres de negocio.\n- **Meta:** derivar las claves con status `pending` en orden analysis → report → recipient.\n- **Éxito:** `['analysis', 'recipient']` y luego `['report']`.\n- **Límites:** no hardcodees metrics/narrative; no incluyas `report` si está done.",
        instruction:
          "1. Lee el DEFECT: imprime una lista fija de labels.\n2. Define el orden canónico de las tres colas.\n3. Incluye solo claves cuyo value sea `'pending'`.\n4. Imprime esa lista para cada estado.",
        hint: "filtra keys con status pending",
        hints: [
          "Recorre el orden canónico analysis → report → recipient.",
          "Incluye la clave solo si value == 'pending'.",
          "report está done → no entra en la lista.",
        ],
        edgeCases: ["evidencia adjunta"],
        tests: "lista de colas pending en orden canónico",
        feedback:
          "Hardcodear metrics/narrative/recipient no enseña a leer el estado de las colas. El checklist se *lee* del status, no se memoriza.",
        retrospective:
          "El checklist se *lee* del estado, no se memoriza. El error clásico es UI con labels desactualizados. Pregunta: ¿por qué report done no debe aparecer aunque «suene» a revisión?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `estados = [
    {'analysis': 'pending', 'report': 'done', 'recipient': 'pending'},
    {'analysis': 'done', 'report': 'pending', 'recipient': 'done'},
]
for queues in estados:
    # DEFECT: imprime checklist fijo sin mirar status
    print(['metrics', 'narrative', 'recipient'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `estados = [
    {'analysis': 'pending', 'report': 'done', 'recipient': 'pending'},
    {'analysis': 'done', 'report': 'pending', 'recipient': 'done'},
]
order = ['analysis', 'report', 'recipient']
for queues in estados:
    print([k for k in order if queues[k] == 'pending'])`,
          output: `['analysis', 'recipient']
['report']`,
        },
      },
      {
        id: "S26-T3-B-E1",
        subtopicId: "S26-T3-B",
        kind: "guided",
        title: "Audit append-only de un approve",
        preamble:
          "- **Contexto:** cada approve del VP debe dejar decisión y prueba de que el log creció sin reescritura.\n- **Meta:** append dos approve (actores sintéticos `r1` y `r2`) e imprimir `(action, len(audit))` tras cada uno.\n- **Éxito:** `('approve', 1)` y luego `('approve', 2)`.\n- **Límites:** no reasignes `audit` a otra lista; no imprimas solo el actor.",
        instruction:
          "1. Abre el starter: imprime solo `actor` (DEFECT).\n2. Tras el append, lee `action` y `len(audit)`.\n3. Imprime la tupla tras cada append.\n4. No mutes el dict del evento ya appendeado.",
        hint: "print (action, len)",
        hints: [
          "Tras append, lee audit[0]['action'] y len(audit).",
          "No reasignes audit a otra lista (append-only).",
          "La tupla demuestra decisión + que hay exactamente un evento.",
        ],
        edgeCases: ["timestamp", "no reescritura"],
        tests: "tupla (approve, 1) del primer evento append-only",
        feedback:
          "El actor solo no demuestra la decisión. La tupla `(action, len)` prueba qué se aprobó y que hay exactamente un evento append-only.",
        retrospective:
          "Append-only es el hábito de audit del cierre. El error clásico es «log = último estado». Siguiente (E2): reject sin reason → invalid.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit = []
for actor in ('r1', 'r2'):
    audit.append({'action': 'approve', 'actor': actor})
    print(audit[-1]['actor'])  # DEFECT: imprime solo actor
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit = []
for actor in ('r1', 'r2'):
    audit.append({'action': 'approve', 'actor': actor})
    print((audit[-1]['action'], len(audit)))`,
          output: `('approve', 1)
('approve', 2)`,
        },
      },
      {
        id: "S26-T3-B-E2",
        subtopicId: "S26-T3-B",
        kind: "independent",
        title: "Reject sin reason es invalid",
        preamble:
          "- **Contexto:** un rechazo humano sin justificación no es defendible ni operable (¿qué cola reabrir?).\n- **Meta:** con `action='reject'` y tres reasons (None, '' y 'quality_narrative'), imprimir `invalid` o `ok`.\n- **Éxito:** `invalid`, `invalid` y `ok`.\n- **Límites:** reason vacío o None son inválidos; no imprimas `ok` a ciegas.",
        instruction:
          "1. Revisa el starter: imprime `ok` siempre (DEFECT).\n2. Si reject y no hay reason → `invalid`.\n3. En cualquier otro caso → `ok`.\n4. No inventes un reason en este ejercicio.",
        hint: "reject and not reason",
        hints: [
          "Condición: action=='reject' and not reason → 'invalid'.",
          "No imprimas 'ok' a ciegas.",
          "reason vacío o None son ambos inválidos.",
        ],
        edgeCases: ["reason codes"],
        tests: "invalid cuando reject sin reason",
        feedback:
          "Reject sin reason se rechaza a nivel API; el lab lo modela como `invalid`. Fail-closed protege el runbook de reencolado sin justificación.",
        retrospective:
          "Fail-closed en reject protege el runbook de reencolado. El error clásico es aceptar reject «mudo». Luego (E3) versionas un edit con evento de audit.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `action = 'reject'
for reason in (None, '', 'quality_narrative'):
    print('ok')  # DEFECT: ok sin reason
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `action = 'reject'
for reason in (None, '', 'quality_narrative'):
    print('invalid' if action == 'reject' and not reason else 'ok')`,
          output: `invalid
invalid
ok`,
        },
      },
      {
        id: "S26-T3-B-E3",
        subtopicId: "S26-T3-B",
        kind: "transfer",
        title: "Edit versionado con evento de audit",
        preamble:
          "- **Contexto:** una edición de narrativa del informe no borra historia: sube versión y deja evento.\n- **Meta:** de `ver=1` pasar a 2 y append `{action, actor, from, to}`, la forma que la teoría da a un `edit`.\n- **Éxito:** `(2, 1, 'edit', 1, 2)`.\n- **Límites:** no borres eventos previos; un solo append en este lab.",
        instruction:
          "1. Lee el DEFECT: imprime ver=1 y sin acción.\n2. Guarda `from`, incrementa `ver`, append el dict de edit.\n3. Imprime `(ver, len(audit), audit[-1]['action'], audit[-1]['from'], audit[-1]['to'])`.\n4. Usa el actor sintético `r1`.",
        hint: "ver += 1 luego audit.append",
        hints: [
          "Primero ver += 1; luego audit.append(...).",
          "Usa las claves action/actor/from/to del contrato.",
          "len(audit) debe ser 1 tras un solo edit.",
        ],
        edgeCases: ["diff store"],
        tests: "tupla (2, 1, 'edit') con audit append-only",
        feedback:
          "El versionado sin evento de audit no es defendible en CP-N2-C. Mutar el texto «en el mismo ver» borra historia.",
        retrospective:
          "Un edit de narrativa debe subir versión **y** dejar evento con `from`/`to`: el revisor ve el salto, no solo el texto final. El error clásico es mutar el cuerpo «en el mismo ver» o append sin actor sintético. Pregunta: ¿por qué `from`/`to` ayudan más al audit que un contador suelto de ediciones? Ese rastro es lo que defiende el cierre CP-N2-C.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: no incrementa ni audita
ver = 1
audit = []
print((ver, len(audit), None, None, None))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ver = 1
audit = []
from_v = ver
ver += 1
audit.append({'action': 'edit', 'actor': 'r1', 'from': from_v, 'to': ver})
print((ver, len(audit), audit[-1]['action'], audit[-1]['from'], audit[-1]['to']))`,
          output: `(2, 1, 'edit', 1, 2)`,
        },
      },
      {
        id: "S26-T4-A-E1",
        subtopicId: "S26-T4-A",
        kind: "guided",
        title: "Alerta alert_success_rate bajo 0.95",
        preamble:
          "- **Contexto:** el SLO del VP exige `success_rate ≥ 0.95`; por debajo se dispara la alerta del runbook.\n- **Meta:** con rate 0.9, 0.97 y 0.95, emitir el nombre canónico de alerta o `ok`.\n- **Éxito:** `alert_success_rate`, `ok` y `ok` (0.95 cumple el SLO).\n- **Límites:** compara `rate < 0.95` (no `>`); no uses un alias genérico `alert`.",
        instruction:
          "1. Abre el starter: condición invertida y string `alert` (DEFECT).\n2. Corrige a `rate < 0.95`.\n3. Imprime `'alert_success_rate'` o `'ok'`.\n4. No cambies los valores del fixture.",
        hint: "rate < 0.95 → alert_success_rate",
        hints: [
          "Compara rate < 0.95 (no >).",
          "El string de alerta es alert_success_rate.",
          "0.9 está bajo el umbral → alerta.",
        ],
        edgeCases: ["ventana 7d"],
        tests: "print alert_success_rate cuando rate bajo umbral",
        feedback:
          "Con 0.9 debes alertar con el nombre del runbook. Invertir la comparación o usar un alias informal rompe la página on-call y el playbook.",
        retrospective:
          "El string de alerta es contrato, no cosmético. El error clásico es «cualquier alert sirve». Siguiente (E2): P0 de envíos sin approve.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `for rate in (0.9, 0.97, 0.95):
    print('alert' if rate > 0.95 else 'ok')  # DEFECT: alert si rate > 0.95 y nombre genérico
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for rate in (0.9, 0.97, 0.95):
    print('alert_success_rate' if rate < 0.95 else 'ok')`,
          output: `alert_success_rate
ok
ok`,
        },
      },
      {
        id: "S26-T4-A-E2",
        subtopicId: "S26-T4-A",
        kind: "independent",
        title: "P0 si hay envío sin approve",
        preamble:
          "- **Contexto:** cero envíos sin approve humano es control de cumplimiento del VP (incluso en sandbox mal configurado).\n- **Meta:** con `n=1` y `n=0`, emitir `P0_unapproved_send` o `ok`.\n- **Éxito:** `P0_unapproved_send` y luego `ok`.\n- **Límites:** un solo envío ya es P0; no inviertas la lógica «ok si n>0».",
        instruction:
          "1. Revisa el starter: imprime `ok` cuando `n>0` (DEFECT).\n2. Si `n>0` → `P0_unapproved_send`.\n3. Si no → `ok`.\n4. No trates sandbox como excepción en este lab.",
        hint: "n > 0 es P0",
        hints: [
          "Si n>0 → 'P0_unapproved_send'; si no → 'ok'.",
          "El DEFECT invierte la lógica: no lo copies.",
          "Un solo envío sin approve ya es incidente P0.",
        ],
        edgeCases: ["sandbox misconfig"],
        tests: "P0_unapproved_send cuando n>0",
        feedback:
          "Tratar unapproved send como ok en sandbox sigue siendo P0 en el VP. Es incidente de control, no de latencia.",
        retrospective:
          "Cero envíos sin approve es control de cumplimiento del VP, no un warning de latencia: un solo `n>0` ya es P0 aunque el rate de success esté impecable. El error clásico es «era sandbox, da igual» o invertir el booleano «para ver el camino feliz». Pregunta: ¿qué evidencia pedirías en el audit si la alerta P0 se dispara a las 06:10 Lima? Luego (E3) el runbook de contención.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `for n in (1, 0):
    print('ok' if n > 0 else 'P0_unapproved_send')  # DEFECT: ok aunque n>0
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for n in (1, 0):
    print('P0_unapproved_send' if n > 0 else 'ok')`,
          output: `P0_unapproved_send
ok`,
        },
      },
      {
        id: "S26-T4-A-E3",
        subtopicId: "S26-T4-A",
        kind: "transfer",
        title: "Runbook P0 disable drain page",
        preamble:
          "- **Contexto:** ante un P0 del VP, el on-call necesita severidad explícita y el orden de contención, no solo «avisar».\n- **Meta:** unir `parts` con ` -> ` e imprimir severity + secuencia.\n- **Éxito:** `P0 disable_schedule -> drain -> page`.\n- **Límites:** orden fijo; no omitas severity; no saltes drain.",
        instruction:
          "1. Lee el DEFECT: solo imprime `page`.\n2. Haz `join` de las tres partes con `' -> '`.\n3. Imprime `severity` y la secuencia en una línea.\n4. No reordenes disable/drain/page.",
        hint: "print severity y join(parts)",
        hints: [
          "seq = ' -> '.join(parts).",
          "print(severity, seq) en una sola línea.",
          "El orden disable_schedule → drain → page es fijo; no omitas severity.",
        ],
        edgeCases: ["oncall roster", "severidad P0 frente a warning"],
        tests: "línea P0 disable_schedule -> drain -> page",
        feedback:
          "Saltar disable_schedule/drain o no declarar severidad deja al on-call sin contención clara. Contención antes de página: primero paras el cron y drenas, luego avisas.",
        retrospective:
          "El on-call necesita severidad explícita **y** el orden de contención: primero paras el cron (`disable_schedule`), drenas workers, luego paginas. Page-first sin drenar deja jobs a medias y mezcla versiones de informe. Pregunta: ¿qué riesgos hay si cambias el schema del report sin `disable_schedule`? Ese playbook es el mismo que documentarás en el runbook del cierre.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: solo page sin severity ni secuencia
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
        title: "E2E: 7 steps success y approve",
        preamble:
          "- **Contexto:** el gate E2E del cierre CP-N2-C no se contenta con «algo pasó»: exige el path canónico completo y approve en audit.\n- **Meta:** True solo si los 7 steps están success **y** hay al menos un approve.\n- **Éxito:** tres líneas: `True` (path completo y approve), `False` (falló `report`) y `False` (sin approve).\n- **Límites:** path de 7 (no tres); no uses solo `any(success)`; draft no se defiende sin approve.",
        instruction:
          "1. Corre el starter: con path corto y `any` (DEFECT) imprime `True` tres veces.\n2. Lista los 7 nodos canónicos en `STEPS`.\n3. Dentro de `e2e_ok`, combina `all(... success)` con `any(... approve)`.\n4. Imprime el booleano de cada corrida.",
        hint: "all success AND any approve",
        hints: [
          "steps debe ser el path de 7: ingest…draft_email.",
          "Combina all(...) de status con any(a['action']=='approve' for a in audit).",
          "Sin approve el E2E del cierre debe ser False aunque todo esté success.",
        ],
        edgeCases: ["fallo parcial", "success sin approve"],
        tests: "True solo con full path success + approve en audit",
        feedback:
          "Un E2E de tres steps o sin approve no demuestra el gate `draft_email` del VP. El cierre exige path completo **y** decisión humana en audit.",
        retrospective:
          "Success sin approve es un falso positivo de cierre. El error clásico es acortar el path «para la demo». Siguiente (E2): fraud_labels=0 y approved juntos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# DEFECT: path corto y solo any success
STEPS=['ingest','validate','draft_email']
def e2e_ok(status, audit):
    return any(status[s]=='success' for s in STEPS)
completo={s:'success' for s in ['ingest','validate','analyze','ai_assist','report','approve','draft_email']}
fallo=dict(completo, report='failed')
print(e2e_ok(completo, [{'action':'approve'}]))
print(e2e_ok(fallo, [{'action':'approve'}]))
print(e2e_ok(completo, []))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `STEPS=['ingest','validate','analyze','ai_assist','report','approve','draft_email']
def e2e_ok(status, audit):
    return all(status[s]=='success' for s in STEPS) and any(a['action']=='approve' for a in audit)
completo={s:'success' for s in STEPS}
fallo=dict(completo, report='failed')
print(e2e_ok(completo, [{'action':'approve'}]))
print(e2e_ok(fallo, [{'action':'approve'}]))
print(e2e_ok(completo, []))`,
          output: `True
False
False`,
        },
      },
      {
        id: "S26-T4-B-E2",
        subtopicId: "S26-T4-B",
        kind: "independent",
        title: "Gate fraud_labels 0 y approved",
        preamble:
          "- **Contexto:** matching/OCR/RPA no generan etiquetas de fraude; el draft no se defiende sin approve.\n- **Meta:** con tres paquetes, emitir `ok` o `fail`.\n- **Éxito:** `ok` (0 labels y aprobado), `fail` (sin aprobar) y `fail` (1 label).\n- **Límites:** ambas condiciones con `and`; no inviertas «fail si labels==0».",
        instruction:
          "1. Revisa el starter: invierte e ignora `approved` (DEFECT).\n2. Exige `fraud_labels==0` **y** `approved`.\n3. Imprime `'ok'` o `'fail'`.\n4. No eleves labels por score de matching.",
        hint: "ambas condiciones del gate",
        hints: [
          "Combina fraud_labels==0 y approved con and.",
          "El DEFECT invierte o ignora approved.",
          "Matching/score nunca justifican labels automáticos.",
        ],
        edgeCases: ["no autofraude", "success sin approve"],
        tests: "ok solo con fraud_labels=0 y approved True",
        feedback:
          "`fraud_labels=0` sin approve no cierra el E2E: ambas condiciones son obligatorias e independientes. Matching/score nunca justifican labels automáticos ni «ok» si el humano no firmó.",
        retrospective:
          "Cero autofraude y approve humano son independientes y ambos obligatorios. El error clásico es «labels en 0 ya basta». Luego (E3) el paquete de defensa con value y CF-2.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `pkgs = [
    {'fraud_labels': 0, 'approved': True},
    {'fraud_labels': 0, 'approved': False},
    {'fraud_labels': 1, 'approved': True},
]
for pkg in pkgs:
    # DEFECT: solo mira fraud_labels e invierte
    print('fail' if pkg['fraud_labels'] == 0 else 'ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pkgs = [
    {'fraud_labels': 0, 'approved': True},
    {'fraud_labels': 0, 'approved': False},
    {'fraud_labels': 1, 'approved': True},
]
for pkg in pkgs:
    print('ok' if pkg['fraud_labels'] == 0 and pkg['approved'] else 'fail')`,
          output: `ok
fail
fail`,
        },
      },
      {
        id: "S26-T4-B-E3",
        subtopicId: "S26-T4-B",
        kind: "transfer",
        title: "Paquete de defensa N2 value y CF-2",
        preamble:
          "- **Contexto:** el paquete de cierre del VP une regresión N2, estimación de valor y nota CF-2; sin value no hay métrica de impacto.\n- **Meta:** implementar `defense_package(...)` con las tres claves y llamar con los fixtures del lab.\n- **Éxito:** dos dicts con `n2_regression`, `value_minutes_saved_est=45` y `cf2`. `n2_regression` sale de `regression_status(log)`: `pass` con el log de comandos que salieron con 0, `not_run` con el log vacío. `cf2` nombra las tres interfaces de CF-2 (ver el callout inicial).\n- **Límites:** no omitas value; no dejes `cf2` vacío; evidencia real ≠ string `planned`.",
        instruction:
          "1. Lee el DEFECT: el return omite `value_minutes_saved_est`.\n2. Incluye las tres claves mapeando los argumentos.\n3. Llama con cada log del fixture.\n4. Imprime el dict completo de cada llamada.",
        hint: "def que arma las tres claves; no omitas value_min",
        hints: [
          "return {'n2_regression': n2_status, 'value_minutes_saved_est': value_min, 'cf2': cf2_note}.",
          "El DEFECT omite value_minutes_saved_est: restáuralo.",
          "cf2 nombra las tres interfaces de CF-2: familiarity_to_reporting, reporting_to_automation y automation_to_audit.",
        ],
        edgeCases: ["un comando con código de salida distinto de 0 da fail", "evidencia real ≠ 'planned'"],
        tests: "dict completo vía función (n2_regression + value + CF-2)",
        feedback:
          "Sin value estimate o CF-2 el paquete de cierre no es defendible; hardcodear solo dos claves es una demo incompleta, no evidencia de regresión.",
        retrospective:
          "Cierre defendible = regresión re-ejecutada + valor estimado + interfaces CF-2. El error clásico es un dict de dos claves «para la demo». Pregunta: ¿qué pondrías en `n2_regression` si un test crítico falló?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `CF2 = "familiarity_to_reporting, reporting_to_automation, automation_to_audit"

def regression_status(log):
    if not log:
        return "not_run"
    return "pass" if all(rc == 0 for _, rc in log) else "fail"

def defense_package(n2_status, value_min, cf2_note):
    # DEFECT: omite value_minutes_saved_est
    return {
        "n2_regression": n2_status,
        "cf2": cf2_note,
    }

logs = [[("python -m unittest tests.test_vp", 0)], []]
for log in logs:
    print(defense_package(regression_status(log), 45, CF2))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `CF2 = "familiarity_to_reporting, reporting_to_automation, automation_to_audit"

def regression_status(log):
    if not log:
        return "not_run"
    return "pass" if all(rc == 0 for _, rc in log) else "fail"

def defense_package(n2_status, value_min, cf2_note):
    return {
        "n2_regression": n2_status,
        "value_minutes_saved_est": value_min,
        "cf2": cf2_note,
    }

logs = [[("python -m unittest tests.test_vp", 0)], []]
for log in logs:
    print(defense_package(regression_status(log), 45, CF2))`,
          output: `{'n2_regression': 'pass', 'value_minutes_saved_est': 45, 'cf2': 'familiarity_to_reporting, reporting_to_automation, automation_to_audit'}
{'n2_regression': 'not_run', 'value_minutes_saved_est': 45, 'cf2': 'familiarity_to_reporting, reporting_to_automation, automation_to_audit'}`,
        },
      },
    ],
  },
  youDo: {
    title: "VP RPA + AI Analyst — práctica integradora + notas de regresión N2",
    context:
      "Orquesta el VP sintético de punta a punta: ingest→validate→analyze→ai_assist→report→approve→draft_email. Incluye checkpoint/DLQ, triple cola HITL, audit, SLO y un checklist de **regresión N2** (tests críticos CP-N2-A/B/C, E2E S14–S26, privacidad/seguridad y CF-2). Este proyecto no es el capstone CP-N2-C, que tiene su propio contrato (`rpa.run(job) -> RpaAudit`) y su rúbrica. El capstone reutiliza lo que construyes aquí: idempotencia, rollback, aprobación con actor y logs sin PII. **CF-2** son tres interfaces; cada una se prueba con un fixture sintético. Son `familiarity_to_reporting(metrics: dict) -> str` (cuerpo del informe), `reporting_to_automation(run_id: str) -> str` (referencia del draft) y `automation_to_audit(event: dict) -> dict` (registro de audit con action, actor y ts). No envíes correo real; fraud_labels=0; matching no implica fraude.",
    objectives: [
      "DAG ejecutable con estados y metadata de run",
      "Resiliencia: checkpoint, retry/backoff, DLQ, rollback",
      "HITL: revisión análisis/reporte/destinatario + audit approve/reject/edit",
      "Operación: SLO con alerta alert_success_rate, runbook disable_schedule → drain → page y E2E con costo/valor",
      "Documentar notas de regresión N2 y CF-2 en el portafolio",
    ],
    requirements: [
      "Solo datos sintéticos; sin secretos ni PII real",
      "Cero envíos sin approve (y de hecho cero envíos reales)",
      "fraud_labels automáticos = 0 (matching ≠ fraude)",
      "Evidencia por estado del pipeline (manifest de steps)",
      "Regresión N2 con `regression_log`: cada comando re-ejecutado y su código de salida; `n2_regression` es `pass` solo si hay comandos y todos salieron con 0",
      "Las tres interfaces CF-2 del contexto, cada una con un test sobre un fixture sintético",
      "El checkpoint se escribe en un archivo JSON y una segunda corrida (otro proceso) reanuda desde ese archivo",
      "approve es una función aparte: solo escribe en el audit si las tres colas HITL están en 0 y la llama un actor humano con nombre (id sintético)",
      "Un archivo test_vp.py que pase con los invariantes de check_invariants() del starter",
      "Español profesional (es-PE) en runbook y mensajes de UI",
    ],
    starterCode: `# VP RPA + AI Analyst — esqueleto de la práctica integradora (no es el capstone CP-N2-C)
# Path canónico (no renombres): ingest→validate→analyze→ai_assist→report→approve→draft_email
import json
from pathlib import Path

STEPS = ["ingest", "validate", "analyze", "ai_assist", "report", "approve", "draft_email"]
state = {s: "pending" for s in STEPS}
audit = []
hitl = {"analysis": 0, "report": 0, "recipient": 0}  # pending counts (0 = clear)
dlq = []
fraud_labels = 0  # debe permanecer 0: matching ≠ fraude
run_meta = {"run_id": "cpn2c-close-01", "api_rpm": 30, "tz": "America/Lima"}
CKPT_PATH = Path("ckpt_cpn2c-close-01.json")  # el checkpoint vive fuera del proceso
regression_log = []  # (comando, código de salida) de cada test re-ejecutado

def load_ckpt():
    return set(json.loads(CKPT_PATH.read_text())) if CKPT_PATH.exists() else set()

def save_ckpt(ckpt):
    CKPT_PATH.write_text(json.dumps(sorted(ckpt)))

def clear():
    return all(v == 0 for v in hitl.values())

def approve(actor):
    """Decisión humana: solo con las tres colas en 0 y un actor con nombre."""
    if not actor or not clear():
        return False
    audit.append({"action": "approve", "actor": actor})
    return True

def can_draft():
    """draft_email solo si hay approve en audit y triple cola HITL en 0."""
    return clear() and any(a.get("action") == "approve" for a in audit)

def run_all(fail_at=None):
    """Recorre STEPS; approve espera la decisión humana; fail_at simula un crash."""
    ckpt = load_ckpt()
    for i, s in enumerate(STEPS):
        if s in ckpt:
            state[s] = "success"
            continue
        if fail_at == s:
            state[s] = "failed"
            for later in STEPS[i + 1:]:
                state[later] = "skipped"
            break
        if s == "approve":
            if not any(a.get("action") == "approve" for a in audit):
                continue  # queda pending hasta que una persona llame approve()
        if s == "draft_email" and not can_draft():
            state[s] = "blocked"
            break
        state[s] = "success"
        ckpt.add(s)
        save_ckpt(ckpt)
    return state, audit

def regression_status(log):
    if not log:
        return "not_run"
    return "pass" if all(rc == 0 for _, rc in log) else "fail"

def package_e2e():
    """Paquete de defensa (amplíalo en el portafolio)."""
    return {
        "path": STEPS,
        "states": dict(state),
        "audit_events": len(audit),
        "fraud_labels": fraud_labels,
        "n2_regression": regression_status(regression_log),
        "run_id": run_meta["run_id"],
    }

def check_invariants():
    """Copia estos asserts a test_vp.py y hazlos pasar con tu implementación."""
    hitl["report"] = 1
    assert approve("r1") is False          # cola abierta: approve no entra al audit
    hitl["report"] = 0
    assert approve("") is False            # sin actor no hay decisión
    assert fraud_labels == 0
    assert package_e2e()["n2_regression"] != "pass" or regression_log
    # Completa: reject sin reason es invalid; resume desde CKPT_PATH no repite steps;
    # un flaky que agota intentos va a dlq con owner; ninguna función envía correo.

# Completa en el portafolio (sobre este esqueleto ejecutable):
# 1) Corre run_all(fail_at='analyze') y luego run_all() en otro proceso: reanuda desde CKPT_PATH.
# 2) HITL: sube pending, decide reject con reason / edit versionado / approve(actor); audit append-only.
# 3) Implementa las tres interfaces CF-2 del contexto, cada una con su test.
# 4) Corre la regresión N2 y anota cada comando con su código de salida en regression_log.
# No envíes correo real.

CKPT_PATH.unlink(missing_ok=True)
st, au = run_all()
print("states", [st[s] for s in STEPS])
print("approve", approve("r1"), "can_draft", can_draft(), "fraud_labels", fraud_labels)
st, au = run_all()
print("draft_email", st["draft_email"], "package", package_e2e()["n2_regression"])
CKPT_PATH.unlink(missing_ok=True)
`,
    portfolioNote:
      "Práctica integradora del VP para portafolio (el capstone CP-N2-C se entrega aparte). Incluye pipeline con evidencia por estado, HITL triple, draft en sandbox y una sección explícita de **regresión N2** (S14–S26) más las tres interfaces **CF-2** (Familiarity, el proyecto que reúne S01 a S25 ↔ reporting ↔ automatización). Documenta los límites: datos sintéticos, `fraud_labels=0` y cero envíos reales. Artefactos mínimos sugeridos: manifest de estados por step, muestra de audit append-only, línea de costo (tokens/minutos) y nota de privacidad.",
    rubric: [
      { criterion: "Cobertura del pipeline VP (7 steps canónicos + HITL) y test_vp.py en verde", weight: "20%" },
      { criterion: "Correctitud técnica: estados (skipped tras un fallo, blocked sin approve), checkpoint persistido en JSON, DLQ, rollback superseded y gate approve→draft_email", weight: "20%" },
      { criterion: "Privacidad: sin PII real, sin secretos, fraud_labels=0 y matching ≠ fraude", weight: "20%" },
      { criterion: "Casos de borde documentados: fallos, resume desde archivo, reject con reason, blocked sin approve", weight: "15%" },
      { criterion: "SLO y alerta con nombre estable (alert_success_rate) y runbook disable_schedule → drain → page", weight: "10%" },
      { criterion: "Regresión N2 y CF-2: regression_log con comandos y códigos de salida, y las tres interfaces CF-2 probadas", weight: "5%" },
      { criterion: "Código legible: run_id, metadata inmutable y límites (api_rpm) explícitos", weight: "5%" },
      { criterion: "Documentación en español profesional (es-PE): runbook y mensajes de UI", weight: "5%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante del gate demuestras con print o test (approve en audit, triple cola en 0, o blocked sin approve)? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, secretos, cero envíos reales)? (3) En el README, una frase de impacto medible (p. ej. minutos estimados) que puedas defender en 30 segundos sin abrir el código, y la lista de comandos de la regresión N2 con su resultado. Escribe `pass` solo si los corriste y todos salieron con 0. Si no puedes explicar por qué `fraud_labels` debe quedar en 0, la práctica aún no está lista.",
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
        question: "Las colas HITL analysis, report y recipient con un solo pending > 0 deben:",
        options: ["Bloquear draft_email hasta all_clear", "Permitir draft_email igual", "Etiquetar fraude automático", "Borrar el audit previo"],
        correctIndex: 0,
        explanation:
          "Triple gate: any(pending > 0) bloquea el borrador; la IA solo propone, no cierra el caso.",
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
      {
        question: "El path canónico del VP RPA + AI Analyst es:",
        options: ["ingest → validate → ai_assist → analyze → report → approve → draft_email", "ingest → validate → analyze → ai_assist → report → draft_email → approve", "ingest → analyze → validate → ai_assist → report → approve → draft_email", "ingest → validate → analyze → ai_assist → report → approve → draft_email"],
        correctIndex: 3,
        explanation:
          "Los cuatro órdenes tienen los 7 steps; solo uno respeta las dependencias: validate antes de analyze, analyze antes de ai_assist (la IA trabaja sobre el análisis, traspaso de S25) y approve antes de draft_email.",
      },
      {
        question: "Si cambias la foto de datos a mitad de un run, la política de metadata del VP es:",
        options: ["Versionar un nuevo run_id con metadata inmutable al start", "Reescribir el mismo run_id con el nuevo data_cutoff", "Borrar el audit y reutilizar el schedule", "Ignorar metadata y confiar solo en el cron"],
        correctIndex: 0,
        explanation:
          "Metadata (run_id, trigger, git_sha, data_cutoff, límites) es inmutable al start; un cambio de foto de datos abre un nuevo run_id.",
      },
      {
        question: "Si falla draft_email después de materializar el report, la compensación correcta es:",
        options: ["Borrar report y draft del historial sin rastro", "Dejar el draft huérfano y el report en active", "Quitar el draft y marcar el report como superseded (sin borrar evidencia)", "Etiquetar fraud_labels=1 y reenviar el correo"],
        correctIndex: 2,
        explanation:
          "La compensación parcial saca el draft y deja el report superseded para defensa; no reescribe el historial ni inventa fraude.",
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
