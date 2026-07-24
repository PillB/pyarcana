import type { CourseSection } from '../../types'

export const section23: CourseSection = {
  id: "computer-vision",
  index: 23,
  title: "Browser RPA con Playwright",
  shortTitle: "Playwright RPA",
  tagline: "robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y retries selectivos con handoff",
  estimatedHours: 19,
  level: "Competente",
  phase: 1,
  icon: "Monitor",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "El **adaptador web** de CP-N2-C automatiza un sitio local controlado con la mentalidad Playwright: locators de usuario, traces, retries y **API primero**. No bypassea CAPTCHA ni términos; el handoff humano es parte del contrato. En operaciones (p. ej. backoffice sintético en Lima) el valor es el dato verificado y auditable, no “haber automatizado el click”.",
  learningOutcomes: [
    { text: "Usar locators orientados a usuario" },
    { text: "Aplicar auto-waiting y assertions fiables" },
    { text: "Automatizar formularios, uploads y downloads" },
    { text: "Modelar auth y Page Objects" },
    { text: "Diagnosticar con trace, screenshot y logs" },
    { text: "Diseñar retries, recovery y reanudación por checkpoint" },
    { text: "Priorizar API/export sobre RPA" },
    { text: "Respetar ToS/CAPTCHA y handoff humano" },
  ],
  theory: [
    {
      heading: "Browser RPA contra una fixture local controlada",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Locator:** consulta estable de un control (preferir rol y nombre visibles). **Auto-wait:** esperar a que el control sea usable, no `sleep` fijo. **Page Object:** clase que encapsula selectores y acciones de una pantalla. **Trace:** paquete de evidencia de la corrida (pasos, red, DOM) para diagnosticar fallas. **storage_state:** cookies/localStorage reutilizables entre corridas. **API-first:** preferir endpoint o export al click UI. **Handoff humano:** detener el robot ante CAPTCHA/ToS y pasar evidencia a una persona. **Flaky:** prueba que a veces pasa y a veces falla por timing o entorno inestable.",
        "En S22 dejaste el hilo de **CP-N2-C** en borrador de correo con aprobación humana. Aquí construyes el **adaptador web**: obtener un reporte desde un **sitio de práctica local** (HTML/CSV sintéticos), sin red externa ni credenciales reales de bancos o SUNAT. El dato debe salir con **trace** y, si hubo download, **integridad** verificada (hash o tamaño).",
        "Practicamos primero el **contrato** con DOM/sesión en dicts (reproducible en cualquier máquina sin Chromium). La misma lógica se mapea a Playwright real (`get_by_role`, `expect`, download, tracing) cuando instales el runtime en local — el sketch de abajo muestra esa forma. Orden: **T1 Navegación** (locators, auto-wait) → **T2 Flujos** (forms, auth, Page Objects) → **T3 Diagnóstico** (trace, retries, reanudación) → **T4 Límites** (API-first, ToS/CAPTCHA/handoff). RPA es último recurso tras API/export; nunca bypass de CAPTCHA ni términos. En **S24** el hilo CP-N2-C sigue con OCR/Document AI sobre el binario que aquí descargas con integridad verificada.",
      ],
      code: {
        language: 'python',
        title: "playwright_sketch.py",
        code: `# Solo local (requiere: pip install playwright && playwright install)
# Muestra la forma real de la API; los ejercicios graded usan dicts equivalentes.
from playwright.sync_api import sync_playwright

def export_report(base_url: str) -> str:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()
        page.goto(base_url)
        # Locator de usuario (rol + nombre), no CSS frágil
        page.get_by_role("button", name="Exportar").click()
        with page.expect_download() as dl_info:
            page.get_by_role("link", name="Descargar reporte").click()
        download = dl_info.value
        path = download.path()
        browser.close()
        return path or ""

# En el lab: no llames esto sin un servidor local de práctica.
print("sketch_ready", True)
print("maps_to", "get_by_role + expect_download + trace")`,
        output: `sketch_ready True
maps_to get_by_role + expect_download + trace`,
      },
      callout: {
        type: "info",
        title: "Dos modos de práctica",
        content:
          "En los ejercicios calificados modelamos DOM y sesión con dicts (reproducible sin Chromium). Cuando instales Playwright en local, el mismo contrato aplica a `page.get_by_role`, downloads y traces reales. El sketch de arriba es la forma API; no se ejecuta en el grader.",
      },
    },
    {
      heading: "DOM y locators orientados a usuario",
      subtopicId: "S23-T1-A",
      paragraphs: [
        "Prefiere **get_by_role**, **get_by_label**, **get_by_text** sobre CSS/XPath frágiles. El usuario — y el árbol de accesibilidad — ve roles y nombres (“Descargar reporte”), no `#app > div:nth-child(3)`. Cuando el layout del portal demo cambia y el rol se mantiene, el robot sigue estable: **accesibilidad = estabilidad**. En portales sintéticos PE de demo, pide `data-testid` si falta rol; el testid es contrato de producto con el equipo de UI, no un parche silencioso del robot.",
        "Orden de estrategia didáctico: **role → testid → texto → CSS**. CSS queda como último recurso; si solo hay CSS frágil, el producto también es menos usable para personas con lector de pantalla. Modelamos locators como consultas sobre nodos `{role, name, id}`: misma semántica en el lab con dicts y en local con Playwright real (`page.get_by_role(...)`).",
        "Caso sintético CASO-LIM-023: botón “Descargar reporte” id `b1` se resuelve por role+name; un logo `img` sin role de control interactivo **no** sustituye al botón de negocio. `LookupError` (o `need_testid`) si no hay match enseña fallar **ruidoso** en setup — no click ciego al primer div. Ese fallo temprano es más barato que un download silencioso del archivo equivocado.",
      ],
      code: {
        language: 'python',
        title: "locators.py",
        code: `DOM = {
    "nodes": [
        {"role": "button", "name": "Descargar reporte", "id": "b1"},
        {"role": "textbox", "name": "Usuario", "id": "t1"},
        {"role": "link", "name": "Ayuda", "id": "l1"},
    ]
}

def get_by_role(role, name=None):
    hits = [n for n in DOM["nodes"] if n["role"] == role and (name is None or n["name"] == name)]
    if not hits:
        raise LookupError(f"no {role}/{name}")
    return hits[0]

btn = get_by_role("button", "Descargar reporte")
print(btn["id"], btn["name"])
print("prefer_role_over_css", True)`,
        output: `b1 Descargar reporte
prefer_role_over_css True`,
      },
      callout: {
        type: "tip",
        title: "Accesibilidad = estabilidad",
        content:
          "Si no hay rol, el producto también es menos usable para personas; fíjalo con el equipo de UI.",
      },
    },
    {
      heading: "Auto-waiting y assertions",
      subtopicId: "S23-T1-B",
      paragraphs: [
        "Playwright **auto-espera** a que el elemento sea actionable (visible, estable, enabled, recibe eventos). Evita `time.sleep` fijos: un sleep de 5s **falla en CI lento** y **desperdicia** en CI rápido. Usa `expect` con timeout explícito y condiciones de readiness del paso de negocio (título, fila de tabla, download started).",
        "Las **assertions** (`expect(locator).to_be_visible()`, título esperado) documentan la **postcondición** del paso y fallan con mensaje útil. En el lab simulamos reloj y `wait_until(pred)` con step ms hasta timeout — misma idea que el auto-wait del runtime real.",
        "Caso: `ready_at=250ms`, timeout 500 → ready True. Si tras N intentos no ready → `'timeout'` y adjunta **trace**. El robot del portal demo asserta título **antes** de descargar el CSV sintético; sin postcondición no hay evidencia de éxito.",
      ],
      code: {
        language: 'python',
        title: "autowait.py",
        code: `import time

class FakeClock:
    def __init__(self):
        self.t = 0
    def advance(self, ms):
        self.t += ms

def wait_until(pred, clock, timeout_ms=1000, step=100):
    waited = 0
    while waited <= timeout_ms:
        if pred():
            return True
        clock.advance(step)
        waited += step
    return False

clock = FakeClock()
ready_at = 250
state = {"ready": False}

def poll():
    if clock.t >= ready_at:
        state["ready"] = True
    return state["ready"]

ok = wait_until(poll, clock, timeout_ms=500)
print("ready", ok, "t", clock.t)`,
        output: `ready True t 300`,
      },
      callout: {
        type: "warning",
        title: "Sleep fijo es flaky",
        content:
          "Un sleep de 5s falla en CI lento y desperdicia tiempo en CI rápido. Prefiere condiciones.",
      },
    },
    {
      heading: "Formularios, uploads/downloads y sesiones",
      subtopicId: "S23-T2-A",
      paragraphs: [
        "Flujos típicos del adapter: **fill** campos de negocio (usuario, periodo de reporte), **set_input_files** / upload de plantilla, click de export, esperar **download** y verificar path, tamaño o hash. En Playwright real envuelves el click en `expect_download()`; en el lab modelamos el binario como bytes y calculamos un digest. El éxito del step **no** es “el click no lanzó excepción”: es el **archivo correcto**.",
        "**storage_state** (cookies / localStorage serializados) reutiliza la sesión autenticada entre corridas para no re-loguear en cada caso. En el lab un dict `{token: 't'}` modela ese reuso: si hay token → `reuse`; si no → `login`. Nunca hardcodees contraseñas reales de bancos o SUNAT; el sandbox de CP-N2-C usa credenciales demo (`demo` / `sandbox`).",
        "Caso PE sintético (Lima, America/Lima): form con periodo `2026-01`, upload de `plantilla.xlsx` sintética y download con `sha256` hex corto. Si el checksum no coincide con el esperado → fallo de step y paquete de evidencia (T3), nunca un “éxito silencioso” que contamine el reporte del run CP-N2-C.",
      ],
      code: {
        language: 'python',
        title: "form_download.py",
        code: `import hashlib

session = {"storage_state": {"user": "demo"}, "files": {}}

def fill(form, **fields):
    form.update(fields)
    return form

def upload(session, name, content: bytes):
    session["files"][name] = content
    return len(content)

def download(session, name):
    data = session["files"][name]
    return {"path": f"/tmp/{name}", "sha256": hashlib.sha256(data).hexdigest()[:12], "n": len(data)}

form = {}
fill(form, usuario="analista", periodo="2026-01")
upload(session, "plantilla.xlsx", b"synthetic-xlsx")
meta = download(session, "plantilla.xlsx")
print("form", form)
print("download", meta)`,
        output: `form {'usuario': 'analista', 'periodo': '2026-01'}
download {'path': '/tmp/plantilla.xlsx', 'sha256': '3cdfe594e427', 'n': 14}`,
      },
      callout: {
        type: "tip",
        title: "Verifica el binario",
        content:
          "No basta con que el click no falle: chequea tamaño, extensión o hash del download.",
      },
    },
    {
      heading: "Auth, estados y Page Objects",
      subtopicId: "S23-T2-B",
      paragraphs: [
        "Un **Page Object** (PO) encapsula selectores y acciones de una pantalla (`LoginPage.submit`, `ReportPage.open`). La idea es separar **setup de auth** (fixture `storage_state` o login una vez) del **test de negocio** del reporte, para no copiar el mismo fill de usuario en veinte archivos. Si el label del botón Login cambia, tocas un método — no reescribes la suite entera.",
        "Estados de página: `anonymous` → `authenticated` (en sistemas reales puede existir `mfa_pending`; aquí el sandbox es binario). `ReportPage.open` lanza `PermissionError` si no hay sesión: el robot **captura** y reporta `denied` en vez de seguir ciego al download. Ese guard es parte del contrato del adapter, no un detalle de UI.",
        "Contrato de laboratorio CASO-LIM-023: `LoginPage.submit(ctx, password)` con password `sandbox` setea `ctx['auth']`; password incorrecto deja `anonymous` / `False`. El PO **no** contiene `sleep` mágicos ni selectores CSS frágiles embebidos en el test: expone acciones que el test compone. El estado de sesión vive en el contexto (`ctx` o `storage_state`), no como atributo suelto del robot global.",
      ],
      code: {
        language: 'python',
        title: "page_objects.py",
        code: `class LoginPage:
    def __init__(self, ctx):
        self.ctx = ctx
    def submit(self, user, password):
        if user == "demo" and password == "sandbox":
            self.ctx["auth"] = "authenticated"
            return True
        self.ctx["auth"] = "anonymous"
        return False

class ReportPage:
    def __init__(self, ctx):
        self.ctx = ctx
    def open(self):
        if self.ctx.get("auth") != "authenticated":
            raise PermissionError("login required")
        return "report_view"

ctx = {}
assert LoginPage(ctx).submit("demo", "sandbox")
print(ReportPage(ctx).open())
print("auth", ctx["auth"])`,
        output: `report_view
auth authenticated`,
      },
      callout: {
        type: "info",
        title: "PO reduce acoplamiento",
        content:
          "Si cambia el label del botón, tocas un solo método, no 40 tests.",
      },
    },
    {
      heading: "Trace, screenshot y logs",
      subtopicId: "S23-T3-A",
      paragraphs: [
        "Ante falla, empaqueta **trace** (zip de Playwright con pasos, red y DOM), **screenshot** y un **error** tipado (string o clase). Las keys del paquete se ordenan alfabéticamente para diffs estables en CI. Sin ese trío, el on-call de operaciones en Lima no puede reproducir el flake del portal demo ni decidir si es selector, red o timeout de negocio.",
        "Filtra console logs por marcadores como `ERR`; el ruido de `info`/`nav ok` no debe ocultar el timeout del botón. Si `ok=False`, adjunta el path determinista `traces/{step}.zip` al paquete del step. En Playwright real activas tracing alrededor del flujo crítico y abres el zip en Trace Viewer; en el lab modelamos las mismas keys.",
        "Caso: step `download_report` / `s1` falla → paquete con `trace` + `screenshot` + `error`. Política de disco: traces en **falla** siempre; en éxito, sample rate bajo o desactivado para no saturar el runner. Fixtures sintéticos de operaciones (Lima, America/Lima); **nunca** PII real de clientes en screenshots ni en logs del ticket.",
      ],
      code: {
        language: 'python',
        title: "trace_fail.py",
        code: `def on_failure(step, error, console):
    return {
        "step": step,
        "error": str(error),
        "screenshot": f"shots/{step}.png",
        "trace": f"traces/{step}.zip",
        "console": console[-3:],
        "ok": False,
    }

console = ["nav ok", "fill ok", "ERR timeout button"]
ev = on_failure("download_report", TimeoutError("30000ms"), console)
print(ev["trace"], ev["console"][-1])
print("has_screenshot", ev["screenshot"].endswith(".png"))`,
        output: `traces/download_report.zip ERR timeout button
has_screenshot True`,
      },
      callout: {
        type: "tip",
        title: "Evidencia reproducible",
        content:
          "El adaptador web de CP-N2-C exige trace de éxito y de falla que otro analista pueda abrir y reproducir.",
      },
    },
    {
      heading: "Selectores robustos, retries y recovery",
      subtopicId: "S23-T3-B",
      paragraphs: [
        "Retries solo para errores **transitorios** (timeout, red, 429), **nunca** para CAPTCHA, 403 de negocio ni ToS. `should_retry(kind)` codifica esa política en una sola función legible para el runbook y el grader. Tras `max_attempts` de timeout → fail con conteo de intentos, no un loop infinito que castigue al portal demo ni al runner de CI.",
        "Recovery ante DOM inestable: si `err=='stale'` (nodo reemplazado tras re-render), la action es `goto_home` o re-nav al listado — **no** `continue` sobre un handle viejo. Tras la re-navegación re-obtienes el locator; reutilizar un handle de un árbol anterior es una fuente clásica de flakes en browser RPA.",
        "Reanudación con checkpoint: el robot guarda `last_ok_step` (p. ej. `login`, `form`) y, al reintentar la corrida, salta al **siguiente** paso en vez de rehacer todo el flujo. Eso evita doble-submit del login/form y hace la corrida **idempotente a nivel de paso** cuando el backend del portal demo lo permite (mismo periodo, mismo export).",
        "Caso sintético CASO-LIM-023: tres timeouts seguidos → fail con `attempts=3`. Un captcha en medio no se “reintenta con otro user-agent”: va a `human_handoff` (T4). El runbook documenta `max_attempts=3`, backoff opcional y la lista de pasos seguros de reanudar frente a los que exigen revisión humana.",
      ],
      code: {
        language: 'python',
        title: "retry_policy.py",
        code: `def should_retry(err_kind):
    return err_kind in {"timeout", "network", "429"}

def run_with_retry(fn, errors, max_attempts=3):
    attempts = 0
    for err in errors:
        attempts += 1
        if err is None:
            return {"ok": True, "attempts": attempts}
        if not should_retry(err) or attempts >= max_attempts:
            return {"ok": False, "attempts": attempts, "err": err}
    return {"ok": False, "attempts": attempts}

print(run_with_retry(None, ["timeout", None]))
print(run_with_retry(None, ["captcha"]))
print(run_with_retry(None, ["timeout", "timeout", "timeout"]))`,
        output: `{'ok': True, 'attempts': 2}
{'ok': False, 'attempts': 1, 'err': 'captcha'}
{'ok': False, 'attempts': 3, 'err': 'timeout'}`,
      },
      callout: {
        type: "danger",
        title: "No reintentes CAPTCHA",
        content:
          "CAPTCHA y ToS son stop conditions → handoff humano, no loop.",
      },
    },
    {
      heading: "API/export primero",
      subtopicId: "S23-T4-A",
      paragraphs: [
        "Jerarquía de preferencia del adapter: **api > export > rpa > human**. Si el sistema ofrece un endpoint o un CSV/xlsx export del **mismo** reporte, úsalo: menos flakes de UI, menos zonas grises de ToS, menos costo de operación. **RPA de browser es el último recurso de automatización**, no el default del web adapter de CP-N2-C — aunque sepas usar Playwright con maestría.",
        "Toda caída a RPA registra un `reason` (`no_api`, `export_stale`, `export_missing`, etc.) en el decision dict del run. Ese rastro habilita el ticket de “reemplazar por API” cuando el producto madure. Documenta la decisión en el **runbook** del adapter: qué capabilities se probaron, en qué orden, y por qué se eligió el canal actual.",
        "Caso de laboratorio: flags `api=False`, `export=True`, `rpa=True` → choice `export`. Si solo queda RPA → `method: rpa` con `reason: no_api`. El valor de negocio es el **dato verificado y auditable**, no el trofeo de “haber automatizado el click”. En operaciones sintéticas de backoffice eso se traduce en menos páginas rotas y más tiempo para el analista humano en excepciones reales.",
      ],
      code: {
        language: 'python',
        title: "api_first.py",
        code: `def choose_integration(options):
    # options: dict capability -> available
    if options.get("api"):
        return "api"
    if options.get("export_url"):
        return "export"
    if options.get("rpa_allowed"):
        return "rpa"
    return "human"

print(choose_integration({"api": True, "rpa_allowed": True}))
print(choose_integration({"api": False, "export_url": True}))
print(choose_integration({"api": False, "export_url": False, "rpa_allowed": False}))`,
        output: `api
export
human`,
      },
      callout: {
        type: "info",
        title: "RPA es plan B",
        content:
          "Cada flujo RPA debe tener ticket de “reemplazar por API” cuando exista.",
      },
    },
    {
      heading: "Términos, CAPTCHA, desktop fallback y handoff humano",
      subtopicId: "S23-T4-B",
      paragraphs: [
        "Si **ToS forbidden** para automatización, `action=abort` (**ToS gana** sobre CAPTCHA y sobre el argumento “pero es urgente”). Si `captcha=True` y los términos permiten intervención humana, la action es **human_handoff** con payload mínimo `url` / `step` / `screenshot` — nunca scripts de bypass, granjas de captcha ni user-agents rotativos en este curso ni en operación responsable.",
        "Desktop fallback (app nativa, OCR de pantalla, etc.) solo si el **contrato del sistema** lo contempla y está en el scope del adapter; no es una puerta trasera para evadir políticas web. El handoff debe ser accionable en minutos: un analista de operaciones en Lima abre el ticket, ve el step y la captura, y continúa sin reconstruir el contexto desde cero.",
        "Caso PE sintético: portal demo muestra captcha de prueba → `human_handoff`; `tos_forbidden=True` → `abort` aunque también haya captcha. El matching o la validación de datos **después** del download sigue siendo evidencia de integridad del reporte, **no** prueba de fraude ni parentesco. El adaptador web de CP-N2-C respeta límites legales, de producto y de ética profesional.",
      ],
      code: {
        language: 'python',
        title: "handoff.py",
        code: `def handle_blockers(signals):
    if signals.get("tos_forbidden"):
        return {"action": "abort", "reason": "tos"}
    if signals.get("captcha"):
        return {"action": "human_handoff", "reason": "captcha", "queue": "ops_review"}
    if signals.get("ui_changed"):
        return {"action": "human_handoff", "reason": "selector_break"}
    return {"action": "continue"}

print(handle_blockers({"captcha": True}))
print(handle_blockers({"tos_forbidden": True}))
print(handle_blockers({}))`,
        output: `{'action': 'human_handoff', 'reason': 'captcha', 'queue': 'ops_review'}
{'action': 'abort', 'reason': 'tos'}
{'action': 'continue'}`,
      },
      callout: {
        type: "warning",
        title: "Ética del robot",
        content:
          "Automatizar login en contra de ToS o resolver CAPTCHA con granjas no es aceptable en este curso ni en producción responsable.",
      },
    },
  ],
  iDo: {
    intro:
      "Te muestro el **web adapter** de CP-N2-C en ocho demos (uno por subtema). Cada uno modela una decisión del robot: qué locator usar, cuándo esperar, cómo verificar un download, cómo encapsular auth, qué evidencia guardar, qué reintentar, cuándo preferir API y cuándo parar ante CAPTCHA. En el lab usamos dicts; la semántica es la de Playwright (`get_by_role`, auto-wait, download, tracing). La salida mostrada **coincide exactamente** con lo que imprime el código: es el modelo que copiarás en We Do.",
    steps: [
      {
        demoId: "S23-T1-A-DEMO",
        subtopicId: "S23-T1-A",
        environment: "local",
        description:
          "Resolver el botón Enviar por role+name (no por índice CSS) en un DOM sintético de dos botones.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `nodes = [{"role": "button", "name": "Enviar"}, {"role": "button", "name": "Cancelar"}]

def by_role(role, name):
    return next(n for n in nodes if n["role"] == role and n["name"] == name)

print(by_role("button", "Enviar")["name"])
print("locators", "role_first")
print("ok", True)
`,
          output: `Enviar
locators role_first
ok True`,
        },
        why: "Decisión: el usuario y el árbol de accesibilidad ven “Enviar”, no `div:nth-child(2)`. Si el layout cambia y el rol se mantiene, el robot sigue estable (a11y = estabilidad).",
      },
      {
        demoId: "S23-T1-B-DEMO",
        subtopicId: "S23-T1-B",
        environment: "local",
        description:
          "Simular auto-wait: sondear hasta que el control esté listo en el intento 3; sin sleep fijo.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def wait_visible(max_i=5, ready_at=3):
    for i in range(max_i):
        if i == ready_at:
            return i
    return None

print("visible", wait_visible())
print("auto_wait", True)
print("ok", True)
`,
          output: `visible 3
auto_wait True
ok True`,
        },
        why: "Decisión: esperamos una **condición** (ready_at), no un sleep de 5 s. Sleep fijo falla en CI lento y desperdicia tiempo en CI rápido — es la raíz de muchos tests flaky.",
      },
      {
        demoId: "S23-T2-A-DEMO",
        subtopicId: "S23-T2-A",
        environment: "local",
        description:
          "Rellenar un form de periodo, simular download y verificar el binario con sha256 truncado a 8 (contrato de integridad).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `import hashlib

def fill(form, **fields):
    form.update(fields)
    return form

def download_sha(blob):
    return hashlib.sha256(blob).hexdigest()[:8]

form = fill({}, q="enero", periodo="2026-01")
sha = download_sha(b"data")
print("filled", form)
print("sha", sha)
print("ok", True)
`,
          output: `filled {'q': 'enero', 'periodo': '2026-01'}
sha 3a6eb079
ok True`,
        },
        why: "Decisión: el éxito del step no es “el click no lanzó”. Es el **archivo correcto** (hash o tamaño). Checksum mismatch → fallo con evidencia, no éxito silencioso.",
      },
      {
        demoId: "S23-T2-B-DEMO",
        subtopicId: "S23-T2-B",
        environment: "local",
        description:
          "Encapsular el login en un Page Object que muta el contexto de sesión (auth).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `class Login:
    def go(self, ctx):
        ctx["auth"] = True
        return ctx

ctx = Login().go({})
print("auth", ctx["auth"])
print("page_object", True)
print("ok", True)
`,
          output: `auth True
page_object True
ok True`,
        },
        why: "Decisión: el estado vive en `ctx` y la acción en el PO. Si cambia el selector del botón Login, tocas un método — no 20 tests de reporte.",
      },
      {
        demoId: "S23-T3-A-DEMO",
        subtopicId: "S23-T3-A",
        environment: "local",
        description:
          "Empaquetar evidencia mínima de falla por step: trace path, screenshot y error tipado; keys estables para CI.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def failure_package(step, err):
    return {
        "step": step,
        "trace": f"traces/{step}.zip",
        "shot": f"shots/{step}.png",
        "error": err,
        "ok": False,
    }

pkg = failure_package("export", "TimeoutError")
print(pkg)
print("keys", sorted(pkg.keys()))
print("ok", True)
`,
          output: `{'step': 'export', 'trace': 'traces/export.zip', 'shot': 'shots/export.png', 'error': 'TimeoutError', 'ok': False}
keys ['error', 'ok', 'shot', 'step', 'trace']
ok True`,
        },
        why: "Decisión: sin trace + screenshot + error, el on-call en Lima no reproduce el flake del portal demo. Un print suelto no es paquete de evidencia.",
      },
      {
        demoId: "S23-T3-B-DEMO",
        subtopicId: "S23-T3-B",
        environment: "local",
        description:
          "Retry selectivo: un timeout se reintenta y llega a ok; un captcha va a handoff (no se reintenta).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def retry(kinds):
    for i, k in enumerate(kinds, 1):
        if k == "ok":
            return i
        if k == "captcha":
            return "human_handoff"
    return "exhausted"

print(retry(["timeout", "ok"]))
print(retry(["captcha"]))
print("retry_ok", True)
print("ok", True)
`,
          output: `2
human_handoff
retry_ok True
ok True`,
        },
        why: "Decisión: reintentamos fallas **transitorias** (timeout). CAPTCHA es stop condition ética: handoff humano, nunca “otro user-agent” ni loop infinito.",
      },
      {
        demoId: "S23-T4-A-DEMO",
        subtopicId: "S23-T4-A",
        environment: "local",
        description:
          "Elegir canal de integración: con export disponible y sin API, preferir export sobre RPA.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def choose_channel(opts):
    if opts.get("api"):
        return "api"
    if opts.get("export_url"):
        return "export"
    if opts.get("rpa"):
        return "rpa"
    return "none"

print(choose_channel({"api": False, "export_url": True, "rpa": True}))
print("api_first", True)
print("ok", True)
`,
          output: `export
api_first True
ok True`,
        },
        why: "Decisión: jerarquía api > export > rpa > human. Aunque rpa=True, el CSV/export del mismo reporte gana: menos flakes y menos riesgo de ToS.",
      },
      {
        demoId: "S23-T4-B-DEMO",
        subtopicId: "S23-T4-B",
        environment: "local",
        description:
          "Ante captcha en el portal demo, detener el robot y escalar a humano (sin bypass).",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def handoff(sig):
    if sig.get("captcha") or sig.get("tos"):
        return "human_handoff"
    return "continue"

print(handoff({"captcha": True}))
print("no_bypass", True)
print("ok", True)
`,
          output: `human_handoff
no_bypass True
ok True`,
        },
        why: "Decisión: handoff es parte del **contrato** del adapter, no un fracaso. Bypass de CAPTCHA/ToS queda fuera del curso y de la operación responsable.",
      },
    ],
  },
  weDo: {
    intro:
      "24 ejercicios (guiado → independiente → transferencia) por subtema. Cada starter trae **un defecto intencional** marcado con `# Arregla:`: corrige solo ese defecto. La salida de tu script debe coincidir **exactamente** con la del contrato (mismas líneas, sin prints extra). Practicas locators, auto-wait, forms/downloads, Page Objects, traces, retries, API-first y handoff.",
    steps: [
      {
        id: "S23-T1-A-E1",
        subtopicId: "S23-T1-A",
        kind: "guided",
        instruction:
          "CASO-LIM-023 · Locator por rol. En nodes hay un link Inicio (id n1). Encuentra role=link y name=Inicio e imprime solo el id. Predicado role+name (no CSS); si no hay match, falla ruidoso. Salida esperada: n1",
        hint: "Filtra por role y name; devuelve el id del primer match.",
        hints: [
          "Un locator de usuario mira el rol accesible y el nombre, no el índice CSS.",
          "Si usas next(...), el predicado debe exigir role='link' y name='Inicio'.",
          "Si no hay match, es mejor fallar ruidoso que devolver el primer nodo cualquiera.",
        ],
        edgeCases: ["StopIteration si no existe"],
        tests: "Stdout exacto: una línea `n1`. Sin prints extra ni el dict completo del nodo.",
        feedback: "Debiste imprimir solo n1: el link Inicio, no un button inexistente.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · locator por role+name
# Arregla: busca role=button en vez de link
nodes=[{'role':'link','name':'Inicio','id':'n1'}]
print(next((n['id'] for n in nodes if n['role']=='button' and n['name']=='Inicio'), None))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes=[{'role':'link','name':'Inicio','id':'n1'}]
print(next(n['id'] for n in nodes if n['role']=='link' and n['name']=='Inicio'))`,
          output: `n1`,
        },
      },
      {
        id: "S23-T1-A-E2",
        subtopicId: "S23-T1-A",
        kind: "independent",
        instruction:
          "CASO-LIM-023 · Prioridad de locators. Tienes strats=['css','role','testid'] y un dict order. Ordena priorizando role → testid → css (usa key, no orden alfabético) e imprime la lista. Salida esperada: ['role', 'testid', 'css']",
        hint: "Usa order={...} como key de sorted, no sorted(strats) a secas.",
        hints: [
          "La política didáctica es role primero, luego testid, CSS al final.",
          "order['role']=0 hace que role quede antes que css aunque 'c' < 'r' alfabéticamente.",
          "sorted(strats) sin key da orden alfabético incorrecto para esta política.",
        ],
        edgeCases: ["texto también válido como estrategia intermedia"],
        tests: "Stdout exacto: `['role', 'testid', 'css']` (repr de lista). No orden alfabético.",
        feedback: "La lista correcta es role, testid, css — no el orden alfabético.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · prioridad role > testid > css
# Arregla: ordena por nombre alfabético
strats=['css','role','testid']
order={'role':0,'testid':1,'css':2}
print(sorted(strats))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `strats=['css','role','testid']
order={'role':0,'testid':1,'css':2}
print(sorted(strats, key=lambda s: order[s]))`,
          output: `['role', 'testid', 'css']`,
        },
      },
      {
        id: "S23-T1-A-E3",
        subtopicId: "S23-T1-A",
        kind: "transfer",
        instruction:
          "CASO-LIM-023 · Sin control usable. nodes solo tiene un img logo. Al buscar button: imprime 'need_testid' si no hay role button; si hubiera, su name. Fail-closed cuando falta rol usable. Salida esperada: need_testid",
        hint: "Filtra hits por role=='button'; si la lista está vacía → need_testid.",
        hints: [
          "Un logo img no es un control interactivo de negocio.",
          "No uses nodes[0] sin filtrar: el primer nodo puede ser decorativo.",
          "Coordina con frontend un data-testid si el producto no expone rol.",
        ],
        edgeCases: ["coordina con frontend"],
        tests: "Stdout exacto: `need_testid`. No imprimas el name del img decorativo.",
        feedback: "Sin button usable la respuesta correcta es need_testid, no el name del logo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · sin role usable → need_testid
# Arregla: asume primer nodo sin filtrar role
nodes=[{'role':'img','name':'logo'}]
hits=[n for n in nodes if n['role']=='button']
print(nodes[0]['name'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes=[{'role':'img','name':'logo'}]
hits=[n for n in nodes if n['role']=='button']
print(hits[0]['name'] if hits else 'need_testid')`,
          output: `need_testid`,
        },
      },
      {
        id: "S23-T1-B-E1",
        subtopicId: "S23-T1-B",
        kind: "guided",
        instruction:
          "CASO-LIM-023 · Auto-wait simulado. ready se vuelve True en el intento 2 de un loop 1..3. Imprime el número de intento cuando ready y sal del loop (condición, no sleep). Salida esperada: 2",
        hint: "Cuando ready sea True: print(i) y break.",
        hints: [
          "El auto-wait de Playwright espera una condición, no un sleep fijo.",
          "Si solo haces pass dentro del if, el print posterior usa el último i del for.",
          "break evita seguir iterando después del primer ready.",
        ],
        edgeCases: ["timeout path"],
        tests: "Stdout exacto: `2` (primer i con ready). No el último i del for sin break.",
        feedback: "Debiste imprimir 2 (primer intento ready) y cortar el loop, no el último i.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · auto-wait imprime i cuando ready
# Arregla: imprime siempre el último i
for i in range(1, 4):
    ready = i >= 2
    if ready:
        pass
print(i)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `for i in range(1, 4):
    ready = i >= 2
    if ready:
        print(i)
        break`,
          output: `2`,
        },
      },
      {
        id: "S23-T1-B-E2",
        subtopicId: "S23-T1-B",
        kind: "independent",
        instruction:
          "CASO-LIM-023 · Timeout de espera. ready=False fijo; tras 3 intentos sin ready imprime 'timeout' (no reintentar infinito: for-else o contador). Salida esperada: timeout",
        hint: "El bloque else del for corre solo si no hubo break.",
        hints: [
          "Si ready nunca es True, no debes imprimir ok.",
          "for-else en Python: else se ejecuta cuando el loop termina sin break.",
          "En Playwright real el análogo es timeout de expect, no sleep de 5s.",
        ],
        edgeCases: ["timeout_ms en Playwright"],
        tests: "Stdout exacto: `timeout`. No imprimas ok si ready nunca fue True.",
        feedback: "Tras agotar intentos sin ready la salida es timeout, no ok.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · for-else timeout
# Arregla: imprime ok aunque ready sigue False
ready = False
for i in range(3):
    if ready:
        print('ok')
        break
else:
    print('ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ready = False
for i in range(3):
    if ready:
        print('ok')
        break
else:
    print('timeout')`,
          output: `timeout`,
        },
      },
      {
        id: "S23-T1-B-E3",
        subtopicId: "S23-T1-B",
        kind: "transfer",
        instruction:
          "CASO-LIM-023 · Postcondición web-first (transfer). Implementa assert_ready(page) que devuelve 'pass' solo si title == 'Portal demo' Y buttons >= 1; si no, 'fail'. Prueba dos páginas: la buena y una vacía (buttons=0). Imprime dos líneas. Salida esperada:\npass\nfail",
        hint: "Define assert_ready con el predicado combinado; invócala dos veces.",
        hints: [
          "Una assertion web-first documenta la postcondición completa del paso, no un solo campo.",
          "Si solo comparas el título e ignoras buttons, un portal vacío pasaría mal.",
          "En Playwright real: expect(page).to_have_title(...) y expect(get_by_role(...)).to_be_visible().",
        ],
        edgeCases: ["soft assertions fuera de alcance", "buttons=0 debe fallar"],
        tests: "Stdout exacto (2 líneas): pass luego fail. Función reutilizable, no un if suelto hardcodeado.",
        feedback: "La página buena debe pasar; la vacía (buttons=0) debe fallar aunque el título sea correcto.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · assertion título + control usable
# Arregla: siempre imprime pass (ignora buttons)
def assert_ready(page):
    return 'pass' if page.get('title') == 'Portal demo' else 'fail'

good = {'title': 'Portal demo', 'buttons': 1}
empty = {'title': 'Portal demo', 'buttons': 0}
print(assert_ready(good))
print(assert_ready(empty))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def assert_ready(page):
    ok = page.get('title') == 'Portal demo' and page.get('buttons', 0) >= 1
    return 'pass' if ok else 'fail'

good = {'title': 'Portal demo', 'buttons': 1}
empty = {'title': 'Portal demo', 'buttons': 0}
print(assert_ready(good))
print(assert_ready(empty))`,
          output: `pass
fail`,
        },
      },
      {
        id: "S23-T2-A-E1",
        subtopicId: "S23-T2-A",
        kind: "guided",
        instruction:
          "CASO-LIM-023 · Fill de formulario. form={}; asigna usuario='ana' y periodo='2026-01'; imprime form. Mutar el dict con ambos campos (no hardcodear el print del resultado). Salida esperada: {'usuario': 'ana', 'periodo': '2026-01'}",
        hint: "Asigna form['usuario'] y form['periodo'] antes del print.",
        hints: [
          "fill en Playwright escribe en cada control; aquí el análogo es mutar el dict campo a campo.",
          "Si solo asignas usuario y omites periodo, el contrato del reporte falla.",
          "No hardcodees el dict en el print: asigna ambos campos y luego imprime form.",
        ],
        edgeCases: ["campos vacíos", "periodo mal formateado"],
        tests: "Stdout exacto: dict con usuario='ana' y periodo='2026-01' (orden de inserción de Python 3.7+).",
        feedback: "El form impreso debe incluir usuario='ana' y periodo='2026-01' tras el fill.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · fill form (usuario + periodo)
# Arregla: no asigna los campos del reporte
form = {}
# form['usuario'] = 'ana'
# form['periodo'] = '2026-01'
print(form)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `form = {}
form['usuario'] = 'ana'
form['periodo'] = '2026-01'
print(form)`,
          output: `{'usuario': 'ana', 'periodo': '2026-01'}`,
        },
      },
      {
        id: "S23-T2-A-E2",
        subtopicId: "S23-T2-A",
        kind: "independent",
        instruction:
          "CASO-LIM-023 · Integridad del download. Calcula sha256 hex de b'data', primeros 8 chars (import hashlib). Usa SHA-256, no MD5. Salida esperada: 3a6eb079",
        hint: "hashlib.sha256(blob).hexdigest()[:8]",
        hints: [
          "El click de download no basta: valida integridad del binario.",
          "MD5 y SHA-256 producen digests distintos; el contrato pide SHA-256.",
          "Trunca a 8 hex chars para el lab; en prod suele guardarse el digest completo.",
        ],
        edgeCases: ["archivos grandes: hash streaming"],
        tests: "Stdout exacto: `3a6eb079` (sha256 de b'data'[:8]). No MD5.",
        feedback: "Debiste usar sha256 de b'data' truncado a 8: 3a6eb079.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · hash de download
# Arregla: usa md5 truncado en vez de sha256
import hashlib
print(hashlib.md5(b'data').hexdigest()[:8])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib
print(hashlib.sha256(b'data').hexdigest()[:8])`,
          output: `3a6eb079`,
        },
      },
      {
        id: "S23-T2-A-E3",
        subtopicId: "S23-T2-A",
        kind: "transfer",
        instruction:
          "CASO-LIM-023 · Reuso de sesión (storage_state conceptual, transfer). Implementa session_mode(state): si hay token → 'reuse'; si no → 'login'. Evalúa state con token y state vacío; imprime dos líneas. Salida esperada:\nreuse\nlogin",
        hint: "def session_mode(state): return 'reuse' if state.get('token') else 'login'",
        hints: [
          "storage_state en Playwright reutiliza cookies/localStorage entre tests.",
          "Re-loguear en cada caso multiplica flakes y tiempo de suite.",
          "La función debe servir para ambos estados: con y sin token.",
        ],
        edgeCases: ["expiry del token", "token vacío string"],
        tests: "Stdout exacto (2 líneas): reuse luego login. Función reutilizable sobre el dict state.",
        feedback: "Con token → reuse; sin token → login. Ambas líneas deben salir en ese orden.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · reuso de sesión (storage_state)
# Arregla: siempre devuelve login
def session_mode(state):
    return 'login'

print(session_mode({'token': 't'}))
print(session_mode({}))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def session_mode(state):
    return 'reuse' if state.get('token') else 'login'

print(session_mode({'token': 't'}))
print(session_mode({}))`,
          output: `reuse
login`,
        },
      },
      {
        id: "S23-T2-B-E1",
        subtopicId: "S23-T2-B",
        kind: "guided",
        instruction:
          "CASO-LIM-023 · Page Object LoginPage. Implementa submit(self, ctx, password) que setea ctx['auth'] = (password == 'sandbox'). Llama con password 'sandbox' e imprime ctx['auth']. El estado vive en el contexto, no en self.auth. Salida esperada: True",
        hint: "Dentro de submit: ctx['auth'] = password == 'sandbox'.",
        hints: [
          "El Page Object encapsula la acción; el estado de sesión vive en ctx.",
          "No reescribas la firma: submit(self, ctx, password).",
          "Sandbox del lab: solo password 'sandbox' autentica (nunca secretos reales).",
        ],
        edgeCases: ["no hardcodees secretos reales"],
        tests: "Stdout exacto: `True`. ctx['auth'] debe mutarse dentro de submit, no en el print.",
        feedback: "submit debe setear ctx['auth'] a True cuando password es sandbox.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · Page Object login sandbox
class LoginPage:
    def submit(self, ctx, password):
        # Arregla: no setea auth en ctx
        pass

ctx = {}
LoginPage().submit(ctx, 'sandbox')
print(ctx.get('auth'))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `class LoginPage:
    def submit(self, ctx, password):
        ctx['auth'] = password == 'sandbox'
ctx={}
LoginPage().submit(ctx, 'sandbox')
print(ctx['auth'])`,
          output: `True`,
        },
      },
      {
        id: "S23-T2-B-E2",
        subtopicId: "S23-T2-B",
        kind: "independent",
        instruction:
          "CASO-LIM-023 · Guard de auth. ctx tiene auth False; al abrir el reporte debe denegar. Captura PermissionError e imprime 'denied' (no continuar sin sesión). Salida esperada: denied",
        hint: "Envuelve el raise en try/except PermissionError.",
        hints: [
          "Sin autenticación el robot no debe seguir al download.",
          "try/except convierte el error en una decisión de negocio ('denied').",
          "En UI real el análogo puede ser redirect a login; aquí modelamos con excepción.",
        ],
        edgeCases: ["redirect a login en UI real"],
        tests: "Stdout exacto: `denied`. El proceso no debe terminar con excepción no capturada.",
        feedback: "Sin auth debiste capturar PermissionError e imprimir denied.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · guard de auth
# Arregla: no captura PermissionError
ctx={'auth':False}
if not ctx.get('auth'):
    raise PermissionError('login required')
print('ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ctx={'auth':False}
try:
    if not ctx.get('auth'):
        raise PermissionError('login required')
    print('ok')
except PermissionError:
    print('denied')`,
          output: `denied`,
        },
      },
      {
        id: "S23-T2-B-E3",
        subtopicId: "S23-T2-B",
        kind: "transfer",
        instruction:
          "CASO-LIM-023 · Transición de estado (transfer). Implementa apply_login(state, login_ok): si login_ok y state=='anonymous' → 'authenticated'; si no, deja state. Prueba login_ok True y False desde anonymous; imprime dos líneas. Salida esperada:\nauthenticated\nanonymous",
        hint: "Solo muta cuando login_ok es True; en False devuelve el state original.",
        hints: [
          "Los estados de página (anonymous → authenticated) guían qué acciones son legales.",
          "Un login fallido no debe fingir authenticated.",
          "En sistemas reales puede existir mfa_pending como estado intermedio (fuera de alcance aquí).",
        ],
        edgeCases: ["mfa_pending intermedio", "doble apply idempotente"],
        tests: "Stdout exacto (2 líneas): authenticated luego anonymous.",
        feedback: "login_ok True avanza a authenticated; login_ok False deja anonymous.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · transición de estado
# Arregla: siempre devuelve authenticated
def apply_login(state, login_ok):
    return 'authenticated'

print(apply_login('anonymous', True))
print(apply_login('anonymous', False))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def apply_login(state, login_ok):
    if login_ok and state == 'anonymous':
        return 'authenticated'
    return state

print(apply_login('anonymous', True))
print(apply_login('anonymous', False))`,
          output: `authenticated
anonymous`,
        },
      },
      {
        id: "S23-T3-A-E1",
        subtopicId: "S23-T3-A",
        kind: "guided",
        instruction:
          "CASO-LIM-023 · Paquete de evidencia. ev tiene keys trace, screenshot, error. Imprime sorted(keys) — forma estable para diffs, no los values. Salida esperada: ['error', 'screenshot', 'trace']",
        hint: "sorted(ev.keys()), no sorted(ev.values()).",
        hints: [
          "El paquete de falla se compara por forma (keys), no por el texto del error.",
          "Ordenar keys hace el output determinista en CI.",
          "No imprimas los paths: el contrato pide las claves.",
        ],
        edgeCases: ["PII en screenshots"],
        tests: "Stdout exacto: `['error', 'screenshot', 'trace']`. Keys ordenadas, no values.",
        feedback: "Debiste listar las keys ordenadas: error, screenshot, trace.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · keys del paquete de falla
# Arregla: imprime values no keys
ev={'trace':'a.zip','screenshot':'b.png','error':'x'}
print(sorted(ev.values()))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ev={'trace':'a.zip','screenshot':'b.png','error':'x'}
print(sorted(ev.keys()))`,
          output: `['error', 'screenshot', 'trace']`,
        },
      },
      {
        id: "S23-T3-A-E2",
        subtopicId: "S23-T3-A",
        kind: "independent",
        instruction:
          "CASO-LIM-023 · Filtro de console. logs=['ok','ERR timeout','nav']; imprime solo las líneas que contienen 'ERR' (el ruido de info no debe ocultar el timeout). Salida esperada: ['ERR timeout']",
        hint: "[l for l in logs if 'ERR' in l]",
        hints: [
          "El on-call necesita ver ERR, no el stream completo de info.",
          "Una list comp con 'ERR' in l filtra sin mutar la lista original.",
          "Imprimir logs entero falla el contrato del grader.",
        ],
        edgeCases: ["niveles de log"],
        tests: "Stdout exacto: `['ERR timeout']`. Solo líneas que contienen ERR.",
        feedback: "Solo la línea con ERR timeout debe quedar en la lista impresa.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · filtrar ERR en logs
# Arregla: no filtra
logs=['ok','ERR timeout','nav']
print(logs)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `logs=['ok','ERR timeout','nav']
print([l for l in logs if 'ERR' in l])`,
          output: `['ERR timeout']`,
        },
      },
      {
        id: "S23-T3-A-E3",
        subtopicId: "S23-T3-A",
        kind: "transfer",
        instruction:
          "CASO-LIM-023 · Trace en falla. ok=False, pkg={'step':'s1'}; si not ok añade pkg['trace']='traces/s1.zip' e imprime pkg. Path determinista por step. Salida esperada: {'step': 's1', 'trace': 'traces/s1.zip'}",
        hint: "if not ok: pkg['trace'] = 'traces/s1.zip'",
        hints: [
          "Sin trace el fallo del portal demo no es accionable para el on-call.",
          "El path traces/{step}.zip debe ser determinista para el grader y para CI.",
          "Solo adjunta trace cuando ok es False (política de no llenar disco).",
        ],
        edgeCases: ["retener traces N días"],
        tests: "Stdout exacto: dict con step s1 y trace traces/s1.zip (orden de keys de inserción).",
        feedback: "Con ok=False el pkg debe incluir trace traces/s1.zip.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · adjuntar trace en falla
# Arregla: no adjunta trace cuando ok=False
ok=False
pkg={'step':'s1'}
print(pkg)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ok=False
pkg={'step':'s1'}
if not ok:
    pkg['trace']='traces/s1.zip'
print(pkg)`,
          output: `{'step': 's1', 'trace': 'traces/s1.zip'}`,
        },
      },
      {
        id: "S23-T3-B-E1",
        subtopicId: "S23-T3-B",
        kind: "guided",
        instruction:
          "CASO-LIM-023 · Política should_retry. True solo para 'timeout' y '429'. Prueba timeout, captcha y 429; imprime tres líneas 'kind bool'. CAPTCHA nunca se reintenta. Salida esperada (3 líneas):\ntimeout True\ncaptcha False\n429 True",
        hint: "return k in {'timeout', '429'} — sin captcha.",
        hints: [
          "Reintentar CAPTCHA es un anti-patrón ético y técnico.",
          "Timeout y 429 son transitorios; captcha es stop condition.",
          "El orden de impresión es timeout, captcha, 429.",
        ],
        edgeCases: ["no reintentar 403"],
        tests: "Stdout exacto (3 líneas): timeout True / captcha False / 429 True.",
        feedback: "captcha debe dar False; timeout y 429, True.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · retry solo timeout/429
def should_retry(k):
    # Arregla: reintenta captcha también
    return k in {'timeout', '429', 'captcha'}

for k in ['timeout','captcha','429']:
    print(k, should_retry(k))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def should_retry(k):
    return k in {'timeout', '429'}
for k in ('timeout','captcha','429'):
    print(k, should_retry(k))`,
          output: `timeout True
captcha False
429 True`,
        },
      },
      {
        id: "S23-T3-B-E2",
        subtopicId: "S23-T3-B",
        kind: "independent",
        instruction:
          "CASO-LIM-023 · Recovery stale DOM. Implementa recover(err): 'stale' → 'goto_home'; 'timeout' → 'retry'; otro → 'continue'. Prueba stale y timeout; imprime dos líneas. Salida esperada:\ngoto_home\nretry",
        hint: "if/elif sobre err; no uses continue para stale.",
        hints: [
          "Un handle de locator viejo tras re-render suele fallar o clickear mal.",
          "goto_home (o re-nav al listado) resetea el contexto de página.",
          "timeout es transitorio → retry; stale es DOM reemplazado → re-nav.",
        ],
        edgeCases: ["checkpoint de paso para reanudar", "selector_break → handoff en T4"],
        tests: "Stdout exacto (2 líneas): goto_home luego retry.",
        feedback: "stale → goto_home; timeout → retry. continue en stale perpetúa el flake.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · recovery stale vs timeout
# Arregla: stale devuelve continue
def recover(err):
    if err == 'stale':
        return 'continue'
    if err == 'timeout':
        return 'retry'
    return 'continue'

print(recover('stale'))
print(recover('timeout'))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def recover(err):
    if err == 'stale':
        return 'goto_home'
    if err == 'timeout':
        return 'retry'
    return 'continue'

print(recover('stale'))
print(recover('timeout'))`,
          output: `goto_home
retry`,
        },
      },
      {
        id: "S23-T3-B-E3",
        subtopicId: "S23-T3-B",
        kind: "transfer",
        instruction:
          "CASO-LIM-023 · Reanudación con checkpoint. steps=['login','form','export']; last_ok_step='login' (login ya OK). Imprime el **siguiente** step a ejecutar (no rehacer login). Reanudación idempotente a nivel de paso; evita doble-submit. Salida esperada: form",
        hint: "Localiza el índice de last_ok_step en steps y toma steps[i+1].",
        hints: [
          "El runbook guarda last_ok_step para reanudar sin repetir pasos ya confirmados.",
          "Si last_ok_step es 'login', el siguiente es 'form' (índice + 1).",
          "Rehacer login/form innecesariamente puede doble-submittear el portal demo.",
        ],
        edgeCases: ["last_ok_step al final del flujo", "backoff si el next step timeout"],
        tests: "Stdout exacto: `form` (siguiente step tras last_ok_step='login').",
        feedback: "Tras login_ok el siguiente step a ejecutar es form, no login de nuevo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · reanudación por checkpoint
# Arregla: reimprime siempre el primer step
steps = ['login', 'form', 'export']
last_ok_step = 'login'
print(steps[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `steps = ['login', 'form', 'export']
last_ok_step = 'login'
i = steps.index(last_ok_step)
print(steps[i + 1])`,
          output: `form`,
        },
      },
      {
        id: "S23-T4-A-E1",
        subtopicId: "S23-T4-A",
        kind: "guided",
        instruction:
          "CASO-LIM-023 · API-first. caps={'api': True, 'export': True, 'rpa': True}. Elige el mejor canal (api > export > rpa) e imprime solo ese string. Si api está disponible, gana aunque export y rpa también existan. Salida esperada: api",
        hint: "Evalúa caps.get('api') primero; no mires rpa antes que api.",
        hints: [
          "Si hay API, el adapter no debe caer a RPA ni a export por costumbre.",
          "El starter elige rpa a propósito aunque api=True.",
          "El valor de negocio es el dato verificado, no el click automatizado.",
        ],
        edgeCases: ["feature flags", "api cae a mitad de corrida"],
        tests: "Stdout exacto: `api`. No rpa aunque rpa=True.",
        feedback: "Con api=True la elección correcta es api, no rpa ni export.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · api first (jerarquía)
# Arregla: elige rpa aunque api=True
caps = {'api': True, 'export': True, 'rpa': True}
print('rpa')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `caps = {'api': True, 'export': True, 'rpa': True}
if caps.get('api'):
    print('api')
elif caps.get('export'):
    print('export')
elif caps.get('rpa'):
    print('rpa')
else:
    print('human')`,
          output: `api`,
        },
      },
      {
        id: "S23-T4-A-E2",
        subtopicId: "S23-T4-A",
        kind: "independent",
        instruction:
          "CASO-LIM-023 · Cascada api > export > rpa. flags api=False, export=True, rpa=True → imprime 'export' (primera capacidad disponible en la jerarquía). Salida esperada: export",
        hint: "if api → elif export → elif rpa → else human.",
        hints: [
          "No elijas rpa solo porque rpa=True; mira la jerarquía completa.",
          "export cubre CSV/xlsx del mismo reporte sin UI frágil.",
          "Documenta la decisión en el runbook cuando caigas a RPA.",
        ],
        edgeCases: ["documenta la decisión"],
        tests: "Stdout exacto: `export`. Cascada api > export > rpa con api=False.",
        feedback: "Con export disponible la cascada debe devolver export.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · cascada api>export>rpa
# Arregla: elige rpa primero
f={'api':False,'export':True,'rpa':True}
c='rpa'
print(c)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `f={'api':False,'export':True,'rpa':True}
if f.get('api'):
    c='api'
elif f.get('export'):
    c='export'
elif f.get('rpa'):
    c='rpa'
else:
    c='human'
print(c)`,
          output: `export`,
        },
      },
      {
        id: "S23-T4-A-E3",
        subtopicId: "S23-T4-A",
        kind: "transfer",
        instruction:
          "CASO-LIM-023 · Decisión documentada (transfer). Implementa decide(caps): si no hay api ni export y rpa_allowed → dict method='rpa' y reason='no_api'; si hay export → method='export' reason='export_ok'. Imprime decide para dos caps (solo rpa; con export). Salida esperada:\n{'method': 'rpa', 'reason': 'no_api'}\n{'method': 'export', 'reason': 'export_ok'}",
        hint: "Evalúa api primero, luego export, luego rpa con reason.",
        hints: [
          "Sin reason el equipo no sabe si RPA es temporal o permanente.",
          "reason='no_api' habilita el ticket de 'reemplazar por API'.",
          "Con export disponible no debes caer a RPA aunque rpa_allowed=True.",
        ],
        edgeCases: ["ticket de reemplazo API", "export_stale como reason alternativo"],
        tests: "Stdout exacto (2 líneas de dict): rpa/no_api luego export/export_ok.",
        feedback: "Primera decisión: RPA con reason no_api. Segunda: export con export_ok.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · documentar decisión de canal
# Arregla: siempre rpa sin mirar export
def decide(caps):
    return {'method': 'rpa', 'reason': 'no_api'}

print(decide({'api': False, 'export': False, 'rpa_allowed': True}))
print(decide({'api': False, 'export': True, 'rpa_allowed': True}))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def decide(caps):
    if caps.get('api'):
        return {'method': 'api', 'reason': 'api_ok'}
    if caps.get('export'):
        return {'method': 'export', 'reason': 'export_ok'}
    if caps.get('rpa_allowed'):
        return {'method': 'rpa', 'reason': 'no_api'}
    return {'method': 'human', 'reason': 'no_channel'}

print(decide({'api': False, 'export': False, 'rpa_allowed': True}))
print(decide({'api': False, 'export': True, 'rpa_allowed': True}))`,
          output: `{'method': 'rpa', 'reason': 'no_api'}
{'method': 'export', 'reason': 'export_ok'}`,
        },
      },
      {
        id: "S23-T4-B-E1",
        subtopicId: "S23-T4-B",
        kind: "guided",
        instruction:
          "CASO-LIM-023 · CAPTCHA en portal demo. captcha=True → imprime 'human_handoff' (sin bypass ni granja). Handoff humano obligatorio. Salida esperada: human_handoff",
        hint: "print('human_handoff' if captcha else 'continue')",
        hints: [
          "CAPTCHA es stop condition ética: no se reintenta ni se resuelve con bots.",
          "El starter invierte la ternaria a propósito.",
          "El handoff debe incluir evidencia (url/step/screenshot) en el You Do.",
        ],
        edgeCases: ["no resolver captcha en bot"],
        tests: "Stdout exacto: `human_handoff`. Nunca continue con captcha=True.",
        feedback: "Con captcha=True la única salida válida es human_handoff.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · captcha → handoff
# Arregla: continue con captcha
captcha=True
print('continue' if captcha else 'human_handoff')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `captcha=True
print('human_handoff' if captcha else 'continue')`,
          output: `human_handoff`,
        },
      },
      {
        id: "S23-T4-B-E2",
        subtopicId: "S23-T4-B",
        kind: "independent",
        instruction:
          "CASO-LIM-023 · ToS gana. sig tiene tos_forbidden True (y captcha True). Imprime action 'abort'. abort > handoff: ToS prohíbe automatizar. Salida esperada: abort",
        hint: "if sig.get('tos_forbidden'): abort, no handoff.",
        hints: [
          "Aunque haya captcha, ToS forbidden aborta el run por completo.",
          "Handoff humano no repara una prohibición contractual.",
          "El starter elige handoff a propósito: invierte la prioridad.",
        ],
        edgeCases: ["registro legal"],
        tests: "Stdout exacto: `abort`. ToS gana sobre captcha/handoff.",
        feedback: "Con tos_forbidden la action correcta es abort.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · ToS prohibido aborta
# Arregla: handoff en vez de abort
sig={'tos_forbidden':True,'captcha':True}
print('human_handoff' if sig.get('tos_forbidden') else 'abort')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `sig={'tos_forbidden':True,'captcha':True}
print('abort' if sig.get('tos_forbidden') else 'human_handoff')`,
          output: `abort`,
        },
      },
      {
        id: "S23-T4-B-E3",
        subtopicId: "S23-T4-B",
        kind: "transfer",
        instruction:
          "CASO-LIM-023 · Payload de handoff. payload con url, step, screenshot; imprime keys sorted y el step. Evidencia mínima para que un analista continúe (sin cookies ni secretos). Salida esperada: ['screenshot', 'step', 'url'] export",
        hint: "print(sorted(payload.keys()), payload['step'])",
        hints: [
          "El ticket de handoff debe ser accionable en minutos, no un dump de sesión.",
          "No incluyas passwords ni storage_state en el payload público.",
          "sorted(keys) + step export es el contrato exacto del grader.",
        ],
        edgeCases: ["sin cookies en el ticket público"],
        tests: "Stdout exacto: `['screenshot', 'step', 'url'] export` (keys sorted + step).",
        feedback: "Imprime keys ordenadas y el step export, no solo el step.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · payload de handoff
# Arregla: imprime solo step
payload={'url':'https://demo.test/app','step':'export','screenshot':'s.png'}
print(payload['step'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `payload={'url':'https://demo.test/app','step':'export','screenshot':'s.png'}
print(sorted(payload.keys()), payload['step'])`,
          output: `['screenshot', 'step', 'url'] export`,
        },
      },
    ],
  },
  youDo: {
    title: "Robot de prueba con trace (web adapter CP-N2-C)",
    context:
      "Tras el borrador con aprobación humana de S22, el run CP-N2-C necesita un **reporte verificado** desde un portal de práctica. Automatiza un portal sintético (DOM en dicts; opcionalmente Playwright local con el sketch de la teoría): login vía Page Object, descarga con hash, retry solo de timeouts, stop en captcha/ToS, y evidencia de éxito + falla forzada. Entrega además un runbook corto en es-PE y el contrato de `last_ok_step` para reanudar sin doble-submit. En S24 ese binario alimentará OCR/Document AI.",
    objectives: [
      "Locators por rol (accesibles) en el flujo de descarga — a11y = estabilidad",
      "Download con verificación de integridad (hash o tamaño)",
      "Retry solo transitorios + handoff en captcha / abort en ToS",
      "Paquete de evidencia trace/screenshot/error por step",
      "Checkpoint last_ok_step documentado para reanudación idempotente a nivel de paso",
    ],
    requirements: [
      "Sitio de prueba controlado o simulación con dicts (sin red a bancos/SUNAT reales)",
      "Sin bypass de CAPTCHA/ToS ni granjas de captcha",
      "Trace de al menos un éxito y una falla forzada (timeout o selector)",
      "Checkpoint de reanudación documentado (last_ok_step) en runbook es-PE",
      "Locators preferidos por rol; CSS solo como último recurso",
    ],
    starterCode: `# Simulación de robot — mapeable a Playwright real (get_by_role, expect_download, tracing)
# Completa el flujo: login PO → export por rol → hash → evidencia → handoff/retry
import hashlib

DOM = [
    {"role": "textbox", "name": "Usuario", "id": "u1"},
    {"role": "button", "name": "Exportar", "id": "b1"},
    {"role": "link", "name": "Descargar reporte", "id": "l1"},
]

STEPS = ["login", "form", "export", "verify"]

def by_role(role, name):
    return next(n for n in DOM if n["role"] == role and n["name"] == name)

class LoginPage:
    def submit(self, ctx, user, password):
        # TODO: autenticar solo con demo/sandbox; mutar ctx['auth']
        pass

def verify_download(blob: bytes) -> str:
    return hashlib.sha256(blob).hexdigest()[:8]

def should_retry(kind: str) -> bool:
    return kind in {"timeout", "network", "429"}

def on_blocker(signals: dict) -> str:
    if signals.get("tos"):
        return "abort"
    if signals.get("captcha"):
        return "human_handoff"
    return "continue"

def evidence(step: str, ok: bool, error: str | None = None) -> dict:
    pkg = {"step": step, "ok": ok}
    if not ok:
        pkg["trace"] = f"traces/{step}.zip"
        pkg["screenshot"] = f"shots/{step}.png"
        pkg["error"] = error or "unknown"
    return pkg

def next_step(last_ok_step: str | None) -> str:
    if last_ok_step is None:
        return STEPS[0]
    i = STEPS.index(last_ok_step)
    return STEPS[i + 1] if i + 1 < len(STEPS) else "done"

# --- Tu implementación de corrida feliz + falla forzada ---
ctx = {}
# LoginPage().submit(ctx, "demo", "sandbox")
blob = b"synthetic-report-xlsx"
sha = verify_download(blob)
print("export_btn", by_role("button", "Exportar")["id"])
print("sha", sha)
print("blocker_captcha", on_blocker({"captcha": True}))
print("retry_timeout", should_retry("timeout"))
print("evidence_fail", evidence("export", False, "TimeoutError"))
print("resume_after_login", next_step("login"))
# Documenta en runbook: last_ok_step, política captcha/ToS, por qué no API
`,
    portfolioNote:
      "Evidencia del adaptador web CP-N2-C: traces de éxito y falla forzada + download verificado + política de handoff + runbook es-PE con last_ok_step. Listo para alimentar OCR en S24.",
    rubric: [
      { criterion: "Cumple objetivos del adaptador web (locators por rol / a11y, download verificado, evidencia, handoff)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado (dicts y/o Playwright local)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "15%" },
      { criterion: "Pruebas o casos de borde documentados (timeout, captcha, ToS, hash mismatch, reanudación)", weight: "15%" },
      { criterion: "Código legible, Page Object o módulos claros, límites éticos explícitos", weight: "15%" },
      { criterion: "Documentación en español profesional (runbook + last_ok_step + puente a S24)", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Por qué preferir get_by_role a CSS nth-child?",
        options: ["Es más corto de escribir siempre", "Playwright no soporta CSS", "Refleja la UI accesible y suele ser más estable ante cambios de layout", "Evita assertions"],
        correctIndex: 2,
        explanation:
          "Roles y nombres accesibles cambian menos que la jerarquía CSS y alinean robot y usabilidad (a11y = estabilidad).",
      },
      {
        question: "Ante un CAPTCHA el robot debe:",
        options: ["Detenerse y hacer handoff humano", "Resolverlo con un servicio externo", "Reintentar 100 veces", "Ignorar ToS"],
        correctIndex: 0,
        explanation:
          "CAPTCHA es stop condition ética y de ToS: no se bypasea ni se reintenta como timeout.",
      },
      {
        question: "API/export primero significa:",
        options: ["RPA siempre", "Buscar integración no-UI antes de automatizar el browser", "Prohibir Excel", "Solo cloud"],
        correctIndex: 1,
        explanation:
          "Jerarquía api > export > rpa > human: RPA es último recurso de automatización.",
      },
      {
        question: "Un retry seguro reintenta:",
        options: ["Cualquier error", "Solo éxitos", "Captchas", "Solo fallas transitorias (timeout/red/429), no captcha ni 403 de negocio"],
        correctIndex: 3,
        explanation:
          "Retry selectivo evita loops dañinos y respeta stop conditions éticas.",
      },
      {
        question: "En el diagnóstico de un fallo de RPA, ¿qué paquete de evidencia es mínimo?",
        options: ["Solo el print del error en consola", "El password del usuario en el log", "trace + screenshot + error tipado (y step id)", "Un video de YouTube genérico de Playwright"],
        correctIndex: 2,
        explanation:
          "Trace, screenshot y error tipado permiten reanudar y auditar sin PII ni secretos.",
      },
      {
        question: "¿Para qué sirve un Page Object en el adapter web?",
        options: ["Para encapsular selectores y acciones de una pantalla y reducir acoplamiento", "Para guardar contraseñas en la clase", "Para saltarse el auto-wait de Playwright", "Para bypassear CAPTCHA con otro user-agent"],
        correctIndex: 0,
        explanation:
          "Si cambia el label del botón, tocas un método del PO, no decenas de tests.",
      },
      {
        question: "Tras un download en el portal demo, ¿qué valida integridad del archivo?",
        options: ["Que el click no lanzó excepción", "Hash (p. ej. sha256) o tamaño/extensión del binario", "Que el botón tenía CSS bonito", "Reintentar el download 50 veces sin comprobar el archivo"],
        correctIndex: 1,
        explanation:
          "El éxito del step es el binario correcto, no solo el click. Checksum mismatch → fallo con evidencia.",
      },
      {
        question: "Si last_ok_step='login' y los steps son login → form → export, ¿qué debe ejecutar el robot al reanudar?",
        options: ["Volver a login para “estar seguros”", "export saltándose form", "Abortar siempre y pedir CAPTCHA", "form (el siguiente step), evitando doble-submit del login"],
        correctIndex: 3,
        explanation:
          "La reanudación por checkpoint salta al siguiente paso tras last_ok_step; rehacer login/form puede doble-submittear el portal.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Playwright Python",
        url: "https://playwright.dev/python/",
        note: "Locators, page, context y traces",
      },
      {
        label: "Playwright best practices",
        url: "https://playwright.dev/python/docs/best-practices",
        note: "Auto-wait y selectores de usuario",
      },
      {
        label: "Playwright — Locators",
        url: "https://playwright.dev/python/docs/locators",
        note: "get_by_role, get_by_label, get_by_text",
      },
      {
        label: "Playwright — Trace viewer",
        url: "https://playwright.dev/python/docs/trace-viewer",
        note: "Diagnóstico de fallos",
      },
      {
        label: "Playwright — Authentication",
        url: "https://playwright.dev/python/docs/auth",
        note: "storage_state y reuso de sesión",
      },
      {
        label: "W3C ARIA practices",
        url: "https://www.w3.org/WAI/ARIA/apg/",
        note: "Roles y nombres accesibles = selectores estables",
      },
    ],
    books: [
      {
        label: "Web Scraping with Python (Mitchell) — ética",
        note: "ToS y límites legales (contexto)",
      },
      {
        label: "Release It! (Nygard)",
        note: "Retries y circuit breakers",
      },
    ],
    courses: [
      {
        label: "Playwright codegen",
        url: "https://playwright.dev/python/docs/codegen",
        note: "Exploración inicial de flujos",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos y tests",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Proyectos reproducibles",
      },
      {
        label: "Coursera — test automation tracks",
        url: "https://www.coursera.org/courses?query=playwright%20test%20automation",
        note: "Automatización de UI y waits",
      },
    ],
  },
}
