import type { CourseSection } from '../../types'

export const section27: CourseSection = {
  id: "async-concurrency",
  index: 27,
  title: "Estrategia de pruebas con pytest",
  shortTitle: "Pytest y contratos",
  tagline: "convertir supuestos de normalización y matching en contratos ejecutables; cada bug reproducido obtiene test de regresión",
  estimatedHours: 12,
  level: "Competente",
  phase: 2,
  icon: "FlaskConical",
  accentColor: "bg-gradient-to-br from-violet-500 to-purple-700",
  jobRelevance:
    "En banca, BPO y data platforms en Perú, un motor de **entity resolution** solo es confiable si sus supuestos de normalización y matching son **contratos ejecutables**. Esta sección (id de plataforma `async-concurrency` conservado) retematiza a V3 **Estrategia de pruebas con pytest** e **inicia CP-N3-A**: pirámide de riesgo, AAA, fixtures y regresión. Matching no implica fraude ni parentesco.",
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
      heading: "De concurrencia async a estrategia pytest (mapa e inicio CP-N3-A)",
      paragraphs: [
        "En V3, **S27 no es el path principal de asyncio/TaskGroup**. Ese material se reubica. Aquí **inicias CP-N3-A**: convertir supuestos de normalización y matching en **contratos de prueba** con pytest.",
        "El hilo: un módulo sintético `normalize_name` / `exact_match` sobre contactos fakes (`run_id=cpn3a-01`, `@example.pe`). Cada bug reproducido → test de regresión.",
        "Orden: **T1 Diseño** → **T2 Pytest** → **T3 Bordes** → **T4 Cobertura**. Privacidad: las pruebas no etiquetan fraude ni parentesco.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de concurrencia async de este archivo **no es el camino V3 del estudiante en S27**. Target: pytest + contratos de normalización/matching (inicio CP-N3-A).",
      },
    },
    {
      heading: "riesgos y pirámide de pruebas",
      subtopicId: "S27-T1-A",
      paragraphs: [
        "La **pirámide** prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E. El **riesgo** reordena: un bug en matching de entidades justifica más tests que un typo de log.",
        "Clasifica riesgo por impacto (datos incorrectos, regresión silenciosa) y probabilidad. En ER, normalización y comparadores son capa de alto riesgo.",
        "No inviertas la pirámide: E2E lentas no sustituyen contratos unitarios de `strip`/`casefold`.",
      ],
      code: {
        language: 'python',
        title: "risk_pyramid.py",
        code: `# priorización sintética de suites por riesgo (CP-N3-A)
risks = [
    {"area": "normalize_name", "impact": 5, "likelihood": 4, "layer": "unit"},
    {"area": "exact_match", "impact": 5, "likelihood": 3, "layer": "unit"},
    {"area": "sqlite_repo", "impact": 4, "likelihood": 2, "layer": "integration"},
    {"area": "ui_review_queue", "impact": 3, "likelihood": 2, "layer": "e2e"},
]
for r in risks:
    r["score"] = r["impact"] * r["likelihood"]
ranked = sorted(risks, key=lambda x: (-x["score"], x["area"]))
print("top", ranked[0]["area"], ranked[0]["score"])
print("layers", [r["layer"] for r in ranked])
print("unit_heavy", sum(1 for r in ranked if r["layer"] == "unit") >= 2)`,
        output: `top normalize_name 20
layers ['unit', 'unit', 'integration', 'e2e']
unit_heavy True`,
      },
      callout: {
        type: "tip",
        title: "Riesgo primero",
        content:
          "Si el tiempo es finito, cubre primero normalize/match; luego DB; al final UI.",
      },
    },
    {
      heading: "Arrange–Act–Assert y oráculos confiables",
      subtopicId: "S27-T1-B",
      paragraphs: [
        "**AAA** separa preparación (Arrange), ejecución (Act) y verificación (Assert). Evita asserts mezclados con setup.",
        "Un **oráculo** es la fuente de verdad del assert: valor fijo conocido, propiedad invariante o resultado de un algoritmo de referencia simple.",
        "Oráculos frágiles (timestamps de reloj real, orden de dicts en JSON sin sort) generan flakes. Prefiere fixtures sintéticas deterministas.",
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
          "print no es assert. El contrato debe fallar ruidosamente si se rompe.",
      },
    },
    {
      heading: "discovery y assertions",
      subtopicId: "S27-T2-A",
      paragraphs: [
        "pytest **descubre** funciones `test_*` y clases `Test*` en archivos `test_*.py` / `*_test.py`. Los **node ids** identifican cada caso (`path::name`).",
        "Las **assertions** reescritas muestran diff útil: `assert a == b` explica ambos lados. Usa `pytest.raises` para excepciones esperadas.",
        "Parametriza con `@pytest.mark.parametrize` para tablas de casos sin copiar el cuerpo del test.",
      ],
      code: {
        language: 'python',
        title: "discovery_assert.py",
        code: `# simulación didáctica de discovery + assert rewrite (sin invocar pytest CLI)
import ast

src = '''
def test_normalize_spaces():
    assert " ".join("a  b".split()) == "a b"

def helper_not_a_test():
    return 1

def test_casefold():
    assert "Á".casefold() == "á"
'''
tree = ast.parse(src)
discovered = [n.name for n in tree.body if isinstance(n, ast.FunctionDef) and n.name.startswith("test_")]
print("discovered", discovered)
print("count", len(discovered))
# assert rewrite conceptual: mensaje con ambos lados
a, b = "juan", "Juan".casefold()
try:
    assert a == b
    print("assert_ok", True)
except AssertionError:
    print("assert_ok", False)`,
        output: `discovered ['test_normalize_spaces', 'test_casefold']
count 2
assert_ok True`,
      },
      callout: {
        type: "tip",
        title: "Nombres test_*",
        content:
          "Si no empieza por test_, pytest no lo corre (salvo configuración explícita).",
      },
    },
    {
      heading: "fixtures, scopes y aislamiento",
      subtopicId: "S27-T2-B",
      paragraphs: [
        "Las **fixtures** inyectan dependencias (datos sintéticos, tmp paths) sin globals. **Scopes**: function (default), class, module, session.",
        "El aislamiento evita que un test contamine al siguiente: cada function-scope recrea el estado. Session-scope sirve para recursos caros de solo lectura.",
        "Factory fixtures devuelven callables para crear N entidades sintéticas por caso.",
      ],
      code: {
        language: 'python',
        title: "fixtures_scope.py",
        code: `# fixtures conceptuales (diccionario de proveedores)
from copy import deepcopy

_base_contacts = [
    {"id": "c1", "name": "Ana López", "email": "ana@example.pe"},
    {"id": "c2", "name": "ANA  lopez", "email": "ana@example.pe"},
]

def fixture_contacts(scope="function"):
    # function-scope: copia profunda por test
    if scope == "function":
        return deepcopy(_base_contacts)
    return _base_contacts  # session-like: misma lista (peligroso si mutas)

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
          "Si mutas un fixture session-scope, el siguiente test ve basura. Prefiere function + factory.",
      },
    },
    {
      heading: "excepciones, floats, fechas y archivos temporales",
      subtopicId: "S27-T3-A",
      paragraphs: [
        "Prueba **excepciones** con el tipo y, si aplica, el mensaje. Para **floats** usa tolerancia (`math.isclose`) o decimal cuantizado.",
        "**Fechas**: fija el reloj o usa valores UTC sintéticos; no compares `now()` con literales frágiles.",
        "**tmp_path** / `tempfile` evita escribir en el repo. Limpia o usa context managers.",
        "Dos APIs frecuentes: (1) **`tempfile.TemporaryDirectory()`** crea un directorio temporal y lo borra al salir del `with`; ideal para varios archivos (`Path(td) / \"f.txt\"`). (2) **`tempfile.NamedTemporaryFile('w+', delete=False, encoding='utf-8')`** crea un archivo con nombre en disco: escribes, lees `f.name`, y con `delete=False` el archivo permanece hasta que tú lo borres (útil si otra API necesita una ruta). Siempre usa `encoding='utf-8'` para texto y preferible `Path(path).read_text(...)` al reabrir.",
      ],
      code: {
        language: 'python',
        title: "borders_tmp.py",
        code: `import math
from datetime import date, datetime, timezone
from pathlib import Path
import tempfile

def parse_score(s: str) -> float:
    if s.strip() == "":
        raise ValueError("score vacío")
    return float(s)

# excepción
try:
    parse_score("  ")
    raised = False
except ValueError as e:
    raised = "vacío" in str(e)
print("exc_ok", raised)

# float
print("close", math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9, abs_tol=1e-12))

# fecha fija
d = date(2026, 7, 20)
print("iso", d.isoformat())

# TemporaryDirectory
with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "norm.txt"
    p.write_text("juan\\n", encoding="utf-8")
    print("tmp_bytes", p.read_text(encoding="utf-8").strip())

# NamedTemporaryFile (delete=False → queda path para reabrir)
with tempfile.NamedTemporaryFile("w+", delete=False, encoding="utf-8") as f:
    f.write("ok")
    path = f.name
print("named", Path(path).read_text(encoding="utf-8").strip())`,
        output: `exc_ok True
close True
iso 2026-07-20
tmp_bytes juan
named ok`,
      },
      callout: {
        type: "tip",
        title: "isclose > ==",
        content:
          "Nunca compares floats de probabilidad con igualdad bit a bit en tests de matching.",
      },
    },
    {
      heading: "casos negativos y mensajes",
      subtopicId: "S27-T3-B",
      paragraphs: [
        "Los **casos negativos** prueban inputs inválidos: None, vacío, tipo incorrecto, encoding roto. Deben fallar de forma controlada.",
        "Mensajes de error **útiles** nombran el campo y el valor ofensivo (sin PII real). Facilita debug en CI.",
        "Tabla: input → excepción esperada → fragmento de mensaje. Cubre al menos un caso happy path y tres negativos por función pública.",
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
          "No imprimas tokens ni PII real en asserts de CI.",
      },
    },
    {
      heading: "branch y risk coverage",
      subtopicId: "S27-T4-A",
      paragraphs: [
        "**Branch coverage** mide si cada rama (if/else) se ejecutó. 100% de líneas ≠ 100% de riesgo cubierto.",
        "**Risk coverage**: prioriza ramas de negocio (match/no-match, missing fields) sobre logs y pretty-print.",
        "Reporta cobertura como evidencia, no como meta vacía: una rama de umbral sin test es deuda del gate CP-N3-A.",
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

# instrumentación simple de ramas
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
          "Si una rama de 'review' nunca se prueba, el clerical queue se romperá en producción sin que CI se entere.",
      },
    },
    {
      heading: "mutación conceptual, fallas útiles y mantenimiento",
      subtopicId: "S27-T4-B",
      paragraphs: [
        "**Mutación conceptual**: cambia deliberadamente el código (quita un strip, invierte un umbral) y verifica que algún test falle. Si no falla, el test es débil.",
        "Fallas **útiles** muestran input sintético, esperado vs actual y el contrato violado. Evita `assert False`.",
        "Mantenimiento: borra tests que solo copian implementación; renombra; parametriza tablas; no duplices oráculos en tres sitios.",
      ],
      code: {
        language: 'python',
        title: "mutation_useful.py",
        code: `def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def normalize_name_mutated(s: str) -> str:
    # mutación: sin strip de espacios internos colapsados
    return s.casefold()

raw = "  Ana  López "
oracle = "ana lópez"
good = normalize_name(raw) == oracle
# el test de regresión DEBE detectar la mutación
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
        title: "Kill the mutant",
        content:
          "Si alteras un comparador y todos los tests siguen verdes, no tienes contrato: tienes teatro de cobertura.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro cómo priorizar riesgos, escribir AAA con oráculos, fixtures aisladas y matar mutantes sobre normalización/matching sintético — inicio de CP-N3-A.",
    steps: [
      {
        demoId: "S27-T1-A-DEMO",
        subtopicId: "S27-T1-A",
        environment: "local-python",
        description: "Prioriza suites unit/integration/e2e por score de riesgo para el motor ER sintético.",
        code: {
          language: 'python',
          title: "risk_rank_demo.py",
          code: `areas = [
    ("normalize", 5, 5, "unit"),
    ("blocking", 4, 4, "unit"),
    ("repo_sql", 4, 2, "integration"),
    ("review_ui", 2, 2, "e2e"),
]
scored = sorted(((i*l, n, layer) for n,i,l,layer in areas), reverse=True)
print("order", [n for _, n, _ in scored])
print("top_layer", scored[0][2])
print("pyramid_ok", scored[0][2] == "unit")`,
          output: `order ['normalize', 'blocking', 'repo_sql', 'review_ui']
top_layer unit
pyramid_ok True`,
        },
        why: "La pirámide + riesgo pone primero los contratos de normalización.",
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
        why: "Oráculo determinista = regresión confiable.",
      },
      {
        demoId: "S27-T2-A-DEMO",
        subtopicId: "S27-T2-A",
        environment: "local-python",
        description: "Descubre nombres test_* y valida un assert de matching exacto post-normalización.",
        code: {
          language: 'python',
          title: "discovery_demo.py",
          code: `import re
module = '''
def test_exact_after_norm():
    a = " ".join("A B".split()).casefold()
    b = "a b"
    assert a == b
def util():
    pass
def test_email_domain():
    assert "x@example.pe".endswith("@example.pe")
'''
names = re.findall(r"^def (test_\\w+)", module, flags=re.M)
print("node_ids", names)
a = " ".join("A B".split()).casefold()
print("assert_exact", a == "a b")
print("n_tests", len(names))`,
          output: `node_ids ['test_exact_after_norm', 'test_email_domain']
assert_exact True
n_tests 2`,
        },
        why: "Discovery predecible y asserts claros aceleran CI.",
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
        why: "Aislamiento function-scope evita flakes de orden.",
      },
      {
        demoId: "S27-T3-A-DEMO",
        subtopicId: "S27-T3-A",
        environment: "local-python",
        description: "Excepción ValueError, isclose de score y escritura en directorio temporal.",
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

try:
    score(None)
except ValueError as e:
    print("exc", str(e))
print("close", math.isclose(0.30000000000000004, 0.3, abs_tol=1e-9))
print("day", date(2026, 1, 15).isoformat())
with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "s.txt"
    p.write_text("0.85", encoding="utf-8")
    print("tmp", p.read_text(encoding="utf-8"))`,
          output: `exc score None
close True
day 2026-01-15
tmp 0.85`,
        },
        why: "Bordes numéricos/temporales evitan tests frágiles.",
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
        why: "Mensajes con valor ofensivo (sintético) aceleran el fix.",
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
        why: "Branch coverage enfocada en umbrales de matching.",
      },
      {
        demoId: "S27-T4-B-DEMO",
        subtopicId: "S27-T4-B",
        environment: "local-python",
        description: "Mutación: quitar casefold; el test de regresión debe fallar (mutante eliminado).",
        code: {
          language: 'python',
          title: "mutation_demo.py",
          code: `def good(s):
    return s.casefold().strip()
def mutant(s):
    return s.strip()  # mutación
oracle = "ana"
raw = "ANA"
print("test_good", good(raw) == oracle)
print("kills_mutant", mutant(raw) != oracle)
print("policy", "regression_on_bug")`,
          output: `test_good True
kills_mutant True
policy regression_on_bug`,
        },
        why: "Si el mutante vive, el test no protege el contrato.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de pirámide, AAA, discovery, fixtures, bordes, negativos, cobertura y mutación.",
    steps: [
      {
        id: "S27-T1-A-E1",
        subtopicId: "S27-T1-A",
        kind: "guided",
        instruction:
          "Dado impact=5 likelihood=4, imprime score=impact*likelihood.",
        hint: "Multiplica enteros",
        hints: [
          "Multiplica enteros",
          "print del producto",
        ],
        edgeCases: ["score 0 si likelihood 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `impact, likelihood = 5, 4
# TODO
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
          "Ordena áreas por score desc y imprime solo los nombres.",
        hint: "sorted reverse",
        hints: [
          "sorted reverse",
          "key con producto",
        ],
        edgeCases: ["empates por nombre"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[('e2e',2,1),('unit',5,5)]
# TODO print names
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
          "Imprime True si la capa top es 'unit'.",
        hint: "compara layer",
        hints: [
          "compara layer",
          "pirámide",
        ],
        edgeCases: ["integration no es unit"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `top_layer='unit'
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `top_layer='unit'
print(top_layer == 'unit')`,
          output: `True`,
        },
      },
      {
        id: "S27-T1-B-E1",
        subtopicId: "S27-T1-B",
        kind: "guided",
        instruction:
          "Implementa normalize: casefold + join de split; imprime resultado de ' A  B '.",
        hint: "casefold",
        hints: [
          "casefold",
          "split/join",
        ],
        edgeCases: ["tabs y NBSP en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `s=' A  B '
# TODO
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
          "AAA: assert normalizado == 'ana' para 'ANA'; imprime 'pass'.",
        hint: "assert luego print",
        hints: [
          "assert luego print",
          "oráculo 'ana'",
        ],
        edgeCases: ["falla ruidosa si rompes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw='ANA'
# TODO
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
          "Oráculo de matching exacto: imprime True si a y b normalizados son iguales.",
        hint: "normaliza ambos",
        hints: [
          "normaliza ambos",
          "compara",
        ],
        edgeCases: ["acentos: casefold ayuda en muchas locales"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='X Y','x  y'
# TODO
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
          "Filtra nombres que empiezan con 'test_' de la lista dada.",
        hint: "startswith",
        hints: [
          "startswith",
          "list comp",
        ],
        edgeCases: ["Test* clases en pytest real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `names=['test_a','helper','test_b']
# TODO
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
          "Si left!=right imprime 'fail' else 'ok' (assert blando).",
        hint: "ternario",
        hints: [
          "ternario",
          "diff conceptual",
        ],
        edgeCases: ["pytest muestra diff"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `left,right='a','b'
# TODO
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
          "Parametriza mentalmente: imprime pares (input, expected) para strip de ' x ' → 'x'.",
        hint: "lista de tuplas",
        hints: [
          "lista de tuplas",
          "tabla",
        ],
        edgeCases: ["varios cases en un test"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO print table
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print([(' x ', 'x')])`,
          output: `[(' x ', 'x')]`,
        },
      },
      {
        id: "S27-T2-B-E1",
        subtopicId: "S27-T2-B",
        kind: "guided",
        instruction:
          "Copia profunda de lista de dicts; muta la copia; original['n'] debe seguir 1.",
        hint: "deepcopy",
        hints: [
          "deepcopy",
          "mutación local",
        ],
        edgeCases: ["copy() superficial falla en dict anidado"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from copy import deepcopy
orig=[{'n':1}]
# TODO
print(orig[0]['n'])`,
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
          "Imprime 'function' como scope por defecto de fixture.",
        hint: "literal",
        hints: [
          "literal",
          "scopes pytest",
        ],
        edgeCases: ["session para recursos caros RO"],
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
          code: `print('function')`,
          output: `function`,
        },
      },
      {
        id: "S27-T2-B-E3",
        subtopicId: "S27-T2-B",
        kind: "transfer",
        instruction:
          "Factory: define make(n) que devuelve n contactos sintéticos; imprime len(make(3)).",
        hint: "list comp",
        hints: [
          "list comp",
          "ids sintéticos",
        ],
        edgeCases: ["datos fakes only"],
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
          "Usa math.isclose(0.1+0.2, 0.3) e imprime el booleano.",
        hint: "import math",
        hints: [
          "import math",
          "isclose",
        ],
        edgeCases: ["abs_tol en scores"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import math
# TODO
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
          "Captura ValueError de int('x') e imprime 'bad'.",
        hint: "try/except",
        hints: [
          "try/except",
          "ValueError",
        ],
        edgeCases: ["mensaje opcional"],
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
          code: `try:
    int('x')
except ValueError:
    print('bad')`,
          output: `bad`,
        },
      },
      {
        id: "S27-T3-A-E3",
        subtopicId: "S27-T3-A",
        kind: "transfer",
        instruction:
          "Escribe 'ok' en un NamedTemporaryFile texto y reimprime su contenido.strip().",
        hint: "tempfile",
        hints: [
          "tempfile",
          "utf-8",
        ],
        edgeCases: ["borrar en finally en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import tempfile
from pathlib import Path
# TODO
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
          "Si email es '' lanza ValueError('email vacío'); caza e imprime el mensaje.",
        hint: "raise ValueError",
        hints: [
          "raise ValueError",
          "except",
        ],
        edgeCases: ["None vs ''"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `email=''
# TODO
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
          "Valida que s contenga '@'; si no, imprime 'invalid' else 'ok'.",
        hint: "in",
        hints: [
          "in",
          "guard",
        ],
        edgeCases: ["no es validación RFC completa"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `s='sin-arroba'
# TODO
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
          "Construye mensaje f\"campo score inválido: {v!r}\" con v=-1 e imprímelo.",
        hint: "f-string !r",
        hints: [
          "f-string !r",
          "sin PII",
        ],
        edgeCases: ["no loguear tokens"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `v=-1
# TODO
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
          "Función f(x) retorna 'hi' si x>0 else 'lo'. Imprime f(1), f(-1).",
        hint: "if/else",
        hints: [
          "if/else",
          "dos prints o tupla",
        ],
        edgeCases: ["rama ==0"],
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
          "Dado set de ramas cubiertas {'auto','review'}, imprime si falta 'non'.",
        hint: "membership",
        hints: [
          "membership",
          "cobertura",
        ],
        edgeCases: ["risk coverage"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `hit={'auto','review'}
# TODO
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
          "Imprime porcentaje de ramas cubiertas: 2 de 3 → redondeado int 66.",
        hint: "int(100*k/n)",
        hints: [
          "int(100*k/n)",
          "branch %",
        ],
        edgeCases: ["no uses solo line coverage"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `k,n=2,3
# TODO
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
          "Mutante: good usa strip, mutant no. Imprime True si mutant(' a ')!='a' o good sí normaliza.",
        hint: "compara",
        hints: [
          "compara",
          "kill mutant",
        ],
        edgeCases: ["mutación de umbral"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `raw=' a '
# TODO detectar debilidad conceptual
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
          "Falla útil: imprime dict con keys expected, actual para expected=1 actual=2.",
        hint: "dict",
        hints: [
          "dict",
          "debug CI",
        ],
        edgeCases: ["include input sintético"],
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
          code: `print({'expected': 1, 'actual': 2})`,
          output: `{'expected': 1, 'actual': 2}`,
        },
      },
      {
        id: "S27-T4-B-E3",
        subtopicId: "S27-T4-B",
        kind: "transfer",
        instruction:
          "Imprime política: 'bug_repro → regression_test' (inicio CP-N3-A).",
        hint: "string",
        hints: [
          "string",
          "mantenimiento",
        ],
        edgeCases: ["un oráculo, muchos cases"],
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
          code: `print('bug_repro → regression_test')`,
          output: `bug_repro → regression_test`,
        },
      },
    ],
  },
  youDo: {
    title: "Contratos pytest de normalización y matching — inicio CP-N3-A",
    context:
      "Construye una mini suite sobre funciones sintéticas de normalización y exact match (contactos fakes @example.pe, run_id cpn3a-01). Cada supuesto del ER futuro debe ser un test ejecutable. Incluye pirámide de riesgo, AAA, fixtures aisladas, bordes y al menos una prueba de mutación conceptual. No marques section_passed ni edites ledger/seed.",
    objectives: [
      "Mapa de riesgos y capas unit/integration/e2e",
      "Tests AAA con oráculos fijos para normalize y exact_match",
      "Fixtures function-scope y casos negativos con mensajes",
      "Cobertura de ramas de umbral + mutante eliminado",
      "Documentación es-PE del contrato de pruebas",
    ],
    requirements: [
      "Datos sintéticos only; sin PII real ni secretos",
      "Cada bug documentado → test de regresión",
      "Matching no implica fraude ni parentesco",
      "Demo reproducible (python -m pytest o scripts de assert)",
      "Alineación a CP-N3-A (inicio)",
    ],
    starterCode: `# CP-N3-A inicio — contratos de normalización/matching
def normalize_name(s: str) -> str:
    return " ".join(s.casefold().split())

def exact_match(a: str, b: str) -> bool:
    return normalize_name(a) == normalize_name(b)

# TODO: tests AAA, negativos, umbrales, mutación conceptual
if __name__ == "__main__":
    assert exact_match(" Ana  ", "ana")
    print("starter_ok")
`,
    portfolioNote:
      "Paquete de inicio CP-N3-A: suite de contratos pytest (o asserts ejecutables) sobre normalización/matching sintético. Otra lane califica PASS; no editar checkpoint/ledger.",
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
        question: "En la pirámide de pruebas, la base más ancha suele ser:",
        options: [
          "E2E UI",
          "Pruebas unitarias",
          "Solo manual",
          "Load tests en prod",
        ],
        correctIndex: 1,
        explanation:
          "Muchas unitarias baratas; pocas E2E caras.",
      },
      {
        question: "Un oráculo confiable es:",
        options: [
          "Un print en consola",
          "Una fuente de verdad determinista para el assert",
          "El reloj del sistema sin fijar",
          "El orden de un set",
        ],
        correctIndex: 1,
        explanation:
          "El assert necesita verdad estable (fija o propiedad).",
      },
      {
        question: "Si mutas un casefold y ningún test falla:",
        options: [
          "Está bien",
          "El contrato es débil; el mutante sobrevivió",
          "pytest está roto siempre",
          "Ignora cobertura",
        ],
        correctIndex: 1,
        explanation:
          "Mutación conceptual detecta tests inútiles.",
      },
      {
        question: "Las pruebas de matching en CP-N3-A demuestran:",
        options: [
          "Fraude automático",
          "Parentescos",
          "Contratos de misma entidad / normalización — no riesgo ni relación",
          "Envío de correos",
        ],
        correctIndex: 2,
        explanation:
          "ER decide misma entidad; no fraude ni parentesco.",
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
        label: "Python unittest.mock (referencia dobles)",
        url: "https://docs.python.org/3/library/unittest.mock.html",
        note: "Preparación para S28",
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
        label: "pytest official getting started",
        url: "https://docs.pytest.org/en/stable/getting-started.html",
        note: "Primeros test_*",
      },
    ],
  },
}
