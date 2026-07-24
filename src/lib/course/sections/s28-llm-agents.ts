import type { CourseSection } from '../../types'

export const section28: CourseSection = {
  id: "llm-agents",
  index: 28,
  title: "Pruebas de datos, propiedades e integración",
  shortTitle: "Props e integración",
  tagline:
    "Suite que caza errores de encoding, cardinalidad, orden, timeout y reanudación, con fixtures sintéticas mínimas",
  estimatedHours: 19,
  level: "Competente",
  phase: 2,
  icon: "ShieldCheck",
  accentColor: "bg-gradient-to-br from-emerald-500 to-teal-700",
  jobRelevance:
    "El **QA del motor de entity resolution (ER)** exige más que tests unitarios felices: propiedades que generen bordes, contratos de schema, goldens con review humano, dobles de HTTP/DB/reloj e integración determinista en CI. En un desk de datos en Lima (banca, fintech o retail), un flake o un golden actualizado en silencio puede dejar pasar un matching roto hasta producción de revisión. Esta sección te arma la capa de propiedades + datos + dobles + integración que protege el pipeline sintético CP-N3-A.",
  learningOutcomes: [
    { text: "Generar casos desde invariantes con seed o tabla exhaustiva" },
    { text: "Aplicar pruebas metamórficas, de simetría e idempotencia" },
    { text: "Validar contratos de schema y de calidad en ingest" },
    { text: "Detectar drift de golden y reconciliar solo con approve" },
    { text: "Doblar HTTP, DB y reloj con fakes controlados" },
    { text: "Escribir contract tests de borde sin sobre-mocking" },
    { text: "Montar integración sqlite (análogo local a testcontainers)" },
    { text: "Eliminar flakes y fijar determinismo (seed, sort, reloj) en CI" },
  ],
  theory: [
    {
      heading: "QA de datos del motor ER",
      paragraphs: [
        "En S27 convertiste normalización y matching en contratos **pytest**. Aquí **amplías la suite**: propiedades y pruebas metamórficas, contratos de datos/goldens, dobles controlados e integración sin flakes. En S29 el almacén SQL consumirá estos mismos contratos como regresión de schema.",
        "Orden del módulo: **T1 Propiedades** (invariantes, generación, metamórficas) → **T2 Datos** (schema, quality, goldens) → **T3 Dobles** (mocks/fakes/reloj, contratos de borde) → **T4 Sistema/CI** (integración, encoding/cardinalidad/orden/timeout/reanudación, flakes). Fixture de laboratorio: `CASO-LIM-028` (run_id=cpn3a-dataqa), contactos sintéticos `@example.pe` — sin PII real y sin auto-veredicto de fraude o parentesco.",
        "Lo que ya sabes (S16 calidad + S27 pytest) y lo que es **nuevo aquí**: S16 fallaba cerrado ante schema roto; S27 fijó AAA, fixtures y oráculos. S28 añade **generación desde propiedades**, **goldens versionados con review**, **dobles en bordes HTTP/DB/reloj** e **integración multi-componente determinista**. ER solo decide *misma entidad* — nunca parentesco ni fraude.",
        "Caso de desk PE: un batch sintético de contactos entra al matcher en CI local. Un fallo de golden muestra expected vs actual; un fallo de propiedad imprime la semilla y el input que rompió la invariante. Eso es evidencia revisable, no un “True” mágico en pantalla.",
      ],
      callout: {
        type: "info",
        title: "Límite del resultado",
        content:
          "Las pruebas verifican identidad de registros y calidad técnica; no autorizan inferencias de relación o riesgo. Matching ≠ fraude.",
      },
    },
    {
      heading: "Invariantes y generación de casos",
      subtopicId: "S28-T1-A",
      paragraphs: [
        "Una **invariante** es una propiedad que **siempre** debe cumplirse en el dominio ER: `normalize` es **idempotente** (`f(f(x)) == f(x)`); scores en **[0, 1]**; ids no vacíos; pares canónicos `entity_a < entity_b`. Si se rompe, el matching deja de ser un contrato y se vuelve intuición.",
        "Genera casos **desde la invariante**, no desde un ejemplo feliz. Tres estrategias en este curso: (1) tabla exhaustiva pequeña (todos los bordes conocidos), (2) random acotado con **seed fija** (reproducible en CI), (3) Hypothesis (herramienta industrial de property-based testing — la enlazamos en recursos; aquí practicas el *pensamiento* de propiedad con seed + bucles o pytest). Un solo case “Ana López” no caza encoding, espacios dobles ni scores fuera de rango.",
        "Documenta la invariante en **español** junto al test (`# invariante: normalize es idempotente`): es el contrato legible del dominio y el oráculo del revisor. Sin enunciado, el assert es magia negra. Cuando falla un caso generado, imprime **seed + input + expected/actual** para que el bug sea reproducido al primer intento.",
      ],
      code: {
        language: "python",
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
        title: "Semilla fija",
        content:
          "Random sin seed en CI es flake. Fija seed o usa tabla exhaustiva pequeña. Hypothesis haría shrink del contraejemplo; con seed, imprime tú el input que falló.",
      },
    },
    {
      heading: "Idempotencia, simetría y pruebas metamórficas",
      subtopicId: "S28-T1-B",
      paragraphs: [
        "**Idempotencia**: `f(f(x)) == f(x)`. En ER, `normalize` debe ser idempotente: un segundo pase no cambia el texto canónico. Si `f(f(x)) != f(x)`, cada etapa del pipeline “reescribe” el nombre y el matching se vuelve no determinista entre corridas.",
        "**Simetría**: si el comparador es simétrico, `sim(a,b) == sim(b,a)`. Documenta excepciones (distancias dirigidas, embeddings con orden de query) en el nombre del test. No asumas simetría solo porque “se ve simétrico” en el happy path.",
        "**Pruebas metamórficas (metamorphic)**: no conoces el score “correcto” absoluto, pero sí una **relación** entre salidas. Ejemplo: rellenar espacios no debe cambiar `normalize`; reordenar tokens puede o no ser invariante según tu modelo de nombre. Cuando no hay oráculo absoluto, la relación entre salidas *es* el oráculo. No confundas metamórfica con “casefold equality”: casefold es normalización; metamórfica es *transformar el input y predecir cómo se mueve la salida*.",
      ],
      code: {
        language: "python",
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
# metamórfica: padding de espacios no cambia normalize
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
          "Algunas distancias dirigidas no son simétricas; documenta la propiedad esperada en el nombre del test (`test_jaccard_is_symmetric` vs `test_edit_distance_directed`).",
      },
    },
    {
      heading: "Contratos de schema y de calidad",
      subtopicId: "S28-T2-A",
      paragraphs: [
        "Un **contrato de schema** fija tipos, nullability y dominios (email con `@`, score en 0..1). Un **contrato de calidad** fija reglas de negocio (id único, cardinalidad de pares, encoding UTF-8 legible). En S16 ya viste fail-closed en ingest; aquí los conviertes en **asserts de regresión** que bloquean el merge si se rompen.",
        "Valida en el borde de ingest del ER: registros fuente rechazados no entran silenciosos. La implementación didáctica es una función `validate_record(r) -> list[str]` que devuelve errores legibles — no un booleano opaco. Fail-closed: si faltan columnas requeridas o el dtype rompe el contrato, el batch se detiene con reporte, no se “arregla” en silencio.",
        "Diferencia con S16: allí diseñaste políticas; aquí **escribes la suite** que las re-ejecuta en cada PR. Caso sintético: batch `@example.pe` con un id vacío y un score 1.5 — el validador debe listar ambos errores sin inventar parentesco ni fraude.",
      ],
      code: {
        language: "python",
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
          "Mejor rechazar con error que contaminar el almacén ER (S29). Cuando construyas S29, re-ejecuta estos mismos validadores como regresión de schema del warehouse.",
      },
    },
    {
      heading: "Datasets golden, drift y reconciliación",
      subtopicId: "S28-T2-B",
      paragraphs: [
        "Un **golden** es un snapshot versionado de salida esperada (JSON/CSV sintético en el repo). Sirve de regresión del pipeline: mismos inputs sintéticos → misma estructura de pares (o de reporte de calidad). No es “la verdad del mundo real”; es el contrato de no-regresión del lab.",
        "**Drift**: la salida actual difiere del golden. Clasifica antes de actuar: (a) bug real del matcher, (b) cambio intencional de política, (c) ruido de orden/float. Un diff de golden debe mostrar expected vs actual de forma legible — nunca un “pass” silencioso.",
        "**Reconciliación**: actualizar el golden solo con **review humano y nota de cambio** (`approved=True` + mensaje). Actualizar golden sin approve en CI esconde regresiones de matching. Política: `blocked_drift` hasta que alguien firme el cambio de contrato.",
      ],
      code: {
        language: "python",
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
        title: "No aceptar drift automáticamente",
        content:
          "Actualizar golden sin review esconde regresiones de matching. En desk PE: el PR que toca un golden debe explicar *por qué* cambió el contrato.",
      },
    },
    {
      heading: "Mocks, fakes y reloj inyectado",
      subtopicId: "S28-T3-A",
      paragraphs: [
        "**Mock**: verifica interacciones (qué se llamó, con qué args). **Fake**: implementación liviana en memoria con estado real. **Stub**: respuestas fijas sin lógica. En QA del ER usas fakes de HTTP/DB y un reloj inyectable para que la suite no dependa de red ni de `datetime.now()`.",
        "HTTP: fake de status/JSON. DB: `dict` o sqlite en memoria. Reloj: inyecta `now` callable en el constructor — no parches globales salvo código legado. Objetivo: tests **rápidos y deterministas** del pipeline sin red real ni timestamps que cambian entre corridas.",
        "Patrón de diseño: el servicio de matching recibe `clock` y `http` como dependencias. En producción son el reloj del sistema y un cliente real; en test son `FakeClock` y `FakeHTTP`. Así demuestras encoding de fechas ISO, reintentos ante 503 y lectura de entidades sin abrir sockets.",
      ],
      code: {
        language: "python",
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
          "Pasa clock/http al constructor; no parches globales salvo legado. `str(datetime(...))` no es fecha ISO corta — usa `.date().isoformat()` o `.isoformat()` según el contrato.",
      },
    },
    {
      heading: "Contratos de borde sin sobre-mocking",
      subtopicId: "S28-T3-B",
      paragraphs: [
        "El **sobre-mocking** acopla el test a detalles internos (orden exacto de calls, nombres privados) y se rompe en refactors inocuos. Peor: si mockeas el comparador y solo asertas que “se llamó”, no pruebas matching — ocultas bugs con un `lambda: True`.",
        "Prefiere **contratos de borde**: dado input, observa output y efectos visibles (filas escritas, status HTTP, schema del payload). Mockea solo I/O externo; deja la lógica de normalización/matching real bajo prueba cuando es pura y barata.",
        "Heurística GOOS-friendly: si la función es pura (`normalize`, Jaccard de tokens), **no la mockees**. Si habla con red o disco, fakea el borde y aserta el efecto. `casefold` (no solo `lower` en un lado) es el contrato de igualdad de texto del ER para Unicode.",
      ],
      code: {
        language: "python",
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
          "Si mockeas el comparador y solo asertas que se llamó, no pruebas matching. Detecta overmock: si `f('x','y') and f('1','2')` es siempre True, el doble es débil.",
      },
    },
    {
      heading: "Integración, E2E y testcontainers (concepto)",
      subtopicId: "S28-T4-A",
      paragraphs: [
        "Una prueba de **integración** ejerce **2+ componentes reales** (app + sqlite, o servicio + fake HTTP + DB). **E2E** cubre el flujo punta a punta (`ingest → pares → review`) con datos sintéticos. **Testcontainers** (concepto de CI): DB efímera en contenedor con el mismo dialecto que producción; en este curso usamos sqlite `:memory:` o archivo temp como análogo local honesto.",
        "Mide lo que el tagline promete: **encoding** (tildes y formas NFC/NFD unificadas con `unicodedata.normalize`), **cardinalidad** de pares (`C(n,2)` o igualdad de nombre), **orden** de paginación estable, **timeout** simulado (retry/abort con reloj fake, no `sleep` real) y **reanudación** (checkpoint: no reprocesar ids ya hechos).",
        "Demo mínima: inserta dos entidades homónimas en sqlite, cuenta filas y el par candidato con `id_a < id_b`. Eso es integración real de schema + query, no un print de `True`. Cuando el almacén sea Postgres en S29, el mismo contrato de pares se re-ejecuta contra el dialecto real.",
      ],
      code: {
        language: "python",
        title: "integration_sqlite.py",
        code: `import sqlite3
import unicodedata

def run_integration():
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE entities(id TEXT PRIMARY KEY, name TEXT)")
    # NFD de "María" → NFC unifica tildes para matching estable
    name = unicodedata.normalize("NFC", "Mari\u0301a")
    con.executemany(
        "INSERT INTO entities VALUES (?,?)",
        [("e1", name), ("e2", name)],
    )
    n = con.execute("SELECT COUNT(*) FROM entities").fetchone()[0]
    pairs = con.execute(
        "SELECT a.id, b.id FROM entities a JOIN entities b "
        "ON a.id < b.id AND a.name = b.name"
    ).fetchall()
    encoding_ok = name == "María"
    con.close()
    return n, pairs, encoding_ok

n, pairs, encoding_ok = run_integration()
print("entities", n)
print("pairs", pairs)
print("encoding_ok", encoding_ok)`,
        output: `entities 2
pairs [('e1', 'e2')]
encoding_ok True`,
      },
      callout: {
        type: "info",
        title: "Containers vs memoria",
        content:
          "sqlite memoria valida lógica de pares y schema; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29). Sé honesto en el reporte de evidencia: qué capa cubriste.",
      },
    },
    {
      heading: "Flakes, determinismo y CI",
      subtopicId: "S28-T4-B",
      paragraphs: [
        "Un **flake** (prueba inestable) pasa o falla sin cambio de código: orden de sets, reloj real, red, random sin seed. En la suite que bloquea merge del ER son **inaceptables** — cuarentena documentada o fix, no “retry 3 hasta que pase”.",
        "Mitigaciones: seed fija, reloj inyectado, `sorted` estable en salidas de batch, timeouts con reloj fake (no `sleep` real en CI), retries solo con ticket de cuarentena. Pipeline recomendado: lint → unit → property/data → integration. El job falla si hay drift de golden no aprobado o flake_rate > 0 en la suite gate.",
        "Política de desk: un test que depende del microsegundo actual no es “mala suerte”; es diseño incorrecto. Reemplázalo por `FakeClock` y seed. Documenta en el README de la suite: seeds, reloj y orden de pipeline.",
      ],
      code: {
        language: "python",
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
          "Reintentar un test flaky en CI sin root-cause solo enmascara el problema. Arregla seed, reloj u orden; si no, cuarentena con ticket.",
      },
    },
  ],
  iDo: {
    intro:
      "Te muestro, paso a paso, invariantes con seed, pruebas metamórficas, contratos de schema/golden, fakes y CI determinista. Corre cada demo: el output del curso debe coincidir con lo que ves en tu terminal.",
    steps: [
      {
        demoId: "S28-T1-A-DEMO",
        subtopicId: "S28-T1-A",
        environment: "local-python",
        description:
          "Función estilo pytest: con seed=1 genera 15 strings y aserta que normalize es idempotente (f(f(s))==f(s)).",
        code: {
          language: "python",
          title: "inv_demo.py",
          code: `import random

def norm(s):
    return " ".join(s.casefold().split())

def test_normalize_idempotent(n=15, seed=1):
    random.seed(seed)
    for _ in range(n):
        s = "".join(random.choice("a bÁ") for _ in range(8))
        once = norm(s)
        assert once == norm(once)
    return n

n = test_normalize_idempotent()
print("invariant_ok", True)
print("n", n)
print("seed", 1)`,
          output: `invariant_ok True
n 15
seed 1`,
        },
        why: "Modelo I Do de propiedad no trivial: generator + assert de idempotencia (en CI real, pytest descubre test_*). Evita tautologías tipo len>=0.",
      },
      {
        demoId: "S28-T1-B-DEMO",
        subtopicId: "S28-T1-B",
        environment: "local-python",
        description:
          "Comprueba simetría de Jaccard de tokens (casefold) y metamórfica de padding de espacios.",
        code: {
          language: "python",
          title: "meta_demo.py",
          code: `def j(a, b):
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    return len(ta & tb) / len(ta | tb) if ta | tb else 1.0

def pad_norm(s):
    return " ".join(s.split())

print("sym", abs(j("a b", "b a") - j("b a", "a b")) < 1e-12)
print("meta", pad_norm("x y") == pad_norm("  x   y "))
print("idemp", pad_norm(pad_norm("  a  ")) == pad_norm("  a  "))`,
          output: `sym True
meta True
idemp True`,
        },
        why: "Propiedades sin oráculo absoluto de score aún fallan si hay bugs de normalización o asimetría accidental.",
      },
      {
        demoId: "S28-T2-A-DEMO",
        subtopicId: "S28-T2-A",
        environment: "local-python",
        description: "Valida schema de tres registros sintéticos y cuenta errores de id/score.",
        code: {
          language: "python",
          title: "schema_demo.py",
          code: `def val(r):
    e = []
    if not r.get("id"):
        e.append("id")
    if r.get("score") is not None and not 0 <= r["score"] <= 1:
        e.append("score")
    return e

rows = [
    {"id": "1", "score": 0.2},
    {"id": "", "score": 2},
    {"id": "3", "score": 0.5},
]
print("errors", sum(len(val(r)) for r in rows))
print("ok_first", val(rows[0]) == [])`,
          output: `errors 2
ok_first True`,
        },
        why: "Contratos de calidad en ingest del ER: fail-closed con lista de errores, no booleano opaco.",
      },
      {
        demoId: "S28-T2-B-DEMO",
        subtopicId: "S28-T2-B",
        environment: "local-python",
        description:
          "Detecta drift de golden de pares y bloquea reconcile sin aprobación.",
        code: {
          language: "python",
          title: "drift_demo.py",
          code: `def drift_action(golden, cur):
    drifted = golden != cur
    return drifted, "blocked" if drifted else "ok"

d, action = drift_action({"n": 2}, {"n": 3})
print("drift", d)
print("action", action)
print("ok", True)`,
          output: `drift True
action blocked
ok True`,
        },
        why: "Drift visible y bloqueado > golden actualizado en silencio.",
      },
      {
        demoId: "S28-T3-A-DEMO",
        subtopicId: "S28-T3-A",
        environment: "local-python",
        description:
          "Fake HTTP + reloj fijo devuelven JSON y timestamp deterministas en ISO.",
        code: {
          language: "python",
          title: "fake_demo.py",
          code: `from datetime import datetime, timezone

class H:
    def get(self):
        return {"status": 200, "body": {"ok": True}}

class C:
    def now(self):
        return datetime(2026, 1, 1, tzinfo=timezone.utc)

print(H().get()["body"]["ok"], C().now().date().isoformat())`,
          output: `True 2026-01-01`,
        },
        why: "Dobles controlados eliminan red y tiempo real de la suite.",
      },
      {
        demoId: "S28-T3-B-DEMO",
        subtopicId: "S28-T3-B",
        environment: "local-python",
        description:
          "Contrato de borde sobre match real (casefold) vs overmock que oculta bug.",
        code: {
          language: "python",
          title: "contract_demo.py",
          code: `def real(a, b):
    return a.casefold() == b.casefold()

over = lambda a, b: True
print("real", real("A", "a"))
print("overmock_false_pos", over("A", "z"))
print("prefer_real", True)`,
          output: `real True
overmock_false_pos True
prefer_real True`,
        },
        why: "No mockees la lógica que quieres probar; el overmock marca True en pares distintos.",
      },
      {
        demoId: "S28-T4-A-DEMO",
        subtopicId: "S28-T4-A",
        environment: "local-python",
        description:
          "Integración sqlite en memoria: inserta dos entidades homónimas y cuenta el par candidato (id_a < id_b).",
        code: {
          language: "python",
          title: "integ_demo.py",
          code: `import sqlite3

con = sqlite3.connect(":memory:")
con.execute("create table e(id text, name text)")
con.executemany("insert into e values (?, ?)", [("1", "Ana"), ("2", "Ana")])
n = con.execute("select count(*) from e").fetchone()[0]
pairs = con.execute(
    "select a.id, b.id from e a join e b on a.id < b.id and a.name = b.name"
).fetchall()
con.close()
print("n", n)
print("pairs", pairs)
print("integration", True)`,
          output: `n 2
pairs [('1', '2')]
integration True`,
        },
        why: "Integración mínima del pipeline de candidatos: schema + join real, no print teatral.",
      },
      {
        demoId: "S28-T4-B-DEMO",
        subtopicId: "S28-T4-B",
        environment: "local-python",
        description:
          "Orden estable + seed: dos corridas CI producen la misma lista y el mismo random.",
        code: {
          language: "python",
          title: "ci_demo.py",
          code: `import random

def run(seed):
    random.seed(seed)
    return sorted(["c", "a", "b"]), round(random.random(), 5)

print(run(3) == run(3))
print(run(3)[0])`,
          output: `True
['a', 'b', 'c']`,
        },
        why: "Determinismo es requisito de la suite que bloquea merge.",
      },
    ],
  },
  weDo: {
    intro:
      "24 ejercicios guiados → independientes → transferencia (8 subtemas × 3). Cada starter trae un **bug intencional** runnable: corrígelo y deja **solo** las líneas de salida del oráculo (mismas que la solución). Datos sintéticos; no etiquetes fraude ni parentesco. Tiempo sugerido: ~25–40 min por subtema en bloque We Do.",
    steps: [
      {
        id: "S28-T1-A-E1",
        subtopicId: "S28-T1-A",
        kind: "guided",
        instruction:
          "S28-T1-A-E1 · El starter genera dos `random.random()` pero solo fija la semilla una vez. Corrige para que, con `seed=0` **antes de cada** muestra, ambos valores sean iguales. Imprime una sola línea: `True` o `False`.",
        hint: "Vuelve a llamar random.seed(0) antes de b",
        hints: [
          "Vuelve a llamar random.seed(0) antes de b",
          "Sin re-seed, el segundo random avanza el PRNG y a!=b",
        ],
        edgeCases: ["sin seed no es CI-safe"],
        tests: "Una línea booleana: True solo si a y b se regeneran con la misma seed",
        feedback:
          "Sin re-seed, el PRNG avanza: el segundo random no es la misma muestra. Seed antes de cada muestra = reproducible en CI.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: falta volver a seedear antes de b
import random
random.seed(0)
a = random.random()
b = random.random()  # debería ir precedido de random.seed(0)
print(a == b)
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `import random
random.seed(0)
a = random.random()
random.seed(0)
b = random.random()
print(a == b)`,
          output: `True`,
        },
      },
      {
        id: "S28-T1-A-E2",
        subtopicId: "S28-T1-A",
        kind: "independent",
        instruction:
          "S28-T1-A-E2 · Invariante de dominio: todo score del batch debe estar en [0, 1]. El starter hardcodea `True` sin mirar los datos. Con `scores = [0, 0.5, 1.2]` calcula `all(0 <= s <= 1 for s in scores)` e imprime el booleano (una línea). El 1.2 debe fallar el contrato.",
        hint: "Usa all(...) sobre el rango inclusivo; 1.2 está fuera",
        hints: [
          "Usa all(...) sobre el rango inclusivo",
          "0 y 1 son válidos; 1.2 no — el hardcode True esconde el fallo",
        ],
        edgeCases: ["NaN no es válido en suites reales"],
        tests: "Una línea: False porque 1.2 rompe el contrato [0, 1]",
        feedback:
          "Hardcodear True oculta el score 1.2. La invariante se mide con all(...), no con un booleano de teatro.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: hardcodea True sin validar el batch (hay un score fuera de rango)
scores = [0, 0.5, 1.2]
print(True)
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `scores = [0, 0.5, 1.2]
print(all(0 <= s <= 1 for s in scores))`,
          output: `False`,
        },
      },
      {
        id: "S28-T1-A-E3",
        subtopicId: "S28-T1-A",
        kind: "transfer",
        instruction:
          "S28-T1-A-E3 · Transferencia (estilo pytest de S27): escribe `test_normalize_idempotent()` que, con seed=42, genere 10 strings del alfabeto `'a bÁé'` (longitud 0..8) y haga `assert` de idempotencia `normalize(s)==normalize(normalize(s))` en cada uno. El starter solo mira un literal y no genera casos. Invoca el test y imprime dos líneas: `idempotent_ok True` y `n_cases 10`.",
        hint: "Función test_* con assert; bucle seed; al final resume con print",
        hints: [
          "def test_normalize_idempotent(): random.seed(42); for … assert once == normalize(once)",
          "normalize = ' '.join(s.casefold().split()); n_cases fijo en 10",
        ],
        edgeCases: ["string vacío; solo espacios; tildes; assert falla → bug real"],
        tests: "Dos líneas: idempotent_ok True y n_cases 10 tras asserts del batch",
        feedback:
          "Una propiedad real genera muchos inputs (seed + bucle) y aserta f(f(x))==f(x). Un solo literal no es property-based thinking.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: no genera casos ni comprueba f(f(x))==f(x); hardcodea n_cases=1
import random

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

def test_normalize_idempotent(n_cases: int = 10) -> int:
    s = "  Ana  "
    once = normalize(s)
    # solo un literal; no hay bucle ni seed=42 sobre el generador
    assert once == normalize(once)
    return 1  # debería devolver n_cases del batch generado

n = test_normalize_idempotent()
print("idempotent_ok", True)
print("n_cases", n)
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `import random

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

def test_normalize_idempotent(n_cases: int = 10) -> int:
    """Propiedad: normalize es idempotente (compón con pytest en CI real)."""
    random.seed(42)
    alphabet = "a bÁé"
    for _ in range(n_cases):
        s = "".join(random.choice(alphabet) for _ in range(random.randint(0, 8)))
        once = normalize(s)
        assert once == normalize(once)
    return n_cases

n = test_normalize_idempotent()
print("idempotent_ok", True)
print("n_cases", n)`,
          output: `idempotent_ok True
n_cases 10`,
        },
      },
      {
        id: "S28-T1-B-E1",
        subtopicId: "S28-T1-B",
        kind: "guided",
        instruction:
          "S28-T1-B-E1 · Simetría de un score Jaccard de tokens: el starter usa un j **dirigido** (divide por `len(ta)`, no por la unión) y con a='ana pe xx', b='pe ana' eso hace `j(a,b) != j(b,a)`. Corrige j a Jaccard simétrico `|∩|/|∪|` (casefold ambos lados) e imprime `j(a,b) == j(b,a)` (una línea booleana).",
        hint: "Jaccard simétrico: len(ta & tb) / len(ta | tb); no dividas solo por len(ta)",
        hints: [
          "casefold + split en ambos lados; unión vacía → 1.0",
          "Un score dirigido (solo len(ta)) rompe simetría — cámbialo a |∪|",
        ],
        edgeCases: ["distancias dirigidas no son simétricas — aquí Jaccard sí"],
        tests: "Una línea True: j(a,b)==j(b,a) con Jaccard |∩|/|∪|",
        feedback:
          "Dividir solo por len(ta) es un score dirigido: j(a,b)≠j(b,a). Jaccard simétrico usa la unión en el denominador.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: j dirigido (divide por len(ta)) → no es simétrico
def j(a, b):
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    if not ta:
        return 0.0
    return len(ta & tb) / len(ta)

a, b = "ana pe xx", "pe ana"
print(j(a, b) == j(b, a))
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `def j(a, b):
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    if not ta and not tb:
        return 1.0
    return len(ta & tb) / len(ta | tb)

a, b = "ana pe xx", "pe ana"
print(j(a, b) == j(b, a))`,
          output: `True`,
        },
      },
      {
        id: "S28-T1-B-E2",
        subtopicId: "S28-T1-B",
        kind: "independent",
        instruction:
          "S28-T1-B-E2 · Prueba metamórfica: si `eq(x,y)` es igualdad casefold, entonces `eq(x.upper(), y)` debe coincidir con `eq(x, y)` para x='Ana', y='ana'. El starter usa `==` sensible a mayúsculas. Imprime el booleano de la relación metamórfica (una línea).",
        hint: "eq = lambda u,v: u.casefold()==v.casefold(); compara eq(x,y) con eq(x.upper(), y)",
        hints: [
          "eq = lambda u,v: u.casefold()==v.casefold()",
          "La relación: eq(x,y) == eq(x.upper(), y)",
        ],
        edgeCases: ["upper no es la única transformación; padding es otra metamórfica"],
        tests: "Una línea True: eq(x,y) == eq(x.upper(), y) bajo igualdad casefold",
        feedback:
          "Metamórfica ≠ 'casefold equality' a secas: transformas el input (upper) y predices que la relación de igualdad se conserva.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: igualdad case-sensitive; no es relación metamórfica
x, y = "Ana", "ana"
print(x == y)
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `def eq(u, v):
    return u.casefold() == v.casefold()

x, y = "Ana", "ana"
print(eq(x, y) == eq(x.upper(), y))`,
          output: `True`,
        },
      },
      {
        id: "S28-T1-B-E3",
        subtopicId: "S28-T1-B",
        kind: "transfer",
        instruction:
          "S28-T1-B-E3 · Transferencia de **simetría** (no confundir con idempotencia): con `eq(u,v)=u.casefold()==v.casefold()`, verifica que en *todos* los pares `[('Ana','ana'), ('x','Y'), ('','')]` se cumple `eq(a,b)==eq(b,a)`. El starter solo mira el primer par y usa polaridad invertida. Imprime un booleano (una línea).",
        hint: "all(eq(a,b)==eq(b,a) for a,b in pairs) — simetría es reordenar args, no f(f(x))",
        hints: [
          "all(eq(a, b) == eq(b, a) for a, b in pairs)",
          "Idempotencia sería f(f(x))==f(x) — otro concepto; aquí es simetría de eq",
        ],
        edgeCases: [
          "pares negativos ('x','Y') siguen siendo simétricos bajo eq casefold",
          "documenta la propiedad en el nombre del test en suites reales",
        ],
        tests: "Una línea True: simetría all-pairs de eq, no f(f(x))",
        feedback:
          "Simetría es reordenar args (eq(a,b)==eq(b,a)). Idempotencia es f(f(x))==f(x). No mezcles los nombres en el test.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: solo un par + polaridad invertida (no es all-simetría)
def eq(u, v):
    return u.casefold() == v.casefold()

pairs = [("Ana", "ana"), ("x", "Y"), ("", "")]
a, b = pairs[0]
print(eq(a, b) != eq(b, a))
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `def eq(u, v):
    return u.casefold() == v.casefold()

pairs = [("Ana", "ana"), ("x", "Y"), ("", "")]
print(all(eq(a, b) == eq(b, a) for a, b in pairs))`,
          output: `True`,
        },
      },
      {
        id: "S28-T2-A-E1",
        subtopicId: "S28-T2-A",
        kind: "guided",
        instruction:
          "S28-T2-A-E1 · Contrato de schema: si el dict no tiene `id` (o está vacío), imprime `id requerido`; si no, `ok`. El starter siempre imprime `ok`. Una línea.",
        hint: "not r.get('id') cubre clave ausente y cadena vacía",
        hints: [
          "not r.get('id') cubre clave ausente y cadena vacía",
          "r = {} debe fallar el contrato",
        ],
        edgeCases: ["id vacío vs None"],
        tests: "Una línea: id requerido cuando el dict no trae id usable",
        feedback:
          "Fail-closed en el borde: r={} no es 'ok'. not r.get('id') cubre clave ausente y cadena vacía.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: imprime ok aunque r no tiene id
r = {}
print("ok")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `r = {}
print("id requerido" if not r.get("id") else "ok")`,
          output: `id requerido`,
        },
      },
      {
        id: "S28-T2-A-E2",
        subtopicId: "S28-T2-A",
        kind: "independent",
        instruction:
          "S28-T2-A-E2 · score=1.2 está fuera de [0,1]: imprime la etiqueta de error `score`; si estuviera en rango, `ok`. El starter invierte la polaridad. Una línea.",
        hint: "print('score' if not (0 <= score <= 1) else 'ok')",
        hints: [
          "print('score' if not (0 <= score <= 1) else 'ok')",
          "Límites inclusivos: 0 y 1 son válidos",
        ],
        edgeCases: ["inclusive bounds"],
        tests: "Una línea: score (etiqueta de error) para 1.2 fuera de [0,1]",
        feedback:
          "Polaridad invertida es un bug clásico de contratos: 1.2 debe etiquetarse 'score', no 'ok'. 0 y 1 sí son válidos.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: polaridad invertida al validar bounds
score = 1.2
print("ok" if not (0 <= score <= 1) else "score")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `score = 1.2
print("score" if not (0 <= score <= 1) else "ok")`,
          output: `score`,
        },
      },
      {
        id: "S28-T2-A-E3",
        subtopicId: "S28-T2-A",
        kind: "transfer",
        instruction:
          "S28-T2-A-E3 · Transferencia: con `validate` que revisa id no vacío y score en [0,1], cuenta cuántos de dos registros fallan (len(errores)>0). El starter cuenta filas totales. Imprime el entero (una línea).",
        hint: "sum(1 for r in rows if validate(r))",
        hints: [
          "Define validate que devuelve lista de errores",
          "Cuenta filas con al menos un error",
        ],
        edgeCases: ["quality contract multi-campo"],
        tests: "Una línea entera: cuántas filas tienen al menos un error de validate",
        feedback:
          "len(rows) mide el batch; el contrato de calidad mide filas sucias (len(errores)>0). Aquí solo la segunda fila falla.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: cuenta todas las filas en vez de las que fallan
rows = [{"id": "1", "score": 0.2}, {"id": "", "score": 1.5}]
print(len(rows))
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `def validate(r):
    err = []
    if not r.get("id"):
        err.append("id")
    s = r.get("score")
    if s is not None and not (0 <= s <= 1):
        err.append("score")
    return err

rows = [{"id": "1", "score": 0.2}, {"id": "", "score": 1.5}]
print(sum(1 for r in rows if validate(r)))`,
          output: `1`,
        },
      },
      {
        id: "S28-T2-B-E1",
        subtopicId: "S28-T2-B",
        kind: "guided",
        instruction:
          "S28-T2-B-E1 · Imprime `drift` si golden != current; si no, `ok`. El starter ignora el diff. Una línea.",
        hint: "Compara dicts con !=",
        hints: [
          "Compara dicts con !=",
          "golden={'n':1}, current={'n':2} → drift",
        ],
        edgeCases: ["en prod: deep compare JSON canónico"],
        tests: "Una línea: drift si golden != current",
        feedback:
          "Siempre imprimir 'ok' esconde el diff del golden. Drift visible es el primer paso de la regresión de matching.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: ignora drift y siempre ok
golden, current = {"n": 1}, {"n": 2}
print("ok")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `golden, current = {"n": 1}, {"n": 2}
print("drift" if golden != current else "ok")`,
          output: `drift`,
        },
      },
      {
        id: "S28-T2-B-E2",
        subtopicId: "S28-T2-B",
        kind: "independent",
        instruction:
          "S28-T2-B-E2 · Reconcile bloqueado: si hay diff y approved=False → `blocked`; si no → `ok`. El starter siempre dice ok. Una línea.",
        hint: "blocked si diff and not approved",
        hints: [
          "blocked si diff and not approved",
          "Review humana antes de actualizar golden",
        ],
        edgeCases: ["review humana obligatoria"],
        tests: "Una línea: blocked si hay diff y approved=False",
        feedback:
          "Reconcile sin approve actualiza el contrato en silencio. blocked_drift fuerza review humana antes de tocar el golden.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: ok aunque hay diff y no approved
diff, approved = True, False
print("ok")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `diff, approved = True, False
print("blocked" if diff and not approved else "ok")`,
          output: `blocked`,
        },
      },
      {
        id: "S28-T2-B-E3",
        subtopicId: "S28-T2-B",
        kind: "transfer",
        instruction:
          "S28-T2-B-E3 · Transferencia de golden versionado: meta tiene golden_version=3 y approved=False; current difiere del golden embebido. Imprime dos líneas: la versión leída del meta y la acción (`blocked` sin approve). El starter hardcodea 0 y ok.",
        hint: "Lee meta['golden_version']; acción = blocked si diff y not approved",
        hints: [
          "Lee meta['golden_version'] del dict",
          "No actualices golden sin approved=True",
        ],
        edgeCases: ["changelog de versión en el PR"],
        tests: "Dos líneas: golden_version del meta y blocked sin approve",
        feedback:
          "Versión del golden + acción de reconcile son evidencia del PR. Hardcodear 0/ok no es workflow de drift.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: hardcodea versión 0 y ok pese a drift
meta = {
    "golden_version": 3,
    "approved": False,
    "golden": {"pairs": 1},
}
current = {"pairs": 2}
print(0)
print("ok")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `meta = {
    "golden_version": 3,
    "approved": False,
    "golden": {"pairs": 1},
}
current = {"pairs": 2}
diff = meta["golden"] != current
print(meta["golden_version"])
print("blocked" if diff and not meta["approved"] else "ok")`,
          output: `3
blocked`,
        },
      },
      {
        id: "S28-T3-A-E1",
        subtopicId: "S28-T3-A",
        kind: "guided",
        instruction:
          "S28-T3-A-E1 · Fake DB (dict): obtén el name de la entidad `e1` e imprímelo. El starter busca `e2`. Una línea: `Ana`.",
        hint: "db['e1']['name'] o get encadenado con default",
        hints: [
          "db['e1']['name']",
          "Clave incorrecta devuelve None — corrige el id",
        ],
        edgeCases: ["missing key"],
        tests: "Una línea: Ana (name de la entidad e1 en el fake DB)",
        feedback:
          "Un fake de DB es un dict con estado real: la clave incorrecta (e2) no prueba el borde. Lee e1['name'].",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: busca e2 en vez de e1
db = {"e1": {"name": "Ana"}}
print(db.get("e2", {}).get("name"))
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `db = {"e1": {"name": "Ana"}}
print(db["e1"]["name"])`,
          output: `Ana`,
        },
      },
      {
        id: "S28-T3-A-E2",
        subtopicId: "S28-T3-A",
        kind: "independent",
        instruction:
          "S28-T3-A-E2 · Fake clock: `datetime(2026, 7, 20, 15, 30, tzinfo=timezone.utc)`. El starter imprime `str(d)` (no es fecha ISO corta). Imprime la fecha ISO corta con `d.date().isoformat()` → `2026-07-20`.",
        hint: "d.date().isoformat() — str(datetime) incluye hora y no es el contrato",
        hints: [
          "d.date().isoformat()",
          "str(datetime) no es fecha ISO corta del contrato ER",
        ],
        edgeCases: ["timezone aware en prod"],
        tests: "Una línea ISO corta: 2026-07-20 vía date().isoformat()",
        feedback:
          "str(datetime) incluye hora y tz; el contrato de fecha corta del ER es d.date().isoformat(). No es el mismo oráculo.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: str(datetime) no es fecha ISO corta
from datetime import datetime, timezone
d = datetime(2026, 7, 20, 15, 30, tzinfo=timezone.utc)
print(str(d))
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `from datetime import datetime, timezone
d = datetime(2026, 7, 20, 15, 30, tzinfo=timezone.utc)
print(d.date().isoformat())`,
          output: `2026-07-20`,
        },
      },
      {
        id: "S28-T3-A-E3",
        subtopicId: "S28-T3-A",
        kind: "transfer",
        instruction:
          "S28-T3-A-E3 · Fake HTTP: si status >= 500 imprime `retry`, si no `ok`. Incluye política de timeout conceptual: si `timeout_ms` > 2000 también `retry`. El starter invierte 5xx y ignora timeout. status=503, timeout_ms=3000 → una línea `retry`.",
        hint: "retry si status>=500 o timeout_ms>2000",
        hints: [
          "retry si status>=500 o timeout_ms>2000",
          "Polaridad: 503 no es ok",
        ],
        edgeCases: ["timeouts + 5xx"],
        tests: "Una línea: retry cuando 5xx o timeout_ms > 2000",
        feedback:
          "503 y timeout largo piden retry, no ok. El fake HTTP modela política de borde sin red real ni sleep.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: polaridad 5xx invertida e ignora timeout
status = 503
timeout_ms = 3000
print("ok" if status >= 500 else "retry")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `status = 503
timeout_ms = 3000
print("retry" if status >= 500 or timeout_ms > 2000 else "ok")`,
          output: `retry`,
        },
      },
      {
        id: "S28-T3-B-E1",
        subtopicId: "S28-T3-B",
        kind: "guided",
        instruction:
          "S28-T3-B-E1 · Contrato de borde: igualdad de match entre `'Ana'` y `'ANA'` con `casefold` en **ambos** lados → True. El starter aplica `lower` solo al primer operando (`'Ana'.lower() == 'ANA'`), que falla. Una línea booleana.",
        hint: "casefold() en ambos operandos",
        hints: [
          "casefold() en ambos operandos",
          "lower solo a un lado es contrato asimétrico roto",
        ],
        edgeCases: ["no overmock del comparador; casefold > lower para Unicode"],
        tests: "Una línea True: casefold en ambos lados del comparador",
        feedback:
          "lower solo a un lado rompe el contrato ('ana'=='ANA' es False). casefold ambos lados es el borde de igualdad de texto del ER.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: lower solo un lado → 'ana' == 'ANA' es False
print("Ana".lower() == "ANA")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `print("Ana".casefold() == "ANA".casefold())`,
          output: `True`,
        },
      },
      {
        id: "S28-T3-B-E2",
        subtopicId: "S28-T3-B",
        kind: "independent",
        instruction:
          "S28-T3-B-E2 · Detecta overmock: si la función devuelve True para pares distintos ('x','y') y ('1','2'), imprime `weak`; si no, `ok`. El starter imprime ok. Una línea.",
        hint: "weak si f('x','y') and f('1','2')",
        hints: [
          "weak si f('x','y') and f('1','2')",
          "Un matcher real no acepta cualquier par",
        ],
        edgeCases: ["tests de borde con negativos"],
        tests: "Una línea: weak si el doble acepta cualquier par distinto",
        feedback:
          "Si f('x','y') y f('1','2') son True, el matcher es un overmock débil. Detectarlo es parte del contrato de borde.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: no marca weak cuando f acepta cualquier par
f = lambda a, b: True
print("ok")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `f = lambda a, b: True
print("weak" if f("x", "y") and f("1", "2") else "ok")`,
          output: `weak`,
        },
      },
      {
        id: "S28-T3-B-E3",
        subtopicId: "S28-T3-B",
        kind: "transfer",
        instruction:
          "S28-T3-B-E3 · Contrato de borde observable (no call-order): un fake writer hace append al store. El starter hardcodea 0 y `calls`. Tras un insert sintético, imprime dos líneas: `rows_written` real y el nombre escrito (`Ana`). Aserta efecto de estado, no el orden de métodos internos.",
        hint: "result['rows_written'] y store[-1]['name'] (o result de un get)",
        hints: [
          "Efecto observable: filas en el store + campo name",
          "No hace falta mockear el orden de métodos — eso es sobre-mocking",
        ],
        edgeCases: ["no asserts de call order; estado del fake es el oráculo"],
        tests: "Dos líneas: rows_written y name escrito (efecto de estado)",
        feedback:
          "Contrato de borde = efecto observable (filas + name), no el orden de métodos internos. Sobre-mocking aserta 'calls'.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: inventa métricas de calls en vez de leer el efecto
store = []

def write_row(row):
    store.append(row)
    return {"rows_written": len(store), "table": "e"}

result = write_row({"id": "1", "name": "Ana"})
print(0)
print("calls")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `store = []

def write_row(row):
    store.append(row)
    return {"rows_written": len(store), "table": "e"}

result = write_row({"id": "1", "name": "Ana"})
print(result["rows_written"])
print(store[-1]["name"])`,
          output: `1
Ana`,
        },
      },
      {
        id: "S28-T4-A-E1",
        subtopicId: "S28-T4-A",
        kind: "guided",
        instruction:
          "S28-T4-A-E1 · Integración sqlite memoria: CREATE table, INSERT un row, imprime COUNT(*). El starter hardcodea 0 sin SELECT. Una línea: `1`.",
        hint: "c.execute('select count(*) from t').fetchone()[0]",
        hints: [
          "c.execute('select count(*) from t').fetchone()[0]",
          ":memory: se pierde al close — cuenta antes de cerrar",
        ],
        edgeCases: [":memory: se pierde al close"],
        tests: "Una línea: 1 (COUNT(*) real tras INSERT en sqlite :memory:)",
        feedback:
          "Integración honesta lee el motor (SELECT COUNT), no hardcodea 0. :memory: se pierde al close — cuenta antes de cerrar.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: no ejecuta SELECT y hardcodea 0
import sqlite3
c = sqlite3.connect(":memory:")
c.execute("create table t(x int)")
c.execute("insert into t values (1)")
print(0)
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(":memory:")
c.execute("create table t(x int)")
c.execute("insert into t values (1)")
print(c.execute("select count(*) from t").fetchone()[0])`,
          output: `1`,
        },
      },
      {
        id: "S28-T4-A-E2",
        subtopicId: "S28-T4-A",
        kind: "independent",
        instruction:
          "S28-T4-A-E2 · Cardinalidad de pares candidatos C(n,2) = n*(n-1)//2 para n=4 → 6. El starter usa n*n (incluye diagonal y dobles). Una línea: `6`.",
        hint: "n * (n - 1) // 2",
        hints: [
          "n * (n - 1) // 2",
          "Pares no ordenados sin auto-pares",
        ],
        edgeCases: ["blocking reduce pares en prod"],
        tests: "Una línea: 6 = C(4,2) = n*(n-1)//2",
        feedback:
          "n*n incluye diagonal y dobles. Cardinalidad de pares candidatos no ordenados es n*(n-1)//2.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: usa n*n (incluye diagonal)
n = 4
print(n * n)
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `n = 4
print(n * (n - 1) // 2)`,
          output: `6`,
        },
      },
      {
        id: "S28-T4-A-E3",
        subtopicId: "S28-T4-A",
        kind: "transfer",
        instruction:
          "S28-T4-A-E3 · Reanudación + encoding Unicode: `done={'a'}`, `items=['a','b','c']`. El starter reprocesa todo y marca encoding_ok False. Imprime dos líneas: pendientes en orden original, y `encoding_ok True` solo si la forma NFD de “María” (`'Mari\\u0301a'`) se iguala a `'María'` tras `unicodedata.normalize('NFC', …)`.",
        hint: "pending = [i for i in items if i not in done]; NFC unifica tildes precompuestas",
        hints: [
          "list comp filtrando done",
          "import unicodedata; normalize('NFC', nfd) == 'María'",
        ],
        edgeCases: ["timeout + resume; NFD vs NFC en fuentes Latam"],
        tests: "Dos líneas: pendientes ['b','c'] y encoding_ok True tras NFC",
        feedback:
          "Reanudación salta ids en done; NFC unifica NFD de tildes Latam. Reprocesar todo + comparar NFD crudo falla ambos contratos.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: reprocesa done e ignora normalización Unicode NFC
import unicodedata

done, items = {"a"}, ["a", "b", "c"]
nfd = "Mari\u0301a"  # a + combining acute (NFD)
print(items)
print("encoding_ok", nfd == "María")  # False sin NFC
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `import unicodedata

done, items = {"a"}, ["a", "b", "c"]
pending = [i for i in items if i not in done]
nfd = "Mari\u0301a"
nfc = unicodedata.normalize("NFC", nfd)
print(pending)
print("encoding_ok", nfc == "María")`,
          output: `['b', 'c']
encoding_ok True`,
        },
      },
      {
        id: "S28-T4-B-E1",
        subtopicId: "S28-T4-B",
        kind: "guided",
        instruction:
          "S28-T4-B-E1 · Orden estable del batch: imprime sorted(['b','a']). El starter imprime la lista cruda. Una línea: `['a', 'b']`.",
        hint: "sorted(ids)",
        hints: [
          "sorted(ids)",
          "set order no es estable entre corridas",
        ],
        edgeCases: ["set order no es estable"],
        tests: "Una línea: ['a', 'b'] con sorted del batch",
        feedback:
          "Orden de sets/listas crudas es flake en CI. sorted fija el orden del batch antes de comparar goldens.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: no aplica sorted
ids = ["b", "a"]
print(ids)
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `print(sorted(["b", "a"]))`,
          output: `['a', 'b']`,
        },
      },
      {
        id: "S28-T4-B-E2",
        subtopicId: "S28-T4-B",
        kind: "independent",
        instruction:
          "S28-T4-B-E2 · Política CI: si flake_rate > 0 imprime `fail_job`; si no, `ok`. El starter invierte la polaridad. flake_rate=0.01 → una línea `fail_job`.",
        hint: "fail_job si flake_rate > 0",
        hints: [
          "fail_job si flake_rate > 0",
          "Cuarentena documentada ≠ ocultar con retry",
        ],
        edgeCases: ["cuarentena documentada con ticket"],
        tests: "Una línea: fail_job si flake_rate > 0 en la suite de merge",
        feedback:
          "Cualquier flake_rate > 0 debe fallar el job de gate. Invertir polaridad o subir retries sin root-cause no es política de CI.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: polaridad invertida del gate
flake_rate = 0.01
print("ok" if flake_rate > 0 else "fail_job")
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `flake_rate = 0.01
print("fail_job" if flake_rate > 0 else "ok")`,
          output: `fail_job`,
        },
      },
      {
        id: "S28-T4-B-E3",
        subtopicId: "S28-T4-B",
        kind: "transfer",
        instruction:
          "S28-T4-B-E3 · Transferencia CI determinista: implementa `run(seed)` que fije seed, genere 5 letras de `'abc'` y devuelva `sorted(...)`. El starter no re-siembra entre corridas y no ordena. Imprime dos líneas: si `run(7)==run(7)` (debe ser True) y el resultado de `run(7)`.",
        hint: "Dentro de run: random.seed(seed); return sorted([...])",
        hints: [
          "Cada llamada a run debe seedear de nuevo — si no, la 2.ª corrida diverge",
          "sorted garantiza orden estable del batch en CI",
        ],
        edgeCases: ["sin seed la igualdad entre corridas es flake"],
        tests: "Dos líneas: True (run(7)==run(7)) y la lista ordenada de run(7)",
        feedback:
          "Cada run debe seedear de nuevo y ordenar. Sin seed+sorted, dos 'mismas' corridas CI divergen: eso es un flake.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# BUG intencional: no re-siembra ni ordena → dos corridas divergen / orden inestable
import random

def run(seed):
    # falta random.seed(seed) y sorted
    return [random.choice("abc") for _ in range(5)]

print(run(7) == run(7))
print(run(7))
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `import random

def run(seed):
    random.seed(seed)
    return sorted(random.choice("abc") for _ in range(5))

print(run(7) == run(7))
print(run(7))`,
          output: `True
['a', 'a', 'b', 'b', 'c']`,
        },
      },
    ],
  },
  youDo: {
    title: "Suite QA del motor ER — propiedades, goldens e integración",
    context:
      "Entrega una suite sintética que cace encoding, cardinalidad, orden, timeout/reanudación y drift de golden para el pipeline ER de CP-N3-A. Usa fixtures mínimas, fakes de reloj/HTTP y sqlite memoria. Sin PII real; matching ≠ fraude. Extiende lo aprendido en S27 (pytest AAA/fixtures) con las capas de S28.",
    objectives: [
      "Invariantes + generación con seed (idempotencia de normalize)",
      "Metamórficas/simetría de comparadores documentadas",
      "Contratos de schema/calidad y golden con reconcile bloqueado sin approve",
      "Integración sqlite de candidatos + CI determinista (seed, sort, reloj)",
    ],
    requirements: [
      "Fixtures sintéticas mínimas (nombres/emails @example.pe, sin PII real)",
      "Al menos: (1) test de propiedad/idempotencia con seed, (2) validador de schema con lista de errores, (3) golden con drift bloqueado sin approve, (4) fake de reloj o HTTP, (5) integración sqlite de pares candidatos, (6) sort/seed documentados para CI",
      "Cero pruebas inestables (flakes) en la suite que bloquea merge: seed, reloj inyectado y orden estable",
      "Documentación en español profesional (es-PE): límites, evidencias, qué no prueba la suite",
      "Alineación QA ER del hilo CP-N3-A (solo misma entidad; sin etiquetas de fraude/parentesco)",
    ],
    starterCode: `# Suite QA ER — esqueleto S28 (organiza en archivos al crecer)
# Layout sugerido:
#   tests/test_properties.py   # idempotencia / metamórficas con seed
#   tests/test_schema_golden.py
#   tests/test_doubles.py      # FakeClock / FakeHTTP
#   tests/test_integration.py  # sqlite pares + encoding NFC
import random
import unicodedata
from datetime import datetime, timezone

random.seed(0)

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

def validate_record(r: dict) -> list[str]:
    err = []
    if not r.get("id"):
        err.append("id requerido")
    score = r.get("score")
    if score is not None and not (0 <= float(score) <= 1):
        err.append("score fuera de [0,1]")
    return err

def test_normalize_idempotent(n_cases: int = 20) -> None:
    random.seed(0)
    alphabet = "a bÁé"
    for _ in range(n_cases):
        s = "".join(random.choice(alphabet) for _ in range(random.randint(0, 10)))
        once = normalize(s)
        assert once == normalize(once)

# Completa: golden+blocked_drift, FakeClock/FakeHTTP, sqlite de pares,
# unicodedata NFC en nombres, sorted+seed documentados en README de la suite.

if __name__ == "__main__":
    test_normalize_idempotent()
    assert validate_record({"id": "", "score": 1.5}) != []
    print("qa_starter_ok")
`,
    portfolioNote:
      "Suite de QA para CP-N3-A: propiedades, contratos de datos e integración determinista. Documenta límites y evidencia; no uses PII real ni auto-etiquetes fraude.",
    rubric: [
      {
        criterion:
          "Cubre propiedades, contratos/golden, dobles e integración determinista del ER sintético",
        weight: "25%",
      },
      { criterion: "Correctitud técnica en entorno local-python declarado", weight: "20%" },
      {
        criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude",
        weight: "20%",
      },
      { criterion: "Pruebas o casos de borde documentados (encoding, orden, resume)", weight: "15%" },
      { criterion: "Código legible y límites claros de la suite", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Un test metamórfico verifica:",
        options: [
          "Que la salida sea siempre un número mágico fijo sin mirar el input",
          "Que dos ejecuciones con reloj real coincidan siempre en el timestamp",
          "Que el score de matching autorice una etiqueta de fraude",
          "Relaciones predecibles entre entradas transformadas y salidas",
        ],
        correctIndex: 3,
        explanation:
          "Relaciona salidas bajo transformaciones conocidas (p. ej. padding no cambia normalize) cuando no hay oráculo absoluto del score.",
      },
      {
        question: "Actualizar un golden con drift sin review es:",
        options: [
          "Buena práctica de velocidad en CI",
          "Riesgo de ocultar regresiones de matching",
          "Obligatorio en cada merge",
          "Irrelevante si el job es verde a veces",
        ],
        correctIndex: 1,
        explanation:
          "Reconcile debe ser aprobado: sin review, el golden deja de proteger el contrato.",
      },
      {
        question: "Sobre-mocking típico en el matcher:",
        options: [
          "Probar lógica pura real de normalize/comparador",
          "Usar sqlite memoria para pares candidatos",
          "Acoplar el test a detalles internos y ocultar bugs con dobles que siempre pasan",
          "Fijar seed en generadores de casos",
        ],
        correctIndex: 2,
        explanation:
          "Mockea I/O externo; deja el corazón del matching real bajo prueba cuando es puro y barato.",
      },
      {
        question: "Flakes en la suite que bloquea merge del ER se manejan:",
        options: [
          "Con determinismo (seed/reloj/sort) y fallo de job si persisten",
          "Ignorándolos si el promedio del día es verde",
          "Subiendo retries a 100 sin root-cause",
          "Borrando el test que molesta",
        ],
        correctIndex: 0,
        explanation:
          "CI determinista es outcome de S28: seed, reloj inyectado, orden estable; retry no es fix.",
      },
      {
        question: "En integración local del ER, sqlite en memoria sirve sobre todo para…",
        options: [
          "Reemplazar por completo a Postgres en producción",
          "Validar schema, joins de candidatos y cardinalidad sin red ni contenedor",
          "Generar PII real de contactos bancarios para el golden",
          "Evitar documentar encoding NFC/NFD porque “ya funciona en laptop”",
        ],
        correctIndex: 1,
        explanation:
          "Es análogo honesto a testcontainers: prueba lógica de pares y schema; el dialecto real se re-valida cuando el almacén (S29) sea Postgres.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Hypothesis (property testing)",
        url: "https://hypothesis.readthedocs.io/",
        note: "Generación de casos desde propiedades (siguiente paso industrial tras seed+bucle)",
      },
      {
        label: "Hypothesis — What you can generate",
        url: "https://hypothesis.readthedocs.io/en/latest/data.html",
        note: "Strategies y datos",
      },
      {
        label: "sqlite3 Python",
        url: "https://docs.python.org/3/library/sqlite3.html",
        note: "Integración local determinista",
      },
      {
        label: "unittest.mock",
        url: "https://docs.python.org/3/library/unittest.mock.html",
        note: "Dobles HTTP/DB/reloj",
      },
      {
        label: "pytest — Fixtures",
        url: "https://docs.pytest.org/en/stable/how-to/fixtures.html",
        note: "Aislamiento y scopes (compón propiedades como tests pytest de S27)",
      },
      {
        label: "Great Expectations (docs concept)",
        url: "https://docs.greatexpectations.io/",
        note: "Contratos de calidad de datos",
      },
      {
        label: "testcontainers (concept)",
        url: "https://testcontainers.com/",
        note: "Integración con deps reales en CI",
      },
    ],
    books: [
      {
        label: "Growing Object-Oriented Software, Guided by Tests",
        note: "Contratos de borde y dobles",
      },
      {
        label: "Data Quality Fundamentals",
        note: "Schema y drift conceptual",
      },
    ],
    courses: [
      {
        label: "Coursera — data quality / testing",
        url: "https://www.coursera.org/courses?query=data%20quality%20testing",
        note: "Calidad y contratos",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos verificables",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Tests y proyectos",
      },
      {
        label: "deeplearning.ai — data engineering",
        url: "https://www.deeplearning.ai/specializations/data-engineering",
        note: "Pipelines y calidad de datos",
      },
    ],
  },
}
