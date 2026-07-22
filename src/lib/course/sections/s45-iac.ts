import type { CourseSection } from '../../types'

export const section45: CourseSection = {
  id: "iac",
  index: 45,
  title: "Cloud, almacenamiento, colas e infraestructura",
  shortTitle: "Cloud y colas",
  tagline: "job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados",
  estimatedHours: 18,
  level: "Master",
  phase: 3,
  icon: "Cloud",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, cloud, almacenamiento, colas e infraestructura conecta decisiones técnicas con evidencia operativa. La práctica entrega estado durable, resultado en object store y fallas terminales en dead-letter queue y se promueve solo cuando reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
  learningOutcomes: [
    { text: "Elige object/relacional/cache" },
    { text: "Define consistencia, lifecycle y backups" },
    { text: "Diseña colas y delivery semantics" },
    { text: "Garantiza dedup, orden y DLQ" },
    { text: "Dimensiona compute y red" },
    { text: "Restringe IAM, paths privados y egress" },
    { text: "Declara infra y environments" },
    { text: "Presupuesta costo y recovery" },
  ],
  theory: [
    {
      heading: "Ruta de S45: Cloud, almacenamiento, colas e infraestructura",
      paragraphs: [
        "Esta sección parte de S44 y usa únicamente contratos, pruebas y controles ya presentados. El caso `CASO-IQU-045` es sintético y puede ejecutarse sin credenciales ni servicios externos.",
        "Producto incremental: Arquitectura distribuida mínima declarativa. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida: estado durable, resultado en object store y fallas terminales en dead-letter queue.",
        "La secuencia mantiene liberación gradual: teoría con criterio medible, demo local, ejercicio guiado, validación independiente y transferencia con breach/uncertainty.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-B · job asíncrono resiliente: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "object store, relacional y cache",
      subtopicId: "S45-T1-A",
      paragraphs: [
        "Elige object store para blobs, relacional para invariantes/consultas y cache para copias descartables; no uses cache como registro autoritativo.",
        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: ADR de persistencia con fuente de verdad. Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
        "Aplicación de `object store, relacional y cache` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es ADR de persistencia con fuente de verdad. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "object_relational_cache.py",
        code: `print(sorted(["cache","object","relational"])); print("object", "artifacts"); print("choose", "by_access_pattern")`,
        output: `['cache', 'object', 'relational']
object artifacts
choose by_access_pattern`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S45-T1-A: ADR de persistencia con fuente de verdad. Si falta, responde `REDESIGN_PERSISTENCE`; si no alcanza para decidir, `WRITE_STORE_ADR`.",
      },
    },
    {
      heading: "consistencia, lifecycle y backups",
      subtopicId: "S45-T1-B",
      paragraphs: [
        "Consistencia se define por operación; lifecycle expira copias y backup solo cuenta cuando un restore medido cumple RPO/RTO.",
        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: restore sintético dentro de RPO/RTO. Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
        "Aplicación de `consistencia, lifecycle y backups` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es restore sintético dentro de RPO/RTO. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "consistency_lifecycle_backups.py",
        code: `print({"hot_days":30,"backup":"daily"}); print("rpo", "24h"); print("consistency", "job_status_strong")`,
        output: `{'hot_days': 30, 'backup': 'daily'}
rpo 24h
consistency job_status_strong`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S45-T1-B, audita restore sintético dentro de RPO/RTO. Un breach activa `DECLARE_DATA_LOSS_RISK` y una ausencia activa `RUN_RESTORE_DRILL`.",
      },
    },
    {
      heading: "queue/event y delivery semantics",
      subtopicId: "S45-T2-A",
      paragraphs: [
        "Queue desacopla productor/consumidor; at-least-once exige ack después del efecto durable, retry con backoff y handlers idempotentes.",
        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: mensaje reentregado no duplica efecto. Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
        "Aplicación de `queue/event y delivery semantics` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es mensaje reentregado no duplica efecto. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "queue_event_delivery.py",
        code: `print({"delivery":"at_least_once"}); print("dup_ok", True); print("consumer", "idempotent")`,
        output: `{'delivery': 'at_least_once'}
dup_ok True
consumer idempotent`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S45-T2-A conserva mensaje reentregado no duplica efecto; no conviertas `NACK_AND_RETRY` ni `VERIFY_DELIVERY_SEMANTICS` en éxito silencioso.",
      },
    },
    {
      heading: "dedup, ordering y dead-letter",
      subtopicId: "S45-T2-B",
      paragraphs: [
        "Dedup usa clave estable, ordering solo donde importa y DLQ conserva razón/intentos/payload seguro para replay controlado.",
        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: duplicado, desorden y terminal en DLQ probados. Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
        "Aplicación de `dedup, ordering y dead-letter` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es duplicado, desorden y terminal en DLQ probados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "dedup_ordering_dlq.py",
        code: `print("new"); print("dup"); print("dlq", "after_3")`,
        output: `new
dup
dlq after_3`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S45-T2-B: demuestra duplicado, desorden y terminal en DLQ probados. Falla cerrada con `DEDUP_OR_DLQ` y deriva incertidumbre mediante `INSPECT_MESSAGE_ORDER`.",
      },
    },
    {
      heading: "compute, autoscaling y networking",
      subtopicId: "S45-T3-A",
      paragraphs: [
        "Autoscaling usa una señal vinculada al backlog/SLO, networking segmenta y capacidad máxima considera cuotas, warm-up y backpressure.",
        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: carga sintética respeta SLO y cuota. Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
        "Aplicación de `compute, autoscaling y networking` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es carga sintética respeta SLO y cuota. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "compute_autoscale_net.py",
        code: `print({"min":1,"max":5}); print({"private":True}); print("autoscale", "queue_depth")`,
        output: `{'min': 1, 'max': 5}
{'private': True}
autoscale queue_depth`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S45-T3-A, el artefacto comprobable es carga sintética respeta SLO y cuota. Sin él corresponde `APPLY_BACKPRESSURE` o, si faltan datos, `REQUEST_CAPACITY`.",
      },
    },
    {
      heading: "IAM, private paths y egress",
      subtopicId: "S45-T3-B",
      paragraphs: [
        "IAM concede acción/recurso mínimos, paths privados evitan internet y egress se allowlistea y registra para impedir exfiltración.",
        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: policy negativa y egress bloqueado probados. Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
        "Aplicación de `IAM, private paths y egress` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es policy negativa y egress bloqueado probados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "iam_private_egress.py",
        code: `print(["s3:PutObject","sqs:Receive"]); print("egress", "restricted"); print("private_path", True)`,
        output: `['s3:PutObject', 'sqs:Receive']
egress restricted
private_path True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S45-T3-B: prueba policy negativa y egress bloqueado probados y registra por separado `DENY_IAM_OR_EGRESS` (breach) y `REQUEST_SCOPED_POLICY` (missing).",
      },
    },
    {
      heading: "configuración declarativa y environments",
      subtopicId: "S45-T4-A",
      paragraphs: [
        "IaC declara el estado deseado, parametriza entornos sin copiar secretos y un plan revisado precede apply.",
        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: plan sin drift destructivo inesperado. Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
        "Aplicación de `configuración declarativa y environments` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es plan sin drift destructivo inesperado. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "declarative_config_envs.py",
        code: `print(["dev","prod"]); print(["network","data","app"]); print("declarative", True)`,
        output: `['dev', 'prod']
['network', 'data', 'app']
declarative True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S45-T4-A acepta solo plan sin drift destructivo inesperado; una violación produce `REJECT_IAC_PLAN` y un registro incompleto produce `REVIEW_DRIFT`.",
      },
    },
    {
      heading: "costos, quotas, recovery y portability",
      subtopicId: "S45-T4-B",
      paragraphs: [
        "Presupuesto y quotas son controles operativos; recovery y portability se ensayan con exportaciones/formatos abiertos, no se prometen.",
        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: alarma de costo y recuperación documentadas. Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
        "Aplicación de `costos, quotas, recovery y portability` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es alarma de costo y recuperación documentadas. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "cost_quotas_recovery_portability.py",
        code: `print({"monthly_usd":200}); print({"rto_min":60}); print("portable", "container_images")`,
        output: `{'monthly_usd': 200}
{'rto_min': 60}
portable container_images`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S45-T4-B: conserva alarma de costo y recuperación documentadas, la evidencia de `FREEZE_SCALE_OUT` y la ruta humana `COST_OWNER_REVIEW`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S45 (Cloud, almacenamiento, colas e infraestructura) alineadas a CP-N4-B (arquitectura).",
    steps: [
      {
        demoId: "S45-T1-A-DEMO",
        subtopicId: "S45-T1-A",
        environment: "local-python",
        description: "Demo: object store, relacional y cache",
        code: {
          language: 'python',
          title: "demo_object_relational_cache.py",
          code: `print("blob", "s3_like"); print("sql", "jobs_table"); print("cache", "redis_like")`,
          output: `blob s3_like
sql jobs_table
cache redis_like`,
        },
        why: "Hace observable `object store, relacional y cache` con un caso local pequeño y deja como evidencia ADR de persistencia con fuente de verdad; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S45-T1-B-DEMO",
        subtopicId: "S45-T1-B",
        environment: "local-python",
        description: "Demo: consistencia, lifecycle y backups",
        code: {
          language: 'python',
          title: "demo_consistency_lifecycle_backups.py",
          code: `print("lifecycle", True); print("backup", "daily"); print("restore_tested", True)`,
          output: `lifecycle True
backup daily
restore_tested True`,
        },
        why: "Hace observable `consistencia, lifecycle y backups` con un caso local pequeño y deja como evidencia restore sintético dentro de RPO/RTO; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S45-T2-A-DEMO",
        subtopicId: "S45-T2-A",
        environment: "local-python",
        description: "Demo: queue/event y delivery semantics",
        code: {
          language: 'python',
          title: "demo_queue_event_delivery.py",
          code: `print("queue", "jobs"); print("event", "job.finished"); print("delivery", "at_least_once")`,
          output: `queue jobs
event job.finished
delivery at_least_once`,
        },
        why: "Hace observable `queue/event y delivery semantics` con un caso local pequeño y deja como evidencia mensaje reentregado no duplica efecto; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S45-T2-B-DEMO",
        subtopicId: "S45-T2-B",
        environment: "local-python",
        description: "Demo: dedup, ordering y dead-letter",
        code: {
          language: 'python',
          title: "demo_dedup_ordering_dlq.py",
          code: `print("order", "per_partition"); print("dlq", True); print("dedup_store", "redis_or_db")`,
          output: `order per_partition
dlq True
dedup_store redis_or_db`,
        },
        why: "Hace observable `dedup, ordering y dead-letter` con un caso local pequeño y deja como evidencia duplicado, desorden y terminal en DLQ probados; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S45-T3-A-DEMO",
        subtopicId: "S45-T3-A",
        environment: "local-python",
        description: "Demo: compute, autoscaling y networking",
        code: {
          language: 'python',
          title: "demo_compute_autoscale_net.py",
          code: `print("scale_on", "lag"); print("private", True); print("api_edge", True)`,
          output: `scale_on lag
private True
api_edge True`,
        },
        why: "Hace observable `compute, autoscaling y networking` con un caso local pequeño y deja como evidencia carga sintética respeta SLO y cuota; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S45-T3-B-DEMO",
        subtopicId: "S45-T3-B",
        environment: "local-python",
        description: "Demo: IAM, private paths y egress",
        code: {
          language: 'python',
          title: "demo_iam_private_egress.py",
          code: `print("least_privilege", True); print("no_0_0_0_0_admin", True); print("egress", "allowlist")`,
          output: `least_privilege True
no_0_0_0_0_admin True
egress allowlist`,
        },
        why: "Hace observable `IAM, private paths y egress` con un caso local pequeño y deja como evidencia policy negativa y egress bloqueado probados; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S45-T4-A-DEMO",
        subtopicId: "S45-T4-A",
        environment: "local-python",
        description: "Demo: configuración declarativa y environments",
        code: {
          language: 'python',
          title: "demo_declarative_config_envs.py",
          code: `print("env_parity", True); print("config_as_code", True); print("drift_detect", True)`,
          output: `env_parity True
config_as_code True
drift_detect True`,
        },
        why: "Hace observable `configuración declarativa y environments` con un caso local pequeño y deja como evidencia plan sin drift destructivo inesperado; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S45-T4-B-DEMO",
        subtopicId: "S45-T4-B",
        environment: "local-python",
        description: "Demo: costos, quotas, recovery y portability",
        code: {
          language: 'python',
          title: "demo_cost_quotas_recovery_portability.py",
          code: `print("quota", True); print("cost_alert", 0.8); print("recovery_drill", True)`,
          output: `quota True
cost_alert 0.8
recovery_drill True`,
        },
        why: "Hace observable `costos, quotas, recovery y portability` con un caso local pequeño y deja como evidencia alarma de costo y recuperación documentadas; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S45 · Laboratorio Arquitectura distribuida mínima declarativa: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S45-T1-A-E1",
        subtopicId: "S45-T1-A",
        kind: "guided",
        instruction: "S45-T1-A-E1 · Calcula el contrato de `object store, relacional y cache` sobre `CASO-IQU-045-1A`. La entrada es el dict completo del starter; la operación debe demostrar object/relational por semántica y cache descartable. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S45-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REDESIGN_PERSISTENCE` en E2.",
        hint: "Relaciona los campos `blob_store`, `transactions`, `cache_authoritative`, `cache_ttl_s` con la regla explicada en S45-T1-A.",
        hints: [
          "Relaciona los campos `blob_store`, `transactions`, `cache_authoritative`, `cache_ttl_s` con la regla explicada en S45-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva ADR de persistencia con fuente de verdad; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: object/relational por semántica y cache descartable", "CASO-IQU-045-1A es sintético"],
        tests: "El fixture `CASO-IQU-045-1A` satisface un predicado de dominio real; imprime `S45-T1-A PASS` y el assert booleano pasa.",
        feedback: "S45-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REDESIGN_PERSISTENCE y por qué faltar cache_ttl_s exige WRITE_STORE_ADR.",
        starterCode: {
          language: 'python',
          title: "s45-t1-a-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"object","transactions":"relational","cache_authoritative":False,"cache_ttl_s":300}}
meets_contract = record["cache_authoritative"] or record["transactions"] == "cache"
status = "PASS" if meets_contract else "REDESIGN_PERSISTENCE"
print("S45-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t1-a-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"object","transactions":"relational","cache_authoritative":False,"cache_ttl_s":300}}
meets_contract = record["blob_store"] == "object" and record["transactions"] == "relational" and not record["cache_authoritative"] and record["cache_ttl_s"] > 0
status = "PASS" if meets_contract else "REDESIGN_PERSISTENCE"
print("S45-T1-A", status)
assert meets_contract is True` ,
          output: `S45-T1-A PASS` ,
        },
      },
      {
        id: "S45-T1-A-E2",
        subtopicId: "S45-T1-A",
        kind: "independent",
        instruction: "S45-T1-A-E2 · Modela tres rutas de `object store, relacional y cache`: fixture válido, fixture adverso y registro sin `cache_ttl_s`. Entrada: dict con case_id, blob_store, transactions, cache_authoritative, cache_ttl_s. Salidas exactas: `PASS`, `REDESIGN_PERSISTENCE`, `MISSING:cache_ttl_s`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a cache_ttl_s debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a cache_ttl_s debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T1-A: object/relational por semántica y cache descartable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: object/relational por semántica y cache descartable", "CASO-IQU-045-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `cache_ttl_s` ausente y produce exactamente `PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s`.",
        feedback: "S45-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REDESIGN_PERSISTENCE y por qué faltar cache_ttl_s exige WRITE_STORE_ADR.",
        starterCode: {
          language: 'python',
          title: "s45-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "blob_store", "transactions", "cache_authoritative", "cache_ttl_s"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["cache_authoritative"] or record["transactions"] == "cache" else "REDESIGN_PERSISTENCE"

valid = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"object","transactions":"relational","cache_authoritative":False,"cache_ttl_s":300}}
invalid = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"cache","transactions":"cache","cache_authoritative":True,"cache_ttl_s":0}}
incomplete = {**valid}
incomplete.pop("cache_ttl_s")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "blob_store", "transactions", "cache_authoritative", "cache_ttl_s"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["blob_store"] == "object" and record["transactions"] == "relational" and not record["cache_authoritative"] and record["cache_ttl_s"] > 0 else "REDESIGN_PERSISTENCE"

valid = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"object","transactions":"relational","cache_authoritative":False,"cache_ttl_s":300}}
invalid = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"cache","transactions":"cache","cache_authoritative":True,"cache_ttl_s":0}}
incomplete = {**valid}
incomplete.pop("cache_ttl_s")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s` ,
        },
      },
      {
        id: "S45-T1-A-E3",
        subtopicId: "S45-T1-A",
        kind: "transfer",
        instruction: "S45-T1-A-E3 · Simula fallo cerrado para `object store, relacional y cache` con tres fixtures distintos. `CASO-IQU-045-1A` debe continuar, el adverso debe devolver `REDESIGN_PERSISTENCE` y la ausencia de `cache_ttl_s` debe devolver `WRITE_STORE_ADR`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `WRITE_STORE_ADR` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `WRITE_STORE_ADR` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró object/relational por semántica y cache descartable; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: object/relational por semántica y cache descartable", "CASO-IQU-045-1A es sintético"],
        tests: "Fixtures `CASO-IQU-045-1A`, adverso y sin `cache_ttl_s` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REDESIGN_PERSISTENCE y por qué faltar cache_ttl_s exige WRITE_STORE_ADR.",
        starterCode: {
          language: 'python',
          title: "s45-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "blob_store", "transactions", "cache_authoritative", "cache_ttl_s"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["cache_authoritative"] or record["transactions"] == "cache" else "REDESIGN_PERSISTENCE"

valid = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"object","transactions":"relational","cache_authoritative":False,"cache_ttl_s":300}}
invalid = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"cache","transactions":"cache","cache_authoritative":True,"cache_ttl_s":0}}
uncertain = {**valid}
uncertain.pop("cache_ttl_s")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "blob_store", "transactions", "cache_authoritative", "cache_ttl_s"}
    missing = sorted(required - record.keys())
    if missing:
        return "WRITE_STORE_ADR"
    return "CONTINUE" if record["blob_store"] == "object" and record["transactions"] == "relational" and not record["cache_authoritative"] and record["cache_ttl_s"] > 0 else "REDESIGN_PERSISTENCE"

valid = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"object","transactions":"relational","cache_authoritative":False,"cache_ttl_s":300}}
invalid = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"cache","transactions":"cache","cache_authoritative":True,"cache_ttl_s":0}}
uncertain = {**valid}
uncertain.pop("cache_ttl_s")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REDESIGN_PERSISTENCE", "WRITE_STORE_ADR"]` ,
          output: `CONTINUE REDESIGN_PERSISTENCE WRITE_STORE_ADR` ,
        },
      },
      {
        id: "S45-T1-B-E1",
        subtopicId: "S45-T1-B",
        kind: "guided",
        instruction: "S45-T1-B-E1 · Compara el contrato de `consistencia, lifecycle y backups` sobre `CASO-IQU-045-1B`. La entrada es el dict completo del starter; la operación debe demostrar consistencia explícita y restore dentro de RPO/RTO. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S45-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `DECLARE_DATA_LOSS_RISK` en E2.",
        hint: "Relaciona los campos `operation`, `consistency`, `backup_age_h`, `rpo_h`, `restore_minutes`, `rto_minutes` con la regla explicada en S45-T1-B.",
        hints: [
          "Relaciona los campos `operation`, `consistency`, `backup_age_h`, `rpo_h`, `restore_minutes`, `rto_minutes` con la regla explicada en S45-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva restore sintético dentro de RPO/RTO; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: consistencia explícita y restore dentro de RPO/RTO", "CASO-IQU-045-1B es sintético"],
        tests: "El fixture `CASO-IQU-045-1B` satisface un predicado de dominio real; imprime `S45-T1-B PASS` y el assert booleano pasa.",
        feedback: "S45-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_DATA_LOSS_RISK y por qué faltar rto_minutes exige RUN_RESTORE_DRILL.",
        starterCode: {
          language: 'python',
          title: "s45-t1-b-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"read-after-write","backup_age_h":4,"rpo_h":6,"restore_minutes":25,"rto_minutes":30}}
meets_contract = record["backup_age_h"] > record["rpo_h"] or record["restore_minutes"] > record["rto_minutes"]
status = "PASS" if meets_contract else "DECLARE_DATA_LOSS_RISK"
print("S45-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t1-b-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"read-after-write","backup_age_h":4,"rpo_h":6,"restore_minutes":25,"rto_minutes":30}}
meets_contract = record["consistency"] == "read-after-write" and record["backup_age_h"] <= record["rpo_h"] and record["restore_minutes"] <= record["rto_minutes"]
status = "PASS" if meets_contract else "DECLARE_DATA_LOSS_RISK"
print("S45-T1-B", status)
assert meets_contract is True` ,
          output: `S45-T1-B PASS` ,
        },
      },
      {
        id: "S45-T1-B-E2",
        subtopicId: "S45-T1-B",
        kind: "independent",
        instruction: "S45-T1-B-E2 · Verifica tres rutas de `consistencia, lifecycle y backups`: fixture válido, fixture adverso y registro sin `rto_minutes`. Entrada: dict con case_id, operation, consistency, backup_age_h, rpo_h, restore_minutes, rto_minutes. Salidas exactas: `PASS`, `DECLARE_DATA_LOSS_RISK`, `MISSING:rto_minutes`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a rto_minutes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a rto_minutes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T1-B: consistencia explícita y restore dentro de RPO/RTO. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: consistencia explícita y restore dentro de RPO/RTO", "CASO-IQU-045-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `rto_minutes` ausente y produce exactamente `PASS DECLARE_DATA_LOSS_RISK MISSING:rto_minutes`.",
        feedback: "S45-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_DATA_LOSS_RISK y por qué faltar rto_minutes exige RUN_RESTORE_DRILL.",
        starterCode: {
          language: 'python',
          title: "s45-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "operation", "consistency", "backup_age_h", "rpo_h", "restore_minutes", "rto_minutes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["backup_age_h"] > record["rpo_h"] or record["restore_minutes"] > record["rto_minutes"] else "DECLARE_DATA_LOSS_RISK"

valid = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"read-after-write","backup_age_h":4,"rpo_h":6,"restore_minutes":25,"rto_minutes":30}}
invalid = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"eventual","backup_age_h":24,"rpo_h":6,"restore_minutes":90,"rto_minutes":30}}
incomplete = {**valid}
incomplete.pop("rto_minutes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "operation", "consistency", "backup_age_h", "rpo_h", "restore_minutes", "rto_minutes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["consistency"] == "read-after-write" and record["backup_age_h"] <= record["rpo_h"] and record["restore_minutes"] <= record["rto_minutes"] else "DECLARE_DATA_LOSS_RISK"

valid = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"read-after-write","backup_age_h":4,"rpo_h":6,"restore_minutes":25,"rto_minutes":30}}
invalid = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"eventual","backup_age_h":24,"rpo_h":6,"restore_minutes":90,"rto_minutes":30}}
incomplete = {**valid}
incomplete.pop("rto_minutes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DECLARE_DATA_LOSS_RISK MISSING:rto_minutes` ,
        },
      },
      {
        id: "S45-T1-B-E3",
        subtopicId: "S45-T1-B",
        kind: "transfer",
        instruction: "S45-T1-B-E3 · Extiende fallo cerrado para `consistencia, lifecycle y backups` con tres fixtures distintos. `CASO-IQU-045-1B` debe continuar, el adverso debe devolver `DECLARE_DATA_LOSS_RISK` y la ausencia de `rto_minutes` debe devolver `RUN_RESTORE_DRILL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RUN_RESTORE_DRILL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RUN_RESTORE_DRILL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró consistencia explícita y restore dentro de RPO/RTO; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: consistencia explícita y restore dentro de RPO/RTO", "CASO-IQU-045-1B es sintético"],
        tests: "Fixtures `CASO-IQU-045-1B`, adverso y sin `rto_minutes` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_DATA_LOSS_RISK y por qué faltar rto_minutes exige RUN_RESTORE_DRILL.",
        starterCode: {
          language: 'python',
          title: "s45-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "operation", "consistency", "backup_age_h", "rpo_h", "restore_minutes", "rto_minutes"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["backup_age_h"] > record["rpo_h"] or record["restore_minutes"] > record["rto_minutes"] else "DECLARE_DATA_LOSS_RISK"

valid = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"read-after-write","backup_age_h":4,"rpo_h":6,"restore_minutes":25,"rto_minutes":30}}
invalid = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"eventual","backup_age_h":24,"rpo_h":6,"restore_minutes":90,"rto_minutes":30}}
uncertain = {**valid}
uncertain.pop("rto_minutes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "operation", "consistency", "backup_age_h", "rpo_h", "restore_minutes", "rto_minutes"}
    missing = sorted(required - record.keys())
    if missing:
        return "RUN_RESTORE_DRILL"
    return "CONTINUE" if record["consistency"] == "read-after-write" and record["backup_age_h"] <= record["rpo_h"] and record["restore_minutes"] <= record["rto_minutes"] else "DECLARE_DATA_LOSS_RISK"

valid = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"read-after-write","backup_age_h":4,"rpo_h":6,"restore_minutes":25,"rto_minutes":30}}
invalid = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"eventual","backup_age_h":24,"rpo_h":6,"restore_minutes":90,"rto_minutes":30}}
uncertain = {**valid}
uncertain.pop("rto_minutes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DECLARE_DATA_LOSS_RISK", "RUN_RESTORE_DRILL"]` ,
          output: `CONTINUE DECLARE_DATA_LOSS_RISK RUN_RESTORE_DRILL` ,
        },
      },
      {
        id: "S45-T2-A-E1",
        subtopicId: "S45-T2-A",
        kind: "guided",
        instruction: "S45-T2-A-E1 · Filtra el contrato de `queue/event y delivery semantics` sobre `CASO-IQU-045-2A`. La entrada es el dict completo del starter; la operación debe demostrar ack posterior al efecto, key idempotente y backoff. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S45-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `NACK_AND_RETRY` en E2.",
        hint: "Relaciona los campos `delivery`, `effect_durable`, `acked_after_effect`, `idempotency_key`, `backoff` con la regla explicada en S45-T2-A.",
        hints: [
          "Relaciona los campos `delivery`, `effect_durable`, `acked_after_effect`, `idempotency_key`, `backoff` con la regla explicada en S45-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva mensaje reentregado no duplica efecto; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: ack posterior al efecto, key idempotente y backoff", "CASO-IQU-045-2A es sintético"],
        tests: "El fixture `CASO-IQU-045-2A` satisface un predicado de dominio real; imprime `S45-T2-A PASS` y el assert booleano pasa.",
        feedback: "S45-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa NACK_AND_RETRY y por qué faltar backoff exige VERIFY_DELIVERY_SEMANTICS.",
        starterCode: {
          language: 'python',
          title: "s45-t2-a-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-least-once","effect_durable":True,"acked_after_effect":True,"idempotency_key":"job-iqu-1","backoff":True}}
meets_contract = not record["acked_after_effect"] or not record["idempotency_key"]
status = "PASS" if meets_contract else "NACK_AND_RETRY"
print("S45-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t2-a-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-least-once","effect_durable":True,"acked_after_effect":True,"idempotency_key":"job-iqu-1","backoff":True}}
meets_contract = record["delivery"] == "at-least-once" and record["effect_durable"] and record["acked_after_effect"] and bool(record["idempotency_key"]) and record["backoff"]
status = "PASS" if meets_contract else "NACK_AND_RETRY"
print("S45-T2-A", status)
assert meets_contract is True` ,
          output: `S45-T2-A PASS` ,
        },
      },
      {
        id: "S45-T2-A-E2",
        subtopicId: "S45-T2-A",
        kind: "independent",
        instruction: "S45-T2-A-E2 · Clasifica tres rutas de `queue/event y delivery semantics`: fixture válido, fixture adverso y registro sin `backoff`. Entrada: dict con case_id, delivery, effect_durable, acked_after_effect, idempotency_key, backoff. Salidas exactas: `PASS`, `NACK_AND_RETRY`, `MISSING:backoff`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a backoff debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a backoff debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T2-A: ack posterior al efecto, key idempotente y backoff. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: ack posterior al efecto, key idempotente y backoff", "CASO-IQU-045-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backoff` ausente y produce exactamente `PASS NACK_AND_RETRY MISSING:backoff`.",
        feedback: "S45-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa NACK_AND_RETRY y por qué faltar backoff exige VERIFY_DELIVERY_SEMANTICS.",
        starterCode: {
          language: 'python',
          title: "s45-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "delivery", "effect_durable", "acked_after_effect", "idempotency_key", "backoff"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["acked_after_effect"] or not record["idempotency_key"] else "NACK_AND_RETRY"

valid = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-least-once","effect_durable":True,"acked_after_effect":True,"idempotency_key":"job-iqu-1","backoff":True}}
invalid = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-most-once","effect_durable":False,"acked_after_effect":False,"idempotency_key":"","backoff":False}}
incomplete = {**valid}
incomplete.pop("backoff")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "delivery", "effect_durable", "acked_after_effect", "idempotency_key", "backoff"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["delivery"] == "at-least-once" and record["effect_durable"] and record["acked_after_effect"] and bool(record["idempotency_key"]) and record["backoff"] else "NACK_AND_RETRY"

valid = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-least-once","effect_durable":True,"acked_after_effect":True,"idempotency_key":"job-iqu-1","backoff":True}}
invalid = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-most-once","effect_durable":False,"acked_after_effect":False,"idempotency_key":"","backoff":False}}
incomplete = {**valid}
incomplete.pop("backoff")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS NACK_AND_RETRY MISSING:backoff` ,
        },
      },
      {
        id: "S45-T2-A-E3",
        subtopicId: "S45-T2-A",
        kind: "transfer",
        instruction: "S45-T2-A-E3 · Defiende fallo cerrado para `queue/event y delivery semantics` con tres fixtures distintos. `CASO-IQU-045-2A` debe continuar, el adverso debe devolver `NACK_AND_RETRY` y la ausencia de `backoff` debe devolver `VERIFY_DELIVERY_SEMANTICS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `VERIFY_DELIVERY_SEMANTICS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `VERIFY_DELIVERY_SEMANTICS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ack posterior al efecto, key idempotente y backoff; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: ack posterior al efecto, key idempotente y backoff", "CASO-IQU-045-2A es sintético"],
        tests: "Fixtures `CASO-IQU-045-2A`, adverso y sin `backoff` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa NACK_AND_RETRY y por qué faltar backoff exige VERIFY_DELIVERY_SEMANTICS.",
        starterCode: {
          language: 'python',
          title: "s45-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "delivery", "effect_durable", "acked_after_effect", "idempotency_key", "backoff"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["acked_after_effect"] or not record["idempotency_key"] else "NACK_AND_RETRY"

valid = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-least-once","effect_durable":True,"acked_after_effect":True,"idempotency_key":"job-iqu-1","backoff":True}}
invalid = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-most-once","effect_durable":False,"acked_after_effect":False,"idempotency_key":"","backoff":False}}
uncertain = {**valid}
uncertain.pop("backoff")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "delivery", "effect_durable", "acked_after_effect", "idempotency_key", "backoff"}
    missing = sorted(required - record.keys())
    if missing:
        return "VERIFY_DELIVERY_SEMANTICS"
    return "CONTINUE" if record["delivery"] == "at-least-once" and record["effect_durable"] and record["acked_after_effect"] and bool(record["idempotency_key"]) and record["backoff"] else "NACK_AND_RETRY"

valid = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-least-once","effect_durable":True,"acked_after_effect":True,"idempotency_key":"job-iqu-1","backoff":True}}
invalid = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-most-once","effect_durable":False,"acked_after_effect":False,"idempotency_key":"","backoff":False}}
uncertain = {**valid}
uncertain.pop("backoff")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "NACK_AND_RETRY", "VERIFY_DELIVERY_SEMANTICS"]` ,
          output: `CONTINUE NACK_AND_RETRY VERIFY_DELIVERY_SEMANTICS` ,
        },
      },
      {
        id: "S45-T2-B-E1",
        subtopicId: "S45-T2-B",
        kind: "guided",
        instruction: "S45-T2-B-E1 · Modela el contrato de `dedup, ordering y dead-letter` sobre `CASO-IQU-045-2B`. La entrada es el dict completo del starter; la operación debe demostrar deduplicación, ordering acotado y terminal en DLQ. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S45-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `DEDUP_OR_DLQ` en E2.",
        hint: "Relaciona los campos `message_ids`, `processed_ids`, `ordered_partition`, `terminal_in_dlq` con la regla explicada en S45-T2-B.",
        hints: [
          "Relaciona los campos `message_ids`, `processed_ids`, `ordered_partition`, `terminal_in_dlq` con la regla explicada en S45-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva duplicado, desorden y terminal en DLQ probados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: deduplicación, ordering acotado y terminal en DLQ", "CASO-IQU-045-2B es sintético"],
        tests: "El fixture `CASO-IQU-045-2B` satisface un predicado de dominio real; imprime `S45-T2-B PASS` y el assert booleano pasa.",
        feedback: "S45-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DEDUP_OR_DLQ y por qué faltar terminal_in_dlq exige INSPECT_MESSAGE_ORDER.",
        starterCode: {
          language: 'python',
          title: "s45-t2-b-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1","m2"},"ordered_partition":True,"terminal_in_dlq":True}}
meets_contract = len(record["processed_ids"]) == len(record["message_ids"]) or not record["terminal_in_dlq"]
status = "PASS" if meets_contract else "DEDUP_OR_DLQ"
print("S45-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t2-b-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1","m2"},"ordered_partition":True,"terminal_in_dlq":True}}
meets_contract = set(record["message_ids"]) == record["processed_ids"] and len(record["processed_ids"]) == 2 and record["ordered_partition"] and record["terminal_in_dlq"]
status = "PASS" if meets_contract else "DEDUP_OR_DLQ"
print("S45-T2-B", status)
assert meets_contract is True` ,
          output: `S45-T2-B PASS` ,
        },
      },
      {
        id: "S45-T2-B-E2",
        subtopicId: "S45-T2-B",
        kind: "independent",
        instruction: "S45-T2-B-E2 · Audita tres rutas de `dedup, ordering y dead-letter`: fixture válido, fixture adverso y registro sin `terminal_in_dlq`. Entrada: dict con case_id, message_ids, processed_ids, ordered_partition, terminal_in_dlq. Salidas exactas: `PASS`, `DEDUP_OR_DLQ`, `MISSING:terminal_in_dlq`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a terminal_in_dlq debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a terminal_in_dlq debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T2-B: deduplicación, ordering acotado y terminal en DLQ. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: deduplicación, ordering acotado y terminal en DLQ", "CASO-IQU-045-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `terminal_in_dlq` ausente y produce exactamente `PASS DEDUP_OR_DLQ MISSING:terminal_in_dlq`.",
        feedback: "S45-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DEDUP_OR_DLQ y por qué faltar terminal_in_dlq exige INSPECT_MESSAGE_ORDER.",
        starterCode: {
          language: 'python',
          title: "s45-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "message_ids", "processed_ids", "ordered_partition", "terminal_in_dlq"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if len(record["processed_ids"]) == len(record["message_ids"]) or not record["terminal_in_dlq"] else "DEDUP_OR_DLQ"

valid = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1","m2"},"ordered_partition":True,"terminal_in_dlq":True}}
invalid = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1"},"ordered_partition":False,"terminal_in_dlq":False}}
incomplete = {**valid}
incomplete.pop("terminal_in_dlq")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "message_ids", "processed_ids", "ordered_partition", "terminal_in_dlq"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if set(record["message_ids"]) == record["processed_ids"] and len(record["processed_ids"]) == 2 and record["ordered_partition"] and record["terminal_in_dlq"] else "DEDUP_OR_DLQ"

valid = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1","m2"},"ordered_partition":True,"terminal_in_dlq":True}}
invalid = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1"},"ordered_partition":False,"terminal_in_dlq":False}}
incomplete = {**valid}
incomplete.pop("terminal_in_dlq")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DEDUP_OR_DLQ MISSING:terminal_in_dlq` ,
        },
      },
      {
        id: "S45-T2-B-E3",
        subtopicId: "S45-T2-B",
        kind: "transfer",
        instruction: "S45-T2-B-E3 · Recupera fallo cerrado para `dedup, ordering y dead-letter` con tres fixtures distintos. `CASO-IQU-045-2B` debe continuar, el adverso debe devolver `DEDUP_OR_DLQ` y la ausencia de `terminal_in_dlq` debe devolver `INSPECT_MESSAGE_ORDER`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `INSPECT_MESSAGE_ORDER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INSPECT_MESSAGE_ORDER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró deduplicación, ordering acotado y terminal en DLQ; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: deduplicación, ordering acotado y terminal en DLQ", "CASO-IQU-045-2B es sintético"],
        tests: "Fixtures `CASO-IQU-045-2B`, adverso y sin `terminal_in_dlq` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DEDUP_OR_DLQ y por qué faltar terminal_in_dlq exige INSPECT_MESSAGE_ORDER.",
        starterCode: {
          language: 'python',
          title: "s45-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "message_ids", "processed_ids", "ordered_partition", "terminal_in_dlq"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if len(record["processed_ids"]) == len(record["message_ids"]) or not record["terminal_in_dlq"] else "DEDUP_OR_DLQ"

valid = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1","m2"},"ordered_partition":True,"terminal_in_dlq":True}}
invalid = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1"},"ordered_partition":False,"terminal_in_dlq":False}}
uncertain = {**valid}
uncertain.pop("terminal_in_dlq")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "message_ids", "processed_ids", "ordered_partition", "terminal_in_dlq"}
    missing = sorted(required - record.keys())
    if missing:
        return "INSPECT_MESSAGE_ORDER"
    return "CONTINUE" if set(record["message_ids"]) == record["processed_ids"] and len(record["processed_ids"]) == 2 and record["ordered_partition"] and record["terminal_in_dlq"] else "DEDUP_OR_DLQ"

valid = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1","m2"},"ordered_partition":True,"terminal_in_dlq":True}}
invalid = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1"},"ordered_partition":False,"terminal_in_dlq":False}}
uncertain = {**valid}
uncertain.pop("terminal_in_dlq")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DEDUP_OR_DLQ", "INSPECT_MESSAGE_ORDER"]` ,
          output: `CONTINUE DEDUP_OR_DLQ INSPECT_MESSAGE_ORDER` ,
        },
      },
      {
        id: "S45-T3-A-E1",
        subtopicId: "S45-T3-A",
        kind: "guided",
        instruction: "S45-T3-A-E1 · Verifica el contrato de `compute, autoscaling y networking` sobre `CASO-IQU-045-3A`. La entrada es el dict completo del starter; la operación debe demostrar workers dentro de cuota y backlog por worker bajo objetivo. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S45-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `APPLY_BACKPRESSURE` en E2.",
        hint: "Relaciona los campos `backlog`, `workers`, `target_per_worker`, `quota_workers`, `private_network`, `backpressure` con la regla explicada en S45-T3-A.",
        hints: [
          "Relaciona los campos `backlog`, `workers`, `target_per_worker`, `quota_workers`, `private_network`, `backpressure` con la regla explicada en S45-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva carga sintética respeta SLO y cuota; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers dentro de cuota y backlog por worker bajo objetivo", "CASO-IQU-045-3A es sintético"],
        tests: "El fixture `CASO-IQU-045-3A` satisface un predicado de dominio real; imprime `S45-T3-A PASS` y el assert booleano pasa.",
        feedback: "S45-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa APPLY_BACKPRESSURE y por qué faltar backpressure exige REQUEST_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s45-t3-a-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-3A", **{"backlog":80,"workers":4,"target_per_worker":25,"quota_workers":6,"private_network":True,"backpressure":True}}
