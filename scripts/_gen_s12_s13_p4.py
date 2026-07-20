#!/usr/bin/env python3
"""Generate S12 and S13 V3 PHASE 4 section TS files with verified Python outputs.

Authority: LANE-S12-S13-P4 Author.
Does not touch seed/checkpoint/ledger/orchestration/s01–s11.
Platform ids preserved: performance, rpa-automation.
Español peruano; datos sintéticos only.
"""
from __future__ import annotations

import json
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
STATE = ROOT / "course-state"
LANES = STATE / "lanes"


def run_py(code: str) -> str:
    r = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
        timeout=45,
    )
    if r.returncode != 0:
        raise RuntimeError(f"Python failed:\nCODE:\n{code}\nSTDERR:\n{r.stderr}")
    out = r.stdout
    if out.endswith("\n"):
        out = out[:-1]
    return out


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def ts_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


@dataclass
class Ex:
    eid: str
    sub: str
    kind: str
    instruction: str
    hint1: str
    hint2: str
    starter: str
    solution: str
    edge: list[str] = field(default_factory=list)
    tests: str = ""
    feedback: str = ""
    title: str = "exercise.py"
    output: str = ""


@dataclass
class Demo:
    did: str
    sub: str
    description: str
    code: str
    why: str
    title: str = "demo.py"
    output: str = ""
    env: str = "local-python"


@dataclass
class Theory:
    heading: str
    paragraphs: list[str]
    sub: Optional[str] = None
    code: Optional[str] = None
    code_title: str = "example.py"
    code_out: str = ""
    callout: Optional[tuple[str, str, str]] = None


def verify_all(demos: list[Demo], exercises: list[Ex]) -> dict[str, str]:
    log: dict[str, str] = {}
    for d in demos:
        d.output = run_py(d.code)
        log[d.did] = "VERIFIED"
    for e in exercises:
        e.output = run_py(e.solution)
        log[e.eid] = "VERIFIED"
    return log


def theory_block(t: Theory) -> str:
    paras = ",\n".join(f"        {ts_str(p)}" for p in t.paragraphs)
    lines = [
        "    {",
        f"      heading: {ts_str(t.heading)},",
    ]
    if t.sub:
        lines.append(f"      subtopicId: {ts_str(t.sub)},")
    lines.append(f"      paragraphs: [\n{paras},\n      ],")
    if t.code is not None:
        out = t.code_out if t.code_out else run_py(t.code)
        t.code_out = out
        lines.append("      code: {")
        lines.append("        language: 'python',")
        lines.append(f"        title: {ts_str(t.code_title)},")
        lines.append(f"        code: `{esc(t.code)}`,")
        lines.append(f"        output: `{esc(out)}`,")
        lines.append("      },")
    if t.callout:
        ctype, ctitle, ccontent = t.callout
        lines.append("      callout: {")
        lines.append(f"        type: {ts_str(ctype)},")
        lines.append(f"        title: {ts_str(ctitle)},")
        lines.append(f"        content:\n          {ts_str(ccontent)},")
        lines.append("      },")
    lines.append("    },")
    return "\n".join(lines)


def demo_step(d: Demo) -> str:
    if not d.output:
        d.output = run_py(d.code)
    return f"""      {{
        demoId: {ts_str(d.did)},
        subtopicId: {ts_str(d.sub)},
        environment: {ts_str(d.env)},
        description: {ts_str(d.description)},
        code: {{
          language: 'python',
          title: {ts_str(d.title)},
          code: `{esc(d.code)}`,
          output: `{esc(d.output)}`,
        }},
        why: {ts_str(d.why)},
      }},"""


def exercise_step(e: Ex) -> str:
    if not e.output:
        e.output = run_py(e.solution)
    edges = ", ".join(ts_str(x) for x in e.edge) if e.edge else ""
    return f"""      {{
        id: {ts_str(e.eid)},
        subtopicId: {ts_str(e.sub)},
        kind: {ts_str(e.kind)},
        instruction:
          {ts_str(e.instruction)},
        hint: {ts_str(e.hint1)},
        hints: [
          {ts_str(e.hint1)},
          {ts_str(e.hint2)},
        ],
        edgeCases: [{edges}],
        tests: {ts_str(e.tests or "salida coincide con solution output")},
        feedback: {ts_str(e.feedback or "Compara tu salida con la solución.")},
        starterCode: {{
          language: 'python',
          title: {ts_str(e.title)},
          code: `{esc(e.starter)}`,
        }},
        solutionCode: {{
          language: 'python',
          title: {ts_str(e.title)},
          code: `{esc(e.solution)}`,
          output: `{esc(e.output)}`,
        }},
      }},"""


def build_section(
    export_name: str,
    meta: dict[str, Any],
    theories: list[Theory],
    demos: list[Demo],
    exercises: list[Ex],
    i_do_intro: str,
    we_do_intro: str,
    youdo: dict[str, Any],
    selfcheck: list[dict],
    resources: dict,
) -> tuple[str, dict[str, str]]:
    for t in theories:
        if t.code:
            t.code_out = run_py(t.code)
    log = verify_all(demos, exercises)

    parts: list[str] = []
    parts.append("import type { CourseSection } from '../../types'")
    parts.append("")
    parts.append(f"export const {export_name}: CourseSection = {{")
    for k in [
        "id",
        "index",
        "title",
        "shortTitle",
        "tagline",
        "estimatedHours",
        "level",
        "phase",
        "icon",
        "accentColor",
    ]:
        v = meta[k]
        if isinstance(v, str):
            parts.append(f"  {k}: {ts_str(v)},")
        else:
            parts.append(f"  {k}: {v},")
    parts.append(f"  jobRelevance:\n    {ts_str(meta['jobRelevance'])},")
    parts.append("  learningOutcomes: [")
    for lo in meta["learningOutcomes"]:
        parts.append(f"    {{ text: {ts_str(lo)} }},")
    parts.append("  ],")
    parts.append("  theory: [")
    for t in theories:
        parts.append(theory_block(t))
    parts.append("  ],")
    parts.append("  iDo: {")
    parts.append(f"    intro: {ts_str(i_do_intro)},")
    parts.append("    steps: [")
    for d in demos:
        parts.append(demo_step(d))
    parts.append("    ],")
    parts.append("  },")
    parts.append("  weDo: {")
    parts.append(f"    intro: {ts_str(we_do_intro)},")
    parts.append("    steps: [")
    for e in exercises:
        parts.append(exercise_step(e))
    parts.append("    ],")
    parts.append("  },")
    parts.append("  youDo: {")
    parts.append(f"    title: {ts_str(youdo['title'])},")
    parts.append(f"    context:\n      {ts_str(youdo['context'])},")
    parts.append("    objectives: [")
    for o in youdo["objectives"]:
        parts.append(f"      {ts_str(o)},")
    parts.append("    ],")
    parts.append("    requirements: [")
    for r in youdo["requirements"]:
        parts.append(f"      {ts_str(r)},")
    parts.append("    ],")
    parts.append(f"    starterCode: `{esc(youdo['starterCode'])}`,")
    parts.append(f"    portfolioNote:\n      {ts_str(youdo['portfolioNote'])},")
    parts.append("    rubric: [")
    for item in youdo["rubric"]:
        parts.append(
            f"      {{ criterion: {ts_str(item['criterion'])}, weight: {ts_str(item['weight'])} }},"
        )
    parts.append("    ],")
    parts.append("  },")
    parts.append("  selfCheck: {")
    parts.append("    questions: [")
    for q in selfcheck:
        opts = ",\n".join(f"          {ts_str(o)}" for o in q["options"])
        parts.append("      {")
        parts.append(f"        question: {ts_str(q['question'])},")
        parts.append(f"        options: [\n{opts},\n        ],")
        parts.append(f"        correctIndex: {q['correctIndex']},")
        parts.append(f"        explanation:\n          {ts_str(q['explanation'])},")
        parts.append("      },")
    parts.append("    ],")
    parts.append("  },")
    parts.append("  resources: {")
    parts.append("    docs: [")
    for d in resources["docs"]:
        note = f",\n        note: {ts_str(d['note'])}" if d.get("note") else ""
        parts.append(
            f"      {{\n        label: {ts_str(d['label'])},\n        url: {ts_str(d['url'])}{note},\n      }},"
        )
    parts.append("    ],")
    parts.append("    books: [")
    for b in resources["books"]:
        parts.append(
            f"      {{\n        label: {ts_str(b['label'])},\n        note: {ts_str(b['note'])},\n      }},"
        )
    parts.append("    ],")
    parts.append("    courses: [")
    for c in resources["courses"]:
        note = f",\n        note: {ts_str(c['note'])}" if c.get("note") else ""
        parts.append(
            f"      {{\n        label: {ts_str(c['label'])},\n        url: {ts_str(c['url'])}{note},\n      }},"
        )
    parts.append("    ],")
    parts.append("  },")
    parts.append("}")
    parts.append("")
    return "\n".join(parts), log


def progress_payload(
    section: str,
    section_id: str,
    lane: str,
    meta: dict,
    slugs: list[tuple[str, str]],
    log: dict[str, str],
    youdo_title: str,
) -> dict:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    subtopics = {}
    for sid, slug in slugs:
        subtopics[sid] = {
            "slug": slug,
            "status": "COMPLETE",
            "theory": True,
            "demo": f"{sid}-DEMO",
            "exercises": [f"{sid}-E1", f"{sid}-E2", f"{sid}-E3"],
            "executed": True,
        }
    items = [{"id": k, "status": v, "notes": "python3 executed; output embedded"} for k, v in log.items()]
    return {
        "version": "3.2",
        "section": section,
        "section_id": section_id,
        "phase": "PHASE_4_COMPLETE",
        "lane": lane,
        "generated_at": now,
        "prompt_version": "3.2",
        "authority": (
            "PARALLEL_PRODUCTION author agent — does not mark section passed; "
            "does not edit checkpoint/ledger/seed/orchestration"
        ),
        "preamble": {
            "objective": f"Retarget {section_id} section TS to V3 roadmap; author full packages for all 8 subtopics.",
            "scope_in": [
                f"src/lib/course/sections/s{section[1:].lower()}-*.ts",
                f"course-state/{section.lower()}_phase4_progress.json",
                "course-state/lanes/LANE-S12-S13-P4.status.json",
            ],
            "scope_out": [
                "checkpoint.json",
                "section_ledger.json",
                "issue_registry.json",
                "parallel_orchestration.json",
                "prisma/seed.ts",
                "PHASE 5 exam A/B/C stems",
                "section_passed",
            ],
        },
        "meta_updates": meta,
        "subtopics_authored": subtopics,
        "counts": {
            "subtopics_done": 8,
            "subtopics_target": 8,
            "demos_done": 8,
            "demos_target": 8,
            "exercises_done": 24,
            "exercises_target": 24,
            "hints_per_exercise": 2,
            "theory_blocks_with_subtopicId": 8,
            "intro_theory_blocks": 1,
        },
        "youDo": youdo_title,
        "execution_log": {
            "runtime": "python3 local",
            "executed_at": now[:10],
            "UNVERIFIED": [],
            "items": items,
        },
        "section_passed": False,
        "locale": "es-PE",
        "synthetic_data_only": True,
    }


# ---------------------------------------------------------------------------
# S12 — APIs, SQL y geodatos responsables (platform id: performance)
# ---------------------------------------------------------------------------

