import type { CourseSection } from '../../types'

export const section38: CourseSection = {
  id: "performance-extreme",
  index: 38,
  title: "Concurrencia, observabilidad y workflows resilientes",
  shortTitle: "Concurrencia y resiliencia",
  tagline: "pipeline reanudable con trace por caso, métricas de cola y manejo de proveedor lento, proceso caído y reejecución",
  estimatedHours: 19,
  level: "Competente a experto",
  phase: 2,
  icon: "Activity",
  accentColor: "bg-gradient-to-br from-fuchsia-400 to-indigo-900",
  jobRelevance:
    "En operación de triage (fintech, retail, banca de procesos en Perú y la región), un batch de scoring no puede colgarse por un proveedor lento ni duplicar side effects al reiniciar. Esta sección entrena concurrencia correcta, **observabilidad** (logs/metrics/traces; o11y en jerga de industria) y workflows con checkpoint/idempotencia para el gate CP-N3-C. Logs sin PII real; datos sintéticos CASO-LIM-038.",
  learningOutcomes: [
    { text: "Elegir threads, processes o async según bottleneck medido (I/O vs CPU)" },
    { text: "Razonar GIL, costo de serialización e IPC con payloads compactos" },
    { text: "Aplicar pools, backpressure (queue maxsize) y rate limits (token bucket)" },
    { text: "Definir timeouts, cancelación y cierre de recursos en finally" },
    { text: "Emitir logs estructurados, metrics de cola y traces con correlation_id" },
    { text: "Redactar PII, definir SLI/SLO y consumir error budget con criterio" },
    { text: "Implementar estados, checkpoint e idempotency keys sin side effects duplicados" },
    { text: "Operar retry con backoff, DLQ, replay controlado y runbook de on-call" },
  ],
  theory: [
    {
      heading: "Operación del triage (CP-N3-C)",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Bound (I/O vs CPU):** cuello de botella medido. **GIL:** Global Interpreter Lock de CPython (limita CPU multi-thread). **Backpressure:** cola con `maxsize` que frena al productor. **Token bucket:** rate limit didáctico (aquí estático; en prod se rellena por ventana). **Observabilidad (o11y):** logs + metrics + traces unidos por correlation_id. **SLI/SLO:** indicador vs objetivo de servicio; **error budget** es lo que se consume al violar el SLO. **Idempotency key:** `case:step:ver` para no duplicar side effects. **DLQ:** dead-letter queue de mensajes venenosos. **last_done / resume_from:** último paso checkpointed vs siguiente pendiente.",
        "Esta sección opera el pipeline de triage CP-N3-C bajo carga realista: el batch debe reanudarse tras un crash, trazar cada caso sintético y sobrevivir a un proveedor lento o a un worker caído. No optimizamos microsegundos a ciegas; diseñamos concurrencia correcta, observabilidad y workflows con checkpoint e idempotencia. Continúa la disciplina de S37 (medir antes de cambiar) y prepara los contratos que S39 ensamblará en el Case Triage N3.",
        "Contrato operativo de la sección. Entrada: cola de casos sintéticos `CASO-LIM-038`, límites de tasa del proveedor mock, budgets de latencia p95 y políticas de retry/DLQ. Salida: pipeline reanudable con trace por case_id, métricas de cola y runbook de fallos. Error: side effect duplicado, PII raw en logs o cola sin backpressure bloquea promoción. Criterio: mismo resultado funcional tras reejecución controlada.",
        "Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia un API mock y CPU de features en lotes. Seguiremos el caso `c-synth-1` a lo largo de T1–T4: medir bound → acotar cola y tasa → emitir o11y sin PII → checkpoint/idempotencia → retry/DLQ/runbook. El foco es **concurrencia correcta y resiliencia operativa**, no micro-optimización con Numba/Cython. Orden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, `queue`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real.",
      ],
      code: {
        language: 'python',
        title: "s38_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-LIM-038",
        "gates": ["idempotent_resume", "no_pii_logs", "backpressure"],
        "duplicate_side_effect_ok": False,
        "pii_in_logs_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("duplicate_side_effect_ok", c["duplicate_side_effect_ok"])
print("pii_in_logs_ok", c["pii_in_logs_ok"])
`,
        output: `case CASO-LIM-038
duplicate_side_effect_ok False
pii_in_logs_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de operación",
        content:
          "Pipeline reanudable con trace por caso, sin PII real en logs y con runbook de proveedor lento / proceso caído / reejecución. Si falta evidencia de idempotencia, no se promociona.",
      },
    },
    {
      heading: "Threads, processes y async (elegir por bound)",
      subtopicId: "S38-T1-A",
      paragraphs: [
        "Threads conviene cuando el cuello es I/O concurrente (esperas de red o disco) y el trabajo por hilo es liviano. Processes conviene cuando el cuello es CPU (features densas, scoring vectorial) y quieres evadir el GIL de CPython. Async brilla con muchos I/O en un solo hilo de evento, siempre que no bloquees el loop con CPU pesada. **Mide primero** (wall vs CPU en el path caliente); la moda del framework no es un contrato. En stdlib, el modelo se materializa con `concurrent.futures.ThreadPoolExecutor` / `ProcessPoolExecutor` o `asyncio` + `wait_for` para timeouts; aquí practicamos el **criterio de elección**, colas acotadas y contratos de fallo sin lanzar pools pesados ni red real en el navegador.",
        "Contrato operativo. Entrada: etiqueta de bound (`io` | `cpu` | `mixed`) medida en el path caliente del triage sintético y un tope de workers N. Salida: elección documentada `async_or_threads` | `processes` | `batch_then_io` y pool_size = N. Error: elegir async por moda sin medir, o lanzar cientos de procesos para I/O trivial. Criterio de éxito: la decisión se justifica con bottleneck observado y un plan de medición, no con preferencia de framework.",
        "Aplicación a `CASO-LIM-038-T1A` (Red Andina sintético): el caso `c-synth-1` entra por intake (I/O al proveedor mock de normalización) y luego calcula features locales (CPU). Primero midimos wall vs CPU; si wall >> CPU en el tramo de red, usamos async/threads; si el tramo de features satura un core, movemos ese tramo a process pool con N acotado (p. ej. 4). Datos inventados; sin credenciales ni red real; sin PII en logs del bench. El mismo `c-synth-1` reaparece en T2 (cola y timeout), T3 (corr y SLO) y T4 (checkpoint y DLQ): es un solo batch que se endurece por capas.",
      ],
      code: {
        language: 'python',
        title: "concurrency_pick.py",
        code: `def measure_bound(wall_ms: float, cpu_ms: float) -> str:
    # wall >> cpu ⇒ espera (I/O); wall ≈ cpu ⇒ cómputo denso
    if wall_ms > cpu_ms * 2:
        return "io"
    if cpu_ms >= wall_ms * 0.8:
        return "cpu"
    return "mixed"

def pick(bound: str) -> str:
    return {
        "io": "async_or_threads",
        "cpu": "processes",
        "mixed": "batch_then_io",
    }.get(bound, "measure")

def pool_plan(bound: str, n_workers: int = 4) -> dict:
    # En prod: ThreadPoolExecutor / ProcessPoolExecutor(max_workers=n)
    return {"model": pick(bound), "max_workers": n_workers, "executor": "stdlib_futures"}

# c-synth-1: tramo features denso (CPU)
bound = measure_bound(wall_ms=100, cpu_ms=95)
plan = pool_plan(bound, n_workers=4)
print(plan["model"])
print(pick("io"))
print("measure_first", True)`,
        output: `processes
async_or_threads
measure_first True`,
      },
      callout: {
        type: "tip",
        title: "Mide primero",
        content:
          "No elijas async ni multiproceso por moda. Profilea el path del caso sintético y documenta bound + elección en el runbook del batch.",
      },
    },
    {
      heading: "I/O vs CPU, GIL y serialización",
      subtopicId: "S38-T1-B",
      paragraphs: [
        "El GIL de CPython limita el paralelismo de CPU multi-thread: varios hilos de Python puro casi no aceleran un cálculo denso. Los procesos evitan el GIL, pero pagan serialización e IPC (pickle/json entre procesos). Si el payload entre workers es grande, el pool puede ser **más lento** que un solo proceso bien vectorizado: el tiempo se va en copiar bytes, no en score. Por eso la decisión «processes» de T1-A solo es completa cuando también mides el tamaño del blob que cruzará el boundary.",
        "Contrato operativo. Entrada: payload del caso (case_id, score, features compactas) y decisión de modelo de concurrencia. Salida: tamaño en bytes del payload y preferencia `compact_payload`. Error: copiar DataFrames enteros entre procesos o loguear el blob crudo con PII. Criterio: el costo de serialización está medido y el payload entre workers es el mínimo necesario para el paso.",
        "Aplicación a `CASO-LIM-038-T1B` (sigue `c-synth-1`): en lugar de enviar el registro completo del cliente sintético al process pool de features, enviamos `{case_id, score, feature_ids}`. `json.dumps` del dict compacto cabe en decenas de bytes; el GIL sigue limitando threads CPU, así que el scoring denso va a processes solo si el payload compacto justifica el IPC. En código de producción usarías `ProcessPoolExecutor` con ese payload mínimo; aquí medimos bytes y preferimos compacto sin lanzar procesos en el playground. Puente a T2: con el modelo elegido, la cola del worker aún puede crecer sin límite si no hay backpressure.",
      ],
      code: {
        language: 'python',
        title: "gil_ser.py",
        code: `import json

def payload_bytes(payload: dict) -> int:
    return len(json.dumps(payload).encode())

full = {"case_id": "c1", "email": "ana@example.pe", "score": 0.2, "blob": "x" * 20}
compact = {"case_id": "c1", "score": 0.2}
print("bytes", payload_bytes(compact))
print("gil_cpu_threads", "limited")
print("prefer", "compact_payload" if payload_bytes(compact) < payload_bytes(full) else "full")`,
        output: `bytes 31
gil_cpu_threads limited
prefer compact_payload`,
      },
      callout: {
        type: "warning",
        title: "Costo de IPC",
        content:
          "A veces el process pool es más lento que un solo proceso. Mide serialización + queue antes de multiplicar workers.",
      },
    },
    {
      heading: "Pools, backpressure y rate limits",
      subtopicId: "S38-T2-A",
      paragraphs: [
        "Un pool acota la concurrencia máxima (N workers). Una cola con `maxsize` aplica backpressure: el productor se bloquea o rechaza cuando la cola está llena, en lugar de crecer hasta OOM. En stdlib eso es `queue.Queue(maxsize=Q)` (o `asyncio.Queue` en async): no es un comentario de diseño, es un tope de memoria. Un rate limit (token bucket **didáctico estático**: tokens iniciales sin recarga en el fixture) protege al proveedor mock de un ban o de saturación. En prod el bucket se rellena por ventana de tiempo; aquí solo practicamos allow/deny y cola acotada para fijar el modelo mental.",
        "Contrato operativo. Entrada: tasa permitida R, profundidad máxima de cola Q, ráfaga de casos sintéticos. Salida: secuencia de allow/deny y señal de backpressure. Error: cola infinita, o ignorar 429 del proveedor. Criterio: bajo pico sintético, la memoria se mantiene acotada y el proveedor no recibe más de R tokens por ventana.",
        "Aplicación a `CASO-LIM-038-T2A` (`c-synth-1` y vecinos): el batch de Lima (ficticio) intenta encolar una ráfaga; con `Queue(maxsize=2)` el tercer case_id no entra y se registra backpressure. El bucket de 2 tokens niega el tercer allow inmediato. Así no tumbamos el worker de scoring ni el mock API. Sin PII real; solo case_id sintéticos. Puente a T2-B: aunque la cola esté acotada, un fetch sin timeout aún puede colgar un worker — la profundidad de cola y el timeout son capas distintas del mismo incidente.",
      ],
      code: {
        language: 'python',
        title: "rate_limit.py",
        code: `from queue import Queue

class TokenBucket:
    """Didáctico estático: sin refill por tiempo (en prod sí hay ventana)."""

    def __init__(self, rate: int):
        self.tokens = rate

    def allow(self) -> bool:
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False

q: Queue[str] = Queue(maxsize=2)
enqueued, blocked = [], []
for cid in ("c-synth-1", "c2", "c3"):
    if q.full():
        blocked.append(cid)
    else:
        q.put(cid)
        enqueued.append(cid)

b = TokenBucket(2)
print([b.allow() for _ in range(3)])
print("backpressure", blocked)
print("ok", blocked == ["c3"] and enqueued == ["c-synth-1", "c2"])`,
        output: `[True, True, False]
backpressure ['c3']
ok True`,
      },
      callout: {
        type: "tip",
        title: "maxsize es política",
        content:
          "Producer bloquea o devuelve rechazo cuando la cola llena. Documenta la política en el runbook: drop, block o DLQ de overflow.",
      },
    },
    {
      heading: "Cancelación, timeout y recursos",
      subtopicId: "S38-T2-B",
      paragraphs: [
        "Sin timeout, un proveedor lento puede colgar un worker indefinidamente y tumbar el SLA del batch. La política didáctica define segundos de espera y on_fail (`retry_or_dlq`). La cancelación libera la tarea colgada; el `finally` o context manager cierra conexiones y archivos aunque falle el fetch. En async real usarías `asyncio.wait_for(coro, timeout=…)`; aquí simulamos el mismo contrato comparando latencia mock vs presupuesto, sin red ni event loop en el playground.",
        "Contrato operativo. Entrada: latencia mock del proveedor, timeout_s y política on_fail. Salida: status `ok` | `timeout`, dict de política y flag de cierre de recurso. Error: olvidar close, o retry infinito sin tope. Criterio: toda I/O externa del triage tiene timeout y camino de fallo explícito hacia retry o DLQ.",
        "Aplicación a `CASO-LIM-038-T2B` (`c-synth-1` geocoding mock): si latencia_ms > timeout_s*1000, marcamos timeout y enrutamos a retry/DLQ. El recurso sintético se cierra en `finally` aunque falle. Incidente clásico de runbook: «sin timeout → cola bloqueada → p95 explotado». Con la cola de T2-A acotada y el timeout de este tramo, el batch ya no se cuelga en silencio: falla de forma observable. Puente a T3: cuando aparece el timeout, el on-call necesita logs/metrics/traces correlacionados, no solo un print local.",
      ],
      code: {
        language: 'python',
        title: "timeout.py",
        code: `def fetch_with_timeout(latency_ms: float, timeout_s: float = 0.05) -> dict:
    # Simulación local (sin red): comparamos latencia mock vs presupuesto
    timed_out = latency_ms > timeout_s * 1000
    closed = False
    try:
        if timed_out:
            return {
                "status": "timeout",
                "seconds": timeout_s,
                "on_fail": "retry_or_dlq",
                "close_in_finally": True,
            }
        return {"status": "ok", "seconds": timeout_s, "on_fail": "retry_or_dlq", "close_in_finally": True}
    finally:
        closed = True  # libera conn sintética siempre
        assert closed

pol = fetch_with_timeout(latency_ms=200, timeout_s=0.05)
print(pol)
print("close_in_finally", pol["close_in_finally"])
print("ok", pol["status"] == "timeout")`,
        output: `{'status': 'timeout', 'seconds': 0.05, 'on_fail': 'retry_or_dlq', 'close_in_finally': True}
close_in_finally True
ok True`,
      },
      callout: {
        type: "danger",
        title: "Sin timeout",
        content:
          "Incidente clásico de operación: un solo proveedor lento satura todos los workers. Timeout + on_fail es obligatorio antes de prod.",
      },
    },
    {
      heading: "Logs, metrics y traces",
      subtopicId: "S38-T3-A",
      paragraphs: [
        "Los tres pilares de **observabilidad (o11y)**: logs (eventos discretos), metrics (agregados: cola, latencia, errores) y traces (spans por caso a lo largo de intake→score→queue). correlation_id / corr une el camino sin volcar el payload completo del cliente.",
        "Contrato operativo. Entrada: evento de scoring con case_id sintético, score y corr. Salida: línea de log estructurado + métrica nombrada + pii_raw=False. Error: loguear email/teléfono en claro, o métricas sin dimensiones útiles. Criterio: un on-call puede reconstruir el path de un caso con corr sin abrir PII.",
        "Aplicación a `CASO-LIM-038-T3A`: al marcar `scored` en `c-synth-1` emitimos `{level:INFO, case_id, event, score, corr}` y la métrica `queue_depth`. Nivel DEBUG solo en sandbox. No usamos OpenTelemetry real en el ejercicio; modelamos el contrato con dicts locales y el mismo corr en log y span. Puente a T3-B: el corr no basta si el log lleva PII o el SLO no tiene política de error budget.",
      ],
      code: {
        language: 'python',
        title: "observability.py",
        code: `def scored_event(case_id: str, score: float, corr: str, queue_depth: int) -> dict:
    return {
        "level": "INFO",
        "case_id": case_id,
        "event": "scored",
        "score": score,
        "corr": corr,
        "metric": {"name": "queue_depth", "value": queue_depth},
        "pii_raw": False,
    }

event = scored_event("c-synth-1", 0.4, "corr-9", queue_depth=12)
print(event["event"], event["corr"])
print("metric", event["metric"]["name"], event["metric"]["value"])
print("pii_raw", event["pii_raw"])`,
        output: `scored corr-9
metric queue_depth 12
pii_raw False`,
      },
      callout: {
        type: "tip",
        title: "Tres pilares",
        content:
          "Logs + metrics + traces. correlation_id en todo el path. INFO en prod; DEBUG acotado al sandbox sintético.",
      },
    },
    {
      heading: "Correlation, redacción y SLI/SLO",
      subtopicId: "S38-T3-B",
      paragraphs: [
        "Redactar PII en logs es obligatorio: un email sintético `ana@example.pe` se muestra como `an***`. Los SLI miden realidad (p95 de score_ms, error_rate); el SLO es el objetivo acordado con el dueño del servicio. El **error budget** se consume cuando se viola el SLO: al agotarse, la política operativa prioriza estabilidad (p. ej. pausar deploys no urgentes) sobre features nuevas.",
        "Contrato operativo. Entrada: SLI observados y umbrales SLO. Salida: slo_ok booleano, valor redactado y, si aplica, acción de error budget. Error: comparar al revés (celebrar latencia peor que el límite) o guardar PII completa «por si acaso». Criterio: dashboards y alertas se basan en SLI; el runbook dice qué hacer cuando el error budget se agota.",
        "Aplicación a `CASO-LIM-038-T3B` (`c-synth-1`): p95=120ms vs SLO 200ms y error_rate=0.01 vs 0.02 → slo_ok True. Si p95 sube a 400ms, se abre incidente y se pausan deploys no urgentes según política de error budget. Solo datos sintéticos. Puente a T4: con o11y y presupuesto de error claros, el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.",
      ],
      code: {
        language: 'python',
        title: "slo.py",
        code: `def redact(s: str) -> str:
    return s[:2] + "***" if len(s) > 2 else "***"

def slo_status(sli: dict, slo: dict) -> dict:
    ok = sli["p95_ms"] <= slo["p95_ms"] and sli["error_rate"] <= slo["error_rate"]
    # Política didáctica: si se viola, consumimos error budget y priorizamos estabilidad
    action = "ship_features" if ok else "freeze_nonurgent_deploys"
    return {"slo_ok": ok, "error_budget_action": action}

sli = {"p95_ms": 120, "error_rate": 0.01}
slo = {"p95_ms": 200, "error_rate": 0.02}
st = slo_status(sli, slo)
print("redacted", redact("ana@example.pe"))
print("slo_ok", st["slo_ok"])
print("error_budget_action", st["error_budget_action"])`,
        output: `redacted an***
slo_ok True
error_budget_action ship_features`,
      },
      callout: {
        type: "warning",
        title: "PII en logs",
        content:
          "Redacta siempre. correlation_id sí; teléfono/email en claro no. El header X-Corr-Id une requests sin exponer identidad.",
      },
    },
    {
      heading: "States, checkpoint e idempotencia",
      subtopicId: "S38-T4-A",
      paragraphs: [
        "Un workflow de triage avanza por estados: pending → running → done | failed. Tras cada paso caro (features, score) se escribe un checkpoint. La idempotency key (`case:step:ver`) garantiza que reejecutar el mismo paso no duplica side effects (doble enqueue, doble notificación mock).",
        "Contrato operativo. Entrada: state dict del caso y clave de idempotencia. Salida: checkpoint con `last_done` (paso terminado) y `resume_from` = **siguiente** paso pendiente. Error: reintentar sin key y crear dos tickets de review, o reejecutar un paso ya `done`. Criterio: tras matar el worker a mitad de batch, el resume continúa desde el siguiente pendiente sin rehacer pasos done.",
        "Aplicación a `CASO-LIM-038-T4A`: caso `c-synth-1` (alias c1 en el store) completó features; el checkpoint guarda `last_done=features`. Al reiniciar, el worker calcula `resume_from=next_step(last_done)` (p. ej. `score`) y **no** reejecuta pasos con status done. La key `c1:features:v3` evita side effects si un reintento llega tarde. Sin secretos ni PII real en el store de checkpoint. Puente a T4-B: si el paso `score` falla de forma no transitoria, no reintentamos infinito — vamos a DLQ y abrimos el runbook.",
      ],
      code: {
        language: 'python',
        title: "checkpoint.py",
        code: `NEXT = {"features": "score", "score": "notify", "notify": "done"}

def make_checkpoint(case: str, step: str, ver: str) -> dict:
    return {
        "state": {"case": case, "step": step, "status": "done"},
        "idem_key": f"{case}:{step}:{ver}",
        "last_done": step,
        "resume_from": NEXT.get(step, step),
    }

cp = make_checkpoint("c1", "features", "v3")
print("checkpoint", cp["state"])
print("idem_key", cp["idem_key"])
print("resume_from", cp["resume_from"])`,
        output: `checkpoint {'case': 'c1', 'step': 'features', 'status': 'done'}
idem_key c1:features:v3
resume_from score`,
      },
      callout: {
        type: "tip",
        title: "Idempotency-Key",
        content:
          "Úsala en APIs y jobs. Formato estable case:step:ver. Reejecutar debe ser seguro por diseño, no por suerte.",
      },
    },
    {
      heading: "Retry, dead-letter, replay y runbook",
      subtopicId: "S38-T4-B",
      paragraphs: [
        "Retry con backoff exponencial (y jitter en prod) absorbe fallos transitorios. La DLQ (dead-letter queue) aísla mensajes venenosos que fallan siempre. El replay es controlado: no se reinyecta la DLQ entera sin inspección. El runbook lista síntomas → checks → acciones para el on-call.",
        "Contrato operativo. Entrada: attempt number y base de backoff; mensaje marcado poison o retriable. Salida: serie de esperas, ruta `retry` | `dlq` y flag runbook. Error: retry infinito, o borrar DLQ sin análisis. Criterio: el camino de fallo se prueba en sandbox antes de prod; el runbook existe y se actualiza tras cada incidente sintético de drill.",
        "Aplicación a `CASO-LIM-038-T4B` (cierra el hilo de `c-synth-1`): attempts 0..3 con base 0.1 → [0.1, 0.2, 0.4, 0.8]. Un payload malformado va a DLQ como poison; el replay se hace caso a caso tras fix del parser. Drill de on-call: reiniciar worker, verificar checkpoint, rejugar batch acotado. Estos contratos de operación alimentan el Case Triage N3 en S39.",
      ],
      code: {
        language: 'python',
        title: "retry_dlq.py",
        code: `def backoff(attempt: int, base: float = 0.1) -> float:
    return base * (2 ** attempt)

def route(kind: str, attempt: int, max_attempts: int = 3) -> str:
    if kind == "poison":
        return "dlq"
    if attempt >= max_attempts:
        return "dlq"
    return "retry"

print([round(backoff(i), 3) for i in range(4)])
print("dlq", route("poison", attempt=0))
print("runbook", True)`,
        output: `[0.1, 0.2, 0.4, 0.8]
dlq dlq
runbook True`,
      },
      callout: {
        type: "info",
        title: "Runbook vivo",
        content:
          "Documento del on-call: síntomas, checks, acciones (restart worker, replay batch, escalar proveedor). Se prueba el fallo antes de prod.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos sobre el hilo de `c-synth-1` / CASO-LIM-038 (sintético), en el mismo orden que endurecerías un batch en operación: medir bound (S37 → aquí) → payload compacto → cola acotada → timeout → observabilidad (o11y) → SLO/error budget → checkpoint → retry/DLQ/runbook. Cada demo ejecuta un mecanismo stdlib o un contrato local con think-aloud; sin red real ni PII. Al final del You Do ensamblas los cuatro pilares para el gate CP-N3-C (S39 los integrará en el Case Triage).",
    steps: [
      {
        demoId: "S38-T1-A-DEMO",
        subtopicId: "S38-T1-A",
        environment: "local-python",
        description: "Demo: medir wall vs CPU del path caliente y elegir modelo de concurrencia para c-synth-1.",
        code: {
          language: 'python',
          title: "s38_t1_a_demo.py",
          code: `def measure_bound(wall_ms: float, cpu_ms: float) -> str:
    if wall_ms > cpu_ms * 2:
        return "io"
    if cpu_ms >= wall_ms * 0.8:
        return "cpu"
    return "mixed"

def pick(bound: str) -> str:
    return {
        "io": "async_or_threads",
        "cpu": "processes",
        "mixed": "batch_then_io",
    }.get(bound, "measure")

# Think-aloud: features densas de c-synth-1 → wall≈cpu → processes
bound = measure_bound(wall_ms=100, cpu_ms=95)
print(pick("io"))
print("cpu", pick(bound))
print("ok", pick(bound) == "processes")`,
          output: `async_or_threads
cpu processes
ok True`,
        },
        why: "Think-aloud: no elijo processes por moda; mido wall vs CPU del tramo features y solo entonces documento processes. La tabla bound→modelo queda justificada por el bottleneck.",
      },
      {
        demoId: "S38-T1-B-DEMO",
        subtopicId: "S38-T1-B",
        environment: "local-python",
        description: "Demo: comparar bytes de payload full vs compacto antes de cruzar IPC.",
        code: {
          language: 'python',
          title: "s38_t1_b_demo.py",
          code: `import json

def compact_bytes(payload: dict) -> int:
    return len(json.dumps(payload).encode())

full = {"case_id": "c1", "email": "ana@example.pe", "score": 0.2}
compact = {"case_id": "c1", "score": 0.2}
print(compact_bytes(compact))
print("gil", "limited")
print("ok", compact_bytes(compact) < compact_bytes(full))`,
          output: `31
gil limited
ok True`,
        },
        why: "Think-aloud: el process pool paga serialización. Si mando email en el blob, inflamos IPC y arriesgamos PII en logs de cola. Compacto gana en bytes y en privacidad; GIL sigue limitando threads CPU.",
      },
      {
        demoId: "S38-T2-A-DEMO",
        subtopicId: "S38-T2-A",
        environment: "local-python",
        description: "Demo: Queue(maxsize) aplica backpressure; token bucket niega el exceso de tasa.",
        code: {
          language: 'python',
          title: "s38_t2_a_demo.py",
          code: `from queue import Queue

class TokenBucket:
    def __init__(self, rate: int):
        self.tokens = rate

    def allow(self) -> bool:
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False

q: Queue[str] = Queue(maxsize=2)
enqueued, blocked = [], []
for cid in ("c-synth-1", "c2", "c3"):
    if q.full():
        blocked.append(cid)
    else:
        q.put(cid)
        enqueued.append(cid)

b = TokenBucket(2)
print([b.allow() for _ in range(3)])
print("backpressure", blocked)
print("ok", blocked == ["c3"])`,
          output: `[True, True, False]
backpressure ['c3']
ok True`,
        },
        why: "Think-aloud: con maxsize=2 el tercer caso no entra a memoria — eso es backpressure. Luego el token bucket (estático aquí) protege al proveedor; primero acotamos la cola del worker, después la tasa de salida.",
      },
      {
        demoId: "S38-T2-B-DEMO",
        subtopicId: "S38-T2-B",
        environment: "local-python",
        description: "Demo: timeout simulado por latencia mock + cierre garantizado en finally.",
        code: {
          language: 'python',
          title: "s38_t2_b_demo.py",
          code: `def call_provider(latency_ms: float, timeout_s: float = 1) -> dict:
    closed = False
    try:
        if latency_ms > timeout_s * 1000:
            return {"seconds": timeout_s, "on_fail": "dlq", "status": "timeout"}
        return {"seconds": timeout_s, "on_fail": "dlq", "status": "ok"}
    finally:
        closed = True
        assert closed

pol = call_provider(latency_ms=2500, timeout_s=1)
print({"seconds": pol["seconds"], "on_fail": pol["on_fail"]})
print("finally", True)
print("ok", pol["status"] == "timeout")`,
          output: `{'seconds': 1, 'on_fail': 'dlq'}
finally True
ok True`,
        },
        why: "Think-aloud: el mock tarda 2.5s y el budget es 1s → timeout, no hang. El finally corre igual y libera la conn sintética. Sin este contrato, un solo proveedor lento satura el pool.",
      },
      {
        demoId: "S38-T3-A-DEMO",
        subtopicId: "S38-T3-A",
        environment: "local-python",
        description: "Demo: evento scored con correlation_id, métrica de cola y pii_raw=False (o11y mínima).",
        code: {
          language: 'python',
          title: "s38_t3_a_demo.py",
          code: `def emit_scored(case_id: str, corr: str, score: float, latency_ms: float) -> dict:
    return {
        "event": "scored",
        "case_id": case_id,
        "corr": corr,
        "score": score,
        "metric": {"name": "latency_ms", "value": latency_ms},
        "pii_raw": False,
    }

ev = emit_scored("c-synth-1", "corr-1", 0.4, latency_ms=118)
print(ev["event"], ev["corr"])
print("metric", ev["metric"]["name"])
print("pii_raw", ev["pii_raw"])`,
          output: `scored corr-1
metric latency_ms
pii_raw False`,
        },
        why: "Think-aloud: el on-call reconstruye el path de c-synth-1 con corr-1. La métrica nombra latency_ms; pii_raw False es parte del contrato, no un extra. Observabilidad (o11y) = logs + metrics + traces correlacionados.",
      },
      {
        demoId: "S38-T3-B-DEMO",
        subtopicId: "S38-T3-B",
        environment: "local-python",
        description: "Demo: SLO ok, redacción de PII y acción de error budget.",
        code: {
          language: 'python',
          title: "s38_t3_b_demo.py",
          code: `def redact(s: str) -> str:
    return s[:2] + "***" if len(s) > 2 else "***"

def slo_ok(p95_ms: float, budget_ms: float) -> bool:
    return p95_ms <= budget_ms

ok = slo_ok(120, 200)
action = "ship_features" if ok else "freeze_nonurgent_deploys"
print(ok)
print("redacted", redact("ana@example.pe"))
print("ok", action == "ship_features")`,
          output: `True
redacted an***
ok True`,
        },
        why: "Think-aloud: p95 120 ≤ 200 → SLO ok y aún se pueden shippear features. Si se viola, el error budget empuja a freeze de deploys no urgentes. Redacción siempre, aunque el email sea sintético.",
      },
      {
        demoId: "S38-T4-A-DEMO",
        subtopicId: "S38-T4-A",
        environment: "local-python",
        description: "Demo: idempotency key + last_done → resume_from (siguiente paso pendiente).",
        code: {
          language: 'python',
          title: "s38_t4_a_demo.py",
          code: `NEXT = {"features": "score", "score": "notify", "notify": "done"}

def idem_key(case: str, step: str, ver: str) -> str:
    return f"{case}:{step}:{ver}"

def resume_from(last_done: str) -> str:
    return NEXT.get(last_done, last_done)

key = idem_key("c1", "features", "v1")
print(key)
print("status", "done")
print("ok", resume_from("features") == "score" and key == "c1:features:v1")`,
          output: `c1:features:v1
status done
ok True`,
        },
        why: "Think-aloud: last_done=features no significa rehacer features; resume_from avanza a score. La key case:step:ver hace seguro un reintento tardío sin duplicar side effects.",
      },
      {
        demoId: "S38-T4-B-DEMO",
        subtopicId: "S38-T4-B",
        environment: "local-python",
        description: "Demo: backoff exponencial, ruta poison→DLQ y runbook presente.",
        code: {
          language: 'python',
          title: "s38_t4_b_demo.py",
          code: `def backoff(attempt: int, base: float = 0.1) -> float:
    return base * (2 ** attempt)

def route(kind: str, attempt: int = 0, max_attempts: int = 3) -> str:
    if kind == "poison" or attempt >= max_attempts:
        return "dlq"
    return "retry"

print([round(backoff(i), 3) for i in range(3)])
print("dlq", route("poison") == "dlq")
print("runbook", True)`,
          output: `[0.1, 0.2, 0.4]
dlq True
runbook True`,
        },
        why: "Think-aloud: retriable usa backoff; poison va directo a DLQ con replay controlado. El runbook (síntomas→checks→acciones) es entregable de operación, no un wiki opcional.",
      },
    ],
  },
  weDo: {
    intro: "S38 · Laboratorio de operación resiliente del triage (24 retos). E1 repara un defecto del contrato, E2 fija la política válida/inválida y E3 transfiere el criterio a un incidente sintético nuevo (cambio de fixture, no solo renombrar el print). Sigue el hilo de `c-synth-1` cuando el fixture lo indique. Fixtures CASO-LIM-038; sin PII real ni red.",
    steps: [
      {
        id: "S38-T1-A-E1",
        subtopicId: "S38-T1-A",
        kind: "guided",
        instruction: "S38-T1-A-E1 · CASO-LIM-038-1A: el path de features es CPU-bound (wall≈cpu en el profile sintético). Contrato: implementa pick(bound) para que bound='cpu' devuelva 'processes'; imprime la elección, la etiqueta bound y ok True. El starter ignora bound y devuelve siempre 'async_or_threads' (defect). Salida esperada: processes / bound cpu / ok True.",
        hint: "Para CPU-bound en CPython prefiere processes por el GIL.",
        hints: [
          "Para CPU-bound en CPython prefiere processes por el GIL.",
          "pick debe mapear io→async_or_threads, cpu→processes, mixed→batch_then_io.",
        ],
        edgeCases: ["bound mal etiquetado", "elegir async en CPU", "CASO-LIM-038-1A sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-A-E1.",
        feedback: "S38-T1-A-E1: explica por qué processes evita el GIL en features densas y por qué async no acelera CPU pura.",
        starterCode: {
          language: 'python',
          title: "s38-t1-a-e1.py",
          code: `# CASO-LIM-038-1A — defect: pick ignora bound (siempre async)
def pick(bound: str) -> str:
    return "async_or_threads"  # DEFECTO: CPU-bound necesita processes por el GIL

bound = "cpu"
choice = pick(bound)
print(choice)
print("bound", bound)
print("ok", choice == "processes")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-a-e1.py",
          code: `def pick(bound: str) -> str:
    return {
        "io": "async_or_threads",
        "cpu": "processes",
        "mixed": "batch_then_io",
    }.get(bound, "measure")

bound = "cpu"
choice = pick(bound)
print(choice)
print("bound", bound)
print("ok", choice == "processes")
`,
          output: `processes
bound cpu
ok True`,
        },
      },
      {
        id: "S38-T1-A-E2",
        subtopicId: "S38-T1-A",
        kind: "independent",
        instruction: "S38-T1-A-E2 · CASO-LIM-038-1A2: el tramo de normalización espera red mock (I/O-bound). Contrato: implementa pick(bound) para bound='io' → 'async_or_threads'; imprime la elección, bound io y ok True. El starter mapea todo a 'processes' (defect de copy-paste). Fixture sintético sin red real.",
        hint: "I/O-bound: threads o async liberan espera de red.",
        hints: [
          "I/O-bound: threads o async liberan espera de red.",
          "processes añaden IPC innecesario si no hay CPU densa.",
        ],
        edgeCases: ["IPC innecesario", "sin medir bound", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-A-E2.",
        feedback: "S38-T1-A-E2: justifica async_or_threads cuando wall >> cpu en el tramo de red mock.",
        starterCode: {
          language: 'python',
          title: "s38-t1-a-e2.py",
          code: `# CASO-LIM-038-1A2 — defect: pick fuerza processes en I/O
def pick(bound: str) -> str:
    return "processes"  # DEFECTO: I/O puro debe usar async_or_threads

bound = "io"
choice = pick(bound)
print(choice)
print("bound", bound)
print("ok", choice == "async_or_threads")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-a-e2.py",
          code: `def pick(bound: str) -> str:
    return {
        "io": "async_or_threads",
        "cpu": "processes",
        "mixed": "batch_then_io",
    }.get(bound, "measure")

bound = "io"
choice = pick(bound)
print(choice)
print("bound", bound)
print("ok", choice == "async_or_threads")
`,
          output: `async_or_threads
bound io
ok True`,
        },
      },
      {
        id: "S38-T1-A-E3",
        subtopicId: "S38-T1-A",
        kind: "transfer",
        instruction: "S38-T1-A-E3 · CASO-LIM-038-1A3 (transfer): con wall_ms=100 y cpu_ms=95 mide el bound y elige el modelo. Imprime el modelo ('processes'), measure_first True y ok True. Starter salta la medición (measure_first=False) y deja choice='async_or_threads' (defect). Implementa measure_bound + pick como en la demo T1-A; sin red real.",
        hint: "wall≈cpu ⇒ bound cpu ⇒ processes; measure_first debe ser True.",
        hints: [
          "Si cpu_ms >= wall_ms * 0.8 el bound es cpu.",
          "pick('cpu') → 'processes'; no elijas async por moda.",
        ],
        edgeCases: ["moda async", "sin profile", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-A-E3.",
        feedback: "S38-T1-A-E3: sin medición no hay elección defendible de concurrencia.",
        starterCode: {
          language: 'python',
          title: "s38-t1-a-e3.py",
          code: `# CASO-LIM-038 · measure before model (transfer)
wall_ms, cpu_ms = 100, 95
# DEFECTO: measure_first=False y choice por moda (async) sin medir bound
measure_first = False
choice = "async_or_threads"
print(choice)
print("measure_first", measure_first)
print("ok", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-a-e3.py",
          code: `def measure_bound(wall_ms: float, cpu_ms: float) -> str:
    if wall_ms > cpu_ms * 2:
        return "io"
    if cpu_ms >= wall_ms * 0.8:
        return "cpu"
    return "mixed"

def pick(bound: str) -> str:
    return {
        "io": "async_or_threads",
        "cpu": "processes",
        "mixed": "batch_then_io",
    }.get(bound, "measure")

wall_ms, cpu_ms = 100, 95
measure_first = True
bound = measure_bound(wall_ms, cpu_ms)
choice = pick(bound)
print(choice)
print("measure_first", measure_first)
print("ok", choice == "processes" and bound == "cpu")
`,
          output: `processes
measure_first True
ok True`,
        },
      },
      {
        id: "S38-T1-B-E1",
        subtopicId: "S38-T1-B",
        kind: "guided",
        instruction: "S38-T1-B-E1 · CASO-LIM-038-1B: serializa el payload compacto {'x': 2} con json y reporta len en bytes UTF-8. Contrato: print del tamaño (8), ok True, compact True. El starter usa str() del dict (defect: tamaño distinto / no portable). Usa json.dumps(...).encode() como en teoría. Fixture local sin PII.",
        hint: "json.dumps produce el blob estable; mide len(...encode()).",
        hints: [
          "json.dumps produce el blob estable; mide len(...encode()).",
          "str(dict) no es el contrato de IPC.",
        ],
        edgeCases: ["payload grande", "PII en blob", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-B-E1.",
        feedback: "S38-T1-B-E1: el costo de IPC se mide sobre el blob real que cruzará procesos.",
        starterCode: {
          language: 'python',
          title: "s38-t1-b-e1.py",
          code: `# CASO-LIM-038 · json size metric
# DEFECTO: usa len(str) en vez de json.dumps encode
import json
payload = {"x": 2}
# defect: wrong serialization metric
print(len(str(payload)))  # DEFECTO: usa json.dumps(payload).encode()
print("ok", True)
print("compact", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-b-e1.py",
          code: `import json
payload = {"x": 2}
print(len(json.dumps(payload).encode()))
print("ok", True)
print("compact", True)
`,
          output: `8
ok True
compact True`,
        },
      },
      {
        id: "S38-T1-B-E2",
        subtopicId: "S38-T1-B",
        kind: "independent",
        instruction: "S38-T1-B-E2 · Política GIL para threads CPU: con model='threads' y bound='cpu', el runbook debe registrar gil_cpu_threads='limited' (no 'unlimited'). Imprime limited, ok True, cpu_threads True. Starter asume unlimited (defect). Usa la función gil_status(model, bound); no lances threads reales.",
        hint: "GIL limita paralelismo CPU en threads Python puros → 'limited'.",
        hints: [
          "Si model=='threads' y bound=='cpu' → limited; processes evaden el GIL.",
          "Para CPU densa documenta limited y evalúa processes.",
        ],
        edgeCases: ["confundir I/O con CPU", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-B-E2.",
        feedback: "S38-T1-B-E2: la etiqueta limited evita falsas expectativas de speedup multi-thread.",
        starterCode: {
          language: 'python',
          title: "s38-t1-b-e2.py",
          code: `# CASO-LIM-038 · GIL CPU threads
def gil_status(model: str, bound: str) -> str:
    # DEFECTO: asume unlimited aunque bound sea cpu en threads
    return "unlimited"

status = gil_status("threads", "cpu")
print(status)
print("ok", status == "limited")
print("cpu_threads", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-b-e2.py",
          code: `def gil_status(model: str, bound: str) -> str:
    if model == "threads" and bound == "cpu":
        return "limited"
    if model == "processes":
        return "bypassed_via_processes"
    return "n/a"

status = gil_status("threads", "cpu")
print(status)
print("ok", status == "limited")
print("cpu_threads", True)
`,
          output: `limited
ok True
cpu_threads True`,
        },
      },
      {
        id: "S38-T1-B-E3",
        subtopicId: "S38-T1-B",
        kind: "transfer",
        instruction: "S38-T1-B-E3 · Transferencia IPC: compara bytes de full (con email sintético) vs compact (case_id+score) con json.dumps(...).encode(). Imprime 'compact_payload', ok True y el tamaño en bytes del compact (31). Starter prefiere 'full_record' sin medir (defect: arrastra PII y bytes de más). Fixture CASO-LIM-038 sin red.",
        hint: "prefer = compact_payload si len(compact_bytes) < len(full_bytes).",
        hints: [
          "json.dumps(payload).encode() mide el blob real de IPC.",
          "full_record con email infla bytes y arriesga PII en logs de cola.",
        ],
        edgeCases: ["PII en queue", "pickle enorme", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-B-E3.",
        feedback: "S38-T1-B-E3: compact_payload es privacidad y performance a la vez.",
        starterCode: {
          language: 'python',
          title: "s38-t1-b-e3.py",
          code: `# CASO-LIM-038 · IPC compact payload (transfer)
import json
full = {"case_id": "c1", "email": "ana@example.pe", "score": 0.2}
compact = {"case_id": "c1", "score": 0.2}
# DEFECTO: prefiere full_record sin medir bytes ni riesgo de PII
prefer = "full_record"
print(prefer)
print("ok", True)
print("bytes", 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-b-e3.py",
          code: `import json

def payload_bytes(payload: dict) -> int:
    return len(json.dumps(payload).encode())

full = {"case_id": "c1", "email": "ana@example.pe", "score": 0.2}
compact = {"case_id": "c1", "score": 0.2}
cb, fb = payload_bytes(compact), payload_bytes(full)
prefer = "compact_payload" if cb < fb else "full_record"
print(prefer)
print("ok", prefer == "compact_payload")
print("bytes", cb)
`,
          output: `compact_payload
ok True
bytes 31`,
        },
      },
      {
        id: "S38-T2-A-E1",
        subtopicId: "S38-T2-A",
        kind: "guided",
        instruction: "S38-T2-A-E1 · Token bucket rate=2: cuenta cuántos allow() True en 3 intentos. Contrato: print 2, third False, ok True. Starter usa rate=3 (defect) o cuenta mal. Implementa el bucket mínimo del fixture CASO-LIM-038-2A.",
        hint: "rate=2 ⇒ dos True y el tercero False.",
        hints: [
          "rate=2 ⇒ dos True y el tercero False.",
          "No rellenes tokens entre llamadas en este fixture estático.",
        ],
        edgeCases: ["burst sin límite", "ban del API mock", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-A-E1.",
        feedback: "S38-T2-A-E1: el bucket acota la ráfaga visible al proveedor.",
        starterCode: {
          language: 'python',
          title: "s38-t2-a-e1.py",
          code: `# CASO-LIM-038 · token bucket rate
# DEFECTO: rate=3 en vez de 2 del fixture
class TokenBucket:
    def __init__(self, rate):
        self.tokens = rate
    def allow(self):
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
b = TokenBucket(3)  # DEFECTO: rate del fixture es 2
allows = [b.allow() for _ in range(3)]
print(sum(1 for a in allows if a))
print("third", allows[2])
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-a-e1.py",
          code: `class TokenBucket:
    def __init__(self, rate):
        self.tokens = rate
    def allow(self):
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
b = TokenBucket(2)
allows = [b.allow() for _ in range(3)]
print(sum(1 for a in allows if a))
print("third", allows[2])
print("ok", True)
`,
          output: `2
third False
ok True`,
        },
      },
      {
        id: "S38-T2-A-E2",
        subtopicId: "S38-T2-A",
        kind: "independent",
        instruction: "S38-T2-A-E2 · Cola acotada con Queue: crea Queue(maxsize=50), encola c1 y c2, e imprime la política 'backpressure', ok True y maxsize 50. Starter reporta 'unbounded_queue' y maxsize None sin acotar la cola (defect: sin backpressure). Corrige para modelar la cola del worker de scoring CASO-LIM-038.",
        hint: "from queue import Queue; maxsize finito = backpressure.",
        hints: [
          "from queue import Queue; maxsize=50 acota memoria del worker.",
          "Cola sin tope (política None / ilimitada) ⇒ OOM bajo pico.",
        ],
        edgeCases: ["OOM", "productor sin bloqueo", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-A-E2.",
        feedback: "S38-T2-A-E2: backpressure protege memoria y estabilidad del batch.",
        starterCode: {
          language: 'python',
          title: "s38-t2-a-e2.py",
          code: `# CASO-LIM-038 · backpressure por maxsize
from queue import Queue
# DEFECTO: sin maxsize finito — política de cola ilimitada
policy = "unbounded_queue"
maxsize = None  # sin tope documentado
print(policy)
print("ok", maxsize == 50)
print("maxsize", maxsize)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-a-e2.py",
          code: `from queue import Queue
q = Queue(maxsize=50)
q.put("c1")
q.put("c2")
print("backpressure")
print("ok", q.maxsize == 50 and q.qsize() == 2)
print("maxsize", q.maxsize)
`,
          output: `backpressure
ok True
maxsize 50`,
        },
      },
      {
        id: "S38-T2-A-E3",
        subtopicId: "S38-T2-A",
        kind: "transfer",
        instruction: "S38-T2-A-E3 · Transferencia: con TokenBucket(rate=1), el segundo allow() es False — el rate limit protege al 'provider' y ban_risk es True. Starter imprime 'flood' y ban_risk False (defect: ignora al proveedor). Imprime 'provider', ok True, ban_risk True tras demostrar el deny.",
        hint: "Sin rate limit el mock/API puede banear la IP del batch.",
        hints: [
          "Sin rate limit el mock/API puede banear la IP del batch.",
          "rate=1 ⇒ primer allow True, segundo False ⇒ ban_risk documentado.",
        ],
        edgeCases: ["429 storm", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-A-E3.",
        feedback: "S38-T2-A-E3: rate limit es cortesía y supervivencia ante el proveedor.",
        starterCode: {
          language: 'python',
          title: "s38-t2-a-e3.py",
          code: `# CASO-LIM-038 · rate limit protege al proveedor
class TokenBucket:
    def __init__(self, rate):
        self.tokens = rate
    def allow(self):
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
b = TokenBucket(99)  # DEFECTO: sin límite real → flood
print("flood")
print("ok", True)
print("ban_risk", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-a-e3.py",
          code: `class TokenBucket:
    def __init__(self, rate):
        self.tokens = rate
    def allow(self):
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
b = TokenBucket(1)
first, second = b.allow(), b.allow()
print("provider")
print("ok", first is True and second is False)
print("ban_risk", True)
`,
          output: `provider
ok True
ban_risk True`,
        },
      },
      {
        id: "S38-T2-B-E1",
        subtopicId: "S38-T2-B",
        kind: "guided",
        instruction: "S38-T2-B-E1 · Política de timeout: con latency_ms=8000 y timeout_s=5 marca status timeout y on_fail='retry_or_dlq'. Imprime 5, on_fail retry_or_dlq y ok True. Starter usa timeout_s=0 y on_fail='ignore' (defect: hang sin camino de fallo). Simula el fetch mock comparando latencia vs presupuesto; sin threads reales.",
        hint: "timed_out = latency_ms > timeout_s * 1000; seconds debe ser > 0.",
        hints: [
          "seconds>0 evita hang infinito; on_fail = retry_or_dlq.",
          "Si latency supera el presupuesto, status es timeout (no ok).",
        ],
        edgeCases: ["hang", "retry infinito", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-B-E1.",
        feedback: "S38-T2-B-E1: timeout + on_fail es el mínimo viable de I/O externa.",
        starterCode: {
          language: 'python',
          title: "s38-t2-b-e1.py",
          code: `# CASO-LIM-038 · retry/DLQ policy con simulación de latencia
def fetch_policy(latency_ms: float, timeout_s: float) -> dict:
    # DEFECTO: seconds=0 on_fail=ignore → hang sin camino de fallo
    return {"seconds": 0, "on_fail": "ignore", "status": "ok"}

pol = fetch_policy(latency_ms=8000, timeout_s=5)
print(pol["seconds"])
print("on_fail", pol["on_fail"])
print("ok", pol["status"] == "timeout" and pol["seconds"] == 5)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-b-e1.py",
          code: `def fetch_policy(latency_ms: float, timeout_s: float) -> dict:
    timed_out = latency_ms > timeout_s * 1000
    return {
        "seconds": timeout_s,
        "on_fail": "retry_or_dlq",
        "status": "timeout" if timed_out else "ok",
    }

pol = fetch_policy(latency_ms=8000, timeout_s=5)
print(pol["seconds"])
print("on_fail", pol["on_fail"])
print("ok", pol["status"] == "timeout" and pol["seconds"] == 5)
`,
          output: `5
on_fail retry_or_dlq
ok True`,
        },
      },
      {
        id: "S38-T2-B-E2",
        subtopicId: "S38-T2-B",
        kind: "independent",
        instruction: "S38-T2-B-E2 · Cierre de recurso en finally: simula un fetch mock y cierra la 'conn' en finally aunque falle. Imprime True (closed), resource 'conn', ok True. Starter deja closed=False y no usa finally (defect: leak). Sin sockets reales; solo el patrón try/finally del worker sintético.",
        hint: "finally/context manager cierra aunque falle el fetch.",
        hints: [
          "finally/context manager cierra aunque falle el fetch.",
          "Leak de conn tumba el pool bajo carga.",
        ],
        edgeCases: ["resource leak", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-B-E2.",
        feedback: "S38-T2-B-E2: sin close determinista el pool se agota.",
        starterCode: {
          language: 'python',
          title: "s38-t2-b-e2.py",
          code: `# CASO-LIM-038 · cierre de recursos en finally
closed = False
try:
    raise RuntimeError("fetch mock falló")
except RuntimeError:
    pass
# DEFECTO: no hay finally → conn filtrada
print(closed)
print("resource", "conn")
print("ok", closed)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-b-e2.py",
          code: `closed = False
try:
    raise RuntimeError("fetch mock falló")
except RuntimeError:
    pass
finally:
    closed = True  # libera conn sintética siempre
print(closed)
print("resource", "conn")
print("ok", closed)
`,
          output: `True
resource conn
ok True`,
        },
      },
      {
        id: "S38-T2-B-E3",
        subtopicId: "S38-T2-B",
        kind: "transfer",
        instruction: "S38-T2-B-E3 · Transferencia runbook: con latency_ms=5000 y timeout_s=1.0 marca incidente de proveedor lento. Imprime incident True, ok True y action 'open_runbook' (no 'ignore'). Starter usa timeout_s=0, niega el incidente y action='ignore' (defect: hang sin playbook). Implementa needs_incident + action_for del fixture CASO-LIM-038.",
        hint: "Hang o timeout superado ⇒ incidente y open_runbook.",
        hints: [
          "needs_incident: timeout_s<=0 o latency > timeout*1000.",
          "Si hay incidente, action_for → open_runbook (no ignore).",
        ],
        edgeCases: ["p95 explotado", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-B-E3.",
        feedback: "S38-T2-B-E3: nombrar el incidente y abrir el runbook es el primer paso operable.",
        starterCode: {
          language: 'python',
          title: "s38-t2-b-e3.py",
          code: `# CASO-LIM-038 · timeout debe generar incidente operable
def needs_incident(latency_ms: float, timeout_s: float) -> bool:
    if timeout_s <= 0:
        return False  # DEFECTO: sin presupuesto niega el incidente
    return latency_ms > timeout_s * 1000

def action_for(hit: bool) -> str:
    return "ignore"  # DEFECTO: no abre runbook

hit = needs_incident(5000, 0)
print("incident", hit)
print("ok", hit is True and action_for(hit) == "open_runbook")
print("action", action_for(hit))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-b-e3.py",
          code: `def needs_incident(latency_ms: float, timeout_s: float) -> bool:
    if timeout_s <= 0:
        return True  # sin timeout = hang = incidente
    return latency_ms > timeout_s * 1000

def action_for(hit: bool) -> str:
    return "open_runbook" if hit else "continue"

hit = needs_incident(5000, 1.0)
print("incident", hit)
print("ok", hit is True and action_for(hit) == "open_runbook")
print("action", action_for(hit))
`,
          output: `incident True
ok True
action open_runbook`,
        },
      },
      {
        id: "S38-T3-A-E1",
        subtopicId: "S38-T3-A",
        kind: "guided",
        instruction: "S38-T3-A-E1 · Evento scored con correlation id: implementa emit_scored(case_id, corr, score) que devuelva dict con event='scored', case_id, corr y pii_raw=False. Imprime True (corr presente), event 'scored', ok True. Starter omite corr (defect → False). Path intake→score de c-synth-1 sin PII.",
        hint: "corr debe ser truthy string en el dict emitido.",
        hints: [
          "corr debe ser truthy string en el dict emitido.",
          "Sin corr no hay reconstrucción del path del caso.",
        ],
        edgeCases: ["log sin corr", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-A-E1.",
        feedback: "S38-T3-A-E1: correlation_id une spans del caso.",
        starterCode: {
          language: 'python',
          title: "s38-t3-a-e1.py",
          code: `# CASO-LIM-038 · trace correlation id
def emit_scored(case_id: str, corr, score: float) -> dict:
    # DEFECTO: corr=None en evento scored (ignora el parámetro corr)
    return {"event": "scored", "case_id": case_id, "corr": None, "score": score, "pii_raw": False}

event = emit_scored("c-synth-1", "corr-1", 0.4)
print(bool(event.get("corr")))
print("event", event["event"])
print("ok", event.get("corr") == "corr-1" and event.get("pii_raw") is False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-a-e1.py",
          code: `def emit_scored(case_id: str, corr, score: float) -> dict:
    return {
        "event": "scored",
        "case_id": case_id,
        "corr": corr,
        "score": score,
        "pii_raw": False,
    }

event = emit_scored("c-synth-1", "corr-1", 0.4)
print(bool(event.get("corr")))
print("event", event["event"])
print("ok", event.get("corr") == "corr-1" and event.get("pii_raw") is False)
`,
          output: `True
event scored
ok True`,
        },
      },
      {
        id: "S38-T3-A-E2",
        subtopicId: "S38-T3-A",
        kind: "independent",
        instruction: "S38-T3-A-E2 · Tres pilares de observabilidad (o11y): a partir del dict de señales del caso (logs/metrics/traces activos), construye la lista ordenada de pilares activos e imprime ['logs','metrics','traces'], ok True, n 3. Starter solo activa logs (defect: omite metrics/traces). Deriva la lista desde el dict; no hardcodees ciego si puedes filtrar.",
        hint: "pillars = [k for k in ('logs','metrics','traces') if signals[k]].",
        hints: [
          "Logs eventos, metrics agregados, traces spans — los tres deben estar True.",
          "Un solo pilar no basta para diagnosticar cola + latencia + caso.",
        ],
        edgeCases: ["solo logs", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-A-E2.",
        feedback: "S38-T3-A-E2: un solo pilar no basta para diagnosticar cola + latencia + caso.",
        starterCode: {
          language: 'python',
          title: "s38-t3-a-e2.py",
          code: `# CASO-LIM-038 · tres pilares de observabilidad
# DEFECTO: solo logs (omiso metrics/traces)
signals = {"logs": True, "metrics": False, "traces": False}
order = ("logs", "metrics", "traces")
pillars = [k for k in order if signals[k]]
print(pillars)
print("ok", len(pillars) == 3)
print("n", len(pillars))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-a-e2.py",
          code: `signals = {"logs": True, "metrics": True, "traces": True}
order = ("logs", "metrics", "traces")
pillars = [k for k in order if signals[k]]
print(pillars)
print("ok", pillars == ["logs", "metrics", "traces"])
print("n", len(pillars))
`,
          output: `['logs', 'metrics', 'traces']
ok True
n 3`,
        },
      },
      {
        id: "S38-T3-A-E3",
        subtopicId: "S38-T3-A",
        kind: "transfer",
        instruction: "S38-T3-A-E3 · pii_raw debe ser False y el email sintético debe redactarse (an***). Imprime False, ok True, redact True. Starter imprime True y no redacta (defect: permite PII). Contrato de privacidad del pipeline CP-N3-C operación.",
        hint: "Nunca pii_raw True en logs de operación.",
        hints: [
          "Nunca pii_raw True en logs de operación.",
          "redact(s) = s[:2] + '***' si len>2; conserva case_id sintético.",
        ],
        edgeCases: ["PII en log aggregate", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-A-E3.",
        feedback: "S38-T3-A-E3: privacidad es parte del contrato de observabilidad (o11y), no un extra.",
        starterCode: {
          language: 'python',
          title: "s38-t3-a-e3.py",
          code: `# CASO-LIM-038 · pii_raw prohibido en logs
def redact(s: str) -> str:
    return s  # DEFECTO: no enmascara

email = "ana@example.pe"
pii_raw = True  # DEFECTO: permite PII cruda
print(pii_raw)
print("ok", redact(email) == "an***")
print("redact", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-a-e3.py",
          code: `def redact(s: str) -> str:
    return s[:2] + "***" if len(s) > 2 else "***"

email = "ana@example.pe"
pii_raw = False
print(pii_raw)
print("ok", redact(email) == "an***")
print("redact", True)
`,
          output: `False
ok True
redact True`,
        },
      },
      {
        id: "S38-T3-B-E1",
        subtopicId: "S38-T3-B",
        kind: "guided",
        instruction: "S38-T3-B-E1 · Redacta el teléfono sintético '90000001' → '90****01' (política demo: 2 primeros + **** + 2 últimos si len>=4). Imprime el redactado, ok True, pii False. Starter imprime el número completo (defect). No uses PII real.",
        hint: "Conserva prefijo/sufijo mínimo; enmascara el medio.",
        hints: [
          "Conserva prefijo/sufijo mínimo; enmascara el medio.",
          "Nunca loguees el teléfono completo.",
        ],
        edgeCases: ["email en claro", "sintético example.pe"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-B-E1.",
        feedback: "S38-T3-B-E1: redacción es mecánica y revisable en code review.",
        starterCode: {
          language: 'python',
          title: "s38-t3-b-e1.py",
          code: `# CASO-LIM-038 · PII redaction logs
# DEFECTO: imprime teléfono crudo
phone = "90000001"
# defect: raw phone in log
print(phone)  # DEFECTO: redactar a 90****01
print("ok", True)
print("pii", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-b-e1.py",
          code: `phone = "90000001"
redacted = phone[:2] + "****" + phone[-2:]
print(redacted)
print("ok", True)
print("pii", False)
`,
          output: `90****01
ok True
pii False`,
        },
      },
      {
        id: "S38-T3-B-E2",
        subtopicId: "S38-T3-B",
        kind: "independent",
        instruction: "S38-T3-B-E2 · SLI compuesto: p95_ms=100 (SLO≤200) y error_rate=0.01 (SLO≤0.02). Implementa slo_ok(sli, slo) que sea True solo si **ambos** umbrales se cumplen. Imprime True, p95 100 y limit 200. Starter solo mira p95 y además compara al revés (defect: ignora error_rate y invierte el signo).",
        hint: "slo_ok = p95 <= slo_p95 AND error_rate <= slo_err.",
        hints: [
          "Ambos SLI deben respetar su SLO; uno solo no basta.",
          "Comparación invertida enciende alertas falsas o las apaga.",
        ],
        edgeCases: ["error_rate alto con p95 ok", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-B-E2.",
        feedback: "S38-T3-B-E2: un SLO multi-SLI evita celebrar latencia buena con errores altos.",
        starterCode: {
          language: 'python',
          title: "s38-t3-b-e2.py",
          code: `# CASO-LIM-038 · SLO multi-SLI (p95 + error_rate)
sli = {"p95_ms": 100, "error_rate": 0.01}
slo = {"p95_ms": 200, "error_rate": 0.02}

def slo_ok(sli: dict, slo: dict) -> bool:
    # DEFECTO: solo p95 y con signo invertido; ignora error_rate
    return sli["p95_ms"] > slo["p95_ms"]

ok = slo_ok(sli, slo)
print(ok)
print("p95", sli["p95_ms"])
print("limit", slo["p95_ms"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-b-e2.py",
          code: `sli = {"p95_ms": 100, "error_rate": 0.01}
slo = {"p95_ms": 200, "error_rate": 0.02}

def slo_ok(sli: dict, slo: dict) -> bool:
    return sli["p95_ms"] <= slo["p95_ms"] and sli["error_rate"] <= slo["error_rate"]

ok = slo_ok(sli, slo)
print(ok)
print("p95", sli["p95_ms"])
print("limit", slo["p95_ms"])
`,
          output: `True
p95 100
limit 200`,
        },
      },
      {
        id: "S38-T3-B-E3",
        subtopicId: "S38-T3-B",
        kind: "transfer",
        instruction: "S38-T3-B-E3 · Error budget operativo: implementa budget_action(remaining) — si remaining==0 devuelve 'freeze_nonurgent_deploys', si no 'ship_features'. Con remaining=0 imprime el mecanismo 'error_budget', ok True (solo si la acción es freeze) y n 1. Starter imprime 'uptime_only' y n 0 porque ignora remaining (defect: SLO sin consecuencia operativa).",
        hint: "Error budget cuantifica cuánto incumplimiento queda; al agotarse prioriza estabilidad.",
        hints: [
          "Error budget cuantifica cuánto incumplimiento queda en el periodo.",
          "Si remaining==0 → freeze_nonurgent_deploys, no ship ciego.",
        ],
        edgeCases: ["SLO sin consecuencia", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-B-E3.",
        feedback: "S38-T3-B-E3: sin error budget el SLO es eslogan.",
        starterCode: {
          language: 'python',
          title: "s38-t3-b-e3.py",
          code: `# CASO-LIM-038 · error budget como política operativa
def budget_action(remaining: float) -> str:
    return "ship_features"  # DEFECTO: ignora remaining → uptime_only sin consecuencia

budget_remaining = 0
action = budget_action(budget_remaining)
print("uptime_only")
print("ok", action == "freeze_nonurgent_deploys")
print("n", 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-b-e3.py",
          code: `def budget_action(remaining: float) -> str:
    return "freeze_nonurgent_deploys" if remaining == 0 else "ship_features"

budget_remaining = 0
action = budget_action(budget_remaining)
print("error_budget")
print("ok", action == "freeze_nonurgent_deploys")
print("n", 1)
`,
          output: `error_budget
ok True
n 1`,
        },
      },
      {
        id: "S38-T4-A-E1",
        subtopicId: "S38-T4-A",
        kind: "guided",
        instruction: "S38-T4-A-E1 · Estados del workflow: define WORKFLOW_STATES con pending/running/done/failed y una función is_terminal(status) que sea True para done y failed. Imprime la lista de estados, ok True y n 4. Starter omite 'failed' y no marca terminales (defect).",
        hint: "failed es estado terminal de error, distinto de pending.",
        hints: [
          "failed y done son terminales; pending/running no.",
          "Cuatro estados mínimos del workflow didáctico.",
        ],
        edgeCases: ["estado perdido tras crash", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-A-E1.",
        feedback: "S38-T4-A-E1: sin estado failed no hay ruta clara a DLQ/retry.",
        starterCode: {
          language: 'python',
          title: "s38-t4-a-e1.py",
          code: `# CASO-LIM-038 · estados del workflow
# DEFECTO: estados incompletos (sin failed) y terminal mal definido
WORKFLOW_STATES = ["pending", "running", "done"]

def is_terminal(status: str) -> bool:
    return status == "done"  # DEFECTO: failed también es terminal

print(WORKFLOW_STATES)
print("ok", "failed" in WORKFLOW_STATES and is_terminal("failed"))
print("n", len(WORKFLOW_STATES))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-a-e1.py",
          code: `WORKFLOW_STATES = ["pending", "running", "done", "failed"]

def is_terminal(status: str) -> bool:
    return status in ("done", "failed")

print(WORKFLOW_STATES)
print("ok", "failed" in WORKFLOW_STATES and is_terminal("failed"))
print("n", len(WORKFLOW_STATES))
`,
          output: `['pending', 'running', 'done', 'failed']
ok True
n 4`,
        },
      },
      {
        id: "S38-T4-A-E2",
        subtopicId: "S38-T4-A",
        kind: "independent",
        instruction: "S38-T4-A-E2 · Implementa idem_key(case, step, ver) → 'case:step:ver'. Con case='c-synth-1', step='features', ver='v3' imprime la key, ok True (key termina en :v3 y tiene 3 segmentos) y dup False. Starter imprime 'c-synth-1:features' sin :ver y dup True (defect: colisiones al cambiar lógica).",
        hint: "Incluye step y versión de lógica: f'{case}:{step}:{ver}'.",
        hints: [
          "Incluye step y versión de lógica para evitar colisiones entre deploys.",
          "dup False = reejecutar el mismo paso no duplica side effects.",
        ],
        edgeCases: ["doble enqueue", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-A-E2.",
        feedback: "S38-T4-A-E2: la key estable es la base de la idempotencia del checkpoint.",
        starterCode: {
          language: 'python',
          title: "s38-t4-a-e2.py",
          code: `# CASO-LIM-038 · idempotency key case:step:ver
def idem_key(case: str, step: str, ver: str) -> str:
    # DEFECTO: omite ver → colisiones al cambiar lógica
    return f"{case}:{step}"

key = idem_key("c-synth-1", "features", "v3")
print(key)
print("ok", key.count(":") == 2 and key.endswith(":v3"))
print("dup", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-a-e2.py",
          code: `def idem_key(case: str, step: str, ver: str) -> str:
    return f"{case}:{step}:{ver}"

key = idem_key("c-synth-1", "features", "v3")
print(key)
print("ok", key.count(":") == 2 and key.endswith(":v3"))
print("dup", False)
`,
          output: `c-synth-1:features:v3
ok True
dup False`,
        },
      },
      {
        id: "S38-T4-A-E3",
        subtopicId: "S38-T4-A",
        kind: "transfer",
        instruction: "S38-T4-A-E3 · Resume al siguiente pendiente: last_done='features' → resume_from='score' (no rehacer features). Imprime 'score', ok True, checkpoint True. Starter hardcodea 'intake' (defect: rehace trabajo). Usa el mapa NEXT del fixture CASO-LIM-038.",
        hint: "resume_from = NEXT[last_done], no el last_done mismo ni intake fijo.",
        hints: [
          "last_done=features ⇒ siguiente es score.",
          "No vuelvas a intake si features ya está done.",
        ],
        edgeCases: ["doble side effect", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-A-E3.",
        feedback: "S38-T4-A-E3: reanudar mal es tan malo como no reanudar.",
        starterCode: {
          language: 'python',
          title: "s38-t4-a-e3.py",
          code: `# CASO-LIM-038 · checkpoint resume al siguiente paso
NEXT = {"features": "score", "score": "notify", "notify": "done"}
state = {"last_done": "features", "status": "done"}
# DEFECTO: hardcode intake en vez de NEXT[last_done]
print("intake")
print("ok", True)
print("checkpoint", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-a-e3.py",
          code: `NEXT = {"features": "score", "score": "notify", "notify": "done"}
state = {"last_done": "features", "status": "done"}
resume = NEXT[state["last_done"]]
print(resume)
print("ok", resume == "score")
print("checkpoint", True)
`,
          output: `score
ok True
checkpoint True`,
        },
      },
      {
        id: "S38-T4-B-E1",
        subtopicId: "S38-T4-B",
        kind: "guided",
        instruction: "S38-T4-B-E1 · Backoff attempt=3 base=0.1 → 0.1*2**3 = 0.8. Imprime 0.8, ok True, attempt 3. Starter usa multiplicación lineal attempt*base (defect). Implementa exponencial del fixture CASO-LIM-038-4B.",
        hint: "Fórmula didáctica: base * 2**attempt.",
        hints: [
          "Fórmula didáctica: base * 2**attempt.",
          "En prod añadir jitter; aquí solo el valor exacto 0.8.",
        ],
        edgeCases: ["retry storm", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-B-E1.",
        feedback: "S38-T4-B-E1: backoff exponencial reduce presión sobre el proveedor.",
        starterCode: {
          language: 'python',
          title: "s38-t4-b-e1.py",
          code: `# CASO-LIM-038 · exponential backoff
# DEFECTO: base*attempt lineal en vez de 2**attempt
def backoff(attempt, base=0.1):
    return base * attempt  # DEFECTO: exponencial base * 2**attempt
print(backoff(3))
print("ok", True)
print("attempt", 3)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-b-e1.py",
          code: `def backoff(attempt, base=0.1):
    return base * (2 ** attempt)
print(backoff(3))
print("ok", True)
print("attempt", 3)
`,
          output: `0.8
ok True
attempt 3`,
        },
      },
      {
        id: "S38-T4-B-E2",
        subtopicId: "S38-T4-B",
        kind: "independent",
        instruction: "S38-T4-B-E2 · Enruta kind='poison' a DLQ: imprime 'dlq', ok True, replay 'controlled'. Starter imprime 'retry_forever' y replay 'uncontrolled' (defect: reintenta veneno en bucle). Implementa route(kind) del fixture CASO-LIM-038 (poison→dlq).",
        hint: "DLQ = mensajes que fallan de forma no transitoria; replay controlado tras inspección.",
        hints: [
          "if kind == 'poison': return 'dlq' (no retry_forever).",
          "Replay ciego reinyecta el veneno.",
        ],
        edgeCases: ["loop de fallo", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-B-E2.",
        feedback: "S38-T4-B-E2: poison + replay controlado es higiene de cola.",
        starterCode: {
          language: 'python',
          title: "s38-t4-b-e2.py",
          code: `# CASO-LIM-038 · poison message a DLQ
def route(kind: str) -> str:
    return "retry_forever"  # DEFECTO: veneno no debe reintentarse a ciegas
print(route("poison"))
print("ok", True)
print("replay", "uncontrolled")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-b-e2.py",
          code: `def route(kind: str) -> str:
    if kind == "poison":
        return "dlq"
    return "retry"

print(route("poison"))
print("ok", route("poison") == "dlq")
print("replay", "controlled")
`,
          output: `dlq
ok True
replay controlled`,
        },
      },
      {
        id: "S38-T4-B-E3",
        subtopicId: "S38-T4-B",
        kind: "transfer",
        instruction: "S38-T4-B-E3 · Runbook de on-call para c-synth-1: define un dict con symptoms (provider_slow, worker_down) y actions (restart_worker, replay_batch, escalate_provider). Imprime True (runbook existe), oncall True, ok True solo si 'restart_worker' está en actions. Starter deja runbook vacío y oncall False (defect: operar sin playbook). Transferencia: el drill sintético exige runbook documentado antes de prod.",
        hint: "Runbook: síntomas → checks → acciones; no improvise bajo presión.",
        hints: [
          "Runbook mínimo: symptoms + actions con al menos restart_worker.",
          "Tras un drill, actualiza el runbook con lo que falló en el checklist.",
        ],
        edgeCases: ["incidente sin playbook", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-B-E3.",
        feedback: "S38-T4-B-E3: el runbook es entregable de operación, no un wiki opcional.",
        starterCode: {
          language: 'python',
          title: "s38-t4-b-e3.py",
          code: `# CASO-LIM-038 · runbook on-call existe
runbook = {}  # DEFECTO: vacío = sin playbook operable
print(bool(runbook))
print("oncall", False)
print("ok", "restart_worker" in runbook.get("actions", []))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-b-e3.py",
          code: `runbook = {
    "symptoms": ["provider_slow", "worker_down"],
    "actions": ["restart_worker", "replay_batch", "escalate_provider"],
}
print(bool(runbook))
print("oncall", True)
print("ok", "restart_worker" in runbook["actions"])
`,
          output: `True
oncall True
ok True`,
        },
      },
    ],
  },
  youDo: {
    title: "Pipeline reanudable con trace y runbook (CP-N3-C operación)",
    context:
      "Construye un mini-worker sintético con pool/backpressure, logs redactados, checkpoint idempotente, retry/DLQ y runbook de proveedor lento. Integra el hilo de `c-synth-1` visto en T1–T4. Solo datos CASO-LIM-038; sin PII real ni servicios externos.",
    objectives: [
      "Concurrencia adecuada al bound medido",
      "Timeouts y backpressure acotados",
      "Observabilidad (logs/metrics/traces) + SLI/SLO con redacción",
      "Checkpoint, idempotencia, retry y runbook",
    ],
    requirements: [
      "Trace por case_id y correlation_id",
      "Sin PII raw en logs",
      "Runbook de fallos (lento / caído / reejecución)",
      "Documentación en español profesional",
      "Mismo resultado tras resume controlado (last_done → siguiente paso)",
    ],
    starterCode: `# workflow resiliente CASO-LIM-038 · scaffold de 4 pilares (completa lo marcado)
from queue import Queue

state = {
    "case_id": "c-synth-1",
    "step": "intake",
    "status": "pending",
    "corr": "corr-038",
}
q: Queue[str] = Queue(maxsize=50)
NEXT = {"intake": "features", "features": "score", "score": "notify", "notify": "done"}

def redact(s: str) -> str:
    return s[:2] + "***" if len(s) > 2 else "***"

def measure_bound(wall_ms: float, cpu_ms: float) -> str:
    # TODO del portafolio: wall>>cpu → io; cpu denso → cpu; si no mixed
    raise NotImplementedError("elige bound a partir de wall_ms/cpu_ms")

def pick(bound: str) -> str:
    raise NotImplementedError("mapea io/cpu/mixed a modelo de concurrencia")

def fetch_policy(latency_ms: float, timeout_s: float) -> dict:
    # TODO: status timeout|ok, on_fail retry_or_dlq, seconds
    raise NotImplementedError("timeout mock del proveedor")

def checkpoint(state: dict, step: str) -> dict:
    out = dict(state)
    out["step"] = step
    out["status"] = "done"
    out["last_done"] = step
    out["resume_from"] = NEXT.get(step, step)
    out["idem_key"] = f"{out['case_id']}:{step}:v1"
    return out

def backoff(attempt: int, base: float = 0.1) -> float:
    return base * (2 ** attempt)

def route(kind: str, attempt: int = 0, max_attempts: int = 3) -> str:
    if kind == "poison" or attempt >= max_attempts:
        return "dlq"
    return "retry"

def runbook() -> dict:
    # TODO: symptoms + actions (restart_worker, replay_batch, escalate_provider)
    raise NotImplementedError("runbook de on-call")

if __name__ == "__main__":
    # Demo parcial del scaffold (completa measure/pick/fetch/runbook arriba)
    print("log", {"event": "start", "corr": state["corr"], "email": redact("ana@example.pe")})
    print(checkpoint(state, "features"))
    print("backoff", [round(backoff(i), 3) for i in range(3)])
    print("queue_maxsize", q.maxsize)
    print("route_poison", route("poison"))
`,
    portfolioNote:
      "Operación CP-N3-C; evidencia de pipeline reanudable con trace por caso. Completa measure_bound + pick, fetch_policy (timeout mock), métrica de cola y runbook() con síntomas→acciones. Documenta en markdown un drill de proveedor lento. Sin red real ni PII.",
    rubric: [
      { criterion: "Alineación al gate de operación de la sección (CP-N3-C)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Idempotencia + runbook de fallos", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Para CPU bound en CPython suele preferirse:",
        options: ["Miles de threads CPU", "Procesos", "Quitar timeouts", "Logs con PII"],
        correctIndex: 1,
        explanation: "El GIL limita el paralelismo CPU multi-thread; processes (con costo de IPC) son la opción habitual para features densas.",
      },
      {
        question: "Backpressure evita:",
        options: ["Solo tests", "Checkpoints", "SLOs", "Colas infinitas y OOM"],
        correctIndex: 3,
        explanation: "Una cola con maxsize acota memoria y fuerza al productor a esperar o rechazar bajo pico.",
      },
      {
        question: "Idempotencia permite:",
        options: ["Reejecutar sin side effects duplicados", "Duplicar cobros", "Borrar DLQ siempre", "Ignorar corr ids"],
        correctIndex: 0,
        explanation: "Con idempotency keys, reintentar un paso done no duplica enqueues ni notificaciones.",
      },
      {
        question: "En logs de prod debes:",
        options: ["PII completa", "Desactivar métricas", "Redactar PII y correlacionar", "No usar case_id"],
        correctIndex: 2,
        explanation: "Redacción + correlation_id permiten diagnosticar sin exponer identidad; case_id sintético es aceptable.",
      },
      {
        question: "Un proveedor sin timeout en el worker suele causar:",
        options: ["Mejor p95 mágico", "Hang de workers y cola bloqueada", "Idempotencia automática", "Menos necesidad de DLQ"],
        correctIndex: 1,
        explanation: "Sin timeout un fetch lento satura el pool; es el incidente clásico de operación del batch.",
      },
      {
        question: "Cuando el error budget se agota, la política operativa suele:",
        options: ["Ignorar el SLO hasta el próximo quarter", "Duplicar side effects para recuperar throughput", "Desactivar correlation_id", "Priorizar estabilidad (p. ej. pausar deploys no urgentes) y remediación"],
        correctIndex: 3,
        explanation: "El error budget convierte el SLO en decisión: al agotarse, se prioriza estabilidad sobre features.",
      },
      {
        question: "Un mensaje que falla siempre de forma no transitoria debe ir a:",
        options: ["DLQ con replay controlado", "Retry infinito", "Logs con PII completa", "Proceso sin timeout"],
        correctIndex: 0,
        explanation: "La DLQ aísla veneno; el replay se hace caso a caso tras inspección, no en bucle ciego.",
      },
      {
        question: "Antes de elegir threads, processes o async, la disciplina correcta es:",
        options: ["Adoptar el framework de moda del equipo", "Lanzar cientos de procesos por defecto", "Medir el bottleneck (wall vs CPU) del path caliente y documentar el bound", "Desactivar timeouts para maximizar throughput"],
        correctIndex: 2,
        explanation: "S37 y S38 comparten la regla: medir primero. La elección de concurrencia se justifica con bound observado, no con preferencia de API.",
      },
      {
        question: "Tras un checkpoint con last_done='features', al reiniciar el worker resume_from debe ser:",
        options: ["features (rehacer el paso por seguridad)", "score (siguiente paso pendiente según el mapa del workflow)", "intake (siempre desde el inicio del batch)", "None (borrar el checkpoint y confiar en la suerte)"],
        correctIndex: 1,
        explanation: "last_done nombra el paso terminado; resume_from avanza al siguiente pendiente. Reejecutar un paso done sin idempotency key arriesga side effects duplicados.",
      },
    ],
  },
  resources: {
    docs: [
      { label: "Python asyncio", url: "https://docs.python.org/3/library/asyncio.html", note: "Async I/O y event loop" },
      { label: "concurrent.futures", url: "https://docs.python.org/3/library/concurrent.futures.html", note: "Thread/Process pools" },
      { label: "multiprocessing", url: "https://docs.python.org/3/library/multiprocessing.html", note: "Procesos y GIL" },
      { label: "queue (maxsize backpressure)", url: "https://docs.python.org/3/library/queue.html", note: "Backpressure acotado" },
      { label: "logging", url: "https://docs.python.org/3/library/logging.html", note: "Logs estructurados sin PII" },
      { label: "OpenTelemetry concepts", url: "https://opentelemetry.io/docs/concepts/", note: "Logs, metrics, traces y correlation" },
      { label: "Google SRE — Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/", note: "SLI/SLO y error budget" },
      { label: "SRE — Addressing Cascading Failures", url: "https://sre.google/sre-book/addressing-cascading-failures/", note: "Retry, DLQ y contención" },
      { label: "Twelve-Factor App", url: "https://12factor.net/", note: "Config, logs y procesos desechables" },
      { label: "Tenacity retries", url: "https://tenacity.readthedocs.io/", note: "Backoff con jitter conceptual" },
    ],
    books: [
      { label: "Site Reliability Engineering (Google)", note: "Operación, SLOs y runbooks" },
      { label: "Release It! (Nygard)", note: "Backpressure, timeouts y isolation" },
    ],
    courses: [
      { label: "MIT 6.824 Distributed Systems", url: "https://pdos.csail.mit.edu/6.824/", note: "Fault tolerance y reejecución conceptual" },
      { label: "MIT 6.031 Software Construction", url: "https://web.mit.edu/6.031/www/sp22/", note: "Correctness y testing bajo carga" },
      { label: "Stanford CS110", url: "https://web.stanford.edu/class/cs110/", note: "Concurrencia y sistemas a escala de curso" },
      { label: "Coursera Cloud Computing (Illinois pattern)", url: "https://www.coursera.org/learn/cloud-computing", note: "Distribución y resiliencia intro" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python", note: "Pedagogía progresiva" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
    ],
  },
}
