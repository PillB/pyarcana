import type { CourseSection } from '../../types'

export const section45: CourseSection = {
  id: "iac",
  index: 45,
  title: "Cloud, almacenamiento, colas e infraestructura",
  shortTitle: "Cloud y colas",
  tagline: "job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "Cloud",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **cloud, almacenamiento, colas e infraestructura** operan el job asíncrono del control plane: object store de artefactos, estado durable, colas con reintentos y dead-letter (DLQ), e IAM de mínimo privilegio. Se promueve solo cuando los reintentos no duplican resultados y cuando costo, backup y recuperación están medidos. El foco es el contrato del job (almacenamiento + colas + ops), no aprender un vendor o herramienta de IaC como fin en sí mismo.",
  learningOutcomes: [
    { text: "Elegir object store, relacional o cache según el patrón de acceso y declarar la fuente de verdad" },
    { text: "Definir consistencia por operación, lifecycle y un restore sintético con RPO/RTO medidos" },
    { text: "Diseñar colas/eventos con semántica de entrega (p. ej. at-least-once) y ack posterior al efecto durable" },
    { text: "Garantizar deduplicación por clave, ordenamiento acotado y terminalización en DLQ" },
    { text: "Dimensionar compute/autoscaling y red privada con señal de backlog y backpressure" },
    { text: "Restringir IAM al mínimo, paths privados y egress allowlisted con prueba negativa" },
    { text: "Declarar infraestructura por environment y rechazar planes con secretos o destrucción inesperada" },
    { text: "Presupuestar costo/cuotas (montos en PEN sintéticos) y documentar recovery y portabilidad ensayadas" },
  ],
  theory: [
    {
      heading: "Ruta de S45: cloud, almacenamiento, colas e infraestructura",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1; cada término reaparece en su subtema). **Object store:** blobs/artefactos por key (T1-A). **Relacional:** invariantes y consultas (T1-A/B). **Cache:** copia descartable, no fuente de verdad (T1-A). **Delivery semantics:** at-least-once / at-most-once / exactly-once como propiedad compuesta (T2-A). **Visibility timeout:** ventana sin ack tras la cual el mensaje puede reaparecer (T2-A). **Dedup:** idempotency key del mensaje (T2-B). **DLQ:** dead-letter de mensajes venenosos (T2-B). **IAM least-privilege:** permisos mínimos por rol (T3-B). **Egress control:** salidas de red autorizadas (T3-B). **IaC:** infra declarativa por environment (T4-A). **Budget/quota:** costo y límites medidos en **PEN** = soles peruanos sintéticos (T4-B).",
        "Esta sección opera el artefacto de S44 como **job asíncrono en la nube** (modelo didáctico, sin cuenta real): object store, relacional, cache, colas con delivery semantics y presupuestos. Contratos al estilo Well-Architected / lenguaje de IaC (referencia). El caso `CASO-IQU-045` (reportes sintéticos en Iquitos) no usa credenciales ni egress real.",
        "Puente desde S44: el artefacto de pipeline (imagen/paquete firmado o bundle de release) es la **entrada** del job; aquí decides dónde se guarda el resultado, cómo se encola el trabajo, qué pasa si el worker muere a mitad, y con qué permisos y presupuesto corre. No reimplementas CI: **consumes** su salida de forma idempotente.",
        "Producto incremental: arquitectura distribuida mínima. Entrada: job idempotente, artefacto, política de entrega, presupuesto e IAM least-privilege. Salida: estado durable, resultado en object store y terminales en DLQ. Error de promoción: cache como verdad, ack antes de efecto, egress no autorizado o restore no medido.",
        "Orden: T1 persistencia → T2 colas/dedup/DLQ → T3 compute/IAM/egress → T4 configuración declarativa, costo y recovery. Primero ves demos locales del contrato, luego reparas predicados fallidos (válido / adverso / dato faltante) y al final armas el job mínimo en el proyecto. Stack didáctico: **stdlib** de Python modelando contratos cloud **sin cuenta real ni egress**.",
      ],
      code: {
        language: 'python',
        title: "s45_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-IQU-045",
        "gates": ["idempotent_retry", "dlq_present", "iam_least_privilege", "budget_measured"],
        "terraform_only_topic": False,
        "cache_as_source_of_truth_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("terraform_only_topic", c["terraform_only_topic"])
print("cache_as_source_of_truth_ok", c["cache_as_source_of_truth_ok"])
`,
        output: `case CASO-IQU-045
terraform_only_topic False
cache_as_source_of_truth_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción y carga de trabajo",
        content: "CP-N4-B · job asíncrono resiliente: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos. Si falta evidencia, no se promociona. Las ~20 h del catálogo se reparten en teoría+demos (~6 h), labs E1–E3 (~8 h) y el youDo/portfolio del job local con evidencia de gate (~6 h); no hay cuenta cloud real.",
      },
    },
    {
      heading: "Almacén de objetos, relacional y caché",
      subtopicId: "S45-T1-A",
      paragraphs: [
        "Elige **object store** para blobs/artefactos por key (PDF/JSON del reporte), **relacional** para invariantes y consultas (status del job, contadores), y **cache** solo para copias descartables del dashboard. **No uses cache como registro autoritativo**: si el job reintenta, la verdad debe vivir en store o DB durable, no en un TTL que mentirá al revisor. El patrón de acceso decide el medio: escritura rara + lectura por key → object; transacciones e integridad → relacional; hot-path de lectura → cache con TTL.",
        "Contrato local de este subtema. **Entrada:** tipo de dato (blob de reporte, fila de status, lectura caliente). **Salida:** ADR de persistencia con fuente de verdad explícita (`object` | `relational` | `cache`). **Error de diseño:** marcar `cache_authoritative=true` o guardar transacciones solo en cache → `REDESIGN_PERSISTENCE`. **Éxito medible:** un reintento del job relee status desde relacional y el artefacto por key en object store. Si falta el ADR o el campo de TTL, enruta a `WRITE_STORE_ADR`.",
        "En `CASO-IQU-045` (reportes sintéticos, organización ficticia en Iquitos): el PDF/JSON del reporte vive en object store; el status del job (`queued|running|done|failed`) en tabla relacional; un cache opcional acelera lecturas del dashboard y **nunca** es autoritativo. Datos 100% sintéticos; sin PII ni secretos de producción.",
      ],
      code: {
        language: 'python',
        title: "object_relational_cache.py",
        code: `def pick_truth_store(kind: str) -> str:
    """Fuente de verdad por patrón de acceso (modelo local, sin cloud)."""
    return {
        "blob_artifact": "object",
        "job_status": "relational",
        "dashboard_hot": "cache",
    }[kind]

def cache_is_authoritative(role: str) -> bool:
    return role == "cache"  # solo True si alguien mal eligió cache como verdad

adr = {
    "artifact": pick_truth_store("blob_artifact"),
    "status": pick_truth_store("job_status"),
    "hot_read": pick_truth_store("dashboard_hot"),
}
print("adr", adr)
print("cache_authoritative_ok", not cache_is_authoritative(adr["status"]))
print("retriable_truth", adr["artifact"], "+", adr["status"])`,
        output: `adr {'artifact': 'object', 'status': 'relational', 'hot_read': 'cache'}
cache_authoritative_ok True
retriable_truth object + relational`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S45-T1-A: ADR de persistencia con fuente de verdad. Si el diseño rompe el contrato, responde `REDESIGN_PERSISTENCE`; si no alcanza para decidir, `WRITE_STORE_ADR`.",
      },
    },
    {
      heading: "Consistencia, lifecycle y backups",
      subtopicId: "S45-T1-B",
      paragraphs: [
        "La **consistencia se define por operación**, no por eslogan de la plataforma: el status del job suele exigir *read-after-write* (el productor y el dashboard ven el mismo estado tras el commit), mientras un índice de búsqueda puede ser eventual. El **lifecycle** mueve copias calientes a frío y expira temporales; el **backup solo cuenta** cuando un restore medido cumple RPO (edad máxima del backup) y RTO (minutos de restauración).",
        "Contrato local de este subtema. **Entrada:** operación, modelo de consistencia, edad del último backup y tiempo de restore de ensayo. **Salida:** restore sintético dentro de RPO/RTO documentado. **Error:** `backup_age_h > rpo_h` o `restore_minutes > rto_minutes` → `DECLARE_DATA_LOSS_RISK`. **Éxito medible:** drill de restore que rehidrata el status del job de Iquitos dentro del RTO. Si falta `rto_minutes` u otro campo de drill, enruta a `RUN_RESTORE_DRILL`.",
        "En `CASO-IQU-045`: el status relacional del job de reportes se declara *read-after-write*; el object store del artefacto puede ser eventual entre regiones. Un backup diario sintético con restore de 25 min frente a RTO 30 min y RPO 6 h es evidencia de T1-B — no un capturazo de consola.",
      ],
      code: {
        language: 'python',
        title: "consistency_lifecycle_backups.py",
        code: `def restore_within_slo(
    backup_age_h: int, rpo_h: int, restore_min: int, rto_min: int
) -> bool:
    return backup_age_h <= rpo_h and restore_min <= rto_min

def lifecycle_policy(hot_days: int, backup: str) -> dict:
    return {"hot_days": hot_days, "backup": backup, "cold_after_days": hot_days}

print(lifecycle_policy(30, "daily"))
print("consistency", "job_status_read_after_write")
print("restore_ok", restore_within_slo(4, 6, 25, 30))
print("restore_breach", restore_within_slo(24, 6, 90, 30))`,
        output: `{'hot_days': 30, 'backup': 'daily', 'cold_after_days': 30}
consistency job_status_read_after_write
restore_ok True
restore_breach False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S45-T1-B, audita restore sintético dentro de RPO/RTO. Un breach activa `DECLARE_DATA_LOSS_RISK` y una ausencia activa `RUN_RESTORE_DRILL`.",
      },
    },
    {
      heading: "Colas, eventos y semántica de entrega",
      subtopicId: "S45-T2-A",
      paragraphs: [
        "La **cola desacopla** productor y consumidor: el pipeline de S44 encola un mensaje; el worker de S45 lo procesa a su ritmo. **At-least-once** es la semántica realista en la mayoría de colas gestionadas: el mensaje puede reaparecer si el worker muere antes del ack (p. ej. tras un **visibility timeout** sin ack). Por eso el ack va **después** del efecto durable (escribir artefacto + status), el retry usa **backoff**, y el handler es **idempotente** (misma clave → mismo resultado, sin segundo side-effect).",
        "Contrato local de este subtema. **Entrada:** modo de entrega, flag de efecto durable, flag de ack post-efecto, idempotency key y backoff. **Salida:** mensaje reentregado no duplica efecto. **Error:** ack antes de efecto o key vacía → `NACK_AND_RETRY`. **Éxito medible:** dos entregas del mismo `job-iqu-1` dejan un solo artefacto y un solo status `done`. Si falta `backoff` u otro campo de la política, enruta a `VERIFY_DELIVERY_SEMANTICS`.",
        "En `CASO-IQU-045`: cada reporte sintético entra a la cola `jobs` con key estable; el worker escribe el resultado al object store, actualiza status en relacional y **recién entonces** hace ack. Si cae a mitad (timeout de visibilidad), la reentrega relee status y no reimprime el PDF.",
      ],
      code: {
        language: 'python',
        title: "queue_event_delivery.py",
        code: `def can_ack(*, effect_durable: bool, acked_after_effect: bool, key: str) -> bool:
    return effect_durable and acked_after_effect and bool(key)

def redelivers_after_visibility(
    *, acked: bool, processing_s: int, visibility_timeout_s: int
) -> bool:
    """Sin ack y processing >= visibility timeout → el mensaje reaparece (at-least-once)."""
    return (not acked) and processing_s >= visibility_timeout_s

def delivery_contract(mode: str) -> dict:
    return {
        "delivery": mode,
        "dup_possible": mode == "at_least_once",
        "consumer": "idempotent",
    }

c = delivery_contract("at_least_once")
print("delivery", c["delivery"], "dup_possible", c["dup_possible"])
print("ack_ok", can_ack(effect_durable=True, acked_after_effect=True, key="job-iqu-1"))
print("ack_bad", can_ack(effect_durable=False, acked_after_effect=True, key="job-iqu-1"))
print("redeliver", redelivers_after_visibility(acked=False, processing_s=45, visibility_timeout_s=30))
print("no_redeliver_if_acked", redelivers_after_visibility(acked=True, processing_s=45, visibility_timeout_s=30))`,
        output: `delivery at_least_once dup_possible True
ack_ok True
ack_bad False
redeliver True
no_redeliver_if_acked False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S45-T2-A exige mensaje reentregado sin efecto duplicado; no conviertas `NACK_AND_RETRY` ni `VERIFY_DELIVERY_SEMANTICS` en éxito silencioso.",
      },
    },
    {
      heading: "Deduplicación, ordenamiento y dead-letter",
      subtopicId: "S45-T2-B",
      paragraphs: [
        "La **deduplicación** usa una clave estable (idempotency key) en un store durable: primera vez → procesar; reentrega → `dup` sin segundo side-effect. El **orden** solo se garantiza donde se declara (p. ej. por partición); no lo inventes en el consumer. La **DLQ** (dead-letter queue) recibe mensajes *poison* tras N intentos: conserva razón, contador e payload seguro para replay controlado — no un bucle infinito ni un delete silencioso.",
        "Contrato local de este subtema. **Entrada:** clave de mensaje y contador de intentos. **Salida:** `new` en primer consumo, `dup` si la clave ya se vio, `dlq` tras max attempts. **Error:** reintentar sin store de dedup (doble side-effect) o sin terminal en DLQ → `DEDUP_OR_DLQ`. **Éxito medible:** en Iquitos sintético, `ingest` demuestra new/dup y el poison llega a DLQ. Si falta `terminal_in_dlq` o hay duda de orden, enruta a `INSPECT_MESSAGE_ORDER`.",
        "En `CASO-IQU-045-2B`: claves `m1, m1, m2` dejan `processed={m1,m2}` (dedup real); un mensaje con `attempts >= 3` va a DLQ con evidencia. Ordering per-partition se declara en la política de la cola, no se asume en el worker.",
      ],
      code: {
        language: 'python',
        title: "dedup_ordering_dlq.py",
        code: `def ingest(seen: set, key: str, attempts: int, max_attempts: int = 3) -> str:
    if key in seen:
        return "dup"
    if attempts >= max_attempts:
        return "dlq"
    seen.add(key)
    return "new"

seen = set()
print(ingest(seen, "k1", 0))
print(ingest(seen, "k1", 1))
print(ingest(set(), "poison", 3))
print("order", "per_partition")`,
        output: `new
dup
dlq
order per_partition`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S45-T2-B: demuestra duplicado, desorden acotado y terminal en DLQ. Falla cerrada con `DEDUP_OR_DLQ` y deriva incertidumbre con `INSPECT_MESSAGE_ORDER`.",
      },
    },
    {
      heading: "Compute, autoscaling y redes",
      subtopicId: "S45-T3-A",
      paragraphs: [
        "El **autoscaling** debe anclarse a una señal de negocio: para un job de cola, el **lag/backlog** manda cuando supera el umbral; si el backlog está bajo, la señal secundaria puede ser CPU. La red del worker es **privada** (sin admin abierto a internet) y la capacidad máxima respeta **cuota**, warm-up y **backpressure** (dejar de aceptar trabajo antes de saturar SLO).",
        "Contrato local de este subtema. **Entrada:** backlog, workers, target por worker, cuota, red privada y flag de backpressure. **Salida:** carga sintética que respeta SLO y cuota. **Error:** workers > cuota, lag por worker sobre objetivo, red pública o sin backpressure → `APPLY_BACKPRESSURE`. **Éxito medible:** con backlog 80 y 4 workers (target 25) la carga cabe y la señal de escala es correcta. Si falta `backpressure` u otro campo de capacidad, enruta a `REQUEST_CAPACITY`.",
        "En `CASO-IQU-045`: un pico de reportes sintéticos encola trabajo; se escala por queue lag, no por CPU ociosa, y el path del worker queda en red privada con backpressure antes de romper el SLO de latencia del status.",
      ],
      code: {
        language: 'python',
        title: "compute_autoscale_net.py",
        code: `def scale_signal(queue_lag: int, threshold: int = 100) -> str:
    """Escala por backlog cuando el lag supera el umbral; si no, observa CPU."""
    return "lag" if queue_lag >= threshold else "cpu"

def within_quota(workers: int, quota: int, backlog: int, target: int) -> bool:
    return workers <= quota and backlog / workers <= target

print("scale_on", scale_signal(50, 100))
print("scale_on", scale_signal(150, 100))
print("capacity_ok", within_quota(4, 6, 80, 25))
print("network", "private")`,
        output: `scale_on cpu
scale_on lag
capacity_ok True
network private`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S45-T3-A, el artefacto comprobable es carga sintética que respeta SLO y cuota. Sin él corresponde `APPLY_BACKPRESSURE` o, si faltan datos, `REQUEST_CAPACITY`.",
      },
    },
    {
      heading: "IAM, paths privados y egress",
      subtopicId: "S45-T3-B",
      paragraphs: [
        "**IAM least-privilege** concede solo la acción y el recurso que el job necesita (p. ej. `object:get` y `queue:ack`, no `iam:admin`). Los **paths privados** evitan exponer el control plane a internet; el **egress** se allowlistea y se registra para impedir exfiltración. La prueba negativa (denegar admin abierto o host desconocido) es evidencia de promoción, no un checkbox vacío.",
        "Contrato local de este subtema. **Entrada:** acciones permitidas, acción solicitada, path privado, host de egress y allowlist. **Salida:** policy negativa y egress bloqueado probados. **Error:** acción fuera de allowlist, path público o host no listado → `DENY_IAM_OR_EGRESS`. **Éxito medible:** el worker de reportes solo escribe al bucket del caso y habla con `api.internal`. Si falta `egress_allow`, enruta a `REQUEST_SCOPED_POLICY`.",
        "En `CASO-IQU-045`: el rol del worker no incluye administración; un intento de egress a `unknown.example` se deniega y se registra. Sin cuenta cloud real: modelamos la decisión en stdlib.",
      ],
      code: {
        language: 'python',
        title: "iam_private_egress.py",
        code: `def allow(action: str, allowed: set, host: str, egress_allow: set, private: bool) -> bool:
    return action in allowed and private and host in egress_allow

allowed = {"object:get", "queue:ack"}
print("ok", allow("object:get", allowed, "api.internal", {"api.internal"}, True))
print("deny_admin", allow("iam:admin", allowed, "api.internal", {"api.internal"}, True))
print("deny_egress", allow("object:get", allowed, "unknown.example", {"api.internal"}, True))
print("least_privilege_actions", sorted(allowed))`,
        output: `ok True
deny_admin False
deny_egress False
least_privilege_actions ['object:get', 'queue:ack']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S45-T3-B: prueba policy negativa y egress bloqueado; registra por separado `DENY_IAM_OR_EGRESS` (breach) y `REQUEST_SCOPED_POLICY` (missing).",
      },
    },
    {
      heading: "Configuración declarativa y environments",
      subtopicId: "S45-T4-A",
      paragraphs: [
        "**IaC** declara el estado deseado (cola, bucket, rol) en código versionado, parametriza **dev / staging / prod** sin copiar secretos al plan, y exige un **plan revisado** antes del apply. Drift destructivo inesperado, entorno inventado (`shared`) o secretos en claro en el plan son señales de rechazo — no de “aplicar y ver”.",
        "Contrato local de este subtema. **Entrada:** recursos declarados vs planificados, environment, flags de secretos y cambios destructivos. **Salida:** plan sin drift destructivo inesperado. **Error:** plan ≠ declarado, entorno inválido, secretos en plan o `destructive_changes > 0` sin control → `REJECT_IAC_PLAN`. **Éxito medible:** declared == planned en staging con cero destroys. Si falta el campo de destrucciones, enruta a `REVIEW_DRIFT`.",
        "En `CASO-IQU-045`: la cola de reportes y el bucket de artefactos se declaran por entorno; un plan que elimina la cola o imprime un token se rechaza en revisión humana antes de apply.",
      ],
      code: {
        language: 'python',
        title: "declarative_config_envs.py",
        code: `def plan_acceptable(declared: set, planned: set, env: str, secrets: bool, destroys: int) -> bool:
    return (
        declared == planned
        and env in {"dev", "staging", "prod"}
        and not secrets
        and destroys == 0
    )

declared = {"queue", "bucket"}
print("staging_ok", plan_acceptable(declared, declared, "staging", False, 0))
print("bad_env", plan_acceptable(declared, declared, "shared", False, 0))
print("secret_plan", plan_acceptable(declared, declared, "prod", True, 0))
print("unexpected_destroy", plan_acceptable(declared, {"bucket"}, "prod", False, 1))`,
        output: `staging_ok True
bad_env False
secret_plan False
unexpected_destroy False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S45-T4-A acepta solo plan sin drift destructivo inesperado; una violación produce `REJECT_IAC_PLAN` y un registro incompleto produce `REVIEW_DRIFT`.",
      },
    },
    {
      heading: "Costos, cuotas, recovery y portabilidad",
      subtopicId: "S45-T4-B",
      paragraphs: [
        "Presupuesto y **cuotas** son controles operativos, no promesas de marketing. En este curso los montos sintéticos van en **PEN** (soles peruanos): campos `forecast_pen` / `budget_pen`. **Recovery** y **portability** se ensayan con exportaciones y formatos abiertos (imágenes, dumps, manifiestos), no se afirman sin drill.",
        "Contrato local de este subtema. **Entrada:** forecast vs budget (PEN), uso vs límite de cuota, flags de restore y export portable. **Salida:** alarma de costo y recuperación documentadas. **Error:** forecast > budget, cuota rebasada, restore no probado o export no portable → `FREEZE_SCALE_OUT`. **Éxito medible:** forecast 820 ≤ budget 1000 PEN sintéticos, cuota bajo límite y drill de restore OK. Si falta `portable_export`, enruta a `COST_OWNER_REVIEW`.",
        "En `CASO-IQU-045`: el dueño de costo del job de reportes congela scale-out si el forecast sintético rompe el presupuesto; la portabilidad se demuestra exportando el manifiesto del artefacto, no con un vendor lock-in no documentado.",
      ],
      code: {
        language: 'python',
        title: "cost_quotas_recovery_portability.py",
        code: `def cost_ok(forecast_pen: int, budget_pen: int, used: int, limit: int) -> bool:
    return forecast_pen <= budget_pen and used <= limit

def recovery_portable(restore_tested: bool, portable_export: bool) -> bool:
    return restore_tested and portable_export

print("budget_ok", cost_ok(820, 1000, 72, 100))
print("over_budget", cost_ok(1500, 1000, 72, 100))
print("recovery", recovery_portable(True, True))
print("currency", "PEN")`,
        output: `budget_ok True
over_budget False
recovery True
currency PEN`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S45-T4-B: conserva alarma de costo y recuperación documentadas, la evidencia de `FREEZE_SCALE_OUT` y la ruta humana `COST_OWNER_REVIEW`. Montos en PEN sintéticos.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos locales del job asíncrono de reportes sintéticos en Iquitos (`CASO-IQU-045`). Cada una calcula un contrato de S45 con stdlib — sin cuenta cloud ni egress real — y deja evidencia alineada al gate CP-N4-B.",
    steps: [
      {
        demoId: "S45-T1-A-DEMO",
        subtopicId: "S45-T1-A",
        environment: "local-python",
        description: "ADR de persistencia: object para artefactos, relacional para status, cache no autoritativo",
        code: {
          language: 'python',
          title: "demo_object_relational_cache.py",
          code: `def write_job(artifact_key: str, status: str, stores: dict) -> dict:
    stores["object"][artifact_key] = b"report-bytes"
    stores["relational"][artifact_key] = status
    stores["cache"][artifact_key] = status  # copia descartable
    return {"truth": "relational+object", "cache_authoritative": False}

stores = {"object": {}, "relational": {}, "cache": {}}
meta = write_job("reports/iqu-1.json", "done", stores)
print("artifact_in_object", "reports/iqu-1.json" in stores["object"])
print("status", stores["relational"]["reports/iqu-1.json"])
print("adr", meta)`,
          output: `artifact_in_object True
status done
adr {'truth': 'relational+object', 'cache_authoritative': False}`,
        },
        why: "Pienso en voz alta el ADR: el blob del reporte va al object store, el status del job a relacional, y el cache solo espeja lecturas. Un reintento relee la verdad durable, no el TTL.",
      },
      {
        demoId: "S45-T1-B-DEMO",
        subtopicId: "S45-T1-B",
        environment: "local-python",
        description: "Restore sintético: RPO/RTO y consistencia read-after-write del status",
        code: {
          language: 'python',
          title: "demo_consistency_lifecycle_backups.py",
          code: `def restore_ok(rpo_h: int, backup_age_h: int, rto_min: int, restore_min: int) -> bool:
    return backup_age_h <= rpo_h and restore_min <= rto_min

print("consistency", "job_status_read_after_write")
print("backup", "daily")
print("restore_tested", restore_ok(24, 12, 30, 25))
print("restore_breach", restore_ok(6, 24, 30, 90))`,
          output: `consistency job_status_read_after_write
backup daily
restore_tested True
restore_breach False`,
        },
        why: "El backup solo cuenta si el restore medido cabe en RPO/RTO. Aquí un drill de 25 min con RTO 30 y backup fresco pasa; uno viejo y lento falla de forma explícita.",
      },
      {
        demoId: "S45-T2-A-DEMO",
        subtopicId: "S45-T2-A",
        environment: "local-python",
        description: "At-least-once: efecto durable antes del ack; reentrega sin segundo side-effect",
        code: {
          language: 'python',
          title: "demo_queue_event_delivery.py",
          code: `effects: dict[str, str] = {}
VISIBILITY_TIMEOUT_S = 30

def process(msg: dict, *, processing_s: int = 5) -> str:
    key = msg["idempotency_key"]
    if key in effects:
        return "SKIP_DUP"
    # efecto durable primero; ack solo si cabemos en el visibility timeout
    effects[key] = "done"
    if processing_s >= VISIBILITY_TIMEOUT_S:
        # el mensaje ya era reentregable: el consumer debe ser idempotente
        return "ACK_AFTER_REDELIVERY_WINDOW"
    return "ACK"

print(process({"idempotency_key": "job-iqu-1"}, processing_s=5))
print(process({"idempotency_key": "job-iqu-1"}, processing_s=5))
print(process({"idempotency_key": "job-slow"}, processing_s=45))
print("effects", sorted(effects))
print("delivery", "at_least_once", "vt", VISIBILITY_TIMEOUT_S)`,
          output: `ACK
SKIP_DUP
ACK_AFTER_REDELIVERY_WINDOW
effects ['job-iqu-1', 'job-slow']
delivery at_least_once vt 30`,
        },
        why: "At-least-once + visibility timeout: el ack va después del efecto durable; si el worker tarda más que el VT, el mensaje pudo reaparecer y la key impide un segundo side-effect. Eso es el contrato de cola del job de reportes.",
      },
      {
        demoId: "S45-T2-B-DEMO",
        subtopicId: "S45-T2-B",
        environment: "local-python",
        description: "Dedup por clave y poison → DLQ tras max attempts",
        code: {
          language: 'python',
          title: "demo_dedup_ordering_dlq.py",
          code: `def ingest(seen: set, key: str, attempts: int, max_attempts: int = 3) -> str:
    if key in seen:
        return "dup"
    if attempts >= max_attempts:
        return "dlq"
    seen.add(key)
    return "new"

seen: set = set()
dlq: list = []
print(ingest(seen, "m1", 0))
print(ingest(seen, "m1", 1))
poison = ingest(set(), "poison", 3)
if poison == "dlq":
    dlq.append("poison")
print(poison)
print("dlq_len", len(dlq), "order", "per_partition")`,
          output: `new
dup
dlq
dlq_len 1 order per_partition`,
        },
        why: "Primera clave es new, reentrega es dup, poison con attempts>=3 termina en DLQ con evidencia. El orden se declara por partición; no se inventa en el consumer.",
      },
      {
        demoId: "S45-T3-A-DEMO",
        subtopicId: "S45-T3-A",
        environment: "local-python",
        description: "Señal de escala por lag de cola y capacidad dentro de cuota",
        code: {
          language: 'python',
          title: "demo_compute_autoscale_net.py",
          code: `def scale_signal(queue_lag: int, threshold: int = 100) -> str:
    """Escala por backlog de cola cuando el lag supera el umbral; si no, observa CPU."""
    return "lag" if queue_lag >= threshold else "cpu"

def capacity_ok(workers: int, quota: int, backlog: int, target: int) -> bool:
    return workers <= quota and backlog / max(workers, 1) <= target

print("scale_on", scale_signal(50, threshold=100))
print("scale_on", scale_signal(150, threshold=100))
print("capacity_ok", capacity_ok(4, 6, 80, 25))
print("network", "private")`,
          output: `scale_on cpu
scale_on lag
capacity_ok True
network private`,
        },
        why: "La señal correcta es backlog vs umbral (no `lag` para cualquier valor ≥ 0). Con lag 50 → cpu; con 150 → lag. La capacidad se valida contra cuota y target por worker en red privada.",
      },
      {
        demoId: "S45-T3-B-DEMO",
        subtopicId: "S45-T3-B",
        environment: "local-python",
        description: "Least privilege + egress allowlist con prueba negativa",
        code: {
          language: 'python',
          title: "demo_iam_private_egress.py",
          code: `def allow(action: str, allowed: set, host: str, egress: set, private: bool) -> bool:
    return action in allowed and private and host in egress

allowed = {"object:get", "queue:ack"}
egress = {"api.internal"}
print("ok", allow("object:get", allowed, "api.internal", egress, True))
print("deny_admin", allow("iam:admin", allowed, "api.internal", egress, True))
print("deny_egress", allow("object:get", allowed, "unknown.example", egress, True))
print("path", "private")`,
          output: `ok True
deny_admin False
deny_egress False
path private`,
        },
        why: "Least privilege no es un print True: se prueba la acción permitida y se niega admin y hosts fuera de allowlist. Path privado y egress restringido son evidencia de T3-B.",
      },
      {
        demoId: "S45-T4-A-DEMO",
        subtopicId: "S45-T4-A",
        environment: "local-python",
        description: "Plan IaC: paridad declared/planned, sin secretos ni destroy sorpresa",
        code: {
          language: 'python',
          title: "demo_declarative_config_envs.py",
          code: `def plan_ok(declared: set, planned: set, env: str, secrets: bool, destroys: int) -> bool:
    return declared == planned and env in {"dev", "staging", "prod"} and not secrets and destroys == 0

desired = {"queue", "bucket"}
print("staging_ok", plan_ok(desired, desired, "staging", False, 0))
print("secret_plan", plan_ok(desired, desired, "prod", True, 0))
print("drift_destroy", plan_ok(desired, {"bucket"}, "prod", False, 1))
print("declared", sorted(desired))`,
          output: `staging_ok True
secret_plan False
drift_destroy False
declared ['bucket', 'queue']`,
        },
        why: "El plan se acepta solo si coincide con lo declarado, el environment es válido y no hay secretos ni destrucciones inesperadas. Rechazar el plan malo es el contrato de T4-A.",
      },
      {
        demoId: "S45-T4-B-DEMO",
        subtopicId: "S45-T4-B",
        environment: "local-python",
        description: "Presupuesto PEN, cuota y drill de recovery/portability",
        code: {
          language: 'python',
          title: "demo_cost_quotas_recovery_portability.py",
          code: `def cost_ratio(forecast_pen: float, budget_pen: float) -> float:
    return round(forecast_pen / budget_pen, 2)

def recovery_ready(*, restore_tested: bool, portable_export: bool) -> bool:
    return restore_tested and portable_export

forecast_pen, budget_pen = 820, 1000  # PEN sintéticos (soles)
print("currency", "PEN")
print("cost_ratio", cost_ratio(forecast_pen, budget_pen))
print("under_budget", forecast_pen <= budget_pen)
print("recovery_ready", recovery_ready(restore_tested=True, portable_export=True))
print("recovery_blocked", recovery_ready(restore_tested=False, portable_export=True))`,
          output: `currency PEN
cost_ratio 0.82
under_budget True
recovery_ready True
recovery_blocked False`,
        },
        why: "El forecast en PEN sintéticos se compara con el budget; recovery solo es listo si el drill de restore y el export portable están ambos ensayados — no basta un print decorativo.",
      },
    ],
  },
  weDo: {
    intro: "S45 · Laboratorio de arquitectura distribuida mínima: 24 retos locales sobre **ocho familias** de fixture de `CASO-IQU-045` (Iquitos sintético; mismos campos por familia, no ocho novelas distintas). Cada subtema sigue E1 → E2 → E3 con andamiaje que se retira: E1 repara un predicado de dominio con un defecto claro; E2 clasifica válido / adverso / campo faltante; E3 decide continue / breach / uncertainty en fail-closed. Conserva los datos del starter; corrige solo la decisión defectuosa. Lee el contrato local del subtema antes de tocar el booleano.",
    steps: [
      {
        id: "S45-T1-A-E1",
        subtopicId: "S45-T1-A",
        kind: "guided",
        instruction: "S45-T1-A-E1 · Decide la fuente de verdad del job de reportes en Iquitos (`CASO-IQU-045-1A`). El starter marca PASS cuando el cache es autoritativo o las transacciones viven en cache (DEFECT invertido). Corrige el predicado para exigir blob en object, transacciones en relacional, `cache_authoritative=false` y `cache_ttl_s > 0`. No toques los datos ni el assert. Salida exacta: `S45-T1-A PASS`.",
        hint: "Relaciona los campos `blob_store`, `transactions`, `cache_authoritative`, `cache_ttl_s` con la regla explicada en S45-T1-A.",
        hints: [
          "Relaciona los campos `blob_store`, `transactions`, `cache_authoritative`, `cache_ttl_s` con la regla explicada en S45-T1-A.",
          "Pista: `blob_store == \"object\"` y `transactions == \"relational\"` y `not cache_authoritative` y `cache_ttl_s > 0`.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: cache_authoritative=true o transactions=cache", "CASO-IQU-045-1A es sintético"],
        tests: "El fixture `CASO-IQU-045-1A` satisface un predicado de dominio real; imprime `S45-T1-A PASS` y el assert booleano pasa.",
        feedback: "S45-T1-A-E1: el ADR correcto es blob→object, transacciones→relacional y cache no autoritativo con TTL > 0. Si el cache es la verdad, el reintento del job miente al revisor.",
        starterCode: {
          language: 'python',
          title: "s45-t1-a-e1.py",
          code: `# CASO-IQU-045 · object/relational/cache roles
# DEFECT: PASS si cache_authoritative o transactions=cache
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
record = {"case_id": "CASO-IQU-045-1A", **{"blob_store":"object","transactions":"relational","cache_authoritative":False,"cache_ttl_s":300}}
# DEFECT: cache no es fuente de verdad ni de transacciones
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
        instruction: "S45-T1-A-E2 · Clasifica tres fixtures de persistencia: ADR válido (object+relacional, cache no autoritativo), adverso (cache como verdad) y registro sin `cache_ttl_s`. Primero `MISSING:…` si falta el campo; luego PASS o `REDESIGN_PERSISTENCE`. El starter invierte el PASS/breach: corrige solo la decisión de dominio. Salidas exactas: `PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s`.",
        hint: "Primero se calcula `missing`; ningún acceso a cache_ttl_s debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a cache_ttl_s debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T1-A: object/relational por semántica y cache descartable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: cache_authoritative=true o transactions=cache", "CASO-IQU-045-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `cache_ttl_s` ausente y produce exactamente `PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s`.",
        feedback: "S45-T1-A-E2: primero MISSING (schema), luego contenido. Cache como fuente de verdad es breach; sin cache_ttl_s no puedes auditar el hot-path.",
        starterCode: {
          language: 'python',
          title: "s45-t1-a-e2.py",
          code: `# CASO-IQU-045 · assess REDESIGN_PERSISTENCE
# DEFECT: PASS con cache como fuente de verdad
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def assess(record: dict) -> str:
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
        instruction: "S45-T1-A-E3 · Enruta fail-closed el ADR de stores: válido → `CONTINUE`, cache autoritativo o transactions=cache → `REDESIGN_PERSISTENCE`, sin `cache_ttl_s` → `WRITE_STORE_ADR`. El starter confunde incertidumbre con éxito y usa el predicado invertido: repara ambas ramas sin inventar campos.",
        hint: "Una ausencia no equivale a breach: enrútala a `WRITE_STORE_ADR` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `WRITE_STORE_ADR` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró object/relational por semántica y cache descartable; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: cache_authoritative=true o transactions=cache", "CASO-IQU-045-1A es sintético"],
        tests: "Fixtures `CASO-IQU-045-1A`, adverso y sin `cache_ttl_s` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T1-A-E3: fail-closed: ausencia → WRITE_STORE_ADR (inspección), diseño roto → REDESIGN_PERSISTENCE, solo el ADR válido → CONTINUE.",
        starterCode: {
          language: 'python',
          title: "s45-t1-a-e3.py",
          code: `# CASO-IQU-045 · decide REDESIGN_PERSISTENCE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def decide(record: dict) -> str:
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
        instruction: "S45-T1-B-E1 · Comprueba el drill de restore de Iquitos (`CASO-IQU-045-1B`). El DEFECT marca PASS cuando el backup es viejo o el restore supera el RTO. Corrige: consistencia explícita del status, `backup_age_h ≤ rpo_h` y `restore_minutes ≤ rto_minutes`. Sin tocar datos ni assert. Salida exacta: `S45-T1-B PASS`.",
        hint: "Relaciona los campos `operation`, `consistency`, `backup_age_h`, `rpo_h`, `restore_minutes`, `rto_minutes` con la regla explicada en S45-T1-B.",
        hints: [
          "Relaciona los campos `operation`, `consistency`, `backup_age_h`, `rpo_h`, `restore_minutes`, `rto_minutes` con la regla explicada en S45-T1-B.",
          "Pista: consistencia del status no vacía, `backup_age_h <= rpo_h` y `restore_minutes <= rto_minutes` (no inviertas las desigualdades).",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: backup_age>rpo o restore>rto o consistency eventual", "CASO-IQU-045-1B es sintético"],
        tests: "El fixture `CASO-IQU-045-1B` satisface un predicado de dominio real; imprime `S45-T1-B PASS` y el assert booleano pasa.",
        feedback: "S45-T1-B-E1: backup sin restore medido no cuenta. Pasa solo si backup_age ≤ RPO y restore ≤ RTO con consistencia del status declarada.",
        starterCode: {
          language: 'python',
          title: "s45-t1-b-e1.py",
          code: `# CASO-IQU-045 · RPO/RTO backup lifecycle
# DEFECT: PASS si backup_age>rpo o restore>rto
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
record = {"case_id": "CASO-IQU-045-1B", **{"operation":"job-status","consistency":"read-after-write","backup_age_h":4,"rpo_h":6,"restore_minutes":25,"rto_minutes":30}}
# DEFECT: backup/restore fuera de RPO/RTO
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
        instruction: "S45-T1-B-E2 · Clasifica restore sintético: drill dentro de RPO/RTO (PASS), backup viejo o restore lento (`DECLARE_DATA_LOSS_RISK`), sin `rto_minutes` (`MISSING:rto_minutes`). Corrige el predicado invertido; no omitas la rama missing. Salidas exactas: `PASS DECLARE_DATA_LOSS_RISK MISSING:rto_minutes`.",
        hint: "Primero se calcula `missing`; ningún acceso a rto_minutes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a rto_minutes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T1-B: consistencia explícita y restore dentro de RPO/RTO. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: backup_age>rpo o restore>rto o consistency eventual", "CASO-IQU-045-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `rto_minutes` ausente y produce exactamente `PASS DECLARE_DATA_LOSS_RISK MISSING:rto_minutes`.",
        feedback: "S45-T1-B-E2: sin rto_minutes no hay drill auditable (MISSING). Restore lento o backup viejo es riesgo de pérdida de datos, no un warning opcional.",
        starterCode: {
          language: 'python',
          title: "s45-t1-b-e2.py",
          code: `# CASO-IQU-045 · assess DECLARE_DATA_LOSS_RISK
# DEFECT: PASS con RPO/RTO rotos
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def assess(record: dict) -> str:
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
        instruction: "S45-T1-B-E3 · Enruta recovery: restore OK → `CONTINUE`; breach de RPO/RTO → `DECLARE_DATA_LOSS_RISK`; sin `rto_minutes` → `RUN_RESTORE_DRILL`. El starter confunde missing con éxito y usa el predicado al revés: repara ambas ramas.",
        hint: "Una ausencia no equivale a breach: enrútala a `RUN_RESTORE_DRILL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RUN_RESTORE_DRILL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró consistencia explícita y restore dentro de RPO/RTO; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: backup_age>rpo o restore>rto o consistency eventual", "CASO-IQU-045-1B es sintético"],
        tests: "Fixtures `CASO-IQU-045-1B`, adverso y sin `rto_minutes` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T1-B-E3: incertidumbre de drill → RUN_RESTORE_DRILL; breach de RPO/RTO → DECLARE_DATA_LOSS_RISK; solo restore dentro de SLO → CONTINUE.",
        starterCode: {
          language: 'python',
          title: "s45-t1-b-e3.py",
          code: `# CASO-IQU-045 · decide DECLARE_DATA_LOSS_RISK
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def decide(record: dict) -> str:
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
        instruction: "S45-T2-A-E1 · Valida la política at-least-once del worker (`CASO-IQU-045-2A`). El DEFECT aprueba cuando falta ack post-efecto o la key está vacía. Corrige el predicado: `delivery=at-least-once`, efecto durable, `acked_after_effect`, key no vacía y backoff. Conserva datos y assert. Salida exacta: `S45-T2-A PASS` (el adverso de E2 debe caer en `NACK_AND_RETRY`).",
        hint: "Relaciona los campos `delivery`, `effect_durable`, `acked_after_effect`, `idempotency_key`, `backoff` con la regla explicada en S45-T2-A.",
        hints: [
          "Relaciona los campos `delivery`, `effect_durable`, `acked_after_effect`, `idempotency_key`, `backoff` con la regla explicada en S45-T2-A.",
          "Pista: delivery at-least-once + effect_durable + acked_after_effect + idempotency_key no vacía + backoff.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: acked_after_effect=false o idempotency_key vacía", "CASO-IQU-045-2A es sintético"],
        tests: "El fixture `CASO-IQU-045-2A` satisface un predicado de dominio real; imprime `S45-T2-A PASS` y el assert booleano pasa.",
        feedback: "S45-T2-A-E1: at-least-once exige efecto durable, ack después del efecto, key no vacía y backoff. Ack temprano duplica side-effects en reentrega.",
        starterCode: {
          language: 'python',
          title: "s45-t2-a-e1.py",
          code: `# CASO-IQU-045 · at-least-once + idempotency ack
# DEFECT: PASS si no acked_after_effect o sin idempotency_key
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
record = {"case_id": "CASO-IQU-045-2A", **{"delivery":"at-least-once","effect_durable":True,"acked_after_effect":True,"idempotency_key":"job-iqu-1","backoff":True}}
# DEFECT: ack tras efecto + idempotency key obligatorios
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
        instruction: "S45-T2-A-E2 · Evalúa delivery del worker: mensaje con ack post-efecto + key + backoff (PASS), ack prematuro o key vacía (`NACK_AND_RETRY`), y registro sin `backoff` (`MISSING:backoff`). Repara el predicado invertido del starter; no elimine la rama missing. Salidas exactas: `PASS NACK_AND_RETRY MISSING:backoff`.",
        hint: "Primero se calcula `missing`; ningún acceso a backoff debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a backoff debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T2-A: ack posterior al efecto, key idempotente y backoff. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: acked_after_effect=false o idempotency_key vacía", "CASO-IQU-045-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backoff` ausente y produce exactamente `PASS NACK_AND_RETRY MISSING:backoff`.",
        feedback: "S45-T2-A-E2: sin backoff no puedes afirmar la política de entrega (MISSING). Key vacía o ack-before-effect es breach de delivery.",
        starterCode: {
          language: 'python',
          title: "s45-t2-a-e2.py",
          code: `# CASO-IQU-045 · assess NACK_AND_RETRY
# DEFECT: PASS sin ack post-efecto o sin key
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def assess(record: dict) -> str:
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
        instruction: "S45-T2-A-E3 · Decide la acción del consumer ante reentrega: política at-least-once correcta → `CONTINUE`; ack antes de efecto / key vacía → `NACK_AND_RETRY`; sin `backoff` → `VERIFY_DELIVERY_SEMANTICS`. El starter trata incertidumbre como éxito y tiene el predicado al revés: corrige ambas fallas.",
        hint: "Una ausencia no equivale a breach: enrútala a `VERIFY_DELIVERY_SEMANTICS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `VERIFY_DELIVERY_SEMANTICS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ack posterior al efecto, key idempotente y backoff; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: acked_after_effect=false o idempotency_key vacía", "CASO-IQU-045-2A es sintético"],
        tests: "Fixtures `CASO-IQU-045-2A`, adverso y sin `backoff` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T2-A-E3: dato faltante → VERIFY_DELIVERY_SEMANTICS; contrato roto → NACK_AND_RETRY; solo delivery sano → CONTINUE.",
        starterCode: {
          language: 'python',
          title: "s45-t2-a-e3.py",
          code: `# CASO-IQU-045 · decide NACK_AND_RETRY
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def decide(record: dict) -> str:
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
        instruction: "S45-T2-B-E1 · Verifica dedup + DLQ en `CASO-IQU-045-2B`. El DEFECT aprueba cuando processed es incompleto o falta terminal en DLQ. Corrige el predicado: ids procesados completos, orden por partición declarado y `terminal_in_dlq=true`. Datos y assert intactos. Salida exacta: `S45-T2-B PASS`.",
        hint: "Relaciona los campos `message_ids`, `processed_ids`, `ordered_partition`, `terminal_in_dlq` con la regla explicada en S45-T2-B.",
        hints: [
          "Relaciona los campos `message_ids`, `processed_ids`, `ordered_partition`, `terminal_in_dlq` con la regla explicada en S45-T2-B.",
          "Pista: `set(message_ids) == processed_ids` (dedup de m1), len(processed)==2, ordered_partition y terminal_in_dlq.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: processed incompleto, sin orden o sin DLQ terminal", "CASO-IQU-045-2B es sintético"],
        tests: "El fixture `CASO-IQU-045-2B` satisface un predicado de dominio real; imprime `S45-T2-B PASS` y el assert booleano pasa.",
        feedback: "S45-T2-B-E1: dedup real usa set(message_ids)==processed_ids (m1 duplicado no cuenta dos veces) y poison termina en DLQ, no en bucle.",
        starterCode: {
          language: 'python',
          title: "s45-t2-b-e1.py",
          code: `# CASO-IQU-045 · dedup processed_ids + DLQ
# DEFECT: PASS si |processed|==|messages| o no terminal_in_dlq
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
record = {"case_id": "CASO-IQU-045-2B", **{"message_ids":["m1","m1","m2"],"processed_ids":{"m1","m2"},"ordered_partition":True,"terminal_in_dlq":True}}
# DEFECT: dedup real o terminal en DLQ para poison
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
        instruction: "S45-T2-B-E2 · Audita new/dup/DLQ: processed completo + orden + terminal DLQ (PASS); processed incompleto o sin DLQ (`DEDUP_OR_DLQ`); sin campo `terminal_in_dlq` (`MISSING:terminal_in_dlq`). Repara el criterio invertido del starter. Salidas exactas: `PASS DEDUP_OR_DLQ MISSING:terminal_in_dlq`.",
        hint: "Primero se calcula `missing`; ningún acceso a terminal_in_dlq debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a terminal_in_dlq debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T2-B: deduplicación, ordering acotado y terminal en DLQ. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: processed incompleto, sin orden o sin DLQ terminal", "CASO-IQU-045-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `terminal_in_dlq` ausente y produce exactamente `PASS DEDUP_OR_DLQ MISSING:terminal_in_dlq`.",
        feedback: "S45-T2-B-E2: sin terminal_in_dlq no sabes si el poison tiene terminal (MISSING). Processed incompleto o sin orden declarado es DEDUP_OR_DLQ.",
        starterCode: {
          language: 'python',
          title: "s45-t2-b-e2.py",
          code: `# CASO-IQU-045 · assess DEDUP_OR_DLQ
# DEFECT: PASS sin dedup real o sin DLQ terminal
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def assess(record: dict) -> str:
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
        instruction: "S45-T2-B-E3 · Decide contención de mensajes: dedup+DLQ OK → `CONTINUE`; poison/dup sin terminal → `DEDUP_OR_DLQ`; falta `terminal_in_dlq` → `INSPECT_MESSAGE_ORDER`. Corrige predicado invertido e incertidumbre mal enrutada.",
        hint: "Una ausencia no equivale a breach: enrútala a `INSPECT_MESSAGE_ORDER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INSPECT_MESSAGE_ORDER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró deduplicación, ordering acotado y terminal en DLQ; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: processed incompleto, sin orden o sin DLQ terminal", "CASO-IQU-045-2B es sintético"],
        tests: "Fixtures `CASO-IQU-045-2B`, adverso y sin `terminal_in_dlq` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T2-B-E3: ausencia de terminal → INSPECT_MESSAGE_ORDER; breach de dedup/DLQ → DEDUP_OR_DLQ; solo new/dup/DLQ correctos → CONTINUE.",
        starterCode: {
          language: 'python',
          title: "s45-t2-b-e3.py",
          code: `# CASO-IQU-045 · decide DEDUP_OR_DLQ
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def decide(record: dict) -> str:
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
        instruction: "S45-T3-A-E1 · Dimensiona el pool del worker de colas (`CASO-IQU-045-3A`). El DEFECT marca PASS si workers superan cuota o el lag por worker es alto. Corrige: workers ≤ cuota, backlog/workers ≤ target, red privada y backpressure activo. Salida exacta: `S45-T3-A PASS`.",
        hint: "Relaciona los campos `backlog`, `workers`, `target_per_worker`, `quota_workers`, `private_network`, `backpressure` con la regla explicada en S45-T3-A.",
        hints: [
          "Relaciona los campos `backlog`, `workers`, `target_per_worker`, `quota_workers`, `private_network`, `backpressure` con la regla explicada en S45-T3-A.",
          "Pista: workers ≤ quota_workers, backlog/workers ≤ target_per_worker, private_network y backpressure activos.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers>quota, lag alto, red pública o sin backpressure", "CASO-IQU-045-3A es sintético"],
        tests: "El fixture `CASO-IQU-045-3A` satisface un predicado de dominio real; imprime `S45-T3-A PASS` y el assert booleano pasa.",
        feedback: "S45-T3-A-E1: capacidad sana = workers ≤ cuota, backlog/workers ≤ target, red privada y backpressure. Escala por lag, no por CPU ociosa.",
        starterCode: {
          language: 'python',
          title: "s45-t3-a-e1.py",
          code: `# CASO-IQU-045 · autoscaling quota + backpressure
# DEFECT: PASS si workers>quota o sin backpressure
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
record = {"case_id": "CASO-IQU-045-3A", **{"backlog":80,"workers":4,"target_per_worker":25,"quota_workers":6,"private_network":True,"backpressure":True}}
# DEFECT: workers sobre cuota o sin backpressure
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
        instruction: "S45-T3-A-E2 · Clasifica capacidad: workers y lag dentro de objetivo con red privada y backpressure (PASS); sobrecarga o red pública (`APPLY_BACKPRESSURE`); sin `backpressure` (`MISSING:backpressure`). Corrige el predicado invertido. Salidas exactas: `PASS APPLY_BACKPRESSURE MISSING:backpressure`.",
        hint: "Primero se calcula `missing`; ningún acceso a backpressure debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a backpressure debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T3-A: workers dentro de cuota y backlog por worker bajo objetivo. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers>quota, lag alto, red pública o sin backpressure", "CASO-IQU-045-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backpressure` ausente y produce exactamente `PASS APPLY_BACKPRESSURE MISSING:backpressure`.",
        feedback: "S45-T3-A-E2: sin flag backpressure no hay política de contención (MISSING). Workers sobre cuota o lag alto es APPLY_BACKPRESSURE.",
        starterCode: {
          language: 'python',
          title: "s45-t3-a-e2.py",
          code: `# CASO-IQU-045 · assess APPLY_BACKPRESSURE
# DEFECT: PASS over-quota o sin backpressure
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def assess(record: dict) -> str:
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
        instruction: "S45-T3-A-E3 · Enruta escala: capacidad OK → `CONTINUE`; workers/cuota/red rotos → `APPLY_BACKPRESSURE`; sin flag de backpressure → `REQUEST_CAPACITY`. Repara ambas ramas del starter defectuoso.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_CAPACITY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_CAPACITY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró workers dentro de cuota y backlog por worker bajo objetivo; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers>quota, lag alto, red pública o sin backpressure", "CASO-IQU-045-3A es sintético"],
        tests: "Fixtures `CASO-IQU-045-3A`, adverso y sin `backpressure` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T3-A-E3: capacidad incierta → REQUEST_CAPACITY; sobrecarga/red pública → APPLY_BACKPRESSURE; carga dentro de SLO → CONTINUE.",
        starterCode: {
          language: 'python',
          title: "s45-t3-a-e3.py",
          code: `# CASO-IQU-045 · decide APPLY_BACKPRESSURE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def decide(record: dict) -> str:
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
        instruction: "S45-T3-B-E1 · Prueba least-privilege del rol del job (`CASO-IQU-045-3B`). El DEFECT aprueba admin abierto o egress a host desconocido. Corrige: `requested_action` ∈ `allowed_actions`, path privado y `egress_host` en allowlist. Salida exacta: `S45-T3-B PASS`.",
        hint: "Relaciona los campos `allowed_actions`, `requested_action`, `private_path`, `egress_host`, `egress_allow` con la regla explicada en S45-T3-B.",
        hints: [
          "Relaciona los campos `allowed_actions`, `requested_action`, `private_path`, `egress_host`, `egress_allow` con la regla explicada en S45-T3-B.",
          "Pista: action en allowed_actions, private_path, y egress_host ∈ egress_allow (prueba negativa de admin/host desconocido).",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción no permitida, path público o egress desconocido", "CASO-IQU-045-3B es sintético"],
        tests: "El fixture `CASO-IQU-045-3B` satisface un predicado de dominio real; imprime `S45-T3-B PASS` y el assert booleano pasa.",
        feedback: "S45-T3-B-E1: least privilege = acción en allowlist + path privado + host en egress. Admin abierto o unknown.example es denegación, no atajo.",
        starterCode: {
          language: 'python',
          title: "s45-t3-b-e1.py",
          code: `# CASO-IQU-045 · IAM least privilege + egress
# DEFECT: PASS si action no allowed o egress no allowlisted
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
record = {"case_id": "CASO-IQU-045-3B", **{"allowed_actions":{"object:get","queue:ack"},"requested_action":"object:get","private_path":True,"egress_host":"api.internal","egress_allow":{"api.internal"}}}
# DEFECT: IAM/egress allowlist fail-closed
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
        instruction: "S45-T3-B-E2 · Evalúa policy negativa: acción permitida + path privado + host allowlisted (PASS); admin o egress desconocido (`DENY_IAM_OR_EGRESS`); sin `egress_allow` (`MISSING:egress_allow`). Corrige el PASS/breach invertido. Salidas exactas: `PASS DENY_IAM_OR_EGRESS MISSING:egress_allow`.",
        hint: "Primero se calcula `missing`; ningún acceso a egress_allow debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a egress_allow debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T3-B: acción IAM mínima, path privado y egress allowlisted. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción no permitida, path público o egress desconocido", "CASO-IQU-045-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `egress_allow` ausente y produce exactamente `PASS DENY_IAM_OR_EGRESS MISSING:egress_allow`.",
        feedback: "S45-T3-B-E2: sin egress_allow no hay prueba negativa de red (MISSING). Acción fuera de scope o path público es DENY_IAM_OR_EGRESS.",
        starterCode: {
          language: 'python',
          title: "s45-t3-b-e2.py",
          code: `# CASO-IQU-045 · assess DENY_IAM_OR_EGRESS
# DEFECT: PASS con acción/egress no autorizados
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def assess(record: dict) -> str:
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
        instruction: "S45-T3-B-E3 · Decide IAM/egress: least privilege OK → `CONTINUE`; breach de acción/path/host → `DENY_IAM_OR_EGRESS`; allowlist ausente → `REQUEST_SCOPED_POLICY`. No conviertas incertidumbre en éxito.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_SCOPED_POLICY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_SCOPED_POLICY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró acción IAM mínima, path privado y egress allowlisted; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción no permitida, path público o egress desconocido", "CASO-IQU-045-3B es sintético"],
        tests: "Fixtures `CASO-IQU-045-3B`, adverso y sin `egress_allow` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T3-B-E3: política incompleta → REQUEST_SCOPED_POLICY; breach IAM/egress → DENY_IAM_OR_EGRESS; solo allowlist + private → CONTINUE.",
        starterCode: {
          language: 'python',
          title: "s45-t3-b-e3.py",
          code: `# CASO-IQU-045 · decide DENY_IAM_OR_EGRESS
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def decide(record: dict) -> str:
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
        instruction: "S45-T4-A-E1 · Revisa el plan de IaC de staging (`CASO-IQU-045-4A`). El DEFECT aprueba planes con secretos, entorno inválido o destroys. Corrige: declared == planned, env ∈ {dev,staging,prod}, sin secretos y `destructive_changes == 0`. Salida exacta: `S45-T4-A PASS`.",
        hint: "Relaciona los campos `declared_resources`, `planned_resources`, `environment`, `secret_values_in_plan`, `destructive_changes` con la regla explicada en S45-T4-A.",
        hints: [
          "Relaciona los campos `declared_resources`, `planned_resources`, `environment`, `secret_values_in_plan`, `destructive_changes` con la regla explicada en S45-T4-A.",
          "Pista: set(declared)==set(planned), env en {dev,staging,prod}, secrets_in_plan=false y destructive_changes==0.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: secretos en plan, entorno inválido o destroy inesperado", "CASO-IQU-045-4A es sintético"],
        tests: "El fixture `CASO-IQU-045-4A` satisface un predicado de dominio real; imprime `S45-T4-A PASS` y el assert booleano pasa.",
        feedback: "S45-T4-A-E1: plan aceptable = declared==planned, env dev|staging|prod, sin secretos y zero destroys inesperados. Apply ciego no es evidencia.",
        starterCode: {
          language: 'python',
          title: "s45-t4-a-e1.py",
          code: `# CASO-IQU-045 · IaC plan secrets + destructive
# DEFECT: PASS si secret_values_in_plan o destructive_changes>0
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
record = {"case_id": "CASO-IQU-045-4A", **{"declared_resources":{"queue","bucket"},"planned_resources":{"queue","bucket"},"environment":"staging","secret_values_in_plan":False,"destructive_changes":0}}
# DEFECT: plan no debe exponer secretos ni destruir sin control
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
        instruction: "S45-T4-A-E2 · Clasifica planes IaC: paridad declared/planned en staging sin secretos ni destroys (PASS); secretos/env inválido/destroy (`REJECT_IAC_PLAN`); sin `destructive_changes` (`MISSING:destructive_changes`). Repara el predicado invertido. Salidas exactas: `PASS REJECT_IAC_PLAN MISSING:destructive_changes`.",
        hint: "Primero se calcula `missing`; ningún acceso a destructive_changes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a destructive_changes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T4-A: plan coincide, entorno válido, sin secretos ni destrucción. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: secretos en plan, entorno inválido o destroy inesperado", "CASO-IQU-045-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `destructive_changes` ausente y produce exactamente `PASS REJECT_IAC_PLAN MISSING:destructive_changes`.",
        feedback: "S45-T4-A-E2: sin destructive_changes no puedes auditar drift (MISSING). Secretos en plan o env inventado es REJECT_IAC_PLAN.",
        starterCode: {
          language: 'python',
          title: "s45-t4-a-e2.py",
          code: `# CASO-IQU-045 · assess REJECT_IAC_PLAN
# DEFECT: PASS con secretos en plan o destroy
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def assess(record: dict) -> str:
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
        instruction: "S45-T4-A-E3 · Decide apply vs rechazo: plan limpio → `CONTINUE`; drift/secretos/env malo → `REJECT_IAC_PLAN`; falta conteo de destroys → `REVIEW_DRIFT`. Corrige predicado e incertidumbre mal enrutada.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_DRIFT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_DRIFT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró plan coincide, entorno válido, sin secretos ni destrucción; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: secretos en plan, entorno inválido o destroy inesperado", "CASO-IQU-045-4A es sintético"],
        tests: "Fixtures `CASO-IQU-045-4A`, adverso y sin `destructive_changes` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T4-A-E3: drift no medido → REVIEW_DRIFT; plan inseguro → REJECT_IAC_PLAN; solo paridad limpia → CONTINUE.",
        starterCode: {
          language: 'python',
          title: "s45-t4-a-e3.py",
          code: `# CASO-IQU-045 · decide REJECT_IAC_PLAN
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def decide(record: dict) -> str:
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
        instruction: "S45-T4-B-E1 · Cierra el presupuesto del job en PEN sintéticos (`CASO-IQU-045-4B`). El DEFECT marca PASS si forecast > budget o la cuota se rebosa. Corrige: `forecast_pen ≤ budget_pen`, cuota bajo límite, `restore_tested` y `portable_export`. Salida exacta: `S45-T4-B PASS`.",
        hint: "Relaciona los campos `forecast_pen`, `budget_pen`, `quota_used`, `quota_limit`, `restore_tested`, `portable_export` con la regla explicada en S45-T4-B.",
        hints: [
          "Relaciona los campos `forecast_pen`, `budget_pen`, `quota_used`, `quota_limit`, `restore_tested`, `portable_export` con la regla explicada en S45-T4-B.",
          "Pista: forecast_pen ≤ budget_pen (PEN), quota_used ≤ quota_limit, restore_tested y portable_export.",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: forecast>budget PEN, cuota rebasada o restore no probado", "CASO-IQU-045-4B es sintético"],
        tests: "El fixture `CASO-IQU-045-4B` satisface un predicado de dominio real; imprime `S45-T4-B PASS` y el assert booleano pasa.",
        feedback: "S45-T4-B-E1: en PEN sintéticos, forecast ≤ budget, cuota bajo límite y restore+export portable. Sobrepresupuesto congela scale-out.",
        starterCode: {
          language: 'python',
          title: "s45-t4-b-e1.py",
          code: `# CASO-IQU-045 · cost forecast + quotas
# DEFECT: PASS si forecast>budget o quota_used>limit
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
record = {"case_id": "CASO-IQU-045-4B", **{"forecast_pen":820,"budget_pen":1000,"quota_used":72,"quota_limit":100,"restore_tested":True,"portable_export":True}}
# DEFECT: presupuesto/cuota excedidos
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
        instruction: "S45-T4-B-E2 · Audita costo en PEN y recovery: forecast ≤ budget + cuota OK + restore/export (PASS); sobre-presupuesto o cuota rota (`FREEZE_SCALE_OUT`); sin `portable_export` (`MISSING:portable_export`). Corrige el criterio invertido. Salidas exactas: `PASS FREEZE_SCALE_OUT MISSING:portable_export`.",
        hint: "Primero se calcula `missing`; ningún acceso a portable_export debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a portable_export debe ocurrir antes de esa rama.",
          "Después aplica la regla de S45-T4-B: costo/cuota bajo límite y recovery/portability ensayados. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: forecast>budget PEN, cuota rebasada o restore no probado", "CASO-IQU-045-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `portable_export` ausente y produce exactamente `PASS FREEZE_SCALE_OUT MISSING:portable_export`.",
        feedback: "S45-T4-B-E2: sin portable_export no hay recovery portable (MISSING). Forecast > budget o cuota rota es FREEZE_SCALE_OUT.",
        starterCode: {
          language: 'python',
          title: "s45-t4-b-e2.py",
          code: `# CASO-IQU-045 · assess FREEZE_SCALE_OUT
# DEFECT: PASS over budget o over quota
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def assess(record: dict) -> str:
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
        instruction: "S45-T4-B-E3 · Enruta FinOps del job: presupuesto/cuota/recovery OK → `CONTINUE`; breach de costo o cuota → `FREEZE_SCALE_OUT`; falta export portable → `COST_OWNER_REVIEW`. Repara ambas ramas defectuosas del starter.",
        hint: "Una ausencia no equivale a breach: enrútala a `COST_OWNER_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `COST_OWNER_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró costo/cuota bajo límite y recovery/portability ensayados; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: forecast>budget PEN, cuota rebasada o restore no probado", "CASO-IQU-045-4B es sintético"],
        tests: "Fixtures `CASO-IQU-045-4B`, adverso y sin `portable_export` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S45-T4-B-E3: evidencia de recovery incompleta → COST_OWNER_REVIEW; costo/cuota rota → FREEZE_SCALE_OUT; presupuesto sano + drill → CONTINUE.",
        starterCode: {
          language: 'python',
          title: "s45-t4-b-e3.py",
          code: `# CASO-IQU-045 · decide FREEZE_SCALE_OUT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado
def decide(record: dict) -> str:
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
    context: "Arquitectura distribuida mínima declarativa. Trabaja sobre procesamiento sintético de reportes para una organización ficticia en Iquitos. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida: estado durable, resultado en object store y fallas terminales en dead-letter queue. El gate se bloquea si hay mensaje duplicado con side-effect, cuota excedida, egress no autorizado o restore no probado.",
    objectives: [
      "Convertir job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos en estado durable, resultado en object store y fallas terminales en dead-letter queue.",
      "Demostrar el gate CP-N4-B: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
      "Probar tres rutas: caso normal (ACK), breach/poison (`SEND_TO_DLQ` / `DEDUP_OR_DLQ`) e incertidumbre (`PAUSE_AND_INSPECT`).",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-IQU-045`.",
      "Incluye decisión de store/cache y consistencia (object + relacional; cache no autoritativo).",
      "Incluye cola con deduplicación por clave, retry y terminalización en DLQ.",
      "Incluye IAM least-privilege, path privado y egress allowlisted (modelo local).",
      "Incluye configuración por entorno con presupuesto/cuotas (PEN sintéticos) y restore ensayado.",
      "Automatiza un caso normal, uno de breach (`SEND_TO_DLQ` o token de contención del subtema) y uno incierto (`PAUSE_AND_INSPECT`).",
      "Completa `process_once`: ack lógico solo tras efecto durable; dups → `SKIP_DUP`; poison → DLQ.",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-IQU-045"
# Job asíncrono local (stdlib, sin cloud ni egress real).
# Completa process_once y automatiza las tres rutas del gate CP-N4-B.
# No basta con imprimir booleans: el efecto durable debe vivir en los dicts.

object_store: dict[str, bytes] = {}
job_status: dict[str, str] = {}
seen_keys: set[str] = set()
dlq: list[dict] = []

# ADR mínimo (T1): verdad durable = object + relacional; cache nunca autoritativo.
STORE_ADR = {
    "artifact": "object",
    "status": "relational",
    "cache_authoritative": False,
}
# Controles locales (T3/T4): modelo, no cuenta real.
IAM_ALLOWED = {"object:put", "queue:ack"}
EGRESS_ALLOW = {"api.internal"}
BUDGET_PEN, FORECAST_PEN = 1000, 820  # soles sintéticos (PEN)
RESTORE_TESTED = True
PORTABLE_EXPORT = True

def process_once(msg: dict, *, max_attempts: int = 3) -> str:
    """Ack lógico solo tras efecto durable. Dups → SKIP_DUP; poison → SEND_TO_DLQ."""
    key = msg["idempotency_key"]
    if key in seen_keys:
        return "SKIP_DUP"
    if msg.get("attempts", 0) >= max_attempts:
        dlq.append(msg)
        return "SEND_TO_DLQ"
    if not msg.get("artifact_bytes"):
        return "PAUSE_AND_INSPECT"
    # Completa el efecto durable ANTES del ack lógico:
    # object_store[key] = msg["artifact_bytes"]
    # job_status[key] = "done"
    # seen_keys.add(key)
    # return "ACK"
    raise NotImplementedError("implementa efecto durable + ack lógico")

def gate_budget_ok() -> bool:
    return FORECAST_PEN <= BUDGET_PEN and RESTORE_TESTED and PORTABLE_EXPORT

# Fixtures sintéticos a automatizar (descomenta y completa process_once):
normal = {"idempotency_key": "job-iqu-1", "attempts": 0, "artifact_bytes": b"ok"}
poison = {"idempotency_key": "job-poison", "attempts": 3, "artifact_bytes": b"x"}
missing = {"idempotency_key": "job-x", "attempts": 0}  # sin artifact_bytes

# Esperado tras implementar:
# process_once(normal) → "ACK"; process_once(normal) → "SKIP_DUP"
# process_once(poison) → "SEND_TO_DLQ"; process_once(missing) → "PAUSE_AND_INSPECT"
# assert object_store["job-iqu-1"] == b"ok" and job_status["job-iqu-1"] == "done"
# assert len(dlq) == 1 and gate_budget_ok() and not STORE_ADR["cache_authoritative"]

print(CASE_ID, "skeleton", STORE_ADR["artifact"], "budget_ok", gate_budget_ok())
`,
    portfolioNote: "Evidencia de CP-N4-B · job asíncrono resiliente: muestra baseline, decisión de stores, colas con DLQ, IAM/egress, presupuesto/restore, pruebas normal/breach/uncertain, resultado medido, rollback y riesgo residual. El esqueleto no es un checklist de booleans: implementa el contrato y enlaza artefactos del proyecto.",
    rubric: [
      { criterion: "Correctitud del contrato y gate (efecto durable + idempotencia)", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación (DLQ / inspección)", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege (IAM/egress modelo)", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: SLO, costo/cuota, observabilidad y rollback", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar la elección de stores en `CASO-IQU-045`?",
        options: [
          "ADR de persistencia con fuente de verdad (object + relacional; cache no autoritativo)",
          "un print sin assert ni versión",
          "una captura de pantalla sin fuente",
          "datos personales reales para que parezca auténtico",
        ],
        correctIndex: 0,
        explanation: "La teoría exige ADR de persistencia con fuente de verdad; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Ante un mensaje poison tras N reintentos (o un breach de entrega), ¿qué respuesta preserva seguridad y auditabilidad?",
        options: [
          "continuar y ocultar el warning",
          "inventar evidencia faltante",
          "terminar en DLQ (p. ej. SEND_TO_DLQ / DEDUP_OR_DLQ) y conservar evidencia",
          "borrar el trace para reducir ruido",
        ],
        correctIndex: 2,
        explanation: "Los contratos de S45 fallan cerrado: breach o poison van a contención/DLQ con evidencia; la incertidumbre se enruta a inspección, no a éxito silencioso.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-B · job asíncrono resiliente`?",
        options: [
          "el archivo S45 existe, aunque no pruebe el gate",
          "el README afirma que funciona",
          "se usó la herramienta más nueva",
          "reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos",
        ],
        correctIndex: 3,
        explanation: "El gate es conductual y medible: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
      },
      {
        question: "En autoscaling del worker de colas, ¿cuándo la señal principal debe ser lag de cola y no CPU?",
        options: [
          "siempre que queue_lag >= 0",
          "cuando queue_lag supera el umbral de backlog acordado",
          "solo si el cache es autoritativo",
          "cuando el plan de IaC tiene secretos",
        ],
        correctIndex: 1,
        explanation: "La señal de escala por cola se activa al cruzar el umbral de lag; valores bajos pueden observar CPU. El umbral no es código muerto.",
      },
      {
        question: "Tras N reintentos fallidos, un mensaje poison debe…",
        options: [
          "ir a DLQ terminal con evidencia y sin segundo side-effect silencioso",
          "reintentarse en bucle infinito",
          "borrarse sin audit trail",
          "escribirse en el cache como fuente de verdad",
        ],
        correctIndex: 0,
        explanation: "Delivery resiliente: poison → DLQ controlada; reintentos con idempotency no duplican resultados de negocio. Cache nunca es fuente de verdad.",
      },
      {
        question: "¿Qué política IAM/egress es evidencia válida de T3-B para el worker de reportes?",
        options: [
          "acciones mínimas (p. ej. object:get + queue:ack), path privado y egress allowlisted con prueba negativa de admin/host desconocido",
          "iam:admin en producción para desbloquear el demo",
          "egress abierto a 0.0.0.0/0 porque el job es sintético",
          "imprimir least_privilege True sin probar denegaciones",
        ],
        correctIndex: 0,
        explanation: "Least privilege se demuestra con allowlist de acciones/hosts y denegaciones explícitas; admin abierto o egress libre no es evidencia de promoción.",
      },
      {
        question: "Si `forecast_pen` (soles sintéticos) supera `budget_pen` o la cuota se rebosa, ¿qué token corresponde?",
        options: [
          "FREEZE_SCALE_OUT (y revisión de dueño de costo si falta evidencia de recovery/export)",
          "ACK silencioso y seguir escalando workers",
          "borrar el plan de IaC para reducir costo contable",
          "marcar cache como fuente de verdad del presupuesto",
        ],
        correctIndex: 0,
        explanation: "T4-B trata presupuesto/cuota y recovery medidos: sobre-presupuesto o cuota rota congela scale-out; la incertidumbre de export/restore va a revisión humana, no a éxito.",
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
      {
        label: "AWS SQS best practices",
        url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-best-practices.html",
        note: "At-least-once, DLQ, idempotencia",
      },
      {
        label: "AWS SQS dead-letter queues",
        url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
        note: "DLQ y poison messages",
      },
      {
        label: "AWS IAM best practices",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        note: "Least privilege",
      },
      {
        label: "Twelve-Factor App",
        url: "https://12factor.net/",
        note: "Config, backing services y disposability",
      },
      {
        label: "NIST SP 800-53",
        url: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final",
        note: "Controles de seguridad y acceso",
      },
      {
        label: "Python queue module",
        url: "https://docs.python.org/3/library/queue.html",
        note: "Semántica de colas didáctica",
      },
      {
        label: "OpenTelemetry concepts",
        url: "https://opentelemetry.io/docs/concepts/",
        note: "Observabilidad del job asíncrono",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Colas, storage y consistencia" },
      { label: "Site Reliability Engineering", note: "Capacity, cost y recovery" },
    ],
    courses: [
      { label: "Coursera Cloud architecture", url: "https://www.coursera.org/courses?query=cloud%20architecture", note: "Storage, queues e IAM intro" },
      { label: "MIT 6.824 Distributed Systems", url: "https://pdos.csail.mit.edu/6.824/", note: "Fault tolerance conceptual" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
      { label: "FinOps Foundation", url: "https://www.finops.org/", note: "Costo y presupuestos" },
    ],
  },
}
