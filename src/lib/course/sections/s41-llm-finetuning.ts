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
  icon: "Server",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **APIs con FastAPI y contratos HTTP** convierten las fronteras de S40 en endpoints versionados con evidencia operativa: respuestas OpenAPI sin PII (status, evidencia, errores tipados). Gate de promoción CP-N4-A: la misma Idempotency-Key no duplica side effects y la lectura conserva compatibilidad v1. La sección siguiente (S42) sumará authz, schemas estrictos y privacidad de servicios sobre este control plane.",
  learningOutcomes: [
    { text: "Diseñar recursos versionados (`/v1/jobs`) con métodos y status semánticos (201/200/4xx/5xx)" },
    { text: "Implementar Idempotency-Key, paginación con cursor estable y compatibilidad de lectura" },
    { text: "Separar routing, dependency injection y reglas de dominio en handlers delgados" },
    { text: "Validar entrada (422), redactar respuestas y alinear el comportamiento con OpenAPI" },
    { text: "Elegir boundary sync/async/background sin bloquear el event loop ni perder durabilidad" },
    { text: "Presupuestar timeouts en cascada, errores tipados sin PII y lifecycle de recursos" },
    { text: "Construir pirámide unit/contract/integration que detecte un fallo sembrado en el nivel correcto" },
    { text: "Probar compatibilidad de consumidores, rate limit (429) y trazas sin PII" },
  ],
  theory: [
    {
      heading: "Ruta de S41: APIs con FastAPI y contratos HTTP",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Recurso:** sustantivo versionado (`/v1/jobs`). **Status semántico:** 201 create, 200 read, **422** validación de body (Pydantic/FastAPI), **405** método no permitido en el recurso, 404 ausencia, 409 conflicto de negocio/idempotencia, 429 rate limit, 5xx servidor. No uses 400 genérico para enmascarar un 422 de esquema. **Idempotency-Key:** misma clave + mismo body canónico ⇒ un solo side effect; body distinto ⇒ conflicto, no segundo create. **OpenAPI:** contrato de request/response documentado y fiel al comportamiento. **Dependency injection:** handler delgado; capacidad inyectada (`Depends` en FastAPI). **Compatibilidad de lectura:** clientes v1 siguen leyendo campos estables. **PII en errores:** prohibido — códigos, título y `trace_id` seguros (estilo RFC 9457).",
        "S41 implementa las fronteras de S40 como **contratos HTTP** del control plane: API versionada de jobs sintéticos para una oficina ficticia en Arequipa (`CASO-ARE-041`). Progressive disclosure: primero modelamos el contrato en **stdlib** (dicts y funciones); los recursos enlazan el equivalente en FastAPI/OpenAPI/TestClient sin exigir un cluster real. Sin credenciales, sin red externa y sin PII real.",
        "Producto incremental: `POST/GET /v1/jobs` con identidad sintética e Idempotency-Key. Salida: status semánticos, body sin campos internos y errores tipados. Error de promoción: duplicar side effects en replay, filtrar PII en errores o romper compatibilidad de lectura.",
        "Orden: T1 recursos/status e idempotencia → T2 routing/deps y validación → T3 sync/async y errores → T4 tests, rate limit y observabilidad. Cada tema deja un artefacto medible (matriz HTTP, replay, handler delgado, vista pública, boundary async, timeout cascade, pirámide de tests, 429+trace). En el laboratorio, los códigos `RETURN_*` / `THIN_THE_HANDLER` / etc. son **tokens de lab** fail-closed (no enums de producción); el mapeo profesional vive en status OpenAPI y Problem Details.",
        "**Puente stdlib → FastAPI (referencia).** Path operation: `@app.post(\"/v1/jobs\")` ≈ función que recibe body y devuelve status+dict. Dependencia: `Depends(get_store)` ≈ fábrica inyectable `get_store()`. Modelo: `JobCreate(BaseModel)` ≈ dict validado antes del dominio. Docs: `/docs` OpenAPI ≈ contrato que debe coincidir con tests. Test: `TestClient(app).post(...)` ≈ llamar el handler con store fake y asertar status/body.",
      ],
      code: {
        language: 'python',
        title: "s41_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-ARE-041",
        "gates": ["idempotent_create", "no_pii_in_errors", "read_compat"],
        "duplicate_side_effect_ok": False,
        "pii_in_errors_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("gates", c["gates"])
print("duplicate_side_effect_ok", c["duplicate_side_effect_ok"])
print("pii_in_errors_ok", c["pii_in_errors_ok"])
`,
        output: `case CASO-ARE-041
gates ['idempotent_create', 'no_pii_in_errors', 'read_compat']
duplicate_side_effect_ok False
pii_in_errors_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-A · API HTTP gobernada: crear el mismo job con la misma Idempotency-Key no duplica efectos y consultar conserva compatibilidad de lectura. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "Recursos, métodos y status",
      subtopicId: "S41-T1-A",
      paragraphs: [
        "Modela recursos con **sustantivos** versionados (`/v1/jobs`, `/v1/health`), no verbos en la URL. El método comunica intención: **GET** es lectura segura e idempotente; **POST** crea o encola. El **status** es parte del contrato: **201** crea un recurso (cuerpo del job nuevo), **200** lectura OK, **422** body inválido (validación de esquema; FastAPI/Pydantic lo usa por defecto), **404** recurso ausente, **409** conflicto de negocio/idempotencia, **500** fallo interno. Elegir 200 en un create exitoso confunde a clientes y a OpenAPI.",
        "Contrato local de S41-T1-A. Entrada: triple (método, path de recurso, status). Salida: matriz probada donde `POST /v1/jobs` + create ⇒ 201 y `GET /v1/jobs/{id}` ⇒ 200 o 404. Error de diseño: status genérico, verbo en path (`/createJob`) o 200 en create. Criterio local: un test de contrato puede listar pares (method, path, status esperado) y fallar si el handler inventa códigos.",
        "Caso `CASO-ARE-041-1A` (oficina ficticia en Arequipa): la matriz del lab fija `POST /v1/jobs → 201` y `GET /v1/health → 200`. Evidencia: dict de pares imprimible y asertable. Sin PII ni secretos en paths ni en cuerpos de ejemplo.",
      ],
      code: {
        language: 'python',
        title: "resources_methods_status.py",
        code: `def status_for(method: str, resource: str, created: bool) -> int:
    if method == "POST" and resource.endswith("/jobs") and created:
        return 201
    if method == "GET" and resource.endswith("/health"):
        return 200
    if method == "GET" and resource.endswith("/jobs") and not created:
        return 404
    return 405  # método no permitido en este recurso (no confundir con 422 de validación de body)

pairs = [
    ("POST", "/v1/jobs", True),
    ("GET", "/v1/health", False),
    ("GET", "/v1/jobs", False),
]
for method, resource, created in pairs:
    print(method, resource, status_for(method, resource, created))`,
        output: `POST /v1/jobs 201
GET /v1/health 200
GET /v1/jobs 404`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S41-T1-A: matriz método/recurso/status probada. Si el status es incoherente, responde `RETURN_CORRECT_HTTP_STATUS`; si falta un campo para decidir, `REVIEW_RESOURCE_SEMANTICS`.",
      },
    },
    {
      heading: "Idempotencia, paginación y versionado",
      subtopicId: "S41-T1-B",
      paragraphs: [
        "La **Idempotency-Key** (header de industria, p. ej. Stripe) liga una clave al **hash canónico del body** y a la respuesta guardada. Misma clave + mismo body ⇒ **replay** sin segundo side effect. Misma clave + body distinto ⇒ **conflicto** (no silenciar ni crear otro job). El **versionado** (`/v1/...`) congela campos públicos; la **paginación por cursor** (keyset: `next=job-020`) es más estable que offset puro cuando el set cambia entre requests.",
        "Contrato local de S41-T1-B. Entrada: key + body canónico + store durable de claves. Salida: primera `created`, segunda `replay`, `len(store)==1`. Error: hash mismatch con misma key, o cursor offset que reordena filas. Criterio local: dos POST idénticos no duplican el job; un POST con body distinto bajo la misma key no hace replay silencioso.",
        "Caso `CASO-ARE-041-1B`: dos POST con `idem-are-1` y el mismo body crean un solo job sintético. La paginación de lab usa **cursor keyset** (`after_id` → `next` con el último id de la página): si llegan jobs nuevos al inicio, no se repiten filas como con offset. En producción el cursor suele ser opaco firmado. Sin PII en headers de log.",
      ],
      code: {
        language: 'python',
        title: "idempotency_pagination_versioning.py",
        code: `def page_keyset(items: list[str], after_id: str | None, size: int = 2) -> dict:
    """Cursor estable por id (keyset). Offset puro reordena si el set crece al inicio."""
    start = 0
    if after_id is not None:
        start = items.index(after_id) + 1 if after_id in items else len(items)
    chunk = items[start : start + size]
    nxt = chunk[-1] if start + size < len(items) else None
    return {"data": chunk, "next": nxt}

def replay_label(store, key, body):
    if key in store:
        return "replay" if store[key] == body else "conflict"
    store[key] = body
    return "created"

store = {}
jobs = ["job-001", "job-002", "job-003", "job-004"]
print(replay_label(store, "idem-are-1", {"name": "job"}))
print(replay_label(store, "idem-are-1", {"name": "job"}))
print(replay_label(store, "idem-are-1", {"name": "other"}))
print(page_keyset(jobs, None, 2))
print(page_keyset(jobs, "job-002", 2))
print("header", "Idempotency-Key")
print("version", "v1")`,
        output: `created
replay
conflict
{'data': ['job-001', 'job-002'], 'next': 'job-002'}
{'data': ['job-003', 'job-004'], 'next': None}
header Idempotency-Key
version v1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S41-T1-B, audita replay idéntico sin segundo efecto y conflicto en body mismatch. Un breach activa `RETURN_IDEMPOTENCY_CONFLICT`; una ausencia de campos, `REPLAY_STORED_RESPONSE`.",
      },
    },
    {
      heading: "Routing, dependencies y modelos",
      subtopicId: "S41-T2-A",
      paragraphs: [
        "En FastAPI (y en nuestro modelo stdlib) el **path operation** solo orquesta: recibe el request ya validado, llama dependencias y devuelve una vista. La **dependency** (`Depends` en FastAPI) inyecta capacidades sustituibles — p. ej. un `JobStore` en memoria en lab y un adaptador SQL en prod — sin que el dominio importe HTTP. El **modelo** (`JobCreate`) declara el contrato de entrada; el dominio recibe tipos ya validados, no `Request` crudo.",
        "Contrato local de S41-T2-A. Entrada: función handler + fábrica `get_store` inyectable. Salida: handler de pocas líneas de orquestación, dominio invocado, `domain_imports_http == False`. Error de diseño: handler con I/O, SQL y reglas mezclados, o dominio que importa status codes. Criterio local: al sustituir `get_store` por un fake, el mismo handler crea el job sintético sin reescribir la ruta.",
        "Caso `CASO-ARE-041-2A`: `POST /v1/jobs` usa `get_store` inyectado; el dominio `create_job(store, body)` no conoce FastAPI. Evidencia: test que monta el handler con un store fake y aserta un solo side effect. Sin PII ni secretos en el body de ejemplo.",
      ],
      code: {
        language: 'python',
        title: "routing_deps_models.py",
        code: `def create_job(store: list, body: dict) -> dict:
    job = {"id": f"job-{len(store)+1}", **body}
    store.append(job)
    return job

def thin_handler(get_store, body: dict) -> dict:
    store = get_store()
    return create_job(store, body)

mem = []
print(thin_handler(lambda: mem, {"name": "er-run"}))
print(thin_handler(lambda: mem, {"name": "er-run-2"}))
print("jobs", len(mem), "domain_imports_http", False)`,
        output: `{'id': 'job-1', 'name': 'er-run'}
{'id': 'job-2', 'name': 'er-run-2'}
jobs 2 domain_imports_http False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S41-T2-A conserva handler delgado con dependencia sustituible; no conviertas `THIN_THE_HANDLER` ni `REVIEW_DEPENDENCY_BOUNDARY` en éxito silencioso.",
      },
    },
    {
      heading: "Validación, serialización y documentación",
      subtopicId: "S41-T2-B",
      paragraphs: [
        "Antes del dominio, **valida el esquema** (Pydantic en FastAPI): campos requeridos, tipos y rangos. Un body incompleto debe devolver **422** con detalle de campos — no 200 con defaults silenciosos. Después, **serializa una vista pública** (allow-list): nunca expongas `internal_key`, `db_pk` o secretos. OpenAPI debe **coincidir** con status y shape reales; si el código devuelve 422 y el doc dice 400, regenera el contrato.",
        "Contrato local de S41-T2-B. Entrada: body crudo + allow-set de respuesta. Salida: `(422, error tipado)` si faltan campos; si es válido, vista sin campos internos. Error: 200 con leak de secretos o OpenAPI desalineado. Criterio local: `internal_key` no aparece en la respuesta y el caso inválido no llega al dominio.",
        "Caso `CASO-ARE-041-2B`: job sintético `er-run` con `priority`; falta de `priority` ⇒ 422; `public_view` elimina `internal_key`. Evidencia: dos rutas (válida/inválida) y flag `internal_key_leaked == False`.",
      ],
      code: {
        language: 'python',
        title: "validation_serialize_docs.py",
        code: `def public_view(body: dict, allow: set) -> dict:
    return {k: v for k, v in body.items() if k in allow}

def reject_if_invalid(body: dict):
    required = {"name", "priority"}
    if not required <= body.keys():
        return 422, {
            "error": "validation_error",
            "fields": sorted(required - body.keys()),
        }
    return 200, public_view(body, {"name", "priority"})

raw = {"name": "er-run", "priority": "normal", "internal_key": "x"}
print(reject_if_invalid(raw))
print(reject_if_invalid({"name": "er-run"}))
print("internal_key_leaked", "internal_key" in public_view(raw, {"name", "priority"}))`,
        output: `(200, {'name': 'er-run', 'priority': 'normal'})
(422, {'error': 'validation_error', 'fields': ['priority']})
internal_key_leaked False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S41-T2-B: demuestra request inválido rechazado (422) y response sin campos internos. Falla cerrada con `REJECT_AND_REDACT`; OpenAPI desalineado ⇒ `REGENERATE_OPENAPI`.",
      },
    },
    {
      heading: "Sync/async y background boundaries",
      subtopicId: "S41-T3-A",
      paragraphs: [
        "**Async** brilla cuando el handler **espera I/O** (red, disco, DB) sin saturar hilos: `await` libera el event loop. Trabajo **CPU-bound** (parse pesado, crypto, score) o **durable** (job que debe sobrevivir al request) no debe esconderse en una coroutine del request ni en una tarea en memoria sin cola durable: muévelo a worker/background con store confiable.",
        "Contrato local de S41-T3-A. Entrada: clasificación del trabajo (`io_wait` | `cpu_heavy` | `sync_simple`). Salida: boundary documentada (`async` | `background` | `sync`) y, si es durable, encolado con `status=queued`. Error: CPU con `await` sin offload, o job durable solo en lista de proceso. Criterio local: I/O usa await; CPU/durable sale del event loop del request.",
        "Caso `CASO-ARE-041-3A`: un GET ligero es sync/async de I/O; un score CPU se marca `background`; el enqueue de lab simula la frontera request→worker. Evidencia: tabla kind→boundary y cola con un item. Sin PII en ids de job.",
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

def enqueue(job_id: str, queue: list) -> dict:
    item = {"id": job_id, "status": "queued", "boundary": "background"}
    queue.append(item)
    return item

q = []
print(work_boundary("io_wait"), work_boundary("cpu_heavy"), work_boundary("http_get"))
print(enqueue("job-1", q))
print("qlen", len(q))`,
        output: `async background sync
{'id': 'job-1', 'status': 'queued', 'boundary': 'background'}
qlen 1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S41-T3-A, el artefacto comprobable es boundary sync/async/background documentada y trabajo durable fuera del event loop. Breach ⇒ `MOVE_WORK_OFF_EVENT_LOOP`; datos incompletos ⇒ `CHOOSE_BACKGROUND_BOUNDARY`.",
      },
    },
    {
      heading: "Errores, timeouts y lifecycle",
      subtopicId: "S41-T3-B",
      paragraphs: [
        "Un error de API debe ser **estable y seguro**: código de máquina, título/mensaje sin PII y `trace_id` para correlacionar (idea de **RFC 9457 Problem Details**). Los **timeouts** se presupuestan en cascada: cliente > servicio > DB/upstream, para que el más interno cancele primero. El **lifecycle** (startup/shutdown o lifespan de FastAPI) abre pools una vez y los cierra en `finally`/shutdown — sin conexiones huérfanas.",
        "Contrato local de S41-T3-B. Entrada: presupuestos `client_timeout_ms > service_budget_ms > db_budget_ms` y flag de cierre. Salida: error tipado con `trace_id` y `resource_closed=True` tras timeout. Error: budget invertido, 500 genérico con stack o email en el body, o shutdown que deja sockets abiertos. Criterio local: ante timeout se cancela, se cierra el recurso y se emite payload sin PII.",
        "Caso `CASO-ARE-041-3B`: job sintético supera el budget de servicio; respuesta `UPSTREAM_TIMEOUT` + `trace_id` sintético; pool marcado cerrado. Evidencia: payload Problem-Details-like y cascada de budgets.",
      ],
      code: {
        language: 'python',
        title: "errors_timeouts_lifecycle.py",
        code: `def within_budget(elapsed_s: float, limit_s: float) -> str:
    return "ok" if elapsed_s <= limit_s else "timeout"

def problem_details(status: int, code: str, trace_id: str) -> dict:
    return {
        "type": f"https://api.example/errors/{code}",
        "title": code,
        "status": status,
        "trace_id": trace_id,
    }

def cascade_ok(client_ms: int, service_ms: int, db_ms: int) -> bool:
    return db_ms < service_ms < client_ms

print(within_budget(10, 30), within_budget(40, 30))
print(problem_details(504, "UPSTREAM_TIMEOUT", "tr-are-041"))
print("cascade", cascade_ok(900, 700, 450))
print("lifecycle", ["startup", "shutdown"])`,
        output: `ok timeout
{'type': 'https://api.example/errors/UPSTREAM_TIMEOUT', 'title': 'UPSTREAM_TIMEOUT', 'status': 504, 'trace_id': 'tr-are-041'}
cascade True
lifecycle ['startup', 'shutdown']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S41-T3-B: prueba timeout y shutdown sin recurso huérfano. Breach ⇒ `CANCEL_AND_CLOSE`; budgets o campos ausentes ⇒ `RECALCULATE_TIMEOUT_BUDGET`.",
      },
    },
    {
      heading: "Unit, contract e integration",
      subtopicId: "S41-T4-A",
      paragraphs: [
        "La **pirámide de tests** responde tres preguntas distintas. **Unit**: ¿la regla de dominio (idempotencia, redaction) se cumple con fakes puros? **Contract**: ¿el acuerdo HTTP (status, schema OpenAPI, headers) se mantiene ante el handler? **Integration**: ¿el adapter real controlado (DB en memoria, filesystem temp) cablea sin red externa? Un solo nivel “e2e” no detecta dónde falló el diseño.",
        "Contrato local de S41-T4-A. Entrada: capas presentes + fallo sembrado (`domain` o `http`). Salida: el nivel correcto lo detecta (domain→unit, http→contract). Error: solo unit sin contract, o integration que enmascara un bug de status. Criterio local: pirámide `unit >= contract >= integration` en conteo y un seed que falle en el nivel esperado.",
        "Caso `CASO-ARE-041-4A`: seed de regla de dominio fallando en unit; seed de status 200 en create fallando en contract. Evidencia: tabla seed→level y conteos de pirámide. Sin red externa obligatoria.",
      ],
      code: {
        language: 'python',
        title: "unit_contract_integration.py",
        code: `def level_detects(seed_bug: str, level: str) -> bool:
    return (seed_bug == "domain" and level == "unit") or (
        seed_bug == "http" and level == "contract"
    )

def pyramid_counts(unit: int, contract: int, integration: int) -> dict:
    return {
        "total": unit + contract + integration,
        "shape_ok": unit >= contract >= integration,
        "layers": {"unit", "contract", "integration"},
    }

print(level_detects("domain", "unit"), level_detects("domain", "integration"))
print(level_detects("http", "contract"))
p = pyramid_counts(12, 5, 2)
print("total", p["total"], "shape_ok", p["shape_ok"])`,
        output: `True False
True
total 19 shape_ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S41-T4-A acepta solo pirámide con fallo sembrado detectado en el nivel correcto. Violación ⇒ `BLOCK_UNTESTED_CONTRACT`; capa ausente ⇒ `ADD_MISSING_TEST_LEVEL`.",
      },
    },
    {
      heading: "Compatibilidad, rate limit y observabilidad",
      subtopicId: "S41-T4-B",
      paragraphs: [
        "**Compatibilidad de lectura** se prueba con un consumidor v1: campos estables (`job_id`, `status`) no se renombran ni se quitan sin versión. **Rate limiting** (p. ej. token bucket) responde **429** con señal recuperable cuando `used > limit` — no 500 opaco. **Observabilidad** correlaciona request→job→resultado con `trace_id` y logs **sin PII** (ni DNI, ni email, ni secretos).",
        "Contrato local de S41-T4-B. Entrada: cuota (limit/used), flag de consumidor viejo y política de log. Salida: allow o 429; consumer v1 pasa; `pii_in_log == False`. Error: silenciar el 429, romper campos v1 o loguear PII. Criterio local: tabla de decisión de rate + aserción de redaction en traza.",
        "Caso `CASO-ARE-041-4B`: oficina Arequipa con cuota sintética `limit=100`; con `used=73` ⇒ allow y `remaining=27`; con `used=110` ⇒ **429** y `retry_after_s`. Traza `tr-are-041` sin email/DNI/secretos. Evidencia: decisiones de rate y flags de compat/PII.",
      ],
      code: {
        language: 'python',
        title: "compat_ratelimit_observability.py",
        code: `def rate_decision(used: int, limit: int) -> dict:
    if used > limit:
        return {"status": 429, "decision": "throttle", "retry_after_s": 1}
    return {"status": 200, "decision": "allow", "remaining": limit - used}

def trace_safe(fields: dict, ban: set) -> bool:
    return ban.isdisjoint(fields.keys())

print(rate_decision(73, 100))
print(rate_decision(110, 100))
print("compat_header", "X-API-Version")
print("trace_ok", trace_safe({"trace_id": "tr-are-041", "job_id": "j1"}, {"email", "dni", "secret"}))`,
        output: `{'status': 200, 'decision': 'allow', 'remaining': 27}
{'status': 429, 'decision': 'throttle', 'retry_after_s': 1}
compat_header X-API-Version
trace_ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S41-T4-B: 429 recuperable, consumidor v1 y trace sin PII. Breach ⇒ `THROTTLE_AND_REDACT`; incertidumbre de compat ⇒ `INSPECT_COMPATIBILITY`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S41 (APIs con FastAPI y contratos HTTP) alineadas a CP-N4-A. Cada demo calcula un contrato en stdlib: status, idempotencia, DI, validación 422, boundaries async, timeouts, pirámide de tests y 429+trace.",
    steps: [
      {
        demoId: "S41-T1-A-DEMO",
        subtopicId: "S41-T1-A",
        environment: "local-python",
        description: "Demo: recursos, métodos y status",
        code: {
          language: 'python',
          title: "demo_resources_methods_status.py",
          code: `def status_for(method: str, resource: str, *, exists: bool = True) -> int:
    if method == "POST" and resource.endswith("/jobs"):
        return 201
    if method == "GET" and resource.endswith("/jobs"):
        return 200 if exists else 404
    if method == "GET" and resource.endswith("/health"):
        return 200
    return 405

print(status_for("POST", "/v1/jobs"))
print(status_for("GET", "/v1/jobs", exists=False))
print(status_for("GET", "/v1/health"))`,
          output: `201
404
200`,
        },
        why: "Pienso en el create como POST + recurso `/v1/jobs` → 201 (no 200). La lectura ausente es 404 y health es 200. Así la matriz método/recurso/status queda asertable antes de cablear FastAPI.",
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
        return "replay" if store[key] == body else "conflict"
    store[key] = body
    return "created"

store = {}
print(idempotent_create(store, "k1", {"name": "job"}))
print(idempotent_create(store, "k1", {"name": "job"}))
print(idempotent_create(store, "k1", {"name": "other"}))
print(len(store))`,
          output: `created
replay
conflict
1`,
        },
        why: "La clave se guarda con el body canónico: segundo POST idéntico es replay; body distinto es conflicto, no un segundo job. `len(store)==1` es la evidencia del side effect único.",
      },
      {
        demoId: "S41-T2-A-DEMO",
        subtopicId: "S41-T2-A",
        environment: "local-python",
        description: "Demo: routing, dependencies y modelos",
        code: {
          language: 'python',
          title: "demo_routing_deps_models.py",
          code: `def create_job(store: list, body: dict) -> dict:
    job = {"id": f"job-{len(store)+1}", **body}
    store.append(job)
    return job

def thin_handler(get_store, body: dict) -> dict:
    # path operation: solo orquesta; el dominio no importa HTTP
    return create_job(get_store(), body)

mem_a, mem_b = [], []
print(thin_handler(lambda: mem_a, {"name": "er-run"}))
print(thin_handler(lambda: mem_b, {"name": "other-store"}))
print("swapped_stores", len(mem_a), len(mem_b))`,
          output: `{'id': 'job-1', 'name': 'er-run'}
{'id': 'job-1', 'name': 'other-store'}
swapped_stores 1 1`,
        },
        why: "Sustituyo `get_store` por dos fakes distintos sin tocar el handler: eso es DI. El dominio solo recibe store+body; no conoce status codes ni FastAPI.",
      },
      {
        demoId: "S41-T2-B-DEMO",
        subtopicId: "S41-T2-B",
        environment: "local-python",
        description: "Demo: validación, serialización y documentación",
        code: {
          language: 'python',
          title: "demo_validation_serialize_docs.py",
          code: `def public_view(body: dict, allow: set) -> dict:
    return {k: v for k, v in body.items() if k in allow}

def handle(body: dict):
    required = {"name", "priority"}
    if not required <= body.keys():
        return 422, {"error": "validation_error", "fields": sorted(required - body.keys())}
    return 200, public_view(body, {"name", "priority"})

ok = {"name": "er-run", "priority": "normal", "secret": "x"}
print(handle(ok))
print(handle({"name": "er-run"}))
print("secret_leaked", "secret" in handle(ok)[1])`,
          output: `(200, {'name': 'er-run', 'priority': 'normal'})
(422, {'error': 'validation_error', 'fields': ['priority']})
secret_leaked False`,
        },
        why: "Primero valido (422 si falta `priority`); luego serializo allow-list. El secreto del body crudo no viaja a la respuesta — el OpenAPI debe declarar ese shape, no el interno.",
      },
      {
        demoId: "S41-T3-A-DEMO",
        subtopicId: "S41-T3-A",
        environment: "local-python",
        description: "Demo: sync/async y background boundaries",
        code: {
          language: 'python',
          title: "demo_sync_async_background.py",
          code: `def choose_boundary(kind: str) -> str:
    if kind == "io_wait":
        return "async"
    if kind in {"cpu_heavy", "durable"}:
        return "background"
    return "sync"

def enqueue_if_needed(kind: str, job_id: str, queue: list):
    boundary = choose_boundary(kind)
    if boundary == "background":
        queue.append({"id": job_id, "status": "queued"})
    return boundary, len(queue)

q = []
print(enqueue_if_needed("io_wait", "job-io", q))
print(enqueue_if_needed("cpu_heavy", "job-cpu", q))
print("queued", q)`,
          output: `('async', 0)
('background', 1)
queued [{'id': 'job-cpu', 'status': 'queued'}]`,
        },
        why: "I/O se queda en el request (async); CPU/durable se encola. El demo no imprime un booleano vacío: muestra la decisión y el efecto en la cola.",
      },
      {
        demoId: "S41-T3-B-DEMO",
        subtopicId: "S41-T3-B",
        environment: "local-python",
        description: "Demo: errores, timeouts y lifecycle",
        code: {
          language: 'python',
          title: "demo_errors_timeouts_lifecycle.py",
          code: `def run_with_budget(elapsed_s: float, limit_s: float, open_resources: list) -> dict:
    try:
        if elapsed_s > limit_s:
            return {
                "outcome": "timeout",
                "error": {
                    "type": "https://api.example/errors/UPSTREAM_TIMEOUT",
                    "title": "UPSTREAM_TIMEOUT",
                    "status": 504,
                    "trace_id": "tr-are-041",
                },
            }
        return {"outcome": "ok"}
    finally:
        open_resources.clear()

resources = ["db-pool"]
print(run_with_budget(10, 30, resources), "open", resources)
resources = ["db-pool"]
print(run_with_budget(40, 30, resources), "open", resources)`,
          output: `{'outcome': 'ok'} open []
{'outcome': 'timeout', 'error': {'type': 'https://api.example/errors/UPSTREAM_TIMEOUT', 'title': 'UPSTREAM_TIMEOUT', 'status': 504, 'trace_id': 'tr-are-041'}} open []`,
        },
        why: "El budget decide ok vs timeout; el `finally` cierra recursos en ambos caminos. El error lleva `trace_id` y título seguro — sin PII — al estilo Problem Details.",
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
    mapping = {"domain": "unit", "http": "contract", "adapter": "integration"}
    return mapping.get(seed_bug) == level

seeds = [("domain", "unit"), ("domain", "integration"), ("http", "contract")]
for seed, level in seeds:
    print(seed, level, level_detects(seed, level))
print("pyramid", 12 >= 5 >= 2)`,
          output: `domain unit True
domain integration False
http contract True
pyramid True`,
        },
        why: "Siembras el bug y preguntas qué nivel debe atraparlo: dominio en unit, HTTP en contract. Integration no debe ser el único colador ni enmascarar un status malo.",
      },
      {
        demoId: "S41-T4-B-DEMO",
        subtopicId: "S41-T4-B",
        environment: "local-python",
        description: "Demo: compatibility, rate limit y observabilidad",
        code: {
          language: 'python',
          title: "demo_compat_ratelimit_observability.py",
          code: `def admit(used: int, limit: int) -> dict:
    if used > limit:
        return {"status": 429, "retry_after_s": 1}
    return {"status": 200, "remaining": limit - used}

def log_fields(event: dict) -> dict:
    ban = {"email", "dni", "secret"}
    return {k: v for k, v in event.items() if k not in ban}

print(admit(73, 100))
print(admit(110, 100))
print(log_fields({"trace_id": "tr-are-041", "job_id": "j1", "email": "a@b.c"}))`,
          output: `{'status': 200, 'remaining': 27}
{'status': 429, 'retry_after_s': 1}
{'trace_id': 'tr-are-041', 'job_id': 'j1'}`,
        },
        why: "Calculo remaining vs 429 real (no un string decorativo) y redacto el log: el email no sale. Compatibilidad v1 se preserva dejando `job_id`/`trace_id` estables.",
      },
    ],
  },
  weDo: {
    intro: "S41 · Laboratorio de contratos HTTP (modelo stdlib de FastAPI) para jobs y evidencia: 24 retos locales. **E1 implementa** la función de dominio del subtema (status, idempotencia, DI, 422, boundary, timeout, pirámide, 429) con un DEFECT real en el cuerpo de la función — no solo invertir un booleano sobre un dict. **E2 evalúa** válido/adverso/missing con `assess`. **E3 decide** CONTINUE / token de breach / token de incertidumbre. Los tokens (`RETURN_*`, `THIN_THE_HANDLER`, …) son códigos de lab fail-closed — no enums de producción. Fixtures sintéticos Arequipa (`CASO-ARE-041-*`).",
    steps: [
      {
        id: "S41-T1-A-E1",
        subtopicId: "S41-T1-A",
        kind: "guided",
        instruction: "S41-T1-A-E1 · Implementa `status_for(method, resource, created)` para el contrato de recursos/métodos/status (`CASO-ARE-041-1A`). `POST /v1/jobs` con create ⇒ 201; `GET /v1/health` ⇒ 200; `GET /v1/jobs` sin recurso ⇒ 404. El starter devuelve 200 en create (DEFECT). Salida exacta: `S41-T1-A PASS`. En E2/E3 practicarás el mismo criterio como assess/decide fail-closed.",
        hint: "Piensa en una matriz: el status sale de (método, path, existencia), no de un literal fijo.",
        hints: [
          "Piensa en una matriz: el status sale de (método, path, existencia), no de un literal fijo.",
          "POST + path que termina en /jobs + created ⇒ 201. GET health ⇒ 200. GET jobs sin created ⇒ 404.",
        ],
        edgeCases: ["falta status", "fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"],
        tests: "Los asserts de la matriz HTTP pasan e imprimen `S41-T1-A PASS`.",
        feedback: "S41-T1-A-E1: un create exitoso es 201, no 200. E2/E3 usan RETURN_CORRECT_HTTP_STATUS cuando el status del record es incoherente y REVIEW_RESOURCE_SEMANTICS si falta el campo.",
        starterCode: {
          language: 'python',
          title: "s41-t1-a-e1.py",
          code: `# CASO-ARE-041 · HTTP method+status create
# DEFECT: create devuelve 200 en lugar de 201
# Contrato: corrige status_for; salida alineada a solutionCode
def status_for(method: str, resource: str, created: bool) -> int:
    # DEFECT: create genérico 200 confunde el contrato OpenAPI
    if method == "POST" and resource.endswith("/jobs") and created:
        return 200
    if method == "GET" and resource.endswith("/health"):
        return 200
    if method == "GET" and resource.endswith("/jobs") and not created:
        return 404
    return 405

assert status_for("POST", "/v1/jobs", True) == 201
assert status_for("GET", "/v1/health", False) == 200
assert status_for("GET", "/v1/jobs", False) == 404
print("S41-T1-A", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-a-e1.py",
          code: `def status_for(method: str, resource: str, created: bool) -> int:
    if method == "POST" and resource.endswith("/jobs") and created:
        return 201
    if method == "GET" and resource.endswith("/health"):
        return 200
    if method == "GET" and resource.endswith("/jobs") and not created:
        return 404
    return 405

assert status_for("POST", "/v1/jobs", True) == 201
assert status_for("GET", "/v1/health", False) == 200
assert status_for("GET", "/v1/jobs", False) == 404
print("S41-T1-A", "PASS")` ,
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
        edgeCases: ["falta status", "fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `status` ausente y produce exactamente `PASS RETURN_CORRECT_HTTP_STATUS MISSING:status`.",
        feedback: "S41-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa RETURN_CORRECT_HTTP_STATUS y por qué faltar status exige REVIEW_RESOURCE_SEMANTICS.",
        starterCode: {
          language: 'python',
          title: "s41-t1-a-e2.py",
          code: `# CASO-ARE-041 · assess HTTP create contract
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
        edgeCases: ["falta status", "fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"],
        tests: "Fixtures `CASO-ARE-041-1A`, adverso y sin `status` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa RETURN_CORRECT_HTTP_STATUS y por qué faltar status exige REVIEW_RESOURCE_SEMANTICS.",
        starterCode: {
          language: 'python',
          title: "s41-t1-a-e3.py",
          code: `# CASO-ARE-041 · decide RETURN_CORRECT_HTTP_STATUS
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
        instruction: "S41-T1-B-E1 · Implementa `idempotent_create(store, key, body)` para el contrato de idempotencia (`CASO-ARE-041-1B`). Primera llamada con key+body ⇒ `created`; misma key+mismo body ⇒ `replay`; misma key+body distinto ⇒ `conflict`. El starter ignora la store y siempre crea (DEFECT). Tras dos POST idénticos, `len(store)==1`. Salida exacta: `S41-T1-B PASS`. En E2/E3 evaluarás el mismo criterio como assess/decide.",
        hint: "Si la key ya está en store, compara el body guardado: igual ⇒ replay, distinto ⇒ conflict. Solo insertas cuando la key es nueva.",
        hints: [
          "Si la key ya está en store, compara el body guardado: igual ⇒ replay, distinto ⇒ conflict. Solo insertas cuando la key es nueva.",
          "El side effect único se mide con len(store)==1 tras created+replay del mismo body.",
        ],
        edgeCases: ["falta version", "fixture adverso: hash mismatch o effects>1 (conflicto de idempotencia)", "CASO-ARE-041-1B es sintético"],
        tests: "created → replay → conflict y un solo side effect; imprime `S41-T1-B PASS`.",
        feedback: "S41-T1-B-E1: la key liga body canónico; conflict no es segundo create. E2 usa RETURN_IDEMPOTENCY_CONFLICT cuando hash/effects fallan.",
        starterCode: {
          language: 'python',
          title: "s41-t1-b-e1.py",
          code: `# CASO-ARE-041 · idempotency key+body store
# DEFECT: siempre "created" e inserta de nuevo (duplica side effect)
# Contrato: corrige idempotent_create; salida alineada a solutionCode
def idempotent_create(store: dict, key: str, body: dict) -> str:
    # DEFECT: no consulta store ni detecta conflict
    store[key + str(len(store))] = body
    return "created"

store = {}
assert idempotent_create(store, "idem-are-1", {"name": "job"}) == "created"
assert idempotent_create(store, "idem-are-1", {"name": "job"}) == "replay"
assert idempotent_create(store, "idem-are-1", {"name": "other"}) == "conflict"
assert len(store) == 1
print("S41-T1-B", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-b-e1.py",
          code: `def idempotent_create(store: dict, key: str, body: dict) -> str:
    if key in store:
        return "replay" if store[key] == body else "conflict"
    store[key] = body
    return "created"

store = {}
assert idempotent_create(store, "idem-are-1", {"name": "job"}) == "created"
assert idempotent_create(store, "idem-are-1", {"name": "job"}) == "replay"
assert idempotent_create(store, "idem-are-1", {"name": "other"}) == "conflict"
assert len(store) == 1
print("S41-T1-B", "PASS")` ,
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
        edgeCases: ["falta version", "fixture adverso: hash mismatch o effects>1 (conflicto de idempotencia)", "CASO-ARE-041-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `version` ausente y produce exactamente `PASS RETURN_IDEMPOTENCY_CONFLICT MISSING:version`.",
        feedback: "S41-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa RETURN_IDEMPOTENCY_CONFLICT y por qué faltar version exige REPLAY_STORED_RESPONSE.",
        starterCode: {
          language: 'python',
          title: "s41-t1-b-e2.py",
          code: `# CASO-ARE-041 · assess idempotency
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
        edgeCases: ["falta version", "fixture adverso: hash mismatch o effects>1 (conflicto de idempotencia)", "CASO-ARE-041-1B es sintético"],
        tests: "Fixtures `CASO-ARE-041-1B`, adverso y sin `version` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa RETURN_IDEMPOTENCY_CONFLICT y por qué faltar version exige REPLAY_STORED_RESPONSE.",
        starterCode: {
          language: 'python',
          title: "s41-t1-b-e3.py",
          code: `# CASO-ARE-041 · decide RETURN_IDEMPOTENCY_CONFLICT
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
        instruction: "S41-T2-A-E1 · Implementa un handler delgado con dependencia inyectable (`CASO-ARE-041-2A`). `create_job(store, body)` es dominio puro; `thin_handler(get_store, body)` solo obtiene el store y llama al dominio. El starter mete status HTTP y un store global en el dominio (DEFECT). Al inyectar dos fakes distintos, cada uno recibe un job sin reescribir la ruta. Salida exacta: `S41-T2-A PASS`.",
        hint: "El dominio no debe conocer status codes ni un global: recibe `store` y `body`. El handler es `return create_job(get_store(), body)`.",
        hints: [
          "El dominio no debe conocer status codes ni un global: recibe `store` y `body`. El handler es `return create_job(get_store(), body)`.",
          "Prueba DI: llama thin_handler con lambda: mem_a y luego lambda: mem_b; ambos stores crecen independientemente.",
        ],
        edgeCases: ["falta domain_called", "fixture adverso: handler gordo o domain_imports_http (boundary rota)", "CASO-ARE-041-2A es sintético"],
        tests: "Dos stores inyectados reciben un job cada uno; dominio sin status HTTP; imprime `S41-T2-A PASS`.",
        feedback: "S41-T2-A-E1: DI = sustituir get_store sin tocar el path operation. E2 marca THIN_THE_HANDLER si el handler es gordo o el dominio importa HTTP.",
        starterCode: {
          language: 'python',
          title: "s41-t2-a-e1.py",
          code: `# CASO-ARE-041 · thin handler / DI
# DEFECT: dominio conoce status HTTP y muta un store global
# Contrato: corrige create_job + thin_handler; salida alineada a solutionCode
GLOBAL = []

def create_job(body: dict) -> dict:
    # DEFECT: store global + status HTTP en dominio
    job = {"id": f"job-{len(GLOBAL)+1}", "status_code": 201, **body}
    GLOBAL.append(job)
    return job

def thin_handler(get_store, body: dict) -> dict:
    # DEFECT: ignora get_store
    return create_job(body)

mem_a, mem_b = [], []
thin_handler(lambda: mem_a, {"name": "er-run"})
thin_handler(lambda: mem_b, {"name": "other"})
assert len(mem_a) == 1 and len(mem_b) == 1
assert "status_code" not in mem_a[0]
print("S41-T2-A", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t2-a-e1.py",
          code: `def create_job(store: list, body: dict) -> dict:
    job = {"id": f"job-{len(store)+1}", **body}
    store.append(job)
    return job

def thin_handler(get_store, body: dict) -> dict:
    return create_job(get_store(), body)

mem_a, mem_b = [], []
thin_handler(lambda: mem_a, {"name": "er-run"})
thin_handler(lambda: mem_b, {"name": "other"})
assert len(mem_a) == 1 and len(mem_b) == 1
assert "status_code" not in mem_a[0]
print("S41-T2-A", "PASS")` ,
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
        edgeCases: ["falta domain_called", "fixture adverso: handler gordo o domain_imports_http (boundary rota)", "CASO-ARE-041-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `domain_called` ausente y produce exactamente `PASS THIN_THE_HANDLER MISSING:domain_called`.",
        feedback: "S41-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa THIN_THE_HANDLER y por qué faltar domain_called exige REVIEW_DEPENDENCY_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t2-a-e2.py",
          code: `# CASO-ARE-041 · assess thin handler
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
        edgeCases: ["falta domain_called", "fixture adverso: handler gordo o domain_imports_http (boundary rota)", "CASO-ARE-041-2A es sintético"],
        tests: "Fixtures `CASO-ARE-041-2A`, adverso y sin `domain_called` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa THIN_THE_HANDLER y por qué faltar domain_called exige REVIEW_DEPENDENCY_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t2-a-e3.py",
          code: `# CASO-ARE-041 · decide THIN_THE_HANDLER
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
        instruction: "S41-T2-B-E1 · Implementa `handle(body)` de validación + vista pública (`CASO-ARE-041-2B`). Body sin `priority` ⇒ `(422, {error, fields})`; body válido ⇒ `(200, public_view)` sin `secret`/`internal_key`. El starter devuelve 200 con el body crudo (DEFECT). Salida exacta: `S41-T2-B PASS`.",
        hint: "required = {name, priority}. Si faltan campos, 422 con lista de fields. Si pasa, serializa solo la allow-list pública.",
        hints: [
          "required = {name, priority}. Si faltan campos, 422 con lista de fields. Si pasa, serializa solo la allow-list pública.",
          "Nunca devuelvas secret/internal_key en la respuesta 200; el OpenAPI debe declarar ese shape.",
        ],
        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret o OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
        tests: "422 en inválido, 200 sin secret en válido; imprime `S41-T2-B PASS`.",
        feedback: "S41-T2-B-E1: validación antes del dominio y allow-list al salir. E2 usa REJECT_AND_REDACT ante 200 con leak.",
        starterCode: {
          language: 'python',
          title: "s41-t2-b-e1.py",
          code: `# CASO-ARE-041 · 422 + response redaction
# DEFECT: siempre 200 y devuelve el body crudo (leak)
# Contrato: corrige handle; salida alineada a solutionCode
def handle(body: dict):
    # DEFECT: no valida ni redacta
    return 200, body

ok = {"name": "er-run", "priority": "normal", "secret": "x"}
st_ok, body_ok = handle(ok)
st_bad, body_bad = handle({"name": "er-run"})
assert st_ok == 200 and "secret" not in body_ok and body_ok.get("name") == "er-run"
assert st_bad == 422 and body_bad.get("error") == "validation_error"
assert "priority" in body_bad.get("fields", [])
print("S41-T2-B", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t2-b-e1.py",
          code: `def public_view(body: dict) -> dict:
    allow = {"name", "priority"}
    return {k: v for k, v in body.items() if k in allow}

def handle(body: dict):
    required = {"name", "priority"}
    if not required <= body.keys():
        return 422, {
            "error": "validation_error",
            "fields": sorted(required - body.keys()),
        }
    return 200, public_view(body)

ok = {"name": "er-run", "priority": "normal", "secret": "x"}
st_ok, body_ok = handle(ok)
st_bad, body_bad = handle({"name": "er-run"})
assert st_ok == 200 and "secret" not in body_ok and body_ok.get("name") == "er-run"
assert st_bad == 422 and body_bad.get("error") == "validation_error"
assert "priority" in body_bad.get("fields", [])
print("S41-T2-B", "PASS")` ,
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
        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret o OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `openapi_matches` ausente y produce exactamente `PASS REJECT_AND_REDACT MISSING:openapi_matches`.",
        feedback: "S41-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AND_REDACT y por qué faltar openapi_matches exige REGENERATE_OPENAPI.",
        starterCode: {
          language: 'python',
          title: "s41-t2-b-e2.py",
          code: `# CASO-ARE-041 · assess reject/redact
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
        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret o OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
        tests: "Fixtures `CASO-ARE-041-2B`, adverso y sin `openapi_matches` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AND_REDACT y por qué faltar openapi_matches exige REGENERATE_OPENAPI.",
        starterCode: {
          language: 'python',
          title: "s41-t2-b-e3.py",
          code: `# CASO-ARE-041 · decide REJECT_AND_REDACT
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
        instruction: "S41-T3-A-E1 · Implementa `choose_boundary(kind)` y `enqueue_if_needed` (`CASO-ARE-041-3A`). `io_wait` ⇒ async (sin encolar); `cpu_heavy`/`durable` ⇒ background y encola con `status=queued`. El starter marca todo como async y nunca encola (DEFECT). Salida exacta: `S41-T3-A PASS`.",
        hint: "Clasifica el kind primero; solo background toca la cola. I/O no debe dejar items en queue.",
        hints: [
          "Clasifica el kind primero; solo background toca la cola. I/O no debe dejar items en queue.",
          "cpu_heavy y durable salen del event loop del request: boundary background + append a queue.",
        ],
        edgeCases: ["falta durable_job", "fixture adverso: CPU en event loop sin offload (boundary rota)", "CASO-ARE-041-3A es sintético"],
        tests: "io_wait no encola; cpu_heavy encola un item queued; imprime `S41-T3-A PASS`.",
        feedback: "S41-T3-A-E1: boundary = decisión + efecto en cola. E2 usa MOVE_WORK_OFF_EVENT_LOOP si CPU queda en el loop.",
        starterCode: {
          language: 'python',
          title: "s41-t3-a-e1.py",
          code: `# CASO-ARE-041 · async IO vs CPU offload
# DEFECT: todo es async y no se encola trabajo durable
# Contrato: corrige choose_boundary + enqueue_if_needed
def choose_boundary(kind: str) -> str:
    return "async"  # DEFECT

def enqueue_if_needed(kind: str, job_id: str, queue: list):
    boundary = choose_boundary(kind)
    # DEFECT: nunca encola
    return boundary, len(queue)

q = []
b1, n1 = enqueue_if_needed("io_wait", "job-io", q)
b2, n2 = enqueue_if_needed("cpu_heavy", "job-cpu", q)
assert b1 == "async" and n1 == 0
assert b2 == "background" and n2 == 1 and q[0]["status"] == "queued"
print("S41-T3-A", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t3-a-e1.py",
          code: `def choose_boundary(kind: str) -> str:
    if kind == "io_wait":
        return "async"
    if kind in {"cpu_heavy", "durable"}:
        return "background"
    return "sync"

def enqueue_if_needed(kind: str, job_id: str, queue: list):
    boundary = choose_boundary(kind)
    if boundary == "background":
        queue.append({"id": job_id, "status": "queued"})
    return boundary, len(queue)

q = []
b1, n1 = enqueue_if_needed("io_wait", "job-io", q)
b2, n2 = enqueue_if_needed("cpu_heavy", "job-cpu", q)
assert b1 == "async" and n1 == 0
assert b2 == "background" and n2 == 1 and q[0]["status"] == "queued"
print("S41-T3-A", "PASS")` ,
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
        edgeCases: ["falta durable_job", "fixture adverso: CPU en event loop sin offload (boundary rota)", "CASO-ARE-041-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `durable_job` ausente y produce exactamente `PASS MOVE_WORK_OFF_EVENT_LOOP MISSING:durable_job`.",
        feedback: "S41-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa MOVE_WORK_OFF_EVENT_LOOP y por qué faltar durable_job exige CHOOSE_BACKGROUND_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t3-a-e2.py",
          code: `# CASO-ARE-041 · assess event-loop safety
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
        edgeCases: ["falta durable_job", "fixture adverso: CPU en event loop sin offload (boundary rota)", "CASO-ARE-041-3A es sintético"],
        tests: "Fixtures `CASO-ARE-041-3A`, adverso y sin `durable_job` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa MOVE_WORK_OFF_EVENT_LOOP y por qué faltar durable_job exige CHOOSE_BACKGROUND_BOUNDARY.",
        starterCode: {
          language: 'python',
          title: "s41-t3-a-e3.py",
          code: `# CASO-ARE-041 · decide MOVE_WORK_OFF_EVENT_LOOP
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
        instruction: "S41-T3-B-E1 · Implementa `run_with_budget(elapsed_s, limit_s, open_resources)` (`CASO-ARE-041-3B`). Si elapsed > limit ⇒ outcome timeout con Problem Details (`type`, `title`, `status` 504, `trace_id` sin PII). En **ambos** caminos el `finally` cierra recursos (`open_resources.clear()`). El starter no cierra en timeout y devuelve un 500 genérico con email (DEFECT). Salida exacta: `S41-T3-B PASS`.",
        hint: "Usa try/finally: clear siempre. En timeout arma un dict con type/title/status/trace_id — nunca email ni stack.",
        hints: [
          "Usa try/finally: clear siempre. En timeout arma un dict con type/title/status/trace_id — nunca email ni stack.",
          "cascade mental: db < service < client; aquí el lab modela un solo limit_s del servicio.",
        ],
        edgeCases: ["falta resource_closed", "fixture adverso: budgets invertidos o recurso no cerrado", "CASO-ARE-041-3B es sintético"],
        tests: "ok y timeout dejan resources vacío; error tipado sin PII; imprime `S41-T3-B PASS`.",
        feedback: "S41-T3-B-E1: cancel + close + payload seguro. E2 usa CANCEL_AND_CLOSE si budgets se invierten o no se cierra.",
        starterCode: {
          language: 'python',
          title: "s41-t3-b-e1.py",
          code: `# CASO-ARE-041 · timeout + lifecycle close
# DEFECT: en timeout no cierra y filtra PII en el error
# Contrato: corrige run_with_budget; salida alineada a solutionCode
def run_with_budget(elapsed_s: float, limit_s: float, open_resources: list) -> dict:
    if elapsed_s > limit_s:
        # DEFECT: no finally; error con email
        return {"outcome": "timeout", "error": {"status": 500, "email": "ops@example.com"}}
    open_resources.clear()
    return {"outcome": "ok"}

res = ["db-pool"]
out_ok = run_with_budget(10, 30, res)
assert out_ok["outcome"] == "ok" and res == []
res = ["db-pool"]
out_to = run_with_budget(40, 30, res)
assert out_to["outcome"] == "timeout" and res == []
err = out_to["error"]
assert err.get("status") == 504 and "trace_id" in err and "email" not in err
print("S41-T3-B", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t3-b-e1.py",
          code: `def run_with_budget(elapsed_s: float, limit_s: float, open_resources: list) -> dict:
    try:
        if elapsed_s > limit_s:
            return {
                "outcome": "timeout",
                "error": {
                    "type": "https://api.example/errors/UPSTREAM_TIMEOUT",
                    "title": "UPSTREAM_TIMEOUT",
                    "status": 504,
                    "trace_id": "tr-are-041",
                },
            }
        return {"outcome": "ok"}
    finally:
        open_resources.clear()

res = ["db-pool"]
out_ok = run_with_budget(10, 30, res)
assert out_ok["outcome"] == "ok" and res == []
res = ["db-pool"]
out_to = run_with_budget(40, 30, res)
assert out_to["outcome"] == "timeout" and res == []
err = out_to["error"]
assert err.get("status") == 504 and "trace_id" in err and "email" not in err
print("S41-T3-B", "PASS")` ,
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
        edgeCases: ["falta resource_closed", "fixture adverso: budgets invertidos o recurso no cerrado", "CASO-ARE-041-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `resource_closed` ausente y produce exactamente `PASS CANCEL_AND_CLOSE MISSING:resource_closed`.",
        feedback: "S41-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa CANCEL_AND_CLOSE y por qué faltar resource_closed exige RECALCULATE_TIMEOUT_BUDGET.",
        starterCode: {
          language: 'python',
          title: "s41-t3-b-e2.py",
          code: `# CASO-ARE-041 · assess cancel/close
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
        edgeCases: ["falta resource_closed", "fixture adverso: budgets invertidos o recurso no cerrado", "CASO-ARE-041-3B es sintético"],
        tests: "Fixtures `CASO-ARE-041-3B`, adverso y sin `resource_closed` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa CANCEL_AND_CLOSE y por qué faltar resource_closed exige RECALCULATE_TIMEOUT_BUDGET.",
        starterCode: {
          language: 'python',
          title: "s41-t3-b-e3.py",
          code: `# CASO-ARE-041 · decide CANCEL_AND_CLOSE
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
        instruction: "S41-T4-A-E1 · Implementa `level_detects(seed_bug, level)` y `pyramid_ok(unit, contract, integration)` (`CASO-ARE-041-4A`). seed `domain` solo lo atrapa `unit`; seed `http` solo `contract`. Pirámide: conteos `unit >= contract >= integration`. El starter siempre devuelve True (DEFECT). Salida exacta: `S41-T4-A PASS`.",
        hint: "Mapea domain→unit, http→contract, adapter→integration. No dejes que integration sea el único colador de un bug de status.",
        hints: [
          "Mapea domain→unit, http→contract, adapter→integration. No dejes que integration sea el único colador de un bug de status.",
          "pyramid_ok comprueba la forma de la pirámide en conteos, no solo que existan tres strings.",
        ],
        edgeCases: ["falta seeded_failure_detected", "fixture adverso: una sola capa o fallo sembrado no detectado", "CASO-ARE-041-4A es sintético"],
        tests: "seeds correctos/incorrectos y pirámide 12≥5≥2; imprime `S41-T4-A PASS`.",
        feedback: "S41-T4-A-E1: el nivel correcto detecta el seed. E2 usa BLOCK_UNTESTED_CONTRACT si falta capa o seed no se detecta.",
        starterCode: {
          language: 'python',
          title: "s41-t4-a-e1.py",
          code: `# CASO-ARE-041 · test pyramid mapping
# DEFECT: level_detects siempre True; pyramid_ok ignora forma
# Contrato: corrige las funciones; salida alineada a solutionCode
def level_detects(seed_bug: str, level: str) -> bool:
    return True  # DEFECT

def pyramid_ok(unit: int, contract: int, integration: int) -> bool:
    return unit + contract + integration > 0  # DEFECT

assert level_detects("domain", "unit") is True
assert level_detects("domain", "integration") is False
assert level_detects("http", "contract") is True
assert pyramid_ok(12, 5, 2) is True
assert pyramid_ok(2, 5, 12) is False
print("S41-T4-A", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t4-a-e1.py",
          code: `def level_detects(seed_bug: str, level: str) -> bool:
    mapping = {"domain": "unit", "http": "contract", "adapter": "integration"}
    return mapping.get(seed_bug) == level

def pyramid_ok(unit: int, contract: int, integration: int) -> bool:
    return unit >= contract >= integration

assert level_detects("domain", "unit") is True
assert level_detects("domain", "integration") is False
assert level_detects("http", "contract") is True
assert pyramid_ok(12, 5, 2) is True
assert pyramid_ok(2, 5, 12) is False
print("S41-T4-A", "PASS")` ,
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
        edgeCases: ["falta seeded_failure_detected", "fixture adverso: una sola capa o fallo sembrado no detectado", "CASO-ARE-041-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `seeded_failure_detected` ausente y produce exactamente `PASS BLOCK_UNTESTED_CONTRACT MISSING:seeded_failure_detected`.",
        feedback: "S41-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNTESTED_CONTRACT y por qué faltar seeded_failure_detected exige ADD_MISSING_TEST_LEVEL.",
        starterCode: {
          language: 'python',
          title: "s41-t4-a-e2.py",
          code: `# CASO-ARE-041 · assess test pyramid
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
        edgeCases: ["falta seeded_failure_detected", "fixture adverso: una sola capa o fallo sembrado no detectado", "CASO-ARE-041-4A es sintético"],
        tests: "Fixtures `CASO-ARE-041-4A`, adverso y sin `seeded_failure_detected` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNTESTED_CONTRACT y por qué faltar seeded_failure_detected exige ADD_MISSING_TEST_LEVEL.",
        starterCode: {
          language: 'python',
          title: "s41-t4-a-e3.py",
          code: `# CASO-ARE-041 · decide BLOCK_UNTESTED_CONTRACT
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
        instruction: "S41-T4-B-E1 · Implementa `admit(used, limit)` y `log_fields(event)` (`CASO-ARE-041-4B`). Si `used > limit` ⇒ status 429 con `retry_after_s`; si no ⇒ 200 con `remaining`. `log_fields` elimina email/dni/secret. El starter nunca throttle y deja PII en el log (DEFECT). Salida exacta: `S41-T4-B PASS`.",
        hint: "429 es recuperable: incluye retry_after_s. Redacta con ban-set antes de imprimir/loguear.",
        hints: [
          "429 es recuperable: incluye retry_after_s. Redacta con ban-set antes de imprimir/loguear.",
          "remaining = limit - used solo cuando admites; no inventes remaining negativo en 429.",
        ],
        edgeCases: ["falta pii_in_log", "fixture adverso: over-limit, consumer roto o PII en log", "CASO-ARE-041-4B es sintético"],
        tests: "allow con remaining, 429 over-limit, log sin email; imprime `S41-T4-B PASS`.",
        feedback: "S41-T4-B-E1: throttle real + traza limpia. E2 usa THROTTLE_AND_REDACT si over-limit o PII en log.",
        starterCode: {
          language: 'python',
          title: "s41-t4-b-e1.py",
          code: `# CASO-ARE-041 · rate limit + PII logs
# DEFECT: nunca 429; log devuelve event crudo
# Contrato: corrige admit + log_fields; salida alineada a solutionCode
def admit(used: int, limit: int) -> dict:
    return {"status": 200, "remaining": limit}  # DEFECT

def log_fields(event: dict) -> dict:
    return event  # DEFECT

a = admit(73, 100)
b = admit(110, 100)
logged = log_fields({"trace_id": "tr-are-041", "job_id": "j1", "email": "a@b.c"})
assert a["status"] == 200 and a.get("remaining") == 27
assert b["status"] == 429 and "retry_after_s" in b
assert "email" not in logged and logged.get("trace_id") == "tr-are-041"
print("S41-T4-B", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t4-b-e1.py",
          code: `def admit(used: int, limit: int) -> dict:
    if used > limit:
        return {"status": 429, "retry_after_s": 1}
    return {"status": 200, "remaining": limit - used}

def log_fields(event: dict) -> dict:
    ban = {"email", "dni", "secret"}
    return {k: v for k, v in event.items() if k not in ban}

a = admit(73, 100)
b = admit(110, 100)
logged = log_fields({"trace_id": "tr-are-041", "job_id": "j1", "email": "a@b.c"})
assert a["status"] == 200 and a.get("remaining") == 27
assert b["status"] == 429 and "retry_after_s" in b
assert "email" not in logged and logged.get("trace_id") == "tr-are-041"
print("S41-T4-B", "PASS")` ,
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
        edgeCases: ["falta pii_in_log", "fixture adverso: over-limit, consumer roto o PII en log", "CASO-ARE-041-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `pii_in_log` ausente y produce exactamente `PASS THROTTLE_AND_REDACT MISSING:pii_in_log`.",
        feedback: "S41-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa THROTTLE_AND_REDACT y por qué faltar pii_in_log exige INSPECT_COMPATIBILITY.",
        starterCode: {
          language: 'python',
          title: "s41-t4-b-e2.py",
          code: `# CASO-ARE-041 · assess throttle/redact
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
        edgeCases: ["falta pii_in_log", "fixture adverso: over-limit, consumer roto o PII en log", "CASO-ARE-041-4B es sintético"],
        tests: "Fixtures `CASO-ARE-041-4B`, adverso y sin `pii_in_log` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S41-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa THROTTLE_AND_REDACT y por qué faltar pii_in_log exige INSPECT_COMPATIBILITY.",
        starterCode: {
          language: 'python',
          title: "s41-t4-b-e3.py",
          code: `# CASO-ARE-041 · decide THROTTLE_AND_REDACT
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
    context: "API versionada de jobs y evidencia para una oficina ficticia en Arequipa (`CASO-ARE-041`). Entrada: solicitudes HTTP con identidad sintética e Idempotency-Key. Salida: respuestas sin PII con status semánticos, evidencia y errores tipados. El gate se bloquea si un payload inválido, un timeout, un duplicado conflictivo o un límite excedido no produce un error tipado y observable — o si el replay duplica side effects.",
    objectives: [
      "Implementar create + replay + conflicto de Idempotency-Key y GET de status en un lab stdlib (isomorfo a FastAPI).",
      "Rechazar body inválido con error tipado (422) y vista pública sin campos internos.",
      "Demostrar el gate CP-N4-A: misma clave + mismo body no duplica efectos; la lectura conserva campos estables v1.",
      "Entregar evidencia reproducible (asserts locales), sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-ARE-041`.",
      "Implementa `create_job` con store + mapa de Idempotency-Key (created / replay / conflict).",
      "Implementa `public_view` / reject de validación (422) sin filtrar secretos a la respuesta.",
      "Incluye al menos un GET de status o listado con campos estables de lectura.",
      "Automatiza un caso normal (create+replay), uno de breach (`REJECT_REQUEST` o conflicto) y uno incierto (`RETRY_OR_ESCALATE` o MISSING).",
      "Documenta el mapeo mental a FastAPI (`@app.post`, `Depends`, OpenAPI) aunque el lab sea stdlib.",
      "Incluye comandos locales reproducibles y salida esperada de los asserts.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-ARE-041"
# Lab de contrato (stdlib ≈ FastAPI): completa las funciones.
# readiness() solo pasa cuando create/replay/error se comportan bien.

jobs: list[dict] = []
idempo: dict[str, dict] = {}  # key -> body canónico + job_id


def public_view(body: dict) -> dict:
    allow = {"name", "priority", "job_id", "status"}
    return {k: v for k, v in body.items() if k in allow}


def validate(body: dict) -> tuple[int, dict]:
    required = {"name", "priority"}
    if not required <= body.keys():
        return 422, {"error": "validation_error", "fields": sorted(required - body.keys())}
    return 200, public_view(body)


def create_job(key: str, body: dict) -> tuple[str, dict]:
    """Devuelve (label, response) con label in created|replay|conflict|rejected."""
    # Starter incompleto a propósito: valida, pero ignora Idempotency-Key e inserta siempre.
    # Completa: consulta/actualiza el mapa idempo, detecta replay y conflict, un solo side effect.
    status, payload = validate(body)
    if status != 200:
        return "rejected", payload
    job = {"job_id": f"job-{len(jobs)+1}", "status": "queued", **public_view(body)}
    jobs.append(job)
    return "created", job


def get_job(job_id: str) -> tuple[int, dict]:
    for job in jobs:
        if job.get("job_id") == job_id:
            return 200, public_view(job)
    return 404, {"error": "not_found", "job_id": job_id}


def readiness() -> tuple[str, list[str]]:
    missing = []
    jobs.clear()
    idempo.clear()
    label1, r1 = create_job("idem-are-1", {"name": "er-run", "priority": "normal", "secret": "x"})
    label2, r2 = create_job("idem-are-1", {"name": "er-run", "priority": "normal", "secret": "x"})
    label3, _ = create_job("idem-are-1", {"name": "other", "priority": "normal"})
    bad_label, bad = create_job("idem-are-2", {"name": "solo-nombre"})
    if label1 != "created" or "job_id" not in r1:
        missing.append("create_initial")
    if label2 != "replay" or r2.get("job_id") != r1.get("job_id"):
        missing.append("replay_same_key_body")
    if label3 != "conflict":
        missing.append("conflict_same_key_diff_body")
    if bad_label != "rejected" or bad.get("error") != "validation_error":
        missing.append("reject_invalid_body")
    if "secret" in r1:
        missing.append("no_secret_in_response")
    if len(jobs) != 1:
        missing.append("single_side_effect")
    st, body = get_job(r1.get("job_id", ""))
    if st != 200 or "job_id" not in body:
        missing.append("get_status_stable")
    return ("READY", []) if not missing else ("BLOCKED", missing)


status, missing = readiness()
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-A · API HTTP gobernada: implementa create/replay/conflict y validación hasta que readiness() imprima READY. No fuerces flags booleanos: los asserts miden el comportamiento. Enlace opcional: reescribe el lab con FastAPI + TestClient usando los recursos de la sección.",
    rubric: [
      { criterion: "Correctitud del contrato y gate (create/replay/conflict + status)", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege (sin PII/secretos en response)", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: observabilidad (trace) y rollback mental", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites (stdlib vs FastAPI)", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "En un POST de creación exitosa con cuerpo del nuevo job, ¿qué status semántico corresponde?",
        options: ["200", "201", "204", "202 siempre, aunque el job sea síncrono y ya exista el recurso"],
        correctIndex: 1,
        explanation: "201 Created comunica que se creó un recurso; 200 es lectura u OK genérico y confunde el contrato OpenAPI del create.",
      },
      {
        question: "Si reenvías la misma Idempotency-Key con un body distinto al original, el servicio debe…",
        options: [
          "crear un segundo job en silencio",
          "devolver conflicto / error de idempotencia sin segundo side effect",
          "ignorar el body y siempre hacer replay",
          "responder 200 vacío",
        ],
        correctIndex: 1,
        explanation: "La clave liga un hash canónico del request; body distinto es conflicto, no replay ni segundo create.",
      },
      {
        question: "La vista pública de un job y el OpenAPI deben…",
        options: [
          "incluir `internal_key` y `db_pk` para depurar en producción",
          "exponer solo campos del contrato (p. ej. name, priority, job_id, status) y coincidir con status/shape reales",
          "devolver el body crudo del request para maximizar fidelidad",
          "omitir el status HTTP; el cliente lo infiere del body",
        ],
        correctIndex: 1,
        explanation: "Redaction por allow-list evita leaks; OpenAPI es el contrato: si el código devuelve 422 o un shape distinto, el doc debe regenerarse.",
      },
      {
        question: "FastAPI/Pydantic, ante un body que no cumple el modelo de entrada, suele responder…",
        options: ["200 con defaults inventados", "422 Unprocessable Entity con detalle de campos", "204 sin cuerpo", "301 a /docs"],
        correctIndex: 1,
        explanation: "La validación de request en FastAPI devuelve 422; no debe llegar un body inválido al dominio ni masquerarse como 200. Eso no es lo mismo que 405 (método no permitido).",
      },
      {
        question: "Dos `POST /v1/jobs` con la misma Idempotency-Key y el mismo body canónico deben…",
        options: [
          "devolver created en la primera y replay en la segunda sin segundo efecto",
          "crear dos jobs distintos para maximizar throughput",
          "borrar la key tras el primer request",
          "responder 500 para forzar reintento del cliente",
        ],
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
