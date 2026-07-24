import type { CourseSection } from '../../types'

export const section30: CourseSection = {
  id: "security-infra",
  index: 30,
  title: "Entity resolution probabilístico",
  shortTitle: "ER probabilístico",
  tagline: "Motor de entity resolution testeable: benchmark etiquetado, blocking medido, comparadores explicables y cola de revisión",
  estimatedHours: 18,
  level: "Competente",
  phase: 2,
  icon: "GitMerge",
  accentColor: "bg-gradient-to-br from-fuchsia-500 to-purple-900",
  jobRelevance:
    "Cierras **CP-N3-A** con un **motor de entity resolution testeable**: comparadores, blocking con recall medido, pesos/umbrales y métricas de precisión/recall. Los scores solo priorizan la cola de revisión clerical; nunca etiquetan fraude, parentesco ni colusión. En equipos de datos (bancos, telecom, retail en Perú y LatAm) este motor une contactos sintéticos duplicados antes de alimentar grafos de evidencia (S31) y almacenes SQL (S29).",
  learningOutcomes: [
    { text: "Implementar comparadores exact, edit, token y fecha que devuelven score en [0,1] con explicación por campo" },
    { text: "Tratar missingness (vacío ≠ desacuerdo) y bajar el peso de valores frecuentes en acuerdos" },
    { text: "Diseñar reglas de blocking y medir candidate recall sobre gold sintético" },
    { text: "Estimar costo de pares por bloque y filtrar pares imposibles antes del scorer" },
    { text: "Calcular score ponderado y aplicar umbrales auto_match / review / non_match de forma conservadora" },
    { text: "Operar cola clerical y consistencia de cluster con Union-Find" },
    { text: "Partir pares por entidad sin leakage de identidad entre train y test" },
    { text: "Reportar precisión/recall/F1 pairwise, una métrica de cluster simplificada y error slices" },
  ],
  theory: [
    {
      heading: "Cierre CP-N3-A: motor de entity resolution testeable",
      paragraphs: [
        "**S30 cierra CP-N3-A.** Entregas un motor **testeable**: benchmark etiquetado sintético, **blocking con recall medido**, comparadores explicables y cola de revisión clerical. Un score de matching **solo prioriza** revisión humana; no es veredicto de fraude ni de parentesco.",
        "ER responde solo **¿misma entidad?** — **no** parentesco, colusión ni fraude. Contrato de esta sección: pares sintéticos del caso `CASO-LIM-030` (contactos Lima `@example.pe`) → decisión `auto_match` | `review` | `non_match` con explicación por campo. Falta gold o blocking sin recall medido = error de diseño, no “métrica opcional”.",
        "Orden: **T1 Comparadores** → **T2 Blocking y costo** → **T3 Matching** (pesos, umbrales, review, clusters) → **T4 Evaluación** (split por entidad, P/R, slices). Integra contratos de S27–S29 (tests, propiedades, almacén SQL de pares/decisiones). La fusión de entidades usa Union-Find; la evidencia debe ser exportable. En S31 esos nodos de entidad alimentan el grafo de evidencia.",
      ],
      callout: {
        type: "info",
        title: "Criterio de cierre CP-N3-A",
        content:
          "La promoción exige un motor ER ejecutable y evidencia de sus métricas, errores y casos enviados a revisión. Ética de la sección (una sola vez): scores priorizan humanos; nunca auto-etiquetan fraude.",
      },
    },
    {
      heading: "exact, edit/token y fecha",
      subtopicId: "S30-T1-A",
      paragraphs: [
        "**Exact**: igualdad **después** de normalizar (`casefold` + colapsar espacios). **Edit** (Levenshtein normalizado): typos y diferencias de acentos leves. **Token**: Jaccard u overlap de palabras (orden “Ana López” / “López Ana”). **Fecha**: distancia en días con tolerancia. Ningún comparador “prueba” fraude: solo aporta evidencia de identidad.",
        "Cada comparador devuelve un score en **[0,1]** o un nivel ordinal (`agree` / `disagree` / `missing`) listo para un modelo tipo **Fellegi–Sunter didáctico** (simplificación: promedio ponderado de similitudes; el FS completo usa log₂(m/u) y prior λ — ver recursos). Mezclar escalas sin normalizar invalida los umbrales de auto_match/review.",
        "Para auditoría clerical guarda **campo + función + aporte**. Sin vector de aportes, un 0.91 opaco no se puede cuestionar. En `CASO-LIM-030`, email exacto y nombre con tokens reordenados son el primer humo de un match candidato.",
      ],
      code: {
        language: 'python',
        title: "comparators.py",
        code: `def exact(a, b):
    na = " ".join(a.casefold().split())
    nb = " ".join(b.casefold().split())
    return 1.0 if na == nb else 0.0

def token_jaccard(a, b):
    ta, tb = set(a.casefold().split()), set(b.casefold().split())
    if not ta and not tb:
        return 1.0
    if not ta or not tb:
        return 0.0
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
      heading: "missingness informativa y frecuencia",
      subtopicId: "S30-T1-B",
      paragraphs: [
        "**Ausencia de campo (missingness)**: un campo vacío no es desacuerdo fuerte ni acuerdo. Usa el estado `missing` en la comparación (no lo trates como `disagree`). Si penalizas missing como desacuerdo, inflas non-matches espurios cuando una fuente simplemente no trae el campo.",
        "La ausencia puede ser **informativa**: ciertas fuentes nunca publican teléfono. Modela el patrón por fuente (`source_system`), no asumas MCAR (aleatorio completo) sin evidencia. En el scorer, un `missing` suele contribuir 0 al peso de ese campo en lugar de empujar hacia non_match.",
        "**Frecuencia**: valores muy comunes (nombre “María”, dominio genérico) bajan el peso de un acuerdo exacto — intuición de u-probability alta en FS. Aquí usamos `base/frecuencia` como **heurística didáctica**, no como estimación m/u completa. En contactos Lima sintéticos, un acuerdo en “María” pesa menos que en un apellido raro.",
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
      heading: "reglas y candidate recall",
      subtopicId: "S30-T2-A",
      paragraphs: [
        "**Blocking** reduce el espacio de pares: solo comparas registros que comparten una clave (apellido normalizado + prefijo de ciudad, local-part de email, últimos dígitos de teléfono, etc.). Sin blocking, all-pairs es O(n²) e inviable a escala.",
        "**Candidate recall**: de los pares verdaderamente match en el gold sintético, ¿qué fracción pasó el blocking? Si el recall de candidatos es bajo, el scorer nunca ve el match — y ninguna métrica posterior lo salva. Mide con etiquetas sintéticas **antes** de “optimizar” CPU.",
        "Reglas en **unión (OR)** suben candidate recall; **intersección (AND)** reduce candidatos pero puede matar recall de gold matches. En el demo de abajo el recall es **0.0 a propósito**: `López` y `lopez` generan claves distintas sin plegado de acentos. Primero normaliza (casefold + fold de tildes); luego mide.",
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
          "Aquí el recall es 0.0 a propósito: `López` vs `lopez` no comparten clave sin plegado de acentos. Primero normaliza; luego mide candidate recall con gold sintético.",
      },
    },
    {
      heading: "combinaciones, costo y pares imposibles",
      subtopicId: "S30-T2-B",
      paragraphs: [
        "El **costo** de comparación es O(suma n_b·(n_b−1)/2) por bloque. Una clave débil (solo ciudad “Lima”) mete decenas de miles de registros en un bloque y explota CPU/memoria. Monitorea tamaño máximo de bloque como SLO de diseño y redefine la clave antes de escalar el batch nocturno.",
        "**Pares imposibles**: reglas de exclusión (tipo persona vs organización, fechas de nacimiento incompatibles en el fixture sintético) evitan gastar scorer en lo incomparable. El filtro corre **antes** del scorer pesado: política `filter_before_score`, no un post-filtro cosmético.",
        "Pipeline sano: blocking → filtro de imposibles → scorer → umbrales. Si inviertes el orden, pagas similitudes caras (edit distance, token sets) que nunca debieron calcularse. En `CASO-LIM-030`, person vs org se descarta sin invocar edit distance ni saturar la cola clerical.",
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
          "Una clave demasiado gruesa puede generar miles de millones de pares. Monitorea tamaño de bloque y redefine la clave antes de escalar.",
      },
    },
    {
      heading: "pesos, probabilidad didáctica y umbrales",
      subtopicId: "S30-T3-A",
      paragraphs: [
        "Modelo **didáctico** de esta sección: `score = suma(sim·peso) / suma(pesos)` sobre similitudes en [0,1]. El modelo Fellegi–Sunter completo usa prior λ y pesos log₂(m/u) por acuerdo/desacuerdo; aquí priorizamos intuición operativa y umbrales duales. No digas “sé FS” solo por haber promediado pesos.",
        "**Umbrales**: `auto_match` si score ≥ t_high; `non_match` si score ≤ t_low; en medio → **review** (cola clerical). Nunca `auto_fraud`. t_high alto reduce falsos positivos que molestan a operaciones; el resto va a humanos con explicación por campo.",
        "Estima pesos con frecuencias o a mano **documentado**; valida en gold sintético (T4) sin leakage de entidad. Un score 0.875 con phone en 0.0 debe aterrizar en review, no en auto_match ciego.",
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
      heading: "entrenamiento, clerical review y consistencia de cluster",
      subtopicId: "S30-T3-B",
      paragraphs: [
        "**Estimación**: ajusta pesos o umbrales con pares etiquetados **sintéticos** (sin PII real). El “entrenamiento” aquí es calibración supervisada de un scorer interpretable, no un black-box que invente labels de riesgo o parentesco.",
        "**Clerical review**: cada ítem de cola lleva score, explicación por campo y acciones `match` / `non_match` / `uncertain` más actor y timestamp. El espacio de labels de ER **no incluye** `fraud`: eso es otra tarea del path de investigación y se filtra en el borde del sistema.",
        "**Consistencia de cluster**: si A=B y B=C entonces A=C en la misma entidad. Resuelve uniones con Union-Find y revisa contradicciones (A=B, B≠C, A=C) antes de exportar nodos a S31. En el demo, un approve clerical de e3–e4 cierra el cluster e1…e4 de forma transitiva.",
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
        "El **benchmark etiquetado** tiene pares match/non-match **sintéticos**. Nunca uses el mismo par (ni la misma entidad) en train y test de umbrales sin control: eso es **leakage de identidad** e infla métricas del motor de forma engañosa.",
        "**Split por entidad**: si una entidad aparece en train, sus pares no deben filtrar a test. Un split aleatorio de pares con entidades compartidas es el error clásico que “mejora” el F1 en el notebook y falla cuando llegan contactos nuevos en producción.",
        "Documenta tamaños de split y prevalencia de matches (suele ser baja: pocos matches reales entre muchos non-matches). En `CASO-LIM-030`, reporta match rate del gold junto al candidate recall del blocking y a P/R en el hold-out de entidades.",
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
        "**Pairwise**: precisión, recall y F1 sobre pares predichos vs gold. Un F1 pairwise alto puede esconder clusters partidos o fusionados de más. Por eso reportas también una vista de **cluster**.",
        "**Cluster (simplificado didáctico)**: *pair completeness* ≈ fracción de pares gold del mismo cluster que el sistema unió; *pair quality* ≈ precisión de las uniones predichas a nivel de pares del cluster. No implementamos toda la literatura de clustering metrics: implementas pairwise completo + un indicador de completitud de cluster sobre el Union-Find.",
        "**Error slices**: corta errores por fuente, apellido frecuente, missing phone, ciudad. Encuentra fallas sistemáticas sin convertir un error de matching en acusación de fraude. El índice de error del demo es la semilla de un slice (`missing_phone`, `common_last_name`, …).",
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
    # fracción de pares gold (match) que el cluster predicho mantiene unidos
    if not gold_pairs:
        return 0.0
    ok = sum(1 for a, b in gold_pairs if predicted_same(a, b))
    return ok / len(gold_pairs)

y_true = [1, 1, 0, 0, 1]
y_pred = [1, 0, 0, 1, 1]
p, r, f = prf(y_true, y_pred)
errors = [i for i, (t, pr) in enumerate(zip(y_true, y_pred)) if t != pr]
# cluster sintético: e1-e2 unidos; gold match e1-e3 partido
gold_pairs = [("e1", "e2"), ("e1", "e3")]
clusters = {"e1": "c0", "e2": "c0", "e3": "c1"}
pc = pair_completeness(gold_pairs, lambda a, b: clusters[a] == clusters[b])
print("precision", round(p, 3))
print("recall", round(r, 3))
print("f1", round(f, 3))
print("error_idx", errors)
print("pair_completeness", pc)`,
        output: `precision 0.667
recall 0.667
f1 0.667
error_idx [1, 3]
pair_completeness 0.5`,
      },
      callout: {
        type: "tip",
        title: "Pairwise vs cluster",
        content:
          "Un cluster partido en dos castiga recall pairwise y pair completeness; reporta ambas vistas en el README del portfolio.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el cierre de CP-N3-A: comparadores, blocking con recall, pesos y umbrales, review/clusters y métricas pairwise con split por entidad — sin inferir fraude.",
    steps: [
      {
        demoId: "S30-T1-A-DEMO",
        subtopicId: "S30-T1-A",
        environment: "local-python",
        description: "Compara exact (post-normalización), token Jaccard y deja listo el hábito de casefold.",
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

print(exact("A@example.pe", "a@example.pe"), round(jac("Ana Lopez", "Lopez Ana"), 2))
print("comparators", "exact+token")`,
          output: `1.0 1.0
comparators exact+token`,
        },
        why: "Comparadores base del motor ER con normalización explícita.",
      },
      {
        demoId: "S30-T1-B-DEMO",
        subtopicId: "S30-T1-B",
        environment: "local-python",
        description: "Clasifica missing vs agree y baja peso por frecuencia de 'maría'.",
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
        why: "Missing y frecuencia calibran acuerdos sin tratar vacío como desacuerdo.",
      },
      {
        demoId: "S30-T2-A-DEMO",
        subtopicId: "S30-T2-A",
        environment: "local-python",
        description: "Blocking por apellido|ciudad y candidate recall sobre gold sintético.",
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
        why: "Candidate recall se calcula sobre gold, no se imprime a mano.",
      },
      {
        demoId: "S30-T2-B-DEMO",
        subtopicId: "S30-T2-B",
        environment: "local-python",
        description: "Costo de bloques y filtro de pares imposibles person/org.",
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
        why: "Control de costo y exclusión de pares imposibles antes del scorer.",
      },
      {
        demoId: "S30-T3-A-DEMO",
        subtopicId: "S30-T3-A",
        environment: "local-python",
        description: "Score ponderado y decisión auto/review/non con umbrales.",
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
        why: "Umbrales duales separan auto_match de la cola humana.",
      },
      {
        demoId: "S30-T3-B-DEMO",
        subtopicId: "S30-T3-B",
        environment: "local-python",
        description: "Union-Find cluster tras auto-match y un clerical approve.",
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
union("e3", "e4")  # clerical approve
print(find("e1") == find("e4"), "review_applied")`,
          output: `True review_applied`,
        },
        why: "Clusters transitivos + efecto de un approve clerical.",
      },
      {
        demoId: "S30-T4-A-DEMO",
        subtopicId: "S30-T4-A",
        environment: "local-python",
        description: "Split por entidad: train solo con {e1,e2,e3}.",
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
        why: "Evita leakage de identidad en evaluación de umbrales.",
      },
      {
        demoId: "S30-T4-B-DEMO",
        subtopicId: "S30-T4-B",
        environment: "local-python",
        description: "Precision/recall pairwise e índices de error para slices.",
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

p, r, err = pr_metrics([1, 1, 0, 0], [1, 0, 0, 0])
print(p, r, err)`,
          output: `1.0 0.5 [1]`,
        },
        why: "Métricas honestas más índices de error para construir slices.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de comparadores, missing/frecuencia, blocking, costo, matching, review y evaluación. Cada starter tiene un error deliberado; corrígelo hasta que la salida coincida con la esperada. Solo datos sintéticos; no etiquetes fraude ni parentesco.",
    steps: [
      {
        id: "S30-T1-A-E1",
        subtopicId: "S30-T1-A",
        kind: "guided",
        instruction:
          "S30-T1-A-E1 · Comparador exacto **post-normalización**: con `a = '  Ana  '` y `b = 'ana'`, colapsa espacios y aplica `casefold` antes de comparar; imprime `1.0` si coinciden y `0.0` si no. El starter compara crudo (`a == b`) y falla. Caso sintético `CASO-LIM-030`. Salida esperada: una sola línea `1.0`.",
        hint: "normalize = ' '.join(s.casefold().split())",
        hints: [
          "No compares a y b crudos: hay espacios y mayúsculas",
          "Tras normalizar, ambos deben ser 'ana'",
        ],
        edgeCases: ["doble espacio interno", "emails con distinta capitalización"],
        tests: "salida coincide con solution output",
        feedback: "Exact en ER es igualdad tras normalizar; sin casefold+espacios pierdes matches obvios.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · exact post-normalización
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
        instruction:
          "S30-T1-A-E2 · Jaccard de tokens: para `'a b'` y `'b c'`, imprime |intersección|/|unión| (≈ 0.333…). El starter divide solo por |ta|. Caso `CASO-LIM-030`. Una sola línea de salida.",
        hint: "Unión = ta | tb",
        hints: [
          "len(ta & tb) / len(ta | tb)",
          "No uses solo el tamaño de ta",
        ],
        edgeCases: ["orden de tokens no debe importar"],
        tests: "salida coincide con solution output",
        feedback: "Jaccard usa la unión; si divides solo por un conjunto, sesgas el score.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · Jaccard tokens
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
        instruction:
          "S30-T1-A-E3 · Transferencia date_sim: implementa tolerancia de 3 días. Para date(2026,1,1) y date(2026,1,3) imprime 0.5 (dentro de tolerancia, no exacto). El starter devuelve 0.0 siempre que no sea el mismo día. Caso `CASO-LIM-030`.",
        hint: "abs(delta.days) <= 3 → 0.5",
        hints: [
          "delta = abs((d1 - d2).days)",
          "0 → 1.0; 1..3 → 0.5; else → 0.0",
        ],
        edgeCases: ["mismo día = 1.0", "4 días = 0.0"],
        tests: "salida coincide con solution output",
        feedback: "Fechas cercanas no son desacuerdo total; la tolerancia evita falsos non_match.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · date_sim con tolerancia
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
        instruction:
          "S30-T1-B-E1 · Missingness: si `a` o `b` están vacíos, imprime `missing`; si no, `cmp`. El starter invierte las etiquetas (trata el vacío como `cmp`). Caso sintético `CASO-LIM-030` con a='', b='x'. Una sola línea de salida.",
        hint: "not a or not b → missing",
        hints: [
          "Vacío se detecta con not a / not b",
          "No trates missing como cmp",
        ],
        edgeCases: ["None en el motor real"],
        tests: "salida coincide con solution output",
        feedback: "Missing es un estado de comparación, no un desacuerdo disfrazado.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · missing si vacío
# Error: etiquetas invertidas
a, b = "", "x"
print("cmp" if (not a or not b) else "missing")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a, b = "", "x"
print("missing" if (not a or not b) else "cmp")`,
          output: `missing`,
        },
      },
      {
        id: "S30-T1-B-E2",
        subtopicId: "S30-T1-B",
        kind: "independent",
        instruction:
          "S30-T1-B-E2 · Peso por rareza (heurística didáctica): con `freq_table = {'maría': 50, 'ximena': 2}` y `base=1.0`, imprime en una línea el peso de acuerdo para «María» y para «Ximena» (redondeados a 3 decimales). Fórmula: `base / frecuencia`. El starter multiplica en vez de dividir. Caso `CASO-LIM-030`.",
        hint: "base / freq_table.get(value.casefold(), 1)",
        hints: [
          "Más frecuente → menos peso de acuerdo",
          "casefold del valor antes de buscar en la tabla",
        ],
        edgeCases: ["suavizado Laplace en prod", "valor ausente → freq=1"],
        tests: "salida coincide con solution output",
        feedback: "Acuerdos en valores comunes aportan menos evidencia de identidad que un apellido raro.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · peso base/frecuencia
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
        instruction:
          "S30-T1-B-E3 · Transferencia: la fuente `crm_legacy` nunca trae phone. Dado un dict de cobertura por fuente, imprime `informative_missing` si phone_coverage es 0.0; si no, `mcar_candidate`. El starter ignora la cobertura. Caso `CASO-LIM-030`.",
        hint: "coverage['crm_legacy']['phone'] == 0.0",
        hints: [
          "Missing informativo depende de la fuente",
          "No asumas MCAR sin mirar cobertura",
        ],
        edgeCases: ["otra fuente con phone_coverage > 0"],
        tests: "salida coincide con solution output",
        feedback: "Missing informativo se modela por fuente; no se rellena como agree.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · missing informativo por fuente
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
        instruction:
          "S30-T2-A-E1 · Blocking: construye la clave `last|city` para last='lopez' y city='lima'. El starter concatena sin separador `|`. Caso `CASO-LIM-030`. Salida esperada: una línea `lopez|lima` (en el motor real normalizas antes de armar la clave).",
        hint: "f'{last}|{city}'",
        hints: [
          "El pipe separa componentes de la clave",
          "Normaliza en el motor real antes de armar la clave",
        ],
        edgeCases: ["casefold + fold de acentos"],
        tests: "salida coincide con solution output",
        feedback: "La clave de blocking debe ser estable y legible para depurar buckets.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · block key last|city
# Error: falta el separador |
last, city = "lopez", "lima"
print(f"{last}{city}")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `last, city = "lopez", "lima"
print(f"{last}|{city}")`,
          output: `lopez|lima`,
        },
      },
      {
        id: "S30-T2-A-E2",
        subtopicId: "S30-T2-A",
        kind: "independent",
        instruction:
          "S30-T2-A-E2 · Candidate recall de blocking: dados `gold` (pares match reales) y `candidates` (pares que pasó el blocking), imprime `len(gold & candidates) / len(gold)`. El starter usa unión (`|`) en el numerador y sobreestima el recall. Caso `CASO-LIM-030`. Recall bajo = matches que el scorer nunca ve.",
        hint: "len(gold & candidates) / len(gold)",
        hints: [
          "Intersección: solo gold matches que también son candidatos",
          "Denominador = tamaño de gold, no de candidates",
        ],
        edgeCases: ["unión OR de reglas sube el tamaño de candidates"],
        tests: "salida coincide con solution output",
        feedback: "Candidate recall bajo significa matches invisibles para el scorer — ningún umbral posterior los recupera.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · candidate recall sobre conjuntos
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
        instruction:
          "S30-T2-A-E3 · Transferencia: en un bloque de n=4 registros, el número de pares candidatos es C(4,2)=n*(n-1)//2. El starter usa n*n (incluye auto-pares). Imprime 6. Caso `CASO-LIM-030`.",
        hint: "n * (n - 1) // 2",
        hints: [
          "No cuentes el par (i,i)",
          "Suma esto por cada bloque en el motor real",
        ],
        edgeCases: ["múltiples bloques se suman"],
        tests: "salida coincide con solution output",
        feedback: "El costo all-pairs del bloque es la base del SLO de blocking.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · pares en un bloque
# Error: n*n incluye auto-pares
n = 4
print(n * n)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `n = 4
print(n * (n - 1) // 2)`,
          output: `6`,
        },
      },
      {
        id: "S30-T2-B-E1",
        subtopicId: "S30-T2-B",
        kind: "guided",
        instruction:
          "S30-T2-B-E1 · Costo multi-bloque: para tamaños [3,5] imprime C(3,2)+C(5,2)=3+10=13. El starter suma tamaños (`sum(sizes)`) en vez de pares por bloque. Caso `CASO-LIM-030`. Fórmula: `n*(n-1)//2` por bloque.",
        hint: "sum(n*(n-1)//2 for n in sizes)",
        hints: [
          "Cada bloque aporta n choose 2",
          "No sumes solo los tamaños",
        ],
        edgeCases: ["monitor max(block size)"],
        tests: "salida coincide con solution output",
        feedback: "El costo global es la suma de costos por bloque, no la suma de tamaños.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · costo multi-bloque
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
        instruction:
          "S30-T2-B-E2 · Filtro de pares imposibles: imprime `True` (saltar scorer) cuando type person ≠ org. El starter imprime igualdad (`==`) y daría False. Caso `CASO-LIM-030`. `True` significa «no gastes similitud en este par».",
        hint: "ta != tb",
        hints: [
          "Impossible = tipos distintos",
          "True significa 'saltar el scorer'",
        ],
        edgeCases: ["fechas incompatibles en el motor real"],
        tests: "salida coincide con solution output",
        feedback: "El filtro de imposibles ahorra CPU y evita scores basura.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · filtro person/org
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
        instruction:
          "S30-T2-B-E3 · Transferencia pipeline: de una lista de pares (dicts con type), cuenta cuántos sobreviven al filtro same-type y luego imprime ese conteo y la política `filter_before_score` en dos líneas. El starter cuenta todos los pares. Caso `CASO-LIM-030`.",
        hint: "kept si a['type']==b['type']",
        hints: [
          "Primero filtra, después score (aquí solo cuentas kept)",
          "Dos líneas: entero y política",
        ],
        edgeCases: ["person-org no entra al scorer"],
        tests: "salida coincide con solution output",
        feedback: "Filter-before-score es una política de pipeline, no un eslogan: se mide en pares kept.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · filter before score
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
        instruction:
          "S30-T3-A-E1 · Score ponderado didáctico: name=1 (w=0.5), email=0.5 (w=0.5) → imprime `0.75`. El starter suma sim·w sin dividir por sum(w). Caso `CASO-LIM-030`. Sin normalizar, t_high pierde significado entre pares.",
        hint: "num / sum(weights)",
        hints: [
          "(1*0.5 + 0.5*0.5) / (0.5+0.5)",
          "Normaliza por la suma de pesos",
        ],
        edgeCases: ["pesos no tienen que sumar 1 si normalizas"],
        tests: "salida coincide con solution output",
        feedback: "Sin normalizar, el umbral t_high pierde significado entre pares.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · score ponderado
# Error: no divide por sum(w)
print(1 * 0.5 + 0.5 * 0.5)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print((1 * 0.5 + 0.5 * 0.5) / (0.5 + 0.5))`,
          output: `0.75`,
        },
      },
      {
        id: "S30-T3-A-E2",
        subtopicId: "S30-T3-A",
        kind: "independent",
        instruction:
          "S30-T3-A-E2 · Umbrales duales: con score=0.7, t_high=0.9, t_low=0.5 imprime `review` (banda gris). El starter siempre imprime `auto_match`. Caso `CASO-LIM-030`. Regla: ≥t_high auto_match; ≤t_low non_match; si no, review.",
        hint: "banda gris entre t_low y t_high",
        hints: [
          "s >= t_high → auto_match",
          "s <= t_low → non_match",
          "else → review",
        ],
        edgeCases: ["calibrar umbrales con gold de T4"],
        tests: "salida coincide con solution output",
        feedback: "La banda gris es diseño: protege operaciones con humanos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · decide auto/review/non
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
        instruction:
          "S30-T3-A-E3 · Transferencia explicabilidad: a partir de sims name=0.9 y email=1.0, imprime el dict de explicación completo `{'name': 0.9, 'email': 1.0}`. El starter omite email. Caso `CASO-LIM-030`.",
        hint: "incluye todos los campos scorados",
        hints: [
          "El revisor necesita ver cada aporte",
          "Dict literal con ambas claves",
        ],
        edgeCases: ["UI clerical lee este dict"],
        tests: "salida coincide con solution output",
        feedback: "Sin explicación por campo, el review no es accionable.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · explain por campo
# Error: omite email
sims = {"name": 0.9, "email": 1.0}
print({"name": sims["name"]})
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `sims = {"name": 0.9, "email": 1.0}
print({"name": sims["name"], "email": sims["email"]})`,
          output: `{'name': 0.9, 'email': 1.0}`,
        },
      },
      {
        id: "S30-T3-B-E1",
        subtopicId: "S30-T3-B",
        kind: "guided",
        instruction:
          "S30-T3-B-E1 · Union-Find de cluster: une 1-2 y 2-3; imprime si `find(1)==find(3)` (debe ser True por transitividad). El starter solo une 1-2 y deja 3 aislado. Caso `CASO-LIM-030`. Una línea booleana.",
        hint: "segunda union(2,3)",
        hints: [
          "find sigue el parent hasta la raíz",
          "union enlaza raíces",
        ],
        edgeCases: ["path compression opcional"],
        tests: "salida coincide con solution output",
        feedback: "La transitividad del cluster es el corazón de la fusión de entidades.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · union-find
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
        instruction:
          "S30-T3-B-E2 · Espacio de labels de la cola clerical: imprime `['match', 'non_match', 'uncertain']`. El starter incluye `fraud` (prohibido en ER). Caso `CASO-LIM-030`.",
        hint: "sin fraud",
        hints: [
          "ER no emite label de fraude",
          "uncertain cubre duda humana",
        ],
        edgeCases: ["actor + timestamp en el ítem real"],
        tests: "salida coincide con solution output",
        feedback: "El label_space define el contrato ético del motor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · label_space clerical
# Error: incluye fraud
print(["match", "non_match", "fraud"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(["match", "non_match", "uncertain"])`,
          output: `['match', 'non_match', 'uncertain']`,
        },
      },
      {
        id: "S30-T3-B-E3",
        subtopicId: "S30-T3-B",
        kind: "transfer",
        instruction:
          "S30-T3-B-E3 · Transferencia de alcance: dada una propuesta de labels, filtra solo los permitidos para ER (`match`, `non_match`, `uncertain`) y imprime la lista filtrada en ese orden. El starter deja pasar `fraud` y `kinship`. Caso `CASO-LIM-030`.",
        hint: "allowed = {...}; list comprehension",
        hints: [
          "Recorre proposed y quédate con allowed",
          "Orden de aparición en proposed",
        ],
        edgeCases: ["kinship y fraud fuera de ER"],
        tests: "salida coincide con solution output",
        feedback: "El motor ER solo decide misma entidad; filtra labels ajenos en el borde del sistema.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · alcance de ER
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
        instruction:
          "S30-T4-A-E1 · Si {a,b} ⊆ train_e imprime `train`, si no `test`. Para a,b=e1,e2 y train_e={e1,e2,e3} debe ser train. El starter invierte la lógica. Caso `CASO-LIM-030`.",
        hint: "{a,b} <= train_e",
        hints: [
          "Subset de entidades → train",
          "Cualquier entidad fuera → test",
        ],
        edgeCases: ["par mixto train/test se va a test"],
        tests: "salida coincide con solution output",
        feedback: "El split por entidad es la guardia anti-leakage.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · entity split
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
        instruction:
          "S30-T4-A-E2 · Prevalencia (base rate) de matches en el gold: 1 match de 5 pares → `0.2`. El starter invierte n/matches. Caso `CASO-LIM-030`. Documenta prevalencia junto a P/R: accuracy alto engaña con rareza de matches.",
        hint: "matches / n",
        hints: [
          "Base rate suele ser baja",
          "Documenta prevalencia junto a P/R",
        ],
        edgeCases: ["desbalance extremo"],
        tests: "salida coincide con solution output",
        feedback: "Sin base rate, un accuracy alto engaña en ER.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · match rate
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
        instruction:
          "S30-T4-A-E3 · Transferencia anti-leakage: clasifica tres pares con train_e={e1,e2,e3}. Imprime la lista de splits en el mismo orden (train/test). El starter usa split aleatorio simulado (todo test). Caso `CASO-LIM-030`.",
        hint: "train si ambos extremos ⊆ train_e",
        hints: [
          "('e1','e2') → train",
          "('e4','e5') → test",
          "('e1','e4') → test (spill)",
        ],
        edgeCases: ["pares mixtos no van a train"],
        tests: "salida coincide con solution output",
        feedback: "Entity split se aplica par a par con la regla de subconjunto de entidades.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · entity_split sobre varios pares
# Error: "random" manda todo a test
pairs = [("e1", "e2"), ("e4", "e5"), ("e1", "e4")]
train_e = {"e1", "e2", "e3"}
print(["test", "test", "test"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pairs = [("e1", "e2"), ("e4", "e5"), ("e1", "e4")]
train_e = {"e1", "e2", "e3"}
print(["train" if {a, b} <= train_e else "test" for a, b in pairs])`,
          output: `['train', 'test', 'test']`,
        },
      },
      {
        id: "S30-T4-B-E1",
        subtopicId: "S30-T4-B",
        kind: "guided",
        instruction:
          "S30-T4-B-E1 · Precisión pairwise: con tp=2, fp=1 imprime `round(tp/(tp+fp), 2)` → `0.67`. El starter ignora fp y divide solo por tp. Caso `CASO-LIM-030`. La precisión castiga falsos positivos de auto_match.",
        hint: "tp / (tp + fp)",
        hints: [
          "round(..., 2)",
          "fp en el denominador",
        ],
        edgeCases: ["tp+fp=0 → 0.0 en el motor real"],
        tests: "salida coincide con solution output",
        feedback: "Precisión castiga falsos positivos de auto_match.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · precision
# Error: ignora fp
tp, fp = 2, 1
print(round(tp / tp, 2))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tp, fp = 2, 1
print(round(tp / (tp + fp), 2))`,
          output: `0.67`,
        },
      },
      {
        id: "S30-T4-B-E2",
        subtopicId: "S30-T4-B",
        kind: "independent",
        instruction:
          "S30-T4-B-E2 · Recall pairwise: con tp=2, fn=2 imprime `tp/(tp+fn)` → `0.5`. El starter usa `(tp+fn)/(tp+fn)` (=1.0 siempre). Caso `CASO-LIM-030`. Recall bajo suele señalar blocking incompleto o umbral agresivo.",
        hint: "tp / (tp + fn)",
        hints: [
          "fn son matches perdidos",
          "Recall bajo → blocking o umbral agresivo",
        ],
        edgeCases: ["F1 es media armónica de P y R"],
        tests: "salida coincide con solution output",
        feedback: "Recall pairwise complementa candidate recall de blocking.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · recall
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
        instruction:
          "S30-T4-B-E3 · Transferencia error slices: tienes pares con flag de slice y si erraron. Imprime la lista de slices cuyo conteo de error es máximo (aquí solo `missing_phone`). El starter devuelve lista vacía. Caso `CASO-LIM-030` — los errores son de matching, no de fraude.",
        hint: "agrupa errores por slice y toma el max",
        hints: [
          "Cuenta por clave de slice",
          "Devuelve las claves con conteo máximo",
        ],
        edgeCases: ["empates: lista con varios slices"],
        tests: "salida coincide con solution output",
        feedback: "Los slices convierten índices de error en hipótesis de mejora del motor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · error slices
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
      "Implementa el motor ER sintético de cierre de **CP-N3-A**: comparadores explicables, blocking con candidate recall medido, scorer con umbrales auto_match/review/non_match, cola clerical, clusters (Union-Find) y evaluación pairwise con split por entidad y error slices. Solo benchmark sintético (`CASO-LIM-030`). ER responde «¿misma entidad?»; no infiere relación ni riesgo/fraude.",
    objectives: [
      "Comparadores exact/edit/token/fecha + missing/frecuencia",
      "Blocking medido (candidate recall) y control de costo/imposibles",
      "Pesos didácticos, thresholds, review y consistencia de cluster",
      "Gold sintético, split por entidad, P/R/F1, pair completeness y slices",
      "Suite ejecutable alineada a contratos de tests (S27), propiedades (S28) y almacén SQL (S29)",
    ],
    requirements: [
      "Datos sintéticos etiquetados; sin PII real",
      "Candidate recall y métricas reportadas en la demo del portfolio",
      "Explicación por campo en cada ítem de cola de review",
      "Cero labels de fraude/parentesco automáticos",
      "README en español profesional con límites del fixture y umbrales elegidos",
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

def exact(a: str, b: str) -> float:
    return 1.0 if normalize(a) == normalize(b) else 0.0

def token_jaccard(a: str, b: str) -> float:
    ta, tb = set(normalize(a).split()), set(normalize(b).split())
    if not ta and not tb:
        return 1.0
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)

def edit_sim(a: str, b: str) -> float:
    # TODO: Levenshtein normalizado (ver theory T1-A)
    raise NotImplementedError("edit_sim")

def date_sim(d1: date, d2: date, tol_days: int = 3) -> float:
    # TODO: 1.0 / 0.5 / 0.0 según tolerancia
    raise NotImplementedError("date_sim")

def compare_field(a: Any, b: Any) -> str:
    # TODO: missing | agree | disagree
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
    den = sum(weights.values())
    if not den:
        return 0.0
    return sum(sims[k] * weights[k] for k in weights) / den

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
    # TODO: train si ambas entidades ⊆ train_entities
    raise NotImplementedError("entity_split")

def prf(y_true: list, y_pred: list) -> tuple:
    # TODO: precision, recall, f1
    raise NotImplementedError("prf")

def error_slices(rows: list) -> list:
    # TODO: slices con más errores
    raise NotImplementedError("error_slices")

# 3 tests mínimos sugeridos (pytest):
# 1) exact post-normalize
# 2) candidate_recall con gold y buckets
# 3) decide banda gris → review

if __name__ == "__main__":
    print(decide(0.95), block_key({"name": "Ana López", "city": "Lima"}))
`,
    portfolioNote:
      "Cierre CP-N3-A: documenta en el README del repo el candidate recall, P/R (y pair completeness si aplica) en el split por entidad, umbrales elegidos y un ejemplo de ítem de cola clerical con explicación por campo. Solo datos sintéticos.",
    rubric: [
      { criterion: "Motor completo: comparadores, blocking medido, umbrales, review y métricas", weight: "25%" },
      { criterion: "Correctitud técnica y demos ejecutables en el entorno declarado", weight: "20%" },
      { criterion: "Privacidad: sin PII real, sin secretos, sin inferencia de fraude/parentesco", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (mín. 3 tests importables)", weight: "15%" },
      { criterion: "Código legible y límites del fixture claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Candidate recall + P/R reportados y split por entidad sin leakage", weight: "recomendado" },
      { criterion: "ER solo misma entidad (sin fraude/relación)", weight: "ético" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El motor ER de CP-N3-A debe decidir:",
        options: [
          "Fraude automático",
          "Si dos registros son la misma entidad",
          "Parentescos",
          "Riesgo crediticio",
        ],
        correctIndex: 1,
        explanation:
          "Entity resolution solo decide si dos registros apuntan a la misma entidad del mundo real. Parentesco, colusión o fraude son tareas distintas (más adelante en el path de investigación).",
      },
      {
        question: "Candidate recall de blocking mide:",
        options: [
          "Solo CPU",
          "Precisión del scorer final únicamente",
          "Tamaño del disco",
          "Fracción de verdaderos matches que sobreviven al blocking",
        ],
        correctIndex: 3,
        explanation:
          "De los pares gold que son match, ¿cuántos quedaron como candidatos tras el blocking? Si el recall de candidatos es bajo, el scorer nunca ve el match.",
      },
      {
        question: "Un campo vacío en la comparación de un par debe tratarse como:",
        options: [
          "disagree fuerte (empuja a non_match)",
          "estado `missing` (ni agree ni disagree)",
          "agree exacto por defecto",
          "auto_match si el otro campo está lleno",
        ],
        correctIndex: 1,
        explanation:
          "Missing ≠ disagree. Si penalizas el vacío como desacuerdo, inflas non-matches espurios cuando una fuente simplemente no publica el campo. En el scorer, missing suele aportar 0 al peso de ese campo.",
      },
      {
        question: "Reglas de blocking en unión (OR) vs intersección (AND):",
        options: [
          "OR baja candidate recall; AND siempre lo sube",
          "OR suele subir candidate recall; AND reduce candidatos y puede matar recall de gold matches",
          "OR y AND producen el mismo conjunto de candidatos",
          "AND es obligatorio antes de medir candidate recall",
        ],
        correctIndex: 1,
        explanation:
          "OR (unión de claves) deja pasar más pares verdaderos match al scorer. AND (intersección) recorta candidatos y CPU, pero si es demasiado estricta el gold match nunca llega al scorer. Siempre mide candidate recall con gold sintético.",
      },
      {
        question: "Scores entre t_low y t_high van a:",
        options: ["clerical review", "auto_match", "non_match", "borrado"],
        correctIndex: 0,
        explanation:
          "La banda gris se envía a revisión humana con explicación por campo. auto_match exige score ≥ t_high; non_match exige score ≤ t_low. Nunca auto_fraud.",
      },
      {
        question: "Split por entidad evita:",
        options: [
          "Usar sqlite",
          "Blocking",
          "Leakage de identidad entre train y test",
          "Review",
        ],
        correctIndex: 2,
        explanation:
          "Si la misma entidad aparece en train y test, las métricas se inflan. El split debe respetar conjuntos de entidades disjuntos (o controlados).",
      },
      {
        question: "Un score alto de match en ER sintético implica…",
        options: [
          "fraude o parentesco probado automáticamente",
          "prioridad de revisión / enlace de entidad candidato, no veredicto legal",
          "bloquear el schema_migrations",
          "omitir blocking y comparar all-pairs siempre",
        ],
        correctIndex: 1,
        explanation:
          "ER propone misma entidad con evidencia; el espacio de labels es match / non_match / uncertain. Nunca emite fraud automático ni sustituye investigación.",
      },
      {
        question: "Los pares imposibles (p. ej. person vs org) deben filtrarse:",
        options: [
          "Después del scorer, solo para maquillar métricas",
          "Antes del scorer (filter_before_score), para no gastar CPU en lo incomparable",
          "Solo en la cola clerical, nunca en el pipeline batch",
          "Nunca: todo par debe recibir un score de similitud",
        ],
        correctIndex: 1,
        explanation:
          "El filtro de imposibles corre antes del scorer pesado. Si inviertes el orden, pagas edit distance y token sets en pares que la política ya descartaría. En el portfolio documenta la política `filter_before_score`.",
      },
      {
        question: "Pair completeness de cluster (vista simplificada) mide:",
        options: [
          "Solo la precisión pairwise del scorer",
          "La fracción de pares gold match que el sistema mantiene en el mismo cluster",
          "El tamaño máximo de bloque de blocking",
          "El número de ítems en la cola clerical",
        ],
        correctIndex: 1,
        explanation:
          "Un F1 pairwise alto puede esconder clusters partidos. Pair completeness pregunta: de los pares gold que deberían estar juntos, ¿cuántos quedaron unidos tras Union-Find? Reporta pairwise y cluster en el README.",
      },
    ],
  },
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
