# S12 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:07:19.183+00:00
Section: APIs, SQL y geodatos responsables
File: `s12-performance.ts`
STORM cycles: **12**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [urllib.request](https://docs.python.org/3/library/urllib.request.html) — HTTP stdlib
- Python: [sqlite3](https://docs.python.org/3/library/sqlite3.html) — params tx
- Python: [http](https://docs.python.org/3/library/http.html) — status codes
- Python: [math](https://docs.python.org/3/library/math.html) — haversine
- Python: [json](https://docs.python.org/3/library/json.html) — parse fail-closed
- Python: [hashlib](https://docs.python.org/3/library/hashlib.html) — cache keys
- OWASP: [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) — no f-string SQL
- IETF: [RFC 7231](https://httpwg.org/specs/rfc7231.html) — HTTP semantics
- Real Python: [Working with JSON](https://realpython.com/python-json/) — JSON safe
- Real Python: [SQLite](https://realpython.com/python-sql-libraries/#sqlite) — local DB
- MDN: [HTTP status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) — 2xx/4xx/5xx
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [os.environ](https://docs.python.org/3/library/os.html#os.environ) — secrets out of code

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + strip theater fillers |
| weDo | CASO DEFECT |
| git | NO restore (WT DEFECT>HEAD) |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Performance & concurrency” a APIs, SQL y geodatos (mapa de la sección)
**P1** (rank 9.55/10)
> En V3, **S12 no es el path principal de multiprocessing, profiling ni logging de producción**. Ese material se reubica al tramo de sistemas/ops. Aquí construyes…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/urllib.request.html; Python: https://docs.python.org/3/library/sqlite3.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Performance & concurrency” a APIs, SQL y geo» in S12_STORM.json.

**P2** (rank 9.55/10)
> El hilo conductor es un **adaptador de señales sintéticas** (entidades, evidencias, coordenadas) con timeout, cache, provenance y fallback offline. Solo datos s…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/sqlite3.html; Python: https://docs.python.org/3/library/http.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Performance & concurrency” a APIs, SQL y geo» in S12_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 HTTP** → **T2 Auth/cache/contracts** → **T3 SQL** → **T4 Geodatos responsables**. Métrica del gate: adaptador con status/retry selectivo + join loca…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/http.html; Python: https://docs.python.org/3/library/math.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Performance & concurrency” a APIs, SQL y geo» in S12_STORM.json.

### requests/responses, status y JSON
**P1** (rank 9.55/10)
> Un cliente HTTP síncrono hace **GET/POST**, recibe un **status code** y un cuerpo (a menudo JSON). En este curso usamos un **cliente mock** o `urllib` con fixtu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/math.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «requests/responses, status y JSON» in S12_STORM.json.

**P2** (rank 9.55/10)
> **2xx** = éxito; **4xx** = error del cliente (no reintentes a ciegas); **5xx** = error del servidor (candidatos a retry con límite). Parsea con manejo de cuerpo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python: https://docs.python.org/3/library/hashlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «requests/responses, status y JSON» in S12_STORM.json.

**P3** (rank 9.55/10)
> **Timeout es obligatorio**: sin `timeout=` un socket colgado congela el pipeline de CP-N1-C. Headers (`Accept`, `User-Agent`) documentan el contrato del adaptad…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/hashlib.html; OWASP: https://owasp.org/www-community/attacks/SQL_Injection
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «requests/responses, status y JSON» in S12_STORM.json.

### Timeout, paginación, retry/backoff y rate limit
**P1** (rank 9.55/10)
> **Timeout** acota la espera por request. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez al heap — crítico cuand…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** OWASP: https://owasp.org/www-community/attacks/SQL_Injection; IETF: https://httpwg.org/specs/rfc7231.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Timeout, paginación, retry/backoff y rate limit» in S12_STORM.json.

**P2** (rank 9.55/10)
> **Retry/backoff** solo en errores **transitorios** (429, 503, timeouts de red). Un **400** o **404** no se reintenta: reintentar no repara un id mal formado. Re…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** IETF: https://httpwg.org/specs/rfc7231.html; Real Python: https://realpython.com/python-json/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Timeout, paginación, retry/backoff y rate limit» in S12_STORM.json.

**P3** (rank 9.55/10)
> Rate limit: duerme entre páginas o respeta cuotas del proveedor. En demo usamos contador de delays en lugar de `time.sleep` real para tests deterministas. Caso …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Real Python: https://realpython.com/python-json/; Real Python: https://realpython.com/python-sql-libraries/#sqlite
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Timeout, paginación, retry/backoff y rate limit» in S12_STORM.json.

### Auth, secretos, cache y provenance
**P1** (rank 9.55/10)
> Autenticación **Bearer** (o basic) lee el token de **variable de entorno**, nunca hardcodeado en el repo. Si falta `API_TOKEN`, falla cerrado con mensaje claro …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Real Python: https://realpython.com/python-sql-libraries/#sqlite; MDN: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Auth, secretos, cache y provenance» in S12_STORM.json.

**P2** (rank 9.55/10)
> **Cache de GET** por hash de URL con **TTL** reduce costo y latencia; no caches respuestas de escritura ni PII sin política. Invalida o no reutilices si el stat…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MDN: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Auth, secretos, cache y provenance» in S12_STORM.json.

**P3** (rank 9.55/10)
> **Provenance**: cada fetch deja `source_url`, `fetched_at`, `status_code`, `cache_hit`. **Nunca loguees el token** ni el header Authorization. Caso sintético: s…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/os.html#os.environ
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Auth, secretos, cache y provenance» in S12_STORM.json.

### Contract tests y fallback
**P1** (rank 9.55/10)
> Un **contract test** fija las claves obligatorias del JSON del proveedor (fixture). Si el schema cambia (`lat` renombrado a `latitude`), el test falla **antes**…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/os.html#os.environ; Python: https://docs.python.org/3/library/urllib.request.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Contract tests y fallback» in S12_STORM.json.

**P2** (rank 9.55/10)
> **Fallback degradado**: si 5xx o red caída, lee coordenadas/precomputados locales y marca `mode=offline` en provenance. No finjas éxito online: la traza debe de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/urllib.request.html; Python: https://docs.python.org/3/library/sqlite3.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Contract tests y fallback» in S12_STORM.json.

**P3** (rank 9.55/10)
> Feature flag offline permite demos reproducibles sin red — **obligatorio** en CP-N1-C. Caso sintético: `assert_contract({"lat","lon","label"})` y geocode online…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/sqlite3.html; Python: https://docs.python.org/3/library/http.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Contract tests y fallback» in S12_STORM.json.

### Esquema, CRUD y joins
**P1** (rank 9.55/10)
> SQLite vía `sqlite3` basta para el almacén local de CP-N1-C: tablas `clients`, `transactions`, `evidence` (nombres alineados al dominio de S11). Archivo `:memor…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/http.html; Python: https://docs.python.org/3/library/math.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Esquema, CRUD y joins» in S12_STORM.json.

**P2** (rank 9.55/10)
> CRUD = CREATE/INSERT/SELECT/UPDATE (DELETE con cuidado y soft-delete si hace falta auditoría). **JOIN** une evidencias a entidades por `entity_id` para armar el…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/math.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Esquema, CRUD y joins» in S12_STORM.json.

**P3** (rank 9.55/10)
> Empieza transacciones explícitas cuando un caso toca varias filas; en T3-B profundizamos COMMIT/ROLLBACK. Caso sintético: insert `C001` + evidence geo → JOIN de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python: https://docs.python.org/3/library/hashlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Esquema, CRUD y joins» in S12_STORM.json.

### Parámetros, transacciones, constraints e índices
**P1** (rank 9.55/10)
> Usa placeholders `?` (o `:name` con `Connection.row_factory`). **Prohibido** armar SQL con f-strings de input de usuario: es el camino clásico a inyección aunqu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/hashlib.html; OWASP: https://owasp.org/www-community/attacks/SQL_Injection
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Parámetros, transacciones, constraints e índices» in S12_STORM.json.

**P2** (rank 9.55/10)
> `executemany` + `BEGIN`/`COMMIT` hacen batch atómico; un `UNIQUE` roto → `ROLLBACK` y reporte de la fila ofensora. No dejes la DB a medias con 2 de 3 inserts “c…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** OWASP: https://owasp.org/www-community/attacks/SQL_Injection; IETF: https://httpwg.org/specs/rfc7231.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Parámetros, transacciones, constraints e índices» in S12_STORM.json.

**P3** (rank 9.55/10)
> `UNIQUE`/`NOT NULL` e **índices** en `document_id` / `entity_id` aceleran lookups del caso. Caso sintético: batch con `document_id` duplicado hace rollback y `C…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** IETF: https://httpwg.org/specs/rfc7231.html; Real Python: https://realpython.com/python-json/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Parámetros, transacciones, constraints e índices» in S12_STORM.json.

### Normalización y geocoding autorizado
**P1** (rank 9.55/10)
> Normaliza direcciones sintéticas: trim, colapsa espacios, title-case ligero. No inventes campos (distrito, ubigeo) que no vinieron en el payload — el invento si…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Real Python: https://realpython.com/python-json/; Real Python: https://realpython.com/python-sql-libraries/#sqlite
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Normalización y geocoding autorizado» in S12_STORM.json.

**P2** (rank 9.55/10)
> Solo **geocoder autorizado/mock**. Política del curso: **no envíes PII bancaria** (docs, cuentas, montos, nombres completos si la política lo prohíbe) a proveed…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Real Python: https://realpython.com/python-sql-libraries/#sqlite; MDN: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Normalización y geocoding autorizado» in S12_STORM.json.

**P3** (rank 9.55/10)
> `MockGeocoder` devuelve lat/lon fijos por ciudad de demo (Lima, Arequipa) para demos offline reproducibles. Caso sintético: `normalize_address("  av.  larco  12…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MDN: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Normalización y geocoding autorizado» in S12_STORM.json.

### Calidad de coordenada, Haversine, caching y política
