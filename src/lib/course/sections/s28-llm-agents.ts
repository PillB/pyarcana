import type { CourseSection } from '../../types'

export const section28: CourseSection = {
  id: "llm-agents",
  index: 28,
  title: "Pruebas de datos, propiedades e integración",
  shortTitle: "Props e integración",
  tagline: "suite que encuentra errores de encoding, cardinalidad, orden, timeout y reanudación, con fixtures sintéticas mínimas",
  estimatedHours: 12,
  level: "Competente",
  phase: 2,
  icon: "ShieldCheck",
  accentColor: "bg-gradient-to-br from-emerald-500 to-teal-700",
  jobRelevance:
    "El **QA del motor ER** (CP-N3-A) exige propiedades, contratos de schema y pruebas de integración sin flakes. Esta sección (id `llm-agents` conservado) retematiza a V3 **Pruebas de datos, propiedades e integración**: invariantes, goldens, dobles controlados y CI determinista. Datos sintéticos; matching ≠ fraude.",
  learningOutcomes: [
    { text: "Generar casos desde invariantes" },
    { text: "Aplicar tests metamórficos y de simetría" },
    { text: "Validar contratos de schema/calidad" },
    { text: "Detectar drift y reconciliar goldens" },
    { text: "Doblar HTTP/DB/reloj con control" },
    { text: "Escribir contract tests sin sobre-mocking" },
    { text: "Montar integración/E2E con containers (concepto)" },
    { text: "Eliminar flakes y fijar determinismo en CI" },
  ],
  theory: [
    {
      heading: "De LLM agents a QA de datos del motor ER (mapa CP-N3-A)",
      paragraphs: [
        "En V3, **S28 no es LangGraph en producción**. Aquí construyes la **suite de QA** del ER: propiedades, schema, goldens, dobles e integración determinista.",
        "Fixtures sintéticas mínimas deben cazar encoding, cardinalidad, orden, timeout y reanudación — antes de confiar en scores de matching.",
        "Orden: **T1 Propiedades** → **T2 Datos** → **T3 Dobles** → **T4 Sistema/CI**. ER solo decide misma entidad.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Legado de LLM agents **no es el path V3 en S28**. Target: property/data/integration tests para QA ER.",
      },
    },
    {
      heading: "invariantes y generación de casos",
      subtopicId: "S28-T1-A",
      paragraphs: [
        "Una **invariante** es una propiedad que siempre debe cumplirse: `normalize` es idempotente; scores en [0,1]; ids no vacíos.",
        "Genera casos desde la invariante (tabla, random acotado con seed, o hypothesis conceptual) en lugar de un único ejemplo feliz.",
        "Documenta la invariante en español junto al test; es el contrato del dominio ER.",
      ],
      code: {
        language: 'python',
        title: "invariants_gen.py",
        code: `import random
random.seed(42)

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

def gen_strings(n=20):
    alphabet = "ab cÁé  "
    out = []
    for _ in range(n):
        out.append("".join(random.choice(alphabet) for _ in range(random.randint(0, 12))))
    return out

# invariante: normalize es idempotente
bad = []
for s in gen_strings():
    once = normalize(s)
    twice = normalize(once)
    if once != twice:
        bad.append(s)
print("idempotent_ok", len(bad) == 0)
print("n_cases", 20)
print("seed", 42)`,
        output: `idempotent_ok True
n_cases 20
seed 42`,
      },
      callout: {
        type: "tip",
        title: "Seed fija",
        content:
          "Random sin seed en CI es flake. Fija seed o usa tabla exhaustiva pequeña.",
      },
    },
    {
      heading: "idempotencia, simetría y metamorphic tests",
      subtopicId: "S28-T1-B",
      paragraphs: [
        "**Idempotencia**: aplicar dos veces = una. **Simetría**: `sim(a,b)==sim(b,a)` en comparadores simétricos.",
        "**Metamorphic tests**: transforma el input de forma que la relación de salida sea predecible (p.ej. añadir espacios no cambia normalize).",
        "Útiles cuando no hay oráculo absoluto pero sí relación entre salidas.",
      ],
      code: {
        language: 'python',
        title: "metamorphic.py",
        code: `def sim_token(a: str, b: str) -> float:
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    if not ta and not tb:
        return 1.0
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)

pairs = [("Ana López", "López Ana"), ("x", "y"), ("", "")]
sym_ok = all(abs(sim_token(a, b) - sim_token(b, a)) < 1e-12 for a, b in pairs)
# metamorphic: padding spaces
meta_ok = all(
    " ".join(s.split()).casefold() == " ".join(("  " + s + " ").split()).casefold()
    for s in ["María", "  a  b"]
)
print("symmetric", sym_ok)
print("metamorphic_pad", meta_ok)
print("note", "sim!=fraud")`,
        output: `symmetric True
metamorphic_pad True
note sim!=fraud`,
      },
      callout: {
        type: "warning",
        title: "Simetría no siempre aplica",
        content:
          "Algunas distancias dirigidas no son simétricas; documenta la propiedad esperada.",
      },
    },
    {
      heading: "schema y quality contracts",
      subtopicId: "S28-T2-A",
      paragraphs: [
        "Un **schema contract** fija tipos, nullability y dominios (email con @, score 0..1). Un **quality contract** fija reglas de negocio (unique id, cardinalidad de pares).",
        "Valida en ingest del ER: registros fuente rechazados no entran silenciosos.",
        "Implementación didáctica: funciones validadoras que devuelven lista de errores.",
      ],
      code: {
        language: 'python',
        title: "schema_contract.py",
        code: `def validate_record(r: dict) -> list[str]:
    err = []
    if not isinstance(r.get("id"), str) or not r["id"]:
        err.append("id requerido")
    email = r.get("email")
    if email is not None and "@" not in str(email):
        err.append("email inválido")
    score = r.get("score")
    if score is not None and not (0 <= float(score) <= 1):
        err.append("score fuera de [0,1]")
    return err

rows = [
    {"id": "1", "email": "a@example.pe", "score": 0.2},
    {"id": "", "email": "x", "score": 1.5},
]
report = [(r.get("id"), validate_record(r)) for r in rows]
print("clean", report[0][1])
print("dirty_n", len(report[1][1]))
print("contract", "schema+quality")`,
        output: `clean []
dirty_n 3
contract schema+quality`,
      },
      callout: {
        type: "tip",
        title: "Falla ruidosa en ingest",
        content:
          "Mejor rechazar con error que contaminar el almacén ER (S29).",
      },
    },
    {
      heading: "golden datasets, drift y reconciliación",
      subtopicId: "S28-T2-B",
      paragraphs: [
        "Un **golden** es un snapshot de salida esperada (JSON/CSV sintético versionado). Sirve de regresión de pipeline.",
        "**Drift**: la salida actual difiere del golden. Clasifica: bug real vs cambio intencional.",
        "**Reconciliación**: actualizar golden solo con review y nota de cambio — nunca en silencio en CI.",
      ],
      code: {
        language: 'python',
        title: "golden_drift.py",
        code: `import json
golden = {"pairs": [{"a": "c1", "b": "c2", "label": 1}], "version": 1}
current = {"pairs": [{"a": "c1", "b": "c2", "label": 1}], "version": 1}
drift = golden != current
# simula cambio de label
current2 = json.loads(json.dumps(current))
current2["pairs"][0]["label"] = 0
drift2 = golden != current2

def reconcile(old, new, approved=False):
    if old == new:
        return "unchanged"
    return "updated" if approved else "blocked_drift"

print("drift_clean", drift)
print("drift_label", drift2)
print("reconcile", reconcile(golden, current2, approved=False))`,
        output: `drift_clean False
drift_label True
reconcile blocked_drift`,
      },
      callout: {
        type: "danger",
        title: "No auto-accept drift",
        content:
          "Actualizar golden sin review esconde regresiones de matching.",
      },
    },
    {
      heading: "mocks/fakes de HTTP, DB y reloj",
      subtopicId: "S28-T3-A",
      paragraphs: [
        "**Mock**: verifica interacciones. **Fake**: implementación liviana en memoria. **Stub**: respuestas fijas.",
        "HTTP: fake de status/JSON. DB: dict o sqlite memoria. Reloj: inyecta `now` callable — no `datetime.now` global sin control.",
        "Objetivo: tests rápidos y deterministas del ER sin red real.",
      ],
      code: {
        language: 'python',
        title: "fakes_clock.py",
        code: `from datetime import datetime, timezone

class FakeClock:
    def __init__(self, fixed):
        self.fixed = fixed
    def now(self):
        return self.fixed

class FakeHTTP:
    def __init__(self, body, status=200):
        self.body, self.status = body, status
    def get_json(self, url):
        return {"status": self.status, "url": url, "data": self.body}

clock = FakeClock(datetime(2026, 7, 20, tzinfo=timezone.utc))
http = FakeHTTP({"entities": 2})
print("now", clock.now().date().isoformat())
print("http", http.get_json("https://example.pe/er")["data"]["entities"])
print("db_fake", {"c1": {"name": "Ana"}}.get("c1")["name"])`,
        output: `now 2026-07-20
http 2
db_fake Ana`,
      },
      callout: {
        type: "tip",
        title: "Inyecta dependencias",
        content:
          "Pasa clock/http al constructor; no parches globales salvo legado.",
      },
    },
    {
      heading: "contract tests sin sobre-mocking",
      subtopicId: "S28-T3-B",
      paragraphs: [
        "El **sobre-mocking** acopla el test a detalles internos (orden de calls, nombres privados) y se rompe en refactors inocuos.",
        "Prefiere **contratos de borde**: dado input, output y efectos observables (filas escritas, status).",
        "Mockea solo I/O externo; deja la lógica de matching real bajo prueba.",
      ],
      code: {
        language: 'python',
        title: "no_overmock.py",
        code: `def match_service(normalize, a, b):
    # lógica real bajo prueba
    return normalize(a) == normalize(b)

def normalize(s):
    return " ".join(s.casefold().split())

# contrato de borde — no mockeamos normalize si es barato y puro
print("contract", match_service(normalize, "Ana", " ana "))
# sobre-mocking malo (ilustrativo): forzar True sin lógica
overmock = lambda a, b: True
print("overmock_hides_bug", overmock("x", "y"))
print("prefer", "real_pure_logic")`,
        output: `contract True
overmock_hides_bug True
prefer real_pure_logic`,
      },
      callout: {
        type: "warning",
        title: "Mockear de más",
        content:
          "Si mockeas el comparador y solo asertas que se llamó, no pruebas matching.",
      },
    },
    {
      heading: "integración/E2E y test containers",
      subtopicId: "S28-T4-A",
      paragraphs: [
        "Integración ejerce 2+ componentes reales (app + sqlite). E2E cubre flujo de punta a punta (ingest→pares→review) con datos sintéticos.",
        "**Testcontainers** (concepto): DB efímera en contenedor. En el curso usamos sqlite `:memory:` o archivo temp como análogo local.",
        "Mide encoding, cardinalidad de pares, orden de paginación, timeout y reanudación (checkpoint).",
      ],
      code: {
        language: 'python',
        title: "integration_sqlite.py",
        code: `import sqlite3

def run_integration():
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE entities(id TEXT PRIMARY KEY, name TEXT)")
    con.executemany("INSERT INTO entities VALUES (?,?)", [("e1", "Ana"), ("e2", "Ana")])
    n = con.execute("SELECT COUNT(*) FROM entities").fetchone()[0]
    # candidate pairs naive
    pairs = con.execute(
        "SELECT a.id, b.id FROM entities a JOIN entities b ON a.id < b.id AND a.name = b.name"
    ).fetchall()
    con.close()
    return n, pairs

n, pairs = run_integration()
print("entities", n)
print("pairs", pairs)
print("encoding_ok", True)`,
        output: `entities 2
pairs [('e1', 'e2')]
encoding_ok True`,
      },
      callout: {
        type: "info",
        title: "Containers vs memoria",
        content:
          "sqlite memoria valida lógica; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29).",
      },
    },
    {
      heading: "flakes, determinismo y CI",
      subtopicId: "S28-T4-B",
      paragraphs: [
        "Un **flake** pasa/falla sin cambio de código: orden, tiempo, red, random. En CI del ER son inaceptables en la suite gate.",
        "Mitigaciones: seed, reloj inyectado, sort estable, retries solo con cuarentena documentada (no ocultar bugs).",
        "Pipeline CI: lint → unit → property/data → integration. Falla el job si hay drift de golden no aprobado.",
      ],
      code: {
        language: 'python',
        title: "determinism_ci.py",
        code: `import random
from datetime import datetime, timezone

def flaky_bad():
    # anti-patrón: random y reloj sin control
    return random.random() > 0.0 and datetime.now().microsecond >= 0

def stable(seed=0, now=None):
    random.seed(seed)
    now = now or datetime(2026, 7, 20, tzinfo=timezone.utc)
    items = ["b", "a", "c"]
    return sorted(items), now.isoformat(), round(random.random(), 4)

print("stable", stable(7)[0])
print("seeded_r", stable(7)[2])
print("ci_policy", "no_flakes_on_gate")`,
        output: `stable ['a', 'b', 'c']
seeded_r 0.3238
ci_policy no_flakes_on_gate`,
      },
      callout: {
        type: "danger",
        title: "Retry no es fix",
        content:
          "Reintentar un test flaky en CI sin root-cause solo enmascara el problema.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro invariantes, metamorphic tests, contratos de schema/golden, fakes y CI determinista para el QA del motor ER.",
    steps: [
      {
        demoId: "S28-T1-A-DEMO",
        subtopicId: "S28-T1-A",
        environment: "local-python",
        description: "Genera 15 strings con seed y verifica invariante de longitud de normalize ≥ 0.",
        code: {
          language: 'python',
          title: "inv_demo.py",
          code: `import random
random.seed(1)
def norm(s):
    return " ".join(s.casefold().split())
ok = all(len(norm("".join(random.choice("a b") for _ in range(8)))) >= 0 for _ in range(15))
print("invariant_ok", ok)
print("n", 15)`,
          output: `invariant_ok True
n 15`,
        },
        why: "Casos generados refuerzan invariantes.",
      },
      {
        demoId: "S28-T1-B-DEMO",
        subtopicId: "S28-T1-B",
        environment: "local-python",
        description: "Comprueba simetría de Jaccard de tokens y metamorphic padding.",
        code: {
          language: 'python',
          title: "meta_demo.py",
          code: `def j(a,b):
    ta,tb=set(a.lower().split()),set(b.lower().split())
    return len(ta&tb)/len(ta|tb) if ta|tb else 1.0
print("sym", j("a b","b a")==j("b a","a b"))
print("meta", "x y" == " ".join("  x   y ".split()))
print("idemp", "a" == " ".join("a".split()))`,
          output: `sym True
meta True
idemp True`,
        },
        why: "Propiedades sin oráculo absoluto aún fallan con bugs.",
      },
      {
        demoId: "S28-T2-A-DEMO",
        subtopicId: "S28-T2-A",
        environment: "local-python",
        description: "Valida schema de tres registros sintéticos y cuenta errores.",
        code: {
          language: 'python',
          title: "schema_demo.py",
          code: `def val(r):
    e=[]
    if not r.get("id"): e.append("id")
    if r.get("score") is not None and not 0<=r["score"]<=1: e.append("score")
    return e
rows=[{"id":"1","score":0.2},{"id":"","score":2},{"id":"3","score":0.5}]
print("errors", sum(len(val(r)) for r in rows))
print("ok_first", val(rows[0])==[])`,
          output: `errors 2
ok_first True`,
        },
        why: "Contratos de calidad en ingest del ER.",
      },
      {
        demoId: "S28-T2-B-DEMO",
        subtopicId: "S28-T2-B",
        environment: "local-python",
        description: "Detecta drift de golden de pares y bloquea reconcile sin aprobación.",
        code: {
          language: 'python',
          title: "drift_demo.py",
          code: `golden={"n":2}
cur={"n":3}
print("drift", golden!=cur)
print("action", "blocked" if golden!=cur else "ok")
print("version", 1)`,
          output: `drift True
action blocked
version 1`,
        },
        why: "Drift visible > golden silencioso.",
      },
      {
        demoId: "S28-T3-A-DEMO",
        subtopicId: "S28-T3-A",
        environment: "local-python",
        description: "Fake HTTP + reloj fijo devuelven JSON y timestamp deterministas.",
        code: {
          language: 'python',
          title: "fake_demo.py",
          code: `from datetime import datetime, timezone
class H:
    def get(self):
        return {"status":200,"body":{"ok":True}}
class C:
    def now(self):
        return datetime(2026,1,1,tzinfo=timezone.utc)
print(H().get()["body"]["ok"], C().now().date().isoformat())`,
          output: `True 2026-01-01`,
        },
        why: "Dobles controlados eliminan red y tiempo real.",
      },
      {
        demoId: "S28-T3-B-DEMO",
        subtopicId: "S28-T3-B",
        environment: "local-python",
        description: "Contrato de borde sobre match real vs overmock que oculta bug.",
        code: {
          language: 'python',
          title: "contract_demo.py",
          code: `def real(a,b):
    return a.casefold()==b.casefold()
over=lambda a,b: True
print("real", real("A","a"))
print("overmock_false_pos", over("A","z"))
print("prefer_real", True)`,
          output: `real True
overmock_false_pos True
prefer_real True`,
        },
        why: "No mockees la lógica que quieres probar.",
      },
      {
        demoId: "S28-T4-A-DEMO",
        subtopicId: "S28-T4-A",
        environment: "local-python",
        description: "Integración sqlite: inserta entidades y cuenta pares por nombre igual.",
        code: {
          language: 'python',
          title: "integ_demo.py",
          code: `import sqlite3
c=sqlite3.connect(":memory:")
c.execute("create table e(id text, name text)")
c.executemany("insert into e values (?,?)",[("1","Ana"),("2","Ana"),("3","Bob")])
pairs=c.execute("select a.id,b.id from e a join e b on a.id<b.id and a.name=b.name").fetchall()
print("pairs", pairs)
print("n", len(pairs))`,
          output: `pairs [('1', '2')]
n 1`,
        },
        why: "Integración mínima del pipeline de candidatos.",
      },
      {
        demoId: "S28-T4-B-DEMO",
        subtopicId: "S28-T4-B",
        environment: "local-python",
        description: "Orden estable + seed: dos corridas CI producen la misma lista.",
        code: {
          language: 'python',
          title: "ci_demo.py",
          code: `import random
def run(seed):
    random.seed(seed)
    return sorted(["c","a","b"]), round(random.random(),5)
print(run(3)==run(3))
print(run(3)[0])`,
          output: `True
['a', 'b', 'c']`,
        },
        why: "Determinismo es requisito del gate de suite.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de propiedades, datos, dobles e integración/CI.",
    steps: [
      {
        id: "S28-T1-A-E1",
        subtopicId: "S28-T1-A",
        kind: "guided",
        instruction:
          "Con seed=0, genera un random.random() y verifícalo reproducible en segunda llamada con misma seed (imprime ambos iguales como True).",
        hint: "seed antes de cada random",
        hints: [
          "seed antes de cada random",
          "compara",
        ],
        edgeCases: ["sin seed no es CI-safe"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import random
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import random
random.seed(0); a=random.random()
random.seed(0); b=random.random()
print(a == b)`,
          output: `True`,
        },
      },
      {
        id: "S28-T1-A-E2",
        subtopicId: "S28-T1-A",
        kind: "independent",
        instruction:
          "Invariante: score en [0,1]. Imprime True para scores [0, 0.5, 1].",
        hint: "all",
        hints: [
          "all",
          "rango",
        ],
        edgeCases: ["NaN no es válido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `scores=[0,0.5,1]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `scores=[0,0.5,1]
print(all(0 <= s <= 1 for s in scores))`,
          output: `True`,
        },
      },
      {
        id: "S28-T1-A-E3",
        subtopicId: "S28-T1-A",
        kind: "transfer",
        instruction:
          "Idempotencia de strip: f(f(s))==f(s) para s='  x '.",
        hint: "doble aplicación",
        hints: [
          "doble aplicación",
          "assert blando print",
        ],
        edgeCases: ["normalize más rico"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `s='  x '
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s='  x '
f=lambda x: x.strip()
print(f(f(s)) == f(s))`,
          output: `True`,
        },
      },
      {
        id: "S28-T1-B-E1",
        subtopicId: "S28-T1-B",
        kind: "guided",
        instruction:
          "Simetría de igualdad: imprime (a==b)==(b==a) para a='x' b='x'.",
        hint: "comparar",
        hints: [
          "comparar",
          "simetría",
        ],
        edgeCases: ["distancias asimétricas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='x','x'
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='x','x'
print((a == b) == (b == a))`,
          output: `True`,
        },
      },
      {
        id: "S28-T1-B-E2",
        subtopicId: "S28-T1-B",
        kind: "independent",
        instruction:
          "Metamorphic: upper no debe cambiar casefold equality entre 'Ana' y 'ANA'.",
        hint: "casefold",
        hints: [
          "casefold",
          "True",
        ],
        edgeCases: ["locale edge"],
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
          code: `print('Ana'.casefold() == 'ANA'.casefold())`,
          output: `True`,
        },
      },
      {
        id: "S28-T1-B-E3",
        subtopicId: "S28-T1-B",
        kind: "transfer",
        instruction:
          "Imprime True si sim(a,b) conceptual (a==b) es idempotente en reorden de args.",
        hint: "swap",
        hints: [
          "swap",
          "propiedad",
        ],
        edgeCases: ["documenta propiedad"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b=1,1
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b=1,1
print((a == b) == (b == a))`,
          output: `True`,
        },
      },
      {
        id: "S28-T2-A-E1",
        subtopicId: "S28-T2-A",
        kind: "guided",
        instruction:
          "Si falta id en dict, imprime 'id requerido'.",
        hint: "get",
        hints: [
          "get",
          "guard",
        ],
        edgeCases: ["id vacío"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `r={}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `r={}
print('id requerido' if not r.get('id') else 'ok')`,
          output: `id requerido`,
        },
      },
      {
        id: "S28-T2-A-E2",
        subtopicId: "S28-T2-A",
        kind: "independent",
        instruction:
          "score=1.2 fuera de rango → imprime 'score'.",
        hint: "0<=s<=1",
        hints: [
          "0<=s<=1",
          "etiqueta error",
        ],
        edgeCases: ["inclusive bounds"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `score=1.2
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `score=1.2
print('score' if not (0 <= score <= 1) else 'ok')`,
          output: `score`,
        },
      },
      {
        id: "S28-T2-A-E3",
        subtopicId: "S28-T2-A",
        kind: "transfer",
        instruction:
          "Cuenta cuántos de 2 registros fallan validación simple de id no vacío.",
        hint: "sum",
        hints: [
          "sum",
          "lista",
        ],
        edgeCases: ["quality contract"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[{'id':'1'},{'id':''}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[{'id':'1'},{'id':''}]
print(sum(1 for r in rows if not r.get('id')))`,
          output: `1`,
        },
      },
      {
        id: "S28-T2-B-E1",
        subtopicId: "S28-T2-B",
        kind: "guided",
        instruction:
          "Imprime 'drift' si golden!=current.",
        hint: "!=",
        hints: [
          "!=",
          "strings/dicts",
        ],
        edgeCases: ["deep compare json"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `golden,current={'n':1},{'n':2}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `golden,current={'n':1},{'n':2}
print('drift' if golden != current else 'ok')`,
          output: `drift`,
        },
      },
      {
        id: "S28-T2-B-E2",
        subtopicId: "S28-T2-B",
        kind: "independent",
        instruction:
          "Reconcile bloqueado: approved=False y hay diff → 'blocked'.",
        hint: "and",
        hints: [
          "and",
          "política",
        ],
        edgeCases: ["review humana"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `diff, approved = True, False
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `diff, approved = True, False
print('blocked' if diff and not approved else 'ok')`,
          output: `blocked`,
        },
      },
      {
        id: "S28-T2-B-E3",
        subtopicId: "S28-T2-B",
        kind: "transfer",
        instruction:
          "Imprime version del golden = 3.",
        hint: "literal/dict",
        hints: [
          "literal/dict",
          "versionado",
        ],
        edgeCases: ["changelog"],
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
          code: `print({'golden_version': 3}['golden_version'])`,
          output: `3`,
        },
      },
      {
        id: "S28-T3-A-E1",
        subtopicId: "S28-T3-A",
        kind: "guided",
        instruction:
          "Fake DB dict: get 'e1' name 'Ana' e imprime.",
        hint: "dict get",
        hints: [
          "dict get",
          "fake",
        ],
        edgeCases: ["missing key"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `db={'e1':{'name':'Ana'}}
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `db={'e1':{'name':'Ana'}}
print(db['e1']['name'])`,
          output: `Ana`,
        },
      },
      {
        id: "S28-T3-A-E2",
        subtopicId: "S28-T3-A",
        kind: "independent",
        instruction:
          "Fake clock devuelve fecha 2026-07-20; imprime iso date.",
        hint: "datetime",
        hints: [
          "datetime",
          "inyección",
        ],
        edgeCases: ["timezone aware en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import date
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import date
print(date(2026, 7, 20).isoformat())`,
          output: `2026-07-20`,
        },
      },
      {
        id: "S28-T3-A-E3",
        subtopicId: "S28-T3-A",
        kind: "transfer",
        instruction:
          "Fake HTTP status 503 → imprime 'retry'.",
        hint: "status",
        hints: [
          "status",
          "rama",
        ],
        edgeCases: ["timeouts"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `status=503
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `status=503
print('retry' if status >= 500 else 'ok')`,
          output: `retry`,
        },
      },
      {
        id: "S28-T3-B-E1",
        subtopicId: "S28-T3-B",
        kind: "guided",
        instruction:
          "Contrato: match real 'A'/'a' → True.",
        hint: "casefold",
        hints: [
          "casefold",
          "sin mock",
        ],
        edgeCases: ["no overmock"],
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
          code: `print('A'.casefold() == 'a'.casefold())`,
          output: `True`,
        },
      },
      {
        id: "S28-T3-B-E2",
        subtopicId: "S28-T3-B",
        kind: "independent",
        instruction:
          "Detecta overmock: si función siempre True, imprime 'weak'.",
        hint: "propiedad",
        hints: [
          "propiedad",
          "siempre True",
        ],
        edgeCases: ["tests de borde"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `f=lambda a,b: True
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `f=lambda a,b: True
print('weak' if f('x','y') and f('1','2') else 'ok')`,
          output: `weak`,
        },
      },
      {
        id: "S28-T3-B-E3",
        subtopicId: "S28-T3-B",
        kind: "transfer",
        instruction:
          "Imprime efecto observable: rows_written=1.",
        hint: "dict",
        hints: [
          "dict",
          "borde",
        ],
        edgeCases: ["no asserts de call order"],
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
          code: `print({'rows_written': 1}['rows_written'])`,
          output: `1`,
        },
      },
      {
        id: "S28-T4-A-E1",
        subtopicId: "S28-T4-A",
        kind: "guided",
        instruction:
          "sqlite memoria: CREATE e INSERT un row; COUNT(*).",
        hint: "sqlite3",
        hints: [
          "sqlite3",
          "fetchone",
        ],
        edgeCases: [":memory: se pierde al close"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table t(x int)')
c.execute('insert into t values (1)')
print(c.execute('select count(*) from t').fetchone()[0])`,
          output: `1`,
        },
      },
      {
        id: "S28-T4-A-E2",
        subtopicId: "S28-T4-A",
        kind: "independent",
        instruction:
          "Cardinalidad de pares C(n,2) para n=4 → 6.",
        hint: "n*(n-1)//2",
        hints: [
          "n*(n-1)//2",
          "candidatos",
        ],
        edgeCases: ["blocking reduce pares"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `n=4
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `n=4
print(n * (n - 1) // 2)`,
          output: `6`,
        },
      },
      {
        id: "S28-T4-A-E3",
        subtopicId: "S28-T4-A",
        kind: "transfer",
        instruction:
          "Checkpoint: ids hechos {'a'}; items a,b → pendientes ['b'].",
        hint: "list comp",
        hints: [
          "list comp",
          "reanudación",
        ],
        edgeCases: ["timeout + resume"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `done, items={'a'}, ['a','b']
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `done, items={'a'}, ['a','b']
print([i for i in items if i not in done])`,
          output: `['b']`,
        },
      },
      {
        id: "S28-T4-B-E1",
        subtopicId: "S28-T4-B",
        kind: "guided",
        instruction:
          "sorted(['b','a']) debe ser estable; imprime resultado.",
        hint: "sorted",
        hints: [
          "sorted",
          "orden",
        ],
        edgeCases: ["set order no es estable"],
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
          code: `print(sorted(['b', 'a']))`,
          output: `['a', 'b']`,
        },
      },
      {
        id: "S28-T4-B-E2",
        subtopicId: "S28-T4-B",
        kind: "independent",
        instruction:
          "Política CI: imprime 'fail_job' si flake_rate>0.",
        hint: "umbral",
        hints: [
          "umbral",
          "gate",
        ],
        edgeCases: ["cuarentena documentada"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `flake_rate=0.01
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `flake_rate=0.01
print('fail_job' if flake_rate > 0 else 'ok')`,
          output: `fail_job`,
        },
      },
      {
        id: "S28-T4-B-E3",
        subtopicId: "S28-T4-B",
        kind: "transfer",
        instruction:
          "Imprime pipeline CI: unit→data→integration.",
        hint: "string",
        hints: [
          "string",
          "orden",
        ],
        edgeCases: ["lint primero opcional"],
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
          code: `print('unit→data→integration')`,
          output: `unit→data→integration`,
        },
      },
    ],
  },
  youDo: {
    title: "Suite QA del motor ER — propiedades, goldens e integración",
    context:
      "Entrega una suite sintética que cace encoding, cardinalidad, orden, timeout/reanudación y drift de golden para el pipeline ER de CP-N3-A. Usa fixtures mínimas, fakes de reloj/HTTP y sqlite memoria. Sin PII real; matching ≠ fraude. No editar seed/checkpoint/ledger.",
    objectives: [
      "Invariantes + generación con seed",
      "Metamorphic/simetría de comparadores",
      "Schema/quality contracts y golden con reconcile bloqueado",
      "Integración sqlite de candidatos + CI determinista",
    ],
    requirements: [
      "Fixtures sintéticas mínimas",
      "UNVERIFIED flakes = 0 en la suite gate",
      "Documentación es-PE",
      "Alineación QA ER (CP-N3-A)",
    ],
    starterCode: `# QA ER — esqueleto S28
import random
random.seed(0)

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

# TODO: property tests, schema validate, golden diff, sqlite pairs, stable sort
if __name__ == "__main__":
    assert normalize(normalize(" A ")) == normalize(" A ")
    print("qa_starter_ok")
`,
    portfolioNote:
      "Suite de QA para CP-N3-A: propiedades, contratos de datos e integración determinista. Otra lane califica; no marcar passed aquí.",
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
        question: "Un test metamórfico verifica:",
        options: [
          "Solo un número mágico",
          "Relaciones predecibles entre entradas transformadas y salidas",
          "Que la red esté caída",
          "Fraude",
        ],
        correctIndex: 1,
        explanation:
          "Relaciona salidas bajo transformaciones conocidas.",
      },
      {
        question: "Actualizar un golden con drift sin review es:",
        options: [
          "Buena práctica",
          "Riesgo de ocultar regresiones",
          "Obligatorio en CI",
          "Irrelevante",
        ],
        correctIndex: 1,
        explanation:
          "Reconcile debe ser aprobado.",
      },
      {
        question: "Sobre-mocking típico:",
        options: [
          "Probar lógica pura real",
          "Acoplar el test a detalles internos y ocultar bugs",
          "Usar sqlite memoria",
          "Fijar seed",
        ],
        correctIndex: 1,
        explanation:
          "Mockea I/O, no el corazón del matching.",
      },
      {
        question: "Flakes en la suite gate de ER se manejan:",
        options: [
          "Ignorándolos",
          "Con determinismo (seed/reloj/sort) y fallo de job si persisten",
          "Subiendo retries a 100",
          "Borrando tests",
        ],
        correctIndex: 1,
        explanation:
          "CI determinista es parte del outcome de S28.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Hypothesis (property testing)",
        url: "https://hypothesis.readthedocs.io/",
        note: "Generación de casos",
      },
      {
        label: "sqlite3 Python",
        url: "https://docs.python.org/3/library/sqlite3.html",
        note: "Integración local",
      },
    ],
    books: [
      {
        label: "Growing Object-Oriented Software, Guided by Tests",
        note: "Contratos y dobles",
      },
      {
        label: "Data Quality Fundamentals",
        note: "Schema y drift conceptual",
      },
    ],
    courses: [
      {
        label: "pytest fixtures & parametrize",
        url: "https://docs.pytest.org/en/stable/how-to/fixtures.html",
        note: "Aislamiento",
      },
    ],
  },
}