meets_contract = record["workers"] > record["quota_workers"] or not record["backpressure"]
status = "PASS" if meets_contract else "APPLY_BACKPRESSURE"
print("S45-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t3-a-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-3A", **{"backlog":80,"workers":4,"target_per_worker":25,"quota_workers":6,"private_network":True,"backpressure":True}}
meets_contract = record["workers"] <= record["quota_workers"] and record["backlog"] / record["workers"] <= record["target_per_worker"] and record["private_network"] and record["backpressure"]
status = "PASS" if meets_contract else "APPLY_BACKPRESSURE"
print("S45-T3-A", status)
assert meets_contract is True` ,
          output: `S45-T3-A PASS` ,
        },
      },
      {
        id: "S45-T3-A-E2",
        subtopicId: "S45-T3-A",
        kind: "independent",
        instruction: "S45-T3-A-E2 · Decide tres rutas de `compute, autoscaling y networking`: fixture válido, fixture adverso y registro sin `backpressure`. Entrada: dict con case_id, backlog, workers, target_per_worker, quota_workers, private_network, backpressure. Salidas exactas: `PASS`, `APPLY_BACKPRESSURE`, `MISSING:backpressure`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a backpressure debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a backpressure debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T3-A: workers dentro de cuota y backlog por worker bajo objetivo. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers dentro de cuota y backlog por worker bajo objetivo", "CASO-IQU-045-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backpressure` ausente y produce exactamente `PASS APPLY_BACKPRESSURE MISSING:backpressure`.",
        feedback: "S45-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa APPLY_BACKPRESSURE y por qué faltar backpressure exige REQUEST_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s45-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "backlog", "workers", "target_per_worker", "quota_workers", "private_network", "backpressure"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["workers"] > record["quota_workers"] or not record["backpressure"] else "APPLY_BACKPRESSURE"

