import type { CourseSection } from '../../types'

export const section41: CourseSection = {
  id: "llm-finetuning",
  index: 41,
  title: "APIs con FastAPI y contratos HTTP",
  shortTitle: "APIs FastAPI",
  tagline: "API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "Cpu",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **APIs con FastAPI y contratos HTTP** convierten las fronteras de S40 en endpoints versionados con evidencia operativa. La práctica entrega respuestas OpenAPI sin PII (status, evidencia, errores tipados) y se promueve solo cuando crear el mismo job con la misma idempotency key no duplica side effects y consultar conserva compatibilidad. Id legacy `llm-finetuning` se conserva; el path V3 es HTTP/API, no fine-tuning de LLMs.",
  learningOutcomes: [
    { text: "Diseña recursos HTTP y status" },
    { text: "Versiona, pagina e idempotiza" },
    { text: "Estructura routing y dependencies" },
    { text: "Valida, serializa y documenta" },
    { text: "Separa sync/async y background" },
    { text: "Maneja errores, timeouts y lifecycle" },
    { text: "Prueba unit/contract/integration" },
    { text: "Verifica compat, rate limit y obs" },
  ],
  theory: [
    {
      heading: "Ruta de S41: APIs con FastAPI y contratos HTTP",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Recurso:** sustantivo versionado (`/v1/jobs`). **Status semántico:** 201 create, 200 read, 4xx cliente, 5xx servidor. **Idempotency-Key:** misma clave + mismo body ⇒ un solo side effect. **OpenAPI:** contrato de request/response documentado. **Dependency injection:** handler delgado; capacidad inyectada. **Compatibilidad de lectura:** clientes viejos siguen leyendo campos estables. **PII en errores:** prohibido — solo códigos y mensajes seguros.",
        "Esta sección implementa las fronteras de S40 como **contratos HTTP** sin girar un cluster real: solo stdlib + contratos al estilo FastAPI/OpenAPI (referencia profesional; progressive disclosure). El caso `CASO-ARE-041` (oficina ficticia en Arequipa) es sintético: sin credenciales, sin red externa y sin PII real.",
        "Producto incremental: API versionada de jobs y evidencia. Entrada: `POST/GET /v1/jobs` con identidad sintética e Idempotency-Key. Salida: respuestas con status semánticos (201/200/4xx/5xx), body sin campos internos y errores tipados. Error de promoción: duplicar side effects en replay, filtrar PII en errores o romper compatibilidad de lectura.",
        "Orden: T1 recursos/status e idempotencia → T2 routing/deps y validación → T3 sync/async y errores → T4 tests, rate limit y observabilidad. Teoría con criterio medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto HTTP por ejercicio. Id legacy `llm-finetuning` no implica fine-tuning; V3 es API gobernada del control plane. Stack didáctico: **stdlib** (dicts, funciones) modelando contratos FastAPI sin cluster.",
      ],
      code: {
        language: 'python',
        title: "s41_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-ARE-041",
        "gates": ["idempotent_create", "no_pii_in_errors", "read_compat"],
        "llm_finetuning_topic": False,
        "duplicate_side_effect_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("llm_finetuning_topic", c["llm_finetuning_topic"])
print("duplicate_side_effect_ok", c["duplicate_side_effect_ok"])
`,
        output: `case CASO-ARE-041
llm_finetuning_topic False
duplicate_side_effect_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-A · API HTTP gobernada: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "recursos, métodos y status",
      subtopicId: "S41-T1-A",
      paragraphs: [
        "Modela recursos con **sustantivos** (`/v1/jobs`, `/v1/health`), usa métodos HTTP por semántica (GET lectura, POST creación) y devuelve status que separan creación (201), lectura OK (200), validación (400), ausencia (404), conflicto (409) y fallo interno (500). Un verbo en la URL suele ser un olor de diseño.",
        "Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e Idempotency-Key. Salida de este subtema: matriz método/recurso/status probada en el lab. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable **sin PII**. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad de lectura.",
        "Aplicación de `recursos, métodos y status` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es matriz método/recurso/status probada (`POST /v1/jobs → 201`). No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "resources_methods_status.py",
        code: `def http_matrix(methods, resources, create_status=201):
    return {
        "methods": methods,
        "create_status": create_status,
        "resources": resources,
    }

m = http_matrix(["GET", "POST"], ["jobs", "health"])
print("methods", m["methods"])
print("create_status", m["create_status"])
print("resources", m["resources"])`,
        output: `methods ['GET', 'POST']
create_status 201
resources ['jobs', 'health']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S41-T1-A: matriz método/recurso/status probada. Si falta, responde `RETURN_CORRECT_HTTP_STATUS`; si no alcanza para decidir, `REVIEW_RESOURCE_SEMANTICS`.",
      },
    },
    {
      heading: "idempotencia, paginación y versionado",
      subtopicId: "S41-T1-B",
      paragraphs: [
        "La idempotencia liga una clave al hash de la solicitud y al resultado; cursor estable y versión explícita evitan duplicados y paginación cambiante.",
        "Contrato de replay. Entrada: Idempotency-Key + body canónico de POST /v1/jobs. Salida: primera respuesta `created` y segunda `replay` sin segundo job. Error: misma clave con body distinto (conflicto) o cursor inestable al paginar. Criterio: el store de claves es durable en el path del job y la página `next` no reordena el set entre requests.",
        "Aplicación a `CASO-ARE-041-T1B` (oficina ficticia en Arequipa): dos POST con la misma key crean un solo job sintético; `page([0,1,2,3],0,2)` devuelve next=2. Sin PII ni secretos en headers de log.",
      ],
      code: {
        language: 'python',
        title: "idempotency_pagination_versioning.py",
        code: `def page(items, cursor, size=2):
    chunk = items[cursor:cursor + size]
    nxt = cursor + size if cursor + size < len(items) else None
    return {"data": chunk, "next": nxt}

print(page([0, 1, 2, 3], 0, 2))
print("idempotency_key", "Idempo-Key")
print("version", "v1")`,
        output: `{'data': [0, 1], 'next': 2}
idempotency_key Idempo-Key
version v1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S41-T1-B, audita replay idéntico sin segundo efecto. Un breach activa `RETURN_IDEMPOTENCY_CONFLICT` y una ausencia activa `REPLAY_STORED_RESPONSE`.",
      },
    },
    {
      heading: "routing, dependencies y modelos",
      subtopicId: "S41-T2-A",
      paragraphs: [
        "FastAPI separa routing, dependencias y modelos: el handler coordina, la dependencia provee capacidades y el dominio conserva reglas.",
        "Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida de este subtema: handler delgado con dependencia sustituible. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
        "Aplicación de `routing, dependencies y modelos` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es handler delgado con dependencia sustituible. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "routing_deps_models.py",
        code: `def handler_deps(route_name: str) -> dict:
    base = ["db", "user"]
    return {"deps": base, "job_deps": base if route_name == "create_job" else [], "model": "JobCreate"}

h = handler_deps("create_job")
print("deps", h["deps"])
print("job_deps", h["job_deps"])
print("model", h["model"])`,
        output: `deps ['db', 'user']
job_deps ['db', 'user']
model JobCreate`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S41-T2-A conserva handler delgado con dependencia sustituible; no conviertas `THIN_THE_HANDLER` ni `REVIEW_DEPENDENCY_BOUNDARY` en éxito silencioso.",
      },
    },
    {
      heading: "validación, serialización y documentación",
      subtopicId: "S41-T2-B",
      paragraphs: [
        "Pydantic valida entrada antes del dominio, serializa una vista permitida y alimenta OpenAPI; la documentación debe coincidir con el comportamiento observado.",
        "Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida de este subtema: request inválido rechazado y response sin campos internos. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
        "Aplicación de `validación, serialización y documentación` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es request inválido rechazado y response sin campos internos. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "validation_serialize_docs.py",
        code: `def public_view(body: dict, allow: set) -> dict:
    return {k: v for k, v in body.items() if k in allow}

raw = {"name": "er-run", "priority": "normal", "internal_key": "x"}
print(public_view(raw, {"name", "priority"}))
print("openapi", True)
print("serialize", "json")`,
        output: `{'name': 'er-run', 'priority': 'normal'}
openapi True
serialize json`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S41-T2-B: demuestra request inválido rechazado y response sin campos internos. Falla cerrada con `REJECT_AND_REDACT` y deriva incertidumbre mediante `REGENERATE_OPENAPI`.",
      },
    },
    {
      heading: "sync/async y background boundaries",
      subtopicId: "S41-T3-A",
      paragraphs: [
        "Async beneficia espera de I/O; trabajo CPU-bound o durable no debe esconderse en una coroutine ni en una tarea en memoria sin garantía.",
        "Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida de este subtema: boundary sync/async y background documentada. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
        "Aplicación de `sync/async y background boundaries` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es boundary sync/async y background documentada. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "sync_async_background.py",
        code: `def work_boundary(kind: str) -> str:
    if kind == "cpu_heavy":
        return "background"
    if kind == "io_wait":
        return "async"
    return "sync"

print(work_boundary("http_get"))
print(work_boundary("cpu_heavy"))
print("boundary", "request_vs_worker")`,
        output: `sync
background
boundary request_vs_worker`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S41-T3-A, el artefacto comprobable es boundary sync/async y background documentada. Sin él corresponde `MOVE_WORK_OFF_EVENT_LOOP` o, si faltan datos, `CHOOSE_BACKGROUND_BOUNDARY`.",
      },
    },
    {
      heading: "errores, timeouts y lifecycle",
      subtopicId: "S41-T3-B",
      paragraphs: [
        "Errores estables llevan código, mensaje seguro y trace id; timeouts se presupuestan de extremo a extremo y el lifecycle abre/cierra recursos una vez.",
        "Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida de este subtema: timeout y shutdown sin recurso huérfano. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
        "Aplicación de `errores, timeouts y lifecycle` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es timeout y shutdown sin recurso huérfano. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "errors_timeouts_lifecycle.py",
        code: `def error_payload(code: str, message: str) -> dict:
    return {"error": code, "message": message}

print(error_payload("timeout", "job exceeded 30s"))
print("lifecycle", ["startup", "shutdown"])
print("no_pii", True)`,
        output: `{'error': 'timeout', 'message': 'job exceeded 30s'}
lifecycle ['startup', 'shutdown']
no_pii True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S41-T3-B: prueba timeout y shutdown sin recurso huérfano y registra por separado `CANCEL_AND_CLOSE` (breach) y `RECALCULATE_TIMEOUT_BUDGET` (missing).",
      },
    },
    {
      heading: "unit/contract/integration",
      subtopicId: "S41-T4-A",
      paragraphs: [
        "Unit prueba reglas, contract prueba el acuerdo HTTP e integration prueba adapters reales controlados; cada nivel responde una pregunta distinta.",
        "Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida de este subtema: pirámide con fallo sembrado detectado en el nivel correcto. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
        "Aplicación de `unit/contract/integration` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es pirámide con fallo sembrado detectado en el nivel correcto. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "unit_contract_integration.py",
        code: `def pyramid_counts(unit: int, contract: int, integration: int) -> dict:
    return {
        "total": unit + contract + integration,
        "pyramid": unit >= contract >= integration,
        "contract": "openapi_schema",
    }

p = pyramid_counts(12, 5, 2)
print("total", p["total"])
print("pyramid", p["pyramid"])
print("contract", p["contract"])`,
        output: `total 19
pyramid True
contract openapi_schema`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S41-T4-A acepta solo pirámide con fallo sembrado detectado en el nivel correcto; una violación produce `BLOCK_UNTESTED_CONTRACT` y un registro incompleto produce `ADD_MISSING_TEST_LEVEL`.",
      },
    },
    {
      heading: "compatibility, rate limit y observabilidad",
      subtopicId: "S41-T4-B",
      paragraphs: [
        "Compatibilidad se prueba contra consumidores, rate limiting responde con señal recuperable y observabilidad correlaciona request, job y resultado sin PII.",
        "Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida de este subtema: 429/compatibilidad/trace id cubiertos. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
        "Aplicación de `compatibility, rate limit y observabilidad` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es 429/compatibilidad/trace id cubiertos. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "compat_ratelimit_observability.py",
        code: `def rate_decision(tokens: int) -> str:
    return "allow" if tokens > 0 else "429"

print(rate_decision(1))
print(rate_decision(0))
print("compat_header", "X-API-Version")`,
        output: `allow
429
compat_header X-API-Version`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S41-T4-B: conserva 429/compatibilidad/trace id cubiertos, la evidencia de `THROTTLE_AND_REDACT` y la ruta humana `INSPECT_COMPATIBILITY`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S41 (APIs con FastAPI y contratos HTTP) alineadas a CP-N4-A (servicio).",
    steps: [
      {
        demoId: "S41-T1-A-DEMO",
        subtopicId: "S41-T1-A",
        environment: "local-python",
        description: "Demo: recursos, métodos y status",
        code: {
          language: 'python',
          title: "demo_resources_methods_status.py",
          code: `def status_for(action: str) -> int:
    return {"create": 201, "missing": 404, "read": 200}.get(action, 500)

print(status_for("create"))
print(status_for("missing"))
print(status_for("read"))`,
          output: `201
404
200`,
        },
        why: "Hace observable `recursos, métodos y status` con un caso local pequeño y deja como evidencia matriz método/recurso/status probada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S41-T1-B-DEMO",
        subtopicId: "S41-T1-B",
        environment: "local-python",
        description: "Demo: idempotencia, paginación y versionado",
        code: {
          language: 'python',
          title: "demo_idempotency_pagination_versioning.py",
          code: `def idempotent_create(store: dict, key: str, body: dict) -> str:
    if key in store:
        return "replay"
    store[key] = body
    return "created"

store = {}
print(idempotent_create(store, "k1", {"name": "job"}))
print(idempotent_create(store, "k1", {"name": "job"}))
print(len(store))`,
          output: `created
replay
1`,
        },
        why: "Hace observable `idempotencia, paginación y versionado` con un caso local pequeño y deja como evidencia replay idéntico sin segundo efecto; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S41-T2-A-DEMO",
        subtopicId: "S41-T2-A",
        environment: "local-python",
        description: "Demo: routing, dependencies y modelos",
        code: {
          language: 'python',
          title: "demo_routing_deps_models.py",
          code: `def thin_handler(get_db, user: str) -> str:
    conn = get_db()
    return f"ok:{conn}"

print(thin_handler(lambda: "conn", "reviewer"))
print("injection", "deps")
print("routing", "/v1/jobs")`,
          output: `ok:conn
injection deps
routing /v1/jobs`,
        },
        why: "Hace observable `routing, dependencies y modelos` con un caso local pequeño y deja como evidencia handler delgado con dependencia sustituible; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S41-T2-B-DEMO",
        subtopicId: "S41-T2-B",
        environment: "local-python",
        description: "Demo: validación, serialización y documentación",
        code: {
          language: 'python',
          title: "demo_validation_serialize_docs.py",
          code: `def validate_job(body: dict) -> bool:
    return "name" in body and "priority" in body and "secret" not in body

fields = ["name", "priority"]
print(fields)
print("paths", ["/v1/jobs"])
print("valid", validate_job({"name": "er-run", "priority": "normal"}))`,
          output: `['name', 'priority']
paths ['/v1/jobs']
valid True`,
        },
        why: "Hace observable `validación, serialización y documentación` con un caso local pequeño y deja como evidencia request inválido rechazado y response sin campos internos; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S41-T3-A-DEMO",
        subtopicId: "S41-T3-A",
        environment: "local-python",
        description: "Demo: sync/async y background boundaries",
        code: {
          language: 'python',
          title: "demo_sync_async_background.py",
          code: `def enqueue(job_id: str, queue: list) -> dict:
    item = {"id": job_id, "status": "queued"}
    queue.append(item)
    return item

q = []
print(enqueue("job-1", q))
print("qlen", len(q))
print("async", True)`,
          output: `{'id': 'job-1', 'status': 'queued'}
qlen 1
async True`,
        },
        why: "Hace observable `sync/async y background boundaries` con un caso local pequeño y deja como evidencia boundary sync/async y background documentada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S41-T3-B-DEMO",
        subtopicId: "S41-T3-B",
        environment: "local-python",
        description: "Demo: errores, timeouts y lifecycle",
        code: {
          language: 'python',
          title: "demo_errors_timeouts_lifecycle.py",
          code: `def within_budget(elapsed_s: float, limit_s: float) -> str:
    return "ok" if elapsed_s <= limit_s else "timeout"

print(within_budget(10, 30))
print(within_budget(40, 30))
print("limit", 100)`,
          output: `ok
timeout
limit 100`,
        },
        why: "Hace observable `errores, timeouts y lifecycle` con un caso local pequeño y deja como evidencia timeout y shutdown sin recurso huérfano; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S41-T4-A-DEMO",
        subtopicId: "S41-T4-A",
        environment: "local-python",
        description: "Demo: unit/contract/integration",
        code: {
          language: 'python',
          title: "demo_unit_contract_integration.py",
          code: `def level_detects(seed_bug: str, level: str) -> bool:
    return (seed_bug == "domain" and level == "unit") or (
        seed_bug == "http" and level == "contract"
    )

print(level_detects("domain", "unit"))
print(level_detects("domain", "integration"))
print("unit_first", True)`,
          output: `True
False
unit_first True`,
        },
        why: "Hace observable `unit/contract/integration` con un caso local pequeño y deja como evidencia pirámide con fallo sembrado detectado en el nivel correcto; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S41-T4-B-DEMO",
        subtopicId: "S41-T4-B",
        environment: "local-python",
        description: "Demo: compatibility, rate limit y observabilidad",
        code: {
          language: 'python',
          title: "demo_compat_ratelimit_observability.py",
          code: `def slo_latency_ok(p95_ms: float, budget_ms: float) -> bool:
    return p95_ms <= budget_ms

print("slo_latency_ok", slo_latency_ok(180, 300))
print("rate", "token_bucket")
print("no_internal_keys", True)`,
          output: `slo_latency_ok True
rate token_bucket
no_internal_keys True`,
        },
        why: "Hace observable `compatibility, rate limit y observabilidad` con un caso local pequeño y deja como evidencia 429/compatibilidad/trace id cubiertos; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S41 · Laboratorio API FastAPI versionada para jobs y evidencia: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S41-T1-A-E1",
        subtopicId: "S41-T1-A",
        kind: "guided",
        instruction: "S41-T1-A-E1 · Calcula el contrato de `recursos, métodos y status` sobre `CASO-ARE-041-1A`. La entrada es el dict completo del starter; la operación debe demostrar método, recurso y 201 coherentes. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S41-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `RETURN_CORRECT_HTTP_STATUS` en E2.",
        hint: "Relaciona los campos `method`, `resource`, `created`, `status` con la regla explicada en S41-T1-A.",
        hints: [
          "Relaciona los campos `method`, `resource`, `created`, `status` con la regla explicada en S41-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva matriz método/recurso/status probada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta status", "fixture adverso: método, recurso y 201 coherentes", "CASO-ARE-041-1A es sintético"],
        tests: "El fixture `CASO-ARE-041-1A` satisface un predicado de dominio real; imprime `S41-T1-A PASS` y el assert booleano pasa.",
        feedback: "S41-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa RETURN_CORRECT_HTTP_STATUS y por qué faltar status exige REVIEW_RESOURCE_SEMANTICS.",
        starterCode: {
          language: 'python',
          title: "s41-t1-a-e1.py",
          code: `# CASO-LIM-041 · HTTP method+status create
# DEFECT: POST create exige 201; starter exige 200/GET
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":201}}
# DEFECT: POST create debe ser 201, no 200/GET
meets_contract = record["status"] == 200 and record["method"] == "GET"
status = "PASS" if meets_contract else "RETURN_CORRECT_HTTP_STATUS"
print("S41-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-a-e1.py",
          code: `record = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":201}}
meets_contract = record["method"] == "POST" and record["resource"].endswith("/jobs") and record["created"] and record["status"] == 201
status = "PASS" if meets_contract else "RETURN_CORRECT_HTTP_STATUS"
print("S41-T1-A", status)
assert meets_contract is True` ,
          output: `S41-T1-A PASS` ,
        },
      },
      {
        id: "S41-T1-A-E2",
        subtopicId: "S41-T1-A",
        kind: "independent",
        instruction: "S41-T1-A-E2 · Modela tres rutas de `recursos, métodos y status`: fixture válido, fixture adverso y registro sin `status`. Entrada: dict con case_id, method, resource, created, status. Salidas exactas: `PASS`, `RETURN_CORRECT_HTTP_STATUS`, `MISSING:status`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a status debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a status debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T1-A: método, recurso y 201 coherentes. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta status", "fixture adverso: método, recurso y 201 coherentes", "CASO-ARE-041-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `status` ausente y produce exactamente `PASS RETURN_CORRECT_HTTP_STATUS MISSING:status`.",
        feedback: "S41-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa RETURN_CORRECT_HTTP_STATUS y por qué faltar status exige REVIEW_RESOURCE_SEMANTICS.",
        starterCode: {
          language: 'python',
          title: "s41-t1-a-e2.py",
          code: `# CASO-LIM-041 · assess HTTP create contract
# DEFECT: PASS con status 200 y method GET
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "method", "resource", "created", "status"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["status"] == 200 and record["method"] == "GET" else "RETURN_CORRECT_HTTP_STATUS"

valid = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":201}}
invalid = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":200}}
incomplete = {**valid}
incomplete.pop("status")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "method", "resource", "created", "status"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["method"] == "POST" and record["resource"].endswith("/jobs") and record["created"] and record["status"] == 201 else "RETURN_CORRECT_HTTP_STATUS"

valid = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":201}}
invalid = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":200}}
incomplete = {**valid}
incomplete.pop("status")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS RETURN_CORRECT_HTTP_STATUS MISSING:status` ,
        },
      },
      {
        id: "S41-T1-A-E3",
        subtopicId: "S41-T1-A",
        kind: "transfer",
        instruction: "S41-T1-A-E3 · Simula fallo cerrado para `recursos, métodos y status` con tres fixtures distintos. `CASO-ARE-041-1A` debe continuar, el adverso debe devolver `RETURN_CORRECT_HTTP_STATUS` y la ausencia de `status` debe devolver `REVIEW_RESOURCE_SEMANTICS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_RESOURCE_SEMANTICS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_RESOURCE_SEMANTICS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró método, recurso y 201 coherentes; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta status", "fixture adverso: método, recurso y 201 coherentes", "CASO-ARE-041-1A es sintético"],
        tests: "Fixtures `CASO-ARE-041-1A`, adverso y sin `status` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa RETURN_CORRECT_HTTP_STATUS y por qué faltar status exige REVIEW_RESOURCE_SEMANTICS.",
        starterCode: {
          language: 'python',
          title: "s41-t1-a-e3.py",
          code: `# CASO-LIM-041 · decide RETURN_CORRECT_HTTP_STATUS
# DEFECT: missing→CONTINUE; pred invertido 200/GET
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "method", "resource", "created", "status"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["status"] == 200 and record["method"] == "GET" else "RETURN_CORRECT_HTTP_STATUS"

valid = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":201}}
invalid = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":200}}
uncertain = {**valid}
uncertain.pop("status")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "method", "resource", "created", "status"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_RESOURCE_SEMANTICS"
    return "CONTINUE" if record["method"] == "POST" and record["resource"].endswith("/jobs") and record["created"] and record["status"] == 201 else "RETURN_CORRECT_HTTP_STATUS"

valid = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":201}}
invalid = {"case_id": "CASO-ARE-041-1A", **{"method":"POST","resource":"/v1/jobs","created":True,"status":200}}
uncertain = {**valid}
uncertain.pop("status")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "RETURN_CORRECT_HTTP_STATUS", "REVIEW_RESOURCE_SEMANTICS"]` ,
          output: `CONTINUE RETURN_CORRECT_HTTP_STATUS REVIEW_RESOURCE_SEMANTICS` ,
        },
      },
      {
        id: "S41-T1-B-E1",
        subtopicId: "S41-T1-B",
        kind: "guided",
        instruction: "S41-T1-B-E1 · Compara el contrato de `idempotencia, paginación y versionado` sobre `CASO-ARE-041-1B`. La entrada es el dict completo del starter; la operación debe demostrar hash estable, un efecto, cursor y versión explícita. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S41-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `RETURN_IDEMPOTENCY_CONFLICT` en E2.",
        hint: "Relaciona los campos `key`, `request_hash`, `stored_hash`, `effects`, `cursor`, `version` con la regla explicada en S41-T1-B.",
        hints: [
          "Relaciona los campos `key`, `request_hash`, `stored_hash`, `effects`, `cursor`, `version` con la regla explicada en S41-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva replay idéntico sin segundo efecto; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta version", "fixture adverso: hash estable, un efecto, cursor y versión explícita", "CASO-ARE-041-1B es sintético"],
        tests: "El fixture `CASO-ARE-041-1B` satisface un predicado de dominio real; imprime `S41-T1-B PASS` y el assert booleano pasa.",
        feedback: "S41-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa RETURN_IDEMPOTENCY_CONFLICT y por qué faltar version exige REPLAY_STORED_RESPONSE.",
        starterCode: {
          language: 'python',
          title: "s41-t1-b-e1.py",
          code: `# CASO-LIM-041 · idempotency key+hash
# DEFECT: PASS si effects>1 o hash mismatch (invertido)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"abc","stored_hash":"abc","effects":1,"cursor":"job-020","version":"v1"}}
# DEFECT: replay idéntico exige effects==1 y hash igual
meets_contract = record["effects"] > 1 or record["request_hash"] != record["stored_hash"]
status = "PASS" if meets_contract else "RETURN_IDEMPOTENCY_CONFLICT"
print("S41-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-b-e1.py",
          code: `record = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"abc","stored_hash":"abc","effects":1,"cursor":"job-020","version":"v1"}}
meets_contract = record["request_hash"] == record["stored_hash"] and record["effects"] == 1 and record["cursor"].startswith("job-") and record["version"] == "v1"
status = "PASS" if meets_contract else "RETURN_IDEMPOTENCY_CONFLICT"
print("S41-T1-B", status)
assert meets_contract is True` ,
          output: `S41-T1-B PASS` ,
        },
      },
      {
        id: "S41-T1-B-E2",
        subtopicId: "S41-T1-B",
        kind: "independent",
        instruction: "S41-T1-B-E2 · Verifica tres rutas de `idempotencia, paginación y versionado`: fixture válido, fixture adverso y registro sin `version`. Entrada: dict con case_id, key, request_hash, stored_hash, effects, cursor, version. Salidas exactas: `PASS`, `RETURN_IDEMPOTENCY_CONFLICT`, `MISSING:version`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a version debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a version debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T1-B: hash estable, un efecto, cursor y versión explícita. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta version", "fixture adverso: hash estable, un efecto, cursor y versión explícita", "CASO-ARE-041-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `version` ausente y produce exactamente `PASS RETURN_IDEMPOTENCY_CONFLICT MISSING:version`.",
        feedback: "S41-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa RETURN_IDEMPOTENCY_CONFLICT y por qué faltar version exige REPLAY_STORED_RESPONSE.",
        starterCode: {
          language: 'python',
          title: "s41-t1-b-e2.py",
          code: `# CASO-LIM-041 · assess idempotency
# DEFECT: PASS con effects>1 o hash distinto
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "key", "request_hash", "stored_hash", "effects", "cursor", "version"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["effects"] > 1 or record["request_hash"] != record["stored_hash"] else "RETURN_IDEMPOTENCY_CONFLICT"

valid = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"abc","stored_hash":"abc","effects":1,"cursor":"job-020","version":"v1"}}
invalid = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"xyz","stored_hash":"abc","effects":2,"cursor":"offset:20","version":"latest"}}
incomplete = {**valid}
incomplete.pop("version")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "key", "request_hash", "stored_hash", "effects", "cursor", "version"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["request_hash"] == record["stored_hash"] and record["effects"] == 1 and record["cursor"].startswith("job-") and record["version"] == "v1" else "RETURN_IDEMPOTENCY_CONFLICT"

