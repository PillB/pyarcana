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
    "En operación de triage (fintech, retail, banca de procesos en Perú y la región), un batch de scoring no puede colgarse por un proveedor lento ni duplicar side effects (efectos sobre el mundo: envío, escritura, gasto) al reiniciar. Aquí aprendes concurrencia correcta, observabilidad (logs, métricas y trazas) y workflows con checkpoint e idempotencia (que un mismo evento procesado dos veces produzca el mismo resultado). Todo con logs sin PII real.",
  learningOutcomes: [
    { text: "Elegir threads, processes o async según bottleneck medido (I/O vs. CPU)" },
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
        "**Diccionario de la sección** (léelo antes de T1).\n\n- **Bound (I/O vs. CPU):** cuello de botella medido.\n- **GIL:** Global Interpreter Lock de CPython (limita CPU multi-thread).\n- **Backpressure:** cola con `maxsize` que frena al productor (señal atómica con `put_nowait` / `Full`, no solo `full()`).\n- **Token bucket:** rate limit didáctico (aquí estático; en prod se rellena por ventana).\n- **Observabilidad (o11y):** logs + metrics + traces unidos por `correlation_id`.\n- **SLI/SLO:** indicador vs. objetivo de servicio; **error budget** es lo que se consume al violar el SLO.\n- **Idempotency key:** `case:step:ver` identifica el intento; la semántica exige un store que rechace reaplicaciones.\n- **DLQ:** dead-letter queue de mensajes venenosos.\n- **last_done / resume_from:** último paso checkpointed vs. siguiente pendiente.",
        "Esta sección opera el pipeline de triage CP-N3-C bajo carga realista: el batch debe reanudarse tras un crash, trazar cada caso sintético y sobrevivir a un proveedor lento o a un worker caído. No optimizamos microsegundos a ciegas; diseñamos concurrencia correcta, observabilidad y workflows con checkpoint e idempotencia. Continúa la disciplina de S37 (medir antes de cambiar) y prepara los contratos que S39 ensamblará en el Case Triage N3.",
        "Contrato operativo de la sección. Entrada: cola de casos sintéticos `CASO-LIM-038`, límites de tasa del proveedor mock, budgets de latencia p95 y políticas de retry y DLQ. Salida: pipeline reanudable con trace por case_id, métricas de cola y runbook de fallos. Error: side effect duplicado, PII raw en logs o cola sin backpressure bloquea promoción. Criterio: mismo resultado funcional tras reejecución controlada.",
        "Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia una API mock y CPU de features en lotes. Seguiremos el caso `c-synth-1` a lo largo de T1–T4: medir bound → acotar cola y tasa → emitir o11y sin PII → checkpoint e idempotencia → retry, DLQ y runbook. El foco es **concurrencia correcta y resiliencia operativa**, no micro-optimización con Numba/Cython.\n\nOrden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, `queue`, dicts) + contratos de asyncio/multiprocessing sin red real en el playground (pools reales en tu entorno local al cerrar el You Do).",
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
        "Threads conviene cuando el cuello es I/O concurrente (esperas de red o disco) y el trabajo por hilo es liviano. Processes conviene cuando el cuello es CPU (features densas, scoring vectorial) y quieres evadir el GIL de CPython. Async brilla con muchos I/O en un solo hilo de evento, siempre que no bloquees el loop con CPU pesada.",
        "**Mide primero** (wall vs. CPU en el path caliente, la ruta o tramo más costoso del código); la moda del framework no es un contrato.",
        "En stdlib, el modelo se materializa con `concurrent.futures.ThreadPoolExecutor` / `ProcessPoolExecutor` o `asyncio` + `wait_for` para timeouts. Aquí practicamos el **criterio de elección**, colas acotadas y contratos de fallo sin lanzar pools pesados ni red real en el navegador; el You Do pide ensayar el executor en tu entorno local.",
        "Contrato del tramo. Entrada: etiqueta de bound (`io` | `cpu` | `mixed`) medida en el path caliente del triage sintético y un tope de workers N. Salida: elección documentada `async_or_threads` | `processes` | `batch_then_io` y pool_size = N. Error: elegir async por moda sin medir, o lanzar cientos de procesos para I/O trivial. Criterio de éxito: la decisión se justifica con bottleneck observado y un plan de medición, no con preferencia de framework.",
        "Aplicación a `CASO-LIM-038-T1A` (Red Andina sintética): el caso `c-synth-1` entra por intake (I/O al proveedor mock de normalización) y luego calcula features locales (CPU). Primero midimos wall vs. CPU; si wall >> CPU en el tramo de red, usamos async/threads; si el tramo de features satura un core, movemos ese tramo a process pool con N acotado (p. ej. 4).\n\nDatos inventados; sin credenciales ni red real; sin PII en logs del bench.\n\nEl mismo `c-synth-1` reaparece en T2 (cola y timeout), T3 (corr y SLO) y T4 (checkpoint y DLQ): es un solo batch que se endurece por capas.",
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
      heading: "I/O vs. CPU, GIL y serialización",
      subtopicId: "S38-T1-B",
      paragraphs: [
        "El GIL de CPython limita el paralelismo de CPU multi-thread: varios hilos de Python puro casi no aceleran un cálculo denso. Los procesos evitan el GIL, pero pagan serialización e IPC (pickle/json entre procesos). Si el payload entre workers es grande, el pool puede ser **más lento** que un solo proceso bien vectorizado: el tiempo se va en copiar bytes, no en score. Por eso la decisión «processes» de T1-A solo es completa cuando también mides el tamaño del blob que cruzará el boundary.",
        "Contrato operativo. Entrada: payload del caso (case_id, score, features compactas) y decisión de modelo de concurrencia. Salida: tamaño en bytes del payload y preferencia `compact_payload`. Error: copiar DataFrames enteros entre procesos o loguear el blob crudo con PII. Criterio: el costo de serialización está medido y el payload entre workers es el mínimo necesario para el paso.",
        "Aplicación a `CASO-LIM-038-T1B` (sigue `c-synth-1`): en lugar de enviar el registro completo del cliente sintético al process pool de features, enviamos `{case_id, score, feature_ids}`. `json.dumps` del dict compacto cabe en decenas de bytes; el GIL sigue limitando threads CPU, así que el scoring denso va a processes solo si el payload compacto justifica el IPC.\n\nEn código de producción usarías `ProcessPoolExecutor` con ese payload mínimo (callable importable y argumentos picklables); aquí medimos bytes y preferimos compacto sin lanzar procesos en el playground.\n\nPuente a T2: con el modelo elegido, la cola del worker aún puede crecer sin límite si no hay backpressure.",
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
        "Un pool acota la concurrencia máxima (N workers). Una cola con `maxsize` aplica backpressure: el productor se bloquea o rechaza cuando la cola está llena, en lugar de crecer hasta OOM. En stdlib eso es `queue.Queue(maxsize=Q)` (o `asyncio.Queue` en async): no es un comentario de diseño, es un tope de memoria. **Importante:** `Queue.full()` es solo consultivo (puede cambiar entre la lectura y el `put`); la señal segura de rechazo es atómica con `put_nowait` y `queue.Full`, o un `put(..., timeout=…)`. Un rate limit (token bucket **didáctico estático**: tokens iniciales sin recarga en el fixture) protege al proveedor mock de un ban o de saturación. En prod el bucket se rellena por ventana de tiempo; aquí solo practicamos allow/deny y cola acotada para fijar el modelo mental.",
        "Contrato de carga. Entrada: tasa permitida R, profundidad máxima de cola Q, ráfaga de casos sintéticos. Salida: secuencia de allow/deny y señal de backpressure. Error: cola infinita, o ignorar 429 del proveedor. Criterio: bajo pico sintético, la memoria se mantiene acotada y el proveedor no recibe más de R tokens por ventana.",
        "Aplicación a `CASO-LIM-038-T2A` (`c-synth-1` y vecinos): el batch de Lima (ficticio) intenta encolar una ráfaga; con `Queue(maxsize=2)` el tercer `put_nowait` lanza `Full` y se registra backpressure. El bucket de 2 tokens niega el tercer allow inmediato. Así no tumbamos el worker de scoring ni el mock API. Sin PII real; solo case_id sintéticos. Puente a T2-B: aunque la cola esté acotada, un fetch sin timeout aún puede colgar un worker — la profundidad de cola y el timeout son capas distintas del mismo incidente.",
      ],
      code: {
        language: 'python',
        title: "rate_limit.py",
        code: `from queue import Queue, Full

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
    # Señal atómica: no confiar en full() + put (TOCTOU entre hilos)
    try:
        q.put_nowait(cid)
        enqueued.append(cid)
    except Full:
        blocked.append(cid)

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
          "Rechazo seguro con put_nowait + Full (o put con timeout). Documenta en el runbook: drop, block o DLQ de overflow. full() solo es un hint.",
      },
    },
    {
      heading: "Cancelación, timeout y recursos",
      subtopicId: "S38-T2-B",
      paragraphs: [
        "Sin timeout, un proveedor lento puede colgar un worker indefinidamente y tumbar el SLA del batch. La política didáctica define segundos de espera y on_fail (`retry_or_dlq`). El `finally` o context manager cierra conexiones y archivos aunque falle el fetch. En async real, el timeout **cancela** la tarea (`asyncio.wait_for` / `asyncio.timeout` y propagación de `CancelledError`); aquí clasificamos el mismo contrato comparando latencia mock vs. presupuesto, sin red ni event loop en el playground.",
        "Contrato de timeout. Entrada: latencia mock del proveedor, timeout_s y política on_fail. Salida: status `ok` | `timeout`, dict de política y flag de cierre de recurso. Error: olvidar close, o retry infinito sin tope. Criterio: toda I/O externa del triage tiene timeout y camino de fallo explícito hacia retry o DLQ.",
        "Aplicación a `CASO-LIM-038-T2B` (`c-synth-1` geocoding mock): si latencia_ms > timeout_s*1000, marcamos timeout y enrutamos a retry o DLQ. El recurso sintético se cierra en `finally` aunque falle. Incidente clásico de runbook: «sin timeout → cola bloqueada → p95 explotado». Con la cola de T2-A acotada y el timeout de este tramo, el batch ya no se cuelga en silencio: falla de forma observable. Puente a T3: cuando aparece el timeout, el on-call necesita logs, metrics y traces correlacionados, no solo un print local.",
      ],
      code: {
        language: 'python',
        title: "timeout.py",
        code: `def fetch_with_timeout(latency_ms: float, timeout_s: float = 0.05) -> dict:
    # Simulación local (sin red): latencia mock vs. presupuesto
    # En async real: asyncio.wait_for cancela la tarea; aquí solo clasificamos.
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
        "Los tres pilares de **observabilidad (o11y)**: logs (eventos discretos), metrics (agregados: cola, latencia, errores) y traces (spans por caso a lo largo de intake→score→queue). El `correlation_id` (corr) une el camino sin volcar el payload completo del cliente.",
        "Contrato de observabilidad. Entrada: evento de scoring con case_id sintético, score y corr. Salida: línea de log estructurado + métrica nombrada + pii_raw=False. Error: loguear email/teléfono en claro, o métricas sin dimensiones útiles. Criterio: un on-call puede reconstruir el path de un caso con corr sin abrir PII.",
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
          "Logs + metrics + traces. Correlation_id en todo el path. INFO en prod; DEBUG acotado al sandbox sintético.",
      },
    },
    {
      heading: "Correlation, redacción y SLI/SLO",
      subtopicId: "S38-T3-B",
      paragraphs: [
        "Redactar PII en logs es obligatorio: un email sintético `ana@example.pe` se muestra como `an***`. Los SLI miden realidad (p95 de score_ms, error_rate); el SLO es el objetivo acordado con el dueño del servicio. El **error budget** se consume cuando se viola el SLO: al agotarse, la política operativa prioriza estabilidad (p. ej. pausar deploys no urgentes) sobre features nuevas.",
        "Contrato de SLO. Entrada: SLI observados y umbrales SLO. Salida: slo_ok booleano, valor redactado y, si aplica, acción de error budget. Error: comparar al revés (celebrar latencia peor que el límite) o guardar PII completa «por si acaso». Criterio: dashboards y alertas se basan en SLI; el runbook dice qué hacer cuando el error budget se agota.",
        "Aplicación a `CASO-LIM-038-T3B` (`c-synth-1`): p95 = 120 ms vs. SLO 200 ms y error_rate = 0.01 vs. 0.02 → slo_ok True. Si p95 sube a 400 ms, se abre incidente y se pausan deploys no urgentes según política de error budget. Solo datos sintéticos. Puente a T4: con o11y y presupuesto de error claro, el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.",
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
          "Redacta siempre. Correlation_id sí; teléfono o email en claro no. El header X-Corr-Id une requests sin exponer identidad.",
      },
    },
    {
      heading: "States, checkpoint e idempotencia",
      subtopicId: "S38-T4-A",
      paragraphs: [
        "Un workflow de triage avanza por estados: pending → running → done | failed. Tras cada paso caro (features, score) se escribe un checkpoint **durable** (archivo/SQLite en prod; en el fixture un store que sobrevive al reinicio del proceso). La idempotency key (`case:step:ver`) **identifica** el intento; la semántica exige un registro atómico que evite reaplicar el side effect si la key ya se vio.",
        "Contrato de workflow. Entrada: state del caso, store de checkpoint y store de claves aplicadas. Salida: checkpoint con `last_done` (paso terminado) y `resume_from` = **siguiente** paso pendiente; side effects contados una sola vez por key. Error: reintentar sin store y crear dos tickets de review, o reejecutar un paso ya `done`. Criterio: tras matar el worker a mitad de batch, un proceso nuevo lee el store y continúa desde el siguiente pendiente sin rehacer pasos done.",
        "Aplicación a `CASO-LIM-038-T4A`: caso `c-synth-1` (alias c1 en el store) completó features; el checkpoint guarda `last_done=features`. Al reiniciar, el worker calcula `resume_from=next_step(last_done)` (p. ej. `score`) y **no** reejecuta pasos con status done. La key `c1:features:v3` se consulta en un set de aplicadas: el segundo intento no vuelve a encolar. Sin secretos ni PII real en el store. Puente a T4-B: si el paso `score` falla de forma no transitoria, no reintentamos infinito — vamos a DLQ y abrimos el runbook.",
      ],
      code: {
        language: 'python',
        title: "checkpoint.py",
        code: `NEXT = {"features": "score", "score": "notify", "notify": "done"}
# Store de claves ya aplicadas (en prod: INSERT atómico / compare-and-set)
APPLIED: set[str] = set()
# Store de checkpoint (en prod: JSON atómico con os.replace o SQLite)
CKPT: dict = {}

def make_checkpoint(case: str, step: str, ver: str) -> dict:
    key = f"{case}:{step}:{ver}"
    cp = {
        "state": {"case": case, "step": step, "status": "done"},
        "idem_key": key,
        "last_done": step,
        "resume_from": NEXT.get(step, step),
    }
    CKPT[case] = cp  # simula persistencia del fixture
    return cp

def apply_once(case: str, step: str, ver: str, side_effects: list) -> dict:
    cp = make_checkpoint(case, step, ver)
    key = cp["idem_key"]
    if key not in APPLIED:
        APPLIED.add(key)
        side_effects.append(step)  # side effect protegido por key
    return cp

effects: list = []
cp = apply_once("c1", "features", "v3", effects)
apply_once("c1", "features", "v3", effects)  # reintento: no duplica
print("checkpoint", cp["state"])
print("idem_key", cp["idem_key"])
print("resume_from", cp["resume_from"])
assert len(effects) == 1 and CKPT["c1"]["resume_from"] == "score"`,
        output: `checkpoint {'case': 'c1', 'step': 'features', 'status': 'done'}
idem_key c1:features:v3
resume_from score`,
      },
      callout: {
        type: "tip",
        title: "Idempotency-Key",
        content:
          "La key no basta sola: guarda la key aplicada y rechaza reintentos. Formato estable case:step:ver. Checkpoint durable fuera del proceso.",
      },
    },
    {
      heading: "Retry, dead-letter, replay y runbook",
      subtopicId: "S38-T4-B",
      paragraphs: [
        "Retry con backoff exponencial (y jitter en prod) absorbe fallos transitorios. La DLQ (dead-letter queue) aísla mensajes venenosos que fallan siempre. El replay es controlado: no se reinyecta la DLQ entera sin inspección. El runbook lista síntomas → checks → acciones para el on-call.",
        "Contrato de fallo. Entrada: attempt number y base de backoff; mensaje marcado poison o retriable. Salida: serie de esperas, ruta `retry` | `dlq` y flag runbook. Error: retry infinito, o borrar DLQ sin análisis. Criterio: el camino de fallo se prueba en sandbox antes de prod; el runbook existe y se actualiza tras cada incidente sintético de drill.",
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
    intro: "Te muestro 8 demos sobre el hilo de `c-synth-1` / CASO-LIM-038 (sintético), en el mismo orden que endurecerías un batch en operación: medir bound (S37 → aquí) → payload compacto → cola acotada → timeout → observabilidad (o11y) → SLO y error budget → checkpoint → retry, DLQ y runbook.\n\nCada demo ejecuta un mecanismo stdlib o un contrato local con think-aloud; sin red real ni PII. Al final del You Do ensamblas los cuatro pilares para el gate CP-N3-C (S39 los integrará en el Case Triage).",
    steps: [
      {
        demoId: "S38-T1-A-DEMO",
        subtopicId: "S38-T1-A",
        environment: "local-python",
        description: "Demo: medir wall vs. CPU del path caliente y elegir modelo de concurrencia para c-synth-1.",
        preamble:
          "En el batch sintético de Red Andina, el tramo de features de `c-synth-1` satura CPU y el de normalización espera red mock. En esta demo mido wall vs. CPU y elijo el modelo de concurrencia *después* de etiquetar el bound. No escribas aún: predice si 100 ms wall y 95 ms CPU piden processes o async, y por qué `pick(\"io\")` no usa processes. Si eliges framework por moda, el runbook del gate CP-N3-C no se defiende.",
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
        why:
          "Wall ≈ cpu implica bound `cpu` y en CPython conviene processes por el GIL; wall >> cpu implica espera I/O y async/threads liberan el hilo. No elijo processes por moda: mido wall vs. CPU del tramo features y solo entonces documento el modelo. `measure_first` es la disciplina de S37 aplicada a concurrencia. En We Do repararás un `pick` que ignora bound o fuerza processes en I/O.",
        retrospective:
          "Si puedes justificar processes para features densas *sin* decir «porque me gusta multiproceso», ya mides antes de elegir. El error clásico es async en CPU pura. En We Do corregirás el mapa bound→modelo y el flag `measure_first`.",
      },
      {
        demoId: "S38-T1-B-DEMO",
        subtopicId: "S38-T1-B",
        environment: "local-python",
        description: "Demo: comparar bytes de payload full vs. compacto antes de cruzar IPC.",
        preamble:
          "Ya elegiste processes para features densas; ahora el blob que cruza el boundary puede ser más caro que el score. En la demo se miden bytes de un payload compacto (`case_id`+`score`) frente a uno full con email sintético. No escribas: predice si compact gana y por qué el GIL sigue limitando threads CPU. Si mandas el registro completo a la cola, inflas IPC y arriesgas PII en logs de worker.",
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
        why:
          "`json.dumps(...).encode()` mide el blob real de IPC; el email en el blob no hace falta para score y viola el contrato de privacidad. GIL limited en threads CPU justifica processes *solo* con payload mínimo: el process pool paga serialización. Compacto gana en bytes y en privacidad. En We Do serializarás JSON real (no `str(dict)`) y preferirás `compact_payload`.",
        retrospective:
          "Compacto es performance y privacidad a la vez: menos bytes de IPC y sin email en el blob del worker. El error clásico es copiar el DataFrame o el email «por si acaso». Pregunta: si compact y full midieran lo mismo, ¿seguirías enviando el email al process pool? We Do: JSON real, etiqueta GIL y prefer medido.",
      },
      {
        demoId: "S38-T2-A-DEMO",
        subtopicId: "S38-T2-A",
        environment: "local-python",
        description: "Demo: Queue(maxsize) aplica backpressure; token bucket niega el exceso de tasa.",
        preamble:
          "Con el modelo de concurrencia elegido, el productor del batch aún puede llenar la RAM si la cola es infinita. En esta demo una `Queue(maxsize=2)` bloquea el tercer `put_nowait` con `Full`, y un token bucket de 2 niega el tercer allow. No escribas: predice quién queda en backpressure y la lista de allows. Si confías solo en `full()` entre hilos, el rechazo no es atómico.",
        code: {
          language: 'python',
          title: "s38_t2_a_demo.py",
          code: `from queue import Queue, Full

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
    try:
        q.put_nowait(cid)
        enqueued.append(cid)
    except Full:
        blocked.append(cid)

b = TokenBucket(2)
print([b.allow() for _ in range(3)])
print("backpressure", blocked)
print("ok", blocked == ["c3"])`,
          output: `[True, True, False]
backpressure ['c3']
ok True`,
        },
        why:
          "Señal segura de rechazo = `put_nowait` + `Full` (o put con timeout); `full()` solo es consultivo entre hilos. El token bucket didáctico sin refill fija allow/deny para practicar el modelo mental; en prod se rellena por ventana. Primero acotas la cola del worker, después la tasa hacia el proveedor. En We Do: rate=2, maxsize=50 y ban_risk del mock.",
        retrospective:
          "Backpressure y rate limit son capas distintas: una protege memoria del worker, la otra al API mock. El error clásico es cola sin tope o flood de requests. We Do: token bucket, Queue acotada y riesgo de ban.",
      },
      {
        demoId: "S38-T2-B-DEMO",
        subtopicId: "S38-T2-B",
        environment: "local-python",
        description: "Demo: timeout simulado por latencia mock + cierre garantizado en finally.",
        preamble:
          "Aunque la cola esté acotada, un fetch sin presupuesto de tiempo puede colgar un worker indefinidamente. En la demo el mock tarda 2500 ms y el timeout es 1 s: status timeout, on_fail hacia DLQ, y el `finally` cierra la conn sintética igual. No escribas: predice status y por qué finally corre. Si omites timeout, el p95 del batch explota en silencio.",
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
        why:
          "Clasificar latencia mock vs. presupuesto es el contrato didáctico (en async real, `wait_for` cancela). El mock tarda 2.5s y el budget es 1s → timeout, no hang. El `finally` libera el recurso siempre; on_fail explícito evita hang eterno. Sin este contrato un solo proveedor lento satura el pool. En We Do: política seconds>0, close en finally, open_runbook.",
        retrospective:
          "Timeout + cierre determinista son el mínimo viable de I/O externa: fallar observable es mejor que colgar el pool. El error clásico es «el proveedor casi siempre responde». Pregunta: si el `finally` no corriera tras timeout, ¿qué se filtra en el worker? We Do: política seconds>0, close y open_runbook.",
      },
      {
        demoId: "S38-T3-A-DEMO",
        subtopicId: "S38-T3-A",
        environment: "local-python",
        description: "Demo: evento scored con correlation_id, métrica de cola y pii_raw=False (o11y mínima).",
        preamble:
          "Cuando aparece un timeout, el on-call no puede reconstruir el path de `c-synth-1` con un print suelto. En esta demo se emite un evento `scored` con `corr-1`, métrica de latencia y `pii_raw=False`. No escribas: predice event, nombre de métrica y flag de PII. Si omites correlation_id, el trace del caso se rompe entre intake y score.",
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
        why:
          "Observabilidad (o11y) = logs + metrics + traces. El on-call reconstruye el path de `c-synth-1` con `corr-1`, no con el payload del cliente. La métrica nombra `latency_ms`; `pii_raw=False` es contrato del gate CP-N3-C, no un extra de compliance. En We Do: emitir corr, activar tres pilares y redactar email sintético.",
        retrospective:
          "Un on-call reconstruye el path con correlation_id, no con el email en claro ni con un print suelto. El error clásico es loggear el blob completo «para debug». Pregunta: si solo tienes case_id en un servicio y no corr, ¿qué tramo del path se rompe? We Do: corr obligatorio, tres pilares y pii_raw False.",
      },
      {
        demoId: "S38-T3-B-DEMO",
        subtopicId: "S38-T3-B",
        environment: "local-python",
        description: "Demo: SLO ok, redacción de PII y acción de error budget.",
        preamble:
          "Con logs y corr en su lugar, el servicio aún necesita objetivos: p95 120 ≤ 200 y redacción de email sintético. En la demo, si el SLO se cumple se pueden shippear features; si se viola, la política de error budget empuja a freeze de deploys no urgentes. No escribas: predice ok, redacted y action. Si celebras latencia peor que el límite, el dashboard miente.",
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
        why:
          "SLI mide la realidad (p95); SLO es el acuerdo (≤200 ms). Error budget convierte la violación en acción de equipo: freeze de deploys no urgentes. Redacción siempre, aunque el email sea inventado. p95 120 ≤ 200 → aún se puede shippear. En We Do: máscara de teléfono, slo multi-SLI y freeze al agotar budget.",
        retrospective:
          "Error budget convierte el SLO en decisión de equipo (ship vs. freeze), no en eslogan del dashboard. El error clásico es celebrar p95 bueno e ignorar error_rate, o comparar al revés. Pregunta: si p95=250 y budget=200, ¿qué action debe salir? We Do: redactar teléfono, slo_ok compuesto y freeze al agotar budget.",
      },
      {
        demoId: "S38-T4-A-DEMO",
        subtopicId: "S38-T4-A",
        environment: "local-python",
        description: "Demo: idempotency key + last_done → resume_from (siguiente paso pendiente).",
        preamble:
          "Tras un crash del worker a mitad de batch, el proceso nuevo no debe rehacer features si ya están done. En la demo, `c1:features:v1` identifica el intento y `resume_from(\"features\")` avanza a score. No escribas: predice key y siguiente paso. Si reejecutas un paso done sin store de claves, puedes duplicar enqueues o tickets de review.",
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
        why:
          "`last_done` nombra el paso terminado; `resume_from` es el siguiente pendiente — no rehacer features. La key `case:step:ver` es estable entre deploys de lógica y hace seguro un reintento tardío sin duplicar side effects. En We Do: estados terminales, idem_key con ver y mapa NEXT.",
        retrospective:
          "Reanudar mal es tan malo como no reanudar: volver a intake «por si acaso» duplica enqueues y tickets. El error clásico es rehacer un paso `done` sin store de claves. Pregunta: si last_done es features, ¿qué imprime `resume_from` y por qué no features otra vez? We Do: estados, key con versión y mapa NEXT.",
      },
      {
        demoId: "S38-T4-B-DEMO",
        subtopicId: "S38-T4-B",
        environment: "local-python",
        description: "Demo: backoff exponencial, ruta poison→DLQ y runbook presente.",
        preamble:
          "Un fallo retriable se espera con backoff; un mensaje venenoso no debe reintentarse a ciegas. En la demo ves la serie 0.1/0.2/0.4, la ruta poison→DLQ y el flag de runbook presente. No escribas: predice si poison va a retry o dlq y por qué el runbook es entregable. Si reinyectas la DLQ entera sin inspección, el veneno vuelve a la cola.",
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
        why:
          "Backoff exponencial: base×2^attempt (jitter en prod). Poison o max_attempts → dlq con replay controlado; retriable usa espera, no bucle ciego. El runbook (síntomas→checks→acciones) se prueba en drill y es entregable de operación, no un wiki opcional. En We Do: 0.8 en attempt=3, route poison y dict de on-call.",
        retrospective:
          "Retriable espera con backoff; poison va a DLQ con replay controlado, no a retry_forever. El error clásico es reinyectar la DLQ entera sin inspección. Pregunta: ¿por qué 0.1→0.2→0.4 no es lineal? We Do: fórmula attempt=3, ruta poison y dict de on-call.",
      },
    ],
  },
  weDo: {
    intro: "S38 · Laboratorio de operación resiliente del triage (24 retos). Sigue el hilo de `c-synth-1` cuando el fixture lo indique. Fixtures CASO-LIM-038; sin PII real ni red.\n\nCada subtopic tiene tres retos: **E1** repara un defecto del contrato, **E2** fija la política válida o inválida, y **E3** transfiere el criterio a un incidente sintético nuevo (cambio de fixture, no solo renombrar el print).",
    steps: [
      {
        id: "S38-T1-A-E1",
        subtopicId: "S38-T1-A",
        kind: "guided",
        title: "CPU-bound pide processes, no async",
        preamble:
          "- **Contexto:** en `CASO-LIM-038-1A` el profile sintético del tramo features muestra wall≈cpu; el worker no puede «ganar» con async puro.\n- **Meta:** implementar `pick(bound)` para que `cpu` devuelva `processes`.\n- **Éxito:** tres líneas `processes` / `bound cpu` / `ok True`.\n- **Límites:** no hardcodees solo el caso feliz sin mapa; no lances pools reales; datos sintéticos sin red.",
        instruction:
          "1. Abre el starter: `pick` ignora `bound` y devuelve siempre `async_or_threads` (DEFECTO).\n2. Mapea `io`→`async_or_threads`, `cpu`→`processes`, `mixed`→`batch_then_io`.\n3. Con `bound = \"cpu\"`, imprime la elección, `bound cpu` y `ok True`.\n4. No uses red ni PII.",
        hint: "Para CPU-bound en CPython prefiere processes por el GIL.",
        hints: [
          "Para CPU-bound en CPython prefiere processes por el GIL.",
          "pick debe mapear io→async_or_threads, cpu→processes, mixed→batch_then_io.",
        ],
        edgeCases: ["bound mal etiquetado", "elegir async en CPU", "CASO-LIM-038-1A sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-A-E1.",
        feedback:
          "Processes evaden el GIL en features densas de Python puro; async no acelera CPU. Documentar el bound en el runbook evita reabrir el incidente «elegimos async por moda» en el worker de c-synth-1.",
        retrospective:
          "El mapa bound→modelo es el primer contrato operable del batch. El error clásico es async en CPU. Siguiente (E2): el tramo de red mock debe liberar espera, no pagar IPC de processes.",
        starterCode: {
          language: 'python',
          title: "s38-t1-a-e1.py",
          code: `# CASO-LIM-038-1A — DEFECTO: pick ignora bound (siempre async)
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
        title: "I/O-bound: async o threads, no processes",
        preamble:
          "- **Contexto:** el tramo de normalización de `CASO-LIM-038-1A2` espera red mock (wall >> cpu); forzar processes solo añade serialización e IPC.\n- **Meta:** `pick(\"io\")` → `async_or_threads` con justificación de bound.\n- **Éxito:** `async_or_threads` / `bound io` / `ok True`.\n- **Límites:** no lances procesos reales; no copies el mapa a ciegas sin leer el bound del fixture.",
        instruction:
          "1. Revisa el starter: `pick` siempre devuelve `processes` (DEFECTO de copy-paste).\n2. Restaura el mapa io/cpu/mixed.\n3. Con `bound = \"io\"`, imprime elección, etiqueta y ok.\n4. Fixture local; sin red.",
        hint: "I/O-bound: threads o async liberan espera de red.",
        hints: [
          "I/O-bound: threads o async liberan espera de red.",
          "processes añaden IPC innecesario si no hay CPU densa.",
        ],
        edgeCases: ["IPC innecesario", "sin medir bound", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-A-E2.",
        feedback:
          "Async o threads liberan la espera de red mock en normalización; processes pagarían pickle sin acelerar el wall. En c-synth-1, wall >> cpu en este tramo es la justificación del runbook.",
        retrospective:
          "I/O y CPU no comparten el mismo modelo: processes en espera de red pagan pickle sin ganancia. Pregunta: ¿qué mediste (wall vs. CPU) para rechazar processes aquí?",
        starterCode: {
          language: 'python',
          title: "s38-t1-a-e2.py",
          code: `# CASO-LIM-038-1A2 — DEFECTO: pick fuerza processes en I/O
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
        title: "Medir bound antes de elegir modelo",
        preamble:
          "- **Contexto:** en el incidente sintético `CASO-LIM-038-1A3`, alguien eligió async sin profile; el path de features (100/95 ms) pedía otra cosa.\n- **Meta:** implementar `measure_bound` + `pick` y dejar `measure_first=True`.\n- **Éxito:** `processes` / `measure_first True` / `ok True`.\n- **Límites:** no dejes `measure_first=False`; no elijas async por moda; sin red real.",
        instruction:
          "1. Lee el starter: `measure_first=False` y `choice=\"async_or_threads\"` sin medir.\n2. Con wall=100 y cpu=95, calcula bound (`cpu` si cpu ≥ 0.8×wall).\n3. `pick(bound)` → `processes`; imprime modelo, measure_first y ok.\n4. Sin pools reales.",
        hint: "wall≈cpu ⇒ bound cpu ⇒ processes; measure_first debe ser True.",
        hints: [
          "Si cpu_ms >= wall_ms × 0.8 el bound es cpu.",
          "pick('cpu') → 'processes'; no elijas async por moda.",
        ],
        edgeCases: ["moda async", "sin profile", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-A-E3.",
        feedback:
          "Sin medición no hay elección defendible de concurrencia. El gate CP-N3-C espera bound documentado en el runbook del batch (100/95 → cpu → processes), no el framework de moda que dejó el starter.",
        retrospective:
          "Medir wall vs. CPU convierte la moda del framework en un bound defendible en el runbook. El error clásico es documentar «usamos async» y omitir el profile del path. Pregunta: con wall=100 y cpu=95, ¿qué bound imprime tu `measure_bound` y por qué no `io`? En T1-B medirás el blob que cruza procesos, no solo el modelo.",
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
        title: "Serializa IPC con JSON, no str(dict)",
        preamble:
          "- **Contexto:** el worker de features de `CASO-LIM-038-1B` debe medir el blob que viajará entre procesos; `str(dict)` no es contrato de IPC.\n- **Meta:** serializar `{\"x\": 2}` con `json.dumps(...).encode(\"utf-8\")` y validar el texto decodificado.\n- **Éxito:** `8` / `ok True` / `format json`.\n- **Límites:** no uses `str(payload)`; no inventes formato pickle aquí; sin PII.",
        instruction:
          "1. Revisa el starter: `blob = str(payload).encode(...)` y `format \"str\"` (DEFECTO).\n2. Cambia a `json.dumps(payload).encode(\"utf-8\")`.\n3. `ok` solo si `blob.decode() == '{\"x\": 2}'`.\n4. Imprime len, ok y format json.",
        hint: "json.dumps produce el blob estable entre procesos; str(dict) usa comillas simples.",
        hints: [
          "blob = json.dumps(payload).encode('utf-8'); mide len(blob).",
          "ok = blob.decode() == '{\"x\": 2}' (exige JSON real, no str()).",
        ],
        edgeCases: ["payload grande", "PII en blob", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-B-E1.",
        feedback:
          "El costo de IPC se mide sobre el blob JSON real que cruzará procesos del worker de features, no sobre el `str()` de Python. Un len coincidente no basta si el parse falla al otro lado.",
        retrospective:
          "El contrato entre procesos es un blob parseable, no el `repr` de Python. El error clásico es «el `len` coincidió, listo» y fallar el parse al otro lado. Pregunta: ¿por qué `str({\"x\": 2})` no pasa el assert de `ok` aunque tenga longitud parecida? Siguiente: etiquetar GIL limited en threads CPU.",
        starterCode: {
          language: 'python',
          title: "s38-t1-b-e1.py",
          code: `# CASO-LIM-038 · métrica de serialización IPC
import json
payload = {"x": 2}
# DEFECTO: str(dict) no es el contrato de IPC (comillas simples)
blob = str(payload).encode("utf-8")
print(len(blob))
print("ok", blob.decode() == '{"x": 2}')
print("format", "str")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-b-e1.py",
          code: `import json
payload = {"x": 2}
blob = json.dumps(payload).encode("utf-8")
print(len(blob))
print("ok", blob.decode() == '{"x": 2}')
print("format", "json")
`,
          output: `8
ok True
format json`,
        },
      },
      {
        id: "S38-T1-B-E2",
        subtopicId: "S38-T1-B",
        kind: "independent",
        title: "GIL limited en threads CPU",
        preamble:
          "- **Contexto:** el runbook del batch documenta expectativas de paralelismo; si model=threads y bound=cpu, CPython no da speedup lineal.\n- **Meta:** `gil_status(\"threads\", \"cpu\")` → `limited`.\n- **Éxito:** `limited` / `ok True` / `cpu_threads True`.\n- **Límites:** no lances threads reales; no digas unlimited en CPU puro.",
        instruction:
          "1. Starter devuelve siempre `unlimited` (DEFECTO).\n2. Si threads+cpu → `limited`; processes pueden reportar bypass.\n3. Imprime status, ok y `cpu_threads True`.\n4. Sin red ni pools.",
        hint: "GIL limita paralelismo CPU en threads Python puros → 'limited'.",
        hints: [
          "Si model=='threads' y bound=='cpu' → limited; processes evaden el GIL.",
          "Para CPU densa documenta limited y evalúa processes.",
        ],
        edgeCases: ["confundir I/O con CPU", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-B-E2.",
        feedback:
          "La etiqueta `limited` evita promesas de speedup multi-thread que el on-call del scoring no verá. En CPython, CPU denso con threads no escala linealmente: documenta limited y evalúa processes con payload compacto.",
        retrospective:
          "Documentar `limited` en el runbook frena promesas de paralelismo que el batch de c-synth-1 no entregará con threads CPU. El error clásico es vender N× speedup sin medir. Pregunta: si el bound es I/O, ¿sigue siendo correcta la etiqueta limited? Ese hábito se reutiliza al elegir process pool solo cuando el IPC compacto lo justifica.",
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
        title: "Prefiere compact_payload medido",
        preamble:
          "- **Contexto:** al encolar hacia el process pool de features, un full_record con email sintético infla bytes y arriesga PII en logs de cola.\n- **Meta:** comparar bytes JSON y elegir `compact_payload` si compact < full.\n- **Éxito:** `compact_payload` / `ok True` / `bytes 31`.\n- **Límites:** no hardcodees prefer sin medir; no loguees el email en claro; fixture sintético.",
        instruction:
          "1. Starter fija `prefer = \"full_record\"` y bytes 0 (DEFECTO).\n2. Mide `payload_bytes` de full y compact con json.dumps.encode.\n3. Elige compact si es menor; imprime prefer, ok y bytes del compact.\n4. Email solo sintético example.pe.",
        hint: "prefer = compact_payload si len(compact_bytes) < len(full_bytes).",
        hints: [
          "json.dumps(payload).encode() mide el blob real de IPC.",
          "full_record con email infla bytes y arriesga PII en logs de cola.",
        ],
        edgeCases: ["PII en queue", "pickle enorme", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T1-B-E3.",
        feedback:
          "`compact_payload` es privacidad y performance a la vez: menos IPC al process pool de features y sin email en logs de cola del batch CP-N3-C. Medir bytes (31) es la evidencia, no un hardcode de prefer.",
        retrospective:
          "Compact_payload es privacidad y performance a la vez. El error clásico es «por si acaso mando todo el registro». En T2 acotarás la cola que transporta esos payloads.",
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
print("ok", prefer == "compact_payload")
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
print("ok", prefer == "compact_payload" and cb < fb)
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
        title: "Token bucket: dos allows, tercero deny",
        preamble:
          "- **Contexto:** el batch de Lima sintético lanza una ráfaga al mock; con rate=2 el tercero debe denegarse (bucket didáctico estático, sin refill).\n- **Meta:** contar allows True en 3 intentos con `TokenBucket(2)`.\n- **Éxito:** `2` / `third False` / `ok True`.\n- **Límites:** no rellenes tokens entre llamadas en este fixture estático; sin red real.",
        instruction:
          "1. Starter usa `TokenBucket(3)` (DEFECTO).\n2. Cambia a rate=2; genera 3 `allow()`.\n3. Imprime la suma de True, el third y ok.\n4. Fixture estático sin refill.",
        hint: "rate=2 ⇒ dos True y el tercero False.",
        hints: [
          "rate=2 ⇒ dos True y el tercero False.",
          "No rellenes tokens entre llamadas en este fixture estático.",
        ],
        edgeCases: ["burst sin límite", "ban del API mock", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-A-E1.",
        feedback:
          "El bucket acota la ráfaga visible al proveedor mock del batch de Lima sintético. Un rate «generoso» disfraza flood y reabre el riesgo de ban.",
        retrospective:
          "Rate=2 fija dos allows y un deny visible; el fixture no rellena tokens (estático). El error clásico es subir el rate «para que pase el test» y disfrazar flood al mock. Pregunta: si en prod el bucket se rellena por ventana, ¿qué cambia en tu runbook respecto a este lab? Siguiente: acotar la cola del worker con maxsize.",
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
print("ok", sum(1 for a in allows if a) == 2 and allows[2] is False)
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
print("ok", sum(1 for a in allows if a) == 2 and allows[2] is False)
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
        title: "Cola maxsize=50 con backpressure",
        preamble:
          "- **Contexto:** el worker de scoring de `CASO-LIM-038` no puede crecer la cola sin tope bajo un pico sintético.\n- **Meta:** crear `Queue(maxsize=50)`, encolar c1/c2 y reportar política `backpressure`.\n- **Éxito:** `backpressure` / `ok True` / `maxsize 50`.\n- **Límites:** no dejes maxsize None; no uses cola ilimitada «por simplicidad».",
        instruction:
          "1. Starter reporta `unbounded_queue` y maxsize None (DEFECTO).\n2. Instancia `Queue(maxsize=50)` y encola dos case_id sintéticos.\n3. Imprime política, ok (maxsize==50 y qsize==2) y maxsize.\n4. Sin red.",
        hint: "from queue import Queue; maxsize finito = backpressure.",
        hints: [
          "from queue import Queue; maxsize=50 acota memoria del worker.",
          "Cola sin tope (política None / ilimitada) ⇒ OOM bajo pico.",
        ],
        edgeCases: ["OOM", "productor sin bloqueo", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-A-E2.",
        feedback:
          "maxsize es política de memoria del worker de scoring, no un detalle de API. Backpressure protege el batch de c-synth-1 bajo pico sintético y evita OOM.",
        retrospective:
          "Una cola sin tope no es «más simple»: es deuda de memoria bajo pico. El error clásico es dejar `maxsize` None en staging y copiar a prod. Pregunta: bajo pico, ¿bloqueas, dropeas o mandas overflow a DLQ — y dónde lo escribes? Ese hábito se reutiliza cuando el productor del batch de c-synth-1 se acelera.",
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
        title: "Rate limit evita ban del proveedor",
        preamble:
          "- **Contexto:** sin límite de tasa el mock/API puede banear la IP del batch y tumbar todo el triage sintético.\n- **Meta:** con `TokenBucket(1)` demostrar second=False y documentar `ban_risk True`.\n- **Éxito:** `provider` / `ok True` / `ban_risk True`.\n- **Límites:** no uses rate «infinito»; no ignores el deny; datos sintéticos.",
        instruction:
          "1. Starter usa rate=99, imprime flood y ban_risk False (DEFECTO).\n2. Rate=1; first True, second False.\n3. Imprime `provider`, ok y ban_risk True.\n4. Sin red real.",
        hint: "Sin rate limit el mock/API puede banear la IP del batch.",
        hints: [
          "Sin rate limit el mock/API puede banear la IP del batch.",
          "rate=1 ⇒ primer allow True, segundo False ⇒ ban_risk documentado.",
        ],
        edgeCases: ["429 storm", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-A-E3.",
        feedback:
          "Rate limit es cortesía y supervivencia: sin él el mock puede banear la IP y tumbar el triage sintético completo. Documenta ban_risk en el runbook.",
        retrospective:
          "Rate limit es cortesía y supervivencia. El error clásico es flood «solo en sandbox» que se cuela a prod. En T2-B un proveedor lento sin timeout colgará workers aunque la tasa esté bien.",
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
first, second = b.allow(), b.allow()
print("flood")
print("ok", first is True and second is False)
print("ban_risk", False)  # DEFECTO: no documenta riesgo de ban del proveedor
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
# second False = rate limit activo; ban_risk True documenta por qué limitamos
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
        title: "Timeout con on_fail retry_or_dlq",
        preamble:
          "- **Contexto:** el geocoding mock de `c-synth-1` llega a 8000 ms; sin presupuesto el worker cuelga.\n- **Meta:** devolver status timeout, seconds=5 y on_fail `retry_or_dlq`.\n- **Éxito:** `5` / `on_fail retry_or_dlq` / `ok True`.\n- **Límites:** no uses timeout_s=0; no ignores el fallo; simulación local sin threads reales.",
        instruction:
          "1. Starter ignora latency y devuelve seconds=0, on_fail ignore, status ok (DEFECTO).\n2. Compara latency_ms > timeout_s*1000.\n3. Si superado → status timeout; siempre on_fail retry_or_dlq y seconds=timeout_s.\n4. Imprime seconds, on_fail y ok.",
        hint: "timed_out = latency_ms > timeout_s * 1000; seconds debe ser > 0.",
        hints: [
          "seconds>0 evita hang infinito; on_fail = retry_or_dlq.",
          "Si latency supera el presupuesto, status es timeout (no ok).",
        ],
        edgeCases: ["hang", "retry infinito", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-B-E1.",
        feedback:
          "Timeout + on_fail es el mínimo viable de I/O externa del geocoding mock. Status ok con seconds=0 es hang disfrazado y tumba el p95 del batch.",
        retrospective:
          "Timeout sin on_fail es un bool sin ruta. El error clásico es status ok con seconds=0. Siguiente: liberar la conn en finally aunque falle el fetch.",
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
        title: "Cierra la conn en finally",
        preamble:
          "- **Contexto:** bajo carga, un leak de conn sintética agota el pool del worker de scoring.\n- **Meta:** marcar `closed=True` en `finally` aunque el fetch mock falle.\n- **Éxito:** `True` / `resource conn` / `ok True`.\n- **Límites:** no dejes el close solo en el happy path; sin sockets reales.",
        instruction:
          "1. Starter atrapa RuntimeError y no cierra (DEFECTO).\n2. Añade `finally: closed = True`.\n3. Imprime closed, resource conn y ok.\n4. Fixture local.",
        hint: "finally/context manager cierra aunque falle el fetch.",
        hints: [
          "finally/context manager cierra aunque falle el fetch.",
          "Leak de conn tumba el pool bajo carga.",
        ],
        edgeCases: ["resource leak", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-B-E2.",
        feedback:
          "Sin close determinista el pool del worker de scoring se agota bajo carga del batch. En prod preferirás context manager; aquí fijas el hábito del finally.",
        retrospective:
          "Liberar la conn en `finally` (o context manager) es higiene de pool, no un detalle de sintaxis. El error clásico es cerrar solo en el happy path y agotar recursos bajo carga. Pregunta: en prod, ¿qué ventaja concreta da `with` frente a un `finally` manual olvidable? Ese hábito se reutiliza en todo fetch del triage.",
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
        title: "Incidente de timeout abre el runbook",
        preamble:
          "- **Contexto:** latency 5000 ms con budget 1 s (o sin presupuesto) debe generar incidente de proveedor lento, no «seguir ignorando».\n- **Meta:** `needs_incident` True y `action_for` → `open_runbook`.\n- **Éxito:** `incident True` / `ok True` / `action open_runbook`.\n- **Límites:** no devuelvas ignore; timeout_s≤0 también es hang = incidente.",
        instruction:
          "1. Starter: timeout_s=0 niega incidente y action ignore (DEFECTO).\n2. Sin presupuesto o latencia sobre budget → incidente.\n3. Si hit → open_runbook; imprime incident, ok y action.\n4. Fixture CASO-LIM-038 sintético.",
        hint: "Hang o timeout superado ⇒ incidente y open_runbook.",
        hints: [
          "needs_incident: timeout_s<=0 o latency > timeout*1000.",
          "Si hay incidente, action_for → open_runbook (no ignore).",
        ],
        edgeCases: ["p95 explotado", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T2-B-E3.",
        feedback:
          "Nombrar el incidente y abrir el runbook es el primer paso operable ante proveedor lento. Silence under hang es el anti-patrón que el gate CP-N3-C rechaza.",
        retrospective:
          "Un timeout sin playbook es un bool local, no un incidente operable. El error clásico es silence under hang o action ignore. Pregunta: si latency=5000 y timeout_s=0, ¿por qué aún hay incidente? En T3 el on-call necesitará logs, metrics y traces con correlation_id.",
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
        title: "Evento scored con correlation_id",
        preamble:
          "- **Contexto:** al marcar scored en `c-synth-1`, el log debe llevar `corr-1` para unir spans del path.\n- **Meta:** `emit_scored` devuelve dict con event, case_id, corr y pii_raw=False.\n- **Éxito:** `True` / `event scored` / `ok True`.\n- **Límites:** no dejes corr=None; no pongas PII en el evento; sin red.",
        instruction:
          "1. Starter fija corr=None e ignora el parámetro (DEFECTO).\n2. Propaga el corr recibido al dict.\n3. Imprime bool(corr), event y ok (corr-1 y pii_raw False).\n4. Fixture sintético.",
        hint: "corr debe ser truthy string en el dict emitido.",
        hints: [
          "corr debe ser truthy string en el dict emitido.",
          "Sin corr no hay reconstrucción del path del caso.",
        ],
        edgeCases: ["log sin corr", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-A-E1.",
        feedback:
          "correlation_id une spans del path intake→score de c-synth-1. Sin corr el on-call no reconstruye el caso aunque tenga case_id en un solo servicio.",
        retrospective:
          "correlation_id une spans del caso. El error clásico es case_id sin corr entre servicios. Siguiente: activar logs, metrics y traces juntos.",
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
        title: "Tres pilares activos de o11y",
        preamble:
          "- **Contexto:** diagnosticar cola llena, latencia p95 y path de un caso exige logs, metrics y traces, no solo un log INFO.\n- **Meta:** `active_pillars` devuelve en orden fijo las claves True entre logs/metrics/traces.\n- **Éxito:** `['logs', 'metrics', 'traces']` / `ok True` / `n 3`.\n- **Límites:** no hardcodees la lista si puedes filtrar el dict; activa los tres en el fixture.",
        instruction:
          "1. Starter solo considera logs y deja metrics/traces en False (DEFECTO).\n2. Filtra ORDER por signals.get(k).\n3. Señales con los tres True; imprime lista, ok y n.\n4. Sin OpenTelemetry real.",
        hint: "return [k for k in ('logs','metrics','traces') if signals.get(k)].",
        hints: [
          "Logs eventos, metrics agregados, traces spans — los tres deben estar True.",
          "Un solo pilar no basta para diagnosticar cola + latencia + caso.",
        ],
        edgeCases: ["solo logs", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-A-E2.",
        feedback:
          "Un solo pilar no basta: cola llena pide metrics, latencia p95 pide series, path del caso pide traces. La o11y mínima del gate exige los tres activos.",
        retrospective:
          "Logs, metrics y traces responden preguntas distintas: evento local, agregados de cola/latencia y path del caso. El error clásico es «con un INFO basta». Pregunta: si solo tienes metrics sin corr en el log, ¿qué incidente del batch no puedes cerrar? Ese hábito se reutiliza en el You Do al trazar c-synth-1.",
        starterCode: {
          language: 'python',
          title: "s38-t3-a-e2.py",
          code: `# CASO-LIM-038 · tres pilares de observabilidad
ORDER = ("logs", "metrics", "traces")

def active_pillars(signals: dict) -> list:
    # DEFECTO: solo considera logs
    return [k for k in ORDER if k == "logs" and signals.get(k)]

signals = {"logs": True, "metrics": False, "traces": False}
pillars = active_pillars(signals)
print(pillars)
print("ok", pillars == ["logs", "metrics", "traces"])
print("n", len(pillars))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-a-e2.py",
          code: `ORDER = ("logs", "metrics", "traces")

def active_pillars(signals: dict) -> list:
    return [k for k in ORDER if signals.get(k)]

signals = {"logs": True, "metrics": True, "traces": True}
pillars = active_pillars(signals)
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
        title: "pii_raw False y email redactado",
        preamble:
          "- **Contexto:** el contrato de operación CP-N3-C prohíbe PII cruda en logs del pipeline, aunque el email sea sintético de lab.\n- **Meta:** `pii_raw=False` y `redact(email)==\"an***\"`.\n- **Éxito:** `False` / `ok True` / `redact True`.\n- **Límites:** nunca pii_raw True en operación; conserva case_id sintético sin enmascararlo como email.",
        instruction:
          "1. Starter: redact identidad y pii_raw True (DEFECTO).\n2. Implementa s[:2]+\"***\"; pii_raw False.\n3. Imprime pii_raw, ok y redact.\n4. Solo example.pe sintético.",
        hint: "Nunca pii_raw True en logs de operación.",
        hints: [
          "Nunca pii_raw True en logs de operación.",
          "redact(s) = s[:2] + '***' si len>2; conserva case_id sintético.",
        ],
        edgeCases: ["PII en log aggregate", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-A-E3.",
        feedback:
          "Privacidad es parte del contrato de o11y del gate CP-N3-C, no un extra de compliance al final. «Solo es sandbox» no justifica pii_raw True en logs del batch.",
        retrospective:
          "`pii_raw=False` y máscara de email son contrato del gate, no un extra de compliance al final del sprint. El error clásico es «solo es sandbox / example.pe». Pregunta: ¿por qué el case_id sintético no se enmascara igual que el email? En T3-B redactarás teléfono con otra máscara y evaluarás SLO con error budget.",
        starterCode: {
          language: 'python',
          title: "s38-t3-a-e3.py",
          code: `# CASO-LIM-038 · pii_raw prohibido en logs
def redact(s: str) -> str:
    return s  # DEFECTO: no enmascara

email = "ana@example.pe"
pii_raw = True  # DEFECTO: permite PII cruda
masked = redact(email)
print(pii_raw)
print("ok", masked == "an***" and pii_raw is False)
print("redact", masked == "an***")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-a-e3.py",
          code: `def redact(s: str) -> str:
    return s[:2] + "***" if len(s) > 2 else "***"

email = "ana@example.pe"
pii_raw = False
masked = redact(email)
print(pii_raw)
print("ok", masked == "an***" and pii_raw is False)
print("redact", masked == "an***")
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
        title: "Redacta teléfono sintético en logs",
        preamble:
          "- **Contexto:** un log de operación no debe llevar el teléfono sintético completo; el on-call usa case_id y corr.\n- **Meta:** enmascarar a `90****01` (2+****+2).\n- **Éxito:** `90****01` / `ok True` / `pii False`.\n- **Límites:** no uses PII real; no imprimas el número crudo «para debug».",
        instruction:
          "1. Starter asigna redacted = phone (DEFECTO).\n2. Aplica phone[:2]+\"****\"+phone[-2:].\n3. Imprime redactado, ok y pii False.\n4. Fixture sintético 90000001.",
        hint: "Conserva prefijo/sufijo mínimo; enmascara el medio.",
        hints: [
          "redacted = phone[:2] + '****' + phone[-2:]",
          "ok = redacted == '90****01'; pii False siempre en logs de operación.",
        ],
        edgeCases: ["email en claro", "sintético example.pe"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-B-E1.",
        feedback:
          "Redacción de teléfono es mecánica y revisable en code review. El on-call opera con case_id y corr, no con el número crudo «solo un rato».",
        retrospective:
          "Enmascarar 2+****+2 es revisable en code review y deja al on-call con case_id y corr, no con el número crudo. El error clásico es loggear «solo un rato» para debug. Pregunta: si el teléfono sintético cambia de longitud, ¿qué invariante de máscara mantienes? Siguiente: evaluar p95 y error_rate juntos.",
        starterCode: {
          language: 'python',
          title: "s38-t3-b-e1.py",
          code: `# CASO-LIM-038 · redacción de PII en logs
phone = "90000001"
# DEFECTO: imprime teléfono crudo en el log
redacted = phone
print(redacted)
print("ok", redacted == "90****01")
print("pii", redacted == phone)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-b-e1.py",
          code: `phone = "90000001"
redacted = phone[:2] + "****" + phone[-2:]
print(redacted)
print("ok", redacted == "90****01")
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
        title: "SLO multi-SLI: p95 y error_rate",
        preamble:
          "- **Contexto:** celebrar p95 bueno con error_rate alto engaña al dueño del servicio de triage.\n- **Meta:** `slo_ok` True solo si p95≤200 y error_rate≤0.02.\n- **Éxito:** `True` / `p95 100` / `limit 200`.\n- **Límites:** no compares al revés; no ignores error_rate.",
        instruction:
          "1. Starter: `p95 > limit` e ignora error_rate (DEFECTO doble).\n2. AND de ambos umbrales con `<=`.\n3. Imprime ok, p95 y limit.\n4. Fixture sintético.",
        hint: "slo_ok = p95 <= slo_p95 AND error_rate <= slo_err.",
        hints: [
          "Ambos SLI deben respetar su SLO; uno solo no basta.",
          "Comparación invertida enciende alertas falsas o las apaga.",
        ],
        edgeCases: ["error_rate alto con p95 ok", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-B-E2.",
        feedback:
          "Un SLO multi-SLI evita celebrar latencia buena con errores altos en el servicio de triage de c-synth-1. Comparar al revés apaga o enciende alertas falsas.",
        retrospective:
          "Un SLO multi-SLI obliga a mirar p95 **y** error_rate con `<=`, no un solo umbral al revés. El error clásico del starter es alerta falsa o silencio con error_rate alto. Pregunta: si p95=100 (ok) y error_rate=0.05, ¿qué debe devolver `slo_ok` y por qué miente el dashboard si devuelves True? Luego (E3): freeze cuando el budget llega a 0.",
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
        title: "Error budget agotado: freeze deploys",
        preamble:
          "- **Contexto:** al agotarse el error budget del servicio de scoring sintético, la operación prioriza estabilidad sobre features nuevas.\n- **Meta:** `budget_action(0)` → `freeze_nonurgent_deploys` y documentar mecanismo `error_budget`.\n- **Éxito:** `error_budget` / `ok True` / `n 1`.\n- **Límites:** no ignores remaining; no imprimas uptime_only como si no hubiera política.",
        instruction:
          "1. Starter siempre ship_features e imprime uptime_only, n 0 (DEFECTO).\n2. remaining==0 → freeze; si no → ship_features.\n3. Imprime error_budget, ok y n 1.\n4. Fixture didáctico.",
        hint: "Error budget cuantifica cuánto incumplimiento queda; al agotarse prioriza estabilidad.",
        hints: [
          "Error budget cuantifica cuánto incumplimiento queda en el periodo.",
          "Si remaining==0 → freeze_nonurgent_deploys, no ship ciego.",
        ],
        edgeCases: ["SLO sin consecuencia", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T3-B-E3.",
        feedback:
          "Sin error budget el SLO es eslogan. Al remaining=0 el scoring sintético congela deploys no urgentes: estabilidad primero. El starter que siempre shippea e imprime `uptime_only` niega la política operativa del gate.",
        retrospective:
          "El presupuesto de error convierte la violación en acción de equipo, no en un gráfico sin consecuencia. El error clásico es seguir shippeando features con remaining en cero. Pregunta: ¿qué documentarías en el runbook cuando el freeze se activa? En T4 el workflow aún necesita checkpoint e idempotencia para reanudar sin duplicar side effects.",
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
        title: "Cuatro estados; failed es terminal",
        preamble:
          "- **Contexto:** el workflow de triage necesita pending/running/done/failed; sin failed no hay ruta clara a DLQ o retry.\n- **Meta:** lista de 4 estados e `is_terminal` True para done y failed.\n- **Éxito:** lista con failed / `ok True` / `n 4`.\n- **Límites:** no omitas failed; no marques pending como terminal.",
        instruction:
          "1. Starter: tres estados y terminal solo done (DEFECTO).\n2. Añade failed; is_terminal en (done, failed).\n3. Imprime lista, ok y n.\n4. Fixture sintético.",
        hint: "failed es estado terminal de error, distinto de pending.",
        hints: [
          "failed y done son terminales; pending/running no.",
          "Cuatro estados mínimos del workflow didáctico.",
        ],
        edgeCases: ["estado perdido tras crash", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-A-E1.",
        feedback:
          "Sin estado failed no hay ruta clara a DLQ o retry en el workflow de triage. Colapsar error en running deja al on-call sin terminal de fallo.",
        retrospective:
          "Failed es estado terminal de error, distinto de pending. El error clásico es colapsar error en running. Siguiente: key case:step:ver.",
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
        title: "Idempotency key case:step:ver",
        preamble:
          "- **Contexto:** al reintentar features de `c-synth-1` tras un deploy de lógica v3, la key debe incluir versión para no colisionar con v2.\n- **Meta:** `idem_key` → `c-synth-1:features:v3` y dup False.\n- **Éxito:** key completa / `ok True` / `dup False`.\n- **Límites:** no omitas ver; no marques dup True en el happy path.",
        instruction:
          "1. Starter omite ver y deja dup True (DEFECTO).\n2. Formato f\"{case}:{step}:{ver}\".\n3. Imprime key, ok (2 dos puntos y ends with :v3) y dup False.\n4. Sin side effects reales.",
        hint: "Incluye step y versión de lógica: f'{case}:{step}:{ver}'.",
        hints: [
          "Incluye step y versión de lógica para evitar colisiones entre deploys.",
          "dup False = reejecutar el mismo paso no duplica side effects.",
        ],
        edgeCases: ["doble enqueue", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-A-E2.",
        feedback:
          "La key estable `case:step:ver` es la base de la idempotencia del checkpoint: sin ver, dos deploys de lógica colisionan y pueden reaplicar side effects.",
        retrospective:
          "La key estable es la base de la idempotencia del checkpoint. Pregunta: ¿qué pasa si dos deploys comparten case:step sin ver?",
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
        title: "Resume al siguiente, no al intake",
        preamble:
          "- **Contexto:** tras crash con last_done=features, el worker nuevo debe ir a score; volver a intake duplica trabajo y side effects.\n- **Meta:** `resume = NEXT[last_done]` → score.\n- **Éxito:** `score` / `ok True` / `checkpoint True`.\n- **Límites:** no hardcodees intake; no reuses last_done como resume_from.",
        instruction:
          "1. Starter fija resume=\"intake\" (DEFECTO).\n2. Usa NEXT[state[\"last_done\"]].\n3. Imprime resume, ok y checkpoint True.\n4. Fixture CASO-LIM-038.",
        hint: "resume_from = NEXT[last_done], no el last_done mismo ni intake fijo.",
        hints: [
          "last_done=features ⇒ siguiente es score.",
          "No vuelvas a intake si features ya está done.",
        ],
        edgeCases: ["doble side effect", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-A-E3.",
        feedback:
          "Reanudar mal es tan malo como no reanudar: volver a intake tras features done duplica side effects y falla el gate de idempotencia CP-N3-C.",
        retrospective:
          "last_done nombra lo terminado; resume_from avanza. El error clásico es «siempre desde el inicio por seguridad». En T4-B, si score falla de forma no transitoria, irás a DLQ en lugar de reintentar infinito.",
        starterCode: {
          language: 'python',
          title: "s38-t4-a-e3.py",
          code: `# CASO-LIM-038 · checkpoint resume al siguiente paso
NEXT = {"features": "score", "score": "notify", "notify": "done"}
state = {"last_done": "features", "status": "done"}
# DEFECTO: hardcode intake en vez de NEXT[last_done]
resume = "intake"
print(resume)
print("ok", resume == "score")
print("checkpoint", state["status"] == "done")
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
print("checkpoint", state["status"] == "done")
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
        title: "Backoff exponencial, no lineal",
        preamble:
          "- **Contexto:** reintentos lineales golpean el mock en ráfaga; el fixture pide base×2^attempt.\n- **Meta:** `backoff(3, 0.1)` → 0.8.\n- **Éxito:** `0.8` / `ok True` / `attempt 3`.\n- **Límites:** no uses base*attempt lineal; jitter opcional en prod, no aquí.",
        instruction:
          "1. Starter: base*attempt (DEFECTO).\n2. Cambia a base * (2 ** attempt).\n3. Imprime wait, ok y attempt 3.\n4. Fixture didáctico.",
        hint: "Fórmula didáctica: base * 2**attempt.",
        hints: [
          "Fórmula didáctica: base * 2**attempt.",
          "En prod añadir jitter; aquí solo el valor exacto 0.8.",
        ],
        edgeCases: ["retry storm", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-B-E1.",
        feedback:
          "Backoff exponencial reduce presión sobre el proveedor mock entre reintentos de c-synth-1. Sleep lineal o fijo recrea la ráfaga que el rate limit intentaba evitar.",
        retrospective:
          "La espera crece como base×2^attempt y deja respirar al mock entre reintentos. El error clásico es sleep fijo o lineal que recrea la ráfaga. Pregunta: con base 0.1 y attempt 3, ¿por qué 0.8 y no 0.3? Siguiente: poison a DLQ con replay controlado.",
        starterCode: {
          language: 'python',
          title: "s38-t4-b-e1.py",
          code: `# CASO-LIM-038 · exponential backoff
# DEFECTO: base*attempt lineal en vez de 2**attempt
def backoff(attempt, base=0.1):
    return base * attempt  # DEFECTO: exponencial base * 2**attempt
wait = backoff(3)
print(wait)
print("ok", wait == 0.8)
print("attempt", 3)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-b-e1.py",
          code: `def backoff(attempt, base=0.1):
    return base * (2 ** attempt)
wait = backoff(3)
print(wait)
print("ok", wait == 0.8)
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
        title: "Poison va a DLQ, no retry forever",
        preamble:
          "- **Contexto:** un payload malformado que falla siempre no se cura con más reintentos; contamina el throughput del batch.\n- **Meta:** `route(\"poison\")` → `dlq` y replay controlled.\n- **Éxito:** `dlq` / `ok True` / `replay controlled`.\n- **Límites:** no reintentes veneno en bucle; no borres DLQ sin análisis.",
        instruction:
          "1. Starter: retry_forever y replay uncontrolled (DEFECTO).\n2. if kind == \"poison\": return \"dlq\".\n3. Imprime dest, ok y replay controlled.\n4. Fixture sintético.",
        hint: "DLQ = mensajes que fallan de forma no transitoria; replay controlado tras inspección.",
        hints: [
          "if kind == 'poison': return 'dlq' (no retry_forever).",
          "Replay ciego reinyecta el veneno.",
        ],
        edgeCases: ["loop de fallo", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-B-E2.",
        feedback:
          "Poison + replay controlado es higiene de cola: retry_forever contamina el throughput del batch y reinyecta el mismo fallo malformado. El starter que imprime `uncontrolled` niega el contrato de DLQ del gate.",
        retrospective:
          "Un mensaje que falla siempre no se cura con más intentos: se aísla y se reinyecta caso a caso tras inspección. El error clásico es borrar la DLQ «para limpiar» o reinyectar en bucle. Pregunta: ¿por qué el replay ciego devuelve el mismo poison a la cola caliente? Ese hábito se reutiliza en el runbook del You Do.",
        starterCode: {
          language: 'python',
          title: "s38-t4-b-e2.py",
          code: `# CASO-LIM-038 · poison message a DLQ
def route(kind: str) -> str:
    return "retry_forever"  # DEFECTO: veneno no debe reintentarse a ciegas
dest = route("poison")
print(dest)
print("ok", dest == "dlq")
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

dest = route("poison")
print(dest)
print("ok", dest == "dlq")
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
        title: "Runbook on-call con restart_worker",
        preamble:
          "- **Contexto:** el drill sintético de `c-synth-1` exige un playbook antes de prod: síntomas (provider_slow, worker_down) y acciones (restart_worker, replay_batch, escalate_provider).\n- **Meta:** dict no vacío con `restart_worker` en actions.\n- **Éxito:** `True` / `oncall True` / `ok True`.\n- **Límites:** no dejes runbook={}; no improvises acciones solo en la cabeza bajo presión.",
        instruction:
          "1. Starter: runbook vacío y oncall False (DEFECTO).\n2. Define symptoms y actions mínimas.\n3. Imprime bool(runbook), oncall True y ok si restart_worker ∈ actions.\n4. Transferencia a operación CP-N3-C.",
        hint: "Runbook: síntomas → checks → acciones; no improvise bajo presión.",
        hints: [
          "Runbook mínimo: symptoms + actions con al menos restart_worker.",
          "Tras un drill, actualiza el runbook con lo que falló en el checklist.",
        ],
        edgeCases: ["incidente sin playbook", "sintético"],
        tests: "Salida exacta de tres líneas (sin red, sin PII) — S38-T4-B-E3.",
        feedback:
          "El runbook es entregable de operación del gate CP-N3-C, no un wiki opcional. Improvisar bajo presión es el anti-patrón del drill de c-synth-1.",
        retrospective:
          "El runbook es entregable de operación, no un wiki opcional. El error clásico es «ya lo sabíamos del incidente pasado». En el You Do ensamblarás los cuatro pilares y demostrarás resume + idempotencia + runbook para el gate.",
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
      "Construye un mini-worker sintético con pool y backpressure, logs redactados, checkpoint durable e idempotente, retry con DLQ y runbook de proveedor lento. Integra el hilo de `c-synth-1` visto en T1–T4. Solo datos CASO-LIM-038; sin PII real ni servicios externos.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con dos `apply_once` del mismo `case:step:ver` y un resume desde checkpoint? (2) ¿qué cambiarías con red real (timeouts, jitter, store durable) vs. el mock sintético, sin PII? (3) Escribe en el README una frase de impacto medible (p. ej. «mismo resultado tras kill del worker; 0 side effects duplicados») que puedas defender en 30 segundos ante el gate CP-N3-C / S39.",
    objectives: [
      "Concurrencia adecuada al bound medido (ideal: ThreadPoolExecutor o ProcessPoolExecutor local)",
      "Timeouts y backpressure acotados (put_nowait / Full)",
      "Observabilidad (logs, metrics y traces) + SLI/SLO con redacción",
      "Checkpoint durable, store de idempotencia, retry y runbook",
    ],
    requirements: [
      "Trace por case_id y correlation_id",
      "Sin PII raw en logs",
      "Runbook de fallos (lento / caído / reejecución) — obligatorio, no opcional",
      "Documentación en español profesional",
      "Mismo resultado tras resume controlado (last_done → siguiente paso) con store reutilizable",
      "Idempotencia verificable: dos invocaciones del mismo case:step:ver → un solo side effect",
    ],
    starterCode: `# workflow resiliente CASO-LIM-038 · scaffold de 4 pilares (completa lo marcado)
from queue import Queue, Full

state = {
    "case_id": "c-synth-1",
    "step": "intake",
    "status": "pending",
    "corr": "corr-038",
}
q: Queue[str] = Queue(maxsize=50)
NEXT = {"intake": "features", "features": "score", "score": "notify", "notify": "done"}
# Portafolio: persiste CKPT (JSON/SQLite) y APPLIED entre procesos para el drill de crash/resume
CKPT: dict = {}
APPLIED: set = set()
SIDE_EFFECTS: list = []

def redact(s: str) -> str:
    return s[:2] + "***" if len(s) > 2 else "***"

def measure_bound(wall_ms: float, cpu_ms: float) -> str:
    # Portafolio: wall >> cpu → "io"; cpu denso (≥80% wall) → "cpu"; si no "mixed"
    raise NotImplementedError("elige bound a partir de wall_ms/cpu_ms")

def pick(bound: str) -> str:
    # Portafolio: io→async_or_threads, cpu→processes, mixed→batch_then_io
    raise NotImplementedError("mapea io/cpu/mixed a modelo de concurrencia")

def fetch_policy(latency_ms: float, timeout_s: float) -> dict:
    # Portafolio: status timeout|ok, on_fail retry_or_dlq, seconds=timeout_s
    raise NotImplementedError("timeout mock del proveedor")

def checkpoint(state: dict, step: str) -> dict:
    out = dict(state)
    out["step"] = step
    out["status"] = "done"
    out["last_done"] = step
    out["resume_from"] = NEXT.get(step, step)
    out["idem_key"] = f"{out['case_id']}:{step}:v1"
    CKPT[out["case_id"]] = out  # en prod: escritura atómica a disco
    return out

def apply_once(case_id: str, step: str, ver: str = "v1") -> bool:
    """True si el side effect se aplica por primera vez; False si la key ya existía."""
    key = f"{case_id}:{step}:{ver}"
    if key in APPLIED:
        return False
    APPLIED.add(key)
    SIDE_EFFECTS.append(key)
    return True

def backoff(attempt: int, base: float = 0.1) -> float:
    return base * (2 ** attempt)

def route(kind: str, attempt: int = 0, max_attempts: int = 3) -> str:
    if kind == "poison" or attempt >= max_attempts:
        return "dlq"
    return "retry"

def runbook() -> dict:
    # Portafolio: symptoms + actions (restart_worker, replay_batch, escalate_provider)
    raise NotImplementedError("runbook de on-call")

if __name__ == "__main__":
    # Demo parcial del scaffold (completa measure/pick/fetch/runbook arriba)
    print("log", {"event": "start", "corr": state["corr"], "email": redact("ana@example.pe")})
    print(checkpoint(state, "features"))
    print("first", apply_once("c-synth-1", "features"))
    print("retry", apply_once("c-synth-1", "features"))  # debe ser False
    print("side_effects", len(SIDE_EFFECTS))  # 1
    print("backoff", [round(backoff(i), 3) for i in range(3)])
    print("queue_maxsize", q.maxsize)
    print("route_poison", route("poison"))
`,
    portfolioNote:
      "Operación CP-N3-C. Evidencia de pipeline reanudable con trace por caso. Completa measure_bound + pick, fetch_policy (timeout mock), métrica de cola y runbook() con síntomas → acciones. Demuestra apply_once dos veces (un solo side effect) y, si puedes, reinicia el proceso leyendo CKPT desde disco. Documenta en markdown un drill de proveedor lento. Sin red real ni PII.",
    rubric: [
      { criterion: "Alineación al gate de operación de la sección (CP-N3-C)", weight: "20%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "15%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "15%" },
      { criterion: "Pruebas o casos de borde documentados (incluye reintento idempotente)", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Idempotencia verificable + runbook de fallos (obligatorio)", weight: "15%" },
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
        options: ["Adoptar el framework de moda del equipo", "Lanzar cientos de procesos por defecto", "Medir el bottleneck (wall vs. CPU) del path caliente y documentar el bound", "Desactivar timeouts para maximizar throughput"],
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