valid = {"case_id": "CASO-IQU-045-3A", **{"backlog":80,"workers":4,"target_per_worker":25,"quota_workers":6,"private_network":True,"backpressure":True}}
invalid = {"case_id": "CASO-IQU-045-3A", **{"backlog":500,"workers":2,"target_per_worker":25,"quota_workers":6,"private_network":False,"backpressure":False}}
incomplete = {**valid}
incomplete.pop("backpressure")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "backlog", "workers", "target_per_worker", "quota_workers", "private_network", "backpressure"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["workers"] <= record["quota_workers"] and record["backlog"] / record["workers"] <= record["target_per_worker"] and record["private_network"] and record["backpressure"] else "APPLY_BACKPRESSURE"

valid = {"case_id": "CASO-IQU-045-3A", **{"backlog":80,"workers":4,"target_per_worker":25,"quota_workers":6,"private_network":True,"backpressure":True}}
invalid = {"case_id": "CASO-IQU-045-3A", **{"backlog":500,"workers":2,"target_per_worker":25,"quota_workers":6,"private_network":False,"backpressure":False}}
incomplete = {**valid}
incomplete.pop("backpressure")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS APPLY_BACKPRESSURE MISSING:backpressure` ,
        },
      },
      {
        id: "S45-T3-A-E3",
        subtopicId: "S45-T3-A",
        kind: "transfer",
        instruction: "S45-T3-A-E3 · Contrasta fallo cerrado para `compute, autoscaling y networking` con tres fixtures distintos. `CASO-IQU-045-3A` debe continuar, el adverso debe devolver `APPLY_BACKPRESSURE` y la ausencia de `backpressure` debe devolver `REQUEST_CAPACITY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_CAPACITY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_CAPACITY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró workers dentro de cuota y backlog por worker bajo objetivo; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers dentro de cuota y backlog por worker bajo objetivo", "CASO-IQU-045-3A es sintético"],
        tests: "Fixtures `CASO-IQU-045-3A`, adverso y sin `backpressure` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa APPLY_BACKPRESSURE y por qué faltar backpressure exige REQUEST_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s45-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "backlog", "workers", "target_per_worker", "quota_workers", "private_network", "backpressure"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["workers"] > record["quota_workers"] or not record["backpressure"] else "APPLY_BACKPRESSURE"

