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
    { text: "Garantizar deduplicación por clave, ordenamiento acotado y envío a estado terminal en DLQ" },
    { text: "Dimensionar compute/autoscaling y red privada con señal de backlog y backpressure" },
    { text: "Restringir IAM al mínimo, paths privados y egress allowlisted con prueba negativa" },
    { text: "Declarar infraestructura por entorno y rechazar planes con secretos o destrucción inesperada" },
    { text: "Presupuestar costo/cuotas (montos en PEN sintéticos) y documentar recovery y portabilidad ensayados" },
  ],
  theory: [
    {
      heading: "Ruta de S45: cloud, almacenamiento, colas e infraestructura",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1; cada término reaparece en su subtema). **Object store:** blobs/artefactos por key (T1-A). **Relacional:** invariantes y consultas (T1-A/B). **Cache:** copia descartable, no fuente de verdad (T1-A). **Delivery semantics:** at-least-once / at-most-once / exactly-once como propiedad compuesta (T2-A). **Visibility timeout:** ventana sin ack tras la cual el mensaje puede reaparecer (T2-A). **Dedup:** idempotency key del mensaje (T2-B). **DLQ:** dead-letter de mensajes venenosos (T2-B). **IAM least-privilege:** permisos mínimos por rol (T3-B). **Egress control:** salidas de red autorizadas (T3-B). **IaC:** infra declarativa por entorno (T4-A). **Budget/quota:** costo y límites medidos en **PEN** = soles peruanos sintéticos (T4-B).",
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
        content:
          "Gate **CP-N4-B · job asíncrono resiliente**: reintentos no duplican resultados; DLQ, IAM, backup y costo quedan medidos. Las ~20 h se reparten en ~6 h de teoría y demos, ~8 h de weDo y ~6 h del youDo del proyecto (stdlib, sin cuenta cloud real).",
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
        title: "Contrato local: stores",
        content:
          "Si el reintento del job lee status solo desde cache, el ADR de persistencia está roto. La verdad durable es object store + relacional; el TTL del cache no se audita como fuente.",
      },
    },
    {
      heading: "Consistencia, lifecycle y backups",
      subtopicId: "S45-T1-B",
      paragraphs: [
        "La **consistencia se define por operación**, no por eslogan de la plataforma: el status del job suele exigir *read-after-write* (el productor y el dashboard ven el mismo estado tras el commit), mientras un índice de búsqueda puede ser eventual. El **lifecycle** mueve copias calientes a frío y expira temporales; el **backup solo cuenta** cuando un restore medido cumple RPO (edad máxima del backup) y RTO (minutos de restauración).",
        "Contrato local de este subtema. **Entrada:** operación, modelo de consistencia, edad del último backup y tiempo de restore de ensayo. **Salida:** restore sintético dentro de RPO/RTO documentado. **Error:** `backup_age_h > rpo_h` o `restore_minutes > rto_minutes` → `DECLARE_DATA_LOSS_RISK`. **Éxito medible:** drill de restore que rehidrata el status del job de Iquitos dentro del RTO. Si falta `rto_minutes` u otro campo de drill, enruta a `RUN_RESTORE_DRILL`.",
        "En `CASO-IQU-045`: el status relacional del job de reportes se declara *read-after-write*; el object store del artefacto puede ser eventual entre regiones. Un backup diario sintético con restore de 25 min frente a RTO 30 min y RPO 6 h es evidencia de T1-B — no una captura de consola sin drill medido.",
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
        title: "Contrato local: restore",
        content:
          "Un backup sin restore ensayado no es evidencia. Compara `backup_age_h` con RPO y `restore_minutes` con RTO; si el drill falla, declara riesgo de pérdida de datos, no un warning opcional.",
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
        title: "Contrato local: colas",
        content:
          "At-least-once + visibility timeout: el ack va **después** del efecto durable. Sin idempotency key, una reentrega puede reimprimir el PDF del reporte sintético.",
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
        title: "Contrato local: DLQ",
        content:
          "Poison tras N intentos → estado terminal en DLQ con evidencia. Reintentar sin store de dedup produce doble side-effect; borrar el mensaje sin audit trail no es contención.",
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
        title: "Contrato local: escala",
        content:
          "Escala por lag de cola cuando el backlog cruza el umbral; con lag bajo observa CPU. Workers por encima de cuota o sin backpressure rompen el SLO antes de que el dashboard lo note.",
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
        title: "Contrato local: IAM y egress",
        content:
          "Least privilege se demuestra con allowlist de acciones y hosts, más prueba negativa de `iam:admin` y de un host desconocido. Un print de `least_privilege=True` sin denegaciones no es evidencia.",
      },
    },
    {
      heading: "Configuración declarativa y entornos",
      subtopicId: "S45-T4-A",
      paragraphs: [
        "**IaC** declara el estado deseado (cola, bucket, rol) en código versionado, parametriza **dev / staging / prod** sin copiar secretos al plan, y exige un **plan revisado** antes del apply. Drift destructivo inesperado, entorno inventado (`shared`) o secretos en claro en el plan son señales de rechazo — no de “aplicar y ver”.",
        "Contrato local de este subtema. **Entrada:** recursos declarados vs. planificados, entorno, flags de secretos y cambios destructivos. **Salida:** plan sin drift destructivo inesperado. **Error:** plan ≠ declarado, entorno inválido, secretos en plan o `destructive_changes > 0` sin control → `REJECT_IAC_PLAN`. **Éxito medible:** declared == planned en staging con cero destroys. Si falta el campo de destrucciones, enruta a `REVIEW_DRIFT`.",
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
        title: "Contrato local: plan IaC",
        content:
          "Acepta el plan solo si declared == planned, el entorno es dev/staging/prod, no hay secretos en claro y no hay destroys inesperados. Rechazar un plan malo es el contrato; «aplicar y ver» no lo es.",
      },
    },
    {
      heading: "Costos, cuotas, recovery y portabilidad",
      subtopicId: "S45-T4-B",
      paragraphs: [
        "Presupuesto y **cuotas** son controles operativos, no promesas de marketing. En este curso los montos sintéticos van en **PEN** (soles peruanos): campos `forecast_pen` / `budget_pen`. **Recovery** y **portability** se ensayan con exportaciones y formatos abiertos (imágenes, dumps, manifiestos), no se afirman sin drill.",
        "Contrato local de este subtema. **Entrada:** forecast vs. budget (PEN), uso vs. límite de cuota, flags de restore y export portable. **Salida:** alarma de costo y recuperación documentadas. **Error:** forecast > budget, cuota rebasada, restore no probado o export no portable → `FREEZE_SCALE_OUT`. **Éxito medible:** forecast 820 ≤ budget 1000 PEN sintéticos, cuota bajo límite y drill de restore OK. Si falta `portable_export`, enruta a `COST_OWNER_REVIEW`.",
        "En `CASO-IQU-045`: el responsable de costo del job de reportes congela scale-out si el forecast sintético rompe el presupuesto; la portabilidad se demuestra exportando el manifiesto del artefacto, no con un vendor lock-in no documentado.",
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
        title: "Contrato local: costo y recovery",
        content:
          "Cierra el lab con alarma de costo y recuperación documentadas, evidencia de `FREEZE_SCALE_OUT` cuando haga falta, y ruta humana `COST_OWNER_REVIEW` si falta export o restore. Montos en PEN sintéticos; riesgo residual y límites del laboratorio con stdlib quedan en el portfolio.",
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
        preamble:
          "Antes de encolar un reintento del job de reportes en Iquitos (`CASO-IQU-045`), el ingeniero de plataforma debe **declarar dónde vive la verdad**. En esta demo un worker sintético escribe el artefacto `reports/iqu-1.json` al object store, el status `done` a relacional y una copia descartable al cache. No escribas aún: predice si el artefacto queda en object, qué imprime `status` y por qué `cache_authoritative` es `False`. Si confundes el TTL del cache con el registro autoritativo, el revisor del gate CP-N4-B verá un estado fantasma.",
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
        why: "El object store guarda el blob del reporte por key; la tabla relacional guarda el status transaccional del job; el cache solo acelera lecturas del dashboard y **nunca** es fuente de verdad. Un reintento relee object + relacional, no el TTL. Si `cache_authoritative` fuera True, el revisor del gate vería un estado que puede expirar. En We Do repararás el predicado que aprueba cache autoritativo, la tabla PASS/REDESIGN/MISSING y la decisión CONTINUE/WRITE_STORE_ADR.",
        retrospective:
          "Si puedes explicar por qué un status solo en cache miente al reintento sin mirar el código, ya tienes el hábito de ADR de persistencia. El error clásico es «el cache es más rápido, usémoslo de verdad». En We Do practicarás el predicado object+relacional y el rechazo del ADR roto.",
      },
      {
        demoId: "S45-T1-B-DEMO",
        subtopicId: "S45-T1-B",
        environment: "local-python",
        description: "Restore sintético: RPO/RTO y consistencia read-after-write del status",
        preamble:
          "Un backup en el job de reportes de Iquitos solo es evidencia si el **restore medido** cabe en RPO y RTO. En esta demo el status del job se declara *read-after-write*; un drill con backup de 12 h (RPO 24) y restore de 25 min (RTO 30) pasa; uno de 24 h con restore de 90 min frente a RPO 6 / RTO 30 falla de forma explícita. No escribas: predice `restore_tested` y `restore_breach` antes de mirar la salida.",
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
        why: "RPO limita la **edad** del backup (horas); RTO limita los **minutos** del restore. La consistencia se declara por operación: el status del job pide read-after-write, un índice de búsqueda puede ser eventual. Un drill de 25 min con RTO 30 y backup fresco pasa; uno viejo y lento falla de forma explícita — no un warning opcional. En We Do invertirás desigualdades, clasificarás MISSING:rto_minutes y enrutarás RUN_RESTORE_DRILL.",
        retrospective:
          "Backup sin drill medido no es evidencia de recovery: RPO acota la **edad** del backup y RTO los **minutos** de restore. El error clásico es enseñar una captura «backup daily» sin números. Pregunta: si el restore real midiera 45 min con RTO 30, ¿qué token declararías antes de promover el status del job? We Do: desigualdades correctas, tres rutas y rama RUN_RESTORE_DRILL.",
      },
      {
        demoId: "S45-T2-A-DEMO",
        subtopicId: "S45-T2-A",
        environment: "local-python",
        description: "At-least-once: efecto durable antes del ack; reentrega sin segundo side-effect",
        preamble:
          "En colas gestionadas la semántica realista es **at-least-once**: el mensaje puede reaparecer si el worker muere antes del ack (p. ej. tras un visibility timeout). En esta demo del job de Iquitos la key `job-iqu-1` deja un solo efecto; la segunda entrega es `SKIP_DUP`; un job lento (45 s > VT 30) aún escribe el efecto y devuelve `ACK_AFTER_REDELIVERY_WINDOW`. No escribas: predice las cuatro salidas y por qué `effects` solo tiene dos keys.",
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
        why: "El efecto durable (status/artefacto) va **antes** del ack. La idempotency key evita un segundo side-effect si el mensaje reaparece tras el visibility timeout. At-least-once sin key es reimpresión del PDF del reporte. El job lento (45 s > VT 30) aún escribe el efecto y marca redelivery window — el consumer debe ser idempotente. En We Do: predicado de política, assess NACK_AND_RETRY y decide VERIFY_DELIVERY_SEMANTICS.",
        retrospective:
          "At-least-once sin idempotency key es reimpresión del PDF del reporte. El error clásico es acker al leer el mensaje «para liberar la cola» y perder el efecto durable si el worker muere. Pregunta: si processing_s=45 y VT=30, ¿por qué igual se escribe el efecto y se marca redelivery window? We Do: política completa con backoff y key no vacía.",
      },
      {
        demoId: "S45-T2-B-DEMO",
        subtopicId: "S45-T2-B",
        environment: "local-python",
        description: "Dedup por clave y poison → DLQ tras max attempts",
        preamble:
          "La deduplicación usa un store durable de claves; la DLQ recibe *poison* tras N intentos con evidencia. En esta demo del job de Iquitos, `m1` dos veces da `new` y luego `dup`; `poison` con attempts≥3 va a DLQ (`dlq_len 1`). El orden se declara por partición, no se inventa en el consumer. No escribas: predice las tres líneas y por qué `m1` no cuenta dos veces. Si «limpias» el poison sin terminal, el revisor del gate CP-N4-B no ve contención.",
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
        why: "El set de claves es dedup real: primera vez `new`, reentrega `dup`. Contar con `len(messages)==len(processed)` miente cuando hay duplicados. Poison con attempts≥3 termina en DLQ con evidencia — evita bucle infinito y borrar el mensaje sin audit trail. El orden se declara por partición. En We Do: predicado set(message_ids)==processed_ids, assess y decide INSPECT_MESSAGE_ORDER.",
        retrospective:
          "Poison sin estado terminal es reintento eterno. El error clásico es borrar el mensaje «para limpiar la cola» sin audit trail. Pregunta: ¿por qué `len(messages)==len(processed)` miente cuando hay dos `m1`? We Do: conjuntos + flag `terminal_in_dlq` auditado.",
      },
      {
        demoId: "S45-T3-A-DEMO",
        subtopicId: "S45-T3-A",
        environment: "local-python",
        description: "Señal de escala por lag de cola y capacidad dentro de cuota",
        preamble:
          "El autoscaling del worker de reportes en Iquitos debe anclarse a **lag de cola**, no a CPU ociosa: un pico sintético encola trabajo y la señal de negocio manda. En esta demo lag 50 (umbral 100) observa `cpu`; lag 150 escala por `lag`. Con backlog 80 y 4 workers (target 25, cuota 6) la capacidad cabe en red privada. No escribas: predice las dos señales y `capacity_ok` antes de mirar la salida.",
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
        why: "La señal de escala es backlog vs. umbral de negocio (no `lag` para cualquier valor ≥ 0). Con lag 50 → cpu; con 150 → lag. Capacidad sana: workers ≤ cuota y lag/worker ≤ target, en red privada. Sin backpressure el SLO de status se rompe antes de que el dashboard lo note. En We Do: predicado de capacidad, assess APPLY_BACKPRESSURE y decide REQUEST_CAPACITY.",
        retrospective:
          "Escala por señal de negocio del job (lag de cola sobre umbral), no por CPU ociosa. El error clásico es scale-out por CPU al 20% con cola a 500 mensajes. Pregunta: con backlog 80 y 4 workers (target 25), ¿por qué `capacity_ok` es True y qué rompe quitar backpressure? We Do: cuota + red privada + flag de contención.",
      },
      {
        demoId: "S45-T3-B-DEMO",
        subtopicId: "S45-T3-B",
        environment: "local-python",
        description: "Least privilege + egress allowlist con prueba negativa",
        preamble:
          "Least privilege se demuestra con **allowlist de acciones y hosts** más prueba negativa — no con un print decorativo. En esta demo el worker de Iquitos puede `object:get` hacia `api.internal` en path privado; `iam:admin` y `unknown.example` se deniegan. No escribas: predice `ok`, `deny_admin` y `deny_egress`. Si solo ves `least_privilege=True` sin denegaciones, el revisor de seguridad del gate CP-N4-B no tiene evidencia.",
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
        why: "La acción debe estar en allowed, el path ser privado y el host de egress en allowlist. Un booleano decorativo `least_privilege=True` sin denegaciones no pasa T3-B: la evidencia es la denegación de admin y de host desconocido. Path privado y egress restringido son el contrato del worker de reportes. En We Do: predicado, assess DENY y decide REQUEST_SCOPED_POLICY.",
        retrospective:
          "La evidencia es la denegación, no el print de éxito. El error clásico es «abrimos admin para el demo». Pregunta: ¿qué dos pruebas negativas llevarías al portfolio (acción y host)? We Do: policy con MISSING:egress_allow y REQUEST_SCOPED_POLICY.",
      },
      {
        demoId: "S45-T4-A-DEMO",
        subtopicId: "S45-T4-A",
        environment: "local-python",
        description: "Plan IaC: paridad declared/planned, sin secretos ni destroy sorpresa",
        preamble:
          "IaC declara cola y bucket del job de reportes por entorno; el plan se **revisa** antes del apply — no «aplicar y ver». En esta demo staging con declared==planned y cero destroys pasa; un plan con secretos o destroy de la cola se rechaza. No escribas: predice `staging_ok`, `secret_plan` y `drift_destroy` antes de mirar la salida.",
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
        why: "El plan se acepta solo si declared == planned, el entorno es dev/staging/prod, no hay secretos en claro y destroys == 0. Un plan que elimina la cola o imprime un token se rechaza en revisión humana — «aplicar y ver» no es el contrato. En We Do: predicado, assess REJECT_IAC_PLAN y decide REVIEW_DRIFT.",
        retrospective:
          "Rechazar un plan malo es éxito de ingeniería, no fricción. El error clásico es apply ciego «porque el demo urge». Pregunta: si declared={queue,bucket} y planned={bucket}, ¿qué recurso desaparece y por qué no basta «el plan corrió sin error de syntax»? We Do: drift medido y entorno válido (no `shared`).",
      },
      {
        demoId: "S45-T4-B-DEMO",
        subtopicId: "S45-T4-B",
        environment: "local-python",
        description: "Presupuesto PEN, cuota y drill de recovery/portability",
        preamble:
          "El presupuesto del job se mide en **PEN sintéticos** (soles) y recovery solo es listo si restore y export portable están ensayados. En esta demo forecast 820 / budget 1000 da ratio 0.82 y under_budget; recovery sin restore queda bloqueado. No escribas: predice ratio, under_budget y las dos líneas de recovery.",
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
        why: "Forecast ≤ budget y cuota bajo límite son controles operativos en PEN sintéticos, no decoración. Recovery solo es listo si restore_tested y portable_export están ambos ensayados; FREEZE_SCALE_OUT cuando el forecast rompe el presupuesto. Un print «bajo presupuesto» sin export no cierra T4-B. En We Do: predicado, assess FREEZE y decide COST_OWNER_REVIEW.",
        retrospective:
          "Costo y recovery se demuestran con números y drills, no con promesas. El error clásico es «está bajo budget, listo» sin `portable_export` ni restore ensayado. Pregunta: si forecast=820 y budget=1000 pero restore_tested=False, ¿el job está listo para scale-out? We Do: FREEZE y COST_OWNER_REVIEW.",
      },
    ],
  },
  weDo: {
    intro: "S45 · Laboratorio de arquitectura distribuida mínima: 24 retos locales sobre **ocho familias** de fixture de `CASO-IQU-045` (Iquitos sintético; mismos campos por familia, no ocho novelas distintas). Cada subtema sigue E1 → E2 → E3 con andamiaje que se retira. E1 repara un predicado de dominio con un defecto claro. E2 clasifica válido / adverso / campo faltante. E3 decide continue / breach / uncertainty con cierre por defecto (`fail-closed`: sin evidencia no hay éxito). Conserva los datos del starter; corrige solo la decisión defectuosa. Lee el contrato local del subtema antes de tocar el booleano.",
    steps: [
      {
        id: "S45-T1-A-E1",
        subtopicId: "S45-T1-A",
        kind: "guided",
        title: "ADR: object y relacional, no cache",
        preamble:
          "- **Contexto:** en `CASO-IQU-045-1A` el job de reportes de Iquitos solo puede promoverse si el ADR de stores es correcto.\n- **Meta:** corregir el predicado `meets_contract` (blob→object, transacciones→relacional, cache no autoritativo, TTL > 0).\n- **Éxito:** imprimes exactamente `S45-T1-A PASS`.\n- **Límites:** no mutes el fixture; no inventes stores; no toques el assert; el DEFECT está en el booleano, no en los datos.",
        instruction:
          "1. Abre el starter: `meets_contract` da PASS con cache autoritativo (DEFECT invertido).\n2. Exige `blob_store == \"object\"` y `transactions == \"relational\"`.\n3. Añade `not cache_authoritative` y `cache_ttl_s > 0`.\n4. Conserva el print `S45-T1-A` y el status PASS/REDESIGN_PERSISTENCE.",
        hint: "El starter marca PASS cuando el cache es la verdad: invierte ese criterio. El blob del reporte va a object; el status, a relacional.",
        hints: [
          "Si `cache_authoritative` o `transactions == \"cache\"` dan PASS, el predicado está al revés del ADR de T1-A.",
          "Pista: `blob_store == \"object\"` y `transactions == \"relational\"` y `not cache_authoritative` y `cache_ttl_s > 0`.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: cache_authoritative=true o transactions=cache", "CASO-IQU-045-1A es sintético"],
        tests: "El fixture `CASO-IQU-045-1A` satisface un predicado de dominio real; imprime `S45-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "Cache como verdad o transacciones en cache es `REDESIGN_PERSISTENCE`: el reintento del job relee un TTL que miente al revisor de Iquitos. Object + relacional con cache descartable es el único ADR que pasa T1-A.",
        retrospective:
          "Fuente de verdad = medio durable según patrón de acceso. El error clásico es marcar `cache_authoritative=true` «porque el dashboard es más rápido». Siguiente (E2): tres rutas válido / adverso / sin TTL.",
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
        title: "Tres rutas de stores (PASS / REDESIGN / MISSING)",
        preamble:
          "- **Contexto:** el revisor de persistencia en Iquitos no trata igual un ADR limpio, uno con cache como verdad y un registro incompleto.\n- **Meta:** implementar `assess` que distinga PASS, REDESIGN_PERSISTENCE y MISSING:cache_ttl_s.\n- **Éxito:** imprime `PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s` en ese orden.\n- **Límites:** si falta `cache_ttl_s`, no evalúes el ADR; no inventes el campo; missing ≠ «aceptar».",
        instruction:
          "1. Revisa el starter: con datos completos aprueba cache autoritativo (bug).\n2. Primero: claves required; si falta alguna → `MISSING:…`.\n3. Luego: object + relacional + cache no autoritativo + TTL > 0 → PASS; si no → REDESIGN_PERSISTENCE.\n4. Imprime los tres resultados con `print(*results)`.",
        hint: "Orden de ramas: schema primero (`MISSING:…`), contenido después. No leas `cache_ttl_s` si el campo no está.",
        hints: [
          "Si falta `cache_ttl_s`, devuelve `MISSING:cache_ttl_s` sin evaluar el ADR.",
          "Con datos completos: object + relacional + cache no autoritativo → PASS; cache como verdad → REDESIGN_PERSISTENCE.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: cache_authoritative=true o transactions=cache", "CASO-IQU-045-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `cache_ttl_s` ausente y produce exactamente `PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s`.",
        feedback:
          "Primero schema (`MISSING:cache_ttl_s`): sin TTL no auditas el hot-path del dashboard. Luego contenido: object + relacional + cache no autoritativo → PASS; cache como verdad o transacciones en cache → REDESIGN_PERSISTENCE. Missing no es «aceptar con fe» ni un ataque inventado.",
        retrospective:
          "Incertidumbre de evidencia (falta TTL) y breach de diseño (cache como verdad) piden respuestas distintas: una rellena el ADR, la otra rediseña stores. El error clásico es marcar «sin TTL» como PASS porque el resto «se ve bien». Pregunta: si el revisor de Iquitos solo ve un status en cache, ¿qué falla en el reintento? Luego (E3): CONTINUE / REDESIGN / WRITE_STORE_ADR.",
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
        title: "Decide stores: CONTINUE o WRITE_STORE_ADR",
        preamble:
          "- **Contexto:** el control plane del job decide si el ADR **sigue** o se detiene: no hay «seguir con warning».\n- **Meta:** `decide` → CONTINUE (ADR válido), REDESIGN_PERSISTENCE (cache autoritativo), WRITE_STORE_ADR (sin TTL).\n- **Éxito:** `CONTINUE REDESIGN_PERSISTENCE WRITE_STORE_ADR`.\n- **Límites:** no inventes `cache_ttl_s`; no conviertas missing en CONTINUE; no toques los fixtures.",
        instruction:
          "1. Corrige missing: sin `cache_ttl_s` → `WRITE_STORE_ADR` (no CONTINUE).\n2. Con registro completo, reutiliza el predicado object/relacional de E1/E2.\n3. Solo el ADR limpio es CONTINUE; el de cache como verdad es REDESIGN_PERSISTENCE.\n4. Imprime los tres códigos en orden.",
        hint: "Sin `cache_ttl_s` no auditas el hot-path: enruta a `WRITE_STORE_ADR` antes de mirar object/relational.",
        hints: [
          "Missing no es breach: primero schema, luego diseño. Solo el ADR object+relacional con cache no autoritativo devuelve `CONTINUE`.",
          "Para datos completos reutiliza la regla object/relational y cache descartable; el adverso es `REDESIGN_PERSISTENCE`.",
        ],
        edgeCases: ["falta cache_ttl_s", "fixture adverso: cache_authoritative=true o transactions=cache", "CASO-IQU-045-1A es sintético"],
        tests: "Fixtures `CASO-IQU-045-1A`, adverso y sin `cache_ttl_s` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Cierre por defecto: ausencia → WRITE_STORE_ADR (inspección humana), diseño roto → REDESIGN_PERSISTENCE, solo el ADR válido → CONTINUE. Promover con campos faltantes no es opción en el job de Iquitos.",
        retrospective:
          "Un ADR incompleto es inspección humana (`WRITE_STORE_ADR`), no un allow optimista. El error clásico es promover con «faltan campos, igual pasa». Pregunta: ¿por qué REDESIGN_PERSISTENCE no es lo mismo que WRITE_STORE_ADR, y cuál reutilizas en el youDo si el starter aún no declara `cache_authoritative`?",
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
assert results == ["CONTINUE", "REDESIGN_PERSISTENCE", "WRITE_STORE_ADR"]
` ,
          output: `CONTINUE REDESIGN_PERSISTENCE WRITE_STORE_ADR` ,
        },
      },
      {
        id: "S45-T1-B-E1",
        subtopicId: "S45-T1-B",
        kind: "guided",
        title: "Restore dentro de RPO y RTO",
        preamble:
          "- **Contexto:** en `CASO-IQU-045-1B` el status relacional del job solo se promueve si el drill de restore cabe en los SLO.\n- **Meta:** corregir el predicado (consistencia read-after-write, backup_age ≤ rpo, restore ≤ rto).\n- **Éxito:** `S45-T1-B PASS`.\n- **Límites:** no mutes el fixture; no inviertas las desigualdades a propósito; no toques el assert.",
        instruction:
          "1. Abre el starter: `meets_contract` usa `>` en RPO/RTO (DEFECT).\n2. Cámbialo a `backup_age_h <= rpo_h` y `restore_minutes <= rto_minutes`.\n3. Exige `consistency == \"read-after-write\"`.\n4. Conserva print PASS / DECLARE_DATA_LOSS_RISK.",
        hint: "El starter pasa cuando el backup es viejo o el restore es lento: las desigualdades de RPO/RTO están invertidas.",
        hints: [
          "PASS exige `backup_age_h ≤ rpo_h` y `restore_minutes ≤ rto_minutes`, más consistencia del status declarada.",
          "Pista: consistencia del status no vacía, `backup_age_h <= rpo_h` y `restore_minutes <= rto_minutes` (no inviertas las desigualdades).",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: backup_age>rpo o restore>rto o consistency eventual", "CASO-IQU-045-1B es sintético"],
        tests: "El fixture `CASO-IQU-045-1B` satisface un predicado de dominio real; imprime `S45-T1-B PASS` y el assert booleano pasa.",
        feedback:
          "Backup sin restore medido o con restore fuera de RTO es `DECLARE_DATA_LOSS_RISK`, no un warning opcional. El revisor de Iquitos pide minutos y edad, no un checkbox «backup daily».",
        retrospective:
          "RPO y RTO son números de drill, no promesas de marketing. El error clásico es invertir las desigualdades al «arreglar» el starter. Siguiente: tres fixtures con y sin `rto_minutes`.",
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
        title: "Tres rutas de restore (PASS / RIESGO / MISSING)",
        preamble:
          "- **Contexto:** el auditor de recovery no confunde un drill lento con un campo ausente.\n- **Meta:** `assess` → PASS, DECLARE_DATA_LOSS_RISK, MISSING:rto_minutes.\n- **Éxito:** `PASS DECLARE_DATA_LOSS_RISK MISSING:rto_minutes`.\n- **Límites:** sin `rto_minutes` no compares RPO/RTO; no declares pérdida por un campo faltante.",
        instruction:
          "1. Schema primero: required keys; missing → `MISSING:…`.\n2. Con datos: read-after-write + backup fresco + restore ≤ RTO → PASS.\n3. Breach de edad/minutos o consistencia eventual → DECLARE_DATA_LOSS_RISK.\n4. Imprime los tres en orden.",
        hint: "Orden de ramas: sin `rto_minutes` no hay drill; devuelve MISSING antes de comparar RPO/RTO.",
        hints: [
          "Si falta `rto_minutes`, `MISSING:rto_minutes` — no declares pérdida de datos por un campo ausente.",
          "Con datos completos: backup fresco y restore ≤ RTO → PASS; breach de RPO/RTO → DECLARE_DATA_LOSS_RISK.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: backup_age>rpo o restore>rto o consistency eventual", "CASO-IQU-045-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `rto_minutes` ausente y produce exactamente `PASS DECLARE_DATA_LOSS_RISK MISSING:rto_minutes`.",
        feedback:
          "Sin `rto_minutes` no hay drill auditable (MISSING). Restore lento o backup viejo es riesgo de pérdida de datos, no un warning opcional para el revisor de recovery.",
        retrospective:
          "Sin `rto_minutes` no hay drill auditable: es incertidumbre de evidencia, no pérdida declarada. El error clásico es marcar MISSING como DECLARE_DATA_LOSS_RISK «por precaución». Pregunta: ¿qué haría el auditor si el backup está fresco pero nadie midió el restore? Luego (E3): CONTINUE / DECLARE / RUN_RESTORE_DRILL.",
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
        title: "Decide recovery: drill o riesgo",
        preamble:
          "- **Contexto:** en producción no «pasas con warning» un restore sin minutos.\n- **Meta:** CONTINUE (OK), DECLARE_DATA_LOSS_RISK (breach), RUN_RESTORE_DRILL (sin rto).\n- **Éxito:** `CONTINUE DECLARE_DATA_LOSS_RISK RUN_RESTORE_DRILL`.\n- **Límites:** no inventes rto; no conviertas incertidumbre en éxito.",
        instruction:
          "1. Missing → `RUN_RESTORE_DRILL`.\n2. Completo: reutiliza predicado de E1/E2.\n3. Solo drill dentro de SLO es CONTINUE.\n4. Imprime los tres códigos.",
        hint: "Sin `rto_minutes` no hay drill auditable: enruta a `RUN_RESTORE_DRILL` antes de comparar RPO/RTO.",
        hints: [
          "Missing ≠ breach. Primero schema; luego backup fresco y restore dentro del RTO.",
          "Solo consistencia explícita + restore dentro de RPO/RTO devuelve `CONTINUE`; el adverso es `DECLARE_DATA_LOSS_RISK`.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: backup_age>rpo o restore>rto o consistency eventual", "CASO-IQU-045-1B es sintético"],
        tests: "Fixtures `CASO-IQU-045-1B`, adverso y sin `rto_minutes` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Incertidumbre de drill → RUN_RESTORE_DRILL (ensaya minutos); breach de RPO/RTO o consistencia eventual → DECLARE_DATA_LOSS_RISK; solo restore dentro de SLO → CONTINUE. No hay promote silencioso de recovery: «backup daily» sin números no cierra el gate.",
        retrospective:
          "Incertidumbre de drill ≠ pérdida declarada: una pide ensayo, la otra admite riesgo. Pregunta: ¿qué harías si el restore real midiera 45 min con RTO 30?",
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
assert results == ["CONTINUE", "DECLARE_DATA_LOSS_RISK", "RUN_RESTORE_DRILL"]
` ,
          output: `CONTINUE DECLARE_DATA_LOSS_RISK RUN_RESTORE_DRILL` ,
        },
      },
      {
        id: "S45-T2-A-E1",
        subtopicId: "S45-T2-A",
        kind: "guided",
        title: "At-least-once con ack post-efecto",
        preamble:
          "- **Contexto:** el worker de reportes (`CASO-IQU-045-2A`) solo puede acker si la política de entrega es sana.\n- **Meta:** predicado delivery at-least-once + efecto durable + acked_after_effect + key no vacía + backoff.\n- **Éxito:** `S45-T2-A PASS`.\n- **Límites:** no mutes el fixture; no borres el assert; el DEFECT está en el booleano.",
        instruction:
          "1. Starter: PASS si `not acked_after_effect` o key vacía (DEFECT).\n2. Invierte: exige los cinco campos de la política correcta.\n3. Status PASS vs NACK_AND_RETRY.\n4. Conserva el print.",
        hint: "El DEFECT aprueba si falta ack post-efecto o la key está vacía: at-least-once sin key es side-effect duplicado en reentrega.",
        hints: [
          "Ack solo después del efecto durable; `idempotency_key` no puede ser cadena vacía y el backoff debe estar activo.",
          "Pista: delivery at-least-once + effect_durable + acked_after_effect + idempotency_key no vacía + backoff.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: acked_after_effect=false o idempotency_key vacía", "CASO-IQU-045-2A es sintético"],
        tests: "El fixture `CASO-IQU-045-2A` satisface un predicado de dominio real; imprime `S45-T2-A PASS` y el assert booleano pasa.",
        feedback:
          "Ack antes del efecto o key vacía permite un segundo PDF en reentrega. NACK_AND_RETRY es la contención correcta, no un warning en logs del worker de Iquitos.",
        retrospective:
          "El orden es efecto → ack, no al revés. El error clásico es «ack primero para liberar la cola». Siguiente: tabla PASS / NACK / MISSING:backoff.",
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
        title: "Tres rutas de delivery (PASS / NACK / MISSING)",
        preamble:
          "- **Contexto:** el revisor de colas distingue política rota de política incompleta.\n- **Meta:** `assess` → PASS, NACK_AND_RETRY, MISSING:backoff.\n- **Éxito:** `PASS NACK_AND_RETRY MISSING:backoff`.\n- **Límites:** sin backoff no afirmes breach; no inventes el campo.",
        instruction:
          "1. Schema primero → MISSING.\n2. Completo: predicado de E1 → PASS o NACK_AND_RETRY.\n3. No trates ausencia de backoff como NACK.\n4. Imprime los tres.",
        hint: "Orden de ramas: sin `backoff` no afirmas la política de entrega; MISSING antes del predicado de breach.",
        hints: [
          "Si falta `backoff`, `MISSING:backoff`. No trates la ausencia como NACK.",
          "Con datos completos: ack post-efecto + key + efecto durable → PASS; key vacía o ack temprano → NACK_AND_RETRY.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: acked_after_effect=false o idempotency_key vacía", "CASO-IQU-045-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backoff` ausente y produce exactamente `PASS NACK_AND_RETRY MISSING:backoff`.",
        feedback:
          "Sin `backoff` no puedes afirmar la política de reintentos (MISSING): el revisor de colas no inventa el campo. Key vacía o ack-before-effect es breach de delivery y abre un segundo PDF en reentrega, no un log suave.",
        retrospective:
          "Ausencia de `backoff` es incertidumbre de política de reintentos, no un NACK automático. El error clásico es tratar «falta un campo» como breach de delivery. Pregunta: ¿qué riesgo operativo abres si asumes backoff=True sin verlo en el fixture? Luego (E3): CONTINUE / NACK / VERIFY_DELIVERY_SEMANTICS.",
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
        title: "Decide delivery: CONTINUE o VERIFY",
        preamble:
          "- **Contexto:** ante reentrega, el consumer enruta o se detiene a inspeccionar — no «sigue con suerte».\n- **Meta:** CONTINUE / NACK_AND_RETRY / VERIFY_DELIVERY_SEMANTICS.\n- **Éxito:** `CONTINUE NACK_AND_RETRY VERIFY_DELIVERY_SEMANTICS`.\n- **Límites:** missing de backoff ≠ éxito; no inventes key.",
        instruction:
          "1. Missing → VERIFY_DELIVERY_SEMANTICS.\n2. Completo: predicado sano → CONTINUE; roto → NACK_AND_RETRY.\n3. Imprime en orden de fixtures.\n4. No toques los datos del starter.",
        hint: "Sin `backoff` no puedes afirmar la política de entrega: enruta a `VERIFY_DELIVERY_SEMANTICS` antes del predicado de breach.",
        hints: [
          "Missing primero. Con datos completos, ack post-efecto + key no vacía + efecto durable → `CONTINUE`; si no → `NACK_AND_RETRY`.",
          "At-least-once sin key o con ack temprano es breach de delivery, no un warning suave.",
        ],
        edgeCases: ["falta backoff", "fixture adverso: acked_after_effect=false o idempotency_key vacía", "CASO-IQU-045-2A es sintético"],
        tests: "Fixtures `CASO-IQU-045-2A`, adverso y sin `backoff` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Dato faltante → VERIFY_DELIVERY_SEMANTICS (inspección humana de la política); contrato roto (ack temprano, key vacía, sin efecto durable) → NACK_AND_RETRY; solo delivery sano → CONTINUE. Verificar semántica no es fail silencioso ni «seguir con suerte» en reentrega.",
        retrospective:
          "Verificar semántica es una ruta humana, no un fail silencioso. Pregunta: ¿por qué at-most-once del fixture adverso no es «más seguro» aquí?",
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
assert results == ["CONTINUE", "NACK_AND_RETRY", "VERIFY_DELIVERY_SEMANTICS"]
` ,
          output: `CONTINUE NACK_AND_RETRY VERIFY_DELIVERY_SEMANTICS` ,
        },
      },
      {
        id: "S45-T2-B-E1",
        subtopicId: "S45-T2-B",
        kind: "guided",
        title: "Dedup real y poison en DLQ",
        preamble:
          "- **Contexto:** en `CASO-IQU-045-2B`, `m1,m1,m2` deben dejar processed={m1,m2} y poison con terminal en DLQ.\n- **Meta:** predicado set(message_ids)==processed_ids, len==2, ordered_partition, terminal_in_dlq.\n- **Éxito:** `S45-T2-B PASS`.\n- **Límites:** no mutes ids; no «cuentes» m1 dos veces; no toques el assert.",
        instruction:
          "1. Starter: PASS si len(processed)==len(messages) o no terminal (DEFECT).\n2. Usa igualdad de conjuntos y exige terminal_in_dlq.\n3. Exige ordered_partition.\n4. Conserva print PASS/DEDUP_OR_DLQ.",
        hint: "El DEFECT confunde `len(processed)` con dedup real: `m1` dos veces no son dos procesados. Poison sin `terminal_in_dlq` tampoco pasa.",
        hints: [
          "Compara conjuntos: `set(message_ids) == processed_ids`. Luego exige orden por partición y terminal en DLQ.",
          "Pista: `set(message_ids) == processed_ids` (dedup de m1), len(processed)==2, ordered_partition y terminal_in_dlq.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: processed incompleto, sin orden o sin DLQ terminal", "CASO-IQU-045-2B es sintético"],
        tests: "El fixture `CASO-IQU-045-2B` satisface un predicado de dominio real; imprime `S45-T2-B PASS` y el assert booleano pasa.",
        feedback:
          "`m1` duplicado no son dos procesados: el set es la prueba de dedup. Sin `terminal_in_dlq` el poison no está contenido y el revisor de mensajería rechaza el job.",
        retrospective:
          "Dedup se demuestra con conjuntos, no con longitudes de lista. El error clásico es len(processed)==3 con dos m1. Siguiente: tres rutas con MISSING:terminal_in_dlq.",
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
        title: "Tres rutas dedup/DLQ (PASS / DEDUP / MISSING)",
        preamble:
          "- **Contexto:** el auditor de mensajería no confunde «no hay flag de DLQ» con «poison mal manejado».\n- **Meta:** PASS, DEDUP_OR_DLQ, MISSING:terminal_in_dlq.\n- **Éxito:** `PASS DEDUP_OR_DLQ MISSING:terminal_in_dlq`.\n- **Límites:** sin terminal_in_dlq no evalúes dedup; missing ≠ breach.",
        instruction:
          "1. Schema primero.\n2. Completo: set + orden + terminal → PASS.\n3. Incompleto/sin orden/sin DLQ → DEDUP_OR_DLQ.\n4. Imprime los tres.",
        hint: "Orden de ramas: sin `terminal_in_dlq` no sabes si el poison terminó; MISSING antes de dedup.",
        hints: [
          "Si falta `terminal_in_dlq`, `MISSING:terminal_in_dlq`. Inspección ≠ DEDUP_OR_DLQ.",
          "Con datos completos: set(message_ids)==processed_ids + orden + terminal → PASS; incompleto → DEDUP_OR_DLQ.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: processed incompleto, sin orden o sin DLQ terminal", "CASO-IQU-045-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `terminal_in_dlq` ausente y produce exactamente `PASS DEDUP_OR_DLQ MISSING:terminal_in_dlq`.",
        feedback:
          "Sin `terminal_in_dlq` no sabes si el poison tiene terminal (MISSING). Processed incompleto o sin orden declarado es DEDUP_OR_DLQ — no un reintento silencioso.",
        retrospective:
          "Falta de flag `terminal_in_dlq` es incertidumbre de contención, no prueba de que el poison se manejó mal. El error clásico es marcar MISSING como DEDUP_OR_DLQ «por si acaso». Pregunta: ¿qué evidencia pedirías antes de replay controlado desde DLQ? Luego (E3): CONTINUE / DEDUP_OR_DLQ / INSPECT_MESSAGE_ORDER.",
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
        title: "Decide contención: CONTINUE o INSPECT",
        preamble:
          "- **Contexto:** el worker enruta poison y dups; si falta evidencia de terminal, **inspecciona** — no promueve.\n- **Meta:** CONTINUE / DEDUP_OR_DLQ / INSPECT_MESSAGE_ORDER.\n- **Éxito:** `CONTINUE DEDUP_OR_DLQ INSPECT_MESSAGE_ORDER`.\n- **Límites:** no conviertas missing en CONTINUE; no inventes terminal_in_dlq.",
        instruction:
          "1. Missing del flag → INSPECT_MESSAGE_ORDER.\n2. Completo: predicado de E1 → CONTINUE o DEDUP_OR_DLQ.\n3. Imprime en orden.\n4. Conserva fixtures.",
        hint: "Sin `terminal_in_dlq` no sabes si el poison terminó: enruta a `INSPECT_MESSAGE_ORDER` antes de evaluar dedup.",
        hints: [
          "Missing del flag de DLQ ≠ breach. Con datos completos, set(message_ids)==processed_ids + orden + terminal → `CONTINUE`.",
          "Poison o dup sin terminal en DLQ es `DEDUP_OR_DLQ`, no un reintento silencioso.",
        ],
        edgeCases: ["falta terminal_in_dlq", "fixture adverso: processed incompleto, sin orden o sin DLQ terminal", "CASO-IQU-045-2B es sintético"],
        tests: "Fixtures `CASO-IQU-045-2B`, adverso y sin `terminal_in_dlq` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Ausencia de terminal → INSPECT_MESSAGE_ORDER; breach de dedup/DLQ (processed incompleto, sin orden, sin terminal) → DEDUP_OR_DLQ; solo new/dup/DLQ correctos → CONTINUE. Contención sin evidencia de terminal es riesgo operativo, no un reintento «hasta que funcione».",
        retrospective:
          "Contención sin evidencia de terminal es riesgo operativo. Pregunta: ¿por qué un bucle de reintentos «hasta que funcione» no es recovery?",
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
assert results == ["CONTINUE", "DEDUP_OR_DLQ", "INSPECT_MESSAGE_ORDER"]
` ,
          output: `CONTINUE DEDUP_OR_DLQ INSPECT_MESSAGE_ORDER` ,
        },
      },
      {
        id: "S45-T3-A-E1",
        subtopicId: "S45-T3-A",
        kind: "guided",
        title: "Capacidad en cuota con backpressure",
        preamble:
          "- **Contexto:** pico de reportes sintéticos en `CASO-IQU-045-3A`: el pool del worker debe caber en cuota y SLO.\n- **Meta:** workers ≤ cuota, backlog/workers ≤ target, red privada, backpressure activo.\n- **Éxito:** `S45-T3-A PASS`.\n- **Límites:** no mutes números del fixture; no «subas cuota» en el código; corrige solo el predicado.",
        instruction:
          "1. Starter aprueba sobrecapacidad (DEFECT).\n2. Invierte a workers ≤ quota y lag por worker ≤ target.\n3. Exige private_network y backpressure.\n4. Conserva print PASS/APPLY_BACKPRESSURE.",
        hint: "El DEFECT aprueba sobrecapacidad: workers sobre cuota o sin backpressure no son carga sana.",
        hints: [
          "Capacidad OK: workers ≤ cuota, backlog/workers ≤ target, red privada y backpressure activo.",
          "Pista: workers ≤ quota_workers, backlog/workers ≤ target_per_worker, private_network y backpressure activos.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers>quota, lag alto, red pública o sin backpressure", "CASO-IQU-045-3A es sintético"],
        tests: "El fixture `CASO-IQU-045-3A` satisface un predicado de dominio real; imprime `S45-T3-A PASS` y el assert booleano pasa.",
        feedback:
          "Workers sobre cuota o sin backpressure rompen el SLO de status antes de que el dashboard lo note. APPLY_BACKPRESSURE es contención, no un log opcional.",
        retrospective:
          "Capacidad sana es cuota + target + red + backpressure juntos. El error clásico es solo mirar workers. Siguiente: tres rutas con MISSING:backpressure.",
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
        title: "Tres rutas de capacidad (PASS / APPLY / MISSING)",
        preamble:
          "- **Contexto:** el operador de plataforma no confunde «falta el flag» con «ya estás saturado».\n- **Meta:** PASS, APPLY_BACKPRESSURE, MISSING:backpressure.\n- **Éxito:** `PASS APPLY_BACKPRESSURE MISSING:backpressure`.\n- **Límites:** sin backpressure no apliques contención a ciegas; no inventes el flag.",
        instruction:
          "1. Schema primero → MISSING.\n2. Completo: predicado de E1 → PASS o APPLY_BACKPRESSURE.\n3. Imprime los tres.\n4. Conserva fixtures (backlog 500 adverso).",
        hint: "Orden de ramas: sin flag de backpressure no afirmas control de carga; MISSING primero.",
        hints: [
          "Si falta `backpressure`, `MISSING:backpressure` — pide capacidad, no apliques backpressure a ciegas.",
          "Con datos completos: workers en cuota + lag OK + red privada + backpressure → PASS; sobrecarga → APPLY_BACKPRESSURE.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers>quota, lag alto, red pública o sin backpressure", "CASO-IQU-045-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backpressure` ausente y produce exactamente `PASS APPLY_BACKPRESSURE MISSING:backpressure`.",
        feedback:
          "Sin flag backpressure no hay política de contención (MISSING). Workers sobre cuota, lag alto o red pública es APPLY_BACKPRESSURE — contención inmediata.",
        retrospective:
          "Pedir capacidad (MISSING de flag) no es lo mismo que aplicar backpressure (breach de carga o red pública). El error clásico es APPLY a ciegas cuando solo falta evidencia del control. Pregunta: si workers están en cuota pero `private_network=False`, ¿qué token debe ganar? Luego (E3): CONTINUE / APPLY / REQUEST_CAPACITY.",
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
        title: "Decide escala: CONTINUE o REQUEST_CAPACITY",
        preamble:
          "- **Contexto:** el control plane no escala a ciegas ni promueve con flag ausente.\n- **Meta:** CONTINUE / APPLY_BACKPRESSURE / REQUEST_CAPACITY.\n- **Éxito:** `CONTINUE APPLY_BACKPRESSURE REQUEST_CAPACITY`.\n- **Límites:** missing ≠ CONTINUE; no inventes backpressure=true.",
        instruction:
          "1. Missing → REQUEST_CAPACITY.\n2. Completo: predicado sano → CONTINUE; roto → APPLY_BACKPRESSURE.\n3. Imprime en orden.\n4. No toques datos.",
        hint: "Sin flag de backpressure no puedes afirmar el control de carga: enruta a `REQUEST_CAPACITY` antes del predicado de sobrecarga.",
        hints: [
          "Missing primero. Con datos completos, workers en cuota + lag por worker OK + red privada + backpressure → `CONTINUE`.",
          "Workers sobre cuota, red pública o lag alto → `APPLY_BACKPRESSURE`.",
        ],
        edgeCases: ["falta backpressure", "fixture adverso: workers>quota, lag alto, red pública o sin backpressure", "CASO-IQU-045-3A es sintético"],
        tests: "Fixtures `CASO-IQU-045-3A`, adverso y sin `backpressure` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Capacidad incierta (falta backpressure) → REQUEST_CAPACITY; sobrecarga, lag alto o red pública → APPLY_BACKPRESSURE; carga dentro de SLO y red privada → CONTINUE. Solicitar capacidad es planificación humana; APPLY es contención inmediata antes de romper el status del job.",
        retrospective:
          "Solicitar capacidad es ruta humana de planificación; APPLY es contención inmediata. Pregunta: ¿por qué red pública en el adverso fuerza APPLY aunque hubiera «CPU libre»?",
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
assert results == ["CONTINUE", "APPLY_BACKPRESSURE", "REQUEST_CAPACITY"]
` ,
          output: `CONTINUE APPLY_BACKPRESSURE REQUEST_CAPACITY` ,
        },
      },
      {
        id: "S45-T3-B-E1",
        subtopicId: "S45-T3-B",
        kind: "guided",
        title: "Least privilege con egress allowlist",
        preamble:
          "- **Contexto:** el rol del worker (`CASO-IQU-045-3B`) solo puede promoverse con prueba negativa.\n- **Meta:** requested_action ∈ allowed, private_path, egress_host ∈ egress_allow.\n- **Éxito:** `S45-T3-B PASS`.\n- **Límites:** no amplíes allowed_actions; no inventes hosts; corrige el predicado.",
        instruction:
          "1. Starter: PASS en denegación (DEFECT).\n2. Invierte a membership + private_path.\n3. Status PASS vs DENY_IAM_OR_EGRESS.\n4. Conserva print.",
        hint: "El DEFECT invierte la allowlist: admin o host desconocido no pueden dar PASS. La prueba negativa es la evidencia.",
        hints: [
          "PASS solo si la acción pedida está en allowlist, el path es privado y el host de egress está listado.",
          "Pista: action en allowed_actions, private_path, y egress_host ∈ egress_allow (prueba negativa de admin/host desconocido).",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción no permitida, path público o egress desconocido", "CASO-IQU-045-3B es sintético"],
        tests: "El fixture `CASO-IQU-045-3B` satisface un predicado de dominio real; imprime `S45-T3-B PASS` y el assert booleano pasa.",
        feedback:
          "Admin abierto o host desconocido es DENY, no un atajo de laboratorio. La prueba negativa es lo que el revisor de seguridad lee en el portfolio de Iquitos.",
        retrospective:
          "Allowlist cerrada + denegaciones explícitas. El error clásico es invertir el predicado «para que pase el assert». Siguiente: tres rutas con MISSING:egress_allow.",
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
        title: "Tres rutas IAM (PASS / DENY / MISSING)",
        preamble:
          "- **Contexto:** el revisor de seguridad no confunde política incompleta con breach de acción.\n- **Meta:** PASS, DENY_IAM_OR_EGRESS, MISSING:egress_allow.\n- **Éxito:** `PASS DENY_IAM_OR_EGRESS MISSING:egress_allow`.\n- **Límites:** sin egress_allow no deniegues a ciegas; no inventes la allowlist.",
        instruction:
          "1. Schema primero.\n2. Completo: predicado de E1 → PASS o DENY.\n3. Imprime los tres.\n4. Conserva fixture admin/unknown.example.",
        hint: "Orden de ramas: sin `egress_allow` la política está incompleta; MISSING antes de DENY.",
        hints: [
          "Si falta `egress_allow`, `MISSING:egress_allow` — no conviertas incertidumbre en denegación.",
          "Con datos completos: acción en allowlist + path privado + host listado → PASS; admin/host desconocido → DENY_IAM_OR_EGRESS.",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción no permitida, path público o egress desconocido", "CASO-IQU-045-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `egress_allow` ausente y produce exactamente `PASS DENY_IAM_OR_EGRESS MISSING:egress_allow`.",
        feedback:
          "Sin egress_allow no hay prueba negativa de red (MISSING). Acción fuera de scope o path público es DENY_IAM_OR_EGRESS — breach, no incertidumbre.",
        retrospective:
          "Pedir policy scoped (falta `egress_allow`) no es denegar (breach de acción o host). El error clásico es DENY a ciegas cuando solo falta la allowlist. Pregunta: ¿qué pedirías al equipo de seguridad antes de promover el rol del worker? Luego (E3): CONTINUE / DENY / REQUEST_SCOPED_POLICY.",
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
        title: "Decide IAM: CONTINUE o REQUEST_SCOPED_POLICY",
        preamble:
          "- **Contexto:** sin allowlist de egress el job no se promueve «con fe».\n- **Meta:** CONTINUE / DENY_IAM_OR_EGRESS / REQUEST_SCOPED_POLICY.\n- **Éxito:** `CONTINUE DENY_IAM_OR_EGRESS REQUEST_SCOPED_POLICY`.\n- **Límites:** missing ≠ CONTINUE; no inventes egress_allow.",
        instruction:
          "1. Missing → REQUEST_SCOPED_POLICY.\n2. Completo: predicado sano → CONTINUE; roto → DENY.\n3. Imprime en orden.\n4. Conserva fixtures.",
        hint: "Sin `egress_allow` la política está incompleta: enruta a `REQUEST_SCOPED_POLICY` antes de denegar o aprobar.",
        hints: [
          "Missing de allowlist ≠ breach. Con datos completos, acción en set + path privado + host listado → `CONTINUE`.",
          "Admin, path público o host desconocido → `DENY_IAM_OR_EGRESS` (prueba negativa).",
        ],
        edgeCases: ["falta egress_allow", "fixture adverso: acción no permitida, path público o egress desconocido", "CASO-IQU-045-3B es sintético"],
        tests: "Fixtures `CASO-IQU-045-3B`, adverso y sin `egress_allow` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Política incompleta → REQUEST_SCOPED_POLICY; breach IAM/egress (admin, path público, host desconocido) → DENY_IAM_OR_EGRESS; solo allowlist + private → CONTINUE. Solicitar policy scoped es trabajo de seguridad, no un skip para «desbloquear el demo».",
        retrospective:
          "Solicitar policy scoped es trabajo de seguridad, no un skip. Pregunta: ¿qué prueba negativa mostrarías en el portfolio de CP-N4-B?",
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
assert results == ["CONTINUE", "DENY_IAM_OR_EGRESS", "REQUEST_SCOPED_POLICY"]
` ,
          output: `CONTINUE DENY_IAM_OR_EGRESS REQUEST_SCOPED_POLICY` ,
        },
      },
      {
        id: "S45-T4-A-E1",
        subtopicId: "S45-T4-A",
        kind: "guided",
        title: "Plan IaC limpio en staging",
        preamble:
          "- **Contexto:** en `CASO-IQU-045-4A` la cola y el bucket de reportes solo aplican si el plan es limpio.\n- **Meta:** declared==planned, env dev|staging|prod, sin secretos, destructive_changes==0.\n- **Éxito:** `S45-T4-A PASS`.\n- **Límites:** no mutes recursos; no «aceptes shared»; corrige el predicado.",
        instruction:
          "1. Starter: PASS con secretos o destroys (DEFECT).\n2. Invierte y añade paridad de sets y entorno válido.\n3. Status PASS vs REJECT_IAC_PLAN.\n4. Conserva print.",
        hint: "El DEFECT aprueba planes con secretos, entorno `shared` o destroys: un plan limpio es paridad declared==planned sin sorpresas.",
        hints: [
          "Rechaza si el entorno no es dev/staging/prod, hay secretos en el plan o `destructive_changes > 0` sin control.",
          "Pista: set(declared)==set(planned), env en {dev,staging,prod}, secrets_in_plan=false y destructive_changes==0.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: secretos en plan, entorno inválido o destroy inesperado", "CASO-IQU-045-4A es sintético"],
        tests: "El fixture `CASO-IQU-045-4A` satisface un predicado de dominio real; imprime `S45-T4-A PASS` y el assert booleano pasa.",
        feedback:
          "Secretos en el plan o destroy de la cola son REJECT_IAC_PLAN. Apply sin revisión no es evidencia de T4-A para el job de reportes de Iquitos.",
        retrospective:
          "Plan aceptable = paridad + entorno + sin secretos + cero destroys. El error clásico es solo mirar «no hay error de syntax». Siguiente: MISSING:destructive_changes.",
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
        title: "Tres rutas de plan (PASS / REJECT / MISSING)",
        preamble:
          "- **Contexto:** el revisor de IaC no confunde «no sé cuántos destroys» con «plan con secretos».\n- **Meta:** PASS, REJECT_IAC_PLAN, MISSING:destructive_changes.\n- **Éxito:** `PASS REJECT_IAC_PLAN MISSING:destructive_changes`.\n- **Límites:** sin conteo de destroys no rechaces a ciegas; no inventes el campo.",
        instruction:
          "1. Schema primero.\n2. Completo: predicado de E1 → PASS o REJECT.\n3. Imprime los tres.\n4. Conserva env `shared` adverso.",
        hint: "Orden de ramas: sin `destructive_changes` no mides drift; MISSING antes de reject/accept.",
        hints: [
          "Si falta `destructive_changes`, `MISSING:destructive_changes` → revisión de drift, no rechazo ciego.",
          "Con datos completos: declared==planned + entorno válido + sin secretos + 0 destroys → PASS; plan malo → REJECT_IAC_PLAN.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: secretos en plan, entorno inválido o destroy inesperado", "CASO-IQU-045-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `destructive_changes` ausente y produce exactamente `PASS REJECT_IAC_PLAN MISSING:destructive_changes`.",
        feedback:
          "Sin destructive_changes no puedes auditar drift (MISSING). Secretos en plan o env inventado es REJECT_IAC_PLAN — no un warning de linter.",
        retrospective:
          "Drift no medido (falta `destructive_changes`) es incertidumbre de revisión, no un REJECT automático ni un PASS. El error clásico es rechazar a ciegas o aplicar igual. Pregunta: ¿qué mirarías en el plan además del conteo de destroys (secretos, entorno inventado)? Luego (E3): CONTINUE / REJECT / REVIEW_DRIFT.",
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
        title: "Decide apply: CONTINUE o REVIEW_DRIFT",
        preamble:
          "- **Contexto:** sin conteo de destroys no hay apply silencioso en el job de Iquitos.\n- **Meta:** CONTINUE / REJECT_IAC_PLAN / REVIEW_DRIFT.\n- **Éxito:** `CONTINUE REJECT_IAC_PLAN REVIEW_DRIFT`.\n- **Límites:** missing ≠ CONTINUE; no inventes destructive_changes=0.",
        instruction:
          "1. Missing → REVIEW_DRIFT.\n2. Completo: predicado limpio → CONTINUE; plan malo → REJECT.\n3. Imprime en orden.\n4. Conserva fixtures.",
        hint: "Sin `destructive_changes` no mides drift destructivo: enruta a `REVIEW_DRIFT` antes de accept/reject.",
        hints: [
          "Missing del conteo de destroys ≠ plan malo. Con datos completos, declared==planned + entorno válido + sin secretos + 0 destroys → `CONTINUE`.",
          "Secretos, entorno `shared` o destroy inesperado → `REJECT_IAC_PLAN`.",
        ],
        edgeCases: ["falta destructive_changes", "fixture adverso: secretos en plan, entorno inválido o destroy inesperado", "CASO-IQU-045-4A es sintético"],
        tests: "Fixtures `CASO-IQU-045-4A`, adverso y sin `destructive_changes` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Drift no medido → REVIEW_DRIFT; plan inseguro (secretos, env `shared`, destroy inesperado) → REJECT_IAC_PLAN; solo paridad limpia en dev/staging/prod → CONTINUE. Revisar drift es trabajo humano **previo** al apply, no un warning post-mortem.",
        retrospective:
          "Revisar drift es trabajo humano previo al apply. Pregunta: ¿qué destruiría un plan que deja solo `bucket` cuando se declaró `queue+bucket`?",
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
assert results == ["CONTINUE", "REJECT_IAC_PLAN", "REVIEW_DRIFT"]
` ,
          output: `CONTINUE REJECT_IAC_PLAN REVIEW_DRIFT` ,
        },
      },
      {
        id: "S45-T4-B-E1",
        subtopicId: "S45-T4-B",
        kind: "guided",
        title: "Presupuesto PEN y recovery listos",
        preamble:
          "- **Contexto:** en `CASO-IQU-045-4B` el responsable de costo congela scale-out si el forecast sintético rompe el presupuesto.\n- **Meta:** forecast_pen ≤ budget_pen, cuota OK, restore_tested y portable_export.\n- **Éxito:** `S45-T4-B PASS`.\n- **Límites:** no mutes montos PEN; no inventes restore=true; corrige el predicado.",
        instruction:
          "1. Starter: PASS con sobrepresupuesto (DEFECT).\n2. Invierte desigualdades y exige restore + export.\n3. Status PASS vs FREEZE_SCALE_OUT.\n4. Conserva print.",
        hint: "El DEFECT aprueba forecast > budget o cuota rota: en PEN sintéticos eso congela scale-out, no lo celebra.",
        hints: [
          "PASS: forecast_pen ≤ budget_pen, cuota bajo límite, restore ensayado y export portable.",
          "Pista: forecast_pen ≤ budget_pen (PEN), quota_used ≤ quota_limit, restore_tested y portable_export.",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: forecast>budget PEN, cuota rebasada o restore no probado", "CASO-IQU-045-4B es sintético"],
        tests: "El fixture `CASO-IQU-045-4B` satisface un predicado de dominio real; imprime `S45-T4-B PASS` y el assert booleano pasa.",
        feedback:
          "Forecast > budget o cuota rota es FREEZE_SCALE_OUT en PEN sintéticos. Recovery incompleto (sin restore o sin export portable) también bloquea: un print «bajo presupuesto» no cierra T4-B ni el gate CP-N4-B.",
        retrospective:
          "FinOps del job = presupuesto + cuota + drill de recovery juntos. El error clásico es invertir desigualdades «para que el assert pase» sin leer forecast/budget. Pregunta: ¿qué congela scale-out primero, el monto o la falta de export? Siguiente: MISSING:portable_export.",
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
        title: "Tres rutas de costo (PASS / FREEZE / MISSING)",
        preamble:
          "- **Contexto:** el auditor de costo no confunde «falta export» con «ya rebasaste el budget».\n- **Meta:** PASS, FREEZE_SCALE_OUT, MISSING:portable_export.\n- **Éxito:** `PASS FREEZE_SCALE_OUT MISSING:portable_export`.\n- **Límites:** sin portable_export no congeles a ciegas; no inventes el flag.",
        instruction:
          "1. Schema primero.\n2. Completo: predicado de E1 → PASS o FREEZE.\n3. Imprime los tres.\n4. Conserva forecast 1500 adverso.",
        hint: "Orden de ramas: sin `portable_export` no demuestras portabilidad; MISSING antes de FREEZE.",
        hints: [
          "Si falta `portable_export`, `MISSING:portable_export` → revisión de responsable de costo, no freeze automático.",
          "Con datos completos: forecast ≤ budget PEN + cuota OK + restore + export → PASS; sobrepresupuesto → FREEZE_SCALE_OUT.",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: forecast>budget PEN, cuota rebasada o restore no probado", "CASO-IQU-045-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `portable_export` ausente y produce exactamente `PASS FREEZE_SCALE_OUT MISSING:portable_export`.",
        feedback:
          "Sin `portable_export` no hay recovery portable (MISSING): el auditor de costo pide evidencia de export, no un freeze inventado. Forecast > budget o cuota rota es FREEZE_SCALE_OUT — el dueño congela scale-out ya roto.",
        retrospective:
          "Revisión de dueño (falta export) no es freeze (breach de monto o cuota). El error clásico es FREEZE automático cuando solo falta evidencia de portabilidad. Pregunta: si forecast=820 pero no hay `portable_export`, ¿quién debe actuar y con qué token? Luego (E3): CONTINUE / FREEZE / COST_OWNER_REVIEW.",
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
        title: "Decide FinOps: CONTINUE o COST_OWNER_REVIEW",
        preamble:
          "- **Contexto:** sin export portable el scale-out no se «aprueba con fe» en el portfolio.\n- **Meta:** CONTINUE / FREEZE_SCALE_OUT / COST_OWNER_REVIEW.\n- **Éxito:** `CONTINUE FREEZE_SCALE_OUT COST_OWNER_REVIEW`.\n- **Límites:** missing ≠ CONTINUE; no inventes portable_export=true.",
        instruction:
          "1. Missing → COST_OWNER_REVIEW.\n2. Completo: predicado sano → CONTINUE; roto → FREEZE_SCALE_OUT.\n3. Imprime en orden.\n4. Conserva fixtures.",
        hint: "Sin `portable_export` no demuestras portabilidad: enruta a `COST_OWNER_REVIEW` antes de congelar o aprobar.",
        hints: [
          "Missing de export ≠ sobrepresupuesto. Con datos completos, forecast ≤ budget PEN + cuota OK + restore + export → `CONTINUE`.",
          "Forecast o cuota rotos → `FREEZE_SCALE_OUT` (responsable de costo revisa scale-out).",
        ],
        edgeCases: ["falta portable_export", "fixture adverso: forecast>budget PEN, cuota rebasada o restore no probado", "CASO-IQU-045-4B es sintético"],
        tests: "Fixtures `CASO-IQU-045-4B`, adverso y sin `portable_export` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Evidencia de recovery incompleta → COST_OWNER_REVIEW; costo/cuota rota → FREEZE_SCALE_OUT; presupuesto sano + drill → CONTINUE. Dueño de costo revisa; freeze detiene scale-out ya roto.",
        retrospective:
          "Dueño de costo revisa evidencia de recovery; freeze detiene scale-out ya roto. Pregunta de cierre: ¿qué tres números (forecast, budget, restore min) defenderías en 30 s ante el revisor de CP-N4-B?",
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
assert results == ["CONTINUE", "FREEZE_SCALE_OUT", "COST_OWNER_REVIEW"]
` ,
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
      "Incluye cola con deduplicación por clave, retry y envío a estado terminal en DLQ.",
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
    portfolioNote: "Evidencia de CP-N4-B · job asíncrono resiliente: muestra baseline, decisión de stores, colas con DLQ, IAM/egress, presupuesto/restore, pruebas normal/breach/uncertain, resultado medido, rollback y riesgo residual. El esqueleto no es una lista de verificación de booleanos: implementa el contrato y enlaza artefactos del proyecto.",
    rubric: [
      { criterion: "Correctitud del contrato y gate (efecto durable + idempotencia)", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación (DLQ / inspección)", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege (IAM/egress modelo)", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: SLO, costo/cuota, observabilidad y rollback", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras — ack solo tras object_store + job_status, y SKIP_DUP en la segunda entrega de `job-iqu-1`? (2) ¿qué harías distinto con cola/cloud real vs. este modelo stdlib (credenciales, egress, PII)? (3) En el README, una frase de impacto medible (p. ej. «reintento no reimprime PDF; poison a DLQ; forecast 820 ≤ budget 1000 PEN») que puedas defender en 30 segundos ante el gate CP-N4-B.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar la elección de stores en `CASO-IQU-045`?",
        options: ["ADR de persistencia con fuente de verdad (object + relacional; cache no autoritativo)", "un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"],
        correctIndex: 0,
        explanation: "La teoría exige ADR de persistencia con fuente de verdad; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Ante un mensaje poison tras N reintentos (o un breach de entrega), ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "terminar en DLQ (p. ej. SEND_TO_DLQ / DEDUP_OR_DLQ) y conservar evidencia", "borrar el trace para reducir ruido"],
        correctIndex: 2,
        explanation: "Los contratos de S45 fallan cerrado: breach o poison van a contención/DLQ con evidencia; la incertidumbre se enruta a inspección, no a éxito silencioso.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-B · job asíncrono resiliente`?",
        options: ["el archivo S45 existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva", "reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos"],
        correctIndex: 3,
        explanation: "El gate es conductual y medible: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
      },
      {
        question: "En autoscaling del worker de colas, ¿cuándo la señal principal debe ser lag de cola y no CPU?",
        options: ["siempre que queue_lag >= 0", "cuando queue_lag supera el umbral de backlog acordado", "solo si el cache es autoritativo", "cuando el plan de IaC tiene secretos"],
        correctIndex: 1,
        explanation: "La señal de escala por cola se activa al cruzar el umbral de lag; valores bajos pueden observar CPU. El umbral no es código muerto.",
      },
      {
        question: "Tras N reintentos fallidos, un mensaje poison debe…",
        options: ["ir a DLQ terminal con evidencia y sin segundo side-effect silencioso", "reintentarse en bucle infinito", "borrarse sin audit trail", "escribirse en el cache como fuente de verdad"],
        correctIndex: 0,
        explanation: "Delivery resiliente: poison → DLQ controlada; reintentos con idempotency no duplican resultados de negocio. Cache nunca es fuente de verdad.",
      },
      {
        question: "¿Qué política IAM/egress es evidencia válida de T3-B para el worker de reportes?",
        options: ["iam:admin en producción para desbloquear el demo", "egress abierto a 0.0.0.0/0 porque el job es sintético", "acciones mínimas (p. ej. object:get + queue:ack), path privado y egress allowlisted con prueba negativa de admin/host desconocido", "imprimir least_privilege True sin probar denegaciones"],
        correctIndex: 2,
        explanation: "Least privilege se demuestra con allowlist de acciones/hosts y denegaciones explícitas; admin abierto o egress libre no es evidencia de promoción.",
      },
      {
        question: "Si `forecast_pen` (soles sintéticos) supera `budget_pen` o la cuota se rebosa, ¿qué token corresponde?",
        options: ["ACK silencioso y seguir escalando workers", "borrar el plan de IaC para reducir costo contable", "marcar cache como fuente de verdad del presupuesto", "FREEZE_SCALE_OUT (y revisión del responsable de costo si falta evidencia de recovery/export)"],
        correctIndex: 3,
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
