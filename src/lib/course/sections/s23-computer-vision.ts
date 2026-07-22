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
    "El **adaptador web** de CP-N2-C automatiza un sitio local controlado con la API real de Playwright: locators de usuario, traces, retries y **API primero**. No bypassea CAPTCHA ni términos; el handoff humano es parte del contrato.",
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
        "Construyes el **web adapter** de CP-N2-C con `playwright.sync_api` contra un servidor HTTP local incluido en la práctica, con traces y downloads verificados.",
        "Los ejemplos son contratos multiarchivo: `fixture_server.py` sirve HTML/CSV sintéticos y `robot.py` usa browser, context, page, locator, expect, download y tracing reales. Requieren Playwright y Chromium instalados localmente; no usan red externa.",
        "Orden: **T1 Navegación** → **T2 Flujos** → **T3 Diagnóstico** → **T4 Límites**. RPA es el último recurso tras API/export.",
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
        "Prefiere **get_by_role**, **get_by_label**, **get_by_text** sobre CSS/XPath frágiles. El usuario ve roles y nombres, no `#app > div:nth-child(3)`.",
        "CSS queda como **último recurso** cuando no hay rol accesible — y entonces pide al equipo un `data-testid`.",
        "Modelamos locators como consultas sobre un árbol DOM sintético.",
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
        "Playwright **auto-espera** a que el elemento sea actionable. Evita `time.sleep` fijos: usa expect con timeout explícito.",
        "Assertions (`expect(locator).to_be_visible()`) documentan la postcondición del paso.",
        "Simulamos un reloj y condiciones de readiness.",
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
        "Flujos típicos: **fill** campos, **set_input_files**, click, esperar **download** y verificar path/checksum.",
        "**storage_state** persiste cookies/localStorage para no re-loguear en cada test.",
        "Simulamos form + download en dicts.",
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
        "Un **Page Object** encapsula selectores y acciones de una pantalla (`LoginPage.submit`).",
        "Separa **auth setup** (fixture con storage_state) del test de negocio.",
        "Estados de página: anonymous, authenticated, mfa_pending.",
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
        "En falla, captura **trace.zip**, **screenshot** y **console logs**. Son el expediente del robot.",
        "Traces permiten replay; no subas traces con secretos a repos públicos.",
        "Simulamos un paquete de evidencia de falla.",
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
        "**Retry policy**: reintenta solo errores transitorios (timeout de red, 429), no fallas de negocio (403, captcha).",
        "**Recovery**: re-navegar a URL estable, rehidratar storage_state, reanudar desde checkpoint.",
        "Estrategia de selectores: role → test id → texto → CSS.",
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
        "Antes de RPA, busca **API**, **export CSV/XLSX**, **reportes programados**. El robot UI es frágil y caro.",
        "Decision tree: ¿hay endpoint? ¿export manual automatizable por URL firmada? Si no, RPA con límites.",
        "Documenta por qué se eligió RPA en el runbook.",
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
        "Respeta **ToS** del sitio. Si aparece **CAPTCHA**, detén el robot y crea tarea humana.",
        "Desktop fallback (pyautogui etc.) solo con autorización y en entorno controlado; no es default del curso.",
        "Handoff: payload con URL, screenshot, paso fallido y contexto de negocio.",
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

print(by_role("button", "Enviar"))`,
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
          code: `ready = False
for i in range(5):
    if i == 3:
        ready = True
    if ready:
        print("visible", i)
        break
else:
    print("timeout")`,
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
form = {"q": "enero"}
blob = b"synthetic-xlsx"
print("filled", form)
print("sha", hashlib.sha256(blob).hexdigest()[:10], "n", len(blob))`,
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
ctx = {}
Login().go(ctx)
print("auth", ctx["auth"])`,
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
          code: `err = "TimeoutError"
