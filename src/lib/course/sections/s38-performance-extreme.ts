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
    "En operación de triage (fintech, retail, banca de procesos en Perú y la región), un batch de scoring no puede colgarse por un proveedor lento ni duplicar side effects al reiniciar. Esta sección entrena concurrencia correcta, **observabilidad** (logs/metrics/traces) y workflows con checkpoint/idempotencia para el gate CP-N3-C. Id `performance-extreme` conservado. Logs sin PII real; datos sintéticos CASO-LIM-038.",
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
        "**Diccionario de la sección** (léelo antes de T1). **Bound (I/O vs CPU):** cuello de botella medido. **GIL:** Global Interpreter Lock de CPython (limita CPU multi-thread). **Backpressure:** cola con `maxsize` que frena al productor. **Token bucket:** rate limit didáctico. **SLI/SLO:** indicador vs objetivo de servicio. **Idempotency key:** `case:step:ver` para no duplicar side effects. **DLQ:** dead-letter queue de mensajes venenosos. **correlation_id:** une logs/traces sin PII.",
        "Esta sección opera el pipeline de triage CP-N3-C bajo carga realista: el batch debe reanudarse tras un crash, trazar cada caso sintético y sobrevivir a un proveedor lento o a un worker caído. No optimizamos microsegundos a ciegas; diseñamos concurrencia correcta, observabilidad y workflows con checkpoint e idempotencia.",
        "Contrato operativo de la sección. Entrada: cola de casos sintéticos `CASO-LIM-038`, límites de tasa del proveedor mock, budgets de latencia p95 y políticas de retry/DLQ. Salida: pipeline reanudable con trace por case_id, métricas de cola y runbook de fallos. Error: side effect duplicado, PII raw en logs o cola sin backpressure bloquea promoción. Criterio: mismo resultado funcional tras reejecución controlada.",
        "Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia un API mock y CPU de features en lotes. Legacy id `performance-extreme` se conserva; el path V3 es concurrencia + resiliencia, no Numba/Cython extremo. Orden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real.",
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
      heading: "threads/processes/async",
      subtopicId: "S38-T1-A",
      paragraphs: [
        "Threads conviene cuando el cuello es I/O concurrente (esperas de red o disco) y el trabajo por hilo es liviano. Processes conviene cuando el cuello es CPU (features densas, scoring vectorial) y quieres evadir el GIL de CPython. Async brilla con muchos I/O en un solo hilo de evento, siempre que no bloquees el loop con CPU pesada. **Mide primero** (wall vs CPU en el path caliente); la moda del framework no es un contrato.",
        "Contrato operativo. Entrada: etiqueta de bound (`io` | `cpu` | `mixed`) medida en el path caliente del triage sintético. Salida: elección documentada `async_or_threads` | `processes` | `batch_then_io`. Error: elegir async por moda sin medir, o lanzar cientos de procesos para I/O trivial. Criterio de éxito: la decisión se justifica con bottleneck observado y un plan de medición, no con preferencia de framework.",
        "Aplicación a `CASO-LIM-038-T1A` (Red Andina sintético): el intake llama a un proveedor mock de normalización (I/O) y luego calcula features locales (CPU). Primero midimos wall vs CPU; si wall >> CPU en el tramo de red, usamos async/threads; si el tramo de features satura un core, movemos ese tramo a process pool. Datos inventados; sin credenciales ni red real; sin PII en logs del bench.",
      ],
      code: {
        language: 'python',
        title: "concurrency_pick.py",
        code: `def pick(bound):
    return {"io": "async_or_threads", "cpu": "processes", "mixed": "batch_then_io"}.get(bound, "measure")
print(pick("io"))
print(pick("cpu"))
print("measure_first", True)`,
        output: `async_or_threads
processes
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
        "El GIL de CPython limita el paralelismo de CPU multi-thread: varios hilos de Python puro casi no aceleran un cálculo denso. Los procesos evitan el GIL, pero pagan serialización e IPC (pickle/json). Si el payload entre procesos es grande, el pool puede ser más lento que un solo proceso bien vectorizado.",
        "Contrato operativo. Entrada: payload del caso (case_id, score, features compactas) y decisión de modelo de concurrencia. Salida: tamaño en bytes del payload y preferencia `compact_payload`. Error: copiar DataFrames enteros entre procesos o loguear el blob crudo con PII. Criterio: el costo de serialización está medido y el payload entre workers es el mínimo necesario para el paso.",
        "Aplicación a `CASO-LIM-038-T1B`: en lugar de enviar el registro completo del cliente sintético al worker, enviamos `{case_id, score, feature_ids}`. json.dumps del dict compacto cabe en decenas de bytes; el GIL sigue limitando threads CPU, así que el scoring denso va a processes solo si el payload compacto justifica el IPC.",
      ],
      code: {
        language: 'python',
        title: "gil_ser.py",
        code: `import json

def payload_bytes(payload: dict) -> int:
    return len(json.dumps(payload).encode())

payload = {"case_id": "c1", "score": 0.2}
print("bytes", payload_bytes(payload))
print("gil_cpu_threads", "limited")
print("prefer", "compact_payload")`,
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
      heading: "pools, backpressure y rate limits",
      subtopicId: "S38-T2-A",
      paragraphs: [
        "Un pool acota la concurrencia máxima (N workers). Una cola con `maxsize` aplica backpressure: el productor se bloquea o rechaza cuando la cola está llena, en lugar de crecer hasta OOM. Un rate limit (token bucket didáctico) protege al proveedor mock de un ban o de saturación.",
        "Contrato operativo. Entrada: tasa permitida R, profundidad máxima de cola Q, ráfaga de casos sintéticos. Salida: secuencia de allow/deny y señal de backpressure. Error: cola infinita, o ignorar 429 del proveedor. Criterio: bajo pico sintético, la memoria se mantiene acotada y el proveedor no recibe más de R tokens por ventana.",
        "Aplicación a `CASO-LIM-038-T2A`: el batch de Lima (ficticio) intenta encolar 1000 casos; con maxsize=50 y bucket de 2 tokens, los productores esperan y el tercer allow inmediato es False. Esto evita tumbar el worker de scoring y el mock API. No hay PII real; solo case_id sintéticos.",
      ],
      code: {
        language: 'python',
        title: "rate_limit.py",
        code: `class TokenBucket:
    def __init__(self, rate):
        self.tokens = rate
        self.rate = rate
    def allow(self):
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
b = TokenBucket(2)
print([b.allow() for _ in range(3)])
print("backpressure", "queue_maxsize")
print("ok", True)`,
        output: `[True, True, False]
backpressure queue_maxsize
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
      heading: "cancelación, timeout y recursos",
      subtopicId: "S38-T2-B",
      paragraphs: [
        "Sin timeout, un proveedor lento puede colgar un worker indefinidamente y tumbar el SLA del batch. La política didáctica define segundos de espera y on_fail (`retry_or_dlq`). La cancelación libera la tarea colgada; el `finally` o context manager cierra conexiones y archivos aunque falle el fetch.",
        "Contrato operativo. Entrada: función de fetch mock, timeout_s y política on_fail. Salida: dict de política y flag de cierre de recurso. Error: olvidar close, o retry infinito sin tope. Criterio: toda I/O externa del triage tiene timeout y camino de fallo explícito hacia retry o DLQ.",
        "Aplicación a `CASO-LIM-038-T2B`: el mock de geocoding tarda más que el budget; la política marca timeout y enruta a DLQ tras N reintentos. El socket sintético se cierra en finally. Incidente clásico documentado en runbook: «sin timeout → cola bloqueada → p95 explotado».",
      ],
      code: {
        language: 'python',
        title: "timeout.py",
        code: `def fetch_with_timeout(fn, timeout_s=0.01):
    # didáctico: no lanza threads; simula política
    return {"policy": "timeout", "seconds": timeout_s, "on_fail": "retry_or_dlq"}
print(fetch_with_timeout(lambda: None))
print("close_in_finally", True)
print("ok", True)`,
        output: `{'policy': 'timeout', 'seconds': 0.01, 'on_fail': 'retry_or_dlq'}
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
      heading: "logs, metrics y traces",
      subtopicId: "S38-T3-A",
      paragraphs: [
        "Los tres pilares de observabilidad: logs (eventos discretos), metrics (agregados: cola, latencia, errores) y traces (spans por caso a lo largo de intake→score→queue). correlation_id / corr une el camino sin volcar el payload completo del cliente.",
        "Contrato operativo. Entrada: evento de scoring con case_id sintético, score y corr. Salida: línea de log estructurado + métrica nombrada + pii_raw=False. Error: loguear email/teléfono en claro, o métricas sin dimensiones útiles. Criterio: un on-call puede reconstruir el path de un caso con corr sin abrir PII.",
        "Aplicación a `CASO-LIM-038-T3A`: al marcar `scored` emitimos `{level:INFO, case_id, event, score, corr}` y la métrica `queue_depth`. Nivel DEBUG solo en sandbox. No usamos OpenTelemetry real en el ejercicio; modelamos el contrato con dicts locales.",
      ],
      code: {
        language: 'python',
        title: "observability.py",
        code: `def scored_event(case_id: str, score: float, corr: str) -> dict:
    return {
        "level": "INFO",
        "case_id": case_id,
        "event": "scored",
        "score": score,
        "corr": corr,
        "pii_raw": False,
    }

event = scored_event("c-synth-1", 0.4, "corr-9")
print(event["event"], event["corr"])
print("metric", "queue_depth")
print("pii_raw", event["pii_raw"])`,
        output: `scored corr-9
metric queue_depth
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
      heading: "correlation, redacción y SLI/SLO",
      subtopicId: "S38-T3-B",
      paragraphs: [
        "Redactar PII en logs es obligatorio: un email sintético `ana@example.pe` se muestra como `an***`. Los SLI miden realidad (p95 de score_ms, error_rate); el SLO es el objetivo acordado con el dueño del servicio. El error budget se consume cuando se viola el SLO.",
        "Contrato operativo. Entrada: SLI observados y umbrales SLO. Salida: slo_ok booleano y valor redactado. Error: comparar al revés (celebrar latencia peor que el límite) o guardar PII completa «por si acaso». Criterio: dashboards y alertas se basan en SLI; el runbook dice qué hacer cuando el error budget se agota.",
        "Aplicación a `CASO-LIM-038-T3B`: p95=120ms vs SLO 200ms y error_rate=0.01 vs 0.02 → slo_ok True. Si p95 sube a 400ms, se abre incidente y se pausan deploys no urgentes según política de error budget. Solo datos sintéticos.",
      ],
      code: {
        language: 'python',
        title: "slo.py",
        code: `def redact(s):
    return s[:2] + "***" if len(s) > 2 else "***"
sli = {"p95_ms": 120, "error_rate": 0.01}
slo = {"p95_ms": 200, "error_rate": 0.02}
print("redacted", redact("ana@example.pe"))
print("slo_ok", sli["p95_ms"] <= slo["p95_ms"] and sli["error_rate"] <= slo["error_rate"])
print("corr_header", "X-Corr-Id")`,
        output: `redacted an***
slo_ok True
corr_header X-Corr-Id`,
      },
      callout: {
        type: "warning",
        title: "PII en logs",
        content:
          "Redacta siempre. correlation_id sí; teléfono/email en claro no. El header X-Corr-Id une requests sin exponer identidad.",
      },
    },
    {
      heading: "states, checkpoint e idempotencia",
      subtopicId: "S38-T4-A",
      paragraphs: [
        "Un workflow de triage avanza por estados: pending → running → done | failed. Tras cada paso caro (features, score) se escribe un checkpoint. La idempotency key (`case:step:ver`) garantiza que reejecutar el mismo paso no duplica side effects (doble enqueue, doble notificación mock).",
        "Contrato operativo. Entrada: state dict del caso y clave de idempotencia. Salida: checkpoint con step/status y resume_from. Error: reintentar sin key y crear dos tickets de review. Criterio: tras matar el worker a mitad de batch, el resume continúa desde el último checkpoint bueno sin rehacer pasos done.",
        "Aplicación a `CASO-LIM-038-T4A`: caso c1 completó features; al reiniciar, resume_from=features (o el siguiente paso pendiente según diseño). La key `c1:features:v3` evita recalcular y reescribir dos veces. Sin secretos ni PII real en el store de checkpoint.",
      ],
      code: {
        language: 'python',
        title: "checkpoint.py",
        code: `def make_checkpoint(case: str, step: str, ver: str) -> dict:
    return {
        "state": {"case": case, "step": step, "status": "done"},
        "idem_key": f"{case}:{step}:{ver}",
        "resume_from": step,
    }

cp = make_checkpoint("c1", "features", "v3")
print("checkpoint", cp["state"])
print("idem_key", cp["idem_key"])
print("resume_from", cp["resume_from"])`,
        output: `checkpoint {'case': 'c1', 'step': 'features', 'status': 'done'}
idem_key c1:features:v3
resume_from features`,
      },
      callout: {
        type: "tip",
        title: "Idempotency-Key",
        content:
          "Úsala en APIs y jobs. Formato estable case:step:ver. Reejecutar debe ser seguro por diseño, no por suerte.",
      },
    },
    {
      heading: "retry, dead-letter, replay y runbook",
      subtopicId: "S38-T4-B",
      paragraphs: [
        "Retry con backoff exponencial (y jitter en prod) absorbe fallos transitorios. La DLQ (dead-letter queue) aísla mensajes venenosos que fallan siempre. El replay es controlado: no se reinyecta la DLQ entera sin inspección. El runbook lista síntomas → checks → acciones para el on-call.",
        "Contrato operativo. Entrada: attempt number y base de backoff; mensaje marcado poison o retriable. Salida: serie de esperas, ruta dlq y flag runbook. Error: retry infinito, o borrar DLQ sin análisis. Criterio: el camino de fallo se prueba en sandbox antes de prod; el runbook existe y se actualiza tras cada incidente sintético de drill.",
        "Aplicación a `CASO-LIM-038-T4B`: attempts 0..3 con base 0.1 → [0.1, 0.2, 0.4, 0.8]. Un payload malformado va a DLQ como poison; el replay se hace caso a caso tras fix del parser. Drill de on-call: reiniciar worker, verificar checkpoint, rejugar batch acotado.",
      ],
      code: {
        language: 'python',
        title: "retry_dlq.py",
        code: `def backoff(attempt, base=0.1):
    return base * (2 ** attempt)
print([round(backoff(i), 3) for i in range(4)])
print("dlq", "poison_messages")
print("runbook", True)`,
        output: `[0.1, 0.2, 0.4, 0.8]
dlq poison_messages
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
    intro: "Te muestro 8 demos de concurrencia, control de carga, observabilidad y workflows reanudables sobre CASO-LIM-038 (sintético). Cada demo modela el contrato local sin red real ni PII.",
    steps: [
      {
        demoId: "S38-T1-A-DEMO",
        subtopicId: "S38-T1-A",
        environment: "local-python",
        description: "Demo: elección de concurrencia io vs cpu en el triage sintético.",
        code: {
          language: 'python',
          title: "s38_t1_a_demo.py",
          code: `def pick(bound: str) -> str:
    return {"io": "async_or_threads", "cpu": "processes", "mixed": "batch_then_io"}.get(
        bound, "measure"
    )

print(pick("io"))
print("cpu", pick("cpu"))
print("ok", pick("cpu") == "processes")`,
          output: `async_or_threads
cpu processes
ok True`,
        },
        why: "Hace observable la tabla de decisión bound→modelo sin lanzar pools reales; evidencia: elección documentada.",
      },
      {
        demoId: "S38-T1-B-DEMO",
        subtopicId: "S38-T1-B",
        environment: "local-python",
        description: "Demo: bytes del payload compacto y nota de GIL.",
        code: {
          language: 'python',
          title: "s38_t1_b_demo.py",
          code: `import json

def compact_bytes(payload: dict) -> int:
    return len(json.dumps(payload).encode())

print(compact_bytes({"a": 1}))
print("gil", "limited")
print("ok", compact_bytes({"a": 1}) < 64)`,
          output: `8
gil limited
ok True`,
        },
        why: "Muestra el costo de serialización del dict mínimo y recuerda que threads CPU están limitados por el GIL.",
      },
      {
        demoId: "S38-T2-A-DEMO",
        subtopicId: "S38-T2-A",
        environment: "local-python",
        description: "Demo: token bucket y maxsize como backpressure.",
        code: {
          language: 'python',
          title: "s38_t2_a_demo.py",
          code: `class TokenBucket:
    def __init__(self, rate: int):
        self.tokens = rate

    def allow(self) -> bool:
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False

b = TokenBucket(2)
print([b.allow() for _ in range(3)])
print("maxsize", 100)
print("ok", True)`,
          output: `[True, True, False]
maxsize 100
ok True`,
        },
        why: "Modela allow/deny y cola acotada sin red real; evidencia de control de carga.",
      },
      {
        demoId: "S38-T2-B-DEMO",
        subtopicId: "S38-T2-B",
        environment: "local-python",
        description: "Demo: política de timeout y cierre en finally.",
        code: {
          language: 'python',
          title: "s38_t2_b_demo.py",
          code: `def timeout_policy(seconds: float, on_fail: str = "dlq") -> dict:
    return {"seconds": seconds, "on_fail": on_fail, "close_in_finally": True}

pol = timeout_policy(1.0)
print({"seconds": pol["seconds"], "on_fail": pol["on_fail"]})
print("finally", pol["close_in_finally"])
print("ok", True)`,
          output: `{'seconds': 1, 'on_fail': 'dlq'}
finally True
ok True`,
        },
        why: "Fija el contrato de fallo de I/O: timeout, on_fail y liberación de recursos.",
      },
      {
        demoId: "S38-T3-A-DEMO",
        subtopicId: "S38-T3-A",
        environment: "local-python",
        description: "Demo: evento scored con corr y métrica sin PII.",
        code: {
          language: 'python',
          title: "s38_t3_a_demo.py",
          code: `def emit_scored(case_id: str, corr: str, score: float) -> dict:
    return {"event": "scored", "case_id": case_id, "corr": corr, "score": score, "pii_raw": False}

ev = emit_scored("c-synth-1", "corr-1", 0.4)
print(ev["event"], ev["corr"])
print("metric", "latency_ms")
print("pii_raw", ev["pii_raw"])`,
          output: `scored corr-1
metric latency_ms
pii_raw False`,
        },
        why: "Emite el mínimo de o11y del path de scoring con correlation id sintético.",
      },
      {
        demoId: "S38-T3-B-DEMO",
        subtopicId: "S38-T3-B",
        environment: "local-python",
        description: "Demo: SLO ok y valor redactado.",
        code: {
          language: 'python',
          title: "s38_t3_b_demo.py",
          code: `def redact(s: str) -> str:
    return s[:2] + "***" if len(s) > 2 else "***"

def slo_ok(p95_ms: float, budget_ms: float) -> bool:
    return p95_ms <= budget_ms

print(slo_ok(120, 200))
print("redacted", redact("ana@example.pe"))
print("ok", True)`,
          output: `True
redacted an***
ok True`,
        },
        why: "Comprueba umbral de latencia y redacción; el error budget se discute en teoría.",
      },
      {
        demoId: "S38-T4-A-DEMO",
        subtopicId: "S38-T4-A",
        environment: "local-python",
        description: "Demo: idempotency key y status done.",
        code: {
          language: 'python',
          title: "s38_t4_a_demo.py",
          code: `def idem_key(case: str, step: str, ver: str) -> str:
    return f"{case}:{step}:{ver}"

print(idem_key("c1", "score", "v1"))
print("status", "done")
print("ok", idem_key("c1", "score", "v1") == "c1:score:v1")`,
          output: `c1:score:v1
status done
ok True`,
        },
        why: "Muestra key estable y checkpoint done para reanudación segura.",
      },
      {
        demoId: "S38-T4-B-DEMO",
        subtopicId: "S38-T4-B",
        environment: "local-python",
        description: "Demo: serie de backoff y flags DLQ/runbook.",
        code: {
          language: 'python',
          title: "s38_t4_b_demo.py",
          code: `def backoff(attempt: int, base: float = 0.1) -> float:
    return base * (2 ** attempt)

print([round(backoff(i), 3) for i in range(3)])
print("dlq", True)
print("runbook", True)`,
          output: `[0.1, 0.2, 0.4]
dlq True
runbook True`,
        },
        why: "Hace observables retry, aislamiento de veneno y existencia de runbook.",
      },
    ],
  },
  weDo: {
    intro: "S38 · Laboratorio de operación resiliente del triage (24 retos). E1 repara un defecto del contrato, E2 fija la política válida/inválida y E3 transfiere el criterio a un incidente sintético. Fixtures CASO-LIM-038; sin PII real ni red.",
    steps: [
      {
        id: "S38-T1-A-E1",
        subtopicId: "S38-T1-A",
        kind: "guided",
        instruction: "S38-T1-A-E1 · CASO-LIM-038-1A: el path de features es CPU-bound (wall≈cpu en el profile sintético). Contrato: entrada bound='cpu'; salida exacta tres líneas con la elección de concurrencia para CPU, la etiqueta bound y ok. El starter elige mal 'async_or_threads'; corrige solo la decisión. Token: S38-T1-A PASS al final vía prints de la solución (processes / bound cpu / ok True).",
        hint: "Para CPU-bound en CPython prefiere processes por el GIL.",
        hints: [
          "Para CPU-bound en CPython prefiere processes por el GIL.",
          "No uses async para saturar CPU pura; mide bound antes de elegir.",
        ],
        edgeCases: ["bound mal etiquetado", "elegir async en CPU", "CASO-LIM-038-1A sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T1-A-E1.",
        feedback: "S38-T1-A-E1: explica por qué processes evita el GIL en features densas y por qué async no acelera CPU pura.",
        starterCode: {
          language: 'python',
          title: "s38-t1-a-e1.py",
          code: `# CASO-LIM-038-1A — defect: wrong concurrency for CPU-bound features
bound = "cpu"
choice = "async_or_threads"  # DEFECT: CPU-bound needs processes under GIL
print(choice)
print("bound", bound)
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-a-e1.py",
          code: `bound = "cpu"
choice = "processes"
print(choice)
print("bound", bound)
print("ok", True)
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
        instruction: "S38-T1-A-E2 · CASO-LIM-038-1A2: el tramo de normalización espera red mock (I/O-bound). Contrato: entrada bound='io'; imprime async_or_threads, bound io y ok True. El starter deja choice='processes' por error de copy-paste; corrige la elección. Fixture sintético sin red real. Token alineado a solution output.",
        hint: "I/O-bound: threads o async liberan espera de red.",
        hints: [
          "I/O-bound: threads o async liberan espera de red.",
          "processes añaden IPC innecesario si no hay CPU densa.",
        ],
        edgeCases: ["IPC innecesario", "sin medir bound", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T1-A-E2.",
        feedback: "S38-T1-A-E2: justifica async_or_threads cuando wall >> cpu en el tramo de red mock.",
        starterCode: {
          language: 'python',
          title: "s38-t1-a-e2.py",
          code: `# CASO-LIM-038-1A2 — defect: processes for pure I/O
bound = "io"
choice = "processes"  # DEFECT: pure I/O should use async_or_threads
print(choice)
print("bound", bound)
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-a-e2.py",
          code: `bound = "io"
choice = "async_or_threads"
print(choice)
print("bound", bound)
print("ok", True)
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
        instruction: "S38-T1-A-E3 · CASO-LIM-038-1A3 (transfer): antes de fijar arquitectura, el contrato exige measure_first=True. Entrada: flag de política; salida: True, ok True, n 1. El starter imprime False (defect: saltarse medición). Corrige para afirmar que se mide el bottleneck primero. Pass: solution output exacto.",
        hint: "measure_first es política de equipo, no opcional.",
        hints: [
          "measure_first es política de equipo, no opcional.",
          "Sin medir, la elección de pool es teatro.",
        ],
        edgeCases: ["moda async", "sin profile", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T1-A-E3.",
        feedback: "S38-T1-A-E3: sin medición no hay elección defendible de concurrencia.",
        starterCode: {
          language: 'python',
          title: "s38-t1-a-e3.py",
          code: `# CASO-LIM-038 · measure before model
# DEFECT: measure_first=False salta medición
# Contrato: corrige el DEFECT; salida alineada a solutionCode
measure_first = False  # DEFECT: must measure before picking model
print(measure_first)
print("ok", True)
print("n", 1)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-a-e3.py",
          code: `measure_first = True
print(measure_first)
print("ok", True)
print("n", 1)
`,
          output: `True
ok True
n 1`,
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
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T1-B-E1.",
        feedback: "S38-T1-B-E1: el costo de IPC se mide sobre el blob real que cruzará procesos.",
        starterCode: {
          language: 'python',
          title: "s38-t1-b-e1.py",
          code: `# CASO-LIM-038 · json size metric
# DEFECT: usa len(str) en vez de json.dumps encode
# Contrato: corrige el DEFECT; salida alineada a solutionCode
import json
payload = {"x": 2}
# defect: wrong serialization metric
print(len(str(payload)))  # DEFECT: use json.dumps(payload).encode()
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
        instruction: "S38-T1-B-E2 · Documenta el efecto del GIL en threads CPU: imprime 'limited', ok True, cpu_threads True. Contrato de etiqueta operativa para el runbook de Red Andina sintética. El starter imprime 'unlimited' (defect). No lances threads reales; solo el contrato textual alineado a la demo.",
        hint: "GIL limita paralelismo CPU en threads Python puros.",
        hints: [
          "GIL limita paralelismo CPU en threads Python puros.",
          "Para CPU densa documenta limited y evalúa processes.",
        ],
        edgeCases: ["confundir I/O con CPU", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T1-B-E2.",
        feedback: "S38-T1-B-E2: la etiqueta limited evita falsas expectativas de speedup multi-thread.",
        starterCode: {
          language: 'python',
          title: "s38-t1-b-e2.py",
          code: `# CASO-LIM-038 · GIL CPU threads
# DEFECT: imprime unlimited en vez de límite GIL
# Contrato: corrige el DEFECT; salida alineada a solutionCode
print("unlimited")  # DEFECT: CPython GIL limits CPU multi-thread
print("ok", True)
print("cpu_threads", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-b-e2.py",
          code: `print("limited")
print("ok", True)
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
        instruction: "S38-T1-B-E3 · Política de payload entre workers: imprime preferencia compact_payload, ok True, n 1. El starter prefiere full_record (defect: arrastra PII y bytes de más). Corrige la preferencia del contrato de IPC del triage sintético CASO-LIM-038.",
        hint: "Solo case_id, score y feature_ids cruzan el IPC.",
        hints: [
          "Solo case_id, score y feature_ids cruzan el IPC.",
          "full_record infla serialización y riesgo de PII en logs de cola.",
        ],
        edgeCases: ["PII en queue", "pickle enorme", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T1-B-E3.",
        feedback: "S38-T1-B-E3: compact_payload es privacidad y performance a la vez.",
        starterCode: {
          language: 'python',
          title: "s38-t1-b-e3.py",
          code: `# CASO-LIM-038 · IPC compact payload
# DEFECT: envía full_record en vez de compact
# Contrato: corrige el DEFECT; salida alineada a solutionCode
print("full_record")  # DEFECT: prefer compact_payload
print("ok", True)
print("n", 1)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t1-b-e3.py",
          code: `print("compact_payload")
print("ok", True)
print("n", 1)
`,
          output: `compact_payload
ok True
n 1`,
        },
      },
      {
        id: "S38-T2-A-E1",
        subtopicId: "S38-T2-A",
        kind: "guided",
        instruction: "S38-T2-A-E1 · Token bucket rate=2: cuenta cuántos allow() True en 3 intentos. Contrato: print 2, third False, ok True. Starter usa rate=3 (defect) o cuenta mal. Implementa el bucket mínimo del fixture CASO-LIM-038-2A. Pass: solution output.",
        hint: "rate=2 ⇒ dos True y el tercero False.",
        hints: [
          "rate=2 ⇒ dos True y el tercero False.",
          "No rellenes tokens entre llamadas en este fixture estático.",
        ],
        edgeCases: ["burst sin límite", "ban del API mock", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T2-A-E1.",
        feedback: "S38-T2-A-E1: el bucket acota la ráfaga visible al proveedor.",
        starterCode: {
          language: 'python',
          title: "s38-t2-a-e1.py",
          code: `# CASO-LIM-038 · token bucket rate
# DEFECT: rate=3 en vez de 2 del fixture
# Contrato: corrige el DEFECT; salida alineada a solutionCode
class TokenBucket:
    def __init__(self, rate):
        self.tokens = rate
    def allow(self):
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
b = TokenBucket(3)  # DEFECT: rate must be 2 for fixture
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
        instruction: "S38-T2-A-E2 · Rol de queue maxsize=50: imprime 'backpressure', ok True, maxsize 50. Contrato: la cola acotada es la política de backpressure del worker de scoring. Starter imprime 'buffer_infinite' y maxsize 0 (defect). Corrige etiquetas del runbook sintético.",
        hint: "maxsize finito = backpressure.",
        hints: [
          "maxsize finito = backpressure.",
          "Cola infinita ⇒ OOM bajo pico.",
        ],
        edgeCases: ["OOM", "productor sin bloqueo", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T2-A-E2.",
        feedback: "S38-T2-A-E2: backpressure protege memoria y estabilidad del batch.",
        starterCode: {
          language: 'python',
          title: "s38-t2-a-e2.py",
          code: `# CASO-LIM-038 · backpressure por maxsize
# DEFECT: reporta cola ilimitada (sin backpressure)
print("unbounded_queue")
print("ok", True)
print("maxsize", None)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-a-e2.py",
          code: `print("backpressure")
print("ok", True)
print("maxsize", 50)
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
        instruction: "S38-T2-A-E3 · ¿A quién protege el rate limit? Imprime 'provider', ok True, ban_risk True. El starter dice 'only_cpu' (defect). El contrato de transferencia: rate limit defiende al proveedor mock y reduce ban_risk en el path de triage CASO-LIM-038.",
        hint: "Sin rate limit el mock/API puede banear la IP del batch.",
        hints: [
          "Sin rate limit el mock/API puede banear la IP del batch.",
          "ban_risk True documenta el peligro operativo.",
        ],
        edgeCases: ["429 storm", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T2-A-E3.",
        feedback: "S38-T2-A-E3: rate limit es cortesía y supervivencia ante el proveedor.",
        starterCode: {
          language: 'python',
          title: "s38-t2-a-e3.py",
          code: `# CASO-LIM-038 · rate limit protege al proveedor
# DEFECT: ignora ban_risk del proveedor mock
print("flood")
print("ok", True)
print("ban_risk", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-a-e3.py",
          code: `print("provider")
print("ok", True)
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
        instruction: "S38-T2-B-E1 · Política de timeout: imprime seconds=5, on_fail='retry_or_dlq', ok True. Fixture CASO-LIM-038-2B. Starter usa seconds=0 y on_fail='ignore' (defect). Ajusta el contrato de fetch mock sin lanzar threads reales.",
        hint: "seconds>0 evita hang infinito.",
        hints: [
          "seconds>0 evita hang infinito.",
          "on_fail debe ser retry_or_dlq, no ignore.",
        ],
        edgeCases: ["hang", "retry infinito", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T2-B-E1.",
        feedback: "S38-T2-B-E1: timeout + on_fail es el mínimo viable de I/O externa.",
        starterCode: {
          language: 'python',
          title: "s38-t2-b-e1.py",
          code: `# CASO-LIM-038 · retry/DLQ policy
# DEFECT: seconds=0 on_fail=ignore
# Contrato: corrige el DEFECT; salida alineada a solutionCode
policy = {"seconds": 0, "on_fail": "ignore"}  # DEFECT: need seconds=5 + retry_or_dlq
print(policy["seconds"])
print("on_fail", policy["on_fail"])
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-b-e1.py",
          code: `policy = {"seconds": 5, "on_fail": "retry_or_dlq"}
print(policy["seconds"])
print("on_fail", policy["on_fail"])
print("ok", True)
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
        instruction: "S38-T2-B-E2 · Cierre de recurso en finally: imprime True (close_in_finally), resource 'conn', ok True. Starter deja False (defect: leak). No abras sockets reales; modela el flag del contrato de limpieza del worker sintético.",
        hint: "finally/context manager cierra aunque falle el fetch.",
        hints: [
          "finally/context manager cierra aunque falle el fetch.",
          "Leak de conn tumba el pool bajo carga.",
        ],
        edgeCases: ["resource leak", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T2-B-E2.",
        feedback: "S38-T2-B-E2: sin close determinista el pool se agota.",
        starterCode: {
          language: 'python',
          title: "s38-t2-b-e2.py",
          code: `# CASO-LIM-038 · cierre de recursos
close_in_finally = False  # DEFECT: no cierra en finally
print(close_in_finally)
print("resource", "conn")
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-b-e2.py",
          code: `close_in_finally = True
print(close_in_finally)
print("resource", "conn")
print("ok", True)
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
        instruction: "S38-T2-B-E3 · Transferencia: sin timeout el incidente es real. Imprime incident True, ok True, n 1. Starter niega el incidente (False). Corrige para reconocer el riesgo operativo documentado en el runbook de CASO-LIM-038.",
        hint: "Hang sin timeout = incidente de cola bloqueada.",
        hints: [
          "Hang sin timeout = incidente de cola bloqueada.",
          "El runbook debe listar este síntoma.",
        ],
        edgeCases: ["p95 explotado", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T2-B-E3.",
        feedback: "S38-T2-B-E3: nombrar el incidente es el primer paso del runbook.",
        starterCode: {
          language: 'python',
          title: "s38-t2-b-e3.py",
          code: `# CASO-LIM-038 · timeout debe generar incidente operable
# DEFECT: no registra incidente
print("incident", False)
print("ok", True)
print("n", 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t2-b-e3.py",
          code: `print("incident", True)
print("ok", True)
print("n", 1)
`,
          output: `incident True
ok True
n 1`,
        },
      },
      {
        id: "S38-T3-A-E1",
        subtopicId: "S38-T3-A",
        kind: "guided",
        instruction: "S38-T3-A-E1 · Evento scored con correlation id: imprime True (corr presente), event 'scored', ok True. Fixture dict con corr='corr-1'. Starter omite corr (defect → False). Asegura que el path intake→score lleva corr sintético sin PII.",
        hint: "corr debe ser truthy string.",
        hints: [
          "corr debe ser truthy string.",
          "Sin corr no hay reconstrucción del path.",
        ],
        edgeCases: ["log sin corr", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T3-A-E1.",
        feedback: "S38-T3-A-E1: correlation_id une spans del caso.",
        starterCode: {
          language: 'python',
          title: "s38-t3-a-e1.py",
          code: `# CASO-LIM-038 · trace correlation id
# DEFECT: corr=None en evento scored
# Contrato: corrige el DEFECT; salida alineada a solutionCode
event = {"event": "scored", "corr": None}  # DEFECT: corr required for traces
print(bool(event.get("corr")))
print("event", event["event"])
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-a-e1.py",
          code: `event = {"event": "scored", "corr": "corr-1"}
print(bool(event.get("corr")))
print("event", event["event"])
print("ok", True)
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
        instruction: "S38-T3-A-E2 · Tres pilares de o11y: imprime la lista ['logs','metrics','traces'], ok True, n 3. Starter lista solo ['logs'] (defect). Completa el contrato pedagógico de observabilidad del triage.",
        hint: "Logs eventos, metrics agregados, traces spans.",
        hints: [
          "Logs eventos, metrics agregados, traces spans.",
          "Los tres son necesarios en operación.",
        ],
        edgeCases: ["solo logs", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T3-A-E2.",
        feedback: "S38-T3-A-E2: un solo pilar no basta para diagnosticar cola + latencia + caso.",
        starterCode: {
          language: 'python',
          title: "s38-t3-a-e2.py",
          code: `# CASO-LIM-038 · tres pilares de observabilidad
# DEFECT: solo logs (omiso metrics/traces)
pillars = ["logs"]
print(pillars)
print("ok", True)
print("n", len(pillars))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-a-e2.py",
          code: `pillars = ["logs", "metrics", "traces"]
print(pillars)
print("ok", True)
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
        instruction: "S38-T3-A-E3 · pii_raw debe ser False en logs de prod sintéticos. Imprime False, ok True, redact True. Starter imprime True (defect: permite PII). Contrato de privacidad del pipeline CP-N3-C operación.",
        hint: "Nunca pii_raw True en logs de operación.",
        hints: [
          "Nunca pii_raw True en logs de operación.",
          "Redacta email/teléfono; conserva case_id sintético.",
        ],
        edgeCases: ["PII en log aggregate", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T3-A-E3.",
        feedback: "S38-T3-A-E3: privacidad es parte del contrato de o11y, no un extra.",
        starterCode: {
          language: 'python',
          title: "s38-t3-a-e3.py",
          code: `# CASO-LIM-038 · pii_raw prohibido en logs
pii_raw = True  # DEFECT: permite PII cruda
print(pii_raw)
print("ok", True)
print("redact", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-a-e3.py",
          code: `pii_raw = False
print(pii_raw)
print("ok", True)
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
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T3-B-E1.",
        feedback: "S38-T3-B-E1: redacción es mecánica y revisable en code review.",
        starterCode: {
          language: 'python',
          title: "s38-t3-b-e1.py",
          code: `# CASO-LIM-038 · PII redaction logs
# DEFECT: imprime teléfono crudo
# Contrato: corrige el DEFECT; salida alineada a solutionCode
phone = "90000001"
# defect: raw phone in log
print(phone)  # DEFECT: redact to 90****01
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
        instruction: "S38-T3-B-E2 · SLI p95=100 vs SLO limit=200: imprime True (slo_ok), p95 100, limit 200. Starter compara al revés (p95 >= limit) (defect). Corrige el predicado del error budget sintético CASO-LIM-038-3B.",
        hint: "slo_ok cuando observado <= objetivo de latencia.",
        hints: [
          "slo_ok cuando observado <= objetivo de latencia.",
          "Comparación invertida enciende alertas falsas o las apaga.",
        ],
        edgeCases: ["error_rate también en SLO real", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T3-B-E2.",
        feedback: "S38-T3-B-E2: el signo de la comparación es el bug más caro en alertas.",
        starterCode: {
          language: 'python',
          title: "s38-t3-b-e2.py",
          code: `# CASO-LIM-038 · SLO p95 vs limit
p95, limit = 100, 200
slo_ok = p95 > limit  # DEFECT: comparación invertida
print(slo_ok)
print("p95", p95)
print("limit", limit)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-b-e2.py",
          code: `p95, limit = 100, 200
slo_ok = p95 <= limit
print(slo_ok)
print("p95", p95)
print("limit", limit)
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
        instruction: "S38-T3-B-E3 · Concepto de error budget: imprime 'error_budget', ok True, n 1. Starter imprime 'infinite_sla' (defect). El contrato de transferencia nombra el mecanismo que se consume al violar el SLO en el triage sintético.",
        hint: "Error budget cuantifica cuánto incumplimiento queda en el periodo.",
        hints: [
          "Error budget cuantifica cuánto incumplimiento queda en el periodo.",
          "Al agotarse, se prioriza estabilidad sobre features.",
        ],
        edgeCases: ["SLO sin consecuencia", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T3-B-E3.",
        feedback: "S38-T3-B-E3: sin error budget el SLO es eslogan.",
        starterCode: {
          language: 'python',
          title: "s38-t3-b-e3.py",
          code: `# CASO-LIM-038 · error budget como concepto operativo
# DEFECT: omite error_budget
print("uptime_only")
print("ok", True)
print("n", 0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t3-b-e3.py",
          code: `print("error_budget")
print("ok", True)
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
        instruction: "S38-T4-A-E1 · Estados del workflow: imprime ['pending','running','done','failed'], ok True, n 4. Starter omite 'failed' (defect). Completa la máquina de estados del batch reanudable CASO-LIM-038-4A.",
        hint: "failed es estado terminal de error, distinto de pending.",
        hints: [
          "failed es estado terminal de error, distinto de pending.",
          "Cuatro estados mínimos del workflow didáctico.",
        ],
        edgeCases: ["estado perdido tras crash", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T4-A-E1.",
        feedback: "S38-T4-A-E1: sin estado failed no hay ruta clara a DLQ/retry.",
        starterCode: {
          language: 'python',
          title: "s38-t4-a-e1.py",
          code: `# CASO-LIM-038 · estados del workflow
# DEFECT: estados incompletos (sin failed)
states = ["pending", "running", "done"]
print(states)
print("ok", True)
print("n", len(states))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-a-e1.py",
          code: `states = ["pending", "running", "done", "failed"]
print(states)
print("ok", True)
print("n", len(states))
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
        instruction: "S38-T4-A-E2 · Formato de idempotency key: imprime 'case:step:ver', ok True, dup False. Starter usa solo 'case' (defect: colisiones entre pasos). Fija el contrato de key del checkpoint sintético.",
        hint: "Incluye step y versión de lógica para evitar colisiones.",
        hints: [
          "Incluye step y versión de lógica para evitar colisiones.",
          "dup False = reejecutar no duplica side effects.",
        ],
        edgeCases: ["doble enqueue", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T4-A-E2.",
        feedback: "S38-T4-A-E2: la key estable es la base de la idempotencia.",
        starterCode: {
          language: 'python',
          title: "s38-t4-a-e2.py",
          code: `# CASO-LIM-038 · idempotency key case:step:ver
# DEFECT: key sin versión (riesgo de dup side effects)
print("case:step")
print("ok", True)
print("dup", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-a-e2.py",
          code: `print("case:step:ver")
print("ok", True)
print("dup", False)
`,
          output: `case:step:ver
ok True
dup False`,
        },
      },
      {
        id: "S38-T4-A-E3",
        subtopicId: "S38-T4-A",
        kind: "transfer",
        instruction: "S38-T4-A-E3 · Resume desde último checkpoint: imprime 'features', ok True, checkpoint True. Fixture state step=features done. Starter resume desde 'intake' (defect: rehace trabajo). Corrige resume_from del worker sintético.",
        hint: "resume_from = último step checkpointed.",
        hints: [
          "resume_from = último step checkpointed.",
          "No vuelvas a intake si features ya está done.",
        ],
        edgeCases: ["doble side effect", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T4-A-E3.",
        feedback: "S38-T4-A-E3: reanudar mal es tan malo como no reanudar.",
        starterCode: {
          language: 'python',
          title: "s38-t4-a-e3.py",
          code: `# CASO-LIM-038 · checkpoint resume step
# DEFECT: hardcode intake en vez de state step
# Contrato: corrige el DEFECT; salida alineada a solutionCode
state = {"step": "features", "status": "done"}
print("intake")  # DEFECT: resume from state['step']
print("ok", True)
print("checkpoint", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-a-e3.py",
          code: `state = {"step": "features", "status": "done"}
print(state["step"])
print("ok", True)
print("checkpoint", True)
`,
          output: `features
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
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T4-B-E1.",
        feedback: "S38-T4-B-E1: backoff exponencial reduce presión sobre el proveedor.",
        starterCode: {
          language: 'python',
          title: "s38-t4-b-e1.py",
          code: `# CASO-LIM-038 · exponential backoff
# DEFECT: base*attempt lineal en vez de 2**attempt
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def backoff(attempt, base=0.1):
    return base * attempt  # DEFECT: exponential base * 2**attempt
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
        instruction: "S38-T4-B-E2 · Propósito de la DLQ: imprime 'poison', ok True, replay 'controlled'. Starter dice 'delete_always' (defect). Contrato: DLQ aísla veneno; replay es controlado tras inspección humana sintética.",
        hint: "DLQ = mensajes que fallan de forma no transitoria.",
        hints: [
          "DLQ = mensajes que fallan de forma no transitoria.",
          "Replay ciego reinyecta el veneno.",
        ],
        edgeCases: ["loop de fallo", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T4-B-E2.",
        feedback: "S38-T4-B-E2: poison + replay controlado es higiene de cola.",
        starterCode: {
          language: 'python',
          title: "s38-t4-b-e2.py",
          code: `# CASO-LIM-038 · poison message a DLQ
# DEFECT: reintenta poison en bucle sin DLQ
print("retry_forever")
print("ok", True)
print("replay", "uncontrolled")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-b-e2.py",
          code: `print("poison")
print("ok", True)
print("replay", "controlled")
`,
          output: `poison
ok True
replay controlled`,
        },
      },
      {
        id: "S38-T4-B-E3",
        subtopicId: "S38-T4-B",
        kind: "transfer",
        instruction: "S38-T4-B-E3 · Runbook de on-call existe: imprime True, oncall True, ok True. Starter imprime False (defect: operar sin runbook). Transferencia: el drill sintético exige runbook documentado antes de prod.",
        hint: "Runbook: síntomas → checks → acciones.",
        hints: [
          "Runbook: síntomas → checks → acciones.",
          "Sin runbook el on-call improvisa bajo presión.",
        ],
        edgeCases: ["incidente sin playbook", "sintético"],
        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T4-B-E3.",
        feedback: "S38-T4-B-E3: el runbook es entregable de operación, no un wiki opcional.",
        starterCode: {
          language: 'python',
          title: "s38-t4-b-e3.py",
          code: `# CASO-LIM-038 · runbook on-call existe
# DEFECT: sin runbook
print(False)
print("oncall", False)
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s38-t4-b-e3.py",
          code: `print(True)
print("oncall", True)
print("ok", True)
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
      "Construye un mini-worker sintético con pool/backpressure, logs redactados, checkpoint idempotente, retry/DLQ y runbook de proveedor lento. Id performance-extreme conservado. Solo datos CASO-LIM-038; sin PII real ni servicios externos.",
    objectives: [
      "Concurrencia adecuada al bound medido",
      "Timeouts y backpressure acotados",
      "O11y + SLI/SLO con redacción",
      "Checkpoint, idempotencia, retry y runbook",
    ],
    requirements: [
      "Trace por case_id y correlation_id",
      "Sin PII raw en logs",
      "Runbook de fallos (lento / caído / reejecución)",
      "Documentación es-PE",
      "Mismo resultado tras resume controlado",
    ],
    starterCode: `# workflow resiliente CASO-LIM-038
state = {'case_id': 'c1', 'step': 'intake', 'status': 'pending'}

def checkpoint(state, step):
    state = dict(state); state['step']=step; state['status']='done'; return state

if __name__ == '__main__':
    print(checkpoint(state, 'features'))
`,
    portfolioNote:
      "Operación CP-N3-C; evidencia de pipeline reanudable. No es PASS automático de carrera.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
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
