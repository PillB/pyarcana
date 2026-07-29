import type { CourseSection } from '../../types'

export const section28: CourseSection = {
  id: "llm-agents",
  index: 28,
  title: "Pruebas de datos, propiedades e integración",
  shortTitle: "Propiedades e integración",
  tagline:
    "Suite que caza errores de encoding, cardinalidad, orden, timeout y reanudación, con fixtures sintéticas mínimas",
  estimatedHours: 19,
  level: "Competente",
  phase: 2,
  icon: "ShieldCheck",
  accentColor: "bg-gradient-to-br from-emerald-500 to-teal-700",
  jobRelevance:
    "El QA del motor de entity resolution (ER), el proceso de decidir si dos registros refieren a la misma entidad, exige más que tests unitarios felices: necesita propiedades que generen bordes, contratos de schema, goldens con revisión humana, dobles de HTTP/DB/reloj e integración determinista en CI. En un desk de datos en Lima (banca, fintech o retail), un flake o un golden actualizado en silencio puede dejar pasar un matching roto hasta producción. Aquí aprendes a montar la capa de propiedades, datos, dobles e integración que protege el pipeline antes de que alguien lo note en la mesa de revisión.",
  learningOutcomes: [
    { text: "Generar casos desde invariantes con seed o tabla exhaustiva" },
    { text: "Aplicar pruebas metamórficas, de simetría e idempotencia" },
    { text: "Validar contratos de schema y de calidad en ingest" },
    { text: "Detectar drift de golden y reconciliar solo con aprobación" },
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
        "**Diccionario del módulo** (léelo una vez; cada subtema lo profundiza):\n\n- **Invariante:** propiedad que siempre debe cumplirse (`normalize` idempotente, score en [0, 1]).\n- **Prueba de propiedades (property-based testing):** generar muchos casos desde la invariante, no solo un ejemplo feliz.\n- **Prueba metamórfica:** no conoces el score “correcto”, pero sí una relación bajo una transformación del input.\n- **Contrato de schema/calidad:** reglas de tipos, nulls y negocio en el borde de ingest.\n- **Golden:** snapshot versionado de salida esperada; **drift** es la divergencia actual vs. golden.\n- **Doble (mock/fake/stub):** sustituto controlado de HTTP, DB o reloj.\n- **Flake:** prueba inestable (pasa o falla sin cambio de código).\n- **Fail-closed:** si el contrato se rompe, el batch se detiene con evidencia — no se “arregla” en silencio.",
        "Orden del módulo: **T1 Propiedades** (invariantes, generación, metamórficas) → **T2 Datos** (schema, quality, goldens) → **T3 Dobles** (mocks/fakes/reloj, contratos de borde) → **T4 Sistema/CI** (integración, encoding/cardinalidad/orden/timeout/reanudación, flakes). Fixture de laboratorio (una sola vez en este módulo): `CASO-LIM-028` (run_id=cpn3a-dataqa), contactos sintéticos `@example.pe` — sin PII real y sin autoveredicto de fraude o parentesco.",
        "Lo que ya sabes (S16 calidad + S27 pytest) y lo que es **nuevo aquí**: S16 fallaba cerrado ante schema roto; S27 fijó AAA, fixtures y oráculos. S28 añade **generación desde propiedades**, **goldens versionados con revisión**, **dobles en bordes HTTP/DB/reloj** e **integración multi-componente determinista**. ER solo decide *misma entidad* — nunca parentesco ni fraude.",
        "Caso de desk PE (banca, fintech o retail en Lima): un batch sintético de contactos entra al matcher en CI local. Un fallo de golden muestra expected vs. actual; un fallo de propiedad imprime la semilla y el input que rompió la invariante. Eso es evidencia revisable para el revisor humano, no un “True” mágico en pantalla ni una etiqueta de fraude.",
      ],
      callout: {
        type: "info",
        title: "Límite del resultado + ritmo (19 h)",
        content:
          "Las pruebas verifican identidad de registros y calidad técnica; no autorizan inferencias de relación o riesgo. Matching ≠ fraude. Ritmo sugerido: ~4–5 h T1 propiedades, ~4–5 h T2 schema/goldens, ~4 h T3 dobles, ~5–6 h T4 integración/CI + portfolio You Do (total ≈ 19 h).",
      },
    },
    {
      heading: "Invariantes y generación de casos",
      subtopicId: "S28-T1-A",
      paragraphs: [
        "Una **invariante** es una propiedad que **siempre** debe cumplirse en el dominio ER: `normalize` es **idempotente** (`f(f(x)) == f(x)`); scores en **[0, 1]**; ids no vacíos; pares canónicos `entity_a < entity_b`. Si se rompe, el matching deja de ser un contrato y se vuelve intuición.",
        "Genera casos **desde la invariante**, no desde un ejemplo feliz. Tres estrategias en este curso:\n\n1. **Tabla exhaustiva** pequeña: todos los bordes conocidos (vacío, solo espacios, tildes, scores 0/1/1.2).\n2. **Random acotado con seed fija:** reproducible en CI; imprime seed+input al fallar.\n3. **Hypothesis:** herramienta industrial — defines la propiedad, una *strategy* (estrategia de generación de inputs) produce casos, y al fallar hace *shrink* (reducción automática del contraejemplo) hasta el input mínimo que rompe la invariante.\n\nAquí practicas el pensamiento de (1)+(2) con `test_*` de pytest; Hypothesis es el siguiente paso industrial (recursos). Un solo caso “Ana López” no caza encoding, espacios dobles ni scores fuera de rango.",
        "Mapa mental Hypothesis (sin instalarlo aún): **propiedad** → **strategy** (qué generas) → **muchos ejemplos** → **shrink** (reducción del fallo mínimo). Tu análogo local: `assert` en un bucle con `random.seed` + imprimir el `s` que rompió. Documenta la invariante en **español** junto al test (`# invariante: normalize es idempotente`). Cuando falla un caso generado, imprime **seed + input + expected/actual** para que el bug sea reproducible al primer intento.",
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
        "**Simetría**: si el comparador es simétrico, `sim(a,b) == sim(b,a)`. Documenta excepciones (distancias dirigidas, embeddings con orden de query) en el nombre del test. No asumas simetría solo porque “se ve simétrico” en el happy path (el camino feliz donde todo entra limpio).",
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
          "Algunas distancias dirigidas no son simétricas; documenta la propiedad esperada en el nombre del test (`test_jaccard_is_symmetric` vs. `test_edit_distance_directed`).",
      },
    },
    {
      heading: "Contratos de schema y de calidad",
      subtopicId: "S28-T2-A",
      paragraphs: [
        "Un **contrato de schema** fija tipos, nullability y dominios (email con `@`, score en 0..1). Un **contrato de calidad** fija reglas de negocio (id único, cardinalidad de pares, encoding UTF-8 legible). En S16 ya viste fail-closed en ingest; aquí los conviertes en **asserts de regresión** que bloquean el merge si se rompen.",
        "Valida en el borde de ingest del ER: registros fuente rechazados no entran silenciosos. La implementación didáctica es una función `validate_record(r) -> list[str]` que devuelve errores legibles — no un booleano opaco. Fail-closed: si faltan columnas requeridas o el dtype rompe el contrato, el batch se detiene con reporte, no se “arregla” en silencio.",
        "Diferencia con S16: allí diseñaste políticas; aquí **escribes la suite** que las reejecuta en cada PR. Caso sintético: batch `@example.pe` con un id vacío y un score 1.5 — el validador debe listar ambos errores sin inventar parentesco ni fraude.",
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
    if score is not None:
        try:
            s = float(score)
        except (TypeError, ValueError):
            err.append("score no numérico")
        else:
            if not (0 <= s <= 1):
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
          "Mejor rechazar con error que contaminar el almacén ER (S29). Cuando construyas S29, reejecuta estos mismos validadores como regresión de schema del warehouse.",
      },
    },
    {
      heading: "Datasets golden, drift y reconciliación",
      subtopicId: "S28-T2-B",
      paragraphs: [
        "Un **golden** es un snapshot versionado de salida esperada (JSON/CSV sintético en el repo). Sirve de regresión del pipeline: mismos inputs sintéticos → misma estructura de pares (o de reporte de calidad). No es “la verdad del mundo real”; es el contrato de no-regresión del lab.",
        "**Drift**: la salida actual difiere del golden. Clasifica antes de actuar: (a) bug real del matcher, (b) cambio intencional de política, (c) ruido de orden/float. Un diff de golden debe mostrar expected vs. actual de forma legible — nunca un “pass” silencioso.",
        "**Reconciliación**: actualizar el golden solo con **revisión humana y nota de cambio** (`approved=True` + mensaje). Actualizar el golden sin aprobación en CI esconde regresiones de matching. Política: `blocked_drift` hasta que alguien firme el cambio de contrato.",
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
          "Actualizar el golden sin revisión esconde regresiones de matching. En desk PE: el PR que toca un golden debe explicar *por qué* cambió el contrato.",
      },
    },
    {
      heading: "Mocks, fakes y reloj inyectado",
      subtopicId: "S28-T3-A",
      paragraphs: [
        "**Mock**: verifica interacciones (qué se llamó, con qué argumentos). **Fake**: implementación liviana en memoria con estado real. **Stub**: respuestas fijas sin lógica. En QA del ER usas fakes de HTTP/DB y un reloj inyectable para que la suite no dependa de red ni de `datetime.now()`.",
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
        "Heurística al estilo *GOOS*: si la función es pura (`normalize`, Jaccard de tokens), **no la mockees**. Si habla con red o disco, fakea el borde y aserta el efecto. `casefold` (no solo `lower` en un lado) es el contrato de igualdad de texto del ER para Unicode.",
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
        "Una prueba de **integración** ejerce **2+ componentes reales** (app + sqlite, o servicio + fake HTTP + DB). **E2E** cubre el flujo punta a punta (`ingest → pares → review`) con datos sintéticos. **Testcontainers** (concepto de CI): DB efímera en contenedor con el mismo dialecto que producción; en este curso usamos sqlite `:memory:` o un archivo temporal como análogo local honesto.",
        "Mide lo que el tagline promete:\n\n- **Encoding:** tildes y formas NFC/NFD unificadas con `unicodedata.normalize`.\n- **Cardinalidad de pares:** `C(n,2)` o igualdad de nombre.\n- **Orden de paginación estable.**\n- **Timeout simulado:** reintento/abort con reloj fake, no `sleep` real.\n- **Reanudación:** checkpoint; no reprocesar ids ya hechos.",
        "Demo mínima: inserta dos entidades homónimas en sqlite, cuenta filas y el par candidato con `id_a < id_b`. Eso es integración real de schema + query, no un print de `True`. Cuando el almacén sea Postgres en S29, el mismo contrato de pares se reejecuta contra el dialecto real.",
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
        title: "Containers vs. memoria",
        content:
          "sqlite en memoria valida lógica de pares y schema; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29). Sé honesto en el reporte de evidencia: qué capa cubriste.",
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
      "Yo hago primero (I Do): ocho demos de invariantes con seed, pruebas metamórficas, contratos de schema/golden, fakes de reloj/HTTP e integración sqlite determinista. Corre cada demo en tu entorno local-python: la salida del curso debe coincidir con tu terminal. Observa el patrón propiedad → assert → evidencia (seed/input), no solo el print final.",
    steps: [
      {
        demoId: "S28-T1-A-DEMO",
        subtopicId: "S28-T1-A",
        environment: "local-python",
        description:
          "Función estilo pytest: con seed=1 genera 15 strings y aserta que normalize es idempotente (f(f(s))==f(s)).",
        preamble:
          "En el desk de QA del motor ER, un solo nombre feliz no caza encoding ni espacios dobles. Esta demo modela una función estilo pytest: con `seed=1` genera 15 strings y aserta que `norm` es idempotente (`f(f(s))==f(s)`). No escribas aún: predice por qué imprimir `seed` y `n` es evidencia útil cuando un assert falla en CI, y por qué una tautología tipo `len>=0` no cuenta como propiedad.",
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
        why: "La propiedad se genera desde la invariante, no desde un ejemplo feliz: seed fija + bucle + assert de idempotencia. En CI real, pytest descubre `test_*`; al fallar imprime seed e input para reproducir al primer intento. Evita tautologías tipo `len>=0`. En We Do practicarás resembrar por muestra, rango de scores e idempotencia con N casos generados.",
        retrospective:
          "Si puedes explicar por qué un solo literal no es pensamiento basado en propiedades, ya tienes el hábito de T1-A. El error clásico es hardcodear `True` o mirar un caso. En We Do practicarás seed reproducible, rango de scores e idempotencia con N casos.",
      },
      {
        demoId: "S28-T1-B-DEMO",
        subtopicId: "S28-T1-B",
        environment: "local-python",
        description:
          "Comprueba simetría de Jaccard de tokens (casefold) y metamórfica de padding de espacios.",
        preamble:
          "No siempre conoces el score “correcto” absoluto del matcher, pero sí relaciones: simetría de Jaccard, padding que no cambia `normalize`. Esta demo imprime tres booleanos de propiedades. No escribas aún: predice por qué `j(\"a b\",\"b a\")` debe igualar el orden invertido y por qué rellenar espacios no debe mover el texto canónico.",
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
        why: "Propiedades sin oráculo absoluto de score aún fallan si hay asimetría accidental o normalización rota. Metamórfica no es igualdad casefold a secas: transformas el input y predices el movimiento de la salida. We Do: corregir j dirigido, relación under upper y simetría all-pairs.",
        retrospective:
          "Si puedes nombrar la *relación* que usas como oráculo, ya no dependes de un número mágico de score. El error clásico es confundir simetría con idempotencia (reordenar args ≠ componer `f` consigo misma). Pregunta: ¿qué nombre de test documentaría la simetría de Jaccard en pytest? We Do: j simétrico, metamórfica under upper y all-pairs.",
      },
      {
        demoId: "S28-T2-A-DEMO",
        subtopicId: "S28-T2-A",
        environment: "local-python",
        description: "Valida schema de tres registros sintéticos y cuenta errores de id/score.",
        preamble:
          "En el borde de ingest del ER, un registro sucio no entra en silencio: necesitas *qué* falló. Esta demo valida tres filas sintéticas y cuenta errores de id/score. No escribas aún: predice cuántos errores suma el batch y por qué la primera fila limpia imprime `ok_first True` sin inventar parentesco.",
        code: {
          language: "python",
          title: "schema_demo.py",
          code: `def val(r):
    e = []
    if not r.get("id"):
        e.append("id")
    sc = r.get("score")
    if sc is not None:
        try:
            s = float(sc)
        except (TypeError, ValueError):
            e.append("score")
        else:
            if not 0 <= s <= 1:
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
        why: "Contratos de calidad en ingest = fail-closed con lista de errores, no booleano opaco. El revisor ve `id`/`score` y detiene el batch con evidencia. We Do: contrato de id, polaridad de score y contador de dirty rows.",
        retrospective:
          "Lista de errores legible > `False` mudo: el revisor ve *qué* rompió el contrato y detiene el batch. El error clásico es “arreglar” filas en silencio o devolver un booleano opaco. Pregunta: ¿qué dos etiquetas esperas en la fila sucia del demo? We Do: id requerido, polaridad de score y contador de dirty rows.",
      },
      {
        demoId: "S28-T2-B-DEMO",
        subtopicId: "S28-T2-B",
        environment: "local-python",
        description:
          "Detecta drift de golden de pares y bloquea reconcile sin aprobación.",
        preamble:
          "Un golden es el snapshot versionado de salida esperada del pipeline de pares. Si actualizas el golden sin mirar el diff, escondes regresiones de matching. Esta demo compara golden vs. current y devuelve `blocked` ante drift. Observa: no hay “pass” silencioso cuando `n` cambia de 2 a 3.",
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
        why: "Drift visible y bloqueado > golden actualizado en silencio. El PR del desk PE debe explicar *por qué* cambió el contrato de pares; un job verde sin diff legible esconde matching roto. We Do: etiqueta `drift`, `blocked` sin approved y par versión+acción como evidencia de revisión.",
        retrospective:
          "Si el golden se reescribe solo, la suite deja de proteger el matching: el contrato se mueve con el bug. El error clásico es “actualizar snapshot para poner CI en verde”. Pregunta: ¿quién debe firmar un cambio de golden? We Do: `drift`, `blocked` sin aprobación y versión+acción.",
      },
      {
        demoId: "S28-T3-A-DEMO",
        subtopicId: "S28-T3-A",
        environment: "local-python",
        description:
          "Fake HTTP + reloj fijo devuelven JSON y timestamp deterministas en ISO.",
        preamble:
          "La suite del ER no debe depender de red ni de `datetime.now()`. Esta demo usa un fake HTTP y un reloj fijo: JSON `ok` y fecha ISO corta. No escribas aún: predice por qué `.date().isoformat()` es el oráculo del contrato y no `str(datetime)`.",
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
        why: "Dobles controlados eliminan red y tiempo real de la suite: el oráculo es JSON `ok` y fecha ISO corta, no el wall clock. En código de producción inyecta clock/http al constructor; no parchees globales. We Do: fake DB por id, ISO corta y política retry ante 5xx/timeout sin `sleep`.",
        retrospective:
          "Fakes rápidos y deterministas son el corazón de T3. El error clásico es parchear `datetime.now` global o imprimir el datetime crudo como contrato. Pregunta: ¿por qué `.date().isoformat()` es más estable en asserts que `str(d)`? We Do: lectura del borde, fecha ISO y retry.",
      },
      {
        demoId: "S28-T3-B-DEMO",
        subtopicId: "S28-T3-B",
        environment: "local-python",
        description:
          "Contrato de borde sobre match real (casefold) vs. overmock que oculta bug.",
        preamble:
          "Si mockeas el comparador y solo asertas que “se llamó”, no pruebas matching: ocultas bugs con un `True` mágico. Esta demo contrasta igualdad casefold real con un overmock que acepta pares distintos. Observa `overmock_false_pos True` — eso es un falso positivo de la suite.",
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
        why: "No mockees lógica pura barata; prefiere contratos de borde (input → output/efecto). El overmock marca True en pares distintos y engaña al desk. We Do: casefold bilateral, detector `weak` y efecto de estado del writer.",
        retrospective:
          "Preferir lógica real bajo prueba cuando es pura y barata: mockear el comparador esconde bugs con un `True` mágico. El error clásico es asertar “se llamó” en vez de “el par distinto no matchea”. Pregunta: ¿qué prueba el flag `overmock_false_pos` al desk? We Do: casefold bilateral, detector `weak` y filas escritas como oráculo.",
      },
      {
        demoId: "S28-T4-A-DEMO",
        subtopicId: "S28-T4-A",
        environment: "local-python",
        description:
          "Integración sqlite en memoria: inserta dos entidades homónimas y cuenta el par candidato (id_a < id_b).",
        preamble:
          "Una prueba de integración del ER ejerce schema + query reales, no un `print(True)`. Esta demo inserta dos entidades “Ana” en sqlite `:memory:` y materializa el par candidato con `id_a < id_b`. Observa: `pairs [('1','2')]` sale del join, no de un hardcode.",
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
        why: "Integración mínima del pipeline de candidatos: schema + join real, no un booleano teatral. sqlite `:memory:` es análogo honesto a testcontainers (S29 Postgres); el par sale del motor. We Do: SELECT COUNT, cardinalidad C(n,2) y reanudación+NFC de tildes Latam.",
        retrospective:
          "Si el par no sale del motor, no es integración: hardcodear `pairs` esconde un JOIN roto. El error clásico es “el test pasó porque imprimí lo esperado”. Pregunta: ¿por qué `id_a < id_b` evita autopares y dobles? We Do: COUNT, C(n,2) y pending con encoding Unicode.",
      },
      {
        demoId: "S28-T4-B-DEMO",
        subtopicId: "S28-T4-B",
        environment: "local-python",
        description:
          "Orden estable + seed: dos corridas CI producen la misma lista y el mismo random.",
        preamble:
          "Un flake pasa o falla sin cambio de código: random sin seed, reloj real, orden de sets. Esta demo fija seed y ordena: dos corridas CI producen la misma lista. Observa el `True` de igualdad entre corridas — eso es requisito del gate de merge, no un lujo.",
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
        why: "Determinismo es requisito de la suite que bloquea merge: seed + sorted. Retry sin root-cause no es fix. We Do: sorted de ids, fail_job por flake_rate y `run(seed)` que resiembra.",
        retrospective:
          "Si dos corridas con la misma seed divergen, el diseño es incorrecto — no “mala suerte de CI”. El error clásico es subir retries sin root-cause y llamar a eso un fix. Pregunta: ¿qué tres controles (seed, reloj, sort) fijarías antes del gate de merge? We Do: sorted de ids, fail_job por flake_rate y `run(seed)` que resiembra.",
      },
    ],
  },
  weDo: {
    intro:
      "24 ejercicios guiados → independientes → transferencia (8 subtemas × 3). Cada starter trae un comentario `# DEFECT:` que marca el bug a corregir (mismo patrón de caza de fallas que en S27). Corrígelo y deja **solo** las líneas de salida del oráculo (mismas que la solución). Datos sintéticos; no etiquetes fraude ni parentesco. Tiempo sugerido: ~25–40 min por subtema en bloque We Do.",
    steps: [
      {
        id: "S28-T1-A-E1",
        subtopicId: "S28-T1-A",
        kind: "guided",
        title: "Resembrar seed antes de cada muestra",
        preamble:
          "- **Contexto:** en CI del matcher, dos “mismas” muestras con seed distinta son un flake disfrazado de dato.\n- **Meta:** con `seed=0` **antes de cada** `random.random()`, obtener el mismo valor dos veces.\n- **Éxito:** una sola línea booleana `True`.\n- **Límites:** no compares floats a mano; no dejes el PRNG avanzar sin resembrar; sin PII real.",
        instruction:
          "1. Abre el starter: `seed(0)` solo una vez; `a` y `b` divergen.\n2. Llama `random.seed(0)` otra vez antes de `b`.\n3. Imprime solo `a == b`.\n4. No hardcodees `True`.",
        hint: "Vuelve a llamar random.seed(0) antes de b",
        hints: [
          "Vuelve a llamar random.seed(0) antes de b",
          "Sin resembrar, el segundo random avanza el generador pseudoaleatorio (PRNG) y a!=b",
        ],
        edgeCases: ["sin seed no es CI-safe"],
        tests: "Una línea booleana: True solo si a y b se regeneran con la misma seed.",
        feedback:
          "Sin resembrar, el generador avanza: el segundo `random` no es la misma muestra. Sembrar antes de cada muestra = reproducible en CI del ER; sin eso el gate de merge miente.",
        retrospective:
          "Resembrar por muestra es el hábito mínimo de determinismo. El error clásico es sembrar una vez y asumir que dos lecturas son “la misma”. Siguiente (E2): medir la invariante de scores del batch, no inventar `True`.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: falta volver a sembrar la seed antes de b
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
        title: "Invariante de scores en [0, 1]",
        preamble:
          "- **Contexto:** un score 1.2 en el batch de matching no es “casi 1”: rompe el dominio del contrato y puede contaminar el ranking.\n- **Meta:** con `scores = [0, 0.5, 1.2]`, calcular si **todos** están en [0, 1].\n- **Éxito:** imprime exactamente `False` (el 1.2 falla).\n- **Límites:** usa `all(...)`; no hardcodees `True`; 0 y 1 sí son válidos.",
        instruction:
          "1. Revisa el starter: imprime `True` sin mirar los datos.\n2. Escribe `all(0 <= s <= 1 for s in scores)`.\n3. Imprime solo el booleano.\n4. No mutes la lista.",
        hint: "Usa all(...) sobre el rango inclusivo; 1.2 está fuera",
        hints: [
          "Usa all(...) sobre el rango inclusivo",
          "0 y 1 son válidos; 1.2 no — el hardcode True esconde el fallo",
        ],
        edgeCases: ["NaN no es válido en suites reales"],
        tests: "Una línea: False porque 1.2 rompe el contrato [0, 1]",
        feedback:
          "Hardcodear True oculta el score 1.2. La invariante se mide con all(...) sobre los datos del batch, no con un booleano de teatro que pone verde al merge.",
        retrospective:
          "El dominio [0, 1] se **mide** sobre el batch; un `True` de teatro pone verde al merge con basura en el ranking. El error clásico es “el test ya pasaba, no toqué los datos”. Pregunta: ¿qué reportarías al revisor si el único fallo es 1.2? Luego (E3) generas N inputs con seed y asertas idempotencia de `normalize`.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: hardcodea True sin validar el batch (hay un score fuera de rango)
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
        title: "test_normalize_idempotent con seed y N casos",
        preamble:
          "- **Contexto:** en la suite del ER, la propiedad de `normalize` debe resistir un batch generado, no un solo “Ana”.\n- **Meta:** escribir `test_normalize_idempotent` con seed=42, 10 strings del alfabeto `'a bÁé'` y assert `f(f(s))==f(s)`.\n- **Éxito:** dos líneas: `idempotent_ok True` y `n_cases 10`.\n- **Límites:** no dejes `n_cases=1`; no hardcodees sin bucle; datos sintéticos.",
        instruction:
          "1. Lee el DEFECT: un literal y `return 1`.\n2. Dentro del test: `random.seed(42)`; genera 10 strings; assert de idempotencia.\n3. Devuelve `n_cases` real.\n4. Imprime `idempotent_ok True` y `n_cases` con el valor devuelto.",
        hint: "Función test_* con assert; bucle seed; al final resume con print",
        hints: [
          "def test_normalize_idempotent(): random.seed(42); for … assert once == normalize(once)",
          "normalize = ' '.join(s.casefold().split()); n_cases fijo en 10",
        ],
        edgeCases: ["string vacío; solo espacios; tildes; assert falla → bug real"],
        tests: "Dos líneas: idempotent_ok True y n_cases 10 tras asserts del batch",
        feedback:
          "Una propiedad real genera muchos inputs (seed + bucle) y aserta `f(f(x))==f(x)`. Un solo literal no es pensamiento basado en propiedades; al fallar, imprime seed e input.",
        retrospective:
          "Property-based thinking = invariante + generación + assert, no un caso “Ana”. El error clásico es devolver `n_cases=1` o hardcodear el print final. Pregunta: al fallar un assert, ¿qué tres datos (seed, input, expected/actual) harían reproducible el bug al primer intento? Ese hábito alimenta el You Do `test_normalize_idempotent`.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: no genera casos ni comprueba f(f(x))==f(x); hardcodea n_cases=1
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
        title: "Jaccard simétrico con unión en el denominador",
        preamble:
          "- **Contexto:** en el matcher de tokens del ER, un score dirigido rompe la expectativa `sim(a,b)==sim(b,a)` y confunde al revisor.\n- **Meta:** corregir `j` a Jaccard simétrico (casefold, unión en el denominador).\n- **Éxito:** una línea `True` para `j(a,b)==j(b,a)` con a=`'ana pe xx'`, b=`'pe ana'`.\n- **Límites:** no dividas solo por `len(ta)`; unión vacía → 1.0; no etiquetes fraude.",
        instruction:
          "1. Abre el starter: divide por `len(ta)` (dirigido).\n2. Cambia a `len(ta & tb) / len(ta | tb)` (y empty→1.0).\n3. Imprime `j(a,b) == j(b,a)`.\n4. No hardcodees `True`.",
        hint: "Jaccard simétrico: len(ta & tb) / len(ta | tb); no dividas solo por len(ta)",
        hints: [
          "casefold + split en ambos lados; unión vacía → 1.0",
          "Un score dirigido (solo len(ta)) rompe simetría — cámbialo a |∪|",
        ],
        edgeCases: ["distancias dirigidas no son simétricas — aquí Jaccard sí"],
        tests: "Una línea True: j(a,b)==j(b,a) con Jaccard |∩|/|∪|",
        feedback:
          "Dividir solo por `len(ta)` es score dirigido: `j(a,b)≠j(b,a)`. Jaccard simétrico usa la unión; el revisor del matcher espera simetría documentada en el nombre del test, no un número mágico de score.",
        retrospective:
          "Un score dirigido rompe la expectativa del revisor (`sim(a,b)==sim(b,a)`) aunque el happy path “se vea bien”. Jaccard canónico usa |∩|/|∪|; empty→1.0. Pregunta: ¿cómo documentarías una distancia *dirigida* para que nadie asuma simetría? Siguiente (E2): metamórfica — transformar el input y predecir la relación.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: j dirigido (divide por len(ta)) → no es simétrico
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
        title: "Metamórfica: upper no rompe eq casefold",
        preamble:
          "- **Contexto:** si tu igualdad de texto es casefold, pasar `x` a mayúsculas no debe cambiar el veredicto de match.\n- **Meta:** con `eq` casefold, verificar que `eq(x,y) == eq(x.upper(), y)` para x=`'Ana'`, y=`'ana'`.\n- **Éxito:** una línea `True`.\n- **Límites:** no uses `==` crudo; no hardcodees; la transformación es el punto pedagógico.",
        instruction:
          "1. Revisa el starter: imprime `x == y` (False y no es metamórfica).\n2. Define `eq` con `casefold` en ambos lados.\n3. Imprime `eq(x,y) == eq(x.upper(), y)`.\n4. No alteres x/y.",
        hint: "eq = lambda u,v: u.casefold()==v.casefold(); compara eq(x,y) con eq(x.upper(), y)",
        hints: [
          "eq = lambda u,v: u.casefold()==v.casefold()",
          "La relación: eq(x,y) == eq(x.upper(), y)",
        ],
        edgeCases: ["upper no es la única transformación; padding es otra metamórfica"],
        tests: "Una línea True: eq(x,y) == eq(x.upper(), y) bajo igualdad casefold",
        feedback:
          "Metamórfica ≠ casefold equality a secas: transformas el input (upper) y predices que la relación de igualdad se conserva — oráculo sin score mágico.",
        retrospective:
          "Metamórfica = transformar el input y predecir cómo se mueve la salida. No es “casefold equality” a secas. Luego (E3): simetría all-pairs, sin mezclar con idempotencia.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: igualdad case-sensitive; no es relación metamórfica
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
        title: "Simetría all-pairs de eq casefold",
        preamble:
          "- **Contexto:** el revisor de la suite espera que `eq` sea simétrica en *todos* los pares del lote, incluidos negativos y vacíos.\n- **Meta:** con `eq` casefold, verificar `eq(a,b)==eq(b,a)` en tres pares.\n- **Éxito:** una línea `True`.\n- **Límites:** no mires solo el primer par; no inviertas la polaridad; simetría ≠ idempotencia (`f(f(x))`).",
        instruction:
          "1. Corrige el DEFECT: solo `pairs[0]` y `!=`.\n2. Usa `all(eq(a,b)==eq(b,a) for a,b in pairs)`.\n3. Imprime el booleano.\n4. Deja el par `('x','Y')` — sigue siendo simétrico bajo casefold.",
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
          "Simetría es reordenar args (`eq(a,b)==eq(b,a)`); idempotencia es `f(f(x))==f(x)`. Mezclar los nombres confunde al desk al leer el test y al revisar fallos en CI del matcher.",
        retrospective:
          "All-pairs evita el anti-patrón de mirar solo el happy path (`pairs[0]`). El error clásico es invertir `!=` “para que falle algo” o mezclar el nombre del test con `f(f(x))`. Pregunta: con el par `('x','Y')`, ¿por qué la simetría sigue siendo True bajo casefold? Documenta la propiedad en el nombre del test antes del You Do.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: solo un par + polaridad invertida (no es all-simetría)
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
        title: "id requerido en el borde de ingest",
        preamble:
          "- **Contexto:** un dict vacío en el batch de contactos sintéticos no puede pasar como “ok” al almacén ER.\n- **Meta:** si no hay `id` usable, imprimir `id requerido`; si no, `ok`.\n- **Éxito:** una línea `id requerido` con `r = {}`.\n- **Límites:** `not r.get('id')` cubre clave ausente y cadena vacía; no hardcodees `ok`.",
        instruction:
          "1. Abre el starter: siempre `ok`.\n2. Condiciona con `not r.get(\"id\")`.\n3. Imprime la etiqueta del contrato.\n4. No inventes un id.",
        hint: "not r.get('id') cubre clave ausente y cadena vacía",
        hints: [
          "not r.get('id') cubre clave ausente y cadena vacía",
          "r = {} debe fallar el contrato con 'id requerido'",
        ],
        edgeCases: ["id vacío vs None; fail-closed en ingest"],
        tests: "Una línea: id requerido cuando el dict no trae id usable",
        feedback:
          "Fail-closed en el borde: `r={}` no es ok. `not r.get('id')` cubre clave ausente y vacía — el batch se detiene con mensaje legible para el revisor.",
        retrospective:
          "En el borde de ingest, un dict vacío no es “casi válido”: sin `id` usable el almacén ER no recibe la fila. El mensaje `id requerido` es evidencia para el revisor, no un castigo cosmético. Pregunta: ¿`id=\"\"` y clave ausente deben fallar igual? Siguiente (E2): etiqueta de score fuera de [0,1].",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: imprime ok aunque r no tiene id
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
        title: "Etiqueta score fuera de [0, 1]",
        preamble:
          "- **Contexto:** score=1.2 en matching no es “casi perfecto”: está fuera del dominio y debe etiquetarse como error de calidad.\n- **Meta:** imprimir `score` si está fuera de [0,1]; si no, `ok`.\n- **Éxito:** una línea `score`.\n- **Límites:** 0 y 1 son válidos; no inviertas la polaridad; una línea.",
        instruction:
          "1. Revisa el starter: imprime `ok` cuando debería fallar.\n2. Invierte la lógica: error si `not (0 <= score <= 1)`.\n3. Imprime solo la etiqueta.\n4. No cambies el valor 1.2.",
        hint: "print('score' if not (0 <= score <= 1) else 'ok')",
        hints: [
          "print('score' if not (0 <= score <= 1) else 'ok')",
          "Límites inclusivos: 0 y 1 son válidos; 1.2 no",
        ],
        edgeCases: ["bounds inclusivos; NaN en suites reales"],
        tests: "Una línea: score (etiqueta de error) para 1.2 fuera de [0,1]",
        feedback:
          "Polaridad invertida es un bug silencioso de contratos: 1.2 debe etiquetarse `score`, no `ok`. El job se pone verde con basura si inviertes el bounds.",
        retrospective:
          "0 y 1 son válidos; 1.2 no es “casi perfecto”. Invertir el `if` es un bug silencioso de contratos: el gate se pone verde y el ranking se contamina. Pregunta: ¿por qué el éxito del ejercicio es la etiqueta `score` y no un booleano? Luego (E3): cuenta filas con al menos un error, no el tamaño del batch.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: polaridad invertida al validar bounds
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
        title: "Contar filas con errores de validate",
        preamble:
          "- **Contexto:** el reporte de ingest del desk no pregunta “¿cuántas filas llegaron?” sino “¿cuántas rompen el contrato?”.\n- **Meta:** con `validate` (id no vacío + score en [0,1]), contar filas con `len(errores)>0`.\n- **Éxito:** el entero `1` (solo la segunda fila falla).\n- **Límites:** no uses `len(rows)`; define `validate` con lista de errores; sin PII real.",
        instruction:
          "1. Lee el DEFECT: imprime 2 (todas las filas).\n2. Implementa `validate` → lista de errores.\n3. `sum(1 for r in rows if validate(r))`.\n4. Imprime solo el entero.",
        hint: "sum(1 for r in rows if validate(r))",
        hints: [
          "Define validate que devuelve lista de errores",
          "Cuenta filas con al menos un error",
        ],
        edgeCases: ["quality contract multi-campo"],
        tests: "Una línea entera: cuántas filas tienen al menos un error de validate",
        feedback:
          "`len(rows)` mide el batch; el contrato de calidad mide dirty rows (`len(errores)>0`). Aquí solo la segunda fila falla — métrica de calidad, no de volumen.",
        retrospective:
          "Volumen del batch ≠ calidad del batch: aquí solo la segunda fila rompe id/score. El error clásico es imprimir `2` porque “hay dos filas”. Pregunta: ¿por qué `validate` devuelve lista de errores y no un booleano opaco cuando el desk debe fallar cerrado? Ese contador alimenta el reporte de ingest del You Do.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: cuenta todas las filas en vez de las que fallan
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
        title: "Detectar drift golden vs current",
        preamble:
          "- **Contexto:** el primer paso de la regresión de matching es *ver* que el snapshot cambió.\n- **Meta:** si `golden != current`, imprimir `drift`; si no, `ok`.\n- **Éxito:** una línea `drift` con n=1 vs n=2.\n- **Límites:** compara dicts; no hardcodees `ok`; sin PII real.",
        instruction:
          "1. Abre el starter: siempre `ok`.\n2. Condiciona con `golden != current`.\n3. Imprime `drift` u `ok`.\n4. No mutes los dicts.",
        hint: "Compara dicts con !=",
        hints: [
          "Compara dicts con != (en prod: JSON canónico ordenado)",
          "golden={'n':1}, current={'n':2} → drift",
        ],
        edgeCases: ["deep compare JSON canónico en prod"],
        tests: "Una línea: drift si golden != current",
        feedback:
          "Siempre imprimir `ok` esconde el diff del golden. Drift visible (expected vs. actual) es el primer paso de la regresión de matching en el desk.",
        retrospective:
          "Ver el diff es el primer paso de la regresión: sin etiqueta `drift`, el desk no sabe que el snapshot de pares cambió. El error clásico es hardcodear `ok` “porque el pipeline corrió”. Pregunta: ¿qué mostrarías en expected vs. actual en el log de CI? Siguiente (E2): reconciliar solo con revisión humana.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: ignora drift y siempre ok
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
        title: "Bloquear reconcile sin approved",
        preamble:
          "- **Contexto:** en el desk PE, actualizar el golden sin nota de cambio esconde un matching roto hasta producción de revisión.\n- **Meta:** si hay diff y `approved=False` → `blocked`; solo con aprobación o sin diff → `ok`.\n- **Éxito:** una línea `blocked`.\n- **Límites:** no digas `ok` con drift sin firma; no inventes `approved=True`.",
        instruction:
          "1. Revisa el starter: siempre `ok`.\n2. `blocked` si `diff and not approved`.\n3. Imprime solo la acción.\n4. No cambies los booleanos del fixture.",
        hint: "blocked si diff and not approved",
        hints: [
          "blocked si diff and not approved",
          "Review humana antes de actualizar el golden en el repo",
        ],
        edgeCases: ["review humana obligatoria; changelog en el PR"],
        tests: "Una línea: blocked si hay diff y approved=False",
        feedback:
          "Reconciliar sin aprobación actualiza el contrato en silencio y esconde regresiones. `blocked` fuerza revisión humana antes de tocar el golden del matching.",
        retrospective:
          "`blocked_drift` fuerza revisión antes de tocar el contrato. Reconciliar en silencio no es velocidad: es regresión oculta. Luego (E3): versión del meta + acción en dos líneas de evidencia.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: ok aunque hay diff y no approved
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
        title: "Versión del golden y acción blocked",
        preamble:
          "- **Contexto:** el revisor del PR necesita la versión del golden y si el drift quedó bloqueado, no un `0` inventado.\n- **Meta:** leer `meta['golden_version']` y decidir `blocked` si hay diff sin aprobación.\n- **Éxito:** dos líneas: `3` y `blocked`.\n- **Límites:** no hardcodees 0/ok; lee el meta; no actualices el golden en el código.",
        instruction:
          "1. Corrige el DEFECT: imprime 0 y ok a mano.\n2. `diff = meta[\"golden\"] != current`.\n3. Imprime versión y acción.\n4. Deja `approved=False`.",
        hint: "Lee meta['golden_version']; acción = blocked si diff y not approved",
        hints: [
          "Lee meta['golden_version'] del dict",
          "No actualices el golden sin approved=True",
        ],
        edgeCases: ["changelog de versión en el PR"],
        tests: "Dos líneas: golden_version del meta y blocked sin aprobación.",
        feedback:
          "Versión del golden + acción de reconciliación son evidencia del PR del desk. Fijar 0/ok a mano no es el flujo de drift con revisión humana.",
        retrospective:
          "El revisor del PR necesita la versión del golden y la acción real, no un `0` inventado. El error clásico es “arreglar” el test imprimiendo lo esperado a mano. Pregunta: si `approved` pasara a True, ¿qué una línea de changelog pondrías en el PR? Eso es el flujo de reconcile del You Do.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: hardcodea versión 0 y ok pese a drift
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
        title: "Fake DB: leer name de e1",
        preamble:
          "- **Contexto:** un fake de DB es un dict con estado real; la clave incorrecta no prueba el borde de lectura del matcher.\n- **Meta:** implementar/usar `get_name` para la entidad `e1`.\n- **Éxito:** una línea `Ana`.\n- **Límites:** sin red ni sqlite aún; no busques `e2`; no mockees call-order.",
        instruction:
          "1. Abre el starter: llama con `\"e2\"`.\n2. Cambia a `\"e1\"`.\n3. Imprime el name devuelto.\n4. Deja el helper del borde.",
        hint: "db[entity_id]['name'] con entity_id='e1'",
        hints: [
          "def get_name(db, eid): return db[eid]['name']",
          "Clave incorrecta (e2) devuelve None — corrige el id a e1",
        ],
        edgeCases: ["missing key; fake con estado real no es mock de call-order"],
        tests: "Una línea: Ana (name de la entidad e1 en el fake DB)",
        feedback:
          "Un fake de DB es un dict con estado real: la clave incorrecta (`e2`) no prueba el borde del matcher. Lee `e1` vía el helper — sin mock de orden de llamadas.",
        retrospective:
          "Fake con estado real ≠ mock de orden de llamadas. Clave incorrecta no ejercita el contrato. Siguiente (E2): fecha ISO corta del reloj fake.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: busca e2 en vez de e1
db = {"e1": {"name": "Ana"}}

def get_name(store, entity_id):
    return store.get(entity_id, {}).get("name")

print(get_name(db, "e2"))
`,
        },
        solutionCode: {
          language: "python",
          title: "exercise.py",
          code: `db = {"e1": {"name": "Ana"}}

def get_name(store, entity_id):
    return store[entity_id]["name"]

print(get_name(db, "e1"))`,
          output: `Ana`,
        },
      },
      {
        id: "S28-T3-A-E2",
        subtopicId: "S28-T3-A",
        kind: "independent",
        title: "Fecha ISO corta con FakeClock",
        preamble:
          "- **Contexto:** el reporte del ER pide fecha corta `YYYY-MM-DD`, no el dump completo del datetime con hora y tz.\n- **Meta:** con `datetime(2026, 7, 20, 15, 30, tzinfo=timezone.utc)`, imprimir la fecha ISO corta.\n- **Éxito:** una línea `2026-07-20`.\n- **Límites:** usa `d.date().isoformat()`; no uses `str(d)`; timezone aware se mantiene en el objeto.",
        instruction:
          "1. Revisa el starter: `print(str(d))`.\n2. Cambia a `d.date().isoformat()`.\n3. Imprime solo la fecha.\n4. No reescribas el datetime a mano.",
        hint: "d.date().isoformat() — str(datetime) incluye hora y no es el contrato",
        hints: [
          "d.date().isoformat()",
          "str(datetime) no es fecha ISO corta del contrato ER",
        ],
        edgeCases: ["timezone aware en prod"],
        tests: "Una línea ISO corta: 2026-07-20 vía date().isoformat()",
        feedback:
          "`str(datetime)` incluye hora y tz; el contrato de fecha corta del ER es `d.date().isoformat()`. Oráculos distintos = asserts frágiles en CI.",
        retrospective:
          "`str(datetime)` no es el contrato de fecha corta. El oráculo del lab es ISO. Luego (E3): política de retry ante 5xx o timeout sin red real.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: str(datetime) no es fecha ISO corta
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
        title: "Retry por 5xx o timeout del fake HTTP",
        preamble:
          "- **Contexto:** el cliente del ER no debe marcar `ok` ante 503 o timeout largo: la política de borde es reintentar (sin `sleep` real en CI).\n- **Meta:** si `status >= 500` o `timeout_ms > 2000` → `retry`; si no, `ok`.\n- **Éxito:** una línea `retry` con 503 y 3000 ms.\n- **Límites:** no inviertas 5xx; no ignores timeout; sin red real.",
        instruction:
          "1. Corrige el DEFECT: polaridad 5xx invertida e ignora timeout.\n2. `retry` si `status >= 500 or timeout_ms > 2000`.\n3. Imprime solo la etiqueta.\n4. No uses `time.sleep`.",
        hint: "retry si status>=500 o timeout_ms>2000",
        hints: [
          "retry si status>=500 o timeout_ms>2000",
          "Polaridad: 503 no es ok",
        ],
        edgeCases: ["timeouts + 5xx"],
        tests: "Una línea: retry cuando 5xx o timeout_ms > 2000",
        feedback:
          "503 y timeout largo piden `retry`, no `ok`. El fake modela la política de borde sin sockets ni `sleep` — un sleep real en CI es flake en potencia.",
        retrospective:
          "La política de borde se prueba con un fake: sin sockets y sin `time.sleep`. El error clásico es marcar `ok` ante 503 o ignorar timeout “porque a veces responde”. Pregunta: ¿por qué un `sleep` real en CI es un flake en potencia aunque “arregle” un caso local? Ese hábito alimenta FakeHTTP del You Do.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: polaridad 5xx invertida e ignora timeout
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
        title: "casefold en ambos lados del match",
        preamble:
          "- **Contexto:** el contrato de igualdad de texto del ER usa `casefold` en **ambos** operandos; `lower` a un lado rompe el match.\n- **Meta:** comparar `'Ana'` y `'ANA'` con casefold bilateral.\n- **Éxito:** una línea `True`.\n- **Límites:** no uses lower solo a un lado; no overmockees el comparador; una línea.",
        instruction:
          "1. Abre el starter: `\"Ana\".lower() == \"ANA\"` (False).\n2. Aplica `casefold()` a ambos.\n3. Imprime el booleano.\n4. No hardcodees `True`.",
        hint: "casefold() en ambos operandos",
        hints: [
          "casefold() en ambos operandos",
          "lower solo a un lado es contrato asimétrico roto",
        ],
        edgeCases: ["no overmock del comparador; casefold > lower para Unicode"],
        tests: "Una línea True: casefold en ambos lados del comparador",
        feedback:
          "`lower` solo a un lado rompe el contrato (`'ana'=='ANA'` es False). casefold en ambos lados es el borde de igualdad de texto del ER — sin overmock del comparador.",
        retrospective:
          "Contrato asimétrico (`lower` a un lado) es un bug de borde. casefold ambos lados es el hábito del ER. Siguiente (E2): detectar cuando el doble acepta cualquier par.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: lower solo un lado → 'ana' == 'ANA' es False
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
        title: "Detectar overmock débil (weak)",
        preamble:
          "- **Contexto:** si el “matcher” de la suite acepta `('x','y')` y `('1','2')`, no estás probando matching: estás midiendo un lambda.\n- **Meta:** si `f` devuelve True en ambos pares distintos → `weak`; si no, `ok`.\n- **Éxito:** una línea `weak`.\n- **Límites:** no imprimas `ok` por defecto; usa la heurística de pares negativos.",
        instruction:
          "1. Revisa el starter: imprime `ok` sin mirar `f`.\n2. `weak` si `f(\"x\",\"y\") and f(\"1\",\"2\")`.\n3. Imprime solo la etiqueta.\n4. Deja el lambda que siempre True (es el sujeto del test).",
        hint: "weak si f('x','y') and f('1','2')",
        hints: [
          "weak si f('x','y') and f('1','2')",
          "Un matcher real no acepta cualquier par",
        ],
        edgeCases: ["tests de borde con negativos"],
        tests: "Una línea: weak si el doble acepta cualquier par distinto",
        feedback:
          "Si `f('x','y')` y `f('1','2')` son True, el matcher es un overmock débil. Detectarlo es parte del contrato de borde: la suite no debe autoengañarse.",
        retrospective:
          "Detectar overmock es parte del contrato de borde. Un matcher real no acepta cualquier par. Luego (E3): aserta efecto de estado (filas + name), no orden de métodos.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: no marca weak cuando f acepta cualquier par
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
        title: "Efecto de estado, no orden de calls",
        preamble:
          "- **Contexto:** el revisor de la suite prefiere “¿se escribió la fila?” a “¿se llamaron tres métodos en este orden?”.\n- **Meta:** tras un insert sintético, imprimir `rows_written` real y el name escrito.\n- **Éxito:** dos líneas: `1` y `Ana`.\n- **Límites:** no inventes métricas de `calls`; lee `result` y `store`; sin red.",
        instruction:
          "1. Corrige el DEFECT: 0 y `\"calls\"`.\n2. Imprime `result[\"rows_written\"]`.\n3. Imprime `store[-1][\"name\"]`.\n4. No mockees el orden de métodos internos.",
        hint: "result['rows_written'] y store[-1]['name'] (o result de un get)",
        hints: [
          "Efecto observable: filas en el store + campo name",
          "No hace falta mockear el orden de métodos — eso es sobre-mocking",
        ],
        edgeCases: ["no asserts de call order; estado del fake es el oráculo"],
        tests: "Dos líneas: rows_written y name escrito (efecto de estado)",
        feedback:
          "Contrato de borde = efecto observable (filas + name), no el orden de métodos internos. Sobre-mocking aserta `calls` y se rompe en refactors inocuos.",
        retrospective:
          "El oráculo del writer es el store, no el contador de métodos internos. Sobre-mocking se rompe en refactors inocuos y da falsa confianza. Pregunta: ¿cuándo sí haría falta un mock de interacción (HTTP de terceros) y cuándo basta el fake con estado? Lleva ese criterio al `test_doubles` del You Do.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: inventa métricas de calls en vez de leer el efecto
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
        title: "SELECT COUNT real en sqlite :memory:",
        preamble:
          "- **Contexto:** inventar la métrica de filas no prueba que el INSERT funcionó: es teatro de integración.\n- **Meta:** tras CREATE + INSERT, leer `COUNT(*)` del motor.\n- **Éxito:** el entero `1`.\n- **Límites:** no hardcodees 0; cuenta antes de close (`:memory:` se pierde); una línea.",
        instruction:
          "1. Abre el starter: imprime 0.\n2. Ejecuta `select count(*) from t` y toma `fetchone()[0]`.\n3. Imprime el entero.\n4. No cierres antes de contar.",
        hint: "c.execute('select count(*) from t').fetchone()[0]",
        hints: [
          "c.execute('select count(*) from t').fetchone()[0]",
          ":memory: se pierde al close — cuenta antes de cerrar",
        ],
        edgeCases: [":memory: se pierde al close; no hardcodear métricas de integración"],
        tests: "Una línea: 1 (COUNT(*) real tras INSERT en sqlite :memory:)",
        feedback:
          "Integración honesta lee el motor (`SELECT COUNT`), no hardcodea 0. `:memory:` se pierde al close — cuenta antes de cerrar o el assert miente.",
        retrospective:
          "Integración honesta lee el store con SQL, no inventa la métrica. Hardcodear `0` esconde un INSERT roto o un close prematuro de `:memory:`. Pregunta: ¿en qué momento del script debes contar para no perder la base en memoria? Siguiente (E2): cardinalidad de pares C(n,2).",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: no ejecuta SELECT y hardcodea 0
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
        title: "Cardinalidad C(n,2) de pares candidatos",
        preamble:
          "- **Contexto:** el join con `id_a < id_b` materializa pares no ordenados sin autopares; `n*n` infla el universo.\n- **Meta:** con n=4, calcular C(4,2)=n*(n-1)//2.\n- **Éxito:** una línea `6`.\n- **Límites:** no uses `n*n`; blocking en prod reduce pares, pero aquí mides la cota ingenua.",
        instruction:
          "1. Revisa el starter: `n * n` → 16.\n2. Cambia a `n * (n - 1) // 2`.\n3. Imprime solo el entero.\n4. No inventes un join sqlite aquí (eso fue E1).",
        hint: "n * (n - 1) // 2",
        hints: [
          "n * (n - 1) // 2",
          "Pares no ordenados: sin (i,i) y sin contar (i,j) y (j,i) dos veces",
        ],
        edgeCases: ["blocking reduce pares en prod; C(n,2) es cota superior ingenua"],
        tests: "Una línea: 6 = C(4,2) = n*(n-1)//2",
        feedback:
          "`n*n` incluye diagonal y dobles. Cardinalidad de pares candidatos no ordenados es `n*(n-1)//2` — el join con `id_a < id_b` lo materializa en integración.",
        retrospective:
          "El join con `id_a < id_b` materializa pares no ordenados; `n*n` infla el universo con diagonal y dobles. C(n,2) es la cota ingenua antes de blocking en prod. Pregunta: con n=4, ¿por qué 16 engaña al revisor de cardinalidad? Luego (E3): reanudación de ids + NFC de tildes Latam.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: usa n*n (incluye diagonal)
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
        title: "Reanudación y encoding NFC de tildes",
        preamble:
          "- **Contexto:** un batch reanudado no debe reprocesar ids en `done`; y tildes Latam en NFD deben unificarse a NFC antes de igualar nombres.\n- **Meta:** pendientes en orden original + `encoding_ok True` tras NFC.\n- **Éxito:** dos líneas: `['b', 'c']` y `encoding_ok True`.\n- **Límites:** no imprimas `items` completo; no compares NFD crudo con “María”; sin PII real.",
        instruction:
          "1. Corrige el DEFECT: imprime todos los items y compara NFD crudo.\n2. `pending = [i for i in items if i not in done]`.\n3. `unicodedata.normalize(\"NFC\", nfd) == \"María\"`.\n4. Imprime pending y `encoding_ok` con el booleano.",
        hint: "pending = [i for i in items if i not in done]; NFC unifica tildes precompuestas",
        hints: [
          "list comp filtrando done",
          "import unicodedata; normalize('NFC', nfd) == 'María'",
        ],
        edgeCases: ["timeout + resume; NFD vs NFC en fuentes Latam"],
        tests: "Dos líneas: pendientes ['b','c'] y encoding_ok True tras NFC",
        feedback:
          "Reanudación salta ids en `done`; NFC unifica NFD de tildes Latam. Reprocesar todo + comparar NFD crudo falla ambos contratos del tagline de la sección.",
        retrospective:
          "Un batch reanudado salta `done`; NFC unifica tildes Latam antes de igualar nombres. Reprocesar todo + comparar NFD crudo falla ambos contratos a la vez. Pregunta: ¿por qué encoding y reanudación aparecen juntos en el tagline de S28 (no solo en un test aislado)? Llévalos al `test_integration` del portfolio.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: reprocesa done e ignora normalización Unicode NFC
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
        title: "sorted antes de comparar con golden",
        preamble:
          "- **Contexto:** el orden de un set o de una lista de inserción no es contrato estable entre corridas de CI.\n- **Meta:** ordenar ids antes de comparar con un golden.\n- **Éxito:** una línea `['a', 'b']`.\n- **Límites:** usa `sorted`; no imprimas la lista cruda; una línea.",
        instruction:
          "1. Abre el starter: imprime `[\"b\",\"a\"]`.\n2. Aplica `sorted(...)`.\n3. Imprime solo la lista ordenada.\n4. Cualquier expresión que imprima `['a', 'b']` es OK.",
        hint: "sorted(ids)",
        hints: [
          "sorted(ids) fija el orden antes del assert de golden",
          "El orden de un set no es estable entre corridas de Python/CI",
        ],
        edgeCases: ["set order no es estable; sort antes de serializar golden"],
        tests: "Una línea: ['a', 'b'] con sorted del batch",
        feedback:
          "Orden de sets/listas crudas es flake en CI. `sorted` fija el orden del batch antes de comparar goldens o reportes de pares del matching.",
        retrospective:
          "El orden de un set o de inserción no es contrato estable entre corridas. `sorted` fija el batch antes del assert de golden de pares. El error clásico es culpar a “Python no determinista” sin ordenar. Pregunta: ¿serializarías el golden con keys ordenadas en JSON? Siguiente (E2): política de merge con flake_rate > 0.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: no aplica sorted
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
        title: "fail_job si flake_rate > 0",
        preamble:
          "- **Contexto:** en la suite que bloquea merge del ER, cualquier flake_rate > 0 debe fallar el job; no “promediar a verde”.\n- **Meta:** con `flake_rate=0.01`, imprimir `fail_job` (si es 0, `ok`).\n- **Éxito:** una línea `fail_job`.\n- **Límites:** no inviertas la polaridad; no subas retries sin root-cause; cuarentena documentada ≠ ocultar.",
        instruction:
          "1. Revisa el starter: imprime `ok` cuando hay flakes.\n2. `fail_job` si `flake_rate > 0`.\n3. Imprime solo la etiqueta.\n4. No cambies 0.01 a 0 para “arreglar” el test.",
        hint: "fail_job si flake_rate > 0",
        hints: [
          "fail_job si flake_rate > 0",
          "Cuarentena documentada con ticket ≠ ocultar con retry 100",
        ],
        edgeCases: ["cuarentena documentada con ticket; no borrar el test molesto"],
        tests: "Una línea: fail_job si flake_rate > 0 en la suite de merge",
        feedback:
          "Cualquier `flake_rate > 0` debe fallar el job de merge del ER. Invertir polaridad o subir retries sin root-cause no es política de CI — enmascara el flake.",
        retrospective:
          "Invertir polaridad o subir retries sin causa no es política de CI. Luego (E3): `run(seed)` que resiembra y ordena para igualdad entre corridas.",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: polaridad invertida del gate
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
        title: "run(seed) determinista con sorted",
        preamble:
          "- **Contexto:** dos “mismas” corridas de CI deben producir el mismo batch; si no, el gate de merge es un flake.\n- **Meta:** `run(seed)` fija seed, genera 5 letras de `'abc'` y devuelve `sorted(...)`.\n- **Éxito:** dos líneas: `True` (`run(7)==run(7)`) y la lista ordenada de `run(7)`.\n- **Límites:** resiembra **dentro** de cada `run`; no dejes el PRNG avanzar entre llamadas; sin reloj real.",
        instruction:
          "1. Corrige el DEFECT: sin seed ni sorted.\n2. Dentro de `run`: `random.seed(seed)`; genera; `return sorted(...)`.\n3. Imprime igualdad de dos corridas y el resultado.\n4. No muevas el seed al módulo fuera de `run`.",
        hint: "Dentro de run: random.seed(seed); return sorted([...])",
        hints: [
          "Cada llamada a run debe resembrar la seed — si no, la 2.ª corrida diverge",
          "sorted garantiza orden estable del batch en CI",
        ],
        edgeCases: ["sin seed la igualdad entre corridas es flake"],
        tests: "Dos líneas: True (run(7)==run(7)) y la lista ordenada de run(7).",
        feedback:
          "Cada `run` debe resembrar la seed y ordenar. Sin `seed`+`sorted`, dos “mismas” corridas de CI divergen: eso es un flake del gate de merge.",
        retrospective:
          "Cada llamada a `run` debe resembrar *dentro* de la función y devolver orden estable; si no, el gate de merge es un flake disfrazado de test. El error clásico es sembrar una vez a nivel de módulo. Pregunta de cierre: ¿qué tres controles (seed, reloj, sort) documentarías en el README de la suite del You Do antes de pedir review?",
        starterCode: {
          language: "python",
          title: "exercise.py",
          code: `# DEFECT: no resiembra ni ordena → dos corridas divergen / orden inestable
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
      "Entrega una suite sintética que cace encoding, cardinalidad, orden, timeout/reanudación y drift de golden para el pipeline ER de CP-N3-A. Usa fixtures mínimas, fakes de reloj/HTTP y sqlite en memoria. Sin PII real; matching ≠ fraude. Extiende lo aprendido en S27 (pytest AAA/fixtures) con las capas de S28.\n\n**Criterios de aceptación (checklist de entrega):**\n1. `tests/test_properties.py` — al menos `test_normalize_idempotent` (seed + N≥20) y una metamórfica o simetría documentada en el nombre.\n2. `tests/test_schema_golden.py` — `validate_record` con lista de errores + golden con `blocked_drift` si `approved=False`.\n3. `tests/test_doubles.py` — FakeClock y/o FakeHTTP; timeout/reintento sin `sleep` real.\n4. `tests/test_integration.py` — sqlite `:memory:` con pares `id_a < id_b` + NFC en un nombre con tilde.\n5. README de la suite: seeds usadas, reloj, orden de pipeline (unit → property/data → integration), qué **no** prueba (fraude/parentesco).\n6. Cero flakes en la suite de merge: seed, sort, reloj inyectado.",
    objectives: [
      "Invariantes + generación con seed (idempotencia de normalize)",
      "Metamórficas/simetría de comparadores documentadas",
      "Contratos de schema/calidad y golden con reconciliación bloqueada sin aprobación",
      "Integración sqlite de candidatos + CI determinista (seed, sort, reloj)",
    ],
    requirements: [
      "Fixtures sintéticas mínimas (nombres/emails @example.pe, sin PII real)",
      "Al menos: (1) test de propiedad/idempotencia con seed, (2) validador de schema con lista de errores, (3) golden con drift bloqueado sin aprobación, (4) fake de reloj o HTTP, (5) integración sqlite de pares candidatos, (6) sort/seed documentados para CI",
      "Cero pruebas inestables (flakes) en la suite que bloquea merge: seed, reloj inyectado y orden estable",
      "Documentación en español profesional (es-PE): límites, evidencias, qué no prueba la suite",
      "Alineación QA ER del hilo CP-N3-A (solo misma entidad; sin etiquetas de fraude/parentesco)",
      "Nombres de test legibles: test_<componente>_<propiedad> (p. ej. test_jaccard_is_symmetric)",
    ],
    starterCode: `# Suite QA ER — esqueleto S28 (organiza en archivos al crecer)
# Layout requerido:
#   tests/test_properties.py   # idempotencia / metamórficas con seed
#   tests/test_schema_golden.py
#   tests/test_doubles.py      # FakeClock / FakeHTTP
#   tests/test_integration.py  # sqlite pares + encoding NFC
#   README_suite.md            # seeds, reloj, pipeline, límites
import random
import sqlite3
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
    if score is not None:
        try:
            s = float(score)
        except (TypeError, ValueError):
            err.append("score no numérico")
        else:
            if not (0 <= s <= 1):
                err.append("score fuera de [0,1]")
    return err

def test_normalize_idempotent(n_cases: int = 20) -> None:
    """Invariante: normalize es idempotente (compón con pytest en CI)."""
    random.seed(0)
    alphabet = "a bÁé"
    for _ in range(n_cases):
        s = "".join(random.choice(alphabet) for _ in range(random.randint(0, 10)))
        once = normalize(s)
        assert once == normalize(once), f"seed=0 input={s!r}"

def test_pad_metamorphic() -> None:
    """Metamórfica: padding de espacios no cambia normalize."""
    for s in ["María", "  a  b", ""]:
        assert normalize(s) == normalize("  " + s + "  ")

def reconcile(old, new, approved=False) -> str:
    if old == new:
        return "unchanged"
    return "updated" if approved else "blocked_drift"

class FakeClock:
    def __init__(self, fixed: datetime):
        self.fixed = fixed
    def now(self) -> datetime:
        return self.fixed

def candidate_pairs(names: list[tuple[str, str]]) -> list[tuple[str, str]]:
    """Integración mínima: sqlite + pares por nombre igual (id_a < id_b)."""
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE e(id TEXT, name TEXT)")
    rows = [(i, unicodedata.normalize("NFC", n)) for i, n in names]
    con.executemany("INSERT INTO e VALUES (?,?)", rows)
    pairs = con.execute(
        "SELECT a.id, b.id FROM e a JOIN e b "
        "ON a.id < b.id AND a.name = b.name"
    ).fetchall()
    con.close()
    return pairs

# Completa y reparte en los 4 archivos de tests + README_suite.md:
# - golden con drift bloqueado (approved=False)
# - FakeHTTP + política retry/timeout
# - assert de encoding NFC en un nombre NFD
# - sorted + seed documentados; pipeline unit → property → integration

if __name__ == "__main__":
    test_normalize_idempotent()
    test_pad_metamorphic()
    assert validate_record({"id": "", "score": 1.5}) != []
    assert reconcile({"n": 1}, {"n": 2}, approved=False) == "blocked_drift"
    clock = FakeClock(datetime(2026, 7, 20, tzinfo=timezone.utc))
    assert clock.now().date().isoformat() == "2026-07-20"
    # NFD de "María" (a + combining acute) → NFC unifica tildes Latam
    nfd = "Mari\u0301a"
    assert unicodedata.normalize("NFC", nfd) == "María"
    pairs = candidate_pairs([("1", "Ana"), ("2", "Ana")])
    assert pairs == [("1", "2")]
    print("qa_starter_ok")
`,
    portfolioNote:
      "Suite de QA para CP-N3-A: propiedades, contratos de datos e integración determinista. Documenta límites y evidencia en README_suite.md; no uses PII real ni autoetiquetes fraude o parentesco.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con seed + assert (idempotencia u otra) y qué imprimirías al fallar? (2) ¿por qué un golden con `blocked_drift` sin aprobación protege mejor al desk que un job siempre verde? (3) En el README, una frase de impacto medible (p. ej. “cero flakes en gate / drift visible”) y una línea de **límite** (matching ≠ fraude/parentesco; sin PII real). Defensa en 30 segundos: propiedades → schema/golden → dobles → integración sqlite → determinismo.",
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
        options: ["Que la salida sea siempre un número mágico fijo sin mirar el input", "Que dos ejecuciones con reloj real coincidan siempre en el timestamp", "Que el score de matching autorice una etiqueta de fraude", "Relaciones predecibles entre entradas transformadas y salidas"],
        correctIndex: 3,
        explanation:
          "Una prueba metamórfica relaciona salidas bajo transformaciones conocidas (p. ej. padding no cambia normalize; upper no debe romper igualdad casefold) cuando no hay un oráculo absoluto del score “correcto”.",
      },
      {
        question: "Actualizar un golden con drift sin revisión es:",
        options: ["Buena práctica de velocidad en CI porque el job vuelve a verde", "Riesgo de ocultar regresiones de matching al reescribir el contrato", "Obligatorio en cada merge del matcher", "Irrelevante si el job es verde a veces en la semana"],
        correctIndex: 1,
        explanation:
          "La reconciliación debe ser aprobada por un humano con nota de cambio: sin revisión, el golden deja de proteger el contrato y esconde bugs de matching.",
      },
      {
        question: "Sobre-mocking típico en el matcher:",
        options: ["Probar lógica pura real de normalize/comparador en el contrato de borde", "Usar sqlite en memoria para materializar pares candidatos", "Acoplar el test a detalles internos y ocultar bugs con dobles que siempre pasan", "Fijar seed en generadores de casos de propiedad"],
        correctIndex: 2,
        explanation:
          "Mockea solo I/O externo (HTTP/DB/reloj); deja el corazón del matching real bajo prueba cuando es puro y barato. Un lambda que siempre devuelve True es un overmock débil.",
      },
      {
        question: "Flakes en la suite que bloquea merge del ER se manejan:",
        options: ["Con determinismo (seed/reloj/sort) y fallo de job si persisten", "Ignorándolos si el promedio del día es verde", "Subiendo reintentos a 100 sin root-cause", "Borrando el test que molesta al pipeline"],
        correctIndex: 0,
        explanation:
          "Un CI determinista es el resultado de S28: seed fija, reloj inyectado, orden estable. Reintentar sin root-cause o borrar el test no es fix; la cuarentena documentada es el último recurso.",
      },
      {
        question: "En integración local del ER, sqlite en memoria sirve sobre todo para…",
        options: ["Reemplazar por completo a Postgres en producción", "Generar PII real de contactos bancarios para el golden", "Evitar documentar encoding NFC/NFD porque “ya funciona en laptop”", "Validar schema, joins de candidatos y cardinalidad sin red ni contenedor"],
        correctIndex: 3,
        explanation:
          "Es análogo honesto a testcontainers: prueba lógica de pares y schema en CI local; el dialecto real se re-valida cuando el almacén (S29) sea Postgres. No genera PII ni sustituye producción.",
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