valid = {"case_id": "CASO-IQU-045-3A", **{"backlog":80,"workers":4,"target_per_worker":25,"quota_workers":6,"private_network":True,"backpressure":True}}
invalid = {"case_id": "CASO-IQU-045-3A", **{"backlog":500,"workers":2,"target_per_worker":25,"quota_workers":6,"private_network":False,"backpressure":False}}
uncertain = {**valid}
uncertain.pop("backpressure")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "backlog", "workers", "target_per_worker", "quota_workers", "private_network", "backpressure"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CAPACITY"
    return "CONTINUE" if record["workers"] <= record["quota_workers"] and record["backlog"] / record["workers"] <= record["target_per_worker"] and record["private_network"] and record["backpressure"] else "APPLY_BACKPRESSURE"

valid = {"case_id": "CASO-IQU-045-3A", **{"backlog":80,"workers":4,"target_per_worker":25,"quota_workers":6,"private_network":True,"backpressure":True}}
invalid = {"case_id": "CASO-IQU-045-3A", **{"backlog":500,"workers":2,"target_per_worker":25,"quota_workers":6,"private_network":False,"backpressure":False}}
uncertain = {**valid}
uncertain.pop("backpressure")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "APPLY_BACKPRESSURE", "REQUEST_CAPACITY"]` ,
          output: `CONTINUE APPLY_BACKPRESSURE REQUEST_CAPACITY` ,
        },
      },
      {
        id: "S45-T3-B-E1",
        subtopicId: "S45-T3-B",
        kind: "guided",
        instruction: "S45-T3-B-E1 · Clasifica el contrato de `IAM, private paths y egress` sobre `CASO-IQU-045-3B`. La entrada es el dict completo del starter; la operación debe demostrar acción IAM mínima, path privado y egress allowlisted. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S45-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `DENY_IAM_OR_EGRESS` en E2.",
        hint: "Relaciona los campos `allowed_actions`, `requested_action`, `private_path`, `egress_host`, `egress_allow` con la regla explicada en S45-T3-B.",
        hints: [
          "Relaciona los campos `allowed_actions`, `requested_action`, `private_path`, `egress_host`, `egress_allow` con la regla explicada en S45-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva policy negativa y egress bloqueado probados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción IAM mínima, path privado y egress allowlisted", "CASO-IQU-045-3B es sintético"],
        tests: "El fixture `CASO-IQU-045-3B` satisface un predicado de dominio real; imprime `S45-T3-B PASS` y el assert booleano pasa.",
        feedback: "S45-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DENY_IAM_OR_EGRESS y por qué faltar egress_allow exige REQUEST_SCOPED_POLICY.",
        starterCode: {
          language: 'python',
          title: "s45-t3-b-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get","queue:ack"},"requested_action":"object:get","private_path":True,"egress_host":"api.internal","egress_allow":{"api.internal"}}}
meets_contract = record["requested_action"] not in record["allowed_actions"] or record["egress_host"] not in record["egress_allow"]
status = "PASS" if meets_contract else "DENY_IAM_OR_EGRESS"
print("S45-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t3-b-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get","queue:ack"},"requested_action":"object:get","private_path":True,"egress_host":"api.internal","egress_allow":{"api.internal"}}}
meets_contract = record["requested_action"] in record["allowed_actions"] and record["private_path"] and record["egress_host"] in record["egress_allow"]
status = "PASS" if meets_contract else "DENY_IAM_OR_EGRESS"
print("S45-T3-B", status)
assert meets_contract is True` ,
          output: `S45-T3-B PASS` ,
        },
      },
      {
        id: "S45-T3-B-E2",
        subtopicId: "S45-T3-B",
        kind: "independent",
        instruction: "S45-T3-B-E2 · Calcula tres rutas de `IAM, private paths y egress`: fixture válido, fixture adverso y registro sin `egress_allow`. Entrada: dict con case_id, allowed_actions, requested_action, private_path, egress_host, egress_allow. Salidas exactas: `PASS`, `DENY_IAM_OR_EGRESS`, `MISSING:egress_allow`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a egress_allow debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a egress_allow debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T3-B: acción IAM mínima, path privado y egress allowlisted. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción IAM mínima, path privado y egress allowlisted", "CASO-IQU-045-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `egress_allow` ausente y produce exactamente `PASS DENY_IAM_OR_EGRESS MISSING:egress_allow`.",
        feedback: "S45-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DENY_IAM_OR_EGRESS y por qué faltar egress_allow exige REQUEST_SCOPED_POLICY.",
        starterCode: {
          language: 'python',
          title: "s45-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "allowed_actions", "requested_action", "private_path", "egress_host", "egress_allow"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["requested_action"] not in record["allowed_actions"] or record["egress_host"] not in record["egress_allow"] else "DENY_IAM_OR_EGRESS"

valid = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get","queue:ack"},"requested_action":"object:get","private_path":True,"egress_host":"api.internal","egress_allow":{"api.internal"}}}
invalid = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get"},"requested_action":"iam:admin","private_path":False,"egress_host":"unknown.example","egress_allow":{"api.internal"}}}
incomplete = {**valid}
incomplete.pop("egress_allow")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "allowed_actions", "requested_action", "private_path", "egress_host", "egress_allow"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["requested_action"] in record["allowed_actions"] and record["private_path"] and record["egress_host"] in record["egress_allow"] else "DENY_IAM_OR_EGRESS"

valid = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get","queue:ack"},"requested_action":"object:get","private_path":True,"egress_host":"api.internal","egress_allow":{"api.internal"}}}
invalid = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get"},"requested_action":"iam:admin","private_path":False,"egress_host":"unknown.example","egress_allow":{"api.internal"}}}
incomplete = {**valid}
incomplete.pop("egress_allow")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DENY_IAM_OR_EGRESS MISSING:egress_allow` ,
        },
      },
      {
        id: "S45-T3-B-E3",
        subtopicId: "S45-T3-B",
        kind: "transfer",
        instruction: "S45-T3-B-E3 · Instrumenta fallo cerrado para `IAM, private paths y egress` con tres fixtures distintos. `CASO-IQU-045-3B` debe continuar, el adverso debe devolver `DENY_IAM_OR_EGRESS` y la ausencia de `egress_allow` debe devolver `REQUEST_SCOPED_POLICY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_SCOPED_POLICY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_SCOPED_POLICY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró acción IAM mínima, path privado y egress allowlisted; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción IAM mínima, path privado y egress allowlisted", "CASO-IQU-045-3B es sintético"],
        tests: "Fixtures `CASO-IQU-045-3B`, adverso y sin `egress_allow` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DENY_IAM_OR_EGRESS y por qué faltar egress_allow exige REQUEST_SCOPED_POLICY.",
        starterCode: {
          language: 'python',
          title: "s45-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "allowed_actions", "requested_action", "private_path", "egress_host", "egress_allow"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["requested_action"] not in record["allowed_actions"] or record["egress_host"] not in record["egress_allow"] else "DENY_IAM_OR_EGRESS"

valid = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get","queue:ack"},"requested_action":"object:get","private_path":True,"egress_host":"api.internal","egress_allow":{"api.internal"}}}
invalid = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get"},"requested_action":"iam:admin","private_path":False,"egress_host":"unknown.example","egress_allow":{"api.internal"}}}
uncertain = {**valid}
uncertain.pop("egress_allow")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "allowed_actions", "requested_action", "private_path", "egress_host", "egress_allow"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_SCOPED_POLICY"
    return "CONTINUE" if record["requested_action"] in record["allowed_actions"] and record["private_path"] and record["egress_host"] in record["egress_allow"] else "DENY_IAM_OR_EGRESS"

valid = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get","queue:ack"},"requested_action":"object:get","private_path":True,"egress_host":"api.internal","egress_allow":{"api.internal"}}}
invalid = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get"},"requested_action":"iam:admin","private_path":False,"egress_host":"unknown.example","egress_allow":{"api.internal"}}}
uncertain = {**valid}
uncertain.pop("egress_allow")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DENY_IAM_OR_EGRESS", "REQUEST_SCOPED_POLICY"]` ,
          output: `CONTINUE DENY_IAM_OR_EGRESS REQUEST_SCOPED_POLICY` ,
        },
      },
      {
        id: "S45-T4-A-E1",
        subtopicId: "S45-T4-A",
        kind: "guided",
        instruction: "S45-T4-A-E1 · Audita el contrato de `configuración declarativa y environments` sobre `CASO-IQU-045-4A`. La entrada es el dict completo del starter; la operación debe demostrar plan coincide, entorno válido, sin secretos ni destrucción. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S45-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_IAC_PLAN` en E2.",
        hint: "Relaciona los campos `declared_resources`, `planned_resources`, `environment`, `secret_values_in_plan`, `destructive_changes` con la regla explicada en S45-T4-A.",
        hints: [
          "Relaciona los campos `declared_resources`, `planned_resources`, `environment`, `secret_values_in_plan`, `destructive_changes` con la regla explicada en S45-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva plan sin drift destructivo inesperado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: plan coincide, entorno válido, sin secretos ni destrucción", "CASO-IQU-045-4A es sintético"],
        tests: "El fixture `CASO-IQU-045-4A` satisface un predicado de dominio real; imprime `S45-T4-A PASS` y el assert booleano pasa.",
        feedback: "S45-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_IAC_PLAN y por qué faltar destructive_changes exige REVIEW_DRIFT.",
        starterCode: {
          language: 'python',
          title: "s45-t4-a-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"queue","bucket"},"environment":"staging","secret_values_in_plan":False,"destructive_changes":0}}
meets_contract = record["secret_values_in_plan"] or record["destructive_changes"] > 0
status = "PASS" if meets_contract else "REJECT_IAC_PLAN"
print("S45-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t4-a-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"queue","bucket"},"environment":"staging","secret_values_in_plan":False,"destructive_changes":0}}
meets_contract = record["declared_resources"] == record["planned_resources"] and record["environment"] in {"dev","staging","prod"} and not record["secret_values_in_plan"] and record["destructive_changes"] == 0
status = "PASS" if meets_contract else "REJECT_IAC_PLAN"
print("S45-T4-A", status)
assert meets_contract is True` ,
          output: `S45-T4-A PASS` ,
        },
      },
      {
        id: "S45-T4-A-E2",
        subtopicId: "S45-T4-A",
        kind: "independent",
        instruction: "S45-T4-A-E2 · Compara tres rutas de `configuración declarativa y environments`: fixture válido, fixture adverso y registro sin `destructive_changes`. Entrada: dict con case_id, declared_resources, planned_resources, environment, secret_values_in_plan, destructive_changes. Salidas exactas: `PASS`, `REJECT_IAC_PLAN`, `MISSING:destructive_changes`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a destructive_changes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a destructive_changes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T4-A: plan coincide, entorno válido, sin secretos ni destrucción. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: plan coincide, entorno válido, sin secretos ni destrucción", "CASO-IQU-045-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `destructive_changes` ausente y produce exactamente `PASS REJECT_IAC_PLAN MISSING:destructive_changes`.",
        feedback: "S45-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_IAC_PLAN y por qué faltar destructive_changes exige REVIEW_DRIFT.",
        starterCode: {
          language: 'python',
          title: "s45-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "declared_resources", "planned_resources", "environment", "secret_values_in_plan", "destructive_changes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["secret_values_in_plan"] or record["destructive_changes"] > 0 else "REJECT_IAC_PLAN"

valid = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"queue","bucket"},"environment":"staging","secret_values_in_plan":False,"destructive_changes":0}}
invalid = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"bucket"},"environment":"shared","secret_values_in_plan":True,"destructive_changes":1}}
incomplete = {**valid}
incomplete.pop("destructive_changes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "declared_resources", "planned_resources", "environment", "secret_values_in_plan", "destructive_changes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["declared_resources"] == record["planned_resources"] and record["environment"] in {"dev","staging","prod"} and not record["secret_values_in_plan"] and record["destructive_changes"] == 0 else "REJECT_IAC_PLAN"

valid = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"queue","bucket"},"environment":"staging","secret_values_in_plan":False,"destructive_changes":0}}
invalid = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"bucket"},"environment":"shared","secret_values_in_plan":True,"destructive_changes":1}}
incomplete = {**valid}
incomplete.pop("destructive_changes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_IAC_PLAN MISSING:destructive_changes` ,
        },
      },
      {
        id: "S45-T4-A-E3",
        subtopicId: "S45-T4-A",
        kind: "transfer",
        instruction: "S45-T4-A-E3 · Aísla fallo cerrado para `configuración declarativa y environments` con tres fixtures distintos. `CASO-IQU-045-4A` debe continuar, el adverso debe devolver `REJECT_IAC_PLAN` y la ausencia de `destructive_changes` debe devolver `REVIEW_DRIFT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_DRIFT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_DRIFT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró plan coincide, entorno válido, sin secretos ni destrucción; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: plan coincide, entorno válido, sin secretos ni destrucción", "CASO-IQU-045-4A es sintético"],
        tests: "Fixtures `CASO-IQU-045-4A`, adverso y sin `destructive_changes` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_IAC_PLAN y por qué faltar destructive_changes exige REVIEW_DRIFT.",
        starterCode: {
          language: 'python',
          title: "s45-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "declared_resources", "planned_resources", "environment", "secret_values_in_plan", "destructive_changes"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["secret_values_in_plan"] or record["destructive_changes"] > 0 else "REJECT_IAC_PLAN"

valid = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"queue","bucket"},"environment":"staging","secret_values_in_plan":False,"destructive_changes":0}}
invalid = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"bucket"},"environment":"shared","secret_values_in_plan":True,"destructive_changes":1}}
uncertain = {**valid}
uncertain.pop("destructive_changes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "declared_resources", "planned_resources", "environment", "secret_values_in_plan", "destructive_changes"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_DRIFT"
    return "CONTINUE" if record["declared_resources"] == record["planned_resources"] and record["environment"] in {"dev","staging","prod"} and not record["secret_values_in_plan"] and record["destructive_changes"] == 0 else "REJECT_IAC_PLAN"

valid = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"queue","bucket"},"environment":"staging","secret_values_in_plan":False,"destructive_changes":0}}
invalid = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"bucket"},"environment":"shared","secret_values_in_plan":True,"destructive_changes":1}}
uncertain = {**valid}
uncertain.pop("destructive_changes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_IAC_PLAN", "REVIEW_DRIFT"]` ,
          output: `CONTINUE REJECT_IAC_PLAN REVIEW_DRIFT` ,
        },
      },
      {
        id: "S45-T4-B-E1",
        subtopicId: "S45-T4-B",
        kind: "guided",
        instruction: "S45-T4-B-E1 · Decide el contrato de `costos, quotas, recovery y portability` sobre `CASO-IQU-045-4B`. La entrada es el dict completo del starter; la operación debe demostrar costo/cuota bajo límite y recovery/portability ensayados. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S45-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `FREEZE_SCALE_OUT` en E2.",
        hint: "Relaciona los campos `forecast_pen`, `budget_pen`, `quota_used`, `quota_limit`, `restore_tested`, `portable_export` con la regla explicada en S45-T4-B.",
        hints: [
          "Relaciona los campos `forecast_pen`, `budget_pen`, `quota_used`, `quota_limit`, `restore_tested`, `portable_export` con la regla explicada en S45-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva alarma de costo y recuperación documentadas; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: costo/cuota bajo límite y recovery/portability ensayados", "CASO-IQU-045-4B es sintético"],
        tests: "El fixture `CASO-IQU-045-4B` satisface un predicado de dominio real; imprime `S45-T4-B PASS` y el assert booleano pasa.",
        feedback: "S45-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa FREEZE_SCALE_OUT y por qué faltar portable_export exige COST_OWNER_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s45-t4-b-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":820,"budget_pen":1000,"quota_used":72,"quota_limit":100,"restore_tested":True,"portable_export":True}}
meets_contract = record["forecast_pen"] > record["budget_pen"] or record["quota_used"] > record["quota_limit"]
status = "PASS" if meets_contract else "FREEZE_SCALE_OUT"
print("S45-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t4-b-e1.py",
          code: `record = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":820,"budget_pen":1000,"quota_used":72,"quota_limit":100,"restore_tested":True,"portable_export":True}}
