import type { CourseSection } from '../../types'

export const section07: CourseSection = {
  id: "data-acquisition",
  index: 7,
  title: "Texto, Unicode y expresiones regulares",
  shortTitle: "Texto & Unicode",
  tagline: "Unicode latam, cadenas y regex sin sobrevalidar",
  estimatedHours: 9,
  level: "Intermedio",
  phase: 0,
  icon: "Languages",
  accentColor: "bg-gradient-to-br from-teal-500 to-cyan-600",
  jobRelevance:
    "Una cita médica, una entrega o una membresía pueden perderse por un detalle invisible: dos textos que se ven iguales no siempre contienen los mismos code points (los números que Unicode asigna a cada carácter). Los normalizadores pensados para ASCII (el estándar anterior a Unicode, limitado a letras inglesas sin tildes ni ñ) fallan con tildes y partículas, y después culpan a la persona por un error del sistema. Aquí aprendes a normalizar texto con Unicode NFC y métodos str antes que con regex, dejando un rastro auditable; un score de coincidencia es evidencia para una decisión humana, nunca prueba de identidad, parentesco o fraude.",
  learningOutcomes: [
    { text: "Normalizar Unicode (NFC/NFD) y usar casefold en comparaciones" },
    { text: "Modelar nombres latam con dos apellidos y partículas sin forzar formato US" },
    { text: "Manipular texto con métodos str idiomáticos antes de regex" },
    { text: "Normalizar email/teléfono con reglas modestas sin overvalidation" },
    { text: "Escribir patrones con grupos y anchors ^$" },
    { text: "Compilar patrones, extraer con findall/finditer y conocer límites" },
    { text: "Comparar por igualdad normalizada y Jaccard de tokens" },
    { text: "Razonar FP/FN y conservar evidencia sin afirmaciones de parentesco" },
  ],
  theory: [
    {
            heading: "Dos nombres idénticos que la computadora ve distintos",
      paragraphs: [
        "Escribe «José» dos veces, una copiada de un formulario web y otra tecleada en tu editor. En pantalla son iguales. Para Python pueden no serlo: una versión guarda la é como un solo carácter y la otra como una e seguida de una tilde suelta. La comparación devuelve `False`, el cruce de tablas no encuentra la coincidencia, y no hay ningún error que te avise. S06 te dejó colecciones capaces de guardar registros; esta sección pregunta si el texto que está dentro de ellos significa lo que parece.",
        "Poner de acuerdo esas dos formas de escribir lo mismo se llama **normalización Unicode**, y es el primer paso porque sin él todo lo demás compara ruido. A partir de ahí el trabajo es de escalera: los métodos de texto de Python resuelven la mayoría de los casos —quitar espacios sobrantes, unificar mayúsculas, separar apellidos—, y solo cuando el patrón es genuinamente irregular se justifica una expresión regular. El orden importa en la dirección contraria a la intuición: la herramienta poderosa se usa al final, no al principio.",
        "Después viene comparar, y comparar nombres es más difícil de lo que parece en una región donde la gente lleva dos apellidos, los tildes se pierden al escribir rápido y «Ma. del Carmen» es la misma persona que «María del Carmen». Se puede medir cuánto se parecen dos textos, pero ese parecido es una **señal**, no una conclusión. Dos personas pueden llamarse igual; una misma persona puede aparecer escrita de cinco maneras. Por eso el resultado de esta sección nunca afirma parentesco: reúne evidencia y la deja a la vista.",
        "Todo eso se sostiene sobre un contrato de tres partes que verás en cada ejercicio. El **`raw`** es el valor tal como llegó y no se toca nunca, porque es lo único que permite auditar después. El **`normalized`** es el valor listo para comparar. Y **`transforms`** es la lista de lo que se le hizo en el camino, en orden. Con esas tres cosas cualquiera puede reconstruir por qué dos filas se cruzaron o por qué no.",
        "Usa este mapa de decisiones cuando te pierdas: **conservar `raw` → normalizar → comparar → reunir evidencia → decidir o enviar a `review`**. Y una pregunta antes de empezar: toma dos valores que parezcan iguales y predice en qué etapa podrían divergir. Si no puedes nombrar la etapa, todavía no necesitas una expresión regular; necesitas mirar el `raw`, la transformación y el resultado, en ese orden.",
        "Cuando el **schema** —la lista de campos que un registro debe traer y de qué tipo es cada uno— no cuadre, o falte evidencia, la respuesta correcta es no completar el campo. Se cierra por fallo y el caso queda en revisión. Un dato inventado con buena intención es indistinguible de un dato inventado con mala intención una vez que está guardado.",
      ],
      callout: {
        type: "info",
        title: "Alcance de S07",
        content:
          "El foco es normalización de texto latam y evidencia de matching. No implementes scraping —la extracción automática de datos desde páginas web—, clientes HTTP ni SQL aquí; esos caminos llegan en secciones posteriores (archivos/ETL en S08, servicios en S12).",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, alcance y criterio de cierre.",
        "**Orden de los subtemas.** T1 explica Unicode y sus formas de normalización. T2 elige los métodos de texto y valida el contacto sin exigir de más. T3 reserva las expresiones regulares para los patrones que de verdad lo son. T4 mide la similitud entre textos y, sobre todo, sus errores.",
        "**Cómo se enseña.** El *I Do* hace visible el razonamiento, el *We Do* te entrega parte del volante y el *You Do* integra el contrato `raw` / `normalized` / `transforms` completo.",
        "**Criterio de cierre (CP-N1-B).** Un normalizador de registro que conserve `raw`, produzca `normalized` y liste `transforms`, con la comparación acompañada de su evidencia.",
        "**Límites.** Solo datos sintéticos peruanos o latinoamericanos, nunca datos personales reales y nunca afirmaciones de parentesco. La extracción desde webs, el SQL y las APIs públicas se tratan más adelante: archivos y ETL en S08, servicios en S12.",
      ],
     },
     {
      heading: "Code points, normalización y casefold",
      figure: {
        id: "S07-nfc-nfd",
        caption:
          "El navegador dibuja lo mismo en los dos casos; Python cuenta las piezas. Esa es toda la diferencia entre que un cruce de tablas encuentre a la persona o no la encuentre.",
        alt:
          "Dos filas de casillas. La primera guarda J, o, s y é como cuatro piezas. La segunda guarda J, o, s, e y una tilde suelta como cinco piezas. Abajo, la comparación entre las dos cadenas devuelve False.",
      },
      subtopicId: "S07-T1-A",
      paragraphs: [
        "Python 3 `str` es Unicode. Con `ord('ñ')` y `chr(241)` exploras **code points**. La misma letra puede codificarse de formas distintas: **NFC** (compuesta) o **NFD** (base + marca combinante). Al comparar nombres latam sin unificar formas obtienes **falsos negativos** (“José” ≠ “José”), aunque se vean idénticos en pantalla.",
        "`unicodedata.normalize('NFC', s)` unifica formas **antes** de comparar o tokenizar. Sin eso, `'José' == 'Jose\\u0301'` puede ser `False`, y tu Jaccard o tu exact-match fallan en silencio. En el normalizador de registro documentas cada paso (NFC, colapso de espacios, `casefold`); si el schema no cuadra, dejas el caso en **review** en vez de inventar campos. Las herramientas de esta sección son stdlib `str`, `unicodedata` y `re`.",
        "`casefold()` es la **política canónica** de matching case-insensitive del normalizador: más robusta que `lower()` cuando hay *casing* especial (caso clásico: ß alemana → `ss`). En español, `lower` y `casefold` suelen coincidir en ñ; aun así escribes `casefold` por **contrato**, no porque `lower` “rompa” la ñ. El pipeline es: **NFC → strip/collapse → casefold (si la política lo pide) → comparar**. Trabajas solo con datos sintéticos: **nunca** PII real ni inferencia automática de parentesco.",
        "**Predice los code points:** antes de ejecutar, dibuja una casilla para `é` compuesta y dos para `e` + marca combinante. Cada casilla representa un code point. Después explica por qué NFC cambia la comparación pero no corrige un nombre mal escrito. Esa frontera —forma, no significado— evita prometer más de lo que la herramienta hace.",
      ],
      code: {
        language: 'python',
        title: "unicode_nfc.py",
        code: `def s07_th_1():
    import unicodedata
    def code_points(text):
        return [f"U+{ord(char):04X}" for char in text]
    a = "José"
    b = "Jose\\u0301"
    print("raw equal?", a == b)
    print("NFC é:", code_points(a[-1]))
    print("NFD é:", code_points(unicodedata.normalize("NFD", a[-1])))
    print("NFC equal?", unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b))
    print("casefold ñ:", "MAÑANA".casefold())
    print("casefold ß:", "straße".casefold(), "vs lower:", "straße".lower())
    print("ord ñ:", ord("ñ"))

s07_th_1()`,
        output: `raw equal? False
NFC é: ['U+00E9']
NFD é: ['U+0065', 'U+0301']
NFC equal? True
casefold ñ: mañana
casefold ß: strasse vs lower: straße
ord ñ: 241`,
      },
      callout: {
        type: "tip",
        title: "Pipeline de comparación",
        content:
          "NFC → strip/collapse → casefold (política) → comparar. Los encodings al leer archivos (UTF-8 vs. latin-1 / mojibake) se tratan en S08; aquí trabajas sobre `str` ya decodificado.",
      },
    },
    {
      heading: "Tildes, ñ, partículas y apellidos compuestos",
      subtopicId: "S07-T1-B",
      paragraphs: [
        "En Perú y Latam es común **nombre(s) + apellido paterno + apellido materno**. Forzar el formato estadounidense (un único *first* / *last*) recorta información y genera falsos negativos (FN) al cruzar padrones o CRM. Conserva el **raw** siempre: es tu única fuente si la heurística se equivoca o si mañana cambia la política de parseo.",
        "Las partículas (`de`, `del`, `de la`, `y`) pueden ir en nombres o apellidos (`María del Carmen`, `de la Cruz`). Un parser **suave** tokeniza y aplica la heurística “últimos dos tokens = apellidos si hay tres o más”. Si falta evidencia, marca **review** en vez de inventar `apellido2`. Mejor un caso en cola humana que un campo demográfico inventado.",
        "Los espacios múltiples se colapsan; las tildes y la ñ se preservan en la forma normalizada visible (NFC). Ejemplo sintético: `María del Carmen Quispe Huamán` → *given* con partícula + dos apellidos finales. Los datos son ficticios: **nunca** PII real ni inferencia de parentesco o identidad legal.",
        "**Prueba la heurística:** recorre los tokens desde el final y marca qué evidencia respalda cada campo. Luego cambia la entrada a dos tokens. Si tu explicación necesita inventar un apellido, la decisión correcta es `review`, no una regla más ingeniosa.",
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
          "Cualquier split de apellidos es heurística. Documenta límites en `transforms`, marca `review` si faltan tokens y no afirmes identidad legal ni parentesco.",
      },
    },
    {
      heading: "split / join / search / replace",
      figure: {
        id: "S07-encoding-chain",
        caption:
          "Leer UTF-8 como Latin-1 no lanza error: produce «MuÃ±oz» y sigue adelante. Ese es el fallo que miente en vez de fallar.",
        alt:
          "Cuatro etapas —bytes, decode, str, normalizar— con una frontera tras decode marcada como el punto donde se elige mal sin que nada falle.",
      },
      subtopicId: "S07-T2-A",
      paragraphs: [
        "Antes de regex: `strip`, `split`, `join`, `replace`, `find`, `startswith`. En la limpieza de direcciones, teléfonos enmascarados y tokens de *intake*, la mayor parte se resuelve así. Obtienes menos *backtracking*, más legibilidad y mayor facilidad de testeo que con un patrón “inteligente”.",
        "`' '.join(s.split())` colapsa espacios. `split(',')` alcanza para CSV-like **simple** (sin comillas escapadas). Cuando aparezcan comillas, saltos de línea o *encodings* raros, el módulo `csv` y `pathlib` de **S08** son el camino correcto. No fuerces un `split` más “creativo”: te vas a topar con casos que no esperabas.",
        "`replace` es **literal** y predecible: normaliza guiones, abreviaturas o prefijos **antes** de pensar en regex. Caso sintético Lima: `Av. Larco, Miraflores` o `Jr. de la Unión`. Documenta el reemplazo en `transforms` y conserva el `raw` en el registro de evidencia.",
        "**Elige la herramienta:** para cada transformación, pregunta si buscas una secuencia literal, separas por un delimitador o reconoces una forma variable. Las dos primeras suelen pertenecer a `str`; solo la tercera justifica regex. Escribe la decisión antes del código y revisa si un caso con comillas rompe tu supuesto.",
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
        "Para emails: `strip` + `casefold` y una comprobación **modesta pero completa**: exactamente un `@`, parte local y dominio no vacíos, y ningún espacio. Eso no confirma que el buzón exista; solo decide si el valor es usable o va a **review**. Las regex hiper-estrictas **rechazan válidos** (*plus addressing* `user+tag@…`, dominios nuevos, Unicode en *labels*).",
        "Teléfono PE sintético de demo: extrae dígitos y conserva el prefijo de país `51` cuando viene como `+51`. La salida es solo dígitos (`51999000111`); el signo `+` no se conserva. La longitud (p. ej. 9 dígitos locales que empiezan en 9) y la operadora son **revisión fuera de banda**, no un `raise` automático del normalizador.",
        "Nombre de contacto: colapso de espacios + NFC. La capitalización tipo título (*title-case*) es cosmética y puede pelear con partículas (`del` → `Del`). **Elige una política, documenta en `transforms` y sé consistente.** Un score de similitud entre nombres es **evidencia para review**, nunca prueba de parentesco, fraude o identidad legal.",
        "**Separa normalizar de verificar:** poder convertir un teléfono a dígitos no demuestra que exista; reconocer `local@dominio` no prueba que el buzón reciba correo. Predice qué valores aceptarás, cuáles enviarás a `review` y qué afirmación te negarás a hacer. Esa tabla es el contrato.",
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
        "La regex entra cuando el patrón es **regular de verdad**: DNI sintético de 8 dígitos, códigos de región (`LIM`), prefijos fijos. Usa `re` con **grupos** `(...)` y *anchors*. Si `str.startswith`, `replace` o `isdigit` bastan, **no** escribas regex: ya lo practicaste en T2.",
        "`re.fullmatch` exige que **toda** la cadena cumpla el patrón. `re.search` encuentra un *substring* en medio. Confundirlos produce **falsos positivos** en validación: un DNI embebido en texto tipo «DNI 12345678 PE» “pasa” con `search`. Regla: validar un código completo → `fullmatch`; extraer de un log → `search` o `finditer`.",
        "Los grupos con nombre `(?P<name>...)` mejoran la legibilidad al extraer campos (`m.group('dni')` en vez de índices mágicos). Úsalos en códigos y logs, no para “parsear identidad”. En el caso sintético de 8 dígitos: **nunca** PII real ni afirmaciones legales a partir de un *match*. Los nombres con partículas (`María del Carmen`) se modelan mejor con tokenización `str` (T1-B) que con un solo `\\w+`.",
        "**Predice el alcance del patrón:** encierra visualmente la parte de la entrada que `search` encontraría y luego pregunta si queda texto fuera. Si queda, `fullmatch` debe fallar. Esta prueba de borde convierte los *anchors* en una decisión observable, no en puntuación misteriosa.",
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
        title: "fullmatch vs. search",
        content:
          "Validar código completo → fullmatch. Extraer de log → search/finditer.",
      },
    },
    {
      heading: "Compilación, extracción y límites",
      subtopicId: "S07-T3-B",
      paragraphs: [
        "`re.compile` reutiliza el patrón en bucles: deja clara la intención y evita reescribir el mismo *raw string* en cada iteración. `findall` y `finditer` extraen múltiples *matches* de un log sintético. Son herramientas de **extracción**, no de *overvalidation* de email (eso quedó en T2).",
        "Límite duro de este subtema: **catastrophic backtracking** con cuantificadores anidados ambiguos (p. ej. `(a+)+b` sobre *strings* hostiles de `a`s). El módulo `re` de la biblioteca estándar no expone un parámetro de *timeout*. Por eso, prefiere patrones **aburridos y simples**, limita el tamaño de la entrada y vuelve a `str.find` o `split` cuando alcancen.",
        "Si el patrón crece sin control (email + teléfono + DNI + dirección en una sola expresión), un parser por pasos con `str` y regex pequeñas suele ser más testeable. También es más fácil de explicar en una revisión de código (*code review*). La elegancia de una sola mega-regex es un defecto de producto disfrazado (*bug*): un fallo opaco en el medio no dice *qué* campo rompió el contrato.",
        "**Audita el riesgo:** señala los cuantificadores, fija un tamaño máximo de entrada y escribe una alternativa con `str` cuando sea posible. Si el patrón o la entrada vienen de una fuente no confiable, `re` no te da un *timeout*: aislar o rediseñar es parte de la solución.",
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
          "Patrones tipo (a+)+b sobre strings hostiles pueden colgar el proceso. `re` no ofrece timeout: mantén regex simples, limita la entrada y aísla cualquier patrón no confiable.",
      },
    },
    {
      heading: "Exacta y por tokens (Jaccard simple)",
      subtopicId: "S07-T4-A",
      paragraphs: [
        "Matching de texto en *intake*: primero **igualdad normalizada** (NFC + `casefold` + colapso de espacios). Si, tras el mismo pipeline que usaste en T1, las cadenas no son iguales, recién entonces usas **similitud por tokens** (Jaccard) como señal débil para revisión humana. No la uses para auto-fusionar.",
        "Jaccard = |A∩B| / |A∪B| sobre conjuntos de tokens. Tokeniza **después** de NFC (así “José” y “José” no se desdoblan en tokens distintos) y, si hace falta, colapsa puntuación trivial (puntos de abreviatura). Un score medio (p. ej. 0.67 entre `Juan Perez` y `Juan P Perez`) cae en **review**, no en fusión automática ni en fusión de cuentas.",
        "Nunca digas “es la misma persona” ni “parentesco” por un score. Empaqueta evidencia (`raw_a`, `raw_b`, `score`, `decision`, `reason`) y deja la decisión sensible al humano que conoce el contexto del negocio (fraude, KYC, CRM). El pipeline sugiere; no sentencia: el veredicto le corresponde a una persona.",
        "**Dos pruebas antes del score:** intenta primero igualdad exacta tras el mismo pipeline; si falla, muestra la intersección y la unión de tokens antes de dividir. Un número sin esos conjuntos oculta la causa. Luego decide qué intervalo merece `review`, nunca qué persona “es” otra.",
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
        title: "Sin afirmaciones de identidad",
        content:
          "Score ≠ identidad. El pipeline de *match* solo sugiere revisión humana.",
      },
    },
    {
      heading: "FP/FN y conservación de evidencia",
      subtopicId: "S07-T4-B",
      paragraphs: [
        "**FP** (*falso positivo*): el sistema dice *match* y no debería (p. ej. homónimos o “Luisa” ≈ “Luis” con umbral flojo). **FN** (*falso negativo*): debería coincidir y no lo hizo (tildes, partículas, abreviatura de segundo nombre). En nombres latam, NFC y el *parse* de partículas mueven ambos lados de la matriz.",
        "Empaqueta evidencia: `{raw_a, raw_b, score, decision, reason}`. La decisión es `exact`, `review` o `no_match` de **matching**: **no** es etiqueta familiar ni veredicto legal. Si falta evidencia, no completes el paquete con inventos. Cierra por fallo (*fail-closed*): mejor `review` vacío de afirmaciones que un campo inventado.",
        "¿Por qué el curso prohíbe afirmar parentesco o identidad legal desde Jaccard? Porque no hay fuente autoritativa (RENIEC u otra), porque el riesgo ético y legal es alto, y porque un score textual **no es prueba**. El pipeline entrega señales; el humano decide qué fusiones son sensibles.",
        "**Decide con evidencia:** para cada fila, nombra primero el costo de equivocarte y después la etiqueta FP o FN. Conserva el caso que contradiga tu regla: esa excepción enseña dónde mover un umbral o ampliar `review`, sin disfrazar incertidumbre de certeza.",
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
    print("nota: sin afirmaciones de parentesco ni identidad legal")

s07_th_8()`,
        output: `'José Pérez' vs 'Jose Perez' score=0.9 → review
'Ana' vs 'Ana' score=1.0 → exact
'Luis' vs 'Carla' score=0.0 → no_match
'Juan Perez' vs 'Juan P Perez' score=0.67 → review
nota: sin afirmaciones de parentesco ni identidad legal`,
      },
      callout: {
        type: "info",
        title: "Evidencia > etiqueta",
        content:
          "Guarda `raw`, `score` y `reason`. El humano decide fusiones sensibles; el sistema no etiqueta parentesco ni fraude.",
      },
    },
    {
      heading: "Cierre y puente a S08",
      paragraphs: [
        "Ya puedes normalizar texto **en memoria** con un contrato auditable: `raw` permanece, cada transformación deja rastro y la incertidumbre termina en `review`. La idea importante no es “sé regex”; es “puedo explicar qué cambió, por qué cambió y qué no puedo concluir”.",
        "S08 mueve ese modelo a archivos. Allí el error puede ocurrir antes de que exista un `str`: UTF-8 leído como latin-1 produce *mojibake* (`Ã±`), y un `split(',')` no entiende comillas ni saltos de línea. Lleva una pregunta de S07: **¿en qué etapa nació la diferencia?** El módulo `csv`, los encodings y el *manifest* harán visible esa respuesta.",
        "**Chequeo de transferencia:** si un nombre llega como `MuÃ±oz`, NFC no puede repararlo porque el daño ocurrió al decodificar bytes. Conserva el original, registra el error y prueba la lectura correcta en S08; no apiles transformaciones hasta que “se vea bien”.",
      ],
      callout: {
        type: "tip",
        title: "Siguiente sección",
        content:
          "S08 · Archivos & ETL: `pathlib`, CSV/JSON, encodings y manifest de ingesta. Ahí conectas este normalizador con datos en disco.",
      },
    },
  ],
  iDo: {
    intro: "Las ocho demos (I Do) modelan el pipeline T1→T4: NFC y `casefold`, nombres con dos apellidos, `str` antes que regex, contacto modesto, `fullmatch` disciplinado, `compile` y `finditer` sobre logs, Jaccard por tokens, y FP/FN con evidencia empaquetada. Los datos son sintéticos; el editor ejecuta Python real en tu navegador (Pyodide, el intérprete de Python que corre en el navegador sin servidor) con stdlib (`unicodedata`, `re`).",
    steps: [
      {
        demoId: "S07-T1-A-DEMO",
        subtopicId: "S07-T1-A",
        environment: "browser-pyodide",
        description: "Igualdad de 'José' vs. forma NFD y casefold de mañANA",
        preamble:
          "**Predicción:** antes de ejecutar, anota el booleano y el número de code points de cada forma de «José». En intake, el texto pegado desde un PDF puede llegar descompuesto (base + tilde). Sigue la causa, no solo la salida: sin normalizar falla `==`; NFC alinea la forma; `casefold` aplica la política de mayúsculas. Si tu predicción falla, localiza cuál transformación cambió la evidencia.",
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
        why: "NFC alinea formas visualmente idénticas antes de comparar o indexar. Sin unificar code points, el matching de nombres produce falsos negativos silenciosos en padrones y CRM latam: el analista ve «José» dos veces y el sistema dice que no coinciden.",
        retrospective:
          "Si puedes explicar por qué dos strings «iguales en pantalla» fallan `==`, ya internalizaste el primer gate Unicode. El error clásico es comparar raw y culpar al CRM. Autochequeo: ¿puedes decir, sin mirar, qué imprime la lista de code points en la forma NFD de José? En We Do T1-A practicarás NFC, `casefold` y el diagnóstico NFD.",
      },
      {
        demoId: "S07-T1-B-DEMO",
        subtopicId: "S07-T1-B",
        environment: "browser-pyodide",
        description: "Parse suave de 'María del Carmen Quispe Huamán'",
        preamble:
          "**Predicción:** antes de ejecutar, separa «María del Carmen Quispe Huamán» a mano y escribe qué tokens quedarán en *given*, apellido1 y apellido2. Luego sigue la heurística: colapsar, NFC, tokenizar y tomar los dos últimos tokens. Contrasta tu reparto con la salida y explica por qué conservar `raw` permite corregir un caso que la heurística no entienda. Es modelado, no identidad legal.",
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
        why: "La heurística «últimos dos tokens = apellidos» es práctica de modelado latam, no prueba de parentesco ni identidad legal. El *given* puede incluir partículas del nombre. Si faltan tokens, el pipeline real marca review (We Do E3) en vez de inventar demografía.",
        retrospective:
          "Dos apellidos finales + given con partículas es el patrón base latam del curso. El error clásico es forzar first/last US o borrar `del` «porque sobra». No es convención universal: documenta límites y conserva `raw`. We Do: split feliz, partículas, y fail-closed cuando hay pocos tokens.",
      },
      {
        demoId: "S07-T2-A-DEMO",
        subtopicId: "S07-T2-A",
        environment: "browser-pyodide",
        description: "Limpiar dirección sintética: strip, colapsar espacios, join tokens",
        preamble:
          "**Predicción:** antes de ejecutar, escribe la cadena exacta tras `split`/`join`, tras `replace` y el índice donde esperas «Unión». Después sigue la demo y corrige tu traza, carácter por carácter si hace falta. La pregunta no es «¿puedo usar regex?», sino «¿qué operación literal explica mejor el cambio y deja el menor margen de sorpresa?».",
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
        why: "Los métodos `str` resuelven la limpieza de dirección sin regex: `replace` es literal y predecible. En el normalizador documentas el paso en `transforms` y conservas el `raw` por si mañana cambia la política de abreviaturas.",
        retrospective:
          "Si `replace`/`split` bastan, no escribas regex: menos backtracking y más tests. El error clásico es «ya pongo un patrón inteligente» para un guion o una abreviatura. We Do T2-A: CSV-like con strip, `join` estable, y dígitos de teléfono sin `re`.",
      },
      {
        demoId: "S07-T2-B-DEMO",
        subtopicId: "S07-T2-B",
        environment: "browser-pyodide",
        description: "normalize_email y normalize_phone_pe sintético",
        preamble:
          "**Predicción:** decide si el correo con `+tag` será aceptado por el contrato modesto y por la regex rígida; anota también qué ocurrirá con `+51` al conservar solo dígitos. Ejecuta y separa dos ideas: normalizar forma no verifica existencia, y una regla más estricta puede empeorar el producto al crear falsos rechazos.",
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
        why: "Validación modesta acepta plus-addressing y dominios reales; la regex overfit es un bug de producto que rechaza válidos. Preferir review posterior a un rechazo silencioso de correos legítimos en el intake.",
        retrospective:
          "Validación modesta + cola de review supera a la regex hiper-estricta. El misconception es «cuanto más estricta, mejor calidad»: en realidad rechazas válidos (plus tags). We Do: implementar el contrato de email, dígitos de teléfono, y demostrar el rechazo del overfit.",
      },
      {
        demoId: "S07-T3-A-DEMO",
        subtopicId: "S07-T3-A",
        environment: "browser-pyodide",
        description: "Extraer DNI sintético 8 dígitos con grupos",
        preamble:
          "**Predicción:** dibuja qué fragmento captura `search` y marca si sobra texto a izquierda o derecha; después predice los dos booleanos de `fullmatch`. Ejecuta para comprobar una decisión de alcance: extraer de un log tolera contexto, validar un campo completo no. El grupo nombra evidencia sintética; no convierte el match en dato real.",
        code: {
          language: 'python',
          title: "S07-T3-A-DEMO — dni",
          code: `def s07_ido_5():
    import re
    pat = re.compile(r"DNI\\s+(?P<dni>\\d{8})\\b")
    text = "Cliente demo DNI 12345678 activo"
    m = pat.search(text)
    print(m.group("dni") if m else None)
    print("fullmatch solo dígitos:", bool(re.fullmatch(r"\\d{8}", "12345678")))
    print("fullmatch con prefijo:", bool(re.fullmatch(r"\\d{8}", "DNI 12345678")))

s07_ido_5()`,
          output: `12345678
fullmatch solo dígitos: True
fullmatch con prefijo: False`,
        },
        why: "Los grupos con nombre documentan el contrato del campo (`m.group('dni')` en vez de índices mágicos). Confundir `search` con `fullmatch` genera falsos positivos de validación: un código embebido «pasa» cuando solo buscabas un substring en un log.",
        retrospective:
          "Grupo nombrado > índice mágico. fullmatch para el campo exacto; search/finditer para logs. El error clásico es validar un formulario con el mismo patrón que usaste para extraer de un log. We Do: región de 3 letras, groupdict, y el contraste search vs. fullmatch.",
      },
      {
        demoId: "S07-T3-B-DEMO",
        subtopicId: "S07-T3-B",
        environment: "browser-pyodide",
        description: "compile de patrón teléfono; finditer sobre log sintético",
        preamble:
          "**Predicción:** antes de ejecutar, localiza a mano las dos secuencias de nueve dígitos que empiezan en 9 y calcula su índice inicial. Luego compara `findall` —valores— con `finditer` —valores y posiciones—. Si tus índices difieren, cuenta también los espacios: esa evidencia explica el resultado mejor que memorizar una API.",
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
        why: "`compile` aclara reutilización del patrón en un lote de logs; `finditer` aporta span para evidencia. Extracción multi-match no es lo mismo que overvalidation de email: aquí buscas señales, no un gate de buzón.",
        retrospective:
          "Extracción multi-match ≠ gate de email. Regex aburrida es feature. Autochequeo: ¿findall y finditer devuelven la misma información de posición? We Do: compile+reuse, findall de códigos, y política de backtracking sin ejecutar strings hostiles.",
      },
      {
        demoId: "S07-T4-A-DEMO",
        subtopicId: "S07-T4-A",
        environment: "browser-pyodide",
        description: "token_jaccard('Juan Perez', 'Juan P. Perez')",
        preamble:
          "**Predicción:** escribe ambos conjuntos de tokens, su intersección y su unión; calcula la fracción antes de ejecutar. Después verifica por qué ~0.667 cae en `review`. Si solo miras el número, pierdes la causa; si confundes `review` con fusión, conviertes una señal débil en una afirmación que el código no puede sostener.",
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
        why: "Un score medio cae en `review`: es evidencia para un humano, no veredicto. Exact solo con igualdad plena tras el mismo pipeline de normalización. Nunca auto-fusionar ni afirmar identidad legal a partir de Jaccard.",
        retrospective:
          "Score = evidencia para un humano, no veredicto. El error clásico es «0.67 es alto → fusionar cuentas». Exact solo con igualdad plena tras el mismo pipeline. We Do: exact match normalizado, implementación de Jaccard, y umbrales de decisión.",
      },
      {
        demoId: "S07-T4-B-DEMO",
        subtopicId: "S07-T4-B",
        environment: "browser-pyodide",
        description: "Tabla FP/FN de 4 pares sintéticos",
        preamble:
          "**Predicción:** clasifica las cuatro filas como TP, FP, FN o TN antes de ejecutar y escribe qué costo tendría cada error en un sistema de cuentas. Compara después tu tabla con la salida. `truth` pertenece a este ejercicio sintético de métricas; no es una consulta registral ni autoriza una afirmación de parentesco.",
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
        why: "Nombrar FP/FN es el primer paso a tunear umbrales y políticas de review. Cada etiqueta tiene costo de negocio distinto: un falso positivo de fusión no es lo mismo que un falso negativo en un padrón de clientes.",
        retrospective:
          "FP y FN tienen costo de negocio distinto (fusión errónea ≠ omitir un cliente real). El error clásico es optimizar solo «accuracy» sin nombrar el error. We Do: clasificar a mano, empaquetar evidencia, y enunciar por qué no hay parentesco automático.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje gradual (We Do): por cada subtema, **E1 guiado → E2 independiente → E3 transferencia** (24 ejercicios, 2 pistas cada uno). Corrige el defecto marcado en el código, ejecuta y compara con la **salida esperada** de la instrucción. Prioriza `str` antes que regex; mantén la validación de contacto modesta; **sin** afirmaciones de parentesco ni identidad legal.",
    steps: [
      {
        subtopicId: "S07-T1-A",
        kind: "guided",
        title: "Normalizar nombres a NFC con repr",
        preamble:
          "- **Contexto:** el primer paso del normalizador de nombres latam es unificar formas Unicode antes de indexar o comparar.\n- **Meta:** aplicar NFC a cada elemento de una lista sintética (incluida la cadena vacía).\n- **Éxito:** tres líneas con `repr`: `'José'`, `'José'`, `''`.\n- **Límites:** solo `unicodedata`; no mutes la lista original; no uses regex; datos sintéticos.",
        id: "S07-T1-A-E1",
        instruction:
          "1. Revisa el starter: el bucle imprime el raw sin normalizar.\n2. Para cada `n` en `names`, normaliza con `unicodedata.normalize('NFC', n)`.\n3. Imprime `repr(...)` de cada resultado (el vacío sigue vacío).\n4. No agregues prints extra: solo las tres líneas de `repr`.",
        hint: "unicodedata.normalize('NFC', s)",
        hints: [
          "unicodedata.normalize('NFC', s)",
          "import unicodedata",
        ],
        edgeCases: ["caso vacío"],
        tests: "NFC iguales visualmente",
        feedback:
          "NFC no «arregla» el contenido semántico: solo unifica code points. El vacío permanece `''` — normalizar no inventa texto. Sin NFC, `'José'` y `'Jose\\u0301'` se verían distintos en `repr` y romperían el matching.",
        retrospective:
          "Compara tu primera salida con la corregida: el contenido visible no cambió, pero la secuencia de code points sí. Si esperabas que NFC completara el vacío o arreglara una letra incorrecta, estabas confundiendo forma con significado. Transfiere el criterio a claves de un diccionario: normaliza antes de indexar y conserva `raw` para explicar cualquier falso negativo.",
        starterCode: {
          language: 'python',
          title: "nfc_names.py",
          code: `# TAREA: normaliza cada nombre a NFC e imprime con repr
# DEFECT: imprime raw sin NFC
import unicodedata
names = ['José', 'Jose\u0301', '']
for n in names:
    print(repr(n))`,
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
        subtopicId: "S07-T1-A",
        kind: "independent",
        title: "Matching case-insensitive con casefold",
        preamble:
          "- **Contexto:** el normalizador de registro fija una política de comparación sin mayúsculas para campos de nombre/token.\n- **Meta:** usar `casefold` (no `lower`) aunque en este par español el resultado coincida.\n- **Éxito:** un solo booleano `True` al comparar `'MAÑANA'` y `'mañana'`.\n- **Límites:** no uses `lower` en la solución; no importes librerías externas; no afirmes nada legal sobre el token.",
        id: "S07-T1-A-E2",
        instruction:
          "1. Parte de `a, b = 'MAÑANA', 'mañana'`.\n2. Compara con `a.casefold() == b.casefold()`.\n3. Imprime solo el booleano.\n4. (Menos migas que E1: identifica tú el defecto del starter.)",
        hint: "a.casefold() == b.casefold()",
        hints: [
          "a.casefold() == b.casefold()",
          "Para este par, lower también da True; casefold es contrato del normalizador (gana de verdad con casing especial, p. ej. ß).",
        ],
        edgeCases: ["ñ"],
        tests: "True",
        feedback:
          "Aquí `lower` también da `True`, pero el contrato del curso es `casefold`: más robusto ante casing especial (p. ej. ß → `ss`). Escribir `casefold` por política, no porque la ñ «rompa» con `lower`.",
        retrospective:
          "El booleano `True` no demuestra que `lower` sea la política correcta; solo dice que este ejemplo no expone su límite. La causa de usar `casefold` es mantener un contrato único para comparaciones sin distinción de mayúsculas. Prueba mentalmente `straße` frente a `STRASSE` y explica por qué una política consistente evita resultados distintos entre idiomas y equipos.",
        starterCode: {
          language: 'python',
          title: "casefold_match.py",
          code: `# TAREA: matching case-insensitive con casefold (política del normalizador)
# DEFECT: usa lower por hábito; aquí lower también da True, pero el contrato pide casefold
a, b = 'MAÑANA', 'mañana'
match = a.lower() == b.lower()  # funciona en este par; reescribe con casefold
print(match)`,
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
        subtopicId: "S07-T1-A",
        kind: "transfer",
        title: "Diagnosticar mismatch NFD vs. NFC",
        preamble:
          "- **Contexto:** en datos copiados de PDF o de otros SO, la misma «José» puede llegar en forma compuesta o con combining mark.\n- **Meta:** contrastar igualdad cruda vs. igualdad tras NFC e identificar la causa.\n- **Éxito:** `raw False`, `nfc True`, y una línea que nombre formas Unicode distintas (compuesta vs. combining mark).\n- **Límites:** no ejecutes patrones peligrosos; no inventes parentesco; solo `unicodedata` + prints.",
        id: "S07-T1-A-E3",
        instruction:
          "1. Compara `a == b` en crudo e imprime `raw …`.\n2. Compara tras `normalize('NFC', …)` en ambos lados e imprime `nfc …`.\n3. Escribe una línea `causa: …` que nombre formas compuesta vs. combining mark (usa el texto canónico del panel de solución si el entorno compara salida exacta).\n4. Superficie nueva: el mensaje de diagnóstico, no solo aplicar NFC en silencio.",
        hint: "Compara sin/con normalize",
        hints: [
          "Compara sin/con normalize",
          "Muestra code points con ord si ayuda.",
        ],
        edgeCases: ["diagnóstico NFD"],
        tests: "raw False nfc True",
        feedback:
          "Ver igual ≠ ser igual en Unicode. Si se ven idénticos y `==` falla, el bug suele estar en las formas (NFD residual), no en «tu lógica de negocio». Normaliza ambos lados antes de culpar al CRM.",
        retrospective:
          "Tu diagnóstico debe unir evidencia y causa: `raw False` muestra el síntoma; `nfc True` aísla la forma Unicode como origen. Si hubieras aplicado `casefold` solamente, el combining mark seguiría allí. Lleva este método a otro incidente: muestra representación, prueba una transformación por vez y evita culpar al usuario o al sistema externo sin evidencia.",
        starterCode: {
          language: 'python',
          title: "diag_nfd.py",
          code: `# TAREA: diagnostica igualdad cruda vs NFC
# DEFECT: solo raw == ; no NFC
import unicodedata
a = 'José'
b = 'Jose\u0301'
print('raw', a == b)
print('nfc', a == b)
print('causa: ???')`,
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
        subtopicId: "S07-T1-B",
        kind: "guided",
        title: "Extraer given y dos apellidos",
        preamble:
          "- **Contexto:** el normalizador de nombres latam necesita *given* + apellido1 + apellido2 sin forzar formato US.\n- **Meta:** aplicar la heurística «últimos dos tokens = apellidos».\n- **Éxito:** línea 1 `Ana María`; línea 2 `Quispe Huamán`.\n- **Límites:** no inventes campos; no uses regex; no afirmes parentesco; datos sintéticos.",
        id: "S07-T1-B-E1",
        instruction:
          "1. Revisa el starter: `given = toks[0]` corta el segundo nombre.\n2. Haz `given = ' '.join(toks[:-2])` y apellidos con `toks[-2]`, `toks[-1]`.\n3. Imprime given y luego `ap1 ap2`.\n4. Confirma mentalmente que hay ≥3 tokens en este caso feliz.",
        hint: "tokens[-2:]",
        hints: [
          "tokens[-2:]",
          "given = join tokens[:-2]",
        ],
        edgeCases: ["dos apellidos"],
        tests: "Ana María / Quispe Huamán",
        feedback:
          "Con cuatro tokens, `toks[0]` deja fuera «María». Los últimos dos son apellidos; todo lo anterior es given. Es heurística de modelado, no RENIEC ni prueba de parentesco.",
        retrospective:
          "El defecto no era de sintaxis: era una decisión de modelado que descartaba «María». Traza los cuatro tokens y señala por qué cortar los dos últimos conserva el nombre compuesto en este caso. Después prueba un nombre de cinco tokens: la heurística sigue siendo explicable, pero no universal. Por eso el resultado necesita `raw`, política documentada y una ruta de revisión.",
        starterCode: {
          language: 'python',
          title: "split_apellidos.py",
          code: `# TAREA: given + dos apellidos (últimos dos tokens)
# DEFECT: first token only as given
raw = 'Ana María Quispe Huamán'
toks = raw.split()
given = toks[0]
ap1, ap2 = toks[-2], toks[-1]
print(given)
print(ap1, ap2)`,
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
        subtopicId: "S07-T1-B",
        kind: "independent",
        title: "Preservar partículas en el given",
        preamble:
          "- **Contexto:** nombres como «María del Carmen …» pierden información si el parser se queda con el primer token.\n- **Meta:** dejar la partícula dentro de *given* con la misma heurística de apellidos finales.\n- **Éxito:** `María del Carmen` / `Quispe Ríos`.\n- **Límites:** no borres tokens del medio «porque son partículas»; no uses un mega-regex de nombres.",
        id: "S07-T1-B-E2",
        instruction:
          "1. Partiendo de `'María del Carmen Quispe Ríos'`, obtén given y dos apellidos.\n2. Given debe incluir `del Carmen`.\n3. Imprime given y apellidos en dos líneas.\n4. Menos migas: no se señala la línea exacta del defecto (E2).",
        hint: "No borres tokens del medio al cortar apellidos finales.",
        hints: [
          "No borres tokens del medio al cortar apellidos finales.",
          "Misma heurística últimos 2 = apellidos.",
        ],
        edgeCases: ["partículas"],
        tests: "María del Carmen",
        feedback:
          "Con esta heurística simple, las partículas del nombre se quedan en given al cortar solo los dos apellidos finales. No resuelve todos los casos de «de la Cruz» como apellido; por eso más adelante hay `review`.",
        retrospective:
          "Preservar «del Carmen» funciona porque cortaste desde el final, no porque el programa entienda lingüística. Si pensabas borrar `del` por ser una partícula, habrías perdido información válida. Transfiere la lección a «de la Cruz»: el mismo algoritmo puede clasificarla mal como *given*. Conserva `raw`, declara el límite y deriva lo ambiguo a `review`.",
        starterCode: {
          language: 'python',
          title: "particles.py",
          code: `# TAREA: preserva partículas en given (del Carmen)
# DEFECT: given = first only
raw = 'María del Carmen Quispe Ríos'
toks = raw.split()
given = toks[0]
ap1, ap2 = toks[-2], toks[-1]
print(given)
print(ap1, ap2)`,
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
        subtopicId: "S07-T1-B",
        kind: "transfer",
        title: "Review si faltan tokens de apellido",
        preamble:
          "- **Contexto:** un nombre monónimo o incompleto no debe fabricar `apellido2` en silencio (demografía inventada).\n- **Meta:** si hay menos de 3 tokens, `status='review'` y conserva `raw`.\n- **Éxito:** dict de Madonna con `review` y `ap1`/`ap2` en `None`; Luis Quispe Huamán con `ok` y apellidos correctos.\n- **Límites:** no inventes apellidos vacíos «para que pase»; no afirmes identidad legal; solo datos sintéticos.",
        id: "S07-T1-B-E3",
        instruction:
          "1. Implementa `parse_nombre` con rama `len(toks) < 3 → review`.\n2. En el caso ok (≥3), given = join de `[:-2]`, ap1/ap2 finales.\n3. Imprime el dict de `'Madonna'` y de `'Luis Quispe Huamán'`.\n4. Superficie nueva: política de status, no solo el split feliz.",
        hint: "len(toks) < 3 → review",
        hints: [
          "len(toks) < 3 → review",
          "Conserva raw siempre.",
        ],
        edgeCases: ["sin segundo apellido"],
        tests: "review + ok",
        feedback:
          "Inventar `apellido2` cuando no hay tokens es peor que dejar el caso en cola humana. `review` + `raw` es fail-closed demográfico: el sistema no completa en silencio.",
        retrospective:
          "La rama `review` no es un fracaso; es el resultado correcto cuando faltan pruebas para poblar dos apellidos. La causa era una apariencia de completitud fabricada por el starter, capaz de contaminar análisis posteriores. Comprueba que `raw` sobrevive y que ambos apellidos quedan en `None`. Aplica el mismo principio a un formulario incompleto: incertidumbre visible supera a un dato inventado.",
        starterCode: {
          language: 'python',
          title: "review_short.py",
          code: `# TAREA: status review si faltan tokens de apellido
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
    print(parse_nombre(s))`,
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
        subtopicId: "S07-T2-A",
        kind: "guided",
        title: "Split CSV-like con strip por campo",
        preamble:
          "- **Contexto:** líneas simples tipo `id, nombre, ciudad` llegan con espacios laterales en el intake.\n- **Meta:** partir por coma y limpiar cada campo con `strip`.\n- **Éxito:** `['C001', 'Ana', 'Lima']`.\n- **Límites:** sin comillas escapadas aquí; no uses el módulo `csv` aún (S08); no regex.",
        id: "S07-T2-A-E1",
        instruction:
          "1. Revisa el starter: `split(',')` deja espacios en `' Ana '`.\n2. Aplica `strip` a cada parte (list comprehension o bucle).\n3. Imprime la lista limpia.\n4. No agregues comillas ni lógica de escape.",
        hint: "split(',') + strip por campo",
        hints: [
          "split(',') + strip por campo",
          "Sin comillas en este ejercicio.",
        ],
        edgeCases: ["espacios alrededor"],
        tests: "['C001', 'Ana', 'Lima']",
        feedback:
          "`split` no recorta espacios: `' Ana '` ≠ `'Ana'`. Este truco alcanza para CSV-like sin comillas; con comillas/newlines, en S08 usas `csv`.",
        retrospective:
          "La coma separó correctamente, pero no limpió lo que rodeaba cada campo: esa diferencia causal explica por qué `strip` pertenece después de `split`. Si esperabas que `split(',')` recortara solo, confundiste delimitación con normalización. Transfiere el patrón a una línea con un campo vacío y decide si debes conservarlo, revisarlo o rechazarlo antes de escribir más código.",
        starterCode: {
          language: 'python',
          title: "split_csvlike.py",
          code: `# TAREA: split CSV-like y strip por campo
# DEFECT: split sin strip
line = 'C001, Ana , Lima'
fields = line.split(',')
print(fields)`,
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
        subtopicId: "S07-T2-A",
        kind: "independent",
        title: "Unir tokens con espacio y guion",
        preamble:
          "- **Contexto:** tras tokenizar una dirección, reconstruyes el string con un separador estable para logs o keys.\n- **Meta:** practicar `str.join` con dos separadores distintos.\n- **Éxito:** `Jr. Unión 450` y `Jr.-Unión-450`.\n- **Límites:** no concatenes con `+` en bucle; no insertes separador al inicio/final a mano.",
        id: "S07-T2-A-E2",
        instruction:
          "1. Con `toks = ['Jr.', 'Unión', '450']`, une con espacio.\n2. Une el mismo orden con `'-'`.\n3. Imprime ambas líneas.\n4. (E2: sin señalar el defecto línea a línea.)",
        hint: "' '.join(tokens)",
        hints: [
          "' '.join(tokens)",
          "join no inserta al inicio/final.",
        ],
        edgeCases: ["separador estable"],
        tests: "espacio y guion",
        feedback:
          "`join` es el inverso idiomático de `split`: el separador no se pega al borde. Un bucle con `+` suele dejar basura al inicio o al final.",
        retrospective:
          "Las dos salidas conservan orden y contenido; solo cambia el separador, porque `join` declara ese separador una vez. Un bucle con `+` suele esconder casos de borde y separadores sobrantes. Predice ahora `'-'.join([])` y `'-'.join(['uno'])`. Transfiere esos bordes a rutas, etiquetas o claves para reutilizar la operación sin parches especiales.",
        starterCode: {
          language: 'python',
          title: "join_stable.py",
          code: `# TAREA: join con espacio y con guion
# DEFECT: solo join con espacio
toks = ['Jr.', 'Unión', '450']
print(' '.join(toks))`,
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
        subtopicId: "S07-T2-A",
        kind: "transfer",
        title: "Solo dígitos con replace o isdigit",
        preamble:
          "- **Contexto:** un teléfono sintético llega con máscaras (`.` y `-`); el normalizador debe quedarse con dígitos **sin** abrir regex.\n- **Meta:** obtener `999000111` por dos caminos (`replace` encadenado y filtro `isdigit`).\n- **Éxito:** dos líneas idénticas `999000111`.\n- **Límites:** sin `re`; no valides operadora ni longitud aquí.",
        id: "S07-T2-A-E3",
        instruction:
          "1. Partiendo de `'999.000-111'`, elimina puntos y guiones (o filtra dígitos).\n2. Imprime el resultado de `replace` y el de `isdigit`.\n3. Ambos deben coincidir.\n4. Superficie: elegir herramienta `str` correcta (`isdigit` vs. `isalnum`).",
        hint: "replace('.','').replace('-','') o filter isdigit",
        hints: [
          "replace('.','').replace('-','') o filter isdigit",
          "str primero.",
        ],
        edgeCases: ["sin regex"],
        tests: "999000111",
        feedback:
          "`isalnum` deja letras si las hubiera; para teléfono quieres solo dígitos. Un `replace` controlado es más legible que un patrón «listo». Aquí no valides operadora ni longitud.",
        retrospective:
          "Ambos caminos producen los mismos dígitos, pero responden a contratos distintos: `replace` enumera máscaras conocidas; `isdigit` conserva cualquier dígito y descarta lo demás. Si elegiste `isalnum`, también habrías aceptado letras. Transfiere la decisión a un identificador mixto: allí filtrar solo dígitos podría destruir información, así que primero nombra qué caracteres son evidencia.",
        starterCode: {
          language: 'python',
          title: "replace_phone.py",
          code: `# TAREA: normaliza a solo dígitos (sin regex)
# DEFECT: solo replace . no -
raw = '999.000-111'
clean = raw.replace('.', '')
print(clean)
print(''.join(c for c in raw if c.isalnum()))`,
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
        subtopicId: "S07-T2-B",
        kind: "guided",
        title: "normalize_email modesto con fail-closed",
        preamble:
          "- **Contexto:** el campo email del registro sintético debe ser usable o ir a review, sin fingir que el buzón existe.\n- **Meta:** implementar strip+casefold, un `@`, local/dominio no vacíos, cero espacios.\n- **Éxito:** `ok a@b.com` y tres líneas `review_error …` para `@b.com`, `a@@b.com`, `a b@c.com`.\n- **Límites:** no regex; no exijas `.com`; plus addressing debe seguir válido en el contrato (aunque no se prueba en este loop).",
        id: "S07-T2-B-E1",
        instruction:
          "1. Reescribe `normalize_email`: el starter no valida `@` ni espacios.\n2. Usa `casefold` (no solo `lower`) por contrato del normalizador.\n3. Lanza `ValueError` con mensaje claro en fallos.\n4. Mantén el loop try/except e imprime `ok` / `review_error`.",
        hint: "s.count('@') == 1; split; local/domain no vacíos; cero espacios",
        hints: [
          "s.count('@') == 1; split; local/domain no vacíos; cero espacios",
          "No uses regex ni exijas .com; acepta plus addressing.",
        ],
        edgeCases: ["local vacío", "doble @", "espacios", "plus válido"],
        tests: "Contrato exacto: ok a@b.com; tres review_error; user+tag@example.com sigue válido.",
        feedback:
          "Un `@` al inicio deja local vacío; dos `@` rompen el conteo; un espacio en medio es inválido. No estás verificando entregabilidad: solo estructura mínima.",
        retrospective:
          "El contrato acepta `+` porque verifica estructura mínima, no una versión imaginaria de todo el estándar de correo. Si pensabas que encontrar un `@` bastaba, prueba `@dominio` y `local@`: ambos carecen de una parte esencial. Transfiere el enfoque a otro contacto: define qué puedes comprobar localmente, qué requiere un servicio externo y qué debe ir a `review`.",
        starterCode: {
          language: 'python',
          title: "email_lower.py",
          code: `# TAREA: normalize_email modesto (un @, sin espacios)
# DEFECT: no valida @ ni espacios
def normalize_email(raw):
    return raw.strip().lower()

for raw in ['  A@B.COM ', '@b.com', 'a@@b.com', 'a b@c.com']:
    try:
        print('ok', normalize_email(raw))
    except ValueError as exc:
        print('review_error', str(exc))`,
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
        subtopicId: "S07-T2-B",
        kind: "independent",
        title: "Teléfono PE a solo dígitos (+51)",
        preamble:
          "- **Contexto:** el teléfono sintético peruano llega enmascarado; el normalizador conserva dígitos del prefijo `51` sin inferir operadora.\n- **Meta:** filtrar solo dígitos desde `'(+51) 999-000-111'`.\n- **Éxito:** `51999000111`.\n- **Límites:** no valides longitud ni operadora; no `raise` por formato; sin regex.",
        id: "S07-T2-B-E2",
        instruction:
          "1. Parte del raw enmascarado.\n2. Conserva únicamente caracteres `isdigit`.\n3. Imprime el string de dígitos.\n4. (E2: el learner identifica solo el filtro incorrecto.)",
        hint: "filter isdigit",
        hints: [
          "filter isdigit",
          "No valides operadora.",
        ],
        edgeCases: ["símbolos"],
        tests: "51999000111",
        feedback:
          "Dejar `+` o paréntesis rompe el contrato de dígitos. Longitud y operadora son revisión fuera de banda, no un `raise` del normalizador.",
        retrospective:
          "La salida conserva `51` porque la política pide dígitos, no «nueve dígitos locales». Un patrón rígido habría confundido presentación con validez y quizá rechazado un dato útil. Observa el límite: este ejercicio tampoco demuestra que el número exista o pertenezca a una operadora. Reutiliza esa separación entre normalizar, validar forma y verificar realidad en códigos postales o cuentas.",
        starterCode: {
          language: 'python',
          title: "phone_digits.py",
          code: `# TAREA: teléfono a solo dígitos (conserva 51)
# DEFECT: deja + y paréntesis
raw = '(+51) 999-000-111'
digits = ''.join(c for c in raw if c.isdigit() or c in '+()')
print(digits)`,
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
        subtopicId: "S07-T2-B",
        kind: "transfer",
        title: "Overvalidation que rechaza plus-addressing",
        preamble:
          "- **Contexto:** una regex «elegante» de email es un bug de producto: rechaza direcciones válidas (plus tags, dominios nuevos).\n- **Meta:** demostrar el rechazo del patrón overfit y enunciar la política modesta del curso.\n- **Éxito:** `rejected_by_overfit True` y una línea de política (un `@`, local/dominio, cero espacios; sin entregabilidad).\n- **Límites:** no propongas la regex overfit como solución; no verifiques buzones reales.",
        id: "S07-T2-B-E3",
        instruction:
          "1. Evalúa `fullmatch` del patrón estricto sobre `user+tag@example.com`.\n2. Imprime si fue rechazado (`True` esperado).\n3. Imprime la política modesta en **una** línea (alineada al panel de solución: un @, local/dominio, cero espacios; sin entregabilidad).\n4. Superficie: razonamiento de producto, no solo código de normalización.",
        hint: "fullmatch sobre email lower",
        hints: [
          "fullmatch sobre email lower",
          "Print de política en español.",
        ],
        edgeCases: ["overvalidation"],
        tests: "rejected True + política",
        feedback:
          "El starter imprimía `not rejected` y una política falsa. Rechazar válidos es peor que mandar un caso dudoso a review después.",
        retrospective:
          "El rechazo ocurre porque `[a-z]+` excluye un `+` permitido, no porque el correo sea necesariamente inválido. Esa causa convierte una regex «estricta» en generadora de falsos negativos. Si tu intuición era que más restricciones siempre elevan calidad, mide qué entradas válidas pierdes. Transfiere el criterio: cada regla nueva necesita un caso que debe aceptar y otro que debe rechazar.",
        starterCode: {
          language: 'python',
          title: "reject_overfit.py",
          code: `# TAREA: muestra overvalidation de email con +
# DEFECT: cree que fullmatch estricto es la política
import re
email = 'user+tag@example.com'
pat = r'^[a-z]+@[a-z]+\.com$'
rejected = re.fullmatch(pat, email) is None
print('rejected_by_overfit', not rejected)
print('política: fullmatch estricto siempre')`,
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
        subtopicId: "S07-T3-A",
        kind: "guided",
        title: "fullmatch de código de región",
        preamble:
          "- **Contexto:** códigos de región de 3 letras mayúsculas (`LIM`) se validan como campo completo, no como substring.\n- **Meta:** usar `re.fullmatch` con patrón anclado `^[A-Z]{3}$`.\n- **Éxito:** `True` para `'LIM'`, `False` para `'Lima'`.\n- **Límites:** case-sensitive según patrón; no uses `search` en la solución; datos sintéticos.",
        id: "S07-T3-A-E1",
        instruction:
          "1. El starter usa `search` y un patrón sin anclar bien el campo.\n2. Cambia a `fullmatch` con `^[A-Z]{3}$` (o confía en fullmatch + patrón equivalente).\n3. Imprime bool de `'LIM'` y de `'Lima'`.\n4. No agregues flags de ignorecase.",
        hint: "re.fullmatch",
        hints: [
          "re.fullmatch",
          "Case sensitive según patrón.",
        ],
        edgeCases: ["anclas"],
        tests: "True False",
        feedback:
          "`search` encuentra un trozo en medio; «Lima» no es un código de tres mayúsculas completas (puede coincidir con `Lim`). `fullmatch` exige que **toda** la cadena cumpla el patrón.",
        retrospective:
          "`fullmatch` rechaza letras minúsculas, guiones y texto alrededor porque el contrato describe el campo entero. Si hubieras usado `search`, una cadena con basura podría parecer válida gracias a un fragmento interno. Transfiere la prueba a un código de pedido: construye un caso feliz, un prefijo extra y un sufijo extra; los dos últimos deben fallar por la misma causa.",
        starterCode: {
          language: 'python',
          title: "fullmatch_region.py",
          code: `# TAREA: fullmatch de código de región de 3 letras
# DEFECT: search no fullmatch; Lima pasa
import re
pat = r'[A-Z]{3}'
print(bool(re.search(pat, 'LIM')))
print(bool(re.search(pat, 'Lima')))`,
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
        subtopicId: "S07-T3-A",
        kind: "independent",
        title: "groupdict con nom y ap",
        preamble:
          "- **Contexto:** al extraer campos simples de un patrón, los grupos con nombre evitan índices mágicos.\n- **Meta:** `fullmatch` de `'Ana Quispe'` con `(?P<nom>…)` y `(?P<ap>…)` e imprimir `groupdict()`.\n- **Éxito:** `{'nom': 'Ana', 'ap': 'Quispe'}`.\n- **Límites:** no uses este patrón para «María del Carmen…» (ahí va tokenización `str` de T1-B).",
        id: "S07-T3-A-E2",
        instruction:
          "1. Compila el patrón con grupos nombrados y anchors.\n2. Haz `fullmatch` sobre `'Ana Quispe'`.\n3. Imprime `m.groupdict()` (o `None` si no hay match).\n4. (E2: corrige el cruce nom/ap del starter sin guía línea a línea.)",
        hint: "groupdict()",
        hints: [
          "groupdict()",
          "fullmatch",
        ],
        edgeCases: ["grupos nombrados"],
        tests: "nom Ana ap Quispe",
        feedback:
          "El starter invertía `group(1)`/`group(2)`. Los nombres del grupo documentan el contrato del campo; `groupdict` lo hace explícito. Para partículas latam, prefiere `str` (T1-B).",
        retrospective:
          "`groupdict` convierte capturas en evidencia con nombres, de modo que quien revisa el código no memoriza índices. Pero el patrón funciona porque el formato del código es estable; no ha aprendido qué significa una persona. Si pensabas trasladarlo intacto a nombres con partículas, compara la variabilidad. Transfiere el recurso a logs con campos rígidos y valida después cada captura.",
        starterCode: {
          language: 'python',
          title: "groups_name.py",
          code: `# TAREA: groupdict con nom y ap
# DEFECT: groups posicionales mal
import re
pat = re.compile(r'^(\w+) (\w+)$')
m = pat.fullmatch('Ana Quispe')
print({'nom': m.group(2), 'ap': m.group(1)} if m else None)`,
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
        subtopicId: "S07-T3-A",
        kind: "transfer",
        title: "Search vs. fullmatch en DNI embebido",
        preamble:
          "- **Contexto:** un DNI sintético aparece dentro de un log (`DNI 12345678`); confusión search/fullmatch cambia los falsos positivos de validación.\n- **Meta:** medir ambos y enunciar el uso correcto.\n- **Éxito:** `search True`, `fullmatch False`, y la línea de política (search=extraer; fullmatch=validar campo exacto).\n- **Límites:** no uses PII real; no afirmes identidad legal por un match.",
        id: "S07-T3-A-E3",
        instruction:
          "1. Sobre `'DNI 12345678'`, evalúa `search` y `fullmatch` del patrón `\\d{8}`.\n2. Imprime ambos booleanos con las etiquetas pedidas.\n3. Corrige el mensaje de uso (alineado al panel de solución: search=extraer; fullmatch=validar campo exacto).\n4. Superficie: política + código, no solo un bool.",
        hint: "search True fullmatch False",
        hints: [
          "search True fullmatch False",
          "Explica en una línea.",
        ],
        edgeCases: ["anclar vs. medio"],
        tests: "True/False + nota",
        feedback:
          "El starter llamaba fullmatch donde iba search y viceversa, y enseñaba la política invertida. Elegir mal el API de `re` es un FP de validación en producción.",
        retrospective:
          "El mismo patrón produce respuestas distintas porque las funciones hacen preguntas distintas: `search` pregunta si existe un fragmento; `fullmatch`, si todo el valor cumple. El error tentador es usar el éxito de extracción como validación. En otra entrada, añade texto antes y después del número: `search` seguirá hallando evidencia, mientras el gate completo debe rechazarla.",
        starterCode: {
          language: 'python',
          title: "search_vs_full.py",
          code: `# TAREA: contrasta search vs fullmatch en DNI
# DEFECT: confunde usos
import re
text = 'DNI 12345678'
print('search', bool(re.fullmatch(r'\d{8}', text)))
print('fullmatch', bool(re.search(r'\d{8}', text)))
print('usar fullmatch para extraer; search para validar campo exacto')`,
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
        subtopicId: "S07-T3-B",
        kind: "guided",
        title: "Compilar y reusar patrón de celular",
        preamble:
          "- **Contexto:** en un lote de logs sintéticos buscas celulares 9xxxxxxxx con word boundaries.\n- **Meta:** `compile` una vez y `findall` en dos textos.\n- **Éxito:** `tel 999000111 → ['999000111']` y `no match 123 → []`.\n- **Límites:** patrón `\\b9\\d{8}\\b`; no overvalides email aquí; datos sintéticos.",
        id: "S07-T3-B-E1",
        instruction:
          "1. El starter compila `\\b\\d{9}\\b` (cualquier 9 dígitos).\n2. Cambia a celulares que **empiezan en 9**.\n3. Reusa el mismo objeto `pat` en el bucle.\n4. Imprime `texto → lista` como en la salida esperada.",
        hint: "re.compile una vez",
        hints: [
          "re.compile una vez",
          "reuse en loop",
        ],
        edgeCases: ["reuse"],
        tests: "un match / vacío",
        feedback:
          "Nueve dígitos cualquiera no es la política de demo de celular PE. El `9` inicial y los boundaries reducen basura del log. `compile` documenta reutilización.",
        retrospective:
          "Compilar una vez hace visible que el patrón es una regla reutilizada; no vuelve verdadero todo número de nueve dígitos. Si confundiste rendimiento con validez, separa las preguntas: ¿cuántas veces aplico la regla? y ¿qué evidencia respalda la regla? Transfiere el diseño a códigos de lote, donde un patrón compilado puede recorrer muchas líneas sin fingir significado de negocio.",
        starterCode: {
          language: 'python',
          title: "compile_reuse.py",
          code: `# TAREA: compile + findall de teléfonos 9xxxxxxxx
# DEFECT: patrón \d{9} sin ancla 9
import re
pat = re.compile(r'\b\d{9}\b')
for s in ['tel 999000111', 'no match 123']:
    print(s, '→', pat.findall(s))`,
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
        subtopicId: "S07-T3-B",
        kind: "independent",
        title: "findall de códigos LIM-01 / CUS-02",
        preamble:
          "- **Contexto:** un log de operaciones marca regiones con códigos `AAA-99` en mayúsculas.\n- **Meta:** extraer **todas** las apariciones con un patrón simple.\n- **Éxito:** `['LIM-01', 'CUS-02']`.\n- **Límites:** patrón aburrido; no inventes validación de región real; sin backtracking exótico.",
        id: "S07-T3-B-E2",
        instruction:
          "1. Sobre el log dado, usa `findall` con el patrón de 3 mayúsculas, guion y 2 dígitos.\n2. Imprime la lista completa.\n3. (E2: corrige el case del starter sin tutorial.)",
        hint: "re.findall(pat, log)",
        hints: [
          "re.findall(pat, log)",
          "Patrón simple.",
        ],
        edgeCases: ["multi match"],
        tests: "LIM-01 CUS-02",
        feedback:
          "`findall` lista todas las apariciones en orden. El error de case (`[a-z]` vs. `[A-Z]`) es silencioso: lista vacía sin excepción.",
        retrospective:
          "`findall` conserva el orden de aparición, pero solo devuelve lo que el patrón reconoce. Si una variante en minúsculas desaparece, no habrá excepción que te avise: una lista vacía también es una salida válida. Prueba de transferencia: añade una variante con guion distinto y decide si ajustar el patrón, normalizar antes o registrar el valor para revisión.",
        starterCode: {
          language: 'python',
          title: "findall_codes.py",
          code: `# TAREA: findall de códigos LIM-01 / CUS-02
# DEFECT: lower case codes
import re
log = 'ok LIM-01 y CUS-02 fin'
codes = re.findall(r'[a-z]{3}-\d{2}', log)
print(codes)`,
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
        subtopicId: "S07-T3-B",
        kind: "transfer",
        title: "Riesgo de catastrophic backtracking",
        preamble:
          "- **Contexto:** en pipelines de intake, un patrón «listo» con cuantificadores anidados puede colgar el proceso ante input hostil.\n- **Meta:** explicar el riesgo de `(a+)+b` y la mitigación sin ejecutar el caso hostil.\n- **Éxito:** cuatro líneas: patrón peligroso, riesgo (CPU/bloqueo), mitigación (patrones simples, límite de entrada o `str`) y preferencia por validación por pasos.\n- **Límites:** **no** ejecutes el patrón sobre strings largos de `a`; recuerda que `re` no tiene un parámetro de timeout.",
        id: "S07-T3-B-E3",
        instruction:
          "1. Reescribe los prints del starter para que coincidan con la política canónica del panel (patrón peligroso, riesgo de CPU/bloqueo, mitigación, preferir `a+b` o pasos).\n2. Nombra *catastrophic backtracking* en lenguaje claro.\n3. Propón mitigaciones disponibles: simplificar a `a+b`, limitar la entrada, usar `str.find`/`split` o aislar patrones no confiables fuera del proceso.\n4. No prometas un timeout inexistente en `re`: esta superficie evalúa juicio de ingeniería, no un match más.",
        hint: "Cuantificadores anidados ambiguos",
        hints: [
          "Cuantificadores anidados ambiguos",
          "Mensaje en español peruano/claro.",
        ],
        edgeCases: ["límites regex"],
        tests: "mitigación documentada",
        feedback:
          "«Regex aburrida» es una feature de producto. El starter decía que el riesgo era cero: eso es el misconception a reparar. No ejecutes strings hostiles para «demostrarlo».",
        retrospective:
          "No necesitas congelar el navegador para demostrar el riesgo: los cuantificadores anidados y una entrada creciente explican la explosión de caminos. Si tu plan era «probar hasta que falle», estabas convirtiendo una advertencia en incidente. Transfiere el control a cualquier entrada no confiable: limita tamaño, simplifica el patrón, prefiere `str` o aísla la ejecución cuando no exista *timeout*.",
        starterCode: {
          language: 'python',
          title: "backtracking_note.py",
          code: `# TAREA: explica riesgo de backtracking (sin ejecutar hostiles)
# DEFECT: recomienda (a+)+b en prod
print('patrón recomendado: (a+)+b sobre strings largos de letras a')
print('riesgo: ninguno en Python')
print('mitigación: no hace falta')
print('preferir regex complejas siempre')`,
        },
        solutionCode: {
          language: 'python',
          title: "backtracking_note.py",
          code: `print('patrón peligroso: (a+)+b sobre strings largos de a\\'s')
print('riesgo: catastrophic backtracking → CPU alta / hang')
print('mitigación: patrón simple, entrada acotada o str.find/split')
print('preferir a+b o validación por pasos')`,
          output: `patrón peligroso: (a+)+b sobre strings largos de a's
riesgo: catastrophic backtracking → CPU alta / hang
mitigación: patrón simple, entrada acotada o str.find/split
preferir a+b o validación por pasos`,
        },
      },
      {
        subtopicId: "S07-T4-A",
        kind: "guided",
        title: "Exact match con NFC, colapso y casefold",
        preamble:
          "- **Contexto:** antes de Jaccard, el matching de intake intenta igualdad tras el mismo pipeline de normalización.\n- **Meta:** NFC + colapsar espacios + casefold y comparar.\n- **Éxito:** `True` para `'  Juan  PEREZ '` vs. `'juan perez'`.\n- **Límites:** no uses Jaccard aquí; no auto-fusionar; datos sintéticos.",
        id: "S07-T4-A-E1",
        instruction:
          "1. Reescribe `norm`: el starter no hace NFC ni colapsa espacios internos.\n2. Pipeline: `normalize('NFC', s)` → `' '.join(...split())` → `casefold()`.\n3. Imprime el booleano de igualdad.\n4. No agregues scores.",
        hint: "NFC → join split → casefold",
        hints: [
          "unicodedata.normalize('NFC', s) luego ' '.join(s.split()).casefold()",
          "print bool",
        ],
        edgeCases: ["exact normalizado"],
        tests: "True",
        feedback:
          "`strip().lower()` no colapsa dobles espacios ni unifica formas Unicode. Sin NFC + join/split + casefold, el «exact» del intake miente y genera FN o merges frágiles.",
        retrospective:
          "La igualdad pasa solo después de aplicar el mismo pipeline a ambos lados; esa simetría es la causa, no el deseo de que coincidan. Si saltaras directo a un score, ocultarías un problema de forma que tiene solución exacta y auditable. Transfiere la regla a emails normalizados: exact primero; similitud solo cuando el producto haya definido por qué la necesita.",
        starterCode: {
          language: 'python',
          title: "exact_norm.py",
          code: `# TAREA: exact match con NFC + collapse + casefold
# DEFECT: solo lower strip; sin NFC ni collapse
def norm(s):
    return s.strip().lower()
print(norm('  Juan  PEREZ ') == norm('juan perez'))`,
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
        subtopicId: "S07-T4-A",
        kind: "independent",
        title: "Jaccard de tokens con NFC",
        preamble:
          "- **Contexto:** si el exact normalizado falla, un score de solapamiento de tokens es señal **débil** para review.\n- **Meta:** implementar Jaccard |A∩B|/|A∪B| tras NFC + casefold + split.\n- **Éxito:** `0.667` redondeado a 3 decimales para Juan Perez / Juan P Perez.\n- **Límites:** no uses `min` de longitudes; no auto-fusionar; no afirmes identidad.",
        id: "S07-T4-A-E2",
        instruction:
          "1. Tokeniza con NFC previo.\n2. Corrige el denominador: unión de conjuntos, no `min`.\n3. Maneja vacíos (ambos vacíos → 1.0; uno vacío → 0.0) como en el contrato de la demo.\n4. Imprime `round(..., 3)`.",
        hint: "|A∩B|/|A∪B| tras NFC",
        hints: [
          "NFC → set(casefold().split())",
          "|A∩B|/|A∪B|",
        ],
        edgeCases: ["score parcial"],
        tests: "≈0.667",
        feedback:
          "`min(len)` infla el score (Dice-like). Jaccard usa la unión. Sin NFC, formas visualmente iguales se desdoblan en tokens distintos. Score parcial → review, no merge.",
        retrospective:
          "El resultado 0.667 se explica con dos tokens compartidos sobre tres distintos; muestra esos conjuntos antes de confiar en la cifra. Si contaste duplicados como más evidencia, olvidaste que Jaccard usa conjuntos. Transfiere el cálculo a etiquetas de productos y pregunta si perder frecuencia es aceptable; quizá otro modelo sea necesario, pero la evidencia debe seguir visible.",
        starterCode: {
          language: 'python',
          title: "jaccard_impl.py",
          code: `# TAREA: Jaccard de tokens con NFC previo
# DEFECT: intersection/min len; sin NFC
def token_jaccard(a, b):
    A, B = set(a.casefold().split()), set(b.casefold().split())
    if not A or not B:
        return 0.0
    return len(A & B) / min(len(A), len(B))
print(round(token_jaccard('Juan Perez', 'Juan P Perez'), 3))`,
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
        subtopicId: "S07-T4-A",
        kind: "transfer",
        title: "Umbrales exact / review / no_match",
        preamble:
          "- **Contexto:** el pipeline de matching emite una decisión de **proceso**, no un veredicto legal.\n- **Meta:** aplicar umbrales: 1.0 → exact; [0.4, 1.0) → review; <0.4 → no_match.\n- **Éxito:** `review Juan Perez Juan P Perez 0.67`.\n- **Límites:** no auto-merge en review; no digas «es la misma persona».",
        id: "S07-T4-A-E3",
        instruction:
          "1. Con score `0.67`, corrige la rama que hoy cae en `exact`.\n2. Exact solo si `score == 1.0`.\n3. Imprime `decision a b score` en una línea.\n4. Superficie: política de umbrales, no el cálculo de Jaccard.",
        hint: "Umbrales explícitos",
        hints: [
          "Umbrales explícitos",
          "No auto-merge en review.",
        ],
        edgeCases: ["score medio"],
        tests: "review",
        feedback:
          "Un umbral flojo que convierte 0.67 en `exact` fabrica fusiones. Review es el default honesto ante ambigüedad: no digas «misma persona» por un score medio.",
        retrospective:
          "Cambiar la primera condición de `>= 0.5` a `== 1.0` evita que una similitud parcial se disfrace de exactitud. Si pensabas que 0.67 «parece alto», estabas sustituyendo una política explícita por intuición. Transfiere el diseño a otro dominio: documenta umbrales, casos frontera y acción humana antes de calcular scores; nunca después de verlos.",
        starterCode: {
          language: 'python',
          title: "score_review.py",
          code: `# TAREA: umbrales exact / review / no_match
# DEFECT: score 0.67 → exact
a, b, score = 'Juan Perez', 'Juan P Perez', 0.67
if score >= 0.5:
    decision = 'exact'
elif score >= 0.4:
    decision = 'review'
else:
    decision = 'no_match'
print(decision, a, b, score)`,
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
        subtopicId: "S07-T4-B",
        kind: "guided",
        title: "Etiquetar FP y FN en dos casos",
        preamble:
          "- **Contexto:** al tunear umbrales de matching necesitas nombrar el error, no solo el score.\n- **Meta:** pred match + truth no → FP; pred no + truth match → FN.\n- **Éxito:** `FP` luego `FN`.\n- **Límites:** casos sintéticos de métricas; no son veredictos legales ni de parentesco.",
        id: "S07-T4-B-E1",
        instruction:
          "1. Revisa el starter: las etiquetas FP/FN están cruzadas.\n2. Corrige las ramas del `if`.\n3. Imprime una etiqueta por caso.\n4. No agregues scores ni razones aún (eso es E2).",
        hint: "Tabla de confusión 2x2 simplificada",
        hints: [
          "Tabla de confusión 2x2 simplificada",
          "print tag por caso",
        ],
        edgeCases: ["FP FN"],
        tests: "FP luego FN",
        feedback:
          "FP = el sistema dijo match y no debía; FN = debía coincidir y no lo hizo. Invertirlos entrena mal el umbral.",
        retrospective:
          "La etiqueta depende de dos columnas, no de si el resultado «parece malo»: predicción y verdad sintética. Si inviertes FP y FN, moverás el umbral en la dirección equivocada. Transfiere la matriz a un filtro de fraude o spam y escribe el costo de cada error; la misma tasa puede exigir políticas distintas según el daño.",
        starterCode: {
          language: 'python',
          title: "classify_fpfn.py",
          code: `# TAREA: etiqueta FP y FN en dos casos sintéticos
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
    print(tag)`,
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
        subtopicId: "S07-T4-B",
        kind: "independent",
        title: "Empaquetar evidencia de matching",
        preamble:
          "- **Contexto:** el log del ETL debe conservar qué se comparó y por qué quedó en review, no solo un booleano.\n- **Meta:** dict con `raw_a`, `raw_b`, `score`, `decision`, `reason`.\n- **Éxito:** dict completo; decision `review`; reason en español que mencione revisión humana / similitud parcial.\n- **Límites:** no digas «misma persona» ni «familia»; datos sintéticos.",
        id: "S07-T4-B-E2",
        instruction:
          "1. Completa el dict del starter (falta `reason`; `decision` incorrecta).\n2. Usa score 0.67 y decision `review`.\n3. Escribe un `reason` en español que mencione similitud parcial y revisión humana (usa la frase canónica del panel si hay comparación exacta de salida).\n4. Imprime el dict completo.",
        hint: "Un dict con 5 claves",
        hints: [
          "Un dict con 5 claves",
          "reason en español",
        ],
        edgeCases: ["evidencia"],
        tests: "5 keys",
        feedback:
          "Evidencia estructurada sobrevive al log del ETL; un `match` sin reason no se audita. Review + reason es el paquete honesto.",
        retrospective:
          "El dict corregido permite reconstruir qué se comparó, qué señal apareció y por qué una persona debe revisar. Un booleano `match` sin `reason` borra la incertidumbre y dificulta auditar un error. Transfiere este paquete a una regla distinta: conserva entradas, transformación, resultado y razón; evita registrar PII real innecesaria en ejemplos o reportes.",
        starterCode: {
          language: 'python',
          title: "pack_evidence.py",
          code: `# TAREA: empaqueta evidencia raw/score/decision/reason
# DEFECT: decision=match y sin reason
evidence = {
    'raw_a': 'Juan Perez',
    'raw_b': 'Juan P Perez',
    'score': 0.67,
    'decision': 'match',
}
print(evidence)`,
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
        subtopicId: "S07-T4-B",
        kind: "transfer",
        title: "Sin afirmaciones de parentesco ni identidad",
        preamble:
          "- **Contexto:** el gate de cumplimiento del capstone N1-B prohíbe convertir un score textual en veredicto familiar o legal.\n- **Meta:** en 2–3 prints, explicar por qué el pipeline no afirma parentesco ni identidad legal.\n- **Éxito:** líneas que cubran: score ≠ prueba familiar; falta fuente autoritativa; solo evidencia para humano.\n- **Límites:** no inventes veredictos; no cites RENIEC como si el código lo consultara.",
        id: "S07-T4-B-E3",
        instruction:
          "1. Reescribe los tres prints del starter para que coincidan con las líneas canónicas del panel (hoy afirman lo prohibido).\n2. Cubre parentesco, identidad legal y rol del humano.\n3. Mantén lenguaje claro y profesional.\n4. Superficie: política, no un score más.",
        hint: "Falta fuente autoritativa; riesgo ético; score ≠ prueba",
        hints: [
          "Falta fuente autoritativa; riesgo ético; score ≠ prueba",
          "Español claro.",
        ],
        edgeCases: ["ética"],
        tests: "3 líneas de política",
        feedback:
          "Jaccard no es RENIEC. El misconception es «score alto = familia/identidad». El sistema empaqueta señales; la persona decide fusiones sensibles.",
        retrospective:
          "Las tres líneas delimitan honestamente el sistema: un score textual no consulta una fuente autoritativa ni prueba familia o identidad. Si te parecía prudente decir «probablemente es la misma persona», aún estabas convirtiendo señal en veredicto. Lleva el límite al You Do: cada decisión sensible conserva evidencia, declara incertidumbre y termina en revisión humana.",
        starterCode: {
          language: 'python',
          title: "no_parentesco.py",
          code: `# TAREA: explica por qué no hay afirmaciones de parentesco
# DEFECT: afirma parentesco e identidad legal
print('Afirmamos parentesco: score alto prueba familia.')
print('Afirmamos identidad legal: score textual basta para RENIEC.')
print('Emitimos veredicto automático sin humano.')`,
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
      "Proyecto independiente (You Do): cierras el tramo textual de **CP-N1-B** con un pipeline que conserva **raw**, emite **normalized** y registra **transforms** por campo. Antes de programar, prepara una tabla con cinco columnas: `campo | raw | transformación prevista | normalized esperado | decisión/review`. Traza a mano un caso feliz y uno ambiguo; solo después implementa por etapas: nombre, email, teléfono e integración. Combinas Unicode NFC, nombres con dos apellidos y partículas, contacto modesto, `str` primero y regex justificada. Sin scraping, HTTP, SQL, PII real ni afirmaciones de identidad legal.",
    objectives: [
      "normalize_record → {raw, normalized, transforms, status, review_reasons}",
      "NFC + casefold donde corresponda en nombres",
      "Dos apellidos / status review si el parse es incompleto",
      "str primero; regex solo si aporta y se justifica en el README",
      "Tests con ejemplos latam sintéticos (partícula, plus email, +51)",
    ],
    requirements: [
      "Firma normalize_record(raw: dict) documentada en docstring",
      "Unicode NFC en campos de nombre; colapso de espacios documentado",
      "Sin scraping, HTTP ni SQL en este proyecto",
      "Solo datos sintéticos peruanos/latam (sin PII real)",
      "Email: un @, local/dominio no vacíos, cero espacios; plus permitido; inválido → review (no inventar local)",
      "Teléfono: solo dígitos; conserva dígitos del prefijo 51; no inferir operadora ni raise por longitud",
      "transforms es un dict por campo cuya lista sigue el orden de aplicación (nfc, collapse_spaces, casefold, digits_only, …)",
      "status es ok o review; review_reasons conserva razones por campo y queda vacío en el caso feliz",
      "Si agregas matching, empaqueta evidencia sin afirmaciones de parentesco ni identidad legal",
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
    """→ {raw, normalized, transforms, status, review_reasons}."""
    # Contrato: transforms={"nombre": [...], "email": [...], "telefono": [...]}
    # status es ok o review; review_reasons conserva razones por campo
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
      "Muestra en README tres casos y su evidencia: nombre con partícula, email con `+` y teléfono con máscara. Incluye la tabla `raw → transforms → normalized → decisión`, un caso que termine en `review` y un test que habría fallado antes. Describe el límite de no-parentesco como decisión de diseño, no como promesa decorativa.",
    rubric: [
      { criterion: "raw + normalized + transforms", weight: "25%" },
      { criterion: "Unicode y nombres latam", weight: "25%" },
      { criterion: "Email/tel con validación modesta (sin overvalidation)", weight: "20%" },
      { criterion: "Regex solo si aporta (opcional y justificada)", weight: "10%" },
      { criterion: "Evidencia sin parentesco", weight: "10%" },
      { criterion: "Tests de ejemplos latam", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo, toma tu caso ambiguo y reconstruye la ejecución solo con `raw`, `transforms` y decisión. ¿Puedes señalar qué etapa causó cada cambio? ¿Qué dato se negó a inventar el programa? ¿Qué prueba distingue forma usable de existencia real? Si agregaste matching, intenta redactar una conclusión indebida y demuestra qué evidencia falta para sostenerla. Finalmente aplica el pipeline a un caso internacional con otra convención de nombre: registra dónde deja de servir tu heurística. En S08 conectarás este rastro con archivos, encodings y un manifest de ingesta.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Por qué 'José' y 'Jose\\u0301' pueden fallar en == ?",
        options: ["Python no soporta tildes", "casefold borra la é", "Formas Unicode distintas (NFC vs. NFD)", "Son de tipos distintos"],
        correctIndex: 2,
        explanation:
          "La respuesta correcta es NFC frente a NFD: la pantalla oculta que una forma usa `é` compuesta y la otra `e` más marca combinante. Python sí soporta tildes, `casefold` no explica esa diferencia y ambos valores siguen siendo `str`. Normaliza ambos lados antes de comparar.",
      },
      {
        question: "En nombres latam, si solo hay un token, la política segura es…",
        options: ["Marcar review y conservar raw", "Inventar apellido2 vacío en silencio", "Rechazar y borrar el registro", "Asumir formato first/last US"],
        correctIndex: 0,
        explanation:
          "Con un token no existe evidencia para poblar dos apellidos, así que `review` y `raw` preservan la incertidumbre. Un valor vacío inventado sigue siendo invención; borrar el registro destruye evidencia y asumir formato US impone una convención que la entrada no confirmó.",
      },
      {
        question: "¿Cuándo preferir str.replace/split sobre regex?",
        options: ["Nunca", "Cuando la transformación es literal/simple", "Solo en emails", "Solo si el string es ASCII"],
        correctIndex: 1,
        explanation:
          "Una transformación literal o una separación simple pertenece a `str`: expresa mejor la intención y reduce riesgo de *overfit* o *backtracking*. No depende de que sea email ni ASCII. «Nunca» también falla: regex sí aporta cuando debes reconocer una forma variable con grupos o límites.",
      },
      {
        question: "En un parse de nombres latam, las partículas (`de`, `del`, `de la`)…",
        options: ["Se eliminan siempre del given", "Solo existen en inglés", "Obligan a usar un único `\\w+` en regex", "Pueden quedar en given o apellidos; no fuerces first/last US"],
        correctIndex: 3,
        explanation:
          "Las partículas pueden pertenecer al nombre o a un apellido; borrarlas destruye información. No son un fenómeno inglés ni caben con seguridad en un único `\\w+`. La opción prudente conserva tokens, documenta la heurística y envía ambigüedades a `review` en vez de forzar first/last US.",
      },
      {
        question: "Un Jaccard 0.67 entre nombres debe…",
        options: ["Fusionar identidades automáticamente", "Afirmar parentesco", "Ir a review con evidencia (raw, score)", "Borrar ambos registros"],
        correctIndex: 2,
        explanation:
          "Un 0.67 describe solapamiento parcial de tokens, no identidad. Por eso se conserva `raw`, score, razón y decisión `review`. Fusionar o afirmar parentesco excede la evidencia; borrar registros tampoco resuelve la ambigüedad. El humano evalúa el contexto que el texto por sí solo no contiene.",
      },
      {
        question: "¿Qué hace `re.fullmatch(r'\\d{8}', 'DNI 12345678')` frente a `search`?",
        options: ["fullmatch no coincide; search sí encuentra los 8 dígitos", "Ambos fallan", "fullmatch coincide; search no", "Lanza excepción"],
        correctIndex: 0,
        explanation:
          "`fullmatch` pregunta si toda la entrada son ocho dígitos, así que el prefijo `DNI ` hace fallar el contrato. `search` sí encuentra el fragmento numérico interno. Ninguna función lanza excepción aquí: responden preguntas distintas, validación completa frente a extracción dentro de contexto.",
      },
      {
        question: "Política modesta de email en este curso exige…",
        options: ["Regex que solo acepte .com", "Exactamente un @, local y dominio no vacíos, sin espacios", "Verificar que el buzón exista por SMTP", "Rechazar plus addressing"],
        correctIndex: 1,
        explanation:
          "El curso comprueba una estructura mínima observable: un `@`, partes no vacías y ausencia de espacios. Una regex solo `.com` rechaza válidos, SMTP sería una verificación externa y prohibir *plus addressing* crea falsos negativos. Aun la opción correcta no demuestra que el buzón exista.",
      },
      {
        question: "Ante un patrón con cuantificadores anidados ambiguos, la postura del curso es…",
        options: ["Usarlo siempre por elegancia", "Confiar en que Python optimiza todo", "Solo importa en JavaScript", "Preferir patrones simples, limitar la entrada o usar `str`; `re` no ofrece timeout"],
        correctIndex: 3,
        explanation:
          "Cuantificadores anidados pueden multiplicar caminos de búsqueda; confiar en optimización o en otro lenguaje no elimina el riesgo. La respuesta segura simplifica el patrón, limita la entrada o vuelve a `str`. Como `re` no ofrece *timeout*, patrones no confiables requieren aislamiento o rediseño.",
      },
      {
        question: "¿Para qué sirve `re.compile` en un loop de extracción sobre logs?",
        options: ["Es obligatorio o fullmatch falla", "Sustituye a NFC en nombres", "Reutiliza el patrón con claridad (y un micro-ahorro); findall/finditer lo consumen", "Valida que el buzón de email exista"],
        correctIndex: 2,
        explanation:
          "`re.compile` hace explícita una regla reutilizada y permite consumirla con `findall` o `finditer`; puede aportar un micro-ahorro. No es obligatorio para que `fullmatch` funcione, no normaliza Unicode y jamás verifica la existencia de un buzón. Reutilización no equivale a verdad de negocio.",
      },
      {
        question: "En un teléfono PE sintético `+51 999-000-111`, la política de normalización es…",
        options: ["Solo dígitos (`51999000111`); longitud/operadora van a review, no a raise automático", "Conservar el `+` y validar operadora", "Rechazar si no hay 9 dígitos locales exactos", "Usar regex que exija el formato con guiones"],
        correctIndex: 0,
        explanation:
          "`digits_only` produce `51999000111`: conserva los dígitos del prefijo y elimina signos de presentación. Mantener `+`, exigir guiones o imponer nueve dígitos mezcla formato con verificación. La operadora, longitud contextual y existencia requieren otra política; aquí se registran para `review`, no se inventa certeza con `raise`.",
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
