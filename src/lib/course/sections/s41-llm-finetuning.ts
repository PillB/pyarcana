import type { CourseSection } from '../../types'

export const section41: CourseSection = {
  id: "llm-finetuning",
  index: 41,
  title: "APIs con FastAPI y contratos HTTP",
  shortTitle: "API FastAPI",
  tagline: "API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas",
  estimatedHours: 20,
  level: "Producción gobernada",
  phase: 3,
  icon: "Server",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, las API con FastAPI y contratos HTTP convierten decisiones de arquitectura en endpoints versionados con evidencia operativa: respuestas OpenAPI sin PII (información personal identificable), status y errores tipados. Aquí aprendes a garantizar que la misma Idempotency-Key no duplique side effects (cambios observables como crear un job dos veces) y que la lectura conserve compatibilidad con versiones anteriores. Es la base sobre la que luego se monta autorización, schemas estrictos y privacidad por servicio.",
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
            heading: "Cuando la frontera deja de ser un diagrama y empieza a responder",
      paragraphs: [
        "Una frontera dibujada en un plano no obliga a nadie. En S40 decidiste qué pertenece a cada contexto y quién responde por él; en cuanto ese sistema atiende a otro equipo, la frontera tiene que viajar por un cable y sostenerse sola, sin que tú estés al lado para explicarla.",
        "Una API es una ventanilla con el reglamento pegado en el vidrio. Quien llega no te conoce: lee qué puede pedir, en qué forma, y qué significa cada respuesta que recibe. El **recurso** es el sustantivo que atiendes —`/v1/jobs`, no `/crearTrabajo`—, y el número que devuelves no es decoración: **201** dice «lo creé», **404** dice «eso no existe», **422** dice «entendí tu formato pero tus datos no cumplen». Devolver 400 para todo es cerrar la ventanilla y gritar «hay un problema» sin decir cuál.",
        "Hay una promesa más difícil que el formato: la de no hacer dos veces lo mismo. Si la red se corta después de que tu servidor creó el trabajo pero antes de que el cliente reciba la respuesta, ese cliente reintentará. Una **Idempotency-Key** es el recibo que permite reconocer el reintento y devolver el resultado original en lugar de crear un segundo trabajo. Sin ella, un timeout se convierte en dos cobros.",
        "La pregunta que gobierna la sección es la que se hace quien consume: **¿qué me promete esta respuesta, y qué pasa si la pido otra vez?** Cada decisión —el status, la forma del body, qué campos internos no salen— es una respuesta a eso.",
        "Trabajas primero con la biblioteca estándar: diccionarios y funciones que modelan el contrato sin levantar servidor. Los recursos enlazan el equivalente en FastAPI, pero no necesitas un cluster, credenciales ni red para aprender qué promete un 201. El caso es sintético (`CASO-ARE-041`, una oficina ficticia en Arequipa) y no hay PII real.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-A se demuestra con evidencia local: create idempotente, errores sin PII y lectura compatible v1. Si un assert falla, el gate queda bloqueado.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. No hace falta leerlo para seguir la sección: reúne el entregable, el orden de los subtemas y los criterios con que se evalúa.",
        "**Producto incremental.** `POST` y `GET` sobre `/v1/jobs` con identidad sintética e Idempotency-Key. Entregas status semánticos, un body sin campos internos y errores tipados. La promoción falla si un replay duplica efectos, si un error filtra PII o si se rompe la compatibilidad de lectura.",
        "**Orden de los subtemas.** T1 fija recursos, status e idempotencia, porque son el vocabulario. T2 pasa a routing, dependencias y validación. T3 separa lo síncrono de lo asíncrono y tipa los errores. T4 cierra con pruebas, límite de tasa y observabilidad.",
        "**Tokens de laboratorio.** Los códigos `RETURN_*` y `THIN_THE_HANDLER` que verás en los ejercicios son marcas del laboratorio para fallar de forma explícita, no enums de producción.",
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
    },
    {
      heading: "Recursos, métodos y status",
      figure: {
        id: "S41-status-codes",
        caption:
          "Devolver 200 con un cuerpo de error obliga a cada cliente a inventarse cómo detectar el fallo.",
        alt:
          "Cuatro guardas que asignan el código de estado según lo que ocurrió con la petición.",
      },
      subtopicId: "S41-T1-A",
      paragraphs: [
        "Desde S40 ya tienes fronteras de dominio; aquí la frontera se vuelve **HTTP**. Modela recursos con **sustantivos** versionados (`/v1/jobs`, `/v1/health`), no verbos en la URL. El método comunica intención: **GET** es lectura segura e idempotente; **POST** crea o encola. El **status** es parte del contrato: **201** crea un recurso (cuerpo del job nuevo; opcionalmente header `Location`), **200** lectura OK de colección o ítem, **422** body inválido (validación de esquema; FastAPI/Pydantic lo usa por defecto), **404** ítem ausente (`/v1/jobs/{id}`), **409** conflicto de negocio/idempotencia, **500** fallo interno. Elegir 200 en un create exitoso confunde a clientes y a OpenAPI.",
        "Qué debe quedar medible en este subtema: una matriz (método, path, status) donde `POST /v1/jobs` + create ⇒ **201**, `GET /v1/jobs` (colección, incluso vacía) ⇒ **200**, y `GET /v1/jobs/{id}` ⇒ **200** o **404**. Fallos de diseño típicos: status genérico, verbo en path (`/createJob`), 200 en create, o 404 sobre una colección vacía. Un test de contrato lista pares `(method, path, status esperado)` y falla si el handler inventa códigos. **405** es “método no permitido en un path existente”; no lo uses para enmascarar un **422** de body ni un path desconocido (**404**).",
        "En `CASO-ARE-041-1A` (oficina ficticia en Arequipa) la matriz del lab fija `POST /v1/jobs → 201`, `GET /v1/health → 200` y `GET /v1/jobs/job-404 → 404`. Evidencia: pares imprimibles y asertables. Sin PII ni secretos en paths ni en cuerpos de ejemplo. El siguiente subtema añade Idempotency-Key sobre este mismo recurso.",
      ],
      code: {
        language: 'python',
        title: "resources_methods_status.py",
        code: `def status_for(method: str, resource: str, *, item_exists: bool = True) -> int:
    # Colección /jobs ≠ ítem /jobs/{id}: la colección vacía sigue siendo 200.
    if method == "POST" and resource.rstrip("/").endswith("/jobs"):
        return 201
    if method == "GET" and resource.endswith("/health"):
        return 200
    if method == "GET" and "/jobs/" in resource:
        return 200 if item_exists else 404
    if method == "GET" and resource.rstrip("/").endswith("/jobs"):
        return 200  # lista (vacía o no)
    return 405  # método no permitido en este path (no confundir con 422 de body)

pairs = [
    ("POST", "/v1/jobs", True),
    ("GET", "/v1/health", True),
    ("GET", "/v1/jobs/job-404", False),
    ("GET", "/v1/jobs", True),
]
for method, resource, exists in pairs:
    print(method, resource, status_for(method, resource, item_exists=exists))`,
        output: `POST /v1/jobs 201
GET /v1/health 200
GET /v1/jobs/job-404 404
GET /v1/jobs 200`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "Evidencia mínima de S41-T1-A: `POST /v1/jobs` ⇒ 201; `GET /v1/jobs` ⇒ 200; `GET /v1/jobs/{id}` ausente ⇒ 404. No uses 200 en create ni 404 en colección vacía.",
      },
    },
    {
      heading: "Idempotencia, paginación y versionado",
      subtopicId: "S41-T1-B",
      paragraphs: [
        "Con el recurso y el 201 claros, el riesgo operativo es el **reintento del cliente**. La **Idempotency-Key** (header de industria, p. ej. Stripe) liga una clave al **hash canónico del body** y a la respuesta guardada. La identidad completa necesita algo más que esos dos: la misma clave enviada a otro endpoint, o por otro cliente, no es la misma petición. El registro se indexa por (cliente o tenant, operación, clave), porque si no, un cliente que reutiliza un UUID puede leer la respuesta guardada de otro — o bloquear su propia creación legítima contra un recurso distinto. La misma clave + el mismo body ⇒ **replay** sin segundo side effect. La misma clave + un body distinto ⇒ **conflicto** (no silenciar ni crear otro job). El **versionado** (`/v1/...`) congela campos públicos; la **paginación por cursor** (keyset: `next=job-020`) es más estable que offset puro cuando el set cambia entre requests.",
        "Artefacto de este subtema: un store durable de claves donde la primera llamada es `created`, la segunda idéntica es `replay` y `len(store)==1`. Ese assert prueba menos de lo que parece, y conviene saber qué: demuestra el comportamiento ante un reintento **secuencial**, que es el caso del lab. No demuestra idempotencia bajo concurrencia — dos peticiones simultáneas pueden consultar la clave, ambas encontrarla ausente y crear dos jobs. Lo que cierra esa ventana es que reservar la clave y crear el job sean una sola operación atómica: un `INSERT` con restricción de unicidad que falle en la segunda, no un `if key not in store` seguido de una escritura. Hash mismatch con la misma key no es replay: es conflicto. Criterio: dos POST idénticos no duplican el job; un POST con body distinto bajo la misma key no “repara” en silencio. En listados, preferir **keyset** (`after_id` → `next`) frente a `offset`, que reordena si llegan filas nuevas al inicio.",
        "`CASO-ARE-041-1B`: dos POST con `idem-are-1` y el mismo body dejan un solo job sintético. El lab imprime cursor keyset (`job-001`…`job-004`). En producción el cursor suele ser opaco firmado; aquí usamos ids legibles para ver el mecanismo. Sin PII en headers de log. Luego, en T2, el mismo create se separa en handler delgado + dominio.",
      ],
      code: {
        language: 'python',
        title: "idempotency_pagination_versioning.py",
        code: `def page_keyset(items: list, after_id=None, size: int = 2) -> dict:
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
        content: "Antes de promover S41-T1-B, dos POST con la misma Idempotency-Key y el mismo body dejan un solo job (`replay`); body distinto bajo la misma key es conflicto. Paginación keyset con `next` estable.",
      },
    },
    {
      heading: "Routing, dependencies y modelos",
      subtopicId: "S41-T2-A",
      paragraphs: [
        "Ya sabes *qué* devolver (201, replay, conflicto); ahora *dónde* vive cada regla. En FastAPI (y en nuestro modelo stdlib) el **path operation** solo orquesta: recibe el request ya validado, llama dependencias y devuelve una vista. La **dependency** (`Depends` en FastAPI) inyecta capacidades sustituibles — p. ej. un `JobStore` en memoria en lab y un adaptador SQL en prod — sin que el dominio importe HTTP. El **modelo** (`JobCreate`) declara el contrato de entrada; el dominio recibe tipos ya validados, no `Request` crudo.",
        "Demostración mínima: un `thin_handler(get_store, body)` de pocas líneas y un `create_job(store, body)` sin status codes. Si sustituyes `get_store` por un fake, el mismo handler crea el job sin reescribir la ruta. Anti-patrón: handler con I/O + SQL + reglas mezclados, o dominio que importa `Request`/códigos HTTP. Flag de evidencia: `domain_imports_http == False`.",
        "`CASO-ARE-041-2A`: `POST /v1/jobs` usa `get_store` inyectado; el dominio no conoce FastAPI. Evidencia: montar el handler con dos stores fake y ver un side effect en cada uno. Sin PII ni secretos en el body de ejemplo. El subtema siguiente añade la validación 422 *antes* de llamar a ese dominio.",
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
        content: "La revisión de S41-T2-A conserva que el handler orquesta; el dominio no importa HTTP. Si sustituyes `get_store` por un fake, el mismo path crea el job sin reescribir la ruta.",
      },
    },
    {
      heading: "Validación, serialización y documentación",
      subtopicId: "S41-T2-B",
      paragraphs: [
        "El handler delgado asume un body ya confiable: hay que **validar el esquema** antes del dominio (Pydantic en FastAPI). Campos requeridos, tipos y rangos. Un body incompleto devuelve **422** con detalle de campos — no 200 con defaults silenciosos. Después, **serializa una vista pública** (allow-list): nunca expongas `internal_key`, `db_pk` o secretos. OpenAPI debe **coincidir** con status y shape reales; si el código devuelve 422 y el doc dice 400, regenera el contrato.",
        "Rutas que debes poder ejecutar en lab: body crudo + allow-set → `(422, error tipado)` si faltan campos; si es válido → vista sin campos internos. `internal_key` no aparece en la respuesta y el caso inválido no llama a `create_job`. Anti-patrón: 200 con leak u OpenAPI desalineado del comportamiento.",
        "`CASO-ARE-041-2B`: job sintético `er-run` con `priority`; sin `priority` ⇒ 422; `public_view` elimina `internal_key`. Evidencia: dos rutas (válida/inválida) y `internal_key_leaked == False`. Con el contrato de request/response cerrado, T3 decide *cuándo* el trabajo sale del request (async/background).",
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
        content: "Contrato S41-T2-B: body incompleto ⇒ 422 tipado; body válido ⇒ vista allow-list sin `internal_key`. OpenAPI debe coincidir con status y shape reales.",
      },
    },
    {
      heading: "Sync/async y background boundaries",
      subtopicId: "S41-T3-A",
      paragraphs: [
        "El contrato HTTP puede ser correcto y aun así **bloquear el event loop**. **Async** brilla cuando el handler **espera I/O** (red, disco, DB): `await` libera el loop. El trabajo **CPU-bound** (parse pesado, crypto, score) o **durable** (job que debe sobrevivir al request) no debe esconderse en una coroutine del request. Y «worker/background» no es una sola cosa: son dos garantías distintas y necesitas nombrar cuál te falta. Una tarea *background* del propio framework corre en el mismo proceso, así que si es CPU-bound bloquea el loop igual que antes, y si el proceso se reinicia el trabajo se pierde sin dejar rastro. Para aislar CPU hace falta **otro proceso** (un pool o un worker aparte); para sobrevivir al reinicio hace falta que el trabajo esté **encolado de forma durable** antes de responder. Un trabajo que necesita las dos cosas necesita las dos piezas.",
        "Clasifica el trabajo (`io_wait` | `cpu_heavy` | `durable` | `sync_simple`) y documenta la boundary (`async` | `background` | `sync`). Si es durable o CPU, encola con `status=queued` y sal del request. Criterio: I/O usa await; CPU/durable no se “await” como si fuera red. Anti-patrón: score CPU en el path del POST o job durable solo en una lista de proceso.",
        "`CASO-ARE-041-3A`: GET ligero → async/sync de I/O; score CPU → `background` + item en cola. Evidencia: tabla kind→boundary y `qlen`. Sin PII en ids de job. El siguiente subtema cubre qué pasa cuando el trabajo **excede el presupuesto de tiempo** y hay que cerrar recursos.",
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
        content: "Para S41-T3-A, I/O usa boundary async/sync; CPU o durable se encola (`status=queued`) y sale del event loop del request.",
      },
    },
    {
      heading: "Errores, timeouts y lifecycle",
      subtopicId: "S41-T3-B",
      paragraphs: [
        "Cuando el worker o el upstream tarda de más, el cliente no debe recibir un stack ni un email. Un error de API es **estable y seguro**: código de máquina, título sin PII y `trace_id` para correlacionar (**RFC 9457 Problem Details**: `type`, `title`, `status`, `trace_id`). Los **timeouts** van en cascada: `client > service > db/upstream`, para que el más interno cancele primero. El **lifecycle** (startup/shutdown o lifespan de FastAPI) abre pools una vez y los cierra en `finally`/shutdown.",
        "Presupuesto válido: `client_timeout_ms > service_budget_ms > db_budget_ms`. Ante timeout: cancela, cierra el recurso (`resource_closed=True`) y emite payload tipado sin PII. Anti-patrón: budgets invertidos, 500 genérico con stack, o shutdown que deja sockets abiertos. El lab prueba ambos caminos (ok y timeout) y exige `finally`.",
        "`CASO-ARE-041-3B`: el job sintético supera el budget de servicio → `UPSTREAM_TIMEOUT` + `trace_id` sintético; pool cerrado en ambos caminos. Evidencia: dict Problem-Details-like y `cascade_ok`. Con errores tipados, T4 pregunta *en qué capa de test* se detecta un fallo sembrado.",
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
        content: "Promoción de S41-T3-B: `client > service > db` en timeouts; ante timeout cancela, cierra el recurso y devuelve Problem Details (`type`, `title`, `status`, `trace_id`) sin PII.",
      },
    },
    {
      heading: "Unit, contract e integration",
      subtopicId: "S41-T4-A",
      paragraphs: [
        "Ya tienes contratos, DI, 422 y timeouts: falta **demostrar** que un fallo se atrapa en el nivel correcto. La **pirámide** responde tres preguntas. **Unit**: ¿la regla de dominio (idempotencia, redaction) se cumple con fakes? **Contract**: ¿status, schema OpenAPI y headers se mantienen ante el handler? **Integration**: ¿el adapter controlado (DB en memoria, temp) cablea sin red externa? Un solo “e2e” no localiza el diseño roto.",
        "Siembra un bug (`domain` o `http`) y exige que el nivel correcto lo detecte: domain→unit, http→contract. Forma de pirámide: `unit >= contract >= integration` en conteo. Anti-patrón: solo unit sin contract, o integration que enmascara un 200 en create. El lab imprime la tabla seed→level y `shape_ok`.",
        "`CASO-ARE-041-4A`: seed de regla de dominio falla en unit; seed de status 200 en create falla en contract. Sin red externa obligatoria. El cierre de sección (T4-B) añade lo que el test de contrato no cubre solo: **429**, consumidor v1 y traza sin PII.",
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
        content: "El dueño de S41-T4-A acepta que un bug de dominio se atrapa en unit; un status HTTP incorrecto, en contract. Forma de pirámide: unit ≥ contract ≥ integration.",
      },
    },
    {
      heading: "Compatibilidad, rate limit y observabilidad",
      subtopicId: "S41-T4-B",
      paragraphs: [
        "El gate CP-N4-A no solo pide create idempotente: pide que un **cliente v1** siga leyendo y que el abuso no tire el servicio. **Compatibilidad de lectura**: campos estables (`job_id`, `status`) no se renombran ni se quitan sin versión. **Rate limiting** (idea de token bucket) responde **429** con `retry_after_s` cuando `used > limit` — no 500 opaco. **Observabilidad**: `trace_id` correlaciona request→job→resultado; logs **sin PII** (ni DNI, ni email, ni secretos).",
        "Tabla de decisión: `used=73, limit=100` ⇒ allow y `remaining=27`; `used=110` ⇒ **429**. Consumidor v1 debe seguir parseando `job_id`/`status`. Traza segura: ban-list `email|dni|secret`. Anti-patrón: silenciar el 429, romper campos v1 o loguear PII “para depurar”.",
        "`CASO-ARE-041-4B` (oficina Arequipa): cuota sintética 100; traza `tr-are-041` sin email. Evidencia: dos decisiones de rate + `trace_ok`. Con T1–T4 cerrados, el You Do ensambla create/replay/conflict + 422 + GET en un solo lab de portafolio.",
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
        content: "Cierre de S41-T4-B: Criterio T4-B (cierre del gate): cuota excedida ⇒ 429 recuperable; consumidor v1 sigue leyendo campos estables; traza sin PII. Breach ⇒ `THROTTLE_AND_REDACT`; compat incierta ⇒ `INSPECT_COMPATIBILITY`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S41 (API con FastAPI y contratos HTTP) alineadas a CP-N4-A. Piensa en voz alta conmigo: cada demo **calcula** un contrato en stdlib — no imprime una respuesta mágica. Cubriremos status, idempotencia con keyset (paginación por cursor), DI, validación 422, boundaries async, timeouts con Problem Details (RFC 9457), pirámide de tests y 429 con traza. Luego el lab te pedirá implementar la misma idea.",
    steps: [
      {
        demoId: "S41-T1-A-DEMO",
        subtopicId: "S41-T1-A",
        environment: "local-python",
        description: "Demo: recursos, métodos y status",
        preamble:
          "Antes de cablear FastAPI, el control plane de la oficina sintética en Arequipa (`CASO-ARE-041`) necesita una **matriz HTTP** asertable. En esta demo `status_for` decide el código a partir del método, el path y si el ítem existe. Observa cuatro llamadas: create de jobs, GET de un id ausente, listado de colección y health. No escribas aún: predice `201`, `404`, `200`, `200` y compáralos con la salida. Si confundes create con 200 o tratas la colección vacía como 404, el OpenAPI y los clientes mienten.",
        code: {
          language: 'python',
          title: "demo_resources_methods_status.py",
          code: `def status_for(method: str, resource: str, *, item_exists: bool = True) -> int:
    if method == "POST" and resource.rstrip("/").endswith("/jobs"):
        return 201
    if method == "GET" and resource.endswith("/health"):
        return 200
    if method == "GET" and "/jobs/" in resource:
        return 200 if item_exists else 404
    if method == "GET" and resource.rstrip("/").endswith("/jobs"):
        return 200
    return 405

print(status_for("POST", "/v1/jobs"))
print(status_for("GET", "/v1/jobs/job-404", item_exists=False))
print(status_for("GET", "/v1/jobs"))
print(status_for("GET", "/v1/health"))`,
          output: `201
404
200
200`,
        },
        why: "El create exitoso es **201** (recurso nuevo), no 200 de lectura genérica. El **404** vive en `/v1/jobs/{id}` cuando el ítem no existe; la colección (vacía o no) sigue en **200**. Health es 200. Así la matriz método/path/status queda testeable antes de `@app.post`. En We Do repararás el DEFECT que devuelve 200 en create.",
        retrospective:
          "Si puedes explicar por qué un create no es 200 y por qué una lista vacía no es 404 sin mirar el código, ya tienes el hábito de status semánticos. El error clásico es un 200 genérico que confunde a OpenAPI. En We Do practicarás corregir `status_for` y luego assess/decide fail-closed.",
      },
      {
        demoId: "S41-T1-B-DEMO",
        subtopicId: "S41-T1-B",
        environment: "local-python",
        description: "Demo: idempotencia, paginación y versionado",
        preamble:
          "El riesgo operativo del create no es solo el status: es el **reintento**. En esta demo `idempotent_create` liga una key al body canónico: idéntico ⇒ replay, distinto ⇒ conflict, y `side_effects` queda en 1. Luego `page_keyset` pagina por cursor (`next=job-002`), no por offset. No escribas: predice las tres etiquetas, el largo del store y las dos páginas. Si la misma key con body distinto crea un segundo job, el gate CP-N4-A se rompe.",
        code: {
          language: 'python',
          title: "demo_idempotency_pagination_versioning.py",
          code: `def idempotent_create(store: dict, key: str, body: dict) -> str:
    if key in store:
        return "replay" if store[key] == body else "conflict"
    store[key] = body
    return "created"

def page_keyset(items: list, after_id=None, size: int = 2) -> dict:
    start = 0
    if after_id is not None:
        start = items.index(after_id) + 1 if after_id in items else len(items)
    chunk = items[start : start + size]
    nxt = chunk[-1] if start + size < len(items) else None
    return {"data": chunk, "next": nxt}

store = {}
jobs = ["job-001", "job-002", "job-003", "job-004"]
print(idempotent_create(store, "k1", {"name": "job"}))
print(idempotent_create(store, "k1", {"name": "job"}))
print(idempotent_create(store, "k1", {"name": "other"}))
print("side_effects", len(store))
print(page_keyset(jobs, None, 2))
print(page_keyset(jobs, "job-002", 2))`,
          output: `created
replay
conflict
side_effects 1
{'data': ['job-001', 'job-002'], 'next': 'job-002'}
{'data': ['job-003', 'job-004'], 'next': None}`,
        },
        why: "La key + el body canónico evitan side effects duplicados: idéntico ⇒ replay, distinto ⇒ conflict (no segundo create). `side_effects==1` es el assert del gate. Keyset (`after_id` → `next`) es más estable que offset si el set crece al inicio. En We Do repararás un store que siempre inserta.",
        retrospective:
          "Replay ≠ segundo create; body distinto bajo la misma key es conflicto. El error clásico es “si la key existe, reintento silencioso” sin comparar el body. Pregunta: ¿qué assert del gate mide un solo side effect? (`len(store)==1` / un job). We Do: implementar el store y luego assess/decide de auditoría.",
      },
      {
        demoId: "S41-T2-A-DEMO",
        subtopicId: "S41-T2-A",
        environment: "local-python",
        description: "Demo: routing, dependencies y modelos",
        preamble:
          "En FastAPI (y en este modelo stdlib) el **path operation** solo orquesta. Esta demo muestra `thin_handler(get_store, body)` que llama a `create_job` sin status codes: al inyectar dos stores distintos, cada uno crece por su cuenta (`swapped_stores 1 1`). No escribas: predice los dos jobs y los largos. Si el dominio importa HTTP o un global, no puedes sustituir el store en tests de contrato.",
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
        why: "DI = sustituir `get_store` sin tocar la ruta. El dominio solo recibe store+body; no conoce status codes ni FastAPI (`domain_imports_http == False` como flag mental). Así montas tests de contrato con fakes. En We Do sacarás `status_code` y el global del dominio.",
        retrospective:
          "Handler delgado + store inyectable es el mismo hábito que `Depends` en FastAPI. El error clásico es meter SQL y status en el path. Pregunta: si el dominio importa `Request`, ¿puedes montar un test de contrato con fake store sin reescribir la ruta? We Do: reparar el handler gordo del starter.",
      },
      {
        demoId: "S41-T2-B-DEMO",
        subtopicId: "S41-T2-B",
        environment: "local-python",
        description: "Demo: validación, serialización y documentación",
        preamble:
          "El handler delgado asume un body confiable: hay que **validar y redactar**. En esta demo `handle` devuelve 422 si falta `priority` y, si es válido, una vista allow-list sin `secret`. Observa las dos rutas y el flag `secret_leaked`. No escribas: predice los pares status/body. Si el secreto del body crudo sale en la respuesta, el contrato y la privacidad fallan aunque el status sea 200.",
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
        why: "Validación antes del dominio (como Pydantic/FastAPI 422); serialización por allow-list. El secreto del body crudo no viaja a la respuesta: OpenAPI declara el shape público, no el interno. Así el contrato de entrada y salida se puede testear sin red. En We Do dejarás de devolver el body crudo.",
        retrospective:
          "422 tipado + vista pública es el par mínimo de contrato de entrada/salida. El error clásico es 200 con leak o defaults inventados. Pregunta: ¿qué status devuelve FastAPI por defecto ante body inválido? We Do: implementar `handle` y luego assess de OpenAPI alineado.",
      },
      {
        demoId: "S41-T3-A-DEMO",
        subtopicId: "S41-T3-A",
        environment: "local-python",
        description: "Demo: sync/async y background boundaries",
        preamble:
          "El contrato HTTP puede ser correcto y aun así **bloquear el event loop**. Esta demo clasifica `io_wait` → async (sin encolar) y `cpu_heavy` → background (encola `queued`). Observa las tuplas boundary/longitud y el contenido de la cola. No escribas: predice `('async', 0)` y luego un item en queue. Si el score CPU vive en el path del POST, el control plane se ahoga bajo carga.",
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
        why: "Async brilla en I/O wait; CPU y trabajo durable salen a worker con store confiable. La demo muestra decisión + efecto en la cola, no un booleano vacío. En We Do dejarás de marcar todo como async.",
        retrospective:
          "Boundary = decisión documentada + efecto observable (cola). El error clásico es `await` de trabajo CPU como si fuera red. Pregunta: si el POST encola, ¿qué `status` de job esperas ver en la respuesta? (`queued`.) We Do: implementar choose/enqueue y assess de offload.",
      },
      {
        demoId: "S41-T3-B-DEMO",
        subtopicId: "S41-T3-B",
        environment: "local-python",
        description: "Demo: errores, timeouts y lifecycle",
        preamble:
          "Cuando el upstream tarda de más, el cliente no debe recibir un stack ni un email. Esta demo corre con budget: ok cierra el pool; timeout devuelve `UPSTREAM_TIMEOUT` con `trace_id` y **también** deja `open []` gracias al `finally`. Observa ambos prints. No escribas: predice outcome y recursos. Si solo cierras en el camino feliz, el timeout deja sockets abiertos.",
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
        why: "El budget decide ok vs. timeout; el `finally` cierra siempre. El error lleva type/title/status/trace_id estilo RFC 9457, sin PII. En We Do quitarás el 500 con email del starter y medirás cascada client>service>db.",
        retrospective:
          "Cancel + close + payload seguro es el trío de timeout. El error clásico es 500 genérico con PII o cerrar el pool solo si `outcome==ok`. Pregunta: ¿por qué el error lleva `trace_id` y no email? We Do: implementar budget y assess de cascada client>service>db.",
      },
      {
        demoId: "S41-T4-A-DEMO",
        subtopicId: "S41-T4-A",
        environment: "local-python",
        description: "Demo: unit/contract/integration",
        preamble:
          "Ya tienes contratos y timeouts: falta **demostrar** que un fallo se atrapa en el nivel correcto. Esta demo siembra `domain` (solo unit lo ve) y `http` (solo contract); integration no debe ser el único colador. Observa True/False por semilla y `pyramid True` con 12≥5≥2. No escribas: predice cada fila. Si solo confías en un e2e, un 200 en create puede esconderse.",
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
        why: "Unit = regla de dominio; contract = status/schema/headers; integration = adapter controlado. Forma unit ≥ contract ≥ integration. Siembras el bug y preguntas qué nivel debe atraparlo. En We Do dejarás de devolver siempre True.",
        retrospective:
          "El nivel correcto localiza el diseño roto. El error clásico es solo unit o solo e2e. Pregunta: un 200 en create sembrado, ¿qué nivel debe atraparlo? (contract.) We Do: mapear seeds y forma de pirámide.",
      },
      {
        demoId: "S41-T4-B-DEMO",
        subtopicId: "S41-T4-B",
        environment: "local-python",
        description: "Demo: compatibility, rate limit y observabilidad",
        preamble:
          "El gate CP-N4-A también pide que el abuso no tire el servicio y que la traza no filtre PII. Esta demo calcula `admit`: used 73 ⇒ remaining 27; used 110 ⇒ 429 con `retry_after_s`. Luego `log_fields` saca el email y deja `trace_id`/`job_id`. No escribas: predice los tres prints. Si respondes 500 opaco o logueas el email “para depurar”, rompes privacidad y recuperabilidad.",
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
        why: "429 es recuperable (no un 500 opaco); remaining solo en allow; ban-set de email/dni/secret en el log. Campos estables `job_id`/`trace_id` preservan compat v1. En We Do dejarás de admitir siempre y de devolver el event crudo.",
        retrospective:
          "Throttle real + log limpio cierran el edge del control plane. El error clásico es 200 con remaining negativo o PII en log “para depurar”. Pregunta: ¿qué campo de compat v1 preserva el lab además de `job_id`? (`trace_id`.) We Do: implementar admit/log y assess de consumer v1.",
      },
    ],
  },
  weDo: {
    intro: "S41 · Laboratorio de contratos HTTP (modelo stdlib de FastAPI) para jobs y evidencia: 24 retos locales. E1 implementa la función de dominio del subtema (status, idempotencia, DI, 422, boundary, timeout, pirámide, 429) con un DEFECT real en el cuerpo. No se trata solo de invertir un booleano. E2 evalúa tres registros (válido, adverso y missing) con `assess`. E3 decide CONTINUE, token de breach o token de incertidumbre. Los tokens (`RETURN_*`, `THIN_THE_HANDLER`, …) son códigos de lab fail-closed, no enums de producción. Fixtures sintéticos de Arequipa (`CASO-ARE-041-*`).",
    steps: [
      {
        id: "S41-T1-A-E1",
        subtopicId: "S41-T1-A",
        kind: "guided",
        title: "Create de jobs con status 201",
        preamble:
          "- **Contexto:** en `CASO-ARE-041-1A` la matriz del lab fija el create de jobs como POST + colección `/v1/jobs` ⇒ **201**, no 200.\n- **Meta:** implementar `status_for(method, resource, *, item_exists)` con status semánticos.\n- **Éxito:** los asserts del starter pasan e imprimes `S41-T1-A PASS` (POST create 201; health 200; colección 200; ítem ausente 404).\n- **Límites:** no dejes 200 en create; no uses 404 en la colección; fixtures sintéticos sin PII.",
        instruction:
          "S41-T1-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: en POST + path que termina en `/jobs` devuelve `200` (bug).\n2. Cámbialo a `201`.\n3. Conserva health 200, colección 200, ítem ausente 404 y el fallback 405.\n4. No borres los asserts ni el print final.",
        hint: "Piensa en una matriz: el status sale de (método, path, existencia del ítem), no de un literal fijo.",
        hints: [
          "Piensa en una matriz: el status sale de (método, path, existencia del ítem), no de un literal fijo.",
          "POST + path de colección /jobs ⇒ 201. GET health ⇒ 200. GET colección /jobs ⇒ 200. GET /jobs/{id} sin ítem ⇒ 404.",
        ],
        edgeCases: ["Falta status", "Fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"],
        tests: "Los asserts de la matriz HTTP pasan e imprimen `S41-T1-A PASS`.",
        feedback:
          "Un create exitoso es 201 Created: comunica recurso nuevo a clientes y a OpenAPI. Devolver 200 confunde lectura con creación. La colección vacía no es 404; el 404 es del ítem `/v1/jobs/{id}`. En E2/E3, status incoherente ⇒ `RETURN_CORRECT_HTTP_STATUS`.",
        retrospective:
          "Status = parte del contrato, no un adorno. El error clásico es 200 en create o 404 en lista vacía. Pregunta: ¿qué status usarías en `GET /v1/jobs` sin filas? (200.) Siguiente (E2): evaluar tres fixtures con assess.",
        starterCode: {
          language: 'python',
          title: "s41-t1-a-e1.py",
          code: `# CASO-ARE-041 · HTTP method+status create
# DEFECT: create devuelve 200 en lugar de 201
# Contrato: corrige status_for; salida alineada a solutionCode
def status_for(method: str, resource: str, *, item_exists: bool = True) -> int:
    # DEFECT: create genérico 200 confunde el contrato OpenAPI
    if method == "POST" and resource.rstrip("/").endswith("/jobs"):
        return 200
    if method == "GET" and resource.endswith("/health"):
        return 200
    if method == "GET" and "/jobs/" in resource:
        return 200 if item_exists else 404
    if method == "GET" and resource.rstrip("/").endswith("/jobs"):
        return 200
    return 405

assert status_for("POST", "/v1/jobs") == 201
assert status_for("GET", "/v1/health") == 200
assert status_for("GET", "/v1/jobs") == 200
assert status_for("GET", "/v1/jobs/job-404", item_exists=False) == 404
print("S41-T1-A", "PASS")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s41-t1-a-e1.py",
          code: `def status_for(method: str, resource: str, *, item_exists: bool = True) -> int:
    if method == "POST" and resource.rstrip("/").endswith("/jobs"):
        return 201
    if method == "GET" and resource.endswith("/health"):
        return 200
    if method == "GET" and "/jobs/" in resource:
        return 200 if item_exists else 404
    if method == "GET" and resource.rstrip("/").endswith("/jobs"):
        return 200
    return 405

assert status_for("POST", "/v1/jobs") == 201
assert status_for("GET", "/v1/health") == 200
assert status_for("GET", "/v1/jobs") == 200
assert status_for("GET", "/v1/jobs/job-404", item_exists=False) == 404
print("S41-T1-A", "PASS")
meets_contract = status_for("POST", "/v1/jobs") == 201
` ,
          output: `S41-T1-A PASS` ,
        },
      },
      {
        id: "S41-T1-A-E2",
        subtopicId: "S41-T1-A",
        kind: "independent",
        title: "Auditar create con assess de status",
        preamble:
          "- **Contexto:** un revisor del control plane recibe tres samples de tráfico sintético: create bien formado, create con 200 incoherente y un registro sin campo `status`.\n- **Meta:** implementar `assess(record)` que valide campos y aplique la regla de T1-A (POST + /jobs + created + 201).\n- **Éxito:** imprimes exactamente `PASS RETURN_CORRECT_HTTP_STATUS MISSING:status`.\n- **Límites:** no inventes status si falta el campo; no apruebes create con 200; solo sintético.",
        instruction:
          "S41-T1-A-E2 · Salida: debe devolver el PASS del contrato. 1. Revisa el starter: el PASS usa `status==200` y `method==GET` (predicado invertido).\n2. Mantén la rama `missing` primero.\n3. PASS solo si POST, resource termina en `/jobs`, `created` y `status==201`.\n4. Conserva el print de las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a status debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a status debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T1-A: método, recurso y 201 coherentes. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta status", "Fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `status` ausente y produce exactamente `PASS RETURN_CORRECT_HTTP_STATUS MISSING:status`.",
        feedback:
          "PASS solo con POST + /jobs + created + 201: esa es la matriz que el cliente y OpenAPI esperan. Un create con 200 es breach (`RETURN_CORRECT_HTTP_STATUS`). Si falta `status`, no inventes el código.",
        retrospective:
          "Missing-first evita leer un campo que no existe. PASS exige la matriz de create (POST + `/jobs` + 201), no un 200 genérico de lectura. Pregunta: si el record trae `status=201` pero `method=GET`, ¿PASS o breach y por qué? Luego (E3) el mismo criterio se vuelve decisión de gate.",
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
        title: "Gate fail-closed de status HTTP",
        preamble:
          "- **Contexto:** en transferencia de contrato OpenAPI, tres muestras de tráfico deciden si el flujo de jobs **sigue**, se **corrige** o se **revisa** por incertidumbre.\n- **Meta:** `decide(record)` fail-closed: OK ⇒ `CONTINUE`; create con 200 ⇒ `RETURN_CORRECT_HTTP_STATUS`; sin `status` ⇒ `REVIEW_RESOURCE_SEMANTICS`.\n- **Éxito:** `CONTINUE RETURN_CORRECT_HTTP_STATUS REVIEW_RESOURCE_SEMANTICS` en ese orden.\n- **Límites:** no trates la ausencia como éxito; no inventes el código HTTP; tokens de lab, no enums de prod.",
        instruction:
          "S41-T1-A-E3 · Salida: debe devolver el PASS del contrato. 1. Si faltan campos, devuelve `REVIEW_RESOURCE_SEMANTICS` (no CONTINUE).\n2. CONTINUE solo con POST + /jobs + created + 201.\n3. Cualquier otra combinación completa ⇒ `RETURN_CORRECT_HTTP_STATUS`.\n4. Conserva el assert de orden de resultados.",
        hint: "Sin status ⇒ REVIEW_RESOURCE_SEMANTICS antes de mirar method/resource. CONTINUE solo con POST + /jobs + created + status 201.",
        hints: [
          "Sin status ⇒ REVIEW_RESOURCE_SEMANTICS antes de mirar method/resource. CONTINUE solo con POST + /jobs + created + status 201.",
          "POST create con 200 es breach: RETURN_CORRECT_HTTP_STATUS.",
        ],
        edgeCases: ["Falta status", "Fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"],
        tests: "Fixtures `CASO-ARE-041-1A`, adverso y sin `status` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "En el gate de promoción: 200 en create es `RETURN_CORRECT_HTTP_STATUS` porque el cliente y OpenAPI esperan 201. Sin status no se inventa el código — `REVIEW_RESOURCE_SEMANTICS`.",
        retrospective:
          "Incertidumbre ≠ CONTINUE: sin evidencia de status no se promueve. El error clásico es aprobar 200 en create o rellenar campos. Pregunta: ¿qué token usarías si falta `method`? (misma rama de missing.)",
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
assert results == ["CONTINUE", "RETURN_CORRECT_HTTP_STATUS", "REVIEW_RESOURCE_SEMANTICS"]

` ,
          output: `CONTINUE RETURN_CORRECT_HTTP_STATUS REVIEW_RESOURCE_SEMANTICS` ,
        },
      },
      {
        id: "S41-T1-B-E1",
        subtopicId: "S41-T1-B",
        kind: "guided",
        title: "Store de Idempotency-Key sin duplicar",
        preamble:
          "- **Contexto:** en `CASO-ARE-041-1B` un cliente reintenta `POST /v1/jobs` con la misma Idempotency-Key; el lab debe dejar **un solo** side effect.\n- **Meta:** implementar `idempotent_create(store, key, body)` → `created` | `replay` | `conflict`.\n- **Éxito:** created → replay → conflict y `len(store)==1`; imprime `S41-T1-B PASS`.\n- **Límites:** no insertes con key mutada; no crees un segundo job en replay; no silencies body distinto.",
        instruction:
          "S41-T1-B-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: ignora el store real y siempre devuelve `\"created\"`.\n2. Si `key in store`, compara body: igual ⇒ `replay`, distinto ⇒ `conflict`.\n3. Si la key es nueva, guarda `store[key] = body` y devuelve `created`.\n4. Conserva los asserts de longitud 1.",
        hint: "Si la key ya está en store, compara el body guardado: igual ⇒ replay, distinto ⇒ conflict. Solo insertas cuando la key es nueva.",
        hints: [
          "Si la key ya está en store, compara el body guardado: igual ⇒ replay, distinto ⇒ conflict. Solo insertas cuando la key es nueva.",
          "El side effect único se mide con len(store)==1 tras created+replay del mismo body.",
        ],
        edgeCases: ["Falta version", "Fixture adverso: hash mismatch o effects>1 (conflicto de idempotencia)", "CASO-ARE-041-1B es sintético"],
        tests: "created → replay → conflict y un solo side effect; imprime `S41-T1-B PASS`.",
        feedback:
          "La key liga el body canónico: igualdad ⇒ replay, mismatch ⇒ conflict, y el store no crece. Un segundo create en reintento rompe el gate CP-N4-A. E2 usa `RETURN_IDEMPOTENCY_CONFLICT` cuando hash/effects fallan.",
        retrospective:
          "Un reintento del cliente no debe crear un segundo job: la key es el candado, el body canónico es la llave. El error clásico es mutar la key (`key+len`) “para no pisar” y esconder el duplicado. Pregunta: si el segundo POST es idéntico, ¿qué label y qué largo de store esperas? Siguiente (E2): auditar hash, effects y version.",
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
print("S41-T1-B", "PASS")

meets_contract = len(store) == 1 and idempotent_create(store, "k1", {"x": 1}) == "replay"
` ,
          output: `S41-T1-B PASS` ,
        },
      },
      {
        id: "S41-T1-B-E2",
        subtopicId: "S41-T1-B",
        kind: "independent",
        title: "Auditar hash, effects y versión",
        preamble:
          "- **Contexto:** el gateway te entrega tres records de auditoría de reintentos: uno sano, uno con hash mismatch + effects>1, y uno sin `version`.\n- **Meta:** `assess` con missing-first y predicado de T1-B (hash igual, un efecto, cursor tipo `job-*`, version `v1`).\n- **Éxito:** `PASS RETURN_IDEMPOTENCY_CONFLICT MISSING:version`.\n- **Límites:** no apruebes effects>1; no inventes version; cursor offset no cuenta como keyset sano.",
        instruction:
          "S41-T1-B-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige el predicado invertido (hoy PASS si effects>1 o hash distinto).\n2. PASS solo con hash estable, effects==1, cursor que empieza por `job-` y version `v1`.\n3. Mantén `MISSING:` + campos ordenados.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a version debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a version debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T1-B: hash estable, un efecto, cursor y versión explícita. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta version", "Fixture adverso: hash mismatch o effects>1 (conflicto de idempotencia)", "CASO-ARE-041-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `version` ausente y produce exactamente `PASS RETURN_IDEMPOTENCY_CONFLICT MISSING:version`.",
        feedback:
          "Idempotencia sana es observable: un efecto, hash estable, cursor keyset (`job-*`) y versión explícita `v1`. Hash mismatch o effects>1 ⇒ `RETURN_IDEMPOTENCY_CONFLICT` porque el cliente no debe ver un segundo job. Sin `version` no asumas v1.",
        retrospective:
          "No “arregles” inventando version o cursor: la evidencia incompleta es `MISSING`, no PASS. El error clásico es aprobar effects=2 si el hash “se ve”. Pregunta: ¿por qué un cursor `offset:20` no cuenta como keyset sano en este lab? Luego (E3): tokens de reintento fail-closed.",
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
        title: "Reintentos: continue, conflict o replay",
        preamble:
          "- **Contexto:** un cliente reintenta POST y el gateway pide una decisión fail-closed sobre tres records (válido, hash/effects rotos, sin version).\n- **Meta:** `decide` → `CONTINUE` | `RETURN_IDEMPOTENCY_CONFLICT` | `REPLAY_STORED_RESPONSE`.\n- **Éxito:** `CONTINUE RETURN_IDEMPOTENCY_CONFLICT REPLAY_STORED_RESPONSE`.\n- **Límites:** sin version no inventes v1; breach por hash o effects>1; tokens de lab.",
        instruction:
          "S41-T1-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing ⇒ `REPLAY_STORED_RESPONSE` (no CONTINUE).\n2. CONTINUE solo con el predicado sano de E2.\n3. Resto completo ⇒ `RETURN_IDEMPOTENCY_CONFLICT`.\n4. Conserva el assert de orden.",
        hint: "Incertidumbre (falta version) se enruta a REPLAY_STORED_RESPONSE *antes* de mirar hashes. Breach = hash distinto o effects>1 o cursor/version rotos.",
        hints: [
          "Incertidumbre (falta version) se enruta a REPLAY_STORED_RESPONSE *antes* de mirar hashes. Breach = hash distinto o effects>1 o cursor/version rotos.",
          "Válido de referencia: request_hash==stored_hash, effects==1, cursor tipo job-*, version v1 → CONTINUE.",
        ],
        edgeCases: ["Falta version", "Fixture adverso: hash mismatch o effects>1 (conflicto de idempotencia)", "CASO-ARE-041-1B es sintético"],
        tests: "Fixtures `CASO-ARE-041-1B`, adverso y sin `version` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Ante reintentos: el adverso activa `RETURN_IDEMPOTENCY_CONFLICT` por hash/effects (el cliente no debe ver un segundo job). Faltar version exige `REPLAY_STORED_RESPONSE` (token de lab: no inventes v1 ni “arregles” el record). CONTINUE solo con el predicado sano de E2.",
        retrospective:
          "Ante incertidumbre de version, reutiliza la respuesta almacenada o escala: no “arregles” inventando v1. El error clásico es CONTINUE cuando falta evidencia. Pregunta: ¿por qué body distinto bajo la misma key no es replay?",
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
assert results == ["CONTINUE", "RETURN_IDEMPOTENCY_CONFLICT", "REPLAY_STORED_RESPONSE"]

` ,
          output: `CONTINUE RETURN_IDEMPOTENCY_CONFLICT REPLAY_STORED_RESPONSE` ,
        },
      },
      {
        id: "S41-T2-A-E1",
        subtopicId: "S41-T2-A",
        kind: "guided",
        title: "Handler delgado con store inyectable",
        preamble:
          "- **Contexto:** en `CASO-ARE-041-2A` el POST de jobs debe poder probarse con dos fakes sin reescribir la ruta.\n- **Meta:** `create_job(store, body)` puro y `thin_handler(get_store, body)` que solo orquesta.\n- **Éxito:** cada fake recibe un job, sin `status_code` en el body; imprime `S41-T2-A PASS`.\n- **Límites:** no uses un global; no pongas status HTTP en el dominio; no ignores `get_store`.",
        instruction:
          "S41-T2-A-E1 · Salida: debe devolver el PASS del contrato. 1. Elimina `GLOBAL` y el campo `status_code`.\n2. `create_job` recibe `store` y hace append.\n3. `thin_handler` es `return create_job(get_store(), body)`.\n4. Conserva asserts de longitud y ausencia de status_code.",
        hint: "El dominio no debe conocer status codes ni un global: recibe `store` y `body`. El handler es `return create_job(get_store(), body)`.",
        hints: [
          "El dominio no debe conocer status codes ni un global: recibe `store` y `body`. El handler es `return create_job(get_store(), body)`.",
          "Prueba DI: llama thin_handler con lambda: mem_a y luego lambda: mem_b; ambos stores crecen independientemente.",
        ],
        edgeCases: ["Falta domain_called", "Fixture adverso: handler gordo o domain_imports_http (boundary rota)", "CASO-ARE-041-2A es sintético"],
        tests: "Dos stores inyectados reciben un job cada uno; dominio sin status HTTP; imprime `S41-T2-A PASS`.",
        feedback:
          "DI se demuestra sustituyendo `get_store` sin tocar el path operation: así montas tests de contrato con fakes. E2 marca `THIN_THE_HANDLER` si el handler es gordo o el dominio importa HTTP.",
        retrospective:
          "El dominio no debe conocer status ni un store global: recibe store+body y devuelve el job. El error clásico es el singleton `GLOBAL` o meter `status_code` “para OpenAPI”. Pregunta: ¿por qué dos lambdas distintas demuestran DI mejor que un solo store? Siguiente (E2): assess de líneas del handler y flags de boundary.",
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
print("S41-T2-A", "PASS")

meets_contract = "status_code" not in mem_a[0] and len(mem_a) == 1
` ,
          output: `S41-T2-A PASS` ,
        },
      },
      {
        id: "S41-T2-A-E2",
        subtopicId: "S41-T2-A",
        kind: "independent",
        title: "Medir si el handler se engordó",
        preamble:
          "- **Contexto:** en code review del control plane mides si el path operation sigue delgado o se mezcló con HTTP/dominio.\n- **Meta:** `assess` → PASS si handler corto, DI, dominio sin HTTP y `domain_called`; si no, `THIN_THE_HANDLER`; missing ⇒ `MISSING:domain_called`.\n- **Éxito:** `PASS THIN_THE_HANDLER MISSING:domain_called`.\n- **Límites:** no apruebes handlers gordos ni `domain_imports_http`; no inventes domain_called.",
        instruction:
          "S41-T2-A-E2 · Salida: debe devolver el PASS del contrato. 1. Invierte el predicado: PASS no es “líneas >20 y domain_imports_http”.\n2. Criterio: `handler_lines <= 5` y flags sanos.\n3. Missing-first.\n4. Print de tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a domain_called debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a domain_called debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T2-A: handler delgado y dependencia sustituible. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta domain_called", "Fixture adverso: handler gordo o domain_imports_http (boundary rota)", "CASO-ARE-041-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `domain_called` ausente y produce exactamente `PASS THIN_THE_HANDLER MISSING:domain_called`.",
        feedback:
          "Handler delgado + DI + dominio sin HTTP ⇒ PASS: el cliente no ve capas mezcladas y los tests pueden inyectar fakes. Si el path engorda o el dominio importa HTTP ⇒ `THIN_THE_HANDLER`. Sin `domain_called` no hay orquestación demostrada.",
        retrospective:
          "Las métricas del lab (líneas, flags) son proxies de boundary, no dogmas de estilo de equipo. Sin `domain_called` no hay orquestación demostrada aunque el path “compile”. Pregunta: ¿qué fallaría en un TestClient si el dominio importara FastAPI? Luego (E3): tokens de review.",
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
        title: "Review: adelgazar o revisar boundary",
        preamble:
          "- **Contexto:** tres mediciones de capas deciden si el path sigue, se adelgaza o se revisa la boundary de dependencias.\n- **Meta:** `decide` fail-closed con tokens de lab.\n- **Éxito:** `CONTINUE THIN_THE_HANDLER REVIEW_DEPENDENCY_BOUNDARY`.\n- **Límites:** sin `domain_called` no asumas orquestación; tokens ≠ enums de producción.",
        instruction:
          "S41-T2-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing ⇒ `REVIEW_DEPENDENCY_BOUNDARY`.\n2. CONTINUE con el predicado sano de E2.\n3. Resto ⇒ `THIN_THE_HANDLER`.\n4. Conserva el assert.",
        hint: "Sin domain_called ⇒ REVIEW_DEPENDENCY_BOUNDARY. CONTINUE exige handler_lines≤5, dependency_injectable, no domain_imports_http y domain_called.",
        hints: [
          "Sin domain_called ⇒ REVIEW_DEPENDENCY_BOUNDARY. CONTINUE exige handler_lines≤5, dependency_injectable, no domain_imports_http y domain_called.",
          "Handler gordo o dominio que importa HTTP ⇒ THIN_THE_HANDLER.",
        ],
        edgeCases: ["Falta domain_called", "Fixture adverso: handler gordo o domain_imports_http (boundary rota)", "CASO-ARE-041-2A es sintético"],
        tests: "Fixtures `CASO-ARE-041-2A`, adverso y sin `domain_called` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "En code review: `THIN_THE_HANDLER` si el path engorda o el dominio toca HTTP (rompe tests con fakes). Sin `domain_called` no se asume orquestación — `REVIEW_DEPENDENCY_BOUNDARY`.",
        retrospective:
          "Code review fail-closed: falta de evidencia de dominio no es CONTINUE. El error clásico es “compila, ya está”. Pregunta: ¿por qué el dominio no debe importar `Request`?",
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
assert results == ["CONTINUE", "THIN_THE_HANDLER", "REVIEW_DEPENDENCY_BOUNDARY"]

` ,
          output: `CONTINUE THIN_THE_HANDLER REVIEW_DEPENDENCY_BOUNDARY` ,
        },
      },
      {
        id: "S41-T2-B-E1",
        subtopicId: "S41-T2-B",
        kind: "guided",
        title: "Validar 422 y redactar la vista",
        preamble:
          "- **Contexto:** en `CASO-ARE-041-2B` un job sintético `er-run` puede traer `secret`; el cliente solo debe ver campos públicos.\n- **Meta:** `handle(body)` → 422 tipado si falta `priority`; 200 con allow-list `{name, priority}` si es válido.\n- **Éxito:** asserts de 200 sin secret y 422 con fields; imprime `S41-T2-B PASS`.\n- **Límites:** no devuelvas el body crudo; no uses 200 con defaults silenciosos; sin PII real.",
        instruction:
          "S41-T2-B-E1 · Salida: debe devolver el PASS del contrato. 1. Define required `{name, priority}`.\n2. Si faltan campos, 422 + error/fields ordenados.\n3. Si pasa, `public_view` con allow-list.\n4. Conserva los asserts del starter.",
        hint: "required = {name, priority}. Si faltan campos, 422 con lista de fields. Si pasa, serializa solo la allow-list pública.",
        hints: [
          "required = {name, priority}. Si faltan campos, 422 con lista de fields. Si pasa, serializa solo la allow-list pública.",
          "Nunca devuelvas secret/internal_key en la respuesta 200; el OpenAPI debe declarar ese shape.",
        ],
        edgeCases: ["Falta openapi_matches", "Fixture adverso: 200 con leak de secret u OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
        tests: "422 en inválido, 200 sin secret en válido; imprime `S41-T2-B PASS`.",
        feedback:
          "Validación antes del dominio y allow-list al salir: el cliente no ve `secret` ni `internal_key`. Un 200 con body crudo rompe privacidad y OpenAPI. E2 usa `REJECT_AND_REDACT` ante 200 con leak.",
        retrospective:
          "Validación y redaction son dos pasos: primero rechazas, luego serializas. El error clásico es echo del body. Siguiente (E2): auditar status, leak y OpenAPI.",
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
print("S41-T2-B", "PASS")

meets_contract = st_bad == 422 and body_bad.get("error") == "validation_error"
` ,
          output: `S41-T2-B PASS` ,
        },
      },
      {
        id: "S41-T2-B-E2",
        subtopicId: "S41-T2-B",
        kind: "independent",
        title: "Auditar 422, leak y OpenAPI",
        preamble:
          "- **Contexto:** revisas tres snapshots: rechazo 422 bien formado (PASS), 200 con secret en response (breach), y un record sin flag `openapi_matches`.\n- **Meta:** `assess` — PASS si input inválido fue rechazado con 422, sin intersección con campos internos y OpenAPI alineado.\n- **Éxito:** `PASS REJECT_AND_REDACT MISSING:openapi_matches`.\n- **Límites:** no apruebes 200 con secret; no inventes openapi_matches; el PASS de este lab es un **rechazo correcto**, no un create feliz.",
        instruction:
          "S41-T2-B-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige el predicado invertido (hoy PASS con 200 y leak).\n2. PASS: `not input_valid` y status 422 y sets disjuntos y openapi_matches.\n3. Missing-first.\n4. Print de tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a openapi_matches debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a openapi_matches debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T2-B: 422 tipado, vista pública y OpenAPI fiel. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta openapi_matches", "Fixture adverso: 200 con leak de secret u OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `openapi_matches` ausente y produce exactamente `PASS REJECT_AND_REDACT MISSING:openapi_matches`.",
        feedback:
          "Un contrato sano también se demuestra fallando bien: 422 tipado, sin leak y OpenAPI alineado ⇒ PASS. Un 200 con secret ⇒ `REJECT_AND_REDACT`. Sin `openapi_matches` el shape no es confiable.",
        retrospective:
          "Un contrato sano también se demuestra fallando bien (422). OpenAPI desalineado es deuda de contrato. Luego (E3): tokens de PR review.",
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
        title: "PR: rechazar leak o regenerar OpenAPI",
        preamble:
          "- **Contexto:** en revisión de PR del control plane, tres snapshots deciden si el contrato sigue, se redacta/rechaza o se regenera la doc.\n- **Meta:** `decide` con tokens fail-closed.\n- **Éxito:** `CONTINUE REJECT_AND_REDACT REGENERATE_OPENAPI`.\n- **Límites:** sin `openapi_matches` no evalúes el body como confiable; no inventes el flag.",
        instruction:
          "S41-T2-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing ⇒ `REGENERATE_OPENAPI`.\n2. CONTINUE con el predicado sano de E2.\n3. Resto ⇒ `REJECT_AND_REDACT`.\n4. Conserva el assert.",
        hint: "Si falta openapi_matches, no evalúes el body: REGENERATE_OPENAPI. Si hay secret en response o status 200 con body inválido: REJECT_AND_REDACT.",
        hints: [
          "Si falta openapi_matches, no evalúes el body: REGENERATE_OPENAPI. Si hay secret en response o status 200 con body inválido: REJECT_AND_REDACT.",
          "CONTINUE solo si validación rechazó inválidos, no hay leak y openapi_matches es True.",
        ],
        edgeCases: ["Falta openapi_matches", "Fixture adverso: 200 con leak de secret u OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
        tests: "Fixtures `CASO-ARE-041-2B`, adverso y sin `openapi_matches` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "En revisión de PR: `REJECT_AND_REDACT` ante leak o 200 inválido (el cliente no debe ver secretos). Sin `openapi_matches` regenera el contrato — `REGENERATE_OPENAPI`. No merges un 200 con secret “para depurar”.",
        retrospective:
          "OpenAPI es evidencia del contrato: si el flag falta, regenera, no asumas. El error clásico es mergear un 200 con secret “para depurar”. Pregunta: ¿qué status devuelve FastAPI ante body inválido por defecto?",
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
assert results == ["CONTINUE", "REJECT_AND_REDACT", "REGENERATE_OPENAPI"]

` ,
          output: `CONTINUE REJECT_AND_REDACT REGENERATE_OPENAPI` ,
        },
      },
      {
        id: "S41-T3-A-E1",
        subtopicId: "S41-T3-A",
        kind: "guided",
        title: "Encolar CPU fuera del event loop",
        preamble:
          "- **Contexto:** en `CASO-ARE-041-3A` un GET ligero puede ser I/O; un score CPU o job durable no debe quedarse en el request.\n- **Meta:** `choose_boundary` + `enqueue_if_needed` (background encola `status=queued`).\n- **Éxito:** io_wait no encola; cpu_heavy encola uno; imprime `S41-T3-A PASS`.\n- **Límites:** no marques todo async; no dejes CPU en el loop; sin PII en ids.",
        instruction:
          "S41-T3-A-E1 · Salida: debe devolver el PASS del contrato. 1. Mapea io_wait→async; cpu_heavy/durable→background; resto→sync.\n2. Solo background hace append a la cola.\n3. Devuelve (boundary, len(queue)).\n4. Conserva los asserts.",
        hint: "Clasifica el kind primero; solo background toca la cola. I/O no debe dejar items en queue.",
        hints: [
          "Clasifica el kind primero; solo background toca la cola. I/O no debe dejar items en queue.",
          "cpu_heavy y durable salen del event loop del request: boundary background + append a queue.",
        ],
        edgeCases: ["Falta durable_job", "Fixture adverso: CPU en event loop sin offload (boundary rota)", "CASO-ARE-041-3A es sintético"],
        tests: "io_wait no encola; cpu_heavy encola un item queued; imprime `S41-T3-A PASS`.",
        feedback:
          "Boundary = decisión documentada + efecto en cola: I/O no llena la cola; CPU sí se encola. Si el score CPU vive en el path, el control plane se ahoga. E2 usa `MOVE_WORK_OFF_EVENT_LOOP` si CPU queda en el loop.",
        retrospective:
          "I/O no llena la cola; CPU sí se encola. El error clásico es “async = más rápido” sin offload. Siguiente (E2): assess de uses_await y cpu_offloaded.",
        starterCode: {
          language: 'python',
          title: "s41-t3-a-e1.py",
          code: `# CASO-ARE-041 · async IO vs. CPU offload
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
print("S41-T3-A", "PASS")

meets_contract = b1 == "async" and b2 == "background" and len(q) == 1
` ,
          output: `S41-T3-A PASS` ,
        },
      },
      {
        id: "S41-T3-A-E2",
        subtopicId: "S41-T3-A",
        kind: "independent",
        title: "Auditar offload del event loop",
        preamble:
          "- **Contexto:** capacity review del path: ¿el I/O usa await y los flags de offload/durable están documentados?\n- **Meta:** `assess` — PASS si work_kind io, uses_await, cpu_offloaded y durable_job; adverso CPU sin offload ⇒ `MOVE_WORK_OFF_EVENT_LOOP`; sin flag durable ⇒ `MISSING:durable_job`.\n- **Éxito:** `PASS MOVE_WORK_OFF_EVENT_LOOP MISSING:durable_job`.\n- **Límites:** no apruebes CPU en el request; no inventes durable_job; en este lab PASS exige **flags de capacidad presentes**, no solo el kind.",
        instruction:
          "S41-T3-A-E2 · Salida: debe devolver el PASS del contrato. 1. Invierte el predicado (hoy PASS con cpu + await sin offload).\n2. PASS con el conjunto de flags del fixture válido.\n3. Missing-first.\n4. Print de tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a durable_job debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a durable_job debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T3-A: I/O awaited y CPU/durable fuera del event loop. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta durable_job", "Fixture adverso: CPU en event loop sin offload (boundary rota)", "CASO-ARE-041-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `durable_job` ausente y produce exactamente `PASS MOVE_WORK_OFF_EVENT_LOOP MISSING:durable_job`.",
        feedback:
          "I/O awaited y flags de offload/durable documentados ⇒ PASS (capacidad visible al revisor). CPU en el request ⇒ `MOVE_WORK_OFF_EVENT_LOOP` porque el event loop no aguanta score pesado. Sin flag `durable_job` no asumas offload.",
        retrospective:
          "Documentar `cpu_offloaded` y `durable_job` evita asumir que “ya está en background” solo porque el kind es io. Sin flag no hay evidencia de capacidad. Pregunta: ¿por qué el fixture PASS exige flags True aunque el work_kind sea io? (capacidad del path documentada, no solo el kind del request actual.) Luego (E3): tokens de capacity.",
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
        title: "Capacity: offload o elegir boundary",
        preamble:
          "- **Contexto:** tres clasificaciones de trabajo deciden si el request sigue, se saca del loop o se elige boundary de background ante incertidumbre.\n- **Meta:** `decide` fail-closed.\n- **Éxito:** `CONTINUE MOVE_WORK_OFF_EVENT_LOOP CHOOSE_BACKGROUND_BOUNDARY`.\n- **Límites:** sin `durable_job` no asumas offload; tokens de lab.",
        instruction:
          "S41-T3-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing ⇒ `CHOOSE_BACKGROUND_BOUNDARY`.\n2. CONTINUE con predicado sano.\n3. Resto ⇒ `MOVE_WORK_OFF_EVENT_LOOP`.\n4. Conserva el assert.",
        hint: "Sin durable_job ⇒ CHOOSE_BACKGROUND_BOUNDARY antes de juzgar el loop. CPU o durable en el request ⇒ MOVE_WORK_OFF_EVENT_LOOP.",
        hints: [
          "Sin durable_job ⇒ CHOOSE_BACKGROUND_BOUNDARY antes de juzgar el loop. CPU o durable en el request ⇒ MOVE_WORK_OFF_EVENT_LOOP.",
          "CONTINUE solo si la boundary documentada saca CPU/durable del event loop del path operation.",
        ],
        edgeCases: ["Falta durable_job", "Fixture adverso: CPU en event loop sin offload (boundary rota)", "CASO-ARE-041-3A es sintético"],
        tests: "Fixtures `CASO-ARE-041-3A`, adverso y sin `durable_job` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "En capacity review: `MOVE_WORK_OFF_EVENT_LOOP` si CPU/durable bloquea el request (el loop no aguanta). Sin `durable_job` no se asume offload — `CHOOSE_BACKGROUND_BOUNDARY`. Incertidumbre de durable no es luz verde para CONTINUE.",
        retrospective:
          "Incertidumbre de durable no es luz verde. El error clásico es dejar CPU en el path “por ahora”. Pregunta: ¿qué status de job devolverías al encolar? (`queued`.)",
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
assert results == ["CONTINUE", "MOVE_WORK_OFF_EVENT_LOOP", "CHOOSE_BACKGROUND_BOUNDARY"]

` ,
          output: `CONTINUE MOVE_WORK_OFF_EVENT_LOOP CHOOSE_BACKGROUND_BOUNDARY` ,
        },
      },
      {
        id: "S41-T3-B-E1",
        subtopicId: "S41-T3-B",
        kind: "guided",
        title: "Timeout con finally y sin PII",
        preamble:
          "- **Contexto:** en `CASO-ARE-041-3B` el job sintético puede superar el budget de servicio; el pool debe cerrarse siempre.\n- **Meta:** `run_with_budget` con try/finally; timeout ⇒ 504 Problem Details + `trace_id` sintético, sin email.\n- **Éxito:** ok y timeout dejan resources vacío; error tipado; imprime `S41-T3-B PASS`.\n- **Límites:** no devuelvas 500 con email; no omitas finally; sin PII real.",
        instruction:
          "S41-T3-B-E1 · Salida: debe devolver el PASS del contrato. 1. Envuelve la lógica en try/finally con `clear()`.\n2. Si elapsed > limit, arma error type/title/status 504/trace_id.\n3. Si no, outcome ok.\n4. Conserva los asserts de ambos caminos.",
        hint: "Usa try/finally: clear siempre. En timeout arma un dict con type/title/status/trace_id — nunca email ni stack.",
        hints: [
          "Usa try/finally: clear siempre. En timeout arma un dict con type/title/status/trace_id — nunca email ni stack.",
          "cascade mental: db < service < client; aquí el lab modela un solo limit_s del servicio.",
        ],
        edgeCases: ["Falta resource_closed", "Fixture adverso: budgets invertidos o recurso no cerrado", "CASO-ARE-041-3B es sintético"],
        tests: "ok y timeout dejan resources vacío; error tipado sin PII; imprime `S41-T3-B PASS`.",
        feedback:
          "Cancel + close + payload seguro: el cliente ve 504 tipado con `trace_id`, no un 500 con email. El finally cierra en ok y en timeout. E2 usa `CANCEL_AND_CLOSE` si budgets se invierten o no se cierra.",
        retrospective:
          "El finally no es opcional: cierra en ok y en timeout. El error clásico es PII “para depurar”. Siguiente (E2): assess de cascada de budgets.",
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
print("S41-T3-B", "PASS")

meets_contract = out_ok["outcome"] == "ok" and err["status"] == 504 and res == []
` ,
          output: `S41-T3-B PASS` ,
        },
      },
      {
        id: "S41-T3-B-E2",
        subtopicId: "S41-T3-B",
        kind: "independent",
        title: "Auditar cascada de timeouts",
        preamble:
          "- **Contexto:** telemetría de tres mediciones: cascada sana y recurso cerrado; budgets invertidos + pool abierto; flag de cierre ausente.\n- **Meta:** `assess` — PASS si db < service < client, error `UPSTREAM_TIMEOUT` y `resource_closed`; si no `CANCEL_AND_CLOSE`; missing ⇒ `MISSING:resource_closed`.\n- **Éxito:** `PASS CANCEL_AND_CLOSE MISSING:resource_closed`.\n- **Límites:** no apruebes budgets invertidos; no inventes resource_closed.",
        instruction:
          "S41-T3-B-E2 · Salida: debe devolver el PASS del contrato. 1. Invierte el predicado (hoy PASS con db > client o cerrado False).\n2. PASS con cascada estricta + código estable + closed True.\n3. Missing-first.\n4. Print de tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a resource_closed debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a resource_closed debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T3-B: timeouts decrecientes, error estable y cierre de recurso. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta resource_closed", "Fixture adverso: budgets invertidos o recurso no cerrado", "CASO-ARE-041-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `resource_closed` ausente y produce exactamente `PASS CANCEL_AND_CLOSE MISSING:resource_closed`.",
        feedback:
          "Cascada client>service>db deja cancelar primero lo interno; con recurso cerrado ⇒ PASS. Budgets invertidos o pool abierto ⇒ `CANCEL_AND_CLOSE`. Sin `resource_closed` no hay cierre demostrable.",
        retrospective:
          "Budgets invertidos matan el cancel interno: el cliente corta antes que la DB y el worker sigue ocupado. Pool abierto tras timeout es breach de lifecycle, no solo de status. Pregunta: si `resource_closed` falta, ¿inventas True o devuelves MISSING? Luego (E3): tokens de incidente.",
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
        title: "Incidente: cancelar o recalcular budget",
        preamble:
          "- **Contexto:** en un incidente de timeout del control plane, tres mediciones deciden continuar, cancelar/cerrar o recalcular budgets ante evidencia incompleta.\n- **Meta:** `decide` fail-closed.\n- **Éxito:** `CONTINUE CANCEL_AND_CLOSE RECALCULATE_TIMEOUT_BUDGET`.\n- **Límites:** sin `resource_closed` no hay promoción; tokens de lab.",
        instruction:
          "S41-T3-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing ⇒ `RECALCULATE_TIMEOUT_BUDGET`.\n2. CONTINUE con predicado sano.\n3. Resto ⇒ `CANCEL_AND_CLOSE`.\n4. Conserva el assert.",
        hint: "Sin resource_closed ⇒ RECALCULATE_TIMEOUT_BUDGET. CONTINUE exige client>service>db, error_code estable y resource_closed True.",
        hints: [
          "Sin resource_closed ⇒ RECALCULATE_TIMEOUT_BUDGET. CONTINUE exige client>service>db, error_code estable y resource_closed True.",
          "Budgets invertidos o recurso abierto tras timeout ⇒ CANCEL_AND_CLOSE.",
        ],
        edgeCases: ["Falta resource_closed", "Fixture adverso: budgets invertidos o recurso no cerrado", "CASO-ARE-041-3B es sintético"],
        tests: "Fixtures `CASO-ARE-041-3B`, adverso y sin `resource_closed` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "En incidente de timeout: `CANCEL_AND_CLOSE` si la cascada o el cierre fallan (sockets abiertos o budgets invertidos). Sin `resource_closed` no hay promoción — `RECALCULATE_TIMEOUT_BUDGET` exige rehacer la cascada con evidencia, no inventar el flag.",
        retrospective:
          "Sin flag de cierre no se asume lifecycle sano. El error clásico es 500 genérico y pool abierto. Pregunta: ¿por qué el error lleva `trace_id` y no email?",
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
assert results == ["CONTINUE", "CANCEL_AND_CLOSE", "RECALCULATE_TIMEOUT_BUDGET"]

` ,
          output: `CONTINUE CANCEL_AND_CLOSE RECALCULATE_TIMEOUT_BUDGET` ,
        },
      },
      {
        id: "S41-T4-A-E1",
        subtopicId: "S41-T4-A",
        kind: "guided",
        title: "Mapear seed al nivel de test",
        preamble:
          "- **Contexto:** en `CASO-ARE-041-4A` siembras un bug de dominio o de HTTP y exiges que el nivel correcto lo detecte.\n- **Meta:** `level_detects` (domain→unit, http→contract, adapter→integration) y `pyramid_ok` con unit ≥ contract ≥ integration.\n- **Éxito:** asserts de seeds y pirámides; imprime `S41-T4-A PASS`.\n- **Límites:** no dejes siempre True; no inviertas la forma de la pirámide.",
        instruction:
          "S41-T4-A-E1 · Salida: debe devolver el PASS del contrato. 1. Mapea seed→nivel y compara igualdad.\n2. `pyramid_ok` = cadena de conteos.\n3. Conserva asserts positivos y el caso 2,5,12 False.\n4. Print final PASS.",
        hint: "Mapea domain→unit, http→contract, adapter→integration. No dejes que integration sea el único colador de un bug de status.",
        hints: [
          "Mapea domain→unit, http→contract, adapter→integration. No dejes que integration sea el único colador de un bug de status.",
          "pyramid_ok comprueba la forma de la pirámide en conteos, no solo que existan tres strings.",
        ],
        edgeCases: ["Falta seeded_failure_detected", "Fixture adverso: una sola capa o fallo sembrado no detectado", "CASO-ARE-041-4A es sintético"],
        tests: "seeds correctos/incorrectos y pirámide 12≥5≥2; imprime `S41-T4-A PASS`.",
        feedback:
          "El nivel correcto localiza el diseño roto: domain→unit, http→contract. Una pirámide invertida o “siempre True” no atrapa un 200 en create. E2 usa `BLOCK_UNTESTED_CONTRACT` si falta capa o seed no se detecta.",
        retrospective:
          "Seed + nivel correcto es la red de seguridad del contrato. El error clásico es pirámide invertida (más integration que unit). Siguiente (E2): assess de capas y seed detectado.",
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
print("S41-T4-A", "PASS")

meets_contract = pyramid_ok(12, 5, 2) and not pyramid_ok(2, 5, 12)
` ,
          output: `S41-T4-A PASS` ,
        },
      },
      {
        id: "S41-T4-A-E2",
        subtopicId: "S41-T4-A",
        kind: "independent",
        title: "Auditar pirámide y seed atrapado",
        preamble:
          "- **Contexto:** tres reportes de test plan: pirámide completa con seed atrapado; solo unit sin seed; flag de seed ausente.\n- **Meta:** `assess` → PASS si layers incluyen unit/contract/integration y todos los flags; si no `BLOCK_UNTESTED_CONTRACT`; missing ⇒ `MISSING:seeded_failure_detected`.\n- **Éxito:** `PASS BLOCK_UNTESTED_CONTRACT MISSING:seeded_failure_detected`.\n- **Límites:** no apruebes una sola capa; no inventes seed detectado.",
        instruction:
          "S41-T4-A-E2 · Salida: debe devolver el PASS del contrato. 1. Invierte el predicado (hoy PASS con layers==1 y seed False).\n2. PASS con subset de capas y all(flags).\n3. Missing-first.\n4. Print de tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a seeded_failure_detected debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a seeded_failure_detected debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T4-A: tres niveles y fallo sembrado detectado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta seeded_failure_detected", "Fixture adverso: una sola capa o fallo sembrado no detectado", "CASO-ARE-041-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `seeded_failure_detected` ausente y produce exactamente `PASS BLOCK_UNTESTED_CONTRACT MISSING:seeded_failure_detected`.",
        feedback:
          "Tres capas + seed atrapado ⇒ PASS: hay red de seguridad demostrable. Una sola capa o seed invisible ⇒ `BLOCK_UNTESTED_CONTRACT`. Sin `seeded_failure_detected` no hay evidencia de que el colador funciona.",
        retrospective:
          "Una sola capa unit no demuestra el contrato HTTP: un 200 en create puede pasar desapercibido. Sin `seeded_failure_detected` no hay prueba de que el colador funciona aunque la pirámide “tenga tres nombres”. Pregunta: ¿qué bloqueas en el merge si el seed http no se atrapa? Luego (E3): tokens de test plan.",
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
        title: "Test plan: bloquear o añadir nivel",
        preamble:
          "- **Contexto:** antes de promover el control plane, el test plan debe atrapar seeds en el nivel correcto o bloquear el merge.\n- **Meta:** `decide` fail-closed.\n- **Éxito:** `CONTINUE BLOCK_UNTESTED_CONTRACT ADD_MISSING_TEST_LEVEL`.\n- **Límites:** sin flag de seed no asumas cobertura; tokens de lab.",
        instruction:
          "S41-T4-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing ⇒ `ADD_MISSING_TEST_LEVEL`.\n2. CONTINUE con predicado sano.\n3. Resto ⇒ `BLOCK_UNTESTED_CONTRACT`.\n4. Conserva el assert.",
        hint: "Sin seeded_failure_detected ⇒ ADD_MISSING_TEST_LEVEL. CONTINUE exige shape de pirámide y seed detectado en el nivel correcto.",
        hints: [
          "Sin seeded_failure_detected ⇒ ADD_MISSING_TEST_LEVEL. CONTINUE exige shape de pirámide y seed detectado en el nivel correcto.",
          "Una sola capa o seed no atrapado ⇒ BLOCK_UNTESTED_CONTRACT.",
        ],
        edgeCases: ["Falta seeded_failure_detected", "Fixture adverso: una sola capa o fallo sembrado no detectado", "CASO-ARE-041-4A es sintético"],
        tests: "Fixtures `CASO-ARE-041-4A`, adverso y sin `seeded_failure_detected` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "En test plan: `BLOCK_UNTESTED_CONTRACT` si la pirámide no atrapa el seed (un e2e solo no basta para localizar un 200 en create). Sin `seeded_failure_detected` no hay evidencia — `ADD_MISSING_TEST_LEVEL`.",
        retrospective:
          "Un contrato sin red de seguridad no se promueve. El error clásico es “tenemos un e2e”. Pregunta: ¿qué nivel atrapa un 200 en create sembrado?",
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
assert results == ["CONTINUE", "BLOCK_UNTESTED_CONTRACT", "ADD_MISSING_TEST_LEVEL"]

` ,
          output: `CONTINUE BLOCK_UNTESTED_CONTRACT ADD_MISSING_TEST_LEVEL` ,
        },
      },
      {
        id: "S41-T4-B-E1",
        subtopicId: "S41-T4-B",
        kind: "guided",
        title: "429 recuperable y log sin PII",
        preamble:
          "- **Contexto:** en `CASO-ARE-041-4B` la cuota sintética es 100; la traza `tr-are-041` no debe llevar email.\n- **Meta:** `admit(used, limit)` y `log_fields` con ban-set.\n- **Éxito:** remaining 27 bajo cuota; 429 over-limit; log sin email; imprime `S41-T4-B PASS`.\n- **Límites:** no dejes siempre 200; no inventes remaining en 429; no loguees PII.",
        instruction:
          "S41-T4-B-E1 · Salida: debe devolver el PASS del contrato. 1. Si used > limit ⇒ 429 + retry_after_s.\n2. Si no ⇒ 200 + remaining = limit - used.\n3. log_fields filtra email/dni/secret.\n4. Conserva los asserts.",
        hint: "429 es recuperable: incluye retry_after_s. Redacta con ban-set antes de imprimir/loguear.",
        hints: [
          "429 es recuperable: incluye retry_after_s. Redacta con ban-set antes de imprimir/loguear.",
          "remaining = limit - used solo cuando admites; no inventes remaining negativo en 429.",
        ],
        edgeCases: ["Falta pii_in_log", "Fixture adverso: over-limit, consumer roto o PII en log", "CASO-ARE-041-4B es sintético"],
        tests: "allow con remaining, 429 over-limit, log sin email; imprime `S41-T4-B PASS`.",
        feedback:
          "429 es señal recuperable (con `retry_after_s`), no un 500 opaco. Redaction del log es parte del contrato de observabilidad: el email no sale. E2 usa `THROTTLE_AND_REDACT` si over-limit o PII en log.",
        retrospective:
          "Remaining solo existe en allow; en 429 la señal útil es `retry_after_s`, no un remaining negativo. Redaction del log es parte del contrato de observabilidad, no un “extra de seguridad”. Pregunta: si used=110, ¿qué status y qué campo debe ver el cliente? Siguiente (E2): assess de consumer, cuota y pii_in_log.",
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
print("S41-T4-B", "PASS")

meets_contract = b["status"] == 429 and "email" not in logged
` ,
          output: `S41-T4-B PASS` ,
        },
      },
      {
        id: "S41-T4-B-E2",
        subtopicId: "S41-T4-B",
        kind: "independent",
        title: "Auditar cuota, consumer y redaction",
        preamble:
          "- **Contexto:** tres telemetrías de edge: consumer v1 + cuota sana + log limpio; over-limit + consumer roto + PII; flag pii ausente.\n- **Meta:** `assess` — PASS si consumer pasa, used en rango, trace con prefijo `tr-` y no pii; si no `THROTTLE_AND_REDACT`; missing ⇒ `MISSING:pii_in_log`.\n- **Éxito:** `PASS THROTTLE_AND_REDACT MISSING:pii_in_log`.\n- **Límites:** no apruebes over-limit ni PII en log; no inventes el flag.",
        instruction:
          "S41-T4-B-E2 · Salida: debe devolver el PASS del contrato. 1. Invierte el predicado (hoy PASS con over-limit o pii).\n2. PASS con el conjunto sano del fixture válido.\n3. Missing-first.\n4. Print de tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a pii_in_log debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a pii_in_log debe ocurrir antes de esa rama.",
          "Después aplica la regla de S41-T4-B: consumer v1, cuota y trace redactado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta pii_in_log", "Fixture adverso: over-limit, consumer roto o PII en log", "CASO-ARE-041-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `pii_in_log` ausente y produce exactamente `PASS THROTTLE_AND_REDACT MISSING:pii_in_log`.",
        feedback:
          "Compat + cuota + privacidad se evalúan juntos en el edge: consumer v1, used en rango y log sin PII ⇒ PASS. Over-limit o PII en log ⇒ `THROTTLE_AND_REDACT`. Sin flag `pii_in_log` no asumas redaction.",
        retrospective:
          "El edge del gate CP-N4-A no se juzga por un solo número: consumer v1 roto con cuota “OK” sigue siendo breach. Sin flag `pii_in_log` no asumas redaction. Pregunta: ¿por qué el valid exige `trace_id` con prefijo `tr-`? Luego (E3): tokens del gate.",
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
        title: "Gate edge: throttle o inspeccionar",
        preamble:
          "- **Contexto:** cierre del gate CP-N4-A en el edge: cuota, consumer v1 y redaction deben demostrarse o el flujo se bloquea/inspecciona.\n- **Meta:** `decide` fail-closed.\n- **Éxito:** `CONTINUE THROTTLE_AND_REDACT INSPECT_COMPATIBILITY`.\n- **Límites:** sin `pii_in_log` no asumas redaction; tokens de lab, no enums de prod.",
        instruction:
          "S41-T4-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing ⇒ `INSPECT_COMPATIBILITY`.\n2. CONTINUE con predicado sano.\n3. Resto ⇒ `THROTTLE_AND_REDACT`.\n4. Conserva el assert.",
        hint: "Sin pii_in_log ⇒ INSPECT_COMPATIBILITY. CONTINUE exige old_consumer_passes, used≤limit y pii_in_log False.",
        hints: [
          "Sin pii_in_log ⇒ INSPECT_COMPATIBILITY. CONTINUE exige old_consumer_passes, used≤limit y pii_in_log False.",
          "used>limit, consumer roto o PII en log ⇒ THROTTLE_AND_REDACT.",
        ],
        edgeCases: ["Falta pii_in_log", "Fixture adverso: over-limit, consumer roto o PII en log", "CASO-ARE-041-4B es sintético"],
        tests: "Fixtures `CASO-ARE-041-4B`, adverso y sin `pii_in_log` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "En el gate edge CP-N4-A: `THROTTLE_AND_REDACT` ante over-limit o PII (recuperable y limpio). Sin `pii_in_log` no se asume redaction — `INSPECT_COMPATIBILITY` exige revisar consumer v1 y traza antes de promover.",
        retrospective:
          "El edge no se promueve a ciegas: sin evidencia de redaction se inspecciona. El error clásico es silenciar el 429 o loguear email. Pregunta de puente: ¿qué tres piezas ensambla el You Do de esta sección?",
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
assert results == ["CONTINUE", "THROTTLE_AND_REDACT", "INSPECT_COMPATIBILITY"]

` ,
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
      "Demostrar el gate CP-N4-A: la misma clave + el mismo body no duplica efectos; la lectura conserva campos estables v1.",
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
    # DEFECT de lab: valida, pero ignora Idempotency-Key e inserta siempre (duplica side effects).
    # Completa el mapa de idempo (store key -> body):
    #   - key conocida + mismo body canónico ⇒ ("replay", job ya guardado)
    #   - key conocida + body distinto ⇒ ("conflict", error tipado sin segundo append)
    #   - key nueva => crea job, guarda en idempo, un solo side effect en jobs
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
    portfolioNote: "Evidencia de CP-N4-A · API HTTP gobernada: implementa create/replay/conflict y validación hasta que readiness() imprima READY (CASE_ID + READY; missing vacío). No fuerces flags booleanos: los asserts miden el comportamiento. Enlace opcional: reescribe el lab con FastAPI + TestClient usando los recursos de la sección.",
    rubric: [
      { criterion: "Corrección técnica del contrato y del gate (create/replay/conflict + status).", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación.", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege (sin PII/secretos en response).", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia.", weight: "15%" },
      { criterion: "Operación: observabilidad (trace) y rollback mental.", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites (stdlib vs. FastAPI).", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con `readiness()` (un side effect, replay, conflict, 422, sin secret, GET 200)? (2) ¿qué harías distinto con PII real vs. sintético de Arequipa? (3) En el README, una frase de impacto medible (antes: create duplicaba; después: key+body ⇒ un job) defendible en 30 segundos. Siguiente en S42: authz, schemas estrictos y privacidad de servicios sobre este control plane.",
  },
  selfCheck: {
    questions: [
      {
        question: "En un POST de creación exitosa con cuerpo del nuevo job, ¿qué status semántico corresponde?",
        options: ["201", "200", "204", "202 siempre, aunque el job sea síncrono y ya exista el recurso"],
        correctIndex: 0,
        explanation: "201 Created comunica que se creó un recurso; 200 es lectura u OK genérico y confunde el contrato OpenAPI del create.",
      },
      {
        question: "Si reenvías la misma Idempotency-Key con un body distinto al original, el servicio debe…",
        options: ["crear un segundo job en silencio", "ignorar el body y siempre hacer replay", "devolver conflicto / error de idempotencia sin segundo side effect", "responder 200 vacío"],
        correctIndex: 2,
        explanation: "La clave liga un hash canónico del request; body distinto es conflicto, no replay ni segundo create.",
      },
      {
        question: "La vista pública de un job y el OpenAPI deben…",
        options: ["incluir `internal_key` y `db_pk` para depurar en producción", "devolver el body crudo del request para maximizar fidelidad", "omitir el status HTTP; el cliente lo infiere del body", "exponer solo campos del contrato (p. ej. name, priority, job_id, status) y coincidir con status/shape reales"],
        correctIndex: 3,
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
        options: ["devolver created en la primera y replay en la segunda sin segundo efecto", "crear dos jobs distintos para maximizar throughput", "borrar la key tras el primer request", "responder 500 para forzar reintento del cliente"],
        correctIndex: 0,
        explanation: "Idempotencia liga key+hash al resultado: el segundo request reusa la respuesta almacenada y no duplica side effects.",
      },
      {
        question: "En un diseño con dependency injection, el path operation del POST de jobs debe…",
        options: ["abrir la conexión SQL, aplicar reglas de negocio y devolver status codes desde el dominio", "importar `Request` dentro de `create_job` para leer headers", "orquestar: resolver dependencias (`get_store`/`Depends`), llamar al dominio puro y devolver la vista HTTP", "duplicar la lógica de store en cada ruta para evitar fakes en tests"],
        correctIndex: 2,
        explanation: "El handler es delgado: Depends inyecta el store; el dominio no conoce HTTP. Así se puede sustituir el store por un fake en tests de contrato.",
      },
      {
        question: "Un score CPU-bound o un job durable que debe sobrevivir al request se modela mejor como…",
        options: ["`await` largo en el event loop del path operation", "un `print` en el handler y confiar en que el proceso no se reinicie", "siempre 200 síncrono aunque el cálculo tarde minutos", "trabajo en background/worker con cola o store durable y respuesta `queued` si aplica"],
        correctIndex: 3,
        explanation: "Async ayuda a I/O wait; CPU y trabajo durable salen del request hacia un boundary de background con persistencia confiable.",
      },
      {
        question: "Si `used > limit` en el rate limiter del control plane, la respuesta HTTP esperada es…",
        options: ["500 con el stack del bucket", "429 con señal recuperable (p. ej. `retry_after_s`), sin PII en el body", "200 con `remaining` negativo", "204 sin cuerpo para ahorrar ancho de banda"],
        correctIndex: 1,
        explanation: "429 comunica límite excedido de forma recuperable; no se disfraza de 500 ni se loguea email/DNI en la traza del rechazo.",
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
        note: "Contrato interoperable de API",
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
        note: "Riesgos de API y fail-closed",
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