valid = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"abc","stored_hash":"abc","effects":1,"cursor":"job-020","version":"v1"}}
invalid = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"xyz","stored_hash":"abc","effects":2,"cursor":"offset:20","version":"latest"}}
incomplete = {**valid}
incomplete.pop("version")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS RETURN_IDEMPOTENCY_CONFLICT MISSING:version` ,
        },
      },
      {
        id: "S41-T1-B-E3",
        subtopicId: "S41-T1-B",
        kind: "transfer",
        instruction: "S41-T1-B-E3 · Extiende fallo cerrado para `idempotencia, paginación y versionado` con tres fixtures distintos. `CASO-ARE-041-1B` debe continuar, el adverso debe devolver `RETURN_IDEMPOTENCY_CONFLICT` y la ausencia de `version` debe devolver `REPLAY_STORED_RESPONSE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REPLAY_STORED_RESPONSE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REPLAY_STORED_RESPONSE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró hash estable, un efecto, cursor y versión explícita; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta version", "fixture adverso: hash estable, un efecto, cursor y versión explícita", "CASO-ARE-041-1B es sintético"],
        tests: "Fixtures `CASO-ARE-041-1B`, adverso y sin `version` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa RETURN_IDEMPOTENCY_CONFLICT y por qué faltar version exige REPLAY_STORED_RESPONSE.",
        starterCode: {
          language: 'python',
          title: "s41-t1-b-e3.py",
          code: `# CASO-LIM-041 · decide RETURN_IDEMPOTENCY_CONFLICT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "key", "request_hash", "stored_hash", "effects", "cursor", "version"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["effects"] > 1 or record["request_hash"] != record["stored_hash"] else "RETURN_IDEMPOTENCY_CONFLICT"

valid = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"abc","stored_hash":"abc","effects":1,"cursor":"job-020","version":"v1"}}
invalid = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"xyz","stored_hash":"abc","effects":2,"cursor":"offset:20","version":"latest"}}
uncertain = {**valid}
uncertain.pop("version")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "key", "request_hash", "stored_hash", "effects", "cursor", "version"}
    missing = sorted(required - record.keys())
    if missing:
        return "REPLAY_STORED_RESPONSE"
    return "CONTINUE" if record["request_hash"] == record["stored_hash"] and record["effects"] == 1 and record["cursor"].startswith("job-") and record["version"] == "v1" else "RETURN_IDEMPOTENCY_CONFLICT"

valid = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"abc","stored_hash":"abc","effects":1,"cursor":"job-020","version":"v1"}}
invalid = {"case_id": "CASO-ARE-041-1B", **{"key":"idem-are-1","request_hash":"xyz","stored_hash":"abc","effects":2,"cursor":"offset:20","version":"latest"}}
uncertain = {**valid}
uncertain.pop("version")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "RETURN_IDEMPOTENCY_CONFLICT", "REPLAY_STORED_RESPONSE"]` ,
          output: `CONTINUE RETURN_IDEMPOTENCY_CONFLICT REPLAY_STORED_RESPONSE` ,
        },
      },
      {
        id: "S41-T2-A-E1",
        subtopicId: "S41-T2-A",
        kind: "guided",
        instruction: "S41-T2-A-E1 · Filtra el contrato de `routing, dependencies y modelos` sobre `CASO-ARE-041-2A`. La entrada es el dict completo del starter; la operación debe demostrar handler delgado y dependencia sustituible. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S41-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `THIN_THE_HANDLER` en E2.",
        hint: "Relaciona los campos `handler_lines`, `dependency_injectable`, `domain_imports_http`, `domain_called` con la regla explicada en S41-T2-A.",
        hints: [
          "Relaciona los campos `handler_lines`, `dependency_injectable`, `domain_imports_http`, `domain_called` con la regla explicada en S41-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva handler delgado con dependencia sustituible; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta domain_called", "fixture adverso: handler delgado y dependencia sustituible", "CASO-ARE-041-2A es sintético"],
        tests: "El fixture `CASO-ARE-041-2A` satisface un predicado de dominio real; imprime `S41-T2-A PASS` y el assert booleano pasa.",
        feedback: "S41-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa THIN_THE_HANDLER y por qué faltar domain_called exige REVIEW_DEPENDENCY_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t2-a-e1.py",
          code: `# CASO-LIM-041 · thin handler / domain boundary
# DEFECT: PASS si handler gordo e imports HTTP en domain
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":4,"dependency_injectable":True,"domain_imports_http":False,"domain_called":True}}
# DEFECT: handler thin: pocas líneas y sin importar HTTP en dominio
meets_contract = record["handler_lines"] > 20 and record["domain_imports_http"]
status = "PASS" if meets_contract else "THIN_THE_HANDLER"
print("S41-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t2-a-e1.py",
          code: `record = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":4,"dependency_injectable":True,"domain_imports_http":False,"domain_called":True}}
meets_contract = record["handler_lines"] <= 5 and record["dependency_injectable"] and not record["domain_imports_http"] and record["domain_called"]
status = "PASS" if meets_contract else "THIN_THE_HANDLER"
print("S41-T2-A", status)
assert meets_contract is True` ,
          output: `S41-T2-A PASS` ,
        },
      },
      {
        id: "S41-T2-A-E2",
        subtopicId: "S41-T2-A",
        kind: "independent",
        instruction: "S41-T2-A-E2 · Clasifica tres rutas de `routing, dependencies y modelos`: fixture válido, fixture adverso y registro sin `domain_called`. Entrada: dict con case_id, handler_lines, dependency_injectable, domain_imports_http, domain_called. Salidas exactas: `PASS`, `THIN_THE_HANDLER`, `MISSING:domain_called`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a domain_called debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a domain_called debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T2-A: handler delgado y dependencia sustituible. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta domain_called", "fixture adverso: handler delgado y dependencia sustituible", "CASO-ARE-041-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `domain_called` ausente y produce exactamente `PASS THIN_THE_HANDLER MISSING:domain_called`.",
        feedback: "S41-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa THIN_THE_HANDLER y por qué faltar domain_called exige REVIEW_DEPENDENCY_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t2-a-e2.py",
          code: `# CASO-LIM-041 · assess thin handler
# DEFECT: PASS con handler_lines>20 y domain_imports_http
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "handler_lines", "dependency_injectable", "domain_imports_http", "domain_called"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["handler_lines"] > 20 and record["domain_imports_http"] else "THIN_THE_HANDLER"

valid = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":4,"dependency_injectable":True,"domain_imports_http":False,"domain_called":True}}
invalid = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":38,"dependency_injectable":False,"domain_imports_http":True,"domain_called":False}}
incomplete = {**valid}
incomplete.pop("domain_called")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "handler_lines", "dependency_injectable", "domain_imports_http", "domain_called"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["handler_lines"] <= 5 and record["dependency_injectable"] and not record["domain_imports_http"] and record["domain_called"] else "THIN_THE_HANDLER"

valid = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":4,"dependency_injectable":True,"domain_imports_http":False,"domain_called":True}}
invalid = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":38,"dependency_injectable":False,"domain_imports_http":True,"domain_called":False}}
incomplete = {**valid}
incomplete.pop("domain_called")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS THIN_THE_HANDLER MISSING:domain_called` ,
        },
      },
      {
        id: "S41-T2-A-E3",
        subtopicId: "S41-T2-A",
        kind: "transfer",
        instruction: "S41-T2-A-E3 · Defiende fallo cerrado para `routing, dependencies y modelos` con tres fixtures distintos. `CASO-ARE-041-2A` debe continuar, el adverso debe devolver `THIN_THE_HANDLER` y la ausencia de `domain_called` debe devolver `REVIEW_DEPENDENCY_BOUNDARY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_DEPENDENCY_BOUNDARY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_DEPENDENCY_BOUNDARY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró handler delgado y dependencia sustituible; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta domain_called", "fixture adverso: handler delgado y dependencia sustituible", "CASO-ARE-041-2A es sintético"],
        tests: "Fixtures `CASO-ARE-041-2A`, adverso y sin `domain_called` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa THIN_THE_HANDLER y por qué faltar domain_called exige REVIEW_DEPENDENCY_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t2-a-e3.py",
          code: `# CASO-LIM-041 · decide THIN_THE_HANDLER
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "handler_lines", "dependency_injectable", "domain_imports_http", "domain_called"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["handler_lines"] > 20 and record["domain_imports_http"] else "THIN_THE_HANDLER"

valid = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":4,"dependency_injectable":True,"domain_imports_http":False,"domain_called":True}}
invalid = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":38,"dependency_injectable":False,"domain_imports_http":True,"domain_called":False}}
uncertain = {**valid}
uncertain.pop("domain_called")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "handler_lines", "dependency_injectable", "domain_imports_http", "domain_called"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_DEPENDENCY_BOUNDARY"
    return "CONTINUE" if record["handler_lines"] <= 5 and record["dependency_injectable"] and not record["domain_imports_http"] and record["domain_called"] else "THIN_THE_HANDLER"

valid = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":4,"dependency_injectable":True,"domain_imports_http":False,"domain_called":True}}
invalid = {"case_id": "CASO-ARE-041-2A", **{"handler_lines":38,"dependency_injectable":False,"domain_imports_http":True,"domain_called":False}}
uncertain = {**valid}
uncertain.pop("domain_called")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "THIN_THE_HANDLER", "REVIEW_DEPENDENCY_BOUNDARY"]` ,
          output: `CONTINUE THIN_THE_HANDLER REVIEW_DEPENDENCY_BOUNDARY` ,
        },
      },
      {
        id: "S41-T2-B-E1",
        subtopicId: "S41-T2-B",
        kind: "guided",
        instruction: "S41-T2-B-E1 · Modela el contrato de `validación, serialización y documentación` sobre `CASO-ARE-041-2B`. La entrada es el dict completo del starter; la operación debe demostrar 422 tipado, vista pública y OpenAPI fiel. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S41-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_AND_REDACT` en E2.",
        hint: "Relaciona los campos `input_valid`, `status`, `response_fields`, `internal_fields`, `openapi_matches` con la regla explicada en S41-T2-B.",
        hints: [
          "Relaciona los campos `input_valid`, `status`, `response_fields`, `internal_fields`, `openapi_matches` con la regla explicada en S41-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva request inválido rechazado y response sin campos internos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta openapi_matches", "fixture adverso: 422 tipado, vista pública y OpenAPI fiel", "CASO-ARE-041-2B es sintético"],
        tests: "El fixture `CASO-ARE-041-2B` satisface un predicado de dominio real; imprime `S41-T2-B PASS` y el assert booleano pasa.",
        feedback: "S41-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AND_REDACT y por qué faltar openapi_matches exige REGENERATE_OPENAPI.",
        starterCode: {
          language: 'python',
          title: "s41-t2-b-e1.py",
          code: `# CASO-LIM-041 · 422 + response redaction
# DEFECT: PASS si 200 y filtra campos internos (invertido)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":422,"response_fields":{"job_id","status"},"internal_fields":{"secret","db_pk"},"openapi_matches":True}}
# DEFECT: error/response no debe filtrar campos internos; 200 con leak es breach
meets_contract = record["status"] == 200 and bool(record["response_fields"] & record["internal_fields"])
status = "PASS" if meets_contract else "REJECT_AND_REDACT"
print("S41-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t2-b-e1.py",
          code: `record = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":422,"response_fields":{"job_id","status"},"internal_fields":{"secret","db_pk"},"openapi_matches":True}}
meets_contract = not record["input_valid"] and record["status"] == 422 and record["response_fields"].isdisjoint(record["internal_fields"]) and record["openapi_matches"]
status = "PASS" if meets_contract else "REJECT_AND_REDACT"
print("S41-T2-B", status)
assert meets_contract is True` ,
          output: `S41-T2-B PASS` ,
        },
      },
      {
        id: "S41-T2-B-E2",
        subtopicId: "S41-T2-B",
        kind: "independent",
        instruction: "S41-T2-B-E2 · Audita tres rutas de `validación, serialización y documentación`: fixture válido, fixture adverso y registro sin `openapi_matches`. Entrada: dict con case_id, input_valid, status, response_fields, internal_fields, openapi_matches. Salidas exactas: `PASS`, `REJECT_AND_REDACT`, `MISSING:openapi_matches`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a openapi_matches debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a openapi_matches debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T2-B: 422 tipado, vista pública y OpenAPI fiel. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta openapi_matches", "fixture adverso: 422 tipado, vista pública y OpenAPI fiel", "CASO-ARE-041-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `openapi_matches` ausente y produce exactamente `PASS REJECT_AND_REDACT MISSING:openapi_matches`.",
        feedback: "S41-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AND_REDACT y por qué faltar openapi_matches exige REGENERATE_OPENAPI.",
        starterCode: {
          language: 'python',
          title: "s41-t2-b-e2.py",
          code: `# CASO-LIM-041 · assess reject/redact
# DEFECT: PASS con status 200 y secret en response
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "input_valid", "status", "response_fields", "internal_fields", "openapi_matches"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["status"] == 200 and bool(record["response_fields"] & record["internal_fields"]) else "REJECT_AND_REDACT"

valid = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":422,"response_fields":{"job_id","status"},"internal_fields":{"secret","db_pk"},"openapi_matches":True}}
invalid = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":200,"response_fields":{"job_id","secret"},"internal_fields":{"secret","db_pk"},"openapi_matches":False}}
incomplete = {**valid}
incomplete.pop("openapi_matches")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "input_valid", "status", "response_fields", "internal_fields", "openapi_matches"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["input_valid"] and record["status"] == 422 and record["response_fields"].isdisjoint(record["internal_fields"]) and record["openapi_matches"] else "REJECT_AND_REDACT"

valid = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":422,"response_fields":{"job_id","status"},"internal_fields":{"secret","db_pk"},"openapi_matches":True}}
invalid = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":200,"response_fields":{"job_id","secret"},"internal_fields":{"secret","db_pk"},"openapi_matches":False}}
incomplete = {**valid}
incomplete.pop("openapi_matches")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_AND_REDACT MISSING:openapi_matches` ,
        },
      },
      {
        id: "S41-T2-B-E3",
        subtopicId: "S41-T2-B",
        kind: "transfer",
        instruction: "S41-T2-B-E3 · Recupera fallo cerrado para `validación, serialización y documentación` con tres fixtures distintos. `CASO-ARE-041-2B` debe continuar, el adverso debe devolver `REJECT_AND_REDACT` y la ausencia de `openapi_matches` debe devolver `REGENERATE_OPENAPI`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REGENERATE_OPENAPI` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REGENERATE_OPENAPI` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró 422 tipado, vista pública y OpenAPI fiel; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta openapi_matches", "fixture adverso: 422 tipado, vista pública y OpenAPI fiel", "CASO-ARE-041-2B es sintético"],
        tests: "Fixtures `CASO-ARE-041-2B`, adverso y sin `openapi_matches` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AND_REDACT y por qué faltar openapi_matches exige REGENERATE_OPENAPI.",
        starterCode: {
          language: 'python',
          title: "s41-t2-b-e3.py",
          code: `# CASO-LIM-041 · decide REJECT_AND_REDACT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "input_valid", "status", "response_fields", "internal_fields", "openapi_matches"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["status"] == 200 and bool(record["response_fields"] & record["internal_fields"]) else "REJECT_AND_REDACT"

valid = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":422,"response_fields":{"job_id","status"},"internal_fields":{"secret","db_pk"},"openapi_matches":True}}
invalid = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":200,"response_fields":{"job_id","secret"},"internal_fields":{"secret","db_pk"},"openapi_matches":False}}
uncertain = {**valid}
uncertain.pop("openapi_matches")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "input_valid", "status", "response_fields", "internal_fields", "openapi_matches"}
    missing = sorted(required - record.keys())
    if missing:
        return "REGENERATE_OPENAPI"
    return "CONTINUE" if not record["input_valid"] and record["status"] == 422 and record["response_fields"].isdisjoint(record["internal_fields"]) and record["openapi_matches"] else "REJECT_AND_REDACT"

valid = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":422,"response_fields":{"job_id","status"},"internal_fields":{"secret","db_pk"},"openapi_matches":True}}
invalid = {"case_id": "CASO-ARE-041-2B", **{"input_valid":False,"status":200,"response_fields":{"job_id","secret"},"internal_fields":{"secret","db_pk"},"openapi_matches":False}}
uncertain = {**valid}
uncertain.pop("openapi_matches")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_AND_REDACT", "REGENERATE_OPENAPI"]` ,
          output: `CONTINUE REJECT_AND_REDACT REGENERATE_OPENAPI` ,
        },
      },
      {
        id: "S41-T3-A-E1",
        subtopicId: "S41-T3-A",
        kind: "guided",
        instruction: "S41-T3-A-E1 · Verifica el contrato de `sync/async y background boundaries` sobre `CASO-ARE-041-3A`. La entrada es el dict completo del starter; la operación debe demostrar I/O awaited y CPU/durable fuera del event loop. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S41-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `MOVE_WORK_OFF_EVENT_LOOP` en E2.",
        hint: "Relaciona los campos `work_kind`, `uses_await`, `cpu_offloaded`, `durable_job` con la regla explicada en S41-T3-A.",
        hints: [
          "Relaciona los campos `work_kind`, `uses_await`, `cpu_offloaded`, `durable_job` con la regla explicada en S41-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva boundary sync/async y background documentada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta durable_job", "fixture adverso: I/O awaited y CPU/durable fuera del event loop", "CASO-ARE-041-3A es sintético"],
        tests: "El fixture `CASO-ARE-041-3A` satisface un predicado de dominio real; imprime `S41-T3-A PASS` y el assert booleano pasa.",
        feedback: "S41-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa MOVE_WORK_OFF_EVENT_LOOP y por qué faltar durable_job exige CHOOSE_BACKGROUND_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t3-a-e1.py",
          code: `# CASO-LIM-041 · async IO vs CPU offload
# DEFECT: PASS si CPU en event loop sin offload
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"io","uses_await":True,"cpu_offloaded":True,"durable_job":True}}
# DEFECT: CPU en event loop con await es breach; offload o batch
meets_contract = record["work_kind"] == "cpu" and record["uses_await"] and not record["cpu_offloaded"]
status = "PASS" if meets_contract else "MOVE_WORK_OFF_EVENT_LOOP"
print("S41-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t3-a-e1.py",
          code: `record = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"io","uses_await":True,"cpu_offloaded":True,"durable_job":True}}