meets_contract = record["forecast_pen"] <= record["budget_pen"] and record["quota_used"] <= record["quota_limit"] and record["restore_tested"] and record["portable_export"]
status = "PASS" if meets_contract else "FREEZE_SCALE_OUT"
print("S45-T4-B", status)
assert meets_contract is True` ,
          output: `S45-T4-B PASS` ,
        },
      },
      {
        id: "S45-T4-B-E2",
        subtopicId: "S45-T4-B",
        kind: "independent",
        instruction: "S45-T4-B-E2 · Filtra tres rutas de `costos, quotas, recovery y portability`: fixture válido, fixture adverso y registro sin `portable_export`. Entrada: dict con case_id, forecast_pen, budget_pen, quota_used, quota_limit, restore_tested, portable_export. Salidas exactas: `PASS`, `FREEZE_SCALE_OUT`, `MISSING:portable_export`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a portable_export debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a portable_export debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T4-B: costo/cuota bajo límite y recovery/portability ensayados. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: costo/cuota bajo límite y recovery/portability ensayados", "CASO-IQU-045-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `portable_export` ausente y produce exactamente `PASS FREEZE_SCALE_OUT MISSING:portable_export`.",
        feedback: "S45-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa FREEZE_SCALE_OUT y por qué faltar portable_export exige COST_OWNER_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s45-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "forecast_pen", "budget_pen", "quota_used", "quota_limit", "restore_tested", "portable_export"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["forecast_pen"] > record["budget_pen"] or record["quota_used"] > record["quota_limit"] else "FREEZE_SCALE_OUT"

valid = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":820,"budget_pen":1000,"quota_used":72,"quota_limit":100,"restore_tested":True,"portable_export":True}}
invalid = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":1500,"budget_pen":1000,"quota_used":120,"quota_limit":100,"restore_tested":False,"portable_export":False}}
incomplete = {**valid}
incomplete.pop("portable_export")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "forecast_pen", "budget_pen", "quota_used", "quota_limit", "restore_tested", "portable_export"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["forecast_pen"] <= record["budget_pen"] and record["quota_used"] <= record["quota_limit"] and record["restore_tested"] and record["portable_export"] else "FREEZE_SCALE_OUT"

valid = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":820,"budget_pen":1000,"quota_used":72,"quota_limit":100,"restore_tested":True,"portable_export":True}}
invalid = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":1500,"budget_pen":1000,"quota_used":120,"quota_limit":100,"restore_tested":False,"portable_export":False}}
incomplete = {**valid}
incomplete.pop("portable_export")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS FREEZE_SCALE_OUT MISSING:portable_export` ,
        },
      },
      {
        id: "S45-T4-B-E3",
        subtopicId: "S45-T4-B",
        kind: "transfer",
        instruction: "S45-T4-B-E3 · Demuestra fallo cerrado para `costos, quotas, recovery y portability` con tres fixtures distintos. `CASO-IQU-045-4B` debe continuar, el adverso debe devolver `FREEZE_SCALE_OUT` y la ausencia de `portable_export` debe devolver `COST_OWNER_REVIEW`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `COST_OWNER_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `COST_OWNER_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró costo/cuota bajo límite y recovery/portability ensayados; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: costo/cuota bajo límite y recovery/portability ensayados", "CASO-IQU-045-4B es sintético"],
        tests: "Fixtures `CASO-IQU-045-4B`, adverso y sin `portable_export` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa FREEZE_SCALE_OUT y por qué faltar portable_export exige COST_OWNER_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s45-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "forecast_pen", "budget_pen", "quota_used", "quota_limit", "restore_tested", "portable_export"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["forecast_pen"] > record["budget_pen"] or record["quota_used"] > record["quota_limit"] else "FREEZE_SCALE_OUT"

