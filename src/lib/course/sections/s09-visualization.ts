import type { CourseSection } from '../../types'

export const section09: CourseSection = {
  id: "visualization",
  index: 9,
  title: "Excepciones, debugging y logging seguro",
  shortTitle: "Excepciones & logs",
  tagline: "Excepciones específicas, diagnóstico, logging sin datos personales expuestos y resiliencia del pipeline de familiaridad",
  estimatedHours: 9,
  level: "Intermedio",
  phase: 0,
  icon: "ShieldAlert",
  accentColor: "bg-gradient-to-br from-pink-500 to-rose-600",
  jobRelevance:
    "En bancos, fintech, retail o salud en Perú, un crash opaco o un log con email completo te cuesta incidentes, multas de cumplimiento y la confianza del on-call (la persona de guardia que responde alertas fuera de horario). Aquí aprendes a convertir fallos en señales operables: excepciones específicas, tracebacks legibles, logging estructurado sin PII (datos personales como email, teléfono o dirección) y políticas de fail-fast (abortar pronto si la configuración está rota) versus cuarentena (aislar la fila mala y seguir). Construyes una bitácora auditable que puedes defender en code review y en un post mórtem (la revisión posterior a un incidente) a las 02:00.",
  learningOutcomes: [
    { text: "Elegir tipos de excepción, raise con contexto y chaining con from" },
    { text: "Dibujar fronteras try/except/else/finally y with; separar recuperable vs. fatal" },
    { text: "Leer tracebacks y ubicar el frame útil sin exponer secretos" },
    { text: "Reducir fallos a minimal repro con hipótesis y tests de regresión" },
    { text: "Configurar logging con niveles, campos estructurados y log.exception en ERROR" },
    { text: "Propagar correlation_id y enmascarar email, teléfono y dirección" },
    { text: "Decidir fail-fast vs. cuarentena según data|config|provider" },
    { text: "Reintentar solo errores transitorios con operaciones idempotentes" },
  ],
  theory: [
    {
            heading: "Las dos y diez de la mañana",
      paragraphs: [
        "El trabajo `ingest_clientes` falló a las 02:10. Quien está de guardia abre el registro y encuentra sesenta líneas de traza que terminan en `KeyError: 'monto'`. Con eso no sabe lo esencial: si el problema es una fila mala que debería apartarse, una variable de configuración que alguien cambió ayer, o el proveedor que está caído y basta con reintentar. Baja un poco más y encuentra otra cosa: el correo completo de un cliente, impreso en el mensaje de error y ahora visible en el canal donde llegan las alertas.",
        "Esta sección convierte esos fallos en señales que se pueden usar. La primera pieza es que el tipo de error ya es un diagnóstico. Cuando defines excepciones propias —una para el dato inválido, otra para la configuración incompleta, otra para el proveedor que no responde— el nombre del error contesta la pregunta de las 02:10 antes de leer una sola línea de traza. Elegir bien ese nombre vale más que cualquier mensaje largo.",
        "La segunda es que un fallo casi nunca ocurre donde se nota. Una traza se lee de abajo hacia arriba, y conviene saber qué hay en cada extremo. Abajo está el error y, justo encima, la línea que lo lanzó: casi siempre es ahí donde está el problema. Hacia arriba están las llamadas que llevaron hasta ese punto, hasta la primera de todas. Es decir, abajo el qué falló y arriba el cómo llegaste. Y cuando encadenas una excepción sobre otra conservas las dos, porque «no pude convertir el monto» y «no pude procesar el archivo del proveedor» son piezas distintas de la misma historia.",
        "La tercera es que el registro tiene que servir sin traicionar a nadie. Un identificador de correlación —un valor que acompaña a todo lo que ocurre durante una misma corrida, casi siempre una cadena como un UUID o `corr-9c2e`, no un número— permite reunir después todas las líneas de ese trabajo, incluso entre miles de otros. Y antes de escribir cualquier cosa, los datos personales se enmascaran: `a***@ejemplo.pe` basta para reconocer un caso y no expone a la persona. Un registro que no se puede compartir no sirve para depurar en equipo.",
        "Queda una decisión que se toma una vez y se respeta siempre: qué merece detener el programa. Si la configuración está mal, todo lo que venga después será basura, así que se falla de inmediato. Si una fila viene mal, el resto del archivo sigue siendo bueno, así que se aparta y se continúa. Confundir las dos produce los dos peores resultados posibles: un proceso que se cae por una fila, o un proceso que procesa mil archivos con la configuración equivocada.",
        "La pregunta que ordena la sección es la de esa persona de guardia: **¿qué puede hacer con esto alguien que no escribió el código, a las dos de la mañana, sin poder preguntarte?** El hilo es el mismo intake sintético de siempre, con los conteos reconciliados de S08 detrás: cada fila apartada debería poder llevar su clase de error y su identificador de correlación para el análisis del día siguiente.",
      ],
      callout: {
        type: "info",
        title: "Inicio CP-N1-C",
        content:
          "Gate operativo: bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia **fallos** de datos, configuración y proveedor. Sin claims de fraude ni parentesco.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, criterio de cierre y límites.",
        "**Orden de los subtemas.** T1 trata las excepciones: tipos, `raise` y fronteras. T2 pasa al diagnóstico: lectura de trazas y reproducción mínima. T3 cubre el registro: niveles, identificador de correlación y enmascarado. T4 cierra con la resiliencia: fallar rápido frente a apartar en cuarentena, y reintentos que se puedan repetir sin duplicar nada.",
        "**Criterio de cierre (inicio CP-N1-C).** Una bitácora auditable que nunca registre correo, teléfono ni dirección completos, y que distinga los fallos de datos, de configuración y de proveedor.",
        "**Qué integra y hacia dónde va.** Reutiliza los normalizadores de S05 a S07 y los conteos reconciliados de S08. En S10 este vocabulario se empaqueta en una CLI con manejadores limpios; aquí se construye el contrato operativo.",
        "**Límites.** Caso `CASO-LIM-009` con datos sintéticos: clientes `C00x`, correos `@ejemplo.pe` y montos en `Decimal`. Nunca datos personales reales ni afirmaciones de fraude o parentesco.",
      ],
     },
     {
      heading: "Tipos específicos, raise y chaining",
      subtopicId: "S09-T1-A",
      paragraphs: [
        "Prefiere **tipos concretos**: `ValueError` (valor ilegal), `TypeError` (tipo incorrecto), `KeyError` (clave ausente), `OSError`/`FileNotFoundError` (I/O). Un `except Exception` amplio no borra por sí solo el traceback, pero mezcla políticas distintas y complica el triage. Si lo usas en el borde del proceso para registrar un fallo inesperado, conserva la excepción y vuelve a lanzarla.",
        "`raise ValueError('monto no numérico: …')` da contexto accionable. Para montos del intake: **`Decimal` desde texto**, `quantize(Decimal('0.01'))`, rechazo de no finitos — **nunca** `float`. Con **`raise NewError(...) from e`** encadenas la causa en `__cause__` sin perder el traceback original: el parse falla y la validación de fila lo envuelve.",
        "Una **excepción personalizada ligera** (`class DataLoadError(Exception): ...`) nombra el borde de tu capa sin reinventar la jerarquía de la stdlib. En CASO-LIM-009, el mensaje lleva el `id` de fila y el valor problemático **enmascarado** si contiene datos personales: accionable en el post mórtem, inofensivo en el canal de Slack del equipo.",
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
          "Incluye el id de fila y el valor problemático (enmascarado si contiene datos personales). No digas solo «error». El monto válido sigue siendo Decimal con dos decimales.",
      },
    },
    {
      heading: "Fronteras de recuperación y cleanup",
      figure: {
        id: "S09-failfast",
        caption:
          "La frontera no es una convención de estilo: después de decidir ya no queda fila que mandar a cuarentena, solo un resumen que corregir.",
        alt:
          "Cuatro etapas en fila —leer, parsear, validar, decidir— unidas por flechas, con una línea vertical punteada entre parsear y validar marcada como el punto tras el cual la fila ya no puede enviarse a cuarentena.",
      },
      subtopicId: "S09-T1-B",
      paragraphs: [
        "`try/except/else/finally` dibuja el borde del job: **else** corre solo si no hubo excepción (camino feliz legible, p. ej. «lote legible»); **finally** siempre (cleanup de handles y contadores). El `with` hace lo mismo de forma idiomática vía context managers. No dejes un `StringIO`/archivo abierto en el crash path del intake CASO-LIM-009.",
        "No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide en el borde: **manejar** (recuperable: fila mala del CSV) vs. **propagar** (fatal: config inválida, encoding vacío). `except Exception: pass` es la forma más rápida de esconder corrupción de datos en producción y de mentir al on-call.",
        "Config rota → **fail-fast** (abortar antes de multiplicar basura en el lote). Fila de datos inválida → **cuarentena** y continúa, como el **manifest de S08** con conteos reconciliados. El borde del job es un **contrato operativo** que el on-call debe poder leer en el README del pipeline, no un gusto de estilo del autor del script.",
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
      figure: {
        id: "S09-error-boundary",
        caption:
          "Atrapar Exception en el origen borra el tipo; atraparlo todo en la frontera pierde el contexto de dónde ocurrió.",
        alt:
          "Tres capas apiladas: origen, capa de dominio y frontera de recuperación.",
      },
      subtopicId: "S09-T2-A",
      paragraphs: [
        "Un **traceback** lista frames del más reciente al más profundo (o viceversa según la herramienta). El frame útil suele ser **tu código**, no el de la stdlib: en el job de intake empieza por la última línea de `normalize` o `validate`, no por el interior de `csv` o `logging`. Si el stack solo muestra la librería, sube un frame hasta tu módulo del pipeline.",
        "`breakpoint()` / `pdb` inspeccionan variables en vivo cuando tienes TTY local. En demos, CI y el entorno del curso usamos **`traceback.format_exc` + prints controlados** (solo `id` de fila, nunca el row completo) porque no siempre hay sesión interactiva. El hábito es el mismo: mirar locals seguros, no volcar el diccionario crudo del cliente sintético.",
        "Al registrar stacks, **nunca** imprimas secretos ni datos personales completos que haya en las variables locales (email, token, password). **Enmascara** u omite: un traceback con `password=...` o `email=lucia@…` es un incidente de cumplimiento, no un log útil. CASO-LIM-009 exige el mismo cuidado que la bitácora de T3: diagnóstico accionable sin filtrar datos personales al canal de operaciones.",
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
        "**Minimal repro**: reduce un lote sintético a la **menor entrada** que dispara el bug. Facilita tests de regresión, code review y el post mórtem sin arrastrar PII real ni ruido de otras columnas del CSV de intake. En CASO-LIM-009, un fallo de apellidos no exige el archivo completo: basta `SoloNombre` (o la cadena mínima) que rompe el parser.",
        "Formula **hipótesis falsables** («si el apellido2 vacío rompe el join, entonces con apellido2='X' pasa»). Ojo: un nombre con 3 tokens puede **no lanzar** y aun así truncar mal el segundo apellido — ese bug silencioso no aparece en el `except`; el minimal repro del ValueError es el de 1 token. Descartar una hipótesis es progreso: anótala en la bitácora del incidente.",
        "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo en el siguiente PR. 5-whys ligero: no pares en el síntoma («KeyError email»). Pregunta si el schema del lote de S08 realmente exige esa clave en todas las filas o si el productor omitió un campo opcional sin documentarlo.",
      ],
      code: {
        language: 'python',
        title: "minimal_repro.py",
        code: `def split_apellidos(nombre: str) -> tuple[str, str]:
    parts = nombre.split()
    if len(parts) < 2:
        raise ValueError("faltan apellidos")
    # bug silencioso: con 3+ tokens descarta el resto (no lanza)
    return parts[0], parts[1]

# lote sintético: casi todos "Nombre Apellido"; uno con 1 token falla
lote = [f"Cliente{i} Perez" for i in range(5)] + ["Maria Lopez Garcia", "SoloNombre"]
bad = []
for n in lote:
    try:
        split_apellidos(n)
    except ValueError as e:
        bad.append((n, type(e).__name__))
# minimal repro = la entrada más corta que dispara el ValueError
print("bad in lote:", bad)
minimal = min((n for n, _ in bad), key=len)
try:
    split_apellidos(minimal)
except ValueError as e:
    print("minimal repro:", minimal, "->", e)`,
        output: `bad in lote: [('SoloNombre', 'ValueError')]
minimal repro: SoloNombre -> faltan apellidos`,
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
        "Usa un **Logger de módulo** (`logging.getLogger(__name__)`) en vez de configurar el root a ciegas en cada helper. Handlers y formatters se arman **una vez** en el entrypoint del CLI (preview suave de S10, Módulos y CLI). En el camino de ERROR dentro de un `except`, `log.exception(...)` o `exc_info=True` adjuntan el traceback al mensaje estructurado sin perder `correlation_id` ni forzar un `print` del stack.",
        "Logs **estructurados** (`key=value` o JSON) con campos estables (`stage`, `record_id`, `correlation_id`, `duration_ms`, `error_class`) se filtran en agregadores y en el post mórtem. Un `print(\"ok\")` suelto no escala a prod ni a la bitácora de **CP-N1-C**: no tiene nivel, no tiene correlation_id y se pierde en el stdout del pipe.",
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
      heading: "Correlation IDs y enmascarado de datos personales",
      subtopicId: "S09-T3-B",
      paragraphs: [
        "Un **correlation_id** (o request_id) viaja por capas (CLI → service → repo) como argumento explícito para unir logs del mismo job o lote. Sin él, el post mórtem de las 02:10 es arqueología: no sabes si el WARNING de la fila C014 y el ERROR del provider pertenecen a la misma corrida de intake. En el **manifest de S08**, cada fila en cuarentena gana poder operativo si lleva el mismo `correlation_id` que el job que la rechazó.",
        "**Nunca** loguees email, teléfono o dirección **completos**. Usa máscaras estables: `a***@ejemplo.pe`, `***4567`, dirección reducida a ciudad o `***`. Un ERROR con el row completo es un incidente de cumplimiento (y de confianza del cliente), no un «log detallado» útil. En CASO-LIM-009, con `corr-9c2e` y email enmascarado el canal de ops actúa en minutos sin filtrar PII a Slack.",
        "Los helpers `mask_email` / `mask_phone` / `mask_address` deben ser el **único** camino hacia los logs; una auditoría de código falla si alguien hace `log.info(row)` o formatea f-strings con el email crudo. Enmascara **antes** de construir el mensaje. En el `except`, combina el enmascarado con `log.exception(...)` para el análisis forense (stack + correlation_id) sin exponer datos personales.",
      ],
      code: {
        language: 'python',
        title: "mask_pii.py",
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

def parse_campo_requerido(raw: str) -> str:
    # demo de ERROR path: no uses float para montos (ver Decimal en T1-A)
    if raw.strip().upper() in {"N/A", "NA", ""}:
        raise ValueError(f"valor vacío o N/A: {raw!r}")
    return raw.strip()

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
    parse_campo_requerido("N/A")
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
          "Un ERROR con el registro completo puede filtrar datos personales a CloudWatch o Slack. Enmascara siempre.",
      },
    },
    {
      heading: "Fallar rápido vs. continuar con cuarentena",
      subtopicId: "S09-T4-A",
      paragraphs: [
        "Taxonomía del intake: **data** (fila sucia del CSV), **config** (delimiter, schema path, env `ROOT_PATH` vacía), **provider** (timeout S3, HTTP 503). La **política difiere** por clase: no trates un timeout del proveedor igual que un monto inválido. El primero puede reintentarse (T4-B); el segundo va a cuarentena con `error_class=data` y el lote sigue.",
        "**Fail-fast** en config: seguir con schema roto multiplica basura y envenena el **manifest de S08**. **Cuarentena** en data: una fila mala **no** debe tumbar el lote entero. El mismo gate de reconciliación (`in == ok + quarantined`) ahora lleva `error_class` y `correlation_id` explícitos en cada rechazo para el post mórtem de CP-N1-C.",
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
        "**Retry solo errores transitorios** (`TimeoutError`, HTTP 503, red). Un `ValueError` de datos **no** se reintenta: va a **cuarentena** con `error_class=data`. Reintentar un monto inválido no lo hace válido: solo gasta cuota del proveedor, multiplica logs ERROR y confunde al on-call del intake CASO-LIM-009 a las 02:10.",
        "Operaciones **idempotentes** (misma clave de escritura) permiten **volver a ejecutar** un job sin duplicar side-effects. Clave típica: `(source, record_id, version)` más un hash del payload — el mismo espíritu del **manifest de S08**, ahora a nivel de reingesta tras un retry, un redeploy nocturno o un reproceso parcial del lote cuarentenado.",
        "El **backoff** creciente reduce la presión sobre el proveedor; en producción se añade **jitter** (una variación aleatoria acotada) para que varios workers no reintenten al mismo instante. Tras `max_attempts`, la unidad va a cuarentena o el job falla según la política del README. **Nunca** uses retries infinitos en producción: un bucle eterno es un incidente disfrazado de «resiliencia».",
      ],
      code: {
        language: 'python',
        title: "retry_policy.py",
        code: `import time

def fetch_with_retry(fn, max_attempts=3):
    if max_attempts < 1:
        raise ValueError("max_attempts debe ser >= 1")
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
    intro: "Ocho demos I Do (uno por subtema), en orden T1→T4. Partes del job de intake CASO-LIM-009: validar filas, leer tracebacks, loguear sin PII y decidir fail-fast vs. cuarentena/retry. Datos sintéticos; entorno local-python. Observa el código completo antes de los We Do.",
    steps: [
      {
        demoId: "S09-T1-A-DEMO",
        subtopicId: "S09-T1-A",
        environment: "local-python",
        description: "Validar monto de intake: Decimal + ParseError encadenado a ValidationError",
        preamble:
          "En el intake sintético CASO-LIM-009 una fila con monto `N/A` no debe tumbar el job con un mensaje opaco. Antes de tocar We Do, observa la demo: (1) `parse_monto` convierte texto con coma a `Decimal` y cuantiza a 0.01; (2) si el parse falla, lanza `ParseError` **from** la causa de stdlib; (3) `validate_intake` envuelve eso en `ValidationError` con `id` de fila. Sigue los dos caminos: C001 imprime el dict ok; C002 muestra tipo, mensaje y `cause ParseError…`. Datos sintéticos; no reescribas aún.",
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
        why: "El chaining con `from e` deja `__cause__` legible en el post mórtem: el on-call ve la capa de dominio (ValidationError + id de fila) y la causa de parse. Los montos van por `Decimal` y `quantize(0.01)`, nunca por `float`. Un handler amplio que devuelva un estado genérico o silencie el error sí ocultaría ambos niveles.",
        retrospective:
          "Si puedes explicar por qué C002 imprime `ParseError` en la causa y no solo «error», ya tienes el hábito de **capa + causa**. El error clásico es `raise ValidationError(...)` sin `from e` y perder el detalle de parse. En We Do T1-A mapearás tipos y escribirás el parse con mensaje accionable.",
      },
      {
        demoId: "S09-T1-B-DEMO",
        subtopicId: "S09-T1-B",
        environment: "local-python",
        description: "Leer lote con `with` + `else`/`finally`; re-raise si config inválida.",
        preamble:
          "El job de lote debe cerrar handles y dejar contadores listos **aunque** el camino sea fatal. Observa sin escribir: (1) `with StringIO` cierra el handle; (2) si `encoding` falta, `ConfigError` se propaga (fail-fast); (3) en el camino feliz, `else` imprime `ok` y `finally` siempre imprime contadores. Predice el orden de las líneas de salida antes de mirar el oráculo. Datos sintéticos de demo.",
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
        why: "`with` cierra el handle; el `else` del **try** (no del if) corre solo si no hubo excepción — camino feliz legible. `finally` corre siempre, incluso antes de propagar al llamador. Config inválida se relanza: fail-fast, no cuarentena disfrazada.",
        retrospective:
          "Si sabes por qué `finally` corre también en el fallo de config, ya no confundes cleanup con «éxito». El error clásico es `except Exception: pass` y mentir al on-call. We Do: cerrar estado en finally y clasificar recover vs. fail-fast.",
      },
      {
        demoId: "S09-T2-A-DEMO",
        subtopicId: "S09-T2-A",
        environment: "local-python",
        description: "Reproducir KeyError en normalizer y ubicar frame con traceback.",
        preamble:
          "Una fila del batch sintético llega sin `email` y el job lanza `KeyError`. Observa cómo se imprime solo líneas del stack que mencionan *tu* código (`normalize_email`, `run_batch`) y el tipo de error — no el diccionario crudo del cliente. Predice cuál frame es el más útil (donde se indexa la clave). Datos `C00x` sintéticos; no reescribas.",
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
        why: "El frame útil es el de tu módulo (`normalize_email`), no el interior de la stdlib. `format_exc` da texto filtrable: buscas la función donde se indexa la clave y reduces el riesgo de volcar locals con PII al canal de ops.",
        retrospective:
          "Si localizas el bug en `normalize_email` sin leer todo el stack de la librería, ya tienes el hábito de triage. El error clásico es imprimir `row` entero en el except. We Do: anotar frames y simular «breakpoint» seguro.",
      },
      {
        demoId: "S09-T2-B-DEMO",
        subtopicId: "S09-T2-B",
        environment: "local-python",
        description: "De un lote de 200 filas sintéticas al caso mínimo de apellidos.",
        preamble:
          "Un lote sintético de casi 200 nombres «ok» y dos incompletos hace ruidoso el debug. Observa cómo el demo cuenta fallos y reduce al **string más corto** que dispara el `ValueError` (`'Solo'`). Ese minimal repro es lo que irá al test de regresión — no el archivo completo. No reescribas; sigue total_fallos → minimal_repro → root_symptom.",
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
        why: "Reducir a una sola entrada hace el assert de regresión de una línea y evita arrastrar PII o ruido de columnas. Un bug silencioso de 3+ tokens (truncar mal sin lanzar) es **otro** repro e hipótesis distinta; aquí el síntoma es el ValueError de nombre incompleto.",
        retrospective:
          "Si puedes defender por qué el test usa `'Solo'` y no el CSV entero, ya internalizaste minimal repro. We Do: recortar fixtures de DNI, hipótesis de teléfono y rojo→verde en nombres latam.",
      },
      {
        demoId: "S09-T3-A-DEMO",
        subtopicId: "S09-T3-A",
        environment: "local-python",
        description: "Logger de pipeline con campos stage, record_id, duration_ms.",
        preamble:
          "En el pipeline de familiaridad el progreso del stage se consulta por campos, no por `print` suelto. Observa: logger de módulo, handler a buffer, `propagate=False`, y dos INFO con `stage=normalize record_id=C001` (start/done + duration_ms). El reloj es un iterador inyectado para oráculo estable (7 ms). No reescribas; predice el buffer.",
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
        why: "Campos estables (`stage`, `record_id`, `event`, `duration_ms`) permiten filtrar en ops y post mórtem. El reloj inyectado hace el demo determinista; en producción usarías `perf_counter_ns`. `propagate=False` evita duplicar líneas en el root logger.",
        retrospective:
          "Si puedes decir por qué duration_ms sale 7 sin mirar el código del reloj, entendiste oráculos estables. We Do: asignar niveles, armar el logger y separar RESULT de logs (preview S10).",
      },
      {
        demoId: "S09-T3-B-DEMO",
        subtopicId: "S09-T3-B",
        environment: "local-python",
        description: "log.exception con email enmascarado, correlation_id y stack en el ERROR path.",
        preamble:
          "Un ERROR path del intake no puede filtrar `lucia.mendez@…` al canal de ops. Observa: `mask_email` antes del format string, `correlation_id` y `error_class=data`, `log.exception` adjunta stack, y los asserts verifican máscara + ausencia de PII completa. Solo la primera línea ERROR se imprime como oráculo legible. Datos sintéticos `ejemplo.pe`.",
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
        why: "Enmascara *antes* de formatear el mensaje. `log.exception` une stack y campos (`correlation_id`, `error_class`, email enmascarado) en un solo camino de ERROR, sin un segundo print del registro crudo al canal de Slack de las 02:10.",
        retrospective:
          "Si el assert de PII falla, es un incidente de cumplimiento disfrazado de «log útil». We Do: helpers de máscara, correlation por capas y auditoría de plantillas inseguras.",
      },
      {
        demoId: "S09-T4-A-DEMO",
        subtopicId: "S09-T4-A",
        environment: "local-python",
        description: "Lote: 1 fila mala a cuarentena; config rota aborta.",
        preamble:
          "El lote sintético trae C001 completa y C002 sin email. Observa la política: data → cuarentena con reason; config sin `required_fields` → abort RuntimeError. El assert `ok + quarantined == in` es el mismo espíritu del manifest de S08. Predice el dict y la línea `abort …` antes de mirar el output.",
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
        why: "Éxito parcial es válido si el reconcile cuadra: filas de data van a cuarentena con reason; config fatal **no** se cuarentena «como fila» — aborta. Es el puente operativo al manifest de S08 y al You Do de CP-N1-C.",
        retrospective:
          "Si puedes explicar por qué una fila mala no debe tumbar el lote y un schema vacío sí, ya tienes la taxonomía operativa. We Do: clasificar 8 fallos, implementar process_batch y codificar should_abort.",
      },
      {
        demoId: "S09-T4-B-DEMO",
        subtopicId: "S09-T4-B",
        environment: "local-python",
        description: "Retry 3× en TimeoutError; ValueError va a cuarentena sin retry.",
        preamble:
          "Un fetch flaky del proveedor simula timeout dos veces y ok al tercero; un ValueError de monto va a cuarentena **sin** gastar reintentos. Observa las tuplas de retorno `('ok', 'payload')` vs. `('quarantine', 'monto')` y el contador de attempts. No reescribas; predice por qué el segundo caso no llega a 3 intentos.",
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
        why: "Transitorio de red ≠ dato ilegal. Solo `TimeoutError` consume el bucle hasta el tope; un `ValueError` de monto sale al primer intento hacia cuarentena. Reintentar un dato inválido gasta cuota del proveedor y ensucia ERROR sin arreglar la fila. El tope de intentos es parte de la resiliencia: sin él, un bucle eterno se disfraza de «robustez».",
        retrospective:
          "Si sabes por qué ValueError no entra al loop de retry, ya separas resiliencia de corrección de datos. We Do: tabla yes/no, retry_call y clave de idempotencia.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Ejecuta y compara con la solución. Solo stdlib; datos sintéticos; sin PII real.",
    steps: [
      {
        subtopicId: "S09-T1-A",
        kind: "guided",
        title: "Mapear fallos de intake a tipos de excepción",
        preamble:
          "- **Contexto:** en el triage de CASO-LIM-009 el on-call necesita el **tipo** correcto, no un `Exception` genérico que lo obligue a leer el stack entero.\n- **Meta:** asociar cada fallo sintético al tipo más adecuado (stdlib + un custom de dominio).\n- **Éxito:** cinco líneas `fallo -> Tipo` en el orden del starter: ValueError, TypeError, KeyError, FileNotFoundError, ValidationError.\n- **Límites:** no uses `Exception` para todos; no inventes un sexto tipo; solo stdlib + la clase `ValidationError` que declares.",
        id: "S09-T1-A-E1",
        instruction:
          "Paso 1: Abre el starter: el bucle imprime siempre `ValueError`.\nPaso 2: Define tu propia excepción para la regla de negocio —heredando de `Exception`— y llámala `ValidationError`.\nPaso 3: Asigna cada string del array al tipo correcto (tipo incorrecto ≠ valor ilegal ≠ clave ≠ I/O ≠ dominio).\nPaso 4: Imprime `f\"{fallo} -> {tipo}\"` en el orden del array; sin texto extra.",
        hint: "Cinco clases distintas: no mapees todo a ValueError.",
        hints: [
          "Piensa: tipo incorrecto vs. valor ilegal vs. clave ausente vs. I/O vs. genérico de dominio.",
          "Usa TypeError, ValueError, KeyError, FileNotFoundError y un custom ValidationError.",
        ],
        edgeCases: ["No uses Exception genérico para todos.", "FileNotFoundError es subclase de OSError."],
        tests: "Contrato exacto: 5 líneas `… -> Tipo` en el orden del starter (ValueError, TypeError, KeyError, FileNotFoundError, ValidationError); exit 0.",
        feedback:
          "`int('x')` es valor ilegal (`ValueError`); sumar str+int es tipo (`TypeError`); dict sin clave es `KeyError`; archivo inexistente es `FileNotFoundError`. La regla monto < 0 es de **dominio**: `ValidationError`, no otro ValueError opaco.",
        retrospective:
          "El tipo es la primera señal operable del post mórtem. El error clásico es aplanar todo a `ValueError` «porque es común». Siguiente (E2): implementar `parse_monto` con `Decimal` y mensajes que incluyan el raw.",
        starterCode: {
          language: 'python',
          title: "map_exceptions.py",
          code: `# A corregir: todo ValueError
fallos = [
    "int('x')",
    "sumar str + int",
    "dict sin clave email",
    "abrir archivo inexistente",
    "regla de negocio: monto < 0",
]
for f in fallos:
    print(f, "->", "ValueError")
`,
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
        subtopicId: "S09-T1-A",
        kind: "independent",
        title: "Parsear monto con Decimal y mensajes claros",
        preamble:
          "- **Contexto:** en el intake, un monto `12,50` o `N/A` no puede pasar por `float` (precisión y no-finitos).\n- **Meta:** implementar `parse_monto(raw)` robusto con `Decimal` y raise `ValueError` accionable.\n- **Éxito:** `10.5` → `10.50`; `3,25` → `3.25`; `abc` → mensaje con `monto no numérico`; `-1` → `monto negativo`; NaN/Infinity fallan.\n- **Límites:** prohíbe `float()`; construye desde texto; solo stdlib `decimal`.",
        id: "S09-T1-A-E2",
        instruction:
          "Paso 1: Revisa el starter: usa `float` y no valida signo ni finitud.\nPaso 2: Normaliza coma → punto, `quantize(Decimal('0.01'))`, rechaza no finitos.\nPaso 3: Si no parsea: `ValueError` con el `raw` en el mensaje.\nPaso 4: Si es negativo: otro `ValueError` explícito. Demuestra con el loop del starter ampliado a [\"10.5\", \"3,25\", \"abc\", \"-1\"].",
        hint: "Construye Decimal desde texto, no desde float.",
        hints: [
          "Decimal desde str; captura InvalidOperation. Mensaje debe incluir el raw.",
          "Rechaza NaN/Infinity con is_finite y compara contra Decimal('0').",
        ],
        edgeCases: ["Cadena vacía.", "None.", "NaN.", "Infinity."],
        tests: "Contrato exacto: 10.5→Decimal('10.50'); 3,25→Decimal('3.25'); abc da 'monto no numérico'; -1 da 'monto negativo'; NaN e Infinity fallan; no se permite float().",
        feedback:
          "Si usaste `float()`, rehazlo: la precisión de dinero y NaN/Infinity no son negociables. El mensaje debe incluir el raw para que el on-call vea *qué* llegó sin abrir el CSV completo.",
        retrospective:
          "`Decimal` + mensaje con raw es el contrato de montos del pipeline. El error clásico es capturar `Exception` y devolver `0`. Luego (E3) envolverás un fallo de I/O en `DataLoadError` **from** la causa.",
        starterCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `# A corregir: float; no cuarentena
from decimal import Decimal, InvalidOperation

def parse_monto(raw):
    return float(raw)

for v in ['10.5', 'x', '-1']:
    try:
        print('ok', parse_monto(v))
    except Exception as e:
        print('err', type(e).__name__)
`,
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
        subtopicId: "S09-T1-A",
        kind: "transfer",
        title: "Encadenar OSError en DataLoadError",
        preamble:
          "- **Contexto:** al cargar el CSV de intake, el I/O (`FileNotFoundError`/`OSError`) no debe llegar al CLI como «fallo misterioso» sin causa.\n- **Meta:** definir `DataLoadError` y relanzar con `raise ... from e` capturando `OSError`.\n- **Éxito:** stdout con `DataLoadError` + mensaje y segunda línea `OSError` + causa; `__cause__` no es `None`.\n- **Límites:** captura `OSError` (cubre PermissionError); no dejes `raise` sin `from e`; sin PII en mensajes.",
        id: "S09-T1-A-E3",
        instruction:
          "Paso 1: El starter relanza `DataLoadError` sin `from e` y solo captura `FileNotFoundError`.\nPaso 2: Amplía a `except OSError as e` y usa `from e`.\nPaso 3: Imprime tipo y mensaje del error y de `__cause__`.\nPaso 4: Usa un reader que lance `OSError` (como en la solución).",
        hint: "path_fn es un callable: cuando falle con OSError, envuélvelo en DataLoadError.",
        hints: [
          "path_fn es un callable que simula open y puede lanzar OSError.",
          "Imprime type del error y de __cause__.",
        ],
        edgeCases: ["PermissionError también es OSError."],
        tests: "Contrato exacto: stdout muestra DataLoadError + mensaje y OSError como __cause__; exit 0; no dejes raise sin `from e`.",
        feedback:
          "El starter solo captura `FileNotFoundError` y relanza sin `from e`: `__cause__` queda `None` y un `PermissionError` (también `OSError`) se escapa sin capa de dominio. Amplía a `OSError` y usa `from e` para que el post mórtem vea I/O + `DataLoadError`.",
        retrospective:
          "Sin `from e`, el post mórtem pierde el I/O original. El borde de capa nombra el dominio (`DataLoadError`); la causa nombra el sistema de archivos. En T1-B practicarás fronteras try/else/finally y no tragar excepciones.",
        starterCode: {
          language: 'python',
          title: "data_load_chain.py",
          code: `# A corregir: raise sin from e
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
`,
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
        subtopicId: "S09-T1-B",
        kind: "guided",
        title: "Cerrar estado en finally aunque falle",
        preamble:
          "- **Contexto:** en un job de intake, el flag de «recurso cerrado / contadores listos» debe quedar True aunque la unidad falle.\n- **Meta:** usar `try/finally` para marcar `state['closed']=True` siempre.\n- **Éxito:** `ok {'closed': True}` y, tras capturar el fallo, `err {'closed': True}`.\n- **Límites:** no tragues `RuntimeError` en el camino de fail; déjalo propagar y marca closed en finally.",
        id: "S09-T1-B-E1",
        instruction:
          "Paso 1: El starter no tiene finally y captura RuntimeError devolviendo `\"err\"`.\nPaso 2: Quita ese except de «éxito falso»; usa solo try/finally.\nPaso 3: En finally: `state[\"closed\"] = True`.\nPaso 4: Camino feliz: imprime el return y state; camino fail: captura fuera de `work` e imprime `err` + state.",
        hint: "El flag `closed` debe quedar True en éxito y en fallo.",
        hints: [
          "El flag `closed` debe quedar True siempre.",
          "Usa try/finally; no captures la excepción en el camino de fail si quieres re-raise.",
        ],
        edgeCases: ["finally corre antes de propagar."],
        tests: "Contrato exacto: primera línea `ok {'closed': True}`; segunda tras capturar: `err {'closed': True}`; exit 0.",
        feedback:
          "`finally` corre antes de que la excepción salga de la función: por eso `closed` es True también con RuntimeError. Si capturas y devuelves `\"err\"` dentro de `work`, escondes el fatal al llamador.",
        retrospective:
          "Cleanup ≠ recuperación: `finally` marca el flag; la política de reintentar o abortar es **otro** borde. El error clásico es capturar dentro de `work` y devolver `\"err\"` — el llamador cree que hubo éxito controlado. Siguiente (E2): clasificar recover vs. fail-fast.",
        starterCode: {
          language: 'python',
          title: "finally_close.py",
          code: `# A corregir: no finally; closed False en fail
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
`,
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
        subtopicId: "S09-T1-B",
        kind: "independent",
        title: "Clasificar recover frente a fail-fast",
        preamble:
          "- **Contexto:** el on-call de las 02:10 no puede tratar un delimiter vacío igual que un email mal formado.\n- **Meta:** etiquetar cada error del starter como `fail-fast` o `recover`.\n- **Éxito:** seis líneas `nombre: política` en el orden del array (tres fail-fast de config/secretos, tres recover de fila/parse/timeout de un record).\n- **Límites:** recover ≠ silenciar (implica cuarentena o retry); no uses una sola política para todos.",
        id: "S09-T1-B-E2",
        instruction:
          "Paso 1: El starter marca todo como `recover`.\nPaso 2: Config/schema/secretos ausentes → `fail-fast`.\nPaso 3: Fila/parse/timeout de un record → `recover`.\nPaso 4: Imprime `f\"{e}: {política}\"` sin reordenar.",
        hint: "En config inválida propaga; en fila mala recupera.",
        hints: [
          "Config y secretos ausentes → fail-fast. Fila mala / parse → recover.",
          "Timeout de red de un registro puede ser recover+retry (marca recover).",
        ],
        edgeCases: ["recover no significa ignorar: cuarentena o retry."],
        tests: "Contrato exacto: 6 líneas `…: fail-fast|recover` en el orden del starter; exit 0.",
        feedback:
          "El starter marca **todo** como `recover` para «no tumbar el job»: eso envenena el manifest si el delimiter o el token faltan. Config/secretos → fail-fast; fila/parse/timeout de un record → recover (cuarentena o retry), **no** silenciar.",
        retrospective:
          "Config rota multiplica basura; fila sucia se cuarentena. Pregunta de auto-chequeo: si todo fuera recover, ¿qué vería el on-call a las 02:10? Luego (E3) refactorizarás un handler que traga `Exception` genérico.",
        starterCode: {
          language: 'python',
          title: "classify_errors.py",
          code: `# A corregir: todo recover
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
`,
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
        subtopicId: "S09-T1-B",
        kind: "transfer",
        title: "No tragar RuntimeError de config",
        preamble:
          "- **Contexto:** un `except Exception` en el borde del job convierte un fatal de config en «swallowed» y miente al reconcile.\n- **Meta:** capturar solo `ValueError` (cuarentena) y dejar propagar el resto.\n- **Éxito:** bad traga ambos; good_v → quarantine; good_r imprime `raised` con RuntimeError.\n- **Límites:** no uses `except:` bare ni tragues Exception en good_handler; solo ValueError de datos.",
        id: "S09-T1-B-E3",
        instruction:
          "Paso 1: Deja `bad_handler` como anti-patrón (traga Exception).\nPaso 2: En `good_handler`, captura solo `ValueError` → `(\"quarantine\", str(e))`.\nPaso 3: Demuestra con `v()` (ValueError) y `r()` (RuntimeError capturado fuera).\nPaso 4: Imprime las etiquetas del contrato de tests.",
        hint: "bad traga todo; good solo ValueError a cuarentena.",
        hints: [
          "No uses except desnudo.",
          "Imprime bad vs. good_v quarantine y good_r raised según el caso.",
        ],
        edgeCases: ["Exception aún es amplio; preferir tipos de dominio en prod."],
        tests: "Contrato exacto: bad traga ambos; good_v → quarantine; good_r relanza RuntimeError capturado como raised; exit 0.",
        feedback: "good_handler solo captura ValueError; RuntimeError de config debe propagar, no tragarse como swallowed.",
        retrospective:
          "Tragar config es peor que crashear: el job «sale 0» con datos basura. Preferir tipos estrechos en el borde. En T2-A leerás el traceback para ubicar el frame útil sin volcar PII.",
        starterCode: {
          language: 'python',
          title: "refactor_bare_except.py",
          code: `# A corregir: good_handler igual de traga-todo
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
`,
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
        subtopicId: "S09-T2-A",
        kind: "guided",
        title: "Anotar tres frames del traceback",
        preamble:
          "- **Contexto:** el on-call recibe un stack de texto en el canal; debe leer marcos de afuera hacia adentro sin recorrer el job.\n- **Meta:** extraer tres nombres de función del traceback sintético.\n- **Éxito:** `frame1 main`, `frame2 run`, `frame3 normalize`.\n- **Límites:** no reejecutes el código original; parsea el string `tb`; no inventes frames de la stdlib.",
        id: "S09-T2-A-E1",
        instruction:
          "Paso 1: El starter solo imprime la primera línea del traceback.\nPaso 2: Busca líneas con `, in ` y toma el nombre de función.\nPaso 3: Imprime frame1–frame3 en orden (main → run → normalize).\nPaso 4: No reejecutes el código original; parsea el string tb.",
        hint: "Busca cada línea `File ... in nombre_función`.",
        hints: [
          "Busca líneas 'File' o patrones 'in nombre'.",
          "Imprime frame1, frame2, frame3 (main, run, normalize).",
        ],
        edgeCases: ["most recent call last: el último frame es el más profundo."],
        tests: "Contrato exacto: frame1 main; frame2 run; frame3 normalize; exit 0.",
        feedback: "most recent call last: main → run → normalize; el frame útil del bug de email suele ser el más profundo de tu código.",
        retrospective:
          "El orden de frames es un mapa del call graph: el frame útil del bug de email suele ser el más profundo de **tu** código, no `cli`. El error clásico es leer solo la primera línea o culpar al entrypoint. Siguiente (E2): simular breakpoint con locals seguros.",
        starterCode: {
          language: 'python',
          title: "annotate_frames.py",
          code: `# A corregir: no extrae frames
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
`,
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
        subtopicId: "S09-T2-A",
        kind: "independent",
        title: "Breakpoint seguro solo con id de fila",
        preamble:
          "- **Contexto:** en demo/CI no siempre hay `pdb`; aun así debes inspeccionar **sin** filtrar email al log.\n- **Meta:** si falta `email`, en DEBUG imprimir solo `id` y lanzar `KeyError('email')`.\n- **Éxito:** `break locals id= C009` y `raised 'email'`; sin volcar el row.\n- **Límites:** no imprimas email/teléfono/row completo; flag DEBUG controla el print de locals.",
        id: "S09-T2-A-E2",
        instruction:
          "Paso 1: El starter usa `row.get(\"email\")` y no lanza.\nPaso 2: Si la clave no está: opcional print DEBUG con solo `id`, luego `raise KeyError(\"email\")`.\nPaso 3: Si está: devuelve email en minúsculas.\nPaso 4: Demuestra con `{\"id\": \"C009\"}` y captura el KeyError.",
        hint: "Imprime solo id (y opcional DEBUG), nunca el row.",
        hints: [
          "No imprimas el row completo si pudiera tener PII.",
          "Usa un flag DEBUG; formato: break locals id= …",
        ],
        edgeCases: ["En prod real usa logging + correlation_id."],
        tests: "Contrato exacto: línea `break locals id= C009` y `raised 'email'`; exit 0; sin volcar PII.",
        feedback:
          "Locals de debug solo con id (y flags); nunca el row completo con email/teléfono sintético en claro. El starter no lanza: el contrato exige KeyError explícito.",
        retrospective:
          "Locals de debug ≠ dump del cliente. El mismo cuidado aplica al logging de ERROR. Luego (E3) resumirás la causa raíz en una frase a partir del texto del stack.",
        starterCode: {
          language: 'python',
          title: "simulate_breakpoint.py",
          code: `# A corregir: no raise KeyError; devuelve None
DEBUG = True

def normalize(row: dict) -> str:
    return row.get("email")

try:
    print(normalize({"id": "C009"}))
except KeyError as e:
    print("raised", e)
`,
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
        subtopicId: "S09-T2-A",
        kind: "transfer",
        title: "Frase de causa raíz desde el stack",
        preamble:
          "- **Contexto:** en el post mórtem hace falta una línea accionable, no el tb completo en Slack.\n- **Meta:** con solo el texto del traceback, imprimir la causa raíz.\n- **Éxito:** una línea `causa_raiz=normalize falta clave email`.\n- **Límites:** no reejecutes el código original; no culpes a `cli`/`app` si el index es en `normalize`.",
        id: "S09-T2-A-E3",
        instruction:
          "Paso 1: El starter imprime todo el tb.\nPaso 2: Lee la línea `KeyError` y el frame de `normalize`.\nPaso 3: Emite exactamente el formato del contrato.\nPaso 4: No inventes otras causas.",
        hint: "Lee el texto del traceback; no vuelvas a ejecutar el código.",
        hints: [
          "No vuelvas a ejecutar el código original; parsea el texto.",
          "Formato: causa_raiz=normalize falta clave email",
        ],
        edgeCases: ["No culpes a cli.py si el bug está en normalize."],
        tests: "Contrato exacto: una línea `causa_raiz=normalize falta clave email`; exit 0.",
        feedback: "No culpes a cli.py: la KeyError nace en normalize al pedir la clave email.",
        retrospective:
          "Causa raíz = función + condición (clave faltante), no «falló en prod». Ese hábito alimenta el minimal repro de T2-B y el test de regresión.",
        starterCode: {
          language: 'python',
          title: "root_from_tb.py",
          code: `# A corregir: imprime todo el tb
tb = '''Traceback (most recent call last):
  File "app.py", line 1, in <module>
    normalize({"id": 1})
  File "app.py", line 1, in normalize
    return row["email"].lower()
KeyError: 'email'
'''
print(tb)
`,
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
        subtopicId: "S09-T2-B",
        kind: "guided",
        title: "Recortar fixture al primer DNI inválido",
        preamble:
          "- **Contexto:** al validar DNI peruano sintético (8 dígitos), el fixture mezcla válidos e inválidos.\n- **Meta:** encontrar la primera entrada que hace fallar `parse_dni` y reejecutar solo esa.\n- **Éxito:** `minimal= 123` y `dni inválido: '123'`.\n- **Límites:** no reproceses todo el fixture en el print final; datos sintéticos (no DNI real de persona).",
        id: "S09-T2-B-E1",
        instruction:
          "Paso 1: El starter fija `minimal = fixture[0]` (válido).\nPaso 2: Recorre hasta el primer `ValueError`, guarda esa cadena y haz `break`.\nPaso 3: Imprime `minimal=` y vuelve a llamar `parse_dni` solo con ese valor.\nPaso 4: Captura e imprime el mensaje.",
        hint: "Recorta a la primera fila que hace fallar parse_dni.",
        hints: [
          "Encuentra el primer fallido y vuelve a ejecutar solo ese.",
          "Imprime minimal=... y el mensaje dni inválido.",
        ],
        edgeCases: ["Puede haber varios fallos; el mínimo del primer fallo basta para el test."],
        tests: "Contrato exacto: `minimal= 123` y línea `dni inválido: '123'`; exit 0.",
        feedback: "El primer fallo basta como minimal repro: vuelve a ejecutar solo esa entrada, no todo el fixture.",
        retrospective:
          "El primer fallo basta para un repro de regresión; el resto del fixture es ruido. Siguiente (E2): hipótesis falsables sobre normalización de teléfono.",
        starterCode: {
          language: 'python',
          title: "crop_fixture.py",
          code: `# A corregir: no encuentra primer fail
def parse_dni(d: str) -> str:
    if not (d.isdigit() and len(d) == 8):
        raise ValueError(f"dni inválido: {d!r}")
    return d

fixture = ["12345678", "123", "87654321", "12AB5678"]
minimal = fixture[0]
print("minimal", minimal)
`,
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
        subtopicId: "S09-T2-B",
        kind: "independent",
        title: "Hipótesis: +51 no es perder el país",
        preamble:
          "- **Contexto:** un reporte afirma que se «perdió el código de país +51»; el contrato de S07 es salida **solo dígitos**.\n- **Meta:** distinguir quitar el símbolo `+` de borrar los dígitos `51`.\n- **Éxito:** `with_country 51999111222`, `local 999111222`, `country_digits_preserved True`, `plus_symbol_expected False`.\n- **Límites:** no inventes formato E.164 con `+` en la salida; solo dígitos; datos sintéticos.",
        id: "S09-T2-B-E2",
        instruction:
          "Paso 1: El starter quita espacios y `+` pero no deja el contrato explícito con asserts/flags.\nPaso 2: Normaliza a solo dígitos.\nPaso 3: Compara la entrada con código de país frente a la entrada local.\nPaso 4: Imprime las dos afirmaciones del contrato de tests.",
        hint: "Prueba cada hipótesis con un fixture mínimo.",
        hints: [
          "El formato normalizado contiene solo dígitos: debe conservar 51, no el carácter +.",
          "Compara +51 999 111 222 con 999 111 222 para aislar el prefijo de país.",
        ],
        edgeCases: ["Hipótesis falsables.", "prefijo 51.", "espacios."],
        tests: "Contrato exacto: '+51 999 111 222'→'51999111222'; '999 111 222'→'999111222'; afirmar country_digits_preserved=True y plus_symbol_expected=False.",
        feedback: "S07 definió salida solo-dígitos: retirar '+' no es perder el código de país si los dígitos 51 permanecen.",
        retrospective:
          "Hipótesis falsable + fixture mínimo evita pelear con el «reporte» sin evidencia. Retirar `+` no es perder el país si `51` permanece. Luego (E3): test rojo→verde de capitalización latam.",
        starterCode: {
          language: 'python',
          title: "hypotheses.py",
          code: `# A corregir: strip espacio sin digits-only
def normalize_phone(p: str) -> str:
    return p.replace(" ", "").replace("+", "")

with_country = normalize_phone("+51 999 111 222")
local = normalize_phone("999 111 222")
print("with_country", with_country)
print("local", local)
`,
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
        subtopicId: "S09-T2-B",
        kind: "transfer",
        title: "Rojo a verde en nombres con de/la",
        preamble:
          "- **Contexto:** `.title()` en nombres latam produce `De`/`La` y rompe el contrato de normalización del intake.\n- **Meta:** documentar el bug en rojo y una `good_title` que preserve partículas.\n- **Éxito:** líneas `RED`, `pass`, `GREEN` en ese orden.\n- **Límites:** el assert espera `Juan de la Cruz`; no «arregles» solo el print sin assert.",
        id: "S09-T2-B-E3",
        instruction:
          "Paso 1: Deja `bad_title` con `.title()` para demostrar el fallo.\nPaso 2: Implementa `good_title` que deje `de/del/la/...` en minúsculas si no son el primer token.\nPaso 3: Un `test` con assert; captura AssertionError → imprime RED.\nPaso 4: Corre good_title → pass y GREEN.",
        hint: "title() no es suficiente para partículas latam.",
        hints: [
          "Imprime RED luego GREEN.",
          "Bug: title() capitaliza De/La; el assert espera 'Juan de la Cruz'.",
        ],
        edgeCases: ["title() capitaliza De/La incorrectamente para nombres latam."],
        tests: "Contrato exacto: líneas RED, pass, GREEN en ese orden; exit 0.",
        feedback: "title() capitaliza De/La: el assert rojo documenta el bug; good_title preserva partículas latam.",
        retrospective:
          "El test rojo es documentación de causa raíz, no un «fallo de CI molesto». En T3-A pasarás del print de debug al logger con niveles y campos estables.",
        starterCode: {
          language: 'python',
          title: "regression_test.py",
          code: `# A corregir: good_title = title()
def bad_title(s: str) -> str:
    return s.title()

def good_title(s: str) -> str:
    return s.title()

def test(fn):
    out = fn("juan de la cruz")
    print(fn.__name__, out)

test(bad_title)
test(good_title)
`,
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
        subtopicId: "S09-T3-A",
        kind: "guided",
        title: "Asignar niveles DEBUG a ERROR a eventos",
        preamble:
          "- **Contexto:** si todo es INFO/ERROR, el dashboard de ops entierra el incidente real.\n- **Meta:** etiquetar cada evento del starter con el nivel correcto.\n- **Éxito:** seis líneas `evento: NIVEL` (INFO, DEBUG, WARNING, ERROR, ERROR, INFO) en orden.\n- **Límites:** WARNING si el job continúa con anomalía recuperable; no uses CRITICAL aquí salvo que el starter lo pida (usa ERROR para config ilegible).",
        id: "S09-T3-A-E1",
        instruction:
          "Paso 1: El starter imprime todo como INFO.\nPaso 2: Progreso de job → INFO; detalle de loop → DEBUG.\nPaso 3: Fila opcional rara → WARNING; parse/config ilegible → ERROR.\nPaso 4: Imprime sin reordenar.",
        hint: "Mapea cada evento al nivel correcto (INFO/WARNING/ERROR).",
        hints: [
          "Progreso normal → INFO; detalle de loop → DEBUG; fila rara → WARNING; fallo de unidad → ERROR.",
          "Config inválida al arrancar también ERROR (o CRITICAL; usa ERROR aquí).",
        ],
        edgeCases: ["WARNING no es ERROR si el job continúa."],
        tests: "Contrato exacto: 6 líneas `…: DEBUG|INFO|WARNING|ERROR` en el orden del starter; exit 0.",
        feedback:
          "El starter pone **todo** en INFO: el dashboard no prioriza. Fila opcional rara = WARNING (el job sigue); parse/config ilegible = ERROR; detalle de loop = DEBUG, no INFO de progreso.",
        retrospective:
          "Nivel = severidad operativa, no «cuánto texto quiero». El error clásico es ERROR en cada fila de cuarentena esperable. Siguiente (E2): configurar el logger de módulo de verdad.",
        starterCode: {
          language: 'python',
          title: "assign_levels.py",
          code: `# A corregir: todo INFO
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
`,
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
        subtopicId: "S09-T3-A",
        kind: "independent",
        title: "Logger de módulo a buffer StringIO",
        preamble:
          "- **Contexto:** el job de ingest necesita bitácora con nivel, no `print` de progreso.\n- **Meta:** armar logger de módulo, handler a `StringIO`, emitir un INFO estructurado.\n- **Éxito:** una línea `INFO stage=ingest event=start`.\n- **Límites:** `propagate=False`; limpia handlers en demos; no uses print como log de progreso (el print final solo vuelca el buffer).",
        id: "S09-T3-A-E2",
        instruction:
          "Paso 1: Elimina las llamadas a `print` que simulan INFO/DEBUG en el starter.\nPaso 2: `getLogger`, `setLevel(INFO)`, `StreamHandler(buf)`, formatter `%(levelname)s %(message)s`.\nPaso 3: `log.info(\"stage=ingest event=start\")`.\nPaso 4: Imprime `buf.getvalue().strip()`.",
        hint: "propagate=False; formatter simple.",
        hints: [
          "propagate=False; formatter simple `%(levelname)s %(message)s`.",
          "Mensaje: stage=ingest event=start",
        ],
        edgeCases: ["Limpiar handlers en demos evita duplicados."],
        tests: "Contrato exacto: una línea `INFO stage=ingest event=start`; exit 0.",
        feedback: "Logger de módulo + StreamHandler a buffer + propagate=False: no uses print como bitácora de progreso.",
        retrospective:
          "Logger de módulo + handler único es el entrypoint limpio que S10 empaquetará en CLI. Luego (E3): separar stream de datos de logs de progreso.",
        starterCode: {
          language: 'python',
          title: "module_logger.py",
          code: `# A corregir: print en vez de log; no handler
import logging, io
print("INFO job_start")
print("DEBUG i=0")
`,
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
        subtopicId: "S09-T3-A",
        kind: "transfer",
        title: "RESULT limpio y progreso en el logger",
        preamble:
          "- **Contexto:** si mezclas «empezando/sumando» con el número de salida, rompes pipes y el contrato CLI de S10.\n- **Meta:** progreso a logs estructurados; stdout de datos solo con `RESULT=…`.\n- **Éxito:** `RESULT=3` y línea LOGS con `event=start` y `event=done`.\n- **Límites:** no imprimas progreso en el stream de datos; logger a buffer para el resumen.",
        id: "S09-T3-A-E3",
        instruction:
          "Paso 1: El starter usa print para todo en `cli_stub_good`.\nPaso 2: Loguea start/done; calcula resultado; imprime solo `RESULT=`.\nPaso 3: Vuelca el buffer de logs en una segunda línea etiquetada.\nPaso 4: Con n=2 el resultado es 3.",
        hint: "Progreso al logger; RESULT al stdout de datos.",
        hints: [
          "Progreso a logger; resultado con print o stdout data.",
          "Debe verse RESULT=3 y LOGS con event=start / event=done.",
        ],
        edgeCases: ["No mezclar progress en el stream de datos."],
        tests: "Contrato exacto: `RESULT=3` y línea LOGS con event=start y event=done; exit 0.",
        feedback: "Stdout de datos **limpios** (RESULT=…); progreso del job en el logger — preview del contrato CLI de S10 (Módulos y CLI).",
        retrospective:
          "Datos y diagnóstico son streams distintos: así el on-call filtra sin ensuciar el JSON/resultado. En T3-B añadirás correlation_id y máscaras de PII al ERROR path.",
        starterCode: {
          language: 'python',
          title: "prints_to_logs.py",
          code: `# A corregir: cli_stub_good = print
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
`,
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
        subtopicId: "S09-T3-B",
        kind: "guided",
        title: "Enmascarar email y teléfono sintéticos",
        preamble:
          "- **Contexto:** la bitácora de CP-N1-C solo puede mostrar PII parcialmente legible.\n- **Meta:** implementar `mask_email` y `mask_phone` estables.\n- **Éxito:** `c***@ejemplo.pe` y `***7666` con los fixtures del starter.\n- **Límites:** no imprimas el raw; email sin @ → `***`; teléfono corto → `***`.",
        id: "S09-T3-B-E1",
        instruction:
          "Paso 1: El starter devuelve el string crudo.\nPaso 2: Email: primer carácter del local + `***@` + dominio.\nPaso 3: Phone: solo dígitos, `***` + últimos 4.\nPaso 4: Imprime ambas máscaras, una por línea.",
        hint: "Máscara estable: primer char + ***@dominio; phone ***+4.",
        hints: [
          "email: primer char + ***@dominio; phone: *** + últimos 4 dígitos.",
          "Imprime ambas máscaras en dos líneas.",
        ],
        edgeCases: ["email sin @.", "teléfono corto."],
        tests: "Contrato exacto: `c***@ejemplo.pe` y `***7666`; exit 0; sin PII completa en stdout.",
        feedback: "Máscara estable: primer char + ***@dominio; teléfono *** + últimos 4 dígitos (nunca el raw).",
        retrospective:
          "Máscara estable = accionable sin filtrar. El mismo helper debe ser el **único** camino a logs. Siguiente (E2): propagar correlation_id por capas.",
        starterCode: {
          language: 'python',
          title: "mask_helpers.py",
          code: `# A corregir: devuelve raw
def mask_email(email: str) -> str:
    return email

def mask_phone(phone: str) -> str:
    return phone

print(mask_email("carlos@ejemplo.pe"))
print(mask_phone("+51 988 777 666"))
`,
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
        subtopicId: "S09-T3-B",
        kind: "independent",
        title: "Propagar correlation_id por tres capas",
        preamble:
          "- **Contexto:** sin el mismo id en CLI, service y repo, el post mórtem no une WARNING y ERROR de la misma corrida.\n- **Meta:** pasar `correlation_id` como argumento explícito (sin global).\n- **Éxito:** tres líneas con `correlation_id=corr-42` (cli, service, repo id=C001).\n- **Límites:** no uses variable global ni contextvars aquí; argumento explícito.",
        id: "S09-T3-B-E2",
        instruction:
          "Paso 1: El starter imprime etiquetas sin el corr.\nPaso 2: Incluye `correlation_id={corr}` en cada print de capa.\nPaso 3: Repo también imprime `id` del item.\nPaso 4: Llama `cli_main(\"corr-42\", {\"id\": \"C001\"})`.",
        hint: "Pasa correlation_id como argumento en cada capa.",
        hints: [
          "Pasa el id como argumento explícito (sin global).",
          "Mismo id en las 3 líneas: cli, service, repo.",
        ],
        edgeCases: ["En apps reales: contextvars opcional; aquí explícito es más claro."],
        tests: "Contrato exacto: tres líneas con correlation_id=corr-42 (cli, service, repo id=C001); exit 0.",
        feedback: "El mismo corr-42 debe aparecer en cli, service y repo: argumento explícito, no variable global oculta.",
        retrospective:
          "El id es el hilo del job en el agregador de logs. Luego (E3): auditar plantillas que aún piden `{email}`/`{phone}` crudos.",
        starterCode: {
          language: 'python',
          title: "correlation_layers.py",
          code: `# A corregir: no propaga corr
def repo_save(corr, item):
    print(f"repo id={item['id']}")

def service_upsert(corr, item):
    print("service")
    repo_save(corr, item)

def cli_main(corr, item):
    print("cli")
    service_upsert(corr, item)

cli_main("corr-42", {"id": "C001"})
`,
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
        subtopicId: "S09-T3-B",
        kind: "transfer",
        title: "Auditar plantilla de log sin filtrar PII",
        preamble:
          "- **Contexto:** una auditoría de logging no debe reimprimir el email que intenta proteger.\n- **Meta:** detectar placeholders inseguros en la plantilla y emitir solo el log enmascarado.\n- **Éxito:** `detected_unsafe True` y `SAFE error en a***@ejemplo.pe tel=***1222`; stdout sin raw.\n- **Límites:** escanea el string plantilla; no hagas `format` con el row crudo en el camino final; datos sintéticos.",
        id: "S09-T3-B-E3",
        instruction:
          "Paso 1: Detecta `\"{email}\"` y `\"{phone}\"` en `template_unsafe`.\nPaso 2: Sustituye las funciones que devuelven valores crudos por máscaras reales.\nPaso 3: `safe_log` arma el mensaje solo con máscaras.\nPaso 4: Imprime detected_unsafe y SAFE … sin volcar raw.",
        hint: "Revisa el string plantilla, no el row completo en stdout.",
        hints: [
          "Define template_unsafe = 'error en {email} tel={phone}' y busca '{email}' / '{phone}' en ese texto.",
          "Imprime 'detected_unsafe True' y 'SAFE error en a***@ejemplo.pe tel=***1222' sin volcar PII raw.",
        ],
        edgeCases: ["No loguear address completa tampoco.", "No uses internals de bytecode (__code__)."],
        tests: "Contrato exacto: stdout contiene 'detected_unsafe True' y 'SAFE error en a***@ejemplo.pe tel=***1222'; stdout no contiene a@ejemplo.pe ni 999111222.",
        feedback:
          "Una auditoría no debe re-filtrar la PII que intenta detectar: el starter formatea con raw; el camino final escanea la plantilla y solo emite máscaras.",
        retrospective:
          "Detectar el riesgo en la plantilla es más seguro que «probar el log con datos reales». En T4-A unirás taxonomía data|config|provider con la política de abort del lote.",
        starterCode: {
          language: 'python',
          title: "audit_pii_log.py",
          code: `# El starter aún formatea con PII raw: corrige safe_log y la detección.

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
`,
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
        subtopicId: "S09-T4-A",
        kind: "guided",
        title: "Taxonomía data, config y provider",
        preamble:
          "- **Contexto:** reintentar un NaN de CSV o cuarentenar un YAML corrupto son errores de política, no de sintaxis.\n- **Meta:** etiquetar ocho fallos sintéticos como data, config o provider.\n- **Éxito:** ocho líneas `fallo: clase` (dos puntos, no `->`) en el orden del starter.\n- **Límites:** ROOT_PATH vacía es config; HTTP 503 y timeout S3 son provider; no uses Exception genérica.",
        id: "S09-T4-A-E1",
        instruction:
          "Paso 1: El starter marca todo como `data`.\nPaso 2: Fila/CSV → data; arranque/schema/env → config; red/IO externo → provider.\nPaso 3: Imprime `f\"{f}: {c}\"` sin reordenar ni flechas.\nPaso 4: Incluye el caso ROOT_PATH.",
        hint: "Ocho casos: data | config | provider (sin Exception genérica).",
        hints: [
          "Config = arranque/schema/env; data = fila; provider = red/IO externo.",
          "Sé consistente con la taxonomía de la teoría T4-A; ROOT_PATH vacía es config.",
        ],
        edgeCases: ["Un 400 del API por payload malo puede ser data; 503 es provider."],
        tests: "Contrato exacto: 8 líneas `…: data|config|provider` en el orden del starter (incluye ROOT_PATH); sin flechas `->`; exit 0.",
        feedback: "Ocho casos, ocho clases: data (fila), config (arranque/env/schema), provider (S3/HTTP 503). ROOT_PATH vacía es config.",
        retrospective:
          "La clase dicta la política (cuarentena / abort / retry). El error clásico es tratar 503 igual que monto NaN. Siguiente (E2): process_batch con reconcile.",
        starterCode: {
          language: 'python',
          title: "taxonomy.py",
          code: `# Starter marca todo como data: corrige la clase de cada fallo.
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
`,
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
        subtopicId: "S09-T4-A",
        kind: "independent",
        title: "Cuarentena con reconcile del lote",
        preamble:
          "- **Contexto:** tirar filas sin id en silencio rompe el manifest y miente al dashboard.\n- **Meta:** `process_batch` devuelve ok, quarantined (con reason) e in; reconcile obligatorio.\n- **Éxito:** 2 ok, 1 quarantined `data:missing_id`, `in=3`; assert in == len(ok)+len(q).\n- **Límites:** no descartes filas sin reason; no mutes el contrato del dict de retorno.",
        id: "S09-T4-A-E2",
        instruction:
          "Paso 1: El starter filtra sin llenar quarantined.\nPaso 2: Si falta id → append a q con reason.\nPaso 3: Retorna ok, quarantined, in=len(rows).\nPaso 4: Imprime el dict y deja el assert de reconcile.",
        hint: "Filas malas a quarantined; no las tires sin registro.",
        hints: [
          "Retorno: ok, quarantined, in.",
          "Reconciliación in = len(ok)+len(quarantined); no descartes filas en silencio.",
        ],
        edgeCases: ["id=0 podría ser válido en otros dominios; aquí truthiness simple."],
        tests: "Contrato exacto: dict con 2 ok, 1 quarantined reason data:missing_id, in=3; assert de reconcile; exit 0.",
        feedback: "Fila sin id no se descarta en silencio: va a quarantined con reason y el reconcile in==ok+q debe cuadrar.",
        retrospective:
          "Cuarentena es registro, no olvido. El reconcile es el invariante que defenderás en el You Do. Luego (E3): política de abort multi-regla.",
        starterCode: {
          language: 'python',
          title: "process_batch.py",
          code: `# A corregir: drop rows without quarantine list
def process_batch(rows):
    ok = [r for r in rows if r.get("id")]
    return {"ok": ok, "quarantined": [], "in": len(rows)}

rows = [{"id": "C1"}, {}, {"id": "C2"}]
print(process_batch(rows))
`,
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
        subtopicId: "S09-T4-A",
        kind: "transfer",
        title: "Política de abort multi-regla testeable",
        preamble:
          "- **Contexto:** el on-call no adivina si abortar: el README y el código deben decir lo mismo.\n- **Meta:** `should_abort(metrics)` con tres reglas y camino ok.\n- **Éxito:** cuatro líneas case/abort/reason (config True, ratio_alto True, provider True, una_fila_data False reason=ok).\n- **Límites:** orden config → ratio > 0.5 → provider; in=0 evita división; umbral 0.5 es de lab.",
        id: "S09-T4-A-E3",
        instruction:
          "Paso 1: El starter aborta si quarantined ≥ 1 (demasiado agresivo).\nPaso 2: Evalúa config_ok, ratio, provider_exhausted.\nPaso 3: Una sola fila en 10 no aborta.\nPaso 4: Imprime el formato exacto del contrato.",
        hint: "Evalúa en orden: config → umbral de cuarentena → provider agotado; si nada aplica, abort=False reason=ok.",
        hints: [
          "Evalúa en orden: config crítica → ratio quarantined/in > 0.5 → provider_exhausted.",
          "No abortes solo porque quarantined==1 si el ratio ≤ 0.5; documenta reason=ok.",
        ],
        edgeCases: ["El umbral 0.5 es de lab; en tu org se documenta en el README.", "in=0 evita división: trata ratio como 0."],
        tests: "Contrato exacto: 4 líneas `case=… abort=… reason=…` (config→True, ratio alto→True, provider→True, una fila data→False reason=ok); exit 0.",
        feedback:
          "La política de abort es una función testeable: el starter aborta por cualquier cuarentena; el contrato exige config, ratio > 0.5 y provider_exhausted, no «cualquier q≥1».",
        retrospective:
          "Política codificada = post mórtem sin telepatía. En T4-B decidirás *qué* reintentar y con qué clave de idempotencia.",
        starterCode: {
          language: 'python',
          title: "abort_policy.py",
          code: `# A corregir: aborta por cualquier quarantined>=1

def should_abort(metrics: dict) -> tuple[bool, str]:
    # metrics: in, quarantined, config_ok, provider_exhausted
    if metrics.get("quarantined", 0) >= 1:
        return True, "data"
    return False, "ok"

casos = [
    ("config", {"in": 10, "quarantined": 0, "config_ok": False, "provider_exhausted": False}),
    ("ratio_alto", {"in": 10, "quarantined": 6, "config_ok": True, "provider_exhausted": False}),
    ("provider", {"in": 10, "quarantined": 1, "config_ok": True, "provider_exhausted": True}),
    ("una_fila_data", {"in": 10, "quarantined": 1, "config_ok": True, "provider_exhausted": False}),
]
for name, m in casos:
    abort, reason = should_abort(m)
    print(f"case={name} abort={abort} reason={reason}")
`,
        },
        solutionCode: {
          language: 'python',
          title: "abort_policy.py",
          code: `def should_abort(metrics: dict) -> tuple[bool, str]:
    if not metrics.get("config_ok", True):
        return True, "config"
    total = metrics.get("in") or 0
    q = metrics.get("quarantined") or 0
    ratio = (q / total) if total else 0.0
    if ratio > 0.5:
        return True, "quarantine_ratio"
    if metrics.get("provider_exhausted"):
        return True, "provider"
    return False, "ok"

casos = [
    ("config", {"in": 10, "quarantined": 0, "config_ok": False, "provider_exhausted": False}),
    ("ratio_alto", {"in": 10, "quarantined": 6, "config_ok": True, "provider_exhausted": False}),
    ("provider", {"in": 10, "quarantined": 1, "config_ok": True, "provider_exhausted": True}),
    ("una_fila_data", {"in": 10, "quarantined": 1, "config_ok": True, "provider_exhausted": False}),
]
for name, m in casos:
    abort, reason = should_abort(m)
    print(f"case={name} abort={abort} reason={reason}")`,
          output: `case=config abort=True reason=config
case=ratio_alto abort=True reason=quarantine_ratio
case=provider abort=True reason=provider
case=una_fila_data abort=False reason=ok`,
        },
      },
      {
        subtopicId: "S09-T4-B",
        kind: "guided",
        title: "¿Qué errores merecen retry?",
        preamble:
          "- **Contexto:** reintentar un KeyError de fila no arregla el schema; solo multiplica logs.\n- **Meta:** marcar yes/no de retry para cinco tipos.\n- **Éxito:** TimeoutError yes; ValueError no; ConnectionError yes; KeyError no; PermissionError no.\n- **Límites:** solo transitorios de red aquí; no marques PermissionError como yes.",
        id: "S09-T4-B-E1",
        instruction:
          "Paso 1: El starter pone yes en ValueError/KeyError/PermissionError.\nPaso 2: Solo TimeoutError y ConnectionError → yes.\nPaso 3: El resto → no.\nPaso 4: Imprime `error: yes|no` en el orden del dict.",
        hint: "TimeoutError/503 → retry; ValueError/400 → no.",
        hints: [
          "Solo transitorios: TimeoutError, ConnectionError.",
          "ValueError/KeyError/PermissionError → no.",
        ],
        edgeCases: ["429 rate limit a veces sí con backoff."],
        tests: "Contrato exacto: TimeoutError yes; ValueError no; ConnectionError yes; KeyError no; PermissionError no; exit 0.",
        feedback: "Solo transitorios de red (Timeout/Connection) merecen yes; datos y permisos no se arreglan reintentando.",
        retrospective:
          "Retry es para el **canal** (timeout, connection), no para el **dato** ni para permisos. El error clásico del starter es marcar yes en ValueError/KeyError «por si acaso» y multiplicar ERROR sin curar la fila. Auto-chequeo: ¿PermissionError se arregla reintentando? Siguiente (E2): implementar el loop con tope de intentos.",
        starterCode: {
          language: 'python',
          title: "retry_table.py",
          code: `# A corregir: reintenta ValueError/KeyError
retry = {
    "TimeoutError": "yes",
    "ValueError": "yes",
    "ConnectionError": "yes",
    "KeyError": "yes",
    "PermissionError": "yes",
}
for e, r in retry.items():
    print(f"{e}: {r}")
`,
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
        subtopicId: "S09-T4-B",
        kind: "independent",
        title: "Reintentar TimeoutError hasta el tope",
        preamble:
          "- **Contexto:** el proveedor inestable del laboratorio falla dos veces y responde en el tercero.\n- **Meta:** `retry_call(fn, max_attempts=3)` reintenta solo TimeoutError y relanza el último si agota.\n- **Éxito:** `done calls 3`; un `max_attempts` menor que 1 produce `ValueError`.\n- **Límites:** no retries infinitos; max_attempts=1 no reintenta; otros errores no se piden aquí.",
        id: "S09-T4-B-E2",
        instruction:
          "Paso 1: Rechaza `max_attempts < 1` con `ValueError`.\nPaso 2: Ejecuta un bucle hasta max_attempts capturando TimeoutError.\nPaso 3: Si agota, relanza el último TimeoutError.\nPaso 4: Imprime resultado y contador de calls; demuestra también el límite cero.",
        hint: "Bucle hasta max_attempts capturando solo TimeoutError; si agotas, relanza el último.",
        hints: [
          "Devuelve el resultado o relanza el último TimeoutError.",
          "Cuenta intentos en un cierre o contador externo.",
        ],
        edgeCases: ["max_attempts=1 no reintenta.", "max_attempts=0 se rechaza con ValueError."],
        tests: "Contrato exacto: `done calls 3`; `max_attempts=0` produce `ValueError`; exit 0.",
        feedback: "retry_call debe reintentar TimeoutError hasta max_attempts; el proveedor inestable del laboratorio llega a done en el 3.er intento. Rechazar un tope menor que 1 evita un `raise None` accidental.",
        retrospective:
          "Tope de intentos es parte de la resiliencia; un bucle eterno es un incidente. Luego (E3): clave de idempotencia para re-ingesta sin duplicar side-effects.",
        starterCode: {
          language: 'python',
          title: "retry_call.py",
          code: `# A corregir: un solo attempt
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
`,
        },
        solutionCode: {
          language: 'python',
          title: "retry_call.py",
          code: `def retry_call(fn, max_attempts=3):
    if max_attempts < 1:
        raise ValueError("max_attempts debe ser >= 1")
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

print(retry_call(flaky), "calls", n["c"])
try:
    retry_call(flaky, 0)
except ValueError as e:
    print("boundary", e)`,
          output: `done calls 3
boundary max_attempts debe ser >= 1`,
        },
      },
      {
        subtopicId: "S09-T4-B",
        kind: "transfer",
        title: "Clave de idempotencia para re-ingesta",
        preamble:
          "- **Contexto:** reintentar un INSERT no idempotente duplica filas; el manifest de S08 ya te entrenó en conteos, ahora la clave de escritura.\n- **Meta:** construir `idem_key` con source, record_id, version y hash del payload.\n- **Éxito:** una línea `idem_key=banco_a:C001:v3:` + 12 hex del payload.\n- **Límites:** hash estable (`sort_keys` en JSON); no uses solo el id; datos sintéticos.",
        id: "S09-T4-B-E3",
        instruction:
          "Paso 1: El starter imprime solo el id.\nPaso 2: Serializa payload con `json.dumps(..., sort_keys=True)`, sha256, 12 hex.\nPaso 3: Formato `source:id:v{version}:{hash}`.\nPaso 4: Prefija con `idem_key=`.",
        hint: "Clave = source + id + version + hash(payload).",
        hints: [
          "Incluye source, record_id y content_hash o version.",
          "Formato: idem_key=source:id:vN:hash12",
        ],
        edgeCases: ["Misma clave + mismo payload = skip; misma clave + payload distinto = conflicto."],
        tests: "Contrato exacto: una línea `idem_key=banco_a:C001:v3:` + 12 hex del payload; exit 0.",
        feedback: "La clave une source + record_id + version + hash del payload: re-ingestar sin duplicar side-effects (eco S08).",
        retrospective:
          "Misma clave + mismo payload = skip seguro; misma clave + payload distinto = conflicto. Ese diseño cierra la resiliencia de S09 y alimenta la bitácora del You Do (CP-N1-C).",
        starterCode: {
          language: 'python',
          title: "idempotency_key.py",
          code: `# A corregir: key sin version/hash
import hashlib, json
record = {"source": "banco_a", "id": "C001", "version": 3, "payload": {"m": 1}}
key = f"{record['id']}"
print(key)
`,
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
      "Inicias **CP-N1-C**: una bitácora de pipeline que **sintetiza** lo practicado en los We Do — taxonomía data|config|provider, máscaras de PII, `log` con correlation_id, fail-fast de config y cuarentena de filas. El resultado es un módulo de portfolio que un junior puede mostrar en GitHub. Usa solo datos sintéticos; sin claims de fraude ni parentesco. **Éxito de corrida:** demo con assert `in == ok + quarantined`, cero PII completa en logs, y fail-fast verificable si falta `required_fields`.",
    objectives: [
      "Clasificar fallos en data | config | provider",
      "Emitir logs estructurados con correlation_id",
      "Enmascarar email, teléfono y dirección antes de escribir logs",
      "Cuarentena de filas inválidas sin abortar el lote salvo config fatal",
      "Documentar política fail-fast vs. continue en README",
      "Reconciliar conteos in == ok + quarantined y cubrir con tests mínimos",
    ],
    requirements: [
      "Módulo audit_log / process_batch con helpers de enmascarado (email, phone, address)",
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
4) Logs con correlation_id + email/phone/address enmascarados
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
    # TODO: fail-fast config; loop de filas; log.error enmascarado; errors_by_class
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
      { criterion: "Bitácora auditable: taxonomía + correlation_id + enmascarado verificable", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado (fail-fast + cuarentena + reconcile)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos en logs", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (≥3 tests)", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional (README de política)", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con `in == ok + quarantined` y con un test de fail-fast de config? (2) ¿qué cambia con datos reales vs. sintéticos (PII, secretos en logs)? (3) Una frase de impacto medible en el README («antes: email completo en ERROR; después: máscara + correlation_id») defendible en 30 s. Si no separas timeout de provider de monto NaN, vuelve a T4-A/T4-B.",
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
        options: ["Es más rápido que ValueError", "Obliga a usar Decimal", "Solo funciona en Windows", "Traga también KeyboardInterrupt/SystemExit y esconde corrupción"],
        correctIndex: 3,
        explanation:
          "Bare except captura casi todo, incluso señales de interrupción, y oculta la causa real del fallo.",
      },
      {
        question: "¿Cuándo corre el bloque `finally`?",
        options: ["Solo si hubo excepción", "Siempre: con éxito, con except y al re-raise", "Solo en el camino feliz", "Solo si usas `with`"],
        correctIndex: 1,
        explanation:
          "finally garantiza cleanup (cierre de handles, contadores) en todos los caminos de salida del try.",
      },
      {
        question: "¿Para qué sirve propagar un `correlation_id` por capas?",
        options: ["Unir logs del mismo job/lote en el post mórtem", "Cifrar el email del cliente", "Reemplazar el traceback", "Marcar fraude automáticamente"],
        correctIndex: 0,
        explanation:
          "El correlation_id enlaza CLI → service → repo sin necesidad de PII completa en cada línea de log.",
      },
      {
        question: "¿Cuándo preferirías CRITICAL frente a ERROR en el job de intake?",
        options: ["Cuando una sola fila tiene monto inválido y va a cuarentena", "Siempre que uses log.exception", "Cuando el proceso o el lote entero está en peligro (config rota, recurso crítico caído)", "Solo en DEBUG local"],
        correctIndex: 2,
        explanation:
          "ERROR cubre fallos de unidad recuperables o cuarentenables; CRITICAL señala que el job/proceso no puede continuar de forma segura.",
      },
      {
        question: "¿Qué ventaja dan los campos estructurados (`stage=… record_id=…`) frente a un `print(\"ok\")`?",
        options: ["Cifran automáticamente la PII del row", "Reemplazan la necesidad de tests de regresión", "Convierten todo ValueError en TimeoutError", "Permiten filtrar y correlacionar eventos en agregadores y post mórtems"],
        correctIndex: 3,
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
        note: "Estructura de logs; adaptar al enmascarado de datos personales del curso.",
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
