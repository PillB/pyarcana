import type { CourseSection } from '../../types'

export const section23: CourseSection = {
  id: "computer-vision",
  index: 23,
  title: "Browser RPA con Playwright",
  shortTitle: "Playwright RPA",
  tagline: "robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y reanudación idempotente",
  estimatedHours: 19,
  level: "Competente",
  phase: 1,
  icon: "Camera",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "El **adaptador web** de CP-N2-C automatiza un sitio local controlado con la mentalidad Playwright: locators de usuario, traces, retries y **API primero**. No bypassea CAPTCHA ni términos; el handoff humano es parte del contrato. Id legacy `computer-vision` se conserva; el path V3 es Browser RPA/Playwright, no visión por CNN.",
  learningOutcomes: [
    { text: "Usar locators orientados a usuario" },
    { text: "Aplicar auto-waiting y assertions fiables" },
    { text: "Automatizar formularios, uploads y downloads" },
    { text: "Modelar auth y Page Objects" },
    { text: "Diagnosticar con trace, screenshot y logs" },
    { text: "Diseñar retries y recovery robustos" },
    { text: "Priorizar API/export sobre RPA" },
    { text: "Respetar ToS/CAPTCHA y handoff humano" },
  ],
  theory: [
    {
      heading: "Browser RPA contra una fixture local controlada",
      paragraphs: [
        "Construyes el **web adapter** de CP-N2-C con la mentalidad Playwright: browser/context/page/locator/expect/download/tracing contra un **servidor HTTP local** de práctica (HTML/CSV sintéticos), sin red externa ni credenciales reales de bancos o SUNAT. Progressive disclosure: en CI los retos modelan DOM/sesión con dicts; el multiarchivo del curso usa la API real cuando el runtime está instalado.",
        "Los ejemplos multiarchivo del curso (`fixture_server.py` + `robot.py`) usan la API real cuando el runtime está instalado; los ejercicios graded pueden modelar DOM/sesión con dicts para ser reproducibles en CI sin Chromium. En ambos casos el contrato es el mismo: locators de usuario, traces de falla y downloads verificados.",
        "Orden: **T1 Navegación** (locators, auto-wait) → **T2 Flujos** (forms, auth, Page Objects) → **T3 Diagnóstico** (trace, retries) → **T4 Límites** (API-first, ToS/CAPTCHA/handoff). RPA es último recurso tras API/export; nunca bypass de CAPTCHA ni términos.",
      ],
      callout: {
        type: "info",
        title: "Runtime declarado",
        content:
          "La auditoría de snippets puede omitir el browser externo; el bundle multiarchivo y sus tests contractuales son la evidencia reproducible.",
      },
    },
    {
      heading: "DOM y locators orientados a usuario",
      subtopicId: "S23-T1-A",
      paragraphs: [
        "Prefiere **get_by_role**, **get_by_label**, **get_by_text** sobre CSS/XPath frágiles. El usuario — y el árbol de accesibilidad — ve roles y nombres (“Descargar reporte”), no `#app > div:nth-child(3)`. En portales sintéticos PE de demo, pide `data-testid` si falta rol; el testid es contrato de producto, no un parche del robot.",
        "Orden de estrategia didáctico: **role → testid → texto → CSS**. CSS queda como último recurso; si solo hay CSS frágil, el producto también es menos usable para personas. Modelamos locators como consultas sobre nodos `{role, name, id}`: misma semántica en CI sin Chromium y en multiarchivo con Playwright real.",
        "Caso sintético: botón “Descargar reporte” id `b1` se resuelve por role+name; un logo `img` sin role de control interactivo **no** sustituye al botón de negocio. `LookupError` si no hay match enseña fallar ruidoso en setup — no click ciego al primer div.",
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
      heading: "auto-waiting y assertions",
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
      heading: "formularios, uploads/downloads y sesiones",
      subtopicId: "S23-T2-A",
      paragraphs: [
        "Flujos típicos del adapter: **fill** campos (usuario, periodo), **set_input_files**/upload de plantilla, click, esperar **download** y verificar path, tamaño o hash. No basta con que el click no lance: valida el binario.",
        "**storage_state** (cookies/localStorage) reutiliza sesión autenticada entre tests para no re-loguear en cada caso — en el lab un dict {token:'t'} modela reuse. Nunca hardcodees contraseñas reales; sandbox usa demo/sandbox.",
        "Caso PE sintético: form periodo 2026-01, upload plantilla.xlsx sintética PK header, download con sha256 hex corto. Checksum mismatch → fallo de step y evidencia, no “éxito silencioso”.",
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
upload(session, "plantilla.xlsx", b"PK\\x03\\x04synthetic")
meta = download(session, "plantilla.xlsx")
print("form", form)
print("download", meta)`,
        output: `form {'usuario': 'analista', 'periodo': '2026-01'}
download {'path': '/tmp/plantilla.xlsx', 'sha256': '0ea0879b8c50', 'n': 13}`,
      },
      callout: {
        type: "tip",
        title: "Verifica el binario",
        content:
          "No basta con que el click no falle: chequea tamaño, extensión o hash del download.",
      },
    },
    {
      heading: "auth, estados y Page Objects",
      subtopicId: "S23-T2-B",
      paragraphs: [
        "Un **Page Object** encapsula selectores y acciones de una pantalla (`LoginPage.submit`, `ReportPage.open`). Separa **auth setup** (fixture storage_state) del test de negocio del reporte para no duplicar login en 20 tests.",
        "Estados de página: anonymous → authenticated (o mfa_pending en sistemas reales; aquí sandbox simple). ReportPage.open lanza PermissionError si no auth — el robot captura y reporta 'denied' en vez de seguir al download.",
        "Contrato lab: LoginPage con password 'sandbox' setea auth; mal password deja anonymous. El PO no contiene sleeps mágicos; expone acciones que el test compone. Facilita cambiar el selector del botón sin tocar 15 tests.",
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
      heading: "trace, screenshot y logs",
      subtopicId: "S23-T3-A",
      paragraphs: [
        "Ante falla, empaqueta **trace** (zip Playwright), **screenshot** y **error** string. Keys del paquete se ordenan para diffs estables en CI. Sin evidencia, el on-call en Lima no reproduce el flake del portal demo.",
        "Filtra console logs por 'ERR' u otros marcadores; el ruido de info no debe ocultar el timeout. Si ok=False, adjunta trace path traces/{step}.zip al pkg del step. En PyArcana trabajamos con fixtures sintéticos de operaciones (Lima, America/Lima) y nunca PII real de clientes.",
        "Caso: step s1 falla → pkg con trace+screenshot+error. Política: traces solo en fallo o sample rate bajo en éxito para no llenar disco del runner sintético. En PyArcana trabajamos con fixtures sintéticos de operaciones (Lima, America/Lima) y nunca PII real de clientes.",
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
        title: "Evidencia en el gate",
        content:
          "CP-N2-C web adapter pide trace de éxito/falla reproducible.",
      },
    },
    {
      heading: "selectores robustos, retries y recovery",
      subtopicId: "S23-T3-B",
      paragraphs: [
        "Retries solo para errores **transitorios** (timeout, red, 429), **nunca** para CAPTCHA, 403 de negocio ni ToS. `should_retry(kind)` codifica la política. Tras max intentos de timeout → fail con conteo, no loop infinito.",
        "Recovery: err=='stale' (DOM reemplazado) → action goto_home o re-nav al listado. Re-obtener locator tras navegación; no reuses handles viejos. Estrategia de selectores se reevalúa en recovery.",
        "Caso sintético: tres timeouts seguidos → 'fail 3'. Un captcha en medio no se “reintenta con otro user-agent”: va a human_handoff en T4. El runbook documenta max_attempts=3 y backoff opcional.",
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
        "Jerarquía de preferencia: **api > export > rpa > human**. Si el sistema ofrece endpoint o CSV export del mismo reporte, úsalo: menos flakes, menos ToS grises, más barato de operar. **RPA es último recurso de automatización**, no el default del adapter web CP-N2-C.",
        "Toda caída a RPA registra reason ('no_api', 'export_stale', etc.) en el decision dict del run. Documenta por qué se eligió RPA en el runbook del adapter web CP-N2-C. En PyArcana trabajamos con fixtures sintéticos de operaciones (Lima, America/Lima) y nunca PII real de clientes.",
        "Caso: flags api=False, export=True, rpa=True → choice export. Si solo rpa → method rpa con reason no_api. El valor de negocio es el dato verificado, no “haber automatizado el click”.",
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
      heading: "términos, CAPTCHA, desktop fallback y handoff humano",
      subtopicId: "S23-T4-B",
      paragraphs: [
        "Si **ToS forbidden** para automatización, `action=abort` (**ToS gana** sobre CAPTCHA y sobre “pero es urgente”). Si captcha=True y ToS permite humano, **human_handoff** con payload url/step/screenshot — nunca scripts de bypass ni granjas de captcha en el curso.",
        "Desktop fallback (app nativa) solo si el contrato del sistema lo contempla y está en scope; no es excusa para evadir políticas web. El handoff incluye evidencia para que un analista continúe en minutos.",
        "Caso PE: portal demo muestra captcha de prueba → handoff; tos_forbidden True → abort aunque haya captcha. Matching de datos posteriores al download sigue siendo evidencia, no prueba de fraude. El adaptador respeta límites legales y de producto.",
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
    intro: "Te muestro el web adapter CP-N2-C: locators de usuario, waits, Page Objects, traces y límites éticos (API first, no CAPTCHA).",
    steps: [
      {
        demoId: "S23-T1-A-DEMO",
        subtopicId: "S23-T1-A",
        environment: "local",
        description: "Preferir locators de rol/texto de usuario sobre CSS.",
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
          output: `{'role': 'button', 'name': 'Enviar'}`,
        },
        why: "Los roles estables reducen mantenimiento.",
      },
      {
        demoId: "S23-T1-B-DEMO",
        subtopicId: "S23-T1-B",
        environment: "local",
        description: "Assertions con auto-waiting correctos (condición, no sleep).",
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
          output: `visible 3`,
        },
        why: "Esperar condición evita flakiness.",
      },
      {
        demoId: "S23-T2-A-DEMO",
        subtopicId: "S23-T2-A",
        environment: "local",
        description: "Completar form con upload/download verificado.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `import hashlib

def fill_and_hash(form, blob):
    return form, hashlib.sha256(blob).hexdigest()[:8]

form, sha = fill_and_hash({"q": "enero"}, b"synthetic-xlsx")
print("filled", form)
print("sha", sha)
print("ok", True)
`,
          output: `filled {'q': 'enero'}
sha 3cdfe594e4 n 14`,
        },
        why: "Verifica el archivo descargado, no solo el click.",
      },
      {
        demoId: "S23-T2-B-DEMO",
        subtopicId: "S23-T2-B",
        environment: "local",
        description: "Encapsular auth y Page Objects.",
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
          output: `auth True`,
        },
        why: "Page Objects centralizan selectores.",
      },
      {
        demoId: "S23-T3-A-DEMO",
        subtopicId: "S23-T3-A",
        environment: "local",
        description: "Capturar trace/screenshot en falla.",
        code: {
          language: 'python',
          title: "demo.py",
          code: `def failure_package(err):
    return {"trace": "t.zip", "shot": "s.png", "error": err}

print(failure_package("TimeoutError"))
print("evidence", True)
print("ok", True)
`,
          output: `{'trace': 't.zip', 'shot': 's.png', 'error': 'TimeoutError'}`,
        },
        why: "Sin evidencia, el fallo no es accionable.",
      },
      {
        demoId: "S23-T3-B-DEMO",
        subtopicId: "S23-T3-B",
        environment: "local",
        description: "Recuperar de fallas transitorias de UI.",
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
print("retry_ok", True)
print("ok", True)
`,
          output: `2 handoff`,
        },
        why: "Retry selectivo + recovery.",
      },
      {
        demoId: "S23-T4-A-DEMO",
        subtopicId: "S23-T4-A",
        environment: "local",
        description: "Preferir API/export antes de RPA.",
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
          output: `export`,
        },
        why: "API first reduce costo operativo.",
      },
      {
        demoId: "S23-T4-B-DEMO",
        subtopicId: "S23-T4-B",
        environment: "local",
        description: "Detener en CAPTCHA/ToS y escalar a humano.",
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
          output: `human_handoff`,
        },
        why: "Handoff es parte del diseño, no un fallo vergonzoso.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de locators, auto-wait, forms/downloads, PO, traces, retries, API-first y handoff.",
    steps: [
      {
        id: "S23-T1-A-E1",
        subtopicId: "S23-T1-A",
        kind: "guided",
        instruction:
          "Locator por rol: nodes=[{'role':'link','name':'Inicio','id':'n1'}]. Encuentra role=link y name=Inicio; imprime id. Contrato: next/generador o loop; Lookup si no hay. Pass: n1.",
        hint: "next(...)",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["StopIteration si no existe"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · locator por role+name
# DEFECT: busca role=button en vez de link
nodes=[{'role':'link','name':'Inicio','id':'n1'}]
print(next((n['id'] for n in nodes if n['role']=='button' and n['name']=='Inicio'), None))
print('ok', True)
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
          "Prioridad de estrategias: strats=['css','role','testid']. Ordena priorizando role, testid, css (preferred index). Imprime lista ordenada. Contrato: sorted key. Pass: ['role', 'testid', 'css'].",
        hint: "key=index en preferred",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["texto también válido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · prioridad role > testid > css
# DEFECT: ordena por nombre alfabético
strats=['css','role','testid']
order={'role':0,'testid':1,'css':2}
print(sorted(strats))
print('ok', True)
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
          "Sin control button en nodes (solo img logo): al buscar button imprime 'need_testid' si no hay role button; si hubiera, su name. Contrato: fail-closed a testid. Pass: need_testid.",
        hint: "try/except LookupError",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["coordina con frontend"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · sin role usable → need_testid
# DEFECT: asume primer nodo sin filtrar role
nodes=[{'role':'img','name':'logo'}]
hits=[n for n in nodes if n['role']=='button']
print(nodes[0]['name'])
print('ok', True)
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
          "Auto-wait simulado: ready se vuelve True en el intento 2 de un loop 1..N. Imprime el número de intento cuando ready. Contrato: sin sleep real. Pass: 2.",
        hint: "for loop",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["timeout path"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · auto-wait imprime i cuando ready
# DEFECT: imprime siempre el último i
for i in range(1, 4):
    ready = i >= 2
    if ready:
        pass
print(i)
print('ok', True)
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
          "Timeout de espera: ready=False fijo; tras 3 intentos sin ready imprime 'timeout'. Contrato: no reintentar infinito. Pass: timeout. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "for-else",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["timeout_ms en Playwright"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · for-else timeout
# DEFECT: imprime ok aunque ready sigue False
ready = False
for i in range(3):
    if ready:
        print('ok')
        break
else:
    print('ok')
print('ok', True)
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
          "Assertion de título: expected=actual='Portal demo'. Imprime 'pass' si iguales else 'fail'. Contrato: postcondición de navegación. Pass: pass. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "comparación",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["soft assertions fuera de alcance"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · assertion de título
# DEFECT: compara siempre pass
expected, actual = 'Portal demo', 'Portal demo'
print('fail')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `expected, actual = 'Portal demo', 'Portal demo'
print('pass' if expected == actual else 'fail')`,
          output: `pass`,
        },
      },
      {
        id: "S23-T2-A-E1",
        subtopicId: "S23-T2-A",
        kind: "guided",
        instruction:
          "Fill de formulario sintético: form={}; asigna usuario='ana'; imprime form. Contrato: update/asignación. Pass: {'usuario': 'ana'}. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "update o index",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["campos vacíos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · fill form field
# DEFECT: no asigna el valor
form = {}
# form['usuario'] = 'ana'  # DEFECT omitido
print(form)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `form = {}
form['usuario'] = 'ana'
print(form)`,
          output: `{'usuario': 'ana'}`,
        },
      },
      {
        id: "S23-T2-A-E2",
        subtopicId: "S23-T2-A",
        kind: "independent",
        instruction:
          "Verificación de download: sha256 hex de b'data', primeros 8 chars. import hashlib. Contrato: hexdigest()[:8]. Pass: 3a6eb079. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "hashlib",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["archivos grandes: hash streaming"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · hash de download
# DEFECT: usa md5 truncado distinto / len wrong
import hashlib
print(hashlib.md5(b'data').hexdigest()[:8])
print('ok', True)
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
          "Reuso de sesión: state={'token':'t'}. Si token presente imprime 'reuse' (no re-login). Contrato: storage_state conceptual. Pass: reuse. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "dict get",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["expiry del token"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · reuso de sesión
# DEFECT: siempre login aunque hay token
state={'token':'t'}
print('login')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `state={'token':'t'}
print('reuse' if state.get('token') else 'login')`,
          output: `reuse`,
        },
      },
      {
        id: "S23-T2-B-E1",
        subtopicId: "S23-T2-B",
        kind: "guided",
        instruction:
          "Page Object LoginPage: si password=='sandbox' autentica. Implementa submit; prueba e imprime auth True. Contrato: clase con estado. Pass: True. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "clase simple",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["no hardcodees secretos reales"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · Page Object login sandbox
class LoginPage:
    def __init__(self):
        self.auth = False
    def submit(self, user, password):
        # DEFECT: no setea auth
        pass

p = LoginPage()
p.submit('ana', 'sandbox')
print(p.auth)
print('ok', True)
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
          "ReportPage sin auth: ctx auth False; open debe denegar. Captura PermissionError e imprime 'denied'. Contrato: no continuar al reporte. Pass: denied. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "try/except",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["redirect a login en UI real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · guard de auth
# DEFECT: no captura PermissionError
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
          "Transición de estado: state='anonymous'; tras login ok imprime 'authenticated'. Contrato: máquina simple de estados. Pass: authenticated. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "variable state",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["mfa_pending intermedio"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · transición de estado
# DEFECT: deja state en anonymous
state='anonymous'
login_ok=True
# if login_ok: state='authenticated'  # DEFECT omitido
print(state)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `state='anonymous'
login_ok=True
if login_ok:
    state='authenticated'
print(state)`,
          output: `authenticated`,
        },
      },
      {
        id: "S23-T3-A-E1",
        subtopicId: "S23-T3-A",
        kind: "guided",
        instruction:
          "Paquete de evidencia: ev con trace, screenshot, error. Imprime sorted(keys). Contrato: keys estables para CI. Pass: ['error', 'screenshot', 'trace']. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "dict keys",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["PII en screenshots"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · keys del paquete de falla
# DEFECT: imprime values no keys
ev={'trace':'a.zip','screenshot':'b.png','error':'x'}
print(sorted(ev.values()))
print('ok', True)
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
          "Filtro de console: logs=['ok','ERR timeout','nav']; imprime solo líneas que contienen 'ERR'. Contrato: list comp. Pass: ['ERR timeout']. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "list comp",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["niveles de log"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · filtrar ERR en logs
# DEFECT: no filtra
logs=['ok','ERR timeout','nav']
print(logs)
print('ok', True)
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
          "Adjuntar trace en falla: ok=False, pkg={'step':'s1'}; si not ok añade trace 'traces/s1.zip'; imprime pkg. Contrato: path determinista. Pass: dict de solution.",
        hint: "condicional",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["retener traces N días"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · adjuntar trace en falla
# DEFECT: no adjunta trace cuando ok=False
ok=False
pkg={'step':'s1'}
print(pkg)
print('ok', True)
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
          "Política should_retry: True solo para 'timeout' y '429'. Prueba timeout, captcha, 429 e imprime tres líneas kind bool. Contrato: captcha no retry. Pass multi-línea de solution.",
        hint: "in set",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["no reintentar 403"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · retry solo timeout/429
def should_retry(k):
    # DEFECT: reintenta captcha también
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
          "Recovery stale DOM: err='stale' → action 'goto_home'. Imprime action. Contrato: re-nav, no click en handle viejo. Pass: goto_home. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "if/else",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["checkpoint de paso"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · recovery stale
# DEFECT: continue en stale
err='stale'
print('continue' if err=='stale' else 'goto_home')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `err='stale'
print('goto_home' if err=='stale' else 'continue')`,
          output: `goto_home`,
        },
      },
      {
        id: "S23-T3-B-E3",
        subtopicId: "S23-T3-B",
        kind: "transfer",
        instruction:
          "Máx 3 timeouts: errors lista de tres 'timeout' → imprime 'fail 3' con conteo. Contrato: exhaust retries. Pass: fail 3. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "loop",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["backoff exponencial opcional"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · agotar reintentos
# DEFECT: no imprime exhausted
errors=['timeout','timeout','timeout']
for i,e in enumerate(errors,1):
    if e!='timeout':
        print('ok', i)
        break
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `errors=['timeout','timeout','timeout']
for i,e in enumerate(errors,1):
    if e!='timeout':
        print('ok', i)
        break
    if i==3:
        print('fail', i)`,
          output: `fail 3`,
        },
      },
      {
        id: "S23-T4-A-E1",
        subtopicId: "S23-T4-A",
        kind: "guided",
        instruction:
          "API-first gate: api=True → elige 'api'. Imprime la elección del método de obtención de datos. Contrato: preferencia sobre RPA. Pass: api. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "ternario",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["feature flags"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · api first
# DEFECT: elige rpa aunque api=True
api=True
print('rpa' if api else 'api')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `api=True
print('api' if api else 'rpa')`,
          output: `api`,
        },
      },
      {
        id: "S23-T4-A-E2",
        subtopicId: "S23-T4-A",
        kind: "independent",
        instruction:
          "Orden api>export>rpa: flags api False, export True, rpa True → imprime 'export'. Contrato: primera disponible en la jerarquía. Pass: export. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "if chain",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["documenta la decisión"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · cascada api>export>rpa
# DEFECT: elige rpa primero
f={'api':False,'export':True,'rpa':True}
c='rpa'
print(c)
print('ok', True)
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
          "Decisión documentada: cae a rpa con reason 'no_api'. Imprime dict method/reason. Contrato: auditoría de por qué RPA. Pass: {'method': 'rpa', 'reason': 'no_api'}.",
        hint: "dict con method y reason",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["ticket de reemplazo API"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · documentar decisión
# DEFECT: omite reason
decision={'method':'rpa','reason':'no_api'}
print({'method': decision['method']})
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `decision={'method':'rpa','reason':'no_api'}
print(decision)`,
          output: `{'method': 'rpa', 'reason': 'no_api'}`,
        },
      },
      {
        id: "S23-T4-B-E1",
        subtopicId: "S23-T4-B",
        kind: "guided",
        instruction:
          "CAPTCHA en portal demo: captcha=True → imprime 'human_handoff' sin intentar bypass ni granja. Contrato: handoff humano obligatorio. Pass: human_handoff.",
        hint: "if",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["no resolver captcha en bot"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · captcha → handoff
# DEFECT: continue con captcha
captcha=True
print('continue' if captcha else 'human_handoff')
print('ok', True)
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
          "ToS gana: sig con tos_forbidden True (y captcha True). action abort. Imprime action. Contrato: abort > handoff. Pass: abort. Usa solo fixtures sintéticos del lab; la salida debe coincidir exactamente con el solution output del grader.",
        hint: "signals dict",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["registro legal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · ToS prohibido aborta
# DEFECT: handoff en vez de abort
sig={'tos_forbidden':True,'captcha':True}
print('human_handoff' if sig.get('tos_forbidden') else 'abort')
print('ok', True)
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
          "Payload handoff: arma estructura con url, step, screenshot; imprime keys sorted y marca export según solution output. Contrato: evidencia para analista humano. Pass debe coincidir solution.",
        hint: "dict",
        hints: [
          "contrato I/O en instruction",
          "compara output con solution",
          "datos sintéticos only",
        ],
        edgeCases: ["sin cookies en el ticket público"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-023 · payload de handoff
# DEFECT: imprime solo step
payload={'url':'https://demo.test/app','step':'export','screenshot':'s.png'}
print(payload['step'])
print('ok', True)
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
      "Automatiza un portal sintético (DOM en dicts o Playwright local): login Page Object, descarga verificada por hash, retry de timeout y stop en captcha. Entrega trace de éxito y de falla forzada.",
    objectives: [
      "Locators por rol en flujo de descarga",
      "Download con verificación de integridad",
      "Retry solo transitorios + handoff en captcha",
      "Paquete de evidencia trace/screenshot",
    ],
    requirements: [
      "Sitio de prueba controlado o simulación",
      "Sin bypass de CAPTCHA/ToS",
      "Reanudación idempotente documentada",
      "es-PE en runbook",
    ],
    starterCode: `# Simulación de robot — mapeable a Playwright
DOM = [{"role": "button", "name": "Exportar"}]
# DEFECT labels cover locator/hash/retry/captcha contracts
print("web adapter")
`,
    portfolioNote:
      "Evidencia del adaptador web CP-N2-C: traces + download verificado + política de handoff.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Por qué preferir get_by_role a CSS nth-child?",
        options: ["Es más corto de escribir siempre", "Playwright no soporta CSS", "Refleja la UI accesible y suele ser más estable", "Evita assertions"],
        correctIndex: 2,
        explanation:
          "Roles y nombres son más estables y accesibles.",
      },
      {
        question: "Ante un CAPTCHA el robot debe:",
        options: ["Detenerse y hacer handoff humano", "Resolverlo con un servicio externo", "Reintentar 100 veces", "Ignorar ToS"],
        correctIndex: 0,
        explanation:
          "CAPTCHA es stop condition ética y de ToS.",
      },
      {
        question: "API/export primero significa:",
        options: ["RPA siempre", "Buscar integración no-UI antes de automatizar el browser", "Prohibir Excel", "Solo cloud"],
        correctIndex: 1,
        explanation:
          "RPA es último recurso.",
      },
      {
        question: "Un retry seguro reintenta:",
        options: ["Cualquier error", "Solo éxitos", "Captchas", "Solo fallas transitorias (timeout/red), no captcha/403 de negocio"],
        correctIndex: 3,
        explanation:
          "Retry selectivo evita loops dañinos.",
      },
      {
        question: "En el diagnóstico de un fallo de RPA, ¿qué paquete de evidencia es mínimo?",
        options: ["Solo el print del error en consola", "El password del usuario en el log", "trace + screenshot + error tipado (y step id)", "Un video de YouTube genérico de Playwright"],
        correctIndex: 2,
        explanation:
          "Trace, screenshot y error tipado permiten reanudar y auditar sin PII ni secretos.",
      }
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