meets_contract = record["work_kind"] == "io" and record["uses_await"] and record["cpu_offloaded"] and record["durable_job"]
status = "PASS" if meets_contract else "MOVE_WORK_OFF_EVENT_LOOP"
print("S41-T3-A", status)
assert meets_contract is True` ,
          output: `S41-T3-A PASS` ,
        },
      },
      {
        id: "S41-T3-A-E2",
        subtopicId: "S41-T3-A",
        kind: "independent",
        instruction: "S41-T3-A-E2 · Decide tres rutas de `sync/async y background boundaries`: fixture válido, fixture adverso y registro sin `durable_job`. Entrada: dict con case_id, work_kind, uses_await, cpu_offloaded, durable_job. Salidas exactas: `PASS`, `MOVE_WORK_OFF_EVENT_LOOP`, `MISSING:durable_job`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a durable_job debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a durable_job debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T3-A: I/O awaited y CPU/durable fuera del event loop. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta durable_job", "fixture adverso: I/O awaited y CPU/durable fuera del event loop", "CASO-ARE-041-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `durable_job` ausente y produce exactamente `PASS MOVE_WORK_OFF_EVENT_LOOP MISSING:durable_job`.",
        feedback: "S41-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa MOVE_WORK_OFF_EVENT_LOOP y por qué faltar durable_job exige CHOOSE_BACKGROUND_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t3-a-e2.py",
          code: `# CASO-LIM-041 · assess event-loop safety
