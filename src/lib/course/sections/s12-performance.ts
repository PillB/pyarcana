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
  icon: "Gauge",
  accentColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
  jobRelevance:
    "En onboarding, compliance y data quality en bancos, fintech y retail en Perú, necesitas **adaptadores HTTP resilientes**, **SQL parametrizado** y **geoevidencia controlada** sin filtrar PII bancaria a geocoders públicos. Esta sección (id de plataforma `performance` conservado) retematiza a V3 **APIs + SQL + geodatos** e incrementa **CP-N1-C** (adquisición + geoevidencia) con mocks locales y datos sintéticos.",
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
      heading: "De “Performance & concurrency” a APIs, SQL y geodatos (mapa de la sección)",
      paragraphs: [
        "En V3, **S12 no es el path principal de multiprocessing, profiling ni logging de producción**. Ese material se reubica conceptualmente hacia el tramo de sistemas/ops. Aquí construyes el **incremento CP-N1-C de adquisición y geoevidencia**: cliente HTTP síncrono resiliente, SQLite parametrizado y geocoder mock/autorizado **sin PII bancaria a servicios públicos**.",
        "El hilo conductor es un **adaptador de señales sintéticas** (listas de entidades, evidencias y coordenadas) con timeout, cache, provenance y fallback offline. Solo datos sintéticos latam (`example.com`, Lima/Arequipa, ids `C00x`). Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no.",
        "Orden: **T1 HTTP** → **T2 Auth/cache/contracts** → **T3 SQL** → **T4 Geodatos responsables**. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «De “Performance & concurrency” a APIs, SQL y geodatos (mapa de la sección)»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de performance/concurrency de este archivo **no es el camino V3 del estudiante en S12**. Target: adaptadores HTTP + SQL + geo para CP-N1-C. Conserva datos sintéticos; nunca PII real ni tokens en logs.",
      },
    },
    {
      heading: "requests/responses, status y JSON",
      subtopicId: "S12-T1-A",
      paragraphs: [
        "Un cliente HTTP síncrono hace **GET/POST**, recibe un **status code** y un cuerpo (a menudo JSON). En este curso usamos un **cliente mock** o `urllib` con fixtures: la pedagogía es status + parse, no la librería de red. En APIs y geodatos, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta acceso responsable a API/SQL/geo sin inventar hechos sobre personas reales.",
        "**2xx** = éxito; **4xx** = error del cliente (no reintentes a ciegas); **5xx** = error del servidor (candidatos a retry con límite). Siempre parsea con manejo de cuerpo vacío o JSON inválido. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14.",
        "**Timeout es obligatorio**: sin `timeout=` un socket colgado congela el pipeline. Headers (`Accept`, `User-Agent`) documentan el contrato del adaptador. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «requests/responses, status y JSON»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      code: {
        language: 'python',
        title: "mock_http_status.py",
        code: `class MockResponse:
    def __init__(self, status_code, payload):
        self.status_code = status_code
        self._payload = payload
    def json(self):
        return self._payload

def get_entity(store, entity_id):
    if entity_id not in store:
        return MockResponse(404, {"error": "not_found"})
    return MockResponse(200, store[entity_id])

store = {"C001": {"id": "C001", "region": "Lima", "score": 0.8}}
ok = get_entity(store, "C001")
miss = get_entity(store, "C999")
print("200 keys:", sorted(ok.json().keys()), "status", ok.status_code)
print("404 status", miss.status_code, "body", miss.json())`,
        output: `200 keys: ['id', 'region', 'score'] status 200
404 status 404 body {'error': 'not_found'}`,
      },
      callout: {
        type: "tip",
        title: "Regla de status",
        content:
          "Traduce status → acción del adaptador (return None, raise, retry). No asumas siempre 200.",
      },
    },
    {
      heading: "Timeout, paginación, retry/backoff y rate limit",
      subtopicId: "S12-T1-B",
      paragraphs: [
        "**Timeout** acota la espera por request. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez. En APIs y geodatos, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta acceso responsable a API/SQL/geo sin inventar hechos sobre personas reales.",
        "**Retry/backoff** solo en errores **transitorios** (429, 503, timeouts). Un **400** o **404** no se reintenta. Respeta `Retry-After` y un **max_retries** duro. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14.",
        "Rate limit: duerme entre páginas o respeta cuotas del proveedor. En demo usamos `sleep` simbólico o contador de delays. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «Timeout, paginación, retry/backoff y rate limit»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      code: {
        language: 'python',
        title: "paginate_rate.py",
        code: `import time

pages = {
    1: {"items": ["s1", "s2"], "next": 2},
    2: {"items": ["s3"], "next": 3},
    3: {"items": ["s4"], "next": None},
}

def fetch_page(n):
    return pages[n]

all_items = []
page = 1
delays = 0
while page is not None:
    data = fetch_page(page)
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
          "Retry ciego en 4xx de cliente amplifica abuso y no arregla el request.",
      },
    },
    {
      heading: "Auth, secretos, cache y provenance",
      subtopicId: "S12-T2-A",
      paragraphs: [
        "Autenticación **Bearer** o basic lee el token de **variable de entorno**, nunca hardcodeado. Si falta el secreto, falla cerrado con mensaje claro. En APIs y geodatos, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta acceso responsable a API/SQL/geo sin inventar hechos sobre personas reales.",
        "**Cache de GET** por hash de URL con **TTL** reduce costo y latencia; no caches respuestas de escritura ni datos sensibles sin política. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14.",
        "**Provenance**: cada fetch deja `source_url`, `fetched_at`, `status_code`, `cache_hit`. **Nunca loguees el token**. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «Auth, secretos, cache y provenance»; nunca PII real ni inferencia automática de parentesco/fraude.",
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
        "Un **contract test** fija las claves obligatorias del JSON del proveedor (fixture). Si el schema cambia, el test falla antes de producción. En APIs y geodatos, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta acceso responsable a API/SQL/geo sin inventar hechos sobre personas reales.",
        "**Fallback degradado**: si 5xx o red caída, lee coordenadas/precomputados locales y marca `mode=offline` en provenance. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14.",
        "Feature flag offline permite demos reproducibles sin red — obligatorio en CP-N1-C. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «Contract tests y fallback»; nunca PII real ni inferencia automática de parentesco/fraude.",
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
print("offline", geocode("Lima", online=False)["mode"])`,
        output: `contract True
online online
offline offline_fallback`,
      },
      callout: {
        type: "tip",
        title: "Fail soft, trace hard",
        content:
          "Fallback no oculta el fallo: deja mode=offline y razón en provenance.",
      },
    },
    {
      heading: "Esquema, CRUD y joins",
      subtopicId: "S12-T3-A",
      paragraphs: [
        "SQLite vía `sqlite3` basta para el almacén local de CP-N1-C: tablas `clients`, `transactions`, `evidence`. En APIs y geodatos, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta acceso responsable a API/SQL/geo sin inventar hechos sobre personas reales.",
        "CRUD = CREATE/INSERT/SELECT/UPDATE (y DELETE con cuidado). **JOIN** une evidencias a entidades por `entity_id`. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14.",
        "Empieza transacciones explícitas cuando un caso toca varias filas; en T3-B profundizamos COMMIT/ROLLBACK. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «Esquema, CRUD y joins»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      code: {
        language: 'python',
        title: "sqlite_join.py",
        code: `import sqlite3

con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE clients (id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE evidence (id TEXT PRIMARY KEY, entity_id TEXT, kind TEXT, payload TEXT);
''')
con.execute("INSERT INTO clients VALUES (?, ?)", ("C001", "Ana Demo"))
con.execute(
    "INSERT INTO evidence VALUES (?, ?, ?, ?)",
    ("E1", "C001", "geo", '{"lat": -12.04}'),
)
con.commit()
row = con.execute(
    "SELECT c.name, e.kind FROM clients c JOIN evidence e ON c.id = e.entity_id"
).fetchone()
print("join", row)
con.close()`,
        output: `join ('Ana Demo', 'geo')`,
      },
      callout: {
        type: "tip",
        title: "FKs lógicas primero",
        content:
          "Documenta entity_id aunque no actives FOREIGN KEY; la integridad empieza en el modelo.",
      },
    },
    {
      heading: "Parámetros, transacciones, constraints e índices",
      subtopicId: "S12-T3-B",
      paragraphs: [
        "Usa placeholders `?` (o `:name`). **Prohibido** armar SQL con f-strings de input de usuario: es inyección. En APIs y geodatos, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta acceso responsable a API/SQL/geo sin inventar hechos sobre personas reales.",
        "`executemany` + `BEGIN`/`COMMIT` hacen batch atómico; un UNIQUE roto → `ROLLBACK` y reporte de fila. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14.",
        "`UNIQUE`/`NOT NULL` e **índices** en `document_id` / `entity_id` aceleran lookups del dashboard. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «Parámetros, transacciones, constraints e índices»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      code: {
        language: 'python',
        title: "params_tx.py",
        code: `import sqlite3

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
except sqlite3.IntegrityError as exc:
    con.rollback()
    print("rollback_ok", type(exc).__name__)
n = con.execute("SELECT COUNT(*) FROM clients").fetchone()[0]
print("rows_after_rollback", n)
# safe param query
doc = "D-999'; OR 1=1 --"
row = con.execute("SELECT * FROM clients WHERE document_id = ?", (doc,)).fetchone()
print("injection_safe", row)
con.close()`,
        output: `rollback_ok IntegrityError
rows_after_rollback 0
injection_safe None`,
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
        "Normaliza direcciones sintéticas: trim, colapsa espacios, title-case ligero. No inventes campos que no vinieron. En APIs y geodatos, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta acceso responsable a API/SQL/geo sin inventar hechos sobre personas reales.",
        "Solo **geocoder autorizado/mock**. Política del curso: **no envíes PII bancaria** (docs, cuentas, montos) a proveedores públicos. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14.",
        "`MockGeocoder` devuelve lat/lon fijos por ciudad de demo (Lima, Arequipa) para demos offline reproducibles. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «Normalización y geocoding autorizado»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      code: {
        language: 'python',
        title: "mock_geocode.py",
        code: `import re

def normalize_address(s: str) -> str:
    s = re.sub(r"\\s+", " ", s.strip())
    return s.title()

class MockGeocoder:
    TABLE = {
        "Lima": (-12.0464, -77.0428),
        "Arequipa": (-16.4090, -71.5375),
    }
    def geocode(self, city: str):
        coords = self.TABLE.get(city.title())
        if not coords:
            return None
        lat, lon = coords
        return {"city": city.title(), "lat": lat, "lon": lon, "provider": "mock"}

addr = normalize_address("  av.  larco  123  ")
geo = MockGeocoder().geocode("lima")
print("addr", addr)
print("geo", geo)`,
        output: `addr Av. Larco 123
geo {'city': 'Lima', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}`,
      },
      callout: {
        type: "warning",
        title: "Egress policy",
        content:
          "Checklist: ¿el payload al proveedor incluye solo dirección/ciudad sintética autorizada? Si no, bloquea.",
      },
    },
    {
      heading: "Calidad de coordenada, Haversine, caching y política",
      subtopicId: "S12-T4-B",
      paragraphs: [
        "Valida **lat ∈ [-90,90]** y **lon ∈ [-180,180]** antes de calcular. Coordenadas basura no entran al mapa. En APIs y geodatos, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta acceso responsable a API/SQL/geo sin inventar hechos sobre personas reales.",
        "**Haversine** estima km entre dos puntos; sirve como **geoseñal de relación**, no como veredicto de parentesco o fraude. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: requests conceptual + sqlite3 + math haversine (S01–S12); no RPA, no dashboard de S13, no NumPy de S14.",
        "Cachea geocodes bajo TTL/política del proveedor. Documenta que distancia es **señal**, no kinship. Caso sintético Perú: endpoints sintéticos, SQL local, coords Lima ficticias. Documenta decisión, métrica y límite conocido en el memo del subtema «Calidad de coordenada, Haversine, caching y política»; nunca PII real ni inferencia automática de parentesco/fraude.",
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
    intro: "Ocho demos locales (mock HTTP, paginación, provenance, contract/fallback, SQLite join, transacción atómica, MockGeocoder, Haversine Lima–Callao). Observa status, SQL parametrizado y geoseñal sin veredicto.",
    steps: [
      {
        demoId: "S12-T1-A-DEMO",
        subtopicId: "S12-T1-A",
        environment: "local-python",
        description: "Cliente mock HTTP que devuelve lista de señales sintéticas con status 200 y parse JSON.",
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
data = resp.json()
print("status", resp.status_code)
print("count", data["count"])
print("kinds", [x["kind"] for x in data["items"]])`,
          output: `status 200
count 2
kinds ['shared_phone', 'geo']`,
        },
        why: "El adaptador ve el contrato real (status + JSON) sin red externa.",
      },
      {
        demoId: "S12-T1-B-DEMO",
        subtopicId: "S12-T1-B",
        environment: "local-python",
        description: "Paginar 3 páginas de API mock con contador de rate-limit (sin sleep real largo).",
        code: {
          language: 'python',
          title: "paginate_demo.py",
          code: `API = {
    1: {"items": [1, 2], "next": 2},
    2: {"items": [3], "next": 3},
    3: {"items": [4, 5], "next": None},
}
items = []
page = 1
pauses = 0
while page is not None:
    chunk = API[page]
    items.extend(chunk["items"])
    page = chunk["next"]
    if page is not None:
        pauses += 1
print("items", items)
print("pages_fetched", 3, "rate_limit_pauses", pauses)`,
          output: `items [1, 2, 3, 4, 5]
pages_fetched 3 rate_limit_pauses 2`,
        },
        why: "Paginación + respeto de ritmo son el esqueleto de adquisición resiliente.",
      },
      {
        demoId: "S12-T2-A-DEMO",
        subtopicId: "S12-T2-A",
        environment: "local-python",
        description: "Fetch con token de env + manifest de provenance (token no se imprime).",
        code: {
          language: 'python',
          title: "provenance_demo.py",
          code: `import os, json, hashlib
os.environ["SIG_API_TOKEN"] = "syn-token-000"
token = os.environ["SIG_API_TOKEN"]
url = "https://api.example.com/v1/signals/C001"
body = {"entity_id": "C001", "signals": ["geo"]}
manifest = {
    "source_url": url,
    "fetched_at": "2026-07-20T15:00:00Z",
    "status_code": 200,
    "body_sha12": hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()[:12],
    "auth_scheme": "bearer",
    "token_present": bool(token),
}
print(json.dumps(manifest, sort_keys=True))
print("token_logged", False)`,
          output: `{"auth_scheme": "bearer", "body_sha12": "5acbf63b7a4b", "fetched_at": "2026-07-20T15:00:00Z", "source_url": "https://api.example.com/v1/signals/C001", "status_code": 200, "token_present": true}
token_logged False`,
        },
        why: "Provenance auditable sin filtrar secretos.",
      },
      {
        demoId: "S12-T2-B-DEMO",
        subtopicId: "S12-T2-B",
        environment: "local-python",
        description: "Contract test del geocoder mock + fallback a coordenadas precalculadas.",
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
        why: "Contrato + fallback hacen demos reproducibles cuando el proveedor no responde.",
      },
      {
        demoId: "S12-T3-A-DEMO",
        subtopicId: "S12-T3-A",
        environment: "local-python",
        description: "Tablas clients, transactions, evidence con join de caso sintético.",
        code: {
          language: 'python',
          title: "case_join_demo.py",
          code: `import sqlite3
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE transactions(id TEXT PRIMARY KEY, client_id TEXT, amount REAL);
CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT, kind TEXT);
''')
con.execute("INSERT INTO clients VALUES ('C001','Ana')")
con.execute("INSERT INTO transactions VALUES ('T1','C001',120.5)")
con.execute("INSERT INTO evidence VALUES ('E1','C001','geo')")
con.commit()
rows = con.execute('''
SELECT c.id, t.id, e.kind
FROM clients c
JOIN transactions t ON t.client_id = c.id
JOIN evidence e ON e.entity_id = c.id
''').fetchall()
print("case_rows", rows)
con.close()`,
          output: `case_rows [('C001', 'T1', 'geo')]`,
        },
        why: "El join de caso es el corazón del almacén local del dashboard.",
      },
      {
        demoId: "S12-T3-B-DEMO",
        subtopicId: "S12-T3-B",
        environment: "local-python",
        description: "Insert batch atómico; rollback si una fila viola UNIQUE.",
        code: {
          language: 'python',
          title: "atomic_batch_demo.py",
          code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT UNIQUE)")
batch = [("C001", "DOC1"), ("C002", "DOC2"), ("C003", "DOC1")]
try:
    con.execute("BEGIN")
    con.executemany("INSERT INTO clients VALUES (?,?)", batch)
    con.commit()
    print("unexpected_commit")
except sqlite3.IntegrityError:
    con.rollback()
    print("atomic_rollback", True)
print("count", con.execute("SELECT COUNT(*) FROM clients").fetchone()[0])
con.close()`,
          output: `atomic_rollback True
count 0`,
        },
        why: "Transacciones evitan estados a medias cuando hay conflicto de negocio.",
      },
      {
        demoId: "S12-T4-A-DEMO",
        subtopicId: "S12-T4-A",
        environment: "local-python",
        description: "MockGeocoder devuelve lat/lon sintéticos para Lima/Arequipa.",
        code: {
          language: 'python',
          title: "mock_cities_demo.py",
          code: `class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}
    def geocode(self, city):
        if city not in self.DB:
            return None
        lat, lon = self.DB[city]
        return {"city": city, "lat": lat, "lon": lon, "provider": "authorized_mock"}

g = MockGeocoder()
for c in ("Lima", "Arequipa", "Iquitos"):
    print(c, g.geocode(c))`,
          output: `Lima {'city': 'Lima', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'authorized_mock'}
Arequipa {'city': 'Arequipa', 'lat': -16.409, 'lon': -71.5375, 'provider': 'authorized_mock'}
Iquitos None`,
        },
        why: "Geocoder intercambiable y offline para demos sin egress de PII.",
      },
      {
        demoId: "S12-T4-B-DEMO",
        subtopicId: "S12-T4-B",
        environment: "local-python",
        description: "Distancia entre dos puntos sintéticos Lima–Callao como geoseñal.",
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
        why: "La distancia alimenta relationship_signal_score, no un veredicto legal.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (E1 guiado / E2 independiente / E3 transferencia) por los 8 subtemas. Dos pistas por ejercicio. Ejecuta en local-python con datos sintéticos.",
    steps: [
      {
        id: "S12-T1-A-E1",
        subtopicId: "S12-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S12-T1-A (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: Implementa `get_entity(store, entity_id)` que devuelva (status, body). 200 con el dict si existe; 404 con `{'error':'not_found'}` si no. Salida/pass: primeros tokens de `(200, {'id': 'C001', 'region': 'Lima'}) | (404, {'…` según solution. Conserva el contrato del starter y no borres asserts.",
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
          code: `store = {"C001": {"id": "C001", "region": "Lima"}}
def get_entity(store, entity_id):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
        instruction:
          "E2 (independiente) — Dado un `payload` JSON-like dict de respuesta, implementa `parse_entity(payload)` que exija claves `id` y `region` y devuelva solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `def parse_entity(payload):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
        instruction:
          "E3 (transferencia) — Construye `STATUS_ACTION` mapeando 200→'use_body', 404→'missing', 429→'retry', 500→'retry', 400→'fix_client'. Imprime la acción para [200,404,429,400,500].",
        hint: "dict.get(code, 'unknown')",
        hints: [
          "dict.get(code, 'unknown')",
          "400 no es retry.",
        ],
        edgeCases: ["400 no retry"],
        tests: "tabla status→acción",
        feedback: "La tabla es el contrato de resiliencia del adaptador.",
        starterCode: {
          language: 'python',
          title: "status_table.py",
          code: `STATUS_ACTION = {
    200: "use_body",
    404: "missing",
    429: "retry",
    500: "retry",
    400: "fix_client",
}
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
        },
        solutionCode: {
          language: 'python',
          title: "status_table.py",
          code: `STATUS_ACTION = {
    200: "use_body",
    404: "missing",
    429: "retry",
    500: "retry",
    400: "fix_client",
}
for code in [200, 404, 429, 400, 500]:
    print(code, STATUS_ACTION.get(code, "unknown"))`,
          output: `200 use_body
404 missing
429 retry
400 fix_client
500 retry`,
        },
      },
      {
        id: "S12-T1-B-E1",
        subtopicId: "S12-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S12-T1-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: Simula timeout: `fetch(timeout_s, cost_s)` devuelve 'ok' si cost_s <= timeout_s, si no lanza TimeoutError capturado y devuelve 'timeout'. Salida/pass: `ok | timeout`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no.",
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
          code: `def fetch(timeout_s, cost_s):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S12-T1-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: `collect_all(api)` pagina desde 1 hasta next is None y devuelve lista plana de items. Salida/pass: `['a', 'b', 'c']`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14; solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `api = {
    1: {"items": ["a"], "next": 2},
    2: {"items": ["b", "c"], "next": None},
}
def collect_all(api):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S12-T1-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: `should_retry(status)` True solo para 429 y 503. Imprime para 400,404,429,503,200. Salida/pass: `400 False | 404 False | 429 True | 503 True | 200 False`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy.",
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
          code: `def should_retry(status):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E1 (guiado) — Concepto: S12-T2-A (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: `require_token(env)` lee API_TOKEN del dict env; si falta o vacío, lanza ValueError('API_TOKEN missing'); si no, devuelve el token. Salida/pass: `abc | API_TOKEN missing`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de.",
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
          code: `def require_token(env):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S12-T2-A (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: Cache GET: `Cache` con get/set por url; segunda get del mismo url devuelve cache_hit True. Usa dict interno. Salida/pass: `({'ok': True}, True) | (None, False)`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13,.",
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
          code: `class Cache:
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — `min_provenance(url, status, cache_hit)` devuelve dict con source_url, fetched_at fijo '2026-07-20T00:00:00Z', status_code, cache_hit. Sin token.",
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
          code: `def min_provenance(url, status, cache_hit):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E1 (guiado) — Concepto: S12-T2-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: `assert_keys(payload, required)` lanza AssertionError con missing sorted si faltan claves; si ok imprime 'ok'. Salida/pass: `ok | missing keys: ['lon']`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14;.",
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
          code: `def assert_keys(payload, required):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — `fetch_with_fallback(status, local_body)`: si status>=500 devuelve (local_body, 'offline'); si 200 devuelve ({'online':True}, 'online').",
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
          code: `def fetch_with_fallback(status, local_body):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S12-T2-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: Matriz online/offline: dict con claves ('online', True/False) → comportamiento 'live_api' o 'local_file'. Imprime ambos. Salida/pass: `True live_api | False local_file`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard.",
        hint: "Usa tuplas como clave de dict.",
        hints: [
          "Usa tuplas como clave de dict.",
          "offline siempre local_file.",
        ],
        edgeCases: ["flag offline"],
        tests: "matriz de operación",
        feedback: "La matriz es runbook mínimo de operación N1.",
        starterCode: {
          language: 'python',
          title: "online_offline_matrix.py",
          code: `matrix = {
    True: "live_api",
    False: "local_file",
}
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
        },
        solutionCode: {
          language: 'python',
          title: "online_offline_matrix.py",
          code: `matrix = {
    True: "live_api",
    False: "local_file",
}
for online in (True, False):
    print(online, matrix[online])`,
          output: `True live_api
False local_file`,
        },
      },
      {
        id: "S12-T3-A-E1",
        subtopicId: "S12-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — En SQLite :memory:, crea tabla evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL). Inserta E1/C001/geo y cuenta filas.",
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
          code: `import sqlite3
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S12-T3-A (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: CRUD de client: insert C001, update name a 'Ana Q', select name, delete, count 0. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14 solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `import sqlite3
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S12-T3-A (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: Join: clients + evidence; imprime kinds de C001 ordenados. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14; solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `import sqlite3
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E1 (guiado) — Concepto: S12-T3-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: Reescribe búsqueda insegura: en lugar de f-string, usa `?` y muestra que input malicioso no inyecta. Salida/pass: `None`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14; solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `import sqlite3
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Transacción: inserta C001 ok; segundo insert con mismo id debe rollback y dejar count=0 si todo el batch falla junto (usa un solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `import sqlite3
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S12-T3-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: Crea índice idx_document_id en clients(document_id) y lista nombres de índices de la tabla via PRAGMA index_list. Salida/pass: `['idx_document_id', 'sqlite_autoindex_clients_1']`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no.",
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
          code: `import sqlite3
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E1 (guiado) — Concepto: S12-T4-A (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: `normalize_address` colapsa espacios y hace strip; imprime resultado de '  Jr.  de  la  Unión  100 '. Salida/pass: `'Jr. de la Unión 100'`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14; solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `import re
def normalize_address(s):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S12-T4-A (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: Interfaz mínima: clase MockGeocoder con geocode(city)→dict|None para Lima y Arequipa. Salida/pass: `-12.0464 | None`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14; solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `class MockGeocoder:
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
        },
        solutionCode: {
          language: 'python',
          title: "mock_geocoder.py",
          code: `class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}
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
        instruction:
          "E3 (transferencia) — Checklist de egress: dado un payload dict, `allowed_for_public_geocoder(payload)` True solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `ALLOWED = {"address", "city", "country"}
def allowed_for_public_geocoder(payload):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
        instruction:
          "E1 (guiado) — Concepto: S12-T4-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: `valid_lat_lon(lat, lon)` True solo en rangos válidos. Prueba (0,0), (91,0), (0,181), (-12.04,-77.04). Salida/pass: primeros tokens de `(0, 0) True | (91, 0) False | (0, 181) False | (-1…` según solution. Conserva el contrato del starter (no borres asserts ni.",
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
          code: `def valid_lat_lon(lat, lon):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S12-T4-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: `haversine_km` entre (0,0) y (0,1) debe ser ~111.19 km; imprime round(d, 2) y assert abs(d-111.19)<1. Salida/pass: `111.19 | tolerance_ok`. Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14 solo requests conceptual + sqlite3 + math haversine (S01–S12).",
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
          code: `import math
def haversine_km(a, b):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S12-T4-B (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (`CASO`/ids C00x) en APIs y geodatos. Tarea: `as_relationship_signal(km)` devuelve dict type=geo_distance_km, value=km, kinship_verdict=None. Imprime para 1.2. Salida/pass: primeros tokens de `{'type': 'geo_distance_km', 'value': 1.2, 'kinship…` según solution. Conserva el contrato del starter (no.",
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
          code: `def as_relationship_signal(km):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
      "Incrementas **CP-N1-C** con adquisición responsable: cliente HTTP mock con timeout/paginación/retry selectivo, secretos por env, cache GET, provenance sin tokens, SQLite parametrizado (clients/transactions/evidence) y **MockGeocoder** con política de no egress de PII bancaria. Solo datos sintéticos. En S13 se cierra el dashboard de evidencia y la regresión de nivel 1.",
    objectives: [
      "Cliente get_entity + list paginado con timeout y should_retry",
      "Provenance mínimo y cache de GET",
      "Esquema SQLite + join de caso + transacciones con rollback",
      "MockGeocoder + Haversine como geoseñal (no parentesco)",
      "Checklist de payload permitido al geocoder",
    ],
    requirements: [
      "Timeout obligatorio en la interfaz del cliente (simulado o real)",
      "SQL solo con placeholders `?`",
      "Sin tokens en logs/provenance",
      "Geocoder mock/autorizado; sin PII bancaria a servicios públicos",
      "Datos sintéticos latam (example.com / Lima / Arequipa)",
      "Demo offline reproducible (fallback local)",
    ],
    starterCode: `"""cp_n1c_acquisition.py — CP-N1-C incremento S12
HTTP mock + SQLite + MockGeocoder. Datos sintéticos únicamente.
"""

from __future__ import annotations

import math
import os
import re
import sqlite3
from typing import Any, Optional


def require_token(env: dict) -> str:
    # TODO
    raise NotImplementedError


def should_retry(status: int) -> bool:
    # TODO
    raise NotImplementedError


def normalize_address(s: str) -> str:
    # TODO
    raise NotImplementedError


class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}

    def geocode(self, city: str) -> Optional[dict]:
        # TODO
        raise NotImplementedError


def haversine_km(a: tuple[float, float], b: tuple[float, float]) -> float:
    # TODO
    raise NotImplementedError


def build_db() -> sqlite3.Connection:
    con = sqlite3.connect(":memory:")
    # TODO schema clients/transactions/evidence
    return con


def main() -> None:
    os.environ.setdefault("API_TOKEN", "syn-demo")
    print("token_len", len(require_token(dict(os.environ))))
    print("retry 429", should_retry(429))
    print("norm", normalize_address("  av  larco  1 "))
    print("geo", MockGeocoder().geocode("Lima"))
    print("km", round(haversine_km((-12.0464, -77.0428), (-12.05, -77.125)), 2))


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "En el README muestra: (1) manifest de provenance sin token, (2) join de caso SQLite, (3) distancia Lima–Callao como geoseñal con disclaimer. Eso evidencia el incremento CP-N1-C de S12.",
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
    ],
  },
  resources: {
    docs: [
      {
        label: "urllib.request — Extensible library for opening URLs",
        url: "https://docs.python.org/3/library/urllib.request.html",
        note: "HTTP síncrono stdlib; en el curso priorizamos mocks + status/JSON",
      },
      {
        label: "sqlite3 — DB-API 2.0 interface for SQLite",
        url: "https://docs.python.org/3/library/sqlite3.html",
        note: "placeholders, transactions, PRAGMA",
      },
      {
        label: "http — HTTP modules",
        url: "https://docs.python.org/3/library/http.html",
        note: "status codes semánticos",
      },
      {
        label: "math — Mathematical functions",
        url: "https://docs.python.org/3/library/math.html",
        note: "Haversine con sin/cos/asin",
      },
    ],
    books: [
      {
        label: "Python Cookbook — network/data recipes",
        note: "Adaptar a mocks y provenance del curso; no copiar PII real.",
      },
      {
        label: "Designing Data-Intensive Applications (Kleppmann) — selecciones",
        note: "Contratos, reintentos y datos derivados; alinear con límites N1.",
      },
    ],
    courses: [
      {
        label: "Real Python — Working with JSON",
        url: "https://realpython.com/python-json/",
        note: "Parse seguro; practicar con fixtures locales.",
      },
    ],
  },
}
