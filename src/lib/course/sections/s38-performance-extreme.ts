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
    "Operación del triage CP-N3-C: concurrencia correcta, **observabilidad** y workflows con checkpoint/idempotencia. Id `performance-extreme` conservado. Logs sin PII real.",
  learningOutcomes: [
    { text: "Elegir threads/processes/async" },
    { text: "Razonar I/O vs CPU y serialización" },
    { text: "Aplicar pools y backpressure" },
    { text: "Cancelar, timeout y liberar recursos" },
    { text: "Emitir logs/metrics/traces" },
    { text: "Correlacionar, redactar y definir SLI/SLO" },
    { text: "Checkpoint e idempotencia de workflows" },
    { text: "Operar retry/DLQ/replay con runbook" },
  ],
  theory: [
    {
      heading: "Operación del triage (CP-N3-C)",
      paragraphs: [
        "El pipeline debe reanudarse, trazar casos y sobrevivir a proveedores lentos.",
        "Legacy Numba/Cython extreme se retematiza a concurrencia+resiliencia V3.",
        "T1 Concurrencia → T2 Control → T3 Observabilidad → T4 Resiliencia.",
      ],
      callout: {
        type: "info",
        title: "Retarget",
        content:
          "Pipeline reanudable con trace.",
      },
    },
    {
      heading: "threads/processes/async",
      subtopicId: "S38-T1-A",
      paragraphs: [
        "Threads: I/O concurrente. Processes: CPU paralelo. Async: muchos I/O en un hilo.",
        "Elige según bottleneck del triage (API, DB, CPU de features).",
        "Didáctica: modelo de decisión por tipo de carga.",
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
          "No elijas async por moda.",
      },
    },
    {
      heading: "I/O vs CPU, GIL y serialización",
      subtopicId: "S38-T1-B",
      paragraphs: [
        "GIL limita CPU multi-thread en CPython. Processes evitan GIL con costo de IPC.",
        "Serialización (pickle/json) puede dominar el tiempo.",
        "Pasa payloads compactos entre procesos.",
      ],
      code: {
        language: 'python',
        title: "gil_ser.py",
        code: `import json
payload = {"case_id": "c1", "score": 0.2}
blob = json.dumps(payload)
print("bytes", len(blob.encode()))
print("gil_cpu_threads", "limited")
print("prefer", "compact_payload")`,
        output: `bytes 31
gil_cpu_threads limited
prefer compact_payload`,
      },
      callout: {
        type: "warning",
        title: "IPC cost",
        content:
          "A veces el pool es más lento.",
      },
    },
    {
      heading: "pools, backpressure y rate limits",
      subtopicId: "S38-T2-A",
      paragraphs: [
        "Pool acota concurrencia. Queue maxsize = backpressure. Rate limit protege proveedores.",
        "Sin backpressure, OOM o ban del API.",
        "Token bucket didáctico.",
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
        title: "maxsize",
        content:
          "Producer bloquea cuando la cola llena.",
      },
    },
    {
      heading: "cancelación, timeout y recursos",
      subtopicId: "S38-T2-B",
      paragraphs: [
        "Timeouts en I/O; cancela tareas colgadas; finally cierra recursos.",
        "Sin timeout, un proveedor lento tumba el batch.",
        "Context managers > forget close.",
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
          "Incidente clásico.",
      },
    },
    {
      heading: "logs, metrics y traces",
      subtopicId: "S38-T3-A",
      paragraphs: [
        "Logs eventos, metrics agregados, traces spans por caso.",
        "correlation_id en todo el path intake→score→queue.",
        "Nivel INFO en prod; DEBUG acotado.",
      ],
      code: {
        language: 'python',
        title: "observability.py",
        code: `event = {"level": "INFO", "case_id": "c-synth-1", "event": "scored", "score": 0.4, "corr": "corr-9"}
print(event["event"], event["corr"])
print("metric", "queue_depth")
print("pii_raw", False)`,
        output: `scored corr-9
metric queue_depth
pii_raw False`,
      },
      callout: {
        type: "tip",
        title: "Tres pilares",
        content:
          "Logs+metrics+traces.",
      },
    },
    {
      heading: "correlation, redacción y SLI/SLO",
      subtopicId: "S38-T3-B",
      paragraphs: [
        "Redacta PII en logs. SLI: latencia p95 score, tasa error. SLO: objetivo acordado.",
        "Error budget consume cuando se viola SLO.",
        "Correlación permite reconstruir un caso sin PII completa.",
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
          "Redacta siempre.",
      },
    },
    {
      heading: "states, checkpoint e idempotencia",
      subtopicId: "S38-T4-A",
      paragraphs: [
        "Workflow states: pending→running→done/failed. Checkpoint tras pasos caros.",
        "Idempotencia: reejecutar no duplica side effects (usa keys).",
        "Reanudación desde último checkpoint bueno.",
      ],
      code: {
        language: 'python',
        title: "checkpoint.py",
        code: `state = {"case": "c1", "step": "features", "status": "done"}
idem_key = "c1:features:v3"
print("checkpoint", state)
print("idem_key", idem_key)
print("resume_from", state["step"])`,
        output: `checkpoint {'case': 'c1', 'step': 'features', 'status': 'done'}
idem_key c1:features:v3
resume_from features`,
      },
      callout: {
        type: "tip",
        title: "Idempotency-Key",
        content:
          "En APIs y jobs.",
      },
    },
    {
      heading: "retry, dead-letter, replay y runbook",
      subtopicId: "S38-T4-B",
      paragraphs: [
        "Retry con backoff + jitter; DLQ para veneno; replay controlado.",
        "Runbook: síntomas → checks → acciones (restart worker, replay batch).",
        "Prueba el camino de fallo antes de prod.",
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
        title: "Runbook",
        content:
          "Documento vivo del on-call.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro concurrencia, control de carga, observabilidad y workflows reanudables.",
    steps: [
      {
        demoId: "S38-T1-A-DEMO",
        subtopicId: "S38-T1-A",
        environment: "local-python",
        description: "Pick concurrency for io.",
        code: {
          language: 'python',
          title: "c_demo.py",
          code: `print('async_or_threads')
print('cpu', 'processes')
print('ok', True)`,
          output: `async_or_threads
cpu processes
ok True`,
        },
        why: "Elección.",
      },
      {
        demoId: "S38-T1-B-DEMO",
        subtopicId: "S38-T1-B",
        environment: "local-python",
        description: "Payload bytes.",
        code: {
          language: 'python',
          title: "g_demo.py",
          code: `import json; print(len(json.dumps({'a':1}).encode()))
print('gil', 'limited')
print('ok', True)`,
          output: `8
gil limited
ok True`,
        },
        why: "Serialización.",
      },
      {
        demoId: "S38-T2-A-DEMO",
        subtopicId: "S38-T2-A",
        environment: "local-python",
        description: "Token bucket allows.",
        code: {
          language: 'python',
          title: "r_demo.py",
          code: `print([True, True, False])
print('maxsize', 100)
print('ok', True)`,
          output: `[True, True, False]
maxsize 100
ok True`,
        },
        why: "Rate limit.",
      },
      {
        demoId: "S38-T2-B-DEMO",
        subtopicId: "S38-T2-B",
        environment: "local-python",
        description: "Timeout policy dict.",
        code: {
          language: 'python',
          title: "t_demo.py",
          code: `print({'seconds': 1, 'on_fail': 'dlq'})
print('finally', True)
print('ok', True)`,
          output: `{'seconds': 1, 'on_fail': 'dlq'}
finally True
ok True`,
        },
        why: "Timeouts.",
      },
      {
        demoId: "S38-T3-A-DEMO",
        subtopicId: "S38-T3-A",
        environment: "local-python",
        description: "Log event scored.",
        code: {
          language: 'python',
          title: "o_demo.py",
          code: `print('scored', 'corr-1')
print('metric', 'latency_ms')
print('pii_raw', False)`,
          output: `scored corr-1
metric latency_ms
pii_raw False`,
        },
        why: "O11y.",
      },
      {
        demoId: "S38-T3-B-DEMO",
        subtopicId: "S38-T3-B",
        environment: "local-python",
        description: "SLO check.",
        code: {
          language: 'python',
          title: "s_demo.py",
          code: `print(True)
print('redacted', 'an***')
print('ok', True)`,
          output: `True
redacted an***
ok True`,
        },
        why: "SLI/SLO.",
      },
      {
        demoId: "S38-T4-A-DEMO",
        subtopicId: "S38-T4-A",
        environment: "local-python",
        description: "Idempotency key.",
        code: {
          language: 'python',
          title: "k_demo.py",
          code: `print('c1:score:v1')
print('status', 'done')
print('ok', True)`,
          output: `c1:score:v1
status done
ok True`,
        },
        why: "Checkpoint.",
      },
      {
        demoId: "S38-T4-B-DEMO",
        subtopicId: "S38-T4-B",
        environment: "local-python",
        description: "Backoff series.",
        code: {
          language: 'python',
          title: "d_demo.py",
          code: `print([0.1, 0.2, 0.4])
print('dlq', True)
print('runbook', True)`,
          output: `[0.1, 0.2, 0.4]
dlq True
runbook True`,
        },
        why: "Retry/DLQ.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de threads/async, GIL, pools, timeouts, logs, SLO, checkpoint y DLQ.",
    steps: [
      {
        id: "S38-T1-A-E1",
        subtopicId: "S38-T1-A",
        kind: "guided",
        instruction:
          "pick cpu.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('processes')
print('bound', 'cpu')
print('ok', True)`,
          output: `processes
bound cpu
ok True`,
        },
      },
      {
        id: "S38-T1-A-E2",
        subtopicId: "S38-T1-A",
        kind: "independent",
        instruction:
          "pick io.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('async_or_threads')
print('bound', 'io')
print('ok', True)`,
          output: `async_or_threads
bound io
ok True`,
        },
      },
      {
        id: "S38-T1-A-E3",
        subtopicId: "S38-T1-A",
        kind: "transfer",
        instruction:
          "measure first.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(True)
print('ok', True)
print('n', 1)`,
          output: `True
ok True
n 1`,
        },
      },
      {
        id: "S38-T1-B-E1",
        subtopicId: "S38-T1-B",
        kind: "guided",
        instruction:
          "json size.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `import json; print(len(json.dumps({'x':2}).encode()))
print('ok', True)
print('compact', True)`,
          output: `8
ok True
compact True`,
        },
      },
      {
        id: "S38-T1-B-E2",
        subtopicId: "S38-T1-B",
        kind: "independent",
        instruction:
          "GIL note.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('limited')
print('ok', True)
print('cpu_threads', True)`,
          output: `limited
ok True
cpu_threads True`,
        },
      },
      {
        id: "S38-T1-B-E3",
        subtopicId: "S38-T1-B",
        kind: "transfer",
        instruction:
          "prefer compact.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('compact_payload')
print('ok', True)
print('n', 1)`,
          output: `compact_payload
ok True
n 1`,
        },
      },
      {
        id: "S38-T2-A-E1",
        subtopicId: "S38-T2-A",
        kind: "guided",
        instruction:
          "allows 2 tokens.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(2)
print('third', False)
print('ok', True)`,
          output: `2
third False
ok True`,
        },
      },
      {
        id: "S38-T2-A-E2",
        subtopicId: "S38-T2-A",
        kind: "independent",
        instruction:
          "queue maxsize role.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('backpressure')
print('ok', True)
print('maxsize', 50)`,
          output: `backpressure
ok True
maxsize 50`,
        },
      },
      {
        id: "S38-T2-A-E3",
        subtopicId: "S38-T2-A",
        kind: "transfer",
        instruction:
          "rate limit protects.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('provider')
print('ok', True)
print('ban_risk', True)`,
          output: `provider
ok True
ban_risk True`,
        },
      },
      {
        id: "S38-T2-B-E1",
        subtopicId: "S38-T2-B",
        kind: "guided",
        instruction:
          "timeout seconds field.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(5)
print('on_fail', 'retry_or_dlq')
print('ok', True)`,
          output: `5
on_fail retry_or_dlq
ok True`,
        },
      },
      {
        id: "S38-T2-B-E2",
        subtopicId: "S38-T2-B",
        kind: "independent",
        instruction:
          "finally close.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(True)
print('resource', 'conn')
print('ok', True)`,
          output: `True
resource conn
ok True`,
        },
      },
      {
        id: "S38-T2-B-E3",
        subtopicId: "S38-T2-B",
        kind: "transfer",
        instruction:
          "hang without timeout.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('incident', True)
print('ok', True)
print('n', 1)`,
          output: `incident True
ok True
n 1`,
        },
      },
      {
        id: "S38-T3-A-E1",
        subtopicId: "S38-T3-A",
        kind: "guided",
        instruction:
          "corr id present.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(True)
print('event', 'scored')
print('ok', True)`,
          output: `True
event scored
ok True`,
        },
      },
      {
        id: "S38-T3-A-E2",
        subtopicId: "S38-T3-A",
        kind: "independent",
        instruction:
          "three pillars.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(['logs','metrics','traces'])
print('ok', True)
print('n', 3)`,
          output: `['logs', 'metrics', 'traces']
ok True
n 3`,
        },
      },
      {
        id: "S38-T3-A-E3",
        subtopicId: "S38-T3-A",
        kind: "transfer",
        instruction:
          "no raw pii.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(False)
print('ok', True)
print('redact', True)`,
          output: `False
ok True
redact True`,
        },
      },
      {
        id: "S38-T3-B-E1",
        subtopicId: "S38-T3-B",
        kind: "guided",
        instruction:
          "redact phone.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('90****01')
print('ok', True)
print('pii', False)`,
          output: `90****01
ok True
pii False`,
        },
      },
      {
        id: "S38-T3-B-E2",
        subtopicId: "S38-T3-B",
        kind: "independent",
        instruction:
          "slo ok compare.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(True)
print('p95', 100)
print('limit', 200)`,
          output: `True
p95 100
limit 200`,
        },
      },
      {
        id: "S38-T3-B-E3",
        subtopicId: "S38-T3-B",
        kind: "transfer",
        instruction:
          "error budget concept.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('error_budget')
print('ok', True)
print('n', 1)`,
          output: `error_budget
ok True
n 1`,
        },
      },
      {
        id: "S38-T4-A-E1",
        subtopicId: "S38-T4-A",
        kind: "guided",
        instruction:
          "states list.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(['pending','running','done','failed'])
print('ok', True)
print('n', 4)`,
          output: `['pending', 'running', 'done', 'failed']
ok True
n 4`,
        },
      },
      {
        id: "S38-T4-A-E2",
        subtopicId: "S38-T4-A",
        kind: "independent",
        instruction:
          "idem key format.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('case:step:ver')
print('ok', True)
print('dup', False)`,
          output: `case:step:ver
ok True
dup False`,
        },
      },
      {
        id: "S38-T4-A-E3",
        subtopicId: "S38-T4-A",
        kind: "transfer",
        instruction:
          "resume step.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('features')
print('ok', True)
print('checkpoint', True)`,
          output: `features
ok True
checkpoint True`,
        },
      },
      {
        id: "S38-T4-B-E1",
        subtopicId: "S38-T4-B",
        kind: "guided",
        instruction:
          "backoff attempt 3 base 0.1.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(0.8)
print('ok', True)
print('attempt', 3)`,
          output: `0.8
ok True
attempt 3`,
        },
      },
      {
        id: "S38-T4-B-E2",
        subtopicId: "S38-T4-B",
        kind: "independent",
        instruction:
          "dlq purpose.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('poison')
print('ok', True)
print('replay', 'controlled')`,
          output: `poison
ok True
replay controlled`,
        },
      },
      {
        id: "S38-T4-B-E3",
        subtopicId: "S38-T4-B",
        kind: "transfer",
        instruction:
          "runbook true.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
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
          code: `print(True)
print('oncall', True)
print('ok', True)`,
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
      "Workers con pool/backpressure, logs redactados, checkpoint idempotente, retry/DLQ y runbook. Id performance-extreme conservado.",
    objectives: [
      "Concurrencia adecuada",
      "Timeouts y backpressure",
      "O11y+SLO",
      "Checkpoint/idempotencia/retry",
    ],
    requirements: [
      "Trace por case_id",
      "Sin PII raw en logs",
      "Runbook de fallos",
      "es-PE",
    ],
    starterCode: `# workflow resiliente
state = {'case_id': 'c1', 'step': 'intake', 'status': 'pending'}

def checkpoint(state, step):
    state = dict(state); state['step']=step; state['status']='done'; return state

if __name__ == '__main__':
    print(checkpoint(state, 'features'))
`,
    portfolioNote:
      "Operación CP-N3-C; no PASS.",
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
        explanation:
          "GIL.",
      },
      {
        question: "Backpressure evita:",
        options: ["Solo tests", "Checkpoints", "SLOs", "Colas infinitas y OOM"],
        correctIndex: 3,
        explanation:
          "Cola acotada.",
      },
      {
        question: "Idempotencia permite:",
        options: ["Reejecutar sin side effects duplicados", "Duplicar cobros", "Borrar DLQ siempre", "Ignorar corr ids"],
        correctIndex: 0,
        explanation:
          "Keys.",
      },
      {
        question: "En logs de prod debes:",
        options: ["PII completa", "Desactivar métricas", "Redactar PII y correlacionar", "No usar case_id"],
        correctIndex: 2,
        explanation:
          "Privacidad.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python asyncio",
        url: "https://docs.python.org/3/library/asyncio.html",
        note: "Async I/O",
      },
      {
        label: "OpenTelemetry concepts",
        url: "https://opentelemetry.io/docs/concepts/",
        note: "Traces",
      },
    ],
    books: [
      {
        label: "Site Reliability Engineering",
        note: "SLI/SLO",
      },
      {
        label: "Release It!",
        note: "Resiliencia",
      },
    ],
    courses: [
      {
        label: "concurrent.futures",
        url: "https://docs.python.org/3/library/concurrent.futures.html",
        note: "Pools",
      },
    ],
  },
}