# DEFECT: PASS con work_kind cpu y uses_await sin offload
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "work_kind", "uses_await", "cpu_offloaded", "durable_job"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["work_kind"] == "cpu" and record["uses_await"] and not record["cpu_offloaded"] else "MOVE_WORK_OFF_EVENT_LOOP"

valid = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"io","uses_await":True,"cpu_offloaded":True,"durable_job":True}}
invalid = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"cpu","uses_await":True,"cpu_offloaded":False,"durable_job":False}}
incomplete = {**valid}
incomplete.pop("durable_job")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "work_kind", "uses_await", "cpu_offloaded", "durable_job"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["work_kind"] == "io" and record["uses_await"] and record["cpu_offloaded"] and record["durable_job"] else "MOVE_WORK_OFF_EVENT_LOOP"

valid = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"io","uses_await":True,"cpu_offloaded":True,"durable_job":True}}
invalid = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"cpu","uses_await":True,"cpu_offloaded":False,"durable_job":False}}
incomplete = {**valid}
incomplete.pop("durable_job")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS MOVE_WORK_OFF_EVENT_LOOP MISSING:durable_job` ,
        },
      },
      {
        id: "S41-T3-A-E3",
        subtopicId: "S41-T3-A",
        kind: "transfer",
        instruction: "S41-T3-A-E3 · Contrasta fallo cerrado para `sync/async y background boundaries` con tres fixtures distintos. `CASO-ARE-041-3A` debe continuar, el adverso debe devolver `MOVE_WORK_OFF_EVENT_LOOP` y la ausencia de `durable_job` debe devolver `CHOOSE_BACKGROUND_BOUNDARY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `CHOOSE_BACKGROUND_BOUNDARY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CHOOSE_BACKGROUND_BOUNDARY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró I/O awaited y CPU/durable fuera del event loop; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta durable_job", "fixture adverso: I/O awaited y CPU/durable fuera del event loop", "CASO-ARE-041-3A es sintético"],
        tests: "Fixtures `CASO-ARE-041-3A`, adverso y sin `durable_job` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa MOVE_WORK_OFF_EVENT_LOOP y por qué faltar durable_job exige CHOOSE_BACKGROUND_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t3-a-e3.py",
          code: `# CASO-LIM-041 · decide MOVE_WORK_OFF_EVENT_LOOP
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "work_kind", "uses_await", "cpu_offloaded", "durable_job"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["work_kind"] == "cpu" and record["uses_await"] and not record["cpu_offloaded"] else "MOVE_WORK_OFF_EVENT_LOOP"

