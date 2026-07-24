import type { CourseSection } from '../../types'

export const section27: CourseSection = {
  id: "async-concurrency",
  index: 27,
  title: "Estrategia de pruebas con pytest",
  shortTitle: "Pytest y contratos",
  tagline: "convertir supuestos de normalización y matching en contratos ejecutables; cada bug reproducido obtiene test de regresión",
  estimatedHours: 19,
  level: "Competente",
  phase: 2,
  icon: "FlaskConical",
  accentColor: "bg-gradient-to-br from-violet-500 to-purple-700",
  jobRelevance:
    "Un motor de **entity resolution** solo es confiable si normalización y matching son **contratos ejecutables** con pytest. En esta sección inicias CP-N3-A: priorizas pruebas por riesgo y capa (unit/contract/integration), escribes tests AAA con oráculos fijos, aíslas datos con fixtures y demuestras con mutación conceptual que la suite realmente protege el contrato—sin etiquetar fraude ni parentesco.",
  learningOutcomes: [
    { text: "Priorizar pruebas según riesgo y pirámide" },
    { text: "Escribir tests AAA con oráculos confiables" },
    { text: "Usar discovery y assertions de pytest" },
    { text: "Aislar estado con fixtures y scopes" },
    { text: "Cubrir excepciones, floats, fechas y tmp files" },
    { text: "Diseñar casos negativos con mensajes útiles" },
    { text: "Medir cobertura por rama y riesgo" },
    { text: "Interpretar mutación conceptual y fallas útiles" },
  ],
  theory: [
    {
      heading: "Estrategia pytest e inicio CP-N3-A",
      paragraphs: [
        "En S26 orquestaste el VP con evidencia por estado (RPA + analista). Ese pipeline **asume** que `normalize_name` y el matching se comportan igual mañana que hoy. Aquí **inicias CP-N3-A**: conviertes esos supuestos en **contratos de prueba** con pytest, para que un refactor o un typo no rompa en silencio lo que ya automatizaste.",
        "Trabajamos un módulo sintético sobre contactos fakes del caso **`CASO-LIM-027`** (run_id=`cpn3a-01`, correos `@example.pe`): sin PII real y **sin** auto-veredicto de fraude o parentesco. Cada bug reproducido debe dejar un test de regresión con oráculo fijo. Matching solo responde: ¿son la misma entidad sintética tras normalizar?",
        "Orden: **T1 Diseño** (pirámide, riesgo, AAA y oráculos) → **T2 Pytest** (discovery, asserts, fixtures y scopes) → **T3 Bordes** (excepciones, floats, fechas, tmp, negativos) → **T4 Cobertura** (ramas de negocio y mutación conceptual). En tu máquina: `python -m pytest -q`; en este entorno del curso ejecutamos el **mismo contrato** como módulo con `assert` + `print` cuando no invocas el CLI.",
      ],
      callout: {
        type: "info",
        title: "Datos seguros (vale para toda la sección)",
        content:
          "Fixtures y ejercicios usan solo contactos sintéticos. Una prueba de similitud **no** etiqueta fraude ni parentesco. No repitas esa ética en cada párrafo: ya quedó fijada aquí.",
      },
    },
    {
      heading: "Riesgos y pirámide de pruebas",
      subtopicId: "S27-T1-A",
      paragraphs: [
        "La **pirámide** prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E. El **riesgo** reordena el tiempo: un bug en matching de entidades justifica más tests que un typo de log o un cambio de color en la UI de revisión.",
        "Clasifica riesgo por **impacto** (datos incorrectos, regresión silenciosa en el clerical queue) y **probabilidad**. En entity resolution, normalización y comparadores son capa de alto riesgo: si fallan, el resto del pipeline hereda basura con confianza falsa.",
        "No inviertas la pirámide: una batería de E2E lentas no sustituye contratos unitarios de `strip`/`casefold`. Heurística práctica: score = impacto × probabilidad; ordena áreas y reparte más casos a las de mayor score. Ejemplo sintético: `normalize_name` (5×4=20) > `exact_match` (5×3=15) > repo SQL > cola UI. Regla de bolsillo: score ≥ 15 → ≥ 5 tests de contrato; 8–14 → 2–3; < 8 → smoke + un negativo.",
      ],
      code: {
        language: 'python',
        title: "risk_pyramid.py",
        code: `def risk_score(impact, likelihood):
    return impact * likelihood

# priorización de suites por riesgo (CP-N3-A)
risks = [
    {"area": "normalize_name", "impact": 5, "likelihood": 4, "layer": "unit"},
    {"area": "exact_match", "impact": 5, "likelihood": 3, "layer": "unit"},
    {"area": "sqlite_repo", "impact": 4, "likelihood": 2, "layer": "integration"},
    {"area": "ui_review_queue", "impact": 3, "likelihood": 2, "layer": "e2e"},
]
for r in risks:
    r["score"] = risk_score(r["impact"], r["likelihood"])
ranked = sorted(risks, key=lambda x: (-x["score"], x["area"]))
print([r["area"] for r in ranked])
print("top_layer", ranked[0]["layer"])
print("ok", True)
`,
        output: `['normalize_name', 'exact_match', 'sqlite_repo', 'ui_review_queue']
top_layer unit
ok True`,
      },
      callout: {
        type: "tip",
        title: "Riesgo primero",
        content:
          "Si el tiempo es finito, cubre primero normalize/match; luego DB; al final UI. El score no es ciencia exacta: es una cola de prioridad honestable en el equipo.",
      },
    },
    {
      heading: "Arrange–Act–Assert y oráculos confiables",
      subtopicId: "S27-T1-B",
      paragraphs: [
        "**AAA** separa preparación (Arrange), ejecución (Act) y verificación (Assert). Si mezclas el setup con el assert, un fallo no te dice si se rompió el dato de entrada o el comparador: pierdes tiempo en CI y en code review.",
        "Un **oráculo** es la fuente de verdad del assert: (1) valor fijo conocido (`\"juan pérez\"`), (2) propiedad invariante (longitud ≥ 0 tras normalizar) o (3) resultado de un algoritmo de referencia simple. En matching, el oráculo **no** es un veredicto de fraude: solo responde si dos cadenas normalizadas son la misma entidad sintética.",
        "Oráculos frágiles generan *flakes*: reloj real (`datetime.now()`), orden de un `set`, JSON sin `sort_keys`. Usa contactos sintéticos deterministas (`ana@example.pe`) y fechas literales (`date(2026, 7, 20)`). Si el assert depende del azar, no es contrato.",
      ],
      code: {
        language: 'python',
        title: "aaa_oracle.py",
        code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

# Arrange
raw = "  JUAN   Pérez "
expected = "juan pérez"  # oráculo fijo
# Act
got = normalize_name(raw)
# Assert
assert got == expected, f"oráculo falló: {got!r} != {expected!r}"
print("aaa_ok", got)
print("phases", "arrange-act-assert")`,
        output: `aaa_ok juan pérez
phases arrange-act-assert`,
      },
      callout: {
        type: "warning",
        title: "Oráculo ≠ impresión",
        content:
          "print no es assert. El contrato debe fallar ruidosamente si se rompe; un print amable en verde no protege el merge.",
      },
    },
    {
      heading: "Discovery y assertions de pytest",
      subtopicId: "S27-T2-A",
      paragraphs: [
        "pytest **descubre** funciones `test_*` y clases `Test*` en archivos `test_*.py` / `*_test.py`. Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten re-correr solo el fallido. Sin naming estable no puedes apuntar a un contrato concreto cuando falla la suite.",
        "Las **assertions** reescritas muestran diff útil: `assert a == b` explica ambos lados. Para excepciones esperadas usa `pytest.raises(Tipo, match=\"fragmento\")` (en este lab lo modelamos con try/except + mensaje cuando no instalas pytest todavía).",
        "Parametriza con `@pytest.mark.parametrize` (o una tabla de tuplas en un bucle) para casos de normalización sin copiar el cuerpo del test. Una tabla `(entrada, esperado)` es el corazón de los contratos de `normalize_name` y `exact_match`.",
      ],
      code: {
        language: 'python',
        title: "test_normalize.py",
        code: `# Forma real que pytest descubre (test_*.py + def test_*).
# En tu máquina: python -m pytest test_normalize.py -q
# Aquí ejecutamos el mismo contrato sin CLI (assert + print).
#
# En pytest real también podrías escribir:
#   import pytest
#   @pytest.mark.parametrize("raw,expected", [("  Ana  ", "ana"), ("X  Y", "x y")])
#   def test_normalize_param(raw, expected):
#       assert normalize_name(raw) == expected

def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def test_normalize_spaces():
    assert normalize_name("  Ana  López ") == "ana lópez"

def test_exact_match():
    assert normalize_name("ANA") == normalize_name(" ana ")

# Tabla estilo parametrize (cada fila = un node id conceptual)
cases = [("  Ana  ", "ana"), ("X  Y", "x y")]
param_ok = all(normalize_name(raw) == exp for raw, exp in cases)

test_normalize_spaces()
test_exact_match()
print("node_ids", ["test_normalize_spaces", "test_exact_match"])
print("param_rows", len(cases), "param_ok", param_ok)
print("assert_ok", True)
`,
        output: `node_ids ['test_normalize_spaces', 'test_exact_match']
param_rows 2 param_ok True
assert_ok True`,
      },
      callout: {
        type: "tip",
        title: "Nombres test_*",
        content:
          "Si no empieza por test_, pytest no lo corre (salvo configuración explícita). `helper_normalize` es código de apoyo, no un caso de la suite.",
      },
    },
    {
      heading: "Fixtures, scopes y aislamiento",
      subtopicId: "S27-T2-B",
      paragraphs: [
        "Las **fixtures** inyectan dependencias (datos sintéticos, `tmp_path`) **sin globals**. En pytest real escribes `@pytest.fixture` y el nombre del parámetro recibe el valor. El **scope por defecto es function**: cada test recibe setup fresco.",
        "Scopes: function (default), class, module, session. Un fixture session mutado contamina toda la suite y produce *flakes* de orden. Session-scope solo para recursos caros de **solo lectura** (catálogo estático, configuración inmutable).",
        "Las factory fixtures devuelven callables para crear N entidades sintéticas por caso. Mecanismo clave de aislamiento: **copia profunda** de estructuras mutables; un `list.copy()` superficial comparte dicts internos y un test ensucia al siguiente.",
      ],
      code: {
        language: 'python',
        title: "fixtures_scope.py",
        code: `# En pytest real (tu máquina):
#   import pytest
#   @pytest.fixture  # scope="function" por defecto
#   def contacts():
#       return deepcopy(_base_contacts)
#   def test_isolated(contacts):
#       contacts[0]["name"] = "MUTADO"
#       assert contacts[0]["name"] == "MUTADO"
# Aquí modelamos el mismo aislamiento sin instalar pytest.
from copy import deepcopy

_base_contacts = [
    {"id": "c1", "name": "Ana López", "email": "ana@example.pe"},
    {"id": "c2", "name": "ANA  lopez", "email": "ana@example.pe"},
]

def fixture_contacts(scope="function"):
    if scope == "function":
        return deepcopy(_base_contacts)
    return _base_contacts  # session-like: peligrosa si mutas

t1 = fixture_contacts("function")
t1[0]["name"] = "MUTADO"
t2 = fixture_contacts("function")
print("isolated", t2[0]["name"] == "Ana López")
print("n", len(t2))
print("scope_default", "function")`,
        output: `isolated True
n 2
scope_default function`,
      },
      callout: {
        type: "danger",
        title: "Mutar fixture session",
        content:
          "Si mutas un fixture session-scope, el siguiente test ve basura. Prefiere function + factory. En pytest: scope=\"function\" (default) o factory fixture.",
      },
    },
    {
      heading: "Excepciones, floats, fechas y archivos temporales",
      subtopicId: "S27-T3-A",
      paragraphs: [
        "Prueba **excepciones** con el tipo y, si aplica, el **mensaje** (`pytest.raises(ValueError, match=\"vacío\")` en pytest real; aquí, try/except + `\"vacío\" in str(e)`). Para **floats** y scores de matching usa tolerancia (`math.isclose`) o decimal cuantizado: `==` exacto en `0.1 + 0.2` es trampa pedagógica y de producción.",
        "**Fechas**: no compares `datetime.now()` con literales frágiles. **Inyecta el reloj**: la función recibe `today: date` (o un callable de reloj) y el test pasa un literal fijo (`date(2026, 7, 20)`). Así el contrato no cambia de un día al otro. Librerías como freezegun son opcionales; la inyección de parámetro basta y es más explícita.",
        "**tmp_path** (pytest) / `tempfile` (stdlib) evita escribir en el repo. Dos APIs: (1) `TemporaryDirectory()` borra al salir del `with`; (2) `NamedTemporaryFile(..., delete=False)` deja un path reabrable para reabrir y assert. Usa siempre `encoding='utf-8'` en texto.",
      ],
      code: {
        language: 'python',
        title: "borders_tmp.py",
        code: `import math
from datetime import date
from pathlib import Path
import tempfile

# En pytest real: with pytest.raises(ValueError, match="vacío"): parse_score("  ")
# Aquí un mini assert_raises con match= (mismo contrato, sin dependencia).

def parse_score(s: str) -> float:
    if s.strip() == "":
        raise ValueError("score vacío")
    return float(s)

def assert_raises(exc_type, fn, match=None):
    try:
        fn()
    except exc_type as e:
        if match is not None and match not in str(e):
            raise AssertionError(f"mensaje sin {match!r}: {e!r}") from e
        return True
    raise AssertionError(f"se esperaba {exc_type.__name__}")

def is_stale(created: date, today: date, days: int = 30) -> bool:
    # clock injection: el test pasa today; no llama date.today() por dentro
    return (today - created).days > days

print("raises_ok", assert_raises(ValueError, lambda: parse_score("  "), match="vacío"))
print("close", math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9, abs_tol=1e-12))

fixed_today = date(2026, 7, 20)
print("iso", fixed_today.isoformat())
print("stale", is_stale(date(2026, 1, 1), fixed_today, 30))

with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "norm.txt"
    p.write_text("juan\\n", encoding="utf-8")
    print("tmp_bytes", p.read_text(encoding="utf-8").strip())

with tempfile.NamedTemporaryFile("w+", delete=False, encoding="utf-8") as f:
    f.write("ok")
    path = f.name
print("named", Path(path).read_text(encoding="utf-8").strip())`,
        output: `raises_ok True
close True
iso 2026-07-20
stale True
tmp_bytes juan
named ok`,
      },
      callout: {
        type: "tip",
        title: "isclose > ==",
        content:
          "Nunca compares floats de probabilidad con igualdad bit a bit en tests de matching. Define abs_tol/rel_tol y documéntalos en el contrato.",
      },
    },
    {
      heading: "Casos negativos y mensajes útiles",
      subtopicId: "S27-T3-B",
      paragraphs: [
        "Los **casos negativos** prueban inputs inválidos: `None`, vacío, tipo incorrecto, encoding roto. Deben fallar de forma **controlada** (excepción tipada con mensaje), no con un `AttributeError` críptico en la línea 87 de una librería interna ajena a tu contrato.",
        "Mensajes de error **útiles** nombran el campo y el valor ofensivo (sintético, sin PII real). Eso acelera el fix en CI: `email: se esperaba str, recibió None` gana a un genérico `invalid input` que no dice dónde mirar.",
        "Diseña una tabla: input → excepción esperada → fragmento de mensaje. Cubre al menos un happy path y tres negativos por función pública del motor. Es la misma idea que `@pytest.mark.parametrize`, aplicada a bordes de validación en vez de a oráculos felices.",
      ],
      code: {
        language: 'python',
        title: "negative_messages.py",
        code: `def require_email(value):
    if value is None:
        raise TypeError("email: se esperaba str, recibió None")
    if not isinstance(value, str):
        raise TypeError(f"email: se esperaba str, recibió {type(value).__name__}")
    v = value.strip()
    if not v or "@" not in v:
        raise ValueError(f"email inválido: {value!r}")
    return v.casefold()

cases = [
    (None, TypeError, "None"),
    (123, TypeError, "int"),
    ("", ValueError, "inválido"),
    ("ok@example.pe", None, "ok@example.pe"),
]
results = []
for raw, exp_exc, frag in cases:
    try:
        out = require_email(raw)
        results.append(exp_exc is None and frag in out)
    except Exception as e:
        results.append(exp_exc is not None and isinstance(e, exp_exc) and frag in str(e))
print("neg_ok", all(results))
print("n_cases", len(cases))`,
        output: `neg_ok True
n_cases 4`,
      },
      callout: {
        type: "warning",
        title: "Sin secretos en mensajes",
        content:
          "No imprimas tokens ni PII real en asserts de CI. El valor ofensivo debe ser sintético o enmascarado.",
      },
    },
    {
      heading: "Cobertura por rama y por riesgo",
      subtopicId: "S27-T4-A",
      paragraphs: [
        "**Branch coverage** mide si cada rama (if/else) se ejecutó. 100% de líneas no implica 100% de riesgo cubierto: puedes cubrir logs y pretty-print y dejar sin test la rama de umbral `review` que mueve el clerical queue.",
        "**Risk coverage**: prioriza ramas de negocio (auto-match / review / non-match, campos faltantes) sobre decoración. En un clasificador de pares sintéticos, las tres bandas de umbral son el núcleo del contrato — no el color del badge en la UI.",
        "Reporta cobertura como **evidencia** para el equipo, no como meta vacía del 100%. Una rama de umbral sin caso es deuda: en producción el clerical queue verá estados que CI nunca ejercitó y confiará en basura.",
      ],
      code: {
        language: 'python',
        title: "branch_risk.py",
        code: `def classify_pair(score: float, thr_auto=0.9, thr_review=0.6) -> str:
    if score >= thr_auto:
        return "auto_match"
    if score >= thr_review:
        return "review"
    return "non_match"

branches = {"auto": 0, "review": 0, "non": 0}
for s in [0.95, 0.7, 0.2, 0.9]:
    c = classify_pair(s)
    if c == "auto_match":
        branches["auto"] += 1
    elif c == "review":
        branches["review"] += 1
    else:
        branches["non"] += 1
covered = sum(1 for v in branches.values() if v > 0)
print("branch_covered", covered, "of", 3)
print("branches", branches)
print("risk_focus", "thresholds")`,
        output: `branch_covered 3 of 3
branches {'auto': 2, 'review': 1, 'non': 1}
risk_focus thresholds`,
      },
      callout: {
        type: "info",
        title: "Cobertura con sentido",
        content:
          "Si una rama de 'review' nunca se prueba, la cola de revisión se romperá en producción sin que CI se entere.",
      },
    },
    {
      heading: "Mutación conceptual, fallas útiles y mantenimiento",
      subtopicId: "S27-T4-B",
      paragraphs: [
        "**Mutación conceptual**: cambia deliberadamente el código (quita un `strip`, invierte un umbral, elimina `casefold`) y verifica que **algún test falle**. Si la suite sigue verde, el test es teatro de cobertura, no un contrato.",
        "Fallas **útiles** muestran input sintético, esperado vs actual y el contrato violado. Evita `assert False` o un bare `assert got`. Un dict `{\"expected\": …, \"actual\": …, \"input\": …}` (o el rewrite de pytest) acelera el fix.",
        "Mantenimiento: borra tests que solo copian la implementación; renombra con intención; parametriza tablas; no dupliques el mismo oráculo en tres sitios. Política del ciclo: **bug_repro → regression_test** antes de cerrar el ticket. En S28 ampliarás estos contratos con dobles (`unittest.mock`) y pruebas de integración entre módulos.",
      ],
      code: {
        language: 'python',
        title: "mutation_useful.py",
        code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def normalize_name_mutated(s: str) -> str:
    # mutación: no colapsa espacios internos
    return s.casefold()

raw = "  Ana  López "
oracle = "ana lópez"
good = normalize_name(raw) == oracle
mut_detected = normalize_name_mutated(raw) != oracle
print("good_passes", good)
print("mutation_killed", mut_detected)
print("maintain", "one_oracle")`,
        output: `good_passes True
mutation_killed True
maintain one_oracle`,
      },
      callout: {
        type: "tip",
        title: "Elimina el mutante",
        content:
          "Si alteras un comparador y todos los tests siguen verdes, no tienes contrato: tienes teatro de cobertura. Añade el caso que mata al mutante.",
      },
    },
  ],
  iDo: {
    intro:
      "Te muestro cómo priorizar riesgos, escribir AAA con oráculos, descubrir tests, aislar fixtures y matar mutantes sobre normalización/matching sintético — inicio de CP-N3-A. Observa el contrato (entrada → assert → salida) antes de tocar los We Do.",
    steps: [
      {
        demoId: "S27-T1-A-DEMO",
        subtopicId: "S27-T1-A",
        environment: "local-python",
        description: "Prioriza suites unit/integration por score de riesgo para el motor ER sintético.",
        code: {
          language: 'python',
          title: "risk_rank_demo.py",
          code: `def risk_score(impact, likelihood):
    return impact * likelihood

areas = [
    ("normalize", 5, 5, "unit"),
    ("blocking", 4, 4, "unit"),
    ("repo_sql", 4, 2, "integration"),
]
ranked = sorted(areas, key=lambda r: -risk_score(r[1], r[2]))
print([n for n, *_ in ranked])
print("top_layer", ranked[0][3])
print("ok", True)
`,
          output: `['normalize', 'blocking', 'repo_sql']
top_layer unit
ok True`,
        },
        why: "La pirámide + riesgo pone primero los contratos de normalización, no la UI.",
      },
      {
        demoId: "S27-T1-B-DEMO",
        subtopicId: "S27-T1-B",
        environment: "local-python",
        description: "Test AAA con oráculo fijo para normalize_name sobre dato sintético peruano.",
        code: {
          language: 'python',
          title: "aaa_demo.py",
          code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

# Arrange
raw, oracle = "  María  Ríos ", "maría ríos"
# Act
got = normalize_name(raw)
# Assert
assert got == oracle
print("got", got)
print("aaa", "pass")`,
          output: `got maría ríos
aaa pass`,
        },
        why: "Oráculo determinista = regresión confiable en cada commit.",
      },
      {
        demoId: "S27-T2-A-DEMO",
        subtopicId: "S27-T2-A",
        environment: "local-python",
        description: "Suite mínima estilo pytest: dos test_* con asserts de normalización y matching.",
        code: {
          language: 'python',
          title: "discovery_demo.py",
          code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def test_exact_after_norm():
    assert normalize_name("A B") == "a b"

def test_email_domain():
    assert "x@example.pe".endswith("@example.pe")

# discovery conceptual + ejecución del contrato
node_ids = ["test_exact_after_norm", "test_email_domain"]
test_exact_after_norm()
test_email_domain()
print("node_ids", node_ids)
print("assert_exact", normalize_name("A B") == "a b")
print("n_tests", len(node_ids))`,
          output: `node_ids ['test_exact_after_norm', 'test_email_domain']
assert_exact True
n_tests 2`,
        },
        why: "Nombres test_* estables y asserts claros aceleran CI y el re-run del caso fallido.",
      },
      {
        demoId: "S27-T2-B-DEMO",
        subtopicId: "S27-T2-B",
        environment: "local-python",
        description: "Fixture factory con scope function: dos tests no se contaminan al mutar contactos.",
        code: {
          language: 'python',
          title: "fixture_demo.py",
          code: `from copy import deepcopy
BASE = [{"id": "e1", "name": "Luis"}]

def contacts_fx():
    # equivalente a @pytest.fixture → deepcopy por test
    return deepcopy(BASE)

a = contacts_fx(); a[0]["name"] = "X"
b = contacts_fx()
print("isolated", b[0]["name"] == "Luis")
print("a_mut", a[0]["name"])
print("scope", "function")`,
          output: `isolated True
a_mut X
scope function`,
        },
        why: "Aislamiento function-scope evita flakes de orden entre tests.",
      },
      {
        demoId: "S27-T3-A-DEMO",
        subtopicId: "S27-T3-A",
        environment: "local-python",
        description: "Excepción ValueError, isclose de score, reloj inyectado y escritura en directorio temporal.",
        code: {
          language: 'python',
          title: "borders_demo.py",
          code: `import math, tempfile
from pathlib import Path
from datetime import date

def score(x):
    if x is None:
        raise ValueError("score None")
    return float(x)

def age_days(created: date, today: date) -> int:
    return (today - created).days  # reloj inyectado

try:
    score(None)
except ValueError as e:
    print("exc", str(e))
print("close", math.isclose(0.30000000000000004, 0.3, abs_tol=1e-9))
print("day", date(2026, 1, 15).isoformat())
print("age", age_days(date(2026, 1, 1), date(2026, 1, 15)))
with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "s.txt"
    p.write_text("0.85", encoding="utf-8")
    print("tmp", p.read_text(encoding="utf-8"))`,
          output: `exc score None
close True
day 2026-01-15
age 14
tmp 0.85`,
        },
        why: "Bordes numéricos, reloj inyectado y tmp evitan tests frágiles en matching.",
      },
      {
        demoId: "S27-T3-B-DEMO",
        subtopicId: "S27-T3-B",
        environment: "local-python",
        description: "Tabla de casos negativos para validador de RUC sintético (formato, no consulta SUNAT real).",
        code: {
          language: 'python',
          title: "negative_demo.py",
          code: `def check_ruc(s: str) -> str:
    if not s or not s.isdigit() or len(s) != 11:
        raise ValueError(f"ruc inválido: {s!r}")
    return s

ok = []
for val, bad in [("20123456789", False), ("123", True), ("", True), ("abcdefghijk", True)]:
    try:
        check_ruc(val)
        ok.append(not bad)
    except ValueError as e:
        ok.append(bad and "inválido" in str(e))
print("neg_table", all(ok))
print("n", len(ok))`,
          output: `neg_table True
n 4`,
        },
        why: "Mensajes con valor ofensivo (sintético) aceleran el fix sin filtrar PII real.",
      },
      {
        demoId: "S27-T4-A-DEMO",
        subtopicId: "S27-T4-A",
        environment: "local-python",
        description: "Cubre las tres ramas de umbral auto/review/non_match y reporta cobertura de ramas.",
        code: {
          language: 'python',
          title: "coverage_demo.py",
          code: `def decide(score):
    if score >= 0.9:
        return "auto"
    if score >= 0.6:
        return "review"
    return "non"

hits = {decide(s) for s in (0.95, 0.75, 0.1)}
print("covered", sorted(hits))
print("full", hits == {"auto", "review", "non"})
print("risk", "threshold_branches")`,
          output: `covered ['auto', 'non', 'review']
full True
risk threshold_branches`,
        },
        why: "Branch coverage enfocada en umbrales de matching, no en prints de debug.",
      },
      {
        demoId: "S27-T4-B-DEMO",
        subtopicId: "S27-T4-B",
        environment: "local-python",
        description: "Mutación: quitar casefold; el test de regresión debe detectar al mutante.",
        code: {
          language: 'python',
          title: "mutation_demo.py",
          code: `def good(s):
    return s.casefold().strip()
def mutant(s):
    return s.strip()  # mutación: sin casefold
oracle = "ana"
raw = "ANA"
print("test_good", good(raw) == oracle)
print("kills_mutant", mutant(raw) != oracle)
print("policy", "regression_on_bug")`,
          output: `test_good True
kills_mutant True
policy regression_on_bug`,
        },
        why: "Si el mutante vive, el test no protege el contrato de normalización.",
      },
    ],
  },
  weDo: {
    intro:
      "24 ejercicios (E1 guiado / E2 independiente / E3 transferencia) sobre pirámide, AAA, discovery, fixtures, bordes, negativos, cobertura y mutación. Cada starter trae un comentario `# DEFECT:` que marca el bug a corregir (es el patrón de caza de fallas del curso, no jerga interna). Imprime **solo** las líneas del oráculo de la solución — sin prints extra de depuración. Datos sintéticos `@example.pe`; matching no etiqueta fraude ni parentesco.",
    steps: [
      {
        id: "S27-T1-A-E1",
        subtopicId: "S27-T1-A",
        kind: "guided",
        instruction:
          "S27-T1-A-E1 · El score de riesgo es `impact * likelihood`. Con impact=5 y likelihood=4, corrige el starter (hoy suma) e imprime solo el score numérico.",
        hint: "Multiplica enteros",
        hints: [
          "Multiplica enteros",
          "print del producto únicamente",
        ],
        edgeCases: ["score 0 si likelihood 0"],
        tests: "score numérico = 20",
        feedback: "El score de priorización es producto, no suma: 5×4=20.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · risk = impact*likelihood
# DEFECT: suma en vez de producto
impact, likelihood = 5, 4
print(impact + likelihood)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `impact, likelihood = 5, 4
print(impact * likelihood)`,
          output: `20`,
        },
      },
      {
        id: "S27-T1-A-E2",
        subtopicId: "S27-T1-A",
        kind: "independent",
        instruction:
          "S27-T1-A-E2 · Ordena las áreas por score de riesgo (impacto×probabilidad) **descendente** e imprime la lista de nombres. El starter ordena ascendente: invierte el criterio. Solo esa línea de salida.",
        hint: "sorted con clave negativa",
        hints: [
          "key=lambda r: -(r[1]*r[2])",
          "imprime solo la lista de nombres",
        ],
        edgeCases: ["empates: el orden secundario no se pide aquí"],
        tests: "lista de nombres unit antes que e2e",
        feedback: "Orden descendente por impacto×probabilidad: unit (25) antes que e2e (2).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · orden por riesgo desc
# DEFECT: ordena ascendente
rows=[('e2e',2,1),('unit',5,5)]
print([n for n,_,_ in sorted(rows, key=lambda r: (r[1]*r[2]))])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[('e2e',2,1),('unit',5,5)]
print([n for n,_,_ in sorted(rows, key=lambda r: -(r[1]*r[2]))])`,
          output: `['unit', 'e2e']`,
        },
      },
      {
        id: "S27-T1-A-E3",
        subtopicId: "S27-T1-A",
        kind: "transfer",
        instruction:
          "S27-T1-A-E3 · Transfiere la pirámide de riesgo: dada la lista `(área, score, capa)`, elige la de **mayor score** e imprime su capa. El starter usa `min` (elige la de menor score). Debe salir `'unit'` (normalize gana a la UI e2e).",
        hint: "max(..., key=score)",
        hints: [
          "max(risks, key=lambda r: r[1])",
          "imprime el índice de capa (r[2]), no el nombre",
        ],
        edgeCases: ["empates: no se piden aquí; prioriza score"],
        tests: "capa de la fila con mayor score = unit",
        feedback: "Priorizar por score (max) pone unit en la base ancha; min invierte la pirámide.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · capa del área de mayor score
# DEFECT: usa min (elige el score más bajo)
risks = [('normalize', 20, 'unit'), ('ui_review', 4, 'e2e')]
top = min(risks, key=lambda r: r[1])
print(top[2])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `risks = [('normalize', 20, 'unit'), ('ui_review', 4, 'e2e')]
top = max(risks, key=lambda r: r[1])
print(top[2])`,
          output: `unit`,
        },
      },
      {
        id: "S27-T1-B-E1",
        subtopicId: "S27-T1-B",
        kind: "guided",
        instruction:
          "S27-T1-B-E1 · Implementa normalización de nombre: `casefold` + colapsar espacios con split/join. Imprime el resultado de `' A  B '` (el starter solo hace strip). Una sola línea de salida.",
        hint: "casefold + split/join",
        hints: [
          "' '.join(s.casefold().split())",
          "strip solo no colapsa dobles espacios",
        ],
        edgeCases: ["tabs y NBSP en prod"],
        tests: "salida coincide con solution output",
        feedback: "casefold + split/join colapsa espacios y unifica mayúsculas: ' A  B ' → 'a b'. strip solo no basta.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · normalize whitespace+casefold
# DEFECT: solo strip
s=' A  B '
print(s.strip())
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s=' A  B '
print(' '.join(s.casefold().split()))`,
          output: `a b`,
        },
      },
      {
        id: "S27-T1-B-E2",
        subtopicId: "S27-T1-B",
        kind: "independent",
        instruction:
          "S27-T1-B-E2 · AAA: con oráculo `'ana'`, haz assert de que `'ANA'.casefold()` coincide e imprime `'pass'` solo si el assert no falla. El starter imprime `'fail'` tras un assert correcto.",
        hint: "assert luego print('pass')",
        hints: [
          "oráculo 'ana'",
          "no imprimas fail si el contrato se cumple",
        ],
        edgeCases: ["falla ruidosa si rompes el oráculo"],
        tests: "salida coincide con solution output",
        feedback: "Tras el assert, imprime 'pass' solo si el oráculo se cumplió. Un 'fail' después de un assert verde confunde CI.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · casefold assert
# DEFECT: imprime fail
raw='ANA'
assert raw.casefold() == 'ana'
print('fail')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw='ANA'
assert raw.casefold() == 'ana'
print('pass')`,
          output: `pass`,
        },
      },
      {
        id: "S27-T1-B-E3",
        subtopicId: "S27-T1-B",
        kind: "transfer",
        instruction:
          "S27-T1-B-E3 · Oráculo de matching exacto: normaliza ambos lados (`casefold` + colapsar espacios) e imprime True si representan la misma entidad sintética. El starter compara crudo (`'X Y' == 'x  y'` → False).",
        hint: "normaliza ambos y compara",
        hints: [
          "' '.join(s.casefold().split()) en a y b",
          "matching ≠ fraude: solo igualdad normalizada",
        ],
        edgeCases: ["acentos: casefold ayuda en muchas locales"],
        tests: "salida coincide con solution output",
        feedback: "Matching exacto compara entidades normalizadas, no cadenas crudas: casefold + colapsar espacios en ambos lados.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · equality after normalize
# DEFECT: compara crudo
a,b='X Y','x  y'
print(a == b)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='X Y','x  y'
print(' '.join(a.casefold().split()) == ' '.join(b.casefold().split()))`,
          output: `True`,
        },
      },
      {
        id: "S27-T2-A-E1",
        subtopicId: "S27-T2-A",
        kind: "guided",
        instruction:
          "S27-T2-A-E1 · Discovery: de la lista de nombres, imprime solo los que empiezan con `'test_'` (como pytest descubre casos). El starter imprime la lista completa.",
        hint: "startswith + list comprehension",
        hints: [
          "n.startswith('test_')",
          "helpers no son tests",
        ],
        edgeCases: ["clases Test* en pytest real"],
        tests: "salida coincide con solution output",
        feedback: "pytest descubre nombres que empiezan con test_*; helper no es un caso de la suite ni un node id.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · discovery test_
# DEFECT: no filtra
names=['test_a','helper','test_b']
print(names)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `names=['test_a','helper','test_b']
print([n for n in names if n.startswith('test_')])`,
          output: `['test_a', 'test_b']`,
        },
      },
      {
        id: "S27-T2-A-E2",
        subtopicId: "S27-T2-A",
        kind: "independent",
        instruction:
          "S27-T2-A-E2 · Simula un assert con mensaje útil: si left != right imprime `'fail'`, si no `'ok'`. El starter siempre imprime `'ok'` aunque left='a' y right='b'.",
        hint: "ternario o if/else",
        hints: [
          "print('ok' if left == right else 'fail')",
          "pytest real mostraría el diff de ambos lados",
        ],
        edgeCases: ["pytest rewrite muestra left y right"],
        tests: "salida coincide con solution output",
        feedback: "Un assert honesto distingue igualdad de desigualdad. Siempre imprimir 'ok' es teatro de verde, no contrato.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · assert equality
# DEFECT: siempre ok
left,right='a','b'
print('ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `left,right='a','b'
print('ok' if left == right else 'fail')`,
          output: `fail`,
        },
      },
      {
        id: "S27-T2-A-E3",
        subtopicId: "S27-T2-A",
        kind: "transfer",
        instruction:
          "S27-T2-A-E3 · Tabla estilo `@pytest.mark.parametrize`: con `cases = [(' x ', 'x'), ('  Y  ', 'Y')]`, aplica `strip` a cada entrada e imprime la lista de booleanos `(strip(raw) == esperado)`. El starter compara crudo (sin strip) y falla ambos casos.",
        hint: "list comprehension sobre la tabla",
        hints: [
          "[raw.strip() == exp for raw, exp in cases]",
          "cada fila sería un node id con [param] en pytest real",
        ],
        edgeCases: ["casefold se suma en el contrato real de normalize_name"],
        tests: "lista de bools True, True tras strip",
        feedback: "Parametrize es una tabla que se ejecuta: no basta con imprimir las tuplas; hay que aplicar el oráculo a cada fila.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · tabla parametrize + oráculo strip
# DEFECT: compara crudo sin strip
cases = [(' x ', 'x'), ('  Y  ', 'Y')]
print([raw == exp for raw, exp in cases])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `cases = [(' x ', 'x'), ('  Y  ', 'Y')]
print([raw.strip() == exp for raw, exp in cases])`,
          output: `[True, True]`,
        },
      },
      {
        id: "S27-T2-B-E1",
        subtopicId: "S27-T2-B",
        kind: "guided",
        instruction:
          "S27-T2-B-E1 · Aislamiento de fixture: copia profunda de una lista de dicts, muta la copia y demuestra que `orig[0]['n']` sigue siendo 1. El starter usa `copy` superficial (comparte el dict interno).",
        hint: "from copy import deepcopy",
        hints: [
          "deepcopy, no copy",
          "mutación solo en la copia del test",
        ],
        edgeCases: ["copy() superficial falla en dict anidado"],
        tests: "salida coincide con solution output",
        feedback: "deepcopy aísla dicts anidados; list.copy() superficial comparte el dict interno y contamina el original.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · deepcopy aislamiento
# DEFECT: shallow copy
from copy import copy
orig=[{'n':1}]
c=copy(orig)
c[0]['n']=9
print(orig[0]['n'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from copy import deepcopy
orig=[{'n':1}]
c=deepcopy(orig)
c[0]['n']=9
print(orig[0]['n'])`,
          output: `1`,
        },
      },
      {
        id: "S27-T2-B-E2",
        subtopicId: "S27-T2-B",
        kind: "independent",
        instruction:
          "S27-T2-B-E2 · Política de scopes para **datos mutables**: el dict `safe_for_mutable` marca qué scopes aíslan bien. Elige el scope por defecto de pytest (el marcado True) e imprímelo. El starter elige `'session'` (False: contamina entre tests).",
        hint: "busca el scope con True",
        hints: [
          "safe_for_mutable['function'] es True",
          "session reutiliza estado y no es seguro para listas mutables",
        ],
        edgeCases: ["session solo para recursos caros de solo lectura"],
        tests: "imprime function",
        feedback: "function-scope es el default seguro de pytest: cada test recibe setup fresco. Session-scope sobre listas mutables produce flakes de orden.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Scope seguro para datos mutables (default pytest)
# DEFECT: elige session aunque no es safe_for_mutable
safe_for_mutable = {'function': True, 'class': False, 'module': False, 'session': False}
chosen = 'session'
print(chosen)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `safe_for_mutable = {'function': True, 'class': False, 'module': False, 'session': False}
chosen = next(s for s, ok in safe_for_mutable.items() if ok)
print(chosen)`,
          output: `function`,
        },
      },
      {
        id: "S27-T2-B-E3",
        subtopicId: "S27-T2-B",
        kind: "transfer",
        instruction:
          "S27-T2-B-E3 · Factory fixture: `make(n)` devuelve n contactos sintéticos `{'id': 'c0'..}`. Imprime `len(make(3))`. El starter hardcodea 0 e ignora la factory.",
        hint: "print(len(make(3)))",
        hints: [
          "usa la función make definida",
          "ids sintéticos c0, c1, c2",
        ],
        edgeCases: ["n=0 devuelve lista vacía"],
        tests: "salida coincide con solution output",
        feedback: "La factory fixture crea N entidades por caso. Hardcodear el tamaño no prueba la factory ni el aislamiento.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · factory len
# DEFECT: hardcode 0
def make(n):
    return [{'id': f'c{i}'} for i in range(n)]
print(0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def make(n):
    return [{'id': f'c{i}'} for i in range(n)]
print(len(make(3)))`,
          output: `3`,
        },
      },
      {
        id: "S27-T3-A-E1",
        subtopicId: "S27-T3-A",
        kind: "guided",
        instruction:
          "S27-T3-A-E1 · Floats en scores: usa `math.isclose(0.1 + 0.2, 0.3)` e imprime el booleano. El starter usa `==` exacto (falla en IEEE-754).",
        hint: "import math; math.isclose",
        hints: [
          "math.isclose(0.1 + 0.2, 0.3)",
          "no uses == en floats de probabilidad",
        ],
        edgeCases: ["abs_tol en scores de matching"],
        tests: "salida coincide con solution output",
        feedback: "math.isclose evita la trampa IEEE-754 de 0.1+0.2 en scores de matching. Documenta abs_tol/rel_tol en el contrato.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · isclose float
# DEFECT: == exacto
import math
print(0.1 + 0.2 == 0.3)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import math
print(math.isclose(0.1 + 0.2, 0.3))`,
          output: `True`,
        },
      },
      {
        id: "S27-T3-A-E2",
        subtopicId: "S27-T3-A",
        kind: "independent",
        instruction:
          "S27-T3-A-E2 · Modelo de `pytest.raises(ValueError, match=…)`: captura el `ValueError` de `int('x')` e imprime `True` solo si el mensaje contiene el fragmento `'invalid'` (en CPython suele decir *invalid literal*). El starter imprime `False` sin inspeccionar el mensaje.",
        hint: "except ValueError as e; 'invalid' in str(e).casefold()",
        hints: [
          "with pytest.raises(ValueError, match='invalid') en pytest real",
          "print(True) solo si el fragmento está en el mensaje",
        ],
        edgeCases: ["match= es subcadena, no regex completa salvo flags"],
        tests: "True si el mensaje del ValueError contiene 'invalid'",
        feedback: "pytest.raises(..., match=) falla si el tipo es correcto pero el mensaje no cuadra: el fragmento es parte del contrato.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · raises + match fragment
# DEFECT: no inspecciona el mensaje
try:
    int('x')
    matched = False
except ValueError as e:
    matched = False  # debería mirar str(e)
print(matched)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `try:
    int('x')
    matched = False
except ValueError as e:
    matched = 'invalid' in str(e).casefold()
print(matched)`,
          output: `True`,
        },
      },
      {
        id: "S27-T3-A-E3",
        subtopicId: "S27-T3-A",
        kind: "transfer",
        instruction:
          "S27-T3-A-E3 · Escribe `'ok'` en un `NamedTemporaryFile` de texto (utf-8), reabre por path e imprime `contenido.strip()`. El starter imprime cadena vacía sin leer el archivo.",
        hint: "Path(path).read_text(encoding='utf-8')",
        hints: [
          "delete=False para conservar el path",
          "encoding utf-8 al escribir y al leer",
        ],
        edgeCases: ["borrar en finally en prod"],
        tests: "salida coincide con solution output",
        feedback: "NamedTemporaryFile con delete=False deja un path reabrable. El contrato lee el contenido (utf-8); no asumas cadena vacía.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · tempfile content
# DEFECT: no lee
import tempfile
from pathlib import Path
with tempfile.NamedTemporaryFile('w+', delete=False, encoding='utf-8') as f:
    f.write('ok')
    path = f.name
print('')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import tempfile
from pathlib import Path
with tempfile.NamedTemporaryFile('w+', delete=False, encoding='utf-8') as f:
    f.write('ok')
    path=f.name
print(Path(path).read_text(encoding='utf-8').strip())`,
          output: `ok`,
        },
      },
      {
        id: "S27-T3-B-E1",
        subtopicId: "S27-T3-B",
        kind: "guided",
        instruction:
          "S27-T3-B-E1 · Si email es `''`, lanza `ValueError('email vacío')`, captúralo e imprime el **mensaje** (no el nombre del tipo). El starter imprime `type(e).__name__`.",
        hint: "print(e) o print(str(e))",
        hints: [
          "raise ValueError('email vacío')",
          "el mensaje es el contrato del caso negativo",
        ],
        edgeCases: ["None vs ''"],
        tests: "salida coincide con solution output",
        feedback: "El mensaje de la excepción es el contrato del caso negativo. Solo imprimir el nombre del tipo no acelera el fix en CI.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · mensaje ValueError
# DEFECT: imprime tipo
email=''
try:
    if email == '':
        raise ValueError('email vacío')
except ValueError as e:
    print(type(e).__name__)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `email=''
try:
    if email == '':
        raise ValueError('email vacío')
except ValueError as e:
    print(e)`,
          output: `email vacío`,
        },
      },
      {
        id: "S27-T3-B-E2",
        subtopicId: "S27-T3-B",
        kind: "independent",
        instruction:
          "S27-T3-B-E2 · Validación mínima de email sintético: si `s` no contiene `'@'`, imprime `'invalid'`; si no, `'ok'`. El starter siempre imprime `'ok'`.",
        hint: "'@' in s",
        hints: [
          "print('ok' if '@' in s else 'invalid')",
          "no es validación RFC completa",
        ],
        edgeCases: ["no es validación RFC completa"],
        tests: "salida coincide con solution output",
        feedback: "Un email sintético sin '@' es inválido. El caso negativo debe fallar de forma controlada, no imprimir siempre 'ok'.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · email @
# DEFECT: siempre ok
s='sin-arroba'
print('ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s='sin-arroba'
print('ok' if '@' in s else 'invalid')`,
          output: `invalid`,
        },
      },
      {
        id: "S27-T3-B-E3",
        subtopicId: "S27-T3-B",
        kind: "transfer",
        instruction:
          "S27-T3-B-E3 · Mensaje útil sin PII: con v=-1 construye e imprime `f\"campo score inválido: {v!r}\"`. El starter imprime un genérico `'error'`.",
        hint: "f-string con !r",
        hints: [
          "print(f'campo score inválido: {v!r}')",
          "nombra el campo en el mensaje",
        ],
        edgeCases: ["no loguear tokens ni PII real"],
        tests: "salida coincide con solution output",
        feedback: "Mensajes útiles nombran el campo y el valor ofensivo (sintético). Un 'error' genérico no dice dónde mirar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · mensaje inválido
# DEFECT: mensaje genérico
v=-1
print('error')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `v=-1
print(f'campo score inválido: {v!r}')`,
          output: `campo score inválido: -1`,
        },
      },
      {
        id: "S27-T4-A-E1",
        subtopicId: "S27-T4-A",
        kind: "guided",
        instruction:
          "S27-T4-A-E1 · Dos ramas de negocio: `f(x)` retorna `'hi'` si x>0 else `'lo'`. Imprime ambas: `f(1)` y `f(-1)` en una línea (como `hi lo`). El starter solo imprime una rama.",
        hint: "print(f(1), f(-1))",
        hints: [
          "ambas ramas en un solo print",
          "cubrir hi y lo = branch coverage mínima",
        ],
        edgeCases: ["rama ==0 cae en lo"],
        tests: "salida coincide con solution output",
        feedback: "Branch coverage mínima: ejercita ambas ramas (hi y lo) en la misma evidencia. Una sola llamada deja una rama sin contrato.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · branches hi/lo
# DEFECT: solo un branch
def f(x):
    return 'hi' if x > 0 else 'lo'
print(f(1))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def f(x):
    return 'hi' if x > 0 else 'lo'
print(f(1), f(-1))`,
          output: `hi lo`,
        },
      },
      {
        id: "S27-T4-A-E2",
        subtopicId: "S27-T4-A",
        kind: "independent",
        instruction:
          "S27-T4-A-E2 · Risk coverage: dado el set de ramas cubiertas `{'auto','review'}`, imprime True si falta la rama `'non'`. El starter pregunta si `'non'` está en el set (respuesta invertida).",
        hint: "'non' not in hit",
        hints: [
          "membership con not in",
          "tres bandas de umbral: auto/review/non",
        ],
        edgeCases: ["risk coverage ≠ solo line coverage"],
        tests: "salida coincide con solution output",
        feedback: "Si falta la banda 'non' en la evidencia, hay deuda de risk coverage en umbrales de matching — CI no vio non_match.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · non no en hit
# DEFECT: non in hit
hit={'auto','review'}
print('non' in hit)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `hit={'auto','review'}
print('non' not in hit)`,
          output: `True`,
        },
      },
      {
        id: "S27-T4-A-E3",
        subtopicId: "S27-T4-A",
        kind: "transfer",
        instruction:
          "S27-T4-A-E3 · Porcentaje de ramas cubiertas: 2 de 3 → entero truncado 66 (`int(100 * k / n)`). El starter imprime la fracción k/n sin escalar a porcentaje.",
        hint: "int(100 * k / n)",
        hints: [
          "k, n = 2, 3",
          "evidencia de cobertura, no meta vacía del 100%",
        ],
        edgeCases: ["no uses solo line coverage como KPI"],
        tests: "salida coincide con solution output",
        feedback: "Reporta cobertura como porcentaje legible (int 0–100). La fracción k/n sin escalar no es evidencia accionable en el equipo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · coverage percent
# DEFECT: k/n sin *100
k,n=2,3
print(k / n)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `k,n=2,3
print(int(100 * k / n))`,
          output: `66`,
        },
      },
      {
        id: "S27-T4-B-E1",
        subtopicId: "S27-T4-B",
        kind: "guided",
        instruction:
          "S27-T4-B-E1 · Mutante conceptual: `good=raw.strip()` cumple el oráculo `'a'`; `mutant=raw` no. Imprime True solo si good pasa **y** el mutante queda detectado (`!= 'a'`). El starter exige que mutant también pase.",
        hint: "good == 'a' and mutant != 'a'",
        hints: [
          "el test debe matar al mutante",
          "si ambos pasan, el contrato es teatro",
        ],
        edgeCases: ["mutación de umbral en matching"],
        tests: "salida coincide con solution output",
        feedback: "El camino bueno debe pasar y el mutante debe fallar. Si ambos pasan el oráculo, no hay contrato: hay teatro de cobertura.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · mutant fails oracle
# DEFECT: no distingue mutant
raw=' a '
good=raw.strip()
mutant=raw
print(good == 'a' and mutant == 'a')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw=' a '
good=raw.strip()
mutant=raw
print(good == 'a' and mutant != 'a')`,
          output: `True`,
        },
      },
      {
        id: "S27-T4-B-E2",
        subtopicId: "S27-T4-B",
        kind: "independent",
        instruction:
          "S27-T4-B-E2 · Falla útil para CI: con `inp='ANA'`, `expected='ana'`, `actual='Ana'`, imprime un dict con keys `input`, `expected`, `actual` (en ese orden mental de diagnóstico). El starter omite el input y solo muestra expected/actual invertidos de rol.",
        hint: "dict con input + expected + actual",
        hints: [
          "{'input': inp, 'expected': expected, 'actual': actual}",
          "sin input el fix en CI es más lento",
        ],
        edgeCases: ["no incluyas PII real en mensajes de CI"],
        tests: "dict con input/expected/actual sintéticos",
        feedback: "Una falla útil nombra input sintético, esperado y actual; no solo un assert ciego.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · falla útil con input
# DEFECT: falta input; roles confusos
inp, expected, actual = 'ANA', 'ana', 'Ana'
print({'expected': actual, 'actual': expected})
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `inp, expected, actual = 'ANA', 'ana', 'Ana'
print({'input': inp, 'expected': expected, 'actual': actual})`,
          output: `{'input': 'ANA', 'expected': 'ana', 'actual': 'Ana'}`,
        },
      },
      {
        id: "S27-T4-B-E3",
        subtopicId: "S27-T4-B",
        kind: "transfer",
        instruction:
          "S27-T4-B-E3 · Ciclo **bug_repro → regression_test**: el bug era comparar sin normalizar (`' ANA '` vs oráculo `'ana'`). Escribe la regresión: aplica `casefold` + `strip` e imprime el booleano del contrato (True). El starter se queda en la fase bug_repro (compara crudo → False).",
        hint: "normaliza antes del ==",
        hints: [
          "got = raw.casefold().strip()",
          "print(got == oracle) debe ser True tras la regresión",
        ],
        edgeCases: ["después parametriza varios raw con el mismo oráculo"],
        tests: "regresión verde: True",
        feedback: "bug_repro muestra el fallo crudo; regression_test fija el oráculo normalizado para que un mutante sin strip/casefold no sobreviva en CI.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-027 · bug_repro → regression_test
# DEFECT: aún en bug_repro (compara crudo, sin normalizar)
raw, oracle = ' ANA ', 'ana'
print(raw == oracle)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw, oracle = ' ANA ', 'ana'
got = raw.casefold().strip()
print(got == oracle)`,
          output: `True`,
        },
      },
    ],
  },
  youDo: {
    title: "Contratos pytest de normalización y matching — inicio CP-N3-A",
    context:
      "Construye una mini suite pytest (o, si aún no instalas pytest, un módulo de asserts equivalentes) sobre normalización y exact match con contactos sintéticos `@example.pe` (caso `CASO-LIM-027`, run_id `cpn3a-01`). Cada supuesto del ER debe ser un test ejecutable: mapa de riesgo por capa, tests AAA con oráculos fijos, fixtures con aislamiento function-scope, casos negativos con mensajes útiles, cobertura de ramas de umbral y al menos un mutante conceptual eliminado. Matching no implica fraude ni parentesco.",
    objectives: [
      "Mapa de riesgos y capas unit/integration/e2e",
      "Tests AAA con oráculos fijos para normalize y exact_match",
      "Fixtures function-scope y casos negativos con mensajes",
      "Cobertura de ramas de umbral + mutante eliminado",
      "Documentación es-PE del contrato de pruebas",
    ],
    requirements: [
      "Datos sintéticos únicamente; sin PII real ni secretos",
      "Cada bug documentado → test de regresión",
      "Matching no implica fraude ni parentesco",
      "Demo reproducible (python -m pytest o scripts de assert)",
      "Alineación a CP-N3-A (inicio de contratos del motor ER)",
    ],
    starterCode: `# CP-N3-A inicio — layout sugerido:
#   er_norm.py          → normalize_name, exact_match, classify_pair
#   tests/test_norm.py  → test_* AAA + negativos + umbrales
#   conftest.py         → @pytest.fixture function-scope (opcional)
#   README.md           → pirámide de riesgo, límites, evidencia de corrida
#
# En tu máquina: python -m pytest tests/ -q
# Aquí el mismo contrato corre como módulo con assert + print.

def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def exact_match(a: str, b: str) -> bool:
    return normalize_name(a) == normalize_name(b)

def classify_pair(score: float, thr_auto=0.9, thr_review=0.6) -> str:
    if score >= thr_auto:
        return "auto_match"
    if score >= thr_review:
        return "review"
    return "non_match"

def risk_map():
    """Prioridad de suites (score = impacto × probabilidad)."""
    return [
        {"area": "normalize_name", "layer": "unit", "score": 20},
        {"area": "exact_match", "layer": "unit", "score": 15},
        {"area": "classify_pair", "layer": "unit", "score": 12},
    ]

def test_normalize_spaces():
    # Arrange / Act / Assert
    assert normalize_name("  Ana  López ") == "ana lópez"

def test_exact_match_yes():
    assert exact_match(" Ana  ", "ana") is True

def test_exact_match_no():
    assert exact_match("ana", "luis") is False

def test_threshold_branches():
    assert classify_pair(0.95) == "auto_match"
    assert classify_pair(0.7) == "review"
    assert classify_pair(0.2) == "non_match"

# Extiende: negativos con mensajes, fixture function-scope, mutante conceptual
# (quita casefold y comprueba que test_normalize_spaces falla).

if __name__ == "__main__":
    test_normalize_spaces()
    test_exact_match_yes()
    test_exact_match_no()
    test_threshold_branches()
    print("risk_top", risk_map()[0]["area"])
    print("starter_ok")
`,
    portfolioNote:
      "Entrega de inicio CP-N3-A para tu portafolio: carpeta con código de normalización/matching sintético, tests (pytest preferido), README en español profesional con límites y evidencia de corrida.",
    rubric: [
      { criterion: "Cubre los objetivos de contratos pytest de esta sección (riesgo, AAA, fixtures, bordes, mutación)", weight: "25%" },
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
        question: "En la pirámide de pruebas, la base más ancha suele ser:",
        options: ["E2E UI", "Solo manual", "Pruebas unitarias", "Load tests en prod"],
        correctIndex: 2,
        explanation:
          "Muchas unitarias baratas; pocas E2E caras. El riesgo puede reordenar el tiempo, no invertir la base.",
      },
      {
        question: "Un oráculo confiable es:",
        options: ["Una fuente de verdad determinista para el assert", "Un print en consola", "El reloj del sistema sin fijar", "El orden de un set"],
        correctIndex: 0,
        explanation:
          "El assert necesita verdad estable (valor fijo o propiedad invariante).",
      },
      {
        question: "Si mutas un casefold y ningún test falla:",
        options: ["Está bien", "El contrato es débil; el mutante sobrevivió", "pytest está roto siempre", "Ignora cobertura"],
        correctIndex: 1,
        explanation:
          "Mutación conceptual detecta tests inútiles: hay que añadir regresión que mate al mutante.",
      },
      {
        question: "Las pruebas de matching en CP-N3-A demuestran:",
        options: ["Fraude automático", "Parentescos", "Envío de correos", "Contratos de misma entidad / normalización — no riesgo ni relación"],
        correctIndex: 3,
        explanation:
          "ER decide misma entidad sintética; no fraude ni parentesco.",
      },
      {
        question: "¿Cuál es el scope por defecto de una fixture de pytest y por qué importa en datos mutables?",
        options: [
          "session: reutiliza estado entre todos los tests (ideal para mutar listas)",
          "function: se recrea por test y reduce contaminación entre casos",
          "package: solo existe en unittest, no en pytest",
          "module: es el único scope que aísla copias profundas automáticamente",
        ],
        correctIndex: 1,
        explanation:
          "El default es function-scope: cada test recibe un setup fresco. Mutar un fixture session/module sin cuidado produce flakes de orden.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "pytest documentation",
        url: "https://docs.pytest.org/en/stable/",
        note: "Discovery, fixtures, parametrize",
      },
      {
        label: "pytest — Getting started",
        url: "https://docs.pytest.org/en/stable/getting-started.html",
        note: "Primeros test_*",
      },
      {
        label: "pytest — Fixtures",
        url: "https://docs.pytest.org/en/stable/how-to/fixtures.html",
        note: "Scopes y aislamiento",
      },
      {
        label: "pytest — Parametrize",
        url: "https://docs.pytest.org/en/stable/how-to/parametrize.html",
        note: "Tablas de casos",
      },
      {
        label: "Coverage.py",
        url: "https://coverage.readthedocs.io/",
        note: "Cobertura por rama",
      },
      {
        label: "Python unittest.mock",
        url: "https://docs.python.org/3/library/unittest.mock.html",
        note: "Dobles (puente a S28)",
      },
      {
        label: "Real Python — Effective Python Testing",
        url: "https://realpython.com/python-testing/",
        note: "Pirámide y AAA",
      },
    ],
    books: [
      {
        label: "Python Testing with pytest (Okken)",
        note: "Fixtures y diseño de suites",
      },
      {
        label: "Unit Testing Principles (Khorikov)",
        note: "Oráculos y mantenibilidad",
      },
    ],
    courses: [
      {
        label: "Coursera — software testing tracks",
        url: "https://www.coursera.org/courses?query=software%20testing%20python",
        note: "Estrategia de pruebas",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos y tests",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Proyectos con asserts",
      },
      {
        label: "pytest tutorial (official)",
        url: "https://docs.pytest.org/en/stable/how-to/assert.html",
        note: "Assertions útiles",
      },
    ],
  },
}
