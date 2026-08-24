import type { CourseSection } from '../../types'

export const section30: CourseSection = {
  id: "security-infra",
  index: 30,
  title: "Entity resolution probabilístico",
  shortTitle: "ER probabilístico",
  tagline: "Motor de entity resolution testeable: benchmark etiquetado, blocking medido, comparadores explicables y cola de revisión",
  estimatedHours: 18,
  level: "Práctica independiente",
  phase: 2,
  icon: "GitMerge",
  accentColor: "bg-gradient-to-br from-fuchsia-500 to-purple-900",
  jobRelevance:
    "Aquí construyes un motor de entity resolution testeable: comparadores, blocking con recall medido (esto es, qué fracción de los pares verdaderos pasan el filtro rápido), pesos y umbrales, y métricas de precisión y recall. Los scores solo priorizan la cola de revisión clerical; nunca etiquetan fraude, parentesco ni colusión. En equipos de datos de bancos, telecom o retail en Perú y LatAm, este motor une contactos duplicados antes de alimentar grafos de evidencia y almacenes SQL.",
  learningOutcomes: [
    { text: "Implementar comparadores exact, edit, token y fecha que devuelven score en [0,1] y registrar el aporte por campo" },
    { text: "Clasificar ausencia de campo como missing (vacío ≠ desacuerdo) y bajar el peso de valores frecuentes en acuerdos" },
    { text: "Diseñar claves de blocking y medir candidate recall sobre un gold sintético etiquetado" },
    { text: "Estimar el costo de pares por bloque y filtrar pares imposibles antes del scorer (filter_before_score)" },
    { text: "Calcular score ponderado didáctico y aplicar umbrales auto_match / review / non_match de forma conservadora" },
    { text: "Construir ítems de cola clerical y mantener consistencia de cluster con Union-Find" },
    { text: "Partir pares por entidad sin leakage: train/test disjuntos y pares cross_split fuera de métricas primarias" },
    { text: "Reportar precisión/recall/F1 pairwise, co-cluster completeness/quality (vista de cluster) y error slices accionables" },
  ],
  theory: [
    {
            heading: "Dos fichas con el mismo nombre mal escrito de dos maneras distintas",
      paragraphs: [
        "«María Rodríguez» en una, «Maria Rodriguez Perez» en otra, con teléfonos que coinciden en seis de nueve dígitos. ¿Es la misma persona? A veces sí, a veces son madre e hija, y a veces son dos desconocidas que comparten un apellido común. Esta sección trata de responder esa pregunta con evidencia y de decir con honestidad cuándo no se puede responder.",
        "Antes de nada, un límite que ordena todo lo demás. La **entity resolution** contesta una sola pregunta: ¿estos dos registros apuntan a la misma entidad del mundo real? Un score alto no es un veredicto de fraude ni una prueba de parentesco. Lo único que hace un score es ordenar una cola para que una persona revise primero lo más probable.",
        "Comparar todo contra todo es inviable: un millón de registros da medio billón de pares. La salida es el **blocking** — agrupar por una clave barata, como las primeras letras del apellido más el año, y comparar solo dentro de cada grupo. Se gana tiempo y se paga un precio que hay que medir: los pares verdaderos que quedaron en grupos distintos y ya nunca se compararán.",
        "El resultado no es un sí o un no, sino tres zonas. Por encima de cierto umbral se acepta automáticamente; por debajo de otro se descarta; en medio queda la franja que va a revisión humana. Elegir esos dos umbrales es una decisión de negocio con consecuencias asimétricas — unir dos personas distintas no cuesta lo mismo que dejar duplicada a una sola.",
        "La pregunta que gobierna la sección tiene dos partes: **¿qué evidencia tengo de que son la misma entidad, y qué hago con la duda?** Trabajas sobre contactos sintéticos de Lima con correos `@example.pe`, y la respuesta a la segunda parte nunca es adivinar: es enviar a revisión.",
      ],
      callout: {
        type: "info",
        title: "Criterio de cierre CP-N3-A",
        content:
          "La promoción exige un motor ER ejecutable y evidencia de sus métricas, errores y casos enviados a revisión. Ética de la sección (una sola vez, aquí): scores priorizan humanos; nunca auto-etiquetan fraude ni parentesco.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, hilo entre secciones y criterios de promoción.",
        "**Orden de los subtemas.** T1 construye los comparadores —exacto, por edición, por tokens, por fecha— y trata los campos ausentes y la frecuencia de los valores. T2 pasa al blocking y su costo: claves, recall de candidatos y pares imposibles. T3 arma el matching con pesos, umbrales, cola clerical y agrupación. T4 cierra con la evaluación, partiendo por entidad para no inflar las métricas.",
        "**Hilo entre secciones.** El almacén de pares y decisiones de S29 alimenta este motor; la fusión de entidades usa Union-Find; en S31 esos nodos alimentan el grafo de evidencia. Las pruebas de S27 y las propiedades de S28 entran a la suite del portafolio.",
        "**Promoción.** Exige un motor ejecutable y evidencia de sus métricas, sus errores y los casos que envió a revisión.",
      ],
    },
    {
      heading: "exact, edit/token y fecha",
      subtopicId: "S30-T1-A",
      paragraphs: [
        "Tras el mapa de la sección, el primer ladrillo del motor son los **comparadores**. **Exact**: igualdad **después** de normalizar (`casefold` + colapsar espacios). **Edit** (Levenshtein normalizado): typos y diferencias de acentos leves. **Token**: Jaccard u overlap de palabras (orden “Ana López” / “López Ana”). **Fecha**: distancia en días con tolerancia. Cada uno aporta evidencia de identidad, no un veredicto de riesgo.",
        "Cada comparador devuelve un score en **[0,1]** o un nivel ordinal (`agree` / `disagree` / `missing`) listo para un modelo tipo **Fellegi–Sunter didáctico**: aquí usamos promedio ponderado de similitudes. El FS completo usa log₂(m/u) y prior λ (ver recursos de Linacre/Splink); no digas “sé FS” solo por promediar pesos. Ese score didáctico **no es una probabilidad calibrada** de match. Mezclar escalas sin normalizar invalida los umbrales de `auto_match` / `review`.",
        "Para auditoría clerical guarda **campo + función + aporte**. Sin vector de aportes, un 0.91 opaco no se puede cuestionar. En el Caso 30, email exacto y nombre con tokens reordenados son el primer humo de un match candidato. **Contrato missing**: si un lado está vacío, no llames a `exact`/`token` como si hubiera valor — dos vacíos no son acuerdo; T1-B formaliza el estado `missing`.",
      ],
      code: {
        language: 'python',
        title: "comparators.py",
        code: `def exact(a, b):
    # precondition: ambos lados observados (usa compare_field si hay vacíos)
    na = " ".join(a.casefold().split())
    nb = " ".join(b.casefold().split())
    if not na or not nb:
        return None  # missing: sin evidencia de similitud
    return 1.0 if na == nb else 0.0

def token_jaccard(a, b):
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    if not ta and not tb:
        return None  # missing–missing: no es acuerdo 1.0
    if not ta or not tb:
        return None  # un lado missing
    return len(ta & tb) / len(ta | tb)

def edit_sim(a, b):
    # distancia de Levenshtein normalizada (simple)
    la, lb = len(a), len(b)
    if la == 0 and lb == 0:
        return 1.0
    dp = list(range(lb + 1))
    for i, ca in enumerate(a, 1):
        prev, dp[0] = dp[0], i
        for j, cb in enumerate(b, 1):
            cur = dp[j]
            dp[j] = prev if ca == cb else 1 + min(prev, dp[j], dp[j - 1])
            prev = cur
    dist = dp[lb]
    return 1.0 - dist / max(la, lb)

def date_sim(d1, d2, tol_days=3):
    delta = abs((d1 - d2).days)
    if delta == 0:
        return 1.0
    if delta <= tol_days:
        return 0.5
    return 0.0

from datetime import date
print("exact", exact("Ana@example.pe", "ana@example.pe"))
print("token", round(token_jaccard("Ana López", "López Ana"), 3))
print("edit", round(edit_sim("María", "Maria"), 3))
print("date", date_sim(date(2020, 1, 1), date(2020, 1, 2)))`,
        output: `exact 1.0
token 1.0
edit 0.8
date 0.5`,
      },
      callout: {
        type: "tip",
        title: "Explicabilidad",
        content:
          "Guarda un vector de aportes por campo; el revisor clerical debe ver por qué el score es alto o por qué cayó a review.",
      },
    },
    {
      heading: "ausencia de campo (missingness) y frecuencia",
      figure: {
        id: "S30-er-pipeline",
        caption:
          "La zona gris no es un fallo del modelo: es el caso donde la evidencia solo alcanza para un «probablemente».",
        alt:
          "Grafo de dos registros a un par candidato, de ahí a un score, y del score a entidad resuelta o cola humana.",
      },
      subtopicId: "S30-T1-B",
      paragraphs: [
        "Los comparadores de T1-A asumen que ambos lados tienen valor. **Ausencia de campo (missingness)**: un vacío no es desacuerdo fuerte ni acuerdo. Usa el estado `missing` en la comparación (no lo trates como `disagree`). Si penalizas missing como desacuerdo, inflas non-matches espurios cuando una fuente simplemente no trae el campo.",
        "La ausencia puede ser **informativa**: ciertas fuentes nunca publican teléfono. Modela el patrón por fuente (`source_system`); no asumas **MCAR** (missing completely at random: aleatorio completo) sin evidencia. Eso obliga a decidir qué hace un `missing` en el scorer, y hay dos opciones que se parecen y no lo son. Contribuir 0 **conservando** el peso en el denominador es una penalización: el par baja de score por un dato que nadie tenía. Omitir el campo de numerador y denominador es neutral: el par se juzga sobre lo observado. Esta sección usa la segunda, y en T3 la verás escrita como `suma(sim·peso) / suma(pesos)` sobre campos observados. La diferencia tiene consecuencia en la decisión, no solo en el número: conservar el peso baja el score agregado y puede cruzar el umbral inferior hacia `non_match`, de modo que un dato que nadie tenía acaba pareciendo un desacuerdo. Omitir el campo no puede hacer eso. Por eso el enunciado que importa es el de la ausencia: **vacío no es desacuerdo**, y solo la segunda opción lo respeta.",
        "**Frecuencia**: valores muy comunes (nombre “María”, dominio genérico) bajan el peso de un acuerdo exacto — intuición de *u-probability* alta en Fellegi–Sunter. Aquí usamos `base/frecuencia` como **heurística didáctica**, no como estimación m/u completa. En contactos Lima sintéticos, un acuerdo en “María” pesa menos que en un apellido raro. Con comparadores y missing listos, T2 ataca el problema de escala: no puedes comparar all-pairs.",
      ],
      code: {
        language: 'python',
        title: "missing_freq.py",
        code: `def compare_field(a, b):
    if a is None or a == "" or b is None or b == "":
        return "missing"
    return "agree" if a.casefold() == b.casefold() else "disagree"

def frequency_weight(value, freq_table, base=1.0):
    # valores frecuentes → menos peso de acuerdo (heurística, no m/u FS completo)
    f = freq_table.get(value.casefold(), 1)
    return base / f

freq = {"maría": 50, "ximena": 2}
print("cmp_miss", compare_field("", "Ana"))
print("cmp_ok", compare_field("Ana", "ana"))
print("w_common", frequency_weight("María", freq))
print("w_rare", frequency_weight("Ximena", freq))`,
        output: `cmp_miss missing
cmp_ok agree
w_common 0.02
w_rare 0.5`,
      },
      callout: {
        type: "warning",
        title: "Missing ≠ disagree",
        content:
          "Penalizar missing como desacuerdo infla non-matches espurios y llena la cola de falsos negativos de revisión.",
      },
    },
    {
      heading: "reglas de blocking y candidate recall",
      subtopicId: "S30-T2-A",
      paragraphs: [
        "Con T1 listo, el cuello de botella es la escala. **Blocking** (bloqueo de candidatos) reduce el espacio de pares: solo comparas registros que comparten una clave (apellido normalizado + prefijo de ciudad, local-part de email, últimos dígitos de teléfono, etc.). Sin blocking, all-pairs es O(n²) e inviable a escala.",
        "**Candidate recall** (recall de candidatos): de los pares verdaderamente match en el **gold** sintético (conjunto etiquetado de referencia), ¿qué fracción pasó el blocking? Si ese recall es bajo, el scorer nunca ve el match — y ninguna métrica posterior lo salva. Mide con etiquetas sintéticas **antes** de “optimizar” CPU.",
        "Reglas en **unión (OR)** suben candidate recall; **intersección (AND)** reduce candidatos, pero puede matar recall de gold matches. En el demo de abajo el recall es **0.0 a propósito**: `López` y `lopez` generan claves distintas sin plegado de acentos. Primero normaliza (`casefold` + fold de tildes); luego mide. T2-B completa el cuadro con costo y pares imposibles.",
      ],
      code: {
        language: 'python',
        title: "blocking_recall.py",
        code: `def block_key(rec):
    name = " ".join(rec["name"].casefold().split())
    last = name.split()[-1] if name else ""
    return f"{last}|{rec.get('city','')[:3].casefold()}"

records = [
    {"id": "r1", "name": "Ana López", "city": "Lima"},
    {"id": "r2", "name": "ANA lopez", "city": "Lima"},
    {"id": "r3", "name": "Bob Díaz", "city": "Cusco"},
]
from collections import defaultdict
buckets = defaultdict(list)
for r in records:
    buckets[block_key(r)].append(r["id"])
# gold match (r1,r2) — pero las claves difieren por acento
gold = {frozenset(("r1", "r2"))}
candidates = set()
for ids in buckets.values():
    for i in range(len(ids)):
        for j in range(i + 1, len(ids)):
            candidates.add(frozenset((ids[i], ids[j])))
recall = len(gold & candidates) / len(gold)
print("buckets", {k: v for k, v in buckets.items()})
print("candidate_recall", recall)
print("n_cand", len(candidates))`,
        output: `buckets {'lópez|lim': ['r1'], 'lopez|lim': ['r2'], 'díaz|cus': ['r3']}
candidate_recall 0.0
n_cand 0`,
      },
      callout: {
        type: "tip",
        title: "Recall 0.0 = lección de normalización",
        content:
          "Aquí el recall es 0.0 a propósito: `López` vs. `lopez` no comparten clave sin plegado de acentos. Primero normaliza; luego mide candidate recall con gold sintético.",
      },
    },
    {
      heading: "combinaciones, costo y pares imposibles",
      subtopicId: "S30-T2-B",
      paragraphs: [
        "Candidate recall alto no basta si el bloque es monstruoso. El **costo** de comparación es O(suma n_b·(n_b−1)/2) por bloque. Una clave débil (solo ciudad “Lima”) mete decenas de miles de registros en un bloque y explota CPU/memoria. Vigila el tamaño máximo de bloque como **SLO** (service level objective: objetivo de nivel de servicio, la meta cuantitativa del batch) de diseño y redefine la clave antes de escalar el batch nocturno.",
        "**Pares imposibles**: reglas de exclusión (tipo persona vs. organización, fechas de nacimiento incompatibles en el fixture sintético) evitan gastar scorer en lo incomparable. El filtro corre **antes** del scorer pesado: política `filter_before_score` (filtrar antes de puntuar), no un post-filtro cosmético.",
        "Pipeline sano: blocking → filtro de imposibles → scorer → umbrales. Si inviertes el orden, pagas similitudes caras (distancia de edición, conjuntos de tokens) que nunca debieron calcularse. En el Caso 30, person vs. org se descarta sin invocar edit distance ni saturar la cola clerical. Con candidatos viables, T3 define cómo puntuar y decidir.",
      ],
      code: {
        language: 'python',
        title: "cost_impossible.py",
        code: `def pair_cost(block_sizes):
    return sum(n * (n - 1) // 2 for n in block_sizes)

def impossible(a, b):
    # sintético: tipos distintos no se comparan
    return a.get("type") != b.get("type")

sizes = [3, 10, 100]
print("cost", pair_cost(sizes))
a, b = {"type": "person"}, {"type": "org"}
print("skip", impossible(a, b))
print("policy", "filter_before_score")`,
        output: `cost 4998
skip True
policy filter_before_score`,
      },
      callout: {
        type: "danger",
        title: "Bloque de 100k",
        content:
          "Una clave demasiado gruesa puede generar miles de millones de pares. Vigila el tamaño de bloque y redefine la clave antes de escalar.",
      },
    },
    {
      heading: "pesos, probabilidad didáctica y umbrales",
      subtopicId: "S30-T3-A",
      paragraphs: [
        "Los candidatos de T2 llegan al **scorer**. Modelo **didáctico** de esta sección: `score = suma(sim·peso) / suma(pesos)` sobre similitudes en [0,1] **observadas** (campos missing se omiten del denominador). El modelo Fellegi–Sunter completo usa prior λ y pesos log₂(m/u) por acuerdo/desacuerdo; aquí priorizamos intuición operativa y umbrales duales. Etiqueta honesta: *simplificación didáctica*, no “FS en producción” ni probabilidad calibrada.",
        "**Umbrales duales**: `auto_match` si score ≥ `t_high`; `non_match` si score ≤ `t_low`; en medio → **review** (revisión clerical / cola humana). Nunca `auto_fraud`. Un `t_high` alto reduce falsos positivos que molestan a operaciones; la banda gris va a humanos con explicación por campo.",
        "Estima pesos con frecuencias o a mano **de forma documentada**; valida en gold sintético (T4) sin leakage de entidad. Un score 0.875 con phone en 0.0 debe aterrizar en `review`, no en `auto_match` ciego. T3-B cierra el loop operativo: cola clerical y clusters transitivos.",
      ],
      code: {
        language: 'python',
        title: "weights_thresh.py",
        code: `def pair_score(sims, weights):
    num = sum(sims[k] * weights[k] for k in weights)
    den = sum(weights.values())
    return num / den if den else 0.0

def decide(score, t_high=0.9, t_low=0.5):
    if score >= t_high:
        return "auto_match"
    if score <= t_low:
        return "non_match"
    return "review"

sims = {"name": 0.95, "email": 1.0, "phone": 0.0}
weights = {"name": 0.5, "email": 0.4, "phone": 0.1}
s = pair_score(sims, weights)
print("score", round(s, 3))
print("decision", decide(s))
print("explain", sims)`,
        output: `score 0.875
decision review
explain {'name': 0.95, 'email': 1.0, 'phone': 0.0}`,
      },
      callout: {
        type: "warning",
        title: "Auto-match conservador",
        content:
          "t_high alto reduce falsos positivos operativos; la banda gris es revisión humana con evidencia, no un limbo sin dueño.",
      },
    },
    {
      heading: "calibración, cola clerical y consistencia de cluster",
      subtopicId: "S30-T3-B",
      paragraphs: [
        "Decidir un par no termina el trabajo: hay que **calibrar** y **fusionar** con honestidad. **Calibración**: ajusta pesos o umbrales con pares etiquetados **sintéticos** (sin PII real — personally identifiable information, información personal identificable). Aquí “entrenamiento” significa calibración supervisada de un scorer interpretable, no un black-box que invente labels de riesgo o parentesco.",
        "**Cola clerical (clerical review)**: cada ítem lleva score, explicación por campo y acciones `match` / `non_match` / `uncertain`, más actor y timestamp. El espacio de labels de ER **no incluye** `fraud`: eso es otra tarea del path de investigación y se filtra en el borde del sistema.",
        "**Consistencia de cluster**: si A=B y B=C entonces A=C en la misma entidad. Resuelve uniones con **Union-Find** y revisa contradicciones (A=B, B≠C, A=C) antes de exportar nodos a S31. En el demo, una **aprobación clerical** de e3–e4 cierra el cluster e1…e4 de forma transitiva. La transitividad es propiedad del cierre; un puente falso (bridge) puede sobrefundir — valida el merge, no solo el `union`. T4 mide si ese motor generaliza sin leakage.",
      ],
      code: {
        language: 'python',
        title: "review_cluster.py",
        code: `class UnionFind:
    def __init__(self):
        self.p = {}
    def find(self, x):
        self.p.setdefault(x, x)
        if self.p[x] != x:
            self.p[x] = self.find(self.p[x])
        return self.p[x]
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra

uf = UnionFind()
# auto matches
for a, b in [("e1", "e2"), ("e2", "e3")]:
    uf.union(a, b)
review_queue = [
    {"pair": ("e3", "e4"), "score": 0.72, "explain": {"name": 0.8, "email": 0.5}}
]
# clerical: aprueba e3-e4
uf.union("e3", "e4")
print("same_cluster", uf.find("e1") == uf.find("e4"))
print("queue_n", len(review_queue))
print("label_space", ["match", "non_match", "uncertain"])`,
        output: `same_cluster True
queue_n 1
label_space ['match', 'non_match', 'uncertain']`,
      },
      callout: {
        type: "info",
        title: "Consistencia transitiva",
        content:
          "Clusters incoherentes (A=B, B≠C, A=C) son bugs de postproceso o de etiquetas — investiga el origen antes de exportar a S31.",
      },
    },
    {
      heading: "pares etiquetados y splits por entidad",
      subtopicId: "S30-T4-A",
      paragraphs: [
        "Sin evaluación honesta, el motor de T3 es teatro. El **benchmark etiquetado** tiene pares match/non-match **sintéticos**. Nunca uses el mismo par (ni la misma entidad) en train y test de umbrales sin control: eso es **leakage de identidad** (fuga de identidad) e infla métricas del motor de forma engañosa.",
        "**Split por entidad**: primero particiona entidades (o componentes) en conjuntos disjuntos; luego asigna pares. Un par es `train` solo si **ambos** extremos ⊆ train; `test` solo si **ambos** están fuera de train. Un par mixto es `cross_split`: no es test limpio y se excluye de las métricas primarias (o se reporta aparte). El error clásico es un split aleatorio de pares con entidades compartidas que “mejora” el F1 en el notebook y falla con contactos nuevos.",
        "Documenta tamaños de split y **prevalencia** (base rate) de matches — suele ser baja: pocos matches reales entre muchos non-matches. En el Caso 30, reporta match rate del gold junto al candidate recall del blocking y a P/R en el hold-out de entidades. T4-B convierte predicciones y clusters en métricas y slices de error.",
      ],
      code: {
        language: 'python',
        title: "splits_entity.py",
        code: `pairs = [
    {"a": "e1", "b": "e2", "y": 1},
    {"a": "e1", "b": "e3", "y": 0},
    {"a": "e4", "b": "e5", "y": 1},
    {"a": "e4", "b": "e6", "y": 0},
]
# entidades train: e1,e2,e3
train_entities = {"e1", "e2", "e3"}

def entity_split(pairs, train_entities):
    train, test = [], []
    for p in pairs:
        ents = {p["a"], p["b"]}
        if ents <= train_entities:
            train.append(p)
        else:
            test.append(p)
    return train, test

tr, te = entity_split(pairs, train_entities)
train_ents = {p["a"] for p in tr} | {p["b"] for p in tr}
test_ents = {p["a"] for p in te} | {p["b"] for p in te}
print("train_n", len(tr))
print("test_n", len(te))
print("entity_overlap", len(train_ents & test_ents))`,
        output: `train_n 2
test_n 2
entity_overlap 0`,
      },
      callout: {
        type: "danger",
        title: "Leakage por entidad",
        content:
          "Partir al azar pares con entidades compartidas infla métricas del motor y engaña al cierre de CP-N3-A.",
      },
    },
    {
      heading: "precisión/recall, métricas de cluster y error slices",
      subtopicId: "S30-T4-B",
      paragraphs: [
        "Con el split de T4-A, mide lo que el motor predice. **Pairwise** (par a par): precisión, recall y F1 sobre pares predichos vs. gold. Un F1 pairwise alto puede esconder clusters partidos o fusionados de más. Por eso reportas también una vista de **cluster**.",
        "**Cluster (simplificado didáctico)**: *co-cluster completeness* ≈ fracción de pares gold match que el sistema mantiene en el mismo cluster (recall de uniones). *Co-cluster quality* ≈ fracción de pares predichos como co-cluster que son match en el gold (precisión de uniones). En literatura de *blocking*, *pairs completeness* / *pairs quality* miden el espacio de candidatos; aquí reutilizamos la familia de nombres solo como vista de co-cluster, etiquetada y simplificada. En el demo calculas ambas sobre Union-Find sintético; no es toda la literatura de clustering metrics, pero ya no es solo un nombre en el párrafo.",
        "**Error slices** (rebanadas de error): corta fallos por fuente, apellido frecuente, teléfono ausente, ciudad. Encuentra fallas sistemáticas sin convertir un error de matching en acusación de fraude. El índice de error del demo es la semilla de un slice (`missing_phone`, `common_last_name`, …). Con T1–T4 cerrados, el You Do ensambla el motor CP-N3-A completo.",
      ],
      code: {
        language: 'python',
        title: "metrics_slices.py",
        code: `def prf(y_true, y_pred):
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)
    prec = tp / (tp + fp) if tp + fp else 0.0
    rec = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * prec * rec / (prec + rec) if prec + rec else 0.0
    return prec, rec, f1

def pair_completeness(gold_pairs, predicted_same):
    # recall de uniones: gold match que el cluster predicho mantiene unidos
    if not gold_pairs:
        return 0.0
    ok = sum(1 for a, b in gold_pairs if predicted_same(a, b))
    return ok / len(gold_pairs)

def pair_quality(pred_pairs, gold_set, predicted_same):
    # precisión de uniones: co-cluster predicho que es match en gold
    if not pred_pairs:
        return 0.0
    ok = sum(
        1
        for a, b in pred_pairs
        if predicted_same(a, b) and frozenset((a, b)) in gold_set
    )
    return ok / len(pred_pairs)

y_true = [1, 1, 0, 0, 1]
y_pred = [1, 0, 0, 1, 1]
p, r, f = prf(y_true, y_pred)
errors = [i for i, (t, pr) in enumerate(zip(y_true, y_pred)) if t != pr]
# cluster sintético: e1-e2 unidos; gold match e1-e3 partido
gold_pairs = [("e1", "e2"), ("e1", "e3")]
gold_set = {frozenset(p) for p in gold_pairs}
clusters = {"e1": "c0", "e2": "c0", "e3": "c1"}
same = lambda a, b: clusters[a] == clusters[b]
# pares que el sistema predijo como co-cluster (aquí solo e1-e2)
pred_pairs = [("e1", "e2")]
pc = pair_completeness(gold_pairs, same)
pq = pair_quality(pred_pairs, gold_set, same)
print("precision", round(p, 3))
print("recall", round(r, 3))
print("f1", round(f, 3))
print("error_idx", errors)
print("pair_completeness", pc)
print("pair_quality", pq)`,
        output: `precision 0.667
recall 0.667
f1 0.667
error_idx [1, 3]
pair_completeness 0.5
pair_quality 1.0`,
      },
      callout: {
        type: "tip",
        title: "Pairwise vs. cluster",
        content:
          "Un cluster partido castiga recall pairwise y co-cluster completeness; un cluster sobrefundido castiga co-cluster quality. Reporta pairwise + ambas vistas de co-cluster en el README.",
      },
    },
  ],
  iDo: {
    intro: "Te demuestro el cierre de CP-N3-A en ocho demos alineadas a T1–T4: comparadores con normalización, missing y frecuencia, blocking con candidate recall, costo e imposibles, score y umbrales, Union-Find con aprobación clerical, split por entidad y métricas con índices de error. Corre cada demo; la salida debe coincidir con lo declarado. Ningún score infiere fraude.",
    steps: [
      {
        demoId: "S30-T1-A-DEMO",
        subtopicId: "S30-T1-A",
        environment: "local-python",
        description: "Exact post-normalización (email con distinta capitalización) y Jaccard de tokens con orden invertido (nombre «Ana López» frente a «López Ana»).",
        preamble:
          "Antes de puntuar un par de contactos del Caso 30, el motor necesita comparadores honestos. En esta demo un email sintético con distinta capitalización y un nombre con tokens reordenados («Ana López» / «López Ana») deben dar evidencia alta sin ser “el mismo string crudo”. No escribas aún: predice `exact` y `token_jaccard` y compara con la salida. Si omites `casefold` o el solapamiento de tokens, pierdes matches triviales que la cola clerical nunca debió ver.",
        code: {
          language: 'python',
          title: "cmp_demo.py",
          code: `def exact(a, b):
    na = " ".join(a.casefold().split())
    nb = " ".join(b.casefold().split())
    return 1.0 if na == nb else 0.0

def jac(a, b):
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    return len(ta & tb) / len(ta | tb) if ta | tb else 1.0

e = exact("A@example.pe", "a@example.pe")
j = round(jac("Ana López", "López Ana"), 2)
print("exact", e)
print("token_jaccard", j)`,
          output: `exact 1.0
token_jaccard 1.0`,
        },
        why:
          "`exact` iguala tras colapsar espacios y `casefold`; Jaccard captura orden libre de tokens. Ambos devuelven score en [0,1] listo para el scorer didáctico, no un veredicto final de identidad. Sin normalización pierdes matches triviales de email y saturas la cola. En We Do arreglarás comparación cruda, el denominador de Jaccard y la tolerancia de fechas.",
        retrospective:
          "Si puedes explicar por qué `\"A@example.pe\"` y `\"a@example.pe\"` son match exacto *después* de normalizar, ya tienes el hábito de pre-comparación. El error clásico es comparar strings crudos y culpar al umbral. En We Do practicarás exact, tokens y fechas con defectos deliberados.",
      },
      {
        demoId: "S30-T1-B-DEMO",
        subtopicId: "S30-T1-B",
        environment: "local-python",
        description: "Clasifica missing vs. agree y baja el peso de acuerdo cuando el valor es frecuente (“María” vs. “Zoe”).",
        preamble:
          "Cuando una fuente del Caso 30 no trae un campo, el motor no debe gritar “desacuerdo”. En esta demo clasificas vacío como `missing`, acuerdo casefold como `agree`, y bajas el peso de un nombre frecuente («María») frente a uno raro («Zoe»). No escribas: predice la línea de salida y por qué 0.025 no es “peor match moral”, solo menos evidencia de identidad.",
        code: {
          language: 'python',
          title: "miss_demo.py",
          code: `def cmp(a, b):
    if not a or not b:
        return "missing"
    return "agree" if a.casefold() == b.casefold() else "disagree"

freq = {"maría": 40, "zoe": 1}
w = lambda v: 1 / freq.get(v.casefold(), 1)
print(cmp("", "x"), cmp("Ana", "ana"), round(w("María"), 3), round(w("Zoe"), 3))`,
          output: `missing agree 0.025 1.0`,
        },
        why:
          "Missing es estado de comparación: penalizarlo como disagree infla non-matches cuando la fuente nunca publica el campo. `base/frecuencia` es heurística didáctica, no m/u completo de Fellegi–Sunter. Valores comunes aportan menos evidencia de identidad. En We Do corregirás la rama del vacío, la fórmula de peso y el missing informativo por fuente.",
        retrospective:
          "Vacío → `missing`; valor común → menos peso de acuerdo. El error clásico es empujar missing a `non_match` y saturar la cola. Pregunta: si dos fuentes nunca publican phone, ¿un “agree” vacío sería evidencia de identidad? We Do: estados, rareza y cobertura por fuente.",
      },
      {
        demoId: "S30-T2-A-DEMO",
        subtopicId: "S30-T2-A",
        environment: "local-python",
        description: "Blocking por apellido|ciudad: construye candidatos desde buckets y mide candidate recall contra gold sintético.",
        preamble:
          "All-pairs es inviable: el blocking reduce candidatos a pares que comparten clave. En esta demo tres registros sintéticos caen en buckets por apellido|ciudad; el gold match (r1,r2) debe aparecer en candidatos y el recall se *calcula*, no se inventa. No escribas: predice `recall` y `ncand` y verifica por qué r3 no contamina el numerador.",
        code: {
          language: 'python',
          title: "block_demo.py",
          code: `from collections import defaultdict

def block_key(last, city):
    return f"{last}|{city}"

recs = [("r1", "lopez", "lima"), ("r2", "lopez", "lima"), ("r3", "perez", "cusco")]
buckets = defaultdict(list)
for rid, last, city in recs:
    buckets[block_key(last, city)].append(rid)
gold = {frozenset(("r1", "r2"))}
candidates = set()
for ids in buckets.values():
    for i in range(len(ids)):
        for j in range(i + 1, len(ids)):
            candidates.add(frozenset((ids[i], ids[j])))
recall = len(gold & candidates) / len(gold)
print("recall", recall)
print("ncand", len(candidates))`,
          output: `recall 1.0
ncand 1`,
        },
        why:
          "Candidate recall = |gold ∩ candidates| / |gold|; si es bajo, ningún umbral posterior recupera el match. Aquí las claves ya están plegadas y el recall es 1.0; en theory el mismo gold con tildes sin fold cae a 0.0. El 1.0 se deriva de la intersección, no se imprime a mano. En We Do: fold de tildes, intersección vs. unión, y pares por bloque.",
        retrospective:
          "Blocking sin recall medido es fe en ciego. El error clásico es “optimizar CPU” sin gold sintético. Pregunta: si r3 cayera en el mismo bucket, ¿subiría el numerador del recall o solo `ncand`? We Do: clave estable, intersección honesta y pares por bloque.",
      },
      {
        demoId: "S30-T2-B-DEMO",
        subtopicId: "S30-T2-B",
        environment: "local-python",
        description: "Costo de pares en bloques [5, 20] y filtro impossible person vs. org antes del scorer.",
        preamble:
          "Candidate recall alto no basta si un bloque explota. En esta demo calculas el costo de pares en bloques de tamaño 5 y 20, y marcas person vs. org como par imposible *antes* del scorer. No escribas: predice `cost` e `impossible` y recuerda la política `filter_before_score` del Caso 30.",
        code: {
          language: 'python',
          title: "cost_demo.py",
          code: `def pair_cost(sizes):
    return sum(n * (n - 1) // 2 for n in sizes)

def impossible(a, b):
    return a.get("type") != b.get("type")

print("cost", pair_cost([5, 20]))
print("impossible", impossible({"type": "person"}, {"type": "org"}))`,
          output: `cost 200
impossible True`,
        },
        why:
          "C(5,2)+C(20,2)=10+190=200. Tipos distintos saltan similitudes caras; el filtro va *antes* del scorer, no como post-maquillaje de métricas. En We Do practicarás costo, desigualdad de tipos y conteo de pares kept con la política nombrada.",
        retrospective:
          "Costo de pares y filtro de imposibles protegen CPU y calidad de la cola. El error clásico es scorear person–org y “limpiar” después. Pregunta: ¿por qué el filtro va *antes* del edit distance y no después? We Do: costo, impossible y política nombrada.",
      },
      {
        demoId: "S30-T3-A-DEMO",
        subtopicId: "S30-T3-A",
        environment: "local-python",
        description: "Score ponderado name/email y decide() con umbrales duales → auto_match.",
        preamble:
          "Con candidatos filtrados, el scorer didáctico del Caso 30 combina similitudes con pesos y decide con umbrales duales. En esta demo name=0.9 (w=0.6) y email=1.0 (w=0.4) deben dar 0.94 y `auto_match`. No escribas: predice el score y por qué un 0.875 con phone en 0.0 (theory) caería a `review` en vez de auto.",
        code: {
          language: 'python',
          title: "thresh_demo.py",
          code: `def weighted_score(sims, w):
    return sum(sims[k] * w[k] for k in w) / sum(w.values())

def decide(score, t_high=0.9, t_low=0.5):
    if score >= t_high:
        return "auto_match"
    if score <= t_low:
        return "non_match"
    return "review"

sims = {"name": 0.9, "email": 1.0}
w = {"name": 0.6, "email": 0.4}
s = weighted_score(sims, w)
print(round(s, 3), decide(s))`,
          output: `0.94 auto_match`,
        },
        why:
          "Score = suma(sim·w)/suma(w); ≥t_high → auto_match; ≤t_low → non_match; banda gris → review con explicación. 0.94 no es probabilidad calibrada ni FS completo; nunca `auto_fraud`. En We Do normalizarás el score, decidirás la banda gris y armarás el ítem clerical.",
        retrospective:
          "Umbrales duales protegen operaciones: lo dudoso va a humanos. El error clásico es un solo corte y auto-etiquetar de más. Pregunta: con score 0.5 exacto y t_low=0.5, ¿auto, review o non_match? We Do: normalización, `review` y explain por campo.",
      },
      {
        demoId: "S30-T3-B-DEMO",
        subtopicId: "S30-T3-B",
        environment: "local-python",
        description: "Union-Find: auto-matches e1–e2–e3 más una aprobación clerical e3–e4 cierran el cluster.",
        preamble:
          "Decidir un par no termina el trabajo: la fusión de entidades es transitiva. En esta demo auto-matches e1–e2–e3 más una aprobación clerical e3–e4 cierran el cluster. No escribas: predice si `find(e1)==find(e4)` y por qué un merge mal validado puede sobrefundir nodos que irán al grafo S31.",
        code: {
          language: 'python',
          title: "cluster_demo.py",
          code: `p = {}

def find(x):
    p.setdefault(x, x)
    if p[x] != x:
        p[x] = find(p[x])
    return p[x]

def union(a, b):
    p[find(b)] = find(a)

union("e1", "e2")
union("e2", "e3")
union("e3", "e4")  # aprobación clerical (match explícito)
print(find("e1") == find("e4"), "review_applied")`,
          output: `True review_applied`,
        },
        why:
          "Union-Find materializa A=B y B=C ⇒ A=C; la aprobación clerical es un `union` explícito con label_space match/non_match/uncertain (sin fraud). Valida el merge, no solo el `union`. En We Do practicarás transitividad, el contrato de cola y el filtro de labels ajenos.",
        retrospective:
          "La transitividad es el corazón de la fusión exportable a S31. El error clásico es unir un puente dudoso sin validar. Pregunta: si e3–e4 fuera `uncertain`, ¿deberías hacer `union`? We Do: cluster, contrato de cola y alcance ético de labels.",
      },
      {
        demoId: "S30-T4-A-DEMO",
        subtopicId: "S30-T4-A",
        environment: "local-python",
        description: "Split por entidad: train solo con {e1,e2,e3}; el par e4–e5 cae en test.",
        preamble:
          "Sin evaluación honesta el motor es teatro. En esta demo el train solo incluye entidades {e1,e2,e3}; el par e4–e5 cae en test. No escribas: predice los conteos y por qué un split aleatorio de *pares* con entidades compartidas infla el F1 del notebook y falla con contactos nuevos del Caso 30.",
        code: {
          language: 'python',
          title: "split_demo.py",
          code: `def entity_split(pairs, train_e):
    tr = [p for p in pairs if {p[0], p[1]} <= train_e]
    te = [p for p in pairs if not ({p[0], p[1]} <= train_e)]
    return len(tr), len(te)

pairs = [("e1", "e2", 1), ("e4", "e5", 1), ("e1", "e3", 0)]
train_e = {"e1", "e2", "e3"}
tr, te = entity_split(pairs, train_e)
print("train", tr, "test", te)`,
          output: `train 2 test 1`,
        },
        why:
          "Un par es train solo si ambos extremos ⊆ train_e; si no, no es train limpio (en demos simples se etiqueta test; en E3 se distingue `cross_split`). Leakage de identidad engaña al cierre CP-N3-A. En We Do: etiqueta train/test, prevalencia y pares mixtos.",
        retrospective:
          "Split por entidad es la guardia anti-leakage: la misma identidad no entrena y examina. El error clásico es partir *pares* al azar. Pregunta: el par e1–e4 (mixto), ¿es train limpio en esta demo simple? We Do: clasificación, base rate y `cross_split` explícito.",
      },
      {
        demoId: "S30-T4-B-DEMO",
        subtopicId: "S30-T4-B",
        environment: "local-python",
        description: "Precisión/recall pairwise, índices de error (semilla de slices), co-cluster completeness y co-cluster quality.",
        preamble:
          "Un F1 pairwise alto puede esconder clusters partidos o sobrefundidos. En esta demo calculas precisión/recall, índices de error (semilla de slices) y dos vistas de co-cluster sobre un cluster sintético partido. No escribas: predice por qué completeness es 0.5 y quality es 1.0, y qué reportarías en el README del cierre CP-N3-A.",
        code: {
          language: 'python',
          title: "metrics_demo.py",
          code: `def pr_metrics(yt, yp):
    tp = sum(t == 1 and p == 1 for t, p in zip(yt, yp))
    fp = sum(t == 0 and p == 1 for t, p in zip(yt, yp))
    fn = sum(t == 1 and p == 0 for t, p in zip(yt, yp))
    prec = tp / (tp + fp) if tp + fp else 0.0
    rec = tp / (tp + fn) if tp + fn else 0.0
    errors = [i for i, (t, p) in enumerate(zip(yt, yp)) if t != p]
    return round(prec, 2), round(rec, 2), errors

def pair_completeness(gold_pairs, same_cluster):
    if not gold_pairs:
        return 0.0
    return sum(1 for a, b in gold_pairs if same_cluster(a, b)) / len(gold_pairs)

def pair_quality(pred_pairs, gold_set, same_cluster):
    if not pred_pairs:
        return 0.0
    return sum(
        1
        for a, b in pred_pairs
        if same_cluster(a, b) and frozenset((a, b)) in gold_set
    ) / len(pred_pairs)

p, r, err = pr_metrics([1, 1, 0, 0], [1, 0, 0, 0])
# cluster partido: e1-e2 juntos; gold también quiere e1-e3
clusters = {"e1": "c0", "e2": "c0", "e3": "c1"}
same = lambda a, b: clusters[a] == clusters[b]
gold = [("e1", "e2"), ("e1", "e3")]
gold_set = {frozenset(x) for x in gold}
pc = pair_completeness(gold, same)
pq = pair_quality([("e1", "e2")], gold_set, same)
print(p, r, err)
print("pair_completeness", pc)
print("pair_quality", pq)`,
          output: `1.0 0.5 [1]
pair_completeness 0.5
pair_quality 1.0`,
        },
        why:
          "Precisión castiga FP de auto_match; recall castiga matches perdidos. Co-cluster completeness ≈ recall de uniones; co-cluster quality ≈ precisión de uniones. Los índices de error alimentan slices (`missing_phone`, …), no acusaciones de fraude. En We Do derivarás P y R y priorizarás slices de error.",
        retrospective:
          "Reporta pairwise + ambas vistas de co-cluster: un solo F1 de notebook esconde clusters partidos. El error clásico es celebrar precisión 1.0 con recall 0.5 sin slices. Pregunta: quality 1.0 con completeness 0.5, ¿qué tipo de error de fusión describe? We Do: derivar P y R y priorizar slices.",
      },
    ],
  },
  weDo: {
    intro: "Practicamos las mismas habilidades de las demos I Do, con soporte decreciente (guiada → independiente → transferencia). Cada starter tiene un error deliberado; corrígelo hasta que la salida coincida con la esperada. Solo datos sintéticos de `CASO-LIM-030`; no etiquetes fraude ni parentesco.",
    steps: [
      {
        id: "S30-T1-A-E1",
        subtopicId: "S30-T1-A",
        kind: "guided",
        title: "Exact post-normalización con casefold",
        preamble:
          "- **Contexto:** en el motor ER del Caso 30, dos nombres sintéticos con espacios y distinta capitalización deben contar como acuerdo exacto.\n- **Meta:** normalizar con `casefold` y colapso de espacios antes de comparar.\n- **Éxito:** una sola línea `1.0` con `a = '  Ana  '` y `b = 'ana'`.\n- **Límites:** no compares crudo; no imprimas etiquetas extra; solo datos sintéticos.",
        instruction:
          "1. Abre el starter: `print(1.0 if a == b else 0.0)` (bug: comparación cruda).\n2. Normaliza cada lado: `\" \".join(s.casefold().split())`.\n3. Imprime `1.0` si coinciden, `0.0` si no.",
        hint: "normalize = ' '.join(s.casefold().split())",
        hints: [
          "No compares a y b crudos: hay espacios y mayúsculas",
          "Tras normalizar, ambos deben ser 'ana'",
        ],
        edgeCases: ["doble espacio interno", "emails con distinta capitalización"],
        tests: "salida coincide con solution output",
        feedback:
          "Exact en ER es igualdad *después* de normalizar. Sin `casefold` y sin colapsar espacios pierdes matches obvios y saturas la cola de review con “casi iguales” que el scorer debió resolver barato.",
        retrospective:
          "Normalizar antes de igualar es el primer ladrillo del motor. El error clásico es culpar al umbral cuando el bug estaba en el string crudo. Siguiente (E2): Jaccard con unión, no con un solo conjunto.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · exact post-normalización
# Error: compara crudo (espacios y mayúsculas)
a, b = "  Ana  ", "ana"
print(1.0 if a == b else 0.0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a, b = "  Ana  ", "ana"
na = " ".join(a.casefold().split())
nb = " ".join(b.casefold().split())
print(1.0 if na == nb else 0.0)`,
          output: `1.0`,
        },
      },
      {
        id: "S30-T1-A-E2",
        subtopicId: "S30-T1-A",
        kind: "independent",
        title: "Jaccard de tokens con unión",
        preamble:
          "- **Contexto:** el comparador de tokens del Caso 30 debe tratar «a b» y «b c» con solapamiento parcial, no como overlap sesgado.\n- **Meta:** calcular Jaccard = |intersección| / |unión| de conjuntos de tokens.\n- **Éxito:** una línea numérica ≈ `0.333…` (división exacta de Python).\n- **Límites:** no dividas solo por `|ta|`; el orden de tokens no debe importar; no mutes los sets.",
        instruction:
          "1. Revisa el starter: `len(ta & tb) / len(ta)` (bug).\n2. Cambia el denominador a `len(ta | tb)`.\n3. Imprime solo el cociente.\n4. No redondees a menos que la solución lo haga (aquí no).",
        hint: "Unión = ta | tb",
        hints: [
          "len(ta & tb) / len(ta | tb)",
          "No uses solo el tamaño de ta",
        ],
        edgeCases: ["orden de tokens no debe importar"],
        tests: "salida coincide con solution output",
        feedback:
          "Jaccard usa la unión; dividir solo por un conjunto infla o sesga el score de nombre y miente al umbral `auto_match` del scorer didáctico.",
        retrospective:
          "El denominador de Jaccard es la unión: así el score de nombre es comparable entre pares del scorer. Dividir por un solo set no “falla el test de tipos”; falla la calibración del umbral. Pregunta: con `ta={a,b}` y `tb={b,c}`, ¿por qué 1/3 y no 1/2? Luego (E3): tolerancia de fechas, no tokens.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · Jaccard tokens
# Error: divide por |ta| en vez de |unión|
ta, tb = set("a b".split()), set("b c".split())
print(len(ta & tb) / len(ta))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ta, tb = set("a b".split()), set("b c".split())
print(len(ta & tb) / len(ta | tb))`,
          output: `0.3333333333333333`,
        },
      },
      {
        id: "S30-T1-A-E3",
        subtopicId: "S30-T1-A",
        kind: "transfer",
        title: "date_sim con tolerancia de 3 días",
        preamble:
          "- **Contexto:** en contactos sintéticos del Caso 30, dos fechas de alta separadas por 2 días no deben castigarse como desacuerdo total.\n- **Meta:** implementar `date_sim` con banda: 0 días → 1.0; 1..`tol_days` → 0.5; resto → 0.0.\n- **Éxito:** imprime `0.5` para 2026-01-01 y 2026-01-03 con `tol_days=3`.\n- **Límites:** no devuelvas 0.0 en la banda de tolerancia; no uses PII real; tolerancia didáctica del lab.",
        instruction:
          "1. Lee el starter: tras `delta == 0` siempre retorna `0.0`.\n2. Añade `if delta <= tol_days: return 0.5`.\n3. Deja el `else` en `0.0`.\n4. Imprime solo el resultado de la llamada dada.",
        hint: "abs(delta.days) <= 3 → 0.5",
        hints: [
          "delta = abs((d1 - d2).days)",
          "0 → 1.0; 1..3 → 0.5; else → 0.0",
        ],
        edgeCases: ["mismo día = 1.0", "4 días = 0.0"],
        tests: "salida coincide con solution output",
        feedback:
          "Fechas cercanas no son desacuerdo total; la banda de tolerancia evita non_match espurios que empujan pares buenos a la cola clerical.",
        retrospective:
          "La tolerancia de fechas evita non_match espurios por desfases leves. El error clásico es igualdad binaria de fechas. Pregunta: ¿por qué 0.5 y no 1.0 dentro de la banda? (evidencia parcial, no acuerdo exacto.)",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · date_sim con tolerancia
# Error: solo considera igualdad exacta
from datetime import date

def date_sim(d1, d2, tol_days=3):
    delta = abs((d1 - d2).days)
    if delta == 0:
        return 1.0
    return 0.0  # falta banda de tolerancia

print(date_sim(date(2026, 1, 1), date(2026, 1, 3)))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import date

def date_sim(d1, d2, tol_days=3):
    delta = abs((d1 - d2).days)
    if delta == 0:
        return 1.0
    if delta <= tol_days:
        return 0.5
    return 0.0

print(date_sim(date(2026, 1, 1), date(2026, 1, 3)))`,
          output: `0.5`,
        },
      },
      {
        id: "S30-T1-B-E1",
        subtopicId: "S30-T1-B",
        kind: "guided",
        title: "Vacío se etiqueta missing",
        preamble:
          "- **Contexto:** un par sintético del Caso 30 llega con un lado vacío (`a=''`, `b='x'`); el motor debe registrar ausencia, no inventar acuerdo.\n- **Meta:** imprimir `missing` si falta valor; si no, `agree`/`disagree` por casefold.\n- **Éxito:** una sola línea `missing`.\n- **Límites:** no trates vacío como `agree` ni como `disagree`; no inventes valor relleno.",
        instruction:
          "1. Abre el starter: la rama `not a or not b` imprime `\"agree\"` (bug).\n2. Cámbiala a `\"missing\"`.\n3. Deja el `else` con agree/disagree casefold.\n4. Imprime una sola etiqueta.",
        hint: "not a or not b → missing; si no, agree/disagree",
        hints: [
          "Vacío se detecta con not a / not b",
          "No trates missing como agree ni disagree",
        ],
        edgeCases: ["None en el motor real se trata como vacío"],
        tests: "salida coincide con solution output",
        feedback:
          "Missing es un estado de comparación, no un acuerdo disfrazado. Confundirlo con `agree` infla scores; con `disagree`, satura non-matches cuando la fuente no publica el campo.",
        retrospective:
          "Tres estados (`missing` / `agree` / `disagree`) evitan inventar evidencia cuando falta un lado. El error clásico del starter es maquillar vacío como acuerdo. Siguiente (E2): bajar el peso de valores frecuentes, no re-etiquetar el vacío.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · missing si vacío
# Error: etiquetas invertidas en la rama del vacío
a, b = "", "x"
if not a or not b:
    print("agree")  # debería ser missing
else:
    print("agree" if a.casefold() == b.casefold() else "disagree")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a, b = "", "x"
if not a or not b:
    print("missing")
else:
    print("agree" if a.casefold() == b.casefold() else "disagree")`,
          output: `missing`,
        },
      },
      {
        id: "S30-T1-B-E2",
        subtopicId: "S30-T1-B",
        kind: "independent",
        title: "Peso de acuerdo por rareza",
        preamble:
          "- **Contexto:** en contactos Lima sintéticos, un acuerdo en «María» aporta menos evidencia de identidad que en «Ximena».\n- **Meta:** implementar `frequency_weight = base / frecuencia` con casefold.\n- **Éxito:** una línea `0.02 0.5` (María y Ximena, redondeados a 3 decimales).\n- **Límites:** divide, no multipliques; es heurística didáctica, no estimación m/u de producción.",
        instruction:
          "1. Revisa el starter: `return base * f` (bug).\n2. Cámbialo a `base / f`.\n3. Imprime ambos pesos redondeados a 3 decimales en una línea.\n4. Busca en la tabla con `value.casefold()`.",
        hint: "base / freq_table.get(value.casefold(), 1)",
        hints: [
          "Más frecuente → menos peso de acuerdo",
          "casefold del valor antes de buscar en la tabla",
        ],
        edgeCases: ["suavizado Laplace en prod", "valor ausente → freq=1"],
        tests: "salida coincide con solution output",
        feedback:
          "Acuerdos en valores comunes aportan menos evidencia de identidad. Multiplicar por frecuencia invierte la intuición y engaña al scorer didáctico del Caso 30.",
        retrospective:
          "Más frecuente → menos peso de acuerdo. Multiplicar por frecuencia invierte la intuición y engaña al scorer. Luego (E3): decide si el missing de phone es informativo por fuente.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · peso base/frecuencia
# Error: multiplica base*f en vez de base/f
freq_table = {"maría": 50, "ximena": 2}
base = 1.0

def frequency_weight(value, freq_table, base=1.0):
    f = freq_table.get(value.casefold(), 1)
    return base * f  # debería ser base / f

print(round(frequency_weight("María", freq_table, base), 3),
      round(frequency_weight("Ximena", freq_table, base), 3))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `freq_table = {"maría": 50, "ximena": 2}
base = 1.0

def frequency_weight(value, freq_table, base=1.0):
    f = freq_table.get(value.casefold(), 1)
    return base / f

print(round(frequency_weight("María", freq_table, base), 3),
      round(frequency_weight("Ximena", freq_table, base), 3))`,
          output: `0.02 0.5`,
        },
      },
      {
        id: "S30-T1-B-E3",
        subtopicId: "S30-T1-B",
        kind: "transfer",
        title: "Missing informativo por fuente",
        preamble:
          "- **Contexto:** la fuente `crm_legacy` del Caso 30 nunca publica teléfono (cobertura 0.0); no es “azar”, es diseño del sistema.\n- **Meta:** etiquetar `informative_missing` si `phone_coverage == 0.0`; si no, `mcar_candidate`.\n- **Éxito:** una línea `informative_missing` para `source = \"crm_legacy\"`.\n- **Límites:** mira la tabla de cobertura; no rellenes phone como agree; no uses PII real.",
        instruction:
          "1. Lee el starter: siempre imprime `\"mcar_candidate\"`.\n2. Consulta `coverage[source][\"phone\"]`.\n3. Si es `0.0` → `informative_missing`; si no → `mcar_candidate`.\n4. Imprime solo la etiqueta.",
        hint: "coverage['crm_legacy']['phone'] == 0.0",
        hints: [
          "Missing informativo depende de la fuente",
          "No asumas MCAR sin mirar cobertura",
        ],
        edgeCases: ["otra fuente con phone_coverage > 0"],
        tests: "salida coincide con solution output",
        feedback:
          "Missing informativo se modela por fuente; asumir MCAR sin mirar cobertura es un error de diseño, no un detalle de relleno.",
        retrospective:
          "La cobertura por `source_system` convierte un vacío en señal de diseño, no en azar. Asumir MCAR sin tabla es un bug de modelo, no de relleno. Pregunta: con `web_form` phone=0.8, ¿qué etiqueta imprime y por qué no rellenas phone? En el You Do documentarás patrones de ausencia en el README.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · missing informativo por fuente
# Error: siempre asume MCAR
coverage = {
    "crm_legacy": {"phone": 0.0, "email": 0.95},
    "web_form": {"phone": 0.8, "email": 1.0},
}
source = "crm_legacy"
# debería mirar coverage[source]["phone"]
print("mcar_candidate")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `coverage = {
    "crm_legacy": {"phone": 0.0, "email": 0.95},
    "web_form": {"phone": 0.8, "email": 1.0},
}
source = "crm_legacy"
print(
    "informative_missing"
    if coverage[source]["phone"] == 0.0
    else "mcar_candidate"
)`,
          output: `informative_missing`,
        },
      },
      {
        id: "S30-T2-A-E1",
        subtopicId: "S30-T2-A",
        kind: "guided",
        title: "Clave de blocking con fold de acentos",
        preamble:
          "- **Contexto:** en contactos Lima sintéticos, «López» y «Lopez» deben compartir bloque; sin plegar tildes el gold match se parte en dos buckets.\n- **Meta:** construir `fold(last)|fold(city)[:3]` con casefold + reemplazo de tildes.\n- **Éxito:** una línea `lopez|lim`.\n- **Límites:** no dejes `lópez|lim`; prefijo de ciudad de 3 caracteres ya plegados; solo datos sintéticos.",
        instruction:
          "1. Abre el starter: `fold` solo hace `casefold` (bug).\n2. Añade replace de á→a, é→e, í→i, ó→o, ú→u.\n3. Imprime `f\"{fold(last)}|{fold(city)[:3]}\"`.\n4. No alteres el formato del pipe.",
        hint: "casefold + replace de tildes; luego f'{fold(last)}|{fold(city)[:3]}'",
        hints: [
          "El pipe separa componentes de la clave",
          "Sin plegar acentos, López y Lopez no comparten bloque",
          "Prefijo de ciudad: tres caracteres ya plegados",
        ],
        edgeCases: ["Ñ→n en un fold más completo del portfolio", "doble espacio en el nombre"],
        tests: "salida coincide con solution output",
        feedback:
          "La clave de blocking debe ser estable tras casefold + fold de acentos. Si no, el candidate recall del gold se derrumba a 0 aunque el scorer sea perfecto.",
        retrospective:
          "Clave inestable = candidate recall 0.0 aunque el scorer sea perfecto. El error clásico es normalizar “a medias”. Siguiente (E2): medir recall con intersección, no con unión.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · block key con fold de acentos
# Error: casefold sin plegar tildes → clave inestable
last, city = "López", "Lima"

def fold(s):
    return s.casefold()  # falta pliegue á→a, é→e, …

print(f"{fold(last)}|{fold(city)[:3]}")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `last, city = "López", "Lima"

def fold(s):
    s = s.casefold()
    for a, b in (("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u")):
        s = s.replace(a, b)
    return s

print(f"{fold(last)}|{fold(city)[:3]}")`,
          output: `lopez|lim`,
        },
      },
      {
        id: "S30-T2-A-E2",
        subtopicId: "S30-T2-A",
        kind: "independent",
        title: "Candidate recall con intersección",
        preamble:
          "- **Contexto:** el batch nocturno del Caso 30 mide cuántos gold matches sobrevivieron al blocking.\n- **Meta:** imprimir `|gold ∩ candidates| / |gold|`.\n- **Éxito:** el float `0.5` con el fixture dado (1 de 2 gold en candidatos).\n- **Límites:** intersección en el numerador; denominador = |gold|; no uses unión.",
        instruction:
          "1. Revisa el starter: `len(gold | candidates) / len(gold)` (bug).\n2. Cambia a `gold & candidates`.\n3. Imprime el cociente.\n4. No inventes el 0.5 a mano: derívalo de los sets.",
        hint: "len(gold & candidates) / len(gold)",
        hints: [
          "Intersección: solo gold matches que también son candidatos.",
          "Denominador = tamaño de gold, no de candidates",
        ],
        edgeCases: ["unión OR de reglas sube el tamaño de candidates"],
        tests: "salida coincide con solution output",
        feedback:
          "Candidate recall bajo significa matches invisibles para el scorer: ningún umbral posterior los recupera. Unión en el numerador infla el número y esconde el fallo del blocking.",
        retrospective:
          "Unión en el numerador infla el recall y esconde matches perdidos. Candidate recall bajo = matches que el scorer nunca ve. Luego (E3): cuenta pares candidatos por tamaño de bloque.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · candidate recall sobre conjuntos
# Error: usa unión en vez de intersección
gold = {frozenset(("r1", "r2")), frozenset(("r3", "r4"))}
candidates = {frozenset(("r1", "r2")), frozenset(("r5", "r6"))}
print(len(gold | candidates) / len(gold))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `gold = {frozenset(("r1", "r2")), frozenset(("r3", "r4"))}
candidates = {frozenset(("r1", "r2")), frozenset(("r5", "r6"))}
print(len(gold & candidates) / len(gold))`,
          output: `0.5`,
        },
      },
      {
        id: "S30-T2-A-E3",
        subtopicId: "S30-T2-A",
        kind: "transfer",
        title: "Pares candidatos multi-bloque",
        preamble:
          "- **Contexto:** tras el blocking del Caso 30, el total de pares candidatos es la suma de combinaciones por bloque, no la suma de tamaños.\n- **Meta:** calcular `sum(n*(n-1)//2 for n in sizes)` con `sizes=[2,4,3]`.\n- **Éxito:** el entero `10` (1+6+3).\n- **Límites:** no uses `sum(sizes)`; no cuentes pares entre bloques distintos; bloque 0/1 → 0 pares.",
        instruction:
          "1. Lee el starter: `print(sum(sizes))` → 9 (bug).\n2. Reemplaza por la suma de `n*(n-1)//2`.\n3. Imprime solo el entero.\n4. Verifica: 2→1, 4→6, 3→3.",
        hint: "sum(n * (n - 1) // 2 for n in sizes)",
        hints: [
          "Cada bloque aporta C(n,2)=n*(n-1)//2, no n",
          "No cuentes el par (i,i) ni pares entre bloques distintos",
          "Con sizes=[2,4,3] → 1 + 6 + 3 = 10",
        ],
        edgeCases: ["bloque de tamaño 0 o 1 → 0 pares", "un bloque monstruoso domina el costo"],
        tests: "salida coincide con solution output",
        feedback:
          "C(n,2) por bloque es el tamaño del espacio que llega al scorer antes de filtros. Confundir tamaño de bloque con pares subestima cuántos candidatos verá el motor.",
        retrospective:
          "El scorer solo ve pares *dentro* de bloque: sumar tamaños subestima ese espacio. Pregunta: un bloque de tamaño 1, ¿cuántos pares aporta y por qué? En T2-B el mismo C(n,2) se lee como SLO de CPU y se combina con `filter_before_score`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · pares candidatos multi-bloque
# Error: suma tamaños en vez de C(n,2) por bloque
sizes = [2, 4, 3]
print(sum(sizes))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `sizes = [2, 4, 3]
print(sum(n * (n - 1) // 2 for n in sizes))`,
          output: `10`,
        },
      },
      {
        id: "S30-T2-B-E1",
        subtopicId: "S30-T2-B",
        kind: "guided",
        title: "Costo de pares por bloque",
        preamble:
          "- **Contexto:** el SLO del batch del Caso 30 vigila cuántos pares se enviarían al scorer si no filtras.\n- **Meta:** sumar C(n,2) por bloque con `sizes=[3,5]`.\n- **Éxito:** el entero `13` (3+10).\n- **Límites:** no sumes solo tamaños; monitorea también `max(block size)` en el motor real.",
        instruction:
          "1. Abre el starter: `print(sum(sizes))` → 8 (bug).\n2. Usa `sum(n*(n-1)//2 for n in sizes)`.\n3. Imprime solo el costo.\n4. No inventes 13 a mano: derívalo.",
        hint: "sum(n*(n-1)//2 for n in sizes)",
        hints: [
          "Cada bloque aporta n choose 2",
          "No sumes solo los tamaños",
        ],
        edgeCases: ["monitor max(block size)"],
        tests: "salida coincide con solution output",
        feedback:
          "El costo global es la suma de costos por bloque, no la suma de tamaños. Ese número alimenta el SLO de CPU del batch nocturno del Caso 30.",
        retrospective:
          "El SLO del batch mira pares que llegarían al scorer, no registros en el bloque. Confundir `sum(sizes)` con costo es un error de capacidad, no de matching. Siguiente (E2): marcar person≠org como impossible *antes* de gastar similitud.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · costo multi-bloque
# Error: suma tamaños en vez de pares
sizes = [3, 5]
print(sum(sizes))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `sizes = [3, 5]
print(sum(n * (n - 1) // 2 for n in sizes))`,
          output: `13`,
        },
      },
      {
        id: "S30-T2-B-E2",
        subtopicId: "S30-T2-B",
        kind: "independent",
        title: "Filtro person vs. org",
        preamble:
          "- **Contexto:** en el fixture del Caso 30, person y org no se fusionan; gastar edit distance en ese par es basura.\n- **Meta:** imprimir `True` (saltar scorer) cuando los tipos difieren.\n- **Éxito:** una línea `True` con `ta=\"person\"`, `tb=\"org\"`.\n- **Límites:** `True` = impossible; no inviertas a igualdad; no etiquetes fraude.",
        instruction:
          "1. Revisa el starter: `print(ta == tb)` (bug).\n2. Cambia a `ta != tb`.\n3. Imprime solo el booleano.\n4. Interpreta True como “no gastes similitud”.",
        hint: "ta != tb",
        hints: [
          "Impossible = tipos distintos",
          "True significa 'saltar el scorer'",
        ],
        edgeCases: ["fechas incompatibles en el motor real"],
        tests: "salida coincide con solution output",
        feedback:
          "Impossible ahorra CPU y evita scores basura en la cola clerical. Comparar person–org “por si acaso” contamina el ranking del revisor.",
        retrospective:
          "`True` aquí no es “son la misma entidad”: es “no gastes scorer”. El error clásico es comparar todo y filtrar en la UI. Pregunta: si ambos fueran `person`, ¿qué imprime y qué haría el pipeline? Luego (E3): cuenta kept y nombra la política.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · filtro person/org
# Error: imprime igualdad en vez de desigualdad
ta, tb = "person", "org"
print(ta == tb)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ta, tb = "person", "org"
print(ta != tb)`,
          output: `True`,
        },
      },
      {
        id: "S30-T2-B-E3",
        subtopicId: "S30-T2-B",
        kind: "transfer",
        title: "filter_before_score en el pipeline",
        preamble:
          "- **Contexto:** el pipeline sano del Caso 30 es blocking → filtro de imposibles → scorer → umbrales.\n- **Meta:** contar pares same-type y declarar la política `filter_before_score`.\n- **Éxito:** dos líneas: `2` y `filter_before_score`.\n- **Límites:** person–org no entra; no imprimas `score_first`; no etiquetes fraude.",
        instruction:
          "1. Lee el starter: `kept = len(pairs)` y `\"score_first\"`.\n2. Filtra con `a[\"type\"] == b[\"type\"]`.\n3. Imprime `kept` y luego `filter_before_score`.\n4. No scores aún: aquí solo cuentas kept.",
        hint: "kept si a['type']==b['type']",
        hints: [
          "Primero filtra, después score (aquí solo cuentas kept)",
          "Dos líneas: entero y política",
        ],
        edgeCases: ["person-org no entra al scorer"],
        tests: "salida coincide con solution output",
        feedback:
          "Filter-before-score es una política de pipeline, no un eslogan: se mide en pares kept. Invertir el orden paga similitudes caras inútilmente.",
        retrospective:
          "La política se mide en pares kept, no en un eslogan del README. Invertir el orden paga similitudes caras inútilmente. En T3 puntuarás solo candidatos viables.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · filter before score
# Error: cuenta todos los pares sin filtrar tipo
pairs = [
    ({"type": "person", "s": 1.0}, {"type": "org", "s": 1.0}),
    ({"type": "person", "s": 0.2}, {"type": "person", "s": 0.2}),
    ({"type": "org", "s": 0.9}, {"type": "org", "s": 0.8}),
]
kept = len(pairs)  # debería filtrar same-type
print(kept)
print("score_first")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pairs = [
    ({"type": "person", "s": 1.0}, {"type": "org", "s": 1.0}),
    ({"type": "person", "s": 0.2}, {"type": "person", "s": 0.2}),
    ({"type": "org", "s": 0.9}, {"type": "org", "s": 0.8}),
]
kept = sum(1 for a, b in pairs if a["type"] == b["type"])
print(kept)
print("filter_before_score")`,
          output: `2
filter_before_score`,
        },
      },
      {
        id: "S30-T3-A-E1",
        subtopicId: "S30-T3-A",
        kind: "guided",
        title: "Score ponderado normalizado",
        preamble:
          "- **Contexto:** el scorer didáctico del Caso 30 normaliza por la suma de pesos para que `t_high` sea comparable entre pares.\n- **Meta:** calcular `(sim·w)` sumado y dividir por `sum(w)` con pesos 1.0 y 1.0 (no suman a un promedio oculto).\n- **Éxito:** una línea `0.75` (numerador 1.5 / denominador 2.0).\n- **Límites:** no dejes solo la suma numerador; no vendas el score como probabilidad calibrada.",
        instruction:
          "1. Abre el starter: imprime solo `1*1.0 + 0.5*1.0` → 1.5 (falta dividir).\n2. Divide por `(1.0 + 1.0)`.\n3. Imprime el cociente (`0.75`).\n4. Comprueba que sin dividir la salida no es 0.75.",
        hint: "num / sum(weights)",
        hints: [
          "(1*1.0 + 0.5*1.0) / (1.0+1.0)",
          "Normaliza por la suma de pesos",
        ],
        edgeCases: ["pesos no tienen que sumar 1 si normalizas"],
        tests: "salida coincide con solution output",
        feedback:
          "Sin normalizar, el umbral t_high pierde significado cuando los pesos no suman 1. El número “se ve bien” en un par y miente en el siguiente.",
        retrospective:
          "Sin normalizar, el umbral pierde significado cuando los pesos no suman 1. El error clásico es “el número se ve bien en un par y miente en el siguiente”. Siguiente (E2): banda gris → `review`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · score ponderado
# Error: no divide por sum(w) — con w=1.0+1.0 el bug es visible (1.5 vs. 0.75)
print(1 * 1.0 + 0.5 * 1.0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print((1 * 1.0 + 0.5 * 1.0) / (1.0 + 1.0))`,
          output: `0.75`,
        },
      },
      {
        id: "S30-T3-A-E2",
        subtopicId: "S30-T3-A",
        kind: "independent",
        title: "Umbrales duales y banda review",
        preamble:
          "- **Contexto:** un score 0.7 del Caso 30 no debe auto-fusionar entidades: la operación prefiere humanos en la banda gris.\n- **Meta:** decidir con t_high=0.9 y t_low=0.5.\n- **Éxito:** una línea `review`.\n- **Límites:** no fuerces `auto_match`; no inventes label `fraud`; ≥t_high / ≤t_low / else.",
        instruction:
          "1. Revisa el starter: siempre imprime `\"auto_match\"`.\n2. Implementa la triple rama (o ternario anidado).\n3. Imprime solo la decisión.\n4. Con s=0.7 debe ser `review`.",
        hint: "banda gris entre t_low y t_high",
        hints: [
          "s >= t_high → auto_match",
          "s <= t_low → non_match",
          "else → review",
        ],
        edgeCases: ["calibrar umbrales con gold de T4"],
        tests: "salida coincide con solution output",
        feedback:
          "La banda gris es diseño, no limbo: protege operaciones con evidencia y humanos. Un solo umbral o auto siempre empuja fusiones dudosas al grafo S31.",
        retrospective:
          "Tres bandas (auto / review / non) son un contrato operativo, no un umbral único disfrazado. Forzar auto con 0.7 es el error del starter y de muchos notebooks. Pregunta: con s=0.5 y t_low=0.5, ¿qué imprime y por qué el `<=` importa? Luego (E3): arma el ítem con score, decisión y explain.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · decide auto/review/non
# Error: siempre auto_match
s, t_high, t_low = 0.7, 0.9, 0.5
print("auto_match")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s, t_high, t_low = 0.7, 0.9, 0.5
print(
    "auto_match"
    if s >= t_high
    else ("non_match" if s <= t_low else "review")
)`,
          output: `review`,
        },
      },
      {
        id: "S30-T3-A-E3",
        subtopicId: "S30-T3-A",
        kind: "transfer",
        title: "Ítem clerical con explain por campo",
        preamble:
          "- **Contexto:** el revisor del Caso 30 no puede actuar sobre un 0.91 opaco: necesita score, decisión y aportes por campo.\n- **Meta:** construir dict con `score` (redondeado a 3), `decision` y `explain` (copia de sims).\n- **Éxito:** `{'score': 0.875, 'decision': 'review', 'explain': {'name': 0.95, 'email': 1.0, 'phone': 0.0}}`.\n- **Límites:** normaliza el score; no omitas email/phone en explain; no `auto_match` ciego.",
        instruction:
          "1. Lee el starter: score sin `/sum(w)`, decision forzada, explain incompleto.\n2. Normaliza score; decide con 0.9/0.5.\n3. `explain = dict(sims)` completo.\n4. Imprime el dict con `round(score, 3)`.",
        hint: "score = sum(sim*w)/sum(w); explain = dict(sims)",
        hints: [
          "Incluye name y email en explain",
          "0.875 cae en review (banda gris)",
          "round(score, 3) en el dict",
        ],
        edgeCases: ["UI clerical lee explain campo a campo"],
        tests: "salida coincide con solution output",
        feedback:
          "Sin explicación por campo y decisión explícita, la cola clerical no es accionable. Un score solo con auto_match optimista no pasa la auditoría del Caso 30. Nota: con pesos que suman 1 el numerador ya da 0.875 — divide igual: el día que cambies pesos el número miente sin normalizar.",
        retrospective:
          "El revisor actúa sobre score + decisión + vector de aportes; omitir un campo en `explain` es un bug de producto. El error clásico es auto_match optimista sin phone. En T3-B unirás decisiones aprobadas en clusters con Union-Find.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · ítem clerical con explain
# Error: omite email y no normaliza score
sims = {"name": 0.95, "email": 1.0, "phone": 0.0}
weights = {"name": 0.5, "email": 0.4, "phone": 0.1}
score = sum(sims[k] * weights[k] for k in weights)  # falta / sum(weights)
print({"score": score, "decision": "auto_match", "explain": {"name": sims["name"]}})
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `sims = {"name": 0.95, "email": 1.0, "phone": 0.0}
weights = {"name": 0.5, "email": 0.4, "phone": 0.1}
score = sum(sims[k] * weights[k] for k in weights) / sum(weights.values())
decision = "auto_match" if score >= 0.9 else ("non_match" if score <= 0.5 else "review")
print({"score": round(score, 3), "decision": decision, "explain": dict(sims)})`,
          output: `{'score': 0.875, 'decision': 'review', 'explain': {'name': 0.95, 'email': 1.0, 'phone': 0.0}}`,
        },
      },
      {
        id: "S30-T3-B-E1",
        subtopicId: "S30-T3-B",
        kind: "guided",
        title: "Union-Find con transitividad",
        preamble:
          "- **Contexto:** en el Caso 30, si e1=e2 y e2=e3, el export a S31 debe ver un solo cluster.\n- **Meta:** unir 1–2 y 2–3 e imprimir si `find(1)==find(3)`.\n- **Éxito:** una línea `True`.\n- **Límites:** no dejes 3 aislado; no uses labels de fraude; path compression opcional.",
        instruction:
          "1. Abre el starter: solo `union(1, 2)` (bug).\n2. Añade `union(2, 3)`.\n3. Imprime `find(1) == find(3)`.\n4. No reescribas find/union a menos que falles el test.",
        hint: "segunda union(2,3)",
        hints: [
          "find sigue el parent hasta la raíz",
          "union enlaza raíces",
        ],
        edgeCases: ["path compression opcional"],
        tests: "salida coincide con solution output",
        feedback:
          "La transitividad del cluster es el corazón de la fusión de entidades exportable a S31. Olvidar un `union` parte el cluster y castiga co-cluster completeness.",
        retrospective:
          "Un cluster partido exporta entidades duplicadas al grafo S31 aunque cada par “local” se vea bien. El error del starter es olvidar el segundo `union`. Pregunta: tras `union(1,2)` y `union(2,3)`, ¿`find(1)==find(3)` exige path compression? Siguiente (E2): contrato del ítem de cola sin `fraud`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · union-find
# Error: no une 2-3
p = {1: 1, 2: 2, 3: 3}

def find(x):
    while p[x] != x:
        x = p[x]
    return x

def union(a, b):
    p[find(b)] = find(a)

union(1, 2)
print(find(1) == find(3))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `p = {1: 1, 2: 2, 3: 3}

def find(x):
    while p[x] != x:
        x = p[x]
    return x

def union(a, b):
    p[find(b)] = find(a)

union(1, 2)
union(2, 3)
print(find(1) == find(3))`,
          output: `True`,
        },
      },
      {
        id: "S30-T3-B-E2",
        subtopicId: "S30-T3-B",
        kind: "independent",
        title: "Cola clerical sin label fraud",
        preamble:
          "- **Contexto:** el ítem de revisión del Caso 30 lleva par, score, explain y acciones humanas; el espacio de labels de ER no incluye fraude.\n- **Meta:** construir el dict con `actions = ['match', 'non_match', 'uncertain']`.\n- **Éxito:** dict completo con esas actions (sin `fraud`).\n- **Límites:** no añadas parentesco ni colusión; conserva pair/score/explain dados.",
        instruction:
          "1. Revisa el starter: `actions` incluye `\"fraud\"`.\n2. Reemplaza por match / non_match / uncertain.\n3. Imprime el dict del ítem.\n4. No alteres score ni explain.",
        hint: "actions sin fraud; conserva pair/score/explain",
        hints: [
          "ER no emite label de fraude",
          "uncertain cubre duda humana",
          "Imprime el dict completo del ítem",
        ],
        edgeCases: ["actor + timestamp en el ítem real de producción"],
        tests: "salida coincide con solution output",
        feedback:
          "El label_space del ítem define el contrato ético del motor en la cola. Meter `fraud` es un bug de alcance, no un “feature” de producto.",
        retrospective:
          "El label_space define el contrato ético del motor en la cola. Meter `fraud` es un bug de alcance, no un “feature”. Luego (E3): filtra una lista propuesta de labels ajenos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · ítem de cola clerical
# Error: actions incluye fraud
pair = ("e3", "e4")
score = 0.72
explain = {"name": 0.8, "email": 0.5}
actions = ["match", "non_match", "fraud"]
print({"pair": pair, "score": score, "explain": explain, "actions": actions})
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pair = ("e3", "e4")
score = 0.72
explain = {"name": 0.8, "email": 0.5}
actions = ["match", "non_match", "uncertain"]
print({"pair": pair, "score": score, "explain": explain, "actions": actions})`,
          output: `{'pair': ('e3', 'e4'), 'score': 0.72, 'explain': {'name': 0.8, 'email': 0.5}, 'actions': ['match', 'non_match', 'uncertain']}`,
        },
      },
      {
        id: "S30-T3-B-E3",
        subtopicId: "S30-T3-B",
        kind: "transfer",
        title: "Filtrar labels ajenos a ER",
        preamble:
          "- **Contexto:** una propuesta de producto mete `fraud` y `kinship` en el motor de matching; el borde del sistema del Caso 30 debe filtrarlos.\n- **Meta:** devolver solo labels permitidos en el orden de aparición.\n- **Éxito:** `['match', 'non_match', 'uncertain']`.\n- **Límites:** no dejes pasar fraud/kinship; no reordenes alfabéticamente; ER solo decide si dos registros son la misma entidad.",
        instruction:
          "1. Lee el starter: imprime `proposed` sin filtrar.\n2. Filtra con `allowed = {\"match\", \"non_match\", \"uncertain\"}`.\n3. Usa comprensión que preserve el orden de `proposed`.\n4. Imprime la lista filtrada.",
        hint: "allowed = {...}; list comprehension",
        hints: [
          "Recorre proposed y quédate con allowed",
          "Orden de aparición en proposed",
        ],
        edgeCases: ["kinship y fraud fuera de ER"],
        tests: "salida coincide con solution output",
        feedback:
          "ER responde “¿misma entidad?”; parentesco y fraude son otras tareas. Filtrar en el borde evita que el score de matching se convierta en acusación.",
        retrospective:
          "El borde del sistema filtra labels ajenos *antes* de que el score se lea como acusación. Parentescos y fraude son pipelines distintos; aquí solo sobrevive match/non_match/uncertain. Pregunta: si `proposed` trajera solo `fraud`, ¿qué lista imprime? En T4 medirás el motor sin leakage de entidades.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · alcance de ER
# Error: no filtra labels ajenos
proposed = ["match", "fraud", "non_match", "kinship", "uncertain"]
allowed = {"match", "non_match", "uncertain"}
print(proposed)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `proposed = ["match", "fraud", "non_match", "kinship", "uncertain"]
allowed = {"match", "non_match", "uncertain"}
print([x for x in proposed if x in allowed])`,
          output: `['match', 'non_match', 'uncertain']`,
        },
      },
      {
        id: "S30-T4-A-E1",
        subtopicId: "S30-T4-A",
        kind: "guided",
        title: "Etiqueta train por subset de entidades",
        preamble:
          "- **Contexto:** al calibrar umbrales del Caso 30, un par solo es train si ambas entidades están en el conjunto de entrenamiento.\n- **Meta:** imprimir `train` o `test` según `{a,b} ⊆ train_e`.\n- **Éxito:** `train` para e1,e2 con train_e={e1,e2,e3}.\n- **Límites:** no inviertas la lógica; un par mixto no es train limpio.",
        instruction:
          "1. Abre el starter: imprime `\"test\" if subset else \"train\"` (bug invertido).\n2. Corrige a `\"train\" if {a,b} <= train_e else \"test\"`.\n3. Imprime solo la etiqueta.\n4. No mutes train_e.",
        hint: "{a,b} <= train_e",
        hints: [
          "Subset de entidades → train",
          "Cualquier entidad fuera → test",
        ],
        edgeCases: ["par mixto train/test se va a test"],
        tests: "salida coincide con solution output",
        feedback:
          "El split por entidad es la guardia anti-leakage. Invertir train/test es un bug silencioso que infla el F1 del notebook y falla con contactos nuevos.",
        retrospective:
          "Un par es train solo si *ambas* entidades ⊆ train_e. Invertir la rama aprueba el test de “algo se imprime” y miente al calibrar umbrales. Pregunta: con a=e1, b=e4 y train_e={e1,e2,e3}, ¿train o test en *esta* etiqueta binaria? Siguiente (E2): prevalencia de matches en el gold.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · entity split
# Error: invierte train/test
a, b = "e1", "e2"
train_e = {"e1", "e2", "e3"}
print("test" if {a, b} <= train_e else "train")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a, b = "e1", "e2"
train_e = {"e1", "e2", "e3"}
print("train" if {a, b} <= train_e else "test")`,
          output: `train`,
        },
      },
      {
        id: "S30-T4-A-E2",
        subtopicId: "S30-T4-A",
        kind: "independent",
        title: "Prevalencia de matches en el gold",
        preamble:
          "- **Contexto:** en ER real y en el gold del Caso 30 los matches suelen ser raros; un accuracy alto engaña.\n- **Meta:** calcular `matches / n` con 1 match de 5 pares.\n- **Éxito:** el float `0.2`.\n- **Límites:** no inviertas la razón; documenta prevalencia junto a P/R en el portfolio.",
        instruction:
          "1. Revisa el starter: `print(n / matches)` (bug).\n2. Cambia a `matches / n`.\n3. Imprime el cociente.\n4. No redondees salvo que el test lo pida.",
        hint: "matches / n",
        hints: [
          "Base rate suele ser baja",
          "Documenta prevalencia junto a P/R",
        ],
        edgeCases: ["desbalance extremo"],
        tests: "salida coincide con solution output",
        feedback:
          "Sin base rate, un accuracy alto engaña en ER. Documenta prevalencia junto a P/R en el README del cierre CP-N3-A.",
        retrospective:
          "La base rate contextualiza P/R: sin ella, accuracy miente. El error clásico es omitir prevalencia en el README. Luego (E3): marca pares mixtos como `cross_split`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · match rate
# Error: invierte la razón
matches, n = 1, 5
print(n / matches)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `matches, n = 1, 5
print(matches / n)`,
          output: `0.2`,
        },
      },
      {
        id: "S30-T4-A-E3",
        subtopicId: "S30-T4-A",
        kind: "transfer",
        title: "train, test y cross_split",
        preamble:
          "- **Contexto:** un par con un pie en train y otro fuera no es hold-out limpio: la entidad de train reaparece en “evaluación”.\n- **Meta:** etiquetar train (ambos en train_e), test (ninguno en train_e), cross_split (mezcla).\n- **Éxito:** `['train', 'test', 'cross_split']` para los tres pares del fixture.\n- **Límites:** no trates el mixto como test; excluye cross_split de P/R primario.",
        instruction:
          "1. Lee el starter: cualquier no-train cae en `\"test\"`.\n2. Añade rama `ents.isdisjoint(train_e) → \"test\"`.\n3. El resto mixto → `\"cross_split\"`.\n4. Imprime la lista de etiquetas en orden de pares.",
        hint: "tres etiquetas: train / test / cross_split",
        hints: [
          "('e1','e2') → train (ambos en train_e)",
          "('e4','e5') → test (ambos fuera de train_e)",
          "('e1','e4') → cross_split (mezcla; no es test limpio)",
        ],
        edgeCases: [
          "Un par mixto en test sigue filtrando la entidad de train: leakage.",
          "Métricas primarias usan solo pares train y test puros.",
        ],
        tests: "salida coincide con solution output",
        feedback:
          "Asignar un par mixto a test no evita leakage: la entidad de train reaparece en evaluación. Marca `cross_split` y exclúyelo del P/R primario del portfolio.",
        retrospective:
          "Cross_split fuera de métricas primarias evita leakage disfrazado. El error clásico es “todo lo que no es train es test”. En T4-B medirás P/R y slices sobre predicciones honestas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · entity_split con detección de cross_split
# Error: trata el par mixto como test (leakage disfrazado)
pairs = [("e1", "e2"), ("e4", "e5"), ("e1", "e4")]
train_e = {"e1", "e2", "e3"}

def label(a, b):
    # bug: cualquier par no-train cae en "test"
    return "train" if {a, b} <= train_e else "test"

print([label(a, b) for a, b in pairs])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pairs = [("e1", "e2"), ("e4", "e5"), ("e1", "e4")]
train_e = {"e1", "e2", "e3"}

def label(a, b):
    ents = {a, b}
    if ents <= train_e:
        return "train"
    if ents.isdisjoint(train_e):
        return "test"
    return "cross_split"

print([label(a, b) for a, b in pairs])`,
          output: `['train', 'test', 'cross_split']`,
        },
      },
      {
        id: "S30-T4-B-E1",
        subtopicId: "S30-T4-B",
        kind: "guided",
        title: "Precisión pairwise desde tp y fp",
        preamble:
          "- **Contexto:** en el hold-out del Caso 30, un auto_match falso duele a operaciones; la precisión lo castiga.\n- **Meta:** contar tp (t=1∧p=1) y fp (t=0∧p=1) e imprimir `round(tp/(tp+fp), 2)`.\n- **Éxito:** `0.67` con los vectores dados (tp=2, fp=1).\n- **Límites:** no uses solo `sum(y_pred)`; recorre `zip(y_true, y_pred)`.",
        instruction:
          "1. Abre el starter: `pred_pos = sum(y_pred)` y cociente 1.0 (bug).\n2. Calcula tp y fp con generadores o bucles sobre `zip(y_true, y_pred)`.\n3. Imprime `round(tp/(tp+fp), 2)`.",
        hint: "tp = sum(t==1 and p==1); fp = sum(t==0 and p==1)",
        hints: [
          "Recorre zip(y_true, y_pred)",
          "round(tp / (tp + fp), 2)",
          "Aquí tp=2, fp=1 → 0.67",
        ],
        edgeCases: ["tp+fp=0 → 0.0 en el motor real"],
        tests: "salida coincide con solution output",
        feedback:
          "Precisión se deriva de tp/fp sobre pares, no de un conteo mágico de predicciones. “Cuántos dije match” sin mirar el gold no protege a operaciones.",
        retrospective:
          "Precisión castiga FP de auto_match que duelen a operaciones. Contar “cuántos dije match” sin gold es teatro. Pregunta: si y_pred fuera todo 0, ¿qué imprime un motor real con tp+fp=0? Siguiente (E2): recall con fn (matches perdidos).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · precision desde vectores
# Error: no distingue tp de fp
y_true = [1, 1, 0, 0]
y_pred = [1, 1, 1, 0]
pred_pos = sum(y_pred)  # 3 — no es precisión
print(round(pred_pos / pred_pos, 2))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `y_true = [1, 1, 0, 0]
y_pred = [1, 1, 1, 0]
tp = sum(t == 1 and p == 1 for t, p in zip(y_true, y_pred))
fp = sum(t == 0 and p == 1 for t, p in zip(y_true, y_pred))
print(round(tp / (tp + fp), 2))`,
          output: `0.67`,
        },
      },
      {
        id: "S30-T4-B-E2",
        subtopicId: "S30-T4-B",
        kind: "independent",
        title: "Recall pairwise con fn",
        preamble:
          "- **Contexto:** si el motor del Caso 30 pierde matches (fn), el recall pairwise cae — a veces por blocking incompleto, a veces por umbral agresivo.\n- **Meta:** calcular `tp/(tp+fn)` con tp=2, fn=2.\n- **Éxito:** el float `0.5`.\n- **Límites:** no uses `(tp+fn)` en el numerador; interpreta fn como matches perdidos.",
        instruction:
          "1. Revisa el starter: numerador `tp+fn` (bug).\n2. Usa solo `tp` en el numerador.\n3. Imprime el cociente.\n4. No inventes F1 aquí (queda para el You Do).",
        hint: "tp / (tp + fn)",
        hints: [
          "fn son matches perdidos",
          "Recall bajo → blocking o umbral agresivo",
        ],
        edgeCases: ["F1 es media armónica de P y R."],
        tests: "salida coincide con solution output",
        feedback:
          "Recall pairwise complementa candidate recall de blocking: uno mira el scorer, el otro el embudo previo. Un numerador que siempre da 1.0 es teatro de métrica.",
        retrospective:
          "Recall pairwise mira el scorer; candidate recall mira el embudo de blocking. Un numerador que siempre da 1.0 es métrica rota, no “buen motor”. Pregunta: con tp=2, fn=0, ¿qué recall y qué te dice de umbrales? Luego (E3): agrega errores por slice accionable.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · recall
# Error: numerador mal armado
tp, fn = 2, 2
print((tp + fn) / (tp + fn))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tp, fn = 2, 2
print(tp / (tp + fn))`,
          output: `0.5`,
        },
      },
      {
        id: "S30-T4-B-E3",
        subtopicId: "S30-T4-B",
        kind: "transfer",
        title: "Error slices de mayor conteo",
        preamble:
          "- **Contexto:** los índices de error del Caso 30 se rebanan por causa (`missing_phone`, apellido común, ciudad) para priorizar mejoras del motor.\n- **Meta:** listar slices con conteo máximo de `error=True`.\n- **Éxito:** `['missing_phone']`.\n- **Límites:** solo filas con error; en empate, varias claves; no conviertas el error en label de fraude.",
        instruction:
          "1. Lee el starter: imprime `[]`.\n2. Cuenta con `Counter` (o dict) por `slice` donde `error`.\n3. Toma `max` del conteo y filtra claves empatadas.\n4. Imprime la lista de slices top.",
        hint: "agrupa errores por slice y toma el max",
        hints: [
          "Cuenta por clave de slice",
          "Devuelve las claves con conteo máximo",
        ],
        edgeCases: ["empates: lista con varios slices"],
        tests: "salida coincide con solution output",
        feedback:
          "Los slices convierten fallos en hipótesis de mejora (más blocking, más peso a phone). Un índice suelto sin agregación no prioriza el backlog del motor.",
        retrospective:
          "Los slices convierten índices de error en backlog priorizado (más blocking, más peso a phone). Un `[]` o un índice suelto no prioriza. Pregunta: si `common_last_name` también tuviera 2 errores, ¿qué imprime? En el You Do reportarás slices en el README del portfolio.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Caso 30 · error slices
# Error: no agrega por slice
rows = [
    {"slice": "missing_phone", "error": True},
    {"slice": "missing_phone", "error": True},
    {"slice": "common_last_name", "error": True},
    {"slice": "common_last_name", "error": False},
    {"slice": "city_mismatch", "error": False},
]
print([])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows = [
    {"slice": "missing_phone", "error": True},
    {"slice": "missing_phone", "error": True},
    {"slice": "common_last_name", "error": True},
    {"slice": "common_last_name", "error": False},
    {"slice": "city_mismatch", "error": False},
]
from collections import Counter
c = Counter(r["slice"] for r in rows if r["error"])
top = max(c.values())
print([s for s, n in c.items() if n == top])`,
          output: `['missing_phone']`,
        },
      },
    ],
  },
  youDo: {
    title: "Motor de entity resolution testeable — cierre CP-N3-A",
    context:
      "Implementa el motor ER sintético de cierre de **CP-N3-A**: comparadores explicables (missing ≠ agree), blocking con candidate recall medido, scorer didáctico con umbrales auto_match/review/non_match, cola clerical, clusters (Union-Find con validación de merge) y evaluación pairwise con split por entidad (sin cross_split en métricas primarias) y error slices. Solo benchmark sintético del Caso 30 (`CASO-LIM-030`). ER responde «¿misma entidad?»; no infiere relación ni riesgo/fraude. El score ponderado no se vende como probabilidad calibrada.",
    objectives: [
      "Implementar comparadores exact, edit, token y fecha con scores en [0,1] o None si falta valor; estados missing/agree/disagree y pesos por frecuencia.",
      "Diseñar claves de blocking, medir candidate recall sobre gold sintético y acotar costo con filtro de pares imposibles (filter_before_score).",
      "Calcular score ponderado didáctico solo sobre campos observados, aplicar umbrales auto_match/review/non_match y mantener clusters con Union-Find más cola clerical explicable.",
      "Evaluar con gold sintético, split por entidad sin leakage (cross_split excluido), P/R/F1 pairwise, co-cluster completeness/quality y error slices accionables.",
      "Entregar suite ejecutable alineada a tests (S27), propiedades (S28) y al almacén SQL de pares/decisiones (S29).",
    ],
    requirements: [
      "Datos sintéticos etiquetados; sin PII real",
      "Candidate recall y métricas reportadas en la demo del portfolio",
      "Explicación por campo en cada ítem de cola de review",
      "Cero labels de fraude/parentesco automáticos (gate ético de fallo automático)",
      "README en español profesional con límites del fixture, umbrales y política de cross_split",
    ],
    starterCode: `# CP-N3-A — Motor ER testeable (esqueleto)
from collections import defaultdict
from datetime import date
from typing import Any

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

def fold_accents(s: str) -> str:
    table = str.maketrans("áéíóúüñ", "aeiouun")
    return normalize(s).translate(table)

def exact(a: str, b: str):
    # Tu implementación: None si falta valor; 1.0/0.0 si ambos observados
    na, nb = normalize(a), normalize(b)
    if not na or not nb:
        return None
    return 1.0 if na == nb else 0.0

def token_jaccard(a: str, b: str):
    ta, tb = set(normalize(a).split()), set(normalize(b).split())
    if not ta or not tb:
        return None  # missing en un lado o ambos: sin evidencia
    return len(ta & tb) / len(ta | tb)

def edit_sim(a: str, b: str) -> float:
    # Tu implementación: Levenshtein normalizado (ver theory T1-A)
    raise NotImplementedError("edit_sim")

def date_sim(d1: date, d2: date, tol_days: int = 3) -> float:
    # Tu implementación: 1.0 / 0.5 / 0.0 según tolerancia
    raise NotImplementedError("date_sim")

def compare_field(a: Any, b: Any) -> str:
    # Tu implementación: missing | agree | disagree
    raise NotImplementedError("compare_field")

def frequency_weight(value: str, freq_table: dict, base: float = 1.0) -> float:
    f = freq_table.get(value.casefold(), 1)
    return base / f

def block_key(rec: dict) -> str:
    parts = fold_accents(rec.get("name", "")).split()
    last = parts[-1] if parts else ""
    city = fold_accents(rec.get("city", ""))[:3]
    return f"{last}|{city}"

def candidate_recall(gold: set, candidates: set) -> float:
    if not gold:
        return 0.0
    return len(gold & candidates) / len(gold)

def pair_score(sims: dict, weights: dict) -> float:
    # solo campos observados (sim no None); si no hay evidencia → 0.0 (ruta a review)
    keys = [k for k in weights if sims.get(k) is not None]
    den = sum(weights[k] for k in keys)
    if not den:
        return 0.0
    return sum(sims[k] * weights[k] for k in keys) / den

def decide(score: float, t_high: float = 0.9, t_low: float = 0.5) -> str:
    if score >= t_high:
        return "auto_match"
    if score <= t_low:
        return "non_match"
    return "review"

class UnionFind:
    def __init__(self) -> None:
        self.p: dict = {}

    def find(self, x):
        self.p.setdefault(x, x)
        if self.p[x] != x:
            self.p[x] = self.find(self.p[x])
        return self.p[x]

    def union(self, a, b) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra

def entity_split(pairs: list, train_entities: set) -> tuple:
    # Tu implementación: train / test / lista cross_split; métricas primarias sin cross
    raise NotImplementedError("entity_split")

def prf(y_true: list, y_pred: list) -> tuple:
    # Tu implementación: precision, recall, f1
    raise NotImplementedError("prf")

def error_slices(rows: list) -> list:
    # Tu implementación: slices con más errores
    raise NotImplementedError("error_slices")

# 3 tests mínimos sugeridos (pytest):
# 1) exact post-normalize
# 2) candidate_recall con gold y buckets
# 3) decide banda gris → review

# Fixture mínimo sintético (expande en tu repo; sin PII real)
FIXTURE = [
    {"id": "r1", "name": "Ana López", "city": "Lima", "email": "ana@example.pe", "type": "person"},
    {"id": "r2", "name": "ANA Lopez", "city": "Lima", "email": "ana@example.pe", "type": "person"},
    {"id": "r3", "name": "Acme SAC", "city": "Lima", "email": "info@example.pe", "type": "org"},
]

if __name__ == "__main__":
    print(decide(0.95), block_key(FIXTURE[0]))
    print("fold_demo", block_key(FIXTURE[0]) == block_key(FIXTURE[1]))
`,
    portfolioNote:
      "Cierre CP-N3-A: en el README del repo documenta (1) candidate recall del blocking, (2) P/R/F1 y co-cluster completeness/quality en el split por entidad (sin pares cross_split en métricas primarias), (3) umbrales `t_high`/`t_low` elegidos y por qué, (4) un ejemplo de ítem de cola clerical con explicación por campo. Solo datos sintéticos; límites del fixture del Caso 30 (`CASO-LIM-030`) explícitos.",
    rubric: [
      { criterion: "Motor completo: comparadores, blocking medido, umbrales, cola clerical y métricas", weight: "25%" },
      { criterion: "Correctitud técnica y demos ejecutables en el entorno declarado", weight: "20%" },
      { criterion: "Privacidad: sin PII real, sin secretos, sin inferencia de fraude/parentesco", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (mín. 3 tests importables al estilo S27)", weight: "15%" },
      { criterion: "Código legible y límites del fixture claros en README", weight: "10%" },
      { criterion: "Documentación en español profesional (métricas y umbrales legibles)", weight: "10%" },
      { criterion: "Gate ético (fallo automático): ER solo misma entidad; sin fraude/relación/colusión automática", weight: "gate" },
      { criterion: "Stretch: candidate recall + P/R reportados, split sin leakage y política cross_split documentada", weight: "recomendado" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con un test o print — candidate recall del blocking, o P/R sin pares `cross_split`? (2) ¿qué harías distinto con datos reales vs. el fixture `CASO-LIM-030` (PII, consentimientos, ausencia por fuente)? (3) En el README, una frase de impacto medible (p. ej. “antes all-pairs / después recall X y cola clerical explicable”) que puedas defender en 30 segundos sin invocar fraude ni parentesco. Pregunta de cierre: si un score 0.91 no trae vector de aportes, ¿por qué el revisor debe rechazarlo como evidencia insuficiente?",
  },
  selfCheck: {
    questions: [
      {
        question: "El motor ER de CP-N3-A debe decidir:",
        options: ["Si dos registros comparten al menos un atributo de contacto", "Si dos registros son la misma entidad", "Si dos registros deben ir al mismo bloque de comparación", "Si dos registros superan el umbral de similitud textual"],
        correctIndex: 1,
        explanation:
          "Entity resolution solo decide si dos registros apuntan a la misma entidad del mundo real. Parentesco, colusión o fraude son tareas distintas (más adelante en el path de investigación).",
      },
      {
        question: "Candidate recall de blocking mide:",
        options: ["Solo CPU", "Precisión del scorer final únicamente", "Tamaño del disco", "Fracción de verdaderos matches que sobreviven al blocking"],
        correctIndex: 3,
        explanation:
          "De los pares gold que son match, ¿cuántos quedaron como candidatos tras el blocking? Si el recall de candidatos es bajo, el scorer nunca ve el match.",
      },
      {
        question: "Un campo vacío en la comparación de un par debe tratarse como:",
        options: ["estado `missing` (ni agree ni disagree)", "disagree fuerte (empuja a non_match)", "agree exacto por defecto", "auto_match si el otro campo está lleno"],
        correctIndex: 0,
        explanation:
          "Missing ≠ disagree. Si penalizas el vacío como desacuerdo, inflas non-matches espurios cuando una fuente simplemente no publica el campo. En el scorer, missing suele aportar 0 al peso de ese campo.",
      },
      {
        question: "Reglas de blocking en unión (OR) vs. intersección (AND):",
        options: ["OR baja candidate recall; AND siempre lo sube", "OR y AND dan el mismo recall si las claves son independientes", "OR suele subir candidate recall; AND reduce candidatos y puede matar recall de gold matches", "AND sube candidate recall porque exige coincidencias más firmes"],
        correctIndex: 2,
        explanation:
          "OR (unión de claves) deja pasar más pares verdaderos match al scorer. AND (intersección) recorta candidatos y CPU, pero si es demasiado estricta el gold match nunca llega al scorer. Siempre mide candidate recall con gold sintético.",
      },
      {
        question: "Scores entre t_low y t_high van a:",
        options: ["auto_match", "clerical review", "non_match", "borrado"],
        correctIndex: 1,
        explanation:
          "La banda gris se envía a revisión humana con explicación por campo. auto_match exige score ≥ t_high; non_match exige score ≤ t_low. Nunca auto_fraud.",
      },
      {
        question: "Split por entidad evita:",
        options: ["Sobreajuste del umbral a los pares del conjunto de entrenamiento", "Desbalance: los no-match superan a los match por varios órdenes", "Deriva: las claves de bloqueo cambian entre train y test", "Leakage (fuga) de identidad entre train y test"],
        correctIndex: 3,
        explanation:
          "Si la misma entidad aparece en train y test, las métricas se inflan. Particiona entidades primero; un par mixto es cross_split y no cuenta como test limpio.",
      },
      {
        question: "Un score alto de match en ER sintético implica…",
        options: ["prioridad de revisión / enlace de entidad candidato, no veredicto legal", "que las dos entidades pertenecen al mismo cluster final", "que el par ya no necesita pasar por la cola clerical", "que el umbral de similitud puede subirse sin perder recall"],
        correctIndex: 0,
        explanation:
          "ER propone misma entidad con evidencia; el espacio de labels es match / non_match / uncertain. El score didáctico no es probabilidad calibrada ni prueba de fraude.",
      },
      {
        question: "Los pares imposibles (p. ej. person vs. org) deben filtrarse:",
        options: ["Después del scorer, solo para maquillar métricas", "Solo en la cola clerical, nunca en el pipeline batch", "Antes del scorer (filter_before_score), para no gastar CPU en lo incomparable", "Nunca: todo par debe recibir un score de similitud"],
        correctIndex: 2,
        explanation:
          "El filtro de imposibles corre antes del scorer pesado. Si inviertes el orden, pagas edit distance y token sets en pares que la política ya descartaría. En el portfolio documenta la política `filter_before_score`.",
      },
      {
        question: "Co-cluster completeness (vista simplificada de cluster) mide:",
        options: ["La precisión pairwise del scorer sobre los pares candidatos", "La fracción de pares gold match que el sistema mantiene en el mismo cluster", "La proporción de pares gold match que el blocking deja pasar", "La proporción de clusters que contienen un solo registro"],
        correctIndex: 1,
        explanation:
          "Un F1 pairwise alto puede esconder clusters partidos. Co-cluster completeness pregunta: de los pares gold que deberían estar juntos, ¿cuántos quedaron unidos tras Union-Find? (En blocking, pairs completeness mide candidatos; aquí es vista de cluster.)",
      },
    ],
  },
  topicEvaluations: [
    {
      id: "S30-T1-TE",
      topic_id: "S30-T1",
      title: "Evaluación formativa — Comparadores y missing",
      subtopics_covered: ["S30-T1-A", "S30-T1-B"],
      tasks: [
        {
          id: "S30-T1-TE-1",
          title: "Comparadores con normalización y aportes por campo",
          authentic: true,
          deliverable:
            "Script sobre Caso 30 sintético: exact/edit/token/fecha; imprime score por campo y vector de aportes. Caso borde: email con distinta capitalización. 4–6 oraciones de justificación.",
        },
        {
          id: "S30-T1-TE-2",
          title: "Missing y frecuencia sin penalizar vacío como disagree",
          authentic: true,
          deliverable:
            "Mismo fixture: un par con phone vacío → estado missing (no 1.0/0.0 ciego); peso de acuerdo «María» vs. apellido raro. README: por qué missing no empuja a non_match.",
        },
      ],
      rubric_0_3: {
        correctness: "¿Comparadores y missing se comportan según el contrato de la sección?",
        robustness: "¿Vacíos y valores frecuentes no rompen el scorer?",
        maintainability: "¿El script y el README son reproducibles por un colega?",
        responsible_use: "¿Solo datos sintéticos y sin labels de fraude/parentesco?",
      },
    },
    {
      id: "S30-T2-TE",
      topic_id: "S30-T2",
      title: "Evaluación formativa — Blocking y costo",
      subtopics_covered: ["S30-T2-A", "S30-T2-B"],
      tasks: [
        {
          id: "S30-T2-TE-1",
          title: "Clave de blocking con candidate recall medido",
          authentic: true,
          deliverable:
            "Dos claves (sin fold vs. con fold de acentos) sobre gold sintético; reporta candidate recall y n_cand. Explica el recall 0.0 de López/lopez sin normalizar.",
        },
        {
          id: "S30-T2-TE-2",
          title: "Costo de bloques y filter_before_score",
          authentic: true,
          deliverable:
            "Costo C(n,2) por tamaños de bloque; filtra person vs. org antes del scorer; imprime conteo de pares que sobreviven y la política `filter_before_score`.",
        },
      ],
      rubric_0_3: {
        correctness: "¿Candidate recall y filtro de imposibles están bien calculados?",
        robustness: "¿Detecta bloques monstruosos o claves demasiado gruesas?",
        maintainability: "¿Se puede re-ejecutar el experimento de claves en minutos?",
        responsible_use: "¿Fixture sintético; scores solo priorizan revisión?",
      },
    },
    {
      id: "S30-T3-TE",
      topic_id: "S30-T3",
      title: "Evaluación formativa — Score, review y clusters",
      subtopics_covered: ["S30-T3-A", "S30-T3-B"],
      tasks: [
        {
          id: "S30-T3-TE-1",
          title: "Umbrales duales y cola clerical explicable",
          authentic: true,
          deliverable:
            "Scorer didáctico + decide(t_high, t_low); al menos un ítem en review con explicación por campo y actions ⊆ {match, non_match, uncertain}. Declara que el score no es probabilidad calibrada.",
        },
        {
          id: "S30-T3-TE-2",
          title: "Union-Find con merge validado (sin puente ciego)",
          authentic: true,
          deliverable:
            "Auto-matches + una aprobación clerical; documenta que un bridge falso sobrefundiría y qué check harías antes de union en producción.",
        },
      ],
      rubric_0_3: {
        correctness: "¿Umbrales, cola y cluster se alinean al contrato CP-N3-A?",
        robustness: "¿Hay guardas frente a labels ajenos (fraud) y merges dudosos?",
        maintainability: "¿El ítem de cola es auditable por un revisor humano?",
        responsible_use: "¿Cero auto_fraud / parentesco automático?",
      },
    },
    {
      id: "S30-T4-TE",
      topic_id: "S30-T4",
      title: "Evaluación formativa — Evaluación y leakage",
      subtopics_covered: ["S30-T4-A", "S30-T4-B"],
      tasks: [
        {
          id: "S30-T4-TE-1",
          title: "Split por entidad con cross_split explícito",
          authentic: true,
          deliverable:
            "Lista de pares con etiquetas train/test/cross_split; overlap de entidades train∩test = 0 en métricas primarias; 3–5 oraciones sobre por qué un par mixto no es test limpio.",
        },
        {
          id: "S30-T4-TE-2",
          title: "P/R pairwise, co-cluster y error slices",
          authentic: true,
          deliverable:
            "Precisión/recall/F1 + co-cluster completeness/quality + top error slice (p. ej. missing_phone). README: no convertir error de matching en acusación de fraude.",
        },
      ],
      rubric_0_3: {
        correctness: "¿Las métricas y el split anti-leakage son correctos?",
        robustness: "¿Se reportan cross_split y prevalencia del gold?",
        maintainability: "¿Un colega puede re-correr la evaluación desde el README?",
        responsible_use: "¿Slices y scores no se venden como prueba de fraude?",
      },
    },
  ],
  resources: {
    docs: [
      {
        label: "Record linkage (overview)",
        url: "https://en.wikipedia.org/wiki/Record_linkage",
        note: "Contexto de ER/blocking",
      },
      {
        label: "splink documentation",
        url: "https://moj-analytical-services.github.io/splink/",
        note: "Probabilistic linkage moderno",
      },
      {
        label: "splink — Blocking",
        url: "https://moj-analytical-services.github.io/splink/topic_guides/blocking/blocking_rules.html",
        note: "Reglas de blocking y recall",
      },
      {
        label: "Fellegi–Sunter model (overview)",
        url: "https://en.wikipedia.org/wiki/Record_linkage#Probabilistic_record_linkage",
        note: "Pesos m/u y umbrales",
      },
      {
        label: "Robin Linacre — Interactive Fellegi–Sunter",
        url: "https://www.robinlinacre.com/intro_to_probabilistic_linkage/",
        note: "Intuición de prior, m/u y match weights",
      },
      {
        label: "RapidFuzz",
        url: "https://github.com/rapidfuzz/RapidFuzz",
        note: "Edit/token similarity práctica",
      },
      {
        label: "dedupe library docs",
        url: "https://docs.dedupe.io/",
        note: "Active learning y clustering",
      },
    ],
    books: [
      {
        label: "Data Matching (Peter Christen)",
        note: "Blocking, comparación y evaluación",
      },
      {
        label: "Entity Resolution papers / Fellegi–Sunter",
        note: "Pesos y umbrales clásicos",
      },
    ],
    courses: [
      {
        label: "Coursera — data matching / linkage",
        url: "https://www.coursera.org/courses?query=record%20linkage%20entity%20resolution",
        note: "ER y linkage",
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
        label: "deeplearning.ai — data engineering",
        url: "https://www.deeplearning.ai/specializations/data-engineering",
        note: "Calidad de datos y pipelines",
      },
    ],
  },
}