def build_s12() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S12-T1-A", "requests-status-json"),
        ("S12-T1-B", "timeout-pagination-retry-ratelimit"),
        ("S12-T2-A", "auth-secrets-cache-provenance"),
        ("S12-T2-B", "contract-tests-fallback"),
        ("S12-T3-A", "schema-crud-joins"),
        ("S12-T3-B", "params-transactions-constraints-indexes"),
        ("S12-T4-A", "normalize-geocode-authorized"),
        ("S12-T4-B", "coord-quality-haversine-cache-policy"),
    ]
    meta = {
        "id": "performance",
        "index": 12,
        "title": "APIs, SQL y geodatos responsables",
        "shortTitle": "APIs · SQL · Geo",
        "tagline": "HTTP resiliente, SQL parametrizado, geocoding autorizado y adaptadores limitados sin PII bancaria a servicios públicos",
        "estimatedHours": 12,
        "level": "Intermedio",
        "phase": 0,
        "icon": "Gauge",
        "accentColor": "bg-gradient-to-br from-indigo-500 to-purple-600",
        "jobRelevance": (
            "En onboarding, compliance y data quality en bancos, fintech y retail en Perú, necesitas "
            "**adaptadores HTTP resilientes**, **SQL parametrizado** y **geoevidencia controlada** "
            "sin filtrar PII bancaria a geocoders públicos. Esta sección (id de plataforma `performance` "
            "conservado) retematiza a V3 **APIs + SQL + geodatos** e incrementa **CP-N1-C** "
            "(adquisición + geoevidencia) con mocks locales y datos sintéticos."
        ),
        "learningOutcomes": [
            "Consumir APIs HTTP síncronas, interpretar status y parsear JSON con errores controlados",
            "Implementar timeout obligatorio, paginación y retry/backoff solo en errores transitorios",
            "Autenticar con secretos fuera de código, cachear GET seguros y registrar provenance",
            "Escribir contract tests del adaptador y fallback degradado offline",
            "Diseñar esquema SQLite mínimo y ejecutar CRUD + join entidades/evidencias",
            "Usar queries parametrizadas, transacciones, constraints e índices; prohibir f-string SQL",
            "Normalizar direcciones sintéticas y usar solo geocoder autorizado/mock",
            "Evaluar calidad de coordenadas, Haversine y cache bajo política de proveedor",
        ],
    }

    theories = [
        Theory(
            heading="De “Performance & concurrency” a APIs, SQL y geodatos (mapa de la sección)",
            paragraphs=[
                "En V3, **S12 no es el path principal de multiprocessing, profiling ni logging de producción**. Ese material se reubica conceptualmente hacia el tramo de sistemas/ops. Aquí construyes el **incremento CP-N1-C de adquisición y geoevidencia**: cliente HTTP síncrono resiliente, SQLite parametrizado y geocoder mock/autorizado **sin PII bancaria a servicios públicos**.",
                "El hilo conductor es un **adaptador de señales sintéticas** (listas de entidades, evidencias y coordenadas) con timeout, cache, provenance y fallback offline. Solo datos sintéticos latam (`example.com`, Lima/Arequipa, ids `C00x`).",
                "Orden: **T1 HTTP** → **T2 Auth/cache/contracts** → **T3 SQL** → **T4 Geodatos responsables**.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Material legado de performance/concurrency de este archivo **no es el camino V3 del estudiante en S12**. Target: adaptadores HTTP + SQL + geo para CP-N1-C. Conserva datos sintéticos; nunca PII real ni tokens en logs.",
            ),
        ),
        Theory(
            heading="requests/responses, status y JSON",
            sub="S12-T1-A",
            paragraphs=[
                "Un cliente HTTP síncrono hace **GET/POST**, recibe un **status code** y un cuerpo (a menudo JSON). En este curso usamos un **cliente mock** o `urllib` con fixtures: la pedagogía es status + parse, no la librería de red.",
                "**2xx** = éxito; **4xx** = error del cliente (no reintentes a ciegas); **5xx** = error del servidor (candidatos a retry con límite). Siempre parsea con manejo de cuerpo vacío o JSON inválido.",
                "**Timeout es obligatorio**: sin `timeout=` un socket colgado congela el pipeline. Headers (`Accept`, `User-Agent`) documentan el contrato del adaptador.",
            ],
            code="""class MockResponse:
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
print("404 status", miss.status_code, "body", miss.json())""",
            code_title="mock_http_status.py",
            callout=(
                "tip",
                "Regla de status",
                "Traduce status → acción del adaptador (return None, raise, retry). No asumas siempre 200.",
            ),
        ),
        Theory(
            heading="Timeout, paginación, retry/backoff y rate limit",
            sub="S12-T1-B",
            paragraphs=[
                "**Timeout** acota la espera por request. **Paginación** (`page` o `cursor`/`next`) recorre colecciones grandes sin traer todo de una vez.",
                "**Retry/backoff** solo en errores **transitorios** (429, 503, timeouts). Un **400** o **404** no se reintenta. Respeta `Retry-After` y un **max_retries** duro.",
                "Rate limit: duerme entre páginas o respeta cuotas del proveedor. En demo usamos `sleep` simbólico o contador de delays.",
            ],
            code="""import time

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
print("items", all_items, "rate_limit_pauses", delays)""",
            code_title="paginate_rate.py",
            callout=(
                "warning",
                "No reintentes 400",
                "Retry ciego en 4xx de cliente amplifica abuso y no arregla el request.",
            ),
        ),
        Theory(
            heading="Auth, secretos, cache y provenance",
            sub="S12-T2-A",
            paragraphs=[
                "Autenticación **Bearer** o basic lee el token de **variable de entorno**, nunca hardcodeado. Si falta el secreto, falla cerrado con mensaje claro.",
                "**Cache de GET** por hash de URL con **TTL** reduce costo y latencia; no caches respuestas de escritura ni datos sensibles sin política.",
                "**Provenance**: cada fetch deja `source_url`, `fetched_at`, `status_code`, `cache_hit`. **Nunca loguees el token**.",
            ],
            code="""import os, hashlib, time, json

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
print("second_hit", hit2)""",
            code_title="auth_cache_prov.py",
            callout=(
                "danger",
                "Secretos fuera de código",
                "No commits de .env con tokens reales. No imprimas Authorization headers.",
            ),
        ),
        Theory(
            heading="Contract tests y fallback",
            sub="S12-T2-B",
            paragraphs=[
                "Un **contract test** fija las claves obligatorias del JSON del proveedor (fixture). Si el schema cambia, el test falla antes de producción.",
                "**Fallback degradado**: si 5xx o red caída, lee coordenadas/precomputados locales y marca `mode=offline` en provenance.",
                "Feature flag offline permite demos reproducibles sin red — obligatorio en CP-N1-C.",
            ],
            code="""REQUIRED = {"lat", "lon", "label"}

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
print("offline", geocode("Lima", online=False)["mode"])""",
            code_title="contract_fallback.py",
            callout=(
                "tip",
                "Fail soft, trace hard",
                "Fallback no oculta el fallo: deja mode=offline y razón en provenance.",
            ),
        ),
        Theory(
            heading="Esquema, CRUD y joins",
            sub="S12-T3-A",
            paragraphs=[
                "SQLite vía `sqlite3` basta para el almacén local de CP-N1-C: tablas `clients`, `transactions`, `evidence`.",
                "CRUD = CREATE/INSERT/SELECT/UPDATE (y DELETE con cuidado). **JOIN** une evidencias a entidades por `entity_id`.",
                "Empieza transacciones explícitas cuando un caso toca varias filas; en T3-B profundizamos COMMIT/ROLLBACK.",
            ],
            code="""import sqlite3

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
con.close()""",
            code_title="sqlite_join.py",
            callout=(
                "tip",
                "FKs lógicas primero",
                "Documenta entity_id aunque no actives FOREIGN KEY; la integridad empieza en el modelo.",
            ),
        ),
        Theory(
            heading="Parámetros, transacciones, constraints e índices",
            sub="S12-T3-B",
            paragraphs=[
                "Usa placeholders `?` (o `:name`). **Prohibido** armar SQL con f-strings de input de usuario: es inyección.",
                "`executemany` + `BEGIN`/`COMMIT` hacen batch atómico; un UNIQUE roto → `ROLLBACK` y reporte de fila.",
                "`UNIQUE`/`NOT NULL` e **índices** en `document_id` / `entity_id` aceleran lookups del dashboard.",
            ],
            code="""import sqlite3

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
con.close()""",
            code_title="params_tx.py",
            callout=(
                "danger",
                "f-string SQL = vulnerabilidad",
                "Nunca interpoles input en SQL. Siempre `?` y tupla de params.",
            ),
        ),
        Theory(
            heading="Normalización y geocoding autorizado",
            sub="S12-T4-A",
            paragraphs=[
                "Normaliza direcciones sintéticas: trim, colapsa espacios, title-case ligero. No inventes campos que no vinieron.",
                "Solo **geocoder autorizado/mock**. Política del curso: **no envíes PII bancaria** (docs, cuentas, montos) a proveedores públicos.",
                "`MockGeocoder` devuelve lat/lon fijos por ciudad de demo (Lima, Arequipa) para demos offline reproducibles.",
            ],
            code="""import re

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
print("geo", geo)""",
            code_title="mock_geocode.py",
            callout=(
                "warning",
                "Egress policy",
                "Checklist: ¿el payload al proveedor incluye solo dirección/ciudad sintética autorizada? Si no, bloquea.",
            ),
        ),
        Theory(
            heading="Calidad de coordenada, Haversine, caching y política",
            sub="S12-T4-B",
            paragraphs=[
                "Valida **lat ∈ [-90,90]** y **lon ∈ [-180,180]** antes de calcular. Coordenadas basura no entran al mapa.",
                "**Haversine** estima km entre dos puntos; sirve como **geoseñal de relación**, no como veredicto de parentesco o fraude.",
                "Cachea geocodes bajo TTL/política del proveedor. Documenta que distancia es **señal**, no kinship.",
            ],
            code="""import math

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
print("signal_only", "relationship_signal not kinship")""",
            code_title="haversine_signal.py",
            callout=(
                "tip",
                "Distancia ≠ parentesco",
                "1.2 km entre entidades es geoseñal; jamás auto-etiqueta is_family o fraude.",
            ),
        ),
    ]

    demos = [
        Demo(
            "S12-T1-A-DEMO",
            "S12-T1-A",
            "Cliente mock HTTP que devuelve lista de señales sintéticas con status 200 y parse JSON.",
            """class MockResponse:
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
print("kinds", [x["kind"] for x in data["items"]])""",
            "El adaptador ve el contrato real (status + JSON) sin red externa.",
            title="list_signals_demo.py",
        ),
        Demo(
            "S12-T1-B-DEMO",
            "S12-T1-B",
            "Paginar 3 páginas de API mock con contador de rate-limit (sin sleep real largo).",
            """API = {
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
print("pages_fetched", 3, "rate_limit_pauses", pauses)""",
            "Paginación + respeto de ritmo son el esqueleto de adquisición resiliente.",
            title="paginate_demo.py",
        ),
        Demo(
            "S12-T2-A-DEMO",
            "S12-T2-A",
            "Fetch con token de env + manifest de provenance (token no se imprime).",
            """import os, json, hashlib
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
print("token_logged", False)""",
            "Provenance auditable sin filtrar secretos.",
            title="provenance_demo.py",
        ),
        Demo(
            "S12-T2-B-DEMO",
            "S12-T2-B",
            "Contract test del geocoder mock + fallback a coordenadas precalculadas.",
            """REQUIRED = {"lat", "lon", "provider"}
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
print("contract_precalc", contract_ok(PRECALC["Lima"]))""",
            "Contrato + fallback hacen demos reproducibles cuando el proveedor no responde.",
            title="geocoder_contract_demo.py",
        ),
        Demo(
            "S12-T3-A-DEMO",
            "S12-T3-A",
            "Tablas clients, transactions, evidence con join de caso sintético.",
            """import sqlite3
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
con.close()""",
            "El join de caso es el corazón del almacén local del dashboard.",
            title="case_join_demo.py",
        ),
        Demo(
            "S12-T3-B-DEMO",
            "S12-T3-B",
            "Insert batch atómico; rollback si una fila viola UNIQUE.",
            """import sqlite3
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
con.close()""",
            "Transacciones evitan estados a medias cuando hay conflicto de negocio.",
            title="atomic_batch_demo.py",
        ),
        Demo(
            "S12-T4-A-DEMO",
            "S12-T4-A",
            "MockGeocoder devuelve lat/lon sintéticos para Lima/Arequipa.",
            """class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}
    def geocode(self, city):
        if city not in self.DB:
            return None
        lat, lon = self.DB[city]
        return {"city": city, "lat": lat, "lon": lon, "provider": "authorized_mock"}

g = MockGeocoder()
for c in ("Lima", "Arequipa", "Iquitos"):
    print(c, g.geocode(c))""",
            "Geocoder intercambiable y offline para demos sin egress de PII.",
            title="mock_cities_demo.py",
        ),
        Demo(
            "S12-T4-B-DEMO",
            "S12-T4-B",
            "Distancia entre dos puntos sintéticos Lima–Callao como geoseñal.",
            """import math

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
print("disclaimer", "signal != kinship")""",
            "La distancia alimenta relationship_signal_score, no un veredicto legal.",
            title="lima_callao_demo.py",
        ),
    ]

    exercises = [
        Ex(
            "S12-T1-A-E1", "S12-T1-A", "guided",
            "E1 (guiado) — Implementa `get_entity(store, entity_id)` que devuelva (status, body). 200 con el dict si existe; 404 con `{'error':'not_found'}` si no.",
            "Devuelve una tupla (status_code, dict).",
            "404 no lanza excepción: el adaptador decide la acción.",
            """store = {"C001": {"id": "C001", "region": "Lima"}}
def get_entity(store, entity_id):
    # TODO
    ...
print(get_entity(store, "C001"))
print(get_entity(store, "C999"))""",
            """store = {"C001": {"id": "C001", "region": "Lima"}}
def get_entity(store, entity_id):
    if entity_id not in store:
        return 404, {"error": "not_found"}
    return 200, store[entity_id]
print(get_entity(store, "C001"))
print(get_entity(store, "C999"))""",
            edge=["404 body estable", "id existente"],
            tests="200 con dict; 404 con error",
            feedback="Status explícito evita try/except ruidosos en el caller.",
            title="get_entity.py",
        ),
        Ex(
            "S12-T1-A-E2", "S12-T1-A", "independent",
            "E2 (independiente) — Dado un `payload` JSON-like dict de respuesta, implementa `parse_entity(payload)` que exija claves `id` y `region` y devuelva solo esas claves. Si falta alguna, devuelve None.",
            "Usa set de required keys.",
            "No mutes el payload original; construye un dict nuevo.",
            """def parse_entity(payload):
    # TODO
    ...
print(parse_entity({"id": "C001", "region": "Lima", "extra": 1}))
print(parse_entity({"id": "C001"}))""",
            """def parse_entity(payload):
    if not isinstance(payload, dict):
        return None
    if "id" not in payload or "region" not in payload:
        return None
    return {"id": payload["id"], "region": payload["region"]}
print(parse_entity({"id": "C001", "region": "Lima", "extra": 1}))
print(parse_entity({"id": "C001"}))""",
            edge=["clave faltante", "extra ignorado"],
            tests="dict tipado o None",
            feedback="Parse estricto reduce basura aguas abajo.",
            title="parse_entity.py",
        ),
        Ex(
            "S12-T1-A-E3", "S12-T1-A", "transfer",
            "E3 (transferencia) — Construye `STATUS_ACTION` mapeando 200→'use_body', 404→'missing', 429→'retry', 500→'retry', 400→'fix_client'. Imprime la acción para [200,404,429,400,500].",
            "dict.get(code, 'unknown')",
            "400 no es retry.",
            """STATUS_ACTION = {
    # TODO
}
for code in [200, 404, 429, 400, 500]:
    print(code, STATUS_ACTION.get(code, "unknown"))""",
            """STATUS_ACTION = {
    200: "use_body",
    404: "missing",
    429: "retry",
    500: "retry",
    400: "fix_client",
}
for code in [200, 404, 429, 400, 500]:
    print(code, STATUS_ACTION.get(code, "unknown"))""",
            edge=["400 no retry"],
            tests="tabla status→acción",
            feedback="La tabla es el contrato de resiliencia del adaptador.",
            title="status_table.py",
        ),
        Ex(
            "S12-T1-B-E1", "S12-T1-B", "guided",
            "E1 (guiado) — Simula timeout: `fetch(timeout_s, cost_s)` devuelve 'ok' si cost_s <= timeout_s, si no lanza TimeoutError capturado y devuelve 'timeout'.",
            "if cost > timeout: return 'timeout'",
            "No uses red real; compara números.",
            """def fetch(timeout_s, cost_s):
    # TODO
    ...
print(fetch(2.0, 0.5))
print(fetch(1.0, 3.0))""",
            """def fetch(timeout_s, cost_s):
    if cost_s > timeout_s:
        return "timeout"
    return "ok"
print(fetch(2.0, 0.5))
print(fetch(1.0, 3.0))""",
            edge=["cost == timeout cuenta ok o timeout según tu política; aquí > es timeout"],
            tests="ok y timeout",
            feedback="Timeout obligatorio evita workers colgados.",
            title="timeout_sim.py",
        ),
        Ex(
            "S12-T1-B-E2", "S12-T1-B", "independent",
            "E2 (independiente) — `collect_all(api)` pagina desde 1 hasta next is None y devuelve lista plana de items.",
            "while page is not None",
            "api[page]['items'] y api[page]['next']",
            """api = {
    1: {"items": ["a"], "next": 2},
    2: {"items": ["b", "c"], "next": None},
}
def collect_all(api):
    # TODO
    ...
print(collect_all(api))""",
            """api = {
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
print(collect_all(api))""",
            edge=["next null termina"],
            tests="lista plana a,b,c",
            feedback="Paginación correcta es prerequisito de full-sync sintético.",
            title="collect_pages.py",
        ),
        Ex(
            "S12-T1-B-E3", "S12-T1-B", "transfer",
            "E3 (transferencia) — `should_retry(status)` True solo para 429 y 503. Imprime para 400,404,429,503,200.",
            "return status in {429, 503}",
            "200 y 4xx de cliente no reintentan.",
            """def should_retry(status):
    # TODO
    ...
for s in [400, 404, 429, 503, 200]:
    print(s, should_retry(s))""",
            """def should_retry(status):
    return status in {429, 503}
for s in [400, 404, 429, 503, 200]:
    print(s, should_retry(s))""",
            edge=["400 False", "429 True"],
            tests="política retry transitorio",
            feedback="Retry selectivo respeta al proveedor y a tu cuota.",
            title="retry_policy.py",
        ),
        Ex(
            "S12-T2-A-E1", "S12-T2-A", "guided",
            "E1 (guiado) — `require_token(env)` lee API_TOKEN del dict env; si falta o vacío, lanza ValueError('API_TOKEN missing'); si no, devuelve el token.",
            "tok = env.get('API_TOKEN')",
            "if not tok: raise ValueError(...)",
            """def require_token(env):
    # TODO
    ...
print(require_token({"API_TOKEN": "abc"}))
try:
    require_token({})
except ValueError as e:
    print(str(e))""",
            """def require_token(env):
    tok = env.get("API_TOKEN")
    if not tok:
        raise ValueError("API_TOKEN missing")
    return tok
print(require_token({"API_TOKEN": "abc"}))
try:
    require_token({})
except ValueError as e:
    print(str(e))""",
            edge=["token vacío falla"],
            tests="abc + error message",
            feedback="Fail closed sin secreto evita llamadas anónimas accidentales.",
            title="require_token.py",
        ),
        Ex(
            "S12-T2-A-E2", "S12-T2-A", "independent",
            "E2 (independiente) — Cache GET: `Cache` con get/set por url; segunda get del mismo url devuelve cache_hit True. Usa dict interno.",
            "key = url",
            "almacenar body y devolver (body, hit)",
            """class Cache:
    def __init__(self):
        self._data = {}
    def get(self, url):
        # TODO return (body, hit) o (None, False)
        ...
    def set(self, url, body):
        # TODO
        ...
c = Cache()
c.set("u1", {"ok": True})
print(c.get("u1"))
print(c.get("missing"))""",
            """class Cache:
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
print(c.get("missing"))""",
            edge=["miss → None, False"],
            tests="hit y miss",
            feedback="Cache de GET reduce latencia en demos repetidas.",
            title="cache_get.py",
        ),
        Ex(
            "S12-T2-A-E3", "S12-T2-A", "transfer",
            "E3 (transferencia) — `min_provenance(url, status, cache_hit)` devuelve dict con source_url, fetched_at fijo '2026-07-20T00:00:00Z', status_code, cache_hit. Sin token.",
            "Campos mínimos de auditoría.",
            "No incluyas Authorization.",
            """def min_provenance(url, status, cache_hit):
    # TODO
    ...
print(sorted(min_provenance("https://x", 200, False).items()))""",
            """def min_provenance(url, status, cache_hit):
    return {
        "source_url": url,
        "fetched_at": "2026-07-20T00:00:00Z",
        "status_code": status,
        "cache_hit": cache_hit,
    }
print(sorted(min_provenance("https://x", 200, False).items()))""",
            edge=["sin token"],
            tests="4 campos de provenance",
            feedback="Provenance es evidencia de adquisición para el capstone.",
            title="provenance_fields.py",
        ),
        Ex(
            "S12-T2-B-E1", "S12-T2-B", "guided",
            "E1 (guiado) — `assert_keys(payload, required)` lanza AssertionError con missing sorted si faltan claves; si ok imprime 'ok'.",
            "missing = set(required) - set(payload)",
            "raise AssertionError si missing",
            """def assert_keys(payload, required):
    # TODO
    ...
assert_keys({"lat": 1, "lon": 2}, ["lat", "lon"])
print("ok")
try:
    assert_keys({"lat": 1}, ["lat", "lon"])
except AssertionError as e:
    print(e)""",
            """def assert_keys(payload, required):
    missing = set(required) - set(payload)
    if missing:
        raise AssertionError(f"missing keys: {sorted(missing)}")
assert_keys({"lat": 1, "lon": 2}, ["lat", "lon"])
print("ok")
try:
    assert_keys({"lat": 1}, ["lat", "lon"])
except AssertionError as e:
    print(e)""",
            edge=["mensaje con lon"],
            tests="ok + AssertionError",
            feedback="Contract tests baratos atrapan roturas de proveedor.",
            title="assert_keys.py",
        ),
        Ex(
            "S12-T2-B-E2", "S12-T2-B", "independent",
            "E2 (independiente) — `fetch_with_fallback(status, local_body)`: si status>=500 devuelve (local_body, 'offline'); si 200 devuelve ({'online':True}, 'online').",
            "if status >= 500",
            "retorna tupla (body, mode)",
            """def fetch_with_fallback(status, local_body):
    # TODO
    ...
print(fetch_with_fallback(200, {"lat": 0}))
print(fetch_with_fallback(503, {"lat": -12.0}))""",
            """def fetch_with_fallback(status, local_body):
    if status >= 500:
        return local_body, "offline"
    return {"online": True}, "online"
print(fetch_with_fallback(200, {"lat": 0}))
print(fetch_with_fallback(503, {"lat": -12.0}))""",
            edge=["5xx → offline"],
            tests="online/offline modes",
            feedback="Fallback degradado mantiene el demo del dashboard vivo.",
            title="fallback_5xx.py",
        ),
        Ex(
            "S12-T2-B-E3", "S12-T2-B", "transfer",
            "E3 (transferencia) — Matriz online/offline: dict con claves ('online', True/False) → comportamiento 'live_api' o 'local_file'. Imprime ambos.",
            "Usa tuplas como clave de dict.",
            "offline siempre local_file.",
            """matrix = {
    # TODO
}
for online in (True, False):
    print(online, matrix[online])""",
            """matrix = {
    True: "live_api",
    False: "local_file",
}
for online in (True, False):
    print(online, matrix[online])""",
            edge=["flag offline"],
            tests="matriz de operación",
            feedback="La matriz es runbook mínimo de operación N1.",
            title="online_offline_matrix.py",
        ),
        Ex(
            "S12-T3-A-E1", "S12-T3-A", "guided",
            "E1 (guiado) — En SQLite :memory:, crea tabla evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL). Inserta E1/C001/geo y cuenta filas.",
            "CREATE TABLE evidence (...)",
            "INSERT + SELECT COUNT(*)",
            """import sqlite3
con = sqlite3.connect(":memory:")
# TODO create + insert
print(con.execute("SELECT COUNT(*) FROM evidence").fetchone()[0])
con.close()""",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.execute(
    "CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, kind TEXT NOT NULL)"
)
con.execute("INSERT INTO evidence VALUES (?,?,?)", ("E1", "C001", "geo"))
con.commit()
print(con.execute("SELECT COUNT(*) FROM evidence").fetchone()[0])
con.close()""",
            edge=["NOT NULL en entity_id"],
            tests="count 1",
            feedback="Esquema mínimo de evidencias para el join de caso.",
            title="create_evidence.py",
        ),
        Ex(
            "S12-T3-A-E2", "S12-T3-A", "independent",
            "E2 (independiente) — CRUD de client: insert C001, update name a 'Ana Q', select name, delete, count 0.",
            "UPDATE clients SET name=? WHERE id=?",
            "Orden: insert → update → select → delete → count",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")
# TODO CRUD
con.close()""",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")
con.execute("INSERT INTO clients VALUES (?,?)", ("C001", "Ana"))
con.execute("UPDATE clients SET name=? WHERE id=?", ("Ana Q", "C001"))
print(con.execute("SELECT name FROM clients WHERE id=?", ("C001",)).fetchone()[0])
con.execute("DELETE FROM clients WHERE id=?", ("C001",))
print(con.execute("SELECT COUNT(*) FROM clients").fetchone()[0])
con.close()""",
            edge=["update parametrizado"],
            tests="Ana Q y 0",
            feedback="CRUD parametrizado es la base del almacén local.",
            title="crud_client.py",
        ),
        Ex(
            "S12-T3-A-E3", "S12-T3-A", "transfer",
            "E3 (transferencia) — Join: clients + evidence; imprime kinds de C001 ordenados.",
            "JOIN ON c.id = e.entity_id",
            "WHERE c.id = ?",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT);
CREATE TABLE evidence(id TEXT PRIMARY KEY, entity_id TEXT, kind TEXT);
INSERT INTO clients VALUES ('C001','Ana');
INSERT INTO evidence VALUES ('E1','C001','geo');
INSERT INTO evidence VALUES ('E2','C001','phone');
INSERT INTO evidence VALUES ('E3','C002','geo');
''')
# TODO query kinds for C001 sorted
con.close()""",
            """import sqlite3
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
con.close()""",
            edge=["no mezclar C002"],
            tests="['geo','phone']",
            feedback="Join por entity_id alimenta la ficha de caso.",
            title="join_evidence.py",
        ),
        Ex(
            "S12-T3-B-E1", "S12-T3-B", "guided",
            "E1 (guiado) — Reescribe búsqueda insegura: en lugar de f-string, usa `?` y muestra que input malicioso no inyecta.",
            "WHERE id = ?",
            "No uses f'...{user_id}'",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")
con.execute("INSERT INTO clients VALUES ('C001','Ana')")
user_id = "C001' OR '1'='1"
# TODO safe query
print(con.execute("SELECT name FROM clients WHERE id = ?", (user_id,)).fetchone())
con.close()""",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, name TEXT)")
con.execute("INSERT INTO clients VALUES ('C001','Ana')")
user_id = "C001' OR '1'='1"
print(con.execute("SELECT name FROM clients WHERE id = ?", (user_id,)).fetchone())
con.close()""",
            edge=["inyección neutralizada"],
            tests="None (no match literal)",
            feedback="Placeholders matan la inyección clásica.",
            title="safe_sql.py",
        ),
        Ex(
            "S12-T3-B-E2", "S12-T3-B", "independent",
            "E2 (independiente) — Transacción: inserta C001 ok; segundo insert con mismo id debe rollback y dejar count=0 si todo el batch falla junto (usa un solo BEGIN con dos inserts, el segundo duplicado).",
            "BEGIN; insert; insert duplicado; except rollback",
            "Tras rollback count 0",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY)")
try:
    # TODO atomic batch with duplicate
    ...
except sqlite3.IntegrityError:
    con.rollback()
print(con.execute("SELECT COUNT(*) FROM clients").fetchone()[0])
con.close()""",
            """import sqlite3
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
con.close()""",
            edge=["rollback total"],
            tests="count 0",
            feedback="Atomicidad evita filas huérfanas.",
            title="tx_rollback.py",
        ),
        Ex(
            "S12-T3-B-E3", "S12-T3-B", "transfer",
            "E3 (transferencia) — Crea índice idx_document_id en clients(document_id) y lista nombres de índices de la tabla via PRAGMA index_list.",
            "CREATE INDEX idx_document_id ON clients(document_id)",
            "PRAGMA index_list('clients')",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT)")
# TODO index + pragma
con.close()""",
            """import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT)")
con.execute("CREATE INDEX idx_document_id ON clients(document_id)")
names = [r[1] for r in con.execute("PRAGMA index_list('clients')").fetchall()]
print(sorted(names))
con.close()""",
            edge=["nombre de índice"],
            tests="idx_document_id presente",
            feedback="Índice en document_id acelera ER lookups.",
            title="choose_index.py",
        ),
        Ex(
            "S12-T4-A-E1", "S12-T4-A", "guided",
            "E1 (guiado) — `normalize_address` colapsa espacios y hace strip; imprime resultado de '  Jr.  de  la  Unión  100 '.",
            "re.sub(r'\\s+', ' ', s.strip())",
            "No uses title si no se pide; solo espacios.",
            """import re
def normalize_address(s):
    # TODO
    ...
print(repr(normalize_address("  Jr.  de  la  Unión  100 ")))""",
            """import re
def normalize_address(s):
    return re.sub(r"\\s+", " ", s.strip())
print(repr(normalize_address("  Jr.  de  la  Unión  100 ")))""",
            edge=["espacios dobles"],
            tests="string normalizado",
            feedback="Normalizar reduce misses del geocoder mock.",
            title="norm_addr.py",
        ),
        Ex(
            "S12-T4-A-E2", "S12-T4-A", "independent",
            "E2 (independiente) — Interfaz mínima: clase MockGeocoder con geocode(city)→dict|None para Lima y Arequipa.",
            "Tabla city→(lat,lon)",
            "provider='mock'",
            """class MockGeocoder:
    # TODO
    ...
g = MockGeocoder()
print(g.geocode("Lima")["lat"])
print(g.geocode("Cusco"))""",
            """class MockGeocoder:
    DB = {"Lima": (-12.0464, -77.0428), "Arequipa": (-16.4090, -71.5375)}
    def geocode(self, city):
        if city not in self.DB:
            return None
        lat, lon = self.DB[city]
        return {"city": city, "lat": lat, "lon": lon, "provider": "mock"}
g = MockGeocoder()
print(g.geocode("Lima")["lat"])
print(g.geocode("Cusco"))""",
            edge=["ciudad desconocida None"],
            tests="-12.0464 y None",
            feedback="Interfaz intercambiable permite swap a proveedor autorizado real más adelante.",
            title="mock_geocoder.py",
        ),
        Ex(
            "S12-T4-A-E3", "S12-T4-A", "transfer",
            "E3 (transferencia) — Checklist de egress: dado un payload dict, `allowed_for_public_geocoder(payload)` True solo si las claves ⊆ {'address','city','country'} (sin document_id, account, amount).",
            "set(payload) <= allowed",
            "document_id debe fallar",
            """ALLOWED = {"address", "city", "country"}
def allowed_for_public_geocoder(payload):
    # TODO
    ...
print(allowed_for_public_geocoder({"city": "Lima", "address": "Av 1"}))
print(allowed_for_public_geocoder({"city": "Lima", "document_id": "D1"}))""",
            """ALLOWED = {"address", "city", "country"}
def allowed_for_public_geocoder(payload):
    return set(payload) <= ALLOWED
print(allowed_for_public_geocoder({"city": "Lima", "address": "Av 1"}))
print(allowed_for_public_geocoder({"city": "Lima", "document_id": "D1"}))""",
            edge=["PII bancaria bloqueada"],
            tests="True/False",
            feedback="Política de egress es requisito CP-N1-C.",
            title="egress_checklist.py",
        ),
        Ex(
            "S12-T4-B-E1", "S12-T4-B", "guided",
            "E1 (guiado) — `valid_lat_lon(lat, lon)` True solo en rangos válidos. Prueba (0,0), (91,0), (0,181), (-12.04,-77.04).",
            "-90<=lat<=90 and -180<=lon<=180",
            "Imprime cuatro booleanos",
            """def valid_lat_lon(lat, lon):
    # TODO
    ...
for p in [(0,0), (91,0), (0,181), (-12.04, -77.04)]:
    print(p, valid_lat_lon(*p))""",
            """def valid_lat_lon(lat, lon):
    return -90 <= lat <= 90 and -180 <= lon <= 180
for p in [(0,0), (91,0), (0,181), (-12.04, -77.04)]:
    print(p, valid_lat_lon(*p))""",
            edge=["91 inválido"],
            tests="True False False True",
            feedback="Valida antes de Haversine o de pintar el mapa.",
            title="valid_coords.py",
        ),
        Ex(
            "S12-T4-B-E2", "S12-T4-B", "independent",
            "E2 (independiente) — `haversine_km` entre (0,0) y (0,1) debe ser ~111.19 km; imprime round(d, 2) y assert abs(d-111.19)<1.",
            "Fórmula Haversine con R=6371",
            "math.radians, sin, cos, asin, sqrt",
            """import math
def haversine_km(a, b):
    # TODO
    ...
d = haversine_km((0.0, 0.0), (0.0, 1.0))
print(round(d, 2))
assert abs(d - 111.19) < 1
print("tolerance_ok")""",
            """import math
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
print("tolerance_ok")""",
            edge=["tolerancia 1 km"],
            tests="~111.19 + tolerance_ok",
            feedback="Test de tolerancia evita regresiones de fórmula.",
            title="haversine_test.py",
        ),
        Ex(
            "S12-T4-B-E3", "S12-T4-B", "transfer",
            "E3 (transferencia) — `as_relationship_signal(km)` devuelve dict type=geo_distance_km, value=km, kinship_verdict=None. Imprime para 1.2.",
            "Nunca setees is_family",
            "kinship_verdict siempre None en N1",
            """def as_relationship_signal(km):
    # TODO
    ...
print(as_relationship_signal(1.2))""",
            """def as_relationship_signal(km):
    return {
        "type": "geo_distance_km",
        "value": km,
        "kinship_verdict": None,
    }
print(as_relationship_signal(1.2))""",
            edge=["no parentesco automático"],
            tests="verdict None",
            feedback="Geoseñal alimenta S13 relationship_signal_score sin colapsar a ER ni fraude.",
            title="geo_as_signal.py",
        ),
    ]

    youdo = {
        "title": "Adaptadores HTTP + SQLite + geoevidencia (CP-N1-C)",
        "context": (
            "Incrementas **CP-N1-C** con adquisición responsable: cliente HTTP mock con timeout/paginación/retry "
            "selectivo, secretos por env, cache GET, provenance sin tokens, SQLite parametrizado "
            "(clients/transactions/evidence) y **MockGeocoder** con política de no egress de PII bancaria. "
            "Solo datos sintéticos. En S13 se cierra el dashboard de evidencia y la regresión de nivel 1."
        ),
        "objectives": [
            "Cliente get_entity + list paginado con timeout y should_retry",
            "Provenance mínimo y cache de GET",
            "Esquema SQLite + join de caso + transacciones con rollback",
            "MockGeocoder + Haversine como geoseñal (no parentesco)",
            "Checklist de payload permitido al geocoder",
        ],
        "requirements": [
            "Timeout obligatorio en la interfaz del cliente (simulado o real)",
            "SQL solo con placeholders `?`",
            "Sin tokens en logs/provenance",
            "Geocoder mock/autorizado; sin PII bancaria a servicios públicos",
            "Datos sintéticos latam (example.com / Lima / Arequipa)",
            "Demo offline reproducible (fallback local)",
        ],
        "starterCode": '''"""cp_n1c_acquisition.py — CP-N1-C incremento S12
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
''',
        "portfolioNote": (
            "En el README muestra: (1) manifest de provenance sin token, (2) join de caso SQLite, "
            "(3) distancia Lima–Callao como geoseñal con disclaimer. Eso evidencia el incremento CP-N1-C de S12."
        ),
        "rubric": [
            {"criterion": "HTTP status/JSON/timeout/retry selectivo", "weight": "20%"},
            {"criterion": "Auth env + cache + provenance sin secretos", "weight": "15%"},
            {"criterion": "SQL parametrizado + transacciones + join", "weight": "25%"},
            {"criterion": "Geocoder mock + política de egress", "weight": "20%"},
            {"criterion": "Haversine como señal (no veredicto) + demo offline", "weight": "20%"},
        ],
    }

    selfcheck = [
        {
            "question": "Un 400 Bad Request del proveedor debe…",
            "options": [
                "Reintentarse con backoff infinito",
                "Tratarse como error de cliente (no retry ciego)",
                "Ignorarse como 200",
                "Borrar el cache",
            ],
            "correctIndex": 1,
            "explanation": "4xx de cliente no son transitorios; reintentar no corrige el request.",
        },
        {
            "question": "¿Dónde debe vivir el token de API?",
            "options": [
                "Hardcodeado en el repo",
                "En variable de entorno / secret store",
                "En el log de provenance",
                "En la URL pública del geocoder",
            ],
            "correctIndex": 1,
            "explanation": "Secretos fuera de código; nunca en logs ni git.",
        },
        {
            "question": "SQL con f-string e input de usuario es…",
            "options": [
                "La forma recomendada en SQLite",
                "Inyección / inseguro; usar placeholders `?`",
                "Obligatorio para índices",
                "Necesario para JOIN",
            ],
            "correctIndex": 1,
            "explanation": "Placeholders parametrizados previenen inyección.",
        },
        {
            "question": "Enviar document_id bancario a un geocoder público…",
            "options": [
                "Está permitido si hay timeout",
                "Viola la política de egress de CP-N1-C",
                "Mejora el Haversine",
                "Es requerido por SQLite",
            ],
            "correctIndex": 1,
            "explanation": "Solo dirección/ciudad sintética autorizada; sin PII bancaria.",
        },
        {
            "question": "1.2 km entre dos entidades sintéticas implica…",
            "options": [
                "Parentesco automático",
                "Fraude confirmado",
                "Una geoseñal de relación, no un veredicto",
                "Borrar el ER score",
            ],
            "correctIndex": 2,
            "explanation": "Haversine alimenta relationship_signal_score; no kinship/fraude auto.",
        },
    ]

    resources = {
        "docs": [
            {
                "label": "urllib.request — Extensible library for opening URLs",
                "url": "https://docs.python.org/3/library/urllib.request.html",
                "note": "HTTP síncrono stdlib; en el curso priorizamos mocks + status/JSON",
            },
            {
                "label": "sqlite3 — DB-API 2.0 interface for SQLite",
                "url": "https://docs.python.org/3/library/sqlite3.html",
                "note": "placeholders, transactions, PRAGMA",
            },
            {
                "label": "http — HTTP modules",
                "url": "https://docs.python.org/3/library/http.html",
                "note": "status codes semánticos",
            },
            {
                "label": "math — Mathematical functions",
                "url": "https://docs.python.org/3/library/math.html",
                "note": "Haversine con sin/cos/asin",
            },
        ],
        "books": [
            {
                "label": "Python Cookbook — network/data recipes",
                "note": "Adaptar a mocks y provenance del curso; no copiar PII real.",
            },
            {
                "label": "Designing Data-Intensive Applications (Kleppmann) — selecciones",
                "note": "Contratos, reintentos y datos derivados; alinear con límites N1.",
            },
        ],
        "courses": [
            {
                "label": "Real Python — Working with JSON",
                "url": "https://realpython.com/python-json/",
                "note": "Parse seguro; practicar con fixtures locales.",
            },
        ],
    }

    i_do = (
        "Ocho demos locales (mock HTTP, paginación, provenance, contract/fallback, SQLite join, "
        "transacción atómica, MockGeocoder, Haversine Lima–Callao). Observa status, SQL parametrizado "
        "y geoseñal sin veredicto."
    )
    we_do = (
        "24 ejercicios (E1 guiado / E2 independiente / E3 transferencia) por los 8 subtemas. "
        "Dos pistas por ejercicio. Ejecuta en local-python con datos sintéticos."
    )

    ts, log = build_section(
        "section12", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "performance",
        "index": 12,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 12,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "Gauge",
        "legacy_note": "Performance/concurrency demoted; target is APIs+SQL+geo for CP-N1-C",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


# ---------------------------------------------------------------------------
# S13 — Familiarity Evidence Dashboard (platform id: rpa-automation)
# ---------------------------------------------------------------------------

def build_s13() -> tuple[str, dict[str, str], list[tuple[str, str]], dict, str]:
    slugs = [
        ("S13-T1-A", "normalize-blocking-er"),
        ("S13-T1-B", "labeled-truth-precision-recall-clerical"),
        ("S13-T2-A", "shared-contact-distance-surnames"),
        ("S13-T2-B", "direct-tx-common-counterparties"),
        ("S13-T3-A", "evidence-score-uncertainty-explanation"),
        ("S13-T3-B", "review-threshold-abstention-no-auto-inference"),
        ("S13-T4-A", "dashboard-map-case-sheet"),
        ("S13-T4-B", "privacy-access-tests-demo-runbook"),
    ]
    meta = {
        "id": "rpa-automation",
        "index": 13,
        "title": "Familiarity Evidence Dashboard y cierre de nivel",
        "shortTitle": "Evidence Dashboard",
        "tagline": "ER determinista, señales de relación separadas, dashboard pseudonimizado, CP-N1-C + regresión N1 + CF-1",
        "estimatedHours": 14,
        "level": "Intermedio",
        "phase": 0,
        "icon": "Bot",
        "accentColor": "bg-gradient-to-br from-rose-500 to-pink-600",
        "jobRelevance": (
            "Cerrar el nivel 1 exige un **Familiarity Evidence Dashboard** con entity resolution "
            "determinista, señales de relación **separadas** del score ER, fichas pseudonimizadas, "
            "revisión humana y límites explícitos (sin parentesco/fraude automático). Esta sección "
            "(id de plataforma `rpa-automation` conservado) retematiza a V3 y es la **puerta de salida N1**: "
            "cierre **CP-N1-C**, **regresión de nivel 1 (S01–S13)** y artefactos **CF-1**."
        ),
        "learningOutcomes": [
            "Aplicar normalización y blocking para ER determinista y entity_resolution_score",
            "Evaluar ER con etiquetas sintéticas, precision/recall y cola clerical",
            "Computar relationship_signal_score (shared contact, distancia, apellidos) separado del ER",
            "Derivar señales de txs directas y contrapartes comunes sin afirmar colusión",
            "Producir score de evidencia con incertidumbre y explicación legible",
            "Aplicar umbrales de revisión/abstención; prohibir inferencia automática de parentesco/fraude",
            "Ensamblar scaffold de dashboard/mapa con fichas de caso pseudonimizadas",
            "Entregar ficha de privacidad, tests, demo reproducible y runbook de operación N1",
        ],
    }

    theories = [
        Theory(
            heading="De “RPA & automatización” al Familiarity Evidence Dashboard (mapa)",
            paragraphs=[
                "En V3, **S13 no es el path principal de Playwright, Ollama, OCR ni Prefect**. Ese material se reubica al tramo de automatización avanzada. Aquí cierras **CP-N1-C** con un **Familiarity Evidence Dashboard**: ER por reglas, señales de relación separadas, explicación humana y operación responsable.",
                "Promoción de nivel: tres capstones N1, **regresión S01–S13 (level-1)** y **CF-1** aprobados. Solo datos sintéticos pseudonimizados.",
                "Orden: **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**.",
            ],
            callout=(
                "info",
                "Contenido reubicado conceptualmente",
                "Material legado RPA/IA de este archivo **no es el camino V3 del estudiante en S13**. Target: dashboard de evidencia + cierre N1. Nunca PII real; nunca auto_fraud/is_family.",
            ),
        ),
        Theory(
            heading="Normalización, blocking y entity resolution",
            sub="S13-T1-A",
            paragraphs=[
                "Normaliza nombres y `document_id` (casefold, quitar espacios/guiones) antes de comparar. **Blocking** reduce pares candidatos (p. ej. apellido+región).",
                "ER **determinista por reglas** produce `entity_resolution_score` ∈ [0,1]. No uses ER probabilístico avanzado aquí (S30+).",
                "No colapses ER con señales de relación: son scores **separados** en la ficha de caso.",
            ],
            code="""import re

def norm_doc(d: str) -> str:
    return re.sub(r"[^a-z0-9]", "", d.casefold())

def norm_name(n: str) -> str:
    return re.sub(r"\\s+", " ", n.casefold().strip())

def block_key(rec):
    ap = norm_name(rec["name"]).split()[-1]
    return f"{ap}|{rec['region'].casefold()}"

a = {"name": "Ana Quispe", "document_id": "D-12.34", "region": "Lima"}
b = {"name": "ANA  QUISPE", "document_id": "d1234", "region": "Lima"}
score = 1.0 if norm_doc(a["document_id"]) == norm_doc(b["document_id"]) and block_key(a) == block_key(b) else 0.0
print("block", block_key(a), block_key(b))
print("entity_resolution_score", score)
print("relationship_signal_score", "SEPARATE")""",
            code_title="er_rules.py",
            callout=(
                "tip",
                "Dos scores, dos historias",
                "entity_resolution_score ≠ relationship_signal_score. La UI debe mostrarlos aparte.",
            ),
        ),
        Theory(
            heading="Verdad etiquetada, precision/recall y revisión clerical",
            sub="S13-T1-B",
            paragraphs=[
                "Con pares etiquetados sintéticos calculas **TP/FP/FN** → precision/recall simples.",
                "Scores en **banda de duda** van a **cola clerical** (humano), no a auto-merge.",
                "Un **FP no implica fraude**: es error de matching de identidad, no veredicto legal.",
            ],
            code="""# y_true 1=same entity, y_pred 1=system says match
pairs = [
    (1, 1), (1, 1), (1, 0),  # FN
    (0, 1), (0, 0), (0, 0),
]
tp = sum(1 for t, p in pairs if t == 1 and p == 1)
fp = sum(1 for t, p in pairs if t == 0 and p == 1)
fn = sum(1 for t, p in pairs if t == 1 and p == 0)
precision = tp / (tp + fp)
recall = tp / (tp + fn)
print("tp", tp, "fp", fp, "fn", fn)
print("precision", round(precision, 3), "recall", round(recall, 3))
print("fp_means_fraud", False)""",
            code_title="pr_metrics.py",
            callout=(
                "warning",
                "FP ≠ fraude",
                "False positive de ER es colisión de identidad estimada, no evidencia de delito.",
            ),
        ),
        Theory(
            heading="Email/teléfono/dirección compartidos, distancia y apellidos",
            sub="S13-T2-A",
            paragraphs=[
                "Señales: mismo email/teléfono/dirección normalizados, distancia geo bajo umbral, solapamiento de tokens de apellido.",
                "Agrégalas en `relationship_signal_score` con pesos documentados. **No es veredicto de parentesco**.",
                "Cada señal debe poder listarse en la explicación de la ficha.",
            ],
            code="""def shared_contact(a, b, field):
    return a.get(field) and a.get(field) == b.get(field)

def surname_overlap(a, b):
    sa = set(a.casefold().split())
    sb = set(b.casefold().split())
    return len(sa & sb) / max(1, len(sa | sb))

a = {"phone": "999111222", "name": "Ana Quispe Rojas", "km": 1.2}
b = {"phone": "999111222", "name": "Luis Quispe Díaz", "km": 1.2}
signals = {
    "shared_phone": shared_contact(a, b, "phone"),
    "geo_close": a["km"] < 2.0,
    "surname_jaccard": round(surname_overlap(a["name"], b["name"]), 3),
}
score = 0.5 * signals["shared_phone"] + 0.3 * signals["geo_close"] + 0.2 * signals["surname_jaccard"]
print(signals)
print("relationship_signal_score", round(score, 3))
print("kinship_verdict", None)""",
            code_title="rel_signals.py",
            callout=(
                "danger",
                "Señal ≠ parentesco",
                "Prohibido setear is_family automáticamente en N1.",
            ),
        ),
        Theory(
            heading="Transacciones directas y contrapartes comunes",
            sub="S13-T2-B",
            paragraphs=[
                "Txs directas A↔B y contrapartes comunes (A y C pagan a D) son **evidencia de relación operativa**, no de colusión.",
                "Modela un graphlet simple y emite objetos `RelationshipEvidence` con tipo y traza.",
                "Disclaimer obligatorio: common counterparty ≠ collusion claim.",
            ],
            code="""txs = [
    ("A", "B", 10),
    ("B", "A", 5),
    ("A", "D", 3),
    ("C", "D", 4),
]

def direct_between(x, y):
    return [t for t in txs if {t[0], t[1]} == {x, y}]

def counterparties(entity):
    s = set()
    for a, b, _ in txs:
        if a == entity:
            s.add(b)
        if b == entity:
            s.add(a)
    return s

common = counterparties("A") & counterparties("C")
evidence = [
    {"type": "direct_tx", "pair": ("A", "B"), "n": len(direct_between("A", "B"))},
    {"type": "common_counterparty", "entities": ("A", "C"), "shared": sorted(common)},
]
print(evidence)
print("collusion_claim", False)""",
            code_title="tx_graphlet.py",
            callout=(
                "tip",
                "Evidencia, no acusación",
                "La UI y el runbook deben repetir: sin claim de colusión automática.",
            ),
        ),
        Theory(
            heading="Score de evidencia, incertidumbre y explicación",
            sub="S13-T3-A",
            paragraphs=[
                "Agrega ER + señales de relación con pesos y produce `evidence_score`, banda de **incertidumbre** (low/med/high) y **bullets** legibles.",
                "Campos de auditoría: inputs usados, missing fields, versión de reglas.",
                "Señales conflictivas → explicación honesta, no score maquillado.",
            ],
            code="""def uncertainty(missing_fields, conflict):
    if conflict or len(missing_fields) >= 2:
        return "high"
    if missing_fields:
        return "med"
    return "low"

def explain(er, rel, missing):
    bullets = [
        f"ER score={er:.2f}",
        f"relationship_signal_score={rel:.2f}",
        f"missing={missing or 'none'}",
    ]
    evidence_score = round(0.6 * er + 0.4 * rel, 3)
    return {
        "evidence_score": evidence_score,
        "uncertainty": uncertainty(missing, conflict=(abs(er - rel) > 0.5)),
        "explanation": bullets,
        "audit": {"rules_version": "n1-er-1.0"},
    }

print(explain(0.9, 0.4, ["phone"]))""",
            code_title="evidence_card.py",
            callout=(
                "tip",
                "Explicación primero",
                "Si no puedes listar 3 bullets honestos, no publiques el score.",
            ),
        ),
        Theory(
            heading="Umbral de revisión, abstención y no inferencia automática",
            sub="S13-T3-B",
            paragraphs=[
                "Umbrales: accept_pair / needs_review / abstain según score e incertidumbre. **Nunca** `auto_fraud=true` ni `is_family=true`.",
                "Human-in-the-loop: la acción operativa es de **datos** (revisar/aceptar/rechazar par), no veredicto legal.",
                "Auditoría: elimina cualquier path que setee parentesco/fraude automático.",
            ],
            code="""def decide_ops_status(score, uncertainty):
    if uncertainty == "high" or 0.4 <= score <= 0.7:
        return "needs_review"
    if score < 0.4:
        return "abstain"
    return "accept_pair"

for s, u in [(0.9, "low"), (0.55, "med"), (0.2, "low"), (0.85, "high")]:
    print(s, u, decide_ops_status(s, u), "auto_fraud", False)""",
            code_title="thresholds.py",
            callout=(
                "danger",
                "Política N1",
                "Prohibido inferir parentesco o fraude en automático. Solo estados operativos de par.",
            ),
        ),
        Theory(
            heading="Dashboard/mapa pseudonimizado y ficha de caso",
            sub="S13-T4-A",
            paragraphs=[
                "Scaffold estático (HTML/template o dicts listos para UI): puntos de mapa con coords sintéticas y tooltips de geoseñal trazable.",
                "**Pseudonimiza** nombres en vista (`A*** Q***`). Ficha muestra ER score **y** relationship score por separado.",
                "No es un design system completo (eso es tramo producto/UI posterior).",
            ],
            code="""def pseudonymize(name: str) -> str:
    parts = name.split()
    return " ".join(p[0] + "***" for p in parts if p)

cases = [
    {
        "case_id": "CASE-1",
        "display_name": pseudonymize("Ana Quispe"),
        "entity_resolution_score": 0.92,
        "relationship_signal_score": 0.41,
        "lat": -12.0464,
        "lon": -77.0428,
        "geo_tooltip": "geo_distance_km=1.2; source=mock",
    },
    {
        "case_id": "CASE-2",
        "display_name": pseudonymize("Luis Huamán"),
        "entity_resolution_score": 0.55,
        "relationship_signal_score": 0.60,
        "lat": -16.4090,
        "lon": -71.5375,
        "geo_tooltip": "shared_phone; source=synthetic",
    },
]
for c in cases:
    print(c["case_id"], c["display_name"], "ER", c["entity_resolution_score"], "REL", c["relationship_signal_score"])""",
            code_title="dashboard_scaffold.py",
            callout=(
                "tip",
                "UI mínima viable N1",
                "Tres casos sintéticos + mapa de puntos + ficha bastan para el gate de producto.",
            ),
        ),
        Theory(
            heading="Privacidad, acceso, pruebas, demo y runbook",
            sub="S13-T4-B",
            paragraphs=[
                "**Privacy sheet**: datos sintéticos, retención local, sin egress de PII bancaria, roles de acceso (viewer/reviewer).",
                "**Tests green** de ER, señales y umbrales. **Demo de un comando**. **Runbook** incluye incidente de PII en log.",
                "Artefactos **CF-1** + notas de **regresión level-1 (S01–S13)** cierran el nivel.",
            ],
            code="""privacy = {
    "data_class": "synthetic_only",
    "pii_real": False,
    "egress_public_geocoder": "city_address_only",
    "roles": ["viewer", "reviewer"],
}
runbook_steps = [
    "setup venv",
    "load synthetic fixtures",
    "run ER + signals",
    "open dashboard",
    "process review queue",
]
incident = {
    "trigger": "token_or_name_in_log",
    "action": ["rotate_secret", "redact_logs", "postmortem"],
}
print("privacy", privacy)
print("demo_cmd", "python -m demo_n1_dashboard")
print("runbook", runbook_steps)
print("incident", incident)
print("level1_regression", "S01-S13 checklist required")""",
            code_title="ops_cf1.py",
            callout=(
                "info",
                "Cierre N1",
                "CP-N1-C + regresión level-1 + CF-1. Esta lane no marca section_passed ni actualiza ledger.",
            ),
        ),
    ]

    demos = [
        Demo(
            "S13-T1-A-DEMO",
            "S13-T1-A",
            "Emparejar 2 registros sintéticos por documento normalizado + bloque región.",
            """import re

def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())

def block_key(r):
    ap = r["name"].casefold().strip().split()[-1]
    return f"{ap}|{r['region'].casefold()}"

r1 = {"name": "Ana Quispe", "document_id": "D-7788", "region": "Lima"}
r2 = {"name": "ANA QUISPE", "document_id": "d7788", "region": "Lima"}
match = norm_doc(r1["document_id"]) == norm_doc(r2["document_id"]) and block_key(r1) == block_key(r2)
print("block", block_key(r1))
print("match", match)
print("entity_resolution_score", 1.0 if match else 0.0)""",
            "Reglas deterministas transparentes antes de cualquier modelo probabilístico.",
            title="er_pair_demo.py",
        ),
        Demo(
            "S13-T1-B-DEMO",
            "S13-T1-B",
            "Evaluar 20 pares etiquetados sintéticos; listar 3 para revisión humana por score en duda.",
            """import random
random.seed(13)
# synthetic labels and scores
pairs = []
for i in range(20):
    y = 1 if i % 3 == 0 else 0
    score = 0.85 if y == 1 else 0.2
    if i in (4, 9, 15):
        score = 0.55  # gray band
    pairs.append({"id": f"P{i}", "y": y, "score": score, "pred": int(score >= 0.7)})
tp = sum(1 for p in pairs if p["y"] == 1 and p["pred"] == 1)
fp = sum(1 for p in pairs if p["y"] == 0 and p["pred"] == 1)
fn = sum(1 for p in pairs if p["y"] == 1 and p["pred"] == 0)
review = [p["id"] for p in pairs if 0.4 <= p["score"] <= 0.7][:3]
print("tp", tp, "fp", fp, "fn", fn)
print("precision", round(tp / max(1, tp + fp), 3))
print("recall", round(tp / max(1, tp + fn), 3))
print("clerical_queue", review)""",
            "Métricas + cola clerical cierran el loop de calidad de ER.",
            title="eval_clerical_demo.py",
        ),
        Demo(
            "S13-T2-A-DEMO",
            "S13-T2-A",
            "Dos entidades: shared phone + 1.2 km → señales con explicación.",
            """a = {"phone": "900111222", "surname": "quispe", "km": 1.2}
b = {"phone": "900111222", "surname": "quispe", "km": 1.2}
signals = []
if a["phone"] == b["phone"]:
    signals.append("shared_phone")
if a["km"] <= 2.0:
    signals.append("geo_distance_km=1.2")
if a["surname"] == b["surname"]:
    signals.append("surname_match")
rel = min(1.0, 0.4 * len(signals))
print("signals", signals)
print("relationship_signal_score", rel)
print("explanation", signals)
print("kinship", None)""",
            "Explicación lista para la ficha sin veredicto de parentesco.",
            title="shared_geo_demo.py",
        ),
        Demo(
            "S13-T2-B-DEMO",
            "S13-T2-B",
            "Grafo simple A↔B y contraparte común D → lista RelationshipEvidence.",
            """txs = [("A", "B", 1), ("B", "A", 1), ("A", "D", 2), ("C", "D", 2)]
evidence = []
if any({x, y} == {"A", "B"} for x, y, _ in txs):
    evidence.append({"type": "direct_tx", "nodes": ["A", "B"]})
cp_a = {y if x == "A" else x for x, y, _ in txs if "A" in (x, y)}
cp_c = {y if x == "C" else x for x, y, _ in txs if "C" in (x, y)}
shared = sorted(cp_a & cp_c)
evidence.append({"type": "common_counterparty", "nodes": ["A", "C"], "via": shared})
print(evidence)
print("collusion_claim", False)""",
            "Graphlet mínimo con disclaimers operativos.",
            title="graphlet_demo.py",
        ),
        Demo(
            "S13-T3-A-DEMO",
            "S13-T3-A",
            "Ficha con score, uncertainty low/med/high y 3 bullets de por qué.",
            """er, rel = 0.88, 0.45
missing = ["email"]
conflict = abs(er - rel) > 0.5
unc = "high" if conflict or len(missing) >= 2 else ("med" if missing else "low")
card = {
    "evidence_score": round(0.6 * er + 0.4 * rel, 3),
    "uncertainty": unc,
    "bullets": [
        f"entity_resolution_score={er}",
        f"relationship_signal_score={rel}",
        f"missing_fields={missing}",
    ],
}
print(card)""",
            "La ficha es el artefacto humano del dashboard.",
            title="case_card_demo.py",
        ),
        Demo(
            "S13-T3-B-DEMO",
            "S13-T3-B",
            "Scores en zona gris → status=needs_review; nunca auto_fraud=true.",
            """def decide(score, unc):
    if unc == "high" or 0.4 <= score <= 0.7:
        return "needs_review"
    if score < 0.4:
        return "abstain"
    return "accept_pair"

samples = [(0.55, "med"), (0.9, "low"), (0.15, "low")]
for sc, u in samples:
    print({"score": sc, "uncertainty": u, "status": decide(sc, u), "auto_fraud": False, "is_family": False})""",
            "Política de abstención y revisión protege al estudiante y al usuario final.",
            title="review_threshold_demo.py",
        ),
        Demo(
            "S13-T4-A-DEMO",
            "S13-T4-A",
            "Scaffold de 3 casos sintéticos pseudonimizados listos para dashboard/mapa.",
            """def pseudo(n):
    return " ".join(p[0] + "***" for p in n.split())

cases = [
    ("CASE-1", "Ana Quispe", 0.91, 0.4, -12.0464, -77.0428),
    ("CASE-2", "Luis Huamán", 0.52, 0.66, -16.4090, -71.5375),
    ("CASE-3", "María Rojas", 0.77, 0.22, -12.05, -77.12),
]
for cid, name, er, rel, lat, lon in cases:
    print({
        "case_id": cid,
        "display": pseudo(name),
        "entity_resolution_score": er,
        "relationship_signal_score": rel,
        "map": (lat, lon),
    })""",
            "Producto mínimo: ficha + mapa con scores separados.",
            title="three_cases_demo.py",
        ),
        Demo(
            "S13-T4-B-DEMO",
            "S13-T4-B",
            "Runbook: setup → load synthetic → run ER → open dashboard → review queue (+ regresión N1).",
            """steps = [
    "1. setup: python -m venv .venv && pip install -r requirements.txt",
    "2. load synthetic fixtures (no real PII)",
    "3. run ER + relationship signals",
    "4. open dashboard scaffold",
    "5. process clerical review queue",
    "6. level-1 regression notes: re-run critical checks S01-S13",
    "7. CF-1: privacy sheet + demo script + access notes",
]
for s in steps:
    print(s)
print("demo_cmd: python -m demo_n1_dashboard --synthetic")
print("section_passed_written_by_this_lane", False)""",
            "Operación N1 completa sin marcar passed en checkpoint/ledger.",
            title="runbook_demo.py",
        ),
    ]

    exercises = [
        Ex(
            "S13-T1-A-E1", "S13-T1-A", "guided",
            "E1 (guiado) — `norm_name` y `norm_doc`: casefold, colapsar espacios; doc solo [a-z0-9]. Prueba ' Ana  QUISPE ' y 'D-12.34'.",
            "re.sub para espacios y no alfanuméricos",
            "casefold no solo lower",
            """import re
def norm_name(n):
    # TODO
    ...
def norm_doc(d):
    # TODO
    ...
print(norm_name(" Ana  QUISPE "))
print(norm_doc("D-12.34"))""",
            """import re
def norm_name(n):
    return re.sub(r"\\s+", " ", n.casefold().strip())
def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())
print(norm_name(" Ana  QUISPE "))
print(norm_doc("D-12.34"))""",
            edge=["guiones en doc"],
            tests="ana quispe / d1234",
            feedback="Normalización estable es el 80% del ER por reglas.",
            title="normalize_ids.py",
        ),
        Ex(
            "S13-T1-A-E2", "S13-T1-A", "independent",
            "E2 (independiente) — `blocking_key(rec)` = primer_apellido|region en casefold. Nombre 'Luis Huamán Soto', region 'Cusco'.",
            "Último token no; usa el segundo token como apellido paterno o el último: documenta. Aquí: split()[1] si hay >=2 else split()[0].",
            "Formato f'{ap}|{region}'",
            """def blocking_key(rec):
    # TODO apellido paterno = segundo token si existe
    ...
print(blocking_key({"name": "Luis Huamán Soto", "region": "Cusco"}))""",
            """def blocking_key(rec):
    parts = rec["name"].casefold().split()
    ap = parts[1] if len(parts) >= 2 else parts[0]
    return f"{ap}|{rec['region'].casefold()}"
print(blocking_key({"name": "Luis Huamán Soto", "region": "Cusco"}))""",
            edge=["un solo token de nombre"],
            tests="huamán|cusco",
            feedback="Blocking reduce el espacio de pares antes de reglas finas.",
            title="blocking_key.py",
        ),
        Ex(
            "S13-T1-A-E3", "S13-T1-A", "transfer",
            "E3 (transferencia) — `er_score(a,b)`: 1.0 si norm_doc igual y mismo blocking_key; 0.5 si solo doc; 0.0 si no. Documenta con print de los tres casos sintéticos.",
            "Combina igualdad de doc y block",
            "Scores solo 1.0/0.5/0.0",
            """import re
def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())
def bkey(r):
    ap = r["name"].casefold().split()[-1]
    return f"{ap}|{r['region'].casefold()}"
def er_score(a, b):
    # TODO
    ...
A = {"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}
B = {"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}
C = {"name": "Ana Other", "document_id": "X1", "region": "Cusco"}
D = {"name": "Ana Quispe", "document_id": "Z9", "region": "Lima"}
print(er_score(A, B), er_score(A, C), er_score(A, D))""",
            """import re
def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())
def bkey(r):
    ap = r["name"].casefold().split()[-1]
    return f"{ap}|{r['region'].casefold()}"
def er_score(a, b):
    same_doc = norm_doc(a["document_id"]) == norm_doc(b["document_id"])
    same_block = bkey(a) == bkey(b)
    if same_doc and same_block:
        return 1.0
    if same_doc:
        return 0.5
    return 0.0
A = {"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}
B = {"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}
C = {"name": "Ana Other", "document_id": "X1", "region": "Cusco"}
D = {"name": "Ana Quispe", "document_id": "Z9", "region": "Lima"}
print(er_score(A, B), er_score(A, C), er_score(A, D))""",
            edge=["doc match sin block → 0.5"],
            tests="1.0 0.5 0.0",
            feedback="Score ER documentado y auditable.",
            title="er_score_rules.py",
        ),
        Ex(
            "S13-T1-B-E1", "S13-T1-B", "guided",
            "E1 (guiado) — De tp,fp,fn calcula precision y recall; imprime redondeado a 3 decimales. tp=8,fp=2,fn=2.",
            "precision = tp/(tp+fp)",
            "recall = tp/(tp+fn)",
            """tp, fp, fn = 8, 2, 2
# TODO
print("precision", round(tp / (tp + fp), 3))
print("recall", round(tp / (tp + fn), 3))""",
            """tp, fp, fn = 8, 2, 2
print("precision", round(tp / (tp + fp), 3))
print("recall", round(tp / (tp + fn), 3))""",
            edge=["división por cero: no aplica en este fixture"],
            tests="0.8 y 0.8",
            feedback="Métricas simples bastan para gate N1.",
            title="precision_recall.py",
        ),
        Ex(
            "S13-T1-B-E2", "S13-T1-B", "independent",
            "E2 (independiente) — `clerical_queue(pairs, low=0.4, high=0.7)` devuelve ids con score en [low, high] inclusive.",
            "list comprehension con filtro de banda",
            "Orden estable por id",
            """pairs = [
    {"id": "P1", "score": 0.2},
    {"id": "P2", "score": 0.55},
    {"id": "P3", "score": 0.7},
    {"id": "P4", "score": 0.9},
]
def clerical_queue(pairs, low=0.4, high=0.7):
    # TODO
    ...
print(clerical_queue(pairs))""",
            """pairs = [
    {"id": "P1", "score": 0.2},
    {"id": "P2", "score": 0.55},
    {"id": "P3", "score": 0.7},
    {"id": "P4", "score": 0.9},
]
def clerical_queue(pairs, low=0.4, high=0.7):
    return [p["id"] for p in pairs if low <= p["score"] <= high]
print(clerical_queue(pairs))""",
            edge=["inclusive bounds"],
            tests="['P2','P3']",
            feedback="La cola clerical es el human-in-the-loop de ER.",
            title="clerical_queue.py",
        ),
        Ex(
            "S13-T1-B-E3", "S13-T1-B", "transfer",
            "E3 (transferencia) — Redacta (print) 2 líneas: por qué un FP de ER no implica fraude; y qué acción operativa tomar (review).",
            "Mensajes fijos cortos",
            "Incluye la palabra review",
            """print("fp_not_fraud:", "False positive de matching no es evidencia de delito")
print("ops_action:", "needs_review")""",
            """print("fp_not_fraud:", "False positive de matching no es evidencia de delito")
print("ops_action:", "needs_review")""",
            edge=["límites éticos"],
            tests="texto + needs_review",
            feedback="Límites explícitos son parte del learning outcome.",
            title="fp_limits.py",
        ),
        Ex(
            "S13-T2-A-E1", "S13-T2-A", "guided",
            "E1 (guiado) — `shared_email(a,b)` True si emails casefold iguales y no vacíos.",
            "a and b and a.casefold()==b.casefold()",
            "'' no cuenta como shared",
            """def shared_email(a, b):
    # TODO
    ...
print(shared_email("Ana@Example.com", "ana@example.com"))
print(shared_email("", ""))
print(shared_email("a@x.com", "b@x.com"))""",
            """def shared_email(a, b):
    if not a or not b:
        return False
    return a.casefold() == b.casefold()
print(shared_email("Ana@Example.com", "ana@example.com"))
print(shared_email("", ""))
print(shared_email("a@x.com", "b@x.com"))""",
            edge=["vacío False"],
            tests="True False False",
            feedback="Shared contact es señal fuerte pero no identidad legal.",
            title="shared_email.py",
        ),
        Ex(
            "S13-T2-A-E2", "S13-T2-A", "independent",
            "E2 (independiente) — `rel_score(km, surname_jaccard)` = 0.6*(1 if km<2 else 0)+0.4*jaccard; round 3.",
            "Combina distancia y apellido",
            "km=1.2, j=0.5 → 0.8",
            """def rel_score(km, surname_jaccard):
    # TODO
    ...
print(rel_score(1.2, 0.5))
print(rel_score(5.0, 0.5))""",
            """def rel_score(km, surname_jaccard):
    geo = 1.0 if km < 2 else 0.0
    return round(0.6 * geo + 0.4 * surname_jaccard, 3)
print(rel_score(1.2, 0.5))
print(rel_score(5.0, 0.5))""",
            edge=["km lejos anula geo"],
            tests="0.8 y 0.2",
            feedback="Pesos documentados permiten auditar el score de relación.",
            title="combine_signals.py",
        ),
        Ex(
            "S13-T2-A-E3", "S13-T2-A", "transfer",
            "E3 (transferencia) — Imprime disclaimer exacto: 'relationship_signal_score no implica parentesco ni colusión'.",
            "Un solo print",
            "Texto exacto para tests de portfolio",
            """print("relationship_signal_score no implica parentesco ni colusión")""",
            """print("relationship_signal_score no implica parentesco ni colusión")""",
            edge=["disclaimer UI"],
            tests="frase exacta",
            feedback="Disclaimer reutilizable en ficha y README.",
            title="disclaimer.py",
        ),
        Ex(
            "S13-T2-B-E1", "S13-T2-B", "guided",
            "E1 (guiado) — `direct_txs(txs, a, b)` lista montos de transferencias directas entre a y b (cualquier dirección).",
            "set equality de endpoints",
            "Orden de aparición",
            """txs = [("A","B",10), ("C","D",1), ("B","A",5)]
def direct_txs(txs, a, b):
    # TODO
    ...
print(direct_txs(txs, "A", "B"))""",
            """txs = [("A","B",10), ("C","D",1), ("B","A",5)]
def direct_txs(txs, a, b):
    return [m for x, y, m in txs if {x, y} == {a, b}]
print(direct_txs(txs, "A", "B"))""",
            edge=["bidireccional"],
            tests="[10, 5]",
            feedback="Txs directas son RelationshipEvidence tipo direct_tx.",
            title="direct_txs.py",
        ),
        Ex(
            "S13-T2-B-E2", "S13-T2-B", "independent",
            "E2 (independiente) — `common_counterparties(txs, a, c)` devuelve sorted set de nodos que transan con ambos.",
            "Intersección de vecinos",
            "Excluye a y c de la salida si aparecen",
            """txs = [("A","D",1), ("C","D",1), ("A","E",1), ("C","F",1)]
def neighbors(txs, node):
    s = set()
    for x, y, _ in txs:
        if x == node:
            s.add(y)
        if y == node:
            s.add(x)
    return s
def common_counterparties(txs, a, c):
    # TODO
    ...
print(common_counterparties(txs, "A", "C"))""",
            """txs = [("A","D",1), ("C","D",1), ("A","E",1), ("C","F",1)]
def neighbors(txs, node):
    s = set()
    for x, y, _ in txs:
        if x == node:
            s.add(y)
        if y == node:
            s.add(x)
    return s
def common_counterparties(txs, a, c):
    return sorted(neighbors(txs, a) & neighbors(txs, c))
print(common_counterparties(txs, "A", "C"))""",
            edge=["solo D común"],
            tests="['D']",
            feedback="Top-k se obtiene ordenando por conteo; aquí k=all del set.",
            title="common_cp.py",
        ),
        Ex(
            "S13-T2-B-E3", "S13-T2-B", "transfer",
            "E3 (transferencia) — Lista 2 cosas que NO debes inferir de contraparte común (print líneas no_collusion y no_kinship).",
            "Mensajes explícitos",
            "Incluye collusion y kinship en el texto",
            """print("no_collusion: contraparte común no prueba acuerdo ilícito")
print("no_kinship: contraparte común no prueba parentesco")""",
            """print("no_collusion: contraparte común no prueba acuerdo ilícito")
print("no_kinship: contraparte común no prueba parentesco")""",
            edge=["límites de inferencia"],
            tests="dos disclaimers",
            feedback="Límites de inferencia son evaluables en rúbrica ética.",
            title="no_infer.py",
        ),
        Ex(
            "S13-T3-A-E1", "S13-T3-A", "guided",
            "E1 (guiado) — `explanation_bullets(er, rel, missing)` devuelve lista de 3 strings formateados.",
            "f-strings con los tres inputs",
            "missing puede ser lista",
            """def explanation_bullets(er, rel, missing):
    # TODO
    ...
print(explanation_bullets(0.9, 0.4, ["phone"]))""",
            """def explanation_bullets(er, rel, missing):
    return [
        f"entity_resolution_score={er}",
        f"relationship_signal_score={rel}",
        f"missing={missing}",
    ]
print(explanation_bullets(0.9, 0.4, ["phone"]))""",
            edge=["3 bullets"],
            tests="lista len 3",
            feedback="Plantilla reutilizable en la ficha de caso.",
            title="explain_template.py",
        ),
        Ex(
            "S13-T3-A-E2", "S13-T3-A", "independent",
            "E2 (independiente) — `uncertainty_band(missing, conflict)` → high si conflict o len(missing)>=2; med si missing; low si no.",
            "Orden de ifs: conflict primero",
            "missing=[] conflict=False → low",
            """def uncertainty_band(missing, conflict):
    # TODO
    ...
print(uncertainty_band([], False))
print(uncertainty_band(["email"], False))
print(uncertainty_band(["email", "phone"], False))
print(uncertainty_band([], True))""",
            """def uncertainty_band(missing, conflict):
    if conflict or len(missing) >= 2:
        return "high"
    if missing:
        return "med"
    return "low"
print(uncertainty_band([], False))
print(uncertainty_band(["email"], False))
print(uncertainty_band(["email", "phone"], False))
print(uncertainty_band([], True))""",
            edge=["conflict fuerza high"],
            tests="low med high high",
            feedback="Incertidumbre honestifica el evidence_score.",
            title="uncertainty.py",
        ),
        Ex(
            "S13-T3-A-E3", "S13-T3-A", "transfer",
            "E3 (transferencia) — Caso conflictivo er=0.9 rel=0.1: imprime evidence_score ponderado 0.6/0.4 y uncertainty high + bullet 'señales conflictivas'.",
            "abs(er-rel)>0.5 → conflict",
            "No maquilles el score",
            """er, rel = 0.9, 0.1
score = round(0.6 * er + 0.4 * rel, 3)
conflict = abs(er - rel) > 0.5
print("evidence_score", score)
print("uncertainty", "high" if conflict else "low")
print("note", "señales conflictivas")""",
            """er, rel = 0.9, 0.1
score = round(0.6 * er + 0.4 * rel, 3)
conflict = abs(er - rel) > 0.5
print("evidence_score", score)
print("uncertainty", "high" if conflict else "low")
print("note", "señales conflictivas")""",
            edge=["conflicto honesto"],
            tests="score 0.58 high",
            feedback="Explicación honesta > score cosmético.",
            title="conflict_case.py",
        ),
        Ex(
            "S13-T3-B-E1", "S13-T3-B", "guided",
            "E1 (guiado) — Config dict thresholds: accept_min=0.8, review_low=0.4, review_high=0.7. Imprime sorted items.",
            "Tres claves numéricas",
            "Usarás el dict en E2",
            """thresholds = {
    "accept_min": 0.8,
    "review_low": 0.4,
    "review_high": 0.7,
}
print(sorted(thresholds.items()))""",
            """thresholds = {
    "accept_min": 0.8,
    "review_low": 0.4,
    "review_high": 0.7,
}
print(sorted(thresholds.items()))""",
            edge=["config externalizable"],
            tests="tres umbrales",
            feedback="Umbrales fuera de código mágico facilitan auditoría.",
            title="thresholds_cfg.py",
        ),
        Ex(
            "S13-T3-B-E2", "S13-T3-B", "independent",
            "E2 (independiente) — `decide_ops_status(score, unc, th)`: needs_review si unc==high o score en [review_low, review_high]; abstain si score < review_low; accept_pair si score >= accept_min; else needs_review. Sin fraud labels.",
            "Implementa la matriz de decisión",
            "Nunca devuelvas fraud/family",
            """th = {"accept_min": 0.8, "review_low": 0.4, "review_high": 0.7}
def decide_ops_status(score, unc, th):
    # TODO
    ...
for s, u in [(0.9, "low"), (0.55, "med"), (0.2, "low"), (0.85, "high")]:
    print(s, u, decide_ops_status(s, u, th))""",
            """th = {"accept_min": 0.8, "review_low": 0.4, "review_high": 0.7}
def decide_ops_status(score, unc, th):
    if unc == "high" or th["review_low"] <= score <= th["review_high"]:
        return "needs_review"
    if score < th["review_low"]:
        return "abstain"
    if score >= th["accept_min"]:
        return "accept_pair"
    return "needs_review"
for s, u in [(0.9, "low"), (0.55, "med"), (0.2, "low"), (0.85, "high")]:
    print(s, u, decide_ops_status(s, u, th))""",
            edge=["high unc → review"],
            tests="accept/review/abstain/review",
            feedback="Estados operativos de par, no veredictos legales.",
            title="decide_ops.py",
        ),
        Ex(
            "S13-T3-B-E3", "S13-T3-B", "transfer",
            "E3 (transferencia) — Auditoría: dado un dict de campos de salida, elimina claves is_family y auto_fraud si existen; imprime sorted keys restantes.",
            "pop o dict comprehension",
            "No dejes rastros de esas claves",
            """out = {"status": "needs_review", "is_family": True, "auto_fraud": True, "score": 0.5}
# TODO strip forbidden
forbidden = {"is_family", "auto_fraud"}
clean = {k: v for k, v in out.items() if k not in forbidden}
print(sorted(clean.keys()))""",
            """out = {"status": "needs_review", "is_family": True, "auto_fraud": True, "score": 0.5}
forbidden = {"is_family", "auto_fraud"}
clean = {k: v for k, v in out.items() if k not in forbidden}
print(sorted(clean.keys()))""",
            edge=["strip policy fields"],
            tests="['score','status']",
            feedback="Auditoría de paths prohibidos es requisito de política N1.",
            title="audit_strip.py",
        ),
        Ex(
            "S13-T4-A-E1", "S13-T4-A", "guided",
            "E1 (guiado) — `pseudonymize('Ana Quispe Rojas')` → 'A*** Q*** R***'.",
            "primer char + *** por token",
            "split por espacios",
            """def pseudonymize(name):
    # TODO
    ...
print(pseudonymize("Ana Quispe Rojas"))""",
            """def pseudonymize(name):
    return " ".join(p[0] + "***" for p in name.split() if p)
print(pseudonymize("Ana Quispe Rojas"))""",
            edge=["multi token"],
            tests="A*** Q*** R***",
            feedback="Vista pseudonimizada reduce exposición en demos.",
            title="pseudo_names.py",
        ),
        Ex(
            "S13-T4-A-E2", "S13-T4-A", "independent",
            "E2 (independiente) — `case_sheet(er, rel)` dict con ambos scores y assert er key != rel key; imprime sheet.",
            "Claves entity_resolution_score y relationship_signal_score",
            "No fusionar en un solo score sin etiqueta",
            """def case_sheet(er, rel):
    # TODO
    ...
print(case_sheet(0.9, 0.4))""",
            """def case_sheet(er, rel):
    return {
        "entity_resolution_score": er,
        "relationship_signal_score": rel,
    }
print(case_sheet(0.9, 0.4))""",
            edge=["scores separados"],
            tests="dos claves distintas",
            feedback="La ficha educa al revisor sobre dos constructos distintos.",
            title="case_sheet.py",
        ),
        Ex(
            "S13-T4-A-E3", "S13-T4-A", "transfer",
            "E3 (transferencia) — `map_tooltip(lat, lon, km, source)` string con coords y geoseñal trazable.",
            "Incluye source=",
            "Formato legible una línea",
            """def map_tooltip(lat, lon, km, source):
    # TODO
    ...
print(map_tooltip(-12.04, -77.04, 1.2, "mock"))""",
            """def map_tooltip(lat, lon, km, source):
    return f"lat={lat},lon={lon},geo_distance_km={km},source={source}"
print(map_tooltip(-12.04, -77.04, 1.2, "mock"))""",
            edge=["trazabilidad"],
            tests="source=mock en tooltip",
            feedback="Tooltip trazable conecta mapa con provenance S12.",
            title="map_tooltip.py",
        ),
        Ex(
            "S13-T4-B-E1", "S13-T4-B", "guided",
            "E1 (guiado) — Completa privacy sheet dict: data_class=synthetic_only, pii_real=False, roles=['viewer','reviewer']. Imprime json-like sorted keys.",
            "Tres campos mínimos CF-1",
            "pii_real debe ser False",
            """privacy = {
    "data_class": "synthetic_only",
    "pii_real": False,
    "roles": ["viewer", "reviewer"],
}
print(sorted(privacy.keys()))
print(privacy["pii_real"])""",
            """privacy = {
    "data_class": "synthetic_only",
    "pii_real": False,
    "roles": ["viewer", "reviewer"],
}
print(sorted(privacy.keys()))
print(privacy["pii_real"])""",
            edge=["CF-1 privacy"],
            tests="keys + False",
            feedback="Privacy sheet es artefacto CF-1 obligatorio.",
            title="privacy_sheet.py",
        ),
        Ex(
            "S13-T4-B-E2", "S13-T4-B", "independent",
            "E2 (independiente) — `demo_command()` devuelve 'python -m demo_n1_dashboard --synthetic'.",
            "String fijo documentado en runbook",
            "Un comando para reproducir",
            """def demo_command():
    # TODO
    ...
print(demo_command())""",
            """def demo_command():
    return "python -m demo_n1_dashboard --synthetic"
print(demo_command())""",
            edge=["reproducibilidad"],
            tests="comando único",
            feedback="Demo de un comando reduce fricción de revisión de nivel.",
            title="demo_cmd.py",
        ),
        Ex(
            "S13-T4-B-E3", "S13-T4-B", "transfer",
            "E3 (transferencia) — Runbook de incidente PII en log: lista de 3 acciones rotate_secret, redact_logs, postmortem. Imprime joined por '|'.",
            "Orden fijo de respuesta",
            "También menciona level-1 regression en un segundo print",
            """actions = ["rotate_secret", "redact_logs", "postmortem"]
print("|".join(actions))
print("level1_regression: re-check S01-S13 critical paths after incident")""",
            """actions = ["rotate_secret", "redact_logs", "postmortem"]
print("|".join(actions))
print("level1_regression: re-check S01-S13 critical paths after incident")""",
            edge=["incidente + regresión"],
            tests="3 acciones + nota regresión",
            feedback="Incidente y regresión level-1 forman parte del cierre N1.",
            title="incident_runbook.py",
        ),
    ]

    youdo = {
        "title": "Familiarity Evidence Dashboard — cierre CP-N1-C + regresión nivel 1 + CF-1",
        "context": (
            "Cierras el **Familiarity Evidence Dashboard (CP-N1-C)**: ER determinista por reglas, "
            "`entity_resolution_score` **separado** de `relationship_signal_score`, geoseñal trazable, "
            "fichas pseudonimizadas, umbrales de revisión/abstención **sin** parentesco/fraude automático. "
            "Incluye **notas de regresión de nivel 1 (S01–S13)**: re-ejecuta checks críticos de secciones "
            "previas (colecciones, texto, archivos, APIs/SQL/geo) sobre fixtures sintéticos y registra "
            "resultado en el runbook. Entrega artefactos **CF-1** (privacy sheet, acceso, tests, demo "
            "de un comando). Esta lane **no** marca section_passed ni edita checkpoint/ledger."
        ),
        "objectives": [
            "Pipeline normalize → blocking → entity_resolution_score",
            "Precision/recall + cola clerical sobre pares sintéticos",
            "relationship_signal_score (shared contact, geo, apellidos, txs) separado del ER",
            "Ficha con uncertainty + explicación; decide_ops_status sin auto_fraud/is_family",
            "Dashboard scaffold 3 casos + mapa/tooltips",
            "Privacy sheet + demo cmd + runbook de incidente",
            "Level-1 regression notes: checklist S01–S13 en runbook de entrega",
        ],
        "requirements": [
            "Datos 100% sintéticos; vista pseudonimizada",
            "ER score y relationship score nunca colapsados en un solo campo sin etiquetar",
            "Prohibido is_family / auto_fraud en salidas",
            "Tests de reglas ER, señales y umbrales en verde",
            "Demo: python -m demo_n1_dashboard --synthetic",
            "Runbook con regresión level-1 (S01–S13) y respuesta a PII en log",
            "CF-1: privacy sheet + roles viewer/reviewer + notes de acceso",
        ],
        "starterCode": '''"""familiarity_dashboard.py — CP-N1-C close + CF-1 + level-1 regression notes
S13 V3. Datos sintéticos. Sin auto parentesco/fraude.
"""

from __future__ import annotations

import re
from typing import Any


def norm_doc(d: str) -> str:
    # TODO
    raise NotImplementedError


def blocking_key(rec: dict) -> str:
    # TODO
    raise NotImplementedError


def er_score(a: dict, b: dict) -> float:
    # TODO
    raise NotImplementedError


def relationship_signal_score(a: dict, b: dict) -> float:
    # TODO shared phone / geo / surname — no kinship
    raise NotImplementedError


def decide_ops_status(score: float, uncertainty: str) -> str:
    # TODO accept_pair | needs_review | abstain — never fraud/family
    raise NotImplementedError


def pseudonymize(name: str) -> str:
    # TODO
    raise NotImplementedError


def privacy_sheet() -> dict:
    return {
        "data_class": "synthetic_only",
        "pii_real": False,
        "roles": ["viewer", "reviewer"],
    }


def level1_regression_notes() -> list[str]:
    """Notas de regresión de nivel 1 (S01–S13). No marca passed."""
    return [
        "S06-S08: modelo en memoria + normalize + CSV/JSON quarantine",
        "S09-S11: calidad/validación según roadmap V3 del tramo",
        "S12: HTTP timeout/retry + SQL params + MockGeocoder egress policy",
        "S13: ER != relationship scores; review thresholds; no auto_fraud",
        "Registrar pass/fail de smoke checks en runbook; no editar checkpoint/ledger aquí",
    ]


def main() -> None:
    a = {"name": "Ana Quispe", "document_id": "D-1", "region": "Lima", "phone": "900", "km": 1.0}
    b = {"name": "ANA QUISPE", "document_id": "d1", "region": "Lima", "phone": "900", "km": 1.0}
    print("pseudo", pseudonymize(a["name"]))
    print("privacy", privacy_sheet())
    print("regression_notes", level1_regression_notes())


if __name__ == "__main__":
    main()
''',
        "portfolioNote": (
            "Portfolio N1: captura del dashboard con 3 casos, ficha con ER≠REL, privacy sheet, "
            "salida del demo command y sección **Level-1 regression** del runbook (S01–S13). "
            "No afirmes section_passed hasta el proceso de gate del curso."
        ),
        "rubric": [
            {"criterion": "ER determinista + métricas + cola clerical", "weight": "20%"},
            {"criterion": "Señales de relación separadas + disclaimers", "weight": "20%"},
            {"criterion": "Evidence score, uncertainty, umbrales sin auto inferencia", "weight": "20%"},
            {"criterion": "Dashboard pseudonimizado (ficha + mapa)", "weight": "15%"},
            {"criterion": "CF-1 privacy/demo/runbook + level-1 regression notes", "weight": "25%"},
        ],
    }

    selfcheck = [
        {
            "question": "entity_resolution_score y relationship_signal_score deben…",
            "options": [
                "Fusionarse siempre en un solo número sin etiqueta",
                "Mantenerse separados en la ficha de caso",
                "Reemplazarse por is_family",
                "Ocultarse al revisor",
            ],
            "correctIndex": 1,
            "explanation": "Son constructos distintos; la UI y el modelo los muestran aparte.",
        },
        {
            "question": "Un false positive de ER implica…",
            "options": [
                "Fraude confirmado",
                "Parentesco automático",
                "Error de matching; no es veredicto legal de fraude",
                "Borrar la cola clerical",
            ],
            "correctIndex": 2,
            "explanation": "FP es error de identidad estimada, no delito.",
        },
        {
            "question": "En zona gris de score el sistema debe…",
            "options": [
                "Marcar auto_fraud=true",
                "Encolar needs_review / abstenerse según política",
                "Setear is_family",
                "Publicar PII real en el mapa",
            ],
            "correctIndex": 1,
            "explanation": "Human-in-the-loop: revisión o abstención, nunca fraude auto.",
        },
        {
            "question": "CF-1 en S13 incluye…",
            "options": [
                "Solo un modelo de deep learning",
                "Privacy sheet, acceso, tests, demo y runbook",
                "Hardcodear tokens en el repo",
                "Marcar section_passed desde el author lane",
            ],
            "correctIndex": 1,
            "explanation": "Artefactos de operación y privacidad del cierre N1.",
        },
        {
            "question": "Level-1 regression notes en el You Do exigen…",
            "options": [
                "Ignorar S01–S12",
                "Re-chequear paths críticos S01–S13 en runbook (sin editar ledger aquí)",
                "Borrar el dashboard",
                "Enviar PII a geocoder público",
            ],
            "correctIndex": 1,
            "explanation": "La regresión de nivel se documenta en el runbook de entrega N1.",
        },
    ]

    resources = {
        "docs": [
            {
                "label": "re — Regular expression operations",
                "url": "https://docs.python.org/3/library/re.html",
                "note": "Normalización de docs/nombres",
            },
            {
                "label": "sqlite3 — SQLite databases",
                "url": "https://docs.python.org/3/library/sqlite3.html",
                "note": "Almacén local de evidencias si se integra con S12",
            },
            {
                "label": "json — JSON encoder and decoder",
                "url": "https://docs.python.org/3/library/json.html",
                "note": "Export determinista de fichas",
            },
        ],
        "books": [
            {
                "label": "Data Matching (Peter Christen) — conceptos",
                "note": "Blocking y evaluación; aplicar solo reglas deterministas en N1.",
            },
            {
                "label": "Practical Data Ethics (selecciones)",
                "note": "Límites de inferencia y revisión humana.",
            },
        ],
        "courses": [
            {
                "label": "Familiarity Evidence Dashboard — entrega del curso",
                "url": "https://example.com/course/cp-n1-c",
                "note": "Placeholder de portfolio; usar demo local sintético.",
            },
        ],
    }

    i_do = (
        "Ocho demos del cierre N1: ER por reglas, evaluación+clerical, señales de relación, "
        "graphlet de txs, ficha con uncertainty, umbrales sin auto_fraud, scaffold de 3 casos y runbook "
        "con regresión level-1."
    )
    we_do = (
        "24 ejercicios E1/E2/E3 en identidad, relación, decisión y producto/ops. "
        "Dos pistas cada uno. Datos sintéticos; español peruano."
    )

    ts, log = build_section(
        "section13", meta, theories, demos, exercises, i_do, we_do, youdo, selfcheck, resources
    )
    meta_updates = {
        "id": "rpa-automation",
        "index": 13,
        "title": meta["title"],
        "shortTitle": meta["shortTitle"],
        "tagline": meta["tagline"],
        "estimatedHours": 14,
        "learningOutcomes": 8,
        "youDo": youdo["title"],
        "icon": "Bot",
        "legacy_note": "RPA/Playwright/Ollama demoted; target is Familiarity Evidence Dashboard + N1 exit",
        "capstone": "CP-N1-C close + CF-1 + Level-1 regression",
    }
    return ts, log, slugs, meta_updates, youdo["title"]


def main() -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    print("Building S12…")
    s12_ts, s12_log, s12_slugs, s12_meta, s12_youdo = build_s12()
    print("Building S13…")
    s13_ts, s13_log, s13_slugs, s13_meta, s13_youdo = build_s13()

    path12 = SECTIONS / "s12-performance.ts"
    path13 = SECTIONS / "s13-rpa-automation.ts"
    path12.write_text(s12_ts, encoding="utf-8")
    path13.write_text(s13_ts, encoding="utf-8")
    print("Wrote", path12)
    print("Wrote", path13)

    p12 = progress_payload("S12", "performance", "LANE-S12-S13-P4", s12_meta, s12_slugs, s12_log, s12_youdo)
    p13 = progress_payload("S13", "rpa-automation", "LANE-S12-S13-P4", s13_meta, s13_slugs, s13_log, s13_youdo)
    # fix scope paths
    p12["preamble"]["scope_in"] = [
        "src/lib/course/sections/s12-performance.ts",
        "course-state/s12_phase4_progress.json",
        "course-state/lanes/LANE-S12-S13-P4.status.json",
    ]
    p13["preamble"]["scope_in"] = [
        "src/lib/course/sections/s13-rpa-automation.ts",
        "course-state/s13_phase4_progress.json",
        "course-state/lanes/LANE-S12-S13-P4.status.json",
    ]
    p13["level1_regression"] = {
        "required_in_youDo": True,
        "scope": "S01-S13 critical path smoke notes in runbook",
        "writes_checkpoint": False,
    }
    p13["capstone"] = {
        "ids": "CP-N1-C (cierre) + CF-1 + Level-1 regression",
        "dashboard": "Familiarity Evidence Dashboard",
    }

    (STATE / "s12_phase4_progress.json").write_text(
        json.dumps(p12, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (STATE / "s13_phase4_progress.json").write_text(
        json.dumps(p13, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    lane = {
        "lane_id": "LANE-S12-S13-P4",
        "parent_lane": None,
        "sections": ["S12", "S13"],
        "mode": "PARALLEL_PRODUCTION",
        "role": "Author Agent PHASE 4",
        "status": "PHASE_4_COMPLETE",
        "section_passed": False,
        "updated_at": now,
        "S12": {
            "section_id": "performance",
            "title_v3": "APIs, SQL y geodatos responsables",
            "subtopics_done": [s[0] for s in s12_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
            "gate": "CP-N1-C (adquisición + geoevidencia)",
        },
        "S13": {
            "section_id": "rpa-automation",
            "title_v3": "Familiarity Evidence Dashboard y cierre de nivel",
            "subtopics_done": [s[0] for s in s13_slugs],
            "subtopics_remaining": [],
            "exercises_done": 24,
            "demos_done": 8,
            "gate": "CP-N1-C (cierre) + CF-1 + Level-1 regression",
            "youDo_includes": [
                "Familiarity Evidence Dashboard increment",
                "Level-1 regression notes S01-S13",
                "CF-1 privacy/demo/runbook",
            ],
        },
        "exercises_done": 48,
        "exercises_target": 48,
        "demos_done": 16,
        "demos_target": 16,
        "files_changed": [
            "src/lib/course/sections/s12-performance.ts",
            "src/lib/course/sections/s13-rpa-automation.ts",
            "course-state/s12_phase4_progress.json",
            "course-state/s13_phase4_progress.json",
            "course-state/lanes/LANE-S12-S13-P4.status.json",
            "scripts/_gen_s12_s13_p4.py",
        ],
        "execution_summary": (
            "Retargeted S12 to V3 APIs/SQL/geodatos (CP-N1-C acquisition+geo), S13 to V3 "
            "Familiarity Evidence Dashboard (CP-N1-C close + CF-1 + level-1 regression notes in You Do). "
            "Full packages 8 subtopics each (theory+demo+E1/E2/E3, 2 hints) = 8 demos + 24 exercises each. "
            "Platform ids performance / rpa-automation preserved. All demos/solutions executed with python3; "
            "UNVERIFIED=[]. Español peruano; synthetic data only. No seed/checkpoint/ledger edits."
        ),
        "blockers": [],
        "do_not_edit": [
            "course-state/checkpoint.json",
            "course-state/section_ledger.json",
            "course-state/issue_registry.json",
            "course-state/parallel_orchestration.json",
            "prisma/seed.ts",
        ],
        "next_action": (
            "PHASE 5 exam banks for performance and rpa-automation V3 slugs. "
            "Do not mark S12/S13 passed from this lane."
        ),
        "verified_counts": {
            "S12": len(s12_log),
            "S13": len(s13_log),
            "UNVERIFIED": [],
        },
    }
    LANES.mkdir(parents=True, exist_ok=True)
    (LANES / "LANE-S12-S13-P4.status.json").write_text(
        json.dumps(lane, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Wrote progress + lane status")
    print("Verified counts:", len(s12_log), len(s13_log), "UNVERIFIED=[]")


if __name__ == "__main__":
    main()
