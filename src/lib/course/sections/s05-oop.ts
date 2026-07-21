import type { CourseSection } from '../../types'

export const section05: CourseSection = {
  id: "oop",
  index: 5,
  title: "Funciones, contratos y descomposición",
  shortTitle: "Funciones & Contratos",
  tagline: "def, defaults seguros, docstrings, pureza e inicio de normalizadores CP-N1-B",
  estimatedHours: 8,
  level: "Principiante",
  phase: 0,
  icon: "FunctionSquare",
  accentColor: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
  jobRelevance:
    "Tras cerrar CP-N1-A, el siguiente salto de calidad en data engineering junior es **descomponer** la lógica en funciones con contrato: normalizar nombre, email, teléfono y dirección **sin** mezclar lectura de archivos. En bancos y fintech en Perú, un normalizador no idempotente o con default mutable genera basura silenciosa en el ETL (CP-N1-B). Esta sección inicia ese camino — OOP de dominio llega en S11.",
  learningOutcomes: [
    { text: "Definir funciones con def, llamarlas y retornar valores (no None accidental)" },
    { text: "Usar parámetros posicionales, keyword y defaults seguros (sin mutables)" },
    { text: "Documentar pre/postcondiciones con docstrings alineados al código" },
    { text: "Anotar type hints graduales y modelar errores de dominio" },
    { text: "Descomponer lógica en funciones pequeñas y orquestadores delgados" },
    { text: "Distinguir pureza de efectos e inyectar I/O en el borde" },
    { text: "Explicar LEGB y escribir closures/factories simples" },
    { text: "Fijar ejemplos/asserts y refactorizar sin cambiar conducta" },
  ],
  theory: [
    {
      heading: "De “OOP” a funciones y contratos (mapa de la sección)",
      paragraphs: [
        "En V3, **S05 no es el path principal de clases, herencia ni dunders de sklearn**. Eso vive en **S11** (OOP y modelo de dominio). Aquí el estudiante domina **funciones con contratos claros**: definición, parámetros seguros, docstrings, type hints graduales, pureza y un poco de LEGB — todo al servicio de **normalizadores** del inicio de **CP-N1-B**.",
        "El hilo conductor es un conjunto de **funciones puras** `normalize_nombre`, `normalize_email`, `normalize_telefono`, `normalize_direccion` que transforman texto sintético sin tocar disco ni red. La I/O se inyecta o se deja fuera. Datos ficticios únicamente.",
        "Orden pedagógico: **T1 Funciones** (def/return → params/defaults) → **T2 Contratos** (pre/post/docstrings → hints y errores de dominio) → **T3 Diseño** (funciones pequeñas → pureza/I/O) → **T4 Alcance** (LEGB/closures → tests y refactor).",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente a S11 / S10",
        content:
          "Material legado de OOP (clases Perro, herencia, ABC, dunders) **no es el camino del estudiante en S05 V3**. El target es **normalizadores puros** con idempotencia demostrada. Packaging/CLI → S10; modelo de dominio OOP → S11.",
      },
    },
    {
      heading: "Definición, llamada y retorno",
      subtopicId: "S05-T1-A",
      paragraphs: [
        "Una función se define con **`def nombre(params):`** y devuelve con **`return`**. Sin `return` explícito, Python devuelve **`None`**. Llamar es `nombre(args)`. El nombre debe ser un **verbo** o acción clara: `normalize_email`, no `email2`.",
        "Las funciones son valores: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalización.",
        "Un solo `return` temprano por caso de error de dominio es legible; evita funciones de 100 líneas con muchos returns confusos — mejor descomponer (T3).",
      ],
      code: {
        language: 'python',
        title: "def_return.py",
        code: `def normalize_nombre(raw: str) -> str:
    return " ".join(raw.strip().split())

print(normalize_nombre("  María   José  "))
print(normalize_nombre("QUISPE"))
# sin return → None
def noop(x):
    x + 1
print(noop(1))`,
        output: `María José
QUISPE
None`,
      },
      callout: {
        type: "tip",
        title: "return vs print",
        content:
          "Los normalizadores **retornan** el valor; el print es de demo. En pipelines, print dentro de la función pura es un efecto colateral indeseado.",
      },
    },
    {
      heading: "Posicionales, keyword y defaults seguros",
      subtopicId: "S05-T1-B",
      paragraphs: [
        "Argumentos **posicionales** se atan por orden; **keyword** por nombre (`fn(x=1)`). Los **defaults** se evalúan **una vez** en la definición: **nunca uses lista/dict mutable como default** (`def f(xs=[])` es un bug clásico). Usa `None` y crea la lista dentro.",
        "Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los keyword tras posicionales mejoran la lectura en sites de llamada largos.",
        "Para normalizadores: `def normalize_telefono(raw, *, country=\"PE\")` con keyword-only opcional documenta la política regional sin confundir posiciones.",
      ],
      code: {
        language: 'python',
        title: "params_defaults.py",
        code: `def etiqueta(nombre, prefijo="Sr./Sra.", *, upper=False):
    s = f"{prefijo} {nombre}"
    return s.upper() if upper else s

print(etiqueta("Quispe"))
print(etiqueta("Quispe", prefijo="Cliente"))
print(etiqueta("Quispe", upper=True))

# Default mutable — MAL (demostración del bug)
def bad_add(item, bucket=[]):
    bucket.append(item)
    return bucket
print(bad_add(1), bad_add(2))  # ¡comparte la misma lista!

def good_add(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
print(good_add(1), good_add(2))`,
        output: `Sr./Sra. Quispe
Cliente Quispe
SR./SRA. QUISPE
[1, 2] [1, 2]
[1] [2]`,
      },
      callout: {
        type: "danger",
        title: "Default mutable",
        content:
          "Si ves `def f(x, acc=[])` en un PR de normalización, es P1. Usa None + creación local.",
      },
    },
    {
      heading: "Pre/postcondiciones y docstrings",
      subtopicId: "S05-T2-A",
      paragraphs: [
        "Una **precondición** es lo que debe cumplirse **antes** de llamar (p. ej. `raw` es str). Una **postcondición** es lo que garantiza el return (p. ej. sin espacios extremos, minúsculas en email local-domain policy).",
        "El **docstring** (PEP 257) documenta contrato en español o inglés consistente del proyecto: qué hace, parámetros, retorno, errores. No copies la firma; explica la política de negocio.",
        "En intake sintético: pre = tipo str o None; post = forma canónica o ValueError/resultado de error de dominio según el diseño elegido.",
      ],
      code: {
        language: 'python',
        title: "docstring_email.py",
        code: `def normalize_email(raw: str) -> str:
    """Normaliza email sintético de intake.

    Pre: raw es str no vacío tras strip.
    Post: devuelve lowercased sin espacios extremos.
    Raises: ValueError si falta '@' o queda vacío.
    """
    s = raw.strip().lower()
    if not s or "@" not in s:
        raise ValueError("email inválido para normalizar")
    return s

print(normalize_email("  Ana.Perez@Example.COM "))
try:
    normalize_email("sin-arroba")
except ValueError as e:
    print("err:", e)`,
        output: `ana.perez@example.com
err: email inválido para normalizar`,
      },
      callout: {
        type: "tip",
        title: "Contrato legible",
        content:
          "Si el docstring y el código discrepan, gana el código — pero el revisor te devuelve el PR. Manténlos alineados.",
      },
    },
    {
      heading: "Type hints graduales y errores de dominio",
      subtopicId: "S05-T2-B",
      paragraphs: [
        "Los **type hints** (`def f(x: str) -> str`) no convierten en runtime (salvo herramientas externas). Son documentación verificable con checkers. En S05 usamos hints **graduales**: anota lo público; no atasques con genéricos avanzados.",
        "Un **error de dominio** no es un bug de Python: es un valor de negocio inválido. Opciones: `raise ValueError`, devolver `(ok, value, error)`, o un dict de resultado. Sé consistente en el módulo.",
        "`Optional[str]` / `str | None` documenta ausencia. No uses hints falsos (`-> str` si puedes devolver None).",
      ],
      code: {
        language: 'python',
        title: "hints_dominio.py",
        code: `from typing import Optional, Tuple

def parse_edad(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:
    try:
        n = int(raw.strip())
    except ValueError:
        return False, None, "no es entero"
    if n < 0 or n > 120:
        return False, None, "fuera de rango de dominio"
    return True, n, None

for v in ["34", "abc", "200"]:
    print(v, "→", parse_edad(v))`,
        output: `34 → (True, 34, None)
abc → (False, None, 'no es entero')
200 → (False, None, 'fuera de rango de dominio')`,
      },
      callout: {
        type: "tip",
        title: "ValueError vs return",
        content:
          "raise para APIs internas puras; tupla/result object cuando el lote no debe abortar en la primera fila mala.",
      },
    },
    {
      heading: "Funciones pequeñas y composición",
      subtopicId: "S05-T3-A",
      paragraphs: [
        "Una función debe hacer **una cosa** en el nivel de abstracción correcto. Si normalizas nombre y además escribes archivo y logueas, sepáralas. **Componer** es llamar funciones pequeñas desde una orquestadora delgada.",
        "Beneficio: tests unitarios fáciles, reuso en CLI (S10) y en ETL (S08). El orquestador `normalize_record` llama a cuatro normalizadores y arma el dict.",
        "Regla práctica: si necesitas un comentario de sección en medio de la función, probablemente es otra función.",
      ],
      code: {
        language: 'python',
        title: "composicion.py",
        code: `def strip_collapse(s: str) -> str:
    return " ".join(s.strip().split())

def title_case_name(s: str) -> str:
    return strip_collapse(s).title()

def normalize_nombre(raw: str) -> str:
    return title_case_name(raw)

def normalize_record(nombres: str, email: str) -> dict:
    return {
        "nombres": normalize_nombre(nombres),
        "email": email.strip().lower(),
    }

print(normalize_record("  maría  josé ", "  X@Y.COM "))`,
        output: `{'nombres': 'María José', 'email': 'x@y.com'}`,
      },
      callout: {
        type: "tip",
        title: "Orquestador delgado",
        content:
          "normalize_record no reimplementa strip: delega. Así un fix en strip_collapse beneficia a todos.",
      },
    },
    {
      heading: "Pureza, efectos e inyección de I/O",
      subtopicId: "S05-T3-B",
      paragraphs: [
        "Una función **pura** devuelve el mismo resultado para los mismos argumentos y **no tiene efectos** (no imprime, no lee disco, no muta globales ni los argumentos mutables del caller sin documentarlo).",
        "La **I/O** (stdin, archivos, red) se queda en el borde: `main`, CLI, o funciones `load_*` / `save_*`. Los normalizadores del gate deben ser puros e **idempotentes**: `f(f(x)) == f(x)` para entradas válidas.",
        "**Inyección**: pasar una función `reader` o un path como argumento en vez de hardcodear `open('data.csv')` dentro del core facilita tests con fakes.",
        "**`lambda`**: una función anónima de una expresión. Sintaxis: `lambda args: expresión`. Ejemplo: `normalize_email = lambda s: s.strip().lower()` es equivalente a un `def` de una línea. Úsala para inyectar un normalizador rápido en tests o demos; si la lógica crece, prefiera un `def` con nombre. No es un reemplazo general de funciones: no admite múltiples statements ni es más rápida.",
      ],
      code: {
        language: 'python',
        title: "pureza_idem.py",
        code: `def normalize_telefono(raw: str) -> str:
    digits = "".join(ch for ch in raw if ch.isdigit())
    return digits

# Idempotencia
x = "999-000-111"
y = normalize_telefono(x)
z = normalize_telefono(y)
print(y, z, "idempotent=", y == z)

# I/O al borde (simulado) + lambda como inyección puntual
def process_line(line: str, norm=normalize_telefono) -> str:
    return norm(line)

print(process_line(" (01) 234-5678 "))
print(process_line(" A@B.COM ", norm=lambda s: s.strip().lower()))`,
        output: `999000111 999000111 idempotent= True
012345678`,
      },
      callout: {
        type: "warning",
        title: "Gate CP-N1-B inicio",
        content:
          "Si tu normalize_email abre un archivo o imprime, no es puro. Sepáralo antes del review del incremento.",
      },
    },
    {
      heading: "LEGB y closures básicos",
      subtopicId: "S05-T4-A",
      paragraphs: [
        "**LEGB**: orden de búsqueda de nombres — **L**ocal, **E**nclosing (funciones anidadas), **G**lobal, **B**uiltin. Si Python no halla el nombre, `NameError`.",
        "Un **closure** es una función interna que recuerda variables del enclosing scope. Útil para fabricar normalizadores configurados (`make_stripper(chars)`), sin clases todavía.",
        "`global` y `nonlocal` existen pero en S05 casi no los necesitas: prefiere **return** de valores nuevos. Mutar globales complica tests.",
      ],
      code: {
        language: 'python',
        title: "legb_closure.py",
        code: `PREF = "+51"  # global del módulo (demo)

def make_phone_normalizer(prefix: str):
    def norm(raw: str) -> str:
        d = "".join(c for c in raw if c.isdigit())
        if d.startswith("51") and len(d) > 9:
            d = d[2:]
        return prefix + d if not d.startswith("+") else d
    return norm

pe = make_phone_normalizer(PREF)
print(pe("999000111"))
print(pe("+51999000111"))

x = 10
def outer():
    x = 20
    def inner():
        return x  # enclosing
    return inner()
print("LEGB enclosing x →", outer())`,
        output: `+51999000111
+51999000111
LEGB enclosing x → 20`,
      },
      callout: {
        type: "tip",
        title: "Sin global",
        content:
          "Pasa la config como argumento o closure factory. Evita `global PREF` en normalizadores.",
      },
    },
    {
      heading: "Pruebas de ejemplo y refactor sin cambiar conducta",
      subtopicId: "S05-T4-B",
      paragraphs: [
        "Antes de refactorizar, fija **ejemplos ejecutables**: `assert normalize_email('A@B.COM') == 'a@b.com'`. Luego cambia la forma interna; si los asserts siguen verdes, la conducta se preservó.",
        "El refactor típico de S05: extraer `strip_collapse`, unificar defaults, renombrar. **No** cambies la política de negocio “de paso” sin actualizar tests y docstring.",
        "Idempotencia se prueba con un loop o doble llamada. Fronteras: vacío, solo espacios, Unicode (`Ñ`, tildes), None si el contrato lo admite.",
      ],
      code: {
        language: 'python',
        title: "refactor_seguro.py",
        code: `def normalize_email(raw: str) -> str:
    return raw.strip().lower()

def _examples() -> None:
    assert normalize_email("  A@B.COM ") == "a@b.com"
    assert normalize_email(normalize_email("A@B.COM")) == "a@b.com"
    print("examples OK")

# refactor interno: misma conducta
def normalize_email(raw: str) -> str:
    s = raw.strip()
    return s.lower()

_examples()
print(normalize_email("Ana@Example.COM"))`,
        output: `examples OK
ana@example.com`,
      },
      callout: {
        type: "tip",
        title: "Rojo-verde-refactor",
        content:
          "Si no tienes ejemplos, no refactorices. El gate de normalizadores exige idempotencia demostrada.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do (uno por subtema). Del def al refactor con ejemplos. Los normalizadores son el hilo hacia CP-N1-B. Datos sintéticos; browser-pyodide.",
    steps: [
      {
        demoId: "S05-T1-A-DEMO",
        subtopicId: "S05-T1-A",
        environment: "browser-pyodide",
        description: "def + return de normalize_nombre collapsando espacios",
        code: {
          language: 'python',
          title: "S05-T1-A-DEMO — def_nombre",
          code: `def normalize_nombre(raw):
    return " ".join(raw.strip().split())

for s in ["  Ana  ", "María  José", "QUISPE"]:
    print(repr(s), "→", repr(normalize_nombre(s)))`,
          output: `'  Ana  ' → 'Ana'
'María  José' → 'María José'
'QUISPE' → 'QUISPE'`,
        },
        why: "Una función, un return, casos con espacios y Unicode simple.",
      },
      {
        demoId: "S05-T1-B-DEMO",
        subtopicId: "S05-T1-B",
        environment: "browser-pyodide",
        description: "Defaults seguros vs default mutable bug",
        code: {
          language: 'python',
          title: "S05-T1-B-DEMO — defaults",
          code: `def good(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

def bad(item, bucket=[]):
    bucket.append(item)
    return bucket

print("good", good(1), good(2))
print("bad ", bad(1), bad(2))`,
          output: `good [1] [2]
bad  [1, 2] [1, 2]`,
        },
        why: "good crea listas nuevas; bad comparte el default entre llamadas.",
      },
      {
        demoId: "S05-T2-A-DEMO",
        subtopicId: "S05-T2-A",
        environment: "browser-pyodide",
        description: "Docstring + pre/post en normalize_email",
        code: {
          language: 'python',
          title: "S05-T2-A-DEMO — email_contract",
          code: `def normalize_email(raw: str) -> str:
    """Pre: str. Post: lower strip con @. Raises ValueError."""
    s = raw.strip().lower()
    if "@" not in s:
        raise ValueError("falta @")
    return s

print(normalize_email("  X@Y.COM "))
try:
    normalize_email("x")
except ValueError as e:
    print("ValueError", e)`,
          output: `x@y.com
ValueError falta @`,
        },
        why: "El contrato está en el docstring y se enforce con raise.",
      },
      {
        demoId: "S05-T2-B-DEMO",
        subtopicId: "S05-T2-B",
        environment: "browser-pyodide",
        description: "Type hints + resultado de dominio sin abortar el lote",
        code: {
          language: 'python',
          title: "S05-T2-B-DEMO — hints_tel",
          code: `from typing import Optional, Tuple

def norm_tel(raw: str) -> Tuple[bool, Optional[str], Optional[str]]:
    d = "".join(c for c in raw if c.isdigit())
    if len(d) != 9:
        return False, None, "se esperan 9 dígitos"
    return True, d, None

for v in ["999000111", "123", "999-000-111"]:
    print(v, norm_tel(v))`,
          output: `999000111 (True, '999000111', None)
123 (False, None, 'se esperan 9 dígitos')
999-000-111 (True, '999000111', None)`,
        },
        why: "Hints documentan la tupla; el lote puede seguir tras un False.",
      },
      {
        demoId: "S05-T3-A-DEMO",
        subtopicId: "S05-T3-A",
        environment: "browser-pyodide",
        description: "Componer strip + lower + orquestador de registro",
        code: {
          language: 'python',
          title: "S05-T3-A-DEMO — compose",
          code: `def strip_collapse(s: str) -> str:
    return " ".join(s.strip().split())

def norm_email(s: str) -> str:
    return s.strip().lower()

def normalize_pair(nombre: str, email: str) -> dict:
    return {"nombre": strip_collapse(nombre).title(), "email": norm_email(email)}

print(normalize_pair("  ana  perez ", "  Ana@Example.COM "))`,
          output: `{'nombre': 'Ana Perez', 'email': 'ana@example.com'}`,
        },
        why: "Orquestador delgado reutiliza piezas pequeñas.",
      },
      {
        demoId: "S05-T3-B-DEMO",
        subtopicId: "S05-T3-B",
        environment: "browser-pyodide",
        description: "Idempotencia de normalize_telefono puro",
        code: {
          language: 'python',
          title: "S05-T3-B-DEMO — idem_tel",
          code: `def normalize_telefono(raw: str) -> str:
    return "".join(c for c in raw if c.isdigit())

samples = ["999-000-111", "(999) 000 111", "999000111"]
for s in samples:
    once = normalize_telefono(s)
    twice = normalize_telefono(once)
    print(s, "→", once, "idem=", once == twice)`,
          output: `999-000-111 → 999000111 idem= True
(999) 000 111 → 999000111 idem= True
999000111 → 999000111 idem= True`,
        },
        why: "f(f(x))==f(x) en los tres samples; sin I/O en la función.",
      },
      {
        demoId: "S05-T4-A-DEMO",
        subtopicId: "S05-T4-A",
        environment: "browser-pyodide",
        description: "Closure factory para prefijo de teléfono",
        code: {
          language: 'python',
          title: "S05-T4-A-DEMO — closure",
          code: `def make_norm(prefix: str):
    def norm(raw: str) -> str:
        d = "".join(c for c in raw if c.isdigit())
        return prefix + d
    return norm

pe = make_norm("+51")
print(pe("999000111"))
print(pe("999-000-111"))`,
          output: `+51999000111
+51999000111`,
        },
        why: "La interna recuerda prefix del enclosing scope sin global.",
      },
      {
        demoId: "S05-T4-B-DEMO",
        subtopicId: "S05-T4-B",
        environment: "browser-pyodide",
        description: "Ejemplos assert antes y después de micro-refactor",
        code: {
          language: 'python',
          title: "S05-T4-B-DEMO — refactor",
          code: `def normalize_direccion(raw: str) -> str:
    return " ".join(raw.strip().split()).upper()

def examples(fn):
    assert fn("  av. larco 123 ") == "AV. LARCO 123"
    assert fn(fn("Calle 1")) == fn("Calle 1")
    return True

assert examples(normalize_direccion)

def normalize_direccion(raw: str) -> str:
    parts = raw.strip().split()
    return " ".join(parts).upper()

assert examples(normalize_direccion)
print("refactor OK", normalize_direccion("  jr. unión 5 "))`,
          output: `refactor OK JR. UNIÓN 5`,
        },
        why: "Misma suite de ejemplos en verde tras cambiar la implementación.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints**. Ejecuta y compara. Datos sintéticos únicamente.",
    steps: [
      {
        id: "S05-T1-A-E1",
        subtopicId: "S05-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Escribe `def doble(n):` que retorne `n*2`. Imprime doble(21).",
        hint: "return n * 2",
        hints: [
          "return n * 2",
          "No uses print dentro de doble.",
        ],
        edgeCases: ["return vs print"],
        tests: "42",
        feedback: "return entrega el valor al caller.",
        starterCode: {
          language: 'python',
          title: "doble.py",
          code: `def doble(n):
    # TODO
    ...
print(doble(21))`,
        },
        solutionCode: {
          language: 'python',
          title: "doble.py",
          code: `def doble(n):
    return n * 2
print(doble(21))`,
          output: `42`,
        },
      },
      {
        id: "S05-T1-A-E2",
        subtopicId: "S05-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — `normalize_nombre(raw)` colapsa espacios internos y strip. Prueba con `'  Juan   Pérez '`.",
        hint: "\" \".join(raw.strip().split())",
        hints: [
          "\" \".join(raw.strip().split())",
          "title() es opcional; aquí solo colapsar.",
        ],
        edgeCases: ["espacios múltiples"],
        tests: "Juan Pérez",
        feedback: "Base del normalizador de nombres del capstone.",
        starterCode: {
          language: 'python',
          title: "norm_nombre.py",
          code: `def normalize_nombre(raw):
    # TODO
    ...
print(normalize_nombre('  Juan   Pérez '))`,
        },
        solutionCode: {
          language: 'python',
          title: "norm_nombre.py",
          code: `def normalize_nombre(raw):
    return " ".join(raw.strip().split())
print(normalize_nombre('  Juan   Pérez '))`,
          output: `Juan Pérez`,
        },
      },
      {
        id: "S05-T1-A-E3",
        subtopicId: "S05-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Función `saluda(nombre)` que retorne el string; en main imprime el return. Demuestra que sin return print(saluda(...)) muestra None si olvidas return (arregla para que no sea None).",
        hint: "Si ves None, falta return.",
        hints: [
          "Si ves None, falta return.",
          "return f'Hola {nombre}'",
        ],
        edgeCases: ["None implícito"],
        tests: "Hola Ana",
        feedback: "El bug None es el más común al migrar de scripts a funciones.",
        starterCode: {
          language: 'python',
          title: "return_none.py",
          code: `def saluda(nombre):
    f'Hola {nombre}'  # BUG?
print(saluda('Ana'))`,
        },
        solutionCode: {
          language: 'python',
          title: "return_none.py",
          code: `def saluda(nombre):
    return f'Hola {nombre}'
print(saluda('Ana'))`,
          output: `Hola Ana`,
        },
      },
      {
        id: "S05-T1-B-E1",
        subtopicId: "S05-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — `def present(nombre, titulo='Cliente'):` retorna `f'{titulo}: {nombre}'`. Llama posicional y con keyword titulo=.",
        hint: "default solo se usa si omites el arg",
        hints: [
          "default solo se usa si omites el arg",
          "Dos prints distintos",
        ],
        edgeCases: ["keyword override"],
        tests: "Cliente: / VIP:",
        feedback: "Keyword hace legible la política en el call site.",
        starterCode: {
          language: 'python',
          title: "present.py",
          code: `def present(nombre, titulo='Cliente'):
    # TODO
    ...
print(present('Quispe'))
print(present('Quispe', titulo='VIP'))`,
        },
        solutionCode: {
          language: 'python',
          title: "present.py",
          code: `def present(nombre, titulo='Cliente'):
    return f'{titulo}: {nombre}'
print(present('Quispe'))
print(present('Quispe', titulo='VIP'))`,
          output: `Cliente: Quispe
VIP: Quispe`,
        },
      },
      {
        id: "S05-T1-B-E2",
        subtopicId: "S05-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Reescribe un `bad_add` con default mutable a la versión segura con None. Muestra dos llamadas good(1), good(2) independientes.",
        hint: "if bucket is None: bucket = []",
        hints: [
          "if bucket is None: bucket = []",
          "No deben compartir lista.",
        ],
        edgeCases: ["default None"],
        tests: "[1] luego [2]",
        feedback: "Default mutable es anti-patrón de producción.",
        starterCode: {
          language: 'python',
          title: "safe_default.py",
          code: `def good_add(item, bucket=None):
    # TODO
    ...
print(good_add(1))
print(good_add(2))`,
        },
        solutionCode: {
          language: 'python',
          title: "safe_default.py",
          code: `def good_add(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
print(good_add(1))
print(good_add(2))`,
          output: `[1]
[2]`,
        },
      },
      {
        id: "S05-T1-B-E3",
        subtopicId: "S05-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — `normalize_telefono(raw, *, digits_only=True)` keyword-only. Si digits_only, deja solo dígitos; si False, solo strip. Demuestra ambas llamadas por keyword.",
        hint: "El * fuerza keyword para digits_only.",
        hints: [
          "El * fuerza keyword para digits_only.",
          "normalize_telefono(' 999-1 ', digits_only=False)",
        ],
        edgeCases: ["keyword-only"],
        tests: "999000 y 999-000",
        feedback: "Keyword-only documenta flags de política regional.",
        starterCode: {
          language: 'python',
          title: "kwonly_tel.py",
          code: `def normalize_telefono(raw, *, digits_only=True):
    # TODO
    ...
print(normalize_telefono(' 999-000 '))
print(normalize_telefono(' 999-000 ', digits_only=False))`,
        },
        solutionCode: {
          language: 'python',
          title: "kwonly_tel.py",
          code: `def normalize_telefono(raw, *, digits_only=True):
    s = raw.strip()
    if digits_only:
        return ''.join(c for c in s if c.isdigit())
    return s
print(normalize_telefono(' 999-000 '))
print(normalize_telefono(' 999-000 ', digits_only=False))`,
          output: `999000
999-000`,
        },
      },
      {
        id: "S05-T2-A-E1",
        subtopicId: "S05-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Añade docstring de una línea a `def area(w, h): return w*h` e imprime `area.__doc__`.",
        hint: "Triple comillas justo bajo def",
        hints: [
          "Triple comillas justo bajo def",
          "Docstring no es un comentario #",
        ],
        edgeCases: ["__doc__"],
        tests: "doc + 12",
        feedback: "__doc__ es legible por help() y herramientas.",
        starterCode: {
          language: 'python',
          title: "doc_area.py",
          code: `def area(w, h):
    # TODO docstring
    return w * h
print(area.__doc__)
print(area(3, 4))`,
        },
        solutionCode: {
          language: 'python',
          title: "doc_area.py",
          code: `def area(w, h):
    """Retorna el área de un rectángulo w×h."""
    return w * h
print(area.__doc__)
print(area(3, 4))`,
          output: `Retorna el área de un rectángulo w×h.
12`,
        },
      },
      {
        id: "S05-T2-A-E2",
        subtopicId: "S05-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — `normalize_email` con pre/post en docstring: strip+lower; ValueError si no hay @. Prueba OK y error.",
        hint: "if '@' not in s: raise ValueError",
        hints: [
          "if '@' not in s: raise ValueError",
          "Mensaje accionable en español.",
        ],
        edgeCases: ["ValueError dominio"],
        tests: "a@b.com + err",
        feedback: "Pre/post en docstring + raise alineados.",
        starterCode: {
          language: 'python',
          title: "email_prepost.py",
          code: `def normalize_email(raw: str) -> str:
    """TODO pre/post"""
    # TODO
    ...
print(normalize_email('  A@B.COM '))
try:
    normalize_email('x')
except ValueError as e:
    print('err', e)`,
        },
        solutionCode: {
          language: 'python',
          title: "email_prepost.py",
          code: `def normalize_email(raw: str) -> str:
    """Pre: str. Post: lower/strip con @. Raises ValueError."""
    s = raw.strip().lower()
    if '@' not in s:
        raise ValueError('email sin @')
    return s
print(normalize_email('  A@B.COM '))
try:
    normalize_email('x')
except ValueError as e:
    print('err', e)`,
          output: `a@b.com
err email sin @`,
        },
      },
      {
        id: "S05-T2-A-E3",
        subtopicId: "S05-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Documenta y escribe `normalize_nombre` con postcondición: no empiezan/terminan espacios y no hay dobles espacios. Assert de la postcondición en un ejemplo.",
        hint: "assert result == result.strip() and '  ' not in result",
        hints: [
          "assert result == result.strip() and '  ' not in result",
          "La post se puede chequear en tests.",
        ],
        edgeCases: ["postcondición testeable"],
        tests: "Ana María + post OK",
        feedback: "Contrato + assert de ejemplo = especificación viva.",
        starterCode: {
          language: 'python',
          title: "post_nombre.py",
          code: `def normalize_nombre(raw: str) -> str:
    """Post: sin extremos ni dobles espacios."""
    # TODO
    ...
r = normalize_nombre('  Ana  María  ')
print(r)
assert r == r.strip() and '  ' not in r
print('post OK')`,
        },
        solutionCode: {
          language: 'python',
          title: "post_nombre.py",
          code: `def normalize_nombre(raw: str) -> str:
    """Post: sin extremos ni dobles espacios."""
    return ' '.join(raw.strip().split())
r = normalize_nombre('  Ana  María  ')
print(r)
assert r == r.strip() and '  ' not in r
print('post OK')`,
          output: `Ana María
post OK`,
        },
      },
      {
        id: "S05-T2-B-E1",
        subtopicId: "S05-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Anota `def len_safe(s: str) -> int` y retorna len. Imprime el resultado y un comentario mental de que el hint no valida en runtime.",
        hint: "hints no ejecutan isinstance mágicamente",
        hints: [
          "hints no ejecutan isinstance mágicamente",
          "len_safe(123) fallaría en runtime igual",
        ],
        edgeCases: ["hints graduales"],
        tests: "3 + nota",
        feedback: "Hints son contrato para humanos y typecheckers.",
        starterCode: {
          language: 'python',
          title: "hint_len.py",
          code: `def len_safe(s: str) -> int:
    return len(s)
print(len_safe('abc'))`,
        },
        solutionCode: {
          language: 'python',
          title: "hint_len.py",
          code: `def len_safe(s: str) -> int:
    return len(s)
print(len_safe('abc'))
print('hint no valida en runtime')`,
          output: `3
hint no valida en runtime`,
        },
      },
      {
        id: "S05-T2-B-E2",
        subtopicId: "S05-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — `parse_monto(raw: str) -> tuple` (ok, value, err). Acepta enteros >=0; error de dominio si negativo o no int.",
        hint: "try int; if n<0 dominio",
        hints: [
          "try int; if n<0 dominio",
          "0 es válido.",
        ],
        edgeCases: ["0 válido", "negativo dominio"],
        tests: "4 casos",
        feedback: "Separar ValueError de parse vs regla de dominio.",
        starterCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `from typing import Optional, Tuple

def parse_monto(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:
    # TODO
    ...
for v in ['0', '10', '-1', 'x']:
    print(v, parse_monto(v))`,
        },
        solutionCode: {
          language: 'python',
          title: "parse_monto.py",
          code: `from typing import Optional, Tuple

def parse_monto(raw: str) -> Tuple[bool, Optional[int], Optional[str]]:
    try:
        n = int(raw.strip())
    except ValueError:
        return False, None, 'no es entero'
    if n < 0:
        return False, None, 'negativo no permitido'
    return True, n, None
for v in ['0', '10', '-1', 'x']:
    print(v, parse_monto(v))`,
          output: `0 (True, 0, None)
10 (True, 10, None)
-1 (False, None, 'negativo no permitido')
x (False, None, 'no es entero')`,
        },
      },
      {
        id: "S05-T2-B-E3",
        subtopicId: "S05-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Elige raise ValueError **o** tupla para `normalize_email` y documenta por qué en un print. Implementa la opción raise y captura en el caller del lote (for de 2 emails).",
        hint: "Lote: try/except por fila para no abortar todo",
        hints: [
          "Lote: try/except por fila para no abortar todo",
          "Una fila mala no impide la buena",
        ],
        edgeCases: ["borde I/O vs core"],
        tests: "OK + SKIP",
        feedback: "Core estricto + borde tolerante es un diseño limpio.",
        starterCode: {
          language: 'python',
          title: "raise_vs_tuple.py",
          code: `def normalize_email(raw: str) -> str:
    # TODO raise
    ...
for e in ['ok@ex.com', 'malo']:
    # TODO try/except print`,
        },
        solutionCode: {
          language: 'python',
          title: "raise_vs_tuple.py",
          code: `def normalize_email(raw: str) -> str:
    s = raw.strip().lower()
    if '@' not in s:
        raise ValueError('email inválido')
    return s
print('estrategia: raise + try por fila en el borde')
for e in ['ok@ex.com', 'malo']:
    try:
        print('OK', normalize_email(e))
    except ValueError as err:
        print('SKIP', e, err)`,
          output: `estrategia: raise + try por fila en el borde
OK ok@ex.com
SKIP malo email inválido`,
        },
      },
      {
        id: "S05-T3-A-E1",
        subtopicId: "S05-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Extrae `strip_collapse` y úsalo dentro de `normalize_nombre` que además hace .title().",
        hint: "def strip_collapse; return strip_collapse(raw).title()",
        hints: [
          "def strip_collapse; return strip_collapse(raw).title()",
          "Composición de dos pasos.",
        ],
        edgeCases: ["title after collapse"],
        tests: "Ana María",
        feedback: "Piezas pequeñas se testean solas.",
        starterCode: {
          language: 'python',
          title: "extract_strip.py",
          code: `def strip_collapse(s):
    # TODO
    ...
def normalize_nombre(raw):
    # TODO
    ...
print(normalize_nombre('  ana  maría '))`,
        },
        solutionCode: {
          language: 'python',
          title: "extract_strip.py",
          code: `def strip_collapse(s):
    return ' '.join(s.strip().split())
def normalize_nombre(raw):
    return strip_collapse(raw).title()
print(normalize_nombre('  ana  maría '))`,
          output: `Ana María`,
        },
      },
      {
        id: "S05-T3-A-E2",
        subtopicId: "S05-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Orquestador `normalize_contact(nombre, email)` devuelve dict usando dos helpers.",
        hint: "return {'nombre': ..., 'email': ...}",
        hints: [
          "return {'nombre': ..., 'email': ...}",
          "email lower strip",
        ],
        edgeCases: ["dict orquestado"],
        tests: "Luis + l@e.com",
        feedback: "El orquestador no reimplementa reglas.",
        starterCode: {
          language: 'python',
          title: "orch_contact.py",
          code: `def norm_n(s):
    return ' '.join(s.strip().split()).title()
def norm_e(s):
    return s.strip().lower()
def normalize_contact(nombre, email):
    # TODO
    ...
print(normalize_contact('  luis ', '  L@E.COM '))`,
        },
        solutionCode: {
          language: 'python',
          title: "orch_contact.py",
          code: `def norm_n(s):
    return ' '.join(s.strip().split()).title()
def norm_e(s):
    return s.strip().lower()
def normalize_contact(nombre, email):
    return {'nombre': norm_n(nombre), 'email': norm_e(email)}
print(normalize_contact('  luis ', '  L@E.COM '))`,
          output: `{'nombre': 'Luis', 'email': 'l@e.com'}`,
        },
      },
      {
        id: "S05-T3-A-E3",
        subtopicId: "S05-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Parte una función monstruo de 10 líneas (nombre+email+tel en un solo def con comentarios) en 3 funciones + orquestador. Misma salida.",
        hint: "Cada campo = una función",
        hints: [
          "Cada campo = una función",
          "Salida dict con 3 claves",
        ],
        edgeCases: ["descomposición"],
        tests: "3 keys normalizadas",
        feedback: "Si el monstruo vuelve, el PR se rechaza en code review.",
        starterCode: {
          language: 'python',
          title: "split_monster.py",
          code: `# monstruo a reemplazar conceptualmente
def normalize_all(n, e, t):
    # TODO descomponer
    ...
print(normalize_all('  Ana ', 'A@B.COM', '999-1'))`,
        },
        solutionCode: {
          language: 'python',
          title: "split_monster.py",
          code: `def n_nombre(n):
    return ' '.join(n.strip().split()).title()
def n_email(e):
    return e.strip().lower()
def n_tel(t):
    return ''.join(c for c in t if c.isdigit())
def normalize_all(n, e, t):
    return {'nombre': n_nombre(n), 'email': n_email(e), 'tel': n_tel(t)}
print(normalize_all('  Ana ', 'A@B.COM', '999-1'))`,
          output: `{'nombre': 'Ana', 'email': 'a@b.com', 'tel': '9991'}`,
        },
      },
      {
        id: "S05-T3-B-E1",
        subtopicId: "S05-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Escribe `normalize_tel` puro (solo dígitos). Demuestra idempotencia con dos llamadas encadenadas.",
        hint: "once = f(x); twice = f(once); print once==twice",
        hints: [
          "once = f(x); twice = f(once); print once==twice",
          "Sin print dentro de normalize_tel.",
        ],
        edgeCases: ["idempotencia"],
        tests: "999000 True",
        feedback: "Idempotencia es el test mínimo del gate.",
        starterCode: {
          language: 'python',
          title: "pure_tel.py",
          code: `def normalize_tel(raw):
    # TODO
    ...
x = '999-000'
once = normalize_tel(x)
print(once, normalize_tel(once) == once)`,
        },
        solutionCode: {
          language: 'python',
          title: "pure_tel.py",
          code: `def normalize_tel(raw):
    return ''.join(c for c in raw if c.isdigit())
x = '999-000'
once = normalize_tel(x)
print(once, normalize_tel(once) == once)`,
          output: `999000 True`,
        },
      },
      {
        id: "S05-T3-B-E2",
        subtopicId: "S05-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Separa: `normalize_email` puro + `print_report(email)` con efecto de print. No imprimas dentro del normalizador.",
        hint: "print solo en print_report",
        hints: [
          "print solo en print_report",
          "Core testeable sin capturar stdout",
        ],
        edgeCases: ["efecto al borde"],
        tests: "email= z@w.com",
        feedback: "Efectos al borde, pureza al centro.",
        starterCode: {
          language: 'python',
          title: "io_borde.py",
          code: `def normalize_email(raw):
    # TODO puro
    ...
def print_report(raw):
    # TODO efecto
    ...
print_report('  Z@W.COM ')`,
        },
        solutionCode: {
          language: 'python',
          title: "io_borde.py",
          code: `def normalize_email(raw):
    return raw.strip().lower()
def print_report(raw):
    print('email=', normalize_email(raw))
print_report('  Z@W.COM ')`,
          output: `email= z@w.com`,
        },
      },
      {
        id: "S05-T3-B-E3",
        subtopicId: "S05-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Inyecta un normalizador: `process(line, norm=normalize_tel)` usa la fn inyectada. Llama con default y con un norm alternativo que deja todo upper strip.",
        hint: "norm es parámetro con default",
        hints: [
          "norm es parámetro con default",
          "Demuestra dos comportamientos",
        ],
        edgeCases: ["inyección de dependencia simple"],
        tests: "999 y 999-A",
        feedback: "Inyectar la fn permite tests con fakes sin monkeypatch.",
        starterCode: {
          language: 'python',
          title: "inject_norm.py",
          code: `def normalize_tel(raw):
    return ''.join(c for c in raw if c.isdigit())
def process(line, norm=normalize_tel):
    # TODO
    ...
print(process(' 999-a '))
print(process(' 999-a ', norm=lambda s: s.strip().upper()))`,
        },
        solutionCode: {
          language: 'python',
          title: "inject_norm.py",
          code: `def normalize_tel(raw):
    return ''.join(c for c in raw if c.isdigit())
def process(line, norm=normalize_tel):
    return norm(line)
print(process(' 999-a '))
print(process(' 999-a ', norm=lambda s: s.strip().upper()))`,
          output: `999
999-A`,
        },
      },
      {
        id: "S05-T4-A-E1",
        subtopicId: "S05-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Predice LEGB: global x=1; dentro de f, x=2 local; print dentro y fuera.",
        hint: "Local no pisa global sin global keyword",
        hints: [
          "Local no pisa global sin global keyword",
          "Fuera sigue 1",
        ],
        edgeCases: ["local vs global"],
        tests: "in 2 out 1",
        feedback: "Asignar dentro crea local; el global no cambia.",
        starterCode: {
          language: 'python',
          title: "legb_local.py",
          code: `x = 1
def f():
    x = 2
    print('in', x)
f()
print('out', x)`,
        },
        solutionCode: {
          language: 'python',
          title: "legb_local.py",
          code: `x = 1
def f():
    x = 2
    print('in', x)
f()
print('out', x)`,
          output: `in 2
out 1`,
        },
      },
      {
        id: "S05-T4-A-E2",
        subtopicId: "S05-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — `make_multiplier(k)` devuelve función que multiplica por k (closure). Crea *3 y *10.",
        hint: "def inner(n): return n*k; return inner",
        hints: [
          "def inner(n): return n*k; return inner",
          "print(m3(4), m10(4))",
        ],
        edgeCases: ["closure"],
        tests: "12 40",
        feedback: "Factories por closure evitan clases prematuras.",
        starterCode: {
          language: 'python',
          title: "closure_mul.py",
          code: `def make_multiplier(k):
    # TODO
    ...
m3 = make_multiplier(3)
m10 = make_multiplier(10)
print(m3(4), m10(4))`,
        },
        solutionCode: {
          language: 'python',
          title: "closure_mul.py",
          code: `def make_multiplier(k):
    def inner(n):
        return n * k
    return inner
m3 = make_multiplier(3)
m10 = make_multiplier(10)
print(m3(4), m10(4))`,
          output: `12 40`,
        },
      },
      {
        id: "S05-T4-A-E3",
        subtopicId: "S05-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Factory `make_normalizer(mode)` donde mode 'digits' o 'lower' devuelve la fn adecuada. Úsala en dos prints.",
        hint: "if mode=='digits': return lambda o def digits...",
        hints: [
          "if mode=='digits': return lambda o def digits...",
          "Sin global mode",
        ],
        edgeCases: ["factory multipolítica"],
        tests: "12 hola",
        feedback: "Config en el enclosing, no en global mutable.",
        starterCode: {
          language: 'python',
          title: "factory_norm.py",
          code: `def make_normalizer(mode):
    # TODO
    ...
d = make_normalizer('digits')
lo = make_normalizer('lower')
print(d('A-1-B-2'), lo('  Hola '))`,
        },
        solutionCode: {
          language: 'python',
          title: "factory_norm.py",
          code: `def make_normalizer(mode):
    if mode == 'digits':
        def norm(raw):
            return ''.join(c for c in raw if c.isdigit())
        return norm
    if mode == 'lower':
        def norm(raw):
            return raw.strip().lower()
        return norm
    raise ValueError('mode')
d = make_normalizer('digits')
lo = make_normalizer('lower')
print(d('A-1-B-2'), lo('  Hola '))`,
          output: `12 hola`,
        },
      },
      {
        id: "S05-T4-B-E1",
        subtopicId: "S05-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Escribe 2 asserts de ejemplo para `normalize_email = lambda s: s.strip().lower()` e imprime OK.",
        hint: "assert normalize_email('A@B.COM')=='a@b.com'",
        hints: [
          "assert normalize_email('A@B.COM')=='a@b.com'",
          "Incluye idempotencia",
        ],
        edgeCases: ["assert ejemplos"],
        tests: "OK",
        feedback: "Ejemplos primero, implementación después.",
        starterCode: {
          language: 'python',
          title: "examples_email.py",
          code: `def normalize_email(s):
    return s.strip().lower()
# TODO asserts
print('OK')`,
        },
        solutionCode: {
          language: 'python',
          title: "examples_email.py",
          code: `def normalize_email(s):
    return s.strip().lower()
assert normalize_email('  A@B.COM ') == 'a@b.com'
assert normalize_email(normalize_email('A@B.COM')) == 'a@b.com'
print('OK')`,
          output: `OK`,
        },
      },
      {
        id: "S05-T4-B-E2",
        subtopicId: "S05-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Refactoriza `normalize_dir` de una línea densa a dos pasos (strip_collapse + upper) sin romper asserts dados.",
        hint: "Corre asserts antes y después mentalmente",
        hints: [
          "Corre asserts antes y después mentalmente",
          "Misma salida",
        ],
        edgeCases: ["refactor preserva conducta"],
        tests: "AV 1 / JR 2",
        feedback: "Verde-refactor-verde es el hábito profesional.",
        starterCode: {
          language: 'python',
          title: "refactor_dir.py",
          code: `def normalize_dir(raw):
    return ' '.join(raw.strip().split()).upper()
assert normalize_dir('  av 1 ') == 'AV 1'
assert normalize_dir(normalize_dir('x')) == normalize_dir('x')
# TODO reescribir cuerpo
def normalize_dir(raw):
    # TODO
    ...
assert normalize_dir('  av 1 ') == 'AV 1'
print(normalize_dir(' jr 2 '))`,
        },
        solutionCode: {
          language: 'python',
          title: "refactor_dir.py",
          code: `def normalize_dir(raw):
    return ' '.join(raw.strip().split()).upper()
assert normalize_dir('  av 1 ') == 'AV 1'
assert normalize_dir(normalize_dir('x')) == normalize_dir('x')
def strip_collapse(s):
    return ' '.join(s.strip().split())
def normalize_dir(raw):
    return strip_collapse(raw).upper()
assert normalize_dir('  av 1 ') == 'AV 1'
print(normalize_dir(' jr 2 '))`,
          output: `JR 2`,
        },
      },
      {
        id: "S05-T4-B-E3",
        subtopicId: "S05-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Suite mínima: lista de (input, expected) para normalize_nombre; loop assert. Luego cambia implementación a title-case y actualiza expected si la política cambia conscientemente — aquí **mantén** collapsar sin title y deja expected estables.",
        hint: "No cambies política sin actualizar tests",
        hints: [
          "No cambies política sin actualizar tests",
          "Todos PASS",
        ],
        edgeCases: ["tabla de casos"],
        tests: "PASS lines",
        feedback: "Tabla de casos = contrato ejecutable del normalizador.",
        starterCode: {
          language: 'python',
          title: "suite_nombre.py",
          code: `def normalize_nombre(raw):
    return ' '.join(raw.strip().split())
cases = [('  a  b ', 'a b'), ('X', 'X')]
# TODO loop
print('all PASS')`,
        },
        solutionCode: {
          language: 'python',
          title: "suite_nombre.py",
          code: `def normalize_nombre(raw):
    return ' '.join(raw.strip().split())
cases = [('  a  b ', 'a b'), ('X', 'X')]
for inp, exp in cases:
    got = normalize_nombre(inp)
    assert got == exp, (inp, got, exp)
    print('PASS', inp, '→', got)
print('all PASS')`,
          output: `PASS   a  b  → a b
PASS X → X
all PASS`,
        },
      },
    ],
  },
  youDo: {
    title: "Normalizadores puros (inicio CP-N1-B)",
    context:
      "Inicias **CP-N1-B** con el núcleo reutilizable: `normalize_nombre`, `normalize_email`, `normalize_telefono`, `normalize_direccion` como funciones **puras**, con docstring, hints graduales e **idempotencia** demostrada. Sin pathlib CSV todavía (S08) y sin clases de dominio (S11). Solo datos sintéticos.",
    objectives: [
      "Implementar 4 normalizadores puros + orquestador normalize_record",
      "Demostrar idempotencia f(f(x))==f(x) en cada uno",
      "Docstrings con pre/post; ValueError o política explícita en email",
      "Sin I/O ni prints dentro del core",
      "Suite de ejemplos/asserts ejecutable en __main__",
    ],
    requirements: [
      "normalize_nombre colapsa espacios y aplica title de palabras",
      "normalize_email: strip+lower; error si no hay @",
      "normalize_telefono: solo dígitos (política de demo)",
      "normalize_direccion: colapsa + upper determinista",
      "is_idempotent helper o asserts equivalentes",
      "Datos sintéticos; sin PII real",
    ],
    starterCode: `"""normalizers_pure.py — inicio CP-N1-B (S05)
Normalizadores puros de nombre, email, teléfono y dirección.
Idempotencia demostrada. Sin I/O en el core.
Datos sintéticos únicamente.
"""

from __future__ import annotations

from typing import Callable


def normalize_nombre(raw: str) -> str:
    """Colapsa espacios; title-case de palabras.
    Pre: str. Post: sin extremos ni dobles espacios.
    """
    # TODO
    raise NotImplementedError


def normalize_email(raw: str) -> str:
    """strip + lower. ValueError si falta @.
    """
    # TODO
    raise NotImplementedError


def normalize_telefono(raw: str) -> str:
    """Solo dígitos (política PE sintética de demo).
    """
    # TODO
    raise NotImplementedError


def normalize_direccion(raw: str) -> str:
    """Colapsa espacios; upper para demo determinista.
    """
    # TODO
    raise NotImplementedError


def normalize_record(nombres: str, email: str, telefono: str, direccion: str) -> dict:
    """Orquestador delgado — solo llama normalizadores puros."""
    # TODO
    raise NotImplementedError


def is_idempotent(fn: Callable[[str], str], sample: str) -> bool:
    once = fn(sample)
    return fn(once) == once


def _run_tests() -> None:
    assert normalize_nombre("  maría  josé ") == "María José"
    assert is_idempotent(normalize_nombre, "  ana  ")
    assert normalize_email("  A@B.COM ") == "a@b.com"
    assert is_idempotent(normalize_email, "A@B.COM")
    assert normalize_telefono("999-000-111") == "999000111"
    assert is_idempotent(normalize_telefono, "999-000-111")
    assert normalize_direccion("  av. larco 100 ") == "AV. LARCO 100"
    r = normalize_record("  luis ", "L@E.COM", "(999)111222", " jr unión 1 ")
    assert set(r) >= {"nombres", "email", "telefono", "direccion"}
    print("tests OK")


def main() -> None:
    print(normalize_record(
        "  Ana  Pérez ",
        "  Ana.Perez@Example.COM ",
        "999-000-111",
        "  Av. Larco 123 ",
    ))
    _run_tests()


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Documenta en español la política de cada normalizador y pega la salida de la suite. Menciona que la I/O de archivos llegará en S08; aquí solo el core puro.",
    rubric: [
      { criterion: "Cuatro normalizadores correctos", weight: "25%" },
      { criterion: "Idempotencia demostrada", weight: "25%" },
      { criterion: "Pureza (sin I/O en core)", weight: "20%" },
      { criterion: "Docstrings / hints / errores de dominio", weight: "15%" },
      { criterion: "Orquestador delgado + tests", weight: "10%" },
      { criterion: "Documentación en español", weight: "5%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Si una función no tiene return, ¿qué devuelve la llamada?",
        options: [
          "0",
          "False",
          "None",
          "Error siempre",
        ],
        correctIndex: 2,
        explanation:
          "Python inserta return None implícito.",
      },
      {
        question: "¿Por qué `def f(xs=[])` es peligroso?",
        options: [
          "Python no permite defaults",
          "El default mutable se comparte entre llamadas",
          "Solo falla con type hints",
          "Convierte xs en tupla",
        ],
        correctIndex: 1,
        explanation:
          "El objeto default se crea una vez; appends se acumulan entre llamadas.",
      },
      {
        question: "Una función pura…",
        options: [
          "Siempre imprime el resultado",
          "Lee un archivo de config global",
          "Mismo input → mismo output, sin efectos colaterales",
          "Solo puede usarse en clases",
        ],
        correctIndex: 2,
        explanation:
          "Pureza = determinismo + sin side effects; ideal para normalizadores.",
      },
      {
        question: "LEGB significa…",
        options: [
          "Local, Enclosing, Global, Builtin",
          "List, Else, Generator, Break",
          "Loop, Eval, Global, Binary",
          "Lambda, Except, Goto, Block",
        ],
        correctIndex: 0,
        explanation:
          "Orden de resolución de nombres en Python.",
      },
      {
        question: "Idempotencia de un normalizador f significa…",
        options: [
          "f se ejecuta solo una vez en la vida del proceso",
          "f(f(x)) == f(x) para entradas del dominio",
          "f no puede tener defaults",
          "f siempre lanza ValueError",
        ],
        correctIndex: 1,
        explanation:
          "Reaplicar la normalización no cambia el valor ya canónico.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python Tutorial — Defining Functions",
        url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
        note: "def, defaults, return",
      },
      {
        label: "PEP 257 — Docstring Conventions",
        url: "https://peps.python.org/pep-0257/",
        note: "Estilo de documentación de contrato",
      },
      {
        label: "typing — Support for type hints",
        url: "https://docs.python.org/3/library/typing.html",
        note: "Optional, Tuple y hints graduales",
      },
      {
        label: "Python LEGB rule",
        url: "https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces",
        note: "Scopes y namespaces (base de LEGB)",
      },
    ],
    books: [
      {
        label: "Python Crash Course (Matthes)",
        note: "Funciones y módulos introductorios; aplicar a normalizadores del curso.",
      },
      {
        label: "Fluent Python (Ramalho)",
        note: "Profundidad en funciones de primera clase; consulta selectiva post-S05.",
      },
    ],
    courses: [
      {
        label: "CS50P — Functions",
        url: "https://cs50.harvard.edu/python/",
        note: "Diseño de funciones; no copiar problem sets con PII.",
      },
    ],
  },
}