valid = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"io","uses_await":True,"cpu_offloaded":True,"durable_job":True}}
invalid = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"cpu","uses_await":True,"cpu_offloaded":False,"durable_job":False}}
uncertain = {**valid}
uncertain.pop("durable_job")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "work_kind", "uses_await", "cpu_offloaded", "durable_job"}
    missing = sorted(required - record.keys())
    if missing:
        return "CHOOSE_BACKGROUND_BOUNDARY"
    return "CONTINUE" if record["work_kind"] == "io" and record["uses_await"] and record["cpu_offloaded"] and record["durable_job"] else "MOVE_WORK_OFF_EVENT_LOOP"

valid = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"io","uses_await":True,"cpu_offloaded":True,"durable_job":True}}
invalid = {"case_id": "CASO-ARE-041-3A", **{"work_kind":"cpu","uses_await":True,"cpu_offloaded":False,"durable_job":False}}
uncertain = {**valid}
uncertain.pop("durable_job")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "MOVE_WORK_OFF_EVENT_LOOP", "CHOOSE_BACKGROUND_BOUNDARY"]` ,
          output: `CONTINUE MOVE_WORK_OFF_EVENT_LOOP CHOOSE_BACKGROUND_BOUNDARY` ,
        },
      },
      {
        id: "S41-T3-B-E1",
        subtopicId: "S41-T3-B",
        kind: "guided",
        instruction: "S41-T3-B-E1 · Clasifica el contrato de `errores, timeouts y lifecycle` sobre `CASO-ARE-041-3B`. La entrada es el dict completo del starter; la operación debe demostrar timeouts decrecientes, error estable y cierre de recurso. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S41-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `CANCEL_AND_CLOSE` en E2.",
        hint: "Relaciona los campos `client_timeout_ms`, `service_budget_ms`, `db_budget_ms`, `error_code`, `resource_closed` con la regla explicada en S41-T3-B.",
        hints: [
          "Relaciona los campos `client_timeout_ms`, `service_budget_ms`, `db_budget_ms`, `error_code`, `resource_closed` con la regla explicada en S41-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva timeout y shutdown sin recurso huérfano; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta resource_closed", "fixture adverso: timeouts decrecientes, error estable y cierre de recurso", "CASO-ARE-041-3B es sintético"],
        tests: "El fixture `CASO-ARE-041-3B` satisface un predicado de dominio real; imprime `S41-T3-B PASS` y el assert booleano pasa.",
        feedback: "S41-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa CANCEL_AND_CLOSE y por qué faltar resource_closed exige RECALCULATE_TIMEOUT_BUDGET.",
        starterCode: {
          language: 'python',
          title: "s41-t3-b-e1.py",
          code: `# CASO-LIM-041 · timeout budgets cascade
