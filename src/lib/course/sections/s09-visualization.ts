import type { CourseSection } from '../../types'

export const section09: CourseSection = {
  id: "visualization",
  index: 9,
  title: "Excepciones, debugging y logging seguro",
  shortTitle: "Excepciones & logs",
  tagline: "Excepciones específicas, diagnóstico, logging sin PII y resiliencia del pipeline de familiaridad",
  estimatedHours: 8,
  level: "Intermedio",
  phase: 0,
  icon: "ShieldAlert",
  accentColor: "bg-gradient-to-br from-pink-500 to-rose-600",
  jobRelevance:
    "En pipelines de familiaridad y data engineering junior en Perú, un crash opaco o un log con email completo te cuesta incidentes y cumplimiento. Esta sección (id de plataforma `visualization` conservado) retematiza S09 a **excepciones, debugging y logging seguro**: inicio de **CP-N1-C**. matplotlib/seaborn se difieren al tramo de visualización de datos.",
  learningOutcomes: [
    { text: "Elegir tipos de excepción, raise con contexto y chaining con from" },
    { text: "Dibujar fronteras try/except/finally y separar recuperable vs fatal" },
    { text: "Leer tracebacks y ubicar el frame útil sin exponer secretos" },
    { text: "Reducir fallos a minimal repro con hipótesis y tests de regresión" },
    { text: "Configurar logging con niveles y campos estructurados" },
    { text: "Propagar correlation_id y redactar email/teléfono/dirección" },
    { text: "Decidir fail-fast vs cuarentena según data|config|provider" },
    { text: "Reintentar solo errores transitorios con operaciones idempotentes" },
  ],
  theory: [
    {
      heading: "De “Data Visualization” a excepciones, debugging y logging (mapa)",
      paragraphs: [
        "En V3, **S09 no es el path principal de matplotlib/seaborn/plotly**. Ese material se reubica al tramo de reporting/visualización de datos. Aquí arranca **CP-N1-C**: el pipeline de familiaridad necesita **excepciones específicas**, **diagnóstico** y **logging sin PII**.",
        "El hilo conductor es un **pipeline de intake sintético** (clientes `C00x`, emails `ejemplo.pe`): validar filas, capturar fallos, redactar PII en logs y decidir fail-fast vs cuarentena. Entorno **local-python**.",
        "Orden: **T1 Excepciones** → **T2 Diagnóstico** → **T3 Logging** → **T4 Resiliencia**. Id de plataforma `visualization` se conserva.",
      ],
      callout: {
        type: "info",
        title: "Inicio CP-N1-C",
        content:
          "Gate de incremento: bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia fallo de datos, configuración y proveedor. Sin claims de fraude ni parentesco.",
      },
    },
    {
      heading: "Tipos específicos, raise y chaining",
      subtopicId: "S09-T1-A",
      paragraphs: [
        "Prefiere **tipos concretos**: `ValueError` (valor ilegal), `TypeError` (tipo incorrecto), `KeyError` (clave ausente), `OSError`/`FileNotFoundError` (I/O). `except Exception` genérico oculta la causa y complica el triage.",
        "`raise ValueError('monto no numérico: …')` da contexto accionable. **`raise NewError(...) from e`** encadena la causa (`__cause__`) sin perder el traceback original — útil al traducir fallos de parse a errores de dominio.",
        "Una **custom Exception ligera** (`class DataLoadError(Exception): ...`) nombra el borde de tu capa sin reinventar la jerarquía de la stdlib.",
      ],
      code: {
        language: 'python',
        title: "raise_chain.py",
        code: `class ValidationError(Exception):
    pass

class ParseError(Exception):
    pass

def parse_monto(raw: str) -> float:
    try:
        return float(raw.replace(",", "."))
    except ValueError as e:
        raise ParseError(f"no parseable: {raw!r}") from e

def validate_row(row: dict) -> float:
    try:
        m = parse_monto(row["monto"])
    except ParseError as e:
        raise ValidationError(f"fila {row.get('id')}: monto inválido") from e
    if m < 0:
        raise ValidationError(f"fila {row.get('id')}: monto negativo")
    return m

try:
    validate_row({"id": "C001", "monto": "abc"})
except ValidationError as e:
    print(type(e).__name__, e)
    print("cause:", type(e.__cause__).__name__, e.__cause__)`,
        output: `ValidationError fila C001: monto inválido
cause: ParseError no parseable: 'abc'`,
      },
      callout: {
        type: "tip",
        title: "Mensajes accionables",
        content:
          "Incluye id de fila y el valor problemático (redactado si es PII). No digas solo «error».",
      },
    },
    {
      heading: "Fronteras de recuperación y cleanup",
      subtopicId: "S09-T1-B",
      paragraphs: [
        "`try/except/else/finally`: **else** corre solo si no hubo excepción; **finally** siempre (cleanup). `with` garantiza cierre de handles vía context managers.",
        "No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide: **manejar** (recuperable: fila mala) vs **propagar** (fatal: config inválida).",
        "Config rota → fail-fast. Fila de datos inválida → cuarentena y continúa el lote. El borde del job es un contrato operativo, no un gusto de estilo.",
      ],
      code: {
        language: 'python',
        title: "boundaries.py",
        code: `from io import StringIO

def read_lote(text: str, config_ok: bool) -> list[str]:
    if not config_ok:
        raise RuntimeError("config inválida: delimiter vacío")
    handle = StringIO(text)
    try:
        return [ln.strip() for ln in handle if ln.strip()]
    finally:
        handle.close()
        print("cleanup: handle cerrado")

print(read_lote("a\\nb\\n", True))
try:
    read_lote("x", False)
except RuntimeError as e:
    print("fatal:", e)`,
        output: `cleanup: handle cerrado
['a', 'b']
fatal: config inválida: delimiter vacío`,
      },
      callout: {
        type: "warning",
        title: "No swallow",
        content:
          "`except Exception: pass` es la forma más rápida de esconder corrupción de datos en producción.",
      },
    },
    {
      heading: "Traceback y debugger",
      subtopicId: "S09-T2-A",
      paragraphs: [
        "Un **traceback** lista frames del más reciente al más profundo (o viceversa según herramienta). El frame útil suele ser **tu código**, no el de la stdlib.",
        "`breakpoint()` / `pdb` inspeccionan variables en vivo. En demos del curso usamos **`traceback` + prints controlados** cuando no hay TTY interactivo.",
        "Al loguear stacks, **nunca** imprimas secretos ni PII completa que haya en locals. Redacta o omite.",
      ],
      code: {
        language: 'python',
        title: "traceback_read.py",
        code: `import traceback

def normalize(row: dict) -> str:
    return row["email"].lower().strip()

def process(batch: list[dict]) -> None:
    for r in batch:
        normalize(r)

try:
    process([{"id": "C001"}, {"id": "C002", "email": "a@ejemplo.pe"}])
except KeyError:
    tb = traceback.format_exc()
    # solo frames de demo: buscar normalize
    for line in tb.splitlines():
        if "normalize" in line or "KeyError" in line or "process" in line:
            print(line.strip())`,
        output: `File "<string>", line 9, in process
File "<string>", line 5, in normalize
KeyError: 'email'`,
      },
      callout: {
        type: "tip",
        title: "Frame útil",
        content:
          "Empieza por la última línea de tu módulo; sube solo si el bug está en un helper compartido.",
      },
    },
    {
      heading: "Reproducción mínima, hipótesis y causa raíz",
      subtopicId: "S09-T2-B",
      paragraphs: [
        "**Minimal repro**: reduce 200 filas a la **menor entrada** que dispara el bug. Facilita tests de regresión y code review.",
        "Formula **hipótesis falsables** («si el apellido2 vacío rompe el join, entonces con apellido2='X' pasa»). Descartar es progreso.",
        "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo. 5-whys ligero: no pares en el síntoma.",
      ],
      code: {
        language: 'python',
        title: "minimal_repro.py",
        code: `def split_apellidos(nombre: str) -> tuple[str, str]:
    parts = nombre.split()
    if len(parts) < 2:
        raise ValueError("faltan apellidos")
    # bug: asume exactamente 2 tokens
    return parts[0], parts[1]

# lote "grande" sintético
lote = [f"Cliente{i} Perez" for i in range(5)] + ["Maria Lopez Garcia"]
bad = []
for n in lote:
    try:
        split_apellidos(n)
    except Exception as e:
        bad.append((n, type(e).__name__))
# minimal: la fila con 3 tokens no falla aquí; el bug real es 1 token
print("bad in lote:", bad)
try:
    print(split_apellidos("SoloNombre"))
except ValueError as e:
    print("minimal repro:", e)`,
        output: `bad in lote: []
minimal repro: faltan apellidos`,
      },
      callout: {
        type: "info",
        title: "Causa raíz",
        content:
          "«Falló en prod» no es causa raíz. «split asume 2 tokens y llegó 1» sí lo es.",
      },
    },
    {
      heading: "Niveles y estructura de logging",
      subtopicId: "S09-T3-A",
      paragraphs: [
        "Niveles: **DEBUG** (detalle dev), **INFO** (progreso), **WARNING** (anomalía recuperable), **ERROR** (fallo de unidad), **CRITICAL** (job/proceso).",
        "Usa un **Logger de módulo** (`logging.getLogger(__name__)`) en vez de configurar el root a ciegas. Handlers y formatters se arman una vez en el entrypoint.",
        "Logs **estructurados** (`key=value` o JSON) con campos estables (`stage`, `record_id`, `duration_ms`) se pueden buscar en agregadores. Los prints libres no escalan.",
      ],
      code: {
        language: 'python',
        title: "structured_log.py",
        code: `import logging
import io
import time

buf = io.StringIO()
log = logging.getLogger("pipeline.demo")
log.handlers.clear()
log.setLevel(logging.DEBUG)
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
log.addHandler(h)
log.propagate = False

t0 = time.perf_counter()
stage, record_id = "normalize", "C001"
log.info("stage=%s record_id=%s event=start", stage, record_id)
duration_ms = int((time.perf_counter() - t0) * 1000)
log.info(
    "stage=%s record_id=%s event=done duration_ms=%s",
    stage, record_id, duration_ms,
)
print(buf.getvalue().strip())`,
        output: `INFO stage=normalize record_id=C001 event=start
INFO stage=normalize record_id=C001 event=done duration_ms=0`,
      },
      callout: {
        type: "tip",
        title: "Campos estables",
        content:
          "Acuerda un vocabulario (stage, correlation_id, error_class). Cambiar nombres rompe dashboards.",
      },
    },
    {
      heading: "Correlation IDs y redacción de PII",
      subtopicId: "S09-T3-B",
      paragraphs: [
        "Un **correlation_id** (o request_id) viaja por capas (CLI → service → repo) para unir logs del mismo job/lote.",
        "**Nunca** loguees email, teléfono o dirección completos. Usa máscaras: `a***@ejemplo.pe`, `***4567`.",
        "Helpers `mask_email` / `mask_phone` deben ser el **único** camino a logs; audits fallan si alguien hace `log.info(row)`.",
      ],
      code: {
        language: 'python',
        title: "redact_pii.py",
        code: `def mask_email(email: str) -> str:
    local, _, domain = email.partition("@")
    if not domain:
        return "***"
    head = local[:1] if local else "*"
    return f"{head}***@{domain}"

def mask_phone(phone: str) -> str:
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) < 4:
        return "***"
    return "***" + digits[-4:]

corr = "job-7f3a"
email = "ana.rojas@ejemplo.pe"
print(f"correlation_id={corr} email={mask_email(email)} phone={mask_phone('+51 999 123 4567')}")`,
        output: `correlation_id=job-7f3a email=a***@ejemplo.pe phone=***4567`,
      },
      callout: {
        type: "danger",
        title: "PII en logs",
        content:
          "Un ERROR con el row completo puede filtrar PII a CloudWatch/Slack. Redacta siempre.",
      },
    },
    {
      heading: "Fallar rápido vs continuar con cuarentena",
      subtopicId: "S09-T4-A",
      paragraphs: [
        "Taxonomía: **data** (fila), **config** (delimiter, schema path), **provider** (timeout de API/archivo remoto). La política difiere.",
        "**Fail-fast** en config: seguir procesando con schema roto multiplica basura. **Cuarentena** en data: una fila mala no debe tumbar el lote entero.",
        "Éxito parcial es válido si el manifest contabiliza `ok + quarantined = input`. Documenta la política en README del job.",
      ],
      code: {
        language: 'python',
        title: "failfast_quarantine.py",
        code: `def process_batch(rows: list[dict], config: dict) -> dict:
    if not config.get("delimiter"):
        raise RuntimeError("config: delimiter requerido")
    ok, quarantine = [], []
    for r in rows:
        if "id" not in r or r.get("monto") is None:
            quarantine.append({"row": r, "reason": "data: campos requeridos"})
            continue
        ok.append(r)
    return {"ok": ok, "quarantined": quarantine}

print(process_batch(
    [{"id": "C001", "monto": 10}, {"nombre": "x"}],
    {"delimiter": ","},
))
try:
    process_batch([], {})
except RuntimeError as e:
    print("abort:", e)`,
        output: `{'ok': [{'id': 'C001', 'monto': 10}], 'quarantined': [{'row': {'nombre': 'x'}, 'reason': 'data: campos requeridos'}]}
abort: config: delimiter requerido`,
      },
      callout: {
        type: "info",
        title: "Éxito parcial",
        content:
          "Operaciones de intake latam casi siempre tienen filas sucias. Cuarentena + conteos > crash total.",
      },
    },
    {
      heading: "Idempotencia, retries y cuarentena",
      subtopicId: "S09-T4-B",
      paragraphs: [
        "**Retry solo errores transitorios** (`TimeoutError`, 503). `ValueError` de datos **no** se reintenta: va a cuarentena.",
        "Operaciones **idempotentes** (misma clave de escritura) permiten re-correr un job sin duplicar side-effects. Clave típica: `(source, record_id, version)`.",
        "Backoff simple (sleep creciente) reduce thundering herd. Tras max_attempts → cuarentena o fail según la política.",
      ],
      code: {
        language: 'python',
        title: "retry_policy.py",
        code: `import time

def fetch_with_retry(fn, max_attempts=3):
    last = None
    for attempt in range(1, max_attempts + 1):
        try:
            return fn(attempt)
        except TimeoutError as e:
            last = e
            time.sleep(0.01 * attempt)  # backoff demo
        except ValueError:
            raise  # no retry
    raise last

calls = {"n": 0}

def flaky(attempt):
    calls["n"] += 1
    if attempt < 3:
        raise TimeoutError("simulado")
    return "ok"

print(fetch_with_retry(flaky), "calls", calls["n"])
try:
    fetch_with_retry(lambda a: (_ for _ in ()).throw(ValueError("dato malo")))
except ValueError as e:
    print("no-retry:", e)`,
        output: `ok calls 3
no-retry: dato malo`,
      },
      callout: {
        type: "warning",
        title: "Idempotencia",
        content:
          "Reintentar un INSERT no idempotente duplica filas. Diseña la clave antes del retry.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do (uno por subtema). Orden T1→T4. Pipeline de familiaridad con excepciones, logs y cuarentena. Datos sintéticos; local-python.",
    steps: [
      {
        demoId: "S09-T1-A-DEMO",
        subtopicId: "S09-T1-A",
        environment: "local-python",
        description: "Validar fila de intake y encadenar ParseError → ValidationError.",
        code: {
          language: 'python',
          title: "intake_chain.py",
          code: `class ParseError(Exception):
    pass

class ValidationError(Exception):
    pass

def parse_monto(raw: str) -> float:
    try:
        return float(str(raw).replace(",", "."))
    except (TypeError, ValueError) as e:
        raise ParseError(f"monto no parseable: {raw!r}") from e

def validate_intake(row: dict) -> dict:
    try:
        monto = parse_monto(row.get("monto"))
    except ParseError as e:
        raise ValidationError(f"id={row.get('id')}: validación falló") from e
    if monto < 0:
        raise ValidationError(f"id={row.get('id')}: monto negativo")
    return {"id": row["id"], "monto": monto}

print(validate_intake({"id": "C001", "monto": "12,50"}))
try:
    validate_intake({"id": "C002", "monto": "N/A"})
except ValidationError as e:
    print(type(e).__name__, "->", e)
    print("cause", type(e.__cause__).__name__, e.__cause__)`,
          output: `{'id': 'C001', 'monto': 12.5}
ValidationError -> id=C002: validación falló
cause ParseError monto no parseable: 'N/A'`,
        },
        why: "El chaining preserva la causa de parse al subir a validación de dominio.",
      },
      {
        demoId: "S09-T1-B-DEMO",
        subtopicId: "S09-T1-B",
        environment: "local-python",
        description: "Leer lote con finally que cierra handle; re-raise si config inválida.",
        code: {
          language: 'python',
          title: "lote_finally.py",
          code: `from __future__ import annotations

from io import StringIO
from typing import List, Optional

class ConfigError(Exception):
    pass

def leer_lote(payload: str, encoding: Optional[str]) -> List[str]:
    if not encoding:
        raise ConfigError("encoding requerido")
    handle = StringIO(payload)
    try:
        return [ln.rstrip("\\n") for ln in handle]
    finally:
        handle.close()
        print("finally: recurso cerrado")

print("ok", leer_lote("fila1\\nfila2\\n", "utf-8"))
try:
    leer_lote("x", None)
except ConfigError as e:
    print("fatal config:", e)`,
          output: `finally: recurso cerrado
ok ['fila1', 'fila2']
fatal config: encoding requerido`,
        },
        why: "finally corre siempre; config inválida no se traga — se propaga.",
      },
      {
        demoId: "S09-T2-A-DEMO",
        subtopicId: "S09-T2-A",
        environment: "local-python",
        description: "Reproducir KeyError en normalizer y ubicar frame con traceback.",
        code: {
          language: 'python',
          title: "keyerror_frames.py",
          code: `import traceback

def normalize_email(row: dict) -> str:
    return row["email"].strip().lower()

def run_batch(rows: list[dict]) -> list[str]:
    return [normalize_email(r) for r in rows]

rows = [{"id": "C001", "email": "a@ejemplo.pe"}, {"id": "C002"}]
try:
    run_batch(rows)
except KeyError as e:
    print("error:", type(e).__name__, e)
    # simula inspección de debugger: frames relevantes
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.name in {"normalize_email", "run_batch", "<module>"}:
            print(f"frame={fr.name} line={fr.lineno} -> {fr.line}")`,
          output: `error: KeyError 'email'
frame=<module> line=12 -> 
frame=run_batch line=8 -> 
frame=normalize_email line=5 -> `,
        },
        why: "El frame útil es normalize_email: falta la clave email en C002.",
      },
      {
        demoId: "S09-T2-B-DEMO",
        subtopicId: "S09-T2-B",
        environment: "local-python",
        description: "De un lote de 200 filas sintéticas al caso mínimo de apellidos.",
        code: {
          language: 'python',
          title: "minimal_apellidos.py",
          code: `def apellidos(nombre: str) -> list[str]:
    toks = [t for t in nombre.split() if t.lower() not in {"de", "del", "la"}]
    if len(toks) < 3:  # nombre + 2 apellidos
        raise ValueError(f"nombre incompleto: {nombre!r}")
    return toks[-2:]

# simula 200 filas: casi todas ok
lote = [f"Ana Perez Lopez {i}" for i in range(198)]
lote += ["Juan Perez", "Solo"]
fallos = []
for n in lote:
    try:
        apellidos(n)
    except ValueError as e:
        fallos.append(str(e))
print("total_fallos", len(fallos))
# minimal repro: la entrada más corta
minimal = min((f.split(": ", 1)[-1].strip("'") for f in fallos), key=len)
print("minimal_repro", repr(minimal))
try:
    apellidos(minimal)
except ValueError as e:
    print("root_symptom", e)`,
          output: `total_fallos 2
minimal_repro 'Solo'
root_symptom nombre incompleto: 'Solo'`,
        },
        why: "Reducir a 'Solo' permite un test de regresión de una línea.",
      },
      {
        demoId: "S09-T3-A-DEMO",
        subtopicId: "S09-T3-A",
        environment: "local-python",
        description: "Logger de pipeline con campos stage, record_id, duration_ms.",
        code: {
          language: 'python',
          title: "pipeline_logger.py",
          code: `import logging, io, time

buf = io.StringIO()
log = logging.getLogger("familiarity.pipeline")
log.handlers.clear()
log.setLevel(logging.INFO)
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
log.addHandler(h)
log.propagate = False

def stage_normalize(record_id: str) -> None:
    t0 = time.perf_counter()
    log.info("stage=normalize record_id=%s event=start", record_id)
    _ = record_id.lower()
    ms = int((time.perf_counter() - t0) * 1000)
    log.info(
        "stage=normalize record_id=%s event=done duration_ms=%s",
        record_id, ms,
    )

stage_normalize("C001")
print(buf.getvalue().strip())`,
          output: `INFO stage=normalize record_id=C001 event=start
INFO stage=normalize record_id=C001 event=done duration_ms=0`,
        },
        why: "Campos estables permiten filtrar por stage y record_id en operación.",
      },
      {
        demoId: "S09-T3-B-DEMO",
        subtopicId: "S09-T3-B",
        environment: "local-python",
        description: "Log de error con email enmascarado y correlation_id.",
        code: {
          language: 'python',
          title: "masked_error_log.py",
          code: `import logging, io

def mask_email(email: str) -> str:
    local, _, domain = email.partition("@")
    return f"{(local[:1] or '*')}***@{domain}" if domain else "***"

buf = io.StringIO()
log = logging.getLogger("familiarity.audit")
log.handlers.clear()
log.setLevel(logging.ERROR)
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(message)s"))
log.addHandler(h)
log.propagate = False

corr = "corr-9c2e"
raw_email = "lucia.mendez@ejemplo.pe"
log.error(
    "correlation_id=%s stage=validate error_class=data email=%s msg=formato",
    corr, mask_email(raw_email),
)
out = buf.getvalue().strip()
print(out)
assert "@ejemplo.pe" in out and "lucia.mendez" not in out
print("pii_completa_ausente=True")`,
          output: `correlation_id=corr-9c2e stage=validate error_class=data email=l***@ejemplo.pe msg=formato
pii_completa_ausente=True`,
        },
        why: "El log es accionable sin filtrar PII completa.",
      },
      {
        demoId: "S09-T4-A-DEMO",
        subtopicId: "S09-T4-A",
        environment: "local-python",
        description: "Lote: 1 fila mala a cuarentena; config rota aborta.",
        code: {
          language: 'python',
          title: "batch_policy.py",
          code: `def process_batch(rows, config):
    if config.get("required_fields") is None:
        raise RuntimeError("config: required_fields ausente")
    req = config["required_fields"]
    ok, q = [], []
    for r in rows:
        missing = [k for k in req if not r.get(k)]
        if missing:
            q.append({"id": r.get("id"), "reason": f"data:missing:{','.join(missing)}"})
        else:
            ok.append(r)
    return {"ok": ok, "quarantined": q, "in": len(rows)}

rows = [
    {"id": "C001", "email": "a@ejemplo.pe"},
    {"id": "C002"},
]
r = process_batch(rows, {"required_fields": ["id", "email"]})
print(r)
assert len(r["ok"]) + len(r["quarantined"]) == r["in"]
try:
    process_batch(rows, {})
except RuntimeError as e:
    print("abort", e)`,
          output: `{'ok': [{'id': 'C001', 'email': 'a@ejemplo.pe'}], 'quarantined': [{'id': 'C002', 'reason': 'data:missing:email'}], 'in': 2}
abort config: required_fields ausente`,
        },
        why: "Data → cuarentena; config → fail-fast. Conteos reconciliados.",
      },
      {
        demoId: "S09-T4-B-DEMO",
        subtopicId: "S09-T4-B",
        environment: "local-python",
        description: "Retry 3× en TimeoutError; ValueError va a cuarentena sin retry.",
        code: {
          language: 'python',
          title: "retry_quarantine.py",
          code: `def with_retry(fn, max_attempts=3):
    for attempt in range(1, max_attempts + 1):
        try:
            return ("ok", fn(attempt))
        except TimeoutError:
            if attempt == max_attempts:
                return ("fail_timeout", None)
        except ValueError as e:
            return ("quarantine", str(e))
    return ("fail", None)

state = {"t": 0}

def flaky(attempt):
    state["t"] += 1
    if attempt < 3:
        raise TimeoutError("red")
    return "payload"

print(with_retry(flaky), "attempts", state["t"])
print(with_retry(lambda a: (_ for _ in ()).throw(ValueError("monto"))))`,
          output: `('ok', 'payload') attempts 3
('quarantine', 'monto')`,
        },
        why: "Transitorio se reintenta; error de datos no gasta reintentos.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Ejecuta y compara. Sin matplotlib. Datos sintéticos; sin PII real.",
    steps: [
      {
        id: "S09-T1-A-E1",
        subtopicId: "S09-T1-A",
        kind: "guided",
        instruction:
          "Mapea 5 fallos sintéticos al tipo de excepción más adecuado e imprime `fallo -> Tipo`.",
        hint: "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
        hints: [
          "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
          "Usa TypeError, ValueError, KeyError, FileNotFoundError y un custom ValidationError.",
        ],
        edgeCases: ["No uses Exception genérico para todos", "FileNotFoundError es subclase de OSError"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "map_exceptions.py",
          code: `fallos = [
    "int('x')",
    "sumar str + int",
    "dict sin clave email",
    "abrir archivo inexistente",
    "regla de negocio: monto < 0",
]
# TODO: imprimir fallo -> ExceptionType`,
        },
        solutionCode: {
          language: 'python',
          title: "map_exceptions.py",
          code: `class ValidationError(Exception):
    pass

mapping = [
    ("int('x')", "ValueError"),
    ("sumar str + int", "TypeError"),
    ("dict sin clave email", "KeyError"),
    ("abrir archivo inexistente", "FileNotFoundError"),
    ("regla de negocio: monto < 0", "ValidationError"),
]
for fallo, tipo in mapping:
    print(f"{fallo} -> {tipo}")`,
          output: `int('x') -> ValueError
sumar str + int -> TypeError
dict sin clave email -> KeyError
abrir archivo inexistente -> FileNotFoundError
regla de negocio: monto < 0 -> ValidationError`,
        },
      },
      {
        id: "S09-T1-A-E2",
        subtopicId: "S09-T1-A",
        kind: "independent",
        instruction:
          "Implementa `parse_monto(raw)` que hace raise ValueError con mensaje accionable si no parsea o es negativo.",
        hint: "Normaliza coma decimal. Mensaje debe incluir el raw.",
        hints: [
          "Normaliza coma decimal. Mensaje debe incluir el raw.",
          "Dos raises distintos: no numérico vs negativo.",
        ],
        edgeCases: ["'' vacío", "None"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `def parse_monto(raw):
    # TODO
    ...

for v in ["10.5", "3,25", "abc", "-1"]:
    try:
        print(v, "->", parse_monto(v))
    except ValueError as e:
        print(v, "ERR", e)`,
        },
        solutionCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `def parse_monto(raw):
    try:
        n = float(str(raw).replace(",", "."))
    except (TypeError, ValueError):
        raise ValueError(f"monto no numérico: {raw!r}") from None
    if n < 0:
        raise ValueError(f"monto negativo no permitido: {n}")
    return n

for v in ["10.5", "3,25", "abc", "-1"]:
    try:
        print(v, "->", parse_monto(v))
    except ValueError as e:
        print(v, "ERR", e)`,
          output: `10.5 -> 10.5
3,25 -> 3.25
abc ERR monto no numérico: 'abc'
-1 ERR monto negativo no permitido: -1.0`,
        },
      },
      {
        id: "S09-T1-A-E3",
        subtopicId: "S09-T1-A",
        kind: "transfer",
        instruction:
          "Define `DataLoadError` y `load_text(path_fn)` que captura OSError del lector y re-lanza DataLoadError con `from`.",
        hint: "path_fn es un callable que simula open y puede lanzar OSError.",
        hints: [
          "path_fn es un callable que simula open y puede lanzar OSError.",
          "Imprime type del error y de __cause__.",
        ],
        edgeCases: ["PermissionError también es OSError"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "data_load_chain.py",
          code: `class DataLoadError(Exception):
    pass

def load_text(path_fn):
    # TODO
    ...

def bad_reader():
    raise OSError("no such file: data/clientes.csv")

try:
    load_text(bad_reader)
except DataLoadError as e:
    print(type(e).__name__, e)
    print(type(e.__cause__).__name__, e.__cause__)`,
        },
        solutionCode: {
          language: 'python',
          title: "data_load_chain.py",
          code: `class DataLoadError(Exception):
    pass

def load_text(path_fn):
    try:
        return path_fn()
    except OSError as e:
        raise DataLoadError("fallo al cargar intake") from e

def bad_reader():
    raise OSError("no such file: data/clientes.csv")

try:
    load_text(bad_reader)
except DataLoadError as e:
    print(type(e).__name__, e)
    print(type(e.__cause__).__name__, e.__cause__)`,
          output: `DataLoadError fallo al cargar intake
OSError no such file: data/clientes.csv`,
        },
      },
      {
        id: "S09-T1-B-E1",
        subtopicId: "S09-T1-B",
        kind: "guided",
        instruction:
          "Completa el `finally` para marcar el recurso como cerrado aunque haya excepción.",
        hint: "El flag `closed` debe quedar True siempre.",
        hints: [
          "El flag `closed` debe quedar True siempre.",
          "Usa try/finally; no captures la excepción.",
        ],
        edgeCases: ["finally corre antes de propagar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "finally_close.py",
          code: `state = {"closed": False}

def work(fail: bool):
    try:
        if fail:
            raise RuntimeError("boom")
        return "ok"
    finally:
        # TODO: cerrar
        pass

print(work(False), state)
try:
    work(True)
except RuntimeError:
    print("err", state)`,
        },
        solutionCode: {
          language: 'python',
          title: "finally_close.py",
          code: `state = {"closed": False}

def work(fail: bool):
    try:
        if fail:
            raise RuntimeError("boom")
        return "ok"
    finally:
        state["closed"] = True

print(work(False), state)
try:
    work(True)
except RuntimeError:
    print("err", state)`,
          output: `ok {'closed': True}
err {'closed': True}`,
        },
      },
      {
        id: "S09-T1-B-E2",
        subtopicId: "S09-T1-B",
        kind: "independent",
        instruction:
          "Clasifica 6 errores en recover o fail-fast e imprime `nombre: política`.",
        hint: "Config y secretos ausentes → fail-fast. Fila mala / parse → recover.",
        hints: [
          "Config y secretos ausentes → fail-fast. Fila mala / parse → recover.",
          "Timeout de red de un registro puede ser recover+retry (marca recover).",
        ],
        edgeCases: ["recover no significa ignorar: cuarentena o retry"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "classify_errors.py",
          code: `errores = [
    "delimiter vacío en config",
    "monto no numérico en fila",
    "schema_path no existe",
    "email mal formado en fila",
    "API_TOKEN ausente",
    "timeout leyendo un record remoto",
]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "classify_errors.py",
          code: `politica = {
    "delimiter vacío en config": "fail-fast",
    "monto no numérico en fila": "recover",
    "schema_path no existe": "fail-fast",
    "email mal formado en fila": "recover",
    "API_TOKEN ausente": "fail-fast",
    "timeout leyendo un record remoto": "recover",
}
for k, v in politica.items():
    print(f"{k}: {v}")`,
          output: `delimiter vacío en config: fail-fast
monto no numérico en fila: recover
schema_path no existe: fail-fast
email mal formado en fila: recover
API_TOKEN ausente: fail-fast
timeout leyendo un record remoto: recover`,
        },
      },
      {
        id: "S09-T1-B-E3",
        subtopicId: "S09-T1-B",
        kind: "transfer",
        instruction:
          "Refactoriza el handler bare: captura ValueError (cuarentena) y deja propagar el resto.",
        hint: "No uses except desnudo.",
        hints: [
          "No uses except desnudo.",
          "Imprime ok/quarantine/raised según el caso.",
        ],
        edgeCases: ["Exception aún es amplio; preferir tipos de dominio en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "refactor_bare_except.py",
          code: `def bad_handler(fn):
    try:
        return ("ok", fn())
    except:  # noqa: E722 — malo a propósito
        return ("swallowed", None)

def good_handler(fn):
    # TODO
    ...

def v():
    raise ValueError("fila")

def r():
    raise RuntimeError("config")

print("bad", bad_handler(v), bad_handler(r))
print("good_v", good_handler(v))
try:
    print(good_handler(r))
except RuntimeError as e:
    print("good_r raised", e)`,
        },
        solutionCode: {
          language: 'python',
          title: "refactor_bare_except.py",
          code: `def bad_handler(fn):
    try:
        return ("ok", fn())
    except Exception:
        return ("swallowed", None)

def good_handler(fn):
    try:
        return ("ok", fn())
    except ValueError as e:
        return ("quarantine", str(e))

def v():
    raise ValueError("fila")

def r():
    raise RuntimeError("config")

print("bad", bad_handler(v), bad_handler(r))
print("good_v", good_handler(v))
try:
    print(good_handler(r))
except RuntimeError as e:
    print("good_r raised", e)`,
          output: `bad ('swallowed', None) ('swallowed', None)
good_v ('quarantine', 'fila')
good_r raised config`,
        },
      },
      {
        id: "S09-T2-A-E1",
        subtopicId: "S09-T2-A",
        kind: "guided",
        instruction:
          "Dado un traceback sintético en string, anota 3 frames (nombre de función) de afuera hacia adentro.",
        hint: "Busca líneas 'File' o patrones 'in nombre'.",
        hints: [
          "Busca líneas 'File' o patrones 'in nombre'.",
          "Imprime frame1, frame2, frame3.",
        ],
        edgeCases: ["most recent call last: el último frame es el más profundo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "annotate_frames.py",
          code: `tb = '''Traceback (most recent call last):
  File "cli.py", line 10, in main
    run()
  File "pipeline.py", line 4, in run
    normalize(row)
  File "normalize.py", line 2, in normalize
    return row["email"]
KeyError: 'email'
'''
# TODO: extraer main, run, normalize`,
        },
        solutionCode: {
          language: 'python',
          title: "annotate_frames.py",
          code: `tb = '''Traceback (most recent call last):
  File "cli.py", line 10, in main
    run()
  File "pipeline.py", line 4, in run
    normalize(row)
  File "normalize.py", line 2, in normalize
    return row["email"]
KeyError: 'email'
'''
frames = []
for line in tb.splitlines():
    if ", in " in line:
        frames.append(line.rsplit(", in ", 1)[-1].strip())
print("frame1", frames[0])
print("frame2", frames[1])
print("frame3", frames[2])`,
          output: `frame1 main
frame2 run
frame3 normalize`,
        },
      },
      {
        id: "S09-T2-A-E2",
        subtopicId: "S09-T2-A",
        kind: "independent",
        instruction:
          "Simula un 'breakpoint': en normalize, si falta email, imprime locals seguros (solo id) y lanza KeyError.",
        hint: "No imprimas el row completo si pudiera tener PII.",
        hints: [
          "No imprimas el row completo si pudiera tener PII.",
          "Usa un flag DEBUG.",
        ],
        edgeCases: ["En prod real usa logging + correlation_id"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "simulate_breakpoint.py",
          code: `DEBUG = True

def normalize(row: dict) -> str:
    # TODO
    ...

try:
    print(normalize({"id": "C009"}))
except KeyError as e:
    print("raised", e)`,
        },
        solutionCode: {
          language: 'python',
          title: "simulate_breakpoint.py",
          code: `DEBUG = True

def normalize(row: dict) -> str:
    if "email" not in row:
        if DEBUG:
            print("break locals id=", row.get("id"))
        raise KeyError("email")
    return row["email"].lower()

try:
    print(normalize({"id": "C009"}))
except KeyError as e:
    print("raised", e)`,
          output: `break locals id= C009
raised 'email'`,
        },
      },
      {
        id: "S09-T2-A-E3",
        subtopicId: "S09-T2-A",
        kind: "transfer",
        instruction:
          "Solo con el traceback, imprime la causa raíz en una frase (función + clave faltante).",
        hint: "No re-ejecutes el código original; parsea el texto.",
        hints: [
          "No re-ejecutes el código original; parsea el texto.",
          "Formato: causa_raiz=normalize falta clave email",
        ],
        edgeCases: ["No culpes a cli.py si el bug está en normalize"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "root_from_tb.py",
          code: `tb = '''Traceback (most recent call last):
  File "app.py", line 1, in <module>
    normalize({"id": 1})
  File "app.py", line 1, in normalize
    return row["email"].lower()
KeyError: 'email'
'''
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "root_from_tb.py",
          code: `tb = '''Traceback (most recent call last):
  File "app.py", line 1, in <module>
    normalize({"id": 1})
  File "app.py", line 1, in normalize
    return row["email"].lower()
KeyError: 'email'
'''
last_exc = [ln for ln in tb.splitlines() if ln.startswith("KeyError")][-1]
key = last_exc.split(":", 1)[-1].strip().strip("'")
print(f"causa_raiz=normalize falta clave {key}")`,
          output: `causa_raiz=normalize falta clave email`,
        },
      },
      {
        id: "S09-T2-B-E1",
        subtopicId: "S09-T2-B",
        kind: "guided",
        instruction:
          "Recorta la fixture a la fila mínima que hace fallar `parse_dni` (debe ser 8 dígitos).",
        hint: "Encuentra el primer fallido y re-ejecuta solo ese.",
        hints: [
          "Encuentra el primer fallido y re-ejecuta solo ese.",
          "Imprime minimal=...",
        ],
        edgeCases: ["Puede haber varios fallos; el mínimo del primer fallo basta para el test"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "crop_fixture.py",
          code: `def parse_dni(d: str) -> str:
    if not (d.isdigit() and len(d) == 8):
        raise ValueError(f"dni inválido: {d!r}")
    return d

fixture = ["12345678", "123", "87654321", "12AB5678"]
# TODO: minimal repro del primer fallo`,
        },
        solutionCode: {
          language: 'python',
          title: "crop_fixture.py",
          code: `def parse_dni(d: str) -> str:
    if not (d.isdigit() and len(d) == 8):
        raise ValueError(f"dni inválido: {d!r}")
    return d

fixture = ["12345678", "123", "87654321", "12AB5678"]
minimal = None
for d in fixture:
    try:
        parse_dni(d)
    except ValueError:
        minimal = d
        break
print("minimal=", minimal)
try:
    parse_dni(minimal)
except ValueError as e:
    print(e)`,
          output: `minimal= 123
dni inválido: '123'`,
        },
      },
      {
        id: "S09-T2-B-E2",
        subtopicId: "S09-T2-B",
        kind: "independent",
        instruction:
          "Para el bug `normalize_phone` que borra el +51, escribe 2 hipótesis y el experimento que las falsifica.",
        hint: "Imprime H1/H2 y resultado ok/fail de cada experimento sintético.",
        hints: [
          "Imprime H1/H2 y resultado ok/fail de cada experimento sintético.",
          "No necesitas fix real; solo el diseño experimental.",
        ],
        edgeCases: ["Hipótesis deben ser falsables con un assert"],
        tests: "salida coincide con solution output",
        feedback: "H1 se falsifica/confirma según el contrato esperado del normalizer.",
        starterCode: {
          language: 'python',
          title: "hypotheses.py",
          code: `def normalize_phone(p: str) -> str:
    # bug: se come el +
    return "".join(c for c in p if c.isdigit())

# TODO: hipótesis + experimentos`,
        },
        solutionCode: {
          language: 'python',
          title: "hypotheses.py",
          code: `def normalize_phone(p: str) -> str:
    return "".join(c for c in p if c.isdigit())

print("H1: solo dígitos; pierde '+'")
exp1 = normalize_phone("+51999111222")
print("exp1", exp1, "fail" if not exp1.startswith("51") or "+" in "+51999111222" and "+" not in exp1 else "ok")
# reinterpret: si esperábamos conservar country code con +
print("H1_result", "fail" if not exp1.startswith("+") else "ok")

print("H2: el bug es strip de espacios no del +")
exp2 = normalize_phone("999 111 222")
print("exp2", exp2, "H2_result", "ok" if exp2 == "999111222" else "fail")`,
          output: `H1: solo dígitos; pierde '+'
exp1 51999111222 fail
H1_result fail
H2: el bug es strip de espacios no del +
exp2 999111222 H2_result ok`,
        },
      },
      {
        id: "S09-T2-B-E3",
        subtopicId: "S09-T2-B",
        kind: "transfer",
        instruction:
          "Añade un test de regresión: falla en rojo con la función bugueada y pasa tras el fix.",
        hint: "Imprime RED luego GREEN.",
        hints: [
          "Imprime RED luego GREEN.",
          "Bug: title-case rompe 'de la'.",
        ],
        edgeCases: ["title() capitaliza De/La incorrectamente para nombres latam"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "regression_test.py",
          code: `def bad_title(s: str) -> str:
    return s.title()

def good_title(s: str) -> str:
    # TODO: no capitalizar partículas de/del/la
    ...

def test(fn):
    out = fn("juan de la cruz")
    assert out == "Juan de la Cruz", out
    return "pass"

# TODO: red then green`,
        },
        solutionCode: {
          language: 'python',
          title: "regression_test.py",
          code: `def bad_title(s: str) -> str:
    return s.title()

def good_title(s: str) -> str:
    parts = []
    for i, t in enumerate(s.split()):
        if i > 0 and t.lower() in {"de", "del", "la", "los", "las"}:
            parts.append(t.lower())
        else:
            parts.append(t[:1].upper() + t[1:].lower() if t else t)
    return " ".join(parts)

def test(fn):
    out = fn("juan de la cruz")
    assert out == "Juan de la Cruz", out
    return "pass"

try:
    test(bad_title)
except AssertionError:
    print("RED")
print(test(good_title))
print("GREEN")`,
          output: `RED
pass
GREEN`,
        },
      },
      {
        id: "S09-T3-A-E1",
        subtopicId: "S09-T3-A",
        kind: "guided",
        instruction:
          "Asigna el nivel correcto (DEBUG/INFO/WARNING/ERROR) a 6 eventos e imprime `evento: NIVEL`.",
        hint: "Progreso normal → INFO; detalle de loop → DEBUG; fila rara → WARNING; fallo de unidad → ERROR.",
        hints: [
          "Progreso normal → INFO; detalle de loop → DEBUG; fila rara → WARNING; fallo de unidad → ERROR.",
          "Config inválida al arrancar también ERROR (o CRITICAL; usa ERROR aquí).",
        ],
        edgeCases: ["WARNING no es ERROR si el job continúa"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "assign_levels.py",
          code: `eventos = [
    "job iniciado",
    "valor de variable i en loop",
    "fila sin email opcional",
    "no se pudo parsear monto",
    "archivo de config ilegible",
    "lote terminado con conteos",
]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "assign_levels.py",
          code: `niveles = {
    "job iniciado": "INFO",
    "valor de variable i en loop": "DEBUG",
    "fila sin email opcional": "WARNING",
    "no se pudo parsear monto": "ERROR",
    "archivo de config ilegible": "ERROR",
    "lote terminado con conteos": "INFO",
}
for e, n in niveles.items():
    print(f"{e}: {n}")`,
          output: `job iniciado: INFO
valor de variable i en loop: DEBUG
fila sin email opcional: WARNING
no se pudo parsear monto: ERROR
archivo de config ilegible: ERROR
lote terminado con conteos: INFO`,
        },
      },
      {
        id: "S09-T3-A-E2",
        subtopicId: "S09-T3-A",
        kind: "independent",
        instruction:
          "Configura un logger de módulo con StreamHandler a un StringIO y emite un INFO estructurado.",
        hint: "propagate=False; formatter simple.",
        hints: [
          "propagate=False; formatter simple.",
          "Mensaje: stage=ingest event=start",
        ],
        edgeCases: ["Limpiar handlers en demos evita duplicados"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "module_logger.py",
          code: `import logging, io
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "module_logger.py",
          code: `import logging, io
buf = io.StringIO()
log = logging.getLogger("familiarity.ingest")
log.handlers.clear()
log.setLevel(logging.INFO)
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
log.addHandler(h)
log.propagate = False
log.info("stage=ingest event=start")
print(buf.getvalue().strip())`,
          output: `INFO stage=ingest event=start`,
        },
      },
      {
        id: "S09-T3-A-E3",
        subtopicId: "S09-T3-A",
        kind: "transfer",
        instruction:
          "Convierte prints de un CLI stub a logs estructurados; stdout final solo con el resultado.",
        hint: "Progreso a logger; resultado con print o stdout data.",
        hints: [
          "Progreso a logger; resultado con print o stdout data.",
          "Debe verse un log INFO y la línea RESULT=3.",
        ],
        edgeCases: ["No mezclar progress en el stream de datos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "prints_to_logs.py",
          code: `import logging, io, sys

def cli_stub_bad(n):
    print("empezando")
    print("sumando")
    print(n + 1)

# TODO: cli_stub_good`,
        },
        solutionCode: {
          language: 'python',
          title: "prints_to_logs.py",
          code: `import logging, io

buf = io.StringIO()
log = logging.getLogger("cli")
log.handlers.clear()
log.setLevel(logging.INFO)
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(message)s"))
log.addHandler(h)
log.propagate = False

def cli_stub_good(n):
    log.info("event=start op=inc")
    result = n + 1
    log.info("event=done op=inc")
    print(f"RESULT={result}")

cli_stub_good(2)
print("LOGS:", buf.getvalue().replace("\\n", " | ").strip())`,
          output: `RESULT=3
LOGS: event=start op=inc | event=done op=inc |`,
        },
      },
      {
        id: "S09-T3-B-E1",
        subtopicId: "S09-T3-B",
        kind: "guided",
        instruction:
          "Implementa `mask_email` y `mask_phone` y demuéstralos con datos sintéticos peruanos.",
        hint: "email: primer char + ***@dominio; phone: *** + últimos 4 dígitos.",
        hints: [
          "email: primer char + ***@dominio; phone: *** + últimos 4 dígitos.",
          "Imprime ambas máscaras.",
        ],
        edgeCases: ["email sin @", "teléfono corto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "mask_helpers.py",
          code: `def mask_email(email: str) -> str:
    ...

def mask_phone(phone: str) -> str:
    ...

print(mask_email("carlos@ejemplo.pe"))
print(mask_phone("+51 988 777 666"))`,
        },
        solutionCode: {
          language: 'python',
          title: "mask_helpers.py",
          code: `def mask_email(email: str) -> str:
    local, _, domain = email.partition("@")
    if not domain:
        return "***"
    return f"{(local[:1] or '*')}***@{domain}"

def mask_phone(phone: str) -> str:
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) < 4:
        return "***"
    return "***" + digits[-4:]

print(mask_email("carlos@ejemplo.pe"))
print(mask_phone("+51 988 777 666"))`,
          output: `c***@ejemplo.pe
***7666`,
        },
      },
      {
        id: "S09-T3-B-E2",
        subtopicId: "S09-T3-B",
        kind: "independent",
        instruction:
          "Propaga `correlation_id` por 3 capas (cli → service → repo) e imprime el id en cada una.",
        hint: "Pasa el id como argumento explícito (sin global).",
        hints: [
          "Pasa el id como argumento explícito (sin global).",
          "Mismo id en las 3 líneas.",
        ],
        edgeCases: ["En apps reales: contextvars opcional; aquí explícito es más claro"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "correlation_layers.py",
          code: `def repo_save(corr, item):
    ...

def service_upsert(corr, item):
    ...

def cli_main(corr, item):
    ...

cli_main("corr-42", {"id": "C001"})`,
        },
        solutionCode: {
          language: 'python',
          title: "correlation_layers.py",
          code: `def repo_save(corr, item):
    print(f"repo correlation_id={corr} id={item['id']}")

def service_upsert(corr, item):
    print(f"service correlation_id={corr}")
    repo_save(corr, item)

def cli_main(corr, item):
    print(f"cli correlation_id={corr}")
    service_upsert(corr, item)

cli_main("corr-42", {"id": "C001"})`,
          output: `cli correlation_id=corr-42
service correlation_id=corr-42
repo correlation_id=corr-42 id=C001`,
        },
      },
      {
        id: "S09-T3-B-E3",
        subtopicId: "S09-T3-B",
        kind: "transfer",
        instruction:
          "Audita el snippet que loguea PII y reescríbelo de forma segura.",
        hint: "Detecta email/teléfono en el mensaje.",
        hints: [
          "Detecta email/teléfono en el mensaje.",
          "Imprime SAFE: y el log redactado.",
        ],
        edgeCases: ["No loguear address completa tampoco"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "audit_pii_log.py",
          code: `def unsafe_log(row):
    return f"error en {row['email']} tel={row['phone']}"

row = {"email": "a@ejemplo.pe", "phone": "999111222"}
print("UNSAFE", unsafe_log(row))
# TODO safe_log`,
        },
        solutionCode: {
          language: 'python',
          title: "audit_pii_log.py",
          code: `def mask_email(email: str) -> str:
    local, _, domain = email.partition("@")
    return f"{local[:1]}***@{domain}"

def mask_phone(phone: str) -> str:
    d = "".join(c for c in phone if c.isdigit())
    return "***" + d[-4:]

def unsafe_log(row):
    return f"error en {row['email']} tel={row['phone']}"

def safe_log(row):
    return f"error en {mask_email(row['email'])} tel={mask_phone(row['phone'])}"

row = {"email": "a@ejemplo.pe", "phone": "999111222"}
print("UNSAFE", unsafe_log(row))
print("SAFE", safe_log(row))`,
          output: `UNSAFE error en a@ejemplo.pe tel=999111222
SAFE error en a***@ejemplo.pe tel=***1222`,
        },
      },
      {
        id: "S09-T4-A-E1",
        subtopicId: "S09-T4-A",
        kind: "guided",
        instruction:
          "Clasifica 8 fallos en data|config|provider e imprime `fallo: clase`.",
        hint: "Config = arranque/schema; data = fila; provider = red/IO externo.",
        hints: [
          "Config = arranque/schema; data = fila; provider = red/IO externo.",
          "Sé consistente con la taxonomía de la teoría.",
        ],
        edgeCases: ["Un 400 del API por payload malo puede ser data; 503 es provider"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "taxonomy.py",
          code: `fallos = [
    "monto NaN en CSV",
    "YAML de config corrupto",
    "timeout S3",
    "email vacío en fila",
    "required_fields no definido",
    "HTTP 503 del proveedor",
    "dni con letras",
    "variable de entorno ROOT_PATH vacía",
]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "taxonomy.py",
          code: `clase = {
    "monto NaN en CSV": "data",
    "YAML de config corrupto": "config",
    "timeout S3": "provider",
    "email vacío en fila": "data",
    "required_fields no definido": "config",
    "HTTP 503 del proveedor": "provider",
    "dni con letras": "data",
    "variable de entorno ROOT_PATH vacía": "config",
}
for f, c in clase.items():
    print(f"{f}: {c}")`,
          output: `monto NaN en CSV: data
YAML de config corrupto: config
timeout S3: provider
email vacío en fila: data
required_fields no definido: config
HTTP 503 del proveedor: provider
dni con letras: data
variable de entorno ROOT_PATH vacía: config`,
        },
      },
      {
        id: "S09-T4-A-E2",
        subtopicId: "S09-T4-A",
        kind: "independent",
        instruction:
          "Implementa `process_batch` que envía filas sin `id` a quarantine y retorna conteos.",
        hint: "Retorno: ok, quarantined, in.",
        hints: [
          "Retorno: ok, quarantined, in.",
          "Reconciliación in = len(ok)+len(quarantined).",
        ],
        edgeCases: ["id=0 podría ser válido en otros dominios; aquí truthiness simple"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "process_batch.py",
          code: `def process_batch(rows):
    # TODO
    ...

rows = [{"id": 1}, {}, {"id": 2}]
print(process_batch(rows))`,
        },
        solutionCode: {
          language: 'python',
          title: "process_batch.py",
          code: `def process_batch(rows):
    ok, q = [], []
    for r in rows:
        if not r.get("id"):
            q.append({"row": r, "reason": "data:missing_id"})
        else:
            ok.append(r)
    return {"ok": ok, "quarantined": q, "in": len(rows)}

rows = [{"id": 1}, {}, {"id": 2}]
r = process_batch(rows)
print(r)
assert r["in"] == len(r["ok"]) + len(r["quarantined"])`,
          output: `{'ok': [{'id': 1}, {'id': 2}], 'quarantined': [{'row': {}, 'reason': 'data:missing_id'}], 'in': 3}`,
        },
      },
      {
        id: "S09-T4-A-E3",
        subtopicId: "S09-T4-A",
        kind: "transfer",
        instruction:
          "Escribe una política en 3 líneas: cuándo abortar el job (imprime POLICY:...).",
        hint: "Cubre config, umbral de cuarentena y provider total down.",
        hints: [
          "Cubre config, umbral de cuarentena y provider total down.",
          "Texto claro para operadores no dev.",
        ],
        edgeCases: ["El umbral 50% es ejemplo; documenta el de tu org"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "abort_policy.py",
          code: `# TODO: imprimir 3 reglas`,
        },
        solutionCode: {
          language: 'python',
          title: "abort_policy.py",
          code: `rules = [
    "POLICY: abortar si falta config crítica (schema, delimiter, paths)",
    "POLICY: abortar si quarantined/in > 0.5 en el lote",
    "POLICY: abortar si provider no responde tras retries; no abortar por 1 fila data",
]
for r in rules:
    print(r)`,
          output: `POLICY: abortar si falta config crítica (schema, delimiter, paths)
POLICY: abortar si quarantined/in > 0.5 en el lote
POLICY: abortar si provider no responde tras retries; no abortar por 1 fila data`,
        },
      },
      {
        id: "S09-T4-B-E1",
        subtopicId: "S09-T4-B",
        kind: "guided",
        instruction:
          "Tabla error → retry sí/no para 5 tipos e imprime `error: yes|no`.",
        hint: "Solo transitorios: TimeoutError, ConnectionError.",
        hints: [
          "Solo transitorios: TimeoutError, ConnectionError.",
          "ValueError/KeyError/PermissionError → no.",
        ],
        edgeCases: ["429 rate limit a veces yes con backoff"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "retry_table.py",
          code: `errores = ["TimeoutError", "ValueError", "ConnectionError", "KeyError", "PermissionError"]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "retry_table.py",
          code: `retry = {
    "TimeoutError": "yes",
    "ValueError": "no",
    "ConnectionError": "yes",
    "KeyError": "no",
    "PermissionError": "no",
}
for e, r in retry.items():
    print(f"{e}: {r}")`,
          output: `TimeoutError: yes
ValueError: no
ConnectionError: yes
KeyError: no
PermissionError: no`,
        },
      },
      {
        id: "S09-T4-B-E2",
        subtopicId: "S09-T4-B",
        kind: "independent",
        instruction:
          "Implementa `retry_call(fn, max_attempts=3)` que reintenta solo TimeoutError.",
        hint: "Devuelve el resultado o relanza el último TimeoutError.",
        hints: [
          "Devuelve el resultado o relanza el último TimeoutError.",
          "Cuenta intentos en un cierre.",
        ],
        edgeCases: ["max_attempts=1 no reintenta"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "retry_call.py",
          code: `def retry_call(fn, max_attempts=3):
    # TODO
    ...

n = {"c": 0}

def flaky():
    n["c"] += 1
    if n["c"] < 3:
        raise TimeoutError("x")
    return "done"

print(retry_call(flaky), "calls", n["c"])`,
        },
        solutionCode: {
          language: 'python',
          title: "retry_call.py",
          code: `def retry_call(fn, max_attempts=3):
    last = None
    for _ in range(max_attempts):
        try:
            return fn()
        except TimeoutError as e:
            last = e
    raise last

n = {"c": 0}

def flaky():
    n["c"] += 1
    if n["c"] < 3:
        raise TimeoutError("x")
    return "done"

print(retry_call(flaky), "calls", n["c"])`,
          output: `done calls 3`,
        },
      },
      {
        id: "S09-T4-B-E3",
        subtopicId: "S09-T4-B",
        kind: "transfer",
        instruction:
          "Diseña la clave de idempotencia para re-ingesta e imprímela para un ejemplo.",
        hint: "Incluye source, record_id y content_hash o version.",
        hints: [
          "Incluye source, record_id y content_hash o version.",
          "Formato: idem_key=...",
        ],
        edgeCases: ["Misma clave + mismo payload = skip; misma clave + payload distinto = conflicto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "idempotency_key.py",
          code: `record = {"source": "banco_a", "id": "C001", "version": 3, "payload": {"m": 1}}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "idempotency_key.py",
          code: `import hashlib, json
record = {"source": "banco_a", "id": "C001", "version": 3, "payload": {"m": 1}}
payload_hash = hashlib.sha256(
    json.dumps(record["payload"], sort_keys=True).encode()
).hexdigest()[:12]
key = f"{record['source']}:{record['id']}:v{record['version']}:{payload_hash}"
print("idem_key=" + key)`,
          output: `idem_key=banco_a:C001:v3:bc63c11b44d5`,
        },
      },
    ],
  },
  youDo: {
    title: "Bitácora auditable del pipeline (inicio CP-N1-C)",
    context:
      "Inicias **CP-N1-C**: una bitácora de pipeline que clasifica fallos (data|config|provider), emite logs estructurados con correlation_id y **nunca** registra PII completa. Datos sintéticos; sin claims de fraude. Reemplaza el legado de visualización Netflix EDA.",
    objectives: [
      "Clasificar fallos en data | config | provider",
      "Emitir logs estructurados con correlation_id",
      "Redactar email/teléfono/dirección completos",
      "Cuarentena de filas inválidas sin abortar el lote salvo config fatal",
      "Documentar política fail-fast vs continue en README",
    ],
    requirements: [
      "Módulo audit_log / process_batch con redact helpers",
      "process_batch(records) → {ok, quarantined, errors_by_class}",
      "Ningún log de demo contiene PII completa",
      "Dataset sintético; if __name__ == '__main__' demo reproducible",
      "Entorno local-python",
      "Sin matplotlib/seaborn en este incremento V3",
    ],
    starterCode: `"""Bitácora auditable del pipeline — inicio CP-N1-C.
Datos sintéticos only. Sin PII real. Sin claims de fraude.
"""
from __future__ import annotations
import logging
from typing import Any

def mask_email(email: str) -> str:
    local, _, domain = email.partition("@")
    return f"{(local[:1] or '*')}***@{domain}" if domain else "***"

def mask_phone(phone: str) -> str:
    digits = "".join(c for c in phone if c.isdigit())
    return "***" + digits[-4:] if len(digits) >= 4 else "***"

def classify_error(exc: BaseException) -> str:
    if isinstance(exc, (ValueError, KeyError)):
        return "data"
    if isinstance(exc, RuntimeError) and "config" in str(exc).lower():
        return "config"
    if isinstance(exc, TimeoutError):
        return "provider"
    return "data"

def process_batch(records: list[dict[str, Any]], correlation_id: str) -> dict:
    log = logging.getLogger("audit")
    ok, quarantined = [], []
    errors_by_class: dict[str, int] = {}
    for r in records:
        try:
            if not r.get("id"):
                raise ValueError("missing id")
            if "@" not in str(r.get("email", "")):
                raise ValueError("bad email")
            ok.append(r)
        except Exception as e:
            cls = classify_error(e)
            errors_by_class[cls] = errors_by_class.get(cls, 0) + 1
            quarantined.append({"id": r.get("id"), "reason": str(e), "class": cls})
            log.error(
                "correlation_id=%s error_class=%s email=%s",
                correlation_id,
                cls,
                mask_email(str(r.get("email", ""))),
            )
    return {
        "ok": ok,
        "quarantined": quarantined,
        "errors_by_class": errors_by_class,
    }

if __name__ == "__main__":
    logging.basicConfig(level=logging.ERROR)
    demo = [
        {"id": "C001", "email": "ana@ejemplo.pe", "phone": "999111222"},
        {"id": "C002", "email": "no-email", "phone": "999"},
        {"email": "x@ejemplo.pe"},
    ]
    print(process_batch(demo, "job-demo-1"))`,
    portfolioNote:
      "Muestra en README: 1 corrida con correlation_id, 1 log enmascarado, tabla de taxonomía data/config/provider y política de abort. Subraya privacidad.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Para qué sirve `raise NewError(...) from e`?",
        options: [
          "Ignorar el error original",
          "Encadenar la causa en __cause__ sin perder contexto",
          "Convertir todo a SystemExit",
          "Silenciar el traceback",
        ],
        correctIndex: 1,
        explanation:
          "from e preserva la excepción original como causa encadenada.",
      },
      {
        question: "Un delimiter vacío en config del job debería…",
        options: [
          "Cuarentenar una fila y seguir",
          "Fail-fast (abortar el job)",
          "Reintentar 3 veces siempre",
          "Loguear el row completo con PII",
        ],
        correctIndex: 1,
        explanation:
          "Fallos de config son fatales; no tiene sentido procesar el lote.",
      },
      {
        question: "¿Qué va a stdout en una CLI bien diseñada?",
        options: [
          "Logs DEBUG y el JSON de salida mezclados",
          "Solo datos; diagnóstico a stderr",
          "Solo tracebacks",
          "Secretos de config",
        ],
        correctIndex: 1,
        explanation:
          "Separar streams permite pipes limpios (S10 refuerza esto).",
      },
      {
        question: "mask_email('ana@ejemplo.pe') de forma segura podría ser…",
        options: [
          "ana@ejemplo.pe sin cambios",
          "a***@ejemplo.pe",
          "None",
          "El hash MD5 del password",
        ],
        correctIndex: 1,
        explanation:
          "Máscara parcial: accionable sin PII completa.",
      },
      {
        question: "TimeoutError en un fetch remoto típico…",
        options: [
          "Nunca se reintenta",
          "Puede reintentarse con backoff; ValueError de datos no",
          "Se convierte en KeyError",
          "Implica fraude",
        ],
        correctIndex: 1,
        explanation:
          "Solo errores transitorios merecen retry.",
      },
      {
        question: "¿Cuál es un buen minimal repro?",
        options: [
          "Todo el CSV de producción",
          "La entrada más pequeña que reproduce el bug",
          "Reiniciar el servidor tres veces",
          "Borrar los tests",
        ],
        correctIndex: 1,
        explanation:
          "Minimal repro acelera fix y test de regresión.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Errors and Exceptions — Python Tutorial",
        url: "https://docs.python.org/3/tutorial/errors.html",
        note: "raise, except, finally, chaining",
      },
      {
        label: "logging — Logging facility",
        url: "https://docs.python.org/3/library/logging.html",
        note: "loggers, handlers, levels",
      },
      {
        label: "traceback — Print or retrieve a stack",
        url: "https://docs.python.org/3/library/traceback.html",
        note: "diagnóstico sin filtrar secretos",
      },
    ],
    books: [
      {
        label: "Fluent Python (Ramalho) — excepciones/context managers",
        note: "Profundidad opcional post-S09.",
      },
      {
        label: "Python Cookbook — error handling recipes",
        note: "Patrones de re-raise y cleanup.",
      },
    ],
    courses: [
      {
        label: "Real Python — Logging",
        url: "https://realpython.com/python-logging/",
        note: "Estructura de logs; adaptar a redacción PII del curso.",
      },
    ],
  },
}