valid = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":820,"budget_pen":1000,"quota_used":72,"quota_limit":100,"restore_tested":True,"portable_export":True}}
invalid = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":1500,"budget_pen":1000,"quota_used":120,"quota_limit":100,"restore_tested":False,"portable_export":False}}
uncertain = {**valid}
uncertain.pop("portable_export")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s45-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "forecast_pen", "budget_pen", "quota_used", "quota_limit", "restore_tested", "portable_export"}
    missing = sorted(required - record.keys())
    if missing:
        return "COST_OWNER_REVIEW"
    return "CONTINUE" if record["forecast_pen"] <= record["budget_pen"] and record["quota_used"] <= record["quota_limit"] and record["restore_tested"] and record["portable_export"] else "FREEZE_SCALE_OUT"

valid = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":820,"budget_pen":1000,"quota_used":72,"quota_limit":100,"restore_tested":True,"portable_export":True}}
invalid = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":1500,"budget_pen":1000,"quota_used":120,"quota_limit":100,"restore_tested":False,"portable_export":False}}
uncertain = {**valid}
uncertain.pop("portable_export")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "FREEZE_SCALE_OUT", "COST_OWNER_REVIEW"]` ,
          output: `CONTINUE FREEZE_SCALE_OUT COST_OWNER_REVIEW` ,
        },
      },
    ],
  },
  youDo: {
    title: "Cloud, almacenamiento, colas e infraestructura",
    context: "Arquitectura distribuida mínima declarativa. Trabaja sobre procesamiento sintético de reportes para una organización ficticia en Iquitos. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida: estado durable, resultado en object store y fallas terminales en dead-letter queue. El gate se bloquea ante: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención.",
    objectives: [
      "Convertir job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos en estado durable, resultado en object store y fallas terminales en dead-letter queue.",
      "Demostrar el gate: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
      "Probar el fallo: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-IQU-045`.",
      "Incluye decisión de store/cache y consistencia.",
      "Incluye cola con deduplicación/retry/DLQ.",
      "Incluye IAM, red y egress mínimos.",
      "Incluye IaC por entorno con presupuesto, cuotas y restore.",
      "Automatiza un caso normal, uno de breach (`SEND_TO_DLQ`) y uno incierto (`PAUSE_AND_INSPECT`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-IQU-045"
