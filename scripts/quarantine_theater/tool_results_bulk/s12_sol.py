
# ========== S12 ==========

def s12_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 3, "400 Bad Request es error de cliente: no retry ciego."),
            sc(1, 1, "Token de API en env / secret store, no hardcode."),
            sc(2, 2, "SQL con f-string e input es inyeccion; usar placeholders ?."),
            sc(3, 0, "document_id a geocoder publico viola politica egress CP-N1-C."),
            sc(4, 3, "1.2 km es geosenal de relacion, no veredicto de parentesco/fraude."),
        ]
    return [
        sc(0, 3, "Clasificacion HTTP 4xx no reintentable a ciegas."),
        sc(1, 1, "Secretos fuera del codigo."),
        sc(2, 2, "Parametros SQL bound."),
        sc(3, 0, "Egress minimo: ciudad/direccion, no doc bancario."),
        sc(4, 3, "Haversine aporta senal no veredicto."),
    ]

def s12_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S12-T1-A-E1', 'def classify_status(code):\n    if 200 <= code < 300:\n        return "ok"\n    if 400 <= code < 500:\n        return "client_error_no_blind_retry"\n    if 500 <= code < 600:\n        return "server_error_maybe_retry"\n    return "other"\nprint(classify_status(400), classify_status(503), classify_status(200))\n', '400 no retry ciego; 503 maybe retry.' if A else 'politica HTTP.', ['http']))
    out.append(ex('S12-T1-A-E2', 'def should_retry(code):\n    return code in {408, 429, 500, 502, 503, 504}\nprint(should_retry(400), should_retry(503))\n', 'allowlist de reintento.' if A else 'False True.', ['retry']))
    out.append(ex('S12-T1-A-E3', 'class ApiError(Exception):\n    def __init__(self, code, msg):\n        self.code = code\n        super().__init__(msg)\ne = ApiError(400, "bad request")\nprint(e.code, str(e))\n', 'error de API tipado.' if A else 'code+msg.', ['ApiError']))
    out.append(ex('S12-T1-B-E1', 'import os\ndef get_token():\n    tok = os.environ.get("API_TOKEN")\n    if not tok:\n        raise RuntimeError("API_TOKEN missing")\n    return tok\n# no hardcode\nprint("env_only")\n', 'token desde env.' if A else 'no en repo.', ['secrets']))
    out.append(ex('S12-T1-B-E2', 'def redact_headers(h):\n    out = dict(h)\n    if "Authorization" in out:\n        out["Authorization"] = "Bearer ***"\n    return out\nprint(redact_headers({"Authorization": "Bearer SECRET", "Accept": "json"}))\n', 'redact Authorization en logs.' if A else 'Bearer ***.', ['redact']))
    out.append(ex('S12-T1-B-E3', 'ALLOWED_EGRESS_FIELDS = {"city", "address_line", "country"}\ndef filter_egress(payload):\n    return {k: v for k, v in payload.items() if k in ALLOWED_EGRESS_FIELDS}\nprint(filter_egress({"city": "Lima", "document_id": "SECRET"}))\n', 'no enviar document_id a geocoder.' if A else 'allowlist egress.', ['egress']))
    out.append(ex('S12-T2-A-E1', 'import hashlib, json\nbody = {"lat": -12.0, "lon": -77.0}\nprov = {\n    "source_url": "https://example.com/geo",\n    "status_code": 200,\n    "body_sha12": hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()[:12],\n}\nprint(prov)\n', 'provenance de fetch.' if A else 'url+status+hash.', ['provenance']))
    out.append(ex('S12-T2-A-E2', 'cache = {}\ndef get_cached(key, fetcher):\n    if key not in cache:\n        cache[key] = fetcher()\n    return cache[key]\nprint(get_cached("Lima", lambda: {"lat": -12.04}))\nprint(get_cached("Lima", lambda: {"lat": 0}))\n', 'cache evita segundo fetch.' if A else 'mismo objeto.', ['cache']))
    out.append(ex('S12-T2-A-E3', 'def timeout_policy(seconds):\n    if seconds <= 0:\n        raise ValueError("timeout")\n    return seconds\nprint(timeout_policy(5))\n', 'timeout obligatorio en cliente HTTP.' if A else 'fail si <=0.', ['timeout']))
    out.append(ex('S12-T2-B-E1', 'REQUIRED = {"lat", "lon", "provider"}\nPRECALC = {"Lima": {"lat": -12.0464, "lon": -77.0428, "provider": "precalc"}}\ndef contract_ok(d):\n    return not (REQUIRED - set(d.keys()))\ndef geocode(city, fail_online=False):\n    if fail_online:\n        return {**PRECALC[city], "mode": "offline_fallback"}\n    return {"lat": -12.0464, "lon": -77.0428, "provider": "online", "mode": "online"}\nprint(contract_ok(geocode("Lima")))\nprint(geocode("Lima", fail_online=True)["mode"])\n', 'fallback offline precalc.' if A else 'contrato lat/lon/provider.', ['geocode']))
    out.append(ex('S12-T2-B-E2', 'def validate_geo(d):\n    for k in ("lat", "lon"):\n        if k not in d:\n            return False\n        if not isinstance(d[k], (int, float)):\n            return False\n    return True\nprint(validate_geo({"lat": 1.0, "lon": 2.0}), validate_geo({"lat": "x"}))\n', 'valida tipos geo.' if A else 'True False.', ['validate']))
    out.append(ex('S12-T2-B-E3', 'def offline_table():\n    return {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}\nprint(sorted(offline_table()))\n', 'tabla precalc autorizada.' if A else 'mock offline.', ['precalc']))
    out.append(ex('S12-T3-A-E1', 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")\ncon.execute("INSERT INTO clients VALUES (?, ?)", ("C001", "Ana"))\nprint(con.execute("SELECT name FROM clients WHERE id = ?", ("C001",)).fetchone())\n', 'placeholders ? no f-string.' if A else 'SQLite demo.', ['sql']))
    out.append(ex('S12-T3-A-E2', 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.executescript(\'CREATE TABLE clients(id TEXT PRIMARY KEY);\\nCREATE TABLE transactions(id TEXT PRIMARY KEY, client_id TEXT);\\nCREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT);\\n\')\nprint("tables_ok")\n', 'schema minimo 3 tablas.' if A else 'clients/txs/evidence.', ['schema']))
    out.append(ex('S12-T3-A-E3', 'def bad_sql(user):\n    # ANTIPATRON: f"SELECT * FROM t WHERE name=\'{user}\'"\n    return "use placeholders instead"\nprint(bad_sql("x"))\n', 'documenta antipatron inyeccion.' if A else 'placeholders only.', ['injection']))
    out.append(ex('S12-T3-B-E1', 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT UNIQUE)")\nbatch = [("C001", "DOC1"), ("C002", "DOC2"), ("C003", "DOC1")]\ntry:\n    con.execute("BEGIN")\n    con.executemany("INSERT INTO clients VALUES (?,?)", batch)\n    con.commit()\n    print("unexpected_commit")\nexcept sqlite3.IntegrityError:\n    con.rollback()\n    print("rollback_on_conflict")\n', 'UNIQUE conflict -> rollback.' if A else 'transaccion atomica.', ['tx']))
    out.append(ex('S12-T3-B-E2', 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE t(id TEXT PRIMARY KEY)")\ncon.execute("INSERT INTO t VALUES (\'a\')")\ntry:\n    con.execute("INSERT INTO t VALUES (\'a\')")\nexcept sqlite3.IntegrityError as e:\n    print(type(e).__name__)\n', 'IntegrityError en PK duplicada.' if A else 'constraint.', ['integrity']))
    out.append(ex('S12-T3-B-E3', 'def unit_of_work(ops):\n    done = []\n    try:\n        for op in ops:\n            done.append(op())\n        return done\n    except Exception:\n        return "rollback"\nprint(unit_of_work([lambda: 1, lambda: 2]))\n', 'unidad de trabajo simple.' if A else 'commit logico.', ['uow']))
    out.append(ex('S12-T4-A-E1', 'class MockGeocoder:\n    DB = {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}\n    def geocode(self, city):\n        if city not in self.DB:\n            return None\n        lat, lon = self.DB[city]\n        return {"city": city, "lat": lat, "lon": lon, "provider": "authorized_mock"}\ng = MockGeocoder()\nprint(g.geocode("Lima")["provider"], g.geocode("Iquitos"))\n', 'MockGeocoder autorizado.' if A else 'None si ciudad desconocida.', ['mock']))
    out.append(ex('S12-T4-A-E2', 'def assert_mock_only(provider):\n    assert provider in {"authorized_mock", "precalc", "offline_fallback"}\n    return True\nprint(assert_mock_only("authorized_mock"))\n', 'solo providers permitidos en curso.' if A else 'politica.', ['policy']))
    out.append(ex('S12-T4-A-E3', 'points = {"Lima": (-12.0464, -77.0428), "Callao": (-12.05, -77.125)}\nprint(points["Lima"])\n', 'fixtures geo sinteticas.' if A else 'sin PII real.', ['fixtures']))
    out.append(ex('S12-T4-B-E1', 'import math\ndef haversine_km(a, b):\n    R = 6371.0\n    lat1, lon1 = map(math.radians, a)\n    lat2, lon2 = map(math.radians, b)\n    dlat, dlon = lat2 - lat1, lon2 - lon1\n    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2\n    return 2 * R * math.asin(math.sqrt(h))\nlima = (-12.0464, -77.0428)\ncallao = (-12.0500, -77.1250)\nprint(round(haversine_km(lima, callao), 2))\n', 'haversine Lima-Callao ~km.' if A else 'senal de distancia.', ['haversine']))
    out.append(ex('S12-T4-B-E2', 'def geo_signal(km, threshold=2.0):\n    return {"geo_distance_km": km, "close": km <= threshold, "verdict": None}\nprint(geo_signal(1.2))\n', '1.2 km close; verdict None.' if A else 'no parentesco auto.', ['signal']))
    out.append(ex('S12-T4-B-E3', 'def as_relationship_signal(km):\n    return {\n        "type": "geo_distance",\n        "km": km,\n        "relationship_signal_score": max(0.0, min(1.0, 1.0 - km / 10.0)),\n        "verdict": None,\n    }\nprint(as_relationship_signal(1.2)["verdict"])\n', 'verdict None siempre aqui.' if A else 'score acotado 0..1.', ['relationship']))
    return out
