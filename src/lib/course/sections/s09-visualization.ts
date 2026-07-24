import type { CourseSection } from '../../types'

export const section09: CourseSection = {
  id: "visualization",
  index: 9,
  title: "Excepciones, debugging y logging seguro",
  shortTitle: "Excepciones & logs",
  tagline: "Excepciones específicas, diagnóstico, logging sin PII y resiliencia del pipeline de familiaridad",
  estimatedHours: 19,
  level: "Intermedio",
  phase: 0,
  icon: "ShieldAlert",
  accentColor: "bg-gradient-to-br from-pink-500 to-rose-600",
  jobRelevance:
    "En pipelines de familiaridad y data engineering junior en Perú (bancos, fintech, retail, salud), un crash opaco o un log con email completo te cuesta incidentes, multas de cumplimiento y confianza del on-call. Tras el ETL de S08 (cuarentena + manifest), el gate siguiente es convertir fallos en **señales operables**: excepciones específicas, tracebacks legibles, **logging estructurado sin PII** y políticas de **fail-fast vs cuarentena**. Esta sección es el inicio operativo de **CP-N1-C**: bitácora auditable que un junior puede defender en code review y en un postmortem a las 02:00.",
  learningOutcomes: [
    { text: "Elegir tipos de excepción, raise con contexto y chaining con from" },
    { text: "Dibujar fronteras try/except/else/finally y with; separar recuperable vs fatal" },
    { text: "Leer tracebacks y ubicar el frame útil sin exponer secretos" },
    { text: "Reducir fallos a minimal repro con hipótesis y tests de regresión" },
    { text: "Configurar logging con niveles, campos estructurados y log.exception en ERROR" },
    { text: "Propagar correlation_id y redactar email/teléfono/dirección" },
    { text: "Decidir fail-fast vs cuarentena según data|config|provider" },
    { text: "Reintentar solo errores transitorios con operaciones idempotentes" },
  ],
  theory: [
    {
      heading: "Mapa: excepciones, diagnóstico, logs y resiliencia",
      paragraphs: [
        "En S08 dejaste un ETL con **cuarentena** y **manifest**. En producción eso no basta si el job muere con un traceback opaco o si el log de ERROR incluye el email completo del cliente. Esta sección arranca **CP-N1-C**: convertir fallos en **señales operables** — tipo de error, correlación y privacidad — sin claims de fraude ni parentesco.",
        "Hilo conductor: un **pipeline de intake sintético** (clientes `C00x`, emails `ejemplo.pe`, montos con `Decimal`). Validar filas, encadenar causas, **redactar PII** en logs y decidir **fail-fast** (config) vs **cuarentena** (data). Entorno **local-python**. Reutiliza normalizadores de S05–S07 y los conteos reconciliados de S08: cada fila en cuarentena debería poder llevar `error_class` y `correlation_id` para el postmortem.",
        "Imagina el job `ingest_clientes` de CASO-LIM-009 a las 02:10: el on-call ve un stack confuso, no sabe si reintentar el proveedor o cuarentenar una fila, y en Slack aparece un email completo. Al cerrar S09 sabrás clasificar el fallo, enmascarar PII y dejar una bitácora que otra persona pueda seguir sin adivinar.",
        "Orden de aprendizaje: **T1 Excepciones** (tipos, raise, fronteras) → **T2 Diagnóstico** (traceback, minimal repro) → **T3 Logging** (niveles, correlation_id, redacción) → **T4 Resiliencia** (fail-fast vs cuarentena, retries idempotentes). S10 empaquetará este vocabulario en un CLI con handlers limpios; aquí construyes el contrato operativo del pipeline.",
      ],
      callout: {
        type: "info",
        title: "Inicio CP-N1-C",
        content:
          "Gate operativo: bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia fallo de datos, configuración y proveedor. Sin claims de fraude ni parentesco.",
      },
    },
    {
      heading: "Tipos específicos, raise y chaining",
      subtopicId: "S09-T1-A",
      paragraphs: [
        "Prefiere **tipos concretos**: `ValueError` (valor ilegal), `TypeError` (tipo incorrecto), `KeyError` (clave ausente), `OSError`/`FileNotFoundError` (I/O). Un `except Exception` genérico **oculta la causa** y complica el triage del on-call: el operador ve «algo falló» y no sabe si reintentar, cuarentenar o abortar.",
        "`raise ValueError('monto no numérico: …')` da contexto accionable. Para montos del intake: **`Decimal` desde texto**, `quantize(Decimal('0.01'))`, rechazo de no finitos — **nunca** `float`. Con **`raise NewError(...) from e`** encadenas la causa en `__cause__` sin perder el traceback original: el parse falla y la validación de fila lo envuelve.",
        "Una **custom Exception ligera** (`class DataLoadError(Exception): ...`) nombra el borde de tu capa sin reinventar la jerarquía de la stdlib. En CASO-LIM-009, el mensaje lleva `id` de fila y el valor problemático **redactado** si es PII: accionable en el postmortem, inofensivo en el canal de Slack del equipo.",
      ],
      code: {
        language: 'python',
        title: "raise_chain.py",
        code: `from decimal import Decimal, InvalidOperation

class ValidationError(Exception):
    pass

class ParseError(Exception):
    pass

def parse_monto(raw: object) -> Decimal:
    try:
        value = Decimal(str(raw).strip().replace(",", ".")).quantize(Decimal("0.01"))
        if not value.is_finite():
            raise InvalidOperation
        return value
    except (InvalidOperation, ValueError) as e:
        raise ParseError(f"no parseable: {raw!r}") from e

def validate_row(row: dict) -> Decimal:
    try:
        m = parse_monto(row["monto"])
    except ParseError as e:
        raise ValidationError(f"fila {row.get('id')}: monto inválido") from e
    if m < Decimal("0"):
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
          "Incluye id de fila y el valor problemático (redactado si es PII). No digas solo «error». El monto válido sigue siendo Decimal con dos decimales.",
      },
    },
    {
      heading: "Fronteras de recuperación y cleanup",
      subtopicId: "S09-T1-B",
      paragraphs: [
        "`try/except/else/finally` dibuja el borde del job: **else** corre solo si no hubo excepción (camino feliz legible); **finally** siempre (cleanup de handles). El `with` hace lo mismo de forma idiomática vía context managers: no dejes archivos abiertos en el crash path del intake.",
        "No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide en el borde: **manejar** (recuperable: fila mala del CSV) vs **propagar** (fatal: config inválida). `except Exception: pass` es la forma más rápida de esconder corrupción de datos en producción.",
        "Config rota → **fail-fast** (abortar antes de multiplicar basura). Fila de datos inválida → **cuarentena** y continúa el lote, como el manifest de S08. El borde del job es un **contrato operativo** que el on-call debe poder leer en el README, no un gusto de estilo del autor del script.",
      ],
      code: {
        language: 'python',
        title: "boundaries.py",
        code: `from io import StringIO

def read_lote(text: str, config_ok: bool) -> list[str]:
    if not config_ok:
        raise RuntimeError("config inválida: delimiter vacío")
    with StringIO(text) as handle:
        lineas = [ln.strip() for ln in handle if ln.strip()]
    print("cleanup: handle cerrado (with)")
    return lineas

def procesar_lote(text: str) -> None:
    try:
        lineas = read_lote(text, True)
    except RuntimeError:
        raise
    else:
        print("lote legible", lineas)
    finally:
        print("finally: contadores listos")

procesar_lote("a\\nb\\n")
try:
    read_lote("x", False)
except RuntimeError as e:
    print("fatal:", e)`,
        output: `cleanup: handle cerrado (with)
lote legible ['a', 'b']
finally: contadores listos
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
        "Un **traceback** lista frames del más reciente al más profundo (o viceversa según la herramienta). El frame útil suele ser **tu código**, no el de la stdlib: en el job de intake empieza por la última línea de `normalize` o `validate`, no por el interior de `csv` o `logging`. Si el stack solo muestra la librería, sube un frame hasta tu módulo del pipeline.",
        "`breakpoint()` / `pdb` inspeccionan variables en vivo cuando tienes TTY local. En demos, CI y el entorno del curso usamos **`traceback.format_exc` + prints controlados** (solo `id` de fila, nunca el row completo) porque no siempre hay sesión interactiva. El hábito es el mismo: mirar locals seguros, no volcar el diccionario crudo del cliente sintético.",
        "Al loguear stacks, **nunca** imprimas secretos ni PII completa que haya en locals (email, token, password). **Redacta** o omite: un traceback con `password=...` o `email=lucia@…` es un incidente de cumplimiento, no un log útil. CASO-LIM-009 exige el mismo cuidado que la bitácora de T3: diagnóstico accionable sin filtrar datos personales al canal de ops.",
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
        output: `File "<string>", line 8, in process
File "<string>", line 4, in normalize
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
        "**Minimal repro**: reduce un lote de 200 filas sintéticas a la **menor entrada** que dispara el bug. Facilita tests de regresión, code review y el postmortem sin arrastrar PII real ni ruido de otras columnas del CSV de intake. En CASO-LIM-009, un fallo de apellidos no exige el archivo completo: basta la cadena mínima que rompe el parser.",
        "Formula **hipótesis falsables** («si el apellido2 vacío rompe el join, entonces con apellido2='X' pasa»). Descartar una hipótesis es progreso: no te cases con la primera intuición del on-call a las 02:00. Anota cada hipótesis en la bitácora del incidente para que el siguiente turno no repita el mismo camino ciego.",
        "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo en el siguiente PR. 5-whys ligero: no pares en el síntoma («KeyError email») — pregunta si el schema del lote de S08 realmente exige esa clave en todas las filas o si el productor omitió un campo opcional sin documentarlo.",
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
    except ValueError as e:
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
        "Niveles: **DEBUG** (detalle dev), **INFO** (progreso del job), **WARNING** (anomalía recuperable: fila opcional rara), **ERROR** (fallo de una unidad que cuarentenarás o reintentarás), **CRITICAL** (el proceso o el lote entero está en peligro: config rota, disco lleno). No loguees ERROR para filas esperables de cuarentena si WARNING basta: el ruido entierra el incidente real en el dashboard de ops.",
        "Usa un **Logger de módulo** (`logging.getLogger(__name__)`) en vez de configurar el root a ciegas en cada helper. Handlers y formatters se arman **una vez** en el entrypoint del CLI (preview suave de S10). En el camino de ERROR dentro de un `except`, `log.exception(...)` o `exc_info=True` adjuntan el traceback al mensaje estructurado sin perder `correlation_id` ni forzar un `print` del stack.",
        "Logs **estructurados** (`key=value` o JSON) con campos estables (`stage`, `record_id`, `correlation_id`, `duration_ms`, `error_class`) se filtran en agregadores y en el postmortem. Un `print(\"ok\")` suelto no escala a prod ni a la bitácora de **CP-N1-C**: no tiene nivel, no tiene correlation_id y se pierde en el stdout del pipe.",
        "Caso sintético CASO-LIM-009: el job `ingest_clientes` falla a las 02:10. Sin campos `stage`/`record_id`, el on-call no une el WARNING de la fila C014 con el ERROR del provider. Con mensajes `stage=normalize record_id=C014 event=parse_fail` y nivel correcto, el triage tarda minutos, no horas — y aún no has tocado PII (eso es T3-B).",
      ],
      code: {
        language: 'python',
        title: "structured_log.py",
        code: `import logging
import io

def demo_logger():
    buf = io.StringIO()
    log = logging.getLogger("pipeline.demo")
    log.handlers.clear()
    log.setLevel(logging.INFO)
    h = logging.StreamHandler(buf)
    h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
    log.addHandler(h)
    log.propagate = False
    log.info("stage=normalize record_id=C001 event=start")
    log.info("stage=normalize record_id=C001 event=done duration_ms=7")
    log.warning("stage=normalize record_id=C002 event=missing_optional field=email")
    log.error("stage=normalize record_id=C003 event=parse_fail field=monto")
    return buf.getvalue()

print(demo_logger())`,
        output: `INFO stage=normalize record_id=C001 event=start
INFO stage=normalize record_id=C001 event=done duration_ms=7
WARNING stage=normalize record_id=C002 event=missing_optional field=email
ERROR stage=normalize record_id=C003 event=parse_fail field=monto`,
      },
      callout: {
        type: "tip",
        title: "Campos estables",
        content:
          "Acuerda un vocabulario (stage, correlation_id, error_class). El reloj se inyecta en demos/tests para obtener un oráculo estable; en producción usa time.perf_counter_ns.",
      },
    },
    {
      heading: "Correlation IDs y redacción de PII",
      subtopicId: "S09-T3-B",
      paragraphs: [
        "Un **correlation_id** (o request_id) viaja por capas (CLI → service → repo) como argumento explícito para unir logs del mismo job o lote. Sin él, el postmortem de las 02:10 es arqueología: no sabes si el WARNING de la fila C014 y el ERROR del provider pertenecen a la misma corrida de intake.",
        "**Nunca** loguees email, teléfono o dirección **completos**. Usa máscaras estables: `a***@ejemplo.pe`, `***4567`, dirección reducida a ciudad o `***`. Un ERROR con el row completo es un incidente de cumplimiento (y de confianza del cliente), no un «log detallado» útil. En CASO-LIM-009, con `corr-9c2e` y email enmascarado el canal de ops actúa en minutos sin filtrar PII a Slack.",
        "Helpers `mask_email` / `mask_phone` / `mask_address` deben ser el **único** camino hacia los logs; un audit de código falla si alguien hace `log.info(row)` o formatea f-strings con el email crudo. Redacta **antes** del format string. En el `except`, combina redacción con `log.exception(...)` para forensics (stack + correlation_id) sin exponer datos personales.",
      ],
      code: {
        language: 'python',
        title: "redact_pii.py",
        code: `import logging
import io

def mask_email(email: str) -> str:
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

def parse_monto(raw: str) -> float:
    return float(raw)  # demo: fuerza ValueError con texto

buf = io.StringIO()
log = logging.getLogger("pipeline.pii")
log.handlers.clear()
log.setLevel(logging.ERROR)
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
log.addHandler(h)
log.propagate = False

corr = "job-7f3a"
email = "ana.rojas@ejemplo.pe"
try:
    parse_monto("N/A")
except ValueError:
    log.exception(
        "correlation_id=%s stage=validate error_class=data email=%s",
        corr,
        mask_email(email),
    )
out = buf.getvalue()
# solo la primera línea del log (sin el traceback largo en el oráculo)
print(out.splitlines()[0])
print(f"phone={mask_phone('+51 999 123 4567')}")`,
        output: `ERROR correlation_id=job-7f3a stage=validate error_class=data email=a***@ejemplo.pe
phone=***4567`,
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
        "Taxonomía del intake: **data** (fila sucia del CSV), **config** (delimiter, schema path, env `ROOT_PATH` vacía), **provider** (timeout S3, HTTP 503). La **política difiere** por clase: no trates un timeout del proveedor igual que un monto inválido — el primero puede reintentarse (T4-B); el segundo va a cuarentena con `error_class=data` y el lote sigue.",
        "**Fail-fast** en config: seguir con schema roto multiplica basura y envenena el **manifest de S08**. **Cuarentena** en data: una fila mala **no** debe tumbar el lote entero — el mismo gate de reconciliación (`in == ok + quarantined`), ahora con `error_class` y `correlation_id` explícitos en cada rechazo para el postmortem de CP-N1-C.",
        "Éxito parcial es válido si el manifest cuadra. Documenta la política en el README del job y **cierra en fallo** (**fail closed**: no publiques resultados si el reconcile no cuadra). Mejor abortar con ERROR/CRITICAL claro que entregar conteos mentirosos al dashboard de familiaridad o a un informe regulatorio sintético del lab.",
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
        "**Retry solo errores transitorios** (`TimeoutError`, HTTP 503, red). Un `ValueError` de datos **no** se reintenta: va a **cuarentena**. Reintentar un monto inválido no lo hace válido y solo gasta cuota del proveedor y ruido en los logs de ERROR del job de intake.",
        "Operaciones **idempotentes** (misma clave de escritura) permiten re-correr un job sin duplicar side-effects. Clave típica: `(source, record_id, version)` — el mismo espíritu del manifest de S08, ahora a nivel de re-ingesta tras un retry o un redeploy nocturno.",
        "Backoff simple (sleep creciente) reduce el **thundering herd** (muchos workers reintentando a la vez y saturando el proveedor). Tras `max_attempts` → cuarentena o fail-fast según la política del README. **Nunca** retries infinitos en prod: un bucle eterno es un incidente disfrazado de resiliencia.",
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
          code: `from decimal import Decimal, InvalidOperation

class ParseError(Exception):
    pass

class ValidationError(Exception):
    pass

def parse_monto(raw: object) -> Decimal:
    try:
        monto = Decimal(str(raw).strip().replace(",", ".")).quantize(Decimal("0.01"))
        if not monto.is_finite():
            raise InvalidOperation
        return monto
    except (InvalidOperation, ValueError) as e:
        raise ParseError(f"monto no parseable: {raw!r}") from e

def validate_intake(row: dict) -> dict:
    try:
        monto = parse_monto(row.get("monto"))
    except ParseError as e:
        raise ValidationError(f"id={row.get('id')}: validación falló") from e
    if monto < Decimal("0"):
        raise ValidationError(f"id={row.get('id')}: monto negativo")
    return {"id": row["id"], "monto": monto}

print(validate_intake({"id": "C001", "monto": "12,50"}))
try:
    validate_intake({"id": "C002", "monto": "N/A"})
except ValidationError as e:
    print(type(e).__name__, "->", e)
    print("cause", type(e.__cause__).__name__, e.__cause__)`,
          output: `{'id': 'C001', 'monto': Decimal('12.50')}
ValidationError -> id=C002: validación falló
cause ParseError monto no parseable: 'N/A'`,
        },
        why: "El chaining preserva la causa de parse al subir a validación de dominio.",
      },
      {
        demoId: "S09-T1-B-DEMO",
        subtopicId: "S09-T1-B",
        environment: "local-python",
        description: "Leer lote con `with` + `else`/`finally`; re-raise si config inválida.",
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
    with StringIO(payload) as handle:
        return [ln.rstrip("\\n") for ln in handle]

try:
    filas = leer_lote("fila1\\nfila2\\n", "utf-8")
except ConfigError:
    raise
else:
    print("ok", filas)
finally:
    print("finally: contadores listos")

try:
    leer_lote("x", None)
except ConfigError as e:
    print("fatal config:", e)`,
          output: `ok ['fila1', 'fila2']
finally: contadores listos
fatal config: encoding requerido`,
        },
        why: "with cierra el handle; else marca el camino feliz; finally corre siempre; config inválida se propaga.",
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
except KeyError:
    tb = traceback.format_exc()
    print("error: KeyError 'email'")
    for line in tb.splitlines():
        if "normalize_email" in line or "run_batch" in line or "KeyError" in line:
            print(line.strip())`,
          output: `error: KeyError 'email'
File "<string>", line 7, in run_batch
File "<string>", line 4, in normalize_email
KeyError: 'email'`,
        },
        why: "El frame útil es normalize_email: falta la clave email en C002; format_exc muestra texto de frame legible.",
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
          code: `import logging, io

buf = io.StringIO()
log = logging.getLogger("familiarity.pipeline")
log.handlers.clear()
log.setLevel(logging.INFO)
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
log.addHandler(h)
log.propagate = False

def stage_normalize(record_id: str, clock_ns) -> None:
    t0 = clock_ns()
    log.info("stage=normalize record_id=%s event=start", record_id)
    _ = record_id.lower()
    ms = (clock_ns() - t0) // 1_000_000
    log.info(
        "stage=normalize record_id=%s event=done duration_ms=%s",
        record_id, ms,
    )

ticks = iter([1_000_000_000, 1_007_000_000])
stage_normalize("C001", lambda: next(ticks))
print(buf.getvalue().strip())`,
          output: `INFO stage=normalize record_id=C001 event=start
INFO stage=normalize record_id=C001 event=done duration_ms=7`,
        },
        why: "Campos estables permiten filtrar por stage y record_id en operación.",
      },
      {
        demoId: "S09-T3-B-DEMO",
        subtopicId: "S09-T3-B",
        environment: "local-python",
        description: "log.exception con email enmascarado, correlation_id y stack en el ERROR path.",
        code: {
          language: 'python',
          title: "masked_error_log.py",
          code: `import logging, io

def mask_email(email: str) -> str:
    local, _, domain = email.partition("@")
    return f"{(local[:1] or '*')}***@{domain}" if domain else "***"

def parse_email(raw: str) -> str:
    if "@" not in raw:
        raise ValueError("email sin @")
    return raw.lower()

buf = io.StringIO()
log = logging.getLogger("familiarity.audit")
log.handlers.clear()
log.setLevel(logging.ERROR)
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
log.addHandler(h)
log.propagate = False

corr = "corr-9c2e"
raw_email = "lucia.mendez@ejemplo.pe"
try:
    parse_email("no-es-email")
except ValueError:
    log.exception(
        "correlation_id=%s stage=validate error_class=data email=%s",
        corr,
        mask_email(raw_email),
    )
lines = buf.getvalue().splitlines()
print(lines[0])  # línea ERROR estructurada (sin PII completa)
assert "lucia.mendez" not in buf.getvalue()
assert "l***@ejemplo.pe" in lines[0]
print("has_traceback", any("ValueError" in ln for ln in lines))
print("pii_completa_ausente=True")`,
          output: `ERROR correlation_id=corr-9c2e stage=validate error_class=data email=l***@ejemplo.pe
has_traceback True
pii_completa_ausente=True`,
        },
        why: "log.exception une diagnóstico (stack) con correlation_id y máscara de PII en un solo ERROR path.",
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
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Ejecuta y compara con la solución. Solo stdlib; datos sintéticos; sin PII real.",
    steps: [
      {
        id: "S09-T1-A-E1",
        subtopicId: "S09-T1-A",
        kind: "guided",
        instruction:
          "Mapea los 5 fallos sintéticos del starter (CASO-LIM-009 intake) al tipo de excepción más adecuado e imprime cada línea como `fallo -> Tipo` en el orden del array. No uses Exception genérico para todos; incluye un `ValidationError` de dominio para la regla de negocio (monto < 0).",
        hint: "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
        hints: [
          "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
          "Usa TypeError, ValueError, KeyError, FileNotFoundError y un custom ValidationError.",
        ],
        edgeCases: ["No uses Exception genérico para todos", "FileNotFoundError es subclase de OSError"],
        tests: "Contrato exacto: 5 líneas `… -> Tipo` en el orden del starter (ValueError, TypeError, KeyError, FileNotFoundError, ValidationError); exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "map_exceptions.py",
          code: `# CASO-LIM-009 · map fallo → Exception
# A corregir: todo ValueError
fallos = [
    "int('x')",
    "sumar str + int",
    "dict sin clave email",
    "abrir archivo inexistente",
    "regla de negocio: monto < 0",
]
for f in fallos:
    print(f, "->", "ValueError")
print('ok', True)`,
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
          "Implementa `parse_monto(raw)` con `Decimal`: normaliza coma decimal, cuantiza a 0.01 y hace raise ValueError con mensaje accionable si no parsea, no es finito o es negativo.",
        hint: "Decimal desde str; captura InvalidOperation. Mensaje debe incluir el raw.",
        hints: [
          "Decimal desde str; captura InvalidOperation. Mensaje debe incluir el raw.",
          "Rechaza NaN/Infinity con is_finite y compara contra Decimal('0').",
        ],
        edgeCases: ["'' vacío", "None", "NaN", "Infinity"],
        tests: "Contrato exacto: 10.5→Decimal('10.50'); 3,25→Decimal('3.25'); abc da 'monto no numérico'; -1 da 'monto negativo'; NaN e Infinity fallan; no se permite float().",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `# CASO-LIM-009 · parse_monto Decimal
# A corregir: float; no cuarentena
from decimal import Decimal, InvalidOperation

def parse_monto(raw):
    return float(raw)

for v in ['10.5', 'x', '-1']:
    try:
        print('ok', parse_monto(v))
    except Exception as e:
        print('err', type(e).__name__)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `from decimal import Decimal, InvalidOperation

def parse_monto(raw):
    try:
        n = Decimal(str(raw).strip().replace(",", ".")).quantize(Decimal("0.01"))
        if not n.is_finite():
            raise InvalidOperation
    except (InvalidOperation, ValueError):
        raise ValueError(f"monto no numérico: {raw!r}") from None
    if n < Decimal("0"):
        raise ValueError(f"monto negativo no permitido: {n}")
    return n

for v in ["10.5", "3,25", "abc", "-1"]:
    try:
        print(v, "->", parse_monto(v))
    except ValueError as e:
        print(v, "ERR", e)`,
          output: `10.5 -> 10.50
3,25 -> 3.25
abc ERR monto no numérico: 'abc'
-1 ERR monto negativo no permitido: -1.00`,
        },
      },
      {
        id: "S09-T1-A-E3",
        subtopicId: "S09-T1-A",
        kind: "transfer",
        instruction:
          "Define `DataLoadError` y `load_text(path_fn)` que captura `OSError` del lector (callable que simula open) y re-lanza `DataLoadError` con `raise ... from e`. Imprime el tipo del error y de `__cause__` (CASO-LIM-009 intake).",
        hint: "path_fn es un callable que simula open y puede lanzar OSError.",
        hints: [
          "path_fn es un callable que simula open y puede lanzar OSError.",
          "Imprime type del error y de __cause__.",
        ],
        edgeCases: ["PermissionError también es OSError"],
        tests: "Contrato exacto: stdout muestra DataLoadError + mensaje y OSError como __cause__; exit 0; no dejes raise sin `from e`.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "data_load_chain.py",
          code: `# CASO-LIM-009 · DataLoadError chain
# A corregir: raise sin from e
class DataLoadError(Exception):
    pass

def load_text(path_fn):
    try:
        return path_fn()
    except FileNotFoundError as e:
        raise DataLoadError("load failed")

try:
    load_text(lambda: (_ for _ in ()).throw(FileNotFoundError("missing")))
except DataLoadError as e:
    print(type(e).__name__, e.__cause__)
print('ok', True)`,
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
          "Completa el `finally` en `work` para marcar `state['closed']=True` aunque haya excepción. El camino feliz imprime ok; el fallo propaga RuntimeError y aún así deja closed True (CASO-LIM-009).",
        hint: "El flag `closed` debe quedar True siempre.",
        hints: [
          "El flag `closed` debe quedar True siempre.",
          "Usa try/finally; no captures la excepción en el camino de fail si quieres re-raise.",
        ],
        edgeCases: ["finally corre antes de propagar"],
        tests: "Contrato exacto: primera línea `ok {'closed': True}`; segunda tras capturar: `err {'closed': True}`; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "finally_close.py",
          code: `# CASO-LIM-009 · finally close
# A corregir: no finally; closed False en fail
state = {"closed": False}

def work(fail: bool):
    try:
        if fail:
            raise RuntimeError("boom")
        return "ok"
    except RuntimeError:
        return "err"
    # sin finally

print(work(False), state)
print(work(True), state)
print('ok', True)`,
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
          "Clasifica los 6 errores del starter en `recover` o `fail-fast` e imprime cada uno como `nombre: política`. Config/secretos → fail-fast; fila mala/parse/timeout de un record → recover (CASO-LIM-009).",
        hint: "Config y secretos ausentes → fail-fast. Fila mala / parse → recover.",
        hints: [
          "Config y secretos ausentes → fail-fast. Fila mala / parse → recover.",
          "Timeout de red de un registro puede ser recover+retry (marca recover).",
        ],
        edgeCases: ["recover no significa ignorar: cuarentena o retry"],
        tests: "Contrato exacto: 6 líneas `…: fail-fast|recover` en el orden del starter; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "classify_errors.py",
          code: `# CASO-LIM-009 · fail-fast vs recover
# A corregir: todo recover
errores = [
    "delimiter vacío en config",
    "monto no numérico en fila",
    "schema_path no existe",
    "email mal formado en fila",
    "API_TOKEN ausente",
    "timeout leyendo un record remoto",
]
for e in errores:
    print(f"{e}: recover")
print('ok', True)`,
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
          "Refactoriza `good_handler`: captura solo `ValueError` (cuarentena) y deja propagar el resto (p. ej. RuntimeError de config). No uses `except:` bare ni tragues Exception genérico (CASO-LIM-009).",
        hint: "No uses except desnudo.",
        hints: [
          "No uses except desnudo.",
          "Imprime bad vs good_v quarantine y good_r raised según el caso.",
        ],
        edgeCases: ["Exception aún es amplio; preferir tipos de dominio en prod"],
        tests: "Contrato exacto: bad traga ambos; good_v → quarantine; good_r re-lanza RuntimeError capturado como raised; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "refactor_bare_except.py",
          code: `# CASO-LIM-009 · bare except
# A corregir: good_handler igual de traga-todo
def bad_handler(fn):
    try:
        return ("ok", fn())
    except Exception:
        return ("swallowed", None)

def good_handler(fn):
    try:
        return ("ok", fn())
    except Exception:
        return ("swallowed", None)

def v():
    raise ValueError("monto")

print(bad_handler(v))
print(good_handler(v))
print('ok', True)`,
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
          "Dado el traceback sintético del starter (CASO-LIM-009), anota 3 frames (nombre de función) de afuera hacia adentro e imprime `frame1`, `frame2`, `frame3`. No re-ejecutes el código original: parsea el texto.",
        hint: "Busca líneas 'File' o patrones 'in nombre'.",
        hints: [
          "Busca líneas 'File' o patrones 'in nombre'.",
          "Imprime frame1, frame2, frame3 (main, run, normalize).",
        ],
        edgeCases: ["most recent call last: el último frame es el más profundo"],
        tests: "Contrato exacto: frame1 main; frame2 run; frame3 normalize; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "annotate_frames.py",
          code: `# CASO-LIM-009 · parse traceback frames
# A corregir: no extrae frames
tb = '''Traceback (most recent call last):
  File "cli.py", line 10, in main
    run()
  File "pipeline.py", line 4, in run
    normalize(row)
  File "normalize.py", line 2, in normalize
    return row["email"]
KeyError: 'email'
'''
print(tb.splitlines()[0])
print('ok', True)`,
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
          "Simula un breakpoint en `normalize`: si falta `email`, con DEBUG imprime locals seguros (solo `id`, sin row completo/PII) y lanza `KeyError('email')` (CASO-LIM-009).",
        hint: "No imprimas el row completo si pudiera tener PII.",
        hints: [
          "No imprimas el row completo si pudiera tener PII.",
          "Usa un flag DEBUG; formato: break locals id= …",
        ],
        edgeCases: ["En prod real usa logging + correlation_id"],
        tests: "Contrato exacto: línea `break locals id= C009` y `raised 'email'`; exit 0; sin volcar PII.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "simulate_breakpoint.py",
          code: `# CASO-LIM-009 · DEBUG locals
# A corregir: no raise KeyError; devuelve None
DEBUG = True

def normalize(row: dict) -> str:
    return row.get("email")

try:
    print(normalize({"id": "C009"}))
except KeyError as e:
    print("raised", e)
print('ok', True)`,
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
          "Solo con el traceback del starter (sin re-ejecutar el código original), imprime la causa raíz en una frase: función + clave faltante. Formato: `causa_raiz=normalize falta clave email`.",
        hint: "No re-ejecutes el código original; parsea el texto.",
        hints: [
          "No re-ejecutes el código original; parsea el texto.",
          "Formato: causa_raiz=normalize falta clave email",
        ],
        edgeCases: ["No culpes a cli.py si el bug está en normalize"],
        tests: "Contrato exacto: una línea `causa_raiz=normalize falta clave email`; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "root_from_tb.py",
          code: `# CASO-LIM-009 · last exception line
# A corregir: imprime todo el tb
tb = '''Traceback (most recent call last):
  File "app.py", line 1, in <module>
    normalize({"id": 1})
  File "app.py", line 1, in normalize
    return row["email"].lower()
KeyError: 'email'
'''
print(tb)
print('ok', True)`,
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
          "Recorta la fixture a la primera fila mínima que hace fallar `parse_dni` (DNI peruano sintético: 8 dígitos). Imprime `minimal=` y re-ejecuta solo ese caso para mostrar el ValueError (CASO-LIM-009).",
        hint: "Encuentra el primer fallido y re-ejecuta solo ese.",
        hints: [
          "Encuentra el primer fallido y re-ejecuta solo ese.",
          "Imprime minimal=... y el mensaje dni inválido.",
        ],
        edgeCases: ["Puede haber varios fallos; el mínimo del primer fallo basta para el test"],
        tests: "Contrato exacto: `minimal= 123` y línea `dni inválido: '123'`; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "crop_fixture.py",
          code: `# CASO-LIM-009 · minimal failing fixture
# A corregir: no encuentra primer fail
def parse_dni(d: str) -> str:
    if not (d.isdigit() and len(d) == 8):
        raise ValueError(f"dni inválido: {d!r}")
    return d

fixture = ["12345678", "123", "87654321", "12AB5678"]
minimal = fixture[0]
print("minimal", minimal)
print('ok', True)`,
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
          "Un reporte afirma que `normalize_phone` perdió el código de país +51. Formula 2 hipótesis y experimentos que distingan el símbolo `+` de los dígitos de país `51`, según el contrato de S07.",
        hint: "El formato normalizado contiene solo dígitos: debe conservar 51, no el carácter +.",
        hints: [
          "El formato normalizado contiene solo dígitos: debe conservar 51, no el carácter +.",
          "Compara +51 999 111 222 con 999 111 222 para aislar el prefijo de país.",
        ],
        edgeCases: ["Hipótesis falsables", "prefijo 51", "espacios"],
        tests: "Contrato exacto: '+51 999 111 222'→'51999111222'; '999 111 222'→'999111222'; afirmar country_digits_preserved=True y plus_symbol_expected=False.",
        feedback: "S07 definió salida solo-dígitos: retirar '+' no es perder el código de país si los dígitos 51 permanecen.",
        starterCode: {
          language: 'python',
          title: "hypotheses.py",
          code: `# CASO-LIM-009 · phone hypothesis
# A corregir: strip espacio sin digits-only
def normalize_phone(p: str) -> str:
    return p.replace(" ", "").replace("+", "")

with_country = normalize_phone("+51 999 111 222")
local = normalize_phone("999 111 222")
print("with_country", with_country)
print("local", local)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "hypotheses.py",
          code: `def normalize_phone(p: str) -> str:
    return "".join(c for c in p if c.isdigit())

with_country = normalize_phone("+51 999 111 222")
local = normalize_phone("999 111 222")
print("with_country", with_country)
print("local", local)
print("country_digits_preserved", with_country.startswith("51"))
print("plus_symbol_expected", False)`,
          output: `with_country 51999111222
local 999111222
country_digits_preserved True
plus_symbol_expected False`,
        },
      },
      {
        id: "S09-T2-B-E3",
        subtopicId: "S09-T2-B",
        kind: "transfer",
        instruction:
          "Añade un test de regresión para nombres latam: `bad_title` con `.title()` debe fallar en rojo; `good_title` preserva partículas `de/la` y pasa en verde. Imprime RED, pass y GREEN (CASO-LIM-009).",
        hint: "Imprime RED luego GREEN.",
        hints: [
          "Imprime RED luego GREEN.",
          "Bug: title() capitaliza De/La; el assert espera 'Juan de la Cruz'.",
        ],
        edgeCases: ["title() capitaliza De/La incorrectamente para nombres latam"],
        tests: "Contrato exacto: líneas RED, pass, GREEN en ese orden; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "regression_test.py",
          code: `# CASO-LIM-009 · title particles
# A corregir: good_title = title()
def bad_title(s: str) -> str:
    return s.title()

def good_title(s: str) -> str:
    return s.title()

def test(fn):
    out = fn("juan de la cruz")
    print(fn.__name__, out)

test(bad_title)
test(good_title)
print('ok', True)`,
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
          "Asigna el nivel correcto (DEBUG/INFO/WARNING/ERROR) a los 6 eventos del starter e imprime cada uno como `evento: NIVEL`. Progreso → INFO; detalle de loop → DEBUG; fila opcional rara → WARNING; fallo de unidad/config → ERROR.",
        hint: "Progreso normal → INFO; detalle de loop → DEBUG; fila rara → WARNING; fallo de unidad → ERROR.",
        hints: [
          "Progreso normal → INFO; detalle de loop → DEBUG; fila rara → WARNING; fallo de unidad → ERROR.",
          "Config inválida al arrancar también ERROR (o CRITICAL; usa ERROR aquí).",
        ],
        edgeCases: ["WARNING no es ERROR si el job continúa"],
        tests: "Contrato exacto: 6 líneas `…: DEBUG|INFO|WARNING|ERROR` en el orden del starter; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "assign_levels.py",
          code: `# CASO-LIM-009 · log levels
# A corregir: todo INFO
eventos = [
    "job iniciado",
    "valor de variable i en loop",
    "fila sin email opcional",
    "no se pudo parsear monto",
    "archivo de config ilegible",
    "lote terminado con conteos",
]
for e in eventos:
    print(f"{e}: INFO")
print('ok', True)`,
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
          "Configura un logger de módulo con `StreamHandler` a un `StringIO` (`propagate=False`) y emite un INFO estructurado `stage=ingest event=start`. Imprime el buffer; no uses print como log de progreso (CASO-LIM-009).",
        hint: "propagate=False; formatter simple.",
        hints: [
          "propagate=False; formatter simple `%(levelname)s %(message)s`.",
          "Mensaje: stage=ingest event=start",
        ],
        edgeCases: ["Limpiar handlers en demos evita duplicados"],
        tests: "Contrato exacto: una línea `INFO stage=ingest event=start`; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "module_logger.py",
          code: `# CASO-LIM-009 · logger INFO
# A corregir: print en vez de log; no handler
import logging, io
print("INFO job_start")
print("DEBUG i=0")
print('ok', True)`,
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
          "Convierte los prints de progreso del CLI stub a logs estructurados; el stdout de datos debe mostrar solo `RESULT=3` y, aparte, un resumen de logs (event=start/done). No mezcles progreso con el stream de datos (preview S10).",
        hint: "Progreso a logger; resultado con print o stdout data.",
        hints: [
          "Progreso a logger; resultado con print o stdout data.",
          "Debe verse RESULT=3 y LOGS con event=start / event=done.",
        ],
        edgeCases: ["No mezclar progress en el stream de datos"],
        tests: "Contrato exacto: `RESULT=3` y línea LOGS con event=start y event=done; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "prints_to_logs.py",
          code: `# CASO-LIM-009 · logging vs print CLI
# A corregir: cli_stub_good = print
import logging, io, sys

def cli_stub_bad(n):
    print("empezando")
    print("sumando")
    print(n + 1)

def cli_stub_good(n):
    print("empezando")
    print("sumando")
    print(n + 1)

cli_stub_good(1)
print('ok', True)`,
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
          "Implementa `mask_email` y `mask_phone` y demuéstralos con datos sintéticos peruanos del starter (`carlos@ejemplo.pe`, `+51 988 777 666`). Email: primer char + ***@dominio; phone: *** + últimos 4 dígitos.",
        hint: "email: primer char + ***@dominio; phone: *** + últimos 4 dígitos.",
        hints: [
          "email: primer char + ***@dominio; phone: *** + últimos 4 dígitos.",
          "Imprime ambas máscaras en dos líneas.",
        ],
        edgeCases: ["email sin @", "teléfono corto"],
        tests: "Contrato exacto: `c***@ejemplo.pe` y `***7666`; exit 0; sin PII completa en stdout.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "mask_helpers.py",
          code: `# CASO-LIM-009 · mask PII
# A corregir: devuelve raw
def mask_email(email: str) -> str:
    return email

def mask_phone(phone: str) -> str:
    return phone

print(mask_email("carlos@ejemplo.pe"))
print(mask_phone("+51 988 777 666"))
print('ok', True)`,
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
          "Propaga `correlation_id` por 3 capas (cli → service → repo) como argumento explícito (sin global) e imprime el mismo id en cada capa. Fixture: `corr-42`, item `C001` (CASO-LIM-009).",
        hint: "Pasa el id como argumento explícito (sin global).",
        hints: [
          "Pasa el id como argumento explícito (sin global).",
          "Mismo id en las 3 líneas: cli, service, repo.",
        ],
        edgeCases: ["En apps reales: contextvars opcional; aquí explícito es más claro"],
        tests: "Contrato exacto: tres líneas con correlation_id=corr-42 (cli, service, repo id=C001); exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "correlation_layers.py",
          code: `# CASO-LIM-009 · correlation_id
# A corregir: no propaga corr
def repo_save(corr, item):
    print(f"repo id={item['id']}")

def service_upsert(corr, item):
    print("service")
    repo_save(corr, item)

def cli_main(corr, item):
    print("cli")
    service_upsert(corr, item)

cli_main("corr-42", {"id": "C001"})
print('ok', True)`,
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
          "Audita una plantilla de log insegura buscando placeholders de PII (`{email}`, `{phone}`) sin ejecutar el formato con datos reales; luego emite solo el log seguro redactado. Fixture CASO-LIM-009: email `a@ejemplo.pe`, phone `999111222`.",
        hint: "Revisa el string plantilla, no el row completo en stdout.",
        hints: [
          "Define template_unsafe = 'error en {email} tel={phone}' y busca '{email}' / '{phone}' en ese texto.",
          "Imprime 'detected_unsafe True' y 'SAFE error en a***@ejemplo.pe tel=***1222' sin volcar PII raw.",
        ],
        edgeCases: ["No loguear address completa tampoco", "No uses internals de bytecode (__code__)"],
        tests: "Contrato exacto: stdout contiene 'detected_unsafe True' y 'SAFE error en a***@ejemplo.pe tel=***1222'; stdout no contiene a@ejemplo.pe ni 999111222.",
        feedback: "Una auditoría de logging no debe volver a filtrar la PII que intenta detectar; basta con escanear la plantilla.",
        starterCode: {
          language: 'python',
          title: "audit_pii_log.py",
          code: `# CASO-LIM-009 · plantilla insegura vs log seguro
# El starter aún formatea con PII raw: corrige safe_log y la detección.

template_unsafe = "error en {email} tel={phone}"

def mask_email(email: str) -> str:
    return email  # TODO: enmascarar

def mask_phone(phone: str) -> str:
    return phone  # TODO: enmascarar

def safe_log(row):
    return template_unsafe.format(**row)

row = {"email": "a@ejemplo.pe", "phone": "999111222"}
print("detected_unsafe", False)
print("SAFE", safe_log(row))
print("ok", True)`,
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

template_unsafe = "error en {email} tel={phone}"
detected = "{email}" in template_unsafe and "{phone}" in template_unsafe

def safe_log(row):
    return f"error en {mask_email(row['email'])} tel={mask_phone(row['phone'])}"

row = {"email": "a@ejemplo.pe", "phone": "999111222"}
print("detected_unsafe", detected)
print("SAFE", safe_log(row))`,
          output: `detected_unsafe True
SAFE error en a***@ejemplo.pe tel=***1222`,
        },
      },
      {
        id: "S09-T4-A-E1",
        subtopicId: "S09-T4-A",
        kind: "guided",
        instruction:
          "Clasifica los **8** fallos del starter en data|config|provider e imprime cada uno como `fallo: clase` (dos puntos, no flecha). Orden del starter; fixture CASO-LIM-009.",
        hint: "Config = arranque/schema/env; data = fila; provider = red/IO externo.",
        hints: [
          "Config = arranque/schema/env; data = fila; provider = red/IO externo.",
          "Sé consistente con la taxonomía de la teoría T4-A; ROOT_PATH vacía es config.",
        ],
        edgeCases: ["Un 400 del API por payload malo puede ser data; 503 es provider"],
        tests: "Contrato exacto: 8 líneas `…: data|config|provider` en el orden del starter (incluye ROOT_PATH); sin flechas `->`; exit 0.",
        feedback: "Compara tu salida con la solución: 8 líneas data|config|provider alineadas al starter completo.",
        starterCode: {
          language: 'python',
          title: "taxonomy.py",
          code: `# CASO-LIM-009 · classify failure (8 casos)
# Starter marca todo como data: corrige la clase de cada fallo.
fallos = [
    "monto NaN en CSV",
    "YAML de config corrupto",
    "timeout S3",
    "email vacío en fila",
    "required_fields no definido",
    "HTTP 503 del proveedor",
    "dni con letras",
    "variable de entorno ROOT_PATH vacía",
]
for f in fallos:
    print(f"{f}: data")
print("ok", True)`,
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
          "Implementa `process_batch` que envía filas sin `id` a `quarantined` (con reason) y retorna `{ok, quarantined, in}`. Reconcilia `in == len(ok)+len(quarantined)` (CASO-LIM-009, eco de S08).",
        hint: "Retorno: ok, quarantined, in.",
        hints: [
          "Retorno: ok, quarantined, in.",
          "Reconciliación in = len(ok)+len(quarantined); no descartes filas en silencio.",
        ],
        edgeCases: ["id=0 podría ser válido en otros dominios; aquí truthiness simple"],
        tests: "Contrato exacto: dict con 2 ok, 1 quarantined reason data:missing_id, in=3; assert de reconcile; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "process_batch.py",
          code: `# CASO-LIM-009 · quarantine batch
# A corregir: drop rows without quarantine list
def process_batch(rows):
    ok = [r for r in rows if r.get("id")]
    return {"ok": ok, "quarantined": [], "in": len(rows)}

rows = [{"id": "C1"}, {}, {"id": "C2"}]
print(process_batch(rows))
print('ok', True)`,
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

rows = [{"id": "C1"}, {}, {"id": "C2"}]
r = process_batch(rows)
print(r)
assert r["in"] == len(r["ok"]) + len(r["quarantined"])`,
          output: `{'ok': [{'id': 'C1'}, {'id': 'C2'}], 'quarantined': [{'row': {}, 'reason': 'data:missing_id'}], 'in': 3}`,
        },
      },
      {
        id: "S09-T4-A-E3",
        subtopicId: "S09-T4-A",
        kind: "transfer",
        instruction:
          "Escribe una política operativa en 3 líneas `POLICY:...`: cuándo abortar por config crítica, por umbral de cuarentena y por provider caído tras retries. Texto claro para operadores (no solo dev).",
        hint: "Cubre config, umbral de cuarentena y provider total down.",
        hints: [
          "Cubre config, umbral de cuarentena y provider total down.",
          "No abortes por una sola fila data; sí por config o provider agotado.",
        ],
        edgeCases: ["El umbral 50% es ejemplo; documenta el de tu org"],
        tests: "Contrato exacto: 3 líneas POLICY: (config, umbral quarantined/in, provider tras retries); exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "abort_policy.py",
          code: `# CASO-LIM-009 · abort policies
# A corregir: abort por 1 fila data
rules = [
    "POLICY: abortar si falta 1 fila email",
    "POLICY: nunca abortar por config",
]
for r in rules:
    print(r)
print('ok', True)`,
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
          "Completa la tabla error → retry (`yes`/`no`) para los 5 tipos del starter e imprime `error: yes|no`. Solo transitorios (TimeoutError, ConnectionError) se reintentan; ValueError/KeyError/PermissionError → no.",
        hint: "Solo transitorios: TimeoutError, ConnectionError.",
        hints: [
          "Solo transitorios: TimeoutError, ConnectionError.",
          "ValueError/KeyError/PermissionError → no.",
        ],
        edgeCases: ["429 rate limit a veces yes con backoff"],
        tests: "Contrato exacto: TimeoutError yes; ValueError no; ConnectionError yes; KeyError no; PermissionError no; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "retry_table.py",
          code: `# CASO-LIM-009 · retry matrix
# A corregir: reintenta ValueError/KeyError
retry = {
    "TimeoutError": "yes",
    "ValueError": "yes",
    "ConnectionError": "yes",
    "KeyError": "yes",
    "PermissionError": "yes",
}
for e, r in retry.items():
    print(f"{e}: {r}")
print('ok', True)`,
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
          "Implementa `retry_call(fn, max_attempts=3)` que reintenta solo `TimeoutError` (backoff opcional) y relanza el último si agota intentos. Con el flaky del starter debe imprimir `done calls 3` (CASO-LIM-009).",
        hint: "Devuelve el resultado o relanza el último TimeoutError.",
        hints: [
          "Devuelve el resultado o relanza el último TimeoutError.",
          "Cuenta intentos en un cierre o contador externo.",
        ],
        edgeCases: ["max_attempts=1 no reintenta"],
        tests: "Contrato exacto: `done calls 3` (o equivalente con done y 3 intentos); exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "retry_call.py",
          code: `# CASO-LIM-009 · retry_call
# A corregir: un solo attempt
def retry_call(fn, max_attempts=3):
    return fn()

n = {"c": 0}

def flaky():
    n["c"] += 1
    if n["c"] < 3:
        raise TimeoutError("x")
    return "done"

try:
    print(retry_call(flaky))
except TimeoutError as e:
    print("failed", e)
print('ok', True)`,
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
          "Diseña la clave de idempotencia para re-ingesta e imprímela como `idem_key=...` para el record del starter. Incluye source, record_id, version y hash del payload (eco del manifest S08).",
        hint: "Incluye source, record_id y content_hash o version.",
        hints: [
          "Incluye source, record_id y content_hash o version.",
          "Formato: idem_key=source:id:vN:hash12",
        ],
        edgeCases: ["Misma clave + mismo payload = skip; misma clave + payload distinto = conflicto"],
        tests: "Contrato exacto: una línea `idem_key=banco_a:C001:v3:` + 12 hex del payload; exit 0.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "idempotency_key.py",
          code: `# CASO-LIM-009 · idempotency key
# A corregir: key sin version/hash
import hashlib, json
record = {"source": "banco_a", "id": "C001", "version": 3, "payload": {"m": 1}}
key = f"{record['id']}"
print(key)
print('ok', True)`,
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
      "Inicias **CP-N1-C**: una bitácora de pipeline que clasifica fallos (data|config|provider), emite logs estructurados con correlation_id y **nunca** registra PII completa. Usa solo datos sintéticos; sin claims de fraude ni parentesco.",
    objectives: [
      "Clasificar fallos en data | config | provider",
      "Emitir logs estructurados con correlation_id",
      "Redactar email/teléfono/dirección completos",
      "Cuarentena de filas inválidas sin abortar el lote salvo config fatal",
      "Documentar política fail-fast vs continue en README",
      "Reconciliar conteos in == ok + quarantined y cubrir con tests mínimos",
    ],
    requirements: [
      "Módulo audit_log / process_batch con helpers de redacción (email, phone, address)",
      "process_batch(records, correlation_id, config) → {ok, quarantined, errors_by_class, in}",
      "Fail-fast si falta config['required_fields']; cuarentena de filas de datos inválidas",
      "Ningún log de demo contiene PII completa",
      "assert len(ok) + len(quarantined) == in en la demo",
      "Dataset sintético; if __name__ == '__main__' demo reproducible",
      "Al menos 3 tests en test_audit_log.py (máscaras, fail-fast config, reconcile)",
      "Solo stdlib (logging, decimal si aplica); sin librerías de gráficos",
      "Entorno local-python",
    ],
    starterCode: `"""Bitácora auditable del pipeline — inicio CP-N1-C.
Solo datos sintéticos. Sin PII real. Sin claims de fraude.

TODO del estudiante (el starter NO es la solución):
1) Implementar mask_address
2) Fail-fast si config["required_fields"] falta o es None
3) Completar process_batch: errors_by_class, campo in, reconcile
4) Logs con correlation_id + email/phone/address redactados
5) tests en test_audit_log.py (mínimo 3)
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


def mask_address(address: str) -> str:
    # TODO: enmascarar (p. ej. conservar solo ciudad o "***")
    raise NotImplementedError("implementa mask_address")


def classify_error(exc: BaseException) -> str:
    # TODO: data | config | provider según tipo/mensaje
    raise NotImplementedError("implementa classify_error")


def process_batch(
    records: list[dict[str, Any]],
    correlation_id: str,
    config: dict[str, Any],
) -> dict:
    """Debe fallar rápido si required_fields ausente; cuarentenar filas data."""
    log = logging.getLogger("audit")
    # TODO: fail-fast config; loop de filas; log.error redactado; errors_by_class
    raise NotImplementedError(
        "implementa process_batch: fail-fast + cuarentena + logs sin PII"
    )


if __name__ == "__main__":
    logging.basicConfig(level=logging.ERROR)
    demo = [
        {
            "id": "C001",
            "email": "ana@ejemplo.pe",
            "phone": "999111222",
            "address": "Av. Ejemplo 123, Lima",
        },
        {
            "id": "C002",
            "email": "no-email",
            "phone": "999",
            "address": "Jr. Prueba 1",
        },
        {"email": "x@ejemplo.pe", "address": "Sin id"},
    ]
    # Cuando completes process_batch, descomenta y verifica reconcile:
    # result = process_batch(demo, "job-demo-1", {"required_fields": ["id", "email"]})
    # assert result["in"] == len(result["ok"]) + len(result["quarantined"])
    # print(result)
    print("scaffold listo — implementa las funciones TODO")`,
    portfolioNote:
      "Muestra en README: 1 corrida con correlation_id, 1 log enmascarado (email/teléfono/dirección), tabla de taxonomía data/config/provider, política de abort y evidencia de tests. Subraya privacidad.",
    rubric: [
      { criterion: "Bitácora auditable: taxonomía + correlation_id + redaction verificable", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado (fail-fast + cuarentena + reconcile)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos en logs", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (≥3 tests)", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional (README de política)", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Para qué sirve `raise NewError(...) from e`?",
        options: ["Encadenar la causa en __cause__ sin perder contexto", "Ignorar el error original", "Convertir todo a SystemExit", "Silenciar el traceback"],
        correctIndex: 0,
        explanation:
          "from e preserva la excepción original como causa encadenada.",
      },
      {
        question: "Un delimiter vacío en config del job debería…",
        options: ["Cuarentenar una fila y seguir", "Reintentar 3 veces siempre", "Fail-fast (abortar el job)", "Loguear el row completo con PII"],
        correctIndex: 2,
        explanation:
          "Fallos de config son fatales; no tiene sentido procesar el lote.",
      },
      {
        question: "¿Qué va a stdout en una CLI bien diseñada?",
        options: ["Logs DEBUG y el JSON de salida mezclados", "Solo tracebacks", "Secretos de config", "Solo datos; diagnóstico a stderr"],
        correctIndex: 3,
        explanation:
          "Separar streams permite pipes limpios (S10 refuerza esto).",
      },
      {
        question: "mask_email('ana@ejemplo.pe') de forma segura podría ser…",
        options: ["ana@ejemplo.pe sin cambios", "a***@ejemplo.pe", "None", "El hash MD5 del password"],
        correctIndex: 1,
        explanation:
          "Máscara parcial: accionable sin PII completa.",
      },
      {
        question: "TimeoutError en un fetch remoto típico…",
        options: ["Puede reintentarse con backoff; ValueError de datos no", "Nunca se reintenta", "Se convierte en KeyError", "Implica fraude"],
        correctIndex: 0,
        explanation:
          "Solo errores transitorios merecen retry.",
      },
      {
        question: "¿Cuál es un buen minimal repro?",
        options: ["Todo el CSV de producción", "Reiniciar el servidor tres veces", "La entrada más pequeña que reproduce el bug", "Borrar los tests"],
        correctIndex: 2,
        explanation:
          "Minimal repro acelera fix y test de regresión.",
      },
      {
        question: "¿Por qué es dañino un `except:` bare (sin tipo)?",
        options: [
          "Traga también KeyboardInterrupt/SystemExit y esconde corrupción",
          "Es más rápido que ValueError",
          "Obliga a usar Decimal",
          "Solo funciona en Windows",
        ],
        correctIndex: 0,
        explanation:
          "Bare except captura casi todo, incluso señales de interrupción, y oculta la causa real del fallo.",
      },
      {
        question: "¿Cuándo corre el bloque `finally`?",
        options: [
          "Solo si hubo excepción",
          "Solo en el camino feliz",
          "Siempre: con éxito, con except y al re-raise",
          "Solo si usas `with`",
        ],
        correctIndex: 2,
        explanation:
          "finally garantiza cleanup (cierre de handles, contadores) en todos los caminos de salida del try.",
      },
      {
        question: "¿Para qué sirve propagar un `correlation_id` por capas?",
        options: [
          "Unir logs del mismo job/lote en el postmortem",
          "Cifrar el email del cliente",
          "Reemplazar el traceback",
          "Marcar fraude automáticamente",
        ],
        correctIndex: 0,
        explanation:
          "El correlation_id enlaza CLI → service → repo sin necesidad de PII completa en cada línea de log.",
      },
      {
        question: "¿Cuándo preferirías CRITICAL frente a ERROR en el job de intake?",
        options: [
          "Cuando una sola fila tiene monto inválido y va a cuarentena",
          "Cuando el proceso o el lote entero está en peligro (config rota, recurso crítico caído)",
          "Siempre que uses log.exception",
          "Solo en DEBUG local",
        ],
        correctIndex: 1,
        explanation:
          "ERROR cubre fallos de unidad recuperables o cuarentenables; CRITICAL señala que el job/proceso no puede continuar de forma segura.",
      },
      {
        question: "¿Qué ventaja dan los campos estructurados (`stage=… record_id=…`) frente a un `print(\"ok\")`?",
        options: [
          "Permiten filtrar y correlacionar eventos en agregadores y postmortems",
          "Cifran automáticamente la PII del row",
          "Reemplazan la necesidad de tests de regresión",
          "Convierten todo ValueError en TimeoutError",
        ],
        correctIndex: 0,
        explanation:
          "Campos estables (stage, record_id, correlation_id, error_class) hacen el log consultable; un print suelto no tiene nivel ni correlación.",
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
        note: "loggers, handlers, levels, exception()",
      },
      {
        label: "traceback — Print or retrieve a stack",
        url: "https://docs.python.org/3/library/traceback.html",
        note: "diagnóstico sin filtrar secretos",
      },
      {
        label: "pdb — The Python Debugger",
        url: "https://docs.python.org/3/library/pdb.html",
        note: "breakpoint() e inspección",
      },
      {
        label: "contextlib — Utilities for with",
        url: "https://docs.python.org/3/library/contextlib.html",
        note: "cleanup y context managers",
      },
      {
        label: "PEP 3134 — Exception Chaining",
        url: "https://peps.python.org/pep-3134/",
        note: "raise ... from e",
      },
      {
        label: "OWASP Logging Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
        note: "Qué no loguear (PII, secretos) y contexto mínimo útil para forensics",
      },
    ],
    books: [
      {
        label: "Fluent Python (Ramalho) — excepciones/context managers",
        url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
        note: "Profundidad opcional post-S09.",
      },
      {
        label: "Python Cookbook — error handling recipes",
        url: "https://www.oreilly.com/library/view/python-cookbook-3rd/9781449357337/",
        note: "Patrones de re-raise y cleanup.",
      },
    ],
    courses: [
      {
        label: "Real Python — Logging",
        url: "https://realpython.com/python-logging/",
        note: "Estructura de logs; adaptar a redacción PII del curso.",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Excepciones y debugging",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Errores y tests",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Manejo de errores",
      },
    ],
  },
}