print({"trace": "t.zip", "shot": "s.png", "error": err})`,
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
            return "handoff"
    return "fail"
print(retry(["timeout", "ok"]), retry(["captcha"]))`,
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
          code: `opts = {"api": False, "export_url": True, "rpa": True}
choice = "api" if opts["api"] else ("export" if opts["export_url"] else "rpa")
print(choice)`,
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
          code: `sig = {"captcha": True}
print("human_handoff" if sig.get("captcha") or sig.get("tos") else "continue")`,
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
          "En una lista de nodos, encuentra role=link name=Inicio e imprime su id.",
        hint: "next(...)",
        hints: [
          "next(...)",
          "compara role y name",
        ],
        edgeCases: ["StopIteration si no existe"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes=[{'role':'link','name':'Inicio','id':'n1'}]
# TODO
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
          "Ordena estrategias ['css','role','testid'] priorizando role, testid, css e imprime.",
        hint: "key=index en preferred",
        hints: [
          "key=index en preferred",
          "sorted",
        ],
        edgeCases: ["texto también válido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `strats=['css','role','testid']
# TODO
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
          "Si no hay role, devuelve 'need_testid' else el name del button.",
        hint: "try/except LookupError",
        hints: [
          "try/except LookupError",
          "mensaje claro",
        ],
        edgeCases: ["coordina con frontend"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `nodes=[{'role':'img','name':'logo'}]
# TODO buscar button
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
          "Simula wait: ready se vuelve True en intento 2; imprime el intento.",
        hint: "for loop",
        hints: [
          "for loop",
          "break",
        ],
        edgeCases: ["timeout path"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
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
          "Si tras 3 intentos no ready, imprime 'timeout'.",
        hint: "for-else",
        hints: [
          "for-else",
          "flag",
        ],
        edgeCases: ["timeout_ms en Playwright"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ready = False
# TODO
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
          "Assertion: expected título 'Portal demo' == actual; imprime pass/fail.",
        hint: "comparación",
        hints: [
          "comparación",
          "mensaje",
        ],
        edgeCases: ["soft assertions fuera de alcance"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `expected, actual = 'Portal demo', 'Portal demo'
# TODO
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
          "Actualiza form={} con usuario='ana' e imprime form.",
        hint: "update o index",
        hints: [
          "update o index",
          "dict",
        ],
        edgeCases: ["campos vacíos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `form = {}
# TODO
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
          "Calcula sha256 hex[:8] de b'data' como verificación de download.",
        hint: "hashlib",
        hints: [
          "hashlib",
          "hexdigest",
        ],
        edgeCases: ["archivos grandes: hash streaming"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib
# TODO
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
          "Simula storage_state={'token':'t'} reutilizado: imprime 'reuse' si token presente.",
        hint: "dict get",
        hints: [
          "dict get",
          "auth fixture",
        ],
        edgeCases: ["expiry del token"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `state={'token':'t'}
# TODO
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
          "LoginPage: si password=='sandbox' set auth True. Prueba e imprime auth.",
        hint: "clase simple",
        hints: [
          "clase simple",
          "método submit",
        ],
        edgeCases: ["no hardcodees secretos reales"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `class LoginPage:
    pass  # TODO
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
          "ReportPage.open lanza PermissionError si no auth; captura e imprime 'denied'.",
        hint: "try/except",
        hints: [
          "try/except",
          "PermissionError",
        ],
        edgeCases: ["redirect a login en UI real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ctx={'auth':False}
# TODO
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
          "Estados: anonymous→authenticated tras login. Imprime la transición.",
        hint: "variable state",
        hints: [
          "variable state",
          "asignación",
        ],
        edgeCases: ["mfa_pending intermedio"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `state='anonymous'
# TODO login ok
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
          "Arma dict de evidencia con keys trace, screenshot, error e imprime keys sorted.",
        hint: "dict keys",
        hints: [
          "dict keys",
          "sorted",
        ],
        edgeCases: ["PII en screenshots"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ev={'trace':'a.zip','screenshot':'b.png','error':'x'}
# TODO
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
          "De console logs, imprime solo las líneas que contienen 'ERR'.",
        hint: "list comp",
        hints: [
          "list comp",
          "in",
        ],
        edgeCases: ["niveles de log"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `logs=['ok','ERR timeout','nav']
# TODO
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
          "Si ok=False adjunta trace path; imprime el paquete final.",
        hint: "condicional",
        hints: [
          "condicional",
          "dict update",
        ],
        edgeCases: ["retener traces N días"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ok=False
pkg={'step':'s1'}
# TODO
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
          "should_retry: True solo para 'timeout' y '429'. Prueba tres valores.",
        hint: "in set",
        hints: [
          "in set",
          "función",
        ],
        edgeCases: ["no reintentar 403"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `def should_retry(k):
    # TODO
    pass
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
          "Recovery: si err=='stale', re-navega (action='goto_home'). Imprime action.",
        hint: "if/else",
        hints: [
          "if/else",
          "default continue",
        ],
        edgeCases: ["checkpoint de paso"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `err='stale'
# TODO
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
          "Máx 3 intentos de timeout luego fail. Cuenta intentos e imprime resultado.",
        hint: "loop",
        hints: [
          "loop",
          "break on success",
        ],
        edgeCases: ["backoff exponencial opcional"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `errors=['timeout','timeout','timeout']
# TODO
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
          "Si api=True elige 'api'. Imprime la elección.",
        hint: "ternario",
        hints: [
          "ternario",
          "prioridad",
        ],
        edgeCases: ["feature flags"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `api=True
# TODO
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
          "Orden de preferencia api > export > rpa > human. Dado flags, imprime choice.",
        hint: "if chain",
        hints: [
          "if chain",
          "dict flags",
        ],
        edgeCases: ["documenta la decisión"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `f={'api':False,'export':True,'rpa':True}
# TODO
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
          "Registra reason='no_api' cuando caes a rpa. Imprime decision dict.",
        hint: "dict con method y reason",
        hints: [
          "dict con method y reason",
          "auditoría",
        ],
        edgeCases: ["ticket de reemplazo API"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
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
          "Si captcha True imprime 'human_handoff'.",
        hint: "if",
        hints: [
          "if",
          "boolean",
        ],
        edgeCases: ["no resolver captcha en bot"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `captcha=True
# TODO
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
          "ToS forbidden → action abort. Imprime action.",
        hint: "signals dict",
        hints: [
          "signals dict",
          "priority tos",
        ],
        edgeCases: ["registro legal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `sig={'tos_forbidden':True,'captcha':True}
# TODO tos gana
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
          "Arma payload de handoff con url, step, screenshot e imprime.",
        hint: "dict",
        hints: [
          "dict",
          "campos mínimos",
        ],
        edgeCases: ["sin cookies en el ticket público"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
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
# TODO: locator, download hash, retry, captcha stop
print("TODO web adapter")
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
    ],
  },
  resources: {
    docs: [
      {
        label: "Playwright Python",
        url: "https://playwright.dev/python/",
        note: "Locators y traces",
      },
      {
        label: "Playwright best practices",
        url: "https://playwright.dev/python/docs/best-practices",
        note: "Auto-wait y selectores",
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
        note: "Exploración inicial",
      },
    ],
  },
}