REQUIRED = ['decision_de_store_cache_y_consistencia', 'cola_con_deduplicacion_retry_dlq', 'iam_red_y_egress_minimos', 'iac_por_entorno_con_presupuesto_cuotas_y_restore']
evidence = {
    "decision_de_store_cache_y_consistencia": False,
    "cola_con_deduplicacion_retry_dlq": False,
    "iam_red_y_egress_minimos": False,
    "iac_por_entorno_con_presupuesto_cuotas_y_restore": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-B · job asíncrono resiliente: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `object store, relacional y cache` en CASO-IQU-045?",
        options: ["ADR de persistencia con fuente de verdad", "un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"],
        correctIndex: 0,
        explanation: "La teoría exige ADR de persistencia con fuente de verdad; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S45, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "emitir SEND_TO_DLQ y conservar evidencia", "borrar el trace para reducir ruido"],
        correctIndex: 2,
        explanation: "El contrato falla cerrado con SEND_TO_DLQ; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-B · job asíncrono resiliente`?",
        options: ["el archivo S45 existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva", "reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos"],
        correctIndex: 3,
        explanation: "El gate es conductual y medible: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
      },
      {
        question: "¿Qué tratamiento de `CASO-IQU-045` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER"],
        correctIndex: 1,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Terraform language",
        url: "https://developer.hashicorp.com/terraform/language",
        note: "Infraestructura declarativa y state",
      },
      {
        label: "AWS Well-Architected Framework",
        url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
        note: "Reliability, security y cost",
      },
      {
        label: "CloudEvents",
        url: "https://cloudevents.io/",
        note: "Envelope interoperable de eventos",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Consulta selectiva: contratos, consistencia, operación y trade-offs; no reemplaza las instrucciones de la sección." },
      { label: "Site Reliability Engineering", note: "Consulta selectiva: SLO, incidentes, capacidad y cambio seguro." },
    ],
    courses: [
      { label: "MIT OpenCourseWare — 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Referencia de práctica incremental y contratos verificables." },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Referencia de problem sets, tests y proyecto final reproducible." },
    ],
  },
}
