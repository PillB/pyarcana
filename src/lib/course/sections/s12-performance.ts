import type { CourseSection } from '../../types'

export const section12: CourseSection = {
  id: "performance",
  index: 12,
  title: "APIs, SQL y geodatos responsables",
  shortTitle: "APIs · SQL · Geo",
  tagline: "HTTP resiliente, SQL parametrizado, geocoding autorizado y adaptadores limitados sin PII bancaria a servicios públicos",
  estimatedHours: 19,
  level: "Intermedio",
  phase: 0,
  icon: "MapPin",
  accentColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
  jobRelevance:
    "En onboarding (el alta de un cliente), compliance (el cumplimiento de normas) y data quality en bancos, fintech y retail del Perú, el pipeline no empieza en el dashboard: empieza en adaptadores HTTP resilientes (piezas que hablan con un servidor web y resisten caídas) que leen señales con timeout y retry selectivo, en un SQLite local parametrizado (que evita inyección de SQL) y en geoevidencia controlada sin filtrar PII bancaria a geocoders públicos. Un analista que hardcodea el token, reintenta un error 400 o manda un document_id a un proveedor gratis quema cuota, rompe auditoría y expone datos. Aquí aprendes a hacer adquisición y geocoding con secretos fuera del código, joins con placeholders y datos sintéticos.",
  learningOutcomes: [
    { text: "Consumir API HTTP síncronas, interpretar status y parsear JSON con errores controlados" },
    { text: "Implementar timeout obligatorio, paginación y retry/backoff solo en errores transitorios" },
    { text: "Autenticar con secretos fuera de código, cachear GET seguros y registrar provenance" },
    { text: "Escribir contract tests del adaptador y fallback degradado offline" },
    { text: "Diseñar esquema SQLite mínimo y ejecutar CRUD + join entidades/evidencias" },
    { text: "Usar queries parametrizadas, transacciones, constraints e índices; prohibir f-string SQL" },
    { text: "Normalizar direcciones sintéticas y usar solo geocoder autorizado/mock" },
    { text: "Evaluar calidad de coordenadas, Haversine y caché bajo política de proveedor" },
  ],
  theory: [
    {
            heading: "El primer dato que no controlas",
      paragraphs: [
        "Todo lo que has leído hasta ahora venía de un archivo tuyo, en tu disco, con el contenido que tú pusiste. Un servicio externo no funciona así: no te debe nada. Puede tardar diez segundos, puede responder que está saturado, puede devolver el campo que esperabas con otro nombre, y puede estar caído justo el día de la demostración. La sección entera trata de escribir código que siga siendo honesto cuando eso pasa.",
        "La primera herramienta es leer la respuesta antes que el contenido. Todo servicio web contesta con un **código de estado**, un número de tres cifras que resume qué ocurrió: los 200 son éxito, los 400 significan que el pedido estaba mal formulado, los 500 que el problema es del otro lado. Esa distinción decide la acción. Si el error es tuyo, reintentar es inútil; si es del servidor y probablemente pasajero —el 429 «vas muy rápido» o el 503 «vuelve luego»—, reintentar tiene sentido, esperando un poco más en cada intento para no empeorar la congestión.",
        "La segunda es no esperar para siempre. Cada pedido lleva un **timeout**, un tiempo máximo de espera; sin él, un servicio que no responde no da error, simplemente cuelga tu programa hasta que alguien lo mata. Y cuando la respuesta llega, se guarda junto con su **procedencia**: de qué dirección vino, cuándo, con qué código de estado y si salió de la caché. Sin ese rastro, dentro de un mes tendrás un número en una tabla y ninguna forma de saber de dónde salió.",
        "Los datos que traigas hay que guardarlos, y ahí aparece la regla más importante de la sección. Una consulta SQL se arma con marcadores de posición —el `?` que deja el hueco— y nunca pegando texto del usuario dentro de la consulta. La razón es concreta: si el nombre pegado incluye comillas y un fragmento de SQL, la base de datos lo obedece. Un marcador de posición convierte ese texto en un valor y no en una instrucción.",
        "La última pieza es geográfica y también ética. Calcular la distancia entre dos puntos es una señal más para un puntaje de relación, nada más: la cercanía no prueba parentesco ni fraude. Y antes de mandar cualquier dato a un servicio de terceros hay que decidir explícitamente qué campos pueden salir de tu sistema —la ciudad sí, la dirección exacta y el número de cuenta no.",
        "La pregunta que te acompaña es doble y hay que poder contestar las dos partes: **¿de dónde salió este dato, y qué hace mi programa cuando el servicio no responde?** Si la segunda respuesta es «no sé», todavía no está terminado. Medir el rendimiento y ejecutar varias tareas a la vez son temas del tramo de sistemas; aquí basta con un cliente síncrono que se porte bien.",
      ],
      callout: {
        type: "info",
        title: "Qué entregas al final de S12",
        content:
          "Un adaptador HTTP + almacén SQLite + geocoder mock con provenance y política de egress. Gate: status→acción N1, join de caso y geoseñal Lima–Callao con disclaimer. Datos sintéticos únicamente; nunca PII real ni tokens en logs.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, vocabulario y criterio de cierre.",
        "**Orden de los subtemas.** T1 cubre HTTP: códigos de estado, JSON, timeout, paginación y reintentos. T2 trata autenticación, caché y contratos: secretos en variables de entorno, procedencia y salida de emergencia sin red. T3 pasa a SQL: altas y consultas, uniones, marcadores de posición y transacciones. T4 cierra con geodatos responsables: normalización, política de salida de datos y distancia como señal.",
        "**Vocabulario que se usa a lo largo de la sección.** *Reintento con espera creciente*: repetir solo los errores pasajeros, esperando cada vez más. *Procedencia*: los metadatos del pedido (dirección de origen, fecha, código de estado, si vino de caché), nunca los secretos. *Salida de datos*: qué campos pueden abandonar tu sistema hacia un servicio externo. *Geocodificador simulado*: un sustituto local del proveedor real, para no mandar datos a nadie durante la práctica. *Falla cerrada*: si el contrato no se cumple, el programa se detiene en lugar de inventar filas o coordenadas.",
        "**Criterio de cierre.** Un adaptador con reintento selectivo según el código de estado, una unión local del caso en SQLite y una señal geográfica documentada con su advertencia.",
        "**Límites.** Solo datos sintéticos latinoamericanos. Nunca tokens en los registros, nunca datos bancarios hacia servicios públicos, nunca afirmaciones automáticas de parentesco o fraude.",
      ],
     },
     {
      heading: "requests/responses, status y JSON",
      subtopicId: "S12-T1-A",
      paragraphs: [
        "Un cliente HTTP síncrono (que espera la respuesta antes de seguir) hace **GET/POST** (los verbos de pedir y enviar datos), recibe un **status code** y un cuerpo (a menudo JSON, el formato de texto para datos en la web). En este curso usamos un **cliente mock** (una simulación que reemplaza al proveedor real) o `urllib` con fixtures (datos de prueba fijos): la pedagogía es **status primero, body después**, no pelear con la librería de red del día. Si el status no es 2xx, no asumas que el JSON “tiene sentido” — un 404 puede traer un mensaje de error o un cuerpo vacío.",
        "**2xx** = éxito; **4xx** = error del cliente (no reintentes a ciegas: el id o el payload — los datos que enviaste — están mal); **5xx** = error del servidor. En N1 (la política de nivel 1 del curso) el retry selectivo se limita a **429** y **503** (más timeouts de red); un **500** se registra como `fail_server` y no se reintenta a ciegas en los ejercicios (en producción a veces sí se reintenta con límite, pero aquí forzamos selectividad). Parsea (interpreta el cuerpo) con manejo de cuerpo vacío o JSON inválido: un `json.JSONDecodeError` es **fail-closed** (falla cerrado), no un dict inventado.",
        "**Timeout es obligatorio** (lo modelamos en T1-B): en un cliente real siempre pasas `timeout=` (segundos); sin él un socket colgado (una conexión TCP que no responde ni cierra) congela el pipeline de CP-N1-C. Headers (`Accept`, `User-Agent`) (encabezados del request HTTP) documentan el contrato del adaptador. Caso sintético `CASO-LIM-012`: store `{\"C001\": {...}}` → 200 con keys `id/region/score` o 404 con body `error`; cuerpo basura → `parse_json_body` devuelve `None`. **Qué observar en el demo:** status y body van juntos en la tupla de respuesta (una pareja de valores); el parse inválido no inventa claves."
      ],
      code: {
        language: 'python',
        title: "mock_http_status.py",
        code: `import json

class MockResponse:
    def __init__(self, status_code, payload=None, text=None):
        self.status_code = status_code
        self._payload = payload
        self.text = text if text is not None else (
            json.dumps(payload) if payload is not None else ""
        )
    def json(self):
        return self._payload

def get_entity(store, entity_id):
    if entity_id not in store:
        return MockResponse(404, {"error": "not_found"})
    return MockResponse(200, store[entity_id])

def parse_json_body(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None  # fail-closed: no inventar dict

store = {"C001": {"id": "C001", "region": "Lima", "score": 0.8}}
ok = get_entity(store, "C001")
miss = get_entity(store, "C999")
print("200 keys:", sorted(ok.json().keys()), "status", ok.status_code)
print("404 status", miss.status_code, "body", miss.json())
print("bad_json", parse_json_body("{not-json"))
print("good_json", parse_json_body('{"id":"C001"}'))`,
        output: `200 keys: ['id', 'region', 'score'] status 200
404 status 404 body {'error': 'not_found'}
bad_json None
good_json {'id': 'C001'}`,
      },
      callout: {
        type: "tip",
        title: "Regla de status (política N1)",
        content:
          "Traduce status → acción: 200 use_body, 404 missing, 429/503 retry, 400 fix_client, 500 fail_server. No asumas siempre 200; no reintentes 4xx de cliente.",
      },
    },
    {
      heading: "Timeout, paginación, retry/backoff y rate limit",
      subtopicId: "S12-T1-B",
      paragraphs: [
        "Ya sabes leer status y JSON; ahora el adaptador no se cuelga ni se come mil filas de un golpe. **Timeout** acota la espera por request. En un cliente real pasas siempre `timeout=` (p. ej. `urlopen(req, timeout=5)` o el equivalente del SDK); aquí lo modelamos como `cost_s` (el costo simulado) frente a `timeout_s` (el límite) para tests deterministas (que dan siempre el mismo resultado) sin red. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez al heap (la memoria del proceso) — crítico cuando el proveedor lista miles de señales sintéticas para el caso.",
        "**Retry/backoff** (reintento con espera) solo en errores **transitorios**: **429**, **503** y timeouts de red en este curso (**política N1**). Otros **5xx** pueden reintentarse en producción con límite, pero el contrato de ejercicios usa `{429, 503}` para forzar selectividad. Un **400** o **404** no se reintenta: reintentar no repara un id mal formado. Respeta `Retry-After` (el encabezado que dice cuánto esperar) cuando exista y un **max_retries** duro (tope de intentos, p. ej. 3). La función `should_retry` y la tabla `status_action` deben contar la misma historia.",
        "Rate limit (cuota del proveedor): duerme entre páginas o respeta cuotas. En demo usamos contador de delays en lugar de `time.sleep` real para tests deterministas (que dan siempre el mismo resultado). Caso sintético: páginas 1→2→3 con `next` y `rate_limit_pauses == 2`; cuando **`next is None`**, dejas de pedir la siguiente página. **Qué observar:** el bucle termina por contrato del proveedor, no por un contador mágico de “siempre 3 páginas”."
      ],
      code: {
        language: 'python',
        title: "paginate_rate.py",
        code: `pages = {
    1: {"items": ["s1", "s2"], "next": 2},
    2: {"items": ["s3"], "next": 3},
    3: {"items": ["s4"], "next": None},
}

def fetch_page(n, timeout=5.0):
    # timeout= modela el parámetro obligatorio del cliente real
    assert timeout > 0
    return pages[n]

all_items = []
page = 1
delays = 0
while page is not None:
    data = fetch_page(page, timeout=5.0)
    all_items.extend(data["items"])
    page = data["next"]
    if page is not None:
        delays += 1  # simula rate-limit sleep
print("items", all_items, "rate_limit_pauses", delays)`,
        output: `items ['s1', 's2', 's3', 's4'] rate_limit_pauses 2`,
      },
      callout: {
        type: "warning",
        title: "No reintentes 400",
        content:
          "Retry ciego en 4xx de cliente amplifica abuso y no arregla el request. En N1: reintenta solo 429 y 503.",
      },
    },
    {
      heading: "Auth, secretos, caché y provenance",
      subtopicId: "S12-T2-A",
      paragraphs: [
        "Con el cliente resiliente en T1, el siguiente riesgo profesional es filtrar el secreto. Autenticación **Bearer** (o basic) lee el token de **variable de entorno** (una configuración del sistema operativo, no del código) o de un secret store (un almacén de secretos), nunca hardcodeado (pegado en el repo) ni en un notebook compartido. Si falta `API_TOKEN`, **falla cerrado** con mensaje claro — no envíes requests anónimos “por si acaso” ni uses un token de demo pegado en el código que mañana se commitea (se sube al repositorio).",
        "**Caché de GET** por hash de URL (o la URL misma en demos) con **TTL** reduce costo y latencia; no caches respuestas de escritura ni PII sin política. Invalida o no reutilices si el status no fue 2xx. El segundo hit al mismo URL debe marcar `cache_hit=True` sin volver a “pegarle” al mock.",
        "**Provenance (traza de origen)**: cada fetch deja `source_url`, `fetched_at`, `status_code`, `cache_hit` (y a veces `body_sha12` o `auth_scheme`). **Nunca loguees (imprimas en el log) el token** ni el header Authorization: solo un booleano `token_present` o la longitud. Caso sintético: segundo `cached_get` a `https://api.example.com/signals` → `cache_hit=True`; el manifest de provenance no contiene la cadena del token. **Qué observar:** `token_len` sí; el valor del token, no."
      ],
      code: {
        language: 'python',
        title: "auth_cache_prov.py",
        code: `import os, hashlib, time, json

os.environ["API_TOKEN"] = "demo-token-not-real"

def get_token():
    tok = os.environ.get("API_TOKEN")
    if not tok:
        raise RuntimeError("API_TOKEN missing")
    return tok

CACHE = {}
def cached_get(url, ttl=60):
    key = hashlib.sha256(url.encode()).hexdigest()[:12]
    now = time.time()
    if key in CACHE and now - CACHE[key]["ts"] < ttl:
        return CACHE[key]["body"], True
    body = {"url": url, "ok": True}
    CACHE[key] = {"ts": now, "body": body}
    return body, False

token = get_token()
body, hit = cached_get("https://api.example.com/signals")
prov = {
    "source_url": "https://api.example.com/signals",
    "fetched_at": "2026-07-20T12:00:00Z",
    "cache_hit": hit,
    "auth": "bearer",
    # token NEVER in provenance dump
}
print("token_len", len(token))
print("cache_hit", hit)
print("provenance", json.dumps(prov, sort_keys=True))
body2, hit2 = cached_get("https://api.example.com/signals")
print("second_hit", hit2)`,
        output: `token_len 19
cache_hit False
provenance {"auth": "bearer", "cache_hit": false, "fetched_at": "2026-07-20T12:00:00Z", "source_url": "https://api.example.com/signals"}
second_hit True`,
      },
      callout: {
        type: "danger",
        title: "Secretos fuera de código",
        content:
          "No commits de .env con tokens reales. No imprimas Authorization headers.",
      },
    },
    {
      heading: "Contract tests y fallback",
      subtopicId: "S12-T2-B",
      paragraphs: [
        "Ya tienes secretos y provenance; ahora blindas el adaptador contra el schema (la forma del JSON) del proveedor. Un **contract test** (prueba de contrato) fija las claves obligatorias del JSON con un fixture (un dato de prueba fijo). Si el schema cambia (`lat` renombrado a `latitude`), el test falla **antes** de producción y del dashboard de S13 — mejor un assert rojo en CI que un mapa con huecos silenciosos.",
        "**Fallback degradado** (salida de emergencia): si 5xx o la red está caída, lee coordenadas precomputadas locales y marca `mode=offline` (o `offline_fallback`) en la provenance. No finjas éxito online: la traza debe decir la verdad al auditor. **Falla suave, traza dura** (*fail soft, trace hard*): el pipeline sigue con datos locales, pero no miente sobre el origen.",
        "Un feature flag (interruptor de configuración) offline permite demos reproducibles sin red — **obligatorio** en CP-N1-C y en entrevistas técnicas donde “demo con internet” falla. Caso sintético: `assert_contract` exige `{\"lat\",\"lon\",\"label\"}`; `geocode(..., online=True)` → `mode=online`; `online=False` → `mode=offline_fallback`. **Qué observar:** el contrato falla en falta de `lon`; el fallback no reescribe el modo a online."
      ],
      code: {
        language: 'python',
        title: "contract_fallback.py",
        code: `REQUIRED = {"lat", "lon", "label"}

def assert_contract(payload):
    missing = REQUIRED - set(payload)
    if missing:
        raise AssertionError(f"missing keys: {sorted(missing)}")
    return True

def geocode(addr, online=True):
    if online:
        # mock online ok
        return {"lat": -12.0464, "lon": -77.0428, "label": addr, "mode": "online"}
    return {"lat": -12.05, "lon": -77.04, "label": addr, "mode": "offline_fallback"}

fix = {"lat": -0.1807, "lon": -78.4678, "label": "Quito"}
print("contract", assert_contract(fix))
print("online", geocode("Lima", online=True)["mode"])
print("offline", geocode("Lima", online=False)["mode"])`,
        output: `contract True
online online
offline offline_fallback`,
      },
      callout: {
        type: "tip",
        title: "Falla suave, traza dura (fail soft, trace hard)",
        content:
          "El fallback no oculta el fallo: deja `mode=offline` y la razón en provenance (traza de origen). El auditor debe ver la verdad.",
      },
    },
    {
      heading: "Esquema, CRUD y joins",
      subtopicId: "S12-T3-A",
      paragraphs: [
        "Con el adaptador HTTP listo, las señales no viven solo en memoria del proceso: las **persistes** (las guardas en disco) para el caso. SQLite (el motor de base de datos en archivo) vía `sqlite3` basta para el almacén local de CP-N1-C: tablas `clients`, `transactions`, `evidence` (nombres alineados al dominio de S11). Archivo `:memory:` (base de datos en RAM, se borra al cerrar) en demos o `case.db` local — sin servidor remoto ni ORM (un mapeador objeto-relacional) en esta sección.",
        "CRUD = CREATE/INSERT/SELECT/UPDATE (DELETE con cuidado y soft-delete si hace falta auditoría). El **JOIN** une evidencias a entidades por `entity_id` (y transacciones por `client_id`) para armar la ficha del caso que el dashboard de S13 consumirá. Prefiere **SQL parametrizado** (marcadores posicionales) desde el primer INSERT: el hábito de parametrizar (usar marcadores en vez de f-strings) se aprende antes del ejercicio de inyección de T3-B.",
        "Empieza transacciones explícitas (BEGIN/COMMIT/ROLLBACK) cuando un caso toca varias filas; en T3-B profundizamos COMMIT/ROLLBACK e índices. Caso sintético: insert `C001` + evidence `geo` → JOIN devuelve `[('Ana Demo', 'geo')]`. **Qué observar:** el resultado es una lista de tuplas (nombre, kind), no un string suelto; el join falla en silencio solo si olvidaste el `entity_id` correcto."
      ],
      code: {
        language: 'python',
        title: "sqlite_join.py",
        code: `import sqlite3

def seed_and_join():
    con = sqlite3.connect(":memory:")
    con.executescript("""
CREATE TABLE clients (id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE evidence (id TEXT PRIMARY KEY, entity_id TEXT, kind TEXT, payload TEXT);
""")
    con.execute("INSERT INTO clients VALUES (?, ?)", ("C001", "Ana Demo"))
    con.execute(
        "INSERT INTO evidence VALUES (?, ?, ?, ?)",
        ("E1", "C001", "geo", '{"lat": -12.04}'),
    )
    rows = con.execute(
        "SELECT c.name, e.kind FROM clients c JOIN evidence e ON c.id = e.entity_id"
    ).fetchall()
    con.close()
    return rows

print(seed_and_join())`,
        output: `[('Ana Demo', 'geo')]`,
      },
      callout: {
        type: "tip",
        title: "FKs lógicas primero",
        content:
          "Documenta `entity_id` aunque no actives `FOREIGN KEY` en SQLite; la integridad empieza en el modelo. Usa SQL parametrizado (con marcadores posicionales en el código) desde el primer INSERT.",
      },
    },
    {
      heading: "Parámetros, transacciones, constraints e índices",
      subtopicId: "S12-T3-B",
      paragraphs: [
        "El join de T3-A asume datos limpios; ahora blindas integridad e inyección. Usa placeholders `?` (o `:name` con `Connection.row_factory`). **Prohibido** armar SQL con f-strings de input de usuario: es el camino clásico a la inyección SQL (según OWASP, el proyecto abierto de seguridad web) aunque “solo sea un id sintético”. El input `C001' OR '1'='1` no debe devolver filas ajenas.",
        "`executemany` (ejecutar varios inserts de golpe) + `BEGIN`/`COMMIT` hacen batch **atómico** (todo o nada); un `UNIQUE` roto → `ROLLBACK` (deshacer) y `COUNT(*)==0`. No dejes la DB a medias con 2 de 3 inserts “casi ok”: en compliance, un estado parcial es peor que un fallo ruidoso. Reporta la fila ofensora en el log de aplicación, no en el SQL interpolado.",
        "`UNIQUE`/`NOT NULL` (restricciones de SQL) e **índices** (estructuras que aceleran búsquedas) en `document_id` / `entity_id` aceleran lookups (búsquedas por clave) del caso y documentan el modelo. Caso sintético: batch `C001/D-100`, `C002/D-200`, `C003/D-100` (duplicado) → status `rolled_back` y count `0`. **Qué observar en el demo:** la tupla `('rolled_back', 0)` es la promesa de atomicidad; si ves count `2`, olvidaste el rollback."
      ],
      code: {
        language: 'python',
        title: "params_tx.py",
        code: `import sqlite3

def try_batch_unique_doc():
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE clients (id TEXT PRIMARY KEY, document_id TEXT UNIQUE NOT NULL)")
    con.execute("CREATE INDEX idx_doc ON clients(document_id)")
    try:
        con.execute("BEGIN")
        con.executemany(
            "INSERT INTO clients(id, document_id) VALUES (?, ?)",
            [("C001", "D-100"), ("C002", "D-200"), ("C003", "D-100")],
        )
        con.commit()
        status = "committed"
    except sqlite3.IntegrityError:
        con.rollback()
        status = "rolled_back"
    n = con.execute("SELECT COUNT(*) FROM clients").fetchone()[0]
    con.close()
    return status, n

print(try_batch_unique_doc())`,
        output: `('rolled_back', 0)`,
      },
      callout: {
        type: "danger",
        title: "f-string SQL = vulnerabilidad",
        content:
          "Nunca interpoles input en SQL. Usa siempre marcador positional y tupla de params.",
      },
    },
    {
      heading: "Normalización y geocoding autorizado",
      subtopicId: "S12-T4-A",
      paragraphs: [
        "Con HTTP y SQL listos, la geoevidencia cierra el incremento CP-N1-C — pero con ética de egress (cuidado con qué datos salen). Normaliza direcciones sintéticas: **trim + colapsar espacios** (contrato N1). El title-case es política opcional del proveedor; en los ejercicios de S12 **no** lo exijas a menos que el enunciado lo pida (el mock puede usar `.title()` solo para la **clave de lookup** de ciudad). No inventes campos (distrito, ubigeo) que no vinieron en el payload (los datos que envía el proveedor): el invento silencioso contamina la geoevidencia y el score de S13.",
        "Solo **geocoder autorizado/mock**. Política del curso: **no envíes PII bancaria** (docs, cuentas, montos, nombres completos si la política lo prohíbe) a proveedores públicos gratuitos. El payload mínimo es ciudad/dirección sintética autorizada. **Egress (salida de datos)** hacia un proveedor externo se gobierna con allowlist de claves: `ALLOWED = {\"address\", \"city\", \"country\"}`. Si aparece `document_id`, `allowed_for_public_geocoder` devuelve `False`.",
        "`MockGeocoder` devuelve lat/lon fijos para las dos ciudades que tiene en su tabla, y así las demos offline son reproducibles; cualquier ciudad fuera de esa tabla → `None` (fail-closed). Caso sintético: `normalize_address(\"  av.  larco  123  \")` → `'av. larco 123'`; `geocode(\"lima\")` → coords de Lima (lookup con `.title()` solo en la clave). **Qué observar:** normalize no cambia capitalización; el geocode de ciudad desconocida no inventa un punto en el mapa."
      ],
      code: {
        language: 'python',
        title: "mock_geocode.py",
        code: `import re

def normalize_address(s: str) -> str:
    # Solo espacios: strip + colapsar. Title-case es opcional del proveedor.
    return re.sub(r"\\s+", " ", s.strip())

class MockGeocoder:
    TABLE = {
        "Lima": (-12.0464, -77.0428),
        "Quito": (-0.1807, -78.4678),
    }
    def geocode(self, city: str):
        key = city.strip().title()
        coords = self.TABLE.get(key)
        if not coords:
            return None
        lat, lon = coords
        return {"city": key, "lat": lat, "lon": lon, "provider": "mock"}

addr = normalize_address("  av.  larco  123  ")
geo = MockGeocoder().geocode("lima")
print("addr", addr)
print("geo", geo)`,
        output: `addr av. larco 123
geo {'city': 'Lima', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}`,
      },
      callout: {
        type: "warning",
        title: "Política de egress (salida de datos)",
        content:
          "Checklist: ¿el payload al proveedor incluye solo dirección/ciudad sintética autorizada? Si no, bloquea.",
      },
    },
    {
      heading: "Calidad de coordenada, Haversine, caché y política",
      subtopicId: "S12-T4-B",
      paragraphs: [
        "Tienes coords (coordenadas) del mock; antes de medir, valida **lat ∈ [-90, 90]** y **lon ∈ [-180, 180]**. Coordenadas inválidas (91°, NaN, strings) no entran al mapa ni al score de relación. Fail-closed: rechaza el par, no lo “corrige” a 0,0 (punto del Golfo de Guinea, frente a África, que los mapas usan como origen) — ese “arreglo” ha generado mapas absurdos en producción real.",
        "**Haversine** estima km entre dos puntos WGS84 con radio R=6371 km en este curso; sirve como **geoseñal de relación** en el score de matching, no como veredicto de parentesco o fraude. Empaqueta el resultado como `{\"type\": \"geo_distance_km\", \"value\": km, \"kinship_verdict\": None}` (o `verdict: None`). Documenta unidades (km) y el radio usado.",
        "Cachea geocodes bajo TTL (tiempo de vida del caché) o política del proveedor para no quemar cuota (misma idea de caché GET de T2-A). Distancia es **señal**, no kinship. Caso sintético: Lima–Callao ≈ **8.95 km** → alimenta `relationship_signal_score` (el score de relación de S13), jamás `is_family=True` automático. **Qué observar:** `valid True` / `invalid False` para (91, 0); el disclaimer `signal != kinship` no es adorno — es la línea ética del capstone."
      ],
      code: {
        language: 'python',
        title: "haversine_signal.py",
        code: `import math

def valid_coord(lat, lon):
    return -90 <= lat <= 90 and -180 <= lon <= 180

def haversine_km(a, b):
    R = 6371.0
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(h))

lima = (-12.0464, -77.0428)
callao = (-12.0500, -77.1250)
print("valid", valid_coord(*lima))
print("invalid", valid_coord(91, 0))
d = haversine_km(lima, callao)
print("km_approx", round(d, 2))
print("signal_only", "relationship_signal not kinship")`,
        output: `valid True
invalid False
km_approx 8.95
signal_only relationship_signal not kinship`,
      },
      callout: {
        type: "tip",
        title: "Distancia ≠ parentesco",
        content:
          "1.2 km entre entidades es geoseñal; jamás autoetiqueta is_family o fraude.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos locales del hilo CP-N1-C (la historia del capstone) en orden de pipeline (la cadena de pasos). El recorrido cubre:\n\n1. mock HTTP status→JSON\n2. paginación con rate-limit conceptual\n3. provenance sin token\n4. contract/fallback offline\n5. join de caso SQLite\n6. batch atómico con rollback\n7. MockGeocoder fail-closed\n8. Haversine Lima–Callao como geoseñal (no parentesco).\n\nLee `description` y `why` de cada demo: modelan el razonamiento del experto (status antes que body, traza honesta, atomicidad, ética geo) antes de los micro-defectos del We Do.",
    steps: [
      {
        demoId: "S12-T1-A-DEMO",
        subtopicId: "S12-T1-A",
        environment: "local-python",
        description: "Piensa en voz alta: el adaptador pide señales, mira el status primero y solo entonces parsea el JSON. Si el status no es 2xx, no confíes en el body. Observa count=2 y kinds shared_phone/geo — el mock fija el contrato sin red.",
        preamble:
          "Antes de tocar red real, el adaptador de señales del caso sintético `CASO-LIM-012` debe **leer el status y solo entonces** confiar en el JSON. En esta demo un `MockResponse` (un objeto que simula la respuesta HTTP sin internet) devuelve 200 con dos señales (`shared_phone`, `geo`) sin internet. No escribas aún: predice `status`, `count` y la lista de `kinds` (los tipos de señal), luego compara con la salida. Si el status no fuera 2xx, el body no sería «la verdad del caso».",
        code: {
          language: 'python',
          title: "list_signals_demo.py",
          code: `class MockResponse:
    def __init__(self, status_code, payload):
        self.status_code = status_code
        self._payload = payload
    def json(self):
        return self._payload

SIGNALS = [
    {"id": "S1", "entity_id": "C001", "kind": "shared_phone"},
    {"id": "S2", "entity_id": "C002", "kind": "geo"},
]

def list_signals():
    return MockResponse(200, {"items": SIGNALS, "count": len(SIGNALS)})

resp = list_signals()
# 1) status → acción; 2) solo si 2xx, parsea items
data = resp.json()
print("status", resp.status_code)
print("count", data["count"])
print("kinds", [x["kind"] for x in data["items"]])`,
          output: `status 200
count 2
kinds ['shared_phone', 'geo']`,
        },
        why:
          "El mock aísla el contrato status+JSON sin red externa: primero el código HTTP, después el parse. Ese orden evita consumir un body de error (404, 500) como si fueran items del caso. En el adaptador real el status decide la acción (`use_body`, `missing`, `retry`); el JSON solo importa si la acción es usar el cuerpo.",
        retrospective:
          "Si puedes explicar por qué miras `status_code` antes de `json()`, ya tienes el hábito del adaptador. El error clásico es asumir siempre 200. En We Do T1-A practicarás 200/404 y la tabla status→acción de la política N1.",
      },
      {
        demoId: "S12-T1-B-DEMO",
        subtopicId: "S12-T1-B",
        environment: "local-python",
        description: "Pipeline de paginación: while next no es None, acumula items y cuenta pausas de rate-limit (sin sleep real). Observa items del 1 al 5 y rate_limit_pauses=2: dos saltos de página, no tres sleeps al final.",
        preamble:
          "El proveedor lista señales en páginas; traer todo de un golpe llena memoria y quema cuota. Sigue la demo: el bucle avanza mientras `next` no es `None`, acumula items 1…5 y cuenta **pausas entre páginas** (no un sleep al final). Predice `items` y `rate_limit_pauses` antes de mirar la salida. Sin red real: el dict `API` es el contrato del proveedor.",
        code: {
          language: 'python',
          title: "paginate_demo.py",
          code: `def collect_pages(api):
    items = []
    page = 1
    pauses = 0
    while page is not None:
        chunk = api[page]
        items.extend(chunk["items"])
        page = chunk["next"]
        if page is not None:
            pauses += 1
    return items, pauses

API = {
    1: {"items": [1, 2], "next": 2},
    2: {"items": [3], "next": 3},
    3: {"items": [4, 5], "next": None},
}
items, pauses = collect_pages(API)
print("items", items)
print("pages_fetched", 3, "rate_limit_pauses", pauses)`,
          output: `items [1, 2, 3, 4, 5]
pages_fetched 3 rate_limit_pauses 2`,
        },
        why:
          "El fin de colección lo marca el proveedor (`next is None`), no un contador mágico de «siempre 3 páginas». Las pausas modelan rate-limit **entre** páginas para tests deterministas sin `time.sleep`. Así el full-sync sintético respeta cuota y no llena el heap de un solo GET.",
        retrospective:
          "Si sabes por qué hay 2 pausas con 3 páginas, entiendes «pausa al pasar a la siguiente», no «sleep por página leída». We Do: simular timeout, aplanar páginas y política `should_retry`.",
      },
      {
        demoId: "S12-T2-A-DEMO",
        subtopicId: "S12-T2-A",
        environment: "local-python",
        description: "Tras un fetch (un pedido al servidor): arma la provenance (url, timestamp, status, hash del body, auth_scheme, token_present). El hash del body (su huella digital corta) prueba integridad sin volcar PII; `auth_scheme` es el esquema de autenticación (bearer, basic). El valor del token nunca entra al log — solo `token_present=true` y `token_logged False` al final.",
        preamble:
          "Tras un fetch de señales, el auditor necesita **traza de origen** (url, timestamp, status, hash del body, esquema de auth) sin el valor del secreto. Observa el demo: `token_present` es booleano; al final `token_logged False`. El token vive en env (`SIG_API_TOKEN`), no en el JSON impreso. No reescribas: predice las claves del manifest y si el string del token aparece.",
        code: {
          language: 'python',
          title: "provenance_demo.py",
          code: `import os, json, hashlib

def build_manifest(url, body, status=200):
    return {
        "source_url": url,
        "fetched_at": "2026-07-20T15:00:00Z",
        "status_code": status,
        "body_sha12": hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()[:12],
        "token_present": bool(os.environ.get("SIG_API_TOKEN")),
        "auth_scheme": "bearer",
    }

os.environ["SIG_API_TOKEN"] = "syn-token-000"
url = "https://api.example.com/v1/signals/C001"
body = {"entity_id": "C001", "signals": ["geo"]}
manifest = build_manifest(url, body)
# Nunca loguear el token: solo presencia booleana
print(json.dumps(manifest, sort_keys=True))
print("token_logged", False)`,
          output: `{"auth_scheme": "bearer", "body_sha12": "5acbf63b7a4b", "fetched_at": "2026-07-20T15:00:00Z", "source_url": "https://api.example.com/v1/signals/C001", "status_code": 200, "token_present": true}
token_logged False`,
        },
        why:
          "La provenance alimenta el entregable CP-N1-C y el README del portafolio: el auditor ve origen y estado sin el secreto. `body_sha12` prueba integridad del payload sin volcar PII. El token existe en env; en el log solo `token_present` o la longitud — nunca el header Authorization.",
        retrospective:
          "Si el manifest no contiene el token y sí `token_present`, ya internalizaste «secreto fuera de la traza». We Do: exigir token, caché GET y armar provenance mínima.",
      },
      {
        demoId: "S12-T2-B-DEMO",
        subtopicId: "S12-T2-B",
        environment: "local-python",
        description: "Contract test del geocoder mock + fallback a coordenadas precalculadas. Observa mode=online vs. mode=offline_fallback: mismo lat/lon de Lima, traza distinta — el auditor ve la verdad.",
        preamble:
          "Cuando el geocoder online cae, el pipeline puede usar precalculados locales (coords guardadas de antes) **sin mentir**. Observa: `mode=online` (datos frescos del proveedor) vs `mode=offline_fallback` (coords locales de respaldo), mismas lat/lon de Lima, traza distinta. El contract (contrato de claves) exige `lat`/`lon`/`provider`. No escribas: predice las tres líneas de salida y el valor de `contract_precalc`.",
        code: {
          language: 'python',
          title: "geocoder_contract_demo.py",
          code: `REQUIRED = {"lat", "lon", "provider"}
PRECALC = {"Lima": {"lat": -12.0464, "lon": -77.0428, "provider": "precalc"}}

def contract_ok(d):
    return not (REQUIRED - set(d.keys()))

def geocode(city, fail_online=False):
    if fail_online:
        return {**PRECALC[city], "mode": "offline_fallback"}
    online = {"lat": -12.0464, "lon": -77.0428, "provider": "mock", "mode": "online"}
    assert contract_ok(online)
    return online

print("online", geocode("Lima"))
print("fallback", geocode("Lima", fail_online=True))
print("contract_precalc", contract_ok(PRECALC["Lima"]))`,
          output: `online {'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock', 'mode': 'online'}
fallback {'lat': -12.0464, 'lon': -77.0428, 'provider': 'precalc', 'mode': 'offline_fallback'}
contract_precalc True`,
        },
        why:
          "El contrato de claves falla **antes** del dashboard de S13 si el proveedor renombra campos. El fallback marca el modo para el auditor: mismas coords, origen honesto. Las demos de entrevista y CI no dependen de internet; el flag offline es parte del runbook de CP-N1-C.",
        retrospective:
          "Falla suave, traza dura: sigues con datos locales pero no reescribes el origen a «online». We Do: assert de claves, fallback 5xx y runbook live/local.",
      },
      {
        demoId: "S12-T3-A-DEMO",
        subtopicId: "S12-T3-A",
        environment: "local-python",
        description: "Tablas clients, transactions, evidence: une nombre + monto + kind de evidencia en una sola fila de caso. Observa case_row ('Ana', 120.5, 'geo') — ficha mínima para el dashboard de S13.",
        preamble:
          "Las señales del adaptador se **persisten** (se guardan en disco) para el caso: tres tablas locales y un JOIN (la operación SQL que combina filas de dos tablas) arman la ficha mínima (nombre, monto, kind de evidencia). Observa el demo en `:memory:` (base en RAM) sin servidor. Predice la tupla `case_row` y nota que `geo` llega por `entity_id=C001`, no por magia. Ese join es lo que el dashboard de S13 consumirá.",
        code: {
          language: 'python',
          title: "case_join_demo.py",
          code: `import sqlite3

def case_join():
    con = sqlite3.connect(":memory:")
    con.executescript("""
CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE transactions(id TEXT PRIMARY KEY, client_id TEXT, amount REAL);
CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT, kind TEXT);
""")
    con.execute("INSERT INTO clients VALUES ('C001','Ana')")
    con.execute("INSERT INTO transactions VALUES ('T1','C001',120.5)")
    con.execute("INSERT INTO evidence VALUES ('E1','C001','geo')")
    row = con.execute(
        "SELECT c.name, t.amount, e.kind FROM clients c "
        "JOIN transactions t ON c.id=t.client_id "
        "JOIN evidence e ON c.id=e.entity_id"
    ).fetchone()
    con.close()
    return row

print("case_row", case_join())`,
          output: `case_row ('Ana', 120.5, 'geo')`,
        },
        why:
          "La ficha de caso no es un string suelto: es una tupla de columnas unidas por `client_id` y `entity_id`. Aunque los valores del demo estén fijos, el hábito de parametrizar empieza en el INSERT del We Do. Ese join es el almacén local que el dashboard de S13 leerá para armar la vista del caso.",
        retrospective:
          "Si puedes dibujar las tres FKs lógicas (`client_id`, `entity_id`) sin mirar el SQL, ya tienes el modelo del almacén. We Do: esquema evidence, CRUD de client y join solo de C001.",
      },
      {
        demoId: "S12-T3-B-DEMO",
        subtopicId: "S12-T3-B",
        environment: "local-python",
        description: "Batch atómico: BEGIN → varios INSERT → si UNIQUE rompe (DOC1 duplicado en C003), ROLLBACK y COUNT(*) vuelve a 0. Observa atomic_rollback + count 0: nada a medias.",
        preamble:
          "Un batch (lote) de clientes con `document_id` UNIQUE (único, sin repetidos) no puede quedar «a medias» si el tercer insert choca. Sigue el demo: BEGIN (abrir transacción) → tres INSERT → IntegrityError (la excepción que lanza SQLite al romper UNIQUE) en DOC1 duplicado → ROLLBACK (deshacer todo) → `count 0`. Predice `atomic_rollback` y el count. En compliance, dos filas huérfanas son peor que un fallo ruidoso.",
        code: {
          language: 'python',
          title: "atomic_batch_demo.py",
          code: `import sqlite3

def atomic_batch(batch):
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT UNIQUE)")
    try:
        con.execute("BEGIN")
        con.executemany("INSERT INTO clients VALUES (?,?)", batch)
        con.commit()
        return "unexpected_commit", con.execute("SELECT COUNT(*) FROM clients").fetchone()[0]
    except sqlite3.IntegrityError:
        con.rollback()
        n = con.execute("SELECT COUNT(*) FROM clients").fetchone()[0]
        con.close()
        return "atomic_rollback", n

status, n = atomic_batch([("C001", "DOC1"), ("C002", "DOC2"), ("C003", "DOC1")])
print(status)
print("count", n)`,
          output: `atomic_rollback
count 0`,
        },
        why:
          "`executemany` dentro de una transacción hace que el UNIQUE roto revierta **todo** el batch: el status `atomic_rollback` es la promesa de atomicidad. Reporta la fila ofensora en el log de aplicación, no interpolada en el SQL. Compliance prefiere un fallo ruidoso a dos filas «casi ok».",
        retrospective:
          "Si ves count 2, olvidaste el rollback. Atomicidad = todo o nada. We Do: placeholders contra inyección, rollback manual y CREATE INDEX.",
      },
      {
        demoId: "S12-T4-A-DEMO",
        subtopicId: "S12-T4-A",
        environment: "local-python",
        description: "MockGeocoder autorizado: las ciudades de la tabla devuelven lat/lon fijos; una que no está en ella → None (fail-closed, no inventa punto). Observa provider=authorized_mock y la ausencia de PII en el payload.",
        preamble:
          "La geoevidencia del caso usa un geocoder **autorizado/mock** (un proveedor simulado, no uno público real), offline y sin PII bancaria. Observa: las dos ciudades de la tabla devuelven lat/lon fijos; la tercera no está en ella y devuelve `None` (fail-closed). No se inventa un pin en el mapa. Predice las tres líneas y nota `provider=authorized_mock`. Datos de demo únicamente.",
        code: {
          language: 'python',
          title: "mock_cities_demo.py",
          code: `class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Quito": (-0.1807, -78.4678)}
    def geocode(self, city):
        if city not in self.DB:
            return None
        lat, lon = self.DB[city]
        return {"city": city, "lat": lat, "lon": lon, "provider": "authorized_mock"}

g = MockGeocoder()
for c in ("Lima", "Quito", "Santiago"):
    print(c, g.geocode(c))`,
          output: `Lima {'city': 'Lima', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'authorized_mock'}
Quito {'city': 'Quito', 'lat': -0.1807, 'lon': -78.4678, 'provider': 'authorized_mock'}
Santiago None`,
        },
        why:
          "La interfaz del mock es intercambiable: misma firma `geocode(city)` permite swap a un proveedor autorizado real después. Ciudad desconocida no es «cerca de Quito»; fail-closed devuelve `None` en lugar de inventar un punto. Offline y sin PII en el payload protegen la política de egress de CP-N1-C.",
        retrospective:
          "Fail-closed en geocode desconocido evita basura en el score de S13. We Do: normalizar espacios, implementar el mock y bloquear `document_id` en egress.",
      },
      {
        demoId: "S12-T4-B-DEMO",
        subtopicId: "S12-T4-B",
        environment: "local-python",
        description: "Calcula ~8.95 km Lima–Callao y empaquétalos como geoseñal (type/value/verdict=None). Nunca autoetiquetes parentesco o fraude: el disclaimer signal != kinship es parte del entregable.",
        preamble:
          "La distancia entre Lima y Callao alimenta un **score de relación** (un número que alimenta el matching), no un veredicto de parentesco o fraude. Observa el demo: `haversine_km` (la fórmula esférica) ≈ 8.95, el dict lleva `type`/`value`/`verdict: None` y el disclaimer `signal != kinship` (señal no es parentesco). No escribas: predice el dict y el texto del disclaimer. Juicio humano intacto.",
        code: {
          language: 'python',
          title: "lima_callao_demo.py",
          code: `import math

def haversine_km(a, b):
    R = 6371.0
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(h))

lima = (-12.0464, -77.0428)
callao = (-12.0500, -77.1250)
km = haversine_km(lima, callao)
signal = {"type": "geo_distance_km", "value": round(km, 2), "verdict": None}
print(signal)
print("disclaimer", "signal != kinship")`,
          output: `{'type': 'geo_distance_km', 'value': 8.95, 'verdict': None}
disclaimer signal != kinship`,
        },
        why:
          "R=6371 es el radio del curso para Haversine esférico. El paquete `{type, value, verdict}` es el contrato hacia S13: la distancia alimenta `relationship_signal_score`, pero `verdict=None` deja el juicio humano intacto. Nunca autoetiquetes `is_family` ni fraude por cercanía en km.",
        retrospective:
          "Si puedes defender en 20 segundos por qué 1.2 km no es parentesco, ya tienes la línea ética del capstone. En el We Do el campo se llama `kinship_verdict`; el contrato es el mismo: siempre `None`. We Do: validar lat/lon, fórmula Haversine y empaquetar señal.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (E1 guiado con pistas / E2 independiente / E3 de transferencia, que aplica el concepto a un caso nuevo) por los 8 subtemas, en el mismo orden del I Do. Alcance de S12: mocks HTTP conceptuales (simulaciones del proveedor) + `sqlite3` + Haversine (`math`); datos sintéticos (`CASO-LIM-012`, ids `C00x`). No RPA ni dashboard de S13; no NumPy de S14. Conserva asserts (comprobaciones) y fixtures (datos de prueba) del starter — cada starter trae **un defecto claro** marcado como DEFECT para que lo repares. Dos pistas por ejercicio. Política N1 de retry: solo 429 y 503; normalize de dirección = espacios, sin `.title()`.",
    steps: [
      {
        id: "S12-T1-A-E1",
        subtopicId: "S12-T1-A",
        kind: "guided",
        title: "Status 200 o 404 sin excepción",
        preamble:
          "- **Contexto:** el adaptador de entidades del caso sintético debe devolver status explícito (un código HTTP, no un crash).\n- **Meta:** implementar `get_entity(store, entity_id)` que devuelva `(status, body)`.\n- **Éxito:** `C001` → `(200, {'id': 'C001', 'region': 'Lima'})`; `C999` → `(404, {'error': 'not_found'})`.\n- **Límites:** no lances excepción en 404; no uses red real; solo el `store` (el diccionario) del fixture.",
        instruction:
          "1. Abre el starter: siempre devuelve `200` y `{}` (DEFECT).\n2. Si `entity_id` no está en `store`, devuelve `404` y el body de error.\n3. Si existe, devuelve `200` y el dict del store.\n4. Imprime ambos casos del fixture (sin texto extra).",
        hint: "Devuelve una tupla (status_code, dict).",
        hints: [
          "Devuelve una tupla (status_code, dict).",
          "404 no lanza excepción: el adaptador decide la acción.",
        ],
        edgeCases: ["404 body estable", "id existente"],
        tests: "200 con dict; 404 con error",
        feedback:
          "El 404 es un resultado válido del adaptador, no un crash. El caller traduce status→acción (missing, retry, etc.). Devolver tupla `(status, body)` evita try/except ruidosos en cada llamada.",
        retrospective:
          "Status explícito es el contrato del adaptador: el body solo se usa si la acción es `use_body`. No confundas «no encontrado» con «error de red». Siguiente (E2): parse estricto del payload 200.",
        starterCode: {
          language: 'python',
          title: "get_entity.py",
          code: `# CASO-LIM-012 · get_entity
# DEFECT: siempre 200 y body vacío
store = {"C001": {"id": "C001", "region": "Lima"}}
def get_entity(store, entity_id):
    return 200, {}
print(get_entity(store, "C001"))
print(get_entity(store, "C999"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "get_entity.py",
          code: `store = {"C001": {"id": "C001", "region": "Lima"}}
def get_entity(store, entity_id):
    if entity_id not in store:
        return 404, {"error": "not_found"}
    return 200, store[entity_id]
print(get_entity(store, "C001"))
print(get_entity(store, "C999"))`,
          output: `(200, {'id': 'C001', 'region': 'Lima'})
(404, {'error': 'not_found'})`,
        },
      },
      {
        id: "S12-T1-A-E2",
        subtopicId: "S12-T1-A",
        kind: "independent",
        title: "Parse estricto de entidad (solo id y region)",
        preamble:
          "- **Contexto:** tras un 200, el JSON del proveedor puede traer basura (`extra`) o faltar claves; el dashboard de S13 no debe tragar basura.\n- **Meta:** validar y proyectar solo `id` y `region`.\n- **Éxito:** payload completo con extra → `{'id':'C001','region':'Lima'}`; incompleto → `None`.\n- **Límites:** no mutes el payload original; si no es `dict`, devuelve `None`.",
        instruction:
          "1. Revisa el starter: devuelve el payload crudo sin validar.\n2. Exige tipo `dict` y claves `id` y `region`.\n3. Construye un dict **nuevo** solo con esas dos claves.\n4. Imprime el caso con extra y el incompleto.",
        hint: "Usa set de required keys.",
        hints: [
          "Comprueba isinstance y presencia de id/region.",
          "No mutes el payload original; construye un dict nuevo.",
        ],
        edgeCases: ["clave faltante", "extra ignorado"],
        tests: "dict tipado o None",
        feedback:
          "Parse estricto es fail-closed sobre el contrato de entidad. Ignorar extras evita que un campo del proveedor contamine el score o el almacén aguas abajo.",
        retrospective:
          "Whitelist de claves = contrato de entidad hacia el almacén. El error clásico es `return payload` «porque ya vino 200». Pregunta: ¿qué pasa con `extra` si lo guardas en SQLite? Luego (E3): tabla status→acción **antes** de mirar el body.",
        starterCode: {
          language: 'python',
          title: "parse_entity.py",
          code: `# CASO-LIM-012 · parse_entity
# DEFECT: no valida keys; devuelve payload crudo
def parse_entity(payload):
    return payload
print(parse_entity({"id": "C001", "region": "Lima", "extra": 1}))
print(parse_entity({"id": "C001"}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "parse_entity.py",
          code: `def parse_entity(payload):
    if not isinstance(payload, dict):
        return None
    if "id" not in payload or "region" not in payload:
        return None
    return {"id": payload["id"], "region": payload["region"]}
print(parse_entity({"id": "C001", "region": "Lima", "extra": 1}))
print(parse_entity({"id": "C001"}))`,
          output: `{'id': 'C001', 'region': 'Lima'}
None`,
        },
      },
      {
        id: "S12-T1-A-E3",
        subtopicId: "S12-T1-A",
        kind: "transfer",
        title: "Tabla status→acción (política N1)",
        preamble:
          "- **Contexto:** el adaptador no «reintenta a ciegas»; traduce cada status a una acción de runbook.\n- **Meta:** implementar `status_action(code)` según política N1 del curso.\n- **Éxito:** líneas `200 use_body`, `404 missing`, `429 retry`, `400 fix_client`, `500 fail_server`, `503 retry`.\n- **Límites:** 500 **no** es retry en N1 (contrato de ejercicios); códigos no listados → `unknown`.",
        instruction:
          "1. Lee el DEFECT: 429 y 500 caen en `fail_client`; 503 no está.\n2. Corrige el mapa: 429/503 → `retry`; 500 → `fail_server`; 400 → `fix_client`.\n3. Recorre `[200, 404, 429, 400, 500, 503]` e imprime código y acción.\n4. No inventes acciones fuera de la política N1.",
        hint: "if/elif o dict; en N1, 500 no es retry.",
        hints: [
          "if/elif o dict; en N1, 500 no es retry.",
          "429 y 503 sí reintentan; 400 es fix_client.",
        ],
        edgeCases: ["400 no retry", "500 fail_server"],
        tests: "política status→acción N1",
        feedback:
          "La función es el contrato de resiliencia del adaptador. Debe contar la misma historia que `should_retry`: solo errores transitorios (429/503) merecen reintento en N1.",
        retrospective:
          "Retry solo en errores transitorios (429/503) protege cuota y no «arregla» un id mal formado. Pregunta de cierre: ¿por qué un 400 no se reintenta? Puente a T1-B: timeout y `should_retry`.",
        starterCode: {
          language: 'python',
          title: "status_table.py",
          code: `# CASO-LIM-012 · status_action (política N1)
# DEFECT: 429 y 500 van a fail_client; 503 no contemplado
def status_action(code):
    if code == 200:
        return "use_body"
    if code == 404:
        return "missing"
    if code in (429, 500):
        return "fail_client"
    if code == 400:
        return "fix_client"
    return "unknown"
for code in [200, 404, 429, 400, 500, 503]:
    print(code, status_action(code))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "status_table.py",
          code: `def status_action(code):
    if code == 200:
        return "use_body"
    if code == 404:
        return "missing"
    if code in (429, 503):
        return "retry"
    if code == 400:
        return "fix_client"
    if code == 500:
        return "fail_server"
    return "unknown"
for code in [200, 404, 429, 400, 500, 503]:
    print(code, status_action(code))`,
          output: `200 use_body
404 missing
429 retry
400 fix_client
500 fail_server
503 retry`,
        },
      },
      {
        id: "S12-T1-B-E1",
        subtopicId: "S12-T1-B",
        kind: "guided",
        title: "Timeout simulado: cost vs límite",
        preamble:
          "- **Contexto:** un socket colgado congela el pipeline de adquisición; el cliente real siempre lleva `timeout=`.\n- **Meta:** modelar timeout con dos números (`timeout_s`, `cost_s`) sin red.\n- **Éxito:** `fetch(2.0, 0.5)` → `ok`; `fetch(1.0, 3.0)` → `timeout`.\n- **Límites:** no uses red ni `time.sleep`; si `cost_s > timeout_s` es timeout (igualdad cuenta ok).",
        instruction:
          "1. El starter compara al revés (`cost < timeout` devuelve timeout).\n2. Invierte la condición: costo **mayor** que el límite → `'timeout'`.\n3. En caso contrario devuelve `'ok'`.\n4. Imprime los dos casos del fixture.",
        hint: "Compara cost_s con timeout_s: mayor que el límite es timeout.",
        hints: [
          "Si cost_s es mayor que timeout_s, devuelve 'timeout'.",
          "No uses red real; compara números.",
        ],
        edgeCases: ["cost == timeout cuenta ok o timeout según tu política; aquí > es timeout."],
        tests: "ok y timeout",
        feedback:
          "Sin timeout, un request colgado bloquea workers y demos. Aquí no hay red: solo comparas costos. El mismo hábito se traduce a `urlopen(..., timeout=5)` o al SDK del proveedor.",
        retrospective:
          "Timeout es parte del contrato del adaptador, no un «extra de producción». El misconception es reintentar timeouts sin tope. Siguiente: paginar hasta `next is None` (E2).",
        starterCode: {
          language: 'python',
          title: "timeout_sim.py",
          code: `# CASO-LIM-012 · timeout
# DEFECT: compara al revés (cost < timeout es timeout)
def fetch(timeout_s, cost_s):
    if cost_s < timeout_s:
        return "timeout"
    return "ok"
print(fetch(2.0, 0.5))
print(fetch(1.0, 3.0))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "timeout_sim.py",
          code: `def fetch(timeout_s, cost_s):
    if cost_s > timeout_s:
        return "timeout"
    return "ok"
print(fetch(2.0, 0.5))
print(fetch(1.0, 3.0))`,
          output: `ok
timeout`,
        },
      },
      {
        id: "S12-T1-B-E2",
        subtopicId: "S12-T1-B",
        kind: "independent",
        title: "Paginar hasta next is None",
        preamble:
          "- **Contexto:** el full-sync de señales del caso no cabe en un solo GET; el proveedor pagina.\n- **Meta:** aplanar todas las páginas en una lista de items.\n- **Éxito:** con el fixture del starter, `['a', 'b', 'c']`.\n- **Límites:** termina solo cuando `next is None`; no hardcodes «siempre 2 páginas».",
        instruction:
          "1. El starter devuelve solo `api[1][\"items\"]`.\n2. Parte de `page = 1` y acumula en un bucle.\n3. En cada paso: extiende con `items` y avanza a `next`.\n4. Imprime la lista plana (sin texto extra).",
        hint: "Recorre páginas mientras next no sea None.",
        hints: [
          "Arranca en page=1 y acumula items en un bucle.",
          "Lee items y next de cada página del dict api.",
        ],
        edgeCases: ["next null termina"],
        tests: "lista plana a,b,c",
        feedback:
          "Paginación correcta es prerequisito del full-sync sintético. El contrato del proveedor manda: si mañana hay 10 páginas, el mismo bucle sirve sin reescribir el contador.",
        retrospective:
          "El contrato del proveedor manda: si mañana hay 10 páginas, el mismo bucle sirve. No copies «páginas=2» del fixture al código. Luego (E3): qué status merecen reintento.",
        starterCode: {
          language: 'python',
          title: "collect_pages.py",
          code: `# CASO-LIM-012 · paginación
# DEFECT: solo primera página
api = {
    1: {"items": ["a"], "next": 2},
    2: {"items": ["b", "c"], "next": None},
}
def collect_all(api):
    return list(api[1]["items"])
print(collect_all(api))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "collect_pages.py",
          code: `api = {
    1: {"items": ["a"], "next": 2},
    2: {"items": ["b", "c"], "next": None},
}
def collect_all(api):
    out = []
    page = 1
    while page is not None:
        chunk = api[page]
        out.extend(chunk["items"])
        page = chunk["next"]
    return out
print(collect_all(api))`,
          output: `['a', 'b', 'c']`,
        },
      },
      {
        id: "S12-T1-B-E3",
        subtopicId: "S12-T1-B",
        kind: "transfer",
        title: "Retry solo 429 y 503 (N1)",
        preamble:
          "- **Contexto:** reintentar un 400 o 404 multiplica basura y quema cuota; solo errores **transitorios** reintentan en N1.\n- **Meta:** `should_retry(status)` → `True` únicamente para 429 y 503.\n- **Éxito:** `400 False`, `404 False`, `429 True`, `503 True`, `200 False`.\n- **Límites:** no reintentes 500 aquí (política de ejercicios N1); no uses rangos `>= 400`.",
        instruction:
          "1. El starter marca retry en todo status ≥ 400.\n2. Cambia a pertenencia en el conjunto `{429, 503}`.\n3. Imprime status y booleano para la lista del fixture.\n4. Comprueba mentalmente que 200 y 4xx de cliente son False.",
        hint: "Solo dos códigos transitorios merecen True en N1.",
        hints: [
          "Pertenencia a un conjunto pequeño de status, no un rango amplio.",
          "200 y 4xx de cliente no reintentan.",
        ],
        edgeCases: ["400 False", "429 True"],
        tests: "política retry transitorio",
        feedback:
          "Retry selectivo respeta al proveedor y a tu cuota. El error clásico es «cualquier error se reintenta tres veces»: un 400 no se repara con más intentos.",
        retrospective:
          "`should_retry` y `status_action` deben contar la misma historia. El error clásico es «cualquier error se reintenta tres veces». En T2 proteges el secreto y la traza del fetch.",
        starterCode: {
          language: 'python',
          title: "retry_policy.py",
          code: `# CASO-LIM-012 · should_retry
# DEFECT: reintenta 4xx de cliente
def should_retry(status):
    return status >= 400
for s in [400, 404, 429, 503, 200]:
    print(s, should_retry(s))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "retry_policy.py",
          code: `def should_retry(status):
    return status in {429, 503}
for s in [400, 404, 429, 503, 200]:
    print(s, should_retry(s))`,
          output: `400 False
404 False
429 True
503 True
200 False`,
        },
      },
      {
        id: "S12-T2-A-E1",
        subtopicId: "S12-T2-A",
        kind: "guided",
        title: "Exigir API_TOKEN o fallar cerrado",
        preamble:
          "- **Contexto:** un adaptador sin token no debe enviar requests «por si acaso» ni hardcodear demo en el repo.\n- **Meta:** leer `API_TOKEN` del dict `env` y fallar si falta o está vacío.\n- **Éxito:** env con token → `abc`; env vacío → mensaje `API_TOKEN missing`.\n- **Límites:** lanza `ValueError` (no devuelvas `\"\"`); no imprimas el token en logs reales.",
        instruction:
          "1. El starter usa `get(..., \"\")` y nunca lanza.\n2. Obtén el token; si es falsy, `raise ValueError('API_TOKEN missing')`.\n3. Si existe, devuélvelo.\n4. Deja el try/except del runner para ver el mensaje.",
        hint: "Lee API_TOKEN del dict env.",
        hints: [
          "Obtén el token con get; no uses default vacío como éxito.",
          "Si no hay token, lanza ValueError con el mensaje pedido.",
        ],
        edgeCases: ["token vacío falla"],
        tests: "abc + error message",
        feedback:
          "Devolver cadena vacía disfraza la falla y produce 401 en cascada. Fail-closed con mensaje claro es más barato de depurar y evita llamadas anónimas accidentales.",
        retrospective:
          "El secreto se lee de env/secret store, no del código. Pregunta: ¿qué imprime el demo de provenance, el valor o la presencia? Siguiente: caché de GET (E2).",
        starterCode: {
          language: 'python',
          title: "require_token.py",
          code: `# CASO-LIM-012 · require_token
# DEFECT: devuelve "" en vez de raise
def require_token(env):
    return env.get("API_TOKEN", "")
print(require_token({"API_TOKEN": "abc"}))
try:
    print(require_token({}))
except ValueError as e:
    print(str(e))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "require_token.py",
          code: `def require_token(env):
    tok = env.get("API_TOKEN")
    if not tok:
        raise ValueError("API_TOKEN missing")
    return tok
print(require_token({"API_TOKEN": "abc"}))
try:
    require_token({})
except ValueError as e:
    print(str(e))`,
          output: `abc
API_TOKEN missing`,
        },
      },
      {
        id: "S12-T2-A-E2",
        subtopicId: "S12-T2-A",
        kind: "independent",
        title: "Caché GET: hit y miss",
        preamble:
          "- **Contexto:** demos repetidas del mismo URL de señales no deben «pegarle» al mock cada vez.\n- **Meta:** `set(url, body)` y `get(url)` → `(body, cache_hit)`.\n- **Éxito:** tras set de `u1`, get → `({'ok': True}, True)`; url desconocido → `(None, False)`.\n- **Límites:** dict interno; no inventes TTL aquí (solo hit/miss); no mutes el body del caller de forma sorpresiva.",
        instruction:
          "1. El starter: `get` siempre miss y `set` es no-op.\n2. Guarda el body bajo la clave url.\n3. En get, si existe devuelve `(body, True)`; si no, `(None, False)`.\n4. Imprime hit de `u1` y miss de `missing`.",
        hint: "Usa la url como clave del dict interno.",
        hints: [
          "En set, guarda el body bajo la url.",
          "En get, devuelve (body, True) o (None, False).",
        ],
        edgeCases: ["miss → None, False"],
        tests: "hit y miss",
        feedback:
          "Caché de GET reduce latencia y cuota en demos repetidas. No es licencia para cachear POST ni errores 5xx sin política explícita.",
        retrospective:
          "Hit/miss es el contrato mínimo del cache de GET del adaptador. El error clásico es cachear un 5xx o un POST «porque la URL se repite». Pregunta: ¿qué imprime el segundo get a `u1` y por qué? Luego (E3): provenance con `cache_hit` **honesto**.",
        starterCode: {
          language: 'python',
          title: "cache_get.py",
          code: `# CASO-LIM-012 · Cache get/set
# DEFECT: get siempre miss; set no-op
class Cache:
    def __init__(self):
        self._data = {}
    def get(self, url):
        return None, False
    def set(self, url, body):
        pass
c = Cache()
c.set("u1", {"ok": True})
print(c.get("u1"))
print(c.get("missing"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "cache_get.py",
          code: `class Cache:
    def __init__(self):
        self._data = {}
    def get(self, url):
        if url in self._data:
            return self._data[url], True
        return None, False
    def set(self, url, body):
        self._data[url] = body
c = Cache()
c.set("u1", {"ok": True})
print(c.get("u1"))
print(c.get("missing"))`,
          output: `({'ok': True}, True)
(None, False)`,
        },
      },
      {
        id: "S12-T2-A-E3",
        subtopicId: "S12-T2-A",
        kind: "transfer",
        title: "Provenance mínima sin secretos",
        preamble:
          "- **Contexto:** el capstone pide evidencia de adquisición; el auditor lee un manifest, no el header Authorization.\n- **Meta:** `min_provenance(url, status, cache_hit)` con cuatro campos fijos de reloj de demo.\n- **Éxito:** `sorted(...items())` muestra `cache_hit`, `fetched_at`, `source_url`, `status_code` (sin token).\n- **Límites:** `fetched_at` fijo `'2026-07-20T00:00:00Z'`; **nunca** incluyas el token.",
        instruction:
          "1. El starter solo devuelve url y timestamp.\n2. Agrega `status_code` y `cache_hit` desde los parámetros.\n3. Imprime `sorted(...items())` del caso del starter.\n4. Verifica mentalmente que no hay clave de secreto.",
        hint: "Cuatro campos de auditoría; ninguno es el token.",
        hints: [
          "Incluye source_url, fetched_at, status_code y cache_hit.",
          "No incluyas Authorization ni el valor del token.",
        ],
        edgeCases: ["sin token"],
        tests: "4 campos de provenance",
        feedback:
          "Provenance es evidencia de adquisición para el capstone. Un manifest sin status o con `cache_hit` inventado miente al auditor y al README del portafolio.",
        retrospective:
          "Provenance honesta (`cache_hit` real) es parte del entregable, no un print decorativo. En T2-B blindas el schema del geocoder y el modo offline.",
        starterCode: {
          language: 'python',
          title: "provenance_fields.py",
          code: `# CASO-LIM-012 · provenance mínima
# DEFECT: omite status y cache_hit
def min_provenance(url, status, cache_hit):
    return {"source_url": url, "fetched_at": "2026-07-20T00:00:00Z"}
print(sorted(min_provenance("https://x", 200, False).items()))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "provenance_fields.py",
          code: `def min_provenance(url, status, cache_hit):
    return {
        "source_url": url,
        "fetched_at": "2026-07-20T00:00:00Z",
        "status_code": status,
        "cache_hit": cache_hit,
    }
print(sorted(min_provenance("https://x", 200, False).items()))`,
          output: `[('cache_hit', False), ('fetched_at', '2026-07-20T00:00:00Z'), ('source_url', 'https://x'), ('status_code', 200)]`,
        },
      },
      {
        id: "S12-T2-B-E1",
        subtopicId: "S12-T2-B",
        kind: "guided",
        title: "Contract test: claves obligatorias",
        preamble:
          "- **Contexto:** si el proveedor renombra `lon` a `longitude`, el mapa de S13 se llena de huecos silenciosos.\n- **Meta:** `assert_keys(payload, required)` lanza si faltan claves.\n- **Éxito:** payload completo → imprime `ok`; sin `lon` → `missing keys: ['lon']`.\n- **Límites:** mensaje con lista **sorted**; no inventes valores por defecto.",
        instruction:
          "1. El starter siempre retorna True.\n2. Calcula `missing = set(required) - set(payload)`.\n3. Si hay missing, `raise AssertionError` con el formato pedido.\n4. Deja el runner: ok primero, luego el try del payload incompleto.",
        hint: "Diferencia de conjuntos entre required y las claves del payload.",
        hints: [
          "Calcula las claves que faltan con sets.",
          "Si hay missing, lanza AssertionError con lista sorted.",
        ],
        edgeCases: ["mensaje con lon"],
        tests: "ok + AssertionError",
        feedback:
          "Contract tests baratos atrapan roturas de proveedor. Un assert rojo en CI es más barato que un dashboard mudo; no «rellenes» `lon=0`.",
        retrospective:
          "El contract test fija el schema del proveedor **antes** de pintar el mapa. El error clásico es rellenar defaults silenciosos (`lon=0`) para «que no falle». Siguiente: degradar a body local en 5xx sin mentir el modo (E2).",
        starterCode: {
          language: 'python',
          title: "assert_keys.py",
          code: `# CASO-LIM-012 · assert_keys
# DEFECT: no valida; siempre pasa
def assert_keys(payload, required):
    return True
assert_keys({"lat": 1, "lon": 2}, ["lat", "lon"])
print("ok")
try:
    assert_keys({"lat": 1}, ["lat", "lon"])
    print("passed_bad")
except AssertionError as e:
    print(e)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "assert_keys.py",
          code: `def assert_keys(payload, required):
    missing = set(required) - set(payload)
    if missing:
        raise AssertionError(f"missing keys: {sorted(missing)}")
assert_keys({"lat": 1, "lon": 2}, ["lat", "lon"])
print("ok")
try:
    assert_keys({"lat": 1}, ["lat", "lon"])
except AssertionError as e:
    print(e)`,
          output: `ok
missing keys: ['lon']`,
        },
      },
      {
        id: "S12-T2-B-E2",
        subtopicId: "S12-T2-B",
        kind: "independent",
        title: "Fallback offline ante 5xx",
        preamble:
          "- **Contexto:** un 503 del proveedor no debe tumbar la demo del caso; usas coordenadas locales y marcas el modo.\n- **Meta:** `fetch_with_fallback(status, local_body)` elige body y modo.\n- **Éxito:** 200 → `({'online': True}, 'online')`; 503 → `(local_body, 'offline')`.\n- **Límites:** solo status ≥ 500 dispara offline; no reescribas el status a 200.",
        instruction:
          "1. El starter ignora status y siempre devuelve online.\n2. Si `status >= 500`, devuelve `(local_body, 'offline')`.\n3. En caso contrario, body online y modo `'online'`.\n4. Imprime ambos casos del starter.",
        hint: "5xx dispara el body local y el modo offline.",
        hints: [
          "Compara status con 500 para decidir el modo.",
          "Retorna siempre una tupla (body, mode).",
        ],
        edgeCases: ["5xx → offline"],
        tests: "online/offline modes",
        feedback:
          "Fallback degradado mantiene el demo del dashboard vivo. El modo offline es la verdad del origen: no finjas éxito online cuando leíste precalculados.",
        retrospective:
          "El modo offline es la verdad del origen, no un detalle de UI. En E3 formalizas el runbook `live_api` / `local_file` para el flag de operación.",
        starterCode: {
          language: 'python',
          title: "fallback_5xx.py",
          code: `# CASO-LIM-012 · fallback offline
# DEFECT: ignora status; siempre online
def fetch_with_fallback(status, local_body):
    return {"online": True}, "online"
print(fetch_with_fallback(200, {"lat": 0}))
print(fetch_with_fallback(503, {"lat": -12.0}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "fallback_5xx.py",
          code: `def fetch_with_fallback(status, local_body):
    if status >= 500:
        return local_body, "offline"
    return {"online": True}, "online"
print(fetch_with_fallback(200, {"lat": 0}))
print(fetch_with_fallback(503, {"lat": -12.0}))`,
          output: `({'online': True}, 'online')
({'lat': -12.0}, 'offline')`,
        },
      },
      {
        id: "S12-T2-B-E3",
        subtopicId: "S12-T2-B",
        kind: "transfer",
        title: "Runbook: live_api o local_file",
        preamble:
          "- **Contexto:** entrevistas y CI no pueden depender de internet; un flag decide la fuente de verdad (obligatorio en CP-N1-C).\n- **Meta:** `operation_mode(online)` → `'live_api'` o `'local_file'`.\n- **Éxito:** `True live_api` y `False local_file`.\n- **Límites:** la función decide; no hardcodes solo los prints.",
        instruction:
          "1. El starter siempre devuelve `live_api`.\n2. Si `online` es False, devuelve `local_file`.\n3. Recorre `(True, False)` e imprime flag y modo.\n4. No dejes un print fijo sin función.",
        hint: "Un booleano elige entre dos modos de runbook.",
        hints: [
          "Si online es True → live_api; si no → local_file.",
          "El flag offline siempre lleva a local_file.",
        ],
        edgeCases: ["flag offline"],
        tests: "función de modo de operación",
        feedback:
          "El runbook online/offline mantiene demos reproducibles cuando el proveedor cae. El código es corto a propósito: el valor está en el flag de operación documentado, no en la longitud de la función.",
        retrospective:
          "El runbook online/offline cierra el bloque de adquisición resiliente. Este flag es el mismo interruptor del smoke offline del You Do. En T3 las señales dejan de vivir solo en RAM: SQLite local del caso.",
        starterCode: {
          language: 'python',
          title: "online_offline_matrix.py",
          code: `# CASO-LIM-012 · operation_mode
# DEFECT: siempre live_api aunque online=False
def operation_mode(online):
    return "live_api"
for online in (True, False):
    print(online, operation_mode(online))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "online_offline_matrix.py",
          code: `def operation_mode(online):
    return "live_api" if online else "local_file"
for online in (True, False):
    print(online, operation_mode(online))`,
          output: `True live_api
False local_file`,
        },
      },
      {
        id: "S12-T3-A-E1",
        subtopicId: "S12-T3-A",
        kind: "guided",
        title: "Crear tabla evidence e insertar una fila",
        preamble:
          "- **Contexto:** el almacén local del caso necesita evidencias enlazadas a entidad antes del join.\n- **Meta:** crear `evidence` con PK y NOT NULL, insertar `E1/C001/geo` y contar.\n- **Éxito:** `COUNT(*)` imprime `1`.\n- **Límites:** SQLite `:memory:`; usa placeholders `?` en el INSERT; no dejes la tabla vacía.",
        instruction:
          "1. El starter crea tabla débil y no inserta.\n2. Añade `PRIMARY KEY` y `NOT NULL` en `entity_id` y `kind`.\n3. Inserta `('E1', 'C001', 'geo')` con marcador parametrizado.\n4. Imprime solo el count (un entero).",
        hint: "CREATE TABLE con PK y NOT NULL, luego INSERT.",
        hints: [
          "Define evidence con PRIMARY KEY y NOT NULL en entity_id/kind.",
          "INSERT parametrizado y SELECT COUNT(*).",
        ],
        edgeCases: ["NOT NULL en entity_id"],
        tests: "count 1",
        feedback:
          "Esquema mínimo de evidencias para el join de caso. El CREATE documenta el modelo aunque aún no actives FOREIGN KEY de SQLite; el INSERT parametrizado fija el hábito.",
        retrospective:
          "El esquema documenta el modelo aunque aún no actives FOREIGN KEY de SQLite. Siguiente: ciclo UPDATE/DELETE de un client (E2).",
        starterCode: {
          language: 'python',
          title: "create_evidence.py",
          code: `# CASO-LIM-012 · CREATE evidence
# DEFECT: tabla sin PRIMARY KEY; no inserta
import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE evidence(id TEXT, entity_id TEXT, kind TEXT)")
con.commit()
print(con.execute("SELECT COUNT(*) FROM evidence").fetchone()[0])
con.close()
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "create_evidence.py",
          code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute(
    "CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL)"
)
con.execute("INSERT INTO evidence VALUES (?,?,?)", ("E1", "C001", "geo"))
con.commit()
print(con.execute("SELECT COUNT(*) FROM evidence").fetchone()[0])
con.close()`,
          output: `1`,
        },
      },
      {
        id: "S12-T3-A-E2",
        subtopicId: "S12-T3-A",
        kind: "independent",
        title: "CRUD de client con placeholders",
        preamble:
          "- **Contexto:** en el caso sintético corriges el nombre de `C001` y luego limpias la fila de prueba.\n- **Meta:** INSERT → UPDATE → SELECT name → DELETE → COUNT, todo con `?`.\n- **Éxito:** imprime `Ana Q` y luego `0`.\n- **Límites:** sin f-strings en SQL; no dejes la fila tras el delete.",
        instruction:
          "1. El starter inserta e imprime el name original y un count sin borrar.\n2. Haz `UPDATE ... SET name=? WHERE id=?` a `'Ana Q'`.\n3. Imprime el name; borra por id; imprime count.\n4. Cierra la conexión al final.",
        hint: "UPDATE parametrizado, luego DELETE y COUNT.",
        hints: [
          "Actualiza `name` con marcador y filtra por `id` con marcador.",
          "Orden: insert → update → select → delete → count.",
        ],
        edgeCases: ["update parametrizado"],
        tests: "Ana Q y 0",
        feedback:
          "CRUD parametrizado es la base del almacén local: misma disciplina que en el SELECT del join. Sin f-strings, el input nunca se confunde con SQL.",
        retrospective:
          "UPDATE/DELETE con `?` es la misma disciplina que el SELECT del join: el id nunca se interpola. El error clásico es borrar «a mano» con f-string «porque el id es sintético». Luego (E3): unir clients y evidence **sin** mezclar C002.",
        starterCode: {
          language: 'python',
          title: "crud_client.py",
          code: `# CASO-LIM-012 · UPDATE/DELETE
# DEFECT: no actualiza; count final incorrecto
import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")
con.execute("INSERT INTO clients VALUES (?,?)", ("C001", "Ana"))
print(con.execute("SELECT name FROM clients WHERE id=?", ("C001",)).fetchone()[0])
print(con.execute("SELECT COUNT(*) FROM clients").fetchone()[0])
con.close()
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "crud_client.py",
          code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")
con.execute("INSERT INTO clients VALUES (?,?)", ("C001", "Ana"))
con.execute("UPDATE clients SET name=? WHERE id=?", ("Ana Q", "C001"))
print(con.execute("SELECT name FROM clients WHERE id=?", ("C001",)).fetchone()[0])
con.execute("DELETE FROM clients WHERE id=?", ("C001",))
print(con.execute("SELECT COUNT(*) FROM clients").fetchone()[0])
con.close()`,
          output: `Ana Q
0`,
        },
      },
      {
        id: "S12-T3-A-E3",
        subtopicId: "S12-T3-A",
        kind: "transfer",
        title: "JOIN de evidencias solo de C001",
        preamble:
          "- **Contexto:** la ficha del caso no puede mezclar evidencias de otro entity_id.\n- **Meta:** JOIN `clients` + `evidence` filtrado a `C001`, kinds ordenados.\n- **Éxito:** `['geo', 'phone']` (sin el geo de C002).\n- **Límites:** `WHERE c.id = ?` con param; no filtres solo en Python si puedes en SQL.",
        instruction:
          "1. El starter lista todos los kinds de evidence (mezcla C002).\n2. Reescribe con JOIN `ON c.id = e.entity_id`.\n3. Filtra `C001` y ordena por kind.\n4. Imprime la lista de strings (no tuplas crudas).",
        hint: "JOIN clients con evidence y filtra por id.",
        hints: [
          "Une por c.id = e.entity_id.",
          "Filtra `C001` con marcador y `ORDER BY kind`.",
        ],
        edgeCases: ["no mezclar C002"],
        tests: "['geo','phone']",
        feedback:
          "Join por entity_id alimenta la ficha de caso. Si ves tres kinds, olvidaste el WHERE: el ORDER BY solo no excluye a C002.",
        retrospective:
          "El join por `entity_id` es el corazón del almacén del dashboard. Si ves tres kinds, olvidaste el WHERE. En T3-B: inyección, atomicidad e índices.",
        starterCode: {
          language: 'python',
          title: "join_evidence.py",
          code: `# CASO-LIM-012 · JOIN
# DEFECT: select sin JOIN; mezcla ids
import sqlite3
con = sqlite3.connect(":memory:")
con.executescript("""
CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT, kind TEXT);
INSERT INTO clients VALUES ('C001','Ana');
INSERT INTO evidence VALUES ('E1','C001','geo');
INSERT INTO evidence VALUES ('E2','C001','phone');
INSERT INTO evidence VALUES ('E3','C002','geo');
""")
rows = con.execute("SELECT kind FROM evidence ORDER BY kind").fetchall()
print([r[0] for r in rows])
con.close()
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "join_evidence.py",
          code: `import sqlite3
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT, kind TEXT);
INSERT INTO clients VALUES ('C001','Ana');
INSERT INTO evidence VALUES ('E1','C001','geo');
INSERT INTO evidence VALUES ('E2','C001','phone');
INSERT INTO evidence VALUES ('E3','C002','geo');
''')
rows = con.execute(
    "SELECT e.kind FROM clients c JOIN evidence e ON c.id=e.entity_id WHERE c.id=? ORDER BY e.kind",
    ("C001",),
).fetchall()
print([r[0] for r in rows])
con.close()`,
          output: `['geo', 'phone']`,
        },
      },
      {
        id: "S12-T3-B-E1",
        subtopicId: "S12-T3-B",
        kind: "guided",
        title: "SELECT seguro con marcador parametrizado",
        preamble:
          "- **Contexto:** un id sintético malicioso (un texto construido para engañar al SQL) no debe devolver filas ajenas; en banca esto es falla de control.\n- **Meta:** reescribir el SELECT con `?` y una tupla de params.\n- **Éxito:** el input `C001' OR '1'='1` imprime `None` (sin match literal).\n- **Límites:** **prohibido** f-string (string formateado con `f\"...\"`) o concat con `user_id`; solo placeholder.",
        instruction:
          "1. El starter interpola `user_id` en el SQL (vulnerable).\n2. Cambia a `WHERE id = ?` y pasa `(user_id,)`.\n3. Imprime el `fetchone()` (debe ser `None`).\n4. No «sanitices» a mano con replace de comillas.",
        hint: "Marcador positional y tupla de params, sin f-string.",
        hints: [
          "Pasa `(user_id,)` como parámetro al `WHERE id` (con marcador SQL, sin f-string).",
          "No interpoles user_id en el string SQL.",
        ],
        edgeCases: ["inyección neutralizada"],
        tests: "None (no match literal)",
        feedback:
          "Con f-string, el OR abre todas las filas. El marcador trata el input como **dato**, no como SQL. Ese hábito vale más que cualquier checklist verbal de «no confíes en el usuario».",
        retrospective:
          "Placeholders matan la inyección clásica aunque el id «parezca sintético». Pregunta: ¿qué imprime el starter vulnerable vs la solución? Siguiente: rollback tras IntegrityError (E2).",
        starterCode: {
          language: 'python',
          title: "safe_sql.py",
          code: `# CASO-LIM-012 · SQL injection safe
# DEFECT: f-string concat (vulnerable)
import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")
con.execute("INSERT INTO clients VALUES ('C001','Ana')")
user_id = "C001' OR '1'='1"
print(con.execute(f"SELECT name FROM clients WHERE id = '{user_id}'").fetchone())
con.close()
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "safe_sql.py",
          code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")
con.execute("INSERT INTO clients VALUES ('C001','Ana')")
user_id = "C001' OR '1'='1"
print(con.execute("SELECT name FROM clients WHERE id = ?", (user_id,)).fetchone())
con.close()`,
          output: `None`,
        },
      },
      {
        id: "S12-T3-B-E2",
        subtopicId: "S12-T3-B",
        kind: "independent",
        title: "Rollback total tras IntegrityError",
        preamble:
          "- **Contexto:** si el segundo INSERT del batch choca, el primero no debe quedar solo en la DB del caso.\n- **Meta:** en `except IntegrityError`, hacer `rollback` y dejar count 0.\n- **Éxito:** imprime `0`.\n- **Límites:** no hagas `pass` silencioso; no commits parciales a mano.",
        instruction:
          "1. El starter captura IntegrityError y no revierte.\n2. Dentro del `except`, llama `con.rollback()`.\n3. Imprime `COUNT(*)` (debe ser 0).\n4. Compara mentalmente con el demo `atomic_batch`.",
        hint: "Tras IntegrityError, revierte la transacción.",
        hints: [
          "En el except llama rollback, no pases en silencio.",
          "Tras rollback el count debe ser 0.",
        ],
        edgeCases: ["rollback total"],
        tests: "count 0",
        feedback:
          "Atomicidad evita filas huérfanas: compliance prefiere fallo ruidoso a estado «casi ok». Un `pass` silencioso deja count 1 y miente sobre el batch.",
        retrospective:
          "Tras `IntegrityError`, el siguiente `SELECT` solo es confiable si hiciste `rollback`. El error clásico es `except: pass` y creer que «al menos quedó C001». Pregunta: ¿qué imprime el starter roto vs la solución? Luego (E3): índice en `document_id`.",
        starterCode: {
          language: 'python',
          title: "tx_rollback.py",
          code: `# CASO-LIM-012 · transaction rollback
# DEFECT: no rollback tras IntegrityError
import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY)")
try:
    con.execute("BEGIN")
    con.execute("INSERT INTO clients VALUES ('C001')")
    con.execute("INSERT INTO clients VALUES ('C001')")
    con.commit()
except sqlite3.IntegrityError:
    pass
print(con.execute("SELECT COUNT(*) FROM clients").fetchone()[0])
con.close()
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "tx_rollback.py",
          code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY)")
try:
    con.execute("BEGIN")
    con.execute("INSERT INTO clients VALUES ('C001')")
    con.execute("INSERT INTO clients VALUES ('C001')")
    con.commit()
except sqlite3.IntegrityError:
    con.rollback()
print(con.execute("SELECT COUNT(*) FROM clients").fetchone()[0])
con.close()`,
          output: `0`,
        },
      },
      {
        id: "S12-T3-B-E3",
        subtopicId: "S12-T3-B",
        kind: "transfer",
        title: "Índice idx_document_id y PRAGMA",
        preamble:
          "- **Contexto:** el lookup por documento del caso se acelera y se documenta con un índice explícito.\n- **Meta:** crear `idx_document_id` y listar índices con `PRAGMA index_list`.\n- **Éxito:** `['idx_document_id', 'sqlite_autoindex_clients_1']` (ordenados).\n- **Límites:** nombre exacto del índice; no borres el autoindex de la PK.",
        instruction:
          "1. El starter lista índices sin crear el de document_id.\n2. Ejecuta `CREATE INDEX idx_document_id ON clients(document_id)`.\n3. Lee nombres con PRAGMA y haz `sorted`.\n4. Imprime la lista completa.",
        hint: "CREATE INDEX con el nombre exacto pedido, luego PRAGMA.",
        hints: [
          "Crea el índice sobre clients(document_id) con el nombre exacto.",
          "Lista con PRAGMA index_list y ordena los nombres.",
        ],
        edgeCases: ["nombre de índice"],
        tests: "idx_document_id presente",
        feedback:
          "Índice en document_id acelera lookups del caso y documenta cómo buscas. El autoindex de la PK sigue presente: no lo borres.",
        retrospective:
          "El índice es modelo + rendimiento: documenta cómo buscas en el caso. En T4 la geoevidencia cierra el incremento: normalize, mock y política de egress.",
        starterCode: {
          language: 'python',
          title: "choose_index.py",
          code: `# CASO-LIM-012 · index
# DEFECT: no crea índice document_id
import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT)")
names = [r[1] for r in con.execute("PRAGMA index_list('clients')").fetchall()]
print(sorted(names))
con.close()
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "choose_index.py",
          code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT)")
con.execute("CREATE INDEX idx_document_id ON clients(document_id)")
names = [r[1] for r in con.execute("PRAGMA index_list('clients')").fetchall()]
print(sorted(names))
con.close()`,
          output: `['idx_document_id', 'sqlite_autoindex_clients_1']`,
        },
      },
      {
        id: "S12-T4-A-E1",
        subtopicId: "S12-T4-A",
        kind: "guided",
        title: "Normalizar dirección: espacios, no title",
        preamble:
          "- **Contexto:** direcciones sintéticas llegan con espacios dobles; el geocoder mock falla si no normalizas.\n- **Meta:** `strip` + colapsar espacios con `re.sub` (contrato N1).\n- **Éxito:** `repr(...)` de la dirección del fixture → `'Jr. de la Unión 100'`.\n- **Límites:** **no** uses `.title()` aquí; no inventes distrito/ubigeo.",
        instruction:
          "1. El starter solo hace `strip` y deja espacios dobles.\n2. Aplica `re.sub` para colapsar espacios tras el strip.\n3. Imprime con `repr` para ver espacios exactos.\n4. No cambies capitalización.",
        hint: "strip + colapsar espacios con re.sub; sin title.",
        hints: [
          "Colapsa cualquier corrida de espacios a uno solo tras strip.",
          "No uses title si no se pide; solo espacios.",
        ],
        edgeCases: ["espacios dobles"],
        tests: "string normalizado",
        feedback:
          "Normalizar reduce misses del geocoder mock sin inventar campos. El title-case es política del proveedor, no del contrato N1 de S12.",
        retrospective:
          "Colapsar espacios baja misses del mock **sin** inventar distrito/ubigeo. El misconception es «normalizar = `.title()` siempre». Pregunta: ¿el string del fixture cambia de capitalización? Siguiente: MockGeocoder con `None` en desconocida (E2).",
        starterCode: {
          language: 'python',
          title: "norm_addr.py",
          code: `# CASO-LIM-012 · normalize_address
# DEFECT: solo strip; no colapsa espacios
import re
def normalize_address(s):
    return s.strip()
print(repr(normalize_address("  Jr.  de  la  Unión  100 ")))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "norm_addr.py",
          code: `import re
def normalize_address(s):
    return re.sub(r"\\s+", " ", s.strip())
print(repr(normalize_address("  Jr.  de  la  Unión  100 ")))`,
          output: `'Jr. de la Unión 100'`,
        },
      },
      {
        id: "S12-T4-A-E2",
        subtopicId: "S12-T4-A",
        kind: "independent",
        title: "MockGeocoder: Quito/Santiago o None",
        preamble:
          "- **Contexto:** demos offline necesitan coords fijas por ciudad autorizada, sin red.\n- **Meta:** `geocode(city)` → dict con lat/lon/provider o `None`.\n- **Éxito:** lat de Lima `-12.0464`; Cusco → `None`.\n- **Límites:** solo claves de la tabla DB; no rellenes coords «por defecto».",
        instruction:
          "1. El starter ignora la ciudad y siempre usa Lima.\n2. Si `city` no está en `DB`, devuelve `None`.\n3. Si está, arma el dict con `provider='mock'`.\n4. Imprime lat de Lima y el resultado de Cusco.",
        hint: "Consulta la tabla por ciudad; desconocida → None.",
        hints: [
          "Si la ciudad no está en DB, devuelve None.",
          "Si está, arma dict con lat, lon y provider='mock'.",
        ],
        edgeCases: ["ciudad desconocida None"],
        tests: "-12.0464 y None",
        feedback:
          "Interfaz intercambiable permite swap a proveedor autorizado real más adelante. Inventar coords de Cusco es peor que `None`: contaminas el score de S13.",
        retrospective:
          "Interfaz estable permite swap a proveedor autorizado real después. Inventar coords de Cusco es peor que `None`. Luego (E3): allowlist de egress bloquea PII.",
        starterCode: {
          language: 'python',
          title: "mock_geocoder.py",
          code: `# CASO-LIM-012 · MockGeocoder
# DEFECT: siempre coords de Lima (ignora la ciudad pedida)
class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Quito": (-0.1807, -78.4678)}
    def geocode(self, city):
        lat, lon = self.DB["Lima"]
        return {"city": city, "lat": lat, "lon": lon, "provider": "mock"}
g = MockGeocoder()
print(g.geocode("Lima")["lat"])
print(g.geocode("Cusco"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "mock_geocoder.py",
          code: `class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Quito": (-0.1807, -78.4678)}
    def geocode(self, city):
        if city not in self.DB:
            return None
        lat, lon = self.DB[city]
        return {"city": city, "lat": lat, "lon": lon, "provider": "mock"}
g = MockGeocoder()
print(g.geocode("Lima")["lat"])
print(g.geocode("Cusco"))`,
          output: `-12.0464
None`,
        },
      },
      {
        id: "S12-T4-A-E3",
        subtopicId: "S12-T4-A",
        kind: "transfer",
        title: "Allowlist de egress al geocoder público",
        preamble:
          "- **Contexto:** mandar `document_id` bancario a un geocoder gratis es falla de egress (de salida de datos) y de cumplimiento.\n- **Meta:** `allowed_for_public_geocoder(payload)` devuelve True solo si **todas** las claves del payload están en `{address, city, country}`.\n- **Éxito:** payload limpio → `True`; con `document_id` → `False`.\n- **Límites:** no envíes montos, cuentas ni nombres si la política lo prohíbe; datos sintéticos únicamente.",
        instruction:
          "1. El starter siempre devuelve True.\n2. Usa inclusión de conjuntos: las claves del payload deben estar contenidas en ALLOWED.\n3. Imprime ambos casos del starter.\n4. No «filtres» solo document_id a mano con un if suelto si el set basta.",
        hint: "Todas las claves del payload deben estar en la allowlist.",
        hints: [
          "Comprueba que el set de claves del payload está contenido en ALLOWED.",
          "Cualquier clave extra (p. ej. document_id) debe dar False.",
        ],
        edgeCases: ["PII bancaria bloqueada"],
        tests: "True/False",
        feedback:
          "La allowlist es el control: cualquier clave extra (aunque sea `note`) bloquea. Egress se gobierna por política, no por «confío en el mock de hoy».",
        retrospective:
          "Política de egress es requisito CP-N1-C, no un tip opcional. Pregunta: ¿qué campos salen al proveedor en tu You Do? En T4-B validas coords y empaquetas Haversine como señal, no parentesco.",
        starterCode: {
          language: 'python',
          title: "egress_checklist.py",
          code: `# CASO-LIM-012 · allowlist payload
# DEFECT: siempre True
ALLOWED = {"address", "city", "country"}
def allowed_for_public_geocoder(payload):
    return True
print(allowed_for_public_geocoder({"city": "Lima", "address": "Av 1"}))
print(allowed_for_public_geocoder({"city": "Lima", "document_id": "D1"}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "egress_checklist.py",
          code: `ALLOWED = {"address", "city", "country"}
def allowed_for_public_geocoder(payload):
    return set(payload) <= ALLOWED
print(allowed_for_public_geocoder({"city": "Lima", "address": "Av 1"}))
print(allowed_for_public_geocoder({"city": "Lima", "document_id": "D1"}))`,
          output: `True
False`,
        },
      },
      {
        id: "S12-T4-B-E1",
        subtopicId: "S12-T4-B",
        kind: "guided",
        title: "Validar lat/lon antes del mapa",
        preamble:
          "- **Contexto:** coords inválidas (91°, lon 181) no entran al mapa ni al Haversine del caso.\n- **Meta:** `valid_lat_lon` con rangos WGS84.\n- **Éxito:** `(0,0) True`, `(91,0) False`, `(0,181) False`, `(-12.04,-77.04) True`.\n- **Límites:** no «corrijas» a 0,0; no uses redondeos mágicos.",
        instruction:
          "1. El starter solo valida lat.\n2. Agrega el rango de lon (-180 a 180).\n3. Recorre los cuatro pares e imprime par y booleano.\n4. No conviertas inválidos a cero.",
        hint: "Rangos WGS84 para lat y lon.",
        hints: [
          "Lat en [-90, 90] y lon en [-180, 180].",
          "Imprime el par y el booleano en cada caso.",
        ],
        edgeCases: ["91 inválido"],
        tests: "True False False True",
        feedback:
          "Validar **antes** de Haversine o de pintar evita el clásico pin en el Golfo de Guinea (0,0 «arreglado»). Fail-closed: rechaza el par inválido.",
        retrospective:
          "Rangos de lat/lon son el primer gate de calidad geo. Siguiente: fórmula Haversine con tolerancia (E2).",
        starterCode: {
          language: 'python',
          title: "valid_coords.py",
          code: `# CASO-LIM-012 · valid lat/lon
# DEFECT: no chequea lon
def valid_lat_lon(lat, lon):
    return -90 <= lat <= 90
for p in [(0,0), (91,0), (0,181), (-12.04, -77.04)]:
    print(p, valid_lat_lon(*p))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "valid_coords.py",
          code: `def valid_lat_lon(lat, lon):
    return -90 <= lat <= 90 and -180 <= lon <= 180
for p in [(0,0), (91,0), (0,181), (-12.04, -77.04)]:
    print(p, valid_lat_lon(*p))`,
          output: `(0, 0) True
(91, 0) False
(0, 181) False
(-12.04, -77.04) True`,
        },
      },
      {
        id: "S12-T4-B-E2",
        subtopicId: "S12-T4-B",
        kind: "independent",
        title: "Haversine con R=6371 y tolerancia",
        preamble:
          "- **Contexto:** la geoseñal del caso usa distancia esférica WGS84, no un atajo euclídeo.\n- **Meta:** implementar `haversine_km` y verificar ~111.19 km entre (0,0) y (0,1).\n- **Éxito:** imprimir **`111.19`** (no `111.0`) y `tolerance_ok` con `abs(d-111.19) < 0.05`.\n- **Límites:** R=6371.0; usa `math.radians` / sin / cos / asin / sqrt; el atajo *111 imprime `111.0` y **falla** el assert.",
        instruction:
          "1. El starter multiplica diferencia de lon por 111 (no es Haversine; imprime `111.0`).\n2. Implementa la fórmula del I Do / theory.\n3. Imprime `round(d, 2)` (debe ser `111.19`) y, si pasa la tolerancia estrecha, `tolerance_ok`.\n4. Conserva el assert del starter (`abs(d - 111.19) < 0.05`).",
        hint: "Fórmula esférica con R=6371 del curso.",
        hints: [
          "Convierte a radianes y usa la fórmula Haversine del demo.",
          "Necesitas sin, cos, asin y sqrt de math.",
        ],
        edgeCases: ["tolerancia 0.05 km (el *111 no pasa)"],
        tests: "111.19 + tolerance_ok (assert < 0.05)",
        feedback:
          "Test de tolerancia evita regresiones de fórmula en el capstone. Un atajo *111 solo «casi funciona» en el ecuador; la geoseñal del caso pide esférico.",
        retrospective:
          "Haversine esférico es la geoseñal del caso; el atajo `*111` solo «casi funciona» en el ecuador y falla en regresión. Pregunta: ¿qué imprime `round(d, 2)` con el starter roto? Luego (E3): empaquetar km como señal **sin** kinship.",
        starterCode: {
          language: 'python',
          title: "haversine_test.py",
          code: `# CASO-LIM-012 · haversine
# DEFECT: distancia euclídea * 111 (no haversine)
import math
def haversine_km(a, b):
    return abs(a[1] - b[1]) * 111.0
d = haversine_km((0.0, 0.0), (0.0, 1.0))
print(round(d, 2))
assert abs(d - 111.19) < 0.05
print("tolerance_ok")`,
        },
        solutionCode: {
          language: 'python',
          title: "haversine_test.py",
          code: `import math
def haversine_km(a, b):
    R = 6371.0
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(h))
d = haversine_km((0.0, 0.0), (0.0, 1.0))
print(round(d, 2))
assert abs(d - 111.19) < 0.05
print("tolerance_ok")`,
          output: `111.19
tolerance_ok`,
        },
      },
      {
        id: "S12-T4-B-E3",
        subtopicId: "S12-T4-B",
        kind: "transfer",
        title: "Distancia como geoseñal, no parentesco",
        preamble:
          "- **Contexto:** 1.2 km entre entidades sintéticas alimenta `relationship_signal_score` en S13; **no** es veredicto familiar ni de fraude.\n- **Meta:** `as_relationship_signal(km)` con `type`, `value` y `kinship_verdict=None`.\n- **Éxito:** dict para `1.2` con verdict `None` (nunca `True`).\n- **Límites:** no setees `is_family`; no inventes campos de fraud score aquí.",
        instruction:
          "1. El starter fuerza `kinship_verdict: True` (DEFECT ético).\n2. Cambia a `None`.\n3. Imprime el dict completo.\n4. Mantén `type='geo_distance_km'` y `value=km`.",
        hint: "Nunca autoetiquetes parentesco por cercanía.",
        hints: [
          "No setees is_family ni kinship_verdict=True.",
          "kinship_verdict siempre None en N1.",
        ],
        edgeCases: ["no parentesco automático"],
        tests: "verdict None",
        feedback:
          "Cercanía geográfica es **señal**, no prueba. Autoetiquetar parentesco colapsa el juicio humano y rompe la ética del capstone: la geoseñal alimenta el score de S13 sin veredicto.",
        retrospective:
          "Si puedes defender `verdict=None` en 30 segundos en una entrevista, cerraste el hilo geo de S12. El You Do integra HTTP + SQL + esta señal en un solo smoke path.",
        starterCode: {
          language: 'python',
          title: "geo_as_signal.py",
          code: `# CASO-LIM-012 · relationship signal
# DEFECT: inventa kinship_verdict True
def as_relationship_signal(km):
    return {
        "type": "geo_distance_km",
        "value": km,
        "kinship_verdict": True,
    }
print(as_relationship_signal(1.2))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "geo_as_signal.py",
          code: `def as_relationship_signal(km):
    return {
        "type": "geo_distance_km",
        "value": km,
        "kinship_verdict": None,
    }
print(as_relationship_signal(1.2))`,
          output: `{'type': 'geo_distance_km', 'value': 1.2, 'kinship_verdict': None}`,
        },
      },
    ],
  },
  youDo: {
    title: "Adaptadores HTTP + SQLite + geoevidencia (CP-N1-C)",
    context:
      "Integra el hilo completo de S12 en un solo script de adquisición: cliente HTTP mock (simulación del proveedor) con timeout/paginación/retry selectivo (política N1: solo 429/503), secretos por env (variables de entorno), caché GET y provenance sin tokens. Persiste en SQLite parametrizado (tablas `clients` / `transactions` / `evidence`) y geocodifica con **MockGeocoder** + allowlist de egress (lista de campos permitidos para salir al proveedor; sin PII bancaria). Solo datos sintéticos Quito/Santiago e ids `C00x`. El `main()` del starter es un smoke path (un recorrido que verifica que todo cablea): al implementar cada stub (cada función con `NotImplementedError`), debe imprimir `token_len`, `retry`, `entity`, `cache_hits`, `provenance`, `normalize`, `egress ok/bad`, `geo`, `km` y `case_row`. En **S13** se cierra el dashboard de evidencia y la regresión de nivel 1 — aquí no construyas el dashboard. Antes de marcar listo, responde las tres preguntas de la retrospectiva y alinea las capturas del portfolioNote.",
    objectives: [
      "Cliente get_entity + should_retry N1 (429/503) y timeout en la interfaz",
      "Caché GET + min_provenance sin secretos",
      "Esquema SQLite + case_join (name, amount, kind) + seeds",
      "MockGeocoder + allowlist de egress + Haversine como geoseñal (no parentesco)",
      "Smoke path en main() con todos los stubs cableados",
    ],
    requirements: [
      "Timeout obligatorio en la interfaz del cliente (simulado o real)",
      "SQL solo con placeholders `?`",
      "Sin tokens en logs/provenance",
      "Geocoder mock/autorizado; sin PII bancaria a servicios públicos",
      "Datos sintéticos latam (example.com / Lima / Quito)",
      "Demo offline reproducible (fallback local)",
    ],
    starterCode: `"""cp_n1c_acquisition.py — CP-N1-C incremento S12
HTTP mock + SQLite + MockGeocoder. Datos sintéticos únicamente.
Integra: token env, retry N1, caché GET, provenance, join SQL, egress, Haversine.
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
import sqlite3
from typing import Any, Optional


def require_token(env: dict) -> str:
    # DEFECT: NotImplemented — lee API_TOKEN o ValueError
    raise NotImplementedError


def should_retry(status: int) -> bool:
    # DEFECT: NotImplemented — True solo para 429 y 503
    raise NotImplementedError


def get_entity(store: dict, entity_id: str) -> tuple[int, dict]:
    # DEFECT: NotImplemented — (200, body) o (404, {"error": "not_found"})
    raise NotImplementedError


def cached_get(cache: dict, url: str, body_factory) -> tuple[dict, bool]:
    # DEFECT: NotImplemented — (body, cache_hit); almacena en cache por url
    raise NotImplementedError


def min_provenance(url: str, status: int, cache_hit: bool) -> dict:
    # DEFECT: NotImplemented — source_url, fetched_at, status_code, cache_hit (sin token)
    raise NotImplementedError


def normalize_address(s: str) -> str:
    # DEFECT: NotImplemented — strip + colapsar espacios (sin .title())
    raise NotImplementedError


def allowed_for_public_geocoder(payload: dict) -> bool:
    # DEFECT: NotImplemented — allowlist {address, city, country}
    raise NotImplementedError


class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Quito": (-0.1807, -78.4678)}

    def geocode(self, city: str) -> Optional[dict]:
        # DEFECT: NotImplemented — dict con lat/lon/provider o None
        raise NotImplementedError


def haversine_km(a: tuple[float, float], b: tuple[float, float]) -> float:
    # DEFECT: NotImplemented — R=6371, fórmula haversine
    raise NotImplementedError


def as_relationship_signal(km: float) -> dict:
    # DEFECT: NotImplemented — type/value/kinship_verdict=None
    raise NotImplementedError


def build_db() -> sqlite3.Connection:
    con = sqlite3.connect(":memory:")
    # DEFECT: falta CREATE clients / transactions / evidence + índice document_id
    # CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT, document_id TEXT UNIQUE);
    # CREATE TABLE transactions(id TEXT PRIMARY KEY, client_id TEXT, amount REAL);
    # CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT, kind TEXT);
    return con


def case_join(con: sqlite3.Connection) -> Optional[tuple]:
    # DEFECT: NotImplemented — JOIN name, amount, kind para C001
    raise NotImplementedError


def main() -> None:
    os.environ.setdefault("API_TOKEN", "syn-demo")
    print("token_len", len(require_token(dict(os.environ))))
    print("retry 429", should_retry(429))
    print("retry 500", should_retry(500))
    store = {"C001": {"id": "C001", "region": "Lima"}}
    print("entity", get_entity(store, "C001"))
    cache: dict = {}
    body, hit1 = cached_get(cache, "https://api.example.com/s", lambda: {"ok": True})
    _, hit2 = cached_get(cache, "https://api.example.com/s", lambda: {"ok": True})
    print("cache_hits", hit1, hit2)
    print("prov", min_provenance("https://api.example.com/s", 200, hit2))
    print("norm", normalize_address("  av  larco  1 "))
    print("egress_ok", allowed_for_public_geocoder({"city": "Lima", "address": "Av 1"}))
    print("egress_bad", allowed_for_public_geocoder({"city": "Quito", "document_id": "D1"}))
    print("geo", MockGeocoder().geocode("Lima"))
    km = round(haversine_km((-12.0464, -77.0428), (-12.05, -77.125)), 2)
    print("km", km)
    print("signal", as_relationship_signal(km))
    con = build_db()
    # seed mínimo tras CREATE: insert C001 + tx + evidence geo
    print("case_row", case_join(con))
    con.close()


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "En el README del portafolio muestra tres capturas o bloques: (1) el manifest de provenance (el diccionario con la traza de origen) sin token (`token_logged` / sin Authorization), (2) el join de caso SQLite con name/amount/kind, (3) la distancia Lima–Callao (~8.95 km) como geoseñal con el disclaimer `signal != kinship` (aviso de que la distancia es señal, no parentesco). Eso evidencia el incremento CP-N1-C de S12 y se enlaza limpio al dashboard de S13.",
    rubric: [
      { criterion: "HTTP status/JSON/timeout/retry selectivo", weight: "20%" },
      { criterion: "Auth env + caché + provenance sin secretos", weight: "15%" },
      { criterion: "SQL parametrizado + transacciones + join", weight: "25%" },
      { criterion: "Geocoder mock + política de egress", weight: "20%" },
      { criterion: "Haversine como señal (no veredicto) + demo offline", weight: "20%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué status de la política N1 (429/503/400/500/404) demuestras con un print o test (`should_retry` / `get_entity`)? (2) ¿el manifest de provenance puede pegarse en un README sin filtrar secreto? (3) Escribe una frase de impacto medible (p. ej. «join C001 + 8.95 km como señal, sin kinship») que puedas defender en 30 segundos frente a S13. Datos solo sintéticos; egress sin PII bancaria.",
  },
  selfCheck: {
    questions: [
      {
        question: "Un 400 Bad Request del proveedor debe…",
        options: ["Reintentarse con backoff infinito", "Ignorarse como 200", "Borrar el caché", "Tratarse como error de cliente (no retry ciego)"],
        correctIndex: 3,
        explanation:
          "4xx de cliente no son transitorios; reintentar no corrige el request.",
      },
      {
        question: "¿Dónde debe vivir el token de API?",
        options: ["Hardcodeado en el repo", "En variable de entorno / secret store", "En el log de provenance", "En la URL pública del geocoder"],
        correctIndex: 1,
        explanation:
          "Secretos fuera de código; nunca en logs ni git.",
      },
      {
        question: "SQL con f-string e input de usuario es…",
        options: ["La forma recomendada en SQLite", "Obligatorio para índices", "Inyección / inseguro; usar placeholders `?`", "Necesario para JOIN"],
        correctIndex: 2,
        explanation:
          "Placeholders parametrizados (los signos `?` de SQL) previenen la inyección, porque el input se trata como dato, no como código.",
      },
      {
        question: "Enviar document_id bancario a un geocoder público…",
        options: ["Viola la política de egress de CP-N1-C", "Está permitido si hay timeout", "Mejora el Haversine", "Es requerido por SQLite"],
        correctIndex: 0,
        explanation:
          "La política de egress (qué sale al proveedor) permite solo dirección/ciudad sintética; nunca PII bancaria como `document_id`.",
      },
      {
        question: "1.2 km entre dos entidades sintéticas implica…",
        options: ["Parentesco automático", "Fraude confirmado", "Borrar el ER score", "Una geoseñal de relación, no un veredicto"],
        correctIndex: 3,
        explanation:
          "Haversine alimenta `relationship_signal_score` (el score de relación); no es kinship (parentesco) ni fraude automático.",
      },
      {
        question: "Al paginar una API con `next`, ¿cuándo dejas de pedir la siguiente página?",
        options: ["Después de exactamente 3 páginas siempre", "Cuando `next is None` (o el cursor final)", "Cuando el status es 429", "Nunca: hay que traer todo en un solo GET"],
        correctIndex: 1,
        explanation:
          "La paginación termina cuando el proveedor indica fin de colección (`next is None` / sin cursor).",
      },
      {
        question: "En un batch dentro de BEGIN, un IntegrityError a mitad del camino con rollback correcto deja…",
        options: ["Las filas insertadas antes del error", "Solo la última fila ofensora", "COUNT(*) == 0 (estado atómico revertido)", "La base en modo offline"],
        correctIndex: 2,
        explanation:
          "ROLLBACK deshace todo el batch (el lote de inserts): no quedan filas huérfanas a medias.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "urllib.request — Extensible library for opening URLs",
        url: "https://docs.python.org/3/library/urllib.request.html",
        note: "HTTP síncrono stdlib; curso prioriza mocks + status/JSON",
      },
      {
        label: "sqlite3 — DB-API 2.0 interface for SQLite",
        url: "https://docs.python.org/3/library/sqlite3.html",
        note: "placeholders, transactions, PRAGMA",
      },
      {
        label: "http — HTTP modules",
        url: "https://docs.python.org/3/library/http.html",
        note: "status codes semánticos 2xx/4xx/5xx",
      },
      {
        label: "math — Mathematical functions",
        url: "https://docs.python.org/3/library/math.html",
        note: "Haversine con sin/cos/asin",
      },
      {
        label: "json — JSON encoder and decoder",
        url: "https://docs.python.org/3/library/json.html",
        note: "parse seguro; JSONDecodeError fail-closed",
      },
      {
        label: "hashlib — Secure hashes",
        url: "https://docs.python.org/3/library/hashlib.html",
        note: "claves de caché de URL GET",
      },
      {
        label: "OWASP — SQL Injection",
        url: "https://owasp.org/www-community/attacks/SQL_Injection",
        note: "por qué placeholders, no f-strings",
      },
      {
        label: "RFC 7231 — HTTP Semantics",
        url: "https://httpwg.org/specs/rfc7231.html",
        note: "método, status, retry semantics",
      },
    ],
    books: [
      {
        label: "Python Cookbook — network/data recipes",
        note: "Adaptar a mocks y provenance; no PII real.",
      },
      {
        label: "Designing Data-Intensive Applications (Kleppmann)",
        note: "Contratos, reintentos y datos derivados; límites N1.",
      },
    ],
    courses: [
      {
        label: "Real Python — Working with JSON",
        url: "https://realpython.com/python-json/",
        note: "Parse seguro con fixtures locales.",
      },
      {
        label: "Real Python — SQLite",
        url: "https://realpython.com/python-sql-libraries/#sqlite",
        note: "CRUD local y conexiones.",
      },
      {
        label: "MDN — HTTP status codes",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
        note: "mapa mental 2xx/4xx/5xx.",
      },
      {
        label: "PyArcana live",
        url: "https://pillb.github.io/pyarcana/",
        note: "Sitio público del curso para navegar S12 en contexto del roadmap.",
      },
    ],
  },
}
