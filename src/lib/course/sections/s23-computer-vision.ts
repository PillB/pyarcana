import type { CourseSection } from '../../types'

export const section23: CourseSection = {
  id: "computer-vision",
  index: 23,
  title: "Browser RPA con Playwright",
  shortTitle: "Playwright RPA",
  tagline: "robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y retries selectivos con handoff",
  estimatedHours: 19,
  level: "Práctica independiente",
  phase: 1,
  icon: "Monitor",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Automatizar un sitio web controlado con Playwright significa elegir locators estables (esto es, selectores que sobreviven a rediseños), dejar traces, reintentar con criterio y preferir la API pública antes que el clic cuando exista. Aquí aprendes a hacerlo sin evadir CAPTCHA ni términos de servicio: el handoff humano es parte del contrato. En operaciones (backoffice, mesas de control) el valor es el dato verificado y auditable, no «haber automatizado el clic».",
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
        "**Diccionario de la sección** (léelo antes de T1). **DOM:** árbol de objetos de la página (Document Object Model); lo recorres con locators. **Locator:** consulta estable de un control (preferir rol y nombre visibles). **Auto-wait:** esperar a que el control sea usable, no `sleep` fijo. **Page Object:** clase que encapsula selectores y acciones de una pantalla. **Trace:** paquete de evidencia de la corrida (pasos, red, DOM) para diagnosticar fallas. **storage_state:** cookies/localStorage reutilizables entre corridas. **API-first:** preferir endpoint o export al clic de la UI. **Handoff humano:** detener el robot ante CAPTCHA/ToS y pasar evidencia a una persona. **CI:** integración continua, el runner que ejecuta pruebas en cada push. **ToS:** términos del servicio (reglas contractuales del sitio). **CAPTCHA:** desafío automático para distinguir humano de bot. **PII:** información personal identificable (datos sensibles del cliente). **Flaky:** prueba que a veces pasa y a veces falla por timing o entorno inestable.",
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
        "Caso sintético CASO-LIM-023: botón “Descargar reporte” id `b1` se resuelve por role+name; un logo `img` sin role de control interactivo **no** sustituye al botón de negocio. `LookupError` (o `need_testid`) si no hay match enseña fallar **ruidoso** en setup — no clic ciego al primer div. Ese fallo temprano es más barato que un download silencioso del archivo equivocado.",
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
        "Playwright **auto-espera** a que el elemento sea interactuable (visible, estable, habilitado, recibe eventos). Evita `time.sleep` fijos: un sleep de 5 s **falla en CI lento** y **desperdicia** tiempo en CI rápido. Usa `expect` con timeout explícito y condiciones de readiness del paso de negocio (título, fila de tabla, download started).",
        "Las **assertions** (`expect(locator).to_be_visible()`, título esperado) documentan la **postcondición** del paso y fallan con mensaje útil. En el lab simulamos reloj y `wait_until(pred)` con un intervalo (`step`) en ms hasta timeout — misma idea que el auto-wait del runtime real.",
        "Caso: `ready_at=250ms`, timeout 500 → ready True. Si tras N intentos no ready → `'timeout'` y adjunta **trace**. El robot del portal demo asserta título **antes** de descargar el CSV sintético; sin postcondición no hay evidencia de éxito.",
      ],
      code: {
        language: 'python',
        title: "autowait.py",
        code: `class FakeClock:
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
          "Un sleep de 5 s falla en CI lento y desperdicia tiempo en CI rápido. Prefiere condiciones.",
      },
    },
    {
      heading: "Formularios, uploads/downloads y sesiones",
      subtopicId: "S23-T2-A",
      paragraphs: [
        "Flujos típicos del adaptador: **fill** campos de negocio (usuario, periodo de reporte), **set_input_files** / upload de plantilla, clic de export, esperar **download** y verificar path, tamaño o hash. En Playwright real envuelves el clic en `expect_download()`; en el lab modelamos el binario como bytes y calculamos un digest. El éxito del step **no** es “el clic no lanzó excepción”: es el **archivo correcto**.",
        "**storage_state** (cookies y localStorage serializados) reutiliza la sesión autenticada entre corridas para no volver a iniciar sesión en cada caso. En el lab un dict `{token: 't'}` modela ese reuso: si hay token → `reuse`; si no → `login`. Nunca hardcodees contraseñas reales de bancos o SUNAT; el sandbox de CP-N2-C usa credenciales demo (`demo` / `sandbox`).",
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
          "No basta con que el clic no falle: chequea tamaño, extensión o hash del download.",
      },
    },
    {
      heading: "Auth, estados y Page Objects",
      subtopicId: "S23-T2-B",
      paragraphs: [
        "Un **Page Object** (PO) encapsula selectores y acciones de una pantalla (`LoginPage.submit`, `ReportPage.open`). La idea es separar **setup de auth** (fixture `storage_state` o iniciar sesión una vez) del **test de negocio** del reporte, para no copiar el mismo fill de usuario en veinte archivos. Si el label del botón Login cambia, tocas un método — no reescribes la suite entera.",
        "Estados de página: `anonymous` → `authenticated` (en sistemas reales puede existir `mfa_pending`; aquí el sandbox es binario). `ReportPage.open` lanza `PermissionError` si no hay sesión: el robot **captura** y reporta `denied` en vez de seguir ciego al download. Ese guard es parte del contrato del adaptador, no un detalle de UI.",
        "Contrato de laboratorio CASO-LIM-023: `LoginPage.submit(ctx, password)` con password `sandbox` setea `ctx['auth']`; password incorrecto deja `anonymous` / `False`. El PO **no** contiene `sleeps` mágicos ni selectores CSS frágiles embebidos en el test: expone acciones que el test compone. El estado de sesión vive en el contexto (`ctx` o `storage_state`), no como atributo suelto del robot global.",
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
        "Ante falla, empaqueta **trace** (zip de Playwright con pasos, red y DOM), **screenshot** y un **error** tipado (string o clase). Las keys del paquete se ordenan alfabéticamente para diffs estables en CI. Sin ese trío, el on-call (equipo de guardia) de operaciones en Lima no puede reproducir el flake del portal demo ni decidir si es selector, red o timeout de negocio.",
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
        "Recuperación ante DOM inestable: si `err=='stale'` (nodo reemplazado tras un re-render), la action es `goto_home` o renavegar al listado — **no** `continue` sobre un handle viejo. Tras la renavegación, reobtienes el locator; reutilizar un handle de un árbol anterior es una fuente clásica de flakes en browser RPA.",
        "Reanudación con checkpoint: el robot guarda `last_ok_step` (p. ej. `login`, `form`) y, al reintentar la corrida, salta al **siguiente** paso en vez de rehacer todo el flujo. Eso evita el doble envío del login/form y hace la corrida **idempotente a nivel de paso** cuando el backend del portal demo lo permite (mismo periodo, mismo export).",
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
        "Jerarquía de preferencia del adaptador: **api > export > rpa > human**. Si el sistema ofrece un endpoint o un CSV/xlsx export del **mismo** reporte, úsalo: menos flakes de UI, menos zonas grises de ToS, menos costo de operación. **RPA de browser es el último recurso de automatización**, no el default del web adapter de CP-N2-C — aunque sepas usar Playwright con maestría.",
        "Toda caída a RPA registra un `reason` (`no_api`, `export_stale`, `export_missing`, etc.) en el dict de decisión de la corrida. Ese rastro habilita el ticket de “reemplazar por API” cuando el producto madure. Documenta la decisión en el **runbook** del adaptador: qué capacidades se probaron, en qué orden y por qué se eligió el canal actual.",
        "Caso de laboratorio: flags `api=False`, `export=True`, `rpa=True` → choice `export`. Si solo queda RPA → `method: rpa` con `reason: no_api`. El valor de negocio es el **dato verificado y auditable**, no el trofeo de “haber automatizado el clic”. En operaciones sintéticas de backoffice eso se traduce en menos páginas rotas y más tiempo para el analista humano en excepciones reales.",
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
        "Si **ToS prohíbe** la automatización, `action=abort` (**ToS gana** sobre CAPTCHA y sobre el argumento “pero es urgente”). Si `captcha=True` y los términos permiten intervención humana, la action es **human_handoff** con payload mínimo `url` / `step` / `screenshot` — nunca scripts de evasión, granjas de captcha ni user-agents rotativos en este curso ni en operación responsable.",
        "Desktop fallback (app nativa, OCR de pantalla, etc.) solo si el **contrato del sistema** lo contempla y está en el alcance del adaptador; no es una puerta trasera para evadir políticas web. El handoff debe ser actuable en minutos: un analista de operaciones en Lima abre el ticket, ve el step y la captura, y continúa sin reconstruir el contexto desde cero.",
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
      "Te muestro el **web adapter** de CP-N2-C en ocho demos (una por subtema). Cada una modela una decisión del robot: qué locator usar, cuándo esperar, cómo verificar un download, cómo encapsular auth, qué evidencia guardar, qué reintentar, cuándo preferir API y cuándo parar ante CAPTCHA. En el lab usamos dicts; la semántica es la de Playwright (`get_by_role`, auto-wait, download, tracing). La salida mostrada **coincide exactamente** con lo que imprime el código: es el modelo que copiarás en We Do.",
    steps: [
      {
        demoId: "S23-T1-A-DEMO",
        subtopicId: "S23-T1-A",
        environment: "local",
        description:
          "Resolver el botón Enviar por role+name (no por índice CSS) en un DOM sintético de dos botones.",
        preamble:
          "Antes de automatizar el export del portal demo de CP-N2-C, el robot debe *ver* el control como lo ve un usuario (y el árbol de accesibilidad). En esta demo un DOM sintético tiene dos botones; resolvemos “Enviar” por `role` + `name`, no por posición. No escribas aún: predice qué fallaría si el layout reordena los botones y el robot usara `nth-child`. Observa la salida y el flag `locators role_first`. Misma semántica que Playwright real; el lab usa dicts sin Chromium.",
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
        why:
          "El usuario y ARIA ven el nombre accesible, no la jerarquía CSS: “Enviar” no es `div:nth-child(2)`. Si el layout reordena columnas y el rol se mantiene, el robot sigue estable — accesibilidad es estabilidad. Un `LookupError` ruidoso al no hallar match es preferible a un clic ciego al primer botón. En el lab modelamos locators como consultas sobre nodos; en local es `page.get_by_role`. En We Do corregirás predicados invertidos, el orden role→testid→css y el fail-closed sin control usable.",
        retrospective:
          "Si puedes explicar por qué “Enviar” por role+name sobrevive un reorden de columnas y un CSS frágil no, ya tienes el hábito de locator de usuario. El error clásico es clicar el primer `button` del DOM. En We Do practicarás role correcto, orden de estrategias y fallar cerrado sin control usable.",
      },
      {
        demoId: "S23-T1-B-DEMO",
        subtopicId: "S23-T1-B",
        environment: "local",
        description:
          "Simular auto-wait: sondear hasta que el control esté listo en el intento 3; sin sleep fijo.",
        preamble:
          "El portal demo a veces tarda en habilitar el botón de export. En esta demo un reloj simulado solo está listo en el intento 3: el robot espera una **condición**, no un `sleep` fijo. No escribas: predice qué valor de `visible` sale y por qué un sleep de 5 s fallaría en CI lento y desperdiciaría tiempo en CI rápido. Datos sintéticos, sin browser real; en local Playwright auto-espera usabilidad del control.",
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
        why:
          "Playwright auto-espera usabilidad del control (visible, estable, habilitado); un sleep fijo es raíz de flakes: falla en CI lento y desperdicia tiempo en CI rápido. El lab modela el mismo contrato con un contador de intentos hasta `ready_at`. Devolver el intento en que se cumplió la condición (no la última i del for) documenta cuándo el control estuvo listo. En We Do: imprimir i al ready, for-else timeout y assertion de título más botones.",
        retrospective:
          "Si puedes explicar por qué devolver el intento en que se cumplió la condición (no la última i del for) importa, ya tienes el hábito de wait por postcondición. El misconception “más sleep = más estable” no sobrevive a CI. We Do: break al ready, timeout legítimo y assert combinado del portal.",
      },
      {
        demoId: "S23-T2-A-DEMO",
        subtopicId: "S23-T2-A",
        environment: "local",
        description:
          "Rellenar un form de periodo, simular download y verificar el binario con sha256 truncado a 8 (contrato de integridad).",
        preamble:
          "El adaptador de CP-N2-C no termina cuando el botón deja de lanzar excepción: termina cuando el **binario** del reporte es el esperado. Esta demo rellena un form de periodo y calcula un sha256 truncado de `b\"data\"`. No escribas: mira el dict filled y el `sha`; en el lab el checksum mismatch debe fallar con evidencia, no con éxito silencioso. Ese archivo verificado es el que S24 usará en OCR.",
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
        why:
          "Fill de campos de negocio (periodo del reporte) y download modelado como bytes: la postcondición es hash o tamaño, no “el clic no falló”. Un checksum mismatch debe fallar el step y adjuntar evidencia, nunca un éxito silencioso que contamine CP-N2-C. En Playwright real envuelves el clic en `expect_download()`; aquí el digest es el contrato del lab. En We Do: fill completo, SHA-256 (no MD5) y reuso de sesión con storage_state conceptual.",
        retrospective:
          "Si puedes decir en una frase “el step OK es el archivo correcto, no el clic”, ya tienes el contrato de integridad del adaptador. El error clásico es dar por bueno el download sin hash. We Do: form usuario+periodo, digest truncado y session_mode reuse/login.",
      },
      {
        demoId: "S23-T2-B-DEMO",
        subtopicId: "S23-T2-B",
        environment: "local",
        description:
          "Encapsular el login en un Page Object que muta el contexto de sesión (auth).",
        preamble:
          "Cuando el label del botón Login cambia, no quieres reescribir veinte tests de reporte. Esta demo encapsula el login en un Page Object que muta el **contexto** de sesión. No escribas: observa que `auth` vive en `ctx`, no como atributo suelto del robot. Mismo patrón que mapearás a `LoginPage.submit` en local con Playwright; credenciales solo demo/sandbox, nunca banco ni SUNAT.",
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
        why:
          "El Page Object reduce acoplamiento: un cambio de selector del botón Login toca un método, no la suite entera de reportes. El estado de sesión vive en `ctx` (análogo a storage_state), no en `self.auth` del robot global. Así separas setup de auth del test de negocio del export. En We Do: submit con password sandbox, guard denied sin sesión y transición anonymous → authenticated sin auth fantasma.",
        retrospective:
          "Si el estado vive en el contexto y la acción en el PO, la suite de negocio no copia fill de usuario. El misconception “auth en self del robot” acopla todo. We Do: autenticar sandbox, denegar sin sesión y modelar la transición de estados.",
      },
      {
        demoId: "S23-T3-A-DEMO",
        subtopicId: "S23-T3-A",
        environment: "local",
        description:
          "Empaquetar evidencia mínima de falla por step: trace path, screenshot y error tipado; keys estables para CI.",
        preamble:
          "Cuando el export del portal demo hace timeout a las 2 a.m., el on-call en Lima necesita un paquete actuable: step, path de trace, screenshot y error tipado. Esta demo construye ese dict y lista las keys ordenadas. No escribas: predice por qué las keys estables importan más que el texto libre del error para diffs de CI. Sin PII en screenshots.",
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
        why:
          "El trío mínimo trace + screenshot + error tipado hace la falla actuable para el on-call; un print suelto del mensaje no es paquete de evidencia. Keys estables permiten comparar la **forma** del paquete en CI aunque el texto del error cambie entre corridas. Paths deterministas por step (`traces/{step}.zip`) predicen el disco del runner. En We Do: keys vs. values, filtro ERR en logs y adjuntar trace solo cuando ok es False.",
        retrospective:
          "Evidencia reproducible es parte del adaptador, no un extra de “cuando haya tiempo”. El misconception “un print del error basta” deja al on-call ciego a las 2 a.m. We Do: forma del paquete, señal en logs y path de trace en falla.",
      },
      {
        demoId: "S23-T3-B-DEMO",
        subtopicId: "S23-T3-B",
        environment: "local",
        description:
          "Retry selectivo: un timeout se reintenta y llega a ok; un captcha va a handoff (no se reintenta).",
        preamble:
          "No todos los errores merecen un reintento. Esta demo recorre kinds: un timeout se reintenta y llega a ok en el intento 2; un captcha va directo a `human_handoff`. No escribas: predice qué sale en cada `print` y por qué un loop infinito ante captcha es a la vez flaky y antiético. El handoff es política del adapter, no vergüenza del automatizador.",
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
        why:
          "Retries solo para fallas transitorias (timeout, 429); CAPTCHA es stop condition del contrato del adapter — handoff humano, nunca “otro user-agent” ni granja. Handoff no es fracaso de carrera: es política ética y operativa. Un loop infinito ante captcha castiga al portal y viola el runbook. En We Do: codificar `should_retry`, recovery distinta para stale vs. timeout, y `next_step` tras checkpoint `last_ok_step`.",
        retrospective:
          "Si puedes separar “timeout reintentable” de “captcha no reintentable” sin mirar el código, ya tienes la política de recovery del adaptador. El error clásico es reintentar cualquier excepción. We Do: codificar `should_retry`, recovery distinta para stale vs. timeout, y `next_step` tras checkpoint `last_ok_step`.",
      },
      {
        demoId: "S23-T4-A-DEMO",
        subtopicId: "S23-T4-A",
        environment: "local",
        description:
          "Elegir canal de integración: con export disponible y sin API, preferir export sobre RPA.",
        preamble:
          "El valor de negocio del adaptador es el **dato verificado**, no el trofeo de haber automatizado el clic. Esta demo elige canal con jerarquía api > export > rpa; con export disponible e api ausente gana export aunque rpa esté permitido. No escribas: predice la salida y por qué RPA no es el default del web adapter de CP-N2-C. Menos flakes y menos superficie de ToS.",
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
        why:
          "La jerarquía api > export > rpa > human codifica el criterio de diseño: mismo dato con menos UI frágil y menos riesgo de ToS. Aunque `rpa=True`, el CSV/export del reporte gana si existe. Cuando caigas a RPA, documenta reason (`no_api`) para el ticket de reemplazo. El orden de los ifs **es** la política de integración. En We Do: invertir anti-patrones de orden, cascada cuando api falta y decide con method/reason.",
        retrospective:
          "Si puedes defender api > export > rpa > human en una reunión de ops, ya tienes el criterio de diseño del canal. El error clásico es “si hay RPA, RPA”. We Do: orden correcto de ifs, caídas a export y dict method/reason.",
      },
      {
        demoId: "S23-T4-B-DEMO",
        subtopicId: "S23-T4-B",
        environment: "local",
        description:
          "Ante captcha en el portal demo, detener el robot y escalar a humano (sin bypass).",
        preamble:
          "CAPTCHA y ToS no son “otro timeout”. Esta demo, ante `captcha: True`, detiene el robot y devuelve `human_handoff` — sin bypass ni granja. No escribas: observa que handoff es parte del **contrato** del adapter, no un fracaso de carrera. El curso y la operación responsable no resuelven captcha con bots; el analista recibe evidencia, no un dump de cookies.",
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
        why:
          "Stop conditions éticas: CAPTCHA → handoff con evidencia; ToS prohibido → abort (gana sobre handoff). Handoff no se “arregla” con más retries ni con otro user-agent. El payload para el analista es mínimo y actuable (url, step, screenshot), sin secretos ni storage_state. Bypass de CAPTCHA/ToS queda fuera del curso y de la operación responsable. En We Do: ternaria correcta, prioridad ToS y keys del payload.",
        retrospective:
          "Si puedes explicar por qué handoff no se “arregla” con más retries, ya tienes la ética del robot. El misconception “es solo un error de timing” borra la frontera legal. We Do: decide captcha, abort por ToS y payload actuable sin secretos.",
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
        title: "Localizar link Inicio por role+name",
        preamble:
          "- **Contexto:** en el portal sintético CASO-LIM-023 el menú expone un link “Inicio” (id `n1`); un CSS por índice rompe al rediseñar la barra.\n- **Meta:** practicar el predicado de locator de usuario: role + name exactos.\n- **Éxito:** imprimes una sola línea `n1`.\n- **Límites:** no uses CSS ni el primer nodo a ciegas; si no hay match, el fallo ruidoso es correcto (no inventes un id).",
        instruction:
          "1. Abre el starter: el predicado busca `role=='button'` (bug nombrado).\n2. Cambia a `role=='link'` y `name=='Inicio'`.\n3. Imprime solo el `id` del match.\n4. Sin prints extra ni el dict completo.",
        hint: "Filtra por rol y nombre; devuelve el id del primer match.",
        hints: [
          "Un locator de usuario mira el rol accesible y el nombre, no el índice CSS.",
          "Si usas next(...), el predicado debe exigir role='link' y name='Inicio'.",
          "Si no hay match, es mejor fallar ruidoso que devolver el primer nodo cualquiera.",
        ],
        edgeCases: ["StopIteration si no existe"],
        tests: "Stdout exacto: una línea `n1`. Sin prints extra ni el dict completo del nodo.",
        feedback:
          "El link “Inicio” se resuelve por rol accesible, no por “el primer botón del header”. Si el predicado pide button, `next` no encuentra y devuelves None o fallas: en producción eso es un setup roto, no un clic al logo.",
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
        retrospective:
          "Role + name es el contrato mínimo de un locator estable. El error clásico es copiar el selector del DevTools (CSS frágil). Siguiente (E2): ordenar la política role → testid → css cuando hay varias estrategias.",
      },
      {
        id: "S23-T1-A-E2",
        subtopicId: "S23-T1-A",
        kind: "independent",
        title: "Priorizar role, testid y CSS",
        preamble:
          "- **Contexto:** el equipo de UI del portal demo a veces deja solo testid o CSS; el adaptador necesita un orden de intento, no el orden alfabético del string.\n- **Meta:** ordenar estrategias con `order` (role primero, css al final).\n- **Éxito:** `['role', 'testid', 'css']` exacto.\n- **Límites:** no uses `sorted(strats)` sin `key`; no reordenes a mano el literal.",
        instruction:
          "1. Revisa el starter: `sorted(strats)` sin key (bug).\n2. Usa `key=lambda s: order[s]`.\n3. Imprime la lista resultante.\n4. No alteres el dict `order`.",
        hint: "Usa order={...} como key de sorted, no sorted(strats) a secas.",
        hints: [
          "La política didáctica es role primero, luego testid, CSS al final.",
          "order['role']=0 hace que role quede antes que css aunque 'c' < 'r' alfabéticamente.",
          "sorted(strats) sin key da orden alfabético incorrecto para esta política.",
        ],
        edgeCases: ["texto también válido como estrategia intermedia"],
        tests: "Stdout exacto: `['role', 'testid', 'css']` (repr de lista). No orden alfabético.",
        feedback:
          "La política no es “lo que suene bonito”: role accesible primero, testid como contrato de producto, CSS al final. `sorted` alfabético pone css antes de role y produce robots frágiles.",
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
        retrospective:
          "El orden de intento es un contrato de producto, no un sort de strings: role para estabilidad y a11y, testid cuando el equipo lo expone, CSS solo si no hay mejor semántica. Si confundes `sorted` con prioridad, el robot se casa con el layout. Pregunta: ¿pedirías `data-testid` al frontend antes de un XPath? Luego (E3) fallas cerrado sin control usable.",
      },
      {
        id: "S23-T1-A-E3",
        subtopicId: "S23-T1-A",
        kind: "transfer",
        title: "Fallar si no hay control usable",
        preamble:
          "- **Contexto:** en setup del robot, un logo decorativo no sustituye al botón “Descargar reporte”; clicar el primer nodo contamina el run de CP-N2-C.\n- **Meta:** fallar cerrado: si no hay `button`, imprimir `need_testid` (señal para el equipo de UI).\n- **Éxito:** una línea `need_testid`.\n- **Límites:** no imprimas el name del `img`; no asumas `nodes[0]`.",
        instruction:
          "1. Filtra `hits` por `role=='button'` (el starter ya lo prepara).\n2. Si `hits` vacío → imprime `need_testid`; si no, el name del button.\n3. Deja de imprimir `nodes[0]['name']`.\n4. Sin inventar un botón fake en el DOM.",
        hint: "Filtra hits por role=='button'; si la lista está vacía → need_testid.",
        hints: [
          "Un logo img no es un control interactivo de negocio.",
          "No uses nodes[0] sin filtrar: el primer nodo puede ser decorativo.",
          "Coordina con frontend un data-testid si el producto no expone rol.",
        ],
        edgeCases: ["coordina con frontend"],
        tests: "Stdout exacto: `need_testid`. No imprimas el name del img decorativo.",
        feedback:
          "Sin button usable la respuesta es need_testid: señal al frontend, no el name del logo. “Algo clicó” no prueba que el control de negocio exista.",
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
        retrospective:
          "Fail-closed en setup es más barato que un download silencioso del archivo equivocado. El error clásico es “algo clicó, debe estar bien”. Pregunta de cierre: ¿qué pedirías al frontend si solo hay CSS frágil?",
      },
      {
        id: "S23-T1-B-E1",
        subtopicId: "S23-T1-B",
        kind: "guided",
        title: "Imprimir el intento cuando ready",
        preamble:
          "- **Contexto:** en el adaptador, “el control ya es usable” es la señal de seguir; imprimir la última i del bucle miente sobre cuándo se volvió ready.\n- **Meta:** al primer `ready`, imprimir `i` y salir del loop.\n- **Éxito:** una línea `2`.\n- **Límites:** no uses `time.sleep`; no imprimas todas las i.",
        instruction:
          "1. Revisa el starter: dentro del `if ready` solo hay `pass` y el print está fuera.\n2. Dentro del if: `print(i)` y `break`.\n3. Quita el `print(i)` final.\n4. No cambies el rango ni la condición `i >= 2`.",
        hint: "Cuando ready sea True: print(i) y break.",
        hints: [
          "El auto-wait de Playwright espera una condición, no un sleep fijo.",
          "Si solo haces `pass` dentro del `if`, el print posterior usa la última `i` del `for`.",
          "break evita seguir iterando después del primer ready.",
        ],
        edgeCases: ["timeout path"],
        tests: "Stdout exacto: `2` (primera `i` con ready). No la última `i` del `for` sin `break`.",
        feedback:
          "El primer ready es el intento 2. Si imprimes la última i del for, reportas “listo” en el 3 aunque la condición se cumplió antes: en CI eso parece un wait distinto al real.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · auto-wait imprime i cuando ready
# Arregla: imprime siempre la última i del for
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
        retrospective:
          "Esperar una condición y cortar al cumplirse es el esqueleto del auto-wait. El error clásico es sleep fijo o imprimir el índice final. Siguiente (E2): qué hacer cuando ready nunca llega.",
      },
      {
        id: "S23-T1-B-E2",
        subtopicId: "S23-T1-B",
        kind: "independent",
        title: "Timeout si nunca hay ready",
        preamble:
          "- **Contexto:** si el botón de export no aparece, el robot debe fallar con `timeout` y adjuntar evidencia (T3), no fingir `ok`.\n- **Meta:** con `ready=False` fijo, tras 3 intentos imprimir `timeout`.\n- **Éxito:** una línea `timeout`.\n- **Límites:** no imprimas `ok`; no uses un while infinito.",
        instruction:
          "1. Abre el starter: el `else` del for imprime `ok` (bug).\n2. Cámbialo a `print('timeout')`.\n3. Deja el cuerpo del if listo por si ready fuera True.\n4. Sin alterar `ready = False`.",
        hint: "El bloque else del for corre solo si no hubo break.",
        hints: [
          "Si ready nunca es True, no debes imprimir ok.",
          "for-else en Python: else se ejecuta cuando el loop termina sin break.",
          "En Playwright real el análogo es el timeout de `expect`, no un sleep de 5 s.",
        ],
        edgeCases: ["timeout_ms en Playwright"],
        tests: "Stdout exacto: `timeout`. No imprimas ok si ready nunca fue True.",
        feedback:
          "Timeout es un resultado de negocio del wait, no un crash opaco. Si el for termina sin ready y aún imprimes ok, el runbook cree que el portal cumplió el contrato.",
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
        retrospective:
          "El camino de timeout es un resultado de negocio del wait: el portal no cumplió el contrato a tiempo y el runbook debe registrar evidencia (T3), no un `ok` decorativo. El error clásico es “el for terminó, entonces pasó”. Pregunta: ¿qué adjuntarías al ticket si ves `timeout` tres veces seguidas? Luego (E3) combinas título y controles en una assertion web-first.",
      },
      {
        id: "S23-T1-B-E3",
        subtopicId: "S23-T1-B",
        kind: "transfer",
        title: "Assert de portal listo (título y botones)",
        preamble:
          "- **Contexto:** antes de descargar el CSV sintético, el adaptador debe afirmar que el portal demo está listo: título correcto **y** al menos un control usable.\n- **Meta:** implementar `assert_ready(page)` con predicado combinado.\n- **Éxito:** dos líneas `pass` luego `fail` (página buena vs. vacía con buttons=0).\n- **Límites:** no hardcodees `pass` siempre; no ignores `buttons`.",
        instruction:
          "1. Completa `assert_ready`: título == `'Portal demo'` **y** `buttons >= 1`.\n2. Mantén las dos llamadas (good / empty).\n3. Imprime solo el resultado de cada una.\n4. Función reutilizable, no un if suelto en el main.",
        hint: "Define assert_ready con el predicado combinado; invócala dos veces.",
        hints: [
          "Una assertion web-first documenta la postcondición completa del paso, no un solo campo.",
          "Si solo comparas el título e ignoras buttons, un portal vacío pasaría mal.",
          "En Playwright real: expect(page).to_have_title(...) y expect(get_by_role(...)).to_be_visible().",
        ],
        edgeCases: ["soft assertions fuera de alcance", "buttons=0 debe fallar"],
        tests: "Stdout exacto (2 líneas): pass luego fail. Función reutilizable, no un if suelto hardcodeado.",
        feedback:
          "La página buena pasa; la vacía (buttons=0) falla aunque el título diga Portal demo. Una assertion web-first mira la postcondición completa, no un solo campo.",
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
        retrospective:
          "Una assertion web-first documenta la postcondición del paso de negocio, no un solo campo. El error clásico es “el título dice Portal demo, basta”. Pregunta de cierre: ¿qué otra señal de readiness pedirías en un reporte real (fila de tabla, download started)?",
      },
      {
        id: "S23-T2-A-E1",
        subtopicId: "S23-T2-A",
        kind: "guided",
        title: "Completar form usuario y periodo",
        preamble:
          "- **Contexto:** el export del portal demo exige usuario **y** periodo (`2026-01`); sin fecha, el binario que llega a S24 (OCR) no es usable para el mes del reporte.\n- **Meta:** mutar el dict form campo a campo (análogo a fill de Playwright).\n- **Éxito:** `{'usuario': 'ana', 'periodo': '2026-01'}`.\n- **Límites:** no hardcodees el dict en el print; no dejes periodo comentado.",
        instruction:
          "1. Descomenta o escribe `form['periodo'] = '2026-01'`.\n2. Mantén `form['usuario'] = 'ana'`.\n3. Imprime `form` al final.\n4. Corrige solo el defecto marcado.",
        hint: "Asigna form['usuario'] y form['periodo'] antes del print; no dejes periodo comentado.",
        hints: [
          "fill en Playwright escribe en cada control; aquí el análogo es mutar el dict campo a campo.",
          "El starter solo rellena usuario: el periodo del reporte sigue vacío — completa ambos.",
          "No hardcodees el dict en el print: asigna los dos campos y luego imprime form.",
        ],
        edgeCases: ["campos vacíos", "periodo mal formateado", "periodo omitido rompe el export"],
        tests: "Stdout exacto: dict con usuario='ana' y periodo='2026-01' (orden de inserción de Python 3.7+).",
        feedback:
          "Un solo campo no basta: sin periodo el export del portal demo deja un binario sin mes útil para S24. Completa usuario y periodo mutando el dict, no hardcodeando el print.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · fill form (usuario + periodo)
# Arregla: solo rellena usuario; falta periodo del reporte
form = {}
form['usuario'] = 'ana'
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
        retrospective:
          "Un fill incompleto es un bug de contrato de negocio, no “casi listo”. El error clásico es autenticar y olvidar el periodo del reporte. Siguiente (E2): verificar el binario con hash correcto.",
      },
      {
        id: "S23-T2-A-E2",
        subtopicId: "S23-T2-A",
        kind: "independent",
        title: "Hash SHA-256 del download",
        preamble:
          "- **Contexto:** en CP-N2-C el runbook fija SHA-256 (truncado a 8 en el lab) para comparar el archivo del portal demo; MD5 no es el contrato del grader ni el hábito del curso.\n- **Meta:** calcular digest de `b'data'` con sha256 y truncar a 8 hex.\n- **Éxito:** `3a6eb079`.\n- **Límites:** no uses `md5`; no imprimas el digest completo.",
        instruction:
          "1. Cambia `hashlib.md5` por `hashlib.sha256`.\n2. Mantén `.hexdigest()[:8]`.\n3. Imprime solo ese string.\n4. No alteres el blob de prueba.",
        hint: "hashlib.sha256(blob).hexdigest()[:8]",
        hints: [
          "El clic de download no basta: valida la integridad del binario.",
          "MD5 y SHA-256 producen digests distintos; el contrato pide SHA-256.",
          "Trunca a 8 hex chars para el lab; en prod suele guardarse el digest completo.",
        ],
        edgeCases: ["archivos grandes: hash streaming"],
        tests: "Stdout exacto: `3a6eb079` (sha256 de b'data'[:8]). No MD5.",
        feedback:
          "El algoritmo del contrato importa para auditoría: MD5 y SHA-256 dan digests distintos. Debiste usar sha256 de `b'data'` truncado a 8: `3a6eb079`. Un hash “cualquiera” no cierra el step del runbook CP-N2-C.",
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
        retrospective:
          "El hash cierra el step de download: evidencia reproducible del binario que alimentará OCR en S24. El error clásico es “el clic funcionó”. Pregunta: ¿qué harías si el digest no coincide con el del runbook? Luego (E3) reusas sesión con storage_state conceptual en vez de re-loguear siempre.",
      },
      {
        id: "S23-T2-A-E3",
        subtopicId: "S23-T2-A",
        kind: "transfer",
        title: "Reusar sesión o forzar login",
        preamble:
          "- **Contexto:** re-loguear en cada caso multiplica flakes y tiempo de suite; Playwright guarda `storage_state` para reusar cookies entre corridas.\n- **Meta:** implementar `session_mode(state)`: con token → `reuse`, sin token → `login`.\n- **Éxito:** dos líneas `reuse` luego `login`.\n- **Límites:** no siempre `login`; no hardcodees el resultado de las dos llamadas.",
        instruction:
          "1. Completa el cuerpo de `session_mode` (starter siempre devuelve login).\n2. Usa `state.get('token')` para decidir.\n3. Mantén los dos `print` de prueba.\n4. Función reutilizable sobre el dict.",
        hint: "Si ya hay token guardado se reutiliza la sesión; si no, toca autenticarse.",
        hints: [
          "storage_state en Playwright reutiliza cookies/localStorage entre tests.",
          "Re-loguear en cada caso multiplica flakes y tiempo de suite.",
          "La función debe servir para ambos estados: con y sin token.",
        ],
        edgeCases: ["expiry del token", "token vacío string"],
        tests: "Stdout exacto (2 líneas): reuse luego login. Función reutilizable sobre el dict state.",
        feedback:
          "Con token → reuse; sin token → login. Reuso de sesión es setup de auth, no test de negocio: re-loguear en cada caso multiplica flakes y tiempo de suite.",
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
        retrospective:
          "Reuso de sesión es setup de auth, no test de negocio: separa “tengo cookie válida” de “exporto el reporte”. El error clásico es login en cada test. Pregunta de cierre: ¿qué harías si el token expiró a mitad de suite?",
      },
      {
        id: "S23-T2-B-E1",
        subtopicId: "S23-T2-B",
        kind: "guided",
        title: "LoginPage setea auth en el contexto",
        preamble:
          "- **Contexto:** el sandbox de CP-N2-C autentica solo con password `sandbox` (credencial demo, no banco ni SUNAT).\n- **Meta:** en `LoginPage.submit`, setear `ctx['auth'] = (password == 'sandbox')`.\n- **Éxito:** imprime `True` tras submit con sandbox.\n- **Límites:** no hardcodees secretos reales; el estado va en `ctx`, no en `self.auth`.",
        instruction:
          "1. Dentro de `submit`, asigna `ctx['auth']` con la comparación de password.\n2. No cambies la firma ni el print final.\n3. Llama ya existente con `'sandbox'`.\n4. Corrige solo el cuerpo del método.",
        hint: "Dentro de submit: ctx['auth'] = password == 'sandbox'.",
        hints: [
          "El Page Object encapsula la acción; el estado de sesión vive en ctx.",
          "No reescribas la firma: submit(self, ctx, password).",
          "Sandbox del lab: solo password 'sandbox' autentica (nunca secretos reales).",
        ],
        edgeCases: ["no hardcodees secretos reales"],
        tests: "Stdout exacto: `True`. ctx['auth'] debe mutarse dentro de submit, no en el print.",
        feedback:
          "El PO encapsula la acción; el print solo lee `ctx['auth']`. Si dejas `pass`, el contexto queda vacío y el test de reporte creería que no hay sesión.",
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
        retrospective:
          "Auth en el contexto permite reusar el mismo PO en varios tests sin copiar selectores. El error clásico es mutar un atributo global del robot. Siguiente (E2): denegar el reporte si no hay sesión.",
      },
      {
        id: "S23-T2-B-E2",
        subtopicId: "S23-T2-B",
        kind: "independent",
        title: "Denegar reporte sin autenticación",
        preamble:
          "- **Contexto:** sin sesión, el adaptador no debe continuar al download del reporte sintético; el guard es parte del contrato, no un detalle de UI.\n- **Meta:** capturar `PermissionError` e imprimir `denied`.\n- **Éxito:** una línea `denied`.\n- **Límites:** no dejes la excepción sin capturar; no imprimas `ok` sin auth.",
        instruction:
          "1. Envuelve el `if not auth` / raise en `try/except PermissionError`.\n2. En el except: `print('denied')`.\n3. El path con auth imprimiría `ok` (fuera de este fixture).\n4. No cambies `ctx={'auth':False}`.",
        hint: "Envuelve el raise en try/except PermissionError.",
        hints: [
          "Sin autenticación el robot no debe seguir al download.",
          "try/except convierte el error en una decisión de negocio ('denied').",
          "En UI real el análogo puede ser redirect a login; aquí modelamos con excepción.",
        ],
        edgeCases: ["redirect a login en UI real"],
        tests: "Stdout exacto: `denied`. El proceso no debe terminar con excepción no capturada.",
        feedback:
          "Sin auth capturas `PermissionError` e imprimes `denied`. Seguir ciego al download deja un timeout opaco más tarde; el guard es decisión de negocio legible para el runbook y el on-call.",
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
        retrospective:
          "El guard de auth es un **gate** del adaptador: convierte `PermissionError` en señal legible (`denied`) antes de tocar el export. Así el runbook no confunde “portal lento” con “nunca hubo sesión”. Pregunta: ¿dónde loguearías `denied` para el on-call? Luego (E3) modelas anonymous → authenticated sin auth fantasma.",
      },
      {
        id: "S23-T2-B-E3",
        subtopicId: "S23-T2-B",
        kind: "transfer",
        title: "Transición anonymous a authenticated",
        preamble:
          "- **Contexto:** los estados de página guían qué acciones son legales en el adaptador; un login fallido no debe fingir sesión.\n- **Meta:** `apply_login(state, login_ok)` avanza solo si `login_ok` y state es `anonymous`.\n- **Éxito:** `authenticated` luego `anonymous` (True / False).\n- **Límites:** no siempre `authenticated`; no inventes estado MFA aquí.",
        instruction:
          "1. Si `login_ok` y `state == 'anonymous'` → devuelve `'authenticated'`.\n2. Si no, devuelve el `state` original.\n3. Mantén los dos prints.\n4. Función pura y reutilizable.",
        hint: "Solo muta cuando login_ok es True; en False devuelve el state original.",
        hints: [
          "Los estados de página (anonymous → authenticated) guían qué acciones son legales.",
          "Un login fallido no debe fingir authenticated.",
          "En sistemas reales puede existir mfa_pending como estado intermedio (fuera de alcance aquí).",
        ],
        edgeCases: ["mfa_pending intermedio", "doble apply idempotente"],
        tests: "Stdout exacto (2 líneas): authenticated luego anonymous.",
        feedback:
          "login_ok True avanza a authenticated; False deja anonymous. Auth fantasma dejaría pasar el guard del reporte con sesión inventada y contaminaría el run de CP-N2-C.",
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
        retrospective:
          "La transición honesta evita “auth fantasma” que deja pasar el guard del reporte. El error clásico es setear authenticated en cualquier submit. Pregunta de cierre: ¿dónde pondrías `mfa_pending` en un sistema real?",
      },
      {
        id: "S23-T3-A-E1",
        subtopicId: "S23-T3-A",
        kind: "guided",
        title: "Keys del paquete de evidencia",
        preamble:
          "- **Contexto:** en CI se compara la **forma** del paquete de falla (keys), no el texto volátil del error de cada corrida.\n- **Meta:** imprimir `sorted(ev.keys())`.\n- **Éxito:** `['error', 'screenshot', 'trace']`.\n- **Límites:** no imprimas values ni paths sueltos.",
        instruction:
          "1. Cambia `sorted(ev.values())` por `sorted(ev.keys())`.\n2. Deja el dict `ev` intacto.\n3. Un solo print.\n4. Corrige solo el defecto marcado.",
        hint: "sorted(ev.keys()), no sorted(ev.values()).",
        hints: [
          "El paquete de falla se compara por forma (keys), no por el texto del error.",
          "Ordenar keys hace el output determinista en CI.",
          "No imprimas los paths: el contrato pide las claves.",
        ],
        edgeCases: ["PII en screenshots"],
        tests: "Stdout exacto: `['error', 'screenshot', 'trace']`. Keys ordenadas, no values.",
        feedback:
          "Keys ordenadas (error, screenshot, trace) hacen el contrato del grader y del runbook determinista. Dump de values con paths que cambian rompe CI sin aportar forma estable.",
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
        retrospective:
          "Comparar la **forma** del paquete (keys) es el contrato del grader y del runbook; el texto del error puede cambiar entre corridas. El error clásico es dump de values con paths volátiles. Pregunta: ¿qué key mínima añadirías si el step es `download_report`? Siguiente (E2): filtrar ruido de logs para ver ERR.",
      },
      {
        id: "S23-T3-A-E2",
        subtopicId: "S23-T3-A",
        kind: "independent",
        title: "Filtrar logs con ERR",
        preamble:
          "- **Contexto:** el stream de info/nav ok oculta el timeout del botón; el on-call necesita solo las líneas de error.\n- **Meta:** filtrar `logs` a las que contienen `ERR`.\n- **Éxito:** `['ERR timeout']`.\n- **Límites:** no imprimas la lista completa; no mutes el original si no hace falta.",
        instruction:
          "1. Reemplaza `print(logs)` por una list comp con `'ERR' in l`.\n2. Mantén el array de entrada.\n3. Un solo print del resultado.\n4. Sin regex obligatoria.",
        hint: "[l for l in logs if 'ERR' in l]",
        hints: [
          "El on-call necesita ver ERR, no el stream completo de info.",
          "Una list comp con 'ERR' in l filtra sin mutar la lista original.",
          "Imprimir los logs enteros falla el contrato del grader.",
        ],
        edgeCases: ["niveles de log"],
        tests: "Stdout exacto: `['ERR timeout']`. Solo líneas que contienen ERR.",
        feedback:
          "Solo la línea con `ERR timeout` debe quedar. Pegar el log entero en el ticket oculta la señal para el on-call; filtra antes de escalar y abre el Trace Viewer con la evidencia de T3.",
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
        retrospective:
          "Filtrar señal de error es el primer paso antes de abrir el Trace Viewer. El error clásico es pegar el log entero en el ticket. Luego (E3) adjuntas path de trace solo cuando ok es False.",
      },
      {
        id: "S23-T3-A-E3",
        subtopicId: "S23-T3-A",
        kind: "transfer",
        title: "Adjuntar trace solo en falla",
        preamble:
          "- **Contexto:** en falla del step `s1` el adaptador debe adjuntar un path determinista `traces/s1.zip`; en éxito no se llena el disco por defecto.\n- **Meta:** si `not ok`, setear `pkg['trace']` e imprimir el dict.\n- **Éxito:** `{'step': 's1', 'trace': 'traces/s1.zip'}`.\n- **Límites:** no adjuntes trace con ok True en este ejercicio; path fijo por step.",
        instruction:
          "1. Tras crear `pkg`, si `not ok` asigna el path de trace.\n2. Luego imprime `pkg`.\n3. No cambies `ok=False` ni el step.\n4. Path exacto del contrato.",
        hint: "if not ok: pkg['trace'] = 'traces/s1.zip'",
        hints: [
          "Sin trace, el fallo del portal demo no es actuable para el on-call (equipo de guardia).",
          "El path traces/{step}.zip debe ser determinista para el grader y para CI.",
          "Solo adjunta trace cuando ok es False (política de no llenar disco).",
        ],
        edgeCases: ["retener traces N días"],
        tests: "Stdout exacto: dict con step s1 y trace traces/s1.zip (orden de keys de inserción).",
        feedback:
          "Con ok=False el pkg incluye trace traces/s1.zip. Path determinista + adjunto solo en falla = evidencia actuable sin llenar disco en happy path.",
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
        retrospective:
          "Trace en falla + path determinista = evidencia actuable y CI predecible. El error clásico es solo un print del error. Pregunta de cierre: ¿cuántos días retendrías traces en el runner del lab?",
      },
      {
        id: "S23-T3-B-E1",
        subtopicId: "S23-T3-B",
        kind: "guided",
        title: "Reintentar solo timeout y 429",
        preamble:
          "- **Contexto:** en el portal demo, timeout y 429 son transitorios; CAPTCHA es stop condition ética — no se “reintenta con otro user-agent”.\n- **Meta:** `should_retry(k)` True solo para `timeout` y `429`.\n- **Éxito:** tres líneas `timeout True`, `captcha False`, `429 True`.\n- **Límites:** no incluyas captcha ni 403 de negocio en el set.",
        instruction:
          "1. Quita `'captcha'` del set en `should_retry`.\n2. Mantén el loop de impresión sobre timeout, captcha, 429.\n3. No reordenes las tres líneas.\n4. Corrige solo la política.",
        hint: "return k in {'timeout', '429'} — sin captcha.",
        hints: [
          "Reintentar CAPTCHA es un anti-patrón ético y técnico.",
          "Timeout y 429 son transitorios; captcha es stop condition.",
          "El orden de impresión es timeout, captcha, 429.",
        ],
        edgeCases: ["no reintentar 403"],
        tests: "Stdout exacto (3 líneas): timeout True / captcha False / 429 True.",
        feedback:
          "captcha False no es un detalle del grader: es la frontera ética del robot. Timeout y 429 pueden reintentarse; reintentar captcha castiga al portal y viola la política del curso.",
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
        retrospective:
          "`should_retry` es el runbook en una función: solo transitorios (`timeout`, `429`). Incluir captcha en el set no es un detalle del grader — es un anti-patrón ético que castiga al portal. Pregunta: ¿por qué un 403 de negocio tampoco debería reintentarse? Siguiente (E2): recovery distinta para stale DOM vs. timeout.",
      },
      {
        id: "S23-T3-B-E2",
        subtopicId: "S23-T3-B",
        kind: "independent",
        title: "Recover stale con goto_home",
        preamble:
          "- **Contexto:** tras un re-render, un handle de locator viejo hace clic mal o lanza stale; seguir con `continue` perpetúa el flake.\n- **Meta:** `recover(err)`: stale → `goto_home`, timeout → `retry`.\n- **Éxito:** dos líneas `goto_home` luego `retry`.\n- **Límites:** no uses continue para stale; no unifiques todo en retry.",
        instruction:
          "1. En la rama stale, devuelve `'goto_home'` (no `'continue'`).\n2. Mantén timeout → retry.\n3. Imprime recover de stale y de timeout.\n4. No agregues ramas extra.",
        hint: "if/elif sobre err; no uses continue para stale.",
        hints: [
          "Un handle de locator viejo tras un re-render suele fallar o hacer clic mal.",
          "goto_home (o renavegar al listado) resetea el contexto de página.",
          "timeout es transitorio → retry; stale es DOM reemplazado → renavegar.",
        ],
        edgeCases: ["checkpoint de paso para reanudar", "selector_break → handoff en T4"],
        tests: "Stdout exacto (2 líneas): goto_home luego retry.",
        feedback:
          "stale → goto_home; timeout → retry. Un solo retry ciego ante handle viejo no resetea el DOM y el flake vuelve en el siguiente clic.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · recovery stale vs. timeout
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
        retrospective:
          "Stale y timeout se sienten “igual de rojos” en el log, pero piden acciones distintas: renavegar vs. reintentar el paso. El error clásico es un solo retry ciego. Luego (E3) reanudas por checkpoint sin rehacer login.",
      },
      {
        id: "S23-T3-B-E3",
        subtopicId: "S23-T3-B",
        kind: "transfer",
        title: "Siguiente step tras el checkpoint",
        preamble:
          "- **Contexto:** si el run se cortó tras login OK, rehacer login/form puede **doble enviar** el formulario del portal demo.\n- **Meta:** con `last_ok_step='login'`, imprimir el **siguiente** step (`form`).\n- **Éxito:** una línea `form`.\n- **Límites:** no reimprimas `login`; no saltes a export.",
        instruction:
          "1. Localiza el índice de `last_ok_step` en `steps`.\n2. Imprime `steps[i + 1]`.\n3. Quita el `print(steps[0])`.\n4. No mutes la lista de steps.",
        hint: "Localiza el índice de last_ok_step en steps y toma steps[i+1].",
        hints: [
          "El runbook guarda last_ok_step para reanudar sin repetir pasos ya confirmados.",
          "Si last_ok_step es 'login', el siguiente es 'form' (índice + 1).",
          "Rehacer login/form innecesariamente puede enviar dos veces el formulario en el portal demo.",
        ],
        edgeCases: ["last_ok_step al final del flujo", "backoff si el next step timeout"],
        tests: "Stdout exacto: `form` (siguiente step tras last_ok_step='login').",
        feedback:
          "Tras login_ok el siguiente step es form, no login de nuevo. “Desde el principio por si acaso” puede doble enviar el formulario del portal demo.",
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
        retrospective:
          "Checkpoint `last_ok_step` hace la corrida idempotente a nivel de paso y protege al backend del portal. El error clásico es “desde el principio por si acaso”. Pregunta de cierre: ¿qué documentarías en el runbook si last_ok_step es el último step?",
      },
      {
        id: "S23-T4-A-E1",
        subtopicId: "S23-T4-A",
        kind: "guided",
        title: "Elegir api antes que rpa",
        preamble:
          "- **Contexto:** con api, export y rpa disponibles, el adaptador debe tomar **api**; el starter pregunta rpa primero y “gana” el clic por costumbre.\n- **Meta:** cascada `api > export > rpa` (luego human).\n- **Éxito:** una línea `api`.\n- **Límites:** no elijas rpa solo porque rpa=True; no hardcodees el print.",
        instruction:
          "1. Invierte el orden de los `if/elif`: api primero.\n2. Mantén export y rpa como siguientes.\n3. Imprime solo el string del canal.\n4. Corrige solo el orden de evaluación.",
        hint: "Invierte el orden de los if: caps.get('api') debe ir primero.",
        hints: [
          "Si hay API, el adapter no debe caer a RPA ni a export por costumbre.",
          "El starter pregunta rpa antes que api: por eso imprime rpa aunque api=True.",
          "El valor de negocio es el dato verificado, no el clic automatizado.",
        ],
        edgeCases: ["feature flags", "api cae a mitad de corrida"],
        tests: "Stdout exacto: `api`. No rpa aunque rpa=True. Cascada api > export > rpa.",
        feedback:
          "Evaluar rpa primero es el defecto típico de quien acaba de aprender browser automation: el músculo del clic opaca el contrato de negocio. Con api=True la respuesta correcta es api.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · api first (jerarquía)
# Arregla: evalúa rpa antes que api (orden invertido)
caps = {'api': True, 'export': True, 'rpa': True}
if caps.get('rpa'):
    print('rpa')
elif caps.get('export'):
    print('export')
elif caps.get('api'):
    print('api')
else:
    print('human')
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
        retrospective:
          "El orden de los ifs **es** la política de integración del adaptador: api → export → rpa → human. El error clásico es “si hay RPA, RPA” porque la skill de browser está caliente. Pregunta: con los tres flags en True, ¿qué canal defiendes en la reunión de ops? Siguiente (E2): misma cascada cuando api falta y export existe.",
      },
      {
        id: "S23-T4-A-E2",
        subtopicId: "S23-T4-A",
        kind: "independent",
        title: "Cascada cae a export",
        preamble:
          "- **Contexto:** api=False, export=True, rpa=True: el CSV/xlsx del mismo reporte gana al browser RPA.\n- **Meta:** implementar la cascada y devolver/imprimir `export`.\n- **Éxito:** una línea `export`.\n- **Límites:** no hardcodees rpa; no saltes a human.",
        instruction:
          "1. Reemplaza el hardcode `c='rpa'` por if/elif sobre `f`.\n2. Orden: api → export → rpa → human.\n3. Imprime `c`.\n4. Mantén los flags del starter.",
        hint: "if api → elif export → elif rpa → else human.",
        hints: [
          "No elijas rpa solo porque rpa=True; mira la jerarquía completa.",
          "export cubre CSV/xlsx del mismo reporte sin UI frágil.",
          "Documenta la decisión en el runbook cuando caigas a RPA.",
        ],
        edgeCases: ["documenta la decisión"],
        tests: "Stdout exacto: `export`. Cascada api > export > rpa con api=False.",
        feedback:
          "Con export disponible la cascada devuelve `export`. Elegir rpa porque la skill de browser está caliente ignora el plan A del mismo reporte sin UI frágil ni superficie extra de ToS.",
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
        retrospective:
          "Export es el plan A cuando no hay API: mismo reporte, menos UI frágil y menos superficie de ToS. Hardcodear rpa ignora la cascada aunque `export=True`. Pregunta: ¿qué documentarías en el runbook si solo queda RPA? Luego (E3) empaquetas method + reason para el ticket de reemplazo.",
      },
      {
        id: "S23-T4-A-E3",
        subtopicId: "S23-T4-A",
        kind: "transfer",
        title: "Decidir canal con method y reason",
        preamble:
          "- **Contexto:** sin reason, el equipo no sabe si RPA es temporal; `no_api` habilita el ticket de “reemplazar por API”.\n- **Meta:** `decide(caps)` → dict method/reason; export gana sobre rpa cuando export=True.\n- **Éxito:** dos dicts: rpa/no_api luego export/export_ok.\n- **Límites:** no siempre rpa; evalúa api y export antes.",
        instruction:
          "1. Si api → method api reason api_ok (en la función; los prints de prueba no lo cubren).\n2. Si export → export / export_ok.\n3. Si rpa_allowed → rpa / no_api.\n4. Mantén los dos prints del starter.",
        hint: "Evalúa api primero, luego export, luego rpa con reason.",
        hints: [
          "Sin reason el equipo no sabe si RPA es temporal o permanente.",
          "reason='no_api' habilita el ticket de 'reemplazar por API'.",
          "Con export disponible no debes caer a RPA aunque rpa_allowed=True.",
        ],
        edgeCases: ["ticket de reemplazo API", "export_stale como reason alternativo"],
        tests: "Stdout exacto (2 líneas de dict): rpa/no_api luego export/export_ok.",
        feedback:
          "Primera decisión: RPA con reason `no_api`. Segunda: export con `export_ok`. RPA silencioso sin reason no habilita el ticket de reemplazo por API en la reunión de ops.",
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
        retrospective:
          "Documentar method+reason es el artefacto de gobernanza del adaptador. El error clásico es RPA silencioso sin ticket de reemplazo. Pregunta de cierre: ¿qué reason pondrías si el export existe pero está stale?",
      },
      {
        id: "S23-T4-B-E1",
        subtopicId: "S23-T4-B",
        kind: "guided",
        title: "CAPTCHA dispara handoff humano",
        preamble:
          "- **Contexto:** en el portal demo, captcha=True es stop condition: handoff humano con evidencia, nunca continue.\n- **Meta:** `decide(captcha)` → handoff si True, continue si False; probar **ambos** casos.\n- **Éxito:** dos líneas `human_handoff` luego `continue`.\n- **Límites:** no inviertas la ternaria; no omitas el caso False.",
        instruction:
          "1. Corrige la ternaria: handoff si captcha, continue si no.\n2. Añade `print(decide(False))`.\n3. Mantén `print(decide(True))` primero.\n4. Sin bypass ni servicios externos.",
        hint: "return 'human_handoff' if captcha else 'continue' — invoca decide dos veces.",
        hints: [
          "CAPTCHA es stop condition ética: no se reintenta ni se resuelve con bots.",
          "El starter invierte la ternaria y además solo prueba un caso: corrige ambos.",
          "El handoff debe incluir evidencia (url/step/screenshot) en el You Do.",
        ],
        edgeCases: ["no resolver captcha en bot", "False debe permitir continue"],
        tests: "Stdout exacto (2 líneas): human_handoff luego continue.",
        feedback:
          "`continue` con captcha activo es el defecto más grave del adaptador: silencia una frontera legal/ética. Ambos casos (True → handoff, False → continue) deben quedar en el contrato del grader.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · captcha → handoff (ambos casos)
# Arregla: ternaria invertida y solo un caso
def decide(captcha):
    return 'continue' if captcha else 'human_handoff'

print(decide(True))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def decide(captcha):
    return 'human_handoff' if captcha else 'continue'

print(decide(True))
print(decide(False))`,
          output: `human_handoff
continue`,
        },
        retrospective:
          "Handoff es política del adapter, no vergüenza del automatizador: captcha=True detiene; captcha=False permite continue. El error clásico es invertir la ternaria o solo probar el happy path. Pregunta: ¿qué evidencia mínima adjuntarías al ticket de ops? Siguiente (E2): ToS gana sobre captcha/handoff.",
      },
      {
        id: "S23-T4-B-E2",
        subtopicId: "S23-T4-B",
        kind: "independent",
        title: "ToS prohíbe y aborta el run",
        preamble:
          "- **Contexto:** si los términos prohíben automatizar, un handoff no repara la prohibición contractual: la action es `abort`.\n- **Meta:** con `tos_forbidden=True` (aunque captcha=True), imprimir `abort`.\n- **Éxito:** una línea `abort`.\n- **Límites:** no elijas human_handoff; ToS gana.",
        instruction:
          "1. Invierte la ternaria del starter: abort si tos_forbidden.\n2. No cambies el dict `sig`.\n3. Un solo print.\n4. Corrige solo la prioridad.",
        hint: "if sig.get('tos_forbidden'): abort, no handoff.",
        hints: [
          "Aunque haya captcha, ToS prohíbe y aborta el run por completo.",
          "Handoff humano no repara una prohibición contractual.",
          "El starter elige handoff a propósito: invierte la prioridad.",
        ],
        edgeCases: ["registro legal"],
        tests: "Stdout exacto: `abort`. ToS gana sobre captcha/handoff.",
        feedback:
          "Con `tos_forbidden` la action es `abort`. Pasar a un humano “para que decida el ToS” no repara una prohibición contractual del canal: ToS gana sobre handoff y sobre captcha.",
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
        retrospective:
          "abort > handoff cuando el contrato legal cierra el canal. El error clásico es “pasar a un humano y que él decida el ToS”. Luego (E3) el payload de handoff (cuando sí aplica) es actuable y sin secretos.",
      },
      {
        id: "S23-T4-B-E3",
        subtopicId: "S23-T4-B",
        kind: "transfer",
        title: "Payload de handoff actuable",
        preamble:
          "- **Contexto:** el ticket de handoff debe permitir a un analista de ops en Lima continuar en minutos: url, step y screenshot — sin cookies ni passwords.\n- **Meta:** imprimir keys ordenadas del payload y el step.\n- **Éxito:** `['screenshot', 'step', 'url'] export`.\n- **Límites:** no imprimas solo el step; no agregues secretos al payload.",
        instruction:
          "1. Imprime `sorted(payload.keys())` y `payload['step']` en un print.\n2. Mantén el dict del starter.\n3. No filtres keys a mano.\n4. Contrato exacto del grader (espacio entre lista y step).",
        hint: "Imprime las claves en orden alfabético y, aparte, el valor de `step`.",
        hints: [
          "El ticket de handoff debe ser actuable en minutos, no un dump de sesión.",
          "No incluyas passwords ni storage_state en el payload público.",
          "sorted(keys) + step export es el contrato exacto del grader.",
        ],
        edgeCases: ["sin cookies en el ticket público"],
        tests: "Stdout exacto: `['screenshot', 'step', 'url'] export` (keys sorted + step).",
        feedback:
          "Imprime keys ordenadas y el step export, no solo el step. Dump de storage_state en el ticket filtra PII de sesión y no es actuable en minutos.",
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
        retrospective:
          "Payload mínimo actuable cierra el circuito humano-robot sin filtrar PII de sesión. El error clásico es dump de storage_state en el ticket. Pregunta de cierre: ¿qué campo añadirías si el analista debe reanudar en el mismo periodo de reporte?",
      },
    ],
  },
  youDo: {
    title: "Robot de prueba con trace (web adapter CP-N2-C)",
    context:
      "Tras el borrador con aprobación humana de S22, el run CP-N2-C necesita un **reporte verificado** desde un portal de práctica. Automatiza un portal sintético (DOM en dicts; opcionalmente Playwright local con el sketch de la teoría): iniciar sesión vía Page Object, descarga con hash, retry solo de timeouts, stop en captcha/ToS, y evidencia de éxito + falla forzada. Entrega además un runbook corto en es-PE y el contrato de `last_ok_step` para reanudar sin doble envío. En S24 ese binario alimentará OCR/Document AI.",
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
# Credenciales del sandbox: solo demo / sandbox (nunca secretos reales de bancos o SUNAT)
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
        # Completa: autenticar solo con demo/sandbox; mutar ctx['auth'] a True/False
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

# --- Corrida de aceptación (completa login; el resto ya modela el contrato) ---
ctx = {}
LoginPage().submit(ctx, "demo", "sandbox")
blob = b"synthetic-report-xlsx"
sha = verify_download(blob)
print("auth", ctx.get("auth"))
print("export_btn", by_role("button", "Exportar")["id"])
print("download_link", by_role("link", "Descargar reporte")["id"])
print("sha", sha)
print("blocker_captcha", on_blocker({"captcha": True}))
print("blocker_tos", on_blocker({"tos": True}))
print("retry_timeout", should_retry("timeout"))
print("retry_captcha", should_retry("captcha"))
print("evidence_fail", evidence("export", False, "TimeoutError"))
print("evidence_ok", evidence("export", True))
print("resume_after_login", next_step("login"))
# Runbook es-PE: last_ok_step, política captcha/ToS, por qué no hubo API/export, puente a OCR (S24)
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
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con la corrida de aceptación (auth, hash, retry_captcha=False, evidence con trace en falla, resume_after_login=form)? (2) ¿qué harías distinto con un portal real vs. dicts sintéticos (ToS, PII en screenshots, secretos)? (3) En el runbook es-PE, una frase de impacto medible (p. ej. “download verificado + handoff sin bypass”) y el puente a OCR en S24 que puedas defender en 30 segundos.",
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
        options: ["Para encapsular selectores y acciones de una pantalla y reducir acoplamiento", "Para guardar contraseñas en la clase", "Para saltarse el auto-wait de Playwright", "Para evadir el CAPTCHA con otro user-agent"],
        correctIndex: 0,
        explanation:
          "Si cambia el label del botón, tocas un método del PO, no decenas de tests.",
      },
      {
        question: "Tras una descarga en el portal demo, ¿qué valida la integridad del archivo?",
        options: ["Que el clic no lanzó excepción", "Hash (p. ej. sha256) o tamaño/extensión del binario", "Que el botón tenía CSS bonito", "Reintentar el download 50 veces sin comprobar el archivo"],
        correctIndex: 1,
        explanation:
          "El éxito del step es el binario correcto, no solo el clic. Checksum mismatch → fallo con evidencia.",
      },
      {
        question: "Si last_ok_step='login' y los steps son login → form → export, ¿qué debe ejecutar el robot al reanudar?",
        options: ["Volver a login para «estar seguros»", "export saltándose form", "Abortar siempre y pedir CAPTCHA", "form (el siguiente step), evitando el doble envío del login"],
        correctIndex: 3,
        explanation:
          "La reanudación por checkpoint salta al siguiente paso tras `last_ok_step`; rehacer login/form puede enviar dos veces el formulario al portal.",
      },
      {
        question: "¿Para qué se reutiliza storage_state (cookies/localStorage) entre corridas del adaptador?",
        options: ["Para hardcodear la contraseña en el código del robot", "Para evadir el CAPTCHA guardando el token del captcha", "Para reusar la sesión autenticada y no volver a iniciar sesión en cada caso (menos flakes y menos tiempo de suite)", "Para reemplazar locators por CSS nth-child"],
        correctIndex: 2,
        explanation:
          "storage_state serializa la sesión: iniciar sesión una vez, reuso en tests de negocio. Nunca sustituye handoff ni viola ToS.",
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
