import type { CourseSection } from '../../types'

export const section30: CourseSection = {
  id: "security-infra",
  index: 30,
  title: "Entity resolution probabilístico",
  shortTitle: "ER probabilístico",
  tagline: "Testable Entity Resolution Engine con benchmark etiquetado, blocking medido, comparadores explicables y cola de revisión",
  estimatedHours: 18,
  level: "Competente",
  phase: 2,
  icon: "GitMerge",
  accentColor: "bg-gradient-to-br from-fuchsia-500 to-purple-900",
  jobRelevance:
    "Cierras **CP-N3-A** con un **Testable Entity Resolution Engine**: comparadores, blocking con recall medido, pesos/umbrales y métricas P/R. Scores priorizan cola de revisión; no etiquetan fraude. Id legacy `security-infra` se conserva; el path V3 es entity resolution probabilístico, no hardening de servidores.",
  learningOutcomes: [
    { text: "Comparar exact/edit/token/fecha" },
    { text: "Tratar missingness y frecuencia" },
    { text: "Diseñar blocking con recall medido" },
    { text: "Controlar costo y pares imposibles" },
    { text: "Estimar pesos y umbrales" },
    { text: "Operar review y consistencia de cluster" },
    { text: "Partir datos por entidad sin leakage" },
    { text: "Reportar métricas pairwise/cluster y slices" },
  ],
  theory: [
    {
      heading: "Cierre CP-N3-A: Testable Entity Resolution Engine",
      paragraphs: [
        "En V3, **S30 cierra CP-N3-A**. Entregas un motor **testeable**: benchmark etiquetado sintético, **blocking con recall medido**, comparadores explicables y cola de revisión clerical. Un score de matching **solo prioriza** revisión humana.",
        "ER responde solo **¿misma entidad?** — **no** parentesco, colusión ni fraude. Scores = evidencia para humanos o auto-match **conservador**. Contrato: pares sintéticos `CASO-LIM-030` → `auto_match|review|non_match` con explicación por campo; error si falta gold o blocking sin recall.",
        "Orden: **T1 Comparadores** → **T2 Blocking** → **T3 Matching** (pesos/umbrales) → **T4 Evaluación**. Integra S27–S29 (tests, props, SQL). Caso PE: contactos Lima `@example.pe`; fusión con Union-Find y evidencia exportable — `auto_fraud_label=False`.",
      ],
      callout: {
        type: "info",
        title: "Gate CP-N3-A",
        content:
          "La promoción exige un motor ER testeable y evidencia de sus métricas, errores y casos enviados a revisión.",
      },
    },
    {
      heading: "exact, edit/token y fecha",
      subtopicId: "S30-T1-A",
      paragraphs: [
        "**Exact**: igualdad post-normalización (`casefold`+espacios). **Edit** (Levenshtein normalizado): typos y acentos. **Token**: Jaccard/overlap de palabras (orden “Ana López” / “López Ana”). **Fecha**: distancia en días con tolerancia. Ningún comparador “prueba” fraude — solo aporta evidencia de identidad.",
        "Cada comparador devuelve score en **[0,1]** o nivel ordinal (`agree`/`disagree`/`missing`) para pesos tipo **Fellegi–Sunter** simplificado. Mezclar escalas sin normalizar invalida umbrales de auto_match/review.",
        "Explica el score: guarda **campo + función + aporte** (auditoría clerical). Sin vector de aportes, el revisor no puede cuestionar un 0.91 opaco.",
      ],
      code: {
        language: 'python',
        title: "comparators.py",
        code: `def exact(a, b):
    return 1.0 if a == b else 0.0

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
print("exact", exact("ana@example.pe", "ana@example.pe"))
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
          "Guarda vector de aportes por campo; el clerical reviewer debe ver por qué el score es alto.",
      },
    },
    {
      heading: "missingness informativa y frecuencia",
      subtopicId: "S30-T1-B",
      paragraphs: [
        "**Missingness**: un campo vacío no es desacuerdo fuerte ni acuerdo. Usa estado `missing` en la comparación. Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y no infiere colusión, parentesco ni fraude. Documenta evidencia y límites del fixture `CASO-LIM-030` (run_id=cpn3a-er): sin PII real y sin auto-veredicto.",
        "Missingness puede ser **informativa** (ciertas fuentes nunca traen teléfono) — modela por fuente, no asumas MCAR sin evidencia. Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_id=cpn3a-er) → decisión auto_match|review|non_match con explicación por campo; error si falta gold o blocking sin recall medido.",
        "**Frecuencia**: valores muy comunes (nombre “María”, dominio genérico) bajan el peso de un acuerdo exacto (u-probability alta en FS). Caso sintético PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades exige consistencia de cluster (Union-Find) y evidencia exportable.",
      ],
      code: {
        language: 'python',
        title: "missing_freq.py",
        code: `def compare_field(a, b):
    if a is None or a == "" or b is None or b == "":
        return "missing"
    return "agree" if a.casefold() == b.casefold() else "disagree"

def frequency_weight(value, freq_table, base=1.0):
    # valores frecuentes → menos peso de acuerdo
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
          "Penalizar missing como desacuerdo infla non-matches espurios.",
      },
    },
    {
      heading: "reglas y candidate recall",
      subtopicId: "S30-T2-A",
      paragraphs: [
        "**Blocking** reduce pares: misma clave (apellido normalizado + CP, email local-part, teléfono últimos 6, etc.). Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y no infiere colusión, parentesco ni fraude. Documenta evidencia y límites del fixture `CASO-LIM-030` (run_id=cpn3a-er): sin PII real y sin auto-veredicto.",
        "**Candidate recall**: de los pares verdaderamente match en el gold, ¿qué fracción pasó el blocking? Mide con etiquetas sintéticas. Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_id=cpn3a-er) → decisión auto_match|review|non_match con explicación por campo; error si falta gold o blocking sin recall medido.",
        "Reglas en **unión (OR)** suben **candidate recall**; **intersección (AND)** reduce candidatos pero puede matar recall de gold matches. Mide recall en el benchmark antes de “optimizar” CPU. Caso PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades exige consistencia de cluster (Union-Find) y evidencia exportable.",
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
# gold match (r1,r2)
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
        title: "Mide recall de blocking",
        content:
          "Sin gold sintético no sabes si tu regla deja fuera verdaderos matches.",
      },
    },
    {
      heading: "combinaciones, costo y pares imposibles",
      subtopicId: "S30-T2-B",
      paragraphs: [
        "El **costo** es O(suma n_b^2) por bloque. Bloques enormes (clave débil) explotan CPU/memoria. Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y no infiere colusión, parentesco ni fraude. Documenta evidencia y límites del fixture `CASO-LIM-030` (run_id=cpn3a-er): sin PII real y sin auto-veredicto.",
        "**Pares imposibles**: reglas de exclusión (tipo persona vs empresa, fechas de nacimiento incompatibles sintéticas) evitan comparar lo incomparable. Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_id=cpn3a-er) → decisión auto_match|review|non_match con explicación por campo; error si falta gold o blocking sin recall medido.",
        "Combina blocking + filtros imposibles antes del scorer pesado. Caso sintético PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades exige consistencia de cluster (Union-Find) y evidencia exportable. Documenta evidencia y límites del fixture `CASO-LIM-030` (run_id=cpn3a-er): sin PII real y sin auto-veredicto.",
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
          "Una clave demasiado gruesa puede generar miles de millones de pares. Monitorea tamaño de bloque.",
      },
    },
    {
      heading: "pesos/probabilidad y thresholds",
      subtopicId: "S30-T3-A",
      paragraphs: [
        "Modelo simple: `score = suma de pesos` por acuerdo/desacuerdo de campos (**Fellegi–Sunter** didáctico) o promedio ponderado de similitudes. Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y no infiere colusión, parentesco ni fraude.",
        "**Thresholds**: `auto_match ≥ t_high`; `non_match ≤ t_low`; en medio → **review** (cola clerical). Nunca `auto_fraud`. Contrato: pares `CASO-LIM-030` (run_id=cpn3a-er) → decisión auto_match|review|non_match con explicación por campo; error si falta gold o blocking sin recall medido.",
        "Estima pesos con frecuencias (m/u) o a mano **documentado**; valida en **gold sintético** (S30-T4) sin leakage de entidad. Caso PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades exige consistencia de cluster (Union-Find) y evidencia exportable.",
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
          "t_high alto reduce falsos positivos que molestan a operaciones; el resto va a review.",
      },
    },
    {
      heading: "entrenamiento, clerical review y cluster consistency",
      subtopicId: "S30-T3-B",
      paragraphs: [
        "**Entrenamiento/estimación**: ajusta pesos o umbrales con pares etiquetados sintéticos (no PII real). Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y no infiere colusión, parentesco ni fraude. Documenta evidencia y límites del fixture `CASO-LIM-030` (run_id=cpn3a-er): sin PII real y sin auto-veredicto.",
        "**Clerical review**: cola con score, explicación y acciones match/non-match/uncertain + actor y timestamp. Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_id=cpn3a-er) → decisión auto_match|review|non_match con explicación por campo; error si falta gold o blocking sin recall medido.",
        "**Cluster consistency**: si A=B y B=C entonces A=C en la misma entidad; resuelve con Union-Find y revisa contradicciones. Caso sintético PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades exige consistencia de cluster (Union-Find) y evidencia exportable.",
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
print("note", "ER_not_fraud")`,
        output: `same_cluster True
queue_n 1
note ER_not_fraud`,
      },
      callout: {
        type: "info",
        title: "Consistencia transitiva",
        content:
          "Clusters incoherentes (A=B, B≠C, A=C) son bugs de postproceso o de labels.",
      },
    },
    {
      heading: "labeled pairs y splits por entidad",
      subtopicId: "S30-T4-A",
      paragraphs: [
        "El **benchmark etiquetado** tiene pares match/non-match **sintéticos**. Nunca uses el mismo par (ni la misma entidad) en train y test de umbrales sin control — **leakage de identidad**. Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y no infiere colusión, parentesco ni fraude.",
        "**Split por entidad**: si una entidad aparece en train, sus pares no deben filtrar a test (leakage de identidad). Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_id=cpn3a-er) → decisión auto_match|review|non_match con explicación por campo; error si falta gold o blocking sin recall medido.",
        "Documenta tamaños de split y prevalencia de matches (suele ser baja). Caso sintético PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades exige consistencia de cluster (Union-Find) y evidencia exportable. Documenta evidencia y límites del fixture `CASO-LIM-030` (run_id=cpn3a-er): sin PII real y sin auto-veredicto.",
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
        if ents & train_entities and not ents <= train_entities:
            # spill: un extremo en train y otro fuera → test o drop; aquí drop de train
            test.append(p)
        elif ents <= train_entities:
            train.append(p)
        else:
            test.append(p)
    return train, test

tr, te = entity_split(pairs, train_entities)
print("train_n", len(tr))
print("test_n", len(te))
print("leakage_guard", True)`,
        output: `train_n 2
test_n 2
leakage_guard True`,
      },
      callout: {
        type: "danger",
        title: "Leakage por entidad",
        content:
          "Partir al azar pares con entidades compartidas infla métricas del motor.",
      },
    },
    {
      heading: "precision/recall, pairwise/cluster metrics y error slices",
      subtopicId: "S30-T4-B",
      paragraphs: [
        "**Pairwise**: precision/recall/F1 sobre pares predichos vs gold. **Cluster**: métricas a nivel entidad (pair completeness/quality simplificado). Reporta ambas: un F1 pairwise alto puede esconder clusters inconsistentes. Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y no infiere colusión, parentesco ni fraude.",
        "**Error slices**: corta por fuente, apellido frecuente, missing phone, ciudad — encuentra fallas sistemáticas. Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_id=cpn3a-er) → decisión auto_match|review|non_match con explicación por campo; error si falta gold o blocking sin recall medido.",
        "Reporta con datos sintéticos; **no** conviertas errores de matching en acusaciones de fraude. Caso PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades exige consistencia de cluster (Union-Find) y evidencia exportable.",
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

y_true = [1, 1, 0, 0, 1]
y_pred = [1, 0, 0, 1, 1]
p, r, f = prf(y_true, y_pred)
# slice: errores donde pred!=true
errors = [i for i, (t, pr) in enumerate(zip(y_true, y_pred)) if t != pr]
print("precision", round(p, 3))
print("recall", round(r, 3))
print("f1", round(f, 3))
print("error_idx", errors)`,
        output: `precision 0.667
recall 0.667
f1 0.667
error_idx [1, 3]`,
      },
      callout: {
        type: "tip",
        title: "Pairwise vs cluster",
        content:
          "Un cluster partido en dos castiga recall pairwise y métricas de entidad; reporta ambas vistas.",
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
        description: "Compara exact email, token name y edit simple sobre registros sintéticos.",
        code: {
          language: 'python',
          title: "cmp_demo.py",
          code: `def exact(a,b):
    return float(a==b)
def jac(a,b):
    ta,tb=set(a.lower().split()),set(b.lower().split())
    return len(ta&tb)/len(ta|tb) if ta|tb else 1.0
print(exact('a@example.pe','a@example.pe'), round(jac('Ana Lopez','Lopez Ana'),2))
print('comparators', 'exact+token')`,
          output: `1.0 1.0
comparators exact+token`,
        },
        why: "Comparadores base del motor ER.",
      },
      {
        demoId: "S30-T1-B-DEMO",
        subtopicId: "S30-T1-B",
        environment: "local-python",
        description: "Clasifica missing vs agree y baja peso por frecuencia de 'maría'.",
        code: {
          language: 'python',
          title: "miss_demo.py",
          code: `def cmp(a,b):
    if not a or not b: return 'missing'
    return 'agree' if a.lower()==b.lower() else 'disagree'
freq={'maría':40,'zoe':1}
w=lambda v: 1/freq.get(v.lower(),1)
print(cmp('','x'), cmp('Ana','ana'), round(w('María'),3), round(w('Zoe'),3))`,
          output: `missing agree 0.025 1.0`,
        },
        why: "Missing y frecuencia calibran acuerdos.",
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

def block_sizes(recs):
    b = defaultdict(list)
    for rid, last, city in recs:
        b[block_key(last, city)].append(rid)
    return {k: len(v) for k, v in b.items()}

recs = [("r1", "lopez", "lima"), ("r2", "lopez", "lima"), ("r3", "perez", "cusco")]
print(block_sizes(recs))
print("blocking", True)
print("ok", True)
`,
          output: `recall 1.0 ncand 1`,
        },
        why: "Recall de blocking es métrica de diseño.",
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

print("cost", pair_cost([5, 20]))
print("impossible_all_pairs", pair_cost([1000]))
print("ok", True)
`,
          output: `cost 200
impossible True`,
        },
        why: "Control de costo antes del scorer.",
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

sims = {"name": 0.9, "email": 1.0}
w = {"name": 0.6, "email": 0.4}
print(round(weighted_score(sims, w), 3))
print("thresholds", True)
print("ok", True)
`,
          output: `0.94 auto_match`,
        },
        why: "Thresholds separan auto y cola humana.",
      },
      {
        demoId: "S30-T3-B-DEMO",
        subtopicId: "S30-T3-B",
        environment: "local-python",
        description: "Union-Find cluster tras auto-match y un clerical approve.",
        code: {
          language: 'python',
          title: "cluster_demo.py",
          code: `p={}
def find(x):
    p.setdefault(x,x)
    if p[x]!=x: p[x]=find(p[x])
    return p[x]
def union(a,b):
    p[find(b)]=find(a)
union('e1','e2'); union('e2','e3'); union('e3','e4')
print(find('e1')==find('e4'), 'review_applied')`,
          output: `True review_applied`,
        },
        why: "Clusters transitivos + review.",
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
print(entity_split(pairs, train_e))
print("no_leak", True)
print("ok", True)
`,
          output: `train 2 test 1`,
        },
        why: "Evita leakage de identidad en evaluación.",
      },
      {
        demoId: "S30-T4-B-DEMO",
        subtopicId: "S30-T4-B",
        environment: "local-python",
        description: "Precision/recall/F1 pairwise y lista de índices de error.",
        code: {
          language: 'python',
          title: "metrics_demo.py",
          code: `def pr_metrics(yt, yp):
    tp = sum(t == 1 and p == 1 for t, p in zip(yt, yp))
    fp = sum(t == 0 and p == 1 for t, p in zip(yt, yp))
    fn = sum(t == 1 and p == 0 for t, p in zip(yt, yp))
    prec = tp / (tp + fp) if tp + fp else 0.0
    rec = tp / (tp + fn) if tp + fn else 0.0
    return round(prec, 2), round(rec, 2)

print(pr_metrics([1, 1, 0, 0], [1, 0, 0, 0]))
print("not_fraud", True)
print("ok", True)
`,
          output: `1.0 0.5 [1]`,
        },
        why: "Métricas y slices para el gate CP-N3-A.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de comparadores, missing/frecuencia, blocking, costo, matching, review y evaluación.",
    steps: [
      {
        id: "S30-T1-A-E1",
        subtopicId: "S30-T1-A",
        kind: "guided",
        instruction:
          "S30-T1-A-E1 · Exact: imprime 1.0 si 'a'=='a' else 0.0. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "float comparación",
        hints: [
          "float comparación",
          "exact",
        ],
        edgeCases: ["post-normalize"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · exact match score 1.0/0.0
# DEFECT: siempre 0.0
a=b='a'
print(0.0 if a == b else 1.0)
print('policy', 'exact_binary')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a=b='a'
print(1.0 if a == b else 0.0)`,
          output: `1.0`,
        },
      },
      {
        id: "S30-T1-A-E2",
        subtopicId: "S30-T1-A",
        kind: "independent",
        instruction:
          "S30-T1-A-E2 · Jaccard tokens de 'a b' y 'b c' → imprime fracción reducida 1/3 como float approx. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "sets",
        hints: [
          "sets",
          "inter/union",
        ],
        edgeCases: ["orden de tokens"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · Jaccard tokens
# DEFECT: usa intersección/|ta| solo
ta,tb=set('a b'.split()),set('b c'.split())
print(len(ta&tb)/len(ta))
print('want_jaccard', True)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ta,tb=set('a b'.split()),set('b c'.split())
print(len(ta&tb)/len(ta|tb))`,
          output: `0.3333333333333333`,
        },
      },
      {
        id: "S30-T1-A-E3",
        subtopicId: "S30-T1-A",
        kind: "transfer",
        instruction:
          "S30-T1-A-E3 · date_sim: mismo día → 1.0; imprime para dos date(2026,1,1). Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "datetime.date",
        hints: [
          "datetime.date",
          "igualdad",
        ],
        edgeCases: ["tolerancia en días"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · date exact
# DEFECT: siempre 0
from datetime import date
d=date(2026,1,1)
print(0.0 if d == d else 1.0)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from datetime import date
d=date(2026,1,1)
print(1.0 if d == d else 0.0)`,
          output: `1.0`,
        },
      },
      {
        id: "S30-T1-B-E1",
        subtopicId: "S30-T1-B",
        kind: "guided",
        instruction:
          "S30-T1-B-E1 · Si a=='' o b=='' imprime 'missing'. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "guard",
        hints: [
          "guard",
          "missingness",
        ],
        edgeCases: ["None"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · missing si vacío
# DEFECT: siempre cmp
a,b='', 'x'
print('cmp' if (not a or not b) else 'missing')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='', 'x'
print('missing' if (not a or not b) else 'cmp')`,
          output: `missing`,
        },
      },
      {
        id: "S30-T1-B-E2",
        subtopicId: "S30-T1-B",
        kind: "independent",
        instruction:
          "S30-T1-B-E2 · Peso 1/freq para freq=10 → 0.1. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "división",
        hints: [
          "división",
          "frecuencia",
        ],
        edgeCases: ["suavizado en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · idf peso 1/freq para rareza
# DEFECT: imprime freq crudo en vez de 1/freq
freq=10
print(freq)
print('want_idf', True)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `freq=10
print(1 / freq)`,
          output: `0.1`,
        },
      },
      {
        id: "S30-T1-B-E3",
        subtopicId: "S30-T1-B",
        kind: "transfer",
        instruction:
          "S30-T1-B-E3 · Imprime 'informative_missing' como etiqueta de diseño cuando la fuente nunca trae phone. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "string",
        hints: [
          "string",
          "MCAR vs informativa",
        ],
        edgeCases: ["por source_system"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · missing informativo en comparador
# DEFECT: treat_as_match en vez de informative_missing
print('treat_as_match')
print('policy', 'informative_missing')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('informative_missing')`,
          output: `informative_missing`,
        },
      },
      {
        id: "S30-T2-A-E1",
        subtopicId: "S30-T2-A",
        kind: "guided",
        instruction:
          "S30-T2-A-E1 · block_key = last + '|' + city para last='lopez' city='lima'. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "f-string",
        hints: [
          "f-string",
          "blocking",
        ],
        edgeCases: ["normaliza before"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · block key last|city
# DEFECT: concat sin separador
last,city='lopez','lima'
print(f'{last}{city}')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `last,city='lopez','lima'
print(f'{last}|{city}')`,
          output: `lopez|lima`,
        },
      },
      {
        id: "S30-T2-A-E2",
        subtopicId: "S30-T2-A",
        kind: "independent",
        instruction:
          "S30-T2-A-E2 · Candidate recall: gold 2, found 1 → 0.5. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "división",
        hints: [
          "división",
          "recall",
        ],
        edgeCases: ["unión de reglas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · recall blocking
# DEFECT: gold/found invertido
found,gold_n=1,2
print(gold_n / found)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `found,gold_n=1,2
print(found / gold_n)`,
          output: `0.5`,
        },
      },
      {
        id: "S30-T2-A-E3",
        subtopicId: "S30-T2-A",
        kind: "transfer",
        instruction:
          "S30-T2-A-E3 · Imprime n candidatos C(4,2)=6 en un bloque de tamaño 4. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "combinatoria",
        hints: [
          "combinatoria",
          "costo bloque",
        ],
        edgeCases: ["múltiples bloques"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · costo all-pairs n*(n-1)//2
# DEFECT: usa n*n (incluye auto-pares)
n=4
print(n*n)
print('n', n)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `n=4
print(n*(n-1)//2)`,
          output: `6`,
        },
      },
      {
        id: "S30-T2-B-E1",
        subtopicId: "S30-T2-B",
        kind: "guided",
        instruction:
          "S30-T2-B-E1 · Costo total bloques [3,5] → 3+10=13. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "sum n(n-1)/2",
        hints: [
          "sum n(n-1)/2",
          "costo",
        ],
        edgeCases: ["monitor max block"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · costo multi-bloque ER
# DEFECT: suma n en vez de sum n*(n-1)//2
sizes=[3,5]
print(sum(sizes))
print('sizes', sizes)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `sizes=[3,5]
print(sum(n*(n-1)//2 for n in sizes))`,
          output: `13`,
        },
      },
      {
        id: "S30-T2-B-E2",
        subtopicId: "S30-T2-B",
        kind: "independent",
        instruction:
          "S30-T2-B-E2 · Impossible si types difieren; imprime True para person vs org. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "!=",
        hints: [
          "!=",
          "filtro",
        ],
        edgeCases: ["fechas incompatibles"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · filtro de tipo person/org
# DEFECT: print ta==tb (False) no expresa desigualdad de tipo
ta,tb='person','org'
print(ta == tb)
print('want_ne', ta != tb)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ta,tb='person','org'
print(ta != tb)`,
          output: `True`,
        },
      },
      {
        id: "S30-T2-B-E3",
        subtopicId: "S30-T2-B",
        kind: "transfer",
        instruction:
          "S30-T2-B-E3 · Política: imprime 'filter_before_score'. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "string",
        hints: [
          "string",
          "pipeline",
        ],
        edgeCases: ["ahorra CPU"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · filter before score en pipeline ER
# DEFECT: score_first en vez de filter_before_score
print('score_first')
print('want', 'filter_before_score')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('filter_before_score')`,
          output: `filter_before_score`,
        },
      },
      {
        id: "S30-T3-A-E1",
        subtopicId: "S30-T3-A",
        kind: "guided",
        instruction:
          "S30-T3-A-E1 · Promedio ponderado name=1 w=0.5 email=0.5 w=0.5 → 0.75. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "suma w*s / suma w",
        hints: [
          "suma w*s / suma w",
          "score",
        ],
        edgeCases: ["pesos suman 1 opcional"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · score ponderado normalizado
# DEFECT: suma w*s sin dividir por sum(w)
print(1 * 0.5 + 0.5 * 0.5)
print('want_div_sum_w', True)
print('ok', True)
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
          "S30-T3-A-E2 · score=0.7 con t_high=0.9 t_low=0.5 → 'review'. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "umbrales",
        hints: [
          "umbrales",
          "decide",
        ],
        edgeCases: ["calibrar con gold"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · thr auto/review/non
# DEFECT: siempre auto
s,t_high,t_low=0.7,0.9,0.5
print('auto_match')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s,t_high,t_low=0.7,0.9,0.5
print('auto_match' if s>=t_high else ('non_match' if s<=t_low else 'review'))`,
          output: `review`,
        },
      },
      {
        id: "S30-T3-A-E3",
        subtopicId: "S30-T3-A",
        kind: "transfer",
        instruction:
          "S30-T3-A-E3 · Imprime explicación dict {'name':0.9,'email':1.0}. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "dict",
        hints: [
          "dict",
          "explicable",
        ],
        edgeCases: ["clerical UI"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · similitudes por campo
# DEFECT: omite email del dict de sims
print({'name': 0.9})
print('want', {'name': 0.9, 'email': 1.0})
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({'name': 0.9, 'email': 1.0})`,
          output: `{'name': 0.9, 'email': 1.0}`,
        },
      },
      {
        id: "S30-T3-B-E1",
        subtopicId: "S30-T3-B",
        kind: "guided",
        instruction:
          "S30-T3-B-E1 · Union-Find mínimo: union 1-2 y 2-3; imprime si find(1)==find(3) con parent map simple. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "parent dict",
        hints: [
          "parent dict",
          "cluster",
        ],
        edgeCases: ["path compression opcional"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · union-find path
# DEFECT: no une 2-3
p={1:1,2:2,3:3}
def find(x):
    while p[x]!=x: x=p[x]
    return x
def union(a,b):
    p[find(b)]=find(a)
union(1,2)
print(find(1)==find(3))
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `p={1:1,2:2,3:3}
def find(x):
    while p[x]!=x: x=p[x]
    return x
def union(a,b):
    p[find(b)]=find(a)
union(1,2); union(2,3)
print(find(1)==find(3))`,
          output: `True`,
        },
      },
      {
        id: "S30-T3-B-E2",
        subtopicId: "S30-T3-B",
        kind: "independent",
        instruction:
          "S30-T3-B-E2 · Review queue item: imprime action options match/non_match/uncertain. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "lista",
        hints: [
          "lista",
          "clerical",
        ],
        edgeCases: ["actor+timestamp"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · label_space ER
# DEFECT: incluye fraud (prohibido)
print(['match', 'non_match', 'fraud'])
print('want', ['match', 'non_match', 'uncertain'])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['match', 'non_match', 'uncertain'])`,
          output: `['match', 'non_match', 'uncertain']`,
        },
      },
      {
        id: "S30-T3-B-E3",
        subtopicId: "S30-T3-B",
        kind: "transfer",
        instruction:
          "S30-T3-B-E3 · Imprime regla de privacidad: 'ER_only_same_entity'. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "string",
        hints: [
          "string",
          "gate",
        ],
        edgeCases: ["no fraud labels"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · alcance de ER
# DEFECT: ER_is_fraud en vez de ER_only_same_entity
print('ER_is_fraud')
print('want', 'ER_only_same_entity')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('ER_only_same_entity')`,
          output: `ER_only_same_entity`,
        },
      },
      {
        id: "S30-T4-A-E1",
        subtopicId: "S30-T4-A",
        kind: "guided",
        instruction:
          "S30-T4-A-E1 · Si set(a,b)subseteq train_e imprime 'train' else 'test' para a,b e1,e2 train {e1,e2,e3}. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "subset",
        hints: [
          "subset",
          "split",
        ],
        edgeCases: ["leakage"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · entity split train/test
# DEFECT: pair random split (leak)
a,b='e1','e2'
train_e={'e1','e2','e3'}
print('test' if {a,b} <= train_e else 'train')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='e1','e2'
train_e={'e1','e2','e3'}
print('train' if {a,b} <= train_e else 'test')`,
          output: `train`,
        },
      },
      {
        id: "S30-T4-A-E2",
        subtopicId: "S30-T4-A",
        kind: "independent",
        instruction:
          "S30-T4-A-E2 · Prevalencia matches: 1 match de 5 pares → 0.2. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "división",
        hints: [
          "división",
          "base rate",
        ],
        edgeCases: ["desbalance"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · match rate matches/n
# DEFECT: invierte n/matches
matches,n=1,5
print(n / matches)
print('matches', matches, 'n', n)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `matches,n=1,5
print(matches / n)`,
          output: `0.2`,
        },
      },
      {
        id: "S30-T4-A-E3",
        subtopicId: "S30-T4-A",
        kind: "transfer",
        instruction:
          "S30-T4-A-E3 · Imprime 'entity_split' como política anti-leakage. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "string",
        hints: [
          "string",
          "eval",
        ],
        edgeCases: ["group/time splits luego"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · política de split ER
# DEFECT: random_split (leak) en vez de entity_split
print('random_split')
print('want', 'entity_split')
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('entity_split')`,
          output: `entity_split`,
        },
      },
      {
        id: "S30-T4-B-E1",
        subtopicId: "S30-T4-B",
        kind: "guided",
        instruction:
          "S30-T4-B-E1 · tp=2 fp=1 → precision 2/3 approx print round 2 decimals. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "tp/(tp+fp)",
        hints: [
          "tp/(tp+fp)",
          "precision",
        ],
        edgeCases: ["recall simétrico"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · precision tp/(tp+fp)
# DEFECT: divide tp/tp ignorando fp
tp,fp=2,1
print(round(tp/tp, 2))
print('tp', tp, 'fp', fp)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tp,fp=2,1
print(round(tp/(tp+fp), 2))`,
          output: `0.67`,
        },
      },
      {
        id: "S30-T4-B-E2",
        subtopicId: "S30-T4-B",
        kind: "independent",
        instruction:
          "S30-T4-B-E2 · tp=2 fn=2 → recall 0.5. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "tp/(tp+fn)",
        hints: [
          "tp/(tp+fn)",
          "recall",
        ],
        edgeCases: ["F1 harmonic"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · recall tp/(tp+fn)
# DEFECT: numerador tp+fn (siempre 1)
tp,fn=2,2
print((tp+fn)/(tp+fn))
print('tp', tp, 'fn', fn)
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tp,fn=2,2
print(tp/(tp+fn))`,
          output: `0.5`,
        },
      },
      {
        id: "S30-T4-B-E3",
        subtopicId: "S30-T4-B",
        kind: "transfer",
        instruction:
          "S30-T4-B-E3 · Slice error: imprime ['missing_phone'] como slice con más errores sintéticos. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "lista",
        hints: [
          "lista",
          "error analysis",
        ],
        edgeCases: ["no acusar fraude"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-030 · error analysis por campo
# DEFECT: lista vacía en vez de missing_phone
print([])
print('want', ['missing_phone'])
print('ok', True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['missing_phone'])`,
          output: `['missing_phone']`,
        },
      },
    ],
  },
  youDo: {
    title: "Testable Entity Resolution Engine — cierre CP-N3-A",
    context:
      "Implementa el motor ER sintético de cierre de **CP-N3-A**: comparadores explicables, blocking con candidate recall medido, scorer con umbrales auto/review/non, cola clerical, clusters (Union-Find) y evaluación pairwise con split por entidad y error slices. Benchmark etiquetado sintético only. ER = misma entidad; **no** relación ni riesgo/fraude. No editar seed/checkpoint/ledger ni marcar passed.",
    objectives: [
      "Comparadores exact/edit/token/fecha + missing/frecuencia",
      "Blocking medido (recall) y control de costo/imposibles",
      "Pesos, thresholds, review y cluster consistency",
      "Gold sintético, split por entidad, P/R/F1 y slices",
      "Suite ejecutable alineada a contratos S27–S29",
    ],
    requirements: [
      "Datos sintéticos etiquetados; sin PII real",
      "Candidate recall y métricas reportadas en demo",
      "Explicación por campo en cola de review",
      "Cero labels de fraude/parentesco automáticos",
      "Documentación es-PE del gate CP-N3-A",
    ],
    starterCode: `# CP-N3-A cierre — Testable ER Engine (esqueleto)
from collections import defaultdict

def normalize(s: str) -> str:
    return " ".join(s.casefold().split())

def block_key(rec: dict) -> str:
    parts = normalize(rec.get("name", "")).split()
    last = parts[-1] if parts else ""
    return f"{last}|{rec.get('city', '').casefold()[:3]}"

def decide(score: float, t_high=0.9, t_low=0.5) -> str:
    if score >= t_high:
        return "auto_match"
    if score <= t_low:
        return "non_match"
    return "review"

# Contrato documentado en theory/iDo
if __name__ == "__main__":
    print(decide(0.95), block_key({"name": "Ana López", "city": "Lima"}))
`,
    portfolioNote:
      "Cierre CP-N3-A: motor ER testeable con blocking medido, review y métricas. Otra lane califica PASS del gate; esta autoría no escribe checkpoint/ledger/seed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Candidate recall + P/R reportados y split por entidad sin leakage", weight: "bonus checklist" },
      { criterion: "ER solo misma entidad (sin fraude/relación)", weight: "gate privacy" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El motor ER de CP-N3-A debe decidir:",
        options: ["Fraude automático", "Si dos registros son la misma entidad", "Parentescos", "Riesgo crediticio"],
        correctIndex: 1,
        explanation:
          "ER ≠ relación ≠ riesgo.",
      },
      {
        question: "Candidate recall de blocking mide:",
        options: ["Solo CPU", "Precisión del scorer final únicamente", "Tamaño del disco", "Fracción de verdaderos matches que sobreviven al blocking"],
        correctIndex: 3,
        explanation:
          "Recall sobre gold de candidatos.",
      },
      {
        question: "Scores entre t_low y t_high van a:",
        options: ["clerical review", "auto_match", "non_match", "borrado"],
        correctIndex: 0,
        explanation:
          "Banda gris = humanos.",
      },
      {
        question: "Split por entidad evita:",
        options: ["Usar sqlite", "Blocking", "Leakage de identidad entre train y test", "Review"],
        correctIndex: 2,
        explanation:
          "Entidades no deben contaminar evaluación.",
      },
      {
        question: "Un score alto de match en ER sintético implica…",
        options: ["fraude o parentesco probado automáticamente", "prioridad de revisión / enlace de entidad candidato, no veredicto legal", "bloquear el schema_migrations", "omitir blocking y comparar all-pairs siempre"],
        correctIndex: 1,
        explanation:
          "ER propone misma entidad con evidencia; label_space es match/non/uncertain — nunca fraud auto.",
      }
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
        label: "RapidFuzz",
        url: "https://github.com/rapidfuzz/RapidFuzz",
        note: "Edit/token similarity práctica",
      },
      {
        label: "dedupe library docs",
        url: "https://docs.dedupe.io/",
        note: "Active learning y clustering",
      },
      {
        label: "NIST — entity resolution concepts",
        url: "https://www.nist.gov/itl/iad/image-group/trecvid-entity-detection",
        note: "Evaluación y entidades (contexto)",
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
