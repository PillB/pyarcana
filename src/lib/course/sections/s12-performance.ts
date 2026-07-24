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
    "En onboarding, compliance y data quality en bancos, fintech y retail en Perú, el pipeline no empieza en el dashboard: empieza en **adaptadores HTTP resilientes** que leen señales con timeout y retry selectivo, un **SQLite local parametrizado** que une entidad y evidencia, y **geoevidencia controlada** sin filtrar PII bancaria a geocoders públicos. Un analista que hardcodea el token, reintenta un 400 o manda `document_id` a un proveedor gratis quema cuota, rompe auditoría y expone datos. Esta sección construye el tramo de **adquisición + geoevidencia del capstone CP-N1-C** con mocks locales y datos sintéticos (Lima/Arequipa, ids `C00x`): status y JSON, secretos fuera de código, joins con placeholders y geocoding autorizado — listo para el dashboard de S13.",
  learningOutcomes: [
    { text: "Consumir APIs HTTP síncronas, interpretar status y parsear JSON con errores controlados" },
    { text: "Implementar timeout obligatorio, paginación y retry/backoff solo en errores transitorios" },
    { text: "Autenticar con secretos fuera de código, cachear GET seguros y registrar provenance" },
    { text: "Escribir contract tests del adaptador y fallback degradado offline" },
    { text: "Diseñar esquema SQLite mínimo y ejecutar CRUD + join entidades/evidencias" },
    { text: "Usar queries parametrizadas, transacciones, constraints e índices; prohibir f-string SQL" },
    { text: "Normalizar direcciones sintéticas y usar solo geocoder autorizado/mock" },
    { text: "Evaluar calidad de coordenadas, Haversine y cache bajo política de proveedor" },
  ],
  theory: [
    {
      heading: "Mapa de la sección: HTTP, SQL y geodatos responsables",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1; el resto profundiza cada término). **Status code:** código HTTP de la respuesta (2xx éxito, 4xx error de cliente, 5xx error de servidor). **Timeout:** tiempo máximo de espera por request — en un cliente real siempre pasas `timeout=`. **Retry/backoff:** reintentar solo errores **transitorios** (en N1: 429 y 503) con espera creciente. **Provenance (traza de origen):** metadatos del fetch (`source_url`, `fetched_at`, `status_code`, `cache_hit`) **sin** secretos. **SQL parametrizado:** placeholders `?` en lugar de f-strings con input. **Geocoder autorizado/mock:** proveedor permitido o simulado. **Egress (salida de datos):** qué campos pueden salir a un servicio externo. **Geoseñal:** distancia u otra métrica geo que alimenta un score de relación — **no** es parentesco ni fraude. **Fail-closed (falla cerrado):** si el contrato falla, se detiene; no se inventan filas ni coordenadas.",
        "Imagina el onboarding de un caso sintético en Lima: un proveedor te lista señales por HTTP, tú las guardas en SQLite local y calculas una distancia a Callao para el score de relación. El hilo conductor es ese **adaptador de señales sintéticas** (entidades, evidencias, coordenadas) con timeout, cache, provenance y fallback offline. Construyes el incremento de **adquisición y geoevidencia del capstone CP-N1-C**: cliente HTTP síncrono resiliente, SQLite parametrizado y geocoder mock/autorizado **sin PII bancaria a servicios públicos**. Solo datos sintéticos latam (`example.com`, Lima/Arequipa, ids `C00x`). Si el schema del JSON o del SQL no cuadra, **falla cerrado**.",
        "Orden del aprendizaje: **T1 HTTP** (status, JSON, timeout, paginación, retry) → **T2 Auth/cache/contratos** (secretos en env, provenance, fallback) → **T3 SQL** (CRUD, join, placeholders, transacciones) → **T4 Geodatos responsables** (normalize, egress, Haversine como señal). Gate de la sección: adaptador con status/retry selectivo + join local de caso + geoseñal documentada. En **S13** armarás el dashboard de evidencia; aquí cierras la adquisición. Nunca tokens en logs ni claims de parentesco/fraude. Profiling y concurrency de producción se tratan más adelante en el tramo de sistemas — no son el foco de esta semana."
      ],
      callout: {
        type: "info",
        title: "Qué entregas al final de S12",
        content:
          "Un adaptador HTTP + almacén SQLite + geocoder mock con provenance y política de egress. Gate: status→acción N1, join de caso y geoseñal Lima–Callao con disclaimer. Datos sintéticos únicamente; nunca PII real ni tokens en logs.",
      },
    },
    {
      heading: "requests/responses, status y JSON",
      subtopicId: "S12-T1-A",
      paragraphs: [
        "Un cliente HTTP síncrono hace **GET/POST**, recibe un **status code** y un cuerpo (a menudo JSON). En este curso usamos un **cliente mock** o `urllib` con fixtures: la pedagogía es **status primero, body después**, no pelear con la librería de red del día. Si el status no es 2xx, no asumas que el JSON “tiene sentido” — un 404 puede traer un mensaje de error o un cuerpo vacío.",
        "**2xx** = éxito; **4xx** = error del cliente (no reintentes a ciegas: el id o el payload están mal); **5xx** = error del servidor. En N1 el retry selectivo se limita a **429** y **503** (más timeouts de red); un **500** se registra como `fail_server` y no se reintenta a ciegas en los ejercicios (en producción a veces sí se reintenta con límite, pero aquí forzamos selectividad). Parsea con manejo de cuerpo vacío o JSON inválido: un `json.JSONDecodeError` es **fail-closed** (falla cerrado), no un dict inventado.",
        "**Timeout es obligatorio** (lo modelamos en T1-B): en un cliente real siempre pasas `timeout=` (segundos); sin él un socket colgado congela el pipeline de CP-N1-C. Headers (`Accept`, `User-Agent`) documentan el contrato del adaptador. Caso sintético `CASO-LIM-012`: store `{\"C001\": {...}}` → 200 con keys `id/region/score` o 404 con body `error`; cuerpo basura → `parse_json_body` devuelve `None`. **Qué observar en el demo:** status y body van juntos en la tupla de respuesta; el parse inválido no inventa claves."
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
        "Ya sabes leer status y JSON; ahora el adaptador no se cuelga ni se come mil filas de un golpe. **Timeout** acota la espera por request. En un cliente real pasas siempre `timeout=` (p. ej. `urlopen(req, timeout=5)` o el equivalente del SDK); aquí lo modelamos como `cost_s` vs `timeout_s` para tests deterministas sin red. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez al heap — crítico cuando el proveedor lista miles de señales sintéticas para el caso.",
        "**Retry/backoff** solo en errores **transitorios**: **429**, **503** y timeouts de red en este curso (**política N1**). Otros **5xx** pueden reintentarse en producción con límite, pero el contrato de ejercicios usa `{429, 503}` para forzar selectividad. Un **400** o **404** no se reintenta: reintentar no repara un id mal formado. Respeta `Retry-After` cuando exista y un **max_retries** duro (p. ej. 3). La función `should_retry` y la tabla `status_action` deben contar la misma historia.",
        "Rate limit: duerme entre páginas o respeta cuotas del proveedor. En demo usamos contador de delays en lugar de `time.sleep` real para tests deterministas. Caso sintético: páginas 1→2→3 con `next` y `rate_limit_pauses == 2`; cuando **`next is None`**, dejas de pedir la siguiente página. **Qué observar:** el bucle termina por contrato del proveedor, no por un contador mágico de “siempre 3 páginas”."
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
      heading: "Auth, secretos, cache y provenance",
      subtopicId: "S12-T2-A",
      paragraphs: [
        "Con el cliente resiliente en T1, el siguiente riesgo profesional es filtrar el secreto. Autenticación **Bearer** (o basic) lee el token de **variable de entorno** / secret store, nunca hardcodeado en el repo ni en un notebook compartido. Si falta `API_TOKEN`, **falla cerrado** con mensaje claro — no envíes requests anónimos “por si acaso” ni uses un token de demo pegado en el código que mañana se commitea.",
        "**Cache de GET** por hash de URL (o la URL misma en demos) con **TTL** reduce costo y latencia; no caches respuestas de escritura ni PII sin política. Invalida o no reutilices si el status no fue 2xx. El segundo hit al mismo URL debe marcar `cache_hit=True` sin volver a “pegarle” al mock.",
        "**Provenance (traza de origen)**: cada fetch deja `source_url`, `fetched_at`, `status_code`, `cache_hit` (y a veces `body_sha12` o `auth_scheme`). **Nunca loguees el token** ni el header Authorization: solo un booleano `token_present` o la longitud. Caso sintético: segundo `cached_get` a `https://api.example.com/signals` → `cache_hit=True`; el manifest de provenance no contiene la cadena del token. **Qué observar:** `token_len` sí; el valor del token, no."
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
        "Ya tienes secretos y provenance; ahora blindas el adaptador contra el schema del proveedor. Un **contract test** fija las claves obligatorias del JSON (fixture). Si el schema cambia (`lat` renombrado a `latitude`), el test falla **antes** de producción y del dashboard de S13 — mejor un assert rojo en CI que un mapa con huecos silenciosos.",
        "**Fallback degradado**: si 5xx o red caída, lee coordenadas/precomputados locales y marca `mode=offline` (o `offline_fallback`) en provenance. No finjas éxito online: la traza debe decir la verdad al auditor. **Falla suave, traza dura** (*fail soft, trace hard*): el pipeline sigue con datos locales, pero no miente sobre el origen.",
        "Feature flag offline permite demos reproducibles sin red — **obligatorio** en CP-N1-C y en entrevistas técnicas donde “demo con internet” falla. Caso sintético: `assert_contract` exige `{\"lat\",\"lon\",\"label\"}`; `geocode(..., online=True)` → `mode=online`; `online=False` → `mode=offline_fallback`. **Qué observar:** el contrato falla en falta de `lon`; el fallback no reescribe el modo a online."
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

fix = {"lat": -16.4090, "lon": -71.5375, "label": "Arequipa"}
print("contract", assert_contract(fix))
print("online", geocode("Lima", online=True)["mode"])
print("offline", geocode("Sucursal-Norte", online=False)["mode"])`,
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
        "Con el adaptador HTTP listo, las señales no viven solo en memoria del proceso: las **persistes** para el caso. SQLite vía `sqlite3` basta para el almacén local de CP-N1-C: tablas `clients`, `transactions`, `evidence` (nombres alineados al dominio de S11). Archivo `:memory:` en demos o `case.db` local — sin servidor remoto ni ORM en esta sección.",
        "CRUD = CREATE/INSERT/SELECT/UPDATE (DELETE con cuidado y soft-delete si hace falta auditoría). El **JOIN** une evidencias a entidades por `entity_id` (y transacciones por `client_id`) para armar la ficha del caso que el dashboard de S13 consumirá. Prefer **placeholders `?`** desde el primer INSERT: el hábito de parametrizar se aprende antes del ejercicio de inyección en T3-B.",
        "Empieza transacciones explícitas cuando un caso toca varias filas; en T3-B profundizamos COMMIT/ROLLBACK e índices. Caso sintético: insert `C001` + evidence `geo` → JOIN devuelve `[('Ana Demo', 'geo')]`. **Qué observar:** el resultado es una lista de tuplas (nombre, kind), no un string suelto; el join falla en silencio solo si olvidaste el `entity_id` correcto."
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
          "Documenta entity_id aunque no actives FOREIGN KEY en SQLite; la integridad empieza en el modelo. Usa placeholders `?` desde el primer INSERT.",
      },
    },
    {
      heading: "Parámetros, transacciones, constraints e índices",
      subtopicId: "S12-T3-B",
      paragraphs: [
        "El join de T3-A asume datos limpios; ahora blindas integridad e inyección. Usa placeholders `?` (o `:name` con `Connection.row_factory`). **Prohibido** armar SQL con f-strings de input de usuario: es el camino clásico a inyección (OWASP) aunque “solo sea un id sintético”. El input `C001' OR '1'='1` no debe devolver filas ajenas.",
        "`executemany` + `BEGIN`/`COMMIT` hacen batch **atómico**; un `UNIQUE` roto → `ROLLBACK` y `COUNT(*)==0`. No dejes la DB a medias con 2 de 3 inserts “casi ok”: en compliance, un estado parcial es peor que un fallo ruidoso. Reporta la fila ofensora en el log de aplicación, no en el SQL interpolado.",
        "`UNIQUE`/`NOT NULL` e **índices** en `document_id` / `entity_id` aceleran lookups del caso y documentan el modelo. Caso sintético: batch `C001/D-100`, `C002/D-200`, `C003/D-100` (duplicado) → status `rolled_back` y count `0`. **Qué observar en el demo:** la tupla `('rolled_back', 0)` es la promesa de atomicidad; si ves count `2`, olvidaste el rollback."
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
          "Nunca interpoles input en SQL. Siempre `?` y tupla de params.",
      },
    },
    {
      heading: "Normalización y geocoding autorizado",
      subtopicId: "S12-T4-A",
      paragraphs: [
        "Con HTTP y SQL listos, la geoevidencia cierra el incremento CP-N1-C — pero con ética de egress. Normaliza direcciones sintéticas: **trim + colapsar espacios** (contrato N1). El title-case es política opcional del proveedor; en los ejercicios de S12 **no** lo exijas a menos que el enunciado lo pida (el mock puede usar `.title()` solo para la **clave de lookup** de ciudad). No inventes campos (distrito, ubigeo) que no vinieron en el payload: el invento silencioso contamina geoevidencia y el score de S13.",
        "Solo **geocoder autorizado/mock**. Política del curso: **no envíes PII bancaria** (docs, cuentas, montos, nombres completos si la política lo prohíbe) a proveedores públicos gratuitos. El payload mínimo es ciudad/dirección sintética autorizada. **Egress (salida de datos)** hacia un proveedor externo se gobierna con allowlist de claves: `ALLOWED = {\"address\", \"city\", \"country\"}`. Si aparece `document_id`, `allowed_for_public_geocoder` devuelve `False`.",
        "`MockGeocoder` devuelve lat/lon fijos por ciudad de demo (Sucursal-Sur, Arequipa) para demos offline reproducibles; ciudad desconocida (Cusco en el ejercicio) → `None` (fail-closed). Caso sintético: `normalize_address(\"  av.  larco  123  \")` → `'av. larco 123'`; `geocode(\"lima\")` → coords de Plaza de Armas demo. **Qué observar:** normalize no cambia capitalización; el geocode de ciudad desconocida no inventa un punto en el mapa."
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
        "Sucursal-Centro": (-12.0464, -77.0428),
        "Arequipa": (-16.4090, -71.5375),
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
geo {'city': 'Oficina-Este', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}`,
      },
      callout: {
        type: "warning",
        title: "Política de egress (salida de datos)",
        content:
          "Checklist: ¿el payload al proveedor incluye solo dirección/ciudad sintética autorizada? Si no, bloquea.",
      },
    },
    {
      heading: "Calidad de coordenada, Haversine, caching y política",
      subtopicId: "S12-T4-B",
      paragraphs: [
        "Tienes coords del mock; antes de medir, valida **lat ∈ [-90, 90]** y **lon ∈ [-180, 180]**. Coordenadas basura (91°, NaN, strings) no entran al mapa ni al score de relación. Fail-closed: rechaza el par, no “corrige” a 0,0 (Golfo de Guinea) — ese “arreglo” ha generado mapas absurdos en producción real.",
        "**Haversine** estima km entre dos puntos WGS84 con radio R=6371 km en este curso; sirve como **geoseñal de relación** en el score de matching, no como veredicto de parentesco o fraude. Empaqueta el resultado como `{\"type\": \"geo_distance_km\", \"value\": km, \"kinship_verdict\": None}` (o `verdict: None`). Documenta unidades (km) y el radio usado.",
        "Cachea geocodes bajo TTL/política del proveedor para no quemar cuota (misma idea de cache GET de T2-A). Distancia es **señal**, no kinship. Caso sintético: Oficina-Oeste–Callao ≈ **8.95 km** → alimenta `relationship_signal_score` en S13, jamás `is_family=True` automático. **Qué observar:** `valid True` / `invalid False` para (91, 0); el disclaimer `signal != kinship` no es adorno — es la línea ética del capstone."
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
          "1.2 km entre entidades es geoseñal; jamás auto-etiqueta is_family o fraude.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos locales del hilo CP-N1-C en orden de pipeline: (1) mock HTTP status→JSON, (2) paginación con rate-limit conceptual, (3) provenance sin token, (4) contract/fallback offline, (5) join de caso SQLite, (6) batch atómico con rollback, (7) MockGeocoder fail-closed, (8) Haversine Cliente-A–Callao como geoseñal (no parentesco). Lee description + why de cada demo: modelan el razonamiento del experto (status antes que body, traza honesta, atomicidad, ética geo) antes de los micro-defectos del We Do.",
    steps: [
      {
        demoId: "S12-T1-A-DEMO",
        subtopicId: "S12-T1-A",
        environment: "local-python",
        description: "Piensa en voz alta: el adaptador pide señales, mira el status primero y solo entonces parsea el JSON. Si el status no es 2xx, no confíes en el body. Observa count=2 y kinds shared_phone/geo — el mock fija el contrato sin red.",
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
        why: "Orden experto: status antes que body. El mock aísla el contrato (status + JSON) sin red externa.",
      },
      {
        demoId: "S12-T1-B-DEMO",
        subtopicId: "S12-T1-B",
        environment: "local-python",
        description: "Pipeline de paginación: while next no es None, acumula items y cuenta pausas de rate-limit (sin sleep real). Observa items 1..5 y rate_limit_pauses=2: dos saltos de página, no tres sleeps al final.",
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
        why: "Paginación + respeto de ritmo: no traes todo de un golpe y no martillas al proveedor entre páginas.",
      },
      {
        demoId: "S12-T2-A-DEMO",
        subtopicId: "S12-T2-A",
        environment: "local-python",
        description: "Tras un fetch: arma provenance (url, timestamp, status, hash del body, auth_scheme, token_present). El valor del token nunca entra al log — solo token_present=true y token_logged False al final.",
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
        why: "Provenance (traza de origen) auditable sin filtrar secretos: el token existe en env, no en el log.",
      },
      {
        demoId: "S12-T2-B-DEMO",
        subtopicId: "S12-T2-B",
        environment: "local-python",
        description: "Contract test del geocoder mock + fallback a coordenadas precalculadas. Observa mode=online vs mode=offline_fallback: mismo lat/lon de Cliente-B, traza distinta — el auditor ve la verdad.",
        code: {
          language: 'python',
          title: "geocoder_contract_demo.py",
          code: `REQUIRED = {"lat", "lon", "provider"}
PRECALC = {"Sucursal-Norte": {"lat": -12.0464, "lon": -77.0428, "provider": "precalc"}}

def contract_ok(d):
    return not (REQUIRED - set(d.keys()))

def geocode(city, fail_online=False):
    if fail_online:
        return {**PRECALC[city], "mode": "offline_fallback"}
    online = {"lat": -12.0464, "lon": -77.0428, "provider": "mock", "mode": "online"}
    assert contract_ok(online)
    return online

print("online", geocode("Sucursal-Sur"))
print("fallback", geocode("Sucursal-Centro", fail_online=True))
print("contract_precalc", contract_ok(PRECALC["Oficina-Este"]))`,
          output: `online {'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock', 'mode': 'online'}
fallback {'lat': -12.0464, 'lon': -77.0428, 'provider': 'precalc', 'mode': 'offline_fallback'}
contract_precalc True`,
        },
        why: "Contrato + fallback hacen demos reproducibles cuando el proveedor no responde.",
      },
      {
        demoId: "S12-T3-A-DEMO",
        subtopicId: "S12-T3-A",
        environment: "local-python",
        description: "Tablas clients, transactions, evidence: une nombre + monto + kind de evidencia en una sola fila de caso. Observa case_row ('Ana', 120.5, 'geo') — ficha mínima para el dashboard de S13.",
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
        why: "Experto une tres tablas para la ficha de caso: nombre + monto + kind de evidencia. Ese join es el almacén local del dashboard (S13).",
      },
      {
        demoId: "S12-T3-B-DEMO",
        subtopicId: "S12-T3-B",
        environment: "local-python",
        description: "Batch atómico: BEGIN → varios INSERT → si UNIQUE rompe (DOC1 duplicado en C003), ROLLBACK y COUNT(*) vuelve a 0. Observa atomic_rollback + count 0: nada a medias.",
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
        why: "Transacciones evitan estados a medias: el UNIQUE roto revierte todo el batch (count 0).",
      },
      {
        demoId: "S12-T4-A-DEMO",
        subtopicId: "S12-T4-A",
        environment: "local-python",
        description: "MockGeocoder autorizado: Oficina-Oeste y Arequipa devuelven lat/lon fijos; Iquitos → None (fail-closed, no inventa punto). Observa provider=authorized_mock y la ausencia de PII en el payload.",
        code: {
          language: 'python',
          title: "mock_cities_demo.py",
          code: `class MockGeocoder:
    DB = {"Cliente-A": (-12.0464, -77.0428), "Cliente-B": (-16.4090, -71.5375)}
    def geocode(self, city):
        if city not in self.DB:
            return None
        lat, lon = self.DB[city]
        return {"city": city, "lat": lat, "lon": lon, "provider": "authorized_mock"}

g = MockGeocoder()
for c in ("Sucursal-Norte", "Sucursal-Sur", "Iquitos"):
    print(c, g.geocode(c))`,
          output: `Sucursal-Centro {'city': 'Oficina-Este', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'authorized_mock'}
Oficina-Oeste {'city': 'Cliente-A', 'lat': -16.409, 'lon': -71.5375, 'provider': 'authorized_mock'}
Iquitos None`,
        },
        why: "Geocoder intercambiable y offline para demos sin egress de PII.",
      },
      {
        demoId: "S12-T4-B-DEMO",
        subtopicId: "S12-T4-B",
        environment: "local-python",
        description: "Calcula ~8.95 km Cliente-B–Callao y empaquétalos como geoseñal (type/value/verdict=None). Nunca auto-etiquetes parentesco o fraude: el disclaimer signal != kinship es parte del entregable.",
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
        why: "La distancia alimenta relationship_signal_score en S13; verdict=None deja el juicio humano intacto.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (E1 guiado / E2 independiente / E3 transferencia) por los 8 subtemas, en el mismo orden del I Do. Alcance de S12: mocks HTTP conceptuales + `sqlite3` + Haversine (`math`); datos sintéticos (`CASO-LIM-012`, ids `C00x`). No RPA ni dashboard de S13; no NumPy de S14. Conserva asserts y fixtures del starter — cada starter trae **un defecto claro** (DEFECT). Dos pistas por ejercicio. Política N1 de retry: solo 429 y 503; normalize de dirección = espacios, sin `.title()`.",
    steps: [
      {
        id: "S12-T1-A-E1",
        subtopicId: "S12-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Implementa `get_entity(store, entity_id)` que devuelva `(status, body)`. Si el id existe: `200` y el dict del store; si no: `404` y `{'error':'not_found'}`. Fixture: `store = {'C001': {'id':'C001','region':'Sucursal-Norte'}}`. Salida/pass: `(200, {'id': 'C001', 'region': 'Sucursal-Sur'})` y luego `(404, {'error': 'not_found'})`.",
        hint: "Devuelve una tupla (status_code, dict).",
        hints: [
          "Devuelve una tupla (status_code, dict).",
          "404 no lanza excepción: el adaptador decide la acción.",
        ],
        edgeCases: ["404 body estable", "id existente"],
        tests: "200 con dict; 404 con error",
        feedback: "Status explícito evita try/except ruidosos en el caller.",
        starterCode: {
          language: 'python',
          title: "get_entity.py",
          code: `# CASO-LIM-012 · get_entity
# DEFECT: siempre 200 y body vacío
store = {"C001": {"id": "C001", "region": "Sucursal-Centro"}}
def get_entity(store, entity_id):
    return 200, {}
print(get_entity(store, "C001"))
print(get_entity(store, "C999"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "get_entity.py",
          code: `store = {"C001": {"id": "C001", "region": "Oficina-Este"}}
def get_entity(store, entity_id):
    if entity_id not in store:
        return 404, {"error": "not_found"}
    return 200, store[entity_id]
print(get_entity(store, "C001"))
print(get_entity(store, "C999"))`,
          output: `(200, {'id': 'C001', 'region': 'Oficina-Oeste'})
(404, {'error': 'not_found'})`,
        },
      },
      {
        id: "S12-T1-A-E2",
        subtopicId: "S12-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Dado un `payload` dict de respuesta, implementa `parse_entity(payload)` que exija las claves `id` y `region`. Si faltan o el tipo no es dict, devuelve `None`. Si están, devuelve un dict nuevo solo con esas dos claves (ignora extras). Caso: payload con extra → `{'id':'C001','region':'Cliente-A'}`; payload incompleto → `None`.",
        hint: "Usa set de required keys.",
        hints: [
          "Usa set de required keys.",
          "No mutes el payload original; construye un dict nuevo.",
        ],
        edgeCases: ["clave faltante", "extra ignorado"],
        tests: "dict tipado o None",
        feedback: "Parse estricto reduce basura aguas abajo.",
        starterCode: {
          language: 'python',
          title: "parse_entity.py",
          code: `# CASO-LIM-012 · parse_entity
# DEFECT: no valida keys; devuelve payload crudo
def parse_entity(payload):
    return payload
print(parse_entity({"id": "C001", "region": "Cliente-B", "extra": 1}))
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
print(parse_entity({"id": "C001", "region": "Sucursal-Norte", "extra": 1}))
print(parse_entity({"id": "C001"}))`,
          output: `{'id': 'C001', 'region': 'Sucursal-Sur'}
None`,
        },
      },
      {
        id: "S12-T1-A-E3",
        subtopicId: "S12-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Implementa `status_action(code)` con la política N1: 200→`use_body`, 404→`missing`, 429→`retry`, 503→`retry`, 400→`fix_client`, 500→`fail_server`. Cualquier otro código → `unknown`. Imprime la acción para `[200, 404, 429, 400, 500, 503]`. Salida/pass: una línea por código con la acción correcta.",
        hint: "if/elif o dict; 500 no es retry en N1",
        hints: [
          "if/elif o dict; 500 no es retry en N1",
          "429 y 503 sí reintentan; 400 es fix_client.",
        ],
        edgeCases: ["400 no retry", "500 fail_server"],
        tests: "política status→acción N1",
        feedback: "La función es el contrato de resiliencia del adaptador (alineada a should_retry).",
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
        instruction:
          "E1 (guiado) — Simula timeout de cliente: `fetch(timeout_s, cost_s)` devuelve `'ok'` si `cost_s <= timeout_s`; si `cost_s > timeout_s` devuelve `'timeout'`. (Modela el `timeout=` obligatorio de un cliente real sin red.) Salida/pass: `ok` y luego `timeout`.",
        hint: "if cost > timeout: return 'timeout'",
        hints: [
          "if cost > timeout: return 'timeout'",
          "No uses red real; compara números.",
        ],
        edgeCases: ["cost == timeout cuenta ok o timeout según tu política; aquí > es timeout"],
        tests: "ok y timeout",
        feedback: "Timeout obligatorio evita workers colgados.",
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
        instruction:
          "E2 (independiente) — Implementa `collect_all(api)` que pagina desde la página 1 hasta que `next is None` y devuelve la lista plana de items. Fixture del starter: página 1 → `a` con next=2; página 2 → `b`,`c` con next=None. Salida/pass: `['a', 'b', 'c']`.",
        hint: "while page is not None",
        hints: [
          "while page is not None",
          "api[page]['items'] y api[page]['next']",
        ],
        edgeCases: ["next null termina"],
        tests: "lista plana a,b,c",
        feedback: "Paginación correcta es prerequisito de full-sync sintético.",
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
        instruction:
          "E3 (transferencia) — Implementa `should_retry(status)` que devuelve `True` **solo** para 429 y 503 (política N1 de errores transitorios). Imprime para 400, 404, 429, 503, 200. Salida/pass: `400 False`, `404 False`, `429 True`, `503 True`, `200 False`.",
        hint: "return status in {429, 503}",
        hints: [
          "return status in {429, 503}",
          "200 y 4xx de cliente no reintentan.",
        ],
        edgeCases: ["400 False", "429 True"],
        tests: "política retry transitorio",
        feedback: "Retry selectivo respeta al proveedor y a tu cuota.",
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
        instruction:
          "E1 (guiado) — Implementa `require_token(env)`: lee `API_TOKEN` del dict `env`; si falta o está vacío, lanza `ValueError('API_TOKEN missing')`; si no, devuelve el token. Casos: env con token → `abc`; env vacío → mensaje `API_TOKEN missing`.",
        hint: "tok = env.get('API_TOKEN')",
        hints: [
          "tok = env.get('API_TOKEN')",
          "if not tok: raise ValueError(...)",
        ],
        edgeCases: ["token vacío falla"],
        tests: "abc + error message",
        feedback: "Fail closed sin secreto evita llamadas anónimas accidentales.",
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
        instruction:
          "E2 (independiente) — Cache GET: implementa la clase `Cache` con `set(url, body)` y `get(url)` que devuelve `(body, cache_hit)`. Tras un set, la siguiente get del mismo url debe ser `({'ok': True}, True)`; un url desconocido → `(None, False)`. Usa un dict interno.",
        hint: "key = url",
        hints: [
          "key = url",
          "almacenar body y devolver (body, hit)",
        ],
        edgeCases: ["miss → None, False"],
        tests: "hit y miss",
        feedback: "Cache de GET reduce latencia en demos repetidas.",
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
        instruction:
          "E3 (transferencia) — Implementa `min_provenance(url, status, cache_hit)` que devuelve un dict con `source_url`, `fetched_at` fijo `'2026-07-20T00:00:00Z'`, `status_code` y `cache_hit`. Nunca incluyas el token. Imprime `sorted(...items())` del caso del starter.",
        hint: "Campos mínimos de auditoría.",
        hints: [
          "Campos mínimos de auditoría.",
          "No incluyas Authorization.",
        ],
        edgeCases: ["sin token"],
        tests: "4 campos de provenance",
        feedback: "Provenance es evidencia de adquisición para el capstone.",
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
        instruction:
          "E1 (guiado) — Implementa `assert_keys(payload, required)`: si faltan claves, lanza `AssertionError` con `missing keys: [...]` (sorted); si está completo, no lanza. El runner imprime `'ok'` y luego el error de un payload sin `lon`. Salida/pass: `ok` y `missing keys: ['lon']`.",
        hint: "missing = set(required) - set(payload)",
        hints: [
          "missing = set(required) - set(payload)",
          "raise AssertionError si missing",
        ],
        edgeCases: ["mensaje con lon"],
        tests: "ok + AssertionError",
        feedback: "Contract tests baratos atrapan roturas de proveedor.",
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
        instruction:
          "E2 (independiente) — Implementa `fetch_with_fallback(status, local_body)`: si `status >= 500` devuelve `(local_body, 'offline')`; si el status es de éxito (p. ej. 200) devuelve `({'online': True}, 'online')`. Imprime ambos casos del starter.",
        hint: "if status >= 500",
        hints: [
          "if status >= 500",
          "retorna tupla (body, mode)",
        ],
        edgeCases: ["5xx → offline"],
        tests: "online/offline modes",
        feedback: "Fallback degradado mantiene el demo del dashboard vivo.",
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
        instruction:
          "E3 (transferencia) — Implementa `operation_mode(online: bool)` que devuelve `'live_api'` si online es True y `'local_file'` si es False (runbook mínimo de degradación). Imprime `True live_api` y `False local_file`. No hardcodees solo prints: la función decide el modo.",
        hint: "return 'live_api' if online else 'local_file'",
        hints: [
          "return 'live_api' if online else 'local_file'",
          "offline siempre local_file.",
        ],
        edgeCases: ["flag offline"],
        tests: "función de modo de operación",
        feedback: "El runbook online/offline mantiene demos reproducibles cuando el proveedor cae.",
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
        instruction:
          "E1 (guiado) — En SQLite `:memory:`, crea la tabla `evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL)`. Inserta la fila `E1` / `C001` / `geo` y imprime el `COUNT(*)`. Salida/pass: `1`.",
        hint: "CREATE TABLE evidence (...)",
        hints: [
          "CREATE TABLE evidence (...)",
          "INSERT + SELECT COUNT(*)",
        ],
        edgeCases: ["NOT NULL en entity_id"],
        tests: "count 1",
        feedback: "Esquema mínimo de evidencias para el join de caso.",
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
        instruction:
          "E2 (independiente) — CRUD de client en SQLite: inserta `C001` con name `'Ana'`, haz UPDATE del name a `'Ana Q'`, imprime el name, borra la fila e imprime `COUNT(*)`. Todo con placeholders `?`. Salida/pass: `Ana Q` y luego `0`.",
        hint: "UPDATE clients SET name=? WHERE id=?",
        hints: [
          "UPDATE clients SET name=? WHERE id=?",
          "Orden: insert → update → select → delete → count",
        ],
        edgeCases: ["update parametrizado"],
        tests: "Ana Q y 0",
        feedback: "CRUD parametrizado es la base del almacén local.",
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
        instruction:
          "E3 (transferencia) — JOIN de caso: une `clients` + `evidence` por `entity_id` y imprime los `kind` de `C001` ordenados. No mezcles evidencias de `C002`. Salida/pass: `['geo', 'phone']`.",
        hint: "JOIN ON c.id = e.entity_id",
        hints: [
          "JOIN ON c.id = e.entity_id",
          "WHERE c.id = ?",
        ],
        edgeCases: ["no mezclar C002"],
        tests: "['geo','phone']",
        feedback: "Join por entity_id alimenta la ficha de caso.",
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
        instruction:
          "E1 (guiado) — Reescribe la búsqueda insegura: en lugar del f-string con `user_id`, usa placeholder `?` y una tupla de params. El input malicioso `C001' OR '1'='1` no debe devolver filas. Salida/pass: `None`.",
        hint: "WHERE id = ?",
        hints: [
          "WHERE id = ?",
          "No uses f'...{user_id}'",
        ],
        edgeCases: ["inyección neutralizada"],
        tests: "None (no match literal)",
        feedback: "Placeholders matan la inyección clásica.",
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
        instruction:
          "E2 (independiente) — Transacción atómica: en un `BEGIN`, inserta `C001` y luego un segundo insert con el mismo id. Ante `IntegrityError`, haz `rollback` y deja `COUNT(*)==0`. Sin rollback, el primer insert quedaría huérfano. Salida/pass: `0`.",
        hint: "BEGIN; insert; insert duplicado; except rollback",
        hints: [
          "BEGIN; insert; insert duplicado; except rollback",
          "Tras rollback count 0",
        ],
        edgeCases: ["rollback total"],
        tests: "count 0",
        feedback: "Atomicidad evita filas huérfanas.",
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
        instruction:
          "E3 (transferencia) — Crea el índice `idx_document_id` sobre `clients(document_id)` y lista los nombres de índices de la tabla con `PRAGMA index_list`. Salida/pass: `['idx_document_id', 'sqlite_autoindex_clients_1']` (ordenados).",
        hint: "CREATE INDEX idx_document_id ON clients(document_id)",
        hints: [
          "CREATE INDEX idx_document_id ON clients(document_id)",
          "PRAGMA index_list('clients')",
        ],
        edgeCases: ["nombre de índice"],
        tests: "idx_document_id presente",
        feedback: "Índice en document_id acelera ER lookups.",
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
        instruction:
          "E1 (guiado) — Implementa `normalize_address(s)`: `strip` + colapsar espacios con `re.sub`. **No** uses `.title()` (solo espacios). Imprime `repr(...)` de `'  Jr.  de  la  Unión  100 '`. Salida/pass: `'Jr. de la Unión 100'`.",
        hint: "re.sub(r'\\s+', ' ', s.strip())",
        hints: [
          "re.sub(r'\\s+', ' ', s.strip())",
          "No uses title si no se pide; solo espacios.",
        ],
        edgeCases: ["espacios dobles"],
        tests: "string normalizado",
        feedback: "Normalizar reduce misses del geocoder mock.",
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
        instruction:
          "E2 (independiente) — Interfaz mínima: clase `MockGeocoder` con `geocode(city)` → dict o `None`. Solo Sucursal-Centro y Oficina-Este en la tabla; ciudad desconocida (p. ej. Cusco) → `None`. Imprime lat de Oficina-Oeste y el resultado de Cusco. Salida/pass: `-12.0464` y `None`.",
        hint: "Tabla city→(lat,lon)",
        hints: [
          "Tabla city→(lat,lon)",
          "provider='mock'",
        ],
        edgeCases: ["ciudad desconocida None"],
        tests: "-12.0464 y None",
        feedback: "Interfaz intercambiable permite swap a proveedor autorizado real más adelante.",
        starterCode: {
          language: 'python',
          title: "mock_geocoder.py",
          code: `# CASO-LIM-012 · MockGeocoder
# DEFECT: siempre Cliente-A coords
class MockGeocoder:
    DB = {"Cliente-B": (-12.0464, -77.0428), "Sucursal-Norte": (-16.4090, -71.5375)}
    def geocode(self, city):
        lat, lon = self.DB["Sucursal-Sur"]
        return {"city": city, "lat": lat, "lon": lon, "provider": "mock"}
g = MockGeocoder()
print(g.geocode("Sucursal-Centro")["lat"])
print(g.geocode("Cusco"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "mock_geocoder.py",
          code: `class MockGeocoder:
    DB = {"Oficina-Este": (-12.0464, -77.0428), "Oficina-Oeste": (-16.4090, -71.5375)}
    def geocode(self, city):
        if city not in self.DB:
            return None
        lat, lon = self.DB[city]
        return {"city": city, "lat": lat, "lon": lon, "provider": "mock"}
g = MockGeocoder()
print(g.geocode("Cliente-A")["lat"])
print(g.geocode("Cusco"))`,
          output: `-12.0464
None`,
        },
      },
      {
        id: "S12-T4-A-E3",
        subtopicId: "S12-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Checklist de egress: implementa `allowed_for_public_geocoder(payload)` que devuelve `True` solo si **todas** las claves del dict están en `ALLOWED = {\"address\", \"city\", \"country\"}`. Un payload con `document_id` u otra PII debe dar `False`. Imprime ambos casos del starter.",
        hint: "set(payload) <= allowed",
        hints: [
          "set(payload) <= allowed",
          "document_id debe fallar",
        ],
        edgeCases: ["PII bancaria bloqueada"],
        tests: "True/False",
        feedback: "Política de egress es requisito CP-N1-C.",
        starterCode: {
          language: 'python',
          title: "egress_checklist.py",
          code: `# CASO-LIM-012 · allowlist payload
# DEFECT: siempre True
ALLOWED = {"address", "city", "country"}
def allowed_for_public_geocoder(payload):
    return True
print(allowed_for_public_geocoder({"city": "Cliente-B", "address": "Av 1"}))
print(allowed_for_public_geocoder({"city": "Sucursal-Norte", "document_id": "D1"}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "egress_checklist.py",
          code: `ALLOWED = {"address", "city", "country"}
def allowed_for_public_geocoder(payload):
    return set(payload) <= ALLOWED
print(allowed_for_public_geocoder({"city": "Sucursal-Sur", "address": "Av 1"}))
print(allowed_for_public_geocoder({"city": "Sucursal-Centro", "document_id": "D1"}))`,
          output: `True
False`,
        },
      },
      {
        id: "S12-T4-B-E1",
        subtopicId: "S12-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Implementa `valid_lat_lon(lat, lon)`: `True` solo si lat ∈ [-90, 90] y lon ∈ [-180, 180]. Prueba `(0,0)`, `(91,0)`, `(0,181)`, `(-12.04,-77.04)`. Salida/pass: `True`, `False`, `False`, `True` junto a cada par.",
        hint: "-90<=lat<=90 and -180<=lon<=180",
        hints: [
          "-90<=lat<=90 and -180<=lon<=180",
          "Imprime cuatro booleanos",
        ],
        edgeCases: ["91 inválido"],
        tests: "True False False True",
        feedback: "Valida antes de Haversine o de pintar el mapa.",
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
        instruction:
          "E2 (independiente) — Implementa `haversine_km(a, b)` con R=6371. Entre `(0,0)` y `(0,1)` la distancia debe ser ~111.19 km. Imprime `round(d, 2)` y, si `abs(d-111.19) < 1`, imprime `tolerance_ok`. Salida/pass: `111.19` y `tolerance_ok`.",
        hint: "Fórmula Haversine con R=6371",
        hints: [
          "Fórmula Haversine con R=6371",
          "math.radians, sin, cos, asin, sqrt",
        ],
        edgeCases: ["tolerancia 1 km"],
        tests: "~111.19 + tolerance_ok",
        feedback: "Test de tolerancia evita regresiones de fórmula.",
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
assert abs(d - 111.19) < 1
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
assert abs(d - 111.19) < 1
print("tolerance_ok")`,
          output: `111.19
tolerance_ok`,
        },
      },
      {
        id: "S12-T4-B-E3",
        subtopicId: "S12-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Implementa `as_relationship_signal(km)` que devuelve un dict con `type='geo_distance_km'`, `value=km` y `kinship_verdict=None` (nunca `True`). La distancia es geoseñal, no parentesco. Imprime el dict para `1.2`.",
        hint: "Nunca setees is_family",
        hints: [
          "Nunca setees is_family",
          "kinship_verdict siempre None en N1",
        ],
        edgeCases: ["no parentesco automático"],
        tests: "verdict None",
        feedback: "Geoseñal alimenta S13 relationship_signal_score sin colapsar a ER ni fraude.",
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
      "Integra el hilo completo de S12 en un solo script de adquisición: cliente HTTP mock con timeout/paginación/retry selectivo (política N1: solo 429/503), secretos por env, cache GET, provenance sin tokens, SQLite parametrizado (`clients` / `transactions` / `evidence`) y **MockGeocoder** con allowlist de egress (sin PII bancaria). Solo datos sintéticos Oficina-Este/Oficina-Oeste e ids `C00x`. El `main()` del starter es un smoke path: al implementar cada stub, debe imprimir token_len, retry, entity, cache_hits, provenance, normalize, egress ok/bad, geo, km y case_row. En **S13** se cierra el dashboard de evidencia y la regresión de nivel 1 — aquí no construyas el dashboard.",
    objectives: [
      "Cliente get_entity + should_retry N1 (429/503) y timeout en la interfaz",
      "Cache GET + min_provenance sin secretos",
      "Esquema SQLite + case_join (name, amount, kind) + seeds",
      "MockGeocoder + allowlist de egress + Haversine como geoseñal (no parentesco)",
      "Smoke path en main() con todos los stubs cableados",
    ],
    requirements: [
      "Timeout obligatorio en la interfaz del cliente (simulado o real)",
      "SQL solo con placeholders `?`",
      "Sin tokens en logs/provenance",
      "Geocoder mock/autorizado; sin PII bancaria a servicios públicos",
      "Datos sintéticos latam (example.com / Cliente-A / Cliente-B)",
      "Demo offline reproducible (fallback local)",
    ],
    starterCode: `"""cp_n1c_acquisition.py — CP-N1-C incremento S12
HTTP mock + SQLite + MockGeocoder. Datos sintéticos únicamente.
Integra: token env, retry N1, cache GET, provenance, join SQL, egress, Haversine.
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
    DB = {"Sucursal-Norte": (-12.0464, -77.0428), "Sucursal-Sur": (-16.4090, -71.5375)}

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
    store = {"C001": {"id": "C001", "region": "Sucursal-Centro"}}
    print("entity", get_entity(store, "C001"))
    cache: dict = {}
    body, hit1 = cached_get(cache, "https://api.example.com/s", lambda: {"ok": True})
    _, hit2 = cached_get(cache, "https://api.example.com/s", lambda: {"ok": True})
    print("cache_hits", hit1, hit2)
    print("prov", min_provenance("https://api.example.com/s", 200, hit2))
    print("norm", normalize_address("  av  larco  1 "))
    print("egress_ok", allowed_for_public_geocoder({"city": "Oficina-Este", "address": "Av 1"}))
    print("egress_bad", allowed_for_public_geocoder({"city": "Oficina-Oeste", "document_id": "D1"}))
    print("geo", MockGeocoder().geocode("Cliente-A"))
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
      "En el README del portafolio muestra tres capturas o bloques: (1) manifest de provenance sin token (`token_logged` / sin Authorization), (2) join de caso SQLite con name/amount/kind, (3) distancia Cliente-B–Callao (~8.95 km) como geoseñal con disclaimer `signal != kinship`. Eso evidencia el incremento CP-N1-C de S12 y se enlaza limpio al dashboard de S13.",
    rubric: [
      { criterion: "HTTP status/JSON/timeout/retry selectivo", weight: "20%" },
      { criterion: "Auth env + cache + provenance sin secretos", weight: "15%" },
      { criterion: "SQL parametrizado + transacciones + join", weight: "25%" },
      { criterion: "Geocoder mock + política de egress", weight: "20%" },
      { criterion: "Haversine como señal (no veredicto) + demo offline", weight: "20%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Un 400 Bad Request del proveedor debe…",
        options: ["Reintentarse con backoff infinito", "Ignorarse como 200", "Borrar el cache", "Tratarse como error de cliente (no retry ciego)"],
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
          "Placeholders parametrizados previenen inyección.",
      },
      {
        question: "Enviar document_id bancario a un geocoder público…",
        options: ["Viola la política de egress de CP-N1-C", "Está permitido si hay timeout", "Mejora el Haversine", "Es requerido por SQLite"],
        correctIndex: 0,
        explanation:
          "Solo dirección/ciudad sintética autorizada; sin PII bancaria.",
      },
      {
        question: "1.2 km entre dos entidades sintéticas implica…",
        options: ["Parentesco automático", "Fraude confirmado", "Borrar el ER score", "Una geoseñal de relación, no un veredicto"],
        correctIndex: 3,
        explanation:
          "Haversine alimenta relationship_signal_score; no kinship/fraude auto.",
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
          "ROLLBACK deshace todo el batch: no quedan inserts huérfanos a medias.",
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
        note: "cache keys de URL GET",
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