# DEFECT: PASS si db_budget > client_timeout o no cierra recursos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":900,"service_budget_ms":700,"db_budget_ms":450,"error_code":"UPSTREAM_TIMEOUT","resource_closed":True}}
# DEFECT: budget DB <= client timeout y recursos cerrados en finally
meets_contract = record["db_budget_ms"] > record["client_timeout_ms"] or not record["resource_closed"]
status = "PASS" if meets_contract else "CANCEL_AND_CLOSE"
print("S41-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t3-b-e1.py",
          code: `record = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":900,"service_budget_ms":700,"db_budget_ms":450,"error_code":"UPSTREAM_TIMEOUT","resource_closed":True}}
meets_contract = record["db_budget_ms"] < record["service_budget_ms"] < record["client_timeout_ms"] and record["error_code"] == "UPSTREAM_TIMEOUT" and record["resource_closed"]
status = "PASS" if meets_contract else "CANCEL_AND_CLOSE"
print("S41-T3-B", status)
assert meets_contract is True` ,
          output: `S41-T3-B PASS` ,
        },
      },
      {
        id: "S41-T3-B-E2",
        subtopicId: "S41-T3-B",
        kind: "independent",
        instruction: "S41-T3-B-E2 · Calcula tres rutas de `errores, timeouts y lifecycle`: fixture válido, fixture adverso y registro sin `resource_closed`. Entrada: dict con case_id, client_timeout_ms, service_budget_ms, db_budget_ms, error_code, resource_closed. Salidas exactas: `PASS`, `CANCEL_AND_CLOSE`, `MISSING:resource_closed`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a resource_closed debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a resource_closed debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T3-B: timeouts decrecientes, error estable y cierre de recurso. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta resource_closed", "fixture adverso: timeouts decrecientes, error estable y cierre de recurso", "CASO-ARE-041-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `resource_closed` ausente y produce exactamente `PASS CANCEL_AND_CLOSE MISSING:resource_closed`.",
        feedback: "S41-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa CANCEL_AND_CLOSE y por qué faltar resource_closed exige RECALCULATE_TIMEOUT_BUDGET.",
        starterCode: {
          language: 'python',
          title: "s41-t3-b-e2.py",
          code: `# CASO-LIM-041 · assess cancel/close
# DEFECT: PASS con budgets rotos o resource_closed False
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "client_timeout_ms", "service_budget_ms", "db_budget_ms", "error_code", "resource_closed"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["db_budget_ms"] > record["client_timeout_ms"] or not record["resource_closed"] else "CANCEL_AND_CLOSE"

valid = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":900,"service_budget_ms":700,"db_budget_ms":450,"error_code":"UPSTREAM_TIMEOUT","resource_closed":True}}
invalid = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":500,"service_budget_ms":700,"db_budget_ms":900,"error_code":"500","resource_closed":False}}
incomplete = {**valid}
incomplete.pop("resource_closed")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "client_timeout_ms", "service_budget_ms", "db_budget_ms", "error_code", "resource_closed"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["db_budget_ms"] < record["service_budget_ms"] < record["client_timeout_ms"] and record["error_code"] == "UPSTREAM_TIMEOUT" and record["resource_closed"] else "CANCEL_AND_CLOSE"

valid = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":900,"service_budget_ms":700,"db_budget_ms":450,"error_code":"UPSTREAM_TIMEOUT","resource_closed":True}}
invalid = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":500,"service_budget_ms":700,"db_budget_ms":900,"error_code":"500","resource_closed":False}}
incomplete = {**valid}
incomplete.pop("resource_closed")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS CANCEL_AND_CLOSE MISSING:resource_closed` ,
        },
      },
      {
        id: "S41-T3-B-E3",
        subtopicId: "S41-T3-B",
        kind: "transfer",
        instruction: "S41-T3-B-E3 · Instrumenta fallo cerrado para `errores, timeouts y lifecycle` con tres fixtures distintos. `CASO-ARE-041-3B` debe continuar, el adverso debe devolver `CANCEL_AND_CLOSE` y la ausencia de `resource_closed` debe devolver `RECALCULATE_TIMEOUT_BUDGET`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RECALCULATE_TIMEOUT_BUDGET` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RECALCULATE_TIMEOUT_BUDGET` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró timeouts decrecientes, error estable y cierre de recurso; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta resource_closed", "fixture adverso: timeouts decrecientes, error estable y cierre de recurso", "CASO-ARE-041-3B es sintético"],
        tests: "Fixtures `CASO-ARE-041-3B`, adverso y sin `resource_closed` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa CANCEL_AND_CLOSE y por qué faltar resource_closed exige RECALCULATE_TIMEOUT_BUDGET.",
        starterCode: {
          language: 'python',
          title: "s41-t3-b-e3.py",
          code: `# CASO-LIM-041 · decide CANCEL_AND_CLOSE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "client_timeout_ms", "service_budget_ms", "db_budget_ms", "error_code", "resource_closed"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["db_budget_ms"] > record["client_timeout_ms"] or not record["resource_closed"] else "CANCEL_AND_CLOSE"

valid = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":900,"service_budget_ms":700,"db_budget_ms":450,"error_code":"UPSTREAM_TIMEOUT","resource_closed":True}}
invalid = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":500,"service_budget_ms":700,"db_budget_ms":900,"error_code":"500","resource_closed":False}}
uncertain = {**valid}
uncertain.pop("resource_closed")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "client_timeout_ms", "service_budget_ms", "db_budget_ms", "error_code", "resource_closed"}
    missing = sorted(required - record.keys())
    if missing:
        return "RECALCULATE_TIMEOUT_BUDGET"
    return "CONTINUE" if record["db_budget_ms"] < record["service_budget_ms"] < record["client_timeout_ms"] and record["error_code"] == "UPSTREAM_TIMEOUT" and record["resource_closed"] else "CANCEL_AND_CLOSE"

valid = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":900,"service_budget_ms":700,"db_budget_ms":450,"error_code":"UPSTREAM_TIMEOUT","resource_closed":True}}
invalid = {"case_id": "CASO-ARE-041-3B", **{"client_timeout_ms":500,"service_budget_ms":700,"db_budget_ms":900,"error_code":"500","resource_closed":False}}
uncertain = {**valid}
uncertain.pop("resource_closed")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "CANCEL_AND_CLOSE", "RECALCULATE_TIMEOUT_BUDGET"]` ,
          output: `CONTINUE CANCEL_AND_CLOSE RECALCULATE_TIMEOUT_BUDGET` ,
        },
      },
      {
        id: "S41-T4-A-E1",
        subtopicId: "S41-T4-A",
        kind: "guided",
        instruction: "S41-T4-A-E1 · Audita el contrato de `unit/contract/integration` sobre `CASO-ARE-041-4A`. La entrada es el dict completo del starter; la operación debe demostrar tres niveles y fallo sembrado detectado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S41-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_UNTESTED_CONTRACT` en E2.",
        hint: "Relaciona los campos `layers`, `rule_unit`, `http_contract`, `adapter_integration`, `seeded_failure_detected` con la regla explicada en S41-T4-A.",
        hints: [
          "Relaciona los campos `layers`, `rule_unit`, `http_contract`, `adapter_integration`, `seeded_failure_detected` con la regla explicada en S41-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva pirámide con fallo sembrado detectado en el nivel correcto; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta seeded_failure_detected", "fixture adverso: tres niveles y fallo sembrado detectado", "CASO-ARE-041-4A es sintético"],
        tests: "El fixture `CASO-ARE-041-4A` satisface un predicado de dominio real; imprime `S41-T4-A PASS` y el assert booleano pasa.",
        feedback: "S41-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNTESTED_CONTRACT y por qué faltar seeded_failure_detected exige ADD_MISSING_TEST_LEVEL.",
        starterCode: {
          language: 'python',
          title: "s41-t4-a-e1.py",
          code: `# CASO-LIM-041 · test layers unit/contract/integration
# DEFECT: PASS si solo 1 layer y no detecta fallos sembrados
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit","contract","integration"},"rule_unit":True,"http_contract":True,"adapter_integration":True,"seeded_failure_detected":True}}
# DEFECT: pirámide multi-capa + fallo sembrado detectado
meets_contract = len(record["layers"]) == 1 and not record["seeded_failure_detected"]
status = "PASS" if meets_contract else "BLOCK_UNTESTED_CONTRACT"
print("S41-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t4-a-e1.py",
          code: `record = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit","contract","integration"},"rule_unit":True,"http_contract":True,"adapter_integration":True,"seeded_failure_detected":True}}
meets_contract = {"unit","contract","integration"} <= record["layers"] and all(record[k] for k in ("rule_unit","http_contract","adapter_integration","seeded_failure_detected"))
status = "PASS" if meets_contract else "BLOCK_UNTESTED_CONTRACT"
print("S41-T4-A", status)
assert meets_contract is True` ,
          output: `S41-T4-A PASS` ,
        },
      },
      {
        id: "S41-T4-A-E2",
        subtopicId: "S41-T4-A",
        kind: "independent",
        instruction: "S41-T4-A-E2 · Compara tres rutas de `unit/contract/integration`: fixture válido, fixture adverso y registro sin `seeded_failure_detected`. Entrada: dict con case_id, layers, rule_unit, http_contract, adapter_integration, seeded_failure_detected. Salidas exactas: `PASS`, `BLOCK_UNTESTED_CONTRACT`, `MISSING:seeded_failure_detected`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a seeded_failure_detected debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a seeded_failure_detected debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T4-A: tres niveles y fallo sembrado detectado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta seeded_failure_detected", "fixture adverso: tres niveles y fallo sembrado detectado", "CASO-ARE-041-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `seeded_failure_detected` ausente y produce exactamente `PASS BLOCK_UNTESTED_CONTRACT MISSING:seeded_failure_detected`.",
        feedback: "S41-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNTESTED_CONTRACT y por qué faltar seeded_failure_detected exige ADD_MISSING_TEST_LEVEL.",
        starterCode: {
          language: 'python',
          title: "s41-t4-a-e2.py",
          code: `# CASO-LIM-041 · assess test pyramid
# DEFECT: PASS con layers==1 sin seeded_failure_detected
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "layers", "rule_unit", "http_contract", "adapter_integration", "seeded_failure_detected"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if len(record["layers"]) == 1 and not record["seeded_failure_detected"] else "BLOCK_UNTESTED_CONTRACT"

valid = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit","contract","integration"},"rule_unit":True,"http_contract":True,"adapter_integration":True,"seeded_failure_detected":True}}
invalid = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit"},"rule_unit":True,"http_contract":False,"adapter_integration":False,"seeded_failure_detected":False}}
incomplete = {**valid}
incomplete.pop("seeded_failure_detected")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "layers", "rule_unit", "http_contract", "adapter_integration", "seeded_failure_detected"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if {"unit","contract","integration"} <= record["layers"] and all(record[k] for k in ("rule_unit","http_contract","adapter_integration","seeded_failure_detected")) else "BLOCK_UNTESTED_CONTRACT"

valid = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit","contract","integration"},"rule_unit":True,"http_contract":True,"adapter_integration":True,"seeded_failure_detected":True}}
invalid = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit"},"rule_unit":True,"http_contract":False,"adapter_integration":False,"seeded_failure_detected":False}}
incomplete = {**valid}
incomplete.pop("seeded_failure_detected")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_UNTESTED_CONTRACT MISSING:seeded_failure_detected` ,
        },
      },
      {
        id: "S41-T4-A-E3",
        subtopicId: "S41-T4-A",
        kind: "transfer",
        instruction: "S41-T4-A-E3 · Aísla fallo cerrado para `unit/contract/integration` con tres fixtures distintos. `CASO-ARE-041-4A` debe continuar, el adverso debe devolver `BLOCK_UNTESTED_CONTRACT` y la ausencia de `seeded_failure_detected` debe devolver `ADD_MISSING_TEST_LEVEL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ADD_MISSING_TEST_LEVEL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ADD_MISSING_TEST_LEVEL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró tres niveles y fallo sembrado detectado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta seeded_failure_detected", "fixture adverso: tres niveles y fallo sembrado detectado", "CASO-ARE-041-4A es sintético"],
        tests: "Fixtures `CASO-ARE-041-4A`, adverso y sin `seeded_failure_detected` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNTESTED_CONTRACT y por qué faltar seeded_failure_detected exige ADD_MISSING_TEST_LEVEL.",
        starterCode: {
          language: 'python',
          title: "s41-t4-a-e3.py",
          code: `# CASO-LIM-041 · decide BLOCK_UNTESTED_CONTRACT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "layers", "rule_unit", "http_contract", "adapter_integration", "seeded_failure_detected"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if len(record["layers"]) == 1 and not record["seeded_failure_detected"] else "BLOCK_UNTESTED_CONTRACT"

valid = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit","contract","integration"},"rule_unit":True,"http_contract":True,"adapter_integration":True,"seeded_failure_detected":True}}
invalid = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit"},"rule_unit":True,"http_contract":False,"adapter_integration":False,"seeded_failure_detected":False}}
uncertain = {**valid}
uncertain.pop("seeded_failure_detected")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "layers", "rule_unit", "http_contract", "adapter_integration", "seeded_failure_detected"}
    missing = sorted(required - record.keys())
    if missing:
        return "ADD_MISSING_TEST_LEVEL"
    return "CONTINUE" if {"unit","contract","integration"} <= record["layers"] and all(record[k] for k in ("rule_unit","http_contract","adapter_integration","seeded_failure_detected")) else "BLOCK_UNTESTED_CONTRACT"

valid = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit","contract","integration"},"rule_unit":True,"http_contract":True,"adapter_integration":True,"seeded_failure_detected":True}}
invalid = {"case_id": "CASO-ARE-041-4A", **{"layers":{"unit"},"rule_unit":True,"http_contract":False,"adapter_integration":False,"seeded_failure_detected":False}}
uncertain = {**valid}
uncertain.pop("seeded_failure_detected")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_UNTESTED_CONTRACT", "ADD_MISSING_TEST_LEVEL"]` ,
          output: `CONTINUE BLOCK_UNTESTED_CONTRACT ADD_MISSING_TEST_LEVEL` ,
        },
      },
      {
        id: "S41-T4-B-E1",
        subtopicId: "S41-T4-B",
        kind: "guided",
        instruction: "S41-T4-B-E1 · Decide el contrato de `compatibility, rate limit y observabilidad` sobre `CASO-ARE-041-4B`. La entrada es el dict completo del starter; la operación debe demostrar consumer v1, cuota y trace redactado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S41-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `THROTTLE_AND_REDACT` en E2.",
        hint: "Relaciona los campos `old_consumer_passes`, `limit`, `used`, `trace_id`, `pii_in_log` con la regla explicada en S41-T4-B.",
        hints: [
          "Relaciona los campos `old_consumer_passes`, `limit`, `used`, `trace_id`, `pii_in_log` con la regla explicada en S41-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva 429/compatibilidad/trace id cubiertos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta pii_in_log", "fixture adverso: consumer v1, cuota y trace redactado", "CASO-ARE-041-4B es sintético"],
        tests: "El fixture `CASO-ARE-041-4B` satisface un predicado de dominio real; imprime `S41-T4-B PASS` y el assert booleano pasa.",
        feedback: "S41-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa THROTTLE_AND_REDACT y por qué faltar pii_in_log exige INSPECT_COMPATIBILITY.",
        starterCode: {
          language: 'python',
          title: "s41-t4-b-e1.py",
          code: `# CASO-LIM-041 · rate limit + PII logs
# DEFECT: PASS si used>limit o pii_in_log
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":True,"limit":100,"used":73,"trace_id":"tr-are-041","pii_in_log":False}}
# DEFECT: used<=limit y pii_in_log False
meets_contract = record["used"] > record["limit"] or record["pii_in_log"]
status = "PASS" if meets_contract else "THROTTLE_AND_REDACT"
print("S41-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t4-b-e1.py",
          code: `record = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":True,"limit":100,"used":73,"trace_id":"tr-are-041","pii_in_log":False}}
meets_contract = record["old_consumer_passes"] and 0 <= record["used"] <= record["limit"] and record["trace_id"].startswith("tr-") and not record["pii_in_log"]
status = "PASS" if meets_contract else "THROTTLE_AND_REDACT"
print("S41-T4-B", status)
assert meets_contract is True` ,
          output: `S41-T4-B PASS` ,
        },
      },
      {
        id: "S41-T4-B-E2",
        subtopicId: "S41-T4-B",
        kind: "independent",
        instruction: "S41-T4-B-E2 · Filtra tres rutas de `compatibility, rate limit y observabilidad`: fixture válido, fixture adverso y registro sin `pii_in_log`. Entrada: dict con case_id, old_consumer_passes, limit, used, trace_id, pii_in_log. Salidas exactas: `PASS`, `THROTTLE_AND_REDACT`, `MISSING:pii_in_log`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a pii_in_log debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a pii_in_log debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T4-B: consumer v1, cuota y trace redactado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta pii_in_log", "fixture adverso: consumer v1, cuota y trace redactado", "CASO-ARE-041-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `pii_in_log` ausente y produce exactamente `PASS THROTTLE_AND_REDACT MISSING:pii_in_log`.",
        feedback: "S41-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa THROTTLE_AND_REDACT y por qué faltar pii_in_log exige INSPECT_COMPATIBILITY.",
        starterCode: {
          language: 'python',
          title: "s41-t4-b-e2.py",
          code: `# CASO-LIM-041 · assess throttle/redact
# DEFECT: PASS con over-limit o PII en log
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "old_consumer_passes", "limit", "used", "trace_id", "pii_in_log"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["used"] > record["limit"] or record["pii_in_log"] else "THROTTLE_AND_REDACT"

valid = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":True,"limit":100,"used":73,"trace_id":"tr-are-041","pii_in_log":False}}
invalid = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":False,"limit":100,"used":110,"trace_id":"","pii_in_log":True}}
incomplete = {**valid}
incomplete.pop("pii_in_log")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "old_consumer_passes", "limit", "used", "trace_id", "pii_in_log"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["old_consumer_passes"] and 0 <= record["used"] <= record["limit"] and record["trace_id"].startswith("tr-") and not record["pii_in_log"] else "THROTTLE_AND_REDACT"

valid = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":True,"limit":100,"used":73,"trace_id":"tr-are-041","pii_in_log":False}}
invalid = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":False,"limit":100,"used":110,"trace_id":"","pii_in_log":True}}
incomplete = {**valid}
incomplete.pop("pii_in_log")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS THROTTLE_AND_REDACT MISSING:pii_in_log` ,
        },
      },
      {
        id: "S41-T4-B-E3",
        subtopicId: "S41-T4-B",
        kind: "transfer",
        instruction: "S41-T4-B-E3 · Demuestra fallo cerrado para `compatibility, rate limit y observabilidad` con tres fixtures distintos. `CASO-ARE-041-4B` debe continuar, el adverso debe devolver `THROTTLE_AND_REDACT` y la ausencia de `pii_in_log` debe devolver `INSPECT_COMPATIBILITY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `INSPECT_COMPATIBILITY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INSPECT_COMPATIBILITY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró consumer v1, cuota y trace redactado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta pii_in_log", "fixture adverso: consumer v1, cuota y trace redactado", "CASO-ARE-041-4B es sintético"],
        tests: "Fixtures `CASO-ARE-041-4B`, adverso y sin `pii_in_log` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa THROTTLE_AND_REDACT y por qué faltar pii_in_log exige INSPECT_COMPATIBILITY.",
        starterCode: {
          language: 'python',
          title: "s41-t4-b-e3.py",
          code: `# CASO-LIM-041 · decide THROTTLE_AND_REDACT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "old_consumer_passes", "limit", "used", "trace_id", "pii_in_log"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["used"] > record["limit"] or record["pii_in_log"] else "THROTTLE_AND_REDACT"

valid = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":True,"limit":100,"used":73,"trace_id":"tr-are-041","pii_in_log":False}}
invalid = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":False,"limit":100,"used":110,"trace_id":"","pii_in_log":True}}
uncertain = {**valid}
uncertain.pop("pii_in_log")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "old_consumer_passes", "limit", "used", "trace_id", "pii_in_log"}
    missing = sorted(required - record.keys())
    if missing:
        return "INSPECT_COMPATIBILITY"
    return "CONTINUE" if record["old_consumer_passes"] and 0 <= record["used"] <= record["limit"] and record["trace_id"].startswith("tr-") and not record["pii_in_log"] else "THROTTLE_AND_REDACT"

valid = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":True,"limit":100,"used":73,"trace_id":"tr-are-041","pii_in_log":False}}
invalid = {"case_id": "CASO-ARE-041-4B", **{"old_consumer_passes":False,"limit":100,"used":110,"trace_id":"","pii_in_log":True}}
uncertain = {**valid}
uncertain.pop("pii_in_log")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "THROTTLE_AND_REDACT", "INSPECT_COMPATIBILITY"]` ,
          output: `CONTINUE THROTTLE_AND_REDACT INSPECT_COMPATIBILITY` ,
        },
      },
    ],
  },
  youDo: {
    title: "APIs con FastAPI y contratos HTTP",
    context: "API FastAPI versionada para jobs y evidencia. Trabaja sobre un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida: respuestas OpenAPI sin PII con status, evidencia y errores estables. El gate se bloquea ante: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable.",
    objectives: [
      "Convertir solicitudes HTTP versionadas con identidad sintética e idempotency key en respuestas OpenAPI sin PII con status, evidencia y errores estables.",
      "Demostrar el gate: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
      "Probar el fallo: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-ARE-041`.",
      "Incluye contrato OpenAPI versionado.",
      "Incluye endpoints create/status con idempotencia.",
      "Incluye errores y timeouts tipados.",
      "Incluye pruebas unitarias, de contrato e integración sin red externa.",
      "Automatiza un caso normal, uno de breach (`REJECT_REQUEST`) y uno incierto (`RETRY_OR_ESCALATE`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-ARE-041"
REQUIRED = ['contrato_openapi_versionado', 'endpoints_create_status_con_idempotencia', 'errores_y_timeouts_tipados', 'pruebas_unitarias_de_contrato_e_integracion_sin_red_externa']
evidence = {
    "contrato_openapi_versionado": False,
    "endpoints_create_status_con_idempotencia": False,
    "errores_y_timeouts_tipados": False,
    "pruebas_unitarias_de_contrato_e_integracion_sin_red_externa": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-A · API HTTP gobernada: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `recursos, métodos y status` en CASO-ARE-041?",
        options: ["matriz método/recurso/status probada", "un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"],
        correctIndex: 0,
        explanation: "La teoría exige matriz método/recurso/status probada; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S41, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "emitir REJECT_REQUEST y conservar evidencia", "borrar el trace para reducir ruido"],
        correctIndex: 2,
        explanation: "El contrato falla cerrado con REJECT_REQUEST; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-A · API HTTP gobernada`?",
        options: ["el archivo S41 existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva", "crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad"],
        correctIndex: 3,
        explanation: "El gate es conductual y medible: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
      },
      {
        question: "¿Qué tratamiento de `CASO-ARE-041` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER"],
        correctIndex: 1,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
      {
        question: "Dos `POST /v1/jobs` con la misma Idempotency-Key y el mismo body canónico deben…",
        options: ["devolver created en la primera y replay en la segunda sin segundo efecto", "crear dos jobs distintos para maximizar throughput", "borrar la key tras el primer request", "responder 500 para forzar reintento del cliente"],
        correctIndex: 0,
        explanation: "Idempotencia liga key+hash al resultado: el segundo request reusa la respuesta almacenada y no duplica side effects.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "FastAPI",
        url: "https://fastapi.tiangolo.com/",
        note: "Routing, dependencies, modelos y testing",
      },
      {
        label: "FastAPI tutorial",
        url: "https://fastapi.tiangolo.com/tutorial/",
        note: "Path operations y dependencies",
      },
      {
        label: "FastAPI Testing",
        url: "https://fastapi.tiangolo.com/tutorial/testing/",
        note: "TestClient y contratos HTTP",
      },
      {
        label: "HTTP Semantics — RFC 9110",
        url: "https://www.rfc-editor.org/rfc/rfc9110",
        note: "Métodos, status y semántica HTTP",
      },
      {
        label: "Problem Details — RFC 9457",
        url: "https://www.rfc-editor.org/rfc/rfc9457",
        note: "Errores tipados sin PII",
      },
      {
        label: "OpenAPI Specification",
        url: "https://spec.openapis.org/oas/latest.html",
        note: "Contrato interoperable de APIs",
      },
      {
        label: "Pydantic",
        url: "https://docs.pydantic.dev/",
        note: "Validación y serialización de request/response",
      },
      {
        label: "Stripe — Idempotent requests",
        url: "https://stripe.com/docs/api/idempotent_requests",
        note: "Idempotency-Key en la práctica",
      },
      {
        label: "OWASP API Security Top 10",
        url: "https://owasp.org/www-project-api-security/",
        note: "Riesgos de APIs y fail-closed",
      },
      {
        label: "Python asyncio",
        url: "https://docs.python.org/3/library/asyncio.html",
        note: "Handlers async y límites",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Contratos, consistencia y operación" },
      { label: "Site Reliability Engineering", note: "SLO, rate limits y cambio seguro" },
    ],
    courses: [
      { label: "Coursera — API design", url: "https://www.coursera.org/courses?query=api%20design", note: "Semántica REST e idempotencia" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "HTTP basics progressive" },
      { label: "pytest", url: "https://docs.pytest.org/", note: "Unit/contract tests" },
    ],
  },
}
