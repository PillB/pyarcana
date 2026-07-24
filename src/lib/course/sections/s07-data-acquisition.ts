import type { CourseSection } from '../../types'

export const section07: CourseSection = {
  id: "data-acquisition",
  index: 7,
  title: "Texto, Unicode y expresiones regulares",
  shortTitle: "Texto & Unicode",
  tagline: "Unicode latam, strings y regex sin sobrevalidar",
  estimatedHours: 18,
  level: "Intermedio",
  phase: 0,
  icon: "Languages",
  accentColor: "bg-gradient-to-br from-teal-500 to-cyan-600",
  jobRelevance:
    "Los datasets de clientes en Latam rompen normalizadores pensados para ASCII/US: tildes, ñ, dos apellidos y partículas. Si tu matching afirma identidad, parentesco o fraude por un score, creas riesgo de producto y cumplimiento: un score es **evidencia para revisión**, nunca prueba automática. Aquí dominas Unicode, métodos `str` antes que regex, y normalización con evidencia — tramo central de **CP-N1-B**.",
  learningOutcomes: [
    { text: "Normalizar Unicode (NFC/NFD) y usar casefold en comparaciones" },
    { text: "Modelar nombres latam con dos apellidos y partículas sin forzar formato US" },
    { text: "Manipular texto con métodos str idiomáticos antes de regex" },
    { text: "Normalizar email/teléfono con reglas modestas sin overvalidation" },
    { text: "Escribir patrones con grupos y anchors ^$" },
    { text: "Compilar patrones, extraer con findall/finditer y conocer límites" },
    { text: "Comparar por igualdad normalizada y Jaccard de tokens" },
    { text: "Razonar FP/FN y conservar evidencia sin claims de parentesco" },
  ],
  theory: [
    {
      heading: "Mapa de la sección: texto latinoamericano y matching con evidencia",
      paragraphs: [
        "En esta sección dominas **texto latinoamericano**: normalización Unicode, nombres con dos apellidos, métodos `str` antes que regex, y matching con evidencia **sin afirmar parentesco**. Scraping, SQL y APIs públicas se abordan más adelante (p. ej. archivos/ETL en S08 y servicios en S12).",
        "El incremento **CP-N1-B** es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Solo datos sintéticos peruanos/latam; sin PII real. Si el schema no cuadra o falta evidencia, **no completes campos en silencio** (fail-closed: mejor dejar el caso en revisión que inventar datos).",
        "Orden: **T1 Unicode** → **T2 str y contacto** → **T3 regex** → **T4 similitud y FP/FN**. Casos sintéticos: José/Quispe, emails/teléfonos ficticios, Lima/Arequipa.",
      ],
      callout: {
        type: "info",
        title: "Alcance de S07",
        content:
          "El foco es normalización de texto latam y evidencia de matching. No implementes scraping, clientes HTTP ni SQL aquí; esos caminos llegan en secciones posteriores.",
      },
    },
    {
      heading: "Code points, normalización y casefold",
      subtopicId: "S07-T1-A",
      paragraphs: [
        "Python 3 `str` es Unicode. `ord('ñ')` / `chr(241)` exploran **code points**. La misma letra puede codificarse de formas distintas: **NFC** (compuesta) vs **NFD** (base + combining mark). En matching de nombres latam, sin unificar formas obtienes **falsos negativos** (“José” ≠ “José”) aunque se vean idénticos.",
        "`unicodedata.normalize('NFC', s)` unifica formas **antes** de comparar o de tokenizar. Sin eso, `'José' == 'Jose\\u0301'` puede ser `False`. Contrato del normalizador CP-N1-B: entrada explícita → transformación documentada → salida medible; **fail-closed** si el schema no cuadra. Herramientas de esta sección: stdlib `str`, `unicodedata` y `re`.",
        "`casefold()` es la **política canónica** de matching case-insensitive del normalizador (más robusta que `lower()` en general, p. ej. ß alemana; en español ambos suelen coincidir en ñ). Pipeline: **NFC → strip/collapse → casefold (si la política lo pide) → comparar**. Datos sintéticos José/Quispe, Lima/Arequipa — **nunca** PII real ni parentesco automático.",
      ],
      code: {
        language: 'python',
        title: "unicode_nfc.py",
        code: `def s07_th_1():
    import unicodedata
    a = "José"
    b = "Jose\\u0301"
    print("raw equal?", a == b)
    print("NFC equal?", unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b))
    print("casefold:", "MAÑANA".casefold())
    print("ord ñ:", ord("ñ"))

s07_th_1()`,
        output: `raw equal? False
NFC equal? True
casefold: mañana
ord ñ: 241`,
      },
      callout: {
        type: "tip",
        title: "Pipeline de comparación",
        content:
          "normalize NFC → strip/collapse → casefold (si la política lo pide) → comparar.",
      },
    },
    {
      heading: "Tildes, ñ, partículas y apellidos compuestos",
      subtopicId: "S07-T1-B",
      paragraphs: [
        "En Perú y Latam es común **nombre(s) + apellido1 + apellido2**. No fuerces el formato US (first/last único). Conserva el **raw** siempre: es tu única fuente si la heurística se equivoca.",
        "Partículas (`de`, `del`, `de la`, `y`) pueden ir en nombres o apellidos (`María del Carmen`, `de la Cruz`). Un parser **suave** tokeniza y aplica heurísticas; si no hay segundo apellido, marca **review** en vez de inventar. Si el schema no cuadra, no rellenes en silencio.",
        "Espacios múltiples se colapsan; tildes y ñ se preservan en la forma normalizada visible (NFC). Ejemplo sintético: `María del Carmen Quispe Huamán` → given con partícula + dos apellidos finales. Nunca PII real ni inferencia de parentesco.",
      ],
      code: {
        language: 'python',
        title: "parse_nombre.py",
        code: `def s07_th_2():
    raw = "  María   del  Carmen  Quispe  Huamán "
    tokens = raw.split()
    print(tokens)
    # Heurística demo: últimos 2 tokens = apellidos si len>=3
    if len(tokens) >= 3:
        ap2, ap1 = tokens[-1], tokens[-2]
        given = " ".join(tokens[:-2])
        print("given:", given)
        print("apellidos:", ap1, ap2)

s07_th_2()`,
        output: `['María', 'del', 'Carmen', 'Quispe', 'Huamán']
given: María del Carmen
apellidos: Quispe Huamán`,
      },
      callout: {
        type: "warning",
        title: "Sin convención universal",
        content:
          "Cualquier split de apellidos es heurística. Documenta límites; no afirmes identidad legal.",
      },
    },
    {
      heading: "split / join / search / replace",
      subtopicId: "S07-T2-A",
      paragraphs: [
        "Antes de regex: `strip`, `split`, `join`, `replace`, `find`, `startswith`. El **~80%** de limpieza de direcciones y tokens se resuelve así — regex es la excepción, no el default. Menos backtracking, más legible, más testeable.",
        "`' '.join(s.split())` colapsa espacios. `split(',')` parsea CSV-like **simple** (sin comillas escapadas: ahí entra el módulo `csv` en S08). Contrato: entrada → transformación documentada → salida medible; fail-closed si falta evidencia.",
        "`replace` es **literal** y predecible; úsalo para normalizar guiones o prefijos **antes** de invocar regex. Caso sintético: Av. Larco, Miraflores — conserva `raw` en el record de evidencia.",
      ],
      code: {
        language: 'python',
        title: "str_ops.py",
        code: `def s07_th_3():
    dir_raw = "  Av.  Larco   123  ,  Miraflores "
    limpio = " ".join(dir_raw.strip().split())
    print(limpio)
    parts = [p.strip() for p in limpio.split(",")]
    print(parts)
    print(limpio.replace("Av.", "Avenida"))

s07_th_3()`,
        output: `Av. Larco 123 , Miraflores
['Av. Larco 123', 'Miraflores']
Avenida Larco 123 , Miraflores`,
      },
      callout: {
        type: "tip",
        title: "str primero",
        content:
          "Si un replace/split basta, no escribas regex. Más legible y más seguro.",
      },
    },
    {
      heading: "Nombres, emails y teléfonos sin sobrevalidación",
      subtopicId: "S07-T2-B",
      paragraphs: [
        "Email: strip + casefold y una comprobación **modesta pero completa**: exactamente un `@`, parte local y dominio no vacíos, y ningún espacio. No confirma que el buzón exista; solo decide `valid` o `review`. Regex hiper-estrictas **rechazan válidos** (plus addressing, Unicode, dominios nuevos).",
        "Teléfono PE sintético de demo: extraer dígitos y conservar el prefijo de país `51` cuando viene como `+51`. La salida es solo dígitos (`51999000111`); el signo `+` no se conserva. La longitud (p. ej. 9 dígitos locales que empiezan en 9) es **revisión fuera de banda**, no un `raise` automático — no inventes validación de operadora.",
        "Nombre: collapse + NFC; title-case es cosmético y puede pelear con partículas (`del` → `Del`). **Decide política y documenta**. Un score de similitud de nombres es **evidencia para review**, nunca prueba de parentesco o fraude.",
      ],
      code: {
        language: 'python',
        title: "norm_contact.py",
        code: `def normalize_email(raw: str) -> str:
    s = raw.strip().casefold()
    if s.count("@") != 1 or any(ch.isspace() for ch in s):
        raise ValueError("email requiere un @ y cero espacios")
    local, domain = s.split("@")
    if not local or not domain:
        raise ValueError("email requiere local y dominio")
    return s

def normalize_phone_pe(raw: str) -> str:
    return "".join(c for c in raw if c.isdigit())

print(normalize_email("  Ana+test@Example.COM "))
print(normalize_phone_pe("+51 999-000-111"))`,
        output: `ana+test@example.com
51999000111`,
      },
      callout: {
        type: "danger",
        title: "Overvalidation",
        content:
          "Una regex de email “perfecta” es un bug de producto. Prefiere validación modesta + review.",
      },
    },
    {
      heading: "Patrones, grupos y anchors",
      subtopicId: "S07-T3-A",
      paragraphs: [
        "Regex cuando el patrón es **regular de verdad**: DNI sintético 8 dígitos, códigos de región, prefijos. Usa `re` con **grupos** `(...)` y anchors `^$` para full match. Si puedes resolverlo con `str`, **no** uses regex.",
        "`re.fullmatch` ancla inicio y fin. `re.search` encuentra en medio. Confundirlos produce **falsos positivos** en validación de códigos (un DNI embebido en texto “pasa” con search). Validar código completo → `fullmatch`.",
        "Grupos con nombre `(?P<name>...)` mejoran legibilidad al extraer campos. Caso sintético: DNI 8 dígitos demo — **nunca** PII real ni claims de identidad legal.",
      ],
      code: {
        language: 'python',
        title: "regex_groups.py",
        code: `def s07_th_5():
    import re
    pat = re.compile(r"^(?P<dni>\\d{8})$")
    m = pat.fullmatch("12345678")
    print(m.group("dni") if m else None)
    print("search mid:", bool(re.search(r"\\d{8}", "DNI 12345678 PE")))
    print("full mid:", bool(re.fullmatch(r"\\d{8}", "DNI 12345678 PE")))

s07_th_5()`,
        output: `12345678
search mid: True
full mid: False`,
      },
      callout: {
        type: "tip",
        title: "fullmatch vs search",
        content:
          "Validar código completo → fullmatch. Extraer de log → search/finditer.",
      },
    },
    {
      heading: "Compilación, extracción y límites",
      subtopicId: "S07-T3-B",
      paragraphs: [
        "`re.compile` reutiliza el patrón en loops (claridad + micro-ahorro). `findall` / `finditer` extraen múltiples matches de un log sintético — útil en demos de **extracción**, no en overvalidation de email.",
        "Límite principal de este subtema: **catastrophic backtracking** con cuantificadores anidados ambiguos (p. ej. `(a+)+b`). Prefiere patrones **aburridos y simples**, o vuelve a `str` methods. El juicio de producto (overfit de validación) lo cierras en T2; aquí prioriza extracción segura y reutilizable.",
        "Si el patrón crece sin control, un parser por pasos suele ser más testeable. Regex que “lo hacen todo” son un bug de producto disfrazado de elegancia.",
      ],
      code: {
        language: 'python',
        title: "compile_find.py",
        code: `def s07_th_6():
    import re
    phone = re.compile(r"\\b9\\d{8}\\b")
    log = "llamada 999000111 y fallback 988777666 fin"
    print(phone.findall(log))
    for m in phone.finditer(log):
        print("span", m.span(), m.group())

s07_th_6()`,
        output: `['999000111', '988777666']
span (8, 17) 999000111
span (29, 38) 988777666`,
      },
      callout: {
        type: "warning",
        title: "Backtracking",
        content:
          "Patrones tipo (a+)+b sobre strings hostiles pueden colgar el proceso. Mantén regex aburridas.",
      },
    },
    {
      heading: "Exacta y por tokens (Jaccard simple)",
      subtopicId: "S07-T4-A",
      paragraphs: [
        "Matching de texto en intake: primero **igualdad normalizada** (NFC + casefold + collapse). Si no alcanza, **similitud por tokens** (Jaccard) como señal débil para revisión humana.",
        "Jaccard = |A∩B| / |A∪B| sobre sets de tokens. Tokeniza **después** de NFC (mismas formas visuales → mismos tokens). Score medio → **review**, no auto-merge.",
        "Nunca digas “es la misma persona” ni “parentesco” por un score. Conserva evidencia (score, raw A/B) y deja la decisión sensible al humano.",
      ],
      code: {
        language: 'python',
        title: "jaccard.py",
        code: `import unicodedata

def tokens(s: str) -> set[str]:
    s = unicodedata.normalize("NFC", s)
    return set(s.casefold().split())

def token_jaccard(a: str, b: str) -> float:
    A, B = tokens(a), tokens(b)
    if not A and not B:
        return 1.0
    if not A or not B:
        return 0.0
    return len(A & B) / len(A | B)

print(round(token_jaccard("Juan Perez", "Juan P. Perez"), 3))
print(round(token_jaccard("Ana Quispe", "Luis Huamán"), 3))`,
        output: `0.667
0.0`,
      },
      callout: {
        type: "danger",
        title: "Sin claims de identidad",
        content:
          "Score ≠ identidad. Pipeline de match solo sugiere revisión humana.",
      },
    },
    {
      heading: "FP/FN y conservación de evidencia",
      subtopicId: "S07-T4-B",
      paragraphs: [
        "**FP** (false positive): el sistema dice match y no debería. **FN**: debería matchear y no lo hizo. En nombres latam, tildes y partículas mueven ambos lados de la matriz de confusión.",
        "Empaqueta evidencia: `{raw_a, raw_b, score, decision, reason}`. La decisión es accept/review/reject de **matching** — **no** etiqueta familiar ni veredicto legal. Si falta evidencia, no completes el paquete con inventos.",
        "Por qué no se afirma parentesco: falta fuente autoritativa, riesgo legal/ético y score insuficiente. El pipeline solo entrega señales; el humano decide merges sensibles.",
      ],
      code: {
        language: 'python',
        title: "fp_fn_table.py",
        code: `def s07_th_8():
    pairs = [
        ("José Pérez", "Jose Perez", 0.9, "review"),
        ("Ana", "Ana", 1.0, "exact"),
        ("Luis", "Carla", 0.0, "no_match"),
        ("Juan Perez", "Juan P Perez", 0.67, "review"),
    ]
    for a, b, score, dec in pairs:
        # FP demo: exact sobre homónimos sería riesgo; aquí solo tabula
        print(f"{a!r} vs {b!r} score={score} → {dec}")
    print("nota: sin claims de parentesco ni identidad legal")

s07_th_8()`,
        output: `'José Pérez' vs 'Jose Perez' score=0.9 → review
'Ana' vs 'Ana' score=1.0 → exact
'Luis' vs 'Carla' score=0.0 → no_match
'Juan Perez' vs 'Juan P Perez' score=0.67 → review
nota: sin claims de parentesco ni identidad legal`,
      },
      callout: {
        type: "info",
        title: "Evidencia > etiqueta",
        content:
          "Guarda raw y score. El humano decide merges sensibles.",
      },
    },
    {
      heading: "Cierre y puente a S08",
      paragraphs: [
        "Ya puedes normalizar texto en memoria con contrato auditable: NFC, `str` antes que regex, contacto modesto y matching con evidencia. El siguiente cuello de botella real aparece al **leer y escribir archivos**: encodings (UTF-8 vs latin-1 / mojibake), CSV con comillas, JSON y cuarentena de filas rotas.",
        "Lleva a S08 tu `normalize_record` mental: `raw` se conserva, `transforms` se documentan, y un decode incorrecto se trata como error visible — no como tildes “misteriosas”.",
      ],
      callout: {
        type: "tip",
        title: "Siguiente sección",
        content:
          "S08 · Archivos & ETL: pathlib, CSV/JSON, manifest de ingesta. El módulo `csv` reemplaza el split ingenuo de esta sección.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do T1→T4. Normalización latam del tramo CP-N1-B. Datos sintéticos; browser-pyodide (stdlib: unicodedata, re).",
    steps: [
      {
        demoId: "S07-T1-A-DEMO",
        subtopicId: "S07-T1-A",
        environment: "browser-pyodide",
        description: "Comparar 'José' vs 'Jose\\u0301' con y sin normalize",
        code: {
          language: 'python',
          title: "S07-T1-A-DEMO — nfc",
          code: `def s07_ido_1():
    import unicodedata
    a = "José"
    b = "Jose\\u0301"
    print("sin norm:", a == b, [hex(ord(c)) for c in a], [hex(ord(c)) for c in b])
    na, nb = unicodedata.normalize("NFC", a), unicodedata.normalize("NFC", b)
    print("NFC:", na == nb, na)
    print("casefold mañANA:", "mañANA".casefold())

s07_ido_1()`,
          output: `sin norm: False ['0x4a', '0x6f', '0x73', '0xe9'] ['0x4a', '0x6f', '0x73', '0x65', '0x301']
NFC: True José
casefold mañANA: mañana`,
        },
        why: "NFC alinea formas visualmente idénticas antes de comparar o indexar nombres.",
      },
      {
        demoId: "S07-T1-B-DEMO",
        subtopicId: "S07-T1-B",
        environment: "browser-pyodide",
        description: "Parse suave de 'María del Carmen Quispe Huamán'",
        code: {
          language: 'python',
          title: "S07-T1-B-DEMO — nombres",
          code: `def s07_ido_2():
    import unicodedata
    raw = "María del Carmen Quispe Huamán"
    norm = unicodedata.normalize("NFC", " ".join(raw.split()))
    toks = norm.split()
    apellidos = toks[-2:]
    given = " ".join(toks[:-2])
    print("raw:", raw)
    print("given:", given)
    print("apellido1:", apellidos[0], "apellido2:", apellidos[1])
    print("conserva raw en pipeline: sí")

s07_ido_2()`,
          output: `raw: María del Carmen Quispe Huamán
given: María del Carmen
apellido1: Quispe apellido2: Huamán
conserva raw en pipeline: sí`,
        },
        why: "Heurística de dos apellidos finales; given puede incluir partículas del nombre.",
      },
      {
        demoId: "S07-T2-A-DEMO",
        subtopicId: "S07-T2-A",
        environment: "browser-pyodide",
        description: "Limpiar dirección sintética: strip, colapsar espacios, join tokens",
        code: {
          language: 'python',
          title: "S07-T2-A-DEMO — dir",
          code: `def s07_ido_3():
    raw = "  Jr.  de  la  Unión   450  "
    limpio = " ".join(raw.strip().split())
    print(limpio)
    # replace es literal: corrige abreviatura; la tilde de Jirón va en el reemplazo
    print(limpio.replace("Jr.", "Jirón"))
    print("find Unión:", limpio.find("Unión"))

s07_ido_3()`,
          output: `Jr. de la Unión 450
Jirón de la Unión 450
find Unión: 10`,
        },
        why: "str methods resuelven limpieza de dirección sin regex.",
      },
      {
        demoId: "S07-T2-B-DEMO",
        subtopicId: "S07-T2-B",
        environment: "browser-pyodide",
        description: "normalize_email y normalize_phone_pe sintético",
        code: {
          language: 'python',
          title: "S07-T2-B-DEMO — contact",
          code: `def normalize_email(raw: str) -> str:
    s = raw.strip().casefold()
    if s.count("@") != 1 or any(ch.isspace() for ch in s):
        raise ValueError("email requiere un @ y cero espacios")
    local, domain = s.split("@")
    if not local or not domain:
        raise ValueError("email requiere local y dominio")
    return s

def normalize_phone_pe(raw: str) -> str:
    return "".join(ch for ch in raw if ch.isdigit())

print(normalize_email("  User+tag@Example.COM "))
print(normalize_phone_pe("(+51) 999-000-111"))
# Overvalidation mala (no usar en prod de este curso):
bad = r"^[a-z]+@[a-z]+\\.com$"
import re
print("overfit rejects plus?", re.fullmatch(bad, "user+tag@example.com") is None)`,
          output: `user+tag@example.com
51999000111
overfit rejects plus? True`,
        },
        why: "Validación modesta acepta plus-addressing; regex overfit la rechazaría.",
      },
      {
        demoId: "S07-T3-A-DEMO",
        subtopicId: "S07-T3-A",
        environment: "browser-pyodide",
        description: "Extraer DNI sintético 8 dígitos con grupos",
        code: {
          language: 'python',
          title: "S07-T3-A-DEMO — dni",
          code: `def s07_ido_5():
    import re
    pat = re.compile(r"DNI\\s+(?P<dni>\\d{8})\\b")
    text = "Cliente demo DNI 12345678 activo"
    m = pat.search(text)
    print(m.group("dni") if m else None)
    print("fullmatch solo digitos:", bool(re.fullmatch(r"\\d{8}", "12345678")))
    print("fullmatch con prefijo:", bool(re.fullmatch(r"\\d{8}", "DNI 12345678")))

s07_ido_5()`,
          output: `12345678
fullmatch solo digitos: True
fullmatch con prefijo: False`,
        },
        why: "Grupos nombran la captura; fullmatch exige cadena exacta.",
      },
      {
        demoId: "S07-T3-B-DEMO",
        subtopicId: "S07-T3-B",
        environment: "browser-pyodide",
        description: "compile de patrón teléfono; finditer sobre log sintético",
        code: {
          language: 'python',
          title: "S07-T3-B-DEMO — finditer",
          code: `def s07_ido_6():
    import re
    phone = re.compile(r"\\b9\\d{8}\\b")
    log = "ok 999111222 noise 12345 otro 988777666"
    print("findall:", phone.findall(log))
    for m in phone.finditer(log):
        print(m.group(), "at", m.start())
    print("riesgo: evita patrones con cuantificadores anidados ambiguos")

s07_ido_6()`,
          output: `findall: ['999111222', '988777666']
999111222 at 3
988777666 at 30
riesgo: evita patrones con cuantificadores anidados ambiguos`,
        },
        why: "compile + finditer extrae múltiples señales de un log sin overfit de validación.",
      },
      {
        demoId: "S07-T4-A-DEMO",
        subtopicId: "S07-T4-A",
        environment: "browser-pyodide",
        description: "token_jaccard('Juan Perez', 'Juan P. Perez')",
        code: {
          language: 'python',
          title: "S07-T4-A-DEMO — jaccard",
          code: `import unicodedata

def token_jaccard(a: str, b: str) -> float:
    def toks(s: str) -> set[str]:
        s = unicodedata.normalize("NFC", s.replace(".", " "))
        return set(s.casefold().split())
    A, B = toks(a), toks(b)
    if not A and not B:
        return 1.0
    if not A or not B:
        return 0.0
    return len(A & B) / len(A | B)

s = token_jaccard("Juan Perez", "Juan P. Perez")
print("score", round(s, 3))
print("decision", "review" if 0.4 <= s < 1.0 else ("exact" if s == 1.0 else "no_match"))`,
          output: `score 0.667
decision review`,
        },
        why: "Score medio cae en review; no se auto-fusiona ni se afirma identidad.",
      },
      {
        demoId: "S07-T4-B-DEMO",
        subtopicId: "S07-T4-B",
        environment: "browser-pyodide",
        description: "Tabla FP/FN de 4 pares sintéticos",
        code: {
          language: 'python',
          title: "S07-T4-B-DEMO — fpfn",
          code: `def s07_ido_8():
    # truth: same_entity sintético solo para ejercicio de métricas (no legal)
    rows = [
        {"a": "Ana", "b": "Ana", "pred": "match", "truth": "match"},
        {"a": "José", "b": "Jose", "pred": "match", "truth": "match"},
        {"a": "Luis", "b": "Luisa", "pred": "match", "truth": "no"},
        {"a": "María del Carmen", "b": "Maria Carmen", "pred": "no", "truth": "match"},
    ]
    for r in rows:
        if r["pred"] == "match" and r["truth"] == "no":
            tag = "FP"
        elif r["pred"] == "no" and r["truth"] == "match":
            tag = "FN"
        elif r["pred"] == "match":
            tag = "TP"
        else:
            tag = "TN"
        print(r["a"], "vs", r["b"], "→", tag)
    print("evidencia se conserva; no se afirma parentesco")

s07_ido_8()`,
          output: `Ana vs Ana → TP
José vs Jose → TP
Luis vs Luisa → FP
María del Carmen vs Maria Carmen → FN
evidencia se conserva; no se afirma parentesco`,
        },
        why: "Clasificar FP/FN enseña costo de over/under matching en nombres latam.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje E1→E2→E3 por subtema (24 ejercicios, 2 hints). str antes que regex; sin overvalidation; sin claims de parentesco.",
    steps: [
      {
        id: "S07-T1-A-E1",
        subtopicId: "S07-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Normaliza a NFC la lista `['José', 'Jose\\u0301', '']` e imprime cada resultado con `repr`. El vacío permanece vacío. Salida esperada: tres líneas `'José'`, `'José'`, `''`.",
        hint: "unicodedata.normalize('NFC', s)",
        hints: [
          "unicodedata.normalize('NFC', s)",
          "import unicodedata",
        ],
        edgeCases: ["caso vacío"],
        tests: "NFC iguales visualmente",
        feedback: "NFC es el primer paso del normalizador de nombres.",
        starterCode: {
          language: 'python',
          title: "nfc_names.py",
          code: `# CASO-LIM-007 · NFC normalize
# DEFECT: imprime raw sin NFC
import unicodedata
names = ['José', 'Jose\u0301', '']
for n in names:
    print(repr(n))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "nfc_names.py",
          code: `import unicodedata
names = ['José', 'Jose\\u0301', '']
for n in names:
    print(repr(unicodedata.normalize('NFC', n)))`,
          output: `'José'
'José'
''`,
        },
      },
      {
        id: "S07-T1-A-E2",
        subtopicId: "S07-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Usa `casefold` para decidir si `'MAÑANA'` y `'mañana'` matchean e imprime el booleano. Política del normalizador: matching case-insensitive con `casefold` (no `lower`). Salida esperada: `True`.",
        hint: "a.casefold() == b.casefold()",
        hints: [
          "a.casefold() == b.casefold()",
          "Para este par, lower también da True; escribe casefold porque es la política de matching del normalizador.",
        ],
        edgeCases: ["ñ"],
        tests: "True",
        feedback: "casefold es la política canónica de matching case-insensitive (más robusta que lower en general, p. ej. ß).",
        starterCode: {
          language: 'python',
          title: "casefold_match.py",
          code: `# CASO-LIM-007 · casefold match
# DEFECT: usa lower por hábito; política del curso = casefold para matching
a, b = 'MAÑANA', 'mañana'
match = a.lower() == b.lower()  # funciona aquí; preferimos casefold por contrato
print(match)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "casefold_match.py",
          code: `a, b = 'MAÑANA', 'mañana'
match = a.casefold() == b.casefold()
print(match)`,
          output: `True`,
        },
      },
      {
        id: "S07-T1-A-E3",
        subtopicId: "S07-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Diagnostica mismatch: dos strings que se ven iguales pero fallan `==`. Imprime igualdad cruda, igualdad NFC y un mensaje de causa (NFD residual).",
        hint: "Compara sin/con normalize",
        hints: [
          "Compara sin/con normalize",
          "Muestra code points con ord si ayuda.",
        ],
        edgeCases: ["diagnóstico NFD"],
        tests: "raw False nfc True",
        feedback: "El bug de matching por NFD es real en datos copiados de PDFs/OS.",
        starterCode: {
          language: 'python',
          title: "diag_nfd.py",
          code: `# CASO-LIM-007 · NFC equality
# DEFECT: solo raw == ; no NFC
import unicodedata
a = 'José'
b = 'Jose\u0301'
print('raw', a == b)
print('nfc', a == b)
print('causa: ???')
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "diag_nfd.py",
          code: `import unicodedata
a = 'José'
b = 'Jose\\u0301'
print('raw', a == b)
print('nfc', unicodedata.normalize('NFC', a) == unicodedata.normalize('NFC', b))
print('causa: formas Unicode distintas (compuesta vs combining mark)')`,
          output: `raw False
nfc True
causa: formas Unicode distintas (compuesta vs combining mark)`,
        },
      },
      {
        id: "S07-T1-B-E1",
        subtopicId: "S07-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — De `'Ana María Quispe Huamán'` extrae given y dos apellidos (últimos dos tokens). Imprime given en una línea y los apellidos en la siguiente. Salida esperada: `Ana María` / `Quispe Huamán`.",
        hint: "tokens[-2:]",
        hints: [
          "tokens[-2:]",
          "given = join tokens[:-2]",
        ],
        edgeCases: ["dos apellidos"],
        tests: "Ana María / Quispe Huamán",
        feedback: "Heurística base del parse latam.",
        starterCode: {
          language: 'python',
          title: "split_apellidos.py",
          code: `# CASO-LIM-007 · parse given + apellidos
# DEFECT: first token only as given
raw = 'Ana María Quispe Huamán'
toks = raw.split()
given = toks[0]
ap1, ap2 = toks[-2], toks[-1]
print(given)
print(ap1, ap2)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "split_apellidos.py",
          code: `raw = 'Ana María Quispe Huamán'
toks = raw.split()
given = ' '.join(toks[:-2])
ap1, ap2 = toks[-2], toks[-1]
print(given)
print(ap1, ap2)`,
          output: `Ana María
Quispe Huamán`,
        },
      },
      {
        id: "S07-T1-B-E2",
        subtopicId: "S07-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Preserva partículas en given con `'María del Carmen Quispe Ríos'`: given debe incluir `del Carmen`. Imprime given y apellidos. Salida esperada: `María del Carmen` / `Quispe Ríos`.",
        hint: "No borres tokens del medio al cortar apellidos finales.",
        hints: [
          "No borres tokens del medio al cortar apellidos finales.",
          "Misma heurística últimos 2 = apellidos.",
        ],
        edgeCases: ["partículas"],
        tests: "María del Carmen",
        feedback: "Partículas del nombre se quedan en given con esta heurística simple.",
        starterCode: {
          language: 'python',
          title: "particles.py",
          code: `# CASO-LIM-007 · del Carmen particles
# DEFECT: given = first only
raw = 'María del Carmen Quispe Ríos'
toks = raw.split()
given = toks[0]
ap1, ap2 = toks[-2], toks[-1]
print(given)
print(ap1, ap2)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "particles.py",
          code: `raw = 'María del Carmen Quispe Ríos'
toks = raw.split()
given = ' '.join(toks[:-2])
ap1, ap2 = toks[-2], toks[-1]
print(given)
print(ap1, ap2)`,
          output: `María del Carmen
Quispe Ríos`,
        },
      },
      {
        id: "S07-T1-B-E3",
        subtopicId: "S07-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Si hay menos de 3 tokens, `status='review'` y no inventes apellido2. Prueba `'Madonna'` y `'Luis Quispe Huamán'`. Imprime el dict de cada caso.",
        hint: "len(toks) < 3 → review",
        hints: [
          "len(toks) < 3 → review",
          "Conserva raw siempre.",
        ],
        edgeCases: ["sin segundo apellido"],
        tests: "review + ok",
        feedback: "Review > inventar campos demográficos.",
        starterCode: {
          language: 'python',
          title: "review_short.py",
          code: `# CASO-LIM-007 · parse_nombre review
# DEFECT: siempre ok sin review
def parse_nombre(raw):
    toks = raw.split()
    return {
        'raw': raw,
        'status': 'ok',
        'given': toks[0] if toks else '',
        'ap1': toks[-2] if len(toks) >= 2 else None,
        'ap2': toks[-1] if toks else None,
    }
for s in ['Madonna', 'Luis Quispe Huamán']:
    print(parse_nombre(s))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "review_short.py",
          code: `def parse_nombre(raw):
    toks = raw.split()
    if len(toks) < 3:
        return {'raw': raw, 'status': 'review', 'given': raw, 'ap1': None, 'ap2': None}
    return {
        'raw': raw,
        'status': 'ok',
        'given': ' '.join(toks[:-2]),
        'ap1': toks[-2],
        'ap2': toks[-1],
    }
for s in ['Madonna', 'Luis Quispe Huamán']:
    print(parse_nombre(s))`,
          output: `{'raw': 'Madonna', 'status': 'review', 'given': 'Madonna', 'ap1': None, 'ap2': None}
{'raw': 'Luis Quispe Huamán', 'status': 'ok', 'given': 'Luis', 'ap1': 'Quispe', 'ap2': 'Huamán'}`,
        },
      },
      {
        id: "S07-T2-A-E1",
        subtopicId: "S07-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Parte la línea CSV-like `'C001, Ana , Lima'` en una lista de campos sin espacios laterales (`strip` por campo) e imprímela. Salida esperada: `['C001', 'Ana', 'Lima']`.",
        hint: "split(',') + strip por campo",
        hints: [
          "split(',') + strip por campo",
          "Sin comillas en este ejercicio.",
        ],
        edgeCases: ["espacios alrededor"],
        tests: "['C001', 'Ana', 'Lima']",
        feedback: "CSV real con comillas → módulo csv en S08.",
        starterCode: {
          language: 'python',
          title: "split_csvlike.py",
          code: `# CASO-LIM-007 · CSV split strip
# DEFECT: split sin strip
line = 'C001, Ana , Lima'
fields = line.split(',')
print(fields)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "split_csvlike.py",
          code: `line = 'C001, Ana , Lima'
fields = [p.strip() for p in line.split(',')]
print(fields)`,
          output: `['C001', 'Ana', 'Lima']`,
        },
      },
      {
        id: "S07-T2-A-E2",
        subtopicId: "S07-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Une los tokens `['Jr.', 'Unión', '450']` con espacio e imprime; luego únelos con `'-'`. Salida esperada: `Jr. Unión 450` y `Jr.-Unión-450`.",
        hint: "' '.join(tokens)",
        hints: [
          "' '.join(tokens)",
          "join no inserta al inicio/final.",
        ],
        edgeCases: ["separador estable"],
        tests: "espacio y guion",
        feedback: "join es el inverso idiomático de split.",
        starterCode: {
          language: 'python',
          title: "join_stable.py",
          code: `# CASO-LIM-007 · join variants
# DEFECT: solo join con espacio
toks = ['Jr.', 'Unión', '450']
print(' '.join(toks))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "join_stable.py",
          code: `toks = ['Jr.', 'Unión', '450']
print(' '.join(toks))
print('-'.join(toks))`,
          output: `Jr. Unión 450
Jr.-Unión-450`,
        },
      },
      {
        id: "S07-T2-A-E3",
        subtopicId: "S07-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Normaliza `'999.000-111'` a solo dígitos con `replace` o `isdigit` (sin regex). Imprime el resultado limpio y el de filtrar dígitos. Salida esperada: `999000111` en ambas líneas.",
        hint: "replace('.','').replace('-','') o filter isdigit",
        hints: [
          "replace('.','').replace('-','') o filter isdigit",
          "str primero.",
        ],
        edgeCases: ["sin regex"],
        tests: "999000111",
        feedback: "replace controlado evita regex prematura.",
        starterCode: {
          language: 'python',
          title: "replace_phone.py",
          code: `# CASO-LIM-007 · digits only phone
# DEFECT: solo replace . no -
raw = '999.000-111'
clean = raw.replace('.', '')
print(clean)
print(''.join(c for c in raw if c.isalnum()))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "replace_phone.py",
          code: `raw = '999.000-111'
clean = raw.replace('.', '').replace('-', '')
print(clean)
print(''.join(c for c in raw if c.isdigit()))`,
          output: `999000111
999000111`,
        },
      },
      {
        id: "S07-T2-B-E1",
        subtopicId: "S07-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Implementa `normalize_email`: strip+casefold, exactamente un `@`, local/dominio no vacíos y cero espacios. Imprime `'  A@B.COM '` y captura errores para `'@b.com'`, `'a@@b.com'` y `'a b@c.com'`.",
        hint: "s.count('@') == 1; split; local/domain no vacíos; cero espacios",
        hints: [
          "s.count('@') == 1; split; local/domain no vacíos; cero espacios",
          "No uses regex ni exijas .com; acepta plus addressing.",
        ],
        edgeCases: ["local vacío", "doble @", "espacios", "plus válido"],
        tests: "Contrato exacto: ok a@b.com; tres review_error; user+tag@example.com sigue válido.",
        feedback: "Valida estructura mínima sin fingir que verificaste el buzón.",
        starterCode: {
          language: 'python',
          title: "email_lower.py",
          code: `# CASO-LIM-007 · normalize_email
# DEFECT: no valida @ ni espacios
def normalize_email(raw):
    return raw.strip().lower()

for raw in ['  A@B.COM ', '@b.com', 'a@@b.com', 'a b@c.com']:
    try:
        print('ok', normalize_email(raw))
    except ValueError as exc:
        print('review_error', str(exc))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "email_lower.py",
          code: `def normalize_email(raw):
    s = raw.strip().casefold()
    if s.count('@') != 1 or any(ch.isspace() for ch in s):
        raise ValueError('email requiere un @ y cero espacios')
    local, domain = s.split('@')
    if not local or not domain:
        raise ValueError('email requiere local y dominio')
    return s

for raw in ['  A@B.COM ', '@b.com', 'a@@b.com', 'a b@c.com']:
    try:
        print('ok', normalize_email(raw))
    except ValueError as exc:
        print('review_error', str(exc))`,
          output: `ok a@b.com
review_error email requiere local y dominio
review_error email requiere un @ y cero espacios
review_error email requiere un @ y cero espacios`,
        },
      },
      {
        id: "S07-T2-B-E2",
        subtopicId: "S07-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Convierte el teléfono `'(+51) 999-000-111'` a solo dígitos (conserva el `51` del prefijo). No valides operadora ni longitud. Imprime el resultado. Salida esperada: `51999000111`.",
        hint: "filter isdigit",
        hints: [
          "filter isdigit",
          "No valides operadora.",
        ],
        edgeCases: ["símbolos"],
        tests: "51999000111",
        feedback: "Una política modesta de dígitos supera a una regex de formato rígido.",
        starterCode: {
          language: 'python',
          title: "phone_digits.py",
          code: `# CASO-LIM-007 · phone digits
# DEFECT: deja + y paréntesis
raw = '(+51) 999-000-111'
digits = ''.join(c for c in raw if c.isdigit() or c in '+()')
print(digits)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "phone_digits.py",
          code: `raw = '(+51) 999-000-111'
digits = ''.join(c for c in raw if c.isdigit())
print(digits)`,
          output: `51999000111`,
        },
      },
      {
        id: "S07-T2-B-E3",
        subtopicId: "S07-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Muestra que la regex `^[a-z]+@[a-z]+\\.com$` rechaza un email válido con `+`. Imprime rejected=True y la política exacta: un @, local/dominio no vacíos y cero espacios; la entregabilidad queda fuera de alcance.",
        hint: "fullmatch sobre email lower",
        hints: [
          "fullmatch sobre email lower",
          "Print de política en español.",
        ],
        edgeCases: ["overvalidation"],
        tests: "rejected True + política",
        feedback: "Rechazar válidos es peor que un review posterior.",
        starterCode: {
          language: 'python',
          title: "reject_overfit.py",
          code: `# CASO-LIM-007 · overfit regex
# DEFECT: cree que fullmatch estricto es la política
import re
email = 'user+tag@example.com'
pat = r'^[a-z]+@[a-z]+\.com$'
rejected = re.fullmatch(pat, email) is None
print('rejected_by_overfit', not rejected)
print('política: fullmatch estricto siempre')
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "reject_overfit.py",
          code: `import re
email = 'user+tag@example.com'
pat = r'^[a-z]+@[a-z]+\\.com$'
rejected = re.fullmatch(pat, email) is None
print('rejected_by_overfit', rejected)
print('política: un @, local/dominio no vacíos, cero espacios; entregabilidad no verificada')`,
          output: `rejected_by_overfit True
política: un @, local/dominio no vacíos, cero espacios; entregabilidad no verificada`,
        },
      },
      {
        id: "S07-T3-A-E1",
        subtopicId: "S07-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Con `re.fullmatch` y el patrón `^[A-Z]{3}$` (código de región de 3 letras), evalúa `'LIM'` y `'Lima'`. Imprime ambos booleanos. Salida esperada: `True` luego `False`.",
        hint: "re.fullmatch",
        hints: [
          "re.fullmatch",
          "Case sensitive según patrón.",
        ],
        edgeCases: ["anclas"],
        tests: "True False",
        feedback: "fullmatch exige la cadena completa.",
        starterCode: {
          language: 'python',
          title: "fullmatch_region.py",
          code: `# CASO-LIM-007 · fullmatch region code
# DEFECT: search no fullmatch; Lima pasa
import re
pat = r'[A-Z]{3}'
print(bool(re.search(pat, 'LIM')))
print(bool(re.search(pat, 'Lima')))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "fullmatch_region.py",
          code: `import re
pat = r'^[A-Z]{3}$'
print(bool(re.fullmatch(pat, 'LIM')))
print(bool(re.fullmatch(pat, 'Lima')))`,
          output: `True
False`,
        },
      },
      {
        id: "S07-T3-A-E2",
        subtopicId: "S07-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Con el patrón `r'^(?P<nom>\\w+) (?P<ap>\\w+)$'` y `fullmatch` sobre `'Ana Quispe'`, imprime `groupdict()`. Salida esperada: `{'nom': 'Ana', 'ap': 'Quispe'}`. (Para nombres con partículas, prefiere tokenización `str` de T1-B.)",
        hint: "groupdict()",
        hints: [
          "groupdict()",
          "fullmatch",
        ],
        edgeCases: ["grupos nombrados"],
        tests: "nom Ana ap Quispe",
        feedback: "Grupos nombran campos sin índices mágicos. Para nombres latam con partículas, prefiere tokenización `str` (T1-B), no un solo `\\w+`.",
        starterCode: {
          language: 'python',
          title: "groups_name.py",
          code: `# CASO-LIM-007 · named groups
# DEFECT: groups posicionales mal
import re
pat = re.compile(r'^(\w+) (\w+)$')
m = pat.fullmatch('Ana Quispe')
print({'nom': m.group(2), 'ap': m.group(1)} if m else None)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "groups_name.py",
          code: `import re
pat = re.compile(r'^(?P<nom>\\w+) (?P<ap>\\w+)$')
m = pat.fullmatch('Ana Quispe')
print(m.groupdict() if m else None)`,
          output: `{'nom': 'Ana', 'ap': 'Quispe'}`,
        },
      },
      {
        id: "S07-T3-A-E3",
        subtopicId: "S07-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Contrasta `search` vs `fullmatch` del patrón `\\d{8}` sobre `'DNI 12345678'`. Imprime ambos booleanos y una línea: cuándo usarías cada uno.",
        hint: "search True fullmatch False",
        hints: [
          "search True fullmatch False",
          "Explica en una línea.",
        ],
        edgeCases: ["anclar vs medio"],
        tests: "True/False + nota",
        feedback: "Elegir search/fullmatch cambia FP de validación.",
        starterCode: {
          language: 'python',
          title: "search_vs_full.py",
          code: `# CASO-LIM-007 · search vs fullmatch
# DEFECT: confunde usos
import re
text = 'DNI 12345678'
print('search', bool(re.fullmatch(r'\d{8}', text)))
print('fullmatch', bool(re.search(r'\d{8}', text)))
print('usar fullmatch para extraer; search para validar campo exacto')
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "search_vs_full.py",
          code: `import re
text = 'DNI 12345678'
print('search', bool(re.search(r'\\d{8}', text)))
print('fullmatch', bool(re.fullmatch(r'\\d{8}', text)))
print('usar search para extraer; fullmatch para validar campo exacto')`,
          output: `search True
fullmatch False
usar search para extraer; fullmatch para validar campo exacto`,
        },
      },
      {
        id: "S07-T3-B-E1",
        subtopicId: "S07-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Compila `\\b9\\d{8}\\b` y reutiliza el patrón sobre `'tel 999000111'` y `'no match 123'`. Imprime el findall de cada uno. Salida esperada: `['999000111']` y `[]`.",
        hint: "re.compile una vez",
        hints: [
          "re.compile una vez",
          "reuse en loop",
        ],
        edgeCases: ["reuse"],
        tests: "un match / vacío",
        feedback: "compile aclara intención de patrón reutilizado.",
        starterCode: {
          language: 'python',
          title: "compile_reuse.py",
          code: `# CASO-LIM-007 · findall phones
# DEFECT: patrón \d{9} sin ancla 9
import re
pat = re.compile(r'\b\d{9}\b')
for s in ['tel 999000111', 'no match 123']:
    print(s, '→', pat.findall(s))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "compile_reuse.py",
          code: `import re
pat = re.compile(r'\\b9\\d{8}\\b')
for s in ['tel 999000111', 'no match 123']:
    print(s, '→', pat.findall(s))`,
          output: `tel 999000111 → ['999000111']
no match 123 → []`,
        },
      },
      {
        id: "S07-T3-B-E2",
        subtopicId: "S07-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Con `findall` y el patrón `[A-Z]{3}-\\d{2}`, extrae los códigos del log `'ok LIM-01 y CUS-02 fin'`. Salida esperada: `['LIM-01', 'CUS-02']`.",
        hint: "re.findall(pat, log)",
        hints: [
          "re.findall(pat, log)",
          "Patrón simple.",
        ],
        edgeCases: ["multi match"],
        tests: "LIM-01 CUS-02",
        feedback: "findall lista todas las apariciones.",
        starterCode: {
          language: 'python',
          title: "findall_codes.py",
          code: `# CASO-LIM-007 · findall codes
# DEFECT: lower case codes
import re
log = 'ok LIM-01 y CUS-02 fin'
codes = re.findall(r'[a-z]{3}-\d{2}', log)
print(codes)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "findall_codes.py",
          code: `import re
log = 'ok LIM-01 y CUS-02 fin'
codes = re.findall(r'[A-Z]{3}-\\d{2}', log)
print(codes)`,
          output: `['LIM-01', 'CUS-02']`,
        },
      },
      {
        id: "S07-T3-B-E3",
        subtopicId: "S07-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — En 3–4 `print`, explica el riesgo de backtracking con el patrón conceptual `(a+)+b` y por qué preferimos `a+b` o métodos `str`. No ejecutes el patrón sobre strings hostiles.",
        hint: "Cuantificadores anidados ambiguos",
        hints: [
          "Cuantificadores anidados ambiguos",
          "Mensaje en español peruano/claro.",
        ],
        edgeCases: ["límites regex"],
        tests: "mitigación documentada",
        feedback: "Regex aburrida es feature en pipelines de intake.",
        starterCode: {
          language: 'python',
          title: "backtracking_note.py",
          code: `# CASO-LIM-007 · catastrophic backtracking
# DEFECT: recomienda (a+)+b en prod
print('patrón recomendado: (a+)+b sobre strings largos de a\'s')
print('riesgo: ninguno en Python')
print('mitigación: no hace falta')
print('preferir regex complejas siempre')
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "backtracking_note.py",
          code: `print('patrón peligroso: (a+)+b sobre strings largos de a\\'s')
print('riesgo: catastrophic backtracking → CPU alta / hang')
print('mitigación: patrones simples, timeouts, o str.find/split')
print('preferir a+b o validación por pasos')`,
          output: `patrón peligroso: (a+)+b sobre strings largos de a's
riesgo: catastrophic backtracking → CPU alta / hang
mitigación: patrones simples, timeouts, o str.find/split
preferir a+b o validación por pasos`,
        },
      },
      {
        id: "S07-T4-A-E1",
        subtopicId: "S07-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Exact match tras normalizar: NFC + colapsar espacios + casefold de `'  Juan  PEREZ '` vs `'juan perez'`. Imprime el booleano. Salida esperada: `True`.",
        hint: "NFC → join split → casefold",
        hints: [
          "unicodedata.normalize('NFC', s) luego ' '.join(s.split()).casefold()",
          "print bool",
        ],
        edgeCases: ["exact normalizado"],
        tests: "True",
        feedback: "Primera línea de matching: NFC + collapse + casefold.",
        starterCode: {
          language: 'python',
          title: "exact_norm.py",
          code: `# CASO-LIM-007 · norm NFC collapse casefold
# DEFECT: solo lower strip; sin NFC ni collapse
def norm(s):
    return s.strip().lower()
print(norm('  Juan  PEREZ ') == norm('juan perez'))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "exact_norm.py",
          code: `import unicodedata

def norm(s):
    return ' '.join(unicodedata.normalize('NFC', s).split()).casefold()
print(norm('  Juan  PEREZ ') == norm('juan perez'))`,
          output: `True`,
        },
      },
      {
        id: "S07-T4-A-E2",
        subtopicId: "S07-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Implementa Jaccard de tokens (con NFC antes de tokenizar) y calcula el score redondeado a 3 decimales para `'Juan Perez'` vs `'Juan P Perez'`. Salida esperada: `0.667`.",
        hint: "|A∩B|/|A∪B| tras NFC",
        hints: [
          "NFC → set(casefold().split())",
          "|A∩B|/|A∪B|",
        ],
        edgeCases: ["score parcial"],
        tests: "≈0.667",
        feedback: "Score parcial → review en el pipeline; NFC alinea formas visualmente iguales.",
        starterCode: {
          language: 'python',
          title: "jaccard_impl.py",
          code: `# CASO-LIM-007 · token jaccard
# DEFECT: intersection/min len; sin NFC
def token_jaccard(a, b):
    A, B = set(a.casefold().split()), set(b.casefold().split())
    if not A or not B:
        return 0.0
    return len(A & B) / min(len(A), len(B))
print(round(token_jaccard('Juan Perez', 'Juan P Perez'), 3))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "jaccard_impl.py",
          code: `import unicodedata

def tokens(s):
    s = unicodedata.normalize('NFC', s)
    return set(s.casefold().split())

def token_jaccard(a, b):
    A, B = tokens(a), tokens(b)
    if not A and not B:
        return 1.0
    if not A or not B:
        return 0.0
    return len(A & B) / len(A | B)
print(round(token_jaccard('Juan Perez', 'Juan P Perez'), 3))`,
          output: `0.667`,
        },
      },
      {
        id: "S07-T4-A-E3",
        subtopicId: "S07-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Si score ∈ [0.4, 1.0) → `review`; si 1.0 → `exact`; si <0.4 → `no_match`. Con score 0.67 imprime: `review Juan Perez Juan P Perez 0.67`.",
        hint: "Umbrales explícitos",
        hints: [
          "Umbrales explícitos",
          "No auto-merge en review.",
        ],
        edgeCases: ["score medio"],
        tests: "review",
        feedback: "Review es el default honesto ante ambigüedad.",
        starterCode: {
          language: 'python',
          title: "score_review.py",
          code: `# CASO-LIM-007 · decision thresholds
# DEFECT: score 0.67 → exact
a, b, score = 'Juan Perez', 'Juan P Perez', 0.67
if score >= 0.5:
    decision = 'exact'
elif score >= 0.4:
    decision = 'review'
else:
    decision = 'no_match'
print(decision, a, b, score)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "score_review.py",
          code: `a, b, score = 'Juan Perez', 'Juan P Perez', 0.67
if score == 1.0:
    decision = 'exact'
elif score >= 0.4:
    decision = 'review'
else:
    decision = 'no_match'
print(decision, a, b, score)`,
          output: `review Juan Perez Juan P Perez 0.67`,
        },
      },
      {
        id: "S07-T4-B-E1",
        subtopicId: "S07-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Clasifica FP/FN: pred match + truth no → FP; pred no + truth match → FN. Con los dos casos del starter, imprime una etiqueta por línea. Salida esperada: `FP` luego `FN`.",
        hint: "Tabla de confusión 2x2 simplificada",
        hints: [
          "Tabla de confusión 2x2 simplificada",
          "print tag por caso",
        ],
        edgeCases: ["FP FN"],
        tests: "FP luego FN",
        feedback: "Nombrar el error es el primer paso a tunear umbrales.",
        starterCode: {
          language: 'python',
          title: "classify_fpfn.py",
          code: `# CASO-LIM-007 · FP/FN tags
# DEFECT: tags invertidos
cases = [
    {'pred': 'match', 'truth': 'no'},
    {'pred': 'no', 'truth': 'match'},
]
for c in cases:
    if c['pred'] == 'match' and c['truth'] == 'no':
        tag = 'FN'
    elif c['pred'] == 'no' and c['truth'] == 'match':
        tag = 'FP'
    else:
        tag = 'other'
    print(tag)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "classify_fpfn.py",
          code: `cases = [
    {'pred': 'match', 'truth': 'no'},
    {'pred': 'no', 'truth': 'match'},
]
for c in cases:
    if c['pred'] == 'match' and c['truth'] == 'no':
        tag = 'FP'
    elif c['pred'] == 'no' and c['truth'] == 'match':
        tag = 'FN'
    else:
        tag = 'other'
    print(tag)`,
          output: `FP
FN`,
        },
      },
      {
        id: "S07-T4-B-E2",
        subtopicId: "S07-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Empaqueta evidencia `dict(raw_a, raw_b, score, decision, reason)` para el par Juan Perez / Juan P Perez (score 0.67, decision review) e imprímelo.",
        hint: "Un dict con 5 claves",
        hints: [
          "Un dict con 5 claves",
          "reason en español",
        ],
        edgeCases: ["evidencia"],
        tests: "5 keys",
        feedback: "Evidencia estructurada sobrevive al log del ETL.",
        starterCode: {
          language: 'python',
          title: "pack_evidence.py",
          code: `# CASO-LIM-007 · evidence packet
# DEFECT: decision=match y sin reason
evidence = {
    'raw_a': 'Juan Perez',
    'raw_b': 'Juan P Perez',
    'score': 0.67,
    'decision': 'match',
}
print(evidence)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "pack_evidence.py",
          code: `evidence = {
    'raw_a': 'Juan Perez',
    'raw_b': 'Juan P Perez',
    'score': 0.67,
    'decision': 'review',
    'reason': 'similitud parcial por tokens; requiere revisión humana',
}
print(evidence)`,
          output: `{'raw_a': 'Juan Perez', 'raw_b': 'Juan P Perez', 'score': 0.67, 'decision': 'review', 'reason': 'similitud parcial por tokens; requiere revisión humana'}`,
        },
      },
      {
        id: "S07-T4-B-E3",
        subtopicId: "S07-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — En 2–3 `print`, explica por qué el pipeline no afirma parentesco ni identidad legal a partir de Jaccard: falta fuente autoritativa, riesgo ético y score ≠ prueba. No inventes veredictos.",
        hint: "Falta fuente autoritativa; riesgo ético; score ≠ prueba",
        hints: [
          "Falta fuente autoritativa; riesgo ético; score ≠ prueba",
          "Español claro.",
        ],
        edgeCases: ["ética"],
        tests: "3 líneas de política",
        feedback: "Gate de cumplimiento del capstone N1-B sobre claims.",
        starterCode: {
          language: 'python',
          title: "no_parentesco.py",
          code: `# CASO-LIM-007 · no kinship claims
# DEFECT: afirma parentesco e identidad legal
print('Afirmamos parentesco: score alto prueba familia.')
print('Afirmamos identidad legal: score textual basta para RENIEC.')
print('Emitimos veredicto automático sin humano.')
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "no_parentesco.py",
          code: `print('No afirmamos parentesco: el score textual no es prueba familiar.')
print('No afirmamos identidad legal: falta fuente autoritativa (RENIEC/etc.).')
print('Solo emitimos evidencia (raw, score, decision=review) para un humano.')`,
          output: `No afirmamos parentesco: el score textual no es prueba familiar.
No afirmamos identidad legal: falta fuente autoritativa (RENIEC/etc.).
Solo emitimos evidencia (raw, score, decision=review) para un humano.`,
        },
      },
    ],
  },
  youDo: {
    title: "Normalización latinoamericana (CP-N1-B)",
    context:
      "Continúas **CP-N1-B**: un pipeline de texto que conserva **raw**, emite **normalized** y registra **transforms** por campo. Unicode NFC, nombres con dos apellidos, email/tel modestos, y regex solo donde aporta. Sin scraping, HTTP ni SQL. Sin afirmar parentesco ni identidad legal.",
    objectives: [
      "normalize_record → {raw, normalized, transforms}",
      "NFC + casefold donde corresponda",
      "Dos apellidos / review si incompleto",
      "str primero; regex solo si aporta y se justifica",
      "Tests de ejemplos latam sintéticos",
    ],
    requirements: [
      "Firma normalize_record(raw: dict) documentada",
      "Unicode NFC en campos de nombre",
      "Sin scraping, HTTP ni SQL en este proyecto",
      "Datos sintéticos peruanos/latam",
      "Email: un @, local/dominio no vacíos, cero espacios; plus permitido; inválido → review",
      "Teléfono: solo dígitos y prefijo 51 preservado; no inferir operadora",
      "transforms es un dict por campo con nombres ordenados (nfc, collapse_spaces, casefold, digits_only)",
      "Evidencia de match sin claims de parentesco",
    ],
    starterCode: `"""latam_normalize.py — Normalización latinoamericana (CP-N1-B / S07)
Conserva raw, produce normalized y lista transforms.
Sin scraping, HTTP ni SQL. Datos sintéticos.
"""

from __future__ import annotations

import unicodedata
from typing import Any


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def normalize_nombre(raw: str) -> tuple[str, list[str]]:
    """Retorna (normalized, transforms)."""
    # Contrato: collapse, nfc; no inventar apellidos
    raise NotImplementedError


def normalize_email(raw: str) -> tuple[str, list[str]]:
    # Contrato: strip/casefold; exactamente un @, local+domain, sin espacios
    raise NotImplementedError


def normalize_phone(raw: str) -> tuple[str, list[str]]:
    # Contrato: solo dígitos; conservar los dígitos 51 del prefijo +51
    raise NotImplementedError


def normalize_record(raw: dict[str, Any]) -> dict[str, Any]:
    """→ {raw, normalized, transforms}."""
    # Contrato: transforms={"nombre": [...], "email": [...], "telefono": [...]}
    raise NotImplementedError


def main() -> None:
    sample = {
        "nombre": "  María del Carmen Quispe Huamán ",
        "email": "  Ana.Perez+demo@Example.COM ",
        "telefono": "+51 999-000-111",
    }
    print(normalize_record(sample))


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Muestra en README 3 casos: nombre con partícula, email con +, teléfono con máscara; tabla raw→normalized→transforms. Subraya la política ética de no-parentesco.",
    rubric: [
      { criterion: "raw + normalized + transforms", weight: "25%" },
      { criterion: "Unicode y nombres latam", weight: "25%" },
      { criterion: "Email/tel con validación modesta (sin overvalidation)", weight: "20%" },
      { criterion: "Regex solo si aporta (opcional y justificada)", weight: "10%" },
      { criterion: "Evidencia sin parentesco", weight: "10%" },
      { criterion: "Tests de ejemplos latam", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Por qué 'José' y 'Jose\\u0301' pueden fallar en == ?",
        options: ["Python no soporta tildes", "casefold borra la é", "Formas Unicode distintas (NFC vs NFD)", "Son de tipos distintos"],
        correctIndex: 2,
        explanation:
          "Misma apariencia, distinta secuencia de code points; normalize NFC antes de comparar.",
      },
      {
        question: "En nombres latam, si solo hay un token, la política segura es…",
        options: ["Marcar review y conservar raw", "Inventar apellido2 vacío en silencio", "Rechazar y borrar el registro", "Asumir formato first/last US"],
        correctIndex: 0,
        explanation:
          "Sin datos suficientes → review; no inventar demografía.",
      },
      {
        question: "¿Cuándo preferir str.replace/split sobre regex?",
        options: ["Nunca", "Cuando la transformación es literal/simple", "Solo en emails", "Solo si el string es ASCII"],
        correctIndex: 1,
        explanation:
          "str methods son más legibles y evitan overfit/backtracking.",
      },
      {
        question: "En un parse de nombres latam, las partículas (`de`, `del`, `de la`)…",
        options: [
          "Se eliminan siempre del given",
          "Pueden quedar en given o apellidos; no fuerces first/last US",
          "Solo existen en inglés",
          "Obligan a usar un único `\\w+` en regex",
        ],
        correctIndex: 1,
        explanation:
          "Heurística suave: tokens y review; partículas no se borran por defecto. Para nombres con partículas, prefiere str (T1-B) sobre un solo `\\w+`.",
      },
      {
        question: "Un Jaccard 0.67 entre nombres debe…",
        options: ["Fusionar identidades automáticamente", "Afirmar parentesco", "Ir a review con evidencia (raw, score)", "Borrar ambos registros"],
        correctIndex: 2,
        explanation:
          "Score medio → review; sin claims de identidad/parentesco.",
      },
      {
        question: "¿Qué hace `re.fullmatch(r'\\d{8}', 'DNI 12345678')` frente a `search`?",
        options: [
          "Ambos fallan",
          "fullmatch no coincide; search sí encuentra los 8 dígitos",
          "fullmatch coincide; search no",
          "Lanza excepción",
        ],
        correctIndex: 1,
        explanation:
          "fullmatch exige que toda la cadena cumpla el patrón; search busca un substring.",
      },
      {
        question: "Política modesta de email en este curso exige…",
        options: [
          "Regex que solo acepte .com",
          "Exactamente un @, local y dominio no vacíos, sin espacios",
          "Verificar que el buzón exista por SMTP",
          "Rechazar plus addressing",
        ],
        correctIndex: 1,
        explanation:
          "Validación estructural mínima; plus addressing permitido; sin fingir entregabilidad.",
      },
      {
        question: "Ante un patrón con cuantificadores anidados ambiguos, la postura del curso es…",
        options: [
          "Usarlo siempre por elegancia",
          "Preferir patrones simples, str methods o timeouts; evitar catastrophic backtracking",
          "Confiar en que Python optimiza todo",
          "Solo importa en JavaScript",
        ],
        correctIndex: 1,
        explanation:
          "Regex aburridas y límites claros son feature de producto.",
      },
      {
        question: "¿Para qué sirve `re.compile` en un loop de extracción sobre logs?",
        options: [
          "Es obligatorio o fullmatch falla",
          "Reutiliza el patrón con claridad (y un micro-ahorro); findall/finditer lo consumen",
          "Sustituye a NFC en nombres",
          "Valida que el buzón de email exista",
        ],
        correctIndex: 1,
        explanation:
          "compile documenta y reutiliza el patrón; no reemplaza normalización Unicode ni validación de contacto.",
      },
      {
        question: "En un teléfono PE sintético `+51 999-000-111`, la política de normalización es…",
        options: [
          "Conservar el `+` y validar operadora",
          "Solo dígitos (`51999000111`); longitud/operadora van a review, no a raise automático",
          "Rechazar si no hay 9 dígitos locales exactos",
          "Usar regex que exija el formato con guiones",
        ],
        correctIndex: 1,
        explanation:
          "digits_only conserva el 51 del prefijo; no inventamos validación de operadora ni longitud rígida en raise.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "unicodedata — Unicode Database",
        url: "https://docs.python.org/3/library/unicodedata.html",
        note: "normalize NFC/NFD",
      },
      {
        label: "re — Regular expressions",
        url: "https://docs.python.org/3/library/re.html",
        note: "fullmatch, groups, compile",
      },
      {
        label: "Unicode HOWTO",
        url: "https://docs.python.org/3/howto/unicode.html",
        note: "Code points y encodings",
      },
      {
        label: "str methods (stdlib)",
        url: "https://docs.python.org/3/library/stdtypes.html#string-methods",
        note: "strip/split/join antes de regex",
      },
      {
        label: "Regular Expression HOWTO",
        url: "https://docs.python.org/3/howto/regex.html",
        note: "Patrones con moderación",
      },
      {
        label: "Python for Everybody — strings",
        url: "https://www.py4e.com/html3/06-strings",
        note: "Progressive disclosure de str",
      },
    ],
    books: [
      {
        label: "Fluent Python — strings/bytes (selección)",
        note: "Profundizar Unicode tras los ejercicios de S07.",
      },
      {
        label: "Regular Expressions Cookbook (opcional)",
        note: "Solo patrones simples; evita catástrofes de backtracking.",
      },
    ],
    courses: [
      {
        label: "RegexOne",
        url: "https://regexone.com/",
        note: "Práctica interactiva; aplica con moderación al intake.",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Strings y contratos",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Regex y validación con moderación",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Strings y parsing",
      },
    ],
  },
}
